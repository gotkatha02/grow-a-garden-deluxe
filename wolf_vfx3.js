/* Wolf cartoon VFX trial (owner 2026-11-20: "painted pictures look stiff, try code VFX, same cartoon look, fewer effects").
   Default on since the owner approved it (?vfx3=0 = old painted version). Done: every generic slash (basic / frost / red), Blood Cleave, Savage Rend, Axe Dance, Wolf Finale, Vampiric Axe (slash + life-steal orbs), Blood Rush, Armor Break, Executioner cut, Cyclone Leap + Predator's Leap landings.
   Look: cel cartoon drawn by code — thick dark-brown outline, 3 flat tones, no glow blobs, no dot particles.
   Blood Cleave = ONE smear crescent that sweeps with the axe then is eaten from its tail (CSlash)
                + per enemy hit: one short cut mark (CCut) and 3 outlined drops that fall with gravity (CDrop). Nothing else.
   Savage Rend = two claw rips (CRip, 3 cuts each) crossing into an X on the target, red then red-gold;
                 RUPTURE (bleeding target) = one spiky cartoon burst (CBurst) + 4 drops.
   Wolf Finale = overhead chop crescent (CChop) → groundBreak(): code-drawn cartoon crater (CCrater: stone slabs jump up and settle,
                 lava bed glows then cools) + thin cracks further out (CCrack) + one shock ring (CRing) + 5 dust puffs (CPuff);
                 the painted rocks (WRock in wolf_fx.js) still fly. */
(()=>{
const on=()=>!window.__VFX3_OFF&&!/[?&]vfx3=0/.test(location.search);   /* owner approved 2026-11-20: default on; ?vfx3=0 shows the old painted version */
if(typeof CHAR==='undefined'||!['wolf','cat','croc','kitsune','axolotl','dragon'].includes(CHAR)||!on())return;   /* 2026-11-20: the kit is shared with the cat (window.VK, used by cat_vfx.js); wolf hooks stay wolf-only */
const OUT='#3a1410',eOut=t=>1-(1-t)*(1-t)*(1-t),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
/* crescent on a flat plane at axe height, centred on the hero; a0→a1 world angles */
/* reference-style fill (owner 2026-11-20: no dark outlines): solid colour with a soft glow of its own colour + a faint additive pass */
const GF=(f,rule)=>{ctx.save();ctx.shadowColor=f;ctx.shadowBlur=14;ctx.fillStyle=f;ctx.fill(rule||'nonzero');ctx.restore();ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.22;ctx.fillStyle=f;ctx.fill(rule||'nonzero');ctx.restore();};
class CSlash{constructor(o){Object.assign(this,{t:0,layer:'top',R:88,W:30,z:30,grow:.09,hold:.05,fade:.17,cols:['#8e1220','#e8303c','#ffc9c2'],N:26},o);}
  update(dt){this.t+=dt;if(this.until&&!this.ending&&!this.until()){this.ending=1;this.life=this.t+.35;this.fout=.35;}if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.grow+this.hold+this.fade;}
  pt(th,r){return P(this.x+Math.cos(th)*r,this.y+Math.sin(th)*r,this.z);}
  path(tl,hd,rOut,w,inset){const N=this.N;ctx.beginPath();
    for(let i=0;i<=N;i++){const s=i/N,q=this.pt(tl+(hd-tl)*s,rOut-inset*Math.sin(Math.PI*s));i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}
    for(let i=N;i>=0;i--){const s=i/N,pr=Math.pow(Math.sin(Math.PI*Math.pow(s,.8)),.75),q=this.pt(tl+(hd-tl)*s,rOut-inset*Math.sin(Math.PI*s)-w*pr);ctx.lineTo(q[0],q[1]);}
    ctx.closePath();}
  draw(){const g=eOut(cl(this.t/this.grow,0,1)),T=this.grow+this.hold,f=cl((this.t-T)/this.fade,0,1);
    const hd=this.a0+(this.a1-this.a0)*g,tl=this.a0+(hd-this.a0)*f*f*.96;if(Math.abs(hd-tl)<.03)return;
    const W=this.W*(1-f*.55),c=this.cols;ctx.save();ctx.lineJoin='round';
    this.path(tl,hd,this.R,W,0);GF(c[0]);   /* outline + shade tone */
    this.path(tl,hd,this.R,W*.72,0);ctx.fillStyle=c[1];ctx.fill();                                                   /* main tone on the leading edge */
    this.path(tl+(hd-tl)*.12,hd-(hd-tl)*.05,this.R-1.5,W*.26,1.5);ctx.fillStyle=c[2];ctx.fill();                      /* highlight */
    /* two speed slivers trailing behind the tail, outlined */
    if(f<.7)for(let i=0;i<2;i++){const a=tl-(hd-tl)*(.1+.1*i)*(1-f),b=a-(hd-tl)*.14,r=this.R-6-i*9;ctx.beginPath();const p0=this.pt(a,r),p1=this.pt((a+b)/2,r-2.5),p2=this.pt(b,r),p3=this.pt((a+b)/2,r+1);
      ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.lineTo(p3[0],p3[1]);ctx.closePath();GF(c[1]);}
    ctx.restore();}}
/* a short tapered cut on the enemy body */
class CCut{constructor(o){Object.assign(this,{t:0,layer:'top',life:.2,len:46,z:26},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,g=eOut(cl(k/.35,0,1)),L=this.len*(.5+.5*g),w=7*(1-k*k);const [x,y]=P(this.e.x,this.e.y,this.z);
    ctx.save();ctx.translate(x,y);ctx.rotate(this.ang);ctx.lineJoin='round';
    const lens=(l,h)=>{ctx.beginPath();ctx.moveTo(-l,0);ctx.quadraticCurveTo(0,-h,l,0);ctx.quadraticCurveTo(0,h,-l,0);ctx.closePath();};
    lens(L,w);GF('#e8303c');lens(L*.78,w*.45);ctx.fillStyle='#fff3ee';ctx.fill();ctx.restore();}}
/* outlined blood drop with gravity; lands as a small flat splat that fades */
class CDrop{constructor(o){Object.assign(this,{t:0,layer:'top',z:24,r:4,land:0,lt:0},o);}
  update(dt){this.t+=dt;if(!this.land){this.x+=this.vx*dt;this.y+=this.vy*dt;this.vz-=520*dt;this.z+=this.vz*dt;if(this.z<=0){this.z=0;this.land=1;this.layer='ground';}}else this.lt+=dt;return this.lt<.55;}
  draw(){const [x,y]=P(this.x,this.y,this.z);ctx.save();ctx.lineJoin='round';
    if(this.land){const a=1-cl((this.lt-.25)/.3,0,1),s=eOut(cl(this.lt/.1,0,1));ctx.globalAlpha=a;ctx.beginPath();ctx.ellipse(x,y,this.r*1.7*s,this.r*.75*s,0,0,7);GF(this.c2||'#b81826');}
    else{const sx=this.vx,sy=this.vy*K-this.vz,an=Math.atan2(sy,sx);ctx.translate(x,y);ctx.rotate(an);const r=this.r;ctx.beginPath();ctx.moveTo(r,0);ctx.quadraticCurveTo(0,r,-r*2.2,0);ctx.quadraticCurveTo(0,-r,r,0);ctx.closePath();
      GF(this.c||'#e8303c');}
    ctx.restore();}}
/* claw rip: 3 parallel tapered cuts drawn in fast along their length, then eaten from the start */
class CRip{constructor(o){Object.assign(this,{t:0,layer:'top',grow:.07,hold:.09,fade:.14,L:46,z:30,cols:['#e8303c','#fff3ee']},o);}
  update(dt){this.t+=dt;return this.t<this.grow+this.hold+this.fade;}
  draw(){const g=eOut(cl(this.t/this.grow,0,1)),f=cl((this.t-this.grow-this.hold)/this.fade,0,1);const [x,y]=P(this.x,this.y,this.z);
    ctx.save();ctx.translate(x,y);ctx.rotate(this.ang);ctx.lineJoin='round';
    for(let i=-1;i<=1;i++){const L=this.L*(i?.78:1),x0=-L+2*L*f*f,x1=-L+2*L*g,h=(i?4.2:5.5)*(1-f*.5),oy=i*10,sk=i*5;if(x1-x0<3)continue;
      const lens=(a,b,hh)=>{ctx.beginPath();ctx.moveTo(a+sk,oy);ctx.quadraticCurveTo((a+b)/2+sk,oy-hh,b+sk,oy);ctx.quadraticCurveTo((a+b)/2+sk,oy+hh,a+sk,oy);ctx.closePath();};
      lens(x0,x1,h);GF(this.cols[0]);
      const m=(x1-x0)*.14;lens(x0+m,x1-m,h*.42);ctx.fillStyle=this.cols[1];ctx.fill();}
    ctx.restore();}}
/* cartoon burst: outlined spiky star pops, then opens from the centre and is gone */
class CBurst{constructor(o){Object.assign(this,{t:0,layer:'top',life:.3,R:34,z:26,n:9,cols:['#e8303c','#ffd9a8']},o);this.j=Array.from({length:this.n*2},()=>.85+Math.random()*.3);this.rot=Math.random()*6;}
  update(dt){this.t+=dt;return this.t<this.life;}
  star(R,r){const n=this.n*2;for(let i=0;i<=n;i++){const a=this.rot+i/n*Math.PI*2,q=(i%2?r:R)*this.j[i%n];i?ctx.lineTo(Math.cos(a)*q,Math.sin(a)*q):ctx.moveTo(Math.cos(a)*q,Math.sin(a)*q);}ctx.closePath();}
  draw(){const k=this.t/this.life,s=eOut(cl(k/.3,0,1)),R=this.R*(.35+.75*s),hole=cl((k-.35)/.65,0,1);const [x,y]=P(this.e.x,this.e.y,this.z);
    ctx.save();ctx.translate(x,y);ctx.lineJoin='round';
    ctx.beginPath();this.star(R,R*.5);if(hole>0)this.star(R*hole*.98,R*.5*hole*.98);GF(this.cols[0],'evenodd');
    if(hole<.6){ctx.beginPath();this.star(R*.62,R*.3);if(hole>0)this.star(R*hole,R*.5*hole);ctx.fillStyle=this.cols[1];ctx.fill('evenodd');}
    ctx.restore();}}
/* heavy overhead chop: a tall crescent in the screen plane, from behind the head down to the impact point */
class CChop{constructor(o){Object.assign(this,{t:0,layer:'top',grow:.07,hold:.05,fade:.15,W:26,N:24,cols:['#a8361a','#ff7a2a','#ffe9b8']},o);}
  update(dt){this.t+=dt;return this.t<this.grow+this.hold+this.fade;}
  pt(th,r){const [sx,sy]=P(this.x,this.y,0);return [sx-this.d*30+this.d*Math.cos(th)*r,sy-60+Math.sin(th)*r*1.02];}
  path(tl,hd,R,w){const N=this.N;ctx.beginPath();for(let i=0;i<=N;i++){const q=this.pt(tl+(hd-tl)*i/N,R);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}
    for(let i=N;i>=0;i--){const s=i/N,q=this.pt(tl+(hd-tl)*s,R-w*Math.pow(Math.sin(Math.PI*Math.pow(s,.75)),.75));ctx.lineTo(q[0],q[1]);}ctx.closePath();}
  draw(){const a0=this.up?1.05:-2.25,a1=this.up?-2.25:1.05,g=eOut(cl(this.t/this.grow,0,1)),f=cl((this.t-this.grow-this.hold)/this.fade,0,1),hd=a0+(a1-a0)*g,tl=a0+(hd-a0)*f*f*.96;if(Math.abs(hd-tl)<.03)return;
    const W=this.W*(1-f*.5),c=this.cols;ctx.save();ctx.lineJoin='round';
    this.path(tl,hd,66,W);GF(c[0]);
    this.path(tl,hd,66,W*.7);ctx.fillStyle=c[1];ctx.fill();this.path(tl+(hd-tl)*.15,hd-(hd-tl)*.04,64.5,W*.25);ctx.fillStyle=c[2];ctx.fill();ctx.restore();}}
/* ground crack drawn on the floor: jagged branches shoot out from the impact, glow hot, cool down, fade */
const mix=(a,b,k)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=h(a),B=h(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')';};
class CCrack{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.3,R:80,n:7,hot:'#ffb347',cold:'#1c0c08'},o);this.br=[];const a0=Math.random()*6;
    const mk=(x,y,an,len,segs)=>{const pts=[[x,y]];let sg=Math.random()<.5?1:-1;const a0=an;for(let i=0;i<segs;i++){sg=-sg;an=a0+sg*(.35+Math.random()*.5);x+=Math.cos(an)*len/segs;y+=Math.sin(an)*len/segs;pts.push([x,y]);}return {pts,an};};
    for(let i=0;i<this.n;i++){const an=a0+i/this.n*Math.PI*2+(Math.random()-.5)*.4,b=mk(this.x,this.y,an,this.R*(.7+Math.random()*.45),6);this.br.push(b.pts);
      if(i%2===0){const m=b.pts[3];this.br.push(mk(m[0],m[1],an+(Math.random()<.5?.8:-.8),this.R*.32,3).pts);}}}
  update(dt){this.t+=dt;return this.t<this.life;}
  line(pts,g,w0,col){const n=pts.length-1,upto=g*n;for(let i=0;i<n&&i<upto;i++){const k=Math.min(1,upto-i),a=pts[i],b=pts[i+1],p=P(a[0],a[1],0),q=P(a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,0);
      ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineWidth=Math.max(1,w0*(1-i/n*.8));ctx.strokeStyle=col;ctx.stroke();}}
  draw(){const g=eOut(cl(this.t/.09,0,1)),cool=cl((this.t-.1)/.35,0,1),a=1-cl((this.t-(this.life-.35))/.35,0,1);ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';ctx.lineJoin='round';
    for(const b of this.br)this.line(b,g,b.length>4?6.5:4,'rgba(30,14,10,.45)');
    const c=mix(this.hot,this.cold,cool);for(const b of this.br)this.line(b,g,b.length>4?2.8:1.5,c);
    const [x,y]=P(this.x,this.y,0);ctx.beginPath();for(let i=0;i<8;i++){const an=i/8*Math.PI*2,r=9*(i%2?.65:1)*g;i?ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r*K):ctx.moveTo(x+Math.cos(an)*r,y+Math.sin(an)*r*K);}ctx.closePath();
    GF(mix(this.hot,'#2a120c',cool));ctx.restore();}}
/* one flat shock ring on the floor, outlined, thins as it expands */
class CRing{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.3,r0:22,r1:120,col:'#fff0d0'},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,r=this.r0+(this.r1-this.r0)*eOut(k),w=13*(1-k)+1.5;const [x,y]=P(this.x,this.y,0);ctx.save();ctx.beginPath();ctx.ellipse(x,y,r,r*K,0,0,7);ctx.ellipse(x,y,Math.max(1,r-w),Math.max(1,(r-w)*K),0,0,7);
    GF(this.col,'evenodd');ctx.restore();}}
/* cartoon crater, all drawn by code: the floor breaks into stone slabs that jump up and settle, lava glows in the gaps then cools */
const mix3=(a,b,c,k)=>k<.5?mix(a,b,k*2):mix(b,c,(k-.5)*2);
class CCrater{constructor(o){Object.assign(this,{t:0,layer:'ground',life:2,R:72},o);const R=this.R,k=R/72;this.pc=[];let a=Math.random()*6;const end=a+Math.PI*2;
    while(a<end-.35){const w=Math.min(end-a,.5+Math.random()*.55),g=.1+Math.random()*.1;   /* uneven slabs with wide glowing gaps */
      this.pc.push({k:'slab',a0:a+g,a1:a+w-g,am:a+w/2,r1:R*(.3+Math.random()*.16),r2:R*(.75+Math.random()*.5),bump:1.03+Math.random()*.14,lift:(13+Math.random()*15)*k,d:Math.random()*.05,tone:Math.random()});a+=w;}
    const ns=7;for(let i=0;i<ns;i++){const an=Math.random()*.5+i/ns*Math.PI*2;this.pc.push({k:'spike',am:an,rb:R*(1.05+Math.random()*.35),hw:.07+Math.random()*.06,h:(22+Math.random()*24)*k,d:.03+Math.random()*.07,tone:Math.random()});}
    this.pc.sort((p,q)=>Math.sin(p.am)*(p.rb||p.r2)-Math.sin(q.am)*(q.rb||q.r2));
    this.rim=Array.from({length:16},(_,i)=>R*(1.0+((i%2)?.14:0)+Math.random()*.1));}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const t=this.t,a=1-cl((t-(this.life-.4))/.4,0,1),cool=this.cold?1:cl((t-.2)/1.1,0,1),X=this.x,Y=this.y;ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';
    const path=ps=>{ctx.beginPath();ps.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();},pt=(an,r,z)=>P(X+Math.cos(an)*r,Y+Math.sin(an)*r,z);
    const g=eOut(cl(t/.07,0,1)),bed=f=>path(this.rim.map((r,i)=>pt(i/16*Math.PI*2,r*f*g,0)));
    bed(1);GF(mix3('#ff9a2e','#d83a22','#35170f',cool));
    bed(.72);ctx.fillStyle=mix3('#ffd24a','#ef6a2a','#35170f',cool);ctx.fill();bed(.42);ctx.fillStyle=mix3('#fffbe0','#ffc24a','#4a2014',cool);ctx.fill();
    for(const s of this.pc){const tt=t-s.d;if(tt<=0)continue;const up=eOut(cl(tt/.09,0,1))*(1+.25*Math.max(0,1-tt/.16)),set=1-.4*cl((tt-.14)/.35,0,1),light=s.tone<.5;
      if(s.k==='slab'){const L=s.lift*up*set,zi=L*.15,zo=L,top=[pt(s.a0,s.r1,zi),pt(s.a0,s.r2,zo),pt(s.am,s.r2*s.bump,zo),pt(s.a1,s.r2,zo),pt(s.a1,s.r1,zi)];
        path([top[1],top[2],top[3],pt(s.a1,s.r2,0),pt(s.am,s.r2*s.bump,0),pt(s.a0,s.r2,0)]);GF('#5a3122');
        path([top[0],top[1],pt(s.a0,s.r2,0),pt(s.a0,s.r1,0)]);ctx.fillStyle='#6e3d29';ctx.fill();ctx.stroke();
        path(top);ctx.stroke();ctx.fillStyle=light?'#ad7450':'#99654b';ctx.fill();
        const q=.58,mid=(i0,an)=>pt(an,s.r1+(s.r2-s.r1)*q,zi+(zo-zi)*q);path([mid(0,s.a0),top[1],top[2],top[3],mid(0,s.a1)]);ctx.fillStyle=light?'#d6a079':'#c28d6a';ctx.fill();
        path(top);ctx.lineWidth=1.8;ctx.stroke();}
      else{const h=s.h*up*set,b0=pt(s.am-s.hw,s.rb,0),b1=pt(s.am+s.hw,s.rb,0),bm=pt(s.am,s.rb*1.04,0),ap=pt(s.am,s.rb*1.1,h);
        path([b0,ap,b1,bm]);GF(light?'#c28d6a':'#ad7450');path([bm,ap,b1]);ctx.fillStyle='#6e3d29';ctx.fill();path([b0,ap,b1,bm]);ctx.lineWidth=1.8;ctx.stroke();}}
    ctx.restore();}}
