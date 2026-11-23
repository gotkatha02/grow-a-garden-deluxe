/* =====================================================================
   WORLD BOSS — Saturday: URTOK, THE TOTEM-BEARER (WORLD_BOSS_TH.md). Core: world_boss.js.
   "Legs count hits, the heart counts damage":
   • 4 legs (normal targets, AUTO hits them): every landed hit = 1 flip point (crit 2; a pinned leg after a stomp / the dizzy spell ×2)
     into one gauge of 90 × N → it topples onto its side and the crystal heart on its chest opens (= the window) for
     20 s + 4 s per broken pillar (max 40). Only the heart lowers its HP (45,000 × N). Then it rolls back up: shell quake + shell spin.
   • 5 land crystals on the shell (gold ◎, 25,000 × N each, shoot them from ≥ 150 — melee cannot reach): each standing one strikes its
     land's zone every 10 s and lets out a shard wisp every 20 s (high FLEE, one hit kills) that flies to a leg and repairs it (−2 × N).
     Broken = that zone is quiet, the heart window +4 s and the land's spirit blesses everyone (HIT +15 · speed · HP regen · SP −5 · ATK/MATK).
   • Guard ring in front of the head: someone standing in it takes the bite and the breath for everyone.
   • Moves (victim's Lv × k): stomp 12 s (the pair with more people, ×14 + up) · bite 8 s (ring / top dealer ×20) · every 3rd bite =
     ancient breath (cone, 6 × ×4, only the ring when it is held) · tail 15 s (≥ 3 behind, ×9 + push) · shell spin after getting up and
     at minute 10 (2 red lanes ×12 + down, then dizzy 4 s) · shell quake on getting up + every 90 s (×8 everyone, cannot be dodged).
   • Enrage (min 16 / adv 13): every move ×0.6 waits, quake every 30 s · advanced: each leg counts at most a quarter of the gauge,
     it spins twice after getting up.
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const LEGS=[[.12,.84,'ขาหลัง (ไกล)'],[.31,.965,'ขาหลัง (ใกล้)'],[.62,.965,'ขาหน้า (ใกล้)'],[.88,.87,'ขาหน้า (ไกล)']];
const PIL=[['vik',.21,.36,'#8fe0ff','ไวกิ้ง','อีกา','hit','HIT +15'],['grk',.30,.21,'#fff0a8','กรีก','ม้าบิน','move','วิ่งเร็ว +30'],
  ['egy',.38,.31,'#ffc860','อียิปต์','สคารับ','regen','ฟื้น HP เลเวล × 0.5 ต่อวิ'],['jpn',.63,.24,'#ff8ab8','ญี่ปุ่น','กระเรียน','sp','สกิลใช้ SP −5'],
  ['azt',.72,.36,'#5ae6d6','แอซเท็ก','งูขนนก','atk','ATK / MATK + เลเวล × 0.5']];
const ZONE={vik:[720,150],jpn:[1180,300],egy:[1230,560],azt:[770,720],grk:[330,520]},ZR=300;
const RAT={0:1234/1166,1:1254/1253};
let st=null;   /* this fight's state (S.st) */
const S0=()=>WB.S;
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}
const units=()=>WB.units();
const lvU=u=>u.lv;

/* ---------------- setup / parts ---------------- */
function setup(S){const N=S.N;st=S.st={g:0,G:Math.round(90*N),legs:LEGS.map(()=>({pin:0,cnt:0,p:null})),pil:PIL.map((q,i)=>({land:q[0],i,max:Math.round(25000*N*(S.adv?1.6:1)),hp:Math.round(25000*N*(S.adv?1.6:1)),broken:0,p:null,cd:4+i*2,sp:9+i*3})),
  bites:0,down:0,retract:0,dizzy:0,spun10:0,spins:0,heart:null,vort:0,tgt:{rot:0,lift:0,dx:0,dy:0,sx:1,sy:1,px:.5,py:.94},flipT:0,ring:null,zones:{}};
  const B=S.B;for(const k in ZONE){const [x,y]=WB.F2W(ZONE[k][0],ZONE[k][1]);st.zones[k]={x,y};}
  const [rx,ry]=off(S,.86,1.16);st.ring={x:B.x+rx+12,y:B.y+ry,r:78};
  MB.cd(B,'stomp',7);MB.cd(B,'bite',4);MB.cd(B,'tail',9);MB.cd(B,'quake',90);}
