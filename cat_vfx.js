/* =====================================================================
   WHITE RONIN CAT — skill effects v3: SVG art (cat_art.js) + code VFX.
   Owner 2026-11-20: "make the cat's skill effects with SVG and VFX, pretty and realistic, the details of each effect
   must match the skill's concept" + "the hit, the sword swing and the effect must be in time with each other".

   HOW THE TIMING IS KEPT (read this before changing anything):
   · The action clock runs at ACTION_TEMPO (0.75 by default): every time taken from an action (frame times, events) is
     converted to real seconds with rt() before an effect uses it.
   · A sword arc never has a life of its own: KArc is told how long it is until the contact frame (`lead`) and its edge is
     ON the target at exactly that moment; the rest of the sweep is follow-through. Hit sparks come from the damage itself.
   · Hit-stop freezes effects together with the game, so a frozen frame shows the arc on the target.
   char_cat.js calls the hooks in window.KTV; without this file (or with ?vfx3=0) it falls back to the painted pictures.

   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; every bright shape has a saturated mid tone and a dark "ink" shape behind
   it, so pale cuts still read on snow; a white-hot core; debris is shaped (petals, embers, straw, stone), never round dots.
   Families: Basic = steel + straw + gold · A (Kaze) = sakura + wind · B (Oni) = fire + stone · C = the tree it belongs to.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||!['cat','kitsune','wolf'].includes(CHAR)||!window.VK||!window.KTA||/[?&]vfx3=0/.test(location.search))return;   /* sections 1-3 are a kit shared as window.K3 (kitsune_vfx.js); the rest is the cat's */
const V=window.VK,{G,sys,tx}=V,A=window.KTA;
const TAU=Math.PI*2,cl=(v,a,b)=>v<a?a:v>b?b:v,eO=t=>1-(1-t)*(1-t)*(1-t),eI=t=>t*t,eIO=t=>t<.5?2*t*t:1-2*(1-t)*(1-t),R_=(a,b)=>a+Math.random()*(b-a),lerp=(a,b,t)=>a+(b-a)*t;
const back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75,rt=a=>a/TEMPO();
const scr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));          /* a world direction as an angle on screen */
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
/* palettes: [ink (dark shape behind), deep, mid, lite, core] */
const PAL={sakura:['#3d0c26','#d81e6f','#ff5c9a','#ffb3d0','#ffffff'],steel:['#16203a','#4a66a0','#9fbcee','#e3eeff','#ffffff'],moon:['#2a2244','#7a66d8','#c4b8ff','#f1ecff','#ffffff'],
  wind:['#0f3048','#2a8fd0','#7fd8ff','#d8f6ff','#ffffff'],oni:['#2a0606','#a8140c','#ff4a1e','#ffb347','#fff3c8'],lacquer:['#2a0508','#8f0f18','#d2202c','#ff8a6a','#ffe9b0'],
  gold:['#3a2206','#b8741a','#ffc23a','#ffe89a','#ffffff'],earth:['#2a1a0e','#8a4a1c','#e8822a','#ffc878','#fff3d8'],echo:['#3d0c26','#e88ab4','#ffc4dc','#ffe6f0','#ffffff']};
const palOf=k=>{const b=typeof ktBranch==='function'?ktBranch(k):'N';return b==='B'?PAL.oni:b==='A'?PAL.sakura:PAL.steel;};

/* ---------------------------------------------------------------------
   1. ART HELPERS
   --------------------------------------------------------------------- */
const TINT={};function tint(n,col){const k=n+col;if(TINT[k])return TINT[k];const im=A.get(n);if(!im)return null;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return TINT[k]=c;}
/* draw art n centred on screen point (x,y); w = width in world px. o: rot, flat (lies on the ground), ax, ay, a, sx, sy, under (colour of a dark print below it) */
function art(n,x,y,w,o={}){const im=A.get(n);if(!im)return;const [aw,ah]=A.size(n),h=w*ah/aw;ctx.save();ctx.translate(x,y);if(o.flat)ctx.scale(1,K);if(o.rot)ctx.rotate(o.rot);if(o.sx!=null||o.sy!=null)ctx.scale(o.sx==null?1:o.sx,o.sy==null?1:o.sy);
  const a0=ctx.globalAlpha*cl(o.a==null?1:o.a,0,1),ax=o.ax==null?.5:o.ax,ay=o.ay==null?.5:o.ay;
  if(o.under){const t=tint(n,o.under);if(t){ctx.globalAlpha=a0*(o.ua||.45);ctx.drawImage(t,-w*ax+(o.ux==null?2:o.ux),-h*ay+(o.uy==null?3:o.uy),w,h);}}
  ctx.globalAlpha=a0;ctx.drawImage(o.im||im,-w*ax,-h*ay,w,h);ctx.restore();}
/* the colour of the ground under a point (snow / sand / stone); null on grass */
function surf(x,y){try{const h=typeof mapHost==='function'&&typeof curMap!=='undefined'&&curMap&&mapHost();if(h&&h.surface&&typeof W2M==='function'){const m=W2M(x,y),c=h.surface(m.x,m.y);if(c)return c.split(',').map(Number);}}catch(_){}return null;}
const hx=v=>('0'+Math.round(cl(v,0,255)).toString(16)).slice(-2),hex3=(r,g,b)=>'#'+hx(r)+hx(g)+hx(b);
function dustTint(x,y){const c=surf(x,y);if(!c)return '#efe6d2|#a89474';const [r,g,b]=c,snow=b>235&&r>225;return snow?'#ffffff|#a9b8dc':hex3(r+30,g+28,b+24)+'|'+hex3(r*.62,g*.6,b*.58);}

/* ---------------------------------------------------------------------
   2. PIECES
   --------------------------------------------------------------------- */
/* a generic animated picture. follow = stick to an entity (+ox, oy); pop = seconds of an overshoot pop; tick(f,dt) for custom motion */
class KSprite{constructor(o){Object.assign(this,{t:0,layer:'top',x:0,y:0,z:0,w:60,life:.5,fi:.05,fo:.25,s0:1,s1:1,pop:0,rot:0,spin:0,ax:.5,ay:.5,flat:0,a:1,vx:0,vy:0,vz:0,ox:0,oy:0,delay:0},o);this.t=-this.delay;this._sy=this.y;}
  get sy(){return (this.follow?this.follow.y+this.oy:this.y)+(this.sortOff||0);}
  update(dt){this.t+=dt;if(this.t<0)return true;if(this.until&&!this._end&&!this.until()){this._end=1;this.life=Math.min(this.life,this.t+this.fo);}this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;if(this.tick)this.tick(this,dt);return this.t<this.life;}
  draw(){if(this.t<0)return;const t=this.t,k=t/this.life,f=this.follow,wx=f?f.x+this.ox:this.x,wy=f?f.y+this.oy:this.y,wz=this.z+(f&&f.z||0),[x,y]=P(wx,wy,wz);
    const s=this.pop?this.s0+(this.s1-this.s0)*back(cl(t/this.pop,0,1)):this.s0+(this.s1-this.s0)*eO(k),a=this.a*cl(t/Math.max(.001,this.fi),0,1)*cl((this.life-t)/Math.max(.001,this.fo),0,1);if(a<=.004)return;
    if(this.paint){ctx.save();ctx.globalAlpha=a;this.paint(this,x,y,s,a);ctx.restore();return;}
    art(this.n,x,y,this.w*s,{rot:this.rot+this.spin*t,flat:this.flat,ax:this.ax,ay:this.ay,a,sx:this.sx,sy:this.sy2,under:this.under,ua:this.ua});}}
const sprite=o=>addFx(new KSprite(o));
/* a sword cut: a tapered arc in any plane.
   plane: u = facing (phi), v = sideways turned up by `tilt` (0 = flat sweep around the hero, PI/2 = vertical plane through the facing).
   the edge goes a0 -> a1 and is on `hit` (default: the middle) exactly `lead` seconds after it starts. */
const prof=s=>Math.pow(Math.sin(Math.PI*Math.pow(s,1.35)),.8);
class KArc{constructor(o){Object.assign(this,{t:0,layer:'top',z:40,phi:0,tilt:0,a0:-1.3,a1:1.3,hit:null,R:66,W:20,lead:.04,sweep:.08,hold:.04,fade:.17,pal:PAL.sakura,ink:.5,N:20,edge:.2,glint:1,emb:0,pet:0,trail:0},o);
    if(this.hit==null)this.hit=(this.a0+this.a1)/2;this.sweep=Math.max(this.sweep,this.lead+.02);this.life=this.sweep+this.hold+this.fade;
    const c=Math.cos(this.phi),s=Math.sin(this.phi),ct=Math.cos(this.tilt),st=Math.sin(this.tilt);this.u=[c,s,0];this.v=[-s*ct,c*ct,st];this.acc=0;}
  w3(th,r){const u=this.u,v=this.v,cs=Math.cos(th),sn=Math.sin(th);return [this.x+r*(cs*u[0]+sn*v[0]),this.y+r*(cs*u[1]+sn*v[1]),Math.max(0,this.z+r*sn*v[2])];}
  pt(th,r){const q=this.w3(th,r);return P(q[0],q[1],q[2]);}
  head(){const t=this.t;if(t<=this.lead)return this.a0+(this.hit-this.a0)*(t/this.lead);return this.hit+(this.a1-this.hit)*eO(cl((t-this.lead)/(this.sweep-this.lead),0,1));}
  update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;if(this.fz)this.z=this.fz+(player.z||0);}
    if(this.t<this.sweep&&(this.emb||this.pet)){this.acc+=dt;while(this.acc>.012){this.acc-=.012;const q=this.w3(this.head(),this.R-this.W*.3),d=this.a1>this.a0?1:-1,tg=this.w3(this.head()+d*.3,this.R),vx=(tg[0]-q[0])*5,vy=(tg[1]-q[1])*5;
        if(this.emb&&Math.random()<this.emb)embers(q[0],q[1],q[2],1,{spd:70,vx:vx*.5,vy:vy*.5});if(this.pet&&Math.random()<this.pet)petals(q[0],q[1],q[2],1,{spd:30,vx:vx*.35,vy:vy*.35,up:20});}}
    return this.t<this.life;}
  band(a,b,r,w){const N=this.N;ctx.beginPath();for(let i=0;i<=N;i++){const q=this.pt(a+(b-a)*i/N,r);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=N;i>=0;i--){const s=i/N,q=this.pt(a+(b-a)*s,r-w*prof(s));ctx.lineTo(q[0],q[1]);}ctx.closePath();}
  draw(){const hd=this.head(),T=this.sweep+this.hold,f=cl((this.t-T)/this.fade,0,1);let t0=this.a0;if(this.trail&&Math.abs(hd-t0)>this.trail)t0=hd-Math.sign(hd-t0)*this.trail;const tl=t0+(hd-t0)*(f*f*.97),d=hd-tl;if(Math.abs(d)<.03)return;
    const p=this.pal,W=this.W*(1-f*.45),R=this.R;ctx.save();ctx.lineJoin='round';
    if(this.ink>0){ctx.globalAlpha=this.ink*(1-f);this.band(tl-d*.05,hd,R+2,W*1.5);ctx.fillStyle=p[0];ctx.fill();}
    ctx.globalAlpha=1-f*.3;this.band(tl,hd,R,W);ctx.fillStyle=p[1];ctx.fill();
    this.band(tl+d*.07,hd,R,W*.66);ctx.fillStyle=p[2];ctx.fill();
    this.band(tl+d*.18,hd,R,W*.36);ctx.fillStyle=p[3];ctx.fill();
    if(this.edge>0){this.band(tl+d*.32,hd,R+.6,Math.max(1.8,W*this.edge));ctx.fillStyle=p[4];ctx.fill();}
    /* two speed slivers behind the tail */
    if(f<.6){ctx.globalAlpha=(1-f/.6)*.8;ctx.fillStyle=p[2];for(let i=0;i<2;i++){const a=tl-d*(.06+.1*i),b=a-d*.16,r=R-W*(.25+.4*i);this.band(b,a,r,2.6);ctx.fill();}}
    /* the glint of the edge as it meets the target */
    if(this.glint){const g=(this.t-this.lead+.012)/.09;if(g>0&&g<1){const q=this.pt(this.hit,R),s=(8+W*.5)*this.glint*Math.sin(Math.PI*g);star(q[0],q[1],s,p[2],g*.8);}}
    ctx.restore();}}