/* cartoon dust puff: three round lobes with one shared outline, rolls outward, rises a little and shrinks away */
class CPuff{constructor(o){Object.assign(this,{t:0,layer:'top',life:.55,z:4,r:11},o);}
  update(dt){this.t+=dt;const k=Math.max(0,1-this.t/this.life);this.x+=this.vx*dt*k*2;this.y+=this.vy*dt*k*2;this.z+=22*dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,sc=(k<.25?eOut(k/.25):1-Math.pow((k-.25)/.75,2))*this.r;if(sc<1)return;const [x,y]=P(this.x,this.y,this.z);
    const L=[[-.75,.15,.75],[0,-.3,1],[.8,.2,.7]];ctx.save();ctx.lineJoin='round';
    ctx.strokeStyle='rgba(0,0,0,0)';ctx.lineWidth=3.5;ctx.beginPath();for(const l of L){ctx.moveTo(x+l[0]*sc+l[2]*sc,y+l[1]*sc);ctx.arc(x+l[0]*sc,y+l[1]*sc,l[2]*sc,0,7);}ctx.stroke();
    ctx.fillStyle='#d9c3aa';ctx.beginPath();for(const l of L){ctx.moveTo(x+l[0]*sc+l[2]*sc,y+l[1]*sc);ctx.arc(x+l[0]*sc,y+l[1]*sc,l[2]*sc,0,7);}ctx.fill();
    ctx.fillStyle='#f6ead8';ctx.beginPath();for(const l of L){ctx.moveTo(x+l[0]*sc+l[2]*sc*.78,y+l[1]*sc-l[2]*sc*.16);ctx.arc(x+l[0]*sc,y+l[1]*sc-l[2]*sc*.16,l[2]*sc*.78,0,7);}ctx.fill();ctx.restore();}}
/* the whole ground break, reusable: crater + thin cracks running further out + shock ring + a few dust puffs at the rim */
function groundBreak(x,y,sc=1,cold=0){addFx(new CCrack({x,y,R:125*sc,n:7,life:1.9,hot:cold?'#6b4a3a':'#ffb347'}));addFx(new CCrater({x,y,R:72*sc,cold}));addFx(new CRing({x,y,r0:36*sc,r1:165*sc}));
  if(!cold){
  addFx(new CBurst({e:{x,y},z:22*sc,R:52*sc,n:11,life:.34,cols:['#ff7a2a','#fff0b0']}));                                   /* fire flash at the impact */
  for(let i=0;i<7;i++){const an=i/7*Math.PI*2+.3,v=60+35*(i%3);addFx(new CDrop({x,y,z:10,vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:230+40*(i%3),r:3.5+(i%2),c:'#ffb347',c2:'#c2461c'}));}   /* lava drops */}
  for(let i=0;i<6;i++){const an=i/6*Math.PI*2+.5,r=84*sc;addFx(new CPuff({x:x+Math.cos(an)*r,y:y+Math.sin(an)*r,vx:Math.cos(an)*70,vy:Math.sin(an)*70,r:(11+4*(i%2))*sc,life:.65}));}}
/* straight thrust: a tapered spear of light shot forward at axe height */
class CThrust{constructor(o){Object.assign(this,{t:0,layer:'top',grow:.06,hold:.07,fade:.14,L:150,z:30,cols:['#e8303c','#fff3ee']},o);}
  update(dt){this.t+=dt;return this.t<this.grow+this.hold+this.fade;}
  draw(){const g=eOut(cl(this.t/this.grow,0,1)),f=cl((this.t-this.grow-this.hold)/this.fade,0,1),c=Math.cos(this.phi),s=Math.sin(this.phi);
    const p0=P(this.x+c*(18+this.L*f*.9),this.y+s*(18+this.L*f*.9),this.z),p1=P(this.x+c*(18+this.L*g),this.y+s*(18+this.L*g),this.z),dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)/2;if(l<3)return;
    ctx.save();ctx.translate((p0[0]+p1[0])/2,(p0[1]+p1[1])/2);ctx.rotate(Math.atan2(dy,dx));ctx.lineJoin='round';const h=11*(1-f*.6);
    const sh=(L,H)=>{ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(L*.3,-H*1.5,L,0);ctx.quadraticCurveTo(L*.3,H*1.5,-L,0);ctx.closePath();};
    sh(l,h);GF(this.cols[0]);sh(l*.8,h*.45);ctx.fillStyle=this.cols[1];ctx.fill();ctx.restore();}}
/* dash streak: fat at the head, tapering to nothing at the tail; eaten from the tail */
class CStreak{constructor(a,b,cols){let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);if(d<1){dx=Math.cos(player.phi);dy=Math.sin(player.phi);d=1;}const D=Math.max(d,160);this.a=[b[0]-dx/d*D,b[1]-dy/d*D];this.b=b;this.t=0;this.life=.4;this.layer='top';this.z=26;this.cols=cols||['#8e1220','#e8303c','#ffc9c2'];}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,g=eOut(cl(this.t/.08,0,1)),f=cl((k-.35)/.65,0,1),A=this.a,B=this.b,lp=q=>P(A[0]+(B[0]-A[0])*q,A[1]+(B[1]-A[1])*q,this.z);
    const p0=lp(f*f),p1=lp(g),dx=p1[0]-p0[0],dy=p1[1]-p0[1],L=Math.hypot(dx,dy);if(L<6)return;ctx.save();ctx.translate(p0[0],p0[1]);ctx.rotate(Math.atan2(dy,dx));ctx.lineJoin='round';
    const sh=(h,x0)=>{ctx.beginPath();ctx.moveTo(x0,0);ctx.quadraticCurveTo(L*.75,-h*1.25,L,0);ctx.quadraticCurveTo(L*.75,h*1.25,x0,0);ctx.closePath();},h=13*(1-f*.5);
    sh(h,0);GF(this.cols[0]);sh(h*.68,L*.12);ctx.fillStyle=this.cols[1];ctx.fill();sh(h*.28,L*.3);ctx.fillStyle=this.cols[2];ctx.fill();
    for(const [yy,x0,x1] of [[-h-5,.25,.6],[h+5,.4,.8]]){ctx.beginPath();ctx.moveTo(L*x0,yy);ctx.lineTo(L*x1,yy-1.6);ctx.lineTo(L*x1,yy+1.6);ctx.closePath();GF(this.cols[1]);}
    ctx.restore();}}
/* angular shard (armour plate, ice…) that spins and falls */
class CShard{constructor(o){Object.assign(this,{t:0,layer:'top',z:26,life:.7,s:6,cols:['#8fa0b8','#eef4ff']},o);this.rot=Math.random()*6;this.sp=(Math.random()-.5)*16;}
  update(dt){this.t+=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.vz-=620*dt;this.z+=this.vz*dt;if(this.z<0){this.z=0;this.vz*=-.3;this.vx*=.4;this.vy*=.4;this.sp*=.4;}return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z),s=this.s;ctx.save();ctx.globalAlpha=cl((this.life-this.t)/.2,0,1);ctx.translate(x,y);ctx.rotate(this.rot+this.sp*this.t);ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(-s,-s*.3);ctx.lineTo(s*.2,-s);ctx.lineTo(s,s*.2);ctx.lineTo(-s*.3,s*.8);ctx.closePath();GF(this.cols[0]);
    ctx.beginPath();ctx.moveTo(-s*.6,-s*.25);ctx.lineTo(s*.15,-s*.7);ctx.lineTo(s*.2,0);ctx.closePath();ctx.fillStyle=this.cols[1];ctx.fill();ctx.restore();}}
const shards=(e,n,cols)=>{for(let i=0;i<n;i++){const an=i/n*Math.PI*2+Math.random(),v=70+Math.random()*70;addFx(new CShard({x:e.x,y:e.y,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.6,vz:150+Math.random()*120,s:4.5+Math.random()*3,cols:cols||['#8fa0b8','#eef4ff']}));}};
const drops=(e,n)=>{const an=Math.atan2(e.y-player.y,e.x-player.x);for(let i=0;i<n;i++){const sp=an+(i-(n-1)/2)*.45,v=70+35*i;addFx(new CDrop({x:e.x,y:e.y,vx:Math.cos(sp)*v,vy:Math.sin(sp)*v,vz:110+30*i,r:3+((i+1)%2)}));}};
/* row of ice fangs that erupt from the floor one after another along the attack, hold, then sink */
class CFangs{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:.85,n:6,len:200},o);this.sy=this.y;this.f=[];for(let i=0;i<this.n;i++){const q=(i+.6)/this.n,sd=(i%2?1:-1)*(5+Math.random()*7);
      this.f.push({x:this.x+Math.cos(this.phi)*this.len*q-Math.sin(this.phi)*sd,y:this.y+Math.sin(this.phi)*this.len*q+Math.cos(this.phi)*sd,h:26+16*Math.sin(Math.PI*q)+Math.random()*8,w:8+Math.random()*4,d:q*.16,lean:(Math.random()-.5)*8});}
    this.f.sort((p,q)=>p.y-q.y);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){ctx.save();ctx.lineJoin='round';for(const f of this.f){const tt=this.t-f.d;if(tt<=0)continue;const up=eOut(cl(tt/.07,0,1))*(1+.2*Math.max(0,1-tt/.14)),dn=1-cl((this.t-(this.life-.2))/.2,0,1),h=f.h*up*dn;if(h<2)continue;
      const [x,y]=P(f.x,f.y,0);const tri=(w,hh,ox)=>{ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x+f.lean+ox,y-hh);ctx.lineTo(x+w,y);ctx.closePath();};
      tri(f.w,h,0);ctx.strokeStyle='#17324a';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#3f9ed6';ctx.fill();
      ctx.beginPath();ctx.moveTo(x-f.w*.2,y);ctx.lineTo(x+f.lean,y-h);ctx.lineTo(x+f.w,y);ctx.closePath();ctx.fillStyle='#8fdcff';ctx.fill();
      ctx.beginPath();ctx.moveTo(x+f.w*.25,y-h*.12);ctx.lineTo(x+f.lean*.9+1,y-h*.82);ctx.lineTo(x+f.w*.6,y-h*.12);ctx.closePath();ctx.fillStyle='#f2fdff';ctx.fill();}
    ctx.restore();}}
/* outlined zigzag lightning between two screen points (re-jagged a few times while it lives) */
class CBolt{constructor(o){Object.assign(this,{t:0,layer:'top',life:.24,w:7},o);this.mk();}
  mk(){const n=6;this.p=[];for(let i=0;i<=n;i++)this.p.push([(i/n),(i===0||i===n)?0:(Math.random()-.5)*.28]);this.k=0;}
  update(dt){this.t+=dt;this.k+=dt;if(this.k>.06)this.mk();return this.t<this.life;}
  draw(){const a=P(this.a[0],this.a[1],this.a[2]||0),b=P(this.b[0],this.b[1],this.b[2]||0),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,f=1-cl((this.t-this.life*.5)/(this.life*.5),0,1);
    const path=()=>{ctx.beginPath();this.p.forEach((q,i)=>{const x=a[0]+dx*q[0]+nx*q[1]*L*.5,y=a[1]+dy*q[0]+ny*q[1]*L*.5;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});};
    ctx.save();ctx.lineJoin='miter';ctx.lineCap='round';path();ctx.strokeStyle='#1c2f6b';ctx.lineWidth=this.w*f+4;ctx.stroke();path();ctx.strokeStyle='#6fc3ff';ctx.lineWidth=this.w*f;ctx.stroke();path();ctx.strokeStyle='#ffffff';ctx.lineWidth=this.w*f*.4;ctx.stroke();ctx.restore();}}
/* lightning strike in the owner's reference style (no outlines): a thick-thin jagged bolt with a white core and cyan body + soft blue glow,
   impact = short white starburst rays, glowing floor ellipses, a see-through light dome, blue-grey splash lumps thrown sideways;
   timeline: thin leader drops (0–.05) → full strike + flash (.05–.2) → base burst → bolt thins, curls up and fades (to .55) */
