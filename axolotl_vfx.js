/* =====================================================================
   AXOLOTL TIDE PRIEST — skill effects v3: SVG art (axolotl_art.js) + code VFX.
   Owner 2026-11-21: "make the axolotl's skill effects with VFX / SVG, following the concept and the skill descriptions"
   — same brief as the cat (cat_vfx.js) and the kitsune (kitsune_vfx.js); the piece kit is theirs (window.K3 + window.VK).

   CONCEPT (index.html, "AXOLOTL — TIDE PRIEST"): water mage / healer with twin jade bracelets, mid–long range.
   Living liquid: clear water, drops, foam, ribbons, ripples, membranes, mint healing light — no ice, no lightning,
   no light pillars. Colours by tree (the painted icons in assets/skill-icons/axolotl):
     Basic "Little Tide Apprentice" = clear aqua water · A "Pressure Weaver" = deep pressure-blue water (jets, drill,
     saw, cannon, the ocean's heart) · B "Springkeeper" = mint healing water, pink lotus, sprouts, bubbles ·
     C "Eternal Spring" = the colour of the column it belongs to.

   HOW IT IS WIRED — no gameplay is touched:
   · The axolotl's code lives in index.html. Its visual classes (Ripple, Splash, AxBolt, WaterJet, WaterSaw, HeartOrb …)
     are repainted here through their prototypes: update() still runs the game (hits, onHit, timers, pops), draw() is new,
     and a few get extra pieces on their first frame or the frame they hit.
   · axCast / mkBasic are wrapped for the cast: water gathers at the bracelets for exactly the wind-up, a ring of water
     closes on her, a flash leaves her hands on the release frame. The normal attack is a cast too (she is a ranged mage):
     the 'buff' clip replaces the wolf's axe swing with the same release time and length, so her attack rate is unchanged.
   · Hit splashes come from the damage itself (jgAfterHurt); every heal tick from axHeal (one pulse per real heal).
   · ?vfx3=0 = the old code look.
   TIMING: the action clock runs at ACTION_TEMPO; rt() turns action seconds into real seconds. Three old timing bugs are
   fixed here (visual only): the pressure orb of Compression Shot / Hydro Cannon was given its life in action seconds and
   vanished before the release; Ocean's Heartbeat's orb did the same and was gone before the third beat, so the ultimate's
   final burst was never seen; both now live in real seconds.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='axolotl'||!window.K3||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {PAL,TAU,cl,eO,eI,back,lerp,R_,rt,rgba,tint,art,sprite,star,KGlint,KBurst,KRing,ring,petals,whirlPetals,ensure}=window.K3;
const V=window.VK,{sys,tx,G}=V,A=window.KTA;
/* palettes: [ink (dark shape behind), deep, mid, lite, core] */
const WAT=['#052c3c','#0c7c9a','#33cde0','#b8f6ff','#ffffff'],PRS=['#06203f','#1462b8','#3aa8f0','#bfe8ff','#ffffff'],
  MNT=['#063a22','#17a865','#6ff0a8','#d8ffe6','#ffffff'],TQ=['#04332e','#0e9488','#3fe0c8','#c8fff2','#ffffff'],LOT=['#4a0c30','#e0508c','#ff9ccc','#ffe2f0','#ffffff'],GLD=PAL.gold;
const AXV=window.AXV={on:1};
const brOf=k=>{const s=k&&SKILLS[k];if(!s)return 'basic';return s.br==='C'?(s.col||'basic'):(s.br||'basic');};
const palOf=k=>{const b=brOf(k);return b==='A'?PRS:b==='B'?MNT:WAT;};
const kOf=p=>p===MNT?'M':p===PRS?'P':'';
const crownOf=p=>p===MNT?'crownM':p===PRS?'crownP':'crown';
const zOf=e=>e&&e.boss?40:26;
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.5,Q.p):1)));
const isMint=c=>{if(typeof c!=='string')return false;let r,g,b;const m=c.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(m){r=+m[1];g=+m[2];b=+m[3];}else if(c[0]==='#'&&c.length>=7){r=parseInt(c.slice(1,3),16);g=parseInt(c.slice(3,5),16);b=parseInt(c.slice(5,7),16);}else return false;return g>r+30&&g>b+8;};
const mine=()=>!!(window.SKCTX||window.__ACTEV);
const patch=(C,o)=>{if(typeof C!=='function')return;for(const k in o){if(!C.prototype['_'+k+'0'])C.prototype['_'+k+'0']=C.prototype[k];C.prototype[k]=o[k];}};
const hand=()=>{try{return handPos();}catch(_){return [player.x,player.y,34];}};

/* ---------------------------------------------------------------------
   1. WATER PIECES
   --------------------------------------------------------------------- */
/* drops thrown into the shared spray list (drawn, landed and rippled by AxSprayFx below). k: '' aqua · 'M' mint · 'P' pressure blue */
function drops(x,y,z,n,o={}){for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.6:o.spread):R_(0,TAU),v=R_(.35,1)*(o.spd==null?150:o.spd);
    axSpray.push({x:x+R_(-3,3),y:y+R_(-2,2),z:Math.max(1,z+R_(-3,5)),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.7+(o.vy||0),vz:R_(o.up0==null?60:o.up0,o.up1==null?220:o.up1),r:R_(1.6,3)*(o.s||1),life:R_(.55,1)*(o.life||1),t:-(o.delay?R_(0,o.delay):0),rip:o.rip!==false,k:o.k||''});}}
/* bubbles that float up and wobble */
function bubbles(x,y,z,n,o={}){for(let i=0;i<qn2(n);i++)axSpray.push({x:x+R_(-1,1)*(o.r||14),y:y+R_(-6,6),z:z+R_(0,o.h||20),vx:R_(-10,10),vy:0,vz:0,r:R_(1.6,3.2)*(o.s||1),life:R_(.6,1.1)*(o.life||1),t:-R_(0,o.stag||.2),rip:false,k:'B',float:R_(30,60)*(o.up||1)});}
/* mist in a water colour (soft smoke textures of the shared kit) */
const MT={W:'#d8fbff|#4fb8d8',M:'#c8ffe0|#3fbf86',P:'#d8ecff|#4a8ee0'};
function mist(x,y,z,n,o={}){const S=sys(o.layer||'top'),tn=o.tint||MT.W,size=o.size||46;for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.6):R_(0,TAU),v=(o.spd==null?40:o.spd)*R_(.4,1),r=o.ring||0;
    S.add({im:tx('smoke',tn,i%4),x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.8,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:o.rise==null?16:o.rise,dr:o.dr||1.8,s0:size*R_(.45,.65),s1:size*R_(.95,1.35),life:(o.life||.9)*R_(.75,1.15),fi:.08,fo:.65,a0:(o.a||.6)*R_(.75,1),rot:R_(0,TAU),vr:R_(-.6,.6),delay:o.delay?R_(0,o.delay):0});}}
/* a glossy little sphere of water (gathering at the hands, the compressed shot) */
function orb(x,y,r,p,a=1,dark=0){if(r<.6)return;ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation='lighter';const h=ctx.createRadialGradient(x,y,0,x,y,r*2.6);h.addColorStop(0,rgba(p[2],.5));h.addColorStop(1,rgba(p[2],0));ctx.fillStyle=h;ctx.beginPath();ctx.arc(x,y,r*2.6,0,TAU);ctx.fill();
  ctx.globalCompositeOperation='source-over';const g=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.08,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.3,p[3]);g.addColorStop(.75,p[2]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  if(dark>0){const d=ctx.createRadialGradient(x+r*.1,y+r*.15,0,x,y,r*.75);d.addColorStop(0,rgba(p[0],.9*dark));d.addColorStop(1,rgba(p[0],0));ctx.fillStyle=d;ctx.beginPath();ctx.arc(x,y,r*.75,0,TAU);ctx.fill();}
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(x-r*.38,y-r*.42,r*.22,r*.13,-.6,0,TAU);ctx.fill();ctx.restore();}
/* a band through screen points q (half widths w), one filled polygon per tone [scale, colour, alpha] */
function band(q,w,tones){const n=q.length;if(n<2)return;const N=[];for(let i=0;i<n;i++){const a=q[Math.min(n-1,i+1)],b=q[Math.max(0,i-1)];let dx=a[0]-b[0],dy=a[1]-b[1];const d=Math.hypot(dx,dy)||1;N.push([-dy/d,dx/d]);}
  for(const [s,c,al] of tones){if(al<=0)continue;ctx.globalAlpha=al;ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<n;i++){const ww=w[i]*s;ctx.lineTo(q[i][0]+N[i][0]*ww,q[i][1]+N[i][1]*ww);}for(let i=n-1;i>=0;i--){const ww=w[i]*s;ctx.lineTo(q[i][0]-N[i][0]*ww,q[i][1]-N[i][1]*ww);}ctx.closePath();ctx.fill();}ctx.globalAlpha=1;}
const tones=(p,a=1)=>[[1.65,p[0],.26*a],[1.2,p[1],.92*a],[.85,p[2],a],[.5,p[3],a],[.17,p[4],a]];
/* split a point list into runs where pred holds (the joining point is shared so runs meet) */
function runs(pts,pred){const out=[];let cur=null;for(let i=0;i<pts.length;i++){const ok=pred(pts[i]);if(ok){if(!cur){cur=[];if(i>0)cur.push(pts[i-1]);out.push(cur);}cur.push(pts[i]);}else if(cur){cur.push(pts[i]);cur=null;}}return out;}

/* a crown splash standing on the ground: shoots up, widens, sinks and fades */
class WCrown{constructor(o){Object.assign(this,{t:0,layer:'sorted',w:60,life:.46,n:'crown',a:1,delay:0,z:0},o);this.t=-this.delay;}
  get sy(){return this.y+(this.front==null?1:this.front);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const im=A.get(this.n);if(!im)return;const t=this.t,up=eO(cl(t/.09,0,1)),k=cl((t-.09)/(this.life-.09),0,1),[x,y]=P(this.x,this.y,this.z),[aw,ah]=A.size(this.n),w=this.w*(1+.3*k),h=this.w*ah/aw*.82*(.25+.8*up)*(1-.5*k*k),a=this.a*.9*(1-k*k);
    ctx.save();ctx.translate(x,y);const ink=tint(this.n,'#052c3c');if(ink){ctx.globalAlpha=a*.3;ctx.drawImage(ink,-w/2+2,-h*.92+3,w,h);}ctx.globalAlpha=a;ctx.drawImage(im,-w/2,-h*.92,w,h);
    if(t<.07){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-t/.07)*.8;ctx.drawImage(im,-w/2,-h*.92,w,h);}ctx.restore();}}
