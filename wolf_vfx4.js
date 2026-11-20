/* =====================================================================
   FROST RAIDER WOLF — skill effects v4: SVG art (wolf_art.js) + code VFX.
   Owner 2026-11-20: "then do the wolf's" → asked how far: "redo everything, EXCEPT the 6 clips" = every wolf skill is
   redone with SVG + VFX and its effect lands with the damage, but the six skills that play his own video clips are not
   touched: Axe Cyclone, Tempest Field, Wolf Finale, Ragnarok's Judgment, Ice Prison, Shatter Pulse (CLIP below — every
   hook in this file returns false for them, so wolf_fx.js / wolf_vfx3.js draw them exactly as before).
   ?wv4=0 (or ?vfx3=0) = this file off = the wolf exactly as it was before this pass.

   HOW IT PLUGS IN (wolf_fx.js stays the installer; it asks window.WV4 first at six points):
     make(k,a,c)   when a skill's action is built: adds this file's timed events; true = the old per-skill moment is skipped
     slash(a,s,kC) every axe swing the skill code asks for (slashAt / spriteSlash) → one arc that follows the sprite's axe
     addFx(f)      old engine visuals (Impact, GRing, Slash, Bolt, Crystal…) made by the wolf's own skill code are dropped
                   or converted to this file's pieces; true = swallowed
     emit(o)       round / spark / ember / dust particles of the wolf's own skill code are dropped
     hurt(e,k,o)   the visuals of every hit come from the damage itself
     pic(n,…)      the painted pictures still asked for by the old watchers (rune shields, banner, armour badge) → SVG art

   HOW THE TIMING IS KEPT (same rule as the cat and the kitsune):
   · action clock = ACTION_TEMPO (0.75): every time taken from an action is converted to real seconds with rt().
   · an axe arc never has a life of its own: it is told how long it is until the contact frame (`lead`), it sweeps in the
     last frames before it and its edge is ON the axe head exactly when the sprite reaches the contact pose (the damage
     frame); the arc's shape comes from the sprite's measured axe-head positions, so it fits every facing.
   · things that fall (ghost axe, golden axe, thunder spear, ice crystal) are started early and touch down on the damage frame.
   · hit sparks, cuts, blood and ice come from hurt(). Hit-stop freezes effects together with the game.

   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; a saturated mid tone, a white-hot core and a dark "ink" shape behind so
   pale effects read on snow; debris is shaped (drops, shards, sparks as streaks, feathers, stones), never round dots;
   buffs stay calm; ground effects are on the ground layer; the hero's action stays readable (few pieces per skill).
   Families: Basic = steel + gold howl · A = blood red / red-gold · B = ice, lightning (blue-white), runes · C = Fenrir cyan.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='wolf'||!window.VK||!window.K3||!window.KTA||/[?&](vfx3|wv4)=0/.test(location.search))return;
const V=window.VK,K3=window.K3,{G,sys,tx,crys,groundBreak}=V;
const {TAU,cl,eO,eI,eIO,back,lerp,R_,rt,scr,rgba,tint,art,sprite,KSprite,KArc,star,KGlint,KLine,KBurst,KRing,ring,KStreak,petals,embers,dust,stones}=K3;
/* palettes: [ink (dark shape behind), deep, mid, lite, core] */
const PL={steel:['#101a30','#3d5a94','#8fb0ea','#dfeaff','#ffffff'],sice:['#12283e','#4f86bc','#a8d4f4','#e6f5ff','#ffffff'],
  blood:['#2a0408','#8e1220','#e8303c','#ff8f86','#ffe9e4'],redgold:['#2a0a04','#b3260e','#ff6a2a','#ffc45a','#fff6d6'],dance:['#2a0c06','#c0401a','#ff8a4a','#ffd2a0','#ffffff'],
  exec:['#1e0206','#7a0812','#ff2a3a','#ff9a8f','#ffffff'],vamp:['#2a0420','#8a1050','#e83a86','#ffa6cc','#ffeaf4'],gold:['#33200a','#b8741a','#ffc23a','#ffe89a','#ffffff'],
  ice:['#0c2a44','#2a86c8','#6fd0ff','#cdf2ff','#ffffff'],storm:['#0e1a4a','#2f5fe0','#7fb4ff','#d6ecff','#ffffff'],fen:['#0a2440','#2a9fd8','#7fe6ff','#d8fbff','#ffffff']};
const gl=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
const CMAP=new Map();[['SILVER','steel'],['SILVERICE','sice'],['BLOOD','blood'],['REDGOLD','redgold'],['DANCE','dance'],['EXEC','exec'],['VAMP','vamp'],['GOLD','gold'],['ICE','ice'],['STORM','storm']].forEach(([n,p])=>{const o=gl(n);if(o)CMAP.set(o,PL[p]);});

/* ---------------------------------------------------------------------
   0. WHICH SKILL IS RUNNING
   --------------------------------------------------------------------- */
const CLIP=new Set(['axeCyclone','tempestField','wolfFinale','ragnaroksJudgment','icePrison','shatterPulse']);
const A_SET=new Set(['warFury','bloodCleave','savageRend','axeDance','ironCounter','revengeBreaker','vampiricAxe','bloodRush','cycloneLeap','executioner','predatorsLeap','valhallasWrath']);
const THUN=new Set(['thunderFang','lightningPursuit','stormStep','runeStorm','thunderSpear']);
const ICES=new Set(['frostFang','iceBreak','runeGuard','runeBurst','blizzard','frozenDescent','ravenousLeap','fenrirsSpirit','runicDetonation']);
const elOf=k=>THUN.has(k)?'thun':ICES.has(k)?'ice':A_SET.has(k)?'blood':'steel';
const EPAL={steel:PL.steel,blood:PL.blood,ice:PL.ice,thun:PL.storm};
const palKey=k=>k==='valhallasWrath'?PL.gold:k==='vampiricAxe'?PL.vamp:k==='ravenousLeap'||k==='fenrirsSpirit'?PL.fen:k==='warHowl'||k==='warBanner'?PL.gold:k==='cycloneLeap'||k==='predatorsLeap'||k==='revengeBreaker'?PL.redgold:EPAL[elOf(k)];
let BLK=0,INSTART=0;
/* owner 2026-11-20 (after seeing v4): "skills that are not slashes go back to the old look — my generated pictures fit better".
   v4 now covers only the axe-cut skills below; every other skill (buffs, leaps, Valhalla, Executioner's ghost axe, runes,
   thunder spear, storms, banner, Fenrir…) and the six clip skills run exactly as before (wolf_fx.js + wolf_vfx3.js). */
const SLASHK=new Set(['basic','reversalSlash','armorBreak','bloodCleave','savageRend','axeDance','revengeBreaker','vampiricAxe','bloodRush','thunderFang','lightningPursuit','frostFang']);
const mine=k=>!!k&&SLASHK.has(k)&&!CLIP.has(k);
/* the skill whose code is running right now: SKCTX covers a skill's action and everything it left behind (fx remember their skill);
   __ACTEV covers the events of a basic attack. Monsters, bosses and the map never set either. */
const ctxKey=()=>window.SKCTX||(BLK?'ironCounter':null)||(window.__ACTEV&&player.action?player.action.key:null);
const WV4=window.WV4={on:1,PL,own:k=>mine(k)};

/* ---------------------------------------------------------------------
   1. PIECES
   --------------------------------------------------------------------- */
const prof=s=>Math.pow(Math.sin(Math.PI*Math.pow(s,1.35)),.8);
/* the arc of an axe swing, in the screen plane round the wolf's shoulder: it goes from the wind-up position of the axe head (a0)
   to its contact position (hit) and a little further. `lead` = real seconds until the contact frame. */