/* four-point glint, drawn directly */
function star(x,y,s,col,rot=0){if(s<.6)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);const ray=(L,w,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(0,-w,L,0);ctx.quadraticCurveTo(0,w,-L,0);ctx.fill();};
  ray(s*1.3,s*.3,col);ctx.rotate(Math.PI/2);ray(s*.95,s*.26,col);ctx.rotate(-Math.PI/2);ray(s*1.05,s*.12,'#fff');ctx.rotate(Math.PI/2);ray(s*.75,s*.1,'#fff');ctx.restore();}
class KGlint{constructor(o){Object.assign(this,{t:0,layer:'top',z:30,s:16,life:.2,col:'#ff9cc2',rot:R_(-.3,.3),delay:0},o);this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.e&&!this.e.dead){this.x=this.e.x+(this.ox||0);this.y=this.e.y+(this.oy||0);}return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z);star(x,y,this.s*Math.pow(Math.sin(Math.PI*Math.min(1,k*1.1)),.7),this.col,this.rot+k*.7);}}
/* the line a drawn sword leaves on its target (iai): draws on from one end, then closes like a cut */
class KLine{constructor(o){Object.assign(this,{t:0,layer:'top',z:30,ang:0,L:110,w:4.5,grow:.035,hold:.07,fade:.15,pal:PAL.sakura,ink:.45,delay:0},o);this.t=-this.delay;this.life=this.grow+this.hold+this.fade;}
  update(dt){this.t+=dt;if(this.e&&!this.e.dead){this.x=this.e.x+(this.ox||0);this.y=this.e.y+(this.oy||0);}return this.t<this.life;}
  draw(){if(this.t<0)return;const [x,y]=P(this.x,this.y,this.z),g=eO(cl(this.t/this.grow,0,1)),f=cl((this.t-this.grow-this.hold)/this.fade,0,1),L=this.L,w=this.w*(1-f),p=this.pal;if(w<.25)return;
    ctx.save();ctx.translate(x,y);ctx.rotate(this.ang);const a=-L/2,b=a+L*g,m=(a+b)/2,lens=h=>{ctx.beginPath();ctx.moveTo(a,0);ctx.quadraticCurveTo(m,-h,b,0);ctx.quadraticCurveTo(m,h,a,0);ctx.closePath();};
    if(this.ink>0){ctx.globalAlpha=this.ink*(1-f);lens(w*3.6);ctx.fillStyle=p[0];ctx.fill();}
    ctx.globalAlpha=1;lens(w*2.4);ctx.fillStyle=p[2];ctx.fill();lens(w*1.15);ctx.fillStyle=p[4];ctx.fill();ctx.restore();}}
/* short thick rays thrown out by a heavy blow */
class KBurst{constructor(o){Object.assign(this,{t:0,layer:'top',z:28,R:34,n:9,life:.24,pal:PAL.oni,ink:.5},o);this.rot=R_(0,TAU);this.j=Array.from({length:this.n},()=>[R_(.6,1.15),R_(-.16,.16),R_(.7,1.2)]);}
  update(dt){this.t+=dt;if(this.e&&!this.e.dead){this.x=this.e.x;this.y=this.e.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),g=eO(Math.min(1,k*2.2)),f=cl((k-.35)/.65,0,1),p=this.pal,R=this.R;ctx.save();ctx.translate(x,y);ctx.rotate(this.rot);
    const rays=(sc,col,w0)=>{ctx.fillStyle=col;ctx.beginPath();for(let i=0;i<this.n;i++){const [l,o,w]=this.j[i],a=i/this.n*TAU+o,r1=R*l*sc*(.35+.65*g),r0=R*.12*sc+R*l*sc*f*.8,wd=w0*w*(1-f);
        ctx.moveTo(Math.cos(a-wd)*r0,Math.sin(a-wd)*r0*.8);ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1*.8);ctx.lineTo(Math.cos(a+wd)*r0,Math.sin(a+wd)*r0*.8);ctx.closePath();}ctx.fill();};
    if(this.ink>0){ctx.globalAlpha=this.ink*(1-f);rays(1.18,p[0],.3);}ctx.globalAlpha=1-f*.5;rays(1,p[2],.24);rays(.72,p[3],.17);rays(.42,p[4],.12);ctx.restore();}}
/* a ring on the ground made of broken arcs */
class KRing{constructor(o){Object.assign(this,{t:0,layer:'ground',r0:10,r1:90,life:.35,w:6,pal:PAL.sakura,segs:3,gap:.3,a:1,z:0,ease:eO,delay:0},o);this.rot=o.rot==null?R_(0,TAU):o.rot;this.t=-this.delay;}
  update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.life;}
  draw(){if(this.t<0)return;const k=this.t/this.life,r=Math.max(.5,this.r0+(this.r1-this.r0)*this.ease(k)),[x,y]=P(this.x,this.y,this.z),a=this.a*(1-k)*(2-k)/1,w=Math.max(1,this.w*(1-k*.7)),p=this.pal;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';
    const seg=TAU/this.segs,len=seg*(1-this.gap);for(let i=0;i<this.segs;i++){const s=this.rot+i*seg+k*.6;ctx.globalAlpha=cl(a*.55,0,1);ctx.strokeStyle=p[1];ctx.lineWidth=w+3.5;ctx.beginPath();ctx.arc(0,0,r,s,s+len);ctx.stroke();
      ctx.globalAlpha=cl(a,0,1);ctx.strokeStyle=p[3];ctx.lineWidth=w;ctx.beginPath();ctx.arc(0,0,r,s,s+len);ctx.stroke();ctx.strokeStyle=p[4];ctx.lineWidth=Math.max(.8,w*.34);ctx.beginPath();ctx.arc(0,0,r,s+len*.18,s+len*.82);ctx.stroke();}ctx.restore();}}
const ring=o=>addFx(new KRing(o));
/* a straight streak between two points (dashes): bright head at b, the tail thins out toward a */
class KStreak{constructor(o){Object.assign(this,{t:0,layer:'top',z:26,w:9,life:.22,pal:PAL.sakura,ink:.4,live:0},o);}
  update(dt){if(this.live>0){this.live-=dt;this.b=[player.x,player.y];return true;}this.t+=dt;return this.t<this.life;}   /* live: the head rides on the hero until the dash is over, then the streak closes */
  draw(){const k=this.t/this.life,[ax,ay]=P(this.a[0],this.a[1],this.z),[bx,by]=P(this.b[0],this.b[1],this.z),dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(L<4)return;const nx=-dy/L,ny=dx/L,w=this.w*(1-k),t0=eO(k)*.85,sx=ax+dx*t0,sy=ay+dy*t0,p=this.pal;
    const tri=(wd,c,al)=>{ctx.globalAlpha=al;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(bx+nx*wd,by+ny*wd);ctx.lineTo(bx+dx/L*wd*1.6,by+dy/L*wd*1.6);ctx.lineTo(bx-nx*wd,by-ny*wd);ctx.closePath();ctx.fill();};
    ctx.save();if(this.ink>0)tri(w*1.9,p[0],this.ink*(1-k));tri(w*1.25,p[2],1-k*.4);tri(w*.7,p[3],1);tri(w*.3,p[4],1);ctx.restore();}}

/* ---------------------------------------------------------------------
   3. DEBRIS — petals that flutter and settle, embers that rise and cool, straw, stone, dust of the ground's own colour
   --------------------------------------------------------------------- */
const PETS=[],EMB=[];
function drawPetal(p){const im=A.get(p.im);if(!im)return;const [x,y]=P(p.x,p.y,p.z),ld=p.land>=0,a=cl(p.t/.06,0,1)*(ld?cl(1-(p.t-p.land)/p.rest,0,1):cl((p.life-p.t)/.3,0,1));if(a<=.01)return;
  ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);if(ld){ctx.scale(1,K);ctx.rotate(p.rot);}else{ctx.rotate(p.rot);ctx.scale(1,.26+.74*Math.abs(Math.cos(p.ph*1.6+p.o)));}
  const ph=p.s*(p.asp||1.35);   /* asp = height / width of the picture (petals 1.35; the wolf's feathers are longer) */
  if(p.dk){const t=tint(p.im,typeof p.dk==='string'?p.dk:'#5a0f34');if(t){ctx.globalAlpha=a*.35;ctx.drawImage(t,-p.s/2+1,-ph/2+1.5,p.s,ph);ctx.globalAlpha=a;}}
  ctx.drawImage(im,-p.s/2,-ph/2,p.s,ph);ctx.restore();}
class KPetAir{constructor(){this.layer='top';}
  update(dt){for(let i=PETS.length-1;i>=0;i--){const p=PETS[i];p.t+=dt;if(p.t<0)continue;
      if(p.land<0){if(p.orb){/* held by a whirl: circles its centre, drifting outward and down */p.an+=p.va*dt;p.rr+=p.vr2*dt;p.z+=p.vz*dt;p.x=p.cx+Math.cos(p.an)*p.rr;p.y=p.cy+Math.sin(p.an)*p.rr*.9;p.ph+=p.fq*dt;p.rot+=p.vr*dt;if(p.t>p.orb){p.orb=0;p.vx=-Math.sin(p.an)*p.va*p.rr*.5;p.vy=Math.cos(p.an)*p.va*p.rr*.5;p.vz=20;}}
        else{const d=Math.exp(-3.2*dt);p.vx*=d;p.vy*=d;p.vz+=(-p.term-p.vz)*Math.min(1,dt*3.5);p.ph+=p.fq*dt;const sw=Math.cos(p.ph)*p.sw;p.x+=(p.vx+p.sdx*sw)*dt;p.y+=(p.vy+p.sdy*sw)*dt;p.z+=p.vz*dt;p.rot+=p.vr*dt;}
        if(p.z<=0&&!p.orb){p.z=0;p.land=p.t;}}
      if(p.t>p.life||(p.land>=0&&p.t-p.land>p.rest))PETS.splice(i,1);}return true;}
  draw(){for(const p of PETS)if(p.land<0&&p.t>=0)drawPetal(p);}}
class KPetGround{constructor(){this.layer='ground';}update(){return true;}draw(){for(const p of PETS)if(p.land>=0)drawPetal(p);}}
class KEmb{constructor(){this.layer='top';}
  update(dt){for(let i=EMB.length-1;i>=0;i--){const p=EMB[i];p.t+=dt;const d=Math.exp(-p.dr*dt);p.vx*=d;p.vy*=d;p.vz=p.vz*d+p.lift*dt;p.px=p.x;p.py=p.y;p.pz=p.z;p.x+=(p.vx+Math.sin(p.t*17+p.o)*14)*dt;p.y+=p.vy*dt;p.z=Math.max(0,p.z+p.vz*dt);if(p.t>p.life)EMB.splice(i,1);}return true;}
  draw(){ctx.save();ctx.lineCap='round';for(const p of EMB){const k=p.t/p.life,[x,y]=P(p.x,p.y,p.z),vx=p.vx,vy=p.vy*K-p.vz,sp=Math.hypot(vx,vy)||1,L=Math.min(14,2+sp*.035)*(1-k*.5),w=p.s*(1-k*.7);
      ctx.globalAlpha=cl((1-k)*1.6,0,1);ctx.strokeStyle=p.c?p.c[k<.3?0:k<.65?1:2]:(k<.22?'#fff1b8':k<.5?'#ffb02e':k<.78?'#ff5a1a':'#9a1c0c');ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x-vx/sp*L,y-vy/sp*L);ctx.lineTo(x,y);ctx.stroke();}ctx.restore();}}