const crown=o=>addFx(new WCrown(o));
/* wet ground left by a splash: a dark clear puddle that spreads and dries */
class WPool{constructor(o){Object.assign(this,{t:0,layer:'ground',R:40,life:1.2,pal:WAT,a:1,grow:.18,delay:0},o);this.t=-this.delay;this.ph=R_(0,TAU);this.sq=R_(.85,1.1);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,g=eO(cl(this.t/this.grow,0,1)),R=this.R*g,[x,y]=P(this.x,this.y),p=this.pal,a=this.a*(k<.55?1:1-(k-.55)/.45);if(R<1)return;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K*this.sq);ctx.globalAlpha=a;ctx.beginPath();for(let i=0;i<=28;i++){const an=i/28*TAU,rr=R*(1+.08*Math.sin(an*3+this.ph)+.05*Math.sin(an*5-this.ph));i?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();
    const gr=ctx.createRadialGradient(-R*.2,-R*.25,R*.1,0,0,R*1.05);gr.addColorStop(0,rgba(p[3],.16));gr.addColorStop(.7,rgba(p[2],.16));gr.addColorStop(1,rgba(p[0],.2));ctx.fillStyle=gr;ctx.fill();
    ctx.globalAlpha=a*.75;ctx.strokeStyle='#ffffff';ctx.lineCap='round';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,R*.8,Math.PI*1.1+this.ph*.1,Math.PI*1.5+this.ph*.1);ctx.stroke();ctx.restore();}}
const pool=o=>addFx(new WPool(o));
/* a column of water thrown up out of the ground (impacts, the reforming body) */
class WGeyser{constructor(o){Object.assign(this,{t:0,layer:'sorted',H:110,W:34,life:.6,pal:WAT,delay:0,flare:1.1},o);this.t=-this.delay;this.ph=R_(0,9);this.acc=0;}
  get sy(){return this.y+(this.back?-3:2);}
  update(dt){this.t+=dt;if(this.t>0&&this.t<this.life*.55){this.acc+=dt;if(this.acc>.05){this.acc=0;drops(this.x,this.y,this.H*R_(.55,1),2,{spd:100,up0:40,up1:160,k:kOf(this.pal)});}}return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,up=back(cl(t/.12,0,1)),f=cl((t-.18)/(this.life-.18),0,1),H=this.H*up*(1-f*.55),[x,y]=P(this.x,this.y,0),p=this.pal;if(H<3)return;
    const shape=(k,hk,ph,col,al)=>{const N=14,q=[];for(let i=0;i<=N;i++){const u=i/N,wob=Math.sin(u*7-t*20+this.ph+ph)*5*u,hw=this.W*k*.5*(1-f*.45)*(1+this.flare*Math.pow(u,2.4))*(u>.88?1-(u-.88)/.12*.55:1);q.push([x+wob,y-H*hk*u*(1-.1*Math.pow(u,6)*Math.abs(Math.sin(i*2.7+t*9))),hw]);}
      ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(q[0][0]-q[0][2],q[0][1]);for(const a of q)ctx.lineTo(a[0]-a[2],a[1]);for(let i=N;i>=0;i--)ctx.lineTo(q[i][0]+q[i][2],q[i][1]);ctx.closePath();ctx.fill();};
    ctx.save();shape(1.55,1,0,p[0],.24*(1-f));shape(1.15,1,0,p[1],.9*(1-f*.5));shape(.85,.97,.6,p[2],1-f*.4);shape(.5,.92,1.3,p[3],1-f*.3);shape(.17,.86,2.1,p[4],1-f*.3);
    ctx.globalAlpha=1-f;ctx.fillStyle='#ffffff';for(let i=0;i<6;i++){const an=i/6*TAU+t*3,r=this.W*.62*(1+.2*Math.sin(i*2.3));ctx.beginPath();ctx.arc(x+Math.cos(an)*r,y-H*.93+Math.sin(an)*r*.35,2.2+(i%2),0,TAU);ctx.fill();}ctx.restore();}}
const geyser=o=>addFx(new WGeyser(o));
/* a ring wave of water rolling out over the ground (heart beats, Spring Renewal) */
class WWave{constructor(o){Object.assign(this,{t:0,layer:'ground',R:120,life:.55,pal:WAT,w:16,r0:10,delay:0},o);this.t=-this.delay;this.ph=R_(0,TAU);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,r=lerp(this.r0,this.R,eO(k)),[x,y]=P(this.x,this.y),p=this.pal,a=Math.pow(1-k,1.1),w=this.w*(1-k*.45),ri=Math.max(0,r-w*1.5);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.26*a;ctx.strokeStyle=p[0];ctx.lineWidth=w*1.5;ctx.beginPath();ctx.arc(0,0,Math.max(1,r-w*.35),0,TAU);ctx.stroke();
    const g=ctx.createRadialGradient(0,0,ri,0,0,r+w*.5);g.addColorStop(0,rgba(p[1],0));g.addColorStop(.5,rgba(p[2],.5*a));g.addColorStop(.85,rgba(p[3],.85*a));g.addColorStop(1,rgba(p[3],0));
    ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r+w*.5,0,TAU);if(ri>0)ctx.arc(0,0,ri,0,TAU,true);ctx.fill();
    ctx.lineCap='round';ctx.strokeStyle='#ffffff';ctx.globalAlpha=a;ctx.lineWidth=Math.max(1,w*.17);for(let i=0;i<5;i++){const s=this.ph+i*TAU/5+k*.5;ctx.beginPath();ctx.arc(0,0,r,s,s+TAU/5*.72);ctx.stroke();}
    ctx.fillStyle='#ffffff';for(let i=0;i<16;i++){const an=this.ph*2+i*TAU/16;ctx.globalAlpha=a*.85;ctx.beginPath();ctx.arc(Math.cos(an)*(r+w*.2),Math.sin(an)*(r+w*.2),1.2+w*.07,0,TAU);ctx.fill();}ctx.restore();}}
const wave=o=>addFx(new WWave(o));
/* bubble skin flying apart when a bubble pops */
function skin(x,y,z,R,a0=1){sprite({layer:'top',x,y,z,life:.3,fi:.01,fo:.3,paint:(f,X,Y)=>{const k=f.t/.3;ctx.strokeStyle='#ffffff';ctx.lineCap='round';for(let i=0;i<9;i++){const an=i/9*TAU+.3,r=R*(1+k*1.1);ctx.globalAlpha=a0*(1-k);ctx.lineWidth=2.4*(1-k)+.6;ctx.beginPath();ctx.ellipse(X,Y,r,r*.95,0,an,an+.32);ctx.stroke();}}});
  const S=sys('top');G.flare(S,x,y,z,R*1.3,'#d8fbff',.18);}
/* the generic water hit on a body: water rays, drops, a glint (+ a crown at the feet for big hits) */
const lastH=new WeakMap();
function hitFx(e,o,crit){if(!e)return;const big=!!(o&&o.big)||crit,now=gameTime;if(!big&&now-(lastH.get(e)||-9)<.08)return;lastH.set(e,now);
  const key=window.SKCTX||(player.action&&(player.action.skill||player.action.key))||'basic',p=palOf(key),z=zOf(e),bs=e.boss?1.3:1;
  addFx(new KBurst({e,x:e.x,y:e.y,z,R:(big?36:26)*bs,n:big?10:8,pal:p,life:big?.26:.2,ink:.45}));
  addFx(new KGlint({e,x:e.x,y:e.y,z:z+4,s:(big?20:13)*bs,col:p[3],life:.16}));drops(e.x,e.y,z,big?10:6,{spd:big?180:130,k:kOf(p)});
  if(big){crown({x:e.x,y:e.y,w:58*bs,n:crownOf(p),life:.4});pool({x:e.x,y:e.y,R:32*bs,pal:p,life:1});}
  if(crit)addFx(new KGlint({e,x:e.x,y:e.y,z:z+10,s:28*bs,col:'#ffffff',life:.2,delay:.02}));}
/* a heal landing on her: a mint ring at her feet, crosses rising (one per real heal, so the ticks of a channel or a HoT show) */
let lastHeal=-9;
function healFx(got,o){const now=gameTime;if(now-lastHeal<.12)return;lastHeal=now;const small=!!(o&&o.small);
  ring({x:player.x,y:player.y,follow:1,r0:12,r1:small?32:50,w:small?3:5,pal:MNT,life:small?.4:.55,segs:3,gap:.3});
  const n=small?1:3;for(let i=0;i<n;i++)sprite({n:'cross',layer:'top',follow:player,ox:R_(-18,18),oy:1,z:R_(28,58)*CHAR_SCALE,w:small?10:R_(13,17),life:.7,fi:.06,fo:.35,vz:46,s0:.4,s1:1,pop:.14,delay:i*.07});
  if(!small)petals(player.x,player.y,70*CHAR_SCALE,3,{spd:40,up:30});}
/* drops gathering into a moving point over T seconds (the hands during a cast) */
function inflow(T,p,n=4,to=hand){for(let i=0;i<n;i++){const an=R_(0,TAU),r=R_(42,64),z0=R_(14,70),dl=i*T/(n+1),L=Math.max(.12,Math.min(.24,T-dl));if(L<=.05)continue;
    sprite({layer:'top',x:player.x,y:player.y,life:L,delay:dl,fi:.03,fo:.04,paint:f=>{const k=eI(cl(f.t/L,0,1)),h=to(),sx=player.x+Math.cos(an)*r,sy=player.y+Math.sin(an)*r*.7,x=lerp(sx,h[0],k),y=lerp(sy,h[1],k),z=lerp(z0,h[2],k)+Math.sin(Math.PI*k)*18,[X,Y]=P(x,y,z),[X2,Y2]=P(h[0],h[1],h[2]);
      art(p===MNT?'dropM':p===PRS?'dropP':'drop',X,Y,6,{rot:Math.atan2(Y2-Y,X2-X)-Math.PI/2,under:'#052c3c',ua:.3});}});}}

/* ---------------------------------------------------------------------
   2. CAST · RELEASE · HITS · HEALS · THE OLD LOOK SWITCHED OFF
   --------------------------------------------------------------------- */
const OWN_ORB={axCompress:1,axCannon:1},PAL_K={acSpring:LOT};let LASTK=null;
function gather(k,p,T){if(T<=.02)return;ring({x:player.x,y:player.y,follow:1,r0:62,r1:16,w:4,pal:p,life:Math.max(.12,T),ease:eI,segs:4,gap:.35});
  if(!OWN_ORB[k])sprite({layer:'top',follow:player,life:T+.04,fi:.04,fo:.04,paint:f=>{const h=hand(),[x,y]=P(h[0],h[1],h[2]),s=cl(f.t/Math.max(.05,T),0,1);orb(x,y,2.5+5.5*eO(s),p,1);}});
  inflow(T,p,p===MNT?3:4);if(p===MNT)whirlPetals(player.x,player.y,2,{r0:24,r1:40,z0:20,z1:60,hold:Math.min(.6,T+.2),va:5,out:10,im:'leaf'+((Math.random()*2)|0)});}
