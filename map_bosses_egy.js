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

/* ---------------- Sphinx Guardian (egyH1 · Lv 37): riddle glyphs ---------------- */
const SPH={glR:58,ring:205};
const SYM=[['☀️','ดวงอาทิตย์'],['🌙','จันทร์'],['👁️','ตาฮอรัส']],TIME=[['🌅','เช้า'],['☀️','เที่ยง'],['🌙','เย็น']],LEGS=[['🐾','สี่ขา'],['🚶','สองขา'],['🦯','สามขา']];
const EMO='"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';
function emo(x,y,t,sz){ctx.save();ctx.font=`${sz}px ${EMO}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y);ctx.restore();}
function glyphs(e,syms,okI){const c={x:e.x,y:e.y},a0=Math.random()*T2,out=[];
  for(let i=0;i<3;i++){let a=a0+i*T2/3,x,y,k=0;do{x=c.x+Math.cos(a)*SPH.ring;y=c.y+Math.sin(a)*SPH.ring*.82;a+=.35;}while(curMap&&mapBlockedW(x,y)&&++k<10);
    out.push(M.prop(e,{kind:'glyph',x,y,r:SPH.glR,sym:syms[i],ok:i===okI,life:5,fadeT:.4,layer:'ground',arrow:1,
      draw(q,x,y,t){const on=Math.hypot(player.x-q.x,player.y-q.y)<q.r+6,pu=.7+.3*Math.sin(t*6);ctx.save();ctx.translate(x,y);ctx.scale(1,K);
        ctx.globalAlpha*=.3;ctx.fillStyle=on?'#ffe08a':'#ffd23a';ctx.beginPath();ctx.arc(0,0,q.r,0,T2);ctx.fill();ctx.globalAlpha/=.3;
        ctx.lineWidth=4;ctx.strokeStyle='#5a3a08';ctx.beginPath();ctx.arc(0,0,q.r+1.5,0,T2);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=on?'#fff0b0':`rgba(255,200,60,${pu})`;ctx.beginPath();ctx.arc(0,0,q.r,0,T2);ctx.stroke();
        ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*18;ctx.beginPath();ctx.arc(0,0,q.r*.72,0,T2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
        emo(x,y-6,q.sym[0],30);G.text(x,y+22,q.sym[1],12,'#ffe9b0');}}));}
  return out;}
function bubble(e,txt,life){return M.prop(e,{kind:'bubble',x:e.x,y:e.y,layer:'top',life,fadeT:.3,update(q){q.x=e.x;q.y=e.y;},
  draw(q,x,y,t){const h=(MSPR_H(e)||90)+44,by=y-h,w=Math.max(70,txt.length*15+30);ctx.save();ctx.fillStyle='rgba(255,250,236,.96)';ctx.strokeStyle='#8a5a10';ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(x-w/2,by-26,w,48,14);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-8,by+21);ctx.lineTo(x,by+32);ctx.lineTo(x+8,by+21);ctx.fill();ctx.restore();
    emo(x,by-2,txt,26);}});}
function gust(e,mul){const phi=M.angTo(e,player);pose(e,1);
  return M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:270,phi,half:1.05},T:1,mul:mul||.7,push:160,from:phi,boomKind:'quiet',
    onFire(hit){hitPose(e);for(let i=0;i<18;i++)emit({type:'dust',x:e.x+Math.cos(phi)*rnd(40,220),y:e.y+Math.sin(phi)*rnd(40,220),z:rnd(4,30),vx:Math.cos(phi)*rnd(120,260),vy:Math.sin(phi)*rnd(120,260),drag:2,life:rnd(.5,.9),size:rnd(8,14),size1:18,color:'#e8d0a0'});
      if(hit)M.buff('mbBlind',3);}});}
M.def('sphinx',{R:560,see:330,spd:66,reach:110,hpMul:1.25,enrage:300,minH:100,
  cry:'ตอบมา…',intro:'สฟิงซ์ — ตอบปริศนาให้ถูก: ไปยืนบนวงที่ตรงกับสัญลักษณ์เหนือหัว',
  cd0:{paw:1.5,pounce:4,gust:7,riddle:8},phases:[.5],
  setup(e,b){M.hint(e,'หลบวงแดง · ปริศนา = ไปยืนบนวงทองที่ตรงกับสัญลักษณ์เหนือหัวสฟิงซ์');},
  phase(e,ph){M.banner('ปริศนาจริง: เช้า = 🐾 · เที่ยง = 🚶 · เย็น = 🦯','gold',3.6);M.hint(e,'ปริศนาจริง: เช้า = 🐾 สี่ขา · เที่ยง = 🚶 สองขา · เย็น = 🦯 สามขา');},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'riddle')){M.cd(e,'riddle',25);riddle(e);return true;}
    if(M.ready(e,'gust')&&L<250){M.cd(e,'gust',12);M.act(e,{name:'ลมปีกทราย',T:1.15,start(e){gust(e);}});return true;}
    if(M.ready(e,'pounce')&&L>150&&L<430){M.cd(e,'pounce',9);const x=player.x,y=player.y;pose(e,1.2);
      M.act(e,{name:'กระโจน',T:1.35,start(e){M.strike(e,{shape:{k:'circle',x,y,r:95},T:1.2,mul:1.6,cc:['air',.6],onFire(){if(!curMap||!mapBlockedW(x,y)){e.x=x;e.y=y;}hitPose(e);}});}});return true;}
    if(M.ready(e,'paw')&&L<135){M.cd(e,'paw',3);const phi=M.angTo(e,player);pose(e,.8);
      M.act(e,{T:.95,start(e){M.strike(e,{shape:{k:'cone',x:e.x,y:e.y,r:125,phi,half:.8},T:.8,mul:1.3,boomKind:'quiet',onFire(){hitPose(e);}});}});return true;}
    return false;}});
function riddle(e){const b=e.mb,p2=b.phase>=2,n=M.count(e,'riddle'),i=(n-1)%3;
  let ask,syms,okI;const order=[0,1,2];for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]];}
  if(!p2){ask=SYM[i][0];syms=order.map(o=>SYM[o]);okI=order.indexOf(i);}else{ask=TIME[i][0]+' '+TIME[i][1];syms=order.map(o=>LEGS[o]);okI=order.indexOf(i);}
  if(!b.seenRid){b.seenRid=1;M.banner('ปริศนา! ไปยืนบนวงที่ตรงกับสัญลักษณ์เหนือหัว','blue',3);}else M.banner(p2?'ปริศนา: '+ask+' = กี่ขา?':'ปริศนา: '+ask,'blue',2);
  M.act(e,{name:'❓ ปริศนาสฟิงซ์',T:4.4,unstop:1,start(e,a){e.atk=0;a.gl=glyphs(e,syms,okI);a.bub=bubble(e,ask,4.6);M.say(e,'ตอบมา!','#ffe9a0',18);},
    step(e,a){e.atk=0;if(p2&&!a.g&&a.t>1.5){a.g=1;gust(e,.4);}},
    end(e,a){const g=(a.gl||[]).find(q=>!q.dead&&Math.hypot(player.x-q.x,player.y-q.y)<q.r+10);for(const q of a.gl||[])q.dead=1;if(a.bub)a.bub.dead=1;
      if(player.hp>0&&g&&g.ok){M.say(e,'ถูกต้อง…','#ffe9a0',19);M.window(e,5,'ถูกต้อง! สฟิงซ์ก้มหัว');}
      else if(player.hp>0){M.say(e,'ผิด!','#ff8a6a',20);M.banner(g?'ผิด! กลายเป็นหิน':'ไม่ได้ตอบ! กลายเป็นหิน','red',1.6);M.fail(e,'ตอบปริศนาผิด');
        addFx(new GRing({x:player.x,y:player.y,r0:10,r1:110,w:14,color:'#e8c890',life:.5}));if(M.hit(e,2,{}))M.pc('stone',2);else M.pc('stone',2);}},
    cancel(e,a){for(const q of a.gl||[])q.dead=1;if(a.bub)a.bub.dead=1;}});}

/* ---------------- Mummy Vizier (egyD1b · Lv 49): canopic jars + blood toll ---------------- */
const MU={jar:40,heal:30};
const LIDS=[['#3a2a1a','jackal'],['#8a6a4a','baboon'],['#4a6a8a','falcon'],['#c8a070','human']];
function drawJar(p,x,y,t){const L=LIDS[p.data.i||0];G.shadow(x,y+2,22,.3);
  G.poly([[x-15,y],[x-19,y-22],[x-14,y-36],[x+14,y-36],[x+19,y-22],[x+15,y]],'#e8d2a0','#5a3a10',2.4);
  ctx.fillStyle='#2a5a9a';ctx.fillRect(x-17,y-26,34,5);ctx.fillStyle='#d8a028';ctx.fillRect(x-17,y-21,34,3);
  G.ell(x,y-41,13,9,L[0],'#2a1a08',2.2);if(L[1]==='jackal'){G.poly([[x-9,y-47],[x-6,y-58],[x-2,y-48]],L[0],'#2a1a08',1.6);G.poly([[x+9,y-47],[x+6,y-58],[x+2,y-48]],L[0],'#2a1a08',1.6);}
  if(L[1]==='falcon')G.poly([[x+9,y-42],[x+17,y-39],[x+9,y-37]],'#e8b030','#2a1a08',1.4);
  ctx.fillStyle='#ffe08a';ctx.fillRect(x-5,y-43,3,2);ctx.fillRect(x+2,y-43,3,2);
  const e=p.mbOf;if(e&&e.mb&&e.mb.act&&e.mb.act.heal){G.glow(x,y-30,40,'#5fc8ff',.45);}}
function jars(e){const b=e.mb,c=b.home,pts=[[-215,-150],[215,-150],[-215,150],[215,150]];b.jarN=0;
  pts.forEach(([dx,dy],i)=>{let x=c.x+dx,y=c.y+dy;for(let k=0;k<12&&curMap&&mapBlockedW(x,y);k++){x=c.x+dx*(1-k*.07);y=c.y+dy*(1-k*.07);}
    M.part(e,{x,y,hp:M.lvOf(e)*MU.jar,r:20,h:58,name:'Canopic Jar',th:'โถคาโนปิก',kind:'jar',data:{i},draw:drawJar,
      onBreak(p){shatterJar(p.x,p.y);M.say(p,'โถแตก!','#ffe08a',16);jackal(e,p.x,p.y);if(!MB_left(e))M.banner('โถแตกครบ! ไม่ฟื้นแล้ว','gold',1.8);}});});}
const MB_left=e=>M.parts(e,'jar').length;
function shatterJar(x,y){for(let i=0;i<14;i++)emit({type:'ember',x,y,z:rnd(10,40),vx:rnd(-150,150),vy:rnd(-100,100),vz:rnd(80,220),drag:1.4,grav:500,life:rnd(.5,.9),size:rnd(2,3.4),size1:.6,color:Math.random()<.5?'#e8d2a0':'#2a5a9a'});
  addFx(new GRing({x,y,r0:6,r1:60,w:8,color:'#5fc8ff',life:.4}));if(typeof shake==='function')shake(1.6);}
function jackal(e,x,y){const L=(window.VK_MONS||{})[e.mboss]||[],d=L.find(q=>/Jackal/.test(q.name))||L[0];if(!d||typeof vkMake!=='function')return;const m=vkMake(d,x,y);if(!enemies.includes(m))enemies.push(m);m.summon=1;m.mbOf=e;m.aggro=8;}
/* the curse scroll: a slow homing orb that can be broken (a moving part) */
function scroll(e){const p=M.part(e,{x:e.x,y:e.y-10,hp:Math.round(M.lvOf(e)*5),r:14,h:40,name:'Curse Scroll',th:'ม้วนคำสาป',kind:'scroll',fixed:0,ring:20,data:{t:0},
  draw(p,x,y,t){const z=26+4*Math.sin(t*5);G.shadow(x,y+2,12,.3);G.glow(x,y-z,30,'#a24ae6',.5);ctx.save();ctx.translate(x,y-z);ctx.rotate(Math.sin(t*3)*.3);
    ctx.fillStyle='#f0e0b8';ctx.strokeStyle='#5a3a10';ctx.lineWidth=2;ctx.fillRect(-12,-8,24,16);ctx.strokeRect(-12,-8,24,16);ctx.fillStyle='#2a5a9a';ctx.beginPath();ctx.ellipse(0,0,6,3.5,0,0,T2);ctx.fill();ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.arc(0,0,1.6,0,T2);ctx.fill();ctx.restore();},
  onBreak(p){addFx(new GRing({x:p.x,y:p.y,r0:4,r1:46,w:6,color:'#c890ff',life:.35}));}});
  p.data.go=1;return p;}
M.def('mummy',{R:470,see:300,spd:46,reach:150,hpMul:1.3,enrage:360,minH:100,
  cry:'ผู้บุกรุกสุสาน…',intro:'มัมมี่อัครเสนาบดี — ทุบโถคาโนปิก 4 ใบก่อน ไม่งั้นมันฟื้นคืนชีพ',
  cd0:{lash:2,scroll:5,heal:12,blood:18,swarm:8},phases:[.4],
  setup(e,b){jars(e);M.hint(e,'ทุบโถคาโนปิก ◎ (สลับเป้า: คอม T / มือถือ 🎯) · โถฮีลและชุบชีวิตมัน');},
  phase(e){M.banner('ฝูงด้วงสคารับ! เดินข้ามตรงช่องว่าง','red',2);},
  cheat(e){const n=MB_left(e);if(!n)return false;e.hp=Math.round(e.maxHp*n/8);M.cancel(e);M.say(e,'ฟื้นคืนชีพ!','#7fd0ff',21);M.banner(`ฟื้นคืนชีพ! (โถเหลือ ${n}) ทุบโถก่อน`,'purple',2.2);
    addFx(new GRing({x:e.x,y:e.y,r0:10,r1:150,w:14,color:'#5fc8ff',life:.6}));for(const p of M.parts(e,'jar'))beam(p,e,.8);return true;},
  tick(e,dt){for(const p of M.parts(e,'scroll')){p.data.t+=dt;const a=Math.atan2(player.y-p.y,player.x-p.x),d=Math.hypot(player.x-p.x,player.y-p.y);p.x+=Math.cos(a)*72*dt;p.y+=Math.sin(a)*72*dt;
      if(d<22){p.gone=1;p.dead=true;M.hit(e,1.8,{magic:1});M.pc('dark',4,{r:150});addFx(new GRing({x:p.x,y:p.y,r0:4,r1:70,w:8,color:'#a24ae6',life:.4}));}else if(p.data.t>3.4){p.gone=1;p.dead=true;}}},
  think(e,dt,L){const b=e.mb;
    if(M.ready(e,'heal')){M.cd(e,'heal',20);if(MB_left(e)){healCast(e);return true;}}
    if(M.ready(e,'blood')&&L<480){M.cd(e,'blood',24);bloodToll(e);return true;}
    if(b.phase>=2&&M.ready(e,'swarm')){M.cd(e,'swarm',14);swarm(e);}
    if(M.ready(e,'scroll')&&L<520){M.cd(e,'scroll',9);pose(e,.7);M.act(e,{name:'ม้วนคำสาป',T:.8,end(e){hitPose(e);scroll(e);}});return true;}
    if(M.ready(e,'lash')&&L<300){M.cd(e,'lash',6);const phi=M.angTo(e,player);pose(e,.9);
      M.act(e,{T:1,start(e){M.strike(e,{shape:{k:'rect',x:e.x,y:e.y,phi,len:285,w:54,off:12},T:.9,mul:1.4,pc:['root',1.5],boomKind:'quiet',onFire(){hitPose(e);}});}});return true;}
    return false;}});
class Beam{constructor(o){Object.assign(this,{t:0,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead&&!this.p.dead;}
  draw(){const [x0,y0]=P(this.p.x,this.p.y,30),[x1,y1]=P(this.e.x,this.e.y,50),a=Math.sin(Math.PI*Math.min(1,this.t/this.life));ctx.save();ctx.globalCompositeOperation='lighter';
    for(const [w,c,al] of [[9,'#2a7bff',.35],[4,'#9fe0ff',.7],[1.6,'#ffffff',.9]]){ctx.globalAlpha=al*a;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,(y0+y1)/2-40,x1,y1);ctx.stroke();}ctx.restore();}}
function beam(p,e,life){addFx(new Beam({p,e,life}));}
const burning=e=>(e._gBurn&&e._gBurn.n>0)||(e._gFlat&&e._gFlat.n>0)||(e.st&&e.st.burn>0);
function healCast(e){pose(e,0);M.say(e,'พันผ้าคืนร่าง…','#9fe0ff',17);M.hint(e,'มันกำลังฮีลจากโถ — ทุบโถ ◎ หรือเผาให้ติดไฟ (ฮีลไม่เข้า)');
  M.act(e,{name:'🏺 พันผ้าคืนร่าง',T:3,heal:1,start(e,a){for(const p of M.parts(e,'jar'))beam(p,e,3);},
    step(e,a){if(burning(e)&&!a.fire){a.fire=1;M.say(e,'ผ้าลุกไฟ!','#ff9a4a',19);M.window(e,3,'ผ้าลุกไฟ! ฮีลไม่เข้า');}},
    end(e){const n=MB_left(e),h=n*M.lvOf(e)*MU.heal;if(h>0){e.hp=Math.min(e.maxHp,e.hp+h);addFx(new DText({x:e.x,y:e.y,z:110,text:'+'+h.toLocaleString(),color:'#7fe0ff',size:18,life:1.2}));M.fail(e,'มัมมี่ฮีลจากโถ');}
      M.hint(e,'ทุบโถคาโนปิก ◎ (สลับเป้า: คอม T / มือถือ 🎯) · โถฮีลและชุบชีวิตมัน');}});}
function bloodToll(e){pose(e,1.2);M.say(e,'จ่ายด้วยเลือด!','#ff6a7a',18);
  M.act(e,{name:'🩸 คำสาปจ่ายด้วยเลือด',T:1.35,start(e){M.strike(e,{shape:{k:'circle',x:player.x,y:player.y,r:105},T:1.25,col:'purple',noHit:1,boomKind:'quiet',
      onFire(h,w){hitPose(e);if(player.hp>0&&M.inShape(w.shape,player.x,player.y,10)){M.pc('blood',10);M.banner('จ่ายด้วยเลือด! สกิลใช้ HP แทน SP 10 วิ','purple',2);}}});}});}
function swarm(e){const b=e.mb,c=b.home,vert=(M.count(e,'swarm')%2)===1,W=b.R*2,gap=95,off=rnd(-140,140);
  const q=M.prop(e,{kind:'swarm',x:vert?c.x-b.R:c.x,y:vert?c.y:c.y-b.R*.8,layer:'ground',life:6.5,fadeT:.3,v:vert?[150,0]:[0,120],gapAt:off,hitT:0,
    update(q,dt){q.x+=q.v[0]*dt;q.y+=q.v[1]*dt;q.hitT-=dt;const inBand=vert?Math.abs(player.x-q.x)<34:Math.abs(player.y-q.y)<30,inGap=vert?Math.abs(player.y-(c.y+off))<gap/2:Math.abs(player.x-(c.x+off))<gap/2;
      if(inBand&&!inGap&&q.hitT<=0&&player.hp>0){q.hitT=.5;M.hit(e,.6,{});}},
    draw(q,x,y,t){ctx.save();for(let i=-14;i<=14;i++){const along=i*W/28,px=vert?q.x:c.x+along,py=vert?c.y+along*.8:q.y;if(vert?Math.abs(along*.8-off)<gap/2:Math.abs(along-off)<gap/2)continue;
        const [sx,sy]=P(px+Math.sin(t*9+i)*4,py);G.ell(sx,sy,9,6,'#2a2418','#c8a028',1.6);G.ell(sx,sy-2,3,2,'#e8c050');}ctx.restore();}});
  M.say(e,'ด้วงศักดิ์สิทธิ์!','#ffd23a',16);}
})();
