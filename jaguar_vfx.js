/* =====================================================================
   ECLIPSE JAGUAR DANCER (Aztec) — skill effects v3: SVG art (jaguar_art.js) + code VFX.
   Owner 2026-11-25 "ทำเอฟเฟกต์สกิลของจากัวใหม่ทั้งหมดให้หน่อย": the same brief as the cat, kitsune, axolotl, dragon, lion, croc,
   sheep and Bastet — every skill drawn with SVG + code VFX that follows its concept AND what it really does (Prey Marks 0–3,
   Eclipse Brand 0–3, bleed, venom, blind / backstab, the mirror, the trap, the clones …), in step with the frame its damage lands.
   Kit: window.K3 (cat_vfx.js) + window.VK (wolf_vfx3.js).

   CONCEPT (her sheet assets/heroes/jaguar/sheet_eclipse_dancer.webp): an Aztec jaguar dancer with twin curved obsidian daggers.
     Basic "Jungle Initiate" = obsidian violet + temple gold + jungle leaves: twin dagger cuts, paw prints, the roaring spirit head,
       the hunter's eyes, crossed-dagger guard, armour plates breaking.
     A "Blood Fang" = crimson + gold: claw rakes, blood, the golden spirit jaguar (its paw, its leap), Prey Marks (gold claw scratches),
       the war drum of Savage Tempo, the execution cut.
     B "Eclipse Shadow" = the black sun with a spiky gold corona, violet shadow wisps, turquoise rims, jade venom (the serpent sigil,
       the venom bloom), Tezcatlipoca's smoking obsidian mirror, the moon trap's obsidian teeth, obsidian spears of the Fifth Sun.
     C = its column; the sun-stone ring (Aztec calendar) is every ritual circle.

   TIMING (gameplay never touched)
   · Dagger cuts: every strike calls slashAt(a,kC) one frame before its contact frame kC → the cut is a K3.KArc told how long it is
     until seqTimeAt(a.seq,kC): its edge is on the target exactly when the damage lands (lead = rt(event − now)).
   · Per-target pieces come from jgStrikes' own `each` (the contact event, once per enemy hit) and per-strike pieces from `after`.
   · Hit sparks come from the damage itself (jh is wrapped), crit stars from jgAfterHurt (it knows the crit).
   · Things that fly (spears, the spirit jaguar, the paw, the seal) keep the game's own update(): the picture is where the game
     resolves the hit (onHit / onLand on the same frame).
   HOW IT HOOKS IN: the jaguar-only classes are repainted through their prototypes (MarkOverlay, JgReticle, SpectralPounce, GiantClaw,
   ObsSpear, DarkSun, HorizonWave, ShadowPath, ChainLink, ObsMirror, MoonTrap, SealDisc, BloodMoon, PoisonPuddle, MoonCut, SlashScar,
   JgRupture, JgExecute, JgEye, XGuard, BackTick); generic pieces the jaguar's code makes (GRing, Streak, LineCut, ClawMarks,
   RuneCircle = SunStone, Drain, SoundArcs, Crosshair, LightPillar, MirrorShardArt) are converted into v3 pieces at the same place
   and time while her code runs; the old layers (TexArc / StarCut / KnifeOrbit / ZigzagDash / SmokePuff / painted JxImg …) are off.
   ?vfx3=0 = the old look (char_jaguar_fx.js paints then). Plan + per-skill table: JAGUAR_FX_PLAN_TH.md.
   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black ink shape behind so pale pieces
   read on snow; debris is shaped (obsidian chips, leaves, feathers, blood drops, armour plates), never round dots.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='jaguar'||!window.K3||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const {TAU,cl,eO,eI,eIO,back,lerp,R_,scr,art,sprite,star,KGlint,KLine,KBurst,ring,KStreak,KArc,petals,embers,dust,stones,ensure}=window.K3;
const V=window.VK,{sys,tx,G}=V,AR=window.KTA;
const JV=window.JGV={on:1};
/* PAINTED PIECES (owner 2026-11-25: his 5 ChatGPT paintings, prompts JAGUAR_FX3_PROMPTS_TH.md): the golden spirit's paw, its leap, its
   roaring head, the blood moon and the black sun replace those SVG pieces wherever they are drawn (art() and sprite() of cat_vfx.js
   read window.KPIC): same size, anchor, turn, mirror and timing — only the picture changes. Cut off green by tools/glow_cut.py
   (sources in assets/fx/jaguar/raw/). box = where the SVG piece's own box lies in the painting, measured so the bodies line up:
   moon = the disc (SVG r 32, painted ×1.1 because the dashed ring is gone) · sun = the ray tips · paw = the widest toes (SVG pad 82)
   and the claw tips · leap / head = the whole animal (one scale = the geometric mean of width and height, centres together).
   Third number = size about the anchor: the painted paw's flaming forearm runs much higher than the SVG's faded one (×.85), the
   roaring head sits behind her shoulder and needs a little more presence (×1.15).
   The SVG draws until a picture has loaded; ?jgpic=0 = the SVG pieces. */
const JPIC={paw:['jg_paw',[-.1919,.2701,1.1468,1.0018],.85],jagLeap:['jg_spirit_leap',[.0314,-.1712,.9424,1.059]],
  jagHead:['jg_spirit_roar',[-.1171,-.001,1.0332,.9404],1.15],moon:['jg_blood_moon',[-.0669,-.0836,1.0357,1.0733]],
  eclipse:['jg_black_sun',[-.0181,-.0071,1.0161,1.009]]};
if(!/[?&]jgpic=0/.test(location.search)){const KP=window.KPIC=window.KPIC||{};for(const n in JPIC){const im=new Image();im.decoding='async';im.src='assets/fx/jaguar/'+JPIC[n][0]+'.webp?v=1';KP[n]={img:im,box:JPIC[n][1],k:JPIC[n][2]||1};}}
JV.pic=n=>!!(window.KPIC&&KPIC[n]&&KPIC[n].img.complete&&KPIC[n].img.naturalWidth);
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('jaguar');
/* her painted sprite is fine and small: the coloured rim the engine draws round the hero during an action (player.glow) is softened ×.4, as the dragon / lion / Bastet do */
if(typeof drawPlayerAura==='function'){const DPA0=drawPlayerAura;drawPlayerAura=function(){const g=player.glow;if(!g||!g.k)return DPA0.apply(this,arguments);const k0=g.k;g.k=k0*.4;try{return DPA0.apply(this,arguments);}finally{g.k=k0;}};}
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75,rt=s=>s/TEMPO();
const HZ=()=>window.HERO_K||1;
/* palettes: [ink, deep, mid, lite, core] */
const OBS=['#05030a','#2a1846','#8a5ad0','#e0ccff','#ffffff'],GLD=['#2e1a04','#b8741a','#ffc23a','#ffe89a','#ffffff'],
  CRM=['#2a0408','#a40c24','#ef2a40','#ff9a8a','#fff2ec'],TRQ=['#04282c','#138a8a','#38e0d0','#c0faf2','#ffffff'],
  VIO=['#0c0618','#4a1f8a','#9a5af0','#dcc4ff','#ffffff'],JAD=['#04281c','#14825a','#2fd6a0','#b8ffe0','#ffffff'],
  RGD=['#2a0806','#b8320c','#ff6a2a','#ffd27a','#fff8e0'],TWI=['#0c0618','#3a1a6a','#38e0d0','#c8fff6','#ffffff'];
const SHADET='#9a7ac8|#140c20',JADET='#b8ffe0|#0a4a34',BLOODT='#ff8a7a|#4a0610';
const NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},burst(){},crack(){},shatter(){},active:false,s:[]});
const zOf=e=>e?(e.boss?42:26)*(e.sc||1)+(e.z||0):26;
const topZ=e=>e?(e.boss?74:50)*(e.sc||1)+(e.z||0):50;
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const later=(s,f)=>setFxTimer(s,f);
const at=(a,t,f)=>{t=Math.max(0,t);const T=a.seq?seqTotal(a.seq):0;if(T&&t>T-.005){setFxTimer(rt(t),f);return;}(a.events=a.events||[]).push({t,f});};
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__JGT||window.__JGSELF);
const self=f=>{const o=window.__JGSELF;window.__JGSELF=1;try{return f();}finally{window.__JGSELF=o;}};
const quiet=f=>{const o=window.__JGQUIET;window.__JGQUIET=1;try{return f();}finally{window.__JGQUIET=o;}};
const SC={};function S1(l='top'){const k=l+'|'+(window.SKCTX||'');let s=SC[k];if(!s||!s.p||!fx.includes(s))s=SC[k]=sys(l,.25);return s;}
const brOf=k=>{const s=k&&SKILLS[k];if(!s)return k==='basic'?'N':'N';if(s.br==='C')return s.col||({jcEcho:'A',jcSkyPounce:'A',jcThousand:'A',jcGodfall:'A',jcSeal:'B',jcCorridor:'B',jcChain:'B',jcEternal:'B'}[k]||'N');return s.br==='basic'?'N':s.br;};
const palBr=b=>b==='A'?CRM:b==='B'?TWI:OBS;
const hexRGB=h=>{if(!h||h[0]!=='#')return [150,110,230];let s=h.slice(1);if(s.length===3)s=s.split('').map(c=>c+c).join('');const n=parseInt(s.slice(0,6),16);return [n>>16&255,n>>8&255,n&255];};
function palOf(h){const [r,g,b]=hexRGB(h);if(r<90&&g<90&&b<110)return OBS;if(g>150&&b>150&&r<140)return b>=g-20?TRQ:JAD;if(g>150&&r<140)return JAD;
  if(r>200&&g>160&&b<170)return GLD;if(r>200&&g>=90&&g<=160&&b<120)return RGD;if(r>150&&g<120)return CRM;if(b>140&&r>80)return VIO;return OBS;}
const OLDPAL=c=>{const gl=c&&c.glow;return gl==='#8fb8ff'?GLD:gl==='#7a3aa8'?OBS:gl==='#d81e3a'?CRM:gl==='#2fd6b0'?JAD:gl==='#6a3ad8'?TWI:gl==='#e8b44a'?GLD:gl==='#ff6a1e'?RGD:gl?palOf(gl):OBS;};
function glowAt(sx,sy,w,h,col,a){if(a<=.01||w<1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,a);ctx.drawImage(tx('glow',col),sx-w/2,sy-h/2,w,h);ctx.restore();}
const nearFront=(r=150)=>{let b=null,d=r;for(const e of enemies){if(e.dead)continue;const q=Math.hypot(e.x-player.x,e.y-player.y)-(e.r||0)*.5;if(q>d)continue;const an=Math.abs(Math.atan2(Math.sin(Math.atan2(e.y-player.y,e.x-player.x)-player.phi),Math.cos(Math.atan2(e.y-player.y,e.x-player.x)-player.phi)));if(an<1.2){d=q;b=e;}}return b;};

/* ---------------------------------------------------------------------
   1. DEBRIS — obsidian chips, armour plates, blood and venom drops, leaves, feathers, shadow wisps
   --------------------------------------------------------------------- */
const CHIP=['chip0','chip1','chip2'];
function bits(names,x,y,z,n,o={}){const S=S1('top');for(let i=0;i<qn2(n);i++){const im=AR.get(names[i%names.length]);if(!im)continue;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.7:o.spread):R_(0,TAU),v=(o.spd||180)*R_(.35,1);
  S.add({im,x:x+R_(-5,5),y:y+R_(-3,3),z:z+R_(-4,6),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.7+(o.vy||0),vz:(o.up||200)*R_(.4,1.1),g:o.g==null?760:o.g,dr:o.dr||.8,s0:R_(9,12)*(o.s||1),s1:R_(7,10)*(o.s||1),life:(o.life||.55)*R_(.75,1.15),fo:.3,rot:R_(0,TAU),vr:R_(-14,14),bounce:o.bounce==null?.2:o.bounce,asp:o.asp||1});}}
