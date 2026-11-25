/* =====================================================================
   ANUBIS JACKAL (Egypt) — skill effects v4: code VFX on the FXLIB kit (fxlib.js) + vector art (anubis_art.js).
   Owner 2026-11-25 "เปลี่ยนเป็นทำเอฟเฟกต์สกิลให้ Anubis ใหม่" (after asking for pretty VFX / SVG effects kept as our own assets).
   Every skill is drawn from its concept and from what it really does; the game's numbers and hit times are not touched.

   LOOK   A "Flail Dervish"     = gold + desert sand + the sun of Ra: the spiked flail ball on its chain, crescents of gold,
                                  sand storms, the Wheel of Ra, the falling sun.
          B "Judge of the Dead" = violet soul-fire + gold judgment: the soul hook, chains from the ground, the scales with the
                                  heart and the feather of Ma'at, pillars of judgment, the Underworld Gate, Osiris's seal.
          C "Warden of the Duat"= its column: dust devil, the fissure of soul fire, the lotus ring of rebirth, the giant
                                  Anubis spirit, Ra's falling sun, the giant head that bites.
   TIMING the flail ball of a swing is ON the target at the contact frame (the swing starts a little before the skill's own
          event and follows through after it) · falls (Heart Crush's ball, Ra's sun, the second verdict, the giant head's bite)
          start early and land on the game's own timer · instant hits draw on the damage frame · hit sparks come from the damage.
   HOOKS  every SKILLS[k].make + mkBasic are wrapped (extra action events only) · uPow / uBurst are replaced (they only drew)
          · uSlam / uHit / uLungeOnce / uRoot / jgPreHit / jgAbsorb are wrapped · UThrow keeps its update (it carries the hits)
          and gets a new draw · UGround / UTop draw the new gauges (Momentum pips, Sin flames, the ring under the condemned)
          · UCore.update is wrapped by a watcher that keeps the lasting looks (standard, spin / wheel, dust devils, linen
          shield, chain guard, avatar, rebirth) alive while their state lasts, also across a map change.
          Old look off while his own code runs: USwing / UPillar / GRing / Impact / round emits; HitCrescents, PuffDust and the
          placeholder sprite's weapon Trail always. Floating texts (DText) stay.
   ?vfx3=0 = the old painted look (char_anubis_fx.js). Plan + per-skill table: ANUBIS_FX_PLAN_TH.md.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='anubis'||!window.FXLIB||!window.ANUART||/[?&]vfx3=0/.test(location.search))return;
const F=window.FXLIB,K_=F.k,{TAU,cl,lerp,eO,eI,KY,qn,rgba,pal,tex,spr,glowAt,coreAt,starAt,drawSpr,sys,bits,sparks,puffs,glints,A,after,Emit,Fn,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Pillar,Gush,Sigil,Proj,Crack,Flames,Tornado,orbit,Spr,Tele,BIT}=K_;
const R_=K_.R,{scrAng,lite,dark,ring,flash,burst,dust,floaters}=K_.h,ART=window.ANUART;
const AV=window.ANV={on:1,mom:0,sin:0};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('anubis');
/* palettes [ink, deep, mid, lite, core] and the debris of each */
Object.assign(F.PAL,{sand:['#3a2410','#9a6a2a','#d9a658','#f6dc9a','#fff6dc'],sun:['#3a1004','#d8480c','#ff9a2a','#ffd98a','#fff8e0'],duat:['#120824','#4a22a0','#8f5cf0','#d2bcff','#f8f2ff'],
  linen:['#3a3020','#b8a682','#f4ead2','#fffaf0','#ffffff'],life:['#06301c','#1f9a5a','#8aff6a','#e0ffc8','#ffffff']});
BIT.sand=[['rock',{up:[90,230],g:760,sp:170,sz:[4,8],life:[.4,.8],spin:12,bounce:.3}],['gust',{up:[0,30],g:0,sp:200,sz:[14,24],s1:1.3,life:[.22,.4],face:1,dr:3}]];
BIT.sun=BIT.fire;BIT.duat=[['flame',{up:[40,120],g:-60,sp:60,sz:[10,18],s1:.2,life:[.4,.8],wob:4}],['ember',{up:[30,110],g:-40,sp:80,sz:[5,9],s1:.2,life:[.5,.9],wob:5}]];
BIT.linen=[['anLinen',{up:[60,160],g:240,sp:120,sz:[16,24],life:[.6,1.1],spin:6,wob:8,dr:2}],['star4',{up:[0,40],g:0,sp:60,sz:[8,16],s1:.2,life:[.25,.5],add:1}]];
BIT.life=[['plus',{up:[40,90],g:-20,sp:50,sz:[8,12],s1:.8,life:[.6,1]}],['star4',{up:[10,60],g:-10,sp:80,sz:[10,18],s1:.2,life:[.4,.7],add:1}]];
F.dust=()=>/^(vik|snow)/i.test(typeof curMap==='string'?curMap:'')?'cloud':'dust';
const G=F.PAL.gold,DU=F.PAL.duat,SU=F.PAL.sun;
/* the coloured rim and the weapon-tip glow the engine draws on the hero during actions: softer, the effects carry the light */
for(const nm of ['drawPlayerAura','drawPlayer']){const f0=window[nm];if(typeof f0!=='function')continue;window[nm]=function(){const g=player.glow;if(!g||!g.k)return f0.apply(this,arguments);const k0=g.k;g.k=k0*.4;try{return f0.apply(this,arguments);}finally{g.k=k0;}};}

/* ---------------------------------------------------------------------
   1. helpers
   --------------------------------------------------------------------- */
const warn=(k,e)=>{if(!AV['_w'+k]){AV['_w'+k]=1;console.warn('anubis fx',k,e);}};
const safe=(k,f)=>function(){try{return f.apply(this,arguments);}catch(e){warn(k,e);}};
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__ANUTICK||window.__ANUGUARD);
const HK=()=>window.HERO_K||1;
const TEMPO=()=>typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0?ACTION_TEMPO:.75;
const at=(a,t,f)=>{a.events.push({t:Math.max(0,t),f:safe('ev',f)});};            /* runs after the skill's own event at the same action time */
const first=(a,t,f)=>{a.events.unshift({t:Math.max(0,t),f:safe('ev',f)});};      /* runs before it */
const pre=(a,lead,f)=>{const T=a.windup||0,t=Math.max(0,T-lead*TEMPO());first(a,t,()=>f(Math.max(.03,(T-t)/TEMPO())));};   /* f(seconds left until the release) */
const hand=()=>[player.x+Math.cos(player.phi)*8,player.y+Math.sin(player.phi)*8,(player.z||0)+34*HK()];
const zOf=e=>e?(e.boss?40:26)*(e.sc||1)+(e.z||0):26;
const topZ=e=>e?(e.boss?72:52)*(e.sc||1)+(e.z||0):52;
const nearE=(x,y,r)=>{let b=null,d=r==null?36:r;for(const e of enemies){if(e.dead)continue;const q=Math.hypot(e.x-x,e.y-y);if(q<d){d=q;b=e;}}return b;};
const tgtOf=(k,c)=>{const r=(UK[k]&&UK[k].range)||200,cd=ANU.cond;if((k==='abJudge'||k==='abHall'||k==='acVerdict')&&cd&&!cd.dead&&dist(player,cd)<r+cd.r)return cd;return uTgt(c,r);};
const SC={};function S1(l){l=l||'top';const k=l+'|'+(window.SKCTX||'');let s=SC[k];if(!s||!fx.includes(s))s=SC[k]=sys(l);s.keep=s.t+.4;return s;}
const grab=fn=>{const h={parts:[],dead:0};K_.run(h,fn);return h.parts.filter(p=>p.life>=50);};
/* a picture at a world point */
function pic(im,x,y,z,w,o){o=o||{};const s=P(x,y,z),h=w*im.height/im.width;ctx.save();if(o.a!=null)ctx.globalAlpha*=cl(o.a,0,1);ctx.translate(s[0],s[1]);if(o.rot)ctx.rotate(o.rot);if(o.flip)ctx.scale(-1,1);ctx.drawImage(im,-w*(o.ax==null?.5:o.ax),-h*(o.ay==null?.5:o.ay),w,h);ctx.restore();}
/* a chain of gold links between two world points [x,y,z] (every other link is seen edge-on) */
function chain(a,b,o){o=o||{};const p=P(a[0],a[1],a[2]),q=P(b[0],b[1],b[2]),dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);if(L<5)return;const st=o.step||8.5,n=Math.max(2,Math.round(L/st)),sag=(o.sag||0)*L,im=spr('link',o.pal||'gold'),w=o.w||11,h=w*im.height/im.width,an=Math.atan2(dy,dx);
  ctx.save();if(o.a!=null)ctx.globalAlpha*=cl(o.a,0,1);for(let i=0;i<=n;i++){const u=i/n,sw=Math.sin(u*Math.PI),x=p[0]+dx*u,y=p[1]+dy*u+sw*sag+(o.amp?Math.sin(u*8+(o.wave||0))*o.amp*sw:0);ctx.save();ctx.translate(x,y);ctx.rotate(an);if(i%2)ctx.scale(1,.5);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}ctx.restore();}
/* a crescent of light on a level circle round a point (the wake of a ball that keeps turning) */
function ribbon(cx,cy,z,r,a0,a1,w,p,al){const N=14,poly=(wk,gr)=>{ctx.beginPath();for(let i=0;i<=N;i++){const th=lerp(a0,a1,i/N),q=P(cx+Math.cos(th)*(r+gr),cy+Math.sin(th)*(r+gr),z);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}
      for(let i=N;i>=0;i--){const u=i/N,th=lerp(a0,a1,u),rr=r-w*wk*Math.pow(u,1.3)-gr,q=P(cx+Math.cos(th)*rr,cy+Math.sin(th)*rr,z);ctx.lineTo(q[0],q[1]);}ctx.closePath();};
  ctx.save();ctx.globalAlpha*=al;ctx.save();ctx.translate(1.5,2.5);poly(1.14,2);ctx.fillStyle=rgba(p[0],.4);ctx.fill();ctx.restore();poly(1,0);ctx.fillStyle=p[1];ctx.fill();poly(.7,0);ctx.fillStyle=p[2];ctx.fill();poly(.42,0);ctx.fillStyle=p[3];ctx.fill();poly(.17,0);ctx.fillStyle=p[4];ctx.fill();ctx.restore();}