function build(S){st=S.st;const B=S.B;
  LEGS.forEach((L,i)=>{const [dx,dy]=off(S,L[0],L[1]);const p=WB.part({x:B.x+dx,y:B.y+dy,name:'Urtok Leg',th:'เออร์ทอค · '+L[2],r:36,h:66,nohp:1,auto:1,job:'leg',kind:'leg',data:{i},
      def:Math.round(B.m.def*.55),mdef:Math.round(B.m.mdef*.55),flee:0,tlv:()=>[st.g,st.G],
      hitOK:()=>!st.down&&!st.retract});p.noTxt='ตีไม่เข้า';st.legs[i].p=p;});
  st.pil.forEach((q,i)=>{if(q.broken)return;const P=PIL[i],[dx]=off(S,P[1],P[2]);
    q.p=WB.part({x:B.x+dx,y:B.y-40,name:'Land Crystal',th:'เสาคริสตัล'+P[4],hp:q.hp,r:22,h:60,job:'part',kind:'pil',data:{i},def:95,mdef:12,flee:0,minD:150,noNear:1,auto:0,
      onBreak:()=>pillarBreak(S,i)});q.p.maxHp=q.max;q.p.hp=q.hp;});
  const [hx,hy]=off(S,.62,1.04);st.heart=WB.part({x:B.x+hx,y:B.y+hy,name:'Crystal Heart',th:'หัวใจคริสตัล',hp:Math.max(1,S.hp),r:40,h:64,main:1,winOpen:1,job:'core',kind:'heart',auto:1,
    def:Math.round(B.m.def*.7),mdef:Math.round(B.m.mdef*.7),flee:0,onBreak:()=>{WB.end('win');}});st.heart.maxHp=S.hpMax;st.heart.hp=S.hp;st.heart.hidden=st.down?0:1;}

/* ---------------- helpers ---------------- */
const legP=i=>st.legs[i].p;
const liveLegs=()=>st.legs.map(L=>L.p).filter(p=>p&&!p.dead);
const nearLeg=(x,y)=>{let b=null,bd=1e9;for(const p of liveLegs()){const d=hyp(p.x-x,p.y-y);if(d<bd){bd=d;b=p;}}return b;};
const inRing=u=>hyp(u.x-st.ring.x,u.y-st.ring.y)<st.ring.r;
const guards=()=>units().filter(inRing);
const headPt=S=>{const B=S.B,[dx,dy]=off(S,.86,1.04);return {x:B.x+dx,y:B.y+dy};};
function setPose(o){Object.assign(st.tgt,{rot:0,lift:0,dx:0,dy:0,sx:1,sy:1,px:.5,py:.94},o||{});}
function behind(S){const B=S.B,[tx,ty]=off(S,.02,.8);const a=Math.atan2(ty-(st.ring.y-B.y),tx-(st.ring.x-B.x));let n=0;
  for(const u of units()){const d=hyp(u.x-(B.x+tx),u.y-(B.y+ty));if(d<250&&Math.abs(angDiff(Math.atan2(u.y-B.y-ty,u.x-B.x-tx),a))<.8)n++;}return {n,a,x:B.x+tx,y:B.y+ty};}

/* ---------------- moves ---------------- */
function stomp(S){const B=S.B;const near=pair=>{let n=0;for(const u of units())for(const i of pair){const p=legP(i);if(p&&hyp(u.x-p.x,u.y-p.y)<150){n++;break;}}return n;};
  const front=near([2,3])>=near([0,1]),pair=front?[2,3]:[0,1];
  WB.act({name:front?'ยกขาคู่หน้า — ออกจากเงา!':'ยกตัวหลัง — ออกจากเงา!',T:1.5,
    start(){for(const i of pair){const p=legP(i);if(p)WB.strike({shape:{k:'circle',x:p.x,y:p.y+4,r:96},T:1.5,k:14,cc:['air',.8],boomCol:'#e8d0a0'});}
      setPose(front?{rot:-.08,px:.3,lift:6}:{rot:.08,px:.72,lift:6});},
    end(){setPose();for(const i of pair)st.legs[i].pin=3;try{shake(4);}catch(e){}MB.say(B,'ขาติดพื้น! ตี ×2','#ffe08a',18);}});
  MB.cd(B,'stomp',12);}
