/* =====================================================================
   AZURE DRAGON-LION (shishi-ryu fist master, Japan) — skill effects v3: SVG art (dragon_art.js) + code VFX.
   Owner 2026-11-21 "ทำของมังกรต่อ": the same brief as the cat, the kitsune and the axolotl — every skill made with SVG + VFX,
   matching its concept and its description, in step with the frame its damage lands. The piece kit is theirs (window.K3 + window.VK).

   CONCEPT (DRAGON_SKILLS_TH.md): a bare-handed fighter in an indigo kimono with gold waves, white mane, gold horns.
     Basic "Azure Pupil" = gold + white: the komainu guardian, horn rush, jade breath, the roaring shishi, the tail sweep.
     A "Raging Tide Fist" = sea water: fists of water, Hokusai waves with claw-like foam, geysers, whirlpools. Flow 0–5.
     B "Cloud Dragon Palm" = clouds and gold lightning: wind crescents, the mitsudomoe thunder seal, ki pearls that orbit,
       ki dragons, the giant azure dragon that coils round the field. Ki Orbs 0–3, Thunder Seals 0–3.
     C "Shishi-Ryu Sovereign" = the colour of the column it belongs to; Shishi Awakening = blue flame mane.

   HOW IT IS WIRED — gameplay is never touched:
   · The dragon's visual classes in char_dragon.js are repainted through their prototypes (update = game, draw = new):
     DgWave (wind palm, seal palm, ki fist, Thousand Waves, Abyssal Torrent, ki dragons), DgBolt (lightning), DgArc (chain
     lightning / Mirror Pond's return), DgGround + DgTop (clouds, rain, mirror, orbs, coil, awakening flames, sovereign cloud,
     flow pips, seals). Transient zones (the Azure Dragon, Gale Wall, Maelstrom) are spawned when their game object appears.
   · dPow (hit flash) and dSplash are rebound; hit pieces come from the damage moment itself.
   · Punches: each skill's make() is wrapped; its punch events are read from the action and a fist of water is launched so that
     it lands EXACTLY on the punch's event (lead = seconds left until the event, action time ÷ ACTION_TEMPO via rt()).
   · Engine rings the dragon creates (GRing → SoftRing) are used as exact-time markers: Calm Breath's heal, the roar, Crashing
     Tide, the Maelstrom finish, Heaven Push, Mirror Pond, Awakening, Stone Guardian — the ring is replaced by the new piece.
   · ?vfx3=0 = the old painted look (char_dragon_fx.js runs only then).
   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black "ink" shape behind so pale
   water and cloud read on snow; debris is shaped (drops, foam curls, gold plum blossoms, cloud puffs), never round dots.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='dragon'||!window.K3||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {PAL,TAU,cl,eO,eI,back,lerp,R_,rt,scr,rgba,tint,art,sprite,star,KGlint,KBurst,KRing,ring,KStreak,KArc,embers,dust,stones,ensure}=window.K3;
const stonesFx=(x,y,n)=>{try{stones(x,y,n,{spd:200,up:240,s:.9,col:'#8a8276'});}catch(_){}};
const V=window.VK,{sys,tx,G}=V,A=window.KTA;
/* palettes: [ink (dark shape behind), deep, mid, lite, core] */
const SEA=['#04203a','#0b5fa8','#2fa8f0','#bfe8ff','#ffffff'],CLD=['#1a0e3a','#4a2aa0','#9a7cf0','#ece6ff','#ffffff'],
  THU=['#2a1a04','#c88a12','#ffd23a','#fff3a0','#ffffff'],AZU=['#06123a','#1f4fd8','#4a8aff','#bcd4ff','#ffffff'],GLD=PAL.gold,
  JAD=['#063a22','#17a865','#6ff0a8','#d8ffe6','#ffffff'],STN=['#1e1c1a','#6a645c','#a8a094','#e4ded2','#ffffff'],
  FUR=['#1a2240','#7d8fd0','#d6def8','#ffffff','#ffffff'];
const DV=window.DGV={on:1};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('dragon');       /* no toon-layer charge glow / stretched lifetimes */
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75;
const mine=()=>!!(window.SKCTX||window.__ACTEV);
const aKey=()=>{const a=player.action;return a?(a.key||''):'';};
const zOf=e=>e?(e.boss?40:26)+(e.z||0):26;
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const later=(s,f)=>setFxTimer(s,f);
const fwd=(d,phi=player.phi)=>[player.x+Math.cos(phi)*d,player.y+Math.sin(phi)*d];
/* the hands: a little in front of the chest (side = sideways offset, + is the right hand when facing the target) */
const hand=(phi=player.phi,side=0)=>{const c=Math.cos(phi),s=Math.sin(phi);return [player.x+c*17-s*side,player.y+s*17+c*side,38+(player.z||0)];};
const famOf=c=>c===DGC.cloud||c==='#e8e0ff'?'cloud':c===DGC.thunder?'thunder':c===DGC.gold?'gold':c===DGC.azure?'azure':'sea';
const PF={sea:SEA,cloud:CLD,thunder:THU,gold:GLD,azure:AZU,jade:JAD,stone:STN};
const patch=(C,o)=>{if(typeof C!=='function')return;for(const k in o){if(!C.prototype['_'+k+'0'])C.prototype['_'+k+'0']=C.prototype[k];C.prototype[k]=o[k];}};
const onUpd=(a,f)=>{const u=a.update;a.update=function(A,dt){const r=u?u.apply(this,arguments):undefined;try{f(A,dt);}catch(e){console.warn('dragon fx',e);}return r;};};
const tgtOf=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:(nearestEnemy(player.x,player.y,(r||120)*1.15,player.phi)||nearestEnemy(player.x,player.y,(r||120)*1.15));

/* ---------------------------------------------------------------------
   1. DEBRIS — sea drops (stretched along their flight), foam curls on the ground, cloud puffs, gold plum blossoms, sparks
   --------------------------------------------------------------------- */
/* the drop art stands tip-up; for streaking it is turned tip-left (the round body leads the flight) */
const HD={};function hdrop(n){if(HD[n])return HD[n];const im=A.get(n);if(!im)return null;const c=document.createElement('canvas');c.width=im.height;c.height=im.width;const g=c.getContext('2d');g.translate(0,c.height);g.rotate(-Math.PI/2);g.drawImage(im,0,0);return HD[n]=c;}
function drops(x,y,z,n,o={}){const im=hdrop(o.c?'dropC':'drop');if(!im)return;const S=sys(o.layer||'top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.7:o.spread):R_(0,TAU),v=(o.spd||150)*R_(.35,1);
    S.add({im,x:x+R_(-3,3),y:y+R_(-2,2),z:Math.max(1,z+R_(-3,4)),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.75+(o.vy||0),vz:(o.up==null?200:o.up)*R_(.4,1.1),g:760,dr:.8,
      s0:R_(4.5,7)*(o.s||1),s1:R_(3,5)*(o.s||1),life:R_(.42,.75)*(o.life||1),fo:.35,str:1.3,bounce:.05,delay:o.delay?R_(0,o.delay):0});}}
const FOAM=(()=>{const c=document.createElement('canvas');c.width=48;c.height=32;const g=c.getContext('2d');g.lineCap='round';g.strokeStyle='rgba(255,255,255,.95)';
  g.lineWidth=3.2;g.beginPath();g.arc(16,18,9,Math.PI*.9,Math.PI*2.1);g.stroke();g.lineWidth=2.4;g.beginPath();g.arc(32,14,7,Math.PI*.8,Math.PI*2.2);g.stroke();
  g.fillStyle='rgba(255,255,255,.92)';for(const [x,y,r] of [[8,22,2.4],[26,24,2],[40,20,2.6],[22,8,1.6],[36,26,1.4]]){g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}return c;})();
function foam(x,y,n,R,o={}){const S=sys('ground');for(let i=0;i<qn2(n);i++){const a=i/n*TAU+R_(-.3,.3),r=R*R_(.6,1.05);
    S.add({im:FOAM,asp:.66,x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.9,z:0,vx:Math.cos(a)*(o.spd==null?R*.6:o.spd),vy:Math.sin(a)*(o.spd==null?R*.5:o.spd*.8),dr:3,
      s0:R_(14,20)*(o.s||1),s1:R_(18,26)*(o.s||1),life:R_(.5,.85)*(o.life||1),fo:.6,flat:1,rot:R_(0,TAU),a0:o.a||.85,delay:o.delay||0});}}
function puffs(x,y,z,n,o={}){const im=A.get(o.n||'kumo');if(!im)return;const S=sys(o.layer||'top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.7):R_(0,TAU),v=(o.spd==null?50:o.spd)*R_(.4,1);
    S.add({im,asp:64/124,x:x+R_(-6,6),y:y+R_(-4,4),z:z+R_(-4,6),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:o.rise==null?10:o.rise,dr:2.2,s0:(o.s||30)*R_(.5,.7),s1:(o.s||30)*R_(1,1.3),
      life:(o.life||.7)*R_(.8,1.2),fi:.06,fo:.6,a0:o.a||.9,rot:R_(-.15,.15),delay:o.delay?R_(0,o.delay):0});}}
function umes(x,y,z,n,o={}){const im=A.get('ume');if(!im)return;const S=sys('top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||120)*R_(.4,1);
    S.add({im,x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||120)*R_(.5,1.1),g:240,dr:2.2,s0:R_(7,11)*(o.s||1),s1:R_(5,8)*(o.s||1),life:R_(.5,.85),fo:.4,rot:R_(0,TAU),vr:R_(-8,8),bounce:.1});}}
function sparks(x,y,z,n,col,o={}){const S=sys('top');for(let i=0;i<qn2(n);i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||240)*R_(.4,1.1);
    S.add({im:tx('core',col),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(-.2,1)*(o.up||120)+30,dr:4,g:o.g==null?380:o.g,s0:R_(4,7)*(o.s||1),s1:1.5,life:(o.life||.4)*R_(.6,1.2),add:1,str:2.2,fo:.5});}}
function glow(x,y,r,col,a){if(a<=.01||r<1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a);ctx.drawImage(tx('glow',col),x-r,y-r,r*2,r*2);ctx.restore();}
/* a band through screen points q (half widths w), one filled polygon per tone [scale, colour, alpha] */
function band(q,w,tones){const n=q.length;if(n<2)return;const N=[];for(let i=0;i<n;i++){const a=q[Math.min(n-1,i+1)],b=q[Math.max(0,i-1)];const dx=a[0]-b[0],dy=a[1]-b[1],d=Math.hypot(dx,dy)||1;N.push([-dy/d,dx/d]);}
  for(const [s,c,al] of tones){if(al<=0)continue;ctx.globalAlpha=Math.min(1,al);ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<n;i++){const ww=w[i]*s;ctx.lineTo(q[i][0]+N[i][0]*ww,q[i][1]+N[i][1]*ww);}for(let i=n-1;i>=0;i--){const ww=w[i]*s;ctx.lineTo(q[i][0]-N[i][0]*ww,q[i][1]-N[i][1]*ww);}ctx.closePath();ctx.fill();}ctx.globalAlpha=1;}
