/* Support gems show on the real skill — step 3 (owner 2026-11-21 'ได้ ทำเอฟเฟคให้เห็นชัดๆสวยๆว่าเอฟเฟคได้รับการเปลี่ยนแล้ว' → 'ทำไรต่อ').
   gem_fx.js = element tint (step 1), gem_mut_fx.js = the nine other mutation gems (step 2). This file gives the 12 SUPPORT gems a look of
   their own, drawn at the moment their rule really works in totem_gems.js. A support in a skill hole works at half strength → its look is
   a little smaller (SZ).
     echo   เงาสกิล     a violet countdown ring closes on the enemy for the 0.5 s until the echo; when the 'ECHO' hit lands a violet ghost
                         of the hero strikes again where the hero stood and a violet ghost-cut + echo ripples land on the enemy
     third  ทุกครั้งที่สาม  ①②③ amber pips above the head count the real casts; the 3rd fills, merges and bursts; its hits flash amber rays
     force  เพิ่มแรง     a red-orange ✚ punch spark on every hit
     splash กระจาย      an orange splat on the floor, molten drops thrown out to the real radius (70, 80 with the spread gem) + a dashed ring there
     chain  ชิ่ง        every bounce (also the volt gem's) is a real jagged lightning bolt between bodies: cyan, violet with the volt gem
     quick  เร่ง        a green clock dial under the hero at the cast, its hand sweeps a full turn
     thrift ประหยัด     blue mana diamonds pop out of the hero and drop back in (the SP it keeps)
     burn   เผาไหม้     a small fire lick where it hits; burning enemies carry two small flames + embers for the 3 s (gem_fx.js overlay)
     frost  เยือกแข็ง    every 3rd hit = ice burst + frost crystals at the feet while the slow lasts; every 6th = an ice block for the freeze
     pierce ทะลวง       a silver lance streaks through an ARMOURED enemy (only when it has DEF to ignore) and knocks plates off its back
     leech  ดูดชีวิต     red hearts fly from the enemy into the hero, '+N HP' (up to the real 10 hits per cast)
     impact กระแทก      every 5th hit = a comic tan ✸ shock star + ground ring (the engine's stun stars follow)
   Buff skills: when the buff gets longer (echo / force / chain / pierce) the gems' pictures rise above the hero with 'บัฟ +N วิ'; when the
   cast hits nothing for 0.9 s (the rule's own test) the buff side of splash / burn / frost / leech / impact shows round the hero.
   Gameplay untouched. Own pieces are never element-tinted (__gt '-'). ?gemfx=0 = off. */