/* a sandstorm lying on the ground: long tapering bands turning round a centre — the body of every spin */
function stormFloor(o){const p=pal(o.pal||'sand'),N=o.n||6,B=[];for(let i=0;i<N;i++)B.push({r:lerp(.34,.98,(i+.5)/N)+R_(-.04,.04),a:R_(0,TAU),len:R_(1.5,2.6),sp:(o.spin||7)*R_(.8,1.25),w:R_(.7,1.3)});
  return A(new Fn({layer:'ground',follow:o.follow,x:o.x,y:o.y,life:o.life||99,until:o.until,fi:o.fi||.25,fo:.3,d(q){const c=q.pos(),s=P(c[0],c[1],0),a=q.fade()*(o.a||.8),R=o.R;ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.lineCap='round';
      for(const b of B){const a1=b.a+q.t*b.sp,M=6,rr=R*b.r;for(let j=0;j<M;j++){const u0=j/M,u1=(j+1)/M,w=(o.w||9)*b.w*(.25+.75*u1),t0=a1-b.len*(1-u0),t1=a1-b.len*(1-u1)+.03;ctx.globalAlpha=a*u1*u1;
          ctx.lineWidth=w+3;ctx.strokeStyle=rgba(p[0],.36);ctx.beginPath();ctx.arc(0,2.5,rr,t0,t1);ctx.stroke();ctx.lineWidth=w;ctx.strokeStyle=p[j>M-3?3:2];ctx.beginPath();ctx.arc(0,0,rr,t0,t1);ctx.stroke();}}
      ctx.restore();}}));}
/* the flail swinging once round the hero: a crescent (FXLIB Arc), the ball at its head, the chain from the hand.
   level swings give world angles a0 → a1; overhead ones give phi + tilt and angles in the swing's own plane */
function swing(o){const d=Object.assign({R:70,w:20,dur:.14,pal:'gold',ball:8,tilt:0,phi:0},o),p=pal(d.pal),im=d.sun?spr('sun','sun'):spr('anFlail',d.pal==='duat'?'duat':'gold');
  const arc=A(new Arc({el:d.pal,follow:player,x:player.x,y:player.y,z:d.z==null?30*HK():d.z,phi:d.tilt?d.phi:0,R:d.R,w:d.w,a0:d.a0,a1:d.a1,tilt:d.tilt,swing:d.dur,life:d.dur+.15,ease:d.ease||(t=>t),glint:0}));
  A(new Fn({layer:'top',life:d.dur+.06,fi:.02,fo:.06,d(q){const h=arc.head(),s=P(h[0],h[1],h[2]),a=q.fade();chain(hand(),h,{a});glowAt(s[0],s[1],d.ball*2.8,p[2],.55*a);drawSpr(im,s[0],s[1],d.ball*3.5,q.t*18,a);}}));return arc;}
const mark=()=>{AV.pre=gameTime;};
/* a jackal shade running / leaping from one point to another */
function jackalRun(sx,sy,ex,ey,T,o){o=o||{};const im=spr('anJackal',o.pal||'duat'),a=P(sx,sy,0),b=P(ex,ey,0),left=b[0]<a[0],w=(o.w||60)*HK(),tilt=Math.atan2(b[1]-a[1],Math.abs(b[0]-a[0])||1)*.6;
  const ov=o.over==null?.16:o.over;ex+=(ex-sx)*ov;ey+=(ey-sy)*ov;
  return A(new Fn({layer:'sorted',x:sx,y:sy,life:T,fi:.02,fo:T*.3,d(q){const u=cl(q.t/T,0,1),f=q.fade();q.y=lerp(sy,ey,u);for(const [g,al] of [[.24,.16],[.12,.32],[0,1]]){const v=Math.max(0,u-g),z=(o.z||6)+Math.sin(v*Math.PI)*(o.arc||0),px=lerp(sx,ex,v),py=lerp(sy,ey,v);
        if(!g){const s=P(px,py,z+w*.22);glowAt(s[0],s[1],w*.7,o.glow||pal(o.pal||'duat')[2],.4*f);}
        pic(im,px,py,z,w,{flip:left,rot:(left?-1:1)*(tilt-Math.cos(v*Math.PI)*(o.arc?.5:0)),a:al*f,ay:.8});}}}));}
/* the balance: post, beam (tilt in radians, + = the heart side drops), two pans with the heart and the feather */
function drawScales(sx,sy,k,tilt,a,glow){const g=G,H=100*k,bw=44*k,py=sy-H*.86;ctx.save();ctx.globalAlpha*=a;if(glow)glowAt(sx,sy-H*.6,H*.9,g[2],.25);
  const gr=ctx.createLinearGradient(sx-4*k,0,sx+4*k,0);gr.addColorStop(0,g[1]);gr.addColorStop(.5,g[3]);gr.addColorStop(1,g[1]);ctx.fillStyle=gr;ctx.fillRect(sx-2.6*k,py,5.2*k,H*.86);
  ctx.fillStyle=g[1];ctx.beginPath();ctx.moveTo(sx-16*k,sy);ctx.lineTo(sx-6*k,sy-9*k);ctx.lineTo(sx+6*k,sy-9*k);ctx.lineTo(sx+16*k,sy);ctx.closePath();ctx.fill();ctx.fillStyle=g[2];ctx.fillRect(sx-12*k,sy-3.4*k,24*k,3.4*k);
  drawSpr(spr('anAnkh','gold'),sx,py-10*k,13*k,0);
  const c=Math.cos(tilt),s=Math.sin(tilt),ends=[[-1,'heart','duat'],[1,'anMaat','holy']];ctx.strokeStyle=g[1];ctx.lineWidth=5*k;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-bw*c,py+bw*s);ctx.lineTo(sx+bw*c,py-bw*s);ctx.stroke();ctx.strokeStyle=g[3];ctx.lineWidth=2.4*k;ctx.stroke();
  for(const [sd,it,pl] of ends){const ex=sx+sd*bw*c,ey=py-sd*bw*s,pyy=ey+34*k;ctx.strokeStyle=rgba(g[2],.95);ctx.lineWidth=1.3*k;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-15*k,pyy);ctx.moveTo(ex,ey);ctx.lineTo(ex+15*k,pyy);ctx.stroke();
    const im=spr(it,pl);drawSpr(im,ex,pyy-(it==='heart'?5:13)*k,(it==='heart'?15:9)*k,it==='heart'?0:.2);drawSpr(spr('anPan','gold'),ex,pyy+3*k,36*k,0);}ctx.restore();}

/* ---------------------------------------------------------------------
   2. hit sparks and the pieces the game's own calls turn into
   --------------------------------------------------------------------- */
function hitFx(e,big,kind){if(!e)return;if(e._avT===gameTime&&!big)return;e._avT=gameTime;const x=e.x,y=e.y,z=zOf(e),s=big?.95:.62,S=S1();
  if(kind==='B'){burst('duat',x,y,z,s*.9,{n:big?9:7,life:.2});flash('duat',x,y,z,s*.75,{life:.14});bits(S,'duat',x,y,z,big?7:4,{size:s});if(big)ring('duat',x,y,40,{w0:5,life:.28});}
  else if(kind==='G'){burst('gold',x,y,z,s,{n:10,life:.22});flash('gold',x,y,z,s*.85,{life:.15});bits(S,'duat',x,y,z,6,{size:s});glints(S,G[3],x,y,z,4,24,.5);ring('duat',x,y,46,{w0:5,life:.3});}
  else{burst('gold',x,y,z,s*.85,{n:big?9:7,life:.2});flash('gold',x,y,z,s*.7,{life:.14});sparks(S,G[3],x,y,z,big?9:5,260,130,.35);bits(S,'sand',x,y,z,big?6:3,{size:s,only:0});if(big)ring('gold',x,y,40,{w0:5,life:.28});}}
window.uPow=safe('pow',function(e,big,col){const k=window.SKCTX,b=k?uCol(k):'';hitFx(e,big,(col===UC.blue||col==='#6a4aa8')?'B':(col===UC.gold&&b==='B')?'G':'A');});
/* hits that the game marks with nothing of their own (ticks, areas) */
const SELFHIT={aaSpin:'A',aaWheel:'S',acDevil:'A',aaCyclone:'A',aaFlare:'S',acFrenzy:'A',anSpike:'A',aaShock:'A',aaMeteor:'A',acTwinMeteor:'A',acWrath:'S',abBind:'B',abVerdict:'G',abSeal:'G'};
{const UH=window.uHit;window.uHit=function(e,mult,key,o){const r=UH.apply(this,arguments);try{if(e&&r){const k=SELFHIT[key];
      if(key==='aaRicochet'&&AV.lasso){const L=AV.lasso;A(new Streak({el:'gold',x:L.x,y:L.y,x2:e.x,y2:e.y,z:30,z2:zOf(e),w:7,life:.2,go:.45}));}
      else if(k&&gameTime-(e._avS||-9)>.11){e._avS=gameTime;const x=e.x,y=e.y,z=zOf(e),S=S1();if(k==='S'){flash('sun',x,y,z,.45,{life:.13});bits(S,'sun',x,y,z,3,{size:.9});}else if(k==='B'||k==='G')hitFx(e,false,k);else{flash('gold',x,y,z,.42,{life:.12});sparks(S,G[3],x,y,z,3,220,110,.3);bits(S,'sand',x,y,z,3,{size:.85});}}}}catch(_){}return r;};}
function sandBurst(x,y,R){ring('sand',x,y,R,{w0:10,life:.36});dust({},x,y,R*.4,8,32);}
function spikeRing(x,y,R){swing({R:R*.92,a0:player.phi,a1:player.phi+TAU,dur:.18,w:22,ball:8});ring('gold',x,y,R,{w0:7,life:.34});lite('gold',x,y,R,.35,.4);dust({},x,y,R*.4,6,24);
  for(let i=0;i<4;i++){const a=player.phi+i*TAU/4+.4;A(new Spr({im:spr('anAnkh','gold'),x:x+Math.cos(a)*R*.85,y:y+Math.sin(a)*R*.85,z:12,vz:60,w:15,life:.5,pop:.12,s0:.3,s1:1,fo:.3,delay:i*.03,layer:'top'}));}}
