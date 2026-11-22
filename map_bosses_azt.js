/* =====================================================================
   AZTEC MAP BOSSES (MAP_BOSS_MECHANICS_TH.md §9) — scripts for map_boss_kit.js.
   · Ahuizotl (aztH1 · Lv 37): bite (small cone) · TAIL-HAND GRAB (line 260, 360 when it stands by water): caught = dragged into the
       nearest pool and drowned 2.5 s (×0.4 every 0.5 s) unless the tail hand (gold) is broken · water jet from a pool (line, knock-down) ·
       DIVE every 20 s: under water it can't be hit and heals Lv × 8 a second; 1.5 s before it surfaces a baby cries and a gold pearl
       glows at that pool (splash circle ×2). CLOSE THE POOLS: break a pool's dam stone (gold) = mud 40 s, or an ice / frost hit on the
       stone (or on it while it stands in the pool) = ice 40 s. No pool left = 'ashore!' 8 s window, then every pool comes back.
       Phase < 50 %: a fake cry at another pool (gold pearl = real, blue = fake).
   · Eagle Warlord (aztH2 · Lv 44): two-beat obsidian slash (bleed) · storm feathers (3 lines) ·
       SUN SHIELD 4 s: hits from the front 120° are blocked, after 5 blocks (3 below 33 %) a shield bash; from behind every hit ignores DEF ·
       THREE DIVES (every 25 s + at 66 / 33 %): it flies up, a shadow chases you 1 s, stops 0.6 s, it dives (×2.2) and stands 1.5 s;
       the last dive sticks its talons in the ground 4 s (window). Lure a dive onto a stone pillar = it crashes, window at once.
       Phase < 33 %: 4 dives.
   · Camazotz (aztD1b · Lv 49): decapitation slash (wide cone) · bat swarm (follows slowly, drains SP; bats fear light) · screech (silence) ·
       XIBALBA DARKNESS (every 35 s + at 70 / 40 %): sight 160, it hides in the dark and swoops from outside it (red eyes + a red line
       0.8 s; the blood it takes is healed back if the darkness ends on its own); 4 braziers (gold): 4 hits light one = a light circle 180
       where it can't swoop and bats can't enter; all 4 lit = the darkness breaks, it falls 5 s (window). Phase < 35 %: braziers burn
       20 s instead of 30, two swoops at a time.
   ===================================================================== */
(function(){
const M=window.MBK;if(!M)return;
const T2=Math.PI*2,G=M.g,lv=M.lvOf;
const pose=(e,T)=>{e.atk=T;e.face=player.x>=e.x?1:-1;};
const hitPose=e=>{e.atk=0;e._hitT=gameTime;};
const free=(x,y)=>!curMap||!mapBlockedW(x,y);
function spot(cx,cy,a,r){for(let k=0;k<14;k++){const x=cx+Math.cos(a+k*.45)*r,y=cy+Math.sin(a+k*.45)*r*.85;if(free(x,y))return [x,y];}return [cx,cy];}
function openSpot(cx,cy,a,r,R){let best=null,bs=-1;for(const rr of [r,r*.85,r*1.15,r*.7]){for(let k=0;k<16;k++){const aa=a+k*T2/16,x=cx+Math.cos(aa)*rr,y=cy+Math.sin(aa)*rr*.85;if(!free(x,y))continue;
    let n=0;for(let i=0;i<12;i++){const d=i*T2/12;for(const q of [R*.35,R*.7,R])if(free(x+Math.cos(d)*q,y+Math.sin(d)*q))n++;}if(n===36)return [x,y];if(n>bs){bs=n;best=[x,y];}}}
  return best||[cx,cy];}
/* n spots round home on open ground, at least `gap` apart */
function ring(e,n,r,R,gap,a0){const b=e.mb,got=[];for(let i=0;i<n;i++){const a=(a0||.4)+i*T2/n;let [x,y]=openSpot(b.home.x,b.home.y,a,r,R);if(got.some(g=>Math.hypot(g[0]-x,g[1]-y)<gap))[x,y]=spot(b.home.x,b.home.y,a,r);got.push([x,y]);}return got;}
function puff(x,y,col,n,sp){for(let i=0;i<(n||14);i++){const a=Math.random()*T2,s=rnd(40,sp||160);emit({type:'ember',x,y,z:rnd(10,60),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(30,120),drag:1.6,life:rnd(.5,.9),size:rnd(2.4,4),size1:1.2,color:col});}}
function splash(x,y,n,col){for(let i=0;i<(n||16);i++){const a=Math.random()*T2,s=rnd(60,200);emit({type:'ember',x:x+Math.cos(a)*10,y:y+Math.sin(a)*6,z:rnd(4,20),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(120,260),drag:1.2,grav:520,life:rnd(.5,.9),size:rnd(2.4,4),size1:.8,color:col||(Math.random()<.5?'#bfe8ff':'#5fb0e0')});}}
const icy=t=>!!(t&&((t.st&&(t.st.slow>0||t.st.frozen>0))||(t._gfI&&t._gfI>gameTime)||t._gfF));
const icyCol=c=>typeof c==='string'&&/^#(c8f2ff|cfefff|bff|9fe|7fd|66d9ff|a8e2ff)/i.test(c);

/* ================= Ahuizotl ================= */
const AH={poolR:80,damHp:20,closed:40,heal:8,under:3.5,warn:1.5,shake:2,grabL:260,grabL2:360,drown:2.5,handHp:8,splashR:100};
function blob(r,s){ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*T2,rr=r*(.9+.1*Math.sin(a*4+s));i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();}
function drawPool(q,x,y,t){const A=ctx.globalAlpha,r=q.r;ctx.save();ctx.translate(x,y);ctx.scale(1,K);
  if(q.st==='water'){const g=ctx.createRadialGradient(0,0,r*.2,0,0,r);g.addColorStop(0,'#2e7898');g.addColorStop(.8,'#1e5274');g.addColorStop(1,'#3a7a6a');ctx.fillStyle=g;blob(r,q.seed);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#5a4a2e';ctx.stroke();
    ctx.lineWidth=2;ctx.strokeStyle='rgba(200,240,255,.45)';for(let k=0;k<2;k++){const f=(t*.35+k*.5)%1;ctx.globalAlpha=A*(1-f);ctx.beginPath();ctx.arc(0,0,r*(.2+.7*f),0,T2);ctx.stroke();}}
  else if(q.st==='mud'){ctx.fillStyle='#6a5236';blob(r,q.seed);ctx.fill();ctx.strokeStyle='#3a2a18';ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle='rgba(40,26,12,.7)';ctx.lineWidth=2;for(let k=0;k<6;k++){const a=k*1.05+q.seed;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.15,Math.sin(a)*r*.15);ctx.lineTo(Math.cos(a)*r*.8,Math.sin(a)*r*.8);ctx.stroke();}}
  else{const g=ctx.createRadialGradient(0,0,r*.1,0,0,r);g.addColorStop(0,'#f4fcff');g.addColorStop(1,'#a8d8f0');ctx.fillStyle=g;blob(r,q.seed);ctx.fill();ctx.strokeStyle='#5a9ac8';ctx.lineWidth=4;ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;for(let k=0;k<5;k++){const a=k*1.3+q.seed;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.2,Math.sin(a)*r*.2);ctx.lineTo(Math.cos(a+.3)*r*.85,Math.sin(a+.3)*r*.85);ctx.stroke();}}
  ctx.restore();ctx.globalAlpha=A;if(q.st!=='water')G.text(x,y-6,(q.st==='ice'?'❄ ':'')+Math.ceil(q.t),13,q.st==='ice'?'#e8f8ff':'#f0d8a8');
  if(q.pearl){const P2=q.pearl,k=Math.min(1,P2.t/.3),col=P2.fake?'#7fd0ff':'#ffd23a';G.glow(x,y-10,60*k,col,.55+.2*Math.sin(t*12));G.ell(x,y-14,9*k,9*k,col==='#ffd23a'?'#fff0b0':'#d8f4ff','#3a2a08',2);G.text(x,y-34,'อุแว้…',13,col);}}
