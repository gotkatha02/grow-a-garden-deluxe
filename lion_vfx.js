/* =====================================================================
   OLYMPIAN WHITE LION (Zeus's heir) — skill effects v3: SVG art (lion_art.js) + code VFX.
   Owner 2026-11-21 "ทำของสิงโตต่อ": the same brief as the cat, kitsune, axolotl and dragon — every skill made with SVG + VFX,
   matching its concept and description, in step with the frame its damage lands. Kit: window.K3 (cat_vfx.js) + window.VK (wolf_vfx3.js).

   CONCEPT (LION_SKILLS_TH.md): a Greek white lion in a white toga with a blue Greek-key sash, a gold laurel crown, gold armbands crackling
   with lightning. Basic "Olympian Cub" = gold + laurel (Nemean Hide, Lion Pounce, Laurel Rest, King's Roar).
     A "Olympian Pankration" = gold + white marble + arena dust: cestus fists, the grab (gold paw + a grip ring on the held enemy),
       throws that trail through the air and smash the marble floor (crater, slabs, dust), the arena of columns. Glory 0–3 = medals.
     B "Thunder King" = sky-blue lightning + gold: javelins of lightning, sky strikes, Zeus's eagle, storm clouds, the aegis dome,
       Overcharge crackle, Charge 0–10 = bolt segments. C = its column; Ascension = lightning-feather wings; Keraunos = Zeus's bolt.

   HOW IT IS WIRED — gameplay is never touched:
   · The lion's own classes in char_lion.js are repainted through their prototypes (update = game, draw = new): LiShot (javelin /
     Keraunos), LiEagle (the eagle), LiArc (chain lightning), LiGround + LiTop (cloud, grip ring, medals, charge, aegis dome, buffs),
     LiBolt draws nothing — DBolt + boltHit are spawned when the game adds one. LiFling (throws) gets a trail + ground shadow piece.
   · lPow (hit flash) and lSlamFx (slams) are rebound; lSlamFx still calls the original (its shake + hit-stop keep the timing) with the
     old ring / dust filtered out.
   · Punches: each make() is wrapped; its punch events are read from the action and a fist lands EXACTLY on its event.
   · Engine rings (GRing → SoftRing) are exact-time markers (Nemean Hide, Laurel Rest, King's Roar, Static Body, Sky Strike,
     Arena Spin turns, Overcharge, Aegis, King of the Gods, Laurel Crown, Ascension) — each is replaced by its new piece.
   · ?vfx3=0 = the old painted look (char_lion_fx.js runs only then).
   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black ink shape behind so pale
   pieces read on snow; debris is shaped (marble slabs, gold laurel leaves, sparks), never round dots.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='lion'||!window.K3||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const HZK=window.HERO_K||1;   /* hero size (HERO_SIZE, 2026-11-25): hand / body heights of this file's pieces follow it */
const {PAL,TAU,cl,eO,eI,back,lerp,R_,rt,scr,rgba,tint,art,sprite,star,KGlint,KBurst,KRing,ring,KStreak,KArc,embers,dust,ensure}=window.K3;
const V=window.VK,{sys,tx,G}=V,A=window.KTA;
/* palettes: [ink, deep, mid, lite, core] */
const GLD=PAL.gold,BLT=['#06204a','#1f6fd8','#5ac8ff','#d8f4ff','#ffffff'],MRB=['#3a3630','#a89f8e','#e8e0d0','#faf6ee','#ffffff'],
  LAU=['#1e3a10','#4a8a2a','#9ad860','#e0f8c0','#ffffff'],FUR=['#3a2a10','#c8a060','#f4e6c8','#fffaf0','#ffffff'];
const LV3=window.LIV={on:1};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('lion');        /* no toon-layer charge glow / stretched lifetimes */
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75;
const mine=()=>!!(window.SKCTX||window.__ACTEV||LV3.slam);
const aKey=()=>{const a=player.action;return a?(a.key||''):'';};
const zOf=e=>e?(e.boss?40:26)+(e.z||0):26;
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const later=(s,f)=>setFxTimer(s,f);
const fwd=(d,phi=player.phi)=>[player.x+Math.cos(phi)*d,player.y+Math.sin(phi)*d];
const hand=(phi=player.phi,side=0)=>{const c=Math.cos(phi),s=Math.sin(phi);return [player.x+(c*17-s*side)*HZK,player.y+(s*17+c*side)*HZK,40*HZK+(player.z||0)];};
const isBolt=c=>c===LIC.bolt||c===LIC.bolt2||c==='#9adcff'||c==='#e8f8ff';
const patch=(C,o)=>{if(typeof C!=='function')return;for(const k in o){if(!C.prototype['_'+k+'0'])C.prototype['_'+k+'0']=C.prototype[k];C.prototype[k]=o[k];}};
const onUpd=(a,f)=>{const u=a.update;a.update=function(Ac,dt){const r=u?u.apply(this,arguments):undefined;try{f(Ac,dt);}catch(e){console.warn('lion fx',e);}return r;};};
const tgtOf=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:(nearestEnemy(player.x,player.y,(r||120)*1.15,player.phi)||nearestEnemy(player.x,player.y,(r||120)*1.15));

/* ---------------------------------------------------------------------
   1. DEBRIS — marble slabs (gravity, bounce, lie), gold laurel leaves, sparks, glow, ribbons, zaps
   --------------------------------------------------------------------- */
function slabs(x,y,n,o={}){const S=sys('top');for(let i=0;i<qn2(n);i++){const im=A.get('slab'+(i%3));if(!im)return;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||190)*R_(.35,1);
    S.add({im,asp:.75,x:x+R_(-6,6),y:y+R_(-4,4),z:o.z||3,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||260)*R_(.5,1.1),g:900,dr:.6,s0:R_(9,15)*(o.s||1),s1:R_(8,13)*(o.s||1),life:R_(.7,1.1),fo:.3,rot:R_(0,TAU),vr:R_(-12,12),bounce:.25});}}
function leaves(x,y,z,n,o={}){const im=A.get('leaf');if(!im)return;const S=o.S||sys(o.layer||'top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.9):R_(0,TAU),v=(o.spd||120)*R_(.4,1);
    S.add({im,asp:30/14,x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up==null?110:o.up)*R_(.5,1.1),g:o.g==null?200:o.g,dr:2.4,s0:R_(5,8)*(o.s||1),s1:R_(4,7)*(o.s||1),life:R_(.55,.9)*(o.life||1),fo:.4,rot:R_(0,TAU),vr:R_(-9,9),bounce:.1,delay:o.delay?R_(0,o.delay):0});}}
function sparks(x,y,z,n,col,o={}){const S=o.S||sys('top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||240)*R_(.4,1.1);
    S.add({im:tx('core',col),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(-.2,1)*(o.up||120)+30,dr:4,g:o.g==null?380:o.g,s0:R_(4,7)*(o.s||1),s1:1.5,life:(o.life||.4)*R_(.6,1.2),add:1,str:2.2,fo:.5});}}
/* one long-lived particle system per owner (shots, the eagle, flung enemies, the lion's own auras) instead of one per puff */
const ownS=(o,layer='top')=>{if(!o._S||!fx.includes(o._S))o._S=sys(layer,1);o._S.keep=o._S.t+1;return o._S;};   /* lives while its owner keeps asking, then 1 s more */
const bA=k=>{const b=player.buffs&&player.buffs[k];if(!b)return 0;return cl((b.total-b.t)/.25,0,1)*cl(b.t/.4,0,1);};   /* a buff piece fades in .25 s and out over the last .4 s */
/* PRE: pieces born on a hit start this far into their life, so they are already lit while hit-stop freezes the world on that frame */
const PRE=.035;
function flare(S,x,y,z,size,col,life=.28){S.add({im:tx('star',col),x,y,z,s0:size*.3,s1:size,life,fo:.6,add:1,rot:R_(-.2,.2),delay:-PRE});S.add({im:tx('core',col),x,y,z,s0:size*.9,s1:size*1.3,life:life*.8,fo:.8,add:1,delay:-PRE});}
function glow(x,y,r,col,a){if(a<=.01||r<1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a);ctx.drawImage(tx('glow',col),x-r,y-r,r*2,r*2);ctx.restore();}
function band(q,w,tn){const n=q.length;if(n<2)return;const N=[];for(let i=0;i<n;i++){const a=q[Math.min(n-1,i+1)],b=q[Math.max(0,i-1)];const dx=a[0]-b[0],dy=a[1]-b[1],d=Math.hypot(dx,dy)||1;N.push([-dy/d,dx/d]);}
  for(const [s,c,al] of tn){if(al<=0)continue;ctx.globalAlpha=Math.min(1,al);ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<n;i++){const ww=w[i]*s;ctx.lineTo(q[i][0]+N[i][0]*ww,q[i][1]+N[i][1]*ww);}for(let i=n-1;i>=0;i--){const ww=w[i]*s;ctx.lineTo(q[i][0]-N[i][0]*ww,q[i][1]-N[i][1]*ww);}ctx.closePath();ctx.fill();}ctx.globalAlpha=1;}