const tones=(p,a=1)=>[[1.55,p[0],.3*a],[1.15,p[1],.95*a],[.8,p[2],a],[.46,p[3],a],[.16,p[4],a]];
/* split a point list into runs where pred holds (the joining point is shared so runs meet) */
function runs(pts,pred){const out=[];let cur=null;for(let i=0;i<pts.length;i++){const ok=pred(pts[i]);if(ok){if(!cur){cur=[];if(i>0)cur.push(pts[i-1]);out.push(cur);}cur.push(pts[i]);}else if(cur){cur.push(pts[i]);cur=null;}}return out;}
/* electric zigzags flickering round a point (screen space), drawn each frame */
function zaps(x,y,n,R,col,a){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';for(let i=0;i<n;i++){const a0=R_(0,TAU),L=R*R_(.5,1);let px=x+Math.cos(a0)*R*.2,py=y+Math.sin(a0)*R*.2;
    ctx.globalAlpha=a*R_(.6,1);ctx.strokeStyle=col;ctx.lineWidth=R_(1.2,2.2);ctx.beginPath();ctx.moveTo(px,py);for(let j=1;j<=4;j++){px=x+Math.cos(a0)*L*j/4+R_(-4,4);py=y+Math.sin(a0)*L*j/4*.8+R_(-4,4);ctx.lineTo(px,py);}ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=.8;ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------------
   2. PIECES
   --------------------------------------------------------------------- */
/* a fist of water launched from the hand: it lands on its target EXACTLY `lead` seconds later, holds, then bursts into drops.
   arc = sideways bulge (a hook), z0/z1 = heights (an uppercut rises). The trail is a tapering jet of water behind the fist. */
class DFist{constructor(o){Object.assign(this,{t:0,layer:'top',lead:.07,stay:.05,fade:.1,w:38,n:'fist',pal:SEA,arc:0,a0:1,tr:.7,burst:1,delay:0},o);this.t=-this.delay;this.life=this.lead+this.stay+this.fade+.06;this.ph=R_(0,TAU);}
  pos(k){const [x0,y0,z0]=this.p0,[x1,y1,z1]=this.p1;let x=lerp(x0,x1,k),y=lerp(y0,y1,k);const z=lerp(z0,z1,k);if(this.arc){const s=Math.sin(Math.PI*k)*this.arc,dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1;x+=-dy/L*s;y+=dx/L*s;}return [x,y,z];}
  update(dt){this.t+=dt;if(this.t<0)return true;const e=this.e;if(e&&!e.dead&&this.t<=this.lead){const d=Math.hypot(e.x-this.p0[0],e.y-this.p0[1])||1;this.p1[0]=e.x-(e.x-this.p0[0])/d*e.r*.35;this.p1[1]=e.y-(e.y-this.p0[1])/d*e.r*.35;}
    if(this.t>=this.lead&&!this._hit){this._hit=1;if(this.burst){const q=this.p1;drops(q[0],q[1],q[2],this.big?8:4,{spd:this.big?170:110,up:120,c:this.pal===CLD,dir:Math.atan2(q[1]-this.p0[1],q[0]-this.p0[0]),spread:1.2});}}
    return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,k=cl(t/this.lead,0,1),hold=this.stay+this.fade,f=cl((t-this.lead-this.stay)/this.fade,0,1),N=10,k0=Math.max(0,k-this.tr)+(t>this.lead?cl((t-this.lead)/hold,0,1)*Math.min(k,this.tr):0);
    const q=[],tg=[];for(let i=0;i<=N;i++){const s=k0+(k-k0)*i/N,p=this.pos(s),[x,y]=P(p[0],p[1],p[2]);q.push([x,y]);}
    const a=this.a0*(1-f),h=q[N],pv=q[Math.max(0,N-2)],ang=Math.atan2(h[1]-pv[1],h[0]-pv[0]),flip=Math.cos(ang)<0,W=this.w,p=this.pal;
    if(a>.01){ctx.save();const L=Math.hypot(h[0]-q[0][0],h[1]-q[0][1]);
      if(L>4){/* two strands of water twisting round the punch's path + a white thread */
        const nrm=[];for(let i=0;i<=N;i++){const A2=q[Math.min(N,i+1)],B2=q[Math.max(0,i-1)],dx=A2[0]-B2[0],dy=A2[1]-B2[1],d=Math.hypot(dx,dy)||1;nrm.push([-dy/d,dx/d]);}
        for(let j=0;j<2;j++){const qq=q.map((pt,i)=>{const o=Math.sin(i/N*Math.PI*2.2+t*38+this.ph+j*Math.PI)*W*.13*(.3+.7*i/N);return [pt[0]+nrm[i][0]*o,pt[1]+nrm[i][1]*o];});
          band(qq,qq.map((_,i)=>W*(.015+.07*i/N)),[[1.7,p[0],.22*a],[1,j?p[2]:p[1],.85*a],[.45,p[3],a]]);}
        band(q,q.map((_,i)=>W*(.01+.035*i/N)),[[1,'#ffffff',.75*a]]);}
      const s=1+(t>this.lead?.16*Math.sin(Math.PI*cl((t-this.lead)/hold,0,1)):0);
      glow(h[0],h[1],W*.85,p[2],.4*a);art(this.n,h[0],h[1],W*s,{rot:ang,sy:flip?-1:1,ax:.88,a,under:p[0],ua:.35});ctx.restore();}
    /* the punch's shock ring: a thin oval standing across the punch, thrown off the knuckles */
    const rk=(t-this.lead)/.16;if(rk>0&&rk<1){const [cx,cy]=P(...this.p1),rr=W*(.25+.55*eO(rk))*(this.big?1.35:1),al=1-rk;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.lineWidth=Math.max(1,W*.09*(1-rk));
      ctx.globalAlpha=al*.45;ctx.strokeStyle=p[1];ctx.beginPath();ctx.ellipse(W*.06*rk,0,rr*.32,rr,0,0,TAU);ctx.stroke();ctx.globalAlpha=al;ctx.strokeStyle=p[3];ctx.lineWidth*=.55;ctx.beginPath();ctx.ellipse(W*.06*rk,0,rr*.32,rr,0,-1.3,1.3);ctx.stroke();ctx.restore();
      if(rk<.4)star(cx,cy,W*.45*(1-rk/.4),p[3],ang);}}}
const fist=o=>addFx(new DFist(o));
/* ki gathering at the hand for exactly the wind-up (points pulled in + a growing glow), a flash on release */
class DGather{constructor(o){Object.assign(this,{t:0,layer:'top',T:.1,pal:CLD,R:28,s:1,side:0},o);this.acc=0;this.S=sys('top',this.T+.25);}
  update(dt){this.t+=dt;const h=hand(player.phi,this.side);this.x=h[0];this.y=h[1];this.z=h[2];
    if(this.t<this.T){this.acc+=dt;while(this.acc>.014){this.acc-=.014;const a=R_(0,TAU),r=this.R*R_(.7,1.2),x=this.x+Math.cos(a)*r,y=this.y+Math.sin(a)*r*.6,z=this.z+R_(-12,12),T=Math.max(.05,this.T-this.t);
        this.S.add({im:tx('core',this.pal[2]),x,y,z,vx:(this.x-x)/T,vy:(this.y-y)/T,vz:(this.z-z)/T,s0:R_(3,5)*this.s,s1:1.5,life:T,fo:.3,add:1,str:1.4});}}
    return this.t<this.T+.08;}
  draw(){const k=cl(this.t/this.T,0,1),f=cl((this.t-this.T)/.08,0,1),[x,y]=P(this.x,this.y,this.z),r=(6+9*k)*this.s*(1+f*.9),a=(.3+.7*k)*(1-f);if(a<=.01)return;
    glow(x,y,r*2.2,this.pal[2],a*.8);glow(x,y,r,this.pal[4],a*.7);if(f>0)star(x,y,r*1.1*(1-f),this.pal[3],.4);}}
const gather=o=>addFx(new DGather(o));
/* a crown splash standing on the ground */
const crown=(x,y,w,o={})=>sprite(Object.assign({n:'crown',layer:'sorted',x,y,z:0,ay:.95,w,life:.48,fi:.02,fo:.22,s0:.35,s1:1,pop:.14,sortOff:3,under:'#0b5fa8',ua:.18,tick:f=>{f.sy2=1-.5*cl((f.t-.2)/.28,0,1);}},o));
/* wet ground: a dark clear puddle that spreads and dries */
class DPool{constructor(o){Object.assign(this,{t:0,layer:'ground',R:30,life:1.1,a:1,pal:SEA,delay:0},o);this.t=-this.delay;this.ph=R_(0,TAU);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,g=eO(cl(this.t/.15,0,1)),a=this.a*(1-k*k),[x,y]=P(this.x,this.y,0),R=this.R*(.4+.6*g);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.ph);
    const gr=ctx.createRadialGradient(0,0,0,0,0,R);gr.addColorStop(0,rgba(this.pal[0],.34*a));gr.addColorStop(.72,rgba(this.pal[1],.24*a));gr.addColorStop(1,rgba(this.pal[1],0));ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(0,0,R,R*.86,0,0,TAU);ctx.fill();
    ctx.globalAlpha=a*.32;ctx.strokeStyle=this.pal[3];ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(0,0,R*.82,R*.7,0,-.6,1.1);ctx.stroke();ctx.restore();}}
const pool=o=>addFx(new DPool(o));
/* a water splash: crown + drops + foam + wet ground */
function splash(x,y,s=1,o={}){crown(x,y,54*s,o.crown||{});drops(x,y,10,Math.round(4+6*s),{spd:120*s,up:220*s,c:o.c});if(s>=.8){foam(x,y,Math.round(4*s),20*s);pool({x,y,R:26*s,life:.9});}}
/* the gold lightning of the thunder seal: a jagged ribbon from the clouds, re-jagged every 50 ms, then it thins and lifts */
class DBolt{constructor(o){Object.assign(this,{t:0,layer:'top',life:.42,H:230,pal:THU,w:7},o);this.rej();this.acc=0;}
  rej(){const n=8;this.j=[];for(let i=0;i<=n;i++)this.j.push([i===0||i===n?0:R_(-1,1)*17*(.4+.6*Math.sin(Math.PI*i/n)),i/n]);this.br=[[R_(.22,.42),Math.random()<.5?1:-1,R_(20,32)],[R_(.5,.72),Math.random()<.5?1:-1,R_(14,24)]];}
  update(dt){this.t+=dt;this.acc+=dt;if(this.acc>.05&&this.t<.26){this.acc=0;this.rej();}if(this.e&&!this.e.dead){this.x=this.e.x;this.y=this.e.y;}return this.t<this.life;}
  draw(){const t=this.t,[x,y]=P(this.x,this.y,0),top=y-this.H,dn=eO(cl(t/.05,0,1)),th=t<.24?1:1-cl((t-.24)/.18,0,1),lift=t<.24?0:(t-.24)*240;if(th<=0)return;
    const q=this.j.map(([o,s])=>[x+o,top-lift*(1-s)+(y-top)*s*dn]),w=this.j.map(([o,s])=>this.w*th*(.32+.68*Math.sin(Math.PI*Math.min(1,s*1.15+.05))));
    ctx.save();glow(x,y-10,46,this.pal[2],.36*th);ctx.globalCompositeOperation='lighter';band(q,w.map(v=>v*1.0),[[2.6,'#5a3cb0',.35*th],[1.6,this.pal[1],.6*th]]);ctx.globalCompositeOperation='source-over';band(q,w,[[1,this.pal[2],th],[.55,this.pal[3],th],[.24,'#ffffff',th]]);
    for(const [f,sd,L] of this.br){const i=Math.floor(f*(q.length-1)),p=q[i];if(!p)continue;const b=[p,[p[0]+sd*L*.5,p[1]+L*.35],[p[0]+sd*L,p[1]+L*.8]];band(b,[2.4*th,1.6*th,.3],[[1.6,this.pal[1],.6*th],[1,this.pal[3],th],[.4,'#ffffff',th]]);}
    ctx.restore();}}
