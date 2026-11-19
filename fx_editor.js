/* =====================================================================
   TOTEM LEGEND — in-game skill effect editor (owner 2026-11-19: "make me a tuner so I can set each skill myself")
   Menu ✨ (F) opens a panel on the right. Per hero, per skill: a list of pieces
     picture pieces: ground (flat on the floor) · stand (upright, bottom on the floor) · streak (aimed along the attack) · spark (hit spark)
     swing: the wolf's painted slash that follows the axe head (only where the hero file offers window._wPSlash)
     code bits: ring (shock ring) · debris · dust · shake (screen shake / flash)
   Each piece fires at: skill start · contact (the action's windup = the hit frame) · every enemy hit · action end, + a time offset.
   "ปิดเอฟเฟคเดิม" turns the hero's own painted effects off for that skill (hero files check FXED.off(key); wolf now).
   Saved in localStorage af_fxcfg; 📋 exports JSON → Claude bakes it into fx_cfg.js (FXCFG_BAKED) for every player.
   ===================================================================== */
(function(){
const LS='af_fxcfg',DEG=Math.PI/180;
const c01=v=>v<0?0:v>1?1:v,eo=k=>1-Math.pow(1-k,3),back=k=>{const c=1.6;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
let LOCAL={};try{LOCAL=JSON.parse(localStorage.getItem(LS)||'{}')||{};}catch(e){LOCAL={};}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(LOCAL));}catch(e){}};
const H=()=>(typeof CHAR!=='undefined'?CHAR:'wolf');
function sk(k,h=H()){if(!k)return null;const L=LOCAL[h]&&LOCAL[h][k];if(L)return L;const B=window.FXCFG_BAKED&&FXCFG_BAKED[h]&&FXCFG_BAKED[h][k];return B||null;}
function edit(k,h=H()){LOCAL[h]=LOCAL[h]||{};if(!LOCAL[h][k]){const B=sk(k,h);LOCAL[h][k]=B?JSON.parse(JSON.stringify(B)):{off:false,trail:true,pieces:[]};}return LOCAL[h][k];}

/* ---------- picture cache ---------- */
const IM={};function im(n){let o=IM[n];if(!o){o=IM[n]={i:new Image(),ok:0};o.i.onload=()=>{o.ok=o.i.naturalWidth>0;};o.i.src='assets/fx/'+n+'.webp';}return o.ok?o.i:null;}
const aim=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));

/* ---------- the picture piece ---------- */
class EPiece{constructor(p,o){Object.assign(this,o);this.p=p;this.t=-(o.delay||0);this.life=Math.max(.05,p.life);
    const L=p.layer&&p.layer!=='auto'?p.layer:(p.type==='ground'?'ground':p.type==='stand'?'sorted':'top');this.layer=L;im(p.pic);}
  get sy(){return this.y+6;}
  update(dt){this.t+=dt;if(this.t<0)return true;const p=this.p;
    if(this.fol){this.x=this.fol.x+this.ox;this.y=this.fol.y+this.oy;}
    if(p.speed){this.ox+=Math.cos(this.phi)*p.speed*dt;this.oy+=Math.sin(this.phi)*p.speed*dt;if(!this.fol){this.x+=Math.cos(this.phi)*p.speed*dt;this.y+=Math.sin(this.phi)*p.speed*dt;}}
    return this.t<this.life;}
  draw(){if(this.t<0)return;const p=this.p,i=im(p.pic);if(!i)return;const t=this.t,k=t/this.life;
    let a=(p.alpha??1)*(p.fin>0?c01(t/p.fin):1)*(p.fout>0?c01((this.life-t)/p.fout):1);if(a<.01)return;
    const pop=p.pop||0,pk=pop>0?c01(t/(.08+.25*pop)):1,s=(pop>0?(1-pop*.6)+pop*.6*back(pk):1)*(1+(p.grow||0)*eo(k)),w=p.w*s,h=w*i.naturalHeight/i.naturalWidth;
    const [x,y]=P(this.x,this.y,p.type==='ground'?0:(p.z||0));
    ctx.save();ctx.translate(x,y);
    const left=Math.cos(this.phi)<0;let r=(p.rot||0)*DEG+(p.spin||0)*DEG*t;
    if(p.type==='streak'){if(p.turn!==false){r+=aim(this.phi);if(left)ctx.rotate(0);}}
    ctx.rotate(r);
    let fx=p.flip?-1:1,fy=1;if(p.turn!==false){if(p.type==='streak'){if(left)fy=-1;}else if(left)fx*=-1;}
    ctx.scale(fx,fy*(p.type==='ground'?(p.flat??1):1));
    const ax=p.type==='stand'?.5:.5,ay=p.type==='stand'?.95:.5,X=-w*ax,Y=-h*ay;
    const rv=p.reveal||'none',rt=c01(t/Math.max(.02,p.revealT??.15));
    if(rv!=='none'&&rt<1){ctx.beginPath();const e=eo(rt);if(rv==='wipe')ctx.rect(X-2,Y-h,w*e+4,h*3);else if(rv==='rise')ctx.rect(X-w,Y+h*(1-e)-2,w*3,h*e+h+4);else ctx.ellipse(X+w/2,Y+h/2,w*.62*e+2,h*.62*e+2,0,0,Math.PI*2);ctx.clip();}
    ctx.globalAlpha=a;ctx.drawImage(i,X,Y,w,h);
    if(p.glow>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*p.glow;ctx.drawImage(i,X,Y,w,h);}
    if(p.flash!==false&&t<.08){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-t/.08)*.8;ctx.drawImage(i,X,Y,w,h);}
    ctx.restore();ctx.globalAlpha=1;}}