function release(k,p){const h=hand(),S=sys('top');G.flare(S,h[0],h[1],h[2],30,p[2],.2);drops(h[0],h[1],h[2],3,{spd:110,dir:player.phi,spread:.8,up0:40,up1:120,k:kOf(p)});}
if(typeof axCast==='function'){const _c=axCast;axCast=function(o){const a=_c(o);if(!a)return a;try{const k=o.key,p=PAL_K[k]||palOf(k),T=rt(a.windup);LASTK=k;ensureWatch();
    a.events.push({t:0,f:()=>gather(k,p,T)},{t:a.windup,f:()=>release(k,p)});}catch(e){console.warn('axv cast',e);}return a;};}
/* normal attack: a quick cast (the 'buff' clip timed like the swing it replaces), water gathers in the hand, then the flick */
if(typeof mkBasic==='function'){const _b=mkBasic;mkBasic=function(t){const a=_b(t);if(!a||!a.seq||a.key!=='basic')return a;try{ensureWatch();
    const tC=a.windup,tot=seqTotal(a.seq),d2=player.dir,b=seq('buff',d2,0,null,1),pk=bPeak(d2),t1=Math.max(.001,seqTimeAt(b,pk)),t2=Math.max(.001,seqTotal(b)-t1);
    if(b.length>pk&&tot>tC)a.seq=b.map((q,i)=>({st:q.st,d:q.d,f:q.f,ms:q.ms*(i<pk?tC/t1:(tot-tC)/t2)}));
    const T=rt(tC);a.events.push({t:0,f:()=>{sprite({layer:'top',follow:player,life:T+.03,fi:.03,fo:.03,paint:f=>{const h=hand(),[x,y]=P(h[0],h[1],h[2]),s=cl(f.t/Math.max(.04,T),0,1);orb(x,y,1.5+3.5*eO(s),WAT,1);}});inflow(T,WAT,2);}},
      {t:Math.max(0,tC-.005),f:()=>{const h=hand();addFx(new KGlint({x:h[0],y:h[1],z:h[2],s:13,col:WAT[2],life:.14}));}});}catch(e){console.warn('axv basic',e);}return a;};}
/* the old code's spray() throws many drops per splash: 60 % of them read better as a spray (visual only) */
if(typeof spray==='function'){const _s=spray;spray=function(x,y,z,n,sp,dir,spread,o){return _s(x,y,z,Math.max(1,Math.round(n*.6)),sp,dir,spread,o);};}
/* hits from the damage itself */
{const _ah=window.jgAfterHurt;window.jgAfterHurt=function(e,dmg,crit,o){if(_ah)_ah(e,dmg,crit,o);if(!o||o.dot||!dmg)return;try{hitFx(e,o,crit);}catch(_){}};}
/* heals from the heal itself */
if(typeof axHeal==='function'){const _h=axHeal;axHeal=function(amt,o={}){const got=_h(amt,o);if(got>0)try{healFx(got,o);}catch(_){}return got;};}
/* the generic liquid crescent on Hydro Slap / Water Saw is replaced by the hand and the saw themselves */
if(typeof frontArc==='function')frontArc=function(){return null;};
/* engine pieces that do not fit living water: comic hit crescents, round puffs, round sparks; ex_ skills' gold rings become water */
if(!window._axv3h){window._axv3h=1;const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;if(n==='HitCrescents'||n==='PuffDust')return f;
      if(/^(SoftRing|GRing|SoftImpact|Impact|GLight)$/.test(n)&&f.color==='#ffe9a8'){if(n==='GLight')return f;const p=palOf(window.SKCTX||(player.action&&player.action.skill)||LASTK);
        if(/Ring/.test(n))A0(new KRing({x:f.x,y:f.y,r0:f.r0||10,r1:f.r1||46,w:5,pal:p,life:f.life||.32,segs:4,gap:.3}));else{const q=f.pos||[f.x,f.y,24];A0(new KGlint({x:q[0],y:q[1],z:q[2],s:14,col:p[3],life:.16}));drops(q[0],q[1],q[2],4,{spd:110,k:kOf(p)});}return f;}}
    return A0.apply(this,arguments);};
  const E0=window.emit;window.emit=emit=function(o){if(o){if(o.type==='mist'&&window.SKCTX==='asMist')return;if(mine()&&/^(round|spark|ember|glint)$/.test(o.type))return;}return E0.apply(this,arguments);};}

/* buff pieces: when the buff is recast the newest piece wins (the old code stacked copies: double bubbles, brighter gills) */
const NEWEST={};const newest=(f,k)=>{if(!f._nw){f._nw=1;NEWEST[k]=f;}return NEWEST[k]===f;};
/* ---------------------------------------------------------------------
   3. THE OLD WATER PIECES, REPAINTED (update = game, draw = new)
   --------------------------------------------------------------------- */
/* every spray drop: a glossy SVG drop leaning into its own motion; bubbles float; gill breaths are bubbles */
patch(AxSprayFx,{update(dt){for(const d of axSpray){d.t+=dt;if(d.t<0)continue;
      if(!d.k&&(d.col==='rgba(220,250,255,.5)'||d.col==='rgba(230,250,255,.55)')){d.k='B';d.float=R_(26,46);d.vx=R_(-8,8);}
      if(d.k==='B'){d.z+=d.float*dt;d.x+=d.vx*dt+Math.sin(d.t*9+d.r*3)*10*dt;continue;}
      d.vz-=700*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.z+=d.vz*dt;d.vx*=1-1.2*dt;d.vy*=1-1.2*dt;
      if(d.z<=0){d.dead=true;if(d.rip&&Math.random()<.35)addFx(new Ripple({x:d.x,y:d.y,R:8+d.r*3,life:.5,w:1,col:d.k==='M'||isMint(d.col)?'#a8ffd8':'#bff0ff'}));}}
    for(let i=axSpray.length-1;i>=0;i--)if(axSpray[i].dead||axSpray[i].t>axSpray[i].life)axSpray.splice(i,1);if(axSpray.length>420)axSpray.splice(0,axSpray.length-420);return CHAR==='axolotl';},
  draw(){const ink=tint('drop','#052c3c'),bub=A.get('bubble');for(const d of axSpray){if(d.t<0)continue;const [x,y]=P(d.x,d.y,d.z),a=cl((d.life-d.t)/.2,0,1)*cl(d.t/.03+.2,0,1);if(a<=.02)continue;
      if(d.k==='B'){if(bub){const s=d.r*3.3;ctx.globalAlpha=a*.95;ctx.drawImage(bub,x-s/2,y-s/2,s,s);}continue;}
      const k=d.k||(isMint(d.col)?'M':''),im=d.dirty?tint('drop','#4e3f63'):A.get(k==='M'?'dropM':k==='P'?'dropP':'drop');if(!im)continue;
      const sx=d.vx,sy=d.vy*K-d.vz,sp=Math.hypot(sx,sy),th=Math.atan2(sy,sx),w=d.r*2.05,h=w*1.375*(1+Math.min(1.2,sp*.0022));
      ctx.save();ctx.translate(x,y);ctx.rotate(th-Math.PI/2);if(ink){ctx.globalAlpha=a*.28;ctx.drawImage(ink,-w/2+1,-h*.55+1.5,w,h);}ctx.globalAlpha=a;ctx.drawImage(im,-w/2,-h*.55,w,h);ctx.restore();}ctx.globalAlpha=1;}});
/* ripple on the ground: broken rings of light on dark water, no outline */
patch(Ripple,{draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y),a=Math.pow(1-k,1.2),R=this.R*eO(k),p=isMint(this.col)?MNT:WAT,w=Math.max(1,this.w*(1.3-k*.6));if(R<1)return;
  ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';ctx.globalAlpha=.2*a;ctx.strokeStyle=p[0];ctx.lineWidth=w*2.6;ctx.beginPath();ctx.arc(0,0,R+w,0,TAU);ctx.stroke();
  for(const [f,al] of [[1,1],[.66,.55]]){const r=R*f,seg=TAU/3,len=seg*.78;for(let i=0;i<3;i++){const s=this.ph+i*seg+k*.8*(f<1?-1:1);ctx.globalAlpha=a*al*.8;ctx.strokeStyle=p[2];ctx.lineWidth=w*1.6;ctx.beginPath();ctx.arc(0,0,r,s,s+len);ctx.stroke();
      ctx.globalAlpha=a*al;ctx.strokeStyle=p[4];ctx.lineWidth=Math.max(.8,w*.55);ctx.beginPath();ctx.arc(0,0,r,s+len*.15,s+len*.8);ctx.stroke();}}ctx.restore();}});
/* splash: a crown of water out of the ground + a puddle + a flash (the drops and the ripple are the old constructor's) */
patch(Splash,{update(dt){if(!this._v){this._v=1;const near=Math.hypot(this.x-player.x,this.y-player.y)<10,p=near?MNT:palOf(this._sk);
      crown({x:this.x,y:this.y,w:this.R*1.35,n:crownOf(p),life:.3+this.R*.0012,a:.85});pool({x:this.x,y:this.y,R:this.R*.8,pal:p,life:1+this.R*.006});
      if(this.R>=60)ring({x:this.x,y:this.y,r0:this.R*.3,r1:this.R*1.15,w:6,pal:p,life:.45,segs:4,gap:.28});G.flare(sys('top'),this.x,this.y,this.z,this.R*1.05,p[2],.2);}
    return this._update0(dt);},draw(){}});
/* Water Flick: a glossy drop flying head first, its water tail streaming behind */
patch(AxBolt,{update(dt){const e=this.e;if(this._z0==null){this._z0=this.z;this._d0=Math.max(1,e?Math.hypot(e.x-this.x,e.y-this.y):1);}const r=this._update0(dt);if(e){const d=Math.hypot(e.x-this.x,e.y-this.y);this.z=lerp(zOf(e),this._z0,cl(d/this._d0,0,1));}return r;},
  draw(){const [x,y]=P(this.x,this.y,this.z),r=this.r,ang=this.ang||0,p=this.heal?MNT:WAT,tr=this.trail;
  if(tr.length>1){const q=tr.slice(-4).map(t=>P(t[0],t[1],this.z));q.push([x,y]);band(q,q.map((_,i)=>r*1.25*Math.pow(i/(q.length-1),.7)),[[1.5,p[0],.22],[1.05,p[1],.6],[.7,p[2],.85],[.32,p[3],.95]]);}
  art(p===MNT?'dropM':'drop',x,y,r*3.4,{rot:ang-Math.PI/2,under:'#052c3c',ua:.3});if(((this.t*30)|0)%2===0)star(x+R_(-3,3),y+R_(-3,3),R_(3,5),'#ffffff',this.t*6);}});
