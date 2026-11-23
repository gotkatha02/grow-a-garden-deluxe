/* =====================================================================
   WORLD BOSS — Wednesday: MAYAWEE, THE THOUSAND-HUE CHAMELEON (WORLD_BOSS_WEEK_TH.md §6). Core: world_boss.js.
   • It melts into the garden: after 25 s in sight it turns invisible — only a shimmer drifting through the flower beds; nothing
     hits it (AUTO cannot either) for up to 30 s (enraged 40).
   • Paint it: the 7 great buds ◎ (hard to hit: high FLEE) burst into a 150-wide splash of colour. If the hidden chameleon is inside
     the splash the paint sticks = it shows for 15 s = the window. A burst bud is drained and regrows one by one every 20 s
     (enraged 40). Three splashes in a row that miss it → it eats the paint (HP + Lv × 120).
   • Two eyes: each locks one of the two top dealers (aim line 2.5 s) and fires a beam ×13; where the two lines cross, a burst.
   • Tongue: it pulls the one who stayed farthest away to its mouth (walk against it) — hit the tongue ◎ to cut it loose, or ×15.
   • Gem question 'store it, fire it when it shows': stack-gem charges and quick-cooldown supports.
   • Moves: curled-tail whip 12 s (≥ 3 behind, ×10 + push) · crest leaves 9 s (a fan of 5 lines ×6).
   • Advanced: while hidden it drags 2 decoy shimmers along — splashing a decoy bursts ink (dark 4 s round it); the real one leaves
     footprints.
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1166/1229,1:1217/1233},FRONT=.7,PAINT=['#ff4a8a','#ffd23a','#4ad8ff','#b05aff','#ff8a3a','#5aff9a','#ff5aff'];
let st=null;
const units=()=>WB.units();
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}

function setup(S){const B=S.B;st=S.st={mode:'seen',mt:25,buds:[],miss:0,regT:20,paint:null,tongue:null,far:new Map(),dec:[],foot:[],home:{x:B.x,y:B.y},wx:B.x,wy:B.y,body:null};
  MB.cd(B,'eyes',12);MB.cd(B,'tongue',16);MB.cd(B,'tail',8);MB.cd(B,'leaves',5);}
function build(S){st=S.st;
  if(!st.buds.length)for(const {o,x,y} of WB.mapObjs('wbMaBud'))st.buds.push({x,y,o,state:'closed',t:0,p:null,col:PAINT[st.buds.length%PAINT.length]});
  for(const b of st.buds){WB.hideObj(b.o);if(b.state==='closed')budPart(S,b);}
  st.body=WB.body({dx:0,dy:-24,r:120,h:150,name:'Mayawee'});if(st.mode==='hide')st.body.hidden=1;}
function budPart(S,b){b.p=WB.part({x:b.x,y:b.y+8,name:'Colour Bud',th:'ดอกตูมสี',hp:Math.round(WB.PU.lv*40),r:30,h:110,job:'part',kind:'bud',auto:0,noNear:1,def:10,mdef:10,flee:100,data:{b},
  onBreak:()=>burst(S,b)});}
const hidden=()=>st.mode==='hide';

/* ---------------- invisibility + paint ---------------- */
function hide(S){const B=S.B;st.mode='hide';st.mt=S.enr?40:30;if(st.body)st.body.hidden=1;S.noSolid=1;WB.poseTo({alpha:.06,spd:4});B.pose.haze=S.adv?.07:.11;MB.cancel(B);
  if(S.adv){st.dec=[0,1].map(i=>({x:B.x+rn(-200,200),y:B.y+rn(-100,100),gx:null,gy:null}));}
  MB.banner('🦎 มายาวีล่องหน! ตีดอกตูม ◎ ตอนประกายมันอยู่ใกล้ดอก','purple',2.6);}
function show(S,painted){const B=S.B;st.mode=painted?'painted':'seen';st.mt=25;st.dec=[];S.noSolid=0;if(st.body)st.body.hidden=0;WB.poseTo({alpha:1,spd:6});B.pose.haze=0;
  if(painted){st.paint={col:st.lastCol||'#ff4a8a',t:15};WB.window(15,'สีสาดติดตัว! มองเห็นแล้ว');}}
