/* =====================================================================
   WORLD BOSS — Tuesday: BURUMBA, THE WAR-DRUM MAMMOTH (WORLD_BOSS_WEEK_TH.md §5). Core: world_boss.js.
   • 4 war drums ◎ on its fortress (shoot them from ≥ 150): every 4th beat a row of spirit soldiers marches in from a ghost gate,
     hunting healers and shooters · a broken drum = one ghost fewer per row and rage −1 · 2 broken = 'last stand', the rest beat twice
     as fast.
   • The charge (every 75 s, enraged 40): it paws the ground 3 s along a wide red lane; a blue ✓ SHIELD LINE crosses the lane.
     3 + N/8 people in it (guard-gem shield counts 2; enraged / advanced +2) → it crashes into the wall of people, stunned = window
     15 s (the line takes ×10 through DEF). Too few → it tramples the whole lane (×18 + down) and RAGE +1 (every move + Lv × 2).
   • Gem question 'guard or rage': a guard-gem shield counts as 2 people in the line; a raging hero hits harder while hurt.
   • Moves: tusk sweep 8 s (front half ×12) · trunk grab 20 s (the one standing in front longest is carried off — hit the trunk ◎
     or be thrown to the back of the field ×8) · stomp 14 s (round it ×9).
   • Advanced: the charge comes twice — after the first it turns and charges a new lane 4 s later (re-form the line).
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1221/1212,1:1215/1225},FRONT=.75;
const DRUMS=[[.45,.165],[.31,.315],[.705,.29],[.58,.105]];
const GATES=[[72,416],[1462,416]];
let st=null;
const units=()=>WB.units();
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}
const SPR=['Undying Viking','Skeleton Soldier','Wraith Knight','Chain Wraith'];

function setup(S){const B=S.B,N=S.N;st=S.st={rage:0,beat:0,beatT:1,drums:DRUMS.map((d,i)=>({i,hp:Math.round(18000*N*(S.adv?1.6:1)),max:Math.round(18000*N*(S.adv?1.6:1)),broken:0,p:null})),
  gate:0,front:new Map(),charge:null,trunk:null,home:{x:B.x,y:B.y},gates:GATES.map(g=>{const [x,y]=WB.F2W(g[0],g[1]);return {x,y};})};
  MB.cd(B,'charge',30);MB.cd(B,'tusk',6);MB.cd(B,'grab',14);MB.cd(B,'stomp',10);}
function build(S){st=S.st;const B=S.B;st.body=WB.body({dx:-20,dy:-26,r:126,h:140,name:'Burumba'});
  st.drums.forEach((q,i)=>{if(q.broken)return;const [dx]=off(S,DRUMS[i][0],DRUMS[i][1]);q.p=WB.part({x:B.x+dx,y:B.y-36,fol:[dx,-36],name:'War Drum',th:'กลองศึก',hp:q.hp,r:20,h:56,job:'part',kind:'drum',data:{i},
      def:60,mdef:30,flee:0,minD:150,noNear:1,auto:0,onBreak:()=>drumBreak(S,i)});q.p.maxHp=q.max;q.p.hp=q.hp;});}
function drumBreak(S,i){const q=st.drums[i];q.broken=1;q.hp=0;st.rage=Math.max(0,st.rage-1);S.addDmg=st.rage*2;const left=st.drums.filter(d=>!d.broken).length;
  MB.banner(left===2?'🥁 กลองแตก 2 ใบ — ยืนหยัดครั้งสุดท้าย! กลองที่เหลือตีเร็วขึ้นเท่าตัว':'🥁 กลองศึกแตก! ทัพวิญญาณลดลง · ความเดือด −1','gold',2.4);try{shake(3);}catch(e){}
  const s=WB.picAt(DRUMS[i][0],DRUMS[i][1]);if(s)addFx({layer:'top',t:0,x:s[0],y:s[1],update(dt){this.t+=dt;return this.t<.8;},draw(){const k=this.t/.8;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-k;
    const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,90*k+20);g.addColorStop(0,'rgba(255,200,230,.9)');g.addColorStop(1,'rgba(255,120,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,90*k+20,0,T2);ctx.fill();ctx.restore();}});}

/* ---------------- ghost army ---------------- */
function prey(e){const L=units();let best=null,bd=1e9;for(const u of L){const soft=u.pl?(typeof BASIC_RANGE!=='undefined'&&BASIC_RANGE>150):(u.role==='healer'||u.role==='mage'||u.role==='archer');const d=hyp(u.x-e.x,u.y-e.y)*(soft?.55:1);if(d<bd){bd=d;best=u;}}return best;}
function ghostRow(S){const n=st.drums.filter(d=>!d.broken).length;if(!n)return;if(S.adds.filter(e=>!e.dead).length>=16)return;const g=st.gates[st.gate++%2];
  for(let i=0;i<n;i++){const e=WB.add({x:g.x+rn(-30,30),y:g.y+(i-(n-1)/2)*46,spr:SPR[(st.beat+i)%SPR.length],name:'Spirit Soldier',th:'ทหารวิญญาณ',hp:Math.round(WB.PU.lv*40),lv:60,flee:40,spd:62,r:16,sc:.9,pts:15,k:3,atkT:1.6,
    goal:e2=>{const u=prey(e2);return u?{x:u.x,y:u.y,u,reach:40}:null;}});e.m.tint='#b8e0ff';}
  MB.banner('🥁 ทัพวิญญาณเดินทัพเข้ามา!','purple',1.4);}

