/* =====================================================================
   TOTEM LEGEND — Toon VFX layer (TV) · owner 2026-11-19
   One painted picture alone looks flat. Every painted skill piece now goes through TV.Piece,
   which wraps the picture in a cartoon effect life cycle, the way hand-made 2D game VFX are built:

     1. ANTICIPATION  pieces with a delay pull small particles in toward where they will appear
     2. POP           scale with overshoot (back-out) + squash & stretch, a white silhouette flash
                      on the first frames, a soft additive glow behind
     3. SECONDARY     by placement type:
                        ground  → cartoon shockwave ring with a dark outline, rim puffs, ground glow
                        stand   → rises from the ground (stretch), base ring, sparkles drifting up
                        streak  → speed lines, afterimages, a particle trail, end burst
                        hit     → comic spiky impact star, small ring, outlined bits flying out
                        aura    → orbiting / rising sparkles while it lasts
     4. DISSOLVE      on exit the picture breaks into outlined particles sampled from its own
                      pixels (colour and shape of the art), then they fall / float away

   Cartoon particles have a dark outline and 2 flat tones (dot, star, drop, petal, puff, zig,
   rock, wisp, line) to match the hand-painted chibi art — no soft photo smoke.
   The particle kind and colours come from the picture itself (its average hue), and a hero can
   hint a piece ('water', 'fire', 'electric', 'sand', 'stone', 'shadow', 'gold', 'light', 'nature').

   Use in a hero file:  addFx(new TV.Piece({img:dxImg, hero:'dragon', n:'water_fist', ...}))
   Same options as the old per-hero XxImg classes (n x y z w ax ay rot fy s0 s1 a0 fadeIn fadeOut
   glow delay sortOff pulse spin speed phi follow fx0 fy0 hold while until layer life).
   ===================================================================== */
(function(){
const TV={hints:{},quality:1,bitScale:1.85};
const OUT='#3a2418';
const clamp01=v=>v<0?0:v>1?1:v;
const backOut=k=>{const c1=1.25,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);};
const qN=n=>Math.max(1,Math.round(n*.75*((typeof Q!=='undefined'&&Q.p)?Math.min(1,Q.p+.25):1)*TV.quality));
/* ---------- colour helpers ---------- */
function hx(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)];}
function rgb(a){return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mix(a,b,t){const A=hx(a),B=hx(b);return rgb(A.map((v,i)=>v+(B[i]-v)*t));}
function rgba(c,a){const A=hx(c);return `rgba(${A[0]},${A[1]},${A[2]},${a})`;}
function hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return [h,s,l];}

/* ---------- per-picture data: palette, element, white silhouette, pixel samples ---------- */
function info(im){if(im._tv)return im._tv;const W=48,H=Math.max(8,Math.round(48*im.naturalHeight/im.naturalWidth));
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(im,0,0,W,H);let d;
  try{d=g.getImageData(0,0,W,H).data;}catch(e){d=null;}
  const pts=[];let sr=0,sg=0,sb=0,n=0,sat=[0,0,0,0];const hues=[];
  if(d)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i+3]<140)continue;const r=d[i],gg=d[i+1],b=d[i+2];pts.push([x/W,y/H,rgb([r,gg,b])]);
    const [h,s,l]=hsl(r,gg,b);if(s>.35&&l>.25&&l<.85){sr+=r;sg+=gg;sb+=b;n++;hues.push(h);}}
  let main=n?rgb([sr/n,sg/n,sb/n]):'#ffd36a';
  /* the picture's own colours: the two biggest hue groups (12 buckets), averaged */
  const B={};if(d)for(let i=0;i<d.length;i+=4){if(d[i+3]<160)continue;const [h2,s2,l2]=hsl(d[i],d[i+1],d[i+2]);if(s2<.3||l2<.22||l2>.9)continue;const k=Math.floor(h2/30)%12;(B[k]=B[k]||[0,0,0,0]);B[k][0]+=d[i];B[k][1]+=d[i+1];B[k][2]+=d[i+2];B[k][3]++;}
  const top=Object.values(B).sort((a,b)=>b[3]-a[3]).slice(0,2).map(v=>rgb([v[0]/v[3],v[1]/v[3],v[2]/v[3]]));
  const cols=top.length?top.slice():[main];if(cols.length<2)cols.push(mix(cols[0],'#ffffff',.3));cols.push(mix(cols[0],'#ffffff',.65));const [h,s,l]=hsl(...hx(main));
  /* white silhouette for the flash frames */
  const wc=document.createElement('canvas');wc.width=im.naturalWidth;wc.height=im.naturalHeight;const wg=wc.getContext('2d');wg.drawImage(im,0,0);wg.globalCompositeOperation='source-in';wg.fillStyle='#ffffff';wg.fillRect(0,0,wc.width,wc.height);
  const light=mix(main,'#ffffff',.55),dark=mix(main,OUT,.55);
  let el=s<.25?'light':(h<20||h>=330)?'fire':h<50?(l<.55?'sand':'gold'):h<70?'gold':h<165?'nature':h<255?'water':h<300?'shadow':'fire';
  im._tv={pal:{main,light,dark,hue:h},cols,el,white:wc,pts:pts.length>420?pts.filter((_,i)=>i%Math.ceil(pts.length/420)===0):pts};return im._tv;}
TV.info=info;

