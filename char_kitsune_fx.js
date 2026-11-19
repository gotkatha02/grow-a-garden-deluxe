/* =====================================================================
   TOTEM LEGEND — Nine-tailed kitsune · painted skill effects (assets/fx/kitsune, 26 pieces)
   Pictures are the main effect; the code VFX in char_kitsune.js stay underneath as support.
   How it hooks in (installKitsuneFx() runs after installKitsune()):
     - projectiles draw their painted piece: KiHome = foxfire orb, KiShot = crescent / fire wheel / moon disc
     - KiPillar (sky drops) and KiBeam (lines) draw painted wisps, stars, pillars, beams
     - world objects (torii, mirror, lunar circle, night, lanterns) get painted pieces while they last
     - each skill's make() adds its cast piece; kHit adds a hit spark (fire for A, moon for B)
   Placement rules: ground pieces flat on the ground layer · upright pieces stand on their bottom edge
     · streaks aimed along the attack · hit sparks on the body, short.
   ===================================================================== */
const KXI={};
function kxImg(n){let o=KXI[n];if(!o){o=KXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/kitsune/'+n+'.webp';}return o.ok?o.im:null;}
const KXF=['fox_step','ofuda_ward','inari_bless','torii_circle','foxfire_orb','flame_pillar','fox_lantern','wisp_fall','tail_burst','fire_veil','inferno_beam','fire_hit',
  'moon_beam','crescent_blade','yata_mirror','lunar_circle','star_fall','moonlight_form','night_circle','moon_hit','fire_wheel','moon_disc','inari_rice','nine_tail_aura','fox_sun','tsukuyomi_beam'];
const kxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
/* draw one piece at screen point (x,y): w = width, ax/ay = anchor, rot, flipY, alpha */
function kxDraw(n,x,y,w,o={}){const im=kxImg(n);if(!im)return;const h=o.h||w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=o.a??1;if(o.add)ctx.globalCompositeOperation='lighter';
  ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*(o.ax??.5),-h*(o.ay??.5),w,h);ctx.restore();ctx.globalAlpha=1;}

/* one painted piece placed in the world */
class KxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,delay:0,sortOff:0,pulse:0,flat:false},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;if(this.t<0)return true;const f=this.follow;if(f){this.x=f.x;this.y=f.y;}
    if(this.hold&&this.hold())this.t=Math.min(this.t,this.life*(1-this.fadeOut));
    return this.t<this.life;}
  draw(){if(this.t<0)return;const im=kxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),[x,y]=P(this.x,this.y,this.z);
    kxDraw(this.n,x,y,this.w*s,{ax:this.ax,ay:this.ay,rot:this.rot,fy:this.fy,a});if(this.glow&&k<.35)kxDraw(this.n,x,y,this.w*s,{ax:this.ax,ay:this.ay,rot:this.rot,fy:this.fy,a:this.glow*a*(1-k/.35),add:true});}}
const kxP=o=>addFx(window.TV?new TV.Piece(Object.assign({img:kxImg,hero:'kitsune'},o)):new KxImg(o));
const kxGround=(n,x,y,w,o={})=>kxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.7,s0:.6,s1:1.04,fadeIn:.06,fadeOut:.4},o));
const kxStand=(n,x,y,w,o={})=>kxP(Object.assign({n,x,y,z:0,w,ay:.96,layer:'sorted',sortOff:4,life:.8,s0:.7,s1:1,fadeIn:.1,fadeOut:.4},o));
const kxSpark=(n,e,w,o={})=>{if(!e)return;kxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?42:24)+(e.z||0)+rnd(-4,4),w,life:.24,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6,rot:rnd(-.4,.4)},o));};

/* ---------- cast-moment pieces ---------- */
const KX_CAST={
  knStep:()=>{kxStand('fox_step',player.x,player.y,96,{life:1.6,a0:.85,fadeOut:.3});},           /* the decoy stays where she stood */
  knWard:()=>kxP({n:'ofuda_ward',x:player.x,y:player.y,z:30,w:120,follow:player,life:KB.knWard.T,a0:.55,s0:.5,s1:1,fadeOut:.1,pulse:.15,hold:()=>KI.shield>0&&gameTime<KI.shieldUntil}),
  knBless:()=>kxStand('inari_bless',player.x,player.y,104,{follow:player,life:1.1,glow:.5}),
  kaBurst:()=>kxGround('tail_burst',player.x,player.y,KB.kaBurst.R*2.2,{delay:.05,life:.8,s0:.3,s1:1.1,glow:.6}),
  kaVeil:()=>kxStand('fire_veil',player.x,player.y,KB.kaVeil.R*1.9,{follow:player,sortOff:6,life:KB.kaVeil.T,a0:.55,fadeOut:.08,pulse:.15,hold:()=>hasBuff('kaVeil')}),
  kaInferno:()=>kxStand('nine_tail_aura',player.x,player.y,170,{follow:player,sortOff:-3,life:2.4,a0:.8,glow:.5}),
  kbMoonlight:()=>kxStand('moonlight_form',player.x,player.y,96,{follow:player,sortOff:5,life:KB.kbMoonlight.T,a0:.7,fadeOut:.15,hold:()=>hasBuff('kbMoonlight')}),
  kcGrace:()=>kxGround('inari_rice',player.x,player.y,200,{follow:player,life:KB.kcGrace.T,a0:.8,fadeOut:.06,hold:()=>hasBuff('kcGrace')}),
  kcAwaken:()=>{kxStand('nine_tail_aura',player.x,player.y,150,{follow:player,sortOff:-3,life:KB.kcAwaken.T,a0:.55,pulse:.2,fadeOut:.04,hold:()=>hasBuff('kcAwaken')});},
};

