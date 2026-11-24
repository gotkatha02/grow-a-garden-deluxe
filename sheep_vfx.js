/* =====================================================================
   GOLDEN FLEECE SHEEP "Chrysie" — skill effects v3: SVG art (sheep_art.js) + code VFX.
   Owner 2026-11-21: "ทำของแกะขนทองให้หน่อย" — the same brief as the croc / cat / kitsune: every skill drawn with SVG + code VFX,
   matching its concept AND what it really does (Golden Wool layers, shearing, heals over time, shields, Enchant 0–3 → Spellbound,
   sleep, hex, charm, the fate links, the sanctuary, the rain, the orbs, the fleece…), in step with the frame its damage lands.

   TIMING (read before changing anything)
   · The action clock runs at ACTION_TEMPO (.75): an action time becomes real seconds with rt() before an effect uses it.
   · Bolts (Light Ball, Golden Thread, Golden Ram, wool orbs, the fleece's bolts, prism shards) are DRAWN by the game's own SBolt
     (subclassed here, update untouched): the picture is where the collision is, so it touches the target on the hit frame.
   · Instant skills fire their picture from an extra event pushed at the same action time as the skill's own event (runs right
     after it). A crook bonk is told how long it is until the contact frame (`lead`). Medea's Cauldron lands at the same .35 s
     as its damage timer. Hit sparks come from the damage itself (sHit is wrapped), never from a separate timer.

   HOW IT HOOKS IN (gameplay is never touched): SBolt is subclassed (draw + trail only), SBeam / SPillar are rebound to build the
   new pieces, SGround / STop get new draw()s (they keep their update), sHit / sEnc / sShear / sOlympusEnd / sColchisEnd /
   sCloudEnd are wrapped (original first), sSparks / sFluff / sHealFx / sPow are replaced (they only drew), every skill's make()
   gets a wrapper that adds picture events, SCore.tick is wrapped to watch state changes (sanctuary columns, rain, dragon…).
   Old look off while the sheep's own code runs: GRing / Impact / SImg / round emits; HitCrescents / PuffDust / the weapon
   Trail always (the placeholder sprite's socket is not where the crook is). ?vfx3=0 = the old look.

   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black "ink" shape behind;
   debris is shaped (wool tufts, laurel leaves, feathers, notes, glass shards, brew bubbles), never round dots.
   Families: Basic (Arcadian Lamb) = golden wool + soft sunlight · A (Asclepian Healer) = holy gold, healing jade-green, marble,
           Apollo's sun, Athena's Aegis, Hermes' wings, the Rod of Asclepius, Olympus laurel
           · B (Medea's Enchanter) = magenta enchantment, violet curses, golden thread, dream lavender, the Colchian dragon,
             sirens, the bronze cauldron, the Golden Fleece · C = its column (sun chariot, wool orbs, woolly cloud, charm, sirens).
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='sheep'||!window.K3||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {V,TAU,cl,eO,eI,eIO,back,lerp,R_,rt,rgba,tint,art,sprite,star,KGlint,KBurst,KRing,ring,KStreak,KArc,petals,embers,dust,ensure}=window.K3;
const {sys,tx,G}=V,AR=window.KTA;
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75;
/* palettes: [ink, deep, mid, lite, core] */
const PAL={gold:['#3a2206','#c07a1a','#ffc84a','#fff0b8','#ffffff'],sun:['#3a1404','#d0601a','#ffa62e','#ffe08a','#fffbe8'],holy:['#2e2610','#c8a040','#ffe58a','#fffbe0','#ffffff'],
  heal:['#06301c','#1f9a5a','#5ae08e','#c8ffd8','#ffffff'],pink:['#3a0a2a','#c8288a','#ff6ac8','#ffc4ec','#ffffff'],violet:['#1c0a36','#6a2ab8','#b07aff','#e4ccff','#ffffff'],
  dream:['#141e3c','#5a6ab8','#a8b8f0','#e4ecff','#ffffff'],brew:['#0e2a12','#2a9a3a','#7aff6a','#d8ffc8','#ffffff'],wool:['#3a2a14','#c8a060','#f3dfae','#fffaf0','#ffffff'],
  grey:['#1c1c22','#6a6a78','#c8c8d4','#f0f0f6','#ffffff']};
const SV=window.SHV={on:1,PAL};
const NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},active:false});
const zOf=e=>(e&&e.boss?40:26);
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const later=(s,f)=>setFxTimer(s,f);                                  /* game clock: pauses with hit-stop */
const at=(a,t,f)=>{a.events.push({t:Math.max(0,t),f});};            /* an extra event on the action clock (runs after the skill's own at the same time) */
const before=(a,real)=>Math.max(0,a.windup-real*TEMPO());           /* the action time `real` seconds before the peak */
const SC={};function S1(l='top'){let s=SC[l];if(!s||!s.p||!fx.includes(s)){s=SC[l]=sys(l,.25);}return s;}   /* one shared particle system per layer */
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__SHTICK||window.__SHSELF);
const self=f=>{const o=window.__SHSELF;window.__SHSELF=1;try{return f();}finally{window.__SHSELF=o;}};

/* where her staff's orb is: the sprite's own socket of the frame on screen (assets_sheep.js = the owner's clips 2026-11-24,
   tools/cliphero.py found the orb in every frame of every state), blended into the next frame while an action plays;
   CROOK = the old placeholder's crook hook (cell 306,204 around ITS pivot 248,405) when a frame has no socket */
const CROOK=[306,204];
function orbCell(){try{const a=player.action;
    if(a&&a.seq&&typeof seqAt==='function'){const r=seqAt(a.seq,a.t),e=r.e,s0=sockAt(e.st,e.d,e.f);if(s0&&s0.head){
      const n=a.seq[r.i+1],s1=(n&&n.st===e.st&&n.d===e.d&&n.f===e.f+1)?sockAt(n.st,n.d,n.f):null,k=s1&&s1.head?r.k:0;
      return [s0.head[0]+(k?(s1.head[0]-s0.head[0])*k:0),s0.head[1]+(k?(s1.head[1]-s0.head[1])*k:0)];}}
    const fr=playerFrame(),q=fr&&sockAt(fr.st,fr.d,fr.f);if(q&&q.head)return q.head;}catch(_){}
  const pv=SPR_META.pivot;return [pv.x+CROOK[0]-248,pv.y-(405-CROOK[1])];}
function crook(){const sc=SPR*(typeof CHAR_SCALE==='number'?CHAR_SCALE:1),pv=SPR_META.pivot,mir=typeof isMir==='function'&&isMir(player.dir),h=orbCell();
  return [player.x+(h[0]-pv.x)*sc*(mir?-1:1),player.y+.5,(player.z||0)+(pv.y-h[1])*sc];}
/* the top edge of the orb (lights born at the staff sit here so the hero cut-out of the effect layer does not hide them) */
function tip(){const c=crook(),mir=typeof isMir==='function'&&isMir(player.dir);return [c[0]+(mir?-2:2),c[1],c[2]+6];}
/* top of her head: the front idle pose's top edge (+6 cell px, as on the placeholder) */
const headZ=()=>{let hy=182;try{hy=SPR_META.states.idle.dirs.S.f[0][5]+6;}catch(_){}return (SPR_META.pivot.y-hy)*SPR*(typeof CHAR_SCALE==='number'?CHAR_SCALE:1)+(player.z||0);};

/* ---------------------------------------------------------------------
   1. SMALL PIECES
   --------------------------------------------------------------------- */
/* a glowing light orb (screen point): ink halo, additive glow, white core, turning 4-point star */
function orb(sx,sy,R,pal,t,a=1){if(R<.5||a<=0)return;ctx.save();ctx.globalAlpha=a*.28;ctx.drawImage(tx('glow',pal[0]),sx-R*2.2,sy-R*2.2,R*4.4,R*4.4);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.6;ctx.drawImage(tx('glow',pal[2]),sx-R*2.8,sy-R*2.8,R*5.6,R*5.6);ctx.globalAlpha=a;ctx.drawImage(tx('core',pal[3]),sx-R*1.25,sy-R*1.25,R*2.5,R*2.5);ctx.restore();
  ctx.save();ctx.globalAlpha=a;star(sx,sy,R*.95*(1+.12*Math.sin(t*28)),pal[2],t*1.6);ctx.restore();}
const glowAt0=(x,y,h,col='#5ae08e',life=1.2)=>sprite({layer:'top',x,y,z:h*.5,life,fi:.1,fo:.5,paint:(f,sx,sy,s,a)=>glowAt(sx,sy,h*.7,h*1.3,col,.4*a)});   /* a soft upright glow (world point, height h) */
const glowAt=(sx,sy,w,h,col,a)=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.drawImage(tx('glow',col),sx-w/2,sy-h/2,w,h);ctx.restore();};
/* a floating picture: notes, Zs, hearts, runes, feathers… (sways, pops in, fades) */
class Flo{constructor(o){Object.assign(this,{t:0,layer:'top',x:0,y:0,z:0,vx:0,vy:0,vz:30,dr:0,g:0,sw:5,fq:4,ph:R_(0,TAU),life:1,w:16,rot:0,spin:0,fi:.08,fo:.4,s0:.4,s1:1,pop:.2,a:1,delay:0,add:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.t<0)return true;const d=Math.exp(-this.dr*dt);this.vx*=d;this.vy*=d;this.vz=this.vz*d-this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;if(this.tick)this.tick(this,dt);return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1);if(a<.01)return;const s=this.s0+(this.s1-this.s0)*back(cl(t/this.pop,0,1)),sw=Math.sin(t*this.fq+this.ph),[x,y]=P(this.x,this.y,this.z);
    ctx.save();if(this.add)ctx.globalCompositeOperation='lighter';if(this.glow)glowAt(x+sw*this.sw,y,this.w*2.4*s,this.w*2.4*s,this.glow,.5*a);art(this.n,x+sw*this.sw,y,this.w*s,{a,rot:this.rot+this.spin*t+sw*.18,under:this.under,ua:this.ua});ctx.restore();}}
const flo=o=>addFx(new Flo(o));
/* a picture lying flat on the ground (sigils, rings, prints): turns, pulses, fades; until() ends it */
class Flat{constructor(o){Object.assign(this,{t:0,layer:'ground',n:'meander',x:0,y:0,z:0,w:200,life:1,fi:.15,fo:.4,rot:0,spin:.4,s0:1,s1:1,a:1,pulse:0,add:0,delay:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&!this._e&&!this.until()){this._e=1;this.life=Math.min(this.life,Math.max(0,this.t)+this.fo);}return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,k=cl(t/this.life,0,1),a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1)*(1+this.pulse*Math.sin(t*6));if(a<=.01)return;const s=this.s0+(this.s1-this.s0)*eO(k),[x,y]=P(this.x,this.y,this.z);
    ctx.save();if(this.add)ctx.globalCompositeOperation='lighter';art(this.n,x,y,this.w*s,{flat:1,rot:this.rot+this.spin*t,a:cl(a,0,1)});ctx.restore();}}
