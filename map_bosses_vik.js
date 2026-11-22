/* =====================================================================
   VIKING MAP BOSSES (MAP_BOSS_MECHANICS_TH.md §5) — scripts for map_boss_kit.js.
   · Huldra (vikH1 · Lv 37): branch lash · root snare (3 circles in a row) · LURE SONG (breakable cast → pulled into her hollow) ·
       LEAF MIRAGE: 5 bodies, the real one has the cow tail + glowing hollow back; fakes pop after 3 hits, survivors heal her;
       a KO on the real one during the mirage pops them all = window. Phase < 50 %: spore clouds (slow).
   · Jotun Brute (vikH2 · Lv 44): club smash (+ ice spikes) · rolling snowball (stopped by boulders) · frost breath (chill ×3 = frozen) ·
       GLACIER HIDE: ice armour takes every hit minus Lv × 1.5 (burns go through) while he winds up GLACIER BREAKER 6 s —
       break it = kneels 5 s; else the whole lair is hit except the blue shadow behind the ice boulders (each shelter breaks once).
   · Draugr Forgemaster (vikD1b · Lv 49): molten hammer (lava puddle) · chain hook (drag + hammer) · spark ring (donut) ·
       FORGE at the anvil 6 s: empty his KO gauge OR break both bellows = 'the forge dies' window; else +1 forged armour (max 3).
       Phase < 40 %: lava walls sweep the hall (walk through the gap).
   ===================================================================== */
(function(){
const M=window.MBK;if(!M)return;
const T2=Math.PI*2,G=M.g;
const pose=(e,T)=>{e.atk=T;e.face=player.x>=e.x?1:-1;};
const hitPose=e=>{e.atk=0;e._hitT=gameTime;};
const lv=M.lvOf;
const free=(x,y)=>!curMap||!mapBlockedW(x,y);
function spot(cx,cy,a,r){for(let k=0;k<14;k++){const x=cx+Math.cos(a+k*.45)*r,y=cy+Math.sin(a+k*.45)*r*.85;if(free(x,y))return [x,y];}return [cx,cy];}
/* a spot with open ground all round it (props whose 'behind' must be walkable, e.g. shelters) */
function openSpot(cx,cy,a,r,R){let best=null,bs=-1;for(const rr of [r,r*.85,r*1.15,r*.7]){for(let k=0;k<16;k++){const aa=a+k*T2/16,x=cx+Math.cos(aa)*rr,y=cy+Math.sin(aa)*rr*.85;if(!free(x,y))continue;
    let n=0;for(let i=0;i<12;i++){const d=i*T2/12;for(const q of [R*.35,R*.7,R])if(free(x+Math.cos(d)*q,y+Math.sin(d)*q))n++;}if(n===36)return [x,y];if(n>bs){bs=n;best=[x,y];}}}
  return best||[cx,cy];}
function cone(e,r,half,T,mul,o){const phi=M.angTo(e,player);pose(e,T);return M.strike(e,Object.assign({shape:{k:'cone',x:e.x,y:e.y,r,phi,half},T,mul,boomKind:'quiet',onFire(){hitPose(e);}},o||{}));}

/* ================= Huldra ================= */
const HU={copyR:175,copies:4,hits:3,mir:12};
const look=e=>({vdef:e.vdef,spr:e.spr,boss:true,bsc:e.bsc,face:1,atk:0,st:{},bob:Math.random()*6,m:e.m,dead:false,deadT:0,z:0,flash:0,_mv:0});
function tail(e){/* the cow tail + glowing hollow that only the real Huldra has */
  return M.prop(e,{kind:'tail',x:e.x,y:e.y,layer:'sorted',sortOff:-3,update(q){q.x=e.x;q.y=e.y;},
    draw(q,x,y,t){if(e.hidden||e.dead)return;const h=MSPR_H(e)||100,f=-(e.face||1),sw=Math.sin(t*5)*.5;
      G.glow(x+f*8,y-h*.45,26,'#ff9a3a',.35+.15*Math.sin(t*3));
      ctx.save();ctx.translate(x+f*h*.16,y-h*.3);ctx.rotate(f*(.9+sw*.4));ctx.strokeStyle='#5a3a1a';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(f*14,10,f*8,30);ctx.stroke();
      ctx.strokeStyle='#a86a3a';ctx.lineWidth=3;ctx.stroke();G.poly([[f*8-6,28],[f*8,42],[f*8+6,28]],'#3a2410','#1a1008',1.5);ctx.restore();}});}
M.def('huldra',{R:560,see:320,spd:58,reach:120,hpMul:1.25,enrage:300,minH:100,
  cry:'มาเถอะ…ฟังเพลงข้า',intro:'ฮุลดรา — ตอนแยกร่าง ตัวจริงมีหางวัวกับโพรงเห็ดเรืองแสง',
  cd0:{lash:1.5,snare:4,song:12,mirage:9},phases:[.75,.5,.25],
  setup(e,b){tail(e);M.hint(e,'หลบวงแดง · เพลงล่อ = ทำเกจ KO ให้หมด หรือเดินสวนออก · แยกร่าง = หาตัวที่มีหาง');},
  phase(e,ph){if(ph===3)M.banner('โพรงหลังเปิด! สปอร์เห็ดทำให้ช้า','red',2);mirage(e);},
  tick(e,dt){const b=e.mb;for(const p of M.parts(e,'copy')){p.maxHp=e.maxHp;p.hp=Math.max(1,e.hp);}if(b.phase>=3){b.sporeT=(b.sporeT||0)-dt;if(b.sporeT<=0){b.sporeT=8;spores(e);}}
    for(const q of M.props(e,'spore'))if(Math.hypot(player.x-q.x,player.y-q.y)<q.r){player.buffs.dbSlow={t:1,total:1};}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'mirage')){mirage(e);return true;}
    if(M.ready(e,'song')&&L<420){M.cd(e,'song',20);song(e);return true;}
    if(M.ready(e,'snare')&&L<380){M.cd(e,'snare',9);snare(e);return true;}
    if(M.ready(e,'lash')&&L<135){M.cd(e,'lash',3);M.act(e,{T:.95,start(e){cone(e,122,.8,.8,1.2);}});return true;}
    return false;},
  partHurt(e,p,d){if(p.pkind!=='copy')return;p.data.n=(p.data.n||0)+1;p.hp=Math.max(1,e.hp);if(p.data.n>=HU.hits)M.breakPart(p);},
  hurtAfter(e,d){const a=e.mb.act;if(a&&a.mir&&!a.done&&(e.koOut||e.st.stun>0)){a.done=1;popAll(e,true);}}});
