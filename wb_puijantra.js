/* =====================================================================
   WORLD BOSS — Monday: PUIJANTRA, THE MOON RABBIT (WORLD_BOSS_WEEK_TH.md §4). Core: world_boss.js.
   The moon's phases go round: FULL 90 s → HALF 45 s → NEW 40 s → (6 s pause between each: it sits and looks at the sky = time to
   switch totem pages).
   • FULL: it pounds its mortar every 6 s (enraged 4) → a ring wave rolls out with a turning ✓ gap + 7 glowing rice cakes land
     round the field. Walk over a cake = eat it: HP + Lv × 3 and 'moon-full' ATK / MATK + Lv × 0.5 for 10 s (stacks 3). Cakes left
     8 s are sucked back: it heals Lv × 60 each. Thick moon fur: area hits deal at most Lv × 2 a hit — single-target skills land in full.
   • HALF: three leaps across the field (red circle where it lands ×12) and a hammer smash, then one slow sweeping moon beam (×4 a tick).
   • NEW: the field goes dark, it splits into 20 little rabbits (30 enraged) that run about — hard to hit (high FLEE). Kill them all →
     the real one lies there exhausted = window 15 s. Too slow → back to FULL, healing Lv × 60 for every rabbit still running.
   • Gem question 'focus in the full moon, spread in the new moon' → two totem pages, switched in the pauses.
   • Moves: hammer 10 s (front cone ×14) · ear slap 15 s (≥ 3 behind ×8 + push).
   • Advanced: the little rabbits come in matching pairs — if one of a pair dies more than 3 s before its twin, the twin brings it back.
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1228/1170,1:1239/1235},FRONT=.85,PH={full:['เต็มดวง',90],half:['ครึ่งเสี้ยว',45],new:['เดือนมืด',40]};
let st=null;
const units=()=>WB.units();
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}

function setup(S){const B=S.B;st=S.st={ph:'full',phT:90,gap:0,mochi:[],stk:[],jumps:0,beam:0,rab:0,pairs:{},home:{x:B.x,y:B.y},body:null,lie:0};
  MB.cd(B,'pound',3);MB.cd(B,'hammer',6);MB.cd(B,'ear',10);}
function build(S){st=S.st;st.body=WB.body({dx:-40,dy:-24,r:118,h:160,name:'Puijantra'});if(st.ph==='new'&&!st.lie)st.body.hidden=1;}
function nextPhase(S){const B=S.B,o={full:'half',half:'new',new:'full'}[st.ph];st.ph=o;st.phT=PH[o][1];WB.pause(6,'🌙 กระต่ายนั่งมองฟ้า 6 วิ — ข้าง'+PH[o][0]+'มาแล้ว · สลับหน้าเสาโทเท็มได้');
  if(o==='new')st.nmGo=1;   /* the rabbits split off when the 6 s pause is over (game time) */
  if(o==='full'){st.lie=0;if(st.body){st.body.hidden=0;}WB.poseTo();}
  if(o==='half')st.jumps=0,st.beam=0;}

/* ---------------- full moon ---------------- */
function pound(S){const B=S.B;st.gap+=1.15;const g=st.gap;
  WB.act({name:'ตำครก! (ช่องฟ้าในคลื่นปลอดภัย)',T:1.3,start(){WB.strike({shape:{k:'donut',x:B.x,y:B.y-20,r0:120,r1:620,a0:g+.62,a1:g-.62+T2},T:1.3,k:7,boomCol:'#fff2b0'});WB.poseTo({lift:14,rot:-.04,spd:9});},
    end(){WB.poseTo();try{shake(3);}catch(e){}for(let i=0;i<7;i++)dropMochi(S);}});
  MB.cd(B,'pound',S.enr?4:6);}
function dropMochi(S){const B=S.B;for(let k=0;k<14;k++){const a=rn(0,T2),r=rn(150,540),x=B.x+Math.cos(a)*r,y=B.y+Math.sin(a)*r*.85;if(mapBlockedW(x,y)||(S.solid&&S.solid(x,y)))continue;st.mochi.push({x,y,t:0,fly:0});return;}}
function eat(S,m,u){const L=u.lv;WB.healU(u,L*3);if(u.pl){st.stk.push(10);if(st.stk.length>3)st.stk.shift();S.buffAtk=st.stk.length*Math.round(L*.5);try{applyStats();}catch(e){}WB.pts(u,'mech',5);WB.say(u.x,u.y,80,'อิ่มจันทร์! ×'+st.stk.length,'#fff0a8',14);}
  m.eaten=1;}