/* everything a bolt does where it lands (spawned once with it) */
function boltHit(x,y,o={}){const S=sys('top'),z=6;G.flare(S,x,y,26,o.big?80:58,THU[2],.24);addFx(new KBurst({x,y,z:22,R:o.big?36:26,n:11,life:.22,pal:THU,ink:.45}));
  ring({x,y,r0:8,r1:o.big?84:64,w:6,pal:THU,life:.36,segs:4,gap:.25});ring({x,y,r0:4,r1:o.big?50:38,w:4,pal:CLD,life:.3,segs:3,gap:.35,delay:.04});
  sparks(x,y,20,o.big?12:8,THU[2],{spd:260,up:160});puffs(x,y,4,3,{n:'kumoS',s:32,spd:70,rise:20,life:.55,a:.7,layer:'ground'});
  sprite({n:'sealR',layer:'ground',x,y,z:0,w:o.big?80:58,flat:1,life:.4,fi:.02,fo:.3,s0:.4,s1:1.1,rot:R_(0,TAU),spin:2.2,a:.8});}
/* the water rope of Whirlpool Hook: whips out from the hand to the prey, then reels in */
class DRope{constructor(o){Object.assign(this,{t:0,layer:'top',out:.06,hold:.04,back:.12,pal:SEA},o);this.life=this.out+this.hold+this.back;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,h=hand(player.phi),[hx,hy]=P(h[0],h[1],h[2]),[ox,oy]=P(this.from[0],this.from[1],zOf(null)),[nx,ny]=P(this.to[0],this.to[1],zOf(null));
    let ex,ey,k;if(t<this.out){k=eO(t/this.out);ex=lerp(hx,ox,k);ey=lerp(hy,oy,k);}else if(t<this.out+this.hold){ex=ox;ey=oy;}else{k=eI(cl((t-this.out-this.hold)/this.back,0,1));ex=lerp(ox,nx,Math.min(1,k*1.4));ey=lerp(oy,ny,Math.min(1,k*1.4));}
    const f=t>this.out+this.hold?cl((t-this.out-this.hold)/this.back,0,1):0,N=10,q=[],w=[];for(let i=0;i<=N;i++){const s=i/N,sag=Math.sin(Math.PI*s)*(t<this.out?10:4)*(1-f),wob=Math.sin(s*9+t*40)*2.2*(1-f);q.push([lerp(hx,ex,s)+wob,lerp(hy,ey,s)+sag]);w.push(3.6*(1-f*.6)*(.6+.4*Math.sin(Math.PI*s)));}
    ctx.save();band(q,w,tones(this.pal,1-f*.6));ctx.restore();glow(ex,ey,14,this.pal[2],.5*(1-f));}}
/* a spiral of water wrapped round the prey (Whirlpool Hook): rises and unwinds; far half on the ground layer, near half on top */
class DCurl{constructor(o){Object.assign(this,{t:0,life:.5,R:34,front:0},o);this.layer=this.front?'top':'ground';this.ph=R_(0,TAU);}
  update(dt){this.t+=dt;if(this.e&&!this.e.dead){this.x=this.e.x;this.y=this.e.y;}return this.t<this.life;}
  draw(){const t=this.t,k=t/this.life,g=eO(cl(t/.12,0,1)),a=1-cl((k-.5)/.5,0,1),pts=[];for(let i=0;i<=26;i++){const s=i/26,an=this.ph-t*14+s*TAU*1.4,r=this.R*(.7+.3*s)*(.6+.4*g),z=4+s*46*g;pts.push({x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r*.8,z,f:Math.sin(an)>0,s});}
    ctx.save();for(const R of runs(pts,o=>o.f===!!this.front)){const q=R.map(o=>{const p=P(o.x,o.y,o.z);return [p[0],p[1]];}),w=R.map(o=>1+4.5*Math.sin(Math.PI*o.s));band(q,w,tones(SEA,a*(this.front?1:.7)));}ctx.restore();}}
/* the geyser of Tsunami Uppercut: bursts up under the prey, holds, falls back */
class DGeyser{constructor(o){Object.assign(this,{t:0,layer:'sorted',w:52,life:.75,a:1},o);}
  get sy(){return this.y+2;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,up=back(cl(t/.11,0,1)),k=cl((t-.32)/(this.life-.32),0,1),[x,y]=P(this.x,this.y,0),[aw,ah]=A.size('geyser'),w=this.w*(1+.25*k),h=this.w*ah/aw*up*(1-.85*eI(k)),a=this.a*(1-k*k);if(h<2)return;
    glow(x,y-h*.6,this.w*1.1,SEA[2],.35*a);ctx.save();ctx.globalAlpha=a;const im=A.get('geyser');if(im){const ink=tint('geyser','#04203a');if(ink){ctx.globalAlpha=a*.3;ctx.drawImage(ink,x-w/2+3,y-h+4,w,h);}ctx.globalAlpha=a;ctx.drawImage(im,x-w/2,y-h,w,h);}
    if(t<.07){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-t/.07)*.8;if(im)ctx.drawImage(im,x-w/2,y-h,w,h);}ctx.restore();}}
/* Ebb and Flow: a dome of still water round the dragon that grows brighter with every hit it stores */
class DDome{constructor(o){Object.assign(this,{t:0,layer:'sorted',w:118,T:2},o);this.rip=0;this.e0=0;this.done=0;}
  get sy(){return player.y+30;}
  update(dt){this.t+=dt;const st=DG.ebb||0;if(st>this.e0+1){this.e0=st;this.rip=1;}this.rip=Math.max(0,this.rip-dt*3.5);if((!DG.ebbOn||aKey()!=='daEbb'||this.t>this.T+.25)&&this.t>.1&&!this.done){this.done=1;this.end=this.t;}return !this.done||this.t<this.end+.18;}
  draw(){const t=this.t,g=back(cl(t/.16,0,1)),f=this.done?cl((t-this.end)/.18,0,1):0,fill=cl((DG.ebb||0)/Math.max(1,D.patk*3),0,1),[x,y]=P(player.x,player.y,0),[aw,ah]=A.size('dome'),w=this.w*g*(1+f*.25+this.rip*.04),h=w*ah/aw*(1-f*.7),a=(.75+.25*fill)*(1-f);if(a<=.01)return;
    glow(x,y-h*.4,w*.7,SEA[2],(.18+.35*fill+.3*this.rip)*a);art('dome',x,y-h/2+2,w,{a,sy:h/(w*ah/aw)||1});ctx.save();ctx.translate(x,y);ctx.scale(1,K*.62);ctx.lineWidth=2.4;ctx.strokeStyle='#ffc23a';ctx.globalAlpha=a*.85;ctx.beginPath();ctx.arc(0,0,w*.48,0,Math.PI);ctx.stroke();ctx.globalAlpha=a*.45;ctx.strokeStyle='#bfe8ff';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,w*.48,Math.PI,TAU);ctx.stroke();ctx.restore();
    if(fill>.05){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*fill*.5;ctx.strokeStyle=SEA[3];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-2,w*.46,w*.46*K*.5,0,0,TAU);ctx.stroke();ctx.restore();}}}
/* the gold komainu guardian of Komainu Guard: stands in front of the dragon for the guard, flashes when it blocks */
class DShield{constructor(o){Object.assign(this,{t:0,layer:'sorted',T:1,w:46},o);this.flash=0;this.used=DG.guardUsed;}
  get sy(){return player.y+Math.sin(player.phi)*16+1;}
  update(dt){this.t+=dt;if(DG.guardUsed&&!this.used){this.used=1;this.flash=1;this.block();}this.flash=Math.max(0,this.flash-dt*3);return this.t<this.T+.25;}
  pos(){return [player.x+Math.cos(player.phi)*16,player.y+Math.sin(player.phi)*16,30+(player.z||0)];}
  block(){const [x,y,z]=this.pos();addFx(new KBurst({x,y,z,R:40,n:12,life:.26,pal:GLD,ink:.4}));const S=sys('top');G.flare(S,x,y,z,90,'#ffd23a',.28);umes(x,y,z,6,{spd:170,up:150});
    ring({x:player.x,y:player.y,r0:12,r1:70,w:7,pal:GLD,life:.32,segs:4,gap:.25});if(dL('dcStone'))this.stone=1;}
  draw(){const t=this.t,g=back(cl(t/.13,0,1)),f=cl((t-this.T)/.25,0,1),[x,y]=P(...this.pos()),a=(1-f),w=this.w*g*(1+this.flash*.25);if(a<=.01)return;
    glow(x,y,w*1.1,'#ffd23a',(.3+.6*this.flash)*a);art(this.stone&&this.flash>0?'komainuS':'komainu',x,y,w,{a,under:'#3a2206',ua:.3});
    if(this.flash>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=this.flash*.8;art('komainu',x,y,w,{});ctx.restore();}}}
/* Calm Breath: jade breath spiralling up round the dragon while it breathes (2 s); the far half of each ribbon is behind it */
class DBreath{constructor(o){Object.assign(this,{t:0,T:2,front:1},o);this.layer=this.front?'top':'ground';this.acc=0;}
  update(dt){this.t+=dt;if(this.front){this.acc+=dt;if(this.acc>.16&&this.t<this.T){this.acc=0;puffs(player.x+R_(-22,22),player.y+R_(-8,8),2,1,{n:'kumoJ',s:24,spd:16,rise:14,life:.9,a:.5,layer:'ground'});
      const S=sys('top');G.glints(S,player.x,player.y,10,1,30,'#bfffd8',.8);}}return this.t<this.T+.3;}
  draw(){const t=this.t,f=cl((t-this.T)/.3,0,1),a=cl(t/.25,0,1)*(1-f);if(a<=.01)return;if(!this.front){const [px,py]=P(player.x,player.y,0);glow(px,py-4,44,JAD[2],.22*a);}
    ctx.save();for(let r=0;r<3;r++){const ph=t*2.6+r*TAU/3,pts=[];for(let i=0;i<=26;i++){const s=i/26,an=ph+s*TAU*1.1,z=2+s*78,rr=30-s*12;pts.push({x:player.x+Math.cos(an)*rr,y:player.y+Math.sin(an)*rr*.75,z,s,f:Math.sin(an)>0});}
      for(const R of runs(pts,o=>o.f===!!this.front)){const q=R.map(o=>{const p=P(o.x,o.y,o.z);return [p[0],p[1]];}),w=R.map(o=>.4+2.6*Math.sin(Math.PI*o.s));band(q,w,[[1.8,JAD[1],.25*a],[1,JAD[2],.8*a],[.45,'#ffffff',.85*a]]);}}ctx.restore();}}
/* the roaring shishi (Lion's Roar): the spirit's face over the dragon, sound rings of gold */
function roarFx(x,y){/* the spirit rises BEHIND the dragon (ground layer = drawn before the fighters), its face above the head */
  sprite({layer:'ground',x,y:y-4,z:92,life:.6,fo:.4,paint:(f,sx,sy,sc,a)=>glow(sx,sy,80,'#ffb020',.28*a)});
  sprite({n:'shishi',layer:'ground',x,y:y-4,z:96,w:112,life:.75,fi:.04,fo:.4,s0:.45,s1:1,pop:.16,a:.95,under:'#3a2206',ua:.3,tick:f=>{f.rot=Math.sin(f.t*60)*.03*(1-cl(f.t/.4,0,1));}});
  for(let i=0;i<2;i++)ring({x,y,r0:24,r1:DB.dnRoar.R*(1-.15*i),w:5-i*1.5,pal:GLD,life:.5,segs:6+i,gap:.4,delay:i*.1});
  umes(x,y,40,8,{spd:200,up:140});dust(x,y,8,{ring:30,spd:120,size:40,life:.6});}