function drawDam(p,x,y,t){G.shadow(x,y+2,22,.3);G.poly([[x-20,y],[x-22,y-14],[x-14,y-28],[x+12,y-30],[x+22,y-16],[x+20,y]],'#8a8270','#2e2a22',2.6);G.poly([[x-14,y-28],[x+12,y-30],[x+4,y-16],[x-12,y-15]],'#a8a090');
  ctx.strokeStyle='rgba(120,200,240,.8)';ctx.lineWidth=2;const w=Math.sin(t*6)*2;ctx.beginPath();ctx.moveTo(x+18,y-10);ctx.quadraticCurveTo(x+24+w,y-4,x+22,y+2);ctx.stroke();}
function dam(e,q){const b=e.mb,a=Math.atan2(b.home.y-q.y,b.home.x-q.x),x=q.x+Math.cos(a)*(q.r+4),y=q.y+Math.sin(a)*(q.r+4)*.85;
  q.dam=M.part(e,{x,y,hp:Math.round(lv(e)*AH.damHp),r:18,h:42,name:'Dam Stone',th:'หินกั้นน้ำ',kind:'dam',data:{q},draw:drawDam,onBreak(p){if(q.dam===p){q.dam=null;closePool(e,q,'mud');}}});}
function pools(e){const b=e.mb;b.pools=[];for(const [x,y] of ring(e,4,260,110,210,.4)){const q=M.prop(e,{kind:'pool',x,y,r:AH.poolR,layer:'ground',st:'water',t:0,seed:Math.random()*9,draw:drawPool});b.pools.push(q);dam(e,q);}}
const usable=e=>(e.mb.pools||[]).filter(q=>q.st==='water');
function closePool(e,q,how){const b=e.mb;if(!b||q.st!=='water')return;q.st=how;q.t=AH.closed;q.pearl=null;if(q.dam&&!q.dam.dead){q.dam.onBreak=null;M.breakPart(q.dam);}q.dam=null;
  M.say(q,how==='ice'?'แอ่งแข็ง!':'แอ่งแห้งเป็นโคลน!',how==='ice'?'#cfeeff':'#f0d8a8',17);how==='ice'?puff(q.x,q.y,'#e8f8ff',18):puff(q.x,q.y,'#8a6a46',14);
  const n=usable(e).length;if(!n){ashore(e);return;}M.hint(e,`ปิดแอ่งได้อีก ${n} แอ่ง — ทุบหินกั้นน้ำ ◎ หรือใช้ธาตุน้ำแข็ง/เยือกแข็ง`);
  const a=b.act;if(a&&a.dive&&a.q===q&&a.ph===1){a.u=AH.under;M.say(e,'โดนไล่ขึ้นจากน้ำ!','#9fd8ff',16);}}
function ashore(e){const b=e.mb;b.restore=1;const a=b.act;M.cancel(e);e.hidden=0;if(a&&a.dive&&a.q){e.x=a.q.x;e.y=a.q.y;}M.say(e,'ขึ้นบก!','#ffe08a',22);M.window(e,8,'ไม่มีแอ่งให้มุด! ขึ้นบกตื่นตกใจ');splash(e.x,e.y,20);}
function bite(e){const phi=M.angTo(e,player);pose(e,.7);M.act(e,{T:.85,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:110,phi,half:.6},T:.7,mul:1.2,boomKind:'quiet',onFire(){hitPose(e);}});}});}
function drawTailHand(p,x,y,t){const z=26+Math.sin(t*9)*2;G.shadow(x,y+2,12,.25);ctx.save();ctx.translate(x,y-z);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-26,10);ctx.quadraticCurveTo(-14,-4,-2,0);ctx.stroke();ctx.strokeStyle='#3a5a7a';ctx.lineWidth=4;ctx.stroke();
  G.ell(4,0,10,8,'#3a5a7a','#1a2a3a',2.2);for(let i=0;i<4;i++){ctx.strokeStyle='#1a2a3a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(8,-4+i*3);ctx.lineTo(16,-8+i*4);ctx.stroke();}ctx.restore();}
function tailGrab(e){const b=e.mb,near=(b.pools||[]).some(q=>q.st==='water'&&Math.hypot(e.x-q.x,e.y-q.y)<q.r+110),L=near?AH.grabL2:AH.grabL,phi=M.angTo(e,player);pose(e,1);
  M.say(e,near?'มือหาง! (ยื่นไกล)':'มือหาง!','#9fd8ff',16);if(!b.seenGrab){b.seenGrab=1;M.banner('มือหางคว้า! หลบเส้น · อยู่ห่างขอบน้ำ (ใกล้น้ำมือยื่นไกล)','gold',2.4);}
  M.act(e,{name:'🖐 มือหางคว้า',T:1.2,start(e){M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi,len:L,w:56,off:20},T:1,noHit:1,boomKind:'quiet',onFire(h,w){hitPose(e);if(player.hp>0&&M.inShape(w.shape,player.x,player.y,8))drag(e);}});}});}