function snare(e){const sx=e.x,sy=e.y,tx=player.x,ty=player.y;pose(e,.9);
  M.act(e,{T:1.2,start(e){for(let i=0;i<3;i++){const k=(i+1)/3,x=sx+(tx-sx)*k,y=sy+(ty-sy)*k;
      M.strike(e,{shape:{k:'circle',x,y,r:56},T:.9+i*.28,mul:1,pc:['root',1.5],boomKind:'quiet',onFire(){roots(x,y);if(i===0)hitPose(e);}});}}});}
function roots(x,y){for(let i=0;i<7;i++){const a=i/7*T2;emit({type:'ember',x:x+Math.cos(a)*30,y:y+Math.sin(a)*20,z:2,vz:rnd(120,200),vx:Math.cos(a)*30,vy:Math.sin(a)*20,drag:3,life:.5,size:3,size1:1,color:'#7a4a2a'});}
  addFx(new GRing({x,y,r0:6,r1:60,w:8,color:'#a87a4a',life:.35}));}
function song(e){const b=e.mb;M.say(e,'♪ ลา…ลา…','#ffb0d8',18);
  M.act(e,{name:'🎵 เพลงล่อ',T:2.5,brk:Math.round(lv(e)*3),start(e,a){e.atk=0;a.n=addFx(new Notes({e,life:2.6}));if(!b.seenSong){b.seenSong=1;M.banner('เพลงล่อ! ขัดด้วยเกจ KO หรือเดินสวนออก','gold',2.2);}},
    broken(e,a){if(a.n)a.n.dead=1;M.window(e,3,'เพลงถูกขัด!');},
    cancel(e,a){if(a.n)a.n.dead=1;},
    end(e,a){if(a.n)a.n.dead=1;if(player.hp<=0)return;M.banner('ถูกดึง! เดินสวนออกจากเธอ','purple',1.8);
      M.pc('pull',3,{to:()=>e.dead?null:[e.x,e.y],v:72,stop:48,reach(){M.fail(e,'โดนเพลงล่อกอดเข้าโพรง');M.hit(e,2.5,{pc:['root',2]});M.say(e,'กอดเข้าโพรง!','#ff8ac8',18);}});}});}
class Notes{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return !this.dead&&this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e;for(let i=0;i<6;i++){const k=((this.t*.7+i/6)%1),a=i*1.3+this.t,[x,y]=P(e.x+Math.cos(a)*(30+k*80),e.y+Math.sin(a)*(20+k*40),60+k*70);ctx.save();ctx.globalAlpha=Math.sin(k*Math.PI);
    ctx.font='700 20px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#5a1a3a';ctx.strokeText(i%2?'♪':'♫',x,y);ctx.fillStyle='#ffb0d8';ctx.fillText(i%2?'♪':'♫',x,y);ctx.restore();}}}
