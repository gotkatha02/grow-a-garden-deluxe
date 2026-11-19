/* =====================================================================
   TOTEM LEGEND — shared 2.5D effect kit (owner 2026-11-19, built for the dragon v2 rework)
   Picture pieces take n:'<hero>/<file>' from assets/fx. No round dot particles, pictures are never spun.
   GPic ground art · SPic upright art · XPic aimed side streak · HPic hit spark ·
   Shock · Crack · Puffs · Debris(drop|strand|zap|shard|rock|flame|petal) · Whirl/ribbon · Sweep · Pillar · Pool · Speed · Charge · Stain · Bolt
   ===================================================================== */
(function(){
const TAU2=Math.PI*2,cl=(v,a,b)=>v<a?a:v>b?b:v,c01=v=>cl(v,0,1),eo=k=>1-Math.pow(1-k,3),eio=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,back=k=>{const c=1.6;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const OUT='#1c1330';
const HALO=new WeakMap();function halo(i){let c=HALO.get(i);if(c!==undefined)return c;c=null;try{const P2=12,w=i.naturalWidth,h=i.naturalHeight;c=document.createElement('canvas');c.width=w+2*P2;c.height=h+2*P2;const g=c.getContext('2d');g.filter='blur(7px)';g.drawImage(i,P2,P2);g.filter='none';g.globalCompositeOperation='source-in';g.fillStyle='#1c1330';g.fillRect(0,0,c.width,c.height);c.P=P2;}catch(e){c=null;}HALO.set(i,c);return c;}
const drawHalo=(i,x,y,w,h,a)=>{const c=halo(i);if(!c)return;const f=w/i.naturalWidth;ctx.save();ctx.globalAlpha=a;ctx.drawImage(c,x-c.P*f,y-c.P*f+2,w+2*c.P*f,h+2*c.P*f);ctx.restore();};
const IM={};function im(n){let o=IM[n];if(!o){o=IM[n]={i:new Image(),ok:0};o.i.onload=()=>{o.ok=o.i.naturalWidth>0;};o.i.src='assets/fx/'+n+'.webp';}return o.ok?o.i:null;}
const mixC=(a,b,t)=>{const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)],A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const C={sea:'#3aa8ff',foam:'#e8f8ff',deep:'#1f5fc8',gold:'#ffcf4a',wind:'#bff0e0',cloud:'#c9b4ff',bolt:'#fff27a',azure:'#4a7aff',jade:'#7ff0b0'};
const scr=(x,y,z)=>P(x,y,z||0);
const aim=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const fwd=(d,phi,o)=>[(o||player).x+Math.cos(phi)*d,(o||player).y+Math.sin(phi)*d];
const add=f=>{f._v2=1;return addFx(f);};
const punch=k=>{try{camZoom*=1+(k||.04);}catch(e){}};

/* ---------------------------------------------------------------
   PICTURE PIECES
   --------------------------------------------------------------- */
/* flat ground picture: pops in (squash), never rotates; optional breathe / shimmer */
class GPic{constructor(o){Object.assign(this,{t:0,life:.8,layer:'ground',w:200,a0:1,s0:.55,grow:1.04,fadeIn:.07,fadeOut:.35,delay:0,follow:null,until:null,breathe:0,add:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&this.until()&&this.t>this.life*.5)this.t=this.life*.5;return this.t<this.life;}
  draw(){if(this.t<0)return;const i=im(this.n);if(!i)return;const k=this.t/this.life,pk=c01(this.t/.22),fo=this.fadeOut;
    const a=this.a0*c01(this.t/this.fadeIn)*(k>1-fo?c01((1-k)/fo):1);if(a<.01)return;
    const s=(this.s0+(1-this.s0)*back(pk))*(1+(this.grow-1)*eo(k))*(1+this.breathe*Math.sin(this.t*4)),w=this.w*s,h=w*i.naturalHeight/i.naturalWidth,[x,y]=scr(this.x,this.y,0);
    ctx.save();ctx.translate(x,y);ctx.scale(1,pk<1?.7+.3*pk:1);
    /* reveal: the picture opens out from the centre instead of popping in whole */
    const rv=eo(c01(this.t/(this.reveal??.2)));if(rv<1){ctx.beginPath();ctx.ellipse(0,0,w*.62*rv+2,h*.62*rv+2,0,0,Math.PI*2);ctx.clip();}
    drawHalo(i,-w/2,-h/2,w,h,a*.4);ctx.globalAlpha=a;ctx.drawImage(i,-w/2,-h/2,w,h);
    if(this.add){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*this.add*(.6+.4*Math.sin(this.t*7));ctx.drawImage(i,-w/2,-h/2,w,h);}
    if(this.t<.08){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-this.t/.08)*.8;ctx.drawImage(i,-w/2,-h/2,w,h);}ctx.restore();ctx.globalAlpha=1;
    if(!this._rp&&this.t>.02){this._rp=1;if(this.w>=100)add(new Shock({x:this.x,y:this.y,R:this.w*.5,r0:this.w*.15,col:'#ffffff',w:5,life:.35}));}}}
/* upright picture: stands on its bottom edge, rises in with squash & stretch, contact shadow + coloured light pool on the floor */
class SPic{constructor(o){Object.assign(this,{t:0,life:.8,layer:'sorted',w:140,a0:1,ay:.95,z:0,fadeIn:.06,fadeOut:.35,delay:0,follow:null,until:null,pool:null,shadow:.35,pulse:0,sink:0,flip:false,sortOff:6},o);this.t=-this.delay;}
  get sy(){return this.y+this.sortOff;}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x+(this.ox||0);this.y=this.follow.y+(this.oy||0);}if(this.until&&this.until()&&this.t>this.life*.5)this.t=this.life*.5;return this.t<this.life;}
  draw(){if(this.t<0)return;const i=im(this.n);if(!i)return;const k=this.t/this.life,pk=c01(this.t/.24),fo=this.fadeOut;
    const a=this.a0*c01(this.t/this.fadeIn)*(k>1-fo?c01((1-k)/fo):1)*(this.pulse?1-this.pulse*.5+this.pulse*.5*Math.sin(this.t*6):1);if(a<.01)return;
    const w=this.w,h=w*i.naturalHeight/i.naturalWidth,[x,y]=scr(this.x,this.y,0),z=(this.z||0)*K;
    /* floor first: shadow + light pool */
    ctx.save();ctx.translate(x,y);ctx.scale(1,K*.55);if(this.shadow){ctx.globalAlpha=a*this.shadow;const g=ctx.createRadialGradient(0,0,0,0,0,w*.42);g.addColorStop(0,'rgba(15,10,30,.9)');g.addColorStop(1,'rgba(15,10,30,0)');ctx.fillStyle=g;ctx.fillRect(-w*.5,-w*.5,w,w);}
    if(this.pool){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.55;const g=ctx.createRadialGradient(0,0,0,0,0,w*.6);g.addColorStop(0,hexA(this.pool,.7));g.addColorStop(1,hexA(this.pool,0));ctx.fillStyle=g;ctx.fillRect(-w*.6,-w*.6,w*1.2,w*1.2);}ctx.restore();
    /* rise: tall-thin → overshoot → settle; sink at the end (falls back into the floor) */
    const sy=pk<1?.25+.75*back(pk):1,sx=pk<1?1.3-.3*pk:1,sk=this.sink&&k>1-fo?1-(1-c01((1-k)/fo))*this.sink:1;
    const up=!this.sink&&k>1-fo?(1-c01((1-k)/fo))*14:0,sw=Math.sin(this.t*3.2+this.x*.01)*.035;
    ctx.save();ctx.translate(x,y-z-up);if(this.flip)ctx.scale(-1,1);ctx.transform(1,0,sw,1,0,0);ctx.scale(sx,sy*sk);
    const em=eo(c01(this.t/(this.reveal??.2)));if(em<1){ctx.beginPath();ctx.rect(-w,-h*this.ay+h*(1-em)-2,w*2,h*em+h+4);ctx.clip();}
    drawHalo(i,-w/2,-h*this.ay,w,h,a*.35);ctx.globalAlpha=a;ctx.drawImage(i,-w/2,-h*this.ay,w,h);
    if(this.t<.09){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*(1-this.t/.09)*.85;ctx.drawImage(i,-w/2,-h*this.ay,w,h);}ctx.restore();ctx.globalAlpha=1;}}