/* ---------------- the charge ---------------- */
function charge(S,second){const B=S.B,us=units();let best=FRONT,bn=-1;for(let k=0;k<16;k++){const a=k/16*T2;let c=0;for(const u of us)if(Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.4)c++;
    let L=0;for(let r=150;r<1100;r+=50){if(mapBlockedW(B.x+Math.cos(a)*r,B.y+Math.sin(a)*r))break;L=r;}if(L<500)continue;c+=L/400;if(second)c-=Math.cos(a-st.lastA)*3;if(c>bn){bn=c;best=a;}}
  let len=0;for(let r=150;r<1300;r+=40){if(mapBlockedW(B.x+Math.cos(best)*r,B.y+Math.sin(best)*r))break;len=r;}len=Math.max(420,len-60);st.lastA=best;
  const need=3+Math.round(S.N/8)+(S.enr?2:0)+(S.adv?2:0),lineD=Math.min(360,len*.55),cx=B.x+Math.cos(best)*lineD,cy=B.y+Math.sin(best)*lineD,pp=best+Math.PI/2,LL=280;
  const lane={k:'rect',x:B.x,y:B.y,phi:best,len,w:170};const T=second?4:3;
  const z=WB.zone({shape:{k:'rect',x:cx-Math.cos(pp)*LL/2,y:cy-Math.sin(pp)*LL/2,phi:pp,len:LL,w:58},need,life:T,label:'แนวโล่!',
    weight:u=>u.pl&&guardOn()?2:1});WB.crew(z,WB.need(need));
  st.charge={phi:best,len,lineD,z,ok:null,second};
  WB.act({name:second?'เลี้ยวกลับพุ่งชนอีกเส้น — แนวโล่!':'ตะกุยดิน — ตั้งแนวโล่ขวาง!',T:T,
    start(){WB.strike({shape:lane,T,k:0,noHit:1,col:'red',boom:0});MB.banner(second?'🐘 มันเลี้ยวกลับ! ตั้งแนวโล่ใหม่ 4 วิ':'🐘 พุ่งชน! ยืนแนวโล่ฟ้าให้ครบ '+need+' คน','red',2.2);WB.poseTo({rot:-.05,px:.3,dx:-Math.cos(best)*16,dy:-Math.sin(best)*16});},
    step(B2,a){B.pose.shake=a.t>T-1?2:0;},
    end(){B.pose.shake=0;run(S,z.n>=need);}});}
