/* =====================================================================
   AETHERFALL — FENRIR · MVP boss of Fenrir's Den floor 3 (vikD2c, "บัลลังก์เฟนเรียร์")
   Sprite: monster-sprites.js CLIPS.fenrir (9 animations cut from the user's videos by tools/vidclips.py).
   Every skill is timed to its animation frames, and every damaging move shows a red ground warning first.

   Skills (unlocked by HP phase · P1 >60% · P2 60–30% · P3 <30% faster + shorter cooldowns)
     Rending Claw      P1+  melee cone in front                                         (claw)
     Shadow Leap       P1+  jumps onto the marked circle → damage + knock-up             (leap)
     Frost Breath      P1+  charges, then a long frost beam (locked aim) → ticks + slow  (breath)
     Abyss Orb         P1+  stands up, throws a slow homing star orb → explodes          (orb)
     Gleipnir Howl     P2+  roar shockwave, summons Fenrir Shade Hounds, rage +25% ATK   (howl)
     Shadow Step       P2+  melts into shadow (can't be hit), reappears behind you + claw (vanish, played back reversed)
   At 60% and 30% HP he always howls once (phase change).
   KO gauge still works: a KO interrupts any skill except Howl and Shadow Step.
   Respawn: 5 minutes after he dies (RO MVP style); leaving the floor resets him.
   ===================================================================== */
(function(){
if(typeof enemyAI!=='function'||!window.MSPR||!MSPR.Fenrir)return;
const MAP='vikD2c',HOME={x:1800,y:1530},RESPAWN_MS=5*60*1000,LV=80;
const NAME='Fenrir',CL=MSPR.Fenrir.clip;
const BAL={hpMul:2.2,atkMul:1,claw:1.15,leap:1.6,breath:.42,orb:1.8,howl:.8,leash:1150,aggroR:420,maxHounds:4};
const T=(k,f)=>(f+.5)/CL[k].fps;              // time of animation frame f
const DUR=k=>CL[k].n/CL[k].fps;
let boss=null,nextSpawn=0,bar=null;

/* ---------------- helpers ---------------- */
const angTo=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const dP=e=>Math.hypot(player.x-e.x,player.y-e.y);
function bossHit(e,mul,after){if(player.hp<=0||e.dead)return false;const sv=e.m;e.m=Object.assign({},sv,{atk:[sv.atk[0]*mul*(e.rage>0?1.25:1),sv.atk[1]*mul*(e.rage>0?1.25:1)]});
  const h0=player.hp;try{hitPlayer(e);}finally{e.m=sv;}const hit=player.hp<h0;if(hit&&after)after();return hit;}
function debuff(k,dur){dur*=(D.debuffMul||1);const b=player.buffs[k];if(!b||b.t<dur)player.buffs[k]={t:dur,total:dur};}
function inCone(e,phi,R,half){const d=dP(e);if(d>R+12)return false;if(d<e.r)return true;return Math.abs(angDiff(angTo(e,player),phi))<=half;}
const faceTo=(e,x)=>{e.face=x>=e.x?1:-1;};
function say(e,txt,col){addFx(new DText({x:e.x,y:e.y,z:MSPR_H(e)+40,text:txt,color:col||'#c9b6ff',size:18,life:1.5}));}

/* ---------------- ground warnings (fill up until the hit lands) ---------------- */
class FWarn{
  constructor(o){Object.assign(this,{t:0,layer:'ground',life:1,col:'#ff3550',kind:'circle',r:80},o);}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}return this.t<this.life&&!(this.e&&(this.e.dead||this.e.cast!==this.c));}
  draw(){const k=Math.min(1,this.t/this.life),[x,y]=P(this.x,this.y),pulse=.75+.25*Math.sin(this.t*18);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    const path=(s)=>{ctx.beginPath();if(this.kind==='circle')ctx.arc(0,0,this.r*s,0,TAU);
      else if(this.kind==='cone'){ctx.moveTo(0,0);ctx.arc(0,0,this.r*s,this.phi-this.half,this.phi+this.half);ctx.closePath();}
      else{ctx.save();ctx.rotate(this.phi);ctx.rect(this.off||0,-this.w/2,this.len*s,this.w);ctx.restore();}};
    ctx.globalAlpha=.16;ctx.fillStyle=this.col;path(1);ctx.fill();
    ctx.globalAlpha=.32*pulse;path(Math.max(.02,k));ctx.fill();
    ctx.globalAlpha=.85*pulse;ctx.strokeStyle=this.col;ctx.lineWidth=2.2;path(1);ctx.stroke();
    ctx.restore();ctx.globalAlpha=1;}}