function slamFx(x,y,R,key){const S=S1();dark(x,y,R*.42,1.6,.3);A(new Crack({el:'gold',x,y,r:R*.72,n:7,life:1.7,w:3.4}));ring('gold',x,y,R,{w0:12,life:.4});ring('sand',x,y,R*.72,{w0:6,delay:.06,life:.32});lite('gold',x,y,R*.9,.45,.6);
  A(new Burst({el:'gold',x,y,z:10,r:44,n:10,flat:1,life:.26}));A(new Flash({el:'gold',x,y,z:16,s0:24,s1:100,life:.2}));A(new Sigil({tex:ART.ring('ankh','gold'),el:'gold',x,y,r:R*.46,rot:0,spin:0,life:1.9,fi:.08,fo:.8,a:1}));
  bits(S,'sand',x,y,6,14,{up:1.3,size:1.2});bits(S,'earth',x,y,6,8,{up:1.2});dust({},x,y,R*.5,7,34,20);}
function shockRing(x,y,r0,r1){A(new Ring({el:'gold',x,y,r0,r1,w0:12,w1:2,life:.36}));A(new Ring({el:'sand',x,y,r0:r0*.9,r1:r1*.94,w0:5,w1:1,life:.4,delay:.04}));dust({},x,y,r0*.62,10,30);bits(S1(),'sand',x,y,4,10,{sp:1.5,up:.7});}
function cycloneFx(x,y,R){const n=AV.mom0||0,tp={el:'sand',follow:player,x,y,r0:22,r1:R*.6,h:100+n*16,life:.8,fi:.12,fo:.3,spin:13};A(new Tornado(Object.assign({half:-1},tp)));A(new Tornado(Object.assign({half:1},tp)));
  stormFloor({follow:player,x,y,R,life:.85,fi:.08,n:8,w:11,spin:11});swing({R:R*.7,a0:player.phi,a1:player.phi+TAU*2,dur:.4,w:30,ball:10});ring('sand',x,y,R,{w0:14,life:.45});ring('gold',x,y,R*.8,{w0:7,delay:.07,life:.4});lite('gold',x,y,R,.5,.5);dust({},x,y,R*.5,14,46,24);
  const S=S1();bits(S,'sand',x,y,10,18+n*3,{sp:1.6,up:1.1,size:1.2});if(n>=3)glints(S,G[3],x,y,30,8+n,R*.6,.8);}
function devilSpawn(x,y,R){ring('sand',x,y,R,{w0:9,life:.4});dust({},x,y,R*.3,8,30);bits(S1(),'sand',x,y,6,10,{sp:1.2,up:1.2});}
/* rays of the sun lying on the ground */
function sunRays(x,y,R,life,pl){const p=pal(pl||'sun'),n=14,ph=R_(0,TAU);return A(new Fn({layer:'ground',x,y,life,fi:.03,fo:life*.6,d(q,k){const s=P(x,y,0),r=R*eO(cl(k/.4,0,1));ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=q.fade()*.7;
      for(let i=0;i<n;i++){const a=ph+i*TAU/n,L=r*(i%2?.72:1),hw=.07;const g=ctx.createLinearGradient(0,0,Math.cos(a)*L,Math.sin(a)*L);g.addColorStop(0,rgba(p[4],.9));g.addColorStop(.5,rgba(p[2],.6));g.addColorStop(1,rgba(p[2],0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a-hw)*L,Math.sin(a-hw)*L);ctx.lineTo(Math.cos(a+hw)*L,Math.sin(a+hw)*L);ctx.closePath();ctx.fill();}ctx.restore();}}));}
function sunBurst(x,y,R,k){const S=S1();A(new Pillar({el:'sun',x,y,w:74*k,h:300,life:.7}));A(new Flash({el:'sun',x,y,z:30,s0:40,s1:170*k,life:.26}));ring('sun',x,y,R,{w0:18,life:.5});ring('gold',x,y,R*.7,{w0:9,delay:.08,life:.42});lite('sun',x,y,R,.6,.75);
  A(new Burst({el:'sun',x,y,z:26,r:80*k,n:14,life:.34,inner:.42}));sunRays(x,y,R*.95,.6);bits(S,'sun',x,y,14,26,{sp:1.8,up:1.2,size:1.3});puffs(S,'sun',x,y,20,8,70,110,50,.45);dark(x,y,R*.4,1.8,.32);
  for(let i=0;i<10;i++){const a=i/10*TAU+R_(-.2,.2);A(new Flames({el:'sun',x:x+Math.cos(a)*R*.6,y:y+Math.sin(a)*R*.58,h:R_(30,50),w:24,n:3,life:R_(.6,.95),delay:.05}));}}
function solarFlare(x,y){sunBurst(x,y,UK.aaFlare.R,1);}
function wrathLand(x,y){const R=UK.acWrath.R;sunBurst(x,y,R,1.25);A(new Crack({el:'sun',x,y,r:R*.7,n:8,life:1.8,w:3.8}));A(new Sigil({tex:ART.ring('ankh','sun'),el:'sun',x,y,r:R*.34,rot:0,spin:0,life:1.6,fi:.06,fo:.8,a:.9}));bits(S1(),'earth',x,y,8,12,{up:1.4,size:1.2});dust({},x,y,R*.5,12,46,24);}
function wrathThrow(x,y){const hd=hand(),R=UK.acWrath.R,S=S1();A(new Streak({el:'sun',x:hd[0],y:hd[1],x2:hd[0],y2:hd[1],z:hd[2],z2:hd[2]+280,w:12,life:.22}));flash('sun',hd[0],hd[1],hd[2],1);
  A(new Sigil({tex:ART.ring('sun','sun'),el:'sun',x,y,r:R*.9,life:1.1,spin:.9,fi:.3,fo:.5}));A(new Tele({el:'sun',x,y,r:R,life:.35}));
  A(new Proj({el:'sun',x:x+80,y:y-10,z:470,x2:x,y2:y,z2:14,T:.35,ease:eI,r:30,trail:.2,tw:1,spin:7,head:spr('sun','sun'),hw:1.45,emit(p){bits(S,'sun',p.cx,p.cy,p.cz,1,{size:1.1,sp:.3,up:.2});}}));}
/* Underworld Gate */
function gateIn(x,y){const alive=()=>ANU.gateT>gameTime,T=UK.abGate.T+.3,S=S1();A(new Disc({x,y,r0:44,life:T,kind:'pool',add:0,col:'#07030f',a:.8,fi:.1,fo:.25,until:alive}));A(new Ring({el:'duat',x,y,r0:40,r1:40,w0:4,w1:4,life:T,style:'dash',hold:1,spin:-6,until:alive}));
  A(new Sigil({tex:ART.ring('duat','duat'),el:'duat',x,y,r:38,spin:-2.4,life:T,until:alive,fi:.15,fo:.2,a:.85}));ring('duat',x,y,62,{w0:6,life:.3});bits(S,'duat',x,y,10,10,{up:1.2});
  A(new Emit({life:T,until:alive,every:.07,fn(){const a=R_(0,TAU);bits(S1(),'duat',x+Math.cos(a)*30,y+Math.sin(a)*26,2,1,{only:Math.random()<.5?0:1,size:.9,sp:.2});}}));}
function gateOut(x,y){const S=S1();A(new Spr({im:spr('anGate','duat'),x,y:y-3,w:74*HK(),ay:.985,layer:'sorted',sortOff:-3,life:.95,pop:.2,s0:.15,s1:1,fo:.45}));A(new Disc({x,y,r0:46,life:.8,kind:'pool',add:0,col:'#07030f',a:.7,fi:.05,fo:.5}));
  ring('duat',x,y,72,{w0:8,life:.36});flash('duat',x,y,30,1.3);lite('duat',x,y,70,.5,.6);bits(S,'duat',x,y,8,12,{up:1.3,size:1.1});}
/* Avatar of Anubis: the god rises behind him once */
function avatarBurst(x,y,R){const U=spr('anHeadU','gold'),Lw=spr('anHeadL','gold'),hg=ART.HINGE,k=1.55*HK(),dir=Math.cos(player.phi)<0?-1:1,S=S1();ring('gold',x,y,R,{w0:14,life:.5});ring('sand',x,y,R*.7,{w0:6,delay:.08,life:.4});lite('gold',x,y,R,.7,.6);
  A(new Flash({el:'gold',x,y,z:40,s0:30,s1:130,life:.26}));sunRays(x,y,R*1.1,.8,'gold');glints(S,G[3],x,y,30,14,R*.6,1);bits(S,'sand',x,y,8,12,{sp:1.4,up:1});
  A(new Fn({layer:'sorted',follow:player,sortOff:-4,life:1.6,fi:.3,fo:.6,d(q,kk){const a=q.fade()*.85,s=P(player.x-dir*10,player.y,(player.z||0)+50*HK()+26*eO(kk));ctx.save();ctx.globalAlpha*=a;ctx.translate(s[0],s[1]);ctx.scale(dir*k,k);
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.5;ctx.drawImage(tex('glow',G[2]),-110,-120,230,220);ctx.restore();ctx.save();ctx.rotate(.06);ctx.drawImage(Lw,-6,-8,ART.JAW[0],ART.JAW[1]);ctx.restore();ctx.drawImage(U,-hg[0],-hg[1],ART.HEAD[0],ART.HEAD[1]);ctx.restore();}}));}

/* ---------------------------------------------------------------------
   3. B — Judge of the Dead
   --------------------------------------------------------------------- */
