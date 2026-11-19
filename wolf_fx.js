/* =====================================================================
   AETHERFALL — WOLF (Frost Raider) · painted skill effects
   Loaded only for the wolf. Wraps the wolf's skill makers and adds
   cartoon effect images (assets/fx/wolf/*.webp) at the moment each skill lands.
   Pictures are the main effect; small code motion (wipe, glow, spin, fade) supports them.
   Gameplay is untouched: only visuals are added.
   ===================================================================== */
(function(){

/* ---------- image loading / drawing ---------- */
const WI={};
function wImg(n){let o=WI[n];if(!o){o=WI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};
  o.im.src=(n.startsWith('w')?'assets/fx/wolf/':'assets/fx/cat/')+n+'.webp';}return o.ok?o.im:null;}
function wDraw(n,sx,sy,w,o={}){const im=wImg(n);if(!im)return false;const cells=o.cell!=null?(o.cells||8):1,iw=im.naturalWidth/cells,ih=im.naturalHeight;let h=w*ih/iw*(o.sq||1);
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,o.a==null?1:o.a));if(o.add)ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);
  if(o.gspin!=null){const r=h/w;ctx.scale(1,r);ctx.rotate(o.gspin);h=w;}
  if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);if(o.fx)ctx.scale(-1,1);
  const ax=o.ax==null?.5:o.ax,ay=o.ay==null?.5:o.ay,c=o.clip==null?1:Math.max(0,Math.min(1,o.clip));
  ctx.drawImage(im,(o.cell||0)*iw,0,iw*c,ih,-w*ax,-h*ay,w*c,h);ctx.restore();return true;}