const tones=(p,a=1)=>[[1.55,p[0],.3*a],[1.15,p[1],.95*a],[.8,p[2],a],[.46,p[3],a],[.16,p[4],a]];
function runs(pts,pred){const out=[];let cur=null;for(let i=0;i<pts.length;i++){const ok=pred(pts[i]);if(ok){if(!cur){cur=[];if(i>0)cur.push(pts[i-1]);out.push(cur);}cur.push(pts[i]);}else if(cur){cur.push(pts[i]);cur=null;}}return out;}
function zaps(x,y,n,R,col,a){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';for(let i=0;i<n;i++){const a0=R_(0,TAU),L=R*R_(.5,1);let px=x+Math.cos(a0)*R*.2,py=y+Math.sin(a0)*R*.2;
    ctx.globalAlpha=a*R_(.6,1);ctx.strokeStyle=col;ctx.lineWidth=R_(1.2,2.2);ctx.beginPath();ctx.moveTo(px,py);for(let j=1;j<=4;j++){px=x+Math.cos(a0)*L*j/4+R_(-4,4);py=y+Math.sin(a0)*L*j/4*.8+R_(-4,4);ctx.lineTo(px,py);}ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=.8;ctx.stroke();}ctx.restore();}
class DZap{constructor(o){Object.assign(this,{t:0,layer:'top',life:.16,n:2,R:18,col:BLT[2]},o);}update(dt){this.t+=dt;if(this.e&&!this.e.dead){this.x=this.e.x;this.y=this.e.y;}return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);zaps(x,y,this.n,this.R,this.col,1-this.t/this.life);}}

/* ---------------------------------------------------------------------
   2. PIECES
   --------------------------------------------------------------------- */
/* a fist (gold cestus, or crackling blue for B) launched from the hand: it lands on its target EXACTLY `lead` seconds later */
class DFist{constructor(o){Object.assign(this,{t:0,layer:'top',lead:.07,stay:.05,fade:.1,w:38,n:'fistG',pal:GLD,arc:0,a0:1,tr:.7,delay:0},o);this.t=-this.delay;this.life=this.lead+this.stay+this.fade+.06;this.ph=R_(0,TAU);}
  pos(k){const [x0,y0,z0]=this.p0,[x1,y1,z1]=this.p1;let x=lerp(x0,x1,k),y=lerp(y0,y1,k);const z=lerp(z0,z1,k);if(this.arc){const s=Math.sin(Math.PI*k)*this.arc,dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1;x+=-dy/L*s;y+=dx/L*s;}return [x,y,z];}
  update(dt){this.t+=dt;if(this.t<0)return true;const e=this.e;if(e&&!e.dead&&this.t<=this.lead){const d=Math.hypot(e.x-this.p0[0],e.y-this.p0[1])||1;this.p1[0]=e.x-(e.x-this.p0[0])/d*e.r*.35;this.p1[1]=e.y-(e.y-this.p0[1])/d*e.r*.35;}return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,k=cl(t/this.lead,0,1),hold=this.stay+this.fade,f=cl((t-this.lead-this.stay)/this.fade,0,1),N=10,k0=Math.max(0,k-this.tr)+(t>this.lead?cl((t-this.lead)/hold,0,1)*Math.min(k,this.tr):0);
    const q=[];for(let i=0;i<=N;i++){const s=k0+(k-k0)*i/N,p=this.pos(s),[x,y]=P(p[0],p[1],p[2]);q.push([x,y]);}
    const a=this.a0*(1-f),h=q[N],pv=q[Math.max(0,N-2)],ang=Math.atan2(h[1]-pv[1],h[0]-pv[0]),flip=Math.cos(ang)<0,W=this.w,p=this.pal;
    if(a>.01){ctx.save();if(Math.hypot(h[0]-q[0][0],h[1]-q[0][1])>4){band(q,q.map((_,i)=>W*(.02+.12*i/N)),[[1.6,p[0],.22*a],[1,p[1],.7*a],[.62,p[2],.85*a],[.3,p[3],a]]);
        if(p===BLT)for(let i=2;i<N;i+=3)zaps(q[i][0],q[i][1],1,W*.3,BLT[3],a*.8);}
      const s=1+(t>this.lead?.16*Math.sin(Math.PI*cl((t-this.lead)/hold,0,1)):0);glow(h[0],h[1],W*.85,p[2],(this.n==='grab'?.22:.4)*a);art(this.n,h[0],h[1],W*s,{rot:ang,sy:flip?-1:1,ax:.88,a,under:p[0],ua:.35});ctx.restore();}
    const rk=(t-this.lead)/.16;if(rk>0&&rk<1){const [cx,cy]=P(...this.p1),rr=W*(.25+.55*eO(rk))*(this.big?1.35:1),al=1-rk;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.lineWidth=Math.max(1,W*.09*(1-rk));
      ctx.globalAlpha=al*.45;ctx.strokeStyle=p[1];ctx.beginPath();ctx.ellipse(W*.06*rk,0,rr*.32,rr,0,0,TAU);ctx.stroke();ctx.globalAlpha=al;ctx.strokeStyle=p[3];ctx.lineWidth*=.55;ctx.beginPath();ctx.ellipse(W*.06*rk,0,rr*.32,rr,0,-1.3,1.3);ctx.stroke();ctx.restore();
      if(rk<.4)star(cx,cy,W*.45*(1-rk/.4),p[3],ang);}}}
const fist=o=>addFx(new DFist(o));
function fistTo(e,lead,o={}){const phi=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,h=hand(phi,o.side||0);
  const p1=e?[e.x,e.y,zOf(e)+(o.dz||0)]:[player.x+Math.cos(phi)*62,player.y+Math.sin(phi)*62,32];
  return fist(Object.assign({p0:[h[0],h[1],o.z0!=null?o.z0:h[2]],p1,e,lead},o));}
/* power gathering at the hand for exactly the wind-up, a flash on release */
class DGather{constructor(o){Object.assign(this,{t:0,layer:'top',T:.1,pal:BLT,R:28,s:1,side:0},o);this.acc=0;this.S=sys('top',this.T+.25);}
  update(dt){this.t+=dt;const h=hand(player.phi,this.side);this.x=h[0];this.y=h[1];this.z=h[2];
    if(this.t<this.T){this.acc+=dt;while(this.acc>.014){this.acc-=.014;const a=R_(0,TAU),r=this.R*R_(.7,1.2),x=this.x+Math.cos(a)*r,y=this.y+Math.sin(a)*r*.6,z=this.z+R_(-12,12),T=Math.max(.05,this.T-this.t);
        this.S.add({im:tx('core',this.pal[2]),x,y,z,vx:(this.x-x)/T,vy:(this.y-y)/T,vz:(this.z-z)/T,s0:R_(3,5)*this.s,s1:1.5,life:T,fo:.3,add:1,str:1.4});}}
    return this.t<this.T+.08;}
  draw(){const k=cl(this.t/this.T,0,1),f=cl((this.t-this.T)/.08,0,1),[x,y]=P(this.x,this.y,this.z),r=(6+9*k)*this.s*(1+f*.9),a=(.3+.7*k)*(1-f);if(a<=.01)return;
    glow(x,y,r*2.2,this.pal[2],a*.8);glow(x,y,r,this.pal[4],a*.7);if(this.pal===BLT&&k>.3)zaps(x,y,1,r*1.4,BLT[3],a*.8);if(f>0)star(x,y,r*1.1*(1-f),this.pal[3],.4);}}