const chips=(x,y,z,n,o={})=>bits(CHIP,x,y,z,n,o);
const plates=(x,y,z,n,o={})=>bits(['plate0','plate1'],x,y,z,n,Object.assign({s:1.7,spd:200,up:240,asp:.83},o));
const blood=(x,y,z,n,o={})=>bits(['bdrop'],x,y,z,n,Object.assign({s:.9,spd:120,up:170,asp:1.33,bounce:.05,g:900},o));
const venom=(x,y,z,n,o={})=>bits(['vdrop'],x,y,z,n,Object.assign({s:.9,spd:110,up:160,asp:1.33,bounce:.05,g:860},o));
function leaves(x,y,z,n,o={}){for(let i=0;i<3;i++)petals(x,y,z,Math.max(1,Math.round(n/3)),Object.assign({im:'leaf'+i,asp:i===2?2.3:1.8,dk:'#06280e',s:.85,spd:130,up:70,life:R_(.8,1.1),rest:.2},o));}
function feathers(x,y,z,n,o={}){for(let i=0;i<2;i++)petals(x,y,z,Math.max(1,Math.round(n/2)),Object.assign({im:'feather'+i,asp:3.3,dk:'#200408',s:.8,spd:90,up:90,term:.7},o));}
function wisp(x,y,z,o={}){return sprite(Object.assign({n:Math.random()<.5?'wisp0':'wisp1',x,y,z,w:R_(22,32),ay:.95,life:R_(.6,.9),fi:.08,fo:.45,s0:.5,s1:1.1,vz:R_(14,30),vx:R_(-10,10),layer:'top'},o));}
function smoke(x,y,z,n,t=SHADET,size=46,o={}){G.smoke(S1(o.layer||'top'),x,y,z,n,t,size,o.sp||40,o.life||.8,o.rise==null?18:o.rise);}
const flare=(x,y,z,s,col,life)=>G.flare(S1('top'),x,y,z,s,col,life||.24);
/* the colour accent the skill code asked for (stab col) */
function spark(e,pal,big,o={}){if(!e)return;const z=zOf(e),bs=(e.boss?1.3:1)*(big?1.25:1);
  addFx(new KGlint({e,x:e.x,y:e.y,z,s:(big?20:13)*bs,col:pal[2],life:big?.22:.15,delay:o.delay||0}));
  addFx(new KLine({e,x:e.x,y:e.y,z,ang:o.ang==null?R_(-.95,.95):o.ang,L:(big?74:46)*bs,w:big?4.4:3,pal,hold:.03,fade:.13,ink:.42,delay:o.delay||0}));
  chips(e.x,e.y,z,big?5:2,{spd:big?220:150,up:big?240:170,s:big?1.1:.9});
  if(pal===CRM||pal===RGD)blood(e.x,e.y,z,big?4:2);else if(pal===JAD)venom(e.x,e.y,z,big?4:2);
  if(big)addFx(new KBurst({e,x:e.x,y:e.y,z,R:32*bs,n:9,pal,ink:.5}));}

/* ---------------------------------------------------------------------
   2. PIECES
   --------------------------------------------------------------------- */
/* a flat picture on the ground that opens, holds and fades (gouges, prints, sigils, sun rings) */
function flat(n,x,y,w,o={}){return sprite(Object.assign({n,x,y,z:0,w,flat:1,layer:'ground',life:1.2,fi:.05,fo:.45,s0:.6,s1:1,pop:.14},o));}
/* claw rake on a target: three curved cuts that rip across (slides along its cut, then fades) */
function rake(e,col='C',o={}){if(!e)return;const z=zOf(e)+(o.dz||0),w=(o.w||54)*(e.boss?1.3:1),side=o.flip!=null?o.flip:(Math.random()<.5?-1:1);
  return sprite(Object.assign({n:'rake'+col,x:e.x,y:e.y,z,w,follow:e.dead?null:e,life:.32,fi:.015,fo:.18,s0:.55,s1:1.06,pop:.08,rot:o.rot==null?R_(-.25,.25):o.rot,sx:side,layer:'top'},o));}
/* the gouges a claw tears in the ground */
function gouge(x,y,phi,col='C',w=70,o={}){return flat('gouge'+col,x,y,w,Object.assign({rot:scr(phi),life:o.life||1.6,fo:.6,s0:.3,s1:1,pop:.1},o));}
/* a dagger flick: the cut is on the target at `lead` seconds (twin daggers cross: shape x1 / x2) */
/* twin-dagger cuts are short crescents in front of her body (the hit spark shows on the target): x1 = high left → low right,
   x2 = high right → low left (together an X), the edge passes the front of her (θ 0, weapon height) on the contact frame */
const CUT={x1:[.9,1.15,-1.2],x2:[-.9,-1.15,1.2],flat:[.12,-1.35,1.35],flatR:[-.12,1.35,-1.35],down:[1.35,1.5,-.55]};
function jcut(o){const c=CUT[o.shape]||CUT.x1,R=o.R||50,W=o.W||10,lead=cl(o.lead==null?.04:o.lead,.012,.16);
  return addFx(new KArc({x:player.x,y:player.y,follow:1,fz:(o.z||36)*HZ()+(player.z||0),phi:o.phi==null?player.phi:o.phi,tilt:c[0],a0:c[1],a1:c[2],lead,sweep:lead+(o.sw||.05),hold:o.hold||.015,fade:o.fade||.11,
    R,W,pal:o.pal||OBS,ink:o.ink==null?.45:o.ink,N:22,edge:.24,glint:o.glint==null?.8:o.glint,trail:o.trail||0}));}
/* obsidian dagger thrown at a point (Thousand Cuts, Mirror Shatter): arrives exactly at `T` seconds */
class JDagger{constructor(o){Object.assign(this,{t:0,layer:'top',T:.2,z0:50,z1:26,w:30,n:'dagger'},o);this.life=this.T+.14;this.__gt='-';}
  update(dt){this.t+=dt;if(this.t>=this.T&&!this.hit){this.hit=1;const e=this.e;if(e&&!e.dead){chips(e.x,e.y,zOf(e),4,{dir:Math.atan2(e.y-this.sy0,e.x-this.sx0),spread:.6});flare(e.x,e.y,zOf(e),26,'#b48aff',.2);}}return this.t<this.life;}
  get tx(){return this.e&&!this.e.dead?this.e.x:this.ex;}get ty(){return this.e&&!this.e.dead?this.e.y:this.ey;}
  draw(){const k=cl(this.t/this.T,0,1),x=lerp(this.sx0,this.tx,eI(k)),y=lerp(this.sy0,this.ty,eI(k)),z=lerp(this.z0,this.z1,k),[px,py]=P(x,y,z),[qx,qy]=P(this.tx,this.ty,this.z1),ang=Math.atan2(qy-py,qx-px),a=this.t<this.T?cl(this.t/.05,0,1):cl(1-(this.t-this.T)/.14,0,1);
    ctx.save();ctx.globalAlpha=a*.45;ctx.strokeStyle='#8a5ad0';ctx.lineWidth=3;ctx.lineCap='round';const [bx,by]=P(lerp(this.sx0,this.tx,eI(Math.max(0,k-.25))),lerp(this.sy0,this.ty,eI(Math.max(0,k-.25))),lerp(this.z0,this.z1,Math.max(0,k-.25)));ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(px,py);ctx.stroke();ctx.restore();
    art(this.n,px,py,this.w,{rot:ang,a,ax:.78,ay:.5});}}
function throwDagger(sx,sy,z0,e,T,o={}){if(!e)return;return addFx(new JDagger(Object.assign({sx0:sx,sy0:sy,z0,e,ex:e.x,ey:e.y,T,z1:zOf(e)},o)));}
/* a column of light rising from the ground (a summon: the Ancestral Spirit) — soft additive body, white core, dark contact pool */
class JBeam{constructor(o){Object.assign(this,{t:0,layer:'top',r:24,h:260,life:.66,pal:TRQ},o);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=Math.sin(Math.PI*Math.min(1,k*1.2)),[x,y]=P(this.x,this.y,0),[,ty]=P(this.x,this.y,this.h*eO(Math.min(1,k*3))),w=this.r*(1-.5*k),p=this.pal;
    ctx.save();ctx.globalAlpha=.35*a;ctx.fillStyle=p[0];ctx.beginPath();ctx.ellipse(x,y,w*1.6,w*1.6*K,0,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';
    for(const [ww,col,al] of [[w*1.5,p[1],.35],[w,p[2],.55],[w*.45,p[3],.8],[w*.16,'#ffffff',.9]]){const g=ctx.createLinearGradient(0,ty,0,y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.25,col);g.addColorStop(1,col);ctx.globalAlpha=al*a;ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-ww,y);ctx.lineTo(x-ww*.55,ty);ctx.lineTo(x+ww*.55,ty);ctx.lineTo(x+ww,y);ctx.closePath();ctx.fill();}
    ctx.restore();glowAt(x,y,w*5,w*5*K,p[2],.4*a);}}
/* power gathering at the dagger tip for exactly the wind-up, a flash on the release frame */
const tip=()=>{const s=player.socket&&player.socket.w;if(s&&isFinite(s[0])&&isFinite(s[2]))return [s[0],s[1],s[2]];return [player.x+Math.cos(player.phi)*12,player.y+Math.sin(player.phi)*8,(player.z||0)+34*HZ()];};
class JGather{constructor(o){Object.assign(this,{t:0,layer:'top',T:.3,pal:GLD,R:34},o);this.acc=0;this.__gt='-';}
  update(dt){this.t+=dt;const p=tip();this.x=p[0];this.y=p[1];this.z=p[2];if(this.t<this.T){this.acc+=dt;while(this.acc>.035){this.acc-=.035;const an=R_(0,TAU),r=this.R*R_(.7,1.1);
      S1('top').add({im:tx('core',this.pal[2]),x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r*.6,z:this.z+R_(-8,14),vx:-Math.cos(an)*r/.2,vy:-Math.sin(an)*r*.6/.2,vz:0,dr:3,s0:5,s1:1.5,life:.2,add:1,str:2});}}
    return this.t<this.T+.05;}
  draw(){const k=cl(this.t/this.T,0,1),[x,y]=P(this.x,this.y,this.z);glowAt(x,y,18+26*k,18+26*k,this.pal[2],.25+.5*k);glowAt(x,y,8+10*k,8+10*k,'#ffffff',.3+.4*k);}}
function gather(a,pal,R){if(!a||!(a.windup>0.04))return;addFx(new JGather({T:rt(a.windup),pal,R:R||34}));at(a,a.windup,()=>{const p=tip();flare(p[0],p[1],p[2],34,pal[2],.22);});}

/* ---------------------------------------------------------------------
   3. THE JAGUAR'S OWN CLASSES, REPAINTED (update keeps the game's timing / callbacks)
   --------------------------------------------------------------------- */
const MARKSZ=15;
/* Prey Mark (gold claw scratches) · Eclipse Brand (black sun) · venom · armour crack · shadow roots */
if(typeof MarkOverlay==='function'){MarkOverlay.prototype.__gt='-';MarkOverlay.prototype.draw=function(){const t=this.t;
  for(const e of enemies){if(e.dead||!(e.prey>0||e.brand>0||e.st.poison>0||e.st.root>0||e.st.armor>0))continue;const sc=e.boss?1.25:1,[x,y]=P(e.x+(e.r||14)*1.05+6,e.y,zOf(e)+10*sc);let ox=0;
    const icon=(n,cnt,T,col)=>{const bl=T<2?.45+.55*Math.abs(Math.sin(t*7)):1,w=MARKSZ*sc;art(n,x+ox+w/2,y,w,{a:bl,under:'#000000',ua:.35,ux:1,uy:1.5});
      for(let i=0;i<cnt;i++){const px=x+ox+w*.2+i*w*.32,py=y+w*.62;ctx.save();ctx.globalAlpha=bl;ctx.fillStyle='#120a04';ctx.beginPath();ctx.moveTo(px,py-3.4);ctx.lineTo(px+2.6,py);ctx.lineTo(px,py+3.4);ctx.lineTo(px-2.6,py);ctx.closePath();ctx.fill();
        ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(px,py-2.4);ctx.lineTo(px+1.8,py);ctx.lineTo(px,py+2.4);ctx.lineTo(px-1.8,py);ctx.closePath();ctx.fill();ctx.restore();}ox+=w+3;};
    if(e.prey>0)icon('prey',e.prey,e.preyT,'#ffc23a');if(e.brand>0)icon('brand',e.brand,e.brandT,'#38e0d0');if(e.st.poison>0)icon('vdrop',0,e.st.poison,'#2fd6a0');if(e.st.armor>0)icon('plate0',0,e.st.armor,'#ffffff');
    if(e.st.root>0){const [rx,ry]=P(e.x,e.y,0),R=(e.r||14)*1.05;ctx.save();ctx.lineCap='round';for(let i=0;i<6;i++){const an=i/6*TAU+t*.6,bx=rx+Math.cos(an)*R,by=ry+Math.sin(an)*R*K,h=(18+6*Math.sin(t*3+i))*sc,cx2=rx+Math.cos(an)*R*.45,cy2=ry-h;
        for(const [w,c,a] of [[6,'#05030a',.55],[3.4,'#4a1f8a',.95],[1.4,'#38e0d0',.9]]){ctx.globalAlpha=a*cl(e.st.root/.3,0,1);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+(cx2-bx)*.2,by-h*.8,cx2,cy2);ctx.stroke();}}ctx.restore();}}};}
