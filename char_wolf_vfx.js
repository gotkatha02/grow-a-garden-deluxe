/* =====================================================================
   TOTEM LEGEND — Wolf (Frost Raider) · skill effects v2 (owner 2026-11-19, same method as the dragon)
   Replaces wolf_fx.js. Painted pictures (assets/fx/wolf + 4 cat pieces) are the main shapes; vfx25.js adds 2.5D support.
   The wolf's old code VFX (generic index.html classes, all visual-only — checked) are dropped while the wolf is played.
   Storms and the axe cyclone are flat pictures on the floor + code ribbons; no picture is spun.
   ===================================================================== */
(function(){
const N=n=>'wolf/'+n;
const WC={red:'#ff3d4a',blood:'#c8102e',ice:'#9fe0ff',ice2:'#e8f8ff',gold:'#ffcf6a',bolt:'#bfe8ff'};
const PIC=['w01_axe','w03_hitred','w04_cyclone','w05_howl','w06_vamp','w07_rage','w08_exec','w09_parry','w10_armor','w11_frost','w13_prison','w14_rune','w15_bolt','w16_spear','w17_blizzard','w18_shatter','w19_spirit','w20_banner','w21_glacial','w22_worldstorm'];
const DROPN=['Bolt','ClawMarks','Constellation','Crack','CrackStar','Crystal','CycloneRing','Drain','FrostGround','GLight','GRing','Ghost','GroundShatter','Guillotine','Impact','JgEye','JgGlint','JgShade','LightPillar','LineCut','OrbitShards','PactAura','RuneCircle','RuneSeal','RuneShield','ScorchLine','ShadowPool','Slash','SpectralAxe','SpiralWave','Streak','TexGhost','UnbrokenFx','WindArc'];
const A_SET=new Set(['warFury','bloodCleave','savageRend','axeDance','wolfFinale','ironCounter','revengeBreaker','vampiricAxe','bloodRush','axeCyclone','cycloneLeap','executioner','predatorsLeap','valhallasWrath','reversalSlash','armorBreak','basic']);

function install(){const X=window.V25;if(!X||typeof CHAR==='undefined'||CHAR!=='wolf')return;
  const {im,add,punch,scr,aim,ribbon,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Pillar,Pool,Speed,Stain,Bolt,V,c01}=X;
  PIC.forEach(n=>im(N(n)));['09_crater','25_shock'].forEach(n=>im('cat/'+n));
  if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('wolf');
  const blood=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'drop',col:WC.blood,col2:'#ff9aa8',v0:60,v1:180,up:220,z:26,life:.8},o)));
  const ice=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'shard',col:'#d8f4ff',col2:'#ffffff',v0:80,v1:200,up:220,z:26,life:.8},o)));
  const zaps=(x,y,n)=>add(new Debris({x,y,n,kind:'zap',col:WC.bolt,col2:'#fff',v0:70,v1:180,up:180,life:.5}));
  const tgt=(c,r=200)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r,player.phi)||nearestEnemy(player.x,player.y,r);
  const W={
    slash(phi,w,kind,flip){const frost=kind==='frost',x=player.x+Math.cos(phi)*w*.25,y=player.y+Math.sin(phi)*w*.25;
      const p=add(new XPic({n:N(frost?'w11_frost':'w01_axe'),x,y,phi,w,z:30,life:.34,fadeOut:.5,trail:3}));if(p&&flip)p.fy=!p.fy;
      const ex=player.x+Math.cos(phi)*w*.45,ey=player.y+Math.sin(phi)*w*.45;frost?ice(ex,ey,3,{dir:phi,spread:.8}):blood(ex,ey,3,{dir:phi,spread:.8});},
    crater(x,y,w=170){add(new GPic({n:'cat/09_crater',x,y,w,life:1.4,s0:.6,fadeOut:.35}));V.slam(x,y,w*.55,WC.gold,{kind:'rock',dcol:'#cfc6b8',dust:'#f4f0ff',dustE:'#c2b6e0'});},
    bolt(x,y,h=170){add(new Bolt({x,y,col:WC.bolt,h:h*1.6,life:.3}));add(new SPic({n:N('w15_bolt'),x,y,w:h*.6,life:.35,fadeIn:.001,fadeOut:.6,shadow:0,pool:WC.bolt,sortOff:8}));add(new Shock({x,y,R:h*.35,col:WC.bolt,w:8,life:.3}));add(new Stain({x,y,R:30,col:'rgba(30,40,70,.35)',life:1.2}));zaps(x,y,4);},
    shatter(x,y,w=110){add(new SPic({n:N('w18_shatter'),x,y,w,ay:.8,life:.5,fadeIn:.001,fadeOut:.6,shadow:.2,pool:WC.ice,sink:.4}));add(new Shock({x,y,R:w*.55,col:WC.ice,w:10,life:.35}));ice(x,y,6);},
    storm(n,x,y,R,dur,o={}){add(new GPic({n:N(n),x,y,w:R*2.1,life:dur,s0:.4,a0:.9,fadeOut:.15,breathe:.02,add:.15,follow:o.follow}));
      add(new Whirl({x,y,R:R*.8,n:4,w:20,col:o.col||'#cfeaff',col2:'#ffffff',life:dur,spd:o.spd||5,follow:o.follow}));
      if(o.funnel)add(new Whirl({x,y,R:R*.5,n:3,w:13,col:o.col||'#e8f6ff',col2:'#fff',life:dur,spd:(o.spd||5)*1.4,h:o.funnel,a0:.55,follow:o.follow}));},
  };
  const AT={
    reversalSlash:()=>W.slash(player.phi,130,'axe',1),
    bloodCleave:()=>W.slash(player.phi,150,'axe'),
    savageRend:()=>W.slash(player.phi,140,'axe',1),
    axeDance:()=>{for(let i=0;i<3;i++)setFxTimer(i*.12,()=>W.slash(player.phi+rnd(-.4,.4),130,'axe',i%2));},
    wolfFinale:()=>{W.slash(player.phi,170,'axe');W.crater(player.x+Math.cos(player.phi)*40,player.y+Math.sin(player.phi)*40,170);},
    revengeBreaker:c=>{W.slash(player.phi,160,'axe');const t=tgt(c);if(t)add(new HPic({n:N('w03_hitred'),x:t.x,y:t.y,e:t,w:110,z:30,life:.3}));},
    vampiricAxe:()=>{W.slash(player.phi,140,'axe');add(new SPic({n:N('w06_vamp'),x:player.x,y:player.y,w:90,follow:player,sortOff:-4,life:.9,a0:.85,shadow:0,pool:WC.red}));},
    armorBreak:c=>{const t=tgt(c);W.slash(player.phi,130,'axe');if(t){add(new HPic({n:N('w10_armor'),x:t.x,y:t.y,e:t,w:t.boss?140:100,z:30,life:.55}));add(new Debris({x:t.x,y:t.y,n:6,kind:'rock',col:'#a8a8b8',col2:'#fff',v0:80,v1:200,up:240,z:30}));}},
    executioner:c=>{const t=tgt(c)||player;add(new SPic({n:N('w08_exec'),x:t.x,y:t.y,w:t.boss?115:90,life:.55,fadeIn:.001,pool:WC.red,sink:.5}));W.crater(t.x,t.y,150);flash.a=Math.max(flash.a,.2);flash.c=WC.red;},
    cycloneLeap:()=>W.crater(player.x,player.y,170),
    ironCounter:()=>add(new SPic({n:N('w09_parry'),x:player.x+Math.cos(player.phi)*24,y:player.y+Math.sin(player.phi)*24,w:80,ay:.6,z:10,life:.5,fadeIn:.001,shadow:0,pool:WC.gold})),
    warHowl:()=>{add(new SPic({n:N('w05_howl'),x:player.x,y:player.y,w:130,ay:.75,z:20,follow:player,sortOff:-4,life:.9,shadow:0}));V.release(player.x,player.y,WC.gold,{R:160,h:240,w:80});},
    warFury:()=>{add(new SPic({n:N('w05_howl'),x:player.x,y:player.y,w:110,ay:.75,z:20,follow:player,sortOff:-4,life:.7,shadow:0}));add(new Shock({x:player.x,y:player.y,R:90,col:WC.red,w:12}));},
    bloodRush:()=>{add(new Shock({x:player.x,y:player.y,R:80,col:WC.red,w:12}));blood(player.x,player.y,6);},
    predatorsLeap:()=>{add(new XPic({n:N('w19_spirit'),x:player.x,y:player.y,phi:player.phi,w:150,z:40,life:.45,trail:5}));setFxTimer(.3,()=>W.crater(player.x,player.y,160));},
    valhallasWrath:c=>{const t=tgt(c,260)||player;add(new SPic({n:N('w07_rage'),x:player.x,y:player.y,w:130,follow:player,sortOff:-4,life:1,a0:.8,shadow:0}));
      setFxTimer(.15,()=>{add(new SPic({n:N('w08_exec'),x:t.x,y:t.y,w:t.boss?150:125,life:.6,fadeIn:.001,pool:WC.red,sink:.5}));W.crater(t.x,t.y,220);V.release(t.x,t.y,WC.red,{R:160,h:300,w:90});});},
    frostFang:()=>W.slash(player.phi,140,'frost'),
    iceBreak:c=>{const t=tgt(c);W.slash(player.phi,130,'frost',1);if(t)W.shatter(t.x,t.y,t.boss?150:110);},
    runeBurst:()=>{add(new GPic({n:N('w14_rune'),x:player.x,y:player.y,w:200,life:.8,s0:.4,grow:1.1,add:.35}));W.shatter(player.x,player.y,150);V.release(player.x,player.y,WC.ice,{R:120,h:220,w:70});},
    runeGuard:()=>add(new Shock({x:player.x,y:player.y,R:80,col:WC.ice,w:10})),
    thunderFang:c=>{const t=tgt(c,240);W.slash(player.phi,130,'frost');if(t)W.bolt(t.x,t.y,150);},
    lightningPursuit:c=>{const t=tgt(c,300);if(t)W.bolt(t.x,t.y,170);},
    stormStep:()=>{W.bolt(player.x,player.y,140);add(new Speed({x:player.x,y:player.y,phi:player.phi,life:.3,col:WC.bolt}));},
    shatterPulse:()=>{W.shatter(player.x,player.y,180);V.slam(player.x,player.y,140,WC.ice,{kind:'shard',dcol:'#d8f4ff',crack:false});},
    frozenDescent:()=>{W.crater(player.x,player.y,170);W.shatter(player.x,player.y,170);},
    thunderSpear:c=>{const t=tgt(c,320),phi=t?angTo(t):player.phi,L=t?Math.hypot(t.x-player.x,t.y-player.y):200;
      add(new XPic({n:N('w16_spear'),x:player.x+Math.cos(phi)*L*.5,y:player.y+Math.sin(phi)*L*.5,phi,w:Math.max(150,L),z:34,life:.35,trail:2}));if(t)setFxTimer(.1,()=>W.bolt(t.x,t.y,160));},
    icePrison:c=>{const x=c.gx??player.x,y=c.gy??player.y,r=(typeof prisonR==='function'?prisonR():70);add(new SPic({n:N('w13_prison'),obj:1,x,y,w:r*1.8,ay:.9,life:2.6,a0:.95,pool:WC.ice,sink:.6}));W.shatter(x,y,r*2);},
    runeStorm:c=>{const x=c.gx??player.x,y=c.gy??player.y,r=70+10*(LV.runeStorm||1);add(new GPic({n:N('w14_rune'),x,y,w:r*2.4,life:1.6,s0:.4,fadeOut:.3,add:.3,breathe:.02}));for(let i=0;i<4;i++)setFxTimer(.2+i*.25,()=>W.bolt(x+rnd(-r,r)*.6,y+rnd(-r,r)*.4,140));},
    blizzard:c=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.blizzard||1,r=100+15*lv,dur=2.4+.4*lv;W.storm('w17_blizzard',x,y,r,dur,{funnel:130});
      let k=0;const T=()=>{if(k++>dur*6)return;ice(x+rnd(-r,r)*.7,y+rnd(-r,r)*.5,2,{up:80,v0:30,v1:90,z:60});setFxTimer(.16,T);};T();skyDarkT=Math.max(skyDarkT,.45);setFxTimer(dur,()=>{skyDarkT=0;});},
    tempestField:c=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.tempestField||1,r=120+10*lv;add(new GPic({n:N('w14_rune'),x,y,w:r*2.3,life:4,s0:.4,a0:.85,fadeOut:.1,add:.2,breathe:.02}));for(let i=0;i<10;i++)setFxTimer(.2+i*.38,()=>W.bolt(x+rnd(-r,r)*.7,y+rnd(-r,r)*.5,140));},
    ragnaroksJudgment:()=>{const x=player.x,y=player.y;W.storm('w22_worldstorm',x,y,200,2.6,{funnel:190,spd:6});V.release(x,y,WC.ice,{R:200,h:400,w:120});skyDarkT=Math.max(skyDarkT,.7);setFxTimer(2.6,()=>{skyDarkT=0;});for(let i=0;i<10;i++)setFxTimer(.2+i*.22,()=>W.bolt(x+rnd(-170,170),y+rnd(-110,110),170));},
    runicDetonation:c=>{const t=tgt(c,260)||player;add(new GPic({n:N('w14_rune'),x:t.x,y:t.y,w:130,life:.6,s0:.4,add:.4}));setFxTimer(.15,()=>{W.shatter(t.x,t.y,150);V.release(t.x,t.y,WC.ice,{R:110,h:240,w:70});});},
    ravenousLeap:()=>{add(new XPic({n:N('w19_spirit'),x:player.x,y:player.y,phi:player.phi,w:150,z:40,life:.5,trail:5}));setFxTimer(.3,()=>W.crater(player.x,player.y,150));},
    frostbloodPact:()=>{add(new SPic({n:N('w06_vamp'),x:player.x,y:player.y,w:90,follow:player,sortOff:-4,life:.9,shadow:0,pool:WC.red}));W.shatter(player.x,player.y,120);},
    warBanner:()=>{window._wBAN={x:player.x+18,y:player.y-6};V.slam(player.x+18,player.y-6,70,WC.gold,{debris:false,crack:false,puffs:4,shake:1.5,punch:.02});},
    fenrirsSpirit:()=>{add(new SPic({n:N('w19_spirit'),x:player.x,y:player.y,w:180,ay:.7,life:.8,shadow:0,pool:WC.ice}));V.release(player.x,player.y,WC.ice,{R:140,h:300});},
    axeCyclone:(c,a)=>{const dur=Math.max(.6,(a.dur||1)*.95);add(new GPic({n:N('w04_cyclone'),x:player.x,y:player.y,w:200,follow:player,life:dur,s0:.5,a0:.9,fadeOut:.2,add:.2}));
      add(new Whirl({x:player.x,y:player.y,follow:player,R:90,n:4,w:22,col:'#ff8a90',col2:'#ffe8e8',life:dur,spd:-12,dir:-1}));
      let k=0;const T=()=>{if(k++>dur*8)return;blood(player.x+rnd(-70,70),player.y+rnd(-40,40),1,{up:120});setFxTimer(.12,T);};T();},
    battleStep:()=>add(new Puffs({x:player.x,y:player.y,R:30,n:3,size:9,life:.5})),
  };
  if(!window._wv2h){window._wv2h=1;
    /* 1. old visuals off (wolf only) */
    const DROP=DROPN.map(n=>{try{return eval(n);}catch(e){return null;}}).filter(c=>typeof c==='function');
    const A=window.addFx;window.addFx=addFx=function(f){if(CHAR==='wolf'&&f&&!f._v2&&DROP.some(c=>f instanceof c))return f;return A.apply(this,arguments);};
    const E=window.emit;window.emit=emit=function(o){if(CHAR==='wolf'&&o&&/^(round|spark|ember|dust|shard|frag|glint|snow|mist)$/.test(o.type))return;return E.apply(this,arguments);};
    if(typeof dustPuff==='function'){window.dustPuff=dustPuff=function(x,y,n,col,spd){add(new Puffs({x,y,R:(spd||60)*.9,n:Math.max(2,Math.round((n||4)*.6)),size:9,life:.6}));};}
    /* projectiles with gameplay: repaint only */
    if(typeof CrescentWave!=='undefined')CrescentWave.prototype.draw=function(){const i=im(N('w11_frost'));if(!i)return;const k=this.d/this.max,a=Math.max(0,1-Math.max(0,k-.6)/.4)*(1-(this.fade||0)),x=this.x+Math.cos(this.phi)*this.d,y=this.y+Math.sin(this.phi)*this.d,[px,py]=scr(x,y,30),r=aim(this.phi),w=120,h=w*i.naturalHeight/i.naturalWidth;
      ctx.save();ctx.globalAlpha=a;ctx.translate(px,py);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);ctx.drawImage(i,-w/2,-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
    if(typeof FrostWave!=='undefined')FrostWave.prototype.draw=function(){const i=im(N('w21_glacial'));if(!i)return;const a=Math.max(0,1-(this.fade||0)),[x0,y0]=scr(this.x,this.y,0),[x1,y1]=scr(this.x+Math.cos(this.phi)*this.d,this.y+Math.sin(this.phi)*this.d,0),L=Math.hypot(x1-x0,y1-y0);if(L<4)return;
      const h=Math.max(30,this.half*1.2);ctx.save();ctx.globalAlpha=a;ctx.translate(x0,y0);ctx.rotate(Math.atan2(y1-y0,x1-x0));ctx.drawImage(i,0,-h/2,L,h);ctx.restore();ctx.globalAlpha=1;};
    if(typeof FrostPath!=='undefined')FrostPath.prototype.draw=function(){const i=im(N('w21_glacial'));if(!i)return;const a=c01((this.life-this.t)/.4)*c01(this.t/.15),[x0,y0]=scr(this.x,this.y,0),[x1,y1]=scr(this.x+Math.cos(this.phi)*this.len,this.y+Math.sin(this.phi)*this.len,0),L=Math.hypot(x1-x0,y1-y0);
      ctx.save();ctx.globalAlpha=a*.95;ctx.translate(x0,y0);ctx.rotate(Math.atan2(y1-y0,x1-x0));ctx.drawImage(i,0,-this.w*.6,L,this.w*1.2);ctx.restore();ctx.globalAlpha=1;};
    /* 2. watchers: rage, rune guard, banner, fenrir */
    const live=[];const watch=(test,mk)=>live.push({test,mk,on:null});
    watch(()=>hasBuff('warFury'),()=>add(new SPic({n:N('w07_rage'),x:player.x,y:player.y,w:110,ay:.9,follow:player,oy:2,sortOff:-4,life:99,a0:.75,pulse:.2,shadow:0,until:()=>!hasBuff('warFury')})));
    watch(()=>hasBuff('runeGuard'),()=>add(new GPic({n:N('w14_rune'),x:player.x,y:player.y,w:130,follow:player,life:99,a0:.85,breathe:.03,add:.2,until:()=>!hasBuff('runeGuard')})));
    watch(()=>hasBuff('banner')&&window._wBAN,()=>{const B=window._wBAN;return add(new SPic({n:N('w20_banner'),obj:1,x:B.x,y:B.y,w:56,ay:.96,life:99,shadow:.3,pool:WC.gold,until:()=>!hasBuff('banner')||window._wBAN!==B}));});
    watch(()=>hasBuff('fenrir'),()=>add(new SPic({n:N('w19_spirit'),x:player.x,y:player.y,w:100,ay:.6,z:24,follow:player,ox:-30,sortOff:-10,life:99,a0:.45,pulse:.2,shadow:0,until:()=>!hasBuff('fenrir')})));
    A({layer:'none',_v2:1,draw(){},update(){if(CHAR!=='wolf')return false;for(const w of live){const on=!!w.test();if(on&&!w.was)w.on=w.mk();w.was=on;}return true;}});
    /* 3. hits */
    const h0=hurt;let last=0;
    hurt=function(e,mult,o={}){const wasDead=e&&e.dead;const r=h0.apply(this,arguments);if(CHAR!=='wolf'||!e||wasDead||!r||(o&&o.dot))return r;
      const k=(o&&o.skill)||(o&&o.auto?'basic':null)||window.SKCTX||'basic';if(gameTime-last<.035&&!(o&&o.big))return r;last=gameTime;const z=(e.boss?40:26)+rnd(-6,8);
      if(!A_SET.has(k)){add(new HPic({n:N('w18_shatter'),x:e.x,y:e.y,e,w:e.boss?70:50,z,life:.22}));ice(e.x,e.y,2,{v0:40,v1:120,up:160});}
      else{add(new HPic({n:N('w03_hitred'),x:e.x,y:e.y,e,w:(o&&o.big?80:56)*(e.boss?1.3:1),z,life:.22}));blood(e.x,e.y,2,{v0:40,v1:120,up:160});}
      return r;};
    /* 4. normal attack: painted axe swing */
    if(typeof mkBasic==='function'){const mb=mkBasic;mkBasic=function(t){const a=mb.apply(this,arguments);if(a&&a.events){const tt=Math.max(.02,(a.windup||.1)-.03);const fl=(player.basicIdx||0)%2;a.events.push({t:tt,f:()=>W.slash(player.phi,110,'axe',fl)});}return a;};}
  }
  /* 5. per-skill moments at the contact time (+ a charge-up for longer wind-ups) */
  for(const k in AT){const sk=SKILLS[k]||(typeof CSK!=='undefined'&&CSK[k]);if(!sk||!sk.make||sk._wv2)continue;const mk=sk.make;sk._wv2=1;
    sk.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){const t=Math.max(.02,Math.min(a.windup||.02,(a.dur||1)-.02));if(t>=.12&&!(c&&c.gx!=null&&(SKILLS[k]||{}).type==='ground'))V.charge(A_SET.has(k)?WC.red:WC.ice,t);a.events.push({t,f:()=>{try{AT[k](c||{},a);}catch(e){console.error('wolf v2 '+k+': '+e);}}});}return a;};}
  /* painted skill icons (assets/icons/wolf/<key>.webp); a missing file keeps the old icon */
  if(typeof SKILL_ICON_ART!=='undefined'&&!window._wv2i){window._wv2i=1;const all=Object.assign({},SKILLS,typeof CSK!=='undefined'?CSK:{});
    for(const k in all){const sk=all[k];if(!sk||!sk.name)continue;const src='assets/icons/wolf/'+k+'.webp',ic=new Image();
      ic.onload=()=>{SKILL_ICON_ART[sk.name]=src;if(typeof renderSkillTree==='function'&&document.getElementById('skwin')&&document.getElementById('skwin').offsetParent)try{renderSkillTree();}catch(_){}};ic.src=src;}}
}
window.installWolfFx=install;
})();