let PA=null,PG=null,EM=null;
function ensure(){if(!PA||!fx.includes(PA))PA=addFx(new KPetAir());if(!PG||!fx.includes(PG))PG=addFx(new KPetGround());if(!EM||!fx.includes(EM))EM=addFx(new KEmb());}
const PIM=['petal0','petal1','petal2'];
/* n petals burst from a point. o: spd (outward), up, vx/vy (shared drift), dir + spread (a cone instead of all round), s (size), im, term (fall speed), life, rest (seconds lying on the ground) */
function petals(x,y,z,n,o={}){ensure();const q=Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.5,Q.p):1)));for(let i=0;i<q;i++){if(PETS.length>240)PETS.shift();const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.6:o.spread):R_(0,TAU),v=R_(.35,1)*(o.spd==null?90:o.spd),sd=R_(0,TAU);
    PETS.push({t:-(o.delay||0)-R_(0,o.stag||0),im:o.im||PIM[(Math.random()*3)|0],x:x+R_(-3,3),y:y+R_(-3,3),z:Math.max(1,z+R_(-5,8)),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.8+(o.vy||0),vz:R_(.3,1)*(o.up==null?70:o.up),
      term:R_(26,46)*(o.term||1),ph:R_(0,TAU),fq:R_(5,9),sw:R_(14,30),sdx:Math.cos(sd),sdy:Math.sin(sd)*.6,rot:R_(0,TAU),vr:R_(-5,5),o:R_(0,TAU),s:R_(8,12)*(o.s||1),life:o.life||R_(1.5,2.4),rest:o.rest==null?R_(.5,.9):o.rest,land:-1,dk:o.dk==null?1:o.dk,asp:o.asp});}}
/* petals carried round a centre for `hold` seconds, then released (blossom whirls) */
function whirlPetals(cx,cy,n,o={}){ensure();for(let i=0;i<n;i++){if(PETS.length>260)PETS.shift();const an=R_(0,TAU),r=R_(o.r0||10,o.r1||40);
    PETS.push({t:-R_(0,o.stag||.1),im:o.im||PIM[(Math.random()*3)|0],x:cx,y:cy,z:R_(o.z0||4,o.z1||50),cx,cy,an,rr:r,va:(o.va||7)*R_(.7,1.2)*(o.dir||1),vr2:o.out||18,vz:o.vz==null?R_(8,28):o.vz,orb:o.hold||.5,vx:0,vy:0,
      term:R_(26,46),ph:R_(0,TAU),fq:R_(5,9),sw:R_(14,30),sdx:1,sdy:0,rot:R_(0,TAU),vr:R_(-5,5),o:R_(0,TAU),s:R_(8,12)*(o.s||1),life:(o.hold||.5)+R_(1.2,2),rest:R_(.5,.9),land:-1,dk:1});}}
/* n embers. o: spd, up, vx, vy, s, life, c (three colours hot -> cold) */
function embers(x,y,z,n,o={}){ensure();const q=Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.5,Q.p):1)));for(let i=0;i<q;i++){if(EMB.length>200)EMB.shift();const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.6:o.spread):R_(0,TAU),v=R_(.3,1)*(o.spd==null?140:o.spd);
    EMB.push({t:0,x:x+R_(-4,4),y:y+R_(-3,3),z:Math.max(0,z+R_(-4,6)),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.8+(o.vy||0),vz:R_(.3,1)*(o.up==null?120:o.up),lift:o.lift==null?60:o.lift,dr:o.dr||2.6,o:R_(0,TAU),s:R_(1.6,3)*(o.s||1),life:(o.life||.55)*R_(.6,1.2),c:o.c});}}
/* dust in the colour of the ground. ring = puffs start on a circle of that radius and roll outward */
function dust(x,y,n,o={}){const S=sys(o.layer||'top'),tintS=o.tint||dustTint(x,y),size=o.size||46;for(let i=0;i<n;i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.5):i/n*TAU+R_(-.3,.3),v=(o.spd==null?60:o.spd)*R_(.5,1.1),r=o.ring||0;
    S.add({im:tx('smoke',tintS,i%4),x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.8,z:o.z==null?4:o.z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:o.rise==null?18:o.rise,dr:o.dr||2.4,s0:size*R_(.4,.6),s1:size*R_(.95,1.35),life:(o.life||.8)*R_(.75,1.15),fi:.06,fo:.65,a0:o.a||R_(.6,.85),rot:R_(0,TAU),vr:R_(-.8,.8)});}}
/* chips of stone thrown up, they bounce once and lie */
function stones(x,y,n,o={}){const S=sys('top');for(let i=0;i<n;i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.6):R_(0,TAU),v=(o.spd||190)*R_(.4,1);
    S.add({im:tx('shard',o.col||(i%3?'#7d6858':'#5a4a40'),i%5),x:x+R_(-6,6),y:y+R_(-4,4),z:o.z||2,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||250)*R_(.5,1.1),g:820,dr:.6,s0:R_(7,13)*(o.s||1),s1:R_(6,10)*(o.s||1),life:R_(.7,1.1),fo:.3,rot:R_(0,TAU),vr:R_(-14,14),bounce:.3});}}
/* straw from the cloak or the hat */
const STRAW=(()=>{const c=document.createElement('canvas');c.width=28;c.height=8;const g=c.getContext('2d'),l=g.createLinearGradient(0,0,28,0);l.addColorStop(0,'#b98236');l.addColorStop(.5,'#f6dfa6');l.addColorStop(1,'#d8a85a');g.fillStyle=l;g.beginPath();g.moveTo(0,4);g.lineTo(6,1.5);g.lineTo(27,3);g.lineTo(27,5);g.lineTo(6,6.5);g.closePath();g.fill();return c;})();
function straw(x,y,z,n,o={}){const S=sys('top');for(let i=0;i<n;i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.7):R_(0,TAU),v=(o.spd||150)*R_(.4,1);
    S.add({im:STRAW,asp:.28,x,y,z:z+R_(-4,6),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||150)*R_(.4,1),g:520,dr:1.6,s0:R_(10,16),s1:R_(9,14),life:R_(.6,1),fo:.35,rot:R_(0,TAU),vr:R_(-12,12),bounce:.15});}}

/* ---------------------------------------------------------------------
   4. HOOKS (window.KTV) — char_cat.js calls these; anything not found here keeps its old look
   --------------------------------------------------------------------- */
window.K3={V,A,PAL,TAU,cl,eO,eI,eIO,back,lerp,R_,rt,scr,rgba,tint,art,surf,dustTint,KSprite,sprite,KArc,star,KGlint,KLine,KBurst,KRing,ring,KStreak,petals,whirlPetals,embers,dust,stones,straw,ensure};
if(CHAR!=='cat')return;
const KTV=window.KTV={on:1,PAL,petals,embers,dust,stones,straw};
const zOf=e=>(e&&e.boss?40:26);
/* seconds (real) until the i-th contact frame of an action that is running now */
const leadOf=(a,i)=>{try{const ct=CT(atkDir(player.dir)),k=seqIndex(a.seq,'attack',ct,i);if(k<0)return .04;return cl((seqTimeAt(a.seq,k)-a.t)/TEMPO(),.012,.12);}catch(_){return .04;}};
/* cut shapes: [tilt, a0, a1] — the cat's attack clip is a rising draw-cut, so 0 is the default */
const CUTS={rise:[1.05,-1.0,1.7],fall:[-1.05,1.6,-1.0],flat:[.12,-1.5,1.5],flatR:[-.12,1.5,-1.5],up:[1.45,-.7,2.3],down:[1.45,2.4,-.3],slashL:[.6,-1.4,1.5],slashR:[-.6,1.4,-1.5]};
function cut(shape,o){const c=CUTS[shape]||CUTS.rise;return addFx(new KArc(Object.assign({x:player.x,y:player.y,follow:1,fz:o&&o.z!=null?o.z:40,tilt:c[0],a0:c[1],a1:c[2]},o)));}

/* ---- every strike that goes through ktStrike (most skills) ---- */
KTV.swing=function(c){const {a,i,last,phi,heavy,key}=c,lead=leadOf(a,i),f=KTV.SW[key];if(f&&f(c,lead)===true)return;
  const pal=heavy?PAL.oni:palOf(key);
  cut(heavy?'up':(i%2?'fall':'rise'),{phi,lead,R:heavy?(last?84:74):(last?70:62),W:heavy?(last?30:24):(last?18:14),pal,emb:heavy?.5:0,pet:heavy?0:.25,sweep:lead+(heavy?.07:.055),fade:heavy?.2:.15});};
KTV.SW={};
/* ---- every hit ---- */
let lastHit=0;
KTV.hit=function(e,key,big,crit,o){if(!e)return;const f=KTV.HIT[key];if(f&&f(e,big,crit,o)===true)return;const now=gameTime,br=typeof ktBranch==='function'?ktBranch(key):'N',echo=o&&o.ktEcho;
  if(now-lastHit<.028&&!big)return;lastHit=now;const z=zOf(e),bs=e.boss?1.3:1;
  if(br==='B'){addFx(new KBurst({e,x:e.x,y:e.y,z,R:(big?40:28)*bs,n:big?11:8,pal:PAL.oni}));embers(e.x,e.y,z,big?9:5,{spd:big?210:150,up:150});if(big){dust(e.x,e.y,3,{size:38,spd:50,life:.6});ring({x:e.x,y:e.y,r0:8,r1:54*bs,w:5,pal:PAL.oni,life:.3});}}
  else{const pal=echo?PAL.echo:br==='A'?PAL.sakura:PAL.steel;addFx(new KGlint({e,x:e.x,y:e.y,z,s:(big?20:13)*bs,col:pal[2],life:big?.22:.16}));
    if(!echo||big)addFx(new KLine({e,x:e.x,y:e.y,z,ang:R_(-.9,.9),L:(big?70:44)*bs,w:big?4:3,pal,hold:.03,fade:.12,ink:.35}));
    if(br==='A')petals(e.x,e.y,z,big?5:echo?1:2,{spd:big?150:100,up:80});}};
KTV.HIT={};

/* ---------------------------------------------------------------------
   5. WATCHERS — things that last as long as a buff (drawn every frame, calm on purpose: buffs must not hide the hero)
   --------------------------------------------------------------------- */
const W={t:0,ki:0,ash:0,sak:0,motes:[],acc:{}};
const every=(k,sec,dt)=>{W.acc[k]=(W.acc[k]||0)+dt;if(W.acc[k]>=sec){W.acc[k]=0;return true;}return false;};
/* the hand that holds the sword, good enough for glints and gathering light */
const hand=()=>[player.x+Math.cos(player.phi)*10,player.y+Math.sin(player.phi)*8,44+(player.z||0)];
function kumoAt(i,t,front){const an=t*.45+i*TAU/4,sn=Math.sin(an);if((sn>=0)!==front)return;const [x,y]=P(player.x+Math.cos(an)*46,player.y+sn*30,6+3*Math.sin(t*1.7+i));art('kumo',x,y,38+6*sn,{a:W.ki*(front?.9:.7),ay:.8,under:'#3a5a8a',ua:.28,uy:2});}
/* ground half (called from the ground layer by KtGroundAura.draw) */
KTV.groundAura=function(ga,x,y){ensure();if(!W.top||!fx.includes(W.top))W.top=addFx(new KWatchTop());W.ki=ga.ki;W.ash=ga.ash;const t=ga.t,still=typeof ktL==='function'&&ktL('kcStill')>0;
  if(ga.ki>0){const k=ga.ki,c=still?'150,235,200':'190,225,255';ctx.save();ctx.translate(x,y);ctx.scale(1,K);
      const g=ctx.createRadialGradient(0,0,4,0,0,60);g.addColorStop(0,`rgba(${c},${.34*k})`);g.addColorStop(.7,`rgba(${c},${.16*k})`);g.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,60,0,TAU);ctx.fill();
      /* still water: slow rings widening from the cat */
      for(let i=0;i<3;i++){const u=((t*.42+i/3)%1),r=8+52*u;ctx.globalAlpha=k*(1-u)*.9;ctx.strokeStyle=still?'#3aa884':'#5a8fd0';ctx.lineWidth=2.6*(1-u)+.6;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,-1,r,Math.PI*1.05,Math.PI*1.95);ctx.stroke();}
      ctx.restore();for(let i=0;i<4;i++)kumoAt(i,t,false);}
  if(ga.ash>0)ashuraFlames(ga.ash,t,false);
  if(KTV.groundExtra)KTV.groundExtra(t);return true;};
