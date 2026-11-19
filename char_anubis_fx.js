/* =====================================================================
   TOTEM LEGEND — Anubis jackal · painted skill effects (assets/fx/anubis, 26 pieces)
   Pictures are the main effect; the code VFX in char_anubis.js stay underneath as support.
   installAnubisFx() runs after installAnubis():
     - UThrow (lasso / soul hook) draws the painted chain stretched from the hero to the ball
     - UPillar repaints: gold/blue = judgment pillar, sun = Ra's falling sun, dark = Anubis head / soul hit
     - uSlam adds the meteor crater · uHit adds a hit spark (sand for basic/A, soul for B)
     - UxWatch keeps a painted piece on world state while it lasts: standard, spin / Wheel of Ra,
       dust devils, chain guard, linen shield, underworld gate, the condemned target's sin mark
     - each skill's make() adds its cast piece
   Placement rules: ground pieces flat on the ground layer · upright pieces stand on their bottom edge
     · streaks aimed along the attack · hit sparks on the body, short.
   ===================================================================== */
const UXI={};
function uxImg(n){let o=UXI[n];if(!o){o=UXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/anubis/'+n+'.webp';}return o.ok?o.im:null;}
const UXF=['lunge_dash','linen_wraps','rite_glow','standard_circle','flail_sweep','sand_spin','chain_lasso','meteor_crater','duat_cyclone','chain_guard','sun_wheel','sand_hit',
  'soul_hook','heart_crush','binding_chains','sin_mark','judgment_strike','shadow_gate','scales_hall','soul_hit','dust_devil','scale_breaker','ra_sun','anubis_head','avatar_aura','rebirth'];
const uxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
function uxDraw(n,x,y,w,o={}){const im=uxImg(n);if(!im)return false;const h=o.h||w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=o.a??1;if(o.add)ctx.globalCompositeOperation='lighter';
  ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*(o.ax??.5),-h*(o.ay??.5),w,h);ctx.restore();ctx.globalAlpha=1;return true;}

class UxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,delay:0,sortOff:0,pulse:0,spin:0},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;if(this.t<0)return true;const f=this.follow;if(f){if(f.dead&&f!==player)this.hold=null;else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}
    if(this.hold&&this.hold())this.t=Math.min(this.t,this.life*(1-this.fadeOut));
    return this.t<this.life;}
  draw(){if(this.t<0)return;if(!uxImg(this.n))return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),[x,y]=P(this.x,this.y,this.z),o={ax:this.ax,ay:this.ay,rot:this.rot+this.spin*this.t,fy:this.fy};
    uxDraw(this.n,x,y,this.w*s,Object.assign({a},o));if(this.glow&&k<.35)uxDraw(this.n,x,y,this.w*s,Object.assign({a:this.glow*a*(1-k/.35),add:true},o));}}
const uxP=o=>addFx(window.TV?new TV.Piece(Object.assign({img:uxImg,hero:'anubis'},o)):new UxImg(o));
const uxGround=(n,x,y,w,o={})=>uxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.7,s0:.6,s1:1.04,fadeIn:.06,fadeOut:.4},o));
const uxStand=(n,x,y,w,o={})=>uxP(Object.assign({n,x,y,z:0,w,ay:.96,layer:'sorted',sortOff:4,life:.8,s0:.7,s1:1,fadeIn:.1,fadeOut:.4},o));
const uxSpark=(n,e,w,o={})=>{if(!e)return;uxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?42:24)+(e.z||0)+rnd(-4,4),w,life:.24,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6,rot:rnd(-.3,.3)},o));};
const uxTgt=c=>(c&&c.target&&!c.target.dead)?c.target:(ANU.cond&&!ANU.cond.dead?ANU.cond:nearestEnemy(player.x,player.y,300));

