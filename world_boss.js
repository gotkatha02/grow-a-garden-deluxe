/* =====================================================================
   WORLD BOSSES — core (owner 2026-11-23 '1' = build the world-boss fights).
   Design: WORLD_BOSS_TH.md (Urtok, Saturday) · WORLD_BOSS_WEEK_TH.md (the other six) · arenas maps/wboss-arenas.js.
   Way ก (offline): the player + 19 AI spirit warriors (วิญญาณนักรบ) fill the server's 20 places. Every rule works on "units"
   (the player + allies), so the boss state can later move to a server (ways ข / ค) without new rules.
   • Schedule, Thai time (UTC+7): the boss of the weekday at 12:30 and 20:30 · the gate opens 10 min before · a fight lasts 20 min
     (enrage at minute 16, advanced 13) · announcements 15 / 5 / 1 min before · one try per hero per round · late joiners fight
     until the round's end · test mode: any boss, any form, now.
   • Advanced form = the 20:30 round when the world level ≥ 50 at the week's start (offline: your own level; drops back under 47).
   • Damage of every boss move = the victim's level × k (DEF / MDEF as usual; telegraphed moves ignore FLEE) · advanced × 1.4.
   • Windows (ช่วงเปิด): parts with winOpen take DEF / MDEF 0 and every hit lands · allies hit ×1.5.
   • Points (contribution, divided by level): leg 1 a hit (crit 2) · part / core 1 per (Lv × 10) damage · adds 15 · tank 1 per
     (Lv × 2) taken in a guard spot · mech 30 per successful count zone … ≥ 150 = the chest. No last-hit bonus.
   • Boss scripts (wb_<key>.js) call WBOSS.def(key, D). D: hp(N) · build(S) (parts, every time the arena is entered) · think(S,dt)
     (moves when idle) · tick(S,dt) (always) · onHit(S,part,dmg,unit,o) · allyJob(a,S) / target(a,S) · hud(S) · drawOn(S) (over the
     picture) · drawGround(S) · solid [rx,ry,oy] · pickDefault(S) · enrage(S) · win / lose / reset.
   Hooks: updEnemies (tick) · enemyAI (adds) · hurt (hittable / range / window) · kill (adds, no EXP / drops) · drawEnemy (parts are
   drawn by the boss) · nearestEnemy (gold / inside parts only when locked) · mapBlockedW (the body) · TL.pick (click on the body) ·
   onPlayerDeath (back to the camp, no EXP loss) · enterMap (leave = forfeit) · gearCalc (blessings) · itemFx.afterHit (crit flag).
   ===================================================================== */