const flat=o=>addFx(new Flat(o));
/* a per-frame function with a life (spawners) */
class Fn{constructor(life,f){this.t=0;this.life=life;this.f=f;this.layer='none';}update(dt){this.t+=dt;try{this.f(this,dt);}catch(_){return false;}return this.t<this.life;}draw(){}}
const every=(life,f)=>addFx(new Fn(life,f));
/* light that flies from a point to the hero (a heal coming home) */
class Mote{constructor(o){Object.assign(this,{t:0,layer:'top',life:.42,pal:PAL.heal,s:9,arc:34,z:30},o);this.sd=R_(-1,1);}
  update(dt){this.t+=dt;if(this.t>=this.life){G.flare(S1(),player.x,player.y,36,24,this.pal[2],.18);return false;}return true;}
  draw(){const k=eIO(cl(this.t/this.life,0,1)),x=lerp(this.x,player.x,k)+Math.sin(Math.PI*k)*this.arc*this.sd,y=lerp(this.y,player.y,k),z=lerp(this.z,38,k)+Math.sin(Math.PI*k)*this.arc*.7,[sx,sy]=P(x,y,z),s=this.s*(1-.3*k);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(tx('core',this.pal[2]),sx-s,sy-s,s*2,s*2);ctx.drawImage(tx('star',this.pal[3]),sx-s*1.5,sy-s*1.5,s*3,s*3);ctx.restore();}}
const homeMotes=(x,y,z,n,pal=PAL.heal)=>{for(let i=0;i<n;i++)addFx(new Mote({x,y,z,pal,life:R_(.34,.5)}));};
/* light gathering into a point (charge-ups): motes spiral in, an orb grows, a thin ring closes */
class Gather{constructor(o){Object.assign(this,{t:0,layer:'top',life:.8,R0:2,R1:12,pal:PAL.gold,n:16,src:tip,rad:46,orb:1,ring:1,img:'star'},o);this.m=[];this.acc=0;}
  update(dt){this.t+=dt;const k=cl(this.t/this.life,0,1);this.p=this.src();this.acc+=dt*this.n*(.6+k);while(this.acc>=1){this.acc-=1;if(this.m.length<40)this.m.push({a:R_(0,TAU),r:this.rad*R_(.7,1.15),z:R_(-14,18),t:0,life:R_(.26,.4),s:R_(5,10)});}
    for(const q of this.m)q.t+=dt;this.m=this.m.filter(q=>q.t<q.life);return this.t<this.life;}
  draw(){const p=this.p||this.src();if(!p)return;const k=cl(this.t/this.life,0,1),[sx,sy]=P(p[0],p[1],p[2]),pal=this.pal;ctx.save();ctx.globalCompositeOperation='lighter';
    for(const q of this.m){const u=q.t/q.life,r=q.r*(1-eI(u)),x=sx+Math.cos(q.a+u*1.4)*r,y=sy+Math.sin(q.a+u*1.4)*r*.62-q.z*(1-u),s=q.s*(1-u*.5);ctx.globalAlpha=Math.sin(Math.PI*u);ctx.drawImage(tx(this.img,pal[2]),x-s/2,y-s/2,s,s);}
    ctx.restore();if(this.orb)orb(sx,sy,this.R0+(this.R1-this.R0)*eO(k),pal,this.t,cl(this.t/.08,0,1));
    if(this.ring){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba(pal[3],.6*k);ctx.lineWidth=1.6;const rr=6+22*(1-k);ctx.beginPath();ctx.ellipse(sx,sy,rr*1.25,rr*.8,this.t*2,0,TAU);ctx.stroke();ctx.restore();}}}
const gather=o=>addFx(new Gather(o));
/* the sunbeam: wide at the sun, a white-hot core, light running along it */
class Beam{constructor(o){Object.assign(this,{t:0,layer:'top',w:30,grow:.07,hold:.14,fade:.24,pal:PAL.sun},o);this.life=this.grow+this.hold+this.fade;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,g=eO(cl(t/this.grow,0,1)),f=cl((t-this.grow-this.hold)/this.fade,0,1),p=this.pal,A=this.a,B=this.b,[x0,y0]=P(A[0],A[1],A[2]),[x1,y1]=P(lerp(A[0],B[0],g),lerp(A[1],B[1],g),lerp(A[2],B[2],g)),dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<3)return;
    const W=this.w*(1-f*.75)*(1+.06*Math.sin(t*60));ctx.save();ctx.translate(x0,y0);ctx.rotate(Math.atan2(dy,dx));
    const band=(w,c,al)=>{ctx.globalAlpha=cl(al,0,1);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-w*.5);ctx.lineTo(L,-w*.34);ctx.quadraticCurveTo(L+w*.5,0,L,w*.34);ctx.lineTo(0,w*.5);ctx.quadraticCurveTo(-w*.35,0,0,-w*.5);ctx.fill();};
    band(W*1.5,p[0],.3*(1-f));ctx.globalCompositeOperation='lighter';band(W,p[1],.75*(1-f));band(W*.66,p[2],.9*(1-f*.5));band(W*.34,p[3],1-f*.4);band(W*.12,'#ffffff',1-f*.3);
    for(let i=0;i<7;i++){const u=(t*2.6+i/7)%1,x=u*L,y=Math.sin(u*9+i*2+t*20)*W*.22,s=W*.55;ctx.globalAlpha=(1-f)*Math.sin(Math.PI*u);ctx.drawImage(tx('star',p[2]),x-s/2,y-s/2,s,s);}
    ctx.restore();}}
/* a column of light from the sky; lands in `drop` seconds, then fades */
class Pillar{constructor(o){Object.assign(this,{t:0,layer:'top',R:40,H:300,life:.75,drop:.12,pal:PAL.holy},o);}
  update(dt){this.t+=dt;if(!this._l&&this.t>=this.drop){this._l=1;if(this.land)this.land(this);}return this.t<this.life;}
  draw(){const t=this.t,d=eI(cl(t/this.drop,0,1)),f=cl((t-this.drop)/(this.life-this.drop),0,1),p=this.pal,[x,y]=P(this.x,this.y,0),top=y-this.H,bot=top+(y-top)*d,W=this.R*(t<this.drop?.6:1-f*.7);if(bot-top<2)return;
    ctx.save();const col=(w,c0,c1,al)=>{const g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,rgba(c0,0));g.addColorStop(.5,rgba(c0,al*.6));g.addColorStop(1,rgba(c1,al));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w*.32,top);ctx.lineTo(x+w*.32,top);ctx.lineTo(x+w*.5,bot);ctx.lineTo(x-w*.5,bot);ctx.closePath();ctx.fill();};
    col(W*1.4,p[0],p[0],.22*(1-f));ctx.globalCompositeOperation='lighter';col(W,p[1],p[2],.7*(1-f));col(W*.55,p[2],p[3],.9*(1-f));col(W*.2,'#ffffff','#ffffff',1-f);
    if(t>=this.drop){ctx.globalAlpha=1-f;const gs=W*2.4;ctx.drawImage(tx('glow',p[2]),x-gs,y-gs*.42,gs*2,gs*.84);}ctx.restore();}}
/* a ribbon of light spiralling up round the hero; front = the half in front of her (top layer), back half on the ground layer */
class Helix{constructor(o){Object.assign(this,{t:0,layer:'top',R:30,H:110,life:1.1,turns:2.2,w:7,pal:PAL.heal,front:1,ph:0},o);if(!this.front)this.layer='ground';}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,head=eO(cl(k/.55,0,1)),tail=cl((k-.35)/.65,0,1)*.98;if(head-tail<.02)return;const N=40,cx=player.x,cy=player.y,z0=player.z||0;
    const pt=u=>{const a=u*this.turns*TAU+this.t*2+this.ph,r=this.R*(1-u*.25);return [cx+Math.cos(a)*r,cy+Math.sin(a)*r*.9,z0+u*this.H,Math.sin(a)];};
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(let i=0;i<N;i++){const u0=tail+(head-tail)*i/N,u1=tail+(head-tail)*(i+1)/N,p0=pt(u0),p1=pt(u1);if((p0[3]>0)!==!!this.front)continue;const s0=P(p0[0],p0[1],p0[2]),s1=P(p1[0],p1[1],p1[2]),w=this.w*Math.sin(Math.PI*(i+.5)/N);
      for(const [m,c,al] of [[2,this.pal[1],.45],[1,this.pal[2],.9],[.4,this.pal[4],1]]){ctx.globalAlpha=al*(this.front?1:.55);ctx.strokeStyle=c;ctx.lineWidth=Math.max(.6,w*m);ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.lineTo(s1[0],s1[1]);ctx.stroke();}}
    ctx.restore();}}
const helix=o=>{addFx(new Helix(Object.assign({},o,{front:0})));addFx(new Helix(Object.assign({},o,{front:1})));};
/* threads wrapping round an enemy (Golden Thread hit, Spellbound): loops close in on the body */
class Loops{constructor(o){Object.assign(this,{t:0,layer:'top',life:.55,n:2,r0:46,pal:PAL.pink,gold:1},o);}
  update(dt){this.t+=dt;return this.t<this.life&&!(this.e&&this.e.dead);}
  draw(){const e=this.e,k=this.t/this.life,r=lerp(this.r0,e.r+6,eO(cl(k*2.2,0,1))),a=1-cl((k-.55)/.45,0,1),[x,y]=P(e.x,e.y,0),H=zOf(e)*1.5;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(let i=0;i<this.n;i++){const yy=y-H*(.3+.38*i/Math.max(1,this.n-1)),rot=(i%2?.22:-.22)+k*.6;for(const [w,c,al] of [[5,this.pal[1],.45],[2.4,this.gold?'#ffd36a':this.pal[3],.95],[1,'#ffffff',.9]]){ctx.globalAlpha=a*al;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(x,yy,r,r*.32,rot,0,TAU);ctx.stroke();}}
    ctx.restore();}}
/* an arc of sound in the air (Lullaby, songs): a wavy band that rolls out across a cone */
class Wave{constructor(o){Object.assign(this,{t:0,layer:'top',z:30,r0:18,r1:140,half:.75,life:.5,w:5,pal:PAL.pink,delay:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,r=this.r0+(this.r1-this.r0)*eO(k),a=1-k,N=18;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
    const path=()=>{ctx.beginPath();for(let i=0;i<=N;i++){const u=-this.half+2*this.half*i/N,q=P(this.x+Math.cos(this.phi+u)*r,this.y+Math.sin(this.phi+u)*r,this.z+Math.sin(i*1.4+this.t*24)*4);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}};
    for(const [m,c,al] of [[2.2,this.pal[1],.4],[1,this.pal[2],.85],[.35,'#ffffff',.9]]){ctx.globalAlpha=a*al;ctx.strokeStyle=c;ctx.lineWidth=this.w*m*(1-k*.5);path();ctx.stroke();}ctx.restore();}}

/* ---------------------------------------------------------------------
   2. DEBRIS — wool tufts that flutter and settle, laurel leaves, feathers, glass, brew bubbles, golden drops
   --------------------------------------------------------------------- */
function woolBits(x,y,z,n,o={}){const q=qn2(n);for(let i=0;i<q;i++){const g=o.gold==null?(i%2):o.gold;
  petals(x,y,z,1,{im:(g?'woolG':'wool')+(i%3),asp:.75,s:o.s||1.15,spd:o.spd==null?80:o.spd,up:o.up==null?90:o.up,term:o.term||.5,dk:g?'#7a4a10':'#7a6a4a',rest:R_(.3,.6),life:o.life||R_(1,1.6),dir:o.dir,spread:o.spread,vx:o.vx,vy:o.vy,delay:o.delay});}}
const leaves=(x,y,z,n,o={})=>petals(x,y,z,qn2(n),Object.assign({im:o.gold?'laurelG':'laurel',asp:2.17,s:.85,spd:70,up:120,term:.7,dk:o.gold?'#6a3a08':'#0f3a18',rest:.5},o));
const feathers=(x,y,z,n,o={})=>petals(x,y,z,qn2(n),Object.assign({im:'feather',asp:3,s:.75,spd:70,up:110,term:.45,dk:'#7a4a10',rest:.5},o));
function glass(x,y,z,n,col='#ff9ae8',o={}){const S=S1();for(let i=0;i<qn2(n);i++){const a=R_(0,TAU),v=(o.spd||190)*R_(.4,1);S.add({im:tx('shard',col,i%5),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||200)*R_(.4,1.1),g:760,dr:.7,s0:R_(7,13)*(o.s||1),s1:R_(5,9)*(o.s||1),life:R_(.55,.85),fo:.35,rot:R_(0,TAU),vr:R_(-14,14),bounce:.25});}}
function bubbles(x,y,z,n,o={}){const S=S1();for(let i=0;i<qn2(n);i++){const im=AR.get(i%3?'bubG':'bubV');if(!im)return;const a=R_(0,TAU),v=(o.spd||120)*R_(.3,1);S.add({im,x:x+R_(-6,6),y:y+R_(-4,4),z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||170)*R_(.4,1.1),g:o.g==null?520:o.g,dr:1.2,s0:R_(5,9)*(o.s||1),s1:R_(7,12)*(o.s||1),life:R_(.5,.9),fo:.3,bounce:.15});}}
/* small stars that drift (glints), additive */
function twinkles(x,y,z,n,R,col,o={}){G.glints(S1(),x,y,z,qn2(n),R,col,o.life||.7);}
const flare=(x,y,z,size,col,life=.26)=>G.flare(S1(),x,y,z,size,col,life);
const smoke=(x,y,z,n,tintS,size=50,o={})=>G.smoke(S1(o.layer||'top'),x,y,z,qn2(n),tintS,size,o.sp||40,o.life||.9,o.rise||20);
/* a gold / pink 4-point glint that sticks to an enemy */
const glint=(e,col,s=18,life=.22,oz=0)=>addFx(new KGlint({x:e.x,y:e.y,e,z:zOf(e)+oz,s,col,life}));

