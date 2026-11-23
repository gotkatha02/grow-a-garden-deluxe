/* =====================================================================
   WORLD BOSS — Friday: LUMINA, THE MORNING-STAR SKY WHALE (WORLD_BOSS_WEEK_TH.md §8). Core: world_boss.js.
   Her main life is the star shard IN HER STOMACH (the map wbLuminaIn); outside, the whale takes a third (she floats 150 up: only
   hits from ≥ 150 reach her, except in the window).
   • Swallow (every 70 s, enraged 45): she opens her mouth 4 s and draws everyone in (walk against it); whoever stands in the cone in
     front of her mouth at the end is swallowed: 25 s in the stomach with the star shard ◎ (her real life) and acid every second
     (×2 enraged). Healing from outside does not reach in. Then she spits everyone out.
   • Cough: outside, hit the spot under her belly ◎ until its gauge is empty → she coughs everyone out early and is dizzy 12 s =
     the window (she sinks low: every hit lands, melee too).
   • Whale song (45 s): 3 sound rings with a ✓ gap + 4 song pearls ◎ floating round her — every pearl left when the song ends heals
     her Lv × 120.
   • Cloud dive (50 s): she sinks into the cloud sea and bursts up under the top dealer (big red circle 3 s, ×16 + up).
   • Gem question 'survive on your own in the stomach': leech supports, siphon / guard mutations.
   • Moves: tail 10 s (≥ 3 behind ×12) · fin sweep 13 s (a side half-circle ×9 + push) · star rain 18 s (small circles ×6).
   • Advanced: 4 crystal spines ◎ on her back (shoot from ≥ 150) — every one still standing adds +1 acid a second inside.
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1136/1230,1:1221/1245},FRONT=1.05,SPINES=[[.42,.27],[.52,.2],[.62,.2],[.72,.28]],LIFT=-110;
let st=null;
const units=r=>WB.units(r);
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}
const IN0=WB.F2W(770,505),INSTART={x:770*1.5,y:672*1.5};   /* the stomach: shard foot (world) · where the swallowed land (map px, below the shard, away from the way out) */   /* the stomach: shard foot (world) · arrival point (map px) */

function setup(S){const B=S.B,N=S.N;st=S.st={cg:0,CG:Math.round(600+N*20),goIn:[],cgT:0,inT:0,song:null,pearls:[],spines:SPINES.map((p,i)=>({i,hp:Math.round(12000*N*1.6),max:Math.round(12000*N*1.6),broken:0,p:null})),
  home:{x:B.x,y:B.y},back:0,down:0,body:null,belly:null,shard:null,acidT:0,dive:null};st.cg=st.CG;
  MB.cd(B,'swallow',25);MB.cd(B,'song',20);MB.cd(B,'dive',38);MB.cd(B,'tail',8);MB.cd(B,'fin',6);MB.cd(B,'rain',12);}
function mouth(S){const B=S.B,[dx,dy]=off(S,.9,1.12);return {x:B.x+dx,y:B.y+dy};}
function build(S){st=S.st;const B=S.B;
  if(S.room==='in'){const o=WB.mapObjs('wbLuShard')[0];const sx=o?o.x:IN0[0],sy=o?o.y:IN0[1];st.sx=sx;st.sy=sy;
    st.shard=WB.part({x:sx,y:sy+34,name:'Star Shard',th:'เศษหัวใจดาว (ชีวิตจริงของวาฬ)',hp:Math.max(1,S.hp),r:70,h:300,main:1,winOpen:1,job:'core',kind:'shard',auto:1,def:Math.round(B.m.def*.6),mdef:Math.round(B.m.mdef*.6),onBreak:()=>WB.end('win')});
    st.shard.maxHp=S.hpMax;st.shard.hp=Math.max(1,S.hp);return;}
  st.body=WB.body({dx:20,dy:-16,r:130,h:180,name:'Lumina',minD:150,dmgMul:.3});
  const [bx,by]=off(S,.62,1.0);st.belly=WB.part({x:B.x+bx,y:B.y+by,fol:[bx,by],name:'Belly',th:'จุดใต้ท้อง — ตีให้มันไอ',r:40,h:60,nohp:1,auto:0,noNear:1,job:'part',kind:'belly',def:10,mdef:10,flee:0,tlv:()=>[st.cg,st.CG],
    hitOK:()=>full(S)&&!st.down});st.belly.noTxt='ท้องว่าง — ไอตอนมีคนในท้อง';
  st.spines.forEach((q,i)=>{if(q.broken||!S.adv)return;const [dx]=off(S,SPINES[i][0],SPINES[i][1]);q.p=WB.part({x:B.x+dx,y:B.y-30,fol:[dx,-30],name:'Crystal Spine',th:'หนามคริสตัล',hp:q.hp,r:20,h:56,job:'part',kind:'spine',data:{i},def:60,mdef:20,flee:0,minD:150,noNear:1,auto:0,
      onBreak:()=>{q.broken=1;q.hp=0;MB.banner('💎 หนามคริสตัลแตก! กรดในท้องอ่อนลง','gold',2);}});q.p.maxHp=q.max;q.p.hp=q.hp;});
  for(const pr of st.pearls)if(!pr.dead)pearlPart(S,pr);}

