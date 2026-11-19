/* =====================================================================
   TOTEM LEGEND — Anubis jackal · skill effects v2 (owner 2026-11-19, same method as the dragon)
   Painted pictures (assets/fx/anubis) are the main shapes; vfx25.js adds the 2.5D support.
   Spins (Sandstorm Spin, Wheel of Ra, Duat Cyclone, flail swings) are code ribbons on the floor
   around the hero — the pictures are never rotated.
   ===================================================================== */
(function(){
const N=n=>'anubis/'+n;
const AC={sand:'#e8c87a',gold:'#ffd36a',sun:'#ff9a2a',soul:'#9a6aff',blue:'#6a8aff',dark:'#5a3a8a'};
const FX=['anubis_head','avatar_aura','binding_chains','chain_guard','chain_lasso','duat_cyclone','dust_devil','flail_sweep','heart_crush','judgment_strike','linen_wraps','lunge_dash','meteor_crater',
  'ra_sun','rebirth','rite_glow','sand_hit','sand_spin','scale_breaker','scales_hall','shadow_gate','sin_mark','soul_hit','soul_hook','standard_circle','sun_wheel'];
const cIs=(c,...L)=>L.includes(c);

function install(){const X=window.V25;if(!X||CHAR!=='anubis')return;const {im,add,punch,scr,aim,ribbon,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Sweep,Pillar,Pool,Speed,Stain,V,c01,eo}=X;
  FX.forEach(n=>im(N(n)));if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('anubis');
  const sand=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'rock',col:'#d8b070',col2:'#fff4d0',v0:80,v1:200,up:240,life:.9},o)));
  const souls=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'shard',col:'#b890ff',col2:'#ffffff',v0:60,v1:160,up:200,life:.7},o)));
  const dust=(x,y,R,n)=>add(new Puffs({x,y,R,n:n||7,size:Math.min(11,R*.09),life:.65,col:'#f4e2b8',edge:'#c8a060'}));
  if(!window._av2h){window._av2h=1;
    /* 1. old visuals off */
    const DROP=[typeof GRing!=='undefined'&&GRing,typeof Impact!=='undefined'&&Impact,typeof Streak!=='undefined'&&Streak].filter(Boolean);
    const A=window.addFx;window.addFx=addFx=function(f){if(f&&!f._v2&&DROP.some(c=>f instanceof c))return f;return A.apply(this,arguments);};
    const E=window.emit;window.emit=emit=function(o){if(o&&/^(round|spark|ember|dust|shard|frag|glint)$/.test(o.type))return;return E.apply(this,arguments);};
    window.dustPuff=dustPuff=function(x,y,n,col,spd){dust(x,y,(spd||60)*.9,Math.max(2,Math.round((n||4)*.6)));};
    window.uBurst=uBurst=function(x,y,R,col){R=R||60;if(col==='#6a3aa8'){add(new GPic({n:N('shadow_gate'),x,y,w:Math.max(110,R*2.4),life:.8,s0:.4,add:.25}));souls(x,y,6);return;}
      add(new Shock({x,y,R,col:col===AC.sun?AC.sun:AC.gold,w:Math.max(8,R*.1),life:.42}));dust(x,y,R*.9,8);sand(x,y,Math.min(10,4+R/20));if(R>=100)punch(.03);};
    window.uPow=uPow=function(e,big,col){const soul=cIs(col,AC.blue,'#3a6ad8','#6a4aa8');add(new HPic({n:N(soul?'soul_hit':'sand_hit'),x:e.x,y:e.y,e,w:big?74:54,z:(e.boss?40:24)+(e.z||0)}));soul?souls(e.x,e.y,big?4:2):sand(e.x,e.y,big?4:2,{v0:40,v1:120,up:160});};
    const R0=window.uRoot;window.uRoot=uRoot=function(e,T){const r=R0.apply(this,arguments);try{if(e&&!e.dead)add(new SPic({n:N('binding_chains'),obj:1,x:e.x,y:e.y,w:(e.boss?120:80),ay:.8,follow:e,sortOff:6,life:Math.max(.6,T),a0:.9,shadow:.2,pool:AC.gold,sink:.5}));}catch(_){}return r;};
    /* 2. primitives repainted */
    USwing.prototype.draw=function(){const k=eo(Math.min(1,this.t/this.life)),a=this.a0+(this.a1-this.a0)*k,sw=this.a1-this.a0,dir=sw>=0?1:-1,trail=Math.min(Math.abs(sw)*k,2.2);
      ribbon(player.x,player.y,22,this.R,a-dir*trail,dir*trail,Math.max(16,this.R*.22),this.col===AC.sand?'#f0d090':'#ffd36a','#ffffff',.85*(1-this.t/this.life*.6),true);
      const bx=player.x+Math.cos(a)*this.R,by=player.y+Math.sin(a)*this.R;uChain(player.x,player.y,bx,by,30);uBall(bx,by,30,8);
      if(!this._d&&this.t>this.life*.5){this._d=1;dust(bx,by,30,2);}};
    UThrow.prototype.draw=function(){const hook=this.speed>=900,i=im(N(hook?'soul_hook':'chain_lasso'));const [x0,y0]=scr(player.x,player.y,30),[x1,y1]=scr(this.x,this.y,30),L=Math.hypot(x1-x0,y1-y0);
      if(!i||L<6){uChain(player.x,player.y,this.x,this.y,30);uBall(this.x,this.y,30,9);return;}const r=Math.atan2(y1-y0,x1-x0),h=Math.max(28,i.naturalHeight/i.naturalWidth*Math.max(L,140));
      ctx.save();ctx.translate(x0,y0);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);ctx.drawImage(i,0,-h/2,L+h*.35,h);ctx.restore();};
    UPillar.prototype.draw=function(){if(this._v)return;this._v=1;const x=this.x,y=this.y,c=this.col;
      if(c===AC.sun&&this.w>=100){/* Ra's sun falls and lands */const T=.22,sz=this.w*1.5;add(new FallPic({n:N('ra_sun'),x,y,w:sz,T,onLand:()=>{V.slam(x,y,this.w*1.2,AC.sun,{kind:'rock',dcol:'#c88a40',shake:4,punch:.06});add(new GPic({n:N('meteor_crater'),x,y,w:this.w*2.6,life:1.4,s0:.5,fadeOut:.4}));add(new Pillar({x,y,col:AC.sun,w:130,h:320,life:.6}));}}));return;}
      if(c===AC.sand){add(new GPic({n:N('meteor_crater'),x,y,w:Math.max(160,this.w*4.2),life:1.1,s0:.45,fadeOut:.4}));V.slam(x,y,this.w*2.6,AC.gold,{kind:'rock',dcol:'#d0a868',dust:'#f4e2b8',dustE:'#c8a060',shake:2.6});return;}
      if(cIs(c,AC.blue,'#3a6ad8')){add(new SPic({n:N('heart_crush'),x,y,w:96,life:.7,pool:AC.soul,sink:.6}));add(new Shock({x,y,R:70,col:AC.soul,w:10,life:.35}));souls(x,y,6);return;}
      if(c===AC.gold){add(new SPic({n:N('judgment_strike'),x,y,w:Math.max(90,this.w*1.9),life:.75,pool:AC.gold,sink:.6}));add(new Pillar({x,y,col:AC.gold,w:this.w*1.4,h:300,life:.5}));add(new Shock({x,y,R:this.w*1.6,col:AC.gold,w:12,life:.4}));punch(.03);return;}
      if(c==='#3a2a5a'){if(this.w>=80){add(new SPic({n:N('anubis_head'),x,y,w:150,ay:.8,life:.9,pool:AC.soul,sink:.6}));V.slam(x,y,110,AC.soul,{kind:'shard',dcol:'#b890ff',dust:'#e8d8ff',dustE:'#9a7ac8',shake:4});}
        else{add(new HPic({n:N('soul_hit'),x,y,w:60,z:24}));souls(x,y,3);}return;}
      add(new Pillar({x,y,col:c||AC.sun,w:this.w*1.6,h:260,life:.45}));};
    /* lasting pieces on the floor / around the hero */
    UGround.prototype.draw=function(){const g=(n,x,y,w,a)=>{const i=im(N(n));if(!i)return;const h=w*i.naturalHeight/i.naturalWidth,[px,py]=scr(x,y,0);ctx.save();ctx.globalAlpha=a;ctx.drawImage(i,px-w/2,py-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
      const S=ANU.standard;if(S){g('standard_circle',S.x,S.y,UK.anStandard.R*2.3,.9*c01((S.until-gameTime)/.4));const [x,y]=scr(S.x,S.y,0);ctx.fillStyle='#8a6a2e';ctx.fillRect(x-1.5,y-70,3,70);ctx.fillStyle=AC.gold;ctx.beginPath();ctx.moveTo(x,y-84);ctx.lineTo(x+8,y-72);ctx.lineTo(x-8,y-72);ctx.closePath();ctx.fill();}
      const s=ANU.spin;if(s)g(s.wheel?'sun_wheel':'sand_spin',player.x,player.y,s.R*(s.wheel?1.5:2.3),s.wheel?.45:.8);
      if(ANU.gateT>gameTime)g('shadow_gate',player.x,player.y,120,.9);
      if(hasBuff('acRebirth'))g('rebirth',player.x,player.y,140,.75);};
    const UTD=UTop.prototype.draw;UTop.prototype.draw=function(){const pz=(player.z||0)+86*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
      if(uL('aaSweep'))for(let i=0;i<ANU_BAL.mom.cap;i++){const on=i<ANU.mom,px=x-16+i*8;ctx.save();ctx.translate(px,y-(on?ANU.momPop*2:0));ctx.beginPath();ctx.moveTo(0,-4.5);ctx.lineTo(3.5,0);ctx.lineTo(0,4.5);ctx.lineTo(-3.5,0);ctx.closePath();ctx.fillStyle=on?(ANU.mom>=5?AC.sun:AC.gold):'rgba(40,30,20,.45)';ctx.fill();ctx.strokeStyle='#1c1330';ctx.lineWidth=.8;ctx.stroke();ctx.restore();}
      const c=ANU.cond;if(c&&!c.dead&&ANU.sin>0){const [cx,cy]=P(c.x,c.y,(c.boss?72:52)*(c.sc||1));for(let i=0;i<ANU.sin;i++){const px=cx-8+i*8;ctx.fillStyle='#d8c8ff';ctx.strokeStyle='#1c1330';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(px,cy-5-ANU.sinPop*2);ctx.lineTo(px+3,cy);ctx.lineTo(px,cy+5);ctx.lineTo(px-3,cy);ctx.closePath();ctx.fill();ctx.stroke();}}
      const s=ANU.spin;if(s){for(let i=0;i<2;i++){const a=this.t*16+i*Math.PI,bx=player.x+Math.cos(a)*s.R*.8,by=player.y+Math.sin(a)*s.R*.8;uChain(player.x,player.y,bx,by,30);uBall(bx,by,30,s.wheel?14:9,s.wheel?AC.sun:AC.gold);}}};
    /* watchers: pieces that live while a state lasts */
    const live=[];const watch=(test,mk)=>live.push({test,mk,on:null});
    watch(()=>ANU.shield>0&&ANU.shieldUntil>gameTime,()=>add(new SPic({n:N('linen_wraps'),x:player.x,y:player.y,w:104,ay:.7,z:4,follow:player,oy:2,sortOff:8,life:99,a0:.8,shadow:0,until:()=>!(ANU.shield>0&&ANU.shieldUntil>gameTime)})));
    watch(()=>ANU.guard>0&&ANU.guardUntil>gameTime,()=>add(new GPic({n:N('chain_guard'),x:player.x,y:player.y,w:150,follow:player,life:99,a0:.9,breathe:.03,until:()=>!(ANU.guard>0&&ANU.guardUntil>gameTime)})));
    watch(()=>uAvatar(),()=>add(new SPic({n:N('avatar_aura'),x:player.x,y:player.y,w:150,ay:.9,follow:player,oy:-1,sortOff:-4,life:99,a0:.55,pulse:.2,shadow:0,until:()=>!uAvatar()})));
    watch(()=>ANU.spin,()=>{const S=ANU.spin;return add(new Whirl({x:player.x,y:player.y,follow:player,R:S.R*.75,n:4,w:16,col:S.wheel?'#ffb040':'#f0d090',col2:'#fff8e0',life:99,spd:9,until:()=>ANU.spin!==S}));});
    watch(()=>ANU.cond&&!ANU.cond.dead&&ANU.sin>0,()=>{const c=ANU.cond;return add(new SPic({n:N('sin_mark'),obj:1,x:c.x,y:c.y,w:44,z:(c.boss?100:76),ay:.5,follow:c,sortOff:30,life:99,a0:.85,shadow:0,pulse:.2,until:()=>ANU.cond!==c||c.dead||ANU.sin<=0}));});
    const seen=new WeakSet();
    A({layer:'none',_v2:1,draw(){},update(){if(CHAR!=='anubis')return false;for(const w of live){const on=!!w.test();if(on&&!w.was)w.on=w.mk();w.was=on;}
      for(const D of ANU.devils)if(!seen.has(D)){seen.add(D);add(new SPic({n:N('dust_devil'),obj:1,x:D.x,y:D.y,w:UK.acDevil.R*1.6,follow:D,life:99,a0:.9,shadow:.3,pool:AC.sand,sink:.5,until:()=>!ANU.devils.includes(D)}));
        add(new Whirl({x:D.x,y:D.y,follow:D,R:UK.acDevil.R*.6,n:3,w:10,col:'#f0d090',col2:'#fff',life:99,spd:10,until:()=>!ANU.devils.includes(D)}));}
      return true;}});
    /* 3. per-skill pictures at the release moment */
    const CAST={
      anLunge:(o,sx,sy)=>{const p=Math.atan2(player.y-sy,player.x-sx);add(new XPic({n:N('lunge_dash'),x:player.x,y:player.y,phi:p,w:190,z:22,life:.4,trail:5}));add(new Speed({x:player.x,y:player.y,phi:p,life:.3,col:'#fff0c0'}));add(new Stain({x:sx,y:sy,R:40,col:'rgba(120,90,40,.25)',life:1.2}));},
      anRite:()=>{add(new SPic({n:N('rite_glow'),x:player.x,y:player.y,w:120,follow:player,sortOff:6,life:1,a0:.9,shadow:0,pool:'#bfffa0'}));add(new Pillar({x:player.x,y:player.y,follow:player,col:'#bfffa0',w:56,h:200,life:.8}));},
      anStandard:()=>V.slam(player.x,player.y,UK.anStandard.R,AC.sun,{debris:false,crack:false,puffs:0,shake:1.5,punch:.02}),
      anWraps:()=>add(new Shock({x:player.x,y:player.y,R:60,col:'#f4ead2',w:8,life:.3})),
      aaCyclone:()=>{const x=player.x,y=player.y,R=UK.aaCyclone.R;add(new SPic({n:N('duat_cyclone'),x,y,w:R*1.9,life:.9,pool:AC.sand,sink:.6,shadow:.3}));add(new Whirl({x,y,R:R*.8,n:5,w:20,col:'#f0d090',col2:'#fff',life:.8,spd:10}));add(new Whirl({x,y,R:R*.5,n:3,w:12,col:'#f0d090',col2:'#fff',life:.8,spd:12,h:110,a0:.6}));},
      aaGuard:()=>add(new Shock({x:player.x,y:player.y,R:80,col:AC.gold,w:10,life:.3})),
      aaWheel:()=>V.release(player.x,player.y,AC.sun,{R:150,h:320,w:90}),
      aaMeteor:()=>{},
      abBind:()=>{},
      abGate:()=>{},
      abHall:o=>{const t=ANU.cond;if(!t||t.dead)return;add(new SPic({n:N('scales_hall'),obj:1,x:t.x,y:t.y-30,w:220,life:UK.abHall.n*.5+.8,a0:.95,pool:AC.gold,sink:.5,sortOff:-40}));V.release(t.x,t.y,AC.gold,{R:120,h:360,w:90});},
      acBreaker:o=>{const p=player.phi,[x,y]=[player.x+Math.cos(p)*UK.acBreaker.len*.5,player.y+Math.sin(p)*UK.acBreaker.len*.5];add(new XPic({n:N('scale_breaker'),x,y,phi:p,w:UK.acBreaker.len*1.05,z:4,layer:'ground',life:.9,fadeOut:.5,trail:1}));
        for(let i=1;i<=4;i++)add(new Crack({x:player.x+Math.cos(p)*UK.acBreaker.len*i/5,y:player.y+Math.sin(p)*UK.acBreaker.len*i/5,R:40,n:5,col:AC.soul,life:1.2}));shake(2);},
      acRebirth:()=>{add(new Pillar({x:player.x,y:player.y,col:'#bfffa0',w:70,h:260,life:.8}));add(new Shock({x:player.x,y:player.y,R:90,col:'#bfffa0',w:10}));},
      acAvatar:()=>{V.release(player.x,player.y,AC.gold,{R:170,h:360,w:110});add(new SPic({n:N('anubis_head'),x:player.x,y:player.y,w:170,ay:.85,life:.9,a0:.85,sortOff:-6,shadow:0}));},
    };
    const wrapCast=fn=>function(o){if(o&&typeof o.f==='function'){const f=o.f,k=o.key;o.f=function(a){const sx=player.x,sy=player.y,r=f.apply(this,arguments);try{CAST[k]&&CAST[k](o,sx,sy);}catch(e){console.warn(e);}return r;};}
      const a=fn.apply(this,arguments);try{const ev=a&&a.windup>.1?a.windup:a&&a.events&&a.events.length?a.events[0].t:0;if(ev>=.12&&o.key!=='basic')V.charge(uCol(o.key)==='B'?AC.soul:AC.gold,ev);}catch(_){}return a;};
    window.uCast=uCast=wrapCast(window.uCast);window.uSwingAct=uSwingAct=wrapCast(window.uSwingAct);
    /* hits */
    const H=window.uHit;window.uHit=uHit=function(e,mult,key,o){const r=H.apply(this,arguments);try{if(e&&r&&(!e._av2||gameTime-e._av2>.07)){e._av2=gameTime;const b=uCol(key)==='B';add(new HPic({n:N(b?'soul_hit':'sand_hit'),x:e.x,y:e.y,e,w:48,z:(e.boss?40:24)+(e.z||0)}));}}catch(_){}return r;};
  }
}
/* a picture that drops from the sky and lands (sun) */
class FallPic{constructor(o){Object.assign(this,{t:0,layer:'top',T:.25,life:.3},o);this.life=this.T+.02;this._v2=1;}update(dt){this.t+=dt;if(this.t>=this.T&&!this.l){this.l=1;this.onLand&&this.onLand();}return this.t<this.life;}
  draw(){const i=window.V25.im(this.n);if(!i)return;const u=Math.min(1,this.t/this.T),z=(1-u*u)*360,w=this.w,h=w*i.naturalHeight/i.naturalWidth,[x,y]=P(this.x,this.y,0);ctx.save();ctx.globalAlpha=Math.min(1,u*3);ctx.drawImage(i,x-w/2,y-z*K-h*.75,w,h);ctx.restore();ctx.globalAlpha=1;}}
window.installAnubisFx=install;
(function(){const I=window.installAnubis;if(typeof I==='function'&&!I._av2){window.installAnubis=function(){const r=I.apply(this,arguments);try{install();}catch(e){}return r;};window.installAnubis._av2=1;}})();
})();