function rootChains(e,T,n){const t1=gameTime+T,alive=()=>!e.dead&&gameTime<t1,rr=(e.r||16)+24,z1=zOf(e),ph=R_(0,TAU);A(new Ring({el:'duat',x:e.x,y:e.y,r0:rr+30,r1:rr,w0:2,w1:6,life:.3,ease:0}));
  A(new Ring({el:'duat',follow:e,r0:rr,r1:rr,w0:3,w1:3,life:T+.2,style:'dash',hold:1,spin:2,until:alive}));
  A(new Fn({layer:'sorted',follow:e,sortOff:2,life:T+.25,fi:.01,fo:.2,until:alive,d(q){const g=eO(cl(q.t/.14,0,1)),a=q.fade(),jit=Math.sin(q.t*42)*.7;for(let i=0;i<n;i++){const an=ph+i*TAU/n,ax=e.x+Math.cos(an)*rr,ay=e.y+Math.sin(an)*rr*.9,bx=e.x-Math.cos(an)*4+jit,by=e.y-Math.sin(an)*3;
        chain([ax,ay,0],[lerp(ax,bx,g),lerp(ay,by,g),z1*g],{a,sag:.04,w:12.5,step:9.5});}const s=P(e.x,e.y,z1);glowAt(s[0],s[1],26,DU[2],.35*a);},
    onEnd(){const S=S1();for(let i=0;i<qn(6);i++)S.add({im:spr('link','gold'),x:e.x,y:e.y,z:z1,vx:R_(-90,90),vy:R_(-60,60),vz:R_(60,160),g:520,dr:1.5,s0:10,life:R_(.4,.7),rot:R_(0,TAU),vr:R_(-10,10),fo:.3});}}));
  flash('duat',e.x,e.y,z1,.9);bits(S1(),'duat',e.x,e.y,z1,5,{size:.9});}
function crushFall(t,L){if(!t||t.dead)return;const im=spr('anFlail','duat');A(new Fn({layer:'top',follow:t,life:L+.08,fi:.02,fo:.06,d(q){const u=eI(cl(q.t/L,0,1)),zt=topZ(t)+2,z=lerp(zt+150,zt,u),s=P(t.x,t.y,z),a=q.fade();
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.55*a*u;const g=ctx.createLinearGradient(0,s[1]-130,0,s[1]);g.addColorStop(0,rgba(DU[2],0));g.addColorStop(1,rgba(DU[3],.9));ctx.fillStyle=g;ctx.fillRect(s[0]-9,s[1]-130,18,130);ctx.restore();
      chain([t.x,t.y,z+96],[t.x,t.y,z],{a});glowAt(s[0],s[1],40,DU[2],.6*a);drawSpr(im,s[0],s[1],46,q.t*10,a);}}));}
function featherFall(e,T){const im=spr('anMaat','holy');A(new Spr({im,follow:e,z:topZ(e)+46,vz:-22,w:13,life:Math.max(.5,T),fi:.15,fo:.3,wr:.35,wf:3,layer:'top',glow:'#ffffff',gk:1.2}));glints(S1(),'#ffffff',e.x,e.y,topZ(e)+10,5,16,.8);}
function crushLand(x,y){const e=nearE(x,y,30),z=zOf(e),S=S1();burst('duat',x,y,z+8,1.4,{n:10});flash('duat',x,y,z+8,1.4);ring('duat',x,y,54,{w0:8,life:.32});ring('gold',x,y,34,{w0:4,delay:.05,life:.26});lite('duat',x,y,60,.4,.6);
  A(new Spr({im:spr('heart','duat'),x,y,z,w:26,life:.42,pop:.1,s0:.4,s1:1.3,fo:.25,layer:'top',glow:DU[2]}));after(.1,()=>bits(S,'duat',x,y,z,8,{only:0,size:1,sp:1.2}));bits(S,'sand',x,y,4,6,{size:.9});dust({},x,y,16,5,22);
  if(e&&uSinOf(e)>=3&&uL('abFeather'))featherFall(e,uLv(UK.abFeather.stun,'abFeather'));}
function miniScales(t,L){if(!t||t.dead)return;A(new Fn({layer:'top',follow:t,life:L+.5,fi:.08,fo:.25,d(q){const s=P(t.x,t.y,topZ(t)+16),u=cl(q.t/L,0,1);drawScales(s[0],s[1],.82,.34*eO(u)+(q.t>L?.06*Math.sin((q.t-L)*40)*Math.exp(-(q.t-L)*9):0),q.fade(),1);}}));}
function panFall(x,y,L,e){const im=spr('anPan','gold');A(new Fn({layer:'top',x,y,life:L+.2,fi:.02,fo:.18,d(q){const ok=e&&!e.dead,u=eI(cl(q.t/L,0,1)),zt=(ok?topZ(e):52)-6,s=P(ok?e.x:x,ok?e.y:y,lerp(zt+180,zt,u)),a=q.fade();ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(G[2],.95);ctx.lineWidth=1.6;
      for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(s[0]+sd*25,s[1]);ctx.lineTo(s[0],s[1]-52);ctx.stroke();}ctx.restore();glowAt(s[0],s[1],46,G[2],.4*a);drawSpr(im,s[0],s[1]+4,60,0,a);}}));}
function judgeStrike(x,y,n){const e=nearE(x,y,30),S=S1(),w=40+n*10,R0=(e?e.r:16)+34+n*8;A(new Pillar({el:'gold',x,y,w,h:290,life:.55}));A(new Sigil({tex:ART.ring('duat','duat'),el:'duat',x,y,r:R0,life:.9,spin:1.2,fi:.1,fo:.4}));
  ring('gold',x,y,R0*1.5,{w0:10,life:.4});ring('duat',x,y,R0,{w0:6,delay:.06,life:.34});lite('gold',x,y,R0*1.4,.5,.7);A(new Burst({el:'gold',x,y,z:20,r:40+n*6,n:10,life:.3}));
  for(let i=0;i<n;i++){const a=-Math.PI/2+i*TAU/3;A(new Flames({el:'duat',x:x+Math.cos(a)*R0*.6,y:y+Math.sin(a)*R0*.58,h:44,w:20,n:2,life:.7,fo:.3}));}
  glints(S,G[3],x,y,30,8+n*2,40,.8);bits(S,'duat',x,y,16,6+n*3,{size:1.1,up:1.2});if(uL('abVerdict'))after(.3,()=>panFall(x,y,.2,e));}
function verdict2(x,y){burst('gold',x,y,22,1.3,{n:9});flash('gold',x,y,22,1.2);ring('gold',x,y,60,{w0:8,life:.32});bits(S1(),'duat',x,y,16,6,{});dust({},x,y,18,5,22);}
/* Hall of Two Truths */
function hallOn(t){if(!t||t.dead)return;const T=.3+UK.abHall.n*UK.abHall.gap+.6,sp=UK.abHall.sp,H=AV.hall={t0:gameTime,tgt:t,kick:-9,n:0};dark(t.x,t.y,sp*.9,T,.4,{follow:t,fi:.25,fo:.4});
  A(new Sigil({tex:ART.ring('duat','duat'),el:'duat',follow:t,r:sp*.96,spin:.35,life:T,fi:.3,fo:.4}));A(new Ring({el:'gold',follow:t,r0:sp,r1:sp,w0:3,w1:3,life:T,style:'dash',hold:1,spin:.8}));
  A(new Fn({layer:'sorted',follow:t,sortOff:-6,life:T,fi:.3,fo:.4,d(q){const s=P(t.x,t.y-8,0),dk=gameTime-H.kick,tl=Math.min(.36,H.n*.036)+.12*Math.exp(-dk*7)*Math.sin(dk*30);drawScales(s[0],s[1],1.55,tl,q.fade()*.95,1);}}));
  A(new Emit({life:T-.5,every:.09,fn(){const a=R_(0,TAU),d=R_(.3,1)*sp;bits(S1(),'duat',t.x+Math.cos(a)*d,t.y+Math.sin(a)*d*.9,2,1,{only:Math.random()<.6?1:0,size:.9,sp:.2});}}));}
function hallBlow(x,y){const H=AV.hall,S=S1();if(H){H.kick=gameTime;H.n++;}A(new Streak({el:'gold',x,y,x2:x,y2:y,z:210,z2:20,w:15,life:.17,go:.5,head:0}));A(new Spr({im:spr('anFlail','gold'),x,y,z:26,w:38,life:.14,fi:.01,fo:.08,spin:14,layer:'top'}));
  A(new Burst({el:'gold',x,y,z:14,r:30,n:8,flat:1,life:.2}));flash('gold',x,y,22,1);sparks(S,G[3],x,y,20,6,260,130,.35);bits(S,'duat',x,y,14,3,{size:.9});
  for(const q of enemies){if(q.dead||Math.hypot(q.x-x,q.y-y)>UK.abHall.sp+q.r*.5||Math.hypot(q.x-x,q.y-y)<2)continue;flash('duat',q.x,q.y,zOf(q),.6);}}
function hallRing(x,y,r1){ring('gold',x,y,r1,{w0:9,life:.3});ring('duat',x,y,r1*.8,{w0:4,delay:.04,life:.28});}
function sealStamp(x,y){const S=S1();A(new Ring({el:'gold',x,y,r0:190,r1:96,w0:2,w1:9,life:.16,ease:0}));A(new Sigil({tex:ART.ring('seal','gold'),el:'gold',x,y,r:96,rot:0,spin:.15,life:1.5,fi:.1,fo:.6}));A(new Pillar({el:'sun',x,y,w:66,h:300,life:.65}));
  ring('gold',x,y,150,{w0:14,life:.45});ring('sun',x,y,100,{w0:7,delay:.08,life:.4});lite('gold',x,y,140,.6,.75);A(new Burst({el:'gold',x,y,z:24,r:66,n:12,life:.32}));sunRays(x,y,150,.6,'gold');
  for(const [n,sd] of [['anCrook',-1],['anFlailE',1]])A(new Spr({im:spr(n,'gold'),x:x+sd*16,y,z:70,vz:40,w:n==='anCrook'?22:28,rot:sd*.5,life:1,pop:.16,s0:.3,s1:1,fo:.4,glow:G[2],layer:'top'}));
  glints(S,G[3],x,y,30,14,70,.9);bits(S,'duat',x,y,16,10,{up:1.3,size:1.1});}
