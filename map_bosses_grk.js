/* =====================================================================
   GREEK MAP BOSSES (MAP_BOSS_MECHANICS_TH.md §6) — scripts for map_boss_kit.js.
   · Hecate (grkH1 · Lv 37): moon fire under the hero every 3 s (magic) · 2 black hounds (back 20 s after they die) · torch lash ·
       KEY MOTH: a slow gold-rimmed moth flies at the hero — hit it once, or the most-used skill of the last 20 s is sealed 8 s ·
       CROSSROADS (every 30 s + at 66 / 33 %): she blinks to the middle, the ground splits into 3 roads (purple · silver · gold),
       she raises one torch 2.5 s, the other two roads explode (magic ×2.2, SP −20) — standing in the road of her torch's colour =
       she loses her balance 4 s (window). Phase < 33 %: two crossroads in a row (the second turned 60°), moths come in pairs.
   · Trojan Colossus (grkH2 · Lv 44): rides a wooden war cart round an oval track (wheel ruts, ~0.8 × hero speed) ·
       charge (long line, then 2 s turning) · arrow rain (5 circles round the hero; fire arrows below 50 %) ·
       belly door every 25 s (3 bronze hoplites jump out, door open = DEF 0) · WHEELS: 4 gold wheels; both wheels of ONE side broken =
       the cart topples 8 s (window). It rises and 2 carpenters run in to repair (15 s) — kill them and the broken wheels stay broken.
       Wheels broken on both sides (one each) = slower, no topple.
   · Polyphemus (grkD1b · Lv 49): club sweep (140° cone) · stomp (circle round him, knock-down) · rock throw (the rock stays as cover 20 s) ·
       EYE SEARCH every 25 s: a light cone sweeps the cave for 4 s; caught in it while not hidden (in the blue shadow behind a big rock,
       or next to a sheep) = a giant rock ×3 + stun; nobody found → 'Nobody?!' 2 s window · WINE: break a jar (gold) → a wine pool 15 s;
       lure him through it (he walks straight at you) → drunk 7 s (window). 3 jars, a new set 60 s after the last one is gone.
       Phase < 35 %: he throws sheep at you, and the sheep run to the walls (fewer to hide by).
   ===================================================================== */
(function(){
const M=window.MBK;if(!M)return;
const T2=Math.PI*2,G=M.g,lv=M.lvOf;
const pose=(e,T)=>{e.atk=T;e.face=player.x>=e.x?1:-1;};
const hitPose=e=>{e.atk=0;e._hitT=gameTime;};
const free=(x,y)=>!curMap||!mapBlockedW(x,y);
function spot(cx,cy,a,r){for(let k=0;k<14;k++){const x=cx+Math.cos(a+k*.45)*r,y=cy+Math.sin(a+k*.45)*r*.85;if(free(x,y))return [x,y];}return [cx,cy];}
/* a spot with open ground all round it (things whose 'behind' must be walkable) */
function openSpot(cx,cy,a,r,R){let best=null,bs=-1;for(const rr of [r,r*.85,r*1.15,r*.7]){for(let k=0;k<16;k++){const aa=a+k*T2/16,x=cx+Math.cos(aa)*rr,y=cy+Math.sin(aa)*rr*.85;if(!free(x,y))continue;
    let n=0;for(let i=0;i<12;i++){const d=i*T2/12;for(const q of [R*.35,R*.7,R])if(free(x+Math.cos(d)*q,y+Math.sin(d)*q))n++;}if(n===36)return [x,y];if(n>bs){bs=n;best=[x,y];}}}
  return best||[cx,cy];}
/* an add from the map's own monster list */
function add(e,re,x,y,o){const L=(window.VK_MONS||{})[e.mboss]||[],d=L.find(q=>re.test(q.name))||L[0];if(!d||typeof vkMake!=='function')return null;if(!free(x,y)){x=e.x;y=e.y;}
  const m=vkMake(d,x,y);if(!enemies.includes(m))enemies.push(m);m.summon=1;m.mbOf=e;m.aggro=8;if(o)Object.assign(m,o);return m;}
const skN=k=>{try{const s=SKILLS[k];return s?(s.name||k):k;}catch(err){return k;}};   /* SKILLS[k].th is a short effect tag, not a name */
function puff(x,y,col,n){for(let i=0;i<(n||14);i++){const a=Math.random()*T2,s=rnd(40,160);emit({type:'ember',x,y,z:rnd(10,60),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(30,120),drag:1.6,life:rnd(.5,.9),size:rnd(2.4,4),size1:1.2,color:col});}}
const turnTo=(b,a,dt,rate)=>{b.hd+=Math.max(-rate*dt,Math.min(rate*dt,angDiff(a,b.hd)));};
/* the blue shelter behind a cover, away from the boss (shortened where the ground behind is blocked) */
function shelter(e,q,life){const a=Math.atan2(q.y-e.y,q.x-e.x);let L=40;while(L<150&&free(q.x+Math.cos(a)*(q.r+L+10),q.y+Math.sin(a)*(q.r+L+10)))L+=10;
  return M.safe({k:'rect',x:q.x+Math.cos(a)*q.r*.6,y:q.y+Math.sin(a)*q.r*.6,phi:a,len:L,w:q.r*1.9,off:0},life);}
/* a tongue of flame (torches, braziers) */
function flameShape(x,y,s,col){ctx.save();ctx.translate(x,y);const w=Math.sin(gameTime*13+x)*.12;ctx.beginPath();ctx.moveTo(s*w,-s*1.9);ctx.bezierCurveTo(s*.95,-s*.9,s*1.05,s*.2,0,s*.55);ctx.bezierCurveTo(-s*1.05,s*.2,-s*.95,-s*.9,s*w,-s*1.9);
  ctx.fillStyle=col;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(40,20,40,.85)';ctx.stroke();
  ctx.beginPath();ctx.moveTo(s*w*.5,-s);ctx.bezierCurveTo(s*.45,-s*.5,s*.5,s*.1,0,s*.35);ctx.bezierCurveTo(-s*.5,s*.1,-s*.45,-s*.5,s*w*.5,-s);ctx.globalAlpha*=.85;ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();}

/* ================= Hecate ================= */
const HE={fire:3,fireR:70,mothCd:18,mothV:[60,110],roadR:520,sp:20,cross:30};
const ROADS=[['#b25cff','ม่วง'],['#dfe8f6','เงิน'],['#ffc83a','ทอง']];
function hounds(e){const b=e.mb;b.dogs=(b.dogs||[]).filter(m=>m&&!m.dead&&enemies.includes(m));
  while(b.dogs.length<2){const [x,y]=spot(e.x,e.y,Math.random()*T2,90);const m=add(e,/Cerberus/,x,y,{mbDog:1});if(!m)break;b.dogs.push(m);puff(x,y,'#8a5ad0',10);}}
function moonFire(e){const x=player.x,y=player.y;M.strike(e,{shape:{k:'circle',x,y,r:HE.fireR},T:.8,col:'purple',mul:1.2,magic:1,boomKind:'quiet',onFire(){flame(x,y,'#b070ff',12);}});}
function flame(x,y,col,n){for(let i=0;i<(n||10);i++){const a=Math.random()*T2,r=rnd(0,44);emit({type:'ember',x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.7,z:rnd(2,14),vx:rnd(-20,20),vy:rnd(-10,10),vz:rnd(80,190),drag:1.2,life:rnd(.5,.9),size:rnd(2.5,4.5),size1:.8,color:Math.random()<.65?col:'#ffffff'});}
  addFx(new GRing({x,y,r0:6,r1:62,w:7,color:col,life:.35}));}
function swipe(e){const phi=M.angTo(e,player);pose(e,.85);
  M.act(e,{T:1,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:190,phi,half:.55},T:.85,mul:1.1,dot:['mbBurn',3,.8],boomKind:'quiet',
    onFire(){hitPose(e);for(let i=0;i<14;i++){const r=rnd(30,180),a=phi+rnd(-.5,.5);emit({type:'ember',x:e.x+Math.cos(a)*r,y:e.y+Math.sin(a)*r,z:rnd(10,40),vx:Math.cos(a)*60,vy:Math.sin(a)*60,vz:rnd(40,100),drag:1.5,life:.6,size:3,size1:.8,color:Math.random()<.5?'#c890ff':'#ffffff'});}}});}});}