class WArc{constructor(o){Object.assign(this,{t:0,layer:'top',a0:-2,hit:.4,R:60,W:16,lead:.04,pre:.055,over:.42,hold:.05,fade:.16,pal:PL.steel,ink:.5,N:18,edge:.2,glint:1,follow:1,oy:-44,ox:0,alpha:1,sw:.06,emb:0},o);
    const sg=Math.sign(this.hit-this.a0)||1;this.a1=this.hit+sg*this.over;this.dl=Math.max(0,this.lead-this.pre);this.life=this.lead+this.sw+this.hold+this.fade;this.acc=0;
    if(!this.follow){this.cx=o.cx;this.cy=o.cy;}}
  cen(){if(this.follow){const q=P(player.x,player.y,player.z||0);this.cx=q[0]+this.ox;this.cy=q[1]+this.oy;}return this;}
  pt(th,r){return [this.cx+Math.cos(th)*r,this.cy+Math.sin(th)*r];}
  head(){const t=this.t;if(t<=this.lead){const k=cl((t-this.dl)/Math.max(.001,this.lead-this.dl),0,1);return this.a0+(this.hit-this.a0)*k*(.4+.6*k);}return this.hit+(this.a1-this.hit)*eO(cl((t-this.lead)/this.sw,0,1));}
  update(dt){this.t+=dt;
    if(this.emb&&this.t>this.dl&&this.t<this.lead+this.sw){this.acc+=dt;while(this.acc>.014){this.acc-=.014;this.cen();const q=this.pt(this.head(),this.R-this.W*.3);this.emb(q[0],player.y,player.y*K-q[1]);}}
    return this.t<this.life;}
  band(a,b,r,w){const N=this.N;ctx.beginPath();for(let i=0;i<=N;i++){const q=this.pt(a+(b-a)*i/N,r);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=N;i>=0;i--){const s=i/N,q=this.pt(a+(b-a)*s,r-w*prof(s));ctx.lineTo(q[0],q[1]);}ctx.closePath();}
  draw(){if(this.t<this.dl)return;this.cen();const hd=this.head(),T=this.lead+this.sw+this.hold,f=cl((this.t-T)/this.fade,0,1),tl=this.a0+(hd-this.a0)*(f*f*.97),d=hd-tl;if(Math.abs(d)<.03)return;
    const p=this.pal,W=this.W*(1-f*.45),R=this.R,A=this.alpha;ctx.save();ctx.lineJoin='round';
    if(this.ink>0){ctx.globalAlpha=this.ink*(1-f)*A;this.band(tl-d*.05,hd,R+2,W*1.5);ctx.fillStyle=p[0];ctx.fill();}
    ctx.globalAlpha=(1-f*.3)*A;this.band(tl,hd,R,W);ctx.fillStyle=p[1];ctx.fill();
    this.band(tl+d*.07,hd,R,W*.66);ctx.fillStyle=p[2];ctx.fill();
    this.band(tl+d*.18,hd,R,W*.36);ctx.fillStyle=p[3];ctx.fill();
    if(this.edge>0){this.band(tl+d*.32,hd,R+.6,Math.max(1.8,W*this.edge));ctx.fillStyle=p[4];ctx.fill();}
    if(f<.6){ctx.globalAlpha=(1-f/.6)*.8*A;ctx.fillStyle=p[2];for(let i=0;i<2;i++){const a=tl-d*(.06+.1*i),b=a-d*.16,r=R-W*(.25+.4*i);this.band(b,a,r,2.6);ctx.fill();}}
    if(this.glint){const g=(this.t-this.lead+.012)/.09;if(g>0&&g<1){const q=this.pt(this.hit,R),s=(7+W*.45)*this.glint*Math.sin(Math.PI*g);ctx.globalAlpha=A;star(q[0],q[1],s,p[2],g*.8);}}
    ctx.restore();}}
/* the swing of the sprite: pivot on the shoulder, from the wind-up axe-head position over the top to the contact position
   (same geometry the engine used for its own slash, so the arc sits on the drawn axe in all eight directions) */
function swingGeo(s,k1,o){if(typeof headR!=='function')return null;const B=headR(s,k1);if(!B)return null;const [px,py]=P(player.x,player.y,player.z||0),C=[px,py-44];let A=null,best=0;
  for(let k=Math.max(0,k1-3);k<k1;k++){const h=headR(s,k);if(h){const dd=Math.hypot(h[0]-B[0],h[1]-B[1]);if(dd>best){best=dd;A=h;}}}
  if(!A||best<14)A=[C[0]-(B[0]-C[0])*.6,C[1]-Math.abs(B[1]-C[1])-26];
  const r=cl(Math.hypot(B[0]-C[0],B[1]-C[1]),30,72);let ta=Math.atan2(A[1]-C[1],A[0]-C[0]);const tb=Math.atan2(B[1]-C[1],B[0]-C[0]),m=x=>((x%TAU)+TAU)%TAU,d1=m(tb-ta),d2=d1-TAU;
  let sw=Math.abs(d1)<Math.abs(d2)?d1:d2;if(Math.abs(Math.abs(d1)-Math.abs(d2))<1)sw=Math.sin(ta+d1/2)<Math.sin(ta+d2/2)?d1:d2;
  const mp=o.maxPre==null?1.9:o.maxPre;if(Math.abs(sw)>mp)sw=Math.sign(sw)*mp;if(Math.abs(sw)<.8)sw=Math.sign(sw||1)*.8;return {ta:tb-sw+(o.rot||0),tb,r};}
/* a filled ribbon along a polyline, pinched to a point at both ends */
function ribbon(pts,w,col,a){const n=pts.length;if(n<2||w<.2)return;const L=[],Rr=[];for(let i=0;i<n;i++){const p0=pts[Math.max(0,i-1)],p1=pts[Math.min(n-1,i+1)],dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)||1,u=i/(n-1),tp=Math.pow(Math.sin(Math.PI*cl(u,.02,.98)),.55)*(pts[i][2]||1),hw=w*.5*tp;
    L.push([pts[i][0]-dy/l*hw,pts[i][1]+dx/l*hw]);Rr.push([pts[i][0]+dy/l*hw,pts[i][1]-dx/l*hw]);}
  ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)ctx.lineTo(Rr[i][0],Rr[i][1]);ctx.closePath();ctx.fill();}
/* lightning between two points in the world (a, b = [x,y,z]): a jagged ribbon that re-jags every 50 ms, dark blue behind, white core */
class WBolt{constructor(o){Object.assign(this,{t:0,layer:'top',w:2.4,life:.3,delay:0,pal:PL.storm,amp:1},o);this.t=-this.delay;this.sd=-1;this.j=[];this.br=[];}
  mk(L){const n=cl(Math.round(L/24),2,10);this.j=[];for(let i=1;i<n;i++)this.j.push([cl(i/n+R_(-.3,.3)/n,.04,.96),R_(-1,1),R_(.5,1.5)]);this.br=[];if(L>70&&this.w>1.6)for(let k=0;k<2;k++){const i=1+((Math.random()*(n-1))|0);this.br.push([i,R_(-1,1)>0?1:-1,R_(.14,.26)]);}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,a=P(this.a[0],this.a[1],this.a[2]),b=P(this.b[0],this.b[1],this.b[2]),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<3)return;const sd=(this.t/.05)|0;if(sd!==this.sd){this.sd=sd;this.mk(L);}
    const nx=-dy/L,ny=dx/L,amp=Math.min(15,L*.17)*this.amp*(1-k*.4),w=this.w*2.2*(1-k*k),p=this.pal,pts=[[a[0],a[1]],...this.j.map(([u,d,t])=>[a[0]+dx*u+nx*d*amp,a[1]+dy*u+ny*d*amp,t]),[b[0],b[1]]];
    ctx.save();ribbon(pts,w*2.5+3,p[0],.45*(1-k));ribbon(pts,w*1.7,p[1],.9*(1-k*.5));ribbon(pts,w,p[3],1);ribbon(pts,w*.45,p[4],1);
    for(const [i,sg,ln] of this.br){const q=pts[Math.min(i,pts.length-2)],an=Math.atan2(dy,dx)+sg*R_(.5,.9),l=L*ln,m=[q[0]+Math.cos(an)*l*.5+R_(-4,4),q[1]+Math.sin(an)*l*.5+R_(-4,4)],e=[q[0]+Math.cos(an)*l,q[1]+Math.sin(an)*l];ribbon([q,m,e],w*.9,p[2],.9*(1-k));ribbon([q,m,e],w*.35,p[4],1-k);}
    ctx.restore();}}
