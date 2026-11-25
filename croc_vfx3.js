/* =====================================================================
   AZTEC CROCODILE (Cipactli lancer) — skill effects v3: SVG art (croc_art.js) + code VFX.
   Owner 2026-11-21: "ทำสกิลจระเข้ด้วย vfx svg ให้หน่อยตามคอนเซปสกิลและตามความสามารถสกิล" — the same brief as the cat and the
   kitsune: every skill drawn by code + SVG, matching its concept AND what it really does (Armor Break stacks, Blood Frenzy,
   Off-Balance, the jaw lock, the shake, the drag, the roll …), in step with the frame its damage lands.

   TIMING (read before changing anything)
   · The action clock runs at ACTION_TEMPO (.75): an action time becomes real seconds with rt() before an effect uses it.
   · A thrust (Lance) is told how long it is until the contact frame (`lead`): the blade reaches the target exactly then, holds,
     and pulls back. Jaws open early and slam shut ON the contact frame. A tail sweep passes the target on its hit frame.
   · Hit sparks come from the damage itself (the croc's damage helper `cr` is wrapped), never from a separate timer.
   · Hit-stop freezes effects with the game, so a frozen frame shows the blade in the target / the jaws shut.

   HOW IT HOOKS IN: the croc's makers (index.html croc block + char_croc.js) still create their old effect objects
   (SpearLine, JawSnap, TailArc, SpearArc, PierceCone, ArmorCrack, DragMarks, RollRing, PathCrack, TipFlash, SunSpearArt, MawArt …).
   Those names are rebound here: each builds the v3 piece instead and hands back an empty object. Some skills also get extra events
   (charge-ups, the sun stone, the spirit, the ambush wake) through a wrapper on their make(). Gameplay is never touched.
   ?vfx3=0 = the old painted look (char_croc_fx.js + croc_vfx.js).

   STYLE (VFX_STYLE_REF_TH.md): no dark outlines; white-hot core → saturated mid → deep → a near-black "ink" shape behind so pale
   pieces read on snow; debris is shaped (obsidian chips, water drops, mud clods), never round dots.
   Families: Basic = river water + bronze spear · A (Temple Lancer) = gold + obsidian + jade, sun stone, stepped fret
           · B (River Predator) = jaws, river water, blood, mud · C = its column; Ancient Maw = the amber Cipactli spirit.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='croc'||!window.K3||!window.KTA||/[?&]vfx3=0/.test(location.search))return;
const HZK=window.HERO_K||1;   /* hero size (HERO_SIZE, 2026-11-25): hand / body heights of this file's pieces follow it */
const {V,TAU,cl,eO,eI,back,lerp,R_,rt,tint,art,sprite,star,KGlint,KBurst,KRing,ring,KArc,embers,dust,stones,ensure}=window.K3;
const {sys,tx}=V,AR=window.KTA;
const TEMPO=()=>(typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0)?ACTION_TEMPO:.75;
/* palettes: [ink, deep, mid, lite, core] */
const PAL={bronze:['#24140a','#9a5c1e','#e8a24a','#ffe2ac','#fffaf0'],gold:['#2a1606','#c0701a','#ffbe3a','#fff0b0','#ffffff'],jade:['#031c17','#0f8a6a','#33dca8','#c4ffe9','#ffffff'],
  river:['#05243a','#1a7cb0','#48c8ee','#c8f4ff','#ffffff'],blood:['#2a0406','#a0161c','#ee3a40','#ffb0a0','#fff2ea'],amber:['#2a1200','#c4620c','#ffa526','#ffdc90','#fff8e4'],
  mud:['#1a120a','#5a3c22','#8a6a44','#c8aa80','#f0e4c8'],white:['#1a1e2a','#8a96b0','#dfe8f8','#ffffff','#ffffff'],steel:['#16203a','#5a6e94','#b8c8e4','#eef4ff','#ffffff']};
const CV=window.CRV={on:1,PAL};
const NOFX=()=>({layer:'none',update:()=>false,draw(){}});
const zOf=e=>(e&&e.boss?40:26);
const qn2=n=>Math.max(1,Math.round(n*(typeof Q!=='undefined'?Math.max(.4,Q.p):1)));
const aKey=()=>{const a=player.action;return a?(a.key||''):'';};
const sang=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));          /* a world direction as an angle on screen */
const later=(s,f)=>setFxTimer(s,f);                                   /* game clock: pauses with hit-stop */
/* the hands (where a thrust starts): a little in front of the chest */
const hands=(phi=player.phi)=>[player.x+Math.cos(phi)*9*HZK,player.y+Math.sin(phi)*9*HZK,30*HZK+(player.z||0)];
const brOf=k=>{const s=SKILLS[k];if(!s)return 'basic';if(s.br!=='C')return s.br;const d=(typeof CRX_DEFS!=='undefined'&&CRX_DEFS.find(x=>x.key===k));return d&&d.col||'basic';};

/* ---------------------------------------------------------------------
   1. DEBRIS — water drops (stretched along their flight), blood, mud clods, obsidian chips
   --------------------------------------------------------------------- */
function drops(x,y,z,n,o={}){const im=AR.get(o.im||'dropW');if(!im)return;const S=sys('top'),q=qn2(n);for(let i=0;i<q;i++){const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread==null?.7:o.spread):R_(0,TAU),v=(o.spd||160)*R_(.35,1);
    S.add({im,x:x+R_(-4,4),y:y+R_(-3,3),z:Math.max(1,z+R_(-3,5)),vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v*.75+(o.vy||0),vz:(o.up==null?200:o.up)*R_(.4,1.1),g:760,dr:.8,s0:R_(4,7)*(o.s||1),s1:R_(3,5)*(o.s||1),life:R_(.4,.72),fo:.35,str:1.25,a0:o.a||1,delay:o.delay||0});}}
const blood=(x,y,z,n,o={})=>drops(x,y,z,n,Object.assign({im:'dropB',s:.9},o));
function clods(x,y,z,n,o={}){const S=sys('top'),q=qn2(n);for(let i=0;i<q;i++){const im=AR.get('mud'+(i%3));if(!im)return;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.7):R_(0,TAU),v=(o.spd||150)*R_(.4,1);
    S.add({im,asp:.8,x:x+R_(-5,5),y:y+R_(-3,3),z:z||2,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||190)*R_(.5,1.1),g:820,dr:.7,s0:R_(7,11)*(o.s||1),s1:R_(6,9)*(o.s||1),life:R_(.6,1),fo:.3,rot:R_(0,TAU),vr:R_(-10,10),bounce:.25});}}
function chips(x,y,z,n,o={}){const S=sys('top'),q=qn2(n);for(let i=0;i<q;i++){const im=AR.get('ob'+(i%4));if(!im)return;const a=o.dir!=null?o.dir+R_(-1,1)*(o.spread||.8):R_(0,TAU),v=(o.spd||180)*R_(.4,1);
    S.add({im,x:x+R_(-4,4),y:y+R_(-3,3),z:z||10,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:(o.up||220)*R_(.5,1.1),g:900,dr:.6,s0:R_(6,10)*(o.s||1),s1:R_(5,8)*(o.s||1),life:R_(.6,1),fo:.3,rot:R_(0,TAU),vr:R_(-14,14),bounce:.3});}}
function foam(x,y,n,R){const S=sys('ground'),im=AR.get('foam');if(!im)return;for(let i=0;i<n;i++){const a=i/n*TAU+R_(-.3,.3),r=R*R_(.7,1.05);S.add({im,asp:.75,x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.9,z:1,vx:Math.cos(a)*R*.5,vy:Math.sin(a)*R*.4,dr:3,s0:R_(9,14),s1:R_(5,8),life:R_(.5,.8),fo:.6,flat:1,rot:R_(0,TAU)});}}
/* a water splash: a crown that leaps up and falls back, drops, foam on the ground. kind: water | mud | blood */
function splash(x,y,s=1,o={}){const n=o.kind==='mud'?'splashM':o.kind==='blood'?'splashR':'splash';
  sprite({n,layer:'sorted',x,y,z:0,ay:.95,w:62*s,life:.46,fi:.02,fo:.22,s0:.35,s1:1,pop:.14,sy2:1,under:'#06263a',ua:.22,sortOff:4,tick:(f)=>{f.sy2=1-.55*cl((f.t-.2)/.26,0,1);}});
  drops(x,y,8,Math.round(5+5*s),{spd:110*s,up:230*s,im:o.kind==='blood'?'dropB':o.kind==='mud'?'dropM':'dropW'});
  if(s>=.8)foam(x,y,Math.round(5*s),22*s);
  if(o.ring!==false)ring({x,y,r0:6,r1:30*s+10,w:4,pal:o.kind==='blood'?PAL.blood:o.kind==='mud'?PAL.mud:PAL.river,life:.36,segs:4,gap:.3});}

/* ---------------------------------------------------------------------
   2. PIECES
   --------------------------------------------------------------------- */
/* a spear thrust: an energy shaft from the hands with the obsidian blade at its point. The point reaches L exactly `lead`
   seconds after it starts (the contact frame), holds, then the spear pulls back. wave = a serpent's ripple (Serpent Thrust). */
class Lance{constructor(o){Object.assign(this,{t:0,layer:'top',phi:0,L:120,w:4,lead:.04,hold:.05,back:.13,pal:PAL.bronze,head:34,wave:0,ret:.72,a:1,glint:1},o);
    const b=this.base||hands(this.phi);this.ox=b[0]-player.x;this.oy=b[1]-player.y;this.z=o.z!=null?o.z:b[2];this.life=this.lead+this.hold+this.back;}
  update(dt){this.t+=dt;return this.t<this.life;}
  ext(){const t=this.t;if(t<this.lead)return eO(t/this.lead);if(t<this.lead+this.hold)return 1;return 1-this.ret*eI(cl((t-this.lead-this.hold)/this.back,0,1));}
  draw(){const t=this.t,e=this.ext(),bx=(this.fixed?this.bx:player.x)+this.ox,by=(this.fixed?this.by:player.y)+this.oy,c=Math.cos(this.phi),s=Math.sin(this.phi),L=Math.max(2,this.L*e);
    const [ax,ay]=P(bx,by,this.z),[hx,hy]=P(bx+c*L,by+s*L,this.z),dx=hx-ax,dy=hy-ay,Ls=Math.hypot(dx,dy);if(Ls<3)return;
    const ux=dx/Ls,uy=dy/Ls,nx=-uy,ny=ux,fo=t>this.lead+this.hold?1-cl((t-this.lead-this.hold)/this.back,0,1):1,a=this.a*cl(t/.02,0,1)*(.2+.8*fo),p=this.pal,neck=Math.max(0,Ls-this.head*.55),N=this.wave?18:4;
    const band=(k,col,al)=>{ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();const up=[],dn=[];
      for(let i=0;i<=N;i++){const u=i/N,d=neck*u,hw=this.w*k*(.2+.8*Math.pow(u,1.25)),off=this.wave?Math.sin(u*11-t*48)*this.wave*Math.sin(Math.PI*u)*(1-e*.75):0,px=ax+ux*d+nx*off,py=ay+uy*d+ny*off;up.push(px+nx*hw,py+ny*hw);dn.push(px-nx*hw,py-ny*hw);}
      ctx.moveTo(up[0],up[1]);for(let i=2;i<up.length;i+=2)ctx.lineTo(up[i],up[i+1]);for(let i=dn.length-2;i>=0;i-=2)ctx.lineTo(dn[i],dn[i+1]);ctx.closePath();ctx.fill();};
    ctx.save();band(2.1,p[0],.4*a);band(1.35,p[1],.92*a);band(.9,p[2],a);band(.5,p[3],a);band(.2,p[4],a);
    /* speed lines ride along the shaft while it shoots out */
    if(t<this.lead+.05){const k=1-cl((t-this.lead)/.05,0,1);ctx.globalAlpha=.75*k*a;ctx.strokeStyle=p[3];ctx.lineWidth=1.2;ctx.lineCap='round';
      for(const sd of [-1,1]){const o2=this.w*2.7*sd,d0=neck*.3,d1=neck*.88;ctx.beginPath();ctx.moveTo(ax+ux*d0+nx*o2,ay+uy*d0+ny*o2);ctx.lineTo(ax+ux*d1+nx*o2,ay+uy*d1+ny*o2);ctx.stroke();}}
    ctx.globalAlpha=1;const ang=Math.atan2(dy,dx),left=Math.cos(ang)<0;
    art('spear',hx,hy,this.head,{rot:ang,ax:.985,ay:.5,sy:left?-1:1,a,under:p[0],ua:.45});
    if(this.glint){const g=(t-this.lead+.015)/.09;if(g>0&&g<1)star(hx,hy,(9+this.w*2)*Math.sin(Math.PI*g)*this.glint,p[2],g*.7);}
    ctx.restore();}}
