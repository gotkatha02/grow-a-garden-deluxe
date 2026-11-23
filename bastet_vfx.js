/* =====================================================================
   BASTET CURSE PRIESTESS (Egypt) — skill effects v3: SVG art (bastet_art.js) + code VFX.
   Owner 2026-11-23 "ทำของบาสเต็ด": the same brief as the cat, kitsune, axolotl, dragon, lion, croc and sheep — every skill drawn
   with SVG + code VFX that follows its concept AND what it really does (Hex 0–5 on each enemy, Souls 0–6, the servants, the zones,
   the shields …), in step with the frame its damage lands. Kit: window.K3 (cat_vfx.js) + window.VK (wolf_vfx3.js).

   CONCEPT (BASTET_SKILLS_TH.md): a cat priestess of Bastet with an ankh tome.
     Basic "Temple Kitten" = papyrus + turquoise soul-fire + temple gold: pages that fly and burn, the black cat of the omen,
       Cat's Grace (a cat's leap of light), Sand Veil (a gauze of sand round her), the Ankh of Life, the Temple Obelisk.
     A "Hexweaver of the Dead" = curse violet: hieroglyph glyphs (the hex marks orbit over each enemy's head, one per stack),
       the glyph seal, the plague of locusts, curse threads, Apep the chaos serpent, the Word of Doom (violet flame per stack),
       mummy linen, the Pharaoh's eye in the sky. B "Tomb Warden" = turquoise souls + linen + gold: ba-soul wisps (one per Soul),
       mummies that rise from the sand and crumble back, golden scarabs, the Anubis shade, the scales of Ma'at, the Duat gate,
       warrior mummies, Ammit. C = its column: pages whirl, the shadow cat, Bastet's sun disc, the golden Bastet spirit,
       Sekhmet's red sun, Osiris's crook and flail.

   TIMING (gameplay never touched)
   · Every cast goes through bCast (buffAct): bCast is wrapped → power gathers at the hand for exactly the wind-up, a flash on
     the release frame (the frame the skill's own event runs).
   · Shots (pages, glyph seals, harvest ghosts, Apep, the locust storm) are DRAWN by the game's own BaHome / BaShot (subclassed,
     update untouched): the picture is where the collision is, so it touches the target on the hit frame.
   · Instant hits (Black Cat Omen, Soul Siphon pulses, Mummy's Wrap, the Anubis bite, Weighing, Doom, Osiris, Ammit) draw their
     piece already ON the target on the damage frame. The Pharaoh's eye and Sekhmet's sun are timed to the skills' own .35 s
     timers (the beams / the landing come from the damage itself: BaPillar is created inside those timers).
   · Hit sparks come from the damage (bHit is wrapped), never from a separate timer.
   HOW IT HOOKS IN: BaHome / BaShot / BaMinion are subclassed (draw + bookkeeping only); BaBeam / BaPillar are rebound to build the
   new pieces; bPow / bBurst are replaced (they only drew); BaGround / BaTop get new draw()s; BaCore.update is wrapped by a
   watcher (obelisk, swarms, veil, halo, avatar spirit …); mkBasic plays the cast clip (same timing as the axe swing it replaces).
   Old look off while her own code runs: GRing / Impact / round emits; HitCrescents / PuffDust / the weapon Trail always.
   ?vfx3=0 = the old look. Plan + per-skill table: BASTET_FX_PLAN_TH.md.
   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black ink shape behind so pale
   pieces read on snow; debris is shaped (papyrus scraps, linen strips, glyphs, locusts, gold shards), never round dots.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='bastet'||!window.K3||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {TAU,cl,eO,eI,eIO,back,lerp,R_,rt,scr,rgba,art,sprite,star,KGlint,KLine,KBurst,KRing,ring,KStreak,KArc,petals,embers,dust,stones,ensure,tint}=window.K3;
const V=window.VK,{sys,tx,G}=V,AR=window.KTA;
const BV=window.BAV={on:1};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('bastet');
/* palettes: [ink, deep, mid, lite, core] */
const SOUL=['#06303a','#1a9ab0','#6ae0ff','#c8f6ff','#ffffff'],HEX=['#1c0a36','#6a2aa8','#b06aff','#e4ccff','#ffffff'],
  GOLD=['#3a2206','#b8741a','#ffc23a','#ffe89a','#ffffff'],SAND=['#3a2a14','#a8874a','#e8d3a0','#fff6dc','#ffffff'],
  SUNR=['#3a0804','#b8200c','#ff5a3a','#ffc08a','#fff3d8'],SHADE=['#06030c','#3a1a5a','#8a5ad0','#d8c0ff','#ffffff'],
  GRN=['#0e2a14','#2a8a4a','#7ad88a','#d8ffd8','#ffffff'],LIFE=['#06301c','#1f9a5a','#8aff6a','#e0ffc8','#ffffff'],
  BRZ=['#2a1606','#8a4a14','#d8923a','#ffd8a0','#fff6e0'];
const SANDT='#fff0c8|#a8874a',SHADET='#9a7ac8|#140c20',SOULT='#d8fbff|#1a8aa0',HEXT='#d8b8ff|#3a1470';
const NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},active:false});
const zOf=e=>e?(e.boss?40:26)+(e.z||0):26;
const topZ=e=>e?(e.boss?72:52)*(e.sc||1)+(e.z||0):52;
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const later=(s,f)=>setFxTimer(s,f);                                  /* game clock: pauses with hit-stop, like the skills' own timers */
const at=(a,t,f)=>{a.events.push({t:Math.max(0,t),f});};            /* runs after the skill's own event at the same action time */
const first=(a,t,f)=>{a.events.unshift({t:Math.max(0,t),f});};      /* runs before it */
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__BATICK||window.__BASELF);
const self=f=>{const o=window.__BASELF;window.__BASELF=1;try{return f();}finally{window.__BASELF=o;}};
/* one particle system per layer and skill (an element gem on a skill tints its own particles only) */
const SC={};function S1(l='top'){const k=l+'|'+(window.SKCTX||'');let s=SC[k];if(!s||!s.p||!fx.includes(s))s=SC[k]=sys(l,.25);return s;}
const CS=()=>typeof CHAR_SCALE==='number'?CHAR_SCALE:1;
/* the hand (the placeholder sprite's weapon socket = the tome / staff head) and the top of her head */
const tip=()=>{const s=player.socket&&player.socket.w;return s&&isFinite(s[0])&&isFinite(s[2])?[s[0],s[1],s[2]]:[player.x+Math.cos(player.phi)*12,player.y+Math.sin(player.phi)*9,56+(player.z||0)];};
const headZ=()=>(player.z||0)+80*CS();
const nearAt=(x,y,r=36)=>{let b=null,d=r;for(const e of enemies){if(e.dead)continue;const q=Math.hypot(e.x-x,e.y-y);if(q<d){d=q;b=e;}}return b;};
const bA=k=>{const b=player.buffs&&player.buffs[k];if(!b)return 0;return cl((b.total-b.t)/.25,0,1)*cl(b.t/.4,0,1);};   /* a buff piece fades in .25 s, out over its last .4 s */

/* ---------------------------------------------------------------------
   1. SMALL PIECES
   --------------------------------------------------------------------- */
function glowAt(sx,sy,w,h,col,a){if(a<=.01||w<1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a);ctx.drawImage(tx('glow',col),sx-w/2,sy-h/2,w,h);ctx.restore();}
function orb(sx,sy,R,pal,t,a=1){if(R<.5||a<=0)return;ctx.save();ctx.globalAlpha=a*.28;ctx.drawImage(tx('glow',pal[0]),sx-R*2.2,sy-R*2.2,R*4.4,R*4.4);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.6;ctx.drawImage(tx('glow',pal[2]),sx-R*2.8,sy-R*2.8,R*5.6,R*5.6);ctx.globalAlpha=a;ctx.drawImage(tx('core',pal[3]),sx-R*1.25,sy-R*1.25,R*2.5,R*2.5);ctx.restore();
  ctx.save();ctx.globalAlpha=a;star(sx,sy,R*.95*(1+.12*Math.sin(t*28)),pal[2],t*1.6);ctx.restore();}
/* a ribbon through screen points q with half-widths w; layers [scale, colour, alpha] */
function band(q,w,tn){const n=q.length;if(n<2)return;const N=[];for(let i=0;i<n;i++){const a=q[Math.min(n-1,i+1)],b=q[Math.max(0,i-1)];const dx=a[0]-b[0],dy=a[1]-b[1],d=Math.hypot(dx,dy)||1;N.push([-dy/d,dx/d]);}
  for(const [s,c,al] of tn){if(al<=0)continue;ctx.globalAlpha=Math.min(1,al);ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<n;i++){const ww=w[i]*s;ctx.lineTo(q[i][0]+N[i][0]*ww,q[i][1]+N[i][1]*ww);}for(let i=n-1;i>=0;i--){const ww=w[i]*s;ctx.lineTo(q[i][0]-N[i][0]*ww,q[i][1]-N[i][1]*ww);}ctx.closePath();ctx.fill();}ctx.globalAlpha=1;}
/* a glowing ribbon: dark ink under it, then additive tones */
function rib(q,w,p,a=1){ctx.save();band(q,w,[[1.6,p[0],.32*a]]);ctx.globalCompositeOperation='lighter';band(q,w,[[1.15,p[1],.85*a],[.78,p[2],a],[.44,p[3],a],[.16,p[4],a]]);ctx.restore();}
/* a floating picture (glyphs, ankhs, souls …): sways, pops in, fades */
class Flo{constructor(o){Object.assign(this,{t:0,layer:'top',x:0,y:0,z:0,vx:0,vy:0,vz:30,dr:0,g:0,sw:4,fq:4,ph:R_(0,TAU),life:1,w:16,rot:0,spin:0,fi:.08,fo:.4,s0:.4,s1:1,pop:.2,a:1,delay:0,add:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.t<0)return true;const d=Math.exp(-this.dr*dt);this.vx*=d;this.vy*=d;this.vz=this.vz*d-this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;if(this.tick)this.tick(this,dt);return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1);if(a<.01)return;const s=this.s0+(this.s1-this.s0)*back(cl(t/this.pop,0,1)),sw=Math.sin(t*this.fq+this.ph),[x,y]=P(this.x,this.y,this.z);
    ctx.save();if(this.glow)glowAt(x+sw*this.sw,y,this.w*2.4*s,this.w*2.4*s,this.glow,.5*a);if(this.add)ctx.globalCompositeOperation='lighter';art(this.n,x+sw*this.sw,y,this.w*s,{a,rot:this.rot+this.spin*t+sw*.12,under:this.under,ua:this.ua});ctx.restore();}}
const flo=o=>addFx(new Flo(o));
/* a picture lying flat on the ground (rings, sigils): turns, grows, fades; until() ends it */
class Flat{constructor(o){Object.assign(this,{t:0,layer:'ground',n:'ringV',x:0,y:0,z:0,w:200,life:1,fi:.15,fo:.4,rot:0,spin:.4,s0:1,s1:1,a:1,delay:0,glow:null},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&!this._e&&!this.until()){this._e=1;this.life=Math.min(this.life,Math.max(0,this.t)+this.fo);}return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,k=cl(t/this.life,0,1),a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1);if(a<=.01)return;const s=this.s0+(this.s1-this.s0)*eO(k),[x,y]=P(this.x,this.y,this.z);
    if(this.glow)glowAt(x,y,this.w*s*1.25,this.w*s*1.25*K,this.glow,.35*a);ctx.save();art(this.n,x,y,this.w*s,{flat:1,rot:this.rot+this.spin*t,a:cl(a,0,1)});ctx.restore();}}
const flat=o=>addFx(new Flat(o));
/* a per-frame function with a life (spawners) */
class Fn{constructor(life,f){this.t=0;this.life=life;this.f=f;this.layer='none';}update(dt){this.t+=dt;try{this.f(this,dt);}catch(_){return false;}return this.t<this.life;}draw(){}}
const every=(life,f)=>addFx(new Fn(life,f));
/* light that flies from a point to the hero (souls, SP, heals coming home) */
class Mote{constructor(o){Object.assign(this,{t:0,layer:'top',life:.42,pal:SOUL,s:8,arc:30,z:30,pic:null},o);this.sd=R_(-1,1);}
  update(dt){this.t+=dt;if(this.t>=this.life){G.flare(S1(),player.x,player.y,headZ()*.6,30,this.pal[2],.16);return false;}return true;}
  draw(){const k=eIO(cl(this.t/this.life,0,1)),x=lerp(this.x,player.x,k)+Math.sin(Math.PI*k)*this.arc*this.sd,y=lerp(this.y,player.y,k),z=lerp(this.z,headZ()*.6,k)+Math.sin(Math.PI*k)*this.arc*.7,[sx,sy]=P(x,y,z),s=this.s*(1-.3*k);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(tx('core',this.pal[2]),sx-s,sy-s,s*2,s*2);if(!this.pic)ctx.drawImage(tx('star',this.pal[3]),sx-s*1.5,sy-s*1.5,s*3,s*3);ctx.restore();if(this.pic)art(this.pic,sx,sy,s*1.6,{a:1-k*.3});}}
const homeMotes=(x,y,z,n,pal=SOUL,pic=null)=>{for(let i=0;i<n;i++)addFx(new Mote({x,y,z,pal,pic,life:R_(.34,.52)}));};
/* power gathering at the hand for exactly the wind-up: motes (or little pictures) spiral in, an orb grows, a thin ring closes */
class Gather{constructor(o){Object.assign(this,{t:0,layer:'top',life:.6,R0:2,R1:9,pal:SOUL,n:14,src:tip,rad:42,orb:1,ring:1,pics:null},o);this.m=[];this.acc=0;}
  update(dt){this.t+=dt;const k=cl(this.t/this.life,0,1);this.p=this.src();this.acc+=dt*this.n*(.6+k);while(this.acc>=1){this.acc-=1;if(this.m.length<36)this.m.push({a:R_(0,TAU),r:this.rad*R_(.7,1.15),z:R_(-14,18),t:0,life:R_(.24,.38),s:R_(5,9),pic:this.pics?this.pics[(Math.random()*this.pics.length)|0]:null,ro:R_(-1,1)});}
    for(const q of this.m)q.t+=dt;this.m=this.m.filter(q=>q.t<q.life);return this.t<this.life;}
  draw(){const p=this.p||this.src();if(!p)return;const k=cl(this.t/this.life,0,1),[sx,sy]=P(p[0],p[1],p[2]),pal=this.pal;
    for(const q of this.m){const u=q.t/q.life,r=q.r*(1-eI(u)),x=sx+Math.cos(q.a+u*1.4)*r,y=sy+Math.sin(q.a+u*1.4)*r*.62-q.z*(1-u),s=q.s*(1-u*.5),al=Math.sin(Math.PI*u);
      if(q.pic){ctx.save();ctx.globalAlpha=al;art(q.pic,x,y,s*1.6,{rot:q.ro*u*2});ctx.restore();}else{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al;ctx.drawImage(tx('star',pal[2]),x-s/2,y-s/2,s,s);ctx.restore();}}
    if(this.orb)orb(sx,sy,this.R0+(this.R1-this.R0)*eO(k),pal,this.t,cl(this.t/.08,0,1));
    if(this.ring){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba(pal[3],.6*k);ctx.lineWidth=1.6;const rr=6+20*(1-k);ctx.beginPath();ctx.ellipse(sx,sy,rr*1.25,rr*.8,this.t*2,0,TAU);ctx.stroke();ctx.restore();}}}