const gather=o=>addFx(new DGather(o));
/* Zeus's lightning: a jagged ribbon from the sky (or from the storm cloud), re-jagged every 50 ms, then it thins and lifts */
class DBolt{constructor(o){Object.assign(this,{t:.05,layer:'top',life:.42,H:230,pal:BLT,w:7},o);this.rej();this.acc=0;}
  rej(){const n=8;this.j=[];for(let i=0;i<=n;i++)this.j.push([i===0||i===n?0:R_(-1,1)*17*(.4+.6*Math.sin(Math.PI*i/n)),i/n]);this.br=[[R_(.22,.42),Math.random()<.5?1:-1,R_(20,32)],[R_(.5,.72),Math.random()<.5?1:-1,R_(14,24)]];}
  update(dt){this.t+=dt;this.acc+=dt;if(this.acc>.05&&this.t<.26){this.acc=0;this.rej();}return this.t<this.life;}
  draw(){const t=this.t,[x,y]=P(this.x,this.y,0),top=y-this.H,dn=eO(cl(t/.05,0,1)),th=t<.24?1:1-cl((t-.24)/.18,0,1),lift=t<.24?0:(t-.24)*240;if(th<=0)return;
    const q=this.j.map(([o,s])=>[x+o*this.w/7,top-lift*(1-s)+(y-top)*s*dn]),w=this.j.map(([o,s])=>this.w*th*(.32+.68*Math.sin(Math.PI*Math.min(1,s*1.15+.05))));
    ctx.save();glow(x,y-10,40+this.w*2,this.pal[2],.36*th);ctx.globalCompositeOperation='lighter';band(q,w,[[2.6,'#1f4fae',.38*th],[1.6,this.pal[1],.6*th]]);ctx.globalCompositeOperation='source-over';band(q,w,[[1,this.pal[2],th],[.55,this.pal[3],th],[.24,'#ffffff',th]]);
    for(const [f,sd,L] of this.br){const i=Math.floor(f*(q.length-1)),p=q[i];if(!p)continue;const b=[p,[p[0]+sd*L*.5,p[1]+L*.35],[p[0]+sd*L,p[1]+L*.8]];band(b,[2.4*th,1.6*th,.3],[[1.6,this.pal[1],.6*th],[1,this.pal[3],th],[.4,'#ffffff',th]]);}
    ctx.restore();}}
/* everything a bolt does where it lands (spawned once with it): flash, burst, Zeus's sigil flashing on the floor, marble chips, gold sparks */
function boltHit(x,y,o={}){const S=sys('top');flare(S,x,y,26,o.big?86:58,BLT[2],.24);addFx(new KBurst({x,y,z:22,R:o.big?38:26,n:11,life:.22,pal:BLT,ink:.45,t:PRE}));
  ring({x,y,r0:8,r1:o.big?90:60,w:6,pal:BLT,life:.34,segs:4,gap:.25,delay:-PRE});sparks(x,y,18,o.big?10:6,'#ffd86a',{spd:220,up:150});slabs(x,y,o.big?5:2,{spd:150,up:200,s:.8});
  sprite({n:'zeus',layer:'ground',x,y,z:0,w:o.big?70:48,flat:1,life:.42,fi:.02,fo:.3,s0:.5,s1:1.15,a:.85,rot:R_(-.3,.3),delay:-PRE});
  if(o.big)sprite({n:'crater',layer:'ground',x,y,z:0,w:120,flat:1,life:1.3,fi:.02,fo:.5,s0:.4,s1:1,pop:.1,a:.75,delay:-PRE});}
/* a slam on the marble: a cracked floor, slabs flying, dust of the ground's colour, a ring; gold flash for A */
function slamFx(x,y,R,o={}){const S=sys('top'),big=R>=110;sprite({n:'crater',layer:'ground',x,y,z:0,w:Math.max(80,R*1.6),flat:1,life:big?1.5:1.1,fi:.02,fo:.5,s0:.35,s1:1,pop:.1,a:.85,rot:R_(0,TAU),delay:-PRE});
  ring({x,y,r0:10,r1:R+8,w:8,pal:MRB,life:.38,segs:3,gap:.22,delay:-PRE});addFx(new KBurst({x,y,z:10,R:24+R*.25,n:9,life:.2,pal:GLD,ink:.35,t:PRE}));ring({x,y,r0:6,r1:R*.7,w:5,pal:GLD,life:.3,segs:4,gap:.3,delay:.04});
  slabs(x,y,Math.round(4+R/30),{spd:120+R,up:240+R});dust(x,y,Math.round(5+R/25),{ring:R*.3,spd:90+R*.6,size:34+R*.15,life:.65});flare(S,x,y,16,40+R*.4,'#ffd86a',.22);if(o.leaves!==false)leaves(x,y,20,4,{spd:150});
  if(big){/* the great throws (Twelfth Labor, Atlas Slam, the Labors' last throw): the arena floor rings like a bell, a column of gold light, more slabs */
    sprite({n:'meander',layer:'ground',x,y,z:0,w:R*1.9,flat:1,life:.9,fi:.02,fo:.6,s0:.55,s1:1.05,pop:.12,a:.8,rot:R_(0,TAU)});ring({x,y,r0:R*.5,r1:R*1.3,w:6,pal:GLD,life:.5,segs:5,gap:.35,delay:.08});
    sprite({layer:'top',x,y,z:0,life:.5,fo:.35,paint:(f,sx,sy,sc,al)=>{const H=170,W=26+R*.12;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(sx,sy-H,sx,sy);g.addColorStop(0,'rgba(255,216,106,0)');g.addColorStop(.7,`rgba(255,216,106,${.32*al})`);g.addColorStop(1,`rgba(255,248,216,${.6*al})`);
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sx-W*.5,sy);ctx.lineTo(sx-W*.25,sy-H);ctx.lineTo(sx+W*.25,sy-H);ctx.lineTo(sx+W*.5,sy);ctx.closePath();ctx.fill();ctx.restore();}});
    slabs(x,y,4,{spd:220,up:380,s:1.3});leaves(x,y,30,6,{spd:220,up:200});}}