/* a pierce: rings of pressed air pushed out through the back of the target along the thrust */
class AirCone{constructor(o){Object.assign(this,{t:0,layer:'top',life:.26,phi:0,R:15,n:2,len:40,pal:PAL.bronze},o);this.sa=sang(this.phi);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,c=Math.cos(this.phi),s=Math.sin(this.phi),p=this.pal;
    for(let i=0;i<this.n;i++){const u=cl(k*1.35-i*.2,0,1);if(u<=0||u>=1)continue;const d=this.len*eO(u)+i*5,r=this.R*(.45+.85*eO(u)),al=1-u,[x,y]=P(this.x+c*d,this.y+s*d,this.z);
      ctx.save();ctx.translate(x,y);ctx.rotate(this.sa);ctx.lineCap='round';
      for(const [w,col,aa] of [[5.5,p[0],.4],[3.2,p[2],1],[1.2,p[4],1]]){ctx.globalAlpha=al*aa;ctx.strokeStyle=col;ctx.lineWidth=w*(1-u*.5);ctx.beginPath();ctx.ellipse(0,0,r*.3,r,0,-Math.PI/2,Math.PI/2);ctx.stroke();}
      ctx.restore();}}}
/* armour cracking on a body: jagged lines that open from the centre, glow gold in the seams, then flake off as obsidian chips */
class BodyCrack{constructor(o){Object.assign(this,{t:0,layer:'top',life:.6,big:0,pal:PAL.gold},o);const n=this.big?7:5,R=(this.big?17:12)*(this.e&&this.e.boss?1.3:1);this.l=[];
    for(let i=0;i<n;i++){let a=i/n*TAU+R_(-.3,.3),x=0,y=0;const pts=[[0,0]];for(let j=0;j<3;j++){a+=R_(-.55,.55);const st=R*R_(.3,.48);x+=Math.cos(a)*st;y+=Math.sin(a)*st*.85;pts.push([x,y]);}this.l.push(pts);}
    const e=this.e;this.x=e.x;this.y=e.y;}
  update(dt){this.t+=dt;const e=this.e;if(e&&!e.dead){this.x=e.x;this.y=e.y;}if(!this.br&&this.t>this.life-.14){this.br=1;chips(this.x,this.y,zOf(this.e),this.big?6:3,{spd:120,up:160,s:.9});}return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,zOf(this.e)),k=cl(this.t/.07,0,1),a=cl((this.life-this.t)/.16,0,1),p=this.pal;ctx.save();ctx.translate(x,y);ctx.lineCap='round';ctx.lineJoin='round';
    for(const [w,c,al] of [[3.8,'#0c0806',.78],[2,p[2],1],[.75,'#ffffff',1]]){ctx.globalAlpha=al*a;ctx.strokeStyle=c;ctx.lineWidth=w;for(const q of this.l){const m=Math.max(2,Math.round(q.length*k));ctx.beginPath();for(let i=0;i<m;i++)i?ctx.lineTo(q[i][0],q[i][1]):ctx.moveTo(q[i][0],q[i][1]);ctx.stroke();}}
    ctx.restore();}}
/* crocodile jaws (croc_art.js jawU? + jawL?): they gape open, then slam shut ON the contact frame (lead), hold, and let go.
   mode 'lock' = they stay shut on the prey until until() is false (Jaw Lock, Death Roll); shake() jerks them (Violent Shake). */
class Jaws{constructor(o){Object.assign(this,{t:0,layer:'top',sc:1,skin:'n',lead:.1,hold:.07,rel:.2,open:.55,mode:'snap',sh:0,a:1},o);const e=this.e;this.x=e?e.x:this.x;this.y=e?e.y:this.y;
    this.life=this.mode==='snap'?this.lead+this.hold+this.rel:1e4;this.shut=0;}
  shake(){this.sh=1;this.shT=this.t;}
  update(dt){this.t+=dt;const e=this.e;if(e&&!e.dead){this.x=e.x;this.y=e.y;}this.sh=Math.max(0,this.sh-dt*3.2);
    if(this.mode==='lock'&&!this._end&&(!this.until||!this.until())){this._end=1;this.life=this.t+.24;this.endT=this.t;}
    if(!this.shut&&this.t>=this.lead){this.shut=1;this.onShut&&this.onShut(this);}
    return this.t<this.life;}
  ang(){const t=this.t;if(t<this.lead){const u=t/this.lead;return this.open*(u<.3?eO(u/.3):1-eI((u-.3)/.7));}
    if(this.mode==='lock'){if(!this._end)return .015+.05*this.sh*Math.abs(Math.sin((t-this.shT)*40));return .3*eO(cl((t-this.endT)/.16,0,1));}
    const r=t-this.lead-this.hold;return r<0?-.04*Math.sin(Math.PI*(t-this.lead)/this.hold):.26*eO(cl(r/this.rel,0,1));}
  draw(){const e=this.e,z=this.z!=null?this.z:zOf(e),[cx,cy]=P(this.x,this.y,z),[px,py]=P(player.x,player.y,z),fa=Math.atan2(cy-py,cx-px),dd=Math.hypot(cx-px,cy-py);
    const side=dd<3?(this.side||1):(Math.cos(fa)>=0?1:-1);this.side=side;
    const tilt=cl(Math.atan2(Math.sin(fa),Math.abs(Math.cos(fa))),-.45,.45)+(this.sh>0?Math.sin((this.t-this.shT)*34)*.32*this.sh:0);
    const ang=this.ang(),aIn=cl(this.t/.04,0,1),aOut=(this.mode==='lock'&&!this._end)?1:cl((this.life-this.t)/.16,0,1),a=this.a*aIn*aOut;if(a<=.01)return;
    const F=(e&&e.boss?1.32:1)*this.sc*.36*(.78+.22*eO(cl(this.t/.08,0,1))),hx=-96*F;   /* the prey sits between the jaws, 96 art units in front of the hinge */
    const U=AR.get('jawU'+this.skin),Lw=AR.get('jawL'+this.skin);if(!U||!Lw)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(side,1);ctx.rotate(tilt);ctx.globalAlpha=a;
    const rot=(q,an)=>{const c=Math.cos(an),s=Math.sin(an);return [hx+(q[0]*c-q[1]*s)*F,(q[0]*s+q[1]*c)*F];};
    if(ang>.03){const up=[[4,-2],[50,-3],[100,-3.5],[150,-4.5],[192,-5]],lo=[[4,1],[50,2],[100,3],[150,4.5],[190,6]];ctx.beginPath();up.forEach((q,i)=>{const r=rot(q,-ang);i?ctx.lineTo(r[0],r[1]):ctx.moveTo(r[0],r[1]);});
      for(let i=lo.length-1;i>=0;i--){const r=rot(lo[i],ang*.75);ctx.lineTo(r[0],r[1]);}ctx.closePath();const gr=ctx.createLinearGradient(hx,0,hx+190*F,0);gr.addColorStop(0,'#120303');gr.addColorStop(.55,'#4a0f10');gr.addColorStop(1,'#7e2622');ctx.fillStyle=gr;ctx.fill();}
    const part=(n,W,H,ax,ay,an,ink)=>{const im=AR.get(n);ctx.save();ctx.translate(hx,0);ctx.rotate(an);if(ink){const tt=tint(n,'#0a1208');if(tt){ctx.globalAlpha=a*.4;ctx.drawImage(tt,-ax*F+2,-ay*F+3,W*F,H*F);ctx.globalAlpha=a;}}ctx.drawImage(im,-ax*F,-ay*F,W*F,H*F);ctx.restore();};
    part('jawL'+this.skin,220,56,24,8,ang*.75,1);part('jawU'+this.skin,220,84,24,64,-ang,1);
    if(this.skin==='g'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.32;part('jawL'+this.skin,220,56,24,8,ang*.75);part('jawU'+this.skin,220,84,24,64,-ang);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;}
    /* the bite: a white flash along the closing line */
    const g=(this.t-this.lead)/.11;if(g>=0&&g<1&&this.mode!=='hold'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-g)*.95;const gl=ctx.createLinearGradient(hx,0,hx+210*F,0);gl.addColorStop(0,'rgba(255,240,200,0)');gl.addColorStop(.55,'rgba(255,250,232,.95)');gl.addColorStop(1,'rgba(255,240,200,0)');
      ctx.fillStyle=gl;ctx.beginPath();ctx.ellipse(hx+118*F,0,112*F*(.55+.45*g),7*F*(1-g)+1.5,0,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
    ctx.restore();}}
/* the tail: a scaly crocodile tail swung low round the hips. It passes the middle of its sweep (straight behind) exactly on the
   hit frame (lead), throwing water and mud off its tip; a smear of spray marks the swept ground. */
class TailSwing{constructor(o){Object.assign(this,{t:0,layer:'ground',R:84,a0:-1.9,a1:1.9,base:0,lead:.3,fade:.16,W:15,big:0,pal:PAL.river},o);this.mid=(this.a0+this.a1)/2;this.sw=Math.max(this.lead+.1,this.lead*1.5);this.life=this.sw+this.fade;this.acc=0;this.x=player.x;this.y=player.y;}
  head(t=this.t){if(t<=this.lead)return this.a0+(this.mid-this.a0)*Math.pow(t/this.lead,1.6);return this.mid+(this.a1-this.mid)*eO(cl((t-this.lead)/(this.sw-this.lead),0,1));}
  update(dt){this.t+=dt;this.x=player.x;this.y=player.y;
    if(this.t<this.sw&&this.t>this.lead*.35){this.acc+=dt;if(this.acc>.035){this.acc=0;const h=this.base+this.head(),d=Math.sign(this.a1-this.a0)||1,tx_=this.x+Math.cos(h)*this.R*.92,ty_=this.y+Math.sin(h)*this.R*.92,tg=h+d*Math.PI/2;
      drops(tx_,ty_,6,this.big?2:1,{dir:tg,spread:.5,spd:170,up:150});if(Math.random()<.45)clods(tx_,ty_,4,1,{dir:tg,spread:.6,spd:120,up:120,s:.8});}}
    return this.t<this.life;}
  draw(){const t=this.t,hd=this.head(),f=cl((t-this.sw)/this.fade,0,1),d=Math.sign(this.a1-this.a0)||1,x0=this.x,y0=this.y,R=this.R,b=this.base,p=this.pal,pt=(an,r,z=2)=>P(x0+Math.cos(b+an)*r,y0+Math.sin(b+an)*r,z);
    ctx.save();
    /* the swept spray: three overlapping sectors, the newest the brightest */
    const swept=Math.abs(hd-this.a0);for(const [len,al,c] of [[1.6,.16,p[1]],[.95,.26,p[2]],[.42,.42,p[3]]]){const L=Math.min(len,swept);if(L<.05)continue;const s0=hd-d*L;ctx.globalAlpha=al*(1-f);ctx.fillStyle=c;ctx.beginPath();
      for(let i=0;i<=12;i++){const q=pt(s0+(hd-s0)*i/12,R*1.04);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}for(let i=12;i>=0;i--){const u=i/12,q=pt(s0+(hd-s0)*u,R*(.55+.25*(1-u)));ctx.lineTo(q[0],q[1]);}ctx.closePath();ctx.fill();}
    if(f<1){ctx.globalAlpha=.85*(1-f);ctx.strokeStyle=p[4];ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=8;i++){const q=pt(hd-d*Math.min(.5,swept)*(1-i/8),R*1.04);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();}
    /* the tail itself: lags behind its own swing, thick at the hips, a pale belly edge, dark cross bands, a double row of scutes */
    const v=(this.head(t+.01)-hd)/.01,lag=cl(v*.05,-.6,.6)*(1-f),N=16,r0=8,L=[],Rr=[],C=[],HW=[];
    for(let i=0;i<=N;i++){const u=i/N,r=r0+(R*(1-.45*f)-r0)*u,an=hd-lag*Math.pow(u,1.5),hw=this.W*.5*Math.pow(1-u,.55)+1.2,c=Math.cos(b+an),s=Math.sin(b+an),nx=-s,ny=c;
      L.push(P(x0+c*r+nx*hw,y0+s*r+ny*hw,3));Rr.push(P(x0+c*r-nx*hw,y0+s*r-ny*hw,3));C.push(P(x0+c*r,y0+s*r,4));HW.push(hw);}
    const gold=this.skin==='g',shape=(oy,col,al,k=1)=>{ctx.globalAlpha=al*(1-f);ctx.fillStyle=col;ctx.beginPath();L.forEach((q,i)=>{const c=C[i];i?ctx.lineTo(c[0]+(q[0]-c[0])*k,c[1]+(q[1]-c[1])*k+oy):ctx.moveTo(c[0]+(q[0]-c[0])*k,c[1]+(q[1]-c[1])*k+oy);});
      for(let i=N;i>=0;i--){const q=Rr[i],c=C[i];ctx.lineTo(c[0]+(q[0]-c[0])*k,c[1]+(q[1]-c[1])*k+oy);}ctx.closePath();ctx.fill();};
    shape(5,'#0a1208',.32);shape(0,gold?'#d07a14':'#3a6428',1);shape(-1,gold?'#ffb43a':'#5a8a3a',1,.62);
    ctx.globalAlpha=.85*(1-f);ctx.fillStyle=gold?'#fff0c0':'#c9d48a';ctx.beginPath();L.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));for(let i=N;i>=0;i--){const q=L[i],c=C[i];ctx.lineTo(q[0]+(c[0]-q[0])*.3,q[1]+(c[1]-q[1])*.3);}ctx.closePath();ctx.fill();
    ctx.fillStyle=gold?'#a8520a':'#1f3a16';for(let i=2;i<N-1;i+=2){const q0=L[i],q1=Rr[i],p0=L[i+1],p1=Rr[i+1];ctx.globalAlpha=.45*(1-f);ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.lineTo((q1[0]+p1[0])/2,(q1[1]+p1[1])/2);ctx.lineTo((q0[0]+p0[0])/2,(q0[1]+p0[1])/2);ctx.closePath();ctx.fill();}
    ctx.globalAlpha=1-f;for(let i=1;i<N-1;i++){const q=C[i],w=2.2*(1-i/N)+.9,sp=HW[i]*.32;for(const sd of (i<N*.55?[-1,1]:[0])){const ox=(L[i][0]-C[i][0])/(HW[i]||1)*sp*sd,oy2=(L[i][1]-C[i][1])/(HW[i]||1)*sp*sd;
      ctx.fillStyle=gold?'#7a3a06':'#1a3012';ctx.beginPath();ctx.moveTo(q[0]+ox-w,q[1]+oy2);ctx.lineTo(q[0]+ox,q[1]+oy2-w*1.5);ctx.lineTo(q[0]+ox+w,q[1]+oy2);ctx.closePath();ctx.fill();}}
    ctx.restore();}}