/* ---------- cast-moment pieces (run 0.12 s after make(), at the hit moment) ---------- */
const UX_CAST={
  anLunge:()=>{const r=uxScr(player.phi);uxP({n:'lunge_dash',x:player.x,y:player.y,z:20,w:150,rot:r,fy:Math.cos(r)<0,ax:.75,life:.45,fadeIn:.02,fadeOut:.5});},
  anRite:()=>uxStand('rite_glow',player.x,player.y,104,{follow:player,life:1.1,glow:.5}),
  aaSweep:()=>uxGround('flail_sweep',player.x,player.y,UK.aaSweep.R*2.3,{rot:uxScr(player.phi)*.25,fy:Math.cos(player.phi)<0,life:.4,s0:.8,s1:1.05,fadeIn:.01,fadeOut:.55}),
  aaCyclone:()=>uxStand('duat_cyclone',player.x,player.y,UK.aaCyclone.R*1.5,{life:.9,s0:.5,s1:1.05,glow:.5}),
  abCrush:c=>{const t=uxTgt(c);if(t)uxStand('heart_crush',t.x,t.y,100,{delay:.05,life:.7,s0:1.2,s1:1,fadeIn:.001,glow:.6,sortOff:8});},
  abBind:c=>{const t=uxTgt(c);if(t)uxStand('binding_chains',t.x,t.y,Math.max(70,t.r*3.2),{follow:t,life:UK.abBind.root+.3,s0:.4,s1:1,fadeOut:.2,sortOff:6});},
  abHall:c=>{const t=uxTgt(c);if(t)uxStand('scales_hall',t.x,t.y-8,170,{life:.3+UK.abHall.n*.5+.4,s0:.6,s1:1,a0:.85,sortOff:-12,fadeOut:.15,pulse:.1});},
  acBreaker:()=>{const p=player.phi,L=UK.acBreaker.len,mx=player.x+Math.cos(p)*L*.55,my=player.y+Math.sin(p)*L*.55,r=uxScr(p);
    uxGround('scale_breaker',mx,my,L*1.1,{rot:r,fy:Math.cos(r)<0,delay:.08,life:.9,s0:.5,s1:1,fadeIn:.02,glow:.5});},
  acRebirth:()=>uxGround('rebirth',player.x,player.y,140,{follow:player,life:UK.acRebirth.T,a0:.5,fadeOut:.06,hold:()=>hasBuff('acRebirth')}),
  acAvatar:()=>uxStand('avatar_aura',player.x,player.y,170,{follow:player,sortOff:-3,life:UK.acAvatar.T,a0:.55,pulse:.2,fadeOut:.04,hold:()=>hasBuff('acAvatar')}),
};

/* ---------- world state → painted pieces while it lasts ---------- */
class UxWatch{constructor(){this.t=0;this.layer='none';this.seen=new WeakSet();this.cond=null;}draw(){}
  update(dt){if(CHAR!=='anubis')return false;const sp=(o,f)=>{if(o&&typeof o==='object'&&!this.seen.has(o)){this.seen.add(o);f(o,Math.max(.3,(o.until||gameTime+1)-gameTime));}};
    sp(ANU.standard,(o,L)=>uxGround('standard_circle',o.x,o.y,UK.anStandard.R*2.1,{life:L,a0:.7,fadeOut:.06,s0:.5,s1:1}));
    sp(ANU.spin,(o,L)=>{const wheel=o.key==='aaWheel';uxGround('sand_spin',player.x,player.y,Math.min(240,(o.R||120)*1.8),{follow:player,life:L,a0:wheel?.45:.65,fadeOut:.1,spin:0,pulse:.1,hold:()=>ANU.spin===o});
      if(wheel)uxP({n:'sun_wheel',x:player.x,y:player.y,z:34,w:110,follow:player,life:L,a0:.6,spin:4,fadeOut:.1,hold:()=>ANU.spin===o});});
    for(const d of ANU.devils)sp(d,(o,L)=>uxStand('dust_devil',o.x,o.y,(UK.acDevil.R||90)*1.1,{follow:o,life:L,fadeOut:.1,s0:.4,s1:1,hold:()=>ANU.devils.includes(o)}));
    if(ANU.guard>0&&gameTime<ANU.guardUntil&&!this.gOn){this.gOn=1;uxStand('chain_guard',player.x,player.y,104,{follow:player,sortOff:6,life:99,a0:.55,fadeOut:.02,s0:.5,s1:1,hold:()=>{const on=ANU.guard>0&&gameTime<ANU.guardUntil;if(!on)this.gOn=0;return on;}});}
    if(ANU.shield>0&&gameTime<ANU.shieldUntil&&!this.sOn){this.sOn=1;uxP({n:'linen_wraps',x:player.x,y:player.y,z:30,w:110,follow:player,life:99,a0:.5,fadeOut:.02,s0:.5,s1:1,pulse:.12,hold:()=>{const on=ANU.shield>0&&gameTime<ANU.shieldUntil;if(!on)this.sOn=0;return on;}});}
    if(ANU.gateT>gameTime&&!this.gate){this.gate=1;uxGround('shadow_gate',player.x,player.y,150,{life:Math.max(.4,ANU.gateT-gameTime)+.2,s0:.3,s1:1,fadeOut:.2,glow:.4,hold:()=>{const on=ANU.gateT>gameTime;if(!on)this.gate=0;return on;}});}
    /* sin mark over the condemned target (size grows with sin) */
    const c=ANU.cond&&!ANU.cond.dead&&ANU.sin>0?ANU.cond:null;
    if(c&&this.cond!==c){this.cond=c;const me=c;uxP({n:'sin_mark',x:c.x,y:c.y,z:(c.boss?96:64),w:34,follow:c,life:99,fadeOut:.02,s0:.5,s1:1,pulse:.15,hold:()=>{const on=ANU.cond===me&&!me.dead&&ANU.sin>0;if(!on&&this.cond===me)this.cond=null;return on;}});}
    return true;}}
function uxEnsure(){if(!fx.some(f=>f instanceof UxWatch))addFx(new UxWatch());}