/* electric shock on a body: three short arcs that flicker round it */
class WZap{constructor(o){Object.assign(this,{t:0,life:.42,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,H=e.boss?60:44,R=e.boss?20:15,[x,y]=P(e.x,e.y,e.z||0),a=1-this.t/this.life;if(((this.t*30)|0)%3===2)return;const sd=((this.t*20)|0),r=n=>{const v=Math.sin(n*12.9898+sd*78.233)*43758.5;return v-Math.floor(v);};ctx.save();
    for(let j=0;j<3;j++){const an=r(j)*TAU,x0=x+Math.cos(an)*R,y0=y-8-r(j+3)*H*.5,pts=[[x0,y0]];for(let i=1;i<5;i++)pts.push([x0+(r(j*7+i)-.5)*R*1.6,y0-i*H*.17+(r(j*5+i)-.5)*6]);
      ribbon(pts,6,PL.storm[1],.55*a);ribbon(pts,3,PL.storm[3],a);ribbon(pts,1.3,'#ffffff',a);}ctx.restore();}}
/* a pool of blood on the ground: spreads fast, soaks in */
class WPool{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.7,r:18},o);this.rot=R_(0,TAU);this.lob=Array.from({length:9},()=>R_(.72,1.16));this.sat=Array.from({length:3},()=>[R_(0,TAU),R_(1.2,1.7),R_(.16,.28)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  blob(rr){const n=this.lob.length,pt=i=>{const a=i/n*TAU,l=this.lob[((i%n)+n)%n]*rr;return [Math.cos(a)*l,Math.sin(a)*l];};ctx.beginPath();let p0=pt(0),p1=pt(1);ctx.moveTo((p0[0]+p1[0])/2,(p0[1]+p1[1])/2);
    for(let i=1;i<=n;i++){const a=pt(i),b=pt(i+1);ctx.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}ctx.closePath();}
  draw(){const g=eO(cl(this.t/.24,0,1)),a=cl((this.life-this.t)/.55,0,1)*.92,[x,y]=P(this.x,this.y,0),r=this.r*(.4+.6*g);ctx.save();ctx.translate(x,y);ctx.scale(1,K*.86);ctx.rotate(this.rot);ctx.globalAlpha=a;
    this.blob(r*1.06);ctx.fillStyle='#4a050c';ctx.fill();this.blob(r*.9);ctx.fillStyle='#a3141f';ctx.fill();this.blob(r*.55);ctx.fillStyle='#d42a34';ctx.fill();
    ctx.fillStyle='#8f1019';for(const [an,d,s] of this.sat){ctx.beginPath();ctx.ellipse(Math.cos(an)*r*d,Math.sin(an)*r*d,r*s,r*s*.8,an,0,TAU);ctx.fill();}
    ctx.globalAlpha=a*.7;ctx.fillStyle='#ff9a8f';ctx.beginPath();ctx.ellipse(-r*.22,-r*.2,r*.2,r*.09,-.5,0,TAU);ctx.fill();ctx.restore();}}
const pool=(x,y,r)=>addFx(new WPool({x,y:y+3,r}));
/* claw / axe gouges cut into the ground: three tapered scars that stay a moment */
class WGouge{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.4,L:64,ang:0,n:3,gap:11,w:5},o);this.j=Array.from({length:this.n},()=>[R_(.8,1.1),R_(-.08,.08),R_(-6,6)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const g=eO(cl(this.t/.07,0,1)),a=cl((this.life-this.t)/.4,0,1),[x,y]=P(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.ang);
    for(let i=0;i<this.n;i++){const [ls,cv,sh]=this.j[i],L=this.L*ls*g,oy=(i-(this.n-1)/2)*this.gap,x0=-this.L*.5+sh,lens=(w,c,al)=>{ctx.globalAlpha=al;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x0,oy);ctx.quadraticCurveTo(x0+L*.5,oy-w+cv*L,x0+L,oy+cv*L*.6);ctx.quadraticCurveTo(x0+L*.5,oy+w+cv*L,x0,oy);ctx.fill();};
      lens(this.w*1.5,this.rim||'#e9dccb',a*.55);lens(this.w,this.col||'#2a1810',a);lens(this.w*.4,'#0e0806',a);}ctx.restore();}}
/* three claw cuts on a body, complete exactly `lead` seconds from now */
function claw(t,ang,pal,lead,L=62){const nx=Math.cos(ang+Math.PI/2),ny=Math.sin(ang+Math.PI/2),ent=t.dead!==undefined;for(let i=-1;i<=1;i++)addFx(new KLine({e:ent?t:null,x:t.x+(ent?0:nx*11*i),y:t.y,ox:nx*11*i,oy:0,z:(t.boss?38:28)-ny*11*i,ang,L:L*(i?.82:1),w:i?3.4:4.4,grow:.04,hold:.1,fade:.16,pal,delay:Math.max(0,lead-.04)+Math.abs(i)*.012}));}
/* something that falls out of the sky and touches the ground exactly `dur` real seconds from now.
   o: n (art), x,y | e (follows a target), z0, dur, w, ay, rot0, rot1, flip, stay (seconds standing after it lands), land() */
function fall(o){const z0=o.z0==null?260:o.z0,dur=Math.max(.03,o.dur),stay=o.stay==null?.25:o.stay;let done=0;
  return sprite(Object.assign({layer:'top',z:z0,life:dur+stay,fi:.05,fo:Math.min(.2,stay),ay:.9,tick:f=>{const k=cl(f.t/dur,0,1);if(o.e&&!o.e.dead&&!done){f.x=o.e.x;f.y=o.e.y;}f.z=z0*(1-k*k)+(o.zEnd||0);if(o.rot1!=null)f.rot=lerp(o.rot0||0,o.rot1,k*k);if(k>=1&&!done){done=1;o.land&&o.land(f);}}},o,{x:o.e?o.e.x:o.x,y:o.e?o.e.y:o.y,rot:o.rot0||0}));}
/* steel / blood / ice / lightning sparks as short streaks (never dots) */
const SPK={steel:['#ffffff','#cfe0ff','#7f9fd8'],blood:['#ffe1dc','#ff5a4a','#a8141e'],gold:['#ffffff','#ffd36a','#d98a1e'],ice:['#ffffff','#bfeeff','#4fa8e8'],thun:['#ffffff','#cfe4ff','#4f8fff']};
const sparksF=(x,y,z,n,el,an,spd=190)=>embers(x,y,z,n,{dir:an,spread:an==null?3.2:.95,spd,up:110,lift:-330,dr:3.2,s:.9,life:.3,c:SPK[el]||SPK.steel});
const drop=(x,y,z,an,v,up,r,c,c2)=>addFx(new V.CDrop({x,y,z,vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:up,r,c,c2}));
const bloodDrops=(e,n,an,v=95)=>{for(let i=0;i<n;i++)drop(e.x,e.y,(e.boss?36:24)+R_(-4,6),an+(i-(n-1)/2)*.42+R_(-.12,.12),v*R_(.7,1.25),R_(90,170),3+(i%2));};
const cutAng=an=>(Math.cos(an)>=0?.95:Math.PI-.95)+R_(-.28,.28);
function cut(e,an,pal,big,o={}){addFx(new KLine(Object.assign({e,x:e.x,y:e.y,z:e.boss?38:27,ang:cutAng(an),L:big?64:44,w:big?4.6:3.3,grow:.03,hold:.05,fade:.13,pal},o)));}
const glint=(e,col,s=12,z=28)=>addFx(new KGlint({e,x:e.x,y:e.y,z,s,col,life:.15}));