/* a churning whirl of river water on the ground (Death Roll): a dark pool, spiral bands (dark inside, white outside), foam */
class Whirl{constructor(o){Object.assign(this,{t:0,layer:'ground',R:44,life:1,spin:9,pal:PAL.river,red:0},o);this.acc=0;this.rot=R_(0,TAU);}
  update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}this.rot+=dt*this.spin;this.acc+=dt;
    if(this.acc>.07&&this.t<this.life-.2){this.acc=0;const a=R_(0,TAU),x=this.x+Math.cos(a)*this.R*.9,y=this.y+Math.sin(a)*this.R*.7;drops(x,y,4,2,{dir:a+Math.PI/2,spread:.4,spd:150,up:160,im:this.red&&Math.random()<.5?'dropB':'dropW'});}
    return this.t<this.life;}
  draw(){const t=this.t,a=cl(t/.14,0,1)*cl((this.life-t)/.28,0,1),R=this.R*(.7+.3*eO(cl(t/.2,0,1))),[x,y]=P(this.x,this.y,0),p=this.pal;if(a<=0)return;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=a;
    const g=ctx.createRadialGradient(0,0,2,0,0,R*1.15);g.addColorStop(0,this.red?'rgba(70,6,10,.75)':'rgba(4,30,48,.72)');g.addColorStop(.6,this.red?'rgba(150,20,28,.45)':'rgba(20,110,160,.45)');g.addColorStop(1,'rgba(20,110,160,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*1.15,0,TAU);ctx.fill();
    for(let i=0;i<4;i++){const s0=this.rot+i*TAU/4,band=(r0,r1,w,col,al)=>{ctx.globalAlpha=a*al;ctx.fillStyle=col;ctx.beginPath();for(let j=0;j<=10;j++){const u=j/10,an=s0+u*1.5,r=lerp(r0,r1,u);ctx.lineTo(Math.cos(an)*(r+w*Math.sin(Math.PI*u)),Math.sin(an)*(r+w*Math.sin(Math.PI*u)));}
        for(let j=10;j>=0;j--){const u=j/10,an=s0+u*1.5,r=lerp(r0,r1,u);ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fill();};
      band(R*.98,R*.42,R*.16,this.red&&i%2?p[1]:'#0e4a72',.7);band(R*1.02,R*.5,R*.08,this.red&&i%2?'#ffd0c8':'#e8fbff',.85);
      const an=s0+1.5,r=R*.5;ctx.globalAlpha=a*.9;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(Math.cos(an)*r,Math.sin(an)*r,2.4,0,TAU);ctx.fill();}
    ctx.restore();}}
/* a V of water behind something that swims or lunges: the trail spreads and fades from its tail */
class Wake{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.9,w:13,live:.2,pal:PAL.river,mud:0},o);this.pts=o.pts?o.pts.map(q=>[q[0],q[1],0]):[[this.a[0],this.a[1],0]];this.end=0;}
  update(dt){this.t+=dt;if(this.live>0){this.live-=dt;const q=this.pts[this.pts.length-1];if(Math.hypot(player.x-q[0],player.y-q[1])>5)this.pts.push([player.x,player.y,this.t]);this.end=this.t;}return this.t<this.end+this.life;}
  draw(){const n=this.pts.length;if(n<2)return;const L=[],Rr=[],al=[];for(let i=0;i<n;i++){const q=this.pts[i],nq=this.pts[Math.min(n-1,i+1)],pq=this.pts[Math.max(0,i-1)],dx=nq[0]-pq[0],dy=nq[1]-pq[1],l=Math.hypot(dx,dy)||1,age=this.t-q[2],w=this.w*(.35+.9*cl(age/.45,0,1))*(i===n-1?.3:1);
      L.push(P(q[0]-dy/l*w,q[1]+dx/l*w,1));Rr.push(P(q[0]+dy/l*w,q[1]-dx/l*w,1));al.push(cl(1-age/this.life,0,1)*cl((this.end+this.life-this.t)/.3,0,1));}
    ctx.save();const p=this.pal;for(let i=0;i<n-1;i++){const a=(al[i]+al[i+1])/2;if(a<=.01)continue;ctx.globalAlpha=a*.55;ctx.fillStyle=this.mud?'#5a3c22':p[1];ctx.beginPath();ctx.moveTo(L[i][0],L[i][1]);ctx.lineTo(L[i+1][0],L[i+1][1]);ctx.lineTo(Rr[i+1][0],Rr[i+1][1]);ctx.lineTo(Rr[i][0],Rr[i][1]);ctx.closePath();ctx.fill();}
    ctx.lineCap='round';for(const E of [L,Rr]){for(let i=0;i<n-1;i++){const a=(al[i]+al[i+1])/2;if(a<=.01)continue;ctx.globalAlpha=a*.9;ctx.strokeStyle='#f2fdff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(E[i][0],E[i][1]);ctx.lineTo(E[i+1][0],E[i+1][1]);ctx.stroke();}}
    ctx.restore();}}
/* drag furrows: wet grooves ploughed through the ground, water shining in them, a heap at the end */
class Furrow{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.8,n:2,grow:.12},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eO(cl(this.t/this.grow,0,1)),a=Math.min(1,this.t/.05)*cl((this.life-this.t)/.6,0,1),dx=this.bx-this.ax,dy=this.by-this.ay,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ex=this.ax+dx*k,ey=this.ay+dy*k;if(a<=0)return;
    ctx.save();ctx.lineCap='round';for(let i=0;i<this.n;i++){const o=(i-(this.n-1)/2)*7,[x1,y1]=P(this.ax+nx*o,this.ay+ny*o,0),[x2,y2]=P(ex+nx*o,ey+ny*o,0);
      ctx.globalAlpha=a*.6;ctx.strokeStyle='#2c1e10';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      ctx.globalAlpha=a*.75;ctx.strokeStyle='#6fd0f0';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x1,y1-1);ctx.lineTo(x2,y2-1);ctx.stroke();}
    const [hx,hy]=P(ex,ey,0);ctx.globalAlpha=a*.7;ctx.fillStyle='#6a4a2a';ctx.beginPath();ctx.ellipse(hx,hy,13,4.6,0,0,TAU);ctx.fill();ctx.fillStyle='#e8fbff';ctx.globalAlpha=a*.8;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(hx-9+i*6,hy-2+(i%2)*2,1.6,0,TAU);ctx.fill();}
    ctx.restore();}}
/* a crack torn in the ground: opens from a to b with two side branches, its seam glows (gold / jade / amber), then cools */
class GCrack{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.6,grow:.12,col:'#ffbe3a',w:4},o);const dx=this.bx-this.ax,dy=this.by-this.ay,L=Math.hypot(dx,dy)||1,n=Math.max(4,Math.round(L/16));this.p=[];
    for(let i=0;i<=n;i++){const u=i/n,j=(i===0||i===n)?0:R_(-6,6);this.p.push([this.ax+dx*u-dy/L*j,this.ay+dy*u+dx/L*j]);}
    this.br=[];for(let b=0;b<2;b++){const i=1+((Math.random()*(n-1))|0),q=this.p[i],an=Math.atan2(dy,dx)+(b?1:-1)*R_(.6,1.1),l=R_(14,26);this.br.push([q,[q[0]+Math.cos(an)*l,q[1]+Math.sin(an)*l],i/n]);}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=cl(this.t/this.grow,0,1),a=cl((this.life-this.t)/.5,0,1),heat=cl(1-(this.t-this.grow)/.9,0,1);if(a<=0)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const path=(pts,m)=>{ctx.beginPath();pts.slice(0,Math.max(2,Math.round(pts.length*m))).forEach((q,i)=>{const s=P(q[0],q[1],0);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);});};
    for(const [w,c,al,h] of [[this.w+1.5,'#140c06',.75,0],[this.w*.55,this.col,1,1],[1,'#ffffff',1,1]]){ctx.globalAlpha=a*al*(h?heat:1);if(ctx.globalAlpha<=.01)continue;ctx.strokeStyle=c;ctx.lineWidth=w;
      path(this.p,k);ctx.stroke();for(const [q0,q1,u] of this.br)if(k>u){const m=cl((k-u)/(1-u+.001),0,1);path([q0,q1],m);ctx.stroke();}}
    ctx.restore();}}