function burst(S,b){const B=S.B;b.state='burst';b.t=0;b.p=null;st.lastCol=b.col;splashFx(b.x,b.y,b.col);
  if(hidden()){const hit=hyp(B.x-b.x,B.y-b.y)<150;const dec=st.dec.find(d=>hyp(d.x-b.x,d.y-b.y)<150);
    if(hit){st.miss=0;show(S,true);for(const u of units())if(hyp(u.x-b.x,u.y-b.y)<260)WB.pts(u,'mech',20);return;}
    if(dec){for(const u of units())if(hyp(u.x-dec.x,u.y-dec.y)<150){if(u.pl)MB.pc('dark',4,{r:150,col:'14,6,30',a:.85});else u.ccT=Math.max(u.ccT,1.5);}inkFx(dec.x,dec.y);st.dec=st.dec.filter(d=>d!==dec);MB.banner('🖤 สาดโดนตัวหลอก! หมึกระเบิด','purple',1.8);return;}}
  st.miss++;if(st.miss>=3){st.miss=0;WB.heal(WB.PU.lv*120);MB.banner('😋 มันกินสีที่สาดพลาด 3 ครั้ง! ฟื้นเลือด','red',2.2);}}
function wander(S,dt){const B=S.B;if(st.wait>0){st.wait-=dt;return;}   /* a chameleon creeps from bud to bud and freezes a moment at each */
  if(st.wx==null||hyp(st.wx-B.x,st.wy-B.y)<20){if(st.wx!=null)st.wait=rn(1,2.6);for(let k=0;k<10;k++){const b=st.buds[Math.floor(Math.random()*st.buds.length)];const x=(b?b.x:st.home.x)+rn(-170,170),y=(b?b.y:st.home.y)+rn(-110,110);if(!mapBlockedW(x,y)){st.wx=x;st.wy=y;break;}}if(st.wait>0)return;}
  const dx=st.wx-B.x,dy=st.wy-B.y,L=hyp(dx,dy)||1,v=Math.min(L,68*dt);B.x+=dx/L*v;B.y+=dy/L*v;
  if(S.adv){st.ft=(st.ft||0)+dt;if(st.ft>.5){st.ft=0;st.foot.push({x:B.x,y:B.y,t:6});if(st.foot.length>30)st.foot.shift();}
    for(const d of st.dec){if(d.gx==null||hyp(d.gx-d.x,d.gy-d.y)<20){const b=st.buds[Math.floor(Math.random()*st.buds.length)];d.gx=(b?b.x:B.x)+rn(-200,200);d.gy=(b?b.y:B.y)+rn(-120,120);}
      const ex=d.gx-d.x,ey=d.gy-d.y,M=hyp(ex,ey)||1,w=Math.min(M,68*dt);d.x+=ex/M*w;d.y+=ey/M*w;}}}

/* ---------------- moves ---------------- */
function eyes(S){const B=S.B;const t1=WB.topDealer(),rest=units().filter(u=>u!==t1);const t2=rest.sort((a,b)=>{let sa=0,sb=0;const t0=gameTime-10;for(const q of a.dmg10)if(q[0]>t0)sa+=q[1];for(const q of b.dmg10)if(q[0]>t0)sb+=q[1];return sb-sa;})[0];
  const tg=[t1,t2].filter(Boolean);if(!tg.length){MB.cd(B,'eyes',4);return;}const h={x:B.x+40,y:B.y+10},lines=tg.map(u=>{const phi=Math.atan2(u.y-h.y,u.x-h.x);return {phi,len:hyp(u.x-h.x,u.y-h.y)+140};});
  WB.act({name:'ตาสองข้างเล็ง!',T:2.55,start(){for(const l of lines)WB.strike({shape:{k:'rect',x:h.x,y:h.y,phi:l.phi,len:l.len,w:52},T:2.5,k:13,magic:1,boomCol:'#a8fff0'});
      if(lines.length===2){const X=cross(h,lines[0],lines[1]);if(X)WB.strike({shape:{k:'circle',x:X.x,y:X.y,r:80},T:2.5,k:10,magic:1,boomCol:'#fff0a0'});}},end(){}});
  MB.cd(B,'eyes',18);}
