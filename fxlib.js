/* =====================================================================
   FXLIB — Totem Legend's own library of skill effects (code VFX + vector sprites).
   Owner 2026-11-25: 'อยากได้เอฟเฟคสกิลเป็น vfx/svg สวยๆ … เก็บไว้เป็น asset ของเราเอาไว้ใช้ตามสถานการณ์ต่างๆ' + 'งานใหญ่ สกิลมันเยอะมาก'.
   Everything here is drawn by our own code (no pictures, nothing copied from another game). Doc: FXLIB_TH.md · gallery: fxlib.html.

   THIS FILE = the kit: element palettes, vector sprites (SVG paths painted once into canvases), a particle system and the
   animated PARTS (slash arc, cut, streak, ring, disc, flash, burst, bolt, beam, pillar, magic circle, projectile, wave, crack,
   spike, flames, dome, tornado, orbit, sprite, telegraph). fxlib_presets.js composes them into the named effects.

   USE     FXLIB.play('boom.blast',{x,y,el:'fire',size:1.2})      → handle {stop()}
           common options: x y z · phi (world angle) · to {x,y} or x2 y2 · follow (entity with x,y[,z]) · el (element) · size · dur
           FXLIB.list = catalogue [{id,cat,th,kind,els}] · FXLIB.EL = elements · FXLIB.k = the kit (parts + helpers) for hand-made effects

   STYLE   (VFX_STYLE_REF_TH.md) no black outlines · every bright shape = ink shadow → deep → mid → lite → white core · soft
           additive halo on top · debris is SHAPED (flames, shards, leaves, stars …), never round dots · floor = rings / cracks / discs
           on the ground layer so units walk over them · the body of an effect is solid, so it also reads on snow and sand.

   ENGINE  uses the game's globals when it runs: ctx (current 2D context) · P(x,y,z) → screen · K (ground squash) · addFx(part).
           A part = {layer:'ground'|'sorted'|'top', update(dt) → alive, draw(), sy (for 'sorted')}. fxlib.html brings a tiny
           stage with the same globals, so the library has no other dependency.
   ===================================================================== */
(()=>{
'use strict';
const TAU=Math.PI*2,cl=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
const eO=t=>1-Math.pow(1-t,3),eO2=t=>1-(1-t)*(1-t),eI=t=>t*t,eIO=t=>t<.5?2*t*t:1-2*(1-t)*(1-t);
const back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0],sg=()=>Math.random()<.5?-1:1;
const KY=()=>(typeof K==='number'?K:.62);
const qn=n=>{let p=1;try{if(typeof Q==='object'&&Q&&Q.p)p=Q.p;}catch(e){}return Math.max(1,Math.round(n*p));};
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';};
const SH=a=>{try{if(typeof shake==='function')shake(a);}catch(e){}};

/* ---------------------------------------------------------------------
   1. PALETTES   [ink (dark shape behind), deep, mid, lite, core]
   --------------------------------------------------------------------- */
const PAL={
 fire:['#2b0a04','#c2260a','#ff6a1f','#ffc24a','#fff6d0'],ember:['#3a1a04','#d86a10','#ffa63a','#ffe0a0','#fff8e0'],
 ice:['#0c2440','#2f7fd0','#6fc8ff','#c9f1ff','#ffffff'],water:['#06263f','#1273c4','#3fb4f0','#a8e6ff','#ffffff'],
 volt:['#1a1648','#5b53e8','#8fb2ff','#dff0ff','#ffffff'],thunder:['#3a2a04','#d89a10','#ffd84a','#fff3a8','#ffffff'],
 wind:['#0d3a2e','#1fa37a','#6fe8b8','#d2ffe9','#ffffff'],earth:['#2a1a0c','#8a5a28','#d49a4a','#f6d79a','#fff6dc'],
 nature:['#0f2f14','#2f9a3c','#7fdc5a','#d6ffb0','#ffffff'],poison:['#16300a','#4f9a12','#a4e02a','#e2ff8a','#fbffe0'],
 holy:['#4a3508','#e0a21a','#ffd75a','#fff2b0','#ffffff'],dark:['#0c0618','#4a1f8a','#8a4be0','#d0a8ff','#f6ecff'],
 arcane:['#2a0a3a','#b01fc0','#ff5fe0','#ffc0f6','#ffffff'],blood:['#2a0308','#a00f1e','#e8283c','#ff8a8a','#ffe6e0'],
 steel:['#141c30','#3f5fae','#8fb2f2','#dce8ff','#ffffff'],moon:['#141a44','#4a5fd8','#a9b8ff','#e8ecff','#ffffff'],
 star:['#2a1a4a','#7a5cf0','#ffd86a','#fff3c0','#ffffff'],soul:['#06302c','#12a08a','#5ff0d0','#c8fff2','#ffffff'],
 sakura:['#3d0c26','#d81e6f','#ff5c9a','#ffb3d0','#ffffff'],
 /* utility palettes */
 shadow:['#050508','#22222e','#4a4a60','#9a9ab4','#e4e4f4'],smoke:['#101014','#3a3a46','#6a6a7a','#a9a9b8','#e6e6f0'],
 dust:['#2a2016','#8a7250','#c8ae84','#eadbb8','#fff6e0'],cloud:['#22304a','#8fa8cc','#cfe0f4','#f2f8ff','#ffffff'],
 gold:['#3a2206','#b8741a','#ffc23a','#ffe89a','#ffffff'],red:['#2a0606','#b8140c','#ff4a2e','#ffb09a','#fff0e8'],
 blue:['#0a1a40','#1f5fd0','#5fa8ff','#c0e0ff','#ffffff'],green:['#0a2a12','#1f9a4a','#5fe08a','#c0ffd0','#ffffff'],
 white:['#20283a','#9fb0d0','#e0eaff','#f6faff','#ffffff'],storm:['#07070f','#1c1c30','#34344e','#5a5a7c','#9a9ac0']};
const pal=e=>Array.isArray(e)?e:(PAL[e]||PAL.steel);
/* the elements a player-facing effect can take (order = the gallery's chips) */
const EL=[['fire','ไฟ'],['ice','น้ำแข็ง'],['volt','สายฟ้า'],['thunder','อัสนีทอง'],['water','น้ำ'],['wind','ลม'],['earth','ดิน'],['nature','พฤกษา'],['poison','พิษ'],
 ['holy','ศักดิ์สิทธิ์'],['dark','มืด'],['arcane','เวทมนตร์'],['blood','เลือด'],['steel','เหล็ก'],['moon','จันทรา'],['star','ดารา'],['soul','วิญญาณ'],['sakura','ซากุระ']];

/* ---------------------------------------------------------------------
   2. TEXTURES + VECTOR SPRITES (painted once, cached)
   --------------------------------------------------------------------- */
const TX={},SC={};
function cv(w,h,f){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));f(c.getContext('2d'),c.width,c.height);return c;}
/* soft light textures by colour: glow · core (white centre) · star (4-point flare) · pool (solid disc, soft rim) · ray (vertical light ray) */
function tex(name,col){col=col||'#ffffff';const k=name+col;if(TX[k])return TX[k];let t;
  if(name==='glow')t=cv(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,rgba(col,1));r.addColorStop(.25,rgba(col,.55));r.addColorStop(.6,rgba(col,.15));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(0,0,64,64);});
  else if(name==='core')t=cv(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,'rgba(255,255,255,.95)');r.addColorStop(.38,rgba(col,.7));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(0,0,64,64);});
  else if(name==='star')t=cv(160,160,g=>{g.globalCompositeOperation='lighter';const r=g.createRadialGradient(80,80,0,80,80,58);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,rgba(col,.9));r.addColorStop(.4,rgba(col,.22));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(0,0,160,160);
    const sp=(an,L,w)=>{g.save();g.translate(80,80);g.rotate(an);const q=g.createLinearGradient(0,0,L,0);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.35,rgba(col,.8));q.addColorStop(1,rgba(col,0));g.fillStyle=q;g.beginPath();g.moveTo(0,-w);g.lineTo(L,0);g.lineTo(0,w);g.closePath();g.fill();g.restore();};
    for(let i=0;i<4;i++)sp(i*Math.PI/2,78,5.5);for(let i=0;i<4;i++)sp(Math.PI/4+i*Math.PI/2,38,3);});
  else if(name==='pool')t=cv(128,128,g=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,rgba(col,.92));r.addColorStop(.62,rgba(col,.85));r.addColorStop(.86,rgba(col,.4));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(0,0,128,128);});
  else if(name==='ray')t=cv(32,128,g=>{const q=g.createLinearGradient(0,0,32,0);q.addColorStop(0,rgba(col,0));q.addColorStop(.5,rgba(col,1));q.addColorStop(1,rgba(col,0));g.fillStyle=q;g.fillRect(0,0,32,128);g.globalCompositeOperation='destination-in';const v=g.createLinearGradient(0,0,0,128);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(.25,'rgba(0,0,0,.9)');v.addColorStop(.8,'rgba(0,0,0,1)');v.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=v;g.fillRect(0,0,32,128);});
  return TX[k]=t;}

const D={},def=(n,w,h,d,o)=>{D[n]=Object.assign({w,h,d},o||{});};
const F=(g,d,fill)=>{g.fillStyle=fill;g.fill(typeof d==='string'?new Path2D(d):d);};
const ST=(g,d,col,lw,cap)=>{g.strokeStyle=col;g.lineWidth=lw;g.lineCap=cap||'round';g.lineJoin='round';g.stroke(typeof d==='string'?new Path2D(d):d);};
const LG=(g,x0,y0,x1,y1,...s)=>{const q=g.createLinearGradient(x0,y0,x1,y1);for(let i=0;i<s.length;i+=2)q.addColorStop(s[i],s[i+1]);return q;};
const RG=(g,x,y,r,...s)=>{const q=g.createRadialGradient(x,y,0,x,y,r);for(let i=0;i<s.length;i+=2)q.addColorStop(s[i],s[i+1]);return q;};
const OV=(g,x,y,rx,ry,rot,fill)=>{g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,TAU);g.fill();};
const inS=(g,cx,cy,k,f)=>{g.save();g.translate(cx,cy);g.scale(k,k);g.translate(-cx,-cy);f();g.restore();};
const star5=(cx,cy,ro,ri,rot=-Math.PI/2)=>{let d='';for(let i=0;i<10;i++){const a=rot+i*Math.PI/5,r=i%2?ri:ro;d+=(i?'L':'M')+(cx+Math.cos(a)*r).toFixed(2)+' '+(cy+Math.sin(a)*r).toFixed(2);}return d+'Z';};
const FLAME='M20 1 C24 12 37 22 36 38 C35 50 28 58 20 58 C11 58 4 50 4 39 C4 30 9 26 11 17 C13 22 15 24 17 24 C15 15 17 7 20 1Z';
const SHIELD='M22 2 L41 8 C41 26 36 40 22 48 C8 40 3 26 3 8Z';
const RUNES=['M16 4 L24 16 L16 28 L8 16 Z M16 10 L16 22','M16 28 L16 5 M8 13 L16 5 L24 13 M10 21 L22 21','M8 5 L24 5 L8 27 L24 27 Z','M16 28 L16 14 M8 6 L8 14 L24 14 L24 6',
 'M22 5 L10 13 L22 19 L10 27','M7 8 L25 26 M25 8 L7 26 M16 3 L16 9','M9 28 L23 12 L16 4 L9 12 L23 28','M8 10 L16 4 L24 10 M8 19 L16 13 L24 19 M8 28 L16 22 L24 28'];
/* f = the direction the art points (so a projectile can turn it along its flight) · n = variants · noink = no dark print behind */
def('flame',40,60,(g,p,v)=>{if(v%2){g.translate(40,0);g.scale(-1,1);}if(v===2){g.translate(5,0);g.scale(.75,1);}
  F(g,FLAME,LG(g,0,58,0,1,0,p[3],.3,p[2],.75,p[1],1,p[1]));inS(g,20,55,.62,()=>F(g,FLAME,LG(g,0,58,0,8,0,p[4],.5,p[3],1,p[2])));inS(g,20,56,.3,()=>F(g,FLAME,p[4]));},{n:3,f:-Math.PI/2});
def('shard',36,44,(g,p,v)=>{const T=[18,1],Rr=[33,17+v*2],B=[21-v*2,43],L=[4,24-v*3],C=[18,20],tri=(a,b,c,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill();};
  g.fillStyle=p[2];g.beginPath();g.moveTo(T[0],T[1]);g.lineTo(Rr[0],Rr[1]);g.lineTo(B[0],B[1]);g.lineTo(L[0],L[1]);g.closePath();g.fill();tri(T,Rr,C,p[4]);tri(Rr,B,C,p[3]);tri(B,L,C,p[1]);},{n:3,f:-Math.PI/2});
def('rock',40,36,(g,p,v)=>{const q=[[8,6],[26,2+v],[38,14],[33,31-v],[14,35],[3,22+v]],C=[19,16],po=(a,col)=>{g.fillStyle=col;g.beginPath();a.forEach((z,i)=>i?g.lineTo(z[0],z[1]):g.moveTo(z[0],z[1]));g.closePath();g.fill();};
  po(q,p[1]);po([q[0],q[1],C,q[5]],p[3]);po([q[1],q[2],C],p[2]);po([C,q[2],q[3],q[4]],rgba(p[0],.55));},{n:3});
