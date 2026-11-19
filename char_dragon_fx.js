/* =====================================================================
   TOTEM LEGEND — Dragon-lion (shishi) · painted skill effects (assets/fx/dragon, 26 pieces)
   Pictures are the main effect; the older code VFX in char_dragon.js stay underneath as support.
   Placement rules: ground pieces lie on the ground layer · upright pieces stand on their bottom edge
     · streaks are aimed along the attack at chest height · hit sparks sit on the body, short.
   installDragonFx() runs after installDragon(): it wraps each skill's make() (cast moment)
   plus dHit (hit sparks) and dBolt (lightning).
   ===================================================================== */
const DXI={};
function dxImg(n){let o=DXI[n];if(!o){o=DXI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/dragon/'+n+'.webp';}return o.ok?o.im:null;}
const DXF=['guard_shield','horn_rush','calm_breath','roar_ring','water_fist','whirl_hook','riptide_dash','fist_flurry','tsunami_geyser','ebb_dome','torrent_flash','water_hit',
  'wind_palm','thunder_seal','lightning','cloud_puff','ki_dragon','heaven_push','mirror_pond','azure_dragon','wind_hit','maelstrom','dragon_breath','awaken_aura','abyss_wave','storm_ring'];
const dxScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));

/* one painted piece placed in the world (optionally moving: speed along phi) */
class DxImg{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,spin:0,delay:0,sortOff:0,pulse:0,speed:0,phi:0,until:0},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;if(this.t<0)return true;const f=this.follow;if(f){this.x=f.x+(this.fx0||0);this.y=f.y+(this.fy0||0);}
    if(this.speed){this.x+=Math.cos(this.phi)*this.speed*dt;this.y+=Math.sin(this.phi)*this.speed*dt;}
    if(this.until&&gameTime<this.until-this.life*this.fadeOut)this.t=Math.min(this.t,this.life*(1-this.fadeOut));   /* hold until the skill ends */
    if(this.while&&!this.while())this.until=0;
    return this.t<this.life;}
  draw(){if(this.t<0)return;const im=dxImg(this.n);if(!im)return;const k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),[x,y]=P(this.x,this.y,this.z),w=this.w*s,h=w*im.naturalHeight/im.naturalWidth*(this.layer==='ground'&&!this.flatArt?K:1);
    const draw=(alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t);if(this.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    draw(a,false);if(this.glow&&k<.35)draw(this.glow*a*(1-k/.35),true);ctx.globalAlpha=1;}}
const dxP=o=>addFx(window.TV?new TV.Piece(Object.assign({img:dxImg,hero:'dragon'},o)):new DxImg(o));
/* streak aimed along phi (art points right) */
const dxStreak=(n,x,y,phi,w,o={})=>{const r=dxScr(phi);return dxP(Object.assign({n,x,y,z:30,w,rot:r,fy:Math.cos(r)<0,life:.35,s0:.7,s1:1.05,fadeIn:.03,fadeOut:.5,glow:.5,phi},o));};
/* ground piece: the art is already drawn flat (wide ellipse), so no extra squash */
const dxGround=(n,x,y,w,o={})=>dxP(Object.assign({n,x,y,z:0,w,layer:'ground',flatArt:true,life:.7,s0:.6,s1:1.04,fadeIn:.06,fadeOut:.4},o));
const dxStand=(n,x,y,w,o={})=>dxP(Object.assign({n,x,y,z:0,w,ay:.96,layer:'sorted',sortOff:4,life:.8,s0:.7,s1:1,fadeIn:.1,fadeOut:.4},o));
const dxSpark=(n,e,w,o={})=>{if(!e)return;dxP(Object.assign({n,x:e.x,y:e.y,z:(e.boss?42:24)+(e.z||0)+rnd(-4,4),w,life:.24,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6,rot:rnd(-.4,.4)},o));};
const dxFwd=(d,phi)=>[player.x+Math.cos(phi)*d,player.y+Math.sin(phi)*d];