function drag(e){const b=e.mb,U=usable(e);if(!U.length){M.hit(e,1,{});return;}let q=U[0],bd=1e9;for(const p of U){const d=Math.hypot(p.x-player.x,p.y-player.y);if(d<bd){bd=d;q=p;}}
  const x0=player.x,y0=player.y,t0=gameTime;M.say(player,'ถูกลากลงน้ำ!','#9fd8ff',16);M.banner('ถูกลากลงน้ำ! ทุบมือหาง ◎ ให้หลุด','red',2);
  const hand=M.part(e,{x:player.x+16,y:player.y+4,hp:Math.round(lv(e)*AH.handHp),r:14,h:44,name:'Tail Hand',th:'มือหาง',kind:'tail',fixed:0,ring:18,draw:drawTailHand,onBreak(p){splash(p.x,p.y,10);}});
  b.drown={q,hand,tk:.6,t0};
  M.pc('grab',AH.drown+.5,{part:hand,pos:()=>{const k=Math.min(1,(gameTime-t0)/.5);return [x0+(q.x-x0)*k,y0+(q.y-y0)*k];},free:()=>hand.dead,
    end(timeout){b.drown=null;if(!hand.dead){hand.onBreak=null;hand.gone=1;hand.dead=true;}if(timeout){M.fail(e,'จมน้ำ');M.say(player,'สำลักน้ำ!','#9fd8ff',15);}else M.say(player,'หลุด!','#bfe6ff',16);}});}
function jet(e){const U=usable(e);if(!U.length)return false;let q=U[0],bd=1e9;for(const p of U){const d=Math.hypot(p.x-player.x,p.y-player.y);if(d<bd){bd=d;q=p;}}const phi=Math.atan2(player.y-q.y,player.x-q.x);pose(e,1);
  M.say(q,'ซู่!','#9fd8ff',15);M.act(e,{name:'🌊 พุ่งน้ำ',T:1.35,start(e){M.strike(e,{shape:{k:'rect',x:q.x,y:q.y,phi,len:420,w:70,off:0},T:1.2,mul:1.6,cc:['air',.8],boomKind:'quiet',
    onFire(){hitPose(e);for(let i=0;i<14;i++){const r=rnd(20,420);splash(q.x+Math.cos(phi)*r,q.y+Math.sin(phi)*r,2);}}});}});return true;}
function dive(e){const b=e.mb,U=usable(e);if(!U.length)return false;let q=U[0],bd=1e9;for(const p of U){const d=Math.hypot(p.x-e.x,p.y-e.y);if(d<bd){bd=d;q=p;}}
  if(!b.seenDive){b.seenDive=1;M.banner('มุดน้ำฟื้นเลือด! ปิดแอ่ง: ทุบหินกั้นน้ำ ◎ หรือใช้น้ำแข็ง','gold',2.6);}
  M.hint(e,'ใต้น้ำมันฟื้นเลือด — ไข่มุกทอง = แอ่งที่มันจะโผล่ · ปิดแอ่งให้หมด = ขึ้นบก');
  const x0=e.x,y0=e.y;
  M.act(e,{name:'💧 มุดน้ำ',T:40,unstop:1,dive:1,start(e,a){a.q=q;a.ph=0;a.u=0;a.ht=0;a.pt=0;},
    step(e,a,dt){e.atk=0;
      if(a.ph===0){const k=Math.min(1,a.t/.45);e.x=x0+(a.q.x-x0)*k;e.y=y0+(a.q.y-y0)*k;e.mbLift=Math.sin(Math.PI*k)*60;if(k>=1){e.mbLift=0;e.hidden=1;splash(e.x,e.y,22);a.ph=1;a.u=0;}return;}
      if(a.ph===1){a.u+=dt;const h=lv(e)*AH.heal*dt;e.hp=Math.min(e.maxHp,e.hp+h);a.ht+=dt;if(a.ht>=1){a.ht=0;addFx(new DText({x:a.q.x,y:a.q.y,z:40,text:'+'+Math.round(lv(e)*AH.heal),color:'#7fe0ff',size:15,life:1}));}
        if(Math.random()<.2)emit({type:'ember',x:a.q.x+rnd(-30,30),y:a.q.y+rnd(-18,18),z:2,vz:rnd(20,50),drag:1,life:.8,size:3,size1:4,color:'#d8f4ff'});
        if(a.u>=AH.under){const V=usable(e);if(!V.length)return;a.sq=V[Math.floor(Math.random()*V.length)];a.ph=2;a.pt=0;a.sq.pearl={t:0};
          if(b.phase>=2){const F=V.filter(p=>p!==a.sq);if(F.length){a.fq=F[Math.floor(Math.random()*F.length)];a.fq.pearl={t:0,fake:1};}}
          M.say(a.sq,'อุแว้… อุแว้…','#ffe08a',16);
          a.w=M.strike(e,{shape:{k:'circle',x:a.sq.x,y:a.sq.y,r:AH.splashR},T:AH.warn,mul:2,cc:['air',.8],boomKind:'quiet',onFire(){splash(a.sq.x,a.sq.y,26);}});}return;}
      if(a.ph===2){a.pt+=dt;for(const p of [a.sq,a.fq])if(p&&p.pearl)p.pearl.t+=dt;
        if(a.pt>=AH.warn){for(const p of [a.sq,a.fq])if(p)p.pearl=null;e.hidden=0;e.x=a.sq.x;e.y=a.sq.y;hitPose(e);a.ph=3;a.st=0;}return;}
      if(a.ph===3){a.st+=dt;e._hitT=gameTime-.2;if(Math.random()<.4)splash(e.x,e.y,2);if(a.st>=AH.shake)a.T=a.t;}},
    end(e,a){e.hidden=0;e.mbLift=0;for(const p of [a.sq,a.fq])if(p)p.pearl=null;M.hint(e,'อยู่ห่างขอบน้ำ · ปิดแอ่ง: ทุบหินกั้นน้ำ ◎ หรือใช้น้ำแข็ง · ไข่มุกทอง = จุดโผล่');},
    cancel(e,a){e.hidden=0;e.mbLift=0;for(const p of [a.sq,a.fq])if(p)p.pearl=null;}});return true;}