/* the heal burst (Calm Breath): jade ring, rising light, a plum blossom flurry */
function healFx(x,y){ring({x,y,r0:10,r1:62,w:6,pal:JAD,life:.42,segs:4,gap:.25});const S=sys('top');G.glints(S,x,y,20,10,34,'#c8ffe0',.9);G.flare(S,x,y,50,80,JAD[2],.3);puffs(x,y,6,4,{n:'kumoJ',s:34,spd:60,rise:24,life:.8,a:.7});}
/* Heaven Push: a great palm print of ki pressed on the ground, wind blasting out, the spent pearls flying off */
function pushFx(x,y,R,n){sprite({n:'palm',layer:'ground',x,y,z:0,w:R*1.08,flat:1,life:.7,fi:.03,fo:.45,s0:.4,s1:1.05,pop:.14,a:.85,rot:-Math.atan2(Math.cos(player.phi),Math.sin(player.phi))+Math.PI});
  ring({x,y,r0:20,r1:R+26,w:12,pal:CLD,life:.42,segs:3,gap:.2});ring({x,y,r0:10,r1:R*.8,w:6,pal:THU,life:.36,segs:5,gap:.35,delay:.05});
  for(let i=0;i<8;i++){const a=i/8*TAU+R_(-.25,.25);addFx(new KStreak({a:[x+Math.cos(a)*R*.35,y+Math.sin(a)*R*.35],b:[x+Math.cos(a)*(R*.95),y+Math.sin(a)*(R*.95)],z:14+R_(-4,8),w:2.6,life:.2,pal:CLD,ink:.2}));}
  puffs(x,y,6,8,{s:36,spd:220,rise:20,life:.6});const S=sys('top');G.flare(S,x,y,40,120,CLD[2],.3);
  for(let i=0;i<n;i++){const a=i/n*TAU+R_(0,.6),px=x+Math.cos(a)*28,py=y+Math.sin(a)*18;sprite({n:'pearl',layer:'top',x:px,y:py,z:44,w:18,life:.32,fo:.2,vx:Math.cos(a)*R*2.6,vy:Math.sin(a)*R*2.6,s0:1,s1:1.3,
    tick:f=>{if(f.t>.28&&!f._b){f._b=1;addFx(new KBurst({x:f.x,y:f.y,z:44,R:22,n:8,life:.2,pal:CLD,ink:.3}));}}});}}

/* ---------------------------------------------------------------------
   3. HIT FLASHES — from the damage moment (dPow), by element
   --------------------------------------------------------------------- */
function hitFx(e,big,fam){if(!e)return;const now=gameTime;if(e._dvT&&now-e._dvT<.045&&!big)return;e._dvT=now;const p=PF[fam]||SEA,x=e.x,y=e.y,z=zOf(e);
  addFx(new KBurst({x,y,z,R:big?30:18,n:big?10:7,life:big?.24:.17,pal:p,ink:.42,e}));if(big)addFx(new KGlint({x,y,z:z+4,s:20,col:p[3],life:.2,e}));
  if(fam==='sea'){drops(x,y,z,big?9:4,{spd:big?170:120,up:big?200:130});if(big){crown(x,y,46);foam(x,y,4,16);}}
  else if(fam==='cloud'){puffs(x,y,z-6,big?3:1,{s:big?30:22,spd:60,life:.5,a:.75});sparks(x,y,z,big?5:3,CLD[3],{spd:180});}
  else if(fam==='thunder'){sparks(x,y,z,big?8:5,THU[2],{spd:230});addFx(new DZap({x,y,z,life:.16,n:big?3:2,R:big?26:18}));}
  else if(fam==='gold'){umes(x,y,z,big?4:2,{spd:150});sparks(x,y,z,big?6:3,GLD[2],{spd:200});}
  else if(fam==='azure'){sparks(x,y,z,big?7:4,AZU[3],{spd:210});embers(x,y,z,big?5:3,{spd:90,up:120,c:['#ffffff','#6ab4ff','#1f4fd8']});}}
class DZap{constructor(o){Object.assign(this,{t:0,layer:'top',life:.16,n:2,R:18,col:THU[2]},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);zaps(x,y,this.n,this.R,this.col,1-this.t/this.life);}}
const _dPow=window.dPow;
window.dPow=function(e,big,col){try{const fam=famOf(col);
    /* Ki Orbit strikes: a pearl darts off its orbit into the enemy */
    if(DV.core&&fam==='cloud'&&e){const i=Math.floor(R_(0,Math.max(1,DG.orbs))),an=(DV.tg||0)*2.4+i*TAU/3,sx=player.x+Math.cos(an)*30,sy=player.y+Math.sin(an)*18;
      sprite({n:'pearl',layer:'top',x:sx,y:sy,z:44,w:16,life:.1,fo:.05,vx:(e.x-sx)/.1,vy:(e.y-sy)/.1,vz:(zOf(e)-44)/.1});later(.1,()=>hitFx(e,false,'cloud'));return;}
    hitFx(e,big,fam);}catch(x){console.warn('dragon hit fx',x);}};
window.dSplash=function(x,y,n){drops(x,y,14,Math.max(3,Math.round(n*.6)),{spd:150,up:200});if(n>=10){crown(x,y,60);foam(x,y,5,22);pool({x,y,R:34});}};

/* ---------------------------------------------------------------------
   4. THE DRAGON'S OWN PIECES, REPAINTED (update = game, draw = new)
   --------------------------------------------------------------------- */
const kindOf=f=>f.kind==='dragon'?'dragon':f.col===DGC.thunder?'seal':f.col===DGC.cloud?'wind':f.w>=40?'abyss':f.w>=28?'wave':'chain';
patch(DgWave,{update(dt){const r=this._update0(dt);if(!this._k){this._k=kindOf(this);this._h=[];this._acc=0;this._born=gameTime;}
    const k=this._k;this._h.unshift([this.x,this.y]);if(this._h.length>(k==='dragon'?16:10))this._h.length=k==='dragon'?16:10;this._acc+=dt;
    if(this._acc>.028){this._acc=0;
      if(k==='wind')puffs(this.x,this.y,this.z-4,1,{s:20,spd:20,dir:this.phi+Math.PI,spread:.5,life:.4,a:.6});
      else if(k==='seal')sparks(this.x,this.y,this.z,2,THU[2],{spd:90,dir:this.phi+Math.PI,spread:.8,g:0,life:.25});
      else if(k==='chain')drops(this.x,this.y,this.z,1,{spd:60,up:60,dir:this.phi+Math.PI});
      else if(k==='wave'||k==='abyss'){const s=k==='abyss'?1.6:1;drops(this.x+R_(-10,10)*s,this.y+R_(-6,6),40*s,2,{spd:110*s,up:180*s,dir:this.phi,spread:.9});foam(this.x,this.y,1,8*s,{spd:10,s,life:1.2});
        if(Math.random()<.6)pool({x:this.x-Math.cos(this.phi)*20*s,y:this.y-Math.sin(this.phi)*20*s,R:22*s,life:1.3,a:.8});}
      else if(k==='dragon'&&Math.random()<.5){const S=sys('top');G.glints(S,this.x,this.y,this.z,1,10,this.col===DGC.azure?'#bcd4ff':'#ece6ff',.5);}}
    if(!r&&!this._end){this._end=1;if(k==='wind')puffs(this.x,this.y,this.z-4,3,{s:26,spd:60,life:.5,a:.7});else if(k==='seal')addFx(new DZap({x:this.x,y:this.y,z:this.z,life:.14,n:3,R:16}));
      else if(k==='dragon'){puffs(this.x,this.y,this.z,3,{s:26,spd:50,life:.5,a:.7});const S=sys('top');G.glints(S,this.x,this.y,this.z,6,22,'#e8f0ff',.6);}
      else if(k==='wave'||k==='abyss'){const s=k==='abyss'?1.5:1;crown(this.x,this.y,60*s);foam(this.x,this.y,6,26*s);drops(this.x,this.y,30*s,10,{spd:150*s,up:240});}}
    return r;},
  draw(){const k=this._k||kindOf(this),dk=this.d/this.len,fin=dk>.82?(1-dk)/.18:1,a=Math.min(1,(this.t||0)/.05)*fin,[x,y]=P(this.x,this.y,this.z),ang=scr(this.phi),flip=Math.cos(ang)<0;if(a<=.01)return;
    if(k==='wind'||k==='seal'){const p=k==='seal'?THU:CLD,w=k==='seal'?54:this.w*3.3;glow(x,y,w*.55,p[2],.35*a);
      /* a wake of wind lines behind the crescent */
      const H=this._h||[];if(H.length>3){const q=H.map(([hx,hy])=>{const s=P(hx,hy,this.z);return [s[0],s[1]];});ctx.save();ctx.globalAlpha=1;band(q,q.map((_,i)=>(k==='seal'?3:5)*(1-i/q.length)),[[1,p[1],.45*a],[.55,p[3],.6*a]]);ctx.restore();}
      art(k==='seal'?'windT':'windP',x,y,w,{rot:ang,sy:flip?-1:1,ax:.78,a,under:p[0],ua:.25});if(k==='seal')zaps(x+Math.cos(ang)*w*.15,y+Math.sin(ang)*w*.15,2,16,THU[2],a);return;}
    if(k==='chain'){const [sx,sy]=P(this.x0,this.y0,this.z),q=[],w=[],N=8;for(let i=0;i<=N;i++){const s=Math.max(0,1-.75*(1-i/N)),hx=lerp(sx,x,i/N*0+s),hy=lerp(sy,y,s);q.push([hx,hy]);w.push(2+8*i/N);}
      ctx.save();band(q,w,tones(SEA,a*.85));ctx.restore();glow(x,y,30,SEA[2],.4*a);art('fist',x,y,44,{rot:ang,sy:flip?-1:1,ax:.85,a,under:'#04203a',ua:.3});return;}
    if(k==='wave'||k==='abyss'){const big=k==='abyss',[gx,gy]=P(this.x,this.y,0),[aw,ah]=A.size('wave'),W=big?156:98,rise=back(cl((this.t||0)/.12,0,1)),sink=dk>.8?1-(dk-.8)/.2*.7:1,H=W*ah/aw*rise*sink;
      ctx.save();ctx.globalAlpha=.35*a;ctx.fillStyle='#04203a';ctx.beginPath();ctx.ellipse(gx,gy,W*.5,W*.5*K*.32,0,0,TAU);ctx.fill();ctx.restore();
      const dx=Math.cos(ang),ax=dx<0;glow(gx,gy-H*.5,W*.6,SEA[2],.25*a);art('wave',gx,gy,W,{ax:.62,ay:1,sx:ax?-1:1,sy:H/(W*ah/aw)||1,a,under:'#04203a',ua:.28});return;}
    if(k==='dragon'){const p=this.col===DGC.azure?AZU:CLD,H=this._h||[];const q=[],w=[];for(let i=H.length-1;i>=0;i--){const [hx,hy]=H[i],s=P(hx,hy,this.z+Math.sin((this.t||0)*10+i*.7)*4);q.push([s[0],s[1]]);w.push(1.4+8*(1-i/H.length));}
      if(q.length>2){ctx.save();band(q,w,tones(p,a));ctx.globalAlpha=a*.9;ctx.fillStyle='#ffd86a';for(let i=1;i<q.length-1;i+=2){const [qx,qy]=q[i];ctx.beginPath();ctx.arc(qx,qy-w[i]*.35,Math.max(.8,w[i]*.22),0,TAU);ctx.fill();}ctx.restore();}
      glow(x,y,30,p[2],.45*a);art(this.col===DGC.azure?'dhead':'dheadC',x,y,64,{rot:ang,sy:flip?-1:1,ax:.3,a,under:p[0],ua:.3});return;}
    this._draw0();}});