/* a drop flying to a point (heals, the rebound, water coming back) */
patch(AxDropFly,{update(dt){const r=this._update0(dt);if(this.d&&!this._v){this._v=1;const toMe=Math.hypot(this.tx-player.x,this.ty-player.y)<8;
      if(this.heal&&toMe){ring({x:player.x,y:player.y,follow:1,r0:6,r1:26,w:3,pal:MNT,life:.3,segs:3,gap:.3});addFx(new KGlint({x:player.x,y:player.y,z:this.tz,s:12,col:MNT[3],life:.16}));}
      else if(!toMe)drops(this.tx,this.ty,this.tz,3,{spd:90,k:this.heal?'M':''});}
    if(this.heal&&r&&Math.random()<.35){const k=eInOut(this.t/this.life);sprite({layer:'top',x:lerp(this.sx,this.tx,k),y:lerp(this.sy,this.ty,k),z:lerp(this.sz,this.tz,k)+Math.sin(Math.PI*k)*this.arc,life:.25,fi:.01,fo:.2,paint:(f,X,Y)=>star(X,Y,5*(1-f.t/.25),MNT[3],f.t*5)});}
    return r;},
  draw(){const pos=u=>{const k=eInOut(cl(u,0,1));return P(lerp(this.sx,this.tx,k),lerp(this.sy,this.ty,k),lerp(this.sz,this.tz,k)+Math.sin(Math.PI*k)*this.arc);};
    const u=this.t/this.life,[x,y]=pos(u),[x0,y0]=pos(u-.06),r=this.r||4.5;art(this.heal?'dropM':'drop',x,y,r*2.7,{rot:Math.atan2(y-y0,x-x0)-Math.PI/2,under:'#052c3c',ua:.3});}});
/* jets: Needle Jet (thin lance), Compression Shot (dense marble at the head), Hydro Cannon (thick turbulent beam), splits / ricochets.
   The jet leaves her raised hand and slopes down to the body of the first enemy on its line, then runs level at body height. */
patch(WaterJet,{update(dt){if(!this._v){this._v=1;const big=this.w>=12,p=this.col==='#2aa0e0'||big?PRS:(brOf(this._sk)==='A'?PRS:WAT);this._p=p;const S=sys('top');
      const L=Math.hypot(this.bx-this.ax,this.by-this.ay)||1;let dT=L,zT=26;for(const e of enemies){if(e.dead)continue;if(distToSeg(e.x,e.y,this.ax,this.ay,this.bx,this.by)<e.r+(big?20:10)){const d=Math.hypot(e.x-this.ax,e.y-this.ay);if(d>12&&d<dT){dT=d;zT=zOf(e);}}}
      this._dT=Math.max(20,dT)/L;this._zT=Math.min(this.z,zT);
      G.flare(S,this.ax,this.ay,this.z,this.w*4.5,p[2],.18);ring({x:this.ax,y:this.ay,r0:4,r1:big?44:22,w:big?6:3,pal:p,life:.3,segs:3,gap:.3});
      if(big){addFx(new WJetFloor({src:this}));mist(this.bx,this.by,this._zT*.5,6,{tint:MT.P,size:70,spd:60,life:1,dir:Math.atan2(this.by-this.ay,this.bx-this.ax),spread:1.2});}}
    return this._update0(dt);},
  zAt(u){const dT=this._dT||1,z1=this._zT==null?this.z:this._zT,v=1-Math.min(1,u/dT);return z1+(this.z-z1)*v*v;},   /* a smooth arc down to the body, level after it */
  pt(u){return P(lerp(this.ax,this.bx,u),lerp(this.ay,this.by,u),this.zAt(u));},
  draw(){const k=Math.min(1,this.t/this.grow),tail=this.t>this.life-.12?(this.t-(this.life-.12))/.12:0;if(k-tail<.005)return;
    const big=this.w>=12,comp=this.col==='#2aa0e0',p=this._p||WAT,t=this.t,w=this.w*(1-tail*.6)*(big?1.1:comp?1:.8),[x1,y1]=this.pt(tail),[x2,y2]=this.pt(k),L=Math.hypot(x2-x1,y2-y1);if(L<2)return;
    const N=Math.max(8,Math.min(42,L/7|0)),q=[],us=[];for(let i=0;i<=N;i++){const u=lerp(tail,k,i/N);us.push(i/N);q.push(this.pt(u));}
    const wob=(a,ph)=>q.map((_,i)=>{const u=us[i],tp=u<.1?.45+.55*u/.1:1;return w*tp*(1+a*Math.sin(u*L*.08-t*42+ph));});
    ctx.save();band(q,wob(big?.16:.1,0),[[1.75,p[0],.22]]);band(q,wob(big?.12:.08,2),[[1.25,p[1],.92]]);band(q,wob(.06,1),[[.88,p[2],1],[.52,p[3],1],[.2,p[4],1]]);
    const at=(u,o)=>{const f=u*N,i=Math.min(N-1,f|0),r=f-i,a=q[i],b=q[i+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1;return [a[0]+dx*r-dy/d*w*o,a[1]+dy*r+dx/d*w*o];};
    ctx.globalAlpha=.85;ctx.strokeStyle='#ffffff';ctx.lineCap='round';ctx.lineWidth=Math.max(1,w*.15);for(const o of [-.48,.36]){const sh=((t*6)%1);ctx.beginPath();for(let j=0;j<7;j++){const u0=(j/7+sh/7)%1,u1=Math.min(1,u0+.07);const A1=at(u0,o),B1=at(u1,o);ctx.moveTo(A1[0],A1[1]);ctx.lineTo(B1[0],B1[1]);}ctx.stroke();}
    ctx.fillStyle='#ffffff';const nb=big?16:8;for(let i=0;i<nb;i++){const u=((i/nb)+t*3)%1,s=i%2?1.12:-1.12,c=at(u,s);ctx.globalAlpha=.85*(1-tail);ctx.beginPath();ctx.arc(c[0],c[1],1.1+w*.1,0,TAU);ctx.fill();}
    if(big){const ang=Math.atan2(y2-y1,x2-x1);for(let i=0;i<4;i++){const u=((i/4)+t*2.2)%1,c=at(u,0),rr=w*(1.5+.25*Math.sin(t*20+i));ctx.globalAlpha=.55*(1-tail)*Math.sin(Math.PI*u);ctx.strokeStyle=p[3];ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(c[0],c[1],rr*.32,rr,ang,0,TAU);ctx.stroke();}}
    if(tail<1){ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';const hr=w*(comp?2.2:2.7),hg=ctx.createRadialGradient(x2,y2,0,x2,y2,hr);hg.addColorStop(0,'rgba(255,255,255,.95)');hg.addColorStop(.35,rgba(p[3],.6));hg.addColorStop(1,rgba(p[2],0));ctx.fillStyle=hg;ctx.beginPath();ctx.arc(x2,y2,hr,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
      if(comp)orb(x2,y2,w*1.15,PRS,1-tail,.9);}
    ctx.restore();}});
/* the wet track a big beam leaves on the ground */
class WJetFloor{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);this.life=this.src.life+.9;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const s=this.src,k=Math.min(1,this.t/Math.max(.01,s.grow)),a=this.t>this.life-.7?(this.life-this.t)/.7:1,[x1,y1]=P(s.ax,s.ay),[x2,y2]=P(lerp(s.ax,s.bx,k),lerp(s.ay,s.by,k));ctx.save();ctx.lineCap='round';
    ctx.globalAlpha=.16*a;ctx.strokeStyle=PRS[0];ctx.lineWidth=s.w*1.7;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalAlpha=.22*a;ctx.strokeStyle=PRS[2];ctx.lineWidth=s.w*.8;ctx.stroke();
    ctx.globalAlpha=.35*a;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x1,y1-s.w*.25);ctx.lineTo(x2,y2-s.w*.25);ctx.stroke();ctx.restore();}}
/* the orb pressed together in her hands before Compression Shot / Hydro Cannon (its life was in action seconds: now real) */
patch(PressureOrb,{update(dt){if(!this._v){this._v=1;this.life=rt(this.life);}return this._update0(dt);},
  draw(){const w=this.follow&&player.socket?player.socket.w:(this.pos||[player.x,player.y,40]),[x,y]=P(w[0]+Math.cos(player.phi)*10,w[1]+Math.sin(player.phi)*10,w[2]+6),k=Math.min(1,this.t/this.life),R=lerp(this.R0,this.R1,eI(k))*.72,p=PRS;
    ctx.save();for(let i=0;i<3;i++){const a0=i*TAU/3+this.t*7,q=[],ws=[];for(let j=0;j<=10;j++){const u=j/10,an=a0+u*2.2,rr=R*(2.4-1.3*u);q.push([x+Math.cos(an)*rr,y+Math.sin(an)*rr*.8]);ws.push(1.8*Math.sin(Math.PI*u)+.4);}band(q,ws,[[1,p[2],.7*(1-k*.4)],[.45,'#ffffff',.85]]);}ctx.restore();
    orb(x,y,R,p,1,.35+.6*k);ctx.save();ctx.globalAlpha=.6*(1-k);ctx.strokeStyle=p[3];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,R*(1.9-.8*k),R*(1.9-.8*k)*.8,0,0,TAU);ctx.stroke();ctx.restore();}});