const gather=o=>addFx(new Gather(o));
/* a beam of light between two world points (the Pharaoh's eye): wide at the source, white-hot core */
class Beam{constructor(o){Object.assign(this,{t:0,layer:'top',w:16,grow:.05,hold:.12,fade:.24,pal:HEX},o);this.life=this.grow+this.hold+this.fade;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,g=eO(cl(t/this.grow,0,1)),f=cl((t-this.grow-this.hold)/this.fade,0,1),p=this.pal,A=this.a,B=this.b,[x0,y0]=P(A[0],A[1],A[2]),[x1,y1]=P(lerp(A[0],B[0],g),lerp(A[1],B[1],g),lerp(A[2],B[2],g)),dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<3)return;
    const W=this.w*(1-f*.75)*(1+.06*Math.sin(t*60));ctx.save();ctx.translate(x0,y0);ctx.rotate(Math.atan2(dy,dx));
    const bd=(w,c,al)=>{ctx.globalAlpha=cl(al,0,1);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-w*.42);ctx.lineTo(L,-w*.5);ctx.quadraticCurveTo(L+w*.5,0,L,w*.5);ctx.lineTo(0,w*.42);ctx.quadraticCurveTo(-w*.35,0,0,-w*.42);ctx.fill();};
    bd(W*1.6,p[0],.3*(1-f));ctx.globalCompositeOperation='lighter';bd(W,p[1],.75*(1-f));bd(W*.66,p[2],.9*(1-f*.5));bd(W*.34,p[3],1-f*.4);bd(W*.12,'#ffffff',1-f*.3);ctx.restore();}}
/* a column of light from the sky; lands after `drop` s, then fades (Weighing, Osiris, the Ankh) */
class Pillar{constructor(o){Object.assign(this,{t:0,layer:'top',R:36,H:300,life:.7,drop:.08,pal:GOLD},o);}
  update(dt){this.t+=dt;if(!this._l&&this.t>=this.drop){this._l=1;if(this.land)this.land(this);}return this.t<this.life;}
  draw(){const t=this.t,d=eI(cl(t/this.drop,0,1)),f=cl((t-this.drop)/(this.life-this.drop),0,1),p=this.pal,[x,y]=P(this.x,this.y,0),top=y-this.H,bot=top+(y-top)*d,W=this.R*(t<this.drop?.6:1-f*.7);if(bot-top<2)return;
    ctx.save();const col=(w,c0,c1,al)=>{const g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,rgba(c0,0));g.addColorStop(.5,rgba(c0,al*.6));g.addColorStop(1,rgba(c1,al));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w*.32,top);ctx.lineTo(x+w*.32,top);ctx.lineTo(x+w*.5,bot);ctx.lineTo(x-w*.5,bot);ctx.closePath();ctx.fill();};
    col(W*1.4,p[0],p[0],.22*(1-f));ctx.globalCompositeOperation='lighter';col(W,p[1],p[2],.7*(1-f));col(W*.55,p[2],p[3],.9*(1-f));col(W*.2,'#ffffff','#ffffff',1-f);
    if(t>=this.drop){ctx.globalAlpha=1-f;const gs=W*2.4;ctx.drawImage(tx('glow',p[2]),x-gs,y-gs*.42,gs*2,gs*.84);}ctx.restore();}}
/* an upright tongue of curse fire / sun fire (Word of Doom, Sekhmet) — sorted layer, stands from the ground */
class FlameCol{constructor(o){Object.assign(this,{t:0,layer:'sorted',x:0,y:0,H:90,W:30,life:.6,pal:HEX,n:5,grow:.07},o);const m=(this.n/2)|0;this.f=Array.from({length:this.n},(_,i)=>({o:(i/(this.n-1)-.5)*.7+R_(-.06,.06),h:i===m?1:R_(.45,.75)*(1-Math.abs(i-m)/this.n*.6),w:i===m?.62:R_(.32,.46),ph:R_(0,TAU)}));this.f.sort((a,b)=>a.h-b.h);}
  get sy(){return this.y+1;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,g=eO(cl(t/this.grow,0,1)),f=cl((t-this.life*.4)/(this.life*.6),0,1),[x,y]=P(this.x,this.y,0),p=this.pal;if(f>=1)return;
    glowAt(x,y-this.H*.35,this.W*2.4,this.H*1.1,p[2],.22*(1-f));glowAt(x,y,this.W*2.6,this.W*.9,p[2],.3*(1-f));
    ctx.save();for(const [sc,c,al,add] of [[1.18,p[0],.62,0],[1,p[1],.96,0],[.72,p[2],.96,0],[.46,p[3],.8,1],[.22,p[4],.85,1]]){ctx.globalCompositeOperation=add?'lighter':'source-over';ctx.globalAlpha=al*(1-f);ctx.fillStyle=c;
      for(const q of this.f){const H=this.H*q.h*g*(1-f*.4)*(.6+.4*sc),W=this.W*q.w*sc*(1-f*.35),cx=x+q.o*this.W,sw=Math.sin(t*14+q.ph)*W*.45,b=y-W*.1;   /* a tongue: rounded base, sides that pull in, a tip that sways */
        ctx.beginPath();ctx.moveTo(cx-W*.5,b);ctx.bezierCurveTo(cx-W*.6,y-H*.36,cx-W*.16+sw*.5,y-H*.72,cx+sw,y-H);ctx.bezierCurveTo(cx+W*.16+sw*.5,y-H*.72,cx+W*.6,y-H*.36,cx+W*.5,b);ctx.quadraticCurveTo(cx,y+W*.3,cx-W*.5,b);ctx.closePath();ctx.fill();}}
    ctx.restore();}}
/* a thread between two world points with a wave running along it (curse threads, link casts) */
function threadLine(A,B,t,amp,a=1,pal=HEX,w0=1){const [x0,y0]=P(A[0],A[1],A[2]),[x1,y1]=P(B[0],B[1],B[2]),dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<2)return;const nx=-dy/L,ny=dx/L,N=Math.max(8,Math.round(L/9));
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';const path=()=>{ctx.beginPath();for(let i=0;i<=N;i++){const u=i/N,o=Math.sin(u*11-t*30)*amp*Math.sin(Math.PI*u),sag=Math.sin(Math.PI*u)*L*.06,x=x0+dx*u+nx*o,y=y0+dy*u+ny*o+sag;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}};
  ctx.globalAlpha=a*.45;ctx.strokeStyle=pal[0];ctx.lineWidth=4.6*w0;path();ctx.stroke();ctx.globalCompositeOperation='lighter';
  for(const [w,c,al] of [[3.4,pal[1],.55],[1.9,pal[2],.95],[.8,'#ffffff',.9]]){ctx.globalAlpha=a*al;ctx.strokeStyle=c;ctx.lineWidth=w*w0;path();ctx.stroke();}ctx.restore();}
/* screen point along that thread at u (for beads) */
function threadAt(A,B,u){const [x0,y0]=P(A[0],A[1],A[2]),[x1,y1]=P(B[0],B[1],B[2]),L=Math.hypot(x1-x0,y1-y0);return [lerp(x0,x1,u),lerp(y0,y1,u)+Math.sin(Math.PI*u)*L*.06];}

/* ---------------------------------------------------------------------
   2. DEBRIS — papyrus scraps, linen strips, glyphs, locusts, gold shards, sand and shadow smoke
   --------------------------------------------------------------------- */
function scraps(x,y,z,n,o={}){for(let i=0;i<qn2(n);i++)petals(x,y,z,1,Object.assign({im:'scrap'+(i%3),asp:1.2,s:.85,spd:80,up:90,term:.6,dk:'#6a5a3a',rest:.4},o));}
function linen(x,y,z,n,o={}){for(let i=0;i<qn2(n);i++)petals(x,y,z,1,Object.assign({im:'bandage',asp:8/36,s:2.3,spd:70,up:80,term:.7,dk:'#6a5430',rest:.5},o));}
function glyphs(x,y,z,n,o={}){const S=S1(o.layer||'top');for(let i=0;i<qn2(n);i++){const im=AR.get('glyph'+((Math.random()*5)|0));if(!im)return;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd==null?110:o.spd)*R_(.4,1);
  S.add({im,x:x+R_(-4,4),y:y+R_(-3,3),z:z+R_(-4,6),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up==null?80:o.up)*R_(.4,1.1),dr:2.2,s0:R_(10,15)*(o.s||1),s1:R_(4,7)*(o.s||1),life:R_(.45,.75)*(o.life||1),fo:.5,add:1,rot:R_(-.3,.3),vr:R_(-2,2),delay:o.delay?R_(0,o.delay):0});}}
function locustsOut(x,y,z,n,o={}){const S=S1();for(let i=0;i<qn2(n);i++){const im=AR.get('locust'+(i%2));if(!im)return;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||140)*R_(.5,1.1),lf=Math.cos(a)<0;
  S.add({im,asp:14/26,x,y,z:z+R_(-6,10),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(10,50),dr:.9,s0:R_(10,13),s1:R_(9,12),life:R_(.45,.8),fo:.4,rot:lf?Math.PI:0,sy:lf?-1:1});}}
function goldShards(x,y,z,n,o={}){const S=S1();for(let i=0;i<qn2(n);i++){const a=R_(0,TAU),v=(o.spd||170)*R_(.4,1);S.add({im:tx('shard',o.col||'#ffc23a',i%5),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||200)*R_(.4,1.1),g:760,dr:.7,s0:R_(6,10)*(o.s||1),s1:R_(5,8)*(o.s||1),life:R_(.5,.8),fo:.35,rot:R_(0,TAU),vr:R_(-14,14),bounce:.25});}}
const smoke=(x,y,z,n,t,size=50,o={})=>G.smoke(S1(o.layer||'top'),x,y,z,qn2(n),t,size,o.sp||40,o.life||.9,o.rise||20);
const PRE=.035;   /* pieces born on a hit start this far into their life, so they are lit while hit-stop freezes the frame */
function flare(x,y,z,size,col,life=.26){const S=S1();S.add({im:tx('star',col),x,y,z,s0:size*.3,s1:size,life,fo:.6,add:1,rot:R_(-.2,.2),delay:-PRE});S.add({im:tx('core',col),x,y,z,s0:size*.9,s1:size*1.3,life:life*.8,fo:.8,add:1,delay:-PRE});}
const twinkles=(x,y,z,n,R,col,life=.7)=>G.glints(S1(),x,y,z,qn2(n),R,col,life);
const sandDust=(x,y,n,o={})=>dust(x,y,qn2(n),Object.assign({tint:SANDT},o));
function motes(x,y,z,n,col,o={}){const S=S1(o.layer||'top');for(let i=0;i<qn2(n);i++){const a=R_(0,TAU),r=(o.R||20)*Math.sqrt(Math.random());S.add({im:tx(o.im||'core',col),x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.8,z:z+R_(-6,6),vx:R_(-10,10),vy:R_(-8,8),vz:(o.up||40)*R_(.5,1.2),dr:1,s0:(o.s||7)*R_(.7,1.2),s1:1.5,life:(o.life||.8)*R_(.6,1.2),fo:.6,add:1,delay:o.delay?R_(0,o.delay):0});}}
const glint=(e,col,s=16,life=.22,oz=0)=>addFx(new KGlint({x:e.x,y:e.y,e,z:zOf(e)+oz,s,col,life}));

/* ---------------------------------------------------------------------
   3. SHOTS — the game's BaHome (pages, glyph seals, harvest ghosts) and BaShot (Apep, the locust storm) keep their update
   --------------------------------------------------------------------- */
const BH0=BaHome;
BaHome=class extends BH0{constructor(o){super(o);this.v=this.col===BAC.hex?'glyph':this.speed===520?'ghost':'page';this.gold=this.v==='page'&&bAvatar();this.hist=[];this.acc=0;this.sp=R_(0,TAU);
    this.o3=this.v==='ghost'?[player.x,player.y,headZ()]:tip();const h=this.hit;this.hit=e=>{this._hit=1;return h?h(e):undefined;};}
  update(dt){const r=super.update(dt);try{homeTick(this,dt,r);}catch(e){}return r;}
  draw(){try{homeDraw(this);}catch(e){}}};
function hpos(b){const d=b.t*b.speed,w=eO(cl(d/70,0,1));return [lerp(b.o3[0],b.x,w),lerp(b.o3[1],b.y,w),lerp(b.o3[2],b.z,w)];}
function homeTick(b,dt,alive){const p=hpos(b);b.hist.push(p);if(b.hist.length>12)b.hist.shift();b.acc+=dt;
  if(b.v==='page'){if(b.acc>.028){b.acc=0;S1().add({im:tx('core',b.gold?'#ffd36a':'#6ae0ff'),x:p[0]+R_(-3,3),y:p[1]+R_(-3,3),z:p[2]+R_(-2,4),vz:R_(10,40),s0:R_(5,8),s1:1.5,life:R_(.2,.34),fo:.6,add:1});}}
  else if(b.v==='glyph'){if(b.acc>.045){b.acc=0;const im=AR.get('glyph'+((Math.random()*5)|0));if(im)S1().add({im,x:p[0]+R_(-4,4),y:p[1]+R_(-3,3),z:p[2],vz:R_(-10,20),s0:10,s1:3,life:.36,fo:.6,add:1,rot:R_(-.4,.4)});}}
  else if(b.acc>.03){b.acc=0;S1().add({im:tx('core','#6ae0ff'),x:p[0],y:p[1],z:p[2],vz:R_(-10,10),s0:9,s1:2,life:.32,fo:.6,add:1});}
  if(!alive&&!b._done){b._done=1;if(!b._hit){flare(p[0],p[1],p[2],34,b.v==='glyph'?'#b06aff':'#6ae0ff',.2);if(b.v==='page')scraps(p[0],p[1],p[2],3,{spd:60,up:60});}}}
function homeDraw(b){const p=hpos(b),[sx,sy]=P(p[0],p[1],p[2]),t=b.t,h=b.hist,a=cl(t/.04,0,1),pal=b.v==='glyph'?HEX:b.gold?GOLD:SOUL,R=b.v==='page'?7:b.v==='ghost'?9:8;
  if(h.length>2){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=1;i<h.length;i++){const u=i/h.length,[ax,ay]=P(h[i-1][0],h[i-1][1],h[i-1][2]),[bx,by]=P(h[i][0],h[i][1],h[i][2]);
      ctx.globalAlpha=u*.75*a;ctx.strokeStyle=pal[2];ctx.lineWidth=R*1.5*u;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.strokeStyle=pal[4];ctx.lineWidth=R*.42*u;ctx.stroke();}ctx.restore();}
  if(b.v==='page'){glowAt(sx,sy,R*6.4,R*6.4,pal[2],.6*a);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.75*a;ctx.drawImage(tx('core',pal[2]),sx-R*1.3,sy-R*1.3,R*2.6,R*2.6);ctx.restore();
    const fl=Math.cos(t*16+b.sp);art(b.gold?'pageG':'page',sx,sy,15,{rot:Math.sin(t*9+b.sp)*.45+b.sp*.3,sx:.3+.7*Math.abs(fl),a,under:'#06303a',ua:.3});return;}
  if(b.v==='glyph'){glowAt(sx,sy,R*6.6,R*6.6,'#9a4aff',.6*a);art('seal',sx,sy,22,{rot:t*3,a,under:'#1c0a36',ua:.3});return;}
  const q=h[Math.max(0,h.length-4)]||b.o3,[qx,qy]=P(q[0],q[1],q[2]),ang=Math.atan2(sy-qy,sx-qx);glowAt(sx,sy,R*5.4,R*5.4,'#2ad0e8',.6*a);art('ghost',sx,sy,20,{rot:ang+Math.PI/2,a});}
