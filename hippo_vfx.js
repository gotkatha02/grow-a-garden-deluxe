/* =====================================================================
   NILE HIPPO (Taweret's Guardian · Egypt) — skill effects v3: code VFX on the FXLIB kit (fxlib.js) + vector art (hippo_art.js)
   + the owner's painted pieces that fit the new look. Owner 2026-11-25 "ทำเอฟเฟคสกิลฮิปโป … มีเอฟเฟคสกิลที่เจนมาค่อนข้างเยอะ
   เลือกใช้เอา หรือถ้าจะให้เจนใหม่ก็ส่งพร้อมมา". Plan + per-skill table: HIPPO_FX_PLAN_TH.md. The game's numbers and hit times are
   not touched (every hit, hit-stop and shake stays where it was).

   LOOK   A "Taweret's Guardian" = bronze mace + gold of Taweret + the ground breaking under a belly that falls from the sky.
          B "Nile Flood Priest"  = mud (glossy globs, splats, crowns) + Nile water (wave walls, geysers, the flood) + lotus pink.
          C by column (Chomp = the hippo's own mouth snapping, Submerge = ears and eyes gliding through the mud, Meteor = burning
          belly, Hapi's jar).
   KEPT PICTURES (assets/fx/hippo): mud ball h02, mud pool h03, geyser h07, lotus h08, lotus burst h09, melon h11, gulp vortex
          h12, Taweret's ward dome h15, behemoth aura h16, the flood h17, Hapi's jar h18 + the cat's cracked ground k_crater for
          the big slams. Dropped for code: mud bits h01, hit star h04, the two waves h05 / h06 (side views that were turned with
          the screen angle), the yawn spiral h14, the burp cloud h13 (turned too), the cat's lava crater, shock ring and dust.
   TIMING the mace's smear lands on the contact frame (it starts a little before the hit) · the jaws of Chomp snap on each bite ·
          slams: the landing shadow grows during the flight and hidden jumps fall out of the sky on the landing frame · casts
          gather their element at the raised mace for the wind-up and flash on the release · hit sparks come from the damage.
   HOOKS  SKILLS[k].make + mkBasic wrapped (extra action events only) · hLand / hBehemothEnd / hSeaEnd wrapped (the game's
          shake / hit-stop / flash kept) · hSplash / hDrops / hDust replaced (visual only) · dashUpd wrapped (sees every jump) ·
          HProj / HWave / HGround / HAura / HOverlay draws replaced (their update = the game, untouched) · jgAfterHurt /
          jgAbsorb wrapped · HCore.update wrapped by a watcher that keeps the lasting looks (nap, shield, gulp hold, behemoth,
          flood, jar, Hapi's bounty, pools) alive while their state lasts, also across a map change.
          Old look off: HImg pictures that were replaced, HBit, GRing / Impact / Crack and round emits while the hippo's code
          runs; HitCrescents, PuffDust and the weapon Trail always. Floating texts (DText) stay.
   ?vfx3=0 = the old look (char_hippo.js pictures only).
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='hippo'||!window.FXLIB||!window.HIPART||/[?&]vfx3=0/.test(location.search))return;
const F=window.FXLIB,K_=F.k,{TAU,cl,lerp,eO,eI,KY,qn,rgba,pal,tex,spr,glowAt,coreAt,starAt,drawSpr,sys,bits,sparks,puffs,glints,A,after,Emit,Fn,Arc,Streak,Ring,Disc,Flash,Burst,Pillar,Gush,Sigil,Crack,Flames,Spike,Cone,orbit,Spr,BIT}=K_;
const R_=K_.R,{scrAng,lite,dark,ring,flash,burst,dust,floaters}=K_.h,ART=window.HIPART;
const HV=window.HIPV={on:1};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('hippo');
try{HPC.hip='#8fe0d4';}catch(_){}            /* the cast rim + jump afterimages: Taweret's teal instead of lilac */
/* debris of the hippo's elements */
BIT.mud=[['mudBlob',{up:[90,230],g:820,sp:170,sz:[9,16],s1:.85,life:[.45,.8],face:1,bounce:.08}],['mudBlob',{up:[50,140],g:820,sp:230,sz:[5,9],life:[.35,.6],face:1,bounce:.08}]];
BIT.nile=BIT.water;BIT.bronze=BIT.steel;BIT.teal=BIT.holy;BIT.pot=[['potBit',{up:[120,260],g:820,sp:190,sz:[9,14],life:[.6,1],spin:12,bounce:.3}],['drop',{up:[120,280],g:800,sp:170,sz:[7,12],s1:.8,life:[.4,.7],face:1}]];
F.PAL.pot=F.PAL.water;
BIT.lotus=[['petal',{up:[60,180],g:150,sp:140,sz:[10,15],life:[.8,1.3],spin:5,wob:10,dr:2}],['star4',{up:[0,50],g:0,sp:70,sz:[8,16],s1:.2,life:[.3,.6],add:1}]];
BIT.melon=[['melonBit',{up:[110,230],g:700,sp:130,sz:[11,16],life:[.55,.9],spin:9,bounce:.3}],['drop',{up:[80,200],g:760,sp:150,sz:[6,10],s1:.8,life:[.4,.7],face:1}]];
BIT.sand=[['rock',{up:[90,230],g:760,sp:170,sz:[4,8],life:[.4,.8],spin:12,bounce:.3}],['gust',{up:[0,30],g:0,sp:200,sz:[14,24],s1:1.3,life:[.22,.4],face:1,dr:3}]];
BIT.life=[['plus',{up:[40,90],g:-20,sp:50,sz:[8,12],s1:.8,life:[.6,1]}],['star4',{up:[10,60],g:-10,sp:80,sz:[10,18],s1:.2,life:[.4,.7],add:1}]];
BIT.burp=[['puff',{up:[10,60],g:-20,sp:120,sz:[14,24],s1:1.4,life:[.4,.7],dr:2.5}],['star4',{up:[0,40],g:0,sp:60,sz:[8,14],s1:.2,life:[.2,.4],add:1}]];
BIT.sleep=[['zzz',{up:[20,50],g:-20,sp:30,sz:[8,12],s1:1.2,life:[.8,1.2],wob:6}],['star4',{up:[0,30],g:0,sp:40,sz:[6,10],s1:.2,life:[.3,.5],add:1}]];
F.dust=()=>/^(vik|snow)/i.test(typeof curMap==='string'?curMap:'')?'cloud':'dust';
const G=F.PAL.gold,WA=F.PAL.water,MU=F.PAL.mud,LO=F.PAL.lotus;
/* ground cracks a little softer than the kit's (the hippo makes many of them) */
class HCrack extends Crack{paint(){ctx.save();ctx.globalAlpha*=this.a==null?.62:this.a;super.paint();ctx.restore();}}
/* the coloured rim and weapon-tip glow the engine draws on the hero during actions: softer, the effects carry the light */
for(const nm of ['drawPlayerAura','drawPlayer']){const f0=window[nm];if(typeof f0!=='function')continue;window[nm]=function(){const g=player.glow;if(!g||!g.k)return f0.apply(this,arguments);const k0=g.k;g.k=k0*.4;try{return f0.apply(this,arguments);}finally{g.k=k0;}};}

/* ---------------------------------------------------------------------
   1. helpers
   --------------------------------------------------------------------- */
const warn=(k,e)=>{if(!HV['_w'+k]){HV['_w'+k]=1;console.warn('hippo fx',k,e);}};
const safe=(k,f)=>function(){try{return f.apply(this,arguments);}catch(e){warn(k,e);}};
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__HIPTICK||HV.inLand);
const HK=()=>window.HERO_K||1;
const HSZ=()=>{try{return hSize();}catch(_){return 1;}};
const BODY=()=>72.5*HK()*HSZ();                                   /* the hippo's standing height in world px (with fullness / Behemoth size) */
const TEMPO=()=>typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0?ACTION_TEMPO:.75;
const at=(a,t,f)=>{a.events.push({t:Math.max(0,t),f:safe('ev',f)});};            /* runs after the skill's own event at the same action time */
const first=(a,t,f)=>{a.events.unshift({t:Math.max(0,t),f:safe('ev',f)});};      /* runs before it */
const pre=(a,lead,f,T)=>{T=T==null?(a.windup||0):T;const t=Math.max(0,T-lead*TEMPO());first(a,t,()=>f(Math.max(.03,(T-t)/TEMPO())));};   /* f(seconds left until T) */
const fwd=(d,sd)=>[player.x+Math.cos(player.phi)*d-Math.sin(player.phi)*(sd||0),player.y+Math.sin(player.phi)*d+Math.cos(player.phi)*(sd||0)];
const mouth=()=>{const b=BODY(),q=fwd(b*.42);return [q[0],q[1],(player.z||0)+b*.4];};
const mace=()=>{const b=BODY(),q=fwd(b*.12);return [q[0],q[1],(player.z||0)+b*1.12];};   /* the mace head, held over the head at the cast peak */
const zOf=e=>e?(e.boss?40:26)*(e.sc||1)+(e.z||0):26;
const topZ=e=>e?(e.boss?72:52)*(e.sc||1)+(e.z||0):52;
const SC={};function S1(l){l=l||'top';const k=l+'|'+(window.SKCTX||'');let s=SC[k];if(!s||!fx.includes(s))s=SC[k]=sys(l);s.keep=s.t+.4;return s;}
const grab=fn=>{const h={parts:[],dead:0};K_.run(h,fn);return h.parts.filter(p=>p.life>=50);};
const guardDraw=(k,f)=>function(){ctx.save();try{f.call(this);}catch(e){warn(k,e);}finally{ctx.restore();}};
/* painted pictures that stay (loaded once; the code look draws until they are in) */
const PSRC={pool:'assets/fx/hippo/h03_pool.webp',ball:'assets/fx/hippo/h02_mudball.webp',geyser:'assets/fx/hippo/h07_geyser.webp',lotus:'assets/fx/hippo/h08_lotus.webp',
  melon:'assets/fx/hippo/h11_melon.webp',gulp:'assets/fx/hippo/h12_gulp.webp',ward:'assets/fx/hippo/h15_ward.webp',aura:'assets/fx/hippo/h16_aura.webp',sea:'assets/fx/hippo/h17_sea.webp',
  jar:'assets/fx/hippo/h18_jar.webp',crater:'assets/fx/cat/k_crater.webp'},PIM={};
const img=n=>{if(!PSRC[n])return null;let o=PIM[n];if(!o){o=PIM[n]=new Image();o.decoding='async';o.src=PSRC[n];}return o.complete&&o.naturalWidth?o:null;};
for(const n in PSRC)img(n);
function picAt(im,sx,sy,w,o){o=o||{};const h=w*im.height/im.width*(o.sq||1);ctx.save();if(o.a!=null)ctx.globalAlpha*=cl(o.a,0,1);if(o.add)ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);if(o.rot)ctx.rotate(o.rot);if(o.fx)ctx.scale(-1,1);ctx.drawImage(im,-w*(o.ax==null?.5:o.ax),-h*(o.ay==null?.5:o.ay),w,h);ctx.restore();}
/* a flat decal on the ground */
function splat(x,y,r,life,pl,n){n=n||1;for(let i=0;i<n;i++){const a=R_(0,TAU),d=i?R_(.35,.75)*r:0;A(new Spr({im:spr('mudSplat',pl||'mud',i%3),x:x+Math.cos(a)*d,y:y+Math.sin(a)*d*.8,w:i?r*R_(.45,.7):r*1.15,flat:1,layer:'ground',life:life||1.8,fi:.04,fo:.7,pop:.1,s0:.4,s1:1,rot:R_(0,TAU),a:.92}));}}
/* a splash crown standing on the ground */
function crown(x,y,w,pl,o){o=o||{};return A(new Spr(Object.assign({im:spr('crown',pl||'water',Math.random()*2|0),x,y,z:o.z||0,w:Math.min(w,64),ay:.9,layer:'sorted',sortOff:1,life:.36,pop:.1,s0:.25,s1:1,fo:.24,a:.92},o)));}

/* ---------------------------------------------------------------------
   2. hits, splashes, drops, dust
   --------------------------------------------------------------------- */
/* hit spark by skill: W water · M mud · S sand · L lotus · G burp gas · T bite · P belly bounce · E slam (the landing draws the rest) · B bronze mace */
const ELK={hbWave:'W',hbWrath:'W',hbGeyser:'W',hbSea:'W',hcJar:'W',hbMud:'M',hbSplash:'M',hbWallow:'M',hcSubmerge:'M',hcSticky:'M',hbQuick:'S',hbLotus:'L',hbLotusStorm:'L',
  haBurp:'G',haGulp:'T',hcChomp:'T',hcGobble:'T',haBelly:'P'};
function hitFx(e,o,crit){if(!e)return;const key=(o&&o.skill)||(o&&o.auto?'basic':null)||window.SKCTX||'basic';if(e._hvT===gameTime)return;e._hvT=gameTime;
  const x=e.x,y=e.y,z=zOf(e),big=!!(o&&(o.big||o.hpSlam))||!!crit,s=big?.9:.62,S=S1(),k=ELK[key]||(o&&o.hpSlam?'E':'B');
  if(k==='W'){crown(x,y+1,(big?50:38)*(e.boss?1.3:1),'water',{life:.34});flash('water',x,y,z,s*.8,{life:.14});bits(S,'water',x,y,z*.7,big?8:5,{size:s,up:1});}
  else if(k==='M'){crown(x,y+1,(big?44:34)*(e.boss?1.3:1),'mud',{life:.34});bits(S,'mud',x,y,z*.7,big?8:5,{size:s*.9,up:.9});if(gameTime-(e._hvS||-9)>.5){e._hvS=gameTime;splat(x,y,(e.r||16)*1.3,1.6);}}
  else if(k==='S'){puffs(sys('sorted',y+1),'sand',x,y,6,2,26,40,12,.6);bits(S,'sand',x,y,z*.5,3,{size:.8,only:0});}
  else if(k==='L'){flash('lotus',x,y,z,s*.85,{life:.15});bits(S,'lotus',x,y,z,big?8:5,{size:s*1.1});starAt(...P(x,y,z),22*s,LO[3],.8,0);}
  else if(k==='G'){puffs(S,'burp',x,y,z,big?5:3,30,90,30,.5);flash('burp',x,y,z,s,{life:.16});}
  else if(k==='T'){burst('white',x,y,z,s*.9,{n:8,life:.2});flash('white',x,y,z,s*.8,{life:.14});sparks(S,'#ffffff',x,y,z,4,200,100,.3);}
  else if(k==='P'){A(new Ring({el:'lotus',x,y,r0:8,r1:44,w0:7,w1:1,life:.3}));burst('lotus',x,y,z,s,{n:7,life:.2});}
  else if(k==='E'){flash(F.dust(),x,y,z,s*.7,{life:.14});bits(S,'earth',x,y,z*.4,3,{size:.8,only:1});}
  else{burst('bronze',x,y,z,s,{n:big?9:7,life:.2});flash('bronze',x,y,z,s*.8,{life:.14});sparks(S,G[3],x,y,z,big?8:5,240,120,.32);bits(S,'earth',x,y,z*.5,big?4:2,{size:.7,only:1});if(big)ring('bronze',x,y,40,{w0:5,life:.26});}}
