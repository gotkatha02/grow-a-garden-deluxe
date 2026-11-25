/* Cat · painted fashion wings (owner 2026-11-21: "give the old wings to the cat too").
   fashion.js is wolf-only (its head points, fur / skin masks are made for the wolf sprite), so the cat gets this small
   wing-only wardrobe. Wing sets come from pwing_data.js (PWING, shared with the wolf). The anchor is the cat's hat centre
   tracked on every atlas frame (window.CAT_HAT from cat_mask.js) + a back offset in hat widths.
   drawGear(e,x,y,layer) is the engine's gear hook (layer 0 = behind the body, 1 = in front): S/SE/E behind, N/NE in front.
   Saved in af_wings_<CHAR>; the item bonus is added in gearCalc like the wolf's costumes.
   2026-11-25 hero sizes: the wings grow with the cat (× HERO_K); the wardrobe preview shows the cat at the standard size. */
(function(){if(typeof CHAR==='undefined'||CHAR!=='cat'||!window.PWING)return;
const PW=window.PWING,KEY='af_wings_'+CHAR;let cur=null;try{cur=localStorage.getItem(KEY)||null;if(cur&&!PW[cur])cur=null;}catch(_){}
const BK={S:[0,.80],SE:[-.10,.78],E:[-.30,.76],NE:[-.10,.66],N:[0,.62]};   /* back point = hat centre + [dx,dy]·hat width (cell px) */
const IMG={};function img(k,v){const key=k+v;let im=IMG[key];if(!im){im=new Image();im.src=PW[k].dir+v+'.webp';IMG[key]=im;}return im.complete&&im.naturalWidth?im:null;}
function geom(k,e,x,y,t,moving){const C=PW[k],H=window.CAT_HAT;if(!C||!H)return null;const sd=(SPR_META.mirror&&SPR_META.mirror[e.d])||e.d,mir=isMir(e.d),L=H.HAT[e.st]&&H.HAT[e.st][sd];if(!L)return null;
  const im=img(k,sd);if(!im)return null;const h=L[Math.min(e.f,L.length-1)],hw=H.HW[sd],b=BK[sd]||[0,.75];let ax=h[0]+b[0]*hw;if(mir)ax=SPR_META.cell.w-ax;const ay=h[1]+b[1]*hw;
  const pv=SPR_META.pivot,sx=x+(ax-pv.x)*SPR,sy=y+(ay-pv.y)*SPR,r=C.root[sd],side=sd==='E',K=SPR*(window.HERO_K||1)/CHAR_SCALE,
    w=(side?C.span*.42:sd==='S'?C.span:sd==='N'?C.span*.88:sd==='NE'?C.span*.78:C.span*.85)*K,hh=w*im.naturalHeight/im.naturalWidth,
    sp=moving?7:2.6,amp=moving?.16:.07,ph=Math.sin(t*sp),front=sd==='N'||sd==='NE';
  return {front,draw(){ctx.save();ctx.translate(sx,sy);if(mir)ctx.scale(-1,1);const W=im.naturalWidth,rx=r[0]*W,ry=r[1]*im.naturalHeight,q=w/W;
    if(side){ctx.rotate(-ph*amp*1.4);ctx.drawImage(im,-rx*q,-ry*q,w,hh);}
    else for(const sg of [-1,1]){ctx.save();ctx.rotate(sg*ph*amp);ctx.scale(1-.06*(ph*.5+.5)*(moving?1:.5),1);ctx.beginPath();if(sg<0)ctx.rect(-rx*q-2,-ry*q-2,rx*q+2.5,hh+4);else ctx.rect(-.5,-ry*q-2,(w-rx*q)+2,hh+4);ctx.clip();ctx.drawImage(im,-rx*q,-ry*q,w,hh);ctx.restore();}
    ctx.restore();}};}
const pre=k=>{if(k&&PW[k])for(const v of ['S','SE','E','NE','N'])img(k,v);};pre(cur);
let preview=null;   /* wardrobe preview: try a set before saving */
window.drawGear=function(e,x,y,layer,moving){const k=preview!==null?preview:cur;if(!k)return;const g=geom(k,e,x,y,performance.now()/1000,moving);if(g&&(g.front?1:0)===layer)g.draw();};
window.armorFilter=window.armorFilter||(()=>'');
window.sceneFilter=window.sceneFilter||(()=>(typeof mapNight!=='undefined'&&curMap&&mapNight)?'brightness(.72) saturate(.78) hue-rotate(-6deg)':'');
/* item bonus */
const mapK=k=>(typeof OLD_KEY!=='undefined'&&OLD_KEY[k])||k;
if(typeof gearCalc==='function'){const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);const it=cur&&PW[cur]&&PW[cur].it;if(it&&it.b)for(const k in it.b)BON[mapK(k)]=(BON[mapK(k)]||0)+it.b[k];return r;};try{gearCalc();}catch(_){}}
function wear(k){cur=k;pre(k);try{k?localStorage.setItem(KEY,k):localStorage.removeItem(KEY);}catch(_){}try{gearCalc();}catch(_){}if(typeof buildEquip==='function')try{buildEquip();}catch(_){}}
/* wardrobe window */
const st=document.createElement('style');st.textContent=`#cwingw{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,94vw);max-height:90vh;overflow:auto;background:#f4ead6;border:3px solid #6a4a2a;border-radius:14px;padding:10px;z-index:60;display:none;font:13px sans-serif;color:#3a2a1a}
#cwingw.open{display:block}#cwingw h3{margin:0 0 6px}#cwingw .row{display:flex;gap:10px}#cwingw canvas{background:linear-gradient(#dfe8f6,#b8c6de);border-radius:10px;flex:none}
#cwingw .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;flex:1;align-content:start}
#cwingw .it{border:2px solid #b8986a;border-radius:8px;background:#fff8ea;padding:4px;cursor:pointer;text-align:center;font-size:11px}#cwingw .it.on{border-color:#e07a1a;background:#ffe2b8}
#cwingw .it img{width:96px;height:52px;object-fit:contain}#cwingw .bar{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}#cwingw button.b{padding:5px 12px;border-radius:8px;border:2px solid #6a4a2a;background:#ffd58a;cursor:pointer}`;
document.head.appendChild(st);
const w=document.createElement('div');w.id='cwingw';document.body.appendChild(w);let dir=0;const DIRS=['S','SE','E','NE','N','NW','W','SW'];
function build(){const sel=preview!==null?preview:cur;w.innerHTML=`<h3>🪽 ปีกแฟชั่น</h3><div class="row"><div><canvas id="cwcv" width="200" height="250"></div><button class="b" id="cwl">⟲</button> <button class="b" id="cwr">⟳</button></div><div class="grid">
  <div class="it${!sel?' on':''}" data-k=""><div style="height:52px;line-height:52px">— ไม่ใส่ —</div></div>
  ${Object.keys(PW).map(k=>`<div class="it${sel===k?' on':''}" data-k="${k}"><img src="${PW[k].dir}S.webp"><div>${PW[k].it.n}</div></div>`).join('')}</div></div>
  <div style="margin-top:6px;min-height:18px">${sel&&PW[sel]?PW[sel].it.d:''}</div><div class="bar"><button class="b" id="cwc">ยกเลิก</button><button class="b" id="cws">สวมใส่</button></div>`;
  w.querySelectorAll('.it').forEach(b=>b.onclick=()=>{preview=b.dataset.k||'';pre(preview);build();});
  w.querySelector('#cwl').onclick=()=>{dir=(dir+7)%8;};w.querySelector('#cwr').onclick=()=>{dir=(dir+1)%8;};
  w.querySelector('#cwc').onclick=()=>{preview=null;w.classList.remove('open');};
  w.querySelector('#cws').onclick=()=>{wear(preview===null?cur:(preview||null));preview=null;w.classList.remove('open');if(typeof msg==='function')msg('สวมปีกแล้ว');};}