/* ---------------------------------------------------------------------
   2. AXE SWINGS — every slash the skill code asks for
   --------------------------------------------------------------------- */
const flat=(o)=>addFx(new KArc(Object.assign({x:player.x,y:player.y,follow:1,z:26,phi:player.phi,tilt:.1,hold:.05,fade:.2,glint:0},o)));
WV4.slash=function(a,s,kC,o){if(!a||!mine(a.key))return false;o=o||{};const key=a.key,tC=seqTimeAt(s,kC),lead=cl(rt(tC-(a.t||0)),0,.4),pal=CMAP.get(o.colors)||palKey(key),W0=o.W||20,n=a._v4n=(a._v4n||0)+1,phi=player.phi,d=Math.cos(phi)<0?-1:1,al=o.alpha==null?1:o.alpha;
  const axe=(x={})=>{const g=swingGeo(s,kC,o);if(!g)return;addFx(new WArc(Object.assign({a0:g.ta,hit:g.tb,R:g.r*(o.rs||1.08)*(key==='basic'?1.12:1.22)+W0*.2,W:8+W0*.5,lead,pal,alpha:al,ink:al<1?0:.5,over:o.over==null?.42:o.over},x)));};
  if(key==='bloodCleave'){const echo=o.echo===false&&o.colors===gl('REDGOLD'),lv=LV.bloodCleave||1,R=(96+lv*8)*.95;
    flat({a0:-1.3*d*(echo?-1:1),a1:1.3*d*(echo?-1:1),hit:0,lead,sweep:lead+.07,R:echo?R*.84:R,W:echo?17:23,z:echo?34:24,hold:.03,fade:.16,pal:echo?PL.redgold:PL.blood,ink:echo?.25:.4});return true;}   /* the crescent is the reach of the cleave: enemies stand inside it, not under it */
  if(key==='savageRend'){const t=nearestEnemy(player.x,player.y,140,phi)||{x:player.x+Math.cos(phi)*70,y:player.y+Math.sin(phi)*70},sec=n%2===0;
    claw(t,sec?(d>0?-.66:Math.PI+.66):(d>0?.66:Math.PI-.66),sec?PL.redgold:PL.blood,lead,sec?70:62);axe({W:9,glint:.6});return true;}
  if(key==='axeDance'){const last=W0>=28,m=(n-1)%4;
    if(last){axe({W:22,pal:PL.redgold,over:.6});flat({a0:-.5*d,a1:.5*d,hit:0,lead,sweep:lead+.05,R:104,W:26,z:30,tilt:.05,pal:PL.redgold,ink:.4});return true;}
    if(m===0)axe({pal:PL.dance,fade:.12});
    else if(m===1)flat({a0:1.25*d,a1:-1.25*d,hit:0,lead,sweep:lead+.06,R:78,W:17,z:30,pal:PL.dance,fade:.12,ink:.35});
    else if(m===2){const g=swingGeo(s,kC,o);if(g)addFx(new WArc({a0:g.tb+(g.tb-g.ta)*.35,hit:g.ta+(g.tb-g.ta)*.25,R:g.r*1.3+6,W:14,lead,pal:PL.dance,over:.5,fade:.12}));}
    else flat({a0:-Math.PI*d,a1:Math.PI*1.15*d,hit:0,lead,sweep:lead+.1,R:76,W:15,z:24,pal:PL.dance,tilt:.04,fade:.12,ink:.3});
    return true;}
  if(key==='ravenousLeap'){axe({W:26,pal:PL.fen,over:.6});return true;}
  if(key==='vampiricAxe'){const L2=cl(rt(a.windup+.2-(a.t||0)),0,.6),sx=player.x,sy=player.y;   /* the sprite holds its lunge pose for 0.2 s while it travels: the crescent lands when it arrives */
    addFx(new KStreak({a:[sx,sy],b:[sx,sy],w:9,pal:PL.vamp,live:L2,life:.22,z:24}));after(Math.max(0,L2-.05),()=>flat({phi:player.phi,a0:-1.0*d,a1:1.0*d,hit:0,lead:.05,sweep:.11,R:92,W:20,z:26,pal:PL.vamp,ink:.4,fade:.16}));return true;}
  axe(key==='thunderFang'||key==='lightningPursuit'?{emb:(x,y,z)=>{if(Math.random()<.5)sparksF(x,y,z,1,'thun',null,90);}}:{});return true;};

/* ---------------------------------------------------------------------
   3. OLD LOOK OFF — engine visuals made by the wolf's own (non-clip) skill code
   --------------------------------------------------------------------- */
const DROP=new Set(['Impact','GRing','Ring','Crack','CrackStar','Slash','TexArc','SpectralAxe','ScorchLine','SpiralWave','ClawMarks','CycloneRing','LineCut','WindArc','Drain','PuffDust','HitCrescents','Guillotine','Bit','Burst','GLight','GroundShatter','Glow','Companion','Contact']);
WV4.addFx=function(f){const n=f&&f.constructor&&f.constructor.name;if(!n)return false;
  if(INSTART){const ak=player.action&&player.action.key;if(mine(ak)&&(n==='Glow'||n==='Ring'||n==='Bit'||n==='Trail'))return true;return false;}   /* the old charge-up glow, ring and dots; the soft weapon ribbon */
  const k=ctxKey();if(!mine(k))return false;
  if(n==='GRing'){if(f.r1>=40)addFx(new KRing({x:f.x,y:f.y,r0:Math.max(6,f.r0),r1:f.r1,w:cl((f.w||8)*.5,3,8),life:Math.max(.3,f.life||.4),delay:f.delay||0,pal:palKey(k),segs:f.r1>120?4:3}));return true;}
  if(DROP.has(n))return true;
  if(n==='Bolt'){const a=f.a,b=f.b,sky=a[2]>70&&b[2]<12&&Math.hypot(a[0]-b[0],a[1]-b[1])<70,go=()=>{if(sky&&(f.w||2)<2.3){addFx(new WBolt({a,b,w:3,life:.24}));addFx(new KRing({x:b[0],y:b[1],r0:6,r1:36,w:4,life:.3,pal:PL.storm}));addFx(new KGlint({x:b[0],y:b[1],z:6,s:20,col:PL.storm[2],life:.18}));sparksF(b[0],b[1],6,4,'thun',null,150);}
      else if(sky&&window.wV3&&wV3.bolt)wV3.bolt(b[0],b[1],a[2]);else addFx(new WBolt({a,b,w:cl((f.w||2)*(f.w>=2?1.35:1),.9,5),life:cl((f.life||.2)*1.15,.09,.45),amp:f.w<1.3?.7:1}));};
    if(f.delay>0)after(f.delay,go);else go();return true;}
  if(n==='Crystal'){if(k==='frostFang')return true;crys({x:f.x,y:f.y,w:cl(f.h*1.5,18,90),v:(Math.random()*4)|0,delay:f.delay||0,life:cl((f.life||.3)+.28,.45,.8),fx:Math.random()<.5});return true;}
  if(n==='Streak'&&f.a&&f.b){addFx(new KStreak({a:[f.a[0],f.a[1]],b:[f.b[0],f.b[1]],z:f.b[2]||26,w:10,life:.26,pal:palKey(k),live:k==='bloodRush'?rt(.2):0}));return true;}
  if(n==='FrostWave'){frostWave(f);return false;}
  if(n==='FallObj'&&k==='frozenDescent'){frozenFall(f);return false;}
  return false;};
