/* =====================================================================
   TOTEM LEGEND — Aztec crocodile · painted skill effects (assets/fx/croc)
   Pictures are the main effect; the older code VFX stay underneath as support.
   Rules used so nothing "floats":
     - streaks / slashes are aimed along the attack, at spear height, and wipe in from the hero
     - ground pieces (rings, pools, circles) lie on the ground layer at the feet
     - upright pieces (spirit, aura, dome) stand on the ground: anchored at their bottom edge
     - hit sparks sit on the target's body, short and snappy
     - shards / drops fly out with gravity, land, settle and fade
   installCrocFx() runs after installCrocRework().
   ===================================================================== */
const CXI={};
/* pieces not regenerated reuse a close new one */
const CX_ALIAS={c04_serpent:'c01_thrust',c06_armorbreak:'c42_shatter',c16_frenzy:'c26_feast',c29_emblem:'c10_charge',c33_pow:'c31_hitjade',c34_splash:'c23_crush',
  c37_sunburst:'c10_charge',c38_rollfinale:'c19_roll',c39_throw:'c03_crescent',c40_impale:'c01_thrust',c41_shake:'c15_rip'};
function cxImg(n){n=CX_ALIAS[n]||n;let o=CXI[n];if(!o){o=CXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/croc/'+n+'.webp';}return o.ok?o.im:null;}
const CXF0=['c01_thrust','c02_longfang','c03_crescent','c04_serpent','c05_hook','c06_armorbreak','c07_fracture','c08_boundary','c09_rain','c10_charge','c11_sunpiercer','c12_edge',
  'c13_jaw','c14_lock','c15_rip','c16_frenzy','c17_tail','c18_tailbreak','c19_roll','c20_lunge','c21_drag','c22_ambush','c23_crush','c24_ironjaw','c25_spirit','c26_feast','c27_scales',
  'c28_stride','c29_emblem','c30_sun','c31_hitjade','c32_hitred','c33_pow','c34_splash','c35_shards','c36_drops','c37_sunburst','c38_rollfinale','c39_throw','c40_impale','c41_shake','c42_shatter'];
const CXF=[...new Set(CXF0.filter(n=>!/c35|c36/.test(n)).map(n=>CX_ALIAS[n]||n))];
/* screen angle of a world direction (the floor is squashed by K) */
const cxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));

class CxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,wipe:0,glow:0,rise:0,slide:0,spin:0,sq:1,delay:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;const f=this.follow;if(f){if(f.dead&&f!==player){this.follow=null;}else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}return this.t<this.life;}
  draw(){if(this.t<0)return;const im=cxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    const a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.5));
    const [x,y]=P(this.x+Math.cos(this.phi||0)*this.slide*k,this.y+Math.sin(this.phi||0)*this.slide*k,this.z+this.rise*k);
    const w=this.w*s,h=w*im.naturalHeight/im.naturalWidth*this.sq;
    const draw=(alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t);if(this.fy)ctx.scale(1,-1);
      if(this.wipe){const c=eOut(Math.min(1,k/this.wipe));ctx.beginPath();ctx.rect(-w*this.ax,-h*this.ay-2,w*c+1,h+4);ctx.clip();}
      ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    draw(a,false);if(this.glow&&k<.4)draw(this.glow*a*(1-k/.4),true);ctx.globalAlpha=1;}}