/* element → particle kinds + extra colours */
const ELEM={
  water:{bits:['drop','drop','dot','puff'],cols:['#4aa8ff','#bfe8ff','#ffffff'],ring:'#7ad0ff'},
  fire:{bits:['petal','dot','star'],cols:['#ff6a8a','#ffb070','#fff0c0'],ring:'#ff8ab0'},
  electric:{bits:['zig','star','dot'],cols:['#9adcff','#ffffff','#fff27a'],ring:'#bfe8ff'},
  sand:{bits:['puff','dot','rock'],cols:['#e8c87a','#f6e2b0','#c89a50'],ring:'#f0d890'},
  stone:{bits:['rock','puff','dot'],cols:['#f2ece0','#d8cfc0','#e8c87a'],ring:'#fff2c8'},
  shadow:{bits:['wisp','star','dot'],cols:['#a46ae8','#e0c0ff','#ffd36a'],ring:'#c89aff'},
  gold:{bits:['star','dot','star'],cols:['#ffd36a','#fff2b8','#ffffff'],ring:'#ffe9a0'},
  light:{bits:['star','dot'],cols:['#ffffff','#e8f0ff','#ffe9a8'],ring:'#ffffff'},
  nature:{bits:['leaf','dot','star'],cols:['#8fe07a','#e8ffb0','#ffffff'],ring:'#c8f0a0'},
};
TV.hint=(hero,map)=>{TV.hints[hero]=Object.assign(TV.hints[hero]||{},map);};
const elemOf=(o,inf)=>(TV.hints[o.hero]&&TV.hints[o.hero][o.n])||o.el||inf.el;

/* =====================================================================
   PARTICLES (screen-projected space, so they don't need world math)
   ===================================================================== */
class Bit{
  constructor(o){Object.assign(this,{t:0,life:.6,layer:'top',x:0,y:0,vx:0,vy:0,g:0,drag:1.5,size:4,size1:null,rot:Math.random()*6.28,vr:0,col:'#ffd36a',kind:'dot',floor:null,grow:0,fadeIn:.05,alpha:1},o);
    this.size*=TV.bitScale;if(this.size1!=null)this.size1*=TV.bitScale;
    if(this.size1==null)this.size1=this.size*.35;this.light=this.light||mix(this.col,'#ffffff',.55);this.dark=this.dark||mix(this.col,OUT,.6);}
  update(dt){this.t+=dt;const d=Math.exp(-this.drag*dt);this.vx*=d;this.vy=this.vy*d+this.g*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.rot+=this.vr*dt;
    if(this.floor!=null&&this.y>this.floor){this.y=this.floor;this.vy=-this.vy*.25;this.vx*=.6;this.vr*=.5;if(Math.abs(this.vy)<20){this.vy=0;this.g=0;}}
    return this.t<this.life;}
  draw(){const k=this.t/this.life,a=this.alpha*Math.min(1,this.t/this.fadeIn)*(k<.65?1:(1-k)/.35);if(a<=.01)return;
    const r=this.size+(this.size1-this.size)*k+this.grow*Math.sin(Math.PI*k);ctx.save();ctx.globalAlpha=a;ctx.translate(this.x,this.y);ctx.rotate(this.rot);
    ctx.lineJoin='round';ctx.lineCap='round';const lw=Math.max(1.6,r*.36);
    switch(this.kind){
      case 'dot':ctx.fillStyle=this.col;ctx.strokeStyle=this.dark;ctx.lineWidth=lw;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.fill();ctx.stroke();
        ctx.fillStyle=this.light;ctx.beginPath();ctx.arc(-r*.3,-r*.3,r*.35,0,6.283);ctx.fill();break;
      case 'star':{ctx.fillStyle=this.light;ctx.strokeStyle=this.col;ctx.lineWidth=lw;ctx.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.38:r*1.25,an=i*Math.PI/4;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();ctx.fill();ctx.stroke();break;}
      case 'drop':{const sp=Math.hypot(this.vx,this.vy);ctx.rotate(-this.rot+(sp>20?Math.atan2(this.vy,this.vx):1.57));ctx.fillStyle=this.col;ctx.strokeStyle=this.dark;ctx.lineWidth=lw;
        ctx.beginPath();ctx.moveTo(r*1.8,0);ctx.quadraticCurveTo(r*.2,-r*1.05,-r,0);ctx.quadraticCurveTo(r*.2,r*1.05,r*1.8,0);ctx.fill();ctx.stroke();
        ctx.fillStyle=this.light;ctx.beginPath();ctx.ellipse(-r*.2,-r*.25,r*.35,r*.2,0,0,6.283);ctx.fill();break;}
      case 'petal':ctx.fillStyle=this.col;ctx.strokeStyle=this.dark;ctx.lineWidth=lw*.8;ctx.beginPath();ctx.ellipse(0,0,r*1.3,r*.6,0,0,6.283);ctx.fill();ctx.stroke();
        ctx.strokeStyle=this.light;ctx.lineWidth=lw*.6;ctx.beginPath();ctx.moveTo(-r*.8,0);ctx.lineTo(r*.8,0);ctx.stroke();break;
      case 'leaf':ctx.fillStyle=this.col;ctx.strokeStyle=this.dark;ctx.lineWidth=lw*.8;ctx.beginPath();ctx.moveTo(-r*1.4,0);ctx.quadraticCurveTo(0,-r,r*1.4,0);ctx.quadraticCurveTo(0,r,-r*1.4,0);ctx.fill();ctx.stroke();break;
      case 'puff':{ctx.fillStyle=this.light;ctx.strokeStyle=this.col;ctx.lineWidth=lw*.7;for(const [px,py,pr] of [[-r*.55,r*.15,.7],[r*.5,r*.2,.65],[0,-r*.25,.85]]){ctx.beginPath();ctx.arc(px,py,r*pr,0,6.283);ctx.fill();ctx.stroke();}
        ctx.fillStyle=this.light;for(const [px,py,pr] of [[-r*.55,r*.15,.7],[r*.5,r*.2,.65],[0,-r*.25,.85]]){ctx.beginPath();ctx.arc(px,py,r*pr*.82,0,6.283);ctx.fill();}break;}
      case 'rock':ctx.fillStyle=this.col;ctx.strokeStyle=this.dark;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(-r,-r*.3);ctx.lineTo(-r*.2,-r);ctx.lineTo(r,-r*.45);ctx.lineTo(r*.75,r*.7);ctx.lineTo(-r*.6,r*.8);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle=this.light;ctx.beginPath();ctx.moveTo(-r*.6,-r*.3);ctx.lineTo(-r*.15,-r*.7);ctx.lineTo(r*.4,-r*.4);ctx.closePath();ctx.fill();break;
      case 'zig':{ctx.rotate(-this.rot+this.rot*.2);ctx.strokeStyle=this.col;ctx.lineWidth=lw*2.2;ctx.beginPath();ctx.moveTo(-r*1.6,-r*.4);ctx.lineTo(-r*.3,r*.3);ctx.lineTo(r*.2,-r*.4);ctx.lineTo(r*1.6,r*.4);ctx.stroke();
        ctx.strokeStyle='#ffffff';ctx.lineWidth=lw;ctx.stroke();break;}
      case 'wisp':{ctx.fillStyle=this.col;ctx.globalAlpha=a*.85;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.fill();ctx.strokeStyle=this.dark;ctx.lineWidth=lw*.7;ctx.stroke();
        ctx.globalAlpha=a*.5;ctx.beginPath();ctx.arc(-this.vx*.03,-this.vy*.03,r*.7,0,6.283);ctx.fill();ctx.fillStyle=this.light;ctx.globalAlpha=a;ctx.beginPath();ctx.arc(-r*.25,-r*.3,r*.3,0,6.283);ctx.fill();break;}
      case 'line':{ctx.rotate(-this.rot+Math.atan2(this.vy,this.vx));const L=r*4*(1-k*.5);ctx.strokeStyle=this.light;ctx.lineWidth=Math.max(1.2,r*.45);ctx.beginPath();ctx.moveTo(-L,0);ctx.lineTo(L*.3,0);ctx.stroke();break;}
    }
    ctx.restore();ctx.globalAlpha=1;}}