function mirage(e){const b=e.mb;M.cd(e,'mirage',30);M.cancel(e);M.say(e,'หาข้าให้เจอสิ…','#ffd0a0',18);
  M.act(e,{name:'🍂 ร่างลวงใบไม้',T:HU.mir+.8,mir:1,unstop:1,start(e,a){a.cp=[];e.atk=0;whirl(e.x,e.y);
      const n=HU.copies+1,me=Math.floor(Math.random()*n),a0=Math.random()*T2,cx=e.x,cy=e.y,pts=[];for(let i=0;i<n;i++)pts.push(spot(cx,cy,a0+i*T2/n,HU.copyR));
      for(let i=0;i<n;i++){const [x,y]=pts[i];if(i===me){e.x=x;e.y=y;continue;}
        const p=M.part(e,{x,y,hp:999999,r:24,h:Math.round(MSPR_H(e)||100),name:'Leaf Mirage',th:'ร่างลวงใบไม้',kind:'copy',gold:0,mark:0,data:{lk:look(e),n:0},
          draw(p,x,y,t,al){const L=p.data.lk;L.face=player.x>=p.x?1:-1;L.flash=p.flash||0;ctx.globalAlpha=al*.9;try{MSPR_DRAW(L,x,y,al*.9,0,L.flash);}catch(err){}
            if(Math.random()<.06)emit({type:'ember',x:p.x+rnd(-14,14),y:p.y,z:rnd(20,80),vz:rnd(10,30),vx:rnd(-20,20),drag:1,life:1,size:3,size1:2,color:Math.random()<.5?'#e8902a':'#c8541a'});},
          onBreak(p){whirl(p.x,p.y,1);M.say(p,'ใบไม้!','#ffb070',15);if(Math.hypot(player.x-p.x,player.y-p.y)<70)M.hit(e,.4,{});}});
        Object.assign(p,{boss:true,bossName:e.bossName,noHide:1,mbNoAuto:0,maxHp:e.maxHp,hp:e.hp});p.m.name=e.m.name;p.m.th=e.m.th;a.cp.push(p);}
      if(!b.seenMir){b.seenMir=1;M.banner('แยกร่าง! ตัวจริงมีหางวัว + โพรงเห็ดเรืองแสง','gold',2.6);}M.hint(e,'ตัวจริงมีหางวัว + เห็ดเรืองแสงที่หลัง · ตีปลอม 3 ทีแตก · KO ตัวจริง = ปลอมแตกหมด');},
    step(e,a,dt){e.atk=0;a.lt=(a.lt||0)-dt;if(a.lt<=0){a.lt=2.4;const L=a.cp.filter(p=>!p.dead);if(L.length){const p=L[(a.li=(a.li||0)+1)%L.length];if(Math.hypot(player.x-p.x,player.y-p.y)<150){const phi=Math.atan2(player.y-p.y,player.x-p.x);
          M.strike(e,{shape:{k:'cone',x:p.x,y:p.y,r:120,phi,half:.8},T:.8,mul:.8,boomKind:'quiet'});}}}},
    end(e,a){if(a.done)return;const L=a.cp.filter(p=>!p.dead);for(const p of L){whirl(p.x,p.y);M.breakPart(p);}
      if(L.length){const h=L.length*lv(e)*20;e.hp=Math.min(e.maxHp,e.hp+h);addFx(new DText({x:e.x,y:e.y,z:110,text:'+'+h.toLocaleString(),color:'#9fe08a',size:18,life:1.2}));M.fail(e,'ร่างปลอมรวมร่าง');M.cd(e,'song',0);}
      M.hint(e,'หลบวงแดง · เพลงล่อ = ทำเกจ KO ให้หมด หรือเดินสวนออก · แยกร่าง = หาตัวที่มีหาง');},
    cancel(e,a){for(const p of a.cp||[])if(!p.dead){p.onBreak=null;M.breakPart(p);}}});}
function popAll(e,win){const a=e.mb.act;for(const p of (a&&a.cp)||[])if(!p.dead){p.onBreak=null;whirl(p.x,p.y,1);M.breakPart(p);}if(win){M.say(e,'ร่างลวงแตก!','#ffe08a',19);M.window(e,4,'ร่างลวงแตก!');}}
function whirl(x,y,small){for(let i=0;i<(small?10:22);i++){const a=Math.random()*T2,s=rnd(60,200);emit({type:'ember',x,y,z:rnd(10,70),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(40,140),drag:1.6,life:rnd(.6,1.1),size:rnd(2.5,4),size1:1.5,color:['#e8902a','#c8541a','#f0c040','#a8401a'][i%4]});}
  addFx(new GRing({x,y,r0:6,r1:small?50:90,w:8,color:'#e8a040',life:.4}));}