const scr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
/* storm extras shared by wolf + cat vortex effects: ground shadow + dust ring, code wind streaks and orbiting debris */
window.vxGround=window.vxGround||function(f,W,a){const [gx,gy]=P(f.x,f.y,0);ctx.save();ctx.globalAlpha=a*.4;
  const g=ctx.createRadialGradient(gx,gy,0,gx,gy,W*.55);g.addColorStop(0,'rgba(15,25,45,.55)');g.addColorStop(1,'rgba(15,25,45,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(gx,gy,W*.55,W*.25,0,0,TAU);ctx.fill();
  for(let i=0;i<2;i++){const p=(f.t*1.3+i*.5)%1,rr=W*(.3+.3*p);ctx.globalAlpha=a*.55*(1-p);ctx.strokeStyle=f.vc||'#eaf6ff';ctx.lineWidth=3*(1-p)+1;
    ctx.beginPath();ctx.ellipse(gx,gy,rr,rr*.45,0,0,TAU);ctx.stroke();}ctx.restore();};
window.vxExtra=window.vxExtra||function(f,half,W,H,a){const front=half==='front',dir=Math.sign(f.gspinV)||1,col=f.vc||'#eaf6ff';
  if(!f._bits){f._bits=[];const n=f.ring?12:26;for(let i=0;i<n;i++)f._bits.push({an:rnd(0,TAU),u:Math.random(),sp:rnd(2.2,4.2),sz:rnd(3,7),rot:rnd(0,TAU),vr:rnd(-8,8)});}
  const rad=u=>W*(f.ring?.44-.05*u:(.27+.33*u*u));ctx.save();
  /* wind streaks: partial ellipse arcs at several heights, the half behind / in front is clipped like the swirl */
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';const NS=f.ring?3:8;
  for(let i=0;i<NS;i++){const u=(i+.5)/NS,[cx,cy]=P(f.x,f.y,f.z+H*u),r=rad(u)*(1.05+.08*Math.sin(f.t*4+i)),s0=f.t*7*dir+i*2.4,len=(1.3+.6*Math.sin(f.t*3+i*1.7))*dir;
    ctx.save();ctx.beginPath();if(front)ctx.rect(cx-5000,cy,10000,5000);else ctx.rect(cx-5000,cy-5000,10000,5000);ctx.clip();
    ctx.strokeStyle=col;ctx.globalAlpha=a*(front?.75:.45);ctx.lineWidth=(f.ring?3:2)+3*(1-u);
    ctx.beginPath();ctx.ellipse(cx,cy,r,r*.42,0,s0,s0+len,dir<0);ctx.stroke();ctx.restore();}
  /* debris orbiting the funnel: drawn in front of the hero only while on the near side */
  ctx.globalCompositeOperation='source-over';
  for(const b of f._bits){const an=b.an+f.t*b.sp*dir,sn=Math.sin(an);if((sn>=0)!==front)continue;const u=(b.u+f.t*.25)%1,[cx,cy]=P(f.x,f.y,f.z+H*u),r=rad(u),
    px=cx+Math.cos(an)*r,py=cy+sn*r*.42,sz=b.sz*(front?1.15:.8)*(f.ring?.8:1);
    ctx.save();ctx.translate(px,py);ctx.rotate(b.rot+f.t*b.vr);ctx.globalAlpha=a*(front?1:.6)*Math.min(1,(1-u)*4);
    if(f.deb==='petal'){ctx.fillStyle='#ffb3cc';ctx.strokeStyle='#e0668f';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,sz,sz*.55,0,0,TAU);ctx.fill();ctx.stroke();}
    else if(f.deb==='ember'){ctx.globalCompositeOperation='lighter';ctx.fillStyle=f.dc||'#ff6a3a';ctx.fillRect(-sz*.6,-sz*.2,sz*1.2,sz*.4);}
    else{ctx.fillStyle='#effaff';ctx.strokeStyle='#6fb8f0';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-sz);ctx.lineTo(sz*.5,0);ctx.lineTo(0,sz);ctx.lineTo(-sz*.5,0);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  ctx.restore();};
class WImg{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',z:0,w:100,s0:.85,s1:1.05,a0:1,fadeIn:.04,fadeOut:.5,rot:0,spin:0,rise:0,gspinV:0,glow:0,wipe:0,pulse:0},o);
    /* vortex: a painted 3/4-view storm or ring. Back half is drawn behind the characters, front half over them,
       so the storm wraps around the hero instead of lying on the floor. The swirl turns slowly; an anchored copy keeps
       the painted depth (front rim, spikes, clouds) where it belongs instead of spinning it to the back. */
    if(this.vortex&&!this.half){const v=this.gspinV||0,sg=Math.sign(v)||1;this.gspinV=this.ring?v*.7:sg*Math.min(Math.abs(v)*.4,2.2);
      this.half='back';this.layer='ground';const f=new WImg(Object.assign({},o,{half:'front',layer:'top',gspinV:this.gspinV,vortex:1}));addFx(f);}}
  update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}if(this.until&&!this.until())this.life=Math.min(this.life,this.t+.25);return this.t<this.life;}
  draw(){const k=this.t/this.life,s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),fo=this.fadeOut;
    const a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);
    const [x,y]=P(this.x,this.y,this.z+this.rise*k),W=this.w*s*(this.pulse?1+this.pulse*Math.sin(this.t*12):1);
    const o={rot:this.rot+this.spin*this.t,fy:this.fy,fx:this.fx,a,ax:this.ax,ay:this.ay,sq:this.sq,gspin:this.gspin!=null?this.gspin+this.gspinV*this.t:null,clip:this.wipe?eOut(Math.min(1,k/this.wipe)):null};
    if(this.cell!=null){o.cell=this.cell;o.cells=this.cells;}
    if(this.half){/* funnel: the swirl is stacked in slices up to height H so it has volume (tornado), each slice turning at its own speed */const N=this.ring?3:6,H=this.H||(this.ring?36:Math.min(170,this.w*.55)),a0=o.a,g0=o.gspin||0,front=this.half==='front';if(!front)vxGround(this,W,a0);for(let q=0;q<N;q++){const i=front?N-1-q:q,u=i/(N-1),zz=this.z+H*u,[xi,yi]=P(this.x,this.y,zz),wi=W*(this.ring?1-.12*u:.55+.6*u*u)*(1+.04*Math.sin(this.t*7+i*1.7)),sw=Math.sin(this.t*2.2+i*1.3)*W*.035*u;ctx.save();ctx.beginPath();if(front)ctx.rect(xi-5000,yi,10000,5000);else ctx.rect(xi-5000,yi-5000,10000,5000);ctx.clip();o.gspin=g0*(1+.35*i)+i*1.1;o.a=a0*(front?.78:1)*(this.ring?1-.3*u:(.95-.55*u));wDraw(this.n,xi+sw,yi,wi,o);ctx.restore();}o.gspin=g0;o.a=a0;vxExtra(this,this.half,W,H,a0);if(front&&!this.ring&&typeof emit==='function'){const nn=Q&&Q.p<.6?1:3;for(let m=0;m<nn;m++){const an=Math.random()*TAU,u=Math.random(),r=this.w*s*(.25+.3*u*u);emit({type:'snow',x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r*.6,z:this.z+H*u,vz:rnd(60,140),vx:-Math.sin(an)*rnd(90,160),vy:Math.cos(an)*rnd(40,80),drag:.8,life:rnd(.5,.9),size:rnd(1.4,3),color:Math.random()<.5?'#ffffff':'#bfe6ff'});}}}
    else wDraw(this.n,x,y,W,o);if(this.glow&&k<.35&&!this.half){o.a=this.glow*(1-k/.35);o.add=1;wDraw(this.n,x,y,W,o);}}}
