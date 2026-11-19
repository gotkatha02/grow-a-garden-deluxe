/* =====================================================================
   TOTEM LEGEND — Eclipse jaguar · painted skill effects (assets/fx/jaguar, 36 pieces)
   Pictures are the main effect; the older code VFX stay underneath as support.
     - every dagger strike paints a slash aimed along the strike (crimson for Basic / A, shadow for B)
     - hits, crits, Prey Mark, Eclipse Brand, bleed and poison each get their picture on the target
     - giant claws, spin ring, dark sun, horizon wave, moon traps and mirrors are painted
     - each buff / dash / trap skill gets its own picture
   Placement: ground pieces lie on the ground layer · upright pieces stand on their bottom edge ·
              streaks are aimed along the attack · sparks sit on the body.
   installJaguarFx() runs after installJaguarRework().
   ===================================================================== */
const JXI={};
function jxImg(n){let o=JXI[n];if(!o){o=JXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/jaguar/'+n+'.webp';}return o.ok?o.im:null;}
const JXF=['j01_slash','j02_xslash','j03_thrust','j04_flurry','j05_spin','j06_dashcut','j07_hit','j08_crit','j09_prey','j10_crimson','j11_siphon','j12_ruby',
  'j13_shadowslash','j14_brand','j15_venomsigil','j16_bloom','j17_smoke','j18_mirror','j19_mirrorshards','j20_moontrap','j21_snare','j22_clone','j23_horizon','j24_obsidian',
  'j25_throne','j26_drop','j27_fifthsun','j28_zone','j29_spirit','j30_paw','j31_roar','j32_focus','j33_parry','j34_bloodmoon','j35_expose','j36_step'];
const jxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const jxQ=n=>Math.max(1,Math.round(n*((typeof Q!=='undefined'&&Q.p)?Math.min(1,Q.p+.2):1)));

class JxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,rise:0,spin:0,delay:0,sortOff:0,slide:0,phi:0,pulse:0,while:null},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;const f=this.follow;if(f){if(f.dead&&f!==player)this.follow=null;else{this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}}
    if(this.while&&!this.while()&&this.t>.1&&this.life>this.t+.25)this.life=this.t+.25;return this.t<this.life;}
  draw(){if(this.t<0)return;const im=jxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.5)),[x,y]=P(this.x+Math.cos(this.phi)*this.slide*k,this.y+Math.sin(this.phi)*this.slide*k,this.z+this.rise*k),w=this.w*s,h=w*im.naturalHeight/im.naturalWidth;
    const draw=(alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t);if(this.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    draw(a,false);if(this.glow&&k<.4)draw(this.glow*a*(1-k/.4),true);ctx.globalAlpha=1;}}
const jxP=o=>addFx(new JxImg(o));
const jxSpark=(n,e,w,o={})=>{if(!e)return;jxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?44:26)+(e.z||0)+rnd(-4,4),w,life:.26,s0:.55,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.7,rot:rnd(-.4,.4)},o));};
const jxGround=(n,x,y,w,o={})=>jxP(Object.assign({n,x,y,z:0,w,layer:'ground',life:.8,s0:.6,s1:1.05,fadeIn:.04,fadeOut:.45},o));
const jxStand=(n,x,y,w,o={})=>jxP(Object.assign({n,x,y,z:0,w,ay:.94,layer:'sorted',sortOff:3,life:.8,s0:.75,s1:1,fadeIn:.1,fadeOut:.4},o));
/* streak / slash aimed along phi, just in front of the jaguar */
function jxStreak(n,phi,w,o={}){const r=jxScr(phi);jxP(Object.assign({n,x:player.x+Math.cos(phi)*(o.off??14),y:player.y+Math.sin(phi)*(o.off??14),z:o.z??28,w,ax:o.ax??.25,ay:.5,rot:r,fy:Math.cos(r)<0,phi,
  life:.22,s0:.8,s1:1.05,fadeIn:.001,fadeOut:.55,glow:.6,slide:o.slide??18},o));}
/* a slash placed on the strike point, rotated with the strike */
function jxSlash(n,phi,w,i,o={}){const r=jxScr(phi),fx=Math.cos(r)<0;jxP(Object.assign({n,x:player.x+Math.cos(phi)*42,y:player.y+Math.sin(phi)*42,z:o.z??28,w,rot:r+(i%2?.35:-.35)*(fx?-1:1),fy:fx!==(i%2===1),
  life:.22,s0:.75,s1:1.08,fadeIn:.001,fadeOut:.55,glow:.6},o));}

