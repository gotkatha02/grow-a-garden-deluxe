/* =====================================================================
   JAPAN MAP BOSSES (MAP_BOSS_MECHANICS_TH.md §8) — scripts for map_boss_kit.js.
   · Jorogumo (jpnH1 · Lv 37): leg stabs (2 circles) · web shot (3-line fan: web 1 stack, 3 stacks = cocoon 3 s) ·
       paper parasol 3 s (ranged hits from the front bounce back) ·
       NEST (every 30 s + at 60 / 30 %): she leaps up into the web between 4 tall trees (can't be hit) and shoots web circles
       for 12 s; 3 paper lanterns (gold) on the ground have threads up to her — break one (5 hits, 1 burning hit) → fire runs up
       the thread → she falls burning = 5 s window; too slow → she drops on you ×2.5 + cocoon. Phase < 30 %: 4 spider eggs (gold) hatch.
   · Gashadokuro (jpnH2 · Lv 44): a giant skeleton half out of a bone pile, never moves · its head is out of reach (immune) ·
       2 hands (gold, Lv × 45 HP): palm slap (circle, the hand then lies flat 2 s) · sweep (half donut 120–330: step IN) ·
       ghost fire (3 lines, magic, burn) · bone soldiers · GRAB ('krok… krok…'): caught = held at its mouth 3 s, hit the hand for
       Lv × 10 or be bitten ×3. A broken hand is a bone pile for 20 s; BOTH hands broken = the skull slams down 8 s (window).
       Phase < 35 %: regrown hands wear bone armour, soldiers come 5 at a time.
   · Jonin Shadow tanuki (jpnD1b · Lv 49): triple kunai fan · bouncing shuriken (path shown) · iai dash · high FLEE ·
       LEAF DISGUISE (every 25 s): smoke fills the room (sight 220) and he becomes one of the 6 room pieces (gold while it lasts);
       a kunai flies from the REAL piece every 1.5 s and leaves a light trail back to it; hit the right piece = 'found!' 4 s window,
       a wrong one puffs smoke (slow 2 s); not found in 8 s = assassination from behind (red circle, ×3).
       Phase < 40 %: an explosive barrel hides among the pieces.
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
/* an add: a monster of this map (or a def from another map, at this map's level) */
function add(e,re,x,y,o,src){const L=(window.VK_MONS||{})[src||e.mboss]||[];let d=L.find(q=>re.test(q.name))||(src?null:L[0]);if(!d||typeof vkMake!=='function')return null;
  if(src){const L0=((window.VK_MONS||{})[e.mboss]||[])[0];if(L0)d=Object.assign({},d,{lv:L0.lv.slice()});}
  if(!free(x,y)){x=e.x;y=e.y;}const m=vkMake(d,x,y);if(!enemies.includes(m))enemies.push(m);m.summon=1;m.mbOf=e;m.aggro=8;if(o)Object.assign(m,o);return m;}
const addsOf=(e,f)=>enemies.filter(o=>o.mbOf===e&&!o.dead&&o[f]).length;
function puff(x,y,col,n,sp){for(let i=0;i<(n||14);i++){const a=Math.random()*T2,s=rnd(40,sp||160);emit({type:'ember',x,y,z:rnd(10,60),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(30,120),drag:1.6,life:rnd(.5,.9),size:rnd(2.4,4),size1:1.2,color:col});}}
function smoke(x,y,n,r){for(let i=0;i<(n||10);i++){const a=Math.random()*T2,d=rnd(0,r||40);emit({type:'mist',x:x+Math.cos(a)*d,y:y+Math.sin(a)*d*.7,z:rnd(4,40),vx:Math.cos(a)*rnd(20,70),vy:Math.sin(a)*rnd(10,40),vz:rnd(6,24),life:rnd(.9,1.5),size:rnd(14,22),size1:rnd(30,44),color:Math.random()<.5?'#cfcad8':'#9a94a8'});}}
const burning=e=>!!((e._gBurn&&e._gBurn.n>0)||(e._gFlat&&e._gFlat.n>0)||(e.st&&e.st.burn>0));
const ease=k=>1-Math.pow(1-Math.max(0,Math.min(1,k)),3);

/* ================= Jorogumo ================= */
const JO={stabR:52,webL:380,webW:40,umbT:3,nestT:12,nestZ:210,lanHits:5,dropR:130,eggT:10};
/* web stacks on the hero: 3 = a silk cocoon (root 3 s, walking / attacking breaks it faster) */
function webStack(e,n){const b=player.buffs.mbWeb,c=(b&&b.t>0?(b.n||0):0)+(n||1);
  if(c>=3){delete player.buffs.mbWeb;cocoon(e);return;}M.buff('mbWeb',6,c+'/3');player.buffs.mbWeb.n=c;M.buff('dbSlow',2);}
function cocoon(e){M.pc('root',3,{web:1});M.say(player,'รังไหม!','#f0f0ff',16);addFx(new Cocoon({}));}
class Cocoon{constructor(o){Object.assign(this,{t:0,layer:'sorted'},o);this.sy=player.y+2;}update(dt){this.t+=dt;this.sy=player.y+2;return M.PC.root>0&&M.PC.rootWeb&&player.hp>0;}
  draw(){const [x,y]=P(player.x,player.y),k=Math.min(1,this.t/.25);ctx.save();ctx.globalAlpha=.88*k;G.ell(x,y-34,24,40,'rgba(244,244,252,.9)','#8a8aa0',2.4);
    ctx.strokeStyle='rgba(150,150,175,.9)';ctx.lineWidth=1.4;for(let i=0;i<7;i++){const yy=y-66+i*9;ctx.beginPath();ctx.moveTo(x-20,yy+Math.sin(i)*3);ctx.quadraticCurveTo(x,yy+7,x+20,yy-Math.sin(i)*3);ctx.stroke();}
    ctx.restore();G.text(x,y-84,'กดเดินรัวๆ ให้หลุด',11,'#e8e8ff');}}