/* Apep and the locust storm */
class ApepTrail{constructor(s){this.s=s;this.layer='ground';this.pts=[];this.t=0;this.acc=0;}
  update(dt){this.t+=dt;const s=this.s;if(!s._dead){this.acc+=dt;if(this.acc>.016){this.acc=0;this.pts.push([s.x,s.y,this.t]);}}this.pts=this.pts.filter(p=>this.t-p[2]<1.1);return this.pts.length>0||!s._dead;}
  draw(){const n=this.pts.length;if(n<2)return;const q=[],w=[];for(const p of this.pts){const [x,y]=P(p[0],p[1],0),age=(this.t-p[2])/1.1;q.push([x,y]);w.push(9*(1-age));}
    ctx.save();band(q,w.map(v=>v*.55),[[1.3,'#1c0a36',.22]]);ctx.globalCompositeOperation='lighter';band(q,w.map(v=>v*.4),[[1,'#6a2aa8',.4],[.4,'#b06aff',.5]]);ctx.restore();}}
const BS0=BaShot;
BaShot=class extends BS0{constructor(o){super(o);this.acc=0;this.sp=R_(0,TAU);const h=this.hit;this.hit=e=>{this._hit=1;return h?h(e):undefined;};
    if(this.kind==='storm')this.loc=Array.from({length:qn2(16)},(_,i)=>({a:R_(0,TAU),r:R_(.3,1.15),h:R_(6,64),va:R_(5,9),f:R_(0,1)}));else addFx(new ApepTrail(this));}
  update(dt){const r=super.update(dt);try{shotTick(this,dt,r);}catch(e){}return r;}
  draw(){try{this.kind==='storm'?stormDraw(this):snakeDraw(this);}catch(e){}}};
function shotTick(s,dt,alive){s.acc+=dt;
  if(s.kind==='storm'){if(s.acc>.04){s.acc=0;sandDust(s.x-Math.cos(s.phi)*16,s.y-Math.sin(s.phi)*12,1,{size:44,spd:40,life:.7,dir:s.phi+Math.PI,spread:.9,a:.6});if(Math.random()<.4)locustsOut(s.x,s.y,30,1,{spd:90,dir:s.phi+Math.PI,spread:1.2});}}
  else if(s.acc>.05){s.acc=0;if(Math.random()<.5)smoke(s.x-Math.cos(s.phi)*20,s.y-Math.sin(s.phi)*16,6,1,SHADET,26,{sp:12,life:.6,rise:10});}
  if(!alive&&!s._dead){s._dead=1;if(s.kind==='storm'){sandDust(s.x,s.y,6,{ring:10,size:52,spd:80,life:.8});locustsOut(s.x,s.y,30,8,{spd:150});}
    else if(!bL('bcApep')){smoke(s.x,s.y,6,4,SHADET,40,{sp:30,life:.7});ring({x:s.x,y:s.y,r0:6,r1:40,life:.35,w:4,pal:HEX,segs:3,gap:.3});glyphs(s.x,s.y,10,4,{spd:60,up:70});}}}
function snakeDraw(s){const t=s.t,d=s.d,L=Math.min(150,d),c=Math.cos(s.phi),sn=Math.sin(s.phi),q=[],w=[],N=24;if(L<4)return;
  for(let i=0;i<=N;i++){const u=i/N,dd=u*L,amp=8*Math.min(1,dd/26)*(1-u*.35),off=Math.sin(dd*.085-t*20)*amp,x=s.x-c*dd-sn*off,y=s.y-sn*dd+c*off,[px,py]=P(x,y,7-u*3);q.push([px,py]);w.push((8.5*(1-Math.pow(u,1.4)*.85)+1.4));}
  const [hx,hy]=q[0];glowAt(hx,hy,90,46,'#7a3ae0',.42);
  ctx.save();band(q,w,[[1.35,'#06030c',.55],[1,'#1c0a32',1],[.62,'#3a1a5a',1]]);ctx.globalCompositeOperation='lighter';
  const sp=q.map((p,i)=>[p[0],p[1]-w[i]*.35]);band(sp,w.map(v=>v*.22),[[1,'#9a5ae0',.8],[.4,'#e4ccff',.7]]);
  for(let i=2;i<N;i+=2){const [x,y]=q[i];ctx.globalAlpha=.7;ctx.drawImage(tx('star','#b06aff'),x-4,y-4-w[i]*.2,8,8);}ctx.restore();
  const a=scr(s.phi),lf=Math.cos(a)<0;art('apepH',hx+Math.cos(a)*6,hy+Math.sin(a)*6-3,36,{rot:lf?a-Math.PI:a,sx:lf?-1:1,under:'#06030c',ua:.4});}
function stormDraw(s){const t=s.t,[x,y]=P(s.x,s.y,0),R=s.w,k=cl(t/.12,0,1);
  ctx.save();ctx.globalAlpha=.3*k;ctx.fillStyle='#2a1a0a';ctx.beginPath();ctx.ellipse(x,y,R*1.3,R*.42,0,0,TAU);ctx.fill();ctx.restore();
  glowAt(x,y-34,R*3,R*3.4,'#7a3ae0',.25*k);
  /* the funnel: tilted rings of sand that widen upward and turn (each ring: back half dim, front half bright) */
  const rings=[[6,R*.45],[20,R*.7],[36,R*.95],[54,R*1.15],[72,R*1.3]];
  const loc=s.loc.map(o=>{const a=o.a+o.va*t,r=o.r*R,zz=o.h+Math.sin(t*4+o.f*6)*6,[lx,ly]=P(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r*.75,zz);return {lx,ly,f:Math.sin(a),lf:-Math.sin(a)<0?1:0,fr:((t*22+o.f*4)|0)%2};});
  const drawRing=(front)=>{for(const [z,r] of rings){const [cx,cy]=P(s.x,s.y,z),s0=t*7+z*.08;ctx.save();ctx.lineCap='round';for(let j=0;j<3;j++){const a0=s0+j*TAU/3,a1=a0+1.5;
      const seg=front?[Math.max(a0,0),Math.min(a1,Math.PI)]:null;ctx.globalAlpha=(front?.85:.4)*k;ctx.strokeStyle=front?'#e8d3a0':'#a8874a';ctx.lineWidth=front?5:4;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.34,0,a0,a1);ctx.stroke();
      if(front){ctx.globalAlpha=.7*k;ctx.strokeStyle='#fff6dc';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.34,0,a0+.3,a1-.2);ctx.stroke();}}ctx.restore();}};
  drawRing(false);for(const l of loc)if(l.f<0)art('locust'+l.fr,l.lx,l.ly,11,{sx:l.lf?-1:1,a:.75*k});
  drawRing(true);for(const l of loc)if(l.f>=0)art('locust'+l.fr,l.lx,l.ly,13,{sx:l.lf?-1:1,a:k});}

/* ---------------------------------------------------------------------
   4. INSTANT PIECES — BaBeam and BaPillar are rebound (the game creates them on the damage frame)
   --------------------------------------------------------------------- */
BaBeam=function(o){try{beamFx(o);}catch(e){console.warn('bastet beam',e);}return NOFX();};
function beamFx(o){const c=o.col,w=o.w||8,x0=o.x,y0=o.y,L=o.L||0,x1=x0+Math.cos(o.phi)*L,y1=y0+Math.sin(o.phi)*L;
  if(c===BAC.hex)return hexHop([x0,y0],[x1,y1]);
  if(c===BAC.soul)return addFx(new SoulStream({a:[x0,y0],life:o.life||.3}));
  if(c===BAC.sand)return addFx(new LinenLine({A:tip(),src:tip,e:nearAt(x1,y1,40),B:[x1,y1,30],life:.3,glyph:1}));
  if(c===BAC.gold)return scarabDive([x0,y0],[x1,y1]);
  if(c===BAC.dark){if(w>=7)return catPounce(nearAt(x1,y1,40),[x1,y1]);return jackalJump([x0,y0],[x1,y1]);}}
/* the curse passes on: a glyph hops from the dead enemy to the next */
function hexHop(A,B){const e=nearAt(B[0],B[1],40);flo({n:'glyph'+((Math.random()*5)|0),x:A[0],y:A[1],z:40,vz:0,w:16,life:.34,fo:.1,s0:.6,s1:1,pop:.1,add:1,glow:'#9a4aff',tick:(f)=>{const u=cl(f.t/.3,0,1),bx=e&&!e.dead?e.x:B[0],by=e&&!e.dead?e.y:B[1];f.x=lerp(A[0],bx,u);f.y=lerp(A[1],by,u);f.z=40+Math.sin(Math.PI*u)*46;f.vz=0;}});
  later(.3,()=>{if(e&&!e.dead){flare(e.x,e.y,topZ(e),40,'#b06aff',.22);glint(e,'#e4ccff',14,.2,20);}});}
/* the black cat of the omen: it has already leapt — a shadow streak behind it, the cat on the target, three claw cuts */
function catPounce(e,B){if(!e)return;const x=e.x,y=e.y,z=zOf(e),ph=Math.atan2(y-player.y,x-player.x),lf=Math.cos(ph)<0;
  addFx(new KStreak({a:[player.x,player.y],b:[x,y],z:26,w:4.5,life:.18,pal:['#06030c','#1c0a32','#4a2a7a','#9a6ae0','#d8c0ff'],ink:.45}));
  glowAt0(x,y,90,'#7a3ae0',.5);sprite({n:'catL',x:x-Math.cos(ph)*14,y:y-Math.sin(ph)*10,z:z+12,w:52,life:.34,fi:.01,fo:.2,s0:1.15,s1:1,pop:.12,sx:lf?-1:1,rot:lf?.18:-.18,under:'#06030c',ua:.3,tick:(f,dt)=>{f.x+=Math.cos(ph)*30*dt;f.z-=10*dt;}});
  const base=R_(-.4,.4);for(let i=0;i<3;i++)addFx(new KLine({x:x+(i-1)*7,y,e,ox:(i-1)*7,z:z+4+(i-1)*3,ang:1.05+base,L:34,w:2.6,grow:.04,hold:.06,fade:.16,pal:SHADE,ink:.5,delay:i*.02}));
  smoke(x,y,z,3,SHADET,32,{sp:40,life:.55});}
/* the Anubis shade leaps from one enemy to the next: a shadow dash with two afterimages */
function jackalJump(A,B){const ph=Math.atan2(B[1]-A[1],B[0]-A[0]),lf=Math.cos(ph)<0;addFx(new KStreak({a:A,b:B,z:18,w:7,life:.2,pal:SHADE,ink:.45}));
  for(let i=1;i<=2;i++){const u=i/3;sprite({n:'jackal',x:lerp(A[0],B[0],u),y:lerp(A[1],B[1],u),z:0,w:46,ay:.95,life:.2,fi:.01,fo:.18,a:.45,sx:lf?-1:1,layer:'top'});}
  smoke(A[0],A[1],10,2,SHADET,30,{sp:20,life:.5});}
/* a golden scarab dives at the nearest enemy and bursts */
function scarabDive(A,B){const ph=Math.atan2(B[1]-A[1],B[0]-A[0]);addFx(new KStreak({a:A,b:B,z:26,w:5,life:.18,pal:GOLD,ink:.35}));
  sprite({n:'scarabC',x:B[0]-Math.cos(ph)*8,y:B[1]-Math.sin(ph)*6,z:26,w:16,life:.12,fi:.01,fo:.08,rot:scr(ph)+Math.PI/2});}
/* soul siphon: a turquoise stream from the enemy into her hand; three wisps run along it */
class SoulStream{constructor(o){Object.assign(this,{t:0,layer:'top',life:.3},o);this.ph=R_(0,TAU);this.e=nearAt(this.a[0],this.a[1],40);}
  update(dt){this.t+=dt;return this.t<this.life+.14;}
  draw(){const t=this.t,k=cl(t/this.life,0,1),f=cl((t-this.life)/.14,0,1),e=this.e,A=e&&!e.dead?[e.x,e.y,zOf(e)]:[this.a[0],this.a[1],26],B=tip(),N=18,q=[],w=[];
    for(let i=0;i<=N;i++){const u=i/N,x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u),z=lerp(A[2],B[2],u)+Math.sin(Math.PI*u)*20,[sx,sy]=P(x,y,z),o=Math.sin(u*9-t*28+this.ph)*5*Math.sin(Math.PI*u);q.push([sx,sy+o]);w.push((2.2+1.6*Math.sin(Math.PI*u))*(1-f));}
    rib(q,w,SOUL,.85*(1-f));
    for(let j=0;j<3;j++){const u=cl(k*1.3-j*.2,0,1);if(u<=0||u>=1)continue;const [sx,sy]=q[Math.round(u*N)];glowAt(sx,sy,22,22,'#2ad0e8',.6*(1-f));art('soul',sx,sy,10,{a:1-f});}}}
/* a linen bandage (Mummy's Wrap / Bandage Lash): already stretched to the target on the damage frame, then winds onto it */
class LinenLine{constructor(o){Object.assign(this,{t:0,layer:'top',life:.3,w:3.4,glyph:0},o);this.ph=R_(0,TAU);if(this.e)this.B=[this.e.x,this.e.y,zOf(this.e)];}
  update(dt){this.t+=dt;if(this.e&&!this.e.dead)this.B=[this.e.x,this.e.y,zOf(this.e)];if(this.src)this.A=this.src();return this.t<this.life;}
  draw(){const k=cl(this.t/this.life,0,1),u0=eI(k)*.94,A=this.A,B=this.B,N=16,q=[],w=[];
    for(let i=0;i<=N;i++){const u=u0+(1-u0)*i/N,x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u),z=lerp(A[2],B[2],u)+Math.sin(Math.PI*u)*12*(1-k),[sx,sy]=P(x,y,z),o=Math.sin(u*12-this.t*26+this.ph)*3*(1-u);q.push([sx,sy+o]);w.push(this.w*(1-.3*u));}
    band(q,w,[[1.55,'#3a2a14',.35],[1.15,'#a8874a',1],[.8,'#e8d3a0',1],[.38,'#fffaf0',.9]]);
    if(this.glyph){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=2;i<N;i+=3){const [x,y]=q[i];ctx.globalAlpha=.85;ctx.drawImage(tx('star','#b06aff'),x-5,y-5,10,10);}ctx.restore();}}}