/* lightning: the game's bolt is drawn by DBolt (spawned when the game adds it), its own drawing is off */
patch(DgBolt,{draw(){}});
/* chain lightning between two enemies — or Mirror Pond throwing a shot back (starts on the dragon) */
patch(DgArc,{draw(){const k=this.t/this.life,a=1-k,mir=hasBuff('dkMirror')&&Math.hypot(this.a[0]-player.x,this.a[1]-player.y)<6,p=mir?SEA:THU,[x0,y0]=P(this.a[0],this.a[1],mir?40:34),[x1,y1]=P(this.b[0],this.b[1],34);
    const n=7,q=[],w=[];for(let i=0;i<=n;i++){const s=i/n,j=(i===0||i===n)?0:R_(-1,1)*(mir?3:10);q.push([lerp(x0,x1,s)+j,lerp(y0,y1,s)+j*.6]);w.push((mir?3.4:2.8)*(.4+.6*Math.sin(Math.PI*s))*a+.4);}
    ctx.save();ctx.globalCompositeOperation='lighter';band(q,w,[[2.4,mir?'#2fa8f0':'#5a3cb0',.35*a]]);ctx.globalCompositeOperation='source-over';band(q,w,[[1,p[2],a],[.5,p[3],a],[.22,'#ffffff',a]]);ctx.restore();glow(x1,y1,22,p[2],.5*a);}});

/* the dragon's ground layer: clouds (+ rain ripples), Mirror Pond, Still Mind, and what is behind the dragon (pearls, coil, flames, the sovereign cloud) */
const ORB={n:0},RAIN=[],RIP=[];let lastStorm=null,lastWall=null,lastMael=null,coilOn=0,orbsSeen=0;
function orbPos(i,t){const an=t*2.4+i*TAU/DG_BAL.orb.cap;return [player.x+Math.cos(an)*30,player.y+Math.sin(an)*18,(player.z||0)+44+3*Math.sin(an*2+t),Math.sin(an)];}
function drawOrbs(t,front){for(let i=0;i<DG.orbs;i++){const [x,y,z,s]=orbPos(i,t);if((s>0)!==front)continue;const [sx,sy]=P(x,y,z);
    for(let j=1;j<=3;j++){const [tx0,ty0,tz0]=orbPos(i,t-j*.045),[qx,qy]=P(tx0,ty0,tz0);glow(qx,qy,9-j*1.5,'#c8b8ff',.25*(1-j/4));}glow(sx,sy,15,'#c8b8ff',.5);art('pearl',sx,sy,17,{rot:t*2});}}
function coilPts(i,t){const pts=[];for(let j=0;j<=12;j++){const an=-t*3+i*Math.PI+j*.17,x=player.x+Math.cos(an)*40,y=player.y+Math.sin(an)*26,z=(player.z||0)+38+6*Math.sin(an*2+t*3);pts.push({x,y,z,front:Math.sin(an)>0,an});}return pts;}
function drawCoil(t,front){const on=hasBuff('dkCoil');if(!on)return;const a=cl((player.buffs.dkCoil?player.buffs.dkCoil.t:1)/.4,0,1);
  for(let i=0;i<2;i++){const p=i?CLD:AZU,pts=coilPts(i,t);for(const R of runs(pts,q=>q.front===front)){const q=R.map(o=>P(o.x,o.y,o.z)).map(s=>[s[0],s[1]]),w=R.map(o=>{const j=pts.indexOf(o);return 1+4.5*(1-j/12);});ctx.save();band(q,w,tones(p,a*.85));ctx.restore();}
    const h=pts[0];if(h.front===front){const [x,y]=P(h.x,h.y,h.z),n=pts[1],[x2,y2]=P(n.x,n.y,n.z),ang=Math.atan2(y-y2,x-x2);glow(x,y,14,p[2],.4*a);art(i?'dheadC':'dhead',x,y,28,{rot:ang,sy:Math.cos(ang)<0?-1:1,ax:.3,a});}}}
function drawFlames(t,front){if(!hasBuff('dcAwaken'))return;const b=player.buffs.dcAwaken,a=cl((b?b.t:1)/.5,0,1),[hx,hy]=P(player.x,player.y,(player.z||0)+60);
  if(front){glow(hx,hy,46,'#4ab8ff',(.18+.06*Math.sin(t*8))*a);return;}
  for(let i=0;i<7;i++){const an=-Math.PI/2+(i-3)*.46,r=15+2.5*Math.sin(t*9+i),x=hx+Math.cos(an)*r,y=hy+Math.sin(an)*r*.8,s=(.75+.3*Math.abs(Math.sin(t*(7+i)+i*1.7)))*(i%2?.8:1);art('flameB',x,y,9*s,{rot:an+Math.PI/2+.25*Math.sin(t*5+i),ay:.9,a:a*.72});}}
function drawSovereign(front){if(!hasBuff('dcSovereign'))return;const b=player.buffs.dcSovereign,a=cl((b?b.t:1)/.4,0,1)*cl((gameTime-(DV.sovT||0))/.25,0,1),[x,y]=P(player.x,player.y,0),t=gameTime;
  if(!front){glow(x,y,60,'#7a5ae0',.26*a);art('kumoS',x,y-4+Math.sin(t*3)*2,112,{a:a*.78,ay:.72});return;}
  art('kumoS',x-30,y+6+Math.sin(t*3+1)*2,56,{a:a*.72,ay:.6});art('kumoS',x+32,y+7+Math.sin(t*3+2)*2,50,{a:a*.72,ay:.6,sx:-1});if(Math.random()<.08)zaps(x+R_(-40,40),y+R_(-4,10),1,14,THU[2],a);}