function trees(e){const b=e.mb,got=[];b.tops=[];for(let i=0;i<4;i++){let [x,y]=openSpot(b.home.x,b.home.y,Math.PI/4+i*T2/4,330,90);if(got.some(g=>Math.hypot(g[0]-x,g[1]-y)<200))[x,y]=spot(b.home.x,b.home.y,Math.PI/4+i*T2/4,320);got.push([x,y]);b.tops.push([x,y]);
  M.prop(e,{kind:'tree',x,y,r:24,solid:1,layer:'sorted',draw(q,x,y){G.shadow(x,y+3,34,.35);G.poly([[x-16,y],[x-12,y-150],[x-6,y-235],[x+6,y-235],[x+12,y-150],[x+17,y]],'#3a2a30','#140a10',3);
    ctx.strokeStyle='rgba(90,70,80,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-4,y-20);ctx.lineTo(x-2,y-140);ctx.moveTo(x+5,y-60);ctx.lineTo(x+3,y-200);ctx.stroke();
    for(const [dx,dy,r] of [[-26,-236,26],[20,-244,24],[0,-262,26],[-10,-214,20],[16,-218,20]])G.ell(x+dx,y+dy,r,r*.7,'#2a3a3a','#101818',2);}});}
  /* the silk canopy between the tree tops */
  M.prop(e,{kind:'canopy',x:b.home.x,y:b.home.y+400,layer:'top',draw(q){const T=b.tops.map(([x,y])=>P(x,y,232)),[cx,cy]=P(b.home.x,b.home.y,JO.nestZ+30);
    ctx.save();ctx.globalAlpha*=.5;ctx.strokeStyle='#e8e8f6';ctx.lineWidth=1.6;for(let i=0;i<T.length;i++){const a=T[i],c=T[(i+1)%T.length];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo((a[0]+c[0])/2,(a[1]+c[1])/2+30,c[0],c[1]);ctx.stroke();
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo((a[0]+cx)/2,(a[1]+cy)/2+20,cx,cy);ctx.stroke();}
    for(const r of [30,60,95]){ctx.beginPath();ctx.ellipse(cx,cy,r,r*.45,0,0,T2);ctx.stroke();}ctx.restore();}});}
function stab(e){const phi=M.angTo(e,player),x=player.x,y=player.y;pose(e,.7);
  M.act(e,{T:1,start(e){M.strike(e,{shape:{k:'circle',x,y,r:JO.stabR},T:.7,mul:.9,boomKind:'quiet',onFire(){hitPose(e);}});
    M.strike(e,{shape:{k:'circle',x:x+Math.cos(phi)*JO.stabR*1.6,y:y+Math.sin(phi)*JO.stabR*1.6,r:JO.stabR},T:.85,mul:.9,boomKind:'quiet'});}});}
function webShot(e){const phi=M.angTo(e,player);pose(e,.8);
  M.act(e,{name:'🕸 ยิงใย',T:.95,start(e){for(const d of [-.3,0,.3])M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi:phi+d,len:JO.webL,w:JO.webW,off:20},T:.8,mul:.6,boomKind:'quiet',
      onFire(hit){hitPose(e);if(hit)webStack(e,1);for(let i=0;i<8;i++){const r=rnd(40,JO.webL);emit({type:'ember',x:e.x+Math.cos(phi+d)*r,y:e.y+Math.sin(phi+d)*r,z:rnd(10,30),vx:rnd(-20,20),vy:rnd(-20,20),vz:rnd(10,40),drag:2,life:.6,size:2.4,size1:1,color:'#f4f4ff'});}}});}});}
/* the paper parasol: ranged hits from in front bounce back */
class Parasol{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;const b=this.e.mb;return !this.e.dead&&b&&b.umb>0;}
  draw(){const e=this.e,b=e.mb,a=b.umbA,ox=Math.cos(a)*44,oy=Math.sin(a)*44,[x,y]=P(e.x+ox,e.y+oy,56),k=ease(this.t/.25),R=46*k,sq=.35+.65*Math.abs(Math.sin(a));
    ctx.save();ctx.translate(x,y);ctx.globalAlpha*=.82;ctx.scale(Math.max(.3,Math.abs(Math.cos(a)))*.4+.6,1);G.ell(0,0,R,R*sq,'#c8283a','#3a0a10',3);
    ctx.strokeStyle='rgba(255,220,200,.75)';ctx.lineWidth=1.6;for(let i=0;i<10;i++){const an=i/10*T2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*R,Math.sin(an)*R*sq);ctx.stroke();}
    G.ell(0,0,R*.55,R*.55*sq,null,'#ffe0b0',2);G.ell(0,0,5,5*sq,'#3a0a10');ctx.restore();}}
function parasol(e){const b=e.mb;b.umb=JO.umbT;b.umbA=M.angTo(e,player);addFx(new Parasol({e}));M.say(e,'กางร่ม','#ffb0b8',16);
  if(!b.seenUmb){b.seenUmb=1;M.banner('ร่มกาง! ยิงจากด้านหน้าจะเด้งกลับ — อ้อมข้าง','gold',2);}}
/* the nest: lanterns (gold) with threads up to her */
function drawLantern(p,x,y,t,al){const n=p.data.n||0,glow=.55+.15*Math.sin(t*5+p.data.i);G.shadow(x,y+2,16,.3);
  ctx.fillStyle='#3a2a20';ctx.fillRect(x-2,y-14,4,14);G.ell(x,y-34,15,21,'#f0e0c0','#5a3020',2.4);ctx.strokeStyle='rgba(120,60,30,.6)';ctx.lineWidth=1.2;for(const dy of [-46,-40,-34,-28,-22]){ctx.beginPath();ctx.ellipse(x,y+dy+0,14*Math.sqrt(Math.max(0,1-Math.pow((dy+34)/21,2))),1.8,0,0,T2);ctx.stroke();}
  ctx.fillStyle='#2a1a10';ctx.fillRect(x-9,y-57,18,4);ctx.fillRect(x-9,y-15,18,4);G.glow(x,y-34,40,'#ffb050',glow);
  if(n>0)G.text(x,y-66,(JO.lanHits-n)+'',13,'#ffe08a');}
function lanterns(e,a){const b=e.mb,L=[];for(let i=0;i<3;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/3+Math.random()*.8,rnd(170,280));
    L.push(M.part(e,{x,y,hp:999999,r:16,h:62,name:'Paper Lantern',th:'โคมไฟกระดาษ',kind:'lantern',data:{i,n:0},draw:drawLantern,
      onBreak(p){puff(p.x,p.y,'#ffb050',16);if(a.cur===a&&!a.fire&&e.mb&&e.mb.act===a)fireUp(e,a,p);}}));}
  return L;}
class Threads{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return !this.dead&&!this.e.dead;}
  draw(){const e=this.e,a=this.a,[hx,hy]=P(e.x,e.y,(e.mbLift||0)+40);ctx.save();ctx.lineWidth=1.6;
    for(const p of a.lan||[]){if(p.dead)continue;const [x,y]=P(p.x,p.y,58);ctx.strokeStyle='rgba(236,236,250,.75)';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+hx)/2+12,(y+hy)/2,hx,hy);ctx.stroke();}
    if(a.fire){const f=a.fire,k=Math.min(1,f.t/.5),[x,y]=P(f.x,f.y,58),px=x+(hx-x)*k,py=y+(hy-y)*k;ctx.strokeStyle='rgba(255,140,40,.9)';ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(px,py);ctx.stroke();G.glow(px,py,26,'#ff9a3a',.7);}
    ctx.restore();}}