/* loops of linen round a rooted enemy (Mummy's Wrap); stay while it is held, then fall off */
class Wraps{constructor(e){this.e=e;this.t=0;this.layer='top';this.end=null;this.ph=R_(0,TAU);this.cap=(e.boss?BB.baWrap.root*1.5:BB.baWrap.root)+.1;}
  update(dt){this.t+=dt;const e=this.e,held=e&&!e.dead&&this.t<this.cap&&((e.st&&e.st.root>0)||e.boss);if(!held&&this.end==null){this.end=this.t;try{if(e)linen(e.x,e.y,zOf(e),4,{spd:80,up:70});}catch(_){}}return this.end==null||this.t-this.end<.22;}
  draw(){const e=this.e;if(!e)return;const k=eO(cl(this.t/.16,0,1)),f=this.end==null?0:cl((this.t-this.end)/.22,0,1),[x,y]=P(e.x,e.y,0),H=zOf(e)*1.8,r=e.r+4;if(f>=1)return;
    ctx.save();ctx.lineCap='round';for(let i=0;i<3;i++){const yy=y-H*(.2+.26*i),rot=(i%2?.22:-.22)+Math.sin(this.t*3+i)*.04,rr=lerp(r+28,r,k)*(1+f*.4),a=1-f;
      for(const [lw,c,al,fr] of [[6.4,'#3a2a14',.35,0],[4.6,'#a8874a',1,0],[3,'#e8d3a0',1,0],[1.2,'#fffaf0',.9,0]]){ctx.globalAlpha=al*a;ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(x,yy,rr,rr*.32,rot,.05,Math.PI-.05);ctx.stroke();}
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.8*a;ctx.drawImage(tx('star','#b06aff'),x-5+Math.cos(this.t+i)*rr*.5,yy+rr*.28-5,10,10);ctx.globalCompositeOperation='source-over';}
    ctx.restore();}}
BaPillar=function(o){try{pillarFx(o);}catch(e){console.warn('bastet pillar',e);}return NOFX();};
function pillarFx(o){const c=o.col,w=o.w||14,x=o.x,y=o.y,life=o.life||.35;
  if(c===BAC.gold&&w<=32)return weighing(x,y);
  if(c===BAC.gold)return judgment(x,y);
  if(c===BAC.hex2)return apepRise(x,y);
  if(c===BAC.hex&&w<=20&&life<.38)return eyeBeam(x,y);
  if(c===BAC.hex)return doomFlame(x,y,w);
  if(c===BAC.red)return sunLand(x,y);
  if(c==='#3aa860')return ammitRise(x,y);}
/* Weighing of the Heart: the scales of Ma'at come down over the bitten enemy, a gold column judges it */
function weighing(x,y){const e=nearAt(x,y,40),z=e?topZ(e)+30:80;addFx(new Pillar({x,y,R:30,H:320,life:.62,drop:.06,pal:GOLD}));
  sprite({n:'scales',x,y,z:z+24,w:56,life:.95,fi:.04,fo:.3,s0:.4,s1:1,pop:.18,under:'#3a2206',ua:.3,tick:f=>{f.z=z+24*(1-eO(cl(f.t/.16,0,1)))+2*Math.sin(f.t*6);f.rot=Math.sin(f.t*9)*.12*(1-cl(f.t/.7,0,1));}});
  flare(x,y,z,90,'#ffe08a',.3);twinkles(x,y,z-10,8,26,'#fff3c0',.7);ring({x,y,r0:8,r1:46,life:.4,w:5,pal:GOLD,segs:4,gap:.25});
  flo({n:'feather',x:x+8,y,z:z+10,vz:-14,vx:10,w:10,life:1.1,sw:6,fq:3});}
/* Judgment of Osiris: a gold column on each servant, the crook and flail over it */
function judgment(x,y){addFx(new Pillar({x,y,R:40,H:340,life:.66,drop:.06,pal:GOLD,land:p=>{ring({x,y,r0:10,r1:BB.bcOsiris.R,life:.45,w:7,pal:GOLD,segs:4,gap:.2});sandDust(x,y,5,{ring:12,size:44,spd:80,life:.7});}}));
  sprite({n:'osiris',x,y,z:96,w:40,life:.8,fi:.04,fo:.3,s0:.3,s1:1,pop:.2,under:'#14246a',ua:.3});flare(x,y,40,110,'#c8ff9a',.3);flare(x,y,20,80,'#ffe08a',.3);twinkles(x,y,30,8,40,'#e8ffc8',.8);}
/* Apep Awakens: the giant cobra bursts out of the ground at the end of the line and bites */
function apepRise(x,y){const R=BB.bcApep.R;sprite({n:'apepBig',layer:'sorted',x,y,z:0,w:76,ay:.985,life:.75,fi:.02,fo:.3,under:'#06030c',ua:.3,
    tick:f=>{f.sy2=f.t<.1?eO(f.t/.1)*1.08:f.t<.5?1.08-.08*eO((f.t-.1)/.1):1-eI(cl((f.t-.5)/.25,0,1));f.y=y+(f.t<.16?Math.sin(f.t/.16*Math.PI)*-4:0);}});
  glowAt0(x,y,120,'#7a3ae0',.8);ring({x,y,r0:10,r1:R+16,life:.45,w:8,pal:HEX,segs:5,gap:.18});addFx(new KBurst({x,y,z:30,R:56,n:11,life:.3,pal:SHADE,ink:.5}));
  stones(x,y,6,{spd:180});smoke(x,y,6,6,SHADET,56,{sp:60,life:1});glyphs(x,y,30,6,{spd:130,up:120});shakeSoft(1.2);}
const glowAt0=(x,y,w,col,a)=>sprite({layer:'top',x,y,z:0,life:.5,fi:.02,fo:.4,paint:(f,sx,sy,s,al)=>glowAt(sx,sy,w,w*.55,col,a*al)});
const shakeSoft=v=>{try{if(typeof shake==='function')shake(v);}catch(_){}};
/* the Pharaoh's eye: a beam from the eye in the sky to each enemy */
function eyeBeam(x,y){const e=nearAt(x,y,40),E=BV.eye||[player.x,player.y,210],z=e?zOf(e):26;addFx(new Beam({a:E,b:[x,y,z],w:15,pal:HEX,grow:.04,hold:.1,fade:.22}));
  flare(x,y,z,90,'#e4ccff',.3);addFx(new KBurst({x,y,z,R:40,n:9,life:.26,pal:HEX,ink:.5}));sprite({n:'cartouche',x,y,z:(e?topZ(e):52)+22,w:16,life:.7,fi:.03,fo:.3,s0:.3,s1:1,pop:.16,under:'#1c0a36',ua:.3});}
/* Word of Doom: violet curse fire erupts from each cursed enemy, bigger with more stacks */
function doomFlame(x,y,w){const n=cl((w-24)/4,1,8);addFx(new FlameCol({x,y,H:70+n*12,W:20+n*3,life:.62,pal:HEX,n:5}));ring({x,y,r0:6,r1:26+n*5,life:.38,w:5,pal:HEX,segs:3,gap:.3});glyphs(x,y,40,2+n,{spd:90,up:150,s:1.1});smoke(x,y,10,3,HEXT,40,{sp:30,life:.8,rise:40});}
/* Sekhmet's sun lands: fire burst, a scorched sun ring, embers */
function sunLand(x,y){const R=BB.bcSekhmet.R;BV.sunHit=gameTime;addFx(new FlameCol({x,y,H:130,W:46,life:.7,pal:SUNR,n:6}));flare(x,y,20,220,'#ffb04a',.4);addFx(new KBurst({x,y,z:24,R:90,n:14,life:.34,pal:SUNR,ink:.45}));
  ring({x,y,r0:14,r1:R+20,life:.5,w:10,pal:SUNR,segs:5,gap:.15});ring({x,y,r0:8,r1:R*.6,life:.4,w:5,pal:GOLD,segs:4,gap:.25,delay:.05});
  flat({n:'ringR',x,y,w:R*2.1,life:1.6,fi:.04,fo:.9,spin:.3,a:.9,glow:'#ff5a3a'});addFx(new Scorch({x,y,R:R*.85}));
  embers(x,y,20,12,{spd:220,up:240,c:['#fff3d8','#ffb04a','#b8200c']});smoke(x,y,10,7,'#ffc08a|#5a1a0a',70,{sp:70,life:1.1,rise:30});stones(x,y,5,{spd:200});}
class Scorch{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.8,R:120},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=cl(this.t/.05,0,1)*cl((this.life-this.t)/.8,0,1),[x,y]=P(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,this.R);
    g.addColorStop(0,rgba('#ffb04a',.5*a));g.addColorStop(.3,rgba('#5a1a0a',.55*a));g.addColorStop(.85,rgba('#2a0a04',.3*a));g.addColorStop(1,rgba('#2a0a04',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();ctx.restore();}}
/* Ammit's Feast: the devourer bursts out of the sand at the army's centre and snaps */
function ammitRise(x,y){const R=BB.bbAmmit.R;sprite({n:'ammit',layer:'sorted',x,y,z:0,w:100,ay:.97,life:.9,fi:.02,fo:.3,under:'#0e2a14',ua:.3,
    tick:f=>{f.sy2=f.t<.1?eO(f.t/.1)*1.1:f.t<.22?1.1-.1*eO((f.t-.1)/.12):f.t<.62?1:1-eI(cl((f.t-.62)/.28,0,1));f.sx=f.t>.12&&f.t<.24?.82:1;}});
  flare(x,y,40,160,'#9aff8a',.34);flare(x,y,20,120,'#ffd36a',.3);ring({x,y,r0:14,r1:R+20,life:.5,w:9,pal:GRN,segs:5,gap:.15});ring({x,y,r0:10,r1:R*.6,life:.4,w:5,pal:GOLD,segs:4,gap:.25,delay:.06});
  sandDust(x,y,8,{ring:20,size:60,spd:110,life:.9});stones(x,y,7,{spd:220});later(.25,()=>{for(let i=0;i<3;i++)addFx(new Mote({x,y,z:50,pal:SOUL,pic:'soul',s:9,life:R_(.45,.6)}));});}

/* ---------------------------------------------------------------------
   5. BURSTS — bBurst / bPow are replaced (they only drew); which burst it is comes from its colour and the skill running
   --------------------------------------------------------------------- */
bPow=function(){};
bBurst=function(x,y,R,col){try{burstFx(x,y,R,col);}catch(e){console.warn('bastet burst',e);}};
function burstFx(x,y,R,col){const k=window.SKCTX||'';
  if(col==='#fff4dc')return addFx(new PageWhirl({x,y,R}));
  if(col===BAC.dark)return shadowBoom(x,y,R);
  if(col==='#8a7a3a')return locustCast(x,y,R);
  if(col===BAC.hex2||col==='#3aa860'||col===BAC.red)return;              /* drawn by apepRise / ammitRise / sunLand */
  if(col===BAC.hex&&R>=200)return pharaohRing(x,y,R);
  if(col===BAC.hex)return doomWord(x,y);
  if(col===BAC.sand)return lashBurst(x,y,R);
  if(col===BAC.soul&&R>=50)return soulBurst(x,y,R);
  if(col===BAC.soul)return gateFlash(x,y);
  if(col===BAC.gold&&R>=120)return avatarBurst(x,y,R);
  if(col===BAC.gold){if(k==='bcOsiris')return;return window.__ACTEV?lordRise(x,y,R):lordSlam(x,y,R);}}
/* Nine Pages: nine burning pages whirl out round her */
class PageWhirl{constructor(o){Object.assign(this,{t:0,layer:'top',life:.5},o);this.n=9;this.ph=R_(0,TAU);this.gold=bAvatar();
    ring({x:this.x,y:this.y,r0:16,r1:this.R+10,life:.42,w:6,pal:this.gold?GOLD:SOUL,segs:5,gap:.18});flare(this.x,this.y,40,110,'#c8f6ff',.3);}
  update(dt){this.t+=dt;if(this.t>=this.life&&!this._s){this._s=1;for(let i=0;i<this.n;i+=2){const a=this.ph+i*TAU/this.n+this.t*7;scraps(this.x+Math.cos(a)*this.R,this.y+Math.sin(a)*this.R*.8,30,1,{spd:40,up:40});}}return this.t<this.life;}
  draw(){const t=this.t,k=eO(cl(t/.32,0,1)),a=1-cl((t-.34)/.16,0,1);for(let i=0;i<this.n;i++){const an=this.ph+i*TAU/this.n+t*7,r=lerp(14,this.R,k),[sx,sy]=P(this.x+Math.cos(an)*r,this.y+Math.sin(an)*r*.8,32+Math.sin(an*2+t*6)*8);
      glowAt(sx,sy,40,40,this.gold?'#ffc23a':'#2ad0e8',.55*a);art(this.gold?'pageG':'page',sx,sy,14,{rot:an+t*6,sx:.4+.6*Math.abs(Math.cos(t*14+i)),a});}}}
/* the shadow cat explodes */
function shadowBoom(x,y,R){flare(x,y,24,120,'#b07aff',.3);addFx(new KBurst({x,y,z:24,R:R*.7,n:11,life:.3,pal:SHADE,ink:.55}));ring({x,y,r0:10,r1:R+10,life:.42,w:8,pal:SHADE,segs:4,gap:.22});
  smoke(x,y,14,8,SHADET,60,{sp:70,life:1});for(let i=0;i<4;i++){const a=i*TAU/4+R_(-.3,.3);addFx(new KLine({x:x+Math.cos(a)*R*.4,y:y+Math.sin(a)*R*.32,z:16,ang:a+1.2,L:30,w:2.4,grow:.04,hold:.06,fade:.18,pal:SHADE,ink:.5,delay:i*.03}));}}
/* the plague lands: a dark cloud bursts, locusts spill out (then the swarm takes over) */
function locustCast(x,y,R){smoke(x,y,20,8,'#8a7a5a|#2a1a10',70,{sp:70,life:1.1,rise:16});locustsOut(x,y,30,14,{spd:170});ring({x,y,r0:10,r1:R+10,life:.42,w:6,pal:HEX,segs:4,gap:.22});flare(x,y,24,80,'#b06aff',.26);}
/* Curse of the Pharaoh: a violet hieroglyph ring sweeps the whole area */
function pharaohRing(x,y,R){flat({n:'ringV',x,y,w:R*2.1,life:1,fi:.04,fo:.6,s0:.3,s1:1,spin:.5,a:.8});ring({x,y,r0:30,r1:R,life:.5,w:10,pal:HEX,segs:6,gap:.12});
  smoke(x,y,10,8,HEXT,70,{sp:120,life:1,rise:20,layer:'ground'});glyphs(x,y,40,12,{spd:220,up:100});}
/* Word of Doom: the spoken word rolls out from her as a ring of hieroglyphs */
function doomWord(x,y){const R=BB.baDoom.R;flat({n:'ringV',x,y,w:60,life:.5,fi:.03,fo:.32,s0:.4,s1:R*2.1/60,spin:1.2,a:.6});ring({x,y,r0:20,r1:R,life:.42,w:6,pal:HEX,segs:6,gap:.14});
  flare(x,y,40,100,'#e4ccff',.3);sprite({n:'cartouche',x,y,z:headZ()+26,follow:player,w:22,life:.6,fi:.03,fo:.3,s0:.3,s1:1,pop:.14,under:'#1c0a36',ua:.3});
  for(let i=0;i<16;i++){const a=i*TAU/16;flo({n:'glyph'+(i%5),x:x+Math.cos(a)*20,y:y+Math.sin(a)*16,z:30,vx:Math.cos(a)*R*1.6,vy:Math.sin(a)*R*1.2,vz:0,dr:2.4,w:14,life:.5,fo:.25,s0:.5,s1:1,pop:.1,add:1});}}