/* mud thrown about (the game calls hSplash: pools, projectiles, Wallow, Splash, Submerge) */
function mudSplash(x,y,R){R=R||30;const S=S1();if(R<16){bits(S,'mud',x,y,8,1,{size:.7,sp:.35,up:.5});return;}const k=cl(R/60,.5,2.4);
  crown(x,y,42*Math.min(k,1.3),'mud',{life:.5});splat(x,y,R*.8,2,'mud',R>70?3:1);bits(S,'mud',x,y,8,Math.round(6+R/12),{sp:cl(R/60,.6,2),up:1.1,size:cl(k,.7,1.25)});
  A(new Ring({el:'mud',x,y,r0:R*.15,r1:R*1.05,w0:7*Math.min(k,1.5),w1:1.5,life:.34,a:.8}));}
window.hSplash=safe('splash',function(x,y,R){if(HV.inLand)return;mudSplash(x,y,R);});
window.hDrops=safe('drops',function(x,y,z,n,spd){const k=window.SKCTX;if(k==='haBurp')return;if(k==='hbLotus'){if(Math.random()<.5)bits(S1(),'lotus',x,y,z==null?10:z,1,{only:0,size:.7,sp:.3,up:.3});return;}bits(S1(),'water',x,y,z==null?10:z,Math.max(1,Math.round((n||4)*.6)),{sp:cl((spd||120)/170,.3,1.8),up:1,size:.85});});
window.hDust=safe('dust',function(x,y,n,R){n=n||4;R=R||50;dust({},x,y,R*.6,Math.round(n*1.5),Math.max(16,R*.5),10);});

/* ---------------------------------------------------------------------
   3. slams: the jump, the landing, the crater
   --------------------------------------------------------------------- */
/* the owner's painted cracked ground (the cat's k_crater): opens as a growing ellipse, the slabs jolt, fades */
function craterPic(x,y,w,life){A(new Fn({layer:'ground',x,y,life:life||1.7,fi:.01,fo:.6,d(q){const im=img('crater');if(!im)return;const s=P(x,y,0),W=w,H=W*im.height/im.width*1.18,t=q.t,open=eO(cl(t/.12,0,1)),jolt=t<.12?1:1+.07*Math.sin(cl((t-.12)/.16,0,1)*Math.PI);
    ctx.save();ctx.globalAlpha*=q.fade();ctx.translate(s[0],s[1]);ctx.beginPath();ctx.ellipse(0,0,W*.56*open+2,H*.6*open+2,0,0,TAU);ctx.clip();ctx.scale(jolt,2-jolt);ctx.drawImage(im,-W/2,-H*.5,W,H);ctx.restore();}}));}
function footprints(x,y,phi,n,gap,life){const pl=F.dust();for(let i=0;i<n;i++){const sd=i%2?-1:1,d=(i-(n-1)/2)*gap,px=x+Math.cos(phi)*d-Math.sin(phi)*sd*7,py=y+Math.sin(phi)*d+Math.cos(phi)*sd*7;
  A(new Spr({im:spr('hpPrint',pl),x:px,y:py,w:15*HK()/.535,flat:1,layer:'ground',life:life||1.6,fi:.03,fo:.8,rot:phi+Math.PI/2,a:.55,delay:i*.06}));}}
function landFx(x,y,R,big,key){const S=S1(),k=cl(R/110,.55,2.6),dp=F.dust();
  dark(x,y,R*.5,1.6,.3);if(big)craterPic(x,y,R*2.05,key==='haMountain'||key==='behEnd'?2.3:1.75);
  A(new HCrack({el:'earth',x,y,r:R*(big?.9:.7),n:big?9:6,hot:0,life:big?2:1.2,w:big?3:2.2}));
  A(new Ring({el:dp,x,y,r0:R*.15,r1:R*1.05,w0:(big?18:11)*k,w1:2,life:.44}));ring('bronze',x,y,R*.8,{w0:6*k,delay:.04,life:.32});lite('gold',x,y,R*.8,.25,big?.24:.3);
  A(new Burst({el:dp,x,y,z:8,r:30*k,n:10,flat:1,life:.26}));dust({},x,y,R*.5,big?9:5,(big?42:28)*cl(k,.7,1.5),big?16:9);bits(S,'earth',x,y,6,big?16:9,{up:1.2,size:cl(k,.7,1.4)});
  if(big)A(new Flash({el:'gold',x,y,z:14,s0:24,s1:80*k,life:.15}));
  if(hInPool(x,y))mudSplash(x,y,R*1.1);
  const xt=LANDX[key];if(xt)xt(x,y,R,k,S);}
const LANDX={
  haPound(x,y,R,k){const R0=R/.8;footprints(x,y,player.phi+Math.PI/2,2,14*HK()/.535,1.8);A(new Ring({el:F.dust(),x,y,r0:R0*.5,r1:R0,w0:6,w1:1,life:.5,delay:.06}));},
  haMountain(x,y,R,k,S){for(let i=0;i<9;i++){const a=i/9*TAU+R_(-.2,.2),d=R*R_(.62,.86);A(new Spike({el:'earth',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,h:R_(34,58)*k,w:R_(18,26)*k,lean:Math.cos(a)*.35,life:1.5,rise:.09,sink:.3,delay:R_(0,.06)}));}
    puffs(sys('sorted',y+2),F.dust(),x,y,10,9,90*k,60,90,1.1);ring('gold',x,y,R*1.2,{w0:10,life:.5,delay:.08});},
  hcMeteor(x,y,R,k,S){const last=HV.meteorLast;dark(x,y,R*.55,1.8,.4);ring('fire',x,y,R*.9,{w0:9,life:.36});bits(S,'fire',x,y,10,last?16:9,{sp:1.3,up:1.1});
    for(let i=0;i<(last?9:5);i++){const a=i/(last?9:5)*TAU+R_(-.3,.3),d=R*R_(.3,.7);A(new Flames({el:'fire',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,h:R_(22,40),w:20,n:2,life:R_(.5,.9),delay:R_(0,.08)}));}
    if(last){A(new Pillar({el:'fire',x,y,w:70,h:220,life:.55}));A(new Flash({el:'fire',x,y,z:20,s0:40,s1:150,life:.24}));}},
  haBehemoth(x,y,R,k){A(new Sigil({tex:ART.ring('taweret','gold'),el:'gold',x,y,r:R*.9,spin:.4,life:1.6,fi:.05,fo:.7,a:.95}));if(!godPic('taweret'))A(new Pillar({el:'gold',x,y,w:80,h:280,life:.6}));},
  behEnd(x,y,R,k,S){A(new Sigil({tex:ART.ring('taweret','gold'),el:'gold',x,y,r:R*.7,spin:-.5,life:2,fi:.05,fo:.8,a:.95}));if(!godPic('taweret'))A(new Pillar({el:'gold',x,y,w:110,h:340,life:.7}));
    for(let i=0;i<12;i++){const a=i/12*TAU+R_(-.15,.15),d=R*R_(.55,.85);A(new Spike({el:'earth',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,h:R_(40,70),w:R_(20,30),lean:Math.cos(a)*.35,life:1.6,rise:.09,sink:.3,delay:R_(0,.1)}));}
    glints(S,G[3],x,y,30,16,R*.5,1);},
  hcSubmerge(x,y,R,k){A(new Gush({el:'mud',x,y,w:60,h:130,life:.75}));crown(x,y,80,'mud',{life:.6});splat(x,y,R*.8,2.2,'mud',3);},
  haRoll(x,y,R){ring('bronze',x,y,R,{w0:8,life:.32});}};
/* the bounce of Bounce Slam: an arc of motion from the last landing to this one */
function hopArc(x0,y0,x1,y1){const H=60+Math.hypot(x1-x0,y1-y0)*.25;A(new Fn({layer:'top',life:.4,fi:.01,fo:.3,d(q,k){const N=16,p=pal('teal'),a=q.fade(),pts=[];for(let i=0;i<=N;i++){const u=i/N;pts.push(P(lerp(x0,x1,u),lerp(y0,y1,u),Math.sin(u*Math.PI)*H));}
    const vis=cl(k*4,0,1),from=Math.floor(N*cl(k*2-.2,0,1));ctx.save();ctx.lineCap='round';ctx.globalAlpha*=a;for(const [lw,c] of [[9,rgba(p[0],.25)],[6,rgba(p[2],.55)],[2.4,rgba(p[4],.9)]]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.setLineDash([10,7]);ctx.lineDashOffset=-q.t*80;ctx.beginPath();for(let i=from;i<=Math.ceil(N*vis);i++){const s=pts[Math.min(N,i)];i>from?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}ctx.stroke();}ctx.restore();}}));}
{const L0=window.hLand;window.hLand=function(x,y,R,big){const key=HV.behEnd?'behEnd':(window.SKCTX||(player.action&&player.action.key)||'');HV.inLand=1;let r;try{r=L0.apply(this,arguments);}finally{HV.inLand=0;}
  try{HV.inLand=1;landFx(x,y,R,big,key);if(key==='haBounce'&&HV.lastLand&&gameTime-HV.lastLand.t<.8&&Math.hypot(HV.lastLand.x-x,HV.lastLand.y-y)>20)hopArc(HV.lastLand.x,HV.lastLand.y,x,y);HV.lastLand={x,y,t:gameTime};}catch(e){warn('land',e);}finally{HV.inLand=0;}return r;};}
{const BE=window.hBehemothEnd;window.hBehemothEnd=function(){HV.behEnd=1;try{return BE.apply(this,arguments);}finally{HV.behEnd=0;}};}
/* the jumps (every dashUpd of the hippo goes through here once per action) */
const SLAMR={basic:()=>hL('hcCrater')?HB.hcCrater.R:HB.hnCombo.finR,haFlop:()=>HB.haFlop.R,haBounce:()=>HB.haBounce.R,haSky:()=>HB.haSky.R,haDouble:()=>HB.haDouble.R,haMountain:()=>HB.haMountain.R,hcMeteor:()=>HB.hcMeteor.R};
const HIDDEN={haSky:1,haMountain:1},MARK={haSky:1,haMountain:1,haDouble:1,hcMeteor:1};
{const DU=window.dashUpd;window.dashUpd=function(a,dt,t0,t1,sx,sy,dx,dy){const r=DU.apply(this,arguments);try{if(a&&a===player.action&&!a._hva&&a.t>=t0){a._hva=1;airFx(a,t0,t1,sx,sy,dx,dy);}}catch(e){warn('air',e);}return r;};}
function airFx(a,t0,t1,sx,sy,dx,dy){const key=a.key,T=Math.max(.05,(t1-a.t)/TEMPO());if(key==='hnWaddle')return waddleFx(sx,sy,dx,dy,T);if(key==='haRoll')return rollFx(sx,sy,dx,dy,T);if(!SLAMR[key])return;
  let R=SLAMR[key]();try{R=hSlamR(R);}catch(_){}const S=S1();A(new Ring({el:F.dust(),x:sx,y:sy,r0:8,r1:34,w0:7,w1:1,life:.3}));
  if(MARK[key]){const hid=!!HIDDEN[key];A(new Fn({layer:'ground',x:dx,y:dy,life:T+.05,fi:.08,fo:.05,d(q,k){const s=P(dx,dy,0),e=eI(k),r=lerp(.25,1,e)*R*.55,al=q.fade();ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());
      ctx.fillStyle=`rgba(10,8,14,${(.12+.3*e)*al})`;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();if(hid){ctx.setLineDash([12,8]);ctx.lineDashOffset=-q.t*40;ctx.lineWidth=2.4;ctx.strokeStyle=rgba(G[3],.75*al*(.5+.5*e));ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();}ctx.restore();}}));
    if(hid)after(Math.max(0,T-.24),()=>{const b=BODY();for(let i=0;i<6;i++){const ox=R_(-1,1)*b*.55,oy=R_(-.3,.3)*b;A(new Streak({el:'white',x:dx+ox,y:dy+oy,x2:dx+ox,y2:dy+oy,z:b*R_(3.2,4.4),z2:b*R_(.9,1.4),w:R_(2.5,4.5),life:.2,go:.8,head:0,delay:R_(0,.06),a:.8}));}
      if(key==='haMountain')for(let i=0;i<7;i++){const a=R_(0,TAU),d=R*R_(.3,.9),x=dx+Math.cos(a)*d,y=dy+Math.sin(a)*d;S1().add({im:spr('rock','earth',i%3),x,y,z:R_(260,420),vz:-R_(300,420),g:900,s0:R_(9,15),life:.5,rot:R_(0,TAU),vr:R_(-6,6),bounce:.2,delay:R_(0,.12)});}});}
  if(key==='hcMeteor'){HV.meteorLast=/3$/.test(a.name||'');const n=HV.meteorLast;A(new Emit({life:T,every:.03,fn(){if(!player.action)return;const z=(player.z||0)+BODY()*.5;bits(S1(),'fire',player.x,player.y,z,1,{size:n?1.2:.9,sp:.3,up:.2});}}));
    after(T*.45,()=>A(new Fn({layer:'top',life:T*.55+.05,fi:.03,fo:.05,d(q){const s=P(player.x,player.y,(player.z||0)+BODY()*.5);glowAt(s[0],s[1],BODY()*(n?1.2:.9),F.PAL.fire[2],.5*q.fade());}})));}}