function hammer(S){const B=S.B;let best=FRONT,bn=-1;for(let k=-3;k<=3;k++){const a=FRONT+k*.4;let c=0;for(const u of units())if(hyp(u.x-B.x,u.y-B.y)<320&&Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.6)c++;if(c>bn){bn=c;best=a;}}
  WB.act({name:'ทุบค้อน!',T:1.05,start(){WB.strike({shape:{k:'cone',x:B.x,y:B.y,phi:best,half:.6,r:310},T:1,k:14,boomCol:'#ffe8b0'});WB.poseTo({rot:.08,px:.6,lift:6});},end(){WB.poseTo();try{shake(4);}catch(e){}}});MB.cd(B,'hammer',10);}
function ear(S){const B=S.B,a=FRONT+Math.PI;let n=0;for(const u of units())if(hyp(u.x-B.x,u.y-B.y)<260&&Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.9)n++;if(n<3){MB.cd(B,'ear',4);return;}
  WB.act({name:'หูฟาด!',T:1.05,start(){WB.strike({shape:{k:'cone',x:B.x,y:B.y,phi:a,half:.9,r:260},T:1,k:8,push:180,boomCol:'#f0e8ff'});},end(){}});MB.cd(B,'ear',15);}

/* ---------------- half moon ---------------- */
function leap(S){const B=S.B,u=WB.topDealer()||units()[0];if(!u)return;let x=u.x,y=u.y;if(S.solid){}
  WB.act({name:'กระโดดข้ามลาน! ('+(st.jumps+1)+'/3)',T:1.15,start(){WB.strike({shape:{k:'circle',x,y,r:125},T:1.1,k:12,cc:['air',.6],boomCol:'#fff2c8'});WB.poseTo({lift:120,spd:4});},
    end(){B.x=x;B.y=y;WB.poseTo({lift:0,spd:14});try{shake(5);}catch(e){}st.jumps++;}});}
function homeJump(S){const B=S.B,x=st.home.x,y=st.home.y;WB.act({name:'กระโดดกลับ',T:.9,start(){WB.poseTo({lift:100,spd:5});},end(){B.x=x;B.y=y;WB.poseTo();}});}
function beam(S){const B=S.B,u=units()[0];const phi0=u?Math.atan2(u.y-B.y,u.x-B.x)-.8:0,sh={k:'rect',x:B.x,y:B.y-10,phi:phi0,len:720,w:90};st.beam=1;
  const w=WB.strike({shape:sh,T:4.4,k:0,noHit:1,col:'red',boom:0,keep:1});
  WB.act({name:'ลำแสงจันทร์ — เดินหนีตามแสง!',T:4.4,step(B2,a,dt){if(a.t>1.3){sh.phi=phi0+Math.min(1,(a.t-1.3)/3)*1.57;a.k=(a.k||0)+dt;if(a.k>=.5){a.k-=.5;for(const q of units())if(MB.inShape(sh,q.x,q.y,6))WB.dmg(q,4,{magic:1,sure:1});}}},
    end(){w.dead=1;}});}

/* ---------------- new moon ---------------- */
function newMoon(S){const B=S.B;st.lie=0;if(st.body)st.body.hidden=1;WB.poseTo({alpha:0,spd:5});if(WB.PU.alive())MB.pc('dark',40,{r:210,col:'8,6,24',a:.82});
  const n=S.enr?30:20;st.pairs={};for(let i=0;i<n;i++){const a=i/n*T2,r=rn(160,480),x=B.x+Math.cos(a)*r,y=B.y+Math.sin(a)*r*.85;rabbit(S,x,y,S.adv?Math.floor(i/2):-1);}
  MB.banner('🌑 เดือนมืด! แตกเป็นกระต่ายเล็ก '+n+' ตัว — ฆ่าให้หมดก่อน 40 วิ','purple',2.6);}