/* the key moth: a moving gold part, one hit breaks it */
function drawMoth(p,x,y,t){const z=40+5*Math.sin(t*4),fl=Math.abs(Math.sin(t*15)),by=y-z;G.shadow(x,y+2,12,.25);G.glow(x,by,36,'#b070ff',.42);
  ctx.save();ctx.translate(x,by);
  for(const s of [-1,1]){ctx.save();ctx.scale(s*(.3+.7*fl),1);G.poly([[2,-2],[19,-17],[28,-7],[23,4],[4,3]],'#7a3ac0','#ffc83a',2.2);G.poly([[2,2],[16,8],[14,18],[4,9]],'#5a2a9a','#ffc83a',1.8);
    G.ell(17,-7,3.6,3.6,'#ffe9a0');ctx.restore();}
  G.ell(0,0,3.8,9.5,'#3a2050','#140818',1.4);
  ctx.strokeStyle='#ffd23a';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(0,21);ctx.stroke();ctx.beginPath();ctx.arc(0,25,4,0,T2);ctx.stroke();ctx.fillStyle='#ffd23a';ctx.fillRect(0,13,5,2.2);ctx.fillRect(0,17,3.5,2.2);
  ctx.restore();}
function moths(e,n){const b=e.mb;for(let i=0;i<n;i++){const a=M.angTo(e,player)+(n>1?(i?.8:-.8):0),x=e.x+Math.cos(a)*44,y=e.y+Math.sin(a)*32,d=Math.hypot(player.x-x,player.y-y);
    M.part(e,{x,y,hp:1,r:14,h:58,name:'Key Moth',th:'ผีเสื้อกุญแจ',kind:'moth',fixed:0,ring:18,data:{t:0,v:Math.max(HE.mothV[0],Math.min(HE.mothV[1],d/3))},draw:drawMoth,
      onBreak(p){puff(p.x,p.y,'#c890ff',14);M.say(p,'ผีเสื้อแตก!','#e0c0ff',14);}});}
  if(!b.seenMoth){b.seenMoth=1;M.banner('ผีเสื้อกุญแจ! ตีมันก่อนถึงตัว ไม่งั้นสกิลถูกผนึก','gold',2.4);}
  M.hint(e,'ผีเสื้อกุญแจ ◎ — ตี 1 ทีก่อนถึงตัว (คอม T / มือถือ 🎯 สลับเป้า) · ไม่งั้นสกิลที่ใช้บ่อยสุดถูกผนึก 8 วิ');}
function mothLand(e,p){const k=M.mostUsed();puff(p.x,p.y,'#ffd23a',12);
  if(k){M.pc('seal',8,{key:k});M.banner('🗝 สกิล '+skN(k)+' ถูกผนึก 8 วิ','purple',2);M.fail(e,'ผีเสื้อกุญแจเกาะตัว');}
  else M.hit(e,.8,{magic:1});}
/* the crossroads */
const roadOf=(q,x,y)=>{const r=((Math.atan2(y-q.y,x-q.x)-q.a0)%T2+T2)%T2;return Math.floor((r+T2/6)/(T2/3))%3;};
function roadsProp(e,c,a0,order){return M.prop(e,{kind:'roads',x:c.x,y:c.y,layer:'ground',a0,ad:a0,order,grow:0,safe:-1,boomT:-1,fadeT:.5,
  update(q,dt){q.grow=Math.min(1,q.grow+dt*2.2);if(q.boomT>=0)q.boomT+=dt;q.ad+=angDiff(q.a0,q.ad)*Math.min(1,dt*7);},
  draw(q,x,y,t){const A=ctx.globalAlpha,R=HE.roadR*(1-Math.pow(1-q.grow,3));ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    const me=Math.hypot(player.x-q.x,player.y-q.y)<HE.roadR+20?roadOf({x:q.x,y:q.y,a0:q.ad},player.x,player.y):-1;
    for(let i=0;i<3;i++){const ai=q.ad+i*T2/3,col=ROADS[q.order[i]][0],wrong=q.boomT>=0&&i!==q.safe,ok=q.boomT>=0&&i===q.safe;
      let al=.2+.04*Math.sin(t*4+i*2)+(i===me&&q.boomT<0?.12:0);if(wrong)al=Math.max(.12,.7-q.boomT*1.1);if(ok)al=.34;
      ctx.globalAlpha=A*al;ctx.fillStyle=wrong&&q.boomT<.25?'#fff0e0':col;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,ai-T2/6,ai+T2/6);ctx.closePath();ctx.fill();
      ctx.globalAlpha=A*.95;ctx.lineWidth=9;ctx.strokeStyle=col;ctx.beginPath();ctx.arc(0,0,R,ai-T2/6+.03,ai+T2/6-.03);ctx.stroke();
      if(i===me&&q.boomT<0){ctx.lineWidth=3.5;ctx.strokeStyle='#ffffff';ctx.setLineDash([12,9]);ctx.lineDashOffset=t*40;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,ai-T2/6,ai+T2/6);ctx.closePath();ctx.stroke();ctx.setLineDash([]);}
      ctx.globalAlpha=A*.9;ctx.lineCap='round';ctx.lineWidth=13;ctx.strokeStyle='rgba(16,8,26,.6)';ctx.beginPath();ctx.moveTo(Math.cos(ai)*46,Math.sin(ai)*46);ctx.lineTo(Math.cos(ai)*R*.96,Math.sin(ai)*R*.96);ctx.stroke();
      ctx.lineWidth=6;ctx.strokeStyle=col;ctx.setLineDash([18,10]);ctx.lineDashOffset=-t*34;ctx.stroke();ctx.setLineDash([]);
      /* the crack between two roads */
      const bi=ai+T2/6;ctx.lineWidth=3.2;ctx.strokeStyle='rgba(230,210,255,.75)';ctx.beginPath();for(let k=0;k<=10;k++){const r=30+(R-30)*k/10,j=k%2?.05:-.05;const px=Math.cos(bi+j)*r,py=Math.sin(bi+j)*r;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
    ctx.restore();ctx.globalAlpha=A;
    /* a brazier of each road's colour at the far end */
    for(let i=0;i<3;i++){const ai=q.ad+i*T2/3,[bx,by]=P(q.x+Math.cos(ai)*R*.84,q.y+Math.sin(ai)*R*.84),col=ROADS[q.order[i]][0];
      G.shadow(bx,by+2,16,.3);G.poly([[bx-10,by],[bx-13,by-16],[bx+13,by-16],[bx+10,by]],'#4a3a5a','#140a1a',2);G.glow(bx,by-26,46,col,.5);flameShape(bx,by-22,10,col);
      if(q.boomT>=0&&i===q.safe)G.text(bx,by-50,'✓',22,'#bfe6ff');}}});}
function torch(e,ci,life){const [col,name]=ROADS[ci];return M.prop(e,{kind:'torch',x:e.x,y:e.y,layer:'top',life,fadeT:.3,update(q){q.x=e.x;q.y=e.y;},
  draw(q,x,y,t){const h=(MSPR_H(e)||100)+26,k=Math.min(1,q.t/.3),ty=y-h-20*k,pu=.85+.15*Math.sin(t*14);
    G.glow(x,ty-8,95*pu,col,.6);
    ctx.save();ctx.strokeStyle='#5a3a1a';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+5,ty+34);ctx.lineTo(x,ty+2);ctx.stroke();ctx.restore();
    flameShape(x,ty-4,18*pu,col);G.text(x,ty-44,'คบ'+name+'!',17,col);}});}
function roadFire(q,i){const ai=q.a0+i*T2/3,col=ROADS[q.order[i]][0];
  for(let k=0;k<26;k++){const r=rnd(40,HE.roadR*.95),a=ai+rnd(-.95,.95)*T2/6,x=q.x+Math.cos(a)*r,y=q.y+Math.sin(a)*r;
    emit({type:'ember',x,y,z:rnd(2,12),vx:rnd(-30,30),vy:rnd(-20,20),vz:rnd(120,260),drag:1.1,life:rnd(.6,1.1),size:rnd(3,5.5),size1:.8,color:Math.random()<.6?col:'#ffffff'});}
  for(const r of [130,260,390])addFx(new GRing({x:q.x+Math.cos(ai)*r,y:q.y+Math.sin(ai)*r,r0:10,r1:110,w:10,color:col,life:.45}));}