class WBit{constructor(o){Object.assign(this,{t:0,layer:'top',vz:0,drag:2,spin:rnd(-6,6),rot:rnd(0,TAU),w:12,grav:60},o);this.cell=this.cell??((Math.random()*8)|0);this.life=this.life||rnd(.5,.9);}
  update(dt){this.t+=dt;const d=Math.exp(-this.drag*dt);this.vx*=d;this.vy*=d;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z=Math.max(0,this.z+this.vz*dt);this.vz-=this.grav*dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.3);wDraw(this.n,x,y,this.w,{cell:this.cell,rot:this.rot+this.spin*this.t,a});}}
const fxI=o=>addFx(new WImg(o));
function bits(n,x,y,z,num,spd=120){if(!wImg(n))return;for(let i=0;i<qn(num);i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;addFx(new WBit({n,x,y,z:z+rnd(-6,8),vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(30,110),w:rnd(8,14)}));}}
const flashS=(a,c)=>{if(typeof screenFlash==='function')screenFlash(a,c);};

/* ---------- reusable moments ---------- */
const W={
  slash(phi,w,kind,flip){const n=kind==='frost'?'w11_frost':'w01_axe';fxI({n,x:player.x+Math.cos(phi)*w*.28,y:player.y+Math.sin(phi)*w*.28,z:30,w,rot:scr(phi),fy:!!flip,life:.32,s0:.82,s1:1.06,fadeIn:.001,fadeOut:.45,wipe:.35,glow:.8});
    if(kind!=='frost')bits('w02_blood',player.x+Math.cos(phi)*w*.4,player.y+Math.sin(phi)*w*.4,30,3,90);else bits('w12_ice',player.x+Math.cos(phi)*w*.4,player.y+Math.sin(phi)*w*.4,30,3,90);},
  crater(x,y,w=170){fxI({n:'09_crater',x,y,w,sq:.85,layer:'ground',life:1.5,s0:.9,s1:1,fadeIn:.02,fadeOut:.35});fxI({n:'25_shock',x,y,w:w*1.2,life:.4,s0:.3,s1:1.15,fadeIn:.001,fadeOut:.7,layer:'ground'});
    if(wImg('23_dust'))for(let i=0;i<5;i++){const a=rnd(0,TAU),r=rnd(.4,1)*w*.45;fxI({n:'23_dust',x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.6,z:4,w:rnd(26,44),cell:(Math.random()*4)|0,cells:4,life:rnd(.5,.8),s0:.6,s1:1.2,rise:12,fadeOut:.6,a0:.9});}flashS(.15,'#ffd8a8');},
  bolt(x,y,h=170){fxI({n:'w15_bolt',x,y,z:0,w:h*.62,ay:.95,life:.28,s0:.9,s1:1.05,fadeIn:.001,fadeOut:.6,glow:.9});bits('w12_ice',x,y,8,3,80);},
  shatter(x,y,w=110){fxI({n:'w18_shatter',x,y,z:24,w,life:.35,s0:.4,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.7});bits('w12_ice',x,y,24,5,150);},
  tgt(c,r=200){return (c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r,player.phi)||nearestEnemy(player.x,player.y,r);}
};
const near=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);