/* ---------------------------------------------------------------------
   3. SKILL PIECES (by family)
   --------------------------------------------------------------------- */
/* generic heal: soft column on the hero, green-gold ring, laurel leaves, rising glints */
function healFx(big){const x=player.x,y=player.y;ring({x,y,r0:12,r1:big?70:54,life:.45,w:5,pal:PAL.heal,segs:4,gap:.25});
  addFx(new Pillar({x,y,R:big?40:28,H:big?150:110,life:.6,drop:.08,pal:PAL.heal}));leaves(x,y,20,big?7:4,{up:150,spd:40,term:.4});twinkles(x,y,30,big?10:6,26,'#9aff9a',{life:.8});}
/* wool burst (sFluff): cream + gold tufts and a little dust of the ground */
function woolBurst(x,y,n){woolBits(x,y,32,Math.max(2,Math.round(n*.7)),{spd:90,up:110});if(n>=8)dust(x,y,Math.min(6,Math.round(n/3)),{ring:10,size:34,spd:60,life:.6});}
/* a strike of light from the sky (Olympus ends): pillar + floor flare + ring + embers */
function strike(x,y,R=46,pal=PAL.holy){addFx(new Pillar({x,y,R,H:340,life:.7,drop:.1,pal,land:()=>{flare(x,y,6,R*2.2,pal[2],.3);ring({x,y,r0:8,r1:R*1.5,life:.4,w:6,pal:PAL.gold,segs:4,gap:.2});embers(x,y,8,5,{spd:120,up:160,c:['#fffbe0','#ffd36a','#c07a1a']});dust(x,y,4,{ring:12,size:40,spd:70,life:.6});}}));}
/* Ionic columns rising round the sanctuary; they stay until it ends */
function sanctColumns(S){const n=6;for(let i=0;i<n;i++){const an=i*TAU/n+.26,x=S.x+Math.cos(an)*S.R,y=S.y+Math.sin(an)*S.R,dl=i*.04;
    sprite({n:'column',layer:'sorted',x,y,z:0,w:24,ay:.985,life:S.until-gameTime+.6,fi:.04,fo:.45,delay:dl,sortOff:1,until:()=>SHP.sanct===S,tick:(f)=>{f.sy2=eO(cl(f.t/.32,0,1));},under:'#4a5068',ua:.25});
    later(dl+.02,()=>{dust(x,y,3,{ring:6,size:30,spd:40,life:.6});});}
  flat({n:'meander',x:S.x,y:S.y,w:S.R*2.08,life:S.until-gameTime+.5,fi:.25,fo:.5,spin:.12,a:.78,until:()=>SHP.sanct===S});}
/* the sleeping Colchian dragon over Dragon's Sleep */
class Dragon{constructor(z){this.z=z;this.t=0;this.layer='sorted';this.x=z.x;this.y=z.y;this.acc=0;}
  get sy(){return this.y-2;}
  update(dt){this.t+=dt;const alive=(SHP.zones||[]).includes(this.z)&&this.z.until>gameTime;if(!alive&&this.end==null)this.end=this.t;if(this.end==null&&(this.acc+=dt)>.9){this.acc=0;const w=this.w();flo({n:'zzz',x:this.x-w*.32,y:this.y,z:w*.28,vz:26,vx:-10,w:11,life:1.4,sw:5,fq:3,glow:'#8a9aff'});}
    return this.end==null||this.t-this.end<.5;}
  w(){return Math.min(190,this.z.R*1.2);}
  draw(){const k=cl(this.t/.35,0,1),f=this.end==null?0:cl((this.t-this.end)/.5,0,1),a=.82*k*(1-f),[x,y]=P(this.x,this.y,0),w=this.w(),br=Math.sin(this.t*2.2);if(a<.01)return;
    glowAt(x,y-w*.2,w*1.5,w*.6,'#8a9aff',.35*a);const yy=y+2-(1-eO(k))*10,o={ay:.92,a:a*.78,sx:1+.015*br,sy:1+.035*br,under:'#1a1e4a',ua:.25};art('dragon',x,yy,w,o);   /* dreamy: a soft additive pass over it */
    ctx.save();ctx.globalCompositeOperation='lighter';art('dragon',x,yy,w,{ay:.92,a:a*.28,sx:o.sx,sy:o.sy});ctx.restore();}}
/* Medea's cauldron thrown in an arc; lands on its damage timer, then tips over and fades */
class Cauldron{constructor(o){Object.assign(this,{t:0,layer:'top',fly:.35},o);this.a=tip();}
  get sy(){return this.y;}
  update(dt){this.t+=dt;if(!this._l&&this.t>=this.fly){this._l=1;this.layer='sorted';brewSplash(this.x,this.y);}return this.t<this.fly+.9;}
  draw(){const t=this.t;if(t<this.fly){const u=t/this.fly,x=lerp(this.a[0],this.x,u),y=lerp(this.a[1],this.y,u),z=lerp(this.a[2],8,u)+Math.sin(Math.PI*u)*70,[sx,sy]=P(x,y,z);
      art('cauldron',sx,sy,30,{rot:u*5.2,under:'#1a0e04',ua:.3});glowAt(sx,sy-6,40,30,'#7aff6a',.35);return;}
    const k=t-this.fly,tip=eO(cl(k/.25,0,1))*.55,a=cl(1-(k-.5)/.4,0,1),[sx,sy]=P(this.x,this.y,0),hop=Math.max(0,Math.sin(cl(k/.22,0,1)*Math.PI))*10;
    art('cauldron',sx+tip*10,sy-hop,34,{ay:.95,rot:tip,a,under:'#1a0e04',ua:.3});}}