/* ---------- spawn one piece ---------- */
function spot(p,C){let bx=player.x,by=player.y,fol=null;
  if(p.at==='target'&&C.target){bx=C.target.x;by=C.target.y;fol=p.follow?C.target:null;}
  else if(p.at==='ground'&&C.gx!=null){bx=C.gx;by=C.gy;}
  else fol=p.follow?player:null;
  const ph=C.phi,f=p.fwd||0,sd=p.side||0,ox=Math.cos(ph)*f-Math.sin(ph)*sd,oy=Math.sin(ph)*f+Math.cos(ph)*sd;return {x:bx+ox,y:by+oy,ox,oy,fol};}
function spawn(p,C){if(p.hide)return;const V=window.V25,s=spot(p,C);
  try{
  if(p.type==='ground'||p.type==='stand'||p.type==='streak'||p.type==='spark'){if(!p.pic)return;const e=new EPiece(p,{x:s.x,y:s.y,ox:s.ox,oy:s.oy,fol:s.fol,phi:C.phi});e._v2=1;addFx(e);}
  else if(p.type==='ring'&&V)V.add(new V.Shock({x:s.x,y:s.y,R:p.R||100,r0:8,col:p.col||'#ffffff',w:p.thick||10,life:p.life||.4}));
  else if(p.type==='debris'&&V)V.add(new V.Debris({x:s.x,y:s.y,n:p.n||6,kind:p.kind||'shard',col:p.col||'#ffffff',col2:'#ffffff',v0:(p.speed||200)*.4,v1:p.speed||200,up:p.up??220,z:p.z||20,life:p.life||.8,dir:p.aimed?C.phi:null,spread:p.aimed?.8:Math.PI}));
  else if(p.type==='dust'&&V)V.add(new V.Puffs({x:s.x,y:s.y,R:p.R||60,n:p.n||5,size:p.size||14,life:p.life||.7}));
  else if(p.type==='shake'){if(p.power>0&&typeof shake==='function')shake(p.power);if(p.stop>0&&typeof stop==='function')stop(p.stop);if(p.fl>0&&typeof flash!=='undefined'){flash.a=Math.max(flash.a,p.fl);flash.c=p.col||'#ffffff';}}
  }catch(e){console.error('fx editor',e);}}
const later=(sec,fn)=>{if(sec<=.001)fn();else if(typeof setFxTimer==='function')setFxTimer(sec,fn);else setTimeout(fn,sec*1000);};