/* ---------------- swallow · stomach · cough ---------------- */
function swallow(S){const B=S.B,m=mouth(S);let best=FRONT,bn=-1;for(let k=-3;k<=3;k++){const a=FRONT+k*.35;let c=0;for(const u of units())if(hyp(u.x-m.x,u.y-m.y)<450&&Math.abs(angDiff(Math.atan2(u.y-m.y,u.x-m.x),a))<.6)c++;if(c>bn){bn=c;best=a;}}
  const cone={k:'cone',x:m.x,y:m.y,phi:best,half:.62,r:430};
  WB.act({name:'อ้าปากสูดกลืน — เดินสวนออก!',T:4,
    start(){st.cone=cone;st.goIn=S.allies.filter(u=>!u.dead&&u.room!=='in'&&!u.busy&&u.ccT<=0&&(u.role==='melee'||u.role==='crit')).sort((p,q)=>hyp(p.x-m.x,p.y-m.y)-hyp(q.x-m.x,q.y-m.y)).slice(0,4);
      WB.strike({shape:cone,T:4,k:0,noHit:1,col:'red',boom:0});if(WB.PU.alive()&&hyp(player.x-m.x,player.y-m.y)<900)MB.pc('pull',4,{to:()=>[m.x,m.y],v:55,stop:30});WB.poseTo({lift:-30,sx:1.04,spd:4});
      MB.banner('🐋 ลูมินาสูดลม! เดินสวนออกจากกรวยหน้าปาก (หรือยอมเข้าไปทุบเศษในท้อง)','red',2.4);},
    step(B2,a,dt){for(const u of S.allies){if(u.dead||u.room==='in')continue;const d=hyp(u.x-m.x,u.y-m.y);if(d<900&&d>30){u.x+=(m.x-u.x)/d*55*dt;u.y+=(m.y-u.y)/d*55*dt;}}},
    end(){WB.poseTo();st.cone=null;st.goIn=[];const sw=units().filter(u=>MB.inShape(cone,u.x,u.y,4));if(!sw.length)return;st.inT=25;st.cg=st.CG;
      for(const u of sw){if(u.pl){S.swap=1;S.inT=25;try{mapTravel(S.inner,{x:INSTART.x+rn(-80,80),y:INSTART.y});}catch(e){}}else{u.room='in';u.x=IN0[0]+rn(-220,220);u.y=IN0[1]+rn(90,280);u.job=null;u.reT=0;u.busy=null;}}
      MB.banner('🐋 กลืน '+sw.length+' คนลงท้อง! ข้างนอกตีจุดใต้ท้อง ◎ ให้มันไอ','purple',2.4);}});
  MB.cd(B,'swallow',S.enr?45:70);}