/* ---------- world objects: a painted piece while each one lasts ---------- */
class KxWatch{constructor(){this.t=0;this.layer='none';this.seen=new WeakSet();}draw(){}
  update(dt){if(CHAR!=='kitsune')return false;const sp=(o,f)=>{if(o&&!this.seen.has(o)){this.seen.add(o);f(o,Math.max(.3,(o.until||gameTime+1)-gameTime));}};
    sp(KI.torii,(o,L)=>kxGround('torii_circle',o.x,o.y,KB.knTorii.R*2.3,{life:L,a0:.85,fadeOut:.06,s0:.5,s1:1}));
    sp(KI.mirror,(o,L)=>kxStand('yata_mirror',o.x,o.y,74,{life:L,fadeOut:.08,s0:.4,s1:1,glow:.5}));
    sp(KI.circle,(o,L)=>kxGround('lunar_circle',o.x,o.y,(o.R||KB.kbCircle.R)*2.3,{life:L,a0:.85,fadeOut:.1,s0:.4,s1:1}));
    sp(KI.night,(o,L)=>kxGround('night_circle',player.x,player.y,KB.kbNight.R*2.2,{follow:player,life:L,a0:.5,fadeOut:.08,s0:.5,s1:1}));
    for(const l of KI.lanterns)sp(l,(o,L)=>kxStand('fox_lantern',o.x,o.y,38,{z:6,life:L,fadeOut:.06,s0:.4,s1:1,hold:()=>KI.lanterns.includes(o)}));
    return true;}}
function kxEnsure(){if(!fx.some(f=>f instanceof KxWatch))addFx(new KxWatch());}