function crossroads(e){const b=e.mb,p3=b.phase>=3,c=b.home;M.cancel(e);
  const a0=Math.random()*T2,order=[0,1,2].sort(()=>Math.random()-.5);
  if(!b.seenX){b.seenX=1;M.banner('ทางสามแพร่ง! ไปยืนทางที่สีตรงกับคบเพลิงที่เธอชู','gold',3);}else M.banner(p3?'ทางสามแพร่ง ×2! ดูคบทุกครั้ง':'ทางสามแพร่ง!','gold',1.6);
  M.hint(e,'ทางสามแพร่ง — ยืนในทางที่สีตรงกับคบเพลิงที่เฮคาทีชู · อีกสองทางระเบิด');
  const st=[{at:1.1,boom:3.6,rot:0}];if(p3)st.push({at:4.1,boom:6.2,rot:T2/6});
  M.act(e,{name:'🔥 ทางสามแพร่ง',T:st[st.length-1].boom+.45,unstop:1,cross:1,
    start(e,a){e.atk=0;a.i=0;puff(e.x,e.y,'#8a5ad0',18);e.hidden=1;a.rd=roadsProp(e,c,a0,order);},
    step(e,a){e.atk=0;if(e.hidden&&a.t>.35){e.hidden=0;e.x=c.x;e.y=c.y;puff(e.x,e.y,'#b070ff',18);}
      const s=st[a.i];if(!s)return;
      if(!s.raised&&a.t>=s.at){s.raised=1;if(s.rot){a.rd.a0+=s.rot;a.rd.boomT=-1;a.rd.safe=-1;}s.col=a.col=Math.floor(Math.random()*3);
        a.torch=torch(e,s.col,s.boom-s.at+.15);a.name='🔥 ชูคบ'+ROADS[s.col][1]+' — ยืนทางสี'+ROADS[s.col][1];M.say(e,'คบ'+ROADS[s.col][1]+'!',ROADS[s.col][0],20);}
      if(s.raised&&!s.done&&a.t>=s.boom){s.done=1;a.i++;boom(e,a,s,a.i>=st.length);}},
    end(e,a){if(a.rd)a.rd.dead=1;if(a.ok)M.window(e,4,'เฮคาทีเสียสมดุล!');
      M.hint(e,'เดินไม่หยุด (ไฟจันทร์ใต้เท้า) · ผีเสื้อกุญแจ ◎ ตีก่อนถึงตัว · ทางสามแพร่ง = ยืนทางสีเดียวกับคบ');},
    cancel(e,a){e.hidden=0;if(a.rd)a.rd.dead=1;if(a.torch)a.torch.dead=1;}});}
function boom(e,a,s,last){const q=a.rd,safeI=q.order.indexOf(s.col);q.safe=safeI;q.boomT=0;if(a.torch)a.torch.dead=1;
  for(let i=0;i<3;i++)if(i!==safeI)roadFire(q,i);if(typeof shake==='function')shake(4);
  const d=Math.hypot(player.x-q.x,player.y-q.y);a.ok=0;
  if(player.hp<=0||d>HE.roadR+20)return;
  if(roadOf(q,player.x,player.y)===safeI){if(last)a.ok=1;M.say(player,'ปลอดภัย!','#bfe6ff',15);}
  else{if(M.hit(e,2.2,{magic:1})){const sp=Math.min(player.mp,HE.sp);player.mp-=sp;addFx(new DText({x:player.x,y:player.y,z:96,text:'−'+sp+' SP',color:'#9fc8ff',size:15,life:1}));}M.fail(e,'ยืนผิดทางสามแพร่ง');}}
M.def('hecate',{R:560,see:330,spd:58,reach:170,hpMul:1.25,enrage:300,minH:100,
  cry:'ทางแยกนี้…เป็นของข้า',intro:'เฮคาที — ทางสามแพร่ง: ยืนทางที่สีตรงกับคบเพลิงที่เธอชู · ตีผีเสื้อกุญแจ ◎ ก่อนถึงตัว',
  cd0:{swipe:2,moth:8,cross:12},phases:[.66,.33],
  setup(e,b){b.fireT=2.5;b.dogT=0;b.dogs=[];M.hint(e,'เดินไม่หยุด (ไฟจันทร์ใต้เท้า) · ผีเสื้อกุญแจ ◎ ตีก่อนถึงตัว · ทางสามแพร่ง = ยืนทางสีเดียวกับคบ');},
  wake(e){hounds(e);},
  phase(e,ph){M.cd(e,'cross',HE.cross);if(ph>=3)M.banner('ทางสามแพร่งซ้อนสองรอบ! ผีเสื้อมาเป็นคู่','red',2.4);crossroads(e);},
  tick(e,dt){const b=e.mb;
    b.fireT-=dt;if(b.fireT<=0&&!(b.act&&b.act.cross)){b.fireT=HE.fire;moonFire(e);}
    const dogs=(b.dogs||[]).filter(m=>m&&!m.dead&&enemies.includes(m));if(dogs.length<2){b.dogT+=dt;if(b.dogT>=20){b.dogT=0;hounds(e);}}else b.dogT=0;
    for(const p of M.parts(e,'moth')){p.data.t+=dt;const dx=player.x-p.x,dy=player.y-p.y,d=Math.hypot(dx,dy);
      if(d<36&&player.hp>0){p.gone=1;p.dead=true;mothLand(e,p);continue;}   /* enemies are kept ~26 px off the hero by the game's spacing */if(p.data.t>9){p.gone=1;p.dead=true;puff(p.x,p.y,'#c890ff',8);continue;}
      const st=Math.min(d,p.data.v*dt);p.x+=dx/d*st;p.y+=dy/d*st;}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'cross')){M.cd(e,'cross',HE.cross);crossroads(e);return true;}
    if(M.ready(e,'moth')){M.cd(e,'moth',HE.mothCd);moths(e,b.phase>=3?2:1);}
    if(M.ready(e,'swipe')&&L<200){M.cd(e,'swipe',4);swipe(e);return true;}
    return false;}});

/* ================= Trojan Colossus ================= */
const TR={rx:330,ry:250,v:130,side:46,fb:52,wheelHp:35,topple:8,repair:15,doorCd:25,doorOpen:7,rainCd:6,chCd:10,chL:500,chW:110,carpHp:12,carpV:110};
const WL=['LF','LB','RF','RB'],SPD=[1,.85,.7,.55,.4];
function wslot(e,k){const b=e.mb,hd=b.hd,ss=k[0]==='L'?-1:1,ff=k[1]==='F'?1:-1,c=Math.cos(hd),n=Math.sin(hd);return [e.x+c*TR.fb*ff-n*TR.side*ss,e.y+n*TR.fb*ff+c*TR.side*ss];}
const broken=e=>WL.filter(k=>!e.mb.wh[k]).length;
function drawWheel(p,x,y,t){const e=p.mbOf,b=e&&e.mb;if(!b)return;const hd=b.hd,ry=21,rx=Math.max(5,ry*Math.abs(Math.cos(hd))),cy=y-ry+3,rot=(b.roll||0)/ry;
  G.shadow(x,y+2,18,.3);ctx.save();ctx.translate(x,cy);ctx.scale(rx/ry,1);
  ctx.lineWidth=7;ctx.strokeStyle='#2a1608';ctx.beginPath();ctx.arc(0,0,ry,0,T2);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#a8703a';ctx.stroke();
  ctx.strokeStyle='#6a4018';ctx.lineWidth=3;for(let i=0;i<6;i++){const a=rot+i*Math.PI/3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*ry*.88,Math.sin(a)*ry*.88);ctx.stroke();}
  G.ell(0,0,5.5,5.5,'#d8a840','#2a1608',1.8);ctx.restore();
  if(p.hp<p.maxHp*.6){ctx.strokeStyle='#1a0c04';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-rx*.5,cy-12);ctx.lineTo(x,cy-2);ctx.lineTo(x-rx*.3,cy+10);ctx.stroke();}}
function mkWheel(e,k){const b=e.mb,[x,y]=wslot(e,k);
  const p=M.part(e,{x,y,hp:Math.round(lv(e)*TR.wheelHp),r:20,h:46,name:'Cart Wheel',th:'ล้อรถศึก',kind:'wheel',fixed:0,ring:24,data:{k},draw:drawWheel,onBreak(p){wheelBroke(e,p);}});
  b.wh[k]=p;return p;}