function spit(S,why){const B=S.B,m=mouth(S);let n=0;for(const a of S.allies){if(a.room!=='in')continue;a.room='out';n++;const an=FRONT+rn(-.8,.8),r=rn(80,240);a.x=m.x+Math.cos(an)*r;a.y=m.y+Math.sin(an)*r;if(blkW(a.x,a.y)){a.x=S.camp.x;a.y=S.camp.y;}a.job=null;a.reT=0;}
  if(curMap===S.inner){const an=FRONT+rn(-.3,.3);let x=m.x+Math.cos(an)*150,y=m.y+Math.sin(an)*150;if(blkW(x,y)){x=S.camp.x;y=S.camp.y;}const q=W2M(x,y);try{mapTravel(S.map,{x:q.x,y:q.y});}catch(e){}}
  st.inT=0;if(why)MB.banner(why,'gold',2);}
const blkW=(x,y)=>{try{return mapBlockedW(x,y);}catch(e){return false;}};
function cough(S){MB.say(S.B,'แค่ก!!','#fff0c8',24);const inside=S.allies.some(a=>a.room==='in')||curMap===S.inner;if(inside)spit(S,'🐋 ไอพ่นทุกคนออกมาก่อนเวลา!');st.down=1;
  WB.poseTo({lift:LIFT,rot:.1,spd:4});WB.window(12,'วาฬไอจนมึน! ตีได้ทุกฮิต');}
const full=S=>st.inT>0&&(curMap===S.inner||S.allies.some(a=>!a.dead&&a.room==='in'));
const acidK=S=>(S.enr?2:1)+(S.adv?st.spines.filter(q=>!q.broken).length*.5:0);

/* ---------------- song · dive · moves ---------------- */
function pearlPart(S,pr){const B=S.B;pr.p=WB.part({x:B.x+pr.dx,y:B.y+pr.dy,fol:[pr.dx,pr.dy],z:110,name:'Song Pearl',th:'ไข่มุกเพลง',hp:pr.hp,r:22,h:50,job:'part',kind:'pearl',auto:0,noNear:1,def:10,mdef:10,flee:0,
  onBreak:()=>{pr.dead=1;pr.hp=0;}});pr.p.maxHp=pr.max;pr.p.hp=pr.hp;}
function song(S){const B=S.B;st.pearls=[0,1,2,3].map(i=>{const a=i/4*T2+.4;return {dx:Math.cos(a)*270,dy:Math.sin(a)*200,hp:Math.round(WB.PU.lv*60),max:Math.round(WB.PU.lv*60),dead:0,p:null};});
  if(S.room==='out')for(const pr of st.pearls)pearlPart(S,pr);let g=rn(0,T2);
  WB.act({name:'เพลงวาฬ — ทำลายไข่มุกเพลง ◎ ก่อนจบเพลง!',T:8,
    start(){MB.banner('🎵 เพลงวาฬ! คลื่นเสียง 3 วง (ช่องฟ้าปลอดภัย) · ตีไข่มุก ◎ ให้แตก','blue',2.4);},
    step(B2,a,dt){for(const t0 of [.3,2.8,5.3]){if(a.t>=t0&&!(a['w'+t0])){a['w'+t0]=1;g+=1.2;const gg=g;WB.strike({shape:{k:'donut',x:B.x,y:B.y,r0:140,r1:640,a0:gg+.6,a1:gg-.6+T2},T:1.4,k:6,magic:1,boomCol:'#cfe8ff',boomKind:'quiet'});}}},
    end(){let n=0;for(const pr of st.pearls){if(pr.dead)continue;n++;if(pr.p&&!pr.p.dead){pr.p.dead=true;pr.p.gone=1;}}st.pearls=[];if(n){WB.heal(WB.PU.lv*120*n);MB.banner(`🎵 ไข่มุกเหลือ ${n} ลูก — วาฬฟื้นเลือด`,'red',2);}}});
  MB.cd(B,'song',45);}
function dive(S){const B=S.B,u=WB.topDealer();if(!u){MB.cd(B,'dive',8);return;}let x=u.x,y=u.y;
  WB.act({name:'ดำลงทะเลเมฆ!',T:5,start(){WB.poseTo({alpha:0,lift:-170,spd:3});S.noTarget=1;if(st.body)st.body.hidden=1;},
    step(B2,a){if(a.t>=2&&!a.w){a.w=1;x=u.alive()?u.x:x;y=u.alive()?u.y:y;WB.strike({shape:{k:'circle',x,y,r:185},T:3,k:16,cc:['air',.9],boomCol:'#dff0ff'});}},
    end(){B.x=x;B.y=y;WB.poseTo({alpha:1,lift:0,spd:8});if(st.body)st.body.hidden=0;S.noTarget=0;try{shake(6);}catch(e){}st.back=1;}});
  MB.cd(B,'dive',50);}