/* a spike of obsidian glass thrown up out of the ground: dark body, one facet catching the light, a jade seam; it stands, then sinks */
class ObsSpike{constructor(o){Object.assign(this,{t:0,layer:'sorted',h:40,w:15,life:1,delay:0},o);this.t=-this.delay;this.lean=o.lean!=null?o.lean:R_(-.35,.35);}
  get sy(){return this.y+2;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){if(this.t<0)return;const up=back(cl(this.t/.1,0,1)),dn=cl((this.life-this.t)/.32,0,1),h=this.h*up*(.3+.7*dn),w=this.w*(.7+.3*dn),[x,y]=P(this.x,this.y,0);if(h<2)return;
    const tx_=x+Math.sin(this.lean)*h,ty_=y-Math.cos(this.lean)*h;ctx.save();
    ctx.globalAlpha=.35*dn;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y+1,w*.8,w*.28,0,0,TAU);ctx.fill();ctx.globalAlpha=dn;
    ctx.fillStyle='#090d0e';ctx.beginPath();ctx.moveTo(x-w*.5,y);ctx.lineTo(tx_,ty_);ctx.lineTo(x+w*.5,y+1);ctx.closePath();ctx.fill();
    const gl=ctx.createLinearGradient(x-w*.5,y,tx_,ty_);gl.addColorStop(0,'#1e2a28');gl.addColorStop(.55,'#56716a');gl.addColorStop(1,'#d8fff2');ctx.fillStyle=gl;ctx.beginPath();ctx.moveTo(x-w*.5,y);ctx.lineTo(tx_,ty_);ctx.lineTo(x-w*.06,y+.6);ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#45f0c0';ctx.globalAlpha=dn*(.5+.5*cl(1-this.t/.5,0,1));ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-w*.06,y);ctx.lineTo(tx_,ty_);ctx.stroke();ctx.restore();}}
/* a sprite of art n on the ground layer standing upright (sun stone, spirit) — K3 sprite does the rest */
const stand=o=>sprite(Object.assign({layer:'ground',ay:.5},o));
/* the golden spirit of Cipactli rising behind the croc and roaring (Ancient Maw Awakening) */
class Spirit{constructor(o){Object.assign(this,{t:0,layer:'ground',life:1.6,w:160,roar:.42,side:1},o);this.rings=0;}
  update(dt){this.t+=dt;if(this.t>this.roar&&this.rings<3&&this.t>this.roar+this.rings*.12){this.rings++;const [x,y]=this.mouth();ring({x,y,r0:14,r1:120,w:7,pal:PAL.amber,life:.5,segs:5,gap:.32});}return this.t<this.life;}
  mouth(){return [player.x+this.side*this.w*.32,player.y-6];}
  draw(){const t=this.t,rise=eO(cl(t/.34,0,1)),out=cl((this.life-t)/.42,0,1),a=rise*out;if(a<=.01)return;const U=AR.get('cipU'),L=AR.get('cipL');if(!U||!L)return;
    const [x,y]=P(player.x,player.y,0),f=this.w/300,side=this.side,jaw=t<this.roar?.04*rise:.5*eO(cl((t-this.roar)/.12,0,1))*(1-.75*cl((t-this.roar-.55)/.45,0,1));
    ctx.save();if(rise<1){ctx.beginPath();ctx.rect(x-this.w*2,y-this.w*2,this.w*4,this.w*2+6);ctx.clip();}ctx.translate(x-side*this.w*.34,y-54+(1-rise)*70);ctx.scale(side,1);
    const draw2=(al,add)=>{ctx.globalAlpha=a*al;if(add)ctx.globalCompositeOperation='lighter';ctx.save();ctx.rotate(jaw);ctx.drawImage(L,-40*f,-10*f,270*f,80*f);ctx.restore();ctx.save();ctx.rotate(-jaw*.45);ctx.drawImage(U,-66*f,-130*f,300*f,170*f);ctx.restore();ctx.globalCompositeOperation='source-over';};
    if(jaw>.06){const r=(q,an)=>{const c=Math.cos(an),s=Math.sin(an);return [(q[0]*c-q[1]*s)*f,(q[0]*s+q[1]*c)*f];};ctx.globalAlpha=a*.85;ctx.beginPath();
      for(const q of [[0,-4],[80,-6],[160,-8],[226,-12]]){const p=r(q,-jaw*.45);ctx.lineTo(p[0],p[1]);}for(const q of [[214,6],[140,4],[70,2],[0,0]]){const p=r(q,jaw);ctx.lineTo(p[0],p[1]);}ctx.closePath();
      const g=ctx.createLinearGradient(0,0,226*f,0);g.addColorStop(0,'#3a0c02');g.addColorStop(.7,'#8a2a08');g.addColorStop(1,'#ff9a2a');ctx.fillStyle=g;ctx.fill();}
    draw2(.82,0);draw2(.26*(1+Math.sin(t*9)*.3),1);ctx.restore();}}

/* ---------------------------------------------------------------------
   3. SPEAR · JAWS · TAIL — what every skill is built from
   --------------------------------------------------------------------- */
/* the look of each thrust: palette, shaft width, blade size, serpent ripple; the Obsidian Edge buff turns every blade jade,
   the Ancient Maw turns the basic poke gold */
const LST={basic:['bronze',3.2,26],crThrust:['bronze',4.2,32],ccReversal:['gold',5,38],caPierce:['gold',5.2,40],caLongFang:['gold',5,40],caImpale:['gold',6,44],caFracture:['white',3,30],
  caHook:['bronze',4.4,34],caSerpent:['jade',3.8,32],caFinish:['gold',6.4,48],caExecution:['gold',7.4,58],cbDrag:['river',4.6,34]};
const PIERCE={caLongFang:1,ccReversal:1};
function lanceStyle(k){const s=LST[k]||LST.crThrust;let pal=PAL[s[0]],w=s[1],head=s[2];
  if(hasBuff('crEdge')&&k!=='cbDrag'){pal=PAL.jade;head*=1.12;}
  if(hasBuff('crMaw')&&(k==='basic'||k==='crThrust'))pal=PAL.amber;return {pal,w,head};}
CV.lancePal=k=>lanceStyle(k).pal;
/* the length to the first target on the line (so the blade stops in its body), or the full reach for piercing thrusts */
function lanceLen(k,phi,reach){if(PIERCE[k])return reach;try{const t=lineHits(phi,reach+10,14)[0];if(t)return cl(Math.hypot(t.x-player.x,t.y-player.y)-9+t.r*.35,30,reach);}catch(_){}return reach*.85;}
function thrustFx(k,o){const st=lanceStyle(k),phi=o.phi!=null?o.phi:player.phi,lead=rt(.03);
  addFx(new Lance({phi,L:lanceLen(k,phi,o.reach||CR_BAL.spear+20),w:st.w,head:st.head,pal:st.pal,lead,hold:k==='caExecution'?.09:.05,back:k==='caExecution'?.2:.13,wave:k==='caSerpent'?6:0}));
  if(k==='caHook')later(lead+.03,()=>{const d=Math.sign(Math.sin((player.phi||0)+1e-3))||1;addFx(new KArc({x:player.x,y:player.y,follow:1,fz:26,phi,tilt:.15,a0:-.1*d,a1:1.25*d,R:CR_BAL.spear*.78,W:14,pal:PAL.bronze,lead:.02,sweep:.12,fade:.16,ink:.45}));});}
CV.thrust=thrustFx;
/* jaws on a target. skin: Iron Jaws buff = iron, Ancient Maw = gold spirit, otherwise the river crocodile */
const jawSkin=k=>hasBuff('crMaw')||k==='mawFin'?'g':hasBuff('crIronJaws')?'i':'n';
function jaws(e,o={}){if(!e)return null;return addFx(new Jaws(Object.assign({e,skin:jawSkin(o.k)},o)));}
CV.jaws=jaws;

/* ---------------------------------------------------------------------
   4. THE OLD PIECES, REBOUND (the makers keep calling them; nothing about gameplay changes)
   --------------------------------------------------------------------- */
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('croc');      /* no toon-layer charge glow / stretched lifetimes */
const mine=()=>!!(window.SKCTX||window.__ACTEV);
if(!window._crv3h){window._crv3h=1;
  const A0=window.addFx;window.addFx=addFx=function(f){if(f){const n=f.constructor&&f.constructor.name;
      if(n==='HitCrescents'||n==='PuffDust'||n==='StarCut'||n==='BrushArc'||n==='TexArc'||n==='SoundArcs')return f;     /* the croc's old engine dressing */
      if((n==='GRing'||n==='Impact')&&f.color==='#ffe9a8'&&mine()){                                    /* enhancement skills (skill_enh.js) */
        if(n==='GRing')A0(new KRing({x:f.x,y:f.y,r0:f.r0,r1:f.r1,w:5,pal:PAL.gold,life:f.life||.3,segs:4,gap:.3}));else{const q=f.pos||[f.x,f.y,24];A0(new KGlint({x:q[0],y:q[1],z:q[2],s:13,col:PAL.gold[2],life:.16}));}return f;}}
    return A0.apply(this,arguments);};
  const E0=window.emit;window.emit=emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock)$/.test(o.type))return;return E0.apply(this,arguments);};}

SpearLine=function(o){const k=o.key||aKey(),a=player.action;
  if(k==='caEdge'||aKey()==='caEdge'){edgeShow();return NOFX();}
  if(aKey()==='caRain'){rainPlunge();return NOFX();}
  if(aKey()==='caSunpiercer')return NOFX();
  if(a&&a._lanceDone===gameTime)return NOFX();if(a)a._lanceDone=gameTime;
  thrustFx(aKey()==='ccReversal'?'ccReversal':k,{phi:o.phi,reach:o.reach});return NOFX();};
JawSnap=function(o){const k=aKey(),a=player.action,e=o.e;if(!e)return NOFX();
  if(k==='cbShake'){const j=lockOf(e);if(j)j.shake();const bl=CRX.fz>=CRX_BAL.fz.need;drops(e.x,e.y,zOf(e),5,{spd:170,up:170});if(bl)blood(e.x,e.y,zOf(e),4,{spd:150,up:150});return NOFX();}
  if(a&&a._jw)return NOFX();
  jaws(e,{sc:(o.sc||1)*1.08,lead:o.close!=null?Math.max(.03,o.close):nextLead(a,.06),k});return NOFX();};
TailArc=function(o){const a=player.action,k=aKey(),T=a?rt(Math.max(.05,(a.windup||.3)-a.t)):.3,big=k==='cbTailBreaker';
  addFx(new TailSwing({R:(o.R||80)*1.12,a0:o.from==null?-1.9:o.from,a1:o.to==null?1.9:o.to,base:o.base!=null?o.base:player.phi+Math.PI,lead:k==='ccAwaken'?.08:T,W:big?30:k==='ccAwaken'?16:24,big,skin:hasBuff('crMaw')?'g':'n'}));return NOFX();};
SpearArc=function(o){const a=player.action,k=aKey();if(a&&a._arc)return NOFX();if(a)a._arc=1;sweepFx(k,o.phi!=null?o.phi:player.phi,o.R||CR_BAL.spear+20);return NOFX();};
PierceCone=function(o){const k=aKey(),pal=lanceStyle(k).pal;addFx(new AirCone({x:o.x,y:o.y,z:o.z||30,phi:o.phi,R:(o.len||60)*.22,len:(o.len||60)*.55,n:o.len>=110?3:2,pal,life:.3}));return NOFX();};
ArmorCrack=function(o){if(!o.e||o.e.dead)return NOFX();const k=aKey();addFx(new BodyCrack({e:o.e,big:!!o.big,life:o.life?o.life*.85:.6,pal:k==='caFracture'?PAL.white:PAL.gold}));return NOFX();};
DragMarks=function(o){const k=aKey();addFx(new Furrow({ax:o.ax,ay:o.ay,bx:o.bx,by:o.by,n:o.n||2,life:o.life||1.8}));
  if(Math.hypot(o.bx-o.ax,o.by-o.ay)>60&&!(player.action&&player.action._wk)){const n=6,pts=[];for(let i=0;i<=n;i++)pts.push([lerp(o.ax,o.bx,i/n),lerp(o.ay,o.by,i/n)]);addFx(new Wake({pts,live:0,life:.8,w:15}));}return NOFX();};