function bite(S){const B=S.B;st.bites++;if(st.bites%3===0){breath(S);return;}
  const g=guards(),h=headPt(S);
  if(g.length){WB.act({name:'งับ!',T:1.05,start(){WB.strike({shape:{k:'circle',x:st.ring.x,y:st.ring.y,r:st.ring.r+6},T:1.0,k:20,tank:1,only:inRing,col:'red',boomCol:'#ffd0a0'});setPose({dx:14,dy:10,sx:1.03});},end(){setPose();}});}
  else{const u=WB.topDealer()||units()[0];if(!u){MB.cd(B,'bite',4);return;}const phi=Math.atan2(u.y-h.y,u.x-h.x),len=Math.min(620,hyp(u.x-h.x,u.y-h.y)+90);
    WB.act({name:'ยืดคองับ — คนตีแรงสุด!',T:2.05,start(){WB.strike({shape:{k:'rect',x:h.x,y:h.y,phi,len,w:76},T:2.0,k:20,boomCol:'#ffd0a0'});},step(B2,a){if(a.t>1.7)setPose({dx:Math.cos(phi)*26,dy:Math.sin(phi)*26,sx:1.04});},end(){setPose();}});}
  MB.cd(B,'bite',8);}
function breath(S){const B=S.B,h=headPt(S),g=guards().length>0,phi=Math.atan2(st.ring.y-h.y,st.ring.x-h.x),half=.78,R=520;
  const live=st.pil.filter(q=>!q.broken).sort((a,b)=>b.hp-a.hp)[0],col=live?PIL[live.i][3]:'#e8e8ff';
  const shape={k:'cone',x:h.x,y:h.y,phi,half,r:R};
  WB.act({name:g?'ลมหายใจบรรพกาล — วงผู้พิทักษ์รับไว้!':'ลมหายใจบรรพกาล — วงว่าง โดนทั้งหน้า!',T:5.1,
    start(){WB.strike({shape,T:2,k:0,noHit:1,col:'red',boom:0});setPose({rot:-.04,px:.3});},
    step(B2,a,dt){if(a.t<2)return;a.n=a.n||0;a.k=(a.k||0)+dt;if(a.t<2.05&&!a.w2){a.w2=WB.strike({shape,T:3.05,k:0,noHit:1,col:'red',boom:0,keep:1});}
      if(a.k>=.5&&a.n<6){a.k-=.5;a.n++;const gs=g?guards():null;for(const u of units()){if(!MB.inShape(shape,u.x,u.y,8))continue;if(gs&&!gs.includes(u))continue;WB.dmg(u,4,{magic:1,sure:1,tank:g?1:0});}
        breathFx(h,phi,half,R,col);}},
    end(){setPose();if(a2(this))a2(this).dead=1;}});
  MB.cd(B,'bite',8);}
const a2=a=>a&&a.w2;
function tail(S){const B=S.B,bh=behind(S);WB.act({name:'ฟาดหาง!',T:1.25,start(){WB.strike({shape:{k:'cone',x:bh.x,y:bh.y,phi:bh.a,half:.7,r:250},T:1.2,k:9,push:200,fx:bh.x,fy:bh.y});setPose({rot:.05,px:.7});},end(){setPose();}});MB.cd(B,'tail',15);}
function quake(S,then){const B=S.B;WB.act({name:'กระดองสะเทือน — ทั้งลาน หลบไม่ได้!',T:2,
    start(){setPose({rot:-.17,px:.3,lift:10});MB.banner('⚠ กระดองสะเทือนทั้งลาน — เลือดต้องเต็ม!','red',1.8);},
    end(){setPose();for(const u of units())WB.dmg(u,8,{sure:1});try{shake(7);}catch(e){}quakeFx(S);if(then)then();}});
  MB.cd(B,'quake',S.enr?30:90);}
function spin(S,n){const B=S.B;n=n||1;const us=units();let best=0,bn=-1;for(let k=0;k<8;k++){const a=k/8*T2;let c=0;for(const u of us){if(Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.5)c++;}if(c>bn){bn=c;best=a;}}
  const lanes=[best,best+Math.PI];
  WB.act({name:'หดหัวหมุนกระดอง — หลบทางแดง!',T:2.3,
    start(){st.retract=1;for(const a of lanes){const x=B.x+Math.cos(a)*60,y=B.y-30+Math.sin(a)*60;WB.strike({shape:{k:'rect',x,y,phi:a,len:720,w:132},T:2.2,k:12,cc:['stun',1],boomCol:'#d8c0ff'});}
      setPose({sx:.93,sy:.9,lift:4});},
    step(B2,a,dt){st.flipT+=dt;if(a.t>.6&&st.flipT>.085){st.flipT=0;B.pose.flip=B.pose.flip?0:1;}B.pose.shake=a.t>1.8?3:1;},
    end(){B.pose.flip=0;B.pose.shake=0;setPose();try{shake(4);}catch(e){}
      if(n>1){spin(S,n-1);return;}st.retract=0;st.dizzy=4;MB.say(B,'มึน! ขาแต้ม ×2','#ffe08a',20);}});}
