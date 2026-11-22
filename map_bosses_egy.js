/* =====================================================================
   EGYPT MAP BOSSES (MAP_BOSS_MECHANICS_TH.md §7) — scripts for map_boss_kit.js.
   · Salt Scorpion King — Salt Flats (egyH2), Lv 30, the first boss of the game:
       pincer cone · sting circle (poison) · every 3rd sting = BIG STING (a long line): a salt pillar between the hero and the
       scorpion takes the sting → TAIL STUCK = window 5 s · it spits 3 salt crystals that grow into pillars (cover, solid) ·
       it burrows and a crack trail chases the hero (slower than walking; pillars slow it) — standing still = it erupts under you.
       Salt crust: DEF ×2 outside windows. Phase < 50 %: more pillars, a second burrow right after the first, faster trail.
   ===================================================================== */
(function(){
const M=window.MBK;if(!M)return;
const T2=Math.PI*2,G=M.g;

/* ---------------- Salt Scorpion King ---------------- */
const SC={pinR:135,pinHalf:.85,stR:72,bigW:62,bigL:340,pilR:34,pilMax:4,pilLife:25,trail:[118,146],burrow:4.2};
/* a salt pillar: pink crystal cluster, solid, blocks the big sting */
function pillar(e,x,y){const q=M.prop(e,{kind:'pillar',x,y,r:SC.pilR,solid:1,cover:1,layer:'sorted',life:SC.pilLife,fadeT:.35,grow:0,seed:Math.random()*9,
  update(q,dt){q.grow=Math.min(1,q.grow+dt*3.2);},
  draw(q,x,y,t,al){const g=q.grow,s=.55+.45*(g<1?1-Math.pow(1-g,3):1),hot=q.hot>0,pul=.5+.5*Math.sin(gameTime*10);q.hot=Math.max(0,(q.hot||0)-1/60);
    G.shadow(x,y+2,30,.28);
    if(hot){ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineWidth=4;ctx.strokeStyle=`rgba(255,200,60,${.6+.4*pul})`;ctx.beginPath();ctx.arc(0,0,SC.pilR+8,0,T2);ctx.stroke();ctx.restore();G.glow(x,y-34*s,46,'#ffd23a',.35+.2*pul);}
    const cr=[[-14,0,15,58],[9,2,13,74],[2,6,11,46],[-4,-3,10,34]];
    for(const [dx,dy,w,h] of cr){const H=h*s,bx=x+dx,by=y+dy*.6;
      G.poly([[bx-w*.5,by],[bx-w*.62,by-H*.55],[bx,by-H],[bx+w*.62,by-H*.6],[bx+w*.5,by]],'#ffe0ea','#a8506e',2.2);
      G.poly([[bx,by-H],[bx+w*.62,by-H*.6],[bx+w*.5,by],[bx+w*.08,by]],'rgba(240,150,190,.55)');
      ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(bx-w*.28,by-H*.5);ctx.lineTo(bx-w*.05,by-H*.86);ctx.stroke();}
    if(hot)G.text(x,y-80*s,'◎',16,'#ffd23a');}});
  return q;}
function shatter(x,y,col){for(let i=0;i<14;i++)emit({type:'ember',x:x+rnd(-10,10),y:y+rnd(-6,6),z:rnd(10,50),vx:rnd(-160,160),vy:rnd(-110,110),vz:rnd(80,240),drag:1.5,grav:520,life:rnd(.5,.9),size:rnd(2,3.4),size1:.6,color:col||(Math.random()<.5?'#ffd8e6':'#ffffff')});
  addFx(new GRing({x,y,r0:6,r1:70,w:8,color:'#ffd0e0',life:.35}));if(typeof shake==='function')shake(2);}
/* the burrow trail: a mound moving under the salt + its crack line */
class Trail{constructor(o){Object.assign(this,{t:0,layer:'ground',pts:[]},o);}update(dt){this.t+=dt;const a=this.a;if(!a.on&&this.t>.1&&!this.out)this.out=this.t;
    if(a.on&&(!this.pts.length||Math.hypot(a.x-this.pts[this.pts.length-1].x,a.y-this.pts[this.pts.length-1].y)>14))this.pts.push({x:a.x,y:a.y,t:this.t});
    return !this.out||this.t-this.out<1.2;}
  draw(){const fade=this.out?Math.max(0,1-(this.t-this.out)/1.2):1;ctx.save();ctx.lineCap='round';
    for(let i=1;i<this.pts.length;i++){const p=this.pts[i-1],q=this.pts[i],k=Math.max(0,1-(this.t-q.t)/3);if(k<=0)continue;const [x0,y0]=P(p.x,p.y),[x1,y1]=P(q.x,q.y);
      ctx.globalAlpha=.85*k*fade;ctx.strokeStyle='#4a2e22';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo((x0+x1)/2+((i*37)%9-4),(y0+y1)/2+((i*13)%5-2));ctx.lineTo(x1,y1);ctx.stroke();
      ctx.strokeStyle='#ffd8e6';ctx.lineWidth=2;ctx.stroke();if(i%3===0){G.poly([[x1-5,y1+2],[x1-1,y1-7],[x1+5,y1+1]],'#fff0f6','#8a5060',1.2);}}
    if(this.a.on){const [x,y]=P(this.a.x,this.a.y),w=1+.12*Math.sin(this.t*22);ctx.globalAlpha=fade;G.ell(x,y+2,40*w,15*w,'rgba(60,30,20,.35)');G.ell(x,y,34*w,13*w,'#e9dcd8','#5a3a2a',3);G.ell(x,y-4,22*w,8*w,'#fff6f8');
      if(Math.random()<.5)dustPuff(this.a.x,this.a.y,2,'#e9dcd8',60,9);
      for(let k=0;k<3;k++){const an=this.t*6+k*2.1;G.poly([[x+Math.cos(an)*20,y+Math.sin(an)*6-4],[x+Math.cos(an)*20+4,y+Math.sin(an)*6-12],[x+Math.cos(an)*20+8,y+Math.sin(an)*6-3]],'#ffd8e6','#a8506e',1.4);}}
    ctx.restore();ctx.globalAlpha=1;}}

M.def('scorpion',{R:560,see:330,spd:62,reach:100,hpMul:1.25,enrage:300,minH:92,
  cry:'กร๊าซซ!!',intro:'ราชาแมงป่องเกลือ — ยืนให้เสาเกลือบังเหล็กไนใหญ่ แล้วตีท้องตอนหางติด',
  cd0:{pin:1.5,sting:3,spit:2,burrow:14},phases:[.5],
  setup(e,b){b.defN=Math.round(b.def0*2);M.defNow(e);M.hint(e,'หลบวงแดง · เหล็กไนครั้งที่ 3 = เส้นยาว: ยืนให้เสาเกลือบัง');},
  phase(e,ph){M.say(e,'เปลือกเกลือร้าว!','#ffb0c8',18);M.banner('เปลือกร้าว — พ่นผลึกถี่ขึ้น มุดดินสองรอบ','red',2.2);},
  think(e,dt,L){const b=e.mb,p2=b.phase>=2;
    if(M.ready(e,'burrow')){M.cd(e,'burrow',p2?17:20);burrow(e,0);return true;}
    if(M.ready(e,'spit')&&L<520){M.cd(e,'spit',p2?10:14);spit(e);return true;}
    if(M.ready(e,'sting')&&L<(((b.cnt.sting||0)%3===2)?SC.bigL-20:420)){M.cd(e,'sting',p2?6:7);const n=M.count(e,'sting');if(n%3===0)bigSting(e);else sting(e);return true;}
    if(M.ready(e,'pin')&&L<SC.pinR+10){M.cd(e,'pin',3);pin(e);return true;}
    return false;},
  hurtAfter(e,d){},
  dead(e){}});
function pose(e,T){e.atk=T;e.face=player.x>=e.x?1:-1;}
function hitPose(e){e.atk=0;e._hitT=gameTime;}
function pin(e){const phi=M.angTo(e,player);pose(e,.8);
  M.act(e,{T:.95,start(e,a){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:SC.pinR,phi,half:SC.pinHalf},T:.8,mul:1.2,boomKind:'quiet',onFire(){hitPose(e);sparks(e.x+Math.cos(phi)*60,e.y+Math.sin(phi)*60,30,phi,8,'#ffe0ea',200,.8);}});}});}