/* ---------- hooks: skill actions + hits ---------- */
function ctxOf(c){c=c||{};const t=(c.target&&!c.target.dead)?c.target:null;return {target:t,gx:c.gx,gy:c.gy};}
function attach(a,k,c){const S=sk(k);if(!a||!a.events||!S)return a;
  if(S.trail===false){a.trailWin=null;a.trail=null;}
  const T=()=>(typeof ACTION_TEMPO!=='undefined'?ACTION_TEMPO:1),base={start:0,contact:a.windup||0,end:a.dur||a.windup||0};
  for(const p of S.pieces||[]){if(p.type==='swing'||p.when==='hit'||p.hide)continue;const tt=(base[p.when||'contact']||0)+(p.dt||0),C=ctxOf(c);
    const go=()=>{C.phi=player.phi;if(C.target&&p.at==='target')C.phi=Math.atan2(C.target.y-player.y,C.target.x-player.x);spawn(p,C);};
    const lim=Math.max(0,(a.dur||0)-.01);if(tt<=lim)a.events.push({t:Math.max(0,tt),f:go});else a.events.push({t:lim,f:()=>later((tt-lim)/T(),go)});}
  return a;}
function wrapAll(){if(typeof SKILLS==='undefined')return;
  for(const k in SKILLS){const s=SKILLS[k];if(!s||!s.make||s._fxe)continue;const mk=s.make;s._fxe=1;s.make=function(c){return attach(mk.apply(this,arguments),k,c);};}
  if(H()==='wolf'&&typeof mkBasic==='function'&&!mkBasic._fxe){const mb=mkBasic;mkBasic=function(t){return attach(mb.apply(this,arguments),'basic',{target:t});};mkBasic._fxe=1;}
  if(typeof hurt==='function'&&!hurt._fxe){const h0=hurt,last={};hurt=function(e,mult,o){const dead=e&&e.dead,r=h0.apply(this,arguments);
      try{if(e&&!dead&&r&&!(o&&o.dot)){const k=(o&&o.skill)||(o&&o.auto?'basic':null)||window.SKCTX||(player.action&&player.action.key)||null,S=sk(k);
        if(S)for(const p of S.pieces||[]){if(p.when!=='hit'||p.hide||p.type==='swing')continue;const id=k+(S.pieces.indexOf(p));if(gameTime-(last[id]||-9)<.03)continue;last[id]=gameTime;
          const C={target:e,phi:Math.atan2(e.y-player.y,e.x-player.x)},q=Object.assign({},p,{at:p.at==='hero'?'hero':'target'});later((p.dt||0)/((typeof ACTION_TEMPO!=='undefined')?ACTION_TEMPO:1),()=>spawn(q,C));}}}catch(_){}
      return r;};hurt._fxe=1;}}

/* ---------- defaults per piece type ---------- */
const PICT=['ground','stand','streak','spark'];
function newPiece(type){const L=(window.FX_PICS||{})[H()]||(window.FX_PICS||{}).wolf||[],pic=H()+'/'+(L[0]||'');
  const b={type,when:'contact',dt:0,at:'hero',fwd:40,side:0,z:0};
  if(PICT.includes(type))return Object.assign(b,{pic,w:type==='spark'?70:type==='ground'?160:120,life:type==='spark'?.25:.5,rot:0,alpha:1,pop:.4,grow:0,fin:.03,fout:.25,speed:0,spin:0,glow:0,flat:1,turn:true,flip:false,follow:false,flash:true,reveal:'none',revealT:.15,layer:'auto',z:type==='streak'||type==='spark'?28:0,at:type==='spark'?'target':'hero',when:type==='spark'?'hit':'contact',fwd:type==='spark'?0:40});
  if(type==='swing')return {type,art:'axe',size:1,rot:0,fade:.2,alpha:1};
  if(type==='ring')return Object.assign(b,{R:110,thick:10,life:.4,col:'#ffffff'});
  if(type==='debris')return Object.assign(b,{n:6,kind:'shard',col:'#d8f4ff',speed:200,up:220,life:.8,z:20,aimed:true});
  if(type==='dust')return Object.assign(b,{R:60,n:5,size:14,life:.7});
  if(type==='shake')return Object.assign(b,{power:2,stop:0,fl:0,col:'#ffffff'});
  return b;}