/* Bandage Lash: linen strips lash out from the mummy and snap back */
function lashBurst(x,y,R){const L=bNear(x,y,R+30);for(const e of L)addFx(new LinenLine({A:[x,y,34],e,life:.26,w:3}));
  for(let i=0;i<6;i++){const a=i*TAU/6+R_(-.2,.2);addFx(new LinenLine({A:[x,y,34],B:[x+Math.cos(a)*R,y+Math.sin(a)*R*.8,20],life:.24,w:2.6}));}
  ring({x,y,r0:10,r1:R,life:.35,w:5,pal:SAND,segs:4,gap:.25});sandDust(x,y,4,{ring:10,size:36,spd:60,life:.6});}
/* Soul Harvest: her souls burst out of her as one wail */
function soulBurst(x,y,R){flare(x,y,headZ()*.6,130,'#c8f6ff',.32);ring({x,y,r0:10,r1:R+60,life:.45,w:7,pal:SOUL,segs:5,gap:.16});motes(x,y,headZ()*.6,10,'#6ae0ff',{R:30,up:60,s:8,life:.8});smoke(x,y,30,4,SOULT,50,{sp:60,life:.8});}
/* the Duat gate: a turquoise portal flash where she was and where she lands */
function gateFlash(x,y){flat({n:'ringT',x,y,w:70,life:.6,fi:.03,fo:.35,s0:.4,s1:1,spin:2,a:1,glow:'#2ad0e8'});addFx(new Pillar({x,y,R:26,H:160,life:.45,drop:.04,pal:SOUL}));motes(x,y,20,6,'#6ae0ff',{R:16,up:90,s:7,life:.7});}
/* Mummy Lord: rises in a gold sand eruption; every slam = a gold shockwave + sand */
function lordRise(x,y,R){flare(x,y,30,140,'#ffd36a',.32);ring({x,y,r0:10,r1:R+20,life:.45,w:8,pal:GOLD,segs:4,gap:.2});sandDust(x,y,8,{ring:14,size:60,spd:100,life:.9});stones(x,y,5,{spd:160});}
function lordSlam(x,y,R){ring({x,y,r0:12,r1:R+8,life:.36,w:7,pal:GOLD,segs:4,gap:.22});sandDust(x,y,5,{ring:12,size:46,spd:90,life:.7});flare(x,y,10,70,'#ffe08a',.24);stones(x,y,3,{spd:130});}
/* Avatar of Bastet: a golden blast (the spirit rises from the watcher) */
function avatarBurst(x,y,R){flare(x,y,50,200,'#fff3c0',.4);ring({x,y,r0:16,r1:R+20,life:.5,w:9,pal:GOLD,segs:6,gap:.12});ring({x,y,r0:10,r1:R*.6,life:.42,w:5,pal:SOUL,segs:4,gap:.25,delay:.06});
  twinkles(x,y,50,14,R*.6,'#ffe89a',.9);sandDust(x,y,6,{ring:14,size:50,spd:90,life:.8});}

/* ---------------------------------------------------------------------
   6. SERVANTS — BaMinion keeps its update; mummies rise from the sand and crumble back, scarabs flap, the jackal shade smokes
   --------------------------------------------------------------------- */
let CURM=null;
const BM0=BaMinion;
BaMinion=class extends BM0{constructor(o){super(o);if(this.kind!=='scarab')this.layer='sorted';this.ph=R_(0,TAU);this.mv=0;this.face=Math.cos(player.phi)<0?-1:1;this.lunge=0;this.vx_=0;this.vy_=0;this.acc=0;}
  get sy(){return this.y;}
  update(dt){const ox=this.x,oy=this.y,r=super.update(dt);if(r&&!this.dead){const dx=this.x-ox,dy=this.y-oy,d=Math.hypot(dx,dy);if(d>40)this._jmp=this.t;else{this.vx_=dx/Math.max(1e-4,dt);this.vy_=dy/Math.max(1e-4,dt);}
      this.mv=lerp(this.mv,cl(d/Math.max(1e-4,dt)/120,0,1),Math.min(1,dt*10));if(Math.abs(dx)>.05&&d<40)this.face=dx<0?-1:1;this.lunge=Math.max(0,this.lunge-dt*4.5);try{minionTick(this,dt);}catch(e){}}return r;}
  atk(e){CURM=this;this.lunge=1;if(e)this.face=e.x<this.x?-1:1;try{return super.atk(e);}finally{CURM=null;}}
  kill(){if(!this.dead&&!this._gone){this._gone=1;try{minionGone(this);}catch(e){}}return super.kill();}
  draw(){try{minionDraw(this);}catch(e){}}};
const MPIC={mummy:['mummy',34],army:['mummyW',42],lord:['mummyL',58]};
function minionTick(m,dt){m.acc+=dt;
  if(!m._sp){m._sp=1;minionSpawn(m);}
  if(m.kind==='anubis'){if(m.acc>.12){m.acc=0;smoke(m.x+R_(-12,12),m.y,R_(6,26),1,SHADET,22,{sp:8,life:.7,rise:26});}}
  else if(m.kind==='scarab'){if(m.acc>.09){m.acc=0;S1().add({im:tx('star','#ffd36a'),x:m.x,y:m.y,z:28+R_(-3,3),vz:R_(-10,10),s0:6,s1:1.5,life:.3,fo:.6,add:1});}}
  else if(m.mv>.3&&m.acc>.22){m.acc=0;sandDust(m.x,m.y,1,{size:26,spd:20,life:.5,a:.5});}}
function minionSpawn(m){const x=m.x,y=m.y;
  if(m.kind==='scarab'){flare(x,y,26,40,'#ffd36a',.22);return;}
  if(m.kind==='anubis'){smoke(x,y,10,5,SHADET,48,{sp:50,life:.9});flare(x,y,24,70,'#9a6ae0',.26);ring({x,y,r0:6,r1:44,life:.35,w:5,pal:SHADE,segs:3,gap:.3});return;}
  const big=m.kind==='lord';sandDust(x,y,big?9:5,{ring:big?14:8,size:big?60:44,spd:big?90:60,life:.9});addFx(new Vortex({x,y,R:big?40:26,life:.45}));if(m.kind!=='army')flare(x,y,20,big?80:40,'#6ae0ff',.22);}
/* a little sand vortex where a mummy rises */
class Vortex{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.45,R:26},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=Math.sin(Math.PI*k),[x,y]=P(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';for(let i=0;i<4;i++){const s=this.t*9+i*TAU/4,r=this.R*(1-k*.4)*(.6+.1*i);ctx.globalAlpha=.7*a;ctx.strokeStyle=i%2?'#e8d3a0':'#a8874a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r,s,s+1.6);ctx.stroke();}
    ctx.globalAlpha=.35*a;ctx.fillStyle='#5a4220';ctx.beginPath();ctx.arc(0,0,this.R*.5,0,TAU);ctx.fill();ctx.restore();}}
function minionGone(m){const x=m.x,y=m.y;
  if(m.kind==='scarab'){if(bL('bbGolden'))return;sprite({n:'scarabO',x,y,z:28,w:16,life:.5,fi:.01,fo:.4,vz:120,rot:-Math.PI/2+R_(-.3,.3)});motes(x,y,28,3,'#ffd36a',{R:6,up:40,s:5,life:.5});return;}
  if(m.kind==='anubis'){smoke(x,y,14,6,SHADET,46,{sp:40,life:.9,rise:30});return;}
  addFx(new Crumble(m));}
/* a servant crumbles back into sand: it sinks, the linen strips fly off, a sand pile is left for a moment */
class Crumble{constructor(m){this.t=0;this.layer='sorted';this.x=m.x;this.y=m.y;this.kind=m.kind;this.face=m.face;const [n,w]=MPIC[m.kind]||MPIC.mummy;this.n=n;this.w=w;
    sandDust(m.x,m.y,m.kind==='lord'?8:4,{ring:8,size:m.kind==='lord'?56:40,spd:50,life:.9});linen(m.x,m.y,30,m.kind==='lord'?5:3,{spd:60,up:80});}
  get sy(){return this.y;}update(dt){this.t+=dt;return this.t<.9;}
  draw(){const k=cl(this.t/.4,0,1),f=cl((this.t-.5)/.4,0,1),[x,y]=P(this.x,this.y,0),[aw,ah]=AR.size(this.n),h=this.w*ah/aw;
    ctx.save();ctx.beginPath();ctx.rect(x-this.w,y-h*1.4,this.w*2,h*1.4+1);ctx.clip();art(this.n,x,y+h*eI(k),this.w,{ay:.98,sx:this.face,a:1-k*.5});ctx.restore();
    ctx.save();ctx.globalAlpha=(1-f)*.9*cl(this.t/.15,0,1);ctx.fillStyle='#c8a868';ctx.beginPath();ctx.ellipse(x,y,this.w*.48*(.6+.4*k),this.w*.16*(.6+.4*k),0,Math.PI,0);ctx.fill();ctx.fillStyle='#e8d3a0';ctx.beginPath();ctx.ellipse(x,y-2,this.w*.3*k,this.w*.08*k,0,Math.PI,0);ctx.fill();ctx.restore();}}
function minionDraw(m){const t=m.t,a=cl(Math.min(1,(m.life-t)/.25),0,1);if(a<=0)return;
  if(m.kind==='scarab')return scarabDraw(m,a);if(m.kind==='anubis')return jackalDraw(m,a);
  const [n,w]=MPIC[m.kind]||MPIC.mummy,[aw,ah]=AR.size(n),h=w*ah/aw,[x,y]=P(m.x,m.y,0),rise=eO(cl(t/.35,0,1)),hit=cl(1-(gameTime-(m._hitT||-9))/.2,0,1);
  const bob=Math.sin(t*(4+m.mv*6)+m.ph)*(1+m.mv*1.6),lean=m.lunge*.2*m.face+Math.sin(t*1.6+m.ph)*.035-hit*.15*m.face,shx=(hit?Math.sin(t*90)*2*hit:0)+m.lunge*7*m.face;
  ctx.save();ctx.globalAlpha=.32*rise*a;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,w*.42,w*.13,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x-w*1.2,y-h*1.6,w*2.4,h*1.6+1);ctx.clip();
  art(n,x+shx,y+h*(1-rise)-Math.abs(bob)*.6,w,{ay:.98,rot:lean,sx:m.face,a,under:'#3a2a14',ua:.25});
  if(m.flash>0||hit>0){ctx.globalCompositeOperation='lighter';art(n,x+shx,y+h*(1-rise)-Math.abs(bob)*.6,w,{ay:.98,rot:lean,sx:m.face,a:.35*Math.max(m.flash,hit)*a});}
  ctx.restore();
  const ez=m.kind==='lord'?h*.78:h*.82,[gx,gy]=P(m.x+m.face*(m.kind==='army'?-1:1),m.y,ez*rise);glowAt(gx+shx,gy,w*.7,w*.32,m.kind==='lord'?'#2ad0e8':'#6ae0ff',(.35+.15*Math.sin(t*5+m.ph))*a*rise);
  if(m.taunt&&rise>=1){const [fx,fy]=P(m.x,m.y,0);ctx.save();ctx.translate(fx,fy);ctx.scale(1,K);ctx.globalAlpha=(.3+.1*Math.sin(t*4))*a;ctx.strokeStyle='#1a9ab0';ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.arc(0,0,Math.min(m.taunt,90)*.5,0,TAU);ctx.stroke();ctx.restore();}}
function scarabDraw(m,a){const t=m.t,z=26+Math.sin(t*12+m.ph)*4,[x,y]=P(m.x,m.y,z),[gx,gy]=P(m.x,m.y,0),sp=Math.hypot(m.vx_,m.vy_),ang=sp>5?Math.atan2(m.vy_*K,m.vx_)+Math.PI/2:(m.rot0??(m.rot0=R_(0,TAU))),ap=cl(t/.15,0,1)*a;
  ctx.save();ctx.globalAlpha=.25*ap;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy,6,2.2,0,0,TAU);ctx.fill();ctx.restore();
  glowAt(x,y,34,34,'#ffc23a',.45*ap);const open=((t*28+m.ph*3)|0)%2===0;art(open?'scarabO':'scarabC',x,y,open?17:13,{rot:ang,a:ap});if(m.flash>0)flareAt(x,y,10*m.flash);}
function flareAt(x,y,s){ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(tx('star','#fff3c0'),x-s,y-s,s*2,s*2);ctx.restore();}
function jackalDraw(m,a){const t=m.t,ap=cl(t/.2,0,1)*a,jp=cl(1-(t-(m._jmp??-9))/.18,0,1),[x,y]=P(m.x,m.y,0),bob=Math.sin(t*8+m.ph)*1.5;
  ctx.save();ctx.globalAlpha=.3*ap;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,22,6,0,0,TAU);ctx.fill();ctx.restore();
  glowAt(x,y-18,80,50,'#7a3ae0',.32*ap);art('jackal',x+m.lunge*8*m.face,y-bob,50*(1+jp*.12),{ay:.95,sx:m.face,a:ap,rot:-m.lunge*.12*m.face,under:'#06030c',ua:.25});
  const [ex,ey]=P(m.x+m.face*21,m.y,30-bob);glowAt(ex,ey,14,10,'#2ad0e8',(.6+.3*Math.sin(t*7))*ap);}

/* ---------------------------------------------------------------------
   7. GROUND + TOP DRAWING (BaGround / BaTop keep their update): obelisk ring, blight, hex marks, souls, threads, veil, buffs
   --------------------------------------------------------------------- */
