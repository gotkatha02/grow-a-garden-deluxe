/* =====================================================================
   TOTEM LEGEND — Greek white lion · skill effects v2 (owner 2026-11-19, same method as the dragon)
   Painted pictures (assets/fx/lion) are the main shapes; vfx25.js adds the 2.5D support.
   ===================================================================== */
(function(){
const N=n=>'lion/'+n;
const LC={gold:'#ffd36a',bolt:'#7ac8ff',marble:'#efe6d2',white:'#ffffff'};
const FX=['aegis_dome','arena_spin','ascend_aura','counter_flash','dust_hit','grab_flash','keraunos','kings_roar','labors_ring','laurel_circle','laurel_crown','laurel_rest','nemean_hide','olympus_wrath',
  'overcharge_aura','pounce_land','shove_wave','sky_strike','spark_hit','storm_cloud','suplex_crash','thunder_javelin','titan_lift','titan_toss','twelfth_slam','zeus_eagle'];

function install(){const X=window.V25;if(!X||CHAR!=='lion')return;const {im,add,punch,scr,aim,ribbon,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Pillar,Pool,Speed,Stain,Bolt,V,c01,eo}=X;
  FX.forEach(n=>im(N(n)));if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('lion');
  const zaps=(x,y,n)=>add(new Debris({x,y,n,kind:'zap',col:'#bfe8ff',col2:'#ffffff',v0:80,v1:200,up:200,life:.55}));
  const stones=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'rock',col:'#e8dcc4',col2:'#ffffff',v0:80,v1:220,up:260,life:1},o)));
  /* act-based skills without lBurst / lPunches */
  const ACT={laSpin:a=>{add(new GPic({n:N('arena_spin'),x:player.x,y:player.y,w:LB.laSpin.R*2.4,follow:player,life:a.dur+.3,a0:.85,fadeOut:.2}));add(new Whirl({x:player.x,y:player.y,follow:player,R:LB.laSpin.R*.8,n:4,w:18,col:'#ffe08a',col2:'#fff',life:a.dur+.2,spd:10}));},
    laLabors:a=>{add(new GPic({n:N('labors_ring'),x:player.x,y:player.y,w:LB.laLabors.R*2.2,life:a.dur+.4,a0:.9,fadeOut:.2}));V.release(player.x,player.y,LC.gold,{R:140,h:300});},
    laCounter:a=>add(new SPic({n:N('counter_flash'),x:player.x,y:player.y,w:100,ay:.6,z:8,follow:player,sortOff:8,life:a.dur+.2,a0:.85,shadow:0,pool:LC.gold})),
    lnPounce:a=>{const p=player.phi;add(new Speed({x:player.x,y:player.y,phi:p,follow:player,life:.35,col:'#fff0c0'}));}};
  for(const k in ACT){const s=SKILLS[k];if(!s||!s.make||s._lv2)continue;const mk=s.make;s.make=function(c){const a=mk.apply(this,arguments);if(a){try{ACT[k](a);}catch(e){console.warn(e);}}return a;};s._lv2=1;}
  if(window._lv2h)return;window._lv2h=1;
  /* 1. old visuals off */
  const DROP=[typeof GRing!=='undefined'&&GRing,typeof Impact!=='undefined'&&Impact,typeof Streak!=='undefined'&&Streak].filter(Boolean);
  const A=window.addFx;window.addFx=addFx=function(f){if(f&&!f._v2&&DROP.some(c=>f instanceof c))return f;return A.apply(this,arguments);};
  const E=window.emit;window.emit=emit=function(o){if(o&&/^(round|spark|ember|dust|shard|frag|glint)$/.test(o.type))return;return E.apply(this,arguments);};
  window.dustPuff=dustPuff=function(x,y,n,col,spd){add(new Puffs({x,y,R:(spd||60)*.9,n:Math.max(2,Math.round((n||4)*.6)),size:9,life:.6,col:'#f6efe0',edge:'#c8b896'}));};
  window.lPow=lPow=function(e,big,col){const bolt=col===LIC.bolt||col===LIC.bolt2;add(new HPic({n:N(bolt?'spark_hit':'dust_hit'),x:e.x,y:e.y,e,w:big?74:52,z:(e.boss?40:24)+(e.z||0)}));bolt?zaps(e.x,e.y,big?4:2):stones(e.x,e.y,big?4:2,{v0:40,v1:120,up:160});};
  window.lSlamFx=lSlamFx=function(x,y,R){R=R||80;add(new GPic({n:N(R>=110?'suplex_crash':'pounce_land'),x,y,w:R*2.6,life:1,s0:.45,fadeOut:.4}));V.slam(x,y,R,LC.gold,{kind:'rock',dcol:'#e8dcc4',dust:'#f6efe0',dustE:'#c8b896',shake:3});stop(60);};
  /* 2. primitives repainted */
  LiBolt.prototype.draw=function(){if(this._v)return;this._v=1;const big=(this.w||4)>=10;add(new Bolt({x:this.x,y:this.y,col:'#bfe8ff',h:big?380:300,life:.3}));
    add(new SPic({n:N('sky_strike'),x:this.x,y:this.y,w:big?150:90,life:.4,fadeIn:.001,fadeOut:.6,shadow:0,pool:LC.bolt,sortOff:8}));add(new Stain({x:this.x,y:this.y,R:big?60:34,col:'rgba(40,30,60,.35)',life:1.3}));
    add(new Shock({x:this.x,y:this.y,R:big?150:60,col:LC.bolt,w:big?16:8,life:.3}));zaps(this.x,this.y,big?8:4);if(big){punch(.05);flash.a=Math.max(flash.a,.2);flash.c=LC.bolt;}};
  LiArc.prototype.draw=function(){const a=1-this.t/this.life,[x0,y0]=scr(this.a[0],this.a[1],34),[x1,y1]=scr(this.b[0],this.b[1],30);if(!this.j)this.j=Array.from({length:5},()=>[rnd(-9,9),rnd(-9,9)]);
    const path=()=>{ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<6;i++)ctx.lineTo(lerp(x0,x1,i/6)+this.j[i-1][0],lerp(y0,y1,i/6)+this.j[i-1][1]);ctx.lineTo(x1,y1);};
    ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';path();ctx.strokeStyle='#1c1330';ctx.lineWidth=6;ctx.stroke();path();ctx.strokeStyle='#9adcff';ctx.lineWidth=3.5;ctx.stroke();path();ctx.strokeStyle='#fff';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();ctx.globalAlpha=1;};
  LiShot.prototype.draw=function(){const i=im(N(this.big?'keraunos':'thunder_javelin'));if(!i)return;const [x,y]=scr(this.x,this.y,this.z),r=aim(this.phi),w=this.big?230:130,h=w*i.naturalHeight/i.naturalWidth;
    ctx.save();ctx.translate(x,y);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);ctx.drawImage(i,-w*.8,-h/2,w,h);ctx.restore();if((this._tr=(this._tr||0)+1)%3===0)zaps(this.x,this.y,1);};
  LiEagle.prototype.draw=function(){const i=im(N('zeus_eagle'));if(!i)return;const dx=this.x-(this._px??this.x);this._px=this.x;if(Math.abs(dx)>.5)this._f=dx<0;const [x,y]=scr(this.x,this.y,this.z),w=96,h=w*i.naturalHeight/i.naturalWidth;
    ctx.save();ctx.translate(x,y);if(this._f)ctx.scale(-1,1);ctx.drawImage(i,-w*.6,-h/2,w,h);ctx.restore();};
  LiGround.prototype.draw=function(){const C=LI.cloud;if(!C)return;const [x,y]=scr(C.x,C.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,C.R);g.addColorStop(0,'rgba(30,36,70,.42)');g.addColorStop(1,'rgba(30,36,70,0)');ctx.fillStyle=g;ctx.fillRect(-C.R,-C.R,C.R*2,C.R*2);ctx.restore();};
  const LTD=LiTop.prototype.draw;LiTop.prototype.draw=function(){const pz=(player.z||0)+96*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    if(LI.glory>0)for(let i=0;i<LI_BAL.glory.cap;i++){const on=i<LI.glory,px=x+(i-1)*12,py=y-(on?LI.gloryPop*3:0);ctx.save();ctx.translate(px,py);ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4.5,0);ctx.lineTo(0,6);ctx.lineTo(-4.5,0);ctx.closePath();ctx.fillStyle=on?LIC.gold:'rgba(30,24,10,.55)';ctx.fill();ctx.strokeStyle='#1c1330';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
    if(LI.charge>0){const w=50,yy=y+10;ctx.fillStyle='rgba(10,16,30,.6)';ctx.fillRect(x-w/2,yy,w,5);ctx.fillStyle=LI.charge>=LI_BAL.charge.cap?LIC.bolt2:LIC.bolt;ctx.fillRect(x-w/2,yy,w*LI.charge/LI_BAL.charge.cap,5);}
    const C=LI.cloud;if(C){const i=im(N('storm_cloud'));if(i){const w=C.R*2.1,h=w*i.naturalHeight/i.naturalWidth,[cx,cy]=P(C.x,C.y,150);ctx.save();ctx.globalAlpha=.95;ctx.drawImage(i,cx-w/2,cy-h/2+3*Math.sin(this.t*2),w,h);ctx.restore();}}
    if(hasBuff('lbAetos')){const i=im(N('zeus_eagle'));if(i){const an=this.t*3,[ex,ey]=P(player.x+Math.cos(an)*44,player.y+Math.sin(an)*26,70),w=44,h=w*i.naturalHeight/i.naturalWidth;ctx.save();ctx.translate(ex,ey);if(Math.sin(an)>0)ctx.scale(-1,1);ctx.drawImage(i,-w/2,-h/2,w,h);ctx.restore();}}};
  /* 3. watchers */
  const live=[];const watch=(test,mk)=>live.push({test,mk,on:null});
  const aura=(n,w,test,o={})=>watch(test,()=>add(new SPic(Object.assign({n:N(n),x:player.x,y:player.y,w,ay:.9,follow:player,oy:-1,sortOff:-4,life:99,a0:.6,pulse:.2,shadow:0,until:()=>!test()},o))));
  aura('aegis_dome',140,()=>LI.aegis>0,{ay:.85,oy:6,sortOff:30,a0:.7});
  aura('nemean_hide',96,()=>hasBuff('lnHide'),{ay:.6,z:6,sortOff:8,a0:.75});
  aura('laurel_rest',110,()=>LI.restUntil>gameTime,{a0:.8});
  aura('overcharge_aura',130,()=>lOver()&&!lAsc(),{a0:.55});
  aura('ascend_aura',160,()=>lAsc(),{a0:.6});
  watch(()=>hasBuff('lcCrown'),()=>add(new GPic({n:N('laurel_circle'),x:player.x,y:player.y,w:150,follow:player,life:99,a0:.85,breathe:.02,until:()=>!hasBuff('lcCrown')})));
  watch(()=>hasBuff('lcCrown'),()=>add(new SPic({n:N('laurel_crown'),obj:1,x:player.x,y:player.y,w:54,z:100,ay:.5,follow:player,sortOff:40,life:99,shadow:0,until:()=>!hasBuff('lcCrown')})));
  watch(()=>lHeld(),()=>{const h=lHeld();return add(new HPic({n:N('grab_flash'),x:h.x,y:h.y,e:h,w:64,z:(h.boss?80:56),life:.4}));});
  A({layer:'none',_v2:1,draw(){},update(){if(CHAR!=='lion')return false;for(const w of live){const on=!!w.test();if(on&&!w.was)w.on=w.mk();w.was=on;}return true;}});
  /* 4. per-skill pictures at the release moment */
  const CAST={
    lnHide:()=>add(new Shock({x:player.x,y:player.y,R:64,col:LC.marble,w:9,life:.35})),
    lnRest:()=>add(new Pillar({x:player.x,y:player.y,follow:player,col:'#c8ffa0',w:56,h:200,life:.8})),
    lnRoar:()=>{const x=player.x,y=player.y;add(new GPic({n:N('kings_roar'),x,y,w:LB.lnRoar.R*2.4,life:.8,s0:.3,grow:1.12,add:.35}));V.release(x,y,LC.gold,{R:LB.lnRoar.R,h:240,w:80});},
    laShove:o=>{const p=o.phi??player.phi,[x,y]=[player.x+Math.cos(p)*50,player.y+Math.sin(p)*50];add(new XPic({n:N('shove_wave'),x,y,phi:p,w:170,z:24,life:.45,trail:4,speed:200}));add(new Puffs({x,y,R:80,n:5,size:9,dir:p,spread:.6,life:.6,col:'#f6efe0',edge:'#c8b896'}));},
    laLift:()=>{const h=player;add(new SPic({n:N('titan_lift'),x:player.x,y:player.y,w:140,life:.7,pool:LC.gold,sortOff:-6,shadow:0}));},
    lbOver:()=>V.release(player.x,player.y,LC.bolt,{R:120,h:320,w:80}),
    lbAegis:()=>add(new Shock({x:player.x,y:player.y,R:70,col:LC.bolt,w:10,life:.35})),
    lbWrath:()=>{add(new GPic({n:N('olympus_wrath'),x:player.x,y:player.y,w:LB.lbWrath.R*2.2,follow:player,life:LB.lbWrath.n*.18+.6,a0:.85,add:.25,breathe:.02,fadeOut:.2}));},
    lcCrown:()=>add(new Pillar({x:player.x,y:player.y,col:LC.gold,w:60,h:220,life:.7})),
    lcAscend:()=>V.release(player.x,player.y,LC.gold,{R:170,h:380,w:110}),
    lcTwelfth:()=>{const x=player.x,y=player.y,p=player.phi;setTimeout(()=>{},0);add(new SPic({n:N('twelfth_slam'),x:x+Math.cos(p)*40,y:y+Math.sin(p)*40,w:120,life:1,delay:.45,pool:LC.gold,sink:.6}));},
    lcToss:()=>{},
    lcKeraunos:()=>{add(new Pillar({x:player.x,y:player.y,col:LC.bolt,w:70,h:300,life:.5}));punch(.04);},
  };
  const wrapF=fn=>function(o){if(o&&typeof o.f==='function'){const f=o.f,k=o.key;o.f=function(){const r=f.apply(this,arguments);try{const c=CAST[k];if(c&&arguments[2]!==false)c(o);}catch(e){console.warn(e);}return r;};}
    const a=fn.apply(this,arguments);try{const ev=a&&a.windup>.1?a.windup:a&&a.events&&a.events.length?a.events[0].t:0;if(ev>=.12&&o.key!=='basic')V.charge(lCol(o.key)==='B'?LC.bolt:LC.gold,ev);}catch(_){}return a;};
  window.lBurst=lBurst=wrapF(window.lBurst);window.lPunches=lPunches=wrapF(window.lPunches);
  /* hits */
  const H=window.lHit;window.lHit=lHit=function(e,mult,key,o){const r=H.apply(this,arguments);try{if(e&&r&&(!e._lv2||gameTime-e._lv2>.07)){e._lv2=gameTime;const b=lCol(key)==='B';add(new HPic({n:N(b?'spark_hit':'dust_hit'),x:e.x,y:e.y,e,w:48,z:(e.boss?40:24)+(e.z||0)}));}}catch(_){}return r;};
}
window.installLionFx=install;
(function(){const I=window.installLion;if(typeof I==='function'&&!I._lv2){window.installLion=function(){const r=I.apply(this,arguments);try{install();}catch(e){}return r;};window.installLion._lv2=1;}})();
})();