TV.Bit=Bit;
const bit=o=>addFx(new Bit(o));

/* cartoon shockwave ring on the ground (projected ellipse, dark outline + light inner edge) */
class Ring{constructor(o){Object.assign(this,{t:0,life:.42,layer:'ground',x:0,y:0,r0:10,r1:90,w:10,col:'#ffd36a',spikes:0,delay:0},o);this.t=-this.delay;this.dark=mix(this.col,OUT,.55);this.light=mix(this.col,'#ffffff',.6);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=clamp01(this.t/this.life),e=1-Math.pow(1-k,3),r=this.r0+(this.r1-this.r0)*e,w=Math.max(1,this.w*(1-k*.85)),a=k<.7?1:(1-k)/.3;
    ctx.save();ctx.translate(this.x,this.y);ctx.scale(1,K);ctx.globalAlpha=a;ctx.lineCap='round';
    ctx.strokeStyle=this.dark;ctx.lineWidth=w+3;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke();
    ctx.strokeStyle=this.col;ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle=this.light;ctx.lineWidth=Math.max(1,w*.35);ctx.beginPath();ctx.arc(0,0,r-w*.15,0,6.283);ctx.stroke();
    if(this.spikes){ctx.strokeStyle=this.light;ctx.lineWidth=Math.max(1.5,w*.5);for(let i=0;i<this.spikes;i++){const an=i/this.spikes*6.283+.3;ctx.beginPath();ctx.moveTo(Math.cos(an)*(r+w),Math.sin(an)*(r+w));ctx.lineTo(Math.cos(an)*(r+w+14*(1-k)),Math.sin(an)*(r+w+14*(1-k)));ctx.stroke();}}
    ctx.restore();ctx.globalAlpha=1;}}
TV.Ring=Ring;

/* soft additive glow pool (ground) or halo (top) */
class Glow{constructor(o){Object.assign(this,{t:0,life:.5,layer:'ground',x:0,y:0,r:80,col:'#ffd36a',a0:.55,flat:true,follow:null,hold:null,fx0:0,fy0:0},o);}
  update(dt){this.t+=dt;if(this.follow){const [x,y]=P(this.follow.x,this.follow.y,0);this.x=x+this.fx0;this.y=y+this.fy0;}if(this.hold&&this.hold())this.t=Math.min(this.t,this.life*.6);return this.t<this.life;}
  draw(){const k=this.t/this.life,a=this.a0*(k<.2?k/.2:k<.6?1:(1-k)/.4);if(a<=.01)return;ctx.save();ctx.translate(this.x,this.y);if(this.flat)ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,0,0,0,this.r);g.addColorStop(0,rgba(this.col,a));g.addColorStop(.5,rgba(this.col,a*.4));g.addColorStop(1,rgba(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.r,0,6.283);ctx.fill();ctx.restore();}}