/* Gaia's Crack: the floor splits along a line from the landing point, a gold seam glowing in it, slabs jumping up one after another */
class DCrack{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.3,len:200,w:9},o);const n=12;this.q=[];let off=0;for(let i=0;i<=n;i++){if(i)off=cl(off+R_(-1,1)*9,-16,16);this.q.push([i/n,off]);}
    this.br=[];for(let i=2;i<n;i+=2)this.br.push([i/n,Math.random()<.5?1:-1,R_(12,26),R_(.5,1.1)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  w2(u,o){const c=Math.cos(this.phi),s=Math.sin(this.phi);return P(this.x+c*u*this.len-s*o,this.y+s*u*this.len+c*o,0);}
  draw(){const k=eO(cl(this.t/.22,0,1)),f=cl((this.t-(this.life-.45))/.45,0,1);if(f>=1)return;const pts=this.q.filter(([u])=>u<=k+.001).map(([u,o])=>this.w2(u,o));if(pts.length<2)return;
    const line=(w,col,al)=>{ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
      for(const [u,sd,L,an] of this.br){if(u>k)continue;const i=Math.round(u*(this.q.length-1)),o=this.q[i][1],p=this.w2(u,o),e=this.w2(u+.06,o+sd*L);ctx.lineWidth=w*.55;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo((p[0]+e[0])/2+sd*3,(p[1]+e[1])/2);ctx.lineTo(e[0],e[1]);ctx.stroke();}};
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';line(this.w*1.8,'#1a1208',.35*(1-f));line(this.w,'#2a2014',.9*(1-f));ctx.globalCompositeOperation='lighter';line(this.w*.4,'#ffb020',.8*(1-f));line(this.w*.15,'#fff3c0',1-f);ctx.restore();}}
function crackLine(x,y,phi,len){addFx(new DCrack({x,y,phi,len}));for(let i=1;i<=5;i++){const d=len*i/5,px=x+Math.cos(phi)*d,py=y+Math.sin(phi)*d;later(.03*i,()=>{slabs(px,py,2,{spd:70,up:260,s:.9});dust(px,py,2,{spd:50,size:30,life:.5});});}}
/* the grip on a held enemy: a gold Greek-key ring round its waist, back half behind it, front half in front */
function gripRing(e,front,t){if(!e||e.dead)return;const [x,y]=P(e.x,e.y,(e.boss?36:22)+(e.z||0)),R=e.r+10;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(t*1.8);
  ctx.beginPath();if(front)ctx.rect(-R*1.3,0,R*2.6,R*1.3);else ctx.rect(-R*1.3,-R*1.3,R*2.6,R*1.3);ctx.restore();ctx.save();ctx.translate(x,y);ctx.scale(1,K);
  const im=A.get('meander');ctx.beginPath();if(front)ctx.rect(-R*1.3,0,R*2.6,R*1.3);else ctx.rect(-R*1.3,-R*1.3,R*2.6,R*1.3);ctx.clip();ctx.rotate(t*1.8);if(im){ctx.globalAlpha=front?.95:.6;ctx.drawImage(im,-R*1.08,-R*1.08,R*2.16,R*2.16);}ctx.restore();}
/* trail + ground shadow of a thrown enemy (Suplex, Arena Spin's release, Titan Lift, Titan Toss, the Twelfth Labor, Counter Hold) */
class DFling{constructor(o){Object.assign(this,{t:0,layer:'top'},o);this.h=[];this.acc=0;}
  update(dt){const F=this.f,e=F.e;this.t+=dt;if(e&&!e.dead){this.h.unshift([e.x,e.y,(e.z||0)+(e.boss?30:20)]);if(this.h.length>12)this.h.length=12;this.acc+=dt;if(this.acc>.04&&(e.z||0)>8){this.acc=0;leaves(e.x,e.y,(e.z||0)+10,1,{spd:30,up:20,g:120,s:.8,S:ownS(this)});}}
    if(!fx.includes(F)&&!this.end){this.end=this.t;}return !this.end||this.t-this.end<.12;}
  draw(){const q=this.h.map(([x,y,z])=>{const s=P(x,y,z);return [s[0],s[1]];});if(q.length<3)return;const a=this.end?1-(this.t-this.end)/.12:1;ctx.save();ctx.globalCompositeOperation='lighter';
    band(q,q.map((_,i)=>7*(1-i/q.length)),[[1,'#ffb020',.35*a],[.5,'#fff3c0',.6*a]]);ctx.restore();}}
class DFlingShadow{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}
  update(dt){this.t+=dt;return fx.includes(this.f);}
  draw(){const e=this.f.e;if(!e||e.dead)return;const [x,y]=P(e.x,e.y,0),z=e.z||0,s=1/(1+z/90);ctx.save();ctx.globalAlpha=.35*s;ctx.fillStyle='#1a1408';ctx.beginPath();ctx.ellipse(x,y,(e.r+6)*s,(e.r+6)*s*K*.6,0,0,TAU);ctx.fill();ctx.restore();}}
/* the lion's spirit (King's Roar, Nemean Hide): rises BEHIND the lion (ground layer), shakes as it roars */
function spirit(x,y,o={}){const z=o.z||72,w=o.w||116;sprite({layer:'ground',follow:player,x,y:y-4,oy:-4,z:z-6,life:(o.life||.75)*.9,fo:.4,paint:(f,sx,sy,sc,a)=>glow(sx,sy,w*.8,o.col||'#ffb020',.32*a)});
  sprite({n:o.n||'lionHead',layer:'ground',follow:player,oy:-4,x,y:y-4,z,w,life:o.life||.75,fi:.04,fo:.4,s0:.45,s1:1,pop:.16,a:o.a||.92,tick:f=>{f.rot=Math.sin(f.t*60)*.03*(1-cl(f.t/.4,0,1));}});}
/* the aegis / counter stance: a gold lion shield standing in front of the lion */
class DShield{constructor(o){Object.assign(this,{t:0,layer:'sorted',T:1,w:44,n:'aegisE',done:()=>false},o);this.flash=0;}
  get sy(){return player.y+Math.sin(player.phi)*16+1;}
  update(dt){this.t+=dt;this.flash=Math.max(0,this.flash-dt*3);if(!this.end&&(this.t>this.T||this.done())){this.end=this.t;}return !this.end||this.t-this.end<.25;}
  pos(){return [player.x+Math.cos(player.phi)*16*HZK,player.y+Math.sin(player.phi)*16*HZK,30*HZK+(player.z||0)];}
  draw(){const t=this.t,g=back(cl(t/.13,0,1)),f=this.end?cl((t-this.end)/.25,0,1):0,[x,y]=P(...this.pos()),a=1-f,w=this.w*g*(1+this.flash*.25);if(a<=.01)return;
    glow(x,y,w*1.1,'#ffd23a',(.3+.6*this.flash)*a);art(this.n,x,y,w,{a,under:'#3a2206',ua:.3});if(this.flash>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=this.flash*.8;art(this.n,x,y,w,{});ctx.restore();}}}
/* the arena of Labors of Heracles: Doric columns rise round the circle, a Greek-key ring on the floor */
class DColumn{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:3,w:22,delay:0},o);this.t=-this.delay;}
  get sy(){return this.y+2;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,up=back(cl(t/.25,0,1)),f=cl((t-(this.life-.35))/.35,0,1),[x,y]=P(this.x,this.y,0),[aw,ah]=A.size('column'),h=this.w*ah/aw*up*(1-f*.8),a=1-f*.6;if(h<2)return;
    ctx.save();ctx.globalAlpha=.3*a;ctx.fillStyle='#1a1408';ctx.beginPath();ctx.ellipse(x,y,this.w*.7,this.w*.7*K*.5,0,0,TAU);ctx.fill();ctx.restore();art('column',x,y-h/2,this.w,{a,sy:h/(this.w*ah/aw)||1});}}