/* ---------- UI ---------- */
const TYPES=[['ground','รูปบนพื้น'],['stand','รูปตั้ง'],['streak','รูปพุ่ง/ฟัน'],['spark','รูปตอนโดน'],['swing','ฟันตามมือ'],['ring','วงกระแทก'],['debris','เศษกระเด็น'],['dust','ฝุ่น'],['shake','สั่นจอ/แฟลช']];
const TN=Object.fromEntries(TYPES);
const WHEN=[['start','เริ่มสกิล'],['contact','จังหวะฟันโดน'],['hit','ทุกครั้งที่โดนศัตรู'],['end','จบท่า']];
const AT=[['hero','ที่ตัวเรา'],['target','ที่ศัตรู'],['ground','จุดที่เลือก (สกิลวางพื้น)']];
const SL={dt:['เวลา (วินาที, ± จากจังหวะ)',-.5,1.5,.01],fwd:['หน้า (+) / หลัง (−)',-250,350,1],side:['ซ้าย / ขวา',-250,250,1],z:['ความสูงจากพื้น',-60,220,1],
  w:['ขนาด',10,700,1],life:['อยู่นาน (วินาที)',.05,3,.01],rot:['เอียง (องศา)',-180,180,1],alpha:['ความชัด',0,1,.01],pop:['เด้งตอนโผล่',0,1,.01],grow:['ขยายระหว่างอยู่',-.5,1.5,.01],
  fin:['ค่อยๆ โผล่ (วินาที)',0,1,.01],fout:['ค่อยๆ จาง (วินาที)',0,2,.01],speed:['พุ่งไปข้างหน้า (ความเร็ว)',-600,1400,10],spin:['หมุน (องศา/วินาที)',-720,720,10],glow:['เรืองแสง',0,1,.01],flat:['แบนกับพื้น',.3,1.5,.01],
  revealT:['เวลาเผยภาพ',.02,1,.01],size:['ขนาด',.3,3,.01],fade:['จางหาย (วินาที)',.05,1,.01],R:['รัศมี',10,450,1],thick:['ความหนา',1,40,1],n:['จำนวน',1,30,1],up:['กระเด็นขึ้น',0,700,10],
  power:['แรงสั่น',0,10,.1],stop:['หยุดภาพ (มิลลิวินาที)',0,200,5],fl:['แฟลชจอ',0,1,.01]};
const FIELDS={ground:['dt','fwd','side','w','life','rot','alpha','pop','grow','fin','fout','speed','spin','glow','flat','revealT'],stand:['dt','fwd','side','z','w','life','rot','alpha','pop','grow','fin','fout','speed','spin','glow','revealT'],
  streak:['dt','fwd','side','z','w','life','rot','alpha','pop','grow','fin','fout','speed','spin','glow','revealT'],spark:['dt','fwd','side','z','w','life','rot','alpha','pop','grow','fin','fout','spin','glow'],
  swing:['size','rot','fade','alpha'],ring:['dt','fwd','side','R','thick','life'],debris:['dt','fwd','side','z','n','speed','up','life'],dust:['dt','fwd','side','R','n','life'],shake:['dt','power','stop','fl']};
