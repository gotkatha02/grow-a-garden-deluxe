/* =====================================================================
   WORLD BOSS — Thursday: BRONTARA, THE THUNDERBIRD (WORLD_BOSS_WEEK_TH.md §7). Core: world_boss.js.
   • In the sky (150 up): only hits from ≥ 150 reach it. Every 6 s (enraged 3.5) it strikes the 5 people who stood still the
     longest (8 enraged): red circles ×10.
   • Lightning rods (5 round the peak): 3 people (enraged 4) standing in a rod's blue ✓ circle for 4 s wake it for 35 s.
     A strike that lands within 200 of an awake rod is DRAWN INTO the rod (no damage, charge +1). 3 charges → the rods fire back,
     the bird crashes down = window 18 s (melee can hit). Taking off again = wing slam round it (×12 + push), the rods sleep again.
   • Storm eye: a purple circle rides one person 4 s, then a great bolt (×18) — carry it to an awake rod (absorbed, charge +1).
   • Gem question 'it eats lightning': volt-gem hits on the bird feed the storm (strikes come faster) · a totem-gem pillar soaks
     a strike that lands near it.
   • Moves: talon dive at a rod being woken (line ×14) · wing gust 20 s (wide lane, pushes away) · sky feathers 12 s (a row of ×7).
   • Advanced: strikes jump on to the next person within 120 (up to 4) — spread out, except round awake rods (they drink it all).
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1180/1230,1:1239/1237};
let st=null;
const units=()=>WB.units();
const LIFT=-128;   /* grounded: the picture drops from 150 to 22 */

function setup(S){const B=S.B;st=S.st={rods:[],ch:0,down:0,sT:4,feed:0,eyeT:16,crewZ:null,crewT:0,body:null};MB.cd(B,'gust',14);MB.cd(B,'feather',8);MB.cd(B,'dive',0);}
function build(S){st=S.st;const B=S.B;
  if(!st.rods.length)for(const {o,x,y} of WB.mapObjs('wbBrRod0'))st.rods.push({x,y,cx:x,cy:y+72,awake:0,prog:0,o});
  for(const r of st.rods)WB.hideObj(r.o);
  st.body=WB.body({dx:0,dy:-20,r:120,h:150,name:'Brontara',minD:150,noTxt:'อยู่บนฟ้า — ต้องยิงจากไกล ≥ 150'});}
const needN=S=>S.enr?4:3;
const awakeRods=()=>st.rods.filter(r=>r.awake>0);
const nearAwake=(x,y)=>awakeRods().some(r=>hyp(r.x-x,r.y-y)<200);
const nearPole=(x,y)=>{try{const f=window.totemGems&&totemGems.fxs&&totemGems.fxs();return !!(f&&f.PIL&&f.PIL.some(p=>hyp(p.x-x,p.y-y)<150));}catch(e){return false;}};

/* ---------------- lightning ---------------- */
function strike(S,x,y,k,r,purple,track){let w;w=WB.strike({shape:{k:'circle',x,y,r},T:purple?4:1.6,k,magic:1,col:purple?'purple':'red',boom:0,track,
    pre(w2){const s=w2.shape;w2.abs=nearAwake(s.x,s.y)?'rod':nearPole(s.x,s.y)?'pole':null;},
    only:u=>!w.abs,
    onFire(hit,w2){const s=w2.shape;boltFx(s.x,s.y,purple);if(w2.abs==='rod'){const r=awakeRods().sort((a,b)=>hyp(a.x-s.x,a.y-s.y)-hyp(b.x-s.x,b.y-s.y))[0];rodBolt(r,s);charge(S);}
      else if(w2.abs==='pole'){WB.say(s.x,s.y,60,'เสาโทเท็มดูดไว้!','#ffe08a',15);}
      else if(S.adv&&!purple){let from=hit.slice(),n=0;const done=new Set(hit);while(from.length&&n<4){const a=from.shift();const b=units().find(u=>!done.has(u)&&hyp(u.x-a.x,u.y-a.y)<120&&!nearAwake(u.x,u.y));if(!b)continue;done.add(b);n++;WB.dmg(b,6,{magic:1,sure:1});chainFx(a,b);from.push(b);}}}});
  return w;}