function pounceFx(sx,sy,ex,ey,t){jackalRun(sx,sy,ex,ey,.16,{pal:'duat',arc:46,w:70});A(new Streak({el:'duat',x:sx,y:sy,x2:ex,y2:ey,z:26,w:14,life:.3,go:.4,head:0}));dust({},sx,sy,18,5,22);after(.14,()=>dust({},ex,ey,18,5,22));
  if(t&&!t.dead){const z=zOf(t);A(new Cut({el:'duat',x:t.x,y:t.y,z,L:64,w:10,ang:.8,life:.24}));A(new Cut({el:'duat',x:t.x,y:t.y,z,L:64,w:10,ang:-.8,life:.24,delay:.04}));
    if(AV.three&&uL('abDoor')){A(new Spr({im:spr('anGate','duat'),x:t.x,y:t.y-4,w:70,ay:.985,layer:'sorted',sortOff:-4,life:.62,pop:.14,s0:.3,s1:1,fo:.35,a:.88}));ring('duat',t.x,t.y,56,{w0:6,life:.3});}}}
function packBite(x,y){const sd=(AV.pk=(AV.pk||0)+1)%2?1:-1;jackalRun(x-sd*64,y-12,x+sd*64,y+8,.15,{pal:'duat',w:54,z:8});A(new Cut({el:'duat',x,y,z:26,L:54,w:9,ang:sd*.5,life:.22}));bits(S1(),'duat',x,y,24,4,{size:.9});}
/* Anubis Verdict: the giant head comes down over the condemned and its jaws shut on the damage frame (T after the cast) */
function verdictOn(t){if(!t||t.dead)return;const dir=t.x>=player.x?1:-1,k=1.25,U=spr('anHeadU','duat'),Lw=spr('anHeadL','duat'),hg=ART.HINGE,T=.3;dark(t.x,t.y,64,1,.45,{fi:.1,fo:.3});
  A(new Fn({layer:'sorted',follow:t,sortOff:5,life:T+.55,fi:.1,fo:.3,d(q){const a=q.fade(),u=cl(q.t/T,0,1),snap=q.t>=T,open=snap?lerp(.55,.03,cl((q.t-T)/.05,0,1)):.25+.3*eO(u),lg=snap?1:eI(u)*.2,s=P(t.x-dir*(64-22*lg),t.y,topZ(t)+58-26*lg);
      ctx.save();ctx.globalAlpha*=a;ctx.translate(s[0],s[1]);ctx.scale(dir*k,k);ctx.rotate(.55);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.45;ctx.drawImage(tex('glow',DU[2]),-80,-110,230,210);ctx.restore();
      ctx.save();ctx.rotate(open);ctx.drawImage(Lw,-6,-8,ART.JAW[0],ART.JAW[1]);ctx.restore();ctx.drawImage(U,-hg[0],-hg[1],ART.HEAD[0],ART.HEAD[1]);ctx.restore();}}));}
function verdictSnap(x,y){const e=nearE(x,y,30),z=zOf(e),S=S1();A(new Burst({el:'duat',x,y,z:z+6,r:60,n:12,life:.32}));A(new Flash({el:'gold',x,y,z:z+6,s0:30,s1:120,life:.24}));A(new Cut({el:'gold',x,y,z:z+4,L:70,w:10,ang:1.35,life:.26}));A(new Cut({el:'gold',x,y,z:z+4,L:70,w:10,ang:-1.35,life:.26}));
  ring('duat',x,y,74,{w0:10,life:.36});ring('gold',x,y,46,{w0:5,delay:.05,life:.3});lite('duat',x,y,80,.5,.7);bits(S,'duat',x,y,z,16,{sp:1.4,up:1.4,size:1.2});dust({},x,y,22,6,26);}
function breakerFx(x,y,phi){const L=UK.acBreaker.len,S=S1(),c=Math.cos(phi),s=Math.sin(phi);A(new Crack({el:'duat',x:x+c*20,y:y+s*20,line:L,phi,life:1.6,w:3.6}));burst('duat',x+c*30,y+s*30,10,1.2,{flat:1});flash('gold',x+c*30,y+s*30,14,1.1);dust({},x+c*30,y+s*30,18,5,24);
  for(let i=1;i<=5;i++){const d=i*L/5;after(i*.05,()=>{const px=x+c*d,py=y+s*d;A(new Gush({el:'duat',x:px,y:py,w:22+i*2,h:54+i*8,life:.5,rise:.08,fall:.25,tip:'flame'}));lite('duat',px,py,40,.4,.5);bits(S,'earth',px,py,4,3,{size:.9,up:1.1});bits(S,'duat',px,py,10,2,{size:.9});puffs(sys('sorted',py+1),F.dust(),px,py,3,1,26,24,16,.5);});}}
function lungeFx(sx,sy,ex,ey){A(new Streak({el:'gold',x:sx,y:sy,x2:ex,y2:ey,z:22*HK(),w:14,life:.3,go:.4,head:0}));A(new Streak({el:'sand',x:sx,y:sy,x2:ex,y2:ey,z:3,w:26,life:.34,go:.45,head:0,layer:'ground'}));jackalRun(sx,sy,ex,ey,.15,{pal:'gold',z:6,w:86,glow:G[2]});
  dust({},sx,sy,22,6,26);for(let i=1;i<=3;i++){const u=i/4;after(u*.1,()=>puffs(sys('sorted',lerp(sy,ey,u)+1),F.dust(),lerp(sx,ex,u),lerp(sy,ey,u),3,1,22,20,14,.5));}}
function leapArc(sx,sy,ex,ey){const p=pal('gold'),d=Math.hypot(ex-sx,ey-sy),H=Math.min(120,40+d*.3);A(new Fn({layer:'top',life:.34,fi:.01,fo:.3,d(q){const N=16,w=15*q.fade();ctx.save();ctx.globalAlpha*=q.fade();for(const [ws,c] of [[1.5,rgba(p[0],.35)],[1,p[1]],[.66,p[2]],[.3,p[4]]]){ctx.beginPath();const up=[],dn=[];
        for(let i=0;i<=N;i++){const u=i/N,x=lerp(sx,ex,u),y=lerp(sy,ey,u),z=20+Math.sin(u*Math.PI)*H,s=P(x,y,z),hw=w*ws*Math.pow(u,1.2)*.5;up.push([s[0],s[1]-hw]);dn.push([s[0],s[1]+hw]);}
        ctx.moveTo(up[0][0],up[0][1]);for(const q2 of up)ctx.lineTo(q2[0],q2[1]);for(let i=N;i>=0;i--)ctx.lineTo(dn[i][0],dn[i][1]);ctx.closePath();ctx.fillStyle=c;ctx.fill();}ctx.restore();}}));dust({},sx,sy,18,5,22);}

/* ---------------------------------------------------------------------
   4. lasting looks (kept alive by the watcher while their state lasts)
   --------------------------------------------------------------------- */
function stdFx(S0){const x=S0.x,y=S0.y,R=UK.anStandard.R,alive=()=>ANU.standard===S0;A(new Sigil({tex:ART.ring('sun','gold'),el:'gold',x,y,r:R*.96,spin:.2,life:99,until:alive,fi:.35,fo:.4,a:.8}));A(new Disc({x,y,r0:R,life:99,until:alive,col:G[2],a:.18,fi:.3,fo:.4}));
  A(new Spr({im:spr('anStd','gold'),x,y:y-14,w:46,ay:.985,layer:'sorted',life:99,until:alive,pop:.25,s0:.2,s1:1,fo:.3,wr:.035,wf:2.2}));
  A(new Fn({layer:'top',x,y:y-14,life:99,until:alive,fi:.3,fo:.3,d(q){const s=P(x,y-14,84);glowAt(s[0],s[1],30+3*Math.sin(q.t*3),G[2],.5*q.fade());starAt(s[0],s[1],20,G[3],.5*q.fade(),q.t*.6);}}));
  A(new Emit({life:99,until:alive,every:.14,fn(){const a=R_(0,TAU),d=Math.sqrt(Math.random())*R*.9;glints(S1(),G[3],x+Math.cos(a)*d,y+Math.sin(a)*d,R_(6,40),1,4,.7);}}));}
function spinFx(o){const wheel=!!o.wheel,R=o.R,pl=wheel?'sun':'gold',p=pal(pl),im=wheel?spr('sun','sun'):spr('anFlail','gold'),alive=()=>ANU.spin===o,rr=R*.8,eye=!wheel&&uL('aaEye');
  A(new Ring({el:pl,follow:player,r0:R,r1:R,w0:3.5,w1:3.5,life:99,style:'dash',hold:1,spin:3,until:alive}));A(new Disc({follow:player,r0:R,life:99,until:alive,col:p[2],a:wheel?.16:.12,fi:.2,fo:.3}));
  stormFloor({follow:player,R,until:alive,pal:wheel?'sun':'sand',n:wheel?5:7,spin:wheel?6:8,a:wheel?.6:.85,w:wheel?8:10});
  if(wheel)A(new Sigil({tex:ART.ring('sun','sun'),el:'sun',follow:player,r:R*.86,spin:1.6,life:99,until:alive,fi:.3,fo:.3,a:.7}));
  A(new Fn({layer:'sorted',follow:player,life:99,until:alive,fi:.12,fo:.2,d(q){const a=q.fade(),ang=q.t*(wheel?13:16),cx=player.x,cy=player.y,z=(player.z||0)+30*HK();q.sortOff=Math.sin(ang)<0?-2:2;
      ribbon(cx,cy,z,rr,ang-(wheel?2.4:2),ang,wheel?30:20,p,a);const bx=cx+Math.cos(ang)*rr,by=cy+Math.sin(ang)*rr,s=P(bx,by,z);chain(hand(),[bx,by,z],{a});glowAt(s[0],s[1],wheel?50:24,p[2],.6*a);drawSpr(im,s[0],s[1],wheel?50:30,q.t*(wheel?9:20),a);AV.ball=[bx,by,z];}}));
  A(new Emit({life:99,until:alive,every:.04,fn(){const S=S1();S.add({im:spr('gust','sand'),orb:1,cf:player,cx:player.x,cy:player.y,ang:R_(0,TAU),va:R_(7,10),r:R_(.35,1)*R,z:R_(4,36),vz:R_(0,30),s0:R_(18,30),life:R_(.35,.6),face:1,a0:.8,fi:.08,fo:.3});
      if(wheel&&AV.ball)bits(S,'sun',AV.ball[0],AV.ball[1],AV.ball[2],1,{size:1.1,sp:.4,up:.5});
      if(eye){const a=R_(0,TAU),d=R_(.7,1.2)*R;S.add({im:tex('core',p[3]),x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,z:R_(6,24),to:player,tz:20,s0:7,s1:2,lin:1,life:.3,add:1,str:1.3,fi:.04,fo:.1});}}}));
  A(new Emit({life:99,until:alive,every:.09,fn(){const a=R_(0,TAU),d=R*R_(.7,.98);puffs(sys('sorted',player.y+Math.sin(a)*d+1),wheel?'sun':'sand',player.x+Math.cos(a)*d,player.y+Math.sin(a)*d,3,1,wheel?26:34,40,16,.6);}}));
  if(wheel){A(new Emit({life:99,until:alive,every:.3,fn(){const a=R_(0,TAU),d=R_(.3,.9)*R;A(new Flames({el:'sun',x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,h:R_(24,40),w:20,n:2,life:.7}));}}));}}