function cross(h,a,b){const d=Math.sin(b.phi-a.phi);if(Math.abs(d)<.12)return null;const t=0;/* the lines both start at h: they only cross at h itself → burst where they spread most */const m=(a.phi+b.phi)/2,r=Math.min(a.len,b.len)*.55;return {x:h.x+Math.cos(m)*r,y:h.y+Math.sin(m)*r};}
function mouth(S){const B=S.B,[dx,dy]=off(S,.78,1.0);return {x:B.x+dx,y:B.y+dy};}
function tongue(S){const B=S.B;let best=null,bt=4.9;for(const u of units()){const t=st.far.get(u)||0;if(t>bt){bt=t;best=u;}}if(!best){MB.cd(B,'tongue',5);return;}const u=best,m=mouth(S);
  const tp=WB.part({x:(u.x+m.x)/2,y:(u.y+m.y)/2,name:'Tongue',th:'ลิ้นกิ้งก่า — ตีให้ขาด!',hp:Math.round(WB.PU.lv*45),r:22,h:40,job:'part',kind:'tongue',auto:0,def:10,mdef:10,flee:0,onBreak:()=>{freeT(S,true);}});
  st.tongue={u,p:tp,t:0};if(u.pl)MB.pc('pull',6,{to:()=>{const q=mouth(S);return [q.x,q.y];},v:120,stop:50,reach:()=>{WB.dmg(u,15,{sure:1});freeT(S,false);}});
  MB.banner(u.pl?'👅 ลิ้นตวัดคุณ! เดินสวน หรือให้เพื่อนตีลิ้น ◎':'👅 ลิ้นตวัด'+u.name+' — ตีลิ้น ◎!','red',2);MB.cd(B,'tongue',22);}
function freeT(S,cut){const t=st.tongue;if(!t)return;st.tongue=null;if(t.u.pl){MB.PC.pull=null;delete player.buffs.mbPull;}if(t.p&&!t.p.dead){t.p.dead=true;t.p.gone=1;}if(cut)MB.say(S.B,'ลิ้นขาด!','#9fffb0',18);}
function tail(S){const B=S.B,a=FRONT+Math.PI+.3;let n=0;for(const u of units())if(hyp(u.x-B.x,u.y-B.y)<280&&Math.abs(angDiff(Math.atan2(u.y-B.y,u.x-B.x),a))<.9)n++;if(n<3){MB.cd(B,'tail',4);return;}
  WB.act({name:'หางม้วนฟาด!',T:1.05,start(){WB.strike({shape:{k:'cone',x:B.x,y:B.y,phi:a,half:.9,r:290},T:1,k:10,push:200,boomCol:'#b8ffb0'});},end(){}});MB.cd(B,'tail',12);}
function leaves(S){const B=S.B,u=units()[Math.floor(Math.random()*Math.max(1,units().length))];if(!u)return;const a0=Math.atan2(u.y-B.y,u.x-B.x);
  WB.act({name:'ใบหงอนบิน!',T:1.05,start(){for(let i=-2;i<=2;i++)WB.strike({shape:{k:'rect',x:B.x,y:B.y,phi:a0+i*.3,len:440,w:46},T:1,k:6,boomCol:'#a8ff90',boomKind:'quiet'});},end(){}});MB.cd(B,'leaves',9);}

function think(S,dt){const B=S.B;if(hidden())return;
  if(MB.ready(B,'tongue')&&!st.tongue){tongue(S);return;}if(MB.ready(B,'eyes')){eyes(S);return;}if(MB.ready(B,'tail')){tail(S);return;}if(MB.ready(B,'leaves')){leaves(S);return;}}
