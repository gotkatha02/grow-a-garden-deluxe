/* =====================================================================
   NINE-TAILED KITSUNE MIKO — skill effects v3: SVG art (kitsune_art.js) + code VFX.
   Owner 2026-11-20: "next, the nine-tailed fox" — same brief as the cat (cat_vfx.js): pretty, realistic, every effect
   matching its skill's concept, and the effect in step with the moment the damage lands.

   TIMING: the kitsune casts, she does not swing — every skill is "wind-up → release → travel → hit".
   · wind-up: a ring closes on her for exactly the action's wind-up (action seconds ÷ ACTION_TEMPO), light at the staff tip.
   · things that FALL (wisp rain, stars, the meteor, Tamamo's sun) are started early so they touch the ground on the
     frame their damage lands; things that FLY (orbs, crescent, wheel, disc) carry the damage themselves.
   · beams are instant; hit sparks come from the damage itself (kHit → KIV.hit).
   char_kitsune.js asks window.KIV before every old visual; ?vfx3=0 brings the painted pictures back.
   The pieces (KArc, KRing, KSprite, petals, embers …) are the kit shared by cat_vfx.js as window.K3.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='kitsune'||!window.K3||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {V,PAL,TAU,cl,eO,eI,back,lerp,R_,rt,scr,art,tint,sprite,KArc,star,KGlint,KBurst,KRing,ring,KStreak,petals,embers,dust,stones,ensure}=window.K3;
/* palettes: [ink, deep, mid, lite, core] */
const FP=['#4a0c30','#d83a8c','#ff7ab8','#ffd0ea','#ffffff'],FB=['#102a5a','#3a8fe0','#7ad8ff','#d8f6ff','#ffffff'],MN=['#221e52','#6a6ae0','#a9b6ff','#e6ecff','#ffffff'],
  GD=PAL.gold,ST=['#4a3a10','#e0a030','#ffe07a','#fff6c8','#ffffff'],RD=['#3a0c08','#b8281e','#e8442c','#ff9a70','#ffe9d8'],GR=['#0c3a1a','#3aa85a','#8af0a0','#e0ffe0','#ffffff'];
const palC=c=>c===KIC.fire2?FB:c===KIC.moon||c===KIC.moon2?MN:c===KIC.gold?GD:c===KIC.red?RD:c==='#fff2b0'?ST:FP;
const {sys}=V,A=window.KTA;
/* sparks of fox fire: tiny flames that rise and go out (no round dots) */
function sparks(x,y,z,n,o={}){const S=sys('top'),p=o.p||FP,q=Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.5,Q.p):1)));for(let i=0;i<q;i++){const im=A.get((p===FB?'wispB':'wispP')+(i%2));if(!im)return;const a=R_(0,TAU),v=R_(.3,1)*(o.spd==null?120:o.spd);
    S.add({im,asp:1.6,x:x+R_(-4,4),y:y+R_(-3,3),z:z+R_(-4,6),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(.4,1)*(o.up==null?150:o.up),dr:2.2,g:-60,s0:R_(6,10)*(o.s||1),s1:1.5,life:R_(.32,.6),fi:.03,fo:.5,a0:1,delay:R_(0,.05)});}}
const wisp=p=>(p===FB?'wispB':'wispP')+(((gameTime*11)|0)%2);
const tip=()=>{const s=player.socket&&player.socket.w;return s&&isFinite(s[0])&&isFinite(s[2])?[s[0],s[1],s[2]]:[player.x+Math.cos(player.phi)*12,player.y+Math.sin(player.phi)*9,56+(player.z||0)];};
const zOf=e=>(e&&e.boss?40:26);
const KIV=window.KIV={on:1};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('kitsune');
/* engine pieces that only ever come from her own hits / casts */
const mine=()=>!!(window.SKCTX||window.__ACTEV);
if(!window._kiv3h){window._kiv3h=1;const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;if(n==='HitCrescents'||n==='PuffDust')return f;
      if((n==='GRing'||n==='Impact')&&f.color==='#ffe9a8'&&mine()){if(n==='GRing')A0(new KRing({x:f.x,y:f.y,r0:f.r0,r1:f.r1,w:5,pal:GD,life:f.life||.3}));else{const q=f.pos||[f.x,f.y,24];A0(new KGlint({x:q[0],y:q[1],z:q[2],s:13,col:GD[2],life:.16}));}return f;}}
    return A0.apply(this,arguments);};
  const E0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|glint)$/.test(o.type))return;return E0.apply(this,arguments);};}

/* ---------------------------------------------------------------------
   1. PIECES OF HER OWN
   --------------------------------------------------------------------- */