/* ---------------- frost beam overlay (the drawn beam in the video is short, this one has the real length) ---------------- */
class FBeam{
  constructor(o){Object.assign(this,{t:0,layer:'top',life:1.25,len:330,w:40},o);}
  update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,mx=e.x+e.face*80,my=e.y+4,c=Math.cos(this.phi),s=Math.sin(this.phi),a=Math.min(1,this.t/.12)*Math.min(1,(this.life-this.t)/.2);
    const [x0,y0]=P(mx,my,46),[x1,y1]=P(mx+c*this.len,my+s*this.len,6),ang=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0);
    ctx.save();ctx.translate(x0,y0);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';
    for(const [w,col,al] of [[this.w*1.3,'#2a7bff',.28],[this.w*.75,'#7fd8ff',.5],[this.w*.28,'#ffffff',.85]]){
      const ww=w*(.9+.1*Math.sin(this.t*40));const g=ctx.createLinearGradient(0,0,L,0);g.addColorStop(0,hexA(col,al*a));g.addColorStop(.85,hexA(col,al*a*.8));g.addColorStop(1,hexA(col,0));
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-ww*.25);ctx.lineTo(L,-ww/2);ctx.lineTo(L,ww/2);ctx.lineTo(0,ww*.25);ctx.closePath();ctx.fill();}
    ctx.restore();ctx.globalCompositeOperation='source-over';
    if(Math.random()<Q.p*.8){const d=rnd(.2,1)*this.len;mist(mx+c*d,my+s*d,8,1,'#cfefff',14,14);}}}