/* execute-ready reticle (3 Prey Marks): three gold fangs closing round the prey + a turning sun-stone ring */
if(typeof JgReticle==='function'){JgReticle.prototype.__gt='-';JgReticle.prototype.draw=function(){for(const e of enemies){if(e.dead||(e.prey||0)<3)continue;const [x,y]=P(e.x,e.y,zOf(e)),R=((e.r||14)+16)*(1+.07*Math.sin(this.t*8));
    const [gx,gy]=P(e.x,e.y,0);art('sunC',gx,gy,R*2.3,{flat:1,rot:this.t*.8,a:.55});
    for(let i=0;i<3;i++){const an=i/3*TAU+this.t*2.2,px=x+Math.cos(an)*R,py=y+Math.sin(an)*R*.72;ctx.save();ctx.translate(px,py);ctx.rotate(an+Math.PI);
      ctx.fillStyle='#2a1408';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-5,-6);ctx.lineTo(-2,0);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffc23a';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-3.4,-4.2);ctx.lineTo(-1,0);ctx.lineTo(-3.4,4.2);ctx.closePath();ctx.fill();ctx.fillStyle='#fff8e0';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(1,-1);ctx.lineTo(1,1);ctx.closePath();ctx.fill();ctx.restore();}}};}
/* the hunter's eyes */
if(typeof JgEye==='function'){JgEye.prototype.__gt='-';JgEye.prototype.draw=function(){const k=this.t/this.life,open=k<.15?eO(k/.15):k>.75?1-eI((k-.75)/.25):1,[x,y]=P(this.x,this.y,this.z*(this.z>40?HZ():1)),c=palOf(this.col||'#ffd27a'),n=c===CRM?'eyesR':c===TRQ||c===JAD?'eyesT':'eyesG',w=(this.big?60:38);
    if(open<=.02)return;glowAt(x,y,w*1.6,w*.7,c[2],.35*open);art(n,x,y,w,{sy:open,a:Math.min(1,open*1.3)});}}
/* crossed obsidian daggers held up as a guard; a gold flash when they catch a blow */
if(typeof XGuard==='function'){XGuard.prototype.__gt='-';XGuard.prototype.draw=function(){const phi=player.phi,[x,y]=P(player.x+Math.cos(phi)*18*HZ(),player.y+Math.sin(phi)*18*HZ(),34*HZ()+(player.z||0)),f=this.flash!=null?Math.max(0,1-(this.t-this.flash)/.25):0,pul=.85+.15*Math.sin(this.t*24),
    pal=palOf(this.col||'#ffd27a'),w=(46+16*f)*HZ()*1.25;glowAt(x,y,w*1.5,w*1.2,pal[2],(.3+.2*Math.sin(this.t*20))+.6*f);art('xdag',x,y,w,{a:pul,rot:Math.sin(this.t*30)*.03});if(f>0)star(x,y,26*f,pal[3],this.t*3);}}
/* a black eclipse crescent sweeps through the target (Twilight Fang); its glass shards fall when it closes */
if(typeof MoonCut==='function'){MoonCut.prototype.__gt='-';MoonCut.prototype.update=function(dt){this.t+=dt;if(this.t>this.life-.18&&!this.sh){this.sh=true;const e=this.e;chips(e.x,e.y,zOf(e),5,{spd:140});}return this.t<this.life;};
  MoonCut.prototype.draw=function(){const e=this.e,[x,y]=P(e.x,e.y,zOf(e)),R=this.R*(e.boss?1.3:1),k=Math.min(1,this.t/this.sweep),a=this.t<this.life-.18?1:(this.life-this.t)/.18;ctx.save();ctx.translate(x,y);ctx.rotate(this.rot);ctx.globalAlpha=a;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R*1.3,-Math.PI*.8,-Math.PI*.8+Math.PI*1.6*eO(k));ctx.closePath();ctx.clip();
    const cres=(r,o)=>{ctx.beginPath();ctx.arc(0,0,r,-Math.PI*.75,Math.PI*.75);ctx.arc(r*o,0,r*.82,Math.PI*.62,-Math.PI*.62,true);ctx.closePath();};
    ctx.globalCompositeOperation='lighter';cres(R*1.12,.36);ctx.fillStyle='rgba(56,224,208,.35)';ctx.fill();ctx.globalCompositeOperation='source-over';
    cres(R*1.05,.38);ctx.fillStyle='#38e0d0';ctx.fill();cres(R,.4);ctx.fillStyle='#0a0612';ctx.fill();cres(R*.94,.42);ctx.fillStyle='#2a1846';ctx.fill();
    ctx.strokeStyle='rgba(224,204,255,.9)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,R*.97,-Math.PI*.55,Math.PI*.55);ctx.stroke();ctx.restore();ctx.globalAlpha=1;};}
/* the cut that hangs on the target and then splits (Throne of Claws' warp cuts) */
if(typeof SlashScar==='function'){SlashScar.prototype.__gt='-';
  SlashScar.prototype.update=function(dt){this.t+=dt;if(this.burstT==null&&this.hold!==Infinity&&this.t>=this.zip+this.hold)this.burst();
    if(this.burstT!=null&&!this.fx){this.fx=true;const [x,y,z]=this.pos;chips(x,y,z,3,{spd:170});if(this._pal===CRM||this._pal===RGD)blood(x,y,z,2);}return this.burstT==null||this.t-this.burstT<this.split;};
  SlashScar.prototype.draw=function(){const p=this._pal||(this._pal=palOf(this.col)),[cx,cy]=P(...this.pos),c=Math.cos(this.ang),s=Math.sin(this.ang),nx=-s,ny=c,L=this.len,h=Math.min(1,this.t/this.zip);let sep=0,a=1;
    if(this.burstT!=null){const k=(this.t-this.burstT)/this.split;sep=9*eO(k);a=1-k;}const pulse=this.burstT==null&&this.t>this.zip?.85+.15*Math.sin(this.t*40):1,w=this.w*1.1;
    for(const side of (sep?[-1,1]:[0])){const ox=nx*sep*side,oy=ny*sep*side,x1=cx-c*L/2+ox,y1=cy-s*L/2+oy,x2=x1+c*L*h,y2=y1+s*L*h,m=[(x1+x2)/2,(y1+y2)/2],lens=(ww,col,al)=>{ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(m[0]+nx*ww,m[1]+ny*ww,x2,y2);ctx.quadraticCurveTo(m[0]-nx*ww,m[1]-ny*ww,x1,y1);ctx.fill();};
      ctx.save();lens(w*2.6,p[0],.5*a);lens(w*1.7,p[1],a);lens(w*1.05,p[2],a*pulse);lens(w*.45,p[4],a);ctx.restore();}ctx.globalAlpha=1;};}
/* the delayed rupture of a skill cut: two thin cuts hang a beat, then burst open */
if(typeof JgRupture==='function'){JgRupture.prototype.__gt='-';
  JgRupture.prototype.update=function(dt){this.t+=dt;const e=this.e;if(this.t>=this.pop&&!this.popped){this.popped=true;if(!e.dead){const p=palOf(this.col);addFx(new KGlint({e,x:e.x,y:e.y,z:zOf(e),s:15,col:p[2],life:.16}));chips(e.x,e.y,zOf(e),3,{spd:150});}}return this.t<this.life;};
  JgRupture.prototype.draw=function(){const e=this.e;if(this.t>this.pop+.05)return;const p=this._p||(this._p=palOf(this.col)),[x,y]=P(e.x,e.y,zOf(e)),k=Math.min(1,this.t/this.pop),pul=.6+.4*Math.sin(this.t*60);
    for(const an of [this.a1,this.a2]){const c=Math.cos(an),s=Math.sin(an),L=18+8*k,nx=-s,ny=c;ctx.save();for(const [w,col,al] of [[3.4,p[0],.45],[2.2+1.2*k,p[2],pul],[.8,p[4],1]]){ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-c*L,y-s*L);ctx.quadraticCurveTo(x+nx*w,y+ny*w,x+c*L,y+s*L);ctx.quadraticCurveTo(x-nx*w,y-ny*w,x-c*L,y-s*L);ctx.fill();}ctx.restore();}ctx.globalAlpha=1;};}
/* EXECUTE: the prey is cut in two by one huge black-gold stroke */
if(typeof JgExecute==='function'){JgExecute.prototype.__gt='-';const JE0=JgExecute.prototype.update;
  JgExecute.prototype.update=function(dt){if(!this._v){this._v=1;self(()=>{const z=30;addFx(new KBurst({x:this.x,y:this.y,z,R:70,n:13,pal:GLD,ink:.55}));flare(this.x,this.y,z,90,'#ffc23a',.32);chips(this.x,this.y,z,10,{spd:260});blood(this.x,this.y,z,6,{spd:180});
      sprite({n:'rakeG',x:this.x,y:this.y,z:z+4,w:120,life:.42,fi:.01,fo:.25,s0:.5,s1:1.1,pop:.07,rot:-.2});});}return JE0.call(this,dt);};
  JgExecute.prototype.draw=function(){const k=this.t/this.life,[x,y]=P(this.x,this.y,30),c=Math.cos(this.ang),s=Math.sin(this.ang),nx=-s,ny=c,L=190*eO(Math.min(1,k*5)),a=k<.5?1:(1-k)/.5;
    const lens=(L2,ww,col,al,dy)=>{ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-c*L2,y-s*L2+dy);ctx.quadraticCurveTo(x+nx*ww,y+ny*ww+dy,x+c*L2,y+s*L2+dy);ctx.quadraticCurveTo(x-nx*ww,y-ny*ww+dy,x-c*L2,y-s*L2+dy);ctx.fill();};
    ctx.save();lens(L,13*(1-k*.6),'#05030a',.6*a,0);lens(L,9*(1-k*.6),'#b8741a',a,0);lens(L*.96,6*(1-k*.6),'#ffc23a',a,0);lens(L*.9,2.4,'#ffffff',a,0);lens(L*.8,3,'#ef2a40',a*.85,6);ctx.restore();ctx.globalAlpha=1;};}
/* backstab: two gold fang chevrons flick behind the target */
if(typeof BackTick==='function'){BackTick.prototype.__gt='-';BackTick.prototype.draw=function(){const e=this.e,k=this.t/this.life,[x,y]=P(e.x+this.side*((e.r||14)+6+12*k),e.y,zOf(e)),a=1-k;
    for(let i=0;i<2;i++){const ox=x+this.side*i*8;ctx.save();ctx.globalAlpha=a;ctx.translate(ox,y);ctx.scale(this.side,1);ctx.fillStyle='#2a1408';ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(-7,-8);ctx.lineTo(-4,0);ctx.lineTo(-7,8);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffc23a';ctx.beginPath();ctx.moveTo(-.4,0);ctx.lineTo(-6,-5.6);ctx.lineTo(-3.6,0);ctx.lineTo(-6,5.6);ctx.closePath();ctx.fill();ctx.restore();}}}
/* the golden spirit jaguar: 'aura' = its roaring head behind her (Predator's Cry) · 'pounce' = it leaps along the game's own arc */
if(typeof SpectralPounce==='function'){SpectralPounce.prototype.__gt='-';SpectralPounce.prototype.draw=function(){
    if(this.mode==='aura'){const k=this.t/this.life,a=Math.sin(Math.PI*Math.min(1,k*1.1))*.85,sd=typeof dirSide==='function'?dirSide(player.dir):1,[x,y]=P(player.x-sd*20*HZ(),player.y-10,(player.z||0)+66*HZ()),w=(84+18*eO(Math.min(1,k*2)))*HZ();
      glowAt(x,y,w*1.5,w*1.2,'#ffc23a',(JV.pic('jagHead')?.14:.25)*a);art('jagHead',x,y,w,{sx:sd,a,rot:-sd*.06});return;}
    const dz=this.z0>200&&Math.abs(this.tx-this.sx)<5;   /* Godfall: straight down from the sky (smaller, a faint trail, so it reads as a diving jaguar, not a column); anchored at its head (ax .92) so it lands head first on the target instead of half under the ground */
    const k=Math.min(1,this.t/this.hitT),fade=this.t<this.hitT?Math.min(1,this.t/.08):Math.max(0,1-(this.t-this.hitT)/Math.max(.05,this.life-this.hitT)),sc=this.sc/.32,w=150*sc*(dz?.72:1),face=this.face||1;
    const pic=JV.pic('jagLeap');let lk=-1;   /* painted: every copy is a full detailed jaguar → only copies .12 of the arc apart, fainter */
    for(const p of this.trail){if(pic){if(lk>=0&&p.k-lk<.12)continue;lk=p.k;}const q=this.pos(p.k),[x,y]=P(...q);art('jagLeap',x,y,w,{sx:face,a:p.a*(dz?.14:.32)*(pic?.55:1)*fade,rot:dz?Math.PI/2*face:(lerp(-.3,.25,p.k))*face,ax:dz?.92:.5});}
    const q=this.pos(k),[x,y]=P(...q),rot=dz?Math.PI/2*face:(lerp(-.32,.26,k))*face;glowAt(x,y,w*1.1,w*.6,'#ffc23a',(pic?.18:.32)*fade);art('jagLeap',x,y,w,{sx:face,a:this.alpha*fade,rot,ax:dz?.92:.5});};}
/* a giant spirit paw falls onto a point and rakes down: claws touch on hitT (gold for Basic / A, a turquoise rake for B) */
if(typeof GiantClaw==='function'){GiantClaw.prototype.__gt='-';
  GiantClaw.prototype.update=function(dt){this.t+=dt;if(this.t>=this.hitT&&!this.hit){this.hit=true;this.onHit&&this.onHit();const S=this.S,B=this._br==='B';
      self(()=>{const fe={x:this.x,y:this.y,dead:false};rake(fe,B?'T':'G',{w:86*S+20,z:30,rot:this.face>0?.15:-.15,sx:this.face,life:.4});gouge(this.x,this.y+4,this.face>0?.35:Math.PI-.35,B?'T':'G',110*S+26,{life:1.4});
        chips(this.x,this.y,10,Math.round(4+10*S),{spd:200+120*S,up:220});dust(this.x,this.y,Math.round(2+4*S),{size:34+40*S,spd:70,life:.7});if(!B)blood(this.x,this.y,26,Math.round(2+4*S));});}return this.t<this.life;};
  GiantClaw.prototype.draw=function(){if(this._br==null)this._br=brOf(this._sk||window.SKCTX);if(this._br==='B')return;const t=this.t,S=this.S,f=this.face||1,k=cl(t/this.hitT,0,1),post=Math.max(0,t-this.hitT);
    const zt=lerp(200*S+70,34*S+18,eI(k))-post*120,xo=-f*lerp(40*S,0,k)+f*post*90,a=(t<.06?t/.06:1)*cl(1-post/Math.max(.1,this.life-this.hitT),0,1);if(a<=.01)return;
    const [x,y]=P(this.x+xo,this.y,Math.max(4,zt)),w=88*S;glowAt(x,y+w*.1,w*.9,w*.8,'#ffc23a',.16*a);art('paw',x,y,w,{ay:.86,a,sx:f,rot:f*(.32-.25*k)});};}
/* obsidian spear of the Fifth Sun: falls point-down, sticks in the ground */
if(typeof ObsSpear==='function'){ObsSpear.prototype.__gt='-';
  ObsSpear.prototype.update=function(dt){this.t+=dt;if(this.t>=this.fall&&!this.land){this.land=true;this.onLand&&this.onLand();self(()=>{chips(this.x,this.y,4,3,{spd:120,up:150});ring({x:this.x,y:this.y,r0:4,r1:24,life:.28,w:3,pal:TRQ,segs:3,gap:.3});});}return this.t<this.life;};
  ObsSpear.prototype.draw=function(){if(this.rot==null){this.rot=R_(-.12,.12);this.w=R_(15,19);}const k=Math.min(1,this.t/this.fall),z=lerp(300,0,eI(k)),a=this.t<this.fall?Math.min(1,this.t/.05):Math.max(0,1-(this.t-this.fall)/(this.life-this.fall));const [x,y]=P(this.x,this.y,z);
    if(this.t<this.fall){ctx.save();ctx.globalAlpha=.55*a;const g=ctx.createLinearGradient(x,y-140,x,y-40);g.addColorStop(0,'rgba(154,90,240,0)');g.addColorStop(1,'rgba(154,90,240,.8)');ctx.fillStyle=g;ctx.fillRect(x-3,y-140,6,100);ctx.restore();}
    else{const [gx,gy]=P(this.x,this.y,0);ctx.save();ctx.globalAlpha=.45*a;ctx.fillStyle='#05030a';ctx.beginPath();ctx.ellipse(gx,gy,9,3,0,0,TAU);ctx.fill();ctx.restore();}
    art('spear',x,y,this.w,{ay:.98,a,rot:this.rot});};}
/* the black sun with its spiky gold corona (Fifth Sun) */
if(typeof DarkSun==='function'){DarkSun.prototype.__gt='-';DarkSun.prototype.draw=function(){const t=this.t,cov=Math.min(1,t/1.1),a=t<.3?t/.3:t>this.life-.4?Math.max(0,(this.life-t)/.4):1,sc=this.collapse?Math.max(.04,1-eI(Math.min(1,(t-this.ct)/.35))):1,[x,y]=P(this.x,this.y,this.z||170),r=(this.r||46)*sc;
    const [gx,gy]=P(this.x,this.y,0);ctx.save();ctx.globalAlpha=.16*a*sc;ctx.fillStyle='#05030a';ctx.beginPath();ctx.ellipse(gx,gy,r*1.5,r*1.5*K,0,0,TAU);ctx.fill();ctx.restore();
    glowAt(x,y,r*6,r*6,'#ffb030',.42*a);const w=r*3.4*lerp(.6,1,eO(cov))*(1+Math.sin(t*2.4)*.015);art('eclipse',x,y,w,{a,rot:t*.25+(this.collapse?(t-this.ct)*6:0)});
    if(!this.collapse){const n=6;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const an=i/n*TAU+t*.18,L=r*(2.2+.5*Math.sin(t*1.7+i));ctx.globalAlpha=.12*a;ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an-.05)*L,y+Math.sin(an-.05)*L);ctx.lineTo(x+Math.cos(an+.05)*L,y+Math.sin(an+.05)*L);ctx.closePath();ctx.fill();}ctx.restore();}};}
/* Black Horizon: a wall of black shadow rolls out in a fan, turquoise rim, obsidian teeth bursting up as it passes */
if(typeof HorizonWave==='function'){HorizonWave.prototype.__gt='-';const HU0=HorizonWave.prototype.update;
  HorizonWave.prototype.update=function(dt){const r=HU0.call(this,dt),k=this.t/this.life,rr=this.R*eO(Math.min(1,k*1.4));this.sp=this.sp||0;
    while(this.sp<5&&rr>this.R*(.35+this.sp*.14)){const an=this.phi+R_(-this.half,this.half)*.85,x=this.x+Math.cos(an)*rr,y=this.y+Math.sin(an)*rr;this.sp++;self(()=>{sprite({n:'spike',x,y,z:0,w:R_(11,15),ay:.95,layer:'sorted',sortOff:2,life:.55,fi:.02,fo:.3,s0:.2,s1:1,pop:.1,rot:R_(-.25,.25)});chips(x,y,6,2,{spd:110});smoke(x,y,6,1,SHADET,34,{sp:30,life:.6});});}return r;};
  HorizonWave.prototype.draw=function(){const k=this.t/this.life,r=this.R*eO(Math.min(1,k*1.4)),a=k<.6?1:(1-k)/.4,band=Math.max(10,r*.28);ctx.save();const [x,y]=P(this.x,this.y,6);ctx.translate(x,y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,Math.max(1,r-band),0,0,r);g.addColorStop(0,'rgba(12,6,24,0)');g.addColorStop(.55,`rgba(42,24,70,${.75*a})`);g.addColorStop(.92,`rgba(12,6,24,${.92*a})`);g.addColorStop(1,'rgba(12,6,24,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,this.phi-this.half,this.phi+this.half);ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='lighter';for(const [w,c,al] of [[7,'#138a8a',.5],[3.2,'#38e0d0',.9],[1.2,'#ffffff',.8]]){ctx.strokeStyle=c;ctx.globalAlpha=al*a;ctx.lineWidth=w;ctx.beginPath();ctx.arc(0,0,r*.97,this.phi-this.half,this.phi+this.half);ctx.stroke();}
    ctx.globalAlpha=.6*a;ctx.fillStyle='#ffc23a';for(let i=0;i<9;i++){const an=this.phi-this.half+this.half*2*((i+.5)/9),rr=r*(.8+.15*Math.sin(i*2.1));ctx.beginPath();ctx.arc(Math.cos(an)*rr,Math.sin(an)*rr,1.6,0,TAU);ctx.fill();}ctx.restore();};}
/* shadow path on the ground (Jaguar Step's leap path, Shadow Corridor) */
if(typeof ShadowPath==='function'){ShadowPath.prototype.__gt='-';const SU0=ShadowPath.prototype.update;
  ShadowPath.prototype.update=function(dt){const r=self(()=>SU0.call(this,dt));this.wt=(this.wt||0)+dt;if(this.wt>.12&&this.t<this.life*.8){this.wt=0;const k=Math.random();self(()=>wisp(lerp(this.ax,this.bx,k)+R_(-6,6),lerp(this.ay,this.by,k)+R_(-4,4),2,{w:R_(12,18),life:.6,n:this._step?'wispT':undefined}));}return r;};
  /* a soft shadow lens lying on the ground (no hard band): two dark tones + one thin light seam in the middle */
  ShadowPath.prototype.draw=function(){const k=this.t/this.life,a=(this.t<.12?this.t/.12:1)*(k>.65?(1-k)/.35:1),[ax,ay]=P(this.ax,this.ay),[bx,by]=P(this.bx,this.by),wdx=this.bx-this.ax,wdy=this.by-this.ay,WL=Math.hypot(wdx,wdy)||1,
      ox=-wdy/WL,oy=wdx/WL*K,w=Math.min(26,this.w*.7),mx=(ax+bx)/2,my=(ay+by)/2;if(a<=.01)return;
    const lens=(ww,col,al)=>{ctx.globalAlpha=al*a;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(mx+ox*ww,my+oy*ww,bx,by);ctx.quadraticCurveTo(mx-ox*ww,my-oy*ww,ax,ay);ctx.fill();};
    ctx.save();lens(w*1.3,'#0c0618',.22);lens(w*.8,'#2a1846',.3);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5*a;ctx.strokeStyle=this._step?'#ffc23a':'#38e0d0';ctx.lineWidth=1.2;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(lerp(ax,bx,.08),lerp(ay,by,.08));ctx.lineTo(lerp(ax,bx,.92),lerp(ay,by,.92));ctx.stroke();ctx.restore();};}
/* Dark Sun Chain: an obsidian chain snaps from the burst to the next enemy */
if(typeof ChainLink==='function'){ChainLink.prototype.__gt='-';ChainLink.prototype.draw=function(){const k=this.t/this.life,a=1-k,[x1,y1]=P(this.a.x,this.a.y,zOf(this.a)),[x2,y2]=P(this.b.x,this.b.y,zOf(this.b)),sag=24*(1-eO(Math.min(1,k*3))),n=Math.max(4,Math.round(Math.hypot(x2-x1,y2-y1)/12));
    const pt=u=>[lerp(x1,x2,u),lerp(y1,y2,u)+Math.sin(Math.PI*u)*sag];glowAt((x1+x2)/2,(y1+y2)/2,Math.hypot(x2-x1,y2-y1)+20,40,'#2fd6a0',.25*a);
    for(let i=0;i<=n;i++){const u=i/n,[px,py]=pt(u),[qx,qy]=pt(Math.min(1,u+.02));art('link',px,py,11,{rot:Math.atan2(qy-py,qx-px)+(i%2?Math.PI/2*.0:0),a,sy:i%2?.55:1});}}}
/* Tezcatlipoca's smoking mirror floats beside her; cracks on a blocked blow, bursts on Mirror Shatter */
if(typeof ObsMirror==='function'){ObsMirror.prototype.__gt='-';
  for(const m of ['crack','shatter']){const f0=ObsMirror.prototype[m];ObsMirror.prototype[m]=function(){const r=self(()=>f0.apply(this,arguments));try{const [x,y]=[player.x+this.side()*36*HZ(),player.y];if(m==='shatter'){chips(x,y,40*HZ(),10,{spd:220});flare(x,y,40*HZ(),50,'#b48aff',.24);}else{chips(x,y,40*HZ(),4,{spd:120});flare(x,y,40*HZ(),30,'#e0ccff',.18);}}catch(_){}return r;};}
  ObsMirror.prototype.draw=function(){const k=this.t,a=Math.min(1,k/.15)*(this.t>this.life-.25?(this.life-this.t)/.25:1),sd=this.side(),[x,y]=P(player.x+sd*36*HZ(),player.y+6,(player.z||0)+(44+Math.sin(k*4)*3)*HZ());
    const sk=this.cracked&&!this.shattered?Math.max(0,1-(k-this.ct)/.2):0,bu=this.shattered?(k-this.st)/.34:0,w=40*HZ()*1.3*(.6+.4*back(Math.min(1,k/.25)))*(1+bu*.3);
    glowAt(x,y,w*1.5,w*1.6,'#8a4ae0',.35*a*(1-bu));art(this.cracked?'mirrorK':'mirror',x+Math.sin(k*90)*2.2*sk,y,w,{a:a*(1-bu),rot:Math.sin(k*1.6)*.06});};}
/* the moon trap: an eclipse sigil of obsidian teeth on the ground; it snaps shut with obsidian spikes */
if(typeof MoonTrap==='function'){MoonTrap.prototype.__gt='-';const MF0=MoonTrap.prototype.fire;
  MoonTrap.prototype.fire=function(hit){const r=MF0.apply(this,arguments);self(()=>{for(let i=0;i<9;i++){const an=i/9*TAU,x=this.x+Math.cos(an)*this.r*.85,y=this.y+Math.sin(an)*this.r*.85;
      sprite({n:'spike',x,y,z:0,w:R_(12,16),ay:.95,layer:'sorted',sortOff:1,life:.85,fi:.01,fo:.3,s0:.2,s1:1,pop:.09,delay:i*.012,rot:Math.cos(an)*-.4});}
    flare(this.x,this.y,20,60,'#9a5af0',.24);chips(this.x,this.y,10,8,{spd:200});smoke(this.x,this.y,6,4,SHADET,50,{sp:60,life:.7});ring({x:this.x,y:this.y,r0:this.r*.4,r1:this.r*1.5,life:.35,w:5,pal:VIO,segs:4,gap:.25});});return r;};
  MoonTrap.prototype.draw=function(){const [x,y]=P(this.x,this.y),arm=this.t>this.arm,a=Math.min(1,this.t/.25)*(this.fired?Math.max(0,1-(this.t-this.ft)/.9):1);if(a<=.01)return;
    glowAt(x,y,this.r*3,this.r*3*K,arm?'#ffc23a':'#8a4ae0',(arm?.28+.08*Math.sin(this.t*3):.18)*a);art('trap',x,y,this.r*2.5*(.8+.2*back(Math.min(1,this.t/.3))),{flat:1,a,rot:this.t*.15});};}
/* the Obsidian Seal: a black disc spins through the air, lands as a seal, charges, bursts */
if(typeof SealDisc==='function'){SealDisc.prototype.__gt='-';const SD0=SealDisc.prototype.update;
  SealDisc.prototype.update=function(dt){const b0=this.boom,r=SD0.call(this,dt);if(this.boom&&!b0)self(()=>{addFx(new KBurst({x:this.x,y:this.y,z:16,R:70,n:12,pal:VIO,ink:.55}));flare(this.x,this.y,18,90,'#ffc23a',.3);chips(this.x,this.y,10,12,{spd:260});
      sprite({n:'eclipse',x:this.x,y:this.y,z:40,w:70,life:.42,fi:.01,fo:.3,s0:.4,s1:1.3,pop:.1});smoke(this.x,this.y,8,5,SHADET,60,{sp:80,life:.8});});return r;};
  SealDisc.prototype.draw=function(){if(this.landed&&this.boom)return;const k=Math.min(1,this.t/this.fly),x=lerp(this.sx,this.x,k),y=lerp(this.sy,this.y,k),z=this.landed?2:40+Math.sin(Math.PI*k)*80;
    if(!this.landed){const [px,py]=P(x,y,z);art('seal',px,py,26,{rot:this.t*18,sy:.7});return;}
    const ch=cl((this.t-this.fly)/this.wait,0,1),[gx,gy]=P(this.x,this.y,0);glowAt(gx,gy,90+60*ch,(90+60*ch)*K,'#8a4ae0',.25+.35*ch);art('seal',gx,gy,34+10*ch,{flat:1,rot:this.t*(1+6*ch)});};}
/* Blood Moon Hunt: the blood moon rises behind her, then follows small above her head */
if(typeof BloodMoon==='function'){BloodMoon.prototype.__gt='-';BloodMoon.prototype.draw=function(){const t=this.t,big=t<1.7,k=big?Math.min(1,t/.7):1,shrink=big?0:Math.min(1,(t-1.7)/.4),sd=typeof dirSide==='function'?dirSide(player.dir):1;
    const R=lerp(44,9,eIO(shrink)),z=(big?lerp(30,108,eO(k)):lerp(108,80,eIO(shrink)))*HZ(),[x,y]=P(player.x-sd*lerp(46,0,shrink),player.y-lerp(30,0,shrink),(player.z||0)+z),a=(this.life-t<.5?(this.life-t)/.5:1)*(big?k:1);
    glowAt(x,y,R*5,R*5,'#ff3a3a',.35*a);if(big&&t>.4){const ra=Math.sin(Math.PI*Math.min(1,(t-.4)/1.3));ctx.save();ctx.globalCompositeOperation='lighter';for(let i=-2;i<=2;i++){const ang=Math.PI/2+i*.28+Math.sin(t*1.5)*.15,L=220;ctx.globalAlpha=.16*ra*a;ctx.fillStyle='#ff4a3a';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ang-.06)*L,y+Math.sin(ang-.06)*L);ctx.lineTo(x+Math.cos(ang+.06)*L,y+Math.sin(ang+.06)*L);ctx.closePath();ctx.fill();}ctx.restore();}
    art('moon',x,y,R*2.3,{a});};}
/* Twin Eclipse Pact: the blood moon (A) and the black sun (B) orbit her while the pact lasts */
if(typeof TwinSuns==='function'){TwinSuns.prototype.__gt='-';TwinSuns.prototype.draw=function(){const t=this.t,a=Math.min(1,t/.3);
    for(let i=0;i<2;i++){const an=t*2.2+i*Math.PI,far=Math.sin(an)<0,[x,y]=P(player.x+Math.cos(an)*30*HZ(),player.y+Math.sin(an)*14*HZ(),(player.z||0)+(46+Math.sin(an)*6)*HZ()),s=far?.8:1;
      glowAt(x,y,40*s,40*s,i?'#38e0d0':'#ff3a3a',.35*a*(far?.6:1));art(i?'eclipse':'moon',x,y,(i?24:17)*s,{a:a*(far?.6:1),rot:i?t*.8:0});}};}
/* Venom Sigil's pool: a jade pool with the serpent sigil under it and bubbles rising */
if(typeof PoisonPuddle==='function'){PoisonPuddle.prototype.__gt='-';PoisonPuddle.prototype.update=function(dt){this.t+=dt;this.bt=(this.bt||0)+dt;if(this.bt>.16&&this.t<this.life-.3){this.bt=0;const an=R_(0,TAU),r=this.r*R_(.1,.7);S1('top').add({im:tx('core','#2fd6a0'),x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r*.6,z:2,vz:R_(14,30),s0:4,s1:9,life:.6,fo:.7,add:1});}return this.t<this.life;};
  PoisonPuddle.prototype.draw=function(){const k=this.t/this.life,a=(this.t<.12?this.t/.12:1)*(k>.6?(1-k)/.4:1),[x,y]=P(this.x,this.y),R=this.r*(.6+.4*eO(Math.min(1,this.t/.25)));
    art('sigilV',x,y,R*2.6,{flat:1,a:a*.85,rot:this.t*.4});ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a*.75;const g=ctx.createRadialGradient(-R*.25,-R*.25,2,0,0,R*.8);g.addColorStop(0,'rgba(200,255,230,.85)');g.addColorStop(.45,'rgba(47,214,160,.7)');g.addColorStop(1,'rgba(4,60,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*.8,0,TAU);ctx.fill();ctx.restore();};}

/* ---------------------------------------------------------------------
   4. HELPERS OF HER CODE (stab, eclipseSpark, parryFx, leafBurst) + the dagger cut (slashAt)
   --------------------------------------------------------------------- */
/* stab = the colour the strike asked for (a small accent; the spark itself comes from the damage) */
stab=function(e,col,big){if(!e||e.dead&&!big)return;const p=palOf(col||'#ffd27a');addFx(new KGlint({e,x:e.x,y:e.y,z:zOf(e)+R_(-4,4),s:big?16:9,col:p[2],life:.13}));if(big)addFx(new KBurst({e,x:e.x,y:e.y,z:zOf(e),R:30*(e.boss?1.3:1),n:8,pal:p,ink:.5}));};
eclipseSpark=function(e){if(!e)return;const z=topZ(e)-6;sprite({n:'brand',x:e.x,y:e.y,z,w:26,follow:e,life:.45,fi:.01,fo:.3,s0:2,s1:1,pop:.12});flare(e.x,e.y,z,30,'#ffc23a',.2);ring({x:e.x,y:e.y,r0:4,r1:34,life:.3,w:3,pal:TRQ,segs:3,gap:.3});};
{const PF0=parryFx;parryFx=function(e,full){const p=tip(),pal=full?GLD:VIO;self(()=>{addFx(new KBurst({x:p[0],y:p[1],z:p[2],R:full?34:26,n:9,pal,ink:.5}));flare(p[0],p[1],p[2],full?46:34,pal[2],.2);chips(p[0],p[1],p[2],full?6:4,{spd:200,dir:Math.atan2(e.y-player.y,e.x-player.x),spread:1});});
    const A0=window.__JGQUIET;window.__JGQUIET=1;try{self(()=>PF0(e,full));}finally{window.__JGQUIET=A0;}};}
leafBurst=function(x,y,n,dir){leaves(x,y,14,Math.max(3,n),{dir:dir+Math.PI,spread:.9,spd:130,up:80});};
/* the dagger cut: on its target on the contact frame kC */
/* the two daggers of a pair in the colours of the branch (Basic obsidian + gold · A crimson + gold · B violet + turquoise), a few skills their own */
const PAIRS={N:[OBS,GLD],A:[CRM,GLD],B:[VIO,TRQ]},SKPAL={jgExpose:[VIO,GLD],jgVenom:[JAD,VIO],jgBloom:[JAD,VIO],jgTwilight:[TRQ,VIO],jgEBackstab:[TWI,VIO],jgPhantom:[TWI,VIO],jgNightfall:[VIO,TRQ]};
slashAt=function(a,kC,o={}){try{const key=a.skill||a.key||'basic',lead=(seqTimeAt(a.seq,kC)-a.t)/TEMPO(),W=o.W||10,big=W>=14,rot=o.rot||0,pr=SKPAL[key]||PAIRS[brOf(key)]||PAIRS.N,pal=pr[rot<0?0:1];
    return jcut({lead,R:big?58:50,W:big?13:W>=12?11:9.5,pal,shape:rot<0?'x1':'x2',sw:big?.065:.05,fade:big?.15:.11,glint:big?1.1:.8});}catch(err){return NOFX();}};

/* ---------------------------------------------------------------------
   5. SKILLS — per target (jgStrikes each), per strike (after), per cast (make)
   --------------------------------------------------------------------- */
const HIT={},AFT={},MK={};
/* Expose Armor: the armour plates break off, a violet crack star */
HIT.jgExpose=(a,e)=>{const z=zOf(e);plates(e.x,e.y,z,5,{dir:a&&player?Math.atan2(e.y-player.y,e.x-player.x):null,spread:1.2});addFx(new KBurst({e,x:e.x,y:e.y,z,R:34,n:10,pal:VIO,ink:.55}));flare(e.x,e.y,z,36,'#9a5af0',.2);};
/* Rending Fang: the last cut marks the prey — a gold rake; Predator's Echo rakes again */
HIT.jgRending=(a,e,i,last)=>{if(last&&e.st.bleed>0)blood(e.x,e.y,zOf(e),4,{spd:150});};
/* Open Wound: the wound tears open — a crown of blood, crimson gouges */
HIT.jgOpenWound=(a,e)=>{const z=zOf(e);sprite({n:'splash',x:e.x,y:e.y+2,z:z-12,w:(e.boss?84:62),ay:.92,layer:'sorted',sortOff:2,life:.55,fi:.01,fo:.35,s0:.3,s1:1.05,pop:.1});blood(e.x,e.y,z,8,{spd:200,up:220});rake(e,'C',{w:58});};
/* Twin Talon Dance: every strike a thin alternating cut; the last one a crimson rake */
AFT.jgTalon=(a,h,i,last)=>{if(last)for(const e of h)rake(e,'C',{w:70});};
/* Final Talon: a red-gold X opens the prey */
HIT.jgFinalTalon=(a,e)=>{const z=zOf(e);for(const s of [-1,1])addFx(new KLine({e,x:e.x,y:e.y,z,ang:s*.78,L:(e.boss?120:92),w:6,pal:RGD,grow:.03,hold:.08,fade:.18,ink:.5}));addFx(new KBurst({e,x:e.x,y:e.y,z,R:44,n:12,pal:RGD,ink:.55}));blood(e.x,e.y,z,6,{spd:190});};
/* Thousand Cuts (C): four obsidian daggers fly in from the corners, each lands with its hit (the game's own timers .18 + i·.05) */
{const TC0=thousandCuts;thousandCuts=function(e){quiet(()=>TC0(e));if(!e)return;const R=60;for(let i=0;i<4;i++){const an=i/4*TAU+.4;throwDagger(e.x+Math.cos(an)*R*1.6,e.y+Math.sin(an)*R*1.2,64,e,.18+i*.05,{w:30});}};}
/* Life Siphon: blood ribbons flow back into her */
HIT.jgSiphon=(a,e,i,last)=>{if(last){const z=zOf(e);for(let k=0;k<6;k++){const S=S1('top'),an=R_(0,TAU);S.add({im:AR.get('bdrop')||tx('core','#ef2a40'),x:e.x,y:e.y,z,vx:Math.cos(an)*60,vy:Math.sin(an)*40,vz:R_(40,90),s0:7,s1:5,life:.5,fo:.3,dr:2,asp:1.33,delay:k*.04});}}};
/* Venom Sigil: the serpent sigil coils under the target (the pool is PoisonPuddle) */
HIT.jgVenom=(a,e)=>{venom(e.x,e.y,zOf(e),5,{spd:140});};
/* Venom Bloom: a venom flower bursts open round the target */
AFT.jgBloom=(a,h)=>{const t=h[0]||nearFront(200);if(!t)return;const z=zOf(t);sprite({n:'bloom',x:t.x,y:t.y+3,z:z-16,w:(t.boss?96:74),ay:.92,layer:'sorted',sortOff:3,life:.7,fi:.01,fo:.4,s0:.2,s1:1.05,pop:.14});
  flat('sigilV',t.x,t.y,140,{life:.9,s0:.3,rot:R_(0,TAU),spin:1.2});venom(t.x,t.y,z,10,{spd:200,up:200});for(let k=0;k<3;k++)wisp(t.x+R_(-30,30),t.y+R_(-14,14),4,{n:'wispT',w:R_(18,26),life:.7});
  ring({x:t.x,y:t.y,r0:10,r1:70,life:.4,w:5,pal:JAD,segs:4,gap:.2});};
/* Eclipse Backstab: the Brand is torn out — a black sun implodes on the target, then bursts */
HIT.jgEBackstab=(a,e)=>{const z=zOf(e);rake(e,'T',{w:60});const u=e._jgUB;if(u&&u.t===gameTime&&u.n>0){sprite({n:'eclipse',x:e.x,y:e.y,z:z+6,w:(e.boss?66:50),follow:e,life:.14,fi:.01,fo:.04,s0:1.5,s1:.35,tick:f=>{f.rot=f.t*4;}});
  later(.12,()=>{if(e.dead)return;const zz=zOf(e);addFx(new KBurst({e,x:e.x,y:e.y,z:zz,R:52+8*u.n,n:12,pal:TWI,ink:.55}));flare(e.x,e.y,zz,60+10*u.n,'#38e0d0',.26);chips(e.x,e.y,zz,6+2*u.n,{spd:230});sprite({n:'eclipse',x:e.x,y:e.y,z:zz,w:40,follow:e,life:.3,fi:.01,fo:.25,s0:.4,s1:1.8,pop:0});});}};
/* Black Horizon: Brand cash-in on each enemy (the wave itself is HorizonWave) */
HIT.jgHorizon=(a,e)=>{const u=e._jgUB;if(u&&u.t===gameTime&&u.n>0)sprite({n:'eclipse',x:e.x,y:e.y,z:zOf(e)+4,w:36+6*u.n,follow:e,life:.35,fi:.01,fo:.25,s0:.4,s1:1.4,pop:0});};
/* Twilight Fang: the Brand pops (addBrand) and the eclipse crescent sweeps (MoonCut) */

/* make() wrappers: casts and the skills that are not dagger strikes */
const sunAt=(x,y,R,n='sunG',o={})=>flat(n,x,y,R*2.25,Object.assign({life:o.life||.9,fi:.08,fo:.4,s0:.7,s1:1,pop:0,spin:o.spin==null?.6:o.spin,a:o.a==null?.9:o.a},o));
MK.jgStep=(a,c,sx,sy)=>{const phi=player.phi;at(a,0,()=>{flat('print',sx,sy,22,{rot:scr(phi)+Math.PI/2,life:1.6,fo:.7,s0:.8,pop:0});leaves(sx,sy,10,7,{dir:phi+Math.PI,spread:.8});dust(sx,sy,3,{size:30,spd:60,life:.6});});
  at(a,seqTotal(a.seq)*.85,()=>{flat('print',player.x,player.y,22,{rot:scr(phi)+Math.PI/2,life:1.6,fo:.7,s0:.8,pop:0});dust(player.x,player.y,2,{size:28,spd:50,life:.5});});};
MK.jgCry=a=>{gather(a,GLD,40);at(a,a.windup,()=>{const x=player.x,y=player.y;for(let i=0;i<3;i++)later(i*.1,()=>ring({x,y,r0:20,r1:150+i*30,life:.55,w:7-i*1.5,pal:GLD,segs:5,gap:.2}));sunAt(x,y,90,'sunG',{life:.8,spin:1.4});leaves(x,y,20,9,{spd:200,up:120});feathers(x,y,40*HZ(),4,{spd:120});dust(x,y,5,{ring:24,size:40,spd:110,life:.8});});};
MK.jgFocus=a=>{gather(a,GLD,30);at(a,a.windup,()=>{flare(player.x,player.y,(player.z||0)+62*HZ(),40,'#ffc23a',.3);});};
MK.jgTempo=a=>{gather(a,RGD,34);at(a,a.windup,()=>{const sd=typeof dirSide==='function'?dirSide(player.dir):1;const d=sprite({n:'drum',x:player.x-sd*26*HZ(),y:player.y-4,z:0,w:30*HZ()*1.3,ay:.98,layer:'sorted',sortOff:-1,life:1.5,fi:.06,fo:.4,s0:.5,s1:1,pop:.14});
  for(let i=0;i<3;i++)later(.18+i*.24,()=>{const x=player.x,y=player.y;ring({x,y,r0:12,r1:70+i*12,life:.35,w:5,pal:RGD,segs:6,gap:.35});embers(player.x-sd*26*HZ(),player.y,30*HZ(),4,{spd:90,up:120,c:['#fff3c0','#ff7a2a','#9a0c22']});shake(1);});});};
MK.jgVeil=a=>{gather(a,VIO,30);at(a,a.windup,()=>{const x=player.x,y=player.y;for(let i=0;i<5;i++)wisp(x+R_(-24,24),y+R_(-10,10),R_(0,20),{w:R_(20,28),life:R_(.7,1)});smoke(x,y,10,2,SHADET,40,{sp:50,life:.7});flare(x,y,30*HZ(),40,'#9a5af0',.25);});};
MK.jgMirror=a=>{gather(a,VIO,28);};
MK.jgMoonTrap=(a,c)=>{gather(a,GLD,28);at(a,a.windup,()=>{const gx=c.gx,gy=c.gy;if(gx==null)return;sunAt(gx,gy,48,'sunV',{life:.6,spin:2});chips(gx,gy,4,4,{spd:80,up:120});});};
MK.jcSeal=a=>{gather(a,VIO,30);};
MK.jcTotem=a=>{gather(a,CRM,36);at(a,a.windup,()=>{sunAt(player.x,player.y,130,'sunC',{life:1.1,spin:.8,a:.8});for(const e of enemies){if(e.dead||dist(e,player)>260)continue;later(R_(0,.12),()=>{if(!e.dead)flare(e.x,e.y,topZ(e),26,'#ff3a3a',.25);});}});};
MK.jgCountercut=()=>{};MK.jgParry=()=>{};
MK.jgBloodChase=(a)=>{const sx=player.x,sy=player.y;at(a,.001,()=>{addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],w:11,life:.28,pal:CRM,ink:.45,live:rt(seqTotal(a.seq)*.8)}));blood(sx,sy,20,3,{spd:80});});};
MK.jgSpiral=(a)=>{const sx=player.x,sy=player.y;at(a,.001,()=>{addFx(new KStreak({a:[sx,sy],b:[player.x,player.y],w:10,life:.26,pal:CRM,ink:.45,live:rt(.14)}));});};
MK.jgReprisal=(a)=>{};
/* Jaguar Cyclone: the twin daggers whirl round her — one full turn lands on every tick of the spin */
MK.jgCyclone=(a)=>{const T=seqTotal(a.seq),n=[3,4,5][Math.max(1,Math.min(3,LV.jgCyclone||1))-1],R=86;
  for(let i=0;i<n;i++){const ti=T*(i+.6)/n,t0=Math.max(0,ti-T/n*.7);at(a,t0,()=>{const lead=rt(ti-t0);addFx(new KArc({x:player.x,y:player.y,follow:1,fz:(24+i%2*8)*HZ(),phi:player.phi+i*1.3,tilt:.12*(i%2?-1:1),a0:-Math.PI,a1:Math.PI,hit:0,lead,sweep:lead*2,hold:0,fade:.14,trail:3.4,R:R*.9,W:20,pal:i%2?CRM:VIO,ink:.5,N:44,glint:0,edge:.18}));});}
  at(a,.01,()=>{const x=player.x,y=player.y;sunAt(x,y,R*.95,'sunC',{life:rt(T)+.2,spin:3,a:.3,follow:player});});};