/* side-view streak picture aimed along the attack (never spun), with afterimages; optional travel */
class XPic{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',w:150,z:30,a0:1,speed:0,fadeIn:.03,fadeOut:.45,delay:0,follow:null,trail:4,ax:.5},o);this.t=-this.delay;this.r=aim(this.phi);this.fy=Math.cos(this.r)<0;this.hist=[];}
  update(dt){this.t+=dt;if(this.t<0)return true;if(this.follow){this.x=this.follow.x+(this.ox||0);this.y=this.follow.y+(this.oy||0);}
    if(this.speed){this.x+=Math.cos(this.phi)*this.speed*dt;this.y+=Math.sin(this.phi)*this.speed*dt;}
    this.hist.unshift([this.x,this.y]);if(this.hist.length>this.trail)this.hist.pop();if(this.onMove)this.onMove(this,dt);return this.t<this.life;}
  draw(){if(this.t<0)return;const i=im(this.n);if(!i)return;const k=this.t/this.life,fo=this.fadeOut,a=this.a0*c01(this.t/this.fadeIn)*(k>1-fo?c01((1-k)/fo):1);if(a<.01)return;
    const pk=c01(this.t/.12),w=this.w*(.75+.25*back(pk)),h=w*i.naturalHeight/i.naturalWidth;
    const wp=eo(c01(this.t/(this.wipe??(this.speed?.06:.13))));
    const one=(px,py,al,sc)=>{const [x,y]=scr(px,py,this.z);ctx.save();ctx.globalAlpha=al;ctx.translate(x,y);ctx.rotate(this.r);if(this.fy)ctx.scale(1,-1);ctx.scale(sc,1);if(wp<1){ctx.beginPath();ctx.rect(-w*this.ax-4,-h,w*wp+8,h*2);ctx.clip();}ctx.drawImage(i,-w*this.ax,-h/2,w,h);ctx.restore();};
    for(let j=this.hist.length-1;j>=1;j--)one(this.hist[j][0],this.hist[j][1],a*.22*(1-j/this.hist.length),1+j*.04);
    one(this.x,this.y,a,pk<1?1.25-.25*pk:1);
    if(this.t<.07){ctx.save();ctx.globalCompositeOperation='lighter';one(this.x,this.y,a*(1-this.t/.07)*.7,1);ctx.restore();}ctx.globalAlpha=1;}}