const PART=/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune|snow|star)$/;
WV4.emit=function(o){const k=ctxKey();return mine(k)&&(!o||!o.type||PART.test(o.type));};
/* a timer that follows game time (and the skill it was made in) */
class WAfter{constructor(t,f){this.t=t;this.f=f;this.layer='none';}update(dt){this.t-=dt;if(this.t<=0){try{this.f();}catch(e){console.error('wolf_vfx4 '+e);}return false;}return true;}draw(){}}
const after=(t,f)=>addFx(new WAfter(t,f));

/* ---------------------------------------------------------------------
   4. HITS — every visual of a hit comes from the damage itself
   --------------------------------------------------------------------- */
let vampN=0,vhN=0;
function execHit(e,marked){const an=Math.atan2(e.y-player.y,e.x-player.x);addFx(new KLine({e,x:e.x,y:e.y,z:e.boss?44:32,ang:Math.PI/2+R_(-.06,.06),L:marked?112:86,w:marked?6.5:5,grow:.03,hold:.09,fade:.18,pal:PL.exec}));
  addFx(new KBurst({e,x:e.x,y:e.y,z:26,R:marked?46:36,n:9,life:.26,pal:PL.exec}));bloodDrops(e,marked?6:4,an,120);if(marked)pool(e.x,e.y,e.boss?34:26);
  if(e.dead)after(.1,()=>sprite({n:'skull',x:e.x,y:e.y,z:e.boss?84:62,w:62,life:.95,pop:.16,s0:.4,s1:1,fi:.02,fo:.35,vz:12,under:PL.exec[0],ua:.4}));}
WV4.hurt=function(e,k,o,marked){if(!mine(k))return false;const ak=player.action?player.action.key:null;if(CLIP.has(k)||(ak&&CLIP.has(ak)&&!(o&&o.auto)))return false;o=o||{};
  const big=!!o.big,an=Math.atan2(e.y-player.y,e.x-player.x),el=elOf(k),z=e.boss?38:26,now=gameTime;
  /* things that happen on every hit of their skill, however fast the hits come */
  if(k==='vampiricAxe'){if(vampN<4){vampN++;if(window.wV3&&wV3.vampHit)wV3.vampHit(e,vampN);}return true;}
  if(now-(e._v4h||0)<.035&&!big)return true;e._v4h=now;
  if(k==='executioner'){execHit(e,marked);return true;}
  if(k==='armorBreak'){cut(e,an,PL.gold,1);addFx(new KBurst({e,x:e.x,y:e.y,z,R:e.boss?42:34,n:8,life:.26,pal:PL.gold}));const S=sys('top');for(let i=0;i<7;i++){const a=an+R_(-1.3,1.3),v=R_(110,230);S.add({im:tx('shard',i%2?'#c9ccd2':'#d8b45a',i%5),x:e.x,y:e.y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(120,260),g:820,dr:.8,s0:R_(8,13),s1:R_(6,9),life:R_(.6,.95),fo:.3,rot:R_(0,TAU),vr:R_(-14,14),bounce:.3});}return true;}
  if(k==='bloodCleave'){const echo=o.label==='ECHO';cut(e,an,echo?PL.redgold:PL.blood,!echo);bloodDrops(e,echo?2:3,an);if(!echo&&now-(e._v4p||0)>.6){e._v4p=now;pool(e.x,e.y,e.boss?26:19);}return true;}
  if(k==='savageRend'){if(o.label==='RUPTURE'){addFx(new KBurst({e,x:e.x,y:e.y,z,R:e.boss?46:36,n:10,life:.28,pal:PL.blood}));bloodDrops(e,6,an,140);pool(e.x,e.y,e.boss?34:26);}else bloodDrops(e,2,an,80);return true;}
  if(k==='bloodRush'){cut(e,an,PL.blood,1,{ang:scr(player.phi)+.25,L:70});bloodDrops(e,4,an,130);pool(e.x,e.y,20);return true;}
  if(k==='valhallasWrath'){if(big){addFx(new KBurst({e,x:e.x,y:e.y,z,R:34,n:8,life:.24,pal:PL.gold}));return true;}vhN++;const A=[-.95,.95,.12,Math.PI/2][(vhN-1)%4]*(((vhN-1)>>2)%2?-1:1);
    addFx(new KLine({e,x:e.x,y:e.y,z:e.boss?40:30,ang:A,L:e.boss?104:84,w:5,grow:.03,hold:.07,fade:.16,pal:PL.gold}));glint(e,PL.gold[2],15,32);sparksF(e.x,e.y,28,4,'gold',an,200);return true;}
  if(k==='revengeBreaker'){cut(e,an,PL.redgold,1);addFx(new KBurst({e,x:e.x,y:e.y,z,R:e.boss?50:40,n:10,life:.28,pal:PL.redgold}));sparksF(e.x,e.y,z,7,'gold',an,260);return true;}
  if(k==='reversalSlash'){addFx(new KLine({e,x:e.x,y:e.y,z:26,ang:Math.cos(player.phi)>=0?-.42:Math.PI+.42,L:78,w:4,grow:.03,hold:.07,fade:.15,pal:PL.sice}));sparksF(e.x,e.y,z,4,'ice',an,180);return true;}
  if(k==='axeDance'){cut(e,an,big?PL.redgold:PL.dance,big);if(big){addFx(new KBurst({e,x:e.x,y:e.y,z,R:36,n:9,life:.26,pal:PL.redgold}));sparksF(e.x,e.y,z,6,'gold',an,240);}else sparksF(e.x,e.y,z,3,'gold',an,170);return true;}
  if(k==='blizzard'){if(now-(e._v4b||0)>.35){e._v4b=now;glint(e,PL.ice[2],10);}return true;}
  if(k==='iceBreak'||k==='frozenDescent'||k==='ravenousLeap'){addFx(new KBurst({e,x:e.x,y:e.y,z,R:e.boss?40:30,n:8,life:.24,pal:k==='ravenousLeap'?PL.fen:PL.ice}));G.shards(sys('top'),e.x,e.y,z,4,170,220,.8);return true;}
  /* the element of the skill */
  if(el==='thun'){addFx(new WZap({e}));glint(e,'#cfe4ff',big?17:13);sparksF(e.x,e.y,z,big?6:3,'thun',null,170);return true;}
  if(el==='ice'){cut(e,an,PL.ice,big);G.shards(sys('top'),e.x,e.y,z,big?5:3,150,200,.75);glint(e,PL.ice[2],11);return true;}
  if(el==='blood'){cut(e,an,PL.blood,big);bloodDrops(e,big?4:2,an);if(big)addFx(new KBurst({e,x:e.x,y:e.y,z,R:34,n:8,life:.24,pal:PL.blood}));return true;}
  /* steel: basic attack and the Basic tree */
  cut(e,an,PL.steel,big);sparksF(e.x,e.y,z,big?7:4,'steel',an,big?250:190);glint(e,PL.steel[2],big?16:11);
  if(big){addFx(new KBurst({e,x:e.x,y:e.y,z,R:32,n:8,life:.24,pal:PL.steel}));dust(e.x,e.y,4,{spd:55,size:34});}return true;};

/* ---------------------------------------------------------------------
   5. PICTURES THE OLD WATCHERS STILL ASK FOR → SVG art (their motion is the owner-approved one)
   --------------------------------------------------------------------- */
WV4.pic=function(n,sx,sy,w,o){return undefined;o=o||{};const a=o.a==null?1:o.a;
  if(n==='w24_rune_shield'){art('shieldR',sx,sy,w*1.3,{a,under:PL.ice[0],ua:.3});return true;}                           /* Rune Guard: three orbiting shields */
  if(n==='w20_banner'){art('banner',sx,sy,w*1.05,{a,ay:.985,rot:o.rot||0,under:'#2a1206',ua:.32,ux:3,uy:2});return true;}   /* War Banner at the live banner object */
  if(n==='w50_armor_icon'){art('shieldX',sx,sy,w*.95,{a,under:'#2a1206',ua:.35});return true;}                             /* badge over an enemy with broken armour */
  if(n==='w30_bleed_drip')return true;                                                                                    /* bleeding: drops come from WCore4 below */
  return undefined;};