/* ---------------- Abyss Orb: slow homing star sphere ---------------- */
class AbyssOrb{
  constructor(o){Object.assign(this,{t:0,layer:'top',life:4.6,z:110,speed:150,R:72},o);const a=angTo(this,player);this.vx=Math.cos(a)*this.speed;this.vy=Math.sin(a)*this.speed;
    this.warn=addFx(new FWarn({x:this.x,y:this.y,r:this.R,life:this.life,col:'#7a5cff',follow:this}));}
  update(dt){this.t+=dt;const a=angTo(this,player),k=Math.min(1,dt*1.6);this.vx+=(Math.cos(a)*this.speed-this.vx)*k;this.vy+=(Math.sin(a)*this.speed-this.vy)*k;
    this.x+=this.vx*dt;this.y+=this.vy*dt;this.z=Math.max(30,this.z-dt*60);
    if(Math.random()<Q.p)emit({type:'ember',x:this.x+rnd(-8,8),y:this.y,z:this.z+rnd(-8,8),vz:rnd(-10,20),drag:2,life:rnd(.4,.7),size:rnd(1.4,2.6),size1:.2,color:Math.random()<.5?'#9fb8ff':'#c9a8ff'});
    if(this.e.dead){this.warn.life=0;return false;}
    if(Math.hypot(player.x-this.x,player.y-this.y)<26||this.t>=this.life){this.boom();return false;}return true;}
  boom(){this.warn.life=0;addFx(new Impact({pos:[this.x,this.y,30],size:70,color:'#6a4cff',core:'#e8e0ff',rays:12,life:.4}));addFx(new GRing({x:this.x,y:this.y,r0:10,r1:this.R+20,w:12,color:'#8a6cff',life:.45}));shake(2.4);
    for(let i=0;i<qn(18);i++)emit({type:'ember',x:this.x,y:this.y,z:30,vx:rnd(-160,160),vy:rnd(-160,160),vz:rnd(40,160),drag:2.5,life:rnd(.4,.9),size:rnd(1.5,3),size1:.2,color:'#b9a8ff'});
    if(Math.hypot(player.x-this.x,player.y-this.y)<this.R+10)bossHit(this.e,BAL.orb,()=>debuff('dbWeak',4));}
  draw(){const [x,y]=P(this.x,this.y,this.z),r=15+Math.sin(this.t*6)*1.5,a=Math.min(1,this.t*4);
    ctx.save();ctx.globalAlpha=a*.28;ctx.fillStyle='#0a0618';ctx.beginPath();const [sx,sy]=P(this.x,this.y);ctx.ellipse(sx,sy,14,4,0,0,TAU);ctx.fill();
    ctx.globalAlpha=a;ctx.globalCompositeOperation='lighter';let g=ctx.createRadialGradient(x,y,r*.6,x,y,r*2.6);g.addColorStop(0,'rgba(110,140,255,.55)');g.addColorStop(1,'rgba(80,60,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.6,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='source-over';g=ctx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,'#3a3a9a');g.addColorStop(.7,'#14104a');g.addColorStop(1,'#6a8cff');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.fillStyle='#ffffff';for(let i=0;i<6;i++){const an=this.t*1.3+i*1.7,rr=r*(.25+.5*((i*37)%10)/10);ctx.globalAlpha=a*(.5+.5*Math.sin(this.t*5+i));ctx.fillRect(x+Math.cos(an)*rr-1,y+Math.sin(an)*rr-1,2,2);}
    ctx.restore();}}

/* ---------------- skills ---------------- */
const SK={
  claw:{anim:'claw',min:0,max:100,cd:2.4,w:6,phase:1,
    start(e,c){c.phi=angTo(e,player);faceTo(e,player.x);c.hit=T('claw',CL.claw.hit);c.end=DUR('claw')-.25;
      addFx(new FWarn({e,c,x:e.x,y:e.y,kind:'cone',phi:c.phi,half:.95,r:125,life:c.hit/c.sp}));},
    step(e,c){if(!c.did&&c.t>=c.hit){c.did=1;shake(1.6);addFx(new Impact({pos:[e.x+Math.cos(c.phi)*60,e.y+Math.sin(c.phi)*60,30],size:44,color:'#5aa8ff',core:'#ffffff',rays:7,life:.22}));
      if(inCone(e,c.phi,125,.95))bossHit(e,BAL.claw,()=>debuff('dbBleed',4));}}},
  leap:{anim:'leap',min:150,max:430,cd:8,w:4,phase:1,
    start(e,c){faceTo(e,player.x);const a=angTo(e,player),d=Math.min(dP(e),430);c.sx=e.x;c.sy=e.y;c.tx=e.x+Math.cos(a)*d;c.ty=e.y+Math.sin(a)*d;
      if(mapBlockedW(c.tx,c.ty)){c.tx=player.x;c.ty=player.y;}c.up=T('leap',CL.leap.hold[0]);c.land=T('leap',CL.leap.hold[1]);c.end=T('leap',31);
      addFx(new FWarn({e,c,x:c.tx,y:c.ty,r:95,life:c.land/c.sp}));},
    step(e,c){if(c.t>c.up&&c.t<c.land){const k=(c.t-c.up)/(c.land-c.up),q=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;e.x=lerp(c.sx,c.tx,q);e.y=lerp(c.sy,c.ty,q);c.noPush=1;}
      if(!c.did&&c.t>=c.land){c.did=1;c.noPush=0;e.x=c.tx;e.y=c.ty;shake(4.5);stop&&stop(80);addFx(new GRing({x:e.x,y:e.y,r0:14,r1:130,w:16,color:'#6a5aa8',life:.5}));
        dustPuff(e.x,e.y,14,'#4a4060',160,16);if(Math.hypot(player.x-c.tx,player.y-c.ty)<107)bossHit(e,BAL.leap,()=>playerCC('air',.8));}}},
  breath:{anim:'breath',min:60,max:300,cd:11,w:3,phase:1,
    start(e,c){faceTo(e,player.x);c.lock=T('breath',13);c.b0=T('breath',CL.breath.beam[0]);c.b1=T('breath',CL.breath.beam[1]);c.end=DUR('breath')-.2;c.tick=0;c.phi=aimBeam(e);
      c.warn=addFx(new FWarn({e,c,x:e.x+e.face*80,y:e.y+4,kind:'rect',phi:c.phi,len:330,w:52,life:c.b0/c.sp,col:'#3aa0ff'}));},
    step(e,c,dt){if(c.t<c.lock){c.phi=aimBeam(e);c.warn.phi=c.phi;}
      if(!c.beam&&c.t>=c.b0){c.beam=addFx(new FBeam({e,phi:c.phi,life:(c.b1-c.b0)/c.sp}));shake(1.2);}
      if(c.beam&&c.t<c.b1){c.tick-=dt;if(c.tick<=0){c.tick=.3;const mx=e.x+e.face*80,my=e.y+4;
        if(distToSeg(player.x,player.y,mx,my,mx+Math.cos(c.phi)*330,my+Math.sin(c.phi)*330)<34)bossHit(e,BAL.breath,()=>debuff('dbSlow',3));}}}},
  orb:{anim:'orb',min:170,max:650,cd:9,w:3,phase:1,
    start(e,c){faceTo(e,player.x);c.hit=T('orb',CL.orb.hit);c.end=c.hit+.35;},
    step(e,c){if(!c.did&&c.t>=c.hit){c.did=1;addFx(new AbyssOrb({e,x:e.x+e.face*78,y:e.y+6,z:118}));shake(1.2);}}},
  howl:{anim:'howl',min:0,max:9999,cd:26,w:4,phase:2,unstop:1,
    start(e,c){c.hit=T('howl',CL.howl.hit);c.end=DUR('howl')-.15;say(e,'GLEIPNIR HOWL','#d0b8ff');addFx(new FWarn({e,c,x:e.x,y:e.y,r:150,life:c.hit/c.sp,col:'#a070ff'}));},
    step(e,c){if(!c.did&&c.t>=c.hit){c.did=1;shake(5);skyDarkT=.8;
      addFx(new GRing({x:e.x,y:e.y,r0:20,r1:190,w:18,color:'#8a6aff',life:.7}));addFx(new GRing({x:e.x,y:e.y,r0:10,r1:150,w:8,color:'#ffffff',life:.5,delay:.1}));
      if(dP(e)<160)bossHit(e,BAL.howl,()=>{const a=angTo(e,player);player.x+=Math.cos(a)*55;player.y+=Math.sin(a)*55;playerCC('flinch',.5);});
      e.rage=12;summon(e,e.phase>=3?3:2);}
      if(c.did&&!c.lit&&c.t>=c.hit+1.4){c.lit=1;skyDarkT=0;}}},
  step:{anim:'vanish',min:90,max:9999,cd:15,w:3,phase:2,unstop:1,
    start(e,c){c.hide=T('vanish',13);c.gone=T('vanish',24);c.wait=c.gone+.55;c.back=CL.vanish.n-1-0;c.end=0;c.stage=0;},
    step(e,c,dt){
      if(c.stage===0&&c.t>=c.hide){c.stage=1;e.hidden=1;if(player.attackTarget===e)player.attackTarget=null;
        const a=angTo(e,player);c.dx=player.x+Math.cos(a)*75;c.dy=player.y+Math.sin(a)*75;if(mapBlockedW(c.dx,c.dy)){c.dx=player.x-Math.cos(a)*75;c.dy=player.y-Math.sin(a)*75;}
        addFx(new FWarn({e,c,x:c.dx,y:c.dy,r:70,life:c.wait-c.hide+.6,col:'#6a40c0'}));}
      if(c.stage===1&&c.t>=c.gone){c.stage=2;e.x=c.dx;e.y=c.dy;faceTo(e,player.x);}
      if(c.stage===2&&c.t>=c.wait){c.stage=3;c.r0=c.t;}
      if(c.stage>=3){const rt=(c.t-c.r0)*1.5,f=Math.max(0,24-Math.floor(rt*CL.vanish.fps));e.clipA={k:'vanish',t:(f+.5)/CL.vanish.fps,noShadow:f>8};
        if(f<14)e.hidden=0;if(f<=0){faceTo(e,player.x);return 'claw';}return;}
      e.clipA={k:'vanish',t:Math.min(c.t,c.gone),noShadow:c.t>T('vanish',8)};return;}}
};
function aimBeam(e){let a=angTo(e,player);const base=e.face>0?0:Math.PI,d=angDiff(a,base);return base+clamp(d,-.6,.6);}
function summon(e,n){const def=((window.VK_MONS||{})[MAP]||[]).find(d=>d.name==='Fenrir Shade Hound');if(!def||typeof vkMake!=='function')return;
  const alive=enemies.filter(o=>o.summon&&!o.dead).length;n=Math.min(n,BAL.maxHounds-alive);
  for(let i=0;i<n;i++){const a=i/n*TAU+rnd(-.3,.3),x=e.x+Math.cos(a)*110,y=e.y+Math.sin(a)*80;if(mapBlockedW(x,y))continue;
    const h=vkMake(def,x,y);h.summon=1;h.aggro=10;addFx(new GRing({x,y,r0:4,r1:46,w:6,color:'#6a40c0',life:.5}));mist(x,y,10,6,'#3a2a60',20,24);}}

/* ---------------- boss AI (replaces enemyAI for Fenrir) ---------------- */
function phaseOf(e){const r=e.hp/e.maxHp;return r>.6?1:r>.3?2:3;}
function startSkill(e,k){const S=SK[k],c={k,t:0,sp:e.phase>=3?1.2:1};e.cast=c;S.start(e,c);e.clipA={k:S.anim,t:0};e.cd[k]=S.cd*(e.phase>=3?.7:1);}
function pick(e){const L=dP(e),opts=[];for(const k in SK){const S=SK[k];if(e.phase<S.phase||(e.cd[k]||0)>0||L<S.min||L>S.max)continue;opts.push([k,S.w*(k==='claw'&&L<100?2:1)]);}
  if(!opts.length)return null;let r=Math.random()*opts.reduce((s,o)=>s+o[1],0);for(const [k,w] of opts){if((r-=w)<=0)return k;}return opts[0][0];}
function bossAI(e,dt){const s=e.st;e.aggro=Math.max(0,(e.aggro||0)-dt);for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-dt);e.gap=Math.max(0,(e.gap||0)-dt);if(e.rage>0)e.rage-=dt;
  const c=e.cast;
  if(c){if(s.stun>0&&!SK[c.k].unstop){endCast(e);return true;}
    c.t+=dt*c.sp;const r=SK[c.k].step(e,c,dt);if(c.k!=='step')e.clipA={k:SK[c.k].anim,t:c.t,noShadow:c.k==='leap'&&c.t>c.up&&c.t<c.land};
    if(r){endCast(e);startSkill(e,r);return true;}
    if(c.end&&c.t>=c.end)endCast(e);return true;}
  if(s.stun>0){e.clipA=null;return true;}
  const L=dP(e);
  if(e.aggro<=0&&L<BAL.aggroR&&player.hp>0){e.aggro=30;if(!e.woke){e.woke=1;say(e,'FENRIR AWAKENS','#ff8a8a');chatLog&&chatLog('sys','<b style="color:#c9a8ff">เฟนเรียร์</b> ตื่นขึ้นจากบัลลังก์!');}}
  if(L<BAL.leash&&player.hp>0&&L<700)e.aggro=Math.max(e.aggro,5);
  if(e.aggro<=0||player.hp<=0){   // leash: walk home and recover
    const hx=e.homeX-e.x,hy=e.homeY-e.y,hl=Math.hypot(hx,hy);if(hl>20){e.x+=hx/hl*90*dt;e.y+=hy/hl*90*dt;e.face=hx>0?1:-1;}
    if(e.hp<e.maxHp)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.05*dt);e.woke=e.hp<e.maxHp?e.woke:0;e.ph2=e.ph3=0;return true;}
  const ph=phaseOf(e);if(ph>e.phase){e.phase=ph;if(!e['ph'+ph]){e['ph'+ph]=1;say(e,ph===3?'FENRIR ENRAGES':'THE CHAINS CRACK',ph===3?'#ff6a6a':'#d0b8ff');e.cd.howl=0;startSkill(e,'howl');return true;}}
  if(e.gap<=0){const k=pick(e);if(k){startSkill(e,k);e.gap=e.phase>=3?.5:e.phase===2?.9:1.3;return true;}}
  const dx=player.x-e.x,dy=player.y-e.y;
  if(L>85){const sp=62*(e.phase>=3?1.25:1)*(s.slow?.55:1);e.x+=dx/L*sp*dt;e.y+=dy/L*sp*dt;e.face=dx>0?1:-1;}
  return true;}