function rabbit(S,x,y,pair){if(mapBlockedW(x,y)){x=st.home.x+rn(-80,80);y=st.home.y+rn(40,120);}
  const e=WB.add({x,y,spr:'Field Rabbit',name:'Moon Bunny',th:pair>=0?'กระต่ายจันทร์ (คู่ '+(pair+1)+')':'กระต่ายจันทร์',hp:Math.round(WB.PU.lv*60),lv:60,flee:110,spd:95,r:13,sc:.8,pts:10,dodge:2,
    goal:e2=>{if(!e2.gx||hyp(e2.gx-e2.x,e2.gy-e2.y)<20){for(let k=0;k<8;k++){const a=rn(0,T2),r=rn(100,560),gx=st.home.x+Math.cos(a)*r,gy=st.home.y+Math.sin(a)*r*.85;if(!mapBlockedW(gx,gy)){e2.gx=gx;e2.gy=gy;break;}}}return e2.gx?{x:e2.gx,y:e2.gy,reach:6}:null;},
    die:(e2)=>{if(pair>=0){const P2=st.pairs[pair]||(st.pairs[pair]={});P2.dt=gameTime;}}});
  e.pair=pair;if(pair>=0)(st.pairs[pair]=st.pairs[pair]||{}).list=(st.pairs[pair].list||[]).concat([e]);e.m.tint=pair>=0?['#ffd0e0','#d0f0ff','#fff0b0','#e0d0ff'][pair%4]:null;return e;}
function newTick(S,dt){const live=S.adds.filter(e=>!e.dead&&e.wbAdd&&e.wbAdd.name==='Moon Bunny');st.rab=live.length;
  if(S.adv)for(const k in st.pairs){const P2=st.pairs[k];if(!P2.list||P2.dt==null)continue;const al=P2.list.filter(e=>!e.dead),dd=P2.list.filter(e=>e.dead);
    if(al.length===1&&dd.length&&gameTime-P2.dt>3){const s=al[0];const e=rabbit(S,s.x+rn(-30,30),s.y+rn(-20,20),+k);P2.list=[s,e];P2.dt=null;WB.say(s.x,s.y,60,'คู่ชุบกลับมา!','#ffd0e8',14);}}
  if(!st.lie&&st.rab===0&&st.ph==='new'&&S.adds.length){st.lie=1;MB.pcClear();if(st.body)st.body.hidden=0;WB.poseTo({alpha:1,sy:.82,rot:.12,px:.4,spd:6});WB.window(15,'กระต่ายหมดแรง! นอนแผ่');}}
function newEnd(S){const live=S.adds.filter(e=>!e.dead&&e.wbAdd&&e.wbAdd.name==='Moon Bunny');if(live.length&&!st.lie){WB.heal(WB.PU.lv*60*live.length);MB.banner(`🌕 ฆ่าไม่ทัน! กระต่ายรวมร่าง ฟื้นเลือด (${live.length} ตัว)`,'red',2.4);}
  for(const e of live){e.dead=true;e.gone=1;}MB.pcClear();st.lie=0;}

/* ---------------- loop ---------------- */
function think(S,dt){const B=S.B;
  if(st.ph==='full'){if(MB.ready(B,'pound')){pound(S);return;}if(MB.ready(B,'hammer')){hammer(S);return;}if(MB.ready(B,'ear')){ear(S);return;}}
  else if(st.ph==='half'){if(st.jumps<3){if(MB.ready(B,'leap')){leap(S);MB.cd(B,'leap',1.4);}return;}if(st.jumps===3){st.jumps=4;hammer(S);return;}if(!st.beam){beam(S);return;}
    if(hyp(B.x-st.home.x,B.y-st.home.y)>20){homeJump(S);MB.cd(B,'again',4);return;}if(MB.ready(B,'again')){st.jumps=0;st.beam=0;}}}   /* the half moon loops: 3 leaps · hammer · beam · home · 4 s · again */
function tick(S,dt){st=S.st;const B=S.B;if(S.state!=='fight')return;
  /* rice cakes: eaten by whoever walks over them, sucked back after 8 s */
  for(let i=st.mochi.length-1;i>=0;i--){const m=st.mochi[i];m.t+=dt;if(m.eaten){st.mochi.splice(i,1);continue;}
    if(m.fly){m.fly+=dt;if(m.fly>.6){st.mochi.splice(i,1);WB.heal(WB.PU.lv*60);WB.say(B.x,B.y,200,'+ดูดโมจิ','#fff0a8',13);}continue;}
    for(const u of units())if(hyp(u.x-m.x,u.y-m.y)<30){eat(S,m,u);break;}if(!m.eaten&&m.t>8)m.fly=.001;}
  if(st.stk.length){for(let i=0;i<st.stk.length;i++)st.stk[i]-=dt;const n0=st.stk.length;st.stk=st.stk.filter(t=>t>0);if(st.stk.length!==n0){S.buffAtk=st.stk.length*Math.round(WB.PU.lv*.5);try{applyStats();}catch(e){}}}
  if(S.pause>0)return;
  if(st.nmGo){st.nmGo=0;if(st.ph==='new')newMoon(S);}
  if(st.ph==='new')newTick(S,dt);
  if(!(S.win>0)){st.phT-=dt;if(st.phT<=0&&!B.mb.act){if(st.ph==='new')newEnd(S);if(st.ph==='half'&&hyp(B.x-st.home.x,B.y-st.home.y)>20){B.x=st.home.x;B.y=st.home.y;}nextPhase(S);}}}