function waddleFx(sx,sy,dx,dy,T){const phi=Math.atan2(dy-sy,dx-sx),L=Math.hypot(dx-sx,dy-sy);footprints((sx+dx)/2,(sy+dy)/2,phi,4,L/4,1.5);
  for(const sd of [-1,1])A(new Streak({el:F.dust(),x:sx-Math.sin(phi)*sd*10,y:sy+Math.cos(phi)*sd*10,x2:dx-Math.sin(phi)*sd*10,y2:dy+Math.cos(phi)*sd*10,z:10,w:5,life:T+.12,go:.6,head:0}));
  A(new Emit({life:T,every:.07,fn(){dust({},player.x,player.y,6,1,16,8);}}));}
function rollFx(sx,sy,dx,dy,T){const phi=Math.atan2(dy-sy,dx-sx),b=BODY(),p=pal(F.dust());
  A(new Emit({life:T,every:.085,fn(){A(new Arc({el:F.dust(),follow:player,z:b*.45,phi,R:b*.62,w:b*.22,a0:1.9,a1:-1.1,tilt:Math.PI/2,swing:.1,life:.17,ease:t=>t,glint:0}));
    dust({},player.x,player.y,8,1,18,6);if(Math.random()<.5)bits(S1(),'earth',player.x,player.y,4,1,{size:.7,sp:.5,dir:phi+Math.PI,spread:.8});}}));
  A(new Fn({layer:'ground',life:T+1.2,fi:.05,fo:.9,d(q){const a=q.t<T?1:q.fade(),ex=q.t<T?player.x:q.ex,ey=q.t<T?player.y:q.ey;q.ex=ex;q.ey=ey;const s=P(sx,sy,0),e=P(ex,ey,0);ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';
      ctx.lineWidth=b*.5;ctx.strokeStyle=rgba(p[0],.22);ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=rgba(p[1],.45);for(const sd of [-1,1]){const ox=-Math.sin(phi)*sd*b*.22,oy=Math.cos(phi)*sd*b*.22*KY();ctx.beginPath();ctx.moveTo(s[0]+ox,s[1]+oy);ctx.lineTo(e[0]+ox,e[1]+oy);ctx.stroke();}ctx.restore();}}));}

/* ---------------------------------------------------------------------
   4. mace, casts, mouth
   --------------------------------------------------------------------- */
/* the bronze mace coming down over the shoulder; its smear reaches the ground in front on the contact frame */
function maceSwing(phi,side,L){const b=BODY();A(new Arc({el:'bronze',follow:player,z:b*.46,phi:phi+side*.22,R:b*.62+10,w:b*.16+5,a0:1.9,a1:-.72,tilt:1.25,swing:L,life:L+.12,ease:eI,glint:1}));
  after(L,()=>{const q=fwd(b*.75);dust({},q[0],q[1],8,3,16,8);});}
/* power gathering at the raised mace during a cast's wind-up, in the skill's own element */
const CASTPAL={haGulp:'gold',haWard:'gold',haPound:'gold',haBehemoth:'gold',hcGobble:'gold',hbMud:'mud',hbWallow:'mud',hbSplash:'mud',hbWave:'water',hbGeyser:'water',hbWrath:'water',hbSea:'water',hcJar:'water',
  hbBounty:'life',hnFeast:'life',hbLotus:'lotus',hbLotusStorm:'lotus',hbQuick:'sand',hnYawn:'lotus',haBurp:'burp'};
function inhaleFx(T,R){A(new Emit({life:T,every:.05,fn(){const m=mouth(),a=R_(0,TAU),d=R*R_(.5,.9);S1().add({im:spr('gust','teal'),x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,z:R_(8,26),to:{x:m[0],y:m[1],z:m[2]},s0:R_(16,24),s1:6,lin:1,life:R_(.22,.32),face:1,fi:.04,fo:.12,a0:.85});}}));}
function gatherFx(k,a){const T=(a.windup||0)/TEMPO();if(T<.1||!CASTPAL[k])return;if(k==='haGulp'||k==='hcGobble')return inhaleFx(T,k==='hcGobble'?HB.hcGobble.R:HB.haGulp.R);const pl=CASTPAL[k]||'teal',p=pal(pl),S=S1(),solid=pl==='mud'||pl==='sand'||pl==='water',im=pl==='mud'?spr('mudBlob','mud'):pl==='water'?spr('drop','water'):pl==='lotus'?spr('petal','lotus'):pl==='sand'?spr('rock','sand'):null;
  A(new Emit({life:T-.05,every:.045,fn(){const h=mace(),an=R_(0,TAU),d=R_(26,46);S.add(im?{im,x:h[0]+Math.cos(an)*d,y:h[1]+Math.sin(an)*d*.6,z:h[2]+R_(-18,20),to:{x:h[0],y:h[1],z:h[2]},s0:R_(7,11),s1:3,lin:1,life:R_(.2,.3),fi:.04,fo:.1,face:pl==='water'||pl==='mud'?1:0,fa:Math.PI/2,rot:R_(0,TAU)}
      :{im:tex('core',p[2]),x:h[0]+Math.cos(an)*d,y:h[1]+Math.sin(an)*d*.6,z:h[2]+R_(-18,20),to:{x:h[0],y:h[1],z:h[2]},s0:R_(5,8),s1:2,lin:1,life:R_(.16,.26),add:1,str:1.3,fi:.04,fo:.1});}}));
  A(new Fn({layer:'top',life:T+.04,fi:.08,fo:.05,d(q,kk){const h=mace(),m=P(h[0],h[1],h[2]),r=(4+9*kk)*(1+.08*Math.sin(q.t*40));if(solid){for(let i=0;i<3;i++){const an=q.t*9+i*TAU/3;drawSpr(im,m[0]+Math.cos(an)*r*.7,m[1]+Math.sin(an)*r*.45,r*1.3,an+Math.PI/2,q.fade());}glowAt(m[0],m[1],r*1.6,p[3],.18*q.fade());}else{glowAt(m[0],m[1],r*2.2,p[2],.5*q.fade());coreAt(m[0],m[1],r,p[2],.85*q.fade());}}}));
  at(a,a.windup,()=>{const h=mace();if(solid)bits(S1(),pl==='water'?'water':pl,h[0],h[1],h[2],5,{size:.8,sp:.6});else flash(pl,h[0],h[1],h[2],.75);});}
/* the hippo's own mouth, seen from the front (jawU / jawL): gap(t) 0 = shut … 1 = wide open; o.pos() = world point of the mouth line */
function jaws(o){const U=spr('jawU','teal'),Lw=spr('jawL','teal'),P2=pal(o.pal||'teal');
  return A(new Fn({layer:'top',life:o.life,fi:o.fi||.05,fo:o.fo||.14,d(q){const b=o.pos(q),s=P(b[0],b[1],b[2]),w=o.w,g=cl(o.gap(q.t),0,1.2),a=q.fade()*(o.a||.95),hu=w*U.height/U.width,hl=w*Lw.height/Lw.width,gp=g*w*.4,sh=o.shake?o.shake(q.t):0;
      glowAt(s[0],s[1],w*.85,P2[2],.32*a);ctx.save();ctx.translate(sh,0);
      if(gp>1){ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='rgba(70,14,30,.92)';ctx.beginPath();ctx.ellipse(s[0],s[1],w*.36,gp*.55+1,0,0,TAU);ctx.fill();ctx.restore();}
      drawSpr(Lw,s[0],s[1]+gp*.5+hl*(.5-34/136),w,0,a);drawSpr(U,s[0],s[1]-gp*.5-hu*(96/116-.5),w,0,a);ctx.restore();}}));}

/* ---------------------------------------------------------------------
   5. B — mud, water, lotus, quicksand
   --------------------------------------------------------------------- */
/* a breaking wave of Nile water: its side profile (back slope → crest → curling lip → front face) swept across its width and painted
   as a mesh, far quads first — so it reads as a wave from every direction (side on = the curl, head on = the wall) */
const WPR=[[-1.3,0],[-.95,.2],[-.6,.5],[-.3,.82],[-.05,1],[.22,1.02],[.42,.9],[.5,.74],[.4,.62],[.24,.62],[.14,.46],[.1,.22],[.08,0]];
const WSEG=[1,1,2,3,5,4,3,2,1,1,2,2];   /* palette index per profile segment (5 = white foam) */
function waveWall(cx,cy,phi,W,H,al,t,big){if(H<2)return;const c=Math.cos(phi),s=Math.sin(phi),px=-s,py=c,p=pal(big?'nile':'water'),N=10,M=WPR.length,L=H*.95,G=[];
  for(let i=0;i<=N;i++){const u=i/N*2-1,prof=1-.36*u*u,hk=prof*(1+.07*Math.sin(u*6.5+t*12)),lean=.08*Math.sin(u*4-t*8),row=[];
    for(let j=0;j<M;j++){const f=WPR[j][0],h=WPR[j][1],ff=f*L*(.75+.25*prof)+lean*L*h;row.push([cx+c*ff+px*u*W*.5,cy+s*ff+py*u*W*.5,h*H*hk]);}G.push(row);}
  const Q=[];for(let i=0;i<N;i++)for(let j=0;j<M-1;j++){const a=G[i][j],b=G[i][j+1],d=G[i+1][j+1],e=G[i+1][j];Q.push({k:(a[1]+b[1]+d[1]+e[1])/4+(a[2]+b[2]+d[2]+e[2])*.0004,j,q:[a,b,d,e]});}
  for(const i of [0,N]){const row=G[i];let k=0;for(const w of row)k+=w[1];Q.push({k:k/row.length+.01*(i?1:-1),cap:1,q:row});}   /* the two ends: the wave's own profile (a curl seen side on) */
  Q.sort((a,b)=>a.k-b.k);ctx.save();ctx.globalAlpha*=al;const f0=P(cx,cy,0);ctx.fillStyle='rgba(6,20,34,.2)';ctx.beginPath();ctx.ellipse(f0[0],f0[1],W*.6,W*.6*KY()*.4,Math.atan2(py*KY(),px),0,TAU);ctx.fill();
  ctx.lineJoin='round';for(const q of Q){if(q.cap){const Z=q.q.map(w=>P(w[0],w[1],w[2]));ctx.beginPath();Z.forEach((z,k)=>k?ctx.lineTo(z[0],z[1]):ctx.moveTo(z[0],z[1]));ctx.closePath();ctx.fillStyle=p[2];ctx.fill();ctx.strokeStyle=rgba(p[0],.35);ctx.lineWidth=1.4;ctx.stroke();
      const cz=Z[9];ctx.fillStyle=rgba(p[1],.9);ctx.beginPath();ctx.ellipse(cz[0],cz[1]+2,H*.13,H*.1,0,0,TAU);ctx.fill();ctx.lineCap='round';ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();for(let k=3;k<=7;k++)k>3?ctx.lineTo(Z[k][0],Z[k][1]):ctx.moveTo(Z[k][0],Z[k][1]);ctx.stroke();continue;}
    const col=WSEG[q.j]===5?'#ffffff':p[WSEG[q.j]];ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<4;k++){const w=q.q[k],z=P(w[0],w[1],w[2]);k?ctx.lineTo(z[0],z[1]):ctx.moveTo(z[0],z[1]);}ctx.closePath();ctx.fill();ctx.stroke();}
  /* foam streaks running back over the slope */
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.6;for(let m=0;m<2;m++){const ph=((t*1.6+m*.5)%1),jf=3-ph*3,j0=Math.floor(jf),fr=jf-j0;if(j0<0)continue;ctx.beginPath();for(let i=1;i<N;i++){const A2=G[i][j0],B2=G[i][Math.min(M-1,j0+1)],w=[lerp(A2[0],B2[0],fr),lerp(A2[1],B2[1],fr),lerp(A2[2],B2[2],fr)+1],z=P(w[0],w[1],w[2]);i>1?ctx.lineTo(z[0],z[1]):ctx.moveTo(z[0],z[1]);}ctx.globalAlpha*=1;ctx.stroke();}
  for(let i=0;i<=N;i++){const q=G[i][5],z=P(q[0],q[1],q[2]),r=(2.4+2.2*Math.abs(Math.sin(i*2.1+t*10)))*(H/46);ctx.fillStyle=rgba(p[3],.9);ctx.beginPath();ctx.arc(z[0]+1,z[1]+1,r,0,TAU);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(z[0],z[1],r*.8,0,TAU);ctx.fill();
    const lp=G[i][7],zl=P(lp[0],lp[1],lp[2]+3+4*Math.abs(Math.sin(i*3.7+t*15)));ctx.beginPath();ctx.arc(zl[0],zl[1],1.6,0,TAU);ctx.fill();const ft=G[i][M-1],zf=P(ft[0],ft[1],1);ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.ellipse(zf[0],zf[1],4.4,2,0,0,TAU);ctx.fill();}
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.3;ctx.drawImage(tex('glow',p[2]),f0[0]-W*.6,f0[1]-H*1.2,W*1.2,H*1.4);ctx.restore();}
function waveFx(f){const big=!!f.big,W=2*f.w*1.05+16,x0=f.x0,y0=f.y0,phi=f.phi,c=Math.cos(phi),s=Math.sin(phi);
  crown(x0+c*20,y0+s*20,big?70:52,'water',{life:.5});
  A(new Fn({layer:'ground',life:f.life+1.4,fi:.05,fo:1.1,d(q){const L=Math.min(f.len,q.t*f.speed),a=q.fade(),A0=P(x0,y0,0),B0=P(x0+c*L,y0+s*L,0);ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';
      ctx.lineWidth=W*.8*KY()+4;ctx.strokeStyle=big?'rgba(40,30,20,.24)':'rgba(10,40,70,.2)';ctx.beginPath();ctx.moveTo(A0[0],A0[1]);ctx.lineTo(B0[0],B0[1]);ctx.stroke();ctx.lineWidth=W*.5*KY();ctx.strokeStyle='rgba(120,200,240,.16)';ctx.stroke();ctx.restore();}}));
  A(new Emit({life:f.life,every:.05,fn(){if(!fx.includes(f))return;const u=R_(-1,1)*W*.45;bits(S1(),'water',f.x-s*u,f.y+c*u,big?50:34,1,{dir:phi,spread:.6,sp:.5,up:.6,size:big?1:.8});}}));}