let el=null,cur=null,sel=0,folder=null,auto=false,autoT=null,replayT=null;
const css=`#fxed{position:fixed;right:0;top:0;bottom:0;width:min(420px,48vw);background:rgba(22,16,34,.94);color:#f3ecff;font:12px/1.3 system-ui,sans-serif;z-index:99999;overflow-y:auto;padding:8px 10px 40px;box-sizing:border-box;border-left:2px solid #6a52a8;touch-action:pan-y}
#fxed h3{margin:4px 0 6px;font-size:14px;color:#ffd36a}#fxed select,#fxed input[type=text],#fxed textarea{background:#2d2344;color:#fff;border:1px solid #6a52a8;border-radius:6px;padding:3px 4px;font-size:12px;max-width:100%}
#fxed button{background:#4a3a78;color:#fff;border:1px solid #8a72d8;border-radius:7px;padding:4px 8px;margin:2px;font-size:12px}#fxed button.on{background:#c98a1a;border-color:#ffd36a}
#fxed .row{display:flex;align-items:center;gap:6px;margin:3px 0}#fxed .row label{flex:0 0 118px;color:#cfc2ee}#fxed .row input[type=range]{flex:1;min-width:60px}#fxed .row .v{flex:0 0 42px;text-align:right;color:#ffd36a}
#fxed .chips button{font-size:11px;padding:3px 6px}#fxed .pics{display:flex;flex-wrap:wrap;gap:3px;max-height:150px;overflow-y:auto;background:#1a1328;padding:3px;border-radius:6px}
#fxed .pics img{width:46px;height:46px;object-fit:contain;background:#3a3050;border:2px solid transparent;border-radius:5px}#fxed .pics img.on{border-color:#ffd36a}
#fxed .note{color:#a898c8;font-size:11px;margin:2px 0}#fxed .box{border:1px solid #4a3a78;border-radius:8px;padding:6px;margin:6px 0}#fxed .x{float:right}`;
function skills(){const o=[];if(H()==='wolf'&&typeof mkBasic==='function')o.push(['basic','โจมตีปกติ']);if(typeof SKILLS!=='undefined')for(const k in SKILLS){const s=SKILLS[k];if(s&&s.make&&!s.passive)o.push([k,s.name||k]);}return o;}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function opt(list,v){return list.map(([k,n])=>`<option value="${k}"${k===v?' selected':''}>${esc(n)}</option>`).join('');}
function render(){if(!el)return;const L=skills();if(!cur||!L.some(s=>s[0]===cur))cur=L[0]&&L[0][0];const S=sk(cur)||{off:false,trail:true,pieces:[]},P=S.pieces||[];if(sel>=P.length)sel=P.length-1;
  const p=P[sel],hasSwing=!!window._wPSlash,offOK=H()==='wolf';
  let h=`<button class="x" data-a="close">✕ ปิด</button><h3>✨ ปรับเอฟเฟคสกิล · ${esc(H())}</h3>
  <div class="row"><select data-a="skill" style="flex:1">${opt(L,cur)}</select></div>
  <div class="row"><button data-a="play">▶ เล่น</button><button data-a="auto" class="${auto?'on':''}">🔁 เล่นวน</button><button data-a="slow" class="${(typeof timeScale!=='undefined'&&timeScale!==1)?'on':''}">🐢 ช้า ×0.25</button></div>
  <div class="row"><label><input type="checkbox" data-a="off" ${S.off?'checked':''}> ปิดเอฟเฟคเดิม</label><label><input type="checkbox" data-a="trail" ${S.trail!==false?'checked':''}> เส้นตามอาวุธ</label></div>
  ${offOK?'':'<div class="note">ปิดเอฟเฟคเดิมได้เฉพาะหมาป่าตอนนี้ ตัวอื่นจะเพิ่มชิ้นทับของเดิม</div>'}
  <div class="chips">${P.map((q,i)=>`<button data-a="pick" data-i="${i}" class="${i===sel?'on':''}">${i+1}. ${esc(TN[q.type]||q.type)}${q.hide?' (ซ่อน)':''}</button>`).join('')}</div>
  <div class="row"><select data-a="newtype">${opt(TYPES.filter(t=>t[0]!=='swing'||hasSwing),'ground')}</select><button data-a="add">＋ เพิ่มชิ้น</button></div>`;
  if(p){h+=`<div class="box"><div class="row"><b style="flex:1">ชิ้นที่ ${sel+1}: ${esc(TN[p.type])}</b><button data-a="hide">${p.hide?'👁 แสดง':'🙈 ซ่อน'}</button><button data-a="dup">⧉ ทำซ้ำ</button><button data-a="del">🗑 ลบ</button></div>`;
    if(p.type==='swing')h+=`<div class="row"><label>รูปฟัน</label><select data-f="art">${opt([['axe','ขวานแดง'],['frost','น้ำแข็ง']],p.art)}</select></div><div class="note">ฟันตามมือ = รูปฟันโค้งตามหัวขวานจริงทุกครั้งที่ท่านี้เหวี่ยง</div>`;
    else{h+=`<div class="row"><label>เกิดตอน</label><select data-f="when">${opt(WHEN,p.when)}</select></div>`;
      if(p.type!=='shake')h+=`<div class="row"><label>เกิดที่</label><select data-f="at">${opt(AT,p.at)}</select></div>`;}
    if(PICT.includes(p.type)){const F=window.FX_PICS||{},fd=folder||(p.pic||'').split('/')[0]||H();
      h+=`<div class="row"><label>รูปจากโฟลเดอร์</label><select data-a="folder">${opt(Object.keys(F).map(k=>[k,k]),fd)}</select></div><div class="pics">${(F[fd]||[]).map(n=>`<img src="assets/fx/${fd}/${n}.webp" title="${n}" data-a="pic" data-n="${fd}/${n}" class="${p.pic===fd+'/'+n?'on':''}">`).join('')}</div>
      <div class="row"><label>เผยภาพ</label><select data-f="reveal">${opt([['none','โผล่ทั้งรูป'],['wipe','ปาดจากซ้าย'],['open','ขยายจากกลาง'],['rise','โผล่จากล่าง']],p.reveal||'none')}</select><label style="flex:0 0 auto"><select data-f="layer">${opt([['auto','ชั้นอัตโนมัติ'],['ground','ใต้ตัว (พื้น)'],['sorted','ตามความลึก'],['top','บนสุด']],p.layer||'auto')}</select></label></div>
      <div class="row"><label><input type="checkbox" data-c="turn" ${p.turn!==false?'checked':''}> หันตามทิศ</label><label><input type="checkbox" data-c="flip" ${p.flip?'checked':''}> กลับด้าน</label><label><input type="checkbox" data-c="follow" ${p.follow?'checked':''}> ตามตัว</label><label><input type="checkbox" data-c="flash" ${p.flash!==false?'checked':''}> แฟลช</label></div>`;}
    if(p.type==='debris')h+=`<div class="row"><label>ชนิดเศษ</label><select data-f="kind">${opt([['shard','น้ำแข็ง/คริสตัล'],['rock','หิน'],['drop','หยดน้ำ/เลือด'],['zap','สายฟ้า'],['strand','เส้นลม'],['flame','ไฟ'],['petal','กลีบ']],p.kind)}</select><label><input type="checkbox" data-c="aimed" ${p.aimed?'checked':''}> ไปทางหน้า</label></div>`;
    if(['ring','debris','shake'].includes(p.type))h+=`<div class="row"><label>สี</label><input type="color" data-f="col" value="${p.col||'#ffffff'}"></div>`;
    for(const f of FIELDS[p.type]||[]){const [n,mn,mx,st]=SL[f];const v=p[f]??0;h+=`<div class="row"><label>${n}</label><input type="range" min="${mn}" max="${mx}" step="${st}" value="${v}" data-r="${f}"><span class="v" data-v="${f}">${v}</span></div>`;}
    h+='</div>';}
  else h+='<div class="note">ยังไม่มีชิ้น — เลือกชนิดแล้วกด ＋ เพิ่มชิ้น</div>';
  h+=`<div class="box"><div class="row"><button data-a="export">📋 คัดลอกค่าส่งให้ Claude</button><button data-a="import">📥 วางค่า</button><button data-a="reset">↺ ล้างสกิลนี้</button></div><textarea data-a="io" rows="3" style="width:100%;display:none" placeholder="วางค่าที่นี่ แล้วกด 📥 วางค่า อีกครั้ง"></textarea><div class="note">ค่าที่ปรับเก็บในเครื่องนี้ทันที กด 📋 แล้วส่งให้ Claude เพื่อให้ทุกคนเห็นเหมือนกัน</div></div>`;
  el.innerHTML=h;}