function devilFx(D){const alive=()=>ANU.devils.includes(D),R=UK.acDevil.R,tp={el:'sand',follow:D,x:D.x,y:D.y,r0:12,r1:50,h:124,life:99,until:alive,spin:11};A(new Tornado(Object.assign({half:-1},tp)));A(new Tornado(Object.assign({half:1},tp)));
  A(new Ring({el:'sand',follow:D,r0:R,r1:R,w0:3,w1:3,life:99,style:'dash',hold:1,spin:2.4,until:alive,a:.7}));stormFloor({follow:D,R:R*.8,until:alive,n:5,w:7,spin:7});A(new Disc({follow:D,r0:46,life:99,until:alive,kind:'pool',add:0,col:'#000000',a:.22,fi:.2,fo:.3}));
  A(new Emit({life:99,until:alive,every:.05,fn(){const S=S1('top'),g=Math.random()<.4;S.add({im:spr(g?'gust':'rock','sand',Math.random()*3|0),orb:1,cf:D,cx:D.x,cy:D.y,ang:R_(0,TAU),va:R_(6,9),r:R_(8,20),vr2:R_(20,44),z:R_(0,10),vz:R_(70,140),s0:g?R_(16,26):R_(5,9),life:R_(.6,1),face:g?1:0,rot:R_(0,TAU),vr:g?0:R_(-8,8),fo:.4});}}));
  A(new Emit({life:99,until:alive,every:.14,fn(){puffs(sys('sorted',D.y+1),'sand',D.x+R_(-20,20),D.y+R_(-10,10),2,1,30,60,12,.6);}}));}
/* Linen Wraps: three bands of mummy linen wound round the body (far halves behind him, near halves in front), the weave sliding round; two loose ends flutter */
function wrapFx(){const hk=HK(),on=()=>ANU.shield>0&&ANU.shieldUntil>gameTime,L=F.PAL.linen,B=[[14,17,.2,3.2,0],[30,19,-.17,-2.7,1.1],[46,16,.13,3,2.3]];
  for(const half of [-1,1])A(new Fn({layer:'sorted',follow:player,sortOff:half*2,life:99,until:on,fi:.05,fo:.25,d(q){const a=q.fade(),t=q.t;ctx.save();ctx.globalAlpha*=a;ctx.lineCap='butt';
      for(let i=0;i<B.length;i++){const [z,r,tl,sp,ph]=B[i],g=cl((t-i*.09)/.16,0,1);if(g<=0)continue;const s=P(player.x,player.y,(player.z||0)+z*hk),rx=r*hk*(1.5-.5*eO(g)),ry=rx*KY()*.85,a0=half>0?0:Math.PI,a1=a0+Math.PI;
        const arc=(lw,col,dash,off,dy)=>{ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.setLineDash(dash||[]);ctx.lineDashOffset=off||0;ctx.beginPath();ctx.ellipse(s[0],s[1]+(dy||0),rx,ry,tl,a0,a1);ctx.stroke();};
        ctx.globalAlpha=a*g;arc(7.6*hk,rgba(L[0],.6));arc(5.4*hk,half>0?L[2]:L[1]);arc(1.6*hk,half>0?L[4]:L[2],null,0,-1.4*hk);arc(5.4*hk,rgba(L[0],.34),[1.3,7.5],-(t*sp*rx+ph*9));}
      ctx.restore();}}));
  orbit({im:[spr('anLinen','linen',0),spr('anLinen','linen',1)],n:2,r:24*hk,z:32*hk,spin:-2.7,ph:.6,w:20*hk,bob:3,follow:player,life:99,until:on,tiltK:.3});
  A(new Disc({follow:player,r0:34*hk,life:99,until:on,col:G[2],a:.16,fi:.2,fo:.3}));}
function guardFx(){const hk=HK(),on=()=>ANU.guard>0&&ANU.guardUntil>gameTime,im=spr('link','gold'),sh=spr('shield','gold');orbit({im,n:12,r:31*hk,z:28*hk,spin:7,w:13,bob:1,follow:player,life:99,until:on});orbit({im,n:9,r:24*hk,z:44*hk,spin:-6,w:11,bob:1,follow:player,life:99,until:on});
  A(new Ring({el:'gold',follow:player,r0:36*hk,r1:36*hk,w0:2.5,w1:2.5,life:99,style:'dash',hold:1,spin:5,until:on,a:.7}));
  A(new Fn({layer:'top',follow:player,life:99,until:on,fi:.15,fo:.2,d(q){const s=P(player.x,player.y,(player.z||0)+100*CHAR_SCALE*hk),n=ANU.guard;for(let i=0;i<n;i++)drawSpr(sh,s[0]+(i-(n-1)/2)*13,s[1],11,0,q.fade());}}));}
function avatarFx(){const hk=HK(),on=uAvatar;A(new Flames({el:'gold',follow:player,sortOff:-2,h:78*hk,w:42*hk,n:5,life:99,until:on,a:.55,fi:.3,fo:.3}));A(new Sigil({tex:ART.ring('sun','gold'),el:'gold',follow:player,r:40*hk,spin:.6,life:99,until:on,fi:.3,fo:.3,a:.75}));
  A(new Emit({life:99,until:on,every:.16,fn(){const a=R_(0,TAU);glints(S1(),G[3],player.x+Math.cos(a)*24,player.y+Math.sin(a)*18,R_(10,60),1,4,.7);}}));}
function rebirthFx(){const hk=HK(),on=()=>hasBuff('acRebirth'),im=spr('plus','life'),ak=spr('anAnkh','life');A(new Sigil({tex:ART.ring('life','life'),el:'life',follow:player,r:46*hk,spin:.4,life:99,until:on,fi:.3,fo:.3,a:.8}));A(new Disc({follow:player,r0:50*hk,life:99,until:on,col:F.PAL.life[2],a:.16,fi:.3,fo:.3}));
  A(new Emit({life:99,until:on,every:.42,fn(){floaters(S1(),Math.random()<.25?ak:im,player.x,player.y,30,1,{s:11});}}));}

/* ---------------------------------------------------------------------
   5. what each skill adds to its own action
   --------------------------------------------------------------------- */
const CASTPAL={anWraps:'linen',anRite:'life',acRebirth:'life',aaWheel:'sun',acWrath:'sun',abHall:'gold',anStandard:'gold',acAvatar:'gold'};
function gatherFx(k,a){const T=(a.windup||0)/TEMPO();if(T<.1)return;const pl=CASTPAL[k]||(uCol(k)==='B'?'duat':'gold'),p=pal(pl),S=S1();
  A(new Emit({life:T-.06,every:.035,fn(){const hd=hand(),an=R_(0,TAU),d=R_(34,58);S.add({im:tex('core',p[2]),x:hd[0]+Math.cos(an)*d,y:hd[1]+Math.sin(an)*d*.6,z:hd[2]+R_(-20,30),to:{x:hd[0],y:hd[1],z:hd[2]},s0:R_(5,8),s1:2,lin:1,life:R_(.16,.26),add:1,str:1.3,fi:.04,fo:.1});}}));
  A(new Fn({layer:'top',life:T+.04,fi:.08,fo:.05,d(q,kk){const hd=hand(),m=P(hd[0],hd[1],hd[2]),r=(4+10*kk)*(1+.08*Math.sin(q.t*40));glowAt(m[0],m[1],r*2.2,p[2],.55*q.fade());coreAt(m[0],m[1],r,p[2],.9*q.fade());}}));
  at(a,a.windup,()=>{const hd=hand();flash(pl,hd[0],hd[1],hd[2],.8);});}
