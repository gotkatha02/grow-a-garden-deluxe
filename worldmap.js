/* =====================================================================
   WORLD MAP — poster style (like the classic Ragnarok world-map poster), all drawn in code.
   • Sea + continents with noisy coastlines, beaches, terrain colour and scattered scenery per region
   • Every map is a real thumbnail of that map (rendered from its own map host, cached in localStorage),
     packed in a grid on its region like poster tiles
   • Land bridges join the regions to the capital
   • Click a tile for details (level, monsters, exits); red pulsing frame = where you are;
     corner dot = suits your level (green) / dangerous (red) / too easy (grey)
   • Mouse wheel = zoom, drag = pan, double-click = reset.   Open with W or click the minimap name.
   Data comes from VK_MAPS / VK_MONS / MAP_ZONE / MAPDEF, so it stays correct when levels change.
   ===================================================================== */
(function(){
if(!window.VK_MAPS)return;
const NS='http://www.w3.org/2000/svg',VBW=1700,VBH=1260;
const REG={
  vik:{name:'ไวกิ้ง',town:'ฟรอสต์เฮล์ม',c:[700,252],rot:0,land:'#eef4fb',land2:'#cfdff0',deco:'pine',edge:'#7fa8d8',heroes:'Wolf · Rhino · Owl'},
  jpn:{name:'ญี่ปุ่น',town:'ฮาคุเซ็น',c:[1330,252],rot:0,land:'#cfe8b8',land2:'#f6c8d8',deco:'sakura',edge:'#e08aa8',heroes:'—'},
  grk:{name:'กรีก',town:'ไอโอเนีย',c:[318,585],rot:-90,land:'#dfe7c4',land2:'#c8d4a0',deco:'olive',edge:'#9aa878',heroes:'—'},
  cap:{name:'เมืองหลวง',town:'เอเธอร์ฟอลล์',c:[790,640],rot:0,land:'#d8e8a8',land2:'#f0d890',deco:'field',edge:'#b8925a',heroes:'—'},
  egy:{name:'อียิปต์',town:'เคเมท',c:[1400,655],rot:90,land:'#f4dea0',land2:'#e8c478',deco:'dune',edge:'#c8a040',heroes:'—'},
  azt:{name:'แอซเท็ก',town:'โชชิตลัน',c:[810,1012],rot:180,land:'#a8d890',land2:'#6fbf6a',deco:'jungle',edge:'#5fa848',heroes:'Jaguar · Croc · Axolotl'}};
const TW=72,TH=54,GAP=3,CW=TW+GAP,CH=TH+GAP;
/* shared region grid (col,row); before rotation the capital is below row 6 */
const TPL={D2c:[0,0],E2:[1,0],E1:[3,0],D2b:[0,1],H2:[3,1],D2a:[0,2],H1:[1,2],F4:[3,2],F3:[1,3],F2:[3,3],D1a:[4,3],D1b:[4,4],F1:[1,4],T:[2,4],F5:[1,5],F6:[1,6]};
const TPC=[2,3];
const CAPL={rift3:[0,0],rift2:[0,1],rift1:[1,1],cN:[2,1],cNE:[3,1],cW:[1,2],capT:[2,2],cE:[3,2],cSW:[1,3],cS:[2,3],cata1:[3,3],cata2:[4,3]},CAPC=[2,2];
const regionOf=id=>id==='frostheim'||id==='snowpine'?'vik':/^(capT|c[A-Z]|cata|rift)/.test(id)?'cap':id.slice(0,3);
const roleOf=id=>id==='frostheim'?'T':id==='snowpine'?'F1':regionOf(id)==='cap'?id:id.slice(3);
const kindOf=id=>{const r=roleOf(id);if(r==='T'||r==='capT')return 'town';if(/^D2|^rift/.test(r))return 'end';if(/^D1|^cata/.test(r))return 'dun';if(/^E/.test(r))return 'high';return 'field';};
const KIND={town:'เมือง',field:'ทุ่ง',dun:'ดันเจี้ยน',high:'แมพเลเวลสูง',end:'เอนเกม'};
const rotCell=(dc,dr,deg)=>deg===90?[-dr,dc]:deg===-90?[dr,-dc]:deg===180?[-dc,-dr]:[dc,dr];
function pos(id){const g=regionOf(id),R=REG[g];if(!R)return null;let p,c;
  if(g==='cap'){p=CAPL[id];c=CAPC;}else{p=TPL[roleOf(id)];c=TPC;}if(!p)return null;
  const [dc,dr]=rotCell(p[0]-c[0],p[1]-c[1],R.rot);return [R.c[0]+dc*CW,R.c[1]+dr*CH];}
const ids=Object.keys(MAPDEF).filter(id=>(VK_MAPS[id]||id==='snowpine')&&pos(id));
const lvOf=id=>window.MAP_ZONE&&MAP_ZONE[id]?MAP_ZONE[id]:null;
const nameOf=id=>(MAPDEF[id]&&MAPDEF[id].name)||id;
const edges=new Set();for(const id of ids)for(const w of ((VK_MAPS[id]||{}).warps||[]))if(ids.includes(w.to))edges.add([id,w.to].sort().join('~'));
const exitsOf=id=>[...edges].map(s=>s.split('~')).filter(p=>p.includes(id)).map(p=>p[0]===id?p[1]:p[0]);
const myLv=()=>(typeof PS!=='undefined'&&PS.lv)||1;
const here=()=>typeof curMap!=='undefined'?curMap:null;
const towns=()=>typeof HERO_TOWN!=='undefined'?HERO_TOWN:{};
function fit(id){const z=lvOf(id);if(!z)return 'town';const L=myLv();if(L<z[0]-3)return 'hard';if(L>z[1]+6)return 'easy';return 'good';}
const FIT={good:{c:'#3fbf5a',t:'เหมาะกับเลเวลคุณ'},hard:{c:'#e2574c',t:'อันตราย (มอนเลเวลสูงกว่า)'},easy:{c:'#9aa0aa',t:'ง่ายไป (ได้ EXP น้อย)'},town:{c:'#f5a623',t:'เมือง'}};

/* ---------------- thumbnails: rendered from each map host once, cached ---------------- */
const TKEY='af_thumb_v1_',THUMB={};let thumbQ=null;
function thumbOf(id){if(THUMB[id])return THUMB[id];try{const s=localStorage.getItem(TKEY+id);if(s)return THUMB[id]=s;}catch(e){}return null;}
async function buildThumbs(onOne){if(thumbQ)return thumbQ;thumbQ=(async()=>{for(const id of ids){if(thumbOf(id))continue;
    try{const h=(typeof mapHosts!=='undefined'&&mapHosts[id])||MAPDEF[id].mk();let n=0;while(!h.ready&&n<240){await new Promise(r=>setTimeout(r,25));n++;}if(!h.ready)continue;
      const c=document.createElement('canvas');c.width=124;c.height=92;const q=c.getContext('2d');const s=Math.max(124/h.W,92/h.H);q.translate((124-h.W*s)/2,(92-h.H*s)/2);q.scale(s,s);h.drawBase(q,0,false);
      const url=c.toDataURL('image/webp',.72);THUMB[id]=url;try{localStorage.setItem(TKEY+id,url);}catch(e){}onOne&&onOne(id);}catch(e){}
    await new Promise(r=>setTimeout(r,0));}thumbQ=null;})();return thumbQ;}

/* ---------------- window ---------------- */
const css=document.createElement('style');css.textContent=`
#wmw{left:50%;top:50%;transform:translate(-50%,-50%);width:min(1180px,97vw);z-index:40}
#wmw .bd{display:flex;gap:10px;padding:8px 10px}
#wmw .wm-svg{flex:1;min-width:0;border:2.5px solid var(--ln,#3a2a1f);border-radius:12px;overflow:hidden;position:relative;background:#2c4152;touch-action:none}
#wmw svg{display:block;width:100%;height:auto;cursor:grab}#wmw svg.drag{cursor:grabbing}
#wmw .wm-prog{position:absolute;left:10px;bottom:8px;color:#fff;font:600 11px Mali,Sarabun,sans-serif;text-shadow:0 1px 2px #000}
#wmw .wm-side{width:250px;flex:none;display:flex;flex-direction:column;gap:8px;max-height:min(72vh,680px);overflow:auto}
#wmw .wm-card{background:#fff8e6;border:2.5px solid var(--ln,#3a2a1f);border-radius:12px;padding:8px 10px}
#wmw .wm-card h4{margin:0 0 4px;font:700 13px Mali,Sarabun,sans-serif}
#wmw .wm-tag{display:inline-block;padding:0 7px;border-radius:9px;color:#fff;font-size:11px;margin:2px 4px 2px 0}
#wmw .wm-row{display:flex;justify-content:space-between;gap:6px;font-size:11.5px}
#wmw .wm-link{cursor:pointer;text-decoration:underline dotted}
#wmw .tile{cursor:pointer}#wmw .tile:hover .fr{stroke:#fff;stroke-width:3}
#wmw .lg{display:flex;gap:10px;flex-wrap:wrap;font-size:11px}#wmw .lg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:-1px}
@keyframes wmPulse{0%,100%{stroke-opacity:1}50%{stroke-opacity:.25}}#wmw .here{animation:wmPulse 1s ease-in-out infinite}
@media (max-width:760px){#wmw .bd{flex-direction:column}#wmw .wm-side{width:auto;max-height:36vh}}`;
document.head.appendChild(css);
const W=document.createElement('div');W.id='wmw';W.className='ro';
W.innerHTML=`<div class="tb">แผนที่โลก · World Map<button class="x" title="ปิด (W)">×</button></div>
  <div class="bd"><div class="wm-svg"><div class="wm-prog"></div></div><div class="wm-side"><div class="wm-card" id="wm-info"></div><div class="wm-card" id="wm-sug"></div></div></div>
  <div class="ft lg"><span><i style="background:${FIT.good.c}"></i>เหมาะกับเลเวลคุณ</span><span><i style="background:${FIT.hard.c}"></i>อันตราย</span><span><i style="background:${FIT.easy.c}"></i>ง่ายไป</span><span><i style="background:${FIT.town.c}"></i>เมือง</span><span>กรอบทอง ★ = เอนเกม · กรอบแดงกะพริบ = คุณอยู่ที่นี่ · ล้อเมาส์ซูม · ลากเพื่อเลื่อน · ดับเบิลคลิกรีเซ็ต · W เปิด/ปิด</span></div>`;
document.body.appendChild(W);
W.addEventListener('pointerdown',e=>e.stopPropagation());
W.querySelector('.x').onclick=()=>W.classList.remove('open');
const el=(n,a={},p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};

/* ---------------- deterministic noise ---------------- */
const hash=(x)=>{const s=Math.sin(x*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const vnoise=(t,seed)=>{const i=Math.floor(t),f=t-i,u=f*f*(3-2*f);return hash(i+seed*17.3)*(1-u)+hash(i+1+seed*17.3)*u;};
/* island outline around a set of tile rectangles: support radius per angle + margin + layered noise, smoothed */
function islandPath(rects,cx,cy,margin,seed,steps=96){const pts=[];
  for(let i=0;i<steps;i++){const a=i/steps*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a);let r=0;
    for(const [x0,y0,x1,y1] of rects)for(const [x,y] of [[x0,y0],[x1,y0],[x0,y1],[x1,y1]])r=Math.max(r,(x-cx)*dx+(y-cy)*dy);
    const t=i/steps*12,n=vnoise(t,seed)*.7+vnoise(t*2.7,seed+3)*.3;pts.push([cx+dx*(r+margin*(.55+.75*n)),cy+dy*(r+margin*(.55+.75*n))]);}
  const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2],L=pts.length;let m0=mid(pts[0],pts[1]),d=`M${m0[0].toFixed(1)} ${m0[1].toFixed(1)}`;
  for(let i=1;i<=L;i++){const p=pts[i%L],m=mid(p,pts[(i+1)%L]);d+=` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;}
  return d+'Z';}
function decoGlyph(kind,x,y,s,p){switch(kind){
  case 'pine':el('path',{d:`M${x} ${y-9*s} L${x+5*s} ${y} H${x-5*s}Z M${x} ${y-5*s} L${x+6*s} ${y+4*s} H${x-6*s}Z`,fill:'#3f6a58',opacity:.8},p);break;
  case 'sakura':el('circle',{cx:x,cy:y,r:4.5*s,fill:'#f39bb8',opacity:.85},p);el('rect',{x:x-.8*s,y:y+2*s,width:1.6*s,height:5*s,fill:'#7a5040'},p);break;
  case 'olive':el('circle',{cx:x,cy:y,r:4*s,fill:'#8aa060',opacity:.85},p);break;
  case 'dune':el('path',{d:`M${x-10*s} ${y} Q${x} ${y-7*s} ${x+10*s} ${y}`,fill:'none',stroke:'#c89850','stroke-width':2*s,opacity:.8},p);break;
  case 'jungle':el('circle',{cx:x,cy:y,r:5*s,fill:'#3f8f48',opacity:.85},p);el('circle',{cx:x+3*s,cy:y-2*s,r:3.5*s,fill:'#5aaf58',opacity:.85},p);break;
  default:el('path',{d:`M${x-6*s} ${y} H${x+6*s} M${x-4*s} ${y-3*s} H${x+4*s}`,stroke:'#b8a050','stroke-width':1.6*s,opacity:.7},p);}}

/* ---------------- poster ---------------- */
let sel=null,view={x:0,y:0,w:VBW,h:VBH},svg=null,dragMoved=false;
function draw(){
  const host=W.querySelector('.wm-svg');const old=host.querySelector('svg');if(old)old.remove();
  svg=el('svg',{viewBox:`${view.x} ${view.y} ${view.w} ${view.h}`});host.prepend(svg);
  const defs=el('defs',{},svg);
  const sea=el('linearGradient',{id:'wmSea',x1:0,y1:0,x2:1,y2:1},defs);el('stop',{offset:0,'stop-color':'#2b4f94'},sea);el('stop',{offset:1,'stop-color':'#18306a'},sea);
  const blur=el('filter',{id:'wmBlur',x:'-10%',y:'-10%',width:'120%',height:'120%'},defs);el('feGaussianBlur',{stdDeviation:12},blur);
  const pat=el('pattern',{id:'wmWave',width:60,height:30,patternUnits:'userSpaceOnUse'},defs);el('path',{d:'M0 15 Q15 8 30 15 T60 15',fill:'none',stroke:'#ffffff','stroke-opacity':.07,'stroke-width':2},pat);
  /* painted continent (ChatGPT art) — Orbis-of-Midgard style poster background */
  el('rect',{x:-300,y:-300,width:VBW+600,height:VBH+600,fill:'#2c4152'},svg);
  el('image',{href:'assets/ui/worldmap_bg.webp',x:0,y:0,width:VBW,height:VBH,preserveAspectRatio:'none'},svg);
  const tsh=el('filter',{id:'wmTileSh',x:'-20%',y:'-20%',width:'140%',height:'150%'},defs);el('feDropShadow',{dx:1.5,dy:2.5,stdDeviation:1.6,'flood-color':'#000','flood-opacity':.55},tsh);
  /* region land shapes */
  const shapes={};
  for(const g in REG){const rs=ids.filter(id=>regionOf(id)===g).map(id=>{const [x,y]=pos(id);return [x-TW/2,y-TH/2,x+TW/2,y+TH/2];});if(!rs.length)continue;
    const cx=(Math.min(...rs.map(r=>r[0]))+Math.max(...rs.map(r=>r[2])))/2,cy=(Math.min(...rs.map(r=>r[1]))+Math.max(...rs.map(r=>r[3])))/2;
    shapes[g]={d:islandPath(rs,cx,cy,g==='cap'?58:72,Object.keys(REG).indexOf(g)+1),cx,cy,rs};}
  /* roads between tiles */
  for(const s of edges){const [a,b]=s.split('~');const p=pos(a),q=pos(b),x=regionOf(a)!==regionOf(b);el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:x?'#fff3d0':'#2a1e14','stroke-width':x?4:2.5,'stroke-dasharray':x?'9 7':'','stroke-linecap':'round',opacity:x?.85:.55},svg);}
  /* tiles */
  for(const id of ids){const [x,y]=pos(id),k=kindOf(id),ft=fit(id),z=lvOf(id),g=el('g',{class:'tile',transform:`translate(${(x-TW/2).toFixed(1)},${(y-TH/2).toFixed(1)})`},svg);
    el('rect',{x:-2.5,y:-2.5,width:TW+5,height:TH+5,rx:3,fill:'#1d1610',filter:'url(#wmTileSh)'},g);
    const th=thumbOf(id);
    if(th)el('image',{href:th,x:0,y:0,width:TW,height:TH,preserveAspectRatio:'xMidYMid slice'},g);
    else{el('rect',{x:0,y:0,width:TW,height:TH,rx:3,fill:REG[regionOf(id)].land2},g);const t=el('text',{x:TW/2,y:TH/2+4,'text-anchor':'middle','font-size':10,fill:'#5a4630'},g);t.textContent='…';}
    if(k==='dun'||k==='end')el('rect',{x:0,y:0,width:TW,height:TH,rx:3,fill:k==='end'?'rgba(40,10,40,.3)':'rgba(30,20,10,.25)'},g);
    el('rect',{class:'fr',x:0,y:0,width:TW,height:TH,rx:3,fill:'none',stroke:k==='end'?'#ffd36a':k==='town'?'#fff2c8':'#f4ead8','stroke-width':k==='end'||k==='town'?3:1.6},g);
    if(id===here())el('rect',{class:'here',x:-3,y:-3,width:TW+6,height:TH+6,rx:5,fill:'none',stroke:'#ff3b30','stroke-width':4},g);
    if(sel===id)el('rect',{x:-5,y:-5,width:TW+10,height:TH+10,rx:6,fill:'none',stroke:'#fff','stroke-width':3,'stroke-dasharray':'6 4'},g);
    el('circle',{cx:TW-6,cy:6,r:5,fill:FIT[ft].c,stroke:'#2a1e14','stroke-width':1.4},g);
    const lab=k==='town'?REG[regionOf(id)].town:z?z[0]+'–'+z[1]:'';
    if(lab){el('rect',{x:2,y:TH-14,width:Math.min(TW-4,lab.length*(k==='town'?7.2:5.8)+8),height:12,rx:3,fill:'rgba(30,22,14,.72)'},g);const t=el('text',{x:6,y:TH-5,'font-size':k==='town'?9.5:9,'font-weight':700,fill:k==='town'?'#ffe6a8':'#fff','font-family':'Mali,Sarabun,sans-serif'},g);t.textContent=lab;}
    if(k==='end'){const t=el('text',{x:4,y:14,'font-size':13,fill:'#ffd36a',stroke:'#3a2a1f','stroke-width':.8},g);t.textContent='★';}
    const tt=el('title',{},g);tt.textContent=nameOf(id)+(z?' · Lv '+z[0]+'–'+z[1]:'');
    g.addEventListener('click',()=>{if(dragMoved)return;sel=id;draw();info(id);});}
  /* region banners */
  for(const g in shapes){const S=shapes[g],R=REG[g],top=Math.min(...S.rs.map(r=>r[1]))-24;
    const zs=ids.filter(id=>regionOf(id)===g&&lvOf(id)&&kindOf(id)!=='end').map(lvOf).filter(z=>z[0]<78);
    const sub=g==='cap'?'ศูนย์กลาง · ทางไปทุกภูมิภาค':zs.length?`โซน Lv ${Math.min(...zs.map(z=>z[0]))}–${Math.max(...zs.map(z=>z[1]))} · เกิด: ${R.heroes}`:'';
    const w=Math.max(180,sub.length*6.2+30),bx=S.cx-w/2,b=el('g',{},svg);
    el('rect',{x:bx,y:top-24,width:w,height:36,rx:10,fill:'#fff8e6',stroke:'#3a2a1f','stroke-width':2.5},b);el('rect',{x:bx+8,y:top-24,width:w-16,height:5,rx:2.5,fill:R.edge},b);
    const t=el('text',{x:S.cx,y:top-6,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#3a2a1f','font-family':'Mali,Sarabun,sans-serif'},b);t.textContent=R.name+' · '+R.town;
    const s2=el('text',{x:S.cx,y:top+7,'text-anchor':'middle','font-size':10,fill:'#6a5038','font-family':'Mali,Sarabun,sans-serif'},b);s2.textContent=sub;}
  /* title cartouche + compass */
  const tg=el('g',{transform:'translate(36,36)'},svg);el('rect',{width:340,height:60,rx:14,fill:'#fff8e6',stroke:'#3a2a1f','stroke-width':3},tg);
  const tt=el('text',{x:170,y:29,'text-anchor':'middle','font-size':22,'font-weight':800,fill:'#7a4a21','font-family':'Mali,Sarabun,sans-serif'},tg);tt.textContent='AETHERFALL WORLD MAP';
  const ts=el('text',{x:170,y:48,'text-anchor':'middle','font-size':12,fill:'#5a4630','font-family':'Mali,Sarabun,sans-serif'},tg);ts.textContent=ids.length+' แมพ · 6 ภูมิภาค';
  const cg=el('g',{transform:`translate(${VBW-90},${VBH-90})`},svg);el('circle',{r:44,fill:'#fff8e6',stroke:'#3a2a1f','stroke-width':3},cg);
  for(const [a,c] of [[0,'#e2574c'],[90,'#3a2a1f'],[180,'#3a2a1f'],[270,'#3a2a1f']])el('path',{d:'M0 -34 L7 0 L0 6 L-7 0Z',fill:c,transform:`rotate(${a})`},cg);
  const n=el('text',{y:-50,'text-anchor':'middle','font-size':16,'font-weight':800,fill:'#fff',stroke:'#3a2a1f','stroke-width':.8},cg);n.textContent='N';
  bindPanZoom();}

/* ---------------- pan / zoom ---------------- */
function bindPanZoom(){const s=svg;let st=null;
  const apply=()=>s.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);
  const toV=e=>{const r=s.getBoundingClientRect();return [view.x+(e.clientX-r.left)/r.width*view.w,view.y+(e.clientY-r.top)/r.height*view.h];};
  s.addEventListener('wheel',e=>{e.preventDefault();const [mx,my]=toV(e),f=e.deltaY>0?1.15:1/1.15,nw=Math.min(VBW,Math.max(360,view.w*f)),k=nw/view.w;
    view={x:mx-(mx-view.x)*k,y:my-(my-view.y)*k,w:nw,h:nw*VBH/VBW};clampView();apply();},{passive:false});
  s.addEventListener('pointerdown',e=>{st={x:e.clientX,y:e.clientY,v:{...view}};dragMoved=false;});
  s.addEventListener('pointermove',e=>{if(!st)return;const r=s.getBoundingClientRect();if(Math.abs(e.clientX-st.x)+Math.abs(e.clientY-st.y)>4){dragMoved=true;s.classList.add('drag');}
    if(!dragMoved)return;view.x=st.v.x-(e.clientX-st.x)/r.width*view.w;view.y=st.v.y-(e.clientY-st.y)/r.height*view.h;clampView();apply();});
  const end=()=>{st=null;s.classList.remove('drag');setTimeout(()=>dragMoved=false,0);};s.addEventListener('pointerup',end);s.addEventListener('pointerleave',end);
  s.addEventListener('dblclick',()=>{view={x:0,y:0,w:VBW,h:VBH};apply();});}
function clampView(){view.x=Math.max(-100,Math.min(VBW-view.w+100,view.x));view.y=Math.max(-100,Math.min(VBH-view.h+100,view.y));}

/* ---------------- side panel ---------------- */
function info(id){const box=W.querySelector('#wm-info');if(!id){box.innerHTML='<h4>คลิกแมพเพื่อดูรายละเอียด</h4><div style="font-size:11.5px">กรอบแดงกะพริบ = ตำแหน่งของคุณตอนนี้</div>';return;}
  const z=lvOf(id),k=kindOf(id),ft=fit(id),mons=(window.VK_MONS||{})[id]||[];
  const ex=exitsOf(id).map(t=>`<div class="wm-row"><span class="wm-link" data-id="${t}">→ ${nameOf(t)}</span><span>${lvOf(t)?'Lv '+lvOf(t).join('–'):'เมือง'}</span></div>`).join('');
  const sp=m=>{const d=window.AFItems&&AFItems.spDrop&&AFItems.spDrop(m,15);return d?`<br><span class="wm-sp" title="${d.tip}" style="display:inline-flex;align-items:center;gap:3px;font-size:10.5px;color:#7a4a21;white-space:nowrap">${d.icon}ดรอป ${d.sh} ${d.tt}</span>`:'';};   /* special drop (drop_table.js): refine stone / orb icon */
  const ms=mons.length?mons.map(m=>`<div class="wm-row"><span>${m.th||m.name}${m.aggr?' <b style="color:#c0392b" title="ตีก่อน">⚔</b>':''}${m._t&&window.AFMonsters?` <small style="color:${AFMonsters.EL_COL[m._t.el]};-webkit-text-stroke:.2px #3a2a1f" title="ธาตุ / เผ่า">${AFMonsters.EL_TH[m._t.el]}·${AFMonsters.RACE_TH[m._t.race]}</small>${m._t.atype!=='melee'?(m._t.atype==='ranged'?' 🏹':' ✨'):''}${m._t.healer?' 💚':''}`:''}${sp(m)}</span><span>Lv ${m.lv[0]}–${m.lv[1]}</span></div>`).join(''):'<div style="font-size:11.5px">ไม่มีมอนสเตอร์</div>';
  /* map boss / MVP of this map (map_bosses.js, boss_fenrir.js) */
  const bi=window.MBOSS&&MBOSS.info(id),boss=bi?`<div style="margin-top:6px;font-weight:700">บอส</div><div class="wm-row"><span>👑 ${bi.th} <small>(${bi.tier})</small> ${bi.left>0?`<small style="color:#c0392b">เกิดใหม่ใน ${Math.ceil(bi.left/60000)} นาที</small>`:'<small style="color:#2e8b3a">พร้อม</small>'}<br><span style="font-size:10.5px;color:#7a4a21">ดรอปเจมแปรสภาพ / เสริม · ชิ้นส่วนบอส · หินโทเท็ม · เกิดใหม่ทุก ${bi.min} นาที</span></span><span>Lv ${bi.lv}</span></div>`:'';
  /* mini-boss of this map (mini_bosses.js) */
  const mi=window.MINIB&&MINIB.info(id),kinTh=mi?((mons.find(m=>m.name===mi.kin)||{}).th||mi.kin):'',dl=mi&&mi.drop&&window.DROPTAB?DROPTAB.label(mi.drop):'',
    mini=mi?`<div style="margin-top:6px;font-weight:700">มินิบอส</div><div class="wm-row"><span>👑 ${mi.th} <small>(หัวหน้า${kinTh})</small> ${mi.left>0?`<small style="color:#c0392b">เกิดใหม่ใน ${Math.ceil(mi.left/60000)} นาที</small>`:'<small style="color:#2e8b3a">อยู่ในแมพ</small>'}${mi.pas?' <small>· ไม่ตีก่อน</small>':''}<br><span style="font-size:10.5px;color:#7a4a21">${dl?'ดรอป '+dl+' แน่นอน · ':''}ของแมพ ×3 · EXP ×8 · เกิดใหม่ทุก ${mi.min} นาที</span></span><span>Lv ${mi.lv}</span></div>`:'';
  const home=k==='town'?Object.entries(towns()).filter(([h,t])=>t===id).map(([h])=>h).join(', '):'';const th=thumbOf(id);
  box.innerHTML=`${th?`<img src="${th}" style="width:100%;border-radius:8px;border:2px solid #3a2a1f;margin-bottom:6px">`:''}<h4>${nameOf(id)}</h4>
    <span class="wm-tag" style="background:${FIT[ft].c}">${FIT[ft].t}</span><span class="wm-tag" style="background:#7a4a21">${KIND[k]}</span>
    ${z?`<div class="wm-row"><b>เลเวลมอน</b><b>Lv ${z[0]}–${z[1]}</b></div>`:''}
    ${home?`<div class="wm-row"><span>จุดเกิดของ</span><span>${home}</span></div>`:''}
    ${k==='end'?'<div style="font-size:11px;color:#7a4a21">เอนเกม: ฟามของดรอปสายของภูมิภาคนี้ (กำลังออกแบบ)</div>':''}
    ${id===here()?'<div style="font-size:11px;color:#e2574c;font-weight:700">● คุณอยู่ที่นี่</div>':''}
    ${boss}${mini}<div style="margin-top:6px;font-weight:700">มอนสเตอร์</div>${ms}${mons.some(m=>window.DROPTAB&&DROPTAB.code(m.name))?'<div style="font-size:10.5px;color:#7a4a21;margin-top:2px">ดรอป = ของดรอปพิเศษของมอนตัวนั้น (ไม่ใช่ทุกตัวที่มี) · ขั้นตามเลเวลมอน</div>':''}
    <div style="margin-top:6px;font-weight:700">ทางออก</div>${ex||'<div style="font-size:11.5px">—</div>'}`;
  box.querySelectorAll('.wm-link').forEach(a=>a.onclick=()=>{sel=a.dataset.id;draw();info(sel);});}
function suggest(){const L=myLv(),box=W.querySelector('#wm-sug');
  const good=ids.filter(id=>fit(id)==='good').sort((a,b)=>Math.abs((lvOf(a)[0]+lvOf(a)[1])/2-L)-Math.abs((lvOf(b)[0]+lvOf(b)[1])/2-L)).slice(0,6);
  box.innerHTML=`<h4>แนะนำสำหรับ Lv ${L}</h4>`+(good.length?good.map(id=>`<div class="wm-row"><span class="wm-link" data-id="${id}">${nameOf(id)}</span><span>${lvOf(id).join('–')}</span></div>`).join(''):'<div style="font-size:11.5px">—</div>');
  box.querySelectorAll('.wm-link').forEach(a=>a.onclick=()=>{sel=a.dataset.id;draw();info(sel);});}
function progress(){const n=ids.filter(id=>thumbOf(id)).length,p=W.querySelector('.wm-prog');p.textContent=n<ids.length?`กำลังวาดภาพแมพ ${n}/${ids.length} … (ครั้งแรกครั้งเดียว)`:'';}
function open(){sel=here()&&ids.includes(here())?here():null;draw();info(sel);suggest();progress();W.classList.add('open');
  if(ids.some(id=>!thumbOf(id))){let k=0;buildThumbs(()=>{progress();if(++k%8===0&&W.classList.contains('open'))draw();}).then(()=>{if(W.classList.contains('open'))draw();progress();});}}
window.toggleWorldMap=()=>{if(W.classList.contains('open'))W.classList.remove('open');else open();};
addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;if(e.key.toLowerCase()==='w'){e.preventDefault();toggleWorldMap();}else if(e.key==='Escape'&&W.classList.contains('open'))W.classList.remove('open');});
const mm=document.getElementById('mmname');if(mm){mm.style.cursor='pointer';mm.title='แผนที่โลก (W)';mm.addEventListener('click',e=>{e.stopPropagation();toggleWorldMap();});}
})();