/* Predator Drop: the spirit jaguar leaps with her; the landing tears the ground */
MK.jgDrop=(a)=>{const tL=a.windup;at(a,tL,()=>{const x=player.x+Math.cos(player.phi)*18,y=player.y+Math.sin(player.phi)*18;addFx(new KBurst({x,y,z:14,R:60,n:12,pal:CRM,ink:.55}));flare(x,y,16,70,'#ef2a40',.28);rake({x,y,dead:false},'C',{w:84,z:24,rot:Math.PI/2*.0});
  ring({x,y,r0:10,r1:96,life:.42,w:7,pal:GLD,segs:5,gap:.2});});};
/* Throne of Claws: blood eyes, she vanishes, warp cuts hang on the prey, the spirit paw slams, everything bursts */
MK.jgThrone=(a,c)=>{const t=(c&&c.target&&!c.target.dead)?c.target:nearFront(300)||(a.hitList&&a.hitList[0]);gather(a,CRM,44);
  const ev=(a.events||[]).map(e=>e.t).sort((p,q)=>p-q),tBurst=ev[ev.length-1];
  at(a,.03,()=>{for(let i=0;i<4;i++)later(i*.06,()=>ring({x:player.x,y:player.y,r0:90-i*15,r1:10,life:.3,w:5,pal:CRM,segs:4,gap:.3}));});
  if(t)at(a,Math.max(0,tBurst-.36),()=>{if(t.dead)return;addFx(new GiantClaw({x:t.x,y:t.y,face:Math.cos(angTo(t))>=0?1:-1,sc:.46,hitT:rt(.36),life:rt(.36)+.6}));});
  at(a,tBurst,()=>{const e=t&&!t.dead?t:null,x=e?e.x:player.x,y=e?e.y:player.y;sunAt(x,y,150,'sunC',{life:1,spin:2.4});addFx(new KBurst({x,y,z:26,R:90,n:16,pal:RGD,ink:.6}));flare(x,y,30,130,'#ff6a2a',.34);
    ring({x,y,r0:14,r1:230,life:.55,w:9,pal:CRM,segs:6,gap:.15});dust(x,y,8,{ring:30,size:60,spd:160,life:.9});stones(x,y,10,{spd:300,up:300});feathers(x,y,40,6,{spd:200,up:160});});};