(function(){
'use strict';
if(/[?&]gemfx=0/.test(location.search)||!window.GEMFX||!GEMFX.k||!GEMFX.mk)return;
const {art,put,glow,star4,zig,bolt,PJ,T,CX,ENS,FX,body,onScr,rnd,eOut,TAU,add:_add0,ensureOv,burst}=GEMFX.k;
const {rl,ellS,gRing,line3,gem,puff,floorWash,phiTo,PL,pz,CH,KY,ST,GroundPulse}=GEMFX.mk;
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};

/* ---- which skills carry which supports, and how strong (1 = C-gem hole, ½ per skill-hole support — the same sum as totem_gems sw()) ---- */
const SUPS=['echo','third','force','splash','chain','quick','thrift','burn','frost','pierce','leech','impact'];
const COL={echo:'#9b7bff',third:'#ffb13b',force:'#ff6a4a',splash:'#ff9a3a',chain:'#5ad1ff',quick:'#7fe08a',thrift:'#4aa8ff',burn:'#ff5a2a',frost:'#8fe6ff',pierce:'#d8d8e8',leech:'#e2435a',impact:'#c9a46a'};
let ver=-1,SM={},ANY=false;
function sm(){const v=window.GEM_V||0;if(v!==ver){ver=v;SM={};ANY=false;
    try{const A=totemGems.act();for(const t in A){const a=A[t],w={};let n=0;
      for(const id of SUPS){const x=((a.sup||[]).includes(id)?1:0)+(a.supH?a.supH.filter(s=>s===id).length*.5:0);if(x){w[id]=x;n++;}}
      if(n){SM[t]={w,fol:!!a.fol};ANY=true;}}}catch(e){}}
  return SM;}
const supsOf=k=>k?(sm()[k]||null):null;
const actOf=k=>{try{return totemGems.act()[k]||null;}catch(e){return null;}};
const SZ=w=>w>=1?1:.8;

/* ---- pieces ---- */
const LIVE=new Set();
class Pc{constructor(layer,life){this.__gt='-';this._sk=null;this.layer=layer;this.t=0;this.life=life;}
  update(dt){this.t+=dt;if(this.tick)this.tick(dt);if(this.t<this.life)return true;LIVE.delete(this);return false;}}
function spawn(p){if(!p||LIVE.size>70)return null;LIVE.add(p);return _add0(p);}
const RLG={};function rlG(kind,gap){const t=T();if(t-(RLG[kind]||-9)<gap)return false;RLG[kind]=t;return true;}

/* ---- helpers ---- */
function arcS(c,x,y,rx,ry,a0,a1,w,col,dark,a){if(a<=.01||rx<=.5)return;c.save();c.lineCap='round';c.beginPath();c.ellipse(x,y,rx,ry,0,a0,a1);
  c.globalAlpha=a*.5;c.strokeStyle=dark;c.lineWidth=w+2.8;c.stroke();c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=w;c.stroke();
  c.globalCompositeOperation='lighter';c.globalAlpha=a*.85;c.strokeStyle='#ffffff';c.lineWidth=Math.max(.7,w*.36);c.stroke();c.restore();}
function trail(c,tr,w,col,dark){const n=tr.length;if(n<2)return;c.save();c.lineCap='round';
  for(let i=n-1;i>0;i--){const k=1-i/n;c.globalAlpha=.5*k;c.strokeStyle=dark;c.lineWidth=2.6+w*k;c.beginPath();c.moveTo(tr[i][0],tr[i][1]);c.lineTo(tr[i-1][0],tr[i-1][1]);c.stroke();}
  c.globalCompositeOperation='lighter';for(let i=n-1;i>0;i--){const k=1-i/n;c.globalAlpha=k;c.strokeStyle=col;c.lineWidth=1+(w-1)*k;c.beginPath();c.moveTo(tr[i][0],tr[i][1]);c.lineTo(tr[i-1][0],tr[i-1][1]);c.stroke();}c.restore();}
function rock(c,x,y,q,r,fill,dark,a){c.save();c.translate(x,y);c.rotate(r);c.globalAlpha=a;c.beginPath();c.moveTo(-q,-q*.55);c.lineTo(q*.2,-q*.95);c.lineTo(q,-q*.2);c.lineTo(q*.7,q*.7);c.lineTo(-q*.6,q*.75);c.closePath();
  c.fillStyle=fill;c.fill();c.strokeStyle=dark;c.lineWidth=1.3;c.stroke();c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.moveTo(-q*.7,-q*.45);c.lineTo(q*.15,-q*.75);c.lineTo(q*.1,-q*.25);c.closePath();c.fill();c.restore();}

/* ---- SVG art ---- */
const HEART='M13 22.5C6 17.6 2 13.4 2 8.4C2 4.8 4.8 2.2 8 2.2C10.2 2.2 12 3.4 13 5.2C14 3.4 15.8 2.2 18 2.2C21.2 2.2 24 4.8 24 8.4C24 13.4 20 17.6 13 22.5Z';
art('sheart',26,24,`<defs><radialGradient id="h" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#ffe6ec"/><stop offset=".3" stop-color="#ff6a86"/><stop offset=".75" stop-color="#d81e44"/><stop offset="1" stop-color="#8a0a24"/></radialGradient>
  <filter id="b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.4"/></filter></defs>
  <path d="${HEART}" fill="#ff4a6a" opacity=".5" filter="url(#b)"/><path d="${HEART}" fill="url(#h)" stroke="#4a0614" stroke-width="1.7" stroke-linejoin="round"/>
  <path d="M5.6 6.6C6.4 5.2 8 4.6 9.4 5.2" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".95"/><circle cx="18.6" cy="6.4" r="1" fill="#fff" opacity=".7"/>`);
const SIMG={};function simg(id){let im=SIMG[id];if(!im){im=SIMG[id]=new Image();im.src='assets/gems/support/'+id+'.webp';}return im;}

/* =============================== echo =============================== */
const ECH='#9b7bff',ECD='#1e0c4a',ECL='#e4dcff';
class EchoMark extends Pc{constructor(e,s){super('top',.5);this.e=e;this.s=s;this.a0=rnd(0,TAU);}
  draw(){const c=CX(),e=this.e;if(!c||e.dead)return;const b=body(e),[x,y]=PJ(e.x,e.y,b.zc),k=Math.min(1,this.t/.5),r=b.r*(2.3-1.15*k*k)*this.s,ry=r*.62,
      a=Math.min(1,this.t/.07)*(k>.86?(1-k)/.14:1),st=this.a0-this.t*6.5,sp=TAU*(.84-.46*k);
    glow(x,y,r,'#7b5cff',.2*a);arcS(c,x,y,r,ry,st,st+sp,2.6*this.s,ECH,ECD,a);arcS(c,x,y,r*.72,ry*.72,st+2.4,st+2.4+sp*.5,1.3*this.s,ECH,ECD,a*.6);
    const px=x+r*Math.cos(st),py=y+ry*Math.sin(st),ux=r*Math.sin(st),uy=-ry*Math.cos(st),h=6.5*this.s;   /* arrowhead on the leading end: the ring turns ⟲ */
    c.save();c.globalAlpha=a;c.translate(px,py);c.rotate(Math.atan2(uy,ux));
    c.fillStyle=ECD;c.beginPath();c.moveTo(h+1.8,0);c.lineTo(-h*.6,h*.8+1.3);c.lineTo(-h*.6,-h*.8-1.3);c.closePath();c.fill();
    c.fillStyle=ECH;c.beginPath();c.moveTo(h,0);c.lineTo(-h*.42,h*.62);c.lineTo(-h*.42,-h*.62);c.closePath();c.fill();
    c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.moveTo(h*.72,0);c.lineTo(-h*.08,h*.2);c.lineTo(-h*.08,-h*.2);c.closePath();c.fill();c.restore();}}
class EchoHit extends Pc{constructor(e,s){super('top',.46);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=b.r;this.s=s;this.an=rnd(-.8,.8)+(Math.random()<.5?0:Math.PI);
    this.sp=[0,1,2,3,4,5].map(i=>({a:i/6*TAU+rnd(-.3,.3),v:rnd(40,70),s:rnd(.7,1.2)}));}
  draw(){const c=CX();if(!c)return;const t=this.t,k=t/this.life,[x,y]=PJ(this.x,this.y,this.zc),R=Math.max(14,this.r)*this.s,a=1-k;
    glow(x,y,R*2.2,'#7b5cff',.45*a);glow(x,y,R*.8,'#ffffff',Math.max(0,.8-k*3));
    const sw=eOut(Math.min(1,t/.11)),L=R*2.8,w=R*.62*(1-k*.5);   /* the ghost cut: a violet crescent sweeping through the body */
    c.save();c.translate(x,y);c.rotate(this.an);c.beginPath();c.rect(-L/2-6,-w*2-8,(L+12)*sw,w*3+16);c.clip();
    const cres=()=>{c.beginPath();c.moveTo(-L/2,0);c.quadraticCurveTo(0,-w*2,L/2,0);c.quadraticCurveTo(0,-w*.8,-L/2,0);c.closePath();};
    c.globalAlpha=a*.55;c.strokeStyle=ECD;c.lineWidth=3.4;c.lineJoin='round';cres();c.stroke();
    c.globalAlpha=a*.92;const g=c.createLinearGradient(0,-w,0,0);g.addColorStop(0,ECL);g.addColorStop(.55,ECH);g.addColorStop(1,'#5a3ad8');c.fillStyle=g;cres();c.fill();
    c.globalCompositeOperation='lighter';c.globalAlpha=a;c.strokeStyle='#ffffff';c.lineWidth=1.4;c.beginPath();c.moveTo(-L/2*.8,-w*.2);c.quadraticCurveTo(0,-w*1.75,L/2*.8,-w*.2);c.stroke();c.restore();
    for(let i=0;i<3;i++){const u=(t-i*.08)/.32;if(u<0||u>1)continue;const rr=R*(.7+1.9*eOut(u));arcS(c,x,y,rr,rr*.62,0,TAU,2.2*(1-u)+.6,ECH,ECD,(1-u)*.9);}   /* echo ripples */
    for(const p of this.sp){const d=p.v*eOut(k);star4(x+Math.cos(p.a)*d,y+Math.sin(p.a)*d*.7,6*p.s*(1-k),ECL,1-k);}}}
/* the hero's violet ghost strikes again: the pose of the first hit lunges from the hero toward the enemy (FX layer, over the bodies) */
class EchoGhost extends Pc{constructor(g,s){super('top',.48);this.g=g;this.s=s;}
  draw(){const c=CX(),tf=G('tinted'),df=G('drawFrame');if(!c||!tf||!df)return;const g=this.g,k=this.t/this.life,D=Math.max(30,g.d||50),
      off=D*(.22+.42*eOut(Math.min(1,k/.3))),wx=g.x+Math.cos(g.phi)*off,wy=g.y+Math.sin(g.phi)*off,[x,y]=PJ(wx,wy,g.z||0),sc=G('CHAR_SCALE')||1,a=(k<.12?k/.12:1)*(1-k*k);
    let im,im2;try{im=tf(g.fr,'#4326b8');im2=tf(g.fr,'#a690ff');}catch(e){return;}   /* a solid violet shadow with a thin light rim: the hero's shape must read */
    glow(x,y-CH*sc*.8,26*sc,'#7b5cff',.22*a);
    c.save();if(sc!==1){c.translate(x,y);c.scale(sc,sc);c.translate(-x,-y);}
    c.globalCompositeOperation='lighter';for(const [dx,dy] of [[2.2,0],[-2.2,0],[0,2.2],[0,-2.2]])df(g.fr,x+dx,y+dy,.16*a,null,im2);
    c.globalCompositeOperation='source-over';df(g.fr,x,y,.74*a,null,im);c.restore();}}

/* =============================== third =============================== */
const THC='#ffb13b',THD='#4a2604',THL='#fff0c2';
let PIPS=null;
class ThirdPips extends Pc{constructor(n,s){super('top',n>=3?1.0:1.2);this.n=n;this.s=s;}
  draw(){const c=CX(),p=PL();if(!c||!p)return;const t=this.t,S=this.s,[x,y]=PJ(p.x,p.y,(p.z||0)+84),fade=Math.min(1,(this.life-t)/.28),
      merge=this.n>=3?Math.max(0,Math.min(1,(t-.4)/.14)):0;
    for(let i=0;i<3;i++){const lit=i<this.n,nw=i===this.n-1,u=nw?Math.min(1,t/.2):1,pop=nw?1+.6*Math.sin(Math.PI*u)*(1-.4*u):1,
        px=x+(i-1)*20*S*(1-merge),py=y-4*merge,r=8.2*S*pop*(1-.5*merge),a=fade*(1-merge);if(a<=.01)continue;
      if(lit)glow(px,py,r*2.7,THC,.5*a);
      c.save();c.globalAlpha=a;c.fillStyle=THD;c.beginPath();c.arc(px,py,r+1.8,0,TAU);c.fill();
      if(lit){const g=c.createRadialGradient(px-r*.35,py-r*.4,r*.1,px,py,r);g.addColorStop(0,'#fff8de');g.addColorStop(.45,THC);g.addColorStop(1,'#c4660a');c.fillStyle=g;}else c.fillStyle='#5a3a1c';
      c.beginPath();c.arc(px,py,r,0,TAU);c.fill();
      c.fillStyle=lit?THD:'#b08a5a';c.font=`bold ${Math.max(7,Math.round(r*1.4))}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),px,py+.6);c.restore();}
    if(this.n>=3&&t>=.5){const k=Math.min(1,(t-.5)/.42),cy=y-4;glow(x,cy,42*S,THC,.75*(1-k));star4(x,cy,26*S*(1-.3*k),THL,1-k);
      c.save();c.lineCap='round';for(let i=0;i<12;i++){const an=i/12*TAU+.13,r0=7+30*eOut(k)*S,r1=r0+(i%2?7:13)*S*(1-k);
        const x0=x+Math.cos(an)*r0,y0=cy+Math.sin(an)*r0,x1=x+Math.cos(an)*r1,y1=cy+Math.sin(an)*r1;
        c.globalAlpha=.5*(1-k);c.strokeStyle=THD;c.lineWidth=3.6*(1-k)+1;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
        c.globalAlpha=1-k;c.strokeStyle=i%2?THL:THC;c.lineWidth=2*(1-k)+.6;c.stroke();}c.restore();}}}
class ThirdHit extends Pc{constructor(e,s){super('top',.36);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=Math.max(13,b.r)*s;this.a0=rnd(0,TAU);}
  draw(){const c=CX();if(!c)return;const k=this.t/this.life,[x,y]=PJ(this.x,this.y,this.zc),R=this.r,a=1-k;
    glow(x,y,R*2.4,THC,.55*a);glow(x,y,R,'#ffffff',Math.max(0,.9-k*3));
    c.save();c.lineCap='round';for(let i=0;i<8;i++){const an=this.a0+i/8*TAU,L=(i%2?1.1:1.9)*R,r0=R*(.35+.6*eOut(k)),r1=r0+L*(1-k*.7);
      const x0=x+Math.cos(an)*r0,y0=y+Math.sin(an)*r0*.8,x1=x+Math.cos(an)*r1,y1=y+Math.sin(an)*r1*.8;
      c.globalCompositeOperation='source-over';c.globalAlpha=a*.5;c.strokeStyle=THD;c.lineWidth=5.2*(1-k)+1;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
      c.globalCompositeOperation='lighter';c.globalAlpha=a;c.strokeStyle=THC;c.lineWidth=3*(1-k)+.6;c.stroke();c.strokeStyle='#ffffff';c.lineWidth=1.1;c.stroke();}c.restore();
    star4(x,y,R*1.3*(1-.4*k),THL,a);}}

/* =============================== force =============================== */
const FOC='#ff6a4a',FOD='#4a0c04';
class ForceHit extends Pc{constructor(e,s){super('top',.28);const b=body(e),p=PL(),ph=p?Math.atan2(p.y-e.y,p.x-e.x):0;this.x=e.x+Math.cos(ph)*b.r*.35;this.y=e.y+Math.sin(ph)*b.r*.35;
    this.zc=b.zc+rnd(-4,6);this.s=s*Math.pow(Math.max(12,b.r)/16,.4);this.rot=rnd(-.25,.25);this.ch=[0,1,2,3].map(i=>({a:i*Math.PI/2+Math.PI/4+rnd(-.2,.2),v:rnd(50,80)}));}
  draw(){const c=CX();if(!c)return;const t=this.t,k=t/this.life,[x,y]=PJ(this.x,this.y,this.zc),S=this.s,
      sc=t<.07?eOut(t/.07)*1.3:1.3-.45*((t-.07)/(this.life-.07)),a=k<.6?1:(1-k)/.4;
    glow(x,y,26*S,FOC,.55*a);glow(x,y,10*S,'#ffffff',Math.max(0,1-t/.09));
    c.save();c.translate(x,y);c.rotate(this.rot);c.lineCap='round';
    for(const [w,col,al,op] of [[7.4,FOD,.55,'source-over'],[4.6,FOC,1,'source-over'],[1.8,'#ffffff',.9,'lighter']]){c.globalCompositeOperation=op;c.globalAlpha=a*al;c.strokeStyle=col;c.lineWidth=w*S;c.beginPath();
      for(let i=0;i<4;i++){const an=i*Math.PI/2,r0=2.5*S,r1=11.5*S*sc;c.moveTo(Math.cos(an)*r0,Math.sin(an)*r0);c.lineTo(Math.cos(an)*r1,Math.sin(an)*r1);}c.stroke();}
    c.restore();for(const h of this.ch){const d=h.v*eOut(k)*.4*S;gem(c,x+Math.cos(h.a)*d,y+Math.sin(h.a)*d,1.7*S,h.a+Math.PI/2,'#ffb08a',FOD,a);}}}

/* =============================== splash =============================== */
const SPC='#ff9a3a',SPD='#4a1e04',SPL='#ffe2a8';
function splat(c,r,n,seed){c.beginPath();for(let i=0;i<=n*2;i++){const an=i/(n*2)*TAU,rr=i%2?r*(.42+.12*Math.sin(seed+i)):r*(.88+.12*Math.cos(seed*1.7+i));
  const px=Math.cos(an)*rr,py=Math.sin(an)*rr*KY;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();}
class SplashGround extends Pc{constructor(e,R,s){super('ground',.62);this.x=e.x;this.y=e.y;this.R=R;this.s=s;this.r=body(e).r;this.seed=rnd(0,9);}
  draw(){const c=CX();if(!c)return;const t=this.t,k=t/this.life,[x,y]=PJ(this.x,this.y,0);if(!onScr(x,y))return;
    const r=(this.r*1.9+12)*this.s*eOut(Math.min(1,t/.1)),a=k<.5?1:(1-k)/.5;   /* wider than the body: the floor splat shows round the enemy's feet */
    c.save();c.translate(x,y);c.globalAlpha=a*.55;c.fillStyle=SPD;splat(c,r+3,8,this.seed);c.fill();c.globalAlpha=a*.92;
    const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'#fff2c8');g.addColorStop(.35,SPC);g.addColorStop(1,'#c4500a');c.fillStyle=g;splat(c,r,8,this.seed);c.fill();c.restore();
    const u=Math.min(1,t/.3),rr=this.R*eOut(u),ra=(1-k)*.95;c.save();c.setLineDash([8,6]);c.lineDashOffset=-t*40;ellS(c,x,y,rr,4.6,SPD,ra*.4);ellS(c,x,y,rr,2.2,SPC,ra);c.restore();}}
function drop(c,x0,y0,x1,y1,r){const an=Math.atan2(y1-y0,x1-x0),L=Math.max(r,Math.hypot(x1-x0,y1-y0));c.save();c.translate(x1,y1);c.rotate(an);
  c.globalAlpha=.6;c.fillStyle=SPD;c.beginPath();c.arc(0,0,r+1.4,-Math.PI/2,Math.PI/2);c.lineTo(-L-1.4,0);c.closePath();c.fill();
  c.globalAlpha=1;const g=c.createLinearGradient(-L,0,r,0);g.addColorStop(0,'rgba(255,154,58,0)');g.addColorStop(.6,SPC);g.addColorStop(1,'#fff0c0');c.fillStyle=g;c.beginPath();c.arc(0,0,r,-Math.PI/2,Math.PI/2);c.lineTo(-L,0);c.closePath();c.fill();c.restore();}
class SplashDrops extends Pc{constructor(e,R,s){super('top',.64);const b=body(e);this.x=e.x;this.y=e.y;this.z0=b.zc;this.s=s;
    this.d=[0,1,2,3,4,5].map(i=>({a:i/6*TAU+rnd(-.3,.3),D:R*rnd(.62,.95),T1:rnd(.34,.44),h:rnd(24,40),s:rnd(.8,1.2)}));}
  at(d,u){return [this.x+Math.cos(d.a)*d.D*u,this.y+Math.sin(d.a)*d.D*u,this.z0*(1-u)+d.h*4*u*(1-u)];}
  draw(){const c=CX();if(!c)return;const t=this.t;
    for(const d of this.d){const u=Math.min(1,t/d.T1);
      if(u<1){const [ax,ay,az]=this.at(d,u),[bx,by,bz]=this.at(d,Math.max(0,u-.09)),[px,py]=PJ(ax,ay,az),[qx,qy]=PJ(bx,by,bz);drop(c,qx,qy,px,py,4.2*d.s*this.s);}
      else{const k=Math.min(1,(t-d.T1)/.2);if(k>=1)continue;const [ax,ay]=this.at(d,1),[px,py]=PJ(ax,ay,0);ellS(c,px,py,3+9*eOut(k),1.8*(1-k)+.5,SPC,1-k);star4(px,py-2,6*(1-k),SPL,1-k);}}}}

/* =============================== chain (and the volt gem's bounce) =============================== */
const nearE=pt=>{for(const o of ENS())if(!o.dead&&Math.abs(o.x-pt.x)<.6&&Math.abs(o.y-pt.y)<.6)return o;return null;};
class ChainBolt extends Pc{constructor(a,b,volt){super('top',.32);this.a=a;this.b=b;this.v=volt;this.j=0;this.p=null;this.br=[];
    const eA=nearE(a),eB=nearE(b);this.za=eA?body(eA).zc:26;this.zb=eB?body(eB).zc:26;this.rb=eB?Math.max(12,body(eB).r):16;}
  tick(dt){if((this.j-=dt)<=0){this.j=.045;this.p=null;}}
  draw(){const c=CX();if(!c)return;const k=this.t/this.life,[x1,y1]=PJ(this.a.x,this.a.y,this.za),[x2,y2]=PJ(this.b.x,this.b.y,this.zb),
      reach=eOut(Math.min(1,this.t/.06)),ex=x1+(x2-x1)*reach,ey=y1+(y2-y1)*reach,L=Math.hypot(ex-x1,ey-y1);if(L<2)return;
    if(!this.p){this.p=zig(x1,y1,ex,ey,Math.max(4,Math.round(L/16)),Math.min(14,L*.12));const m=this.p[Math.floor(this.p.length/2)],m2=this.p[Math.floor(this.p.length*.75)];
      this.br=[zig(m[0],m[1],m[0]+rnd(-24,24),m[1]+rnd(-22,8),3,4),zig(m2[0],m2[1],m2[0]+rnd(-18,18),m2[1]+rnd(-16,6),2,3)];}
    const col=this.v?'#8f74ff':'#3ec4ff',dark=this.v?'#16084a':'#04223e',a=1-k*k;
    c.save();c.lineJoin='round';c.lineCap='round';c.globalAlpha=.5*a;c.strokeStyle=dark;c.lineWidth=8;c.beginPath();c.moveTo(this.p[0][0],this.p[0][1]);for(const q of this.p)c.lineTo(q[0],q[1]);c.stroke();c.restore();
    bolt(this.p,col,3.8*(1-k*.45),a);for(const q of this.br)bolt(q,col,1.7,a*.8);
    glow(x1,y1,14,col,.45*a);
    if(reach>=1){glow(x2,y2,this.rb*1.9,col,.7*a);star4(x2,y2,this.rb*1.25*(1-.3*k),'#ffffff',a);}}}

/* =============================== quick / thrift (cast) =============================== */
const QKC='#7fe08a',QKD='#0c3a14',QKL='#eaffdf';
class QuickClock extends Pc{constructor(s){super('ground',.66);this.s=s;}
  draw(){const c=CX(),p=PL();if(!c||!p)return;const t=this.t,k=t/this.life,[x,y]=PJ(p.x,p.y,0),R=42*this.s,a=(t<.08?t/.08:1)*(k>.7?(1-k)/.3:1);
    floorWash(c,x,y,R*1.15,'127,224,138','90,200,110',.35*a);gRing(c,x,y,R,2.8,QKC,QKD,a);gRing(c,x,y,R*.6,1.1,QKC,QKD,a*.55);
    c.save();c.lineCap='round';for(let i=0;i<12;i++){const an=i/12*TAU,big=i%3===0,r0=R*(big?.74:.84),r1=R*.95,ax=x+Math.cos(an)*r0,ay=y+Math.sin(an)*r0*KY,bx=x+Math.cos(an)*r1,by=y+Math.sin(an)*r1*KY;
      c.globalAlpha=a*.5;c.strokeStyle=QKD;c.lineWidth=big?4.6:3;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();c.globalAlpha=a;c.strokeStyle=big?QKL:QKC;c.lineWidth=big?2.4:1.4;c.stroke();}c.restore();
    const u=eOut(Math.min(1,t/.42)),h=-Math.PI/2+TAU*u,tail=Math.min(TAU*u,1.7);   /* the hand sweeps one full turn: the cooldown runs faster */
    c.save();c.translate(x,y);c.scale(1,KY);c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a0=h-tail*(i+1)/6,a1=h-tail*i/6;c.globalAlpha=a*.3*(1-i/6);c.fillStyle=QKC;c.beginPath();c.moveTo(0,0);c.arc(0,0,R*.93,a0,a1);c.closePath();c.fill();}c.restore();
    line3(c,[[x,y],[x+Math.cos(h)*R*.88,y+Math.sin(h)*R*.88*KY]],2.6,QKC,QKD,a);gem(c,x,y,2.6,0,QKL,QKD,a);}}
const TFC='#4aa8ff',TFD='#06224a',TFL='#dff2ff';
class ThriftRefund extends Pc{constructor(s){super('top',.72);this.s=s;this.g=[0,1,2].map(i=>({a:(i-1)*.62+rnd(-.08,.08),h:rnd(40,48)+(i===1?8:0),spin:rnd(-7,7)}));}
  draw(){const c=CX(),p=PL();if(!c||!p)return;const t=this.t,S=this.s,[x,y]=PJ(p.x,p.y,CH+18+pz());   /* SP kept: three mana gems jump out over the head and drop back in */
    for(const g of this.g){const u=Math.min(1,t/.56);if(u>=1)continue;const out=Math.sin(Math.PI*u),px=x+Math.sin(g.a)*30*out*S,py=y-g.h*out*S-Math.cos(g.a)*6*out;
      glow(px,py,14*S,TFC,.75);gem(c,px,py,5.4*S,Math.sin(t*g.spin)*.5,'#7cc4ff',TFD,1);star4(px+3*S,py-5*S,5*S*(.6+.4*Math.sin(t*20+g.a)),'#ffffff',.9);}
    if(t<.16){const k=t/.16;glow(x,y,22*S,TFC,.6*(1-k));}
    if(t>.5){const k=Math.min(1,(t-.5)/.22),r=(10+20*eOut(k))*S;glow(x,y,30*S,TFC,.8*(1-k));c.save();c.globalAlpha=1-k;c.strokeStyle=TFD;c.lineWidth=3.6*(1-k)+1;c.beginPath();c.ellipse(x,y,r,r*.55,0,0,TAU);c.stroke();
      c.strokeStyle=TFL;c.lineWidth=2*(1-k)+.5;c.stroke();c.restore();star4(x,y-4,16*S*(1-.4*k),'#ffffff',1-k);}}}

/* =============================== burn =============================== */
class IgniteLick extends Pc{constructor(e,s){super('top',.5);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=Math.max(12,b.r)*s;this.f=[0,1,2].map(i=>({dx:rnd(-.6,.6),s:rnd(.6,.9),d:i*.05}));}
  draw(){const k=this.t/this.life,[x,y]=PJ(this.x,this.y,this.zc);glow(x,y,this.r*1.6,'#ff6a1a',.42*(1-k));
    for(const f of this.f){const u=(this.t-f.d)/(this.life-f.d);if(u<0||u>1)continue;const s=Math.sin(Math.PI*Math.min(1,u*1.3));put('flame',x+f.dx*this.r,y+this.r*.3-u*10,this.r*1.1*f.s*Math.max(.05,s),{ay:.85,a:1-u*u});}}}

/* =============================== pierce =============================== */
class PierceLance extends Pc{constructor(e,phi,s){super('top',.62);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=Math.max(12,b.r);this.phi=phi;this.s=s;
    const cs=Math.cos(phi),sn=Math.sin(phi);this.pl=[0,1,2].map(()=>({x:cs*this.r*.9,y:sn*this.r*.9,z:rnd(-6,8),vx:cs*rnd(60,110)+rnd(-30,30),vy:sn*rnd(60,110)+rnd(-30,30),vz:rnd(60,130),r:rnd(0,TAU),vr:rnd(-14,14),s:rnd(.8,1.2)}));}
  tick(dt){if(this.t<.07)return;for(const d of this.pl){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=430*dt;d.z+=d.vz*dt;if(d.z<-this.zc){d.z=-this.zc;d.vz*=-.25;d.vx*=.5;d.vy*=.5;}d.r+=d.vr*dt;}}
  draw(){const c=CX();if(!c)return;const t=this.t,cs=Math.cos(this.phi),sn=Math.sin(this.phi),r=this.r,S=this.s,
      [ax,ay]=PJ(this.x-cs*r*1.7,this.y-sn*r*1.7,this.zc),[bx,by]=PJ(this.x+cs*r*2.2,this.y+sn*r*2.2,this.zc),
      h=eOut(Math.min(1,t/.07)),tx=ax+(bx-ax)*h,ty=ay+(by-ay)*h,tl=Math.min(1,Math.max(0,(t-.07)/.2)),sx=ax+(bx-ax)*tl,sy=ay+(by-ay)*tl;
    if(tl<1){const an=Math.atan2(ty-sy,tx-sx),L=Math.hypot(tx-sx,ty-sy),w=5*S;
      c.save();c.translate(sx,sy);c.rotate(an);
      c.globalAlpha=.5;c.fillStyle='#24242e';c.beginPath();c.moveTo(0,-w*.4-1.2);c.lineTo(L-w*2,-w-1.4);c.lineTo(L+w*2.6,0);c.lineTo(L-w*2,w+1.4);c.lineTo(0,w*.4+1.2);c.closePath();c.fill();
      c.globalAlpha=1;const g=c.createLinearGradient(0,0,L,0);g.addColorStop(0,'rgba(200,200,220,0)');g.addColorStop(.5,'#b8b8d0');g.addColorStop(1,'#ffffff');c.fillStyle=g;
      c.beginPath();c.moveTo(0,-w*.3);c.lineTo(L-w*2,-w);c.lineTo(L+w*2.2,0);c.lineTo(L-w*2,w);c.lineTo(0,w*.3);c.closePath();c.fill();
      c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,255,255,.9)';c.fillRect(L*.3,-w*.18,L*.7,w*.36);c.restore();}
    if(t>=.05){const u=Math.min(1,(t-.05)/.22);glow(bx,by,26*S,'#e8e8ff',.8*(1-u));star4(bx,by,22*S*(1-.4*u),'#ffffff',1-u);const [hx,hy]=PJ(this.x,this.y,this.zc);star4(hx,hy,14*S*(1-u),'#d8d8ff',.9*(1-u));}
    if(t>=.07)for(const d of this.pl){const [px,py]=PJ(this.x+d.x,this.y+d.y,this.zc+d.z);rock(c,px,py,3.4*d.s*S,d.r,'#9a9ab2','#24242e',Math.min(1,(this.life-t)/.15));}}}

/* =============================== leech =============================== */
const HEAL={v:0,t:-9};
class LeechHeart extends Pc{constructor(a,v,s){super('top',.62);this.a=a;this.v=v;this.s=s;this.side=rnd(-1,1)*40;this.tr=[];this.done=0;}
  pos(u){const p=PL(),a=this.a,bx=p.x,by=p.y,bz=CH+6+pz(),dx=bx-a.x,dy=by-a.y,L=Math.hypot(dx,dy)||1,cx=(a.x+bx)/2-dy/L*this.side,cy=(a.y+by)/2+dx/L*this.side,cz=(a.z+bz)/2+46,i=1-u;
    return [i*i*a.x+2*i*u*cx+u*u*bx,i*i*a.y+2*i*u*cy+u*u*by,i*i*a.z+2*i*u*cz+u*u*bz];}
  tick(){if(!PL())return;const u=Math.min(1,this.t/.48),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,[x,y,z]=this.pos(e);this.tr.unshift(PJ(x,y,z));if(this.tr.length>9)this.tr.pop();
    if(u>=1&&!this.done){this.done=1;HEAL.v+=this.v;}}
  draw(){const c=CX();if(!c||!this.tr.length)return;const t=this.t,S=this.s;
    if(t<.48){trail(c,this.tr,5.6*S,'#ff5a78','#3a0410');const [hx,hy]=this.tr[0];glow(hx,hy,22*S,'#ff4a6a',.85);put('sheart',hx,hy,20*S*(1+.12*Math.sin(t*30)),{ay:.5});}
    else{const p=PL();if(!p)return;const [x,y]=PJ(p.x,p.y,CH+6+pz()),k=Math.min(1,(t-.48)/.14);glow(x,y,30*S,'#ff4a6a',.8*(1-k));put('sheart',x,y-12*k,22*S*(1+.3*k),{ay:.5,a:1-k});}}}

/* =============================== impact =============================== */
const IMC='#e8c07a',IMD='#3a2208';
class ImpactPow extends Pc{constructor(e,s){super('top',.5);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc+4;this.r=Math.max(12,b.r);this.s=s;this.rot=rnd(0,TAU);
    this.rk=[0,1,2,3].map(()=>{const a=rnd(0,TAU),v=rnd(50,100);return {x:0,y:0,z:0,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:rnd(70,140),r:rnd(0,TAU),vr:rnd(-9,9),q:rnd(.8,1.2)};});}
  tick(dt){for(const d of this.rk){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=420*dt;d.z+=d.vz*dt;if(d.z<-this.zc){d.z=-this.zc;d.vz*=-.2;d.vx*=.5;d.vy*=.5;}d.r+=d.vr*dt;}}
  draw(){const c=CX();if(!c)return;const t=this.t,k=t/this.life,[x,y]=PJ(this.x,this.y,this.zc),S=this.s*Math.pow(this.r/16,.5),
      sc=t<.06?eOut(t/.06)*1.25:1.25-.25*Math.min(1,(t-.06)/.12),a=k<.55?1:(1-k)/.45,R=21*S*sc;
    glow(x,y,R*1.9,'#ffcf7a',.5*a);glow(x,y,R*.7,'#ffffff',Math.max(0,1-t/.1));
    const star=(rr,n)=>{c.beginPath();for(let i=0;i<=n*2;i++){const an=i/(n*2)*TAU,q=i%2?rr*.48:rr*(i%4?1:.8);i?c.lineTo(Math.cos(an)*q,Math.sin(an)*q):c.moveTo(Math.cos(an)*q,Math.sin(an)*q);}c.closePath();};
    c.save();c.translate(x,y);c.rotate(this.rot+t*.6);c.globalAlpha=a;c.lineJoin='round';star(R,10);c.strokeStyle=IMD;c.lineWidth=4.4;c.stroke();
    const g=c.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#fff2c8');g.addColorStop(.62,IMC);g.addColorStop(1,'#b07a2e');c.fillStyle=g;c.fill();
    c.rotate(.31);star(R*.55,8);c.globalAlpha=a*.9;c.fillStyle='#fffbe8';c.fill();c.restore();
    for(const d of this.rk){const [rx,ry]=PJ(this.x+d.x,this.y+d.y,this.zc+d.z);rock(c,rx,ry,3*d.q,d.r,'#b89a6a',IMD,Math.min(1,(this.life-t)/.15));}}}

/* =============================== buff side: the gems' pictures rise above the hero =============================== */
class SupRise extends Pc{constructor(ids){super('top',1.05);this.ids=ids;ids.forEach(simg);}
  draw(){const c=CX(),p=PL();if(!c||!p)return;const t=this.t,k=t/this.life,n=this.ids.length,[x,y]=PJ(p.x,p.y,(p.z||0)+86+16*eOut(k)),a=(t<.12?t/.12:1)*(k>.7?(1-k)/.3:1);
    this.ids.forEach((id,i)=>{const im=SIMG[id],px=x+(i-(n-1)/2)*23,u=Math.min(1,Math.max(0,(t-i*.06)/.2)),s=u<1?20*eOut(u)*1.2:20*(1.2-.2*Math.min(1,(t-i*.06-.2)/.2));
      if(u<=0)return;glow(px,y,s*1.4,COL[id],.6*a);if(im.complete&&im.naturalWidth){c.save();c.globalAlpha=a;c.drawImage(im,px-s/2,y-s/2,s,s);c.restore();}else gem(c,px,y,s*.22,0,COL[id],'#1a1420',a);});}}
const DTX=(o)=>{try{_add0(new DText(o));}catch(e){}};
function buffSide(key,M){const p=PL();if(!p)return;const w=M.w,ids=['splash','burn','frost','leech','impact'].filter(i=>w[i]);if(!ids.length)return;
  spawn(new SupRise(ids));
  if(w.splash)spawn(new GroundPulse(p.x,p.y,14,84,.48,SPC,SPD,4.4));   /* its shield shows as the gem bubble (gem_mut_fx.js) */
  if(w.burn){ensureOv();spawn(new GroundPulse(p.x,p.y,14,90,.5,'#ff6a2a','#4a0c04',4.6));}
  if(w.frost){spawn(new GroundPulse(p.x,p.y,14,90,.5,'#8fe6ff','#06284a',4.6));try{for(const e of enemiesInCircle(p.x,p.y,90))if(e.st&&e.st.slow>0){GEMFX.mark(e,'ice',e.st.slow);if(burst)burst(e,'ice');}}catch(er){}}
  if(w.leech){const L=((G('PS')||{}).lv||1)*3*w.leech,v=p.hp<p.maxHp?L:0;for(let i=0;i<4;i++){const a=i/4*TAU+rnd(-.3,.3);spawn(new LeechHeart({x:p.x+Math.cos(a)*70,y:p.y+Math.sin(a)*52,z:26},i?0:v,SZ(w.leech)));}}
  if(w.impact){spawn(new GroundPulse(p.x,p.y,14,96,.44,IMC,IMD,5.6));for(let i=0;i<6;i++){const a=i/6*TAU;spawn(new DustPuff(p.x+Math.cos(a)*40,p.y+Math.sin(a)*30,a));}}}
class DustPuff extends Pc{constructor(x,y,a){super('top',.5);this.x=x;this.y=y;this.a=a;}
  draw(){const c=CX();if(!c)return;const k=this.t/this.life,d=50*eOut(k),[x,y]=PJ(this.x+Math.cos(this.a)*d,this.y+Math.sin(this.a)*d,6+6*k);puff(c,x,y,10+8*k,'190,160,118',.55*(1-k));}}

/* =============================== watcher =============================== */
const BUFQ=[];
const CORE={layer:'none',__gt:'-',_sk:null,_core:1,update(){try{watch();}catch(e){}return true;},draw(){}};
function ensureCore(){const F=FX();if(!F.includes(CORE))_add0(CORE);}
function watch(){const t=T(),p=PL();
  for(let i=BUFQ.length-1;i>=0;i--){const q=BUFQ[i];if(t<q.at)continue;BUFQ.splice(i,1);if(q.R&&!q.R.hits)buffSide(q.key,q.M);}
  if(HEAL.v>0&&t-HEAL.t>.32&&p){HEAL.t=t;DTX({x:p.x,y:p.y,z:66+pz(),text:'+'+Math.round(HEAL.v)+' HP',color:'#ff7d96',size:12,life:.8});HEAL.v=0;}}
setInterval(()=>{sm();if(ANY||BUFQ.length)ensureCore();const F=FX();for(const p of LIVE)if(!F.includes(p))LIVE.delete(p);},250);

/* =============================== hooks =============================== */
function onCast(key,M){const p=PL(),w=M.w;if(!p)return;const S=ST(),R=S&&S.REC[key],A=actOf(key);
  if(w.third&&A){if(PIPS)PIPS.life=Math.min(PIPS.life,PIPS.t+.05);PIPS=spawn(new ThirdPips(((A.casts-1)%3+3)%3+1,SZ(w.third)));}
  if(w.quick)spawn(new QuickClock(SZ(w.quick)));
  if(w.thrift)spawn(new ThriftRefund(SZ(w.thrift)));
  if((w.splash||w.burn||w.frost||w.leech||w.impact)&&R)BUFQ.push({at:T()+.95,key,M,R});}
function onHit(e,k,M,s0,auto){const w=M.w,S=ST(),R=S&&S.REC[k],A=actOf(k),p=PL();
  if(w.echo&&!auto&&s0.fr){e._gsE={fr:s0.fr,x:s0.x,y:s0.y,z:s0.z,phi:Math.atan2(e.y-s0.y,e.x-s0.x),d:Math.hypot(e.x-s0.x,e.y-s0.y),t:T()};if(rl(e,'s_echo',.2))spawn(new EchoMark(e,SZ(w.echo)));}
  if(w.third&&R&&R.third&&rl(e,'s_third',.12))spawn(new ThirdHit(e,SZ(w.third)));
  if(w.force&&rl(e,'s_force',auto?.25:.1))spawn(new ForceHit(e,SZ(w.force)*(auto?.8:1)));
  if(w.splash&&rl(e,'s_splash',.22)){const r=A&&A.mut&&A.mut.includes('spread')?80:70;spawn(new SplashGround(e,r,SZ(w.splash)));spawn(new SplashDrops(e,r,SZ(w.splash)));}
  if(w.burn){ensureOv();if(rl(e,'s_burn',.3))spawn(new IgniteLick(e,SZ(w.burn)));}
  if(w.frost&&A&&A.n>0){const st=e.st||{};
    if(A.n%6===0&&st.frozen>0){if(burst)burst(e,'ice',1);GEMFX.mark(e,'freeze',st.frozen);}
    else if(A.n%3===0){if(burst)burst(e,'ice');GEMFX.mark(e,'ice',Math.max(1,st.slow||2));}}
  if(w.pierce&&s0.def>0&&rl(e,'s_pierce',.18))spawn(new PierceLance(e,phiTo(e),SZ(w.pierce)));
  if(w.leech&&R&&p){const g=R.heal-(R===s0.R?s0.heal:0);if(g>0){const b=body(e);spawn(new LeechHeart({x:e.x,y:e.y,z:b.zc},Math.max(0,p.hp-s0.hp),SZ(w.leech)));}}
  if(w.impact&&A&&A.n>0&&A.n%5===0){spawn(new ImpactPow(e,SZ(w.impact)));const b=body(e);spawn(new GroundPulse(e.x,e.y,b.r,b.r*3.2,.42,IMC,IMD,4.6));}}
function onEcho(e,M){const s=SZ(M.w.echo);if(rl(e,'s_echoh',.15))spawn(new EchoHit(e,s));const g=e._gsE;if(g&&T()-g.t<1.2&&rlG('s_ghost',.3))spawn(new EchoGhost(g,s));}

let CUR=null;const LASTC={};   /* last real cast per skill: buffs refreshed later by a hero's own ticker do not pop the pictures again */
const _cast=window.castSkillNow;
if(typeof _cast==='function')window.castSkillNow=castSkillNow=function(key){const pc=CUR;CUR=key;let r;try{r=_cast.apply(this,arguments);}finally{CUR=pc;}
  try{if(r){const M=supsOf(key);if(M){LASTC[key]=T();ensureCore();onCast(key,M);}}}catch(e){}
  return r;};
const _hurt=window.hurt;
if(typeof _hurt==='function')window.hurt=hurt=function(e,m,o){const oo=o||{};let k=null,M=null,s0=null;
  try{sm();if(ANY&&e&&!oo.dot){const pa=PL();k=oo.auto?'@auto':(oo.skill||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null);M=supsOf(k);
    if(M&&!oo._gem){const S=ST(),R=S&&S.REC[k];let fr=null;if(M.w.echo&&!oo.auto){try{fr=playerFrame();}catch(er){}}
      s0={R,heal:R?R.heal:0,hp:pa?pa.hp:0,def:(e.m&&e.m.def)||0,fr,x:pa.x,y:pa.y,z:pa.z||0};}}}catch(er){}
  const d=_hurt.apply(this,arguments);
  try{if(d>0&&e&&M){ensureCore();if(oo._gem){if(oo.label==='ECHO'&&M.w.echo)onEcho(e,M);}else if(s0)onHit(e,k,M,s0,!!oo.auto);}}catch(er){}   /* the gem's own echo comes through gh (_gem); the wolf's Savage Echo also says 'ECHO' but is a normal hit */
  return d;};
/* the gem chain's plain zigzag (totem_gems GemZap) becomes a real bolt */
const _addFx=window.addFx;
if(typeof _addFx==='function')window.addFx=addFx=function(f){
  if(f&&f.a&&f.b&&f.constructor&&f.constructor.name==='GemZap'){try{const cb=spawn(new ChainBolt(f.a,f.b,f.c==='#5ad1ff'));if(cb)return cb;}catch(e){}}
  return _addFx.apply(this,arguments);};
/* a buff made longer by echo / force / chain / pierce: their pictures rise with the seconds added (totem_gems addBuff: 3 × echo + 2 × the others) */
const _buff=window.addBuff;
if(typeof _buff==='function')window.addBuff=addBuff=function(bk,dur){const r=_buff.apply(this,arguments);
  try{const pa=PL(),key=CUR||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null,M=key&&supsOf(key);
    if(M&&T()-(LASTC[key]||-9)<1.5){const w=M.w,x=3*(w.echo||0)+2*((w.force||0)+(w.chain||0)+(w.pierce||0));
      if(x>0&&rlG('s_buf'+key,.8)){ensureCore();spawn(new SupRise(['echo','force','chain','pierce'].filter(i=>w[i])));DTX({x:pa.x,y:pa.y,z:100+pz(),text:'บัฟ +'+(Math.round(x*10)/10)+' วิ',color:'#d9ccff',size:12,life:1});}}}catch(e){}
  return r;};

GEMFX.supOn=true;
GEMFX.sup={supsOf,state:()=>({LIVE:LIVE.size,BUFQ:BUFQ.length,HEAL:HEAL.v})};
})();