function sting(e){const x=player.x,y=player.y;pose(e,1);
  M.act(e,{T:1.1,start(e){M.strike(e,{shape:{k:'circle',x,y,r:SC.stR},T:1,mul:1.5,dot:['mbPoison',4,1.2],boomCol:'#ffd23a',onFire(){hitPose(e);}});}});}
function bigSting(e){const b=e.mb;let phi=M.angTo(e,player);pose(e,1.5);
  M.banner('ยืนหลังเสาเกลือ!','blue',1.6);M.hint(e,'เส้นแดงยาว = เหล็กไนใหญ่ — ให้เสาเกลือ (เรืองทอง) อยู่ระหว่างเรากับบอส');
  const shape={k:'rect',x:e.x,y:e.y,phi,len:SC.bigL,w:SC.bigW,off:10};
  M.act(e,{name:'🦂 เหล็กไนใหญ่',T:1.55,start(e,a){
      a.w=M.strike(e,{shape,T:1.4,noHit:1,sig:'เหล็กไนใหญ่',boom:0,
        track(w,dt){if(w.t<.45){phi=M.angTo(e,player);shape.phi=phi;shape.x=e.x;shape.y=e.y;}const q=firstPillar(e,shape);for(const p of M.props(e,'pillar'))if(p===q)p.hot=.05;},
        onFire(){hitPose(e);const q=firstPillar(e,shape),u=q?q._u:1e9,c=Math.cos(phi),n=Math.sin(phi),dx=player.x-shape.x,dy=player.y-shape.y,hu=dx*c+dy*n,hv=Math.abs(-dx*n+dy*c);
          if(q){q.dead=1;shatter(q.x,q.y);stuck(e,q);}
          if(player.hp>0&&hu>=0&&hu<=SC.bigL+12&&hv<=SC.bigW/2+12&&(!q||hu<u)){if(M.hit(e,3,{dot:['mbPoison',6,2.2]}))M.fail(e,'โดนเหล็กไนใหญ่');}
          sparks(shape.x+c*Math.min(SC.bigL,q?u:SC.bigL),shape.y+n*Math.min(SC.bigL,q?u:SC.bigL),30,phi+Math.PI,10,'#ffd23a',260,.9);if(typeof shake==='function')shake(3);
          M.hint(e,'หลบวงแดง · เหล็กไนครั้งที่ 3 = เส้นยาว: ยืนให้เสาเกลือบัง');}});}});}