function fireUp(e,a,p){a.fire={x:p.x,y:p.y,t:0};M.say(p,'ไฟลามขึ้นใย!','#ffb050',17);for(const q of a.lan)if(q!==p&&!q.dead){q.onBreak=null;M.breakPart(q);}}
function nest(e){const b=e.mb;M.cancel(e);M.say(e,'ขึ้นรัง…','#e8e8ff',18);
  if(!b.seenNest){b.seenNest=1;M.banner('ขึ้นรัง! ทุบโคมไฟ ◎ ให้ไฟลามขึ้นใย','gold',2.6);}else M.banner('ขึ้นรัง! ทุบโคมไฟ ◎','gold',1.6);
  M.hint(e,'โคมไฟ ◎ — ตี 5 ครั้ง (ฮิตไฟทีเดียวแตก) ไฟจะลามขึ้นใยไปเผาเธอ · ไม่ทันใน 12 วิ เธอทิ้งตัวลงมา');
  const sx=e.x,sy=e.y,c=b.home;
  M.act(e,{name:'🕸 ขึ้นรัง — ทุบโคมไฟ',T:JO.nestT+1.4,unstop:1,nest:1,
    start(e,a){a.cur=a;e.atk=0;e.mbImmune=1;e.mbImmuneTxt='อยู่บนรัง — ทุบโคมไฟ ◎';a.lan=lanterns(e,a);a.th=addFx(new Threads({e,a}));a.shot=1.4;b.umb=0;},
    step(e,a,dt){e.atk=0;const up=ease(a.t/.6);
      if(a.fire){a.fire.t+=dt;if(a.fire.t>=.5){a.fall=(a.fall||0)+dt;e.mbLift=JO.nestZ*Math.max(0,1-a.fall/.3);if(a.fall>=.3&&!a.down){a.down=1;e.mbLift=0;e.mbImmune=0;puff(e.x,e.y,'#ff8a3a',22);
          dustPuff(e.x,e.y,16,'#6a5a5a',140,16);if(typeof shake==='function')shake(4);a.T=a.t+.05;a.win=1;}}return;}
      if(!a.drop){e.mbLift=JO.nestZ*up;e.x=sx+(c.x-sx)*up;e.y=sy+(c.y-sy)*up;}
      a.shot-=dt;if(a.t>1&&a.t<JO.nestT&&!a.drop&&a.shot<=0){a.shot=1.5;const x=player.x,y=player.y;M.strike(e,{shape:{k:'circle',x,y,r:70},T:1,mul:.8,boomKind:'quiet',onFire(hit){if(hit)webStack(e,1);puff(x,y,'#f4f4ff',10,90);}});}
      if(a.t>=JO.nestT&&!a.drop){a.drop=1;const x=player.x,y=player.y;Object.assign(a,{tx:x,ty:y,x2:e.x,y2:e.y});M.say(e,'ทิ้งตัว!','#ff8aa0',19);
        M.strike(e,{shape:{k:'circle',x,y,r:JO.dropR},T:1.2,mul:2.5,boomCol:'#e8e8ff',onFire(hit){e.x=x;e.y=y;e.mbLift=0;e.mbImmune=0;hitPose(e);dustPuff(x,y,18,'#8a7a7a',150,16);if(typeof shake==='function')shake(5);
          if(hit){cocoon(e);M.fail(e,'โดนทิ้งตัวจากรัง');}}});}
      if(a.drop&&e.mbLift>0){const k=Math.min(1,Math.max(0,a.t-JO.nestT-.9)/.3);e.mbLift=JO.nestZ*(1-k);e.x=a.x2+(a.tx-a.x2)*k;e.y=a.y2+(a.ty-a.y2)*k;}},
    end(e,a){clean(e,a);if(a.win){M.say(e,'ไฟลุก!','#ff9a3a',21);M.window(e,5,'ตกลงมาไฟลุก!');addFx(new Burn({e}));}
      M.hint(e,'หลบวงแดง · ยิงใย 3 ชั้น = รังไหม · ร่มกาง = อ้อมข้าง · ขึ้นรัง = ทุบโคมไฟ ◎');},
    cancel(e,a){clean(e,a);}});}
function clean(e,a){e.mbImmune=0;e.mbLift=0;if(a.th)a.th.dead=1;for(const p of a.lan||[])if(!p.dead){p.onBreak=null;M.breakPart(p);}}
class Burn{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;const b=this.e.mb;return !this.e.dead&&b&&b.win>0;}
  draw(){const e=this.e;if(Math.random()<.5)emit({type:'ember',x:e.x+rnd(-26,26),y:e.y+rnd(-10,10),z:rnd(10,80),vx:rnd(-20,20),vy:rnd(-10,10),vz:rnd(60,140),drag:1,life:.7,size:rnd(3,5),size1:.6,color:Math.random()<.6?'#ff9a3a':'#ffe08a'});}}
/* phase 2: spider eggs */
function eggs(e){const b=e.mb;for(let i=0;i<4;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/4+.6,rnd(160,250));
  M.part(e,{x,y,hp:Math.round(lv(e)*10),r:16,h:34,name:'Spider Egg',th:'ไข่แมงมุม',kind:'egg',data:{t:JO.eggT},
    draw(p,x,y,t){const k=1-p.data.t/JO.eggT,w=1+Math.sin(t*(4+k*14))*.04*(1+k*3);G.shadow(x,y+2,18,.3);G.ell(x,y-15,15*w,17/w,'#f2ecdc','#6a5a4a',2.4);G.ell(x-4,y-20,4,6,'rgba(255,255,255,.6)');
      if(k>.5){ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-6,y-24);ctx.lineTo(x,y-16);ctx.lineTo(x+5,y-22);ctx.stroke();}G.text(x,y-40,Math.ceil(p.data.t)+'',12,'#ffe08a');},
    onBreak(p){puff(p.x,p.y,'#f2ecdc',12);}});}
  M.banner('ไข่แมงมุม ◎ ฟักใน 10 วิ!','red',2);}