/* side on (the wave runs across the screen) = the owner's painted wave, never turned, mirrored when it runs left; head on / going away =
   the mesh above; in between they cross-fade */
PSRC.wave='assets/fx/hippo/h05_wave.webp';PSRC.bigwave='assets/fx/hippo/h06_bigwave.webp';img('wave');img('bigwave');
{HWave.prototype.draw=guardDraw('wave',function(){if(this._ring)return;const rise=eO(cl(this.t/.1,0,1)),fall=cl((this.life-this.t)/.18,0,1),al=Math.min(1,fall*1.6),H=(this.big?66:46)*rise*(.5+.5*fall),W=2*this.w*1.05+16,
    sa=scrAng(this.phi),side=cl((Math.abs(Math.cos(sa))-.42)/.2,0,1),im=img(this.big?'bigwave':'wave'),wp=im?side:0;
    if(wp<.99)waveWall(this.x,this.y,this.phi,W,H,al*(1-wp),this.t,this.big);
    if(wp>.01){const s=P(this.x,this.y,10),Ww=this.w*(this.big?1.6:1),fl=Math.cos(this.phi)<0;picAt(im,s[0],s[1]+6,(this.big?Ww*2.8:Ww*3.1)*lerp(.6,1,rise)*(.85+.15*fall),{fx:fl,a:al*wp,ax:.6,ay:.86});}});}
/* the projectiles: mud ball (painted), lotus petal, burp gas */
{HProj.prototype.draw=guardDraw('proj',function(){const s=P(this.x,this.y,this.z),tr=this._tr||(this._tr=[]);tr.push([this.x,this.y,this.z,this.t]);while(tr.length&&this.t-tr[0][3]>.14)tr.shift();
    if(this.kind==='mud'){const im=img('ball');if(im)picAt(im,s[0],s[1],this.R*4.2,{rot:scrAng(this.phi),ax:.72});else{drawSpr(spr('orb','mud'),s[0],s[1],this.R*2.2,this.t*6);}return;}
    if(this.kind==='petal'){const p=LO;if(tr.length>1){ctx.save();ctx.lineCap='round';for(const [lw,c] of [[6,rgba(p[1],.35)],[3,rgba(p[3],.8)]]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();tr.forEach((q,i)=>{const z=P(q[0],q[1],q[2]);i?ctx.lineTo(z[0],z[1]):ctx.moveTo(z[0],z[1]);});ctx.stroke();}ctx.restore();}
      glowAt(s[0],s[1],16,p[2],.5);drawSpr(spr('petal','lotus',(this.cell||0)%2),s[0],s[1],17,this.t*14);return;}
    const R=this.R,p=pal('burp');glowAt(s[0],s[1],R*2.4,p[2],.45);for(let i=0;i<3;i++){const an=this.t*7+i*TAU/3;drawSpr(spr('puff','burp',i),s[0]+Math.cos(an)*R*.5,s[1]+Math.sin(an)*R*.32,R*1.5,an*.3,.78);}
    drawSpr(spr('puff','burp',2),s[0],s[1],R*2,-this.t*3,.85);});}
function projFx(f){if(f.kind==='burp'){const c=Math.cos(f.phi),s=Math.sin(f.phi);A(new Emit({life:f.life+.05,every:.04,fn(){if(!fx.includes(f))return;puffs(sys('sorted',f.y+1),'burp',f.x-c*14,f.y-s*14,f.z,1,26,30,10,.55);}}));}
  else if(f.kind==='petal')f.cell=Math.random()*2|0;}
function burpBlast(phi){const m=mouth(),S=S1(),Sg=sys('sorted',m[1]+2);flash('burp',m[0],m[1],m[2],.9);
  for(let i=0;i<qn(12);i++){const a=phi+R_(-.38,.38),v=R_(140,300);Sg.add({im:spr('puff','burp',i),x:m[0],y:m[1],z:m[2]*R_(.6,1),vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:R_(0,30),dr:3,s0:R_(14,22),s1:R_(34,52),life:R_(.45,.7),fi:.04,fo:.55,a0:.85,rot:R_(-.5,.5),vr:R_(-1,1)});}
  for(let i=0;i<qn(7);i++){const a=phi+R_(-.3,.3),v=R_(380,520);S.add({im:spr('gust','white'),x:m[0],y:m[1],z:m[2]+R_(-8,8),vx:Math.cos(a)*v,vy:Math.sin(a)*v,dr:2.5,s0:R_(22,34),s1:12,life:R_(.2,.3),face:1,fi:.02,fo:.5,a0:.8});}
  A(new Ring({el:'burp',x:m[0]+Math.cos(phi)*30,y:m[1]+Math.sin(phi)*30,r0:10,r1:60,w0:8,w1:1,life:.32}));bits(S,'burp',m[0],m[1],m[2],4,{dir:phi,spread:.5,sp:1.4});}
/* geysers (Geyser, the flood's geysers, the jar's last burst): the painted column stands on its own; base, ring, mist and rain */
function geyserFx(x,y,R){const S=S1(),inMud=hInPool(x,y);dark(x,y,R*.45,1.2,.26);crown(x,y,Math.min(80,R*.6),'water',{life:.45});A(new Ring({el:'water',x,y,r0:R*.2,r1:R,w0:8,w1:1.5,life:.42,a:.85}));
  bits(S,'water',x,y,40,12,{up:1.7,sp:.9,size:1});if(inMud)bits(S,'mud',x,y,30,6,{up:1.5,sp:1});puffs(sys('sorted',y+2),'cloud',x,y,16,2,30,40,30,.7);flash('water',x,y,60,1,{life:.18});
  after(.35,()=>bits(S1(),'water',x,y,150,10,{up:.3,sp:.9,size:.9}));}