/* short hit spark picture on the body */
class HPic{constructor(o){Object.assign(this,{t:0,life:.26,layer:'top',w:70,z:26},o);this.rot=rnd(-.35,.35);}
  update(dt){this.t+=dt;if(this.e){this.x=this.e.x;this.y=this.e.y;}return this.t<this.life;}
  draw(){const i=im(this.n);if(!i)return;const k=this.t/this.life,s=k<.3?.5+.7*eo(k/.3):1.2+.1*(k-.3),a=k<.5?1:(1-k)/.5,w=this.w*s,h=w*i.naturalHeight/i.naturalWidth,[x,y]=scr(this.x,this.y,this.z);
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.rot);ctx.drawImage(i,-w/2,-h/2,w,h);if(k<.25){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-k/.25)*.8;ctx.drawImage(i,-w/2,-h/2,w,h);}ctx.restore();ctx.globalAlpha=1;}}

/* ---------------------------------------------------------------
   CODE VFX (2.5D, no round dots)
   --------------------------------------------------------------- */
/* shockwave on the floor: thick outlined band that races out and thins */
class Shock{constructor(o){Object.assign(this,{t:0,life:.45,layer:'ground',R:120,r0:8,w:16,col:C.foam,delay:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,e=eo(k),r=this.r0+(this.R-this.r0)*e,w=Math.max(1.5,this.w*(1-k*.8)),a=k<.6?1:(1-k)/.4,[x,y]=scr(this.x,this.y,0);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;ctx.lineJoin='round';
    ctx.strokeStyle=OUT;ctx.lineWidth=w+4;ctx.beginPath();ctx.arc(0,0,r,0,TAU2);ctx.stroke();
    ctx.strokeStyle=this.col;ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(1,w*.3);ctx.beginPath();ctx.arc(0,0,r-w*.2,0,TAU2);ctx.stroke();
    /* soft fill behind the front */
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.25;const g=ctx.createRadialGradient(0,0,r*.4,0,0,r);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA(this.col,.6));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU2);ctx.fill();
    ctx.restore();ctx.globalAlpha=1;}}