/* ---------- per-skill moments (run at the skill's contact time) ---------- */
const AT={   // key: (a,c) => visuals ; a = the action, c = cast context
  reversalSlash:(a,c)=>W.slash(player.phi,130,'axe',1),
  bloodCleave:(a,c)=>W.slash(player.phi,150,'axe'),
  savageRend:(a,c)=>{W.slash(player.phi,140,'axe',1);},
  axeDance:(a,c)=>{for(let i=0;i<3;i++)setFxT(i*.12,()=>W.slash(player.phi+rnd(-.4,.4),130,'axe',i%2));},
  wolfFinale:(a,c)=>{W.slash(player.phi,170,'axe');W.crater(player.x+Math.cos(player.phi)*40,player.y+Math.sin(player.phi)*40,170);},
  revengeBreaker:(a,c)=>{W.slash(player.phi,160,'axe');const t=W.tgt(c);if(t)fxI({n:'22_pow',x:t.x,y:t.y,z:30,w:120,life:.25,s0:.4,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6});},
  vampiricAxe:(a,c)=>{W.slash(player.phi,140,'axe');fxI({n:'w06_vamp',x:player.x,y:player.y,z:10,w:90,ay:.85,life:.9,s0:.6,s1:1,rise:20,fadeOut:.4,glow:.4});},
  armorBreak:(a,c)=>{const t=W.tgt(c);W.slash(player.phi,130,'axe');if(t)fxI({n:'w10_armor',x:t.x,y:t.y,z:30,w:t.boss?140:100,life:.55,s0:.6,s1:1.1,fadeOut:.5,glow:.5});},
  executioner:(a,c)=>{const t=W.tgt(c)||player;fxI({n:'w08_exec',x:t.x,y:t.y,z:0,w:t.boss?115:90,ay:.95,life:.5,s0:1.1,s1:.95,fadeIn:.001,fadeOut:.5,glow:.8});W.crater(t.x,t.y,150);flashS(.2,'#ff5a4a');},
  cycloneLeap:(a,c)=>{W.crater(player.x,player.y,170);},
  ironCounter:(a,c)=>{fxI({n:'w09_parry',x:player.x+Math.cos(player.phi)*24,y:player.y+Math.sin(player.phi)*24,z:36,w:80,life:.5,s0:.6,s1:1.05,fadeIn:.001,fadeOut:.5,glow:.8});},
  warHowl:(a,c)=>{fxI({n:'w05_howl',x:player.x,y:player.y,z:70,w:120,life:.9,s0:.5,s1:1.1,fadeOut:.45,glow:.6});fxI({n:'25_shock',x:player.x,y:player.y,w:220,life:.45,s0:.3,s1:1.15,fadeIn:.001,fadeOut:.7,layer:'ground'});flashS(.12,'#ffcf6a');},
  warFury:(a,c)=>{fxI({n:'w05_howl',x:player.x,y:player.y,z:70,w:100,life:.7,s0:.5,s1:1.05,fadeOut:.5});},
  bloodRush:(a,c)=>{fxI({n:'w07_rage',x:player.x,y:player.y,w:110,ay:.88,life:.5,s0:.8,s1:1.05,fadeOut:.5,follow:1,layer:'ground'});},
  predatorsLeap:(a,c)=>{fxI({n:'w19_spirit',x:player.x,y:player.y,z:40,w:140,rot:scr(player.phi),fy:Math.cos(player.phi)<0,life:.45,s0:.8,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.5});setFxT(.3,()=>W.crater(player.x,player.y,160));},
  valhallasWrath:(a,c)=>{const t=W.tgt(c,260)||player;fxI({n:'w07_rage',x:player.x,y:player.y,w:130,ay:.88,life:1,s0:.6,s1:1.05,fadeOut:.4,layer:'ground',follow:1});
    setFxT(.15,()=>{fxI({n:'w08_exec',x:t.x,y:t.y,w:t.boss?150:125,ay:.95,life:.6,s0:1.2,s1:.95,fadeIn:.001,fadeOut:.5,glow:.9});W.crater(t.x,t.y,220);flashS(.3,'#ff4a3a');});},
  frostFang:(a,c)=>W.slash(player.phi,140,'frost'),
  iceBreak:(a,c)=>{const t=W.tgt(c);W.slash(player.phi,130,'frost',1);if(t)W.shatter(t.x,t.y,t.boss?150:110);},
  runeBurst:(a,c)=>{fxI({n:'w14_rune',x:player.x,y:player.y,w:200,layer:'ground',life:.7,s0:.5,s1:1.1,fadeOut:.5,gspin:0,gspinV:3,glow:.6});W.shatter(player.x,player.y,150);},
  runeGuard:(a,c)=>{fxI({n:'w14_rune',x:player.x,y:player.y,w:150,layer:'ground',life:.6,s0:.3,s1:1,fadeOut:.4,glow:.7});},
  thunderFang:(a,c)=>{const t=W.tgt(c,240);W.slash(player.phi,130,'frost');if(t)W.bolt(t.x,t.y,150);},
  lightningPursuit:(a,c)=>{const t=W.tgt(c,300);if(t)W.bolt(t.x,t.y,170);},
  stormStep:(a,c)=>{W.bolt(player.x,player.y,140);},
  shatterPulse:(a,c)=>{W.shatter(player.x,player.y,180);fxI({n:'25_shock',x:player.x,y:player.y,w:240,life:.45,s0:.3,s1:1.15,fadeIn:.001,fadeOut:.7,layer:'ground'});},
  frozenDescent:(a,c)=>{W.crater(player.x,player.y,170);W.shatter(player.x,player.y,170);},
  thunderSpear:(a,c)=>{const t=W.tgt(c,320),phi=t?angTo(t):player.phi,L=t?Math.hypot(t.x-player.x,t.y-player.y):200;
    fxI({n:'w16_spear',x:player.x+Math.cos(phi)*L*.5,y:player.y+Math.sin(phi)*L*.5,z:34,w:Math.max(150,L),rot:scr(phi),life:.3,s0:.9,s1:1.02,fadeIn:.001,fadeOut:.5,wipe:.5,glow:.8});if(t)setFxT(.1,()=>W.bolt(t.x,t.y,160));},
  icePrison:(a,c)=>{const x=c.gx??player.x,y=c.gy??player.y,r=(typeof prisonR==='function'?prisonR():70);fxI({n:'w13_prison',x,y:y+4,w:r*1.7,ay:.88,life:2.6,a0:.92,s0:.4,s1:1,fadeIn:.08,fadeOut:.15});W.shatter(x,y,r*2);},
  runeStorm:(a,c)=>{const x=c.gx??player.x,y=c.gy??player.y,r=70+10*(LV.runeStorm||1);fxI({n:'w14_rune',x,y,w:r*2.4,layer:'ground',life:1.6,s0:.4,s1:1,fadeOut:.3,gspin:0,gspinV:2,glow:.6});for(let i=0;i<4;i++)setFxT(.2+i*.25,()=>W.bolt(x+rnd(-r,r)*.6,y+rnd(-r,r)*.4,140));},
  blizzard:(a,c)=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.blizzard||1,r=100+15*lv,dur=2.4+.4*lv;fxI({n:'w17_blizzard',x,y,z:8,w:r*2.0,life:dur,s0:.4,s1:1,a0:.85,fadeIn:.25,fadeOut:.15,gspin:0,gspinV:2.5,vortex:1,H:130,vc:'#dff3ff',deb:'ice'});skyDarkT=Math.max(skyDarkT,.45);setFxTimer(dur,()=>{skyDarkT=0;});},
  tempestField:(a,c)=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.tempestField||1,r=120+10*lv;fxI({n:'w14_rune',x,y,w:r*2.3,layer:'ground',life:4,s0:.4,s1:1,a0:.85,fadeOut:.1,gspin:0,gspinV:1});for(let i=0;i<10;i++)setFxT(.2+i*.38,()=>W.bolt(x+rnd(-r,r)*.7,y+rnd(-r,r)*.5,140));},
  ragnaroksJudgment:(a,c)=>{const x=player.x,y=player.y;fxI({n:'w22_worldstorm',x,y,z:6,w:400,life:2.6,s0:.3,s1:1,a0:.85,fadeIn:.3,fadeOut:.2,gspin:0,gspinV:3,vortex:1,H:190,vc:'#cfeaff',deb:'ice'});skyDarkT=Math.max(skyDarkT,.7);setFxTimer(2.6,()=>{skyDarkT=0;});for(let i=0;i<10;i++)setFxT(.2+i*.22,()=>W.bolt(x+rnd(-170,170),y+rnd(-110,110),170));flashS(.3,'#9ad8ff');},
  runicDetonation:(a,c)=>{const t=W.tgt(c,260)||player;fxI({n:'w14_rune',x:t.x,y:t.y,w:130,layer:'ground',life:.5,s0:.4,s1:1.1,fadeOut:.5,glow:.7});setFxT(.15,()=>W.shatter(t.x,t.y,150));},
  ravenousLeap:(a,c)=>{fxI({n:'w19_spirit',x:player.x,y:player.y,z:40,w:150,rot:scr(player.phi),fy:Math.cos(player.phi)<0,life:.5,s0:.8,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6});setFxT(.3,()=>W.crater(player.x,player.y,150));},
  frostbloodPact:(a,c)=>{fxI({n:'w06_vamp',x:player.x,y:player.y,w:90,ay:.85,life:.9,s0:.5,s1:1,rise:16,fadeOut:.4});W.shatter(player.x,player.y,120);},
  warBanner:(a,c)=>{BAN={x:player.x+18,y:player.y-6};},
  fenrirsSpirit:(a,c)=>{fxI({n:'w19_spirit',x:player.x,y:player.y,z:30,w:180,life:.8,s0:.5,s1:1.1,fadeOut:.5,glow:.7});flashS(.2,'#bfe8ff');},
  axeCyclone:(a,c)=>{fxI({n:'w04_cyclone',x:player.x,y:player.y,z:20,w:200,life:Math.max(.6,(a.dur||1)*.95),s0:.6,s1:1,fadeIn:.05,fadeOut:.2,follow:1,gspin:0,gspinV:-12,glow:.4,vortex:1,ring:1,vc:'#ffd6d0',deb:'ember',dc:'#ff3d3d'});},
  battleStep:(a,c)=>{if(wImg('23_dust'))fxI({n:'23_dust',x:player.x,y:player.y,z:4,w:40,cell:0,cells:4,life:.5,s0:.6,s1:1.2,rise:10,fadeOut:.6});},
};
/* fx-time delay that follows game time */
class WDelay{constructor(t,f){this.t=t;this.f=f;this.layer='none';}update(dt){this.t-=dt;if(this.t<=0){try{this.f();}catch(_){}return false;}return true;}draw(){}}
function setFxT(t,f){addFx(new WDelay(t,f));}
let BAN=null;