/* the bubbling brew left on the ground */
class Puddle{constructor(o){Object.assign(this,{t:0,layer:'ground',life:2.2,R:70},o);this.acc=0;}
  update(dt){this.t+=dt;if((this.acc+=dt)>.09&&this.t<this.life-.4){this.acc=0;const a=R_(0,TAU),r=this.R*Math.sqrt(Math.random())*.8;flo({n:Math.random()<.65?'bubG':'bubV',x:this.x+Math.cos(a)*r,y:this.y+Math.sin(a)*r*.8,z:2,vz:14,w:R_(6,11),life:R_(.4,.7),sw:1,s0:.2,s1:1,pop:.3,fo:.15});}return this.t<this.life;}
  draw(){const k=this.t/this.life,a=cl(this.t/.12,0,1)*cl((this.life-this.t)/.6,0,1),[x,y]=P(this.x,this.y,0),R=this.R*(.7+.3*eO(cl(this.t/.25,0,1)));ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,rgba('#6adf5a',.55*a));g.addColorStop(.6,rgba('#2a9a3a',.4*a));g.addColorStop(.85,rgba('#6a2ab8',.25*a));g.addColorStop(1,rgba('#6a2ab8',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35*a;ctx.drawImage(tx('glow','#7aff6a'),-R*.8,-R*.8,R*1.6,R*1.6);ctx.restore();}}
function brewSplash(x,y){const R=SB.sbCauldron.R;flare(x,y,14,110,'#7aff6a',.3);addFx(new KBurst({x,y,z:16,R:60,n:11,life:.3,pal:PAL.brew,ink:.45}));bubbles(x,y,14,14,{spd:170,up:260,s:1.1});
  ring({x,y,r0:12,r1:R+14,life:.45,w:7,pal:PAL.brew,segs:4,gap:.22});ring({x,y,r0:8,r1:R*.7,life:.4,w:4,pal:PAL.violet,segs:3,gap:.35,delay:.05});
  smoke(x,y,10,6,'#c8ffb0|#3a8a3a',60,{sp:50,life:1.1,rise:26});smoke(x,y,14,3,'#e4ccff|#5a2a8a',50,{sp:40,life:1,rise:30});addFx(new Puddle({x,y,R:R*.75}));}
/* a dream bubble round an enemy (Dream Shatter): forms during the wind-up, bursts on the hit */
class Bubble{constructor(o){Object.assign(this,{t:0,layer:'top',form:.4},o);this.ph=R_(0,TAU);}
  update(dt){this.t+=dt;return !this.popped&&!this.e.dead&&this.t<this.form+.6;}
  draw(){const e=this.e,k=eO(cl(this.t/this.form,0,1)),[x,y]=P(e.x,e.y,zOf(e)),w=(e.r*2.6+20)*(.5+.5*k)*(1+.03*Math.sin(this.t*9+this.ph));art('bubble',x,y,w,{a:.9*cl(this.t/.08,0,1),sx:1+.04*Math.sin(this.t*7),sy:1-.04*Math.sin(this.t*7)});}}
const BUB=new Map();
/* the Golden Fleece's dissolve, the spell breaking on an enemy */
function spellBreak(e){const x=e.x,y=e.y,z=zOf(e);flare(x,y,z,110,'#ff6ac8',.3);addFx(new KBurst({x,y,z,R:56,n:10,life:.3,pal:PAL.pink,ink:.5}));ring({x,y,r0:10,r1:SB.sbColchis.R+20,life:.45,w:7,pal:PAL.pink,segs:4,gap:.2});
  glass(x,y,z,8,'#ff9ae8');twinkles(x,y,z,6,30,'#ffd36a');for(let i=0;i<4;i++){const a=R_(0,TAU);addFx(new KStreak({a:[x,y],b:[x+Math.cos(a)*R_(40,70),y+Math.sin(a)*R_(30,50)],z:z+R_(-10,10),w:2.6,life:.3,pal:PAL.gold,ink:0}));}}

/* ---------------------------------------------------------------------
   4. BOLTS — the game's SBolt keeps its update (collision); the picture follows it
   --------------------------------------------------------------------- */
const SB0=SBolt;
function boltKind(b){if(b.kind==='thread')return 'thread';if(b.kind==='ram')return 'ram';if(b.z>=100)return 'colchis';if(b.col==='#fff2b8')return 'prism';if(b.R===9)return 'orb';if(b.R>=16)return 'light';return 'mini';}
SBolt=class extends SB0{get sy(){return this.y+2;}
  constructor(o){super(o);this.v=boltKind(this);this.hist=[];this.acc=0;if(this.v==='ram')this.layer='sorted';let c;
    if(this.v==='orb')c=[this.x+Math.cos(this.phi)*30,this.y+Math.sin(this.phi)*20,46];else if(this.v==='colchis')c=[player.x,player.y,(player.z||0)+108];else if(this.v==='prism')c=[this.x,this.y,30];else if(this.v==='ram')c=[this.x,this.y,0];else c=tip();this.o3=c;}
  update(dt){const r=super.update(dt);try{boltTick(this,dt,r);}catch(_){}return r;}
  draw(){try{boltDraw(this);}catch(_){}}};
/* where the picture is: blends from where it was thrown (the crook, the fleece, the orbit) onto the bolt's real path */
function bpos(b){const d=Math.min(b.len,b.t*b.speed),w=eO(cl(d/70,0,1)),zEnd=b.v==='colchis'?30:b.v==='ram'?0:b.z;let z=b.v==='colchis'?lerp(b.o3[2],zEnd,cl(d/b.len,0,1)):b.z;
  return [lerp(b.o3[0],b.x,w),lerp(b.o3[1],b.y,w),b.v==='colchis'?z:lerp(b.o3[2],z,w)];}
function boltTick(b,dt,alive){const p=bpos(b);b.hist.push(p);if(b.hist.length>14)b.hist.shift();b.acc+=dt;
  if(b.v==='light'||b.v==='mini'){if(b.acc>.03){b.acc=0;S1().add({im:tx('star','#ffd36a'),x:p[0]+R_(-3,3),y:p[1]+R_(-3,3),z:p[2]+R_(-3,3),vz:R_(-10,20),s0:R_(6,10)*(b.v==='light'?1.2:.8),s1:2,life:R_(.2,.34),fo:.6,add:1,rot:R_(0,1)});
      if(b.v==='light'&&Math.random()<.3)woolBits(p[0],p[1],p[2],1,{spd:20,up:10,gold:1,s:.8,life:.9});}}
  else if(b.v==='ram'){if(b.acc>.08){b.acc=0;dust(p[0]-Math.cos(b.phi)*20,p[1]-Math.sin(b.phi)*14,1,{size:20,spd:26,life:.42,a:.5,dir:b.phi+Math.PI,spread:.6});if(Math.random()<.6)woolBits(p[0],p[1],34,1,{gold:1,spd:30,up:40});}}
  else if(b.v==='colchis'||b.v==='orb'){if(b.acc>.035){b.acc=0;S1().add({im:tx('star',b.v==='orb'?'#ffe08a':'#ffd36a'),x:p[0],y:p[1],z:p[2],vz:R_(-20,10),s0:7,s1:2,life:.26,fo:.6,add:1});}}
  else if(b.v==='prism'){if(b.acc>.04){b.acc=0;const c=['#bff4ff','#ffc4f0','#fff2a0'][(Math.random()*3)|0];S1().add({im:tx('star',c),x:p[0],y:p[1],z:p[2],s0:7,s1:2,life:.24,fo:.6,add:1});}}
  if(!alive){if(b.v==='thread')addFx(new ThreadFade({a:b.o3,b:p}));else if(b.v==='ram'){woolBits(p[0],p[1],30,8,{gold:1,spd:110,up:120});twinkles(p[0],p[1],30,8,30,'#ffd36a');flare(p[0],p[1],30,70,'#ffc84a',.3);}
    else if(b.hits&&b.hits.size===0){flare(p[0],p[1],p[2],30,'#ffd36a',.2);}}}
/* a golden thread with a wave running along it, from a to b (screen space) */
function threadLine(A,B,t,amp,a=1,pal=PAL.gold){const [x0,y0]=P(A[0],A[1],A[2]),[x1,y1]=P(B[0],B[1],B[2]),dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<2)return;const nx=-dy/L,ny=dx/L,N=Math.max(8,Math.round(L/9));
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';const path=()=>{ctx.beginPath();for(let i=0;i<=N;i++){const u=i/N,o=Math.sin(u*11-t*38)*amp*Math.sin(Math.PI*u),x=x0+dx*u+nx*o,y=y0+dy*u+ny*o;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}};
  for(const [w,c,al] of [[5,pal[1],.35],[2.6,pal[2],.95],[1,'#ffffff',.95]]){ctx.globalAlpha=a*al;ctx.strokeStyle=c;ctx.lineWidth=w;path();ctx.stroke();}ctx.restore();}
class ThreadFade{constructor(o){Object.assign(this,{t:0,layer:'top',life:.32},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,m=[(this.a[0]+this.b[0])/2,(this.a[1]+this.b[1])/2,Math.min(this.a[2],this.b[2])-18*k],A=this.a,B=this.b;
    threadLine(A,[lerp(A[0],m[0],.5),lerp(A[1],m[1],.5),lerp(A[2],m[2],.5)+4],this.t,2,1-k);threadLine([lerp(A[0],m[0],.5),lerp(A[1],m[1],.5),lerp(A[2],m[2],.5)+4],B,this.t,2,1-k);}}
function boltDraw(b){const p=bpos(b),[sx,sy]=P(p[0],p[1],p[2]),t=b.t;
  if(b.v==='thread'){threadLine(b.o3,p,t,5);const h=b.hist,q=h[Math.max(0,h.length-3)]||b.o3,[qx,qy]=P(q[0],q[1],q[2]);art('needle',sx,sy,26,{rot:Math.atan2(sy-qy,sx-qx),ax:.8,under:'#3a2206',ua:.35});glowAt(sx,sy,26,26,'#ffd36a',.55);return;}
  if(b.v==='ram'){const dir=Math.cos(b.phi)<0?-1:1,bob=Math.abs(Math.sin(t*15))*7,w=86,[x,y]=P(p[0],p[1],0);
    for(let i=2;i>=1;i--){const h=b.hist[b.hist.length-1-i*4];if(!h)continue;const [hx,hy]=P(h[0],h[1],0);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3/i;art('ram',hx,hy-bob,w,{ay:.92,sx:dir});ctx.restore();}
    glowAt(x,y-26,120,64,'#ffc84a',.32);art('ram',x,y-bob,w,{ay:.92,sx:dir,rot:Math.sin(t*15)*.05*dir,under:'#5a3008',ua:.35});return;}
  /* comet tail from the history */
  const pal=b.v==='prism'?['#1a2a3a','#7ad8ff','#bff4ff','#fff2fa','#ffffff']:b.v==='orb'?PAL.gold:b.v==='colchis'?PAL.holy:PAL.gold,R=b.v==='light'?13:b.v==='colchis'?9:b.v==='mini'?8:7;
  const h=b.hist;if(h.length>2){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=1;i<h.length;i++){const u=i/h.length,[ax,ay]=P(h[i-1][0],h[i-1][1],h[i-1][2]),[bx,by]=P(h[i][0],h[i][1],h[i][2]);
      ctx.globalAlpha=u*.8;ctx.strokeStyle=pal[2];ctx.lineWidth=R*1.3*u;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=R*.45*u;ctx.stroke();}ctx.restore();}
  if(b.v==='orb'){glowAt(sx,sy,R*5,R*5,'#ffc84a',.55);art('woolBall',sx,sy,R*2.3,{rot:t*9});return;}
  if(b.v==='prism'){glowAt(sx,sy,R*5,R*5,'#bff4ff',.5);art('prism',sx,sy,R*2.4,{rot:t*12});return;}
  orb(sx,sy,R,pal,t);if(b.v==='light'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5;ctx.strokeStyle='#fff6d0';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(sx,sy,R*1.9,R*1.1,t*6,0,TAU);ctx.stroke();ctx.restore();}}

/* ---------------------------------------------------------------------
   5. REBOUND OLD PIECES — SBeam (Sunbeam, Echo, Sun Chariot rays), SPillar (sanctuary, Olympus)
   --------------------------------------------------------------------- */
SBeam=function(o){if(o.w===16)return NOFX();   /* Sun Chariot rays: its sweep is drawn by its own hook */
  const echo=o.col===SPC.gold2,phi=o.phi,len=o.len||240;let A,B;
  if(echo){A=[o.x,o.y,30];B=[o.x+Math.cos(phi)*len,o.y+Math.sin(phi)*len,40];flare(o.x,o.y,30,56,'#fff2b8',.28);}
  else{const c=tip();A=[o.x+Math.cos(phi)*12,o.y+Math.sin(phi)*12,34];B=[o.x+Math.cos(phi)*len,o.y+Math.sin(phi)*len,26];flare(c[0],c[1],c[2]+12,90,'#ffb534',.28);embers(c[0],c[1],c[2]+12,5,{spd:60,up:50});}
  addFx(new Beam({a:A,b:B,w:echo?22:30,pal:echo?PAL.holy:PAL.sun}));if(!echo)flare(A[0],A[1],A[2],60,'#ffe08a',.22);
  return NOFX();};
SPillar=function(o){const col=o.col||SPC.gold,R=o.R||60;
  if(col===SPC.holy)addFx(new Pillar({x:o.x,y:o.y,R:58,H:360,life:.8,drop:.12,pal:PAL.holy,land:p=>{flare(p.x,p.y,8,130,'#fffbe0',.32);ring({x:p.x,y:p.y,r0:10,r1:SB.saSanct.R,life:.5,w:6,pal:PAL.holy,segs:4,gap:.2});twinkles(p.x,p.y,20,10,60,'#fff2b8');}}));
  else if(col===SPC.green){}                                                           /* Hand of Asclepius: the rod + serpent come from its hook */
  else if(R>=90)addFx(new Pillar({x:o.x,y:o.y,R:72,H:420,life:.95,drop:.13,pal:PAL.holy,land:p=>{flare(p.x,p.y,30,170,'#ffe58a',.35);dust(p.x,p.y,6,{ring:18,size:46,spd:80,life:.7});}}));
  else strike(o.x,o.y,40);
  return NOFX();};

/* ---------------------------------------------------------------------
   6. GROUND + TOP DRAWING (SGround / STop keep their update; only the picture is new)
   --------------------------------------------------------------------- */