M.def('jorogumo',{R:560,see:330,spd:60,reach:120,hpMul:1.25,enrage:300,minH:96,
  cry:'มาเถอะ… ใยข้านุ่มนะ',intro:'โจโรกุโมะ — ตอนขึ้นรัง ทุบโคมไฟ ◎ ให้ไฟลามขึ้นใยไปเผาเธอ',
  cd0:{stab:1.5,web:4,umb:10,nest:12},phases:[.6,.3],
  setup(e,b){trees(e);b.umb=0;M.hint(e,'หลบวงแดง · ยิงใย 3 ชั้น = รังไหม · ร่มกาง = อ้อมข้าง · ขึ้นรัง = ทุบโคมไฟ ◎');},
  phase(e,ph){M.cd(e,'nest',30);if(ph>=3){eggs(e);M.cd(e,'eggs',40);}nest(e);},
  tick(e,dt){const b=e.mb;if(b.umb>0)b.umb-=dt;
    for(const p of M.parts(e,'egg')){p.data.t-=dt;if(p.data.t<=0){p.onBreak=null;M.breakPart(p);puff(p.x,p.y,'#f2ecdc',14);for(let i=0;i<3;i++){if(addsOf(e,'mbSp')>=10)break;const m=add(e,/Cave Spider/,p.x+rnd(-20,20),p.y+rnd(-14,14),{mbSp:1},'aztD1a');if(m)m.aggro=20;}}}
    if(b.phase>=3&&M.ready(e,'eggs')){M.cd(e,'eggs',40);eggs(e);}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'nest')){M.cd(e,'nest',30);nest(e);return true;}
    if(M.ready(e,'umb')&&L<420){M.cd(e,'umb',15);parasol(e);}
    if(M.ready(e,'web')&&L<400){M.cd(e,'web',7);webShot(e);return true;}
    if(M.ready(e,'stab')&&L<150){M.cd(e,'stab',3);stab(e);return true;}
    return false;},
  partHurt(e,p){if(p.pkind!=='lantern')return;p.data.n=burning(p)?JO.lanHits:(p.data.n||0)+1;p.hp=Math.max(1,Math.round(p.maxHp*(1-p.data.n/JO.lanHits)));if(p.data.n>=JO.lanHits)M.breakPart(p);},
  hurt(e,mult,o){const b=e.mb;if(!(b.umb>0))return null;const d=M.dP(e);if(d<150||Math.abs(angDiff(M.angTo(e,player),b.umbA))>1.15)return null;
    return {block:1,txt:'ร่มสะท้อน!',onBlock(){if(gameTime-(b.refT||0)<.45)return;b.refT=gameTime;M.hit(e,.5,{magic:1});const [x,y]=[player.x,player.y];addFx(new GRing({x,y,r0:4,r1:40,w:5,color:'#ff8090',life:.3}));}};},
  reset(e){e.mbImmune=0;e.mbLift=0;}});

/* ================= Gashadokuro ================= */
const GA={hand:45,slapR:100,flat:2,sw0:120,sw1:330,regrow:20,win:8,lift:34,reach:430};
function handRest(e,s){const b=e.mb;return [b.home.x+(s==='L'?-150:150),b.home.y+34];}
function drawHand(p,x,y,t){const s=p.data.s==='L'?-1:1,z=p.data.z||0,ar=p.data.arm;G.shadow(x,y+2,40*(1-Math.min(.6,z/200)),.32);
  ctx.save();ctx.translate(x,y-z-18);ctx.scale(s,1);if(p.data.st==='grab')ctx.rotate(-.5);
  G.glow(0,-6,52,'#5fc8ff',.22+.08*Math.sin(t*4));
  G.poly([[-30,8],[-34,-10],[-20,-26],[10,-28],[30,-14],[30,10],[0,16]],ar?'#d8ccb0':'#ece4d0','#3a3428',3);   // palm
  for(let i=0;i<4;i++){const fx=-22+i*15,ln=26+((i===1||i===2)?8:0);ctx.strokeStyle='#3a3428';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(fx,-22);ctx.lineTo(fx-4,-22-ln);ctx.stroke();ctx.strokeStyle=ar?'#d8ccb0':'#f4ecd8';ctx.lineWidth=6;ctx.stroke();
    ctx.fillStyle='#3a3428';ctx.beginPath();ctx.arc(fx-2,-22-ln*.5,2,0,T2);ctx.fill();}
  ctx.strokeStyle='#3a3428';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(28,-4);ctx.lineTo(46,-18);ctx.stroke();ctx.strokeStyle='#f4ecd8';ctx.lineWidth=6;ctx.stroke();
  if(ar){ctx.fillStyle='rgba(120,100,70,.55)';for(const [dx,dy] of [[-14,-8],[4,-12],[18,2]]){ctx.beginPath();ctx.ellipse(dx,dy,7,4,.3,0,T2);ctx.fill();}}
  ctx.restore();}
function mkHand(e,s){const b=e.mb,[x,y]=handRest(e,s),ar=b.phase>=2;
  const p=M.part(e,{x,y,hp:Math.round(lv(e)*GA.hand*(ar?1.6:1)),r:30,h:58,name:'Bone Hand',th:'มือกระดูก',kind:'hand',fixed:0,ring:36,data:{s,z:0,st:'rest',arm:ar},draw:drawHand,
    onBreak(p){handBroke(e,p);}});b.hands[s]=p;return p;}
function handBroke(e,p){const b=e.mb,s=p.data.s;b.hands[s]=null;b.regrow[s]=GA.regrow;
  for(let i=0;i<18;i++)emit({type:'ember',x:p.x+rnd(-14,14),y:p.y+rnd(-8,8),z:rnd(10,50),vx:rnd(-170,170),vy:rnd(-110,110),vz:rnd(80,220),drag:1.4,grav:520,life:rnd(.5,.9),size:rnd(2.4,4),size1:.8,color:Math.random()<.6?'#ece4d0':'#5fc8ff'});
  M.say(p,'มือแตก!','#ffe08a',17);if(typeof shake==='function')shake(3);
  const [x,y]=handRest(e,s);M.prop(e,{kind:'bones',x,y,layer:'ground',side:s,draw(q,x,y){for(let i=0;i<9;i++){const a=i*1.7,r=6+i*3;G.ell(x+Math.cos(a)*r,y+Math.sin(a)*r*.5,9,3,'#e4dcc8','#4a4030',1.4);}}});
  if(!b.hands.L&&!b.hands.R){skullDown(e);return;}M.hint(e,'มือแตกแล้วข้างหนึ่ง — ทุบอีกข้างให้แตกใน 20 วิ หัวจะฟาดลงมา');}
function skullDown(e){const b=e.mb;M.cancel(e);b.down=1;e.mbImmune=0;M.hint(e,'หัวกะโหลกฟาดพื้น — ตีหัวได้ 8 วิ!');M.say(e,'หัวกะโหลกฟาดพื้น!','#ffe08a',22);M.window(e,GA.win,'หัวกะโหลกฟาดพื้น!');dustPuff(e.x,e.y,22,'#cfc8b4',170,18);if(typeof shake==='function')shake(6);}
function slap(e){const b=e.mb;let s=b.hs==='L'?'R':'L';if(!b.hands[s])s=s==='L'?'R':'L';const p=b.hands[s];if(!p)return false;b.hs=s;const x=player.x,y=player.y;pose(e,1.2);
  M.act(e,{name:'✋ ฝ่ามือตบ',T:1.35,start(e,a){p.data.st='raise';p.data.go=[x,y];M.strike(e,{shape:{k:'circle',x,y,r:GA.slapR},T:1.2,mul:1.8,boomCol:'#cfe8ff',
    onFire(){hitPose(e);if(p.dead)return;p.x=x;p.y=y;p.data.z=0;p.data.st='flat';p.data.flat=GA.flat;dustPuff(x,y,14,'#cfc8b4',120,14);if(typeof shake==='function')shake(3);}});}});return true;}