function spores(e){for(let i=0;i<3;i++){const a=gameTime+i*T2/3,x=e.x+Math.cos(a)*150,y=e.y+Math.sin(a)*110;
  M.prop(e,{kind:'spore',x,y,r:64,layer:'ground',life:7,fadeT:.5,draw(q,x,y,t){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,6,0,0,q.r);g.addColorStop(0,'rgba(255,170,80,.35)');g.addColorStop(1,'rgba(255,140,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,q.r,0,T2);ctx.fill();ctx.restore();
    if(Math.random()<.2)emit({type:'mist',x:q.x+rnd(-40,40),y:q.y+rnd(-25,25),z:rnd(5,30),vz:8,life:1.4,size:10,size1:18,color:'#ffcf90'});}});}}

/* ================= Jotun Brute ================= */
function boulders(e){const b=e.mb;const got=[];for(let i=0;i<3;i++){let [x,y]=openSpot(b.home.x,b.home.y,i*T2/3+.5,270,190);if(got.some(g=>Math.hypot(g[0]-x,g[1]-y)<150))[x,y]=spot(b.home.x,b.home.y,i*T2/3+.5,270);got.push([x,y]);
  M.prop(e,{kind:'boulder',x,y,r:36,solid:1,cover:1,layer:'sorted',hp:3,
    draw(q,x,y,t){const s=q.hp/3;G.shadow(x,y+2,40,.3);G.poly([[x-34,y],[x-38,y-26],[x-18,y-52],[x+12,y-56],[x+36,y-30],[x+34,y]],'#c8e4f4','#3a5a7a',3);
      G.poly([[x-18,y-52],[x+12,y-56],[x+2,y-30]],'#eaf6ff');G.poly([[x+12,y-56],[x+36,y-30],[x+10,y-26]],'#9ac4e0');
      if(q.hp<3){ctx.strokeStyle='#2a4a6a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y-48);ctx.lineTo(x+2,y-30);ctx.lineTo(x-4,y-14);ctx.stroke();}if(q.hp<2){ctx.beginPath();ctx.moveTo(x+20,y-40);ctx.lineTo(x+10,y-22);ctx.stroke();}}});}}
const boulderCov=e=>({x:e.x,y:e.y,list:M.props(e,'boulder')});
M.def('jotun',{R:600,see:340,spd:54,reach:120,hpMul:1.25,enrage:300,minH:120,
  cry:'ฮือออ!!',intro:'ยักษ์โยตุน — ทุบเกราะน้ำแข็งให้แตกก่อนมันทุบพื้น (ไม่ทันให้หลบหลังหิน)',
  cd0:{smash:2,ball:5,breath:7,hide:10},phases:[.7,.4],
  setup(e,b){boulders(e);M.hint(e,'หลบวงแดง · เกราะน้ำแข็ง = ตีหนักๆ ให้แตก (ไหม้/ไฟไม่โดนหัก) · ไม่ทันให้ยืนในเงาฟ้าหลังหิน');},
  phase(e){hide(e);},
  think(e,dt,L){const b=e.mb,p3=b.phase>=3;
    if(M.ready(e,'hide')){hide(e);return true;}
    if(M.ready(e,'breath')&&L<220){M.cd(e,'breath',15);breath(e);return true;}
    if(M.ready(e,'ball')&&L<520&&L>120){M.cd(e,'ball',12);ball(e,0);if(p3)ball(e,.35);if(p3)ball(e,-.35);return true;}
    if(M.ready(e,'smash')&&L<300){M.cd(e,'smash',6);smash(e);return true;}
    return false;},
  hurt(e,mult,o){const a=e.mb.act;if(!(a&&a.armor>0))return null;const cut=o.dot?0:Math.round(lv(e)*1.5);
    return {absorb:cut,pool(left){a.armor-=left;if(a.armor<=0&&!a.broke){a.broke=1;M.cancel(e);for(let i=0;i<5;i++)iceBits(e.x+rnd(-30,30),e.y+rnd(-10,10));M.say(e,'เกราะแตก!','#bfe8ff',21);M.window(e,5,'เกราะแตก! ยักษ์คุกเข่า');}}};}});
function smash(e){const x=player.x,y=player.y;pose(e,1.1);
  M.act(e,{T:1.25,start(e){M.strike(e,{shape:{k:'circle',x,y,r:110},T:1.1,mul:1.8,boomCol:'#cfeeff',onFire(){hitPose(e);iceBits(x,y);
      for(let i=0;i<3;i++){const a=i*T2/3+Math.random(),sx=x+Math.cos(a)*70,sy=y+Math.sin(a)*50;M.strike(e,{shape:{k:'circle',x:sx,y:sy,r:40},T:2,mul:.8,boomCol:'#e8f8ff',boomKind:'quiet',onFire(){iceBits(sx,sy);}});}}});}});}
function iceBits(x,y){for(let i=0;i<10;i++)emit({type:'ember',x:x+rnd(-8,8),y:y+rnd(-6,6),z:rnd(8,40),vx:rnd(-140,140),vy:rnd(-100,100),vz:rnd(80,220),drag:1.5,life:rnd(.5,.9),size:rnd(2,3.4),size1:.6,color:Math.random()<.5?'#e8f8ff':'#9fd8ff'});}
function ball(e,da){const phi=M.angTo(e,player)+da,len=560;pose(e,1.3);
  const s={k:'rect',x:e.x,y:e.y,phi,len,w:72,off:20};
  const w=M.strike(e,{shape:s,T:1.3,mul:1.6,cc:['air',.8],boom:0,cover:()=>boulderCov(e),onFire(hit){hitPose(e);const q=firstOnLine(e,s);addFx(new Ball({x:e.x,y:e.y,phi,len:q?q._u:len,q}));if(q){q.hp--;if(q.hp<=0)q.dead=1;}}});
  if(!da)M.act(e,{T:1.45});}
function firstOnLine(e,s){let best=null,bu=1e9;const c=Math.cos(s.phi),n=Math.sin(s.phi);for(const q of M.props(e,'boulder')){const dx=q.x-s.x,dy=q.y-s.y,u=dx*c+dy*n,v=Math.abs(-dx*n+dy*c);if(u>0&&u<s.len&&v<s.w/2+q.r&&u<bu){bu=u;best=q;}}if(best)best._u=bu;return best;}
class Ball{constructor(o){Object.assign(this,{t:0,layer:'sorted'},o);this.T=this.len/700;}update(dt){this.t+=dt;const k=Math.min(1,this.t/this.T);this.x0=this.x+Math.cos(this.phi)*this.len*k;this.y0=this.y+Math.sin(this.phi)*this.len*k;this.sy=this.y0;
    if(this.t>=this.T&&!this.done){this.done=1;iceBits(this.x0,this.y0);dustPuff(this.x0,this.y0,10,'#eef6ff',90,12);}return this.t<this.T+.05;}
  draw(){const k=Math.min(1,this.t/this.T),r=16+22*k,[x,y]=P(this.x0,this.y0,r);G.shadow(x,y+r,r,.3);G.ell(x,y,r,r,'#f4faff','#5a7a9a',3);ctx.save();ctx.translate(x,y);ctx.rotate(this.t*12);ctx.strokeStyle='#bcd8ec';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.6,0,2);ctx.stroke();ctx.restore();}}
function breath(e){const phi=M.angTo(e,player);pose(e,1);
  M.act(e,{name:'❄ ลมหายใจหนาว',T:2.6,start(e,a){a.s={k:'cone',x:e.x,y:e.y,r:215,phi,half:.78};M.warn({shape:a.s,life:1,e});},
    step(e,a,dt){if(a.t<1)return;e.atk=0;a.tk=(a.tk||0)-dt;if(Math.random()<.6)for(let i=0;i<2;i++){const r=rnd(20,200),aa=phi+rnd(-.7,.7);emit({type:'mist',x:e.x+Math.cos(aa)*r,y:e.y+Math.sin(aa)*r,z:rnd(10,40),vx:Math.cos(aa)*80,vy:Math.sin(aa)*80,life:.6,size:12,size1:24,color:'#dff4ff'});}
      if(a.tk<=0&&a.t<2.5){a.tk=.3;if(M.inShape(a.s,player.x,player.y,10)&&M.hit(e,.5,{})){a.ch=(player.buffs.mbChill&&player.buffs.mbChill.t>0?(player.buffs.mbChill.n||0):0)+1;M.buff('mbChill',4,a.ch+'/3');player.buffs.mbChill.n=a.ch;
          if(a.ch>=3){delete player.buffs.mbChill;M.pc('stone',1.5);M.say(player,'แข็ง!','#bfe8ff',16);}}}}});}
function hide(e){const b=e.mb,p3=b.phase>=3;M.cd(e,'hide',p3?20:30);M.cancel(e);const A=Math.round(lv(e)*60);
  M.say(e,'ผิวธารน้ำแข็ง!','#bfe8ff',19);if(!b.seenHide){b.seenHide=1;M.banner('เกราะน้ำแข็ง! ตีให้แตกก่อนมันทุบพื้น','gold',2.4);}
  M.hint(e,'เกราะน้ำแข็งหักดาเมจทุกฮิต — ใช้ท่าแรงๆ / ไฟ · ไม่ทัน: ยืนในเงาฟ้าหลังหินน้ำแข็ง');
  M.act(e,{name:'🧊 ทุบธารน้ำแข็ง',T:6,unstop:1,armor:A,armor0:A,start(e,a){e.atk=0;a.fx=addFx(new IceArmor({e,a}));a.sh=[];for(const q of M.props(e,'boulder'))a.sh.push(shelter(e,q,6));},
    step(e,a){e.atk=a.t>5?.5:0;},
    end(e,a){if(a.fx)a.fx.dead=1;for(const w of a.sh)w.dead=1;hitPose(e);if(typeof shake==='function')shake(7);
      addFx(new GRing({x:e.x,y:e.y,r0:20,r1:b.R,w:22,color:'#cfeeff',life:.7}));for(let i=0;i<20;i++){const r=rnd(40,b.R*.8),aa=rnd(0,T2);iceBits(e.x+Math.cos(aa)*r,e.y+Math.sin(aa)*r*.8);}
      const c=M.covered(boulderCov(e),player.x,player.y);if(c){c.hp--;if(c.hp<=0)c.dead=1;M.say(player,'หินบังไว้!','#bfe8ff',15);}
      else if(player.hp>0&&Math.hypot(player.x-e.x,player.y-e.y)<b.R+200){if(M.hit(e,3.5,{}))M.pc('stone',2);M.fail(e,'โดนทุบธารน้ำแข็ง');}
      M.hint(e,'หลบวงแดง · เกราะน้ำแข็ง = ตีหนักๆ ให้แตก (ไหม้/ไฟไม่โดนหัก) · ไม่ทันให้ยืนในเงาฟ้าหลังหิน');},
    cancel(e,a){if(a.fx)a.fx.dead=1;for(const w of a.sh||[])w.dead=1;}});}
/* the blue shelter behind a boulder, away from the boss */
function shelter(e,q,life){const a=Math.atan2(q.y-e.y,q.x-e.x);let L=40;while(L<150&&free(q.x+Math.cos(a)*(q.r+L+10),q.y+Math.sin(a)*(q.r+L+10)))L+=10;
  return M.safe({k:'rect',x:q.x+Math.cos(a)*q.r*.6,y:q.y+Math.sin(a)*q.r*.6,phi:a,len:L,w:q.r*1.9,off:0},life);}
class IceArmor{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return !this.dead&&!this.e.dead&&this.e.mb&&this.e.mb.act===this.a;}
  draw(){const e=this.e,a=this.a,h=MSPR_H(e)||120,[x,y]=P(e.x,e.y),k=Math.max(0,a.armor/a.armor0);
    for(let i=0;i<5;i++){if(k<(i+.5)/5)continue;const an=i/5*T2+this.t*.4,px=x+Math.cos(an)*h*.32,py=y-h*.45+Math.sin(an)*h*.22;G.poly([[px,py-16],[px+11,py-6],[px+8,py+12],[px-8,py+12],[px-11,py-6]],'rgba(200,238,255,.8)','#3a7aaa',2);}
    const w=86,bx=x-w/2,by=y-h-30;ctx.fillStyle='rgba(10,20,40,.8)';ctx.fillRect(bx-1,by-1,w+2,8);ctx.fillStyle='#9fe0ff';ctx.fillRect(bx,by,w*k,6);G.text(x,by-4,'เกราะน้ำแข็ง',11,'#cfeeff');}}

/* ================= Draugr Forgemaster ================= */
function anvil(e){const b=e.mb;const [x,y]=spot(b.home.x,b.home.y-40,-Math.PI/2,40);b.anv={x,y};
  M.prop(e,{kind:'anvil',x,y,r:40,solid:1,layer:'sorted',draw(q,x,y,t){const hot=e.mb.forge;G.shadow(x,y+2,48,.35);
    G.poly([[x-44,y-30],[x+38,y-30],[x+38,y-22],[x+18,y-18],[x+14,y-6],[x+30,y+2],[x-30,y+2],[x-14,y-6],[x-18,y-18],[x-30,y-22],[x-58,y-26]],'#4a4a52','#111',3);
    ctx.fillStyle=hot?`rgba(255,${120+60*Math.sin(t*10)},40,.9)`:'#7a7a88';ctx.fillRect(x-30,y-31,60,3);if(hot)G.glow(x,y-30,60,'#ff7a1a',.45);}});}
function bellows(e){const b=e.mb,a=b.anv;const L=[];for(const s of [-1,1]){let x=a.x+s*95,y=a.y+18;if(!free(x,y)){x=a.x+s*70;y=a.y+40;}
  L.push(M.part(e,{x,y,hp:Math.round(lv(e)*30),r:24,h:46,name:'Bellows',th:'เครื่องเป่าลม',kind:'bellows',data:{s},
    draw(p,x,y,t){const s=p.data.s,pu=Math.sin(t*6)*.15;G.shadow(x,y+2,26,.3);ctx.save();ctx.translate(x,y-18);ctx.scale(s,1);
      G.poly([[-30,-12-pu*20],[-38,0],[-30,12+pu*20],[10,6],[10,-6]],'#a8743a','#3a2210',2.5);ctx.strokeStyle='#5a3418';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-28,0);ctx.lineTo(-18,-6-pu*10);ctx.lineTo(-8,0);ctx.lineTo(2,-5-pu*8);ctx.stroke();
      ctx.fillStyle='#666';ctx.fillRect(10,-3,22,6);ctx.restore();if(Math.random()<.2)emit({type:'ember',x:x-s*-30,y,z:20,vx:-s*60,vy:rnd(-10,10),vz:rnd(20,60),drag:2,life:.5,size:2,size1:.5,color:'#ffb040'});},
    onBreak(p){for(let i=0;i<12;i++)emit({type:'ember',x:p.x,y:p.y,z:rnd(10,40),vx:rnd(-120,120),vy:rnd(-80,80),vz:rnd(60,180),drag:1.5,life:.8,size:rnd(2,3.5),size1:.5,color:i%2?'#a8743a':'#ffb040'});addFx(new GRing({x:p.x,y:p.y,r0:6,r1:60,w:8,color:'#ffb040',life:.35}));
      const a=e.mb.act;if(a&&a.forge&&!M.parts(e,'bellows').length){a.out=1;forgeDies(e);}}}));}
  return L;}
function forgeDies(e){const b=e.mb;M.cancel(e);b.stack=Math.max(0,(b.stack||0)-1);b.defN=b.def0+Math.round(lv(e)/2)*b.stack;M.defNow(e);M.say(e,'เตาดับ!','#ffe08a',21);M.window(e,5,'เตาดับ! ล้มทับทั่ง');}
M.def('draugr',{R:470,see:300,spd:52,reach:115,hpMul:1.3,enrage:360,minH:100,
  cry:'เหล็ก…ต้องหลอม…',intro:'ดรอกร์ช่างหลอม — ตอนหลอมเกราะที่ทั่ง ทำเกจ KO ให้หมด หรือทุบเครื่องเป่าลมทั้ง 2 ตัว',
  cd0:{hammer:1.5,chain:5,ring:8,forge:10,lava:6},phases:[.4],
  setup(e,b){anvil(e);b.stack=0;M.hint(e,'หลบวงแดง · หลอมเกราะ: ขัดด้วยเกจ KO หรือทุบเครื่องเป่าลม ◎ 2 ตัว');},
  phase(e){M.banner('ร่องลาวาล้น! เดินผ่านช่องว่างของกำแพงลาวา','red',2.2);},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'forge')){M.cd(e,'forge',30);forge(e);return true;}
    if(b.phase>=2&&M.ready(e,'lava')){M.cd(e,'lava',13);lavaWall(e);}
    if(M.ready(e,'ring')&&L<230){M.cd(e,'ring',14);ring(e);return true;}
    if(M.ready(e,'chain')&&L>130&&L<330){M.cd(e,'chain',11);chain(e);return true;}
    if(M.ready(e,'hammer')&&L<330){M.cd(e,'hammer',5);hammer(e,player.x,player.y,1.1);return true;}
    return false;}});
