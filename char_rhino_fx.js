/* =====================================================================
   TOTEM LEGEND — Frost iron rhino · painted skill effects (assets/fx/rhino, 36 pieces)
   Pictures are the main effect; the older code VFX stay underneath as support.
     - every punch shows a painted fist aimed along the punch (jab / heavy / hammer / uppercut / meteor / rush)
     - every punch hit gets a painted spark; big hits add rock bits; stagger BREAK gets a gold burst
     - slams paint the ground (crack, shockwave ring, rock eruption, crater)
     - guard / wall / shield / stance / fortress / roar / fury / glacier skills each get their picture
   Placement: ground pieces lie on the ground layer · upright pieces stand on their bottom edge ·
              streaks are aimed along the attack · sparks sit on the body.
   installRhinoFx() runs after installRhinoRework().
   ===================================================================== */
const RXI={};
function rxImg(n){let o=RXI[n];if(!o){o=RXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/rhino/'+n+'.webp';}return o.ok?o.im:null;}
const RXF=['r01_jab','r02_heavy','r03_hammer','r04_uppercut','r05_meteor','r06_rush','r07_hit','r08_heavyhit','r09_break','r10_armorcrack','r11_pow','r12_rocks',
  'r13_crack','r14_shockring','r15_erupt','r16_dust','r17_crater','r18_spiritfist','r19_guard','r20_wall','r21_bubble','r22_pulse','r23_anchor','r24_ironskin',
  'r25_glacierwall','r26_glacier','r27_bastion','r28_iceburst','r29_trail','r30_ice','r31_roar','r32_fury','r33_emblem','r34_sigil','r35_spirit','r36_revenge'];
const rxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const rxQ=n=>Math.max(1,Math.round(n*((typeof Q!=='undefined'&&Q.p)?Math.min(1,Q.p+.2):1)));

class RxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,rise:0,spin:0,delay:0,sortOff:0,slide:0,phi:0,pulse:0,while:null},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;const f=this.follow;if(f){if(f.dead&&f!==player)this.follow=null;else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}
    if(this.while&&!this.while()&&this.t>.1&&this.life>this.t+.25)this.life=this.t+.25;return this.t<this.life;}
  draw(){if(this.t<0)return;const im=rxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.5)),[x,y]=P(this.x+Math.cos(this.phi)*this.slide*k,this.y+Math.sin(this.phi)*this.slide*k,this.z+this.rise*k),w=this.w*s,h=w*im.naturalHeight/im.naturalWidth;
    const draw=(alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t);if(this.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    draw(a,false);if(this.glow&&k<.4)draw(this.glow*a*(1-k/.4),true);ctx.globalAlpha=1;}}
const rxP=o=>addFx(new RxImg(o));
const rxSpark=(n,e,w,o={})=>{if(!e)return;rxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?44:26)+(e.z||0)+rnd(-4,4),w,life:.26,s0:.55,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.7,rot:rnd(-.4,.4)},o));};
const rxGround=(n,x,y,w,o={})=>rxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.8,s0:.6,s1:1.05,fadeIn:.04,fadeOut:.45},o));
const rxStand=(n,x,y,w,o={})=>rxP(Object.assign({n,x,y,z:0,w,ay:.94,layer:'sorted',sortOff:3,life:.8,s0:.75,s1:1,fadeIn:.1,fadeOut:.4},o));
/* a fist / streak aimed along phi, starting just in front of the rhino */
function rxStreak(n,phi,w,o={}){const r=rxScr(phi);rxP(Object.assign({n,x:player.x+Math.cos(phi)*(o.off??18),y:player.y+Math.sin(phi)*(o.off??18),z:o.z??30,w,ax:.2,ay:.5,rot:r,fy:Math.cos(r)<0,phi,
  life:.24,s0:.8,s1:1.05,fadeIn:.001,fadeOut:.5,glow:.6,slide:o.slide??26},o));}