/* ---------- per-skill pieces at the cast moment ---------- */
const DX_CAST={
  dnGuard:c=>dxStand('guard_shield',player.x,player.y,104,{follow:player,fy0:-2,sortOff:-4,z:8,ay:.62,life:DB.dnGuard.T+.25,s0:.5,s1:1,a0:.5,glow:.5}),
  dnRush:c=>{const p=player.phi;dxStreak('horn_rush',player.x,player.y,p,150,{follow:player,life:.42,z:30});},
  dnBreath:c=>dxStand('calm_breath',player.x,player.y,96,{follow:player,life:DB.dnBreath.T+.2,a0:.75,pulse:.25,glow:.3}),
  dnRoar:c=>dxGround('roar_ring',player.x,player.y,250,{life:.75,s0:.35,s1:1.15,glow:.6}),
  daJab:c=>{const p=player.phi;for(let i=0;i<3;i++){const [x,y]=dxFwd(40,p);dxStreak('water_fist',x,y,p+rnd(-.12,.12),110,{delay:i*.11,life:.26,z:30+rnd(-6,6)});}},
  daHook:c=>{const t=c&&c.target;if(!t)return;dxStreak('whirl_hook',t.x,t.y,angTo(t)+Math.PI,130,{delay:.12,life:.45,z:28});},
  daStep:c=>{const p=player.phi;dxStreak('riptide_dash',player.x,player.y,p,190,{delay:.02,life:.4,z:14});},
  daHundred:c=>{const p=player.phi;for(let i=0;i<5;i++){const [x,y]=dxFwd(46,p);dxStreak('fist_flurry',x,y,p+rnd(-.1,.1),150,{delay:.1+i*.2,life:.3,z:30+rnd(-6,6),glow:.4});}},
  daTsunami:c=>{const t=c&&c.target;const [x,y]=t?[t.x,t.y]:dxFwd(60,player.phi);dxStand('tsunami_geyser',x,y,110,{delay:.18,life:.75,s0:.4,s1:1.05,glow:.6});},
  daEbb:c=>dxStand('ebb_dome',player.x,player.y,150,{follow:player,life:DB.daEbb.T+.3,a0:.7,s0:.5,s1:1,glow:.4,pulse:.15}),
  daTorrent:c=>{const x=player.x,y=player.y;dxStand('torrent_flash',x,y,140,{life:.6,s0:.5,s1:1.1,glow:.8});},
  dkPalm:c=>{const p=player.phi,ways=dL('dcFan')?DB.dcFan.n:1;for(let i=0;i<ways;i++){const ph=p+(ways>1?(i-(ways-1)/2)*.35:0),[x,y]=dxFwd(30,ph);dxStreak('wind_palm',x,y,ph,150,{delay:.1,speed:560,phi:ph,life:Math.max(.45,DB.dkPalm.len/560),fadeIn:.02,fadeOut:.25,z:30,s0:.8});}},
  dkSeal:c=>{const t=c&&c.target;if(t)dxSpark('thunder_seal',t,70,{delay:.15,life:.55,s0:1.4,s1:1,fadeOut:.4,rot:0});},
  dkCloud:c=>{const x=player.x,y=player.y,T=dLv(DB.dkCloud.slow,'dkCloud');dxGround('cloud_puff',x,y,DB.dkCloud.R*2.4,{life:T,s0:.6,s1:1,a0:.85,fadeOut:.15});},
  dkTwin:c=>{const p=player.phi,n=dL('dcNine')?DB.dcNine.n:2;for(let i=0;i<n;i++){const ph=p+(i-(n-1)/2)*(n>2?.3:.22),[x,y]=dxFwd(30,ph);dxStreak('ki_dragon',x,y,ph,120,{delay:.15+i*.04,speed:480,phi:ph,life:.6,fadeOut:.3,z:34});}},
  dkPush:c=>dxGround('heaven_push',player.x,player.y,260,{delay:.12,life:.7,s0:.3,s1:1.15,glow:.6}),
  dkMirror:c=>dxGround('mirror_pond',player.x,player.y,150,{follow:player,life:DB.dkMirror.T+.2,a0:.85,glow:.4}),
  dkDescend:c=>{const x=c&&c.gx!=null?c.gx:player.x,y=c&&c.gy!=null?c.gy:player.y,R=DB.dkDescend.R;dxGround('azure_dragon',x,y,R*2.3,{delay:.3,life:DB.dkDescend.T,s0:.5,s1:1,a0:.9,fadeOut:.12,pulse:.12});dxGround('storm_ring',x,y,R*2.1,{delay:.3,life:DB.dkDescend.T,a0:.55,fadeOut:.12});},
  dcMaelstrom:c=>dxGround('maelstrom',player.x,player.y,DB.dcMaelstrom.R*2.1,{delay:.1,life:DB.dcMaelstrom.T+.3,s0:.4,s1:1,spin:0,fadeOut:.2,glow:.4}),
  dcBreath:c=>{const p=player.phi,[x,y]=dxFwd(DB.dcBreath.R*.45,p);dxStreak('dragon_breath',x,y,p,DB.dcBreath.R*1.05,{delay:.12,life:.6,z:34,s0:.4,s1:1.05,glow:.5});},
  dcAwaken:c=>{dxStand('torrent_flash',player.x,player.y,120,{life:.5,s0:.5,s1:1.1,glow:.8});
    dxStand('awaken_aura',player.x,player.y,120,{follow:player,fy0:-1,sortOff:-2,life:DB.dcAwaken.T,a0:.55,pulse:.25,fadeOut:.05,while:()=>hasBuff('dcAwaken')});},
  dcAbyss:c=>{const p=player.phi,[x,y]=dxFwd(30,p);dxStreak('abyss_wave',x,y,p,190,{delay:.25,speed:520,phi:p,life:DB.dcAbyss.len/520+.1,fadeOut:.3,z:40,s0:.5,s1:1});},
  dcSovereign:c=>dxGround('storm_ring',player.x,player.y,170,{follow:player,life:DB.dcSovereign.T,a0:.75,fadeOut:.08,pulse:.2,while:()=>hasBuff('dcSovereign')}),
};
DX_CAST.dcThunder=null;