for(const C of [BaGround,BaTop,BaCore])C.prototype.__gt='-';   /* overlays never take an element gem's tint (they hold every skill's state) */
BaGround.prototype.draw=function(){const t=this.t,gt=gameTime;
  const O=BA.obelisk;if(O){const R=BB.bnObelisk.R,a=cl((O.until-gt)/.4,0,1)*cl((gt-(O._t0||gt))/.25,0,1),[x,y]=P(O.x,O.y,0);glowAt(x,y,R*2.3,R*2.3*K,'#ffd36a',.14*a);art('ringG',x,y,R*2.1,{flat:1,rot:t*.15,a:.85*a});
    if(Math.hypot(player.x-O.x,player.y-O.y)<R)glowAt(x,y,R*1.8,R*1.8*K,'#6ae0ff',.1*a*(.7+.3*Math.sin(t*4)));}
  for(const L of BA.locusts){const R=BB.baLocust.R,a=cl((L.until-gt)/.5,0,1)*cl((gt-(L._t0||gt))/.2,0,1),[x,y]=P(L.x,L.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,rgba('#2a1a10',.5*a));g.addColorStop(.7,rgba('#3a1a4a',.32*a));g.addColorStop(1,rgba('#3a1a4a',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4*a;ctx.strokeStyle='#8a4ad0';ctx.lineWidth=2;ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*24;ctx.beginPath();ctx.arc(0,0,R*.95,0,TAU);ctx.stroke();ctx.restore();}
  /* feet rings under fully cursed enemies */
  for(const e of enemies){if(e.dead||!(e.bHex>=BA_BAL.hex.cap))continue;const [x,y]=P(e.x,e.y,0),r=e.r+10;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.15*Math.sin(t*5);ctx.strokeStyle='#9a4aff';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();
    ctx.globalAlpha=.25;ctx.fillStyle='#6a2aa8';ctx.fill();ctx.restore();}
  /* the back half of her souls (behind her) */
  souls(t,false);
  /* Bastet's Blessing: the gold sun disc behind her head */
  const bl=bA('bcBless');if(bl>0){const [x,y]=P(player.x,player.y-2,headZ()+6+2*Math.sin(t*2));glowAt(x,y,70,70,'#ffd36a',.45*bl);art('sunG',x,y,32,{a:.95*bl,rot:Math.sin(t*1.2)*.05});}
  /* Sand Veil: the back half of the gauze */
  veil(t,false);};
BaTop.prototype.draw=function(){const t=this.t,dt=cl(t-(this._lt??t),0,.1);this._lt=t;const gt=gameTime;
  hexMarks(t,dt);links(t);souls(t,true);veil(t,true);grimoire(t,dt);
  if(hasBuff('baEternal')){ctx.save();ctx.fillStyle='rgba(40,10,60,.07)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}};
/* HEX: one glowing hieroglyph per stack circles over the enemy's head; the newest pops in; a full curse adds the eye */
function hexMarks(t,dt){for(const e of enemies){if(e.dead||!(e.bHex>0)){if(e._hxN)e._hxN=0;continue;}const n=Math.min(8,e.bHex|0);if(e.bHexPop>0)e.bHexPop=Math.max(0,e.bHexPop-dt*3.2);
    if(n>(e._hxN||0))e._hxP=gt();e._hxN=n;const [cx,cy]=P(e.x,e.y,topZ(e)),rx=12+n*1.6+(e.boss?6:0),ry=rx*.34,pop=cl(1-(gt()-(e._hxP||-9))/.3,0,1),fl=cl(1-(gt()-(e._hxF||-9))/.22,0,1),cap=n>=BA_BAL.hex.cap;
    glowAt(cx,cy,rx*2.6,rx*1.4,cap?'#b06aff':'#7a3ae0',(.22+.12*fl+(cap?.12:0)));
    const L=[];for(let i=0;i<n;i++){const an=t*1.7+i*TAU/n,s=Math.sin(an);L.push([s,cx+Math.cos(an)*rx,cy+s*ry,i]);}L.sort((a,b)=>a[0]-b[0]);
    for(const [s,x,y,i] of L){const nw=i===n-1&&pop>0,sz=(9+2*(s+1)*.5)*(nw?1+pop*.9:1)*(1+.2*fl),al=.55+.45*(s+1)*.5;art('glyph'+(i%5),x,y,sz,{a:al});if(nw)flareAt(x,y,8*pop);}
    if(cap){const [ex,ey]=P(e.x,e.y,topZ(e)+16+2*Math.sin(t*3));art('glyph0',ex,ey,18*(1+.08*Math.sin(t*6)),{a:.95});}}}
const gt=()=>gameTime;
/* Curse Link: threads between the linked enemies, glyph beads running along; a Shared Fate echo sends a bright pulse */
function links(t){const L=BA.link;if(!L||!(L.until>gameTime))return;const s=L.set.filter(e=>!e.dead&&enemies.includes(e)),a=cl((L.until-gameTime)/.4,0,1)*cl((gameTime-(L._t0||gameTime))/.2,0,1);
  for(let i=0;i<s.length-1;i++){const A=[s[i].x,s[i].y,30],B=[s[i+1].x,s[i+1].y,30],fl=Math.max(cl(1-(gameTime-(s[i]._fateT||-9))/.3,0,1),cl(1-(gameTime-(s[i+1]._fateT||-9))/.3,0,1));threadLine(A,B,t,2,.85*a,HEX,1+fl*.8);
    for(let j=0;j<2;j++){const u=(t*.55+j*.5+i*.21)%1,[bx,by]=threadAt(A,B,u),im=AR.get('glyph'+((i+j)%5));if(im){ctx.save();ctx.globalAlpha=a*.95;ctx.globalCompositeOperation='lighter';ctx.drawImage(im,bx-6,by-6,12,12);ctx.restore();}}}
  for(const e of s){const [x,y]=P(e.x,e.y,30);glowAt(x,y,24,24,'#b06aff',.5*a);}}
/* SOULS 0–6: ba-soul wisps circling her head (front half on top, back half on the ground layer = behind her) */
function souls(t,front){if(!bL('bbSiphon')&&!(BA.souls>0))return;const n=BA.souls|0;if(n<=0)return;const hv=cl(1-(gameTime-(BV.harvT||-9))/.5,0,1),z0=headZ()-6+hv*30,R=28*(1-hv*.5);
  for(let i=0;i<n;i++){const an=t*1.9+i*TAU/n,s=Math.sin(an);if((s>=0)!==front)continue;const pop=i===n-1?BA.soulPop||0:0,[x,y]=P(player.x+Math.cos(an)*R,player.y+s*R*.4,z0+Math.sin(t*3+i)*3),sz=(9+1.6*s)*(1+pop*.8);
    glowAt(x,y,26,26,'#2ad0e8',(front?.55:.35));art('soul',x,y,sz,{a:front?1:.7});if(pop>0)flareAt(x,y,10*pop);}}
/* SAND VEIL: a gauze of sand turning round her while the shield holds; thins as it is used up */
function veil(t,front){if(!(BA.shield>0&&BA.shieldUntil>gameTime))return;const k=cl(BA.shield/Math.max(1,BV.sh0||BA.shield),.25,1),a=cl((BA.shieldUntil-gameTime)/.4,0,1)*cl((gameTime-(BV.shT||0))/.3,0,1),fl=cl(1-(gameTime-(BV.shHit||-9))/.25,0,1),N=28,z0=(player.z||0);
  for(let r=0;r<2;r++){const q=[],w=[],run=[];for(let i=0;i<=N;i++){const u=i/N,an=u*TAU*1.15+t*(2.2+r*.6)+r*2,s=Math.sin(an),[x,y]=P(player.x+Math.cos(an)*(26+r*4),player.y+s*(26+r*4)*.42,z0+12+u*40+r*8);q.push([x,y]);w.push((3+2*Math.sin(Math.PI*u))*k);run.push(s>=0);}
    const seg=[];let cur=null;for(let i=0;i<=N;i++){if(run[i]===front){if(!cur){cur={q:[],w:[]};seg.push(cur);}cur.q.push(q[i]);cur.w.push(w[i]);}else cur=null;}
    for(const s of seg){if(s.q.length<2)continue;ctx.save();band(s.q,s.w,[[1.6,'#5a4220',.22*a]]);ctx.globalCompositeOperation='lighter';band(s.q,s.w,[[1.1,'#c8a464',(front?.55:.3)*a*(1+fl)],[.6,'#ffe8b0',(front?.6:.3)*a*(1+fl)],[.2,'#ffffff',.5*a]]);ctx.restore();}}
  if(front&&Math.random()<.5*(typeof Q!=='undefined'?Q.p:1)){const an=R_(0,TAU);S1().add({im:tx('core','#ffe0a0'),x:player.x+Math.cos(an)*28,y:player.y+Math.sin(an)*12,z:z0+R_(10,50),vz:R_(-20,10),s0:3,s1:1,life:.4,fo:.6,add:1});}}
/* BLACK GRIMOIRE: the book floats at her shoulder while cursed enemies are near; brighter with each one (max 5) */
function grimoire(t,dt){if(!bL('baGrimoire'))return;const n=Math.min(BB.baGrimoire.n,bNear(player.x,player.y,BB.baGrimoire.R).filter(q=>q.bHex>0).length);BV.grA=lerp(BV.grA||0,n>0?1:0,Math.min(1,dt*6));if(BV.grA<.02)return;
  const sd=Math.cos(player.phi)<0?1:-1,[x,y]=P(player.x+sd*24,player.y-6,headZ()-4+3*Math.sin(t*2.2)),a=BV.grA;glowAt(x,y,40+n*8,40+n*8,'#9a4aff',(.25+.08*n)*a);art('grimoire',x,y,20,{a,rot:Math.sin(t*1.7)*.08});
  for(let i=0;i<n;i++){const an=t*2.4+i*TAU/n,[gx,gy]=[x+Math.cos(an)*16,y+Math.sin(an)*6];ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.8*a;ctx.drawImage(tx('star','#b06aff'),gx-4,gy-4,8,8);ctx.restore();}}

/* ---------------------------------------------------------------------
   8. WATCHER (after her own per-frame tick): the obelisk, swarms, the veil, the Avatar spirit, auras that follow state
   --------------------------------------------------------------------- */
class ObeliskFx{constructor(O){this.O=O;this.layer='sorted';this.t=0;this.end=null;this.x=O.x;this.y=O.y;this.__gt='-';}
  get sy(){return this.y;}
  update(dt){this.t+=dt;if(this.end==null&&BA.obelisk!==this.O){this.end=this.t;sandDust(this.x,this.y,5,{ring:8,size:40,spd:50,life:.8});}return this.end==null||this.t-this.end<.45;}
  draw(){const k=eO(cl(this.t/.3,0,1)),f=this.end==null?0:eI(cl((this.t-this.end)/.45,0,1)),[x,y]=P(this.x,this.y,0),w=24,[aw,ah]=AR.size('obelisk'),h=w*ah/aw,lift=(1-k)*h*.92+f*h;
    ctx.save();ctx.globalAlpha=.3*(1-f);ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,w*.75,w*.24,0,0,TAU);ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.rect(x-w*2,y-h*1.3,w*4,h*1.3+1);ctx.clip();art('obelisk',x,y+lift,w,{ay:.985,under:'#3a2a14',ua:.3});ctx.restore();
    const [px,py]=P(this.x,this.y,h*.88-lift);glowAt(px,py,46,46,'#ffd36a',(.45+.15*Math.sin(this.t*3))*(1-f)*k);}}
class SwarmFx{constructor(L){this.L=L;this.layer='top';this.t=0;this.end=null;this.n=qn2(22);this.p=Array.from({length:this.n},()=>({a:R_(0,TAU),r:R_(.15,1),h:R_(8,48),va:R_(2.2,4.4)*(Math.random()<.5?1:-1),ph:R_(0,TAU),f:R_(0,1)}));}
  update(dt){this.t+=dt;if(this.end==null&&!BA.locusts.includes(this.L))this.end=this.t;for(const q of this.p)q.a+=q.va*dt;return this.end==null||this.t-this.end<.6;}
  draw(){const L=this.L,R=BB.baLocust.R,t=this.t,f=this.end==null?0:cl((this.t-this.end)/.6,0,1),k=cl(t/.25,0,1),[cx,cy]=P(L.x,L.y,26);glowAt(cx,cy,R*2,R*1.1,'#5a2a7a',.22*k*(1-f));
    const D=this.p.map(q=>{const r=q.r*R*.92*(1+f*1.6),x=L.x+Math.cos(q.a)*r,y=L.y+Math.sin(q.a)*r*.75,z=q.h+Math.sin(t*3+q.ph)*7+f*40,[sx,sy]=P(x,y,z);return [y,sx,sy,q];});D.sort((a,b)=>a[0]-b[0]);
    for(const [,sx,sy,q] of D){const lf=(q.va>0)===(Math.sin(q.a)>0),fr=((t*24+q.f*5)|0)%2;art('locust'+fr,sx,sy,12,{sx:lf?-1:1,a:k*(1-f)});}}}
const PV={ob:null,loc:new Set(),shield:0,av:false,acc:{}};
const tickE=(k,s,dt)=>{PV.acc[k]=(PV.acc[k]||0)+dt;if(PV.acc[k]>=s){PV.acc[k]=0;return true;}return false;};
class Spirit{constructor(){this.t=0;this.layer='ground';this.end=null;this.__gt='-';}
  update(dt){this.t+=dt;if(this.end==null&&!bAvatar())this.end=this.t;return this.end==null||this.t-this.end<.6;}
  draw(){const k=eO(cl(this.t/.5,0,1)),f=this.end==null?0:cl((this.t-this.end)/.6,0,1),[x,y]=P(player.x,player.y-4,(player.z||0)+60+6*Math.sin(this.t*1.6)),w=112*(.75+.25*k),fl=cl(1-this.t/.5,0,1);
    glowAt(x,y,w*1.8,w*1.6,'#ffc23a',(.28+.4*fl)*k*(1-f));ctx.save();ctx.globalAlpha=(.38+.3*fl)*k*(1-f);art('bastet',x,y-18*(1-k),w,{});ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(.2+.35*fl)*k*(1-f)*(.85+.15*Math.sin(this.t*3));art('bastet',x,y-18*(1-k),w,{});ctx.restore();}}
function watch(dt){const gtm=gameTime;
  const O=BA.obelisk;if(O&&O!==PV.ob){O._t0=gtm;addFx(new ObeliskFx(O));const x=O.x,y=O.y;sandDust(x,y,6,{ring:8,size:46,spd:70,life:.8});stones(x,y,4,{spd:140});ring({x,y,r0:8,r1:BB.bnObelisk.R,life:.45,w:7,pal:GOLD,segs:4,gap:.2});flare(x,y,60,90,'#ffd36a',.3);}PV.ob=O;
  if(O&&Math.hypot(player.x-O.x,player.y-O.y)<BB.bnObelisk.R&&tickE('ob',.45,dt))addFx(new Mote({x:O.x,y:O.y,z:84,pal:SOUL,s:7,life:.45}));
  for(const L of BA.locusts)if(!PV.loc.has(L)){PV.loc.add(L);L._t0=gtm;addFx(new SwarmFx(L));}for(const L of PV.loc)if(!BA.locusts.includes(L))PV.loc.delete(L);
  const sh=BA.shield>0&&BA.shieldUntil>gtm?BA.shield:0;if(sh>PV.shield){BV.sh0=sh;BV.shT=gtm;}else if(PV.shield>0&&sh<=0){const x=player.x,y=player.y;sandDust(x,y,6,{ring:20,size:46,spd:60,life:.9});motes(x,y,30,8,'#ffe0a0',{R:28,up:-30,s:5,life:.7});}PV.shield=sh;
  const av=bAvatar();if(av&&!PV.av)addFx(new Spirit());PV.av=av;
  if(av&&tickE('av',.12,dt)){const a=R_(0,TAU);S1().add({im:tx('star','#ffd36a'),x:player.x+Math.cos(a)*22,y:player.y+Math.sin(a)*10,z:R_(4,40),vz:R_(30,60),s0:3,s1:R_(9,14),life:R_(.5,.8),fo:.6,add:1});}
  if(hasBuff('bcBless')&&tickE('bl',.5,dt)){motes(player.x,player.y,10,2,'#c8ff9a',{R:18,up:60,s:6,life:.8});if(Math.random()<.5)flo({n:'ankh',x:player.x+R_(-14,14),y:player.y,z:headZ()-10,vz:30,w:8,life:.8,sw:3,glow:'#ffd36a'});}
  if(hasBuff('bnGrace')&&tickE('gr',.08,dt)){const a=R_(0,TAU);S1().add({im:tx('star','#fff6dc'),x:player.x+Math.cos(a)*18,y:player.y+Math.sin(a)*8,z:R_(6,50),vz:R_(10,30),s0:2,s1:R_(8,12),life:.45,fo:.6,add:1});}
  if(hasBuff('baEternal')&&tickE('et',.18,dt)){const L=enemies.filter(e=>!e.dead&&e.bHex>0&&Math.hypot(e.x-player.x,e.y-player.y)<420);const e=L[(Math.random()*L.length)|0];if(e)glyphs(e.x,e.y,topZ(e)-10,1,{spd:20,up:50,s:.8});}
  if(tickE('ven',.22,dt))for(const e of enemies)if(!e.dead&&e._baVen>gtm){const S=S1();S.add({im:tx('core','#9aff6a'),x:e.x+R_(-e.r*.5,e.r*.5),y:e.y,z:zOf(e)+R_(-4,10),vz:R_(-10,0),g:260,s0:4.5,s1:3,life:.5,fo:.5,add:1});}}
const C0=BaCore.prototype.update;BaCore.prototype.update=function(dt){window.__BATICK=1;let r;try{r=C0.call(this,dt);}finally{window.__BATICK=0;}
  const sk=window.SKCTX;window.SKCTX=null;try{watch(dt);}catch(e){if(!BV._w){BV._w=1;console.warn('bastet fx watch',e);}}finally{window.SKCTX=sk;}return r;};

/* ---------------------------------------------------------------------
   9. HIT SPARKS — from the damage itself (bHit is wrapped)
   --------------------------------------------------------------------- */
const HXT=new WeakMap();
function hitFx(e,key,o){const x=e.x,y=e.y,z=zOf(e),m=CURM;
  switch(key){
    case 'basic':{const gd=bAvatar(),c=gd?'#ffd36a':'#6ae0ff';flare(x,y,z,64,gd?'#ffe89a':'#c8f6ff',.24);addFx(new KBurst({x,y,z,R:30,n:8,life:.22,pal:gd?GOLD:SOUL,ink:.4}));scraps(x,y,z,3,{spd:100,up:100});motes(x,y,z,3,c,{R:8,up:50,s:6,life:.5});break;}
    case 'bnOmen':flare(x,y,z,60,'#b07aff',.24);break;
    case 'bcPages':flare(x,y,z,50,'#c8f6ff',.22);scraps(x,y,z,2,{spd:90,up:80});break;
    case 'bcShadow':flare(x,y,z,40,'#9a6ae0',.2);break;
    case 'baGlyph':flare(x,y,z,58,'#e4ccff',.24);addFx(new KBurst({x,y,z,R:36,n:9,life:.24,pal:HEX,ink:.45}));flo({n:'glyph'+((Math.random()*5)|0),x,y,z:z+8,vz:30,w:20,life:.45,fo:.25,s0:1.6,s1:1,pop:.12,add:1,glow:'#9a4aff'});break;
    case 'baHex':{const l=HXT.get(e)||-9;if(gameTime-l<.45)break;HXT.set(e,gameTime);e._hxF=gameTime;smoke(x,y,topZ(e)-12,1,HEXT,24,{sp:10,life:.6,rise:24});flare(x,y,topZ(e),26,'#b06aff',.18);break;}
    case 'baFate':e._fateT=gameTime;flare(x,y,z,34,'#b06aff',.2);break;
    case 'baLocust':{const l=HXT.get(e)||-9;if(gameTime-l<.3)break;HXT.set(e,gameTime);locustsOut(x,y,z,1,{spd:70});flare(x,y,z,20,'#c8a8ff',.16);break;}
    case 'baLink':flare(x,y,z,38,'#e4ccff',.22);ring({x,y,r0:e.r+24,r1:e.r+4,life:.3,w:4,pal:HEX,segs:3,gap:.3});break;
    case 'baApep':{flare(x,y,z,70,'#c8a8ff',.26);addFx(new KBurst({x,y,z,R:34,n:8,life:.24,pal:SHADE,ink:.5}));for(const s of [-1,1])addFx(new KLine({x:x+s*5,y,e,ox:s*5,z:z+2,ang:1.5+s*.18,L:22,w:2.4,grow:.03,hold:.05,fade:.14,pal:['#1c0a36','#e4ccff','#ffffff','#ffffff','#ffffff'],ink:.4}));
      if(bL('baVenom')){e._baVen=gameTime+BB.baVenom.slow;for(let i=0;i<3;i++)S1().add({im:tx('core','#9aff6a'),x,y,z,vx:R_(-60,60),vy:R_(-40,40),vz:R_(40,110),g:420,s0:5,s1:3,life:.45,fo:.5,add:1});}break;}
    case 'bcApep':flare(x,y,z,90,'#e4ccff',.28);break;
    case 'baDoom':flare(x,y,z,90,'#e4ccff',.28);break;
    case 'baWrap':flare(x,y,z,44,'#fff6dc',.22);addFx(new Wraps(e));break;
    case 'baPharaoh':break;                                                   /* drawn by eyeBeam */
    case 'bcStorm':sandDust(x,y,2,{size:40,spd:60,life:.6});locustsOut(x,y,z,2,{spd:110});flare(x,y,z,60,'#ffe0a0',.24);break;
    case 'bcSekhmet':flare(x,y,z,70,'#ffc08a',.26);embers(x,y,z,4,{spd:120,up:120,c:['#fff3d8','#ffb04a','#b8200c']});break;
    case 'bbSiphon':flare(x,y,z,44,'#c8f6ff',.22);smoke(x,y,z,1,SOULT,26,{sp:10,life:.5,rise:30});break;
    case 'bbMummy':{const src=m||{x:player.x,y:player.y},ph=Math.atan2(y-src.y,x-src.x);addFx(new KArc({x:src.x,y:src.y,z:30,phi:ph,tilt:.5,a0:-1.2,a1:1.1,hit:0,R:Math.max(24,Math.hypot(x-src.x,y-src.y)*.9),W:10,lead:.02,sweep:.1,hold:.03,fade:.14,pal:SAND,ink:.35,N:14}));sandDust(x,y,2,{size:30,spd:50,life:.5});linen(x,y,z,1,{spd:70,up:60});break;}
    case 'bbLash':flare(x,y,z,30,'#fff6dc',.18);break;
    case 'bbScarab':flare(x,y,z,22,'#ffd36a',.16);if(Math.random()<.4)goldShards(x,y,z,1,{spd:80,up:80,s:.6});break;
    case 'bbGolden':flare(x,y,z,80,'#fff3c0',.28);addFx(new KBurst({x,y,z,R:34,n:9,life:.24,pal:GOLD,ink:.4}));goldShards(x,y,z,6,{spd:160});break;
    case 'bbAnubis':{const src=m||{x:player.x,y:player.y},ph=Math.atan2(y-src.y,x-src.x);for(const s of [-1,1])addFx(new KArc({x,y,z:z+2,phi:ph+Math.PI,tilt:1.4,a0:s*1.4,a1:s*.15,hit:s*.4,R:16,W:6,lead:.02,sweep:.07,hold:.03,fade:.12,pal:SHADE,ink:.45,N:10}));
      flare(x,y,z,56,'#b07aff',.24);smoke(x,y,z,2,SHADET,28,{sp:30,life:.6});break;}
    case 'bbWeigh':flare(x,y,z,110,'#ffe08a',.3);break;
    case 'bbHarvest':flare(x,y,z,100,'#c8f6ff',.3);addFx(new KBurst({x,y,z,R:44,n:10,life:.28,pal:SOUL,ink:.4}));motes(x,y,z,4,'#6ae0ff',{R:10,up:80,s:7,life:.6});smoke(x,y,z,2,SOULT,36,{sp:40,life:.7,rise:40});break;
    case 'bbArmy':{const src=m||{x:player.x,y:player.y},ph=Math.atan2(y-src.y,x-src.x);addFx(new KArc({x:src.x,y:src.y,z:30,phi:ph,tilt:.9,a0:-1.4,a1:1.2,hit:0,R:Math.max(26,Math.hypot(x-src.x,y-src.y)*.95),W:12,lead:.02,sweep:.1,hold:.03,fade:.16,pal:BRZ,ink:.4,N:14}));flare(x,y,z,40,'#ffd8a0',.2);break;}
    case 'bbAmmit':flare(x,y,z,80,'#c8ff9a',.26);break;
    case 'bcLord':flare(x,y,z,40,'#ffe08a',.2);break;
    case 'bcOsiris':flare(x,y,z,70,'#e8ffc8',.24);break;
    default:glint(e,'#ffd36a',14);}}
const BHIT0=bHit;bHit=function(e,mult,key,o){const alive=e&&!e.dead,d=BHIT0.apply(this,arguments);if(alive&&d>0){try{hitFx(e,key,o||{});}catch(err){if(!BV._h){BV._h=1;console.warn('bastet hit fx',err);}}}return d;};

/* ---------------------------------------------------------------------
   10. CASTS — bCast is wrapped: power gathers at the hand for the wind-up, a flash on the release; per-skill pieces in HK
   --------------------------------------------------------------------- */
const CPAL={bnGrace:null,bnVeil:SAND,bnAnkh:LIFE,bnObelisk:GOLD,baGlyph:HEX,baLocust:HEX,baLink:HEX,baApep:SHADE,baDoom:HEX,baWrap:SAND,baPharaoh:HEX,
  bbSiphon:SOUL,bbMummy:SOUL,bbScarab:GOLD,bbAnubis:SHADE,bbHarvest:SOUL,bbGate:SOUL,bbArmy:GOLD,bcStorm:SAND,bcLord:GOLD,bcBless:GOLD,bcAvatar:GOLD,bcSekhmet:SUNR,bcOsiris:GOLD};
const CPIC={baGlyph:['glyph0','glyph1','glyph2','glyph3','glyph4'],baDoom:['glyph0','glyph1','glyph2','glyph3','glyph4'],baPharaoh:['glyph0','glyph2','glyph4'],baLink:['glyph1','glyph3'],bbHarvest:null,bcStorm:['locust0','locust1'],baLocust:['locust0','locust1']};
const BC0=bCast;bCast=function(o){const a=BC0.apply(this,arguments);if(a&&a.events){try{castFx(a,o);}catch(e){console.warn('bastet cast',e);}}return a;};
function castFx(a,o){const k=o.key,p=CPAL[k],T=a.windup;if(!p)return;const big=/Pharaoh|Army|Avatar|Sekhmet|Osiris|Doom|Harvest/.test(o.name||'');
  at(a,0,()=>gather({life:Math.max(.08,rt(T)),pal:p,R1:big?12:9,n:big?22:14,rad:big?60:42,pics:CPIC[k]||null}));
  at(a,T,()=>{const c=tip();flare(c[0],c[1],c[2],big?90:56,p[3],.22);});}
function hook(k,f){const sk=SKILLS[k];if(!sk||!sk.make||sk._bav)return;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){try{f(a,c);}catch(e){console.warn('bastet fx',k,e);}}return a;};sk._bav=1;}
const HK={
  /* ---- Basic */
  bnGrace(a){const T=a.windup;let s0=null;first(a,T,()=>{s0=[player.x,player.y];});
    at(a,T,()=>{if(!s0)return;const s1=[player.x,player.y],ph=Math.atan2(s1[1]-s0[1],s1[0]-s0[0]),lf=Math.cos(ph)<0,im=tint('catL','#e8a83a'),im2=tint('catL','#fff6dc');
      addFx(new CatLeap({A:s0,B:s1,lf,im,im2}));sandDust(s0[0],s0[1],4,{size:36,spd:60,life:.6});twinkles(s1[0],s1[1],20,6,20,'#fff6dc',.6);});},
  bnVeil(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;for(let r=0;r<2;r++)addFx(new SandSpiral({ph:r*Math.PI,life:.55}));sandDust(x,y,5,{ring:14,size:40,spd:70,life:.7});ring({x,y,r0:44,r1:18,life:.35,w:5,pal:SAND,segs:4,gap:.2});});},
  bnAnkh(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;sprite({n:'ankhL',x,y,z:headZ()+14,follow:player,w:26,life:1,fi:.03,fo:.4,s0:.3,s1:1,pop:.2,tick:f=>{f.z=headZ()+14+eO(cl(f.t/.8,0,1))*22;},under:'#06301c',ua:.3});
      addFx(new Pillar({x,y,R:30,H:170,life:.6,drop:.06,pal:LIFE}));ring({x,y,r0:10,r1:56,life:.45,w:6,pal:LIFE,segs:4,gap:.25});twinkles(x,y,30,10,26,'#c8ff9a',.8);flare(x,y,headZ()+14,90,'#e0ffc8',.3);});},
  bnObelisk(a){},
  /* ---- A · Hexweaver */
  baGlyph(a){},
  baLocust(a,c){const [x,y]=bPt(c,BB.baLocust.range),T=a.windup;flat({n:'ringV',x,y,w:BB.baLocust.R*2.1,life:rt(T)+.15,fi:rt(T)*.8,fo:.15,a:.5,s0:.4,s1:1,spin:1});},
  baLink(a){const T=a.windup;at(a,T,()=>{const L=BA.link;if(!L)return;L._t0=gameTime;addFx(new LinkCast({set:L.set.slice()}));});},
  baApep(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;ring({x,y,r0:10,r1:46,life:.35,w:5,pal:HEX,segs:3,gap:.3});smoke(x,y,6,3,SHADET,36,{sp:30,life:.6});});},
  baDoom(a){const T=a.windup;sprite({n:'cartouche',x:player.x,y:player.y,follow:player,z:headZ()+26,w:20,life:rt(T)+.05,fi:.08,fo:.05,s0:.3,s1:1,pop:rt(T)*.8,under:'#1c0a36',ua:.3});
    flat({n:'ringV',x:player.x,y:player.y,follow:player,w:90,life:rt(T)+.05,fi:.1,fo:.05,s0:.4,s1:1,spin:2.4,a:.8});},
  baWrap(a){},
  baPharaoh(a){const T=a.windup;flat({n:'ringV',x:player.x,y:player.y,follow:player,w:130,life:rt(T)+.2,fi:.1,fo:.2,s0:.5,s1:1,spin:1.8,a:.85,glow:'#9a4aff'});
    at(a,T,()=>{const x=player.x,y=player.y;BV.eye=[x,y,214];addFx(new EyeFx({x,y,z:214}));smoke(x,y,214,8,'#5a3a8a|#140c20',80,{sp:70,life:1.4,rise:4});});},
  /* ---- B · Tomb Warden */
  bbSiphon(a){},
  bbMummy(a){},
  bbScarab(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;flare(x,y,30,80,'#ffe89a',.26);ring({x,y,r0:8,r1:44,life:.35,w:5,pal:GOLD,segs:4,gap:.25});});},
  bbAnubis(a){const T=a.windup;at(a,T,()=>{smoke(player.x,player.y,10,5,SHADET,50,{sp:60,life:.9});});},
  bbHarvest(a){const T=a.windup;BV.harvT=gameTime+rt(T);sprite({layer:'top',follow:player,life:rt(T)+.05,fi:.05,fo:.05,paint:(f,sx,sy)=>{const [x,y]=P(player.x,player.y,headZ()+24);glowAt(x,y,60,60,'#2ad0e8',.5*cl(f.t/rt(T),0,1));}});},
  bbGate(a){},
  bbArmy(a,c){const t=bTgt(c,300),cx=t?t.x:player.x+Math.cos(player.phi)*100,cy=t?t.y:player.y+Math.sin(player.phi)*100,T=a.windup;
    flat({n:'ringT',x:cx,y:cy,w:150,life:rt(T)+.3,fi:rt(T)*.7,fo:.3,s0:.5,s1:1,spin:1.4,a:.8,glow:'#2ad0e8'});
    at(a,T,()=>{const C=BA.armyAt||{x:cx,y:cy};addFx(new GateFx({x:C.x,y:C.y-34}));ring({x:C.x,y:C.y,r0:12,r1:130,life:.55,w:9,pal:GOLD,segs:6,gap:.12});flat({n:'ringG',x:C.x,y:C.y,w:270,life:1.4,fi:.06,fo:.6,s0:.5,s1:1,spin:.4,a:.85,glow:'#ffd36a'});sandDust(C.x,C.y,8,{ring:30,size:60,spd:90,life:1});shakeSoft(1);});},
  /* ---- C */
  bcStorm(a){},
  bcLord(a){},
  bcBless(a){const T=a.windup;at(a,T,()=>{const x=player.x,y=player.y;sprite({n:'sunG',x,y,follow:player,z:headZ()+6,w:34,life:.5,fi:.03,fo:.3,s0:2,s1:1,pop:.22});flare(x,y,headZ(),120,'#fff3c0',.32);ring({x,y,r0:10,r1:70,life:.45,w:6,pal:GOLD,segs:5,gap:.18});
      for(let i=0;i<10;i++)S1().add({im:tx('star','#ffe89a'),x:x+R_(-40,40),y:y+R_(-24,24),z:R_(120,160),vz:-R_(120,180),s0:8,s1:3,life:R_(.6,.9),fo:.4,add:1,delay:R_(0,.2)});});},
  bcAvatar(a){},
  bcSekhmet(a,c){const [x,y]=bPt(c,BB.bcSekhmet.range),T=a.windup;flat({n:'ringR',x,y,w:BB.bcSekhmet.R*2.1,life:rt(T)+.4,fi:rt(T)*.6,fo:.1,s0:.4,s1:1,spin:.9,a:.7,glow:'#ff5a3a'});
    at(a,T,()=>{addFx(new SunFall({x,y,fly:.35}));addFx(new SunMark({x,y,life:.4}));});},
  bcOsiris(a){}};