const HKS={
  anWraps(a){at(a,a.windup,()=>{const S=S1(),x=player.x,y=player.y,hk=HK();ring('gold',x,y,50,{w0:5,life:.36});glints(S,G[3],x,y,34*hk,6,24,.6);for(let i=0;i<qn(14);i++)S.add({im:spr('anLinen','linen',i),orb:1,cf:player,cx:x,cy:y,ang:R_(0,TAU),va:R_(9,13),r:R_(20,30)*hk,vr2:-12,z:R_(0,10),vz:R_(110,190)*hk,s0:R_(22,32),life:R_(.3,.46),fo:.3,rot:R_(-.3,.3),delay:R_(0,.14)});});},
  anRite(a){at(a,a.windup,()=>{const S=S1(),x=player.x,y=player.y,hk=HK();A(new Sigil({tex:ART.ring('life','life'),el:'life',follow:player,r:46*hk,spin:.8,life:1,fi:.15,fo:.4}));ring('life',x,y,60,{w0:6,life:.4});lite('life',x,y,60,.6,.5);
      A(new Spr({im:spr('anAnkh','life'),follow:player,z:96*hk,vz:26,w:18,life:1,pop:.16,s0:.3,s1:1,fo:.4,glow:F.PAL.life[2],gk:1.4,layer:'top'}));floaters(S,spr('plus','life'),x,y,24,7,{s:11,delay:.4});glints(S,F.PAL.life[3],x,y,20,8,26,.8);});},
  anStandard(a){at(a,a.windup,()=>{ring('gold',player.x,player.y,UK.anStandard.R,{w0:9,life:.45});dust({},player.x,player.y,14,5,22);flash('gold',player.x,player.y,80,1.2);});},
  anLunge(){},
  aaSweep(a){const phi=player.phi,R=UK.aaSweep.R;pre(a,.085,L=>{mark();swing({R,a0:phi-Math.PI/2,a1:phi+Math.PI/2,dur:L*2,w:30,ball:10});});
    at(a,a.windup,()=>{for(let i=-2;i<=2;i++){const an=phi+i*.55,x=player.x+Math.cos(an)*R*.82,y=player.y+Math.sin(an)*R*.82;puffs(sys('sorted',y+1),F.dust(),x,y,3,1,26,40,14,.5);}bits(S1(),'sand',player.x+Math.cos(phi)*R*.7,player.y+Math.sin(phi)*R*.7,8,8,{dir:phi,spread:1.2,sp:1.2});});},
  aaLasso(a){at(a,a.windup,()=>{const hd=hand();flash('gold',hd[0],hd[1],hd[2],.8);});},
  aaMeteor(a){first(a,a.windup,()=>{AV.p0=[player.x,player.y];});at(a,a.windup,()=>{const p=AV.p0;if(p&&Math.hypot(player.x-p[0],player.y-p[1])>12)leapArc(p[0],p[1],player.x,player.y);});},
  aaCyclone(a){first(a,a.windup,()=>{AV.mom0=ANU.mom;});},
  aaWheel(a){at(a,a.windup,()=>{const x=player.x,y=player.y;ring('sun',x,y,UK.aaWheel.R,{w0:14,life:.5});A(new Flash({el:'sun',x,y,z:34,s0:30,s1:130,life:.26}));sunRays(x,y,UK.aaWheel.R*.9,.6);bits(S1(),'sun',x,y,20,14,{sp:1.5,up:1.1});});},
  abHook(a){at(a,a.windup,()=>{const hd=hand();flash('duat',hd[0],hd[1],hd[2],.8);});},
  abCrush(a,c){const t=tgtOf('abCrush',c);pre(a,.17,L=>crushFall(t,L));},
  abBind(a,c){const t=tgtOf('abBind',c);at(a,a.windup,()=>{if(t&&!t.dead){const hd=hand();A(new Streak({el:'duat',x:hd[0],y:hd[1],x2:t.x,y2:t.y,z:6,z2:4,w:8,life:.22,go:.5,head:0,layer:'ground'}));}});},
  abPounce(a,c){const t=tgtOf('abPounce',c);first(a,a.windup,()=>{AV.p0=[player.x,player.y];AV.three=!!(t&&uSinOf(t)>=3);});at(a,a.windup,()=>{const p=AV.p0;if(p&&Math.hypot(player.x-p[0],player.y-p[1])>8)pounceFx(p[0],p[1],player.x,player.y,t);});},
  abJudge(a,c){const t=tgtOf('abJudge',c);pre(a,.22,L=>miniScales(t,L));},
  abHall(a,c){const t=tgtOf('abHall',c);at(a,a.windup,()=>hallOn(t));},
  acBreaker(a){const phi=player.phi;pre(a,.1,L=>swing({phi,tilt:1.25,a0:1.35,a1:-1.05,R:70,z:46*HK(),dur:L*2,w:26,ball:10,pal:'duat'}));at(a,a.windup,()=>breakerFx(player.x,player.y,phi));},
  acRebirth(a){at(a,a.windup,()=>{const x=player.x,y=player.y,hk=HK(),S=S1();ring('life',x,y,72,{w0:8,life:.45});flash('life',x,y,36*hk,1.2);bits(S,'linen',x,y,30*hk,8,{sp:1.2});A(new Spr({im:spr('anAnkh','life'),follow:player,z:98*hk,vz:22,w:20,life:1.1,pop:.16,s0:.3,s1:1,fo:.4,glow:F.PAL.life[2],gk:1.4,layer:'top'}));});},
  acWrath(a,c){const pt=uPt(c,UK.acWrath.range);first(a,a.windup,()=>{AV.mom0=ANU.mom;});at(a,a.windup,()=>wrathThrow(pt[0],pt[1]));},
  acVerdict(a,c){const t=tgtOf('acVerdict',c);at(a,a.windup,()=>verdictOn(t));},
  basic(a){const lv=Math.max(1,uL('anFlail')),n=UK.anFlail.chain[lv-1]+(uL('acFrenzy')?1:0),idx=player.basicIdx||0,last=idx===n-1,phi=player.phi,dir=idx%2?-1:1;if(uL('acFrenzy')&&last)return;
    pre(a,.07,L=>{mark();if(last)swing({phi,tilt:1.25,a0:1.35,a1:-1.05,R:66,z:44*HK(),dur:L*2,w:24,ball:9});else swing({R:70,a0:phi-dir*1.1,a1:phi+dir*1.1,dur:L*2,w:18,ball:8});});}};
for(const k in ANU_MAKE){const s=SKILLS[k];if(!s||!s.make||s._av)continue;const mk=s.make;s._av=1;s.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){try{if(a.seq&&a.seq[0]&&a.seq[0].st==='buff')gatherFx(k,a);if(HKS[k])HKS[k](a,c||{});}catch(e){warn(k,e);}}return a;};}
{const MB=mkBasic;mkBasic=function(){const a=MB.apply(this,arguments);if(a&&a.events){try{HKS.basic(a);}catch(e){warn('basic',e);}}return a;};}

/* ---------------------------------------------------------------------
   6. the game's own pieces → the new ones
   --------------------------------------------------------------------- */
window.uBurst=safe('burst',function(x,y,R,col){const k=window.SKCTX;if(AV.inSlam||col===UC.sun)return;if(col==='#6a3aa8')return k==='abGate'?gateIn(x,y):gateOut(x,y);
  if(col===UC.gold)return k==='acAvatar'?avatarBurst(x,y,R):spikeRing(x,y,R);if(k==='aaCyclone')return cycloneFx(x,y,R);if(k==='acDevil')return devilSpawn(x,y,R);sandBurst(x,y,R);});
{const SL=window.uSlam;window.uSlam=function(x,y,R,m,key){AV.inSlam=1;let r;try{r=SL.apply(this,arguments);}finally{AV.inSlam=0;}try{slamFx(x,y,R,key);}catch(e){warn('slam',e);}return r;};}
{const UL=window.uLungeOnce;window.uLungeOnce=function(){const sx=player.x,sy=player.y,r=UL.apply(this,arguments);try{lungeFx(sx,sy,player.x,player.y);}catch(e){warn('lunge',e);}return r;};}
{const UR=window.uRoot;window.uRoot=function(e,T){const r=UR.apply(this,arguments);try{const k=window.SKCTX;if(e&&k!=='abHall')rootChains(e,T,k==='abBind'?4:3);}catch(er){warn('root',er);}return r;};}
function pillarFx(f){const k=window.SKCTX,x=f.x,y=f.y;if(k==='abCrush')return crushLand(x,y);if(k==='abJudge')return f.w>=50?judgeStrike(x,y,Math.round((f.w-50)/10)):verdict2(x,y);if(k==='abPounce')return packBite(x,y);
  if(k==='abHall')return f.col===UC.sun?sealStamp(x,y):hallBlow(x,y);if(k==='acWrath')return wrathLand(x,y);if(k==='acVerdict')return verdictSnap(x,y);if(f.col===UC.sun&&f.w>=110)return solarFlare(x,y);}
function ringFx(f){const k=window.SKCTX;if(k==='aaMeteor')return shockRing(f.x,f.y,f.r0,f.r1);if(k==='abHall')return hallRing(f.x,f.y,f.r1);}
function swingOld(f){if(AV.pre!=null&&gameTime-AV.pre<.4){AV.pre=null;return;}if(window.SKCTX==='aaCyclone')return;const span=Math.abs(f.a1-f.a0);
  if(span>=TAU-.01){swing({R:f.R*.92,a0:f.a0,a1:f.a1,dur:Math.max(.22,f.life),w:26,ball:10});ring('gold',player.x,player.y,f.R,{w0:8,life:.36});dust({},player.x,player.y,f.R*.4,8,28);}
  else swing({R:f.R,a0:f.a0,a1:f.a1,dur:Math.max(.12,f.life*.7),w:f.R>100?30:20,ball:f.R>100?10:8});}
function exFx(f){ring('gold',f.x,f.y,Math.max(40,f.r1||46),{w0:5,life:.4});A(new Spr({im:spr('anAnkh','gold'),follow:player,z:96*HK(),vz:24,w:14,life:.6,pop:.14,s0:.4,s1:1,fo:.3,layer:'top'}));}
const DROP=new Set(['GRing','Impact','USwing','UPillar']),NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},active:false});
const A0=window.addFx;window.addFx=addFx=function(f){if(f&&!(f instanceof K_.Part)&&!(f instanceof K_.Sys)){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(n==='Trail')return {layer:'none',active:true,s:[],add(){},update(){return false;},draw(){}};
    if((n==='GRing'||n==='Impact')&&f.color==='#ffe9a8'){try{if(n==='GRing')exFx(f);else{const p=f.pos||[f.x,f.y,24];flash('gold',p[0],p[1],p[2]||24,.9);}}catch(e){warn('ex',e);}return NOFX();}
    if(n==='RuneCircle'&&f.color==='#6fc8ff'&&player.casting){const k=player.casting.key,b=uCol(k)==='B',pl=CASTPAL[k]||(b?'duat':'gold'),tp=pl==='duat'?'duat':pl==='sun'?'sun':'gold';return A(new Sigil({tex:ART.ring(b?'duat':'sun',tp),el:tp,follow:player,r:46*HK(),spin:1.4,life:f.life||.5,fi:.15,fo:.2,a:.9}));}
    if(mine()&&DROP.has(n)){try{if(n==='UPillar')pillarFx(f);else if(n==='GRing')ringFx(f);else if(n==='USwing')swingOld(f);}catch(e){warn(n,e);}return NOFX();}}
  return A0.apply(this,arguments);};