patch(DgGround,{update(dt){const r=this._update0(dt);try{watch(dt);}catch(e){console.warn('dragon watch',e);}return r;},
  draw(){const t=this.t;
    /* Cloud Step: a low bank of clouds that slows (rain cloud hangs above, see DgTop) */
    for(const c of DG.clouds){if(!c._o){c._t0=gameTime;c._o=[];for(let i=0;i<5;i++){const a=i/5*TAU+R_(-.3,.3),r=c.R*R_(.25,.6);c._o.push([Math.cos(a)*r,Math.sin(a)*r*.7,R_(.75,1.05),Math.random()<.5,R_(0,TAU)]);}c._o.sort((p,q)=>p[1]-q[1]);}
      const a=cl((gameTime-c._t0)/.3,0,1)*cl((c.until-gameTime)/.45,0,1);if(a<=.01)continue;const [x,y]=P(c.x,c.y,0);
      ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.3*a;const g=ctx.createRadialGradient(0,0,0,0,0,c.R*1.05);g.addColorStop(0,'#5a3cb0');g.addColorStop(1,'rgba(90,60,176,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,c.R*1.05,0,TAU);ctx.fill();ctx.restore();
      for(const [ox,oy,s,fl,ph] of c._o){const [qx,qy]=P(c.x+ox+Math.sin(t*.8+ph)*4,c.y+oy,0);art('kumo',qx,qy,c.R*1.15*s,{ay:.78,a:a*.88,sx:fl?-1:1});}}
    for(const r of RIP){const k=r.t/.3,[x,y]=P(r.x,r.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.6*(1-k);ctx.strokeStyle='#d8ecff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,2+7*k,0,TAU);ctx.stroke();ctx.restore();}
    /* Mirror Pond under the dragon */
    if(hasBuff('dkMirror')){const b=player.buffs.dkMirror,a=cl((b?b.t:1)/.3,0,1)*cl((gameTime-(DV.mirT||0))/.2,0,1),[x,y]=P(player.x,player.y,0);art('mirror',x,y,108*(.85+.15*a),{flat:1,a:a*.92,rot:t*.2});
      ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';for(let i=0;i<2;i++){const k=((t*.9+i*.5)%1);ctx.globalAlpha=a*.5*(1-k);ctx.strokeStyle='#e8f8ff';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,14+40*k,0,TAU);ctx.stroke();}ctx.restore();}
    /* Still Mind is ready: a calm lilac ring at the feet */
    if(DG.stillReady&&dL('dkStill')){const [x,y]=P(player.x,player.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.45+.15*Math.sin(t*4);ctx.strokeStyle='#c8b8ff';ctx.lineWidth=2;ctx.setLineDash([10,7]);ctx.lineDashOffset=-t*14;ctx.beginPath();ctx.arc(0,0,30,0,TAU);ctx.stroke();ctx.restore();}
    drawSovereign(false);drawOrbs(t,false);drawCoil(t,false);drawFlames(t,false);}});
/* the dragon's top layer: flow pips, pearls / coil / flames in front, the sovereign cloud's front, rain, thunder seals on enemies */
patch(DgTop,{update(dt){const r=this._update0(dt);
    for(const c of DG.clouds){if(!c.rain)continue;const n=dt*60;for(let i=0;i<n*Q.p;i++){const a=R_(0,TAU),d=c.R*Math.sqrt(Math.random())*.95;RAIN.push({x:c.x+Math.cos(a)*d,y:c.y+Math.sin(a)*d*.8,z:R_(80,110),v:R_(480,560)});}}
    for(let i=RAIN.length-1;i>=0;i--){const d=RAIN[i];d.z-=d.v*dt;if(d.z<=0){if(Math.random()<.4)RIP.push({x:d.x,y:d.y,t:0});RAIN.splice(i,1);}}if(RAIN.length>500)RAIN.splice(0,RAIN.length-500);
    for(let i=RIP.length-1;i>=0;i--){RIP[i].t+=dt;if(RIP[i].t>.3)RIP.splice(i,1);}return r;},
  draw(){const t=this.t,pz=(player.z||0)+80;
    /* Flow 0–5: drops of sea above the head (gold rim while Ocean Never Rests holds it full) */
    if(DG.flow>0){const [x,y]=P(player.x,player.y,pz),lock=DG.flowLock>gameTime;for(let i=0;i<DG_BAL.flow.cap;i++){const on=i<DG.flow,px=x+(i-2)*10,py=y+Math.abs(i-2)*2.2,s=on&&i===DG.flow-1?1+(DG.flowPop||0)*.5:1;
        if(on){glow(px,py,9,lock?'#ffd23a':'#2fa8f0',.5);art('drop',px,py,8.5*s,{under:'#04203a',ua:.5});}else{ctx.save();ctx.globalAlpha=.45;const im=tint('drop','#0a1a2a');if(im)ctx.drawImage(im,px-3.6,py-5.1,7.2,10.2);ctx.restore();}}}
    drawOrbs(t,true);drawCoil(t,true);drawFlames(t,true);drawSovereign(true);
    /* a rain cloud above every raining cloud, rain streaks under it */
    for(const c of DG.clouds){if(!c.rain||!c._t0)continue;const a=cl((gameTime-c._t0)/.3,0,1)*cl((c.until-gameTime)/.45,0,1),[x,y]=P(c.x,c.y,112);art('kumoS',x,y,c.R*1.45,{a:a*.62});art('kumoS',x-c.R*.42,y+5,c.R*.9,{a:a*.5,sx:-1});}
    if(RAIN.length){ctx.save();ctx.strokeStyle='#cfe4ff';ctx.lineWidth=1.3;ctx.globalAlpha=.7;ctx.beginPath();for(const d of RAIN){const [x,y]=P(d.x,d.y,d.z);ctx.moveTo(x,y);ctx.lineTo(x-1.5,y-11);}ctx.stroke();ctx.restore();}
    /* Thunder Seals: a gold mitsudomoe over each sealed enemy, one comma per seal */
    for(const e of enemies){if(e.dead||!(e.dgSeal>0)){if(e)e._dgS=0;continue;}if((e.dgSeal||0)>(e._dgS||0))e._dgSt=gameTime;e._dgS=e.dgSeal;
      const pop=1+.5*(1-cl((gameTime-(e._dgSt||0))/.22,0,1)),[x,y]=P(e.x,e.y,(e.boss?100:72)+(e.z||0)),rot=t*1.4,w=26*pop;glow(x,y,20*pop,'#ffd23a',.35);art('sealR',x,y,w,{rot});
      for(let i=0;i<e.dgSeal;i++){const an=rot+i*TAU/3;art('comma',x+Math.cos(an)*w*.16,y+Math.sin(an)*w*.16,w*.34,{rot:an+Math.PI*.75});}}}});
/* the core tells the hit code when an orbit pearl (not a palm) struck */
patch(DgCore,{update(dt){DV.core=1;DV.tg=gameTime;let r;try{r=this._update0(dt);}finally{DV.core=0;}return r;}});

/* ---------------------------------------------------------------------
   5. ZONES THAT APPEAR WITH THEIR GAME OBJECT (watched every frame by DgGround)
   --------------------------------------------------------------------- */
/* Azure Dragon Descends: the giant azure dragon comes down from the sky and coils round the field, lightning every second;
   the far half of its body is on the ground layer (behind the fighters), the near half on top. Then it climbs away. */
class DStorm{constructor(S,front){Object.assign(this,{t:0,x:S.x,y:S.y,R:S.R,S,front,layer:front?'top':'ground'});this.T=Math.max(.5,S.until-gameTime);this.life=this.T+1.1;this.th0=R_(0,TAU);}
  update(dt){this.t+=dt;return this.t<this.life;}
  at(tau){const t=this.t,R=this.R*.9,th=this.th0-2.3*tau,x=this.x+Math.cos(th)*R,y=this.y+Math.sin(th)*R;let z=48+12*Math.sin(th*3+t*2);
    if(tau<.42)z+=Math.pow(1-Math.max(0,tau)/.42,2)*360;if(tau>this.T)z+=Math.pow(tau-this.T,1.6)*700;return [x,y,z,Math.sin(th)];}
  draw(){const t=this.t,fin=cl((this.life-t)/.5,0,1),fi=cl(t/.25,0,1);
    if(!this.front){/* the storm floor: dark water-sky, a gold rim, the great thunder seal turning in the middle, clouds round the edge */
      const [x,y]=P(this.x,this.y,0),a=fi*cl((this.T+.4-t)/.4,0,1);if(a>.01){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,this.R*1.1);g.addColorStop(0,'rgba(30,18,64,.5)');g.addColorStop(.8,'rgba(31,79,216,.22)');g.addColorStop(1,'rgba(31,79,216,0)');
        ctx.globalAlpha=a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R*1.1,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffd23a';ctx.lineWidth=3;ctx.setLineDash([26,14]);ctx.lineDashOffset=-t*40;ctx.globalAlpha=.55*a;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.stroke();ctx.restore();
        art('sealR',x,y,this.R*1.3,{flat:1,rot:t*.5,a:.35*a});for(let i=0;i<3;i++){const an=t*.5+i*TAU/3;art('comma',x+Math.cos(an)*this.R*.2,y+Math.sin(an)*this.R*.2*K,this.R*.42,{flat:1,rot:an+Math.PI*.75,a:.3*a});}
        for(let i=0;i<9;i++){const an=i/9*TAU+t*.15,[cx,cy]=P(this.x+Math.cos(an)*this.R*1.02,this.y+Math.sin(an)*this.R*.98,0);art('kumoS',cx,cy,70,{ay:.75,a:.8*a,sx:i%2?-1:1});}}}
    /* the body: 28 segments trailing the head round the circle */
    const N=28,pts=[];for(let i=0;i<=N;i++){const [x,y,z,s]=this.at(t-i*.055);pts.push({x,y,z,s,i});}
    for(const R of runs(pts,o=>(o.s>0)===this.front)){const q=R.map(o=>{const s=P(o.x,o.y,o.z);return [s[0],s[1]];}),w=R.map(o=>2+16*Math.pow(1-o.i/N,.75));ctx.save();
      band(q,w,[[1.45,AZU[0],.35*fin],[1.12,AZU[1],fin],[.8,AZU[2],fin],[.42,'#9fc0ff',fin],[.12,'#e8f0ff',.7*fin]]);
      /* rows of scales (dark chevrons) and gold dorsal fins */
      for(let j=1;j<R.length-1;j++){const [qx,qy]=q[j],[px,py]=q[j-1],dx=qx-px,dy=qy-py,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,nx=-uy,ny=ux,W=w[j];
        ctx.globalAlpha=.55*fin;ctx.strokeStyle=AZU[1];ctx.lineWidth=Math.max(.8,W*.14);ctx.beginPath();ctx.moveTo(qx+nx*W*.6-ux*W*.3,qy+ny*W*.6-uy*W*.3);ctx.lineTo(qx,qy);ctx.lineTo(qx-nx*W*.6-ux*W*.3,qy-ny*W*.6-uy*W*.3);ctx.stroke();
        if(R[j].i%2===0){const sg=ny<0?1:-1,bx=qx+nx*W*.95*sg,by=qy+ny*W*.95*sg;ctx.globalAlpha=fin;ctx.fillStyle='#ffd86a';ctx.beginPath();ctx.moveTo(bx-ux*W*.4,by-uy*W*.4);ctx.lineTo(bx+nx*W*.55*sg-ux*W*.7,by+ny*W*.55*sg-uy*W*.7);ctx.lineTo(bx+ux*W*.25,by+uy*W*.25);ctx.closePath();ctx.fill();}}
      ctx.restore();}
    const h=pts[0];if((h.s>0)===this.front){const [x,y]=P(h.x,h.y,h.z),n=pts[2],[x2,y2]=P(n.x,n.y,n.z),ang=Math.atan2(y-y2,x-x2);glow(x,y,64,'#4a8aff',.4*fin);art('dhead',x,y,124,{rot:ang,sy:Math.cos(ang)<0?-1:1,ax:.3,a:fin,under:'#06123a',ua:.3});}}}
/* Gale Wall: a standing curtain of wind across the dragon's front (sorted with the fighters) */
class DWall{constructor(W){Object.assign(this,{t:0,layer:'sorted',W,x:W.x,y:W.y,phi:W.phi});this.T=Math.max(.3,W.until-gameTime);this.life=this.T+.35;}
  get sy(){return this.y;}
  update(dt){this.t+=dt;if(Math.random()<.35){const nx=-Math.sin(this.phi),ny=Math.cos(this.phi),s=R_(-1,1)*DB.dkWall.len/2;puffs(this.x+nx*s,this.y+ny*s,2,1,{s:22,spd:12,rise:60,life:.7,a:.5});}return this.t<this.life;}
  draw(){const t=this.t,a=cl(t/.2,0,1)*cl((this.life-t)/.35,0,1),nx=-Math.sin(this.phi),ny=Math.cos(this.phi),L=DB.dkWall.len/2;if(a<=.01)return;ctx.save();
    for(let i=0;i<9;i++){const s=(i/8-.5)*2*L,x=this.x+nx*s,y=this.y+ny*s,h=62+10*Math.sin(i*1.7+t*3),q=[],w=[];for(let j=0;j<=8;j++){const z=h*j/8,[qx,qy]=P(x+Math.sin(z*.08+t*9+i)*4,y,z);q.push([qx,qy]);w.push(5*(1-j/8)+1.5);}
      band(q,w,[[1.6,CLD[1],.18*a],[1,'#ffffff',.22*a],[.45,'#ffffff',.4*a]]);}
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#e8e0ff';ctx.lineWidth=2;for(let i=0;i<6;i++){const k=((t*1.6+i/6)%1),s=(R_(-1,1))*L*.9,[qx,qy]=P(this.x+nx*s,this.y+ny*s,k*70);ctx.globalAlpha=a*(1-k)*.8;ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(qx,qy-12);ctx.stroke();}
    const [ax,ay]=P(this.x+nx*L,this.y+ny*L,0),[bx,by]=P(this.x-nx*L,this.y-ny*L,0);ctx.globalAlpha=a*.6;ctx.strokeStyle='#ece6ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.restore();}}
/* Maelstrom: a whirlpool on the ground that drags everything in (spiralling foam and drops), water walls turning at the rim */
class DMael{constructor(M,front){Object.assign(this,{t:0,M,x:M.x,y:M.y,R:M.R,front,layer:front?'top':'ground'});this.acc=0;}
  update(dt){this.t+=dt;if(!this.front&&DG.mael===this.M){this.acc+=dt;while(this.acc>.03){this.acc-=.03;const S=this._S||(this._S=sys('ground',2.6)),an=R_(0,TAU);
        S.add({orb:1,cx:this.x,cy:this.y,ang:an,va:4.2,r:this.R*R_(.75,.95),vr2:-this.R*.5,im:FOAM,asp:.66,s0:R_(12,18),s1:R_(6,9),life:R_(.9,1.3),fo:.4,flat:1,rot:R_(0,TAU),vr:-4,a0:.75});}}
    return DG.mael===this.M||this.t<.05;}
  draw(){const t=this.t,a=cl(t/.25,0,1),[x,y]=P(this.x,this.y,0);
    if(!this.front){glow(x,y,this.R*.9,SEA[1],.25*a);art('whirl',x,y,this.R*2.05,{flat:1,rot:-t*5,a:.9*a});art('whirl',x,y,this.R*1.2,{flat:1,rot:-t*8+1,a:.5*a});}
    ctx.save();for(let i=0;i<5;i++){const a0=-t*4.2+i*TAU/5,q=[],w=[];let any=0;for(let j=0;j<=10;j++){const an=a0+j*.12,front=Math.sin(an)>0;if(front!==this.front)continue;any=1;const [qx,qy]=P(this.x+Math.cos(an)*this.R*.92,this.y+Math.sin(an)*this.R*.88,6+16*Math.sin(Math.PI*j/10));q.push([qx,qy]);w.push(5*Math.sin(Math.PI*j/10)+1);}
      if(any&&q.length>2)band(q,w,tones(SEA,a*.8));}ctx.restore();}}
function watch(dt){/* the zones' game objects appear → their pieces */
  const S=DG.storm;if(S&&S!==lastStorm){lastStorm=S;addFx(new DStorm(S,false));addFx(new DStorm(S,true));const fl=sys('top');G.flare(fl,S.x,S.y,90,200,'#4a8aff',.4);ring({x:S.x,y:S.y,r0:20,r1:S.R+20,w:10,pal:AZU,life:.6,segs:4,gap:.2});}
  const W=DG.wall;if(W&&W!==lastWall){lastWall=W;addFx(new DWall(W));}
  const M=DG.mael;if(M&&M!==lastMael){lastMael=M;addFx(new DMael(M,false));addFx(new DMael(M,true));}
  /* a pearl is born */
  if(DG.orbs>orbsSeen){for(let i=orbsSeen;i<DG.orbs;i++){const [x,y,z]=orbPos(i,gameTime);addFx(new KGlint({x,y,z,s:16,col:'#ece6ff',life:.22}));}}orbsSeen=DG.orbs;
  const cOn=hasBuff('dkCoil');if(cOn&&!coilOn){const S2=sys('top');G.glints(S2,player.x,player.y,40,8,40,'#bcd4ff',.6);}coilOn=cOn;}

/* ---------------------------------------------------------------------
   6. ENGINE PIECES THE DRAGON MAKES — rings are exact-time markers, the rest is swallowed
   --------------------------------------------------------------------- */
const near=(x,y)=>Math.hypot(x-player.x,y-player.y)<6;
function ringMark(f){const c=f.color,r=f.r1;
  if(c===DGC.white&&r===DB.dnSweep.R)return 1;                                                  /* tail sweep: drawn by the basic wrapper */
  if(c==='#9aff9a'){healFx(f.x,f.y);return 1;}                                                    /* Calm Breath heals */
  if(c===DGC.gold&&r===DB.dnRoar.R){roarFx(f.x,f.y);return 1;}                                     /* Lion's Roar */
  if(c===DGC.gold&&r===DB.dcStone.R){ring({x:f.x,y:f.y,r0:12,r1:r+10,w:8,pal:STN,life:.42,segs:3,gap:.2});ring({x:f.x,y:f.y,r0:8,r1:r*.7,w:5,pal:GLD,life:.36,segs:4,gap:.3,delay:.05});dust(f.x,f.y,6,{ring:34,spd:150,size:34,life:.6});
    stonesFx(f.x,f.y,9);return 1;}   /* Stone Guardian */
  if(c===DGC.sea2&&r===DB.daCrash.R){crashFx(f.x,f.y);return 1;}                                  /* Crashing Tide */
  if(c===DGC.sea2&&Math.abs(r-DB.dcMaelstrom.R*.6)<1){maelEnd(f.x,f.y);return 1;}                   /* Maelstrom's punch */
  if(c==='#e8e0ff'){pushFx(f.x,f.y,DB.dkPush.R,DV.pushN||0);DV.pushN=0;return 1;}                 /* Heaven Push */
  if(c===DGC.sea2&&r===50){DV.mirT=gameTime;ring({x:f.x,y:f.y,r0:8,r1:58,w:5,pal:SEA,life:.4,segs:4,gap:.25});const S=sys('top');G.glints(S,f.x,f.y,8,8,40,'#e8f8ff',.7);return 1;}   /* Mirror Pond */
  if(c===DGC.azure&&r===120){awakenFx(f.x,f.y);return 1;}                                          /* Shishi Awakening */
  return 0;}
function crashFx(x,y){const W=sys('top');for(let i=0;i<6;i++){const a=i/6*TAU+R_(-.2,.2),r=DB.daCrash.R*.55;crown(x+Math.cos(a)*r,y+Math.sin(a)*r*.8,46,{delay:i*.015});}
  crown(x,y,78);ring({x,y,r0:10,r1:DB.daCrash.R+8,w:10,pal:SEA,life:.4,segs:4,gap:.2});foam(x,y,10,DB.daCrash.R*.8);pool({x,y,R:DB.daCrash.R,life:1.3});drops(x,y,30,16,{spd:220,up:260});G.flare(W,x,y,20,110,SEA[2],.28);}
function maelEnd(x,y){addFx(new DGeyser({x,y,w:64,life:.8}));crown(x,y,84);ring({x,y,r0:10,r1:DB.dcMaelstrom.R*.65,w:12,pal:SEA,life:.42,segs:3,gap:.2});foam(x,y,10,40);drops(x,y,40,18,{spd:200,up:300});pool({x,y,R:70,life:1.3});}
function awakenFx(x,y){for(let i=0;i<10;i++){const a=i/10*TAU;sprite({n:'flameB',layer:Math.sin(a)>0?'top':'ground',x:x+Math.cos(a)*30,y:y+Math.sin(a)*22,z:0,ay:.95,w:R_(12,18),life:.5,fo:.3,s0:.3,s1:1,pop:.1,vz:60,delay:i*.012});}
  sprite({n:'shishiB',layer:'ground',x,y:y-4,z:98,w:112,life:.9,fi:.05,fo:.5,s0:.5,s1:1.05,pop:.18,a:.9});ring({x,y,r0:12,r1:120,w:7,pal:AZU,life:.5,segs:4,gap:.2});sprite({layer:'ground',x,y:y-4,z:94,life:.7,fo:.45,paint:(f,sx,sy,sc,a)=>glow(sx,sy,80,'#4ab8ff',.3*a)});
  embers(x,y,30,16,{spd:160,up:220,c:['#ffffff','#6ab4ff','#1f4fd8'],life:.8});}
if(!window._dgv3h){window._dgv3h=1;const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
      if(n==='HitCrescents'||n==='PuffDust')return f;
      if(f instanceof DgBolt){try{addFx(new DBolt({x:f.x,y:f.y,e:nearestEnemy(f.x,f.y,8)}));boltHit(f.x,f.y,{big:false});}catch(_){}}
      else if(/^(SoftRing|GRing)$/.test(n)){if(f.color==='#ffe9a8'){const p=GLD;A0(new KRing({x:f.x,y:f.y,r0:f.r0||10,r1:f.r1||46,w:5,pal:p,life:f.life||.32,segs:4,gap:.3}));return f;}
        if(mine()||near(f.x,f.y)){try{if(ringMark(f))return f;}catch(e){console.warn('dragon ring',e);}}}
      else if(/^(SoftImpact|Impact)$/.test(n)){const q=f.pos||[f.x,f.y,24];if(f.color==='#ffe9a8'){A0(new KGlint({x:q[0],y:q[1],z:q[2],s:14,col:GLD[3],life:.16}));umes(q[0],q[1],q[2],2,{spd:120});return f;}
        if(mine()||near(q[0],q[1]))return f;}
      else if(n==='GLight'&&(mine()||near(f.x,f.y))&&(f.color===DGC.gold||f.color===DGC.sea2||f.color===DGC.cloud||f.color===DGC.azure||f.color==='#ffe9a8'))return f;
      else if(n==='Streak'&&f.color===DGC.sea&&aKey()==='daHook'){const a=f.a,an=Math.atan2(a[1]-player.y,a[0]-player.x);addFx(new DRope({from:[a[0],a[1]],to:[player.x+Math.cos(an)*46,player.y+Math.sin(an)*46]}));
        addFx(new KStreak({a:[a[0],a[1]],b:[player.x+Math.cos(an)*46,player.y+Math.sin(an)*46],z:20,w:7,life:.22,pal:SEA,ink:.3}));return f;}}
    return A0.apply(this,arguments);};
  const E0=window.emit;window.emit=emit=function(o){if(o&&o.type==='round'&&(mine()||/^#(cfe8ff|efe8ff|bfffcf|cfe0ff)$/i.test(o.color||'')))return;return E0.apply(this,arguments);};}

/* ---------------------------------------------------------------------
   7. PER SKILL — punches land on their events; casts gather for the wind-up and release on the frame
   --------------------------------------------------------------------- */
/* n punch events (the first n of the action) → a fist each that lands exactly on its event */
function punches(a,n,spawn,lead=.07){const L=lead*TEMPO(),Pz=a.events.slice(0,n).map((ev,i)=>({t:ev.t,i,done:0}));
  onUpd(a,A=>{for(const p of Pz){if(p.done||A.t<p.t-L)continue;p.done=1;spawn(p.i,Math.max(.012,rt(p.t-A.t)),A);}});}
/* the cast moment of a buff-clip skill (its event at windup) */
const atRelease=(a,f)=>{a.events.push({t:Math.max(.001,a.windup-.001),f:()=>{try{f();}catch(e){console.warn('dragon fx',e);}}});};
function fistTo(e,lead,o={}){const phi=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,side=o.side||0,h=hand(phi,side),dz=o.dz||0;
  const p1=e?[e.x,e.y,zOf(e)+dz]:[player.x+Math.cos(phi)*62,player.y+Math.sin(phi)*62,32];if(o.jit){p1[0]+=R_(-1,1)*o.jit;p1[1]+=R_(-1,1)*o.jit*.6;p1[2]+=R_(-1,1)*o.jit*.6;}
  return fist(Object.assign({p0:[h[0],h[1],o.z0!=null?o.z0:h[2]],p1,e:o.jit?null:e,lead},o));}
/* the hero's own action glow is kept but softer: the new pieces carry the light */
const soften=a=>onUpd(a,()=>{if(player.glow&&player.glow.k)player.glow={color:player.glow.color,k:player.glow.k*.45};});
const wrapMk=(k,fn)=>{const s=SKILLS[k];if(!s||!s.make||s.make._dv)return;const mk=s.make;s.make=function(c){const a=mk.apply(this,arguments);if(a){try{soften(a);fn(a,c||{});}catch(e){console.warn('dragon fx',k,e);}}return a;};s.make._dv=1;};
function installMk(){
  /* ---- normal attack: a fist of water on every punch; the chain's last blow is the tail sweep (or the ki fist of Dragon Chain) ---- */
  if(typeof mkBasic==='function'&&!mkBasic._dv){const mb=mkBasic;mkBasic=function(tgt){const a=mb.apply(this,arguments);if(!a||!a.events)return a;try{soften(a);const nm=a.name||'';
      if(/Tail Sweep/.test(nm)){const phi=player.phi,tC=a.events[0].t;onUpd(a,A=>{if(A._sw||A.t<tC-.11*TEMPO())return;A._sw=1;const lead=Math.max(.02,rt(tC-A.t));
          addFx(new KArc({x:player.x,y:player.y,z:12,phi,tilt:0,a0:phi-Math.PI*1.1,a1:phi+Math.PI*1.05,hit:phi,R:DB.dnSweep.R*.82,W:24,lead,sweep:lead+.12,hold:.03,fade:.16,pal:FUR,ink:.4,N:40,edge:.24,follow:1}));
          later(lead,()=>{ring({x:player.x,y:player.y,r0:14,r1:DB.dnSweep.R+6,w:7,pal:FUR,life:.32,segs:3,gap:.3});dust(player.x,player.y,7,{ring:40,spd:110,size:38,life:.55});});});}
      else if(/Dragon Chain/.test(nm)){const tC=a.events[0].t;gather({T:Math.max(.05,rt(tC)),pal:SEA,R:24});}
      else punches(a,1,(i,lead)=>fistTo(tgt,lead,{w:38,side:(player.basicIdx%2?7:-7)}),.07);}catch(e){console.warn('dragon basic fx',e);}return a;};mkBasic._dv=1;}
  /* ---- Basic branch ---- */
  wrapMk('dnGuard',(a)=>{addFx(new DShield({T:DB.dnGuard.T}));});
  wrapMk('dnRush',(a)=>{const sx=player.x,sy=player.y;a.events.push({t:.012,f:()=>{addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],z:30,w:12,life:.2,pal:GLD,ink:.35,live:.26}));
      sprite({n:'horn',layer:'top',follow:player,ox:0,oy:0,z:46,w:58,life:.3,fi:.02,fo:.12,ax:.35,tick:f=>{const s=scr(player.phi);f.rot=s;f.sy2=Math.cos(s)<0?-1:1;f.ox=Math.cos(player.phi)*12;f.oy=Math.sin(player.phi)*12;}});
      dust(sx,sy,6,{spd:90,size:36,life:.5,dir:player.phi+Math.PI,spread:.8});}});});
  wrapMk('dnBreath',(a)=>{addFx(new DBreath({T:DB.dnBreath.T,front:0}));addFx(new DBreath({T:DB.dnBreath.T,front:1}));});
  /* ---- A · Raging Tide Fist ---- */
  wrapMk('daJab',(a,c)=>{const n=dL('dcBarrage')?DB.dcBarrage.n:DB.daJab.n,t=tgtOf(c,DB.daJab.range);
    punches(a,n,(i,lead)=>{const last=i===n-1;fistTo(t,lead,{w:last&&n>3?44:36,side:i%2?8:-8,big:last&&n>3});},.06);});
  wrapMk('daHook',(a,c)=>{const t=tgtOf(c,DB.daHook.range);punches(a,1,(i,lead)=>{fistTo(t,lead,{w:44,arc:(Math.random()<.5?1:-1)*24,big:1,tr:.85});
      later(lead,()=>{if(!t||t.dead)return;sprite({n:'whirl',layer:'ground',x:t.x,y:t.y,z:0,w:84,flat:1,life:.55,fo:.4,s0:.4,s1:1,spin:-9});addFx(new DCurl({e:t,x:t.x,y:t.y,R:t.r+16,front:0}));addFx(new DCurl({e:t,x:t.x,y:t.y,R:t.r+16,front:1}));});},.09);});
  wrapMk('daStep',(a,c)=>{const sx=player.x,sy=player.y,t=tgtOf(c,DB.daStep.range);a.events.push({t:.012,f:()=>{addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],z:22,w:13,life:.26,pal:SEA,ink:.35,live:.22}));foam(sx,sy,4,14);}});
    onUpd(a,A=>{if(A.t<.23&&Math.random()<.5)foam(player.x,player.y,1,6,{spd:5,life:.8});});
    const ev=a.events.find(e=>e.t>.2);if(ev){const f0=ev.f;ev.f=function(A){const r=f0.apply(this,arguments);try{if(t&&!t.dead){fistTo(t,.02,{w:38,big:1,stay:.07});splash(t.x,t.y,.9);if(dL('daCounter')&&t.atk>0)later(.12,()=>{if(t.dead)return;fistTo(t,.03,{w:40,n:'fistG',pal:GLD,big:1});ring({x:t.x,y:t.y,r0:8,r1:60,w:7,pal:GLD,life:.32,segs:4,gap:.25});});}}catch(e){}return r;};}});
  wrapMk('daHundred',(a,c)=>{const t=tgtOf(c,DB.daHundred.range),n=Math.max(1,a.events.length-1);punches(a,n,(i,lead)=>{const last=i===n-1;fistTo(t,lead,{w:last?44:34,side:i%2?9:-9,big:last});
      if(!last)fistTo(t,lead,{w:28,side:R_(-14,14),jit:12,a0:.45,burst:0,tr:.5});},.05);});
  wrapMk('daTsunami',(a,c)=>{const t=tgtOf(c,DB.daTsunami.range);punches(a,1,(i,lead)=>{fistTo(t,lead,{w:46,z0:10,dz:14,big:1,tr:.9});
      later(lead,()=>{if(!t)return;addFx(new DGeyser({x:t.x,y:t.y,w:56,life:.78}));crown(t.x,t.y,70);drops(t.x,t.y,40,12,{spd:120,up:380});foam(t.x,t.y,6,24);pool({x:t.x,y:t.y,R:40});});},.09);});
  wrapMk('daEbb',(a)=>{addFx(new DDome({T:DB.daEbb.T}));const ev=a.events[a.events.length-1];if(ev){const f0=ev.f;ev.f=function(A){const r=f0.apply(this,arguments);try{const t=nearestEnemy(player.x,player.y,BASIC_RANGE+70);if(t){fistTo(t,.03,{w:46,big:1,stay:.08});splash(t.x,t.y,1.2);ring({x:t.x,y:t.y,r0:10,r1:70,w:8,pal:SEA,life:.35,segs:4,gap:.2});}}catch(e){}return r;};}});
  wrapMk('daTorrent',(a)=>{const sx=player.x,sy=player.y;const S=sys('top');a.events.push({t:.02,f:()=>{G.flare(S,sx,sy,40,120,SEA[2],.3);crown(sx,sy,60);}});
    for(const ev of a.events){if(ev._dv)continue;ev._dv=1;const f0=ev.f;ev.f=function(A){const ox=player.x,oy=player.y;let g=null;try{if(typeof Ghost==='function'&&typeof snapPlayer==='function')g=new Ghost({snap:snapPlayer(),color:DGC.sea});}catch(_){}
      const r=f0.apply(this,arguments);try{const mv=Math.hypot(player.x-ox,player.y-oy);if(mv>8){if(g)addFx(g);addFx(new KStreak({a:[ox,oy],b:[player.x,player.y],z:30,w:10,life:.22,pal:SEA,ink:.3}));drops(ox,oy,30,5,{spd:100,up:140});
          const e=nearestEnemy(player.x,player.y,90);if(e&&Math.hypot(player.x-sx,player.y-sy)>2)fistTo(e,.03,{w:40,big:1,stay:.06});}}catch(_){}return r;};}});
  /* ---- B · Cloud Dragon Palm ---- */
  const palm=(k,pal,R)=>wrapMk(k,(a)=>{const tC=a.events[0]&&a.events[0].t;if(tC==null)return;gather({T:Math.max(.05,rt(tC)),pal,R:R||26});
    a.events.push({t:tC,f:()=>{const h=hand(player.phi);addFx(new KBurst({x:h[0],y:h[1],z:h[2],R:20,n:8,life:.16,pal,ink:.3}));puffs(h[0],h[1],h[2]-6,2,{s:22,spd:70,dir:player.phi,spread:.9,life:.4,a:.7,n:pal===SEA?'kumo':'kumo'});}});});
  palm('dkPalm',CLD);palm('dkSeal',THU,22);palm('dkTwin',AZU,32);
  wrapMk('dkCloud',(a)=>{const sx=player.x,sy=player.y;a.events.push({t:.012,f:()=>{puffs(sx,sy,6,5,{s:44,spd:60,rise:6,life:.7,a:.8,layer:'ground'});const S=sys('top');G.glints(S,sx,sy,20,6,30,'#ece6ff',.6);}});
    onUpd(a,A=>{if(A.t<.24&&Math.random()<.7)puffs(player.x,player.y,4,1,{s:28,spd:20,rise:8,life:.55,a:.7,layer:'ground'});});});
  wrapMk('dkPush',(a)=>{const ev=a.events[0];if(ev){const f0=ev.f;ev.f=function(){DV.pushN=DG.orbs;return f0.apply(this,arguments);};}gather({T:Math.max(.05,rt(a.windup)),pal:CLD,R:40,s:1.4});});
  wrapMk('dkMirror',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:SEA,R:30});});
  wrapMk('dkDescend',(a,c)=>{gather({T:Math.max(.05,rt(a.windup)),pal:AZU,R:36,s:1.5});atRelease(a,()=>{const x=c.gx??player.x,y=c.gy??player.y;puffs(x,y,140,6,{n:'kumoS',s:60,spd:60,rise:-20,life:1,a:.8});});});
  /* ---- C ---- */
  wrapMk('dcMaelstrom',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:SEA,R:34,s:1.3});atRelease(a,()=>{crown(player.x,player.y,70);foam(player.x,player.y,8,30);});});
  wrapMk('dcBreath',(a,c)=>{const t=tgtOf(c,DB.dcBreath.R),phi=t?Math.atan2(t.y-player.y,t.x-player.x):player.phi;gather({T:Math.max(.05,rt(a.windup)),pal:AZU,R:22,s:1.2});atRelease(a,()=>breathFx(phi));});
  wrapMk('dcAwaken',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:AZU,R:40,s:1.4});});
  wrapMk('dcAbyss',(a,c)=>{const t=tgtOf(c,DB.dcAbyss.len);punches(a,1,(i,lead)=>{const [fx0,fy0]=fwd(28);fist({p0:[...hand(player.phi)],p1:[fx0,fy0,2],lead,w:40,big:1,tr:.8});
      later(lead,()=>{const [x,y]=fwd(30);crown(x,y,80);foam(x,y,8,30);pool({x,y,R:50,life:1.4});drops(x,y,20,14,{spd:200,up:300});dust(x,y,8,{ring:20,spd:130,size:44,life:.7});});},.08);});
  wrapMk('dcSovereign',(a)=>{gather({T:Math.max(.05,rt(a.windup)),pal:THU,R:36,s:1.3});atRelease(a,()=>{DV.sovT=gameTime;puffs(player.x,player.y,6,6,{n:'kumoS',s:54,spd:90,rise:10,life:.7,a:.85,layer:'ground'});});});}