/* top half */
class KWatchTop{constructor(){this.layer='top';this.t=0;}
  update(dt){this.t+=dt;W.t=this.t;
    /* Ki Gather: light is drawn in from all round, low to the ground, and climbs to the chest */
    if(W.ki>.5&&every('ki',.085,dt)){const an=R_(0,TAU),r=R_(46,70);W.motes.push({t:0,L:R_(.55,.8),an,r,z:R_(2,22),c:typeof ktL==='function'&&ktL('kcStill')>0&&Math.random()<.5?'#7fe8c0':'#cfe8ff'});}
    for(let i=W.motes.length-1;i>=0;i--){const m=W.motes[i];m.t+=dt;if(m.t>m.L)W.motes.splice(i,1);}
    /* Sakura Dance: a petal now and then, loosened from the dance */
    if(typeof hasBuff==='function'&&hasBuff('kaSakura')&&every('sak',.26,dt)){const an=R_(0,TAU),r=R_(14,34);petals(player.x+Math.cos(an)*r,player.y+Math.sin(an)*r*.7,R_(30,70),1,{spd:16,up:8,term:.8});}
    if(KTV.watch)KTV.watch(dt,this.t);
    return CHAR==='cat';}
  draw(){const t=this.t;
    if(W.ki>0){for(let i=0;i<4;i++)kumoAt(i,t,true);ctx.save();ctx.lineCap='round';for(const m of W.motes){const u=eI(m.t/m.L),r=m.r*(1-u),z=m.z+(36-m.z)*u,an=m.an+u*1.4,[x,y]=P(player.x+Math.cos(an)*r,player.y+Math.sin(an)*r*.8,z),u0=Math.max(0,u-.09),r0=m.r*(1-u0),[x0,y0]=P(player.x+Math.cos(m.an+u0*1.4)*r0,player.y+Math.sin(m.an+u0*1.4)*r0*.8,m.z+(36-m.z)*u0);
        ctx.globalAlpha=W.ki*Math.sin(Math.PI*Math.min(1,m.t/m.L*1.05))*.9;ctx.strokeStyle='#3f6fb8';ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();ctx.strokeStyle=m.c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();}ctx.restore();}
    if(W.ash>0)ashuraFlames(W.ash,t,true);
    if(KTV.topExtra)KTV.topExtra(t);}}

/* ---------------------------------------------------------------------
   6. BASIC — Wandering Kitten: plain steel, straw and the cat himself (paws, eyes, nine lives)
   --------------------------------------------------------------------- */
/* Paw-Blade Combo: thin steel cuts. 1 rises with the draw, 2 comes back down, 3 sweeps flat, the finisher is a tall heavy cut */
KTV.basic=function(a,idx,fin,phi,tC){const lead=cl((tC-a.t)/TEMPO(),.012,.1);
  cut(fin?'up':['rise','fall','flat'][idx%3],{phi,lead,R:fin?80:62,W:fin?19:12,pal:PAL.steel,sweep:lead+(fin?.075:.05),fade:fin?.2:.13,ink:.55,glint:fin?1.3:1});};
/* the finisher stamps a paw on what it hits */
KTV.HIT.basic=function(e,big,crit,o){if(o&&o.ktFin){sprite({n:'paw',follow:e,z:zOf(e)+8,w:30*(e.boss?1.3:1),life:.42,s0:.4,s1:1,pop:.14,fo:.2,rot:R_(-.3,.3),under:'#7a4a12',ua:.5,layer:'top'});stones(e.x,e.y,3,{spd:120,up:160,s:.7});}};
/* Crescent Finish (C): the finisher becomes a moon-coloured cut all the way round the cat */
KTV.crescentFinish=function(x,y,R,phi){addFx(new KArc({x,y,follow:1,fz:34,phi,tilt:.1,a0:-2.4,a1:-2.4+TAU,hit:0,lead:.035,sweep:.2,hold:.03,fade:.2,R:R*.92,W:22,pal:PAL.moon,ink:.5,N:44,pet:.3}));
  ring({x,y,r0:14,r1:R,w:6,pal:PAL.moon,life:.38});petals(x,y,26,8,{spd:170,up:60,im:'petalW'});};
/* dashes. Cat Step: paw prints stamped one after another along the way, a kick of dust, a thin streak that rides with the cat */
KTV.dash=function(key,sx,sy,dx,dy,phi,T,o){const L=Math.hypot(dx-sx,dy-sy),f=KTV.DASH[key];if(f&&f(sx,sy,dx,dy,phi,T,L,o)===true)return;
  dust(sx,sy,3,{size:26,spd:46,dir:phi+Math.PI,spread:.7,life:.5});addFx(new KStreak({a:[sx,sy],b:[sx,sy],live:rt(T),pal:PAL.steel,w:6,life:.18,ink:.35}));
  const n=Math.max(2,Math.round(L/42));for(let i=0;i<n;i++){const u=(i+.6)/n,sd=i%2?5:-5;sprite({layer:'ground',x:sx+(dx-sx)*u-Math.sin(phi)*sd,y:sy+(dy-sy)*u+Math.cos(phi)*sd,delay:rt(T)*u,life:1.6,fi:.03,fo:.7,paint:(f,x,y)=>{const pr=PRINT(x,y);ctx.globalAlpha*=.62;art('paw',x,y,15,{flat:1,rot:phi+Math.PI/2,im:pr});}});}};
KTV.DASH={};
/* a paw print pressed into the ground: darker than whatever it is printed on */
const PRINT=()=>tint('paw','#4d4468');KTV.dashTick=function(key,a,dt,T){const f=KTV.DTICK[key];if(f)f(a,dt,T);return true;};KTV.DTICK={};
/* Sheath Strike: the lacquered scabbard, blunt — no cutting edge, a thud, stars round the head while it reels */
KTV.SW.knSheath=function(c,lead){cut('rise',{phi:c.phi,lead,R:60,W:17,pal:PAL.lacquer,edge:0,glint:0,ink:.6,sweep:lead+.07,fade:.16});return true;};
KTV.HIT.knSheath=function(e){const z=zOf(e),bs=e.boss?1.3:1;addFx(new KBurst({e,x:e.x,y:e.y,z,R:38*bs,n:8,pal:PAL.gold,life:.22}));ring({x:e.x,y:e.y,r0:8,r1:50*bs,w:5,pal:PAL.gold,life:.3});dust(e.x,e.y,3,{size:30,spd:44,life:.5});
  sprite({follow:e,layer:'top',z:(e.boss?92:60),life:.6,fi:.05,fo:.2,paint:(f,x,y)=>{for(let i=0;i<3;i++){const an=f.t*7+i*TAU/3,sn=Math.sin(an);star(x+Math.cos(an)*15*bs,y+sn*5*bs,(5+1.5*sn)*bs,'#ffc23a',an);}}});return true;};
/* Ki Gather */
KTV.kiStart=function(){ring({x:player.x,y:player.y,r0:64,r1:10,w:4,pal:PAL.wind,life:.45,segs:4,gap:.4});};
/* Feline Focus: a cat's eye opens above him, gold light closes on the blade */
KTV.focus=function(){sprite({follow:player,layer:'top',z:96,life:.62,fi:.03,fo:.12,paint:(f,x,y,s,a)=>{const o=cl(f.t/.09,0,1),c=cl((f.life-f.t)/.1,0,1),k=Math.min(eO(o),c);art('eye',x,y,50,{sy:Math.max(.04,k),a:1,under:'#3a2206',ua:.5});}});
  ring({x:player.x,y:player.y,r0:66,r1:12,w:5,pal:PAL.gold,life:.4,segs:4,gap:.35});const h=hand();addFx(new KGlint({x:h[0],y:h[1],z:h[2]+14,s:16,col:'#ffc23a',life:.3,delay:.3}));};
/* Mino Cloak shakes a debuff off: straw flies */
KTV.cloak=function(){straw(player.x,player.y,36,9,{spd:170,up:170});ring({x:player.x,y:player.y,r0:10,r1:46,w:4,pal:PAL.gold,life:.3});};
/* Nine Lives: nine spirit flames stand round the cat, one goes out */
KTV.nine=function(){sprite({follow:player,layer:'top',z:0,life:1.25,fi:.05,fo:.3,paint:(f,x,y,s,a)=>{const t=f.t;for(let i=0;i<9;i++){const an=t*2.2+i*TAU/9,sn=Math.sin(an),out=i===0?cl((t-.3)/.22,0,1):0;if(out>=1)continue;
      const [fx_,fy]=P(player.x+Math.cos(an)*42,player.y+sn*42,6+4*Math.sin(t*9+i));art('hitodamaG',fx_,fy,(13+2*sn)*(1-out),{ay:.9,sy:1+.12*Math.sin(t*14+i*2)+out*.6,a:1-out,under:'#7a4a12',ua:.4});}}});
  ring({x:player.x,y:player.y,r0:12,r1:70,w:6,pal:PAL.gold,life:.45});setTimeout(()=>{},0);addFx(new KGlint({x:player.x,y:player.y,z:50,s:26,col:'#ffc23a',life:.3}));
  addFx(new KSprite({x:player.x+42,y:player.y,z:10,life:.5,delay:.3,layer:'top',paint:()=>{}}));dust(player.x+42,player.y,2,{size:22,spd:20,life:.5,tint:'#e8e8f0|#8a8aa8',z:10});};

/* ---------------------------------------------------------------------
   7. THE OLD LOOK IS SWITCHED OFF
   Engine pieces the cat's old code still adds (rings, impacts, hit crescents, dust puffs, round particles) are dropped,
   the painted pictures (KtImg) and code arcs (KtArc) are swallowed and answered by the hooks below.
   --------------------------------------------------------------------- */
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('cat');        /* no toon-layer charge glow / stretched lifetimes for the cat */
/* only what the cat's own skill code makes is touched (a skill is running: SKCTX / an action event / the cat's core ticker);
   a boss's rings and impacts are the boss's and stay as they are */
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__KTSELF),DROPN=new Set(['GRing','Impact','Crack','CrackStar','Streak']);
if(!window._ktv3h){window._ktv3h=1;
  const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
      if(n==='HitCrescents'||n==='PuffDust')return f;                 /* these only ever come from the player's own hits */
      if(DROPN.has(n)&&mine()){if(f.color==='#ffe9a8'){              /* enhancement skills (skill_enh.js): same effect, new look */
          if(n==='GRing')A0(new KRing({x:f.x,y:f.y,r0:f.r0,r1:f.r1,w:5,pal:PAL.gold,life:f.life||.3}));
          else if(n==='Impact'){const q=f.pos||[f.x,f.y,24];A0(new KGlint({x:q[0],y:q[1],z:q[2],s:13,col:PAL.gold[2],life:.16}));}}
        return f;}}
    return A0.apply(this,arguments);};
  const E0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock)$/.test(o.type))return;return E0.apply(this,arguments);};}
