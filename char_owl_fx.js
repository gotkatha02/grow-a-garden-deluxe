/* =====================================================================
   TOTEM LEGEND — Snowy owl · painted skill effects (assets/fx/owl, 36 pieces)
   Pictures are the main effect; the older code VFX stay underneath as support.
     - bolts: the flying bolt itself is a painted piece, aimed along its flight
     - every old owSheet() call is swapped for a painted piece (same place, same moment)
     - world props (lantern, tent, cage, storm) are painted
     - marks, aiming reticle, crits, chill hits use painted pieces
   Placement rules (same as the crocodile):
     ground pieces lie on the ground layer · upright pieces stand on their bottom edge
     hit sparks sit on the body · streaks are aimed along the attack
   installOwlFx() runs after installOwl().
   ===================================================================== */
const OXI={};
function oxImg(n){let o=OXI[n];if(!o){o=OXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/owl/'+n+'.webp';}return o.ok?o.im:null;}
const OXF=['o01_bolt','o02_fan','o03_pierce','o04_heavy','o05_drill','o06_rico','o07_hitmoon','o08_hitgold','o09_mark','o10_weak','o11_deadeye','o12_pow',
  'o13_exec','o14_moonbeam','o15_moonring','o16_fatal','o17_goldeye','o18_spirit','o19_flurry','o20_snare','o21_frost','o22_freeze','o23_shatter','o24_iceshards',
  'o25_skyfall','o26_cage','o27_storm','o28_volley','o29_veil','o30_flash','o31_guard','o32_hop','o33_lantern','o34_glow','o35_tent','o36_feathers'];
const oxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const oxQ=n=>Math.max(1,Math.round(n*((typeof Q!=='undefined'&&Q.p)?Math.min(1,Q.p+.2):1)));

/* one painted piece placed in the world */
class OxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,rise:0,spin:0,sq:1,delay:0,sortOff:0,pulse:0},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;const f=this.follow;if(f){if(f.dead&&f!==player){this.follow=null;}else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}
    if(this.aimFrom&&!this.aimed){const dx=player.x-this.aimFrom.x,dy=player.y-this.aimFrom.y;if(Math.hypot(dx,dy)>4){const r=oxScr(Math.atan2(dy,dx));this.rot=r;this.fy=Math.cos(r)<0;this.aimed=1;}}
    return this.t<this.life;}
  draw(){if(this.t<0)return;const im=oxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.5)),[x,y]=P(this.x,this.y,this.z+this.rise*k),w=this.w*s,h=w*im.naturalHeight/im.naturalWidth*this.sq;
    const draw=(alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t);if(this.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    draw(a,false);if(this.glow&&k<.4)draw(this.glow*a*(1-k/.4),true);ctx.globalAlpha=1;}}
const oxP=o=>addFx(new OxImg(o));
const oxSpark=(n,e,w,o={})=>{if(!e)return;oxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?44:24)+(e.z||0)+rnd(-4,4),w,life:.26,s0:.55,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.7,rot:rnd(-.4,.4)},o));};
const oxGround=(n,x,y,w,o={})=>oxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.7,s0:.7,s1:1.05,fadeIn:.06,fadeOut:.45},o));
const oxStand=(n,x,y,w,o={})=>oxP(Object.assign({n,x,y,z:0,w,ay:.94,layer:'sorted',sortOff:3,life:.8,s0:.75,s1:1,fadeIn:.12,fadeOut:.4},o));

/* small bits from a strip of 8 (ice shards / feathers) that fly out, fall and settle */
class OxBit{
  constructor(o){Object.assign(this,{t:0,layer:'top',z:10,vx:0,vy:0,vz:0,g:560,w:16,spin:rnd(-8,8),rot:rnd(0,TAU),landed:false,drift:0},o);this.cell=(Math.random()*8)|0;this.life=this.life||rnd(.9,1.4);}
  update(dt){this.t+=dt;if(!this.landed){if(this.drift){this.vz=Math.max(this.vz-this.g*dt,-60);this.vx*=1-dt*2;this.vy*=1-dt*2;}else this.vz-=this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;
      if(this.z<=0){this.z=0;this.landed=true;this.layer='ground';}}return this.t<this.life;}
  draw(){const im=oxImg(this.n);if(!im)return;const cw=im.naturalWidth/8,ch=im.naturalHeight,[x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.35);
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.landed?this.rot:this.rot+this.spin*this.t);ctx.drawImage(im,this.cell*cw,0,cw,ch,-this.w/2,-this.w/2,this.w,this.w);ctx.restore();ctx.globalAlpha=1;}}
function oxBits(n,x,y,count,o={}){const fe=n==='o36_feathers';for(let i=0;i<oxQ(count);i++){const an=o.phi!=null?o.phi+rnd(-(o.spread||.8),o.spread||.8):rnd(0,TAU),v=rnd(o.v0||80,o.v1||200);
  addFx(new OxBit({n,x,y,z:o.z??20,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(o.vz0||100,o.vz1||240),w:rnd(o.s0||12,o.s1||18),drift:fe,g:fe?260:560,spin:fe?rnd(-3,3):rnd(-9,9),life:fe?rnd(1.1,1.7):undefined}));}}