function behindN(S){const B=S.B,a=FRONT+Math.PI;let n=0;for(const u of units())if(hyp(u.x-B.x,u.y-B.y)<300&&Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.9)n++;return n;}
function tail(S){const B=S.B;if(behindN(S)<3){MB.cd(B,'tail',4);return;}WB.act({name:'หางฟาด!',T:1.25,start(){WB.strike({shape:{k:'cone',x:B.x,y:B.y,phi:FRONT+Math.PI,half:.9,r:300},T:1.2,k:12,boomCol:'#e0f0ff'});},end(){}});MB.cd(B,'tail',10);}
function fin(S){const B=S.B,side=Math.random()<.5?1:-1,a=FRONT+side*Math.PI/2;WB.act({name:'ครีบปัด!',T:1.05,start(){WB.strike({shape:{k:'wedge',x:B.x,y:B.y,a0:a-1.4,a1:a+1.4,r:285},T:1,k:9,push:160,boomCol:'#e0f0ff'});WB.poseTo({rot:side*.06});},end(){WB.poseTo();}});MB.cd(B,'fin',13);}
function rain(S){const B=S.B;for(let i=0;i<8;i++){const a=rn(0,T2),r=rn(80,520);WB.strike({shape:{k:'circle',x:B.x+Math.cos(a)*r,y:B.y+Math.sin(a)*r*.85,r:56},T:.8+i*.06,k:6,magic:1,boomCol:'#fff6c0',boomKind:'quiet'});}MB.cd(B,'rain',18);}

function think(S,dt){const B=S.B;if(st.down)return;
  if(st.back){const dx=st.home.x-B.x,dy=st.home.y-B.y,L=hyp(dx,dy);if(L<6){st.back=0;B.x=st.home.x;B.y=st.home.y;}else{const v=Math.min(L,110*dt);B.x+=dx/L*v;B.y+=dy/L*v;}return;}
  if(MB.ready(B,'swallow')&&st.inT<=0){swallow(S);return;}if(MB.ready(B,'song')){song(S);return;}if(MB.ready(B,'dive')){dive(S);return;}
  if(MB.ready(B,'tail')){tail(S);return;}if(MB.ready(B,'fin')){fin(S);return;}if(MB.ready(B,'rain')){rain(S);return;}}
function tick(S,dt){st=S.st;const B=S.B;S.noSolid=1;
  if(st.body&&!st.body.dead)st.body.minD=st.down?0:150;
  st.spines.forEach((q,i)=>{const p=q.p;if(!p||p.dead)return;q.hp=p.hp;const s=WB.picAt(SPINES[i][0],SPINES[i][1]);if(s){p.z0=Math.max(0,WB.zFor(p.x,p.y,s[0],s[1]));p.z=p.z0;}});
  if(st.belly&&!st.belly.dead){const s=WB.picAt(.62,.8);if(s){st.belly.z0=Math.max(0,WB.zFor(st.belly.x,st.belly.y,s[0],s[1]));st.belly.z=st.belly.z0;}st.belly.hidden=S.room==='in'||B.pose.alpha<.3?1:0;}
  for(const pr of st.pearls)if(pr.p&&!pr.p.dead)pr.hp=pr.p.hp;
  if(curMap===S.inner)lockOut(S.state==='fight');
  if(S.state!=='fight')return;
  /* the stomach: acid, the inside fight, the 25 s */
  const inside=S.allies.filter(a=>!a.dead&&a.room==='in');const meIn=curMap===S.inner;
  if(st.inT>0||meIn){st.inT=Math.max(0,st.inT-dt);st.acidT+=dt;if(st.acidT>=1){st.acidT-=1;for(const u of units('in'))WB.dmg(u,acidK(S),{sure:1,magic:1});}
    if(st.inT<=0&&(inside.length||meIn))spit(S,'🐋 ครบ 25 วิ — ลูมินาพ่นทุกคนออกมา');}
  else st.acidT=0;
  if(st.down&&!(S.win>0)&&!B.mb.act){}}