/* Water Drill: a turning screw of water driven into the target, spray thrown round its tip */
patch(WaterDrill,{update(dt){const r=this._update0(dt);this._a=(this._a||0)+dt;if(r&&this._a>.05&&this.e&&!this.e.dead){this._a=0;const e=this.e,c=Math.cos(this.ang),s=Math.sin(this.ang);drops(e.x-c*8,e.y,28,2,{spd:140,dir:Math.atan2(s,c)+Math.PI+(Math.random()<.5?1.4:-1.4),spread:.5,up0:60,up1:150,k:'P'});}return r;},
  draw(){const e=this.e,[tx,ty]=P(e.x,e.y,28),ang=this.ang,c=Math.cos(ang),s=Math.sin(ang),a=Math.min(1,this.t/.1)*(this.t>this.life-.15?Math.max(0,(this.life-this.t)/.15):1),im=A.get('drill'+(((this.t*36)|0)%3));if(!im||a<=0)return;
    const L=this.len*1.45,H=L*64/132,push=3*Math.sin(this.t*48);ctx.save();ctx.translate(tx+c*(10+push),ty+s*(10+push));ctx.rotate(ang);const ink=tint('drill0','#06203f');
    if(ink){ctx.globalAlpha=a*.3;ctx.drawImage(ink,-L*.97+2,-H/2+3,L,H);}ctx.globalAlpha=a;ctx.drawImage(im,-L*.97,-H/2,L,H);
    ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,18);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(127,214,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,18,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#ffffff';ctx.lineWidth=1.6;ctx.lineCap='round';for(let i=0;i<4;i++){const an=this.t*30+i*TAU/4;ctx.globalAlpha=a*.8;ctx.beginPath();ctx.ellipse(-6,0,7,16,0,an,an+1);ctx.stroke();}ctx.restore();}});
/* Hydro Slap: a hand of water flies out and slaps; the slap throws a wave over the cone */
patch(WaterHand,{update(dt){const r=this._update0(dt);if(this.d&&!this._v){this._v=1;const phi=Math.atan2(this.ty-this.sy,this.tx-this.sx);slapWaves(this.tx,this.ty,phi);}return r;},
  draw(){const k=eO(Math.min(1,this.t/this.life)),x=lerp(this.sx,this.tx,k),y=lerp(this.sy,this.ty,k),[px,py]=P(x,y,30),[ax,ay]=P(this.sx,this.sy,30),[bx,by]=P(this.tx,this.ty,30),ang=Math.atan2(by-ay,bx-ax),W=76*this.sc*(.7+.3*k);
    if(k>.05){const q=[];for(let i=0;i<=8;i++){const u=i/8*k;q.push(P(lerp(this.sx,this.tx,u),lerp(this.sy,this.ty,u),30));}band(q,q.map((_,i)=>W*.16*Math.pow(i/8,1.2)),[[1.5,WAT[0],.18],[1,WAT[1],.5],[.6,WAT[2],.7],[.25,WAT[3],.8]]);}
    for(let i=2;i>=1;i--){const u=Math.max(0,k-.12*i),[gx,gy]=P(lerp(this.sx,this.tx,u),lerp(this.sy,this.ty,u),30);art('hand',gx,gy,W*(1-.08*i),{rot:ang,a:.22/i,ax:.45});}
    art('hand',px,py,W,{rot:ang,ax:.45,under:'#052c3c',ua:.3});}});
function slapWaves(x,y,phi){const left=Math.cos(phi)<0,c=Math.cos(phi),s=Math.sin(phi);
  for(const [o,sc,dl] of [[0,1,0],[-1,.62,.05],[1,.62,.05]]){const wx=x+(-s)*o*40+c*(10-o*o*16),wy=y+c*o*40+s*(10-o*o*16);
    sprite({n:'wave',layer:'sorted',x:wx,y:wy,ay:.95,w:66*sc,life:.34,delay:dl,fi:.02,fo:.2,s0:.35,s1:1,pop:.1,sx:left?-1:1,a:.9});}
  drops(x,y,22,10,{spd:200,dir:phi,spread:.9,up0:80,up1:220});mist(x,y,10,4,{spd:60,dir:phi,spread:.8,size:52,life:.7});}
/* Water Saw: a spinning disc of water sickles flying flat over the ground, a wet groove behind it */
patch(WaterSaw,{update(dt){if(!this._v){this._v=1;addFx(new WGroove({src:this}));}return this._update0(dt);},
  draw(){const [x,y]=P(this.x,this.y,22),[gx,gy]=P(this.x,this.y,0),R=this.R,a=this.t>this.life-.1?Math.max(0,(this.life-this.t)/.1):Math.min(1,this.t/.05),W=R*2.7,c=Math.cos(Math.atan2(this.ty-this.sy,this.tx-this.sx)),s=Math.sin(Math.atan2(this.ty-this.sy,this.tx-this.sx));
    ctx.save();ctx.globalAlpha=.22*a;ctx.fillStyle=PRS[0];ctx.beginPath();ctx.ellipse(gx,gy,R*.95,R*.38,0,0,TAU);ctx.fill();ctx.restore();
    for(let i=2;i>=1;i--){const [hx,hy]=P(this.x-c*14*i,this.y-s*14*i,22);art('disc',hx,hy,W,{flat:1,rot:-this.t*28+i*.4,a:a*.22/i});}
    art('disc',x,y,W,{flat:1,rot:-this.t*28,a,under:'#06203f',ua:.3});}});
class WGroove{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.4},o);}update(dt){this.t+=dt;if(fx.includes(this.src)){this.bx=this.src.x;this.by=this.src.y;this.end=this.t;}return this.t<(this.end||0)+.9;}
  draw(){const s=this.src;if(this.bx==null)return;const a=this.end!=null&&this.t>this.end?Math.max(0,1-(this.t-this.end)/.9):1,[x1,y1]=P(s.sx,s.sy),[x2,y2]=P(this.bx,this.by);ctx.save();ctx.lineCap='round';
    ctx.globalAlpha=.26*a;ctx.strokeStyle=PRS[0];ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalAlpha=.4*a;ctx.strokeStyle=PRS[2];ctx.lineWidth=6;ctx.stroke();ctx.globalAlpha=.75*a;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x1,y1-1.5);ctx.lineTo(x2,y2-1.5);ctx.stroke();ctx.restore();}}
/* Pressure Collapse = a wall of water standing round the target that closes in (back half behind it, front half in front),
   then a column thrown up; Gyro Current = a whirlpool round the target, three bands of water circling it */
class WHalf{constructor(o){Object.assign(this,{t:0,off:0},o);}get sy(){const e=this.src.e;return (e?e.y:0)+(this.half==='front'?2:-2)+this.off;}
  update(dt){this.t+=dt;return fx.includes(this.src)&&this.t<this.src.life+.05;}draw(){this.src.drawHalf(this.half);}}
patch(WaterRing,{update(dt){if(!this._v){this._v=1;const H=h=>addFx(new WHalf({src:this,half:h,layer:h==='front'?'sorted':h==='back'&&this.mode==='gyro'?'sorted':'ground'}));
      if(this.mode==='collapse'){H('back');H('front');}else{H('floor');H('back');H('front');}}
    const r=this._update0(dt);if(!r&&this.mode==='collapse'&&!this._g&&this.e){this._g=1;const e=this.e;geyser({x:e.x,y:e.y,H:e.boss?120:96,W:e.boss?40:30,pal:PRS,life:.5,flare:.6});}return r;},
  draw(){},
  drawHalf(h){const e=this.e;if(!e)return;const [cx,cy]=P(e.x,e.y,0),p=PRS;
    if(this.mode==='collapse'){const k=Math.min(1,this.t/this.life),R=this.R*(1-eI(k)*.9),hh=(14+38*k)*(e.boss?1.25:1),N=22,a0=h==='back'?Math.PI:0,bot=[],top=[];
      for(let i=0;i<=N;i++){const an=a0+i/N*Math.PI,wob=1+.14*Math.sin(an*5+this.t*16),x=cx+Math.cos(an)*R,y=cy+Math.sin(an)*R*K;bot.push([x,y]);top.push([x,y-hh*wob]);}
      ctx.save();ctx.globalAlpha=h==='back'?.5:.66;const g=ctx.createLinearGradient(0,cy-hh-R*K,0,cy+R*K);g.addColorStop(0,'#ffffff');g.addColorStop(.12,p[3]);g.addColorStop(.4,p[2]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.beginPath();bot.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));for(let i=N;i>=0;i--)ctx.lineTo(top[i][0],top[i][1]);ctx.closePath();ctx.fill();
      ctx.globalAlpha=1;ctx.strokeStyle='#ffffff';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=2.2;ctx.beginPath();top.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
      ctx.globalAlpha=.55;ctx.lineWidth=1.4;ctx.beginPath();for(let i=0;i<=N;i++){const yy=top[i][1]+hh*.32+2*Math.sin(i*.9+this.t*12);i?ctx.lineTo(top[i][0],yy):ctx.moveTo(top[i][0],yy);}ctx.stroke();
      if(h==='front'){ctx.fillStyle='#ffffff';for(let i=0;i<=N;i+=2){ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(top[i][0],top[i][1]-2*Math.sin(this.t*20+i),1.6+(i%3)*.5,0,TAU);ctx.fill();}}ctx.restore();return;}
    const R=this.R*(.85+.15*Math.sin(this.t*6)),a=Math.min(1,this.t/.15)*(this.t>this.life-.2?Math.max(0,(this.life-this.t)/.2):1);if(a<=0)return;
    if(h==='floor'){ctx.save();ctx.translate(cx,cy);ctx.scale(1,K);ctx.globalAlpha=a;const g=ctx.createRadialGradient(0,0,0,0,0,R*1.35);g.addColorStop(0,rgba(p[0],.55));g.addColorStop(.6,rgba(p[1],.32));g.addColorStop(1,rgba(p[1],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*1.35,0,TAU);ctx.fill();
      ctx.rotate(this.ang*.8);ctx.strokeStyle='#e8fbff';ctx.lineCap='round';for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4);ctx.globalAlpha=.55*a;ctx.lineWidth=2.4;ctx.beginPath();for(let j=0;j<=12;j++){const u=j/12,rr=R*1.25*(1-u*.85),an=u*2.6*this.dir;j?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.stroke();ctx.restore();}ctx.restore();return;}
    for(let b=0;b<3;b++){const z=(8+b*15)*(e.boss?1.3:1),rr=R*(1-.1*b),a0=this.ang*(1+.12*b)+b*2.1,span=2*(this.dir<0?-1:1),pts=[];
      for(let j=0;j<=18;j++){const u=j/18,an=a0+span*u;pts.push({q:P(e.x+Math.cos(an)*rr,e.y+Math.sin(an)*rr*.9,z+3*Math.sin(an*2+this.t*8)),s:Math.sin(an),u});}
      for(const run of runs(pts,o=>h==='back'?o.s<0:o.s>=0)){if(run.length<2)continue;band(run.map(o=>o.q),run.map(o=>(6.5-b*1.2)*Math.pow(Math.sin(Math.PI*o.u),.7)+.6),tones(p,a*(h==='back'?.6:1)));}}}});
/* membranes (Liquid Cushion, Living Membrane): a clear bubble round her that dents toward a hit, then pops */
patch(Membrane,{update(dt){if(this.popT==null&&!newest(this,'mem'+this.key))return false;const r=this._update0(dt);if(this.popT!=null&&!this._sk2){this._sk2=1;skin(player.x,player.y,36*CHAR_SCALE,this.R*1.1);}return r;},
  draw(){const [x,y]=P(player.x,player.y,36*CHAR_SCALE),pk=this.popT!=null?Math.min(1,(this.t-this.popT)/.25):0,R=this.R*(1+pk*.6),hk=Math.max(0,1-(this.t-this.hitT)/.35),a=(1-pk)*Math.min(1,this.t/.15),im=A.get(isMint(this.col)?'bubbleM':'bubble');if(!im)return;
    if(a>.01){const wob=Math.sin(this.t*5),ha=Math.atan2(Math.sin(this.hitA)*K,Math.cos(this.hitA)),sq=.24*hk*Math.sin(Math.PI*Math.min(1,hk*1.3)),s=R*2.2;ctx.save();ctx.translate(x,y);ctx.rotate(ha);ctx.scale(1-sq,1+sq*.45);ctx.rotate(-ha);ctx.scale(1+.035*wob,1.12*(1-.035*wob));
      ctx.globalAlpha=a*.95;ctx.drawImage(im,-s/2,-s/2,s,s);ctx.globalAlpha=a*.22;ctx.rotate(this.t*.8);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();}}});