M.def('ahuizotl',{R:560,see:330,spd:70,reach:105,hpMul:1.25,enrage:300,minH:96,
  cry:'อุแว้… (เสียงเด็กร้องจากน้ำ)',intro:'อาฮุยซอตล์ — มุดน้ำฟื้นเลือด: ปิดแอ่งทั้ง 4 (ทุบหินกั้นน้ำ ◎ หรือใช้น้ำแข็ง) มันจะขึ้นบก',
  cd0:{bite:1.5,grab:6,jet:9,dive:14},phases:[.5],
  setup(e,b){pools(e);b.restore=0;b.drown=null;M.hint(e,'อยู่ห่างขอบน้ำ · ปิดแอ่ง: ทุบหินกั้นน้ำ ◎ หรือใช้น้ำแข็ง · ไข่มุกทอง = จุดโผล่');},
  phase(e){M.banner('เสียงเด็กร้องหลอก! ไข่มุกทอง = จริง · ไข่มุกฟ้า = หลอก','red',2.4);},
  tick(e,dt){const b=e.mb;
    for(const q of b.pools||[]){if(q.st!=='water'){q.t-=dt;if(q.t<=0){q.st='water';q.t=0;if(!q.dam||q.dam.dead)dam(e,q);M.say(q,'น้ำกลับมา','#9fd8ff',14);}}
      else if(q.dam&&!q.dam.dead&&icy(q.dam))closePool(e,q,'ice');}
    if(!e.hidden&&(icy(e)))for(const q of b.pools||[])if(q.st==='water'&&Math.hypot(e.x-q.x,e.y-q.y)<q.r)closePool(e,q,'ice');
    const D=b.drown;if(D){D.hand.x=player.x+16;D.hand.y=player.y+4;if(gameTime-D.t0>.5){D.tk-=dt;if(D.tk<=0){D.tk=.5;M.hit(e,.4,{});splash(player.x,player.y,6);}}}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'dive')){M.cd(e,'dive',20);if(dive(e))return true;}
    if(M.ready(e,'grab')&&L<AH.grabL2-10&&L>90){M.cd(e,'grab',10);tailGrab(e);return true;}
    if(M.ready(e,'jet')&&L<420){M.cd(e,'jet',14);if(jet(e))return true;}
    if(M.ready(e,'bite')&&L<125){M.cd(e,'bite',3);bite(e);return true;}
    return false;},
  partHurt(e,p,d,o){if(p.pkind==='dam'&&p.data.q&&p.data.q.st==='water'&&icyCol(o&&o.color))closePool(e,p.data.q,'ice');},
  winEnd(e){const b=e.mb;if(b.restore){b.restore=0;for(const q of b.pools){q.st='water';q.t=0;if(!q.dam||q.dam.dead)dam(e,q);}M.say(e,'แอ่งน้ำกลับมา','#9fd8ff',16);}},
  reset(e){e.hidden=0;e.mbLift=0;}});

/* ================= Eagle Warlord ================= */
const EG={half:Math.PI/3,blocks:5,blocks3:3,diveR:90,stuck:4,dives:3,dives3:4};
function drawPillar(q,x,y){const cr=q.cr||0;G.shadow(x,y+3,34,.35);G.poly([[x-24,y],[x-20,y-8],[x-20,y-96],[x-26,y-104],[x+26,y-104],[x+20,y-96],[x+20,y-8],[x+24,y]],'#b8a07a','#3a2a16',3);
  ctx.fillStyle='#8a6a3a';for(const yy of [-30,-62])ctx.fillRect(x-20,y+yy,40,7);G.poly([[x-10,y-80],[x,y-90],[x+10,y-80],[x,y-72]],'#3a8a7a','#1a3a30',1.6);
  if(cr){ctx.strokeStyle='#2a1a0a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y-100);ctx.lineTo(x+4,y-70);ctx.lineTo(x-4,y-44);ctx.lineTo(x+6,y-20);ctx.stroke();}}
function pillars(e){for(const [x,y] of ring(e,4,230,90,170,.8))M.prop(e,{kind:'pillar',x,y,r:30,solid:1,cover:1,layer:'sorted',hp:2,cr:0,draw:drawPillar});}
class Shield{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;const b=this.e.mb;return !this.e.dead&&b&&b.sh;}
  draw(){const e=this.e,b=e.mb,s=b.sh;if(!s)return;const a=s.a,h=(MSPR_H(e)||110),[x,y]=P(e.x+Math.cos(a)*30,e.y+Math.sin(a)*30,h*.45),k=Math.min(1,this.t/.2),pu=.8+.2*Math.sin(this.t*10);
    ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.35,Math.abs(Math.cos(a)))*k,k);G.glow(0,0,48,'#ffd23a',.45*pu);G.ell(0,0,26,26,'#c8902a','#3a2408',3);G.ell(0,0,18,18,'#e8b84a','#7a4a10',2);
    G.poly([[0,-12],[10,0],[0,12],[-10,0]],'#2a7a6a','#1a2a20',1.6);ctx.restore();
    const n=b.phase>=3?EG.blocks3:EG.blocks;G.text(x,y-40,'กัน '+s.n+'/'+n,12,'#ffe08a');}}
