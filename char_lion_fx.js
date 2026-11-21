/* =====================================================================
   TOTEM LEGEND — Greek white lion · painted skill effects (assets/fx/lion, 26 pieces)
   Pictures are the main effect; the code VFX in char_lion.js stay underneath as support.
   installLionFx() runs after installLion():
     - LiShot draws the painted javelin (Keraunos for the big one), LiEagle the lightning eagle,
       LiBolt the painted sky strike
     - lSlamFx adds the slam crater that fits the skill in use (pounce / suplex / toss / labors)
     - lHit adds a hit spark (arena dust for basic/A, lightning for B)
     - LxWatch keeps a piece while the state lasts: storm cloud, aegis, overcharge, Nemean Hide,
       Laurel Rest, Laurel Crown, Ascension
     - each skill's make() adds its cast piece
   Placement rules: ground pieces flat on the ground layer · upright pieces stand on their bottom edge
     · streaks aimed along the attack · hit sparks on the body, short.
   ===================================================================== */
const LXI={};
function lxImg(n){let o=LXI[n];if(!o){o=LXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/lion/'+n+'.webp';}return o.ok?o.im:null;}
const LXF=['nemean_hide','pounce_land','laurel_rest','kings_roar','grab_flash','suplex_crash','shove_wave','arena_spin','titan_lift','counter_flash','labors_ring','dust_hit',
  'thunder_javelin','sky_strike','zeus_eagle','storm_cloud','overcharge_aura','aegis_dome','olympus_wrath','spark_hit','titan_toss','laurel_crown','laurel_circle','ascend_aura','twelfth_slam','keraunos'];
const lxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
function lxDraw(n,x,y,w,o={}){const im=lxImg(n);if(!im)return false;const h=o.h||w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=o.a??1;if(o.add)ctx.globalCompositeOperation='lighter';
  ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);if(o.fx)ctx.scale(-1,1);ctx.drawImage(im,-w*(o.ax??.5),-h*(o.ay??.5),w,h);ctx.restore();ctx.globalAlpha=1;return true;}

class LxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,delay:0,sortOff:0,pulse:0,spin:0},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;if(this.t<0)return true;const f=this.follow;if(f){if(f.dead&&f!==player)this.hold=null;else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}
    if(this.hold&&this.hold())this.t=Math.min(this.t,this.life*(1-this.fadeOut));
    return this.t<this.life;}
  draw(){if(this.t<0||!lxImg(this.n))return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),[x,y]=P(this.x,this.y,this.z),o={ax:this.ax,ay:this.ay,rot:this.rot+this.spin*this.t,fy:this.fy};
    lxDraw(this.n,x,y,this.w*s,Object.assign({a},o));if(this.glow&&k<.35)lxDraw(this.n,x,y,this.w*s,Object.assign({a:this.glow*a*(1-k/.35),add:true},o));}}
const lxP=o=>addFx(window.TV?new TV.Piece(Object.assign({img:lxImg,hero:'lion'},o)):new LxImg(o));
const lxGround=(n,x,y,w,o={})=>lxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.7,s0:.6,s1:1.04,fadeIn:.06,fadeOut:.4},o));
const lxStand=(n,x,y,w,o={})=>lxP(Object.assign({n,x,y,z:0,w,ay:.96,layer:'sorted',sortOff:4,life:.8,s0:.7,s1:1,fadeIn:.1,fadeOut:.4},o));
const lxSpark=(n,e,w,o={})=>{if(!e)return;lxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?42:24)+(e.z||0)+rnd(-4,4),w,life:.24,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6,rot:rnd(-.3,.3)},o));};
const lxTgt=c=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,300);
const lxStreak=(n,x,y,phi,w,o={})=>{const r=lxScr(phi);return lxP(Object.assign({n,x,y,z:30,w,rot:r,fy:Math.cos(r)<0,life:.4,s0:.7,s1:1.05,fadeIn:.02,fadeOut:.5,glow:.5},o));};