RollRing=function(o){const k=aKey();if((o.life||1)<.8){splashRing(o.x,o.y,o.R||70);return NOFX();}
  addFx(new Whirl({x:o.x,y:o.y,follow:player,R:(o.R||40)*1.15,life:o.life||1,red:k==='cbFrenzy'||CRX.fz>=CRX_BAL.fz.need,spin:k==='cbFrenzy'?13:10}));return NOFX();};
PathCrack=function(o){const k=aKey(),col=k==='caSunpiercer'?'#ffbe3a':k==='caRain'?'#45f0c0':k==='ccAwaken'?'#ffa526':'#ffbe3a';addFx(new GCrack({ax:o.ax,ay:o.ay,bx:o.bx,by:o.by,life:o.life||1.6,col,w:k==='caSunpiercer'?5:4}));return NOFX();};
TipFlash=function(o){addFx(new KGlint({x:0,y:0,z:0,s:14,col:PAL.gold[2],life:(o.life||.18)*.8,scr:[o.x,o.y]}));return NOFX();};
{const KD=KGlint.prototype.draw;KGlint.prototype.draw=function(){if(!this.scr)return KD.call(this);if(this.t<0)return;const k=this.t/this.life;star(this.scr[0],this.scr[1],this.s*Math.pow(Math.sin(Math.PI*Math.min(1,k*1.1)),.7),this.col,this.rot+k*.7);};}
PierceTrail=function(){return NOFX();};SunSpearArt=function(){return NOFX();};MawArt=function(){return NOFX();};CrSpearHitArt=function(){return NOFX();};
/* engine helpers the croc's makers call */
bronzeHit=function(){};
dirtKick=function(x,y,dir,n){if(window.SKCTX==='crStride')return;dust(x,y,Math.min(3,n),{size:22,spd:50,dir,spread:.8,life:.5});if(n>=3)clods(x,y,2,Math.ceil(n/3),{dir,spread:.8,spd:110,up:140,s:.8});};
mudSplash=function(x,y,n=10,sp=160){const k=aKey();if(n<=2){drops(x,y,4,2,{spd:80,up:120});return;}const kind=(k==='cbFrenzy'||(brOf(k)==='B'&&CRX.fz>=CRX_BAL.fz.need))&&n>=8&&k!=='ccFeast'?'blood':'water',s=cl(n/10,.45,kind==='blood'?.95:1.4);
  splash(x,y,s,{kind});if(k==='ccFeast')blood(x,y,20,8,{spd:140,up:180});if(n>=8)clods(x,y,3,Math.round(n/4),{spd:sp*.8,up:200});};
/* time (real s) until the next event of the running action — the hit a piece is announcing */
function nextLead(a,def){if(!a||!a.ev)return def;let m=1e9;for(const e of a.ev)if(!e.done&&e.t>a.t-1e-6&&e.t<m)m=e.t;return m<1e8?cl((m-a.t)/TEMPO(),.03,.2):def;}

/* ---------------------------------------------------------------------
   5. HITS — every hit of the croc's damage helper `cr` (Armor Break is read before and after, so a cash-in shatters)
   --------------------------------------------------------------------- */
function shatter(e,n){const z=zOf(e),bs=e.boss?1.3:1,S=sys('top'),q=Math.min(12,4+n),im=AR.get(n>=5?'abG':'ab');
  if(im)for(let i=0;i<q;i++){const a=i/q*TAU+R_(-.2,.2),v=R_(140,260);S.add({im,x:e.x,y:e.y,z:z+R_(-6,8),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(160,320),g:900,dr:.5,s0:R_(10,14)*bs,s1:R_(9,12)*bs,asp:1.25,life:R_(.7,1),fo:.3,rot:R_(0,TAU),vr:R_(-12,12),bounce:.25});}
  chips(e.x,e.y,z,6+n,{spd:220,up:260});addFx(new KBurst({e,x:e.x,y:e.y,z,R:(30+n*5)*bs,n:10,pal:PAL.gold,life:.26,ink:.55}));addFx(new KGlint({e,x:e.x,y:e.y,z:z+4,s:(18+n*2)*bs,col:PAL.gold[2],life:.24}));
  ring({x:e.x,y:e.y,r0:8,r1:(46+n*6)*bs,w:5,pal:PAL.gold,life:.34,segs:4,gap:.25});
  sprite({n:'seal',follow:e,z:(e.boss?100:70),w:(32+n*2.5)*bs,life:.66,fi:.03,fo:.24,s0:1.6,s1:1,pop:.13,under:'#000000',ua:.45,layer:'top'});}
CV.shatter=shatter;
const lastT=new WeakMap(),ABPOP=new WeakMap();
function onHit(e,o,ab){const k=aKey(),kind=o.kind||'spear',big=!!o.big,z=zOf(e),bs=e.boss?1.3:1,now=gameTime,cash=ab>0&&!((e.crAB||0)>=ab);
  if(cash)shatter(e,ab);if((e.crAB||0)>ab)ABPOP.set(e,gameTime);
  if(now-(lastT.get(e)||-9)<.045&&!big&&!cash)return;lastT.set(e,now);
  const phi=Math.atan2(e.y-player.y,e.x-player.x);
  if(kind==='spear'){const pal=lanceStyle(k).pal,lf=k==='caLongFang';addFx(new AirCone({x:e.x,y:e.y,z,phi,R:(big||lf?19:13)*bs,len:big||lf?52:32,n:big||lf?3:2,pal}));
    chips(e.x,e.y,z,big?4:2,{dir:phi,spread:.7,spd:big?220:150,up:big?220:150,s:.85});addFx(new KGlint({e,x:e.x,y:e.y,z,s:(big?17:11)*bs,col:pal[2],life:big?.2:.14}));
    if(brOf(k)==='basic'&&!hasBuff('crMaw'))drops(e.x,e.y,z,big?4:2,{dir:phi,spread:.8,spd:140,up:150});}
  else if(kind==='maw'){const red=brOf(k)==='B'||k==='cbFrenzy'||hasBuff('crFeast');drops(e.x,e.y,z,big?6:3,{spd:150,up:170});if(red)blood(e.x,e.y,z,big?6:3,{spd:150,up:150});
    if(hasBuff('crIronJaws')){const S=sys('top');V.G.sparks(S,e.x,e.y,z,big?8:5,'#ffd27a',220,140,.35);}
    addFx(new KGlint({e,x:e.x,y:e.y,z:z+4,s:(big?16:11)*bs,col:red?PAL.blood[3]:'#fff6dc',life:.16}));
    /* the heal of Blood Hunger / Feeding Frenzy: a drop of blood flies from the prey into the croc */
    if(hasBuff('crFeast')||(LV.cbHunger&&CRX.fz>=CRX_BAL.fz.need))lifeDrop(e);}
  else{const S=sys('top');drops(e.x,e.y,8,big?6:4,{dir:phi,spread:.9,spd:170,up:180});clods(e.x,e.y,6,big?4:2,{dir:phi,spread:.8,spd:160,up:180});dust(e.x,e.y,big?4:2,{size:30,spd:60,dir:phi,spread:.8,life:.6});
    addFx(new KBurst({e,x:e.x,y:e.y,z:z-6,R:(big?30:22)*bs,n:7,pal:PAL.mud,life:.2,ink:.45}));if(big&&k==='cbTailBreaker'){const a2=phi+R_(-.3,.3);addFx(new GCrack({ax:e.x-Math.cos(a2)*14,ay:e.y-Math.sin(a2)*14,bx:e.x+Math.cos(a2)*30,by:e.y+Math.sin(a2)*30,life:1,col:'#c8aa80',w:3.4}));}}}
function lifeDrop(e){const z0=zOf(e);sprite({layer:'top',x:e.x,y:e.y,z:z0,life:.42,fi:.02,fo:.08,paint:(f)=>{const u=eI(cl(f.t/.4,0,1)),x=lerp(e.x,player.x,u),y=lerp(e.y,player.y,u),z=lerp(z0,34,u)+Math.sin(Math.PI*u)*28,[sx,sy]=P(x,y,z);
  art('pip',sx,sy,9,{under:'#2a0406',ua:.4});star(sx,sy,6*(1-u)+2,'#ff8a7a',f.t*6);if(u>=.98&&!f._d){f._d=1;addFx(new KGlint({x:player.x,y:player.y,z:40,s:14,col:'#7affb0',life:.2}));}}});}
{const c0=cr;cr=function(e,m,o={}){const ab=(e&&e.crAB)||0,r=c0.apply(this,arguments);try{CV.ensure();if(e&&!(o&&o.dot))onHit(e,o||{},ab);}catch(err){console.warn('croc v3 hit',err);}return r;};}

/* ---------------------------------------------------------------------
   6. SKILLS — extra events on the actions that need more than their old pieces (charge-ups, jaws that open early, the sun stone …)
   --------------------------------------------------------------------- */
const hook=(k,f)=>{const sk=SKILLS[k];if(!sk||!sk.make)return;const mk=sk.make;sk.make=function(c){const a=mk.apply(this,arguments);if(a)try{a.events=a.events||[];f(a,c||{});}catch(err){console.warn('croc v3',k,err);}return a;};};
const at=(a,t,f)=>a.events.push({t:Math.max(.001,t),f});
const tgtOf=(a,c)=>(c&&c.target&&!c.target.dead)?c.target:(a.hitList&&a.hitList[0])||null;
/* a light gathering on the spear point during the wind-up: small for quick pokes, sun-gold with motes for the heavy thrusts */
function tipCharge(a,heavy,pal){const T=rt(Math.max(.05,a.windup-a.t));sprite({layer:'top',follow:player,life:T+.03,fi:.05,fo:.03,paint:(f)=>{const k=cl(f.t/T,0,1),q=hands(),[x,y]=P(q[0]+Math.cos(player.phi)*14,q[1]+Math.sin(player.phi)*14,q[2]+4);
  if(heavy){ctx.save();ctx.lineCap='round';for(let i=0;i<5;i++){const an=f.t*3+i*TAU/5,r=34*(1-((f.t*2.2+i/5)%1));ctx.globalAlpha=.75*k;ctx.strokeStyle=pal[2];ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r,y+Math.sin(an)*r*.7);ctx.lineTo(x+Math.cos(an)*(r+9),y+Math.sin(an)*(r+9)*.7);ctx.stroke();}ctx.restore();}
  star(x,y,(heavy?18:7)*k+2,pal[2],f.t*2);if(heavy){const [gx,gy]=P(player.x,player.y,0);ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(gx,gy);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,2,0,0,44);
    g.addColorStop(0,rgbaH(pal[2],.38*k));g.addColorStop(1,rgbaH(pal[2],0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.fill();ctx.restore();}}});}