def('drop',24,34,(g,p)=>{F(g,'M12 1 C14 10 22 16 22 24 C22 30 17 33 12 33 C7 33 2 30 2 24 C2 16 10 10 12 1Z',LG(g,0,2,0,33,0,p[3],.5,p[2],1,p[1]));OV(g,8,23,2.4,4,-.4,'rgba(255,255,255,.75)');},{f:Math.PI/2});
def('leaf',44,22,(g,p)=>{F(g,'M2 11 C12 0 30 -1 42 11 C30 23 12 22 2 11Z',LG(g,0,0,0,22,0,p[3],.55,p[2],1,p[1]));ST(g,'M4 11 C16 9 28 9 40 11',rgba(p[1],.85),1.3);ST(g,'M14 10 L18 5 M22 10 L27 5 M16 11 L20 16 M25 11 L30 16',rgba(p[1],.5),1);});
def('feather',56,20,(g,p)=>{F(g,'M2 10 C10 3 30 0 54 6 C46 8 44 9 50 12 C40 13 38 14 42 17 C28 20 12 18 2 10Z',LG(g,0,0,56,0,0,p[3],.5,'#ffffff',1,'#ffffff'));ST(g,'M3 10 C16 9 34 8 52 6.5',rgba(p[2],.9),1.2);});
def('bubble',32,32,(g,p)=>{g.fillStyle=RG(g,16,16,14,0,rgba(p[3],.06),.7,rgba(p[2],.28),1,rgba(p[2],.65));g.beginPath();g.arc(16,16,13,0,TAU);g.fill();g.strokeStyle=p[3];g.lineWidth=1.8;g.stroke();
  g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=2;g.lineCap='round';g.beginPath();g.arc(16,16,9,3.6,4.6);g.stroke();OV(g,21,21,1.6,1.6,0,'rgba(255,255,255,.8)');});
def('puff',72,60,(g,p,v)=>{let s=17+v*29;const rn=()=>{s=(s*16807)%2147483647;return s/2147483647;},cs=[];for(let i=0;i<7;i++){const a=rn()*TAU,d=rn()*17;cs.push([36+Math.cos(a)*d*1.25,32+Math.sin(a)*d*.8,11+rn()*9]);}
  const blob=(dx,dy,k)=>{g.beginPath();for(const c of cs){g.moveTo(c[0]+dx+c[2]*k,c[1]+dy);g.arc(c[0]+dx,c[1]+dy,c[2]*k,0,TAU);}};
  blob(0,0,1);g.fillStyle=p[2];g.fill();g.save();g.clip();g.fillStyle=rgba(p[1],.42);g.fillRect(0,36,72,24);blob(-3,-5,.9);g.fillStyle=rgba(p[3],.8);g.fill();blob(-7,-10,.55);g.fillStyle=rgba(p[4],.28);g.fill();g.restore();},{n:3,noink:1});
def('mist',96,64,(g,p,v)=>{let s=5+v*41;const rn=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=0;i<7;i++){const x=22+rn()*52,y=22+rn()*20,r=14+rn()*12,q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(p[3],.5));q.addColorStop(.6,rgba(p[2],.22));q.addColorStop(1,rgba(p[2],0));g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2);}},{n:3,noink:1});
def('cloud',150,74,(g,p,v)=>{let s=91+v*37;const rn=()=>{s=(s*16807)%2147483647;return s/2147483647;},cs=[];for(let i=0;i<9;i++)cs.push([22+i*13+rn()*6,40-Math.sin(i/8*Math.PI)*16+rn()*8,16+rn()*10]);
  const blob=(dx,dy,k)=>{g.beginPath();for(const c of cs){g.moveTo(c[0]+dx+c[2]*k,c[1]+dy);g.arc(c[0]+dx,c[1]+dy,c[2]*k,0,TAU);}};
  g.save();g.beginPath();g.rect(0,0,150,58);g.clip();blob(0,0,1);g.fillStyle=p[1];g.fill();g.clip();blob(-3,-6,.9);g.fillStyle=p[2];g.fill();blob(-7,-12,.6);g.fillStyle=p[3];g.fill();g.restore();OV(g,75,58,60,7,0,rgba(p[0],.55));},{n:2});
def('gust',48,18,(g,p)=>{F(g,'M2 12 C14 2 34 0 46 6 C36 6 30 8 26 11 C18 15 8 15 2 12Z',LG(g,0,0,48,0,0,rgba(p[2],0),.4,p[2],.8,p[3],1,'#ffffff'));ST(g,'M8 11 C18 6 32 4 44 6','rgba(255,255,255,.7)',1.2);},{noink:1});
def('zap',36,36,(g,p,v)=>{const z=v%2?'M5 32 L13 21 L9 17 L20 10 L17 6 L31 3':'M4 28 L15 22 L12 15 L24 13 L21 7 L32 4';ST(g,z,rgba(p[2],.55),6);ST(g,z,p[3],3.2);ST(g,z,'#ffffff',1.5);},{n:2,noink:1});
def('note',30,40,(g,p,v)=>{const gr=LG(g,0,0,0,40,0,p[3],1,p[2]),hd=(x,y)=>OV(g,x,y,6.5,4.8,-.35,gr);g.fillStyle=gr;
  if(v%2){hd(8,32);hd(22,28);g.fillRect(12.5,8,2.6,24);g.fillRect(26.5,4,2.6,24);g.beginPath();g.moveTo(12.5,8);g.lineTo(29.1,4);g.lineTo(29.1,10);g.lineTo(12.5,14);g.closePath();g.fill();}
  else{hd(10,32);g.fillRect(14.6,5,2.6,27);F(g,'M17 5 C24 8 29 13 25 22 C25 16 22 13 17 13Z',gr);}OV(g,v%2?6:8,30.5,2,1.3,-.35,'rgba(255,255,255,.7)');},{n:2});
def('star5',40,40,(g,p)=>{F(g,star5(20,21,18,8.2),LG(g,0,2,0,40,0,p[4],.45,p[3],1,p[2]));F(g,star5(20,21,9,4.2),'rgba(255,255,255,.75)');});
def('rune',32,32,(g,p,v)=>{const d=RUNES[v%8];ST(g,d,rgba(p[2],.5),6);ST(g,d,p[3],3);ST(g,d,'#ffffff',1.3);},{n:8});
def('heart',36,32,(g,p)=>{F(g,'M18 30 C6 20 1 14 1 9 C1 4 5 1 9 1 C13 1 16 3 18 7 C20 3 23 1 27 1 C31 1 35 4 35 9 C35 14 30 20 18 30Z',LG(g,0,0,0,32,0,p[3],.5,p[2],1,p[1]));OV(g,10,8,4,2.6,-.6,'rgba(255,255,255,.75)');});
def('plus',32,32,(g,p)=>{const d='M12 3 L20 3 Q21 3 21 4 L21 11 L28 11 Q29 11 29 12 L29 20 Q29 21 28 21 L21 21 L21 28 Q21 29 20 29 L12 29 Q11 29 11 28 L11 21 L4 21 Q3 21 3 20 L3 12 Q3 11 4 11 L11 11 L11 4 Q11 3 12 3Z';
  F(g,d,LG(g,0,0,0,32,0,p[4],.5,p[3],1,p[2]));inS(g,16,16,.5,()=>F(g,d,'rgba(255,255,255,.7)'));});
def('chev',32,30,(g,p)=>{const c='M16 2 L30 15 L23.5 15 L16 8.5 L8.5 15 L2 15Z';F(g,c,LG(g,0,0,0,16,0,p[4],1,p[3]));g.translate(0,12);F(g,c,LG(g,0,0,0,16,0,p[3],1,p[2]));},{f:-Math.PI/2});
def('skull',36,38,(g,p)=>{F(g,'M18 2 C28 2 34 9 34 17 C34 22 31 25 28 27 L28 33 C28 35 26 36 24 36 L12 36 C10 36 8 35 8 33 L8 27 C5 25 2 22 2 17 C2 9 8 2 18 2Z',LG(g,0,0,0,38,0,'#ffffff',.6,p[4],1,p[3]));
  OV(g,11.5,17,4.6,5.4,.15,p[0]);OV(g,24.5,17,4.6,5.4,-.15,p[0]);F(g,'M18 22 L15.6 26.5 L20.4 26.5Z',p[0]);ST(g,'M13 30 L13 36 M18 30 L18 36 M23 30 L23 36',rgba(p[0],.8),1.4);OV(g,12,17.5,1.6,1.6,0,p[2]);OV(g,25,17.5,1.6,1.6,0,p[2]);});
def('zzz',30,30,(g,p)=>{F(g,'M5 5 L25 5 L25 10 L13 24 L25 24 L25 29 L5 29 L5 24 L17 10 L5 10Z',LG(g,0,0,0,30,0,p[4],1,p[3]));});
def('moon',48,48,(g,p)=>{g.fillStyle=LG(g,0,0,48,48,0,'#ffffff',.5,p[4],1,p[3]);g.beginPath();g.arc(23,24,21,0,TAU);g.fill();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(33,18,18.5,0,TAU);g.fill();g.globalCompositeOperation='source-over';});
def('sun',72,72,(g,p)=>{g.translate(36,36);g.fillStyle=p[2];for(let i=0;i<12;i++){g.rotate(TAU/12);const L=i%2?34:27;g.beginPath();g.moveTo(-5,-18);g.lineTo(0,-L);g.lineTo(5,-18);g.closePath();g.fill();}
  g.fillStyle=RG(g,0,0,19,0,'#ffffff',.45,p[4],.8,p[3],1,p[2]);g.beginPath();g.arc(0,0,19,0,TAU);g.fill();});
def('shield',44,50,(g,p)=>{F(g,SHIELD,LG(g,0,0,44,50,0,p[3],.5,p[2],1,p[1]));inS(g,22,25,.8,()=>ST(g,SHIELD,rgba(p[4],.85),2.2));g.save();g.beginPath();g.rect(0,0,22,50);g.clip();F(g,SHIELD,'rgba(255,255,255,.18)');g.restore();
  F(g,'M19.5 14 L24.5 14 L24.5 21 L31 21 L31 26 L24.5 26 L24.5 36 L19.5 36 L19.5 26 L13 26 L13 21 L19.5 21Z','rgba(255,255,255,.9)');});
def('sword',18,64,(g,p)=>{F(g,'M9 63 L4 50 L4 17 L14 17 L14 50Z',LG(g,4,0,14,0,0,p[3],.5,'#ffffff',.5,p[2],1,p[3]));ST(g,'M9 20 L9 52',rgba(p[1],.5),1);F(g,'M1 13 L17 13 L17 17 L1 17Z',PAL.gold[2]);F(g,'M7 4 L11 4 L11 13 L7 13Z',PAL.earth[1]);OV(g,9,3.4,3,3,0,PAL.gold[3]);},{f:Math.PI/2});
def('arrow',52,12,(g,p)=>{ST(g,'M6 6 L42 6','#e9d2a0',2,'butt');F(g,'M40 1 L51 6 L40 11 L42.5 6Z',LG(g,40,0,51,0,0,p[3],1,'#ffffff'));F(g,'M2 1 L12 1 L15 6 L5 6Z',p[2]);F(g,'M2 11 L12 11 L15 6 L5 6Z',p[1]);},{f:0});
def('bullet',22,8,(g)=>{F(g,'M2 1 L14 1 C19 1 21 3 21 4 C21 5 19 7 14 7 L2 7Z',LG(g,0,0,0,8,0,'#fff3c0',.5,PAL.gold[2],1,PAL.gold[1]));},{f:0});
def('shuriken',40,40,(g,p)=>{g.translate(20,20);for(let i=0;i<4;i++){g.rotate(TAU/4);F(g,'M0 -19 C4 -10 5 -6 6 -3 L0 -5 L-3 -3 C-3 -8 -2 -13 0 -19Z',i%2?p[2]:p[3]);}OV(g,0,0,5.5,5.5,0,p[1]);g.globalCompositeOperation='destination-out';g.beginPath();g.arc(0,0,2.2,0,TAU);g.fill();g.globalCompositeOperation='source-over';});
def('scythe',64,64,(g,p)=>{ST(g,'M21 45 L9 62',PAL.earth[1],3.4);F(g,'M6 42 C8 16 30 3 60 8 C42 12 28 22 24 46 C20 46 12 46 6 42Z',LG(g,6,6,40,46,0,'#ffffff',.4,p[3],1,p[2]));ST(g,'M9 40 C12 20 32 8 56 9','rgba(255,255,255,.9)',1.4);});
def('wisp',36,46,(g,p)=>{F(g,'M18 2 C21 9 32 17 32 29 C32 38 26 44 18 44 C10 44 4 38 4 29 C4 20 11 16 13 9 C14 12 16 13 17 13 C16 9 17 5 18 2Z',RG(g,18,30,20,0,'#ffffff',.4,p[4],.75,p[3],1,p[2]));
  OV(g,13,29,2.3,3.4,0,p[0]);OV(g,23,29,2.3,3.4,0,p[0]);OV(g,13.8,27.8,.9,.9,0,'#ffffff');OV(g,23.8,27.8,.9,.9,0,'#ffffff');ST(g,'M16 35 Q18 37 20 35',rgba(p[0],.8),1.2);OV(g,9,33,2.6,1.6,0,rgba(p[2],.5));OV(g,27,33,2.6,1.6,0,rgba(p[2],.5));},{f:-Math.PI/2});