/* ---------- cast-moment pieces ---------- */
const LX_CAST={
  lnRoar:()=>lxGround('kings_roar',player.x,player.y,LB.lnRoar.R*1.5,{life:.7,s0:.3,s1:1.1,glow:.5,a0:.8}),
  laGrab:c=>{const t=lxTgt(c);if(t)lxSpark('grab_flash',t,64,{life:.45,s0:1.3,s1:1});},
  laShove:()=>{const p=player.phi;lxStreak('shove_wave',player.x+Math.cos(p)*50,player.y+Math.sin(p)*50,p,130,{life:.4});},
  laSpin:()=>lxGround('arena_spin',player.x,player.y,LB.laSpin.R*2.1,{follow:player,life:1.1,spin:0,s0:.6,s1:1,a0:.75}),
  laLift:c=>{const t=lxTgt(c);if(t)lxStand('titan_lift',t.x,t.y,110,{delay:.15,life:.8,s0:.5,s1:1.05,glow:.5});},
  laCounter:()=>lxP({n:'counter_flash',x:player.x,y:player.y,z:34,w:70,follow:player,life:LB.laCounter.T+.15,a0:.75,s0:.6,s1:1,glow:.4}),
  laLabors:()=>lxGround('labors_ring',player.x,player.y,LB.laLabors.R*1.3,{life:LB.laLabors.n*.15+.8,s0:.5,s1:1,a0:.85,fadeOut:.15}),
  lbWrath:()=>lxGround('olympus_wrath',player.x,player.y,LB.lbWrath.R*1.25,{life:LB.lbWrath.n*.18+.6,s0:.4,s1:1,a0:.8,fadeOut:.15,pulse:.12}),
  lcTwelfth:c=>{const t=lxTgt(c);if(t)lxStand('twelfth_slam',t.x,t.y,150,{delay:.6,life:.9,s0:.5,s1:1.05,glow:.6,sortOff:8});},
};
/* slam crater: which picture fits the skill being used */
const LX_SLAM={lnPounce:'pounce_land',laLabors:'labors_ring',lcToss:'titan_toss',laSpin:'arena_spin',lcAtlas:'arena_spin'};

/* ---------- state → painted piece while it lasts ---------- */
class LxWatch{constructor(){this.t=0;this.layer='none';this.seen=new WeakSet();this.on={};}draw(){}
  update(dt){if(CHAR!=='lion')return false;
    const C=LI.cloud;if(C&&!this.seen.has(C)){this.seen.add(C);lxStand('storm_cloud',C.x,C.y,(C.R||110)*1.4,{life:Math.max(.4,C.until-gameTime),a0:.85,s0:.5,s1:1,fadeOut:.1,hold:()=>LI.cloud===C&&C.until>gameTime});}
    const once=(k,on,mk)=>{if(on&&!this.on[k]){this.on[k]=1;mk(()=>{const v=on0[k]();if(!v)this.on[k]=0;return v;});}};
    const on0={aegis:()=>LI.aegis>0,over:()=>hasBuff('lbOver'),hide:()=>hasBuff('lnHide'),rest:()=>hasBuff('lnRest'),crown:()=>hasBuff('lcCrown'),asc:()=>hasBuff('lcAscend')};
    once('aegis',on0.aegis(),h=>lxStand('aegis_dome',player.x,player.y,120,{follow:player,sortOff:6,life:99,a0:.55,fadeOut:.02,s0:.5,s1:1,hold:h}));
    once('over',on0.over(),h=>lxStand('overcharge_aura',player.x,player.y,110,{follow:player,sortOff:-3,life:99,a0:.6,pulse:.2,fadeOut:.02,hold:h}));
    once('hide',on0.hide(),h=>lxP({n:'nemean_hide',x:player.x,y:player.y,z:34,w:84,follow:player,life:99,a0:.45,fadeOut:.02,s0:.5,s1:1,pulse:.1,hold:h}));
    once('rest',on0.rest(),h=>lxStand('laurel_rest',player.x,player.y,96,{follow:player,life:99,a0:.65,fadeOut:.02,pulse:.15,hold:h}));
    once('crown',on0.crown(),h=>{lxGround('laurel_circle',player.x,player.y,150,{follow:player,life:99,a0:.55,fadeOut:.02,hold:h});lxP({n:'laurel_crown',x:player.x,y:player.y,z:96,w:46,follow:player,life:99,a0:.9,fadeOut:.02,hold:()=>hasBuff('lcCrown')});});
    once('asc',on0.asc(),h=>lxStand('ascend_aura',player.x,player.y,170,{follow:player,sortOff:-3,life:99,a0:.6,pulse:.2,fadeOut:.02,hold:h}));
    return true;}}
function lxEnsure(){if(!fx.some(f=>f instanceof LxWatch))addFx(new LxWatch());}