/* Shadow Slip: she melts into a shadow and rises behind the prey */
MK.jgSlip=(a,c,sx,sy)=>{const nx=player.x,ny=player.y;for(let i=0;i<4;i++)wisp(sx+R_(-14,14),sy+R_(-8,8),R_(0,14),{w:R_(20,30),life:R_(.5,.8)});smoke(sx,sy,6,1,SHADET,34,{sp:40,life:.5});
  for(let i=0;i<4;i++)wisp(nx+R_(-12,12),ny+R_(-6,6),R_(0,10),{w:R_(18,26),life:R_(.5,.7),n:'wispT'});ring({x:nx,y:ny,r0:30,r1:6,life:.25,w:5,pal:TWI,segs:4,gap:.25});
  if(Math.hypot(nx-sx,ny-sy)>20)addFx(new KStreak({a:[sx,sy],b:[nx,ny],w:9,life:.26,pal:TWI,ink:.45}));};
/* Nightfall Dance / Phantom Riposte: violet smoke where the shadow clones rise */
MK.jgNightfall=(a,c)=>{const t=(c&&c.target)||nearFront(200);if(!t)return;at(a,.05,()=>{const base=angTo(t)+Math.PI/2;for(const sd of [0,Math.PI]){const x=t.x-Math.cos(base+sd)*110,y=t.y-Math.sin(base+sd)*110;for(let i=0;i<3;i++)wisp(x+R_(-10,10),y+R_(-6,6),2,{w:R_(20,28)});}});};
MK.jgPhantom=(a,c)=>{const t=(c&&c.target)||nearFront(200);if(!t)return;at(a,.03,()=>{const base=angTo(t)+Math.PI/4;for(const sd of [0,Math.PI/2]){const x=t.x-Math.cos(base+sd)*120,y=t.y-Math.sin(base+sd)*120;for(let i=0;i<3;i++)wisp(x+R_(-10,10),y+R_(-6,6),2,{w:R_(20,28),n:'wispT'});}});
  at(a,.03+.3*TEMPO(),()=>{if(t.dead)return;addFx(new KBurst({e:t,x:t.x,y:t.y,z:zOf(t),R:46,n:12,pal:TWI,ink:.55}));flare(t.x,t.y,zOf(t),50,'#38e0d0',.25);});};
