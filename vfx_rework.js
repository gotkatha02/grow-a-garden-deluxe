/* =========================================================================
   VFX REWORK (pass 2) — soft, feathered, restrained. Loaded after the main script.
   - Shared primitives (hit flash, ground shock ring, ground fissure) are redrawn for
     Rhino / Owl / Axolotl / Crocodile. Wolf and Jaguar keep their painted-texture look.
   - Rhino: every punch / charge / slam built by rhPunches / rhCharge / rhSlam gets a
     pressure-wave, snow wake and snow eruption (force and weight, no magic glow).
   Remove the <script src="vfx_rework.js"> tag in index.html to switch this pass off.
   ========================================================================= */
/* first-frame crash fix: build the FX-layer transform without DOMMatrix (it could throw and stop the loop) */
beginLayer=function(T){const sx=layerCv.width/cvs.width,sy=layerCv.height/cvs.height;lctx.setTransform(1,0,0,1,0,0);lctx.globalAlpha=1;lctx.globalCompositeOperation='source-over';
  lctx.clearRect(0,0,layerCv.width,layerCv.height);lctx.setTransform(T.a*sx,T.b*sy,T.c*sx,T.d*sy,T.e*sx,T.f*sy);ctx=lctx;layerDirty=false;};

(function(){
if(!['rhino','owl','axolotl','croc'].includes(CHAR))return;
const hx=c=>(typeof c==='string'&&c[0]==='#'&&c.length>=7)?c:'#ffffff';

/* ---- hit flash: soft core, detached tapered streaks, feathered shock disc (no hard comic frame) ---- */
class SoftImpact{
  constructor(o){Object.assign(this,{t:0,life:.22,size:30,color:'#ffd9a0',core:'#ffffff',rays:8,ring:true,layer:'top',cross:false},o);this.color=hx(this.color);this.core=hx(this.core);
    this.life=Math.max(this.life,.2);this.ry=[];
    if(this.angles)for(const a of this.angles)this.ry.push({a,l:rnd(1.5,1.9),w:3.4});
    else{const n=this.cross?4:Math.min(9,this.rays);for(let i=0;i<n;i++)this.ry.push({a:this.cross?Math.PI/4+i*Math.PI/2+rnd(-.06,.06):i/n*TAU+rnd(-.28,.28),l:this.cross?rnd(1.5,1.8):rnd(.6,1.3),w:rnd(2,3.6)});}
    this.rot=rnd(0,TAU);
    if(this.light!==false&&this.pos)addFx(new GLight({x:this.pos[0],y:this.pos[1],r:this.size*1.8,color:this.color,life:this.life*1.5,a:.32}));}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(...this.pos),S=this.size,e=eOut(k),a=Math.pow(1-k,1.4);ctx.save();ctx.globalCompositeOperation='lighter';
    /* soft core */
    const r=S*(.28+.5*e),g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(this.core,.5*a));g.addColorStop(.3,hexA(this.core,.2*a));g.addColorStop(.62,hexA(this.color,.16*a));g.addColorStop(1,hexA(this.color,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    /* opening glint: a small 4-point star for the first frames */
    if(this.t<.06){const s=S*.9*(1-this.t/.06*.4),al=1-this.t/.06;ctx.save();ctx.fillStyle=hexA(this.core,.85*al);ctx.translate(x,y);ctx.rotate(this.rot);
      for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,-s*.07);ctx.quadraticCurveTo(s*.3,0,s,0);ctx.quadraticCurveTo(s*.3,0,0,s*.07);ctx.closePath();ctx.fill();}ctx.restore();}
    /* streaks: leave the centre and thin out */
    for(const q of this.ry){const c=Math.cos(q.a),s=Math.sin(q.a)*.85,r0=S*(.22+.75*e),r1=r0+S*q.l*(.75-.45*k),w=q.w*(1-k*.8),x0=x+c*r0,y0=y+s*r0,x1=x+c*r1,y1=y+s*r1,nx=-s,ny=c;
      const lg=ctx.createLinearGradient(x0,y0,x1,y1);lg.addColorStop(0,hexA(this.color,0));lg.addColorStop(.3,hexA(this.core,.8*a));lg.addColorStop(1,hexA(this.color,0));ctx.fillStyle=lg;
      const mx=lerp(x0,x1,.3),my=lerp(y0,y1,.3);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx+nx*w,my+ny*w,x1,y1);ctx.quadraticCurveTo(mx-nx*w,my-ny*w,x0,y0);ctx.fill();}
    /* feathered shock disc */
    if(this.ring){const rr=S*(.3+1.15*e),w=Math.max(1.5,S*.16*(1-k));ctx.lineWidth=w*2.4;ctx.strokeStyle=hexA(this.color,.16*a);ctx.beginPath();ctx.ellipse(x,y,rr,rr*.62,0,0,TAU);ctx.stroke();
      ctx.lineWidth=w;ctx.strokeStyle=hexA(this.core,.5*a);ctx.beginPath();ctx.ellipse(x,y,rr,rr*.62,0,0,TAU);ctx.stroke();}
    ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
}