(function(){
'use strict';
if(typeof hurt!=='function'||typeof hitPlayer!=='function'||!window.MBK||!window.VK_MAPS||!window.AFItems)return;
const MB=window.MBK,T2=Math.PI*2,AF=window.AFItems;
const WB=window.WBOSS={defs:{},S:null,ver:1};
WB.def=(k,D)=>{WB.defs[k]=D;return D;};

/* ---------------- the seven ---------------- */
const INFO={
 khepra:   {day:0,map:'wbKhepra',   th:'เคปรา',    full:'เคปรา ด้วงสุริยะ',        adv:'เคปรา ร่างสุริยะพิโรธ',    dayTh:'อาทิตย์', col:'#ff5a4a',pos:[770,470],w:400,
            hint:'ยืนวงฟ้า ✓ ยันลูกอาทิตย์ให้หยุด → ด้วงหงายท้อง · ตะวันเที่ยงหลบในเงาเสา · เจมไฟเติมร้อน เจมน้ำแข็งดับร้อน',jobs:'VIT · INT'},
 puijantra:{day:1,map:'wbPuijantra',th:'ปุยจันทรา', full:'ปุยจันทรา กระต่ายจันทร์',  adv:'ปุยจันทรา ร่างจันทร์คราส', dayTh:'จันทร์',  col:'#ffd23a',pos:[770,470],w:400,
            hint:'เดินเก็บโมจิก่อนมันดูดกลับ · เต็มดวงใช้ท่าเป้าเดี่ยว (รวมศูนย์) · เดือนมืดเคลียร์ฝูงกระต่าย (กระจาย) → ตัวจริงหมดแรง',jobs:'DEX · INT'},
 burumba:  {day:2,map:'wbBurumba',  th:'บุรุมบา',   full:'บุรุมบา ช้างกลองศึก',      adv:'บุรุมบา ร่างศึกมหาสงคราม', dayTh:'อังคาร',  col:'#ff7ab0',pos:[770,470],w:400,
            hint:'ยืนแนวโล่ฟ้า ✓ ขวางตอนมันพุ่งชน → ชนกำแพงคนจนมึน · ยิงกลองบนหลังจากไกล · เจมตั้งการ์ดนับเป็น 2 คน',jobs:'VIT · STR'},
 mayawee:  {day:3,map:'wbMayawee',  th:'มายาวี',    full:'มายาวี กิ้งก่าพันสี',      adv:'มายาวี ร่างพันเขี้ยว',     dayTh:'พุธ',     col:'#5ad26a',pos:[770,470],w:400,
            hint:'ตีดอกตูม ◎ ให้สีสาดใส่ตัวที่ล่องหน → มองเห็น 15 วิ · เจมสะสมแต้ม / เร่งคูล ตุนสกิลไว้ยิงตอนมันโผล่',jobs:'DEX · LUK'},
 brontara: {day:4,map:'wbBrontara', th:'บรอนทารา',  full:'บรอนทารา นกอัสนี',        adv:'บรอนทารา ร่างราชาพายุ',    dayTh:'พฤหัสบดี',col:'#ff9a3a',pos:[770,520],w:400,fly:150,
            hint:'ยืนวงฟ้า ✓ ปลุกเสาล่อฟ้า · สายฟ้าลงใกล้เสาที่ตื่นถูกดูด ครบ 3 ยิงย้อน → นกร่วง · เจมไฟฟ้าเติมพายุ เจมเสาร่ายดูดสายฟ้า',jobs:'INT · DEX'},
 lumina:   {day:5,map:'wbLumina',   th:'ลูมินา',    full:'ลูมินา วาฬประกายพรึก',     adv:'ลูมินา ร่างดาราพิโรธ',     dayTh:'ศุกร์',   col:'#7ad0ff',pos:[770,470],w:400,fly:150,inner:'wbLuminaIn',
            hint:'ถูกกลืนไปทุบเศษดาวในท้อง · ข้างนอกตีจุดใต้ท้อง ◎ ให้มันไอพ่น → มึน · เจมดูดเลือด / ดูดพลังช่วยรอดในท้อง',jobs:'VIT · AGI'},
 urtok:    {day:6,map:'wbUrtok',    th:'เออร์ทอค',  full:'เออร์ทอค ผู้แบกโทเท็ม',    adv:'เออร์ทอค ร่างภูผาคลั่ง',    dayTh:'เสาร์',   col:'#b07aff',pos:[770,470],w:400,
            hint:'ขานับครั้งที่ตีโดน (เจมรัวเร็ว) → ล้มตะแคง หัวใจที่อกเปิด (ทุ่มหนัก / รวมศูนย์) · ยิงเสาคริสตัลบนกระดองจากไกล ≥ 150',jobs:'STR · AGI'}};
const ORDER=['khepra','puijantra','burumba','mayawee','brontara','lumina','urtok'];
WB.INFO=INFO;WB.ORDER=ORDER;
const keyOfMap=id=>ORDER.find(k=>INFO[k].map===id||INFO[k].inner===id)||null;
WB.keyOfMap=keyOfMap;

/* ---------------- save (per mode, shared by every hero of the mode; rounds per hero) ---------------- */
const PLAY=(()=>{try{return JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}').mode==='play';}catch(e){return false;}})();
const SK='af_wb_'+(PLAY?'play':'test');
let SV=null;try{SV=JSON.parse(localStorage.getItem(SK)||'null');}catch(e){}
if(!SV||SV.v!==1)SV={v:1,sc:0,wk:{id:'',done:{},got:0},rd:{},adv:{wk:'',on:0},n:{}};
const save=()=>{try{const k=Object.keys(SV.rd);if(k.length>60)for(const x of k.slice(0,k.length-60))delete SV.rd[x];localStorage.setItem(SK,JSON.stringify(SV));}catch(e){}};
WB.SV=()=>SV;WB.PLAY=PLAY;

/* ---------------- Thai time + rounds ---------------- */
const TZ=7*3600e3,MIN=60e3,DAY=864e5;
const thP=ms=>{const d=new Date(ms+TZ);return {y:d.getUTCFullYear(),mo:d.getUTCMonth(),d:d.getUTCDate(),wd:d.getUTCDay(),h:d.getUTCHours(),mi:d.getUTCMinutes()};};
const day0=ms=>{const p=thP(ms);return Date.UTC(p.y,p.mo,p.d)-TZ;};
const dkey=ms=>{const p=thP(ms);return p.y+'-'+(p.mo+1)+'-'+p.d;};
const weekId=ms=>{const p=thP(ms);return dkey(day0(ms)-((p.wd+6)%7)*DAY);};
const RT=[[12,30],[20,30]];
function rounds(ms){const out=[];for(let dd=-1;dd<3;dd++){const d0=day0(ms)+dd*DAY;RT.forEach((r,i)=>{const st=d0+(r[0]*60+r[1])*MIN;
  out.push({i,st,open:st-10*MIN,join:st+15*MIN,end:st+20*MIN,key:ORDER[thP(st).wd],id:dkey(st)+'#'+(i+1)});});}return out;}
const curRound=ms=>{ms=ms||Date.now();return rounds(ms).find(r=>ms>=r.open&&ms<r.end)||null;};
const nextRound=ms=>{ms=ms||Date.now();return rounds(ms).find(r=>r.open>ms)||null;};
function advOn(){const wk=weekId(Date.now());if(SV.adv.wk!==wk){const L=PS.lv||1;SV.adv={wk,on:(L>=50||(SV.adv.on&&L>=47))?1:0};save();}return !!SV.adv.on;}
const advRound=r=>r.i===1&&advOn();
const hhmm=ms=>{const p=thP(ms);return String(p.h).padStart(2,'0')+':'+String(p.mi).padStart(2,'0');};
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
WB.rounds=rounds;WB.curRound=curRound;WB.nextRound=nextRound;WB.advOn=advOn;

/* ---------------- pictures ---------------- */
const IMG={};
function pic(k,adv){const n=k+(adv?'_adv':'')+'_cut';let o=IMG[n];if(o)return o;o=IMG[n]={img:new Image(),ok:0,wh:null,n};
  o.img.onload=()=>{o.ok=1;try{const W=520,H=Math.round(W*o.img.height/o.img.width),c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    g.drawImage(o.img,0,0,W,H);g.globalCompositeOperation='source-in';g.fillStyle='#fff';g.fillRect(0,0,W,H);o.wh=c;}catch(e){}};
  o.img.src='assets/bosses/world/'+n+'.webp';return o;}
WB.pic=pic;

/* ---------------- small helpers ---------------- */
const hyp=Math.hypot,cl=(v,a,b)=>v<a?a:v>b?b:v,rn=(a,b)=>a+Math.random()*(b-a);
const F2W=(fx,fy)=>[fx*1.5,fy*1.5/K];          /* arena floor-picture px → world */
WB.F2W=F2W;
const blk=(x,y)=>typeof mapBlockedW==='function'&&mapBlockedW(x,y);
function say(x,y,z,txt,col,sz,life){addFx(new DText({x,y,z:z||70,text:txt,color:col||'#ffe9a8',size:sz||15,life:life||1.3}));}
WB.say=say;
const chat=h=>{try{chatLog('sys',h);}catch(e){}};

/* ---------------- units: the player + the allies ---------------- */
const PU={pl:1,id:0,role:'me',name:'คุณ',get x(){return player.x},set x(v){player.x=v},get y(){return player.y},set y(v){player.y=v},
  get lv(){return PS.lv||1},get hp(){return player.hp},get maxHp(){return player.maxHp},dmg10:[],still:0,zt:{},
  alive(){const S=WB.S;return player.hp>0&&!(S&&S.ghost>0)&&!!(S&&S.here);}};
WB.PU=PU;
function units(room){const S=WB.S;if(!S)return [];const L=[];if(PU.alive()&&(room?S.room===room:S.room!=='in'))L.push(PU);for(const a of S.allies)if(!a.dead&&(room?a.room===room:a.room!=='in'))L.push(a);return L;}
WB.units=units;
const advK=()=>WB.S&&WB.S.adv?1.4:1;
WB.raw=(u,k,o)=>Math.max(1,Math.round(u.lv*k*advK()+((o&&o.add)||0)+((WB.S&&WB.S.addDmg)||0)*u.lv));
/* a boss move lands on a unit (true when it did damage) */
WB.dmg=function(u,k,o){o=o||{};const S=WB.S;if(!S||!u||!u.alive())return false;const raw=WB.raw(u,k,o);
  const from=o.from!=null?o.from:Math.atan2(u.y-(o.fy!=null?o.fy:S.B.y),u.x-(o.fx!=null?o.fx:S.B.x));
  if(u.pl){const B=S.B,sv=B.m;B.m=Object.assign({},sv,{atk:[raw,raw],hit:999});const h0=player.hp;
    try{hitPlayer(B,{magic:!!o.magic,sure:o.sure!==0});}finally{B.m=sv;}
    const d=h0-player.hp;if(d<=0)return false;S.tookT=gameTime;if(o.tank)addPts(PU,'tank',d/(PU.lv*2));
    if(o.dot)MB.dot(o.dot[0],o.dot[1],PU.lv*(o.dot[2]||1));
    if(o.push&&player.hp>0)MB.shove(Math.cos(from)*o.push,Math.sin(from)*o.push);
    if(o.cc&&player.hp>0)playerCC(o.cc[0],o.cc[1]);if(o.pc&&player.hp>0)MB.pc(o.pc[0],o.pc[1],o.pc[2]);
    if(o.after)o.after(u,d);return true;}
  const d=Math.max(1,Math.round(defAdjust(raw,o.magic?u.mdef:u.def)*(u.guard>0?.5:1)));u.hp-=d;u.flash=1;if(o.tank)addPts(u,'tank',d/(u.lv*2));
  if(o.push){const n=Math.ceil(o.push/12);for(let i=0;i<n;i++){const x=u.x+Math.cos(from)*o.push/n,y=u.y+Math.sin(from)*o.push/n;if(blk(x,y))break;u.x=x;u.y=y;}}
  if(o.cc)u.ccT=Math.max(u.ccT||0,o.cc[1]||.6);if(o.pc&&(o.pc[0]==='root'||o.pc[0]==='stone'))u.ccT=Math.max(u.ccT||0,o.pc[1]*.7);
  if(o.after)o.after(u,d);if(u.hp<=0)allyDie(u);return true;};
WB.healU=function(u,n,src){if(!u||!u.alive())return 0;n=Math.round(n);if(u.pl){const h=Math.min(n,player.maxHp-player.hp);if(h<=0)return 0;player.hp+=h;dmgNum(player.x,player.y,74,'+'+h,'heal',{scale:.6});return h;}
  const h=Math.min(n,u.maxHp-u.hp);if(h<=0)return 0;u.hp+=h;u.healT=.5;return h;};

/* ---------------- points ---------------- */
const JOBS={leg:'ทุบขา / ตีตัว',part:'ทำลายของ ◎',core:'ตีจุดตาย',adds:'กำจัดลูกน้อง',tank:'รับดาเมจแทน',heal:'ฮีล',mech:'ทำกลไก'};
WB.JOBS=JOBS;
function addPts(u,job,n){const S=WB.S;if(!S||!(n>0))return;const P=u.pl?S.me:u.pts;P[job]=(P[job]||0)+n;P.tot=(P.tot||0)+n;}
WB.pts=addPts;
const recDmg=(u,d)=>{u.dmg10.push([gameTime,d]);if(u.dmg10.length>40)u.dmg10.shift();};
WB.topDealer=function(room){let best=null,bd=-1;const t0=gameTime-10;for(const u of units(room)){let s=0;for(const q of u.dmg10)if(q[0]>t0)s+=q[1]/Math.max(1,u.lv);if(s>bd){bd=s;best=u;}}return best;};

/* ---------------- strikes (telegraph → hits every unit inside) ---------------- */
WB.strike=function(o){const S=WB.S;if(!S)return null;const T=Math.max(.45,(o.T||1)*(S.enr?.8:1));
  const w=MB.warn(Object.assign({},o,{e:null,life:T}));w.wb=S.id;w.room=o.room||'out';S.warns.push(w);{const d0=w.draw;w.draw=function(){const S2=WB.S;if(S2&&(S2.room==='in')!==(this.room==='in'))return;return d0.call(this);};}const ac=S.B&&S.B.mb&&S.B.mb.act;if(ac&&!o.keep)(ac.ws=ac.ws||[]).push(w);
  w.fire=()=>{if(!WB.S||WB.S.id!==w.wb)return;if(o.pre)o.pre(w);const s=w.shape,hit=[];
    for(const u of units(w.room==='in'?'in':null)){if(!MB.inShape(s,u.x,u.y,o.pad==null?10:o.pad))continue;if(o.only&&!o.only(u))continue;if(o.cover&&MB.covered(o.cover(w),u.x,u.y))continue;
      if(o.noHit)hit.push(u);else if(WB.dmg(u,o.k||5,o))hit.push(u);}
    if(o.boom!==0&&(S.room==='in')===(w.room==='in'))MB.boom(s,o.boomCol||(o.col==='purple'?'#c890ff':null),o.boomKind);if(o.onFire)o.onFire(hit,w);};
  return w;};
/* count zones: a blue ✓ shape that counts the units inside when it ends ('ยืนวง' mechanics) */
WB.zone=function(o){const S=WB.S;const z=Object.assign({t:0,n:0,on:[],dead:0,ok:0,pts:30},o);z.w=MB.safe(o.shape,o.life,{noTick:1});z.w.wb=S.id;S.zones.push(z);return z;};
function zoneTick(z,dt){z.t+=dt;let n=0;const on=[];for(const u of units()){if(z.crewOnly!==0&&!u.pl&&!(z.crew&&z.crew.includes(u)))continue;if(MB.inShape(z.shape,u.x,u.y,6)){n+=z.weight?z.weight(u):1;on.push(u);}}z.n=n;z.on=on;
  if(z.track)z.track(z,dt);if(z.w)z.w.shape=z.shape;
  if(z.t>=z.life&&!z.done){z.done=1;z.ok=n>=z.need;if(z.ok)for(const u of on)addPts(u,'mech',z.pts);if(z.onEnd)z.onEnd(z.ok,z);z.dead=1;for(const a of z.crew||[])if(a.busy===z)a.busy=null;}}
/* lingering hazards (burning trails, acid, ice floors …): red ground that ticks k every `every` s on units inside */
WB.field=function(o){const S=WB.S;const f=Object.assign({t:0,every:.6,k:3,col:'#ff5a2a',room:'out',acc:0},o);S.fields=S.fields||[];S.fields.push(f);
  addFx({layer:'ground',t:0,update(dt){this.t+=dt;return !f.dead&&f.t<f.life&&WB.S===S&&!S.gone;},draw(){if(S.room!==(f.room||'out'))return;const s=f.shape,a=Math.min(1,f.t/.3,(f.life-f.t)/.5);
    if(s.k==='multi')return;const [x,y]=P(s.x,s.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.32*a;ctx.fillStyle=f.col;
    if(s.k==='circle'){ctx.beginPath();ctx.arc(0,0,s.r,0,T2);ctx.fill();}else if(s.k==='rect'){ctx.rotate(s.phi);ctx.fillRect(s.off||0,-s.w/2,s.len-(s.off||0),s.w);}
    ctx.globalAlpha=.6*a;ctx.strokeStyle=f.col;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.lineDashOffset=-gameTime*25;if(s.k==='circle'){ctx.beginPath();ctx.arc(0,0,s.r,0,T2);ctx.stroke();}else ctx.strokeRect(s.off||0,-s.w/2,s.len-(s.off||0),s.w);
    ctx.restore();ctx.globalAlpha=1;}});
  return f;};
function fieldTick(S,dt){if(!S.fields)return;for(let i=S.fields.length-1;i>=0;i--){const f=S.fields[i];f.t+=dt;if(f.dead||f.t>=f.life){S.fields.splice(i,1);continue;}
  f.acc+=dt;if(f.acc>=f.every){f.acc-=f.every;for(const u of units(f.room==='in'?'in':null))if(MB.inShape(f.shape,u.x,u.y,4))WB.dmg(u,f.k,{sure:1,magic:f.magic,dot:f.dot});}}}
/* the crew of a count zone: the n nearest allies (tanks first) are sent to stand in it */
WB.crew=function(z,n,pref){const S=WB.S;const order=pref||['tank','melee','crit','healer','archer','mage'];const L=S.allies.filter(a=>!a.dead&&a.room!=='in'&&!(a.busy&&a.busy!==z)&&a.ccT<=0);
  const c=zoneMid(z.shape);L.sort((a,b)=>(order.indexOf(a.role)-order.indexOf(b.role))*400+hyp(a.x-c.x,a.y-c.y)-hyp(b.x-c.x,b.y-c.y));
  z.crew=L.slice(0,Math.max(0,n));for(const a of z.crew){a.busy=z;a.reT=0;}return z.crew;};
const zoneMid=s=>s.k==='rect'?{x:s.x+Math.cos(s.phi)*((s.off||0)+s.len)/2,y:s.y+Math.sin(s.phi)*((s.off||0)+s.len)/2}:{x:s.x,y:s.y};
WB.zoneMid=zoneMid;
/* where an ally of a crew stands inside its zone */
WB.crewSpot=function(a,z){const r0=crewSpot0(a,z);r0.crew=1;return r0;};
function crewSpot0(a,z){const c=zoneMid(z.shape),i=z.crew?z.crew.indexOf(a):0,n=Math.max(1,z.crew?z.crew.length:1),an=i/n*T2+.4;
  const r=z.shape.k==='circle'?z.shape.r*.45:Math.min(z.shape.w||40,40)*.3;let x=c.x+Math.cos(an)*r,y=c.y+Math.sin(an)*r*.7;
  if(z.shape.k==='rect'){const t=(i-(n-1)/2)*Math.min(46,(z.shape.len-(z.shape.off||0))/(n+1));x=c.x+Math.cos(z.shape.phi)*t;y=c.y+Math.sin(z.shape.phi)*t;}
  return {x,y,r:8,stay:1};}
/* how many people a count zone still lacks — offline the spirit warriors fill all but one place while you are alive: you are the one it waits for */
WB.need=n=>Math.max(0,n-(PU.alive()?1:0));
WB.inDanger=function(x,y,room){const S=WB.S;if(!S)return null;for(const w of S.warns)if(!w.fired&&!w.dead&&w.col!=='blue'&&(w.room||'out')===(room||'out')&&MB.inShape(w.shape,x,y,14))return w;return null;};

/* ---------------- windows · casts · pause ---------------- */
WB.window=function(sec,txt){const S=WB.S;if(!S)return;sec=Math.max(4,sec-(S.adv?3:0));S.win=Math.max(S.win,sec);S.winT=Math.max(S.winT||0,S.win);MB.window(S.B,sec,txt);S.B.mb.win=0;
  for(const z of S.zones)if(z.cancelOnWin)z.dead=1;};
WB.pause=function(sec,txt){const S=WB.S;if(!S)return;MB.cancel(S.B);S.pause=Math.max(S.pause,sec);MB.banner(txt||'⏸ พักเปลี่ยนเฟส '+sec+' วิ — สลับหน้าเสาโทเท็มได้','blue',2.4);};
/* an action of the boss (MBK.act): {name, T, start, step(B,a,dt), end, brk:true = gold bar, the KO gauge must be emptied, broken} */
WB.act=function(a){const S=WB.S;if(a.brk){S.koMax=Math.round(a.koN||(180+S.N*14));S.ko=S.koMax;S.koOn=1;a.brk=0;}else S.koOn=0;return MB.act(S.B,a);};
function breakCast(){const S=WB.S,B=S.B,a=B.mb.act;S.koOn=0;MB.cancel(B);MB.say(B,'ขัดจังหวะ!','#ffd23a',22);MB.banner('✦ ขัดจังหวะสำเร็จ!','gold',2);if(a&&a.broken)a.broken(B,a);}
WB.koHit=function(n){const S=WB.S;if(!S||!S.koOn)return;S.ko-=n;if(S.ko<=0){S.ko=0;breakCast();}};

/* ---------------- parts (hittable pieces: legs, the heart, pillars, drums, buds …) ---------------- */
WB.part=function(o){const S=WB.S,B=S.B;const p=MB.part(B,{x:o.x,y:o.y,hp:o.hp||1e9,name:o.name,th:o.th,r:o.r||26,h:o.h||54,def:o.def,mdef:o.mdef,race:o.race||B.m.race,el:o.el||B.m.el,
    auto:o.auto?1:0,gold:0,mark:0,kind:o.kind,draw:()=>{},fixed:o.fixed,data:o.data,breakT:o.breakT||.6,onBreak:p2=>{if(o.onBreak)o.onBreak(p2);}});
  Object.assign(p,{wbPart:1,job:o.job||'part',nohp:o.nohp?1:0,main:o.main?1:0,winOpen:o.winOpen?1:0,minD:o.minD||0,maxD:o.maxD||0,hitOK:o.hitOK||null,noNear:o.noNear?1:0,
    z0:o.z||0,z:o.z||0,allyMul:o.allyMul||1,koPart:o.ko?1:0,goldMark:o.goldMark?1:0,lab:o.lab||null,scr:null,fol:o.fol||null,dmgMul:o.dmgMul||1});
  p.sc=(o.h||54)/54;if(o.flee!=null)p.m.flee=o.flee;if(o.luk!=null)p.m.luk=o.luk;p.koMax=1e9;p.ko=1e9;p.noKO=1;if(o.tlv)p.tlv=o.tlv;
  S.parts.push(p);return p;};
/* the boss's own body as a hittable part (main HP; follows the boss; DEF 0 + sure hits in windows) */
WB.body=function(o){const S=WB.S,B=S.B;const p=WB.part(Object.assign({x:B.x+o.dx,y:B.y+o.dy,fol:[o.dx,o.dy],name:S.I.full,th:S.adv?S.I.adv:S.I.full,hp:Math.max(1,S.hp),r:110,h:120,main:1,winOpen:1,job:'core',auto:1,kind:'body',
    def:B.m.def,mdef:B.m.mdef,dmgMul:.3,onBreak:()=>WB.end('win')},o));p.maxHp=S.hpMax;p.hp=Math.max(1,S.hp);return p;};
/* damage the player cannot see (fighters in the other room): straight into the main pool, points as a hit */
WB.mainHit=function(n,u,job){const S=WB.S;if(!S||!(n>0)||S.state!=='fight')return;S.hp=Math.max(0,S.hp-n);for(const p of S.parts)if(p.main&&!p.dead)p.hp=Math.max(1,S.hp);
  if(u){recDmg(u,n);addPts(u,job||'core',n/(u.lv*10));}if(S.hp<=0)WB.end('win');};
/* the heal of a boss goes into its main pool (and the body part that holds it) */
WB.heal=function(n){const S=WB.S;if(!S)return;S.hp=Math.min(S.hpMax,S.hp+n);for(const p of S.parts)if(p.main&&!p.dead)p.hp=S.hp;};
/* map props the fight redraws itself (buds, lightning rods, the star shard …): hidden in the map, restored when the session ends */
WB.mapObjs=function(n){const h=mapHost();const L=h&&h._objs?h._objs.filter(o=>o.n===n):[];return L.map(o=>{const [x,y]=M2W({x:o.x,y:o.y});return {o,x,y};});};
WB.hideObj=function(o){const S=WB.S;if(!o||o._wbW!=null)return;o._wbW=o.w;o.w=0;if(S)(S.hid=S.hid||[]).push(o);};
const restoreObjs=S=>{for(const o of S.hid||[]){if(o._wbW!=null){o.w=o._wbW;delete o._wbW;}}S.hid=[];};
const PIMG={};WB.img=f=>{let o=PIMG[f];if(!o){o=PIMG[f]={img:new Image(),ok:0};o.img.onload=()=>{o.ok=1;};o.img.src=f;}return o;};
/* draw a map piece picture (maps/wboss/<f>.webp) standing at a world point: h = map px tall, ay = foot (0…1) */
WB.drawPiece=function(f,x,y,h,ay,o){const I=WB.img('maps/wboss/'+f+'.webp');if(!I.ok)return;const im=I.img,w=h*im.width/im.height,[X,Y]=P(x,y,(o&&o.z)||0);ctx.save();if(o&&o.alpha!=null)ctx.globalAlpha=o.alpha;
  ctx.translate(X,Y);if(o&&o.flip)ctx.scale(-1,1);if(o&&o.sc)ctx.scale(o.sc,o.sc);ctx.drawImage(im,-w/2,-ay*h,w,h);if(o&&o.glow){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=o.glow;ctx.drawImage(im,-w/2,-ay*h,w,h);}ctx.restore();};
WB.livePart=p=>!!p&&!p.dead&&!p.gone&&enemies.includes(p);
const canHit=(p,u,o)=>{if(!p||p.dead)return false;if(p.hidden)return false;if(p.hitOK&&!p.hitOK(u,o||{}))return false;const d=hyp(u.x-p.x,u.y-p.y);if(p.minD&&d<p.minD)return false;return true;};
WB.canHit=canHit;
function onHit(p,d,u,o){const S=WB.S,D=S.D;if(!S)return;recDmg(u,d);
  if(p.job==='leg')addPts(u,'leg',o.crit?2:1);else if(p.job==='core'||p.job==='part')addPts(u,p.job,d/(u.lv*10));
  if(p.main){S.hp=Math.max(0,p.hp);}
  if(p.koPart&&S.koOn)WB.koHit(u.pl?Math.min(6,o.mult||1)*7:4.5);
  if(D.onHit)D.onHit(S,p,d,u,o);}
/* an ally's hit on a part or an add (no hurt(): the player's on-hit gear, gems and seals never fire for allies) */
WB.allyHit=function(a,e,d,o){const S=WB.S;if(!S||!e||e.dead)return 0;o=o||{};
  if(e.wbPart){if(!canHit(e,a,o))return 0;d=Math.max(1,Math.round(d*e.allyMul*(S.win>0&&e.winOpen?1.5:e.dmgMul||1)));
    if(!e.nohp){e.hp-=d;}onHit(e,d,a,o);if(!e.nohp&&e.hp<=0&&!e.dead)MB.breakPart(e);}
  else if(e.wbAdd){if(e.wbAdd.dodge&&!(a.R.hitAll||o.splash)&&(a.dg=(a.dg||0)+1)%e.wbAdd.dodge!==0)return 0;e.hp-=d;e.flash=1;e._hurtT=gameTime;recDmg(a,d);if(e.hp<=0)addDie(e,a);}
  return d;};

/* ---------------- adds (minions: spirits, ghost army, mini rabbits …) ---------------- */
WB.add=function(o){const S=WB.S;const lv=o.lv||60,ms=monStats(lv,o.role||'normal');const e=spawnEnemy(o.x,o.y,false,null);
  e.m=Object.assign({},ms,{name:o.name||'Spirit',th:o.th||o.name,lv,hp:o.hp,atk:[0,0],flee:o.flee!=null?o.flee:ms.flee,def:o.def!=null?o.def:Math.round(ms.def*.6),mdef:o.mdef!=null?o.mdef:ms.mdef,
    race:o.race||'Formless',el:o.el||'Neutral 1',size:'small'});
  Object.assign(e,{hp:o.hp,maxHp:o.hp,spr:o.spr,wbAdd:o,mbOf:S.B,vdef:null,sc:(o.sc||1)*MAP_CHAR,r:o.r||16,_mv:0,_wp:0,koMax:1e9,ko:1e9,noKO:1,aggro:0,acd:o.acd0||0,born:gameTime,room:o.room||'out'});
  if(!enemies.includes(e))enemies.push(e);S.adds.push(e);return e;};
function addDie(e,u){if(e.dead)return;const S=WB.S;e.dead=true;e.deadT=0;e.hp=0;if(player.attackTarget===e)player.attackTarget=null;
  if(S&&u)addPts(u,'adds',e.wbAdd.pts!=null?e.wbAdd.pts:15);try{dustPuff(e.x,e.y,6,'#d8d0f0',60,8);}catch(err){}if(e.wbAdd.die)e.wbAdd.die(e,u);}
WB.addDie=addDie;
function addAI(e,dt){const o=e.wbAdd;e.acd-=dt;e.atk=0;if(e.st.stun>0||e.st.frozen>0||e.st.root>0){e._mv=0;return;}
  const T=o.goal?o.goal(e,dt):null;if(!T){e._mv=0;return;}
  const dx=T.x-e.x,dy=T.y-e.y,L=hyp(dx,dy),reach=T.reach==null?28:T.reach;
  if(L>reach){const v=(o.spd||70)*(e.st.slow>0?.55:1)*dt,s=Math.min(L-reach,v);const nx=e.x+dx/L*s,ny=e.y+dy/L*s;if(o.fly||!blk(nx,ny)){e.x=nx;e.y=ny;}else{e.x+=-dy/L*s*.7;e.y+=dx/L*s*.7;}
    e._mv=.15;e._wp=(e._wp||0)+s/70;if(Math.abs(dx)>3)e.face=dx>0?1:-1;}
  else{e._mv=0;if(o.arrive)o.arrive(e,T,dt);else if(T.u&&e.acd<=0){e.acd=o.atkT||1.6;e._hitT=gameTime;WB.dmg(T.u,o.k||3,{sure:1,fx:e.x,fy:e.y});}}}

/* ---------------- allies: the spirit warriors ---------------- */
const ROLES={
  tank:  {n:'โล่',  c:'#ffd27a',hp:2.4,def:70,mdef:30,iv:.95,mul:.55,rng:0},
  melee: {n:'ดาบ', c:'#ff8a6a',hp:1.0,def:38,mdef:20,iv:.7, mul:1.0,rng:0},
  crit:  {n:'คริ', c:'#ffe14a',hp:.95,def:32,mdef:20,iv:.75,mul:1.0,rng:0,crit:3},
  mage:  {n:'เวท', c:'#c890ff',hp:.85,def:20,mdef:60,iv:1.4,mul:1.15,rng:300,mag:1,splash:70},
  archer:{n:'ธนู', c:'#8ad8ff',hp:.9, def:26,mdef:26,iv:.9, mul:.95,rng:340,hitAll:1},
  healer:{n:'ฮีล', c:'#7af0d0',hp:.9, def:26,mdef:50,iv:1.6,mul:.35,rng:280,mag:1,heal:1}};
WB.ROLES=ROLES;
const COMP=['tank','tank','tank','melee','melee','melee','melee','melee','crit','crit','mage','mage','mage','mage','archer','archer','archer','healer','healer'];
const ALLY_DPS=600;   /* a Lv 60 spirit warrior's damage a second (single target): the offline pacing (ways ข / ค use real players) */
function mkAllies(S){const L0=PS.lv||1,off=[-4,-2,0,1,3,-3,2,-1,1,0];S.allies=COMP.map((role,i)=>{const R=ROLES[role],lv=cl(Math.round(L0+off[i%10]),20,60);
  const maxHp=Math.round((300+14*lv)*R.hp*1.15),k=1+COMP.slice(0,i).filter(x=>x===role).length;
  return {id:i+1,role,R,lv,name:'วิญญาณ'+R.n+' '+k,hp:maxHp,maxHp,def:R.def+Math.round(lv/4),mdef:R.mdef+Math.round(lv/5),x:0,y:0,dir:'N',animT:Math.random()*3,moving:false,
    act:0,acd:Math.random()*R.iv,dead:false,rt:0,ccT:0,flash:0,react:.26+((i*37)%10)/10*.55,slot:(i*2.399)%T2,pts:{tot:0},dmg10:[],still:0,zt:{},job:null,reT:0,stuck:0,
    pw:ALLY_DPS*(lv/60)*R.iv*R.mul,room:'out',fade:0,alive(){return !this.dead;}};});}
function placeAllies(S,around){for(const a of S.allies){for(let k=0;k<20;k++){const an=a.slot+k*.4,r=60+((a.id*53)%9)*16+k*6,x=around.x+Math.cos(an)*r,y=around.y+Math.sin(an)*r*.8;if(!blk(x,y)){a.x=x;a.y=y;break;}}}}
function allyDie(a){if(a.dead)return;a.dead=true;a.rt=10;a.hp=0;a.fade=1;try{dustPuff(a.x,a.y,6,'#bfe8ff',60,8);}catch(e){}}
function allyRevive(a){const S=WB.S;a.dead=false;a.hp=a.maxHp;a.room='out';const c=S.camp;a.x=c.x+rn(-60,60);a.y=c.y+rn(-30,30);a.job=null;a.reT=0;a.ccT=0;a.fade=0;addPts(a,'mech',0);}
const faceA=(a,dx,dy)=>{if(Math.abs(dx)+Math.abs(dy)>.01)a.dir=dirOf(Math.atan2(dy,dx));};
function stepA(a,ux,uy,s){for(const da of [0,.45,-.45,.9,-.9,1.4,-1.4]){const c=Math.cos(da),n=Math.sin(da),vx=ux*c-uy*n,vy=ux*n+uy*c,nx=a.x+vx*s,ny=a.y+vy*s;
  if(!blk(nx,ny)&&!(WB.S.solid&&WB.S.solid(nx,ny))){a.x=nx;a.y=ny;faceA(a,vx,vy);return true;}}return false;}
function escPt(a){const S=WB.S;const w=WB.inDanger(a.x,a.y,a.room);if(!w||w.t<a.react)return null;const s=w.shape;
  const cx=s.k==='rect'?s.x+Math.cos(s.phi)*s.len*.5:s.x,cy=s.k==='rect'?s.y+Math.sin(s.phi)*s.len*.5:s.y;
  let base=Math.atan2(a.y-cy,a.x-cx);if(s.k==='rect'){const sd=Math.sign(-(a.x-s.x)*Math.sin(s.phi)+(a.y-s.y)*Math.cos(s.phi))||1;base=s.phi+sd*Math.PI/2;}
  let best=null,bd=1e9;for(const da of [0,.5,-.5,1,-1,1.6,-1.6,Math.PI])for(const r of [50,90,140,200,270]){const x=a.x+Math.cos(base+da)*r,y=a.y+Math.sin(base+da)*r;
    if(blk(x,y)||(S.solid&&S.solid(x,y))||WB.inDanger(x,y,a.room))continue;const c=r+Math.abs(da)*40;if(c<bd){bd=c;best={x,y,r:10};}}
  return best;}
function healTarget(a){let best=null,bk=.82;for(const u of units(a.room)){if(hyp(u.x-a.x,u.y-a.y)>360)continue;const k=u.hp/u.maxHp;if(k<bk){bk=k;best=u;}}return best;}
function standPt(a,t,J){const S=WB.S,R=a.R;const rr=J&&J.rng!=null?J.rng:R.rng?Math.max(J&&J.min||0,R.rng*.78):(t.r||20)+22;
  let base=Math.atan2(a.y-t.y,a.x-t.x);if(J&&J.out&&S.B)base=Math.atan2(t.y-S.B.y,t.x-S.B.x);
  for(let k=0;k<11;k++){const an=base+((a.slot%1.4)-.7)+((k%2?1:-1)*Math.ceil(k/2)*.42),x=t.x+Math.cos(an)*rr,y=t.y+Math.sin(an)*rr*(R.rng?.85:1);
    if(!blk(x,y)&&!(S.solid&&S.solid(x,y))&&!WB.inDanger(x,y,a.room))return {x,y,r:R.rng?34:12};}
  return {x:t.x,y:t.y,r:rr+4};}
function pickJob(a){const S=WB.S,D=S.D;if(a.busy&&!a.busy.dead&&!a.busy.done)return WB.crewSpot(a,a.busy);a.busy=null;let J=D.allyJob?D.allyJob(a,S):null;
  if(!J){const t=D.target?D.target(a,S):null;J=t?{tgt:t}:null;}
  if(J&&J.tgt)J.sp=standPt(a,J.tgt,J);return J;}
const jobOK=a=>{const J=a.job;if(!J)return false;if(a.busy&&!J.stay)return false;if(J.stay&&!(a.busy&&!a.busy.dead&&!a.busy.done)&&J.crew)return false;if(J.tgt&&(J.tgt.dead||J.tgt.gone||J.tgt.hidden))return false;if(J.until&&gameTime>J.until)return false;return true;};
function allyAttack(a,t,J){const S=WB.S,R=a.R;a.acd=R.iv*rn(.9,1.1);a.act=.42;faceA(a,t.x-a.x,t.y-a.y);
  let d=a.pw;let crit=0;if(R.crit){a.cn=(a.cn||0)+1;if(a.cn>=R.crit){a.cn=0;crit=1;d*=1.4;}}
  if(J&&J.mul)d*=J.mul;shotFx(a,t);
  const L=R.splash?enemies.filter(e=>!e.dead&&(e.wbPart||e.wbAdd)&&e.room!=='in'===(a.room!=='in')&&hyp(e.x-t.x,e.y-t.y)<R.splash+(e.r||16)*.5):[t];
  for(const e of L)WB.allyHit(a,e,e===t?d:d*.6,{crit,magic:!!R.mag,splash:e!==t});}
function allyTick(a,dt){const S=WB.S;
  if(a.dead){a.rt-=dt;if(a.rt<=0)allyRevive(a);return;}
  a.animT+=dt;a.flash=Math.max(0,a.flash-dt*5);if(a.act>0)a.act-=dt;a.acd-=dt;if(a.guard>0)a.guard-=dt;if(a.healT>0)a.healT-=dt;
  if(a.ccT>0){a.ccT-=dt;a.moving=false;return;}
  if(a.R.heal&&S.state==='fight'){a.hcd=(a.hcd||0)-dt;if(a.hcd<=0){const f=healTarget(a);if(f){a.hcd=2.6;const h=WB.healU(f,a.lv*7,a);if(h>0){addPts(a,'heal',h/(a.lv*3));healFx(a,f);}}else a.hcd=.5;}}
  /* in the other room than the player (Lumina's stomach): no walking on this map's walls, the boss file plays them out (D.allyAway) */
  if(S.here&&(a.room==='in')!==(S.room==='in')){a.moving=false;a.act=0;if(S.state==='fight'&&S.D.allyAway)S.D.allyAway(a,dt,S);return;}
  const esc=S.state==='fight'&&!(a.job&&a.job.stay)?escPt(a):null;let goal=null,tgt=null;
  if(esc){goal=esc;}
  else{a.reT-=dt;if(a.reT<=0||!jobOK(a)){a.job=S.state==='fight'?pickJob(a):(S.D.idleJob?S.D.idleJob(a,S):{x:S.camp.x+Math.cos(a.slot)*(90+a.id*6),y:S.camp.y-150+Math.sin(a.slot)*50,r:14});a.reT=1.1+Math.random()*1.3;}
    const J=a.job;if(J){if(J.tgt){tgt=J.tgt;goal=J.sp;}else if(J.x!=null)goal={x:J.x,y:J.y,r:J.r||12};}}
  let moved=false;
  if(goal){const dx=goal.x-a.x,dy=goal.y-a.y,L=hyp(dx,dy),tol=goal.r||12;if(L>tol){moved=stepA(a,dx/L,dy/L,Math.min(L-tol*.5,(esc?190:155)*dt));
      if(!moved){a.stuck+=dt;if(a.stuck>1.2){a.stuck=0;a.slot+=1.3;a.reT=0;if(a.job&&a.job.tgt)a.job.sp=standPt(a,a.job.tgt,a.job);}}else a.stuck=0;}}
  a.moving=moved;a.still=moved?0:a.still+dt;
  if(tgt&&!tgt.dead&&!esc&&S.state==='fight'){const d=hyp(tgt.x-a.x,tgt.y-a.y),rng=(a.R.rng||50)+(tgt.r||20)+14;
    if(d<=rng&&a.acd<=0&&canHit(tgt,a)&&(!a.job||!a.job.noHit))allyAttack(a,tgt,a.job);if(!moved)faceA(a,tgt.x-a.x,tgt.y-a.y);}}
/* spirit warriors are drawn from the hero's own frames (the townsfolk way: 15 heroes' atlases are too heavy to load), as glowing spirits */
const GHC=new Map();
function ghostFrame(fe){const r=frameRect(fe.st,fe.d,fe.f);if(!r)return null;const k=fe.st+srcDir(fe.d)+fe.f;let c=GHC.get(k);if(c)return c;
  c=document.createElement('canvas');c.width=Math.max(1,Math.round(r[2]*.5));c.height=Math.max(1,Math.round(r[3]*.5));const g=c.getContext('2d');
  try{g.filter='grayscale(.55) sepia(.35) hue-rotate(160deg) saturate(1.5) brightness(1.28)';g.drawImage(SPRITE.img[fe.st],r[0],r[1],r[2],r[3],0,0,c.width,c.height);}catch(e){}
  GHC.set(k,c);return c;}
function allyFrame(a){let st='idle';if(a.act>0)st='attack';else if(a.moving)st='walk';
  if(st==='attack'){const D=durs('attack',a.dir),n=D.length;return {st,d:a.dir,f:Math.min(n-1,Math.floor((1-a.act/.42)*n))};}
  const D=durs(st,a.dir),T=D.reduce((x,y)=>x+y,0);let ms=(a.animT*1000)%T,f=0;while(f<D.length-1&&ms>=D[f]){ms-=D[f];f++;}return {st,d:a.dir,f};}
class AllyFx{constructor(a){this.a=a;this.layer='sorted';this.sy=a.y;this.t=0;}
  update(dt){this.t+=dt;const S=WB.S;if(!S||!S.allies.includes(this.a)||S.gone)return false;this.sy=this.a.y;return true;}
  draw(){const a=this.a,S=WB.S;if(a.dead&&a.fade<=0)return;if(a.room!==(S.room==='in'?'in':'out'))return;const [x,y]=P(a.x,a.y,0);
    const sx=x*Z+ox,sy=y*Z+oy;if(sx<-120||sx>VW+120||sy<-200||sy>VH+120)return;
    const al=a.dead?a.fade:1,col=a.R.c,sc=.92;
    ctx.save();ctx.globalAlpha=al*.5;ctx.translate(x,y);ctx.scale(1,K);ctx.fillStyle=hexA(col,.35);ctx.beginPath();ctx.arc(0,0,16,0,T2);ctx.fill();
    ctx.globalAlpha=al*.8;ctx.lineWidth=1.6;ctx.strokeStyle=col;ctx.beginPath();ctx.arc(0,0,13,0,T2);ctx.stroke();ctx.restore();
    const fe=allyFrame(a),img=ghostFrame(fe);if(!img)return;
    ctx.save();ctx.translate(x,y);ctx.scale(CHAR_SCALE*sc,CHAR_SCALE*sc);ctx.translate(-x,-y);
    drawFrame(fe,x,y,al*(a.flash>0?.95:.8),null,img);
    if(a.flash>0||a.healT>0){ctx.globalCompositeOperation='lighter';drawFrame(fe,x,y,al*.35*Math.max(a.flash,a.healT>0?.6:0),null,img);ctx.globalCompositeOperation='source-over';}
    ctx.restore();
    const hy=y-(MAP_CHAR*CHAR_SCALE*78)-6;ctx.save();ctx.globalAlpha=al;ctx.fillStyle=col;ctx.strokeStyle='#241808';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(x,hy-5);ctx.lineTo(x+4,hy);ctx.lineTo(x,hy+5);ctx.lineTo(x-4,hy);ctx.closePath();ctx.fill();ctx.stroke();
    if(a.hp<a.maxHp&&!a.dead){const w=26,k=a.hp/a.maxHp;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x-w/2,hy+7,w,3.5);ctx.fillStyle=k>.35?'#7ae08a':'#ff6a5a';ctx.fillRect(x-w/2+.5,hy+7.5,(w-1)*k,2.5);}
    ctx.restore();}}
/* ally shots: a short streak (ranged) or a small cut (melee) — cheap, one object for all */
const SHOTS=[];
function shotFx(a,t){SHOTS.push({x0:a.x,y0:a.y,x1:t.x,y1:t.y,z1:(t.z||0)+30,t:0,T:a.R.rng?.22:.16,c:a.R.c,m:a.R.rng?1:0,room:a.room});if(SHOTS.length>80)SHOTS.shift();}
function healFx(a,u){SHOTS.push({x0:a.x,y0:a.y,x1:u.x,y1:u.y,z1:40,t:0,T:.35,c:'#9fffe0',m:2,room:a.room});}
class ShotsFx{constructor(){this.layer='top';this.t=0;}update(dt){const S=WB.S;if(!S||S.gone)return false;for(let i=SHOTS.length-1;i>=0;i--){SHOTS[i].t+=dt;if(SHOTS[i].t>SHOTS[i].T)SHOTS.splice(i,1);}return true;}
  draw(){const S=WB.S;if(!SHOTS.length)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const s of SHOTS){if(s.room!==(S.room==='in'?'in':'out'))continue;const k=s.t/s.T;
      if(s.m===1||s.m===2){const k0=Math.max(0,k-.35),k1=Math.min(1,k+.05),[ax,ay]=P(s.x0+(s.x1-s.x0)*k0,s.y0+(s.y1-s.y0)*k0,42+(s.z1-42)*k0),[bx,by]=P(s.x0+(s.x1-s.x0)*k1,s.y0+(s.y1-s.y0)*k1,42+(s.z1-42)*k1);
        ctx.globalAlpha=(1-k)*.9;ctx.strokeStyle=s.c;ctx.lineWidth=s.m===2?3:2.4;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}
      else{const [x,y]=P(s.x1,s.y1,s.z1);ctx.globalAlpha=(1-k)*.85;ctx.strokeStyle=s.c;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,8+10*k,-1.2+k,0.4+k);ctx.stroke();}}
    ctx.restore();ctx.globalAlpha=1;}}

/* ---------------- the boss object (not in enemies: the parts are what gets hit) ---------------- */
function mkBoss(S){const I=S.I,D=S.D,lv=60,ms=monStats(lv,'boss');
  const B={id:-7700,wbBoss:1,x:S.home.x,y:S.home.y,z:0,r:D.r||120,sc:1,face:1,dead:false,atk:0,hp:1,maxHp:1,mboss:S.map,bossKey:'wb_'+S.key,bossName:S.adv?I.adv:I.full,
    m:Object.assign({},ms,{name:I.full,th:S.adv?I.adv:I.full,lv,race:D.race||'Brute',el:D.el||'Earth 1',size:'large',role:'boss'}),
    st:{stun:0,frozen:0,slow:0,stagger:0,root:0,bleed:0,armor:0,poison:0,defdown:0},
    pose:{dx:0,dy:0,lift:0,sx:1,sy:1,rot:0,px:.5,py:.94,alpha:1,flash:0,flip:0,shake:0,tint:null,sort:0}};
  MB.init(B,{R:3000,see:1e9,cd0:D.cd0||{},partHurt:(Bo,p,d,o)=>playerPartHurt(p,d,o)});B.mb.awake=1;return B;}
function playerPartHurt(p,d,o){const S=WB.S;if(!S||!p||!p.wbPart)return;S.fightT=gameTime;
  onHit(p,d,PU,{crit:!!o._wbCrit,magic:!!o.magic,mult:o._wbMult||1,sk:skOf(o),o});if(p.nohp&&!p.dead)p.hp=p.maxHp;}
function skOf(o){if(o&&o.auto)return '@auto';const a=player.action;return (a&&a.skill)||(o&&o.skill)||null;}
WB.mutOf=k=>{try{const A=window.totemGems&&totemGems.act&&totemGems.act()[k];return (A&&A.mut)||null;}catch(e){return null;}};
WB.poseTo=function(o){const S=WB.S;S.pt=Object.assign({rot:0,lift:0,dx:0,dy:0,sx:1,sy:1,px:.5,py:.94,alpha:1,spd:7},o||{});};
/* a picture point (fx, fy = 0…1 of the picture) → screen coords (P-space) under the current pose */
WB.picAt=function(fx,fy){const S=WB.S;if(!S||!S.pic||!S.pic.ok)return null;const B=S.B,po=B.pose,W=S.W,H=W*S.pic.img.height/S.pic.img.width;
  const [x,y]=P(B.x+po.dx,B.y+po.dy,po.lift+(S.D.fly||0));let lx=(fx-po.px)*W*(po.flip?-1:1)*po.sx,ly=(fy-po.py)*H*po.sy;const c=Math.cos(po.rot),s=Math.sin(po.rot);return [x+lx*c-ly*s,y+lx*s+ly*c];};
/* the screen point (P-space) → the ground point under it, and back: z for a part that should sit on the picture */
WB.zFor=(wx,wy,sx,sy)=>{const [,gy]=P(wx,wy,0);return Math.max(0,gy-sy);};
class BodyFx{constructor(){this.layer='sorted';this.t=0;this.sy=0;}
  update(dt){this.t+=dt;const S=WB.S;if(!S||S.gone||S.room==='in')return !!S&&!S.gone;this.sy=S.B.y+(S.B.pose.sort||0);return true;}
  draw(){const S=WB.S;if(!S||S.room==='in')return;const B=S.B,po=B.pose,I=S.pic;if(!I.ok)return;const W=S.W,H=W*I.img.height/I.img.width;
    const br=po.noBreath?1:1+.013*Math.sin(this.t*1.9),sh=po.shake>0?(Math.random()-.5)*po.shake*2:0;
    const [x,y]=P(B.x+po.dx,B.y+po.dy,po.lift+(S.D.fly||0)+(S.D.fly?6*Math.sin(this.t*1.3):0));
    if(po.alpha<=0.01){if(S.D.drawOn)S.D.drawOn(S);return;}
    ctx.save();ctx.translate(x+sh,y);ctx.rotate(po.rot);ctx.scale(po.sx*(po.flip?-1:1),po.sy*br);ctx.globalAlpha=po.alpha;
    if(S.D.clipBody)S.D.clipBody(S,W,H);if(po.filter)ctx.filter=po.filter;ctx.drawImage(I.img,-W*po.px,-H*po.py,W,H);ctx.filter='none';
    if(po.haze&&I.wh){   /* a glassy rim + a faint refraction inside (Mayawee hiding): readable on a bright floor without showing the picture */
      if(!I.rim){const c=document.createElement('canvas');c.width=I.wh.width;c.height=I.wh.height;const g=c.getContext('2d');for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[2,2],[-2,2],[2,-2]])g.drawImage(I.wh,dx,dy);g.globalCompositeOperation='destination-out';g.drawImage(I.wh,0,0);I.rim=c;}
      const pu=.6+.4*Math.sin(this.t*3.1),jx=Math.sin(this.t*6.3)*2;ctx.globalCompositeOperation='difference';ctx.globalAlpha=po.haze*.9*pu;ctx.drawImage(I.wh,-W*po.px+jx,-H*po.py,W,H);
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,po.haze*3.2*pu);ctx.drawImage(I.rim,-W*po.px+jx,-H*po.py,W,H);ctx.globalCompositeOperation='source-over';}
    const fl=Math.max(po.flash,S.hitFl||0);if(fl>0&&I.wh){ctx.globalAlpha=po.alpha*Math.min(.75,fl);ctx.globalCompositeOperation='lighter';ctx.drawImage(I.wh,-W*po.px,-H*po.py,W,H);ctx.globalCompositeOperation='source-over';}
    if(po.tint&&I.wh){ctx.globalAlpha=po.alpha*po.tint[1];ctx.globalCompositeOperation='source-atop';ctx.fillStyle=po.tint[0];ctx.fillRect(-W*po.px,-H*po.py,W,H);ctx.globalCompositeOperation='source-over';}
    ctx.restore();ctx.globalAlpha=1;if(S.D.drawOn)S.D.drawOn(S);}}