const PRINTDIR=new WeakMap();
SGround.prototype.draw=function(){const t=this.t,gt=gameTime;
  const S=SHP.sanct;if(S){const [x,y]=P(S.x,S.y,0),a=cl((S.until-gt)/.5,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,S.R);g.addColorStop(0,rgba('#fffbe8',.32*a));g.addColorStop(.75,rgba('#f4efe4',.22*a));g.addColorStop(1,rgba('#ffe58a',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,S.R,0,TAU);ctx.fill();ctx.restore();}
  const Rn=SHP.rain;if(Rn){const [x,y]=P(Rn.x,Rn.y,0),a=cl((Rn.until-gt)/.4,0,1)*cl((gt-(Rn.until-SB.saRain.T))/.3,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,Rn.R);g.addColorStop(0,rgba('#ffe58a',.2*a));g.addColorStop(.8,rgba('#ffd36a',.12*a));g.addColorStop(1,rgba('#ffd36a',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,Rn.R,0,TAU);ctx.fill();ctx.restore();}
  for(const z of (SHP.zones||[])){if(z.col!=='#d8e8ff')continue;const [x,y]=P(z.x,z.y,0),a=cl((z.until-gt)/.5,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,z.R);g.addColorStop(0,rgba('#c8d4ff',.32*a));g.addColorStop(.7,rgba('#8a9ae8',.22*a));g.addColorStop(1,rgba('#5a6ab8',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,z.R,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=0;i<3;i++){const s=t*.5+i*TAU/3;ctx.globalAlpha=.45*a;ctx.strokeStyle='#c8d4ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,z.R*(.55+.12*i),s,s+1.6);ctx.stroke();}ctx.restore();}
  if(SHP.olympus){const [x,y]=P(player.x,player.y,0);glowAt(x,y,150,150*K,'#ffd36a',.35);art('meander',x,y,118,{flat:1,rot:t*.3,a:.85});}
  if(hasBuff('saAegis')){const [x,y]=P(player.x,player.y,0);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4+.15*Math.sin(t*4);ctx.strokeStyle='#ffd36a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,34,34*K,0,0,TAU);ctx.stroke();ctx.restore();}
  for(const s of SHP.steps){let an=PRINTDIR.get(s);if(an==null){an=player.phi;PRINTDIR.set(s,an);}const [x,y]=P(s.x,s.y,0),a=cl(s.until-gt,0,1)*cl((gt-(s.until-6))/.15,0,1),rd=gt-(s.until-6)>.6;
    glowAt(x,y,26,26*K,'#ffd36a',(rd?.5:.25)*a);art('print',x,y,15,{flat:1,rot:an,a:.95*a});}};
/* enemies: Enchant runes, Spellbound threads, hex eye, sleep Zs, charm heart, fate links */
function marks(t){const gt=gameTime;for(const e of enemies){if(e.dead)continue;const z=e.boss?84:56,[ex,ey]=P(e.x,e.y,z);
    if(sBound(e)){const [bx,by]=P(e.x,e.y,0),H=z*.9;glowAt(bx,by-H*.45,e.r*5,e.r*3,'#ff6ac8',.28+.08*Math.sin(t*6));ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
      for(let i=0;i<2;i++){const yy=by-H*(.32+.34*i),rr=e.r+8+2*Math.sin(t*5+i),rot=Math.sin(t*1.6+i*2)*.3;for(const [w,c,al] of [[4.4,'#c8288a',.45],[2.2,'#ffd36a',.9],[.9,'#ffffff',.9]]){ctx.globalAlpha=al;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(bx,yy,rr,rr*.3,rot,0,TAU);ctx.stroke();}}
      ctx.restore();art('rune',ex,ey-4+Math.sin(t*4)*2,12,{a:.95});}
    else if(e.enc>0&&e.encT>gt){const n=SP_BAL.enc.need;for(let i=0;i<n;i++){const on=i<e.enc,x=ex+(i-(n-1)/2)*10;if(on)glowAt(x,ey,18,18,'#ff6ac8',.35);art('rune',x,ey+(on?Math.sin(t*5+i)*1.2:0),on?10:7,{a:on?1:.3});}}
    if(e.hexT>gt){const a=cl((e.hexT-gt)/.4,0,1);glowAt(ex,ey-14,30,22,'#9a4aff',.4*a);art('eye',ex,ey-14+Math.sin(t*3)*1.5,20,{a:a*.95,sy:.75+.25*Math.abs(Math.sin(t*1.3))});}
    if(e.sleepT>gt){for(let i=0;i<3;i++){const u=(t*.6+i/3)%1;art('zzz',ex+8+u*12,ey-8-u*20,6+u*7,{a:Math.sin(Math.PI*u)*.95});}}
    if(e.charmT>gt){const s=1+.12*Math.sin(t*8);glowAt(ex,ey-16,28,28,'#ff6ac8',.4);art('heart',ex,ey-16+Math.sin(t*4)*2,14*s,{a:.98});}}
  const F=SHP.fate;if(F&&F.until>gt){const L=[...F.set].filter(e=>!e.dead),a=cl((F.until-gt)/.5,0,1);for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const A=L[i],B=L[j],m=[(A.x+B.x)/2,(A.y+B.y)/2,12];
      threadLine([A.x,A.y,30],[lerp(A.x,m[0],.5),lerp(A.y,m[1],.5),18],t,1.2,.8*a);threadLine([lerp(A.x,m[0],.5),lerp(A.y,m[1],.5),18],[B.x,B.y,30],t,1.2,.8*a);
      const u=(t*.8+i*.3+j*.17)%1,q=u<.5?[lerp(A.x,B.x,u),lerp(A.y,B.y,u),lerp(30,14,u*2)]:[lerp(A.x,B.x,u),lerp(A.y,B.y,u),lerp(14,30,(u-.5)*2)],[gx,gy]=P(q[0],q[1],q[2]);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.drawImage(tx('star','#ffd36a'),gx-7,gy-7,14,14);ctx.restore();}
    for(const e of L){const [x,y]=P(e.x,e.y,30);glowAt(x,y,20,20,'#ffd36a',.5*a);}}}
const AEG={flash:-9};
STop.prototype.draw=function(){const t=this.t,gt=gameTime,[px,py]=P(player.x,player.y,player.z||0),[fx0,fy0]=P(player.x,player.y,0);
  /* Golden Wool layers: little gold tufts in a smile under her feet */
  if(sL('snFleece')){const cap=SP_BAL.wool.cap;for(let i=0;i<cap;i++){const on=i<SHP.wool,u=i-(cap-1)/2;art((on?'woolG':'wool')+(i%3),fx0+u*9.5,fy0+12+u*u*.9,on?11:8.5,{a:on?1:.3});}}
  /* Hermes' wings at her feet */
  if(hasBuff('saHermes')){const fl=.62+.38*Math.sin(t*16);for(const s of [-1,1]){glowAt(px+s*34,py-10,40,28,'#ffd36a',.32);art('wing',px+s*25,py+1,24,{sx:s,sy:fl,ax:.1,ay:.86,rot:s*.22,a:.97,under:'#5a3008',ua:.3});}}
  /* Fleece Shield / Overflowing Cup: a golden bubble with wool on its rim */
  const sh=SHP.shield+SHP.cup;if(sh>0){const [bx,by]=P(player.x,player.y,(player.z||0)+34);ctx.save();ctx.translate(bx,by);ctx.scale(1,1.28);ctx.globalCompositeOperation='lighter';const r=37,g=ctx.createRadialGradient(0,0,r*.2,0,0,r);
    g.addColorStop(0,'rgba(255,240,180,0)');g.addColorStop(.72,'rgba(255,214,106,.08)');g.addColorStop(.93,'rgba(255,214,106,'+(.34+.08*Math.sin(t*4))+')');g.addColorStop(1,'rgba(255,240,190,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(255,250,230,.7)';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,r*.8,-2.5,-1.7);ctx.stroke();ctx.restore();
    const n=SHP.cup>0?5:4;for(let i=0;i<n;i++){const an=t*.9+i*TAU/n,x=bx+Math.cos(an)*36,y=by+Math.sin(an)*46*.55;art('woolG'+(i%3),x,y,10,{a:.9});}if(SHP.cup>0)art('cup',bx,by-52,18,{a:.85});}
  /* Aegis of Athena hovering at her side; flashes when it takes a blow */
  if(hasBuff('saAegis')){const dx=Math.cos(player.phi)<0?-1:1,x=player.x+dx*38,y=player.y+3,fl=cl(1-(gt-AEG.flash)/.25,0,1),[ax,ay]=P(x,y,(player.z||0)+30+2*Math.sin(t*3));
    glowAt(ax,ay,60+fl*40,60+fl*40,'#ffd36a',.35+fl*.5);art('aegis',ax,ay,32*(1+fl*.25),{a:.97,under:'#3a2206',ua:.35});}
  /* Olympus: a golden aura and the laurel crown */
  if(SHP.olympus){glowAt(px,py-34,110,140,'#ffd36a',.28+.06*Math.sin(t*3));const [wx,wy]=P(player.x,player.y,headZ()+8+2*Math.sin(t*2.4));glowAt(wx,wy,60,30,'#fff2b8',.4);art('wreath',wx,wy,40,{a:.98});}
  /* Golden Shearing: wool balls circling her */
  for(let i=0;i<SHP.orbs.length;i++){const an=t*2.5+i*TAU/Math.max(1,SHP.orbs.length),[ox,oy]=P(player.x+Math.cos(an)*40,player.y+Math.sin(an)*26,46);glowAt(ox,oy,36,36,'#ffc84a',.5);art('woolBall',ox,oy,14,{rot:t*3+i});}
  /* the Golden Fleece of Colchis floating over her head */
  if(SHP.colchis){const [x,y]=P(player.x,player.y,(player.z||0)+108+6*Math.sin(t*3)),k=eO(cl((gt-(SHP.colchis.until-SB.sbColchis.dur))/.45,0,1));glowAt(x,y,150*k,110*k,'#ffc84a',.55);
    art('fleece',x,y,74*(.4+.6*back(k)),{rot:Math.sin(t*2)*.07,sx:1+.035*Math.sin(t*3.2),sy:1-.035*Math.sin(t*3.2),under:'#5a3008',ua:.3});}
  /* Chorus of Sirens: three siren shadows circling her */
  if(SHP.sirens)for(let i=0;i<SB.scSirens.n;i++){const an=t*1.2+i*TAU/SB.scSirens.n,[sx,sy]=P(player.x+Math.cos(an)*70,player.y+Math.sin(an)*50,40+4*Math.sin(t*4+i));glowAt(sx,sy,54,64,'#b07aff',.4);art('siren',sx,sy,28,{a:.9,sx:Math.cos(an)>0?-1:1});}
  /* Woolly Cloud: she is a cloud of wool */
  if(SHP.cloud){const [cx,cy]=P(player.x,player.y,(player.z||0)+30);glowAt(cx,cy+16,120,40,'#ffd36a',.35);art('cloud',cx,cy,96,{a:.94,sx:1+.04*Math.sin(t*3),sy:1-.04*Math.sin(t*3),under:'#7a6a4a',ua:.2});}
  /* Blessed Rain: a little golden cloud over her */
  const Rn=SHP.rain;if(Rn){const [cx,cy]=P(Rn.x,Rn.y,124),a=cl((Rn.until-gt)/.4,0,1);glowAt(cx,cy+14,150,56,'#ffc84a',.5*a);art('cloud',cx,cy,92,{a:.92*a,sx:1+.03*Math.sin(t*2),under:'#7a5a1a',ua:.25});glowAt(cx,cy+6,90,34,'#ffd36a',.55*a);}
  marks(t);};

/* ---------------------------------------------------------------------
   7. WATCHER (runs after the sheep's own per-frame tick)
   --------------------------------------------------------------------- */
const PV={sanct:null,colchis:null,shield:0,wool:0,zones:new Set(),acc:{}};
const tickEvery=(k,s,dt)=>{PV.acc[k]=(PV.acc[k]||0)+dt;if(PV.acc[k]>=s){PV.acc[k]=0;return true;}return false;};
function watch(dt){const gt=gameTime;
  const S=SHP.sanct;if(S&&S!==PV.sanct)sanctColumns(S);PV.sanct=S;
  if(S&&tickEvery('sanct',.18,dt)){const a=R_(0,TAU),r=S.R*Math.sqrt(Math.random());S1().add({im:tx('star','#fff2b8'),x:S.x+Math.cos(a)*r,y:S.y+Math.sin(a)*r,z:4,vz:R_(24,44),s0:3,s1:R_(9,14),life:R_(.8,1.2),fo:.6,add:1});}
  if(PV.colchis&&!SHP.colchis){woolBits(player.x,player.y,118,10,{gold:1,spd:90,up:40});twinkles(player.x,player.y,118,10,40,'#ffd36a');}PV.colchis=SHP.colchis;
  if(SHP.colchis&&tickEvery('colchis',.12,dt))S1().add({im:tx('star','#ffd36a'),x:player.x+R_(-34,34),y:player.y+R_(-10,10),z:(player.z||0)+R_(100,120),vz:R_(-40,-20),s0:8,s1:2,life:R_(.6,.9),fo:.6,add:1});
  const sh=SHP.shield+SHP.cup;if(PV.shield>0&&sh<=0){const [x,y,z]=[player.x,player.y,(player.z||0)+34];woolBits(x,y,z,6,{gold:1,spd:100,up:80});glass(x,y,z,5,'#ffd36a',{spd:140,up:120});}PV.shield=sh;
  if(SHP.wool>PV.wool)twinkles(player.x+(SHP.wool-1-(SP_BAL.wool.cap-1)/2)*9.5,player.y+16,2,2,4,'#ffd36a',{life:.5});PV.wool=SHP.wool;
  const Rn=SHP.rain;if(Rn){PV.acc.rain=(PV.acc.rain||0)+dt*38*Math.max(.5,typeof Q!=='undefined'?Q.p:1);const im=AR.get('dropG');while(PV.acc.rain>=1){PV.acc.rain-=1;if(!im)break;const a=R_(0,TAU),r=Rn.R*Math.sqrt(Math.random())*.95,x=Rn.x+Math.cos(a)*r,y=Rn.y+Math.sin(a)*r;
      const tf=.3;S1().add({im:tx('core','#ffc84a'),x,y,z:118,vz:-300,g:600,s0:7,s1:7,str:3.4,life:tf,fi:.02,fo:.05,add:1});const q=S1('ground').add({im:tx('glow','#ffd36a'),x,y,z:1,flat:1,s0:4,s1:20,life:.3,fo:.7,add:1,a0:.85});q.t=-tf;
      if(Math.random()<.35){const q2=S1().add({im:tx('star','#fff2b8'),x,y,z:2,vz:40,s0:3,s1:9,life:.22,fo:.6,add:1});q2.t=-tf;}}}
  for(const z of (SHP.zones||[]))if(!PV.zones.has(z)){PV.zones.add(z);if(z.col==='#d8e8ff'){addFx(new Dragon(z));smoke(z.x,z.y,4,8,'#e4ecff|#7a8ae0',70,{sp:50,life:1.4,rise:14,layer:'ground'});}}
  for(const z of PV.zones)if(!(SHP.zones||[]).includes(z))PV.zones.delete(z);
  for(const z of (SHP.zones||[]))if(z.col==='#d8e8ff'&&tickEvery('mist',.25,dt)){const a=R_(0,TAU),r=z.R*Math.sqrt(Math.random())*.8;smoke(z.x+Math.cos(a)*r,z.y+Math.sin(a)*r,4,1,'#e4ecff|#8a9ae8',56,{sp:12,life:1.6,rise:8,layer:'ground'});}
  for(const s of SHP.steps)if(s.used&&!s._fl){s._fl=1;ring({x:s.x,y:s.y,r0:4,r1:26,life:.35,w:3,pal:PAL.heal,segs:3,gap:.3});twinkles(s.x,s.y,4,4,10,'#9aff9a',{life:.5});}
  if(hasBuff('saHermes')&&player.moving&&tickEvery('herm',.16,dt))feathers(player.x-Math.cos(player.phi)*10,player.y-Math.sin(player.phi)*8,10,1,{spd:20,up:30,term:.35});
  if(SHP.hot.length&&tickEvery('hot',.3,dt)){const a=R_(0,TAU);S1().add({im:tx('star','#9aff9a'),x:player.x+Math.cos(a)*16,y:player.y+Math.sin(a)*10,z:R_(6,30),vz:R_(30,50),s0:3,s1:R_(9,13),life:R_(.6,.9),fo:.6,add:1});if(Math.random()<.4)leaves(player.x,player.y,16,1,{up:90,spd:20,term:.35});}
  if(SHP.olympus&&tickEvery('olym',.1,dt)){const a=R_(0,TAU),r=R_(10,60);S1().add({im:tx('star','#ffe58a'),x:player.x+Math.cos(a)*r,y:player.y+Math.sin(a)*r*.8,z:R_(0,20),vz:R_(40,80),s0:3,s1:R_(10,16),life:R_(.7,1.1),fo:.6,add:1});}
  if(hasBuff('sbSong')&&tickEvery('song',.85,dt))flo({n:Math.random()<.5?'noteAP':'noteBP',x:player.x+R_(-16,16),y:player.y,z:headZ()-6,vz:34,vx:R_(-14,14),w:R_(10,13),life:1.2,sw:6,glow:'#ff6ac8'});
  if(SHP.cloud&&player.moving&&tickEvery('cloud',.09,dt))woolBits(player.x-Math.cos(player.phi)*24,player.y-Math.sin(player.phi)*16,26,1,{spd:20,up:20,term:.35});}
const T0=SCore.prototype.tick;SCore.prototype.tick=function(dt){window.__SHTICK=1;try{T0.call(this,dt);}finally{window.__SHTICK=0;}try{watch(dt);}catch(e){if(!SV._w){SV._w=1;console.warn('sheep fx watch',e);}}};

/* ---------------------------------------------------------------------
   8. HIT SPARKS — from the damage itself
   --------------------------------------------------------------------- */
function hitFx(e,key,o){const x=e.x,y=e.y,z=zOf(e);
  switch(key){
    case 'basic':if(o.knock){addFx(new KBurst({x,y,z,R:26,n:7,life:.2,pal:PAL.gold,ink:.4}));flare(x,y,z,44,'#ffd36a',.2);woolBits(x,y,z,3,{spd:90,up:90});}
      else{flare(x,y,z,64,'#ffe08a',.24);addFx(new KBurst({x,y,z,R:34,n:8,life:.24,pal:PAL.gold,ink:.4}));twinkles(x,y,z,5,20,'#fff2b8',{life:.5});}break;
    case 'snLight':flare(x,y,z,96,'#ffe08a',.3);addFx(new KBurst({x,y,z,R:48,n:10,life:.28,pal:PAL.gold,ink:.45}));ring({x,y,r0:10,r1:62,life:.4,w:6,pal:PAL.gold,segs:4,gap:.25});woolBits(x,y,z,5,{gold:1,spd:120,up:120});break;
    case 'scPrism':flare(x,y,z,40,'#bff4ff',.2);twinkles(x,y,z,4,16,'#ffc4f0',{life:.4});break;
    case 'saSun':flare(x,y,z,66,'#ffb534',.26);addFx(new KBurst({x,y,z,R:36,n:9,life:.24,pal:PAL.sun,ink:.4}));embers(x,y,z,5,{spd:110,up:110});homeMotes(x,y,z,2,PAL.heal);break;
    case 'saEcho':flare(x,y,z,50,'#fff2b8',.22);homeMotes(x,y,z,1,PAL.heal);break;
    case 'saPurify':flare(x,y,z,50,'#fffbe0',.22);glint(e,'#fff2b8',20);break;
    case 'saRain':flare(x,y,z,26,'#ffd36a',.16);break;
    case 'saOlympus':flare(x,y,z,110,'#ffe58a',.32);addFx(new KBurst({x,y,z,R:54,n:11,life:.3,pal:PAL.holy,ink:.45}));embers(x,y,z,6,{spd:130,up:170,c:['#fffbe0','#ffd36a','#c07a1a']});break;
    case 'sbThread':addFx(new Loops({e,life:.5,n:2,r0:40}));glint(e,'#ff9ae8',18);break;
    case 'sbLullaby':flo({n:'zzz',x,y,z:z+18,vz:30,vx:10,w:10,life:1,glow:'#8a9aff'});glint(e,'#ffc4ec',14,.2);break;
    case 'sbShatter':{const b=BUB.get(e);if(b){b.popped=1;BUB.delete(e);}glass(x,y,z,10,'#ff9ae8',{spd:200,up:220});glass(x,y,z,4,'#bff4ff',{spd:160,up:200});addFx(new KBurst({x,y,z,R:50,n:10,life:.28,pal:PAL.pink,ink:.45}));flare(x,y,z,80,'#ffc4ec',.28);twinkles(x,y,z,6,26,'#bff4ff',{life:.5});break;}
    case 'sbRam':addFx(new KBurst({x,y,z,R:44,n:9,life:.26,pal:PAL.gold,ink:.45}));flare(x,y,z,70,'#ffc84a',.26);woolBits(x,y,z,6,{gold:1,spd:130,up:140});dust(x,y,3,{ring:8,size:36,spd:60,life:.6});break;
    case 'sbSiren':flare(x,y,z,44,'#b07aff',.22);glint(e,'#e4ccff',16);break;
    case 'sbCauldron':glint(e,'#7aff6a',16,.24);break;
    case 'sbColchis':if(o.big)break;flare(x,y,z,50,'#ffd36a',.22);glint(e,'#ff9ae8',14);break;
    case 'sbFate':glint(e,'#ffd36a',16,.24,6);break;
    case 'sbMirror':{const c=[player.x,player.y,36];addFx(new KStreak({a:[c[0],c[1]],b:[x,y],z:34,w:4,life:.24,pal:PAL.gold,ink:.2}));flare(c[0],c[1],c[2],70,'#fff2b8',.24);glint(e,'#fff2b8',18);break;}
    case 'scGorgon':AEG.flash=gameTime;flare(x,y,z,46,'#c8c8d4',.24);glint(e,'#e8e8f0',18);break;
    case 'scChariot':flare(x,y,z,56,'#ffa62e',.22);embers(x,y,z,4,{spd:100,up:100});break;
    case 'scShearing':woolBits(x,y,z,4,{gold:1,spd:110,up:110});flare(x,y,z,44,'#ffc84a',.22);break;
    case 'scCloud':woolBits(x,y,z,3,{spd:80,up:80});flo({n:'zzz',x,y,z:z+16,vz:28,w:10,life:1,glow:'#8a9aff'});break;
    case 'scSirens':glint(e,'#e4ccff',14);flo({n:Math.random()<.5?'noteAV':'noteBV',x,y,z:z+10,vz:36,w:11,life:.9,glow:'#b07aff'});break;
    case 'scCharm':flo({n:'heart',x,y,z:z+8,vz:40,w:12,life:.8,sw:3});glint(e,'#ff9ad8',16);break;
    default:glint(e,'#ffd36a',14);}}
const SH0=sHit;sHit=function(e,mult,key,o){const alive=e&&!e.dead,d=SH0.apply(this,arguments);if(alive&&d>0){try{hitFx(e,key,o||{});}catch(_){}}return d;};

/* ---------------------------------------------------------------------
   9. SYSTEM WRAPPERS — Enchant, shearing, the end of Olympus / Colchis / the cloud; old picture helpers replaced
   --------------------------------------------------------------------- */
const EN0=sEnc;sEnc=function(e,n){if(!e||e.dead)return EN0.apply(this,arguments);const b0=sBound(e),c0=e.enc||0;self(()=>EN0.apply(this,arguments));
  try{if(!b0&&sBound(e)){addFx(new Loops({e,life:.6,n:3,r0:58,gold:1}));flare(e.x,e.y,zOf(e),80,'#ff6ac8',.28);twinkles(e.x,e.y,zOf(e),6,24,'#ffd36a',{life:.6});ring({x:e.x,y:e.y,r0:e.r+40,r1:e.r+6,life:.35,w:5,pal:PAL.pink,segs:3,gap:.3});}
    else if(!b0&&(e.enc||0)>c0){const z=e.boss?84:56;flo({n:'rune',x:e.x,y:e.y,z:z-26,vz:60,dr:3,w:10,life:.45,sw:0,glow:'#ff6ac8',fo:.25});}}catch(_){}};
sFluff=function(x,y,n){woolBurst(x,y,n||4);};
sSparks=function(){};
sHealFx=function(){healFx(false);};
sPow=function(){};
const OE0=sOlympusEnd;sOlympusEnd=function(){const x=player.x,y=player.y;OE0.apply(this,arguments);
  try{const R=SB.saOlympus.R;flare(x,y,30,200,'#fff2b8',.4);ring({x,y,r0:20,r1:R+30,life:.55,w:8,pal:PAL.holy,segs:5,gap:.15});ring({x,y,r0:10,r1:R*.7,life:.45,w:5,pal:PAL.gold,segs:4,gap:.25,delay:.06});
    const [wx,wy,wz]=[x,y,headZ()+8];leaves(wx,wy,wz,12,{gold:1,spd:150,up:140});twinkles(x,y,40,14,R*.6,'#ffe58a',{life:.9});healFx(true);}catch(_){}};
const CE0=sColchisEnd;sColchisEnd=function(){const L=enemies.filter(e=>!e.dead&&sBound(e)&&dist(player,e)<420);CE0.apply(this,arguments);try{for(const e of L)spellBreak(e);}catch(_){}};
const CL0=sCloudEnd;sCloudEnd=function(){const x=player.x,y=player.y;CL0.apply(this,arguments);try{woolBits(x,y,30,14,{spd:150,up:120});dust(x,y,8,{ring:16,size:52,spd:110,life:.8});ring({x,y,r0:10,r1:SB.scCloud.R,life:.4,w:6,pal:PAL.wool,segs:4,gap:.2});smoke(x,y,10,5,'#fffaf0|#c8a060',60,{sp:70,life:1});}catch(_){}};

/* ---------------------------------------------------------------------
   10. FILTERS — the old pictures stay off while the sheep's own code runs (boss telegraphs keep theirs)
   --------------------------------------------------------------------- */
const DROPN=new Set(['GRing','Impact','SImg','Crack','CrackStar','Streak','StarCut','BrushArc','TexArc','SoundArcs']);
const exRing=f=>{ring({x:f.x,y:f.y,r0:10,r1:Math.max(40,f.r1||46),life:.4,w:5,pal:PAL.gold,segs:4,gap:.25});woolBits(f.x,f.y,24,3,{gold:1,spd:70,up:70});};
class CastRing{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.45},o);}update(dt){this.t+=dt;return !this.dead&&this.t<this.life;}kill(){this.dead=1;}
  draw(){const k=cl(this.t/.15,0,1)*cl((this.life-this.t)/.15,0,1),[x,y]=P(player.x,player.y,0);glowAt(x,y,110,110*K,'#ffd36a',.35*k);art('meander',x,y,96,{flat:1,rot:this.t*1.4,a:.95*k});}}
const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(n==='Trail')return {layer:'none',active:true,s:[],add(){},update(){return false;},draw(){}};
    if(n==='GRing'&&f.color==='#ffe9a8'){try{exRing(f);}catch(_){}return NOFX();}
    if(n==='RuneCircle'&&f.color==='#6fc8ff'&&player.casting)return A0.call(this,new CastRing({life:f.life||.45}));
    if(n==='DText'&&/^[♪♫\s]+$/.test(f.text||''))return NOFX();
    if(mine()&&DROPN.has(n))return NOFX();}
  return A0.apply(this,arguments);};