def('paw',40,40,(g,p)=>{const gr=LG(g,0,0,0,40,0,p[4],1,p[3]);OV(g,20,27,10,8.5,0,gr);OV(g,8,15,4.2,5.6,-.4,gr);OV(g,16,8,4.4,6,0,gr);OV(g,25,8,4.4,6,0,gr);OV(g,33,15,4.2,5.6,.4,gr);});
def('eye',52,30,(g,p)=>{const d='M2 15 C13 1 39 1 50 15 C39 29 13 29 2 15Z';F(g,d,LG(g,0,0,0,30,0,p[1],1,p[0]));ST(g,d,p[3],1.8);g.fillStyle=RG(g,26,15,10,0,p[4],.5,p[3],1,p[2]);g.beginPath();g.arc(26,15,9.5,0,TAU);g.fill();OV(g,26,15,2.6,8,0,p[0]);OV(g,22.5,11.5,1.8,1.8,0,'rgba(255,255,255,.9)');});
def('link',30,16,(g,p)=>{const rr=(y)=>{g.beginPath();if(g.roundRect)g.roundRect(3,y,24,10,5);else g.rect(3,y,24,10);g.stroke();};g.lineWidth=4.2;g.strokeStyle=p[1];rr(3);g.lineWidth=1.6;g.strokeStyle=p[3];rr(2.4);});
def('lantern',30,46,(g,p)=>{ST(g,'M9 9 C9 1 21 1 21 9',PAL.earth[1],2);F(g,'M7 9 L23 9 L25 14 L5 14Z',PAL.earth[1]);F(g,'M6 14 L24 14 L26 36 L4 36Z',RG(g,15,26,15,0,'#ffffff',.35,p[4],.7,p[3],1,p[2]));ST(g,'M15 14 L15 36 M5 25 L25 25',rgba(PAL.earth[0],.55),1.3);F(g,'M4 36 L26 36 L23 42 L7 42Z',PAL.earth[1]);});
def('petal',22,28,(g,p,v)=>{if(v%2){g.translate(22,0);g.scale(-1,1);}F(g,'M11 27 C3 21 1 12 6 3 L11 7 L16 3 C21 12 19 21 11 27Z',LG(g,0,28,0,0,0,p[1],.45,p[2],1,p[4]));ST(g,'M11 24 C10.5 18 10.5 13 11 8','rgba(255,255,255,.6)',1);},{n:2});
def('cross',40,54,(g,p)=>{F(g,'M16 2 L24 2 L25 17 L38 16 L38 25 L25 24 L26 52 L14 52 L15 24 L2 25 L2 16 L15 17Z',LG(g,0,0,0,54,0,'#ffffff',.4,p[4],1,p[3]));g.fillStyle=RG(g,20,20.5,7,0,'#ffffff',1,rgba(p[3],0));g.beginPath();g.arc(20,20.5,7,0,TAU);g.fill();});
def('wing',62,46,(g,p)=>{F(g,'M4 42 C6 22 22 6 58 2 C52 10 48 12 54 14 C46 18 42 20 48 23 C38 26 34 28 40 31 C28 35 18 40 4 42Z',LG(g,0,46,62,0,0,p[3],.5,p[4],1,'#ffffff'));ST(g,'M8 39 C14 26 28 14 50 7 M10 40 C20 32 30 26 42 22',rgba(p[2],.6),1.1);});
def('fist',46,40,(g,p)=>{F(g,'M6 15 C6 8 11 6 15 9 C16 4 23 4 24 9 C25 4 32 4 32 9 C34 6 40 7 40 13 L41 27 C41 34 34 38 26 38 L15 38 C8 38 4 33 5 26Z',LG(g,0,0,0,40,0,p[4],.45,p[3],1,p[2]));ST(g,'M15 10 L15 18 M24 10 L24 18 M32 10 L32 18',rgba(p[1],.6),1.3);ST(g,'M8 24 C16 21 30 21 39 24',rgba(p[1],.45),1.2);},{f:-Math.PI/2});
def('fang',20,38,(g,p)=>{F(g,'M3 2 C13 4 18 13 12 36 C8 23 4 15 3 2Z',LG(g,0,0,20,38,0,'#ffffff',1,p[3]));},{f:Math.PI/2});
def('snow',28,28,(g,p)=>{g.translate(14,14);g.lineCap='round';for(const [lw,c] of [[3.4,rgba(p[2],.6)],[1.6,'#ffffff']]){g.strokeStyle=c;g.lineWidth=lw;for(let i=0;i<6;i++){g.rotate(Math.PI/3);g.beginPath();g.moveTo(0,0);g.lineTo(0,-11);g.moveTo(0,-6.5);g.lineTo(-3.2,-9.5);g.moveTo(0,-6.5);g.lineTo(3.2,-9.5);g.stroke();}}});
def('spark',40,12,(g,p)=>{F(g,'M1 6 L27 2.5 L39 6 L27 9.5Z',LG(g,0,0,40,0,0,rgba(p[2],0),.5,p[3],.85,'#ffffff',1,'#ffffff'));},{f:0,noink:1});
def('ember',14,18,(g,p)=>{F(g,'M7 1 L13 9 L7 17 L1 9Z',LG(g,0,0,0,18,0,p[4],.5,p[3],1,p[2]));});
def('exclaim',14,36,(g,p)=>{F(g,'M3 2 L11 2 L9 24 L5 24Z',LG(g,0,0,0,36,0,p[4],1,p[2]));OV(g,7,31,3.6,3.6,0,p[2]);});
def('xmark',30,30,(g,p)=>{const d='M6 6 L24 24 M24 6 L6 24';ST(g,d,p[1],7);ST(g,d,p[3],3.4);});
def('hex',34,38,(g,p)=>{const d='M17 2 L31 10 L31 28 L17 36 L3 28 L3 10Z';F(g,d,LG(g,0,0,34,38,0,rgba(p[3],.9),.5,rgba(p[2],.75),1,rgba(p[1],.85)));inS(g,17,19,.72,()=>ST(g,d,'rgba(255,255,255,.8)',1.6));});
def('thorn',40,26,(g,p)=>{const d='M2 22 C10 4 28 4 38 20';ST(g,d,p[1],4.4);ST(g,d,p[2],1.8);F(g,'M10 11 L8 3 L14 9Z',p[2]);F(g,'M20 7 L21 0 L25 8Z',p[2]);F(g,'M30 12 L34 5 L34 14Z',p[2]);});
def('bomb',30,34,(g)=>{g.fillStyle=RG(g,15,20,13,0,'#5a5a70',.6,'#22222e',1,'#0a0a10');g.beginPath();g.arc(15,20,12.5,0,TAU);g.fill();F(g,'M11 6 L19 6 L19 10 L11 10Z','#3a3a46');ST(g,'M15 6 C15 2 19 1 22 3','#c8ae84',1.8);OV(g,23,3.5,2.6,2.6,0,PAL.fire[3]);OV(g,10.5,15.5,2.6,4,-.6,'rgba(255,255,255,.5)');});
def('orb',40,40,(g,p)=>{g.fillStyle=RG(g,20,20,18,0,'#ffffff',.3,p[4],.62,p[3],.9,p[2],1,p[1]);g.beginPath();g.arc(20,20,17,0,TAU);g.fill();OV(g,14,13,4.5,3,-.6,'rgba(255,255,255,.75)');});

/* a sprite as a canvas (2× supersampled), with a soft dark print of its own shape behind it */
function spr(name,el,v){v=v||0;const d=D[name],p=pal(el);if(!d)return tex(name==='star4'?'star':name,p[name==='core'?2:3]);const vv=v%(d.n||1),k=name+'|'+p[1]+p[2]+p[3]+'|'+vv;if(SC[k])return SC[k];
  const a=cv(d.w*2,d.h*2,g=>{g.scale(2,2);d.d(g,p,vv);});if(d.noink)return SC[k]=a;
  return SC[k]=cv(a.width+8,a.height+8,g=>{const m=cv(a.width,a.height,q=>{q.drawImage(a,0,0);q.globalCompositeOperation='source-in';q.fillStyle=p[0];q.fillRect(0,0,a.width,a.height);});g.globalAlpha=.42;g.drawImage(m,6,7);g.globalAlpha=1;g.drawImage(a,4,4);});}
const sprF=name=>(D[name]&&D[name].f)||0;