const guardOn=()=>{try{const f=window.totemGems&&totemGems.fxs&&totemGems.fxs();return !!(f&&f.GU&&f.GU.sh>0);}catch(e){return false;}};
function run(S,ok){const B=S.B,c=st.charge,x0=B.x,y0=B.y,stop=ok?c.lineD-60:c.len,hit=new Set();
  WB.act({name:ok?'ชนแนวโล่!':'เหยียบทั้งเส้น!',T:Math.max(.3,stop/760),
    start(){WB.poseTo({rot:.04,px:.6,spd:12});},
    step(B2,a){const d=Math.min(stop,a.t*760);B.x=x0+Math.cos(c.phi)*d;B.y=y0+Math.sin(c.phi)*d;
      if(!ok)for(const u of units()){if(hit.has(u))continue;const v=-(u.x-x0)*Math.sin(c.phi)+(u.y-y0)*Math.cos(c.phi),w2=(u.x-x0)*Math.cos(c.phi)+(u.y-y0)*Math.sin(c.phi);if(Math.abs(v)<95&&w2<d+60&&w2>d-60){hit.add(u);WB.dmg(u,18,{cc:['stun',1],push:80,from:c.phi+(v>0?Math.PI/2:-Math.PI/2)});}}},
    end(){WB.poseTo();try{shake(ok?6:4);}catch(e){}
      if(ok){for(const u of c.z.on)WB.dmg(u,10,{tank:1});MB.say(B,'ชนกำแพงคน!','#ffe08a',22);WB.window(15,'ชนแนวโล่! มึน');st.back=1;}
      else{st.rage++;S.addDmg=st.rage*2;MB.banner(`💢 เหยียบทั้งเส้น! ความเดือด ${st.rage} (ทุกท่า + เลเวล × ${st.rage*2})`,'red',2.2);
        if(S.adv&&!c.second){st.back=0;charge(S,true);return;}st.back=1;}
      if(S.adv&&!c.second&&ok){st.again=1;}}});
  MB.cd(B,'charge',S.enr?40:75);}
function walkHome(S,dt){const B=S.B,dx=st.home.x-B.x,dy=st.home.y-B.y,L=hyp(dx,dy);if(L<4){B.x=st.home.x;B.y=st.home.y;st.back=0;return true;}const v=Math.min(L,140*dt);B.x+=dx/L*v;B.y+=dy/L*v;return false;}

/* ---------------- moves ---------------- */
function tusk(S){const B=S.B;let best=FRONT,bn=-1;for(let k=-4;k<=4;k++){const a=FRONT+k*.4;let c=0;for(const u of units())if(hyp(u.x-B.x,u.y-B.y)<260&&Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<1.5)c++;if(c>bn){bn=c;best=a;}}
  WB.act({name:'งากวาด!',T:1.05,start(){WB.strike({shape:{k:'wedge',x:B.x,y:B.y,a0:best-1.5,a1:best+1.5,r:250},T:1,k:12,boomCol:'#ffd0e0'});WB.poseTo({rot:.05,px:.7});},end(){WB.poseTo();}});MB.cd(B,'tusk',8);}
function stomp(S){const B=S.B;WB.act({name:'กระทืบ!',T:1.05,start(){WB.strike({shape:{k:'circle',x:B.x,y:B.y-20,r:215},T:1,k:9,cc:['air',.5],boomCol:'#e8c8a8'});WB.poseTo({rot:-.08,px:.3,lift:8});},end(){WB.poseTo();try{shake(4);}catch(e){}}});MB.cd(B,'stomp',14);}
function trunkPt(S){const B=S.B,[dx,dy]=off(S,.87,1.02);return {x:B.x+dx,y:B.y+dy};}
function grab(S){const B=S.B;let best=null,bt=-1;for(const u of units()){const t=st.front.get(u)||0;if(t>bt){bt=t;best=u;}}if(!best||bt<1.5){MB.cd(B,'grab',4);return;}
  const tp=trunkPt(S),u=best;WB.act({name:'งวงคว้า!',T:1,start(){WB.strike({shape:{k:'rect',x:tp.x,y:tp.y,phi:Math.atan2(u.y-tp.y,u.x-tp.x),len:hyp(u.x-tp.x,u.y-tp.y)+40,w:60},T:1,k:0,noHit:1,col:'red',boom:0});},
    end(){if(!u.alive()||hyp(u.x-tp.x,u.y-tp.y)>460)return;const tr=WB.part({x:tp.x,y:tp.y,fol:[tp.x-B.x,tp.y-B.y],name:'Trunk',th:'งวงช้าง — ตีให้ปล่อย!',hp:Math.round(WB.PU.lv*70),r:26,h:70,job:'part',kind:'trunk',auto:0,def:20,mdef:20,flee:0,
        onBreak:()=>{const t=st.trunk;if(t&&!t.u.pl)t.u.ccT=0;st.trunk=null;MB.say(B,'ปล่อยแล้ว!','#9fffb0',18);}});st.trunk={p:tr,u,t:5};
      if(u.pl)MB.pc('grab',5,{pos:()=>{const q=trunkPt(S);return [q.x,q.y+10];},free:()=>!st.trunk||st.trunk.p.dead,end:(timeout)=>{if(timeout)throwBack(S,u);}});
      else u.ccT=5;MB.banner(u.pl?'✋ ถูกงวงคว้า! ให้เพื่อนตีงวง ◎ (หรือรอถูกเหวี่ยง)':'✋ งวงคว้า'+u.name+' — ตีงวง ◎!','red',2);}});
  MB.cd(B,'grab',20);}