function volley(S){const n=S.enr?8:5,L=units().slice().sort((a,b)=>(b.still||0)-(a.still||0)).slice(0,n);for(const u of L)strike(S,u.x,u.y,10,85,0);}
function charge(S){if(st.down)return;st.ch=Math.min(3,st.ch+1);MB.say(S.B,'เสาดูดสายฟ้า! '+st.ch+'/3','#9fe8ff',18);if(st.ch>=3&&!st.down)crash(S);}
function crash(S){const B=S.B;st.down=1;st.ch=0;for(const r of awakeRods())rodBolt(r,{x:B.x,y:B.y,up:1});MB.banner('⚡ เสาล่อฟ้ายิงย้อน! นกอัสนีร่วงลงพื้น','gold',2.6);
  WB.poseTo({lift:LIFT,rot:.18,px:.5,py:.94,spd:5});setTimeout(()=>{if(WB.S===S&&st.down){try{shake(7);}catch(e){}WB.window(18,'นกร่วง! ตีใกล้ได้');}},700);}
function takeOff(S){const B=S.B;WB.act({name:'ฟ้าคำราม — บินขึ้น!',T:1.3,start(){WB.strike({shape:{k:'circle',x:B.x,y:B.y,r:265},T:1.25,k:12,magic:1,push:220,boomCol:'#cfe8ff'});WB.poseTo({lift:LIFT+30,rot:-.06});},
  end(){st.down=0;st.ch=0;WB.poseTo({lift:0,spd:3});for(const r of st.rods){r.awake=0;r.prog=0;}if(st.crewZ)st.crewZ.done=1;st.crewZ=null;}});}
function eye(S){const L=units();if(!L.length)return;const u=L.find(q=>q.pl&&q.alive())&&Math.random()<.5?WB.PU:L[Math.floor(Math.random()*L.length)];
  strike(S,u.x,u.y,18,95,1,(w)=>{if(w.t<w.life-.6&&u.alive()){w.shape.x=u.x;w.shape.y=u.y;}});
  if(u.pl)MB.banner('🌩 ตาพายุบนตัวคุณ! วิ่งไปหาเสาที่ตื่น','purple',2.2);st.eyeU=u;}

/* ---------------- moves ---------------- */
function dive(S,r){const B=S.B;const phi=Math.atan2(r.cy-B.y,r.cx-B.x),len=hyp(r.cx-B.x,r.cy-B.y)+80;
  WB.act({name:'ดิ่งกรงเล็บใส่คนปลุกเสา!',T:1.35,start(){WB.strike({shape:{k:'rect',x:B.x,y:B.y,phi,len,w:120},T:1.3,k:14,boomCol:'#ffd890'});WB.poseTo({lift:-60,dx:Math.cos(phi)*30,dy:Math.sin(phi)*30,spd:5});},end(){WB.poseTo();}});
  MB.cd(B,'dive',10);}
function gust(S){const B=S.B;let best=0,bn=-1;for(let k=0;k<12;k++){const a=k/12*T2;let c=0;for(const u of units())if(Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.45)c++;if(c>bn){bn=c;best=a;}}
  WB.act({name:'ลมปีก!',T:1.35,start(){WB.strike({shape:{k:'rect',x:B.x,y:B.y,phi:best,len:900,w:320},T:1.3,k:3,push:260,from:best,boomCol:'#e8f0ff'});WB.poseTo({sx:1.06,sy:.96});},end(){WB.poseTo();}});MB.cd(B,'gust',20);}
