/* =====================================================================
   MAP BOSS KIT — the shared pieces of the 15 map bosses (MAP_BOSS_MECHANICS_TH.md).
   Owner 2026-11-22 20:49: '1 ตามแนะนำ · 2 เอาที่แนะนำ · 3 ได้ทำไปเรื่อยๆจนครบ' =
     AUTO keeps hitting but never dodges and never picks gold-rimmed objects · failing a mechanic hurts hard but never kills
     outright · build all 15, Salt Scorpion King first.
   Loaded right before map_bosses.js; the boss scripts (map_bosses_<land>.js) call MBK.def(key, D). A boss key without a
   script keeps the old stand-in kit of map_bosses.js (slam + adds).
   One language for every boss (doc §2):
     red ground that fills = it lands when full → step out · blue ✓ = safe → step in · gold ◎ = hit this (AUTO skips it)
     purple = a curse on you · cast bar under the boss bar (gold = breakable: empty the KO gauge) · banner for signatures ·
     'ช่วงเปิด' (window) = the boss is stunned, DEF / MDEF 0 and every hit lands.
   Player statuses (one set for every boss): root · grab · seal (one skill) / silence (all) · pull · stone · dark.
   Hooks: enemyAI (parts stand still) · kill (parts break without EXP / drops) · hurt (immune / window / per-boss hooks) ·
   drawEnemy (hidden / lifted bodies) · monsterCC (no random knock-ups from map bosses) · mapBlockedW (solid props) ·
   mapOverlay (darkness, arrows to gold objects off screen) · nearestEnemy (AUTO never picks parts) · updEnemies (parts pinned,
   lair keeps field monsters out) · fieldRespawn (no respawn inside a lair) · updatePlayer (root / grab / pull / stone) ·
   castSkill + castSkillNow (seal / silence) · enterMap (statuses cleared).
   ===================================================================== */
(function(){
if(typeof hurt!=='function'||typeof enemyAI!=='function'||typeof hitPlayer!=='function')return;
const MB=window.MBK={defs:{},boss:null,ver:1};
const T2=Math.PI*2;
const lvOf=e=>(e&&e.m&&e.m.lv)||30;
const dP=e=>Math.hypot(player.x-e.x,player.y-e.y);
const angTo=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const mob=()=>document.body.classList.contains('mob');
const fin=v=>Number.isFinite(v);
Object.assign(MB,{lvOf,dP,angTo,mob});
MB.def=(key,D)=>{MB.defs[key]=D;return D;};

/* ---------------- shapes (world units; the ground is drawn squashed by K) ---------------- */
const angIn=(a,a0,a1)=>{const w=((a1-a0)%T2+T2)%T2,r=((a-a0)%T2+T2)%T2;return r<=w;};
function inShape(s,x,y,pad){if(!s)return false;pad=pad==null?12:pad;const dx=x-s.x,dy=y-s.y,d=Math.hypot(dx,dy);
  switch(s.k){
    case 'circle':return d<=s.r+pad;
    case 'donut':return d>=s.r0-pad&&d<=s.r1+pad&&(s.a0==null||angIn(Math.atan2(dy,dx),s.a0,s.a1));
    case 'cone':return d<=s.r+pad&&(d<20||Math.abs(angDiff(Math.atan2(dy,dx),s.phi))<=s.half+pad/Math.max(40,d));
    case 'wedge':return d<=s.r+pad&&angIn(Math.atan2(dy,dx),s.a0,s.a1);
    case 'rect':{const c=Math.cos(s.phi),n=Math.sin(s.phi),u=dx*c+dy*n,v=-dx*n+dy*c;return u>=(s.off||0)-pad&&u<=s.len+pad&&Math.abs(v)<=s.w/2+pad;}
    case 'multi':return s.list.some(q=>inShape(q,x,y,pad));}
  return false;}
MB.inShape=inShape;MB.angIn=angIn;
function shapePath(s,k){ctx.beginPath();
  switch(s.k){
    case 'circle':ctx.arc(0,0,Math.max(.5,s.r*k),0,T2);break;
    case 'donut':{const r1=s.r0+(s.r1-s.r0)*k;if(s.a0==null){ctx.arc(0,0,Math.max(.5,r1),0,T2);ctx.arc(0,0,Math.max(.1,s.r0),T2,0,true);}else{let a1=s.a1;while(a1<s.a0)a1+=T2;ctx.arc(0,0,Math.max(.5,r1),s.a0,a1);ctx.arc(0,0,Math.max(.1,s.r0),a1,s.a0,true);ctx.closePath();}break;}
    case 'cone':ctx.moveTo(0,0);ctx.arc(0,0,Math.max(.5,s.r*k),s.phi-s.half,s.phi+s.half);ctx.closePath();break;
    case 'wedge':{let a1=s.a1;while(a1<s.a0)a1+=T2;ctx.moveTo(0,0);ctx.arc(0,0,Math.max(.5,s.r*k),s.a0,a1);ctx.closePath();break;}
    case 'rect':{const c=Math.cos(s.phi),n=Math.sin(s.phi),o=s.off||0,L=o+(s.len-o)*k,h=s.w/2;
      ctx.moveTo(c*o-n*h,n*o+c*h);ctx.lineTo(c*L-n*h,n*L+c*h);ctx.lineTo(c*L+n*h,n*L-c*h);ctx.lineTo(c*o+n*h,n*o-c*h);ctx.closePath();break;}}}
const COL={red:'#ff3a2a',blue:'#2f9bff',gold:'#ffc83a',purple:'#c070ff',pink:'#ff5aa0',white:'#e8f4ff'};
MB.COL=COL;
function drawShape(s,fn){if(s.k==='multi'){for(const q of s.list)drawShape(q,fn);return;}const [x,y]=P(s.x,s.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);fn(s);ctx.restore();}
/* a telegraph: fills until t = life, then fire() runs once. col red / gold / purple / pink = danger, blue = safe ✓ */
class Warn{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1,col:'red',hold:.14},o);}
  update(dt){this.t+=dt;if(this.track)this.track(this,dt);
    if(!this.fired&&this.t>=this.life){this.fired=1;if(this.e&&(this.e.dead||!enemies.includes(this.e))){this.dead=1;return false;}if(this.fire)this.fire(this);}
    return !this.dead&&this.t<this.life+this.hold&&!(this.e&&this.e.dead);}
  draw(){const s=this.shape;if(!s)return;const c=COL[this.col]||this.col,fade=this.fired?Math.max(0,1-(this.t-this.life)/this.hold):Math.min(1,this.t/.07),k=Math.min(1,this.t/this.life),pu=.78+.22*Math.sin(gameTime*16);
    if(this.col==='blue'){drawShape(s,q=>{ctx.globalAlpha=.3*fade;ctx.fillStyle=c;shapePath(q,1);ctx.fill();ctx.globalAlpha=.85*fade;ctx.lineWidth=6.5;ctx.strokeStyle='#0b3f8a';shapePath(q,1);ctx.stroke();ctx.globalAlpha=.95*fade;ctx.lineWidth=3.2;ctx.strokeStyle='#cfeeff';ctx.setLineDash([10,7]);ctx.lineDashOffset=-gameTime*30;shapePath(q,1);ctx.stroke();ctx.setLineDash([]);});
      if(!this.noTick)safeTick(s,fade);ctx.globalAlpha=1;return;}
    drawShape(s,q=>{ctx.globalAlpha=.15*fade;ctx.fillStyle=c;shapePath(q,1);ctx.fill();if(!this.fired){ctx.globalAlpha=.32*pu*fade;shapePath(q,k);ctx.fill();}
      ctx.globalAlpha=.92*pu*fade;ctx.lineWidth=3;ctx.strokeStyle=c;shapePath(q,1);ctx.stroke();});ctx.globalAlpha=1;}}