const EM0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune)$/.test(o.type))return;return EM0.apply(this,arguments);};
/* the lasso / the soul hook: the game's own flying piece (it carries the hits), drawn anew */
{const TU=UThrow.prototype.update;UThrow.prototype.update=function(dt){const hook=this.speed>=900,d0=this.dir,px=player.x,py=player.y;let tg=null,tx=0,ty=0;
    if(hook&&d0>0){tg=nearE(player.x+Math.cos(this.phi)*this.len,player.y+Math.sin(this.phi)*this.len,70);if(tg){tx=tg.x;ty=tg.y;}}
    const r=TU.call(this,dt);
    try{if(d0>0&&this.dir<0){const S=S1();if(hook){if(tg){flash('duat',tx,ty,zOf(tg),1.2);ring('duat',tx,ty,44,{w0:6,life:.3});bits(S,'duat',tx,ty,zOf(tg),8,{size:1});if(Math.hypot(tg.x-tx,tg.y-ty)>10){A(new Streak({el:'duat',x:tx,y:ty,x2:tg.x,y2:tg.y,z:24,w:16,life:.3,go:.4,head:0}));dust({},tg.x,tg.y,14,4,20);}}
          if(Math.hypot(player.x-px,player.y-py)>10){A(new Streak({el:'duat',x:px,y:py,x2:player.x,y2:player.y,z:24*HK(),w:16,life:.3,go:.4,head:0}));dust({},px,py,16,5,22);}}
        else{AV.lasso={x:this.x,y:this.y};flash('gold',this.x,this.y,30,1.1);ring('gold',this.x,this.y,34,{w0:4,life:.26});sparks(S,G[3],this.x,this.y,30,6,220,110,.3);}}
      if(r&&(this._tr=(this._tr||0)+dt)>.028){this._tr=0;bits(S1(),hook?'duat':'sand',this.x,this.y,30*HK(),1,{size:.8,sp:.3,up:.3,only:hook?1:0});}}catch(e){warn('throw',e);}
    return r;};
  UThrow.prototype.draw=function(){try{const hook=this.speed>=900,b=[this.x,this.y,30*HK()],s=P(b[0],b[1],b[2]);
    if(hook){chain(hand(),b,{sag:.015});glowAt(s[0],s[1],30,DU[2],.75);const an=scrAng(this.phi);drawSpr(spr('anHook','gold'),s[0],s[1],28,an);}
    else{chain(hand(),b,{sag:.03,wave:this.t*30,amp:3});const an=scrAng(this.phi)+(this.dir<0?Math.PI:0),L=this.big?70:50,w=this.big?15:11;ctx.save();ctx.translate(s[0],s[1]);ctx.rotate(an);
      for(const [k,c] of [[1,rgba(G[1],.7)],[.68,G[2]],[.32,G[4]]]){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-w*k);ctx.quadraticCurveTo(-L*.5*k,-w*.55*k,-L*k,0);ctx.quadraticCurveTo(-L*.5*k,w*.55*k,0,w*k);ctx.closePath();ctx.fill();}ctx.restore();
      glowAt(s[0],s[1],this.big?50:34,G[2],.55);drawSpr(spr('anFlail','gold'),s[0],s[1],this.big?60:42,this.t*22);}}catch(e){warn('throwDraw',e);}};
  UThrow.prototype.__gt='-';}
/* Chain Guard blocks a blow · the linen shield takes one */
{const PH=window.jgPreHit;window.jgPreHit=function(e){const g0=ANU.guard;window.__ANUGUARD=1;let r;try{r=PH?PH.apply(this,arguments):1;}finally{window.__ANUGUARD=0;}
    try{if(g0>0&&ANU.guard<g0){const an=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,x=player.x+Math.cos(an)*30,y=player.y+Math.sin(an)*30,z=30*HK(),S=S1();burst('gold',x,y,z,1.1,{n:9});flash('gold',x,y,z,1.1);sparks(S,G[3],x,y,z,10,280,140,.4);ring('gold',player.x,player.y,52,{w0:5,life:.28});
        for(let i=0;i<qn(4);i++)S.add({im:spr('link','gold'),x,y,z,vx:Math.cos(an)*R_(40,120)+R_(-40,40),vy:Math.sin(an)*R_(40,120)+R_(-30,30),vz:R_(60,150),g:520,dr:1.5,s0:10,life:R_(.4,.6),rot:R_(0,TAU),vr:R_(-10,10),fo:.3});}}catch(er){warn('guard',er);}return r;};}
{const AB=window.jgAbsorb;window.jgAbsorb=function(d,e){const s0=ANU.shield,r=AB?AB.apply(this,arguments):d;try{if(s0>0&&ANU.shield<s0){const x=player.x,y=player.y,z=30*HK(),S=S1();flash('linen',x,y,z,.9);bits(S,'linen',x,y,z,ANU.shield<=0?10:3,{size:1});if(ANU.shield<=0)ring('linen',x,y,48,{w0:5,life:.3});}}catch(_){}return r;};}

/* ---------------------------------------------------------------------
   7. gauges (Momentum, Sin, the condemned) and the watcher
   --------------------------------------------------------------------- */
UGround.prototype.__gt='-';UTop.prototype.__gt='-';UCore.prototype.__gt='-';
/* a draw that throws would stop the game's frame loop: every replaced draw is guarded (warns once, the canvas state is put back) */
const guardDraw=(k,f)=>function(){ctx.save();try{f.call(this);}catch(e){warn(k,e);}finally{ctx.restore();}};
UGround.prototype.draw=guardDraw('ground',function(){const c=ANU.cond;if(!c||c.dead||!uL('abHook'))return;const im=ART.ring('duat','duat'),r=(c.r||16)+20,s=P(c.x,c.y,0);ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.rotate(this.t*.5);ctx.globalAlpha=.8;ctx.drawImage(im,-r*1.14,-r*1.14,r*2.28,r*2.28);
  ctx.globalCompositeOperation='lighter';const g=tex('core',DU[2]),gr=r*.2;for(let i=0;i<ANU.sin;i++){const a=-Math.PI/2+i*TAU/3,x=Math.cos(a)*r*83/140,y=Math.sin(a)*r*83/140;ctx.globalAlpha=.95;ctx.drawImage(g,x-gr,y-gr,gr*2,gr*2);}ctx.restore();});
UTop.prototype.draw=guardDraw('top',function(){const hk=HK(),t=this.t,s=P(player.x,player.y,(player.z||0)+86*CHAR_SCALE*hk),x=s[0],y=s[1];
  if(uL('aaSweep')){const full=ANU.mom>=ANU_BAL.mom.cap,on=spr('ember',full?'sun':'gold');for(let i=0;i<ANU_BAL.mom.cap;i++){const lit=i<ANU.mom,px=x-18+i*9,py=y-Math.sin(i/4*Math.PI)*3-(lit?(ANU.momPop||0)*2.5:0);
      if(lit){glowAt(px,py,full?9+Math.sin(t*12+i)*1.5:7,full?SU[2]:G[2],.7);drawSpr(on,px,py,full?8:6.5,0);}else{ctx.fillStyle='rgba(30,22,14,.42)';ctx.beginPath();ctx.moveTo(px,py-2.6);ctx.lineTo(px+2.2,py);ctx.lineTo(px,py+2.6);ctx.lineTo(px-2.2,py);ctx.closePath();ctx.fill();}}}
  const c=ANU.cond;if(c&&!c.dead&&ANU.sin>0){const q=P(c.x,c.y,topZ(c)+8),n=ANU.sin;for(let i=0;i<n;i++){const px=q[0]+(i-(n-1)/2)*10,py=q[1]-(ANU.sinPop||0)*3+Math.sin(t*5+i*2)*1.2;glowAt(px,py,9,DU[2],.7);drawSpr(spr('flame','duat',i),px,py-3,8.5,Math.sin(t*7+i)*.12);}
    if(n>=ANU_BAL.sin.cap)starAt(q[0],q[1]-14,9+Math.sin(t*8)*1.5,G[3],.8,t*2);}
  if(ANU.gateT>gameTime){const g2=P(player.x,player.y,(player.z||0)+30*hk);glowAt(g2[0],g2[1],38,DU[1],.45);}});
const LIVE={};
function keep(key,on,mk,id){const cur=LIVE[key];if(on){if(!cur||cur.id!==id||!cur.parts.every(p=>fx.includes(p))){if(cur)cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]={id,parts:grab(mk)};}}else if(cur){cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]=null;}}
function watch(){const S0=ANU.standard,sp=ANU.spin;keep('std',!!S0,()=>stdFx(S0),S0);keep('spin',!!sp,()=>spinFx(sp),sp);keep('wrap',ANU.shield>0&&ANU.shieldUntil>gameTime,wrapFx);keep('guard',ANU.guard>0&&ANU.guardUntil>gameTime,guardFx);keep('avatar',uAvatar(),avatarFx);keep('rebirth',hasBuff('acRebirth'),rebirthFx);
  for(const D of ANU.devils)if(!D._av||!D._av.every(p=>fx.includes(p))){if(D._av)D._av.forEach(p=>p.kill&&p.kill());D._av=grab(()=>devilFx(D));}
  if(ANU.mom>AV.mom){const s=[player.x,player.y,(player.z||0)+86*CHAR_SCALE*HK()];glints(S1(),G[3],s[0],s[1],s[2],2,12,.4);}AV.mom=ANU.mom;
  const c=ANU.cond;if(c&&!c.dead&&c===AV.cond&&ANU.sin>AV.sin){const z=topZ(c)+8;flash('duat',c.x,c.y,z,.7);bits(S1(),'duat',c.x,c.y,z,3,{size:.8,only:1});}AV.cond=c;AV.sin=ANU.sin;}
{const UU=UCore.prototype.update;UCore.prototype.update=function(dt){window.__ANUTICK=1;let r;try{r=UU.call(this,dt);}finally{window.__ANUTICK=0;}const sk=window.SKCTX;window.SKCTX=null;try{watch();}catch(e){warn('watch',e);}finally{window.SKCTX=sk;}return r;};}
AV.ready=1;
})();