/* small draw helpers (screen space) */
function glowAt(x,y,r,col,a){if(a<=.01||r<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=cl(a,0,1);ctx.drawImage(tex('glow',col),x-r,y-r,r*2,r*2);ctx.restore();}
function coreAt(x,y,r,col,a){if(a<=.01||r<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=cl(a,0,1);ctx.drawImage(tex('core',col),x-r,y-r,r*2,r*2);ctx.restore();}
function starAt(x,y,r,col,a,rot){if(a<=.01||r<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=cl(a,0,1);ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.drawImage(tex('star',col),-r,-r,r*2,r*2);ctx.restore();}
function drawSpr(im,x,y,w,rot,a,flipX){const h=w*im.height/im.width;ctx.save();if(a!=null)ctx.globalAlpha*=cl(a,0,1);ctx.translate(x,y);if(rot)ctx.rotate(rot);if(flipX)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}

/* ---------------------------------------------------------------------
   3. PARTICLES
   --------------------------------------------------------------------- */
class Sys{constructor(layer,sy){this.layer=layer||'top';this.p=[];this.t=0;this._sy=sy||0;this.keep=0;}
  get sy(){return this._sy;}
  add(o){const q=Object.assign({t:0,life:.6,x:0,y:0,z:0,vx:0,vy:0,vz:0,dr:0,g:0,s0:10,s1:null,a0:1,fi:.03,fo:.5,rot:0,vr:0,add:0,str:0,flat:0,bounce:.25,wob:0,wf:6,ph:Math.random()*TAU},o);if(q.s1==null)q.s1=q.s0;if(q.delay)q.t=-q.delay;if(q.to){q.x0=q.x;q.y0=q.y;q.z0=q.z;}if((q.str||q.face)&&q.la==null)q.la=Math.atan2(q.vy*KY()-q.vz,q.vx);this.p.push(q);return q;}
  update(dt){this.t+=dt;const p=this.p;for(let i=p.length-1;i>=0;i--){const q=p[i];q.t+=dt;if(q.t<0)continue;if(q.t>=q.life){p.splice(i,1);continue;}
      if(q.orb){q.ang+=q.va*dt;q.r=Math.max(0,q.r+(q.vr2||0)*dt);q.z+=q.vz*dt;const c=q.cf;if(c){q.cx=c.x;q.cy=c.y;}q.x=q.cx+Math.cos(q.ang)*q.r;q.y=q.cy+Math.sin(q.ang)*q.r;}
      else if(q.to){const e=eI(cl(q.t/q.life,0,1));q.x=lerp(q.x0,q.to.x,e);q.y=lerp(q.y0,q.to.y,e);q.z=lerp(q.z0,(q.to.z||0)+(q.tz||0),e);}
      else{const f=Math.exp(-q.dr*dt);q.vx*=f;q.vy*=f;q.vz=q.vz*f-q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;if(q.z<0&&q.g>0){q.z=0;q.vz=-q.vz*q.bounce;q.vx*=.5;q.vy*=.5;q.vr*=.4;}}
      q.rot+=q.vr*dt;}
    return p.length>0||this.t<this.keep;}
  draw(){const ky=KY();for(const q of this.p){if(q.t<0)continue;const k=q.t/q.life,a=q.a0*Math.min(1,q.t/q.fi)*(k>1-q.fo?(1-k)/q.fo:1);if(a<=.01)continue;
      const s=q.s0+(q.s1-q.s0)*(q.lin?k:eO(k)),wx=q.wob?Math.sin(q.t*q.wf+q.ph)*q.wob:0,S2=P(q.x+wx,q.y,q.z),x=S2[0],y=S2[1],im=q.im,asp=im.height/im.width;
      ctx.save();ctx.globalAlpha*=Math.min(1,a);if(q.add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);
      if(q.str||q.face){const lx=q.lx==null?x:q.lx,ly=q.ly==null?y:q.ly,dx=x-lx,dy=y-ly;q.lx=x;q.ly=y;if(dx*dx+dy*dy>.0004)q.la=Math.atan2(dy,dx);
        if(q.face){ctx.rotate((q.la||0)-(q.fa||0));ctx.drawImage(im,-s/2,-s*asp/2,s,s*asp);}else{const L=Math.max(s,Math.hypot(dx,dy)*q.str*6);ctx.rotate(q.la||0);ctx.drawImage(im,-L*.8,-s*asp*.5,L,s*asp);}}
      else{if(q.flat)ctx.scale(1,ky);const r=q.rot+(q.wr?Math.sin(q.t*q.wf+q.ph)*q.wr:0);if(r)ctx.rotate(r);ctx.drawImage(im,-s/2,-s*asp*(q.ay==null?.5:q.ay),s,s*asp);}
      ctx.restore();}}
  kill(){this.keep=0;for(const q of this.p)q.life=Math.min(q.life,Math.max(0,q.t)+.2);}}

/* how each element's debris looks and moves: [sprite, {up:[min,max] launch, g gravity (− = rises), sp spread speed, sz size, s1 end size ×, life, …}] */
const BIT={
 fire:[['flame',{up:[40,130],g:-70,sp:70,sz:[12,22],s1:.2,life:[.35,.7],wob:3}],['spark',{up:[60,200],g:300,sp:190,sz:[9,14],s1:.5,life:[.3,.55],add:1,str:1}]],
 ice:[['shard',{up:[120,280],g:760,sp:180,sz:[9,17],s1:.8,life:[.5,.9],spin:12}],['snow',{up:[10,60],g:40,sp:70,sz:[7,12],s1:.7,life:[.6,1.1],spin:2,wob:5}]],
 water:[['drop',{up:[120,300],g:800,sp:170,sz:[8,14],s1:.8,life:[.45,.8],face:1}],['bubble',{up:[30,90],g:-30,sp:40,sz:[6,12],s1:1.25,life:[.5,.9],wob:4}]],
 volt:[['zap',{up:[0,30],g:0,sp:30,sz:[14,26],s1:.9,life:[.07,.16],add:1,jit:1}],['spark',{up:[40,180],g:260,sp:230,sz:[9,14],s1:.5,life:[.25,.5],add:1,str:1}]],
 wind:[['gust',{up:[0,40],g:0,sp:230,sz:[18,30],s1:1.3,life:[.25,.45],face:1,dr:3}],['leaf',{up:[40,150],g:200,sp:150,sz:[10,15],life:[.6,1],spin:7,wob:8,dr:2}]],
 earth:[['rock',{up:[160,340],g:900,sp:170,sz:[8,16],life:[.5,.9],spin:10,bounce:.35}],['rock',{up:[80,200],g:900,sp:230,sz:[5,9],life:[.4,.8],spin:14,bounce:.3}]],
 nature:[['leaf',{up:[60,200],g:260,sp:150,sz:[12,18],life:[.6,1.1],spin:6,wob:8,dr:2}],['petal',{up:[40,150],g:160,sp:110,sz:[8,12],life:[.7,1.2],spin:5,wob:10,dr:2}]],
 poison:[['bubble',{up:[30,110],g:-40,sp:50,sz:[7,14],s1:1.3,life:[.5,.9],wob:4}],['drop',{up:[100,240],g:700,sp:130,sz:[7,11],life:[.4,.7],face:1}]],
 holy:[['star4',{up:[20,90],g:-20,sp:90,sz:[12,24],s1:.2,life:[.4,.8],add:1}],['feather',{up:[40,140],g:90,sp:90,sz:[16,24],life:[.8,1.4],spin:2,wob:10,dr:2}]],
 dark:[['shard',{up:[100,240],g:620,sp:170,sz:[8,15],s1:.7,life:[.45,.8],spin:11}],['ember',{up:[30,110],g:-50,sp:60,sz:[6,11],s1:.2,life:[.5,.9],wob:4}]],
 arcane:[['rune',{up:[20,80],g:-10,sp:70,sz:[11,17],s1:.8,life:[.5,.9],dr:2}],['star4',{up:[10,70],g:-10,sp:110,sz:[10,20],s1:.2,life:[.35,.7],add:1}]],
 blood:[['drop',{up:[120,280],g:820,sp:160,sz:[7,12],s1:.8,life:[.4,.75],face:1}],['ember',{up:[60,160],g:500,sp:200,sz:[5,8],life:[.3,.6]}]],
 steel:[['spark',{up:[60,220],g:320,sp:240,sz:[10,16],s1:.5,life:[.25,.5],add:1,str:1}],['star4',{up:[0,40],g:0,sp:60,sz:[10,18],s1:.2,life:[.2,.4],add:1}]],
 moon:[['moon',{up:[20,90],g:-10,sp:80,sz:[8,13],s1:.6,life:[.5,.9],spin:3}],['star4',{up:[10,70],g:-10,sp:100,sz:[10,20],s1:.2,life:[.4,.8],add:1}]],
 star:[['star5',{up:[80,220],g:420,sp:170,sz:[9,16],s1:.7,life:[.5,.9],spin:8}],['star4',{up:[10,70],g:-10,sp:110,sz:[10,22],s1:.2,life:[.4,.8],add:1}]],
 soul:[['flame',{up:[40,120],g:-60,sp:60,sz:[10,18],s1:.2,life:[.4,.8],wob:4}],['ember',{up:[30,100],g:-40,sp:70,sz:[5,9],s1:.2,life:[.5,.9],wob:5}]],
 sakura:[['petal',{up:[60,180],g:150,sp:140,sz:[9,14],life:[.8,1.4],spin:5,wob:10,dr:2}],['star4',{up:[0,50],g:0,sp:70,sz:[8,16],s1:.2,life:[.3,.6],add:1}]]};
BIT.ember=BIT.fire;BIT.thunder=BIT.volt;BIT.gold=BIT.steel;BIT.red=BIT.blood;BIT.shadow=BIT.dark;BIT.blue=BIT.ice;BIT.green=BIT.nature;BIT.white=BIT.holy;
/* element debris thrown from a point. o: sp / up / size multipliers · dir + spread (a cone instead of all round) · only (0|1 = one kind) · life */
function bits(S,el,x,y,z,n,o){o=o||{};const B=BIT[el]||BIT.steel,k=o.size||1;n=qn(n);for(let i=0;i<n;i++){const b=B[o.only!=null?o.only:(i%3===2?1:0)],c=b[1],a=o.dir!=null?o.dir+R(-1,1)*(o.spread==null?.5:o.spread):R(0,TAU),v=c.sp*R(.35,1)*(o.sp==null?1:o.sp),s=R(c.sz[0],c.sz[1])*k;
    const q={im:spr(b[0],el,i),x:x+(c.jit?R(-14,14)*k:0),y:y+(c.jit?R(-8,8)*k:0),z:z+(c.jit?R(-10,16)*k:0),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.75,vz:R(c.up[0],c.up[1])*(o.up==null?1:o.up),g:c.g,dr:c.dr||1.4,s0:s,s1:s*(c.s1==null?1:c.s1),life:R(c.life[0],c.life[1])*(o.life||1),
      rot:c.face?0:(c.spin||c.jit?R(0,TAU):0),vr:c.spin?R(-c.spin,c.spin):0,add:c.add||0,str:c.str||0,face:c.face?1:0,fa:sprF(b[0]),wob:c.face?0:(c.wob||0),bounce:c.bounce==null?.25:c.bounce,delay:o.delay?R(0,o.delay):0};
    S.add(q);}}
function sparks(S,col,x,y,z,n,sp,up,life){n=qn(n);for(let i=0;i<n;i++){const a=R(0,TAU),v=(sp||240)*R(.4,1.1);S.add({im:tex('core',col),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R(-.2,1)*(up||120)+40,dr:4,g:380,s0:R(5,9),s1:2,life:(life||.45)*R(.6,1.2),add:1,str:1.2,fo:.5});}}
function puffs(S,pl,x,y,z,n,size,sp,rise,life,name){n=qn(n);for(let i=0;i<n;i++){const a=R(0,TAU),v=(sp==null?50:sp)*R(.3,1);S.add({im:spr(name||'puff',pl,i),x:x+Math.cos(a)*size*.15,y:y+Math.sin(a)*size*.1,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:rise==null?18:rise,dr:2,s0:size*R(.4,.6),s1:size*R(.95,1.3),life:(life||.8)*R(.75,1.15),fi:.06,fo:.6,a0:R(.75,.95),rot:R(-.4,.4),vr:R(-.5,.5)});}}
function glints(S,col,x,y,z,n,rad,life){n=qn(n);for(let i=0;i<n;i++){const a=R(0,TAU),d=rad*Math.sqrt(Math.random());S.add({im:tex('star',col),x:x+Math.cos(a)*d,y:y+Math.sin(a)*d*.7,z:z+R(0,rad*.6),vz:R(8,36),s0:2,s1:R(14,26),life:(life||.7)*R(.5,1),delay:R(0,.3),fo:.6,add:1,rot:R(0,.8)});}}

/* ---------------------------------------------------------------------
   4. PARTS
   --------------------------------------------------------------------- */
let CUR=null;
function run(h,fn){const pv=CUR;CUR=h||null;try{return fn();}finally{CUR=pv;}}
const A=p=>{if(CUR){if(CUR.dead)return p;CUR.parts.push(p);p._h=CUR;}return addFx(p);};
const sys=(layer,sy)=>A(new Sys(layer,sy));
class Part{constructor(o,d){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,delay:0,size:1},d,o);this.t=-(this.delay||0);if(this.el||this.pal)this.p=pal(this.pal||this.el);}
  get sy(){return (this.follow?this.follow.y:this.y)+(this.sortOff||0);}
  pos(){const f=this.follow;return f?[f.x+(this.ox||0),f.y+(this.oy||0),(f.z||0)+this.z]:[this.x,this.y,this.z];}
  cb(fn,...a){return run(this._h,()=>fn(...a));}
  update(dt){this.t+=dt;if(this.t<0)return true;if(this.until&&!this._u&&!this.until()){this._u=1;this.life=Math.min(this.life,this.t+(this.fo||.2));}if(this.tick)this.tick(dt);
    if(this.t>=this.life){if(this.onEnd&&!this._e){this._e=1;this.cb(this.onEnd,this);}return false;}return true;}
  draw(){if(this.t<0||this.t>=this.life)return;this.paint();}
  kill(){this.onEnd=null;this.life=Math.min(this.life,Math.max(0,this.t)+(this.fo||.15));}}
/* calls fn(part) every `every` seconds — the timeline of lasting effects (zones, buffs, rains) */
class Emit extends Part{constructor(o){super(o,{layer:'ground',every:.05,life:1});this.acc=this.every;}
  tick(dt){this.acc+=dt;let n=0;while(this.acc>=this.every&&n++<8){this.acc-=this.every;this.cb(this.fn,this);}}
  paint(){}kill(){this.onEnd=null;this.life=0;}}
const after=(sec,fn)=>A(new Emit({life:sec,every:1e9,fn(){},onEnd:fn}));

/* -- sword arc: a crescent in a tilted plane. phi = facing · a0→a1 = sweep (0 = straight ahead) · tilt 0 = level, π/2 = vertical · swing = seconds of the sweep -- */
class Arc extends Part{constructor(o){super(o,{R:64,w:22,a0:-1.6,a1:1.6,tilt:0,swing:.11,life:.3,z:30,phi:0,el:'steel',glint:1});}
  w3(th,r){const c=Math.cos(this.phi),s=Math.sin(this.phi),ct=Math.cos(this.tilt),st=Math.sin(this.tilt),o=this.pos(),a=Math.cos(th)*r,b=Math.sin(th)*r;return [o[0]+c*a-s*ct*b,o[1]+s*a+c*ct*b,o[2]+st*b];}
  head(){const h=(this.ease||eO)(cl(this.t/this.swing,0,1));return this.w3(lerp(this.a0,this.a1,h),this.R*this.size);}
  paint(){const t=this.t,sw=this.swing,L=this.life,p=this.p,h=(this.ease||eO)(cl(t/sw,0,1)),tl=eI(cl((t-sw*.45)/(L-sw*.45),0,1)),th0=lerp(this.a0,this.a1,tl),th1=lerp(this.a0,this.a1,h);if(Math.abs(th1-th0)<.03)return;
    const al=cl((L-t)/(L*.3),0,1),N=Math.max(8,Math.ceil(Math.abs(th1-th0)*10)),Rr=this.R*this.size,W=this.w*this.size,pr=[],TH=[];
    for(let i=0;i<=N;i++){const s=i/N;TH.push(lerp(th0,th1,s));pr.push(Math.pow(Math.sin(Math.PI*Math.pow(s,1.7)),.75));}
    const poly=(wk,gr)=>{ctx.beginPath();for(let i=0;i<=N;i++){const q=this.w3(TH[i],Rr+gr),s=P(q[0],q[1],q[2]);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}for(let i=N;i>=0;i--){const q=this.w3(TH[i],Rr-W*wk*pr[i]-gr),s=P(q[0],q[1],q[2]);ctx.lineTo(s[0],s[1]);}ctx.closePath();};
    ctx.save();ctx.globalAlpha*=al;ctx.save();ctx.translate(1.5,2.5);poly(1.14,2);ctx.fillStyle=rgba(p[0],.45);ctx.fill();ctx.restore();
    poly(1,0);ctx.fillStyle=p[1];ctx.fill();poly(.7,0);ctx.fillStyle=p[2];ctx.fill();poly(.42,0);ctx.fillStyle=p[3];ctx.fill();poly(.17,0);ctx.fillStyle=p[4];ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();for(let i=Math.floor(N*.3);i<=N;i++){const q=this.w3(TH[i],Rr-W*.2),s=P(q[0],q[1],q[2]);i>Math.floor(N*.3)?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}
    ctx.strokeStyle=rgba(p[2],.15);ctx.lineWidth=W*1.1;ctx.stroke();ctx.strokeStyle=rgba(p[3],.2);ctx.lineWidth=W*.5;ctx.stroke();ctx.restore();
    if(this.glint&&t<sw*1.6){const q=this.w3(th1,Rr),s=P(q[0],q[1],q[2]);starAt(s[0],s[1],W*1.5,p[3],.9*(1-t/(sw*1.6)),t*6);}}}
/* -- a cut mark on a body: a short tapered blade of light at a screen angle -- */
class Cut extends Part{constructor(o){super(o,{L:60,w:9,ang:R(-.9,.9),life:.2,el:'steel',z:24});}
  paint(){const k=this.t/this.life,g=eO(cl(this.t/(this.life*.25),0,1)),th=1-eI(cl((k-.3)/.7,0,1)),len=this.L*this.size*g,wd=this.w*this.size*th,o=this.pos(),s=P(o[0],o[1],o[2]),p=this.p;if(wd<.3)return;
    const bl=(sc,ws)=>{ctx.beginPath();ctx.moveTo(-len*.5*sc,0);ctx.lineTo(-len*.12,-wd*.5*ws);ctx.lineTo(len*.5*sc,0);ctx.lineTo(-len*.12,wd*.5*ws);ctx.closePath();};
    ctx.save();ctx.translate(s[0],s[1]);ctx.rotate(this.ang);ctx.save();ctx.translate(1.5,2);bl(1.06,1.5);ctx.fillStyle=rgba(p[0],.45);ctx.fill();ctx.restore();bl(1,1);ctx.fillStyle=p[2];ctx.fill();bl(.92,.5);ctx.fillStyle=p[4];ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.55*th;ctx.drawImage(tex('glow',p[2]),-len*.6,-wd*2.2,len*1.2,wd*4.4);ctx.restore();}}
/* -- a streak between two world points (thrust, dash, tracer): the head runs A→B, the tail follows -- */
class Streak extends Part{constructor(o){super(o,{w:10,life:.22,go:.35,el:'steel',z:26,head:1});if(this.z2==null)this.z2=this.z;}
  paint(){const k=this.t/this.life,hk=eO(cl(k/this.go,0,1)),tk=eI(cl((k-this.go*.5)/(1-this.go*.5),0,1)),p=this.p,al=cl((1-k)/.25,0,1);if(hk-tk<.01)return;
    const Aw=[lerp(this.x,this.x2,tk),lerp(this.y,this.y2,tk),lerp(this.z,this.z2,tk)],Bw=[lerp(this.x,this.x2,hk),lerp(this.y,this.y2,hk),lerp(this.z,this.z2,hk)],a=P(Aw[0],Aw[1],Aw[2]),b=P(Bw[0],Bw[1],Bw[2]),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,w=this.w*this.size;
    const bl=(ws,ex)=>{ctx.beginPath();ctx.moveTo(-ex,0);ctx.lineTo(L*.72,-w*.5*ws);ctx.lineTo(L+ex,0);ctx.lineTo(L*.72,w*.5*ws);ctx.closePath();};
    ctx.save();ctx.globalAlpha*=al;ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(dy,dx));ctx.save();ctx.translate(1.5,2.5);bl(1.5,2);ctx.fillStyle=rgba(p[0],.4);ctx.fill();ctx.restore();bl(1.25,0);ctx.fillStyle=p[1];ctx.fill();bl(1,0);ctx.fillStyle=p[2];ctx.fill();bl(.6,0);ctx.fillStyle=p[3];ctx.fill();bl(.28,0);ctx.fillStyle=p[4];ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.5;ctx.drawImage(tex('glow',p[2]),-L*.05,-w*2,L*1.15,w*4);ctx.restore();if(this.head)starAt(b[0],b[1],w*1.8,p[3],al*.9,this.t*5);}}