/* a cut on a target that the old code asked for with KtArc (echo hits, clone hits, storm cuts) */
KTV.arc=function(o){const c=o.col,pal=(c===KTC.oni||c===KTC.oni2)?PAL.oni:c===KTC.white?PAL.steel:c===KTC.sakura2?PAL.echo:PAL.sakura,R=o.R||44;
  addFx(new KLine({x:o.x,y:o.y,z:o.z||30,ang:R_(-1.2,1.2),L:R*1.9,w:R>=52?4.2:3.2,pal,hold:.03,fade:.13,ink:.35}));return true;};
/* painted pictures: all swallowed; three of them stand for a whole effect */
KTV.img=function(o){const n=o&&o.n;if(n==='09_crater')crater(o.x,o.y,o.w||170);else if(n==='12_roar')roar();else if(n==='14_hana')hana(o);return true;};
/* the ground breaks under a heavy landing (Earthfall, Sky Drop, Avalanche, Oni Cleave) */
/* owner 2026-11-20: painted ground crack, no fire — it cracks open from the impact point, the slabs jolt, then it fades */
const KCRATER=new Image();KCRATER.src='assets/fx/cat/k_crater.webp';
class KCraterPic{constructor(o){Object.assign(this,{t:0,layer:'ground',w:200,life:1.7},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const im=KCRATER;if(!im.complete||!im.naturalWidth)return;const [x,y]=P(this.x,this.y,0),W=this.w,H=W*im.naturalHeight/im.naturalWidth,t=this.t;
    const open=eO(cl(t/.13,0,1)),jolt=t<.13?1:1+.07*Math.sin(cl((t-.13)/.16,0,1)*Math.PI),a=cl((this.life-t)/.55,0,1);if(a<=0)return;
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.beginPath();ctx.ellipse(0,0,W*.56*open+2,H*.6*open+2,0,0,TAU);ctx.clip();ctx.scale(jolt,2-jolt);ctx.drawImage(im,-W/2,-H*.5,W,H);ctx.restore();}}
function crater(x,y,w){const sc=cl(w/170,.8,1.6);addFx(new KCraterPic({x,y,w:190*sc}));dust(x,y,7,{ring:24*sc,size:54*sc,spd:95,life:.9});stones(x,y,Math.round(7*sc),{spd:240,up:300});}
KTV.crater=crater;
/* a blink from one place to another */
KTV.blink=function(ox,oy,bx,by,kind){GALE_N=0;addFx(new KStreak({a:[ox,oy],b:[bx,by],pal:kind==='wind'?PAL.wind:PAL.sakura,w:9,life:.22}));};
let GALE_N=0;

/* ---------------------------------------------------------------------
   8. A · KAZE RONIN — sakura and wind: thin, fast, exact. Cuts are lines left on the target; petals follow every cut.
   --------------------------------------------------------------------- */
/* a moon-shaped blade seen from the side, its round edge leading (+x) */
function crescent(x,y,rot,R,sx,p,a,ink=.45){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(sx,1);
  const sh=(r,off,th)=>{const q=Math.atan2(r*Math.sin(th),r*Math.cos(th)+off);ctx.beginPath();ctx.arc(0,0,r,-th,th);ctx.arc(-off,0,Math.hypot(r*Math.cos(th)+off,r*Math.sin(th)),q,-q,true);ctx.closePath();};
  if(ink>0){ctx.globalAlpha=a*ink;sh(R+3,R*.66,1.4);ctx.fillStyle=p[0];ctx.fill();}
  ctx.globalAlpha=a;sh(R,R*.5,1.34);ctx.fillStyle=p[1];ctx.fill();sh(R-1,R*.33,1.26);ctx.fillStyle=p[2];ctx.fill();sh(R-1.6,R*.19,1.14);ctx.fillStyle=p[3];ctx.fill();sh(R-2,R*.08,.96);ctx.fillStyle=p[4];ctx.fill();ctx.restore();}
/* travelling blades (KtWave.draw): Crescent Wind, Cleaving Wind / Final Cleave, Gale Lunge */
KTV.wave=function(w){const [x,y]=P(w.x,w.y,w.z),a=cl((w.life-w.t)*8,0,1)*cl(w.t*40,0,1),c=scr(w.phi),sq=.5+.5*Math.abs(Math.cos(w.phi)),key=w.key;if(a<=0)return true;
  const wake=(p,L,H,n)=>{ctx.save();ctx.translate(x,y);ctx.rotate(c);for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0,yy=u*H,x0=-6-Math.abs(u)*8,len=L*(1-.35*Math.abs(u))*(.8+.2*Math.sin(w.t*40+i*2));
      ctx.globalAlpha=a*.5;ctx.fillStyle=p[2];ctx.beginPath();ctx.moveTo(x0,yy-2.2);ctx.lineTo(x0-len,yy);ctx.lineTo(x0,yy+2.2);ctx.closePath();ctx.fill();ctx.globalAlpha=a*.8;ctx.fillStyle=p[4];ctx.beginPath();ctx.moveTo(x0,yy-.9);ctx.lineTo(x0-len*.6,yy);ctx.lineTo(x0,yy+.9);ctx.closePath();ctx.fill();}ctx.restore();};
  if(key==='kcLunge'){const p=PAL.wind;wake(p,70,10,3);ctx.save();ctx.translate(x,y);ctx.rotate(c);const lens=(L,h,col,al)=>{ctx.globalAlpha=a*al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-L*.75,0);ctx.quadraticCurveTo(L*.1,-h,L*.4,0);ctx.quadraticCurveTo(L*.1,h,-L*.75,0);ctx.fill();};
    lens(96,13,p[0],.4);lens(88,9.5,p[1],1);lens(80,6.5,p[2],1);lens(66,3.6,p[4],1);ctx.restore();crescent(x+Math.cos(c)*30,y+Math.sin(c)*30,c,17,sq*.8,p,a,.35);return true;}
  if(w.heavy){const p=PAL.oni,R=w.R*1.5;wake(p,R*1.2,R*.55,4);crescent(x,y,c,R,sq*.62,p,a,.5);return true;}
  const p=PAL.sakura,R=w.R*1.55;wake(p,R*1.4,R*.6,5);crescent(x,y,c,R,sq*.9,p,a,.45);return true;};

/* Swift Draw: a blink (it is over before the first cut), two cuts that leave a narrow X on the target */
KTV.swiftStart=function(sx,sy,dx,dy,phi){const L=Math.hypot(dx-sx,dy-sy);addFx(new KStreak({a:[sx,sy],b:[dx,dy],pal:PAL.sakura,w:11,life:.24}));dust(sx,sy,3,{size:28,spd:50,dir:phi+Math.PI,spread:.7,life:.5});
  const n=Math.round(L/34);for(let i=0;i<n;i++){const u=(i+.5)/n;petals(sx+(dx-sx)*u,sy+(dy-sy)*u,24,1,{spd:36,up:30,delay:.02+i*.012});}};
KTV.SW.kaSwift=function(c,lead){cut(c.i?'fall':'rise',{phi:c.phi,lead,R:58,W:11,pal:PAL.sakura,sweep:lead+.05,fade:.13,pet:.2});return true;};
KTV.HIT.kaSwift=function(e,big,crit,o){const n=(o&&o.ktStack)||0,z=zOf(e);addFx(new KLine({e,x:e.x,y:e.y,z,ang:scr(player.phi)+(n%2?-.52:.52),L:e.boss?130:98,w:4,pal:PAL.sakura,hold:.1,fade:.16}));
  addFx(new KGlint({e,x:e.x,y:e.y,z,s:n?17:13,col:PAL.sakura[2],life:.18}));petals(e.x,e.y,z,3,{spd:110,up:80});return true;};

/* Swallow Cuts: every cut lets a swallow go; it darts through the target and climbs or dives away */
function swallow(phi,lead,side,sc){const x0=player.x+Math.cos(phi)*16,y0=player.y+Math.sin(phi)*16,D=175,pos=u=>P(x0+Math.cos(phi)*D*u,y0+Math.sin(phi)*D*u,30+side*34*u*u);
  sprite({x:x0,y:y0,z:30,delay:Math.max(0,lead-.02),life:.24,fi:.02,fo:.1,layer:'top',paint:f=>{const u=f.t/f.life,[px,py]=pos(u),[qx,qy]=pos(u+.06),rot=Math.atan2(qy-py,qx-px);
      art('swallow',px,py,48*sc,{rot,sy:Math.cos(rot)<0?-1:1,under:'#3d0c26',ua:.4});}});}
KTV.SW.kaSwallow=function(c,lead){const up=c.i%2===0;cut(up?'rise':'fall',{phi:c.phi,lead,R:c.last?66:56,W:c.last?14:10,pal:PAL.sakura,sweep:lead+.05,fade:.12,pet:c.last?.3:0});
  swallow(c.phi,lead,up?1:-1,c.last?1.25:1);if(c.last)swallow(c.phi,lead,up?-1:1,1.1);return true;};

/* Wind Return: a wide rising cut in wind colours, the jump back rides a streak, the after-image answers with a pale cut */
KTV.SW.kaReturn=function(c,lead){cut('rise',{phi:c.phi,lead,R:74,W:19,pal:PAL.wind,sweep:lead+.06,fade:.17,pet:.3});return true;};
KTV.returnAfter=function(sx,sy,dx,dy,phi){addFx(new KStreak({a:[sx,sy],b:[sx,sy],live:rt(.2),pal:PAL.wind,w:8,life:.2,ink:.3}));ring({x:sx,y:sy,r0:8,r1:56,w:4,pal:PAL.wind,life:.3});
  ktLater(.15,()=>addFx(new KArc({x:sx,y:sy,z:38,phi,tilt:1.05,a0:-1,a1:1.7,lead:.03,sweep:.09,fade:.17,R:64,W:15,pal:PAL.echo,ink:.3})));};

/* Mirage Step: the decoy left behind bursts into petals with a cut all round it */
KTV.DASH.kaMirage=function(sx,sy,dx,dy,phi,T){addFx(new KStreak({a:[sx,sy],b:[sx,sy],live:rt(T),pal:PAL.sakura,w:7,life:.2,ink:.3}));petals(sx,sy,24,3,{spd:60});return true;};
KTV.DTICK.kaMirage=function(a,dt){if(every('mir',.04,dt))petals(player.x,player.y,22,1,{spd:22,up:18});};
KTV.mirageBurst=function(sx,sy){whirlPetals(sx,sy,12,{r0:4,r1:24,hold:.22,va:10,out:70,z0:10,z1:46});
  addFx(new KArc({x:sx,y:sy,z:30,phi:R_(0,TAU),tilt:.1,a0:0,a1:TAU,hit:.5,lead:.02,sweep:.16,hold:.02,fade:.16,R:66,W:14,pal:PAL.sakura,N:40,glint:0}));ring({x:sx,y:sy,r0:10,r1:84,w:5,pal:PAL.sakura,life:.32});};

/* Sakura Dance: a blossom opens under the cat and petals spiral up; while it lasts a faint blossom stays on the ground */
KTV.sakuraOn=function(){const x=player.x,y=player.y;sprite({n:'blossom',layer:'ground',flat:1,x,y,w:124,life:.95,fi:.04,fo:.5,s0:.25,s1:1,pop:.26,spin:.9,under:'#7a1040',ua:.25});
  whirlPetals(x,y,16,{r0:10,r1:40,hold:.6,va:8,out:26,z0:4,z1:64});ring({x,y,r0:10,r1:92,w:6,pal:PAL.sakura,life:.4});};