/* a ✓ in the middle of a safe zone, upright (not squashed) */
function safeTick(s,fade){let wx=s.x,wy=s.y;if(s.k==='rect'){const m=((s.off||0)+s.len)/2;wx+=Math.cos(s.phi)*m;wy+=Math.sin(s.phi)*m;}else if(s.k!=='circle')return;
  const [x,y]=P(wx,wy),r=11+Math.sin(gameTime*5)*1.2;ctx.save();ctx.globalAlpha=.9*fade;ctx.fillStyle='#0b3f8a';ctx.beginPath();ctx.arc(x,y,r+2.5,0,T2);ctx.fill();ctx.fillStyle='#2f9bff';ctx.beginPath();ctx.arc(x,y,r,0,T2);ctx.fill();
  ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x-1.5,y+4);ctx.lineTo(x+5.5,y-4.5);ctx.stroke();ctx.restore();}
MB.Warn=Warn;
MB.warn=o=>addFx(new Warn(o));
/* a safe zone (blue, ✓) that lives `life` seconds */
MB.safe=(shape,life,o)=>addFx(new Warn(Object.assign({shape,life,col:'blue',prog:false,hold:.2},o||{})));

/* ---------------- damage to the hero ---------------- */
const BD={mbPoison:{n:'พิษ',c:'#c07ae0',i:'☠'},mbBurn:{n:'ไฟไหม้',c:'#ff8a4a',i:'🔥'},mbBleed:{n:'เลือดไหล',c:'#e2574c',i:'🩸'},mbRoot:{n:'ติดราก / ติดใย',c:'#8ad060',i:'🌿'},
  mbGrab:{n:'ถูกคว้า — ตีสิ่งที่คว้าให้หลุด',c:'#e0a060',i:'✋'},mbSeal:{n:'สกิลถูกผนึก',c:'#b070ff',i:'🗝'},mbSilence:{n:'เงียบ — ใช้สกิลไม่ได้',c:'#b070ff',i:'🔇'},
  mbPull:{n:'ถูกดึง — เดินสวนออก',c:'#ff70b0',i:'🎵'},mbStone:{n:'กลายเป็นหิน',c:'#a8a090',i:'🗿'},mbDark:{n:'มืด',c:'#7a70a0',i:'🌑'},mbBlind:{n:'ทรายเข้าตา (HIT ลด)',c:'#d8b070',i:'👁'},
  mbBlood:{n:'จ่ายด้วยเลือด — สกิลใช้ HP แทน SP',c:'#e0303a',i:'🩸'},mbChill:{n:'หนาวสั่น (ครบ 3 = แข็ง)',c:'#9fe0ff',i:'❄'},mbWeb:{n:'ติดใย (ครบ 3 = รังไหม)',c:'#e8e8f0',i:'🕸'}};
if(typeof BUFFDEF==='object')Object.assign(BUFFDEF,BD);
const DOTV={};   /* HP per second of the kit's own damage-over-time statuses (boss level × n, flat) */
function res(k,dur){if(window.MSF&&MSF.debuffT){dur=MSF.debuffT(k,dur);if(!dur)return 0;}const m=typeof resMul==='function'?resMul(k):1;return dur*(m>0?m:1);}
MB.dot=function(k,dur,perSec){dur=res(k==='mbPoison'?'dbPoison':k==='mbBurn'?'dbBurn':'dbBleed',dur);if(!dur)return;DOTV[k]=Math.max(1,Math.round(perSec));const b=player.buffs[k];if(!b||b.t<dur)player.buffs[k]={t:dur,total:dur};};
MB.buff=function(k,dur,lbl){const b=player.buffs[k];if(!b||b.t<dur)player.buffs[k]={t:dur,total:dur};if(lbl!=null)player.buffs[k].lbl=lbl;};
/* a hit from the boss: mul × its ATK (through DEF / MDEF as usual). o.sure: walking was the dodge, FLEE / perfect dodge do not apply (telegraphed moves) ·
   o.magic: MDEF · o.dot:[key,dur,lvMul] · o.cc:[kind,dur] (playerCC) · o.pc:[status,dur,opts] · o.push: px away from the boss */
MB.hit=function(e,mul,o){o=o||{};if(player.hp<=0||!e||e.dead)return false;const sv=e.m,b=e.mb,add=b&&b.enr?lvOf(e)*2:0;
  e.m=Object.assign({},sv,{atk:[sv.atk[0]*mul+add,sv.atk[1]*mul+add]});const h0=player.hp;
  try{hitPlayer(e,{magic:!!o.magic,sure:o.sure!==0});}finally{e.m=sv;}
  const hit=player.hp<h0;if(!hit)return false;
  if(o.dot)MB.dot(o.dot[0],o.dot[1],lvOf(e)*(o.dot[2]||1));
  if(o.push){const a=o.from!=null?o.from:angTo(e,player);MB.shove(Math.cos(a)*o.push,Math.sin(a)*o.push);}
  if(o.cc)playerCC(o.cc[0],o.cc[1]);
  if(o.pc)MB.pc(o.pc[0],o.pc[1],o.pc[2]);
  return true;};
/* push the hero (blocked by walls / solid props) */
MB.shove=function(dx,dy){try{if(window.MSF&&MSF.tier&&MSF.tier('str')>=1)return;}catch(err){}const n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/10));for(let i=0;i<n;i++){const x=player.x+dx/n,y=player.y+dy/n;if(curMap&&mapBlockedW(x,y))break;player.x=x;player.y=y;}};

/* ---------------- strikes = telegraph + hit when it fills ---------------- */
MB.strike=function(e,o){const b=e.mb,T=Math.max(.5,(o.T||1)-(b&&b.enr?.3:0));
  const w=addFx(new Warn(Object.assign({e},o,{life:T})));
  w.fire=()=>{if(o.pre)o.pre(w);let hit=false;const s=w.shape;
    if(player.hp>0&&!o.noHit&&inShape(s,player.x,player.y,o.pad)&&!(o.cover&&MB.covered(o.cover(w),player.x,player.y)))hit=MB.hit(e,o.mul||1,o);
    if(hit&&o.sig)MB.fail(e,o.sig);
    if(o.boom!==0)MB.boom(s,o.boomCol||(o.col==='purple'?'#c890ff':o.col==='pink'?'#ffc0dc':null),o.boomKind);
    if(o.onFire)o.onFire(hit,w);};
  if(b&&b.act)(b.act.ws=b.act.ws||[]).push(w);
  return w;};