/* ---------------------------------------------------------------------
   6. PER-SKILL MOMENTS (added to the action when it is built; t in action seconds)
   --------------------------------------------------------------------- */
const ev=(a,t,f)=>a.events.push({t:Math.max(0,t),f:x=>{try{f(x);}catch(e){console.error('wolf_vfx4 '+a.key+': '+e);}}});
const tgtOf=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r,player.phi)||nearestEnemy(player.x,player.y,r);
const rune=(c,i)=>'rune'+c+(((i%6)+6)%6);
/* runes that rise round a point and fade */
function runesUp(x,y,c,n,R,o={}){for(let i=0;i<n;i++){const an=i/n*TAU+R_(-.2,.2);sprite({n:rune(c,(Math.random()*6)|0),x:x+Math.cos(an)*R,y:y+Math.sin(an)*R*.7,z:o.z||14,w:o.w||22,life:o.life||.85,fi:.1,fo:.4,vz:o.vz||46,delay:i*.03,s0:.7,s1:1.05,under:o.ink,ua:.35});}}
const M={
 basic:()=>true,reversalSlash:()=>true,armorBreak:()=>true,bloodCleave:()=>true,savageRend:()=>true,revengeBreaker:()=>true,thunderFang:()=>true,lightningPursuit:()=>true,frostFang:()=>true,frozenDescent:()=>true,warBanner:()=>true,
 axeDance:a=>{a._v4n=0;return true;},vampiricAxe:()=>{vampN=0;return true;},bloodRush:()=>true,
 /* Battle Step: one steel streak rides on the dash, dust where the paws push off and brake */
 battleStep:a=>{const sx=player.x,sy=player.y,T=a.dur;ev(a,0,()=>{dust(sx,sy,5,{spd:60,size:36});addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],w:8,pal:PL.steel,live:rt(T*.85),life:.2,z:20}));});ev(a,T*.85,()=>dust(player.x,player.y,3,{spd:40,size:30}));return true;},
 /* War Howl: the spirit wolf rises and howls on the frame the buff lands; one thin wave shows how far the howl carries */
 warHowl:a=>{ev(a,a.windup,()=>{const x=player.x,y=player.y,L=Math.cos(player.phi)<0;
    sprite({n:'howl',layer:'sorted',sortOff:-8,follow:player,ox:L?26:-26,oy:-6,z:6,w:150,life:.95,pop:.18,s0:.5,s1:1,fi:.04,fo:.36,vz:10,sx:L?-1:1,ay:.93,under:PL.gold[0],ua:.3});   /* rises behind the wolf, its head above the wolf's own */
    addFx(new KRing({x,y,r0:30,r1:330,w:4,life:.6,pal:PL.gold,segs:1,gap:0,a:.8}));embers(x,y,8,12,{spd:50,up:150,lift:90,dr:1.6,c:['#fff6d6','#ffc23a','#b8741a'],life:.85});});return true;},
 /* War Fury: a red flare at the chest as the fury takes hold (the red coat on the sprite is the buff itself) */
 warFury:a=>{ev(a,a.windup,()=>{addFx(new KBurst({x:player.x,y:player.y,z:34,R:34,n:10,life:.3,pal:PL.blood}));embers(player.x,player.y,10,12,{spd:60,up:170,lift:110,dr:1.6,c:['#ffe1dc','#ff3a2a','#8e1220'],life:.7});});return true;},
 /* Iron Counter: a steel shield held in front for as long as the guard is up */
 ironCounter:a=>{ev(a,0,()=>{const ph=player.phi,ox=Math.cos(ph)*24,oy=Math.sin(ph)*24;sprite({n:'shieldS',follow:player,ox,oy,z:32,w:54,life:rt(a.dur)+.3,pop:.1,s0:.5,s1:1,fi:.02,fo:.18,until:()=>player.action===a&&!a.ended,sortOff:oy>0?4:-4,layer:'sorted',under:PL.steel[0],ua:.35});
    addFx(new KGlint({x:player.x+ox,y:player.y+oy,z:36,s:15,col:PL.steel[2],life:.2,delay:.05}));});return true;},
 /* Cyclone Leap: the spin winds up round the wolf as it jumps, the landing breaks the ground on the damage frame */
 cycloneLeap:a=>{const tL=a.windup;ev(a,0,()=>{dust(player.x,player.y,6,{spd:70,size:40});for(let i=0;i<2;i++)flat({phi:player.phi+i*Math.PI,a0:0,a1:TAU*1.15,hit:TAU*.6,lead:rt(.16),sweep:rt(.3),R:60-i*10,W:18-i*3,fz:16+i*26,z:16+i*26,pal:PL.redgold,ink:.35,tilt:.04,fade:.14});});
   ev(a,tL,()=>{const x=player.x,y=player.y;groundBreak(x,y,.82);stones(x,y,7,{spd:210,up:300});dust(x,y,7,{ring:60,spd:90,size:48});});return true;},
 /* Executioner: the ghost of a headsman's axe hangs over the target, is raised, and falls with the wolf's own chop */
 executioner:(a,c)=>{const tC=a.windup;ev(a,.08,()=>{const e=tgtOf(c,140);if(!e)return;const fl=player.x<e.x,s=fl?-1:1,H=(e.boss?92:70),T=rt(tC-.08),D=Math.min(.11,T*.4);   /* art: haft to the right; flipped when the wolf stands on the left, so the haft always points back at the wolf */
    sprite({n:'axeRed',layer:'top',x:e.x,y:e.y,z:H,w:e.boss?136:108,ax:.27,ay:.86,life:T+.34,fi:.14,fo:.2,a:.94,sx:s,under:PL.exec[0],ua:.3,
      tick:f=>{if(!e.dead){f.x=e.x;f.y=e.y;}const k=cl((f.t-(T-D))/D,0,1),up=cl(f.t/Math.max(.05,T-D),0,1);
        f.z=k>0?lerp(H+16,e.boss?40:26,k*k):H+16*eO(up)+3*Math.sin(f.t*9);f.rot=s*(k>0?lerp(.62,-.12,k*k):.25+.37*eO(up));}});});return true;},
 /* Valhalla's Wrath: the gate of light stands behind the wolf while it gathers, each dash hit is a golden cut (hurt),
    three golden shades of the wolf leap in, the axe of Valhalla falls and lands on the damage frame */
 valhallasWrath:(a,c)=>{vhN=0;const cx=c.gx,cy=c.gy;if(cx==null)return true;const tA=a.windup,ts=a.events.map(e=>e.t).sort((x,y)=>y-x),tLand=ts[0],tF=ts[1],R=(LV.valhallasWrath||1)>=2?190:160;
   ev(a,.04,()=>{const x=player.x,y=player.y;sprite({n:'gate',layer:'sorted',x,y:y-10,sortOff:-6,w:150,ay:.985,life:rt(tA)+.25,fi:.3,fo:.25,s0:.9,s1:1,under:PL.gold[0],ua:.22});
     petals(x,y-10,120,6,{im:'feather0',spd:26,up:0,term:.7,s:1.1,life:rt(tA)+.4,rest:.5,stag:rt(tA)*.6,dk:PL.gold[0]});});
   ev(a,tF,()=>{[[-2.5,1],[-.6,0],[1.5,1]].forEach(([an],i)=>addFx(new WShade({sx:cx+Math.cos(an)*150,sy0:cy+Math.sin(an)*105,cx,cy,dur:Math.max(.2,rt(tLand-tF))-i*.03,fl:Math.cos(an)>0})));});
   ev(a,tLand-.3,()=>fall({n:'axeGold',x:cx,y:cy+4,z0:430,dur:rt(.3),w:230,ax:.27,ay:.86,rot0:.5,rot1:-.1,stay:.5,fo:.3,under:PL.gold[0],ua:.3}));
   ev(a,tLand,()=>{groundBreak(cx,cy,1.25);stones(cx,cy,10,{spd:280,up:380});dust(cx,cy,9,{ring:R*.45,spd:120,size:58});addFx(new KBurst({x:cx,y:cy,z:24,R:92,n:13,life:.36,pal:PL.gold}));
     petals(cx,cy,60,16,{im:'feather1',spd:170,up:210,term:.8,s:1.2,life:2.2,rest:.9,dk:PL.gold[0]});});return true;},
 /* Ice Break: the lunge ends in a burst of ice on the thing it hits — on the damage frame, at the place of the hit */
 iceBreak:a=>{const tI=a.windup+.2,ph=player.phi,tg=nearestEnemy(player.x,player.y,340,ph);ev(a,tI,()=>{const t=tg&&!tg.dead?tg:{x:player.x+Math.cos(ph)*30,y:player.y+Math.sin(ph)*30};if(window.wV3){wV3.iceCrack&&wV3.iceCrack(t.x,t.y,150);wV3.iceBurst&&wV3.iceBurst(t);}});return true;},
 /* Rune Guard: runes rise round the wolf as the guard closes (the three orbiting shields are the buff) */
 runeGuard:a=>{ev(a,a.windup,()=>{runesUp(player.x,player.y,'B',5,34,{ink:PL.ice[0]});addFx(new KRing({x:player.x,y:player.y,follow:1,r0:14,r1:64,w:5,life:.4,pal:PL.ice}));});return true;},
 /* Rune Burst: the shields break outward with the blast */
 runeBurst:a=>{ev(a,a.windup,()=>{const x=player.x,y=player.y,S=sys('top');for(let i=0;i<3;i++){const an=i*2.094+gameTime*2.6;sprite({n:'shieldR',x:x+Math.cos(an)*40,y:y+Math.sin(an)*16,z:26,w:46,life:.3,fi:.01,fo:.7,vx:Math.cos(an)*330,vy:Math.sin(an)*230,spin:R_(-9,9),s0:1,s1:1.25});}
    G.shards(S,x,y,24,12,300,260,1);addFx(new KBurst({x,y,z:30,R:54,n:11,life:.3,pal:PL.ice}));for(let i=0;i<6;i++){const an=i/6*TAU+.3;sprite({n:rune('B',i),x:x+Math.cos(an)*30,y:y+Math.sin(an)*22,z:30,w:22,life:.55,fi:.02,fo:.5,vx:Math.cos(an)*190,vy:Math.sin(an)*140,vz:30,s0:.9,s1:1.3});}});return true;},
 /* Rune Storm: the circle is marked on the ground by its runes while lightning walks inside it */
 runeStorm:(a,c)=>{const r=70+10*(LV.runeStorm||1),gx=c.gx,gy=c.gy;if(gx==null)return true;ev(a,a.windup,()=>addFx(new WZone({x:gx,y:gy,r,life:2.35})));return true;},
 /* Thunder Spear: the spear forms above the target, hangs, and is thrown down to land with the thunder */
 thunderSpear:(a,c)=>{const t=tgtOf(c,360),tP=a.windup;if(!t)return true;ev(a,.05,()=>{const T=rt(tP-.05),D=Math.min(.09,T*.35),H=112;
    sprite({n:'spear',x:t.x,y:t.y,z:H,w:56,ay:.985,life:T+.3,fi:.16,fo:.16,under:PL.storm[0],ua:.3,tick:f=>{f.x=t.x;f.y=t.y;const k=cl((f.t-(T-D))/D,0,1);f.z=k>0?H*(1-k*k):H+5*Math.sin(f.t*8);}});
    for(let i=0;i<3;i++)sprite({n:rune('B',5),x:t.x,y:t.y,z:H+150+i*4,w:22,life:T,fi:.1,fo:.1,ox:0,tick:f=>{const an=f.t*5+i*2.094;f.x=t.x+Math.cos(an)*26;f.y=t.y+Math.sin(an)*10;}});});return true;},
 /* Ravenous Leap: the spirit axe grows over the wolf while it hangs in the air and comes down with it; the ground freezes and breaks */
 ravenousLeap:(a,c)=>{const tI=a.windup,es=a.events.map(e=>e.t).sort((x,y)=>x-y),tJ=es[1],tRise=es[2],tHang=es[3],sx=player.x,sy=player.y;
   ev(a,tJ,()=>{dust(sx,sy,6,{spd:80,size:42});const dr=Math.cos(player.phi)>=0?1:-1,T1=rt(tHang-tJ),T2=rt(tI-tHang);   /* art flipped when facing right, so the head swings forward */
     sprite({n:'axeIce',follow:player,z:40,w:60,ax:.9,ay:.22,life:T1+T2+.3,fi:.2,fo:.2,a:.95,sx:-dr,under:PL.fen[0],ua:.28,tick:f=>{const k=cl((f.t-T1)/T2,0,1),g=cl(f.t/T1,0,1);f.w=60+95*eO(g);f.rot=dr*(k>0?lerp(-2.0,.4,k*k):-1.2-.8*eO(g));}});});
   ev(a,tI,()=>{const t=c&&c.target&&!c.target.dead?c.target:null,ph=player.phi,x=t?t.x:player.x+Math.cos(ph)*28,y=t?t.y:player.y+Math.sin(ph)*28;groundBreak(x,y,1.2,1);if(window.wV3&&wV3.iceCrack)wV3.iceCrack(x,y,250,1);stones(x,y,9,{spd:260,up:360,col:'#6f8aa8'});dust(x,y,8,{ring:70,spd:120,size:56});});return true;},
 /* Fenrir's Spirit: no picture at the cast (owner) — a cold ring and glints as the spirit steps out; the companion itself is the effect */
 fenrirsSpirit:a=>{ev(a,a.windup,()=>{const x=player.x,y=player.y;addFx(new KRing({x,y,r0:16,r1:120,w:6,life:.5,pal:PL.fen,segs:4}));G.glints(sys('top'),x,y,10,9,60,'#bff6ff');runesUp(x,y,'B',4,40,{ink:PL.fen[0],vz:60});});return true;},
};
WV4.make=function(k,a,c){if(!mine(k)||!a||!a.events)return false;WV4.ensure();const f=M[k];if(!f)return false;try{return f(a,c||{})===true;}catch(e){console.error('wolf_vfx4 make '+k+': '+e);return false;}};

