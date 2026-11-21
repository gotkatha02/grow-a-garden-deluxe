/* Gems show on the real skill (owner 2026-11-21 'ลุย' — GAME_PILLARS_TH.md item 2 · TOTEM_GEM_SYSTEM_TH.md §1f).
   Step 1 = ELEMENT TINT: a skill whose gem mutation is fire / ice / volt (C gem or skill star, follow-ups included) draws its effects
   in that element's colours. Shared by all 14 heroes, nothing per hero:
   · every effect piece already knows its skill (addFx sets f._sk); pieces made inside the cast itself (make(), the weapon trail) are
     tagged from castSkillNow, pieces spawned by a tinted piece's update inherit its element, basic attacks use the '@auto' target;
   · while a tinted piece draws, every colour it sets (fill / stroke / shadow, gradient stops) and every picture / clip / texture it
     draws is mapped through the element's ramp BY BRIGHTNESS — whites stay white, darks stay dark, so painted art, video clips and
     code VFX all keep their shape and shading and only change hue; particles from emit() are mapped when they are born;
   · gameplay is untouched (damage, timing, hit lists): only colours change.
   Pictures are recoloured once and cached (big strips per frame cell); canvases drawn during the same tinted draw are not
   recoloured twice. ?gemfx=0 turns it off. Test hook: GEMFX.force({skillKey:'fire'|'ice'|'volt'}). */
