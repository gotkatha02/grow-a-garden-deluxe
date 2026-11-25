/* =====================================================================
   WOLF (Fenrir's Heir, Norse) — skill effects v5: code VFX on the FXLIB kit (fxlib.js).
   Owner 2026-11-25 "ทำเอฟเฟคสกิลใหม่ให้หมาป่าหน่อย อันไหนที่ควรเจนรูปก็ไม่ต้องทำแต่ส่งเป็นพร้อมมาแทน".

   WHAT   only the skills whose effects are best drawn by code (cuts, bursts, ground breaks, ice, lightning, dashes) — the keys of ST.
          Everything that is a painted picture or one of the owner's own video clips stays exactly as it was (War Howl, War Fury,
          Executioner, Valhalla's Wrath, Iron Counter's parry shield, Rune Guard, War Banner, Fenrir's Spirit, Axe Cyclone + Cyclone Leap, Wolf Finale, Ice
          Prison, Shatter Pulse, Blizzard, Tempest Field, Ragnarok's Judgment, Ravenous Leap): new pictures for those were sent
          to the owner as prompts (WOLF_FX5_PLAN_TH.md).
   LOOK   Basic = the axe's own steel-blue edge · A "Berserker" = crimson crescents with a white-hot edge, Fenrir's three claw
          rakes, blood that lands on the ground, snapped Gleipnir chain links · B "Runic" = ice fangs, carved rune rings and
          rune glyphs, violet-blue lightning. Flat saturated bodies + a white core + a soft glow, a dark shape under each piece
          so it reads on snow; few pieces per skill, the hero's action stays readable.
   TIMING every swing is the engine's own Slash (it follows the axe head of the sprite and ends on the contact frame) redrawn as
          a VSlash; hit marks come from the damage; ground pieces take their place and time from the piece the old look made
          at that moment (CONV: the old piece is the signal, it is not drawn).
   HOOKS  outermost wrappers of addFx / emit / hurt / slashAt / mkBasic + SKILLS[k].make (extra action events only).
          Nothing in wolf_fx.js / wolf_vfx3.js is changed: while one of ST's skills runs, their pieces are dropped by class
          name here. Gameplay objects (FrostWave, FrostPath, FallObj, Decoy, Ticker, Ghost afterimages, status icons) pass.
   ?wfx5=0 = the look before this file.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='wolf'||!window.FXLIB||/[?&]wfx5=0/.test(location.search))return;
const F=window.FXLIB,KT=F.k,{TAU,cl,lerp,eO,eI,KY,qn,rgba,pal,spr,sys,bits,A,after,Part,Emit,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Bolt,Sigil,Proj,Wave,Crack,Spike,Spr,BIT}=KT;
const R=KT.R,{scrAng,lite,ring,dust}=KT.h;
const WARNED={},warn=(w,e)=>{if(!WARNED[w]){WARNED[w]=1;try{console.warn('wolf_vfx5: '+w,e);}catch(_){}}};
const safe=(w,fn)=>function(){try{return fn.apply(this,arguments);}catch(e){warn(w,e);}};
const rt=t=>t/(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0?ACTION_TEMPO:1);          // action seconds → real seconds

/* ---------- 1. palettes [ink, deep, mid, lite, core] ---------- */
Object.assign(F.PAL,{
  wS:['#0c1a32','#2f5fb4','#66a6ee','#cfe6ff','#ffffff'],     // the axe: steel with its ice-blue rune line
  wA:['#2a0408','#8e0f20','#e3263c','#ff8f7e','#fff1e8'],     // berserker crimson
  wV:['#2a0418','#8c0f4c','#e3267c','#ff9cc4','#fff0f6'],     // vampiric
  wG:['#3a2606','#c98a16','#ffcf4a','#fff0b0','#ffffff'],     // counter gold
  wR:['#06283c','#0f7fb4','#42d2ff','#bdf3ff','#ffffff'],     // rune ice-blue
  wT:['#0e0a3e','#3a2fd6','#5f7dff','#c2d4ff','#ffffff'],     // thunder
  wI:['#0e121a','#38465e','#7388a8','#b9c6da','#eef3fb']});   // iron plates
BIT.wS=BIT.steel;BIT.wI=BIT.steel;BIT.wA=BIT.blood;BIT.wV=BIT.blood;BIT.wG=BIT.steel;BIT.wR=BIT.ice;BIT.wT=BIT.volt;
if(!F.dust)F.dust=()=>/^(vik|snow)/i.test(typeof curMap==='string'?curMap:'')?'cloud':'dust';