/* small shards from a strip of 8: fly out, fall, settle */
class JxBit{
  constructor(o){Object.assign(this,{t:0,layer:'top',z:10,vx:0,vy:0,vz:0,g:620,w:14,spin:rnd(-9,9),rot:rnd(0,TAU),landed:false},o);this.cell=(Math.random()*8)|0;this.life=this.life||rnd(.8,1.2);}
  update(dt){this.t+=dt;if(!this.landed){this.vz-=this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;if(this.z<=0){this.z=0;this.landed=true;this.layer='ground';}}return this.t<this.life;}
  draw(){const im=jxImg(this.n);if(!im)return;const cw=im.naturalWidth/8,ch=im.naturalHeight,[x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.3);
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.landed?this.rot:this.rot+this.spin*this.t);ctx.drawImage(im,this.cell*cw,0,cw,ch,-this.w/2,-this.w/2,this.w,this.w);ctx.restore();ctx.globalAlpha=1;}}
function jxBits(n,x,y,count,o={}){for(let i=0;i<jxQ(count);i++){const an=o.phi!=null?o.phi+rnd(-(o.spread||.8),o.spread||.8):rnd(0,TAU),v=rnd(o.v0||90,o.v1||220);
  addFx(new JxBit({n,x,y,z:o.z??24,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(o.vz0||110,o.vz1||250),w:rnd(o.s0||10,o.s1||16)}));}}

/* ---------- which slash each striking skill paints ---------- */
const JX_SHADOW=k=>{const s=SKILLS[k];return s&&s.br==='B';};
function jxStrikePiece(key,i,last){
  if((key==='jgFinalTalon'||key==='jgPhantom')&&last)return ['j02_xslash',150];
  if(key==='jgTalon'||key==='jgNightfall')return [JX_SHADOW(key)?'j13_shadowslash':'j04_flurry',key==='jgTalon'?120:110];
  if(last&&/jgRending|jgSiphon|jgEBackstab|jgReprisal|jgVenom|jgExpose/.test(key||''))return ['j03_thrust',120];
  return [JX_SHADOW(key)?'j13_shadowslash':'j01_slash',last?118:96];}
function jxThrottle(e,k,dt){const n=gameTime;if(e['_jx'+k]>n)return false;e['_jx'+k]=n+dt;return true;}