/* -- ground ring: 'shock' (a band that thins as it runs out) or 'dash' (broken, turning) -- */
class Ring extends Part{constructor(o){super(o,{layer:'ground',r0:10,r1:80,w0:10,w1:1,life:.4,style:'shock',a:1,el:'steel',ease:1});this.rot=R(0,TAU);}
  paint(){const k=this.t/this.life,e=this.ease?eO(k):k,r=lerp(this.r0,this.r1,e)*this.size,w=Math.max(.6,lerp(this.w0,this.w1,k)*this.size),al=this.a*(this.hold?cl(this.t/.12,0,1)*cl((this.life-this.t)/.25,0,1):Math.pow(1-k,1.2)),o=this.pos(),s=P(o[0],o[1],o[2]),p=this.p;if(r<=0)return;
    ctx.save();ctx.globalAlpha*=al;ctx.translate(s[0],s[1]);ctx.scale(1,KY());if(this.style==='dash'){ctx.setLineDash([r*.55,r*.3]);ctx.lineDashOffset=-(this.rot+this.t*(this.spin==null?1.6:this.spin))*r;}
    const c=(rr,lw,col,oy)=>{ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.beginPath();ctx.arc(oy?1:0,oy||0,rr,0,TAU);ctx.stroke();};
    c(r,w+3,rgba(p[0],.4),2.5);c(r,w,p[2]);c(r+w*.22,Math.max(.6,w*.4),p[4]);ctx.globalCompositeOperation='lighter';c(r,w*2.4,rgba(p[2],.18));ctx.restore();}}
/* -- ground disc: a soft light pool ('glow') or a solid pool ('pool': shadow, scorch, puddle) -- */
class Disc extends Part{constructor(o){super(o,{layer:'ground',r0:40,r1:null,life:.6,kind:'glow',a:.7,add:1,fi:.08,fo:.3,col:'#ffffff'});if(this.r1==null)this.r1=this.r0;}
  paint(){const k=this.t/this.life,r=lerp(this.r0,this.r1,eO(k))*this.size,al=this.a*cl(this.t/this.fi,0,1)*cl((this.life-this.t)/this.fo,0,1),o=this.pos(),s=P(o[0],o[1],o[2]);if(al<=.01||r<=0)return;
    ctx.save();ctx.globalAlpha*=al;if(this.add)ctx.globalCompositeOperation='lighter';ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.drawImage(tex(this.kind,this.col),-r,-r,r*2,r*2);ctx.restore();}}
/* -- point flash: white core + 4-point flare -- */
class Flash extends Part{constructor(o){super(o,{s0:20,s1:70,life:.2,el:'steel',star:1,z:24});}
  paint(){const k=this.t/this.life,s=lerp(this.s0,this.s1,eO(k))*this.size,a=Math.pow(1-k,1.1),o=this.pos(),q=P(o[0],o[1],o[2]),p=this.p;coreAt(q[0],q[1],s,p[2],a);if(this.star)starAt(q[0],q[1],s*1.25,p[3],a,this.rot||.3);}}
/* -- comic burst: a spiky star that pops, then pulls back into its centre -- */
class Burst extends Part{constructor(o){super(o,{r:36,n:9,life:.26,flat:0,inner:.45,el:'steel',z:24});this.sp=[];for(let i=0;i<this.n;i++)this.sp.push(R(.65,1.15));if(this.rot==null)this.rot=R(0,TAU);}
  paint(){const k=this.t/this.life,pop=back(cl(this.t/(this.life*.3),0,1)),sh=1-eI(cl((k-.4)/.6,0,1)),r=this.r*this.size*pop,o=this.pos(),s=P(o[0],o[1],o[2]),p=this.p,n=this.n;
    const poly=(sc,inn)=>{ctx.beginPath();for(let i=0;i<n*2;i++){const a=this.rot+i*Math.PI/n,rr=(i%2?inn*(.7+.3*sh):this.sp[i>>1]*(.25+.75*sh))*r*sc,X=Math.cos(a)*rr,Y=Math.sin(a)*rr;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.closePath();};
    ctx.save();ctx.globalAlpha*=cl((1-k)/.22,0,1);ctx.translate(s[0],s[1]);if(this.flat)ctx.scale(1,KY());ctx.save();ctx.translate(1.5,2.5);poly(1.14,this.inner);ctx.fillStyle=rgba(p[0],.5);ctx.fill();ctx.restore();
    poly(1,this.inner);ctx.fillStyle=p[2];ctx.fill();poly(.74,this.inner*.9);ctx.fillStyle=p[3];ctx.fill();poly(.44,this.inner*.8);ctx.fillStyle=p[4];ctx.fill();ctx.restore();glowAt(s[0],s[1],r*1.7,p[2],.5*(1-k));}}
/* -- lightning: a jagged ribbon between two world points that re-jags while it lives -- */
class Bolt extends Part{constructor(o){super(o,{life:.28,w:5,jag:13,rej:.05,branch:2,el:'volt',z2:0});this.gen();this.jt=0;}
  gen(){const n=Math.max(4,Math.round(Math.hypot(this.x2-this.x,this.y2-this.y,(this.z2||0)-(this.z||0))/24));this.off=[0];for(let i=1;i<n;i++)this.off.push(R(-1,1));this.off.push(0);this.br=[];for(let b=0;b<this.branch;b++)this.br.push({i:1+Math.floor(Math.random()*(n-1)),a:R(.5,1.1)*sg(),l:R(.16,.32),o:[R(-1,1),R(-1,1)]});}
  tick(dt){this.jt+=dt;if(this.jt>=this.rej&&this.t<this.life*.6){this.jt=0;this.gen();}}
  paint(){const k=this.t/this.life,a=P(this.x,this.y,this.z||0),b=P(this.x2,this.y2,this.z2||0),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,n=this.off.length-1,p=this.p,w=this.w*this.size*(k<.5?1:1-(k-.5)*1.4),al=(k<.6?1:cl((1-k)/.4,0,1))*(Math.random()<.15?.6:1),jg=this.jag*this.size,an=Math.atan2(dy,dx);if(w<=.2)return;
    const tr=()=>{ctx.beginPath();for(let i=0;i<=n;i++){const s=i/n,o=this.off[i]*jg,X=a[0]+dx*s+nx*o,Y=a[1]+dy*s+ny*o;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}
      for(const q of this.br){const s=q.i/n,o=this.off[q.i]*jg,X=a[0]+dx*s+nx*o,Y=a[1]+dy*s+ny*o,l=L*q.l;ctx.moveTo(X,Y);ctx.lineTo(X+Math.cos(an+q.a)*l*.5+q.o[0]*6,Y+Math.sin(an+q.a)*l*.5+q.o[1]*6);ctx.lineTo(X+Math.cos(an+q.a*.6)*l,Y+Math.sin(an+q.a*.6)*l);}};
    const st=(lw,c)=>{ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.stroke();};
    ctx.save();ctx.globalAlpha*=al;ctx.lineJoin='miter';ctx.miterLimit=3;ctx.lineCap='round';ctx.save();ctx.translate(1.5,2.5);tr();st(w+4,rgba(p[0],.4));ctx.restore();tr();st(w+2.5,p[1]);st(w,p[2]);st(w*.5,p[4]);
    ctx.globalCompositeOperation='lighter';st(w*3.4,rgba(p[2],.14));st(w*1.9,rgba(p[3],.18));ctx.restore();}}
/* -- beam: a straight ray A → B (or → a target that moves) with running pulses -- */
class Beam extends Part{constructor(o){super(o,{life:.5,w:12,grow:.07,el:'arcane',z:28});}
  ends(){const o=this.pos(),tg=this.to;return [P(o[0],o[1],o[2]),tg?P(tg.x,tg.y,(tg.z||0)+(this.z2==null?this.z:this.z2)):P(this.x2,this.y2,this.z2==null?this.z:this.z2)];}
  paint(){const t=this.t,k=t/this.life,[a,b]=this.ends(),g=eO(cl(t/this.grow,0,1)),sh=1-eI(cl((k-.6)/.4,0,1)),w=this.w*this.size*g*sh*(1+.1*Math.sin(t*52)),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),p=this.p;if(w<.4||L<2)return;
    const bar=(ww,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(ww*1.1,-ww/2);ctx.lineTo(L-ww*.5,-ww/2);ctx.lineTo(L,0);ctx.lineTo(L-ww*.5,ww/2);ctx.lineTo(ww*1.1,ww/2);ctx.closePath();ctx.fill();};
    ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(dy,dx));ctx.save();ctx.translate(1.5,3);bar(w*1.5,rgba(p[0],.4));ctx.restore();bar(w*1.3,p[1]);bar(w,p[2]);bar(w*.62,p[3]);bar(w*.3,p[4]);
    ctx.globalCompositeOperation='lighter';bar(w*2.6,rgba(p[2],.14));for(let i=0;i<3;i++){const u=((t*2.6+i/3)%1)*L;ctx.fillStyle=rgba(p[4],.5);ctx.beginPath();ctx.ellipse(u,0,w*1.1,w*.42,0,0,TAU);ctx.fill();}ctx.restore();
    glowAt(a[0],a[1],w*2.2,p[2],.8);glowAt(b[0],b[1],w*3,p[3],.9);starAt(b[0],b[1],w*3.2,p[3],.9,t*3);}}
/* -- pillar of light / fire / water standing on a ground point -- */
class Pillar extends Part{constructor(o){super(o,{life:.7,w:46,h:260,rise:.1,el:'holy'});}
  paint(){const t=this.t,k=t/this.life,o=this.pos(),s=P(o[0],o[1],o[2]),x=s[0],y=s[1],p=this.p,g=eO(cl(t/this.rise,0,1)),sh=k<.55?1:1-eIO((k-.55)/.45),w=this.w*this.size*(.3+.7*sh)*(1+.06*Math.sin(t*40)),h=this.h*this.size*g,al=k<.7?1:cl((1-k)/.3,0,1),ky=KY();if(h<2)return;
    const col=(ww,c,a)=>{const gr=ctx.createLinearGradient(0,y,0,y-h);gr.addColorStop(0,rgba(c,a));gr.addColorStop(.7,rgba(c,a*.75));gr.addColorStop(1,rgba(c,0));ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(x-ww/2,y);ctx.lineTo(x-ww*.42,y-h);ctx.lineTo(x+ww*.42,y-h);ctx.lineTo(x+ww/2,y);ctx.ellipse(x,y,ww/2,ww/2*ky,0,0,Math.PI);ctx.closePath();ctx.fill();};
    ctx.save();ctx.globalAlpha*=al;col(w*1.25,p[0],.3);col(w,p[1],.85);col(w*.74,p[2],.95);col(w*.46,p[3],1);col(w*.2,p[4],1);ctx.globalCompositeOperation='lighter';col(w*2.2,p[2],.16);
    for(let i=0;i<3;i++){const u=(t*1.4+i/3)%1,rw=w*(.8+.15*i)*(1-u*.3);ctx.strokeStyle=rgba(p[4],.55*(1-u));ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-h*u*.9,rw/2,rw/2*ky,0,0,TAU);ctx.stroke();}ctx.restore();}}