(()=>{
if(/[?&]gemfx=0/.test(location.search))return;
const P2=CanvasRenderingContext2D.prototype;
const D_FS=Object.getOwnPropertyDescriptor(P2,'fillStyle'),D_SS=Object.getOwnPropertyDescriptor(P2,'strokeStyle'),D_SC=Object.getOwnPropertyDescriptor(P2,'shadowColor');
const oDraw=P2.drawImage,oLG=P2.createLinearGradient,oRG=P2.createRadialGradient,oCG=P2.createConicGradient,oStop=CanvasGradient.prototype.addColorStop;
if(!D_FS||!D_FS.set||!oDraw)return;

/* ---- element ramps: brightness → colour (fire = deep red → orange → gold → white, ice = navy → sky → cyan → white,
        volt = indigo → violet → lavender → white) ---- */
const RAMP={
  fire:[[0,22,4,2],[.16,104,16,6],[.36,206,52,14],[.56,255,118,26],[.76,255,190,76],[.9,255,232,170],[1,255,251,238]],
  ice:[[0,4,12,28],[.16,10,48,98],[.36,30,112,196],[.56,84,182,244],[.76,164,228,255],[.9,222,247,255],[1,255,255,255]],
  volt:[[0,10,4,32],[.16,40,22,124],[.36,96,60,226],[.56,146,118,255],[.76,198,186,255],[.9,236,232,255],[1,255,255,255]]};
const LUT={};
for(const el in RAMP){const R=RAMP[el],L=new Uint8ClampedArray(768);
  for(let i=0;i<256;i++){const t=i/255;let j=1;while(j<R.length-1&&R[j][0]<t)j++;const a=R[j-1],b=R[j],u=(t-a[0])/((b[0]-a[0])||1);
    for(let c=0;c<3;c++)L[i*3+c]=Math.round(a[c+1]+(b[c+1]-a[c+1])*Math.max(0,Math.min(1,u)));}
  LUT[el]=L;}
const lum=(r,g,b)=>{const v=r>g?(r>b?r:b):(g>b?g:b);return (141*((77*r+150*g+29*b)>>8)+115*v)>>8;};   /* luminance with a share of the brightest channel: saturated colours stay bright */

/* ---- colour strings ---- */
const sc=document.createElement('canvas').getContext('2d');
const norm=s=>{D_FS.set.call(sc,'#000');D_FS.set.call(sc,s);return D_FS.get.call(sc);};
const hx=(s,i,n)=>n===1?parseInt(s[i]+s[i],16):parseInt(s.substr(i,2),16);
function parse(s){
  if(s[0]==='#'){const n=s.length;if(n===4||n===5)return [hx(s,1,1),hx(s,2,1),hx(s,3,1),n===5?hx(s,4,1)/255:1];if(n===7||n===9)return [hx(s,1,2),hx(s,3,2),hx(s,5,2),n===9?hx(s,7,2)/255:1];return null;}
  const m=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(s);
  if(m){let a=m[4]==null?1:m[4].endsWith('%')?parseFloat(m[4])/100:+m[4];return [+m[1],+m[2],+m[3],a];}
  return null;}
const CC={fire:new Map(),ice:new Map(),volt:new Map()};
function mapCol(s,el){if(typeof s!=='string'||!s)return s;const M=CC[el];let r=M.get(s);if(r!==undefined)return r;
  let p=parse(s);if(!p){const n=norm(s);p=n&&n!==s?parse(n):null;}
  if(!p)r=s;else{const L=LUT[el],i=lum(p[0],p[1],p[2])*3;r=p[3]>=1?`rgb(${L[i]},${L[i+1]},${L[i+2]})`:`rgba(${L[i]},${L[i+1]},${L[i+2]},${+p[3].toFixed(3)})`;}
  if(M.size>6000)M.clear();M.set(s,r);return r;}

/* ---- gradients: remember how each was made, give a tinted twin when a tinted piece uses it ---- */
const GR=new WeakMap();
P2.createLinearGradient=function(){const g=oLG.apply(this,arguments);GR.set(g,{t:0,a:[...arguments],s:[]});return g;};
P2.createRadialGradient=function(){const g=oRG.apply(this,arguments);GR.set(g,{t:1,a:[...arguments],s:[]});return g;};
if(oCG)P2.createConicGradient=function(){const g=oCG.apply(this,arguments);GR.set(g,{t:2,a:[...arguments],s:[]});return g;};
CanvasGradient.prototype.addColorStop=function(o,c){const r=GR.get(this);if(r)r.s.push([o,c]);return oStop.call(this,o,c);};
const TW={fire:new WeakMap(),ice:new WeakMap(),volt:new WeakMap()};
function twin(g,el){const r=GR.get(g);if(!r)return g;const M=TW[el],t=M.get(g);if(t&&t.n===r.s.length)return t.g;
  const ng=(r.t===0?oLG:r.t===1?oRG:oCG).apply(sc,r.a);for(const [o,c] of r.s)oStop.call(ng,o,mapCol(c,el));M.set(g,{g:ng,n:r.s.length});return ng;}

/* ---- tint state ---- */
let TINT=null,SES=0,SEQ=0,VC=null,CAST=null;
const mapStyle=(v,el)=>typeof v==='string'?mapCol(v,el):(v instanceof CanvasGradient)?twin(v,el):v;
for(const [D,name] of [[D_FS,'fillStyle'],[D_SS,'strokeStyle'],[D_SC,'shadowColor']])
  Object.defineProperty(P2,name,{configurable:true,enumerable:D.enumerable,get:D.get,
    set(v){if(TINT){const c=this.canvas;if(c)c.__ts=SES;v=mapStyle(v,TINT);}D.set.call(this,v);}});

/* ---- pictures: recoloured once by the same ramp (per frame cell for big strips) ---- */
const BIG=1.2e6,FULL=new WeakMap(),CELL=new WeakMap(),BAD=new WeakSet();let PIX=0;const BUDGET=2.4e7;
const isCv=s=>(typeof HTMLCanvasElement!=='undefined'&&s instanceof HTMLCanvasElement)||(typeof OffscreenCanvas!=='undefined'&&s instanceof OffscreenCanvas);
function recolour(src,sx,sy,sw,sh,el){
  const c=document.createElement('canvas');c.width=sw;c.height=sh;const x=c.getContext('2d',{willReadFrequently:true});
  oDraw.call(x,src,sx,sy,sw,sh,0,0,sw,sh);const d=x.getImageData(0,0,sw,sh),p=d.data,L=LUT[el];
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const k=lum(p[i],p[i+1],p[i+2])*3;p[i]=L[k];p[i+1]=L[k+1];p[i+2]=L[k+2];}
  x.putImageData(d,0,0);PIX+=sw*sh;return c;}
function budget(){if(PIX>BUDGET){PIX=0;CLEAR++;}}
let CLEAR=0;
const NOW=()=>performance.now();
function tinted(src,W,H,el,box){   /* box = [sx,sy,sw,sh] for big sources, null = whole picture */
  if(BAD.has(src))return null;budget();
  const cv=isCv(src),life=cv?500:1e12,t=NOW();
  try{
    if(!box){let e=FULL.get(src);if(!e){e={};FULL.set(src,e);}let r=e[el];
      if(!r||r.c!==CLEAR||t-r.t>life||r.w!==W||r.h!==H){r={cv:recolour(src,0,0,W,H,el),t,c:CLEAR,w:W,h:H};e[el]=r;}return r.cv;}
    const k=el+'|'+box.join('|');let m=CELL.get(src);if(!m||m.c!==CLEAR){m=new Map();m.c=CLEAR;CELL.set(src,m);}let r=m.get(k);
    if(!r||t-r.t>life){r={cv:recolour(src,box[0],box[1],box[2],box[3],el),t};m.set(k,r);if(m.size>400){m.clear();}}return r.cv;
  }catch(e){BAD.add(src);return null;}}
function tintDraw(base,me,args){   /* base = the drawImage to call in the end (the original, or the FX layer's own wrapper) */
  const src=args[0];
  if(!TINT||!src)return base.apply(me,args);
  const cv=me.canvas;if(cv)cv.__ts=SES;
  if(src.__ts===SES)return base.apply(me,args);   /* drawn by this tinted piece just now: already in the element's colours */
  const W=src.naturalWidth||src.videoWidth||src.width,H=src.naturalHeight||src.videoHeight||src.height;
  if(!W||!H||(src.complete===false))return base.apply(me,args);
  const A=[...args];
  if(W*H<=BIG){const t=tinted(src,W,H,TINT,null);if(!t)return base.apply(me,args);A[0]=t;return base.apply(me,A);}
  if(A.length===9){const sx=Math.max(0,Math.round(A[1])),sy=Math.max(0,Math.round(A[2])),sw=Math.min(W-sx,Math.round(A[3])),sh=Math.min(H-sy,Math.round(A[4]));
    if(sw<1||sh<1)return base.apply(me,args);const t=tinted(src,W,H,TINT,[sx,sy,sw,sh]);if(!t)return base.apply(me,args);
    return base.call(me,t,0,0,sw,sh,A[5],A[6],A[7],A[8]);}
  return base.apply(me,args);}   /* a whole big picture without a source box: left as it is */
P2.drawImage=function(){return tintDraw(oDraw,this,arguments);};
/* contexts that wrapped drawImage on themselves before this file loaded (the FX layer counts its draws: lctx.drawImage) go through the tint too */
try{if(Object.prototype.hasOwnProperty.call(lctx,'drawImage')){const own=lctx.drawImage;lctx.drawImage=function(){return tintDraw(own,this,arguments);};}}catch(e){}

/* ---- which element a skill has ---- */
const ELS={fire:1,ice:1,volt:1};let ver=-1,MAP={},FORCE=null;
function elemOf(k){if(!k)return null;if(FORCE&&FORCE[k])return FORCE[k];
  const v=window.GEM_V||0;if(v!==ver){ver=v;MAP={};try{const A=window.totemGems&&totemGems.act();for(const t in A){const e=(A[t].mut||[]).find(x=>ELS[x]);if(e)MAP[t]=e;}}catch(e){}}
  return MAP[k]||null;}
const PL=()=>{try{return player;}catch(e){return null;}};
function basicEl(){const p=PL(),a=p&&p.action;if(!a||a.skill)return null;return /basic/i.test(a.key||'')?elemOf('@auto'):null;}
function ctxEl(){return TINT||VC||(window.SKCTX?elemOf(window.SKCTX):null)||(CAST?elemOf(CAST):null)||basicEl();}
const DT=(()=>{try{return DText;}catch(e){return null;}})();

function tag(f,el){if(!f||f.__gt||typeof f.draw!=='function'||(DT&&f instanceof DT))return;f.__gt=el;
  const d=f.draw;f.draw=function(){const p=TINT,ps=SES;TINT=el;if(!p)SES=++SEQ;try{return d.apply(this,arguments);}finally{TINT=p;SES=ps;}};
  if(typeof f.update==='function'){const u=f.update;f.update=function(){const p=VC;VC=el;try{return u.apply(this,arguments);}finally{VC=p;}};}}
const _add=window.addFx;
if(typeof _add==='function')window.addFx=addFx=function(f){const r=_add.apply(this,arguments);
  try{if(f&&!f.__gt){const el=f._sk?elemOf(f._sk):(VC||(CAST?elemOf(CAST):null)||basicEl());if(el)tag(f,el);}}catch(e){}
  return r;};
const _emit=window.emit;
if(typeof _emit==='function')window.emit=emit=function(o){const el=o&&ctxEl();
  if(el&&(typeof o.color==='string'||typeof o.gl==='string')){o=Object.assign({},o);if(typeof o.color==='string')o.color=mapCol(o.color,el);if(typeof o.gl==='string')o.gl=mapCol(o.gl,el);}
  return _emit.apply(this,[o,...[].slice.call(arguments,1)]);};
const _cast=window.castSkillNow;
if(typeof _cast==='function')window.castSkillNow=castSkillNow=function(key){const p=CAST;CAST=key;try{return _cast.apply(this,arguments);}finally{CAST=p;}};


/* ===================== step 2: element extras — SVG pieces + code VFX on top of the tinted skill =====================
   Tied to what the gem really does (totem_gems.js hurt hook): fire = the enemy burns 4 s (e._gBurn) → flames on its body, embers,
   scorched ground where hits land · ice = every hit slows (ice crystals + frost round its feet), every 4th hit freezes 0.6 s
   (an ice block round the enemy that shatters when it thaws) · volt = the last hit chains to 2 enemies → crackling sparks on
   every enemy it touched. Every hit of an element skill also bursts in its element at the target. Own pieces are never re-tinted. */
const TAU=Math.PI*2,rnd=(a,b)=>a+Math.random()*(b-a),eOut=k=>1-Math.pow(1-k,3);
const T=()=>{try{return gameTime;}catch(e){return performance.now()/1000;}};
const PJ=(x,y,z)=>{try{return P(x,y,z||0);}catch(e){return [x,y*.6-(z||0)];}};
const CX=()=>{try{return ctx;}catch(e){return null;}};
const ENS=()=>{try{return enemies;}catch(e){return [];}};
const FX=()=>{try{return fx;}catch(e){return [];}};
const onScr=(x,y)=>{try{const sx=x*Z+ox,sy=y*Z+oy;return sx>-160&&sx<cvs.width+160&&sy>-200&&sy<cvs.height+160;}catch(e){return true;}};
const body=e=>{const sc=e.sc||1;return {r:Math.max(10,e.r||16),zc:20*sc+(e.z||0),h:42*sc};};

/* SVG art, rasterised once at 2x (gradients, no dark outlines — VFX_STYLE_REF_TH.md) */
const ART={};
function art(n,w,h,inner){const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const a=ART[n]={c,w,h,ok:0},im=new Image();
  im.onload=()=>{oDraw.call(c.getContext('2d'),im,0,0,w*2,h*2);a.ok=1;};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}">${inner}</svg>`);}
art('flame',40,64,`<defs><linearGradient id="o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d8240c"/><stop offset=".45" stop-color="#ff5a14"/><stop offset="1" stop-color="#ffa02c" stop-opacity=".8"/></linearGradient>
  <linearGradient id="m" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a1a"/><stop offset="1" stop-color="#ffd84a"/></linearGradient>
  <radialGradient id="c" cx=".5" cy=".78" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff4b8"/><stop offset="1" stop-color="#ffd860" stop-opacity="0"/></radialGradient>
  <filter id="b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter></defs>
  <ellipse cx="20" cy="47" rx="15" ry="16" fill="#ff6a1a" opacity=".45" filter="url(#b)"/>
  <path d="M20 63C7 61 2 50 6 39C9 31 8 24 12 17C13 25 17 28 18 21C19 14 18 8 22 1C25 11 31 17 31 26C33 23 34 19 33 15C40 25 40 37 36 47C33 56 28 62 20 63Z" fill="url(#o)"/>
  <path d="M20 62C12 60 9 53 11 45C13 39 13 34 16 29C17 35 19 36 20 31C21 26 21 22 24 17C26 25 30 30 30 37C32 35 32 33 32 31C35 39 34 48 31 54C29 59 25 62 20 62Z" fill="url(#m)"/>
  <path d="M20 61C15 60 13 56 14 51C15 47 17 44 19 40C20 44 22 45 23 42C25 46 27 50 26 54C25 58 23 61 20 61Z" fill="url(#c)"/>`);
art('scorch',72,30,`<defs><radialGradient id="s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#140702" stop-opacity=".78"/><stop offset=".55" stop-color="#2a1006" stop-opacity=".5"/><stop offset="1" stop-color="#3a1a08" stop-opacity="0"/></radialGradient></defs>
  <path d="M36 2C48 1 58 5 64 10C71 14 70 21 63 25C55 29 42 30 32 28C20 29 8 26 4 20C0 14 6 8 14 5C21 2 28 3 36 2Z" fill="url(#s)"/>`);
art('scorchG',72,30,`<defs><filter id="b" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#ff7a1a" stroke-width="3" opacity=".7" filter="url(#b)"><path d="M36 15L28 11L20 13L12 10M36 15L45 10L55 12M36 15L40 21L50 23L58 20M36 15L30 20L21 21"/></g>
  <g stroke="#ffd27a" stroke-width="1.2"><path d="M36 15L28 11L20 13L12 10M36 15L45 10L55 12M36 15L40 21L50 23L58 20M36 15L30 20L21 21"/></g></g><circle cx="36" cy="15" r="2.6" fill="#fff0b0"/>`);
art('crystal',30,40,`<defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4fdff"/><stop offset="1" stop-color="#a8e6ff"/></linearGradient>
  <linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5cc0f2"/><stop offset="1" stop-color="#2a7fc4"/></linearGradient>
  <filter id="b" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
  <ellipse cx="15" cy="37" rx="13" ry="3.4" fill="#bfefff" opacity=".7" filter="url(#b)"/>
  <path d="M4 38L2 24L6 17L9 24L10 38Z" fill="url(#l)"/><path d="M9 24L6 17L11 22L12 38L10 38Z" fill="url(#d)"/>
  <path d="M11 39L10 14L15 2L16 14L16 39Z" fill="url(#l)"/><path d="M16 14L15 2L20 13L20 39L16 39Z" fill="url(#d)"/>
  <path d="M19 39L20 24L25 15L26 25L25 39Z" fill="url(#l)"/><path d="M26 25L25 15L28 24L28 39L25 39Z" fill="url(#d)"/>
  <path d="M13 9L12 30M7 21L6 33M22 21L21 33" stroke="#ffffff" stroke-width=".8" opacity=".85"/>`);
art('block',64,76,`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6fbff" stop-opacity=".72"/><stop offset=".5" stop-color="#9fe0fa" stop-opacity=".5"/><stop offset="1" stop-color="#5fb8e8" stop-opacity=".68"/></linearGradient>
  <linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".8"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
  <path d="M6 72L3 34L12 10L34 2L56 10L61 36L58 70L34 75Z" fill="url(#g)"/>
  <path d="M3 34L12 10L34 2L30 18Z" fill="url(#f)"/><path d="M34 2L56 10L61 36L44 26L30 18Z" fill="#c8f2ff" opacity=".35"/>
  <path d="M6 72L3 34L30 18L24 62Z" fill="#ffffff" opacity=".12"/><path d="M58 70L61 36L44 26L42 64Z" fill="#3e9ed8" opacity=".25"/>
  <g fill="none" stroke="#ffffff" stroke-linecap="round"><path d="M12 10L34 2L56 10" stroke-width="1.4" opacity=".95"/><path d="M3 34L12 10" stroke-width="1.2" opacity=".85"/>
  <path d="M30 18L44 26L42 64M30 18L24 62" stroke-width=".9" opacity=".55"/><path d="M20 40L27 46L23 54M46 38L40 46" stroke-width=".8" opacity=".75"/></g>`);
art('frost',80,30,`<defs><radialGradient id="r" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f0fcff" stop-opacity=".85"/><stop offset=".6" stop-color="#9fdcff" stop-opacity=".55"/><stop offset="1" stop-color="#6cc0f0" stop-opacity="0"/></radialGradient></defs>
  <path d="M40 2C55 2 70 6 76 12C80 17 74 24 62 27C50 30 30 30 18 27C6 24 0 18 4 12C10 6 25 2 40 2Z" fill="url(#r)"/>
  <g stroke="#ffffff" stroke-width="1" fill="none" opacity=".85"><path d="M40 15L30 10L22 12M40 15L52 9M40 15L46 22L58 21M40 15L32 21"/></g>`);

function put(n,x,y,w,o){   /* c.drawImage (not the bare original): the FX layer only shows when its own drawImage marks it dirty */
const A=ART[n],c=CX();if(!A||!A.ok||!c)return;o=o||{};const h=w*A.h/A.w;c.save();c.translate(x,y);if(o.rot)c.rotate(o.rot);if(o.sx||o.sy)c.scale(o.sx||1,o.sy||1);
  if(o.a!=null)c.globalAlpha*=Math.max(0,o.a);if(o.add)c.globalCompositeOperation='lighter';c.drawImage(A.c,-w*(o.ax!=null?o.ax:.5),-h*(o.ay!=null?o.ay:1),w,h);c.restore();}
function glow(x,y,r,col,a){const c=CX();if(!c||a<=0)return;c.save();c.globalCompositeOperation='lighter';c.globalAlpha*=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}
function zig(x1,y1,x2,y2,n,amp){const p=[[x1,y1]],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1;for(let i=1;i<n;i++){const k=i/n,j=(Math.random()-.5)*amp*2;p.push([x1+dx*k-dy/L*j,y1+dy*k+dx/L*j]);}p.push([x2,y2]);return p;}
function bolt(p,col,w,a){const c=CX();if(!c||a<=0)return;const st=()=>{c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.stroke();};
  c.save();c.globalCompositeOperation='lighter';c.lineJoin='round';c.lineCap='round';c.globalAlpha*=a*.35;c.strokeStyle=col;c.lineWidth=w*3.2;st();c.globalAlpha=Math.min(1,c.globalAlpha/.35);c.lineWidth=w;st();c.strokeStyle='#ffffff';c.lineWidth=Math.max(.8,w*.38);st();c.restore();}
function diamond(x,y,s,rot,col,a){const c=CX();if(!c||a<=0)return;c.save();c.globalCompositeOperation='lighter';c.globalAlpha*=a;c.translate(x,y);c.rotate(rot);c.fillStyle=col;c.beginPath();c.moveTo(0,-s*1.6);c.lineTo(s*.6,0);c.lineTo(0,s*1.6);c.lineTo(-s*.6,0);c.closePath();c.fill();c.restore();}
function shard(x,y,s,rot,a){const c=CX();if(!c||a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot);c.fillStyle='#e8fbff';c.beginPath();c.moveTo(0,-s*1.5);c.lineTo(s*.8,s*.6);c.lineTo(-s*.5,s*.9);c.closePath();c.fill();
  c.fillStyle='#6cc0ee';c.beginPath();c.moveTo(0,-s*1.5);c.lineTo(s*.8,s*.6);c.lineTo(s*.15,s*.3);c.closePath();c.fill();c.restore();}
function star4(x,y,s,col,a){const c=CX();if(!c||a<=0)return;c.save();c.globalCompositeOperation='lighter';c.globalAlpha*=a;c.fillStyle=col;c.translate(x,y);
  for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,-s*.18);c.quadraticCurveTo(s*.25,0,s,0);c.quadraticCurveTo(s*.25,0,0,s*.18);c.closePath();c.fill();}c.restore();}