class CStrike{constructor(o){Object.assign(this,{t:0,life:.55,layer:'top',h:170,w:9},o);this.k=0;this.mk();
    this.sp=Array.from({length:7},(_,i)=>({a:i/7*6.283+Math.random()*.5,r:.7+Math.random()*.5,s:.6+Math.random()*.6}));this.ry=Array.from({length:12},(_,i)=>({a:i/12*6.283+Math.random()*.3,l:.5+Math.random()*.7}));}
  mk(){/* irregular: 7–9 kinks at uneven heights, sideways jumps of uneven size, sometimes two the same way */const n=7+((Math.random()*3)|0);let u=0,x=0;this.p=[[0,0,.6]];const us=Array.from({length:n-1},()=>Math.random()).sort();
    for(const q of us){x+=(Math.random()<.7?-Math.sign(x||1):Math.sign(x||1))*(.08+Math.random()*.32);x=Math.max(-.45,Math.min(.45,x));this.p.push([x,q,Math.random()<.3?.12:.5+1.1*Math.random()]);}this.p.push([0,1,1.5]);
    this.br=[];for(let j=0;j<2;j++){const m=3+((Math.random()*6)|0),d=Math.random()<.5?-1:1;this.br.push([m,d,.08+Math.random()*.1]);}
    if(Math.random()<.5){const m=2+((Math.random()*3)|0);this.p[m][0]+=.35*(Math.random()<.5?-1:1);}this.k=0;}
  update(dt){this.t+=dt;this.k+=dt;if(this.k>.05&&this.t<.3)this.mk();return this.t<this.life;}
  draw(){const t=this.t,[x0,y0]=P(this.x,this.y,0),H=this.h,W=this.w;ctx.save();ctx.lineJoin='miter';ctx.miterLimit=6;ctx.lineCap='round';
    const lead=cl(t/.05,0,1),hit=t>=.05,fade=cl((t-.2)/.35,0,1),thin=1-fade*.85;
    /* floor: glow ellipses + dome */
    if(hit){const k=eOut(cl((t-.05)/.12,0,1)),R=26+30*k;ctx.fillStyle='rgba(20,40,110,'+(.25*(1-fade))+')';ctx.beginPath();ctx.ellipse(x0,y0,R*1.1,R*1.1*K,0,0,7);ctx.fill();ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(x0,y0,1,x0,y0,R*1.6);g.addColorStop(0,'rgba(220,245,255,'+(.9*(1-fade))+')');g.addColorStop(.4,'rgba(80,170,255,'+(.55*(1-fade))+')');g.addColorStop(1,'rgba(40,80,255,0)');
      ctx.fillStyle=g;ctx.save();ctx.translate(x0,y0);ctx.scale(1,K);ctx.beginPath();ctx.arc(0,0,R*1.6,0,7);ctx.fill();ctx.restore();
      ctx.strokeStyle='rgba(150,215,255,'+(.9*(1-fade))+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x0,y0,R,R*K,0,0,7);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x0,y0,R*1.35,R*1.35*K,0,0,7);ctx.stroke();
      const dg=ctx.createRadialGradient(x0,y0,2,x0,y0,R*.9);dg.addColorStop(0,'rgba(255,255,255,'+(.55*(1-fade))+')');dg.addColorStop(.7,'rgba(90,170,255,'+(.25*(1-fade))+')');dg.addColorStop(1,'rgba(90,170,255,0)');
      ctx.fillStyle=dg;ctx.beginPath();ctx.ellipse(x0,y0,R*.9,R*.8,0,Math.PI,0);ctx.closePath();ctx.fill();
      if(!this.boom){this.boom=1;const S=sys('top'),Gs=sys('ground');Gs.add({im:tx('scorch',null,(Math.random()*3)|0),x:this.x,y:this.y,z:0,s0:70,s1:110,life:1.3,fo:.5,flat:1,rot:Math.random()*6});
        G.flare(S,this.x,this.y,10,170,'#6fb8ff',.32);G.sparks(S,this.x,this.y,6,26,'#9fdcff',340,260,.5);G.smoke(S,this.x,this.y,0,7,'#c9d8ff|#3a4f9a',70,90,.8,30);
        for(let i=0;i<8;i++){const an=Math.random()*6.283,v=R_(90,200);S.add({im:tx('shard','#41507e',i%5),x:this.x,y:this.y,z:2,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.6,vz:R_(180,330),g:900,s0:R_(8,14),s1:R_(7,11),life:R_(.6,.9),fo:.3,rot:Math.random()*6,vr:R_(-12,12),bounce:.25});}
        G.glints(S,this.x,this.y,6,6,60,'#cfe8ff',.5);}
      /* ground zaps: short jagged arcs crawling out along the floor, re-jagged every frame */
      if(t<.4){ctx.globalCompositeOperation='lighter';for(let j=0;j<5;j++){const an=j/5*6.283+t*3,L=(30+40*((j*7)%3)/2)*eOut(cl((t-.05)/.12,0,1));ctx.strokeStyle='rgba(150,220,255,'+(.9*(1-t/.4))+')';ctx.lineWidth=1.8;ctx.beginPath();let px=x0,py=y0;ctx.moveTo(px,py);for(let s2=1;s2<=4;s2++){const q=s2/4;px=x0+Math.cos(an)*L*q+(Math.random()-.5)*10;py=y0+Math.sin(an)*L*q*K+(Math.random()-.5)*5;ctx.lineTo(px,py);}ctx.stroke();}ctx.globalCompositeOperation='source-over';}
      ctx.globalAlpha=1;}
    /* the bolt: glow, cyan body (thick-thin), white core; rises off the ground as it fades */
    const top=y0-H,rise=fade*H*.35,pts=this.p.map(q=>[x0+q[0]*44*(1+fade*.6)+Math.sin(t*20+q[1]*9)*fade*6,top+(H-rise)*q[1]*lead-(0),q[2]]);
    const path=()=>{ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));};
    if(!hit){ctx.strokeStyle='rgba(180,230,255,.9)';ctx.lineWidth=2;path();ctx.stroke();ctx.restore();return;}
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(60,140,255,'+(.45*thin)+')';ctx.lineWidth=W*2.2*thin;path();ctx.stroke();ctx.globalCompositeOperation='source-over';
    /* branches */for(const [m,d,l] of this.br){const a=pts[m];if(!a)continue;const b=[a[0]+d*H*l*.9,a[1]+H*l*.5],c=[b[0]+d*H*l*.4,b[1]+H*l*.6];for(const [col,lw] of [['#1d5bff',4.2*thin],['#8fe0ff',2.2*thin],['#fff',.9*thin]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.stroke();}}
    /* body as a filled ribbon (no round caps): width pinches to a point at some kinks, bulges between → the reference's thick-thin jagged bolt */
    const rib=(sc)=>{const L=[],R2=[];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,
        w=W*thin*sc*(i===0?.15:i===pts.length-1?.55:pts[i][2]);L.push([pts[i][0]+nx*w*.5,pts[i][1]+ny*w*.5]);R2.push([pts[i][0]-nx*w*.5,pts[i][1]-ny*w*.5]);}
      ctx.beginPath();L.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));for(let i=R2.length-1;i>=0;i--)ctx.lineTo(R2[i][0],R2[i][1]);ctx.closePath();};
    rib(1.6);ctx.fillStyle='#1d5bff';ctx.fill();rib(1.05);ctx.fillStyle='#59cbff';ctx.fill();rib(.42);ctx.fillStyle='#ffffff';ctx.fill();
    if(t<.12){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(200,235,255,'+(.5*(1-t/.12))+')';ctx.beginPath();ctx.arc(x0,y0-20,60,0,7);ctx.fill();}
    ctx.restore();}}
const ICE=['#3f9ed6','#eaffff'],ICEC=['#5fb8e8','#f2fdff'];
/* life-steal orb: leaves the enemy on a curved path, speeds up, is swallowed by the wolf; a short tapered tail follows it */
class COrb{constructor(o){Object.assign(this,{t:0,layer:'top',life:.42,delay:0,r:5,side:1},o);this.t=-this.delay;this.sx=this.e.x;this.sy=this.e.y;this.h=[];}
  pos(k){const q=k*k,ex=player.x,ey=player.y,mx=(this.sx+ex)/2-(ey-this.sy)*.35*this.side,my=(this.sy+ey)/2+(ex-this.sx)*.35*this.side,u=1-q;
    return [u*u*this.sx+2*u*q*mx+q*q*ex,u*u*this.sy+2*u*q*my+q*q*ey,26+18*Math.sin(Math.PI*q)];}
  update(dt){this.t+=dt;if(this.t>0){this.h.push(this.pos(Math.min(1,this.t/this.life)));if(this.h.length>6)this.h.shift();}if(this.t>=this.life&&!this.done){this.done=1;this.on&&this.on();}return this.t<this.life;}
  draw(){if(this.t<=0||this.h.length<2)return;const hd=this.h[this.h.length-1],tl=this.h[0],a=P(tl[0],tl[1],tl[2]),b=P(hd[0],hd[1],hd[2]),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,r=this.r;
    ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(Math.atan2(dy,dx));ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(-L*.3,-r,0,-r);ctx.arc(0,0,r,-Math.PI/2,Math.PI/2);ctx.quadraticCurveTo(-L*.3,r,-L,0);ctx.closePath();
    GF('#c2185b');ctx.beginPath();ctx.arc(0,0,r*.55,0,7);ctx.fillStyle='#ff9fbe';ctx.fill();ctx.restore();}}
/* small outlined plus that rises from the wolf and fades (healing read) */
class CPlus{constructor(o){Object.assign(this,{t:0,layer:'top',life:.6,z:30,s:5},o);}
  update(dt){this.t+=dt;this.z+=46*dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,sc=this.s*(k<.2?eOut(k/.2):1),[x,y]=P(player.x+this.ox,player.y,this.z);ctx.save();ctx.globalAlpha=1-cl((k-.6)/.4,0,1);ctx.translate(x,y);ctx.lineJoin='round';
    ctx.beginPath();ctx.rect(-sc,-sc*.34,sc*2,sc*.68);ctx.rect(-sc*.34,-sc,sc*.68,sc*2);GF('#ff6f9c');ctx.restore();}}
/* ---------- GX: detailed code VFX (owner 2026-11-20: "no pictures, all VFX, pretty, lots of detail") ----------
   Textures are DRAWN BY CODE once at load (glow, 4-point star flare, spark, soft smoke, faceted ice crystal clusters, shards,
   snowflakes, frost floor) and then thrown around by a particle system: hundreds of small pieces with drag, gravity, bounce,
   orbit, streak-stretch along their motion, additive light. Look = owner's references: no outlines, white-hot core, glow, body. */
const TX={};
const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;};
const rgba=(h,a)=>{const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return 'rgba('+v.join(',')+','+a+')';};
let SEED=7;const rnd=()=>{SEED=(SEED*16807)%2147483647;return SEED/2147483647;};
function tx(name,col,i){const k=name+(col||'')+(i||0);if(TX[k])return TX[k];const c=col||'#ffffff';let t;
  if(name==='glow')t=cv(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,rgba(c,1));r.addColorStop(.25,rgba(c,.55));r.addColorStop(.6,rgba(c,.15));r.addColorStop(1,rgba(c,0));g.fillStyle=r;g.fillRect(0,0,64,64);});
  else if(name==='core')t=cv(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.18,'rgba(255,255,255,.95)');r.addColorStop(.35,rgba(c,.7));r.addColorStop(1,rgba(c,0));g.fillStyle=r;g.fillRect(0,0,64,64);});
  else if(name==='star')t=cv(160,160,(g)=>{g.globalCompositeOperation='lighter';const r=g.createRadialGradient(80,80,0,80,80,60);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,rgba(c,.9));r.addColorStop(.4,rgba(c,.25));r.addColorStop(1,rgba(c,0));g.fillStyle=r;g.fillRect(0,0,160,160);
    const spike=(an,L,w)=>{g.save();g.translate(80,80);g.rotate(an);const lg=g.createLinearGradient(0,0,L,0);lg.addColorStop(0,'rgba(255,255,255,1)');lg.addColorStop(.35,rgba(c,.8));lg.addColorStop(1,rgba(c,0));g.fillStyle=lg;g.beginPath();g.moveTo(0,-w);g.lineTo(L,0);g.lineTo(0,w);g.closePath();g.fill();g.restore();};
    for(let k=0;k<4;k++)spike(k*Math.PI/2,78,5.5);for(let k=0;k<4;k++)spike(Math.PI/4+k*Math.PI/2,40,3);
    const r2=g.createRadialGradient(80,80,0,80,80,14);r2.addColorStop(0,'rgba(255,255,255,1)');r2.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r2;g.fillRect(0,0,160,160);});
  else if(name==='smoke')t=cv(128,128,(g)=>{SEED=31+i*97;for(let n=0;n<16;n++){const a=rnd()*6.283,d=rnd()*30,x=64+Math.cos(a)*d,y=68+Math.sin(a)*d*.8,r=16+rnd()*24;const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'rgba(255,255,255,.55)');q.addColorStop(.6,'rgba(255,255,255,.3)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
    for(let n=0;n<5;n++){const a=rnd()*6.283,d=8+rnd()*24,x=64+Math.cos(a)*d,y=60+Math.sin(a)*d*.7,r=10+rnd()*10;const q=g.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);q.addColorStop(0,'rgba(255,255,255,.6)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
    g.globalCompositeOperation='source-atop';const lg=g.createLinearGradient(0,20,0,110);const [hi,lo]=c.split('|');lg.addColorStop(0,hi||'#ffffff');lg.addColorStop(1,lo||hi||'#ffffff');g.fillStyle=lg;g.fillRect(0,0,128,128);});
  else if(name==='crystal')t=cv(170,220,(g,W,H)=>{SEED=11+i*131;const bx=W/2,by=H-8;const P2=[];
    const n=3+(i%2)+1;P2.push({an:(rnd()-.5)*.12,len:150+rnd()*40,w:30+rnd()*8,o:0});
    for(let k=1;k<n;k++){const s=k%2?-1:1;P2.push({an:s*(.32+rnd()*.38),len:70+rnd()*60,w:18+rnd()*9,o:s*(6+rnd()*12)});}
    P2.sort((a,b)=>a.len-b.len);g.shadowColor='rgba(110,210,255,.9)';g.shadowBlur=14;
    for(const p of P2){const dx=Math.sin(p.an),dy=-Math.cos(p.an),nx=-dy,ny=dx,x0=bx+p.o,y0=by,sh=p.len*.74,w=p.w/2;
      const L0=[x0-nx*w,y0-ny*w],R0=[x0+nx*w,y0+ny*w],LS=[x0-nx*w*.92+dx*sh,y0-ny*w*.92+dy*sh],RS=[x0+nx*w*.92+dx*sh,y0+ny*w*.92+dy*sh],TP=[x0+dx*p.len,y0+dy*p.len],MS=[x0+nx*w*.15+dx*sh*1.02,y0+ny*w*.15+dy*sh*1.02],MB=[x0+nx*w*.15,y0+ny*w*.15];
      const poly=(pts,f)=>{g.beginPath();pts.forEach((q,j)=>j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fillStyle=f;g.fill();};
      const lgL=g.createLinearGradient(x0,y0,TP[0],TP[1]);lgL.addColorStop(0,'#1d5d9c');lgL.addColorStop(.7,'#3a8fd0');lgL.addColorStop(1,'#7fcfff');
      const lgR=g.createLinearGradient(x0,y0,TP[0],TP[1]);lgR.addColorStop(0,'#5fb6ec');lgR.addColorStop(.6,'#a9e6ff');lgR.addColorStop(1,'#eafcff');
      poly([L0,MB,MS,LS],lgL);g.shadowBlur=0;poly([MB,R0,RS,MS],lgR);poly([LS,MS,TP],'#9fdcff');poly([MS,RS,TP],'#f4feff');
      g.globalCompositeOperation='lighter';g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=1.6;g.beginPath();g.moveTo(MB[0],MB[1]);g.lineTo(MS[0],MS[1]);g.lineTo(TP[0],TP[1]);g.stroke();
      g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1.2;g.beginPath();g.moveTo(R0[0],R0[1]);g.lineTo(RS[0],RS[1]);g.lineTo(TP[0],TP[1]);g.stroke();
      for(let s=0;s<3;s++){const u=.2+rnd()*.5,v=.3+rnd()*.6;g.strokeStyle='rgba(220,250,255,'+(.25+rnd()*.3)+')';g.lineWidth=.8;g.beginPath();const ax=x0+dx*sh*u+nx*w*(v-.5)*1.4,ay=y0+dy*sh*u+ny*w*(v-.5)*1.4;g.moveTo(ax,ay);g.lineTo(ax+dx*12+nx*4,ay+dy*12+ny*4);g.stroke();}
      g.globalCompositeOperation='source-over';g.shadowBlur=14;}
    g.globalCompositeOperation='lighter';const r=g.createRadialGradient(bx,by-20,0,bx,by-20,60);r.addColorStop(0,'rgba(190,240,255,.55)');r.addColorStop(1,'rgba(80,160,255,0)');g.fillStyle=r;g.fillRect(0,0,W,H);});
  else if(name==='shard')t=cv(40,40,(g)=>{SEED=5+i*53;const p=[[20,2+rnd()*4],[34+rnd()*4,16+rnd()*8],[22+rnd()*6,38],[4+rnd()*4,22+rnd()*6]];g.shadowColor='rgba(120,210,255,.9)';g.shadowBlur=5;
    g.beginPath();p.forEach((q,j)=>j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fillStyle=c==='#ffffff'?'#5fb6ec':c;g.fill();g.shadowBlur=0;g.beginPath();g.moveTo(p[0][0],p[0][1]);g.lineTo(p[1][0],p[1][1]);g.lineTo(20,20);g.closePath();g.fillStyle='rgba(240,253,255,.95)';g.fill();
    g.beginPath();g.moveTo(p[3][0],p[3][1]);g.lineTo(20,20);g.lineTo(p[2][0],p[2][1]);g.closePath();g.fillStyle='rgba(20,70,140,.45)';g.fill();});
  else if(name==='flake')t=cv(32,32,(g)=>{g.translate(16,16);g.shadowColor='rgba(140,220,255,1)';g.shadowBlur=4;g.strokeStyle='#fff';g.lineWidth=1.6;g.lineCap='round';for(let k=0;k<6;k++){g.rotate(Math.PI/3);g.beginPath();g.moveTo(0,0);g.lineTo(0,-12);g.moveTo(0,-7);g.lineTo(-3.5,-10);g.moveTo(0,-7);g.lineTo(3.5,-10);g.stroke();}});
  else if(name==='floor')t=cv(320,320,(g)=>{SEED=3+i*71;const c0=160;const rim=[];for(let k=0;k<40;k++){const a=k/40*6.283;rim.push([c0+Math.cos(a)*(138+rnd()*20)*(k%2?1:.93),c0+Math.sin(a)*(138+rnd()*20)*(k%2?1:.93)]);}
    g.beginPath();rim.forEach((q,j)=>j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();const r=g.createRadialGradient(c0,c0,0,c0,c0,160);r.addColorStop(0,'rgba(255,255,255,.95)');r.addColorStop(.3,'rgba(200,244,255,.85)');r.addColorStop(.75,'rgba(90,180,240,.75)');r.addColorStop(1,'rgba(40,110,200,.6)');g.fillStyle=r;g.fill();
    g.save();g.clip();for(let k=0;k<50;k++){const a=rnd()*6.283,d=rnd()*150,x=c0+Math.cos(a)*d,y=c0+Math.sin(a)*d,s=4+rnd()*14;g.fillStyle='rgba(255,255,255,'+(.12+rnd()*.2)+')';g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s*.5,y);g.lineTo(x,y+s*.4);g.lineTo(x-s*.5,y);g.closePath();g.fill();}g.restore();
    g.lineCap='round';const br=(x,y,a,L,w,d)=>{if(d>3||L<8)return;let px=x,py=y;g.lineWidth=w;g.strokeStyle='rgba(255,255,255,.95)';g.shadowColor='rgba(150,230,255,1)';g.shadowBlur=6;g.beginPath();g.moveTo(px,py);for(let s=0;s<4;s++){a+=(rnd()-.5)*.7;px+=Math.cos(a)*L/4;py+=Math.sin(a)*L/4;g.lineTo(px,py);}g.stroke();if(rnd()<.8)br(px,py,a+.6+rnd()*.4,L*.55,w*.65,d+1);if(rnd()<.8)br(px,py,a-.6-rnd()*.4,L*.55,w*.65,d+1);};
    for(let k=0;k<9;k++)br(c0,c0,k/9*6.283+rnd()*.4,70+rnd()*40,3.2,0);g.shadowBlur=0;g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=3;g.beginPath();rim.forEach((q,j)=>j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.stroke();});
  else if(name==='scorch')t=cv(200,200,(g)=>{SEED=9+i*41;const r=g.createRadialGradient(100,100,0,100,100,96);r.addColorStop(0,'rgba(10,14,40,.75)');r.addColorStop(.6,'rgba(20,30,70,.45)');r.addColorStop(1,'rgba(20,30,70,0)');g.fillStyle=r;g.fillRect(0,0,200,200);
    g.lineCap='round';for(let k=0;k<10;k++){let a=k/10*6.283+rnd()*.3,x=100,y=100;g.strokeStyle='rgba(140,210,255,.8)';g.lineWidth=2;g.beginPath();g.moveTo(x,y);for(let s=0;s<5;s++){a+=(rnd()-.5)*.8;x+=Math.cos(a)*14;y+=Math.sin(a)*14;g.lineTo(x,y);}g.stroke();}});
  return TX[k]=t;}
/* particle system: one fx object holds many particles; o.layer = 'top' | 'ground' */
class GSys{constructor(layer,keep){this.layer=layer||'top';this.p=[];this.t=0;this.keep=keep||0;}
  add(o){const q=Object.assign({t:0,life:.6,x:0,y:0,z:0,vx:0,vy:0,vz:0,dr:0,g:0,s0:10,s1:10,a0:1,fi:.03,fo:.5,rot:0,vr:0,add:0,str:0,asp:1,flat:0,bounce:.2},o);if(q.delay)q.t=-q.delay;this.p.push(q);return q;}
  update(dt){this.t+=dt;for(const q of this.p){q.t+=dt;if(q.t<0)continue;
      if(q.orb){q.ang+=q.va*dt;q.r=Math.max(0,q.r+q.vr2*dt);q.z+=q.vz*dt;if(q.cf){q.cx=q.cf.x;q.cy=q.cf.y;}q.x=q.cx+Math.cos(q.ang)*q.r;q.y=q.cy+Math.sin(q.ang)*q.r;}
      else{const f=Math.exp(-q.dr*dt);q.vx*=f;q.vy*=f;q.vz=q.vz*f-q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;if(q.z<0&&q.g){q.z=0;q.vz=-q.vz*q.bounce;q.vx*=.45;q.vy*=.45;q.vr*=.4;}}
      q.rot+=q.vr*dt;}
    this.p=this.p.filter(q=>q.t<q.life);return this.p.length>0||this.t<this.keep;}
  draw(){for(const q of this.p){if(q.t<0)continue;const k=q.t/q.life,a=q.a0*Math.min(1,q.t/q.fi)*(k>1-q.fo?(1-k)/q.fo:1);if(a<=.01)continue;
      const s=q.s0+(q.s1-q.s0)*eOut(k),[x,y]=P(q.x,q.y,q.z),im=q.im;ctx.save();ctx.globalAlpha=Math.min(1,a);ctx.globalCompositeOperation=q.add?'lighter':'source-over';ctx.translate(x,y);
      if(q.str){const lx=q.lx==null?x:q.lx,ly=q.ly==null?y:q.ly,dx=x-lx,dy=y-ly;q.lx=x;q.ly=y;const L=Math.max(s,Math.hypot(dx,dy)*q.str);ctx.rotate(Math.atan2(dy,dx));ctx.drawImage(im,-L,-s*.5,L*1.15,s);}
      else{if(q.flat)ctx.scale(1,K);if(q.rot)ctx.rotate(q.rot);const h=s*q.asp*(q.sy==null?1:q.sy);ctx.drawImage(im,-s/2,-h*(q.ay==null?.5:q.ay),s,h);}
      ctx.restore();}}}
const sys=(layer,keep)=>{const s=new GSys(layer,keep);addFx(s);return s;};
const R_=(a,b)=>a+Math.random()*(b-a);
/* ready-made bursts */
const G={
 flare(S,x,y,z,size,col,life=.28){S.add({im:tx('star',col),x,y,z,s0:size*.3,s1:size,life,fo:.6,add:1,rot:R_(-.2,.2)});S.add({im:tx('core',col),x,y,z,s0:size*.9,s1:size*1.3,life:life*.8,fo:.8,add:1});},
 sparks(S,x,y,z,n,col,sp=260,up=120,life=.45){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*R_(.4,1.1);S.add({im:tx('core',col),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(-.2,1)*up+40,dr:4,g:380,s0:R_(5,9),s1:2,life:life*R_(.6,1.2),add:1,str:2.2,fo:.5});}},
 smoke(S,x,y,z,n,tint,size=60,sp=50,life=.9,rise=20){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*R_(.3,1);S.add({im:tx('smoke',tint,i%4),x:x+Math.cos(a)*size*.15,y:y+Math.sin(a)*size*.1,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,vz:rise,dr:1.8,s0:size*R_(.45,.7),s1:size*R_(1,1.4),life:life*R_(.75,1.15),fi:.08,fo:.65,a0:R_(.55,.85),rot:Math.random()*6.283,vr:R_(-.8,.8)});}},
 shards(S,x,y,z,n,sp=200,up=260,size=1){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*R_(.4,1);S.add({im:tx('shard','#5fb6ec',i%5),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:up*R_(.5,1.1),g:820,dr:.6,s0:R_(9,17)*size,s1:R_(7,12)*size,life:R_(.6,.95),fo:.35,rot:Math.random()*6,vr:R_(-14,14),bounce:.3});}},
 glints(S,x,y,z,n,R,col='#bff0ff',life=.7){for(let i=0;i<n;i++){const a=Math.random()*6.283,d=R*Math.sqrt(Math.random());S.add({im:tx('star',col),x:x+Math.cos(a)*d,y:y+Math.sin(a)*d*.7,z:z+R_(0,R*.6),vz:R_(10,40),s0:2,s1:R_(14,24),life:life*R_(.5,1),delay:R_(0,.25),fo:.6,add:1,rot:R_(0,.8)});}},
};
/* thin bright ring texture */
const ringTex=(col)=>{const k='ring'+col;if(TX[k])return TX[k];return TX[k]=cv(256,256,(g)=>{g.globalCompositeOperation='lighter';for(const [r,w,a] of [[118,10,.25],[118,4,.6],[118,1.6,1]]){g.strokeStyle=r===118&&w===1.6?'rgba(255,255,255,'+a+')':rgba(col,a);g.lineWidth=w;g.beginPath();g.arc(128,128,r,0,7);g.stroke();}
  const q=g.createRadialGradient(128,128,90,128,128,124);q.addColorStop(0,rgba(col,0));q.addColorStop(.85,rgba(col,.25));q.addColorStop(1,rgba(col,0));g.fillStyle=q;g.fillRect(0,0,256,256);});};
G.ring=(S,x,y,r0,r1,col,life=.35)=>S.add({im:ringTex(col),x,y,z:1,s0:r0*2,s1:r1*2,life,fo:.7,add:1,flat:1});
/* crystal cluster that rises out of the ground (sorted layer so it stands between characters) */
class GCrys{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:.9,w:100,rise:.1,delay:0,fo:.3,v:0,fx:0},o);this.t=-this.delay;this.im=tx('crystal',null,this.v);}
  get sy(){return this.y+1;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<=0)return;const t=this.t,k=t/this.life,up=eOut(cl(t/this.rise,0,1))*(1+.22*Math.max(0,1-(t-this.rise)/.14)),sink=k>1-this.fo?(k-(1-this.fo))/this.fo:0,[x,y]=P(this.x,this.y,0),w=this.w*(1+.06*Math.sin(t*30)*Math.max(0,1-t/.2)),h=w*this.im.height/this.im.width;
    ctx.save();ctx.beginPath();ctx.rect(x-w,y-h*1.5,w*2,h*1.5+3);ctx.clip();ctx.translate(x,y+h*.55*sink);if(this.fx)ctx.scale(-1,1);ctx.globalAlpha=1-sink*.6;ctx.drawImage(this.im,-w/2,-h*up,w,h*up);
    if(t<.12){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-t/.12;ctx.drawImage(this.im,-w/2,-h*up,w,h*up);}ctx.restore();}}