/* ---------- 2. the skills this file draws: el = swing colour · hit = hit mark · ws = swing width · deb = debris off the swing ---------- */
const ST={
  basic:{el:'wS',hit:'steel',deb:1},battleStep:{el:'wS'},reversalSlash:{el:'wS',hit:'steel',ws:1.3},armorBreak:{el:'wS',hit:'armor',ws:1.45},
  bloodCleave:{el:'wA',hit:'blood',ws:1.45,deb:3},savageRend:{el:'wA',hit:'claw',ws:.75},axeDance:{el:'wA',hit:'blood'},
  revengeBreaker:{el:'wG',hit:'gold',ws:1.5,deb:3},vampiricAxe:{el:'wV',hit:'vamp',ws:1.3},bloodRush:{el:'wA',hit:'rush'},predatorsLeap:{el:'wA',hit:'claw'},
  frostFang:{el:'wR',hit:'ice',ws:1.2},iceBreak:{el:'wR',hit:'shatter'},runeBurst:{el:'wR',hit:'rune'},frozenDescent:{el:'wR',hit:'ice'},
  thunderFang:{el:'wT',hit:'volt',ws:1.2},lightningPursuit:{el:'wT',hit:'volt',ws:1.2},stormStep:{el:'wT',hit:'volt'},runeStorm:{el:'wT',hit:'volt'},thunderSpear:{el:'wT',hit:'volt'}};
const ctxKey=()=>window.SKCTX||window.__W5||(window.__ACTEV&&player.action&&player.action.key)||null;