/* Rune Storm's circle: a thin broken ring and six runes lying on it — it does not spin, the runes pulse one after another */
class WZone{constructor(o){Object.assign(this,{t:0,layer:'ground',life:2.3,r:80},o);this.rot=R_(0,TAU);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,a=cl(t/.2,0,1)*cl((this.life-t)/.4,0,1),[x,y]=P(this.x,this.y,0),r=this.r*(.86+.14*eO(cl(t/.25,0,1))),p=PL.storm;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';
    const g=ctx.createRadialGradient(0,0,r*.3,0,0,r);g.addColorStop(0,'rgba(47,95,224,0)');g.addColorStop(.8,'rgba(47,95,224,.13)');g.addColorStop(1,'rgba(14,26,74,.3)');ctx.globalAlpha=a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
    for(let i=0;i<6;i++){const s=this.rot+i*TAU/6+.2,l=TAU/6-.4;ctx.globalAlpha=a*.55;ctx.strokeStyle=p[1];ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,r,s,s+l);ctx.stroke();ctx.globalAlpha=a;ctx.strokeStyle=p[3];ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,r,s,s+l);ctx.stroke();}
    ctx.restore();for(let i=0;i<6;i++){const an=this.rot+i*TAU/6,q=P(this.x+Math.cos(an)*this.r,this.y+Math.sin(an)*this.r,0),pu=.55+.45*Math.max(0,Math.sin(t*5-i*1.05));art(rune('B',i),q[0],q[1],34,{flat:1,a:a*pu,under:PL.storm[0],ua:.4});}}}