/* ground cracks: dark jagged lines from the impact, lit edge, fade slowly */
class Crack{constructor(o){Object.assign(this,{t:0,life:1.6,layer:'ground',R:90,n:7,col:'#ffffff'},o);this.L=[];for(let i=0;i<this.n;i++){const an=i/this.n*TAU2+rnd(-.25,.25),pts=[[0,0]];let r=0,a2=an;
    while(r<this.R*rnd(.6,1)){r+=rnd(10,20);a2+=rnd(-.35,.35);pts.push([Math.cos(a2)*r,Math.sin(a2)*r]);}this.L.push(pts);}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,grow=c01(this.t/.12),a=k<.6?1:(1-k)/.4,[x,y]=scr(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a*.85;ctx.lineCap='round';ctx.lineJoin='round';
    for(const pts of this.L){const n=Math.max(2,Math.round(pts.length*grow));ctx.beginPath();for(let j=0;j<n;j++){const p=pts[j];j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}
      ctx.strokeStyle='rgba(40,30,60,.45)';ctx.lineWidth=3.2;ctx.stroke();ctx.strokeStyle=hexA(this.col,.55);ctx.lineWidth=1.1;ctx.stroke();}ctx.restore();ctx.globalAlpha=1;}}
/* cartoon dust / mist / foam clouds: lumpy outlined blobs that roll outward along the floor */
class Puffs{constructor(o){Object.assign(this,{t:0,life:.9,layer:'sorted',R:100,n:8,col:'#f2ecff',edge:'#b8a8d8',size:22,dir:null,spread:Math.PI},o);this.P=[];
    for(let i=0;i<this.n;i++){const an=this.dir==null?i/this.n*TAU2+rnd(-.2,.2):this.dir+rnd(-this.spread,this.spread),sp=rnd(.6,1);this.P.push({an,sp,sz:this.size*rnd(.75,1.25),lob:[rnd(.5,.8),rnd(.55,.85),rnd(.45,.7)],rot:rnd(0,6)});}}
  get sy(){return this.y+20;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=eo(k),a=k<.5?1:(1-k)/.5;ctx.save();ctx.lineJoin='round';
    for(const p of this.P){const r=this.R*p.sp*e,[x,y]=scr(this.x+Math.cos(p.an)*r,this.y+Math.sin(p.an)*r,3+6*e),s=p.sz*(.5+.8*e);ctx.globalAlpha=a*.75;
      ctx.beginPath();ctx.arc(x,y,s,0,TAU2);ctx.arc(x+s*.7,y+s*.15,s*p.lob[0],0,TAU2);ctx.arc(x-s*.65,y+s*.2,s*p.lob[1],0,TAU2);ctx.arc(x+s*.1,y-s*.45,s*p.lob[2],0,TAU2);
      ctx.fillStyle=this.edge;ctx.fill();ctx.save();ctx.translate(0,-s*.18);ctx.beginPath();ctx.arc(x,y,s*.9,0,TAU2);ctx.arc(x+s*.62,y+s*.15,s*p.lob[0]*.85,0,TAU2);ctx.arc(x-s*.58,y+s*.2,s*p.lob[1]*.85,0,TAU2);ctx.fillStyle=this.col;ctx.fill();ctx.restore();}
    ctx.restore();ctx.globalAlpha=1;}}
/* shaped debris with gravity: water drops (teardrops), shards (diamonds), rocks (polygons), strands (wind), sparks (zigzag) */
class Debris{constructor(o){Object.assign(this,{t:0,life:1,layer:'sorted',n:8,kind:'drop',col:C.sea,col2:C.foam,v0:120,v1:260,up:220,dir:null,spread:Math.PI,z:20,g:900},o);this.B=[];
    for(let i=0;i<this.n;i++){const an=this.dir==null?rnd(0,TAU2):this.dir+rnd(-this.spread,this.spread),s=rnd(this.v0,this.v1);
      this.B.push({x:this.x,y:this.y,z:this.z+rnd(-4,4),vx:Math.cos(an)*s,vy:Math.sin(an)*s,vz:this.up*rnd(.6,1.2),sz:rnd(3.5,7),rot:rnd(0,6),vr:rnd(-12,12),land:0,pts:Array.from({length:5},()=>rnd(.6,1))});}}
  get sy(){return this.y+10;}
  update(dt){this.t+=dt;for(const b of this.B){if(b.land){b.land+=dt;continue;}b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.vz-=this.g*dt;b.vx*=1-dt*.8;b.vy*=1-dt*.8;b.rot+=b.vr*dt;
      if(b.z<=0){b.z=0;if(Math.abs(b.vz)>160&&this.kind!=='drop'){b.vz=-b.vz*.35;}else b.land=.001;}}return this.t<this.life;}
  draw(){const k=this.t/this.life;ctx.save();ctx.lineJoin='round';
    for(const b of this.B){const [x,y]=scr(b.x,b.y,b.z),a=b.land?c01(1-b.land/.35):k>.8?(1-k)/.2:1;if(a<=0)continue;ctx.globalAlpha=a;
      if(this.kind==='drop'){/* teardrop pointing along its flight; flattens into a little splash ring when it lands */
        if(b.land){const [gx,gy]=scr(b.x,b.y,0),r=b.sz*(1+b.land*6);ctx.save();ctx.translate(gx,gy);ctx.scale(1,K);ctx.strokeStyle=hexA(this.col2,.9);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,r,0,TAU2);ctx.stroke();ctx.restore();continue;}
        const vy2=b.vy*K-b.vz*K,an=Math.atan2(vy2,b.vx),s=b.sz;ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.beginPath();ctx.moveTo(s*1.9,0);ctx.quadraticCurveTo(0,-s,-s*.9,0);ctx.quadraticCurveTo(0,s,s*1.9,0);
        ctx.fillStyle=this.col;ctx.fill();ctx.strokeStyle=OUT;ctx.lineWidth=1.3;ctx.stroke();ctx.fillStyle=this.col2;ctx.beginPath();ctx.ellipse(-s*.1,-s*.3,s*.45,s*.22,0,0,TAU2);ctx.fill();ctx.restore();}
      else if(this.kind==='strand'){/* curling wind strand */const an=Math.atan2(b.vy*K-b.vz*K,b.vx),L=b.sz*5;ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.strokeStyle=this.col;ctx.lineWidth=2.2;ctx.lineCap='round';
        ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(-L*.3,-L*.35,L*.3,-L*.1);ctx.quadraticCurveTo(L*.6,0,L*.45,L*.25);ctx.stroke();ctx.strokeStyle=this.col2;ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      else if(this.kind==='flame'){/* licking flame tongue, tip up, shrinking as it rises */const s=b.sz*1.2*Math.max(.1,1-k)*(b.land?Math.max(0,1-b.land*3):1);ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,-s*2.2);ctx.quadraticCurveTo(s*1.1,-s*.4,s*.7,s*.5);ctx.quadraticCurveTo(0,s*1.1,-s*.7,s*.5);ctx.quadraticCurveTo(-s*1.1,-s*.4,0,-s*2.2);
        ctx.fillStyle=this.col;ctx.fill();ctx.strokeStyle=OUT;ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=this.col2;ctx.beginPath();ctx.moveTo(0,-s*1.1);ctx.quadraticCurveTo(s*.5,0,0,s*.5);ctx.quadraticCurveTo(-s*.5,0,0,-s*1.1);ctx.fill();ctx.restore();}
      else if(this.kind==='petal'){/* sakura petal fluttering */const s=b.sz;ctx.save();ctx.translate(x,y);ctx.rotate(b.rot);ctx.scale(1,.6+.4*Math.sin(b.rot*3));ctx.beginPath();ctx.moveTo(0,-s*1.3);ctx.quadraticCurveTo(s*1.1,-s*.2,0,s*1.2);ctx.quadraticCurveTo(-s*1.1,-s*.2,0,-s*1.3);
        ctx.fillStyle=this.col;ctx.fill();ctx.strokeStyle=OUT;ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      else if(this.kind==='zap'){/* electric zigzag */ctx.save();ctx.translate(x,y);ctx.rotate(b.rot);ctx.strokeStyle=this.col;ctx.lineWidth=2.4;ctx.lineCap='round';const s=b.sz*1.8;
        ctx.beginPath();ctx.moveTo(-s,-s*.4);ctx.lineTo(-s*.2,s*.2);ctx.lineTo(s*.1,-s*.3);ctx.lineTo(s,s*.4);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      else{/* shard (diamond) or rock (lumpy polygon) */const s=b.sz;ctx.save();ctx.translate(x,y);ctx.rotate(b.rot);ctx.beginPath();
        if(this.kind==='shard'){ctx.moveTo(0,-s*1.6);ctx.lineTo(s*.55,0);ctx.lineTo(0,s*1.6);ctx.lineTo(-s*.55,0);}else{for(let j=0;j<5;j++){const an=j/5*TAU2,r=s*b.pts[j];j?ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r):ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r);}}
        ctx.closePath();ctx.fillStyle=this.col;ctx.fill();ctx.strokeStyle=OUT;ctx.lineWidth=1.3;ctx.stroke();ctx.fillStyle=this.col2;ctx.globalAlpha=a*.8;ctx.beginPath();ctx.moveTo(0,-s*.9);ctx.lineTo(s*.25,-s*.1);ctx.lineTo(-s*.1,0);ctx.closePath();ctx.fill();ctx.restore();}}
    ctx.restore();ctx.globalAlpha=1;}}