/* falling bits from a strip of 8 (shards / drops) */
class CxBit{
  constructor(o){Object.assign(this,{t:0,layer:'top',z:10,vx:0,vy:0,vz:0,g:620,w:16,spin:rnd(-9,9),rot:rnd(0,TAU),landed:false},o);this.cell=(Math.random()*8)|0;this.life=this.life||rnd(.9,1.4);}
  update(dt){this.t+=dt;if(!this.landed){this.x+=this.vx*dt;this.y+=this.vy*dt;this.vz-=this.g*dt;this.z+=this.vz*dt;
      if(this.z<=0){this.z=0;if(Math.abs(this.vz)>120&&!this.b){this.vz*=-.28;this.vx*=.45;this.vy*=.45;this.b=1;}else{this.landed=true;this.layer='ground';}}}
    return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.35),w=this.w*.5;
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.landed?this.rot:this.rot+this.spin*this.t);ctx.lineWidth=1.6;ctx.lineJoin='round';
    if(this.n==='c35_shards'){ctx.fillStyle='#2b2f33';ctx.strokeStyle='#3a2414';ctx.beginPath();ctx.moveTo(0,-w);ctx.lineTo(w*.55,-w*.1);ctx.lineTo(w*.25,w*.8);ctx.lineTo(-w*.45,w*.35);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='#5dff8a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-w*.7);ctx.lineTo(w*.1,w*.1);ctx.lineTo(-w*.2,w*.4);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.moveTo(0,-w*.8);ctx.lineTo(w*.35,-w*.15);ctx.lineTo(w*.05,-w*.1);ctx.closePath();ctx.fill();}
    else{ctx.rotate(-(this.landed?this.rot:this.rot+this.spin*this.t));ctx.fillStyle='#5fd8e8';ctx.strokeStyle='#147a86';ctx.beginPath();ctx.moveTo(0,-w);ctx.bezierCurveTo(w*.7,-w*.1,w*.6,w*.7,0,w*.7);ctx.bezierCurveTo(-w*.6,w*.7,-w*.7,-w*.1,0,-w);ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.ellipse(-w*.2,w*.15,w*.12,w*.2,0,0,TAU);ctx.fill();}
    ctx.restore();ctx.globalAlpha=1;}}
function cxBits(n,x,y,count,o={}){count=Math.round(count*((typeof Q!=='undefined'&&Q.p)?Math.min(1,Q.p+.2):1));for(let i=0;i<count;i++){const an=o.phi!=null?o.phi+rnd(-(o.spread||.8),o.spread||.8):rnd(0,TAU),v=rnd(o.v0||90,o.v1||240);
  addFx(new CxBit({n,x,y,z:o.z??18,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(o.vz0||120,o.vz1||300),w:rnd(o.s0||12,o.s1||20)}));}}

/* helpers to place pieces */
const cxP=o=>addFx(new CxImg(o));
/* a streak aimed along phi starting at the hero's spear */
function cxStreak(n,phi,len,o={}){const r=cxScr(phi),left=Math.cos(r)<0;cxP(Object.assign({n,x:player.x+Math.cos(phi)*(o.off??10),y:player.y+Math.sin(phi)*(o.off??10),z:o.z??24,w:len,ax:0,ay:.5,rot:r,fy:left,phi,
  life:.3,s0:.96,s1:1.02,fadeIn:.001,fadeOut:.5,wipe:.35,glow:.7,slide:o.slide??18},o));}
/* a spark on a body */
function cxSpark(n,e,w,o={}){if(!e)return;cxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?44:24)+rnd(-4,4),w,life:.24,s0:.55,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.8,rot:rnd(-.4,.4)},o));}
/* lying on the ground */
function cxGround(n,x,y,w,o={}){cxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.7,s0:.7,s1:1.05,fadeIn:.06,fadeOut:.45},o));}
/* standing on the ground (anchored at the bottom edge) */
function cxStand(n,x,y,w,o={}){cxP(Object.assign({n,x,y,z:0,w,ay:.94,life:.8,s0:.75,s1:1,fadeIn:.12,fadeOut:.4},o));}
const cxT=(a,c)=>{const t=(c&&c.target&&!c.target.dead)?c.target:(a.hitList&&a.hitList[0])||nearestEnemy(player.x,player.y,260);return t;};
const cxPhi=(a,c)=>{const t=cxT(a,c);return t?angTo(t):player.phi;};
const cxAt=(a,t,f)=>{a.events=a.events||[];a.events.push({t:Math.max(.01,t),f});};