/* -- a column that gushes out of the ground (geyser, lava, blood, poison; tip 'flame' = a tall tongue of fire) -- */
class Gush extends Part{constructor(o){super(o,{layer:'sorted',w:40,h:150,life:.8,rise:.12,fall:.3,el:'water',tip:'foam'});this.ph=R(0,TAU);this.lump=[0,1,2,3,4,5].map(()=>[R(-.5,.5),R(-.12,.1),R(.2,.34)]);}
  paint(){const t=this.t,L=this.life,g=t<this.rise?eO(t/this.rise):(t>L-this.fall?1-eI((t-(L-this.fall))/this.fall):1),s=this.size,h=this.h*s*g,w=this.w*s*(.72+.28*g),q=P(this.x,this.y,0),p=this.p,N=12,fl=this.tip==='flame',ky=KY();if(h<2)return;
    const hw=(u,sd,k)=>{const wob=Math.sin(u*9-t*14+this.ph+sd)*.09+Math.sin(u*19-t*23+this.ph*2)*.05,prof=fl?Math.pow(1-u,.62)*(.9+.2*Math.sin(u*5-t*8)):(.6+.22*Math.pow(u,3)+.2*(1-u)*(1-u));return sd*w*.5*k*Math.max(0,prof+wob*(fl?(1-u):1));};
    const shape=(k,hk,col)=>{const H=h*hk;ctx.beginPath();ctx.moveTo(hw(0,-1,k),0);for(let i=1;i<=N;i++){const u=i/N;ctx.lineTo(hw(u,-1,k)+(fl?Math.sin(u*4-t*7)*w*.12*u:0),-H*u);}for(let i=N;i>=0;i--){const u=i/N;ctx.lineTo(hw(u,1,k)+(fl?Math.sin(u*4-t*7)*w*.12*u:0),-H*u);}ctx.closePath();ctx.fillStyle=col;ctx.fill();};
    ctx.save();ctx.translate(q[0],q[1]);ctx.fillStyle=rgba(p[0],.3);ctx.beginPath();ctx.ellipse(2,2,w*.8,w*.8*ky*.6,0,0,TAU);ctx.fill();
    ctx.save();ctx.translate(2,2.5);shape(1.14,1.02,rgba(p[0],.42));ctx.restore();shape(1,1,p[1]);shape(.78,.97,p[2]);shape(.5,.92,p[3]);shape(.22,.84,p[4]);
    if(!fl){for(const c of this.lump){const bx=c[0]*w*.95,by=-h*(1+c[1])+Math.sin(t*11+c[0]*9)*2*s,r=w*c[2];ctx.fillStyle=p[3];ctx.beginPath();ctx.arc(bx,by,r,0,TAU);ctx.fill();ctx.fillStyle=p[4];ctx.beginPath();ctx.arc(bx-r*.2,by-r*.25,r*.6,0,TAU);ctx.fill();}
      ctx.fillStyle=p[3];ctx.beginPath();ctx.ellipse(0,0,w*.62,w*.62*ky*.6,0,0,TAU);ctx.fill();}
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.4;ctx.drawImage(tex('glow',p[2]),-w*1.3,-h*1.05,w*2.6,h*1.2);ctx.restore();}}
/* -- a cone of breath (fire, frost, poison): a wobbling tongue from the mouth along phi -- */
class Cone extends Part{constructor(o){super(o,{layer:'top',len:190,half:.3,life:.8,fi:.14,fo:.22,el:'fire',z:28,phi:0});this.ph=R(0,TAU);}
  paint(){const t=this.t,a=cl(t/this.fi,0,1),out=cl((this.life-t)/this.fo,0,1),p=this.p,s=this.size,N=12,o=this.pos(),L=this.len*s*eO(a)*(.5+.5*out),c=Math.cos(this.phi),sn=Math.sin(this.phi),tn=Math.tan(this.half);if(L<3)return;
    const pt=(u,sd,k,lk)=>{const d=L*lk*u,wv=1+.16*Math.sin(u*10-t*18+this.ph+sd*1.3)+.08*Math.sin(u*23-t*31+sd),hw=(tn*d*(1-.3*u*u)*wv+4*s)*k*sd;return P(o[0]+c*d-sn*hw,o[1]+sn*d+c*hw,o[2]+Math.sin(u*Math.PI)*L*.06*Math.abs(c));};
    const shape=(k,lk,col)=>{ctx.beginPath();for(let i=0;i<=N;i++){const q=pt(i/N,-1,k,lk);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}const tp=pt(1.07,0,k,lk);ctx.lineTo(tp[0],tp[1]);for(let i=N;i>=0;i--){const q=pt(i/N,1,k,lk);ctx.lineTo(q[0],q[1]);}ctx.closePath();ctx.fillStyle=col;ctx.fill();};
    ctx.save();ctx.globalAlpha*=(.4+.6*out);ctx.save();ctx.translate(1.5,3);shape(1.12,1.03,rgba(p[0],.4));ctx.restore();shape(1,1,p[1]);shape(.76,.93,p[2]);shape(.5,.82,p[3]);shape(.24,.64,p[4]);
    ctx.globalCompositeOperation='lighter';shape(1.5,1.08,rgba(p[2],.13));ctx.restore();}}
/* -- magic circle on the ground (painted once per element + shape, then turned) -- */
const SIG_ICON={fire:'flame',ember:'flame',ice:'snow',water:'drop',volt:'zap',thunder:'zap',wind:'gust',earth:'rock',nature:'leaf',poison:'skull',holy:'cross',dark:'eye',arcane:'rune',blood:'drop',steel:'sword',moon:'moon',star:'star5',soul:'wisp',sakura:'petal'};
function sigilTex(el,n){const p=pal(el),k='sig'+p[2]+p[1]+n;if(TX[k])return TX[k];return TX[k]=cv(320,320,g=>{g.translate(160,160);g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.42),.8,rgba(p[0],.3),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();
    g.shadowColor=p[2];g.shadowBlur=9;g.lineJoin='round';const ci=(r,lw,c)=>{g.lineWidth=lw;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();};ci(140,5,p[2]);ci(127,2,p[3]);ci(58,3,p[2]);ci(48,1.4,p[3]);
    for(let i=0;i<24;i++){const a=i/24*TAU;g.save();g.rotate(a);g.fillStyle=i%2?p[3]:p[2];g.beginPath();if(i%2){g.moveTo(133.5,-2.6);g.lineTo(137,0);g.lineTo(133.5,2.6);g.lineTo(130,0);}else g.rect(130.5,-1.2,6,2.4);g.closePath();g.fill();g.restore();}
    const pg=(m,st,r,lw,c)=>{g.lineWidth=lw;g.strokeStyle=c;g.beginPath();for(let i=0;i<=m;i++){const a=-Math.PI/2+i*st*TAU/m;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.stroke();};
    if(n===3){pg(3,1,118,3,p[2]);g.save();g.rotate(Math.PI);pg(3,1,118,3,p[2]);g.restore();}else if(n===4){pg(4,1,118,3,p[2]);g.save();g.rotate(Math.PI/4);pg(4,1,118,3,p[2]);g.restore();}else{pg(n,1,118,2.6,p[2]);pg(n,2,118,2.2,p[3]);}
    const m=n===3?6:n===4?8:n;for(let i=0;i<m;i++){const a=-Math.PI/2+i*TAU/m,x=Math.cos(a)*118,y=Math.sin(a)*118;g.fillStyle=p[0];g.beginPath();g.arc(x,y,9,0,TAU);g.fill();g.lineWidth=2.2;g.strokeStyle=p[3];g.stroke();g.fillStyle=p[4];g.beginPath();g.arc(x,y,3,0,TAU);g.fill();}
    g.shadowBlur=0;const ic=spr(SIG_ICON[el]||'rune',p,0);g.drawImage(ic,-30,-30*ic.height/ic.width,60,60*ic.height/ic.width);});}
class Sigil extends Part{constructor(o){super(o,{layer:'ground',r:70,n:6,spin:.6,life:1.2,fi:.22,fo:.3,el:'arcane',a:1});if(this.rot==null)this.rot=R(0,TAU);}
  paint(){const t=this.t,L=this.life,pop=back(cl(t/this.fi,0,1)),out=cl((L-t)/this.fo,0,1),r=this.r*this.size*(.6+.4*pop)*(1+.08*(1-out)),o=this.pos(),s=P(o[0],o[1],o[2]),im=this.tex||sigilTex(this.pal||this.el,this.n),pu=.5+.5*Math.sin(t*5);
    ctx.save();ctx.globalAlpha*=this.a*cl(t/(this.fi*.6),0,1)*out;ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.rotate(this.rot+t*this.spin);ctx.drawImage(im,-r*1.14,-r*1.14,r*2.28,r*2.28);ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.25+.3*pu;ctx.drawImage(im,-r*1.14,-r*1.14,r*2.28,r*2.28);ctx.restore();}}
/* -- projectile: flies to a point / a target, draws a head + a ribbon trail, calls onHit(x,y,z) when it lands -- */
class Proj extends Part{constructor(o){super(o,{life:9,speed:520,head:'orb',r:9,trail:.16,tw:1,lob:0,spin:0,z:28,homing:1,curve:0,el:'arcane',glow:1});this.x0=this.x;this.y0=this.y;this.z0=this.z;this.h=[];this.cx=this.x;this.cy=this.y;this.cz=this.z;
    const g=this.goal();this.T=this.T||Math.max(.05,Math.hypot(g[0]-this.x,g[1]-this.y,(g[2]-this.z)*.6)/this.speed);this.ang=Math.atan2(g[1]-this.y,g[0]-this.x);const a=P(this.x,this.y,this.z),b=P(g[0],g[1],g[2]);this.sa=Math.atan2(b[1]-a[1],b[0]-a[0]);}
  goal(){const t=this.to;return t&&(this.homing||this.x2==null)?[t.x,t.y,this.z2!=null?this.z2:(t.z||0)+(this.tz==null?24:this.tz)]:[this.x2,this.y2,this.z2==null?this.z:this.z2];}
  get sy(){return this.cy;}
  update(dt){this.t+=dt;if(this.t<0)return true;if(this.done){this.dt2+=dt;while(this.h.length&&this.t-this.h[0][3]>this.trail)this.h.shift();return this.h.length>1&&this.dt2<.3;}
    const g=this.goal(),u=cl(this.t/this.T,0,1),e=this.ease?this.ease(u):u,px=this.cx,py=this.cy,pz=this.cz,dx=g[0]-this.x0,dy=g[1]-this.y0,L=Math.hypot(dx,dy)||1,cv2=this.curve*Math.sin(Math.PI*u);
    this.cx=lerp(this.x0,g[0],e)-dy/L*cv2;this.cy=lerp(this.y0,g[1],e)+dx/L*cv2;this.cz=lerp(this.z0,g[2],e)+this.lob*Math.sin(Math.PI*u);
    const a=P(px,py,pz),b=P(this.cx,this.cy,this.cz);if(Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1])>.01)this.sa=Math.atan2(b[1]-a[1],b[0]-a[0]);
    this.h.push([this.cx,this.cy,this.cz,this.t]);while(this.h.length&&this.t-this.h[0][3]>this.trail)this.h.shift();if(this.emit)this.cb(this.emit,this,dt);
    if(u>=1){this.done=1;this.dt2=0;if(this.onHit)this.cb(this.onHit,this.cx,this.cy,this.cz,this);}return true;}
  draw(){if(this.t<0)return;this.paint();}
  paint(){const p=this.p,h=this.h,n=h.length,r=this.r*this.size;
    if(n>1&&this.tw>0){const pts=h.map(q=>P(q[0],q[1],q[2])),rib=(ws,col)=>{ctx.fillStyle=col;ctx.beginPath();const Lf=[],Rt=[];for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=r*this.tw*ws*Math.pow(i/(n-1),1.3);Lf.push([pts[i][0]-dy/l*w,pts[i][1]+dx/l*w]);Rt.push([pts[i][0]+dy/l*w,pts[i][1]-dx/l*w]);}
        ctx.moveTo(Lf[0][0],Lf[0][1]);for(let i=1;i<n;i++)ctx.lineTo(Lf[i][0],Lf[i][1]);for(let i=n-1;i>=0;i--)ctx.lineTo(Rt[i][0],Rt[i][1]);ctx.closePath();ctx.fill();};
      ctx.save();ctx.save();ctx.translate(1.5,2.5);rib(1.25,rgba(p[0],.35));ctx.restore();rib(1,p[1]);rib(.72,p[2]);rib(.4,p[3]);ctx.globalCompositeOperation='lighter';rib(1.8,rgba(p[2],.16));ctx.restore();}
    if(this.done)return;const s=P(this.cx,this.cy,this.cz),hd=this.head,str=typeof hd==='string',rot=this.spin?this.t*this.spin:(this.upright?Math.sin(this.t*9)*.18:this.sa-(str?sprF(hd):0));if(this.glow)glowAt(s[0],s[1],r*2.6*this.glow,p[2],.75);
    if(typeof hd==='function')hd(this,s[0],s[1],r,this.sa);else drawSpr(str?spr(hd,this.hpal||this.pal||this.el,this.hv||0):hd,s[0],s[1],r*2.2*(this.hw||1),rot);if(this.glow&&!this.nostar)starAt(s[0],s[1],r*1.6,p[3],.55,this.t*4);}}