/* ---------- old sprite-sheet calls → painted pieces ---------- */
const OX_SHEET={
  drill_sparks:o=>{oxP({n:'o10_weak',x:o.x,y:o.y,z:o.z,w:96,life:.38,s0:.6,s1:1.05,fadeIn:.001,fadeOut:.55,glow:.8});oxBits('o24_iceshards',o.x,o.y,3,{z:o.z,s0:8,s1:12});},
  feather_guard:o=>{oxStand('o31_guard',player.x,player.y,112,{follow:player,life:1.1,a0:.6,s0:.6,s1:1,fadeIn:.15,fadeOut:.45,glow:.5});oxBits('o36_feathers',player.x,player.y,5,{z:40,v0:40,v1:110});},
  freeze:o=>{oxStand('o22_freeze',o.x,o.y,(o.s||.36)*230,{life:1.15,s0:.4,s1:1,fadeIn:.08,fadeOut:.35,glow:.5,sortOff:5});},
  frost_volley:o=>{oxP({n:'o28_volley',x:player.x,y:player.y,z:o.z||30,w:170,life:.42,s0:.45,s1:1.15,fadeIn:.001,fadeOut:.6,glow:.8,spin:.6});},
  ice_snare:o=>{const L=OW_SHEETS.ice_snare.n/OW_SHEETS.ice_snare.fps/(o.speed||1);oxGround('o20_snare',o.x,o.y,(o.s||.42)*200,{life:Math.max(.8,L),s0:.5,s1:1,fadeIn:.08,fadeOut:.2,glow:.6});},
  mark_hit:o=>{oxP({n:'o09_mark',x:o.x,y:o.y,z:o.z,w:50,life:.55,s0:1.6,s1:1,fadeIn:.001,fadeOut:.5,glow:.9});},
  moon_beam:o=>{oxStand('o14_moonbeam',o.x,o.y,96,{life:.95,s0:.7,s1:1,fadeIn:.06,fadeOut:.45,glow:.9});oxGround('o15_moonring',o.x,o.y,110,{life:1,s0:.4,s1:1.05,glow:.6});},
  moon_cut:o=>{oxP({n:'o13_exec',x:o.x,y:o.y,z:o.z,w:(o.s||.36)*270,life:.42,s0:.7,s1:1.1,fadeIn:.001,fadeOut:.55,glow:.9,rot:rnd(-.6,.6),fy:!!o.flip});},
  moon_rain:o=>{const R=(o.s||1.5)/1.5*110;oxGround('o15_moonring',o.x,o.y,R*2.2,{life:1.6,s0:.6,s1:1,a0:.9,glow:.6});},
  pierce_hit:o=>{oxP({n:'o07_hitmoon',x:o.x,y:o.y,z:o.z,w:(o.s||.5)*130,life:.26,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.8,rot:rnd(-.5,.5)});},
  shatter:o=>{oxStand('o23_shatter',o.x,o.y,(o.s||.3)*330,{life:.6,s0:.6,s1:1.08,fadeIn:.001,fadeOut:.5,glow:.7,fy:false,sortOff:6});oxBits('o24_iceshards',o.x,o.y,7,{z:24});},
  silver_glint:o=>{oxP({n:'o07_hitmoon',x:o.x,y:o.y,z:o.z,w:46,life:.4,s0:.4,s1:1,fadeIn:.001,fadeOut:.6,glow:.9,spin:2});},
  snow_impact:o=>{oxP({n:'o12_pow',x:o.x,y:o.y,z:o.z,w:(o.s||.4)*190,life:.3,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.55,glow:.6,rot:rnd(-.3,.3)});},
  snow_storm:o=>{const R=(o.s||1.25)/1.25*100;oxGround('o27_storm',o.x,o.y,R*2.3,{life:1.9,s0:.92,s1:1,a0:.85,fadeIn:.35,fadeOut:.3,spin:.5});},
  tent_rest:null,     /* keep the warm motes */
  veil_puff:o=>{oxStand('o29_veil',player.x,player.y+2,(o.s||.42)*300,{life:.9,s0:.5,s1:1.08,fadeIn:.04,fadeOut:.55,a0:.92,sortOff:8});},
  wing_hop:o=>{oxP({n:'o32_hop',x:o.x,y:o.y,z:22,w:120,ax:.75,life:.4,s0:.8,s1:1,fadeIn:.001,fadeOut:.6,glow:.5,follow:player,aimFrom:{x:o.x,y:o.y}});oxBits('o36_feathers',o.x,o.y,4,{z:24,v0:40,v1:120});},
  wings:o=>{if((o.speed||1)>2){oxP({n:'o30_flash',x:player.x,y:player.y,z:o.z||40,w:150,life:.45,s0:.4,s1:1.15,fadeIn:.001,fadeOut:.55,glow:.9});oxBits('o36_feathers',player.x,player.y,8,{z:40,v0:120,v1:220});}
    else{oxP({n:'o17_goldeye',x:player.x,y:player.y,z:(o.z||44)+60*CHAR_SCALE,w:120,life:1.1,s0:.4,s1:1,fadeIn:.08,fadeOut:.4,glow:.9,follow:player});}},
};

