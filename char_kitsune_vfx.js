/* =====================================================================
   TOTEM LEGEND — Nine-tailed kitsune · skill effects v2 (owner 2026-11-19, same method as the dragon)
   Painted pictures (assets/fx/kitsune) are the main shapes; vfx25.js adds the 2.5D support.
   Old code VFX of this hero are dropped; projectiles keep their logic but are repainted with pictures
   (never spun: wheels, crescents and discs turn through code ribbons around the picture).
   ===================================================================== */
(function(){
const VV=()=>window.V25;
const N=n=>'kitsune/'+n;
const KC={fire:'#ff6a3a',fire2:'#ffb347',pink:'#ff7ab8',moon:'#c8d8ff',moon2:'#9a8cff',gold:'#ffd36a',red:'#ff4a4a',star:'#fff2b0'};
const FX=['crescent_blade','fire_hit','fire_veil','fire_wheel','flame_pillar','fox_lantern','fox_step','fox_sun','foxfire_orb','inari_bless','inari_rice','inferno_beam','lunar_circle',
  'moon_beam','moon_disc','moon_hit','moonlight_form','night_circle','nine_tail_aura','ofuda_ward','star_fall','tail_burst','torii_circle','tsukuyomi_beam','wisp_fall','yata_mirror'];
const isMoon=c=>c&&/^#(d8e4ff|b8a8ff|fff2b0|e8f0ff)/i.test(c);

function install(){const X=VV();if(!X||CHAR!=='kitsune')return;const {im,add,punch,scr,aim,ribbon,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Pillar,Pool,Speed,Charge,Stain,V,c01,eo,back}=X;
  FX.forEach(n=>im(N(n)));
  if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('kitsune');
  const flames=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'flame',col:KC.fire,col2:'#ffe08a',v0:30,v1:90,up:50,g:-30,life:.32,z:10},o)));
  const petals=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'petal',col:'#ffc8dc',col2:'#fff',v0:60,v1:160,up:180,g:260,life:1.1,z:30},o)));
  const moonBits=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'shard',col:'#e8eeff',col2:'#ffffff',v0:80,v1:200,up:220,life:.8},o)));
  const burst=(x,y,R,moon)=>{add(new Shock({x,y,R,col:moon?KC.moon:KC.fire2,w:Math.max(8,R*.1),life:.4}));add(new Pool({x,y,R:R*1.1,col:moon?KC.moon:KC.fire,life:.6,a0:.5}));moon?moonBits(x,y,6):flames(x,y,7);};

  /* 1. old visuals off */
  if(!window._kv2h){window._kv2h=1;
    const DROP=[typeof GRing!=='undefined'&&GRing,typeof Impact!=='undefined'&&Impact,typeof Streak!=='undefined'&&Streak].filter(Boolean);
    const A=window.addFx;window.addFx=addFx=function(f){if(f&&!f._v2&&DROP.some(c=>f instanceof c))return f;return A.apply(this,arguments);};
    const E=window.emit;window.emit=emit=function(o){if(o&&/^(round|spark|ember|dust|shard|frag|glint)$/.test(o.type))return;return E.apply(this,arguments);};
    window.kFireBurst=kFireBurst=function(x,y,R,col){burst(x,y,R||60,isMoon(col));if((R||0)>=100){add(new Puffs({x,y,R:R*.9,n:7,size:9,life:.6,col:'#fff0f4',edge:'#e8a8c0'}));punch(.03);}};
    window.kPow=kPow=function(e,big,col){const moon=isMoon(col);add(new HPic({n:N(moon?'moon_hit':'fire_hit'),x:e.x,y:e.y,e,w:big?72:52,z:(e.boss?40:24)+(e.z||0)}));moon?moonBits(e.x,e.y,big?4:2):flames(e.x,e.y,big?4:2);};
    /* hits: one spark per enemy per 0.07 s */
    const H=window.kHit;window.kHit=kHit=function(e,mult,key,o){const r=H.apply(this,arguments);try{if(e&&r&&(!e._kv2||gameTime-e._kv2>.07)){e._kv2=gameTime;const b=kCol(key)==='B';add(new HPic({n:N(b?'moon_hit':'fire_hit'),x:e.x,y:e.y,e,w:50,z:(e.boss?40:24)+(e.z||0)}));}}catch(_){}return r;};

    /* 2. projectiles repainted */
    KiHome.prototype.draw=function(){const i=im(N('foxfire_orb'));if(!i)return;const w=(this.r||7)*6.2,h=w*i.naturalHeight/i.naturalWidth,[x,y]=scr(this.x,this.y,this.z);ctx.save();ctx.drawImage(i,x-w/2,y-h*.55,w,h);ctx.restore();
      this._tr=(this._tr||0)+1;if(this._tr%3===0)flames(this.x,this.y,1,{v0:10,v1:40,up:30,life:.35,z:this.z,col:KC.fire2});};
    KiShot.prototype.draw=function(){const [x,y]=scr(this.x,this.y,this.z);
      if(this.kind==='wheel'){const i=im(N('fire_wheel'));if(!i)return;const w=this.w*5.2,h=w*i.naturalHeight/i.naturalWidth,r=aim(this.phi),fy=Math.cos(r)<0;ctx.save();ctx.translate(x,y);ctx.rotate(r);if(fy)ctx.scale(1,-1);ctx.drawImage(i,-w*.72,-h/2,w,h);ctx.restore();
        ribbon(this.x,this.y,this.z,this.w*.9,this.t*14,1.6,7,KC.fire2,'#ffffff',.8,true);if((this._tr=(this._tr||0)+1)%2===0)flames(this.x,this.y,1,{v0:20,v1:60,up:60,life:.45,z:6,dir:this.phi+Math.PI,spread:.6});return;}
      const disc=this.kind==='disc',i=im(N(disc?'moon_disc':'crescent_blade'));if(!i)return;const w=this.w*(disc?3.2:3),h=w*i.naturalHeight/i.naturalWidth,bob=Math.sin(this.t*10)*.05;
      ctx.save();ctx.translate(x,y);ctx.scale(1+bob,1-bob);ctx.drawImage(i,-w/2,-h/2,w,h);ctx.restore();
      for(let k=0;k<2;k++)ribbon(this.x,this.y,this.z-6,this.w*1.15,this.t*(disc?9:16)+k*Math.PI,1.7,disc?9:7,KC.moon2,'#ffffff',.7,true);
      if((this._tr=(this._tr||0)+1)%3===0)moonBits(this.x,this.y,1,{v0:10,v1:40,up:40,life:.4,z:this.z});};
    KiBeam.prototype.draw=function(){const fire=this.col===KIC.fire,big=this.w>=24,i=im(N(fire?'inferno_beam':big?'tsukuyomi_beam':'moon_beam'));if(!i)return;const k=this.t/this.life,a=k<.15?k/.15:k>.6?(1-k)/.4:1;
      const [x0,y0]=scr(this.x,this.y,34),[x1,y1]=scr(this.x+Math.cos(this.phi)*this.L,this.y+Math.sin(this.phi)*this.L,34),L=Math.hypot(x1-x0,y1-y0),r=Math.atan2(y1-y0,x1-x0),h=Math.max(26,this.w*(big?4.2:3.2))*(1+.15*Math.sin(this.t*30));
      ctx.save();ctx.globalAlpha=a;ctx.translate(x0,y0);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);ctx.drawImage(i,-h*.25,-h/2,L+h*.4,h);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.35;ctx.drawImage(i,-h*.25,-h/2,L+h*.4,h);ctx.restore();ctx.globalAlpha=1;
      if(!this._v){this._v=1;const ex=this.x+Math.cos(this.phi)*this.L,ey=this.y+Math.sin(this.phi)*this.L;add(new Pool({x:ex,y:ey,R:40,col:fire?KC.fire:KC.moon,life:.4}));fire?flames(ex,ey,3):moonBits(ex,ey,3);}};
    /* sky drops: wisps, stars, flame pillars, the fox sun; plain moon shafts become light pillars */
    KiPillar.prototype.draw=function(){const k=this.t/this.life,c=this.col,[x,y]=scr(this.x,this.y,0);
      let n=null,w=60,fall=false;if(c===KIC.fire&&this.w>=100){n='fox_sun';w=this.w*1.6;fall=true;}else if(c===KIC.fire){n='flame_pillar';w=Math.max(60,this.w*2.4);}else if(c===KIC.fire2){n='wisp_fall';w=34;fall=true;}else if(c==='#fff2b0'){n='star_fall';w=30;fall=true;}
      if(!n){/* moon shaft */if(!this._p){this._p=1;add(new Pillar({x:this.x,y:this.y,col:KC.moon,w:this.w*2.2,h:280,life:this.life+.2}));add(new HPic({n:N('moon_hit'),x:this.x,y:this.y,w:56,z:20,life:.3}));}return;}
      const i=im(N(n));if(!i)return;const h=w*i.naturalHeight/i.naturalWidth;
      if(fall){const T=Math.min(.2,this.life*.5),u=c01(this.t/T);if(u<1){const z=(1-eo(u))*320;ctx.save();ctx.globalAlpha=Math.min(1,u*4);ctx.drawImage(i,x-w/2,y-z*K-h*.9,w,h);ctx.restore();return;}
        if(!this._land){this._land=1;const big=n==='fox_sun';big?V.slam(this.x,this.y,this.w*1.1,KC.fire,{kind:'rock',dcol:'#c88a5a',shake:4,punch:.06}):burst(this.x,this.y,n==='star_fall'?40:34,n==='star_fall');
          if(big){add(new SPic({n:N('fox_sun'),x:this.x,y:this.y,w:w*.9,life:.6,ay:.8,pool:KC.fire,sink:.8}));add(new Pillar({x:this.x,y:this.y,col:KC.fire,w:120,h:300,life:.6}));}}return;}
      if(!this._sp){this._sp=1;add(new SPic({n:N(n),x:this.x,y:this.y,w,life:Math.max(.5,this.life+.25),pool:KC.fire,sink:.7}));add(new Shock({x:this.x,y:this.y,R:this.w*2,col:KC.fire2,w:10,life:.35}));add(new Crack({x:this.x,y:this.y,R:this.w*1.4,col:KC.fire2,life:1}));flames(this.x,this.y,6);}};
    const KBU=KiBeam.prototype.update;KiBeam.prototype.update=function(dt){if(!this._lx){this._lx=1;this.life=Math.max(this.life,.45);}return KBU.call(this,dt);};
    const KPU=KiPillar.prototype.update;KiPillar.prototype.update=function(dt){if(!this._lx){this._lx=1;if(this.col===KIC.fire2||this.col==='#fff2b0'||(this.col===KIC.fire&&this.w>=100))this.life=Math.max(this.life,.5);}return KPU.call(this,dt);};
    /* lasting zones on the floor + aura pieces; the tails fan above the head stays */
    KiGround.prototype.draw=function(){const g=(n,x,y,w,a)=>{const i=im(N(n));if(!i)return;const h=w*i.naturalHeight/i.naturalWidth,[px,py]=scr(x,y,0);ctx.save();ctx.globalAlpha=a;ctx.drawImage(i,px-w/2,py-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
      const T=KI.torii;if(T)g('torii_circle',T.x,T.y,KB.knTorii.R*2.3,.9*c01((T.until-gameTime)/.4));
      const C=KI.circle;if(C)g('lunar_circle',C.x,C.y,KB.kbCircle.R*2.4,.9*c01((C.until-gameTime)/.4));
      if(KI.night)g('night_circle',player.x,player.y,KB.kbNight.R*2.2,.75);
      if(hasBuff('kcGrace'))g('inari_rice',player.x,player.y,150,.8);
      for(const p of KI.petals){const [px,py]=scr(p.x,p.y,0);ctx.save();ctx.translate(px,py);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(0,0,0,0,0,p.R);gr.addColorStop(0,hexA(KC.fire,.45));gr.addColorStop(1,hexA(KC.fire,0));ctx.fillStyle=gr;ctx.fillRect(-p.R,-p.R,p.R*2,p.R*2);ctx.restore();
        if(Math.random()<.06)flames(p.x+rnd(-p.R,p.R)*.6,p.y+rnd(-p.R,p.R)*.4,1,{v0:5,v1:20,up:40,life:.5,z:2});}};
    const KT=KiTop.prototype.draw;KiTop.prototype.draw=function(){const pz=(player.z||0)+92*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
      if(kL('kaOrb')){for(let i=0;i<KI_BAL.tails.cap;i++){const an=-Math.PI*.9+i*(Math.PI*.8/8)+Math.PI*.05,px=x+Math.cos(an)*22,py=y+8+Math.sin(an)*12,on=i<KI.tails;ctx.save();ctx.translate(px,py-(on?KI.tailPop*2:0));
        ctx.beginPath();ctx.moveTo(0,-5);ctx.quadraticCurveTo(3.5,-1,2.4,2);ctx.quadraticCurveTo(0,4,-2.4,2);ctx.quadraticCurveTo(-3.5,-1,0,-5);ctx.fillStyle=on?(KI.tails>=9?KC.fire2:KC.fire):'rgba(40,20,30,.45)';ctx.fill();ctx.strokeStyle='#1c1330';ctx.lineWidth=.8;ctx.stroke();ctx.restore();}}
      if(kL('kaWisp')){const i=im(N('foxfire_orb'));if(i)for(let k=0;k<2;k++){const an=this.t*2.6+k*Math.PI,[wx,wy]=P(player.x+Math.cos(an)*34,player.y+Math.sin(an)*20,44),w=22,h=w*i.naturalHeight/i.naturalWidth;ctx.drawImage(i,wx-w/2,wy-h/2,w,h);}}
      if(KI.night){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(10,12,40,.18)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}};
    /* watcher: pieces that live as long as a buff / state does */
    const live=[];const watch=(key,test,mk)=>live.push({key,test,mk,on:null});
    watch('shield',()=>KI.shield>0&&KI.shieldUntil>gameTime,()=>add(new SPic({n:N('ofuda_ward'),x:player.x,y:player.y,w:118,ay:.66,z:4,follow:player,oy:2,sortOff:8,life:99,a0:.8,shadow:0,pool:KC.gold,until:()=>!(KI.shield>0&&KI.shieldUntil>gameTime)})));
    watch('veil',()=>hasBuff('kaVeil'),()=>add(new SPic({n:N('fire_veil'),x:player.x,y:player.y,w:KB.kaVeil.R*2.1,ay:.85,follow:player,oy:4,sortOff:20,life:99,a0:.7,pulse:.15,shadow:0,pool:KC.fire,until:()=>!hasBuff('kaVeil')})));
    watch('moon',()=>hasBuff('kbMoonlight'),()=>add(new SPic({n:N('moonlight_form'),x:player.x,y:player.y,w:110,follow:player,sortOff:6,life:99,a0:.55,pulse:.2,shadow:0,pool:KC.moon,until:()=>!hasBuff('kbMoonlight')})));
    watch('awake',()=>kAwake(),()=>add(new SPic({n:N('nine_tail_aura'),x:player.x,y:player.y,w:150,ay:.82,follow:player,oy:-1,sortOff:-4,life:99,a0:.6,pulse:.2,shadow:0,until:()=>!kAwake()})));
    watch('mirror',()=>KI.mirror,()=>{const M=KI.mirror;return add(new SPic({n:N('yata_mirror'),obj:1,x:M.x,y:M.y,w:70,life:99,pool:KC.moon,until:()=>KI.mirror!==M}));});
    const seen=new WeakSet();
    A({layer:'none',_v2:1,draw(){},update(){if(CHAR!=='kitsune')return false;for(const w of live){const on=!!w.test();if(on&&!w.was)w.on=w.mk();w.was=on;}
      for(const l of KI.lanterns)if(!seen.has(l)){seen.add(l);add(new SPic({n:N('fox_lantern'),obj:1,x:l.x,y:l.y,w:44,life:99,pool:KC.fire,sink:.5,until:()=>!KI.lanterns.includes(l)}));}
      return true;}});
  }
  /* 3. per-skill pictures at the release moment (kCast calls o.f there) */
  const CAST={
    knStep:(o,sx,sy)=>{add(new SPic({n:N('fox_step'),x:sx,y:sy,w:100,life:.9,a0:.85,shadow:.2,sink:.4}));petals(sx,sy,6);add(new Speed({x:player.x,y:player.y,phi:Math.atan2(player.y-sy,player.x-sx),life:.3,col:'#ffd0e0'}));},
    knWard:()=>add(new Shock({x:player.x,y:player.y,R:70,col:KC.gold,w:10,life:.35})),
    knBless:()=>{add(new SPic({n:N('inari_bless'),x:player.x,y:player.y,w:110,follow:player,sortOff:6,life:1.1,a0:.9,shadow:0,pool:KC.gold}));add(new Pillar({x:player.x,y:player.y,follow:player,col:'#bfffa0',w:56,h:200,life:.9}));},
    knTorii:()=>{V.slam(player.x,player.y,KB.knTorii.R,KC.red,{debris:false,crack:false,puffs:0,shake:1.5,punch:.02});petals(player.x,player.y,10);},
    kaBurst:()=>{const x=player.x,y=player.y;add(new GPic({n:N('tail_burst'),x,y,w:KB.kaBurst.R*2.4,life:.8,s0:.3,grow:1.12,add:.3}));V.release(x,y,KC.fire,{R:KB.kaBurst.R,h:240,w:80});flames(x,y,12,{v0:120,v1:260});},
    kaVeil:()=>add(new Shock({x:player.x,y:player.y,R:KB.kaVeil.R,col:KC.fire2,w:12})),
    kaInferno:()=>{add(new SPic({n:N('nine_tail_aura'),x:player.x,y:player.y,w:170,ay:.82,follow:player,sortOff:-4,life:1.2,a0:.85,pool:KC.fire,shadow:0}));V.release(player.x,player.y,KC.fire,{R:150,h:300});},
    kbMoonlight:()=>{add(new Pillar({x:player.x,y:player.y,col:KC.moon,w:70,h:300,life:.7}));moonBits(player.x,player.y,8);},
    kbNight:()=>{V.release(player.x,player.y,KC.moon2,{R:KB.kbNight.R*.6,h:360,w:100});},
    kbCircle:()=>{},
    kbMirror:()=>{},
    kcGrace:()=>{add(new Shock({x:player.x,y:player.y,R:80,col:KC.gold,w:10}));add(new Pillar({x:player.x,y:player.y,col:KC.gold,w:60,h:220,life:.7}));},
    kcAwaken:()=>{V.release(player.x,player.y,KC.fire,{R:170,h:360,w:110});petals(player.x,player.y,16);},
    kcTsukuyomi:()=>{add(new Pillar({x:player.x,y:player.y,col:KC.moon,w:80,h:340,life:.6}));punch(.05);},
  };
  if(!window._kv2c){window._kv2c=1;const KCAST=window.kCast;window.kCast=kCast=function(o){if(o&&typeof o.f==='function'){const f=o.f,k=o.key;o.f=function(a){const sx=player.x,sy=player.y,r=f.apply(this,arguments);try{CAST[k]&&CAST[k](o,sx,sy);}catch(e){console.warn(e);}return r;};}
    const a=KCAST.apply(this,arguments);try{const ev=a&&a.events&&a.events.length?a.events[0].t:0;if(ev>=.12)V.charge(kCol(o.key)==='B'?KC.moon:KC.fire,ev);}catch(_){}return a;};}
}
window.installKitsuneFx=install;
(function(){const I=window.installKitsune;if(typeof I==='function'&&!I._kv2){window.installKitsune=function(){const r=I.apply(this,arguments);try{install();}catch(e){}return r;};window.installKitsune._kv2=1;}})();
})();