/* Thousand Petals: each victim is cut and left wearing a blossom; Petal Fall: the sword clicks home and every blossom bursts */
const MARKS=new Map();
KTV.petalCut=function(e,px,py,i){const z=zOf(e);addFx(new KStreak({a:[px,py],b:[player.x,player.y],pal:PAL.sakura,w:6,life:.16,ink:.3}));
  addFx(new KLine({e,x:e.x,y:e.y,z,ang:R_(-1.1,1.1),L:e.boss?90:66,w:3.6,pal:PAL.sakura,hold:.05}));petals(e.x,e.y,z,2,{spd:90,up:70});
  const old=MARKS.get(e);if(old)old.life=Math.min(old.life,old.t+.05);MARKS.set(e,sprite({n:'blossom',follow:e,z:z+(e.boss?40:26),w:e.boss?30:22,life:2.6,fi:.03,fo:.3,s0:.2,s1:1,pop:.2,layer:'top',under:'#7a1040',ua:.45,until:()=>!e.dead}));};
KTV.petalBack=function(fx_,fy,sx,sy){addFx(new KStreak({a:[fx_,fy],b:[sx,sy],pal:PAL.sakura,w:6,life:.16,ink:.3}));};
KTV.petalFallStart=function(list,tP){const h=hand();addFx(new KGlint({x:h[0],y:h[1],z:h[2]-8,s:15,col:PAL.sakura[2],life:.22,delay:Math.max(0,rt(tP)-.13)}));};
KTV.petalFallHit=function(e){const z=zOf(e),s=R_(-.3,.3),m=MARKS.get(e);if(m){m.life=Math.min(m.life,m.t+.05);MARKS.delete(e);}
  for(const d of [.75,-.75])addFx(new KLine({e,x:e.x,y:e.y,z,ang:s+d,L:e.boss?150:112,w:5,pal:PAL.sakura,hold:.1,fade:.2}));
  sprite({n:'blossom',follow:e,z:z+4,w:e.boss?84:62,life:.4,fi:.01,fo:.3,s0:.4,s1:1.25,layer:'top',under:'#7a1040',ua:.3});whirlPetals(e.x,e.y,8,{r0:4,r1:18,hold:.18,va:10,out:100,z0:z-6,z1:z+14});};

/* Gale Counter: a ring of wind turns round the cat while it waits; the answer is a fan of thin cuts */
KTV.galeStance=function(win){sprite({follow:player,layer:'ground',z:0,life:win+.3,fi:.08,fo:.15,until:()=>CAT.gale>gameTime,paint:(f,x,y)=>{ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';
    for(let i=0;i<3;i++){const s=f.t*5.5+i*TAU/3;ctx.strokeStyle='#2a8fd0';ctx.lineWidth=4.2;ctx.beginPath();ctx.arc(0,0,34,s,s+1.3);ctx.stroke();ctx.strokeStyle='#e8fbff';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(0,0,34,s+.15,s+1.2);ctx.stroke();}}});};
KTV.SW.kaGale=function(c,lead){cut(c.i%2?'fall':'rise',{phi:c.phi,lead,R:58,W:10,pal:PAL.wind,sweep:lead+.045,fade:.11});return true;};
KTV.HIT.kaGale=function(e){const z=zOf(e),i=(GALE_N++)%5;addFx(new KLine({e,x:e.x,y:e.y,z,ang:scr(player.phi)-.84+i*.42,L:e.boss?120:88,w:3.4,pal:PAL.wind,hold:.14,fade:.14}));
  addFx(new KGlint({e,x:e.x,y:e.y,z,s:12,col:PAL.wind[2],life:.15}));return true;};

/* Tempest Iai: every cut stays on the target as a line; when the sword is home they all close at once */
KTV.tempestCut=function(t,i,n,an,remain){const z=zOf(t),hold=rt(remain)+.07;addFx(new KLine({e:t,x:t.x,y:t.y,z:z+((i*7)%5-2)*3,ang:((i*2.399)%Math.PI)-Math.PI/2,L:(t.boss?100:72)+(i%3)*12,w:3.3,grow:.03,hold,fade:.14,pal:i%2?PAL.steel:PAL.sakura,ink:.3}));
  if(i%2===0)petals(t.x,t.y,z,1,{spd:90,up:60});};
KTV.tempestEnd=function(t){if(!t||t.dead)return;const z=zOf(t),h=hand();ktLater(.07,()=>{addFx(new KBurst({e:t,x:t.x,y:t.y,z,R:t.boss?62:48,n:12,pal:PAL.sakura,life:.26}));petals(t.x,t.y,z,10,{spd:190,up:110});ring({x:t.x,y:t.y,r0:10,r1:74,w:5,pal:PAL.sakura,life:.32});});
  addFx(new KGlint({x:h[0],y:h[1],z:h[2]-8,s:14,col:PAL.sakura[2],life:.2}));};

/* Hanafubuki: a pink wind turns over the whole field, petals ride it, blades of wind keep crossing it */
class KHana{constructor(o){Object.assign(this,{t:0,layer:'ground',R:120,life:3},o);this.acc=0;this.acc2=0;this.rot=R_(0,TAU);}
  update(dt){this.t+=dt;const R=this.R;if(this.t<this.life-.3){this.acc+=dt;while(this.acc>.03){this.acc-=.03;whirlPetals(this.x,this.y,1,{r0:R*.2,r1:R*.98,hold:R_(.5,1),va:5,out:10,z0:6,z1:80});}
      this.acc2+=dt;if(this.acc2>.16){this.acc2=0;addFx(new KArc({x:this.x,y:this.y,z:R_(14,62),phi:R_(0,TAU),tilt:R_(-.14,.14),a0:0,a1:R_(2,2.8),hit:1,lead:.05,sweep:.2,hold:0,fade:.22,R:R*R_(.45,.95),W:R_(10,16),pal:Math.random()<.3?PAL.echo:PAL.sakura,ink:.3,glint:0,edge:.16,N:16}));}}
    return this.t<this.life;}
  draw(){const a=cl(this.t/.3,0,1)*cl((this.life-this.t)/.25,0,1),R=this.R,[x,y]=P(this.x,this.y,0);if(a<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,R*.1,0,0,R);g.addColorStop(0,`rgba(255,110,165,${.32*a})`);g.addColorStop(.7,`rgba(255,150,195,${.2*a})`);g.addColorStop(1,'rgba(255,170,205,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.lineCap='round';for(let i=0;i<3;i++){const r=R*(.42+.25*i),s=this.rot+this.t*(2.6-.6*i)*(i%2?-1:1);for(let j=0;j<3;j++){const b=s+j*TAU/3;ctx.globalAlpha=a*.55;ctx.strokeStyle='#d81e6f';ctx.lineWidth=4.5;ctx.beginPath();ctx.arc(0,0,r,b,b+1.25);ctx.stroke();
        ctx.globalAlpha=a*.9;ctx.strokeStyle='#ffd0e2';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,b+.1,b+1.15);ctx.stroke();}}ctx.restore();}}
function hana(o){addFx(new KHana({x:o.x,y:o.y,R:(o.w||200)/1.5,life:rt((o.life||3)+.05)-.05}));}
KTV.hanaEnd=function(sx,sy,R){petals(sx,sy,30,22,{spd:260,up:120});ring({x:sx,y:sy,r0:20,r1:R*1.1,w:8,pal:PAL.sakura,life:.5,segs:5});addFx(new KBurst({x:sx,y:sy,z:30,R:64,n:12,pal:PAL.sakura,life:.3}));};

/* ---------------------------------------------------------------------
   9. B · ONI RONIN — fire and stone: slow, heavy, the ground pays for every blow.
   --------------------------------------------------------------------- */
/* a crack torn in the ground: opens from its start to its tip, glows hot, then cools and closes */
class KFissure{constructor(o){Object.assign(this,{t:0,layer:'ground',len:120,grow:.12,life:1.5,w:6,hot:0,jag:7,lin:0,delay:0},o);this.t=-this.delay;const n=Math.max(4,Math.round(this.len/14));this.pts=[];
    for(let i=0;i<=n;i++)this.pts.push([i/n*this.len,i&&i<n?R_(-1,1)*this.jag:0,R_(.6,1.15)]);this.br=[];for(let i=2;i<n-1;i+=2)if(Math.random()<.65)this.br.push([i,(Math.random()<.5?-1:1)*R_(.5,1.1),R_(12,26)]);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const k=cl(this.t/this.grow,0,1),d=this.len*(this.lin?k:eO(k)),a=cl((this.life-this.t)/.6,0,1),heat=cl(1-(this.t-this.grow)/.8,0,1),c=Math.cos(this.phi),s=Math.sin(this.phi);if(a<=0||d<6)return;
    const Wp=(l,o)=>P(this.x+c*l-s*o,this.y+s*l+c*o,0),pts=this.pts.filter(p=>p[0]<=d),last=this.pts[Math.min(this.pts.length-1,pts.length)];
    const path=wk=>{const L=[],Rr=[];for(const [l,o,wv] of pts){const hw=this.w*wk*wv*(1-Math.pow(l/d,2.4)*.9)*.5;L.push(Wp(l,o-hw));Rr.push(Wp(l,o+hw));}if(L.length<2)return false;
      const tip=Wp(d,last?last[1]*(d-pts[pts.length-1][0])/14:0);ctx.beginPath();L.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.lineTo(tip[0],tip[1]);for(let i=Rr.length-1;i>=0;i--)ctx.lineTo(Rr[i][0],Rr[i][1]);ctx.closePath();return true;};
    ctx.save();ctx.lineJoin='round';ctx.globalAlpha=a*.45;if(path(2.6)){ctx.fillStyle='#4a3024';ctx.fill();}ctx.globalAlpha=a;if(path(1.3)){ctx.fillStyle='#1c100c';ctx.fill();}
    for(const [i,dir,len] of this.br){const p=this.pts[i];if(p[0]>d-8)continue;const A_=Wp(p[0]-3,p[1]),B_=Wp(p[0]+3,p[1]),C_=Wp(p[0]+len*.7,p[1]+dir*len);ctx.fillStyle='#1c100c';ctx.beginPath();ctx.moveTo(A_[0],A_[1]);ctx.lineTo(C_[0],C_[1]);ctx.lineTo(B_[0],B_[1]);ctx.closePath();ctx.fill();}
    if(this.hot&&heat>0){ctx.globalAlpha=a*heat;if(path(.82)){ctx.fillStyle='#ff5a1a';ctx.fill();}if(path(.4)){ctx.fillStyle='#ffd27a';ctx.fill();}}
    ctx.restore();}}