function installLionFx(){if(CHAR!=='lion')return;if(!/[?&]vfx3=0/.test(location.search))return;   /* 2026-11-21: the painted toon look only with ?vfx3=0 — lion_vfx.js (SVG + code VFX) is the default */
  if(window.TV)TV.toonify();LXF.forEach(lxImg);lxEnsure();
  for(const k in LX_CAST){const f=LX_CAST[k],s=SKILLS[k];if(!f||!s||!s.make||s._lx)continue;const mk=s.make;
    s.make=function(c){const a=mk.apply(this,arguments);if(a){try{lxEnsure();const cc=c||{};setFxTimer(.12,()=>f(cc));}catch(e){}}return a;};s._lx=1;}
  if(window._lxHook)return;window._lxHook=1;
  const H=window.lHit;window.lHit=function(e,mult,key){const r=H.apply(this,arguments);try{if(e&&r&&(!e._lxT||gameTime-e._lxT>.07)){e._lxT=gameTime;const b=lCol(key);lxSpark(b==='B'?'spark_hit':'dust_hit',e,b==='B'?56:52);}}catch(_){}return r;};
  const SL=window.lSlamFx;window.lSlamFx=function(x,y,R){try{const k=(player.action&&(player.action.skill||player.action.key))||'',n=LX_SLAM[k]||'suplex_crash';
      if(n!=='labors_ring')lxGround(n,x,y,Math.max(110,R*2.1),{life:.8,s0:.4,s1:1.05,fadeIn:.01,glow:.5});}catch(_){}return SL.apply(this,arguments);};
  /* javelin / Keraunos */
  const SD=LiShot.prototype.draw;LiShot.prototype.draw=function(){const n=this.big?'keraunos':'thunder_javelin';if(!lxImg(n))return SD.call(this);
    const [x,y]=P(this.x,this.y,this.z),r=lxScr(this.phi);if(window.TV&&gameTime-(this._tv||0)>.03){this._tv=gameTime;TV.trailFx(x,y,r,'electric',{n:this.big?3:2});}lGlow(x,y,this.w*1.4,this.col,.35);lxDraw(n,x,y,this.big?190:96,{ax:.78,rot:r,fy:Math.cos(r)<0});};
  /* eagle of Zeus: faces the way it flies */
  const ED=LiEagle.prototype.draw;LiEagle.prototype.draw=function(){if(!lxImg('zeus_eagle'))return ED.call(this);const [x,y]=P(this.x,this.y,this.z),dx=this.x-(this._px??this.x);if(window.TV&&gameTime-(this._tv||0)>.05){this._tv=gameTime;TV.trailFx(x,y,dx<0?Math.PI:0,'electric',{n:1});}if(Math.abs(dx)>.5)this._fl=dx<0;this._px=this.x;
    lGlow(x,y,20,LIC.gold,.4);lxDraw('zeus_eagle',x,y,70,{fx:this._fl});};
  /* sky strike bolt */
  const BD=LiBolt.prototype.draw;LiBolt.prototype.draw=function(){if(!lxImg('sky_strike'))return BD.call(this);const k=this.t/this.life,[x,y]=P(this.x,this.y,0);if(window.TV)TV.once(this,'b',()=>TV.fxAt('hit',x,y-12,64,'electric',{cols:TV.colsOf(lxImg('sky_strike'))}));
    lxDraw('sky_strike',x,y,Math.max(70,this.w*16),{ay:.92,a:k<.6?1:Math.max(0,(1-k)/.4)});lGlow(x,y,40,LIC.bolt,.4*(1-k));};
}
(function(){const I=window.installLion;if(typeof I==='function'&&!I._lx){window.installLion=function(){const r=I.apply(this,arguments);try{installLionFx();}catch(e){}return r;};window.installLion._lx=1;}})();

if(window.TV)TV.hint('lion',{thunder_javelin:'electric',sky_strike:'electric',zeus_eagle:'electric',storm_cloud:'electric',overcharge_aura:'electric',aegis_dome:'electric',olympus_wrath:'electric',spark_hit:'electric',keraunos:'electric',ascend_aura:'electric',
  pounce_land:'stone',suplex_crash:'stone',titan_toss:'stone',dust_hit:'stone',twelfth_slam:'stone',titan_lift:'stone',shove_wave:'stone',arena_spin:'sand'});