function onHit(S,p,d,u,o){if(p.pkind==='belly'&&!st.down&&full(S)){st.cg-=u.pl?Math.min(6,o.mult||1)*7:5;if(st.cg<=0){st.cg=st.CG;cough(S);}}}
/* fighters in the other room: inside (the player is out) they keep breaking the shard · outside (the player is in) they hit the belly / the body */
function allyAway(a,dt,S){const r=a.pw/a.R.iv*dt;if(a.room==='in'){WB.mainHit(r,a,'core');return;}
  if(a.role!=='healer'&&full(S)&&!st.down){st.cg-=5/a.R.iv*dt;WB.pts(a,'part',r/(a.lv*10));if(st.cg<=0){st.cg=st.CG;cough(S);}}
  else WB.mainHit(r*.3,a,'core');}
function winEnd(S){if(st.down){st.down=0;WB.poseTo({lift:0,spd:3});}}
/* the hero fell inside: only the hero leaves (the ghost waits at the camp), the spirits inside fight on */
function outOfStomach(S,u){if(!u.pl||curMap!==S.inner)return;const q=W2M(S.camp.x,S.camp.y);try{mapTravel(S.map,{x:q.x,y:q.y});}catch(e){}}
/* the way out of the stomach is shut while she lives */
function lockOut(on){const h=mapHost();if(!h||!h.warps)return;for(const w of h.warps){if(on){if(w._lab==null)w._lab=w.label;w.locked=1;w.label='🔒 ออกไม่ได้ — รอวาฬพ่น';}else if(w._lab!=null){w.locked=0;w.label=w._lab;w._lab=null;}}}

/* ---------------- allies ---------------- */
function allyJob(a,S){if(st.cone&&st.goIn.includes(a)){const c=st.cone,r=110+(a.id%4)*45,da=((a.id%3)-1)*.25;return {x:c.x+Math.cos(c.phi+da)*r,y:c.y+Math.sin(c.phi+da)*r,r:20,stay:1,until:gameTime+5};}
  if(a.room==='in')return st.shard&&!st.shard.dead&&S.room==='in'?{tgt:st.shard}:{x:a.x,y:a.y,r:400};
  if(st.pearls.some(p=>!p.dead&&p.p&&!p.p.dead)&&(a.role==='archer'||a.role==='mage')){const p=st.pearls.find(q=>!q.dead&&q.p&&!q.p.dead);return {tgt:p.p,rng:240};}
  if(a.role!=='healer'&&!st.down&&full(S)&&st.belly&&!st.belly.dead&&!st.belly.hidden)return {tgt:st.belly};
  if(S.adv&&(a.role==='archer'||a.role==='mage')){const sp=st.spines.filter(q=>!q.broken&&q.p&&!q.p.dead).map(q=>q.p);if(sp.length)return {tgt:sp[0],min:190,out:1};}
  return st.body&&!st.body.dead&&!st.body.hidden?{tgt:st.body,rng:st.down?null:Math.max(200,(a.R.rng||0)*.8),min:st.down?0:190}:null;}
const target=(a,S)=>S.room==='in'&&a.room==='in'?st.shard:st.body;