/* ribbon arc on the 2.5D floor plane (or lifted by z): tapered crescent with an outlined edge. Builds spins, swirls, tornadoes, sweeps. */
function ribbon(cx,cy,z,R,a0,sweep,w,col,col2,alpha,soft){const N=22;ctx.save();ctx.globalAlpha=alpha;if(soft)ctx.globalCompositeOperation='lighter';ctx.beginPath();
  for(let i=0;i<=N;i++){const u=i/N,an=a0+sweep*u,ww=w*Math.sin(u*Math.PI)*(.35+.65*u),[x,y]=scr(cx+Math.cos(an)*(R+ww/2),cy+Math.sin(an)*(R+ww/2),z);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  for(let i=N;i>=0;i--){const u=i/N,an=a0+sweep*u,ww=w*Math.sin(u*Math.PI)*(.35+.65*u),[x,y]=scr(cx+Math.cos(an)*(R-ww/2),cy+Math.sin(an)*(R-ww/2),z);ctx.lineTo(x,y);}
  ctx.closePath();ctx.fillStyle=col;ctx.fill();if(!soft){ctx.strokeStyle=OUT;ctx.lineWidth=1.6;ctx.stroke();}
  /* bright inner line along the leading half */
  ctx.beginPath();for(let i=8;i<=N;i++){const u=i/N,an=a0+sweep*u,[x,y]=scr(cx+Math.cos(an)*R,cy+Math.sin(an)*R,z);i>8?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col2;ctx.lineWidth=Math.max(1,w*.18);ctx.lineCap='round';ctx.stroke();ctx.restore();}
/* whirl: several ribbons turning on the floor, optional rising funnel (tornado) — the 2.5D replacement for spinning pictures */
class Whirl{constructor(o){Object.assign(this,{t:0,life:1,layer:o&&o.h?'sorted':'ground',a0:1,R:110,n:4,w:18,col:C.sea,col2:C.foam,spd:7,h:0,fadeIn:.12,fadeOut:.3,follow:null,until:null,dir:1,inward:0},o);this.ph=rnd(0,6);}
  get sy(){return this.y+this.R*.3;}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&this.until()&&this.t>this.life*.5)this.t=this.life*.5;return this.t<this.life;}
  draw(){const k=this.t/this.life,fo=this.fadeOut,a=c01(this.t/this.fadeIn)*(k>1-fo?c01((1-k)/fo):1);if(a<.01)return;const rot=this.ph+this.t*this.spd*this.dir,lv=this.h?5:1;
    for(let L=0;L<lv;L++){const u=L/(Math.max(1,lv-1)),z=this.h*u,R=this.R*(this.h?(.45+.55*u):1)*(1-this.inward*((this.t*1.5)%1)*.3);
      for(let i=0;i<this.n;i++){const a0=rot*(1+u*.4)+i/this.n*TAU2+L*.7;ribbon(this.x,this.y,z,R*(1-i*.06),a0,1.5*this.dir,this.w*(1-u*.35),this.h?this.col2:this.col,'#ffffff',a*(this.h?.45-u*.2:.6),true);}}}}