/* Dragon's Breath: a cone of azure breath from the mouth — a solid wedge that rolls out, ribbons and drops racing along it */
class DCone{constructor(o){Object.assign(this,{t:0,layer:'top',life:.52,R:170,half:.55,phi:0},o);this.x=player.x+Math.cos(this.phi)*12;this.y=player.y+Math.sin(this.phi)*12;this.z=56;this.tg=[0,1,2,3,4].map(()=>[R_(-.8,.8),R_(0,TAU),R_(.75,1)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  pt(an,r){return P(this.x+Math.cos(an)*r,this.y+Math.sin(an)*r,Math.max(4,this.z-r*.25));}
  draw(){const t=this.t,g=eO(cl(t/.12,0,1)),f=cl((t-.2)/.32,0,1),a=1-f;if(a<=.01)return;const L=this.R*g,[ox,oy]=P(this.x,this.y,this.z);ctx.save();
    for(const [s,col,al] of [[1.08,AZU[0],.22],[1,AZU[1],.42],[.74,AZU[2],.55],[.44,AZU[3],.7]]){ctx.globalAlpha=al*a;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(ox,oy);
      for(let i=0;i<=16;i++){const an=this.phi-this.half*s+2*this.half*s*i/16,r=L*(s>.9?1:(.6+.4*s))*(1+.06*Math.sin(i*2.3+t*34)),[x,y]=this.pt(an,r);ctx.lineTo(x,y);}ctx.closePath();ctx.fill();}
    /* tongues of breath racing out along the cone */
    for(const [o,ph,len] of this.tg){const q=[],w=[];for(let i=0;i<=10;i++){const s=i/10,r=L*len*s,an=this.phi+o*this.half*s+Math.sin(s*6+t*30+ph)*.06,[x,y]=this.pt(an,r);q.push([x,y]);w.push(1+5*Math.sin(Math.PI*Math.min(1,s*1.2))*(1-f*.6));}
      band(q,w,[[1,'#7fb4ff',.6*a],[.5,'#ffffff',.85*a]]);}
    glow(ox,oy,26,'#bcd4ff',.8*a);ctx.restore();}}
function breathFx(phi){addFx(new DCone({phi,R:DB.dcBreath.R,half:.55}));const x=player.x+Math.cos(phi)*14,y=player.y+Math.sin(phi)*14,S=sys('top');
  for(let i=0;i<qn2(26);i++){const an=phi+R_(-.5,.5),v=R_(320,520);S.add({im:tx('core',Math.random()<.5?'#6ab4ff':'#cfe4ff'),x,y,z:54,vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:-R_(40,110),dr:2.2,s0:R_(6,10),s1:2,life:R_(.3,.45),add:1,str:2.4,fo:.5});}
  drops(x,y,50,10,{spd:300,up:60,dir:phi,spread:.45});puffs(x+Math.cos(phi)*DB.dcBreath.R*.75,y+Math.sin(phi)*DB.dcBreath.R*.75,20,4,{n:'kumo',s:40,spd:60,dir:phi,spread:1,life:.6,a:.6});}
installMk();
/* the skill window / mode switch can re-run installDragon(): re-wrap after it */
(function(){const I=window.installDragon;if(typeof I==='function'&&!I._dv){window.installDragon=function(){const r=I.apply(this,arguments);try{installMk();}catch(e){console.warn(e);}return r;};window.installDragon._dv=1;}})();
})();