function shieldUp(e){const b=e.mb;M.say(e,'โล่สุริยะ!','#ffd23a',18);if(!b.seenSh){b.seenSh=1;M.banner('โล่สุริยะ! อ้อมไปตีข้างหลัง — ตีด้านหน้าครบจะโดนสวน','gold',2.4);}
  M.hint(e,'โล่หันหาเรา — อ้อมไปตีด้านหลัง (ไม่สน DEF) หรือหยุดตีรอ');
  M.act(e,{name:'🛡 โล่สุริยะ',T:4,unstop:1,start(e,a){b.sh={a:M.angTo(e,player),n:0};a.f=addFx(new Shield({e}));a.wd=M.warn({shape:{k:'wedge',x:e.x,y:e.y,r:150,a0:0,a1:1},life:4.05,col:'gold',hold:.1,e,track(w){const s=b.sh;if(!s)return;w.shape.x=e.x;w.shape.y=e.y;w.shape.a0=s.a-EG.half;w.shape.a1=s.a+EG.half;}});},
    step(e,a,dt){e.atk=0;const s=b.sh;if(!s)return;s.a+=Math.max(-1.2*dt,Math.min(1.2*dt,angDiff(M.angTo(e,player),s.a)));e.face=Math.cos(s.a)>=0?1:-1;},
    end(e,a){b.sh=null;if(a.wd)a.wd.dead=1;},cancel(e,a){b.sh=null;if(a.wd)a.wd.dead=1;}});}
function bash(e){const b=e.mb,phi=b.sh?b.sh.a:M.angTo(e,player);M.cancel(e);M.say(e,'สวน!','#ff9a6a',20);pose(e,.45);
  M.act(e,{name:'🛡 โล่สวน',T:.6,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:160,phi,half:.9},T:.45,mul:1.8,push:170,sig:'โดนโล่สวน',boomKind:'quiet',onFire(){hitPose(e);puff(e.x+Math.cos(phi)*60,e.y+Math.sin(phi)*60,'#ffd23a',14);if(typeof shake==='function')shake(3);}});}});}
function slash2(e){const phi=M.angTo(e,player);pose(e,.8);
  M.act(e,{name:'⚔ ฟันสองจังหวะ',T:1.45,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:130,phi,half:.75},T:.8,mul:1,boomKind:'quiet',onFire(){hitPose(e);e.atk=.5;}});
    M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:150,phi,half:.85},T:1.3,mul:1.4,dot:['mbBleed',4,.8],boomKind:'quiet',onFire(){hitPose(e);}});}});}
function feathers(e){const phi=M.angTo(e,player);pose(e,.9);
  M.act(e,{name:'🪶 ขนนกพายุ',T:1.05,start(e){for(const d of [-.35,0,.35])M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi:phi+d,len:420,w:40,off:20},T:.9,mul:1,boomKind:'quiet',
    onFire(){hitPose(e);for(let i=0;i<6;i++){const r=rnd(40,420);emit({type:'ember',x:e.x+Math.cos(phi+d)*r,y:e.y+Math.sin(phi+d)*r,z:rnd(10,30),vx:Math.cos(phi+d)*200,vy:Math.sin(phi+d)*200,drag:2,life:.5,size:3,size1:1,color:Math.random()<.5?'#3a9a8a':'#e8c050'});}}});}});}
class DiveShadow{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}update(dt){this.t+=dt;return !this.dead&&!this.e.dead;}
  draw(){const s=this.s,[x,y]=P(s.x,s.y),k=.7+.3*Math.min(1,this.t/1.2);ctx.save();ctx.translate(x,y);ctx.scale(k,k*.55);ctx.globalAlpha*=.42;ctx.fillStyle='#140a06';
    ctx.beginPath();ctx.moveTo(0,-10);ctx.quadraticCurveTo(-30,-26,-62,-6);ctx.quadraticCurveTo(-34,-4,-12,10);ctx.lineTo(0,26);ctx.lineTo(12,10);ctx.quadraticCurveTo(34,-4,62,-6);ctx.quadraticCurveTo(30,-26,0,-10);ctx.fill();ctx.restore();}}
class Streak{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<.32;}
  draw(){const k=this.t/.32,[x,y]=P(this.x,this.y),top=y-360*(1-Math.min(1,k*1.6));ctx.save();ctx.globalAlpha=1-k;ctx.lineCap='round';ctx.strokeStyle='#ffe08a';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x,top-120);ctx.lineTo(x,top);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.stroke();ctx.restore();}}
function diveChain(e){const b=e.mb,N=b.phase>=3?EG.dives3:EG.dives;M.cancel(e);b.sh=null;M.say(e,'อินทรีดิ่ง!','#ffe08a',19);
  if(!b.seenDive){b.seenDive=1;M.banner('ดิ่งพสุธา 3 ครั้ง! ครั้งสุดท้ายกรงเล็บติดพื้น · ล่อให้ดิ่งชนเสา = มึนทันที','gold',2.8);}
  M.hint(e,'เงาวงกลมไล่ตาม 1 วิ แล้วหยุด — ออกจากวง · ยืนชิดเสาให้มันดิ่งชนเสา');
  M.act(e,{name:'🦅 ดิ่งพสุธา',T:60,unstop:1,dive:1,start(e,a){a.i=0;a.st='up';a.tt=0;e.atk=0;},
    step(e,a,dt){a.tt+=dt;e.atk=0;
      if(a.st==='up'){e.mbLift=Math.min(360,(e.mbLift||0)+dt*1100);if(e.mbLift>=360){e.hidden=1;a.st='aim';a.tt=0;aim(e,a);}}
      else if(a.st==='ground'){if(a.tt>=1.5){a.st='up';a.tt=0;}}
      a.name='🦅 ดิ่งพสุธา '+Math.min(a.i+1,N)+'/'+N;},
    end(e,a){e.hidden=0;e.mbLift=0;if(a.sh)a.sh.dead=1;},cancel(e,a){e.hidden=0;e.mbLift=0;if(a.sh)a.sh.dead=1;}});}