/* a golden shade of the wolf (its own sprite frame, tinted) that leaps to a point — Valhalla's Wrath */
class WShade{constructor(o){Object.assign(this,o,{t:0,layer:'sorted'});this.x=o.sx;this.y=o.sy0;this.z=0;}get sy(){return this.y+1;}
  update(dt){this.t+=dt;const k=Math.min(1,this.t/this.dur),e=k*k;this.x=this.sx+(this.cx-this.sx)*e;this.y=this.sy0+(this.cy-this.sy0)*e;this.z=70*Math.sin(Math.PI*Math.min(1,k*.9+.1))*(1-k*.6);return this.t<this.dur+.18;}
  draw(){if(typeof playerFrame!=='function'||typeof tinted!=='function')return;const fr=playerFrame();if(!fr)return;const a=this.t>this.dur?Math.max(0,1-(this.t-this.dur)/.18):Math.min(1,this.t/.08);
    for(let g=2;g>=0;g--){const k=cl((this.t-g*.035)/this.dur,0,1),e=k*k,[px,py]=P(this.sx+(this.cx-this.sx)*e,this.sy0+(this.cy-this.sy0)*e,this.z);ctx.save();
      if(typeof CHAR_SCALE!=='undefined'&&CHAR_SCALE!==1){ctx.translate(px,py);ctx.scale(CHAR_SCALE,CHAR_SCALE);ctx.translate(-px,-py);}if(this.fl){ctx.translate(px,0);ctx.scale(-1,1);ctx.translate(-px,0);}
      drawFrame(fr,px,py,a*(g?.22:.78),null,tinted(fr,g?'#ff9a2a':'#ffd36a'));ctx.restore();}}}
/* Frost Fang: the wave that carries the damage throws up its own fangs — a crystal every 34 px exactly where its front is */
function frostWave(f){f.draw=()=>{};const u0=f.update.bind(f),c=Math.cos(f.phi),s=Math.sin(f.phi);let nx=18,i=0;const S=sys('top',1.2),Gs=sys('ground',1.2);
  f.update=function(dt){const r=u0(dt);while(nx<=f.d&&nx<=f.max){const q=nx/f.max,sd=(i%2?1:-1)*R_(4,13),x=f.x+c*nx-s*sd,y=f.y+s*nx+c*sd;
      crys({x,y,w:30+36*Math.sin(Math.PI*cl(q,.08,.95))+R_(-4,6),v:i%4,life:.58,fx:i%2});Gs.add({im:tx('floor',null,i%3),x,y,z:0,s0:18,s1:56+22*Math.sin(Math.PI*q),life:.9,fo:.45,flat:1,rot:R_(0,TAU)});
      if(i%2===0)G.smoke(S,x,y,0,1,'#ffffff|#8cc0e8',42,36,.6,14);for(let k=0;k<2;k++){const a=R_(0,TAU),v=R_(60,140);S.add({im:tx('shard','#5fb6ec',k+i),x,y,z:10,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R_(150,260),g:820,s0:R_(7,12),s1:6,life:R_(.45,.75),fo:.3,rot:R_(0,TAU),vr:R_(-12,12)});}
      nx+=34;i++;}return r;};}
/* Frozen Descent: the giant crystal that falls is drawn as an ice cluster; where and when it lands, the ground freezes and breaks */
function frozenFall(f){const im=tx('crystal',null,2),x=f.x,y=f.y,L0=f.onLand;
  f.draw=function(){const k=Math.min(1,this.t/this.dur),z=this.z0*(1-k*k),[sx,sy]=P(x,y,0),al=this.landed?Math.max(0,1-(this.t-this.dur)/this.linger):Math.min(1,this.t/.08),w=120,h=w*im.height/im.width;
    ctx.save();ctx.globalAlpha=.16+.3*k;ctx.fillStyle='#0a1c34';ctx.beginPath();ctx.ellipse(sx,sy,22+44*k,(22+44*k)*.36,0,0,TAU);ctx.fill();ctx.globalAlpha=al;ctx.drawImage(im,sx-w/2,sy-z-h+6,w,h);ctx.restore();};
  f.onLand=function(o){L0&&L0.call(this,o);for(const q of fx)if(q&&q.constructor&&q.constructor.name==='CStorm'&&Math.hypot(q.x-x,q.y-y)<12&&q.life>q.t+.35)q.life=q.t+.35;   /* the blizzard ends where the crystal lands (its zone is gone) */if(window.wV3&&wV3.iceCrack)wV3.iceCrack(x,y,240,1);G.shards(sys('top'),x,y,30,16,330,340,1.1);dust(x,y,8,{ring:50,spd:110,size:54,tint:'#ffffff|#9fc4e8'});};}

/* ---------------------------------------------------------------------
   7. THINGS THAT LAST (calm): bleeding drips, the banner being planted
   --------------------------------------------------------------------- */
class WCore4{constructor(){this.layer='none';this.bd=0;this.ban=null;}draw(){}
  update(dt){this.bd-=dt;if(this.bd<=0&&typeof enemies!=='undefined'){this.bd=.25;for(const e of enemies)if(!e.dead&&e.st&&e.st.bleed>0&&gameTime-(e._v4d||0)>1.25){e._v4d=gameTime;drop(e.x+R_(-5,5),e.y,e.boss?30:20,R_(0,TAU),R_(6,16),R_(20,50),3.2);}}
    const wb=gl('warBanner'),B=(wb&&fx.includes(wb)&&wb.t>=(wb.land||0))?wb:null;if(B&&this.ban!==B){this.ban=B;addFx(new KRing({x:B.x,y:B.y,r0:10,r1:70,w:5,life:.45,pal:PL.gold}));dust(B.x,B.y,5,{spd:60,size:34});}if(!B)this.ban=null;
    return CHAR==='wolf';}}
let CORE=null;
WV4.install=function(){if(WV4._in)return;WV4._in=1;
  /* slashes made without slashAt (Valhalla dash hits, Lightning Pursuit, Ravenous Leap) */
  if(typeof spriteSlash==='function'){const S0=spriteSlash;window.spriteSlash=spriteSlash=function(s,k0,k1,k2,o){const a=player.action;if(WV4.on&&a&&a.seq===s&&WV4.slash(a,s,k1,o))return null;return S0.apply(this,arguments);};}
  if(typeof startAction==='function'){const A0=startAction;window.startAction=startAction=function(a){INSTART=1;try{return A0.apply(this,arguments);}finally{INSTART=0;}};}
  /* a block during Iron Counter: the gameplay of blockFx stays, its old flash becomes a steel glint on the shield */
  if(false&&typeof blockFx==='function'){const B0=blockFx;window.blockFx=blockFx=function(e){if(!WV4.on)return B0.apply(this,arguments);BLK=1;try{B0.apply(this,arguments);}finally{BLK=0;}
      const an=Math.atan2(e.y-player.y,e.x-player.x),x=player.x+Math.cos(an)*26,y=player.y+Math.sin(an)*26;addFx(new KBurst({x,y,z:34,R:30,n:8,life:.22,pal:PL.steel}));sparksF(x,y,34,8,'steel',an+Math.PI,240);addFx(new KRing({x:player.x,y:player.y,r0:10,r1:52,w:4,life:.3,pal:PL.steel}));};}
  /* full-screen flashes of the wolf's own skills are kept low (white on snow hides the action) */
  if(typeof screenFlash==='function'){const F0=screenFlash;window.screenFlash=screenFlash=function(a,c){if(WV4.on&&mine(ctxKey()))a=Math.min(a,.16);return F0.call(this,a,c);};}
  if(window.TV&&TV.toonHeroes){/* the wolf stays a toon hero for its six clip skills; nothing to change here */}
  };
WV4.ensure=()=>{};   /* bleeding drips and the banner ring are the old painted ones again */
if(typeof player!=='undefined'&&typeof addFx==='function')WV4.install();
})();