TV.Glow=Glow;
/* contact: dark soft shadow + a coloured light pool on the ground under an upright piece, so it stands IN the world */
class Contact{constructor(o){Object.assign(this,{t:0,life:.6,layer:'ground',host:null,w:80,col:'#ffd36a'},o);}
  update(dt){this.t+=dt;const h=this.host;if(h){this.alive=h.t<h.life&&(!h.gone);if(!this.alive)this.life=Math.min(this.life,this.t+.2);}return this.t<this.life;}
  draw(){const h=this.host;if(!h||h.t<0)return;const [x,y]=P(h.x,h.y,0),k=this.t/this.life,a=Math.min(1,this.t/.08)*(this.alive?1:Math.max(0,1-(this.t-(this.life-.2))/.2)),r=this.w*.42;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a*.32;ctx.fillStyle='#1a1008';ctx.beginPath();ctx.ellipse(0,0,r*.85,r*.85,0,0,6.283);ctx.fill();
    ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,r*1.5);g.addColorStop(0,rgba(this.col,.35*a));g.addColorStop(1,rgba(this.col,0));ctx.fillStyle=g;ctx.globalAlpha=1;ctx.beginPath();ctx.arc(0,0,r*1.5,0,6.283);ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
TV.Contact=Contact;

/* comic impact star (spiky white burst with a coloured outline) */
class Burst{constructor(o){Object.assign(this,{t:0,life:.2,layer:'top',x:0,y:0,r:30,col:'#ffd36a',n:9,rot:Math.random()*6.28},o);this.j=[];for(let i=0;i<this.n*2;i++)this.j.push(.75+Math.random()*.5);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,s=k<.35?backOut(k/.35):1+k*.15,a=k<.5?1:(1-k)/.5;ctx.save();ctx.globalAlpha=a;ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.lineJoin='round';
    const path=sc=>{ctx.beginPath();for(let i=0;i<this.n*2;i++){const an=i/(this.n*2)*6.283,rr=(i%2?this.r*.42:this.r*this.j[i])*s*sc;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();};
    path(1);ctx.fillStyle=this.col;ctx.fill();ctx.strokeStyle=mix(this.col,OUT,.5);ctx.lineWidth=2.5;ctx.stroke();path(.62);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
TV.Burst=Burst;

/* =====================================================================
   SPAWNERS
   ===================================================================== */
function scatter(x,y,o){const E=ELEM[o.el]||ELEM.gold,n=qN(o.n||8);
  for(let i=0;i<n;i++){const kind=o.kind||E.bits[i%E.bits.length],an=o.dir!=null?o.dir+(Math.random()-.5)*(o.spread||1.2):Math.random()*6.283,sp=(o.v0||60)+Math.random()*((o.v1||200)-(o.v0||60)),
    C=o.cols||E.cols,col=o.col&&Math.random()<.5?o.col:C[i%C.length];
    bit({kind,x:x+(Math.random()-.5)*(o.jx||8),y:y+(Math.random()-.5)*(o.jy||6),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*(o.flat?K:1)-(o.up||0),g:o.g??(kind==='wisp'||kind==='star'?-20:kind==='puff'?-30:380),
      drag:o.drag??(kind==='puff'?3:1.6),life:(o.life||.6)*(.7+Math.random()*.6),size:(o.size||4)*(.7+Math.random()*.6),vr:(Math.random()-.5)*10,col,floor:o.floor??null,grow:kind==='puff'?(o.size||4)*.8:0,layer:o.layer||'top'});}}
TV.scatter=scatter;
TV.ring=o=>addFx(new Ring(o));TV.glow=o=>addFx(new Glow(o));TV.burst=o=>addFx(new Burst(o));

/* =====================================================================
   THE PIECE — a painted picture with the full life cycle
   ===================================================================== */
class Piece{
  constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',x:0,y:0,z:0,w:120,ax:.5,ay:.5,rot:0,fy:false,s0:.9,s1:1.04,a0:1,fadeIn:.05,fadeOut:.45,glow:0,delay:0,sortOff:0,pulse:0,spin:0,speed:0,phi:0,until:0,fx0:0,fy0:0,trail:[],emitT:0,born:false,gone:false},o);
    this.t=-this.delay;this.type=o.type||(this.layer==='ground'?'ground':this.speed?'streak':(this.fadeIn<=.002&&this.life<.5)?'hit':(this.follow===player&&this.life>1.2)?'aura':this.ay>=.85?'stand':'float');
    if(this.delay>.06&&this.type!=='hit')this.anticipate();}
  get sy(){return this.y+this.sortOff;}
  im(){return this.img?this.img(this.n):null;}
  scr(){return P(this.x,this.y,this.z);}
  anticipate(){const im=this.im();if(!im)return;const inf=info(im),E=ELEM[elemOf(this,inf)]||ELEM.gold,[x,y]=this.scr(),n=qN(7),T=this.delay;
    for(let i=0;i<n;i++){const an=Math.random()*6.283,R=40+Math.random()*30;bit({kind:E.bits[i%E.bits.length]==='rock'?'dot':E.bits[i%E.bits.length],x:x+Math.cos(an)*R,y:y-20+Math.sin(an)*R*.7,vx:-Math.cos(an)*R/T*.9,vy:-Math.sin(an)*R*.7/T*.9,drag:0,g:0,life:T,size:3,size1:1.5,col:(inf.cols||E.cols)[i%3],fadeIn:T*.4});}}
  update(dt){this.t+=dt;if(this.t<0)return true;
    const f=this.follow;if(f){if(f.dead&&f!==player){this.hold=null;this.while=null;}else{this.x=f.x+this.fx0;this.y=f.y+this.fy0;}}
    if(this.speed){this.x+=Math.cos(this.phi)*this.speed*dt;this.y+=Math.sin(this.phi)*this.speed*dt;}
    if(this.until&&gameTime<this.until-this.life*this.fadeOut)this.t=Math.min(this.t,this.life*(1-this.fadeOut));
    if(this.while&&!this.while())this.until=0;
    if(this.hold&&this.hold())this.t=Math.min(this.t,this.life*(1-this.fadeOut));
    const im=this.im();if(!im)return this.t<this.life;const inf=info(im),el=elemOf(this,inf),E=ELEM[el]||ELEM.gold;
    if(!this.born){this.born=true;this.spawnFx(inf,el,E);}
    /* while alive */
    this.emitT-=dt;const [sx,sy]=this.scr();
    if(this.type==='streak'){this.trail.unshift([sx,sy]);if(this.trail.length>5)this.trail.length=5;
      if(this.emitT<=0){this.emitT=.035;const back=this.phi+Math.PI,bx=sx+Math.cos(back)*this.w*.35,by=sy+Math.sin(back)*this.w*.35*K;
        scatter(bx,by,{cols:inf.cols,el,n:2,dir:back,spread:.6,v0:30,v1:90,life:.45,size:3.2,g:el==='sand'||el==='stone'?-10:60});
        bit({kind:'line',x:bx,y:by-Math.random()*16+8,vx:Math.cos(back)*240,vy:Math.sin(back)*240*K,drag:4,life:.22,size:4,col:(inf.cols||E.cols)[2]});}}
    else if(this.type==='aura'&&this.emitT<=0){this.emitT=.14;const an=Math.random()*6.283,r=this.w*.35;
      bit({kind:E.bits[0]==='rock'||E.bits[0]==='drop'?'star':E.bits[0],x:sx+Math.cos(an)*r,y:sy+Math.sin(an)*r*K*.6,vx:0,vy:-40-Math.random()*40,g:-10,drag:1,life:.9,size:3.2,col:(inf.cols||E.cols)[(Math.random()*3)|0]});}
    else if(this.type==='stand'&&this.life>.45&&this.emitT<=0&&this.t<this.life*.8){this.emitT=.08;const r=this.w*.38;
      bit({kind:E.bits[1]==='puff'?'dot':E.bits[(Math.random()*2)|0]==='rock'?'dot':E.bits[(Math.random()*2)|0],x:sx+(Math.random()-.5)*r*2,y:sy-Math.random()*10,vx:(Math.random()-.5)*20,vy:-70-Math.random()*90,g:-15,drag:1.2,life:.8,size:3,col:(inf.cols||E.cols)[(Math.random()*3)|0]});}
    else if(this.type==='ground'&&this.life>1&&this.emitT<=0){this.emitT=.18;const an=Math.random()*6.283,r=this.w*.42*Math.random();
      bit({kind:E.bits[0]==='rock'?'dot':E.bits[0]==='drop'?'dot':E.bits[0],x:sx+Math.cos(an)*r,y:sy+Math.sin(an)*r*.35,vx:0,vy:-35-Math.random()*30,g:-8,drag:1,life:.8,size:2.8,col:(inf.cols||E.cols)[(Math.random()*3)|0]});}
    if(this.t>=this.life){if(!this.gone){this.gone=true;this.dissolve(inf,el,E);}return false;}
    return true;}
  spawnFx(inf,el,E){const [x,y]=this.scr(),w=this.w,rc=inf.cols?inf.cols[0]:(E.ring||inf.pal.light);
    if(this.type==='hit'){addFx(new Burst({x,y,r:w*.32,col:(inf.cols||E.cols)[0]}));scatter(x,y,{cols:inf.cols,el,n:6,v0:120,v1:280,life:.4,size:3.2,g:420});return;}
    if(this.type==='ground'){addFx(new Ring({x,y,r0:w*.12,r1:w*.55,w:Math.max(5,w*.05),col:rc,spikes:w>140?12:8,life:.45}));
      addFx(new Glow({x,y,r:w*.6,col:inf.pal.main,a0:.28,life:Math.min(1.2,Math.max(.5,this.life))}));
      scatter(x,y,{cols:inf.cols,el,n:10,v0:90,v1:220,flat:true,up:60,life:.6,size:4,floor:y+w*.18,jx:w*.4,jy:w*.15});
      if(el==='stone'||el==='sand')scatter(x,y,{cols:inf.cols,el,kind:'puff',n:5,v0:40,v1:110,flat:true,up:20,life:.7,size:7,jx:w*.5,jy:w*.15,g:-20});return;}
    if((this.type==='stand'||this.type==='aura'||this.type==='float')&&(this.z||0)<60)addFx(new Contact({host:this,w,col:(inf.cols||[inf.pal.main])[0],life:this.life+.3}));
    if(this.type==='stand'||this.type==='aura'){addFx(new Ring({x,y,r0:w*.08,r1:w*.42,w:Math.max(4,w*.04),col:rc,life:.4}));
      addFx(new Glow({x,y:y-w*.25,r:w*.55,col:inf.pal.main,a0:.25,flat:false,layer:'top',life:Math.max(.4,Math.min(1,this.life*.6))}));
      scatter(x,y,{cols:inf.cols,el,n:8,v0:60,v1:160,dir:-1.57,spread:1.1,life:.6,size:3.6,jx:w*.4,g:200});return;}
    if(this.type==='streak'){addFx(new Burst({x,y,r:w*.18,col:(inf.cols||E.cols)[1],life:.15}));scatter(x,y,{cols:inf.cols,el,n:5,dir:this.phi,spread:.5,v0:120,v1:260,life:.35,size:3});return;}
    addFx(new Glow({x,y,r:w*.5,col:inf.pal.main,a0:.28,flat:false,layer:'top',life:.4}));scatter(x,y,{cols:inf.cols,el,n:6,v0:80,v1:180,life:.5,size:3.4,g:-20});}
  dissolve(inf,el,E){if(this.type==='hit')return;const [x,y]=this.scr(),im=this.im();if(!im)return;const w=this.w*this.sc(),h=w*im.naturalHeight/im.naturalWidth,pts=inf.pts;if(!pts.length)return;
    const n=qN(Math.min(26,8+Math.round(this.w/9))),cs=Math.cos(this.rot),sn=Math.sin(this.rot),kind=E.bits[0]==='drop'?'dot':E.bits[0]==='rock'?'rock':E.bits[0];
    for(let i=0;i<n;i++){const p=pts[(Math.random()*pts.length)|0];let u=(p[0]-this.ax)*w,v=((this.fy?1-p[1]:p[1])-this.ay)*h;const px=x+u*cs-v*sn,py=y+u*sn+v*cs;
      const up=this.type==='ground'?0:1,an=Math.atan2(py-y,px-x);
      const heavy=el==='water'||el==='sand'||el==='stone'||el==='gold'||el==='nature',gy=this.type==='ground'?y+10:P(this.x,this.y,0)[1];
      bit({kind:Math.random()<.35?'dot':kind,x:px,y:py,vx:Math.cos(an)*40+(Math.random()-.5)*40,vy:Math.sin(an)*25-(heavy?20:up?30+Math.random()*30:6),g:heavy?420:-18,drag:heavy?.8:1.6,life:heavy?.7+Math.random()*.4:.5+Math.random()*.35,size:2.4+Math.random()*2.2,col:p[2],floor:heavy?gy+(Math.random()-.5)*10:null});}}
  sc(){const k=clamp01(this.t/this.life);const pop=clamp01(this.t/Math.max(.12,Math.min(.22,this.life*.3)));
    const base=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6));return this.type==='hit'?base:base*(pop<1?Math.max(.05,backOut(pop)):1);}
  draw(){if(this.t<0)return;const im=this.im();if(!im)return;const inf=info(im),k=this.t/this.life,fo=this.fadeOut;
    let a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);if(this.pulse)a*=1-this.pulse+this.pulse*(.5+.5*Math.sin(this.t*6));if(a<=.01)return;
    const [x,y]=this.scr(),s=this.sc(),w=this.w*s;let h=w*im.naturalHeight/im.naturalWidth;
    /* squash & stretch: stand pieces rise (tall then settle), ground pieces flatten in */
    let sxm=1,sym=1;const pk=clamp01(this.t/.22);
    if(this.type==='stand'||this.type==='aura'){sym=pk<1?.3+.7*backOut(pk):1;sxm=pk<1?1.25-.25*pk:1;}
    else if(this.type==='ground'){sxm=pk<1?1.15-.15*pk:1;sym=pk<1?.6+.4*backOut(pk):1;}
    const wob=this.type==='float'||this.type==='aura'?Math.sin(this.t*5)*.025:0;
    const drawIm=(src,alpha,add)=>{ctx.save();ctx.globalAlpha=alpha;if(add)ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t+wob);if(this.fy)ctx.scale(1,-1);ctx.scale(sxm,sym);
      ctx.drawImage(src,-w*this.ax,-h*this.ay,w,h);ctx.restore();};
    /* afterimages for moving pieces */
    if(this.type==='streak')for(let i=1;i<this.trail.length;i++){const [tx,ty]=this.trail[i];ctx.save();ctx.globalAlpha=a*.28*(1-i/this.trail.length);ctx.translate(tx,ty);ctx.rotate(this.rot);if(this.fy)ctx.scale(1,-1);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);ctx.restore();}
    /* soft dark halo behind the picture so pale effects still read on snow, sand and marble */
    if(FEEL.on()&&this.type!=='hit'){const hb=haloOf(im);if(hb){const f=w/im.naturalWidth;ctx.save();ctx.globalAlpha=a*.42;ctx.translate(x,y);ctx.rotate(this.rot+this.spin*this.t+wob);if(this.fy)ctx.scale(1,-1);ctx.scale(sxm,sym);
      ctx.drawImage(hb,-w*this.ax-HP*f,-h*this.ay-HP*f+3,w+2*HP*f,h+2*HP*f);ctx.restore();}}
    drawIm(im,a,false);
    if(this.glow&&k<.35)drawIm(im,this.glow*a*(1-k/.35),true);
    /* white flash on the first frames (impact frame) */
    const fl=this.type==='hit'?.9:.75,ft=this.type==='hit'?.06:.09;if(this.t<ft)drawIm(inf.white,a*fl*(1-this.t/ft),false);
    ctx.globalAlpha=1;}}