/* ---------- auras that follow buffs ---------- */
class WAura{constructor(){this.t=0;this.layer='ground';this.r=0;this.g=0;this.b=0;}
  update(dt){this.t+=dt;const f=(v,on)=>Math.max(0,Math.min(1,v+(on?dt*4:-dt*3)));this.r=f(this.r,hasBuff('warFury'));this.g=f(this.g,hasBuff('runeGuard'));this.b=f(this.b,hasBuff('banner')&&BAN);return CHAR==='wolf';}
  draw(){const [x,y]=P(player.x,player.y,0);
    if(this.g>0)wDraw('w14_rune',x,y,120,{a:.8*this.g,gspin:this.t*1.2});
    if(this.r>0)wDraw('w07_rage',x,y+6,110*(1+.04*Math.sin(this.t*12)),{a:.75*this.r,ay:.88,fx:Math.sin(this.t*7)>0});
    if(this.b>0&&BAN){const [bx,by]=P(BAN.x,BAN.y,0);wDraw('w20_banner',bx,by,54,{a:this.b,ay:.96,rot:.04*Math.sin(this.t*3)});}}}
class WTop{constructor(){this.t=0;this.layer='top';this.s=0;}update(dt){this.t+=dt;this.s=Math.max(0,Math.min(1,this.s+(hasBuff('fenrir')?dt*3:-dt*3)));return CHAR==='wolf';}
  draw(){if(this.s<=0)return;const [x,y]=P(player.x-Math.cos(player.phi)*44,player.y-Math.sin(player.phi)*44-6,34+4*Math.sin(this.t*4));wDraw('w19_spirit',x,y,90,{a:.4*this.s,fx:Math.cos(player.phi)<0});}}