const crys=o=>addFx(new GCrys(o));
/*BLZ*/
/* ---------- Blizzard redrawn BY CODE from the owner's painted key art (2026-11-20, his picture is the target look, nothing is pasted) ----------
   floor: deep-blue disc with glowing hexagon ice cells + a spiky star rim with diamond insets (texture 'starFloor')
   funnel: stacked swoosh blades (sharp tips, sawtooth underside, dark blue → cyan → white top edge, additive halo), wider at the top, spinning
   centre: faceted crystal clusters (tx crystal), cartoon frost clouds both sides of the base, big 6-arm snowflakes, floating ice shards, dots */
const tx2=(name,i)=>{const k='b2'+name+(i||0);if(TX[k])return TX[k];let t;
  if(name==='starFloor')t=cv(512,512,(g)=>{SEED=17;const c=256,R0=200,N=18;g.translate(c,c);
    const star=[];for(let k=0;k<N*2;k++){const a=k/(N*2)*6.283,r=k%2?R0*1.0:R0*1.22;star.push([Math.cos(a)*r,Math.sin(a)*r]);}
    const path=(sc)=>{g.beginPath();star.forEach((q,j)=>j?g.lineTo(q[0]*sc,q[1]*sc):g.moveTo(q[0]*sc,q[1]*sc));g.closePath();};
    g.shadowColor='rgba(120,220,255,1)';g.shadowBlur=26;path(1);g.fillStyle='#8fe6ff';g.fill();g.shadowBlur=0;
    path(.97);const r=g.createRadialGradient(0,0,0,0,0,R0*1.2);r.addColorStop(0,'#e6faff');r.addColorStop(.3,'#8fd6ff');r.addColorStop(.75,'#3d8fe6');r.addColorStop(1,'#4aa6f0');g.fillStyle=r;g.fill();
    /* diamond insets on every spike */for(let k=0;k<N;k++){const a=(k*2+1)/(N*2)*6.283,ca=Math.cos(a),sa=Math.sin(a),px=-sa,py=ca,d0=R0*.98,d1=R0*1.17,m=(d0+d1)/2;g.beginPath();g.moveTo(ca*d0,sa*d0);g.lineTo(ca*m+px*9,sa*m+py*9);g.lineTo(ca*d1,sa*d1);g.lineTo(ca*m-px*9,sa*m-py*9);g.closePath();g.fillStyle='rgba(235,252,255,.95)';g.fill();}
    /* glowing hexagon cells */g.save();path(.93);g.clip();const hs=34;g.lineJoin='round';for(let yy=-260;yy<260;yy+=hs*1.5)for(let xx=-260;xx<260;xx+=hs*1.732){const ox=xx+((Math.round(yy/(hs*1.5))%2)?hs*.866:0),oy=yy;if(Math.hypot(ox,oy)>R0*1.05)continue;
      const jit=()=>(rnd()-.5)*7;g.beginPath();for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;const X=ox+Math.cos(a)*hs+jit(),Y=oy+Math.sin(a)*hs+jit();k?g.lineTo(X,Y):g.moveTo(X,Y);}g.closePath();
      const lt=1-Math.hypot(ox,oy)/(R0*1.1);g.fillStyle='rgba(40,110,210,'+(.18+.3*rnd())+')';g.fill();g.strokeStyle='rgba(200,245,255,'+(.55+.4*lt)+')';g.lineWidth=2.6;g.shadowColor='rgba(150,230,255,1)';g.shadowBlur=8;g.stroke();g.shadowBlur=0;}
    const gl=g.createRadialGradient(0,0,0,0,0,R0*.6);gl.addColorStop(0,'rgba(230,250,255,.85)');gl.addColorStop(1,'rgba(150,220,255,0)');g.fillStyle=gl;g.fillRect(-300,-300,600,600);g.restore();
    path(1);g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=3;g.stroke();path(.94);g.strokeStyle='rgba(210,248,255,.8)';g.lineWidth=2;g.stroke();});
  else if(name==='cloud')t=cv(200,130,(g)=>{SEED=23+i*19;const L=[];for(let k=0;k<7;k++)L.push([30+k*23+rnd()*10,80-Math.sin(k/6*3.14)*30-rnd()*12,22+Math.sin(k/6*3.14)*16+rnd()*8]);
    const body=(dy,col)=>{g.fillStyle=col;g.beginPath();for(const [x,y,r] of L){g.moveTo(x+r,y+dy);g.arc(x,y+dy,r,0,7);}g.rect(20,80+dy,160,24);g.fill();};
    g.shadowColor='rgba(140,200,255,.9)';g.shadowBlur=14;body(0,'#6f8ee8');g.shadowBlur=0;body(-5,'#a3bcff');body(-11,'#dbe6ff');
    g.globalCompositeOperation='source-atop';for(const [x,y,r] of L){const q=g.createRadialGradient(x-r*.3,y-r*.5,0,x,y,r);q.addColorStop(0,'rgba(240,248,255,.8)');q.addColorStop(1,'rgba(240,248,255,0)');g.fillStyle=q;g.beginPath();g.arc(x,y-8,r*.8,0,7);g.fill();}});
  else if(name==='bigFlake')t=cv(64,64,(g)=>{g.translate(32,32);g.shadowColor='rgba(120,220,255,1)';g.shadowBlur=8;g.strokeStyle='#f4feff';g.lineCap='round';
    for(let k=0;k<6;k++){g.rotate(Math.PI/3);g.lineWidth=3.2;g.beginPath();g.moveTo(0,0);g.lineTo(0,-26);g.stroke();g.lineWidth=2.4;g.beginPath();for(const [d,l] of [[-10,8],[-17,7],[-22,4]]){g.moveTo(0,d);g.lineTo(-l,d-l);g.moveTo(0,d);g.lineTo(l,d-l);}g.stroke();}
    g.fillStyle='#fff';g.beginPath();g.arc(0,0,4,0,7);g.fill();});
  return TX[k]=t;};