function sweep(e){const b=e.mb,p=b.hands.L||b.hands.R;if(!p)return false;const phi=M.angTo(e,player);pose(e,1.4);
  if(!b.seenSw){b.seenSw=1;M.banner('กวาดมือ! วิ่งเข้าใกล้กองกระดูก ไม่ใช่วิ่งหนี','blue',2.2);}
  M.act(e,{name:'🦴 กวาดมือ',T:1.55,start(e){M.safe({k:'circle',x:e.x,y:e.y,r:GA.sw0-12},1.5);M.strike(e,{shape:{k:'donut',x:e.x,y:e.y,r0:GA.sw0,r1:GA.sw1,a0:phi-Math.PI/2,a1:phi+Math.PI/2},T:1.4,mul:2,push:160,boomKind:'quiet',
    onFire(){hitPose(e);for(let i=0;i<16;i++){const a=phi-Math.PI/2+i/15*Math.PI,r=rnd(GA.sw0,GA.sw1);dustPuff(e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,1,'#cfc8b4',80,10);}if(typeof shake==='function')shake(3);}});}});return true;}
function ghostFire(e){const phi=M.angTo(e,player);pose(e,1);
  M.act(e,{name:'👻 ไฟผี',T:1.15,start(e){for(const d of [-.5,0,.5])M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi:phi+d,len:460,w:54,off:40},T:1,mul:1,magic:1,dot:['mbBurn',4,.8],boomKind:'quiet',
    onFire(){hitPose(e);for(let i=0;i<12;i++){const r=rnd(60,460);emit({type:'ember',x:e.x+Math.cos(phi+d)*r,y:e.y+Math.sin(phi+d)*r,z:rnd(2,20),vx:rnd(-20,20),vy:rnd(-10,10),vz:rnd(100,200),drag:1.2,life:rnd(.6,1),size:rnd(3,5),size1:.8,color:Math.random()<.6?'#5fc8ff':'#e8f8ff'});}}});}});}
function grab(e){const b=e.mb,s=b.hands.L&&b.hands.R?(player.x<e.x?'L':'R'):(b.hands.L?'L':'R'),p=b.hands[s];if(!p)return false;
  M.say(e,'กร๊อบ… กร๊อบ…','#e8e0c8',18);if(!b.seenGrab){b.seenGrab=1;M.banner('มือจะคว้า! หลบเส้น — ถ้าโดนคว้า ทุบมือนั้นให้หลุด','gold',2.4);}
  M.act(e,{name:'🦴 คว้า',T:1.9,start(e,a){a.p=p;},
    step(e,a){if(a.w||a.t<.5||p.dead)return;const phi=Math.atan2(player.y-p.y,player.x-p.x),L=Math.min(GA.reach,Math.hypot(player.x-p.x,player.y-p.y)+50);
      a.w=M.strike(e,{shape:{k:'rect',x:p.x,y:p.y,phi,len:L,w:64,off:0},T:1.2,noHit:1,boomKind:'quiet',onFire(h,w){hitPose(e);if(p.dead||player.hp<=0)return;
        if(M.inShape(w.shape,player.x,player.y,8))caught(e,p);}});}});return true;}
function caught(e,p){const b=e.mb,need=Math.round(lv(e)*10),hp0=p.hp;p.data.st='grab';M.say(player,'ถูกคว้า!','#ff9a7a',16);M.banner(`ถูกคว้า! ทุบมือให้ได้ ${need.toLocaleString()} ก่อนโดนกัด`,'red',2);
  const mx=e.x+(p.data.s==='L'?-36:36),my=e.y+24;
  M.pc('grab',3,{part:p,pos:()=>[mx,my+6],free:()=>p.dead||hp0-p.hp>=need,
    end(timeout){if(!p.dead){p.data.st='back';}if(timeout&&player.hp>0){M.say(e,'กัด!','#ff6a5a',21);M.hit(e,3,{});M.fail(e,'โดนกัด');}else M.say(player,'หลุด!','#bfe6ff',16);}});
  p.data.st='grab';p.data.hold=[mx+(p.data.s==='L'?-26:26),my+10];}