function draw(){if(!w.classList.contains('open'))return;const cv=document.getElementById('cwcv');if(!cv)return;const g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);
  const d=DIRS[dir],stt='idle',D2=durs(stt,d),T=D2.reduce((a,b)=>a+b,0);let ms=performance.now()%T,f=0;while(f<D2.length-1&&ms>=D2[f]){ms-=D2[f];f++;}
  const S=2.0,X=100/S,Y=225/S,old=ctx;ctx=g;g.setTransform(S,0,0,S,0,0);try{g.translate(X,Y);const PK=CHAR_SCALE/(window.HERO_K||1);g.scale(PK,PK);g.translate(-X,-Y);const e={st:stt,d,f};drawGear(e,X,Y,0,false);drawFrame(e,X,Y,1);drawGear(e,X,Y,1,false);}finally{ctx=old;}}
setInterval(draw,60);
window.openCatWings=function(){preview=null;build();w.classList.add('open');};
const panel=document.getElementById('chsel');if(panel){const b=document.createElement('button');b.className='rob';b.id='cwingbtn';b.textContent='🪽 ปีกแฟชั่น';b.style.cssText='margin:6px 0 2px;width:100%';b.onclick=window.openCatWings;panel.after(b);}
addEventListener('keydown',e=>{if(e.altKey&&(e.key==='c'||e.key==='C')){e.preventDefault();w.classList.contains('open')?w.classList.remove('open'):window.openCatWings();}});
})();