function changed(replay=true){save();if(replay&&auto){clearTimeout(replayT);replayT=setTimeout(play,350);}}
function play(){try{if(typeof endAction==='function'&&player.action)endAction();player.cd={};player.mp=player.maxMp;
  const t=(typeof nearestEnemy==='function'&&nearestEnemy(player.x,player.y,420))||null,phi=t?Math.atan2(t.y-player.y,t.x-player.x):player.phi,gx=t?t.x:player.x+Math.cos(phi)*160,gy=t?t.y:player.y+Math.sin(phi)*160;
  if(cur==='basic'){if(!t){msg&&msg('ไม่มีศัตรูใกล้ๆ');return;}player.basicIdx=0;player.basicLast=gameTime;startAction(mkBasic(t));}
  else if(typeof castSkillNow==='function')castSkillNow(cur,{target:t,phi,gx,gy,x:gx,y:gy});}catch(e){console.error('fx editor play',e);}}
function setAuto(on){auto=on;clearInterval(autoT);if(on){play();autoT=setInterval(play,2200);}}
function onClick(e){const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;const S=()=>edit(cur);
  if(a==='close')return toggle(false);if(a==='play')return play();if(a==='auto'){setAuto(!auto);return render();}
  if(a==='slow'){timeScale=timeScale===1?.25:1;return render();}
  if(a==='pick'){sel=+b.dataset.i;folder=null;return render();}
  if(a==='add'){const s=S(),ty=el.querySelector('[data-a=newtype]').value;s.pieces.push(newPiece(ty));if(H()==='wolf'&&s.pieces.length===1)s.off=true;sel=s.pieces.length-1;changed();return render();}
  if(a==='dup'){const s=S();s.pieces.splice(sel+1,0,JSON.parse(JSON.stringify(s.pieces[sel])));sel++;changed();return render();}
  if(a==='del'){const s=S();s.pieces.splice(sel,1);sel=Math.max(0,sel-1);changed();return render();}
  if(a==='hide'){const s=S();s.pieces[sel].hide=!s.pieces[sel].hide;changed();return render();}
  if(a==='pic'){const s=S();s.pieces[sel].pic=b.dataset.n;changed();return render();}
  if(a==='reset'){if(LOCAL[H()])delete LOCAL[H()][cur];sel=0;changed(false);return render();}
  if(a==='export'){const ta=el.querySelector('[data-a=io]'),txt=JSON.stringify({hero:H(),cfg:LOCAL[H()]||{}});ta.style.display='';ta.value=txt;ta.select();try{navigator.clipboard.writeText(txt);msg&&msg('คัดลอกแล้ว — วางส่งให้ Claude ได้เลย');}catch(_){}return;}
  if(a==='import'){const ta=el.querySelector('[data-a=io]');if(ta.style.display==='none'||!ta.value.trim()){ta.style.display='';ta.focus();return;}
    try{const j=JSON.parse(ta.value);const h=j.hero||H(),c=j.cfg||j;LOCAL[h]=Object.assign(LOCAL[h]||{},c);changed(false);render();msg&&msg('ใส่ค่าแล้ว');}catch(err){msg&&msg('ค่าที่วางอ่านไม่ได้');}return;}}