M.def('gashadokuro',{R:560,see:340,spd:0,reach:0,hpMul:1.25,enrage:300,minH:130,
  cry:'กร๊อบ… กร๊อบ… กร๊อบ…',intro:'กาชาโดคุโระ — หัวอยู่สูง ตีไม่ถึง: ทุบมือ ◎ ให้แตกทั้ง 2 ข้าง หัวจะฟาดลงมา',
  cd0:{slap:2,sweep:8,fire:5,sold:6,grab:11},phases:[.35],
  setup(e,b){Object.assign(b,{hands:{},regrow:{},hs:'R',down:0});e.mbImmune=1;e.mbImmuneTxt='หัวอยู่สูง — ทุบมือ ◎';e.mbLift=GA.lift;e.mbTilt=0;
    M.prop(e,{kind:'pile',x:e.x,y:e.y,layer:'sorted',sortOff:14,draw(q,x,y,t){const down=e.mb&&e.mb.down;
      /* a mound of bones in front of the body: it hides the legs, so the skeleton looks half out of the pile */
      {const g=ctx.createLinearGradient(0,y-52,0,y+10);g.addColorStop(0,'#e2d8bc');g.addColorStop(1,'#9c9074');ctx.beginPath();ctx.moveTo(x-96,y+10);ctx.quadraticCurveTo(x-64,y-50,x,y-54);ctx.quadraticCurveTo(x+64,y-50,x+96,y+10);ctx.closePath();
        ctx.fillStyle=g;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#4a4030';ctx.stroke();G.glow(x,y-16,70,'#5fc8ff',.12+.05*Math.sin(t*2));}
      for(let i=0;i<34;i++){const a=i*2.39,k=(i%11)/10,bx=x+Math.cos(a)*(16+k*70),by=y+4-Math.abs(Math.sin(a))*0-(1-k)*38-((i*7)%9);
        G.ell(bx,by,12,4,'#ece4d0','#4a4030',1.5);if(i%6===0){G.ell(bx+4,by-6,7,6,'#f2ecdc','#4a4030',1.5);G.ell(bx+2,by-6,1.6,1.8,'#2a2018');G.ell(bx+6,by-6,1.6,1.8,'#2a2018');}}
      if(down)G.ell(x,y-20,60,14,'rgba(255,220,120,.18)');
      if(Math.random()<.12)emit({type:'ember',x:q.x+rnd(-60,60),y:q.y+rnd(-10,14),z:rnd(4,20),vz:rnd(20,50),drag:1,life:1,size:2.6,size1:.6,color:'#5fc8ff'});}});
    for(const s of ['L','R'])mkHand(e,s);
    M.hint(e,'หัวอยู่สูง ตีไม่ถึง — ทุบมือ ◎ ทั้ง 2 ข้าง · กวาดมือ = วิ่งเข้าใกล้กองกระดูก');},
  phase(e){M.banner('มือที่งอกใหม่มีเกราะกระดูก · ทหารกระดูกมาทีละ 5','red',2.2);},
  tick(e,dt){const b=e.mb;
    if(!b.down&&e.mbLift<GA.lift)e.mbLift=Math.min(GA.lift,e.mbLift+dt*60);if(!b.down&&e.mbTilt){const sg=Math.sign(e.mbTilt);e.mbTilt=sg*Math.max(0,Math.abs(e.mbTilt)-dt);}
    for(const s of ['L','R']){if(b.regrow[s]>0){b.regrow[s]-=dt;if(b.regrow[s]<=0){b.regrow[s]=0;for(const q of M.props(e,'bones'))if(q.side===s)q.dead=1;mkHand(e,s);M.say(e,'มืองอกใหม่','#cfe8ff',16);}}
      const p=b.hands[s];if(!p||p.dead)continue;const [rx,ry]=handRest(e,s),d=p.data;
      if(d.st==='raise'&&d.go){p.x+=(d.go[0]-p.x)*Math.min(1,dt*6);p.y+=(d.go[1]-p.y)*Math.min(1,dt*6);d.z=Math.min(90,d.z+dt*200);}
      else if(d.st==='flat'){d.flat-=dt;if(d.flat<=0)d.st='back';}
      else if(d.st==='grab'){if(d.hold){p.x=d.hold[0];p.y=d.hold[1];}d.z=40;if(!M.PC.grab||M.PC.grab.part!==p)d.st='back';}
      else if(d.st==='back'||d.st==='rest'){const dx=rx-p.x,dy=ry-p.y,dd=Math.hypot(dx,dy);if(dd>2){const st=Math.min(dd,260*dt);p.x+=dx/dd*st;p.y+=dy/dd*st;}else{p.x=rx;p.y=ry;d.st='rest';}d.z=Math.max(0,d.z-dt*200);}}},
  think(e,dt,L){const b=e.mb,n=(b.hands.L?1:0)+(b.hands.R?1:0);
    if(M.ready(e,'sold')){M.cd(e,'sold',20);const k=b.phase>=2?5:3;for(let i=0;i<k;i++){if(addsOf(e,'mbBone')>=8)break;const [x,y]=spot(e.x,e.y,i*T2/k+.3,110);const m=add(e,/Ashigaru/,x,y,{mbBone:1});if(m)dustPuff(x,y,6,'#cfc8b4',80,10);}M.say(e,'ทหารกระดูก!','#cfe8ff',16);}
    if(n&&M.ready(e,'grab')&&L<GA.reach){M.cd(e,'grab',15);if(grab(e))return true;}
    if(n&&M.ready(e,'sweep')&&L<GA.sw1+20){M.cd(e,'sweep',12);if(sweep(e))return true;}
    if(M.ready(e,'fire')&&L<520){M.cd(e,'fire',9);ghostFire(e);return true;}
    if(n&&M.ready(e,'slap')&&L<GA.reach){M.cd(e,'slap',5);if(slap(e))return true;}
    e.face=player.x>=e.x?1:-1;return true;},
  winEnd(e){const b=e.mb;b.down=0;e.mbImmune=1;M.say(e,'หัวยกขึ้น','#cfe8ff',16);M.hint(e,'หัวอยู่สูง ตีไม่ถึง — ทุบมือ ◎ ทั้ง 2 ข้าง · กวาดมือ = วิ่งเข้าใกล้กองกระดูก');},
  reset(e){e.mbImmune=0;e.mbLift=0;e.mbTilt=0;}});
/* while the skull is down it lies low and leans forward (the window has no tick, so a small watcher does it) */
class SkullDown{constructor(){this.layer='none';this.t=0;}update(dt){const e=M.boss;if(!e||!e.mb||e.mb.key!=='gashadokuro')return true;const b=e.mb;
    if(b.down&&b.win>0){b.sk=Math.min(1,(b.sk||0)+dt*3);e.mbLift=GA.lift*(1-b.sk)-6*b.sk;e.mbTilt=.3*b.sk*((e.face||1)>=0?1:-1);}else b.sk=0;return true;}draw(){}}
addFx(new SkullDown());

/* ================= Jonin Shadow (tanuki) ================= */
const JN={kunaiL:360,kunaiW:34,leafCd:25,smoke:6,find:8,clue:1.5,starT:4,starV:270,iaiW:60};
const DECOR=['barrel','tanuki','lantern','barrel','tanuki','lantern'];
function drawDecor(type,x,y,t,bomb){G.shadow(x,y+2,24,.3);
  if(type==='barrel'){G.poly([[x-18,y],[x-20,y-20],[x-18,y-40],[x+18,y-40],[x+20,y-20],[x+18,y]],bomb?'#6a3a2a':'#8a5a2a','#2a1608',2.4);ctx.fillStyle='#3a2a20';ctx.fillRect(x-20,y-31,40,4);ctx.fillRect(x-20,y-11,40,4);G.ell(x,y-40,18,5,bomb?'#5a3020':'#a8783a','#2a1608',2);
    if(bomb){ctx.strokeStyle='#2a2a2a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,y-42);ctx.quadraticCurveTo(x+12,y-52,x+8,y-58);ctx.stroke();if((t*6|0)%2)G.glow(x+8,y-58,10,'#ffb040',.8);ctx.fillStyle='#ffd23a';ctx.font='700 13px Mitr';ctx.textAlign='center';ctx.fillText('火',x,y-17);}}
  else if(type==='tanuki'){G.ell(x,y-16,17,17,'#8a6a4a','#2a1a10',2.4);G.ell(x,y-14,11,11,'#e8d8b8');G.ell(x,y-38,12,11,'#8a6a4a','#2a1a10',2.4);G.ell(x-5,y-39,4,3,'#2a1a10');G.ell(x+5,y-39,4,3,'#2a1a10');
    G.ell(x,y-50,15,5,'#c8a050','#3a2810',2);G.ell(x,y-53,8,5,'#c8a050','#3a2810',2);G.ell(x+18,y-18,5,8,'#e8e0d0','#3a2810',1.6);}
  else{ctx.fillStyle='#8a8a8a';ctx.strokeStyle='#2a2a2a';ctx.lineWidth=2;G.poly([[x-14,y],[x-10,y-8],[x+10,y-8],[x+14,y]],'#8a8a8a','#2a2a2a',2);ctx.fillRect(x-5,y-30,10,22);ctx.strokeRect(x-5,y-30,10,22);
    G.poly([[x-12,y-30],[x+12,y-30],[x+12,y-46],[x-12,y-46]],'#9a9a9a','#2a2a2a',2);G.glow(x,y-38,22,'#ffc060',.5);ctx.fillStyle='#ffd890';ctx.fillRect(x-5,y-42,10,8);G.poly([[x-20,y-46],[x,y-58],[x+20,y-46]],'#7a7a7a','#2a2a2a',2);}}
function decor(e){const b=e.mb;b.dec=[];for(let i=0;i<6;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/6+.3,i%2?280:190);
  b.dec.push(M.prop(e,{kind:'decor',x,y,r:20,layer:'sorted',type:DECOR[i],draw(q,x,y,t){if(q.off)return;drawDecor(q.type,x,y,t);}}));}}
function fan(e){const phi=M.angTo(e,player);pose(e,.8);
  M.act(e,{T:.95,start(e){for(const d of [-.36,0,.36])M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi:phi+d,len:JN.kunaiL,w:JN.kunaiW,off:16},T:.8,mul:1.1,boomKind:'quiet',
    onFire(){hitPose(e);addFx(new Kunai({x:e.x,y:e.y,phi:phi+d,len:JN.kunaiL}));}});}});}