function endCast(e){const c=e.cast;if(c&&c.k==='howl')skyDarkT=0;e.cast=null;e.clipA=null;e.hidden=0;if(c&&c.k==='step'&&c.dx!=null&&c.stage>=1&&c.stage<2){e.x=c.dx;e.y=c.dy;}}

/* ---------------- engine hooks ---------------- */
const _ai=enemyAI;enemyAI=function(e,dt){return e.fen?bossAI(e,dt):_ai(e,dt);};
const _hurt=hurt;hurt=function(e,m,o){if(e&&e.hidden)return 0;return _hurt(e,m,o);};
const _fr=fieldRespawn;fieldRespawn=function(e){if(e.fen||e.summon){e.gone=1;return true;}return _fr(e);};
const _upd=updEnemies;updEnemies=function(dt){
  if(boss&&boss.cast&&boss.cast.noPush){const bx=boss.x,by=boss.y;_upd(dt);if(boss.cast&&boss.cast.noPush){boss.x=bx;boss.y=by;}}else _upd(dt);   // mid-leap: no pushing / wall slide
  if(boss&&boss.dead&&!boss._paid)onBossDead(boss);
  for(let i=enemies.length-1;i>=0;i--){const o=enemies[i];if(o.gone&&o.dead&&o.deadT>(o.fen?MSPR_DEADLEN(o)+.5:3.4))enemies.splice(i,1);}
  if(boss&&!enemies.includes(boss))boss=null;};