function hammer(e,x,y,T){pose(e,T);const b=e.mb;
  M.act(e,{T:T+.15,start(e){M.strike(e,{shape:{k:'circle',x,y,r:100},T,mul:1.9,dot:b.stack?['mbBurn',4,1]:null,boomCol:'#ffb070',onFire(){hitPose(e);puddle(e,x,y);}});}});}
function puddle(e,x,y){M.prop(e,{kind:'lava',x,y,r:46,layer:'ground',life:6,fadeT:.6,tk:0,update(q,dt){q.tk-=dt;if(q.tk<=0&&Math.hypot(player.x-q.x,player.y-q.y)<q.r){q.tk=1;M.dot('mbBurn',3,lv(e)*1);}},
  draw(q,x,y,t){ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,4,0,0,q.r);g.addColorStop(0,'rgba(255,220,120,.95)');g.addColorStop(.5,'rgba(255,110,30,.85)');g.addColorStop(1,'rgba(120,30,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,q.r,0,T2);ctx.fill();ctx.restore();
    if(Math.random()<.15)emit({type:'ember',x:q.x+rnd(-30,30),y:q.y+rnd(-18,18),z:2,vz:rnd(30,70),drag:1,life:.7,size:2,size1:.4,color:'#ffb040'});}});}
function chain(e){const phi=M.angTo(e,player);pose(e,1);
  M.act(e,{name:'⛓ โซ่ตะขอ',T:1.15,start(e){M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi,len:325,w:46,off:10},T:1,mul:1,boomKind:'quiet',onFire(hit){hitPose(e);addFx(new Chain({e,phi,len:325,life:.5}));
      if(hit){const fx=e.x+Math.cos(phi)*70,fy=e.y+Math.sin(phi)*70;M.pc('pull',.6,{to:()=>[fx,fy],v:700,stop:6});setFxTimer(.35,()=>{if(!e.dead&&e.mb&&!e.mb.act)hammer(e,fx,fy,.9);});}}});}});}