const rgbaH=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
for(const k of ['crThrust','caPierce','caLongFang','caImpale','caFracture','caHook','caFinish','cbDrag'])hook(k,(a)=>{const heavy=k==='caPierce'||k==='caFinish'||k==='caImpale';at(a,Math.max(.001,a.windup-rt(heavy?1:.22)*TEMPO()),()=>tipCharge(a,heavy,lanceStyle(k).pal));});
/* bites: the jaws appear early, open wide, and shut on the contact frame */
function biteEarly(a,e,o){if(!e)return;a._jw=1;const t0=Math.max(.001,a.windup-.12*TEMPO());at(a,t0,()=>{if(!e.dead)jaws(e,Object.assign({lead:rt(Math.max(.02,a.windup-a.t))},o));});}
hook('crBite',(a,c)=>biteEarly(a,tgtOf(a,c)||ctgt(c,90),{sc:1.05,k:'crBite'}));
hook('cbJaw',(a,c)=>biteEarly(a,tgtOf(a,c)||ctgt(c,90),{sc:1.3,k:'cbJaw',onShut:j=>{addFx(new KBurst({e:j.e,x:j.x,y:j.y,z:zOf(j.e),R:30,n:9,pal:PAL.amber,life:.22}));}}));
hook('cbLock',(a,c)=>biteEarly(a,tgtOf(a,c)||ctgt(c,90),{sc:1.15,k:'cbLock',keep:1}));
hook('cbRip',(a,c)=>{const e=tgtOf(a,c)||ctgt(c,90);biteEarly(a,e,{sc:1.05,k:'cbRip',onShut:j=>rip(j.e)});});
hook('cbSnap',(a,c)=>{const e=(window.CR&&CR.grab&&CR.grab.e)||tgtOf(a,c)||ctgt(c,90);biteEarly(a,e,{sc:1.6,k:'cbSnap',open:.75,onShut:j=>{addFx(new KBurst({e:j.e,x:j.x,y:j.y,z:zOf(j.e),R:42,n:11,pal:PAL.amber,life:.26}));}});});
/* Ripping Bite: the jaws wrench sideways — three torn lines, blood */
function rip(e){if(!e||e.dead)return;const z=zOf(e),bs=e.boss?1.3:1;for(let i=0;i<3;i++)addFx(new window.K3.KLine({e,x:e.x,y:e.y,z:z+(i-1)*6,ox:(i-1)*5,ang:-.55+R_(-.1,.1),L:46*bs,w:3.4,pal:PAL.blood,grow:.04,hold:.1,fade:.2,ink:.45,delay:i*.025}));blood(e.x,e.y,z,8,{spd:170,up:160});}
/* basic attack: Spear Poke / Snap / Maw Finisher (Ancient Maw) */
if(typeof mkBasic==='function'){const mb=mkBasic;mkBasic=function(tgt){const a=mb.apply(this,arguments);if(a)try{a.events=a.events||[];
    if(a.name==='Snap')biteEarly(a,tgt,{sc:.85,k:'basic'});
    else if(a.name==='Maw Finisher')biteEarly(a,tgt,{sc:1.7,k:'mawFin',open:.8,onShut:j=>{const e=j.e;addFx(new KBurst({e,x:j.x,y:j.y,z:zOf(e),R:52,n:12,pal:PAL.amber,life:.3}));ring({x:j.x,y:j.y,r0:10,r1:90,w:7,pal:PAL.amber,life:.4});splash(j.x,j.y,1.2);}});
    else at(a,Math.max(.001,a.windup-rt(.18)*TEMPO()),()=>tipCharge(a,0,lanceStyle('basic').pal));}catch(err){console.warn('croc v3 basic',err);}return a;};}

/* ---- Crescent Sweep / Spear Boundary: the spear swept round in a flat arc, the blade riding its edge ---- */
class SpearSweep extends KArc{draw(){super.draw();const hd=this.head(),T=this.sweep+this.hold,f=cl((this.t-T)/this.fade,0,1);if(f>=.95)return;const q=this.pt(hd,this.R),d=Math.sign(this.a1-this.a0)||1,q2=this.pt(hd+d*.08,this.R),ang=Math.atan2(q2[1]-q[1],q2[0]-q[0]);
  art('spear',q[0],q[1],this.blade||36,{rot:ang,ax:.75,ay:.5,sy:Math.cos(ang)<0?-1:1,a:1-f,under:this.pal[0],ua:.4});}}
function sweepFx(k,phi,R){const full=k==='caBoundary',lead=rt(.03),pal=lanceStyle(k==='caBoundary'?'caPierce':'caPierce').pal;
  addFx(new SpearSweep({x:player.x,y:player.y,follow:1,fz:26,phi,tilt:.14,a0:full?-Math.PI:-1.45,a1:full?Math.PI:1.45,hit:0,R:full?R*.92:R*.8,W:full?14:15,pal:PAL.gold,lead:full?lead+.04:lead,sweep:full?lead+.16:lead+.09,hold:.03,fade:.16,ink:.5,N:full?40:24,blade:full?34:36}));
  if(full){const x=player.x,y=player.y;sprite({n:'fret',layer:'ground',x,y,z:0,w:R*2.25,flat:1,life:.95,fi:.04,fo:.5,s0:.55,s1:1.02,pop:.16,spin:.5,a:.95});
    ring({x,y,r0:20,r1:R*1.25,w:8,pal:PAL.gold,life:.42,segs:6,gap:.22,delay:lead});later(lead+.02,()=>dust(x,y,7,{ring:R*.6,size:30,spd:140,life:.55}));}}
CV.sweep=sweepFx;

/* ---- Obsidian Edge (buff): the blade is shown in front of the croc, a jade sheen runs down it, quetzal feathers lift ---- */
function edgeShow(){const phi=player.phi;sprite({layer:'top',follow:player,life:.75,fi:.05,fo:.25,paint:(f,x0,y0,s,a)=>{const q=hands(phi),[x,y]=P(q[0]+Math.cos(phi)*16,q[1]+Math.sin(phi)*16,q[2]+8),ang=sang(phi),left=Math.cos(ang)<0,k=eO(cl(f.t/.18,0,1));
    art('spear',x,y,60*(.6+.4*k),{rot:ang,ax:.4,ay:.5,sy:left?-1:1,under:'#031c17',ua:.45});
    const u=cl((f.t-.12)/.3,0,1);if(u>0&&u<1){const c=Math.cos(ang)*(left?-1:1),hx=x+Math.cos(ang)*(-20+56*u),hy=y+Math.sin(ang)*(-20+56*u);ctx.globalCompositeOperation='lighter';star(hx,hy,14*Math.sin(Math.PI*u),PAL.jade[2],u*2);ctx.globalCompositeOperation='source-over';}}});
  ring({x:player.x,y:player.y,r0:56,r1:10,w:4,pal:PAL.jade,life:.32,segs:4,gap:.35});
  window.K3.petals(player.x,player.y,30,7,{im:'quetz',asp:3.4,s:.9,spd:60,up:150,term:.6,dk:'#031c17',life:1.6,rest:.4});}

/* ---- Temple Execution: the stepped fret wakes under the croc and gold is drawn into the blade for the whole wind-up ---- */
hook('caExecution',(a)=>{const T=rt(Math.max(.1,a.windup-.002));at(a,.002,()=>{const x=player.x,y=player.y;
    sprite({n:'fret',layer:'ground',x,y,z:0,w:150,flat:1,life:T+.5,fi:.12,fo:.4,s0:.7,s1:1,spin:-.8,a:.9});tipCharge(a,1,PAL.gold);
    const S=sys('top');for(let i=0;i<20;i++){const an=R_(0,TAU),r=R_(56,90),lf=T*R_(.45,.8),dl=R_(0,T-lf);S.add({im:tx('core','#ffbe3a'),x:x+Math.cos(an)*r,y:y+Math.sin(an)*r*.8,z:R_(4,46),vx:-Math.cos(an)*r/lf*.95,vy:-Math.sin(an)*r*.8/lf*.95,vz:R_(10,30),s0:R_(8,12),s1:3,life:lf,add:1,str:2,fo:.25,delay:dl});}});
  at(a,a.windup+.001,()=>{const e=(a.hitList||[])[0];if(e)sprite({follow:e,layer:'top',z:0,life:.3,fi:.01,fo:.18,paint:(f)=>{const [x,y]=P(e.x,e.y,0),h=(e.boss?150:110)*eO(cl(f.t/.05,0,1));ctx.save();ctx.globalCompositeOperation='lighter';
      const g=ctx.createLinearGradient(x,y-h,x,y);g.addColorStop(0,'rgba(255,240,176,0)');g.addColorStop(.5,'rgba(255,240,176,.95)');g.addColorStop(1,'rgba(255,190,58,.2)');ctx.fillStyle=g;ctx.fillRect(x-3.2,y-h,6.4,h);ctx.restore();}});});});

/* ---- Sunpiercer: the sun stone climbs behind the croc for the whole charge, then one golden spear tears down the line ---- */
hook('caSunpiercer',(a,c)=>{const ev=a.events,tA=(ev.find(e=>e.t>.05&&e.t<.8)||{t:.25}).t-.05,tB=ev.reduce((m,e)=>e.t>m&&e.t<a.windup+.001?e.t:m,0),tEnd=ev.reduce((m,e)=>Math.max(m,e.t),0);
  const phi=player.phi,T=rt(Math.max(.2,tB-tA));
  at(a,.02,()=>dust(player.x,player.y,4,{size:30,spd:60,dir:phi+Math.PI,spread:.7,life:.6}));
  at(a,tA,()=>{const side=Math.cos(phi)>=0?1:-1;
    stand({n:'sun',follow:player,ox:-Math.cos(phi)*16,oy:-Math.sin(phi)*10-2,z:70,w:150,life:T+.42,fi:.2,fo:.3,s0:.35,s1:1,spin:.6,a:.95,under:'#2a1606',ua:.25,tick:(f)=>{if(f.t>T){f.s1=1.15;f.a=.95*(1-cl((f.t-T)/.3,0,1));}}});
    sprite({n:'fret',layer:'ground',follow:player,z:0,w:130,flat:1,life:T+.4,fi:.15,fo:.3,s0:.6,s1:1,spin:1.2,a:.85});tipCharge({windup:tB,t:tA},1,PAL.gold);
    const S=sys('top');for(let i=0;i<22;i++){const an=R_(0,TAU),r=R_(60,110);S.add({im:tx('core','#ffd25a'),cf:player,orb:1,cx:player.x,cy:player.y,ang:an,r,va:R_(2,4)*side,vr2:-r/T*.95,z:R_(6,60),vz:R_(-10,10),s0:R_(4,7),s1:2,life:T*R_(.6,1),add:1,fo:.3,delay:R_(0,T*.4)});}});
  at(a,tB+.001,()=>{const sx=player.x,sy=player.y,L=280;screenFlash(.12,'#fff4d8');
    sprite({layer:'top',life:.62,fi:.01,fo:.3,paint:(f)=>{const k=eO(cl(f.t/.24,0,1)),c=Math.cos(phi),s=Math.sin(phi),lead=f.t<.3?Math.max(L*k,(player.x-sx)*c+(player.y-sy)*s+58):L+58,[ax,ay]=P(sx-c*20,sy-s*20,30),[bx,by]=P(sx+c*lead,sy+s*lead,30),dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=16*(1-cl((f.t-.3)/.32,0,1));
      const lance=(m,col,al)=>{ctx.globalAlpha=al;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx-dx/l*20+nx*w*m,by-dy/l*20+ny*w*m);ctx.lineTo(bx,by);ctx.lineTo(bx-dx/l*20-nx*w*m,by-dy/l*20-ny*w*m);ctx.closePath();ctx.fill();};
      ctx.save();lance(1.8,PAL.gold[0],.35);lance(1.25,PAL.gold[1],.9);lance(.85,PAL.gold[2],1);lance(.45,PAL.gold[3],1);lance(.18,'#ffffff',1);
      ctx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const u=(i+.5)/9*k,px=ax+dx*u,py=ay+dy*u,sp=(i%2?18:28)*(1-cl((f.t-.1)/.4,0,1));ctx.globalAlpha=.7;ctx.strokeStyle=PAL.gold[3];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+nx*w*.6,py+ny*w*.6);ctx.lineTo(px+nx*(w+sp),py+ny*(w+sp));ctx.moveTo(px-nx*w*.6,py-ny*w*.6);ctx.lineTo(px-nx*(w+sp),py-ny*(w+sp));ctx.stroke();}
      ctx.restore();const ang=Math.atan2(dy,dx);art('spear',bx,by,54,{rot:ang,ax:.985,ay:.5,sy:Math.cos(ang)<0?-1:1,a:1-cl((f.t-.4)/.22,0,1),under:'#2a1606',ua:.4});}});
    for(let i=0;i<6;i++){const u=(i+.5)/6;later(rt(.18)*u,()=>{const x=sx+Math.cos(phi)*L*u,y=sy+Math.sin(phi)*L*u;dust(x,y,2,{size:30,spd:50,life:.6});chips(x,y,4,2,{spd:110,up:200});});}});
  at(a,tEnd+.001,()=>{const x=player.x+Math.cos(phi)*30,y=player.y+Math.sin(phi)*30;stand({n:'sun',x,y,z:34,w:120,life:.5,fi:.01,fo:.3,s0:.3,s1:1.3,spin:2,a:.9});
    addFx(new KBurst({x,y,z:30,R:70,n:14,pal:PAL.gold,life:.32,ink:.5}));ring({x,y,r0:14,r1:120,w:8,pal:PAL.gold,life:.5,segs:6,gap:.2});chips(x,y,20,10,{spd:260,up:280});dust(x,y,8,{ring:26,size:50,spd:120,life:.8});});});