TV.Piece=Piece;

/* the same secondary effects for pictures a hero file draws itself (beams, pillars, falling suns) */
TV.fxAt=(type,x,y,w,el,o={})=>{const E=ELEM[el]||ELEM.gold,main=o.col||(o.cols?o.cols[0]:E.cols[0]);
  const fake={type,w,life:o.life||.6,phi:o.phi||0,follow:null,scr:()=>[x,y]};Piece.prototype.spawnFx.call(fake,{pal:{main,light:mix(main,'#ffffff',.55)},cols:o.cols||null},el,E);};
TV.colsOf=im=>im?info(im).cols:null;
/* once per object: run fn the first time it is drawn */
TV.once=(obj,tag,fn)=>{const k='_tv_'+tag;if(obj[k])return;obj[k]=1;try{fn();}catch(e){}};
/* helpers for the hero files */
TV.hitFx=(x,y,z,col,el)=>{const [px,py]=P(x,y,z);addFx(new Burst({x:px,y:py,r:22,col}));scatter(px,py,{el,n:5,v0:100,v1:240,life:.35,size:3,g:400});};
TV.trailFx=(sx,sy,phi,el,o={})=>{const E=ELEM[el]||ELEM.gold,back=phi+Math.PI;scatter(sx,sy,{el,n:o.n||2,dir:back,spread:.7,v0:20,v1:80,life:o.life||.45,size:o.size||3,g:o.g??40});
  if(o.lines!==false)bit({kind:'line',x:sx,y:sy+(Math.random()-.5)*12,vx:Math.cos(back)*220,vy:Math.sin(back)*220*K,drag:4,life:.2,size:3.5,col:E.cols[1]});};