/* ---------------- drawing ---------------- */
function drawOn(S){const B=S.B;if(st.belly&&!st.belly.dead&&!st.belly.hidden&&full(S)&&!st.down){const s=WB.picAt(.62,.8);if(s){const [x,y]=s,k=st.cg/st.CG;ctx.save();ctx.lineWidth=5;ctx.strokeStyle='rgba(10,20,40,.6)';ctx.beginPath();ctx.arc(x,y,22,0,T2);ctx.stroke();ctx.strokeStyle='#bfe8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,22,-Math.PI/2,-Math.PI/2+T2*k);ctx.stroke();
    ctx.font='700 13px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x,y+5);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x,y+5);ctx.restore();}}
  for(const pr of st.pearls){if(pr.dead||!pr.p)continue;const [x,y]=P(pr.p.x,pr.p.y,110+8*Math.sin(gameTime*3+pr.dx));ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,26);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba(190,230,255,.7)');g.addColorStop(1,'rgba(120,180,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26,0,T2);ctx.fill();ctx.restore();
    ctx.save();ctx.font='700 12px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x,y-22);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x,y-22);ctx.restore();}
  st.spines.forEach((q,i)=>{if(!S.adv||q.broken)return;const s=WB.picAt(SPINES[i][0],SPINES[i][1]);if(!s)return;ctx.save();ctx.setLineDash([5,4]);ctx.lineDashOffset=-gameTime*20;ctx.lineWidth=1.6;ctx.strokeStyle='#ffd23a';ctx.beginPath();ctx.arc(s[0],s[1],20,0,T2);ctx.stroke();ctx.restore();});}
function drawInner(S){if(!st.shard||st.shard.dead)return;const [x,y]=P(st.sx,st.sy,360),k=st.inT/25;ctx.save();ctx.font='600 15px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#1a1030';
  const t=st.inT>0?`ถูกพ่นออกใน ${Math.ceil(st.inT)} วิ · กรด ${acidK(S)}/วิ`:'';ctx.strokeText(t,x,y);ctx.fillStyle='#f0e0ff';ctx.fillText(t,x,y);ctx.restore();
  for(let i=0;i<3;i++){const a=gameTime*.8+i*2.1,[bx,by]=P(st.sx+Math.cos(a)*300,st.sy+Math.sin(a)*160,0);ctx.save();ctx.globalAlpha=.35;ctx.fillStyle='#9aff7a';ctx.beginPath();ctx.arc(bx,by-((gameTime*30+i*40)%60),5,0,T2);ctx.fill();ctx.restore();}}
function hud(S){const meIn=curMap===S.inner,ins=S.allies.filter(a=>!a.dead&&a.room==='in').length+(meIn?1:0);
  const ph=meIn?`🐋 ในท้องวาฬ — ทุบเศษดาว ◎! กรด ${acidK(S)}/วิ · ถูกพ่นออกใน ${Math.ceil(st.inT)} วิ`:S.win>0?'✦ วาฬไอจนมึน! ตีได้ทุกฮิต':ins?`🐋 ในท้องมี ${ins} คน — ตีจุดใต้ท้อง ◎ ให้มันไอ`:'ตีจุดใต้ท้อง ◎ ให้มันไอ · ยิงตัววาฬจากไกล ≥ 150 · ระวังกรวยหน้าปากตอนสูดลม';
  return {main:{v:S.hp,m:S.hpMax,lab:'🐋 เศษหัวใจดาว'},subs:full(S)?[{v:st.cg,m:st.CG,lab:`เกจไอ ${Math.ceil(st.cg)} / ${st.CG}`,col:'linear-gradient(#e0f4ff,#5aa8e8)'}]:[],
    icons:(S.adv?st.spines.map(q=>({t:'💎 '+(q.broken?'แตก':Math.ceil(q.hp/q.max*100)+'%'),off:q.broken,col:'#bfe8ff'})):[]).concat(st.pearls.length?[{t:'🎵 ไข่มุก '+st.pearls.filter(p=>!p.dead).length,col:'#cfe8ff'}]:[]),phase:ph};}
WB.def('lumina',{hp:N=>200000*N,shadow:[240,96],shOff:20,r:150,fly:150,race:'Fish',el:'Holy 2',
  inFocus:S=>st.shard&&!st.shard.dead?{x:st.sx,y:st.sy,cy:st.sy-260/K}:null,
  setup,build,think,tick,onHit,winEnd,allyJob,allyAway,target,outOfStomach,drawOn,drawInner,hud,pickDefault:S=>S.room==='in'?st.shard:st.belly&&!st.belly.hidden?st.belly:st.body,
  finish(S){WB.poseTo({lift:-40,sy:.96});if(curMap===S.inner)lockOut(0);},
  dbg:S=>({cg:Math.round(st.cg),inT:Math.round(st.inT),inside:S.allies.filter(a=>a.room==='in').length,down:st.down,pearls:st.pearls.filter(p=>!p.dead).length,room:S.room})});
})();