/* one burst per hit (at most one per enemy every 0.12 s) */
let NB=0;
class GfxBurst{constructor(e,el,big){const b=body(e);this.__gt='-';this.layer='top';this.el=el;this.bg=big?1:0;this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=b.r*(big?1.45:1);this.t=0;
    this.life=el==='volt'?.3:el==='ice'?(big?.8:.55):.62;NB++;
    const n=el==='fire'?4:el==='ice'?(big?10:5):4;this.p=[];for(let i=0;i<n;i++)this.p.push({a:i/n*TAU+rnd(-.35,.35),s:rnd(.75,1.25),sp:rnd(.6,1.2)});
    const nd=el==='fire'?6:el==='ice'?(big?14:5):4;this.d=[];for(let i=0;i<nd;i++){const a=rnd(0,TAU),v=rnd(60,150)*(big?1.2:1);
      this.d.push({x:0,y:0,z:0,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:rnd(80,210),rt:rnd(0,TAU),vr:rnd(-12,12),s:rnd(.7,1.3),l:rnd(.35,.7)});}
    this.j=0;this.pts=[];}
  update(dt){this.t+=dt;for(const d of this.d){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=430*dt;d.z+=d.vz*dt;if(d.z<-this.zc){d.z=-this.zc;d.vz*=-.25;d.vx*=.55;d.vy*=.55;}d.rt+=d.vr*dt;}
    if((this.j-=dt)<=0){this.j=.045;this.pts=null;}const on=this.t<this.life;if(!on)NB--;return on;}
  draw(){const k=Math.min(1,this.t/this.life),[x,y]=PJ(this.x,this.y,this.zc),r=this.r,el=this.el;
    if(el==='fire'){glow(x,y,r*(1+.8*eOut(k)),'#ff8a2a',.38*(1-k));glow(x,y,r*.6,'#fff2c0',Math.max(0,.8-k*2.2));
      for(const p of this.p){const d=r*(.2+1.05*eOut(k))*p.sp,s=Math.sin(Math.PI*Math.min(1,k*1.25)),px=x+Math.cos(p.a)*d,py=y+Math.sin(p.a)*d*.7;
        put('flame',px,py,r*1.05*p.s*Math.max(.05,s),{rot:p.a+Math.PI/2,ay:.82,a:1-k*k});}
      for(const d of this.d){if(this.t>d.l)continue;const [ex,ey]=PJ(this.x+d.x,this.y+d.y,this.zc+d.z),a=1-this.t/d.l;diamond(ex,ey,1.6*d.s,d.rt,a>.5?'#ffe08a':'#ff7a2a',a);}}
    else if(el==='ice'){glow(x,y,r*1.2,'#9fe8ff',(this.bg?.55:.32)*(1-k));glow(x,y,r*.5,'#ffffff',Math.max(0,(this.bg?.9:.6)-k*2.5));
      const c=CX();if(c){const rr=r*(.4+1.4*eOut(k));c.save();c.globalAlpha*=.8*(1-k);c.strokeStyle='#e6fbff';c.lineWidth=2.2*(1-k)+.6;c.beginPath();c.ellipse(x,y+this.zc*.55,rr,rr*.42,0,0,TAU);c.stroke();c.restore();}
      for(const d of this.d){if(this.t>d.l+.15)continue;const [ex,ey]=PJ(this.x+d.x,this.y+d.y,this.zc+d.z);shard(ex,ey,3.2*d.s,d.rt,Math.min(1,(d.l+.15-this.t)/.2));}
      for(const p of this.p){const d=r*(.15+.75*eOut(k))*p.sp;star4(x+Math.cos(p.a)*d,y+Math.sin(p.a)*d*.7,r*.34*p.s*(1-k),'#e6fbff',1-k);}}
    else{glow(x,y,r*1.3,'#9a7bff',.42*(1-k));glow(x,y,r*.5,'#ffffff',Math.max(0,.75-k*2.4));
      if(!this.pts){this.pts=this.p.map(p=>{const L=r*(.55+1.1*p.sp);return zig(0,0,Math.cos(p.a)*L,Math.sin(p.a)*L*.75,4,5);});}   /* re-jagged every 45 ms, relative to the hit point */
      for(const q of this.pts)bolt(q.map(([a,b])=>[x+a,y+b]),'#8f74ff',2.2*(1-k*.6),1-k);
      for(const d of this.d){if(this.t>d.l)continue;const [ex,ey]=PJ(this.x+d.x,this.y+d.y,this.zc+d.z);star4(ex,ey,5*d.s,'#d9ccff',1-this.t/d.l);}}}}