/* Heracles Shove: a crescent of force rolling forward from the palms, through the target and past it, with speed lines and dust */
class DPush{constructor(o){Object.assign(this,{t:0,layer:'top',life:.34,r0:34,r1:190,span:.72,W:26,z:24,pal:GLD},o);this.sl=Array.from({length:5},()=>[R_(-.8,.8),R_(.5,1),R_(0,.25)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,r=lerp(this.r0,this.r1,eO(k)),W=this.W*(1-k*.55),a=Math.min(1,k/.12)*(1-cl((k-.35)/.65,0,1)),N=20,p=this.pal;if(a<=.01)return;
    const q=[],w=[];for(let i=0;i<=N;i++){const s=i/N,th=this.phi-this.span+2*this.span*s,pr=Math.pow(Math.sin(Math.PI*s),.7),rr=r-W*pr*.5;q.push(P(this.x+Math.cos(th)*rr,this.y+Math.sin(th)*rr,this.z));w.push(W*pr*.5+.3);}
    ctx.save();band(q,w,[[1.5,p[0],.28*a],[1,p[1],.8*a],[.68,p[2],.95*a],[.38,p[3],a],[.14,p[4],a]]);
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(const [o,L,d] of this.sl){const kk=cl((k-d)/(1-d),0,1);if(kk<=0||kk>=1)continue;const th=this.phi+o*this.span,r1=r-W*.2,r0=r1-60*L*(1-kk*.5),
        [x0,y0]=P(this.x+Math.cos(th)*r0,this.y+Math.sin(th)*r0,this.z+o*10),[x1,y1]=P(this.x+Math.cos(th)*r1,this.y+Math.sin(th)*r1,this.z+o*10);
      ctx.globalAlpha=a*(1-kk)*.9;ctx.strokeStyle=p[3];ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}ctx.restore();}}
/* Arena Spin: streaks of gold and dust whirling round the lion — the back half on the ground layer (behind him), the front half on top */
class DWhirl{constructor(o){Object.assign(this,{t:0,layer:'top',front:1,S:null},o);}
  update(dt){const S=this.S;if(this.front){S.t+=dt;if(!S.end&&!S.until())S.end=S.t;}return !S.end||S.t-S.end<.22;}
  draw(){const S=this.S,a=Math.min(1,S.t/.12)*(S.end?1-cl((S.t-S.end)/.22,0,1):1);if(a<=.01)return;const px=player.x,py=player.y;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    for(const b of S.b){const th1=b.o+S.t*b.v,n=10,pts=[];for(let i=0;i<=n;i++){const th=th1-b.L*(1-i/n);pts.push([th,P(px+Math.cos(th)*b.R,py+Math.sin(th)*b.R*.92,b.z+Math.sin(th*2+b.o)*3)]);}
      for(const run of runs(pts,([th])=>(Math.sin(th)>=0)===!!this.front)){if(run.length<2)continue;const q=run.map(r=>r[1]),i0=pts.indexOf(run[0]);
        const w=q.map((_,i)=>b.w*(.15+.85*Math.pow((i0+i)/n,1.4)));if(b.add)ctx.globalCompositeOperation='lighter';else ctx.globalCompositeOperation='source-over';
        band(q,w,b.add?[[1.4,b.c[0],.35*a],[.8,b.c[1],.8*a],[.3,b.c[2],a]]:[[1,b.c[0],.45*a],[.55,b.c[1],.55*a]]);}}
    ctx.restore();}}
function whirl(until){const tint=(window.K3.dustTint?window.K3.dustTint(player.x,player.y):'#efe6d2|#a89474').split('|');
  const S={t:0,until,b:[]};for(let i=0;i<9;i++){const gold=i<5;S.b.push({o:R_(0,TAU),v:R_(15,20),L:R_(1.1,2),R:gold?R_(46,72):R_(60,92),z:gold?R_(14,46):R_(4,14),w:gold?R_(2.6,4.2):R_(5,8),add:gold,c:gold?[GLD[1],GLD[3],'#ffffff']:[tint[1],tint[0]]});}
  addFx(new DWhirl({S,front:0,layer:'ground'}));addFx(new DWhirl({S,front:1,layer:'top'}));return S;}

/* ---------------------------------------------------------------------
   3. HIT FLASHES — from the damage moment (lPow), by element
   --------------------------------------------------------------------- */
function hitFx(e,big,bolt){if(!e)return;const now=gameTime;if(e._lvT&&now-e._lvT<.045&&!big)return;e._lvT=now;const p=bolt?BLT:GLD,x=e.x,y=e.y,z=zOf(e);
  addFx(new KBurst({x,y,z,R:big?30:18,n:big?10:7,life:big?.24:.17,pal:p,ink:.42,e,t:PRE}));if(big)addFx(new KGlint({x,y,z:z+4,s:20,col:p[3],life:.2,e,delay:-PRE}));
  if(bolt){sparks(x,y,z,big?7:4,BLT[3],{spd:220});addFx(new DZap({x,y,z,life:.16,n:big?3:2,R:big?26:18,e}));}
  else{leaves(x,y,z,big?4:2,{spd:140});sparks(x,y,z,big?5:3,'#ffd86a',{spd:200});if(big)dust(x,y,3,{spd:70,size:26,life:.45});}}
window.lPow=function(e,big,col){try{hitFx(e,big,isBolt(col));}catch(x){console.warn('lion hit fx',x);}};
const _slam=window.lSlamFx;
window.lSlamFx=function(x,y,R){try{slamFx(x,y,R);if(LV3.crack&&gameTime<LV3.crack.until&&R===90){crackLine(x,y,LV3.crack.phi,LB.laCrack.len);LV3.crack=null;}}catch(e){console.warn('lion slam',e);}LV3.slam=1;try{return _slam.apply(this,arguments);}finally{LV3.slam=0;}};

/* ---------------------------------------------------------------------
   4. THE LION'S OWN PIECES, REPAINTED (update = game, draw = new)
   --------------------------------------------------------------------- */
/* lightning javelin / Keraunos: the art aimed along the flight, a wake of lightning, crackles */
patch(LiShot,{update(dt){const r=this._update0(dt);if(!this._h)this._h=[];this._h.unshift([this.x,this.y]);if(this._h.length>9)this._h.length=9;
    if(Math.random()<.5)sparks(this.x,this.y,this.z,this.big?2:1,this.big?'#ffffff':BLT[3],{spd:60,dir:this.phi+Math.PI,spread:.8,g:0,life:.25,S:ownS(this)});
    if(!r&&!this._end){this._end=1;addFx(new DZap({x:this.x,y:this.y,z:this.z,life:.16,n:3,R:this.big?30:18}));}return r;},
  draw(){const [x,y]=P(this.x,this.y,this.z),ang=scr(this.phi),flip=Math.cos(ang)<0,big=this.big,W=big?190:104,a=Math.min(1,(this.t||0)/.04);
    const H=this._h||[];if(H.length>2){const q=H.map(([hx,hy])=>{const s=P(hx,hy,this.z);return [s[0],s[1]];});ctx.save();ctx.globalCompositeOperation='lighter';band(q,q.map((_,i)=>(big?14:6)*(1-i/q.length)),[[1,'#1f6fd8',.5*a],[.5,'#d8f4ff',.8*a]]);ctx.restore();}
    glow(x,y,big?70:30,BLT[2],.45*a);art(big?'keraunos':'javelin',x,y,W,{rot:ang,sy:flip?-1:1,ax:big?.6:.86,a,under:BLT[0],ua:.3});zaps(x,y,big?3:1,big?36:16,BLT[3],a*.9);}});
/* the eagle of Zeus: golden, wings beating, facing its flight, lightning trailing */
patch(LiEagle,{update(dt){const px=this.x,pz=this.z,r=this._update0(dt);const dx=this.x-px;if(Math.abs(dx)>.3)this._fl=dx<0;this._dz=this.z-pz;
    this._acc=(this._acc||0)+dt;if(this._acc>.05){this._acc=0;sparks(this.x,this.y,this.z,1,BLT[3],{spd:40,g:0,life:.3,S:ownS(this)});}return r;},
  draw(){const [x,y]=P(this.x,this.y,this.z),fr=Math.floor(this.t/.07)%2,dive=(this._dz||0)<-2;glow(x,y,26,'#ffd86a',.4);
    art(fr&&!dive?'eagle1':'eagle0',x,y,66,{sx:this._fl?-1:1,rot:dive?(this._fl?-.5:.5):0,under:'#3a2206',ua:.3});}});
patch(LiBolt,{draw(){}});
/* chain lightning (Thunder Knuckle, Static Body, Static Field, Aegis) */
patch(LiArc,{draw(){const k=this.t/this.life,a=1-k,[x0,y0]=P(this.a[0],this.a[1],36),[x1,y1]=P(this.b[0],this.b[1],30);
    const n=7,q=[],w=[];for(let i=0;i<=n;i++){const s=i/n,j=(i===0||i===n)?0:R_(-1,1)*10;q.push([lerp(x0,x1,s)+j,lerp(y0,y1,s)+j*.6]);w.push(2.8*(.4+.6*Math.sin(Math.PI*s))*a+.4);}
    ctx.save();ctx.globalCompositeOperation='lighter';band(q,w,[[2.4,'#1f4fae',.38*a]]);ctx.globalCompositeOperation='source-over';band(q,w,[[1,BLT[2],a],[.5,BLT[3],a],[.22,'#ffffff',a]]);ctx.restore();glow(x1,y1,20,BLT[2],.5*a);}});

/* the lion's ground layer: storm-cloud shadow (+ Thunderhead's crackling mist), Laurel Crown ring, Laurel Rest glow, back halves (grip, eagle guard, wings) */
const AETOS=(t)=>{const an=t*3;return [player.x+Math.cos(an)*44*HZK,player.y+Math.sin(an)*26*HZK,(player.z||0)+64*HZK,Math.sin(an),an];};
function drawAetos(t,front){if(!hasBuff('lbAetos'))return;const [x,y,z,s,an]=AETOS(t);if((s>0)!==front)return;const [sx,sy]=P(x,y,z);glow(sx,sy,18,'#ffd86a',.4);
  art(Math.floor(t/.08)%2?'eagle1':'eagle0',sx,sy,34,{sx:Math.cos(an+Math.PI/2)<0?-1:1});}
function drawWings(t,front){if(!hasBuff('lcAscend')||front)return;const a=bA('lcAscend'),[x,y]=P(player.x,player.y,(player.z||0)+46*HZK),fl=Math.sin(t*3)*.12;
  glow(x,y-6*HZK,60*HZK,'#ffd86a',.22*a);art('wing',x+6*HZK,y,70*HZK,{ax:.1,ay:.85,rot:-.15+fl,a:a*.92});art('wing',x-6*HZK,y,70*HZK,{ax:.1,ay:.85,sx:-1,rot:.15-fl,a:a*.92});}
patch(LiGround,{draw(){const t=this.t,C=LI.cloud;
    if(C){const [x,y]=P(C.x,C.y,0),a=cl((gameTime-(C._t0||(C._t0=gameTime)))/.3,0,1)*cl((C.until-gameTime)/.4,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,C.R);g.addColorStop(0,'rgba(20,28,56,.42)');g.addColorStop(1,'rgba(20,28,56,0)');
      ctx.globalAlpha=a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,C.R,0,TAU);ctx.fill();if(C.slow){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#5ac8ff';ctx.lineWidth=1.6;ctx.globalAlpha=.35*a;ctx.setLineDash([6,10]);ctx.lineDashOffset=-t*30;ctx.beginPath();ctx.arc(0,0,C.R*.92,0,TAU);ctx.stroke();}ctx.restore();
      if(C.slow&&Math.random()<.3){const an=R_(0,TAU),d=C.R*Math.sqrt(Math.random()),[zx,zy]=P(C.x+Math.cos(an)*d,C.y+Math.sin(an)*d*.9,4);zaps(zx,zy,1,12,BLT[2],.7*a);}}
    if(hasBuff('lcCrown')){const a=bA('lcCrown'),[x,y]=P(player.x,player.y,0);art('laurelG',x,y,96,{flat:1,a:a*.7,rot:t*.3});}
    if(hasBuff('lnRest')){const a=bA('lnRest'),[x,y]=P(player.x,player.y,0);glow(x,y,46,'#9ad860',.28*a);}
    const h=lHeld();if(h)gripRing(h,false,t);drawAetos(t,false);drawWings(t,false);}});
/* the lion's top layer: glory medals, charge segments, held grip (front half), aegis dome, eagle guard, Overcharge / Hide auras, laurels, storm cloud */
patch(LiTop,{update(dt){const r=this._update0(dt);try{this.acc=(this.acc||0)+dt;if(this.acc>=.05){this.acc=0;
      if(hasBuff('lnHide')&&Math.random()<.35)leaves(player.x+R_(-14,14),player.y+R_(-6,6),R_(10,60),1,{spd:20,up:40,g:-20,life:.9,s:.8,S:ownS(this)});
      if(hasBuff('lnRest')&&Math.random()<.5)G.glints(ownS(this),player.x,player.y,14,1,22,'#d8ffb0',.8);
      if(hasBuff('lcCrown')&&Math.random()<.25)leaves(player.x+R_(-30,30),player.y+R_(-20,20),R_(4,30),1,{spd:10,up:50,g:-30,life:1,s:.7,S:ownS(this)});
      if(hasBuff('lcAscend')&&Math.random()<.5)sparks(player.x+R_(-16,16),player.y+R_(-8,8),R_(20,70),1,'#ffe89a',{spd:30,up:80,g:-60,life:.5,S:ownS(this)});}}catch(e){}return r;},
  draw(){const t=this.t,pz=(player.z||0)+96*(typeof CHAR_SCALE==='number'?CHAR_SCALE:1),[x,y]=P(player.x,player.y,pz);
    /* Glory 0–3: gold laurel medals */
    if(LI.glory>0)for(let i=0;i<LI_BAL.glory.cap;i++){const on=i<LI.glory,px=x+(i-1)*15,py=y-(on&&i===LI.glory-1?(LI.gloryPop||0)*4:0);if(on){glow(px,py,10,'#ffd86a',.45);art('medal',px,py,13);}
      else{ctx.save();ctx.globalAlpha=.4;const im=tint('medal','#1a1408');if(im)ctx.drawImage(im,px-5.5,py-5.5,11,11);ctx.restore();}}
    /* Charge 0–10: ten bolt segments in an arc */
    if(LI.charge>0){const full=LI.charge>=LI_BAL.charge.cap,yy=y+(LI.glory>0?14:0);ctx.save();for(let i=0;i<LI_BAL.charge.cap;i++){const on=i<LI.charge,an=(i-4.5)*.13,px=x+Math.sin(an)*44,py=yy-Math.cos(an)*10+10;
        ctx.save();ctx.translate(px,py);ctx.rotate(an);ctx.beginPath();ctx.moveTo(-1.5,-5);ctx.lineTo(2.5,-5);ctx.lineTo(.5,-.5);ctx.lineTo(3,-.5);ctx.lineTo(-2,5.5);ctx.lineTo(-.5,.8);ctx.lineTo(-3,.8);ctx.closePath();
        ctx.globalAlpha=on?1:.38;ctx.fillStyle=on?(full?'#ffffff':BLT[2]):'#0a1428';ctx.fill();ctx.restore();}ctx.restore();if(full){glow(x,yy+6,30,BLT[2],.35+.15*Math.sin(t*10));if(Math.random()<.3)zaps(x+R_(-40,40),yy+8,1,10,BLT[3],.8);}}
    const h=lHeld();if(h)gripRing(h,true,t);
    /* Aegis Flash: a dome of lightning with the lion shield on its front */
    if(LI.aegis>0){const [ax,ay]=P(player.x,player.y,0),R=46;if((LV3.aeg||0)>LI.aegis)LV3.aegF=1;LV3.aeg=LI.aegis;LV3.aegF=Math.max(0,(LV3.aegF||0)-.05);
      ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(ax,ay-R*.5,R*.2,ax,ay-R*.4,R*1.1);g.addColorStop(0,'rgba(90,200,255,0)');g.addColorStop(.75,`rgba(90,200,255,${.12+LV3.aegF*.3})`);g.addColorStop(1,`rgba(216,244,255,${.45+LV3.aegF*.4})`);
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(ax,ay,R,R*1.15,0,Math.PI,TAU);ctx.ellipse(ax,ay,R,R*K*.55,0,0,Math.PI);ctx.fill();ctx.strokeStyle=`rgba(216,244,255,${.5+LV3.aegF*.5})`;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(ax,ay,R,R*1.15,0,Math.PI,TAU);ctx.stroke();ctx.restore();
      if(Math.random()<.25)zaps(ax+R_(-R,R)*.8,ay-R_(10,R),1,12,BLT[3],.8);for(let i=0;i<LI.aegis;i++)art('aegisE',ax+(i-(LI.aegis-1)/2)*16,ay-R*1.15-6,14,{a:.95});}else LV3.aeg=0;
    drawAetos(t,true);
    /* Overcharge: crackling blue on the body; Olympian Ascension: gold crackle */
    if(hasBuff('lbOver')||hasBuff('lcAscend')){const asc=hasBuff('lcAscend'),[bx,by]=P(player.x,player.y,(player.z||0)+38*HZK);glow(bx,by,46*HZK,asc?'#ffd86a':BLT[2],.2+.07*Math.sin(t*9));if(Math.random()<.5)zaps(bx+R_(-16,16),by+R_(-30,20),1,18,asc?'#fff3a0':BLT[3],.9);}
    /* Nemean Hide: the gold of the lion's pelt shimmering on the body */
    if(hasBuff('lnHide')){const a=bA('lnHide'),[bx,by]=P(player.x,player.y,(player.z||0)+36*HZK);glow(bx,by,40*HZK,'#ffc23a',(.18+.06*Math.sin(t*7))*a);}
    /* Laurel Rest: a green-gold wreath turning over the head, healing light rising */
    if(hasBuff('lnRest')){const a=bA('lnRest'),[lx,ly]=P(player.x,player.y,pz-6);art('laurel',lx,ly,46,{flat:1,rot:t*.8,a:a*.95});}
    /* Laurel Crown: the gold crown worn on the head */
    if(hasBuff('lcCrown')){const a=bA('lcCrown'),[cx,cy]=P(player.x,player.y,pz-14);glow(cx,cy,16,'#ffd86a',.3*a);art('crownL',cx,cy,30,{a});}
    /* the storm cloud of Olympus hanging over its area */
    const C=LI.cloud;if(C){const a=cl((gameTime-(C._t0||gameTime))/.3,0,1)*cl((C.until-gameTime)/.4,0,1),[sx,sy]=P(C.x,C.y,150),W=C.R*1.6;art('storm',sx-W*.28,sy+6,W*.7,{a:a*.8,sx:-1});art('storm',sx,sy,W,{a:a*.92});art('storm',sx+W*.32,sy+8,W*.62,{a:a*.8});
      if(Math.random()<.15)zaps(sx+R_(-W*.4,W*.4),sy+R_(0,14),1,16,BLT[3],.8*a);}}});

/* ---------------------------------------------------------------------
   5. ENGINE PIECES THE LION MAKES — rings are exact-time markers, the rest is swallowed
   --------------------------------------------------------------------- */
const near=(x,y)=>Math.hypot(x-player.x,y-player.y)<6;
function ringMark(f){const c=f.color,r=f.r1;
  if(c===LIC.marble&&LV3.slam)return 1;                                                         /* every slam ring: slamFx drew its own */
  if(c===LIC.marble&&r===54){spirit(f.x,f.y,{w:96,z:62,a:.75,life:.6});ring({x:f.x,y:f.y,r0:10,r1:60,w:6,pal:GLD,life:.4,segs:4,gap:.25});leaves(f.x,f.y,30,8,{spd:120,up:140});return 1;}   /* Nemean Hide */
  if(c==='#9aff9a'){ring({x:f.x,y:f.y,r0:10,r1:62,w:5,pal:LAU,life:.42,segs:4,gap:.25});const S=sys('top');G.glints(S,f.x,f.y,20,10,34,'#d8ffb0',.9);leaves(f.x,f.y,60,6,{spd:60,up:60,g:60});return 1;}   /* Laurel Rest */
  if(c===LIC.gold&&r===LB.lnRoar.R){spirit(f.x,f.y);for(let i=0;i<2;i++)ring({x:f.x,y:f.y,r0:24,r1:r*(1-.15*i),w:5-i*1.5,pal:GLD,life:.5,segs:6+i,gap:.4,delay:i*.1});dust(f.x,f.y,8,{ring:30,spd:120,size:40,life:.6});leaves(f.x,f.y,40,8,{spd:200,up:140});return 1;}   /* King's Roar */
  if(c===LIC.bolt&&r===LB.lbStatic.R){ring({x:f.x,y:f.y,r0:10,r1:r,w:5,pal:BLT,life:.3,segs:5,gap:.35});addFx(new DZap({x:f.x,y:f.y,z:36,life:.2,n:5,R:40}));return 1;}   /* Static Body */
  if(c===LIC.bolt&&r===LB.lbSky.R){ring({x:f.x,y:f.y,r0:6,r1:r,w:5,pal:BLT,life:.32,segs:4,gap:.3});return 1;}   /* Sky Strike area */
  if(c===LIC.marble&&r===LB.laSpin.R){ring({x:f.x,y:f.y,r0:r*.4,r1:r,w:4,pal:MRB,life:.3,segs:5,gap:.45});dust(f.x,f.y,6,{ring:r*.55,spd:90,size:30,life:.5});return 1;}   /* Arena Spin, every turn */
  if(c===LIC.bolt&&r===110){ring({x:f.x,y:f.y,r0:10,r1:r,w:8,pal:BLT,life:.45,segs:4,gap:.2});sprite({n:'meanderZ',layer:'ground',x:f.x,y:f.y,z:0,w:150,flat:1,life:.8,fi:.03,fo:.5,s0:.4,s1:1,pop:.14,spin:1.2,a:.85});return 1;}   /* Overcharge */
  if(c===LIC.bolt&&r===56){ring({x:f.x,y:f.y,r0:10,r1:60,w:5,pal:BLT,life:.4,segs:4,gap:.25});addFx(new DZap({x:f.x,y:f.y,z:40,life:.3,n:6,R:40}));return 1;}   /* Aegis Flash */
  if(c===LIC.bolt&&Math.abs(r-LB.lbWrath.R*.6)<1){addFx(new DBolt({x:f.x,y:f.y,w:16,life:.55,H:300}));boltHit(f.x,f.y,{big:true});sprite({n:'meanderZ',layer:'ground',x:f.x,y:f.y,z:0,w:r*2,flat:1,life:1,fi:.02,fo:.6,s0:.5,s1:1.05,pop:.1,a:.9});return 1;}   /* King of the Gods */
  if(c===LIC.gold&&r===70){ring({x:f.x,y:f.y,r0:10,r1:70,w:6,pal:GLD,life:.45,segs:4,gap:.25});leaves(f.x,f.y,80,10,{spd:90,up:60,g:90});return 1;}   /* Laurel Crown */
  if(c===LIC.gold&&r===130){LV3.ascT=gameTime;ring({x:f.x,y:f.y,r0:10,r1:130,w:9,pal:GLD,life:.5,segs:4,gap:.2});spirit(f.x,f.y,{w:124,z:78,life:.9});const S=sys('top');flare(S,f.x,f.y,50,110,'#ffd86a',.3);leaves(f.x,f.y,40,14,{spd:220,up:200});return 1;}   /* Olympian Ascension */
  return 0;}
if(!window._liv3h){window._liv3h=1;const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
      if(n==='HitCrescents'||n==='PuffDust')return f;
      if(f instanceof LiBolt){try{const C=LI.cloud,fromCloud=C&&Math.hypot(f.x-C.x,f.y-C.y)<=C.R+30,big=(f.w||4)>=10;
          if(!big){addFx(new DBolt({x:f.x,y:f.y,H:fromCloud?150:230}));boltHit(f.x,f.y,{big:false});}}catch(_){}}
      else if(f instanceof LiFling){try{A0(new DFling({f}));A0(new DFlingShadow({f}));}catch(_){}}
      else if(/^(SoftRing|GRing)$/.test(n)){if(f.color==='#ffe9a8'){A0(new KRing({x:f.x,y:f.y,r0:f.r0||10,r1:f.r1||46,w:5,pal:GLD,life:f.life||.32,segs:4,gap:.3}));return f;}
        if(mine()||near(f.x,f.y)){try{if(ringMark(f))return f;}catch(e){console.warn('lion ring',e);}}}
      else if(/^(SoftImpact|Impact)$/.test(n)){const q=f.pos||[f.x,f.y,24];if(f.color==='#ffe9a8'){A0(new KGlint({x:q[0],y:q[1],z:q[2],s:14,col:GLD[3],life:.16}));leaves(q[0],q[1],q[2],2,{spd:120});return f;}if(mine())return f;}
      else if(n==='GLight'&&mine())return f;}
    return A0.apply(this,arguments);};
  /* engine particles: the lion's marble dust puffs become ground-coloured dust (or nothing inside a slam, which draws its own); round dots, sparks and embers are dropped in the lion's skill code */
  const E0=window.emit;window.emit=emit=function(o){if(o){const t=o.type;
      if(t==='dust'&&(o.color==='#e8e0d0'||o.color==='#c8b8a0')){if(!LV3.slam&&(gameTime-(LV3.dT||0)>.03||Math.hypot(o.x-(LV3.dx||0),o.y-(LV3.dy||0))>24)){LV3.dT=gameTime;LV3.dx=o.x;LV3.dy=o.y;dust(o.x,o.y,3,{spd:70,size:30,life:.5});}return;}
      if((t==='round'||t==='spark'||t==='ember')&&mine())return;}
    return E0.apply(this,arguments);};}