function winEnd(S){if(st.ph==='new'){st.phT=0;}}
function onHit(S,p,d,u,o){if(st.ph!=='full'||p.pkind!=='body')return;const cap=u.lv*2;const aoe=u.pl?!WB.single(o.o):!!o.splash||u.role==='mage';
  if(aoe&&d>cap){p.hp=Math.min(p.maxHp,p.hp+(d-cap));S.hp=p.hp;if(u.pl&&(!p._fT||gameTime-p._fT>.8)){p._fT=gameTime;WB.say(p.x,p.y,170,'ขนจันทร์หนา! ท่าวงกว้างเข้าแค่ '+cap,'#fff6d0',13);}}}

/* ---------------- allies ---------------- */
function allyJob(a,S){if(st.ph==='new'&&!st.lie){const L=S.adds.filter(e=>!e.dead);let b=null,bd=1e9;for(const e of L){const d=hyp(e.x-a.x,e.y-a.y);if(d<bd){bd=d;b=e;}}return b?{tgt:b}:null;}
  if(st.mochi.length&&(a.role==='healer'||a.role==='archer'||a.hp<a.maxHp*.6)){let b=null,bd=520;for(const m of st.mochi){if(m.fly)continue;const d=hyp(m.x-a.x,m.y-a.y);if(d<bd){bd=d;b=m;}}if(b)return {x:b.x,y:b.y,r:6,until:gameTime+3};}
  return null;}
const target=(a,S)=>st.body&&!st.body.dead&&!st.body.hidden?st.body:null;

/* ---------------- drawing ---------------- */
function drawGround(S){for(const m of st.mochi){let x=m.x,y=m.y,z=0;if(m.fly){const k=Math.min(1,m.fly/.6);x+=(S.B.x-x)*k;y+=(S.B.y-y)*k;z=Math.sin(k*Math.PI)*90;}
    const [X,Y]=P(x,y,z),bl=m.t>6&&!m.fly?(Math.sin(gameTime*14)>0?.5:1):1;ctx.save();ctx.globalAlpha=bl;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(X,Y-6,0,X,Y-6,26);g.addColorStop(0,'rgba(255,245,200,.7)');g.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,Y-6,26,0,T2);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fffaf0';ctx.strokeStyle='#8a6a3a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y-7,13,9,0,0,T2);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe9a0';ctx.beginPath();ctx.ellipse(X-3,Y-10,4,2,0,0,T2);ctx.fill();ctx.restore();}}
function hud(S){const ph=PH[st.ph][0];const t=st.ph==='new'?(st.lie?'✦ กระต่ายหมดแรง! ตีได้เต็มที่':`🌑 เดือนมืด — ฆ่ากระต่ายเล็กให้หมด (เหลือ ${st.rab})`):st.ph==='half'?'🌓 ครึ่งเสี้ยว — หลบจุดลง หลบลำแสง':
    `🌕 เต็มดวง — เดินกินโมจิ · ท่าเป้าเดี่ยวเข้าเต็ม ท่าวงกว้างโดนขนกัน`+(st.stk.length?` · อิ่มจันทร์ ×${st.stk.length}`:'');
  return {main:{v:S.hp,m:S.hpMax,lab:'🌙 ปุยจันทรา'},subs:[{v:Math.max(0,st.phT),m:PH[st.ph][1],lab:`ข้าง${ph} อีก ${Math.max(0,Math.ceil(st.phT))} วิ`,col:'linear-gradient(#fff6c0,#d8b040)'}],
    icons:st.mochi.length?[{t:'🍡 โมจิ '+st.mochi.filter(m=>!m.fly).length,col:'#fff0a8'}]:[],phase:t};}
WB.def('puijantra',{hp:N=>190000*N,solid:[118,56,-34,-34],shadow:[230,88],shOff:26,r:150,race:'Brute',el:'Holy 2',
  setup,build,think,tick,onHit,winEnd,allyJob,target,pickDefault:S=>st.body&&!st.body.hidden?st.body:null,drawGround,hud,
  finish(S){WB.poseTo({alpha:1,sy:.92});},
  dbg:S=>({ph:st.ph,phT:Math.round(st.phT),mochi:st.mochi.length,rab:st.rab,lie:st.lie,stk:st.stk.length})});
})();