/* rock / ice bits: fly out, fall, settle */
class RxBit{
  constructor(o){Object.assign(this,{t:0,layer:'top',z:10,vx:0,vy:0,vz:0,g:620,w:16,spin:rnd(-9,9),rot:rnd(0,TAU),landed:false},o);this.cell=(Math.random()*8)|0;this.life=this.life||rnd(.9,1.4);}
  update(dt){this.t+=dt;if(!this.landed){this.vz-=this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;
      if(this.z<=0){this.z=0;if(Math.abs(this.vz)>140&&!this.b){this.vz*=-.3;this.vx*=.45;this.vy*=.45;this.b=1;}else{this.landed=true;this.layer='ground';}}}return this.t<this.life;}
  draw(){const im=rxImg(this.n);if(!im)return;const cw=im.naturalWidth/8,ch=im.naturalHeight,[x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.35);
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.landed?this.rot:this.rot+this.spin*this.t);ctx.drawImage(im,this.cell*cw,0,cw,ch,-this.w/2,-this.w/2,this.w,this.w);ctx.restore();ctx.globalAlpha=1;}}
function rxBits(n,x,y,count,o={}){for(let i=0;i<rxQ(count);i++){const an=o.phi!=null?o.phi+rnd(-(o.spread||.8),o.spread||.8):rnd(0,TAU),v=rnd(o.v0||90,o.v1||220);
  addFx(new RxBit({n,x,y,z:o.z??20,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(o.vz0||120,o.vz1||280),w:rnd(o.s0||11,o.s1||18)}));}}

/* ---------- which fist each punching skill throws ---------- */
const RX_FIST={rhKnuckle:'r02_heavy',rhCrushCounter:'r02_heavy',rhCrusher:'r02_heavy',rhBone:'r02_heavy',rhCounter:'r02_heavy',rhRevenge:'r02_heavy',rcGrip:'r02_heavy',
  rhHammer:'r03_hammer',rhFinale:'r03_hammer',rhUppercut:'r04_uppercut',rhMeteor:'r05_meteor',rhRush:'r06_rush',rhAvalanche:'r01_jab',rhTitan:'r01_jab'};
function rxPunchPiece(key,i,last,n){let p=RX_FIST[key]||'r01_jab';if((key==='rhTitan'||key==='rhAvalanche'||key==='basic')&&last&&n>1)p=key==='rhTitan'?'r03_hammer':'r02_heavy';return p;}
function rxPunchShow(p,phi){const tx=player.x+Math.cos(phi)*44,ty=player.y+Math.sin(phi)*44;
  if(p==='r03_hammer')rxP({n:p,x:tx,y:ty,z:56,w:92,ay:.7,life:.3,s0:.8,s1:1,fadeIn:.001,fadeOut:.5,glow:.6,rise:-34});
  else if(p==='r04_uppercut')rxP({n:p,x:tx,y:ty,z:40,w:96,life:.34,s0:.7,s1:1.05,fadeIn:.001,fadeOut:.55,glow:.6,rise:30,fy:Math.cos(rxScr(phi))<0,rot:0});
  else rxStreak(p,phi,p==='r01_jab'?78:p==='r06_rush'?120:p==='r05_meteor'?110:96,{life:p==='r01_jab'?.2:.28});}