/* impact look of a strike (ground burst) */
MB.boom=function(s,col,kind){if(!s)return;if(s.k==='multi'){for(const q of s.list)MB.boom(q,col,kind);return;}
  let x=s.x,y=s.y,r=s.r||s.r1||60;if(s.k==='rect'){x+=Math.cos(s.phi)*s.len*.55;y+=Math.sin(s.phi)*s.len*.55;r=Math.max(40,s.w);}
  if(s.k==='cone'){x+=Math.cos(s.phi)*s.r*.5;y+=Math.sin(s.phi)*s.r*.5;r=s.r*.6;}
  if(kind!=='quiet'){addFx(new GRing({x,y,r0:8,r1:Math.min(200,r+20),w:10,color:col||'#ffd8a0',life:.4}));if(typeof dustPuff==='function')dustPuff(x,y,8,'#cbbba0',90,12);}
  if(typeof shake==='function')shake(Math.min(4,1.2+r/80));};
/* is (x,y) hidden from (sx,sy) behind one of the covers? cover = [{x,y,r}] */
MB.covered=function(c,x,y){if(!c)return false;const L=c.list||[];for(const q of L){if(q.dead)continue;const d=distToSeg(q.x,q.y,c.x,c.y,x,y);if(d<q.r&&Math.hypot(x-c.x,y-c.y)>Math.hypot(q.x-c.x,q.y-c.y))return q;}return false;};

/* ---------------- boss state ---------------- */
MB.init=function(e,D){const b=e.mb={D,key:e.bossKey,t:0,cd:{},cnt:{},act:null,win:0,fails:0,awake:0,fightT:0,phase:1,enr:0,props:[],parts:[],away:0,hint:'',
    def0:e.m.def,mdef0:e.m.mdef,flee0:e.m.flee,home:{x:e.x,y:e.y},R:D.R||600};
  if(e.vdef)e.vdef=Object.assign({},e.vdef,{_t:null});   /* no inherited every-4th-hit ability: the boss's moves carry their own statuses */
  if(D.hpMul)e.maxHp=e.hp=Math.round(e.maxHp/1.3*D.hpMul);if(e.m)e.m.hp=e.maxHp;
  for(const k in D.cd0||{})b.cd[k]=D.cd0[k];
  if(D.setup)D.setup(e,b);MB.boss=e;return b;};