function aim(e,a){const b=e.mb,N=b.phase>=3?EG.dives3:EG.dives,s={k:'circle',x:player.x,y:player.y,r:EG.diveR};a.sh=addFx(new DiveShadow({e,s}));
  M.strike(e,{shape:s,T:1.6,noHit:1,boom:0,track(w,dt){if(w.t<1){const dx=player.x-s.x,dy=player.y-s.y,d=Math.hypot(dx,dy);if(d>1){const st=Math.min(d,300*dt);s.x+=dx/d*st;s.y+=dy/d*st;}}},
    onFire(){if(a.sh)a.sh.dead=1;addFx(new Streak({x:s.x,y:s.y}));e.hidden=0;e.mbLift=0;e.x=s.x;e.y=s.y;hitPose(e);puff(s.x,s.y,'#e8c050',16,200);if(typeof shake==='function')shake(4);
      const q=M.props(e,'pillar').find(p=>Math.hypot(p.x-s.x,p.y-s.y)<p.r+EG.diveR*.55);
      if(q){q.cr=1;q.hp--;M.say(e,'ชนเสา!','#ffe08a',21);if(q.hp<=0){q.dead=1;puff(q.x,q.y,'#b8a07a',22,220);}const dx=e.x-q.x,dy=e.y-q.y,d=Math.hypot(dx,dy)||1;e.x=q.x+dx/d*(q.r+26);e.y=q.y+dy/d*(q.r+26);
        M.window(e,EG.stuck,'ดิ่งชนเสา! มึน');return;}
      if(player.hp>0&&M.inShape(s,player.x,player.y,10))M.hit(e,2.2,{cc:['air',.6]});
      a.i++;if(a.i>=N){M.say(e,'กรงเล็บติดพื้น!','#ffe08a',21);M.window(e,EG.stuck,'กรงเล็บปักพื้น! โล่หลุดมือ');return;}
      a.st='ground';a.tt=0;}});}
M.def('eagle',{R:560,see:330,spd:66,reach:115,hpMul:1.25,enrage:300,minH:104,
  cry:'เพื่อดวงอาทิตย์!',intro:'จอมทัพอินทรี — โล่ = อ้อมไปตีข้างหลัง · ดิ่งพสุธาครั้งสุดท้ายกรงเล็บติดพื้น (หรือล่อให้ดิ่งชนเสา)',
  cd0:{slash:1.5,shield:7,feather:6,dive:12},phases:[.66,.33],
  setup(e,b){pillars(e);b.sh=null;M.hint(e,'โล่ = อ้อมไปตีข้างหลัง · ดิ่ง = ออกจากเงา หรือยืนชิดเสาให้มันชนเสา');},
  phase(e,ph){M.cd(e,'dive',25);if(ph>=3)M.banner('ดิ่ง 4 ครั้ง · โล่สวนเร็วขึ้น (กัน 3 ฮิต)','red',2.2);diveChain(e);},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'dive')){M.cd(e,'dive',25);diveChain(e);return true;}
    if(M.ready(e,'shield')&&L<300){M.cd(e,'shield',12);shieldUp(e);return true;}
    if(M.ready(e,'feather')&&L<420){M.cd(e,'feather',15);feathers(e);return true;}
    if(M.ready(e,'slash')&&L<150){M.cd(e,'slash',4);slash2(e);return true;}
    return false;},
  hurt(e,mult,o){const b=e.mb,s=b.sh;if(!s)return null;if(Math.abs(angDiff(M.angTo(e,player),s.a))<EG.half){s.n++;if(s.n>=(b.phase>=3?EG.blocks3:EG.blocks))setTimeout(()=>{if(e.mb&&e.mb.sh)bash(e);},0);return {block:1,txt:'กัน!'};}
    o._msCut=Math.max(o._msCut||0,9999);return null;},
  reset(e){e.hidden=0;e.mbLift=0;e.mb.sh=null;}});

/* ================= Camazotz ================= */
const CZ={dark:15,vis:160,light:180,burn:30,burn2:20,gap:2.4,hits:4,batT:6,batV:70,screechR:180};
function drawBrazier(p,x,y,t){const L=p.data.lit;G.shadow(x,y+2,22,.32);G.poly([[x-10,y],[x-6,y-20],[x+6,y-20],[x+10,y]],'#5a4a3a','#1a120a',2);G.ell(x,y-24,22,8,'#6a5a46','#1a120a',2.4);
  G.poly([[x-22,y-24],[x-16,y-34],[x+16,y-34],[x+22,y-24]],'#7a6a52','#1a120a',2);ctx.fillStyle='#3a8a6a';ctx.fillRect(x-14,y-31,28,3);
  if(L){const f=.85+.15*Math.sin(t*12);G.glow(x,y-40,70,'#ff9a3a',.55*f);for(const dx of [-8,0,8]){ctx.save();ctx.translate(x+dx,y-36);ctx.beginPath();ctx.moveTo(0,-22*f-(dx?0:8));ctx.quadraticCurveTo(9,-6,0,4);ctx.quadraticCurveTo(-9,-6,0,-22*f-(dx?0:8));ctx.fillStyle='#ffb040';ctx.fill();ctx.restore();}
    if(Math.random()<.3)emit({type:'ember',x:p.x+rnd(-8,8),y:p.y,z:40,vz:rnd(40,90),vx:rnd(-10,10),drag:1,life:.8,size:2.2,size1:.4,color:'#ffd080'});G.text(x,y-72,Math.ceil(p.data.lt)+'',12,'#ffd8a0');}
  else if(p.data.n>0)G.text(x,y-48,p.data.n+'/'+CZ.hits,13,'#ffe08a');}