/* one sweeping slash arc around the hero (tail sweep, spin hit) */
class Sweep{constructor(o){Object.assign(this,{t:0,life:.32,layer:'sorted',R:90,w:26,z:20,col:C.foam,col2:'#ffffff',a0:0,turn:TAU2*.9,dir:1},o);}
  get sy(){return this.y+this.R*.5;}update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,head=eo(c01(k*1.3))*this.turn,tail=Math.max(0,head-1.6*(1-k*.6)),a=k<.7?1:(1-k)/.3;
    if(head-tail<.05)return;ribbon(this.x,this.y,this.z,this.R,this.a0+tail*this.dir,(head-tail)*this.dir,this.w,this.col,this.col2,a);}}
/* light pillar for power releases */
class Pillar{constructor(o){Object.assign(this,{t:0,life:.7,layer:'sorted',w:70,h:260,col:C.sea,delay:0,follow:null},o);this.t=-this.delay;this.L=Array.from({length:7},()=>({x:rnd(-.4,.4),s:rnd(.6,1.2),o:rnd(0,1)}));}
  get sy(){return this.y+2;}update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,rise=eo(c01(this.t/.18)),a=k<.5?1:(1-k)/.5,[x,y]=scr(this.x,this.y,0),w=this.w*(1-k*.4),h=this.h*rise;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.85;let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,hexA(this.col,0));g.addColorStop(.5,hexA(this.col,.75));g.addColorStop(1,hexA(this.col,0));
    ctx.fillStyle=g;ctx.fillRect(x-w/2,y-h,w,h);g=ctx.createLinearGradient(x-w*.18,0,x+w*.18,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(x-w*.18,y-h,w*.36,h);
    /* rising energy lines */ctx.lineCap='round';for(const l of this.L){const u=(l.o+this.t*l.s*1.6)%1,ly=y-h*u,lx=x+l.x*w;ctx.strokeStyle=hexA('#ffffff',.8*(1-u));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx,ly-26);ctx.stroke();}
    /* base glow on the floor */ctx.translate(x,y);ctx.scale(1,K);g=ctx.createRadialGradient(0,0,0,0,0,w*1.3);g.addColorStop(0,hexA(this.col,.7));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.fillRect(-w*1.3,-w*1.3,w*2.6,w*2.6);ctx.restore();ctx.globalAlpha=1;}}