/* Mirror Shatter: the glass flies at the attacker */
MK.jgShatter=(a,c)=>{const att=c&&c.action&&c.action.attacker,t=(att&&!att.dead)?att:nearFront(220);if(!t)return;at(a,.08,()=>{const sd=typeof dirSide==='function'?dirSide(player.dir):1,sx=player.x+sd*36*HZ(),sy=player.y;
  for(let i=0;i<7;i++)throwDagger(sx+R_(-8,8),sy+R_(-4,4),44*HZ()+R_(-10,10),t,.06+i*.01,{n:'chip'+(i%3),w:R_(10,15)});});};
/* Eclipse of the Fifth Sun: the sun-stone opens on the ground, the black sun rises, obsidian spears rain, the sun collapses and bursts */
MK.jgFifthSun=(a,c)=>{const cx=c.gx,cy=c.gy,R=270;if(cx==null)return;gather(a,GLD,44);const T=a.dur;
  at(a,.02,()=>{sunAt(cx,cy,R,'sunG',{life:rt(T)+1.2,spin:.25,a:.42,fi:.4,fo:.6,s0:.5});sunAt(cx,cy,R*.62,'sunV',{life:rt(T)+1,spin:-.4,a:.34,fi:.4,fo:.5});});
  const tEnd=(a.events||[]).map(e=>e.t).sort((p,q)=>p-q).pop();
  at(a,tEnd,()=>{later(.3,()=>{addFx(new KBurst({x:cx,y:cy,z:40,R:150,n:18,pal:GLD,ink:.55}));flare(cx,cy,60,200,'#ffc23a',.4);ring({x:cx,y:cy,r0:20,r1:R*1.25,life:.6,w:12,pal:GLD,segs:8,gap:.12});ring({x:cx,y:cy,r0:20,r1:R,life:.5,w:6,pal:TRQ,segs:6,gap:.2,delay:.06});
    chips(cx,cy,30,18,{spd:360,up:300});smoke(cx,cy,10,8,SHADET,80,{sp:120,life:1});});});};