/* ---------------------------------------------------------------------
   6. PER SKILL — fists land on their events; casts gather for the wind-up and release on the frame
   --------------------------------------------------------------------- */
function punches(a,n,spawn,lead=.07){const L=lead*TEMPO(),Pz=a.events.slice(0,n).map((ev,i)=>({t:ev.t,i,done:0}));
  onUpd(a,Ac=>{for(const p of Pz){if(p.done||Ac.t<p.t-L)continue;p.done=1;spawn(p.i,Math.max(.012,rt(p.t-Ac.t)),Ac);}});}
const atRelease=(a,f)=>{a.events.push({t:Math.max(.001,a.windup-.001),f:()=>{try{f();}catch(e){console.warn('lion fx',e);}}});};
const soften=a=>onUpd(a,()=>{if(player.glow&&player.glow.k)player.glow={color:player.glow.color,k:player.glow.k*.45};});
const wrapMk=(k,fn)=>{const s=SKILLS[k];if(!s||!s.make||s.make._lv)return;const mk=s.make;s.make=function(c){const a=mk.apply(this,arguments);if(a){try{soften(a);fn(a,c||{});}catch(e){console.warn('lion fx',k,e);}}return a;};s.make._lv=1;};
function installMk(){
  /* ---- normal attack: gold cestus fists crackling with lightning; the 5th of Thunder Combo is an uppercut ---- */
  if(typeof mkBasic==='function'&&!mkBasic._lv){const mb=mkBasic;mkBasic=function(tgt){const a=mb.apply(this,arguments);if(!a||!a.events)return a;try{soften(a);const up=/Thunder Combo/.test(a.name||'');
      punches(a,1,(i,lead)=>fistTo(tgt,lead,{n:'fistB',pal:BLT,w:up?50:44,side:(player.basicIdx%2?7:-7),z0:up?10:null,dz:up?14:0,big:up}),.07);}catch(e){console.warn('lion basic fx',e);}return a;};mkBasic._lv=1;}
  /* ---- Basic ---- */
  wrapMk('lnPounce',(a,c)=>{const sx=player.x,sy=player.y;a.events.push({t:.012,f:()=>{addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],z:40,w:6,life:.22,pal:['#5a3a10','#d8a040','#ffe08a','#fff6d8','#ffffff'],ink:.25,live:rt(.32)}));dust(sx,sy,5,{spd:90,size:34,life:.5,dir:player.phi+Math.PI,spread:.8});}});
    onUpd(a,Ac=>{if(Ac.t<.3&&Math.random()<.35)leaves(player.x,player.y,(player.z||0)+30*HZK,1,{spd:30,up:20,g:120});});});
  wrapMk('lnHide',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:34,s:1.2});});
  wrapMk('lnRest',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:LAU,R:30});});
  wrapMk('lnRoar',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:36,s:1.3});});
  /* ---- A · Olympian Pankration ---- */
  wrapMk('laGrab',(a,c)=>{const t=tgtOf(c,LB.laGrab.range);punches(a,1,(i,lead)=>{fistTo(t,lead,{n:'grab',w:48,stay:.1,fade:.12,tr:.5});later(lead,()=>{if(!t||t.dead)return;
      sprite({n:'paw',layer:'top',follow:t,x:t.x,y:t.y,z:zOf(t)+(t.boss?60:44),w:30,life:.5,fi:.02,fo:.3,s0:1.4,s1:1,pop:.12,a:.95,under:'#3a2206',ua:.35});leaves(t.x,t.y,zOf(t),5,{spd:130});});},.08);});
  wrapMk('laSuplex',(a,c)=>{const t=lHeld()||tgtOf(c,LB.laSuplex.range);punches(a,1,(i,lead)=>{fistTo(t,lead,{n:'grab',w:46,stay:.06,tr:.5});},.08);});
  wrapMk('laShove',(a,c)=>{const t=tgtOf(c,LB.laShove.range);punches(a,1,(i,lead)=>{const phi=t?Math.atan2(t.y-player.y,t.x-player.x):player.phi;fistTo(t,lead,{n:'grab',w:58,stay:.07,big:1,tr:.6});
      later(Math.max(0,lead-.03),()=>{addFx(new DPush({x:player.x,y:player.y,phi}));leaves(player.x+Math.cos(phi)*40,player.y+Math.sin(phi)*40,30,6,{dir:phi,spread:.6,spd:260,up:60,g:120});
        dust(player.x+Math.cos(phi)*50,player.y+Math.sin(phi)*50,8,{dir:phi,spread:.7,spd:200,size:38,life:.6});});},.08);});
  wrapMk('laLift',(a,c)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:34,s:1.2});const phi=player.phi;atRelease(a,()=>{const t=lHeld()||tgtOf(c,LB.laLift.range);if(t){const S=sys('top');flare(S,t.x,t.y,40,50,'#ffd86a',.24);leaves(t.x,t.y,30,6,{spd:120,up:200});}
      if(typeof lL==='function'&&lL('laCrack'))LV3.crack={phi,until:gameTime+1.5};});});
  wrapMk('laCounter',(a)=>{const d0=LI.counterUntil;addFx(new DShield({T:LB.laCounter.T,n:'aegisE',done:()=>LI.counterUntil===0&&gameTime<d0}));});
  wrapMk('laSpin',(a)=>{whirl(()=>player.action===a);onUpd(a,Ac=>{const h=lHeld();if(h&&Math.random()<.6)leaves(h.x,h.y,zOf(h),1,{spd:40,up:30,g:120,s:.8});});});
  wrapMk('laLabors',(a)=>{const sx=player.x,sy=player.y,R=LB.laLabors.R,T=a.dur/TEMPO()+.6;sprite({n:'meander',layer:'ground',x:sx,y:sy,z:0,w:R*2.1,flat:1,life:T,fi:.15,fo:.5,s0:.6,s1:1,a:.85});
    for(let i=0;i<8;i++){const an=i/8*TAU+.2;addFx(new DColumn({x:sx+Math.cos(an)*R*1.02,y:sy+Math.sin(an)*R*.98,w:24,life:T-.1,delay:i*.03}));}
    for(const ev of a.events){if(ev._lv)continue;ev._lv=1;const f0=ev.f;ev.f=function(Ac){const ox=player.x,oy=player.y;let g=null;try{if(typeof Ghost==='function'&&typeof snapPlayer==='function')g=new Ghost({snap:snapPlayer(),color:LIC.gold});}catch(_){}
      const r=f0.apply(this,arguments);try{if(Math.hypot(player.x-ox,player.y-oy)>8){if(g)addFx(g);addFx(new KStreak({a:[ox,oy],b:[player.x,player.y],z:30,w:9,life:.2,pal:GLD,ink:.3}));}}catch(_){}return r;};}});
  /* ---- B · Thunder King ---- */
  wrapMk('lbJavelin',(a)=>{const tC=a.events[0]&&a.events[0].t;if(tC==null)return;gather({T:Math.max(.05,rt(tC)),pal:BLT,R:28});});
  wrapMk('lbSky',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:30});});
  wrapMk('lbEagle',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:30});atRelease(a,()=>{leaves(player.x,player.y,90,6,{spd:80,up:80,g:80});});});
  wrapMk('lbCloud',(a,c)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:30});});
  wrapMk('lbOver',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:40,s:1.5});});
  wrapMk('lbAegis',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:32});});
  wrapMk('lbWrath',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:44,s:1.6});const R=LB.lbWrath.R;atRelease(a,()=>{const T=rt(LB.lbWrath.n*.18)+.6;
      sprite({n:'meander',layer:'ground',follow:player,x:player.x,y:player.y,z:0,w:R*2.05,flat:1,life:T,fi:.12,fo:.4,s0:.6,s1:1,spin:.25,a:.55});
      sprite({n:'zeus',layer:'ground',follow:player,x:player.x,y:player.y,z:0,w:70,flat:1,life:T,fi:.12,fo:.4,s0:.4,s1:1,pop:.15,a:.7});
      try{skyDarkT=Math.max(skyDarkT,.8);}catch(_){}ring({x:player.x,y:player.y,r0:20,r1:R,w:8,pal:BLT,life:.5,segs:5,gap:.3});});});
  /* ---- C ---- */
  wrapMk('lcToss',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:34,s:1.2});});
  wrapMk('lcCrown',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:30});});
  wrapMk('lcAscend',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:44,s:1.6});});
  wrapMk('lcTwelfth',(a,c)=>{gather({T:Math.max(.05,rt(a.windup)),pal:GLD,R:40,s:1.4});atRelease(a,()=>{const t=lHeld()||tgtOf(c,LB.lcTwelfth.range);if(!t)return;
      sprite({layer:'top',x:t.x,y:t.y,z:0,life:.75,fo:.3,paint:(f,sx,sy,sc,al)=>{const H=220;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(sx,sy-H,sx,sy);g.addColorStop(0,'rgba(255,216,106,0)');g.addColorStop(.6,`rgba(255,216,106,${.35*al})`);g.addColorStop(1,`rgba(255,248,216,${.55*al})`);ctx.fillStyle=g;ctx.fillRect(sx-14,sy-H,28,H);ctx.restore();}});});});
  wrapMk('lcKeraunos',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:BLT,R:46,s:1.8});atRelease(a,()=>{const h=hand(player.phi),S=sys('top');flare(S,h[0],h[1],h[2],110,BLT[2],.3);});});}
installMk();
(function(){const I=window.installLion;if(typeof I==='function'&&!I._lv){window.installLion=function(){const r=I.apply(this,arguments);try{installMk();}catch(e){console.warn(e);}return r;};window.installLion._lv=1;}})();
})();