/* -- a crescent that flies along the ground (sword wave, wind blade, shock front) -- */
class Wave extends Part{constructor(o){super(o,{life:.45,dist:220,r:46,w:16,span:1.05,z:20,phi:0,el:'steel',up:0});}
  paint(){const k=this.t/this.life,d=this.dist*eO2(k),c=Math.cos(this.phi),s=Math.sin(this.phi),r=this.r*this.size*(1+.3*k),cx=this.x+c*(d-r),cy=this.y+s*(d-r),al=k<.6?1:cl((1-k)/.4,0,1),W=this.w*this.size*(1-k*.35),p=this.p,N=14,sp=this.span;
    const pt=(th,rr)=>this.up?P(cx+c*Math.cos(th)*rr,cy+s*Math.cos(th)*rr,this.z+r*.9+Math.sin(th)*rr):P(cx+Math.cos(this.phi+th)*rr,cy+Math.sin(this.phi+th)*rr,this.z);
    const poly=(wk,gr)=>{ctx.beginPath();for(let i=0;i<=N;i++){const q=pt(lerp(-sp,sp,i/N),r+gr);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=N;i>=0;i--){const u=i/N,q=pt(lerp(-sp,sp,u),r-W*wk*Math.pow(Math.sin(Math.PI*u),.8)-gr);ctx.lineTo(q[0],q[1]);}ctx.closePath();};
    ctx.save();ctx.globalAlpha*=al;ctx.save();ctx.translate(1.5,2.5);poly(1.15,2);ctx.fillStyle=rgba(p[0],.45);ctx.fill();ctx.restore();poly(1,0);ctx.fillStyle=p[1];ctx.fill();poly(.7,0);ctx.fillStyle=p[2];ctx.fill();poly(.42,0);ctx.fillStyle=p[3];ctx.fill();poly(.17,0);ctx.fillStyle=p[4];ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.beginPath();for(let i=0;i<=N;i++){const q=pt(lerp(-sp,sp,i/N),r-W*.2);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.lineCap='round';ctx.strokeStyle=rgba(p[2],.16);ctx.lineWidth=W*1.2;ctx.stroke();ctx.restore();}
  front(){const k=cl(this.t/this.life,0,1),d=this.dist*eO2(k);return [this.x+Math.cos(this.phi)*d,this.y+Math.sin(this.phi)*d];}}
/* -- cracks in the ground: round a point (n rays) or along a line (line = length); hot = glowing seam that cools -- */
class Crack extends Part{constructor(o){super(o,{layer:'ground',life:1.4,r:70,n:6,line:0,hot:1,w:3,el:'earth',phi:0});this.gen();}
  gen(){this.L=[];const mk=(a,len,ox,oy)=>{const pts=[[ox||0,oy||0]];let x=ox||0,y=oy||0;const st=Math.max(3,Math.round(len/11));for(let i=0;i<st;i++){const an=a+R(-.62,.62),d=len/st*R(.7,1.3);x+=Math.cos(an)*d;y+=Math.sin(an)*d;pts.push([x,y]);}return pts;};
    const side=(m,a,len)=>{for(let i=1;i<m.length-1;i++)if(Math.random()<.34)this.L.push(mk(a+sg()*R(.5,1.15),len*R(.12,.28),m[i][0],m[i][1]));};
    if(this.line){const m=mk(this.phi,this.line);this.L.push(m);side(m,this.phi,this.line*.8);}
    else for(let i=0;i<this.n;i++){const a=i/this.n*TAU+R(-.3,.3),len=this.r*R(.55,1),m=mk(a,len);this.L.push(m);side(m,a,len*1.4);}}
  paint(){const k=this.t/this.life,open=eO(cl(this.t/.12,0,1)),al=k<.6?1:cl((1-k)/.4,0,1),hot=this.hot*cl(1-this.t/(this.life*.5),0,1),q=P(this.x,this.y,0),p=this.p,s=this.size,w=this.w*s;
    /* each crack is drawn piece by piece so it tapers to a point; three passes: soft dark bed, black split, hot seam that cools */
    const pass=(wk,col,grow)=>{ctx.strokeStyle=col;for(const m of this.L){const n=m.length-1,show=n*open;for(let i=0;i<n&&i<show;i++){const u=i/n,f=Math.min(1,show-i),lw=Math.max(.5,w*wk*(1-u*.85))+grow;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(m[i][0]*s,m[i][1]*s);ctx.lineTo((m[i][0]+(m[i+1][0]-m[i][0])*f)*s,(m[i][1]+(m[i+1][1]-m[i][1])*f)*s);ctx.stroke();}}};
    ctx.save();ctx.globalAlpha*=al;ctx.translate(q[0],q[1]);ctx.scale(1,KY());ctx.lineCap='round';ctx.lineJoin='round';pass(1,rgba(p[0],.5),2.2);pass(.62,'rgba(12,9,8,.9)',0);
    if(hot>.02){ctx.globalCompositeOperation='lighter';pass(1.5,rgba(p[2],.42*hot),2);pass(.4,rgba(p[3],.95*hot),0);}ctx.restore();}}
/* -- a faceted spike that shoots out of the ground (ice crystal, rock, dark thorn, light blade) -- */
class Spike extends Part{constructor(o){super(o,{layer:'sorted',h:60,w:20,lean:R(-.25,.25),life:1,rise:.1,sink:.22,el:'ice'});}
  paint(){const t=this.t,L=this.life,g=t<this.rise?back(t/this.rise):(t>L-this.sink?cl((L-t)/this.sink,0,1):1),s=this.size,h=this.h*s*g,w=this.w*s*(t>L-this.sink?(.55+.45*g):1),q=P(this.x,this.y,0),p=this.p,tx=this.lean*h,ty=-h,mx=w*.14;if(h<1)return;
    const tri=(a,b,c,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.closePath();ctx.fill();};
    ctx.save();ctx.translate(q[0],q[1]);ctx.fillStyle=rgba(p[0],.35);ctx.beginPath();ctx.ellipse(w*.15,1,w*.85,w*.3,0,0,TAU);ctx.fill();tri([-w/2-2,2],[tx+2,ty-2],[w/2+4,3],rgba(p[0],.5));
    tri([-w/2,0],[tx,ty],[mx,0],p[2]);tri([mx,0],[tx,ty],[w/2,0],p[3]);tri([-w/2,0],[lerp(-w/2,tx,.5),lerp(0,ty,.5)],[mx,0],rgba(p[1],.85));tri([mx,0],[lerp(mx,tx,.82),lerp(0,ty,.82)],[w*.34,0],rgba(p[4],.75));
    ctx.strokeStyle=rgba(p[4],.9);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(mx,0);ctx.lineTo(tx,ty);ctx.stroke();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.5*g;ctx.drawImage(tex('glow',p[2]),-w*1.2,-w*.9,w*2.4,w*1.4);ctx.restore();}}
/* -- living flames: a few tongues that sway (fire zones, burning, torches, rage) -- */
class Flames extends Part{constructor(o){super(o,{layer:'sorted',h:46,w:30,n:3,life:1.2,fi:.12,fo:.25,el:'fire',z:0});this.tg=[];for(let i=0;i<this.n;i++)this.tg.push({ox:(this.n>1?(i/(this.n-1)-.5):0)*this.w*.9+R(-3,3),hk:i===((this.n-1)>>1)?1:R(.5,.78),ph:R(0,TAU),sp:R(7,11),wk:R(.5,.7)});}
  paint(){const t=this.t,a=cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1),o=this.pos(),q=P(o[0],o[1],o[2]),p=this.p,s=this.size;if(a<=.01)return;if(this.a!=null){ctx.save();ctx.globalAlpha*=this.a;}
    const tongue=(g,sc)=>{const h=this.h*s*g.hk*(.82+.18*Math.sin(t*g.sp+g.ph))*a*sc,hw=this.w*s*g.wk*.5*a*(.35+.65*sc),bx=g.ox*s,dx=Math.sin(t*g.sp*.7+g.ph)*h*.16;ctx.moveTo(bx-hw,0);ctx.bezierCurveTo(bx-hw*1.35,-h*.38,bx+dx*.35-hw*.25,-h*.66,bx+dx,-h);ctx.bezierCurveTo(bx+dx*.35+hw*.45,-h*.62,bx+hw*1.3,-h*.3,bx+hw,0);ctx.quadraticCurveTo(bx,hw*.5,bx-hw,0);};
    const lay=(sc,col)=>{ctx.fillStyle=col;ctx.beginPath();for(const g of this.tg)tongue(g,sc);ctx.fill();};
    ctx.save();ctx.translate(q[0],q[1]);ctx.save();ctx.translate(1.5,2);lay(1.1,rgba(p[0],.4));ctx.restore();lay(1,p[1]);lay(.78,p[2]);lay(.55,p[3]);lay(.3,p[4]);ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.55*a;const gr=this.w*s*1.3;ctx.drawImage(tex('glow',p[2]),-gr,-gr*1.1,gr*2,gr*1.6);ctx.restore();if(this.a!=null)ctx.restore();}}
/* -- shield bubble round a unit -- */
class Dome extends Part{constructor(o){super(o,{layer:'sorted',r:38,life:2,fi:.18,fo:.25,el:'holy',sortOff:1,z:0});this.hitT=-9;}
  hit(){this.hitT=this.t;}
  paint(){const t=this.t,pop=back(cl(t/this.fi,0,1)),out=cl((this.life-t)/this.fo,0,1),hf=cl(1-(t-this.hitT)/.25,0,1),r=this.r*this.size*(.5+.5*pop)*(1+.02*Math.sin(t*4))*(1+.06*hf),o=this.pos(),q=P(o[0],o[1],o[2]),x=q[0],y=q[1]-r*.78,p=this.p;
    ctx.save();ctx.globalAlpha*=cl(t/(this.fi*.5),0,1)*out;const g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,rgba(p[4],.1+.3*hf));g.addColorStop(.7,rgba(p[2],.16+.2*hf));g.addColorStop(1,rgba(p[2],.5));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*.98,0,0,TAU);ctx.fill();
    ctx.lineWidth=2.2;ctx.strokeStyle=p[3];ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle=rgba(p[4],.9);ctx.beginPath();ctx.ellipse(x,y,r-2.5,r*.98-2.5,0,0,TAU);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.ellipse(x,y,r*.78,r*.76,0,3.5,4.5);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*.78,r*.76,0,4.7,4.95);ctx.stroke();
    const sw=(t*.7)%1.6;if(sw<1){ctx.save();ctx.beginPath();ctx.ellipse(x,y,r,r*.98,0,0,TAU);ctx.clip();ctx.globalCompositeOperation='lighter';ctx.fillStyle=rgba(p[4],.16);ctx.translate(x-r+sw*2*r,y);ctx.rotate(.35);ctx.fillRect(-r*.14,-r*1.4,r*.28,r*2.8);ctx.restore();}
    ctx.globalCompositeOperation='lighter';ctx.lineWidth=7;ctx.strokeStyle=rgba(p[2],.2);ctx.beginPath();ctx.ellipse(x,y,r,r*.98,0,0,TAU);ctx.stroke();ctx.restore();}}
/* -- whirlwind: stacked turning bands; half = -1 (the far side) / 1 (the near side) so a unit can stand inside -- */
class Tornado extends Part{constructor(o){super(o,{layer:'sorted',r0:14,r1:54,h:150,n:9,spin:9,life:2,fi:.25,fo:.3,el:'wind',half:0});}
  get sy(){return (this.follow?this.follow.y:this.y)+(this.half<0?-1:1);}
  paint(){if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}const t=this.t,a=cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1),p=this.p,ky=KY(),s=this.size,N=this.n;if(a<=.01)return;
    ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';
    if(this.half<=0){const M=14,rr=u=>lerp(this.r0,this.r1,Math.pow(u,1.25))*s*(.6+.4*a),sw=u=>Math.sin(t*2.2+u*(N-1)*.6)*7*u*s,pt=(u,sd,k)=>{const q=P(this.x+sw(u)+sd*rr(u)*k*(1+.06*Math.sin(u*14-t*9+sd)),this.y,this.h*s*u*a);return q;};
      const body=(k,col)=>{ctx.beginPath();for(let i=0;i<=M;i++){const q=pt(i/M,-1,k);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=M;i>=0;i--){const q=pt(i/M,1,k);ctx.lineTo(q[0],q[1]);}ctx.closePath();ctx.fillStyle=col;ctx.fill();};
      const b0=P(this.x,this.y,0),t0=P(this.x+sw(1),this.y,this.h*s*a),gr=ctx.createLinearGradient(0,b0[1],0,t0[1]);gr.addColorStop(0,rgba(p[1],.72));gr.addColorStop(.55,rgba(p[2],.5));gr.addColorStop(1,rgba(p[2],.22));body(1,gr);
      const g2=ctx.createLinearGradient(0,b0[1],0,t0[1]);g2.addColorStop(0,rgba(p[3],.5));g2.addColorStop(1,rgba(p[3],.08));body(.5,g2);
      ctx.fillStyle=rgba(p[0],.32);ctx.beginPath();ctx.ellipse(t0[0],t0[1],rr(1),rr(1)*ky,0,0,TAU);ctx.fill();}
    for(let i=0;i<N;i++){const u=i/(N-1),z=this.h*s*u*a,r=lerp(this.r0,this.r1,Math.pow(u,1.25))*s*(.6+.4*a),ph=t*this.spin*(1-.35*u)+i*1.9,sway=Math.sin(t*2.2+i*.6)*7*u*s,q=P(this.x+sway,this.y,z),len=2.3+.5*Math.sin(i*2.1);
      for(const half of (this.half?[this.half]:[-1,1])){const lo=half>0?0:Math.PI,hi=lo+Math.PI;for(let c=-1;c<=1;c++){const a0=ph%TAU+c*TAU,a1=a0+len,s0=Math.max(a0,lo),s1=Math.min(a1,hi);if(s1-s0<.05)continue;
          const lw=(4+5*u)*s,arc=(w,col,dy)=>{ctx.lineWidth=w;ctx.strokeStyle=col;ctx.beginPath();ctx.ellipse(q[0],q[1]+(dy||0),r,r*ky,0,s0,s1);ctx.stroke();};
          arc(lw+2.5,rgba(p[0],.3),2);arc(lw,half>0?p[2]:p[1]);arc(lw*.45,half>0?p[4]:p[3],-lw*.2);}}}
    ctx.restore();}}
/* -- sprites circling a unit (half = -1 far side / 1 near side; FXLIB.k.orbit() adds both) -- */
class Orbit extends Part{constructor(o){super(o,{layer:'sorted',n:3,r:26,z:40,spin:4,life:2,w:14,half:0,bob:3,fi:.15,fo:.2,face:0,selfSpin:0,ph:0});}
  get sy(){return (this.follow?this.follow.y:this.y)+(this.half<0?-1:1);}
  paint(){const t=this.t,a=cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1),o=this.pos(),s=this.size;if(a<=.01)return;for(let i=0;i<this.n;i++){const an=this.ph+t*this.spin+i*TAU/this.n,sn=Math.sin(an);if(this.half&&((sn>=0)!==(this.half>0)))continue;
      const q=P(o[0]+Math.cos(an)*this.r*s,o[1]+sn*this.r*s,o[2]+Math.sin(t*3+i)*this.bob),im=Array.isArray(this.im)?this.im[i%this.im.length]:this.im;if(this.glow)glowAt(q[0],q[1],this.w*s*.9,this.glow,.6*a);
      drawSpr(im,q[0],q[1],this.w*s*(1+.12*sn),this.selfSpin?t*this.selfSpin+i:(this.tiltK?Math.cos(an)*this.tiltK:0),a*(sn<0?.8:1),this.face&&-sn*this.spin<0);}}}