/* Bubble Lift: the enemy floats inside a big clear bubble, small bubbles rise in it; it pops at the end */
patch(BubbleLift,{update(dt){const r=this._update0(dt);this._bt=(this._bt||0)+dt;const e=this.e;if(r&&this._bt>.14){this._bt=0;bubbles(e.x,e.y,(e.z||0)+6,1,{r:e.r*.55,h:22,up:.8});}
    if(!r&&this.popped&&!this._pf){this._pf=1;skin(e.x,e.y,(e.z||0)+(e.boss?34:20),e.r+12);}return r;},
  draw(){const e=this.e,[x,y]=P(e.x,e.y,(e.z||0)+(e.boss?34:20)),R=e.r+12,im=A.get('bubble');if(!im)return;const w=Math.sin(this.t*5),s=R*2.25;ctx.save();ctx.translate(x,y);ctx.scale(1+.045*w,1-.045*w);ctx.globalAlpha=.92*Math.min(1,this.t/.15);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.globalAlpha*=.24;ctx.rotate(this.t*.7);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();}});
/* Splash Pop: a bubble swells on the target, trembles, bursts (the splash itself is the old Splash, repainted) */
patch(PopBubble,{update(dt){const r=this._update0(dt);const e=this.e;this._bt=(this._bt||0)+dt;if(r&&this._bt>.1){this._bt=0;bubbles(e.x,e.y,(e.boss?36:24)-10,1,{r:e.r*.6,h:10,up:.7,s:.8});}
    if(this.p&&!this._pf){this._pf=1;skin(e.x,e.y,e.boss?36:24,(e.r+6)*1.5);}return r;},
  draw(){const e=this.e,k=this.t/this.life,[x,y]=P(e.x,e.y,(e.boss?36:24)),R=(e.r+6)*lerp(.4,1.5,eO(k))*(1+.05*Math.sin(this.t*40)*k),im=A.get('bubble');if(!im)return;const s=R*2.1;
    ctx.save();ctx.translate(x,y);ctx.scale(1+.06*k*Math.sin(this.t*31),1-.06*k*Math.sin(this.t*31));ctx.globalAlpha=.95;ctx.drawImage(im,-s/2,-s/2,s,s);ctx.globalAlpha=.28;ctx.rotate(this.t*1.4);ctx.drawImage(im,-s/2,-s/2,s,s);
    if(k>.7){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(k-.7)/.3*.5;ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,s*.46,0,TAU);ctx.stroke();}ctx.restore();}});
/* healing glints: mint crosses and stars rising round her */
patch(MintGlints,{draw(){for(const q of this.g){const k=(this.t-q.d)/(this.life-q.d);if(k<0||k>1)continue;const [x,y]=P(player.x+q.x,player.y,q.z+k*26),s=q.s*Math.sin(Math.PI*k);
    if(q.s>4.5)art('cross',x,y,s*2.8,{a:Math.min(1,Math.sin(Math.PI*k)*1.4)});else star(x,y,s*1.4,MNT[3],k*2);}}});
/* the water ribbons that spiral round her (Gentle Rinse, Purifying Rinse, Mending Stream, Miracle of Life) */
patch(Helix,{update(dt){const r=this._update0(dt);this._a=(this._a||0)+dt;if(r&&this._a>.08){this._a=0;const k=this.t/this.life,u=Math.min(1,k*1.6),zz=this.dir<0?this.h*(1-u):this.h*u,an=u*TAU*this.turns+this.t*4;
      const x=player.x+Math.cos(an)*this.R,y=player.y+Math.sin(an)*this.R*.5,mint=isMint(this.col);drops(x,y,zz*CHAR_SCALE+6,1,{spd:40,up0:20,up1:60,k:mint?'M':'',rip:false});if(mint&&Math.random()<.35)petals(x,y,zz*CHAR_SCALE+6,1,{spd:30,up:30,im:Math.random()<.5?'leaf0':'leaf1'});}return r;},
  draw(){const k=this.t/this.life,head=Math.min(1,k*1.6),tail=Math.max(0,k*1.6-.6),p=isMint(this.col)?MNT:this.col===AXC.aqua?WAT:TQ,W=this.R*.2+2,pts=[];if(head-tail<.01)return;
    for(let i=0;i<=40;i++){const u=lerp(tail,head,i/40),zz=this.dir<0?this.h*(1-u):this.h*u,an=u*TAU*this.turns+this.t*4;pts.push({q:P(player.x+Math.cos(an)*this.R,player.y+Math.sin(an)*this.R*.5,zz*CHAR_SCALE+6),s:Math.sin(an),u:i/40});}
    const a=this.t>this.life-.15?Math.max(0,(this.life-this.t)/.15):1,wf=o=>W*Math.pow(Math.sin(Math.PI*Math.min(1,o.u*1.05)),.6)+.5;
    ctx.save();for(const run of runs(pts,o=>o.s<0))if(run.length>1)band(run.map(o=>o.q),run.map(wf),tones(p,.55*a));for(const run of runs(pts,o=>o.s>=0))if(run.length>1)band(run.map(o=>o.q),run.map(wf),tones(p,a));ctx.restore();}});
/* Miracle of Life: the owner's painted lotus stays; around it the bloom throws light and petals. Without the painting: the SVG lotus opens */
patch(WaterLotus,{update(dt){const r=this._update0(dt);if(!this._v){this._v=1;addFx(new WSigil({follow:1,R:84,life:this.life,pal:MNT}));}
    if(this.t>1.05&&!this._b){this._b=1;const S=sys('top');G.glints(S,player.x,player.y,70,12,80,'#d8ffe6',.9);petals(player.x,player.y,100,10,{spd:90,up:70});wave({x:player.x,y:player.y,R:120,life:.7,pal:MNT,w:14});}
    if(this.t>this.life-.5&&!this._e){this._e=1;drops(player.x,player.y,90,12,{spd:120,k:'M'});}return r;},
  draw(){if(this.aimg)return this._draw0();const t=this.t,open=eO(Math.min(1,Math.max(0,(t-.3)/.8))),a=Math.min(1,t/.3)*(t>this.life-.6?Math.max(0,(this.life-t)/.6):1),[x,y]=P(player.x,player.y,this.z*.4);
    art('lotus',x,y,150*(.35+.65*open),{a,ay:.8,sy:.4+.6*open,under:'#4a0c30',ua:.25});if(open>.9)star(x,y-30,30*Math.sin(t*3)+30,'#e8fff0',t);}});
/* Slipstream: the wet glossy track she slides on, V wake ripples along it */
patch(WaterTrail,{draw(){const k=Math.min(1,this.t/.25),a=this.t>this.life-.6?Math.max(0,(this.life-this.t)/.6):1,[x1,y1]=P(this.ax,this.ay),[x2,y2]=P(lerp(this.ax,this.bx,k),lerp(this.ay,this.by,k)),dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);if(L<2)return;const ux=dx/L,uy=dy/L;
  ctx.save();ctx.lineCap='round';ctx.globalAlpha=.25*a;ctx.strokeStyle=WAT[0];ctx.lineWidth=this.w*2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalAlpha=.45*a;ctx.strokeStyle=WAT[2];ctx.lineWidth=this.w;ctx.stroke();
  ctx.globalAlpha=.85*a;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x1+uy*2,y1-ux*2);ctx.lineTo(x2+uy*2,y2-ux*2);ctx.stroke();
  for(let i=1;i<6;i++){const u=i/6,cx=x1+dx*u,cy=y1+dy*u,sp=10+14*(1-u)+this.t*14;ctx.globalAlpha=.55*a*(1-u*.5);ctx.lineWidth=1.4;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx-ux*8-uy*s*sp*.6,cy-uy*8+ux*s*sp*.6,cx-ux*14-uy*s*sp,cy-uy*14+ux*s*sp);ctx.stroke();}}ctx.restore();}});
/* Ocean's Heartbeat: a great orb of water with a heart of light; it beats three times, each beat rolls a wave over the ground,
   the third bursts it into a column and rain. (Its life was in action seconds and it died before the third beat: now real.) */