/* a beam of light or fire: a lance from a to b that snaps out, holds, and thins away */
class KBeamFx{constructor(o){Object.assign(this,{t:0,layer:'top',life:.3,grow:.035,w:10,pal:MN,ink:.35,z0:34,z1:34},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const g=cl(this.t/this.grow,0,1),f=cl((this.t-this.grow-.05)/Math.max(.01,this.life-this.grow-.05),0,1),[ax,ay]=P(this.x0,this.y0,this.z0),[ex,ey]=P(this.x1,this.y1,this.z1),bx=ax+(ex-ax)*g,by=ay+(ey-ay)*g,dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(L<3)return;
    const nx=-dy/L,ny=dx/L,w=this.w*(1-f*f),p=this.pal,at=(u,h)=>[ax+dx*u+nx*h,ay+dy*u+ny*h];
    const lance=(k,c,al)=>{const h=w*k;ctx.globalAlpha=al;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(ax,ay);for(const [u,s] of [[.08,1],[.86,.92],[1,0],[.86,-.92],[.08,-1]]){const q=at(u,h*s);ctx.lineTo(q[0],q[1]);}ctx.closePath();ctx.fill();};
    ctx.save();if(this.ink>0)lance(1.7,p[0],this.ink*(1-f));lance(1.25,p[1],1-f*.3);lance(.9,p[2],1);lance(.55,p[3],1);lance(.24,p[4],1);ctx.restore();}}
/* a column of fox fire standing up out of the ground */
class KFlameCol{constructor(o){Object.assign(this,{t:0,layer:'sorted',H:150,W:34,life:.56,pal:FP},o);this.ph=R_(0,9);this.acc=0;}
  get sy(){return this.y+3;}
  update(dt){this.t+=dt;this.acc+=dt;if(this.acc>.07&&this.t<this.life-.15){this.acc=0;sprite({n:(this.pal===FB?'wispB':'wispP')+((Math.random()*2)|0),layer:'sorted',x:this.x+R_(-12,12),y:this.y+4,z:R_(.3,.9)*this.H,ay:.8,w:R_(12,18),life:.3,fi:.03,fo:.2,vz:R_(90,160),s0:1,s1:.5});}return this.t<this.life;}
  draw(){const t=this.t,up=back(cl(t/.1,0,1)),f=cl((t-.26)/(this.life-.26),0,1),H=this.H*up*(1-f*.15),[x,y]=P(this.x,this.y,0),p=this.pal;if(H<4)return;
    const shape=(k,hk,ph,col,al)=>{const N=14,q=[];for(let i=0;i<=N;i++){const u=i/N,wob=Math.sin(u*8-t*24+this.ph+ph)*9*u+Math.sin(u*15+t*33+ph*2)*4*u;const hw=this.W*k*.5*(1-f)*(1.2-.2*Math.min(1,u*5))*(1-Math.pow(u,1.7));q.push([x+wob,y-H*hk*u,hw*(1+.38*Math.sin(u*11-t*21+this.ph+ph)),hw*(1+.38*Math.sin(u*9-t*17+this.ph*2+ph+2))]);}
      ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(q[0][0]-q[0][2],q[0][1]);for(const a of q)ctx.lineTo(a[0]-a[2],a[1]);for(let i=N;i>=0;i--)ctx.lineTo(q[i][0]+q[i][3],q[i][1]);ctx.closePath();ctx.fill();};
    ctx.save();shape(1.5,1,0,p[0],.28*(1-f));shape(1.15,1,0,p[1],1-f*.4);shape(.8,.92,.7,p[2],1);shape(.5,.8,1.5,p[3],1);shape(.22,.62,2.4,p[4],1);ctx.restore();}}
/* a burst of fox fire on the ground: a ring, flames standing up along it, embers */
function fireBurst(x,y,R,p=FP,big=0){ring({x,y,r0:8,r1:R,w:R>100?9:6,pal:p,life:.36,segs:5,gap:.25});if(big)ring({x,y,r0:14,r1:R*1.2,w:6,pal:p,life:.5,segs:6,gap:.22,delay:.07});
  const n=cl(Math.round(R/17),4,10);for(let i=0;i<n;i++){const an=i/n*TAU+R_(-.2,.2),r=R*R_(.45,.62);sprite({n:(p===FB?'wispB':'wispP')+(i%2),layer:'sorted',x:x+Math.cos(an)*r,y:y+Math.sin(an)*r*.8,ay:.96,w:R_(13,19)*(big?1.35:1),life:R_(.34,.5),delay:R_(0,.06),fi:.03,fo:.25,s0:.3,s1:1,pop:.12,sy2:1.15});}
  sparks(x,y,14,big?16:8,{spd:R*1.5,up:170,p:p});if(R>=120)dust(x,y,6,{ring:R*.3,size:46,spd:R*.6,life:.7});}
/* something that falls from the sky and touches the ground exactly `delay` seconds from now */
function fall(o){const T=Math.min(o.fall||.24,o.delay+.07),H=o.H||230;sprite({layer:'top',x:o.x,y:o.y,z:0,delay:Math.max(0,o.delay-T),life:T,fi:.03,fo:.01,paint:f=>{const u=eI(cl(f.t/T,0,1)),e=o.e&&!o.e.dead?o.e:null,wx=(e?e.x:o.x)+(1-u)*(o.slant||26),wy=e?e.y:o.y,[x,y]=P(wx,wy,H*(1-u)),[gx,gy]=P(e?e.x:o.x,e?e.y:o.y,0);
      ctx.save();ctx.globalAlpha=.22*u;ctx.fillStyle=o.pal[0];ctx.beginPath();ctx.ellipse(gx,gy,(o.w||16)*.7*u+2,(o.w||16)*.28*u+1,0,0,TAU);ctx.fill();ctx.restore();o.draw(x,y,u,f.t);}});}
/* a streak left in the air by something that falls fast */
function tail(x,y,L,w,p,a=1){ctx.save();ctx.globalAlpha=a*.7;ctx.fillStyle=p[1];ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x+L*.12,y-L);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();ctx.globalAlpha=a;ctx.fillStyle=p[3];ctx.beginPath();ctx.moveTo(x-w*.45,y);ctx.lineTo(x+L*.08,y-L*.7);ctx.lineTo(x+w*.45,y);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------------
   2. CAST · HIT · THE FOUR THINGS EVERYTHING IS BUILT FROM (orb, shot, beam, sky pillar)
   --------------------------------------------------------------------- */
KIV.cast=function(o,tP,a){ensure();const br=kCol(o.key),p=br==='B'?MN:br==='A'?FP:GD,T=rt(tP);ring({x:player.x,y:player.y,follow:1,r0:58,r1:14,w:4,pal:p,life:Math.max(.12,T),ease:eI,segs:4,gap:.35});
  const k=o.key;if(k==='kcTsukuyomi'&&!KIV.__nogod)sprite({n:'moonGod',layer:'ground',follow:player,oy:-8,z:0,ay:.97,w:210,life:T+.75,fi:.12,fo:.45,s0:.55,s1:1,pop:Math.max(.2,T),a:.92,under:'#28244e',ua:.3});
  if(k==='kbBeam'||k==='kcTsukuyomi'||k==='kbMirror')sprite({follow:player,layer:'top',life:T+.22,fi:.05,fo:.12,paint:f=>{const q=tip(),[x,y]=P(q[0],q[1],q[2]),s=cl(f.t/Math.max(.1,T),0,1);art('mirror',x,y,(k==='kcTsukuyomi'?30:20)*(.5+.5*s),{under:'#28244e',ua:.4});if(f.t>T)star(x,y-3,22*(1-(f.t-T)/.22),'#c8d4ff',f.t*5);}});
  if((k==='kcTamamo'||(k==='kaInferno'&&!KIV.__notails)||(k==='kcAwaken'&&!(KIV.clipOk&&KIV.clipOk('awaken'))))&&1)sprite({n:'tails',layer:'ground',follow:player,oy:-6,z:6,ay:.96,w:150,life:T+.5,fi:.1,fo:.3,s0:.4,s1:1,pop:Math.max(.2,T),under:'#4a0c30',ua:.25});};
KIV.release=function(o){const q=tip(),br=kCol(o.key),p=br==='B'?MN:br==='A'?FP:GD;addFx(new KGlint({x:q[0],y:q[1],z:q[2],s:15,col:p[2],life:.18}));};
/* basic attack — she is a ranged caster: fox fire gathers at the head of the staff during the wind-up and is thrown from there */
KIV.staffStart=function(o,tC){const T=rt(tC);sprite({follow:player,layer:'top',life:T+.02,fi:.03,fo:.02,paint:f=>{const q=tip(),[x,y]=P(q[0],q[1],q[2]),k=cl(f.t/Math.max(.05,T),0,1);art('wispP'+(((f.t*18)|0)%2),x,y+2,6+11*k,{ay:.74,under:FP[0],ua:.35});}});};
KIV.staff=function(o,a){const q=tip();addFx(new KGlint({x:q[0],y:q[1],z:q[2],s:17,col:FP[2],life:.16,delay:.03}));};
/* where a shot leaves her: the head of the staff */
KIV.from=function(){const q=tip();return {x:q[0],y:q[1],z:q[2]};};
/* every hit */
const BLUE={kaOrb:1,kaWisp:1,kaRain:1,kcSwarm:1,kaCelestial:1},lastH=new WeakMap();
KIV.hit=function(e,key,br,o){if(!e)return;const big=!!(o&&o.big),now=gameTime;if(!big&&now-(lastH.get(e)||-9)<.07)return;lastH.set(e,now);const z=zOf(e),bs=e.boss?1.3:1;
  if(br==='B'){addFx(new KGlint({e,x:e.x,y:e.y,z,s:(big?22:14)*bs,col:MN[2],life:big?.24:.17}));if(big)addFx(new KBurst({e,x:e.x,y:e.y,z,R:34*bs,n:9,pal:MN,life:.24}));
    for(let i=0;i<(big?3:2);i++)addFx(new KGlint({x:e.x+R_(-18,18),y:e.y+R_(-8,8),z:z+R_(-10,18),s:R_(5,8),col:'#ffffff',life:.22,delay:R_(.02,.12)}));return;}
  const p=BLUE[key]?FB:key==='basic'||key==='knBell'||key==='kcChime'?FP:br==='A'?FP:FP;
  sprite({n:(p===FB?'wispB':'wispP')+((Math.random()*2)|0),follow:e,z:z-6,ay:.8,w:(big?30:20)*bs,life:.26,fi:.01,fo:.16,s0:.4,s1:1.15,pop:.1,layer:'top'});sparks(e.x,e.y,z,big?7:3,{spd:big?170:110,up:150,p:p});
  if(big)addFx(new KBurst({e,x:e.x,y:e.y,z,R:32*bs,n:9,pal:p,life:.22}));};
KIV.pow=function(){return true;};           /* the old flash; KIV.hit does it from the damage */
/* homing fox fire (Foxfire Orb, the staff's fire, lantern sparks): a flame flying head first, its tail streaming behind */
KIV.home=function(h){if(h.z>30)h.z+=(26-h.z)*.1;const p=palC(h.col),[x,y]=P(h.x,h.y,h.z),th=Math.atan2(h.vy*K,h.vx),tr=h._tr||(h._tr=[]);tr.push([x,y]);if(tr.length>8)tr.shift();
  if(tr.length>2){ctx.save();for(const [k,c,al] of [[1,p[1],.5],[.5,p[3],.85]]){ctx.globalAlpha=al;ctx.fillStyle=c;ctx.beginPath();const L=[],Rr=[];for(let i=0;i<tr.length;i++){const u=i/(tr.length-1),a=tr[Math.min(tr.length-1,i+1)],b=tr[Math.max(0,i-1)],dx=a[0]-b[0],dy=a[1]-b[1],d=Math.hypot(dx,dy)||1,w=h.r*1.1*k*u;L.push([tr[i][0]-dy/d*w,tr[i][1]+dx/d*w]);Rr.push([tr[i][0]+dy/d*w,tr[i][1]-dx/d*w]);}
      L.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));for(let i=Rr.length-1;i>=0;i--)ctx.lineTo(Rr[i][0],Rr[i][1]);ctx.closePath();ctx.fill();}ctx.restore();}
  art(wisp(p),x,y,h.r*3.5,{rot:th-Math.PI/2,ay:.68,under:p[0],ua:.35});return true;};