class CBlz{constructor(o){Object.assign(this,{t:0,life:3,R:130,H:150,front:0},o);this.layer=this.front?'top':'ground';
    if(!this.front){this.bl=[];const NR=11;for(let i=0;i<NR;i++){const u=i/(NR-1),nb=2+(i%2);for(let k=0;k<nb;k++)this.bl.push({u,a0:k/nb*6.283+i*1.1,span:1.7+((i*7+k*3)%5)*.18,th:.24+.08*((i+k)%3)/2,sp:3.2+((i*5+k)%4)*.35});}
      this.flk=Array.from({length:9},(_,i)=>({a:i*2.1,r:.55+.5*((i*37)%10)/10,z:.15+.8*((i*53)%10)/10,s:i%3===0?12:8,sp:1.3+((i*11)%7)/6}));
      this.sh2=Array.from({length:8},(_,i)=>({a:i*.8+.3,r:.9+.35*((i*29)%10)/10,z:.1+.75*((i*41)%10)/10,s:10+(i%3)*4,sp:.9+((i*7)%5)/6}));
      addFx(new this.constructor(Object.assign({},o,{front:1,bl:this.bl,flk:this.flk,sh2:this.sh2})));
      this.ps=sys('top');this.gs=sys('ground');G.flare(this.ps,this.x,this.y,30,this.R*1.4,'#9fe2ff',.35);G.ring(this.gs,this.x,this.y,this.R*.3,this.R*1.3,'#bfeeff',.5);}}
  update(dt){this.t+=dt;if(!this.front){const X=this.x,Y=this.y,R=this.R;this.ps.keep=this.gs.keep=this.t+.2;
      const em=(rate,f)=>{this['e'+rate]=(this['e'+rate]||0)+dt*rate;while(this['e'+rate]>=1){this['e'+rate]--;f();}};
      if(this.t<this.life-.35){em(this instanceof CTorn?14:60,()=>{const an=Math.random()*6.283;this.ps.add({im:tx('core','#bff0ff'),orb:1,cx:X,cy:Y,ang:an,r:R*R_(.4,1.1),va:R_(3,5),vr2:0,z:R_(10,this.H),vz:R_(10,30),s0:R_(3,6),s1:2,life:R_(.35,.6),add:1,str:2.4,fo:.5,a0:.8});});
        em(this instanceof CTorn?6:25,()=>{const an=Math.random()*6.283;this.ps.add({im:tx('core','#ffffff'),orb:1,cx:X,cy:Y,ang:an,r:R*R_(.3,1.2),va:R_(1.5,3),vr2:R_(-5,10),z:R_(5,this.H*1.1),vz:R_(5,25),s0:R_(4,7),s1:3,life:R_(.6,1.1),add:1,fo:.5});});
        if(0)em(5,()=>{const an=Math.random()*6.283,r=R*R_(.4,.9),v=R_(60,110);this.ps.add({im:tx('shard','#5fb6ec',(Math.random()*5)|0),x:X+Math.cos(an)*r,y:Y+Math.sin(an)*r,z:4,vx:-Math.sin(an)*v,vy:Math.cos(an)*v*.6,vz:R_(180,260),g:640,s0:R_(10,15),s1:R_(8,11),life:R_(.6,.9),fo:.3,rot:Math.random()*6,vr:R_(-12,12)});});}
      else if(!this.endB){this.endB=1;G.flare(this.ps,X,Y,40,R*1.3,'#bff0ff',.3);}}
    return this.t<this.life;}
  draw(){const t=this.t,gI=eOut(cl(t/.3,0,1)),pop=gI*(1+.12*Math.max(0,1-Math.abs(t-.3)/.15)),a=cl((this.life-t)/.35,0,1),R=this.R*pop,H=this.H*gI,X=this.x,Y=this.y,[cx,cy]=P(X,Y,0);
    ctx.save();ctx.globalAlpha=a;const pt=(an,r,z)=>P(X+Math.cos(an)*r,Y+Math.sin(an)*r,z);
    if(!this.front){
      
      ctx.save();ctx.translate(cx,cy);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(.3+.1*Math.sin(t*6));ctx.drawImage(tx('glow','#6fd0ff'),-R*.6,-R*.6,R*1.2,R*1.2);ctx.restore();ctx.globalAlpha=a;
      /* funnel body: dark-blue volume behind the blades */
      const [tX,tY]=P(X,Y,H),gv=ctx.createLinearGradient(0,cy,0,tY);gv.addColorStop(0,'rgba(200,240,255,.55)');gv.addColorStop(.4,'rgba(80,170,255,.45)');gv.addColorStop(1,'rgba(40,110,230,.35)');
      ctx.fillStyle=gv;ctx.beginPath();ctx.moveTo(cx-R*.18,cy-4);ctx.bezierCurveTo(cx-R*.3,cy-H*.4,tX-R*.6,tY+H*.15,tX-R*1.0,tY);ctx.ellipse(tX,tY,R*1.0,R*1.0*K,0,Math.PI,0);ctx.bezierCurveTo(tX+R*.6,tY+H*.15,cx+R*.3,cy-H*.4,cx+R*.18,cy-4);ctx.closePath();ctx.fill();
      if(0)for(const [dx,flip,v] of [[-1,0,0],[1,1,1]]){const im=tx2('cloud',v),w=R*1.0;ctx.save();ctx.translate(cx+dx*R*.95,cy-R*K*.15);if(flip)ctx.scale(-1,1);ctx.globalAlpha=a*.95;ctx.drawImage(im,-w/2,-w*.65,w,w*.65);ctx.restore();}ctx.globalAlpha=a;}
    /* swoosh blades */
    const blade=(b)=>{const z=10+H*b.u,r=R*(.22+.85*Math.pow(b.u,1.15))+R*.04*Math.sin(t*4+b.a0),a0=b.a0-t*b.sp,th=R*b.th*(.7+.6*b.u),N=20;
      const pts=[];for(let i=0;i<=N;i++){const s=i/N,an=a0+b.span*s,p=pt(an,r*(1+.08*s),z+th*.9*s);pts.push([p[0],p[1],s]);}
      const shape=(w,top)=>{ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]-top*w*Math.pow(Math.sin(Math.PI*Math.pow(q[2],.6)),.9)):ctx.moveTo(q[0],q[1]));
        for(let i=pts.length-1;i>=0;i--){const q=pts[i],s=q[2],saw=((s*7)%1)>.62?.45:1,bw=w*Math.pow(Math.sin(Math.PI*Math.pow(s,.6)),.9)*saw;ctx.lineTo(q[0],q[1]+bw*(1-top));}ctx.closePath();};
      ctx.save();ctx.beginPath();const [rx,ry]=P(X,Y,z);if(this.front)ctx.rect(rx-3000,ry,6000,3000);else ctx.rect(rx-3000,ry-3000,6000,3000);ctx.clip();
      const al=a*(this.front?1:.8);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al*.35;shape(th*1.6,.3);ctx.fillStyle='#2f8cff';ctx.fill();ctx.globalCompositeOperation='source-over';
      ctx.globalAlpha=al;shape(th,.25);ctx.fillStyle=this.front?'#2a7ee0':'#1f5fc0';ctx.fill();shape(th*.72,.55);ctx.fillStyle='#59c3ff';ctx.fill();shape(th*.4,.85);ctx.fillStyle='#bff0ff';ctx.fill();shape(th*.18,1);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();};
    for(const b of (this.front?this.bl.slice().reverse():this.bl))blade(b);
    if(this.front){
      this.cr=[];
      for(const [dx,sc,v,f,dl] of this.cr){const tt=t-.08-dl;if(tt<=0)continue;const im=tx('crystal',null,v),w=R*sc,h=w*im.height/im.width,up=eOut(cl(tt/.16,0,1))*(1+.18*Math.max(0,1-(tt-.16)/.15)),bx=cx+dx*R,by=cy+R*K*.25*Math.abs(dx);
        ctx.save();ctx.translate(bx,by);if(f)ctx.scale(-1,1);ctx.globalAlpha=a;ctx.drawImage(im,-w/2,-h*up,w,h*up);if(tt<.12){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-tt/.12);ctx.drawImage(im,-w/2,-h*up,w,h*up);}ctx.restore();}
      ctx.globalAlpha=a;for(const f of this.flk){const an=f.a-t*f.sp,p=pt(an,R*f.r,10+H*f.z),s=f.s*(1+.15*Math.sin(t*5+f.a));ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(t*1.5+f.a);ctx.drawImage(tx2('bigFlake'),-s,-s,s*2,s*2);ctx.restore();}
      if(0)for(const f of this.sh2){const an=f.a-t*f.sp,p=pt(an,R*f.r,10+H*f.z);ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(an*2);ctx.drawImage(tx('shard','#5fb6ec',(f.s%5)),-f.s/2,-f.s/2,f.s,f.s*1.3);ctx.restore();}
      ctx.globalCompositeOperation='lighter';const gc=ctx.createRadialGradient(cx,cy-R*.2,2,cx,cy-R*.2,R*.6);gc.addColorStop(0,'rgba(255,255,255,.45)');gc.addColorStop(1,'rgba(90,170,255,0)');ctx.fillStyle=gc;ctx.beginPath();ctx.arc(cx,cy-R*.2,R*.6,0,7);ctx.fill();}
    ctx.restore();}}

/* Blizzard tornado, redrawn BY CODE from the owner's flat vector key art (2026-11-20): helix ribbons (dark blue body, bright band, white top edge,
   sharp tapered tips, one zigzag notch), narrow wobbling tip at the ground, wide mouth on top, dark inner core, loose crescent streaks, snowflakes.
   Every ribbon is split into runs: runs on the far side are drawn on the ground layer (behind characters), near runs on top. */
class CTorn extends CBlz{
  draw(){const t=this.t,gI=eOut(cl(t/.3,0,1)),a=cl((this.life-t)/.35,0,1),R=this.R*(.4+.6*gI)*(1+.08*Math.max(0,1-Math.abs(t-.3)/.15)),H=this.H*1.3*gI,X=this.x,Y=this.y,front=this.front;
    const rad=u=>R*(.06+.7*Math.pow(u,1.35)),bend=u=>R*(.06*Math.sin(u*2.2+t*1.2)),spin=u=>t*3.4;
    const W=(u,an,dr=0)=>P(X+bend(u)+Math.cos(an)*(rad(u)+dr),Y+Math.sin(an)*(rad(u)+dr),H*u+6);
    ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';
    if(!front){/* dark inner core */const L=[],Rr=[];for(let i=0;i<=16;i++){const u=i/16;const l=W(u,Math.PI,-rad(u)*.12),r2=W(u,0,-rad(u)*.12);L.push(l);Rr.push(r2);}
      const [bx,by]=P(X+bend(0),Y,6),[tx0,ty0]=P(X+bend(1),Y,H+6),gv=ctx.createLinearGradient(0,by,0,ty0);gv.addColorStop(0,'rgba(60,140,235,.55)');gv.addColorStop(1,'rgba(25,75,190,.5)');
      ctx.fillStyle=gv;ctx.beginPath();L.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.ellipse(tx0,ty0,rad(1)*.88,rad(1)*.88*K,0,Math.PI,0,false);for(let i=Rr.length-1;i>=0;i--)ctx.lineTo(Rr[i][0],Rr[i][1]);ctx.closePath();ctx.fill();
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.35;ctx.drawImage(tx('glow','#3f9de6'),bx-R*.5,by-R*.25,R,R*.5);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;}
    if(!this.rb){this.rb=[];const n=9;for(let i=0;i<n;i++)this.rb.push({u0:-.04+i*.115,du:.1,a0:i*Math.PI,span:5.4,th:.065+.035*(i/(n-1)),nt:.5});
      this.st=[];for(let i=0;i<4;i++)this.st.push({u:.2+.2*i,a0:i*Math.PI,span:1,th:.05,dr:.4,sp:1});}
    const ribbon=(rb,o)=>{const N=34,pts=[];for(let i=0;i<=N;i++){const s=i/N,u=cl(rb.u0+rb.du*s,0,1.02),an=rb.a0+rb.span*s-spin(u)*(o.sp||1),w=Math.pow(Math.sin(Math.PI*Math.pow(s,.75)),.85),notch=Math.abs(s-rb.nt)<.04?.35:1,th=H*rb.th*w;
        const lo=W(u,an,o.dr?rad(u)*o.dr:0),hi=[lo[0],lo[1]-th*notch],cyn=[lo[0],lo[1]-th*.62*notch],wh=[lo[0],lo[1]-th*.82*notch];pts.push({lo,hi,cyn,wh,f:Math.sin(an)>0});}
      /* runs of the same side */let i=0;while(i<N){let j=i;while(j<N&&pts[j+1].f===pts[i].f)j++;const isF=pts[i].f;if(isF===!!front||o.onlyFront&&isF&&front){const run=pts.slice(i,j+2);
          const poly=(A,B)=>{ctx.beginPath();run.forEach((q,k)=>k?ctx.lineTo(q[A][0],q[A][1]):ctx.moveTo(q[A][0],q[A][1]));for(let k=run.length-1;k>=0;k--)ctx.lineTo(run[k][B][0],run[k][B][1]);ctx.closePath();};
          ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.15;ctx.lineWidth=8;ctx.strokeStyle='#3f9de6';poly('lo','hi');ctx.stroke();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;
          poly('lo','hi');ctx.fillStyle=isF?'#2a78e0':'#1a4fb0';ctx.fill();poly('cyn','hi');ctx.fillStyle=isF?'#55bfff':'#2a6fcc';ctx.fill();poly('wh','hi');ctx.fillStyle=isF?'#ffffff':'rgba(190,230,255,.7)';ctx.fill();}
        i=j+1;}};
    for(const rb of this.rb)ribbon(rb,{});
    if(front){for(const s of this.st)ribbon({u0:s.u,du:.04,a0:s.a0,span:s.span,th:s.th,nt:2},{dr:s.dr,sp:s.sp,onlyFront:1});
      for(const f of this.flk.slice(0,5)){const an=f.a-t*f.sp,p=P(X+Math.cos(an)*R*(f.r+.3),Y+Math.sin(an)*R*(f.r+.3),10+H*f.z),s=f.s*.9;ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(t*1.2+f.a);ctx.drawImage(tx2('bigFlake'),-s,-s,s*2,s*2);ctx.restore();}}
    ctx.restore();}}

/* Blizzard = the owner's flat tornado picture (assets/fx/wolf/torn_key.webp, black keyed) turned into a REAL spin, the way games do tornadoes:
   the picture is treated as a cone and its texture slides round the axis — every row is cut into slices, slice at screen position p (−1…1 across
   the funnel) samples the picture at sin(asin(p)+φ), φ grows with time; parts outside the funnel (loose streaks, flakes) stay as drawn. */
const TK=new Image();TK.src='assets/fx/wolf/torn_key.webp';
class CTSpin{constructor(o){Object.assign(this,{t:0,life:3,R:130,layer:'sorted'},o);this.ps=sys('top');G.flare(this.ps,this.x,this.y,40,this.R*1.2,'#9fe2ff',.35);}
  get sy(){return this.y+2+(this.sortOff||0);}
  update(dt){this.t+=dt;this.ps.keep=this.t+.2;const em=(r,f)=>{this['e'+r]=(this['e'+r]||0)+dt*r;while(this['e'+r]>=1){this['e'+r]--;f();}};
    if(this.t<this.life-.3)em(10,()=>{const an=Math.random()*6.283;this.ps.add({im:tx2('bigFlake'),orb:1,cx:this.x,cy:this.y,ang:an,r:this.R*R_(.7,1.2),va:R_(2,3),vr2:5,z:R_(20,200),vz:R_(10,30),s0:R_(10,16),s1:8,life:R_(.8,1.3),fi:.15,fo:.4,rot:Math.random()*6,vr:R_(-3,3)});});
    return this.t<this.life;}
  draw(){if(!TK.complete||!TK.naturalWidth)return;const t=this.t,gI=eOut(cl(t/.3,0,1)),a=cl((this.life-t)/.35,0,1),S=TK.width/512,[cx,cy]=P(this.x,this.y,0),
      D=this.R*2.0*(.4+.6*gI),k=D/512,phi=-t*5.5,ROWS=72,COLS=18,y0=60,y1=452;
    ctx.save();ctx.globalAlpha=a;const ox=cx-237*k,oy=cy-451*k;/* picture tip (237,451) sits on the ground point */
    ctx.drawImage(TK,0,0,TK.width,y0*S,ox,oy,D,y0*k);
    for(let r=0;r<ROWS;r++){const ya=y0+(y1-y0)*r/ROWS,yb=y0+(y1-y0)*(r+1)/ROWS,v=1-(ya-y0)/(y1-y0),hw=22+190*Math.pow(v,1.05),cxr=237+19*v;
      const sy0=ya*S,sh=(yb-ya)*S,dy=oy+ya*k,dh=(yb-ya)*k+.6;
      /* outside the funnel: as drawn */ctx.drawImage(TK,0,sy0,(cxr-hw)*S,sh,ox,dy,(cxr-hw)*k,dh);ctx.drawImage(TK,(cxr+hw)*S,sy0,(512-cxr-hw)*S,sh,ox+(cxr+hw)*k,dy,(512-cxr-hw)*k,dh);
      for(let c=0;c<COLS;c++){const p0=-1+2*c/COLS,p1=-1+2*(c+1)/COLS,u0=Math.sin(Math.asin(p0)+phi),u1=Math.sin(Math.asin(p1)+phi),sa=Math.min(u0,u1),sb=Math.max(u0,u1);
        const sx=(cxr+sa*hw)*S,sw=Math.max(.5,(sb-sa)*hw*S),dx=ox+(cxr+p0*hw)*k,dw=(p1-p0)*hw*k+.6;
        if(u1<u0){ctx.save();ctx.translate(dx+dw/2,0);ctx.scale(-1,1);ctx.drawImage(TK,sx,sy0,sw,sh,-dw/2,dy,dw,dh);ctx.restore();}else ctx.drawImage(TK,sx,sy0,sw,sh,dx,dy,dw,dh);
        /* soft shading toward the sides = roundness */}}
    if(t<.15){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-t/.15)*.6;ctx.drawImage(TK,ox,oy,D,D);}
    ctx.restore();}}


/* ---------- video-clip effects (owner 2026-11-20: ChatGPT animated GIFs / videos on black, keyed to alpha, 12-frame strips) ----------
   CClip plays an intro strip, loops a loop strip for the skill's length, then plays the outro; split at the ring centre (cy) so the far half
   draws behind the hero (ground layer) and the near half in front (top layer). */