/* ---------- which painted bolt each shot uses ---------- */
function oxBoltPiece(ctx,o){const k=ctx&&ctx.key,b=(o&&o.bolt)||{};
  if(k==='basic')return b.kind==='dead'?['o03_pierce',80]:b.kind==='sub'?['o01_bolt',46]:['o01_bolt',56];
  if(k==='oaPierce'||k==='oaAim'||k==='oaDeadeye')return ['o03_pierce',k==='oaDeadeye'?120:100];
  if(k==='oaHeavy')return ['o04_heavy',78];if(k==='oaDrill')return ['o05_drill',80];
  if(k==='oaMark'||k==='oaRico')return ['o01_bolt',60];
  if(/^ob|ocDouble/.test(k||''))return ['o19_flurry',k==='obSnare'?64:52];
  return ['o01_bolt',56];}

function installOwlFx(){if(CHAR!=='owl')return;OXF.forEach(oxImg);
  /* sheets */
  const oxSheetInit=sh=>{if(sh._ox)return;sh._ox=1;const f=OX_SHEET[sh.key];if(f){sh._gone=1;try{f(sh);}catch(err){console.warn('owl fx',sh.key,err);}}};
  const _ou=OwSheet.prototype.update,_od=OwSheet.prototype.draw;
  OwSheet.prototype.update=function(dt){oxSheetInit(this);return this._gone?false:_ou.call(this,dt);};
  OwSheet.prototype.draw=function(){oxSheetInit(this);if(!this._gone)_od.call(this);};
  /* painted bolts */
  if(typeof owFire==='function'){const _f=owFire;owFire=function(a,ctx,o){const b=_f.apply(this,arguments);if(b){const [n,w]=oxBoltPiece(ctx,o);b.px=n;b.pw=w;}return b;};}
  const _bd=OwBolt.prototype.draw;OwBolt.prototype.draw=function(){if(!this.px)return _bd.call(this);const im=oxImg(this.px);if(!im)return _bd.call(this);
    const [x,y]=P(this.x,this.y,this.z),ang=oxScr(this.phi),a=this.dead?Math.max(0,this.fade/.14):Math.min(1,this.t/.02);
    if(this.trail.length>1){const [tx,ty]=P(...this.trail[0]),dx=x-tx,dy=y-ty,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ww=(this.trailW||1.8)*1.4;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(tx,ty,x,y);g.addColorStop(0,hexA(this.tint,0));g.addColorStop(1,hexA(this.tint,.45*a));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x+nx*ww,y+ny*ww);ctx.lineTo(x-nx*ww,y-ny*ww);ctx.closePath();ctx.fill();ctx.restore();}
    if(this.glow)owGlow(x,y,10+this.glow*6,this.tint,.3*a);
    const w=this.pw,h=w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(ang);if(Math.cos(ang)<0)ctx.scale(1,-1);ctx.drawImage(im,-w*.92,-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
  /* bolts falling from the sky */
  const _sd=OwSkyBolt.prototype.draw;OwSkyBolt.prototype.draw=function(){const lt=this.t-this.delay;if(lt<0||lt>=this.T||this.beam)return _sd.call(this);
    const ice=this.tint===OWC.ice||this.tint===OWC.ice2,im=oxImg(ice?'o19_flurry':'o01_bolt');if(!im)return _sd.call(this);
    const k=Math.min(1,lt/this.T),z=lerp(this.h,4,eIn(k)),[x,y]=P(this.x,this.y,z),[,gy]=P(this.x,this.y,0),w=ice?56:50,h=w*im.naturalHeight/im.naturalWidth;
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);ctx.drawImage(im,-w*.92,-h/2,w,h);ctx.restore();
    ctx.save();ctx.globalAlpha=.25*k;ctx.fillStyle='#0a0e18';ctx.beginPath();ctx.ellipse(x,gy,6+6*k,2.5+2.5*k,0,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;};
  const _su=OwSkyBolt.prototype.update;OwSkyBolt.prototype.update=function(dt){const was=this.landed,r=_su.call(this,dt);if(!was&&this.landed){const ice=this.tint===OWC.ice||this.tint===OWC.ice2;
      if(this.beam)oxStand('o14_moonbeam',this.x,this.y,90,{life:.8,glow:.9});else oxGround(ice?'o21_frost':'o15_moonring',this.x,this.y,ice?40:46,{life:.35,s0:.5,s1:1.1,fadeOut:.6});}return r;};
  /* hit sparks */
  if(typeof owImpact==='function'){const _i=owImpact;owImpact=function(e,phi,o={}){const r=_i.apply(this,arguments);try{oxSpark('o07_hitmoon',e,46+(o.s||.5)*60);}catch(_){}return r;};}
  /* crits: gold star burst */
  const _dn=dmgNum;dmgNum=function(x,y,z,val,kind,o={}){const r=_dn.apply(this,arguments);try{if(kind==='crit'&&o&&o.who&&!o.who._oxC){const e=o.who;e._oxC=1;setFxTimer(.12,()=>{e._oxC=0;});oxSpark('o08_hitgold',e,88,{life:.32,z:(e.boss?52:30)});}}catch(_){}return r;};
  /* chill gained: small frost burst (throttled per enemy) */
  if(typeof owChill==='function'){const _c=owChill;owChill=function(e,n){const b=e&&e.owChill||0,r=_c.apply(this,arguments);try{if(e&&!e.dead&&(e.owChill||0)>b&&!(e._oxF>gameTime)){e._oxF=gameTime+.45;oxSpark('o21_frost',e,34+(e.owChill||1)*4,{life:.4,glow:.5});}}catch(_){}return r;};}
  /* Hunter's Mark sigil above marked enemies */
  if(typeof owEyeSigil==='function'){const _e=owEyeSigil;owEyeSigil=function(x,y,s,a,open=1){const im=oxImg('o09_mark');if(!im)return _e.apply(this,arguments);const w=s*4.2;ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,x-w/2,y-w/2,w,w*im.naturalHeight/im.naturalWidth);ctx.restore();ctx.globalAlpha=1;};}
  /* aiming reticle (Aimed Shot / Deadeye) */
  const _ad=OwSight.prototype.draw;OwSight.prototype.draw=function(){_ad.call(this);const t=this.tg,im=oxImg('o11_deadeye');if(!t||t.dead||!im)return;const k=Math.min(1,this.t/this.T),[x,y]=P(t.x,t.y,(t.boss?40:24)+(t.z||0)),w=lerp(this.eclipse?110:90,this.eclipse?62:50,eOut(k));
    ctx.save();ctx.globalAlpha=.35+.6*k;ctx.translate(x,y);ctx.rotate(this.t*(this.eclipse?1.2:.6));ctx.drawImage(im,-w/2,-w/2,w,w*im.naturalHeight/im.naturalWidth);ctx.restore();ctx.globalAlpha=1;};
  /* Charged Bolt feather fan */
  OwFan.prototype.draw=function(){const im=oxImg('o02_fan');if(!im)return;const k=this.t/this.life,a=Math.pow(1-k,1.1),[x,y]=P(this.x,this.y,this.z),ang=oxScr(this.phi),w=this.R*(.55+.6*eOut(k)),h=w*im.naturalHeight/im.naturalWidth;
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(ang);if(Math.cos(ang)<0)ctx.scale(1,-1);ctx.drawImage(im,10,-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
  /* crescent moon behind the owl (Silent Execution) */
  const _md=OwMoon.prototype.draw;OwMoon.prototype.draw=function(){const im=oxImg('o13_exec');if(!im)return _md.call(this);const a=Math.min(1,this.t/.4)*Math.min(1,(this.life-this.t)/.4),[x,y]=P(player.x-dirSide(player.dir)*10,player.y,110),w=96;
    owGlow(x,y,70,OWC.moon2,.25*a);ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,x-w/2,y-w/2,w,w*im.naturalHeight/im.naturalWidth);ctx.restore();ctx.globalAlpha=1;};
  /* snow lantern prop */
  const _lu=OwLanternObj.prototype.update;OwLanternObj.prototype.update=function(dt){if(!this._ox){this._ox=1;oxGround('o34_glow',this.x,this.y,this.R*1.9,{life:this.life,s0:.5,s1:1,a0:.8,fadeIn:.3,fadeOut:.04,pulse:.25});}return _lu.call(this,dt);};
  const _ld=OwLanternObj.prototype.draw;OwLanternObj.prototype.draw=function(){const im=oxImg('o33_lantern');if(!im)return _ld.call(this);const a=Math.min(1,this.t/.3)*Math.min(1,(this.life-this.t)/.5),[x,y]=P(this.x,this.y),up=eOutBack(Math.min(1,this.t/.35)),w=46*up,h=w*im.naturalHeight/im.naturalWidth,fl=.85+.15*Math.sin(this.t*7);
    ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,x-w/2,y-h*.94,w,h);ctx.restore();owGlow(x,y-h*.5,22,OWC.warm,.35*a*fl);ctx.globalAlpha=1;};
  /* snow tent prop */
  const _td=OwTentObj.prototype.draw;OwTentObj.prototype.draw=function(){const im=oxImg('o35_tent');if(!im)return _td.call(this);const a=Math.min(1,this.t/.25)*Math.min(1,(this.life-this.t)/.3),[x,y]=P(this.x,this.y),up=eOutBack(Math.min(1,this.t/.3)),w=92,h=w*im.naturalHeight/im.naturalWidth*up;
    ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,x-w/2,y-h*.92,w,h);ctx.restore();ctx.globalAlpha=1;};
  /* Blizzard Cage: painted ring of pillars instead of code crystals; shatters at the end */
  const _cu=OwCageObj.prototype.update;OwCageObj.prototype.update=function(dt){if(!this._ox){this._ox=1;for(const p of this.pil)if(p){p.draw=()=>{};p.shatter=null;}
      oxGround('o27_storm',this.x,this.y,this.R*2.1,{life:this.life,s0:.6,s1:1,a0:.55,fadeIn:.3,fadeOut:.05,spin:.8});
      oxStand('o26_cage',this.x,this.y+this.R*.6,this.R*2.25,{ay:.86,a0:.85,life:this.life,s0:.6,s1:1,fadeIn:.18,fadeOut:.05,sortOff:-this.R*1.4,glow:.4});}
    const r=_cu.call(this,dt);if(!r&&!this._oxEnd){this._oxEnd=1;oxStand('o23_shatter',this.x,this.y,this.R*1.8,{life:.6,s0:.6,s1:1.1,fadeIn:.001,fadeOut:.5});oxBits('o24_iceshards',this.x,this.y,14,{z:30,v0:120,v1:260});}return r;};
  /* per-skill extras */
  const RX={
    oaFatal:a=>a.events.push({t:.05,f:()=>oxStand('o16_fatal',player.x,player.y,90,{follow:player,life:.9,s0:.5,s1:1,fadeIn:.06,fadeOut:.45,glow:.8,sortOff:-2})}),
    oaExec:a=>a.events.push({t:.04,f:()=>oxGround('o15_moonring',player.x,player.y,170,{follow:player,life:Math.max(.8,a.dur||1),s0:.4,s1:1,a0:.85,glow:.5})}),
    obCircle:a=>a.events.push({t:.02,f:()=>oxP({n:'o18_spirit',x:player.x,y:player.y,z:60,w:110,life:.9,s0:.6,s1:1,fadeIn:.1,fadeOut:.4,follow:player,a0:.85,rise:30})}),
    obSkyfall:a=>a.events.push({t:.05,f:()=>{oxP({n:'o25_skyfall',x:player.x,y:player.y,z:110,w:150,life:.5,s0:.7,s1:1,fadeIn:.04,fadeOut:.5,a0:.9});}}),
    ocMoonfall:a=>a.events.push({t:.03,f:()=>oxP({n:'o18_spirit',x:player.x,y:player.y,z:90,w:150,life:1,s0:.5,s1:1.05,fadeIn:.12,fadeOut:.4,a0:.8,rise:40})}),
    ocHunt:a=>a.events.push({t:.05,f:()=>oxStand('o16_fatal',player.x,player.y,110,{follow:player,life:1,s0:.5,s1:1,glow:.9})}),
  };
  for(const k in RX){const sk=SKILLS[k];if(!sk||!sk.make)continue;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a){a.events=a.events||[];try{RX[k](a,c||{});}catch(err){console.warn('owl fx',k,err);}}return a;};}
  window.OX_SHEET=OX_SHEET;}