/* thrown things (KiShot): the crescent and the full moon spin flat like thrown blades; the fire wheel stands up and rolls */
KIV.shot=function(s){const [gx,gy]=P(s.x,s.y,0),c=Math.cos(s.phi),sn=Math.sin(s.phi);ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#14102a';ctx.beginPath();ctx.ellipse(gx,gy,s.w*.8,s.w*.3,0,0,TAU);ctx.fill();ctx.restore();
  if(s.kind==='wheel'){const R=s.w*1.15,[x,y]=P(s.x,s.y,R),sq=.32+.68*Math.abs(c),a=s.d/R*(c<0?-1:1),p=FP;
    if(s._l==null||Math.abs(s.d-s._l)>26){s._l=s.d;sprite({n:'wispP'+((s.d|0)%2),layer:'sorted',x:s.x-c*10,y:s.y-sn*10,ay:.96,w:15,life:.5,fi:.03,fo:.3,s0:.4,s1:1,pop:.1});sparks(s.x,s.y,6,1,{spd:60,up:120,p:p});}
    ctx.save();ctx.translate(x,y);ctx.scale(sq,1);ctx.lineCap='round';ctx.globalAlpha=.4;ctx.strokeStyle=p[0];ctx.lineWidth=13;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.globalAlpha=1;
    for(const [w,col] of [[9,p[1]],[5.5,p[2]],[2,p[4]]]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();}
    for(let i=0;i<6;i++){const b=a+i*TAU/6;for(const [w,col] of [[5,p[1]],[2.2,p[3]]]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(b+.5)*R*.55,Math.sin(b+.5)*R*.55,Math.cos(b)*R*.94,Math.sin(b)*R*.94);ctx.stroke();}}
    ctx.restore();for(let i=0;i<5;i++){const b=a*.6+i*TAU/5,fx_=x+Math.cos(b)*R*sq,fy=y+Math.sin(b)*R;art('wispP'+(i%2),fx_,fy,12,{rot:b+Math.PI/2,ay:.85,sy:1+.2*Math.sin(s.t*25+i)});}return true;}
  const disc=s.kind==='disc',n=disc?'moonF':'moonC',[x,y]=P(s.x,s.y,s.z),W=s.w*(disc?3:3.3),back_=s.dir<0?-1:1;
  ctx.save();ctx.translate(x,y);ctx.rotate(scr(s.phi)+(back_<0?Math.PI:0));for(const [k,col,al] of [[1,MN[1],.4],[.5,MN[3],.75]]){ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,-W*.3*k);ctx.lineTo(-W*1.5,0);ctx.lineTo(0,W*.3*k);ctx.closePath();ctx.fill();}ctx.restore();
  art(n,x,y,W*1.14,{flat:1,rot:s.t*(disc?7:17),im:tint(n,MN[1]),a:.85});art(n,x,y,W,{flat:1,rot:s.t*(disc?7:17),under:MN[0],ua:.5,uy:3});if(((s.t*30)|0)%3===0)star(x+R_(-W,W)*.4,y+R_(-W,W)*.25,R_(4,7),'#ffffff',s.t);return true;};