function splinters(x,y){for(let i=0;i<16;i++)emit({type:'ember',x:x+rnd(-8,8),y:y+rnd(-6,6),z:rnd(10,40),vx:rnd(-170,170),vy:rnd(-110,110),vz:rnd(90,240),drag:1.4,grav:520,life:rnd(.5,.9),size:rnd(2.2,3.6),size1:.8,color:Math.random()<.6?'#a8703a':'#5a3414'});
  addFx(new GRing({x,y,r0:6,r1:64,w:8,color:'#e0b070',life:.35}));}
function wheelBroke(e,p){const b=e.mb,k=p.data.k,s=k[0];if(b.wh[k]===p)b.wh[k]=null;splinters(p.x,p.y);M.say(p,'ล้อแตก!','#ffe08a',16);if(typeof shake==='function')shake(2);
  if(!b.topple&&!b.wh[s+'F']&&!b.wh[s+'B']){topple(e,s);return;}
  M.hint(e,'ล้อแตก — ทุบอีกล้อข้างเดียวกันให้ล้ม · ล้อแตกคนละข้าง = แค่ช้าลง');}
function topple(e,s){const b=e.mb,ss=s==='L'?-1:1,vx=-Math.sin(b.hd)*ss;b.topple={s,dir:Math.abs(vx)<.25?(Math.cos(b.hd)>=0?1:-1)*ss:(vx>0?1:-1)};
  M.say(e,'ล้มตะแคง!','#ffe08a',22);M.window(e,TR.topple,'รถล้มตะแคง! ประตูท้องเปิด');dustPuff(e.x,e.y,20,'#c8a878',150,18);if(typeof shake==='function')shake(5);splinters(e.x,e.y);}
/* the carpenters: moving gold parts that walk to the cart and fix every broken wheel in 15 s of work */
const carpLook=()=>({vdef:{name:'Bronze Hoplite'},boss:false,face:1,atk:0,st:{},bob:Math.random()*6,m:{name:'Bronze Hoplite'},dead:false,deadT:0,z:0,flash:0,_mv:1});
function drawCarp(p,x,y,t,al){const L=p.data.lk;L.x=p.x;L.y=p.y;L.face=p.data.f||1;L._mv=p.data.mv?1:0;L.atk=p.data.at&&(t*2.2%1)<.5?.4:0;L.flash=p.flash||0;try{MSPR_DRAW(L,x,y,al,0,L.flash);}catch(err){}
  const h=(MSPR_H(L)||52)+12,sw=p.data.at?Math.sin(t*12)*.8:0;ctx.save();ctx.translate(x,y-h);G.ell(0,4,15,15,'rgba(40,24,8,.75)','#ffc83a',2);ctx.rotate(-.6+sw);
  ctx.fillStyle='#8a5a2a';ctx.fillRect(-2,-4,4,16);ctx.fillStyle='#b8bec8';ctx.strokeStyle='#2a2a30';ctx.lineWidth=1.6;ctx.fillRect(-8,-10,16,8);ctx.strokeRect(-8,-10,16,8);ctx.restore();}
function carpenters(e){const b=e.mb,slots=WL.filter(k=>!b.wh[k]&&!b.perm[k]);if(!slots.length)return;b.rep={t:0,T:TR.repair,slots};
  const base=M.angTo(b.home,e);for(let i=0;i<2;i++){const [x,y]=spot(b.home.x,b.home.y,base+(i?1.3:-1.3),b.R*.82);
    M.part(e,{x,y,hp:Math.round(lv(e)*TR.carpHp),r:16,h:52,name:'Carpenter',th:'ช่างไม้',kind:'carp',fixed:0,ring:20,mark:0,data:{slot:slots[i%slots.length],lk:carpLook(),f:1},draw:drawCarp,
      onBreak(p){puff(p.x,p.y,'#c8a060',10);M.say(p,'ช่างไม้ล้ม!','#ffe08a',14);}});}
  M.banner('ช่างไม้วิ่งมาซ่อมล้อ! ฆ่าก่อนซ่อมเสร็จ ล้อจะไม่กลับมา','gold',2.4);
  M.hint(e,'ช่างไม้ 🔨 ◎ ซ่อมล้อ 15 วิ — ฆ่าให้หมดก่อน ล้อที่แตกจะแตกถาวร');}
function carpTick(e,dt){const b=e.mb,R=b.rep;if(!R)return;const C=M.parts(e,'carp');
  if(!C.length){b.rep=null;for(const k of R.slots)if(!b.wh[k])b.perm[k]=1;M.banner('ช่างไม้ล้มหมด! ล้อที่แตกไม่กลับมาแล้ว','gold',2.2);
    M.hint(e,'ล้อแตกถาวร — ทุบล้อที่เหลือข้างเดียวกันให้ครบ รถจะล้มอีก');return;}
  let work=0;for(const p of C){const [sx,sy]=wslot(e,p.data.slot),dx=sx-p.x,dy=sy-p.y,d=Math.hypot(dx,dy);if(Math.abs(dx)>2)p.data.f=dx>=0?1:-1;
    if(d<30){p.x=sx;p.y=sy;p.data.at=1;p.data.mv=0;work=1;if((p.data.sp=(p.data.sp||0)-dt)<=0){p.data.sp=.45;emit({type:'spark',x:sx,y:sy,z:18,vx:rnd(-120,120),vy:rnd(-60,60),vz:rnd(60,160),drag:2,life:.35,size:1.6,color:'#ffd080',len:.03});}}
    else{p.data.at=0;p.data.mv=1;const st=Math.min(d,TR.carpV*dt);p.x+=dx/d*st;p.y+=dy/d*st;}}
  if(work)R.t+=dt;
  if(R.t>=R.T){for(const k of R.slots)if(!b.wh[k]&&!b.perm[k])mkWheel(e,k);for(const p of C){p.gone=1;p.dead=true;}b.rep=null;
    M.say(e,'ซ่อมเสร็จ!','#ffd0a0',19);M.banner('ซ่อมล้อเสร็จ! ล้อกลับมาครบ','red',1.8);M.fail(e,'ปล่อยให้ช่างไม้ซ่อมล้อ');
    M.hint(e,'ทุบล้อทอง ◎ ข้างเดียวกันให้แตก 2 ล้อ → รถล้มตะแคง');}}
/* the war cart (stand-in for the wooden horse): a plank box on four wheels with a horse head, the colossus rides on it */
function drawCart(e,t){const b=e.mb,hd=b.hd,c=Math.cos(hd),n=Math.sin(hd),L=64,W=40,z0=12,z1=28,open=b.topple||b.doorT>0;
  const at=(u,v,z)=>P(e.x+c*u-n*v,e.y+n*u+c*v,z);const [cx,cy]=P(e.x,e.y);
  ctx.save();const tl=(e.mbTilt||0)*.4;if(tl){ctx.translate(cx,cy);ctx.rotate(tl);ctx.translate(-cx,-cy);}
  G.shadow(cx,cy+4,80,.32);
  const faces=[[[L,-W],[L,W],[c,n]],[[-L,W],[-L,-W],[-c,-n]],[[-L,W],[L,W],[-n,c]],[[L,-W],[-L,-W],[n,-c]]];let doorF=null;
  for(const [A,B,N] of faces){if(N[1]<=.02)continue;const p1=at(A[0],A[1],z0),p2=at(B[0],B[1],z0),p3=at(B[0],B[1],z1),p4=at(A[0],A[1],z1);
    G.poly([p1,p2,p3,p4],N[1]>.6?'#7a4a22':'#6a3e1a','#2a1608',2.4);const m1=at(A[0],A[1],(z0+z1)/2),m2=at(B[0],B[1],(z0+z1)/2);ctx.strokeStyle='rgba(40,20,8,.55)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(m1[0],m1[1]);ctx.lineTo(m2[0],m2[1]);ctx.stroke();
    if(Math.abs(A[1])===W&&Math.abs(B[1])===W)doorF={v:A[1],N};}
  if(doorF){const v=doorF.v,d1=at(-15,v,z0+1),d2=at(15,v,z0+1),d3=at(15,v,z1-2),d4=at(-15,v,z1-2);
    if(open){G.poly([d1,d2,d3,d4],'#140a04','#2a1608',2);const o=v>0?1:-1,r1=at(-15,v+o*30,0),r2=at(15,v+o*30,0);G.poly([d1,d2,r2,r1],'#9a6a34','#2a1608',2);G.glow((d1[0]+d2[0])/2,(d1[1]+d3[1])/2,26,'#ffb040',.3);}
    else{G.poly([d1,d2,d3,d4],'#5a3414','#2a1608',2);const [rx,ry]=at(8,v,(z0+z1)/2);G.ell(rx,ry,2.6,2.6,null,'#d8a840',1.6);}}
  const top=[at(L,-W,z1),at(L,W,z1),at(-L,W,z1),at(-L,-W,z1)];G.poly(top,'#b07a42','#2a1608',2.4);
  ctx.strokeStyle='rgba(70,38,14,.55)';ctx.lineWidth=1.4;for(let v=-W+16;v<W;v+=16){const a1=at(-L+4,v,z1),a2=at(L-4,v,z1);ctx.beginPath();ctx.moveTo(a1[0],a1[1]);ctx.lineTo(a2[0],a2[1]);ctx.stroke();}
  for(const [u,v] of [[L,-W],[L,W],[-L,W],[-L,-W]]){const [px,py]=at(u,v,z1);G.ell(px,py,3.2,2.4,'#d8a840','#2a1608',1.2);}
  /* the horse head at the front of the cart */
  const [hx,hy]=at(L-8,0,z1),f=c>=0?1:-1;ctx.save();ctx.translate(hx,hy);ctx.scale(f,1);
  G.poly([[-8,0],[-6,-40],[2,-58],[22,-56],[30,-46],[20,-40],[8,-36],[8,0]],'#a8703a','#2a1608',2.4);
  ctx.strokeStyle='#5a3414';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-9,-8);ctx.lineTo(-11,-46);ctx.lineTo(-2,-60);ctx.stroke();
  G.ell(14,-50,2.6,2.6,'#1a0c04');ctx.restore();
  ctx.restore();}