/* Sky-Pounce: the spirit jaguar leaps with her, the giant paw lands with her */
MK.jcSkyPounce=(a)=>{const tL=a.windup;at(a,tL,()=>{const x=player.x+Math.cos(player.phi)*16,y=player.y+Math.sin(player.phi)*16;sunAt(x,y,100,'sunG',{life:.9,spin:2});addFx(new KBurst({x,y,z:14,R:70,n:13,pal:GLD,ink:.55}));flare(x,y,20,90,'#ffc23a',.3);});};

/* the hooks themselves */
{const JS0=jgStrikes;jgStrikes=function(o){const key=o.key,ea=o.each,af=o.after;o=Object.assign({},o,{each:(a,e,i,last)=>{if(ea)ea(a,e,i,last);try{const f=HIT[key];if(f)self(()=>f(a,e,i,last,o));}catch(err){console.warn('jaguar vfx hit',key,err);}},
    after:(a,h,i,last)=>{if(af)af(a,h,i,last);try{const f=AFT[key];if(f)self(()=>f(a,h,i,last,o));}catch(err){console.warn('jaguar vfx after',key,err);}}});return JS0(o);};}
const wrapUpd=a=>{if(a&&typeof a.update==='function'&&!a._jgU){a._jgU=1;const u0=a.update;a.update=function(){return self(()=>u0.apply(this,arguments));};}};
for(const k in SKILLS){const sk=SKILLS[k];if(!sk||!sk.make||sk._jgV)continue;const mk=sk.make;sk.make=function(c){const sx=player.x,sy=player.y,a=mk.apply(this,arguments);if(a){a.events=a.events||[];wrapUpd(a);const f=MK[k];if(f)try{self(()=>f(a,c||{},sx,sy));}catch(err){console.warn('jaguar vfx',k,err);}}return a;};sk._jgV=1;}
{const B0=mkBasic;mkBasic=function(){const a=B0.apply(this,arguments);wrapUpd(a);return a;};}

/* ---------------------------------------------------------------------
   6. MARKS, STATUSES, DAMAGE — pops when a mark is added, sparks from the damage, crit stars
   --------------------------------------------------------------------- */
{const AP0=addPrey;addPrey=function(e,n){const b=e&&e.prey||0,r=AP0.apply(this,arguments);try{if(e&&!e.dead&&(e.prey||0)>b){const z=topZ(e);sprite({n:'prey',x:e.x,y:e.y,z,w:24,follow:e,life:.5,fi:.01,fo:.3,s0:2.2,s1:1,pop:.14});flare(e.x,e.y,z,22,'#ffc23a',.18);}}catch(_){}return r;};}
{const AB0=addBrand;addBrand=function(e,n){const b=e&&e.brand||0,r=AB0.apply(this,arguments);try{if(e&&!e.dead&&(e.brand||0)>b){const z=topZ(e);sprite({n:'brand',x:e.x,y:e.y,z,w:26,follow:e,life:.5,fi:.01,fo:.3,s0:2.2,s1:1,pop:.14,tick:f=>{f.rot=f.t*2;}});ring({x:e.x,y:e.y,r0:30,r1:6,life:.25,w:3,pal:TRQ,segs:3,gap:.3});}}catch(_){}return r;};}
{const BL0=jgBleed;jgBleed=function(e,d){const had=e&&e.st&&e.st.bleed>0,r=BL0.apply(this,arguments);try{if(e&&!e.dead&&!had&&!(e._jgBl>gameTime)){e._jgBl=gameTime+.6;const z=zOf(e);blood(e.x,e.y,z,5,{spd:130});sprite({n:'splash',x:e.x,y:e.y+2,z:z-14,w:(e.boss?60:44),ay:.92,layer:'sorted',sortOff:2,life:.4,fi:.01,fo:.3,s0:.3,s1:1,pop:.08});}}catch(_){}return r;};}
{const PO0=jgPoison;jgPoison=function(e){const r=PO0.apply(this,arguments);try{if(e&&!e.dead&&!(e._jgPo>gameTime)){e._jgPo=gameTime+.7;venom(e.x,e.y,zOf(e),4,{spd:100});}}catch(_){}return r;};}
{const UP0=usePrey;usePrey=function(e,max){return self(()=>UP0.apply(this,arguments));};}
{const UB0=useBrand;useBrand=function(e,max){const n=UB0.apply(this,arguments);try{if(e)e._jgUB={n,t:gameTime};}catch(_){}return n;};}
/* every damaging hit of hers: a spark in the colour of its branch (throttled per enemy) */
{const JH0=jh;jh=function(e,m,o={}){const d=JH0.apply(this,arguments);try{if(e&&d>0&&!o.dot){const now=gameTime,big=!!(o.big||o.finisher);if(big||!(e._jgSp>now)){e._jgSp=now+.05;const br=o.br||jgBr(),key=window.SKCTX;
      const pal=o.tempo?CRM:br==='A'?CRM:br==='B'?TWI:br==='C'?palBr(brOf(key)):(key?OBS:GLD);self(()=>spark(e,pal,big));if(o.tempo)rake(e,'C',{w:50});if(o.label==='ECHO'||o.label==='HUNT')rake(e,'G',{w:56});}}}catch(_){}return d;};}
{const AH0=window.jgAfterHurt;window.jgAfterHurt=function(e,dmg,crit,o){const r=AH0?AH0.apply(this,arguments):undefined;try{if(crit&&dmg&&o&&!o.dot&&e&&!(e._jgCr>gameTime)){e._jgCr=gameTime+.12;const z=zOf(e)+6;self(()=>{addFx(new KGlint({e,x:e.x,y:e.y,z,s:(e.boss?30:24),col:'#ffc23a',life:.24}));flare(e.x,e.y,z,40,'#ffd27a',.22);});}}catch(_){}return r;};}
/* Mirage Shed (C): the decoy left behind is a golden spirit copy of her; it bursts into leaves */
function patchDecoy(f){f.__gt='-';
  f.update=function(dt){this.t+=dt;this.lt=(this.lt||0)+dt;if(this.lt>.3){this.lt=0;const x=this.snap.x+R_(-10,10),y=this.snap.y,z=R_(14,46)*HZ();S1('top').add({im:tx('core','#ffc23a'),x,y,z,vz:R_(10,24),s0:5,s1:1,life:.5,add:1,fo:.6});}if(this.t>=this.life&&!this.dead)this.fade=true;return !this.dead&&this.t<this.life;};
  f.draw=function(){const [x,y]=P(this.snap.x,this.snap.y),a=Math.min(1,(this.life-this.t)/.2);glowAt(x,y-24,60,80,'#ffc23a',.3*a);ctx.save();ctx.globalCompositeOperation='lighter';drawFrame(this.snap.e,x,y,.5*a,null,tinted(this.snap.e,'#ffc23a'));ctx.restore();};
  f.shatter=function(){this.dead=true;self(()=>{leaves(this.snap.x,this.snap.y,24,12,{spd:200,up:140});chips(this.snap.x,this.snap.y,24,6,{spd:200});flare(this.snap.x,this.snap.y,30,50,'#ffc23a',.24);});};}
/* Countercut lands outside her own actions (a monster's swing triggers it): run it in her context so the old pieces convert */
{const CC0=countercut;countercut=function(a,e){const sx=player.x,sy=player.y,r=self(()=>CC0.apply(this,arguments));try{self(()=>{leaves(sx,sy,12,6,{dir:Math.atan2(e.y-sy,e.x-sx)+Math.PI,spd:120});flare(sx,sy,30*HZ(),40,'#ffc23a',.2);});}catch(_){}return r;};}

/* ---------------------------------------------------------------------
   7. BUFF WATCHERS — calm on purpose (buffs must not hide the hero)
   --------------------------------------------------------------------- */