/* beams (KiBeam). Moon beams leave the mirror at her staff; the Inferno's nine come one from each tail */
let INF=null;
const tailTip=i=>{const an=(-76+19*i)*Math.PI/180,L=[112,128,142,152,158,152,142,128,112][i]*.6;return [player.x+Math.sin(an)*L,player.y-6,10+Math.cos(an)*L];};
KIV.beam=function(b){const p=palC(b.col),ex=b.x+Math.cos(b.phi)*b.L,ey=b.y+Math.sin(b.phi)*b.L;let o=[b.x,b.y,36];
  if(b.col===KIC.fire&&INF&&gameTime-INF.t0<3){const i=[4,3,5,2,6,1,7,0,8][INF.n++%9];o=tailTip(i);addFx(new KGlint({x:o[0],y:o[1],z:o[2],s:14,col:FP[2],life:.16}));}
  else if(Math.hypot(b.x-player.x,b.y-player.y)<4)o=tip();
  const big=b.w>=24;addFx(new KBeamFx({x0:o[0],y0:o[1],z0:o[2],x1:ex,y1:ey,z1:big?30:34,w:big?b.w*.8:Math.max(3.5,b.w*.55),pal:p,ink:.45,life:big?.5:b.life||.3}));
  if(big){for(let i=1;i<=4;i++)ring({x:b.x+Math.cos(b.phi)*b.L*i/4.4,y:b.y+Math.sin(b.phi)*b.L*i/4.4,r0:10,r1:54,w:6,pal:MN,life:.36,delay:i*.03});screenFlash(.14,'#c8d4ff');}return true;};
/* light and fire from the sky (KiPillar) — what arrives is decided by what char_kitsune.js asked for */
KIV.pillar=function(q){const c=q.col,x=q.x,y=q.y;
  if(c==='#fff2b0'){addFx(new KGlint({x,y,z:16,s:26,col:ST[2],life:.24}));ring({x,y,r0:6,r1:40,w:4,pal:ST,life:.28});for(let i=0;i<4;i++)addFx(new KGlint({x:x+R_(-22,22),y:y+R_(-10,10),z:R_(8,40),s:R_(5,9),col:'#fff6c8',life:.25,delay:R_(.03,.14)}));return true;}
  if(c===KIC.fire2){ring({x,y,r0:6,r1:40,w:5,pal:FB,life:.28});sprite({n:'wispB'+((Math.random()*2)|0),layer:'sorted',x,y,ay:.96,w:22,life:.36,fi:.01,fo:.24,s0:.3,s1:1,pop:.1,sy2:1.2});sparks(x,y,8,4,{spd:110,up:160,p:FB});return true;}
  if(c===KIC.fire){if(q.w>=100)return true;addFx(new KFlameCol(q.w>=50?{x,y,H:104,W:58,life:.5}:{x,y,H:150,W:36}));return true;}
  /* moonlight: during Tsukuyomi's Night it comes from the moon she raised */
  const N=KI.night,from=N&&q.w<40?moonPos():[x+18,y,330];addFx(new KBeamFx({x0:from[0],y0:from[1],z0:from[2],x1:x,y1:y,z1:6,w:q.w<40?5.5:20,pal:MN,ink:.45,life:q.w<40?.34:.6,grow:.05}));ring({x,y,r0:6,r1:q.w<40?38:90,w:5,pal:MN,life:.3});return true;};