function topple(S){const B=S.B;WB.act({name:'โยกเยก… กำลังล้ม!',T:1.5,step(B2,a){B.pose.rot=Math.sin(a.t*13)*.06;},
  end(){st.down=1;setPose({rot:-1.02,px:.32,lift:0,dy:10});const n=st.pil.filter(q=>q.broken).length;st.heart.hidden=0;
    WB.window(Math.min(40,20+4*n),'ล้มตะแคง! หัวใจเปิด');try{shake(6);}catch(e){}dustRing(S,1);}});}
function getUp(S){const B=S.B;st.heart.hidden=1;if(window.TL&&TL.e===st.heart)try{TL.set(null);}catch(e){}
  WB.act({name:'ดีดตัวลุก!',T:1.1,start(){setPose({rot:-.2,px:.32,lift:12});},end(){st.down=0;st.g=0;for(const L of st.legs)L.cnt=0;setPose();try{shake(5);}catch(e){}
    quake(S,()=>spin(S,S.adv?2:1));}});}

/* ---------------- land hazards (each standing crystal, every 10 s) + shard wisps ---------------- */
function hazard(S,q){const z=st.zones[q.land],us=units().filter(u=>hyp(u.x-z.x,u.y-z.y)<ZR),col=PIL[q.i][3];
  switch(q.land){
    case 'vik':{const L=us.slice().sort((a,b)=>(b.zt.vik||0)-(a.zt.vik||0)).slice(0,3);const pts=L.length?L.map(u=>[u.x,u.y]):[[z.x+rn(-150,150),z.y+rn(-100,100)]];
      for(const [x,y] of pts)WB.strike({shape:{k:'circle',x,y,r:72},T:1.4,k:9,col:'red',boomCol:'#cfefff',onFire:(h)=>icicleFx(x,y)});break;}
    case 'grk':{const sc=us.map(u=>[u,us.filter(o=>o!==u&&hyp(o.x-u.x,o.y-u.y)<60).length]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
      const pts=sc.length?sc.map(u=>[u.x,u.y]):[[z.x+rn(-120,120),z.y+rn(-90,90)]];
      for(const [x,y] of pts)WB.strike({shape:{k:'circle',x,y,r:62},T:1.2,k:8,magic:1,col:'red',boomCol:'#fff6b0',onFire:(hit)=>{boltFx(x,y);for(const u of hit)for(const o of units())if(o!==u&&!hit.includes(o)&&hyp(o.x-u.x,o.y-u.y)<60)WB.dmg(o,5,{magic:1,sure:1});}});break;}
    case 'egy':{st.vort=3;st.vx=z.x;st.vy=z.y;if(us.includes(WB.PU)&&WB.PU.alive())MB.pc('pull',3,{to:()=>[z.x,z.y],v:75,stop:30});
      WB.strike({shape:{k:'circle',x:z.x,y:z.y,r:125},T:3,k:10,col:'red',boomCol:'#ffd890'});break;}
    case 'jpn':{const B=S.B,a0=Math.atan2(z.y-B.y,z.x-B.x),phi=a0+Math.PI/2;for(let k=0;k<3;k++){const o=(k-1)*150,cx=z.x+Math.cos(a0)*o,cy=z.y+Math.sin(a0)*o,len=560;
        WB.strike({shape:{k:'rect',x:cx-Math.cos(phi)*len/2,y:cy-Math.sin(phi)*len/2,phi,len,w:70},T:1+k*.55,k:8,magic:1,dot:['mbBurn',4,.8],col:'red',boomCol:'#ffb080'});}break;}
    case 'azt':{const pts=us.slice(0,4).map(u=>[u.x,u.y]);while(pts.length<6)pts.push([z.x+rn(-220,220),z.y+rn(-160,160)]);
      for(const [x,y] of pts)WB.strike({shape:{k:'circle',x,y,r:52},T:1.0+Math.random()*.4,k:7,col:'red',boomCol:'#5a4a6a'});
      if(us.includes(WB.PU)&&WB.PU.alive())MB.pc('dark',4,{r:200,col:'10,6,18',a:.85});break;}}
  hazardGlow(z.x,z.y,col);}
function spawnWisp(S,q){const p=q.p;if(!p||p.dead)return;const e=WB.add({x:p.x+rn(-30,30),y:p.y+40,spr:'Water Sprite',name:'Shard Wisp',th:'วิญญาณเศษคริสตัล',hp:1,lv:60,flee:150,spd:40,fly:1,r:14,sc:.85,pts:15,dodge:3,
    goal:e2=>{const L=nearLeg(e2.x,e2.y);return L?{x:L.x,y:L.y,reach:24,leg:L}:null;},
    arrive:(e2)=>{if(e2.dead)return;e2.dead=true;e2.deadT=0;e2.hp=0;const n=Math.round(2*S.N);st.g=Math.max(0,st.g-n);WB.say(e2.x,e2.y,60,'ซ่อมขา! −'+n,'#9fe8ff',15);mendFx(e2.x,e2.y);}});
  e.m.tint='#9fe8ff';}
function pillarBreak(S,i){const q=st.pil[i],P=PIL[i];q.broken=1;q.hp=0;S.blessings[P[6]]=1;try{applyStats();}catch(e){}
  MB.banner(`💥 เสา${P[4]}แตก! ${P[5]}วิญญาณให้พรทั้งลาน: ${P[7]}`,'gold',3);try{chatLog('sys',`💥 <b style="color:${P[3]}">เสาคริสตัล${P[4]}</b> แตก — ${P[5]}วิญญาณบินออกมา ให้พร <b>${P[7]}</b> ทั้งลานจนจบศึก · หัวใจจะเปิดนานขึ้น 4 วิ`);}catch(e){}
  const s=WB.picAt(P[1],P[2]);if(s)addFx(new SpiritUp({sx:s[0],sy:s[1],col:P[3],txt:P[5]}));try{shake(3);}catch(e){}}

/* ---------------- the loop ---------------- */
function think(S,dt){const B=S.B;if(st.down||st.retract)return;
  if(st.g>=st.G){topple(S);return;}
  if(MB.ready(B,'quake')){quake(S);return;}
  if(!st.spun10&&S.t>=600){st.spun10=1;spin(S);return;}
  if(MB.ready(B,'stomp')){stomp(S);return;}
  if(MB.ready(B,'bite')){bite(S);return;}
  if(MB.ready(B,'tail')&&behind(S).n>=3){tail(S);return;}}
function tick(S,dt){st=S.st;const B=S.B,po=B.pose,T=st.tgt,k=Math.min(1,dt*7);
  for(const n of ['rot','lift','dx','dy','sx','sy','px','py'])po[n]+=(T[n]-po[n])*k;
  for(const L of st.legs)if(L.p)L.p.noTxt=st.down?'ขาตะกุยอากาศ — ตีหัวใจที่อก!':st.retract?'หดอยู่ในกระดอง':'ตีไม่เข้า';
  if(st.down)po.rot+=Math.sin(S.t*7)*.004;
  for(const L of st.legs)if(L.pin>0)L.pin-=dt;if(st.dizzy>0)st.dizzy-=dt;
  /* parts follow the picture: the heart on the chest, the crystals on the shell (z for picking / the reticle) */
  if(st.heart&&!st.heart.dead){const s=WB.picAt(.62,.71);if(s){const p=st.heart;p.z0=Math.max(0,WB.zFor(p.x,p.y,s[0],s[1]));p.z=p.z0;}}
  st.pil.forEach((q,i)=>{const p=q.p;if(!p||p.dead)return;q.hp=p.hp;const s=WB.picAt(PIL[i][1],PIL[i][2]);if(s){p.z0=Math.max(0,WB.zFor(p.x,p.y,s[0],s[1])-10);p.z=p.z0;}});
  if(S.state!=='fight')return;
  /* trackers: time spent in each land zone (vik picks the 3 who stayed longest) */
  for(const u of units())for(const z in st.zones){const Z2=st.zones[z];if(hyp(u.x-Z2.x,u.y-Z2.y)<ZR)u.zt[z]=(u.zt[z]||0)+dt;else u.zt[z]=0;}
  if(st.vort>0){st.vort-=dt;for(const a of S.allies){if(a.dead)continue;const d=hyp(a.x-st.vx,a.y-st.vy);if(d<ZR&&d>30){a.x+=(st.vx-a.x)/d*50*dt;a.y+=(st.vy-a.y)/d*50*dt;}}}
  if(st.down||st.retract)return;   /* toppled: the crystals are quiet */
  const per=Math.max(1,Math.ceil(S.N/20)),wispT=20/per;
  for(const q of st.pil){if(q.broken)continue;q.cd-=dt;if(q.cd<=0){q.cd=10;hazard(S,q);}q.sp-=dt;if(q.sp<=0){q.sp=wispT;spawnWisp(S,q);}}}
function onHit(S,p,d,u,o){if(p.pkind!=='leg')return;const L=st.legs[p.data.i];if(st.down||st.retract)return;
  let n=o.crit?2:1;const dbl=L.pin>0||st.dizzy>0;if(dbl){n*=2;WB.pts(u,'leg',n/2);}
  if(S.adv){n=Math.min(n,Math.max(0,st.G/4-L.cnt));if(n<=0&&u.pl&&(!L._capT||gameTime-L._capT>1.2)){L._capT=gameTime;WB.say(p.x,p.y,70,'ขานี้เต็มแล้ว — ตีขาอื่น!','#ffd8a8',13);}}
  L.cnt+=n;st.g=Math.min(st.G,st.g+n);}

/* ---------------- allies ---------------- */
function allyJob(a,S){if(st.down&&st.heart&&!st.heart.dead&&!st.heart.hidden)return {tgt:st.heart,mul:1};
  if(a.role==='tank'&&a.id<=2&&!st.retract){const an=a.id*2.1,r=st.ring.r*.45;return {x:st.ring.x+Math.cos(an)*r,y:st.ring.y+Math.sin(an)*r*.7,r:10,stay:1};}
  if(st.retract)return {x:a.x,y:a.y,r:400};
  return null;}
function target(a,S){const wisps=S.adds.filter(e=>!e.dead);
  if(wisps.length&&(a.role==='archer'||(a.role==='melee'&&a.id%2))){let b=null,bd=1e9;for(const e of wisps){const d=hyp(e.x-a.x,e.y-a.y);if(d<bd){bd=d;b=e;}}if(b&&(a.role==='archer'||bd<260))return b;}
  const pl=st.pil.filter(q=>!q.broken&&q.p&&!q.p.dead).map(q=>q.p);
  if(pl.length&&(a.role==='mage'||a.role==='healer'||a.role==='archer')){pl.sort((x,y)=>x.hp-y.hp);return pl[a.role==='archer'&&pl.length>1?1:0];}   /* focus the weakest crystal: they break one by one */
  const lg=liveLegs();return lg.length?lg[a.id%lg.length]:null;}

/* ---------------- drawing ---------------- */
class SpiritUp{constructor(o){Object.assign(this,o);this.t=0;this.layer='top';}update(dt){this.t+=dt;return this.t<2.4;}
  draw(){const k=this.t/2.4,x=this.sx+Math.sin(this.t*3)*14,y=this.sy-k*180;ctx.save();ctx.globalCompositeOperation='lighter';const r=26*(1-k*.4);
    const g=ctx.createRadialGradient(x,y,0,x,y,r*2.2);g.addColorStop(0,hexA(this.col,.9));g.addColorStop(.4,hexA(this.col,.45));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.2,0,T2);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1-k*k;ctx.font='600 16px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#221408';ctx.strokeText(this.txt+'วิญญาณ',x,y-30);ctx.fillStyle='#fff6d8';ctx.fillText(this.txt+'วิญญาณ',x,y-30);ctx.restore();}}