/* ---- ground shock ring: feathered band with a bright crest and a faint contact shadow ---- */
class SoftRing{
  constructor(o){Object.assign(this,{t:0,life:.5,r0:10,r1:120,w:14,color:'#ffd27a',layer:'ground',delay:0},o);this.color=hx(this.color);}
  update(dt){this.t+=dt;return this.t<this.life+this.delay;}
  draw(){const lt=this.t-this.delay;if(lt<0)return;const k=lt/this.life,r=lerp(this.r0,this.r1,eOut(k)),a=Math.pow(1-k,1.3),w=Math.max(4,this.w*(1.5-k*.7)),[x,y]=P(this.x,this.y);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    ctx.strokeStyle=`rgba(18,24,34,${.2*a})`;ctx.lineWidth=w*.55;ctx.beginPath();ctx.arc(0,0,r+w*.35,0,TAU);ctx.stroke();
    ctx.globalCompositeOperation='lighter';const ri=Math.max(0,r-w*2.2),ro=r+w*.6,g=ctx.createRadialGradient(0,0,ri,0,0,ro);
    g.addColorStop(0,hexA(this.color,0));g.addColorStop(.55,hexA(this.color,.2*a));g.addColorStop(.8,hexA(this.color,.5*a));g.addColorStop(.9,hexA('#ffffff',.55*a));g.addColorStop(1,hexA(this.color,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,ro,0,TAU);if(ri>0)ctx.arc(0,0,ri,0,TAU,true);ctx.fill('evenodd');ctx.restore();ctx.globalCompositeOperation='source-over';}
}

/* ---- ground fissure: branching tapered cracks that zip outward, glow briefly, then stay as a dark scar ---- */
class Fissure{
  constructor(o){Object.assign(this,{t:0,life:1.6,r:50,layer:'ground',color:'#ffb35a'},o);this.color=hx(this.color);this.b=[];const n=6+(Math.random()*3|0);
    const grow=(x,y,a,L,d)=>{const pts=[[x,y]];const seg=4;for(let j=0;j<seg;j++){a+=rnd(-.45,.45);x+=Math.cos(a)*L/seg;y+=Math.sin(a)*L/seg;pts.push([x,y]);if(d<1&&j>0&&Math.random()<.45)grow(x,y,a+(Math.random()<.5?-1:1)*rnd(.5,.9),L*rnd(.3,.5),d+1);}this.b.push({pts,d});};
    for(let i=0;i<n;i++)grow(0,0,i/n*TAU+rnd(-.3,.3),this.r*rnd(.55,1),0);}
  update(dt){this.t+=dt;return this.t<this.life;}
  stroke(w0,rev){for(const b of this.b){const p=b.pts,m=p.length-1,sc=b.d?.55:1;for(let i=0;i<m;i++){const u=(i+1)/m;if(u>rev+.01)break;ctx.lineWidth=Math.max(.6,w0*sc*(1-i/m*.8));ctx.beginPath();ctx.moveTo(p[i][0],p[i][1]);ctx.lineTo(p[i+1][0],p[i+1][1]);ctx.stroke();}}}
  draw(){const k=this.t/this.life,rev=eOut(Math.min(1,this.t/.14)),a=k<.65?1:(1-k)/.35,[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';
    const pit=ctx.createRadialGradient(0,0,0,0,0,this.r*.45);pit.addColorStop(0,`rgba(14,16,22,${.4*a})`);pit.addColorStop(1,'rgba(14,16,22,0)');ctx.fillStyle=pit;ctx.beginPath();ctx.arc(0,0,this.r*.45,0,TAU);ctx.fill();
    ctx.strokeStyle=`rgba(236,242,250,${.3*a})`;this.stroke(5.5,rev);ctx.strokeStyle=`rgba(16,18,26,${.8*a})`;this.stroke(3.2,rev);
    const gl=Math.max(0,1-k*2.6);if(gl>0){ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(this.color,.7*gl*a);this.stroke(1.5,rev);}
    ctx.restore();ctx.globalCompositeOperation='source-over';}
}
Impact=SoftImpact;GRing=SoftRing;Crack=Fissure;
if(CHAR==='rhino'){try{PunchBurst=SoftImpact;RhRing=SoftRing;}catch(e){}}

/* =================== RHINO: force, weight, snow =================== */
if(CHAR!=='rhino'||!/[?&]vfx3=0/.test(location.search))return;   /* 2026-11-25: the rhino's own look is rhino_vfx.js now; this pass = ?vfx3=0 */
/* pressure wave thrown by a punch / carried in front of a charge */
class PunchWake{
  constructor(o){Object.assign(this,{t:0,life:.24,layer:'top',z:28,L:80,W:26,col:'#dfeeff'},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,head=eOut(Math.min(1,this.t/.09)),a=Math.pow(1-k,1.2),[px,py]=P(this.x,this.y,this.z),L=this.L*(.35+.65*head),W=this.W*(.7+.3*head);
    ctx.save();ctx.translate(px,py);ctx.rotate(Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)));ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(0,0,L,0);g.addColorStop(0,hexA(this.col,0));g.addColorStop(.55,hexA(this.col,.2*a));g.addColorStop(.92,hexA('#ffffff',.42*a));g.addColorStop(1,hexA('#ffffff',0));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*.5,-W*.95,L*.86,-W*.62);ctx.quadraticCurveTo(L*1.08,0,L*.86,W*.62);ctx.quadraticCurveTo(L*.5,W*.95,0,0);ctx.fill();
    ctx.lineCap='round';for(const [u,al] of [[.5,.35],[.74,.6],[.96,.9]]){ctx.strokeStyle=hexA('#ffffff',al*a);ctx.lineWidth=1+2.4*u*(1-k);ctx.beginPath();ctx.ellipse(L*u-6*u,0,5+7*u,W*u*.74,0,-1.25,1.25);ctx.stroke();}
    ctx.restore();ctx.globalCompositeOperation='source-over';}
}
/* ring of packed-snow plumes thrown up by a slam */
class SnowBurst{
  constructor(o){Object.assign(this,{t:0,life:.55,layer:'top',R:60,n:11,h:46},o);this.j=[];for(let i=0;i<this.n;i++)this.j.push({a:i/this.n*TAU+rnd(-.2,.2),h:rnd(.6,1.15),w:rnd(7,12),d:rnd(0,.06),r:rnd(.8,1.05)});}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){for(const q of this.j){const t=this.t-q.d;if(t<=0)continue;const k=Math.min(1,t/(this.life-q.d)),up=eOut(Math.min(1,k*1.8)),a=(k<.25?k/.25:1-(k-.25)/.75)*.75,rr=this.R*q.r*(.85+.25*eOut(k)),wx=this.x+Math.cos(q.a)*rr,wy=this.y+Math.sin(q.a)*rr,[x,y]=P(wx,wy,0),h=this.h*q.h*up,w=q.w*(.7+.6*k),lx=Math.cos(q.a)*h*.3;
      const g=ctx.createLinearGradient(x,y,x+lx,y-h);g.addColorStop(0,`rgba(232,240,248,${.1*a})`);g.addColorStop(.45,`rgba(246,250,255,${a})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*.7+lx*.5,y-h*.6,x+lx,y-h);ctx.quadraticCurveTo(x+w*.7+lx*.5,y-h*.6,x+w,y);ctx.closePath();ctx.fill();}}
}
const fistW=()=>player.socket&&player.socket.w?player.socket.w:[player.x,player.y,30];
const snowSpray=(x,y,phi,n,spd)=>{for(let i=0;i<qn(n);i++){const a=phi+rnd(-.9,.9),s=rnd(.3,1)*spd;emit({type:'snow',x:x+rnd(-6,6),y:y+rnd(-4,4),z:rnd(1,6),vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(50,150),g:420,drag:1.4,life:rnd(.35,.65),size:rnd(1.2,2.8),color:Math.random()<.5?'#ffffff':'#dcebf8'});}};

/* punches: a pressure wave leaves the fist on every contact frame; the last one is bigger and kicks up snow */
const _punches=rhPunches;rhPunches=function(o){const each=o.each,after=o.after,n=o.n||1;
  o.after=function(a,hit,i,last){const w=fistW(),big=last&&n>=1,R=o.range||80;
    addFx(new PunchWake({x:w[0],y:w[1],z:w[2],phi:o.phi,L:big?R*1.05:R*.75,W:big?30:20,life:big?.28:.2,col:o.glow&&o.glow[0]==='#'?'#ffe6c8':'#dfeeff'}));
    if(big){snowSpray(player.x+Math.cos(o.phi)*24,player.y+Math.sin(o.phi)*24,o.phi,hit.length?10:5,150);}
    after&&after(a,hit,i,last);};
  o.each=each;return _punches(o);};
/* charge: bow wave carried in front, snow thrown off both shoulders, burst where it stops */
const _charge=rhCharge;rhCharge=function(o){const a=_charge(o);if(!a)return a;const u=a.update,t0=a.windup,t1=a.dur-.15,phi=o.phi;let acc=0;
  a.update=function(a2,dt){u&&u(a2,dt);if(a2.t<t0||a2.t>t1)return;acc+=dt;const c=Math.cos(phi),s=Math.sin(phi);
    if(acc>.07){acc=0;addFx(new PunchWake({x:player.x+c*8,y:player.y+s*8,z:24,phi,L:52,W:30,life:.2}));}
    for(const sd of [-1,1])if(Math.random()<Q.p)snowSpray(player.x-s*sd*14,player.y+c*sd*14,phi+Math.PI+sd*.9,2,130);};
  (a.events=a.events||[]).push({t:t1,f:()=>{addFx(new SnowBurst({x:player.x+Math.cos(phi)*18,y:player.y+Math.sin(phi)*18,R:30,n:8,h:34,life:.45}));}});return a;};
/* slam: snow erupts in a ring around the impact */
const _slam=rhSlam;rhSlam=function(o){const imp=o.impact;o.impact=function(a,x,y){imp(a,x,y);addFx(new SnowBurst({x,y,R:o.fxR||58,n:12,h:50}));setFxTimer(.09,()=>addFx(new SnowBurst({x,y,R:(o.fxR||58)*1.7,n:14,h:30,life:.5})));snowSpray(x,y,rnd(0,TAU),10,170);};return _slam(o);};

/* =================== RHINO: per-skill signatures (follow each skill's description) =================== */
const alive=(f)=>{if(f.buff){if(f.t>.45&&!hasBuff(f.buff)&&f.end==null)f.end=f.t;return f.t<(f.max||60)&&(f.end==null||f.t<f.end+.25);}return f.t<f.life;};
const fadeA=(f)=>f.buff?(f.end!=null?Math.max(0,1-(f.t-f.end)/.25):1):Math.min(1,(f.life-f.t)/.2);
/* one riveted steel tower-shield plate standing on the ground between two angles of a circle */
function plate(x,y,an0,an1,R,h,drop,a,flash){const p=(an,z)=>P(x+Math.cos(an)*R,y+Math.sin(an)*R,z+drop),A=p(an0,0),B=p(an1,0),C=p(an1,h),D=p(an0,h);
  const g=ctx.createLinearGradient(0,Math.max(A[1],B[1]),0,Math.min(C[1],D[1]));g.addColorStop(0,`rgba(58,84,128,${.62*a})`);g.addColorStop(.55,`rgba(140,168,204,${.58*a})`);g.addColorStop(1,`rgba(228,240,252,${.78*a})`);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.lineTo(C[0],C[1]);ctx.lineTo((C[0]+D[0])/2,(C[1]+D[1])/2-5);ctx.lineTo(D[0],D[1]);ctx.closePath();ctx.fill();
  ctx.lineJoin='round';ctx.strokeStyle=`rgba(22,32,52,${.6*a})`;ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${Math.min(1,.45+flash*.55)*a})`;ctx.lineWidth=1;ctx.stroke();
  const mx=(A[0]+B[0]+C[0]+D[0])/4,my=(A[1]+B[1]+C[1]+D[1])/4;ctx.fillStyle=`rgba(224,150,84,${.85*a})`;ctx.beginPath();ctx.arc(mx,my,2.4,0,TAU);ctx.fill();
  if(flash>0){ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,255,255,${.35*flash*a})`;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.lineTo(C[0],C[1]);ctx.lineTo(D[0],D[1]);ctx.fill();ctx.globalCompositeOperation='source-over';}}
/* plates slam down around the rhino. Depth-sorted in two halves so the rear plates sit behind the body. */
class SteelPlates{constructor(o){Object.assign(this,{t:0,life:1,layer:'sorted',n:3,arc:1.4,R:38,h:44,gap:.05,buff:null,flash:0,fixed:null,cren:false,half:'front'},o);}
  get sy(){return player.y+(this.half==='back'?-3:3);}
  update(dt){this.t+=dt;this.flash=Math.max(0,this.flash-dt*3);return alive(this);}
  draw(){const a=fadeA(this),phi0=this.fixed??player.phi,st=this.arc/this.n;for(let i=0;i<this.n;i++){const an0=phi0-this.arc/2+i*st+this.gap,an1=an0+st-this.gap*2,back=Math.sin((an0+an1)/2)<0;if(back!==(this.half==='back'))continue;
      const kd=clamp((this.t-i*.035)/.16,0,1);if(kd<=0)continue;plate(player.x,player.y,an0,an1,this.R,this.h*(this.cren&&i%2?.78:1),(1-eOutBack(kd))*46,a*Math.min(1,kd*2),Math.max(this.flash,kd<1?0:Math.max(0,1-(this.t-i*.035-.16)/.18)));}}}
const plates=o=>{dustPuff(player.x,player.y,4,'#e8f0f8',50,6);return [addFx(new SteelPlates(Object.assign({half:'back'},o))),addFx(new SteelPlates(Object.assign({half:'front'},o)))];};
/* small hex plates fly in and lock onto the body, then a metallic sheen runs up it */
class PlateConverge{constructor(o){Object.assign(this,{t:0,life:1,layer:'top',n:7,col:'#cfe0f4',s:6},o);this.p=[];for(let i=0;i<this.n;i++)this.p.push({a:rnd(0,TAU),ox:rnd(-13,13),oz:rnd(12,62),d:i*.03,r:rnd(-2,2)});}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const [x,y]=P(player.x,player.y,player.z||0);for(const q of this.p){const t=this.t-q.d;if(t<=0)continue;const k=Math.min(1,t/.26),e=eIn(k),px=x+q.ox+Math.cos(q.a)*64*(1-e),py=y-q.oz+Math.sin(q.a)*38*(1-e),al=t<.26?k:Math.max(0,1-(t-.26)/(this.life-.26-q.d)),fl=t>=.26?Math.max(0,1-(t-.26)/.12):0;
      ctx.save();ctx.translate(px,py);ctx.rotate(q.r*(1-e));ctx.beginPath();for(let j=0;j<6;j++){const an=j/6*TAU;j?ctx.lineTo(Math.cos(an)*this.s,Math.sin(an)*this.s):ctx.moveTo(Math.cos(an)*this.s,Math.sin(an)*this.s);}ctx.closePath();
      ctx.fillStyle=hexA(this.col,.6*al);ctx.fill();ctx.strokeStyle=`rgba(255,255,255,${.8*al})`;ctx.lineWidth=1;ctx.stroke();if(fl>0){ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,255,255,${.8*fl})`;ctx.fill();}ctx.restore();}
    const s=(this.t-.32)/.38;if(s>0&&s<1){ctx.save();ctx.beginPath();ctx.ellipse(x,y-38,22,42,0,0,TAU);ctx.clip();ctx.globalCompositeOperation='lighter';const yy=y+10-s*100,g=ctx.createLinearGradient(x-20,yy+26,x+20,yy-26);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,hexA('#ffffff',.42*Math.sin(Math.PI*s)));g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(x-30,yy-40,60,80);ctx.restore();}
    ctx.globalCompositeOperation='source-over';}}