const JX_AT=(a,t,f)=>{a.events=a.events||[];a.events.push({t:Math.max(.01,t),f});};
const JX_WIN=a=>Math.max(.05,a.windup||.2);
const JX_TGT=(a,c)=>{const t=(c&&c.target&&!c.target.dead)?c.target:(a.hitList&&a.hitList[0])||nearestEnemy(player.x,player.y,260);return t;};
const JXR={
  jgStep:a=>JX_AT(a,.02,()=>jxP({n:'j36_step',x:player.x,y:player.y,z:26,w:130,ax:.85,rot:jxScr(player.phi),fy:Math.cos(jxScr(player.phi))<0,life:.45,s0:.9,s1:1,fadeIn:.02,fadeOut:.5,follow:player,glow:.4})),
  jgCountercut:a=>JX_AT(a,.02,()=>jxP({n:'j33_parry',x:player.x+Math.cos(player.phi)*16,y:player.y+Math.sin(player.phi)*16,z:34,w:62,life:Math.max(.3,a.dur||.6),s0:.6,s1:1,fadeIn:.05,fadeOut:.25,glow:.6,while:()=>player.action===a})),
  jgParry:a=>JX_AT(a,.02,()=>jxP({n:'j33_parry',x:player.x+Math.cos(player.phi)*16,y:player.y+Math.sin(player.phi)*16,z:34,w:66,life:Math.max(.3,a.dur||.6),s0:.6,s1:1,fadeIn:.05,fadeOut:.25,glow:.6,while:()=>player.action===a})),
  jgCry:a=>JX_AT(a,JX_WIN(a),()=>jxP({n:'j31_roar',x:player.x+Math.cos(player.phi)*30,y:player.y+Math.sin(player.phi)*30,z:40,w:120,rot:jxScr(player.phi),fy:Math.cos(jxScr(player.phi))<0,life:.55,s0:.5,s1:1.2,fadeIn:.001,fadeOut:.55,glow:.6})),
  jgTempo:a=>JX_AT(a,JX_WIN(a),()=>jxP({n:'j31_roar',x:player.x,y:player.y,z:40,w:110,life:.45,s0:.4,s1:1.1,fadeIn:.001,fadeOut:.5,a0:.85})),
  jgFocus:a=>JX_AT(a,JX_WIN(a),()=>jxP({n:'j32_focus',x:player.x,y:player.y,z:110,w:70,life:1,s0:.4,s1:1,fadeIn:.06,fadeOut:.4,glow:.8,follow:player})),
  jgExpose:(a,c)=>JX_AT(a,JX_WIN(a)+.02,()=>{const t=JX_TGT(a,c);if(t)jxSpark('j35_expose',t,70,{life:.55,z:(t.boss?56:38),glow:.5});}),
  jgSiphon:a=>JX_AT(a,JX_WIN(a)+.04,()=>jxP({n:'j11_siphon',x:player.x,y:player.y,z:36,w:84,life:.6,s0:1.3,s1:.6,fadeIn:.03,fadeOut:.4,spin:3,follow:player,glow:.6})),
  jgBloodChase:a=>JX_AT(a,.05,()=>jxStreak('j06_dashcut',player.phi,170,{off:-40,ax:.2,life:.5,slide:60,z:24})),
  jgSpiral:a=>JX_AT(a,.05,()=>{jxGround('j05_spin',player.x,player.y,150,{life:.5,spin:6,s0:.6,s1:1});jxStreak('j06_dashcut',player.phi,160,{off:-30,life:.45,slide:60});}),
  jgThrone:(a,c)=>JX_AT(a,JX_WIN(a),()=>{const t=JX_TGT(a,c);if(t){jxSpark('j25_throne',t,170,{life:.6,s0:.6,s1:1.1,z:(t.boss?60:40),rot:0});jxBits('j12_ruby',t.x,t.y,8);}}),
  jgVeil:a=>JX_AT(a,JX_WIN(a),()=>jxStand('j17_smoke',player.x,player.y+6,120,{life:.9,s0:.5,s1:1.1,a0:.9,sortOff:8})),
  jgVenom:(a,c)=>JX_AT(a,JX_WIN(a)+.03,()=>{const t=JX_TGT(a,c);if(t)jxGround('j15_venomsigil',t.x,t.y,90,{follow:t,life:2.4,s0:.4,s1:1,fadeOut:.3,glow:.5});}),
  jgBloom:(a,c)=>JX_AT(a,JX_WIN(a)+.03,()=>{const t=JX_TGT(a,c);if(t){jxStand('j16_bloom',t.x,t.y+4,150,{life:.8,s0:.4,s1:1.1,fadeIn:.001});jxGround('j15_venomsigil',t.x,t.y,170,{life:.8,s0:.3,s1:1.2});}}),
  jgSlip:a=>{const sx=player.x,sy=player.y;JX_AT(a,.02,()=>jxStand('j17_smoke',sx,sy+4,100,{life:.7,s0:.5,s1:1.1}));JX_AT(a,JX_WIN(a),()=>jxStand('j17_smoke',player.x,player.y+4,90,{life:.6,s0:.4,s1:1.05,a0:.85}));},
  jgEBackstab:(a,c)=>JX_AT(a,JX_WIN(a)+.03,()=>{const t=JX_TGT(a,c);if(t)jxSpark('j14_brand',t,110,{life:.45,s0:.4,s1:1.2,rot:0,z:(t.boss?56:36)});}),
  jgMirror:a=>JX_AT(a,JX_WIN(a)*.5,()=>jxP({n:'j18_mirror',x:player.x+Math.cos(player.phi)*22,y:player.y+Math.sin(player.phi)*22,z:38,w:58,life:2,s0:.4,s1:1,fadeIn:.08,fadeOut:.2,glow:.6,follow:player,fx0:Math.cos(player.phi)*22,fy0:Math.sin(player.phi)*22+2,while:()=>hasBuff('jgMirror')})),
  jgShatter:(a,c)=>JX_AT(a,JX_WIN(a),()=>{const t=JX_TGT(a,c),phi=t?angTo(t):player.phi;jxStreak('j19_mirrorshards',phi,120,{off:30,ax:.3,life:.4,slide:60,rot:0,fy:false});jxBits('j24_obsidian',player.x+Math.cos(phi)*30,player.y+Math.sin(phi)*30,7,{phi,spread:.6});}),
  jgNightfall:(a,c)=>JX_AT(a,.05,()=>{const t=JX_TGT(a,c);if(!t)return;for(const s of [-1,1]){const an=angTo(t)+s*1.4;jxP({n:'j22_clone',x:t.x+Math.cos(an)*70,y:t.y+Math.sin(an)*70,z:30,w:96,rot:0,fy:false,life:.5,a0:.85,fadeIn:.05,fadeOut:.5,phi:an+Math.PI,slide:120});}}),
  jgPhantom:(a,c)=>JX_AT(a,.05,()=>{const t=JX_TGT(a,c);if(!t)return;const an=angTo(t)+Math.PI*.75;jxP({n:'j22_clone',x:t.x+Math.cos(an)*70,y:t.y+Math.sin(an)*70,z:30,w:96,life:.5,a0:.85,fadeIn:.05,fadeOut:.5,phi:an+Math.PI,slide:130});}),
  jgFifthSun:(a,c)=>JX_AT(a,.05,()=>jxGround('j28_zone',c.gx??player.x,c.gy??player.y,340,{life:Math.max(2,a.dur||3),s0:.3,s1:1,a0:.8,fadeIn:.3,fadeOut:.2,spin:-.3})),
  jcTotem:a=>JX_AT(a,JX_WIN(a),()=>jxP({n:'j34_bloodmoon',x:player.x,y:player.y,z:120,w:90,life:1.2,s0:.4,s1:1,fadeIn:.1,fadeOut:.4,glow:.7,follow:player})),
};