/* quicksand: sand bands turning in toward a dark middle (drawn under the units every frame) */
function quickDraw(p,x,y,a,t){const r=p.r,ky=KY(),sp=pal('sand');ctx.save();ctx.translate(x,y);ctx.scale(1,ky*.95);ctx.globalAlpha*=a;
  const g=ctx.createRadialGradient(0,0,r*.08,0,0,r);g.addColorStop(0,'#2a1a0a');g.addColorStop(.22,'#6a4820');g.addColorStop(.7,rgba(sp[2],.9));g.addColorStop(1,rgba(sp[2],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
  ctx.lineCap='round';for(let i=0;i<7;i++){const a0=i*TAU/7+t*1.3;ctx.beginPath();for(let j=0;j<=24;j++){const u=j/24,rr=r*(.95-.82*u),an=a0+u*2.8;j?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}
    ctx.lineWidth=7-3*(i%2);ctx.strokeStyle=rgba(i%2?sp[3]:sp[1],.55);ctx.stroke();}
  ctx.setLineDash([r*.22,r*.12]);ctx.lineDashOffset=-t*r*.4;ctx.lineWidth=3;ctx.strokeStyle=rgba(sp[3],.6);ctx.beginPath();ctx.arc(0,0,r*.97,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(20,12,6,.75)';ctx.beginPath();ctx.arc(0,0,r*.1,0,TAU);ctx.fill();ctx.restore();}
/* the ground pieces of HGround: pools (painted), lotus on them, quicksand (code); the flood's picture; the jar is its own piece */
HGround.prototype.draw=guardDraw('ground',function(){const t=this.t;
  for(const p of HIP.pools){const left=p.until-gameTime,age=gameTime-p.born,a=Math.min(1,left/.6,age/.22);if(a<=0)continue;const s=P(p.x,p.y,0),grow=age<.3?lerp(.55,1,K_.back(cl(age/.3,0,1))):1;
    if(p.quick){quickDraw(p,s[0],s[1],a,t);if(p.lotus)lotusOn(p,a,t);continue;}
    const im=img(p.sea?'sea':'pool');
    if(im)picAt(im,s[0],s[1],p.r*(p.sea?2.4:2.15)*grow,{a:.92*a,sq:p.sea?1:.95});
    else{ctx.save();ctx.globalAlpha*=.85*a;ctx.translate(s[0],s[1]);ctx.scale(1,KY()*.9);const g=ctx.createRadialGradient(0,0,p.r*.2,0,0,p.r);g.addColorStop(0,p.sea?'#5a8ab0':'#6a4628');g.addColorStop(.8,p.sea?'#4a7aa0':MU[2]);g.addColorStop(1,rgba(p.sea?WA[2]:MU[3],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,p.r*grow,0,TAU);ctx.fill();ctx.restore();}
    if(p.sticky){ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY()*.9);ctx.globalAlpha*=.5*a;ctx.strokeStyle=MU[3];ctx.lineWidth=2;ctx.lineCap='round';for(let i=0;i<4;i++){const a0=i*TAU/4-t*1.6;ctx.beginPath();for(let j=0;j<=12;j++){const u=j/12,rr=p.r*(.85-.6*u),an=a0+u*1.8;j?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.stroke();}ctx.restore();}
    if(p.lotus)lotusOn(p,a,t);}});
function lotusOn(p,a,t){const li=img('lotus'),bob=2*Math.sin(t*3+p.x*.01),q=P(p.x,p.y,6+bob);glowAt(q[0],q[1],30,LO[2],.35*a);if(li)picAt(li,q[0],q[1],36,{a,ay:.75});else drawSpr(spr('lotusFl','lotus'),q[0],q[1]-6,30,0,a);}
HGround.prototype.__gt='-';
/* pools that live: mud bubbles rise and pop (the flood and the quicksand have their own) */
function poolFx(p){const alive=()=>HIP.pools.includes(p)&&p.until>gameTime;if(p.quick){A(new Emit({life:99,until:alive,every:.07,fn(){const a=R_(0,TAU),d=p.r*R_(.6,.95);S1('ground').add({im:spr('rock','sand',Math.random()*3|0),orb:1,cx:p.x,cy:p.y,ang:a,va:-1.3,r:d,vr2:-p.r*.7,z:1,vz:0,s0:R_(3,6),life:R_(.6,1),fo:.3,rot:R_(0,TAU),vr:R_(-3,3)});}}));
    A(new Emit({life:99,until:alive,every:.5,fn(){const a=R_(0,TAU),d=p.r*R_(.2,.7);puffs(sys('sorted',p.y+Math.sin(a)*d+1),'sand',p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,4,1,20,30,14,.7);}}));return;}
  A(new Emit({life:99,until:alive,every:p.r>100?.22:.4,fn(){const a=R_(0,TAU),d=Math.sqrt(Math.random())*p.r*.75,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d*.9;
    A(new Spr({im:spr('bubble','mud'),x,y,z:1,w:R_(6,11),layer:'ground',life:R_(.5,.8),pop:.25,s0:.2,s1:1,fo:.12,onEnd:()=>{bits(S1('ground'),'mud',x,y,2,2,{size:.4,sp:.2,up:.3});}}));}}));}

/* ---------------------------------------------------------------------
   6. lasting looks (kept alive by the watcher while their state lasts)
   --------------------------------------------------------------------- */
function napFx(){const on=()=>hasBuff('hnNap'),b=BODY();A(new Disc({follow:player,r0:b*.7,life:99,until:on,col:F.PAL.sleep[2],a:.16,fi:.3,fo:.3}));
  A(new Emit({life:99,until:on,every:.6,fn(){const h=[player.x+R_(-4,4),player.y,(player.z||0)+BODY()*.92];S1('top').add({im:spr('zzz','sleep'),x:h[0],y:h[1],z:h[2],vx:R_(8,18),vz:R_(18,26),s0:7,s1:15,life:1.7,fi:.15,fo:.5,wob:5,rot:R_(-.3,.3)});}}));
  A(new Fn({layer:'sorted',follow:player,sortOff:2,life:99,until:on,fi:.3,fo:.08,d(q){const m=mouth(),s=P(m[0],m[1],m[2]-BODY()*.06),u=.5-.5*Math.cos(q.t*2.3),r=(4+7*u)*HK()/.535;drawSpr(spr('bubble','sleep'),s[0]+r*.6,s[1],r*2,0,q.fade()*.9);}}));}
function napPop(){const m=mouth(),S=S1();bits(S,'water',m[0],m[1],m[2],4,{size:.5,sp:.5,up:.5});flash('sleep',m[0],m[1],m[2],.5,{life:.12});}
function shieldFx(){const on=()=>HIP.shield>0,hk=HK()/.535;orbit({im:spr('shield','gold'),n:2,r:24*hk,z:BODY()*.55,spin:2.6,w:13*hk,bob:2,follow:player,life:99,until:on,glow:G[2]});
  A(new Ring({el:'gold',follow:player,r0:30*hk,r1:30*hk,w0:2,w1:2,life:99,style:'dash',hold:1,spin:3,until:on,a:.6}));}
function gulpHoldFx(e){const on=()=>HIP.gulp&&HIP.gulp.e===e&&!e.dead;orbit({im:spr('star5','gold'),n:3,r:12,z:topZ(e)+6,spin:5,w:9,bob:1,follow:e,life:99,until:on});
  A(new Ring({el:'gold',follow:e,r0:(e.r||16)+6,r1:(e.r||16)+6,w0:2.5,w1:2.5,life:99,style:'dash',hold:1,spin:4,until:on,a:.7}));}
function behFx(){const on=()=>hasBuff('haBehemoth');A(new Sigil({tex:ART.ring('taweret','gold'),el:'gold',follow:player,r:62,spin:.3,life:99,until:on,fi:.3,fo:.4,a:.55}));
  A(new Emit({life:99,until:on,every:.12,fn(){const a=R_(0,TAU),d=R_(20,60);glints(S1(),G[3],player.x+Math.cos(a)*d,player.y+Math.sin(a)*d*.8,R_(4,30),1,4,.8);}}));}
function seaFx(sea){const on=()=>HIP.sea===sea,x=sea.x,y=sea.y,R=sea.R,p=WA,B=[];for(let i=0;i<7;i++)B.push({r:lerp(.3,.95,(i+.5)/7),a:R_(0,TAU),len:R_(1,1.8),sp:R_(.35,.6)*(i%2?1:-1)});
  A(new Fn({layer:'ground',x,y,life:99,until:on,fi:.4,fo:.5,d(q){const s=P(x,y,0),a=q.fade();ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.lineCap='round';for(const b of B){const a0=b.a+q.t*b.sp,rr=R*b.r;for(let j=0;j<5;j++){const u0=j/5,u1=(j+1)/5;ctx.globalAlpha=a*.42*u1;ctx.lineWidth=3.2;ctx.strokeStyle=p[3];ctx.beginPath();ctx.arc(0,0,rr,a0+b.len*u0*Math.sign(b.sp),a0+b.len*u1*Math.sign(b.sp),b.sp<0);ctx.stroke();}}
      ctx.globalAlpha=a*.5;ctx.setLineDash([R*.3,R*.14]);ctx.lineDashOffset=-q.t*R*.2;ctx.lineWidth=3;ctx.strokeStyle=p[3];ctx.beginPath();ctx.arc(0,0,R*.99,0,TAU);ctx.stroke();ctx.restore();}}));
  A(new Emit({life:99,until:on,every:.28,fn(){const a=R_(0,TAU),d=Math.sqrt(Math.random())*R*.9;A(new Ring({el:'water',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,r0:4,r1:R_(18,30),w0:3,w1:1,life:.8,a:.6}));}}));
  A(new Emit({life:99,until:on,every:.12,fn(){const a=R_(0,TAU),d=Math.sqrt(Math.random())*R*.9;glints(S1('ground'),p[3],x+Math.cos(a)*d,y+Math.sin(a)*d,2,1,4,.7);
      if(player.moving&&Math.hypot(player.x-x,player.y-y)<R){const b=BODY();A(new Ring({el:'water',x:player.x,y:player.y,r0:b*.45,r1:b*.8,w0:3,w1:1,life:.5,a:.7}));}}}));}
/* Hapi's jar: dropped from above onto the spot, the water area round it, drips; the painted jar stands in the sorted layer */
function jarFx(j){const on=()=>HIP.jar===j,x=j.x,y=j.y,R=j.R,born=gameTime;A(new Disc({x,y,r0:R,life:99,until:on,col:WA[2],a:.2,fi:.3,fo:.3}));A(new Sigil({tex:ART.ring('nile','water'),el:'water',x,y,r:R*.98,spin:.22,life:99,until:on,fi:.4,fo:.3,a:.7}));
  A(new Fn({layer:'sorted',x,y,life:99,until:on,fi:.01,fo:.2,d(q){const im=img('jar'),t=gameTime-born,dp=cl(t/.22,0,1),zz=180*(1-eI(dp)),land=t-.22,sq=land>0?Math.exp(-land*9)*Math.sin(land*30)*.12:0,s=P(x,y+2,zz),w=64*(1-sq*.5),a=q.fade();
      if(land>=0&&!q._l){q._l=1;crown(x,y,52,'water',{life:.45});A(new Ring({el:'water',x,y,r0:10,r1:R,w0:8,w1:1.5,life:.45,a:.85}));bits(S1(),'water',x,y,20,10,{up:1.2});}
      const g0=P(x,y,0);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='rgba(6,20,34,.3)';ctx.beginPath();ctx.ellipse(g0[0],g0[1],22*dp,6*dp,0,0,TAU);ctx.fill();ctx.restore();
      glowAt(s[0],s[1]-26,38,WA[2],.3*a);if(im)picAt(im,s[0],s[1],w*.82,{a,ay:.92,sq:1+sq});else drawSpr(spr('orb','water'),s[0],s[1]-20,40,0,a);}}));
  A(new Emit({life:99,until:on,every:.35,fn(){const a=R_(0,TAU),d=R_(.2,.85)*R;A(new Ring({el:'water',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,r0:4,r1:22,w0:3,w1:1,life:.7,a:.55}));if(Math.hypot(player.x-x,player.y-y)<R)floaters(S1(),spr('plus','life'),player.x,player.y,16,1,{s:9});}}));}
function jarBreak(j){const S=S1();bits(S,'pot',j.x,j.y,30,12,{up:1.3,sp:1.2,size:1.1});crown(j.x,j.y,60,'water',{life:.5});flash('water',j.x,j.y,40,1.2);}
function hotFx(){const on=()=>HIP.hot&&HIP.hot.until>gameTime,hk=HK()/.535;orbit({im:spr('drop','water'),n:3,r:20*hk,z:BODY()*.5,spin:3,w:9*hk,bob:4,follow:player,life:99,until:on,glow:WA[2]});
  A(new Emit({life:99,until:on,every:.55,fn(){floaters(S1(),hInPool(player.x,player.y)?[spr('plus','life'),spr('lotusFl','lotus')]:spr('plus','life'),player.x,player.y,18,1,{s:10});}}));}
function poolKeep(){for(const p of HIP.pools){if(p.sea)continue;if(!p._hv||!p._hv.every(q=>fx.includes(q))){if(p._hv)p._hv.forEach(q=>q.kill&&q.kill());p._hv=grab(()=>poolFx(p));}}}

/* ---------------------------------------------------------------------
   7. what each skill adds to its own action
   --------------------------------------------------------------------- */
function yawnFx(phi){const m=mouth(),R=HB.hnYawn.R,half=HB.hnYawn.half,b=BODY(),p=LO;
  jaws({pos:()=>{const q=fwd(b*.72);return [q[0],q[1],(player.z||0)+b*.55];},w:b*1.0,life:.95,fi:.06,fo:.25,pal:'lotus',a:.78,gap:t=>t<.3?eO(t/.3)*.9:t<.55?.9:Math.max(0,.9-(t-.55)/.35*.9)});
  for(let i=0;i<3;i++)A(new Fn({layer:'top',life:.55,delay:i*.09,fi:.04,fo:.3,d(q,k){const r=lerp(18,R,eO(k)),a=q.fade(),z=m[2]*(1-k*.6);ctx.save();ctx.lineCap='round';ctx.globalAlpha*=a;
      for(const [lw,c] of [[9*(1-k)+3,rgba(p[1],.35)],[5*(1-k)+2,rgba(p[3],.85)],[1.6,'#ffffff']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();for(let j=0;j<=16;j++){const an=phi-half+2*half*j/16,s=P(m[0]+Math.cos(an)*r,m[1]+Math.sin(an)*r,z);j?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}ctx.stroke();}ctx.restore();}}));
  A(new Fn({layer:'ground',life:.7,fi:.05,fo:.45,d(q,k){const s=P(player.x,player.y,0),r=R*eO(cl(k*2,0,1));ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.globalAlpha*=q.fade()*.3;ctx.fillStyle=p[2];ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,phi-half,phi+half);ctx.closePath();ctx.fill();ctx.restore();}}));
  for(let i=0;i<6;i++){const an=phi+R_(-half,half),d=R_(.4,.95)*R;puffs(sys('sorted',player.y+Math.sin(an)*d+1),F.dust(),player.x+Math.cos(an)*d,player.y+Math.sin(an)*d,4,1,22,50,10,.5);}
  after(.06,()=>{for(const e of enemiesInCone(player.x,player.y,phi,R,half)){A(new Spr({im:spr('anger'),follow:e,z:topZ(e)+8,w:20,life:1.3,pop:.14,s0:.2,s1:1,fo:.35,wr:.3,wf:9,layer:'top'}));}});}
function feastMelon(x,y,z,w){const b=BODY(),S=S1();A(new Fn({layer:'top',life:.62,fi:.01,fo:.01,d(q){const im=img('melon'),t=q.t,pp=K_.back(cl(t/.14,0,1)),eat=cl((t-.4)/.16,0,1),m=mouth(),hz=(player.z||0)+b*1.75,
      zz=lerp(hz+Math.sin(t*9)*2,m[2],eI(eat)),px=lerp(player.x,m[0],eat),py=lerp(player.y,m[1],eat),s=P(px,py,zz),ww=w*.95*pp*(1-.7*eat);if(eat>=1)return;
      glowAt(s[0],s[1],ww,F.PAL.life[2],.3);if(im)picAt(im,s[0],s[1],ww,{rot:Math.sin(t*12)*.08*(1-eat)});else drawSpr(spr('orb','life'),s[0],s[1],ww*.8,0);}}));
  after(.56,()=>{const m=mouth();bits(S1(),'melon',m[0],m[1],m[2],12,{sp:1.1,up:1.2,size:1.25});burst('melon',m[0],m[1],m[2],.8,{n:8,life:.2});flash('melon',m[0],m[1],m[2],1,{life:.16});ring('life',player.x,player.y,b*.9,{w0:6,life:.4});floaters(S1(),spr('plus','life'),player.x,player.y,22,6,{s:11,delay:.25});glints(S1(),G[3],player.x,player.y,b*.6,6,22,.7);});}
function gulpVortex(x,y,w,big){const b=BODY(),R=big?HB.hcGobble.R:HB.haGulp.R,S=S1(),m=mouth();w=b*(big?2.6:2.1);A(new Fn({layer:'top',life:.55,fi:.04,fo:.18,d(q,k){const im=img('gulp'),mm=mouth(),s=P(mm[0],mm[1],mm[2]),sc=lerp(1.15,.25,eI(k)),ww=w*sc;
      glowAt(s[0],s[1],ww*.6,G[2],.3*q.fade());if(im){ctx.save();ctx.globalAlpha*=q.fade()*.85;ctx.translate(s[0],s[1]);ctx.scale(1,.72);ctx.rotate(-q.t*9);ctx.drawImage(im,-ww/2,-ww*im.height/im.width/2,ww,ww*im.height/im.width);ctx.restore();}}}));
  for(let i=0;i<qn(big?22:15);i++){const a=R_(0,TAU),d=R*R_(.55,1);S.add({im:spr('gust','teal'),x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,z:R_(6,30),to:{x:m[0],y:m[1],z:m[2]},s0:R_(18,28),s1:6,lin:1,life:R_(.28,.42),face:1,fi:.04,fo:.15,a0:.9,delay:R_(0,.12)});}
  for(let i=0;i<qn(big?10:6);i++){const a=R_(0,TAU),d=R*R_(.3,.9);S.add({im:spr('rock',F.dust(),i%3),x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,z:2,to:{x:m[0],y:m[1],z:m[2]},s0:R_(4,7),s1:2,lin:1,life:R_(.3,.45),rot:R_(0,TAU),vr:R_(-8,8),delay:R_(0,.15)});}
  A(new Ring({el:'gold',x:player.x,y:player.y,r0:R,r1:R*.25,w0:3,w1:8,life:.4,ease:1,a:.8}));}
function pullStreaks(list){for(const [e,x,y] of list){if(e.dead||Math.hypot(e.x-x,e.y-y)<8)continue;A(new Streak({el:'gold',x,y,x2:e.x,y2:e.y,z:zOf(e),w:12,life:.26,go:.45,head:0}));dust({},x,y,12,3,18,8);}}
function chompBite(L){const b=BODY(),S=S1(),gap=t=>t<L-.06?.35+.75*eO(cl(t/Math.max(.01,L-.06),0,1)):Math.max(0,(L-t)/.06*1.1);
  jaws({pos:()=>{const q=fwd(b*.78);return [q[0],q[1],(player.z||0)+b*.42];},w:b*1.15,life:L+.2,fi:.04,fo:.12,gap,shake:t=>t>L&&t<L+.12?Math.sin(t*120)*2:0});
  after(L,()=>{const q=fwd(b*.78),z=(player.z||0)+b*.42;burst('white',q[0],q[1],z,.8,{n:8,life:.18});flash('white',q[0],q[1],z,.7,{life:.12});sparks(S1(),'#ffffff',q[0],q[1],z,5,220,110,.3);});}
function subPeek(sx,sy,tx,ty,T){const b=BODY(),hk=HK()/.535;A(new Fn({layer:'sorted',x:sx,y:sy,life:T,fi:.12,fo:.01,d(q,k){const u=K_.eIO(cl(k/.86,0,1)),sink=cl((k-.88)/.12,0,1),x=lerp(sx,tx,u),y=lerp(sy,ty,u);q.y=y;
      const s=P(x,y,0),w=44*hk,im=spr('hpPeek','water'),h=w*im.height/im.width,bob=Math.sin(q.t*7)*1.5,vis=1-sink;
      ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.fillStyle='rgba(60,36,16,.55)';ctx.beginPath();ctx.ellipse(0,0,w*.62,w*.62,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(230,200,150,.7)';ctx.lineWidth=2;for(let i=0;i<2;i++){const r=w*(.5+.3*((q.t*1.6+i*.5)%1));ctx.globalAlpha=1-((q.t*1.6+i*.5)%1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}ctx.restore();
      if(vis>.02){ctx.save();ctx.beginPath();ctx.rect(s[0]-w,s[1]-h*2,w*2,h*2+1);ctx.clip();drawSpr(im,s[0],s[1]-h*.5*vis+h*(1-vis)*.5+bob,w,0,1);ctx.restore();}}}));
  const phi=Math.atan2(ty-sy,tx-sx);
  let last=0;A(new Emit({life:T*.86,every:.09,fn(q){const u=K_.eIO(cl(q.t/(T*.86),0,1)),x=lerp(sx,tx,u),y=lerp(sy,ty,u);if(u-last<.02)return;last=u;for(const sd of [-1,1])A(new Streak({el:'mud',x,y,x2:x-Math.cos(phi+sd*.5)*30,y2:y-Math.sin(phi+sd*.5)*30,z:1,w:3,life:.5,go:.5,head:0,layer:'ground'}));if(Math.random()<.5)bits(S1(),'mud',x,y,2,1,{size:.5,sp:.3,up:.4});}}));}
/* ---------------------------------------------------------------------
   7b. the gods of the two ultimates (the owner's paintings 2026-11-26; tools/fx/hippo_pics.py cuts them + prints GOD)
       Taweret rises behind him for Behemoth Drop: out of the ground with her paws raised, she slams down with him at the
       peak and pours into him as gold light; she comes back for the final belly slam and sinks back.
       Hapi rises out of the water behind him for The Great Inundation: the flood pours from his two jars, he laughs and
       sinks back; he comes back to pour the giant wave at the end.
       The god pictures keep their own colours (__gt '-'); their water / light pieces take the element-gem tint.
       Nothing is drawn for a god until its picture is in · ?hppic=0 = never (the look of v3 before the gods).
   --------------------------------------------------------------------- */
const GODON=!/[?&]hppic=0/.test(location.search),godPic=n=>GODON&&!!img(n),GK=()=>document.body&&document.body.classList.contains('mob')?.85:1,GX=()=>GK()<1?-105:0;   /* phones: a little smaller and to the left, so the faces are not under the menu medallions in the middle of the top */
if(GODON){PSRC.taweret='assets/fx/hippo/hp_taweret.webp';PSRC.hapi='assets/fx/hippo/hp_hapi.webp';img('taweret');img('hapi');}
const GOD={taweret:{w:570,h:664,foot:[282.0,653.0]},hapi:{w:624,h:610,foot:[312.0,568.5],jarL:[112.4,378.4],jarR:[509.8,378.6],jw:78.0}};
/* a soft light round a picture's outline, built once per picture + colour at quarter size (no canvas filter) — as anubis_vfx.js */
const HALO={};
function halo(n,col){const im=img(n);if(!im)return null;const key=n+col;if(HALO[key])return HALO[key];
  const q=.25,R=7,pad=R+2,w=Math.ceil(im.width*q),h=Math.ceil(im.height*q),c=document.createElement('canvas');c.width=w+pad*2;c.height=h+pad*2;const g=c.getContext('2d');
  for(let r=R;r>=1;r-=1.5)for(let i=0;i<12;i++){const an=i*TAU/12+r;g.globalAlpha=.14;g.drawImage(im,pad+Math.cos(an)*r,pad+Math.sin(an)*r,w,h);}
  g.globalAlpha=1;g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return HALO[key]={c,pad:pad/q,W:(w+pad*2)/q,H:(h+pad*2)/q};}
/* a picture on the current origin with its point (px,py) there; f = drawn px per picture px; o.halo = light colour round it,
   o.lit = the picture added once more on top (a flash) */
function pdraw(n,px,py,f,o){const im=img(n);if(!im)return false;o=o||{};
  if(o.halo){const hl=halo(n,o.halo);if(hl){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=o.ha==null?.85:o.ha;ctx.drawImage(hl.c,(-px-hl.pad)*f,(-py-hl.pad)*f,hl.W*f,hl.H*f);ctx.restore();}}
  ctx.drawImage(im,-px*f,-py*f,im.width*f,im.height*f);
  if(o.lit>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=cl(o.lit,0,1);ctx.drawImage(im,-px*f,-py*f,im.width*f,im.height*f);ctx.restore();}return true;}
/* Taweret behind him (sorted just behind his row, she follows him): she rises through her ground line (clipped there, a gold
   light pool hides the cut), breathes with her paws up, SLAMS (lunge down + squash + flash) at o.T seconds or when o.go(t)
   says so, then pours into him as gold light (o.end: sinks back into the ground instead) */
function taweret(o){if(!GODON)return;o=o||{};const g=GOD.taweret,H=(o.h||170)*GK(),OX=GX(),f=H/g.h,up=o.up||.42,SL=.14,OUT=o.out||.6,BY=12;let s0=-1;
  dust({},player.x+OX,player.y-BY,H*.24,qn(7),26,12);lite('gold',player.x+OX,player.y-BY,H*.5,up+.3,.45);
  const slamFx=()=>{const x=player.x+OX,y=player.y-BY,S=S1();flash('gold',x,y,H*.55,1.7,{life:.2});A(new Ring({el:'gold',x,y,r0:H*.12,r1:H*.75,w0:12,w1:2,life:.42}));glints(S,G[3],x,y,H*.5,10,H*.4,.6);
    if(o.end){after(SL,()=>{for(let i=0;i<qn(10);i++){const u=R_(-1,1);S.add({im:tex('core',G[2]),x:player.x+OX+u*H*.35,y:player.y-BY,z:R_(.1,.7)*H,vz:R_(30,70),s0:R_(5,9),s1:1,life:R_(.5,.8),add:1,fi:.05,fo:.3,delay:R_(0,.2)});}});return;}
    after(SL,()=>{const bz=BODY()*.55;for(let i=0;i<qn(18);i++){const zz=R_(.15,.9)*H,u=R_(-1,1);S.add({im:tex('core',G[2]),x:player.x+OX+u*H*.36*(1-.4*zz/H),y:player.y-BY,z:zz,to:{x:player.x,y:player.y,z:bz},s0:R_(6,10),s1:2,lin:1,life:R_(.3,.5),add:1,str:1.2,fi:.05,fo:.1,delay:R_(0,.14)});}
      glints(S,G[3],player.x,player.y,bz,10,BODY()*.8,.8);});};
  A(new Fn({layer:'sorted',follow:player,sortOff:-8,life:o.max||9,__gt:'-',fi:.01,fo:.01,d(q){const tt=q.t;
      if(s0<0&&(o.go?o.go(tt):tt>=o.T)){s0=tt;q.life=tt+SL+OUT;slamFx();}
      const im=img('taweret');if(!im)return;
      const ts=s0<0?0:tt-s0,k=cl(ts/SL,0,1),ko=s0<0?0:cl((ts-SL)/OUT,0,1),sl=s0<0?0:Math.sin(k*Math.PI),br=s0<0?Math.sin(tt*4.2):0,
        u=cl(tt/up,0,1),pp=K_.back(u),off=(1-eO(u))*H*1.04+(s0<0?0:(ko>0?1:eO(k))*H*.05)+(o.end?eI(ko)*H*1.05:0),
        a=cl(tt/.08,0,1)*(o.end?1-.6*ko:1-eI(ko)),sx=lerp(.86,1,pp)*(1+.05*sl)*(1+.012*br)*(o.end?1:1-.22*eI(ko)),sy=lerp(.86,1,pp)*(1-.08*sl)*(1-.012*br)*(o.end?1:1-.22*eI(ko));
      if(a<=.01)return;const s=P(player.x+OX,player.y-BY,0),fl=s0<0?0:.42*(1-k)+.16*(1-ko)*(ko>0?1:0);
      ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.rect(s[0]-H*2,s[1]-H*3,H*4,H*3+1);ctx.clip();ctx.translate(s[0],s[1]+off);ctx.rotate(.016*Math.sin(tt*2.3)*(1-sl));ctx.scale(sx,sy);
      pdraw('taweret',g.foot[0],g.foot[1],f,{halo:G[2],ha:.45+.15*(.5+.5*Math.sin(tt*5))+.3*sl,lit:fl});ctx.restore();
      ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,.32);glowAt(0,0,H*.6,G[2],(.26+.3*sl)*a);glowAt(0,0,H*.3,'#fff6d8',(.05+.3*sl)*a);ctx.restore();}}));}
/* Hapi standing in the water behind him: rises out of the water (clipped at his water line, ripples and foam round his waist),
   tips his jars so the flood POURS from them from o.p0 to o.p1 seconds (two water ribbons into the water, splash crowns,
   ripples, drops), laughs (a little bob), then sinks back; o.big = the end pour (thicker, more splashes) */
function hapi(x,y,o){if(!GODON)return;o=o||{};x+=GX();const g=GOD.hapi,W=(o.w||176)*GK(),f=W/g.w,up=o.up||.5,p0=o.p0,p1=o.p1,dn=o.dn||.45,life=p1+dn+.05,big=o.big?1:0,st={on:0};
  A(new Gush({el:'water',x,y:y-12,w:big?60:72,h:big?120:150,life:.5}));crown(x,y+2,64,'water',{life:.45});A(new Ring({el:'water',x,y,r0:10,r1:W*.6,w0:10,w1:2,life:.5}));bits(S1(),'water',x,y,30,qn(10),{up:1.3,sp:1.1});
  if(!big)A(new Disc({x,y,r0:W*.5,kind:'pool',add:0,col:'#2f74bd',a:.42,life:p0+.6,fi:.15,fo:.45}));
  const Hv=g.foot[1]*f;
  A(new Fn({layer:'sorted',x,y,sortOff:-6,life,__gt:'-',fi:.01,fo:.01,d(q){const tt=q.t,im=img('hapi');if(!im)return;
      const r=eO(cl(tt/up,0,1)),pp=K_.back(cl(tt/up,0,1)),sink=eI(cl((tt-p1)/dn,0,1)),vis=r*(1-sink),bob=Math.sin(tt*5.5)*2*(1-sink),
        pour=cl((tt-p0)/.16,0,1)*(1-cl((tt-p1)/.22,0,1)),s=P(x,y,0),off=(1-vis)*Hv*1.04+bob,sc=lerp(.9,1,pp),rw=W*.34;
      st.on=vis>.02?1:0;st.pour=pour;st.wy=s[1];st.sx=s[0];
      const mp=jp=>[s[0]+(jp[0]-g.foot[0])*f*sc,s[1]+off+(jp[1]-g.foot[1])*f*sc];st.mL=mp(g.jarL);st.mR=mp(g.jarR);
      /* the water round his waist: dark water + the back half of the foam rim, then him, then the front half */
      ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,.3);ctx.globalAlpha*=cl(tt/.12,0,1)*(1-sink*.6);ctx.fillStyle='rgba(28,86,150,.5)';ctx.beginPath();ctx.arc(0,0,rw*1.15,0,TAU);ctx.fill();
      ctx.lineWidth=5;ctx.strokeStyle='rgba(235,250,255,.75)';ctx.beginPath();ctx.arc(0,0,rw,Math.PI,TAU);ctx.stroke();ctx.restore();
      if(vis>.01){ctx.save();ctx.beginPath();ctx.rect(s[0]-W*1.5,s[1]-W*2.5,W*3,W*2.5);ctx.clip();ctx.translate(s[0],s[1]+off);ctx.scale(sc,sc);
        pdraw('hapi',g.foot[0],g.foot[1],f,{halo:'#5fb6f2',ha:.34+.1*Math.sin(tt*4)+.2*pour});ctx.restore();}
      ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,.3);ctx.globalAlpha*=cl(tt/.12,0,1)*(1-sink*.6);ctx.lineWidth=6;ctx.strokeStyle='rgba(245,252,255,.9)';ctx.beginPath();ctx.arc(0,0,rw,0,Math.PI);ctx.stroke();
      ctx.lineWidth=2;for(let i=0;i<2;i++){const ph=(tt*.9+i*.5)%1;ctx.globalAlpha=(1-ph)*.6*(1-sink);ctx.strokeStyle='rgba(225,245,255,1)';ctx.beginPath();ctx.arc(0,0,rw*(1.05+ph*.7),0,TAU);ctx.stroke();}ctx.restore();}}));
  /* the two water ribbons (a separate piece so the element-gem tint can colour the water) */
  A(new Fn({layer:'sorted',x,y,sortOff:-5,life,fi:.01,fo:.01,d(q){if(!st.on||st.pour<=.01)return;const tt=q.t,ww=g.jw*f*(big?.78:.56);
      for(const [m,sd] of [[st.mL,-1],[st.mR,1]]){const lx=m[0]+sd*ww*.6,ly=st.wy+8;pourRibbon(m[0],m[1],lx,ly,sd,ww,st.pour,tt);
        if(tt-(q['c'+sd]||-9)>(big?.14:.22)){q['c'+sd]=tt;const wx=lx,wy=ly/KY();crown(wx,wy,big?40:30,'water',{life:.32});A(new Ring({el:'water',x:wx,y:wy,r0:6,r1:big?42:30,w0:4,w1:1,life:.5,a:.7}));if(Math.random()<.6)bits(S1(),'water',wx,wy,4,big?3:2,{up:.9,sp:.7,size:.75});}}}}));}
/* one stream of water from a jar mouth (x0,y0) down to the water (x1,y1), screen px: dark edge, light body, a white
   highlight that flows down (moving dashes), foam where it lands */
function pourRibbon(x0,y0,x1,y1,sd,w,a,t){const cx=x0+sd*w*1.1,cy=y0+(y1-y0)*.18,N=16,C=[];
  for(let i=0;i<=N;i++){const u=i/N,x=(1-u)*(1-u)*x0+2*(1-u)*u*cx+u*u*x1,y=(1-u)*(1-u)*y0+2*(1-u)*u*cy+u*u*y1;C.push([x,y,u]);}
  const side=e=>{const L=[],R=[];for(let i=0;i<=N;i++){const [x,y,u]=C[i],nb=C[Math.min(N,i+1)],pv=C[Math.max(0,i-1)],dx=nb[0]-pv[0],dy=nb[1]-pv[1],d=Math.hypot(dx,dy)||1,
      hw=(w*(1-.35*u)*(.88+.12*Math.sin(t*22+u*11))+e)/2;L.push([x-dy/d*hw,y+dx/d*hw]);R.push([x+dy/d*hw,y-dx/d*hw]);}return L.concat(R.reverse());};
  const poly=pts=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();};
  ctx.save();ctx.globalAlpha*=a;poly(side(3));ctx.fillStyle='rgba(18,62,120,.85)';ctx.fill();
  const gr=ctx.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,'#bfeaff');gr.addColorStop(.45,'#6cc4ff');gr.addColorStop(1,'#3f97e6');poly(side(0));ctx.fillStyle=gr;ctx.fill();
  ctx.lineCap='round';ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=Math.max(1.2,w*.2);ctx.setLineDash([w*.9,w*.8]);ctx.lineDashOffset=-t*w*9;ctx.beginPath();
  C.forEach((p,i)=>{const x=p[0]-sd*w*.16*(1-p[2]),y=p[1];i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.setLineDash([]);
  ctx.globalAlpha=a*.9;ctx.fillStyle='#f2fbff';for(let i=0;i<4;i++){const an=t*7+i*1.7,rx=w*(.55+.25*Math.sin(an)),ry=w*.22;ctx.beginPath();ctx.ellipse(x1+Math.cos(i*1.6)*w*.35,y1-1+Math.sin(an)*.8,rx,ry,0,0,TAU);ctx.fill();}
  ctx.restore();}

/* the flood's last wave: ONE circle of water that runs out from the centre (the 8 game waves of hSeaEnd only draw, they never
   hit — the ending hits everyone inside the flood at once, so a full circle tells the truth); far half behind what stands
   inside the circle, near half in front; each segment has its own light → dark gradient, a white foam crest, spray */
function ringWave(x0,y0,w){const sp=w.speed||560,len=w.len||300,life=len/sp+.32,ph=R_(0,TAU);
  const geo=(q,half)=>{const r=Math.min(len,12+q.t*sp),H=80*eO(cl(q.t/.1,0,1))*(1-.55*r/len)*(.55+.45*cl((life-q.t)/.3,0,1)),N=36,C=[],B=[],M1=[],M2=[];
    for(let i=0;i<=N;i++){const a=(half<0?Math.PI:0)+i/N*Math.PI,sa=Math.sin(a),ca=Math.cos(a),lump=1+.2*Math.sin(a*5+ph+q.t*6)+.1*Math.sin(a*11-q.t*9),hh=H*lump,
        rb=r-hh*.95*Math.max(0,-sa)+hh*.22*Math.max(0,sa),rc=r+hh*.08*Math.max(0,sa);   /* the near crest leans out a little: the wave runs outward */
      C.push(P(x0+ca*rc,y0+sa*rc,hh));B.push(P(x0+ca*rb,y0+sa*rb,0));
      for(const [k,arr] of [[.42,M1],[.7,M2]]){const rr=lerp(rb,rc,k);arr.push(P(x0+ca*rr,y0+sa*rr,hh*k));}}return {r,H,C,B,M1,M2};};
  const path=pts=>{ctx.beginPath();pts.forEach((c,i)=>i?ctx.lineTo(c[0],c[1]):ctx.moveTo(c[0],c[1]));};
  const draw=(q,half)=>{const {r,H,C,B,M1,M2}=geo(q,half);q.y=y0+half*r;if(H<3)return;const a=cl((life-q.t)/.26,0,1)*cl(q.t/.05,0,1),k=H/60;
    ctx.save();ctx.globalAlpha*=a;ctx.lineJoin='round';ctx.lineCap='round';
    /* the body: per segment light (top) to deep (foot) */
    for(let i=0;i<C.length-1;i++){const c0=C[i],c1=C[i+1],b0=B[i],b1=B[i+1],yt=Math.min(c0[1],c1[1]),yb=Math.max(b0[1],b1[1]);if(yb-yt<1)continue;
      const g=ctx.createLinearGradient(0,yt,0,yb);if(half<0){g.addColorStop(0,'#a9e3ff');g.addColorStop(.35,'#4ea6ea');g.addColorStop(1,'#246fbd');}else{g.addColorStop(0,'#b9ebff');g.addColorStop(.2,'#5db4f4');g.addColorStop(.65,'#2c80d2');g.addColorStop(1,'#184c90');}
      ctx.beginPath();ctx.moveTo(c0[0],c0[1]);ctx.lineTo(c1[0],c1[1]);ctx.lineTo(b1[0],b1[1]);ctx.lineTo(b0[0],b0[1]);ctx.closePath();ctx.fillStyle=g;ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.fill();ctx.stroke();}
    /* painted-wave bands running along the face (they flow) */
    for(const [arr,al,lw] of [[M2,.42,3],[M1,.24,2.2]]){path(arr);ctx.strokeStyle='rgba(200,240,255,'+al+')';ctx.lineWidth=lw*k;ctx.stroke();}
    if(half>0){path(B);ctx.strokeStyle='rgba(14,50,96,.55)';ctx.lineWidth=3;ctx.stroke();path(B);ctx.strokeStyle='rgba(255,255,255,.78)';ctx.lineWidth=2.2;ctx.stroke();}
    /* the foam rope on the crest: outlined cartoon puffs of different sizes */
    const puffs=[];for(let i=0;i<C.length*2-1;i++){const c0=C[i>>1],c1=C[Math.min(C.length-1,(i>>1)+(i&1))],c=[(c0[0]+c1[0])/2,(c0[1]+c1[1])/2],rr=(3.6+4.2*Math.abs(Math.sin(i*1.37+q.t*6+ph))*Math.abs(Math.sin(i*.41+ph)))*k;puffs.push([c[0],c[1]-rr*.4,rr]);}
    const OL='rgba(16,58,112,.8)';path(C);ctx.strokeStyle=OL;ctx.lineWidth=8*k+3.2;ctx.stroke();ctx.fillStyle=OL;for(const [x,y,rr] of puffs){ctx.beginPath();ctx.arc(x,y,rr+1.6,0,TAU);ctx.fill();}
    path(C);ctx.strokeStyle='#ffffff';ctx.lineWidth=8*k;ctx.stroke();ctx.fillStyle='#ffffff';for(const [x,y,rr] of puffs){ctx.beginPath();ctx.arc(x,y,rr,0,TAU);ctx.fill();}
    ctx.fillStyle='rgba(190,234,255,.85)';for(let i=0;i<puffs.length;i+=2){const [x,y,rr]=puffs[i];ctx.beginPath();ctx.arc(x+rr*.3,y+rr*.35,rr*.45,0,TAU);ctx.fill();}
    ctx.restore();};
  A(new Fn({layer:'sorted',x:x0,y:y0,life,fi:.01,fo:.01,d(q){draw(q,-1);}}));
  A(new Fn({layer:'sorted',x:x0,y:y0,life,fi:.01,fo:.01,d(q){draw(q,1);}}));
  A(new Emit({life:life-.22,every:.03,fn(q){const r=Math.min(len,12+q.t*sp),a=R_(0,TAU);bits(S1(),'water',x0+Math.cos(a)*r,y0+Math.sin(a)*r,46,1,{up:1.4,sp:.9,size:1.15});}}));
  A(new Disc({x:x0,y:y0,r0:30,r1:len*1.02,kind:'pool',add:0,col:'#1d5aa0',a:.22,life:life,fi:.05,fo:.3}));}
const HKS={
  basic(a){if(/Finish/.test(a.name||''))return;const phi=player.phi,side=((player.basicIdx||0)%2)?-1:1;pre(a,.11,L=>maceSwing(phi,side,L));},
  hnYawn(a){const phi=player.phi;at(a,a.windup,()=>yawnFx(phi));},
  hnFeast(a){},
  haGulp(a){let rec=null;first(a,a.windup,()=>{const L=hNear(player.x,player.y,HB.haGulp.R).sort((p,q)=>dist(p,player)-dist(q,player));rec=L[0]?[[L[0],L[0].x,L[0].y]]:[];});at(a,a.windup,()=>{if(rec)after(.04,()=>pullStreaks(rec));});},
  hcGobble(a){let rec=[];first(a,a.windup,()=>{rec=hNear(player.x,player.y,HB.hcGobble.R).filter(e=>!e.boss).map(e=>[e,e.x,e.y]);});at(a,a.windup,()=>{gulpVortex(0,0,BODY()*2.6,true);pullStreaks(rec);});},
  haBurp(a){const phi=player.phi;at(a,a.windup,()=>burpBlast(phi));},
  haWard(a){},
  haPound(a){},
  haMountain(a){at(a,.2,()=>{const x=player.x,y=player.y,S=S1();for(let i=0;i<7;i++){const an=i/7*TAU;A(new Flames({el:'fire',x:x+Math.cos(an)*22,y:y+Math.sin(an)*16,h:R_(26,40),w:20,n:2,life:.55,delay:R_(0,.05)}));}ring('fire',x,y,60,{w0:8,life:.35});bits(S,'fire',x,y,20,10,{up:1.2});});},
  haBehemoth(a){const T=(a.windup||0)/TEMPO();A(new Sigil({tex:ART.ring('taweret','gold'),el:'gold',follow:player,r:70,spin:1.2,life:T+.1,fi:T*.7,fo:.1,a:.9}));
    taweret({T,up:Math.min(.45,Math.max(.2,T*.7))});
    A(new Emit({life:T,every:.06,fn(){const a2=R_(0,TAU),d=R_(60,110);S1().add({im:tex('core',G[2]),x:player.x+Math.cos(a2)*d,y:player.y+Math.sin(a2)*d,z:R_(2,20),to:{x:player.x,y:player.y,z:BODY()*.5},s0:R_(5,8),s1:2,lin:1,life:R_(.25,.4),add:1,str:1.2,fi:.05,fo:.1});}}));},
  hbMud(a){},
  hbWallow(a){at(a,a.windup,()=>{const x=player.x,y=player.y,R=HB.hbWallow.R;A(new Ring({el:'mud',x,y,r0:20,r1:R*1.05,w0:10,w1:2,life:.5,a:.85}));bits(S1(),'mud',x,y,BODY()*.4,12,{up:1.5,sp:1.3,size:1});});},
  hbSplash(a){at(a,a.windup,()=>{const x=player.x,y=player.y,R=HB.hbSplash.R;for(let i=0;i<4;i++){const an=i/4*TAU+R_(-.3,.3)+.4;crown(x+Math.cos(an)*R*.55,y+Math.sin(an)*R*.55,R_(34,44),'mud',{life:.34,delay:.04});}
    bits(S1(),'mud',x,y,BODY()*.5,14,{sp:1.8,up:.9,size:1});});},
  hbWave(a){},
  hbBounty(a){},
  hbGeyser(a){},
  hbLotus(a){at(a,a.windup,()=>{for(const p of HIP.pools){if(!p.lotus)continue;const S=S1(),z=8;A(new Ring({el:'lotus',x:p.x,y:p.y,r0:6,r1:p.r*.8,w0:6,w1:1,life:.4}));bits(S,'lotus',p.x,p.y,z,8,{size:1});flash('lotus',p.x,p.y,16,.8);}});},
  hbQuick(a,c){let pt=null;try{pt=hPt(c,HB.hbQuick.range);}catch(_){}at(a,a.windup,()=>{if(!pt)return;const [x,y]=pt,R=HB.hbQuick.R;ring('sand',x,y,R,{w0:9,life:.45});dust({},x,y,R*.5,6,26,10);bits(S1(),'sand',x,y,6,12,{up:1.2,sp:1.4});});},
  hbWrath(a){at(a,a.windup,()=>{const x=player.x,y=player.y;crown(x,y,66,'water',{life:.45});A(new Ring({el:'water',x,y,r0:20,r1:120,w0:10,w1:2,life:.45}));bits(S1(),'water',x,y,30,14,{up:1.4,sp:1.2});});},
  hbSea(a){const T=(a.windup||0)/TEMPO();A(new Sigil({tex:ART.ring('nile','water'),el:'water',follow:player,r:90,spin:1,life:T+.1,fi:T*.7,fo:.1,a:.9}));
    hapi(player.x,player.y-40,{up:Math.min(.55,Math.max(.25,T*.8)),p0:Math.max(.2,T-.18),p1:T+1.5,dn:.5});
    A(new Emit({life:T,every:.05,fn(){const an=R_(0,TAU),d=R_(40,100);S1().add({im:spr('drop','water'),orb:1,cf:player,cx:player.x,cy:player.y,ang:an,va:5,r:d,vr2:-60,z:R_(0,10),vz:R_(60,120),s0:R_(7,11),life:R_(.4,.6),face:1,fa:Math.PI/2,fo:.2});}}));
    at(a,a.windup,()=>{const x=player.x,y=player.y,R=HB.hbSea.R;if(!godPic('hapi'))A(new Gush({el:'water',x,y,w:54,h:140,life:.55}));A(new Ring({el:'water',x,y,r0:40,r1:R,w0:14,w1:3,life:.6}));A(new Ring({el:'nile',x,y,r0:20,r1:R*.7,w0:9,w1:2,life:.5,delay:.08}));bits(S1(),'water',x,y,40,26,{up:1.5,sp:1.6,size:1.2});flash('water',x,y,40,1.6);});},
  hcChomp(a){for(const e of a.events.slice()){if(e._hv)continue;const t=e.t;pre(a,.16,L=>chompBite(L),t);}},
  hcSubmerge(a,c){const sx=player.x,sy=player.y,t=hTgt(c,400);let [tx,ty]=t?[t.x,t.y]:[sx+Math.cos(player.phi)*160,sy+Math.sin(player.phi)*160];try{if(!hFree(tx,ty)){tx=sx;ty=sy;}}catch(_){}
    const H=HB.hcSubmerge.hide;at(a,.02,()=>{bits(S1(),'water',sx,sy,10,6,{only:1,up:.6});subPeek(sx,sy,tx,ty,(H-.02)/TEMPO());});},
  hcJar(a){}};
for(const k in HP_MAKE){const s=SKILLS[k];if(!s||!s.make||s._hv)continue;const mk=s.make;s._hv=1;s.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){try{if(a.seq&&a.seq.length&&(a.seq[0].st==='buff'||a.seq[0].st==='gulp'))gatherFx(k,a);if(HKS[k])HKS[k](a,c||{});}catch(e){warn(k,e);}}return a;};}
{const MB=mkBasic;mkBasic=function(){const a=MB.apply(this,arguments);if(a&&a.events){try{HKS.basic(a);}catch(e){warn('basic',e);}}return a;};}

/* ---------------------------------------------------------------------
   8. the game's own pieces → the new ones
   --------------------------------------------------------------------- */
function himg(f){const n=f.n;if(n==='h09_lotusburst'){f.w=HB.hbLotusStorm.R*1.8;f.life=.45;const S=S1();bits(S,'lotus',f.x,f.y,20,14,{size:1.1,sp:1.3});A(new Ring({el:'lotus',x:f.x,y:f.y,r0:10,r1:HB.hbLotusStorm.R,w0:9,w1:1,life:.4}));floaters(S,spr('plus','life'),player.x,player.y,20,3,{s:11});return f;}
  if(n==='h11_melon'){feastMelon(f.x,f.y,f.z,f.w);return null;}
  if(n==='h12_gulp'){gulpVortex(f.x,f.y,f.w,false);return null;}
  if(n==='h13_burp')return null;
  return null;}
function gringFx(f){const k=window.SKCTX;if(k==='haWard')return wardCast();if(k==='hbBounty')return bountyCast();if(k==='haBehemoth')return quakeFx(f.x,f.y,f.r1);}
function wardCast(){const x=player.x,y=player.y,b=BODY(),S=S1();A(new Sigil({tex:ART.ring('taweret','gold'),el:'gold',follow:player,r:b*1.25,spin:.9,life:1.1,fi:.1,fo:.5,a:.95}));A(new Ring({el:'gold',x,y,r0:b*1.9,r1:b*.5,w0:3,w1:9,life:.42}));
  A(new Spr({im:spr('hpAnkh','gold'),follow:player,z:b*1.35,vz:24,w:16,life:1,pop:.16,s0:.3,s1:1,fo:.4,glow:G[2],gk:1.4,layer:'top'}));glints(S,G[3],x,y,b*.7,8,b*.6,.7);}
function bountyCast(){const x=player.x,y=player.y,b=BODY(),S=S1();A(new Sigil({tex:ART.ring('nile','life'),el:'life',follow:player,r:b*1.3,spin:.7,life:1.1,fi:.1,fo:.5,a:.9}));ring('water',x,y,70,{w0:6,life:.4});
  for(let i=0;i<qn(12);i++)S.add({im:spr(i%3?'drop':'petal',i%3?'water':'lotus',i),orb:1,cf:player,cx:x,cy:y,ang:R_(0,TAU),va:R_(5,8),r:R_(18,30),vr2:-8,z:R_(0,10),vz:R_(70,120),s0:R_(8,12),life:R_(.5,.8),fo:.3,face:i%3?1:0,fa:Math.PI/2,rot:R_(0,TAU),delay:R_(0,.15)});
  floaters(S,spr('plus','life'),x,y,22,5,{s:11,delay:.2});}
function quakeFx(x,y,r){const S=S1();A(new Ring({el:F.dust(),x,y,r0:r*.3,r1:r,w0:16,w1:3,life:.38}));A(new Ring({el:'gold',x,y,r0:r*.25,r1:r*.9,w0:6,w1:1,life:.32,delay:.03}));
  A(new HCrack({el:'earth',x,y,r:BODY()*.9,n:5,hot:0,life:.8,w:2.2}));for(let i=0;i<qn(8);i++){const a=R_(0,TAU),d=r*R_(.8,.98);puffs(sys('sorted',y+Math.sin(a)*d+1),F.dust(),x+Math.cos(a)*d,y+Math.sin(a)*d,4,1,30,30,16,.6);}bits(S,'earth',x,y,4,6,{up:.9,sp:1.4,size:.8});}
function crackFx(f){A(new HCrack({el:'earth',x:f.x,y:f.y,r:(f.r||80),n:8,hot:0,life:1.8,w:2.8}));if((f.r||80)>=80)craterPic(f.x,f.y,(f.r||80)*2.2,1.6);}
function exFx(f){ring('gold',f.x,f.y,Math.max(40,f.r1||46),{w0:5,life:.4});A(new Spr({im:spr('hpAnkh','gold'),follow:player,z:BODY()*1.3,vz:24,w:13,life:.6,pop:.14,s0:.4,s1:1,fo:.3,layer:'top'}));}
const DROP=new Set(['GRing','Impact','Crack','StarCut']),NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},active:false});
const A0=window.addFx;window.addFx=addFx=function(f){if(f&&!(f instanceof K_.Part)&&!(f instanceof K_.Sys)){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(n==='DText'&&GODON&&/^(BEHEMOTH|GREAT INUNDATION|ทับยักษ์!|คลื่นยักษ์!|Behemoth Drop|The Great Inundation)$/.test(f.text||''))f.z=Math.max(f.z||0,198);   /* the ult names float over the god's crown, not over its face */
    if(n==='Trail')return {layer:'none',active:true,s:[],add(){},update(){return false;},draw(){}};
    if(f instanceof HImg){let r=null;try{r=himg(f);}catch(e){warn('himg',e);}return r?A0.call(this,r):NOFX();}
    if(f instanceof HBit)return NOFX();
    if(f instanceof HGeyser){try{geyserFx(f.x,f.y,f.R||70);}catch(e){warn('geyser',e);}return A0.apply(this,arguments);}
    if(f instanceof HWave){if(HV.seaEnd&&f.big){f._ring=1;HV.ringW.push(f);return A0.apply(this,arguments);}try{waveFx(f);}catch(e){warn('wave',e);}return A0.apply(this,arguments);}
    if(f instanceof HProj){try{projFx(f);}catch(e){warn('proj',e);}return A0.apply(this,arguments);}
    if(n==='Ghost'&&player.action){if(player.jgHide||(HV.gk=(HV.gk||0)+1)%3)return NOFX();f.color='#8fe0d4';f.life=.15;return A0.apply(this,arguments);}
    if((n==='GRing'||n==='Impact')&&f.color==='#ffe9a8'){try{if(n==='GRing')exFx(f);else{const p=f.pos||[f.x,f.y,24];flash('gold',p[0],p[1],p[2]||24,.9);}}catch(e){warn('ex',e);}return NOFX();}
    if(n==='RuneCircle'&&f.color==='#6fc8ff'&&player.casting){const k=player.casting.key,b=hBranch(k)==='B';return A(new Sigil({tex:ART.ring(b?'nile':'taweret',b?'water':'gold'),el:b?'water':'gold',follow:player,r:BODY()*1.25,spin:1.2,life:f.life||.5,fi:.15,fo:.2,a:.9}));}
    if(mine()&&DROP.has(n)){try{if(n==='GRing')gringFx(f);else if(n==='Crack')crackFx(f);}catch(e){warn(n,e);}return NOFX();}}
  return A0.apply(this,arguments);};