class Kunai{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<.3;}
  draw(){const k=this.t/.3,L=this.len*k,[x,y]=P(this.x+Math.cos(this.phi)*L,this.y+Math.sin(this.phi)*L,30);ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)));
    ctx.fillStyle='#c8ccd8';ctx.strokeStyle='#2a2a34';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(0,-4);ctx.lineTo(-10,0);ctx.lineTo(0,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
/* the shuriken: bounces off the room's edge for 4 s, its next path shown */
class Star{constructor(o){Object.assign(this,{t:0,layer:'ground',hitT:0},o);}update(dt){this.t+=dt;const e=this.e,b=e.mb;if(!b||e.dead)return false;this.hitT-=dt;
    this.x+=this.vx*dt;this.y+=this.vy*dt;const dx=this.x-b.home.x,dy=this.y-b.home.y,d=Math.hypot(dx,dy),R=b.R*.88;
    if(d>R||(curMap&&mapBlockedW(this.x,this.y))){const nx=dx/d,ny=dy/d,dot=this.vx*nx+this.vy*ny;this.vx-=2*dot*nx;this.vy-=2*dot*ny;this.x-=nx*6;this.y-=ny*6;this.vx+=rnd(-40,40);this.vy+=rnd(-40,40);const s=Math.hypot(this.vx,this.vy);this.vx*=JN.starV/s;this.vy*=JN.starV/s;}
    if(this.hitT<=0&&player.hp>0&&Math.hypot(player.x-this.x,player.y-this.y)<30){this.hitT=.7;M.hit(e,1.2,{dot:['mbBleed',4,.8]});}
    return this.t<JN.starT;}
  draw(){const e=this.e,b=e.mb;if(!b)return;/* predicted path: the next 0.9 s */let x=this.x,y=this.y,vx=this.vx,vy=this.vy;ctx.save();ctx.setLineDash([8,7]);ctx.lineWidth=3;ctx.strokeStyle='rgba(255,70,50,.7)';ctx.beginPath();const [sx,sy]=P(x,y);ctx.moveTo(sx,sy);
    for(let i=0;i<18;i++){x+=vx*.05;y+=vy*.05;const dx=x-b.home.x,dy=y-b.home.y,d=Math.hypot(dx,dy);if(d>b.R*.88){const nx=dx/d,ny=dy/d,dot=vx*nx+vy*ny;vx-=2*dot*nx;vy-=2*dot*ny;}const [px,py]=P(x,y);ctx.lineTo(px,py);}ctx.stroke();ctx.setLineDash([]);ctx.restore();
    const [px,py]=P(this.x,this.y,20);ctx.save();ctx.translate(px,py);ctx.rotate(this.t*18);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);G.poly([[0,-3],[16,0],[0,3]],'#d8dce8','#20202a',1.4);}G.ell(0,0,3,3,'#20202a');ctx.restore();}}
function star(e){const a=M.angTo(e,player)+rnd(-.3,.3);pose(e,.6);M.act(e,{T:.7,end(e){hitPose(e);addFx(new Star({e,x:e.x,y:e.y,vx:Math.cos(a)*JN.starV,vy:Math.sin(a)*JN.starV}));}});}
function iai(e){const phi=M.angTo(e,player),L=Math.min(560,M.dP(e)+130);pose(e,1);M.say(e,'อิไอ!','#e8e8ff',17);
  const s={k:'rect',x:e.x,y:e.y,phi,len:L,w:JN.iaiW,off:0};
  M.act(e,{name:'⚔ ฟันอิไอพุ่ง',T:1.3,start(e,a){M.strike(e,{shape:s,T:1,mul:2,boomKind:'quiet',onFire(){hitPose(e);let d=0;while(d<L&&free(e.x+Math.cos(phi)*(d+20),e.y+Math.sin(phi)*(d+20)))d+=20;
      const x0=e.x,y0=e.y;e.x+=Math.cos(phi)*d;e.y+=Math.sin(phi)*d;addFx(new Slash({x0,y0,x1:e.x,y1:e.y}));smoke(x0,y0,6,20);}});}});}
class Slash{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<.35;}
  draw(){const k=1-this.t/.35,[a,b]=P(this.x0,this.y0,30),[c,d]=P(this.x1,this.y1,30);ctx.save();ctx.globalAlpha=k;ctx.lineCap='round';ctx.strokeStyle='#ffffff';ctx.lineWidth=7*k;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();ctx.strokeStyle='#8fd0ff';ctx.lineWidth=2.5;ctx.stroke();ctx.restore();}}
/* the leaf disguise */
function clueKunai(e,p){const x0=p.x,y0=p.y,phi=Math.atan2(player.y-y0,player.x-x0),L=Math.hypot(player.x-x0,player.y-y0)+40;
  addFx(new Clue({x0,y0,phi,L}));
  for(let d=40;d<L;d+=70)M.prop(e,{kind:'cluelight',x:x0+Math.cos(phi)*d,y:y0+Math.sin(phi)*d,layer:'ground',life:1.6,fadeT:.3,light:46});
  setFxTimer(L/900,()=>{if(player.hp>0&&!e.dead&&Math.hypot(player.x-(x0+Math.cos(phi)*(L-40)),player.y-(y0+Math.sin(phi)*(L-40)))<34)M.hit(e,.5,{});});}
class Clue{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<1.6;}
  draw(){const k=Math.min(1,this.t*900/this.L),f=Math.max(0,1-Math.max(0,this.t-.4)/1.2),[a,b]=P(this.x0,this.y0,28),[c,d]=P(this.x0+Math.cos(this.phi)*this.L*k,this.y0+Math.sin(this.phi)*this.L*k,28);
    ctx.save();ctx.globalAlpha=f;ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle='rgba(140,220,255,.55)';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    if(k<1){ctx.save();ctx.translate(c,d);ctx.rotate(Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)));ctx.fillStyle='#e8ecf4';ctx.strokeStyle='#20202a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(0,-4);ctx.lineTo(-10,0);ctx.lineTo(0,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}}