function installKitsuneFx(){if(CHAR!=='kitsune')return;if(window.TV)TV.toonify();KXF.forEach(kxImg);kxEnsure();
  for(const k in KX_CAST){const f=KX_CAST[k],s=SKILLS[k];if(!f||!s||!s.make||s._kx)continue;const mk=s.make;
    s.make=function(c){const a=mk.apply(this,arguments);if(a){try{kxEnsure();setFxTimer(.12,()=>f(c||{}));}catch(e){}}return a;};s._kx=1;}
  if(window._kxHook)return;window._kxHook=1;
  /* hit sparks */
  const H=window.kHit;window.kHit=function(e,mult,key){const r=H.apply(this,arguments);try{if(e&&r&&(!e._kxT||gameTime-e._kxT>.07)){e._kxT=gameTime;const b=kCol(key);kxSpark(b==='B'?'moon_hit':'fire_hit',e,b==='B'?56:50);}}catch(_){}return r;};
  /* homing foxfire orb */
  KiHome.prototype.draw=function(){const [x,y]=P(this.x,this.y,this.z);if(window.TV&&gameTime-(this._tv||0)>.04){this._tv=gameTime;TV.trailFx(x,y,Math.atan2(this.vy,this.vx),'fire',{n:1,lines:false,g:-30});}kGlow(x,y,16,KIC.fire,.45);kxDraw('foxfire_orb',x,y,34,{ay:.62});};
  /* crescent / wheel / moon disc */
  const SD=KiShot.prototype.draw;KiShot.prototype.draw=function(){const [x,y]=P(this.x,this.y,this.z);if(window.TV&&gameTime-(this._tv||0)>.035){this._tv=gameTime;TV.trailFx(x,y,(this.dir||1)>0?this.phi:this.phi+Math.PI,this.kind==='wheel'?'fire':'light',{n:2});}
    if(this.kind==='wheel'){const im=kxImg('fire_wheel');if(!im)return SD.call(this);const r=kxScr(this.phi);kxDraw('fire_wheel',x,y,this.w*5,{ax:.72,rot:r,fy:Math.cos(r)<0});return;}
    if(this.kind==='disc'){if(!kxImg('moon_disc'))return SD.call(this);kGlow(x,y,this.w*1.6,KIC.moon,.4);kxDraw('moon_disc',x,y,this.w*2.6,{rot:this.t*2});return;}
    if(!kxImg('crescent_blade'))return SD.call(this);kxDraw('crescent_blade',x,y,this.w*3.4,{rot:this.t*14});};
  /* sky drops and pillars: wisps, stars, flame pillars, the fox sun, night moonbeams */
  const PD=KiPillar.prototype.draw;KiPillar.prototype.draw=function(){const k=this.t/this.life,[x,y]=P(this.x,this.y,0),fire=this.col===KIC.fire||this.col===KIC.fire2,star=this.col==='#fff2b0';
    if(window.TV){if(star||(fire&&this.w<=14)){if(k>.62)TV.once(this,'land',()=>TV.fxAt('hit',x,y-10,star?44:40,star?'light':'fire',{cols:TV.colsOf(kxImg(star?'star_fall':'wisp_fall'))}));}
      else if(fire&&this.w>=100){if(k>.68)TV.once(this,'land',()=>{TV.fxAt('ground',x,y,320,'fire',{cols:TV.colsOf(kxImg('fox_sun'))});shake(2);});}
      else if(fire)TV.once(this,'b',()=>TV.fxAt('stand',x,y,this.w*2.6,'fire',{cols:TV.colsOf(kxImg('flame_pillar'))}));else TV.once(this,'b',()=>TV.fxAt('stand',x,y,this.w*3,'light',{cols:TV.colsOf(kxImg('moonlight_form'))}));}
    if(star||(fire&&this.w<=14)){const n=star?'star_fall':'wisp_fall',dz=(1-Math.min(1,k*1.5))*170,a=k<.66?1:Math.max(0,(1-k)/.34);
      kxDraw(n,x,y-dz,star?30:28,{ay:.9,a});if(k>.6)kxDraw(star?'moon_hit':'fire_hit',x,y-14,40*(.6+k),{a:a*.9,add:false});return;}
    if(fire&&this.w>=100){const dz=(1-Math.min(1,k*1.4))*240,a=k<.7?1:Math.max(0,(1-k)/.3);kxDraw('fox_sun',x,y-60-dz,200,{a});return;}
    if(fire){kxDraw('flame_pillar',x,y,this.w*2.6,{ay:.96,a:k<.6?1:Math.max(0,(1-k)/.4)});return;}
    PD.call(this);kxDraw('moonlight_form',x,y,this.w*3,{ay:.96,a:(1-k)*.8});};
  /* beams: moon beam, Tsukuyomi's giant beam, inferno foxfire beams */
  const BD=KiBeam.prototype.draw;KiBeam.prototype.draw=function(){const a=1-this.t/this.life,[x0,y0]=P(this.x,this.y,34),[x1,y1]=P(this.x+Math.cos(this.phi)*this.L,this.y+Math.sin(this.phi)*this.L,34);
    const L=Math.hypot(x1-x0,y1-y0),r=Math.atan2(y1-y0,x1-x0),fire=this.col===KIC.fire,big=this.w>=25,n=fire?'inferno_beam':big?'tsukuyomi_beam':'moon_beam';
    if(window.TV)TV.once(this,'b',()=>{TV.fxAt('streak',x0,y0,big?150:90,fire?'fire':'light',{phi:r,cols:TV.colsOf(kxImg(n))});TV.fxAt('hit',x1,y1,big?90:56,fire?'fire':'light',{cols:TV.colsOf(kxImg(n))});});
    if(!kxImg(n)||L<20)return BD.call(this);ctx.save();ctx.translate(x0,y0);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);
    const h=Math.max(26,this.w*(big?4.5:fire?3.2:4));ctx.globalAlpha=Math.min(1,a*1.4);ctx.drawImage(kxImg(n),0,-h/2,L,h);ctx.restore();ctx.globalAlpha=1;};
}
/* re-wrap if installKitsune() runs again (skill window / mode switch) */
(function(){const I=window.installKitsune;if(typeof I==='function'&&!I._kx){window.installKitsune=function(){const r=I.apply(this,arguments);try{installKitsuneFx();}catch(e){}return r;};window.installKitsune._kx=1;}})();

if(window.TV)TV.hint('kitsune',{moon_beam:'light',crescent_blade:'light',lunar_circle:'light',star_fall:'light',moonlight_form:'light',night_circle:'light',moon_hit:'light',moon_disc:'light',tsukuyomi_beam:'light',
  yata_mirror:'gold',inari_rice:'gold',inari_bless:'gold',ofuda_ward:'gold',torii_circle:'fire',fox_step:'light',nine_tail_aura:'fire'});