function orbit(o){return [A(new Orbit(Object.assign({},o,{half:-1}))),A(new Orbit(Object.assign({},o,{half:1})))];}
/* -- one animated sprite (icons, marks, a moon, a falling sword …) -- */
class Spr extends Part{constructor(o){super(o,{w:30,life:.8,fi:.08,fo:.25,pop:0,s0:1,s1:1,rot:0,spin:0,vx:0,vy:0,vz:0,gz:0,flat:0,add:0,a:1,z:0});}
  tick(dt){if(this.mt!=null&&this.t>this.mt)return;this.x+=this.vx*dt;this.y+=this.vy*dt;this.vz-=this.gz*dt;this.z+=this.vz*dt;if(this.gz&&this.z<0){this.z=0;this.vz=0;if(this.onLand&&!this._l){this._l=1;this.cb(this.onLand,this);}}}
  paint(){const t=this.t,k=t/this.life,sc=(this.pop?lerp(this.s0,this.s1,back(cl(t/this.pop,0,1))):lerp(this.s0,this.s1,eO(k)))*(this.pulse?1+this.pulse*Math.sin(t*(this.pf||6)):1),a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1),o=this.pos(),q=P(o[0],o[1],o[2]+(this.bob?Math.sin(t*(this.bf||3))*this.bob:0)),w=this.w*this.size*sc;if(a<=.01)return;
    ctx.save();ctx.globalAlpha*=a;if(this.add)ctx.globalCompositeOperation='lighter';if(this.glow)glowAt(q[0],q[1],w*(this.gk||.9),this.glow,.7);ctx.translate(q[0],q[1]);if(this.flat)ctx.scale(1,KY());const r=this.rot+this.spin*t+(this.wr?Math.sin(t*(this.wf||5))*this.wr:0);if(r)ctx.rotate(r);if(this.flipX)ctx.scale(-1,1);
    const im=this.im,h=w*im.height/im.width;ctx.drawImage(im,-w*(this.ax==null?.5:this.ax),-h*(this.ay==null?.5:this.ay),w,h);ctx.restore();}}
/* -- a part drawn by a function d(part, k = 0…1 of its life); a(part) = its fade (0…1) with fi / fo -- */
class Fn extends Part{constructor(o){super(o,{life:1,fi:.1,fo:.2});}
  fade(){return cl(this.t/this.fi,0,1)*cl((this.life-this.t)/this.fo,0,1);}
  paint(){this.d(this,this.t/this.life);}}
/* -- danger marks on the ground for monster / boss skills: shape 'circle' | 'cone' | 'line', filling up over `life` -- */
class Tele extends Part{constructor(o){super(o,{layer:'ground',shape:'circle',r:90,half:.5,len:240,w:50,life:1,el:'red',phi:0});}
  paint(){const k=this.t/this.life,p=this.p,q=P(this.x,this.y,0),r=this.r*this.size,pu=.75+.25*Math.sin(this.t*14),fin=cl((k-.86)/.14,0,1);
    const sh=(sc)=>{ctx.beginPath();if(this.shape==='cone'){ctx.moveTo(0,0);ctx.arc(0,0,r*sc,this.phi-this.half,this.phi+this.half);ctx.closePath();}else if(this.shape==='line'){const c=Math.cos(this.phi),s=Math.sin(this.phi),L=this.len*this.size*sc,w=this.w*this.size/2;ctx.moveTo(-s*w,c*w);ctx.lineTo(c*L-s*w,s*L+c*w);ctx.lineTo(c*L+s*w,s*L-c*w);ctx.lineTo(s*w,-c*w);ctx.closePath();}else ctx.arc(0,0,r*sc,0,TAU);};
    ctx.save();ctx.translate(q[0],q[1]);ctx.scale(1,KY());ctx.globalAlpha*=cl(this.t/.12,0,1);sh(1);ctx.fillStyle=rgba(p[1],.16);ctx.fill();sh(Math.max(.02,eO2(k)));ctx.fillStyle=rgba(p[2],.3+.25*fin);ctx.fill();
    sh(1);ctx.setLineDash([10,7]);ctx.lineDashOffset=-this.t*26;ctx.lineWidth=2.6;ctx.strokeStyle=rgba(p[3],.9*pu);ctx.stroke();ctx.setLineDash([]);if(fin>0){ctx.globalCompositeOperation='lighter';sh(1);ctx.fillStyle=rgba(p[3],.35*fin);ctx.fill();}ctx.restore();}}

/* ---------------------------------------------------------------------
   4b. HELPERS — small compositions every effect file uses (FXLIB.k.h)
   --------------------------------------------------------------------- */
const fwd=(o,d,sd)=>({x:o.x+Math.cos(o.phi)*d-Math.sin(o.phi)*(sd||0),y:o.y+Math.sin(o.phi)*d+Math.cos(o.phi)*(sd||0)});
const scrAng=phi=>Math.atan2(Math.sin(phi)*KY(),Math.cos(phi));          /* a ground direction as a screen angle */
const aim=o=>{if(o.x2==null){const p=fwd(o,160*(o.size||1));o.x2=p.x;o.y2=p.y;}return {x:o.x2,y:o.y2};};
const dustP=o=>{const d=(o&&o.dust)||window.FXLIB.dust||'dust';return typeof d==='function'?d(o):d;};   /* FXLIB.dust = palette name (or a function) for ground dust on the current map */
const SMK={fire:'smoke',ember:'smoke',earth:'dust',dark:'shadow',blood:'shadow',steel:'smoke',gold:'smoke',volt:'smoke',thunder:'smoke'};
const smokeOf=el=>SMK[el]||el;
const lite=(el,x,y,r,life,a,o)=>A(new Disc(Object.assign({x,y,r0:r*.55,r1:r,life:life||.5,a:a==null?.55:a,col:pal(el)[2]},o)));
const dark=(x,y,r,life,a,o)=>A(new Disc(Object.assign({x,y,r0:r,life:life||1.2,kind:'pool',add:0,a:a==null?.32:a,col:'#000000',fi:.05,fo:.6},o)));
const ring=(el,x,y,r,o)=>A(new Ring(Object.assign({el,x,y,r0:r*.15,r1:r,w0:Math.max(4,r*.14),w1:1,life:.36},o)));
const flash=(el,x,y,z,s,o)=>A(new Flash(Object.assign({el,x,y,z,s0:12*s,s1:56*s,life:.18},o)));
const burst=(el,x,y,z,s,o)=>A(new Burst(Object.assign({el,x,y,z,r:28*s,life:.24},o)));
function dust(o,x,y,r,n,size,rise){const S=sys('sorted',y+2),N=qn(n),pl=dustP(o);for(let i=0;i<N;i++){const a=i/N*TAU+R(-.3,.3);S.add({im:spr('puff',pl,i),x:x+Math.cos(a)*r*.3,y:y+Math.sin(a)*r*.3,z:2,vx:Math.cos(a)*r*1.7,vy:Math.sin(a)*r*1.7,vz:rise==null?14:rise,dr:3.2,s0:size*.5,s1:size*R(1,1.4),life:R(.5,.85),fi:.05,fo:.6,a0:.85,rot:R(-.4,.4),vr:R(-.6,.6)});}return S;}
function spark(el,x,y,z,s,n){flash(el,x,y,z,s*.8);const S=sys('top');bits(S,el,x,y,z,n==null?6:n,{size:s*.85});return S;}
function impact(el,x,y,z,s,n){burst(el,x,y,z,s);flash(el,x,y,z,s);const S=sys('top');bits(S,el,x,y,z,n==null?9:n,{size:s});return S;}
/* an explosion on the ground */
function blast(el,x,y,s,o){o=o||{};dark(x,y,46*s,1.6,.3);lite(el,x,y,100*s,.5,.75);ring(el,x,y,94*s,{w0:14*s});ring(el,x,y,62*s,{w0:6*s,delay:.06,life:.3});
  A(new Burst({el,x,y,z:24*s,r:56*s,n:11,life:.3,inner:.5}));A(new Flash({el,x,y,z:24*s,s0:30*s,s1:124*s,life:.22}));
  const S=sys('top');puffs(S,el,x,y,18*s,7,62*s,90,46,.42);bits(S,el,x,y,10*s,18,{size:1.15*s,sp:1.3,up:1.2});if(SMK[el])after(.12,()=>puffs(sys('sorted',y+1),SMK[el],x,y,14*s,5,58*s,50,36,1));if(!o.quiet)SH(o.shake||3);}
/* a bolt from the sky + its mark on the ground */
function strike(el,x,y,s,o){o=o||{};A(new Bolt({el,x:x+R(-34,34)*s,y,z:(o.h||440)*s,x2:x,y2:y,z2:0,w:(o.w||6.5)*s,life:.3,jag:16,branch:3}));
  dark(x,y,30*s,1.4,.35);lite(el,x,y,86*s,.35,.8);ring(el,x,y,58*s,{life:.3});A(new Flash({el,x,y,z:8*s,s0:26*s,s1:98*s,life:.2}));A(new Burst({el,x,y,z:6*s,r:38*s,n:10,flat:1,life:.24}));
  const S=sys('top');sparks(S,pal(el)[3],x,y,6,12,260,160,.45);bits(S,el,x,y,6,6,{only:0,size:s});if(!o.quiet)SH(2.5);}
/* light rays standing in an area */
function rays(el,x,y,r,T,n,hk){const im=tex('ray',pal(el)[3]),L=[];for(let i=0;i<n;i++)L.push({a:R(0,TAU),d:Math.sqrt(Math.random())*r,w:R(10,22),h:R(70,150)*(hk||1),ph:R(0,TAU),sp:R(1.5,3)});
  return A(new Fn({layer:'top',x,y,life:T,fi:.3,fo:.4,d(q){const a=q.fade();ctx.save();ctx.globalCompositeOperation='lighter';for(const l of L){const s=P(q.x+Math.cos(l.a)*l.d,q.y+Math.sin(l.a)*l.d,0),k=.35+.65*Math.max(0,Math.sin(q.t*l.sp+l.ph));ctx.globalAlpha=a*k*.7;ctx.drawImage(im,s[0]-l.w/2,s[1]-l.h,l.w,l.h);}ctx.restore();}}));}
/* small sprites drifting up inside an area (pluses, notes, runes, bubbles …) */
function floaters(S,im,x,y,r,n,o){o=o||{};n=qn(n);for(let i=0;i<n;i++){const a=R(0,TAU),d=Math.sqrt(Math.random())*r,w=Array.isArray(im)?pick(im):im;S.add(Object.assign({im:w,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,z:R(2,16),vz:R(28,54),s0:(o.s||12)*R(.7,1.1),s1:(o.s||12)*R(.9,1.3),life:R(.8,1.3),fi:.12,fo:.5,wob:o.wob==null?4:o.wob,wr:o.wr||0,delay:R(0,o.delay||0)},o.p));}}
const H={fwd,scrAng,aim,dustP,SMK,smokeOf,lite,dark,ring,flash,burst,dust,spark,impact,blast,strike,rays,floaters};

/* ---------------------------------------------------------------------
   5. REGISTRY
   --------------------------------------------------------------------- */
const FX={},LIST=[];
/* def(id, {cat, th (Thai name), kind, els}, fn(o,handle)) · kind tells a caller what to pass:
   melee = x,y,phi (the attacker) · hit = x,y (a body) · shot = x,y → to / x2,y2 · area = x,y (ground) · self / unit = follow · line = x,y,phi */
function define(id,meta,fn){FX[id]=fn;const i=LIST.findIndex(m=>m.id===id),m=Object.assign({id},meta);if(i>=0)LIST[i]=m;else LIST.push(m);}
function play(id,o){const f=FX[id];if(!f){console.warn('FXLIB: no effect "'+id+'"');return null;}const h={id,parts:[],dead:0,stop(){for(const p of this.parts)if(p.kill)p.kill();this.dead=1;}};
  o=Object.assign({size:1,z:0},o||{});if(o.follow&&o.x==null){o.x=o.follow.x;o.y=o.follow.y;}if(o.to&&o.x2==null){o.x2=o.to.x;o.y2=o.to.y;}if(o.phi==null)o.phi=o.x2!=null?Math.atan2(o.y2-o.y,o.x2-o.x):0;
  try{run(h,()=>f(o,h));}catch(e){console.error('FXLIB',id,e);}return h;}

/* categories of the catalogue (id prefix → Thai name), in display order */
const CATS=[['slash','ฟันตีประชิด'],['hit','จังหวะโดนตี'],['shot','ยิง / ขว้าง'],['boom','ระเบิด / โจมตีพื้นที่'],['zone','พื้นที่ค้าง'],['cast','ร่ายเวท'],
 ['buff','บัฟ / ฮีล / ป้องกัน'],['st','สถานะผิดปกติ'],['move','เคลื่อนที่'],['sum','อัญเชิญ / ของพิเศษ'],['ult','ท่าไม้ตาย'],['sys','ระบบเกม / บอส']];
/* A bug in one effect must never stop the game: its frame loop asks for the next frame at the END of a frame, so one exception thrown
   from an update() or a draw() would freeze everything. Every part class keeps its own update / draw behind a guard: the failing piece
   is dropped and reported once per class. */
const FAILED={};
for(const C of [Part,Emit,Fn,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Bolt,Beam,Pillar,Gush,Cone,Sigil,Proj,Wave,Crack,Spike,Flames,Dome,Tornado,Orbit,Spr,Tele,Sys])for(const m of ['update','draw']){
  if(!Object.prototype.hasOwnProperty.call(C.prototype,m))continue;const f=C.prototype[m];
  C.prototype[m]=function(a){try{return f.call(this,a);}catch(e){if(!FAILED[C.name+m]){FAILED[C.name+m]=1;try{console.warn('FXLIB: '+C.name+'.'+m+' failed, piece dropped',e);}catch(_){}}
      this.life=0;this.done=1;this.dt2=9;this.keep=0;if(Array.isArray(this.p))this.p.length=0;if(Array.isArray(this.h))this.h.length=0;this.onEnd=null;return false;}};}
window.FXLIB={version:1,play,define,list:LIST,cats:CATS,EL,PAL,has:id=>!!FX[id],
  k:{TAU,cl,lerp,eO,eO2,eI,eIO,back,R,pick,sg,KY,qn,rgba,SH,pal,PAL,tex,spr,sprF,sprites:D,glowAt,coreAt,starAt,drawSpr,Sys,sys,bits,sparks,puffs,glints,BIT,A,run,after,
     Part,Emit,Fn,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Bolt,Beam,Pillar,Gush,Cone,Sigil,sigilTex,Proj,Wave,Crack,Spike,Flames,Dome,Tornado,Orbit,orbit,Spr,Tele,h:H,defSprite:def,cv,F,ST,LG,RG,OV,inS}};
})();