function throwBack(S,u){const B=S.B,a=Math.atan2(B.y-st.home.y,B.x-st.home.x)+Math.PI*.9+rn(-.3,.3);let tx=st.home.x,ty=st.home.y;for(let r=900;r>200;r-=40){const x=st.home.x+Math.cos(a)*r,y=st.home.y+Math.sin(a)*r;if(!mapBlockedW(x,y)){tx=x;ty=y;break;}}
  u.x=tx;u.y=ty;WB.dmg(u,8,{sure:1,cc:['stun',1]});try{dustPuff(tx,ty,8,'#c8a888',80,10);}catch(e){}if(st.trunk&&st.trunk.p&&!st.trunk.p.dead){st.trunk.p.dead=true;st.trunk.p.gone=1;}st.trunk=null;}

function think(S,dt){const B=S.B;if(st.back){walkHome(S,dt);return;}
  if(MB.ready(B,'charge')){charge(S,false);return;}
  if(MB.ready(B,'grab')&&!st.trunk){grab(S);return;}
  if(MB.ready(B,'stomp')){stomp(S);return;}if(MB.ready(B,'tusk')){tusk(S);return;}}
function tick(S,dt){st=S.st;const B=S.B;
  st.drums.forEach((q,i)=>{const p=q.p;if(!p||p.dead)return;q.hp=p.hp;const s=WB.picAt(DRUMS[i][0],DRUMS[i][1]);if(s){p.z0=Math.max(0,WB.zFor(p.x,p.y,s[0],s[1]));p.z=p.z0;}});
  if(S.state!=='fight')return;
  if(st.trunk){const t=st.trunk;t.t-=dt;if(!t.u.pl){const q=trunkPt(S);if(!t.p.dead&&t.u.alive()){t.u.x=q.x;t.u.y=q.y+10;}if(t.t<=0&&!t.p.dead)throwBack(S,t.u);}}
  /* who stands in front of it, and for how long (the trunk's pick) */
  for(const u of units()){const d=hyp(u.x-B.x,u.y-B.y),a=Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),FRONT));st.front.set(u,d<330&&a<.8?(st.front.get(u)||0)+dt:0);}
  if(S.win>0||st.back)return;
  const live=st.drums.filter(d=>!d.broken).length;if(!live)return;
  st.beatT-=dt*(live<=2?2:1);if(st.beatT<=0){st.beatT=2;st.beat++;drumFx(S);if(st.beat%4===0)ghostRow(S);}}
function winEnd(S){st.back=1;if(st.again){st.again=0;st.back=0;charge(S,true);}}

/* ---------------- allies ---------------- */
function allyJob(a,S){if(st.trunk&&st.trunk.p&&!st.trunk.p.dead&&(a.role==='melee'||a.role==='crit'||a.role==='archer'))return {tgt:st.trunk.p};
  const gh=S.adds.filter(e=>!e.dead);if(gh.length&&(a.role==='melee'&&a.id%2||a.role==='tank'&&a.id===3)){let b=null,bd=1e9;for(const e of gh){const d=hyp(e.x-a.x,e.y-a.y);if(d<bd){bd=d;b=e;}}if(b)return {tgt:b};}
  if(a.role==='mage'||a.role==='archer'||a.role==='healer'){const dl=st.drums.filter(q=>!q.broken&&q.p&&!q.p.dead).map(q=>q.p).sort((x,y)=>x.hp-y.hp);if(dl.length&&!(S.win>0))return {tgt:dl[0],out:1};}
  return null;}
const target=(a,S)=>st.body&&!st.body.dead?st.body:null;