const STRIPS={};const SDEF={cyc_loop:[12,12],cyc_io:[12,12],tempest_loop:[62,8],finale_clip:[12,6],finale2:[44,8],ragna_loop:[62,8],mjolnir_hit:[46,8],prison_loop:[62,8],shatter_hit:[50,8]};   /* name: [frames, columns] */
const strip=n=>{let o=STRIPS[n];if(!o){const d=SDEF[n]||[12,12];o=STRIPS[n]={im:new Image(),nf:d[0],cols:d[1]};o.im.src='assets/fx/wolf/'+n+'.webp?v=4';}return o.im.complete&&o.im.naturalWidth?o:null;};
if(CHAR==='wolf')Object.keys(SDEF).forEach((n,i)=>setTimeout(()=>strip(n),1500+i*250));   /* 2026-11-20 load time: the wolf's clips are fetched after the game is up, one at a time, and not at all for other heroes */
/* soft dark contact shadow + cold light pool under a standing clip, so it sits on the floor */
class CClipShadow{constructor(c){this.c=c;this.layer='ground';}update(){return this.c.t<this.c.life;}
  draw(){const c=this.c,[x,y]=P(c.x,c.y,0),r=c.w*.4,a=Math.min(1,c.t/.25)*(c.ending?Math.max(0,(c.life-c.t)/.35):1);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(10,30,70,.55)');g.addColorStop(.7,'rgba(10,30,70,.3)');g.addColorStop(1,'rgba(10,30,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.restore();}}
class CClip{constructor(o){Object.assign(this,{t:0,fps:20,front:0,cy:.52,cx:.5,z:16,io:null,inN:4,outN:4,fin:0,fout:0},o);if(this.seq){this.layer='sorted';this.whole=1;this.life=this.seq.reduce((p,q)=>p+q,0);return;}if(this.ground){this.layer='ground';this.whole=1;if(this.sky){addFx(new CClip(Object.assign({},this,{ground:0,whole:0,skyPart:1,layer:'top'})));}return;}if(this.skyPart){this.layer='top';return;}if(this.one){this.layer='sorted';this.whole=1;if(this.shadow)addFx(new CClipShadow(this));return;}this.layer=this.front?'top':'ground';if(!this.front)addFx(new CClip(Object.assign({},o,{front:1})));}
  get sy(){return this.y+2;}
  update(dt){this.t+=dt;if(this.until&&!this.ending&&!this.until()){this.ending=1;this.life=this.t+.35;this.fout=.35;}if(this.follow){this.x=player.x;this.y=player.y;}if(this.seq&&this.groundAt!=null)this.layer=this.frame()[1]>=this.groundAt?'ground':'sorted';return this.t<this.life;}
  frame(){if(this.seq){let t=this.t,i=0;while(i<this.seq.length-1&&t>=this.seq[i]){t-=this.seq[i];i++;}return [this.loop,i];}const t=this.t,f=Math.floor(t*this.fps),outT=this.life-this.outN/this.fps,L=strip(this.loop);const nl=L?L.nf:12;
    if(this.io&&f<this.inN)return [this.io,f];if(this.io&&t>=outT){const s=strip(this.io);return [this.io,(s?s.nf:12)-this.outN+Math.min(this.outN-1,Math.floor((t-outT)*this.fps))];}return [this.loop,f%nl];}
  draw(){const [n,i]=this.frame(),s=strip(n);if(!s)return;const rows=Math.ceil(s.nf/s.cols),fw=s.im.naturalWidth/s.cols,fh=s.im.naturalHeight/rows,sx=(i%s.cols)*fw,sy=Math.floor(i/s.cols)*fh;
    const t=this.t,a=Math.min(this.fin?Math.min(1,t/this.fin):1,this.fout?Math.min(1,(this.life-t)/this.fout):1),sc=this.fin?(.75+.25*eOut(Math.min(1,t/this.fin))):1;
    const [x,y]=P(this.x,this.y,this.z),w=this.w*sc,h=w*fh/fw,cyp=fh*this.cy,x0=x-w*this.cx;
    ctx.save();ctx.globalAlpha=Math.max(0,a);if(this.skyPart){const k=this.sky;ctx.drawImage(s.im,sx,sy,fw,fh*k,x0,y-h*this.cy,w,h*k);}else if(this.whole&&this.sky){const k=this.sky,o=1/fh;ctx.drawImage(s.im,sx,sy+fh*k-o,fw,fh*(1-k)+o,x0,y-h*this.cy+h*k-h*o,w,h*(1-k)+h*o);}else if(this.whole)ctx.drawImage(s.im,sx,sy,fw,fh,x0,y-h*this.cy,w,h);else if(this.front)ctx.drawImage(s.im,sx,sy+cyp,fw,fh-cyp,x0,y,w,h*(1-this.cy));else ctx.drawImage(s.im,sx,sy,fw,cyp,x0,y-h*this.cy,w,h*this.cy);ctx.restore();}}

const BZ=new Image();BZ.src='assets/fx/wolf/bz_key.webp';
/* ---------- hand-made storm (Blizzard): a funnel of wind ribbons that wraps round whoever stands in it ----------
   One object per half: 'ground' layer draws the frost floor + the back of every ribbon, 'top' layer the front of every ribbon + snowflakes,
   so characters inside are between the two. Ribbons are tapered bands on rings at different heights, each turning at its own speed. */
class CStorm{constructor(o){Object.assign(this,{t:0,life:3,R:130,H:130,front:0,n:12,c:{out:'#1d4a6e',lo:'#6bb8e6',mid:'#bfe9ff',hi:'#ffffff',floor:'#dff4ff'}},o);this.layer=this.front?'top':'ground';
    if(!this.rg){this.rg=[];for(let i=0;i<this.n;i++){const u=i/(this.n-1);this.rg.push({u,sp:(2.6+1.6*((i*7)%5)/4)*(i%2?1:.8),ph:i*1.9,arcs:2,span:2.1+.8*((i*3)%4)/3,th:.07+.04*((i*5)%3)/2});}
      this.fl=Array.from({length:12},(_,i)=>({a:i*2.4,r:.35+.6*((i*37)%10)/10,z:.1+.85*((i*53)%10)/10,sp:1.6+((i*11)%7)/5,s:3+((i*3)%3)}));this.rim=Array.from({length:22},(_,i)=>1+((i%2)?.07:0)+.05*Math.sin(i*2.7));
      addFx(new CStorm(Object.assign({},o,{front:1,rg:this.rg,fl:this.fl,rim:this.rim})));}}
  update(dt){this.t+=dt;if(!this.front){const X=this.x,Y=this.y,R=this.R,H=this.H;
      if(!this.gs){this.gs=sys('ground');this.ts=sys('top');const S=this.ts;G.flare(S,X,Y,30,R*1.6,'#9fe2ff',.4);G.shards(S,X,Y,10,16,R*2,300);G.smoke(this.gs,X,Y,0,8,'#ffffff|#8cc0e8',R*.9,R*1.2,.9,10);G.ring(this.gs,X,Y,R*.3,R*1.25,'#bfeeff',.5);}
      this.gs.keep=this.ts.keep=this.t+.2;const live=this.t<this.life-.35,em=(rate,f)=>{this['e'+rate]=(this['e'+rate]||0)+dt*rate;while(this['e'+rate]>=1){this['e'+rate]--;f();}};
      if(live){
        em(90,()=>{const an=Math.random()*6.283;this.ts.add({im:tx('flake'),orb:1,cx:X,cy:Y,ang:an,r:R*R_(.25,1.05),va:R_(2.4,4.6),vr2:R_(-12,14),z:R_(4,H*.9),vz:R_(15,55),s0:R_(5,10),s1:R_(4,8),life:R_(.8,1.5),fi:.15,fo:.4,rot:Math.random()*6,vr:R_(-6,6)});});
        em(55,()=>{const an=Math.random()*6.283,u=Math.random();this.ts.add({im:tx('core','#9fdcff'),orb:1,cx:X,cy:Y,ang:an,r:R*(.45+.55*u*u)*R_(.85,1.05),va:R_(3.5,5.5),vr2:0,z:8+H*u,vz:R_(10,30),s0:R_(4,7),s1:2,life:R_(.35,.6),add:1,str:2.6,fo:.5,a0:.85});});
        em(16,()=>{const an=Math.random()*6.283,back=Math.sin(an)<0;(back?this.gs:this.ts).add({im:tx('smoke','#ffffff|#86bde6',(Math.random()*4)|0),orb:1,cx:X,cy:Y,ang:an,r:R*R_(.75,1),va:R_(.7,1.3),vr2:R_(8,20),z:R_(0,10),vz:R_(6,18),s0:R*.45,s1:R*.8,life:R_(.9,1.3),fi:.2,fo:.6,a0:back?.55:.75,rot:Math.random()*6,vr:R_(-.6,.6)});});
        em(10,()=>{const an=Math.random()*6.283,d=R*Math.sqrt(Math.random());this.ts.add({im:tx('star','#bff0ff'),x:X+Math.cos(an)*d,y:Y+Math.sin(an)*d,z:R_(10,H),s0:2,s1:R_(14,26),life:R_(.3,.6),fo:.6,add:1,rot:R_(0,.8)});});
        em(7,()=>{const an=Math.random()*6.283,r=R*R_(.4,.95),v=R_(60,110);this.ts.add({im:tx('shard','#5fb6ec',(Math.random()*5)|0),x:X+Math.cos(an)*r,y:Y+Math.sin(an)*r,z:4,vx:-Math.sin(an)*v,vy:Math.cos(an)*v*.6,vz:R_(180,280),g:640,s0:R_(10,16),s1:R_(8,12),life:R_(.6,.9),fo:.3,rot:Math.random()*6,vr:R_(-12,12),bounce:.3});});}
      else if(!this.endB){this.endB=1;G.shards(this.ts,X,Y,20,14,R*1.6,260);G.smoke(this.ts,X,Y,6,7,'#ffffff|#8cc0e8',R*.8,R*.9,.7,20);}}
    return this.t<this.life;}
  /* look (owner's references 2026-11-20): no outlines — solid glowing shapes, white-hot core, dark shapes behind for contrast, the storm has a BODY */
  /* owner 2026-11-20: the storm is his painted Blizzard picture (assets/fx/wolf/bz_key.webp, black keyed to alpha), drawn in thin horizontal strips that sway
     with height so the funnel seems to swirl; floor rows stay still. Code particles (snow, wind streaks, smoke, shards, glints) keep flying round it. */
  drawPic(){const t=this.t,gI=eOut(cl(t/.3,0,1)),a=cl((this.life-t)/.35,0,1),im=BZ,[cx,cy]=P(this.x,this.y,0),W2=this.R*2.18*(.5+.5*gI)*(1+.015*Math.sin(t*5)),H2=W2,fy=.79;
    ctx.save();ctx.globalAlpha=a;const N=48,sh=im.height/N;for(let r=0;r<N;r++){const v=r/N,yy=cy-H2*fy+H2*v,lift=Math.max(0,(fy-.08-v)/(fy-.08)),dx=Math.sin(t*7-v*9)*W2*.035*lift+Math.sin(t*3.1+v*4)*W2*.015*lift;
      ctx.drawImage(im,0,r*sh,im.width,sh+1,cx-W2/2+dx,yy,W2,H2/N+1);}
    if(t<.15){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-t/.15)*.8;ctx.drawImage(im,cx-W2/2,cy-H2*fy,W2,H2);}ctx.restore();}
  draw(){if(this.pic&&BZ.complete&&BZ.naturalWidth){if(!this.front)this.drawPic();return;}const t=this.t,c=this.c,gI=eOut(cl(t/.35,0,1)),a=cl((this.life-t)/.3,0,1),R=this.R*(.35+.65*gI),X=this.x,Y=this.y,H=this.H*gI;ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';
    const [cx,cy]=P(X,Y,0),pt=(an,r,z)=>P(X+Math.cos(an)*r,Y+Math.sin(an)*r,z),puff=(x,y,r,col)=>{ctx.fillStyle=col;ctx.beginPath();for(const l of [[-.7,.1,.75],[0,-.25,1],[.75,.15,.7]]){ctx.moveTo(x+l[0]*r+l[2]*r,y+l[1]*r);ctx.arc(x+l[0]*r,y+l[1]*r,l[2]*r,0,7);}ctx.fill();};
    if(!this.front){
      /* dark contact shape, then the glowing floor */
      ctx.fillStyle='rgba(22,40,84,.42)';ctx.beginPath();ctx.ellipse(cx,cy,R*1.12,R*1.12*K,0,0,7);ctx.fill();
      {const fi=tx('floor',null,0);ctx.save();ctx.translate(cx,cy);ctx.scale(1,K);ctx.rotate(t*.35);const fw=R*2.3*(gI<1?.6+.4*gI:1);ctx.drawImage(fi,-fw/2,-fw/2,fw,fw);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(.35+.15*Math.sin(t*7));ctx.drawImage(tx('glow','#7fd0ff'),-R,-R,R*2,R*2);ctx.restore();ctx.globalAlpha=a;}
      ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2.4;ctx.lineCap='round';for(let k=0;k<4;k++){ctx.beginPath();for(let i=0;i<=14;i++){const q=i/14,p=pt(k*1.571-t*1.8+q*2.6,R*q*.92,0);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
      /* back mist lumps + the body of the funnel (gradient volume, brighter at the base) */
      const [tX,tY]=P(X,Y,H+14),gv=ctx.createLinearGradient(0,cy,0,tY);gv.addColorStop(0,'rgba(215,245,255,.5)');gv.addColorStop(.45,'rgba(90,170,255,.45)');gv.addColorStop(1,'rgba(40,70,200,.12)');
      ctx.fillStyle=gv;ctx.beginPath();ctx.moveTo(cx-R*.42,cy);ctx.quadraticCurveTo(cx-R*.5,(cy+tY)/2,tX-R*1.05,tY);ctx.ellipse(tX,tY,R*1.05,R*1.05*K,0,Math.PI,0);ctx.quadraticCurveTo(cx+R*.5,(cy+tY)/2,cx+R*.42,cy);ctx.ellipse(cx,cy,R*.42,R*.42*K,0,0,Math.PI);ctx.closePath();ctx.fill();}
    /* ribbons: solid, no outline; wide soft halo first (additive), then body + white edge */
    for(const g of (this.front?this.rg.slice().reverse():this.rg)){const z=8+H*g.u,r=R*(.5+.5*g.u*g.u+.05*Math.sin(t*3+g.ph)),th=R*g.th*1.5,[rx,ry]=P(X,Y,z);
      ctx.save();ctx.beginPath();if(this.front)ctx.rect(rx-4000,ry,8000,4000);else ctx.rect(rx-4000,ry-4000,8000,4000);ctx.clip();
      for(let k=0;k<g.arcs;k++){const a0=-(t*g.sp)+g.ph+k*6.283/g.arcs,N=22,p2=(s2,rr)=>{const an=a0+g.span*s2;return pt(an,rr,z+6*Math.sin(s2*3.14));};
        const band=(w,off)=>{ctx.beginPath();for(let i=0;i<=N;i++){const q=p2(i/N,r-off);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=N;i>=0;i--){const s2=i/N,q=p2(s2,r-off-w*Math.pow(Math.sin(3.1416*Math.pow(s2,.7)),.8));ctx.lineTo(q[0],q[1]);}ctx.closePath();};
        const al=a*(this.front?1:.75)*(1-.3*g.u);
        ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al*.35;band(th*1.9,-th*.45);ctx.fillStyle='#3f8cff';ctx.fill();ctx.globalCompositeOperation='source-over';
        ctx.globalAlpha=al;band(th,0);ctx.fillStyle=g.u<.35?'#9fe2ff':'#5fb4ff';ctx.fill();band(th*.5,0);ctx.fillStyle='#d8f6ff';ctx.fill();band(th*.2,0);ctx.fillStyle='#ffffff';ctx.fill();}
      ctx.restore();}
    if(this.front){ctx.globalAlpha=a;
      /* painted ice crystals burst from the centre (rise + overshoot), 3 of them */
      if(!this.cr)this.cr=[[0,.85,0,0],[-.5,.6,1,1],[.52,.62,2,0],[-.25,.42,3,0],[.28,.45,1,1]];
      for(const [dx,sc,v,f] of this.cr){const tt=t-.1-Math.abs(dx)*.15;if(tt<=0)continue;const im=tx('crystal',null,v),w=R*sc,h=w*im.height/im.width,up=eOut(cl(tt/.16,0,1))*(1+.18*Math.max(0,1-(tt-.16)/.15)),bx=cx+dx*R,by=cy+R*.1*Math.abs(dx)*K*3;
        ctx.save();ctx.translate(bx,by);if(f)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h*up,w,h*up);if(tt<.12){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-tt/.12);ctx.drawImage(im,-w/2,-h*up,w,h*up);}ctx.restore();}
      ctx.globalCompositeOperation='lighter';const gc=ctx.createRadialGradient(cx,cy-R*.15,2,cx,cy-R*.15,R*.75);gc.addColorStop(0,'rgba(255,255,255,.5)');gc.addColorStop(.4,'rgba(140,210,255,.25)');gc.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=gc;ctx.beginPath();ctx.arc(cx,cy-R*.15,R*.75,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';
      for(const f of this.fl){const an=f.a-t*f.sp;if(Math.sin(an)<-.2)continue;const p=pt(an,R*f.r,10+H*f.z),s2=f.s*(1+.3*Math.sin(t*6+f.a));if(f.s>4){ctx.globalCompositeOperation='lighter';ctx.drawImage(tx('star','#bff0ff'),p[0]-s2*3,p[1]-s2*3,s2*6,s2*6);ctx.globalCompositeOperation='source-over';continue;}
        ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.beginPath();for(let k=0;k<3;k++){const b=k*1.047+t*2;ctx.moveTo(p[0]-Math.cos(b)*s2,p[1]-Math.sin(b)*s2);ctx.lineTo(p[0]+Math.cos(b)*s2,p[1]+Math.sin(b)*s2);}ctx.stroke();}}
    ctx.restore();}}
const SL={silver:['#6f84ad','#dfe9ff','#ffffff'],frost:['#2f7fb5','#7fd6ff','#eaffff'],axe:['#8e1220','#e8303c','#ffc9c2'],dance:['#a8361a','#ff5a2a','#ffe3b0'],vamp:['#3a0f2a','#9a1c50','#ff9fbe'],thunder:['#2a3f9a','#6fc3ff','#ffffff']};
let dn=0;
let side=1,rip=0;

/* ---------- vector painters: every picture name wolf_fx.js still asks for is drawn by code (no image files) ----------
   wolf_fx.js keeps its own motion (pop, wipe, fade, funnel stacking, falling, orbiting) and calls wV3.draw(name, …) instead of drawImage. */
const PAL={red:['#8e1220','#e8303c','#ffc9c2'],gold:['#a8501a','#ffb62e','#fff3c4'],ice:['#2f7fb5','#7fd6ff','#eaffff'],thun:['#2a3f9a','#6fc3ff','#ffffff'],sil:['#6f84ad','#dfe9ff','#ffffff'],dark:['#3a0f2a','#9a1c50','#ff9fbe'],ind:['#2a2466','#6a5fd8','#d9d4ff'],stone:['#5a3122','#a8704e','#d6a079'],steel:['#56637a','#aab8cc','#f4f8ff']};
const ol=(f,lw=3)=>{ctx.strokeStyle=OUT;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.stroke();ctx.fillStyle=f;ctx.fill();};
const T=()=>(typeof gameTime==='number'?gameTime:0);
const V={
 /* crescent pointing right, fills the box */
 slash(w,h,c){const R=w*.5,cy=0;const cres=(r,k)=>{ctx.beginPath();ctx.arc(-R*.55,cy,r,-1.15,1.15);ctx.arc(-R*.55-r*k,cy,r*(1+k*.55),.78,-.78,true);ctx.closePath();};
   cres(R*1.5,.34);ol(c[0],3.2);cres(R*1.5,.22);ctx.fillStyle=c[1];ctx.fill();cres(R*1.47,.08);ctx.fillStyle=c[2];ctx.fill();},
 burst(w,h,c,n=9){const R=w*.5,star=(a,b)=>{ctx.beginPath();for(let i=0;i<n*2;i++){const an=i/(n*2)*Math.PI*2+.2,q=(i%2?b:a)*(1+.12*Math.sin(i*2.3));ctx.lineTo(Math.cos(an)*q,Math.sin(an)*q*(h/w));}ctx.closePath();};
   star(R,R*.48);ol(c[0]);star(R*.62,R*.3);ctx.fillStyle=c[2];ctx.fill();},
 /* swirl of ribbons; turns with time (and wolf_fx.js stacks it into a funnel) */
 swirl(w,h,c,n=5){const R=w*.5,t=T()*5;for(let i=0;i<n;i++){const a0=t*(i%2?1:.8)+i/n*Math.PI*2,r=R*(.45+.5*((i*37)%10)/10),ry=r*(h/w),sp=1.5+.5*(i%3),th=R*.11*(1+(i%2)*.5);
     ctx.beginPath();ctx.ellipse(0,0,r,ry,0,a0,a0+sp);ctx.ellipse(0,0,Math.max(1,r-th),Math.max(1,ry-th*(h/w)),0,a0+sp*.92,a0+sp*.15,true);ctx.closePath();ol(i%3?c[1]:c[0],2.6);
     ctx.beginPath();ctx.ellipse(0,0,r-th*.25,ry-th*.25*(h/w),0,a0+sp*.3,a0+sp*.8);ctx.strokeStyle=c[2];ctx.lineWidth=Math.max(1,th*.25);ctx.stroke();}},
 ring(w,h,c){ctx.beginPath();ctx.ellipse(0,0,w*.5,h*.5,0,0,7);ctx.ellipse(0,0,w*.42,h*.42,0,0,7);ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.stroke();ctx.fillStyle=c[2];ctx.fill('evenodd');},
 crack(w,h,c){const R=w*.5;ctx.lineCap='round';for(const [lw,col] of [[5.5,OUT],[2.4,c]]){ctx.strokeStyle=col;for(let i=0;i<7;i++){let an=i/7*Math.PI*2+.3,x=0,y=0;ctx.beginPath();ctx.moveTo(0,0);for(let k=1;k<=4;k++){const a2=an+((k+i)%2?.45:-.45);x+=Math.cos(a2)*R/4;y+=Math.sin(a2)*R/4*(h/w);ctx.lineTo(x,y);}ctx.lineWidth=lw;ctx.stroke();}}},
 pool(w,h,c){ctx.beginPath();for(let i=0;i<12;i++){const an=i/12*Math.PI*2,r=.5*(i%2?.82:1);ctx.lineTo(Math.cos(an)*w*r,Math.sin(an)*h*r);}ctx.closePath();ol(c[0],2.5);ctx.beginPath();ctx.ellipse(-w*.08,-h*.08,w*.22,h*.18,0,0,7);ctx.fillStyle=c[1];ctx.fill();},
 drop(w,h,c){ctx.beginPath();ctx.moveTo(0,-h*.5);ctx.quadraticCurveTo(w*.5,h*.2,0,h*.5);ctx.quadraticCurveTo(-w*.5,h*.2,0,-h*.5);ctx.closePath();ol(c[1],2.2);},
 shard(w,h,c){ctx.beginPath();ctx.moveTo(-w*.4,-h*.15);ctx.lineTo(w*.1,-h*.45);ctx.lineTo(w*.45,h*.1);ctx.lineTo(-w*.15,h*.4);ctx.closePath();ol(c[1],2.2);},
 streak(w,h,c){const sh=(hh,x0)=>{ctx.beginPath();ctx.moveTo(x0,0);ctx.quadraticCurveTo(w*.25,-hh,w*.5,0);ctx.quadraticCurveTo(w*.25,hh,x0,0);ctx.closePath();};sh(h*.5,-w*.5);ol(c[0]);sh(h*.32,-w*.3);ctx.fillStyle=c[1];ctx.fill();sh(h*.13,-w*.05);ctx.fillStyle=c[2];ctx.fill();},
 bolt(w,h,c){const z=()=>{ctx.beginPath();ctx.moveTo(w*.2,-h*.5);ctx.lineTo(-w*.15,-h*.12);ctx.lineTo(w*.12,-h*.02);ctx.lineTo(-w*.1,h*.5);};ctx.lineJoin='miter';z();ctx.strokeStyle='#1c2f6b';ctx.lineWidth=w*.3+4;ctx.stroke();z();ctx.strokeStyle=c[1];ctx.lineWidth=w*.3;ctx.stroke();z();ctx.strokeStyle='#fff';ctx.lineWidth=w*.12;ctx.stroke();},
 rock(w,h,c){ctx.beginPath();ctx.moveTo(-w*.45,h*.1);ctx.lineTo(-w*.2,-h*.42);ctx.lineTo(w*.25,-h*.38);ctx.lineTo(w*.48,h*.05);ctx.lineTo(w*.15,h*.45);ctx.lineTo(-w*.3,h*.4);ctx.closePath();ol(c[1],2.5);ctx.beginPath();ctx.moveTo(-w*.2,-h*.42);ctx.lineTo(w*.25,-h*.38);ctx.lineTo(w*.05,-h*.02);ctx.lineTo(-w*.3,0);ctx.closePath();ctx.fillStyle=c[2];ctx.fill();},
 /* double-bladed war axe, head at the bottom (it hangs / falls blade-first) */
 axe(w,h,c){ctx.beginPath();ctx.rect(-w*.035,-h*.5,w*.07,h*.78);ol('#7a4a2a',2.5);
   for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*w*.03,h*.12);ctx.quadraticCurveTo(s*w*.3,h*.02,s*w*.46,h*.16);ctx.quadraticCurveTo(s*w*.52,h*.34,s*w*.42,h*.5);ctx.quadraticCurveTo(s*w*.28,h*.4,s*w*.03,h*.42);ctx.closePath();ol(c[1]);
     ctx.beginPath();ctx.moveTo(s*w*.34,h*.14);ctx.quadraticCurveTo(s*w*.46,h*.3,s*w*.4,h*.45);ctx.quadraticCurveTo(s*w*.4,h*.3,s*w*.3,h*.18);ctx.closePath();ctx.fillStyle=c[2];ctx.fill();}
   ctx.beginPath();ctx.arc(0,h*.27,w*.06,0,7);ol(c[0],2.2);},
 hammer(w,h,c){ctx.beginPath();ctx.rect(-w*.05,-h*.5,w*.1,h*.6);ol('#7a4a2a',2.5);ctx.beginPath();ctx.rect(-w*.42,h*.05,w*.84,h*.42);ol('#8794ad',3.2);ctx.beginPath();ctx.rect(-w*.42,h*.05,w*.84,h*.12);ctx.fillStyle='#c9d4e8';ctx.fill();
   for(const s of [-1,1]){ctx.beginPath();ctx.rect(s*w*.42-w*.05,h*.02,w*.1,h*.48);ol('#ffb62e',2.5);}
   ctx.beginPath();ctx.moveTo(w*.05,h*.14);ctx.lineTo(-w*.06,h*.27);ctx.lineTo(w*.03,h*.27);ctx.lineTo(-w*.05,h*.4);ctx.strokeStyle='#6fc3ff';ctx.lineWidth=3;ctx.lineJoin='miter';ctx.stroke();},
 banner(w,h,c){ctx.beginPath();ctx.rect(-w*.04,-h*.5,w*.08,h);ol('#7a4a2a',2.5);const sw=Math.sin(T()*4)*w*.04;ctx.beginPath();ctx.moveTo(w*.04,-h*.45);ctx.lineTo(w*.5,-h*.4+sw);ctx.lineTo(w*.42,-h*.05+sw);ctx.lineTo(w*.5,h*.12+sw);ctx.lineTo(w*.04,h*.05);ctx.closePath();ol('#2e9a5a');
   ctx.beginPath();ctx.arc(w*.24,-h*.18+sw*.6,w*.09,0,7);ctx.fillStyle='#ffe9a0';ctx.fill();ctx.beginPath();ctx.arc(0,-h*.5,w*.07,0,7);ol('#ffb62e',2.2);},
 shield(w,h,c){ctx.beginPath();ctx.moveTo(-w*.42,-h*.4);ctx.lineTo(w*.42,-h*.4);ctx.lineTo(w*.42,h*.05);ctx.quadraticCurveTo(w*.3,h*.4,0,h*.5);ctx.quadraticCurveTo(-w*.3,h*.4,-w*.42,h*.05);ctx.closePath();ol(c[1],2.6);
   ctx.beginPath();ctx.moveTo(0,-h*.25);ctx.lineTo(0,h*.28);ctx.moveTo(0,-h*.05);ctx.lineTo(w*.18,-h*.2);ctx.moveTo(0,h*.08);ctx.lineTo(w*.18,-h*.05);ctx.strokeStyle=c[2];ctx.lineWidth=Math.max(1.5,w*.07);ctx.stroke();},
 brokenShield(w,h,c){V.shield(w,h,c);ctx.beginPath();ctx.moveTo(-w*.1,-h*.4);ctx.lineTo(w*.08,-h*.1);ctx.lineTo(-w*.08,h*.08);ctx.lineTo(w*.06,h*.45);ctx.strokeStyle=OUT;ctx.lineWidth=Math.max(2,w*.09);ctx.lineJoin='miter';ctx.stroke();},
 skull(w,h,c){ctx.beginPath();ctx.arc(0,-h*.08,w*.38,Math.PI,0);ctx.lineTo(w*.3,h*.2);ctx.lineTo(w*.14,h*.42);ctx.lineTo(-w*.14,h*.42);ctx.lineTo(-w*.3,h*.2);ctx.closePath();ol('#fff3ee');
   for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*w*.16,-h*.02,w*.09,h*.1,s*.3,0,7);ctx.fillStyle=OUT;ctx.fill();ctx.beginPath();ctx.moveTo(s*w*.22,-h*.4);ctx.lineTo(s*w*.42,-h*.52);ctx.lineTo(s*w*.36,-h*.28);ctx.closePath();ol('#fff3ee',2.2);}},
 spear(w,h,c){ctx.beginPath();ctx.moveTo(-w*.5,-h*.08);ctx.lineTo(w*.2,-h*.08);ctx.lineTo(w*.2,-h*.3);ctx.lineTo(w*.5,0);ctx.lineTo(w*.2,h*.3);ctx.lineTo(w*.2,h*.08);ctx.lineTo(-w*.5,h*.08);ctx.closePath();ol(c[1]);},
 heart(w,h,c){ctx.beginPath();ctx.moveTo(0,h*.4);ctx.bezierCurveTo(-w*.7,-h*.1,-w*.3,-h*.6,0,-h*.2);ctx.bezierCurveTo(w*.3,-h*.6,w*.7,-h*.1,0,h*.4);ctx.closePath();ol(c[1],2.6);},
 /* upright aura: a few soft flame tongues rising from the base, flickering */
 aura(w,h,c){const t=T()*6;for(let i=0;i<5;i++){const x=(i-2)*w*.18,hh=h*(.55+.3*Math.sin(t+i*1.9)),bw=w*.12;ctx.beginPath();ctx.moveTo(x-bw,h*.5);ctx.quadraticCurveTo(x-bw*1.2,h*.5-hh*.5,x+Math.sin(t*.7+i)*bw,h*.5-hh);ctx.quadraticCurveTo(x+bw*1.2,h*.5-hh*.5,x+bw,h*.5);ctx.closePath();ol(i%2?c[1]:c[2],2.4);}},
 /* howl: three sound arcs opening upward */
 howl(w,h,c){for(let i=0;i<3;i++){const r=w*(.18+.14*i);ctx.beginPath();ctx.arc(0,h*.3,r,-2.3,-.84);ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle=c[1];ctx.lineWidth=3.6;ctx.stroke();}},
 gate(w,h,c){ctx.beginPath();ctx.moveTo(-w*.4,h*.5);ctx.lineTo(-w*.4,-h*.1);ctx.arc(0,-h*.1,w*.4,Math.PI,0);ctx.lineTo(w*.4,h*.5);ctx.lineTo(w*.28,h*.5);ctx.lineTo(w*.28,-h*.1);ctx.arc(0,-h*.1,w*.28,0,Math.PI,true);ctx.lineTo(-w*.28,h*.5);ctx.closePath();ol(c[1]);
   ctx.globalAlpha*=.45;ctx.beginPath();ctx.moveTo(-w*.28,h*.5);ctx.lineTo(-w*.28,-h*.1);ctx.arc(0,-h*.1,w*.28,Math.PI,0);ctx.lineTo(w*.28,h*.5);ctx.closePath();ctx.fillStyle=c[2];ctx.fill();},
 arc(w,h,c){ctx.beginPath();ctx.moveTo(-w*.5,h*.4);ctx.quadraticCurveTo(0,-h*1.1,w*.5,h*.4);ctx.quadraticCurveTo(0,-h*.6,-w*.5,h*.4);ctx.closePath();ol(c[1],2.6);},
 none(){}};