class GroundFx{constructor(){this.layer='ground';this.t=0;}
  update(dt){this.t+=dt;const S=WB.S;return !!S&&!S.gone;}
  draw(){const S=WB.S;if(!S||S.room==='in'){if(S&&S.D.drawInner)S.D.drawInner(S);return;}const B=S.B,po=B.pose,sd=S.D.shadow||[150,60];const lift=po.lift+(S.D.fly||0),k=1/(1+lift/220);
    if(po.alpha>.05){const [x,y]=P(B.x+po.dx,B.y+po.dy-(S.D.shOff||20),0);ctx.save();ctx.translate(x,y);ctx.scale(1,.38);ctx.globalAlpha=.42*Math.min(1,po.alpha*1.2)*(S.D.fly?.8:1);
      const g=ctx.createRadialGradient(0,0,0,0,0,sd[0]*k);g.addColorStop(0,'rgba(12,6,18,.85)');g.addColorStop(.7,'rgba(12,6,18,.4)');g.addColorStop(1,'rgba(12,6,18,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,sd[0]*k,0,T2);ctx.fill();ctx.restore();ctx.globalAlpha=1;}
    if(S.win>0){const [x,y]=P(B.x,B.y-10,0),R=(sd[0]+30)*(1+.04*Math.sin(this.t*5));ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(0,0,R*.3,0,0,R*1.15);g.addColorStop(0,'rgba(255,214,90,.28)');g.addColorStop(1,'rgba(255,170,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*1.15,0,T2);ctx.fill();
      ctx.globalCompositeOperation='source-over';ctx.lineWidth=3;ctx.strokeStyle='#ffe08a';ctx.setLineDash([14,9]);ctx.lineDashOffset=-this.t*50;ctx.beginPath();ctx.arc(0,0,R,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    if(S.D.drawGround)S.D.drawGround(S);}}
/* labels over count zones (n / need) */
class OverFx{constructor(){this.layer='top';this.t=0;}update(dt){this.t+=dt;const S=WB.S;return !!S&&!S.gone;}
  draw(){const S=WB.S;if(!S)return;for(const z of S.zones){if(z.dead||z.done)continue;const s=z.shape;let wx=s.x,wy=s.y;if(s.k==='rect'){const m=((s.off||0)+s.len)/2;wx+=Math.cos(s.phi)*m;wy+=Math.sin(s.phi)*m;}
      const [x,y]=P(wx,wy,0),ok=z.n>=z.need,txt=`${Math.floor(z.n)}/${z.need} คน`+(z.label?' · '+z.label:'');ctx.save();ctx.font='600 15px Mitr,sans-serif';ctx.textAlign='center';const w=ctx.measureText(txt).width+18;
      ctx.fillStyle=ok?'rgba(10,60,120,.88)':'rgba(70,20,10,.86)';ctx.strokeStyle=ok?'#8fd0ff':'#ffb070';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-46,w,24,12):ctx.rect(x-w/2,y-46,w,24);ctx.fill();ctx.stroke();
      ctx.fillStyle=ok?'#dff2ff':'#ffe2c8';ctx.fillText(txt,x,y-29);
      if(!ok&&z.need-z.n<=1.01&&PU.alive()&&!MB.inShape(s,player.x,player.y,6)){ctx.font='600 13px Mitr,sans-serif';ctx.fillStyle='#ffd23a';ctx.fillText('▼ ขาดอีก 1 คน — ไปยืน!',x,y-54);}
      ctx.restore();}
    if(S.D.drawTop)S.D.drawTop(S);}}

/* ---------------- the session ---------------- */
function arenaCfg(map){return (window.VK_MAPS||{})[map]||null;}
function newSession(key,adv,round){const I=INFO[key],D=WB.defs[key];if(!I||!D)return null;
  const S={id:Date.now()+Math.random(),key,I,D,adv:!!adv,map:I.map,inner:I.inner||null,round:round?round.id:'test',T:1200,t:0,state:'wait',wait:PLAY?0:8,enr:0,win:0,winT:0,pause:0,ghost:0,
    N:20,hp:1,hpMax:1,B:null,parts:[],adds:[],warns:[],zones:[],allies:[],me:{tot:0},here:false,built:false,ko:0,koMax:0,koOn:0,room:'out',st:{},W:(I.w||400)*(adv?1.1:1),
    pic:pic(key,adv),start:Date.now(),addDmg:0,blessings:{},gone:false};
  if(round){const now=Date.now();S.T=Math.min(1200,Math.max(60,(round.end-now)/1000));S.wait=Math.max(0,(round.st-now)/1000);if(S.wait>0)S.T=1200;}
  return S;}
function startSession(key,adv,round){if(WB.S&&!WB.S.gone)endSession('left',1);const S=newSession(key,adv,round);if(!S){msg('บอสตัวนี้ยังไม่พร้อม');return;}
  WB.S=S;if(round){SV.rd[rdKey(round.id)]='in';save();}
  if(curMap!==S.map){S.travel=1;mapTravel(S.map,null);}else S.travel=0;
  chat(`⚔ <b style="color:${S.I.col}">${S.adv?S.I.adv:S.I.full}</b> — ${S.wait>0?'รอบอสตื่นใน '+mmss(S.wait):'เข้าลานแล้ว'} · พาวิญญาณนักรบ 19 ตน`);}
WB.start=(key,adv)=>startSession(key,adv,null);
function build(S){const h=mapHost();if(!h||!h.ready||mapFadeDir)return false;S.built=true;S.here=curMap===S.map;S.room=curMap===S.inner?'in':'out';
  const [hx,hy]=F2W(S.I.pos[0],S.I.pos[1]);S.home={x:hx,y:hy};const C=arenaCfg(S.map);if(C&&C.start){const [cx,cy]=M2W({x:C.start[0],y:C.start[1]});S.camp={x:cx,y:cy};}else S.camp={x:hx,y:hy+600};
  if(!S.allies.length){mkAllies(S);placeAllies(S,{x:S.camp.x,y:S.camp.y-90});}
  if(!S.B){S.N=calcN(S);S.B=mkBoss(S);S.hp=S.hpMax=Math.round(S.D.hp(S.N)*(S.adv?1.6:1));if(S.D.setup)S.D.setup(S);}
  MB.boss=S.B;S.B.dead=false;S.B.mb.awake=1;S.B.mboss=S.map;zoomFight(S,1);
  S.parts.length=0;S.adds.length=0;S.warns.length=0;S.zones.length=0;SHOTS.length=0;
  addFx(new GroundFx());addFx(new BodyFx());addFx(new OverFx());addFx(new ShotsFx());for(const a of S.allies)addFx(new AllyFx(a));
  if(S.D.build)S.D.build(S);
  S.solid=S.D.solid?(x,y)=>{const B=S.B;if(S.room==='in'||B.pose.noSolid||S.noSolid)return false;const [rx,ry,oy,ox]=S.D.solid;const dx=(x-B.x-B.pose.dx-(ox||0))/rx,dy=(y-(B.y+B.pose.dy+(oy||0)))/ry;return dx*dx+dy*dy<1;}:null;
  document.body.classList.add('wbOn');hud(true);return true;}
function zoomFight(S,on){for(const id of [S.map,S.inner]){const M=id&&window.MAPDEF&&MAPDEF[id];if(!M)continue;if(M._cz0==null){M._cz0=M.cz;M._czm0=M.czm;}
  if(on){M.cz=(M._cz0||.8)*.88;M.czm=(M._czm0||.7)*.9;}else{M.cz=M._cz0;M.czm=M._czm0;}}}
function calcN(S){let n=(PS.lv||1)/60;for(const a of S.allies)n+=a.lv/60;return Math.max(4,Math.round(n*10)/10);}
function endSession(res,quiet){const S=WB.S;if(!S||S.state==='end')return;S.state='end';S.res=res;MB.cancel(S.B);
  for(const w of S.warns)w.dead=1;for(const z of S.zones){z.dead=1;if(z.w)z.w.dead=1;}for(const p of S.parts)if(!p.dead){p.dead=true;p.gone=1;}for(const e of S.adds)if(!e.dead){e.dead=true;e.gone=1;}
  if(S.D.finish)try{S.D.finish(S,res);}catch(e){}
  MB.pcClear();if(MB.boss===S.B)MB.boss=null;S.koOn=0;zoomFight(S,0);restoreObjs(S);S.buffAtk=0;S.blessings={};
  if(S.round!=='test'){SV.rd[rdKey(S.round)]=res;save();}
  const st=SV.n[S.key]=SV.n[S.key]||{win:0,lose:0,best:0};if(res==='win'){st.win++;if(!st.best||S.t<st.best)st.best=Math.round(S.t);}else if(res==='lose')st.lose++;save();
  if(res==='left'){chat(`ออกจากลาน${S.I.th} — ${S.round==='test'?'จบการทดสอบ':'สละสิทธิ์รอบนี้ (เข้าใหม่ได้รอบหน้า)'}`);S.gone=true;WB.S=null;hud(false);document.body.classList.remove('wbOn');applyStatsSafe();return;}
  S.reward=giveRewards(S,res);applyStatsSafe();hud(false);document.body.classList.remove('wbOn');window.CAM_BIAS=null;
  setTimeout(()=>{if(WB.S===S){showResult(S);}},res==='win'?3200:2000);
  if(res==='win'){MB.banner('✦ '+S.I.th+' สงบแล้ว! ชนะ','gold',3.4);try{shake(4);}catch(e){}}else MB.banner('⌛ หมดเวลา — '+S.I.th+' หนีไป','red',3);}
WB.end=endSession;
const applyStatsSafe=()=>{try{applyStats();}catch(e){}};
const rdKey=id=>CHAR+'|'+id;

/* ---------------- rewards ---------------- */
const tierOfLv=L=>L<=18?1:L<=36?2:L<=54?3:4;
function giveExp(frac){try{player.exp+=frac;while(player.exp>=1){if(PS.lv<LV_CAP){player.exp-=1;PS.lv++;applyStats();player.hp=player.maxHp;player.mp=player.maxMp;levelUpFx(PS.lv-1,PS.lv);chat(`เลเวลอัป! Base Lv <b>${PS.lv}</b>`);try{buildLevels();}catch(e){}}else{player.exp=.9999;break;}}}catch(e){}}
function rankOf(S,job){const L=[{me:1,v:job?(S.me[job]||0):S.me.tot}].concat(S.allies.map(a=>({me:0,v:job?(a.pts[job]||0):a.pts.tot})));L.sort((a,b)=>b.v-a.v);return 1+L.findIndex(x=>x.me);}
function giveRewards(S,res){const out=[],L=PS.lv||1,t=tierOfLv(L),pts=Math.round(S.me.tot||0),add=(id,n,lab)=>{if(n<=0)return;AF.add(id,n);out.push([id,n,lab]);};
  if(pts<150){out.push(['-',0,`แต้มผลงาน ${pts} ยังไม่ถึง 150 — ไม่ได้หีบ`]);return out;}
  const win=res==='win',adv=S.adv;
  const kf=(typeof killExp==='function')?killExp({lv:L}):.01,exp=kf*40*(win?1:.6);giveExp(exp);out.push(['exp',0,`EXP +${(exp*100).toFixed(1)}%`]);
  const z=Math.round((20000+20000*cl((L-20)/40,0,1))*(win?1:.6));AF.zeny=AF.zeny+z;out.push(['zeny',z,`${z.toLocaleString()} z`]);
  add('tstone'+t,win?3:2);add('tfrag'+t,5);add('tess',5);if(win)add('sore',1);
  let sc=(10+(win?10:0))*(adv?2:1);
  /* top 10 of a job = a second chest */
  const top=[];for(const j in JOBS){if((S.me[j]||0)>=15&&rankOf(S,j)<=10)top.push(j);}
  if(top.length){add('tfrag'+t,3);const z2=10000;AF.zeny=AF.zeny+z2;sc+=5;out.push(['zeny',z2,`หีบที่ 2 (ท็อป 10: ${top.map(j=>JOBS[j]).join(', ')}) +${z2.toLocaleString()} z`]);}
  SV.sc+=sc;out.push(['scale',sc,`เกล็ดดาว +${sc}`]);
  const wk=weekId(Date.now());if(SV.wk.id!==wk)SV.wk={id:wk,done:{},got:0};SV.wk.done[S.key]=1;save();
  return out;}
WB.claimWeek=function(){const wk=weekId(Date.now());if(SV.wk.id!==wk||SV.wk.got||Object.keys(SV.wk.done).length<5)return false;SV.wk.got=1;AF.add('sore',2);AF.add('tstone'+tierOfLv(PS.lv||1),3);SV.sc+=30;save();
  chat('🎁 รับหีบประจำสัปดาห์: แร่ดาวตก ×2 · หินโทเท็ม ×3 · เกล็ดดาว +30');return true;};

/* ---------------- star-scale shop (เกล็ดดาว) ---------------- */
const SHOP=[['tstone',1,4,'หินโทเท็ม (ขั้นตามเลเวล)'],['tfrag',5,3,'ชิ้นส่วนเจม ×5 (ขั้นตามเลเวล)'],['tess',5,4,'แก่นโทเท็ม ×5'],['sore',1,25,'แร่ดาวตก'],['wore',1,6,'หินตีบวกอาวุธ (ขั้นตามเลเวล)'],['ore',1,6,'หินตีบวกชุด (ขั้นตามเลเวล)']];
WB.buy=function(i){const r=SHOP[i];if(!r||SV.sc<r[2])return false;const t=tierOfLv(PS.lv||1),id=(r[0]==='tess'||r[0]==='sore')?r[0]:r[0]+t;if(!AF.ETC[id])return false;SV.sc-=r[2];AF.add(id,r[1]);save();chat(`⭐ แลก <b>${(AF.ETC[id].th||id)}</b> ×${r[1]} (−${r[2]} เกล็ดดาว)`);return true;};

/* ---------------- the frame ---------------- */
function frame(dt){const S=WB.S;if(!S||S.state==='end'&&S.gone)return;
  if(!S.built){if((curMap===S.map||curMap===S.inner)&&!mapFadeDir)build(S);return;}
  if(S.state==='end'){for(const a of S.allies)if(!a.dead){a.animT+=dt;a.act=Math.max(0,a.act-dt);a.moving=false;}return;}
  const D=S.D,B=S.B;if(!dt)return;
  S.room=curMap===S.inner?'in':'out';S.here=curMap===S.map||curMap===S.inner;
  if(S.ghost>0){S.ghost-=dt;player.hp=Math.max(1,player.hp);player.attackTarget=null;player.moveT=null;player.pending=null;if(S.gx==null||S.gm!==curMap){S.gx=player.x;S.gy=player.y;S.gm=curMap;}else{player.x=S.gx;player.y=S.gy;}
    const ov=document.getElementById('wbGhost');if(ov){const b=ov.querySelector('b');if(b)b.textContent=Math.max(0,Math.ceil(S.ghost));}if(S.ghost<=0)reviveMe(S);}
  B.pose.flash=Math.max(0,B.pose.flash-dt*4);S.hitFl=Math.max(0,(S.hitFl||0)-dt*5);
  if(S.state==='wait'){S.wait-=dt;if(PLAY&&S.round!=='test'){const r=rounds(Date.now()).find(x=>x.id===S.round);if(r)S.wait=(r.st-Date.now())/1000;}
    for(const a of S.allies)allyTick(a,dt);
    if(S.wait<=0){S.state='fight';S.t=0;MB.banner('⚔ '+(S.adv?S.I.adv:S.I.full)+' ตื่นแล้ว!','red',3);try{shake(3);}catch(e){}if(D.wake)D.wake(S);}
    hudTick(dt);return;}
  S.t+=dt;
  if(!S.enr&&S.t>=(S.adv?13:16)*60){S.enr=1;MB.banner('⚠ โกรธจัด! ท่าเร็วขึ้น','red',2.6);if(D.enrage)D.enrage(S);}
  if(S.t>=S.T){endSession('lose');return;}
  /* boss state (the kit's act loop without its leash / chase) */
  const b=B.mb;for(const k in b.cd)if(b.cd[k]>0)b.cd[k]-=dt*(S.enr?1.65:1);
  if(S.win>0){S.win-=dt;if(S.win<=0){S.win=0;if(D.winEnd)D.winEnd(S);}}
  if(S.pause>0)S.pause-=dt;
  if(b.act){const a=b.act;a.t+=dt;if(a.step)a.step(B,a,dt);if(b.act===a&&a.t>=a.T){b.act=null;S.koOn=0;if(a.end)a.end(B,a);}}
  else if(!(S.win>0)&&!(S.pause>0)&&D.think)D.think(S,dt);
  if(D.tick)D.tick(S,dt);if(WB.S!==S||S.state==='end')return;
  for(let i=S.warns.length-1;i>=0;i--){const w=S.warns[i];if(w.fired||w.dead)S.warns.splice(i,1);}
  for(let i=S.zones.length-1;i>=0;i--){const z=S.zones[i];if(z.dead){S.zones.splice(i,1);continue;}zoneTick(z,dt);}
  for(let i=S.adds.length-1;i>=0;i--){const e=S.adds[i];if(e.dead&&e.deadT>2||e.gone||!enemies.includes(e))S.adds.splice(i,1);}
  fieldTick(S,dt);
  if(S.pt){const po=B.pose,T=S.pt,k=Math.min(1,dt*(T.spd||7));for(const n of ['rot','lift','dx','dy','sx','sy','px','py','alpha'])if(T[n]!=null)po[n]+=(T[n]-po[n])*k;}
  for(const p of S.parts){if(p.dead)continue;if(p.fol){p.x=B.x+B.pose.dx+p.fol[0];p.y=B.y+B.pose.dy+p.fol[1];p.fixed=null;}if(p.z0)p.z=p.z0;}
  for(const a of S.allies)allyTick(a,dt);
  /* the body is solid: units inside get pushed out */
  if(S.solid&&S.room==='out')for(const u of [PU].concat(S.allies)){if(u.pl?!PU.alive():u.dead)continue;if(S.solid(u.x,u.y)){const an=Math.atan2(u.y-B.y,u.x-B.x);for(let r=8;r<400;r+=8){const x=u.x+Math.cos(an)*r,y=u.y+Math.sin(an)*r;if(!S.solid(x,y)&&!blk(x,y)){u.x=x;u.y=y;break;}}}}
  /* trackers used by target picks */
  const mv=hyp(player.x-(S.px||player.x),player.y-(S.py||player.y));S.px=player.x;S.py=player.y;PU.still=mv>.5?0:PU.still+dt;
  /* blessings (Urtok's freed land spirits …): HP regen */
  if(S.blessings.regen&&PU.alive()){S.rgT=(S.rgT||0)+dt;if(S.rgT>=1){S.rgT-=1;const h=Math.round(PU.lv*.5);if(player.hp<player.maxHp)player.hp=Math.min(player.maxHp,player.hp+h);}}
  /* the camera leans toward the boss's body (its middle), most when you fight next to it, without losing the hero off screen */
  const FO=S.room==='out'?(S.pic.ok?{x:B.x,y:B.y,cy:B.y-(S.W*S.pic.img.height/S.pic.img.width*.45+(D.fly||0))/K}:null):(D.inFocus?D.inFocus(S):null);
  if(FO){const cx=FO.x,cy=FO.cy,d=hyp(player.x-FO.x,player.y-FO.y),w=cl(1-(d-260)/900,.12,.62);
    const mx=Math.max(40,(VW/2-260)/Z),my=Math.max(30,(VH*.5-VH*.31)/Z/K),myUp=Math.max(30,(VH*.5-VH*.36)/Z/K);   /* the hero stays between ~36 % and ~69 % of the screen height (HUD on top, skill bar below) */window.CAM_BIAS={x:cl((cx-player.x)*w,-mx,mx),y:cl((cy-player.y)*w,-my,myUp)};}else window.CAM_BIAS=null;
  hudTick(dt);}
WB.frame=frame;
function reviveMe(S){S.ghost=0;S.gx=S.gy=null;player.iframes=2;player.hp=player.maxHp;player.mp=player.maxMp;const c=S.camp;if(curMap===S.map){player.x=c.x;player.y=c.y;cam.x=c.x;cam.y=c.y;}
  const ov=document.getElementById('wbGhost');if(ov)ov.style.display='none';msg('ฟื้นที่ค่ายกิลด์แล้ว');}

/* ---------------- engine hooks ---------------- */
{const _ue=updEnemies;updEnemies=function(dt){_ue(dt);try{frame(dt);}catch(err){console.warn('WB',err);}};}
{const _ai=enemyAI;enemyAI=function(e,dt){if(e&&e.wbAdd){addAI(e,dt);return true;}return _ai(e,dt);};}
{const _h=hurt;hurt=function(e,mult,o){o=o||{};const S=WB.S;if(e&&e.wbBoss)return 0;
  if(S&&e&&!e.dead&&(e.wbPart||e.wbAdd)){
    if(e.wbPart){if(e.hidden)return 0;if(e.hitOK&&!e.hitOK(PU,o)){if(!e._mT||gameTime-e._mT>.6){e._mT=gameTime;say(e.x,e.y,(e.z||0)+60,e.noTxt||'ไม่โดน','#cfd6e0',13);}return 0;}
      if(e.minD&&hyp(player.x-e.x,player.y-e.y)<e.minD){if(!e._mT||gameTime-e._mT>.6){e._mT=gameTime;say(e.x,e.y,(e.z||0)+60,'ใกล้ไป! ยิงจากไกล ≥ '+e.minD,'#ffd8a8',13);}return 0;}
      if(S.win>0&&e.winOpen){o._msSure=1;o._msCut=Math.max(o._msCut||0,9999);}}
    o._wbMult=mult;}
  return _h(e,mult,o);};}
WB.single=o=>{if(!o||o.auto)return true;const k=skOf(o);const sh=k&&window.SKILL_SHAPES&&SKILL_SHAPES[CHAR]&&SKILL_SHAPES[CHAR][k];return !sh||sh.k==='target'||sh.k==='none';};
if(window.itemFx){const _dm=itemFx.dmgMul;itemFx.dmgMul=function(e,o,crit){let m=_dm.apply(this,arguments);if(e&&e.wbPart&&e.dmgMul!==1&&WB.S&&!(WB.S.win>0&&e.winOpen))m*=e.dmgMul;return m;};}
if(window.itemFx){const _ah=itemFx.afterHit;itemFx.afterHit=function(e,d,crit,o){if(o)o._wbCrit=!!crit;return _ah.apply(this,arguments);};}
{const _k=kill;kill=function(e){if(e&&e.wbBoss)return;if(e&&e.wbAdd&&!e.dead){try{flushCombo(e);}catch(err){}addDie(e,PU);return;}return _k(e);};}
{const _de=drawEnemy;drawEnemy=function(e){if(e&&e.wbPart)return;if(e&&e.wbAdd&&e.room&&WB.S&&e.room!==(WB.S.room==='in'?'in':'out'))return;return _de(e);};}
if(typeof nearestEnemy==='function'){const _ne=nearestEnemy;nearestEnemy=function(x,y,maxD,front){const S=WB.S;if(!S||!S.built)return _ne(x,y,maxD,front);
  let best=null,bd=maxD;const lk=window.TL&&TL.e;for(const e of enemies){if(e.dead||e.hidden)continue;if(e.wbPart&&(e.noNear||(autoMode&&e.mbNoAuto))&&e!==lk)continue;if(e.room&&e.room!==(S.room==='in'?'in':'out'))continue;
    if(autoMode&&e.mbNoAuto&&!e.wbPart)continue;const d=hyp(e.x-x,e.y-y);if(front!=null&&Math.abs(angDiff(Math.atan2(e.y-y,e.x-x),front))>1)continue;if(d<bd){bd=d;best=e;}}return best;};}
if(typeof mapBlockedW==='function'){const _mb=mapBlockedW;mapBlockedW=function(x,y){if(_mb(x,y))return true;const S=WB.S;return !!(S&&S.built&&S.solid&&curMap===S.map&&S.solid(x,y));};}
{const _em=enterMap;enterMap=function(id,sp){const S=WB.S,r=_em(id,sp);
  if(S&&!S.gone){if(id===S.map||id===S.inner){S.built=false;S.swap=0;}else if(S.state!=='end'&&!S.swap)endSession('left');else if(S.state==='end'){S.gone=true;WB.S=null;hud(false);document.body.classList.remove('wbOn');}}
  window.CAM_BIAS=null;if(keyOfMap(id)&&!(WB.S&&!WB.S.gone))setTimeout(()=>sleepBoss(id),50);return r;};}
{const _pd=window.onPlayerDeath;window.onPlayerDeath=function(e){const S=WB.S;if(S&&S.built&&S.state!=='end'&&(curMap===S.map||curMap===S.inner)){
    if(S.ghost>0)return;S.ghost=8;S.gx=player.x;S.gy=player.y;player.hp=1;player.iframes=9;player.attackTarget=null;player.moveT=null;MB.pcClear();
    if(curMap===S.inner&&S.D.outOfStomach)S.D.outOfStomach(S,PU);
    let ov=document.getElementById('wbGhost');if(!ov){ov=document.createElement('div');ov.id='wbGhost';document.body.appendChild(ov);}ov.innerHTML='💫 สลบ — ฟื้นที่ค่ายกิลด์ใน <b>8</b> วิ (ไม่เสีย EXP)';ov.style.display='block';
    chat('<span style="color:#ffab8a">สลบในศึกบอสโลก</span> — ฟื้นที่ค่ายใน 8 วิ');return;}
  if(_pd)return _pd(e);player.hp=player.maxHp;msg('HP หมด — ฟื้นอัตโนมัติ (โหมดทดสอบ)');};}
if(typeof gearCalc==='function'){const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);try{const S=WB.S;if(S&&S.built&&S.state!=='end'){const b=S.blessings,L=PS.lv||1;
    if(b.hit)BON.hit=(BON.hit||0)+15;if(b.move)BON.move=(BON.move||0)+18;if(b.atk){BON.atk=(BON.atk||0)+Math.round(L*.5);BON.matk=(BON.matk||0)+Math.round(L*.5);}
    if(S.buffAtk)for(const k of ['atk','matk'])BON[k]=(BON[k]||0)+S.buffAtk;}}catch(e){}return r;};window.gearCalc=gearCalc;}
if(typeof castSkillNow==='function'){const _cn=castSkillNow;castSkillNow=function(key,c){const S=WB.S,mp=player.mp;if(S&&S.ghost>0)return false;const r=_cn(key,c);
  try{if(r!==false&&S&&S.blessings&&S.blessings.sp){const used=mp-player.mp;if(used>0)player.mp=Math.min(player.maxMp,player.mp+Math.min(5,used));}}catch(e){}return r;};}
/* clicking the giant body: lock its default part (a leg, the belly …) instead of walking into it */
if(window.TL&&TL.pick){const _pk=TL.pick;TL.pick=function(sx,sy,touch){const S=WB.S,r=_pk(sx,sy,touch);if(r||!S||!S.built||S.state!=='fight'||S.room==='in'||!S.D.pickDefault)return r;
  const B=S.B,I=S.pic;if(!I.ok)return r;const W=S.W*Z,H=W*I.img.height/I.img.width,[x,y]=P(B.x+B.pose.dx,B.y+B.pose.dy,B.pose.lift+(S.D.fly||0)),X=x*Z+ox,Y=y*Z+oy;
  if(sx>X-W*.45&&sx<X+W*.45&&sy>Y-H*.92&&sy<Y+12)return S.D.pickDefault(S)||r;return r;};}

/* ---------------- the boss asleep in its arena outside a fight ---------------- */
class SleepFx{constructor(k){this.k=k;this.layer='sorted';this.t=0;const [x,y]=F2W(INFO[k].pos[0],INFO[k].pos[1]);this.x=x;this.y=y;this.sy=y;this.p=pic(k,0);}
  update(dt){this.t+=dt;return !(WB.S&&!WB.S.gone)&&keyOfMap(curMap)===this.k&&curMap===INFO[this.k].map;}
  draw(){const I=this.p;if(!I.ok)return;const W=INFO[this.k].w,H=W*I.img.height/I.img.width,fl=INFO[this.k].fly?INFO[this.k].fly*.4:0,[x,y]=P(this.x,this.y,fl);
    ctx.save();ctx.translate(x,y);ctx.scale(1,1+.012*Math.sin(this.t*1.2));ctx.filter='saturate(.55) brightness(.72)';ctx.globalAlpha=.95;ctx.drawImage(I.img,-W/2,-H*.94,W,H);ctx.filter='none';ctx.restore();
    for(let i=0;i<3;i++){const k=((this.t*.35+i/3)%1),[zx,zy]=P(this.x+W*.18+k*40,this.y,fl+H*.6+k*70);ctx.save();ctx.globalAlpha=Math.sin(k*Math.PI)*.85;ctx.font=`700 ${14+k*14}px Mitr,sans-serif`;ctx.fillStyle='#e8f0ff';ctx.strokeStyle='#2a2040';ctx.lineWidth=3;ctx.strokeText('Z',zx,zy);ctx.fillText('Z',zx,zy);ctx.restore();}}}
function sleepBoss(id){const k=keyOfMap(id);if(!k||id!==INFO[k].map||curMap!==id||(WB.S&&!WB.S.gone))return;if(fx.some(f=>f instanceof SleepFx))return;addFx(new SleepFx(k));}

/* ---------------- HUD ---------------- */
let H=null,hSig='',hT=0;
function css(){if(document.getElementById('wbCss'))return;const st=document.createElement('style');st.id='wbCss';st.textContent=`
#wbHud{position:fixed;left:50%;top:108px;transform:translateX(-50%);width:min(520px,72vw);z-index:13;pointer-events:none;font-family:Mitr,Mali,Sarabun,sans-serif;color:#fff3d6;text-shadow:0 1px 2px #000;display:none}
#wbHud .hd{display:flex;align-items:baseline;gap:8px;justify-content:center;font-size:14px}#wbHud .hd b{font-weight:600;color:#ffe9b0}#wbHud .hd em{font-style:normal;font-size:11px;padding:0 7px;border-radius:9px;background:rgba(60,20,90,.8);border:1px solid #c89aff;color:#ecdcff}
#wbHud .hd em.adv{background:rgba(110,20,20,.85);border-color:#ff7a5a;color:#ffd8c8}#wbHud .hd .tm{font-size:13px;color:#ffd36a;min-width:44px}#wbHud .hd .pt{font-size:11px;color:#d8f0ff}
#wbHud .bar{position:relative;height:14px;margin:3px 0 0;background:rgba(20,10,4,.84);border:1px solid #9a7a5a;border-radius:7px;overflow:hidden}#wbHud .bar i{position:absolute;left:0;top:0;bottom:0;width:0;transition:width .15s}
#wbHud .bar span{position:absolute;inset:0;font-size:10.5px;line-height:13px;text-align:center;white-space:nowrap}#wbHud .bar.s{height:10px}#wbHud .bar.s span{font-size:9px;line-height:9px}
#wbHud .ic{display:flex;gap:5px;justify-content:center;margin-top:3px;flex-wrap:wrap}#wbHud .ic span{font-size:10px;padding:0 5px;line-height:14px;border-radius:8px;background:rgba(20,12,6,.78);border:1px solid #6a5a48;white-space:nowrap}
#wbHud .ic span.off{opacity:.45;text-decoration:line-through}#wbHud .me{font-size:11px;text-align:center;color:#d8f0ff;margin-top:2px}#wbHud .ph{font-size:11.5px;text-align:center;color:#ffe9a8;margin-top:1px}
body.wbOn #mbCast{top:212px}body.wbOn #mbBan{top:43%}body.mob.wbOn #mbBan{top:46%}body.mob #wbHud{top:96px;width:min(380px,52vw)}body.mob #wbHud .hd{font-size:11.5px}body.mob #wbHud .bar{height:11px}body.mob #wbHud .bar span{font-size:9px;line-height:10px}body.mob #wbHud .ic span{font-size:8.5px;line-height:12px}body.mob #wbHud .hd .pt{font-size:9.5px}body.mob #wbHud .ph{font-size:9.5px}body.mob.wbOn #mbCast{top:176px}
#wbGhost{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:40;padding:10px 22px;border-radius:14px;background:rgba(20,12,30,.86);border:2px solid #b8a0ff;color:#efe6ff;font:600 17px Mitr,sans-serif;display:none;pointer-events:none}
#wbw .ttbd,#wbr .ttbd{max-height:min(76vh,640px);overflow:auto;font-family:Mitr,Mali,Sarabun,sans-serif}#wbw{width:min(560px,94vw)}#wbr{width:min(440px,92vw)}
.wbCard{display:flex;gap:10px;align-items:center;padding:8px;border-radius:12px;background:linear-gradient(#3a2a1c,#2a1c12);border:1px solid #8a6a40;margin-bottom:8px}
.wbCard img{width:96px;height:96px;object-fit:contain;filter:drop-shadow(0 2px 3px #000)}.wbCard h3{margin:0;font-size:16px;color:#ffe2a0}.wbCard p{margin:2px 0;font-size:12px;color:#f0dcc0;line-height:1.35}
.wbChip{display:inline-block;padding:0 8px;border-radius:9px;font-size:11px;color:#1a1008;font-weight:600}
.wbRow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;background:rgba(255,240,210,.06);border:1px solid rgba(200,160,110,.25);margin:5px 0;font-size:12.5px}
.wbRow button,.wbBtn{font:600 12.5px Mitr,sans-serif;padding:4px 12px;border-radius:9px;border:1px solid #c8964a;background:linear-gradient(#ffdf8a,#e0a040);color:#3a2008;cursor:pointer}.wbRow button:disabled,.wbBtn:disabled{filter:grayscale(1);opacity:.5;cursor:default}
.wbGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}.wbGrid .g{padding:6px;border-radius:10px;background:rgba(255,240,210,.06);border:1px solid rgba(200,160,110,.3);text-align:center;font-size:11.5px}
.wbGrid .g img{width:64px;height:64px;object-fit:contain}.wbGrid .g button{margin:2px;font:600 11px Mitr,sans-serif;padding:3px 8px;border-radius:8px;border:1px solid #c8964a;background:linear-gradient(#ffdf8a,#e0a040);color:#3a2008}
.wbWk{display:flex;gap:4px;flex-wrap:wrap;margin:4px 0}.wbWk span{font-size:11px;padding:1px 7px;border-radius:8px;border:1px solid #6a5a48;background:rgba(0,0,0,.25)}.wbWk span.on{background:#5a8a3a;border-color:#a8e080;color:#f0ffe0}
.wbRes h3{margin:0 0 6px;text-align:center;font-size:20px}.wbRes .pt{display:grid;grid-template-columns:1fr auto auto;gap:2px 10px;font-size:12.5px;margin:6px 0}.wbRes .rw{font-size:12.5px;line-height:1.6}
`;document.head.appendChild(st);}
function hud(on){css();if(!H){H=document.createElement('div');H.id='wbHud';document.body.appendChild(H);}H.style.display=on?'block':'none';hSig='';if(!on){const cb=document.getElementById('mbCast');if(cb)cb.style.top='';}}
function fmtN(v){v=Math.max(0,Math.round(v));return v>=1e6?(v/1e6).toFixed(2)+'M':v>=1e4?(v/1e3).toFixed(1)+'k':v.toLocaleString();}
function hudTick(dt){const S=WB.S;if(!S||!H)return;hT-=dt;if(hT>0)return;hT=.12;if(!S.built){H.style.display='none';return;}H.style.display='block';
  const I=S.I,D=S.D,h=D.hud?D.hud(S):{};const time=S.state==='wait'?'⏳ '+mmss(S.wait):mmss(S.T-S.t);
  const bar=(v,m,lab,col,s)=>`<div class="bar${s?' s':''}"><i style="width:${(cl(v/Math.max(1,m),0,1)*100).toFixed(1)}%;background:${col}"></i><span>${lab}</span></div>`;
  let x=`<div class="hd"><b>${S.adv?I.adv:I.full}</b><em class="${S.adv?'adv':''}">${S.adv?'แอดวานซ์':I.dayTh}</em><span class="tm">${time}</span><span class="pt">แต้ม ${Math.floor(S.me.tot||0)}${S.me.tot>=150?' ✓':'/150'} · #${rankOf(S)}</span></div>`;
  const mn=h.main||{v:S.hp,m:S.hpMax,lab:'พลังชีวิต'};x+=bar(mn.v,mn.m,`${mn.lab} ${fmtN(mn.v)} / ${fmtN(mn.m)}`,mn.col||'linear-gradient(#ff8a7a,#c8302a)');
  for(const s of h.subs||[])x+=bar(s.v,s.m,s.lab,s.col||'linear-gradient(#ffe08a,#d89a2a)',1);
  if(S.koOn)x+=bar(S.ko,S.koMax,'เกจ KO — ตีให้หมดเพื่อขัด!','linear-gradient(#fff0a8,#e8a81a)',1);
  if(S.win>0)x+=bar(S.win,S.winT||1,'✦ ช่วงเปิด '+Math.ceil(S.win)+' วิ — ตีเลย!','linear-gradient(#fff6c8,#ffc83a)',1);
  if(h.icons&&h.icons.length)x+=`<div class="ic">${h.icons.map(c=>`<span class="${c.off?'off':''}" style="${c.col?'border-color:'+c.col:''}">${c.t}</span>`).join('')}</div>`;
  if(h.phase||S.state==='wait')x+=`<div class="ph">${S.state==='wait'?'รอบอสตื่น · วิญญาณนักรบกำลังรวมพล':h.phase}</div>`;
  if(x!==hSig){hSig=x;H.innerHTML=x;}
  const cb=document.getElementById('mbCast');if(cb){const y=Math.round(H.offsetTop+H.offsetHeight+8);if(cb.style.top!==y+'px')cb.style.top=y+'px';}}

/* ---------------- result window ---------------- */
function showResult(S){css();const w=AF.ui.ttWin('wbr',S.res==='win'?'🏆 ชนะบอสโลก':'⌛ จบศึกบอสโลก');const box=document.getElementById('wbr');box.classList.add('open');box.style.zIndex=62;
  const jr=Object.keys(JOBS).filter(j=>(S.me[j]||0)>=1).map(j=>`<span>${JOBS[j]}</span><b>${Math.floor(S.me[j])}</b><span>#${rankOf(S,j)}</span>`).join('');
  w.innerHTML=`<div class="wbRes"><h3 style="color:${S.res==='win'?'#9a5a00':'#a03a2a'}">${S.res==='win'?'สงบแล้ว ✦':'หมดเวลา'} — ${S.adv?S.I.adv:S.I.full}</h3>
    <div style="text-align:center;font-size:12px;color:#6a4a2a">เวลา ${mmss(S.t)} · แต้มผลงานรวม <b>${Math.floor(S.me.tot||0)}</b> · อันดับ ${rankOf(S)}/20</div>
    <div class="pt">${jr||'<span>ยังไม่มีแต้ม</span>'}</div><div class="rw">${(S.reward||[]).map(r=>'• '+r[2]+(r[0]&&AF.ETC[r[0]]?` <b>${AF.ETC[r[0]].th||r[0]}</b> ×${r[1]}`:'')).join('<br>')}</div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button class="wbBtn" id="wbHome">กลับเมืองหลวง</button><button class="wbBtn" id="wbStay">อยู่ต่อ</button></div></div>`;
  w.querySelector('#wbHome').onclick=()=>{box.classList.remove('open');S.gone=true;WB.S=null;hud(false);document.body.classList.remove('wbOn');mapTravel('capT',{warp:'toS'});};
  w.querySelector('#wbStay').onclick=()=>{box.classList.remove('open');};}

/* ---------------- the guild window ---------------- */
function inTown(){try{return !!(AF.townHere&&AF.townHere())||curMap==='capT';}catch(e){return curMap==='capT';}}
WB.open=function(){css();const w=AF.ui.ttWin('wbw','⚔ บอสโลก · กิลด์นักผจญภัย');const box=document.getElementById('wbw');box.classList.add('open');box.style.zIndex=61;
  const now=Date.now(),cur=curRound(now),nx=nextRound(now),todayKey=ORDER[thP(now).wd],T=INFO[todayKey],adv=advOn();
  const rStat=r=>{const s=SV.rd[rdKey(r.id)];return s==='win'?'ชนะแล้ว ✓':s==='lose'?'จบแล้ว (แพ้)':s==='left'||s==='in'?'ใช้สิทธิ์แล้ว':'';};
  let x=`<div class="wbCard"><img src="assets/bosses/world/${todayKey}${adv?'_adv':''}_cut.webp"><div><h3>วัน${T.dayTh} · ${T.full}</h3>
    <p><span class="wbChip" style="background:${T.col}">สีประจำวัน</span> สายเด่น ${T.jobs}${adv?' · รอบ 20:30 = <b style="color:#ff9a7a">ร่างแอดวานซ์</b>':''}</p><p>${T.hint}</p></div></div>`;
  const list=rounds(now).filter(r=>r.end>now).slice(0,4);
  for(const r of list){const I=INFO[r.key],st=rStat(r),open=now>=r.open&&now<r.join,live=now>=r.st&&now<r.end,lvOK=(PS.lv||1)>=20;
    const lab=st||(now<r.open?`ประตูเปิด ${hhmm(r.open)}`:live?`กำลังสู้ · จบ ${hhmm(r.end)}`:'ประตูเปิดแล้ว');
    x+=`<div class="wbRow"><span>${dkey(r.st)===dkey(now)?'วันนี้':'วัน'+I.dayTh} ${hhmm(r.st)} · <b>${advRound(r)?I.adv:I.full}</b><br><small>${lab}</small></span>
      <button data-go="${r.id}" ${(!open||st||!lvOK||!inTown())?'disabled':''}>${!lvOK?'Lv 20+':!inTown()&&open&&!st?'ไปจากเมือง':'⚔ เข้าลาน'}</button></div>`;}
  if(!PLAY){x+=`<div style="margin:8px 0 4px;font-size:12.5px;color:#ffe2a0">🧪 โหมดทดสอบ — สู้ได้ทุกตัวตอนนี้ (ไม่ต้องรอเวลา)</div><div class="wbGrid">`+
    ORDER.map(k=>{const I=INFO[k],ok=!!WB.defs[k];return `<div class="g"><img src="assets/bosses/world/${k}_cut.webp"><div><b>${I.dayTh}</b> ${I.th}</div><button data-t="${k}" ${ok?'':'disabled'}>ปกติ</button><button data-t="${k}" data-a="1" ${ok?'':'disabled'}>แอดวานซ์</button>${ok?'':'<div><small>ยังไม่เปิด</small></div>'}</div>`;}).join('')+`</div>`;}
  const wk=weekId(now);if(SV.wk.id!==wk)SV.wk={id:wk,done:{},got:0};const nd=Object.keys(SV.wk.done).length;
  x+=`<div class="wbRow"><span>🎁 หีบประจำสัปดาห์ (ร่วมครบ 5 ตัวไม่ซ้ำ) ${nd}/5<div class="wbWk">${ORDER.map(k=>`<span class="${SV.wk.done[k]?'on':''}">${INFO[k].dayTh}</span>`).join('')}</div></span>
    <button id="wbWkB" ${nd>=5&&!SV.wk.got?'':'disabled'}>${SV.wk.got?'รับแล้ว':'รับหีบ'}</button></div>`;
  x+=`<div class="wbRow"><span>⭐ เกล็ดดาว <b>${SV.sc}</b> — แลกของที่ร้าน</span><button id="wbShopB">ร้านเกล็ดดาว</button></div>
    <div style="font-size:11.5px;color:#d8c8b0;line-height:1.45;margin-top:6px">• ทุกวัน 12:30 และ 20:30 (เวลาไทย) บอสประจำวันตื่น · ประตูเปิดก่อน 10 นาที · สู้ได้ 20 นาที · Lv 20 ขึ้นไป<br>
    • วิญญาณนักรบ 19 ตนลงมาสู้ด้วย · แต้มผลงาน ≥ 150 = ได้หีบ (EXP · zeny · หินโทเท็ม · ชิ้นส่วนเจม · แก่นโทเท็ม · เกล็ดดาว) · ชนะ +แร่ดาวตก · ไม่มีโบนัสตีปิด<br>
    • ท็อป 10 ของงานไหน = หีบที่ 2 · สลบในลานฟื้นที่ค่าย ไม่เสีย EXP · ออกจากลานกลางศึก = สละสิทธิ์รอบนั้น</div>`;
  w.innerHTML=x;
  w.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const r=rounds(Date.now()).find(q=>q.id===b.dataset.go);if(!r)return;box.classList.remove('open');startSession(r.key,advRound(r),r);});
  w.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{box.classList.remove('open');startSession(b.dataset.t,!!b.dataset.a,null);});
  const wb=w.querySelector('#wbWkB');if(wb)wb.onclick=()=>{if(WB.claimWeek())WB.open();};
  w.querySelector('#wbShopB').onclick=()=>WB.shop();};