patch(HeartOrb,{update(dt){if(!this._v){this._v=1;this.life=rt(this.life);addFx(new WHeartFloor({src:this}));}const r=this._update0(dt);
    if(this.t<1.3){this._a=(this._a||0)+dt;if(this._a>.09){this._a=0;inflowTo(this.x,this.y,this.z);}}return r;},
  beat(i){this._beat0(i);const R=i===2?(LV.acResonant?240:170):170*(i?1:.8),S=sys('top');wave({x:this.x,y:this.y,R,life:.55+.05*i,pal:PRS,w:14+5*i});G.flare(S,this.x,this.y,this.z,70+30*i,PRS[2],.25);
    drops(this.x,this.y,this.z,8+i*6,{spd:180+i*60,up0:60,up1:200,k:'P'});if(i===2){geyser({x:this.x,y:this.y,H:150,W:64,pal:PRS,life:.7});crown({x:this.x,y:this.y,w:230,n:'crownP',life:.6});mist(this.x,this.y,20,10,{tint:MT.P,size:90,spd:120,life:1.2});}},
  draw(){const grow=eO(Math.min(1,this.t/1)),bk=Math.max(0,1-(this.t-this.b)/.3),R=this.R*grow*(1+.15*bk*(this.bi+1))*(this.burst!=null?1+(this.t-this.burst)*4:1),a=this.burst!=null?Math.max(0,1-(this.t-this.burst)/.2):1,[x,y]=P(this.x,this.y,this.z),p=PRS;if(R<2||a<=0)return;
    ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation='lighter';const h=ctx.createRadialGradient(x,y,R*.5,x,y,R*1.8);h.addColorStop(0,rgba(p[2],.45));h.addColorStop(1,rgba(p[2],0));ctx.fillStyle=h;ctx.beginPath();ctx.arc(x,y,R*1.8,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
    const g=ctx.createRadialGradient(x-R*.25,y-R*.3,R*.1,x,y,R);g.addColorStop(0,'rgba(232,253,255,.12)');g.addColorStop(.55,rgba(p[2],.16));g.addColorStop(.88,rgba(p[1],.5));g.addColorStop(1,rgba(p[0],.65));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();
    const core=Math.min(1,this.t/1.2),hs=R*1.05*(1+.28*bk);if(bk>0){ctx.globalCompositeOperation='lighter';const hg=ctx.createRadialGradient(x,y,0,x,y,R*.9);hg.addColorStop(0,`rgba(255,190,230,${.55*bk*a})`);hg.addColorStop(1,'rgba(255,190,230,0)');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(x,y,R*.9,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
    art('heart',x,y+R*.04,hs,{a:a*(.7+.3*core),under:'#06203f',ua:.4,ux:0,uy:3});
    ctx.save();ctx.beginPath();ctx.arc(x,y,R*.97,0,TAU);ctx.clip();ctx.strokeStyle='#ffffff';ctx.lineCap='round';for(let i=0;i<2;i++){const ph=this.t*(1.6+i*.7)+i*2;ctx.globalAlpha=a*.45;ctx.lineWidth=2.2-i*.6;ctx.beginPath();ctx.ellipse(x,y+R*.1,R*.85,R*.3,Math.sin(ph)*.4,ph,ph+1.8);ctx.stroke();}ctx.restore();
    ctx.globalAlpha=a;ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,R*.07);ctx.lineCap='round';ctx.beginPath();ctx.arc(x,y,R*.84,Math.PI*1.08,Math.PI*1.5);ctx.stroke();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(x-R*.38,y-R*.52,R*.12,R*.07,-.6,0,TAU);ctx.fill();
    if(bk>0){ctx.globalAlpha=a*bk;ctx.strokeStyle=p[3];ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,R*(1+.25*(1-bk)),0,TAU);ctx.stroke();}ctx.restore();}});
function inflowTo(x,y,z){const an=R_(0,TAU),r=R_(110,150),L=.4;sprite({layer:'top',x,y,life:L,fi:.03,fo:.06,paint:f=>{const k=eI(cl(f.t/L,0,1)),px=x+Math.cos(an)*r*(1-k),py=y+Math.sin(an)*r*.6*(1-k),pz=lerp(10,z,k),[X,Y]=P(px,py,pz),[X2,Y2]=P(x,y,z);art('dropP',X,Y,7,{rot:Math.atan2(Y2-Y,X2-X)-Math.PI/2,under:'#06203f',ua:.3});}});}
/* the dark water under the great orb: a pool that grows with it, rings drawn in by the pull, a light that throbs with each beat */
class WHeartFloor{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}update(dt){this.t+=dt;return fx.includes(this.src);}
  draw(){const s=this.src,grow=eO(Math.min(1,s.t/1)),bk=Math.max(0,1-(s.t-s.b)/.3),a=s.burst!=null?Math.max(0,1-(s.t-s.burst)/.4):Math.min(1,s.t/.3),R=150*grow,[x,y]=P(s.x,s.y),p=PRS;if(R<2)return;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,rgba(p[0],.55));g.addColorStop(.6,rgba(p[1],.3));g.addColorStop(1,rgba(p[1],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.strokeStyle='#dff6ff';ctx.lineCap='round';for(let i=0;i<3;i++){const u=((s.t*.55+i/3)%1),rr=R*(1-u)*.95;ctx.globalAlpha=a*.5*Math.sin(Math.PI*u);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,rr,s.t*.6+i,s.t*.6+i+4.2);ctx.stroke();}
    if(bk>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*bk*.7;const l=ctx.createRadialGradient(0,0,0,0,0,R*.8);l.addColorStop(0,rgba(p[3],.8));l.addColorStop(1,rgba(p[2],0));ctx.fillStyle=l;ctx.beginPath();ctx.arc(0,0,R*.8,0,TAU);ctx.fill();}ctx.restore();}}
/* Pressure Harmony's mist: low water haze over the circle, a few glints */
patch(HarmonyMist,{update(dt){const r=this._update0(dt);this._a=(this._a||0)+dt;if(r&&this._a>.25&&this.t<this.life-.8){this._a=0;const an=R_(0,TAU),d=this.R*Math.sqrt(Math.random());mist(this.x+Math.cos(an)*d,this.y+Math.sin(an)*d*.8,2,1,{layer:'ground',size:70,spd:12,rise:4,life:1.6,a:.35});}return r;},
  draw(){const a=Math.min(1,this.t/.3)*(this.t>this.life-.8?Math.max(0,(this.life-this.t)/.8):1),[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,`rgba(170,240,255,${.04*a})`);g.addColorStop(1,`rgba(170,240,255,${.16*a})`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.strokeStyle='#ffffff';ctx.lineCap='round';for(let i=0;i<4;i++){const s=this.t*.4+i*TAU/4;ctx.globalAlpha=.35*a;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,this.R,s,s+1.1);ctx.stroke();}ctx.restore();}});
/* Aqua Blink: she is a puddle that runs over the ground */
patch(PuddleRun,{update(dt){const r=this._update0(dt);if(r&&Math.random()<.6){const k=Math.min(1,Math.max(0,(this.t-.02)/.3)),x=lerp(this.ax,this.bx,eInOut(k)),y=lerp(this.ay,this.by,eInOut(k));drops(x,y,2,1,{spd:60,up0:40,up1:100,s:.8});}return r;},
  draw(){const k=Math.min(1,Math.max(0,(this.t-.02)/.3)),x=lerp(this.ax,this.bx,eInOut(k)),y=lerp(this.ay,this.by,eInOut(k)),[px,py]=P(x,y),[ax,ay]=P(this.ax,this.ay),wob=Math.sin(this.t*30);
    ctx.save();ctx.lineCap='round';ctx.globalAlpha=.28;ctx.strokeStyle=WAT[0];ctx.lineWidth=20;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=.4;ctx.strokeStyle=WAT[2];ctx.lineWidth=8;ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(px,py);ctx.scale(1+.08*wob,1-.08*wob);const g=ctx.createRadialGradient(-6,-3,2,0,0,26);g.addColorStop(0,'rgba(232,253,255,.95)');g.addColorStop(.5,rgba(WAT[2],.85));g.addColorStop(1,rgba(WAT[1],.85));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,26,10,0,0,TAU);ctx.fill();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(-4,-2,16,5,0,Math.PI*1.1,Math.PI*1.7);ctx.stroke();ctx.restore();}});
/* Emergency Float: a ring of water with gold jade bands under her feet, bubbles rising round her */
patch(FloatBubble,{update(dt){if(!newest(this,'float'))return false;const r=this._update0(dt);this._a=(this._a||0)+dt;if(r&&this._a>.3){this._a=0;bubbles(player.x,player.y,4,1,{r:26,h:6,up:.8});}return r;},
  draw(){const [x,y]=P(player.x,player.y,0),a=Math.min(1,this.t/.2),b=1+.05*Math.sin(this.t*3);art('buoy',x,y-2,70*b,{flat:1,rot:this.t*.25,a:a*.95,under:'#052c3c',ua:.25});}});
/* Second Spring: the gills glow pink (three fronds a side, swaying) */
patch(GillGlow,{update(dt){if(!newest(this,'gill'))return false;return this._update0(dt);},
  draw(){const s=player.socket;if(!s)return;const [hx,hy]=s.head;for(const side of [-1,1])for(let i=0;i<3;i++){const rot=side*(.55+i*.42)+Math.sin(this.t*3+i)*.08*side,x=hx+side*(9+i*2.5),y=hy+2+i*4;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45+.2*Math.sin(this.t*4+i);const g=ctx.createRadialGradient(x,y-8,0,x,y-8,14);g.addColorStop(0,'rgba(255,170,220,.8)');g.addColorStop(1,'rgba(255,170,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y-8,14,0,TAU);ctx.fill();ctx.restore();
    art('gill',x,y,10,{rot,ay:.96,a:.95});}}});
/* the cast sigil (cast bar): the tide sigil lies on the ground, turning; drops rise from its gems */
patch(TideCircle,{update(dt){const r=this._update0(dt);this._a=(this._a||0)+dt;if(r&&this._a>.12&&!this.killed){this._a=0;const an=R_(0,TAU);bubbles(this.x+Math.cos(an)*this.r*.9,this.y+Math.sin(an)*this.r*.9*.8,2,1,{r:2,h:4,up:1.2,s:.9});}return r;},
  draw(){const t=this.t,a=Math.min(1,t/this.fadeIn)*Math.min(1,Math.max(0,(this.life-t)/this.fadeOut)),[x,y]=P(this.x,this.y,this.z||0);if(a<=.01)return;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);const ik=ctx.createRadialGradient(0,0,this.r*.5,0,0,this.r*1.18);ik.addColorStop(0,'rgba(5,44,60,0)');ik.addColorStop(.75,`rgba(5,44,60,${.3*a})`);ik.addColorStop(1,'rgba(5,44,60,0)');ctx.fillStyle=ik;ctx.beginPath();ctx.arc(0,0,this.r*1.18,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,this.r*.4,0,0,this.r*1.25);g.addColorStop(0,'rgba(63,224,200,0)');g.addColorStop(.8,`rgba(63,224,200,${.25*a})`);g.addColorStop(1,'rgba(63,224,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.r*1.25,0,TAU);ctx.fill();ctx.restore();
    art('sigil',x,y,this.r*2.25*(.85+.15*eO(Math.min(1,t/.25))),{flat:1,rot:t*this.spin*.5,a:a*.95});}});
/* the cocoon of Second Spring: a clear egg of water, her body curled inside, pink life throbbing */
patch(Cocoon,{draw(){const c=AX.cocoon,[x,y]=P(player.x,player.y,34),open=this.endT!=null?(this.t-this.endT)/.5:0,a=1-open;if(a<=0)return;const e=playerFrame();
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(Math.sin(this.t*2)*.08);ctx.scale(.55,.55);ctx.translate(-x,-y+20);drawFrame(e,x,y+30,.85,null,tinted(e,'#ffd0ec'));ctx.restore();
    const pulse=1+.05*Math.sin(this.t*7);art('cocoon',x,y+16,100*(1+open*.4)*pulse,{a,ay:.62,under:'#052c3c',ua:.2});
    if(c){const bw=56,k=c.hp/c.max,tk=1-c.t/AX_BAL.cocoonTime,yy=y-62;ctx.fillStyle='rgba(10,30,50,.75)';ctx.fillRect(x-bw/2-1,yy-1,bw+2,6);ctx.fillStyle='#7fe6ff';ctx.fillRect(x-bw/2,yy,bw*k,4);ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(x-bw/2,yy+5,bw*tk,1.5);}}});
/* Living Water: the drops that circle her waist are glossy drops; a new one pops in, spent ones fly into her chest */
if(typeof AxOverlay==='function'){patch(AxOverlay,{update(dt){const r=this._update0(dt),n=AX.drops,prev=this._pn==null?n:this._pn;this._pn=n;
    if(n<prev)for(let i=n;i<prev;i++){const an=this.t*1.6+i/3*TAU,sx=player.x+Math.cos(an)*26,sy=player.y+Math.sin(an)*12,sz=44*CHAR_SCALE;addFx(new AxDropFly({sx,sy,sz,tx:player.x,ty:player.y,tz:40*CHAR_SCALE,r:3,arc:10,life:.22}));}
    if(n>prev){const an=this.t*1.6+(n-1)/3*TAU;ring({x:player.x+Math.cos(an)*26,y:player.y+Math.sin(an)*12,r0:2,r1:14,w:2,pal:WAT,life:.3,segs:3,gap:.3});}return r;},
  draw(){const n=AX.drops;for(let i=0;i<n;i++){const an=this.t*1.6+i/3*TAU,[x,y]=P(player.x+Math.cos(an)*26,player.y+Math.sin(an)*12,44*CHAR_SCALE+Math.sin(this.t*3+i)*3),pop=this.pop>0&&i===n-1?1+this.pop*1.6:1;
      art('drop',x,y,8.5*pop,{a:Math.sin(an)<0?.55:1,under:'#052c3c',ua:.3});}}});}

/* ---------------------------------------------------------------------
   4. SKILL EXTRAS (added to the actions at their real moments)
   --------------------------------------------------------------------- */
const wrapMk=(k,fn)=>{const sk=SKILLS[k];if(!sk||!sk.make)return;const mk=sk.make;sk.make=function(c){const a=mk(c);if(a)try{fn(a,c);}catch(e){console.warn('axv',k,e);}return a;};};
/* the tide sigil under her for a while (channels, the ultimate) */
class WSigil{constructor(o){Object.assign(this,{t:0,layer:'ground',R:70,life:2,pal:MNT,a:.85},o);}update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.life;}
  draw(){const a=this.a*Math.min(1,this.t/.25)*Math.min(1,Math.max(0,(this.life-this.t)/.4)),[x,y]=P(this.x,this.y);if(a<=.01)return;ctx.save();ctx.translate(x,y);ctx.scale(1,K);const ik=ctx.createRadialGradient(0,0,this.R*.5,0,0,this.R*1.15);ik.addColorStop(0,'rgba(5,44,60,0)');ik.addColorStop(.75,`rgba(5,44,60,${.28*a})`);ik.addColorStop(1,'rgba(5,44,60,0)');ctx.fillStyle=ik;ctx.beginPath();ctx.arc(0,0,this.R*1.15,0,TAU);ctx.fill();ctx.restore();art('sigil',x,y,this.R*2.2*(.85+.15*eO(Math.min(1,this.t/.3))),{flat:1,rot:this.t*.4,a});}}