/* ---------- per-skill extras (on top of the punches / slams / charges) ---------- */
const RX_AT=(a,t,f)=>{a.events=a.events||[];a.events.push({t:Math.max(.01,t),f});};
const RX_WIN=a=>Math.max(.05,a.windup||.2);
const RXR={
  rhGuard:a=>RX_AT(a,.02,()=>rxP({n:'r19_guard',x:player.x+Math.cos(player.phi)*18,y:player.y+Math.sin(player.phi)*18,z:32,w:62,life:Math.max(.4,(a.dur||1)),s0:.5,s1:1,fadeIn:.06,fadeOut:.2,glow:.6,follow:player,fx0:Math.cos(player.phi)*18,fy0:Math.sin(player.phi)*18+2,while:()=>player.action===a})),
  rhRoar:a=>RX_AT(a,RX_WIN(a),()=>{rxP({n:'r31_roar',x:player.x,y:player.y,z:44,w:170,life:.6,s0:.4,s1:1.2,fadeIn:.001,fadeOut:.55,glow:.6});rxGround('r14_shockring',player.x,player.y,170,{life:.55,s0:.3,s1:1.2});}),
  rhSkin:a=>RX_AT(a,RX_WIN(a),()=>rxStand('r24_ironskin',player.x,player.y+2,100,{follow:player,fy0:2,life:1,a0:.75,glow:.6})),
  rhStance:a=>RX_AT(a,RX_WIN(a),()=>{rxGround('r23_anchor',player.x,player.y,120,{follow:player,life:1.2,a0:.9,glow:.5});if(LV.rcFrozenBastion)rxStand('r27_bastion',player.x,player.y+6,120,{follow:player,fy0:6,life:1.2,a0:.7,glow:.5});}),
  rhPulse:a=>RX_AT(a,RX_WIN(a),()=>{rxGround('r22_pulse',player.x,player.y,200,{life:.6,s0:.3,s1:1.25,glow:.6});rxStand('r21_bubble',player.x,player.y+8,120,{follow:player,fy0:8,life:1,a0:.55,glow:.5});}),
  rhFortress:a=>RX_AT(a,RX_WIN(a),()=>{rxP({n:'r33_emblem',x:player.x,y:player.y,z:110,w:84,life:1.2,s0:.4,s1:1,fadeIn:.06,fadeOut:.35,glow:.9,follow:player});rxStand('r21_bubble',player.x,player.y+8,130,{follow:player,fy0:8,life:1.1,a0:.5});}),
  rhAnchor:a=>RX_AT(a,RX_WIN(a),()=>rxGround('r23_anchor',player.x,player.y,130,{follow:player,life:1.5,glow:.5})),
  rhColossus:a=>RX_AT(a,RX_WIN(a),()=>{rxStand('r24_ironskin',player.x,player.y+2,110,{follow:player,fy0:2,life:1.2,a0:.8,glow:.7});rxP({n:'r33_emblem',x:player.x,y:player.y,z:110,w:64,life:1,s0:.4,s1:1,glow:.8,follow:player});}),
  rhAbsolute:a=>RX_AT(a,.05,()=>{rxGround('r34_sigil',player.x,player.y,240,{life:Math.max(1.6,a.dur||2),s0:.3,s1:1,glow:.6,a0:.9});rxStand('r21_bubble',player.x,player.y+14,170,{life:Math.max(1.6,a.dur||2),s0:.4,s1:1,a0:.4,sortOff:20,fadeIn:.3});}),
  rhFury:a=>RX_AT(a,RX_WIN(a),()=>rxStand('r32_fury',player.x,player.y+2,100,{follow:player,fy0:2,life:1.1,a0:.8,glow:.5,sortOff:-2})),
  rcTotem:(a,c)=>{const gx=c.gx??player.x,gy=c.gy??player.y,phi=Math.atan2(gy-player.y,gx-player.x);RX_AT(a,RX_WIN(a),()=>{rxStand('r25_glacierwall',gx,gy+6,190,{life:10,s0:.3,s1:1,fadeIn:.15,fadeOut:.05,sortOff:8,glow:.5});rxStand('r28_iceburst',gx,gy,120,{life:.5,s0:.5,s1:1.1,fadeIn:.001});rxBits('r30_ice',gx,gy,10);});},
  rcPact:a=>RX_AT(a,RX_WIN(a),()=>{rxStand('r32_fury',player.x,player.y+2,90,{follow:player,fy0:2,life:1,a0:.7,sortOff:-2});rxP({n:'r36_revenge',x:player.x,y:player.y,z:40,w:70,life:.8,glow:.8,follow:player,spin:2});}),
  rhRevenge:a=>RX_AT(a,.03,()=>rxP({n:'r36_revenge',x:player.x+Math.cos(player.phi)*24,y:player.y+Math.sin(player.phi)*24,z:34,w:76,life:Math.max(.3,RX_WIN(a)),s0:.4,s1:1.1,fadeIn:.05,fadeOut:.3,glow:.8,spin:3})),
};