class Chain{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const e=this.e,k=Math.sin(Math.PI*Math.min(1,this.t/this.life)),L=this.len*k,[x0,y0]=P(e.x,e.y,40),[x1,y1]=P(e.x+Math.cos(this.phi)*L,e.y+Math.sin(this.phi)*L,30);
    ctx.save();ctx.strokeStyle='#6a6a78';ctx.lineWidth=5;ctx.setLineDash([8,4]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);G.poly([[x1,y1-8],[x1+8,y1],[x1,y1+8],[x1-4,y1]],'#b8b8c8','#222',2);ctx.restore();}}
function ring(e){pose(e,1.2);M.act(e,{T:1.35,start(e){M.strike(e,{shape:{k:'donut',x:e.x,y:e.y,r0:72,r1:225},T:1.2,mul:1.4,dot:['mbBurn',4,1],boomCol:'#ffc070',onFire(){hitPose(e);for(let i=0;i<16;i++){const a=i/16*T2;emit({type:'spark',x:e.x+Math.cos(a)*80,y:e.y+Math.sin(a)*60,z:30,vx:Math.cos(a)*300,vy:Math.sin(a)*220,vz:rnd(20,80),drag:2,life:.5,size:1.8,color:'#ffd080',len:.04});}}});}});}
function forge(e){const b=e.mb;M.cancel(e);M.say(e,'หลอม!','#ffb070',19);if(!b.seenForge){b.seenForge=1;M.banner('หลอมเกราะ! ทำเกจ KO ให้หมด หรือทุบเครื่องเป่าลม 2 ตัว','gold',2.6);}
  const a0={name:'🔨 เดินไปที่ทั่ง',T:8,unstop:1,step(e,a,dt){const A=b.anv;if(M.chase(e,dt,48,110,A.x,A.y+30)||a.t>7){b.act=null;forgeCast(e);}}};M.act(e,a0);}