function installDragonFx(){if(CHAR!=='dragon')return;if(window.TV)TV.toonify();DXF.forEach(dxImg);
  for(const k in DX_CAST){const f=DX_CAST[k],s=SKILLS[k];if(!f||!s||!s.make||s._dx)continue;const mk=s.make;
    s.make=function(c){const a=mk.apply(this,arguments);if(a){try{f(c||{});}catch(e){}}return a;};s._dx=1;}
  /* hit sparks: water for basic / A, wind for B, short and on the body; one per enemy per 0.07 s */
  if(!window._dxHit){window._dxHit=1;const H=window.dHit;
    window.dHit=function(e,mult,key){const r=H.apply(this,arguments);try{if(e&&r&&(!e._dxT||gameTime-e._dxT>.07)){e._dxT=gameTime;const b=dCol(key);dxSpark(b==='B'?'wind_hit':'water_hit',e,b==='B'?58:52);}}catch(_){}return r;};
    const B=window.dBolt;window.dBolt=function(e){const r=B.apply(this,arguments);try{if(e&&window.TV){const [bx,by]=P(e.x,e.y,0);TV.fxAt('hit',bx,by-12,60,'electric',{cols:TV.colsOf(dxImg('lightning'))});}if(e)dxStand('lightning',e.x,e.y,74,{life:.32,s0:.85,s1:1,fadeIn:.001,fadeOut:.55,glow:.8,sortOff:6});}catch(_){}return r;};}
}
/* the skill window / mode switch can re-run installDragon(): re-wrap after it */
(function(){const I=window.installDragon;if(typeof I==='function'&&!I._dx){window.installDragon=function(){const r=I.apply(this,arguments);try{installDragonFx();}catch(e){}return r;};window.installDragon._dx=1;}})();

/* toon VFX hints: which particle family each picture uses (vfx_layer.js) */
if(window.TV)TV.hint('dragon',{wind_palm:'light',wind_hit:'light',cloud_puff:'light',heaven_push:'light',thunder_seal:'electric',lightning:'electric',storm_ring:'electric',
  guard_shield:'gold',horn_rush:'gold',roar_ring:'gold',calm_breath:'nature',awaken_aura:'water',ki_dragon:'water',azure_dragon:'water',mirror_pond:'water',dragon_breath:'water'});