function leaf(e){const b=e.mb,p2=b.phase>=2;M.cancel(e);M.say(e,'ปุ้ง!','#e8e8ff',20);
  if(!b.seenLeaf){b.seenLeaf=1;M.banner('ใบไม้แปลงร่าง! ดูคุไน — เส้นแสงชี้กลับไปหาตัวจริง','gold',2.8);}else M.banner('แปลงร่างอีกแล้ว! ตามรอยคุไน','gold',1.6);
  M.hint(e,'มันแปลงเป็นของในห้อง ◎ — คุไนพุ่งจากที่ซ่อนจริง ทิ้งเส้นแสงชี้กลับ · ตีชิ้นที่ใช่ = ล้ม 4 วิ');
  M.act(e,{name:'🍃 ใบไม้แปลงร่าง',T:JN.find+1.05,unstop:1,leaf:1,
    start(e,a){smoke(e.x,e.y,26,90);for(let i=0;i<14;i++)smoke(b.home.x+rnd(-b.R*.7,b.R*.7),b.home.y+rnd(-b.R*.5,b.R*.5),2,60);M.pc('dark',JN.smoke,{r:220,col:'34,30,44',a:.86});
      e.hidden=1;e.atk=0;a.clue=.9;const D=b.dec.filter(q=>!q.dead),ri=Math.floor(Math.random()*D.length);let bi=-1;if(p2){do{bi=Math.floor(Math.random()*D.length);}while(bi===ri);}
      a.parts=D.map((q,i)=>{q.off=1;return M.part(e,{x:q.x,y:q.y,hp:999999,r:22,h:60,name:'Room Piece',th:'ของในห้อง',kind:'piece',data:{q,real:i===ri,bomb:i===bi,used:0},
        draw(p,x,y,t){if(p.data.used)ctx.globalAlpha*=.55;drawDecor(p.data.q.type,x,y,t,p.data.bomb&&!p.data.used);}});});
      a.real=a.parts[ri];e.x=a.real.x;e.y=a.real.y+6;
      for(let i=0;i<3;i++){const [x,y]=spot(b.home.x,b.home.y,i*T2/3+Math.random(),rnd(120,260));const m=add(e,/Shadow Ninja/,x,y,{mbShade:1});if(m){m.hp=m.maxHp=Math.round(m.maxHp*.35);smoke(x,y,6,20);}}},
    step(e,a,dt){e.atk=0;if(a.found)return;a.clue-=dt;if(a.t<JN.find&&a.clue<=0&&a.real&&!a.real.dead){a.clue=JN.clue;clueKunai(e,a.real);}
      if(a.t>=JN.find&&!a.ass){a.ass=1;assassin(e,a);}},
    end(e,a){endLeaf(e,a);},cancel(e,a){endLeaf(e,a);}});}
function endLeaf(e,a){e.hidden=0;for(const p of a.parts||[]){p.data.q.off=0;if(!p.dead){p.onBreak=null;p.gone=1;p.dead=true;}}a.parts=[];}
function assassin(e,a){const ph=player.phi||0,bx=player.x-Math.cos(ph)*46,by=player.y-Math.sin(ph)*46;e.hidden=0;e.x=player.x-Math.cos(ph)*70;e.y=player.y-Math.sin(ph)*70;e.face=player.x>=e.x?1:-1;e.atk=.8;smoke(e.x,e.y,10,30);
  M.say(e,'ลอบสังหาร!','#ff7a7a',20);for(const p of a.parts||[]){p.data.q.off=0;if(!p.dead){p.onBreak=null;p.gone=1;p.dead=true;}}a.parts=[];
  M.strike(e,{shape:{k:'circle',x:bx,y:by,r:80},T:.8,mul:3,sig:'โดนลอบสังหาร',boomKind:'quiet',onFire(){hitPose(e);addFx(new Slash({x0:e.x,y0:e.y,x1:bx+Math.cos(ph)*60,y1:by+Math.sin(ph)*60}));}});}
M.def('tanuki',{R:470,see:300,spd:72,reach:110,hpMul:1.3,enrage:360,minH:96,
  cry:'ปุ้ง! ทานูกิไม่มีอยู่จริง~',intro:'โจนินเงา — ตอนแปลงร่าง ตามเส้นแสงของคุไนไปหาของชิ้นที่ใช่ แล้วตีมัน',
  cd0:{fan:1.5,star:5,iai:8,leaf:12},phases:[.4],
  setup(e,b){decor(e);b.fleeN=Math.round((b.flee0||0)+lv(e));e.m.flee=b.fleeN;M.hint(e,'หลบเส้น · ตัวหลบเก่ง (ใช้เวท / คริ / HIT สูง) · แปลงร่าง = ตามรอยคุไน');},
  phase(e){M.banner('ถังระเบิดปนอยู่ในห้อง! ตีผิดถังระวังระเบิด','red',2.2);},
  tick(e,dt){const b=e.mb;if(b.win<=0&&e.m.flee!==b.fleeN)e.m.flee=b.fleeN;},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'leaf')){M.cd(e,'leaf',JN.leafCd);leaf(e);return true;}
    if(M.ready(e,'iai')&&L>90&&L<430){M.cd(e,'iai',12);iai(e);return true;}
    if(M.ready(e,'star')&&L<480){M.cd(e,'star',10);star(e);return true;}
    if(M.ready(e,'fan')&&L<JN.kunaiL-20){M.cd(e,'fan',4);fan(e);return true;}
    return false;},
  partHurt(e,p){if(p.pkind!=='piece'||p.data.used)return;const a=e.mb.act;if(!a||!a.leaf)return;p.hp=p.maxHp;
    if(p.data.real){a.found=1;M.say(p,'เจอแล้ว!','#ffe08a',21);smoke(p.x,p.y,16,40);const x=p.x,y=p.y+6;M.cancel(e);e.x=x;e.y=y;e.hidden=0;e.m.flee=0;M.window(e,4,'เจอแล้ว! ล้มก้นจ้ำเบ้า');return;}
    p.data.used=1;smoke(p.x,p.y,14,40);M.say(p,'ผิดชิ้น!','#cfcad8',15);
    if(p.data.bomb){addFx(new GRing({x:p.x,y:p.y,r0:10,r1:160,w:16,color:'#ff9a3a',life:.5}));puff(p.x,p.y,'#ff9a3a',24,220);if(typeof shake==='function')shake(5);
      if(Math.hypot(player.x-p.x,player.y-p.y)<160&&M.hit(e,2,{dot:['mbBurn',4,1]}))M.fail(e,'ตีโดนถังระเบิด');}
    else if(Math.hypot(player.x-p.x,player.y-p.y)<170)M.buff('dbSlow',2);},
  winEnd(e){const b=e.mb;e.m.flee=b.fleeN;},
  reset(e){e.hidden=0;}});
})();