function tick(S,dt){st=S.st;const B=S.B;
  for(const b of st.buds){if(b.state==='burst'){b.t+=dt;if(b.t>1.2){b.state='drained';b.t=0;}}}
  for(const f of st.foot)f.t-=dt;st.foot=st.foot.filter(f=>f.t>0);
  if(S.state!=='fight')return;
  if(st.tongue){const t=st.tongue,m=mouth(S);if(t.p&&!t.p.dead){t.p.x=(t.u.x+m.x)/2;t.p.y=(t.u.y+m.y)/2;t.p.fixed=null;}
    if(!t.u.pl&&t.u.alive()){const dx=m.x-t.u.x,dy=m.y-t.u.y,L=hyp(dx,dy);t.u.ccT=Math.max(t.u.ccT,.2);if(L<55){WB.dmg(t.u,15,{sure:1});freeT(S,false);}else{t.u.x+=dx/L*120*dt;t.u.y+=dy/L*120*dt;}}
    if(!t.u.alive())freeT(S,false);}
  for(const u of units()){const d=hyp(u.x-B.x,u.y-B.y);st.far.set(u,d>480?(st.far.get(u)||0)+dt:0);}
  if(S.win>0)return;
  if(hidden()){wander(S,dt);let nb=null,nd=140;for(const q of st.buds){if(q.state!=='closed'||!q.p||q.p.dead)continue;const d=hyp(B.x-q.x,B.y-q.y);if(d<nd){nd=d;nb=q;}}if(nb&&nb===st.nearB)st.nearT+=dt;else{st.nearB=nb||null;st.nearT=0;st.lit=null;}
    if(st.nearB&&st.nearT>.8&&!st.lit){st.lit=st.nearB;for(const a of S.allies)if(a.role==='archer'||a.role==='mage')a.reT=0;}   /* the shimmer settles by a bud: the spirits' shooters turn to it at once */}
  st.mt-=dt;if(st.mt<=0){if(st.mode==='hide'){show(S,false);MB.banner('🦎 มันโผล่เองโดยไม่ติดสี','blue',1.8);}else if(st.mode==='seen')hide(S);}
  st.regT-=dt*(S.enr?.5:1);if(st.regT<=0){st.regT=20;const d=st.buds.filter(b=>b.state==='drained').sort((a,b)=>b.t-a.t)[0];if(d){d.state='closed';d.t=0;budPart(S,d);}}
  for(const b of st.buds)if(b.state==='drained')b.t+=dt;}
function winEnd(S){st.mode='seen';st.mt=25;st.paint=null;}

/* ---------------- allies ---------------- */
function allyJob(a,S){const B=S.B;if(st.tongue&&st.tongue.p&&!st.tongue.p.dead&&(a.role==='melee'||a.role==='archer'||a.role==='crit'))return {tgt:st.tongue.p};
  if(hidden()){if(a.role==='archer'||a.role==='mage'){const b=st.nearB;if(b&&st.nearT>.8&&b.p&&!b.p.dead)return {tgt:b.p,until:gameTime+2};}
    const bs=st.buds.filter(q=>q.state==='closed'),q=bs.length?bs[a.id%bs.length]:{x:st.home.x,y:st.home.y};return {x:q.x+Math.cos(a.slot)*(110+a.id*4),y:q.y+Math.sin(a.slot)*80,r:30};}   /* they watch the buds, not the hidden lizard (no giving it away) */
  return null;}
const target=(a,S)=>st.body&&!st.body.dead&&!st.body.hidden?st.body:null;