function cartProp(e){return M.prop(e,{kind:'cart',x:e.x,y:e.y,layer:'sorted',sortOff:-6,
  update(q,dt){q.x=e.x;q.y=e.y;const b=e.mb;if(!b)return;const tg=b.topple?b.topple.dir*.95:0,cur=e.mbTilt||0;e.mbTilt=cur+Math.max(-dt*3.5,Math.min(dt*3.5,tg-cur));if(Math.abs(e.mbTilt)<.002)e.mbTilt=0;},
  draw(q,x,y,t){if(e.dead||!e.mb)return;drawCart(e,t);const R=e.mb.rep;
    if(R){const w=90,bx=x-w/2,by=y-(MSPR_H(e)||110)-62;ctx.fillStyle='rgba(20,10,4,.82)';ctx.fillRect(bx-1,by-1,w+2,8);ctx.fillStyle='#ffb040';ctx.fillRect(bx,by,w*Math.min(1,R.t/R.T),6);G.text(x,by-4,'🔨 ซ่อมล้อ '+Math.floor(R.t)+'/'+R.T+' วิ',11,'#ffd8a0');}}});}
function trackProp(e){const b=e.mb;return M.prop(e,{kind:'track',x:b.home.x,y:b.home.y,layer:'ground',draw(q,x,y,t){const A=ctx.globalAlpha;ctx.save();ctx.translate(x,y);ctx.scale(1,K);
  for(const d of [-TR.side,TR.side]){ctx.globalAlpha=A*.42;ctx.lineWidth=7;ctx.strokeStyle='rgba(60,38,20,.8)';ctx.setLineDash([26,10]);ctx.beginPath();ctx.ellipse(0,0,TR.rx+d,TR.ry+d,0,0,T2);ctx.stroke();}
  ctx.setLineDash([]);ctx.restore();ctx.globalAlpha=A;}});}
function orbit(e,dt){const b=e.mb,h=b.home,v=TR.v*SPD[broken(e)]*(b.jump>0?.3:1)*(b.enr?1.12:1);
  const th=Math.atan2((e.y-h.y)/TR.ry,(e.x-h.x)/TR.rx),tt=th+b.dir*.35,tx=h.x+Math.cos(tt)*TR.rx,ty=h.y+Math.sin(tt)*TR.ry,dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);
  if(d>1){const st=Math.min(d,v*dt);e.x+=dx/d*st;e.y+=dy/d*st;turnTo(b,Math.atan2(dy,dx),dt,2.4);b.roll+=st;}
  e.face=Math.cos(b.hd)>=0?1:-1;}
function charge(e){const b=e.mb;let phi=M.angTo(e,player);pose(e,1.4);M.say(e,'ชน!','#ffb080',18);
  const s={k:'rect',x:e.x,y:e.y,phi,len:TR.chL,w:TR.chW,off:0};
  M.act(e,{name:'🐎 ชนพุ่ง',T:1.4+.4+2,unstop:1,
    start(e,a){M.strike(e,{shape:s,T:1.4,noHit:1,boomKind:'quiet',track(w){if(w.t<.55){phi=M.angTo(e,player);s.phi=phi;s.x=e.x;s.y=e.y;}},
      onFire(){hitPose(e);let L=0;while(L<TR.chL-20&&free(s.x+Math.cos(s.phi)*(L+30),s.y+Math.sin(s.phi)*(L+30)))L+=20;Object.assign(a,{go:1,x0:s.x,y0:s.y,L,phi:s.phi,t0:a.t,td:Math.random()<.5?1:-1});}});},
    step(e,a,dt){if(!a.go){turnTo(b,M.angTo(e,player),dt,3);e.face=Math.cos(b.hd)>=0?1:-1;return;}
      const k=Math.min(1,(a.t-a.t0)/.35),c=Math.cos(a.phi),n=Math.sin(a.phi);e.x=a.x0+c*a.L*k;e.y=a.y0+n*a.L*k;
      if(k<1){b.hd=a.phi;b.roll+=TR.chL/.35*dt;if(Math.random()<.5)dustPuff(e.x,e.y,2,'#c8a878',60,10);
        if(!a.hit&&player.hp>0){const dx=player.x-a.x0,dy=player.y-a.y0,u=dx*c+dy*n,v=Math.abs(-dx*n+dy*c);if(u>-30&&u<=a.L*k+50&&v<=TR.chW/2+12){a.hit=1;M.hit(e,2.2,{push:150,cc:['air',.6]});}}}
      else{if(!a.dust){a.dust=1;dustPuff(e.x,e.y,16,'#c8a878',130,16);if(typeof shake==='function')shake(3);}b.hd+=dt*Math.PI/2*a.td;b.roll+=dt*30;}
      e.face=Math.cos(b.hd)>=0?1:-1;}});}
/* arrows: a volley rises from the cart, five circles fall round the hero */
class Volley{constructor(o){Object.assign(this,{t:0,layer:'top'},o);this.ar=[];for(let i=0;i<10;i++)this.ar.push([rnd(-30,30),rnd(-14,14),rnd(0,.25)]);}update(dt){this.t+=dt;return this.t<.8;}
  draw(){const e=this.e;ctx.save();ctx.strokeStyle=this.fire?'#ff8a3a':'#3a2410';ctx.lineWidth=2.2;for(const [dx,dy,d] of this.ar){const k=(this.t-d)/.5;if(k<0||k>1)continue;const [x,y]=P(e.x+dx,e.y+dy,40+k*260);ctx.globalAlpha=1-k;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*.06,y-16);ctx.stroke();}ctx.restore();}}
function arrowsAt(e,x,y,fire){M.prop(e,{kind:'arrows',x,y,layer:'sorted',life:1.6,fadeT:.4,sh:[0,1,2,3,4,5].map(()=>[rnd(-34,34),rnd(-20,20),rnd(-.5,.5)]),
  draw(q,x,y){for(const [dx,dy,a] of q.sh){const px=x+dx,py=y+dy*K;ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.strokeStyle='#4a2a10';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-16);ctx.stroke();
    ctx.fillStyle=fire?'#ff8a3a':'#e8e0d0';ctx.beginPath();ctx.moveTo(-3,-14);ctx.lineTo(0,-19);ctx.lineTo(3,-14);ctx.fill();ctx.restore();}}});
  dustPuff(x,y,5,'#c8a878',70,10);}