TV.ELEM=ELEM;TV.mix=mix;
/* old code VFX (GRing lines, Impact rays, grey dust, line sparks) redrawn in the same toon style, only for the heroes listed */
TV.toonHeroes=new Set(['dragon','kitsune','anubis','lion','wolf','cat','hippo','croc','jaguar','owl','rhino']);
TV.toonify=()=>{if(TV._toon||typeof CHAR==='undefined'||!TV.toonHeroes.has(CHAR))return;TV._toon=1;
  if(typeof GRing!=='undefined'){const D=GRing.prototype.draw;GRing.prototype.draw=function(){const lt=this.t-this.delay;if(lt<0)return;const k=clamp01(lt/this.life),e=1-Math.pow(1-k,3),r=this.r0+(this.r1-this.r0)*e,w=Math.max(1,(this.w*.7)*(1-k*.85)),a=k<.7?1:(1-k)/.3,[x,y]=P(this.x,this.y);
    const c=this.color&&this.color[0]==='#'&&this.color.length>=7?this.color.slice(0,7):'#ffd36a';ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;ctx.strokeStyle=mix(c,OUT,.55);ctx.lineWidth=w+3;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.stroke();
    ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle=mix(c,'#ffffff',.6);ctx.lineWidth=Math.max(1,w*.35);ctx.beginPath();ctx.arc(0,0,r-w*.15,0,6.283);ctx.stroke();ctx.restore();ctx.globalAlpha=1;};}
  if(typeof Impact!=='undefined'){Impact.prototype.draw=function(){if(!this._b){this._b=new Burst({r:this.size*.8,col:(this.color||'#ffd36a').slice(0,7),life:this.life});}const [x,y]=P(...this.pos);this._b.x=x;this._b.y=y;this._b.t=this.t;this._b.draw();};}
  if(typeof dustPuff==='function'){const DP=dustPuff;window.dustPuff=dustPuff=function(x,y,n,color='#e8dcc0',spd=60,sz=8){const [px,py]=P(x,y,0);scatter(px,py,{kind:'puff',cols:[mix(color,'#ffffff',.35),mix(color,'#ffffff',.6),color],n:Math.max(2,Math.round(n*.45)),v0:spd*.3,v1:spd*1.1,flat:true,up:15,life:.7,size:sz*.55,g:-25,jx:12,jy:6});};}
  if(typeof sparks==='function'){window.sparks=sparks=function(x,y,z,dir,n,color,speed=260,spread=.7){const [px,py]=P(x,y,z||0),c=(color||'#ffd36a').slice(0,7);scatter(px,py,{kind:Math.random()<.5?'star':'dot',cols:[c,mix(c,'#ffffff',.5),'#ffffff'],n:Math.max(2,Math.round(n*.5)),dir,spread,v0:speed*.3,v1:speed*.8,life:.4,size:2.6,g:380});};}
};
/* =====================================================================
   COMPANION — for heroes whose painted pieces use their own classes (wolf, cat, hippo, croc, jaguar,
   owl, rhino). The host keeps drawing itself (vortex halves, wipes, strips stay as they were); the
   companion follows it and adds the same secondary layer: contact shadow, rings, bursts, trails,
   picture-coloured particles and the pixel dissolve at the end.
   ===================================================================== */