MB.defNow=e=>{const b=e.mb;e.m.def=b.win>0?0:(b.defN!=null?b.defN:b.def0);e.m.mdef=b.win>0?0:(b.mdefN!=null?b.mdefN:b.mdef0);};
MB.ready=(e,k)=>!(e.mb.cd[k]>0);
MB.cd=(e,k,s)=>{e.mb.cd[k]=s;};
MB.count=(e,k)=>(e.mb.cnt[k]=(e.mb.cnt[k]||0)+1);
/* an action locks the boss until it ends: {name, T, brk (KO the gauge must drop to), unstop, step(e,a,dt), end(e,a), broken(e,a)} */
MB.act=function(e,a){const b=e.mb;a.t=0;a.T=a.T||1;b.act=a;if(a.brk!=null){e.koMax=e.koMax||320;e.ko=Math.min(e.ko==null?e.koMax:e.ko,a.brk);a.brk0=e.ko;}if(a.start)a.start(e,a);return a;};
MB.cancel=function(e){const b=e.mb;if(!b||!b.act)return;const a=b.act;b.act=null;for(const w of a.ws||[])w.dead=1;if(a.cancel)a.cancel(e,a);e.atk=0;};
function breakAct(e){const b=e.mb,a=b.act;MB.cancel(e);say(e,'ขัดจังหวะ!','#ffd23a');if(a&&a.broken)a.broken(e,a);}
/* the reward for playing it right */
class WinFx{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}update(dt){this.t+=dt;const b=this.e.mb;return !this.e.dead&&b&&b.win>0;}
  draw(){const e=this.e,[x,y]=P(e.x,e.y),R=70+8*Math.sin(this.t*5);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,R*.2,0,0,R*1.3);g.addColorStop(0,'rgba(255,214,90,.35)');g.addColorStop(1,'rgba(255,170,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*1.3,0,T2);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.lineWidth=3;ctx.strokeStyle='#ffe08a';ctx.setLineDash([12,8]);ctx.lineDashOffset=-this.t*40;ctx.beginPath();ctx.arc(0,0,R,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    if(Math.random()<.35)emit({type:'spark',x:e.x+rnd(-30,30),y:e.y+rnd(-14,14),z:rnd(20,70),vz:rnd(30,80),drag:2,life:.5,size:1.6,color:'#ffe9a0',len:.03});}}
MB.window=function(e,sec,txt){const b=e.mb;if(!b||e.dead)return;MB.cancel(e);const was=b.win>0;b.win=Math.max(b.win,sec);b.winT=Math.max(b.winT||0,b.win);e.atk=0;e.hidden=0;b.immune=0;MB.defNow(e);
  if(!was)addFx(new WinFx({e}));MB.banner('✦ '+(txt||'ช่วงเปิด!')+' ตีเลย','gold',1.6);say(e,'✦ ช่วงเปิด','#ffe08a');if(typeof shake==='function')shake(2.5);};
MB.fail=function(e,why){const b=e.mb;if(!b)return;b.fails++;if(b.fails===1&&typeof chatLog==='function')chatLog('sys',`<span style="color:#ffab8a">พลาดกลไก (${why}) — รอบนี้ไม่ได้โบนัส "ล้มไร้ที่ติ ✦"</span>`);};
function say(e,txt,col,sz){addFx(new DText({x:e.x,y:e.y,z:(typeof MSPR_H==='function'?MSPR_H(e):70)+30,text:txt,color:col||'#ffd77a',size:sz||17,life:1.4}));}
MB.say=say;

/* ---------------- the AI loop (map_bosses.js calls it for bosses with a script) ---------------- */
MB.run=function(e,dt){const b=e.mb,D=b.D,s=e.st;b.t+=dt;for(const k in b.cd)if(b.cd[k]>0)b.cd[k]-=dt;
  if(b.immune>0)b.immune-=dt;
  const L=dP(e),lair=Math.hypot(player.x-b.home.x,player.y-b.home.y);
  /* leash (RO): the hero dead, or out of the lair for 8 s → home, full HP */
  if(b.awake){if(player.hp<=0||lair>b.R+260)b.away+=dt;else b.away=0;if(b.away>(player.hp<=0?1.5:8)){MB.reset(e);return true;}}
  if(!b.awake){if(L<(D.see||340)&&player.hp>0){MB.wake(e);}else{if(D.idle)D.idle(e,dt);return true;}}
  b.fightT+=dt;if(!b.enr&&b.fightT>(D.enrage||300)){b.enr=1;MB.banner('⚠ โกรธจัด! ท่าเร็วขึ้น แรงขึ้น','red',2);say(e,'โกรธจัด!','#ff6a5a',20);}
  if(b.win>0){b.win-=dt;e.atk=0;s.stagger=Math.max(s.stagger||0,.12);if(b.win<=0){b.win=0;MB.defNow(e);if(D.winEnd)D.winEnd(e);}return true;}
  if(D.tick)D.tick(e,dt);if(e.dead||!e.mb)return true;
  const cc=s.frozen>0||s.stun>0;
  if(b.act){const a=b.act;if(cc&&a.brk!=null&&!a.unstop){breakAct(e);return true;}if(cc&&!a.unstop)return true;
    a.t+=dt;if(a.step)a.step(e,a,dt);if(b.act===a&&a.t>=a.T){b.act=null;if(a.end)a.end(e,a);}return true;}
  if(cc){e.atk=0;return true;}
  const ph=D.phases?D.phases.filter(p=>e.hp/e.maxHp<=p).length+1:1;if(ph>b.phase){b.phase=ph;if(D.phase){D.phase(e,ph);if(b.act)return true;}}
  if(D.think&&D.think(e,dt,L))return true;
  MB.chase(e,dt,D.reach||95,D.spd||58);return true;};
MB.chase=function(e,dt,reach,spd,tx,ty){const s=e.st;tx=tx==null?player.x:tx;ty=ty==null?player.y:ty;const dx=tx-e.x,dy=ty-e.y,L=Math.hypot(dx,dy);
  if(L>reach&&!(s.root>0)){const v=spd*(s.slow>0?.55:1)*(e.mb&&e.mb.enr?1.15:1);e.x+=dx/L*Math.min(L-reach,v*dt);e.y+=dy/L*Math.min(L-reach,v*dt);}
  if(Math.abs(dx)>4)e.face=dx>0?1:-1;return L<=reach+1;};
MB.wake=function(e){const b=e.mb;b.awake=1;e.aggro=30;b.fightT=0;MB.clearLair(e);
  if(b.D.wake)b.D.wake(e);say(e,b.D.cry||'!!','#ffb070',19);
  if(!b.seen&&b.D.intro){b.seen=1;MB.banner(b.D.intro,'gold',3);}};
MB.reset=function(e){const b=e.mb;MB.cancel(e);for(const p of b.parts)if(!p.dead){p.dead=true;p.gone=1;}b.parts.length=0;for(const q of b.props)q.dead=1;b.props.length=0;
  e.x=b.home.x;e.y=b.home.y;e.hp=e.maxHp;b.awake=0;b.away=0;b.win=0;b.enr=0;b.phase=1;b.fails=0;b.cnt={};b.cd={};for(const k in b.D.cd0||{})b.cd[k]=b.D.cd0[k];e.hidden=0;e.mbLift=0;b.immune=0;e.aggro=0;e.atk=0;MB.defNow(e);
  for(const o of enemies)if(o.mbOf===e&&!o.dead){o.dead=true;o.gone=1;}
  MB.pcClear();if(b.D.reset)b.D.reset(e);if(b.D.setup)b.D.setup(e,b);
  if(typeof chatLog==='function')chatLog('sys',`👑 ${e.m.th||e.bossName} กลับไปพักฟื้นที่รัง (เลือดเต็ม)`);};
MB.dead=function(e){const b=e.mb;if(!b)return;MB.cancel(e);for(const q of b.props)q.dead=1;for(const p of b.parts)if(!p.dead){p.dead=true;p.gone=1;}MB.pcClear();if(b.D.dead)b.D.dead(e);
  if(b.fails===0&&b.fightT>20){try{if(window.AFItems&&AFItems.add)AFItems.add('bm_'+e.bossKey,1);}catch(err){}
    MB.banner('✦ ล้มไร้ที่ติ! ชิ้นส่วนบอส +1','gold',2.4);if(typeof chatLog==='function')chatLog('sys',`✦ <b style="color:#ffd36a">ล้มไร้ที่ติ</b> — ไม่พลาดกลไกเลย ได้ชิ้นส่วนบอสเพิ่ม 1 ชิ้น`);
    try{const k='af_mbclean_'+(window.BOSS_T&&BOSS_T.play?'play':'test'),o=JSON.parse(localStorage.getItem(k)||'{}');o[e.bossKey]=(o[e.bossKey]||0)+1;localStorage.setItem(k,JSON.stringify(o));}catch(err){}}
  if(MB.boss===e)MB.boss=null;};
/* the lair: field monsters inside leave when the boss wakes, and stay out while it lives */
MB.clearLair=function(e){const b=e.mb;for(const o of enemies){if(o===e||o.dead||o.mboss||o.mbOf||o.mbPart)continue;const d=Math.hypot(o.x-b.home.x,o.y-b.home.y);if(d<b.R){outLair(o,b);o.aggro=0;}}};
function outLair(o,b){const a=Math.atan2(o.y-b.home.y,o.x-b.home.x)||rnd(0,T2);for(let r=b.R+60;r<b.R+400;r+=40){const x=b.home.x+Math.cos(a)*r,y=b.home.y+Math.sin(a)*r;if(!curMap||!mapBlockedW(x,y)){o.x=x;o.y=y;o.tx=x;o.ty=y;o.hx=x;o.hy=y;return;}}}

/* ---------------- parts (gold ◎ objects that are enemies: every skill can hit them) ---------------- */
class PartFx{constructor(p){this.p=p;this.layer='sorted';this.t=0;this.sy=p.y;}
  update(dt){this.t+=dt;const p=this.p;this.sy=p.y+(p.sortOff||0);if(p.dead){this.d=(this.d||0)+dt;return this.d<(p.breakT||.5)&&!p.gone;}return enemies.includes(p)&&!p.gone;}
  draw(){const p=this.p,[x,y]=P(p.x,p.y);const al=p.dead?Math.max(0,1-(this.d||0)/(p.breakT||.5)):1;
    if(!p.dead&&p.gold!==0){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const R=(p.ring||p.r+10);ctx.globalAlpha=.85;ctx.lineWidth=3.2;ctx.strokeStyle='#3a2408';ctx.beginPath();ctx.arc(0,0,R+1.5,0,T2);ctx.stroke();
      ctx.lineWidth=2.4;ctx.strokeStyle='#ffc83a';ctx.setLineDash([10,7]);ctx.lineDashOffset=-this.t*26;ctx.beginPath();ctx.arc(0,0,R,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();ctx.globalAlpha=1;}
    if(p.drawFn){ctx.save();ctx.globalAlpha=al;try{p.drawFn(p,x,y,this.t,al);}catch(err){}ctx.restore();ctx.globalAlpha=1;}
    if(!p.dead&&p.gold!==0&&p.mark!==0){const h=(p.h||50)+14+3*Math.sin(this.t*4);ctx.save();ctx.font='700 15px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x,y-h);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x,y-h);ctx.restore();}}}
MB.part=function(e,o){const p=spawnEnemy(o.x,o.y,false,null);p.x=o.x;p.y=o.y;p.tx=p.hx=o.x;p.ty=p.hy=o.y;
  p.m={name:o.name||'Part',th:o.th||o.name||'ชิ้นส่วน',lv:lvOf(e),hp:o.hp,atk:[0,0],def:o.def!=null?o.def:Math.round((e.mb?e.mb.def0:10)*.5),mdef:o.mdef!=null?o.mdef:Math.round((e.mb?e.mb.mdef0:8)*.5),
    flee:0,hit:0,luk:0,vit:o.vit||10,str:0,agi:0,int:0,dex:0,race:o.race||'Formless',el:o.el||'Neutral 1',size:'medium',role:'part'};
  Object.assign(p,{hp:o.hp,maxHp:o.hp,r:o.r||22,sc:(o.h||50)/54,mbPart:1,mbOf:e,mbNoAuto:o.auto?0:1,fixed:o.fixed===0?null:{x:o.x,y:o.y},h:o.h||50,drawFn:o.draw||null,onBreak:o.onBreak||null,
    gold:o.gold,mark:o.mark,ring:o.ring,breakT:o.breakT,sortOff:o.sortOff||0,koMax:1e9,ko:1e9,face:1,aggro:0,pkind:o.kind||'part',data:o.data||{}});
  if(!enemies.includes(p))enemies.push(p);if(e.mb)e.mb.parts.push(p);addFx(new PartFx(p));return p;};
MB.parts=(e,kind)=>e.mb?e.mb.parts.filter(p=>!p.dead&&(!kind||p.pkind===kind)):[];
function breakPart(p){if(p.dead)return;try{if(typeof flushCombo==='function')flushCombo(p);}catch(err){}p.dead=true;p.deadT=0;p.hp=0;if(player.attackTarget===p)player.attackTarget=null;
  const e=p.mbOf;if(e&&e.mb){const i=e.mb.parts.indexOf(p);if(i>=0)e.mb.parts.splice(i,1);}if(p.onBreak)try{p.onBreak(p);}catch(err){console.warn(err);}}
MB.breakPart=breakPart;

/* ---------------- props (not enemies): covers, pools, glyphs … ---------------- */
class PropFx{constructor(q){this.q=q;this.layer=q.layer||'ground';this.t=0;this.sy=q.y;}
  update(dt){const q=this.q;this.t+=dt;q.t=(q.t||0)+dt;if(q.update)q.update(q,dt);this.sy=q.y+(q.sortOff||0);if(q.life!=null&&q.t>=q.life){if(!q.dead&&q.onEnd)q.onEnd(q);q.dead=1;}
    if(q.dead){this.d=(this.d||0)+dt;return this.d<(q.fadeT||.4);}return true;}
  draw(){const q=this.q;if(!q.draw)return;const al=q.dead?Math.max(0,1-(this.d||0)/(q.fadeT||.4)):1;const [x,y]=P(q.x,q.y);ctx.save();ctx.globalAlpha=al;try{q.draw(q,x,y,this.t,al);}catch(err){}ctx.restore();ctx.globalAlpha=1;}}
MB.prop=function(e,q){q.t=0;q.e=e;if(e&&e.mb)e.mb.props.push(q);addFx(new PropFx(q));if(q.layer2){const q2=Object.assign({},q,{layer:q.layer2,draw:q.draw2,update:null});q.twin=q2;addFx(new PropFx(Object.assign(q2,{_src:q})));}return q;};
MB.props=(e,kind)=>e.mb?e.mb.props.filter(q=>!q.dead&&(!kind||q.kind===kind)):[];
const solidAt=(x,y)=>{const e=MB.boss;if(!e||!e.mb||curMap!==e.mboss)return false;for(const q of e.mb.props)if(q.solid&&!q.dead&&Math.hypot(x-q.x,y-q.y)<q.r)return true;return false;};
MB.solidAt=solidAt;

/* ---------------- statuses on the hero ---------------- */
const PC=MB.PC={root:0,grab:null,seal:null,silence:0,pull:null,stone:0,dark:null,blood:0};
MB.pc=function(k,dur,o){o=o||{};if(player.hp<=0)return;
  if(k==='root'){dur=res('root',dur);if(!dur)return;PC.root=Math.max(PC.root,dur);MB.buff('mbRoot',PC.root);if(o.web)PC.rootWeb=1;else PC.rootWeb=0;}
  else if(k==='grab'){PC.grab={t:dur,T:dur,pos:o.pos,free:o.free,end:o.end,part:o.part};MB.buff('mbGrab',dur);player.moveT=null;player.pending=null;if(player.action&&!player.action.ended)endAction();}
  else if(k==='seal'){PC.seal={key:o.key,t:dur};MB.buff('mbSeal',dur);refreshLocks();}
  else if(k==='silence'){dur=res('silence',dur);PC.silence=Math.max(PC.silence,dur);MB.buff('mbSilence',PC.silence);refreshLocks();}
  else if(k==='pull'){PC.pull={t:dur,T:dur,to:o.to,v:o.v||70,stop:o.stop||40,reach:o.reach};MB.buff('mbPull',dur);}
  else if(k==='stone'){dur=res('stun',dur);if(!dur)return;PC.stone=Math.max(PC.stone,dur);MB.buff('mbStone',PC.stone);playerCC('stun',PC.stone);}
  else if(k==='dark'){PC.dark={t:dur,T:dur,r:o.r||170,col:o.col||'6,4,12',a:o.a==null?.9:o.a};MB.buff('mbDark',dur);}
  else if(k==='blood'){PC.blood=Math.max(PC.blood,dur);MB.buff('mbBlood',PC.blood);refreshLocks();}};
MB.pcClear=function(){PC.root=0;PC.grab=null;PC.seal=null;PC.silence=0;PC.pull=null;PC.stone=0;PC.dark=null;PC.blood=0;for(const k in BD)if(player.buffs[k])delete player.buffs[k];refreshLocks();};
MB.sealed=key=>(PC.silence>0)||(PC.seal&&PC.seal.key===key&&PC.seal.t>0);
/* the most-used skill of the last 20 s (Hecate's key) */
const USE=[];MB.mostUsed=()=>{const c={},t0=gameTime-20;for(const u of USE)if(u.t>t0)c[u.k]=(c[u.k]||0)+1;let best=null,n=0;for(const k in c)if(c[k]>n){n=c[k];best=k;}return best;};
/* skill buttons: a lock over sealed skills (PC hotbar + phone wheel carry data-k) */
let lockSig='';function refreshLocks(){const sig=(PC.silence>0?'S':'')+(PC.seal&&PC.seal.t>0?PC.seal.key:'')+(PC.blood>0?'B':'');if(sig===lockSig)return;lockSig=sig;
  for(const el of document.querySelectorAll('[data-k]')){const k=el.getAttribute('data-k');let L=el.querySelector('.mbLk');const on=PC.silence>0||(PC.seal&&PC.seal.t>0&&PC.seal.key===k);const bl=!on&&PC.blood>0;
    if(!on&&!bl){if(L)L.remove();continue;}if(!L){L=document.createElement('span');L.className='mbLk';el.appendChild(L);}L.className='mbLk'+(bl?' bl':'');L.textContent=bl?'🩸':'🗝';}}
MB.refreshLocks=refreshLocks;

/* ---------------- UI: cast bar + hint + AUTO warning · banner ---------------- */
let cb=null,ban=null,banT=0,cbSig='';
function ui(){if(cb)return;const st=document.createElement('style');st.textContent=`
#mbCast{position:fixed;left:50%;top:156px;transform:translateX(-50%);width:min(380px,62vw);z-index:12;pointer-events:none;font-family:Mitr,Mali,Sarabun,sans-serif;color:#fff3d6;text-shadow:0 1px 2px #000,0 0 3px #000;display:none;text-align:center}
#mbCast .cn{font-size:12.5px;display:flex;justify-content:center;gap:8px;align-items:baseline}#mbCast .cn b{font-weight:600;color:#ffe9b0}#mbCast .cn span{font-size:11px;color:#ffd36a}
#mbCast .cb{position:relative;height:9px;margin:2px auto 0;width:78%;background:rgba(20,10,4,.82);border:1px solid #9a7a5a;border-radius:5px;overflow:hidden}
#mbCast .cb i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(#ffd0b8,#e8603a)}#mbCast.brk .cb{border-color:#ffd23a;box-shadow:0 0 8px rgba(255,210,60,.7)}#mbCast.brk .cb i{background:linear-gradient(#fff0a8,#e8a81a)}
#mbCast.win .cb{border-color:#ffe08a}#mbCast.win .cb i{background:linear-gradient(#fff6c8,#ffc83a)}
#mbCast .ht{font-size:11.5px;color:#ffe9a8;margin-top:3px;line-height:1.25}#mbCast .aw{display:none;font-size:11px;color:#ffb0a0;margin-top:2px}#mbCast.auto .aw{display:block}
body.mob #mbCast{top:128px;width:min(300px,46vw)}body.mob #mbCast .cn{font-size:11px}body.mob #mbCast .ht{font-size:10.5px}body.mob #mbCast.top{top:98px}
#mbBan{position:fixed;left:50%;top:27%;transform:translate(-50%,-50%) scale(.9);z-index:30;pointer-events:none;font-family:Mitr,Mali,sans-serif;text-align:center;opacity:0;transition:opacity .18s,transform .18s;white-space:nowrap}
#mbBan b{display:inline-block;font-weight:600;font-size:26px;padding:6px 22px;border-radius:14px;background:rgba(40,16,8,.82);border:2px solid #ffb04a;color:#fff0d0;text-shadow:0 2px 3px #000;box-shadow:0 4px 18px rgba(0,0,0,.5)}
#mbBan.on{opacity:1;transform:translate(-50%,-50%) scale(1)}#mbBan.gold b{border-color:#ffd23a;color:#ffe9a0;background:rgba(48,32,6,.86)}#mbBan.blue b{border-color:#5ab8ff;color:#d8f0ff;background:rgba(8,26,48,.86)}
#mbBan.red b{border-color:#ff5a3a;color:#ffd8d0;background:rgba(56,8,6,.86)}#mbBan.purple b{border-color:#c07aff;color:#f0dcff;background:rgba(36,10,52,.86)}
body.mob #mbBan{top:30%}body.mob #mbBan b{font-size:19px;padding:5px 14px}
.mbLk{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(40,10,60,.62);border-radius:inherit;z-index:6;pointer-events:none;text-shadow:0 0 6px #c890ff}
.mbLk.bl{background:rgba(90,0,8,.42);font-size:16px;align-items:flex-start;justify-content:flex-end;padding:2px 4px;text-shadow:0 0 5px #ff3a3a}`;
  document.head.appendChild(st);
  cb=document.createElement('div');cb.id='mbCast';cb.innerHTML='<div class="cn"><b></b><span></span></div><div class="cb"><i></i></div><div class="ht"></div><div class="aw">⚠ ออโต้ไม่หลบท่าบอส และไม่ตีของทอง ◎</div>';document.body.appendChild(cb);
  ban=document.createElement('div');ban.id='mbBan';ban.innerHTML='<b></b>';document.body.appendChild(ban);}
MB.banner=function(txt,kind,sec){ui();ban.className='on '+(kind||'gold');ban.querySelector('b').textContent=txt;banT=sec||1.8;};
MB.hint=(e,t)=>{if(e&&e.mb)e.mb.hint=t;};
function drawUI(dt){ui();if(banT>0){banT-=dt;if(banT<=0)ban.className=ban.className.replace('on','').trim();}
  const e=MB.boss,b=e&&e.mb;let show=!!(b&&b.awake&&!e.dead&&curMap===e.mboss&&!mapFadeDir);
  if(!show){if(cbSig!=='-'){cb.style.display='none';cbSig='-';}return;}
  const a=b.act,win=b.win>0,au=typeof autoMode!=='undefined'&&autoMode;
  const name=win?'✦ ช่วงเปิด — ตีเลย!':a&&a.name?a.name:'',k=win?b.win/Math.max(.01,b.winT||1):a&&a.name?Math.min(1,a.t/a.T):0,brk=!!(a&&a.brk!=null&&!win);
  const top=mob()&&!(document.getElementById('mbBar')&&document.getElementById('mbBar').style.display==='block');
  const sig=[name,(k*40|0),brk,win,b.hint,au,top].join('|');if(sig===cbSig)return;cbSig=sig;
  cb.style.display='block';cb.className=(brk?'brk ':'')+(win?'win ':'')+(au?'auto ':'')+(top?'top':'');
  cb.querySelector('.cn b').textContent=name;cb.querySelector('.cn span').textContent=brk?'แถบทอง = ขัดได้ (ทำเกจ KO ให้หมด)':'';
  const bar=cb.querySelector('.cb');bar.style.display=name?'block':'none';cb.querySelector('.cb i').style.width=(k*100).toFixed(0)+'%';
  cb.querySelector('.ht').textContent=b.hint||'';}

/* ---------------- engine hooks ---------------- */
{const _ai=enemyAI;enemyAI=function(e,dt){if(e.mbPart){e.atk=0;return true;}return _ai(e,dt);};}
{const _k=kill;kill=function(e){if(e&&e.mbPart){breakPart(e);return;}if(e&&e.mb&&e.mb.D.cheat&&!e.dead&&e.mb.D.cheat(e)){e.hp=Math.max(1,e.hp);return;}return _k(e);};}   /* cheat: the boss refuses to die (Mummy's jars) */
{const _dn=()=>{};let mute=0;
 const _h=hurt;hurt=function(e,mult,o){o=o||{};if(!e||e.dead)return 0;
  const B=e.mbOf&&e.mbOf.mb?e.mbOf:null;
  if(e.mb){const b=e.mb;if(b.immune>0||e.mbImmune){if(!e._imT||gameTime-e._imT>.5){e._imT=gameTime;say(e,e.mbImmuneTxt||'ไม่โดน','#cfd6e0',13);}return 0;}
    if(b.win>0){o._msSure=1;o._msCut=Math.max(o._msCut||0,9999);}
    const H=b.D.hurt&&b.D.hurt(e,mult,o);
    if(H&&H.block){if(!e._blT||gameTime-e._blT>.3){e._blT=gameTime;say(e,H.txt||'กัน!','#e8f0ff',15);}if(H.onBlock)H.onBlock();return 0;}
    if(H&&H.absorb!=null){/* an armour pool takes the hit: no HP / KO lost, the pool loses (damage − cut) */
      const hp0=e.hp,ko0=e.ko,kout=e.koOut,stun=e.st.stun,dn=window.dmgNum,tc=window.trackCombo;let d=0;
      try{dmgNum=_dn;trackCombo=_dn;e.hp=hp0+1e9;d=_h(e,mult,o);}finally{dmgNum=dn;trackCombo=tc;e.hp=hp0;}
      e.ko=ko0;e.koOut=kout;e.st.stun=stun;
      const left=Math.max(0,d-H.absorb);if(d>0){H.pool(left,d);dmgNum(e.x,e.y,(typeof MSPR_H==='function'?MSPR_H(e):60)+18,left,'taken',{scale:.85});}return 0;}}
  /* sand in the eyes (Sphinx's gust): the hero's physical hits on the boss and its parts get HIT − boss Lv while it lasts */
  const blind=(e.mb||B)&&hasBuff('mbBlind'),fl=blind?e.m.flee:0;if(blind)e.m.flee=(fl||0)+lvOf(e.mb?e:B);
  const hp0=e.hp;let d;try{d=_h(e,mult,o);}finally{if(blind)e.m.flee=fl;}
  if(B&&B.mb&&B.mb.D.partHurt&&d>0)B.mb.D.partHurt(B,e,d,o);
  if(e.mb&&d>0&&e.mb.D.hurtAfter)e.mb.D.hurtAfter(e,d,o,hp0);
  return d;};}
{const _de=drawEnemy;drawEnemy=function(e){if((e.mboss||e.mbPart)&&e.hidden)return;if(e.mbPart&&!e.dead&&e.drawFn&&!e.noHide&&e.hp>=e.maxHp&&!(window.TL&&TL.e===e))return;
  if(e.mbLift>0){const z=e.z;e.z=(z||0)+e.mbLift;try{_de(e);}finally{e.z=z;}return;}return _de(e);};}
/* e.mbTilt (radians): the boss sprite leans / topples round its feet (Trojan cart, drunk Polyphemus) — only the body, not its bars */
if(typeof window.MSPR_DRAW==='function'){const _md=window.MSPR_DRAW;window.MSPR_DRAW=function(e,x,y){const t=e&&e.mbTilt;if(!t)return _md.apply(this,arguments);
  ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.translate(-x,-y);try{return _md.apply(this,arguments);}finally{ctx.restore();}};}
if(typeof monsterCC==='function'){const _cc=monsterCC;monsterCC=function(e){if(e&&(e.mboss||e.mbOf))return;return _cc(e);};}
if(typeof mapBlockedW==='function'){const _mb=mapBlockedW;mapBlockedW=function(x,y){return _mb(x,y)||solidAt(x,y);};}
if(typeof nearestEnemy==='function'){const _ne=nearestEnemy;nearestEnemy=function(x,y,maxD,front){
  if(typeof autoMode==='undefined'||!autoMode)return _ne(x,y,maxD,front);
  let best=null,bd=maxD;for(const e of enemies){if(e.dead||e.mbNoAuto||e.hidden)continue;const d=Math.hypot(e.x-x,e.y-y);if(front!=null&&Math.abs(angDiff(Math.atan2(e.y-y,e.x-x),front))>1)continue;if(d<bd){bd=d;best=e;}}return best;};}
{const _ue=updEnemies;updEnemies=function(dt){_ue(dt);const e=MB.boss;
  for(let i=enemies.length-1;i>=0;i--){const o=enemies[i];if(o.mbPart){if(o.dead||o.gone){enemies.splice(i,1);continue;}if(o.fixed){o.x=o.fixed.x;o.y=o.fixed.y;o.vx=o.vy=0;}}}
  if(e&&e.mb){const L=e.mb.parts;for(let i=L.length-1;i>=0;i--)if(L[i].dead||L[i].gone)L.splice(i,1);}
  if(e&&e.mb&&e.mb.awake&&!e.dead&&curMap===e.mboss){const b=e.mb,R=b.R;
    for(const o of enemies){if(o===e||o.dead||o.mbOf||o.mbPart||o.mboss)continue;const dx=o.x-b.home.x,dy=o.y-b.home.y,d=Math.hypot(dx,dy);if(d<R&&d>1){o.x=b.home.x+dx/d*(R+4);o.y=b.home.y+dy/d*(R+4);o.aggro=0;o.tx=o.x;o.ty=o.y;}}}
  for(const k in DOTV)if(!hasBuff(k))delete DOTV[k];};}
if(typeof fieldRespawn==='function'){const _fr=fieldRespawn;fieldRespawn=function(e){const r=_fr(e);const B=MB.boss;if(r&&B&&B.mb&&!B.dead&&curMap===B.mboss&&!e.mbOf&&!e.mboss&&Math.hypot(e.x-B.mb.home.x,e.y-B.mb.home.y)<B.mb.R+40)outLair(e,B.mb);return r;};}
/* statuses on the hero, every frame (inside the game clock) */
let dotAcc=0;
{const _up=updatePlayer;updatePlayer=function(dt){const x0=player.x,y0=player.y;_up(dt);if(!(dt>0))return;
  if(player.hp<=0){if(PC.root||PC.grab||PC.pull||PC.stone||PC.dark||PC.seal||PC.silence||PC.blood)MB.pcClear();return;}
  const moved=Math.hypot(player.x-x0,player.y-y0)>.01;
  if(PC.grab){const g=PC.grab;g.t-=dt;let done=g.t<=0||(g.free&&g.free());if(!done&&g.pos){const p=g.pos();if(p&&fin(p[0])&&fin(p[1])){player.x=p[0];player.y=p[1];}}else if(!done){player.x=x0;player.y=y0;}
    if(done){PC.grab=null;delete player.buffs.mbGrab;if(g.end)g.end(g.t<=0);}}
  else if(PC.root>0||PC.stone>0){player.x=x0;player.y=y0;}
  if(PC.root>0){PC.root=Math.max(0,PC.root-dt*(moved?2:1));const b=player.buffs.mbRoot;if(b)b.t=PC.root;if(PC.root<=0)delete player.buffs.mbRoot;}
  if(PC.stone>0){PC.stone=Math.max(0,PC.stone-dt);if(PC.stone<=0)delete player.buffs.mbStone;}
  if(PC.pull){const p=PC.pull;p.t-=dt;const T=p.to&&p.to();if(T&&p.t>0){const dx=T[0]-player.x,dy=T[1]-player.y,d=Math.hypot(dx,dy);if(d>p.stop){const st=Math.min(d-p.stop,p.v*dt),nx=player.x+dx/d*st,ny=player.y+dy/d*st;if(!curMap||!mapBlockedW(nx,ny)){player.x=nx;player.y=ny;}}else if(p.reach){const f=p.reach;PC.pull=null;delete player.buffs.mbPull;f();}}
    if(PC.pull&&p.t<=0){PC.pull=null;delete player.buffs.mbPull;}}
  if(PC.seal){PC.seal.t-=dt;if(PC.seal.t<=0){PC.seal=null;refreshLocks();}}
  if(PC.silence>0){PC.silence-=dt;if(PC.silence<=0){PC.silence=0;refreshLocks();}}
  if(PC.blood>0){PC.blood-=dt;if(PC.blood<=0){PC.blood=0;refreshLocks();}}
  if(PC.dark){PC.dark.t-=dt;if(PC.dark.t<=0)PC.dark=null;}
  dotAcc+=dt;if(dotAcc>=1){dotAcc-=1;for(const k in DOTV)if(hasBuff(k)&&player.hp>1){const d=Math.max(1,DOTV[k]);player.hp=Math.max(1,player.hp-d);dmgNum(player.x,player.y,60,d,'taken',{scale:.6});}}};}
{const blocked=key=>{if(!MB.sealed(key))return false;msg(PC.silence>0?'เงียบ! ใช้สกิลไม่ได้':'สกิลนี้ถูกผนึกอยู่ 🗝');return true;};
 const _cs=castSkill;castSkill=function(key,c){if(blocked(key))return false;return _cs(key,c);};
 const _cn=castSkillNow;castSkillNow=function(key,c){if(blocked(key))return false;
   /* blood toll (Mummy Vizier): skills cost HP ×3 instead of SP while it lasts */
   const sk=SKILLS[key],bl=PC.blood>0&&sk&&(sk.mp||0)>0,sp=player.mp;if(bl){if(player.hp<=(sk.mp||0)*3+1){msg('เลือดไม่พอจ่ายค่าสกิล!');return false;}player.mp=player.maxMp+999;}
   let r;try{r=_cn(key,c);}finally{if(bl){player.mp=sp;if(r!==false){const d=Math.round((sk.mp||0)*3);player.hp=Math.max(1,player.hp-d);dmgNum(player.x,player.y,60,d,'taken',{scale:.7});}}}
   if(r!==false){USE.push({k:key,t:gameTime});if(USE.length>60)USE.shift();}return r;};}
if(typeof enterMap==='function'){const _em=enterMap;enterMap=function(id,sp){MB.pcClear();return _em(id,sp);};}
/* screen-space: darkness with a hole round the hero (+ light props), arrows to gold objects off screen */
if(typeof mapOverlay==='function'){const _mo=mapOverlay;let dk=null,dg=null;
  mapOverlay=function(){_mo();const e=MB.boss;if(!e||!e.mb||curMap!==e.mboss)return;
    const S=(wx,wy)=>{const [x,y]=P(wx,wy);return [x*Z+ox,y*Z+oy];};
    if(PC.dark&&player.hp>0){const d=PC.dark,f=Math.min(1,d.t/.4,(d.T-d.t+.05)/.35);if(!dk){dk=document.createElement('canvas');dg=dk.getContext('2d');}
      const w=Math.ceil(VW/2),h=Math.ceil(VH/2);if(dk.width!==w||dk.height!==h){dk.width=w;dk.height=h;}
      dg.globalCompositeOperation='source-over';dg.clearRect(0,0,w,h);dg.fillStyle=`rgba(${d.col},${d.a*f})`;dg.fillRect(0,0,w,h);dg.globalCompositeOperation='destination-out';
      const hole=(wx,wy,r)=>{const [sx,sy]=S(wx,wy),R=r*Z*.5;const g=dg.createRadialGradient(sx/2,sy/2,R*.55,sx/2,sy/2,R);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dg.fillStyle=g;dg.beginPath();dg.arc(sx/2,sy/2,R,0,T2);dg.fill();};
      hole(player.x,player.y-20,d.r);for(const q of e.mb.props)if(q.light&&!q.dead)hole(q.x,q.y,q.light);
      ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(dk,0,0,VW,VH);ctx.restore();}
    /* gold objects off screen → a small gold arrow at the edge */
    if(e.mb.awake&&!e.dead){ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);for(const p of e.mb.parts.concat(e.mb.props.filter(q=>q.arrow&&!q.dead))){if(p.dead||p.gold===0)continue;const [sx,sy]=S(p.x,p.y-20);if(sx>20&&sx<VW-20&&sy>60&&sy<VH-20)continue;
      const cx=VW/2,cy=VH/2,a=Math.atan2(sy-cy,sx-cx),m=34,x=clamp(sx,m,VW-m),y=clamp(sy,m+50,VH-m);ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#ffd23a';ctx.strokeStyle='#3a2408';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-7,-8);ctx.lineTo(-3,0);ctx.lineTo(-7,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}ctx.restore();}};}
/* UI + lock refresh on the game clock */
let lastT=performance.now(),lkT=0;(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.1,(n-lastT)/1000);lastT=n;try{drawUI(dt);if(PC.seal||PC.silence>0||PC.blood>0||lockSig){if((lkT+=dt)>.5){lkT=0;lockSig='?';}refreshLocks();}}catch(err){}})();
/* ---------------- small drawing helpers for boss scripts ---------------- */
MB.g={
  ell(x,y,rx,ry,fill,stroke,lw){ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,T2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.lineWidth=lw||2;ctx.strokeStyle=stroke;ctx.stroke();}},
  poly(pts,fill,stroke,lw){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.lineWidth=lw||2;ctx.lineJoin='round';ctx.strokeStyle=stroke;ctx.stroke();}},
  shadow(x,y,rx,a){ctx.save();ctx.globalAlpha*=(a==null?.3:a);ctx.fillStyle='#140c08';ctx.beginPath();ctx.ellipse(x,y,rx,rx*.32,0,0,T2);ctx.fill();ctx.restore();},
  glow(x,y,r,col,a){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a==null?.5:a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,T2);ctx.fill();ctx.restore();},
  text(x,y,t,size,col){ctx.save();ctx.font=`600 ${size||14}px Mitr,sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#2a1a0a';ctx.strokeText(t,x,y);ctx.fillStyle=col||'#fff3d6';ctx.fillText(t,x,y);ctx.restore();}};
/* ground-frame helper: draw in world units around (wx,wy) with the K squash */
MB.ground=(wx,wy,fn)=>{const [x,y]=P(wx,wy);ctx.save();ctx.translate(x,y);ctx.scale(1,K);fn();ctx.restore();};
})();