function firePatch(e,x,y){M.prop(e,{kind:'fire',x,y,r:52,layer:'ground',life:5,fadeT:.5,tk:0,update(q,dt){q.tk-=dt;if(q.tk<=0&&Math.hypot(player.x-q.x,player.y-q.y)<q.r){q.tk=1;M.dot('mbBurn',3,lv(e)*.8);}},
  draw(q,x,y,t){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,4,0,0,q.r);g.addColorStop(0,'rgba(255,190,80,.6)');g.addColorStop(.6,'rgba(230,90,30,.35)');g.addColorStop(1,'rgba(120,30,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,q.r,0,T2);ctx.fill();ctx.restore();
    if(Math.random()<.25)emit({type:'ember',x:q.x+rnd(-36,36),y:q.y+rnd(-22,22),z:2,vz:rnd(40,90),drag:1,life:.7,size:2.4,size1:.4,color:'#ffb040'});}});}
function rain(e){const b=e.mb,fire=b.phase>=2,x0=player.x,y0=player.y,a0=Math.random()*T2,pts=[[x0,y0]];
  for(let i=0;i<4;i++){const a=a0+i*T2/4+rnd(-.25,.25);pts.push([x0+Math.cos(a)*105,y0+Math.sin(a)*105*.85]);}
  const v=addFx(new Volley({e}));v.fire=fire;
  for(const [x,y] of pts)M.strike(e,{shape:{k:'circle',x,y,r:56},T:1,mul:.9,dot:fire?['mbBurn',3,.8]:null,boomKind:'quiet',onFire(){arrowsAt(e,x,y,fire);if(fire)firePatch(e,x,y);}});}
function door(e){const b=e.mb;b.doorT=TR.doorOpen;b.jump=1.2;b.spawnT=.55;b.defN=0;M.defNow(e);M.say(e,'ประตูท้องเปิด!','#ffd0a0',19);
  if(!b.seenDoor){b.seenDoor=1;M.banner('ประตูท้องเปิด! ตอนนี้ตีตัวรถไม่สน DEF','gold',2.2);}}
M.def('trojan',{R:600,see:360,spd:0,reach:0,hpMul:1.25,enrage:300,minH:110,
  cry:'(ไม้ลั่นเอี๊ยด… ล้อหมุน)',intro:'ยักษ์ทรอยบนรถศึก — ทุบล้อทอง ◎ ข้างเดียวกันให้แตก 2 ล้อ รถจะล้มตะแคง',
  cd0:{charge:6,rain:3,door:12},phases:[.5],
  setup(e,b){Object.assign(b,{hd:Math.PI/2,dir:1,roll:0,wh:{},perm:{},rep:null,doorT:0,jump:0,spawnT:0,topple:null});e.mbLift=22;e.mbTilt=0;
    trackProp(e);cartProp(e);for(const k of WL)mkWheel(e,k);
    M.hint(e,'ทุบล้อทอง ◎ ข้างเดียวกันให้แตก 2 ล้อ → รถล้มตะแคง 8 วิ · หลบเส้นชน');},
  idle(e){for(const k of WL){const p=e.mb.wh[k];if(p&&!p.dead){const [x,y]=wslot(e,k);p.x=x;p.y=y;}}},
  phase(e){M.banner('ธนูไฟ! ฝนธนูทิ้งไฟไว้บนพื้น','red',2);},
  tick(e,dt){const b=e.mb;
    if(b.doorT>0){b.doorT-=dt;if(b.doorT<=0){b.doorT=0;b.defN=null;M.defNow(e);}}
    if(b.jump>0)b.jump-=dt;
    if(b.spawnT>0){b.spawnT-=dt;if(b.spawnT<=0){const n=enemies.filter(o=>o.mbOf===e&&o.mbHop&&!o.dead).length;for(let i=0;i<Math.min(3,6-n);i++){const [x,y]=spot(e.x,e.y,b.hd+Math.PI/2+i*.7,80);const m=add(e,/Hoplite/,x,y,{mbHop:1});if(m)puff(x,y,'#d8a868',8);}}}
    for(const k of WL){const p=b.wh[k];if(p&&!p.dead){const [x,y]=wslot(e,k);p.x=x;p.y=y;}}
    carpTick(e,dt);},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'door')){M.cd(e,'door',TR.doorCd);door(e);}
    if(M.ready(e,'rain')&&L<560){M.cd(e,'rain',TR.rainCd);rain(e);}
    if(M.ready(e,'charge')&&L>110&&L<480&&broken(e)<4){M.cd(e,'charge',TR.chCd);charge(e);return true;}
    orbit(e,dt);return true;},
  winEnd(e){const b=e.mb;if(b.topple){b.topple=null;M.say(e,'ลุกขึ้น!','#ffb080',18);carpenters(e);}},
  reset(e){e.mbTilt=0;},dead(e){e.mbTilt=0;}});

/* ================= Polyphemus ================= */
const PO={sweepR:160,sweepHalf:1.22,stompR:160,rockR:90,beamR:700,beamHalf:.52,beamT:4,jarHp:8,poolR:90,poolT:15,drunk:7,hideR:50,rock:36};
function drawRock(q,x,y){const s=q.r/36;G.shadow(x,y+3,q.r*1.15,.32);
  G.poly([[x-34*s,y],[x-38*s,y-22*s],[x-22*s,y-44*s],[x+4*s,y-50*s],[x+30*s,y-36*s],[x+38*s,y-12*s],[x+32*s,y]],'#8a8478','#2e2a24',3);
  G.poly([[x-22*s,y-44*s],[x+4*s,y-50*s],[x-2*s,y-28*s],[x-24*s,y-24*s]],'#aaa496');G.poly([[x+4*s,y-50*s],[x+30*s,y-36*s],[x+12*s,y-26*s],[x-2*s,y-28*s]],'#9a9488');
  ctx.strokeStyle='rgba(40,36,30,.6)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-10*s,y-30*s);ctx.lineTo(x-4*s,y-12*s);ctx.stroke();}
function bigRocks(e){const b=e.mb,got=[];for(let i=0;i<4;i++){let [x,y]=openSpot(b.home.x,b.home.y,i*T2/4+.4,250,150);if(got.some(g=>Math.hypot(g[0]-x,g[1]-y)<150))[x,y]=spot(b.home.x,b.home.y,i*T2/4+.4,250);got.push([x,y]);
  M.prop(e,{kind:'rock',x,y,r:PO.rock,solid:1,cover:1,layer:'sorted',draw:drawRock});}}
function tempRock(e,x,y){M.prop(e,{kind:'rock2',x,y,r:30,solid:1,cover:1,layer:'sorted',life:20,fadeT:.6,draw:drawRock});}
/* sheep: wander, can't be hurt, the hero hides in their wool */
function drawSheep(q,x,y,t){const e=q.e,b=e&&e.mb;if(q.fly){const k=Math.min(1,q.fly.t/q.fly.T),z=Math.sin(Math.PI*k)*150;y-=z;}
  const bob=q.mv?Math.abs(Math.sin(t*9+q.ph))*2.5:0,f=q.face||1;G.shadow(x,y+2+(q.fly?Math.sin(Math.PI*Math.min(1,q.fly.t/q.fly.T))*150:0),20,.25);
  if(b&&b.search&&!q.fly){ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha*=.3;ctx.fillStyle='#2f9bff';ctx.beginPath();ctx.arc(0,0,PO.hideR,0,T2);ctx.fill();ctx.globalAlpha/=.3;ctx.lineWidth=3;ctx.strokeStyle='#cfeeff';ctx.setLineDash([8,6]);ctx.lineDashOffset=-t*30;ctx.beginPath();ctx.arc(0,0,PO.hideR,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
  ctx.save();ctx.translate(x,y-bob);ctx.scale(f,1);if(q.fly)ctx.rotate(q.fly.t*9);
  ctx.strokeStyle='#2a2420';ctx.lineWidth=3;const lg=q.mv?Math.sin(t*12+q.ph)*4:0;for(const lx of [-10,-4,6,12]){ctx.beginPath();ctx.moveTo(lx,-8);ctx.lineTo(lx+(lx%4?lg:-lg),0);ctx.stroke();}
  for(const [dx,dy,r] of [[-12,-16,9],[-3,-21,10],[7,-18,9],[-6,-11,9],[5,-11,9],[13,-13,7]])G.ell(dx,dy,r,r*.9,'#f6f1e4','#5a5248',2);
  G.ell(17,-17,6.5,7.5,'#3a3230','#1a1410',1.6);G.ell(13,-22,3,2,'#3a3230');G.ell(19.5,-18.5,1.4,1.4,'#ffffff');if(q.daze>0)G.text(0,-34,'💫',12,'#fff');
  ctx.restore();}
function flock(e){const b=e.mb;for(let i=0;i<6;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/6+.25,rnd(110,260));
  M.prop(e,{kind:'sheep',x,y,r:18,layer:'sorted',tx:x,ty:y,wt:rnd(0,2),face:1,ph:Math.random()*9,mv:0,daze:0,fly:null,
    update(q,dt){const b=e.mb;if(!b)return;if(q.fly){q.fly.t+=dt;const k=Math.min(1,q.fly.t/q.fly.T);q.x=q.fly.x0+(q.fly.x1-q.fly.x0)*k;q.y=q.fly.y0+(q.fly.y1-q.fly.y0)*k;if(k>=1){q.fly=null;q.daze=2;puff(q.x,q.y,'#ffffff',16);}return;}
      if(q.daze>0){q.daze-=dt;q.mv=0;return;}q.wt-=dt;const far=b.phase>=2;
      if(q.wt<=0){q.wt=rnd(2.5,5);const a=far?Math.atan2(q.y-b.home.y,q.x-b.home.x)+rnd(-.5,.5):Math.random()*T2,r=far?b.R*rnd(.82,.95):rnd(70,b.R*.62),x=b.home.x+Math.cos(a)*r,y=b.home.y+Math.sin(a)*r*.85;if(free(x,y)){q.tx=x;q.ty=y;}}
      const dx=q.tx-q.x,dy=q.ty-q.y,d=Math.hypot(dx,dy),v=far?58:26;if(d>3){const st=Math.min(d,v*dt),nx=q.x+dx/d*st,ny=q.y+dy/d*st;if(free(nx,ny)){q.x=nx;q.y=ny;}else q.wt=0;if(Math.abs(dx)>1)q.face=dx>=0?1:-1;q.mv=1;}else q.mv=0;},
    draw:drawSheep});}}
const hiddenFrom=e=>{const covers=M.props(e,'rock').concat(M.props(e,'rock2'));if(M.covered({x:e.x,y:e.y,list:covers},player.x,player.y))return 'rock';
  for(const s of M.props(e,'sheep'))if(!s.fly&&Math.hypot(s.x-player.x,s.y-player.y)<PO.hideR)return 'sheep';return false;};
/* wine jars (gold) → pools */
function drawAmph(p,x,y,t){G.shadow(x,y+2,18,.3);G.poly([[x-7,y],[x-15,y-14],[x-13,y-30],[x-6,y-38],[x-5,y-46],[x+5,y-46],[x+6,y-38],[x+13,y-30],[x+15,y-14],[x+7,y]],'#c8602a','#3a1a08',2.4);
  ctx.fillStyle='#1a0c06';ctx.fillRect(x-13,y-26,26,7);ctx.fillStyle='#e8a060';ctx.fillRect(x-11,y-24,4,3);ctx.fillRect(x-3,y-24,4,3);ctx.fillRect(x+5,y-24,4,3);
  ctx.strokeStyle='#3a1a08';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x-10,y-37,5,Math.PI*.5,Math.PI*1.5);ctx.stroke();ctx.beginPath();ctx.arc(x+10,y-37,5,-Math.PI*.5,Math.PI*.5);ctx.stroke();
  G.ell(x,y-47,6,2.4,'#7a1a4a','#3a1a08',1.4);}
function jarSet(e){const b=e.mb;b.jarT=null;for(let i=0;i<3;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/3+Math.random()*1.2,rnd(180,290));
  M.part(e,{x,y,hp:Math.round(lv(e)*PO.jarHp),r:18,h:52,name:'Wine Jar',th:'ไหไวน์',kind:'jar',draw:drawAmph,onBreak(p){pool(e,p.x,p.y);}});}}