/* lasting looks on the enemies (one piece per layer, drawn for every enemy the gem marked) */
const SCORCH=[],EMB=[];
class GfxOv{constructor(layer){this.__gt='-';this.layer=layer;this.t=0;}
  update(dt){this.t+=dt;if(this.layer!=='top')return true;const t=T();
    for(const e of ENS()){if(e.dead){if(e._gfF)e._gfF=0;continue;}
      if(e._gfF&&t>=e._gfFe){e._gfF=0;addB(new GfxBurst(e,'ice',1));}   /* thawed: the ice block shatters (own timer: works on test dummies too) */
      const b=e._gBurn,bs=!(b&&b.n>0)&&e._gFlat&&e._gFlat.n>0;if(((b&&b.n>0)||bs)&&EMB.length<90&&Math.random()<dt*(bs?2.5:5)){const bd=body(e);EMB.push({x:e.x+rnd(-.6,.6)*bd.r,y:e.y+1,z:bd.zc+rnd(-.3,.6)*bd.h*.5,vz:rnd(35,75),vx:rnd(-12,12),t:0,l:rnd(.6,1),s:rnd(.7,1.2),rt:rnd(0,TAU)});}}
    for(let i=EMB.length-1;i>=0;i--){const m=EMB[i];m.t+=dt;m.z+=m.vz*dt;m.x+=m.vx*dt;m.rt+=dt*3;if(m.t>m.l)EMB.splice(i,1);}
    for(let i=SCORCH.length-1;i>=0;i--)if(t-SCORCH[i].t0>3.2)SCORCH.splice(i,1);
    return true;}
  draw(){const t=T(),G=this.layer==='ground';
    if(G)for(const s of SCORCH){const age=t-s.t0,[x,y]=PJ(s.x,s.y,0);if(!onScr(x,y))continue;put('scorch',x,y,s.r*2.4,{ay:.5,a:Math.min(1,(3.2-age)/1.2)*.9});put('scorchG',x,y,s.r*2.2,{ay:.5,add:1,a:Math.max(0,1-age/1.3)});}
    for(const e of ENS()){if(e.dead)continue;const bn=e._gBurn&&e._gBurn.n>0,bs=!bn&&e._gFlat&&e._gFlat.n>0,ice=e._gfI>t,fz=e._gfF&&t<e._gfFe,vt=e._gfV>t;   /* bs = the burn SUPPORT gem (gem_mut_fx.js step 3): two small flames */
      if(!bn&&!bs&&!ice&&!fz&&!vt)continue;const bd=body(e),r=bd.r,[gx,gy]=PJ(e.x,e.y,0);if(!onScr(gx,gy))continue;
      if(G){if(bn||bs)put('scorch',gx,gy+1,r*(bs?1.5:2.1),{ay:.5,a:bs?.4:.55});if(ice||fz)put('frost',gx,gy+1,r*3,{ay:.5,a:.9});continue;}
      if(bs){[[-.45,.3,.62],[.4,.5,.55]].forEach((f,i)=>{const s=f[2]*(.86+.14*Math.sin(t*15+i*2.3)),[fx2,fy2]=PJ(e.x+f[0]*r,e.y+2,bd.h*f[1]);put('flame',fx2,fy2,r*s,{rot:Math.sin(t*8+i*1.9)*.12,ay:.9,a:.85});});}
      if(bn){const n=e._gBurn.n,fa=n<=1?.75:1;glow(gx,gy-bd.zc,r*1.6,'#ff6a1a',.32*fa);
        const F=[[-.62,.22,.82],[.6,.4,.78],[-.12,.72,1],[.28,.02,.66],[.05,.38,.7]];   /* [side, height in body heights, size] */
        F.forEach((f,i)=>{const s=f[2]*(.86+.14*Math.sin(t*15+i*2.1)),[fx2,fy2]=PJ(e.x+f[0]*r,e.y+2,bd.h*f[1]);put('flame',fx2,fy2,r*1.0*s,{rot:Math.sin(t*8+i*1.7)*.12,ay:.9,a:fa*.88});});}
      if(ice&&!fz){const C=[[-.78,.32,.85,-.22],[.82,.28,.75,.2],[.05,.62,.95,.05]];
        for(const c of C){const [cx2,cy2]=PJ(e.x+c[0]*r,e.y+c[1]*r,0);put('crystal',cx2,cy2,r*.85*c[2],{rot:c[3],a:Math.min(1,(e._gfI-t)/.4)});}}
      if(fz){const k=Math.min(1,(t-e._gfF)/.12);put('block',gx,gy+3,r*2.7*(.85+.15*eOut(k)),{a:.95*k});}
      if(vt){const a=Math.min(1,(e._gfV-t)/.3);glow(gx,gy-bd.zc,r*1.4,'#7b5cff',.28*a);
        if(!e._gfP||t-e._gfPt>.055){e._gfPt=t;e._gfP=[0,1].map(()=>{const x1=e.x+rnd(-.7,.7)*r,x2=e.x+rnd(-.7,.7)*r,[ax,ay]=PJ(x1,e.y+2,rnd(.2,1.5)*bd.zc),[bx,by]=PJ(x2,e.y+2,rnd(.2,1.5)*bd.zc);return zig(ax,ay,bx,by,5,5);});}
        for(const q of e._gfP)bolt(q,'#8f74ff',1.6,a);}}
    if(!G)for(const m of EMB){const [x,y]=PJ(m.x,m.y,m.z),a=1-m.t/m.l;diamond(x,y,1.3*m.s,m.rt,a>.55?'#ffe08a':'#ff7a2a',a);}}}