const EM0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock)$/.test(o.type))return;return EM0.apply(this,arguments);};

/* ---------------------------------------------------------------------
   11. SKILL HOOKS — each skill's make() gets the picture events
   --------------------------------------------------------------------- */
function hook(k,f){const sk=SKILLS[k];if(!sk||!sk.make||sk._shv)return;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){try{f(a,c);}catch(e){console.warn('sheep fx',k,e);}}return a;};sk._shv=1;}
const HK={
  /* ---- Basic */
  snLight(a){const T=a.windup;gather({life:rt(T),R1:11,n:18,pal:PAL.gold});at(a,T,()=>{const c=tip();flare(c[0],c[1],c[2],60,'#fff2b8',.2);});},
  snHop(a){const L=.28;every(rt(L),(f,dt)=>{if(Math.random()<dt*22)woolBits(player.x,player.y,26,1,{spd:20,up:30,term:.4});});
    at(a,L,()=>{woolBits(player.x,player.y,20,4,{spd:90,up:80});dust(player.x,player.y,4,{ring:8,size:34,spd:60,life:.55});});},
  snChannel(a){const T=a.windup;gather({life:rt(T),src:()=>[player.x,player.y,(player.z||0)+40],pal:PAL.heal,R1:8,n:12,rad:40});
    at(a,before(a,.1),()=>addFx(new Pillar({x:player.x,y:player.y,R:30,H:260,life:.5,drop:.1,pal:PAL.holy})));},
  /* ---- A · healer */
  saHymn(a){const T=a.windup,z=()=>headZ()+26;sprite({n:'lyre',x:player.x,y:player.y,z:0,follow:player,ox:0,oy:-1,w:32,life:rt(T)+.75,fi:.08,fo:.3,s0:.3,s1:1,pop:.22,under:'#3a2206',ua:.45,tick:f=>{f.z=z();f.rot=Math.sin(f.t*5)*.08;}});
    at(a,T,()=>{const zz=z();for(let i=0;i<5;i++)flo({n:i%2?'noteBG':'noteAG',x:player.x+R_(-8,8),y:player.y,z:zz,vx:R_(-50,50),vy:R_(-10,10),vz:R_(30,60),dr:1.2,w:R_(11,14),life:R_(1,1.3),sw:6,delay:i*.07,glow:'#5ae08e'});
      ring({x:player.x,y:player.y,r0:10,r1:60,life:.45,w:5,pal:PAL.heal,segs:4,gap:.25});});},
  saSun(a){const T=a.windup,c=tip();gather({life:rt(T),src:()=>[c[0],c[1],c[2]+12],pal:PAL.sun,R1:9,n:18,img:'star'});
    sprite({n:'sun',x:c[0],y:c[1],z:c[2]+12,w:40,life:rt(T)+.1,fi:.08,fo:.1,s0:.25,s1:1,spin:1.6,under:'#5a1a04',ua:.25});},
  saEcho(a){},
  saShield(a){const T=a.windup;at(a,T,()=>{const n=Math.max(1,SHP.thin?5:3);for(let i=0;i<n*3;i++){const an=R_(0,TAU),im=AR.get('woolG'+(i%3));if(!im)break;S1().add({im,orb:1,cf:player,cx:player.x,cy:player.y,ang:an,r:R_(40,60),va:R_(5,8),vr2:-90,z:R_(10,50),vz:0,s0:10,s1:6,asp:.75,life:R_(.35,.5),fo:.4});}
      ring({x:player.x,y:player.y,r0:62,r1:24,life:.35,w:5,pal:PAL.gold,segs:4,gap:.2});later(.3,()=>{flare(player.x,player.y,34,90,'#ffe08a',.28);twinkles(player.x,player.y,34,6,30,'#fff2b8',{life:.6});});});},
  saAegis(a){const T=a.windup;at(a,T,()=>{const an=player.phi,x=player.x+Math.cos(an)*26,y=player.y+Math.sin(an)*20;sprite({n:'aegis',x,y,z:36,w:58,life:.5,fi:.03,fo:.25,s0:.2,s1:1,pop:.16,under:'#3a2206',ua:.3});
      flare(x,y,36,120,'#ffd36a',.3);ring({x:player.x,y:player.y,r0:10,r1:82,life:.4,w:7,pal:PAL.gold,segs:4,gap:.2});dust(player.x,player.y,5,{ring:14,size:40,spd:80,life:.6});});},
  saSanct(a,c){const [x,y]=sPt(c,SB.saSanct.range),T=a.windup;flat({n:'meander',x,y,w:SB.saSanct.R*2.08,life:rt(T)+.05,fi:rt(T)*.8,fo:.05,a:.45,spin:.6});},
  saPurify(a){const T=a.windup;gather({life:rt(T),src:()=>[player.x,player.y,(player.z||0)+38],pal:PAL.holy,R1:10,n:16,rad:50});
    at(a,T,()=>{const x=player.x,y=player.y,R=SB.saPurify.R;flare(x,y,36,150,'#fffbe0',.32);addFx(new KBurst({x,y,z:30,R:R*.8,n:14,life:.34,pal:PAL.holy,ink:.35}));ring({x,y,r0:10,r1:R+20,life:.4,w:8,pal:PAL.holy,segs:5,gap:.15});
      ring({x,y,r0:6,r1:R*.6,life:.32,w:4,pal:PAL.gold,segs:3,gap:.3,delay:.05});twinkles(x,y,30,10,R*.7,'#fff2b8',{life:.7});});},
  saRain(a){const T=a.windup;at(a,T,()=>{const [cx,cy]=[player.x,player.y];flare(cx,cy,128,90,'#ffe08a',.3);woolBits(cx,cy,128,5,{gold:1,spd:60,up:20});});},
  saHermes(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;feathers(x,y,14,8,{spd:90,up:120});flare(x,y,10,70,'#ffe08a',.24);
      for(const s of [-1,1])sprite({n:'wing',x,y,z:6,follow:player,ox:s*8,oy:0,w:34,sx:s,ax:.1,ay:.86,life:.35,fi:.02,fo:.2,s0:.2,s1:1,pop:.2});ring({x,y,r0:8,r1:46,life:.35,w:4,pal:PAL.gold,segs:3,gap:.3});});},
  saHand(a){const T=a.windup;gather({life:rt(T),src:()=>[player.x,player.y,(player.z||0)+44],pal:PAL.heal,R1:10,n:16,rad:56});
    at(a,T,()=>{const x=player.x,y=player.y,bk=player.phi+Math.PI;const sd=Math.cos(player.phi)<0?1:-1;sprite({n:'rod',layer:'sorted',x:x+sd*30,y:y+2,z:0,w:34,ay:.985,life:1.6,fi:.03,fo:.45,sortOff:2,under:'#0f3a18',ua:.25,tick:f=>{f.sy2=eO(cl(f.t/.25,0,1));}});glowAt0(x+sd*30,y,90);
      helix({R:30,H:120,life:1.2,turns:2.3,w:7,pal:PAL.heal});helix({R:24,H:100,life:1.1,turns:2,w:4,pal:PAL.holy,ph:Math.PI});flare(x,y,40,130,'#9aff9a',.32);leaves(x,y,30,9,{spd:90,up:160});
      addFx(new Pillar({x,y,R:34,H:260,life:.6,drop:.08,pal:PAL.heal}));});},
  saOlympus(a){const T=a.windup;at(a,.05,()=>{gather({life:rt(Math.max(.05,T-.05)),src:()=>[player.x,player.y,(player.z||0)+50],pal:PAL.holy,R1:16,n:26,rad:90});flat({n:'meander',x:player.x,y:player.y,follow:player,w:118,life:rt(Math.max(.05,T-.05))+.1,fi:.2,fo:.1,a:.7,spin:.8});});
    at(a,T,()=>{const x=player.x,y=player.y;sprite({n:'wreath',x,y,follow:player,z:headZ()+8,w:40,life:.4,fi:.02,fo:.2,s0:2.2,s1:1,pop:.25});ring({x,y,r0:10,r1:170,life:.55,w:8,pal:PAL.gold,segs:5,gap:.15});
      twinkles(x,y,40,16,90,'#ffe58a',{life:.9});leaves(x,y,60,8,{gold:1,spd:110,up:120});});},
  /* ---- B · enchanter */
  sbThread(a){const T=a.windup;gather({life:rt(T),pal:PAL.pink,R1:7,n:12,rad:36});at(a,T,()=>{const c=tip();flare(c[0],c[1],c[2],50,'#ffd36a',.2);});},
  sbLullaby(a){const T=a.windup,phi=player.phi;   /* the first wave is ON the targets at the hit frame (it rolls out from .12 s before) */
    at(a,before(a,.12),()=>{const x=player.x,y=player.y,R=SB.sbLullaby.R,h=SB.sbLullaby.half;for(let i=0;i<3;i++)addFx(new Wave({x,y,phi,z:30,r0:16,r1:R,half:h,life:.32,w:5,pal:i===1?PAL.dream:PAL.pink,delay:i*.1}));});
    at(a,T,()=>{const x=player.x,y=player.y,R=SB.sbLullaby.R,h=SB.sbLullaby.half;
      for(let i=0;i<7;i++){const u=phi+R_(-h,h),v=R/R_(.7,1.1);flo({n:['noteAP','noteBP','zzz'][i%3],x:x+Math.cos(u)*14,y:y+Math.sin(u)*14,z:34,vx:Math.cos(u)*v,vy:Math.sin(u)*v,vz:R_(0,20),dr:1.4,w:R_(10,13),life:R_(.8,1.1),sw:5,delay:i*.04,glow:i%3===2?'#8a9aff':'#ff6ac8'});}});},
  sbShatter(a){const L=(SHP.lullList||[]).filter(e=>!e.dead&&(e.lullT>gameTime||e.st.slow>0)),T=a.windup;for(const e of L){const old=BUB.get(e);if(old)old.popped=1;const b=addFx(new Bubble({e,form:rt(T)}));BUB.set(e,b);}},
  sbHex(a,c){const [x,y]=sPt(c,SB.sbHex.range),T=a.windup,R=SB.sbHex.R;flat({n:'hexSig',x,y,w:R*2.3,life:rt(T)+1.2,fi:rt(T),fo:.6,a:.95,spin:.5,s0:1.25,s1:.9,add:0});
    at(a,T,()=>{flare(x,y,8,110,'#b07aff',.3);ring({x,y,r0:R+20,r1:14,life:.4,w:6,pal:PAL.violet,segs:5,gap:.18});twinkles(x,y,10,10,R*.8,'#e4ccff',{life:.8});smoke(x,y,6,4,'#e4ccff|#5a2a8a',50,{sp:30,life:1,rise:22,layer:'ground'});});},
  sbSong(a){const T=a.windup;sprite({n:'lyre',x:player.x,y:player.y,z:0,follow:player,oy:-1,w:30,life:rt(T)+.6,fi:.08,fo:.3,s0:.3,s1:1,pop:.2,under:'#5a0a3a',ua:.45,tick:f=>{f.z=headZ()+26;f.rot=Math.sin(f.t*6)*.1;}});
    at(a,T,()=>{const x=player.x,y=player.y;for(let i=0;i<8;i++){const u=i/8*TAU;flo({n:i%2?'noteBP':'noteAP',x:x+Math.cos(u)*12,y:y+Math.sin(u)*10,z:40,vx:Math.cos(u)*90,vy:Math.sin(u)*70,vz:R_(10,40),dr:2,w:12,life:1,sw:4,glow:'#ff6ac8'});}
      ring({x,y,r0:10,r1:92,life:.42,w:5,pal:PAL.pink,segs:4,gap:.25});flare(x,y,40,90,'#ffc4ec',.26);});},
  sbRam(a){const T=a.windup;gather({life:rt(T),pal:PAL.gold,R1:9,n:14});at(a,T,()=>{flare(player.x,player.y,30,90,'#ffc84a',.26);dust(player.x,player.y,4,{size:36,spd:70,life:.6,dir:player.phi+Math.PI,spread:.8});});},
  sbSleep(a,c){const [x,y]=sPt(c,SB.sbSleep.range),T=a.windup;
    at(a,before(a,.12),()=>smoke(x,y,6,6,'#e4ecff|#7a8ae0',60,{sp:40,life:1.2,rise:10,layer:'ground'}));at(a,T,()=>{flare(x,y,20,110,'#c8d4ff',.3);twinkles(x,y,20,10,SB.sbSleep.R*.6,'#e4ecff',{life:.9});});},
  sbFate(a){const L=(SHP.sleepList||[]).filter(e=>!e.dead),T=a.windup;at(a,T,()=>{const c=tip();for(const e of L){addFx(new ThreadFade({a:c,b:[e.x,e.y,30],life:.35}));addFx(new Loops({e,life:.45,n:1,r0:30}));glint(e,'#ffd36a',18,.3);}});},
  sbSiren(a,c){const [x,y]=sPt(c,SB.sbSiren.range),T=a.windup,R=SB.sbSiren.R;let pre=[];a.events.unshift({t:T,f:()=>{pre=sNear(x,y,R).map(e=>[e,e.x,e.y]);}});
    flo({n:'siren',x,y,z:30,vz:0,w:40,life:rt(T)+1.1,fi:.15,fo:.45,sw:3,fq:2,s0:.6,s1:1,pop:.3,glow:'#b07aff',under:'#1c0a36',ua:.25});
    at(a,T,()=>{for(const [e,x0,y0] of pre)if(!e.dead&&Math.hypot(e.x-x0,e.y-y0)>8)addFx(new KStreak({a:[x0,y0],b:[e.x,e.y],z:24,w:7,life:.26,pal:PAL.violet,ink:.3}));
      ring({x,y,r0:R,r1:12,life:.4,w:6,pal:PAL.violet,segs:5,gap:.2});ring({x,y,r0:R*.7,r1:10,life:.35,w:4,pal:PAL.pink,segs:4,gap:.3,delay:.06});flare(x,y,30,100,'#b07aff',.3);
      for(let i=0;i<6;i++){const u=i/6*TAU;flo({n:i%2?'noteBV':'noteAV',x:x+Math.cos(u)*20,y:y+Math.sin(u)*14,z:46,vx:Math.cos(u)*50,vy:Math.sin(u)*36,vz:30,dr:2,w:12,life:.9,glow:'#b07aff'});}});},
  sbCauldron(a,c){const [x,y]=sPt(c,SB.sbCauldron.range),T=a.windup;at(a,T,()=>addFx(new Cauldron({x,y,fly:.35})));},
  sbColchis(a){const T=a.windup;at(a,.05,()=>gather({life:rt(Math.max(.05,T-.05)),src:()=>[player.x,player.y,(player.z||0)+120],pal:PAL.gold,R1:18,n:26,rad:80}));
    at(a,T,()=>{const x=player.x,y=player.y;flare(x,y,120,170,'#ffd36a',.34);woolBits(x,y,120,12,{gold:1,spd:130,up:60});ring({x,y,r0:10,r1:120,life:.5,w:6,pal:PAL.gold,segs:5,gap:.18});twinkles(x,y,110,10,50,'#fff2b8',{life:.8});});},
  /* ---- C */
  scShearing(a){const T=a.windup;at(a,T,()=>{flare(player.x,player.y,46,90,'#ffc84a',.26);ring({x:player.x,y:player.y,r0:8,r1:50,life:.35,w:4,pal:PAL.gold,segs:3,gap:.3});});},
  scCloud(a){const T=a.windup;at(a,T,()=>{woolBits(player.x,player.y,30,12,{spd:120,up:100});dust(player.x,player.y,5,{ring:10,size:46,spd:80,life:.7});smoke(player.x,player.y,24,5,'#fffaf0|#c8a060',56,{sp:50,life:.8});});},
  scChariot(a){const ev=a.events.slice(0,SB.scChariot.n),ph=player.phi,lead=.07;ev.forEach((e,i)=>{const base=ph+i*Math.PI*.66;
      const ld=Math.min(lead,e.t);at(a,e.t-ld,()=>{const arc=addFx(new KArc({x:player.x,y:player.y,follow:1,fz:18,z:18,phi:base,tilt:0,a0:-1.65,a1:1.65,hit:0,R:SB.scChariot.R*.86,W:44,lead:Math.max(.012,rt(ld)),sweep:rt(ld)+.12,hold:.04,fade:.2,pal:PAL.sun,ink:.4,emb:.5}));
        addFx(new ChariotWheel({arc}));});});},
  scCharm(a,c){const t=sTgt(c,SB.scCharm.range),T=a.windup;if(!t)return;at(a,T,()=>{const cr=tip();addFx(new KStreak({a:[cr[0],cr[1]],b:[t.x,t.y],z:36,w:6,life:.24,pal:PAL.pink,ink:.3}));
      for(let i=0;i<3;i++){const u=(i+1)/4;flo({n:'heart',x:lerp(cr[0],t.x,u),y:lerp(cr[1],t.y,u),z:40,vz:20,w:10,life:.5,delay:i*.03,sw:2});}
      flo({n:'heart',x:t.x,y:t.y,z:zOf(t)+20,vz:24,w:26,life:.75,s0:.2,s1:1,pop:.2,sw:2,glow:'#ff6ac8'});flare(t.x,t.y,zOf(t),70,'#ff9ad8',.26);});},
  scSirens(a){const T=a.windup;at(a,T,()=>{for(let i=0;i<SB.scSirens.n;i++){const an=i*TAU/SB.scSirens.n;flare(player.x+Math.cos(an)*70,player.y+Math.sin(an)*50,40,70,'#b07aff',.3);}ring({x:player.x,y:player.y,r0:10,r1:80,life:.4,w:5,pal:PAL.violet,segs:4,gap:.25});});}};