function pool(e,x,y){for(let i=0;i<18;i++)emit({type:'ember',x,y,z:rnd(10,40),vx:rnd(-150,150),vy:rnd(-100,100),vz:rnd(60,200),drag:1.4,grav:500,life:rnd(.5,.9),size:rnd(2.4,4),size1:.8,color:Math.random()<.6?'#9a1a5a':'#c8602a'});
  M.prop(e,{kind:'wine',x,y,r:PO.poolR,layer:'ground',life:PO.poolT,fadeT:.6,seed:Math.random()*9,arrow:1,
    update(q){const b=e.mb;if(!b||b.drunk||e.dead||e.hidden||b.win>0)return;if(Math.hypot(e.x-q.x,e.y-q.y)<q.r-14){q.dead=1;drunk(e,q);}},
    draw(q,x,y,t){const A=ctx.globalAlpha,r=q.r*Math.min(1,q.t/.35);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,r*.15,0,0,r);g.addColorStop(0,'rgba(170,30,100,.9)');g.addColorStop(.75,'rgba(120,16,72,.78)');g.addColorStop(1,'rgba(70,8,40,0)');
      ctx.fillStyle=g;ctx.beginPath();for(let i=0;i<=28;i++){const a=i/28*T2,rr=r*(.86+.14*Math.sin(a*5+q.seed));i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();
      ctx.lineWidth=2.5;ctx.strokeStyle='rgba(255,170,215,.55)';for(let k=0;k<2;k++){const rr=r*(.25+((t*.45+k*.5)%1)*.65);ctx.globalAlpha=A*(1-((t*.45+k*.5)%1));ctx.beginPath();ctx.arc(0,0,rr,0,T2);ctx.stroke();}
      ctx.globalAlpha=A;ctx.restore();G.text(x,y-8,'🍷',16,'#fff');}});
  M.say({x,y},'ไวน์นอง!','#ff9ad0',15);M.hint(e,'ไวน์นองพื้น! ล่อตาเดียวให้เดินเหยียบ (ไปยืนอีกฝั่งของแอ่ง)');}
class Drunk{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;const e=this.e,on=!e.dead&&e.mb&&e.mb.win>0&&e.mb.drunk;e.mbTilt=on?Math.sin(this.t*2.4)*.2:0;return on;}
  draw(){const e=this.e,h=(MSPR_H(e)||120),[x,y]=P(e.x,e.y,h*.78);G.glow(x,y,46,'#ffe08a',.45+.15*Math.sin(this.t*6));G.ell(x,y,13,9,'#fff8e0','#3a2408',2.4);G.ell(x,y,5,5,'#2a1a08');
    G.text(x,y-26,'ตาเปิด!',13,'#ffe08a');for(let i=0;i<2;i++){const k=(this.t*.6+i*.5)%1;G.text(x+22+i*8,y-36-k*30,'hic!',12,`rgba(255,160,210,${1-k})`);}}}
function drunk(e,q){const b=e.mb;b.drunk=1;M.say(e,'อึก… ไวน์!','#ff9ad0',20);M.window(e,PO.drunk,'เมา! ตาเปิดค้าง');addFx(new Drunk({e}));
  for(let i=0;i<16;i++)emit({type:'ember',x:q.x,y:q.y,z:rnd(4,20),vx:rnd(-120,120),vy:rnd(-80,80),vz:rnd(80,200),drag:1.4,grav:420,life:.7,size:3,size1:.8,color:'#c8307a'});}
/* the flying rock (thrown boulders, sheep are props of their own) */
class Fly{constructor(o){Object.assign(this,{t:0,layer:'top'},o);this.x0=o.from.x;this.y0=o.from.y;}update(dt){this.t+=dt;return this.t<this.T+(this.delay||0);}
  draw(){const k=(this.t-(this.delay||0))/this.T;if(k<0||k>1)return;const x=this.x0+(this.x-this.x0)*k,y=this.y0+(this.y-this.y0)*k,z=90*(1-k)+Math.sin(Math.PI*k)*120,[sx,sy]=P(x,y,z),s=this.s||1;
    ctx.save();ctx.translate(sx,sy);ctx.rotate(this.t*8);G.poly([[-14*s,4*s],[-10*s,-12*s],[6*s,-15*s],[15*s,-2*s],[8*s,12*s],[-6*s,13*s]],'#8a8478','#2e2a24',2.4);ctx.restore();}}
function sweep(e){const phi=M.angTo(e,player);pose(e,1.2);
  M.act(e,{T:1.35,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:PO.sweepR,phi,half:PO.sweepHalf},T:1.2,mul:2,boomKind:'quiet',onFire(){hitPose(e);dustPuff(e.x+Math.cos(phi)*90,e.y+Math.sin(phi)*90,12,'#a89a88',130,14);if(typeof shake==='function')shake(2.5);}});}});}