function onInput(e){const t=e.target,s=cur&&edit(cur),p=s&&s.pieces[sel];
  if(t.dataset.a==='skill'){cur=t.value;sel=0;folder=null;return render();}
  if(t.dataset.a==='folder'){folder=t.value;return render();}
  if(t.dataset.a==='off'){s.off=t.checked;return changed();}if(t.dataset.a==='trail'){s.trail=t.checked;return changed();}
  if(!p)return;
  if(t.dataset.r){p[t.dataset.r]=parseFloat(t.value);const v=el.querySelector(`[data-v="${t.dataset.r}"]`);if(v)v.textContent=t.value;return changed();}
  if(t.dataset.f){p[t.dataset.f]=t.value;changed();if(e.type==='change')render();return;}
  if(t.dataset.c){p[t.dataset.c]=t.checked;return changed();}}
function toggle(on){if(on===undefined)on=!el;if(on&&!el){wrapAll();if(!document.getElementById('fxedcss')){const st=document.createElement('style');st.id='fxedcss';st.textContent=css;document.head.appendChild(st);}
    el=document.createElement('div');el.id='fxed';document.body.appendChild(el);
    ['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','wheel','keydown'].forEach(ev=>el.addEventListener(ev,e=>e.stopPropagation()));
    el.addEventListener('click',onClick);el.addEventListener('input',onInput);el.addEventListener('change',onInput);
    if(!cur&&player&&player.action&&player.action.key)cur=player.action.key;render();window.CAM_OXP=el.offsetWidth/2;}
  else if(!on&&el){el.remove();el=null;setAuto(false);window.CAM_OXP=0;}
  const b=document.querySelector('[data-m=mgfx]');if(b)b.classList.toggle('on',!!el);}
window.FXED={toggle,sk,off:k=>{const S=sk(k);return !!(S&&S.off);},swing:k=>{const S=sk(k);return S&&S.off?(S.pieces||[]).find(p=>p.type==='swing'&&!p.hide)||null:null;},wrapAll,get local(){return LOCAL;}};
const boot=()=>{try{wrapAll();}catch(e){console.error(e);}};
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
try{if(/[?&]fxedit=1/.test(location.search))addEventListener('load',()=>setTimeout(()=>toggle(true),1200));}catch(_){}
})();