/* ---------------- drawing ---------------- */
class BudFx{constructor(b){this.b=b;this.layer='sorted';this.sy=b.y;}update(){const S=WB.S;return !!S&&!S.gone&&S.key==='mayawee';}
  draw(){const b=this.b,fl=b.o&&b.o.flip;if(b.state==='closed')WB.drawPiece('mayawee_bud',b.x,b.y,172,.9,{flip:fl,glow:hidden()&&hyp(WB.S.B.x-b.x,WB.S.B.y-b.y)<150?.15+.1*Math.sin(gameTime*10):0});
    else if(b.state==='burst')WB.drawPiece('mayawee_bud_burst',b.x,b.y,193,.9,{flip:fl});else WB.drawPiece('mayawee_bud_drained',b.x,b.y,120,.88,{flip:fl});
    if(b.state==='closed'&&b.p&&!b.p.dead){const [x,y]=P(b.x,b.y,150);ctx.save();ctx.font='700 13px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x,y);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x,y);ctx.restore();}}}
function drawOn(S){const B=S.B;if(hidden()){shimmer(B.x,B.y,1);for(const d of st.dec)shimmer(d.x,d.y,.9);}
  if(st.paint&&S.win>0){const q=WB.picAt(.5,.55);if(q){ctx.save();ctx.globalAlpha=.35;ctx.fillStyle=st.paint.col;for(let i=0;i<6;i++){const a=i*1.1,r=40+i*9;ctx.beginPath();ctx.ellipse(q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r*.6,26,16,a,0,T2);ctx.fill();}ctx.restore();}}}
function shimmer(x,y,k){const [X,Y]=P(x,y,60);ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a=gameTime*1.7+i*1.05,r=40+16*Math.sin(gameTime*2+i);const px=X+Math.cos(a)*r*1.4,py=Y-40+Math.sin(a)*r*.7;
  ctx.globalAlpha=k*(.25+.2*Math.sin(gameTime*6+i));ctx.fillStyle=['#a8fff0','#fff6a8','#ffb8f0'][i%3];ctx.beginPath();ctx.arc(px,py,3+2*Math.sin(gameTime*5+i),0,T2);ctx.fill();}
  const g=ctx.createRadialGradient(X,Y-40,0,X,Y-40,110);g.addColorStop(0,`rgba(200,255,230,${.07*k})`);g.addColorStop(1,'rgba(200,255,230,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(X,Y-40,110,0,T2);ctx.fill();ctx.restore();}
function drawGround(S){for(const f of st.foot){const [x,y]=P(f.x,f.y,0);ctx.save();ctx.globalAlpha=Math.min(.55,f.t/3);ctx.fillStyle='#2a4a1a';ctx.beginPath();ctx.ellipse(x-8,y,7,4,0,0,T2);ctx.ellipse(x+8,y+3,7,4,0,0,T2);ctx.fill();ctx.restore();}
  if(st.tongue&&st.tongue.u.alive()){const m=mouth(S),[ax,ay]=P(m.x,m.y,70),[bx,by]=P(st.tongue.u.x,st.tongue.u.y,40);ctx.save();ctx.strokeStyle='#e85a7a';ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo((ax+bx)/2,(ay+by)/2-40,bx,by);ctx.stroke();ctx.strokeStyle='#ff9ab0';ctx.lineWidth=3;ctx.stroke();ctx.restore();}}
function splashFx(x,y,col){addFx({layer:'ground',t:0,update(dt){this.t+=dt;return this.t<1.6;},draw(){const k=Math.min(1,this.t/.25),a=this.t<1?1:1-(this.t-1)/.6,[X,Y]=P(x,y,0);ctx.save();ctx.translate(X,Y);ctx.scale(1,K);ctx.globalAlpha=.55*a;ctx.fillStyle=col;
  for(let i=0;i<9;i++){const an=i*.7,r=150*k*(.55+.45*((i*37)%10)/10);ctx.beginPath();ctx.arc(Math.cos(an)*r*.6,Math.sin(an)*r*.6,24+i*2,0,T2);ctx.fill();}ctx.globalAlpha=.8*a;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,150*k,0,T2);ctx.stroke();ctx.restore();}});try{shake(2);}catch(e){}}
function inkFx(x,y){addFx({layer:'top',t:0,update(dt){this.t+=dt;return this.t<1;},draw(){const [X,Y]=P(x,y,30),k=this.t;ctx.save();ctx.globalAlpha=.8*(1-k);ctx.fillStyle='#1a0a2a';ctx.beginPath();ctx.arc(X,Y,40+150*k,0,T2);ctx.fill();ctx.restore();}});}
function hud(S){const cl0=st.buds.filter(b=>b.state==='closed').length;const ph=st.mode==='painted'&&S.win>0?'✦ สีติดตัว! มองเห็น — ระเบิดใส่เลย':hidden()?`🦎 ล่องหน — ตีดอกตูม ◎ ตอนประกายอยู่ใกล้ดอก (พลาดติดกัน ${st.miss}/3)`:`มองเห็นอยู่ — อีก ${Math.max(0,Math.ceil(st.mt))} วิ จะล่องหน`;
  return {main:{v:S.hp,m:S.hpMax,lab:'🦎 มายาวี'},subs:[],icons:[{t:'🌷 ดอกตูม '+cl0+'/'+st.buds.length,col:'#ff8ac0'}],phase:ph};}
WB.def('mayawee',{hp:N=>190000*N,solid:[126,54,-30],shadow:[230,88],shOff:24,r:150,race:'Brute',el:'Earth 2',
  setup,build(S){build(S);for(const b of st.buds)addFx(new BudFx(b));},think,tick,winEnd,allyJob,target,pickDefault:S=>st.body&&!st.body.hidden?st.body:null,drawOn,drawGround,hud,
  finish(S){WB.poseTo({alpha:1});st.dec=[];},
  dbg:S=>({mode:st.mode,mt:Math.round(st.mt),buds:st.buds.map(b=>b.state[0]).join(''),miss:st.miss,tongue:!!st.tongue})});
})();