/* additive light pool on the floor */
class Pool{constructor(o){Object.assign(this,{t:0,life:.6,layer:'ground',R:90,col:C.sea,a0:.6,follow:null,until:null},o);}update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&this.until()&&this.t>this.life*.5)this.t=this.life*.5;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=this.a0*(k<.2?k/.2:k<.6?1:(1-k)/.4),[x,y]=scr(this.x,this.y,0);if(a<.01)return;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,hexA(this.col,a));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.fillRect(-this.R,-this.R,this.R*2,this.R*2);ctx.restore();}}
/* speed lines behind a moving body (screen-plane strokes along the motion) */
class Speed{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',n:7,len:70,col:'#ffffff',z:30},o);this.L=Array.from({length:this.n},()=>({o:rnd(-22,22),d:rnd(0,40),s:rnd(.6,1)}));}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,r=aim(this.phi),[x,y]=scr(this.x,this.y,this.z);ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.lineCap='round';
    for(const l of this.L){const L=this.len*l.s*(1-k*.5),x0=-30-l.d;ctx.strokeStyle=hexA(this.col,.75*a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,l.o);ctx.lineTo(x0-L,l.o);ctx.stroke();}ctx.restore();}}
/* charge-up: energy strands pulled in toward the hero + a thin rune ring tightening on the floor */
class Charge{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',col:C.sea,R:80},o);this.S=Array.from({length:9},(_,i)=>({an:i/9*TAU2+rnd(-.2,.2),z:rnd(10,60)}));}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=c01(this.t/this.life),[x,y]=scr(player.x,player.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.8*(1-k*.3);ctx.strokeStyle=this.col;ctx.lineWidth=3;ctx.setLineDash([12,8]);ctx.lineDashOffset=-this.t*80;
    ctx.beginPath();ctx.arc(0,0,this.R*(1-k*.6),0,TAU2);ctx.stroke();ctx.restore();ctx.save();ctx.lineCap='round';
    for(const s of this.S){const r0=this.R*(1.1-k),r1=r0*.55,[ax,ay]=scr(player.x+Math.cos(s.an)*r0,player.y+Math.sin(s.an)*r0,s.z),[bx,by]=scr(player.x+Math.cos(s.an)*r1,player.y+Math.sin(s.an)*r1,s.z*.8);
      ctx.strokeStyle=hexA(this.col,.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1;ctx.stroke();}ctx.restore();ctx.globalAlpha=1;}}