const moonPos=()=>[player.x+84,player.y-20,150];
/* bursts on the ground (kFireBurst): what bursts is told by the colour it was asked in */
KIV.burst=function(x,y,R,col){
  if(col===KIC.gold){const up=x===player.x&&y===player.y?96:70;sprite({n:'bell',layer:'top',x,y,z:up,w:R>70?34:26,life:.55,fi:.02,fo:.25,s0:.4,s1:1,pop:.12,tick:f=>{f.rot=.35*Math.sin(f.t*26)*Math.max(0,1-f.t/.45);},under:GD[0],ua:.45});
    for(let i=0;i<3;i++)ring({x,y,r0:8,r1:R*(.6+.2*i),w:5-i,pal:GD,life:.36+.06*i,segs:6,gap:.3,delay:i*.06});return true;}
  if(col===KIC.white){dust(x,y,5,{size:34,spd:46,life:.6,tint:'#ffffff|#b9c0e0'});sprite({n:'leaf',layer:'top',x,y,z:30,w:15,life:.9,fi:.02,fo:.3,vz:-18,vx:R_(-14,14),spin:5,tick:f=>{f.sx=Math.cos(f.t*9);}});return true;}
  if(col===KIC.moon||col===KIC.moon2){ring({x,y,r0:8,r1:R,w:5,pal:MN,life:.34,segs:5,gap:.25});addFx(new KBurst({x,y,z:26,R:Math.min(40,R*.6),n:9,pal:MN,life:.22}));
    if(col===KIC.moon2)sprite({layer:'top',x,y,z:36,life:.5,fi:.04,fo:.25,paint:(f,sx,sy)=>{const r=24;ctx.fillStyle='#ffffff';for(let i=0;i<12;i++){const an=i/12*TAU+f.t;ctx.beginPath();ctx.moveTo(sx+Math.cos(an-.1)*r,sy+Math.sin(an-.1)*r);ctx.lineTo(sx+Math.cos(an)*(r+14+6*(i%2)),sy+Math.sin(an)*(r+14+6*(i%2)));ctx.lineTo(sx+Math.cos(an+.1)*r,sy+Math.sin(an+.1)*r);ctx.fill();}
        ctx.fillStyle='#c8d4ff';ctx.beginPath();ctx.arc(sx,sy,r+2.5,0,TAU);ctx.fill();ctx.fillStyle='#14102a';ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();}});
    else if(R>=60)stones(x,y,8,{z:30,spd:200,up:200,col:'#dfe8ff',s:.8});return true;}
  fireBurst(x,y,R,FP,R>=120);return true;};

/* ---------------------------------------------------------------------
   3. SKILL BY SKILL
   --------------------------------------------------------------------- */
/* Fox Step: she is gone in a puff of smoke and a leaf (KIV.burst white) — a faint line shows where to */
KIV.step=function(sx,sy,x,y){addFx(new KStreak({a:[sx,sy],b:[x,y],pal:MN,w:6,life:.2,ink:.2}));};
/* Ofuda Ward: talismans fly in and stand round her (they keep circling while the shield holds) */
KIV.wardOn=function(){const x=player.x,y=player.y;ring({x,y,r0:60,r1:26,w:5,pal:GD,life:.32,ease:eI});for(let i=0;i<4;i++){const an=i*TAU/4+.6;sprite({n:'ofuda',layer:'top',x:x+Math.cos(an)*30,y:y+Math.sin(an)*20,z:36,w:13,life:.4,fi:.02,fo:.2,s0:2.4,s1:1,rot:R_(-.4,.4),under:GD[0],ua:.4});}};
/* Inari's Blessing: soft green light rises round her */
KIV.bless=function(){const x=player.x,y=player.y;ring({x,y,r0:10,r1:62,w:5,pal:GR,life:.4});for(let i=0;i<8;i++)addFx(new KGlint({x:x+R_(-24,24),y:y+R_(-10,10),z:R_(8,70),s:R_(6,11),col:i%2?GR[2]:GD[2],life:.4,delay:i*.05}));};
/* Torii Gate: the gate comes up out of the ground and stands for as long as the blessing does */
KIV.toriiOn=function(x,y){const T=KI.torii;sprite({n:'torii',layer:'sorted',x,y,sortOff:-4,ay:.975,w:104,life:99,fi:.04,fo:.3,s0:.15,s1:1,pop:.3,until:()=>KI.torii===T,under:RD[0],ua:.3});
  ring({x,y,r0:10,r1:KB.knTorii.R,w:6,pal:RD,life:.45,segs:6,gap:.25});dust(x-24,y,2,{size:30,spd:30,life:.5});dust(x+24,y,2,{size:30,spd:30,life:.5});};