/* a stone spike thrown up out of the ground; it stands a moment, then sinks */
class KSpike{constructor(o){Object.assign(this,{t:0,layer:'sorted',h:30,w:16,life:1.1,delay:0,hot:0},o);this.t=-this.delay;this.lean=R_(-.3,.3);this.m=R_(.34,.56);}
  get sy(){return this.y;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const up=back(cl(this.t/.11,0,1)),dn=cl((this.life-this.t)/.3,0,1),h=this.h*up*(.2+.8*dn),w=this.w*(.65+.35*dn),[x,y]=P(this.x,this.y,0);if(h<1.5)return;
    const tx_=x+this.lean*h,ty=y-h,xl=x-w/2,xr=x+w/2,xm=xl+w*this.m;ctx.save();ctx.globalAlpha=cl(dn*1.6,0,1);
    if(this.hot){const g=cl(1-this.t/.55,0,1);if(g>0){ctx.globalAlpha=g*.85;ctx.fillStyle='#ff6a1e';ctx.beginPath();ctx.ellipse(x,y+1,w*.75,w*.26,0,0,TAU);ctx.fill();ctx.globalAlpha=cl(dn*1.6,0,1);}}
    ctx.fillStyle='#2e211b';ctx.beginPath();ctx.moveTo(xl-2,y+2);ctx.lineTo(tx_,ty-2.5);ctx.lineTo(xr+2,y+2);ctx.closePath();ctx.fill();
    ctx.fillStyle='#93796a';ctx.beginPath();ctx.moveTo(xl,y);ctx.lineTo(tx_,ty);ctx.lineTo(xm,y+1.5);ctx.closePath();ctx.fill();
    ctx.fillStyle='#5a4840';ctx.beginPath();ctx.moveTo(xm,y+1.5);ctx.lineTo(tx_,ty);ctx.lineTo(xr,y);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d2bca6';ctx.beginPath();ctx.moveTo(xl+w*.1,y-h*.14);ctx.lineTo(tx_,ty);ctx.lineTo(xl+w*.27,y-h*.1);ctx.closePath();ctx.fill();ctx.restore();}}

/* charging (KtCharge): ki is drawn into the blade from all round, rings close in faster and faster, the blade catches fire */
const CH=[];
KTV.chargeTick=function(ch,dt){const k=cl(ch.t/ch.T,0,1);if(ch.t<=dt*1.5)CH.length=0;ch._a=(ch._a||0)+dt;const iv=.075-.04*k;while(ch._a>iv){ch._a-=iv;CH.push({t:0,L:R_(.24,.34)-.08*k,an:R_(0,TAU),r:R_(50,78),z:R_(0,50)});}
  for(let i=CH.length-1;i>=0;i--){CH[i].t+=dt;if(CH[i].t>CH[i].L)CH.splice(i,1);}
  ch._r=(ch._r||0)+dt;if(ch._r>.44-.22*k){ch._r=0;ring({x:player.x,y:player.y,follow:1,r0:74,r1:14,w:4+2*k,pal:PAL.oni,life:.3,segs:4,gap:.35,ease:eI});}};
KTV.chargeStage=function(ch,st){const h=hand(),x=player.x,y=player.y;addFx(new KGlint({x:h[0],y:h[1],z:h[2]+10,s:st===2?24:16,col:'#ffb347',life:.22}));ring({x,y,r0:12,r1:st===2?84:56,w:5,pal:PAL.oni,life:.3});
  if(st===2)embers(x,y,30,8,{spd:120,up:220});if(st===1&&ch.a&&ch.a.key==='kbExec'&&ktL('kcOni'))SPIRIT=spirit({life:9,fi:.45,fo:.15,s0:.72,s1:1,pop:.5,a:.55,until:()=>player.action===ch.a});};
KTV.chargeDraw=function(ch){const k=cl(ch.t/ch.T,0,1),h=hand();ctx.save();ctx.lineCap='round';for(const m of CH){const u=eI(m.t/m.L),u0=Math.max(0,u-.16),pt=q=>P(lerp(player.x+Math.cos(m.an)*m.r,h[0],q),lerp(player.y+Math.sin(m.an)*m.r*.8,h[1],q),lerp(m.z,h[2],q)),[x0,y0]=pt(u0),[x1,y1]=pt(u);
    ctx.globalAlpha=Math.sin(Math.PI*Math.min(1,m.t/m.L))*.95;ctx.strokeStyle='#a8140c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=k>.95?'#fff3c8':'#ffb347';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}ctx.restore();
  const [fx_,fy]=P(h[0],h[1],h[2]);art('flame'+(((ch.t*14)|0)%3),fx_,fy+2,8+13*k,{ay:.92,a:.92,sy:1+.12*Math.sin(ch.t*30)});return true;};

/* heavy cuts */
const heavy=(R,W,o)=>(c,lead)=>{cut(o&&o.shape||'up',Object.assign({phi:c.phi,lead,R,W,pal:PAL.oni,emb:.7,sweep:lead+.08,fade:.22,z:42},o&&o.o));return true;};
KTV.SW.kbCleave=heavy(92,34);KTV.SW.kbRising=heavy(84,26);KTV.SW.kbFinal=heavy(100,38,{o:{emb:1}});KTV.SW.kbExec=heavy(104,40,{o:{emb:1,fade:.28}});
KTV.SW.kbEarth=heavy(86,30,{shape:'down'});KTV.SW.kbSky=heavy(96,36,{shape:'down'});KTV.SW.kbQuake=heavy(72,26,{shape:'flat',o:{pal:PAL.earth,z:16,emb:.4}});
/* Mountain Cleave: the ground ahead splits in a fan */
KTV.cleaveAfter=function(phi){const x=player.x+Math.cos(phi)*18,y=player.y+Math.sin(phi)*18;for(const d of [-.4,0,.4])addFx(new KFissure({x,y,phi:phi+d,len:d?92:126,grow:.1,life:1.5,w:d?5.5:7.5}));
  dust(x+Math.cos(phi)*30,y+Math.sin(phi)*30,3,{size:40,spd:80,dir:phi,spread:1.3,life:.7,a:.6});stones(x+Math.cos(phi)*30,y+Math.sin(phi)*30,7,{dir:phi,spread:.7,spd:260,up:280});ring({x:x+Math.cos(phi)*34,y:y+Math.sin(phi)*34,r0:10,r1:70,w:6,pal:PAL.oni,life:.34});};
/* Rising Split: the cut leaves a standing line of fire on what it lifts */
KTV.HIT.kbRising=function(e){const z=zOf(e);addFx(new KLine({e,x:e.x,y:e.y,z:z+12,ang:-Math.PI/2,L:e.boss?150:118,w:5.5,grow:.04,hold:.08,fade:.2,pal:PAL.oni}));embers(e.x,e.y,z,6,{spd:60,up:320});};
/* Sky Drop: a line of fire falls with the cat */
KTV.skyLand=function(){addFx(new KLine({x:player.x,y:player.y,z:78,ang:Math.PI/2,L:176,w:8,grow:.03,hold:.05,fade:.2,pal:PAL.oni,ink:.4}));};
/* Oni Roar: the oni's face looms behind the cat, the roar rolls out in rings */
function roar(){const x=player.x,y=player.y;for(let i=0;i<3;i++)ring({x,y,r0:18,r1:118+i*28,w:7-i,pal:PAL.oni,life:.45+i*.06,segs:6,gap:.3,delay:i*.07});
  sprite({n:'oniFace',layer:'ground',follow:player,oy:-6,z:64,w:112,life:.8,fi:.04,fo:.35,s0:.45,s1:1.1,pop:.18,under:'#2a0606',ua:.45});embers(x,y,40,12,{spd:200,up:200});dust(x,y,6,{ring:20,size:42,spd:80});}
/* Grinding Wheel: three real turns; the blade drags a band of fire and throws sparks off its edge like a grindstone */
const wheelR=()=>((typeof KB!=='undefined'&&KB.kbWheel&&KB.kbWheel.R)||80)*.9;
KTV.wheelSpin=function(i,SP){const T=rt(SP);addFx(new KArc({x:player.x,y:player.y,follow:1,fz:26+i*5,phi:player.phi,tilt:.12*(i%2?-1:1),a0:-Math.PI,a1:Math.PI,hit:0,lead:T*.5,sweep:T,hold:0,fade:.15,trail:3.6,R:wheelR(),W:26,pal:PAL.oni,ink:.5,N:44,emb:1,glint:0,edge:.16}));};
KTV.wheelHit=function(i){const R=wheelR(),x=player.x,y=player.y;ring({x,y,r0:R*.5,r1:R*1.08,w:6,pal:PAL.oni,life:.26,segs:4,gap:.3});if(i===2)dust(x,y,6,{ring:R*.5,size:40,spd:70,life:.6});};
/* Final Cleave: one straight crack to the end of the line, a wall of fire runs along it */
KTV.finalAfter=function(phi,len){const x=player.x,y=player.y;addFx(new KFissure({x:x+Math.cos(phi)*14,y:y+Math.sin(phi)*14,phi,len,grow:len/900,lin:1,life:1.7,w:9,jag:5}));
  for(let i=1;i<=3;i++){const l=len*i/3.3;ktLater(l/900,()=>{stones(x+Math.cos(phi)*l,y+Math.sin(phi)*l,3,{spd:170,up:260});dust(x+Math.cos(phi)*l,y+Math.sin(phi)*l,2,{size:40,spd:40,life:.7});});}};
/* Quake Slash: the crack runs along the ground and stone spikes come up exactly where its front (the damage) is */
KTV.quakeFront=function(q,d1){if(q._d==null){q._d=12;q._n=0;addFx(new KFissure({x:q.x,y:q.y,phi:q.phi,len:q.len,grow:q.len/q.speed,lin:1,life:q.life+.5,w:7.5}));}const c=Math.cos(q.phi),s=Math.sin(q.phi);
  while(q._d<=d1){const l=q._d,side=(q._n%2?1:-1)*R_(5,13),x=q.x+c*l-s*side,y=q.y+s*l+c*side,big=q._n%3===0;addFx(new KSpike({x,y,h:big?R_(36,48):R_(20,30),w:big?21:14,hot:0,life:R_(.9,1.3)}));
    if(q._n%2===0){dust(x,y,1,{size:34,spd:30,life:.6});stones(x,y,2,{spd:150,up:240,s:.8});}q._n++;q._d+=24;}};
KTV.quakeDraw=function(){return true;};
/* Oni Executioner: the cut splits the target from top to bottom. With Oni Impact the oni itself rises behind the cat while it charges */
let SPIRIT=null;
function spirit(o){return sprite(Object.assign({n:'oniSpirit',layer:'ground',follow:player,ox:-Math.cos(player.phi)*16,oy:-8,z:0,ay:.96,w:190,sx:Math.cos(player.phi)<0?-1:1,under:'#2a0606',ua:.35},o));}
KTV.HIT.kbExec=function(e){const z=zOf(e);addFx(new KLine({e,x:e.x,y:e.y,z:z+14,ang:Math.PI/2,L:e.boss?220:172,w:8,grow:.03,hold:.12,fade:.26,pal:PAL.oni}));stones(e.x,e.y,5,{spd:220,up:280});};
KTV.oniImpact=function(e,R){if(SPIRIT){SPIRIT.life=Math.min(SPIRIT.life,SPIRIT.t+.08);SPIRIT=null;}spirit({life:.6,fi:.01,fo:.4,s0:1.02,s1:1.12});
  ring({x:e.x,y:e.y,r0:16,r1:R,w:10,pal:PAL.oni,life:.5,segs:6,gap:.22});embers(e.x,e.y,36,14,{spd:260,up:240});V.groundBreak(e.x,e.y,.75,0);dust(e.x,e.y,6,{ring:24,size:50,spd:90});};
/* Ashura Mask: the mask takes shape above the cat during the wind-up and snaps onto its face at the peak; flames stand round it while it lasts */
KTV.ashuraStart=function(tW){const T=rt(tW);sprite({follow:player,layer:'top',z:0,life:T+.52,fi:.01,fo:.01,paint:f=>{const t=f.t;let z,s,a;if(t<T){const u=t/T;z=104-6*u+2*Math.sin(t*40)*u;s=.55+.45*eO(u);a=.25+.75*u;}else{const u=cl((t-T)/.1,0,1);z=98-50*eI(u);s=1-.42*u;a=1-cl((t-T-.12)/.4,0,1);}
    const [mx,my]=P(player.x,player.y,z+(player.z||0));ctx.globalAlpha=a;art('mask',mx,my,58*s,{under:'#2a0606',ua:.5});if(t>=T+.08&&t<T+.3)star(mx,my,34*(1-(t-T-.08)/.22),'#ff4a1e',t*6);}});};
KTV.ashuraOn=function(){const x=player.x,y=player.y;for(let i=0;i<2;i++)ring({x,y,r0:14,r1:120+40*i,w:8-2*i,pal:PAL.oni,life:.45+.1*i,segs:6,gap:.25,delay:i*.08});embers(x,y,30,16,{spd:220,up:260});dust(x,y,7,{ring:22,size:50,spd:100});};
KTV.ashuraEnd=function(R){const x=player.x,y=player.y;sprite({n:'mask',follow:player,z:50,w:38,life:.22,fi:.01,fo:.12,s0:1,s1:1.6,layer:'top',under:'#2a0606',ua:.4});
  stones(x,y,8,{z:46,spd:200,up:220,col:'#f4ede2',s:.8});stones(x,y,4,{z:46,spd:180,up:240,col:'#d2202c',s:.7});
  addFx(new KArc({x,y,follow:1,fz:30,phi:player.phi,tilt:.1,a0:-Math.PI,a1:Math.PI,hit:0,lead:.03,sweep:.2,hold:.03,fade:.24,R:R*.92,W:40,pal:PAL.oni,ink:.5,N:48,emb:1,glint:0}));
  for(let i=0;i<2;i++)ring({x,y,r0:20,r1:R*(1.05+.25*i),w:9-3*i,pal:PAL.oni,life:.5,segs:6,gap:.22,delay:i*.07});embers(x,y,30,18,{spd:280,up:240});};
function ashuraFlames(k,t,front){const n=front?3:5;for(let i=0;i<n;i++){const an=front?(i+.5)/3*Math.PI:Math.PI+(i+.5)/5*Math.PI,[x,y]=P(player.x+Math.cos(an)*(front?19:24),player.y+Math.sin(an)*(front?9:13),player.z||0);
    art('flame'+((((t*10+i*1.7)|0))%3),x,y+2,front?10:22+7*Math.sin(i*2.3+1),{ay:.96,a:k*(front?.85:.92),sy:1+.14*Math.sin(t*17+i*2.1),sx:i%2?-1:1,under:front?null:'#2a0606',ua:.35,uy:1});}}

/* ---------------------------------------------------------------------
   10. C · TWO-TAILED + what is drawn all the time
   --------------------------------------------------------------------- */
/* Nekomata Roll: the two tails' spirit flames circle the cat while it rolls */
KTV.DASH.kcRoll=function(sx,sy,dx,dy,phi,T){const life=rt(T)+.35;for(const sd of [0,1])sprite({follow:player,layer:'top',z:0,life,fi:.03,fo:.2,paint:f=>{const t=f.t,an=t*13+sd*Math.PI,[px,py]=P(player.x+Math.cos(an)*15,player.y+Math.sin(an)*9,(player.z||0)+20+8*Math.sin(t*9+sd));
      art('hitodama',px,py,13,{ay:.8,under:'#0f3048',ua:.4,sy:1+.15*Math.sin(t*23+sd)});}});
  addFx(new KStreak({a:[sx,sy],b:[sx,sy],live:rt(T),pal:PAL.wind,w:7,life:.22,ink:.3}));ring({x:sx,y:sy,r0:8,r1:44,w:4,pal:PAL.wind,life:.28});dust(sx,sy,2,{size:24,spd:40,dir:phi+Math.PI,life:.45});return true;};
KTV.DTICK.kcRoll=function(a,dt){if(every('roll',.045,dt))sys('top').add({im:A.get('hitodama'),asp:1.56,x:player.x+R_(-8,8),y:player.y+R_(-5,5),z:R_(8,28),vz:40,s0:8,s1:3,life:.32,fo:.6,a0:.8});};
/* Kasa Throw: the straw hat is a spinning disc (seen from above it really is one), with its shadow under it */
KTV.kasaDraw=function(k){const [gx,gy]=P(k.x,k.y,0),[x,y]=P(k.x,k.y,k.z),r=k.t*24;ctx.save();ctx.globalAlpha=.28;ctx.fillStyle='#1a1410';ctx.beginPath();ctx.ellipse(gx,gy,17,7,0,0,TAU);ctx.fill();
  ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';for(let i=0;i<2;i++){const s=-r*1.3+i*Math.PI;ctx.globalAlpha=.5;ctx.strokeStyle='#b98236';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,25,s+.2,s+1.2);ctx.stroke();ctx.globalAlpha=.85;ctx.strokeStyle='#ffffff';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(0,0,28,s,s+1.5);ctx.stroke();}ctx.restore();
  art('kasa',x,y,44,{flat:1,rot:r,under:'#3a2206',ua:.5,uy:3});return true;};
KTV.kasaHit=function(e){const z=zOf(e);straw(e.x,e.y,z,4,{spd:150,up:150});addFx(new KGlint({e,x:e.x,y:e.y,z,s:14,col:'#ffc23a',life:.16}));};
/* Shadow Dance: two shadows of the cat itself stand at its shoulders and copy every move */
class KClone{constructor(sd){this.sd=sd;this.layer='sorted';this.t=0;this.k=0;}
  pos(){const p=player.phi+Math.PI/2*this.sd,b=player.phi+Math.PI;return [player.x+Math.cos(p)*40+Math.cos(b)*24,player.y+Math.sin(p)*40+Math.sin(b)*24];}
  get sy(){return this.pos()[1]-.5;}
  update(dt){this.t+=dt;const on=hasBuff('kcShadow');this.k=cl(this.k+(on?dt*5:-dt*4),0,1);return on||this.k>0;}
  draw(){if(this.k<=0)return;const [wx,wy]=this.pos(),[x,y]=P(wx,wy,player.z||0),fr=playerFrame(),e={st:fr.st,d:fr.d,f:fr.f};try{drawFrame(e,x,y,.42*this.k);drawFrame(e,x,y,.3*this.k,null,tinted(e,'#7a5ad8'));}catch(_){}}}
KTV.shadowOn=function(){const x=player.x,y=player.y;whirlPetals(x,y,8,{r0:8,r1:30,hold:.35,va:8,out:40,im:'petalW'});ring({x,y,r0:10,r1:70,w:5,pal:PAL.moon,life:.36});};
/* Gale Lunge: a spear of wind marks what it touches; the second cast rides the wind to it */
KTV.lungeMark=function(e){sprite({n:'windMark',follow:e,z:e.boss?84:56,w:42,life:.3,fi:.01,fo:.12,s0:1.7,s1:1,layer:'top',under:'#0f3048',ua:.45});};
KTV.SW.kcLunge=function(c,lead){cut('rise',{phi:c.phi,lead,R:74,W:18,pal:PAL.wind,sweep:lead+.06,fade:.16});return true;};
KTV.HIT.kcLunge=function(e,big){if(!big)return;const z=zOf(e);addFx(new KLine({e,x:e.x,y:e.y,z,ang:scr(player.phi),L:e.boss?170:130,w:5,pal:PAL.wind,hold:.08,fade:.18}));ring({x:e.x,y:e.y,r0:10,r1:70,w:5,pal:PAL.wind,life:.3});};
/* Mountain Stance: a mountain stands behind the cat and stones circle it; the release throws them all outward */
KTV.stanceOn=function(){const x=player.x,y=player.y;ring({x,y,r0:72,r1:22,w:6,pal:PAL.earth,life:.4,ease:eI,segs:4});stones(x,y,5,{spd:60,up:200});};
KTV.stanceRelease=function(n,R){const x=player.x,y=player.y;addFx(new KArc({x,y,follow:1,fz:28,phi:player.phi,tilt:.1,a0:-Math.PI,a1:Math.PI,hit:0,lead:.02,sweep:.18,hold:.03,fade:.22,R:R*.88,W:34,pal:PAL.earth,ink:.5,N:48,emb:.6,glint:0}));
  addFx(new KBurst({x,y,z:30,R:60,n:12,pal:PAL.earth,life:.3}));ring({x,y,r0:18,r1:R*1.15,w:9,pal:PAL.earth,life:.45,segs:6,gap:.22});stones(x,y,10,{spd:300,up:260});dust(x,y,7,{ring:24,size:50,spd:110});};
function orbitStone(i,t,front,k){const an=t*1.5+i*TAU/4,sn=Math.sin(an);if((sn>=0)!==front)return;const im=tx('shard',i%2?'#8a7262':'#6a584c',i),[x,y]=P(player.x+Math.cos(an)*36,player.y+sn*22,14+7*Math.sin(t*2.3+i*1.7)),s=10+2*sn;
  ctx.save();ctx.globalAlpha=k;ctx.translate(x,y);ctx.rotate(t*1.2+i);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();}
/* Avalanche Rush: the run throws a bow wave of dust and stones to both sides */
KTV.avalancheRun=function(a,dt,phi,tRun,tEnd){if(!a._kv){a._kv=1;addFx(new KStreak({a:[player.x,player.y],b:[player.x,player.y],live:rt(Math.max(.05,tEnd-a.t)),pal:PAL.earth,w:14,life:.28}));}
  if(every('ava',.035,dt)){for(const sd of [-1,1])dust(player.x-Math.cos(phi)*8,player.y-Math.sin(phi)*8,1,{dir:phi+Math.PI+sd*.9,spread:.3,spd:120,size:40,life:.6});stones(player.x,player.y,1,{dir:phi+Math.PI+R_(-1,1),spread:.5,spd:180,up:220});}};
KTV.avalancheSlam=function(R){addFx(new KBurst({x:player.x,y:player.y,z:26,R:64,n:12,pal:PAL.earth,life:.3}));};

/* things that are drawn while a state lasts */
KTV.watch=function(dt){W.sak=cl(W.sak+(hasBuff('kaSakura')?dt*4:-dt*3),0,1);W.st=cl((W.st||0)+(CAT.stance?dt*5:-dt*4),0,1);
  if(W.ash>.5&&every('ash',.11,dt))embers(player.x+R_(-16,16),player.y+R_(-6,6),R_(10,50),1,{spd:20,up:150,life:.7});
  if(hasBuff('kcShadow')&&!(W.cl&&fx.includes(W.cl[0])))W.cl=[addFx(new KClone(-1)),addFx(new KClone(1))];};
KTV.groundExtra=function(t){const [x,y]=P(player.x,player.y,0);if(W.sak>0)art('blossom',x,y,86,{flat:1,rot:t*.5,a:.5*W.sak});
  if(W.st>0){art('mountain',x,y-3,122,{ay:.93,a:.6*W.st,under:'#2a1a0e',ua:.3});for(let i=0;i<4;i++)orbitStone(i,t,false,W.st);}};
KTV.topExtra=function(t){if(W.st>0)for(let i=0;i<4;i++)orbitStone(i,t,true,W.st);};
/* Flow shown as petals under the cat, the lunge mark, and the small texts the old overlay had */
KTV.overlay=function(ov,x,y){const t=ov.t;
  if(CAT.flow>0){const n=CAT.flow,cap=ktFlowCap(),hot=n>=10;for(let i=0;i<cap;i++){const ax=x-(cap-1)*3.4+i*6.8,ay=y+13;if(i<n)art(hot?'petal0':'petal1',ax,ay+(hot?Math.sin(t*6+i)*.8:0),hot?6.4:5.4,{rot:.5,under:'#5a0f34',ua:.7,ux:.6,uy:.8});
      else{ctx.fillStyle='rgba(90,40,60,.28)';ctx.beginPath();ctx.ellipse(ax,ay,1.5,2,.5,0,TAU);ctx.fill();}}}
  if(CAT.mom>0){ctx.fillStyle=KTC.oni2;ctx.font='700 9px Cinzel, serif';ctx.textAlign='center';ctx.fillText('MOM '+CAT.mom,x,y+26);ctx.textAlign='start';}
  if(CAT.stance){ctx.font='700 11px Cinzel, serif';ctx.textAlign='center';ctx.lineWidth=2.5;ctx.strokeStyle='#3a2206';ctx.strokeText('×'+CAT.stanceN,x,y-92);ctx.fillStyle='#fff';ctx.fillText('×'+CAT.stanceN,x,y-92);ctx.textAlign='start';}
  if(CAT.lunge&&!CAT.lunge.e.dead){const e=CAT.lunge.e,[mx,my]=P(e.x,e.y,(e.boss?84:56)+3*Math.sin(t*5));art('windMark',mx,my,30*(1+.06*Math.sin(t*9)),{under:'#0f3048',ua:.45});}
  for(const e of enemies){if(e.dead||!(e.ktDefT>gameTime))continue;const [ex,ey]=P(e.x,e.y,e.boss?70:46);ctx.fillStyle=KTC.oni2;ctx.font='700 9px Cinzel, serif';ctx.textAlign='center';ctx.fillText('DEF −'+e.ktDef,ex,ey);ctx.textAlign='start';}
  return true;};
})();