function installJaguarFx(){if(CHAR!=='jaguar')return;JXF.forEach(jxImg);
  /* strikes: painted slash per strike */
  if(typeof jgStrikes==='function'){const _s=jgStrikes;jgStrikes=function(o){const aft=o.after;o=Object.assign({},o,{after:(a,hit,i,last)=>{try{const [n,w]=jxStrikePiece(o.key,i,last);
        if(n==='j03_thrust')jxStreak(n,o.phi,w,{off:20,life:.2});else jxSlash(n,o.phi,w,i,n==='j02_xslash'?{rot:0,fy:false,life:.32}:{});}catch(_){}if(aft)aft(a,hit,i,last);}});return _s(o);};}
  /* basic attack */
  if(typeof mkBasic==='function'){const _b=mkBasic;mkBasic=function(tgt){const a=_b.apply(this,arguments);if(a&&tgt)try{const i=player.basicIdx||0,phi=Math.atan2(tgt.y-player.y,tgt.x-player.x),fin=/Finish|Fin/i.test(a.name||'');
      JX_AT(a,(a.windup||.1)-.02,()=>jxSlash(fin?'j02_xslash':'j01_slash',phi,fin?120:90,i,fin?{rot:0,fy:false,life:.28}:{}));}catch(_){}return a;};}
  /* hits */
  if(typeof jh==='function'){const _h=jh;jh=function(e,m,o={}){const r=_h.apply(this,arguments);try{if(e&&!o.dot&&jxThrottle(e,'h',.05)){const sh=(o.br||jgBr())==='B';jxSpark(sh?'j07_hit':'j07_hit',e,o.big?78:54,sh?{a0:.9}:{});}}catch(_){}return r;};}
  const _dn=dmgNum;dmgNum=function(x,y,z,val,kind,o={}){const r=_dn.apply(this,arguments);try{if(kind==='crit'&&o&&o.who&&jxThrottle(o.who,'c',.15))jxSpark('j08_crit',o.who,90,{life:.32,z:(o.who.boss?52:30)});}catch(_){}return r;};
  /* marks and status pictures */
  if(typeof addPrey==='function'){const _p=addPrey;addPrey=function(e,n){const b=e&&e.prey||0,r=_p.apply(this,arguments);try{if(e&&!e.dead&&(e.prey||0)>b)jxP({n:'j09_prey',x:e.x,y:e.y,z:(e.boss?96:66)+(e.z||0),w:44,life:.6,s0:1.6,s1:1,fadeIn:.001,fadeOut:.5,glow:.8,follow:e});}catch(_){}return r;};}
  if(typeof addBrand==='function'){const _br=addBrand;addBrand=function(e,n){const b=e&&e.brand||0,r=_br.apply(this,arguments);try{if(e&&!e.dead&&(e.brand||0)>b)jxP({n:'j14_brand',x:e.x,y:e.y,z:(e.boss?96:66)+(e.z||0),w:44,life:.6,s0:1.6,s1:1,fadeIn:.001,fadeOut:.5,glow:.8,follow:e});}catch(_){}return r;};}
  if(typeof jgBleed==='function'){const _bl=jgBleed;jgBleed=function(e,d){const r=_bl.apply(this,arguments);try{if(e&&!e.dead&&jxThrottle(e,'b',.6)){jxSpark('j10_crimson',e,62,{life:.4,ay:.8,z:(e.boss?30:16),rot:0});jxBits('j12_ruby',e.x,e.y,3,{s0:8,s1:12});}}catch(_){}return r;};}
  if(typeof jgPoison==='function'){const _po=jgPoison;jgPoison=function(e){const r=_po.apply(this,arguments);try{if(e&&!e.dead&&jxThrottle(e,'p',.7))jxStand('j16_bloom',e.x,e.y+2,64,{life:.5,s0:.5,s1:1.05,fadeIn:.001,a0:.9});}catch(_){}return r;};}
  if(typeof jgRoot==='function'){const _ro=jgRoot;jgRoot=function(e,d){const r=_ro.apply(this,arguments);try{if(e&&!e.dead&&jxThrottle(e,'r',.8))jxStand('j21_snare',e.x,e.y+4,(e.boss?110:80),{follow:e,fy0:4,life:Math.max(.6,Math.min(2,d||1)),s0:.4,s1:1,fadeOut:.3});}catch(_){}return r;};}
  /* painted versions of the code props */
  if(typeof GiantClaw==='function'){const _gu=GiantClaw.prototype.update;GiantClaw.prototype.update=function(dt){if(!this._jx){this._jx=1;try{const S=(this.sc||.42)/.42;
        jxP({n:'j30_paw',x:this.x,y:this.y,z:60*S+30,w:130*S,rot:0,fy:(this.face||1)<0,life:Math.max(.35,(this.hitT||.3)+.2),s0:.7,s1:1.05,fadeIn:.04,fadeOut:.45,rise:-50*S,glow:.6});
        setFxTimer(Math.max(.02,this.hitT||.3),()=>jxGround('j26_drop',this.x,this.y,150*S,{life:.9,s0:.5,s1:1,fadeOut:.4}));}catch(_){}}return _gu.call(this,dt);};}
  if(typeof SpinRing==='function'){const _su=SpinRing.prototype.update;SpinRing.prototype.update=function(dt){if(!this._jx){this._jx=1;try{jxGround('j05_spin',player.x,player.y,(this.r||62)*2.6,{follow:player,life:this.life,s0:.7,s1:1,fadeIn:.05,fadeOut:.2,spin:8,glow:.4});}catch(_){}}return _su.call(this,dt);};}
  if(typeof HorizonWave==='function'){const _hu=HorizonWave.prototype.update;HorizonWave.prototype.update=function(dt){if(!this._jx){this._jx=1;try{jxStreak('j23_horizon',this.phi,(this.R||190)*1.15,{off:10,ax:.05,life:this.life||.55,slide:70,z:20,s0:.6,s1:1.1});}catch(_){}}return _hu.call(this,dt);};}
  if(typeof DarkSun==='function'){const _dd=DarkSun.prototype.draw;DarkSun.prototype.draw=function(){const im=jxImg('j27_fifthsun');if(!im)return _dd.call(this);const a=Math.min(1,this.t/.4)*Math.min(1,(this.life-this.t)/.4),[x,y]=P(this.x,this.y,this.z||170),w=(this.r||46)*3.2;
      ctx.save();ctx.globalAlpha=Math.max(0,a);ctx.translate(x,y);ctx.rotate(this.t*.4);ctx.drawImage(im,-w/2,-w/2,w,w);ctx.restore();ctx.globalAlpha=1;};}
  if(typeof MoonTrap==='function'){const _mu=MoonTrap.prototype.update;MoonTrap.prototype.update=function(dt){if(!this._jx){this._jx=1;try{const tr=this;jxGround('j20_moontrap',this.x,this.y,(this.r||42)*2.6,{life:this.life,s0:.5,s1:1,fadeIn:.2,fadeOut:.04,pulse:.2,while:()=>jgTraps.includes(tr)&&!tr.dead&&!tr.fired});}catch(_){}}return _mu.call(this,dt);};}
  if(typeof eternalEclipse==='function'){const _ee=eternalEclipse;eternalEclipse=function(cx,cy,R){try{jxGround('j28_zone',cx,cy,(R||170)*2.2,{life:4.3,s0:.4,s1:1,fadeIn:.3,fadeOut:.15,spin:-.3,a0:.85});}catch(_){}return _ee.apply(this,arguments);};}
  if(typeof AncestralSpirit==='function'){const _au=AncestralSpirit.prototype.update;AncestralSpirit.prototype.update=function(dt){if(!this._jx){this._jx=1;try{jxP({n:'j29_spirit',x:player.x-50,y:player.y,z:46,w:150,life:1,s0:.6,s1:1.05,fadeIn:.1,fadeOut:.45,phi:0,slide:90,a0:.9,glow:.5});}catch(_){}}return _au.call(this,dt);};}
  /* per-skill pictures */
  for(const k in JXR){const sk=SKILLS[k];if(!sk||!sk.make)continue;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a){a.events=a.events||[];try{JXR[k](a,c||{});}catch(err){console.warn('jaguar fx',k,err);}}return a;};}
  window.JXR=JXR;}