const A=(f,pal,asp=1,x)=>({f,pal,asp,x});
const PIC=[ [/^wr\d/,A('rock','stone',.9)],[/^w(46|08)/,A('axe','red',1.5)],[/^w55/,A('axe','gold',1.5)],[/^w23/,A('hammer','steel',1.35)],[/^w20/,A('banner','gold',1.6)],[/^w24/,A('shield','ice',1.15)],[/^w10/,A('shield','steel',1.15)],[/^w09/,A('shield','sil',1.15)],[/^w50/,A('brokenShield','steel',1.15)],[/^w48/,A('skull','red',1)],
 [/^w16/,A('spear','thun',.3)],[/^w06/,A('heart','dark',.9)],[/^w41/,A('aura','dark',1.1)],[/^w07/,A('aura','red',1.1)],[/^w05/,A('howl','gold',.8)],[/^w53/,A('gate','gold',1.25)],[/^w51/,A('arc','red',.45)],[/^w40/,A('streak','dark',.22)],
 [/^w(04|44)/,A('swirl','red',.5)],[/^w45/,A('swirl','red',1.2)],[/^w17/,A('swirl','ice',.5)],[/^w22/,A('swirl','ind',.5,7)],[/^w67/,A('streak','thun',.28)],[/^w(42)/,A('streak','red',.25)],[/^w66/,A('streak','thun',.25)],[/^w68/,A('streak','thun',.6)],
 [/^w(56|57|58|59)/,A('slash','gold',.8)],[/^w63/,A('slash','thun',.8)],[/^w39/,A('slash','dark',.8)],[/^w(11|21)/,A('slash','ice',.8)],[/^x01/,A('slash','sil',.8)],[/^w(01|26|27|28|32|33|34|35|36|43|47)/,A('slash','red',.8)],
 [/^w(54)/,A('burst','gold',.8,11)],[/^w(25|64)/,A('burst','thun',.9)],[/^w(62|18)|^x04/,A('burst','ice',.9)],[/^w49/,A('burst','steel',.9)],[/^w(31|03|38)/,A('burst','red',.8)],[/^w15/,A('bolt','thun',2.6)],[/^w65/,A('ring','ice',.5)],
 [/^w(37|52)|^y0[57]|^x05/,A('crack','#4a2416',.5)],[/^w29/,A('pool','red',.45)],[/^w30/,A('drop','red',1.4)],[/^w02/,A('drop','red',1.2)],[/^w12/,A('shard','ice',1)] ];
const picOf=n=>{for(const [re,a] of PIC)if(re.test(n))return a;return null;};
/* owner 2026-11-20: buffs, the A ultimate (Valhalla's Wrath), the spin (Axe Cyclone / Cyclone Leap) and the shield skill keep their painted pictures */
const KEEP=/^w(04|05|07|08|09|10|14|20|24|33|35|37|44|45|46|47|48|53|54|55|56|57|58|59)_|^wr\d/;
/* owner 2026-11-20 after the review clips: 'many skills are not pretty — use the generated pictures'. The plain vector fallbacks are OFF:
   every picture wolf_fx.js asks for is the painted one again. Only skills with their own hand-made VFX above (hooks in wV3) stay code-drawn. */