const EM0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune)$/.test(o.type))return;return EM0.apply(this,arguments);};
/* hit sparks + the belly that bounces blows back + Taweret's ward taking a blow */
{const AH=window.jgAfterHurt;window.jgAfterHurt=function(e,dmg,crit,o){const r=AH?AH.apply(this,arguments):undefined;try{if(o&&!o.dot&&dmg)hitFx(e,o,crit);}catch(er){warn('hit',er);}return r;};}
{const AB=window.jgAbsorb;window.jgAbsorb=function(d,e){const bn=HIP.bellyN,w=hasBuff('haWard'),sh=HIP.shield,r=AB?AB.apply(this,arguments):d;
  try{const x=player.x,y=player.y,b=BODY(),an=e?Math.atan2(e.y-y,e.x-x):player.phi,hx=x+Math.cos(an)*b*.5,hy=y+Math.sin(an)*b*.5;
    if(bn>0&&HIP.bellyN===0&&hL('haBelly')){A(new Ring({el:'lotus',follow:player,r0:b*.4,r1:b*1.2,w0:8,w1:1,life:.3}));A(new Ring({el:'teal',follow:player,r0:b*.3,r1:b,w0:5,w1:1,life:.28,delay:.06}));if(e)A(new Streak({el:'lotus',x:hx,y:hy,x2:e.x,y2:e.y,z:b*.4,w:10,life:.22,go:.5,head:0}));}
    if(w){HV.wardHit=gameTime;burst('gold',hx,hy,b*.5,.6,{n:7,life:.18});sparks(S1(),G[3],hx,hy,b*.5,4,180,90,.3);}
    if(sh>0&&HIP.shield<sh){flash('gold',hx,hy,b*.5,.6,{life:.12});}}catch(er){warn('absorb',er);}return r;};}