function onBossDead(e){if(e.cast&&e.cast.k==='howl')skyDarkT=0;e._paid=1;e.cast=null;e.clipA=null;e.hidden=0;nextSpawn=Date.now()+RESPAWN_MS;
  for(const o of enemies)if(o.summon&&!o.dead){o.hp=0;kill(o);}
  shake(5);chatLog&&chatLog('sys','🏆 ล้ม <b style="color:#c9a8ff">เฟนเรียร์</b> ได้แล้ว! (เกิดใหม่ใน 5 นาที)');msg&&msg('MVP! ล้มเฟนเรียร์');
  const A=window.AFItems;if(A&&A.dropSetItem){const z=25000+Math.round(Math.random()*15000);A.zeny=A.zeny+z;
    const sl=['rhand','armor','top','garment','shoes','acc'][Math.floor(Math.random()*6)],id=A.dropSetItem(8,sl);A.buyGear(id,0);
    chatLog&&chatLog('sys',`ได้รับ ${z.toLocaleString()}z + <b>${A.ITEMS[id].n}</b>`);}}
function spawnBoss(){const h=mapHosts[MAP];if(h&&h.W){const k=h.W/3600;HOME.x=1800*k;HOME.y=1530*k;}   /* the den is laid out larger since 2026-11-20 */
  let [x,y]=M2W(HOME);
  if(mapBlockedW(x,y)&&h.randomSpawn){const p=h.randomSpawn(HOME.x,HOME.y,300);if(p)[x,y]=M2W(p);}
  const e=spawnEnemy(x,y,true,null);if(!enemies.includes(e))enemies.push(e);
  const st=monStats(LV,'boss');e.m=Object.assign({},MON.elder,st,{name:NAME,th:'เฟนเรียร์',el:'Dark 4',race:'Brute',size:'large',boss:1,atk:[st.atk[0]*BAL.atkMul,st.atk[1]*BAL.atkMul]});
  e.maxHp=e.hp=Math.round(st.hp*BAL.hpMul);e.vdef={name:NAME,th:'เฟนเรียร์',base:'snowwolf',lv:[LV,LV],role:'boss',aggr:1};
  Object.assign(e,{fen:1,boss:true,r:44,sc:1,face:-1,homeX:x,homeY:y,cd:{leap:3,breath:5,orb:4,howl:0,step:6},phase:1,bossName:'FENRIR · MVP',koMax:520,ko:520});
  boss=e;}