let OVG=null,OVT=null;
function ensureOv(){const F=FX();if(!OVG||!F.includes(OVG))OVG=_add(new GfxOv('ground'));if(!OVT||!F.includes(OVT))OVT=_add(new GfxOv('top'));}
const addB=b=>{if(NB>28){NB--;return;}_add(b);};
function scorch(e){const t=T(),r=body(e).r;for(const s of SCORCH)if(Math.hypot(s.x-e.x,s.y-e.y)<r*.8&&t-s.t0<.5){s.t0=t;return;}if(SCORCH.length>=30)SCORCH.shift();SCORCH.push({x:e.x,y:e.y,r,t0:t});}
function onHit(e,el,o,f0){ensureOv();const t=T(),first=t-(e._gfT||0)>.22;   /* fast multi-hit skills: one burst per enemy every .22 s */
  if(el==='fire'){if(!o._gem&&first){e._gfT=t;addB(new GfxBurst(e,'fire'));scorch(e);}}
  else if(el==='ice'){if(!o._gem){if(first){e._gfT=t;addB(new GfxBurst(e,'ice'));}e._gfI=t+2.2;const st=e.st;if(st&&(st.frozen||0)>f0+.05){if(!e._gfF)e._gfF=t;e._gfFe=Math.max(e._gfFe||0,t+st.frozen);}   /* a new or refreshed freeze */}}
  else{if(!o._gem&&first){e._gfT=t;addB(new GfxBurst(e,'volt'));}e._gfV=t+1.1;}}