function installRhinoFx(){if(CHAR!=='rhino')return;RXF.forEach(rxImg);
  /* punches: painted fist per punch */
  if(typeof rhPunches==='function'){const _p=rhPunches;rhPunches=function(o){const n=o.n||1,aft=o.after;o=Object.assign({},o,{after:(a,hit,i,last)=>{try{rxPunchShow(rxPunchPiece(o.key,i,last,n),o.phi);
        if(last&&(o.key==='rhCrusher'||o.key==='rhBone'))for(const e of hit)rxSpark('r10_armorcrack',e,74,{life:.45,z:(e.boss?60:40),glow:.5});}catch(_){}if(aft)aft(a,hit,i,last);}});return _p(o);};}
  /* basic attack: jab, finisher = heavy */
  if(typeof mkBasic==='function'){const _b=mkBasic;mkBasic=function(tgt){const a=_b.apply(this,arguments);if(a&&tgt)try{const fin=/Finish/.test(a.name||''),phi=Math.atan2(tgt.y-player.y,tgt.x-player.x);RX_AT(a,(a.windup||.1)-.02,()=>rxPunchShow(fin?'r02_heavy':'r01_jab',phi));}catch(_){}return a;};}
  /* hit sparks */
  if(typeof punchFx==='function'){const _f=punchFx;punchFx=function(e,phi,o={}){const r=_f.apply(this,arguments);try{if(o.big){rxSpark('r08_heavyhit',e,96,{life:.3});rxBits('r12_rocks',e.x,e.y,4,{phi:phi,spread:1.2});}else rxSpark('r07_hit',e,58);}catch(_){}return r;};}
  /* stagger break */
  if(typeof rhStg==='function'){const _s=rhStg;rhStg=function(e,amt){const im=e&&e.stgImm||0,r=_s.apply(this,arguments);try{if(e&&!e.dead&&(e.stgImm||0)>im)rxSpark('r09_break',e,e.boss?150:110,{life:.5,s0:.4,s1:1.15,z:(e.boss?52:32)});}catch(_){}return r;};}
  /* charges: dust trail behind, ice wedge for Glacier Charge, ice burst at the end */
  if(typeof rhCharge==='function'){const _c=rhCharge;rhCharge=function(o){const st=o.start,en=o.end,ice=o.key==='rcGlacier',phi=o.phi;o=Object.assign({},o,{
      start:()=>{try{rxGround('r16_dust',player.x,player.y,110,{life:.6,s0:.6,s1:1.1,a0:.9});rxP({n:ice?'r26_glacier':'r29_trail',x:player.x,y:player.y,z:28,w:ice?120:150,ax:ice?.55:.95,ay:.5,rot:rxScr(phi),fy:Math.cos(rxScr(phi))<0,life:(o.T||.3)+.35,s0:.9,s1:1,fadeIn:.05,fadeOut:.35,follow:player,glow:.4});}catch(_){}if(st)st();},
      end:a=>{try{if(ice){rxStand('r28_iceburst',player.x+Math.cos(phi)*20,player.y+Math.sin(phi)*20,120,{life:.55,s0:.5,s1:1.05,fadeIn:.001,fadeOut:.5});rxBits('r30_ice',player.x,player.y,8);}else rxGround('r16_dust',player.x,player.y,120,{life:.6});}catch(_){}if(en)en(a);}});return _c(o);};}
  /* slams: ground pictures by skill */
  if(typeof rhSlam==='function'){const _sl=rhSlam;rhSlam=function(o){const imp=o.impact;o=Object.assign({},o,{impact:(a,x,y)=>{try{const k=o.key;
        if(k==='rcTotem'){}
        else if(k==='rhQuake'){rxGround('r14_shockring',x,y,260,{life:.6,s0:.3,s1:1.2});rxGround('r16_dust',x,y,200,{life:.7,a0:.8});}
        else if(k==='rhRetribution'){rxGround('r22_pulse',x,y,240,{life:.6,s0:.3,s1:1.2,glow:.6});rxGround('r14_shockring',x,y,200,{life:.5,s0:.3,s1:1.1});}
        else{rxGround('r13_crack',x,y,200,{life:1.2,s0:.5,s1:1,fadeOut:.35});rxGround('r14_shockring',x,y,240,{life:.55,s0:.3,s1:1.2});rxStand('r15_erupt',x,y+10,130,{life:.6,s0:.5,s1:1.05,fadeIn:.001});rxBits('r12_rocks',x,y,7);
          if(LV.rcAvalancheChain&&k==='rhShaker')setFxTimer(.35,()=>{rxGround('r14_shockring',x,y,320,{life:.6,s0:.4,s1:1.2});rxStand('r15_erupt',x+rnd(-40,40),y+rnd(-20,20),110,{life:.55});});}}catch(_){}imp(a,x,y);}});return _sl(o);};}
  /* crater for Skybreaker / Worldbreaker / Cataclysm (GroundShatter) */
  if(typeof GroundShatter==='function'){const _gu=GroundShatter.prototype.update;GroundShatter.prototype.update=function(dt){if(!this._rx){this._rx=1;try{rxGround('r17_crater',this.x,this.y,Math.min(250,this.R*1.6),{life:Math.min(2.4,this.life),s0:.6,s1:1,fadeOut:.3});rxStand('r15_erupt',this.x,this.y+10,140,{life:.6,s0:.5,fadeIn:.001});rxBits('r12_rocks',this.x,this.y,10,{v0:120,v1:260});}catch(_){}}return _gu.call(this,dt);};}
  /* giant spirit fist dropping (Finale / Cataclysm / Titan Echo) */
  if(typeof GiantFist==='function'){const _gf=GiantFist.prototype.update;GiantFist.prototype.update=function(dt){if(!this._rx&&this.mode==='drop'){this._rx=1;try{rxP({n:'r18_spiritfist',x:this.x,y:this.y,z:(this.z0||220)*.55,w:150*(this.sc||.4)/.5,ay:.95,life:Math.max(.4,this.hitT||.3)+.25,s0:.8,s1:1,fadeIn:.05,fadeOut:.4,rise:-(this.z0||220)*.5,glow:.6,a0:.9});}catch(_){}}return _gf.call(this,dt);};}
  /* Steel Wall: painted iron wall in front while the buff lasts */
  if(typeof SteelWallObj==='function'){const _wd=SteelWallObj.prototype.draw;SteelWallObj.prototype.draw=function(){const im=rxImg('r20_wall');if(!im)return _wd.call(this);const a=Math.min(1,this.t/.18)*(this.t>this.life-.2?Math.max(0,(this.life-this.t)/.2):1),ph=player.phi,
      [x,y]=P(player.x+Math.cos(ph)*40,player.y+Math.sin(ph)*40,0),w=96,h=w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha=a*.92;ctx.drawImage(im,x-w/2,y-h*.92,w,h);if(this.flash>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*this.flash*.6;ctx.drawImage(im,x-w/2,y-h*.92,w,h);}ctx.restore();ctx.globalAlpha=1;};}
  /* painted ice wall replaces the code monoliths of Glacier Bulwark */
  if(typeof IceMonolith==='function'){const _md=IceMonolith.prototype.draw;IceMonolith.prototype.draw=function(){if(rxImg('r25_glacierwall'))return;return _md.call(this);};}
  /* old Guardian Totem prop (unused after the rework) */
  if(typeof RhTotemObj==='function'){const _tu=RhTotemObj.prototype.update;RhTotemObj.prototype.update=function(dt){if(!this._rx){this._rx=1;try{rxStand('r25_glacierwall',this.x,this.y+8,170,{life:this.life,s0:.4,s1:1,fadeIn:.2,fadeOut:.04,sortOff:6,glow:.4});rxGround('r22_pulse',this.x,this.y,this.R*1.6,{life:this.life,s0:.5,s1:1,a0:.45,fadeIn:.3,fadeOut:.05,pulse:.3});}catch(_){}}return _tu.call(this,dt);};}
  /* per-skill pictures */
  for(const k in RXR){const sk=SKILLS[k];if(!sk||!sk.make)continue;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a){a.events=a.events||[];try{RXR[k](a,c||{});}catch(err){console.warn('rhino fx',k,err);}}return a;};}
  window.RXR=RXR;}