const OLD={CxImg:['croc','cxImg'],JxImg:['jaguar','jxImg'],OxImg:['owl','oxImg'],RxImg:['rhino','rxImg'],KtImg:['cat','ktImg'],HImg:['hippo','hImg'],WImg:['wolf','wImg']};
class Companion{constructor(h,imgFn){this.h=h;this.img=imgFn;this.t=0;this.layer='none';this.n=h.n;this.trail=[];this.emitT=0;this.started=false;this.gone=false;}
  draw(){}
  get x(){return this.h.x;}get y(){return this.h.y;}get z(){return this.h.z||0;}get w(){return this.h.w||100;}get rot(){return this.h.rot||0;}get fy(){return !!this.h.fy;}get ax(){return this.h.ax??.5;}get ay(){return this.h.ay??.5;}
  get life(){return this.h.life;}get phi(){return this.h.phi!=null?this.h.phi:(this.h.rot||0);}get follow(){return this.h.follow;}
  scr(){return P(this.h.x,this.h.y,this.h.z||0);}im(){return this.img(this.h.n);}sc(){return 1;}
  update(dt){const h=this.h;if(h.t<0)return true;const im=this.im();if(!im)return h.t<h.life;
    if(!this.started){this.started=true;const fast=(h.fadeIn??.05)<=.002;
      this.type=h.layer==='ground'?'ground':(h.slide||h.speed)?'streak':(fast&&h.life<.5&&this.w<140)?'hit':(h.follow&&h.life>1.2)?'aura':(h.ay>=.85)?'stand':(h.wipe?'streak':'float');
      const inf=info(im);this.el=elemOf({hero:this.hero,n:h.n},inf);Piece.prototype.spawnFx.call(this,inf,this.el,ELEM[this.el]||ELEM.gold);this.inf=inf;}
    const inf=this.inf,E=ELEM[this.el]||ELEM.gold,[sx,sy]=this.scr();this.emitT-=dt;
    if(this.type==='aura'&&this.emitT<=0){this.emitT=.16;const an=Math.random()*6.283,r=this.w*.32;bit({kind:'star',x:sx+Math.cos(an)*r,y:sy+Math.sin(an)*r*K*.6,vy:-40-Math.random()*40,g:-10,drag:1,life:.8,size:3,col:inf.cols[(Math.random()*3)|0]});}
    else if(this.type==='ground'&&h.life>1&&this.emitT<=0){this.emitT=.2;const an=Math.random()*6.283,r=this.w*.4*Math.random();bit({kind:'dot',x:sx+Math.cos(an)*r,y:sy+Math.sin(an)*r*.35,vy:-30-Math.random()*25,g:-8,drag:1,life:.7,size:2.6,col:inf.cols[(Math.random()*3)|0]});}
    if(h.t>=h.life-dt*1.5||(h.until&&typeof h.until==='function'&&!h.until()&&h.life<h.t+.3)){if(!this.gone){this.gone=true;if(!h.cell&&this.w>=40)Piece.prototype.dissolve.call(this,inf,this.el,E);}return false;}
    return true;}}