const _hurt=window.hurt;
if(typeof _hurt==='function')window.hurt=hurt=function(e,m,o){const oo=o||{},f0=e&&e.st?(e.st.frozen||0):0;const d=_hurt.apply(this,arguments);
  try{if(d>0&&e&&!oo.dot){const pa=PL(),k=oo.auto?'@auto':(oo.skill||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null),el=elemOf(k);if(el)onHit(e,el,oo,f0);}}catch(er){}
  return d;};

/* for hero code that draws a skill's lasting look from a shared watcher (zones, buffs, standards): GEMFX.tint(key, ()=>draw…)
   draws in that skill's element; GEMFX.spawn(key, ()=>…) gives pieces added inside the skill's element. */
function withT(k,fn){const el=elemOf(k);if(!el)return fn();const p=TINT,ps=SES;TINT=el;if(!p)SES=++SEQ;try{return fn();}finally{TINT=p;SES=ps;}}
function withV(k,fn){const el=elemOf(k);if(!el)return fn();const p=VC;VC=el;try{return fn();}finally{VC=p;}}
window.GEMFX={tint:withT,spawn:withV,art:ART,mark(e,kind,d){const t=T();ensureOv();if(kind==='freeze'){e._gfF=t;e._gfFe=t+(d||1);}else if(kind==='ice')e._gfI=t+(d||2);else if(kind==='volt')e._gfV=t+(d||1);},elemOf,mapCol,force(m){FORCE=m||null;},ramp:RAMP,stats:()=>({pix:PIX,clear:CLEAR,map:Object.assign({},MAP)}),
  tintNow:(el,fn)=>{const p=TINT,ps=SES;TINT=el;SES=++SEQ;try{return fn();}finally{TINT=p;SES=ps;}},
  /* the drawing kit, shared with gem_mut_fx.js (the other nine mutation gems) */
  k:{art,put,glow,star4,diamond,zig,bolt,shard,PJ,T,CX,ENS,FX,body,onScr,rnd,eOut,TAU,add:_add,ensureOv,burst:(e,el,big)=>{ensureOv();addB(new GfxBurst(e,el,big));}}};
})();