function firstPillar(e,s){let best=null,bu=1e9;const c=Math.cos(s.phi),n=Math.sin(s.phi);for(const q of M.props(e,'pillar')){if(q.grow<.6)continue;const dx=q.x-s.x,dy=q.y-s.y,u=dx*c+dy*n,v=Math.abs(-dx*n+dy*c);
  if(u>0&&u<s.len+q.r&&v<s.w/2+q.r*.8&&u<bu){bu=u;best=q;}}if(best)best._u=bu;return best;}
function stuck(e,q){const b=e.mb;M.say(e,'หางติด!','#ffe08a',20);M.window(e,5,'หางติด! ท้องเปิด');
  /* the tail stays in the broken pillar: a stub of salt round it while the window lasts */
  M.prop(e,{kind:'stub',x:q.x,y:q.y,layer:'sorted',life:5,fadeT:.3,draw(q2,x,y,t){G.shadow(x,y+2,22,.25);G.poly([[x-16,y],[x-10,y-26],[x+2,y-34],[x+14,y-20],[x+16,y]],'#ffe0ea','#a8506e',2);G.glow(x,y-20,40,'#ffd23a',.25+.15*Math.sin(t*8));}});}
function spit(e){const b=e.mb;pose(e,.9);const pts=[],to=M.angTo(player,e),base=[[to,120],[to+1.75,130],[to-1.75,130]];
  for(const [a,d] of base){const x=player.x+Math.cos(a)*d,y=player.y+Math.sin(a)*d;if(curMap&&mapBlockedW(x,y))continue;pts.push([x,y]);}
  M.act(e,{name:'พ่นผลึกเกลือ',T:1,start(e,a){for(const [x,y] of pts)M.strike(e,{shape:{k:'circle',x,y,r:SC.pilR+6},T:1.5,col:'pink',mul:.8,push:50,boomKind:'quiet',
      onFire(){const L=M.props(e,'pillar');if(L.length>=SC.pilMax+(b.phase>=2?1:0)){const old=L[0];old.dead=1;shatter(old.x,old.y);}pillar(e,x,y);shatter(x,y,'#ffffff');}});
    for(const [x,y] of pts)for(let i=0;i<5;i++)emit({type:'ember',x:e.x,y:e.y,z:40,vx:(x-e.x)*rnd(.9,1.2),vy:(y-e.y)*rnd(.9,1.2),vz:rnd(140,220),drag:0,grav:300,life:1.2,size:2.6,size1:1.6,color:'#ffd8e6'});
    hitPose(e);}});}