class Burst{constructor(o){Object.assign(this,{t:0,layer:'top',life:.6},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z||0);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-k;const r=this.r*(.4+k*.8);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(this.col,.85));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,T2);ctx.fill();
    if(this.bolt){ctx.strokeStyle='#fffbe0';ctx.lineWidth=3;ctx.beginPath();let bx=x+rn(-6,6),by=y-260;ctx.moveTo(bx,by);for(let i=0;i<7;i++){bx+=rn(-16,16);by+=260/7;ctx.lineTo(bx,by);}ctx.stroke();}
    ctx.restore();}}
const breathFx=(h,phi,half,R,col)=>{for(let i=0;i<6;i++){const a=phi+rn(-half,half)*.8,d=rn(60,R);emit({type:'round',x:h.x+Math.cos(a)*d,y:h.y+Math.sin(a)*d,z:rn(20,60),vz:rn(-10,30),drag:2,life:rn(.35,.6),size:rn(6,12),size1:2,color:col});}};
const icicleFx=(x,y)=>{addFx(new Burst({x,y,z:10,r:70,col:'#bff0ff'}));for(let i=0;i<8;i++)emit({type:'shard',x:x+rn(-20,20),y:y+rn(-12,12),z:rn(8,30),vz:rn(80,180),vx:rn(-60,60),vy:rn(-40,40),drag:1,life:rn(.4,.7),size:rn(2,4),color:'#dff8ff'});};
const boltFx=(x,y)=>addFx(new Burst({x,y,z:0,r:60,col:'#fff2a0',bolt:1,life:.45}));
const mendFx=(x,y)=>addFx(new Burst({x,y,z:20,r:46,col:'#8fe8ff'}));
const hazardGlow=(x,y,col)=>addFx(new Burst({x,y,z:0,r:120,col,life:.9}));
function quakeFx(S){const B=S.B;for(let i=0;i<3;i++)addFx(new GRing({x:B.x,y:B.y,r0:60+i*40,r1:900,w:14,color:'#e8c890',life:.9+i*.15}));dustRing(S,0);}
function dustRing(S,big){const B=S.B;for(let i=0;i<(big?16:10);i++){const a=i/(big?16:10)*T2;try{dustPuff(B.x+Math.cos(a)*170,B.y+Math.sin(a)*90,4,'#c8b090',90,12);}catch(e){}}}
function drawOn(S){const B=S.B;if(!S.pic.ok)return;
  st.pil.forEach((q,i)=>{const P=PIL[i],s=WB.picAt(P[1],P[2]);if(!s)return;const [x,y]=s;ctx.save();
    if(q.broken){ctx.globalAlpha=.8;ctx.fillStyle='rgba(30,24,40,.55)';ctx.beginPath();ctx.ellipse(x,y+6,16,24,0,0,T2);ctx.fill();ctx.strokeStyle='rgba(230,230,255,.5)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-8,y-12);ctx.lineTo(x+2,y+2);ctx.lineTo(x-4,y+14);ctx.moveTo(x+2,y+2);ctx.lineTo(x+10,y-4);ctx.stroke();ctx.restore();return;}
    const pu=.6+.4*Math.sin(gameTime*3+i);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,34);g.addColorStop(0,hexA(P[3],.55*pu));g.addColorStop(1,hexA(P[3],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,34,0,T2);ctx.fill();
    ctx.globalCompositeOperation='source-over';const k=q.hp/q.max,R=21;ctx.lineWidth=5;ctx.strokeStyle='rgba(20,10,4,.6)';ctx.beginPath();ctx.arc(x,y,R,0,T2);ctx.stroke();ctx.strokeStyle=P[3];ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,R,-Math.PI/2,-Math.PI/2+T2*k);ctx.stroke();
    ctx.setLineDash([5,4]);ctx.lineDashOffset=-gameTime*20;ctx.lineWidth=1.6;ctx.strokeStyle='#ffd23a';ctx.beginPath();ctx.arc(x,y,R+5,0,T2);ctx.stroke();ctx.setLineDash([]);
    ctx.font='700 12px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x+R+8,y+4);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x+R+8,y+4);ctx.restore();});
  const h=st.heart;const s=WB.picAt(.62,.71);if(s){const [x,y]=s;ctx.save();ctx.globalCompositeOperation='lighter';const open=h&&!h.hidden&&!h.dead,R=open?60+8*Math.sin(gameTime*6):26+3*Math.sin(gameTime*2);
    const g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,250,220,${open?.95:.4})`);g.addColorStop(.35,`rgba(255,220,120,${open?.6:.2})`);g.addColorStop(1,'rgba(255,190,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,T2);ctx.fill();
    if(open){ctx.strokeStyle='rgba(255,240,180,.75)';ctx.lineWidth=2;for(let i=0;i<10;i++){const a=i/10*T2+gameTime*.6,r0=R*.55,r1=R*1.35;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0);ctx.lineTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);ctx.stroke();}}
    ctx.restore();}
  if(st.dizzy>0){const s2=WB.picAt(.86,.5);if(s2){ctx.save();ctx.strokeStyle='#ffe9a0';ctx.lineWidth=2.4;for(let i=0;i<3;i++){const a=gameTime*5+i*T2/3;ctx.beginPath();ctx.arc(s2[0]+Math.cos(a)*22,s2[1]-30+Math.sin(a)*7,5,0,T2);ctx.stroke();}ctx.restore();}}}
function drawGround(S){const r=st.ring;if(!r)return;const [x,y]=P(r.x,r.y,0),held=guards().length>0;ctx.save();ctx.translate(x,y);ctx.scale(1,K);
  ctx.globalAlpha=.9;ctx.fillStyle=held?'rgba(80,150,255,.18)':'rgba(80,150,255,.08)';ctx.beginPath();ctx.arc(0,0,r.r,0,T2);ctx.fill();ctx.lineWidth=held?3.4:2.4;ctx.strokeStyle=held?'#9fd2ff':'rgba(159,210,255,.7)';
  ctx.setLineDash(held?[]:[10,7]);ctx.lineDashOffset=-gameTime*20;ctx.beginPath();ctx.arc(0,0,r.r,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  ctx.save();ctx.font='600 12px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#0a1a30';const t=held?'⛨ วงผู้พิทักษ์ (มีคนรับ)':'⛨ วงผู้พิทักษ์ — ว่าง';ctx.strokeText(t,x,y+r.r*K+16);ctx.fillStyle='#d8ecff';ctx.fillText(t,x,y+r.r*K+16);ctx.restore();
  st.legs.forEach(L=>{const p=L.p;if(!p||p.dead||!(L.pin>0||st.dizzy>0)||st.down)return;const [lx,ly]=P(p.x,p.y,0);ctx.save();ctx.translate(lx,ly);ctx.scale(1,K);ctx.lineWidth=3;ctx.strokeStyle='#ffd23a';ctx.globalAlpha=.85;
    ctx.beginPath();ctx.arc(0,0,40+3*Math.sin(gameTime*8),0,T2);ctx.stroke();ctx.restore();MB.g.text(lx,ly-78,'×2',14,'#ffe08a');});}

/* ---------------- HUD ---------------- */
function hud(S){const ph=st.down?'✦ ล้มตะแคง! หัวใจเปิด — รุมตีหัวใจที่อก':st.retract?'หดหัวหมุนกระดอง — ขาตีไม่เข้า หลบทางแดง!':st.dizzy>0?'มึน! ตีขาแต้ม ×2':st.legs.some(L=>L.pin>0)?'ขาติดพื้น — ตีขานั้นแต้ม ×2':
    'ทุบขาให้เกจพลิกเต็ม → มันล้ม · ยิงเสาคริสตัลจากไกล ≥ 150'+(S.adv?' · ขาละไม่เกิน ¼ เกจ':'');
  return {main:{v:S.hp,m:S.hpMax,lab:'💎 หัวใจคริสตัล',col:'linear-gradient(#fff2b0,#e8a020)'},
    subs:st.down?[]:[{v:st.g,m:st.G,lab:`เกจพลิก ${Math.floor(st.g)} / ${st.G} (ตีขา = 1 · คริ = 2)`,col:'linear-gradient(#ffd8a0,#c87a30)'}],
    icons:st.pil.map((q,i)=>({t:PIL[i][4]+' '+(q.broken?'แตก':Math.ceil(q.hp/q.max*100)+'%'),off:q.broken,col:PIL[i][3]})),phase:ph};}
function pickDefault(S){if(st.down&&st.heart&&!st.heart.hidden&&!st.heart.dead)return st.heart;return nearLeg(player.x,player.y);}
function winEnd(S){if(st.down)getUp(S);}
function finish(S,res){const B=S.B;if(st&&res==='win'){Object.assign(st.tgt,{rot:0,lift:-6,sy:.94,sx:1.02,px:.5});B.pose.rot=0;}}

WB.def('urtok',{hp:N=>45000*N,cd0:{},solid:[132,64,-36],shadow:[230,90],shOff:30,r:150,race:'Brute',el:'Earth 2',
  setup,build,think,tick,onHit,allyJob,target,drawOn,drawGround,hud,pickDefault,winEnd,finish,
  enrage(S){MB.cd(S.B,'quake',Math.min(30,S.B.mb.cd.quake||30));},
  idleJob(a,S){const c=S.camp;return {x:c.x+Math.cos(a.slot)*(90+a.id*6),y:c.y-140+Math.sin(a.slot)*50,r:14};},
  dbg:S=>({g:st.g,G:st.G,down:st.down,ret:st.retract,pil:st.pil.map(q=>q.broken?0:q.hp),bites:st.bites,blessings:Object.keys(S.blessings)})});
})();