function feathers(S){const B=S.B,u=units()[Math.floor(Math.random()*Math.max(1,units().length))];if(!u)return;const phi=Math.atan2(u.y-B.y,u.x-B.x);
  for(let i=0;i<5;i++){const d=120+i*110,x=B.x+Math.cos(phi)*d+rn(-30,30),y=B.y+Math.sin(phi)*d+rn(-20,20);WB.strike({shape:{k:'circle',x,y,r:60},T:.8+i*.12,k:7,boomCol:'#ffc890'});}MB.cd(B,'feather',12);}

/* ---------------- rods: waking, crews ---------------- */
function rodTick(S,dt){const need=needN(S);
  for(const r of st.rods){if(r.awake>0){r.awake-=dt;if(r.awake<=0){r.awake=0;r.prog=0;}continue;}
    let n=0;for(const u of units()){if(!u.pl&&!(st.crewZ&&st.crewZ.rod===r&&st.crewZ.crew&&st.crewZ.crew.includes(u)))continue;if(hyp(u.x-r.cx,u.y-r.cy)<85)n++;}r.n=n;
    if(n>=need){r.prog+=dt;if(r.prog>=4){r.awake=35;r.prog=0;MB.banner('⚡ เสาล่อฟ้าตื่นแล้ว! ยืนใกล้เสาให้สายฟ้าลงใกล้ๆ','blue',2.2);for(const u of units())if(hyp(u.x-r.cx,u.y-r.cy)<90)WB.pts(u,'mech',25);
      if(st.crewZ&&st.crewZ.rod===r){st.crewZ.done=1;st.crewZ=null;}}}else r.prog=Math.max(0,r.prog-dt*.5);}
  /* the spirit warriors wake one rod at a time (all but one place: you are the last — after 25 s they bring their own) */
  if(st.down)return;if(awakeRods().length>=2){if(st.crewZ){st.crewZ.done=1;st.crewZ=null;}return;}
  if(!st.crewZ){const sl=st.rods.filter(r=>!r.awake).sort((a,b)=>hyp(a.cx-player.x,a.cy-player.y)-hyp(b.cx-player.x,b.cy-player.y));if(!sl.length)return;
    const r=sl[0];st.crewZ={rod:r,shape:{k:'circle',x:r.cx,y:r.cy,r:85},crew:[],dead:0,done:0,t:0};WB.crew(st.crewZ,WB.need(need),['tank','melee','crit','healer','archer','mage']);}
  else{const z=st.crewZ;z.t+=dt;if(z.t>25&&z.crew.length<need){const more=WB.S.allies.filter(a=>!a.dead&&!a.busy&&a.role!=='mage').sort((a,b)=>hyp(a.x-z.shape.x,a.y-z.shape.y)-hyp(b.x-z.shape.x,b.y-z.shape.y)).slice(0,need-z.crew.length);for(const a of more){z.crew.push(a);a.busy=z;a.reT=0;}}}}

function think(S,dt){const B=S.B;if(st.down)return;
  const w=st.rods.find(r=>!r.awake&&r.prog>.6);if(w&&MB.ready(B,'dive')){dive(S,w);return;}
  if(MB.ready(B,'gust')){gust(S);return;}if(MB.ready(B,'feather')){feathers(S);return;}}
function tick(S,dt){st=S.st;const B=S.B;S.noSolid=!st.down;if(st.body&&!st.body.dead)st.body.minD=st.down?0:150;
  if(S.state!=='fight')return;rodTick(S,dt);
  st.feed=Math.max(0,st.feed-dt*.2);
  if(!st.down&&!(S.win>0)){st.sT-=dt;if(st.sT<=0){st.sT=Math.max(2.5,(S.enr?3.5:6)-st.feed);volley(S);}
    st.eyeT-=dt;if(st.eyeT<=0){st.eyeT=25;eye(S);}}}