class JWatch{constructor(){this.layer='top';this.t=0;this.beat=-1;this.wt=0;this.__gt='-';}
  update(dt){this.t+=dt;this.wt+=dt;const b=player.buffs||{},has=k=>b[k]&&b[k].t>0;
    if(has('jgTempo')){const bt=Math.floor(this.t/.45);if(bt!==this.beat){this.beat=bt;self(()=>ring({x:player.x,y:player.y,r0:10,r1:34,life:.3,w:3,pal:RGD,segs:6,gap:.4,a:.7}));}}
    if(this.wt>.22){this.wt=0;
      if(has('jgVeil'))self(()=>wisp(player.x+R_(-12,12),player.y+R_(-6,6),R_(0,14),{w:R_(14,20),life:.7}));
      if(has('jgCry')&&Math.random()<.35){const p=tip();self(()=>embers(p[0],p[1],p[2],1,{spd:30,up:40,c:['#fff3c0','#ffc23a','#8a5410']}));}
      if(has('jgTotem')&&Math.random()<.4)self(()=>embers(player.x+R_(-10,10),player.y,R_(10,40)*HZ(),1,{spd:20,up:60,c:['#ffd0c0','#ff3a3a','#5a0610']}));}
    return CHAR==='jaguar';}
  draw(){const b=player.buffs||{},has=k=>b[k]&&b[k].t>0;
    if(has('jgFocus')){const k=(this.t%1.4)/1.4;if(k<.3){const [x,y]=P(player.x,player.y,(player.z||0)+58*HZ());art('eyesG',x,y,26,{sy:Math.sin(Math.PI*k/.3),a:.85});}}
    if(has('jgSlipNext')){const p=tip(),[x,y]=P(p[0],p[1],p[2]);glowAt(x,y,22,22,'#38e0d0',.5+.2*Math.sin(this.t*12));}
    if(has('jgRiposte')){const p=tip(),[x,y]=P(p[0],p[1],p[2]);star(x,y,7+2*Math.sin(this.t*18),'#ffc23a',this.t*2);}}}
let JW=null;
/* weapon trail: a thin obsidian ribbon behind the real dagger, its edge in the colour of the branch */
class JTrail{constructor(o){Object.assign(this,{s:[],maxAge:.1,layer:'top',active:true},o);this.__gt='-';}
  add(a,b){const l=this.s[this.s.length-1];if(l&&Math.hypot(l.a[0]-a[0],l.a[1]-a[1])>34)this.s.length=0;this.s.push({a,b,age:0});}
  update(dt){for(const q of this.s)q.age+=dt;while(this.s.length&&this.s[0].age>this.maxAge)this.s.shift();return this.active||this.s.length>0;}
  draw(){const s=this.s;if(s.length<2)return;const pal=this.pal||(this.pal=palBr(brOf(player.action&&(player.action.skill||player.action.key))));ctx.save();
    for(let i=1;i<s.length;i++){const k=1-s[i].age/this.maxAge;if(k<=0)continue;const p=s[i-1],q=s[i],ip=(u,P2)=>[lerp(P2.a[0],P2.b[0],u),lerp(P2.a[1],P2.b[1],u)];
      const band=(u0,u1,col,al)=>{const a0=ip(u0,p),a1=ip(u0,q),b1=ip(u1,q),b0=ip(u1,p);ctx.globalAlpha=al*k;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(a0[0],a0[1]);ctx.lineTo(a1[0],a1[1]);ctx.lineTo(b1[0],b1[1]);ctx.lineTo(b0[0],b0[1]);ctx.closePath();ctx.fill();};
      band(0,.55,pal[0],.35);band(0,.32,pal[1],.6);band(0,.12,pal[2],.9);band(0,.04,'#ffffff',.9);}ctx.restore();}}

/* ---------------------------------------------------------------------
   8. FILTERS — the old pictures stay off while her own code runs; generic pieces become v3 pieces
   --------------------------------------------------------------------- */
const DROPN=new Set(['JgGlint','JgRing','TexArc','StarCut','KnifeOrbit','ZigzagDash','SmokePuff','WindArc','FlickCut','NeedleCut','DrumBeat','BuffEmitter','Impact','GRing','BrushArc','SoundArcs','Crosshair','Streak','LineCut','ClawMarks','Drain','LightPillar','MirrorShardArt','SunStone','RuneCircle']);
function convert(n,f){if(window.__JGQUIET)return;
  if(n==='JgRing'||n==='GRing'){const r1=f.r1||0,r0=f.r0||0,pal=palOf(f.color);if(Math.max(r0,r1)<56)return;ring({x:f.x,y:f.y,r0:Math.max(2,r0),r1:Math.max(2,r1),life:(f.life||.4)*1.05,w:Math.max(3,(f.w||6)*.6),pal,segs:Math.max(3,Math.min(7,Math.round(r1/40))),gap:.25,delay:f.delay||0});
    if(r1>=140)flat(pal===CRM?'sunC':pal===TRQ||pal===TWI?'sunV':'sunG',f.x,f.y,r1*1.7,{life:(f.life||.5)*1.3,fi:.02,fo:.6,s0:.3,s1:1,pop:0,spin:2,a:.55});return;}
  if(n==='Streak'){const pal=palOf(f.color);addFx(new KStreak({a:[f.a[0],f.a[1]],b:[f.b[0],f.b[1]],z:f.a[2]||26,w:cl((f.w||8)*.5,3.5,6),life:(f.life||.25),pal,ink:.3}));return;}
  if(n==='LineCut'){const pal=palOf(f.color);addFx(new KLine({x:f.x,y:f.y,z:f.z||26,ang:f.ang||0,L:(f.len||60)*1.1,w:Math.max(2.6,(f.w||4)*.8),pal,grow:.03,hold:.05,fade:.15,ink:.45}));return;}
  if(n==='ClawMarks'){const pal=palOf(f.color),c=pal===CRM||pal===RGD?'C':pal===TRQ||pal===JAD||pal===TWI?'T':'G';gouge(f.x+Math.cos(f.phi||0)*20,f.y+Math.sin(f.phi||0)*20,f.phi||0,c,(f.len||70)*1.15,{life:Math.max(1.2,f.life||1.2)});return;}
  if(n==='SoundArcs'){const x=player.x,y=player.y;for(let i=0;i<(f.n||3);i++)later(i*.08,()=>ring({x,y,r0:18,r1:(f.R||150)*(1-i*.12),life:(f.life||.7)*.8,w:5,pal:GLD,segs:5,gap:.25}));return;}
  if(n==='Crosshair'){const e=f.e;if(!e)return;sprite({n:'eyesG',x:e.x,y:e.y,z:topZ(e)+8,w:30,follow:e,life:f.life||1,fi:.06,fo:.3,s0:.4,s1:1,pop:.12});sunAt(e.x,e.y,(e.r||14)+20,'sunG',{life:f.life||1,spin:2.5,a:.8,follow:e,s0:1.6,pop:0});return;}
  if(n==='Drain'){const fr=f.from;if(!fr)return;const pal=palOf(f.color),S=S1('top');for(let k=0;k<8;k++){const d=k*.035;S.add({im:pal===CRM?(AR.get('bdrop')||tx('core','#ef2a40')):tx('core',pal[2]),x:fr.x,y:fr.y,z:zOf(fr),delay:d,life:.42,s0:pal===CRM?7:9,s1:5,asp:pal===CRM?1.33:1,add:pal===CRM?0:1,fo:.25,
      orb:0,vx:(player.x-fr.x)/.42,vy:(player.y-fr.y)/.42,vz:(40*HZ()-zOf(fr))/.42+R_(-30,30)});}return;}
  if(n==='LightPillar'){if((f.h||0)<200){addFx(new ObsSpear({x:f.x,y:f.y}));return;}addFx(new JBeam({x:f.x,y:f.y,r:f.r||24,h:f.h,pal:palOf(f.color),life:(f.life||.6)*1.1}));return;}
  if(n==='MirrorShardArt'){return;}
  if(n==='SunStone'||n==='RuneCircle'){const pal=palOf(f.color),nm=f.color==='#2a1a3a'?'sunV':pal===CRM?'sunC':pal===JAD?'sunJ':pal===TRQ||pal===TWI||pal===VIO?'sunV':'sunG';sunAt(f.x,f.y,f.r||60,nm,{life:f.life||1,fi:Math.max(.05,f.fadeIn||.1),fo:.35,spin:(f.spin||.6)*.5,a:.9});return;}
  if(n==='Impact'||n==='JgGlint'){return;}}
const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(n==='JgTrail'||n==='Trail'){if(player&&player.action){const t=new JTrail({pal:palBr(brOf(player.action.skill||player.action.key))});return A0.call(this,t);}return A0.apply(this,arguments);}
    if((n==='JgRing'||n==='GRing')&&f.color==='#ffe9a8'){try{const x=f.x,y=f.y;ring({x,y,r0:10,r1:Math.max(40,f.r1||46),life:.4,w:5,pal:GLD,segs:5,gap:.25});sunAt(x,y,Math.max(30,(f.r1||46)*.8),'sunG',{life:.5,spin:2,a:.7});}catch(_){}return NOFX();}
    if((n==='JgGlint'||n==='Impact')&&f.color==='#ffe9a8'){try{const p=f.pos||[f.x,f.y,24];flare(p[0],p[1],p[2]||24,40,'#ffe89a',.2);}catch(_){}return NOFX();}
    if(n==='Decoy'&&(mine()||CHAR==='jaguar')){try{patchDecoy(f);}catch(_){}}
    /* the cast-bar circle castSkill puts under her (blue runes) → the sun stone of the skill's branch, gone when the cast ends */
    if((n==='RuneCircle'||n==='SunStone')&&f.color==='#6fc8ff'&&player.casting){try{const cc=player.casting,b=brOf(cc.key);sunAt(player.x,player.y,52,b==='B'?'sunV':b==='A'?'sunC':'sunG',{follow:player,life:(f.life||1)+.1,fi:.12,fo:.25,s0:.4,s1:1,spin:1.6,a:.85,until:()=>player.casting===cc});}catch(_){}return NOFX();}
    if(n==='ShadowPath'&&window.SKCTX==='jgStep')f._step=1;
    if(n==='GiantClaw'&&f._br==null)f._br=brOf(window.SKCTX);
    if(n==='SpectralPounce'&&f.mode==='aura'){f.layer='sorted';Object.defineProperty(f,'sy',{get(){return player.y-3;},configurable:true});}
    if(mine()&&DROPN.has(n)){try{convert(n,f);}catch(err){}return NOFX();}}
  return A0.apply(this,arguments);};
const EM0=window.emit;window.emit=emit=function(o){if(o&&(mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune)$/.test(o.type)||o.type==='mist'&&o.color==='#2fd6b0'))return;return EM0.apply(this,arguments);};
/* generic helpers her code calls: in her context they make v3 debris instead of round particles (rocks / embersAt are consts: their emits are dropped by the emit filter) */
{const D0=dustPuff;dustPuff=function(x,y,n,col,spd,sz){if(!mine()||window.__JGQUIET)return mine()?undefined:D0.apply(this,arguments);dust(x,y,Math.max(1,Math.min(8,Math.round(n/2))),{size:(sz||8)*4.6,spd:(spd||60)*.8,life:.7});};}
{const M0=mist;mist=function(x,y,z,n,col,sz,spd){if(!mine()||window.__JGQUIET)return mine()?undefined:M0.apply(this,arguments);const p=palOf(col),m=Math.max(1,Math.min(2,Math.round(n/4)));for(let i=0;i<m;i++)wisp(x+R_(-14,14),y+R_(-6,6),Math.max(0,z-10)+R_(0,10),{n:p===JAD||p===TRQ?'wispT':undefined,w:R_(13,18),life:R_(.45,.6)});smoke(x,y,z,1,p===JAD||p===TRQ?JADET:SHADET,(sz||18)*1.4,{sp:(spd||30),life:.45});};}
{const SB0=shardBurst;shardBurst=function(x,y,z,n,spd,dir,spread,col){if(!mine()||window.__JGQUIET)return mine()?undefined:SB0.apply(this,arguments);chips(x,y,z,Math.max(2,Math.min(14,Math.round(n*.7))),{spd:(spd||220)*.8,dir:dir==null?null:dir,spread:spread==null?3.2:spread});};}
{const SP0=sparks;sparks=function(x,y,z,dir,n,col,spd,spread,o){if(!mine()||window.__JGQUIET)return mine()?undefined:SP0.apply(this,arguments);const p=palOf(col);embers(x,y,z,Math.max(1,Math.min(8,Math.round(n/2))),{dir,spread:spread||.7,spd:(spd||200)*.6,up:80,c:[p[4],p[2],p[1]],life:.35});};}
/* timers started in her context keep it when they fire (the basic attack has no skill key) */
{const T0=setFxTimer;setFxTimer=function(sec,fn){if(mine()&&!window.SKCTX){return T0(sec,()=>{const o=window.__JGT;window.__JGT=1;try{fn();}finally{window.__JGT=o;}});}return T0.apply(this,arguments);};}

/* ---------------------------------------------------------------------
   9. KEEP-ALIVE — the watcher and the debris systems come back after a map change / the bench
   --------------------------------------------------------------------- */
function vEnsure(){ensure();if(!JW||!fx.includes(JW))JW=A0(new JWatch());}
JV.ensure=vEnsure;
{const E0=window.jgEnsure;window.jgEnsure=function(){if(E0)E0.apply(this,arguments);vEnsure();};}
vEnsure();
JV.ready=1;
})();