/* ---------------------------------------------------------------------
   9. gauges + the auras + the watcher
   --------------------------------------------------------------------- */
HAura.prototype.__gt='-';HOverlay.prototype.__gt='-';HCore.prototype.__gt='-';
HAura.prototype.draw=guardDraw('aura',function(){const s=P(player.x,player.y,0),sz=HSZ()*Math.max(.55,HK()*1.05),wh=cl(1-(gameTime-(HV.wardHit||-9))/.22,0,1);
  if(this.b>0){const im=img('aura');if(im)picAt(im,s[0],s[1]+8,150*sz*(1+.04*Math.sin(this.t*10)),{a:.85*this.b,ay:.86});}
  if(this.w>0){const im=img('ward');if(im){const w=130*sz,o={a:.55*this.w*(.85+.15*Math.sin(this.t*4)),ay:.9};picAt(im,s[0],s[1]+8,w,o);if(wh>0)picAt(im,s[0],s[1]+8,w,{a:.6*wh*this.w,ay:.9,add:1});}}});
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
HOverlay.prototype.draw=guardDraw('overlay',function(){const s=P(player.x,player.y,0),x=s[0],y=s[1],w=50,cap=hCap(),f=cl(HIP.full/cap,0,1),t=this.t,full=f>=.999;
  rr(x-w/2-2,y+9,w+4,9,4.5);ctx.fillStyle='rgba(22,14,8,.66)';ctx.fill();ctx.save();rr(x-w/2,y+11,w,5,2.5);ctx.clip();const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#ffb04a');g.addColorStop(.6,'#ffd36a');g.addColorStop(1,'#fff1b0');ctx.fillStyle=g;ctx.fillRect(x-w/2,y+11,w*f,5);
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-w/2,y+11,w*f,1.6);ctx.restore();
  ctx.fillStyle='rgba(22,14,8,.75)';for(let i=1;i<cap/20;i++){const tx=x-w/2+w*i*20/cap;ctx.fillRect(tx-.6,y+11,1.2,5);}
  if(full){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.25*Math.sin(t*6);ctx.drawImage(tex('glow',G[2]),x-w*.7,y+2,w*1.4,22);ctx.restore();}
  ctx.font='700 8px Cinzel, serif';ctx.textAlign='center';ctx.lineWidth=2.6;ctx.strokeStyle='rgba(20,12,6,.85)';const lb='อิ่ม '+Math.round(HIP.full);ctx.strokeText(lb,x,y+27);ctx.fillStyle=full?'#ffe89a':'#fff6e0';ctx.fillText(lb,x,y+27);
  if(HIP.gulp&&!HIP.gulp.e.dead){const q=P(HIP.gulp.e.x,HIP.gulp.e.y,topZ(HIP.gulp.e)+18);ctx.font='700 10px Cinzel, serif';ctx.strokeText('อม!',q[0],q[1]);ctx.fillStyle=G[3];ctx.fillText('อม!',q[0],q[1]);}
  ctx.textAlign='start';});