function burrow(e,second){const b=e.mb,p2=b.phase>=2,v=SC.trail[p2?1:0],T=second?2.8:SC.burrow;
  if(!b.seenBurrow){b.seenBurrow=1;M.banner('มุดดิน! เดินไม่หยุด','red',1.8);}
  M.hint(e,'รอยแตกไล่ตาม (ช้ากว่าเราเดิน) — เดินไปเรื่อยๆ ผ่านเสาเกลือจะช้าลง');
  const st={x:e.x,y:e.y,on:1};
  M.act(e,{name:'⛏ มุดเกลือ',T:T+.7,unstop:1,start(e,a){a.trail=addFx(new Trail({a:st}));e.hidden=1;e.atk=0;dustPuff(e.x,e.y,14,'#e9dcd8',110,14);shatter(e.x,e.y,'#ffffff');},
    step(e,a,dt){if(a.erupt)return;let sp=v;for(const q of M.props(e,'pillar'))if(Math.hypot(q.x-st.x,q.y-st.y)<q.r+30)sp*=.35;
      const dx=player.x-st.x,dy=player.y-st.y,d=Math.hypot(dx,dy);if(d>1){const mv=Math.min(d,sp*dt),nx=st.x+dx/d*mv,ny=st.y+dy/d*mv;if(!curMap||!mapBlockedW(nx,ny)){st.x=nx;st.y=ny;}}
      e.x=st.x;e.y=st.y;
      if((d<24&&a.t>.6)||a.t>=T){a.erupt=1;st.on=0;const x=st.x,y=st.y;a.T=a.t+.75;
        M.strike(e,{shape:{k:'circle',x,y,r:86},T:.5,mul:2,cc:['air',.8],boomCol:'#ffe0ea',onFire(){e.hidden=0;e.x=x;e.y=y;hitPose(e);shatter(x,y);dustPuff(x,y,16,'#e9dcd8',140,16);}});}},
    end(e,a){e.hidden=0;M.hint(e,'หลบวงแดง · เหล็กไนครั้งที่ 3 = เส้นยาว: ยืนให้เสาเกลือบัง');if(b.phase>=2&&!second)burrow(e,1);},
    cancel(e,a){e.hidden=0;st.on=0;}});}
})();