/* Slipstream: she rides a small wave; splash where she sets off and where she stops */
wrapMk('axSlip',a=>{const T=rt(a.dur),phi=player.phi;a.events.push({t:0,f:()=>{crown({x:player.x,y:player.y,w:46,life:.36});
    sprite({n:'wave',layer:'sorted',follow:player,ox:-Math.cos(phi)*6,oy:-Math.sin(phi)*6-1,ay:.94,w:64,life:T,fi:.06,fo:.18,sx:Math.cos(phi)<0?-1:1,s0:.6,s1:1,pop:.1,a:.9});}},
  {t:a.dur*.92,f:()=>{crown({x:player.x,y:player.y,w:40,life:.34});drops(player.x,player.y,6,8,{spd:130,dir:phi,spread:1,up0:60,up1:170});}});});
/* Gentle Rinse: a ring of water closes round her feet as it washes her */
wrapMk('axRinse',a=>{a.events.push({t:a.windup,f:()=>{ring({x:player.x,y:player.y,follow:1,r0:50,r1:16,w:4,pal:WAT,life:.4,ease:eI,segs:4,gap:.3});pool({x:player.x,y:player.y,R:30,pal:WAT,life:1.1});}});});
/* Purifying Rinse: clear water pours over her from above; dark drops of what ailed her fall away */
wrapMk('asPurify',a=>{a.events.push({t:a.windup,f:()=>{addFx(new WPour({life:.6}));pool({x:player.x,y:player.y,R:34,pal:WAT,life:1.2});
  for(let i=0;i<6;i++)axSpray.push({x:player.x+R_(-14,14),y:player.y+R_(-4,4),z:R_(30,70)*CHAR_SCALE,vx:R_(-60,60),vy:R_(-20,20),vz:R_(20,90),r:R_(2,3),life:.8,t:-R_(.15,.4),rip:true,k:'',a:1,dirty:1});}});});
class WPour{constructor(o){Object.assign(this,{t:0,layer:'top',life:.6},o);this.ph=R_(0,9);}
  update(dt){this.t+=dt;if(this.t>.08&&this.t<this.life-.18&&Math.random()<.8)drops(player.x+R_(-14,14),player.y+R_(-3,3),R_(50,70)*CHAR_SCALE,1,{spd:110,up0:20,up1:80,s:.85});if(this.t>=.16&&!this._c){this._c=1;crown({x:player.x,y:player.y,w:54,life:.4});}return this.t<this.life;}
  draw(){const k=this.t/this.life,a=Math.min(1,this.t/.06)*(k>.72?(1-k)/.28:1),zTop=118*CHAR_SCALE,[sx,sy]=P(player.x,player.y,zTop),fall=eO(Math.min(1,this.t/.16)),dry=k>.5?(k-.5)/.5:0;if(a<=.01)return;
    ctx.save();ctx.globalAlpha=a;const sp=[];for(let j=0;j<=24;j++){const an=j/24*TAU+this.t*9;sp.push([sx+Math.cos(an)*15,sy+Math.sin(an)*5]);}band(sp,sp.map((_,j)=>2.4+1.4*Math.sin(j*.8+this.t*10)),[[1.6,WAT[0],.25],[1,WAT[2],.85],[.45,'#ffffff',.9]]);
    orb(sx,sy,4,WAT,a);
    for(let i=0;i<3;i++){const ox=(i-1)*8,pts=[],ws=[];for(let j=0;j<=14;j++){const u=j/14;if(u>fall+.001)break;if(u<dry)continue;pts.push(P(player.x+ox+Math.sin(u*8+this.t*22+i*2)*2.2,player.y+1,zTop*(1-u)+3));ws.push(1.8+1.6*u);}
      if(pts.length>1)band(pts,ws,[[1.7,WAT[0],.18],[1,WAT[2],.72],[.42,'#ffffff',.9]]);}
    ctx.restore();}}
/* Mending Stream: the tide sigil glows under her for the whole channel (she may walk with Restorative Current: it follows) */
wrapMk('asMending',a=>{if(a.seq&&!LV.acRestore)a.events.push({t:0,f:()=>addFx(new WSigil({follow:1,R:56,life:rt(a.dur),pal:MNT}))});else a.events.push({t:a.windup,f:()=>addFx(new WSigil({follow:1,R:56,life:2.5,pal:MNT}))});});
/* Spring Renewal: a mint wave rolls out over the ground, lotus petals lift off it */
wrapMk('asRenewal',a=>{a.events.push({t:a.windup,f:()=>{wave({x:player.x,y:player.y,R:115,life:.7,pal:MNT,w:16});wave({x:player.x,y:player.y,R:75,life:.55,pal:MNT,w:10,delay:.1});petals(player.x,player.y,20,8,{spd:110,up:50});}});});
/* Regen Mist / Liquid Cushion / Emergency Float / Second Spring: a small burst on the cast, the buff piece does the rest */
wrapMk('asMist',a=>{a.events.push({t:a.windup,f:()=>{mist(player.x,player.y,4,8,{layer:'ground',tint:MT.M,size:60,ring:20,spd:50,life:1.1,a:.5});petals(player.x,player.y,30,3,{spd:60,up:40,im:'leaf0'});}});});
wrapMk('asFloat',a=>{a.events.push({t:a.windup,f:()=>{crown({x:player.x,y:player.y,w:70,life:.4});bubbles(player.x,player.y,4,8,{r:24,h:10});}});});
wrapMk('acSpring',a=>{a.events.push({t:a.windup,f:()=>{whirlPetals(player.x,player.y,12,{r0:16,r1:40,z0:10,z1:80,hold:.6,va:6,out:16});const s=sys('top');G.flare(s,player.x,player.y,70*CHAR_SCALE,60,'#ffb3dc',.3);}});});
/* Miracle of Life: the tide sigil blooms under her; the heal lands as a burst of mint light */
wrapMk('asMiracle',a=>{const h=a.events.find(e=>e.t>a.windup+1&&e.t<a.windup+1.3);a.events.push({t:(h?h.t:a.windup+1.15),f:()=>{const S=sys('top');G.flare(S,player.x,player.y,60*CHAR_SCALE,120,MNT[2],.35);ring({x:player.x,y:player.y,r0:20,r1:130,w:8,pal:MNT,life:.6,segs:5,gap:.25});}});});
/* Aqua Blink: she splashes down into a puddle, runs, and rises out of a column of water */
wrapMk('acBlink',a=>{const ev=a.events;ev.push({t:.1,f:()=>{crown({x:player.x,y:player.y,w:62,life:.4});pool({x:player.x,y:player.y,R:34,life:1});}},{t:.4,f:()=>{geyser({x:player.x,y:player.y,H:62,W:30,pal:WAT,life:.32,flare:.35,back:1});crown({x:player.x,y:player.y,w:66,life:.4});bubbles(player.x,player.y,10,6,{r:16,h:30});}});});
/* Hydro Cannon: the kick of the beam pushes water out behind her */
wrapMk('axCannon',a=>{a.events.push({t:a.windup,f:()=>{const b=player.phi+Math.PI;mist(player.x,player.y,10,5,{tint:MT.P,dir:b,spread:.7,spd:90,size:56,life:.7});pool({x:player.x-Math.cos(player.phi)*10,y:player.y-Math.sin(player.phi)*10,R:40,pal:PRS,life:1.2});}});});

/* ---------------------------------------------------------------------
   5. WATCHER — Regen Mist's haze while the buff lasts (calm on purpose: a buff must not hide the hero)
   --------------------------------------------------------------------- */
class AxWatch{constructor(){this.layer='none';this.a=0;this.b=0;}
  update(dt){if(CHAR!=='axolotl')return false;this.a+=dt;this.b+=dt;
    if(hasBuff('asMist')&&this.a>.28){this.a=0;const an=R_(0,TAU),r=R_(14,42);mist(player.x+Math.cos(an)*r,player.y+Math.sin(an)*r*.7,2,1,{layer:'ground',tint:MT.M,size:56,spd:10,rise:6,life:1.4,a:.5});
      if(Math.random()<.25)petals(player.x+Math.cos(an)*r,player.y+Math.sin(an)*r*.7,4,1,{spd:12,up:60,term:.6,im:Math.random()<.5?'leaf0':'leaf1'});}
    if(hasBuff('asMist')&&this.b>.9){this.b=0;ring({x:player.x,y:player.y,follow:1,r0:20,r1:46,w:2,pal:MNT,life:.8,segs:3,gap:.4});}
    return true;}draw(){}}
let WATCH=null;function ensureWatch(){if(!WATCH||!fx.includes(WATCH))WATCH=addFx(new AxWatch());}
ensureWatch();ensure();
AXV.drops=drops;AXV.crown=crown;AXV.wave=wave;AXV.geyser=geyser;
})();