const LIVE={};
function keep(key,on,mk,id){const cur=LIVE[key];if(on){if(!cur||cur.id!==id||!cur.parts.every(p=>fx.includes(p))){if(cur)cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]={id,parts:grab(mk)};}}else if(cur){cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]=null;}}
function watch(){const nap=hasBuff('hnNap');if(HV.nap&&!nap)napPop();HV.nap=nap;keep('nap',nap,napFx);keep('shield',HIP.shield>0,shieldFx);
  const g=HIP.gulp&&!HIP.gulp.e.dead?HIP.gulp.e:null;keep('gulp',!!g,()=>gulpHoldFx(g),g);keep('beh',hasBuff('haBehemoth'),behFx);
  /* the gods come back for the endings: Taweret rises just before Behemoth runs out, Hapi just before the flood's last wave */
  const bb=player.buffs&&player.buffs.haBehemoth;if(bb&&bb.t>0){if(bb.t<.42&&!HV.behPre){HV.behPre=1;taweret({up:.24,out:.55,end:1,max:3,go:t=>!hasBuff('haBehemoth')||t>1.4});}}else HV.behPre=0;
  if(HIP.sea){const s2=HIP.sea,left=s2.until-gameTime;if(left<.45&&HV.seaPre!==s2){HV.seaPre=s2;hapi(s2.x,s2.y-40,{up:.3,p0:Math.max(.18,left-.12),p1:left+.55,dn:.42,big:1});}}
  const sea=HIP.sea;keep('sea',!!sea,()=>seaFx(sea),sea);const j=HIP.jar;keep('jar',!!j,()=>jarFx(j),j);const hot=HIP.hot&&HIP.hot.until>gameTime?HIP.hot:null;keep('hot',!!hot,hotFx,hot);poolKeep();
  if(hL('hnSweat')){if(HV.sweatT!=null&&HIP.sweatT<HV.sweatT-.5){const b=BODY();bits(S1(),'melon',player.x,player.y,b*.7,4,{only:1,sp:.3,up:.2,size:.8});}HV.sweatT=HIP.sweatT;
    if(HV.sweatCD!=null&&HIP.sweatCD>HV.sweatCD+.5){const b=BODY();bits(S1(),'melon',player.x,player.y,b*.6,10,{only:1,sp:1,up:.8,size:.9});A(new Ring({el:'red',x:player.x,y:player.y,r0:10,r1:b*1.2,w0:6,w1:1,life:.35}));}HV.sweatCD=HIP.sweatCD;}}
{const UU=HCore.prototype.update;HCore.prototype.update=function(dt){const jar=HIP.jar;window.__HIPTICK=1;let r;try{r=UU.call(this,dt);}finally{window.__HIPTICK=0;}
  const sk=window.SKCTX;window.SKCTX=null;window.__HIPTICK=1;try{if(jar&&!HIP.jar)jarBreak(jar);watch();}catch(e){warn('watch',e);}finally{window.__HIPTICK=0;window.SKCTX=sk;}return r;};}
{const SE=window.hSeaEnd;window.hSeaEnd=function(){const s=HIP.sea;HV.seaEnd=1;HV.ringW=[];let r;try{r=SE.apply(this,arguments);}finally{HV.seaEnd=0;}
  try{if(s&&HV.ringW.length)ringWave(s.x,s.y,HV.ringW[0]);}catch(e){warn('ring',e);}
  try{if(s){if(!godPic('hapi'))A(new Gush({el:'water',x:s.x,y:s.y,w:70,h:170,life:.6}));A(new Ring({el:'water',x:s.x,y:s.y,r0:30,r1:s.R*1.05,w0:20,w1:3,life:.6}));flash('water',s.x,s.y,40,1.8);bits(S1(),'water',s.x,s.y,40,30,{up:1.6,sp:1.8,size:1.2});}}catch(e){warn('seaEnd',e);}return r;};}
HV.ready=1;
})();