/* --------- one recipe per skill: what picture, when, where --------- */
const CX_RECIPE={
  basic:(a,c)=>{if(a.name==='Maw Finisher')cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxSpark('c14_lock',t,150,{life:.34});cxSpark('c33_pow',t,90,{delay:.04});cxBits('c36_drops',t.x,t.y,6);}});},
  crThrust:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c01_thrust',cxPhi(a,c),150)),
  caPierce:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c01_thrust',cxPhi(a,c),175,{glow:.9})),
  caLongFang:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c02_longfang',cxPhi(a,c),230,{life:.36})),
  caImpale:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c40_impale',cxPhi(a,c),170,{life:.38,off:20})),
  caFracture:(a,c)=>{cxAt(a,a.windup-.03,()=>cxStreak('c01_thrust',cxPhi(a,c),160));cxAt(a,a.windup+.01,()=>{const t=cxT(a,c);if(t){cxSpark('c07_fracture',t,120,{life:.4});cxBits('c35_shards',t.x,t.y,7);}});},
  caCrescent:(a,c)=>cxAt(a,a.windup-.06,()=>{const phi=cxPhi(a,c);cxP({n:'c03_crescent',x:player.x+Math.cos(phi)*44,y:player.y+Math.sin(phi)*44,z:20,w:170,rot:cxScr(phi),fy:Math.cos(cxScr(phi))<0,life:.34,s0:.8,s1:1.08,fadeIn:.001,wipe:.4,glow:.7});}),
  caHook:(a,c)=>cxAt(a,a.windup-.03,()=>{const phi=cxPhi(a,c);cxP({n:'c05_hook',x:player.x+Math.cos(phi)*60,y:player.y+Math.sin(phi)*60,z:22,w:140,rot:cxScr(phi),fy:Math.cos(cxScr(phi))<0,life:.36,s0:.85,s1:1.05,fadeIn:.001,wipe:.4,glow:.6});}),
  caSerpent:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c04_serpent',cxPhi(a,c),165,{life:.5,wipe:.25})),
  caFinish:(a,c)=>cxAt(a,a.windup-.03,()=>cxStreak('c40_impale',cxPhi(a,c),180,{off:16})),
  caBoundary:(a,c)=>cxAt(a,a.windup-.05,()=>{cxGround('c08_boundary',player.x,player.y,CR_BAL.spear*1.85,{life:.9,ay:.62,s0:.55,s1:1});cxBits('c35_shards',player.x,player.y,6,{v0:140,v1:220});}),
  caEdge:(a,c)=>cxAt(a,Math.max(.05,a.windup||.25),()=>{cxP({n:'c12_edge',x:player.x+30,y:player.y,z:4,w:56,ay:.9,life:.7,s0:.6,s1:1,fadeIn:.08,glow:.9,follow:player,fx0:30});cxSpark('c31_hitjade',player,70,{life:.3});}),
  caRain:(a,c)=>{cxAt(a,a.windup-.22,()=>{const x=c.gx??player.x,y=c.gy??player.y;cxP({n:'c09_rain',x:x-40,y,z:150,w:150,life:.28,s0:1,s1:1,fadeIn:.04,fadeOut:.3,rise:-130,glow:.5});});
    cxAt(a,a.windup,()=>{const x=c.gx??player.x,y=c.gy??player.y;cxGround('c30_sun',x,y,170,{life:.8,a0:.75,s0:.6});cxStand('c07_fracture',x,y,130,{life:.38,s0:.6,s1:1.1,glow:.8,ay:.7});cxBits('c35_shards',x,y,12,{v1:300,vz1:360});});},
  caExecution:(a,c)=>{cxAt(a,.05,()=>{const phi=cxPhi(a,c);cxP({n:'c10_charge',x:player.x+Math.cos(phi)*40,y:player.y+Math.sin(phi)*40,z:30,w:90,life:Math.max(.25,a.windup-.05),s0:.4,s1:1,fadeIn:.1,fadeOut:.15,spin:0});});
    cxAt(a,a.windup-.02,()=>{cxStreak('c11_sunpiercer',cxPhi(a,c),200,{life:.32,off:0});});
    cxAt(a,a.windup+.02,()=>{const t=cxT(a,c);if(t){cxSpark('c42_shatter',t,140,{life:.45});cxBits('c35_shards',t.x,t.y,10);}});},
  caSunpiercer:(a,c)=>{const t1=a.windup-.7;cxAt(a,t1+.05,()=>{const phi=cxPhi(a,c);cxP({n:'c10_charge',x:player.x+Math.cos(phi)*36,y:player.y+Math.sin(phi)*36,z:30,w:110,life:.7,s0:.3,s1:1.05,fadeIn:.15,fadeOut:.1,follow:player,fx0:Math.cos(phi)*36,fy0:Math.sin(phi)*36});cxGround('c30_sun',player.x,player.y,150,{life:.8,a0:.7,s0:.4});});
    cxAt(a,a.windup,()=>{const phi=cxPhi(a,c);cxStreak('c11_sunpiercer',phi,320,{life:.55,wipe:.3,off:-20,slide:0,glow:1});});
    cxAt(a,a.windup+.18,()=>{const ex=player.x+Math.cos(player.phi)*30,ey=player.y+Math.sin(player.phi)*30;cxP({n:'c37_sunburst',x:ex,y:ey,z:30,w:150,life:.45,s0:.4,s1:1.05,a0:.85,fadeIn:.001,fadeOut:.6,glow:.7});cxBits('c35_shards',ex,ey,8);});},
  crBite:(a,c)=>cxAt(a,a.windup-.02,()=>{const t=cxT(a,c);if(t)cxSpark('c13_jaw',t,105,{life:.28,rot:0,s0:.7});}),
  cbJaw:(a,c)=>cxAt(a,a.windup-.02,()=>{const t=cxT(a,c);if(t)cxSpark('c13_jaw',t,120,{life:.3,rot:0,fy:false,s0:.7});}),
  cbLock:(a,c)=>cxAt(a,a.windup-.02,()=>{const t=cxT(a,c);if(t)cxSpark('c14_lock',t,125,{life:.36,rot:0,s0:.7});}),
  cbShake:(a,c)=>cxAt(a,.05,()=>{const t=cxT(a,c);if(t){cxP({n:'c41_shake',x:t.x,y:t.y,z:(t.boss?40:20),w:120,life:Math.max(.4,a.dur*.8),s0:.85,s1:1.05,fadeIn:.05,follow:t,pulse:1});cxBits('c36_drops',t.x,t.y,6);}}),
  cbRip:(a,c)=>cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxSpark('c15_rip',t,100,{life:.32,rot:0});cxSpark('c32_hitred',t,60,{delay:.05});}}),
  cbSnap:(a,c)=>cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxSpark('c14_lock',t,140,{life:.34,rot:0});cxSpark('c33_pow',t,90,{delay:.03});}}),
  crTail:(a,c)=>cxAt(a,.04,()=>{cxGround('c17_tail',player.x,player.y,180,{life:.5,s0:.75,s1:1.05,fadeIn:.03});cxBits('c36_drops',player.x,player.y,7,{v0:140,v1:240,z:6});}),
  cbTailBreaker:(a,c)=>{cxAt(a,.04,()=>cxGround('c17_tail',player.x,player.y,200,{life:.5,fadeIn:.03}));cxAt(a,a.windup,()=>{cxGround('c18_tailbreak',player.x,player.y,190,{life:.7,ay:.7,s0:.6});cxBits('c36_drops',player.x,player.y,10,{v1:280,z:6});cxBits('c35_shards',player.x,player.y,4);});},
  ccReversal:(a,c)=>{cxAt(a,.04,()=>cxGround('c17_tail',player.x,player.y,175,{life:.45}));cxAt(a,a.windup+.25,()=>cxStreak('c01_thrust',cxPhi(a,c),160));},
  cbBodyCrush:(a,c)=>cxAt(a,a.windup,()=>{const t=cxT(a,c),x=t?t.x:player.x,y=t?t.y:player.y;cxStand('c23_crush',x,y,150,{life:.5,s0:.6,s1:1.08});cxBits('c36_drops',x,y,6);}),
  cbAmbush:(a,c)=>{cxAt(a,.02,()=>cxGround('c22_ambush',player.x,player.y,130,{life:Math.max(.5,a.windup+.2),s0:.8,s1:1,fadeIn:.1}));
    cxAt(a,a.windup-.12,()=>cxStreak('c20_lunge',cxPhi(a,c),190,{z:12,life:.34,off:-60}));cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxSpark('c13_jaw',t,120,{rot:0});cxSpark('c34_splash',t,90,{z:4,ay:.9,delay:.03});}});},
  cbDrag:(a,c)=>cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxGround('c21_drag',t.x,t.y,130,{life:1,follow:t,s0:.5});cxBits('c36_drops',t.x,t.y,5,{z:4});}}),
  cbRoll:(a,c)=>cxAt(a,.08,()=>{const t=cxT(a,c);if(t){cxP({n:'c19_roll',x:t.x,y:t.y,z:(t.boss?40:22),w:140,life:Math.max(.5,a.dur-.1),s0:.8,s1:1,fadeIn:.08,fadeOut:.25,follow:t,glow:.4});}}),
  cbLunge:(a,c)=>{cxAt(a,.02,()=>cxStreak('c20_lunge',cxPhi(a,c),200,{z:12,life:.36,off:-20,slide:40}));cxAt(a,a.windup,()=>{const t=cxT(a,c);if(t){cxSpark('c13_jaw',t,125,{rot:0});cxSpark('c32_hitred',t,80,{delay:.05});cxBits('c36_drops',t.x,t.y,6);}});},
  cbFrenzy:(a,c)=>{cxAt(a,.02,()=>cxStreak('c20_lunge',cxPhi(a,c),210,{z:12,life:.36,off:-20}));
    cxAt(a,.3,()=>{const t=cxT(a,c);if(t){cxP({n:'c38_rollfinale',x:t.x,y:t.y,z:(t.boss?44:26),w:190,life:Math.max(.8,a.dur-.75),s0:.7,s1:1,fadeIn:.12,fadeOut:.2,follow:t,glow:.4});cxStand('c16_frenzy',player.x,player.y,90,{life:Math.max(.8,a.dur-.7),a0:.8,follow:player});}});
    cxAt(a,a.dur-.3,()=>{const t=cxT(a,c),phi=cxPhi(a,c);if(t){cxP({n:'c39_throw',x:t.x,y:t.y,z:20,w:170,rot:0,fy:false,life:.5,s0:.7,s1:1.1,fadeIn:.001,glow:.7});cxSpark('c33_pow',t,110,{delay:.05});cxBits('c36_drops',t.x,t.y,12,{v1:300});}});},
  cbIronJaws:(a,c)=>cxAt(a,Math.max(.05,a.windup||.25),()=>{cxP({n:'c24_ironjaw',x:player.x,y:player.y,z:30,w:110,life:.75,s0:.5,s1:1.05,fadeIn:.06,glow:.9,follow:player});}),
  crScales:(a,c)=>cxAt(a,Math.max(.05,a.windup||.2),()=>cxStand('c27_scales',player.x,player.y+6,110,{life:.8,a0:.85,follow:player,fy0:6,glow:.5})),
  crStride:(a,c)=>cxAt(a,Math.max(.05,a.windup||.2),()=>{cxGround('c28_stride',player.x,player.y,130,{life:.8,follow:player});cxBits('c36_drops',player.x,player.y,6,{z:4,v0:60,v1:140});}),
  ccSpearMaw:(a,c)=>cxAt(a,Math.max(.05,a.windup||.25),()=>{cxSpark('c31_hitjade',player,80,{life:.35,z:40});cxGround('c30_sun',player.x,player.y,140,{life:.8,a0:.7,s0:.5,follow:player});}),
  ccFeast:(a,c)=>cxAt(a,Math.max(.05,a.windup||.25),()=>{cxStand('c26_feast',player.x,player.y,100,{life:1,follow:player,glow:.6});cxSpark('c32_hitred',player,90,{life:.3});}),
  ccAwaken:(a,c)=>cxAt(a,.15,()=>{cxGround('c30_sun',player.x,player.y,200,{life:1.6,a0:.85,s0:.4,follow:player});cxStand('c25_spirit',player.x,player.y-6,185,{life:.95,s0:.5,s1:1.02,fadeIn:.35,fadeOut:.35,a0:.85,follow:player,fy0:-6,rise:20});cxBits('c36_drops',player.x,player.y,10,{z:4,v0:80,v1:180});}),
};