for(const k in HK)hook(k,HK[k]);
/* Cat's Grace: a cat of light leaps along her jump */
class CatLeap{constructor(o){Object.assign(this,{t:0,layer:'top',life:.3},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eO(cl(this.t/.2,0,1)),a=1-cl((this.t-.12)/.18,0,1),A=this.A,B=this.B;for(let i=0;i<3;i++){const u=cl(k-i*.14,0,1),x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u),z=10+Math.sin(Math.PI*u)*44,[sx,sy]=P(x,y,z);
      glowAt(sx,sy,64,36,'#ffd36a',.35*a/(i+1));if(!this.im)continue;ctx.save();ctx.translate(sx,sy);ctx.scale(this.lf?-1:1,1);ctx.rotate((u-.5)*.6);ctx.globalAlpha=a*(i?.3/i:.85);ctx.drawImage(this.im,-22,-12,44,24);
        if(!i&&this.im2){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.5;ctx.drawImage(this.im2,-22,-12,44,24);}ctx.restore();}}}
/* Sand Veil: sand ribbons spiral up round her as the veil forms */
class SandSpiral{constructor(o){Object.assign(this,{t:0,layer:'top',life:.55,ph:0},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,head=eO(cl(k/.6,0,1)),tail=cl((k-.3)/.7,0,1);if(head-tail<.02)return;const N=24,q=[],w=[];for(let i=0;i<=N;i++){const u=tail+(head-tail)*i/N,an=u*TAU*1.6+this.ph+this.t*4,r=40*(1-u*.4),[x,y]=P(player.x+Math.cos(an)*r,player.y+Math.sin(an)*r*.45,(player.z||0)+u*70);q.push([x,y]);w.push(4*Math.sin(Math.PI*(i/N)));}
    ctx.save();band(q,w,[[1.5,'#5a4220',.3],[1,'#c8a464',.85],[.55,'#ffe8b0',.9],[.2,'#ffffff',.7]]);ctx.restore();}}
/* Curse Link cast: the thread runs from her hand to the first enemy, then on from enemy to enemy */
class LinkCast{constructor(o){Object.assign(this,{t:0,layer:'top',life:.36},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const s=this.set.filter(e=>!e.dead),P0=tip(),pts=[[P0[0],P0[1],P0[2]],...s.map(e=>[e.x,e.y,30])],n=pts.length-1;if(n<1)return;const k=eO(cl(this.t/.24,0,1))*n,a=1-cl((this.t-.26)/.1,0,1);
    for(let i=0;i<n;i++){const u=cl(k-i,0,1);if(u<=0)break;const A=pts[i],B=pts[i+1],E=[lerp(A[0],B[0],u),lerp(A[1],B[1],u),lerp(A[2],B[2],u)];threadLine(A,E,this.t,3,a,HEX,1.3);if(u<1){const [x,y]=P(E[0],E[1],E[2]);glowAt(x,y,26,26,'#e4ccff',.8*a);}}}}
/* the Pharaoh's eye in the sky: opens, glares while the beams fall, closes */
class EyeFx{constructor(o){Object.assign(this,{t:0,layer:'top',life:1.25,w:150},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,open=eO(cl((t-.04)/.24,0,1)),close=eI(cl((t-.92)/.25,0,1)),k=open*(1-close),a=cl(t/.1,0,1)*(1-cl((t-1.05)/.2,0,1)),[x,y]=P(this.x,this.y,this.z),gl=cl(1-Math.abs(t-.37)/.2,0,1);
    glowAt(x,y,this.w*2.3,this.w*1.2,'#5a1ab0',.55*a);glowAt(x,y,this.w*1.3,this.w*.6,'#e4ccff',(.15+.5*gl)*a*k);art('eye',x,y,this.w,{sy:Math.max(.04,k),a});
    if(gl>0){const [ix,iy]=[x,y-this.w*.016];ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=gl*a;ctx.drawImage(tx('star','#e4ccff'),ix-40,iy-40,80,80);ctx.restore();}}}
/* Army of the Duat: the tomb gate rises behind the army, its doorway shines, then it sinks */
class GateFx{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:1.7,w:110},o);this.__gt='-';}get sy(){return this.y;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eO(cl(this.t/.32,0,1)),f=eI(cl((this.t-(this.life-.4))/.4,0,1)),[x,y]=P(this.x,this.y,0),[aw,ah]=AR.size('gate'),h=this.w*ah/aw,lift=(1-k)*h+f*h;
    glowAt(x,y-h*.4,this.w*1.6,h*1.2,'#2ad0e8',.35*k*(1-f));ctx.save();ctx.beginPath();ctx.rect(x-this.w,y-h*1.3,this.w*2,h*1.3+1);ctx.clip();art('gate',x,y+lift,this.w,{ay:.985,under:'#3a2a14',ua:.3});ctx.restore();
    if(k>=1&&f<1){const [dx,dy]=P(this.x,this.y,h*.35);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(.5+.3*Math.sin(this.t*9))*(1-f);ctx.drawImage(tx('glow','#8af4ff'),dx-34,dy-50,68,100);ctx.restore();}}}