/* the sun wheel riding the Sun Chariot's sweep */
class ChariotWheel{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.arc.t<this.arc.life;}
  draw(){const A=this.arc,k=cl((A.t-A.sweep)/(A.hold+A.fade),0,1);if(k>=1)return;const q=A.pt(A.head(),A.R-A.W*.4);glowAt(q[0],q[1],70,70,'#ffa62e',.55*(1-k));art('sunWheel',q[0],q[1],34,{rot:this.t*14,a:1-k});}}
for(const k in HK)hook(k,HK[k]);
/* the normal attack: a bonk of the crook (golden arc that lands on the contact frame); the third swing throws a little light ball */
const SHAPES=[[1.3,2.3,-.25,.3],[.25,-1.6,1.5,0],[1.3,-.45,2.0,.2]];   /* overhead bonk · side sweep · upswing (tilt, from, to, angle on the contact frame) */
const MB0=mkBasic;mkBasic=function(tgt){const a=MB0.apply(this,arguments);try{if(a&&a.events&&a.events[0]){const lv=Math.max(1,sL('snCombo')),chain=SB.snCombo.chain[lv-1],idx=player.basicIdx,fin=idx===chain-1,T=a.events[0].t,sh=SHAPES[idx%3],phi=player.phi;
    addFx(new KArc({x:player.x,y:player.y,follow:1,fz:32,z:32,phi,tilt:sh[0],a0:sh[1],a1:sh[2],hit:sh[3],R:fin?44:52,W:fin?10:14,lead:rt(T),sweep:rt(T)+.06,hold:.03,fade:.16,pal:fin?PAL.holy:PAL.gold,ink:.35,N:18}));
    if(fin)at(a,T,()=>{const c=tip();flare(c[0],c[1],c[2],46,'#fff2b8',.18);});}}catch(_){}return a;};
SV.ready=1;
})();