TV.Companion=Companion;
TV.attachOld=()=>{if(TV._att||typeof addFx!=='function')return;TV._att=1;const A=window.addFx;
  window.addFx=addFx=function(f){const r=A.apply(this,arguments);try{if(f&&!f._tvc){const m=OLD[f.constructor&&f.constructor.name];
      if(m&&m[0]===CHAR&&f.n&&f.cell==null&&f.half!=='front'&&(f.w||0)>=34&&typeof window[m[1]]==='function'){f._tvc=1;TV.toonify();const c=new Companion(f,window[m[1]]);c.hero=m[0];A(c);}}}catch(e){}return r;};};
/* =====================================================================
   FEEL PASS (owner 2026-11-19: "skills are so fast I can't see anything")
   Visual-only: effects stay on screen longer and a bit bigger, a short charge-up glow
   before every skill, a little more hit-stop and shake. Damage timing is untouched.
   ===================================================================== */
const FEEL={life:1.45,size:1.18,bit:1.35,on:()=>typeof CHAR!=='undefined'&&TV.toonHeroes.has(CHAR)};TV.FEEL=FEEL;
const HP=10,HALO=new WeakMap();function haloOf(im){let c=HALO.get(im);if(c!==undefined)return c;c=null;try{const w=im.naturalWidth,h=im.naturalHeight;if(w&&h){
  c=document.createElement('canvas');c.width=w+2*HP;c.height=h+2*HP;const g=c.getContext('2d');g.filter=`blur(${HP*.55}px)`;g.drawImage(im,HP,HP);g.filter='none';g.globalCompositeOperation='source-in';g.fillStyle='#2a1810';g.fillRect(0,0,c.width,c.height);}}catch(e){c=null;}HALO.set(im,c);return c;}
const HCOL={dragon:'#5ad1ff',kitsune:'#ff8a3a',anubis:'#ffcc4a',lion:'#ffe08a',wolf:'#9fd8ff',cat:'#ff8ab0',hippo:'#5ad8c8',croc:'#7ad86a',jaguar:'#ffb03a',owl:'#c8a0ff',rhino:'#ff7a4a'};
function stretch(f){if(!f||f._feel)return;f._feel=1;const fixed=f.speed||f.slide||f.until||f.hold||f.follow===undefined&&false;
  if(f instanceof Piece){if(!f.speed&&!f.until&&!f.hold){f.life*=FEEL.life;f.fadeOut=Math.max(f.fadeOut,.5);}f.w*=FEEL.size;return;}
  if(f instanceof Bit){f.life*=FEEL.bit;f.size*=1.15;return;}
  if(f instanceof Ring){f.life*=1.4;f.r1*=1.15;return;}
  if(f instanceof Glow){f.life*=1.4;f.r*=1.15;return;}
  if(f instanceof Burst){f.life*=1.6;f.r*=1.2;return;}
  if(f instanceof Companion||f instanceof Contact)return;
  const n=f.constructor&&f.constructor.name;
  if(OLD[n]){if(typeof f.life==='number'&&!fixed&&f.life<3)f.life*=1.35;if(f.w)f.w*=1.12;return;}
  if(typeof GRing!=='undefined'&&f instanceof GRing){f.life*=1.4;f.r1*=1.12;return;}
  if(typeof Impact!=='undefined'&&f instanceof Impact){f.life*=1.5;f.size*=1.2;return;}}
TV.feel=()=>{if(TV._feel||!FEEL.on()||typeof addFx!=='function')return;TV._feel=1;
  const A=window.addFx;window.addFx=addFx=function(f){try{if(FEEL.on())stretch(f);}catch(e){}return A.apply(this,arguments);};
  if(typeof stop==='function'){const S=stop;window.stop=stop=ms=>S(Math.min(150,ms*1.45));}
  if(typeof shake==='function'){const H=shake;window.shake=shake=a=>H(a*1.3);}
  /* charge-up: a glow gathers under the hero and sparks are pulled in during the wind-up */
  if(typeof startAction==='function'){const SA=startAction;window.startAction=startAction=function(a){const r=SA.apply(this,arguments);try{
    if(FEEL.on()&&a&&a.key&&a.key!=='basic'&&(a.windup||0)>=.08&&typeof player!=='undefined'){const col=HCOL[CHAR]||'#ffd36a',wu=a.windup,[px,py]=P(player.x,player.y,0);
      addFx(new Glow({x:px,y:py,r:70,col,a0:.5,life:wu+.35,follow:player}));
      addFx(new Ring({x:px,y:py,r0:70,r1:18,w:5,col,life:Math.max(.15,wu)}));
      const n=Math.min(10,4+Math.round(wu*20));for(let i=0;i<n;i++){const an=i/n*6.283+Math.random()*.4,R=55+Math.random()*25,T=Math.max(.12,wu*.9);
        bit({kind:i%3?'dot':'star',x:px+Math.cos(an)*R,y:py-30+Math.sin(an)*R*.6,vx:-Math.cos(an)*R/T,vy:-Math.sin(an)*R*.6/T,drag:0,life:T,size:3.4,col:i%2?col:mix(col,'#ffffff',.6),_feel:1});}}}catch(e){}return r;};}};
window.TV=TV;
})();