/* Sekhmet's sun: falls from the sky and lands on the skill's own .35 s timer */
class SunFall{constructor(o){Object.assign(this,{t:0,layer:'top',fly:.35,z0:300},o);}update(dt){this.t+=dt;if(this.t>=this.fly-.01)return false;if(Math.random()<.6)embers(this.x,this.y,lerp(this.z0,20,eI(this.t/this.fly))+20,1,{spd:40,up:60,c:['#fff3d8','#ffb04a','#b8200c']});return true;}
  draw(){const u=cl(this.t/this.fly,0,1),z=lerp(this.z0,20,eI(u)),[sx,sy]=P(this.x,this.y,z),s=lerp(.6,1,u);
    const [tx0,ty0]=P(this.x,this.y,z+70);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(sx,ty0,sx,sy);g.addColorStop(0,'rgba(255,90,58,0)');g.addColorStop(1,'rgba(255,140,60,.55)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sx-18*s,sy);ctx.lineTo(sx-6*s,ty0);ctx.lineTo(sx+6*s,ty0);ctx.lineTo(sx+18*s,sy);ctx.fill();ctx.restore();
    glowAt(sx,sy,150*s,150*s,'#ff5a3a',.55);art('sunR',sx,sy,80*s,{rot:this.t*2});}}
class SunMark{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.4},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=cl(this.t/.35,0,1),[x,y]=P(this.x,this.y,0),R=BB.bcSekhmet.R*(.3+.7*k);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.35*k;ctx.fillStyle='#2a0804';ctx.beginPath();ctx.arc(0,0,R*.7,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6*k;ctx.strokeStyle='#ff5a3a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.restore();}}

/* ---------------------------------------------------------------------
   11. NORMAL ATTACK — a quick cast (the 'buff' clip timed like the axe swing it replaces): a page forms at her hand and flies
   --------------------------------------------------------------------- */
const MB0=mkBasic;mkBasic=function(tgt){const a=MB0.apply(this,arguments);if(!a||!a.seq||a.key!=='basic')return a;try{
    const tC=a.windup,tot=seqTotal(a.seq),d2=player.dir,b=seq('buff',d2,0,null,1),pk=bPeak(d2),t1=Math.max(.001,seqTimeAt(b,pk)),t2=Math.max(.001,seqTotal(b)-t1);
    if(b.length>pk&&tot>tC)a.seq=b.map((q,i)=>({st:q.st,d:q.d,f:q.f,ms:q.ms*(i<pk?tC/t1:(tot-tC)/t2)}));
    const T=rt(tC),gd=bAvatar(),big=/Nine Pages/.test(a.name||'');
    a.events.push({t:0,f:()=>{sprite({layer:'top',follow:player,life:T+.03,fi:.03,fo:.03,paint:f=>{const h=tip(),[x,y]=P(h[0],h[1],h[2]),s=cl(f.t/Math.max(.04,T),0,1);orb(x,y,1.5+3.5*eO(s),gd?GOLD:SOUL,f.t,1);art(gd?'pageG':'page',x,y-2,6+8*eO(s),{a:s,rot:f.t*4});}});
        if(big)gather({life:T,pal:gd?GOLD:SOUL,R1:10,n:18,rad:50,pics:['scrap0','scrap1','scrap2']});}},
      {t:Math.max(0,tC-.005),f:()=>{const h=tip();addFx(new KGlint({x:h[0],y:h[1],z:h[2],s:13,col:gd?'#ffd36a':'#6ae0ff',life:.14}));}});}catch(e){console.warn('bastet basic',e);}return a;};

/* ---------------------------------------------------------------------
   12. FILTERS — the old pictures stay off while her own code runs (boss telegraphs keep theirs); the cast circle, the decoy
   --------------------------------------------------------------------- */
const DROPN=new Set(['GRing','Impact','Crack','CrackStar','Streak','StarCut','BrushArc','TexArc','SoundArcs']);
class CastSigil{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.5},o);this.n=this.k==='baPharaoh'?'ringV':this.k==='bcSekhmet'?'ringR':this.k==='bbArmy'?'ringT':'ringG';this.c={ringV:'#9a4aff',ringR:'#ff5a3a',ringT:'#2ad0e8',ringG:'#ffd36a'}[this.n];this.__gt='-';}
  update(dt){this.t+=dt;return !this.dead&&this.t<this.life;}kill(){this.dead=1;}
  draw(){const k=cl(this.t/.15,0,1)*cl((this.life-this.t)/.15,0,1),[x,y]=P(player.x,player.y,0),w=104*(.75+.25*eO(cl(this.t/.3,0,1)));glowAt(x,y,w*1.3,w*1.3*K,this.c,.35*k);art(this.n,x,y,w,{flat:1,rot:this.t*1.4,a:.95*k});}}
function exRing(f){const x=f.x,y=f.y;ring({x,y,r0:10,r1:Math.max(40,f.r1||46),life:.4,w:5,pal:GOLD,segs:4,gap:.25});sprite({n:'ankh',x,y,follow:player,z:headZ()+10,w:14,life:.6,fi:.03,fo:.3,s0:.4,s1:1,pop:.16});}
function patchDecoy(f){f.__gt='-';
  f.update=function(dt){this.t+=dt;if(Math.random()<dt*7*(typeof Q!=='undefined'?Q.p:1))smoke(this.snap.x+R_(-8,8),this.snap.y,R_(4,22),1,SHADET,26,{sp:10,life:.8,rise:16});if(this.t>=this.life&&!this.dead)this.fade=true;return !this.dead&&this.t<this.life;};
  f.draw=function(){const k=eO(cl(this.t/.18,0,1)),a=cl((this.life-this.t)/.15,0,1),[x,y]=P(this.snap.x,this.snap.y,0),sx=player.x>this.snap.x?1:-1;
    ctx.save();ctx.globalAlpha=.3*a;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,15,5,0,0,TAU);ctx.fill();ctx.restore();glowAt(x,y-24,64,76,'#8a5ad0',.32*a);
    art('catS',x,y,30*(.6+.4*k),{ay:.98,a,sx,under:'#06030c',ua:.3});const [ex,ey]=P(this.snap.x+sx*4,this.snap.y,40*(.6+.4*k));glowAt(ex,ey,14,10,'#ffe08a',(.6+.3*Math.sin(this.t*9))*a);};
  f.shatter=function(){this.dead=true;self(()=>{smoke(this.snap.x,this.snap.y,16,6,SHADET,46,{sp:60,life:.8});flare(this.snap.x,this.snap.y,24,70,'#b07aff',.24);});};}
const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(n==='Trail')return {layer:'none',active:true,s:[],add(){},update(){return false;},draw(){}};
    if(n==='GRing'&&f.color==='#ffe9a8'){try{exRing(f);}catch(_){}return NOFX();}
    if(n==='Impact'&&f.color==='#ffe9a8'){try{const p=f.pos||[f.x,f.y,24];flare(p[0],p[1],p[2]||24,40,'#ffe89a',.2);}catch(_){}return NOFX();}
    if(n==='RuneCircle'&&f.color==='#6fc8ff'&&player.casting)return A0.call(this,new CastSigil({life:f.life||.5,k:player.casting.key}));
    if(n==='Decoy'&&mine()){try{patchDecoy(f);}catch(_){}}
    if(mine()&&DROPN.has(n))return NOFX();}
  return A0.apply(this,arguments);};
const EM0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune)$/.test(o.type))return;return EM0.apply(this,arguments);};
/* a taunted enemy strikes a servant: the servant recoils in a puff of sand (the old dust puff is filtered) */
{const PH0=window.jgPreHit;window.jgPreHit=function(e){let r=1;self(()=>{r=PH0?PH0.apply(this,arguments):1;});if(r===0&&e&&e.bTauntBy){const m=e.bTauntBy;m._hitT=gameTime;try{sandDust(m.x,m.y,2,{size:30,spd:50,life:.5});linen(m.x,m.y,34,1,{spd:60,up:60});}catch(_){}}return r;};}
/* the veil takes a blow / the sistrum rings */
{const AB0=window.jgAbsorb;window.jgAbsorb=function(d,e){const s0=BA.shield,r=AB0?AB0.apply(this,arguments):d;try{if(s0>0&&BA.shield<s0){BV.shHit=gameTime;sandDust(player.x,player.y,2,{ring:20,size:30,spd:40,life:.5});}
    if(bL('bnSistrum')&&gameTime-(BV.sisT??-9)>1.4){BV.sisT=gameTime;const sd=Math.cos(player.phi)<0?-1:1;sprite({n:'sistrum',x:player.x,y:player.y,follow:player,ox:sd*18,z:headZ()-18,w:11,life:.5,fi:.03,fo:.25,s0:.4,s1:1,pop:.14,tick:f=>{f.rot=Math.sin(f.t*40)*.25*(1-f.t/.5);}});
      ring({x:player.x,y:player.y,follow:1,r0:14,r1:34,life:.3,w:3,pal:GOLD,segs:3,gap:.3});}}catch(_){}return r;};}
ensure();
BV.ready=1;
})();