WB.shop=function(){css();const w=AF.ui.ttWin('wbw','⭐ ร้านเกล็ดดาว');const box=document.getElementById('wbw');box.classList.add('open');box.style.zIndex=61;const t=tierOfLv(PS.lv||1);
  w.innerHTML=`<div style="font-size:13px;margin-bottom:6px">มีเกล็ดดาว <b>${SV.sc}</b> · ของขั้น ${t} ตามเลเวลของคุณ</div>`+SHOP.map((r,i)=>`<div class="wbRow"><span>${r[3]} ×${r[1]}</span><button data-b="${i}" ${SV.sc<r[2]?'disabled':''}>${r[2]} ⭐</button></div>`).join('')+
    `<div style="margin-top:8px"><button class="wbBtn" id="wbBack">← กลับ</button></div>`;
  w.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{if(WB.buy(+b.dataset.b))WB.shop();});w.querySelector('#wbBack').onclick=()=>WB.open();};

/* ---------------- announcements (play mode, anywhere) ---------------- */
let annT=0;setInterval(()=>{try{if(!PLAY)return;const now=Date.now(),nx=rounds(now).find(r=>r.st>now&&r.st-now<16*MIN);if(!nx)return;const m=Math.ceil((nx.st-now)/MIN),I=INFO[nx.key];
  for(const k of [15,5,1]){const id=nx.id+'@'+k;if(m<=k&&m>k-1&&SV.ann!==id){SV.ann=id;save();const st=SV.rd[rdKey(nx.id)];if(st)return;
      chat(`📯 บอสโลก <b style="color:${I.col}">${advRound(nx)?I.adv:I.full}</b> จะตื่นในอีก ${k} นาที (${hhmm(nx.st)}) — ไปที่กิลด์มาสเตอร์ลีโอนาร์ดในเมืองหลวง`);
      if(k<=5)MB.banner(`📯 บอสโลกตื่นในอีก ${k} นาที — กิลด์มาสเตอร์ เมืองหลวง`,'gold',3);}}}catch(e){}},5000);

/* ---------------- test helpers ---------------- */
WB.skip=s=>{const S=WB.S;if(S){if(S.state==='wait')S.wait=Math.min(S.wait,.1);else S.t+=s;}};
WB.debug=()=>{const S=WB.S;return S?{key:S.key,state:S.state,t:S.t,hp:S.hp,hpMax:S.hpMax,win:S.win,me:S.me,allies:S.allies.map(a=>[a.role,a.dead?0:Math.round(a.hp),Math.round(a.pts.tot)]),parts:S.parts.filter(p=>!p.dead).length,adds:S.adds.length,warns:S.warns.length,zones:S.zones.length,st:S.D.dbg?S.D.dbg(S):null}:null;};
})();