/* wet stain / scorch decal left on the floor */
class Stain{constructor(o){Object.assign(this,{t:0,life:2,layer:'ground',R:60,col:'rgba(40,90,160,.35)'},o);this.lob=Array.from({length:6},()=>rnd(.7,1.1));}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=k<.1?k/.1:k>.6?(1-k)/.4:1,[x,y]=scr(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;ctx.fillStyle=this.col;ctx.beginPath();
    for(let i=0;i<=24;i++){const an=i/24*TAU2,r=this.R*this.lob[i%6]*(.9+.1*Math.sin(an*3));i?ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r):ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
/* lightning bolt from the sky, drawn as an outlined zigzag (painted lightning picture sits on top) */
class Bolt{constructor(o){Object.assign(this,{t:0,life:.3,layer:'sorted',col:C.bolt,h:300},o);this.J=Array.from({length:8},()=>rnd(-14,14));}get sy(){return this.y+4;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=scr(this.x,this.y,0),top=y-this.h;ctx.save();ctx.lineJoin='round';ctx.globalAlpha=a;const path=()=>{ctx.beginPath();ctx.moveTo(x+this.J[0],top);for(let i=1;i<8;i++)ctx.lineTo(x+this.J[i]*(1-i/8),top+(y-top)*i/7);};
    path();ctx.strokeStyle=OUT;ctx.lineWidth=9;ctx.stroke();path();ctx.strokeStyle=this.col;ctx.lineWidth=6;ctx.stroke();path();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();ctx.restore();ctx.globalAlpha=1;}}

/* ---------------------------------------------------------------
   RECIPES
   --------------------------------------------------------------- */
const V={
  slam(x,y,R,col,o={}){add(new Shock({x,y,R,col,w:o.w||18,life:.42}));add(new Shock({x,y,R:R*1.35,col:'#ffffff',w:7,life:.55,delay:.06}));if(o.crack!==false)add(new Crack({x,y,R:R*.5,col,life:1.1,n:6}));
    if(o.puffs!==0)add(new Puffs({x,y,R:R*.95,n:o.puffs||8,col:o.dust||'#f4f0ff',edge:o.dustE||'#c2b6e0',size:Math.min(10,R*.07),life:.6}));if(o.debris!==false)add(new Debris({x,y,n:o.n||10,kind:o.kind||'rock',col:o.dcol||'#a89cc0',col2:'#ffffff',v0:R*.8,v1:R*2.2,up:o.up||320}));
    shake(o.shake||3);punch(o.punch||.04);},
  release(x,y,col,o={}){add(new Pillar({x,y,col,w:o.w||80,h:o.h||300,life:o.life||.7}));add(new Shock({x,y,R:o.R||140,col,w:20,life:.5}));add(new Pool({x,y,R:(o.R||140)*1.1,col,life:.9}));punch(.05);shake(2.5);
    flash.a=Math.max(flash.a,.18);flash.c=col;},
  splash(x,y,n,dir,spread){add(new Debris({x,y,n:n||7,kind:'drop',col:C.sea,col2:C.foam,v0:80,v1:220,up:260,dir,spread:spread??Math.PI,life:.9}));},
  windBits(x,y,n,dir,spread){add(new Debris({x,y,n:n||5,kind:'strand',col:C.wind,col2:'#ffffff',v0:120,v1:260,up:120,g:200,dir,spread:spread??Math.PI,life:.7}));},
  zaps(x,y,n){add(new Debris({x,y,n:n||6,kind:'zap',col:C.bolt,col2:'#ffffff',v0:80,v1:200,up:200,life:.6}));},
  charge(col,T){add(new Charge({col,life:Math.max(.15,T)}));},
};



window.V25={im,add,punch,scr,aim,fwd,ribbon,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Sweep,Pillar,Pool,Speed,Charge,Stain,Bolt,V,C,OUT,c01,eo,back};
})();