/* ---------- 3. pieces ---------- */
/* a crescent with a gradient body: transparent tail → saturated body → white-hot leading edge, wake lines inside, a dark copy under it for snow */
class VArc extends Arc{
  paint(){const t=this.t,sw=this.swing,L=this.life,p=this.p,h=eO(cl(t/sw,0,1)),tl=eI(cl((t-sw*.5)/(L-sw*.5),0,1)),th0=lerp(this.a0,this.a1,tl*.94),th1=lerp(this.a0,this.a1,h);if(Math.abs(th1-th0)<.04)return;
    const al=cl((L-t)/(L*.35),0,1),N=Math.max(8,Math.ceil(Math.abs(th1-th0)*9)),Rr=this.R*this.size,W=this.w*this.size*(1-.3*tl),TH=[],pr=[];
    for(let i=0;i<=N;i++){const s=i/N;TH.push(lerp(th0,th1,s));pr.push(Math.pow(Math.sin(Math.PI*Math.pow(s,1.55)),.8));}
    const sp=(th,r)=>{const q=this.w3(th,r);return P(q[0],q[1],q[2]);},a=sp(th0,Rr),b=sp(th1,Rr);
    const gr=(col,k)=>{const g=ctx.createLinearGradient(a[0],a[1],b[0],b[1]);g.addColorStop(0,rgba(col,0));g.addColorStop(.45,rgba(col,k*.8));g.addColorStop(1,rgba(col,k));return g;};
    const poly=(wk,ex)=>{ctx.beginPath();for(let i=0;i<=N;i++){const q=sp(TH[i],Rr+ex);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=N;i>=0;i--){const q=sp(TH[i],Rr-W*wk*pr[i]-ex);ctx.lineTo(q[0],q[1]);}ctx.closePath();};
    ctx.save();ctx.globalAlpha*=al;ctx.save();ctx.translate(1.5,2.5);poly(1.1,1.5);ctx.fillStyle=gr(p[0],.4);ctx.fill();ctx.restore();
    poly(1,0);ctx.fillStyle=gr(p[1],.92);ctx.fill();poly(.74,0);ctx.fillStyle=gr(p[2],1);ctx.fill();poly(.46,0);ctx.fillStyle=gr(p[3],1);ctx.fill();poly(.19,0);ctx.fillStyle=gr(p[4],1);ctx.fill();
    ctx.lineCap='round';for(const [rk,u0,u1,lw] of [[1.32,.3,.86,1.8],[1.72,.45,.78,1.3]]){ctx.beginPath();const i0=Math.floor(N*u0),i1=Math.ceil(N*u1);for(let i=i0;i<=i1;i++){const q=sp(TH[i],Rr-W*rk*pr[i]);i>i0?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.strokeStyle=gr(p[3],.75);ctx.lineWidth=lw;ctx.stroke();}
    ctx.globalCompositeOperation='lighter';poly(.5,0);ctx.fillStyle=gr(p[2],.16);ctx.fill();ctx.restore();
    if(this.glint&&t<sw*1.5)KT.starAt(b[0],b[1],W*1.05,p[3],.85*(1-t/(sw*1.5)),t*6);}}
/* the engine's own swing (class Slash: shoulder C, plane u / v, a0 → a1 = the axe head's real path, grow = its real time) in the new look */
class VSlash extends VArc{constructor(s,o){super(Object.assign({a0:s.a0,a1:s.a1,R:s.R,w:s.W,swing:Math.max(.06,s.grow||.1),z:0},o));this.C=s.C;this.u=s.u;this.v=s.v;this.fr=s.free;this.life=this.swing+(o.hold==null?.05:o.hold)+(o.fade==null?.2:o.fade);this.t=-(s.delay||0);this._v5=1;}
  w3(th,r){const c=Math.cos(th),s=Math.sin(th),u=this.u,v=this.v,C=this.C,z=C[2]+r*(c*u[2]+s*v[2]);return [C[0]+r*(c*u[0]+s*v[0]),C[1]+r*(c*u[1]+s*v[1]),this.fr?z:Math.max(1,z)];}}
const pre=(p,t)=>{if(p&&!p.delay)p.t=t==null?.03:t;return p;};         // a piece born on a hit is already lit while hit-stop holds the frame
const RT={};
function runeTex(el){if(RT[el])return RT[el];const p=pal(el);return RT[el]=KT.cv(320,320,g=>{g.translate(160,160);
    const rg=g.createRadialGradient(0,0,0,0,0,152);rg.addColorStop(0,rgba(p[0],.36));rg.addColorStop(.78,rgba(p[0],.28));rg.addColorStop(1,rgba(p[0],0));g.fillStyle=rg;g.beginPath();g.arc(0,0,152,0,TAU);g.fill();
    const ci=(r,lw,c,d)=>{g.setLineDash(d||[]);g.lineWidth=lw;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();};
    ci(143,7,p[1]);ci(143,3.4,p[2]);ci(144.5,1.2,p[4]);ci(103,3,p[2]);ci(95,1.3,p[3],[9,7]);ci(38,3,p[2]);g.setLineDash([]);
    for(let i=0;i<8;i++){const im=spr('rune',el,i),w=31,h=w*im.height/im.width;g.save();g.rotate(i/8*TAU);g.drawImage(im,-w/2,-123-h/2,w,h);g.restore();}
    for(let i=0;i<8;i++){g.save();g.rotate((i+.5)/8*TAU);g.fillStyle=p[3];g.beginPath();g.moveTo(-3.4,-108);g.lineTo(0,-136);g.lineTo(3.4,-108);g.closePath();g.fill();g.restore();}   // fangs between the runes
    g.lineCap='round';for(let i=0;i<4;i++){g.save();g.rotate(i*TAU/8+TAU/16);g.strokeStyle=p[2];g.lineWidth=2.6;g.beginPath();g.moveTo(-33,0);g.lineTo(33,0);g.stroke();g.fillStyle=p[3];for(const sx of[-1,1]){g.beginPath();g.moveTo(sx*33,-4);g.lineTo(sx*41,0);g.lineTo(sx*33,4);g.closePath();g.fill();}g.restore();}});}
const mark=(x,y,r,el,life,o)=>A(new Sigil(Object.assign({el,x,y,r,life,tex:runeTex(el),spin:.45,fi:.14,fo:.28},o)));
function runesOut(x,y,r,el,n){const S=sys('top'),N=qn(n);for(let i=0;i<N;i++){const a=i/N*TAU+R(-.2,.2),v=r*2.3;S.add({im:spr('rune',el,i),x,y,z:22,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:R(30,90),g:150,dr:2.6,s0:19,s1:25,life:R(.5,.72),add:1,fo:.4,rot:R(-.3,.3)});}}
function links(x,y,z,n,el){const S=sys('top');for(let i=0;i<qn(n);i++){const a=R(0,TAU),v=R(90,210);S.add({im:spr('link',el||'wS',i),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R(150,290),g:840,dr:1.2,s0:R(12,16),life:R(.6,.95),rot:R(0,TAU),vr:R(-12,12),bounce:.35,fo:.3});}}
function zapOn(e,n){const z=e.boss?40:26,k=e.boss?1.5:1;for(let i=0;i<n;i++){const a=R(0,TAU),r=R(16,30)*k;A(new Bolt({el:'wT',x:e.x+Math.cos(a)*4,y:e.y+1,z:z+R(-8,8),x2:e.x+Math.cos(a)*r,y2:e.y+1,z2:Math.max(2,z+Math.sin(a)*r),w:2.6,life:R(.1,.16),jag:5,branch:0,delay:i*.04}));}}
const SK={};
function streakTex(el,dk){const k=el+(dk?1:0);if(SK[k])return SK[k];const p=pal(el);return SK[k]=KT.cv(40,16,g=>{const gr=g.createLinearGradient(0,0,40,0);gr.addColorStop(0,rgba(p[dk?1:2],0));gr.addColorStop(.5,rgba(p[dk?1:2],.92));gr.addColorStop(1,p[dk?2:3]);
    g.fillStyle=gr;g.beginPath();g.moveTo(0,8);g.quadraticCurveTo(24,-1,39,8);g.quadraticCurveTo(24,17,0,8);g.fill();g.fillStyle=rgba(p[4],.8);g.beginPath();g.ellipse(32,7,5,2,0,0,TAU);g.fill();});}
/* liquid thrown from a point as streaks that stretch with their speed and fall (blood) */
function spray(el,x,y,z,n,o){o=o||{};const S=sys('top');n=qn(n);for(let i=0;i<n;i++){const a=o.dir!=null?o.dir+R(-1,1)*(o.spread==null?.6:o.spread):R(0,TAU),v=R(110,290)*(o.sp||1);
    S.add({im:streakTex(el,i%3===0),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.75,vz:R(50,220)*(o.up==null?1:o.up),g:780,dr:1.6,s0:R(9,13)*(o.size||1),s1:4,life:R(.28,.5)*(o.life||1),str:1.5,fo:.4,bounce:0,delay:o.delay?R(0,o.delay):0});}return S;}
/* a bolt from the sky: the mark it leaves is drawn with solid shapes (scorch, crack, ground star) so it does not turn into a white blob on snow */
function strikeAt(x,y,s){s=s||1;A(new Bolt({el:'wT',x:x+R(-30,30)*s,y,z:420*s,x2:x,y2:y,z2:0,w:6*s,life:.3,jag:15,branch:3}));
  A(new Disc({kind:'pool',col:'#0c0a2a',x,y,r0:14*s,r1:30*s,life:1.3,a:.4,add:0,fi:.03,fo:.8}));A(new Crack({el:'wT',x,y,r:40*s,n:5,hot:1,life:1.1}));ring('wT',x,y,54*s,{life:.3,w0:8*s});
  pre(A(new Burst({el:'wT',x,y,z:5,r:30*s,n:9,flat:1,life:.22})));pre(A(new Flash({el:'wT',x,y,z:8,s0:10*s,s1:40*s,life:.15})));bits(sys('top'),'wT',x,y,6,5,{size:s});}

/* ---------- 4. swings ---------- */
function onSlash(s,key){if(s.alpha!=null&&s.alpha<1)return;                       // the engine's fainter echo copy
  const st=ST[key],a=player.action,n=a?(a._w5s=(a._w5s||0)+1):1,el=st.el;let ws=st.ws||1;if(key==='basic'&&a&&/Finish/.test(a.name||''))ws=1.3;
  const arc=A(new VSlash(s,{el,w:cl((s.W||20)*.9*ws,9,26),R:s.R*1.05,fade:Math.max(.17,s.fade||.2)})),sw=arc.swing;
  if(st.deb)after(sw*.85,()=>{const h=arc.head();if(el==='wA'||el==='wV')spray(el,h[0],h[1],h[2],st.deb,{size:.8,sp:.6,up:.5});else bits(sys('top'),el,h[0],h[1],h[2],st.deb,{size:.75,sp:.7,up:.6});});
  if(key==='bloodCleave'&&n===1)after(sw*.7,()=>A(new Wave({el:'wA',x:player.x,y:player.y,phi:player.phi,dist:80,r:58,w:17,life:.32,z:16,span:.95})));
  if(key==='revengeBreaker'&&n===1)after(sw*.7,()=>A(new Wave({el:'wG',x:player.x,y:player.y,phi:player.phi,dist:70,r:54,w:15,life:.3,z:16,span:.9})));}
/* Axe Dance: the sprite repeats one chop, so each beat gets its own plane round the hero */
const DANCE=[{a0:-1.9,a1:1.5,tilt:-.55},{a0:1.9,a1:-1.5,tilt:-.5},{a0:-3.4,a1:3.2,tilt:0,R:66,swing:.15,life:.36},{a0:1.9,a1:-1.9,tilt:.22},{a0:1.8,a1:-1.4,tilt:.55},{a0:-1.9,a1:1.9,tilt:-.2}];
function danceSwing(a,o){const n=a._w5d=(a._w5d||0)+1,ph=player.phi;
  if(o&&o.W>=28){const c=Math.cos(ph),s=Math.sin(ph);A(new VArc({follow:player,phi:ph,z:34,el:'wA',R:76,w:26,a0:-1.5,a1:1.2,tilt:1.25,swing:.1,life:.34}));
    A(new Streak({el:'wA',x:player.x+c*16,y:player.y+s*16,z:30,x2:player.x+c*128,y2:player.y+s*128,z2:22,w:17,life:.26,delay:.04}));return;}
  A(new VArc(Object.assign({follow:player,phi:ph,z:36,el:'wA',R:54+(n%3)*4,w:14+n,swing:.1,life:.28},DANCE[(n-1)%DANCE.length])));}

/* ---------- 5. hit marks (from the damage) ---------- */
let HT=-1,HN=0;
const cutAng=ph=>scrAng(ph)+Math.PI*.5+R(-.45,.45);
function bloodOn(e,x,y,z,ph,big,k,el){el=el||'wA';pre(A(new Cut({el,x,y,z,L:(big?74:54)*k,w:big?11:8,ang:cutAng(ph),life:.2})));if(big)pre(A(new Burst({el,x,y,z,r:24*k,n:8,life:.22})));
  spray(el,x,y,z,big?8:4,{dir:ph,spread:.75,size:big?1.1:.9,sp:1.1});
  if(gameTime-(e._w5p||-9)>.6){e._w5p=gameTime;A(new Disc({kind:'pool',col:'#8e0d1c',x:x+Math.cos(ph)*10,y:y+Math.sin(ph)*8+2,r0:6,r1:(big?24:15)*k,life:2.4,a:.5,add:0,fi:.04,fo:1.2}));}}
function clawsOn(e,x,y,z,ph,big,k){const an=scrAng(ph)+Math.PI*.5+(Math.random()<.5?-.5:.5),L=(big?74:58)*k,sx=-Math.sin(an),sz=-Math.cos(an);
  for(let i=-1;i<=1;i++)pre(A(new Cut({el:'wA',x:x+sx*i*9,y,z:z+sz*i*9,L:L*(i?.86:1),w:big?9:7,ang:an,life:.2,delay:(i+1)*.018})));
  spray('wA',x,y,z,big?6:4,{dir:ph,spread:.8});}
function ruptureOn(e,x,y,z,ph,k){pre(A(new Burst({el:'wA',x,y,z,r:38*k,n:10,life:.26})));pre(A(new Flash({el:'wA',x,y,z,s0:8,s1:34*k,life:.14})));spray('wA',x,y,z,12,{size:1.15,sp:1.2,up:1.1});
  ring('wA',e.x,e.y,54*k,{life:.32});A(new Disc({kind:'pool',col:'#8e0d1c',x:e.x,y:e.y+2,r0:10,r1:34*k,life:3,a:.55,add:0,fi:.04,fo:1.4}));}
function iceOn(e,x,y,z,ph,big,k){pre(A(new Burst({el:'ice',x,y,z,r:(big?34:22)*k,n:7,life:.22})));pre(A(new Flash({el:'ice',x,y,z,s0:6,s1:(big?28:18)*k,life:.12})));bits(sys('top'),'ice',x,y,z,big?8:4,{dir:ph,spread:1.3,size:.85});}
function shatterOn(e,x,y,z,ph,k){iceOn(e,x,y,z,ph,1,k);ring('ice',e.x,e.y,62*k,{w0:10,life:.34});
  for(let i=0;i<5;i++){const a=ph+(i-2)*.55+R(-.15,.15),d=R(20,34)*k;A(new Spike({el:'ice',x:e.x+Math.cos(a)*d,y:e.y+Math.sin(a)*d*.8,h:R(30,52)*k,w:R(12,17),lean:Math.cos(a)*.6,life:R(.42,.6),rise:.06,delay:.02+i*.012}));}}
function voltOn(e,x,y,z,ph,big,k){pre(A(new Burst({el:'wT',x,y,z,r:(big?26:17)*k,n:7,life:.18})));pre(A(new Flash({el:'wT',x,y,z,s0:6,s1:(big?28:18)*k,life:.12})));zapOn(e,big?4:2);bits(sys('top'),'wT',x,y,z,big?6:3,{size:.9});
  if(gameTime-(e._w5z||-9)>.5){e._w5z=gameTime;A(new Emit({life:.4,every:.1,fn(){if(!e.dead)zapOn(e,1);}}));}}
function runeOn(e,x,y,z,k){pre(A(new Flash({el:'wR',x,y,z,s0:6,s1:24*k,life:.13})));A(new Spr({im:spr('rune','wR',(Math.random()*8)|0),x,y,z:z+8,w:24*k,life:.42,pop:.1,s0:.3,s1:1,add:1,vz:34,fo:.2}));bits(sys('top'),'ice',x,y,z,3,{size:.7});}
function armorOn(e,x,y,z,ph,k){pre(A(new Burst({el:'wI',x,y,z,r:22*k,n:8,life:.2})));pre(A(new Cut({el:'wS',x,y,z,L:66*k,w:9,ang:cutAng(ph),life:.2})));
  const S=sys('top');for(let i=0;i<qn(7);i++){const a=ph+R(-1.7,1.7),v=R(90,230);S.add({im:spr('shard','wI',i),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R(130,280),g:840,dr:1.2,s0:R(11,18),life:R(.55,.9),rot:R(0,TAU),vr:R(-14,14),bounce:.3,fo:.3});}
  bits(S,'wS',x,y,z,3,{only:0,size:.7});A(new Crack({el:'wI',x:e.x,y:e.y,r:36*k,n:5,hot:.5,life:1.2}));ring('wI',e.x,e.y,48*k,{life:.3});}
function goldOn(e,x,y,z,ph,k){pre(A(new Burst({el:'wG',x,y,z,r:26*k,n:9,life:.24})));pre(A(new Flash({el:'wG',x,y,z,s0:8,s1:36*k,life:.14})));bits(sys('top'),'wG',x,y,z,5,{only:0,size:.8});links(x,y,z,5,'wS');A(new Crack({el:'wG',x:e.x,y:e.y,r:44*k,n:6,hot:1,life:1.3}));ring('wG',e.x,e.y,70*k,{w0:11,life:.34});}
function vampOn(e,x,y,z,ph,k){pre(A(new Cut({el:'wV',x,y,z,L:62*k,w:9,ang:cutAng(ph),life:.2})));
  for(let i=0;i<3;i++)A(new Proj({el:'wV',x,y,z:z+R(-6,8),to:player,tz:30,speed:R(300,380),head:'drop',r:6,trail:.2,curve:(i-1)*34+R(-10,10),delay:i*.05,onHit:(hx,hy,hz)=>{A(new Flash({el:'wV',x:hx,y:hy,z:hz,s0:6,s1:24,life:.12}));if(i===2)healFx();}}));}
function hitFx(e,key,o,mult){const st=ST[key],now=gameTime,big=!!o.big||mult>=2.4;if(!st||!st.hit)return;
  if(now!==HT){HT=now;HN=0;}if(HN>=5)return;if(now-(e._w5h||-9)<.06&&!big)return;e._w5h=now;HN++;
  const x=e.x,y=e.y+1,z=(e.boss?42:26)+R(-4,6),ph=Math.atan2(e.y-player.y,e.x-player.x),k=e.boss?1.35:1;
  switch(st.hit){
    case 'steel':pre(A(new Cut({el:'wS',x,y,z,L:(big?70:48)*k,w:big?10:7,ang:cutAng(ph),life:.18})));pre(A(new Flash({el:'wS',x,y,z,s0:6,s1:(big?32:20)*k,life:.12})));bits(sys('top'),'wS',x,y,z,big?5:3,{dir:ph,spread:1,size:.7});break;
    case 'blood':bloodOn(e,x,y,z,ph,big,k);break;
    case 'claw':if(o.label==='RUPTURE')ruptureOn(e,x,y,z,ph,k);else clawsOn(e,x,y,z,ph,big,k);break;
    case 'rush':pre(A(new Cut({el:'wA',x,y,z,L:104*k,w:11,ang:scrAng(player.phi),life:.22})));spray('wA',x,y,z,7,{dir:player.phi,spread:.5,sp:1.3});after(.08,healFx);break;
    case 'vamp':vampOn(e,x,y,z,ph,k);break;
    case 'gold':goldOn(e,x,y,z,ph,k);break;
    case 'armor':armorOn(e,x,y,z,ph,k);break;
    case 'ice':iceOn(e,x,y,z,ph,big,k);break;
    case 'shatter':shatterOn(e,x,y,z,ph,k);break;
    case 'volt':voltOn(e,x,y,z,ph,big,k);break;
    case 'rune':runeOn(e,x,y,z,k);break;}}

/* ---------- 6. ground pieces: placed and timed by the piece the old look made at that moment ---------- */
let TS=null,ZN={t:-9},HL=-9,CN=0;
function healFx(){if(gameTime-HL<.25)return;HL=gameTime;const x=player.x,y=player.y;ring('wV',x,y,48,{life:.4,w0:7});lite('wV',x,y,60,.5,.45);
  KT.h.floaters(sys('top'),[spr('heart','wV'),spr('plus','wV')],x,y,16,5,{s:12});}
function fang(c){const h=cl((c.h||20)*1.9+8,22,86),sp=A(new Spike({el:'ice',x:c.x,y:c.y,h,w:h*.4,lean:c.lean||0,life:Math.max(.32,Math.min(c.life||.4,2.6)+.22),rise:.07,sink:.2,delay:Math.max(0,c.delay||0)}));
  const s0=c.shatter;if(s0)c.shatter=function(){try{sp.kill();bits(sys('top'),'ice',c.x,c.y,h*.4,3,{size:.8});}catch(e){}return s0.apply(this,arguments);};}
function stormZone(x,y,r,life){if(gameTime-ZN.t<1.2&&Math.hypot(x-ZN.x,y-ZN.y)<40)return;ZN={t:gameTime,x,y};const L=cl(life||2.2,1.6,3);
  mark(x,y,r*.94,'wT',L,{spin:.22,fi:.22,fo:.35,a:.9});lite('wT',x,y,r*1.05,L,.3);
  KT.orbit({x,y,n:6,r:r*.86,z:30,spin:1.1,life:L,w:24,im:[0,1,2,3,4,5].map(i=>spr('rune','wT',i)),glow:pal('wT')[2],bob:4,fi:.25,fo:.3});}
function stormEnd(x,y,r){ring('wT',x,y,r,{w0:15,life:.42});ring('wT',x,y,r*.62,{delay:.07,life:.32});strikeAt(x,y,1.3);runesOut(x,y,r*.45,'wT',8);}
function runeNova(x,y,r){mark(x,y,r*.5,'wR',.5,{spin:1.2,fi:.1,fo:.3});ring('wR',x,y,r,{w0:14,life:.4});ring('wR',x,y,r*.64,{delay:.07,life:.32});
  pre(A(new Flash({el:'wR',x,y,z:30,s0:10,s1:48,life:.18})));runesOut(x,y,r*.5,'wR',8);}
function spearFx(){const w=player.socket&&player.socket.w,px=w?w[0]:player.x,py=w?w[1]:player.y,pz=w?w[2]:36,t=TS&&gameTime-TS.t<2?TS:{x:px+Math.cos(player.phi)*160,y:py+Math.sin(player.phi)*160};
  A(new Streak({el:'wT',x:px,y:py,z:pz,x2:t.x,y2:t.y,z2:14,w:19,life:.24,go:.28}));A(new Bolt({el:'wT',x:px,y:py,z:pz,x2:t.x,y2:t.y,z2:12,w:5.5,life:.3,jag:11,branch:2}));
  A(new Crack({el:'wT',x:t.x,y:t.y,r:52,n:6,hot:1,life:1.3}));ring('wT',t.x,t.y,84,{w0:12,life:.36});pre(A(new Burst({el:'wT',x:t.x,y:t.y,z:14,r:40,n:10,life:.24})));pre(A(new Flash({el:'wT',x:t.x,y:t.y,z:16,s0:10,s1:46,life:.16})));runesOut(t.x,t.y,26,'wT',4);}
function descentLand(x,y){KT.h.blast('ice',x,y,1.1,{quiet:1});A(new Crack({el:'ice',x,y,r:86,n:7,hot:.8,life:1.6}));
  for(let i=0;i<7;i++){const a=i/7*TAU+R(-.25,.25),d=R(26,58);A(new Spike({el:'ice',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d*.8,h:R(44,84)*(1-d/150),w:R(16,24),lean:Math.cos(a)*.5,life:R(.7,1.05),rise:.08,delay:.02+d*.0012}));}}
function clawGround(x,y,phi){const nx=Math.cos(phi+Math.PI/2),ny=Math.sin(phi+Math.PI/2),cx=x+Math.cos(phi)*30,cy=y+Math.sin(phi)*30;
  for(let i=-1;i<=1;i++)A(new Crack({el:'wA',x:x+nx*i*13,y:y+ny*i*13,line:92-Math.abs(i)*12,phi:phi+i*.1,hot:1,w:4.5,life:1.7,delay:.02*(i+1)}));
  ring('wA',cx,cy,112,{w0:13,life:.38});dust({},cx,cy,34,8,30);lite('wA',cx,cy,90,.4,.5);}
function dashStreak(a,b,key){const el=ST[key].el,rush=key==='bloodRush';A(new Streak({el,x:a[0],y:a[1],z:a[2]||24,x2:b[0],y2:b[1],z2:b[2]||24,w:rush?17:12,life:.3,go:.3}));dust({},a[0],a[1],16,4,20);
  if(rush)for(let i=1;i<=5;i++){const u=i/6;spray('wA',lerp(a[0],b[0],u),lerp(a[1],b[1],u),18,1,{size:.8,sp:.35,up:.5,delay:.02+u*.12});}}
/* a lightning dash: the bolt is tied to where the dash began and follows the wolf until the action ends */
function liveBolt(el){const a=player.action,sx=player.x,sy=player.y,T=a?Math.max(.12,rt((a.dur||.25)-(a.t||0))):.3;if(a&&a._w5b)return;if(a)a._w5b=1;
  for(const w of[6.5,3]){const b=A(new Bolt({el,x:sx,y:sy,z:w>4?24:34,x2:sx+1,y2:sy,z2:w>4?24:34,w,life:T+.26,jag:w>4?12:16,branch:w>4?2:0,rej:.04})),t0=b.tick;b.tick=function(dt){if(player.action===a){this.x2=player.x;this.y2=player.y;}return t0.call(this,dt);};}
  pre(A(new Flash({el,x:sx,y:sy,z:24,s0:8,s1:30,life:.14})));ring(el,sx,sy,40,{life:.28});
  after(T,()=>{ring(el,player.x,player.y,46,{life:.3});bits(sys('top'),el,player.x,player.y,20,5,{size:.9});});}

for(const nm of ['drawPlayerAura']){const f0=window[nm];if(typeof f0!=='function')continue;window[nm]=function(){const g=player.glow,a=player.action;if(!g||!g.k||!a||!ST[a.key])return f0.apply(this,arguments);const k0=g.k;g.k=k0*.5;try{return f0.apply(this,arguments);}finally{g.k=k0;}};}
const KEEP=1;
const CONV={
  Slash:(f,key)=>{onSlash(f,key);},
  RuneCircle:(f,key)=>{if(key==='thunderSpear'){TS={x:f.x,y:f.y,t:gameTime};mark(f.x,f.y,36,'wT',.7);}else if(key==='frozenDescent')mark(f.x,f.y,54,'wR',1.05);else if(key==='runeStorm'&&f.r>90)stormZone(f.x,f.y,f.r,f.life);},
  GRing:(f,key)=>{const r=f.r1||0;if(key==='runeBurst'&&r>=110)runeNova(f.x,f.y,r);else if(key==='runeStorm'&&r>=110)stormEnd(f.x,f.y,r);},
  ClawMarks:f=>{clawGround(f.x,f.y,f.phi==null?player.phi:f.phi);},
  Streak:(f,key)=>{if(f.a&&f.b)dashStreak(f.a,f.b,key);},
  CStreak:(f,key)=>{if(key==='lightningPursuit')liveBolt('wT');},
  WStormStep:()=>{liveBolt('wT');},
  CStrike:(f,key)=>{strikeAt(f.x,f.y,key==='runeStorm'?.62:.95);},
  CPlus:()=>{healFx();},
  Crystal:(f,key)=>{if(key==='iceBreak'&&(CN++&1))return;fang(f);},
  WImg:f=>{if(f.n==='w16_spear')spearFx();},
  FallObj:(f,key)=>{if(key==='frozenDescent'&&!f._w5){f._w5=1;const l0=f.onLand;f.onLand=function(){const r=l0&&l0.apply(this,arguments);try{descentLand(f.x,f.y);}catch(e){warn('land',e);}return r;};}return KEEP;}};
/* visual-only pieces of the engine, of wolf_fx.js (W…) and of wolf_vfx3.js (C… / G…) that are not drawn for ST's skills */
const DROP=new Set(['TexArc','Impact','GLight','Crack','CrackStar','ScorchLine','SpiralWave','Bolt','LightPillar','WindArc','SpectralAxe','Drain','LineCut','TexGhost','HitCrescents','PuffDust','CycloneRing','Guillotine','RuneShield',
  'GSys','CFangs','CBolt','WZap','WStreak','WGhost','WLeapArc','WDrain','WRock','WBit','CSlash','CCut','CDrop','CRip','CBurst','CChop','CCrack','CRing','CPuff','CThrust','CShard','COrb','GCrys','CCrater']);

/* ---------- 7. cast-time pieces (extra action events) ---------- */
const ev=(a,t,f)=>a.events.push({t,f:safe('ev',f)});
const MK={
  battleStep(a){const sx=player.x,sy=player.y,ph=player.phi,L=90+30*((typeof LV==='object'&&LV.battleStep)||1),c=Math.cos(ph),s=Math.sin(ph);
    ev(a,0,()=>{dust({},sx,sy,18,5,24);A(new Streak({el:'wS',x:sx,y:sy,z:14,x2:sx+c*L,y2:sy+s*L,z2:14,w:9,life:.3,go:.5,head:0}));
      for(const d of[-1,1])A(new Streak({el:'wS',x:sx-s*10*d,y:sy+c*10*d,z:30+d*9,x2:sx+c*L*.8-s*10*d,y2:sy+s*L*.8+c*10*d,z2:30+d*9,w:3.5,life:.26,go:.5,head:0,delay:.03}));});
    ev(a,(a.dur||.2)*.85,()=>dust({},player.x,player.y,14,4,20));}};

/* ---------- 8. hooks (all outermost; an error here never reaches the game) ---------- */
const A0=window.addFx;
window.addFx=addFx=function(f){
  if(!f||f._v5||f instanceof Part||f instanceof KT.Sys)return A0.apply(this,arguments);
  const key=ctxKey();if(!key||!ST[key])return A0.apply(this,arguments);
  const n=f.constructor&&f.constructor.name,cv=CONV[n];
  if(cv){let r;try{r=cv(f,key);}catch(e){warn('conv '+n,e);}if(r===KEEP)return A0.apply(this,arguments);return f;}
  if(DROP.has(n))return f;
  return A0.apply(this,arguments);};
const E0=window.emit;
window.emit=emit=function(o){if(o&&/^(round|spark|ember|dust|shard|frag|glint)$/.test(o.type)){const key=ctxKey();if(key&&ST[key])return;}return E0.apply(this,arguments);};
const H0=window.hurt;
window.hurt=hurt=function(e,mult,o){const dead0=e&&e.dead,r=H0.apply(this,arguments);
  try{if(e&&!dead0&&r&&!(o&&o.dot)){const key=(o&&o.skill)||(o&&o.auto?'basic':null)||ctxKey();if(key&&ST[key])hitFx(e,key,o||{},mult||1);}}catch(x){warn('hit',x);}return r;};
if(window.hurt)window.hurt._wfx=1;
const SA0=window.slashAt;
window.slashAt=slashAt=function(a,kC,o){const key=a&&(a.skill||a.key);if(!key||!ST[key]||!a.seq)return SA0.apply(this,arguments);
  try{if(key==='axeDance'){danceSwing(a,o);return null;}const s=a.seq;return spriteSlash(s,null,kC,null,Object.assign({grow:Math.max(.06,seqTimeAt(s,kC+1)-seqTimeAt(s,Math.max(0,kC-1)))},o));}catch(e){warn('slashAt',e);return SA0.apply(this,arguments);}};
const MB0=window.mkBasic;
if(typeof MB0==='function')window.mkBasic=mkBasic=function(){const a=MB0.apply(this,arguments);
  try{if(a&&a.update&&!a._w5u){a._w5u=1;const u0=a.update;a.update=function(){const p=window.__W5;window.__W5='basic';try{return u0.apply(this,arguments);}finally{window.__W5=p;}};}}catch(e){warn('basic',e);}return a;};
for(const key in MK){const s=typeof SKILLS==='object'&&SKILLS[key];if(!s||typeof s.make!=='function')continue;const m0=s.make;
  s.make=function(){const a=m0.apply(this,arguments);try{if(a&&Array.isArray(a.events))MK[key](a);}catch(e){warn('make '+key,e);}return a;};}
window.WV5={on:1,ST,keys:()=>Object.keys(ST),CONV,DROP};
})();