/* ---------------- drawing ---------------- */
function drumFx(S){st.drums.forEach((q,i)=>{if(q.broken)return;q.hitT=gameTime;});}
function drawOn(S){st.drums.forEach((q,i)=>{const s=WB.picAt(DRUMS[i][0],DRUMS[i][1]);if(!s)return;const [x,y]=s;ctx.save();
    if(q.broken){ctx.globalAlpha=.75;ctx.fillStyle='rgba(40,20,30,.6)';ctx.beginPath();ctx.ellipse(x,y,26,14,0,0,T2);ctx.fill();ctx.strokeStyle='#e8d0d8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-12,y-6);ctx.lineTo(x+2,y+2);ctx.lineTo(x+12,y-4);ctx.stroke();ctx.restore();return;}
    const k=Math.max(0,1-(gameTime-(q.hitT||-9))/.3);if(k>0){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,40+k*20);g.addColorStop(0,`rgba(255,160,210,${.7*k})`);g.addColorStop(1,'rgba(255,100,170,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,40+k*20,0,T2);ctx.fill();ctx.globalCompositeOperation='source-over';}
    const r=24,h=q.hp/q.max;ctx.lineWidth=5;ctx.strokeStyle='rgba(20,10,4,.6)';ctx.beginPath();ctx.arc(x,y,r,0,T2);ctx.stroke();ctx.strokeStyle='#ff8ac0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+T2*h);ctx.stroke();
    ctx.setLineDash([5,4]);ctx.lineDashOffset=-gameTime*20;ctx.lineWidth=1.6;ctx.strokeStyle='#ffd23a';ctx.beginPath();ctx.arc(x,y,r+5,0,T2);ctx.stroke();ctx.setLineDash([]);
    ctx.font='700 12px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x+r+8,y+4);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x+r+8,y+4);ctx.restore();});
  if(st.trunk&&st.trunk.p&&!st.trunk.p.dead){const q=trunkPt(S),[x,y]=P(q.x,q.y,60);ctx.save();ctx.font='700 14px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎ ตีงวง!',x,y-30);ctx.fillStyle='#ffd23a';ctx.fillText('◎ ตีงวง!',x,y-30);ctx.restore();}}
function drawGround(S){for(const g of st.gates){const [x,y]=P(g.x,g.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.35+.15*Math.sin(gameTime*3);ctx.strokeStyle='#a8d8ff';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.lineDashOffset=-gameTime*20;ctx.beginPath();ctx.arc(0,0,60,0,T2);ctx.stroke();ctx.restore();}}
function hud(S){const live=st.drums.filter(d=>!d.broken).length,ac=S.B.mb.act;
  const ph=S.win>0?'✦ ชนแนวโล่จนมึน! ตีได้เต็มที่':st.charge&&ac&&/โล่/.test(ac.name||'')?'🐘 ไปยืนแนวโล่ฟ้า ✓ ขวางทาง — ให้ครบคน':st.trunk?'✋ งวงคว้าคน — ตีงวง ◎ ให้ปล่อย':
    `ยิงกลองบนหลังจากไกล ≥ 150 · ทัพวิญญาณมาทุกจังหวะที่ 4${live<=2&&live>0?' (ยืนหยัดครั้งสุดท้าย: เร็วเท่าตัว)':''}`;
  return {main:{v:S.hp,m:S.hpMax,lab:'🐘 บุรุมบา'},subs:st.rage?[{v:st.rage,m:Math.max(5,st.rage),lab:`ความเดือด ${st.rage} — ทุกท่า + เลเวล × ${st.rage*2}`,col:'linear-gradient(#ff9a9a,#c8202a)'}]:[],
    icons:st.drums.map((q,i)=>({t:'🥁 '+(q.broken?'แตก':Math.ceil(q.hp/q.max*100)+'%'),off:q.broken,col:'#ff8ac0'})),phase:ph};}
WB.def('burumba',{hp:N=>210000*N,solid:[138,60,-34,-16],shadow:[240,92],shOff:28,r:150,race:'Brute',el:'Earth 2',
  setup,build,think,tick,winEnd,allyJob,target,pickDefault:S=>st.body,drawOn,drawGround,hud,
  enrage(S){MB.cd(S.B,'charge',Math.min(S.B.mb.cd.charge||40,40));},finish(S){WB.poseTo({lift:-4,sy:.95});},
  dbg:S=>({rage:st.rage,beat:st.beat,drums:st.drums.map(q=>q.broken?0:q.hp),back:st.back,trunk:!!st.trunk})});
})();