const VFALLBACK=false;
function vdraw(n,sx,sy,w,o){if(!VFALLBACK||KEEP.test(n))return undefined;const a=picOf(n);if(!a)return true;let h=w*a.asp*(o.sq||1);ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,o.a==null?1:o.a));if(o.add)ctx.globalAlpha*=.35;ctx.translate(sx,sy);
  if(o.gspin!=null){/* wolf_fx.js spins flat pictures; our swirl already turns by itself */}
  if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);if(o.fx)ctx.scale(-1,1);const ax=o.ax==null?.5:o.ax,ay=o.ay==null?.5:o.ay;ctx.translate(w*(.5-ax),h*(.5-ay));
  if(o.clip!=null&&o.clip<1){ctx.beginPath();ctx.rect(-w*.5-6,-h*.5-6,(w+12)*Math.max(0,o.clip),h+12);ctx.clip();}
  const c=PAL[a.pal]||a.pal;try{V[a.f](w,h,c,a.x);}catch(e){}ctx.restore();return true;}
window.wV3={
 prison(pr){addFx(new CClip({x:pr.x,y:pr.y,z:0,w:pr.r*2.35,life:pr.dur+1,loop:'prison_loop',fps:12,cx:.497,cy:.77,one:1,shadow:1,sortOff:pr.r*.6,fin:.25,until:()=>pr.alive}));return true;},
 ragnarok(x,y,R,life){addFx(new CClip({x,y,z:0,w:R*2*1.05/.953,life,loop:'ragna_loop',fps:12,ground:1,sky:.46,cx:.497,cy:.79,fin:.35,fout:.4}));return true;},
 mjolnir(x,y,R){addFx(new CClip({x,y,z:0,w:R*1.4,cy:.77,loop:'mjolnir_hit',groundAt:24,seq:Array(46).fill(1/14)}));return true;},
 tempest(x,y,r,dur){addFx(new CClip({x,y,z:0,w:r*2*1.04/.962,life:dur+.3,loop:'tempest_loop',fps:12,ground:1,sky:.44,cx:.498,cy:.738,fin:.3,fout:.45}));return true;},
 cyclone(a){addFx(new CClip({x:player.x,y:player.y,follow:1,w:215,life:Math.max(.6,(a.dur||1)*.95),loop:'cyc_loop',io:'cyc_io'}));return true;},

 /* Storm Step trail (code): electric ribbon laid on the floor from the dash start to the wolf, white core, cyan glow, crawling zigzag arcs */
 stormTrail(ax,ay,bx,by,a,t){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),an=Math.atan2(dy,dx);ctx.save();ctx.translate(ax,ay);ctx.rotate(an);ctx.globalAlpha=a;
  ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(0,0,L,0);g.addColorStop(0,'rgba(60,140,255,0)');g.addColorStop(.6,'rgba(80,170,255,.55)');g.addColorStop(1,'rgba(150,220,255,.8)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*.6,-14,L,0);ctx.quadraticCurveTo(L*.6,14,0,0);ctx.fill();
  ctx.lineCap='round';ctx.lineJoin='round';for(let j=0;j<3;j++){ctx.strokeStyle=j?'rgba(150,225,255,.85)':'#ffffff';ctx.lineWidth=j?1.6:2.4;ctx.beginPath();ctx.moveTo(0,0);const n=Math.max(4,(L/18)|0);
    for(let i=1;i<=n;i++){const q=i/n;ctx.lineTo(L*q,(Math.random()-.5)*14*Math.sin(Math.PI*q)*(j?1.4:.7));}ctx.stroke();}
  ctx.restore();return true;},
 /* Storm Step afterimage (code): the wolf's own frame tinted electric blue + a few arcs on it */
 ghost(o,k){if(typeof playerFrame!=='function')return false;const fr=playerFrame();if(!fr)return false;const [px,py]=P(o.x,o.y,0),a=k<.4?.85:(1-k)*1.4;
  ctx.save();if(typeof CHAR_SCALE!=='undefined'&&CHAR_SCALE!==1){ctx.translate(px,py);ctx.scale(CHAR_SCALE,CHAR_SCALE);ctx.translate(-px,-py);}if(o.fl){ctx.translate(px,0);ctx.scale(-1,1);ctx.translate(-px,0);}
  ctx.globalCompositeOperation='lighter';drawFrame(fr,px,py,a*.8,null,tinted(fr,'#3f9de6'));ctx.restore();
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.strokeStyle='#dff6ff';ctx.lineWidth=1.6;for(let j=0;j<2;j++){let x=px+(Math.random()-.5)*30,y=py-10-Math.random()*60;ctx.beginPath();ctx.moveTo(x,y);for(let i=0;i<4;i++){x+=(Math.random()-.5)*16;y+=8;ctx.lineTo(x,y);}ctx.stroke();}ctx.restore();return true;},
 /* Predator's Leap arc (code): a glowing red-orange arc from take-off to landing, drawn in as the wolf flies, with a white core */
 leapArc(ax,ay,bx,by,a,k){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),H=Math.min(90,L*.45),N=24,pt=q=>[ax+dx*q,ay+dy*q-H*4*q*(1-q)];ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';
  const upto=Math.max(.05,Math.min(1,k*1.05));for(const [w,col,add] of [[16,'rgba(255,80,40,.35)',1],[7,'#ff5a2a',0],[2.6,'#fff0c4',0]]){ctx.globalCompositeOperation=add?'lighter':'source-over';ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();
    for(let i=0;i<=N;i++){const q=upto*i/N,p=pt(q);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();}
  ctx.restore();return true;},
 blizzard(x,y,r,dur){const q=location.search;/* owner 2026-11-20: back to the gx_ice version (CStorm: ribbon funnel + frost floor + crystals + GX particles); others kept for comparison */
  if(/[?&]bz=pic/.test(q))addFx(new CStorm({x,y,R:r,life:dur,H:130,pic:1}));else if(/[?&]bz=blade/.test(q))addFx(new CBlz({x,y,R:r,life:dur,H:150}));else if(/[?&]bz=torn/.test(q))addFx(new CTorn({x,y,R:r,life:dur,H:150}));else if(/[?&]bz=spin/.test(q))addFx(new CTSpin({x,y,R:r,life:dur}));else addFx(new CStorm({x,y,R:r,life:dur,H:130}));addFx(new CRing({x,y,r0:r*.3,r1:r*1.15,life:.45,col:'#dff6ff'}));return true;},
 draw:vdraw,
 streak(a,b,kind){return new CStreak(a,b,kind?SL[kind]:null);},
 frostFang(ph){const S=sys('top'),Gs=sys('ground'),c=Math.cos(ph),sn=Math.sin(ph);for(let i=0;i<6;i++){const q=(i+.7)/6,d=215*q,sd=(i%2?1:-1)*R_(4,12),x=player.x+c*(16+d)-sn*sd,y=player.y+sn*(16+d)+c*sd,dl=q*.16;
   crys({x,y,w:40+46*Math.sin(Math.PI*q)+R_(-4,6),v:i%4,delay:dl,life:.85,fx:i%2});Gs.add({im:tx('floor',null,i%3),x,y,z:0,s0:20,s1:70+30*Math.sin(Math.PI*q),life:1,fo:.45,flat:1,rot:Math.random()*6,delay:dl});
   G.smoke(S,x,y,0,2,'#ffffff|#8cc0e8',50,40,.7,15);S.add({im:tx('star','#bff0ff'),x,y,z:30,s0:10,s1:60,life:.25,fo:.6,add:1,delay:dl});for(let k=0;k<3;k++){const a=Math.random()*6.283,v=R_(60,150);S.add({im:tx('shard','#5fb6ec',k),x,y,z:10,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R_(160,280),g:820,s0:R_(8,13),s1:7,life:R_(.5,.8),fo:.3,rot:Math.random()*6,vr:R_(-12,12),delay:dl});}}
   G.glints(S,player.x+c*120,player.y+sn*120,10,10,90);return true;},
 iceBurst(t){const S=sys('top'),Gs=sys('ground'),b=t.boss?1.3:1;crys({x:t.x,y:t.y+2,w:95*b,v:(Math.random()*4)|0,life:.75,fx:Math.random()<.5});crys({x:t.x-24*b,y:t.y+4,w:52*b,v:1,life:.65,delay:.04,fx:1});crys({x:t.x+26*b,y:t.y+5,w:58*b,v:3,life:.65,delay:.06});
   G.flare(S,t.x,t.y,30,130*b,'#8fdcff',.3);G.sparks(S,t.x,t.y,26,16,'#bfefff',260,200,.45);G.shards(S,t.x,t.y,24,14,220,300,b);G.smoke(S,t.x,t.y,4,6,'#ffffff|#8cc0e8',70*b,70,.8,20);G.glints(S,t.x,t.y,10,8,50);G.ring(Gs,t.x,t.y,20,110*b,'#bfeeff',.4);return true;},
 iceCrack(x,y,w,big){const sc=w/170,S=sys('top'),Gs=sys('ground');Gs.add({im:tx('floor',null,(Math.random()*3)|0),x,y,z:0,s0:(big?120:80)*sc,s1:(big?250:175)*sc,life:1.4,fo:.4,flat:1,rot:Math.random()*6});G.ring(Gs,x,y,20*sc,(big?150:110)*sc,'#bfeeff',.4);
   G.flare(S,x,y,8,(big?150:100)*sc,'#9fe2ff',.28);G.shards(S,x,y,6,big?16:9,200*sc,280);G.smoke(S,x,y,0,big?8:5,'#ffffff|#8cc0e8',70*sc,90*sc,.9,12);G.glints(S,x,y,6,big?12:7,80*sc);
   if(big)for(let i=0;i<4;i++){const an=i/4*6.283+Math.random(),d=R_(50,80)*sc;crys({x:x+Math.cos(an)*d,y:y+Math.sin(an)*d*.7,w:R_(40,60)*sc,v:i,delay:.05+i*.03,life:.9,fx:i%2});}return true;},
 bolt(x,y,h){addFx(new CStrike({x,y,h:Math.max(140,h*1.15)}));return true;},
 shatterWave(x,y,r){addFx(new CClip({x,y,z:0,w:r*2.3,cy:.64,loop:'shatter_hit',groundAt:16,seq:[...Array(8).fill(.035),...Array(42).fill(1/14)]}));shake&&shake(2.5);return true;},
 /* hit sparks: one small burst in the branch colour, nothing else */
 hit(e,k,o,isB){const big=o&&o.big,b=(e.boss?1.3:1)*(big?1.3:1),S=sys('top'),col=k==='basic'?'#dfe9ff':isB?'#8fdcff':'#ff5a3a',sc=k==='basic'?'#ffffff':isB?'#cff4ff':'#ffb08a';
  G.flare(S,e.x,e.y,26,(k==='basic'?60:78)*b,col,.18);G.sparks(S,e.x,e.y,26,k==='basic'?6:9,sc,220*b,150,.3);if(isB)G.shards(S,e.x,e.y,22,3,140,200,.8);return true;},
 rushCut(e){const ph=player.phi;addFx(new CCut({e,len:62,ang:Math.atan2(Math.sin(ph)*K,Math.cos(ph))+.25}));drops(e,3);return true;},
 execCut(e,big){return false;},   /* owner 2026-11-20: Executioner back to the painted axe + cut */
 armor(e){addFx(new CBurst({e,R:e.boss?40:32,n:8,life:.26,cols:['#8fa0b8','#f4f8ff']}));shards(e,6);return true;},     /* Armor Break: steel burst + plates flying off */
 slam(x,y,sc){return false;},                                                                     /* Cyclone Leap landing: cold crater, no lava */
 clawGround(x,y,ph){const an=Math.atan2(Math.sin(ph)*K,Math.cos(ph));addFx(new CRip({layer:'ground',x,y,z:0,ang:an,L:64,grow:.06,hold:1,fade:.3,cols:['#3a1f16','#140806']}));addFx(new CRing({x,y,r0:20,r1:95}));
  for(let i=0;i<4;i++){const a=ph+Math.PI/2*(i<2?1:-1)+(i%2?.5:-.5);addFx(new CPuff({x:x+Math.cos(a)*40,y:y+Math.sin(a)*40,vx:Math.cos(a)*50,vy:Math.sin(a)*50,r:9}));}return true;},
 /* every generic painted slash (basic attack silver, frost, red axe) → one smear crescent */
 slash(phi,w,kind,flip){const d=(Math.cos(phi)<0?-1:1)*(flip?-1:1),R=cl(w*.55,58,92);addFx(new CSlash({x:player.x,y:player.y,follow:1,a0:phi-1.1*d,a1:phi+1.1*d,R,W:R*.3,cols:SL[kind]||SL.axe}));return true;},
 /* Axe Dance: up-cut → down-chop → full spin → backhand → …, finisher = thrust */
 dance(e,fin){const phi=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,L=Math.cos(phi)<0,d=L?-1:1,c=SL.dance,x=player.x+Math.cos(phi)*58,y=player.y+Math.sin(phi)*58;
  if(fin){addFx(new CThrust({x:player.x,y:player.y,phi,cols:['#ff5a2a','#fff0c4']}));return true;}
  const m=dn++%4;
  if(m===0)addFx(new CChop({x,y,d,up:1,cols:c}));else if(m===1)addFx(new CChop({x,y,d,cols:c}));
  else if(m===2)addFx(new CSlash({x:player.x,y:player.y,follow:1,a0:phi-Math.PI*d,a1:phi+Math.PI*d,R:84,W:24,z:24,grow:.14,cols:c}));
  else addFx(new CSlash({x:player.x,y:player.y,follow:1,a0:phi+1.2*d,a1:phi-1.2*d,R:86,W:26,cols:c}));return true;},
 vampHit(e,n){for(let i=0;i<2;i++)addFx(new COrb({e,delay:i*.07,side:(n+i)%2?1:-1,r:4.5+i,on:i?null:()=>{addFx(new CPlus({ox:(n%2?-1:1)*(6+4*n)}));if(n===1)addFx(new CRing({x:player.x,y:player.y,r0:14,r1:52,life:.35,col:'#ffb3cc'}));}}));
  addFx(new CCut({e,len:40,ang:(n%2?.5:-.5)}));return true;},
 vamp(){const phi=player.phi,d=Math.cos(phi)<0?-1:1;addFx(new CSlash({x:player.x,y:player.y,follow:1,a0:phi-1.2*d,a1:phi+1.2*d,R:86,W:28,cols:SL.vamp}));return true;},
 blood(k,o){if(k==='savageRend'){const phi=player.phi,t=nearestEnemy(player.x,player.y,140,phi),x=t?t.x:player.x+Math.cos(phi)*70,y=t?t.y:player.y+Math.sin(phi)*70;rip++;
   if(gameTime-(this._rt||0)>.6){rip=1;}this._rt=gameTime;const sec=rip%2===0;
   addFx(new CRip({x,y,hold:sec?.09:.3,ang:sec?-.62:.62,cols:sec?['#ff7a2e','#fff0c4']:['#e8303c','#fff3ee']}));return true;}
  if(k!=='bloodCleave')return false;
  const phi=player.phi,echo=o&&o.echo===false,d=(Math.cos(phi)<0?-1:1)*(echo?-1:1),h=1.3;
  addFx(new CSlash({x:player.x,y:player.y,follow:1,a0:phi-h*d,a1:phi+h*d,R:echo?76:90,W:echo?22:30,z:echo?38:30,cols:echo?['#a5303a','#f06a6a','#ffe1dc']:['#8e1220','#e8303c','#ffc9c2']}));return true;},
 finale(x,y,L){addFx(new CChop({x,y,d:L?-1:1}));const S=sys('top');G.flare(S,x,y,30,260,'#ffb347',.22);addFx(new CClip({x,y,z:0,w:230,cy:.73,loop:'finale2',v:2,groundAt:6,seq:Array(44).fill(1/16)}));shake&&shake(1.5);return 'clip';},
 rupture(e){addFx(new CBurst({e,R:e.boss?44:34}));const an=Math.atan2(e.y-player.y,e.x-player.x);
  for(let i=0;i<4;i++){const sp=an+(i-1.5)*.5,v=90+25*i;addFx(new CDrop({x:e.x,y:e.y,vx:Math.cos(sp)*v,vy:Math.sin(sp)*v,vz:130+20*i,r:3+(i%2)}));}return true;},
 bleed(e,big){const a=player.action;if(!a||a.key!=='bloodCleave')return false;
  const an=Math.atan2(e.y-player.y,e.x-player.x);side=-side;addFx(new CCut({e,ang:side*.6}));
  for(let i=0;i<3;i++){const v=70+40*i,sp=an+(i-1)*.45;addFx(new CDrop({x:e.x,y:e.y,vx:Math.cos(sp)*v,vy:Math.sin(sp)*v,vz:110+30*i,r:3+((i+1)%2)}));}return true;}};
window.VK={CSlash,CCut,CDrop,CRip,CBurst,CChop,CCrack,CRing,CPuff,CThrust,CStreak,CShard,GSys,G,sys,tx,crys,groundBreak,shards,CClip,eOut,cl,R_};
if(CHAR!=='wolf')delete window.wV3;
})();