function forgeCast(e){const b=e.mb;
  M.act(e,{name:'🔥 หลอมเกราะ',T:6,brk:Math.round(lv(e)*3),forge:1,start(e,a){b.forge=1;a.bl=bellows(e);M.hint(e,'หลอมเกราะ — ทำเกจ KO ให้หมด หรือทุบเครื่องเป่าลม ◎ ทั้ง 2 ตัว');},
    step(e,a){e.atk=(a.t*2%1)<.5?.4:0;if(Math.random()<.3)emit({type:'spark',x:b.anv.x+rnd(-20,20),y:b.anv.y,z:34,vx:rnd(-160,160),vy:rnd(-80,80),vz:rnd(60,200),drag:2,life:.5,size:1.6,color:'#ffd070',len:.03});},
    broken(e,a){b.forge=0;for(const p of a.bl)if(!p.dead){p.onBreak=null;M.breakPart(p);}forgeDies(e);},
    cancel(e,a){b.forge=0;for(const p of a.bl||[])if(!p.dead){p.onBreak=null;M.breakPart(p);}},
    end(e,a){b.forge=0;for(const p of a.bl)if(!p.dead){p.onBreak=null;M.breakPart(p);}b.stack=Math.min(3,(b.stack||0)+1);b.defN=b.def0+Math.round(lv(e)/2)*b.stack;M.defNow(e);M.fail(e,'ปล่อยให้หลอมเกราะสำเร็จ');
      M.say(e,'เกราะหลอม +1!','#ff9a4a',20);M.banner(`เกราะหลอม ${b.stack} ชั้น — DEF สูงขึ้น ค้อนติดไฟ`,'red',2);
      M.hint(e,'หลบวงแดง · หลอมเกราะ: ขัดด้วยเกจ KO หรือทุบเครื่องเป่าลม ◎ 2 ตัว');}});}