/* ---- Obsidian Rain: a leap, a jade streak behind; the spear is driven into the ground and black glass erupts round it ---- */
function rainPlunge(){const x=player.x,y=player.y,z0=(player.z||0)+64*HZK;sprite({layer:'top',life:.16,fi:.01,fo:.06,paint:(f)=>{const k=eI(cl(f.t/.08,0,1)),[ax,ay]=P(x,y,z0),[bx,by]=P(x,y,Math.max(0,z0*(1-k)-6));
  ctx.save();for(const [w,c,al] of [[9,PAL.jade[0],.4],[6,PAL.jade[1],.9],[3.6,PAL.jade[2],1],[1.4,'#fff',1]]){ctx.globalAlpha=al;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}ctx.restore();
  art('spear',bx,by,40,{rot:Math.PI/2,ax:.985,ay:.5,under:'#031c17',ua:.4});}});}
hook('caRain',(a,c)=>{const tL=a.windup,gx=c.gx!=null?c.gx:player.x,gy=c.gy!=null?c.gy:player.y;
  at(a,.01,()=>{const pts=[],T=rt(tL);dust(player.x,player.y,4,{size:30,spd:70,life:.6});
    sprite({layer:'top',life:T+.3,fi:.01,fo:.25,paint:(f)=>{if(f.t<=T)pts.push([player.x,player.y,(player.z||0)+34*HZK,f.t]);const n=pts.length;if(n<2)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
      for(const [w,c,al] of [[13,PAL.jade[0],.3],[9,PAL.jade[1],.85],[5.5,PAL.jade[2],1],[2,'#ffffff',1]]){ctx.strokeStyle=c;for(let i=Math.max(1,n-14);i<n;i++){const q0=pts[i-1],q1=pts[i],age=f.t-q1[3],k=(i-(n-14))/14;ctx.globalAlpha=al*cl(1-age/.35,0,1)*cl(k,0,1);ctx.lineWidth=w*cl(k,.15,1);
        const [x0,y0]=P(q0[0],q0[1],q0[2]),[x1,y1]=P(q1[0],q1[1],q1[2]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}}ctx.restore();}});});
  at(a,tL+.001,()=>{const x=player.x,y=player.y;for(let i=0;i<9;i++){const an=i/9*TAU+R_(-.2,.2),r=R_(30,72);addFx(new ObsSpike({x:x+Math.cos(an)*r,y:y+Math.sin(an)*r*.8,h:R_(30,52),w:R_(12,18),life:R_(.8,1.1),delay:r/72*.06,lean:Math.cos(an)*.45}));}
    for(let i=0;i<4;i++){const an=i/4*TAU+R_(-.4,.4);addFx(new GCrack({ax:x,ay:y,bx:x+Math.cos(an)*R_(60,90),by:y+Math.sin(an)*R_(50,70),life:1.4,col:'#45f0c0',w:3.6}));}
    chips(x,y,10,14,{spd:300,up:340});addFx(new KBurst({x,y,z:14,R:56,n:12,pal:PAL.jade,life:.26,ink:.55}));ring({x,y,r0:12,r1:100,w:8,pal:PAL.jade,life:.45,segs:5,gap:.25});dust(x,y,9,{ring:30,size:52,spd:130,life:.85});});});

/* ---- River Predator dashes: Low Ambush (submerged: only the eyes and the ridge show, a wake runs to the prey, the water erupts),
        Apex Lunge (a low lunge, mud and water behind), Body Crush (a charging body shoves a wall of dust, the ground cracks) ---- */
function eyesOnWater(T){sprite({layer:'top',follow:player,life:T+.04,fi:.04,fo:.05,paint:(f)=>{const ph=player.phi,c=Math.cos(ph),s=Math.sin(ph),bx=player.x+c*16,by=player.y+s*16,sd=Math.cos(sang(ph))>=0?1:-1;
    for(const o of [-5,5]){const [x,y]=P(bx-s*o,by+c*o,5);art('eyeA',x,y,13,{sx:sd,under:'#031c17',ua:.4});}
    ctx.save();ctx.fillStyle='#2c5222';for(let i=1;i<5;i++){const [x,y]=P(player.x-c*i*9,player.y-s*i*9,3);ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x,y-4);ctx.lineTo(x+3,y);ctx.closePath();ctx.fill();}ctx.restore();}});}
hook('cbAmbush',(a,c)=>{const e=tgtOf(a,c)||ctgt(c,200),T=rt(a.windup);a._jw=1;a._wk=1;
  at(a,.001,()=>{const x=player.x,y=player.y;addFx(new Whirl({x,y,R:26,life:.5,spin:4}));addFx(new Wake({a:[x,y],live:T,life:.9,w:15}));eyesOnWater(T);drops(x,y,4,5,{spd:90,up:160});});
  at(a,Math.max(.002,a.windup-.1*TEMPO()),()=>{if(e&&!e.dead){jaws(e,{sc:1.2,lead:rt(Math.max(.02,a.windup-a.t)),k:'cbAmbush',z:zOf(e)-4});}});
  at(a,a.windup+.001,()=>{if(e&&!e.dead){splash(e.x,e.y,1.3);addFx(new Whirl({x:e.x,y:e.y,R:30,life:.55,spin:6}));}});});
hook('cbLunge',(a,c)=>{const e=tgtOf(a,c)||ctgt(c,240),T=rt(a.windup);a._jw=1;
  at(a,.001,()=>{addFx(new Wake({a:[player.x,player.y],live:T,life:.8,w:12,mud:1}));dust(player.x,player.y,4,{size:30,spd:80,dir:player.phi+Math.PI,spread:.6,life:.6});});
  at(a,Math.max(.002,a.windup-.1*TEMPO()),()=>{if(e&&!e.dead)jaws(e,{sc:1.35,lead:rt(Math.max(.02,a.windup-a.t)),k:'cbLunge',open:.72});});
  at(a,a.windup+.001,()=>{if(e&&!e.dead){splash(e.x,e.y,1.1,{kind:'blood'});}});
  at(a,a.windup+.15,()=>{if(e&&!e.dead)jaws(e,{sc:.85,lead:.05,k:'cbLunge',open:.35});});});
hook('cbBodyCrush',(a,c)=>{const T=rt(a.windup);
  at(a,.001,()=>{for(let i=0;i<4;i++)later(T*i/4,()=>dust(player.x+Math.cos(player.phi)*20,player.y+Math.sin(player.phi)*20,2,{size:34,spd:90,dir:player.phi,spread:.9,life:.5}));});
  at(a,a.windup+.001,()=>{const ph=player.phi,x=player.x+Math.cos(ph)*30,y=player.y+Math.sin(ph)*30;addFx(new KBurst({x,y,z:24,R:46,n:10,pal:PAL.mud,life:.26,ink:.5}));ring({x,y,r0:10,r1:80,w:7,pal:PAL.mud,life:.4,segs:5,gap:.25});
    for(let i=0;i<3;i++){const an=ph+(i-1)*.6;addFx(new GCrack({ax:x,ay:y,bx:x+Math.cos(an)*R_(40,60),by:y+Math.sin(an)*R_(30,46),life:1.1,col:'#c8aa80',w:3.6}));}clods(x,y,6,7,{dir:ph,spread:1,spd:220,up:240});dust(x-Math.cos(ph)*10,y-Math.sin(ph)*10,4,{ring:18,size:34,spd:110,life:.6});});});

/* ---- Jaw Lock / Death Roll / Violent Shake: the jaws that close on the prey stay shut on it for as long as it is held ---- */
let LOCK=null;const lockOf=e=>LOCK&&LOCK.e===e&&fx.includes(LOCK)?LOCK:null;
function lockWatch(){const g=window.CR&&CR.grab;if(!g){return;}if(lockOf(g.e))return;
  /* the bite that caught it becomes the lock */
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];if(f instanceof Jaws&&f.e===g.e&&f.mode==='snap'&&!f.big){if(!f.shut)return;f.mode='lock';f.life=1e4;f.until=()=>!!(window.CR&&CR.grab&&CR.grab.e===g.e);LOCK=f;return;}}
  LOCK=jaws(g.e,{mode:'lock',lead:.001,open:.1,sc:1.1,until:()=>!!(window.CR&&CR.grab&&CR.grab.e===g.e)});}
hook('cbShake',(a)=>{at(a,.52,()=>{const e=(a.hitList||[])[0];if(!e||e.dead)return;sprite({layer:'top',life:.4,fi:.01,fo:.2,paint:()=>{if(e.dead)return;drops(e.x,e.y,zOf(e),1,{spd:40,up:60});}});});});
hook('cbRoll',(a,c)=>{a._jw=1;const e=tgtOf(a,c)||ctgt(c,100);if(e)at(a,.001,()=>{if(!e.dead)jaws(e,{sc:1.15,lead:rt(.1),k:'cbRoll'});});});
hook('cbFrenzy',(a,c)=>{a._jw=1;const e=tgtOf(a,c)||ctgt(c,240);if(e)at(a,.001,()=>{if(!e.dead)jaws(e,{sc:1.25,lead:rt(.1),k:'cbFrenzy',open:.7});});
  const tEnd=a.events.reduce((m,v)=>Math.max(m,v.t),0);at(a,tEnd-.1*TEMPO(),()=>{const t=(a.hitList||[])[0];if(!t||t.dead)return;if(LOCK&&LOCK.e===t&&!LOCK._end){LOCK._end=1;LOCK.endT=LOCK.t;LOCK.life=LOCK.t+.2;}
    jaws(t,{sc:1.75,lead:rt(Math.max(.02,tEnd-a.t)),k:'cbFrenzy',open:.8,big:1,onShut:j=>addFx(new KBurst({e:j.e,x:j.x,y:j.y,z:zOf(j.e),R:56,n:13,pal:PAL.blood,life:.3}))});});});
function splashRing(x,y,R){splash(x,y,1.5,{kind:CRX.fz>=CRX_BAL.fz.need||aKey()==='cbFrenzy'?'blood':'water'});ring({x,y,r0:12,r1:R*1.4,w:8,pal:PAL.river,life:.45,segs:6,gap:.2});foam(x,y,10,R*.7);}
/* Drag Under: the target is pulled through a little whirlpool to the croc's jaws */
hook('cbDrag',(a,c)=>{const e=tgtOf(a,c)||ctgt(c,170);at(a,a.windup+.002,()=>{if(e&&!e.dead){addFx(new Whirl({x:e.x,y:e.y,R:28,life:.6,spin:-8,follow:e}));drops(e.x,e.y,6,6,{spd:120,up:160});}});});

/* ---- buffs: Defensive Scales (scutes close round the croc), River Stride (water at the feet), Iron Jaws (iron jaws clang shut twice),
        Feeding Frenzy (blood pulse, red eyes), Ancient Maw Awakening (the Cipactli spirit) ---- */