function installAnubisFx(){if(CHAR!=='anubis')return;if(window.TV)TV.toonify();UXF.forEach(uxImg);uxEnsure();
  for(const k in UX_CAST){const f=UX_CAST[k],s=SKILLS[k];if(!f||!s||!s.make||s._ux)continue;const mk=s.make;
    s.make=function(c){const a=mk.apply(this,arguments);if(a){try{uxEnsure();const cc=c||{};setFxTimer(.12,()=>f(cc));}catch(e){}}return a;};s._ux=1;}
  if(window._uxHook)return;window._uxHook=1;
  const H=window.uHit;window.uHit=function(e,mult,key){const r=H.apply(this,arguments);try{if(e&&r&&(!e._uxT||gameTime-e._uxT>.07)){e._uxT=gameTime;const b=uCol(key);uxSpark(b==='B'?'soul_hit':'sand_hit',e,b==='B'?56:50);}}catch(_){}return r;};
  const SL=window.uSlam;window.uSlam=function(x,y,R){try{uxGround('meteor_crater',x,y,R*1.9,{life:.9,s0:.4,s1:1.05,fadeIn:.01,glow:.5});}catch(_){}return SL.apply(this,arguments);};
  /* chain lasso / soul hook: the painted chain is stretched from the hero to the ball */
  const TD=UThrow.prototype.draw;UThrow.prototype.draw=function(){const hook=this.col===UC.blue||this.col==='#6a3aa8'||this.speed>=900,n=hook?'soul_hook':'chain_lasso',im=uxImg(n);
    const [x0,y0]=P(player.x,player.y,30),[x1,y1]=P(this.x,this.y,30),L=Math.hypot(x1-x0,y1-y0);if(window.TV&&gameTime-(this._tv||0)>.04){this._tv=gameTime;TV.trailFx(x1,y1,Math.atan2(y1-y0,x1-x0)+((this.dir||1)>0?0:Math.PI),hook?'shadow':'sand',{n:2});}if(!im||L<24)return TD.call(this);
    const r=Math.atan2(y1-y0,x1-x0),h=Math.max(22,L*im.naturalHeight/im.naturalWidth);ctx.save();ctx.translate(x0,y0);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);
    ctx.drawImage(im,0,-h/2,L+h*.4,h);ctx.restore();};
  /* sky pillars → judgment light / Ra's falling sun / Anubis head / soul strike */
  const PD=UPillar.prototype.draw;UPillar.prototype.draw=function(){const k=this.t/this.life,[x,y]=P(this.x,this.y,0),a=k<.65?1:Math.max(0,(1-k)/.35);
    if(window.TV){if(this.col===UC.sun){if(k>.7)TV.once(this,'land',()=>{TV.fxAt('ground',x,y,this.w>=100?340:220,'gold',{cols:TV.colsOf(uxImg('ra_sun'))});shake(2);});}
      else if(this.col==='#3a2a5a')TV.once(this,'b',()=>TV.fxAt(this.w>=60?'stand':'hit',x,y,this.w>=60?180:60,'shadow',{cols:TV.colsOf(uxImg(this.w>=60?'anubis_head':'soul_hit'))}));
      else if(this.col===UC.gold||this.col===UC.blue)TV.once(this,'b',()=>TV.fxAt('stand',x,y,Math.max(90,this.w*2.4),'shadow',{cols:TV.colsOf(uxImg('judgment_strike'))}));}
    if(this.col===UC.sun){const dz=(1-Math.min(1,k*1.4))*240,w=this.w>=100?210:140;if(uxDraw('ra_sun',x,y-50-dz,w,{a}))return;}
    else if(this.col==='#3a2a5a'){if(this.w>=60){if(uxDraw('anubis_head',x,y-40,190*(.8+.25*Math.min(1,k*2)),{a}))return;}else if(uxDraw('soul_hit',x,y-26,60,{a}))return;}
    else if(this.col===UC.gold||this.col===UC.blue){if(uxDraw('judgment_strike',x,y,Math.max(70,this.w*2.2),{ay:.96,a}))return;}
    else if(this.col===UC.sand)return;   /* uSlam: the crater piece is enough */
    PD.call(this);};
}
(function(){const I=window.installAnubis;if(typeof I==='function'&&!I._ux){window.installAnubis=function(){const r=I.apply(this,arguments);try{installAnubisFx();}catch(e){}return r;};window.installAnubis._ux=1;}})();

if(window.TV)TV.hint('anubis',{linen_wraps:'light',rebirth:'gold',standard_circle:'gold',rite_glow:'gold',lunge_dash:'sand',flail_sweep:'sand',sand_spin:'sand',meteor_crater:'sand',duat_cyclone:'sand',dust_devil:'sand',sand_hit:'sand',
  chain_lasso:'gold',chain_guard:'gold',sun_wheel:'gold',ra_sun:'gold'});