/* hit sparks for every connecting hit, by kind (never on bleed ticks) */
function cxOnHit(e,o){if(!e||(o&&o.dot))return;const now=gameTime;if(e._cxT===now)return;e._cxT=now;const kind=(o&&o.kind)||'spear',big=o&&o.big;
  if(kind==='spear')cxSpark('c31_hitjade',e,big?80:56);else if(kind==='maw')cxSpark('c32_hitred',e,big?78:54);else cxSpark('c34_splash',e,big?80:60,{ay:.85,z:2});
  if(big)cxBits(kind==='spear'?'c35_shards':'c36_drops',e.x,e.y,3);}

function installCrocFx(){if(CHAR!=='croc')return;CXF.forEach(cxImg);
  for(const k in CX_RECIPE){const sk=SKILLS[k];if(!sk||!sk.make)continue;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a)try{CX_RECIPE[k](a,c||{});}catch(err){console.warn('croc fx',k,err);}return a;};}
  /* basic attack goes through mkCrBasic, not SKILLS */
  if(typeof mkBasic==='function'){const mb=mkBasic;mkBasic=function(tgt){const a=mb.apply(this,arguments);if(a)try{CX_RECIPE.basic(a,{target:tgt});if(a.name==='Spear Poke')cxAt(a,a.windup-.03,()=>cxStreak('c01_thrust',tgt?angTo(tgt):player.phi,120,{glow:.4,life:.24}));else if(a.name==='Snap')cxAt(a,a.windup-.02,()=>{if(tgt&&!tgt.dead)cxSpark('c13_jaw',tgt,90,{rot:0,life:.26});});}catch(_){}return a;};}
  /* armor break cash-in: big shatter on the target */
  const _hit=cr;cr=function(e,m,o={}){const ab=e&&e.crAB||0,r=_hit.apply(this,arguments);try{cxOnHit(e,o);if(e&&ab>0&&!(e.crAB>=ab)&&!e.dead){cxSpark('c42_shatter',e,90+ab*14,{life:.45,delay:.02});cxSpark('c06_armorbreak',e,70,{life:.5,z:(e.boss?80:56),s0:.6});cxBits('c35_shards',e.x,e.y,4+ab);}}catch(_){}return r;};
  /* painted skill icons (assets/icons/croc/<key>.webp); a missing file keeps the old icon */
  if(typeof SKILL_ICON_ART!=='undefined')for(const k in SKILLS){const sk=SKILLS[k];if(!sk||!sk.name)continue;const src='assets/icons/croc/'+k+'.webp',im=new Image();
    im.onload=()=>{SKILL_ICON_ART[sk.name]=src;};im.src=src;}
  window.CX_RECIPE=CX_RECIPE;}