function onHit(S,p,d,u,o){if(p.pkind==='body'&&u.pl&&WB.mutOf(o.sk)==='volt'){st.feed=Math.min(3,st.feed+.25);if(!p._vT||gameTime-p._vT>1){p._vT=gameTime;WB.say(p.x,p.y,180,'มันกินสายฟ้า! พายุถี่ขึ้น','#9fe8ff',14);}}}
function winEnd(S){if(st.down)takeOff(S);}

/* ---------------- allies ---------------- */
function allyJob(a,S){if(st.down)return null;const ar=awakeRods();
  if((a.role==='melee'||a.role==='crit'||a.role==='tank')&&ar.length){const r=ar[a.id%ar.length];const an=a.slot,d=60+(a.id%4)*28;return {x:r.x+Math.cos(an)*d,y:r.y+60+Math.sin(an)*d*.6,r:16};}
  if(a.role==='melee'||a.role==='crit'||a.role==='tank'){const c=S.camp;return {x:S.B.x+Math.cos(a.slot)*260,y:S.B.y+200+Math.sin(a.slot)*90,r:20};}
  return {tgt:st.body,rng:Math.max(200,a.R.rng*.8),min:190};}
const target=(a,S)=>st.body&&!st.body.dead?st.body:null;

/* ---------------- drawing ---------------- */
class RodFx{constructor(r){this.r=r;this.layer='sorted';this.sy=r.y;}update(){const S=WB.S;return !!S&&!S.gone&&S.key==='brontara';}
  draw(){const r=this.r,f=r.awake>0?(st.ch>=2?'brontara_rod2':'brontara_rod1'):'brontara_rod0',h=f==='brontara_rod2'?291:282;
    WB.drawPiece(f,r.x,r.y,h,.965,{flip:r.o&&r.o.flip,glow:r.awake>0?.12+.1*Math.sin(gameTime*8):0});
    if(r.awake>0){const [x,y]=P(r.x,r.y,h*.92);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,46);g.addColorStop(0,'rgba(200,240,255,.8)');g.addColorStop(1,'rgba(90,170,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46,0,T2);ctx.fill();ctx.restore();}}}
function drawGround(S){const need=needN(S);for(const r of st.rods){const [x,y]=P(r.cx,r.cy,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    if(r.awake>0){ctx.translate(0,(r.y-r.cy));ctx.globalAlpha=.18;ctx.fillStyle='#7ac8ff';ctx.beginPath();ctx.arc(0,0,200,0,T2);ctx.fill();ctx.globalAlpha=.7;ctx.strokeStyle='#cfeaff';ctx.lineWidth=2;ctx.setLineDash([10,8]);ctx.lineDashOffset=-gameTime*30;ctx.beginPath();ctx.arc(0,0,200,0,T2);ctx.stroke();ctx.setLineDash([]);}
    else{ctx.globalAlpha=.3;ctx.fillStyle='#2f9bff';ctx.beginPath();ctx.arc(0,0,85,0,T2);ctx.fill();ctx.globalAlpha=.85;ctx.lineWidth=3;ctx.strokeStyle='#cfeeff';ctx.setLineDash([10,7]);ctx.lineDashOffset=-gameTime*30;ctx.beginPath();ctx.arc(0,0,85,0,T2);ctx.stroke();ctx.setLineDash([]);
      if(r.prog>0){ctx.globalAlpha=1;ctx.lineWidth=6;ctx.strokeStyle='#ffe08a';ctx.beginPath();ctx.arc(0,0,92,-Math.PI/2,-Math.PI/2+T2*Math.min(1,r.prog/4));ctx.stroke();}}
    ctx.restore();if(!r.awake){ctx.save();ctx.font='600 13px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#0a1a30';const t=`ปลุกเสา ${r.n||0}/${need}`;ctx.strokeText(t,x,y+8);ctx.fillStyle='#dff2ff';ctx.fillText(t,x,y+8);ctx.restore();}}}
function boltFx(x,y,purple){addFx({layer:'top',t:0,update(dt){this.t+=dt;return this.t<.35;},draw(){const [X,Y]=P(x,y,0),k=this.t/.35;ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle=purple?'#e0b8ff':'#e8f6ff';ctx.lineWidth=purple?6:4;ctx.lineJoin='round';
  ctx.beginPath();let bx=X,by=Y-420;ctx.moveTo(bx,by);for(let i=0;i<9;i++){bx+=rn(-22,22);by+=420/9;ctx.lineTo(bx,by);}ctx.stroke();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(X,Y,0,X,Y,70);g.addColorStop(0,purple?'rgba(220,170,255,.9)':'rgba(200,235,255,.9)');g.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,Y,70,0,T2);ctx.fill();ctx.restore();}});}
function rodBolt(r,s){if(!r)return;addFx({layer:'top',t:0,update(dt){this.t+=dt;return this.t<.45;},draw(){const [ax,ay]=P(r.x,r.y,270),[bx,by]=s.up?P(s.x,s.y,330):P(s.x,s.y,0),k=this.t/.45;ctx.save();ctx.globalAlpha=1-k;ctx.strokeStyle='#bfe8ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ax,ay);
  for(let i=1;i<8;i++){const t=i/8;ctx.lineTo(ax+(bx-ax)*t+rn(-14,14),ay+(by-ay)*t+rn(-14,14));}ctx.lineTo(bx,by);ctx.stroke();ctx.restore();}});}
function chainFx(a,b){addFx({layer:'top',t:0,update(dt){this.t+=dt;return this.t<.3;},draw(){const [ax,ay]=P(a.x,a.y,40),[bx,by]=P(b.x,b.y,40);ctx.save();ctx.globalAlpha=1-this.t/.3;ctx.strokeStyle='#cfeaff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ay);for(let i=1;i<6;i++){const t=i/6;ctx.lineTo(ax+(bx-ax)*t+rn(-8,8),ay+(by-ay)*t+rn(-8,8));}ctx.lineTo(bx,by);ctx.stroke();ctx.restore();}});}
function hud(S){const ph=st.down?'✦ นกร่วง! ตีใกล้ได้':awakeRods().length?'⚡ ยืนใกล้เสาที่ตื่น — สายฟ้าที่ลงใกล้เสาถูกดูด ครบ 3 นกร่วง':'ยืนวงฟ้า ✓ ปลุกเสาล่อฟ้า (ยืน 4 วิ) · บนฟ้าตีได้แค่จากไกล ≥ 150';
  return {main:{v:S.hp,m:S.hpMax,lab:'⚡ บรอนทารา'},subs:[{v:st.ch,m:3,lab:`ประจุเสา ${st.ch} / 3`+(st.feed>.2?' · พายุถี่ขึ้น (กินสายฟ้า)':''),col:'linear-gradient(#cfeaff,#3a8ad8)'}],
    icons:st.rods.map((r,i)=>({t:'⚡ '+(r.awake>0?'ตื่น '+Math.ceil(r.awake)+'s':r.prog>0?'ปลุก '+Math.ceil(r.prog/4*100)+'%':'หลับ'),off:!r.awake&&!r.prog,col:'#8fd0ff'})),phase:ph};}
WB.def('brontara',{hp:N=>200000*N,solid:[118,52,-24],shadow:[220,90],shOff:20,r:150,fly:150,race:'Brute',el:'Wind 2',
  setup,build(S){build(S);for(const r of st.rods)addFx(new RodFx(r));},think,tick,onHit,winEnd,allyJob,target,pickDefault:S=>st.body,drawGround,hud,
  finish(S){WB.poseTo({lift:LIFT+20,rot:0,spd:2});},
  dbg:S=>({ch:st.ch,down:st.down,rods:st.rods.map(r=>r.awake>0?'A':r.prog>0?'p'+r.prog.toFixed(1):'-').join(''),crew:st.crewZ?st.crewZ.crew.length:0,feed:+st.feed.toFixed(2)})});
})();