class WCore{constructor(){this.layer='none';}draw(){}update(){if(!this.a||!fx.includes(this.a))this.a=addFx(new WAura());if(!this.b||!fx.includes(this.b))this.b=addFx(new WTop());return CHAR==='wolf';}}

/* ---------- hooks ---------- */
const A_SET=new Set(['warFury','bloodCleave','savageRend','axeDance','wolfFinale','ironCounter','revengeBreaker','vampiricAxe','bloodRush','axeCyclone','cycloneLeap','executioner','predatorsLeap','valhallasWrath','reversalSlash','armorBreak','basic']);
const B_SET=new Set(['frostFang','iceBreak','runeGuard','runeBurst','thunderFang','lightningPursuit','icePrison','shatterPulse','stormStep','runeStorm','blizzard','frozenDescent','thunderSpear','tempestField','ragnaroksJudgment','runicDetonation']);
function install(){
  if(typeof CHAR==='undefined'||CHAR!=='wolf')return;
  for(const n of ['w01_axe','w02_blood','w03_hitred','w04_cyclone','w05_howl','w06_vamp','w07_rage','w08_exec','w09_parry','w10_armor','w11_frost','w12_ice','w13_prison','w14_rune','w15_bolt','w16_spear','w17_blizzard','w18_shatter','w19_spirit','w20_banner','w21_glacial','w22_worldstorm','09_crater','22_pow','23_dust','25_shock'])wImg(n);
  for(const k in AT){const sk=SKILLS[k]||(typeof CSK!=='undefined'&&CSK[k]);if(!sk||!sk.make||sk._wfx)continue;const mk=sk.make;sk._wfx=1;
    sk.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){const t=Math.max(.02,Math.min(a.windup||.02,(a.dur||1)-.02));a.events.push({t,f:()=>{try{AT[k](a,c||{});}catch(e){console.error('wolf_fx '+k+': '+e);}}});}return a;};}
  /* normal attack: painted axe swing */
  if(typeof mkBasic==='function'&&!mkBasic._wfx){const mb=mkBasic;mkBasic=function(t){const a=mb.apply(this,arguments);if(a&&a.events){const tt=Math.max(.02,(a.windup||.1)-.03);const fl=(player.basicIdx||0)%2;a.events.push({t:tt,f:()=>W.slash(player.phi,110,'axe',fl)});}return a;};mkBasic._wfx=1;}
  /* every hit: spark (A/basic red + blood, B ice) */
  if(typeof hurt==='function'&&!hurt._wfx){const h0=hurt;let last=0;
    hurt=function(e,mult,o={}){const wasDead=e&&e.dead;const r=h0.apply(this,arguments);if(!e||wasDead||!r)return r;if(o&&o.dot)return r;
      const k=(o&&o.skill)||(o&&o.auto?'basic':null)||window.SKCTX||'basic';if(gameTime-last<.035&&!(o&&o.big))return r;last=gameTime;
      const z=(e.boss?40:26)+rnd(-6,8);
      if(B_SET.has(k)){fxI({n:'w18_shatter',x:e.x+rnd(-6,6),y:e.y,z,w:e.boss?70:50,rot:rnd(0,TAU),life:.18,s0:.5,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6});bits('w12_ice',e.x,e.y,z,2,100);}
      else{fxI({n:'w03_hitred',x:e.x+rnd(-6,6),y:e.y,z,w:(o&&o.big?80:56)*(e.boss?1.3:1),rot:rnd(0,TAU),life:.18,s0:.5,s1:1.15,fadeIn:.001,fadeOut:.6,glow:.7});bits('w02_blood',e.x,e.y,z,2,110);}
      return r;};hurt._wfx=1;}
  addFx(new WCore());
  /* painted skill icons (assets/icons/wolf/<key>.webp); a missing file keeps the old icon */
  if(typeof SKILL_ICON_ART!=='undefined'){const all=Object.assign({},SKILLS,typeof CSK!=='undefined'?CSK:{});
    for(const k in all){const sk=all[k];if(!sk||!sk.name)continue;const src='assets/icons/wolf/'+k+'.webp',im=new Image();
      im.onload=()=>{SKILL_ICON_ART[sk.name]=src;if(typeof renderSkillTree==='function'&&document.getElementById('skwin')&&document.getElementById('skwin').offsetParent)try{renderSkillTree();}catch(_){}};im.src=src;}}
}
window.installWolfFx=install;
window.wImg=wImg;   /* toon VFX companion (vfx_layer.js) reads the pictures */
})();