function scaleShell(gold){const S=[];for(let i=0;i<8;i++)S.push({an:i/8*TAU,r0:R_(70,90)});const draw=(f,front)=>{const t=f.t,k=eO(cl(t/.26,0,1)),fl=cl((t-.24)/.12,0,1);
    for(const q of S){const an=q.an+t*1.6,sn=Math.sin(an);if((sn>=0)!==front)continue;const r=lerp(q.r0,27,k)*HZK,[x,y]=P(player.x+Math.cos(an)*r,player.y+sn*r*.9,(10+16*k)*HZK);
      art(gold?'scuteG':'scute',x,y,15+3*sn,{sx:.55+.45*Math.abs(Math.cos(an)),under:'#0a1208',ua:.35});if(fl>0&&fl<1){ctx.globalCompositeOperation='lighter';star(x,y-2,9*Math.sin(Math.PI*fl),'#f4ffd8',0);ctx.globalCompositeOperation='source-over';}}};
  sprite({layer:'ground',follow:player,life:.62,fi:.03,fo:.2,paint:f=>draw(f,false)});sprite({layer:'top',follow:player,life:.62,fi:.03,fo:.2,paint:f=>draw(f,true)});
  ring({x:player.x,y:player.y,r0:12,r1:44,w:5,pal:gold?PAL.gold:PAL.jade,life:.4,segs:6,gap:.25,delay:.22});}
hook('crScales',(a)=>at(a,a.windup+.001,()=>scaleShell(0)));
hook('crStride',(a)=>at(a,a.windup+.001,()=>{const x=player.x,y=player.y;splash(x,y,.8);addFx(new Whirl({x,y,R:30,life:.5,spin:5}));}));
hook('cbIronJaws',(a)=>{for(const [dt,s] of [[0,1],[.16,.85]])at(a,a.windup+dt*TEMPO()+.001,()=>{const ph=player.phi,x=player.x+Math.cos(ph)*44,y=player.y+Math.sin(ph)*44;
    addFx(new Jaws({x,y,z:32,sc:s,skin:'i',lead:.05,hold:.05,rel:.14,mode:'snap',onShut:j=>{const S=sys('top');V.G.sparks(S,j.x,j.y,32,9,'#ffd27a',260,160,.35);addFx(new KGlint({x:j.x,y:j.y,z:36,s:18,col:'#fff0b0',life:.2}));}}));});});
hook('ccFeast',(a)=>at(a,a.windup+.001,()=>{const x=player.x,y=player.y;ring({x,y,r0:10,r1:90,w:7,pal:PAL.blood,life:.45,segs:5,gap:.25});ring({x,y,r0:6,r1:60,w:5,pal:PAL.blood,life:.4,segs:4,gap:.3,delay:.1});
    blood(x,y,30,12,{spd:160,up:200});eyeFlash('eyeR');}));
hook('ccAwaken',(a)=>{at(a,.24,()=>{const T=rt(Math.max(.1,a.windup-.24)),S=sys('top');for(let i=0;i<18;i++){const an=R_(0,TAU),r=R_(20,60);S.add({im:tx('core','#ffa526'),x:player.x+Math.cos(an)*r,y:player.y+Math.sin(an)*r*.8,z:2,vz:R_(60,120),dr:.6,s0:R_(6,10),s1:2,life:R_(.5,.8),add:1,str:1.6,fo:.4,delay:R_(0,Math.max(.05,T-.5))});}
    sprite({layer:'ground',follow:player,life:T+.2,fi:.1,fo:.15,paint:(f)=>{const k=cl(f.t/T,0,1),[x,y]=P(player.x,player.y,0);ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,2,0,0,58);g.addColorStop(0,`rgba(255,165,38,${.42*k})`);g.addColorStop(1,'rgba(255,165,38,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,58,0,TAU);ctx.fill();ctx.restore();}});});
  at(a,a.windup+.001,()=>{addFx(new Spirit({side:Math.cos(sang(player.phi))>=0?1:-1}));eyeFlash('eyeA');dust(player.x,player.y,8,{ring:20,size:46,spd:110,life:.8});});});
function eyeFlash(n){sprite({layer:'top',follow:player,life:.6,fi:.03,fo:.25,paint:(f)=>{const s=player.socket;if(!s||!s.head)return;const sd=typeof dirSide==='function'?dirSide(player.dir):1,k=eO(cl(f.t/.1,0,1));
  for(const o of [-3.5,3.5])art(n,s.head[0]+sd*6+o,s.head[1]-2,(9+5*k),{under:'#000',ua:.3});}});}
CV.scaleShell=scaleShell;

/* ---------------------------------------------------------------------
   7. WATCHERS & GAUGES — Blood Frenzy drops under the croc, Armor Break plates over enemies, Off-Balance stars, buffs that last
      (calm on purpose: a buff must never hide the hero)
   --------------------------------------------------------------------- */
const W={acc:{},sc0:0,anc0:0,maw0:0};const every=(k,s,dt)=>{W.acc[k]=(W.acc[k]||0)+dt;if(W.acc[k]>=s){W.acc[k]=0;return true;}return false;};
class CWatchGround{constructor(){this.layer='ground';this.t=0;}update(dt){this.t+=dt;return CHAR==='croc';}
  draw(){const t=this.t;
    /* Defensive Scales: a faint ring of scutes stays at the feet while the next hit is guarded; Ancient Scales: gold */
    for(const [b,n] of [['crScales','scute'],['crAncient','scuteG']])if(hasBuff(b))for(let i=0;i<6;i++){const an=t*.9+i*TAU/6,sn=Math.sin(an),[x,y]=P(player.x+Math.cos(an)*24*HZK,player.y+sn*21*HZK,3);art(n,x,y,11+2*sn,{flat:1,a:.55,rot:an});}
    /* Feeding Frenzy: blood mist curls at the feet */
    if(hasBuff('crFeast')){const [x,y]=P(player.x,player.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,4,0,0,46);g.addColorStop(0,'rgba(200,20,30,.32)');g.addColorStop(1,'rgba(200,20,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,46,0,TAU);ctx.fill();ctx.restore();}}}
class CWatchTop{constructor(){this.layer='top';this.t=0;}
  update(dt){this.t+=dt;lockWatch();
    if(hasBuff('crStride')&&player.moving&&every('st',.16,dt)){const ph=player.phi+Math.PI;drops(player.x+Math.cos(ph)*8,player.y+Math.sin(ph)*8,3,2,{dir:ph,spread:.8,spd:70,up:110,s:.8});ring({x:player.x,y:player.y,r0:4,r1:22,w:2.6,pal:PAL.river,life:.45,segs:3,gap:.3});}
    if(hasBuff('crEdge')&&every('ed',.6,dt)){const q=hands();addFx(new KGlint({x:q[0]+Math.cos(player.phi)*16,y:q[1]+Math.sin(player.phi)*16,z:q[2]+4,s:9,col:PAL.jade[2],life:.22}));}
    if(hasBuff('crIronJaws')&&every('ij',.9,dt)){const s=player.socket;if(s&&s.head)addFx(new KGlint({x:0,y:0,z:0,scr:[s.head[0]+(typeof dirSide==='function'?dirSide(player.dir):1)*9,s.head[1]+3],s:8,col:'#ffe08a',life:.2}));}
    if(hasBuff('crFeast')&&every('fe',.5,dt))blood(player.x+R_(-10,10),player.y+R_(-6,6),R_(18,40),1,{spd:20,up:60,s:.8});
    /* Ancient Scales wake (HP < 30%): gold scutes close round the croc once */
    const anc=hasBuff('crAncient');if(anc&&!W.anc0)scaleShell(1);W.anc0=anc;
    /* bleeding prey drips */
    if(every('bl',.42,dt))for(const e of enemies)if(!e.dead&&e.st&&e.st.bleed>0&&Math.hypot(e.x-player.x,e.y-player.y)<600)blood(e.x+R_(-6,6),e.y,zOf(e)-4,1,{spd:20,up:30,s:.85});
    return CHAR==='croc';}
  draw(){}}
let WG=null,WT=null;CV.ensure=()=>{if(!WG||!fx.includes(WG))WG=addFx(new CWatchGround());if(!WT||!fx.includes(WT))WT=addFx(new CWatchTop());};CV.ensure();
/* a map change clears every effect object: the watchers come back with the next cast (crEnsure in char_croc.js) or the next hit */
/* Defensive Scales absorbs a hit: the shell flashes and bursts */
if(typeof window.jgAbsorb==='function'){const j0=window.jgAbsorb;window.jgAbsorb=function(d,e){const had=hasBuff('crScales'),r=j0.apply(this,arguments);if(had&&!hasBuff('crScales')){const S=sys('top'),im=AR.get('scute');
  if(im)for(let i=0;i<8;i++){const a=i/8*TAU,v=R_(120,200);S.add({im,asp:.9,x:player.x+Math.cos(a)*20,y:player.y+Math.sin(a)*16,z:R_(14,30),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R_(120,220),g:800,dr:.6,s0:13,s1:11,life:R_(.6,.9),fo:.3,rot:R_(0,TAU),vr:R_(-10,10),bounce:.25});}
  addFx(new KGlint({x:player.x,y:player.y,z:34,s:24,col:'#f4ffd8',life:.22}));ring({x:player.x,y:player.y,r0:10,r1:56,w:5,pal:PAL.jade,life:.32});}return r;};}
/* gauges: the croc's own draw functions are replaced (same information, new look) */
if(typeof CrxCore!=='undefined')CrxCore.prototype.draw=function(){const t=gameTime,[x,y]=P(player.x,player.y,0),need=CRX_BAL.fz.need,cap=CRX_BAL.fz.cap,fz=CRX.fz;
  if(fz>0||LV.cbJaw){for(let i=0;i<cap;i++){const on=i<fz,an=Math.PI*(.18+.64*i/(cap-1)),px=x+Math.cos(an)*-30,py=y+12+Math.sin(an)*7,full=fz>=cap,hot=fz>=need;
      if(!on){ctx.save();ctx.globalAlpha=.32;art('pip',px,py,5.4,{});ctx.restore();continue;}const pul=full?1+.18*Math.sin(t*12+i):1;
      if(hot){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35;star(px,py,6*pul,'#ff6a5a',0);ctx.restore();}art('pip',px,py,7.6*pul,{under:'#2a0406',ua:.45});}}
  for(const e of enemies){if(e.dead||!(e.crAB>0))continue;const n=e.crAB,[ex,ey]=P(e.x,e.y,(e.boss?82:56)),pop=cl((t-(ABPOP.get(e)||-9))/.16,0,1),g=n>=5;
    for(let i=0;i<n;i++){const last=i===n-1,sc=last?(.6+.4*back(pop)):1;art(g?'abG':'ab',ex-(n-1)*5.2+i*10.4,ey,9.5*sc,{under:'#000',ua:.35});}}};
if(typeof CrOverlay!=='undefined')CrOverlay.prototype.draw=function(){const t=this.t;
  for(const e of enemies){if(e.dead||!isOff(e))continue;const [x,y]=P(e.x,e.y,(e.boss?70:48));for(let i=0;i<3;i++){const an=t*6+i*TAU/3,sn=Math.sin(an);star(x+Math.cos(an)*13,y+sn*4,4+1.4*sn,'#ffb030',an);}}
  if(hasBuff('crMaw')&&player.socket&&player.socket.head){const [hx,hy]=player.socket.head,sd=dirSide(player.dir);ctx.save();ctx.globalCompositeOperation='lighter';
    for(const o of [-3,3]){const g=ctx.createRadialGradient(hx+sd*6+o,hy-2,0,hx+sd*6+o,hy-2,7);g.addColorStop(0,'rgba(255,210,90,.95)');g.addColorStop(1,'rgba(255,140,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(hx+sd*6+o,hy-2,7,0,TAU);ctx.fill();}
    ctx.restore();const [x,y]=P(player.x,player.y,0);for(let i=0;i<4;i++){const u=(t*.8+i/4)%1,yy=y-(26+u*40)*HZK,xx=x-sd*(6+i*2)*HZK;ctx.save();ctx.globalAlpha=Math.sin(Math.PI*u)*.8;art('scuteG',xx,yy,7,{});ctx.restore();}}};
})();