/* Spirit Flame Pillar: the ground glows where it will come up; the pillar itself is KiPillar → KFlameCol at the hit */
KIV.pillarTele=function(x,y,T){ring({x,y,r0:74,r1:14,w:5,pal:FP,life:T,ease:eI,segs:4,gap:.3});sprite({layer:'ground',x,y,life:T+.1,fi:.05,fo:.1,paint:(f,sx,sy)=>{ctx.translate(sx,sy);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,2,0,0,46);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(.4,'rgba(255,122,184,.6)');g.addColorStop(1,'rgba(255,122,184,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,46*cl(f.t/T,0.2,1),0,TAU);ctx.fill();}});};
/* Will-o'-Wisp Rain / Meteor Wisp: each wisp is already falling when its damage is due */
KIV.rainDrop=function(x,y,delay){fall({x,y,delay,pal:FB,w:14,draw:(sx,sy,u,t)=>{tail(sx,sy-8,46,5,FB);art('wispB'+(((t*20)|0)%2),sx,sy,17,{ay:.72,sy:1.35,under:FB[0],ua:.35});}});};
KIV.meteorDrop=function(x,y,delay){fall({x,y,delay,fall:.34,H:280,slant:50,pal:FP,w:44,draw:(sx,sy,u,t)=>{tail(sx,sy-20,110,13,FP);art('wispP'+(((t*20)|0)%2),sx,sy,50,{ay:.72,sy:1.3,under:FP[0],ua:.4});}});};
/* Tail Burst: the tails flare open behind her and the fire they held rolls out as a wave */
KIV.tailBurst=function(R,n){const x=player.x,y=player.y;sprite({n:'tails',layer:'ground',follow:player,oy:-6,z:6,ay:.96,w:150+6*n,life:.55,fi:.02,fo:.3,s0:.5,s1:1.08,pop:.14,under:FP[0],ua:.25});fireBurst(x,y,R,FP,1);};
/* Nine-Tailed Inferno: the fan opens during the wind-up (KIV.cast), then one beam per tail */
KIV.infernoStart=function(tP){INF={n:0,t0:gameTime};sprite({follow:player,layer:'top',life:rt(tP+9*.08)+.3,fi:.05,fo:.2,paint:f=>{const lit=Math.min(9,Math.floor(f.t/Math.max(.02,rt(tP))*9));for(let i=0;i<lit;i++){const q=tailTip([4,3,5,2,6,1,7,0,8][i]),[x,y]=P(q[0],q[1],q[2]);art('wispP'+((i+((f.t*12)|0))%2),x,y,13,{ay:.8});}}});
  if(!KIV.__notails)sprite({n:'tails',layer:'ground',follow:player,oy:-6,z:6,ay:.96,w:156,life:rt(tP+9*.08)+.45,delay:rt(tP),fi:.01,fo:.35,under:FP[0],ua:.25});};
/* Starfall: every star is on its way down before its hit */
KIV.starDrop=function(t,delay){fall({e:t,x:t.x,y:t.y,delay,fall:.22,H:250,slant:34,pal:ST,w:12,draw:(sx,sy,u,tt)=>{tail(sx,sy-4,84,6,ST);star(sx,sy,17,ST[1],tt*9);star(sx,sy,11,'#fffbe0',tt*9);}});};
/* Lunar Circle / Moonlight Form / Tsukuyomi's Night / Inari's Grace / Awakening: what happens at the moment of the cast */
KIV.circleOn=function(x,y){ring({x,y,r0:KB.kbCircle.R*1.15,r1:KB.kbCircle.R*.5,w:5,pal:MN,life:.4,ease:eI,segs:6,gap:.25});};
KIV.moonlightOn=function(){const x=player.x,y=player.y;ring({x,y,r0:10,r1:60,w:5,pal:MN,life:.36});for(let i=0;i<6;i++)addFx(new KGlint({x:x+R_(-20,20),y:y+R_(-8,8),z:R_(10,76),s:R_(6,10),col:'#ffffff',life:.35,delay:i*.04}));};
KIV.nightOn=function(){for(let i=0;i<2;i++)ring({x:player.x,y:player.y,r0:20,r1:KB.kbNight.R*(.6+.4*i),w:6,pal:MN,life:.6,segs:7,gap:.3,delay:i*.1});};
KIV.graceOn=function(){const x=player.x,y=player.y;sprite({n:'rice',layer:'top',follow:player,z:92,w:40,life:.9,fi:.03,fo:.35,s0:.4,s1:1,pop:.16,vz:14,under:GD[0],ua:.4});ring({x,y,r0:10,r1:70,w:6,pal:GD,life:.45});return true;};
KIV.awakenOn=function(){const x=player.x,y=player.y;sprite({n:'mask',layer:'top',follow:player,z:108,w:40,life:.75,fi:.03,fo:.35,s0:.3,s1:1,pop:.16,under:FP[0],ua:.45});fireBurst(x,y,130,FP,1);return true;};
/* Tamamo's Sun: the sun of fox fire comes down for exactly as long as the damage is delayed, then breaks the ground */
KIV.sunDrop=function(x,y,T){fall({x,y,delay:T,fall:T,H:300,slant:60,pal:FP,w:110,draw:(sx,sy,u,t)=>{tail(sx,sy-30,170,26,FP,.8);art('sun',sx,sy,70+60*u,{rot:t*2.2,under:FP[0],ua:.35});}});
  ktDelay(T,()=>{V.groundBreak(x,y,1.2,0);sprite({n:'sun',layer:'top',x,y,z:26,w:150,life:.3,fi:.01,fo:.22,s0:.9,s1:1.5,a:.9});fireBurst(x,y,KB.kcTamamo.R,FP,1);sparks(x,y,30,16,{spd:300,up:260,p:FP,s:1.3});});};
function ktDelay(t,f){if(typeof setFxTimer==='function')setFxTimer(t,f);else setTimeout(f,t*1000);}

/* ---------------------------------------------------------------------
   4. WHAT IS DRAWN ALL THE TIME (KiGround.draw / KiTop.draw)
   --------------------------------------------------------------------- */
const hash=(a,b)=>{const s=Math.sin(a*12.9898+b*78.233)*43758.5453;return s-Math.floor(s);};
let MIR=null,AWK=null;
function orbit(n,R,ry,z,spd,t,front,draw){for(let i=0;i<n;i++){const an=t*spd+i*TAU/n,sn=Math.sin(an);if((sn>=0)!==front)continue;const [x,y]=P(player.x+Math.cos(an)*R,player.y+sn*ry,z+(player.z||0));draw(x,y,i,sn,an);}}
function sharedRings(t,front){
  if(KI.shield>0&&KI.shieldUntil>gameTime)orbit(3,30,19,34,1.5,t,front,(x,y,i,sn)=>art('ofuda',x,y+3*Math.sin(t*3+i),11+1.5*sn,{rot:.12*Math.sin(t*2+i),under:GD[0],ua:.4}));
  if(kL('kaWisp'))orbit(2,34,20,44,2.6,t,front,(x,y,i)=>art('wispB'+((((t*10)|0)+i)%2),x,y,13,{ay:.75,under:FB[0],ua:.3}));
  if(hasBuff('kaVeil'))orbit(10,KB.kaVeil.R,KB.kaVeil.R*.8,0,.9,t,front,(x,y,i)=>art('wispP'+((((t*9)|0)+i)%2),x,y+2,15,{ay:.96,sy:1+.18*Math.sin(t*15+i*2),under:front?null:FP[0],ua:.3}));}
KIV.ground=function(g){ensure();const t=gameTime,T=KI.torii,C=KI.circle;
  if(T){const [x,y]=P(T.x,T.y,0),R=KB.knTorii.R,a=cl((gameTime-(T.t0||0))/.3,0,1)*cl((T.until-gameTime)/.4,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;const gr=ctx.createRadialGradient(0,0,R*.3,0,0,R);gr.addColorStop(0,'rgba(232,68,44,0)');gr.addColorStop(1,'rgba(232,68,44,.16)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.lineCap='round';for(let i=0;i<8;i++){const s=t*.35+i*TAU/8;ctx.strokeStyle='#b8281e';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R,s,s+.55);ctx.stroke();ctx.strokeStyle='#ffd9c8';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,R,s+.06,s+.49);ctx.stroke();}ctx.restore();}
  if(C){const [x,y]=P(C.x,C.y,0),R=KB.kbCircle.R,a=cl((gameTime-(C.t0||0))/.3,0,1)*cl((C.until-gameTime)/.3,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;const gr=ctx.createRadialGradient(0,0,4,0,0,R);gr.addColorStop(0,'rgba(40,36,78,.5)');gr.addColorStop(.55,'rgba(138,138,224,.26)');gr.addColorStop(1,'rgba(200,212,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.strokeStyle='#8a8ae0';ctx.lineWidth=4.5;ctx.beginPath();ctx.arc(0,0,R*.96,0,TAU);ctx.stroke();ctx.strokeStyle='#eef2ff';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(0,0,R*.96,0,TAU);ctx.stroke();
    /* light drawn slowly to the centre */ctx.lineCap='round';for(let i=0;i<10;i++){const an=i*TAU/10+t*.25,u=(t*.5+i*.37)%1,r1=R*(1-u)*.95,r0=Math.min(R*.95,r1+22);ctx.globalAlpha=a*Math.sin(Math.PI*u)*.9;ctx.strokeStyle='#eef2ff';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(Math.cos(an+u)*r0,Math.sin(an+u)*r0);ctx.lineTo(Math.cos(an+u+.1)*r1,Math.sin(an+u+.1)*r1);ctx.stroke();}
    ctx.restore();ctx.save();ctx.globalAlpha=a;for(let i=0;i<4;i++){const an=-t*.4+i*TAU/4,[mx,my]=P(C.x+Math.cos(an)*R*.72,C.y+Math.sin(an)*R*.72,0);art('moonC',mx,my,24,{flat:1,rot:an+2.2});}ctx.restore();}
  for(const p of KI.petals){const a=cl((p.until-gameTime)/.4,0,1);for(let i=0;i<5;i++){const h1=hash(p.x+i,p.y),h2=hash(p.y,p.x+i*3),[x,y]=P(p.x+(h1-.5)*p.R*1.5,p.y+(h2-.5)*p.R*1.1,0);art('petal'+(i%3),x,y,9,{flat:1,rot:h1*6,a:a*.9});}}
  for(const l of KI.lanterns){const [x,y]=P(l.x,l.y,0);ctx.save();ctx.globalAlpha=.3;ctx.fillStyle='#2a1a1a';ctx.beginPath();ctx.ellipse(x,y,9,3.6,0,0,TAU);ctx.fill();ctx.globalAlpha=.3+.08*Math.sin(t*6+l.x);ctx.fillStyle='#ffb070';ctx.beginPath();ctx.ellipse(x,y,22,9,0,0,TAU);ctx.fill();ctx.restore();}
  const M=KI.mirror;if(M){const [x,y]=P(M.x,M.y,0);ctx.save();ctx.globalAlpha=.28;ctx.fillStyle='#14102a';ctx.beginPath();ctx.ellipse(x,y,15,6,0,0,TAU);ctx.fill();ctx.restore();}
  if(kAwake()&&!(AWK&&AWK.end==null&&AWK.t<1e9&&fx.includes(AWK))){const [x,y]=P(player.x,player.y-6,6+(player.z||0));art('tails',x,y,128,{ay:.96,a:.62+.08*Math.sin(t*5),rot:.03*Math.sin(t*2.2),under:FP[0],ua:.2});}
  if(hasBuff('kbMoonlight')){const [x,y]=P(player.x,player.y-4,74+(player.z||0));art('moonC',x,y,58,{a:.7,rot:-.5,under:MN[0],ua:.25});}
  sharedRings(t,false);return true;};
KIV.top=function(tp){const t=gameTime,pz=(player.z||0)+92*(typeof CHAR_SCALE==='number'?CHAR_SCALE:1),[x,y]=P(player.x,player.y,pz);
  /* the tails she has lit, as small fox fires over her head */
  if(kL('kaOrb')){const cap=KI_BAL.tails.cap,full=KI.tails>=cap;for(let i=0;i<cap;i++){const an=-Math.PI*.9+i*(Math.PI*.8/8)+Math.PI*.05,px=x+Math.cos(an)*24,py=y+8+Math.sin(an)*13;
      if(i<KI.tails)art((full?'wispB':'wispP')+((((t*8)|0)+i)%2),px,py-(KI.tailPop||0)*2,7.5,{ay:.75,under:(full?FB:FP)[0],ua:.5,ux:.5,uy:.8});else{ctx.fillStyle='rgba(60,30,50,.3)';ctx.beginPath();ctx.ellipse(px,py,1.5,2.2,0,0,TAU);ctx.fill();}}}
  sharedRings(t,true);
  /* lanterns: they come out one after another along her path */
  for(const l of KI.lanterns){const age=gameTime-(l.t0||0);if(age<0)continue;const [lx,ly]=P(l.x,l.y,2+1.5*Math.sin(t*3+l.x)),s=back(cl(age/.18,0,1)),a=cl((l.until-gameTime)/.3,0,1);art('lantern',lx,ly,21*s,{ay:.98,a,rot:.06*Math.sin(t*2.4+l.y),under:'#2a1a1a',ua:.35});}
  /* the Yata mirror hangs in the air where she put it */
  const M=KI.mirror;if(M&&M!==MIR){MIR=M;sprite({n:'mirror',layer:'sorted',x:M.x,y:M.y,z:30,w:42,ay:.42,life:99,fi:.04,fo:.25,s0:.3,s1:1,pop:.2,until:()=>KI.mirror===M,tick:f=>{f.z=30+3*Math.sin(f.t*2.6);},under:MN[0],ua:.4});}
  /* Inari's Grace: grains of light keep falling */
  if(hasBuff('kcGrace')&&((t*60)|0)%13===0)addFx(new KGlint({x:player.x+R_(-26,26),y:player.y+R_(-10,10),z:R_(30,80),s:R_(4,7),col:GD[2],life:.4}));
  if(hasBuff('kbMoonlight')&&((t*60)|0)%11===0)addFx(new KGlint({x:player.x+R_(-18,18),y:player.y+R_(-8,8),z:R_(6,70),s:R_(4,7),col:'#ffffff',life:.4}));
  /* Tsukuyomi's Night: the sky goes dark and the moon she called hangs over the field */
  const N=KI.night;if(N){ctx.save();ctx.fillStyle='rgba(10,12,40,.18)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();const q=moonPos(),[mx,my]=P(q[0],q[1],q[2]),a=cl((gameTime-(N.t0||0))/.5,0,1)*cl((N.until-gameTime)/.5,0,1);art('moonF',mx,my-18*(1-a),92,{a});}
  return true;};

/* ---------------------------------------------------------------------
   5. VIDEO CLIPS (owner 2026-11-21: his 5 videos on black, luminance-keyed strips in assets/fx/kitsune, 8 cols, 24 fps,
      every 2nd video frame). Celestial Fox (end of Inferno), Nine-Tailed Inferno (ground loop), Tsukuyomi Descends
      (god behind her, the rays line up with the beam), Nine-Tail Awakening (intro 0–17 then loop 18–58 while the buff
      lasts), Moonrise (moon + light column at the end of Tsukuyomi's Night, on the damage frame).
   --------------------------------------------------------------------- */
const CLIP={};
function clipDef(k,n,cw,ch){const im=new Image();im.src='assets/fx/kitsune/clip_'+k+'.webp?v=1';CLIP[k]={im,n,cw,ch};}
clipDef('celestial',54,240,225);clipDef('inferno',61,288,158);clipDef('tsukuyomi',56,224,239);clipDef('awaken',59,256,173);clipDef('moonrise',51,224,239);
const clipOk=k=>{const c=CLIP[k];return c&&c.im.complete&&c.im.naturalWidth>0;};
class KiClip{constructor(o){Object.assign(this,{t:0,i0:0,fps:24,layer:'ground',ay:.97,fi:.12,fo:.35,a:1,oy:0},o);this.c=CLIP[o.k];
    this.T=this.life!=null?this.life:((this.last!=null?this.last+1:this.c.n)-this.i0)/this.fps;}
  update(dt){this.t+=dt;if(this.until&&!this.end&&!this.until())this.end=this.t;return this.end!=null?this.t-this.end<this.fo:this.until?true:this.t<this.T;}
  frame(){const c=this.c,f=this.i0+Math.floor(this.t*this.fps);if(this.loop){const [a,b]=this.loop;return f<=b?f:a+((f-a)%(b-a+1));}return Math.min(this.last!=null?this.last:c.n-1,f);}
  draw(){const c=this.c,im=c.im;if(!im.complete||!im.naturalWidth)return;const i=this.frame(),sx=(i%8)*c.cw,sy=Math.floor(i/8)*c.ch;
    const ox=this.follow?player.x:this.x,oy=(this.follow?player.y:this.y)+this.oy,[x,y]=P(ox,oy,0),W=this.w,H=W*c.ch/c.cw;
    let a=this.a*Math.min(1,this.t/Math.max(.01,this.fi));if(this.end!=null)a*=1-(this.t-this.end)/this.fo;else if(!this.until)a*=cl((this.T-this.t)/this.fo,0,1);
    if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.drawImage(im,sx,sy,c.cw,c.ch,x-W/2,y-H*this.ay,W,H);ctx.restore();}}
KIV.clipOk=clipOk;
/* Celestial Fox: the spirit fox flies round her and lands, then breaks into sparks */
KIV.celestialOn=function(){if(!clipOk('celestial'))return false;addFx(new KiClip({k:'celestial',follow:1,oy:-4,w:210,ay:.95,fi:.2,fo:.3}));return true;};
/* Nine-Tailed Inferno: the burning pinwheel lies on the ground under her for the whole ultimate */
function infernoClip(tP){if(!clipOk('inferno'))return false;const R=KB.kaInferno.R;addFx(new KiClip({k:'inferno',follow:1,w:R*2.05,ay:.55,life:rt(tP+9*.08)+.9,loop:[0,60],fi:.25,fo:.45,a:.82}));return true;}
/* Tsukuyomi Descends: the god rises behind her; the rays of the mirror (strip frame ~26) come on the release frame */
function tsukuClip(T){if(!clipOk('tsukuyomi'))return false;const i0=Math.max(0,Math.round(26-T*24));addFx(new KiClip({k:'tsukuyomi',follow:1,oy:-10,w:215,ay:.97,i0,last:47,fi:i0?.1:.2,fo:.45,a:.95}));return true;}
/* Nine-Tail Awakening: the tails open behind her, then sway for as long as the buff lasts */
function awakenClip(){if(!clipOk('awaken'))return false;AWK=new KiClip({k:'awaken',follow:1,oy:-6,w:230,ay:.93,loop:[18,58],until:()=>kAwake(),fi:.15,fo:.5,a:.92});addFx(AWK);return true;}
/* Moonrise: the moon of the night comes down as a column of light on the damage frame */
KIV.moonrise=function(x,y){if(!clipOk('moonrise'))return false;addFx(new KiClip({k:'moonrise',x,y,w:KB.kbMoonrise.R*2.1,ay:.95,fi:.08,fo:.5}));shake(3);return true;};
{const c0=KIV.cast;KIV.cast=function(o,tP,a){const k=o.key,T=rt(tP);
   if(k==='kcTsukuyomi'&&tsukuClip(T)){const keep=KIV.__nogod;KIV.__nogod=1;try{return c0.call(this,o,tP,a);}finally{KIV.__nogod=keep;}}
   if(k==='kaInferno'&&clipOk('inferno')){KIV.__notails=1;try{return c0.call(this,o,tP,a);}finally{KIV.__notails=0;}}
   return c0.call(this,o,tP,a);};}
{const i0=KIV.infernoStart;KIV.infernoStart=function(tP){const ok=infernoClip(tP);KIV.__notails=ok?1:0;try{return i0.call(this,tP);}finally{KIV.__notails=0;}};}
{const a0=KIV.awakenOn;KIV.awakenOn=function(){awakenClip();return a0.call(this);};}
})();