/* lasting buff: two slow arcs on the ground under the feet + particles rising while the buff is up */
class BuffAura{constructor(o){Object.assign(this,{t:0,layer:'ground',buff:'',col:'#e0904a',R:28,kind:'ember',rate:12},o);}
  update(dt){this.t+=dt;if(Math.random()<dt*this.rate*Q.p){const an=rnd(0,TAU),r=rnd(8,this.R*.8),x=player.x+Math.cos(an)*r,y=player.y+Math.sin(an)*r*.7;
      if(this.kind==='mist')emit({type:'mist',x,y,z:rnd(4,20),vz:rnd(14,30),drag:1,life:rnd(.7,1.1),size:5,size1:13,color:this.col});
      else emit({type:'ember',x,y,z:rnd(4,30),vz:rnd(40,90),vx:rnd(-8,8),drag:1.6,life:rnd(.4,.7),size:rnd(1.1,2.1),size1:.2,color:Math.random()<.4?'#fff0d8':this.col});}return alive(this);}
  draw(){const a=fadeA(this)*Math.min(1,this.t/.25),[x,y]=P(player.x,player.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,hexA(this.col,.16*a));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.lineCap='round';ctx.strokeStyle=hexA(this.col,.6*a);ctx.lineWidth=2.4;for(let i=0;i<2;i++){const s=this.t*1.4+i*Math.PI;ctx.beginPath();ctx.arc(0,0,this.R,s,s+1.5);ctx.stroke();}ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* Guardian Stance: iron hexagon planted under the feet */
class FootHex{constructor(o){Object.assign(this,{t:0,layer:'ground',buff:'rhStance',R:36},o);}update(dt){this.t+=dt;return alive(this);}
  draw(){const a=fadeA(this),g=eOutBack(Math.min(1,this.t/.2)),[x,y]=P(player.x,player.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const hexp=(R,rot)=>{ctx.beginPath();for(let i=0;i<=6;i++){const an=i/6*TAU+rot;i?ctx.lineTo(Math.cos(an)*R,Math.sin(an)*R):ctx.moveTo(Math.cos(an)*R,Math.sin(an)*R);}ctx.closePath();};
    hexp(this.R*g,Math.PI/6);ctx.fillStyle=`rgba(50,64,90,${.3*a})`;ctx.fill();ctx.strokeStyle=`rgba(20,28,44,${.6*a})`;ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle=`rgba(214,228,246,${.9*a})`;ctx.lineWidth=2;ctx.stroke();
    ctx.globalCompositeOperation='lighter';hexp(this.R*.62*g,Math.PI/6-this.t*.5);ctx.strokeStyle=`rgba(160,200,255,${(.4+.15*Math.sin(this.t*4))*a})`;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* Ground Anchor: four chains shoot from the belt and spike into the ground */
class AnchorChains{constructor(o){Object.assign(this,{t:0,layer:'sorted',buff:'rhAnchor',R:34},o);}get sy(){return player.y+4;}update(dt){this.t+=dt;return alive(this);}
  draw(){const a=fadeA(this),k=eOut(Math.min(1,this.t/.14)),[bx,by]=P(player.x,player.y,30);ctx.lineCap='round';for(let i=0;i<4;i++){const an=Math.PI/4+i*Math.PI/2,[gx,gy]=P(player.x+Math.cos(an)*this.R,player.y+Math.sin(an)*this.R,0),ex=lerp(bx,gx,k),ey=lerp(by,gy,k);
      ctx.strokeStyle=`rgba(24,30,44,${.75*a})`;ctx.lineWidth=4;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle=`rgba(206,220,238,${.95*a})`;ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
      if(k>=1){ctx.fillStyle=`rgba(224,150,84,${a})`;ctx.strokeStyle=`rgba(24,30,44,${.8*a})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(gx-4,gy-7);ctx.lineTo(gx+4,gy-7);ctx.lineTo(gx,gy+3);ctx.closePath();ctx.fill();ctx.stroke();}}}}
/* Shielding Pulse: the wall's energy closes into a hex dome over the rhino */
class HexDome{constructor(o){Object.assign(this,{t:0,life:.6,layer:'top',R:40},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,g=eOut(Math.min(1,k*2.2)),a=k<.5?1:(1-k)/.5,[x,y]=P(player.x,player.y,30),R=this.R*(.55+.45*g);ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation='lighter';
    const gr=ctx.createRadialGradient(0,0,R*.5,0,0,R);gr.addColorStop(0,'rgba(150,190,240,0)');gr.addColorStop(1,`rgba(170,205,250,${.3*a})`);ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(0,0,R,R*1.12,0,0,TAU);ctx.fill();
    ctx.strokeStyle=`rgba(230,242,255,${.7*a})`;ctx.lineWidth=1.2;for(let r=0;r<3;r++)for(let i=0;i<6;i++){const an=i/6*TAU+r*.52,rr=R*(.34+r*.27),cx=Math.cos(an)*rr,cy=Math.sin(an)*rr*1.12;ctx.beginPath();for(let j=0;j<=6;j++){const b=j/6*TAU;j?ctx.lineTo(cx+Math.cos(b)*R*.15,cy+Math.sin(b)*R*.15):ctx.moveTo(cx+Math.cos(b)*R*.15,cy+Math.sin(b)*R*.15);}ctx.stroke();}
    ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,R,R*1.12,0,0,TAU);ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* Rising Uppercut: a thick column of force sweeping up through the target */
class RiseStreak{constructor(o){Object.assign(this,{t:0,life:.36,layer:'top',h:104,w:15},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,up=eOut(Math.min(1,this.t/.1)),a=Math.pow(1-k,1.1),[x,y]=P(this.x,this.y,6),H=this.h*up,w=this.w*(1-k*.5),sd=this.sd||1;ctx.save();ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(x,y,x,y-H);g.addColorStop(0,'rgba(190,220,255,0)');g.addColorStop(.35,`rgba(200,226,255,${.42*a})`);g.addColorStop(.85,`rgba(255,255,255,${.8*a})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(x-w-8*sd,y);ctx.quadraticCurveTo(x-w*.9+14*sd,y-H*.55,x+6*sd,y-H);ctx.quadraticCurveTo(x+w*.9+16*sd,y-H*.5,x+w-8*sd,y);ctx.closePath();ctx.fill();ctx.restore();ctx.globalCompositeOperation='source-over';}}
const gather=(col)=>{const w=fistW();for(let i=0;i<qn(14);i++){const an=rnd(0,TAU),r=rnd(40,60);emit({type:'spark',x:w[0]+Math.cos(an)*r,y:w[1]+Math.sin(an)*r*.6,z:w[2]+rnd(-12,22),vx:-Math.cos(an)*r*5,vy:-Math.sin(an)*r*3,vz:0,drag:2.5,g:0,life:rnd(.16,.26),size:rnd(1.2,2.2),color:Math.random()<.4?'#ffffff':col,len:.05});}};
const hook=(k,f)=>{const sk=SKILLS[k];if(!sk||!sk.make)return;const mk=sk.make;sk.make=function(c){const a=mk(c);if(a){a.events=a.events||[];try{f(a,c||{});}catch(e){}}return a;};};
const ev=(a,t,f)=>a.events.push({t:Math.max(.005,t),f});
const ring=(r1,col,o)=>addFx(new SoftRing(Object.assign({x:player.x,y:player.y,r0:10,r1,w:9,color:col||'#dfeeff',life:.45},o||{})));

hook('rhGuard',a=>ev(a,.01,()=>plates({n:3,arc:1.6,R:32,h:44,life:Math.max(.5,a.dur)})));                                   // raise the guard: three shield plates slam down in front
hook('rhSkin',a=>ev(a,a.windup,()=>{addFx(new PlateConverge({n:8}));ring(46,'#cfe0f4');}));                                  // iron skin: plates lock on, sheen runs up the body
hook('rhStance',a=>ev(a,a.windup,()=>{addFx(new FootHex({}));plates({n:2,arc:1.2,R:36,h:26,buff:'rhStance'});}));            // guardian stance: planted hex + low front plates
hook('rhPulse',a=>ev(a,a.windup,()=>{addFx(new HexDome({}));ring(64,'#bcd8ff');}));                                          // wall energy closes into a dome
hook('rhFortress',a=>ev(a,a.windup,()=>{plates({n:10,arc:TAU,R:44,h:40,cren:true,buff:'rhFortress',fixed:0});ring(90,'#dfeeff',{w:12});addFx(new SnowBurst({x:player.x,y:player.y,R:46,n:10,h:26,life:.4}));}));   // fortress: a ring of battlements
hook('rhAnchor',a=>ev(a,a.windup,()=>{addFx(new AnchorChains({}));addFx(new Fissure({x:player.x,y:player.y,r:38,life:1.4,color:'#bcd8ff'}));snowSpray(player.x,player.y,rnd(0,TAU),8,120);}));   // anchor: chains spike into the ground
hook('rhColossus',a=>ev(a,a.windup,()=>{addFx(new PlateConverge({n:13,s:8,col:'#b8c6d8',life:1.2}));addFx(new BuffAura({buff:'rhColossus',col:'#a8c0e0',kind:'mist',R:34,rate:9}));addFx(new Fissure({x:player.x,y:player.y,r:48,life:1.6,color:'#cfe0f4'}));ring(84,'#dfeeff',{w:12});}));
hook('rhFury',a=>ev(a,a.windup,()=>{addFx(new BuffAura({buff:'rhFury',col:'#e0904a',R:28,rate:16}));ring(60,'#ffb878');gather('#ffb060');}));   // fury: copper heat rising off the body
hook('rcPact',a=>ev(a,a.windup,()=>{addFx(new PlateConverge({n:9,col:'#d8706a'}));addFx(new BuffAura({buff:'rhPact',col:'#d0584e',R:26,rate:10}));}));   // ironblood: blood-red plates fuse to the armour
hook('rhRoar',a=>ev(a,a.windup,()=>addFx(new BuffAura({buff:'rhRoar',col:'#ffd890',R:26,rate:8}))));
hook('rhUppercut',(a,c)=>ev(a,a.windup,()=>{const t=c.target||(a.hitList||[])[0];if(!t)return;addFx(new RiseStreak({x:t.x,y:t.y,sd:dirSide(player.dir)}));snowSpray(t.x,t.y,-Math.PI/2,8,90);}));
for(const k of ['rhMeteor','rhRevenge'])hook(k,a=>ev(a,.02,()=>gather(k==='rhMeteor'?'#ffb060':'#ff8a70')));               // charged fist: energy drawn into the knuckles
/* Steel Wall: the wall is now five standing shield plates that flash when they block */
/* ---------- big attacks ---------- */
/* shadow + closing ring on the ground where something heavy is about to land */
class DropShadow{constructor(o){Object.assign(this,{t:0,T:.5,layer:'ground',R:60},o);this.life=this.T+.06;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=Math.min(1,this.t/this.T),e=eIn(k),[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const r=this.R*(.35+.65*e),g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(10,14,22,${.5*e})`);g.addColorStop(1,'rgba(10,14,22,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,226,180,${.55*k})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,this.R*(1.6-1.1*e),0,TAU);ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* air streaks rushing down above a falling fist */
class FallStreak{constructor(o){Object.assign(this,{t:0,T:.4,layer:'top',h:200,n:7,W:46},o);this.life=this.T+.12;this.s=[];for(let i=0;i<this.n;i++)this.s.push({dx:rnd(-1,1),l:rnd(.4,.8),o:rnd(0,1)});}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=Math.min(1,this.t/this.T),a=this.t<this.T?Math.min(1,this.t/.1):Math.max(0,1-(this.t-this.T)/.12),zc=lerp(this.h,10,eIn(k));ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const q of this.s){const z0=zc+30+q.o*60,z1=z0+this.h*q.l*.6,[x0,y0]=P(this.x+q.dx*this.W,this.y,z0),[,y1]=P(this.x,this.y,z1),g=ctx.createLinearGradient(x0,y0,x0,y1);g.addColorStop(0,`rgba(255,255,255,${.6*a})`);g.addColorStop(1,'rgba(220,235,255,0)');ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,y1);ctx.stroke();}ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* force jaws closing around a grabbed enemy */
class GripClamp{constructor(o){Object.assign(this,{t:0,life:.6,layer:'top',col:'#ffd890'},o);}update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,k=eOutBack(Math.min(1,this.t/.12)),a=this.t>this.life-.15?(this.life-this.t)/.15:1,[x,y]=P(e.x,e.y,(e.z||0)+(e.boss?40:24)),R=(e.r+16)*(1.5-.5*k);ctx.save();ctx.translate(x,y);ctx.scale(1,.8);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const s of [0,Math.PI]){for(const [w,al] of [[9,.2],[3.5,.75],[1.4,1]]){ctx.strokeStyle=hexA(al>.9?'#ffffff':this.col,al*a);ctx.lineWidth=w;ctx.beginPath();ctx.arc(0,0,R,s-1.1,s+1.1);ctx.stroke();}
      for(const d of [-1,1]){const an=s+d*1.1;ctx.fillStyle=hexA('#ffffff',.9*a);ctx.beginPath();ctx.arc(Math.cos(an)*R,Math.sin(an)*R,2.6,0,TAU);ctx.fill();}}ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* steel plates of a broken fortress flying outward */
const plateBurst=(x,y,n,spd)=>{for(let i=0;i<qn(n);i++){const an=i/n*TAU+rnd(-.2,.2),s=rnd(.6,1)*spd;emit({type:'rock',x:x+Math.cos(an)*30,y:y+Math.sin(an)*30,z:rnd(14,46),vx:Math.cos(an)*s,vy:Math.sin(an)*s,vz:rnd(120,260),g:620,drag:.9,bounce:.3,life:rnd(.8,1.2),size:rnd(4,7),color:Math.random()<.5?'#8ea6c8':'#c8d6e8',vr:rnd(-12,12)});}};
/* every falling giant fist gets a landing shadow and downward air streaks */
{const GF=GiantFist;GiantFist=class extends GF{constructor(o){super(o);if(this.mode==='drop'&&(this.z0||0)>=60&&this.hitT>.08){addFx(new DropShadow({x:this.x,y:this.y,T:this.hitT,R:(this.sc||.4)*150}));addFx(new FallStreak({x:this.x,y:this.y,T:this.hitT,h:this.z0}));}}};}

hook('rhSkybreaker',(a,c)=>{const gx=c.gx??player.x+Math.cos(player.phi)*120,gy=c.gy??player.y+Math.sin(player.phi)*120,tL=a.windup,u=a.update;let acc=0;
  ev(a,.05,()=>addFx(new DropShadow({x:gx,y:gy,T:tL-.05,R:70})));
  a.update=function(a2,dt){u&&u(a2,dt);if(a2.t>.05&&a2.t<tL){acc+=dt;if(acc>.03){acc=0;const w=fistW();emit({type:'mist',x:w[0],y:w[1],z:w[2],vz:-20,drag:2,life:.35,size:5,size1:12,color:'#ffd0a0'});}}};
  ev(a,tL,()=>{addFx(new SnowBurst({x:gx,y:gy,R:66,n:14,h:58}));setFxTimer(.1,()=>addFx(new SnowBurst({x:gx,y:gy,R:120,n:16,h:32,life:.5})));snowSpray(gx,gy,rnd(0,TAU),14,200);});});
hook('rhWorldbreaker',(a,c)=>{const gx=c.gx,gy=c.gy,tL=a.windup,u=a.update;let acc=0,tC=0;for(const e of a.events)if(e.t>.8&&e.t<tL-.05){tC=e.t;break;}
  a.update=function(a2,dt){u&&u(a2,dt);if(a2.t<(tC||tL*.6)){acc+=dt;if(acc>.12){acc=0;gather('#ffb060');const an=rnd(0,TAU);emit({type:'dust',x:player.x+Math.cos(an)*60,y:player.y+Math.sin(an)*40,z:2,vx:-Math.cos(an)*90,vy:-Math.sin(an)*60,drag:2,life:.5,size:5,size1:9,color:'#e6ecf2'});}}};
  ev(a,(tC||tL*.6),()=>addFx(new DropShadow({x:gx,y:gy,T:tL-(tC||tL*.6),R:110})));
  [90,140,190].forEach((r,i)=>ev(a,tL+i*.18,()=>{addFx(new SnowBurst({x:gx,y:gy,R:r*.85,n:12+i*4,h:64-i*14,life:.55}));if(!i)snowSpray(gx,gy,rnd(0,TAU),18,240);}));});
hook('rhFinale',(a,c)=>{const t=c.target||(a.hitList||[])[0];if(!t)return;const x=t.x,y=t.y;ev(a,a.windup,()=>{addFx(new SnowBurst({x,y,R:60,n:13,h:54}));setFxTimer(.1,()=>addFx(new SnowBurst({x,y,R:104,n:15,h:30,life:.5})));snowSpray(x,y,rnd(0,TAU),12,190);});});
hook('rcGrip',(a,c)=>{const t=c.target;if(!t)return;ev(a,a.windup,()=>{if(t.dead)return;if(t.boss){addFx(new GripClamp({e:t,life:.3,col:'#cfd6e0'}));return;}addFx(new GripClamp({e:t,life:.62}));
  setFxTimer(.5,()=>{if(!t.dead)addFx(new FallStreak({x:t.x,y:t.y,T:.14,h:140,n:5,W:20}));});setFxTimer(.67,()=>{if(t.dead)return;addFx(new SnowBurst({x:t.x,y:t.y,R:46,n:11,h:44}));snowSpray(t.x,t.y,rnd(0,TAU),10,160);});});});
hook('rhAbsolute',a=>{const tS=a.windup,G=1.2;let pl=null;
  ev(a,.03,()=>{if(typeof vfxArt==='function'&&vfxArt('fortress'))return;pl=plates({n:10,arc:TAU,R:42,h:52,cren:true,fixed:0,life:tS+.05});});
  ev(a,G,()=>{if(pl)for(const p of pl)p.flash=1;});
  ev(a,tS,()=>{if(pl)for(const p of pl)p.life=p.t;plateBurst(player.x,player.y,14,260);addFx(new SnowBurst({x:player.x,y:player.y,R:80,n:16,h:60}));setFxTimer(.12,()=>addFx(new SnowBurst({x:player.x,y:player.y,R:150,n:18,h:34,life:.55})));});});
hook('rcGlacier',a=>ev(a,a.dur-.15,()=>addFx(new SnowBurst({x:player.x,y:player.y,R:40,n:10,h:40,life:.5}))));
/* ---- painted sprite sheets from Game Mellow VFX Lab (assets/skill-vfx/rhino/*.png) — added on top, nothing replaced ---- */
const RH_SHEETS={ground_erupt:{n:23,cols:8,fps:15,fw:256,ax:.5,ay:.6},  // rock slabs heave + snow dust (Earthshaker, Seismic, Fortress Quake)
  roar_wind:{n:12,cols:8,fps:15,fw:256,ax:.5,ay:.5},                    // radial wind streaks + blown snow (Battle Roar)
  charge_dust:{n:16,cols:8,fps:15,fw:256,ax:.5,ay:.6}};                 // snow kicked back at the start of a charge (spray points -x)
const RHI={};for(const k in RH_SHEETS){const im=new Image();im.src='assets/skill-vfx/rhino/'+k+'.png';RHI[k]=im;}
class RhSheet{constructor(o){Object.assign(this,{t:0,layer:'top',z:0,s:.5,speed:1,alpha:1,rot:0},o);this.m=RH_SHEETS[this.key];this.life=this.m.n/this.m.fps/this.speed;if(this.layer==='sorted')this.sy0=this.y+(this.sortOff||2);}
  get sy(){return this.sy0;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const im=RHI[this.key];if(!im.complete||!im.naturalWidth)return;const m=this.m,f=Math.min(m.n-1,Math.floor(this.t*this.speed*m.fps)),[x,y]=P(this.x,this.y,this.z),W=m.fw*this.s,fade=Math.min(1,(this.life-this.t)/.15);
    ctx.save();ctx.globalAlpha=this.alpha*fade;ctx.translate(x,y);if(this.rot)ctx.rotate(this.rot);ctx.drawImage(im,(f%m.cols)*m.fw,Math.floor(f/m.cols)*m.fw,m.fw,m.fw,-W*m.ax,-W*m.ay,W,W);ctx.restore();ctx.globalAlpha=1;}}
const rhSheet=o=>addFx(new RhSheet(o));
let rhLastQuake=null;
/* wolf-style painted texture (assets_vfx.js) blended under the Lab sheets: a painted ground crack that settles and fades (normal blend, no glow) */
class RhCrackTex{constructor(o){Object.assign(this,{t:0,life:1.4,layer:'ground',R:90,k:Math.random()<.5?'crack_frost':'crack_frost2',rot:rnd(0,TAU)},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(typeof drawV!=='function')return;const k=this.t/this.life,g=eOut(Math.min(1,this.t/.12)),a=(k<.6?1:(1-k)/.4)*.8,[x,y]=P(this.x,this.y),S=this.R*2.4*(.6+.4*g);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.rot);drawV(this.k,0,0,S,S,{alpha:a});ctx.restore();}}
/* Battle Roar: wind pressure blown out from the rhino */
try{const _RW=RoarWave;RoarWave=class extends _RW{constructor(o){super(o);rhSheet({key:'roar_wind',x:player.x,y:player.y,z:34*CHAR_SCALE,s:.75,speed:1});}};}catch(e){}
/* charges: snow kicked back behind the feet */
{const _c2=rhCharge;rhCharge=function(o){
  /* wolf-style painted bronze brush crescent on the charge impact */
  if(o.onHit&&typeof TexArc==='function'){const oh=o.onHit;o.onHit=function(a,e){oh(a,e);addFx(new TexArc({x:e.x,y:e.y,z:(e.boss?34:26),R:e.boss?62:48,mid:o.phi,dir:1,pal:'bronze',life:.45,sweep:.08,squash:.6}));};}
  const a=_c2(o);if(a){const sx=player.x,sy=player.y,ang=Math.atan2(Math.sin(o.phi)*K,Math.cos(o.phi));a.events=a.events||[];a.events.push({t:Math.max(.005,(a.windup||0)*.5),f:()=>rhSheet({key:'charge_dust',x:sx,y:sy,z:4,s:.45,speed:1.2,rot:ang})});}return a;};}
/* ---- wolf-style painted brush crescents for every punch ----
   1) the procedural front crescent (Knuckle, Counter, Crushing Counter, Meteor, Revenge) is drawn with the painted bronze texture
   2) the other punch skills get a painted crescent on the target of their last hit
   3) the heaviest finishers also leave a small painted crack under the target */
const rhArc=(x,y,z,R,phi,life=.42)=>addFx(new TexArc({x,y,z,R,mid:phi,dir:1,pal:'bronze',life,sweep:.07,squash:.6}));
if(typeof TexArc==='function'&&typeof frontArc==='function'){
  frontArc=function(o){const phi=o.phi??player.phi,off=o.off||20;rhArc(player.x+Math.cos(phi)*off,player.y+Math.sin(phi)*off,30*CHAR_SCALE,(o.R||56)*1.15,phi,Math.max(.36,(o.life||.3)+.08));};
  const OWN_ARC={rhKnuckle:1,rhCounter:1,rhCrushCounter:1,rhMeteor:1,rhRevenge:1,rhUppercut:1},
        HEAVY={rhHammer:1,rhBone:1,rhTitan:1,rhAvalanche:1,rhMeteor:1,rhRevenge:1,rhCrushCounter:1};
  const _p2=rhPunches;rhPunches=function(o){const after=o.after;
    o.after=function(a,hit,i,last){after&&after(a,hit,i,last);if(!last||!hit||!hit.length)return;const e=hit[0];if(!e)return;
      if(!OWN_ARC[o.key])rhArc(e.x,e.y,(e.boss?34:26),e.boss?60:46,o.phi);
      if(HEAVY[o.key])addFx(new RhCrackTex({x:e.x,y:e.y,R:e.boss?52:40,life:1.1}));};
    return _p2(o);};
}
/* ground slams: rock slabs heave out of the snow (+ painted crack) */
{const _s2=rhSlam,KEYS={rhShaker:.62,rhQuake:.7,rhSeismic:.75,rhRetribution:.72,rhFinale:0};rhSlam=function(o){const sc=KEYS[o.key];
  if(sc===0&&o.impact){const imp=o.impact;o.impact=function(a,x,y){addFx(new RhCrackTex({x,y,R:110}));imp(a,x,y);};}
  if(sc){const imp=o.impact;o.impact=function(a,x,y){
    if(o.key==='rhSeismic'){const q=rhLastQuake&&gameTime-rhLastQuake.t<3?rhLastQuake:{x,y};setFxTimer(.16,()=>rhSheet({key:'ground_erupt',x:q.x,y:q.y,layer:'sorted',sortOff:6,s:sc,speed:1.1}));}
    else{rhLastQuake={x,y,t:gameTime};addFx(new RhCrackTex({x,y,R:sc*150}));rhSheet({key:'ground_erupt',x,y,layer:'sorted',sortOff:6,s:sc,speed:1.15});}
    imp(a,x,y);};}return _s2(o);};}
/* ---- SVG VFX (svg_vfx.js) ---- */
if(window.svgFx){
  /* Iron Skin: honeycomb steel plates clamp over the body (follows + mirrors with facing), then a second faint sheen */
  hook('rhSkin',a=>ev(a,Math.max(.05,a.windup||.25),()=>{const o={follow:player,z:34*CHAR_SCALE,s:.36,layer:'sorted',sortOff:3,grow:[1.18,1],growT:.16,fadeIn:.05,fadeOut:.45,flip:dirSide(player.dir)};
    svgFx('steel_plates',Object.assign({},o,{life:.9,alpha:.95}));setFxTimer(.5,()=>svgFx('steel_plates',Object.assign({},o,{life:.6,alpha:.45,grow:[1,1.04],flip:dirSide(player.dir)})));}));
  /* Titan's Fury: ember flame tongues rising behind the shoulders for the whole buff, flickering, mirrored with facing */
  class FuryAura{constructor(){this.t=0;this.layer='sorted';}get sy(){return player.y-1;}
    update(dt){this.t+=dt;const on=hasBuff('rhFury');if(!on&&this.endT==null)this.endT=this.t;if(on)this.endT=null;return on||this.t-this.endT<.4;}
    draw(){const im=svgImg('fury_flames');if(!im)return;const t=this.t,a=Math.min(1,t/.25)*(this.endT==null?1:Math.max(0,1-(t-this.endT)/.4))*.72,[x,y]=P(player.x,player.y,(player.z||0)+30*CHAR_SCALE),
        fl=1+.07*Math.sin(t*11)+.04*Math.sin(t*23),W=128*.66,H=192*.62*fl;if(a<=0)return;
      ctx.save();ctx.translate(x,y);ctx.scale(dirSide(player.dir),1);ctx.globalAlpha=a;ctx.drawImage(im,-W/2,-H*.95,W,H);ctx.restore();ctx.globalAlpha=1;}}
  hook('rhFury',a=>ev(a,Math.max(.05,a.windup||.3),()=>{if(!fx.some(f=>f instanceof FuryAura))addFx(new FuryAura());}));
}
try{SteelWallObj.prototype.draw=function(){const a=Math.min(1,this.t/.18)*(this.t>this.life-.2?Math.max(0,(this.life-this.t)/.2):1),n=5,arc=1.9,st=arc/n;for(let i=0;i<n;i++){const an0=player.phi-arc/2+i*st+.04,kd=clamp((this.t-i*.03)/.16,0,1);if(kd<=0)continue;plate(player.x,player.y,an0,an0+st-.08,46,56,(1-eOutBack(kd))*46,a,this.flash);}};}catch(e){}
})();