function lavaWall(e){const b=e.mb,c=b.home,vert=(M.count(e,'lava')%2)===1,R=b.R,gap=100,off=rnd(-150,150);
  M.prop(e,{kind:'lavawall',x:vert?c.x-R:c.x,y:vert?c.y:c.y-R*.8,layer:'ground',life:6.2,fadeT:.3,v:vert?[160,0]:[0,130],hitT:0,
    update(q,dt){q.x+=q.v[0]*dt;q.y+=q.v[1]*dt;q.hitT-=dt;const inB=vert?Math.abs(player.x-q.x)<30:Math.abs(player.y-q.y)<26,inG=vert?Math.abs(player.y-(c.y+off))<gap/2:Math.abs(player.x-(c.x+off))<gap/2;
      if(inB&&!inG&&q.hitT<=0&&player.hp>0){q.hitT=.5;M.hit(e,.7,{dot:['mbBurn',3,1]});}},
    draw(q,x,y,t){ctx.save();for(let i=-16;i<=16;i++){const al=i*R/16,px=vert?q.x:c.x+al,py=vert?c.y+al*.8:q.y;if(vert?Math.abs(al*.8-off)<gap/2:Math.abs(al-off)<gap/2)continue;
      const [sx,sy]=P(px,py);G.glow(sx,sy,26,'#ff6a1a',.5);G.ell(sx,sy,14,7,'#ffb040','#7a1a08',1.5);}ctx.restore();}});}
})();