function braziers(e){const b=e.mb;b.braz=[];for(const [x,y] of ring(e,4,250,90,200,.2))b.braz.push(M.part(e,{x,y,hp:999999,r:20,h:48,name:'Brazier',th:'กระถางไฟ',kind:'braz',data:{n:0,lit:0,lt:0},draw:drawBrazier}));}
function lightUp(e,p){const b=e.mb,T=b.late?CZ.burn2:CZ.burn;p.data.lit=1;p.data.lt=T;p.gold=0;p.mark=0;p.data.n=0;puff(p.x,p.y,'#ffb040',20);M.say(p,'ไฟติด!','#ffd080',16);
  p.data.lr=M.prop(e,{kind:'lightring',x:p.x,y:p.y,layer:'ground',light:CZ.light,life:T,fadeT:.4,draw(q,x,y,t){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const A=ctx.globalAlpha,g=ctx.createRadialGradient(0,0,20,0,0,CZ.light);g.addColorStop(0,'rgba(255,190,90,.22)');g.addColorStop(1,'rgba(255,150,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,CZ.light,0,T2);ctx.fill();
    ctx.globalAlpha=A*.7;ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*20;ctx.lineWidth=2.5;ctx.strokeStyle='#ffc060';ctx.beginPath();ctx.arc(0,0,CZ.light,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}});
  const a=b.act;if(a&&a.dark&&b.braz.every(q=>q.data.lit)){a.win=1;a.T=a.t;}}
const inLight=(e,x,y)=>(e.mb.braz||[]).some(p=>p.data.lit&&Math.hypot(p.x-x,p.y-y)<CZ.light);
/* the swoop warning glows through the darkness: two red eyes + a red line */
class Swoop{constructor(o){Object.assign(this,{t:0},o);}drawS(S){const k=this.t;const [ex,ey]=S(this.x0,this.y0,60),[tx,ty]=S(this.x1,this.y1,30),pu=.6+.4*Math.sin(gameTime*20);
    ctx.save();if(this.st==='warn'){ctx.globalAlpha=.85;ctx.setLineDash([12,8]);ctx.lineDashOffset=-gameTime*80;ctx.lineWidth=4;ctx.strokeStyle='rgba(255,40,40,.85)';ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
      for(const s of [-1,1]){ctx.fillStyle=`rgba(255,40,30,${pu})`;ctx.shadowColor='#ff2020';ctx.shadowBlur=14;ctx.beginPath();ctx.ellipse(ex+s*9,ey,5,3.4,0,0,T2);ctx.fill();}}
    else if(this.st==='go'){const q=Math.min(1,this.g/.25),[hx,hy]=S(this.x0+(this.x1-this.x0)*q,this.y0+(this.y1-this.y0)*q,40);ctx.fillStyle='#14060c';ctx.strokeStyle='#ff4040';ctx.lineWidth=2;
      ctx.translate(hx,hy);ctx.beginPath();ctx.moveTo(-40,-6);ctx.quadraticCurveTo(-20,-24,0,-4);ctx.quadraticCurveTo(20,-24,40,-6);ctx.quadraticCurveTo(14,0,0,12);ctx.quadraticCurveTo(-14,0,-40,-6);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ff3030';ctx.beginPath();ctx.arc(-5,-2,2.4,0,T2);ctx.arc(5,-2,2.4,0,T2);ctx.fill();}
    ctx.restore();}}
function swoop(e,a,delay){const b=e.mb;if(inLight(e,player.x,player.y)){if(!a.toldL){a.toldL=1;M.say(player,'ในแสงไฟ มันโฉบไม่ได้','#ffd080',14);}return;}
  let x0,y0,k=0;do{const an=Math.random()*T2;x0=player.x+Math.cos(an)*270;y0=player.y+Math.sin(an)*270;}while(inLight(e,x0,y0)&&++k<8);
  const phi=Math.atan2(player.y-y0,player.x-x0),L=Math.hypot(player.x-x0,player.y-y0)+130,x1=x0+Math.cos(phi)*L,y1=y0+Math.sin(phi)*L;
  const f=new Swoop({x0,y0,x1,y1,st:'warn'});setFxTimer(delay||0,()=>{if(!e.mb||e.dead||!a.dark||b.act!==a)return;M.thru.push(f);
    setFxTimer(.8,()=>{if(!e.mb||e.dead){f.dead=1;return;}f.st='go';f.g=0;const t0=gameTime;const iv={update(){f.g=gameTime-t0;return f.g<.3;},draw(){},layer:'none'};addFx(iv);
      const c=Math.cos(phi),n=Math.sin(phi),dx=player.x-x0,dy=player.y-y0,u=dx*c+dy*n,v=Math.abs(-dx*n+dy*c);
      if(player.hp>0&&u>-20&&u<L+20&&v<40&&!inLight(e,player.x,player.y)){const h0=player.hp;if(M.hit(e,2.2,{})){b.drain=(b.drain||0)+(h0-player.hp);M.fail(e,'โดนโฉบในความมืด');}}
      setFxTimer(.32,()=>{f.dead=1;});});});}
class Bats{constructor(o){Object.assign(this,{t:0,layer:'sorted',tk:0},o);this.sy=this.y;this.b=[];for(let i=0;i<11;i++)this.b.push([rnd(0,T2),rnd(12,38),rnd(2,5),rnd(18,40)]);}
  update(dt){this.t+=dt;const e=this.e;if(!e.mb||e.dead)return false;let vx=player.x-this.x,vy=player.y-this.y,d=Math.hypot(vx,vy);
    if(d>1){const st=Math.min(d,CZ.batV*dt),nx=this.x+vx/d*st,ny=this.y+vy/d*st;if(!inLight(e,nx,ny)){this.x=nx;this.y=ny;}}this.sy=this.y;
    this.tk-=dt;if(this.tk<=0&&d<52&&player.hp>0&&!inLight(e,player.x,player.y)){this.tk=.5;if(M.hit(e,.3,{})){const sp=Math.min(player.mp,6);player.mp-=sp;if(sp>0)addFx(new DText({x:player.x,y:player.y,z:80,text:'−'+sp+' SP',color:'#b0a0ff',size:13,life:.8}));}}
    return this.t<CZ.batT;}
  draw(){const [x,y]=P(this.x,this.y,34),[gx,gy]=P(this.x,this.y),f=Math.min(1,this.t/.3,(CZ.batT-this.t)/.4);ctx.save();ctx.globalAlpha*=f;
    ctx.save();ctx.translate(gx,gy);ctx.scale(1,K);const A=ctx.globalAlpha;ctx.globalAlpha=A*.35;ctx.fillStyle='#7a2a8a';ctx.beginPath();ctx.arc(0,0,52,0,T2);ctx.fill();ctx.globalAlpha=A*.8;ctx.lineWidth=2;ctx.strokeStyle='#c070ff';ctx.setLineDash([7,6]);ctx.beginPath();ctx.arc(0,0,52,0,T2);ctx.stroke();ctx.restore();
    for(const [a,r,sp,z] of this.b){const an=a+this.t*sp,bx=x+Math.cos(an)*r,by=y+Math.sin(an)*r*.5-z*.3,fl=Math.abs(Math.sin(this.t*18+a*3)),s=1.7;ctx.fillStyle='#2a0e24';ctx.strokeStyle='#d08aff';ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-9*s,by-(5*fl+2)*s);ctx.lineTo(bx-4*s,by+1*s);ctx.lineTo(bx+4*s,by+1*s);ctx.lineTo(bx+9*s,by-(5*fl+2)*s);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#ff4040';ctx.fillRect(bx-2.4,by-1.5,2,2);ctx.fillRect(bx+.6,by-1.5,2,2);}ctx.restore();}}
function decap(e){const phi=M.angTo(e,player);pose(e,1);M.act(e,{name:'🗡 ฟันตัดคอ',T:1.15,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:165,phi,half:1},T:1,mul:2,boomKind:'quiet',onFire(){hitPose(e);if(typeof shake==='function')shake(2.5);}});}});}
function screech(e){pose(e,1);M.say(e,'กรี๊ดดด!','#d0a0ff',18);
  M.act(e,{name:'🔊 กรีดเสียงแหลม',T:1.15,start(e){M.strike(e,{shape:{k:'circle',x:e.x,y:e.y,r:CZ.screechR},T:1,col:'purple',noHit:1,boomKind:'quiet',
    onFire(h,w){hitPose(e);for(const r of [60,120,180])addFx(new GRing({x:e.x,y:e.y,r0:r-50,r1:r,w:6,color:'#c890ff',life:.4}));if(player.hp>0&&M.inShape(w.shape,player.x,player.y,8)){M.pc('silence',2);M.say(player,'เงียบ!','#c890ff',15);}}});}});}
function darkness(e){const b=e.mb;M.cancel(e);b.drain=0;M.pc('dark',CZ.dark+.6,{r:CZ.vis,col:'6,2,10',a:.94});M.say(e,'ซีบาลบา…','#ff6a6a',19);
  if(!b.seenDark){b.seenDark=1;M.banner('ความมืดซีบาลบา! จุดกระถางไฟ ◎ ทั้ง 4 (ตีใบละ 4 ที)','gold',2.8);}else M.banner('มืดอีกแล้ว! จุดกระถางไฟ ◎','gold',1.6);
  M.hint(e,'จุดกระถางไฟ ◎ ใบละ 4 ที — ในวงแสงมันโฉบไม่ได้ · ครบ 4 ใบ = มันร่วงลงมา · ตาแดง + เส้นแดง = ออกจากเส้น');
  M.act(e,{name:'🦇 ความมืดซีบาลบา',T:CZ.dark,unstop:1,dark:1,start(e,a){e.hidden=1;e.atk=0;a.sw=1.6;puff(e.x,e.y,'#3a1a2a',16);},
    step(e,a,dt){e.atk=0;a.sw-=dt;if(a.sw<=0){a.sw=CZ.gap;swoop(e,a,0);if(b.late)swoop(e,a,.55);}},
    end(e,a){e.hidden=0;M.PC.dark=null;delete player.buffs.mbDark;for(const f of M.thru)f.dead=1;
      if(a.win){M.say(e,'ร่วง!','#ffe08a',22);dustPuff(e.x,e.y,16,'#5a4a4a',140,16);M.window(e,5,'แสงไฟครบ! ร่วงลงมามึน');}
      else if(b.drain>0){const h=Math.round(b.drain);e.hp=Math.min(e.maxHp,e.hp+h);addFx(new DText({x:e.x,y:e.y,z:120,text:'+'+h.toLocaleString(),color:'#ff7a8a',size:18,life:1.3}));M.say(e,'ดื่มเลือด…','#ff7a8a',17);}
      b.drain=0;M.hint(e,'หลบวงแดง · ฝูงค้างคาว = เดินหนี / เข้าแสงไฟ · มืด = จุดกระถางไฟ ◎');},
    cancel(e,a){e.hidden=0;M.PC.dark=null;delete player.buffs.mbDark;for(const f of M.thru)f.dead=1;}});}
M.def('camazotz',{R:470,see:300,spd:64,reach:125,hpMul:1.3,enrage:360,minH:104,
  cry:'ซี่ดดด…',intro:'คามาซอตซ์ — ตอนมืด จุดกระถางไฟ ◎ ทั้ง 4 (ตีใบละ 4 ที) มันจะร่วงลงมา',
  cd0:{decap:2,bats:6,screech:10,dark:12},phases:[.7,.4,.35],
  setup(e,b){braziers(e);b.drain=0;b.late=0;b.darkPh=1;M.hint(e,'หลบวงแดง · ฝูงค้างคาว = เดินหนี / เข้าแสงไฟ · มืด = จุดกระถางไฟ ◎');},
  phase(e,ph){const b=e.mb;if(ph>=4&&!b.late){b.late=1;M.banner('กระถางไฟดับเร็วขึ้น · โฉบทีละ 2','red',2.2);}const dp=Math.min(ph,3);if((b.darkPh||1)<dp){b.darkPh=dp;M.cd(e,'dark',35);darkness(e);}},
  tick(e,dt){const b=e.mb;for(const p of b.braz||[])if(p.data.lit){p.data.lt-=dt;if(p.data.lt<=0){p.data.lit=0;p.gold=undefined;p.mark=undefined;if(p.data.lr)p.data.lr.dead=1;M.say(p,'ไฟดับ','#a08070',13);}}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'dark')){M.cd(e,'dark',35);darkness(e);return true;}
    if(M.ready(e,'bats')&&L<520){M.cd(e,'bats',12);addFx(new Bats({e,x:e.x,y:e.y}));M.say(e,'บริวาร!','#d0a0ff',16);if(!b.seenBats){b.seenBats=1;M.banner('ฝูงค้างคาวดูด SP! เดินหนี หรือเข้าแสงไฟ','gold',2);}}
    if(M.ready(e,'screech')&&L<CZ.screechR+20){M.cd(e,'screech',15);screech(e);return true;}
    if(M.ready(e,'decap')&&L<175){M.cd(e,'decap',5);decap(e);return true;}
    return false;},
  partHurt(e,p){if(p.pkind!=='braz'||p.data.lit)return;p.hp=p.maxHp;p.data.n++;puff(p.x,p.y,'#ffb040',5,80);if(p.data.n>=CZ.hits)lightUp(e,p);},
  reset(e){e.hidden=0;}});
})();