/* spawn when the floor is ready (after its field monsters), respawn 5 min after death */
(function tick(){requestAnimationFrame(tick);
  const here=curMap===MAP&&!mapFadeDir,h=mapHosts[MAP];
  if(here&&h&&h.ready&&enemies.length&&!boss&&Date.now()>=nextSpawn)spawnBoss();
  if(boss&&curMap!==MAP)boss=null;
  drawBar(here);})();
{const _e=enterMap;enterMap=function(id,sp){if(id!==MAP)nextSpawn=Math.min(nextSpawn,Date.now()+RESPAWN_MS);boss=null;return _e(id,sp);};}

/* ---------------- boss HP bar (top of the screen) ---------------- */
function drawBar(here){
  if(!bar){bar=document.createElement('div');bar.id='fenBar';bar.innerHTML='<div class="fn"><b>เฟนเรียร์ · FENRIR</b><span>Lv'+LV+' MVP</span></div><div class="fb"><i></i><em></em></div><div class="fp"></div>';
    const st=document.createElement('style');st.textContent='#fenBar{position:fixed;left:50%;top:34px;transform:translateX(-50%);width:min(440px,70vw);z-index:40;pointer-events:none;font-family:Cinzel,serif;color:#f1e6ff;text-shadow:0 1px 2px #000;display:none}#fenBar .fn{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;margin-bottom:3px}#fenBar .fn span{font-size:11px;color:#d8c27a}#fenBar .fb{position:relative;height:12px;background:rgba(10,6,20,.8);border:1px solid #8a72c8;border-radius:3px;overflow:hidden;box-shadow:0 0 10px rgba(110,80,220,.45)}#fenBar .fb i{position:absolute;inset:0;width:100%;background:linear-gradient(#a58cff,#5b3fc4 60%,#3a2690);transition:width .15s}#fenBar .fb em{position:absolute;inset:0;font-style:normal;font-size:10px;line-height:12px;text-align:center}#fenBar .fp{font-size:11px;margin-top:2px;color:#c9b6ff;text-align:center;min-height:13px}';
    document.head.appendChild(st);document.body.appendChild(bar);}
  const show=here&&boss&&!boss.dead&&boss.woke;bar.style.display=show?'block':'none';if(!show)return;
  const r=boss.hp/boss.maxHp;bar.querySelector('i').style.width=(r*100).toFixed(1)+'%';bar.querySelector('em').textContent=Math.ceil(r*100)+'%';
  bar.querySelector('.fp').textContent=boss.phase>=3?'⚠ คลั่ง — ท่าเร็วขึ้น':boss.rage>0?'⚠ หอนเรียกพลัง (ATK +25%)':boss.phase===2?'โซ่เกลปเนียร์เริ่มแตก':'';}

window.AFFenrir={get boss(){return boss;},spawn:()=>{nextSpawn=0;},skill:k=>boss&&!boss.cast&&startSkill(boss,k),BAL};
})();