function stomp(e){pose(e,1);M.act(e,{T:1.15,start(e){M.strike(e,{shape:{k:'circle',x:e.x,y:e.y,r:PO.stompR},T:1,mul:1.6,cc:['air',.8],boomCol:'#c8b090',onFire(){hitPose(e);dustPuff(e.x,e.y,18,'#a89a88',160,16);}});}});}
function rockThrow(e){const x=player.x,y=player.y;pose(e,1.3);
  M.act(e,{name:'🪨 ขว้างหิน',T:1.45,start(e,a){addFx(new Fly({from:e,x,y,T:.5,delay:.8,s:1.6}));
    M.strike(e,{shape:{k:'circle',x,y,r:PO.rockR},T:1.3,mul:2.4,boomCol:'#c8b090',onFire(){hitPose(e);dustPuff(x,y,16,'#a89a88',140,16);
      if(free(x,y)&&Math.hypot(player.x-x,player.y-y)>58&&M.props(e,'rock2').length<4)tempRock(e,x,y);}});}});}
function throwSheep(e){const S=M.props(e,'sheep').filter(q=>!q.fly&&q.daze<=0);if(!S.length)return false;let s=S[0],bd=1e9;for(const q of S){const d=Math.hypot(q.x-e.x,q.y-e.y);if(d<bd){bd=d;s=q;}}
  const x=player.x,y=player.y;pose(e,1.2);M.say(e,'แกะบิน!','#fff0c0',17);
  M.act(e,{name:'🐑 ขว้างแกะ',T:1.3,start(e){s.fly={x0:s.x,y0:s.y,x1:x,y1:y,t:0,T:1.15};M.strike(e,{shape:{k:'circle',x,y,r:70},T:1.15,mul:1.4,boomCol:'#ffffff',onFire(){hitPose(e);}});}});return true;}
class Beam{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}update(dt){this.t+=dt;return !this.dead&&!this.e.dead;}
  draw(){const a=this.a;if(a.ang==null)return;const e=this.e,[x,y]=P(e.x,e.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const R=PO.beamR,h=PO.beamHalf;
    const g=ctx.createRadialGradient(0,0,30,0,0,R);g.addColorStop(0,'rgba(255,244,180,.62)');g.addColorStop(.7,'rgba(255,226,130,.32)');g.addColorStop(1,'rgba(255,210,110,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,a.ang-h,a.ang+h);ctx.closePath();ctx.fill();
    ctx.lineWidth=4;ctx.strokeStyle='rgba(255,70,40,.75)';for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a.ang+s*h)*R*.92,Math.sin(a.ang+s*h)*R*.92);ctx.stroke();}ctx.restore();}}
class Eye{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return !this.dead&&!this.e.dead;}
  draw(){const e=this.e,[x,y]=P(e.x,e.y,(MSPR_H(e)||120)*.8),k=Math.min(1,this.t/.6);G.glow(x,y,70*k,'#ffe890',.75);G.ell(x,y,14*k,10*k,'#fffbe8','#5a3a08',2.4);G.ell(x,y,5*k,5*k,'#3a1a08');}}
function search(e){const b=e.mb;M.cancel(e);M.say(e,'ใครอยู่ตรงนั้น!','#ffe08a',20);
  if(!b.seenEye){b.seenEye=1;M.banner('ตาเดียวมองหา! ซ่อนหลังหินใหญ่ หรือยืนชิดแกะ','blue',2.6);}else M.banner('ซ่อน! หลังหิน หรือชิดแกะ','blue',1.6);
  M.hint(e,'ลำแสงตาเดียวกวาดรอบถ้ำ — ยืนในเงาฟ้าหลังหิน หรือชิดแกะ (ขนแกะบังไว้)');
  const dir=(M.count(e,'eye')%2)?1:-1;
  M.act(e,{name:'👁 ใครอยู่ตรงนั้น!',T:.9+PO.beamT,unstop:1,eye:1,
    start(e,a){e.atk=0;b.search=1;a.sh=[];for(const q of M.props(e,'rock').concat(M.props(e,'rock2')))a.sh.push(shelter(e,q,PO.beamT+.9));a.a0=M.angTo(e,player)+Math.PI;a.dir=dir;a.beam=addFx(new Beam({e,a}));a.eye=addFx(new Eye({e}));},
    step(e,a){e.atk=0;if(a.t<.9||a.found)return;const ang=a.a0+a.dir*(a.t-.9)/PO.beamT*T2;a.ang=ang;e.face=Math.cos(ang)>=0?1:-1;
      if(player.hp>0){const d=M.dP(e);if(d<PO.beamR&&Math.abs(angDiff(M.angTo(e,player),ang))<PO.beamHalf&&!hiddenFrom(e)){a.found=1;found(e,a);}}},
    end(e,a){b.search=0;for(const f of [a.beam,a.eye])if(f)f.dead=1;for(const w of a.sh)w.dead=1;
      if(!a.found&&player.hp>0){M.say(e,'ไม่มีใคร?!','#ffe9a0',21);M.window(e,2,'ไม่มีใคร?! งง');}
      M.hint(e,'หลบวงแดง · ไหไวน์ ◎ แตก = แอ่งไวน์: ล่อมันเดินเหยียบ = เมา 7 วิ · ตาเดียวมองหา = ซ่อนหลังหิน/ชิดแกะ');},
    cancel(e,a){b.search=0;for(const f of [a.beam,a.eye])if(f)f.dead=1;for(const w of a.sh||[])w.dead=1;}});}
function found(e,a){M.say(e,'เจอแล้ว!!','#ff8a6a',21);M.fail(e,'โดนตาเดียวหาเจอ');a.T=Math.min(a.T,a.t+.7);const x=player.x,y=player.y;
  addFx(new Fly({from:e,x,y,T:.35,s:2.2}));setFxTimer(.35,()=>{if(e.dead||!e.mb)return;dustPuff(x,y,18,'#a89a88',160,18);if(typeof shake==='function')shake(5);addFx(new GRing({x,y,r0:10,r1:120,w:14,color:'#c8b090',life:.45}));
    if(Math.hypot(player.x-x,player.y-y)<110)M.hit(e,3,{cc:['stun',1.5]});});}
M.def('polyphemus',{R:520,see:320,spd:50,reach:130,hpMul:1.3,enrage:360,minH:120,
  cry:'กลิ่นคน…!',intro:'โพลีฟีมัส — ตาเดียวส่องหา: ซ่อนหลังหิน/ชิดแกะ · ทุบไหไวน์ ◎ แล้วล่อมันเดินเหยียบ = เมา',
  cd0:{sweep:2,stomp:5,rock:6,eye:14,sheep:6},phases:[.35],
  setup(e,b){bigRocks(e);flock(e);jarSet(e);b.drunk=0;b.search=0;M.hint(e,'หลบวงแดง · ไหไวน์ ◎ แตก = แอ่งไวน์: ล่อมันเดินเหยียบ = เมา 7 วิ · ตาเดียวมองหา = ซ่อนหลังหิน/ชิดแกะ');},
  phase(e){M.banner('จับแกะขว้าง! แกะหนีไปชิดผนัง','red',2.2);},
  tick(e,dt){const b=e.mb;if(!M.parts(e,'jar').length&&!M.props(e,'wine').length){if(b.jarT==null){b.jarT=60;M.hint(e,'ไหไวน์หมด — ชุดใหม่มาใน 60 วิ');}b.jarT-=dt;if(b.jarT<=0){jarSet(e);M.say(e,'(ไหไวน์ชุดใหม่)','#ff9ad0',14);}}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'eye')){M.cd(e,'eye',25);search(e);return true;}
    if(b.phase>=2&&M.ready(e,'sheep')&&L<480){M.cd(e,'sheep',9);if(throwSheep(e))return true;}
    if(M.ready(e,'rock')&&L>140&&L<480){M.cd(e,'rock',12);rockThrow(e);return true;}
    if(M.ready(e,'stomp')&&L<150){M.cd(e,'stomp',9);stomp(e);return true;}
    if(M.ready(e,'sweep')&&L<165){M.cd(e,'sweep',6);sweep(e);return true;}
    return false;},
  winEnd(e){const b=e.mb;if(b.drunk){b.drunk=0;e.mbTilt=0;}},
  reset(e){e.mbTilt=0;e.mb.drunk=0;e.mb.search=0;}});
})();
