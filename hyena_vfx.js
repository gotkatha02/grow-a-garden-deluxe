/* =====================================================================
   PAINTED JESTER (hyena, hero #18) — skill effects, code VFX on the FXLIB kit (fxlib.js) + vector art (hyena_art.js).
   Owner 2026-11-28 'ทำเอฟเฟคสกิลของไฮยีน่าให้หน่อย'. The hero is not in the game yet (HYENA_SKILLS_TH.md): every effect is
   built and checked in the gallery hyena_fx.html; char_hyena.js will call them at the real moments. Plan: HYENA_FX_PLAN_TH.md.

   LOOK   his own colours: rift violet + magenta flicks (the sheet's shadow doubles), harlequin black / white diamonds, gold bells.
          A = a stage assassin (thin crystal stabs, eyes in the dark, spotlights, jaws) · B = a painter-thief (brush strokes,
          paint pots, masks, Joker cards, and the stolen skills as their own shadow: ink violet mixed with the source colour).
   USE    HYV.play('hy.<name>', o) or FXLIB.play — o: x y (the hero) · phi · hero (entity) · target (entity) · targets [] ·
          x2 y2 (a ground point) · lead (real seconds from the call to the hit; each effect has its own default) · el (stolen
          colour) · n · big · dur · demo {img, hero} (the gallery only: moves / hides the stand-in, draws doubles)
          Marks that live on a monster: HYV.stare(e,n) · HYV.masks(e,[0 weep,1 scorn,2 sleepy]) · HYV.spellbound(e,dur) ·
          HYV.expose(e,dur) · HYV.silence(e,dur) · HYV.lure(e,dur)
          Doubles: HYV.drawInk(img, x, y, z, height, {rise, a, flip}) draws any picture (an atlas frame) as shadow ink;
          HYV.Dbl = a part that does it for a while (the gallery's stand-in doubles)
   ===================================================================== */
(()=>{
'use strict';
if(typeof CHAR!=='undefined'&&CHAR!=='hyena')return;
const FX=window.FXLIB,ART=window.HYART;if(!FX||!ART)return;
const k=FX.k,{TAU,cl,lerp,eO,eO2,eI,eIO,back,R,pick,sg,KY,rgba,SH,pal,PAL,tex,spr,glowAt,coreAt,starAt,drawSpr,sys,bits,sparks,puffs,glints,A,after,Part,Fn,Emit,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Beam,Gush,Sigil,Proj,Wave,Spike,orbit,Spr,cv,BIT}=k,H=k.h;
const HZ=62,hz=e=>(e&&e.hz)||HZ,MAG='#ff4fd8',VIO='#a24bff',INKD='#12061f';
const d2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),ang=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const tg=o=>o.target||(o.targets&&o.targets[0])||(o.x2!=null?{x:o.x2,y:o.y2,z:0}:null);
const near=(o,c,r)=>(o.targets||(o.target?[o.target]:[])).filter(e=>d2(e,c)<=r);
const DEMO=o=>o&&o.demo;
const lead=(o,v)=>o.lead==null?v:o.lead;
/* the stolen-skill palette: shadow ink first, the source colour inside (HYV.mix('ice') → 'hy_ice') */
function mix(el){el=el||'rift';const key='hy_'+el;if(!PAL[key]){const q=pal(el);PAL[key]=[PAL.ink[0],PAL.rift[1],q[2],q[3],q[4]];BIT[key]=BIT[el]||BIT.rift;}return key;}

/* ---------------------------------------------------------------------
   1. SHADOW INK — any picture (his atlas frames, the gallery stand-in) drawn as a see-through violet double
   --------------------------------------------------------------------- */
const INKC=new WeakMap();
function inked(im){if(!im)return null;let r=INKC.get(im);if(r)return r;const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;if(!w||!h||(im.complete===false))return null;const pad=10;
  const body=cv(w+pad*2,h+pad*2,g=>{g.drawImage(im,pad,pad,w,h);let d=null;try{d=g.getImageData(0,0,g.canvas.width,g.canvas.height);}catch(e){}
    if(d){const a=d.data,lo=[22,8,44],hi=[184,136,255],pk=[255,128,236];for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const r0=a[i],g0=a[i+1],b0=a[i+2],t=Math.pow((r0*.3+g0*.59+b0*.11)/255,1.1);
        if(b0>150&&b0>g0+80){a[i]=pk[0];a[i+1]=pk[1];a[i+2]=pk[2];}else{a[i]=lo[0]+(hi[0]-lo[0])*t;a[i+1]=lo[1]+(hi[1]-lo[1])*t;a[i+2]=lo[2]+(hi[2]-lo[2])*t;}}g.putImageData(d,0,0);}
    else{g.globalCompositeOperation='source-in';g.fillStyle='#5a2fa8';g.fillRect(0,0,g.canvas.width,g.canvas.height);}});
  const sil=cv(body.width,body.height,g=>{g.drawImage(body,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#c060ff';g.fillRect(0,0,body.width,body.height);});
  const sm=cv(Math.ceil(sil.width/6),Math.ceil(sil.height/6),g=>{g.imageSmoothingQuality='high';g.drawImage(sil,0,0,g.canvas.width,g.canvas.height);});
  const rim=cv(sil.width,sil.height,g=>{g.imageSmoothingQuality='high';g.drawImage(sm,0,0,sil.width,sil.height);g.drawImage(sm,0,0,sil.width,sil.height);});
  r={body,rim,pad,w,h};INKC.set(im,r);return r;}
function drawInk(im,x,y,z,h,o){o=o||{};const r=inked(im);if(!r)return;const rise=o.rise==null?1:o.rise,a=o.a==null?.8:o.a;if(rise<=0||a<=.01)return;
  const s=P(x,y,z||0),sc=h/r.h,W=r.body.width*sc,Hh=r.body.height*sc,x0=s[0]-W/2,y0=s[1]-(r.pad+r.h)*sc;
  ctx.save();if(rise<1){ctx.beginPath();ctx.rect(x0-30,s[1]-h*rise-6,W+60,h*rise+r.pad*sc+8);ctx.clip();}
  if(o.flip){ctx.translate(s[0],0);ctx.scale(-1,1);ctx.translate(-s[0],0);}
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=a*.55*(o.glow==null?1:o.glow);ctx.drawImage(r.rim,x0,y0,W,Hh);ctx.restore();
  ctx.save();if(rise<1){ctx.beginPath();ctx.rect(x0-30,s[1]-h*rise-6,W+60,h*rise+r.pad*sc+8);ctx.clip();}if(o.flip){ctx.translate(s[0],0);ctx.scale(-1,1);ctx.translate(-s[0],0);}
  ctx.globalAlpha*=a;ctx.drawImage(r.body,x0,y0,W,Hh);ctx.restore();}
/* a double for a while: rises out of an ink pool, stays, sinks back (or `pop` = bursts at the end) */
class Dbl extends Part{constructor(o){super(o,{layer:'sorted',life:2.4,rise:.32,sink:.26,h:58,a:.8,flip:0,z:0,bob:0});}
  paint(){const t=this.t,L=this.life,ri=eO(cl(t/this.rise,0,1))*(this.pop?1:1-eI(cl((t-(L-this.sink))/this.sink,0,1))),o=this.pos(),q=P(o[0],o[1],0),fa=this.pop?cl((L-t)/.12,0,1):1;
    if(this.pool!==0){ctx.save();ctx.translate(q[0],q[1]);ctx.scale(1,KY());ctx.globalAlpha*=.6*Math.min(1,ri*2)*fa;ctx.drawImage(tex('pool',INKD),-28,-28,56,56);ctx.restore();}
    if(this.im)drawInk(this.im,o[0],o[1],(o[2]||0)+(this.bob?Math.abs(Math.sin(t*this.bob))*9:0),this.h,{rise:ri,a:this.a*fa,flip:typeof this.flip==='function'?this.flip():this.flip});}}

/* ---------------------------------------------------------------------
   2. SMALL PIECES
   --------------------------------------------------------------------- */
/* the shadow thread from his feet to a double's feet (a, b = entities or points; follows them) */
function thread(a,b,o){o=o||{};return A(new Fn({layer:'ground',life:o.life||2.4,fi:.08,fo:.3,delay:o.delay||0,d(q){const al=q.fade(),g=eO(cl(q.t/.25,0,1)),A0=P(a.x,a.y,0),B0=P(b.x,b.y,0),dx=B0[0]-A0[0],dy=B0[1]-A0[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,N=Math.max(6,L/9|0);
  ctx.save();ctx.globalAlpha*=al;ctx.lineCap='round';ctx.lineJoin='round';for(const [w,c] of [[4.4,rgba(INKD,.55)],[2.4,'#7a3cf0'],[1,'#e0b8ff']]){ctx.lineWidth=w;ctx.strokeStyle=c;ctx.beginPath();const M=Math.max(1,Math.round(N*g));for(let i=0;i<=M;i++){const u=i/N,wv=Math.sin(u*9-q.t*7)*3.2*Math.sin(Math.PI*u),X=A0[0]+dx*u+nx*wv,Y=A0[1]+dy*u+ny*wv;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();}ctx.restore();}}));}
/* an upright rift tear in the air (Switcheroo, Body Double, Killing Joke) */
function tear(x,y,o){o=o||{};const hh=o.h||74,ww=o.w||15,L=o.life||.55,jag=[];for(let i=0;i<=8;i++)jag.push(R(-.6,.6));
  return A(new Fn({layer:'sorted',x,y,sortOff:o.sortOff==null?3:o.sortOff,life:L,delay:o.delay||0,d(q){const kk=q.t/L,op=kk<.28?eO(kk/.28):1-eI((kk-.28)/.72),s=P(x,y,o.z||6),W=ww*op;if(W<.3)return;
    const path=sc=>{ctx.beginPath();for(let i=0;i<=8;i++){const u=i/8,X=s[0]+jag[i]*5+Math.sin(Math.PI*u)*W*sc,Y=s[1]-u*hh;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}for(let i=8;i>=0;i--){const u=i/8,X=s[0]+jag[i]*5-Math.sin(Math.PI*u)*W*sc,Y=s[1]-u*hh;ctx.lineTo(X,Y);}ctx.closePath();};
    ctx.save();path(1.45);ctx.fillStyle=rgba(INKD,.55);ctx.fill();path(1);ctx.fillStyle='#6a24d0';ctx.fill();path(.66);ctx.fillStyle=MAG;ctx.fill();path(.3);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();glowAt(s[0],s[1]-hh/2,hh*.75,VIO,.55*op);}}));}
/* jagged 'laugh' rings running out on the ground (Hyena's Cackle, Killing Joke) */
function laughRing(x,y,r,o){o=o||{};const n=o.n||30,jit=[];for(let i=0;i<n;i++)jit.push(R(.82,1.18));const p=pal(o.el||'jest');
  return A(new Fn({layer:'ground',x,y,life:o.life||.55,delay:o.delay||0,d(q){const kk=q.t/q.life,rr=r*eO(kk),al=Math.pow(1-kk,1.1),s=P(x,y,0);if(rr<2)return;ctx.save();ctx.globalAlpha*=al;ctx.translate(s[0],s[1]);ctx.scale(1,KY());
    ctx.beginPath();for(let i=0;i<=n;i++){const j=i%n,a=j/n*TAU,R0=rr*(i%2?.9:1)*(1+(jit[j]-1)*.35);i?ctx.lineTo(Math.cos(a)*R0,Math.sin(a)*R0):ctx.moveTo(Math.cos(a)*R0,Math.sin(a)*R0);}ctx.closePath();
    ctx.lineJoin='miter';ctx.lineWidth=9*(1-kk)+2;ctx.strokeStyle=rgba(p[0],.45);ctx.stroke();ctx.lineWidth=5*(1-kk)+1.2;ctx.strokeStyle=p[2];ctx.stroke();ctx.lineWidth=2*(1-kk)+.6;ctx.strokeStyle=p[4];ctx.stroke();ctx.restore();}}));}
/* comic sound arcs in front of a mouth (screen space) */
function soundArcs(e,phi,o){o=o||{};const p=pal(o.el||'jest');return A(new Fn({layer:'top',life:o.life||.5,delay:o.delay||0,d(q){const kk=q.t/q.life,s=P(e.x+Math.cos(phi)*14,e.y+Math.sin(phi)*14,(e.z||0)+(o.z||46)),sa=H.scrAng(phi);
  ctx.save();ctx.translate(s[0],s[1]);ctx.rotate(sa);ctx.lineCap='round';for(let i=0;i<3;i++){const u=cl(kk*1.4-i*.18,0,1);if(u<=0||u>=1)continue;const r=10+u*(o.r||46),al=1-u;ctx.globalAlpha=al;ctx.lineWidth=5;ctx.strokeStyle=rgba(p[0],.5);ctx.beginPath();ctx.arc(0,1.5,r,-.7,.7);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=p[2];ctx.beginPath();ctx.arc(0,0,r,-.7,.7);ctx.stroke();ctx.lineWidth=1.2;ctx.strokeStyle=p[4];ctx.stroke();}ctx.restore();}}));}
/* an icon above a monster's head (follows it) */
function above(e,im,w,o){o=o||{};return A(new Spr(Object.assign({im,w,follow:e,z:hz(e)+(o.dz==null?12:o.dz),layer:'top',pop:.22,s0:.2,s1:1,life:1.6,fi:.05,fo:.3,bob:2},o)));}
/* a stab mark on a body: crossing crystal cuts + a small flash + confetti */
function stabHit(e,o){o=o||{};const p=o.el||'rift',z=(e.z||0)+(o.z||hz(e)*.5),n=o.n||1,s=o.s||1;for(let i=0;i<n;i++)A(new Cut({x:e.x,y:e.y,z:z+R(-6,6),ang:(o.ang==null?R(-.9,.9):o.ang)+i*1.3,L:44*s,w:8*s,life:.2,el:p,delay:i*.03}));
  A(new Flash({x:e.x,y:e.y,z,el:p,s0:8*s,s1:34*s,life:.16}));const S=sys('top');bits(S,'rift',e.x,e.y,z,o.bits==null?4:o.bits,{size:.8*s,sp:.8});return S;}
/* a backstab: deep X cut that ignores armour (cracked plate pops), white-violet crit flash */
function backstab(e,o){o=o||{};const z=(e.z||0)+hz(e)*.5,s=o.s||1;A(new Cut({x:e.x,y:e.y,z,ang:-.75,L:74*s,w:13*s,life:.26,el:'rift'}));A(new Cut({x:e.x,y:e.y,z,ang:.75,L:74*s,w:13*s,life:.26,el:'jest',delay:.04}));
  A(new Flash({x:e.x,y:e.y,z,el:'rift',s0:18*s,s1:70*s,life:.2}));A(new Burst({x:e.x,y:e.y,z,el:'jest',r:34*s,n:10,life:.24}));
  const pl=above(e,spr('hyCrk','rift'),22*s,{dz:-hz(e)*.42,life:.55,bob:0,pop:.12,vz:30,fo:.25});pl.spin=R(-2,2);
  const S=sys('top');bits(S,'steel',e.x,e.y,z,5,{size:.9*s,only:0});bits(S,'rift',e.x,e.y,z,6,{size:s});if(!o.quiet)SH(2.2*s);}
/* a firework burst of harlequin diamonds and star flares (Shadow Confetti, the finales) */
function firework(x,y,z,o){o=o||{};const s=o.s||1,S=sys('top');A(new Flash({x,y,z,el:o.el||'rift',s0:16*s,s1:84*s,life:.24}));
  for(let i=0;i<3;i++){const c=[ '#ffffff',VIO,'#ffc23a'][i];after(.04+i*.08,()=>{const a=R(0,TAU),d=R(10,30)*s;const q=P(x+Math.cos(a)*d,y+Math.sin(a)*d,z+R(-10,14)*s);A(new Fn({layer:'top',life:.3,d(f){starAt(q[0],q[1],(20+40*eO(f.t/.3))*s,c,1-f.t/.3,f.t*3);}}));});}
  const N=Math.round((o.n||26)*s);for(let i=0;i<N;i++){const a=i/N*TAU+R(-.1,.1),v=R(130,260)*s;S.add({im:spr('hyDia',o.el||'rift',i%4),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R(60,200)*s,g:360,dr:1.6,s0:R(8,13)*s,s1:R(6,10)*s,life:R(.7,1.1),rot:R(0,TAU),vr:R(-10,10),fo:.4});}
  sparks(S,'#e0b8ff',x,y,z,Math.round(10*s),260*s,140,.5);return S;}
/* an ink splash out of the ground: a crown of ink spikes, flying drops, a pool (Shadow Melt emerging, Killing Joke, stolen ground skills) */
function inkBurst(x,y,o){o=o||{};const s=o.s||1,N=9,sp=[];for(let i=0;i<N;i++)sp.push({a:i/N*TAU+R(-.2,.2),h:R(.6,1),w:R(.7,1.1)});
  A(new Fn({layer:'sorted',x,y,sortOff:2,life:.5,d(q){const kk=q.t/q.life,H0=(o.h||46)*s,ky=KY();ctx.save();ctx.globalAlpha*=cl((1-kk)/.3,0,1);
    for(const back2 of [1,0])for(const c of sp){const sn=Math.sin(c.a);if((sn<0)!==!!back2)continue;const r=(12+20*eO(kk))*s,bx=x+Math.cos(c.a)*r,by=y+sn*r*.75,hh=H0*c.h*Math.sin(Math.PI*Math.min(1,kk*1.25)),lean=Math.cos(c.a)*hh*.35,b0=P(bx,by,0),tp=P(bx+lean,by,hh),wd=5.5*s*c.w*(1-kk*.5);if(hh<1)continue;
      ctx.fillStyle=back2?'#24103f':'#3b1a6e';ctx.beginPath();ctx.moveTo(b0[0]-wd,b0[1]);ctx.quadraticCurveTo(b0[0]-wd*.4,(b0[1]+tp[1])/2,tp[0],tp[1]);ctx.quadraticCurveTo(b0[0]+wd*.4,(b0[1]+tp[1])/2,b0[0]+wd,b0[1]);ctx.closePath();ctx.fill();
      ctx.fillStyle='#8a63c8';ctx.beginPath();ctx.arc(tp[0],tp[1],wd*.55,0,TAU);ctx.fill();}ctx.restore();}}));
  const S=sys('sorted',y+3);for(let i=0;i<14;i++){const a=R(0,TAU),v=R(40,120)*s;S.add({im:spr('drop','ink'),x:x+Math.cos(a)*6,y:y+Math.sin(a)*4,z:4,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R(160,320)*s,g:760,dr:1,s0:R(8,13)*s,life:R(.5,.8),face:1,fo:.3,bounce:.1});}
  puffs(sys('sorted',y+2),'ink',x,y,10,5,30*s,60,26,.6);A(new Ring({x,y,el:'rift',r0:6,r1:50*s,w0:7,life:.34}));A(new Disc({x,y,kind:'pool',add:0,col:INKD,r0:16*s,r1:34*s,life:.9,a:.6,fo:.5}));
  A(new Flash({x,y,z:24,el:'rift',s0:10*s,s1:46*s,life:.2}));}
/* confetti rain over an area */
function rain(x,y,r,o){o=o||{};const S=sys('top'),N=o.n||40;for(let i=0;i<N;i++){const a=R(0,TAU),d=Math.sqrt(Math.random())*r;S.add({im:spr(i%7===0?'hyBell':'hyDia',o.el||'rift',i%4),x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,z:R(150,260),vz:R(-40,-10),g:120,dr:2.5,s0:R(8,12),life:R(1.1,1.7),delay:R(0,o.spread||.6),rot:R(0,TAU),vr:R(-6,6),wob:6,wf:R(4,7),fo:.3});}return S;}
/* a spotlight from above onto a ground point (pt or o.at(t) for a moving one) */
function spot(o){return A(new Fn({layer:'top',life:o.life||1,fi:o.fi||.15,fo:o.fo||.3,delay:o.delay||0,d(q){const a=q.fade(),pt=o.at?o.at(q.t):o,col=o.col||'#fff0b0',r=o.r||46,ky=KY(),top=P(pt.x+(o.lean||0),pt.y-(o.back||0),o.h||330),bot=P(pt.x,pt.y,0);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=a*(o.a||.5);const gr=ctx.createLinearGradient(0,top[1],0,bot[1]);gr.addColorStop(0,rgba(col,0));gr.addColorStop(.55,rgba(col,.32));gr.addColorStop(1,rgba(col,.55));ctx.fillStyle=gr;
  ctx.beginPath();ctx.moveTo(top[0]-5,top[1]);ctx.lineTo(top[0]+5,top[1]);ctx.lineTo(bot[0]+r,bot[1]);ctx.ellipse(bot[0],bot[1],r,r*ky,0,0,Math.PI);ctx.closePath();ctx.fill();ctx.drawImage(tex('pool',col),bot[0]-r,bot[1]-r*ky,r*2,r*2*ky);ctx.restore();}}));}
/* a dark stage over an area — drawn after the units (sorted, far down) so the bodies go dark too */
function darkness(x,y,r,life,o){o=o||{};return A(new Fn({layer:'sorted',x,y,sortOff:5000,life,fi:o.fi||.22,fo:o.fo||.28,d(q){const a=q.fade(),s=P(x,y,0),ky=KY();ctx.save();ctx.globalAlpha*=a*(o.a||.86);ctx.translate(s[0],s[1]-26);ctx.scale(1,ky*1.25);
  const gr=ctx.createRadialGradient(0,0,0,0,0,r);gr.addColorStop(0,'rgba(8,2,18,.95)');gr.addColorStop(.78,'rgba(10,3,24,.85)');gr.addColorStop(1,'rgba(10,3,24,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
  ctx.globalAlpha=a*.5;ctx.lineWidth=3;ctx.strokeStyle=VIO;ctx.setLineDash([16,10]);ctx.lineDashOffset=-q.t*30;ctx.beginPath();ctx.arc(0,0,r*.86,0,TAU);ctx.stroke();ctx.restore();}}));}
/* a pair of eyes opening in the dark */
function eyesAt(x,y,z,o){o=o||{};const L=o.life||.7,ph=R(0,TAU);return A(new Fn({layer:'top',life:L,delay:o.delay||0,d(q){const kk=q.t/L,op=kk<.2?eO(kk/.2):kk>.75?1-(kk-.75)/.25:1,s=P(x,y,z);if(op<=0)return;
  for(const dx of [-7,7]){ctx.save();ctx.translate(s[0]+dx,s[1]);ctx.scale(1,Math.max(.08,op*(1-.9*Math.max(0,Math.sin(q.t*9+ph))*(kk>.4&&kk<.5?1:0))));glowAt(0,0,13,MAG,.6);ctx.fillStyle='#ffe0fb';ctx.beginPath();ctx.ellipse(0,0,5,2.6,0,0,TAU);ctx.fill();ctx.fillStyle=VIO;ctx.beginPath();ctx.ellipse(0,0,1.4,2.4,0,0,TAU);ctx.fill();ctx.restore();}}}));}
/* the paint splat decal on the ground */
function splat(x,y,r,el,o){o=o||{};const im=ART.ring('splat',el,o.seed||((Math.random()*9|0)+1)),rot=R(0,TAU);return A(new Fn({layer:'ground',x,y,life:o.life||1.6,fi:.05,fo:.6,d(q){const a=q.fade(),pk=back(cl(q.t/.16,0,1)),s=P(x,y,0),rr=r*pk;ctx.save();ctx.globalAlpha*=a*.92;ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.rotate(rot);ctx.drawImage(im,-rr*1.3,-rr*1.3,rr*2.6,rr*2.6);ctx.restore();}}));}
/* the face-paint flash on his head (a new colour after a steal) */
function facePaint(e,el){const p=pal(el||'rift');A(new Spr({im:spr('hyStar',el||'rift'),w:15,follow:e,z:(e.z||0)+54,layer:'top',pop:.18,s0:.2,s1:1,life:.55,fo:.25,glow:p[2],spin:2}));glints(sys('top'),p[3],e.x,e.y,(e.z||0)+50,3,10,.5);}

/* ---------------------------------------------------------------------
   3. MARKS THAT LIVE ON A MONSTER (one of each per monster)
   --------------------------------------------------------------------- */
const MK={stare:new WeakMap(),masks:new WeakMap(),spell:new WeakMap()};
const live=p=>p&&p.t<p.life&&!p._dead;
class Stare extends Part{constructor(o){super(o,{layer:'top',life:8,fi:.1,fo:.3});this.n=0;this.pt=[-9,-9,-9];}
  set(n){n=cl(n,0,3);for(let i=this.n;i<n;i++)this.pt[i]=this.t;this.n=n;this.life=this.t+(this.hold||8);}
  paint(){const e=this.follow,a=cl(this.t/this.fi,0,1)*cl((this.life-this.t)/this.fo,0,1);if(!e||a<=.01)return;const s=P(e.x,e.y,(e.z||0)+hz(e)+24);ctx.save();ctx.globalAlpha*=a;
    for(let i=0;i<3;i++){const x=s[0]+(i-1)*15,y=s[1];if(i<this.n){const pk=back(cl((this.t-this.pt[i])/.25,0,1));glowAt(x,y,12,VIO,.5);drawSpr(spr('hyEye','rift'),x,y,15*(.35+.65*pk));}
      else{ctx.lineCap='round';ctx.strokeStyle='rgba(30,12,50,.75)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-5,y);ctx.quadraticCurveTo(x,y+3.2,x+5,y);ctx.stroke();ctx.strokeStyle='rgba(224,184,255,.85)';ctx.lineWidth=1.2;ctx.stroke();}}ctx.restore();}}
function stare(e,n,o){let m=MK.stare.get(e);if(!live(m)){m=A(new Stare(Object.assign({follow:e},o)));MK.stare.set(e,m);}const was=m.n;m.set(n);
  if(n>was){const z=(e.z||0)+hz(e)+24;A(new Fn({layer:'top',life:.28,d(q){const pp=P(e.x,e.y,z),x=pp[0]+(n-2)*15,kk=q.t/.28;ctx.save();ctx.globalAlpha=1-kk;ctx.strokeStyle=MAG;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,pp[1],6+18*eO(kk),0,TAU);ctx.stroke();ctx.restore();starAt(x,pp[1],16*(1-kk),'#ffe0fb',1-kk,q.t*5);}}));}return m;}
class Masks extends Part{constructor(o){super(o,{layer:'top',life:10,fi:.1,fo:.3});this.m=[];}
  add(v,dur){const q=this.m.find(w=>w.v===v);if(q)q.end=this.t+(dur||10);else this.m.push({v,t:this.t,end:this.t+(dur||10)});this.life=Math.max(this.life,this.t+(dur||10));}
  paint(){const e=this.follow;if(!e)return;const a=cl(this.t/this.fi,0,1),L=this.m.filter(q=>q.end>this.t),n=L.length,s=P(e.x,e.y,(e.z||0)+hz(e)+6);
    L.forEach((q,i)=>{const pk=back(cl((this.t-q.t)/.3,0,1)),fo=cl((q.end-this.t)/.3,0,1),x=s[0]+(i-(n-1)/2)*18,y=s[1]+Math.sin(this.t*3+i)*1.5;drawSpr(spr('hyMask','rift',q.v),x,y,18*pk,Math.sin(this.t*2+i)*.12,a*fo);});}}
function masks(e,kinds,o){o=o||{};let m=MK.masks.get(e);if(!live(m)){m=A(new Masks({follow:e}));MK.masks.set(e,m);}for(const v of kinds){m.add(v,o.dur);
  const col=ART.MASKC[v][1],z=(e.z||0)+hz(e)*.7;A(new Flash({x:e.x,y:e.y,z,el:['weep','scorn','sleepy'][v],s0:6,s1:30,life:.18}));const S=sys('top');bits(S,['weep','scorn','sleepy'][v],e.x,e.y,z,3,{size:.8});glints(S,col,e.x,e.y,z,2,12,.4);}return m;}
/* Spellbound: the Evil Eye opens over it, hypnotic ring under it, shadow tendrils hold its feet */
function spellbound(e,dur,o){o=o||{};dur=dur||2;const z=(e.z||0)+hz(e)+30;A(new Spr({im:spr('hyEye','rift'),w:46,follow:e,z,layer:'top',pop:.25,s0:.1,s1:1,life:dur,fo:.25,glow:VIO,gk:1.1,pulse:.06,pf:5}));
  A(new Sigil({follow:e,r:44,life:dur,fi:.25,fo:.3,spin:2.4,tex:ART.ring('eye','rift'),layer:'ground'}));
  const T=[];for(let i=0;i<5;i++)T.push({a:i/5*TAU+R(-.3,.3),h:R(20,32),ph:R(0,TAU)});
  A(new Fn({layer:'sorted',follow:e,sortOff:2,life:dur,fi:.2,fo:.3,d(q){const a=q.fade();ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';for(const t0 of T){const bx=e.x+Math.cos(t0.a)*14,by=e.y+Math.sin(t0.a)*9,H2=t0.h*eO(cl(q.t/.3,0,1));
      for(const [w,c] of [[6,rgba(INKD,.6)],[3.6,'#4a1f8a'],[1.4,'#c9a0ff']]){ctx.lineWidth=w;ctx.strokeStyle=c;ctx.beginPath();for(let i=0;i<=8;i++){const u=i/8,sw=Math.sin(u*4+q.t*5+t0.ph)*5*u,s=P(bx-Math.cos(t0.a)*u*7+sw,by-Math.sin(t0.a)*u*4,u*H2);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}ctx.stroke();}}ctx.restore();}}));
  after(dur-.05,()=>{const S=sys('top');bits(S,'rift',e.x,e.y,z,8,{size:.9});});const m=MK.stare.get(e);if(m)m.set(0);}
/* bosses: Exposed (a gold weak-point reticle on the body) */
function expose(e,dur){dur=dur||3;const z=(e.z||0)+hz(e)*.55;A(new Spr({im:spr('hyRet','gold'),w:40,follow:e,z,layer:'top',pop:.3,s0:2.2,s1:1,life:dur,fo:.3,spin:.5,pulse:.07,pf:6,glow:'#ffc23a'}));
  A(new Flash({follow:e,z,el:'gold',s0:20,s1:80,life:.25}));const S=sys('top');sparks(S,'#ffd76a',e.x,e.y,z,10,200,120,.5);}
function silence(e,dur){dur=dur||2;above(e,spr('hyBub','rift',1),22,{life:dur,dz:14});A(new Ring({follow:e,el:'ink',r0:34,r1:8,w0:3,w1:6,life:.4,ease:0}));}
function lure(e,dur){dur=dur||1.6;above(e,spr('hyBub','rift',2),20,{life:dur,dz:14});}
function dismay(e,dur){dur=dur||2;const z=(e.z||0)+hz(e)+12;A(new Spr({im:spr('puff','ink',1),w:24,follow:e,z,layer:'top',pop:.2,s0:.3,s1:1,life:dur,fo:.3,a:.85,bob:1.5}));
  A(new Emit({follow:e,layer:'top',life:dur-.2,every:.32,fn(){const S=sys('top');S.add({im:spr('hyTear','weep'),x:e.x+R(-6,6),y:e.y,z:z-6,vz:-30,g:200,s0:7,life:.5,fo:.4});}}));}

/* ---------------------------------------------------------------------
   4. THE SKILLS
   --------------------------------------------------------------------- */
const def=(id,meta,fn)=>FX.define(id,Object.assign({cat:'hy'},meta),fn);
const unitAt=o=>o.hero||{x:o.x,y:o.y,z:0};
const mvU=(u,dur,f,o)=>A(new Fn({layer:'ground',life:dur,delay:(o&&o.delay)||0,d(){},tick(dt){f(cl(this.t/dur,0,1),u);}}));   /* gallery: move / hide the stand-in */

/* ---- Basic ---- */
/* every normal hit: a quick crystal thrust */
def('hy.stab',{th:'แทงปกติ (ตีปกติ)',tab:'basic',key:'ynTwirl',scene:'duel'},o=>{const e=tg(o),T=lead(o,.12),h=unitAt(o),a=ang(h,e),z=30;
  A(new Streak({x:h.x+Math.cos(a)*14,y:h.y+Math.sin(a)*14,z,x2:e.x-Math.cos(a)*8,y2:e.y-Math.sin(a)*8,z2:z+4,w:7,life:.2,go:.55,el:'rift',delay:Math.max(0,T-.09)}));
  after(T,()=>stabHit(e,{ang:H.scrAng(a)+R(-.3,.3)}));});
/* the 4th hit of Stiletto Twirl: the stiletto spins on his fingertip, then a twisting stab */
def('hy.twirl',{th:'Stiletto Twirl จังหวะหมุนมีด',tab:'basic',key:'ynTwirl',scene:'duel'},o=>{const e=tg(o),T=lead(o,.34),h=unitAt(o),a=ang(h,e);
  A(new Spr({im:spr('hyStil','rift'),w:30,follow:h,ox:Math.cos(a)*10,oy:Math.sin(a)*10,z:50,layer:'top',life:T,fi:.04,fo:.06,spin:26,glow:VIO,gk:.7}));
  A(new Ring({follow:h,ox:Math.cos(a)*10,oy:Math.sin(a)*10,z:50,layer:'top',el:'jest',r0:16,r1:16,w0:2.4,w1:2.4,life:T,hold:1,a:.7,ease:0}));
  const x0=h.x+Math.cos(a)*14,y0=h.y+Math.sin(a)*14,x1=e.x,y1=e.y,z=30;
  A(new Fn({layer:'top',life:.3,delay:Math.max(0,T-.1),d(q){const kk=q.t/q.life,hd=eO(cl(kk/.45,0,1)),tl=eI(cl((kk-.25)/.75,0,1)),A0=P(x0,y0,z),B0=P(x1,y1,z+4),dx=B0[0]-A0[0],dy=B0[1]-A0[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
    ctx.save();ctx.lineCap='round';for(const [ph,c] of [[0,MAG],[Math.PI,VIO]]){for(const [w,cc] of [[5,rgba(INKD,.5)],[3,c],[1.2,'#ffffff']]){ctx.lineWidth=w;ctx.strokeStyle=cc;ctx.beginPath();for(let i=0;i<=24;i++){const u=lerp(tl,hd,i/24),wv=Math.sin(u*TAU*2.2-q.t*30+ph)*7*(1-u*.4),X=A0[0]+dx*u+nx*wv,Y=A0[1]+dy*u+ny*wv;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();}}ctx.restore();}}));
  A(new Streak({x:x0,y:y0,z,x2:x1,y2:y1,z2:z+4,w:8,life:.22,go:.5,el:'rift',delay:Math.max(0,T-.08)}));
  after(T,()=>{stabHit(e,{n:2,s:1.25,bits:6});A(new Burst({x:e.x,y:e.y,z:hz(e)*.5,el:'jest',r:30,n:8,life:.24}));const S=sys('top');bits(S,'jest',e.x,e.y,hz(e)*.5,6,{only:0});});});
/* Shadow Troupe: his shadow rises as doubles (positions o.pts, or behind / beside the target) */
def('hy.troupe',{th:'Shadow Troupe เรียกคณะเงา',tab:'basic',key:'ynTroupe',scene:'duel'},o=>{const h=unitAt(o),e=tg(o)||{x:h.x+120,y:h.y},a=ang(h,e),n=o.n||3,dur=o.dur||2.6;
  const pts=o.pts||[[1,0],[0,1],[0,-1],[-1,0]].slice(0,n).map(([f,s])=>({x:e.x+Math.cos(a)*f*70-Math.sin(a)*s*70,y:e.y+Math.sin(a)*f*70+Math.cos(a)*s*70*.85}));
  A(new Disc({follow:h,kind:'pool',add:0,col:INKD,r0:20,r1:48,life:1,a:.55,fo:.5}));A(new Ring({follow:h,el:'rift',r0:10,r1:72,w0:8,life:.45}));
  const S=sys('sorted',h.y+1);for(let i=0;i<10;i++){const q=R(0,TAU),d=R(4,40);S.add({im:spr('flame','jest',i),x:h.x+Math.cos(q)*d,y:h.y+Math.sin(q)*d*.6,z:2,vz:R(50,110),g:-30,s0:R(10,16),s1:3,life:R(.5,.8),wob:3,delay:R(0,.2),fo:.5});}
  pts.forEach((p,i)=>{const dl=.1+i*.12;thread(h,p,{life:dur-dl,delay:dl});after(dl+.12,()=>{A(new Disc({x:p.x,y:p.y,kind:'pool',add:0,col:INKD,r0:12,r1:30,life:.6,a:.6,fo:.4}));A(new Ring({x:p.x,y:p.y,el:'jest',r0:6,r1:40,w0:5,life:.36}));
      const S2=sys('top');bits(S2,'ink',p.x,p.y,6,6,{size:.8});if(DEMO(o)&&o.demo.img)A(new Dbl({im:o.demo.img,x:p.x,y:p.y,life:dur-dl,h:o.demo.h||58,flip:()=>e.x<p.x}));});});});
/* Hyena's Cackle: a laughing shadow head over him, jagged laugh rings, monsters lose heart */
def('hy.cackle',{th:"Hyena's Cackle หัวเราะคิกคัก",tab:'basic',key:'ynCackle',scene:'ring'},o=>{const h=unitAt(o),r=o.r||170,fl=Math.cos(o.phi||0)<0;
  A(new Fn({layer:'top',life:.85,d(q){const kk=q.t/q.life,pk=back(cl(q.t/.2,0,1)),fo=cl((q.life-q.t)/.25,0,1),sh=Math.sin(q.t*42)*3*(1-kk),s=P(h.x,h.y,(h.z||0)+78+sh);glowAt(s[0],s[1],56,MAG,.45*fo);drawSpr(spr('hyHead','rift'),s[0],s[1],74*pk,Math.sin(q.t*30)*.08-.12,fo,fl);}}));
  A(new Burst({follow:h,z:78,el:'jest',r:40,n:12,life:.3,inner:.5}));for(let i=0;i<3;i++)laughRing(h.x,h.y,r,{delay:i*.13,life:.5});
  soundArcs(h,(o.phi||0),{z:60});soundArcs(h,(o.phi||0)+Math.PI,{z:60,delay:.06});
  for(const e of near(o,h,r))after(.12+d2(e,h)/900,()=>{A(new Flash({x:e.x,y:e.y,z:hz(e)*.6,el:'jest',s0:6,s1:26,life:.15}));dismay(e,o.dur||2);});});
/* Iron Stomach / Marrow Feast: a bone snaps on the fallen monster, a wisp of life flies into him */
def('hy.feast',{th:'Iron Stomach / Marrow Feast ฟื้นจากศัตรู',tab:'basic',key:'ynStomach',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),big=o.big?1.3:1,z=hz(e)*.45;
  const b=A(new Spr({im:spr('hyBone','rift',0),x:e.x,y:e.y,z:z+6,w:30*big,pop:.12,s0:.3,s1:1,life:.28,fo:.06,layer:'top'}));
  after(.26,()=>{const S=sys('top');for(const sd of [-1,1])S.add({im:spr('hyBone','rift',1),x:e.x+sd*6,y:e.y,z:z+6,vx:sd*R(60,90),vz:R(90,140),g:520,s0:16*big,life:.7,rot:0,vr:sd*R(5,9),flipX:sd<0,fo:.4});
    A(new Flash({x:e.x,y:e.y,z:z+6,el:'jest',s0:8,s1:34,life:.16}));
    for(let i=0;i<(o.big?3:1);i++)A(new Proj({x:e.x,y:e.y,z:z+6,to:h,tz:30,speed:300,lob:40+i*16,curve:R(-30,30),head:'wisp',r:7,el:'jest',trail:.2,delay:i*.08,onHit(x,y,zz){A(new Ring({follow:h,el:'jest',r0:8,r1:38,w0:5,life:.36}));A(new Flash({follow:h,z:30,el:'jest',s0:8,s1:36,life:.18}));
      H.floaters(sys('top'),spr('hyStar','jest'),h.x,h.y,22,3,{s:9});}}));});});
/* Switcheroo: rift tears at both spots, Joker cards flutter, a double stays as the decoy */
def('hy.swap',{th:'Switcheroo สลับที่กับร่างเงา',tab:'basic',key:'ynSwitch',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),a=ang(h,e),from={x:h.x,y:h.y},to=o.to2||{x:e.x+Math.cos(a)*62,y:e.y+Math.sin(a)*62};
  for(const p of [from,to]){tear(p.x,p.y,{life:.5});A(new Disc({x:p.x,y:p.y,kind:'pool',add:0,col:INKD,r0:16,r1:34,life:.6,a:.5}));
    const S=sys('top');for(let i=0;i<4;i++){const q=R(0,TAU);S.add({im:spr('hyCard','rift',i%2),x:p.x,y:p.y,z:36,vx:Math.cos(q)*R(50,110),vy:Math.sin(q)*R(30,70),vz:R(60,140),g:220,dr:2.2,s0:14,life:R(.6,.9),rot:R(0,TAU),vr:R(-12,12),wob:4,fo:.4});}}
  if(DEMO(o)){mvU(h,.2,(u,uu)=>{if(u>=.5){uu.x=to.x;uu.y=to.y;uu.face=Math.cos(a+Math.PI)<0?-1:1;}uu.alpha=u<.5?1-u*2:(u-.5)*2;});if(o.demo.img)A(new Dbl({im:o.demo.img,x:from.x,y:from.y,life:2,rise:.05,h:o.demo.h||58,pop:1,flip:()=>e.x<from.x}));}});
/* Shadow Confetti: the decoy bursts into black / white diamond fireworks */
def('hy.confetti',{th:'Shadow Confetti ตัวล่อระเบิดพลุ',tab:'basic',key:'ynConfetti',scene:'ring'},o=>{const h=unitAt(o),r=o.r||110,z=30;if(DEMO(o)&&o.demo.img)A(new Dbl({im:o.demo.img,x:h.x+60,y:h.y,life:.5,rise:.05,h:o.demo.h||58,pop:1}));
  const c={x:DEMO(o)?h.x+60:o.x,y:o.y};after(DEMO(o)?.45:0,()=>{H.dark(c.x,c.y,40,1,.35);A(new Ring({x:c.x,y:c.y,el:'rift',r0:10,r1:r,w0:12,life:.4}));A(new Ring({x:c.x,y:c.y,el:'jest',r0:10,r1:r*.7,w0:6,life:.32,delay:.05}));
    firework(c.x,c.y,z,{s:1.1});puffs(sys('sorted',c.y+1),'ink',c.x,c.y,12,6,40,60,30,.8);SH(2.5);});});
/* Voice Mimic: his call rolls out in waves, lured monsters get a '?' */
def('hy.voice',{th:'Voice Mimic เลียนเสียงเรียกมอน',tab:'basic',key:'ynVoice',scene:'ring'},o=>{const h=unitAt(o),r=o.r||450;
  for(let i=0;i<3;i++)A(new Fn({layer:'ground',life:.95,delay:i*.18,d(q){const kk=q.t/q.life,rr=r*eO(kk),s=P(h.x,h.y,0);ctx.save();ctx.globalAlpha*=Math.pow(1-kk,1.2)*.9;ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.lineWidth=3;ctx.strokeStyle=MAG;ctx.beginPath();
    for(let j=0;j<=96;j++){const a=j/96*TAU,R0=rr+Math.sin(a*14+q.t*20)*4;j?ctx.lineTo(Math.cos(a)*R0,Math.sin(a)*R0):ctx.moveTo(Math.cos(a)*R0,Math.sin(a)*R0);}ctx.closePath();ctx.stroke();ctx.lineWidth=1.2;ctx.strokeStyle='#ffe0fb';ctx.stroke();ctx.restore();}}));
  for(let i=0;i<4;i++)soundArcs(h,(o.phi||0)+i*Math.PI/2,{z:52,delay:i*.04,r:40});
  for(const e of near(o,h,r))after(.1+d2(e,h)/480,()=>lure(e,o.dur||1.6));});

/* ---- A: Laughing Assassin ---- */
/* Mocking Stab: a short dash, two taunting stabs to the face, a stare */
def('hy.mock',{th:'Mocking Stab แทงเย้ย',tab:'A',key:'yaMock',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),T=lead(o,.14),a=ang(h,e);
  A(new Streak({x:h.x,y:h.y,z:12,x2:e.x-Math.cos(a)*40,y2:e.y-Math.sin(a)*40,z2:12,w:12,life:.18,go:.6,el:'ink',head:0}));
  if(DEMO(o))mvU(h,T,(u,uu)=>{const d=Math.max(0,d2({x:uu.x0,y:uu.y0},e)-46);uu.x=uu.x0+Math.cos(a)*d*eO(u);uu.y=uu.y0+Math.sin(a)*d*eO(u);});
  after(T,()=>stabHit(e,{ang:-.5,s:1.1}));after(T+.12,()=>{stabHit(e,{ang:.55,s:1.1});if(o.n!==0)stare(e,o.n||1);});});
/* the stares 1 → 2 → 3 → Spellbound (bosses: Exposed) */
def('hy.stare',{th:'Evil Eye จ้อง 1→3 = ตะลึงงัน',tab:'A',key:'yaEye',scene:'duel'},o=>{const e=tg(o);for(let i=1;i<=3;i++)after((i-1)*.45,()=>stare(e,i));after(1.15,()=>{if(o.boss)expose(e,o.dur||3);else spellbound(e,o.dur||2);});});
def('hy.expose',{th:'เผยจุดตาย (บอสครบ 3 จ้อง)',tab:'A',key:'yaEye',scene:'boss'},o=>{expose(tg(o),o.dur||3);});
/* Backflip Stab: a somersault over its head, landing behind it with a backstab */
def('hy.flip',{th:'Backflip Stab ตีลังกาแทงหลัง',tab:'A',key:'yaFlip',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),T=lead(o,.42),a=ang(h,e),x0=h.x,y0=h.y,x1=e.x+Math.cos(a)*58,y1=e.y+Math.sin(a)*58,Hh=96;
  const at=u=>({x:lerp(x0,x1,u),y:lerp(y0,y1,u),z:Math.sin(Math.PI*u)*Hh});
  A(new Fn({layer:'top',life:T+.3,d(q){const hd=cl(q.t/T,0,1),tl=cl((q.t-.12)/T,0,1),fo=cl((q.life-q.t)/.22,0,1);if(hd-tl<.01)return;const N=24;
    for(const [w,c] of [[16,rgba(INKD,.35)],[10,'#6a24d0'],[5,MAG],[1.6,'#ffffff']]){ctx.save();ctx.globalAlpha*=fo;ctx.lineCap='round';ctx.lineWidth=w;ctx.strokeStyle=c;ctx.beginPath();for(let i=0;i<=N;i++){const u=lerp(tl,hd,i/N),p=at(u),s=P(p.x,p.y,p.z+30);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}ctx.stroke();ctx.restore();}
    const p=at(hd),s=P(p.x,p.y,p.z+30);if(hd<1)starAt(s[0],s[1],18,'#e0b8ff',.8,q.t*8);}}));
  const S=sys('top');for(let i=0;i<6;i++)after(T*i/6,()=>{const p=at(i/6);S.add({im:spr('hyDia','rift',i%4),x:p.x,y:p.y,z:p.z+30,vz:-20,g:200,s0:9,life:.5,rot:R(0,TAU),vr:R(-6,6),fo:.4});});
  if(DEMO(o)){mvU(h,T,(u,uu)=>{const p=at(eIO(u));uu.x=p.x;uu.y=p.y;uu.z=p.z;uu.rot=-TAU*eIO(u)*(Math.cos(a)<0?-1:1);uu.face=Math.cos(a)<0?-1:1;if(u>=1){uu.rot=0;uu.face=Math.cos(a)<0?1:-1;}});
    if(o.demo.img)for(let i=1;i<5;i++)after(T*i/5,()=>{const p=at(eIO(i/5));A(new Dbl({im:o.demo.img,x:p.x,y:p.y,z:p.z,life:.32,rise:.01,sink:.3,h:o.demo.h||58,a:.45,pool:0}));});}
  after(T,()=>{A(new Ring({x:x1,y:y1,el:'rift',r0:8,r1:44,w0:6,life:.3}));H.dust(o,x1,y1,26,5,22,10);});after(T+.06,()=>backstab(e));});
def('hy.backstab',{th:'แทงหลัง (ไม่สน DEF)',tab:'A',key:'yaEye',scene:'duel'},o=>{backstab(tg(o),{s:o.big?1.3:1});});
/* Shadow Melt: he sinks into a shadow pool that slides on the ground with two eyes; emerging = a gush of ink */
def('hy.melt',{th:'Shadow Melt จมลงเงา',tab:'A',key:'yaMelt',scene:'duel'},o=>{const h=unitAt(o),dur=o.dur||1.8;
  A(new Ring({follow:h,el:'ink',r0:30,r1:6,w0:10,w1:4,life:.3,ease:0}));puffs(sys('sorted',h.y+1),'ink',h.x,h.y,8,6,30,40,20,.6);const S=sys('top');bits(S,'ink',h.x,h.y,8,8,{size:.9});
  A(new Fn({layer:'ground',follow:h,life:dur,fi:.2,fo:.2,d(q){const a=q.fade(),s=P(h.x,h.y,0),ky=KY();ctx.save();ctx.globalAlpha*=a;ctx.translate(s[0],s[1]);ctx.scale(1,ky);ctx.fillStyle=rgba(INKD,.85);ctx.beginPath();for(let i=0;i<=24;i++){const t2=i/24*TAU,r=30+Math.sin(t2*3+q.t*6)*3+Math.sin(t2*5-q.t*4)*2;i?ctx.lineTo(Math.cos(t2)*r,Math.sin(t2)*r):ctx.moveTo(Math.cos(t2)*r,Math.sin(t2)*r);}ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.drawImage(tex('glow',VIO),-36,-36,72,72);ctx.restore();for(const dx of [-6,6]){const e2=P(h.x+dx,h.y-4,0);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='#ffe0fb';ctx.beginPath();ctx.ellipse(e2[0],e2[1],3.4,1.5,0,0,TAU);ctx.fill();glowAt(e2[0],e2[1],8,MAG,.7);ctx.restore();}}}));
  if(DEMO(o)){const e=tg(o),a=ang(h,e);mvU(h,dur,(u,uu)=>{uu.alpha=u<.12?1-u/.12:0;uu.sink=u<.12?u/.12:1;const d=Math.max(0,d2({x:uu.x0,y:uu.y0},e)-70);uu.x=uu.x0+Math.cos(a)*d*eIO(cl((u-.15)/.7,0,1));uu.y=uu.y0+Math.sin(a)*d*eIO(cl((u-.15)/.7,0,1));});
    after(dur,()=>{FX.play('hy.emerge',{x:h.x,y:h.y,hero:h,target:e,demo:o.demo});});}});
def('hy.emerge',{th:'โผล่จากเงา + Ambush',tab:'A',key:'yaAmbush',scene:'duel'},o=>{const h=unitAt(o),e=tg(o);inkBurst(h.x,h.y,{s:1.15});const S=sys('top');bits(S,'ink',h.x,h.y,20,6,{size:1});
  if(DEMO(o))mvU(h,.15,(u,uu)=>{uu.alpha=u;uu.sink=1-u;});if(e&&d2(h,e)<120)after(.12,()=>{backstab(e,{s:o.big?1.25:1.1});});});
/* Bone-Crusher Bite: shadow hyena jaws open over it and snap shut on the hit frame */
function jaws(e,T,o){o=o||{};const w=o.w||92,fl=o.fl,z=(e.z||0)+hz(e)*.5,hg=ART.HINGE,su=spr('hyJawU','ink'),sl=spr('hyJawL','ink'),HOLD=.2,L=T+HOLD+.18;
  const axU=(4+2*hg.u[0])/su.width,ayU=(4+2*hg.u[1])/su.height,axL=(4+2*hg.l[0])/sl.width,ayL=(4+2*hg.l[1])/sl.height;
  return A(new Fn({layer:'top',life:L,d(q){const t=q.t,op=t<T?Math.min(.75,eO(cl(t/(T*.75),0,1))*.75):0,snap=t<T?op:0,pk=back(cl(t/.16,0,1)),fo=cl((L-t)/.18,0,1),s=P(e.x,e.y,z),sc=w/74,wl=sl.width/su.width*w,
    hx=s[0]+(fl?1:-1)*w*.42,hy=s[1]-2;ctx.save();ctx.globalAlpha*=fo;ctx.translate(hx,hy);if(fl)ctx.scale(-1,1);ctx.scale(pk,pk);glowAt(w*.45,0,w*.7,VIO,.45);
    const du=(im,ax,ay,ww,rot)=>{const hh=ww*im.height/im.width;ctx.save();ctx.rotate(rot);ctx.drawImage(im,-ww*ax,-hh*ay,ww,hh);ctx.restore();};
    du(sl,axL,ayL,wl,snap*.55);du(su,axU,ayU,w*su.width/su.width,-snap*.75);ctx.restore();}}));}
def('hy.bite',{th:'Bone-Crusher Bite งับกระดูกแตก',tab:'A',key:'yaBite',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),T=lead(o,.32),big=o.big?1.3:1;jaws(e,T,{w:80*big,fl:e.x<h.x});
  after(T,()=>{const z=(e.z||0)+hz(e)*.5;A(new Burst({x:e.x,y:e.y,z,el:'rift',r:34*big,n:11,life:.26,inner:.4}));A(new Flash({x:e.x,y:e.y,z,el:'jest',s0:10,s1:44*big,life:.18}));
    const C=[];for(let i=0;i<5;i++){let x=0,y=0;const pts=[[0,0]],a0=i/5*TAU+R(-.3,.3);for(let j=0;j<4;j++){const aa=a0+R(-.5,.5);x+=Math.cos(aa)*R(5,9)*big;y+=Math.sin(aa)*R(5,9)*big;pts.push([x,y]);}C.push(pts);}
    A(new Fn({layer:'top',life:.4,d(q){const s=P(e.x,e.y,z),a=1-q.t/.4;ctx.save();ctx.globalAlpha*=a;ctx.translate(s[0],s[1]);ctx.lineJoin='miter';for(const [w,c] of [[3.6,INKD],[1.6,'#ffffff']]){ctx.lineWidth=w;ctx.strokeStyle=c;for(const pts of C){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}}ctx.restore();}}));
    const S=sys('top');for(const sd of [-1,1])S.add({im:spr('hyBone','rift',1),x:e.x,y:e.y,z,vx:sd*R(50,90),vz:R(80,140),g:520,s0:12,life:.6,vr:sd*R(6,10),fo:.4});bits(S,'ink',e.x,e.y,z,6,{size:.9});SH(2.6*big);
    if(o.big)above(e,spr('hyCrk','rift'),20,{life:o.dur||2,dz:-2,glow:MAG});});});
/* Knife Juggle: three crystal stilettos fanned out (Returning Knives: they fly back) */
def('hy.juggle',{th:'Knife Juggle โยนมีด 3 เล่ม (+มีดบินกลับ)',tab:'A',key:'yaJuggle',scene:'crowd'},o=>{const h=unitAt(o),e=tg(o),a0=ang(h,e),RNG=o.r||320,SP=760,ret=o.ret!==0;
  const head=(q,x,y,r,sa)=>{glowAt(x,y,18,VIO,.5);drawSpr(spr('hyStil','rift'),x,y,30,q.t*22);};
  for(const da of [-.32,0,.32]){const a=a0+da,x2=h.x+Math.cos(a)*RNG,y2=h.y+Math.sin(a)*RNG;
    A(new Proj({x:h.x+Math.cos(a)*12,y:h.y+Math.sin(a)*12,z:30,x2,y2,z2:30,speed:SP,head,r:8,el:'rift',trail:.12,homing:0,glow:0,onHit(x,y,z){A(new Flash({x,y,z,el:'rift',s0:6,s1:22,life:.12}));
      if(ret)A(new Proj({x,y,z,to:h,tz:30,speed:SP*1.05,head,r:8,el:'jest',trail:.12,homing:1,glow:0,delay:.06,onHit(){A(new Flash({follow:h,z:30,el:'jest',s0:6,s1:20,life:.12}));}}));}}));
    for(const t of (o.targets||[])){const dx=t.x-h.x,dy=t.y-h.y,al=dx*Math.cos(a)+dy*Math.sin(a),lat=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(al>0&&al<RNG&&lat<24){after(al/SP,()=>{stabHit(t,{ang:H.scrAng(a),s:.9});stare(t,Math.min(3,((MK.stare.get(t)||{}).n||0)+1));});
      if(ret)after((RNG*2-al)/SP+.06,()=>stabHit(t,{ang:H.scrAng(a+Math.PI),s:.7,el:'jest',bits:2}));}}}});
/* Laughing Execution: dash behind it, five stabs, then the finisher (bigger with stares) */
def('hy.exec',{th:'Laughing Execution แทงรัว 5 + ปิดฉาก',tab:'A',key:'yaExec',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),a=ang(h,e),bx=e.x+Math.cos(a)*44,by=e.y+Math.sin(a)*44,n=o.n==null?3:o.n;
  A(new Streak({x:h.x,y:h.y,z:20,x2:bx,y2:by,z2:20,w:14,life:.2,go:.6,el:'rift'}));tear(h.x,h.y,{life:.35,h:60});
  if(DEMO(o))mvU(h,.12,(u,uu)=>{uu.x=lerp(uu.x0,bx,eO(u));uu.y=lerp(uu.y0,by,eO(u));if(u>=1)uu.face=Math.cos(a)<0?1:-1;});
  for(let i=0;i<5;i++)after(.16+i*.075,()=>stabHit(e,{ang:R(-1.2,1.2),s:1,bits:2}));
  after(.62,()=>{const z=(e.z||0)+hz(e)*.5,s=1+n*.12;for(const sd of [-1,1])A(new Arc({follow:e,z,R:52*s,w:20*s,a0:sd*-1.5,a1:sd*1.5,tilt:1.25,phi:a+Math.PI/2*sd,swing:.1,life:.3,el:sd<0?'rift':'jest'}));
    backstab(e,{s});A(new Spr({im:spr('hyGrin','jest'),w:58*s,follow:e,z:z+22,layer:'top',pop:.2,s0:.2,s1:1,life:.6,fo:.25,glow:MAG}));
    for(let i=0;i<n;i++){const q=R(0,TAU);const S=sys('top');S.add({im:spr('hyEye','rift'),x:e.x,y:e.y,z:z+30,vx:Math.cos(q)*90,vy:Math.sin(q)*60,vz:120,g:300,s0:14,s1:8,life:.6,fo:.4});}const m=MK.stare.get(e);if(m)m.set(0);SH(3.5);});});
/* Curtain Call (ultimate A): stage lights off — eyes and cuts in the dark — spotlight, finishing bite, a bow and confetti */
def('hy.curtain',{th:'Curtain Call (อัลติ A)',tab:'A',key:'yaUlt',scene:'big'},o=>{const h=unitAt(o),e=tg(o),c={x:o.cx==null?e.x:o.cx,y:o.cy==null?e.y:o.cy},r=o.r||260,D=2.2,L=near(o,c,r).length?near(o,c,r):[e];
  darkness(c.x,c.y,r,D+.25);A(new Ring({x:c.x,y:c.y,el:'rift',r0:r*.2,r1:r,w0:10,life:.4}));
  if(DEMO(o))mvU(h,D,(u,uu)=>{uu.alpha=u<.1?1-u/.1:0;if(u>=1){uu.x=e.x+Math.cos(ang(e,uu))*44;uu.y=e.y+Math.sin(ang(e,uu))*44;uu.alpha=1;}});
  for(let i=0;i<14;i++){const t=.18+i*(D-.4)/14,v=L[i%L.length];after(t,()=>{const a=R(0,TAU),x0=v.x+Math.cos(a)*120,y0=v.y+Math.sin(a)*120;A(new Streak({x:x0,y:y0,z:30,x2:v.x-Math.cos(a)*60,y2:v.y-Math.sin(a)*60,z2:30,w:9,life:.2,go:.55,el:i%2?'jest':'rift'}));after(.08,()=>stabHit(v,{s:.9,bits:2}));});}
  for(let i=0;i<9;i++){const a=R(0,TAU),d=R(.2,.9)*r;eyesAt(c.x+Math.cos(a)*d,c.y+Math.sin(a)*d*.8,R(30,60),{delay:.1+i*.2,life:R(.5,.8)});}
  after(D,()=>{spot({x:e.x,y:e.y,r:52,life:1.6,a:.6});A(new Flash({x:e.x,y:e.y,z:40,el:'holy',s0:30,s1:110,life:.25}));jaws(e,.16,{w:110,fl:e.x<h.x});after(.16,()=>{backstab(e,{s:1.5});SH(5);});
    after(.55,()=>{rain(c.x,c.y,r*.8,{n:46});for(const v of L)if(v!==e)after(R(0,.3),()=>{for(let n=1;n<=3;n++)stare(v,n);after(.2,()=>spellbound(v,1.6));});
      A(new Spr({im:spr('hyHat','rift'),w:34,follow:h,z:70,layer:'top',pop:.25,s0:.2,s1:1,life:1,fo:.3,rot:-.25}));});});});

/* ---- B: Shadow Chaser ---- */
/* Mimic: he stares (a scanning line + an eye ring), the stolen skill leaves its owner as a card and flies into a belt trophy */
def('hy.mimic',{th:'Mimic ลอกท่า (เก็บเข้ากระเป๋า)',tab:'B',key:'ybMimic',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),el=o.el||'sakura',p=pal(el),T=lead(o,.6);
  A(new Fn({layer:'top',life:T,fi:.08,fo:.1,d(q){const a=q.fade(),s0=P(h.x,h.y,(h.z||0)+52),s1=P(e.x,e.y,(e.z||0)+hz(e)*.6);ctx.save();ctx.globalAlpha*=a;ctx.lineCap='round';ctx.setLineDash([7,6]);ctx.lineDashOffset=-q.t*60;ctx.lineWidth=3;ctx.strokeStyle=VIO;ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.lineTo(s1[0],s1[1]);ctx.stroke();ctx.lineWidth=1.2;ctx.strokeStyle='#ffe0fb';ctx.stroke();ctx.restore();glowAt(s0[0],s0[1],10,MAG,.8*a);}}));
  A(new Sigil({follow:e,r:40,life:T+.1,fi:.15,fo:.15,spin:-4,tex:ART.ring('eye','rift'),layer:'ground'}));A(new Ring({follow:e,el:mix(el),r0:46,r1:14,w0:3,w1:6,life:T,ease:0,layer:'ground'}));
  after(T,()=>{const z=(e.z||0)+hz(e)*.6;A(new Flash({x:e.x,y:e.y,z,el,s0:10,s1:46,life:.2}));
    const card=(q,x,y,r,sa)=>{const sx=Math.cos(q.t*14);ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.12,Math.abs(sx)),1);glowAt(0,0,20,p[2],.7);const im=spr('hyCard',mix(el),sx>0?0:1);ctx.drawImage(im,-11,-15,22,30);ctx.restore();};
    A(new Proj({x:e.x,y:e.y,z,to:h,tz:28,speed:330,lob:60,head:card,r:8,el:mix(el),trail:.24,homing:1,glow:0,onHit(){const tz=(h.z||0)+26;A(new Spr({im:spr('hyTro','rift',o.tro==null?3:o.tro),w:20,follow:h,ox:-6,z:tz,layer:'top',pop:.25,s0:.2,s1:1.25,life:.9,fo:.35,glow:p[2],gk:1.2}));
      A(new Ring({follow:h,el:mix(el),r0:6,r1:40,w0:5,life:.34}));glints(sys('top'),p[3],h.x,h.y,tz,5,16,.6);facePaint(h,el);}}));});});
/* the Auto Shadow Spell tell: a Joker card flips over the caster, then the stolen skill goes off */
function tell(u,el){const p=pal(el||'rift');A(new Fn({layer:'top',life:.4,d(q){const s=P(u.x,u.y,(u.z||0)+80),sx=Math.cos(q.t*18),pk=back(cl(q.t/.15,0,1)),fo=cl((q.life-q.t)/.12,0,1);ctx.save();ctx.globalAlpha*=fo;ctx.translate(s[0],s[1]-q.t*16);ctx.scale(Math.max(.1,Math.abs(sx))*pk,pk);glowAt(0,0,22,p[2],.7);ctx.drawImage(spr('hyCard',mix(el),sx>0?0:1),-12,-17,24,34);ctx.restore();}}));
  after(.38,()=>{const S=sys('top');for(let i=0;i<6;i++){const a=R(0,TAU);S.add({im:spr('hyDia',mix(el),i%4),x:u.x,y:u.y,z:(u.z||0)+76,vx:Math.cos(a)*90,vy:Math.sin(a)*60,vz:R(40,110),g:300,s0:8,life:.45,rot:R(0,TAU),vr:R(-8,8),fo:.4});}});}
def('hy.auto',{th:'Auto Shadow Spell ท่าขโมยออกเอง',tab:'B',key:'ybAuto',scene:'crowd'},o=>{const h=unitAt(o),el=o.el||pick(LANDEL),shp=o.shape||pick(['single','line','cone','self','ground']);tell(h,el);after(.22,()=>FX.play('hy.st.'+shp,Object.assign({},o,{el,auto:1})));});
/* the shadow Joker card (pockets all empty) */
def('hy.joker',{th:'ไพ่โจ๊กเกอร์เงา',tab:'B',key:'ybAuto',scene:'far'},o=>{const h=unitAt(o),e=tg(o);
  const head=(q,x,y,r,sa)=>{const sx=Math.cos(q.t*20);ctx.save();ctx.translate(x,y);ctx.rotate(sa*.3);ctx.scale(Math.max(.15,Math.abs(sx)),1);glowAt(0,0,22,MAG,.6);ctx.drawImage(spr('hyCard','rift',sx>0?0:1),-12,-17,24,34);ctx.restore();};
  tell(h,'rift');A(new Proj({x:h.x,y:h.y,z:40,to:e,tz:hz(e)*.5,speed:620,head,r:9,el:'jest',trail:.16,homing:1,glow:0,delay:.15,onHit(x,y,z){stabHit(e,{n:2,s:1.1,el:'jest'});const S=sys('top');for(let i=0;i<8;i++){const a=R(0,TAU);S.add({im:spr('hyDia','rift',i%4),x,y,z,vx:Math.cos(a)*120,vy:Math.sin(a)*80,vz:R(50,140),g:380,s0:9,life:.6,rot:R(0,TAU),vr:R(-10,10),fo:.4});}}}));});
/* Weeping Mask: a sweep of violet paint (with tears) in front of him */
class Brush extends Arc{constructor(o){super(Object.assign({el:'rift',w:30,R:116,swing:.17,life:.45,tilt:.22},o));this.br=[];for(let i=0;i<8;i++)this.br.push([R(.12,.96),R(.55,1),R(-.15,.2)]);}
  paint(){super.paint();const t=this.t,sw=this.swing,L=this.life,h=eO(cl(t/sw,0,1)),tl=eI(cl((t-sw*.45)/(L-sw*.45),0,1)),th0=lerp(this.a0,this.a1,tl),th1=lerp(this.a0,this.a1,h),Rr=this.R*this.size,W=this.w*this.size,p=this.p,al=cl((L-t)/(L*.3),0,1);if(Math.abs(th1-th0)<.05)return;
    ctx.save();ctx.globalAlpha*=al;ctx.lineCap='round';for(const b of this.br){const N=14,s0=lerp(th0,th1,Math.max(0,b[2])),s1=lerp(th0,th1,b[1]);ctx.beginPath();for(let i=0;i<=N;i++){const th=lerp(s0,s1,i/N),q=this.w3(th,Rr-W*b[0]),s=P(q[0],q[1],q[2]);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1]);}ctx.lineWidth=2.4;ctx.strokeStyle=b[0]>.5?p[1]:p[3];ctx.stroke();}ctx.restore();}}
def('hy.weep',{th:'Weeping Mask ปาดพู่กันสีร้องไห้',tab:'B',key:'ybWeep',scene:'crowd'},o=>{const h=unitAt(o),phi=o.phi||0,r=o.r||170,T=lead(o,.16);
  A(new Brush({follow:h,phi,R:r*.64,w:44,a0:-1.15,a1:1.15,z:24,el:'rift',swing:.2,life:.58}));A(new Brush({follow:h,phi,R:r*.52,w:14,a0:-1.05,a1:1.05,z:22,el:'weep',delay:.05,swing:.2,life:.5}));
  const S=sys('top');for(let i=0;i<10;i++){const a=phi+R(-1,1),d=R(.4,.9)*r;after(R(.04,.16),()=>{S.add({im:spr(i%2?'hyTear':'drop',i%2?'weep':'rift'),x:h.x+Math.cos(a)*d*.6,y:h.y+Math.sin(a)*d*.6,z:28,vx:Math.cos(a)*R(80,160),vy:Math.sin(a)*R(60,120),vz:R(60,140),g:700,s0:R(8,12),life:.55,face:1,fo:.3});});}
  for(let i=0;i<3;i++){const a=phi+(i-1)*.7,d=r*R(.45,.7);after(.2+i*.04,()=>splat(h.x+Math.cos(a)*d,h.y+Math.sin(a)*d,18,'rift',{life:1.4}));}
  for(const e of near(o,h,r))if(Math.abs(Math.atan2(Math.sin(ang(h,e)-phi),Math.cos(ang(h,e)-phi)))<1.2)after(T,()=>{stabHit(e,{el:'weep',bits:2,s:.8});masks(e,[0]);});});
/* the masks over monsters (all three) */
def('hy.masks',{th:'หน้ากาก 3 แบบบนหัวศัตรู',tab:'B',key:'ybAudience',scene:'duel'},o=>{const e=tg(o);[0,1,2].forEach((v,i)=>after(i*.35,()=>masks(e,[v],{dur:o.dur||3})));});
/* Scorn Mask: a paint pot lobbed at it, a crimson splat */
def('hy.scorn',{th:'Scorn Mask ปาหม้อสี',tab:'B',key:'ybScorn',scene:'crowd'},o=>{const h=unitAt(o),e=tg(o),r=o.r||110;
  A(new Proj({x:h.x,y:h.y,z:40,x2:e.x,y2:e.y,z2:4,speed:420,lob:90,head:'hyPot',hpal:'scorn',r:12,spin:8,el:'scorn',trail:.1,tw:.6,homing:0,glow:0,onHit(x,y){
    splat(x,y,r*.75,'scorn',{life:1.8});A(new Ring({x,y,el:'scorn',r0:10,r1:r,w0:10,life:.4}));A(new Flash({x,y,z:14,el:'scorn',s0:14,s1:60,life:.2}));
    const S=sys('top');bits(S,'scorn',x,y,10,14,{size:1.1,up:1.1});for(let i=0;i<5;i++){const a=R(0,TAU);S.add({im:spr('shard','ink',i%3),x,y,z:10,vx:Math.cos(a)*R(60,130),vy:Math.sin(a)*R(40,90),vz:R(90,200),g:700,s0:R(7,11),life:.7,rot:R(0,TAU),vr:R(-12,12),bounce:.3,fo:.3});}SH(1.6);
    for(const t of near(o,{x,y},r))masks(t,[1]);}}));});
/* Smear: paint jumps from a fallen masked monster to the two nearest */
def('hy.smear',{th:'Smear สีกระเด็นไปทาตัวข้าง ๆ',tab:'B',key:'ybSmear',scene:'ring'},o=>{const src=o.from||tg(o),L=(o.targets||[]).filter(t=>t!==src).sort((a,b)=>d2(a,src)-d2(b,src)).slice(0,2);
  splat(src.x,src.y,26,'scorn',{life:1});A(new Flash({x:src.x,y:src.y,z:20,el:'scorn',s0:10,s1:40,life:.18}));
  for(const t of L)for(const [v,el] of [[0,'weep'],[1,'scorn'],[2,'sleepy']])A(new Proj({x:src.x,y:src.y,z:30,to:t,tz:hz(t)*.6,speed:300,lob:70,curve:(v-1)*24,head:'drop',hpal:el,r:7,el,trail:.18,homing:1,glow:.5,delay:v*.06,onHit(){masks(t,[v]);}}));});
/* Sleepy Mask: a lavender paint bomb, a sleepy cloud with Zs */
def('hy.sleep',{th:'Sleepy Mask ระเบิดสีง่วง',tab:'B',key:'ybSleep',scene:'crowd'},o=>{const h=unitAt(o),e=tg(o),r=o.r||150,c=o.x2!=null&&!o.target?{x:o.x2,y:o.y2}:e;
  A(new Proj({x:h.x,y:h.y,z:40,x2:c.x,y2:c.y,z2:4,speed:400,lob:110,head:'bomb',r:11,spin:6,el:'sleepy',trail:.1,tw:.5,homing:0,glow:.4,onHit(x,y){
    splat(x,y,r*.6,'sleepy',{life:2,seed:4});A(new Ring({x,y,el:'sleepy',r0:20,r1:r,w0:8,life:.5}));A(new Ring({x,y,el:'sleepy',r0:r,r1:r,w0:3,w1:3,life:1.6,style:'dash',hold:1,a:.7,ease:0}));
    puffs(sys('sorted',y+2),'sleepy',x,y,14,12,r*.55,r*.9,22,1.2);const S=sys('top');H.floaters(S,spr('hyZ','sleepy'),x,y,r*.7,8,{s:14,p:{vz:30}});SH(1.4);
    for(const t of near(o,{x,y},r))masks(t,[2]);}}));});
/* Encore: the autospell goes off again — a gold bell chime and a replay swirl */
def('hy.encore',{th:'Encore ออโต้ซ้ำ (ขออีก!)',tab:'B',key:'ybEncore',scene:'duel'},o=>{const h=unitAt(o),z=(h.z||0)+66;A(new Ring({follow:h,el:'gold',r0:8,r1:46,w0:6,life:.4}));
  A(new Fn({layer:'top',life:.5,d(q){const s=P(h.x,h.y,z),kk=q.t/q.life,a=1-kk;ctx.save();ctx.translate(s[0],s[1]);ctx.rotate(-q.t*9);ctx.lineCap='round';ctx.globalAlpha=a;ctx.lineWidth=4;ctx.strokeStyle='#ffc23a';ctx.beginPath();ctx.arc(0,0,14+kk*6,.3,TAU-.6);ctx.stroke();ctx.fillStyle='#ffc23a';ctx.beginPath();ctx.moveTo(14+kk*6,-7);ctx.lineTo(22+kk*6,2);ctx.lineTo(8+kk*6,3);ctx.fill();ctx.restore();}}));
  const S=sys('top');for(let i=0;i<3;i++)S.add({im:spr('hyBell','gold'),x:h.x+(i-1)*14,y:h.y,z,vz:R(40,70),vx:(i-1)*20,s0:12,life:.7,wr:.5,wf:14,fo:.4,delay:i*.05});glints(S,'#ffd76a',h.x,h.y,z,5,18,.6);
  tell(h,o.el||pick(LANDEL));after(.25,()=>FX.play('hy.st.'+(o.shape||'single'),Object.assign({},o,{el:o.el||pick(LANDEL)})));});
/* Feint Troupe: the doubles dash to a point, dance there (monsters turn on them), then burst one by one */
def('hy.feint',{th:'Feint Troupe ร่างเงาเต้นล่อแล้วระเบิด',tab:'B',key:'ybFeint',scene:'crowd'},o=>{const h=unitAt(o),c=o.x2!=null&&!o.target?{x:o.x2,y:o.y2}:tg(o),n=o.n||3,D=o.dur||2.5;
  A(new Ring({x:c.x,y:c.y,el:'jest',r0:200,r1:200,w0:3,w1:3,life:D,style:'dash',hold:1,a:.8,ease:0,spin:.6}));spot({x:c.x,y:c.y,r:70,life:D,a:.35,col:'#ffb0ef'});
  for(let i=0;i<n;i++){const a0=i/n*TAU,pt={x:c.x,y:c.y};const P0=()=>({x:c.x+Math.cos(a0+i)*40,y:c.y+Math.sin(a0+i)*30});A(new Streak({x:h.x,y:h.y,z:14,x2:P0().x,y2:P0().y,z2:14,w:10,life:.22,go:.6,el:'ink',head:0,delay:i*.06}));
    const d={x:c.x,y:c.y};A(new Fn({layer:'ground',life:D,d(){},tick(){const an=a0+this.t*2.2;d.x=c.x+Math.cos(an)*44;d.y=c.y+Math.sin(an)*32;}}));
    if(DEMO(o)&&o.demo.img)A(new Dbl({im:o.demo.img,follow:d,life:D+.05,rise:.18,h:o.demo.h||58,bob:7,pop:1,flip:()=>d.x>c.x}));
    after(D-.05+i*.16,()=>{A(new Ring({x:d.x,y:d.y,el:'rift',r0:10,r1:120,w0:10,life:.38}));firework(d.x,d.y,30,{s:.8,n:16});puffs(sys('sorted',d.y+1),'ink',d.x,d.y,14,4,30,40,30,.6);SH(1.6);for(const t of near(o,d,120))masks(t,[1]);});}
  for(const t of near(o,c,200))after(.3,()=>above(t,spr('hyBub','rift',2),18,{life:D-.3,dz:14}));});
/* Mirror Mask: the mirror goes up in front of him; a blow is reflected back (and copied, from a hero echo) */
def('hy.mirror',{th:'Mirror Mask ยกกระจกสะท้อน',tab:'B',key:'ybMirror',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),a=ang(h,e),D=o.dur||1.5,TB=o.block==null?.7:o.block;
  const m=A(new Spr({im:spr('hyMirror','rift'),w:34,follow:h,ox:Math.cos(a)*16,oy:Math.sin(a)*16+1,z:44,layer:'sorted',sortOff:2,pop:.2,s0:.3,s1:1,life:D,fo:.25,bob:1.5,glow:'#e0d0ff',gk:.8}));
  A(new Emit({layer:'top',life:D,every:.4,fn(){const s=P(h.x+Math.cos(a)*16,h.y+Math.sin(a)*16,44+R(-6,10));A(new Fn({layer:'top',life:.3,d(q){starAt(s[0]+R(-1,1),s[1],14*(1-q.t/.3),'#ffffff',.9,q.t*4);}}));}}));
  if(TB!=null&&TB<D)after(TB,()=>{const mx=h.x+Math.cos(a)*16,my=h.y+Math.sin(a)*16;A(new Flash({x:mx,y:my,z:44,el:'white',s0:16,s1:70,life:.22}));A(new Ring({x:mx,y:my,z:44,layer:'top',el:'rift',r0:8,r1:54,w0:6,life:.3}));
    A(new Beam({x:mx,y:my,z:44,to:e,z2:hz(e)*.6,w:10,life:.35,el:'jest'}));after(.08,()=>stabHit(e,{n:2,el:'jest',s:1.2}));SH(1.8);if(o.steal)after(.2,()=>FX.play('hy.mimic',{x:h.x,y:h.y,hero:h,target:e,lead:0,el:o.el||'gold',tro:o.tro}));});});
/* Collector's Pride / the belt: the five trophies glowing in their colours */
def('hy.belt',{th:"กระเป๋า 5 ใบ (ของที่ระลึกเรือง)",tab:'B',key:'ybPride',scene:'self'},o=>{const h=unitAt(o),cols=['ice','holy','water','gold','fire'];
  for(let i=0;i<5;i++)after(i*.14,()=>{const a=-Math.PI*.9+i*Math.PI*.45,x=h.x+Math.cos(a)*30,y=h.y+Math.sin(a)*14;A(new Spr({im:spr('hyTro','rift',i),w:18,x,y,z:30,layer:'top',pop:.25,s0:.2,s1:1,life:1.6-i*.14,fo:.3,glow:pal(cols[i])[2],gk:1.3,bob:2}));});});
/* Grand Medley (ultimate B): a circus ring, spotlights, the stolen skills one after another, masks, fireworks */
def('hy.medley',{th:'Grand Medley (อัลติ B)',tab:'B',key:'ybUlt',scene:'big'},o=>{const h=unitAt(o),e=tg(o),c={x:o.cx==null?e.x:o.cx,y:o.cy==null?e.y:o.cy},r=o.r||300,D=3;
  A(new Sigil({x:c.x,y:c.y,r,life:D+.6,fi:.3,fo:.4,spin:.12,tex:ART.ring('stage','rift'),layer:'ground',a:.95}));A(new Ring({x:c.x,y:c.y,el:'jest',r0:r*.3,r1:r,w0:12,life:.5}));
  for(let i=0;i<4;i++){const a0=i*TAU/4;spot({life:D,a:.45,r:50,col:['#fff0b0','#ffb0ef','#c8e6ff','#ffe0a0'][i],at:t=>({x:c.x+Math.cos(a0+t*1.6)*r*.55,y:c.y+Math.sin(a0+t*1.6)*r*.45})});}
  const L=near(o,c,r),tg2=L.length?L:[e];for(let i=0;i<12;i++)after(.2+i*.25,()=>{const v=tg2[i%tg2.length],el=LANDEL[i%LANDEL.length],shp=['single','cone','ground','self'][i%4];FX.play('hy.st.'+shp,{x:v.x+R(-90,90),y:v.y+R(-60,60),target:v,targets:L,el,mini:1,phi:R(0,TAU)});for(const t of L)if(Math.random()<.4)masks(t,[i%3],{dur:4});});
  after(D,()=>{for(let i=0;i<5;i++)after(i*.09,()=>{const a=R(0,TAU),d=R(0,.7)*r;firework(c.x+Math.cos(a)*d,c.y+Math.sin(a)*d*.8,R(90,150),{s:1.1});});A(new Ring({x:c.x,y:c.y,el:'rift',r0:20,r1:r,w0:16,life:.5}));
    for(const t of L)after(.1,()=>{A(new Burst({x:t.x,y:t.y,z:hz(t)*.5,el:'jest',r:30,n:9,life:.25}));stabHit(t,{s:1,el:'jest'});});rain(c.x,c.y,r*.85,{n:50,spread:.4});SH(4);});});

/* ---- C: Rift Ringmaster ---- */
def('hy.encircle',{th:'Pack Encircle ล้อมจ้อง',tab:'C',key:'yxPack',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),n=o.n||4;
  for(let i=0;i<n;i++){const a=i/n*TAU+.4,p={x:e.x+Math.cos(a)*72,y:e.y+Math.sin(a)*58};after(i*.08,()=>{A(new Disc({x:p.x,y:p.y,kind:'pool',add:0,col:INKD,r0:10,r1:28,life:1.3,a:.6,fo:.4}));if(DEMO(o)&&o.demo.img)A(new Dbl({im:o.demo.img,x:p.x,y:p.y,life:1.3,h:o.demo.h||58,flip:e.x<p.x}));
      A(new Fn({layer:'top',life:.9,delay:.25,fi:.1,fo:.2,d(q){const a2=q.fade(),s0=P(p.x,p.y,50),s1=P(e.x,e.y,hz(e)*.65);ctx.save();ctx.globalAlpha*=a2;ctx.lineWidth=2;ctx.strokeStyle=MAG;ctx.setLineDash([5,5]);ctx.lineDashOffset=-q.t*50;ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.lineTo(s1[0],s1[1]);ctx.stroke();ctx.restore();glowAt(s0[0],s0[1],9,MAG,.8*a2);}}));
      after(.3,()=>stare(e,Math.min(3,i+1)));});}
  after(.4+n*.08,()=>{if(n>=3)spellbound(e,o.dur||2);});});
def('hy.silence',{th:'Silent Dogs มอนเงียบ ใช้ท่าพิเศษไม่ได้',tab:'C',key:'yxSilence',scene:'ring'},o=>{const h=unitAt(o);for(let i=0;i<2;i++)laughRing(h.x,h.y,o.r||170,{delay:i*.12,el:'ink'});
  for(const e of near(o,h,o.r||170))after(.15+d2(e,h)/900,()=>silence(e,o.dur||2.2));});
def('hy.bodydouble',{th:'Body Double ร่างเงารับแทน',tab:'C',key:'yxBody',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),a=ang(h,e),p={x:h.x+Math.cos(a)*24,y:h.y+Math.sin(a)*24+2};
  if(DEMO(o)&&o.demo.img)A(new Dbl({im:o.demo.img,x:p.x,y:p.y,life:.45,rise:.06,h:o.demo.h||58,pop:1,flip:e.x<p.x}));
  after(.35,()=>{A(new Flash({x:p.x,y:p.y,z:30,el:'white',s0:20,s1:80,life:.2}));A(new Burst({x:p.x,y:p.y,z:30,el:'rift',r:36,n:12,life:.26}));firework(p.x,p.y,30,{s:.8,n:18});puffs(sys('sorted',p.y+1),'ink',p.x,p.y,16,6,34,50,30,.8);SH(2.4);});
  if(DEMO(o))mvU(h,1.1,(u,uu)=>{uu.alpha=u<.3?1:(Math.sin(u*60)>0?.25:.75);if(u>=1)uu.alpha=1;});});
def('hy.carnival',{th:'Rift Carnival เปิดรอยแยกงานรื่นเริง',tab:'C',key:'yxCarnival',scene:'duel'},o=>{const h=unitAt(o),D=o.dur||3.5,zt=128;
  A(new Fn({layer:'top',life:1.1,d(q){const kk=q.t/q.life,op=kk<.35?eO(kk/.35):1-eI((kk-.35)/.65),s=P(h.x,h.y,zt),W=110*op,Hh=26*op;if(W<1)return;ctx.save();ctx.translate(s[0],s[1]);
    const lens=(sc)=>{ctx.beginPath();for(let i=0;i<=16;i++){const u=i/16,x=(u-.5)*W*2*sc,y=-Math.sin(Math.PI*u)*Hh*sc+(i%2?2:-2);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}for(let i=16;i>=0;i--){const u=i/16,x=(u-.5)*W*2*sc,y=Math.sin(Math.PI*u)*Hh*sc+(i%2?-2:2);ctx.lineTo(x,y);}ctx.closePath();};
    lens(1.25);ctx.fillStyle=rgba(INKD,.6);ctx.fill();lens(1);ctx.fillStyle='#6a24d0';ctx.fill();lens(.7);ctx.fillStyle=MAG;ctx.fill();lens(.35);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();glowAt(s[0],s[1],W*1.2,VIO,.6*op);}}));
  const S=sys('top');for(let i=0;i<10;i++)S.add({im:spr('drop','ink'),x:h.x+R(-60,60),y:h.y,z:zt,vz:R(-20,0),g:500,s0:R(7,11),life:.7,face:1,delay:R(.1,.6),fo:.3});
  if(DEMO(o)&&o.demo.img)for(const sd of [-1,1]){const p={x:h.x+sd*60,y:h.y+16},d={x:p.x,y:p.y,z:zt};A(new Fn({layer:'ground',life:.6,delay:.25,d(){},tick(){d.z=Math.max(0,zt*(1-eI(cl(this.t/.45,0,1))));}}));
    after(.25,()=>A(new Dbl({im:o.demo.img,follow:d,life:D-.25,rise:.05,h:o.demo.h||58,flip:sd<0?0:1})));after(.7,()=>{A(new Ring({x:p.x,y:p.y,el:'jest',r0:6,r1:44,w0:6,life:.3}));H.dust(o,p.x,p.y,24,5,20,10);});}
  A(new Sigil({follow:h,r:110,life:D,fi:.3,fo:.4,spin:.4,tex:ART.ring('rift','rift'),layer:'ground'}));
  orbit({follow:h,im:[spr('hyBell','gold'),spr('hyDia','rift',0),spr('hyDia','rift',1),spr('hyDia','rift',3),spr('hyStar','jest')],n:5,r:46,z:40,spin:2.4,life:D,w:12,bob:4,selfSpin:3});
  A(new Emit({follow:h,layer:'top',life:D,every:.25,fn(){const S2=sys('top');glints(S2,pick(['#ffd76a','#ffb0ef','#e0b8ff']),h.x,h.y,30,1,60,.6);}}));});
def('hy.joke',{th:'Killing Joke กระซิบมุกจนขาดใจ',tab:'C',key:'yxJoke',scene:'duel'},o=>{const h=unitAt(o),e=tg(o),a=ang(h,e),sd={x:e.x-Math.sin(a)*40,y:e.y+Math.cos(a)*30},W=o.wait==null?1.2:o.wait;
  inkBurst(sd.x,sd.y,{s:.9});
  if(DEMO(o))mvU(h,.1,(u,uu)=>{uu.x=sd.x;uu.y=sd.y;uu.face=e.x<sd.x?-1:1;uu.alpha=u;});
  after(.18,()=>{above(e,spr('hyBub','rift',0),22,{life:.9,dz:10});A(new Spr({im:spr('hyGrin','jest'),w:24,follow:h,z:44,layer:'top',pop:.15,s0:.2,s1:1,life:.7,fo:.25}));});
  for(let i=0;i<3;i++)after(.4+i*.25,()=>{const z=hz(e)*.7;A(new Spr({im:spr('hyStar','jest'),w:10+i*4,x:e.x+R(-12,12),y:e.y,z:z+R(0,14),layer:'top',pop:.12,s0:.2,s1:1,life:.35,fo:.2,spin:4}));if(DEMO(o))mvU(e,.25,(u,uu)=>{uu.jig=Math.sin(u*40)*(2+i);});});
  after(W,()=>{const z=(e.z||0)+hz(e)*.55;A(new Spr({im:spr('hyGrin','jest'),w:96,follow:e,z:z+6,layer:'top',pop:.22,s0:.2,s1:1,life:.8,fo:.3,glow:MAG,gk:.9,wr:.15,wf:30}));
    for(let i=0;i<3;i++)laughRing(e.x,e.y,150,{delay:i*.1});A(new Flash({x:e.x,y:e.y,z,el:'white',s0:24,s1:110,life:.26}));A(new Burst({x:e.x,y:e.y,z,el:'jest',r:60,n:14,life:.32}));
    const S=sys('top');for(let i=0;i<3;i++){const q=R(0,TAU);S.add({im:spr('hyEye','rift'),x:e.x,y:e.y,z:z+20,vx:Math.cos(q)*110,vy:Math.sin(q)*70,vz:140,g:320,s0:14,s1:6,life:.7,fo:.4});}bits(S,'jest',e.x,e.y,z,12,{size:1.2});SH(4.5);const m=MK.stare.get(e);if(m)m.set(0);});});
def('hy.faces',{th:'Thousand Faces หน้ากากพันหน้า',tab:'C',key:'yxFaces',scene:'big'},o=>{const h=unitAt(o),r=o.r||300;
  ['weep','scorn','sleepy'].forEach((el,i)=>{A(new Ring({follow:h,el,r0:20,r1:r*(1-i*.06),w0:22,w1:4,life:.6,delay:i*.08}));});
  for(let i=0;i<6;i++){const a=R(0,TAU),d=R(.3,.9)*r;after(.1+d/900,()=>splat(h.x+Math.cos(a)*d,h.y+Math.sin(a)*d,R(20,32),['weep','scorn','sleepy'][i%3],{life:1.6,seed:i+2}));}
  const S=sys('top');for(let i=0;i<30;i++){const a=i/30*TAU+R(-.1,.1),v=R(180,320);S.add({im:spr('hyMask','rift',i%3),x:h.x,y:h.y,z:40,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,vz:R(80,180),g:300,dr:1.4,s0:R(12,18),life:R(.8,1.1),rot:R(0,TAU),vr:R(-6,6),fo:.35});}
  A(new Flash({follow:h,z:40,el:'jest',s0:20,s1:90,life:.25}));SH(3);for(const e of near(o,h,r))after(.15+d2(e,h)/700,()=>masks(e,[0,1,2]));});

/* ---- stolen skills: the shadow version of the real skill by its shape (ink violet + the source colour) ---- */
const LANDEL=['ice','sakura','holy','water','fire','soul','moon','gold','blood','earth','volt'];
def('hy.st.single',{th:'ท่าขโมย: เป้าเดียว / กระสุน',tab:'steal',scene:'far'},o=>{const h=unitAt(o),e=tg(o),el=o.el||'sakura',m=mix(el),s=o.mini?.75:1;
  A(new Proj({x:o.mini?e.x-R(80,140):h.x,y:o.mini?e.y-R(-40,40):h.y,z:36,to:e,tz:hz(e)*.5,speed:520,head:'orb',r:9*s,el:m,trail:.2,homing:1,onHit(x,y,z){H.impact(el,x,y,z,s*.9,6);A(new Burst({x,y,z,el:'ink',r:26*s,n:8,life:.22,delay:.03}));const S=sys('top');bits(S,'rift',x,y,z,4,{size:.8});}}));});
def('hy.st.line',{th:'ท่าขโมย: แนวตรง',tab:'steal',scene:'line'},o=>{const h=unitAt(o),e=tg(o),el=o.el||'ice',m=mix(el),phi=e?ang(h,e):(o.phi||0),Lr=o.mini?220:360;
  A(new Wave({x:h.x,y:h.y,phi,dist:Lr,r:44,w:18,life:.42,el:m,z:18}));A(new Streak({x:h.x,y:h.y,z:20,x2:h.x+Math.cos(phi)*Lr,y2:h.y+Math.sin(phi)*Lr,z2:20,w:12,life:.3,go:.5,el:m}));
  const S=sys('top');for(let i=0;i<8;i++){const d=i/8*Lr;after(d/900,()=>{bits(S,el,h.x+Math.cos(phi)*d,h.y+Math.sin(phi)*d,18,1,{size:.8});S.add({im:spr('hyDia','rift',i%4),x:h.x+Math.cos(phi)*d,y:h.y+Math.sin(phi)*d,z:20,vz:R(40,90),g:300,s0:8,life:.5,rot:R(0,TAU),vr:R(-8,8),fo:.4});});}
  for(const t of (o.targets||[])){const dx=t.x-h.x,dy=t.y-h.y,al=dx*Math.cos(phi)+dy*Math.sin(phi),lat=Math.abs(-dx*Math.sin(phi)+dy*Math.cos(phi));if(al>0&&al<Lr&&lat<36)after(al/900,()=>H.spark(el,t.x,t.y,hz(t)*.5,.9,5));}});
def('hy.st.cone',{th:'ท่าขโมย: กรวยหน้า',tab:'steal',scene:'crowd'},o=>{const h=unitAt(o),el=o.el||'blood',m=mix(el),phi=o.phi||0,r=o.mini?110:150;
  A(new Arc({x:h.x,y:h.y,phi,R:r*.7,w:34,a0:-1,a1:1,tilt:.15,swing:.13,life:.34,z:26,el:m}));A(new Arc({x:h.x,y:h.y,phi,R:r*.5,w:18,a0:1,a1:-1,tilt:-.2,swing:.12,life:.3,z:30,el:'ink',delay:.06}));
  const S=sys('top');bits(S,el,h.x+Math.cos(phi)*r*.5,h.y+Math.sin(phi)*r*.5,24,8,{dir:phi,spread:.8,size:.9});bits(S,'rift',h.x+Math.cos(phi)*r*.5,h.y+Math.sin(phi)*r*.5,24,4,{dir:phi,spread:.8});
  for(const t of near(o,h,r))if(Math.abs(Math.atan2(Math.sin(ang(h,t)-phi),Math.cos(ang(h,t)-phi)))<1.05)after(.1,()=>H.spark(el,t.x,t.y,hz(t)*.5,.9,5));});
def('hy.st.self',{th:'ท่าขโมย: วงรอบตัว',tab:'steal',scene:'ring'},o=>{const h=unitAt(o),el=o.el||'holy',m=mix(el),r=o.mini?100:160;
  H.dark(h.x,h.y,r*.4,1,.3);A(new Ring({x:h.x,y:h.y,el:m,r0:14,r1:r,w0:16,life:.42}));A(new Ring({x:h.x,y:h.y,el:'ink',r0:10,r1:r*.7,w0:8,life:.34,delay:.05}));A(new Burst({x:h.x,y:h.y,z:6,el:m,r:r*.4,n:12,flat:1,life:.3}));
  const S=sys('top');bits(S,el,h.x,h.y,14,12,{size:1,sp:1.3});bits(S,'rift',h.x,h.y,14,6,{sp:1.2});for(const t of near(o,h,r))after(.08+d2(t,h)/1100,()=>H.spark(el,t.x,t.y,hz(t)*.5,.9,4));});
def('hy.st.ground',{th:'ท่าขโมย: วงที่พื้น (ตกตามหลัง)',tab:'steal',scene:'crowd'},o=>{const e=tg(o),el=o.el||'volt',m=mix(el),r=o.mini?90:130,c=o.mini?{x:o.x,y:o.y}:e,W=o.mini?.25:.5;
  A(new Sigil({x:c.x,y:c.y,r,life:W+.35,fi:.15,fo:.2,spin:1.4,tex:ART.ring('rift',m)}));A(new Spr({im:spr('hyStil','ink'),w:44,x:c.x,y:c.y,z:240,vz:-240/W,layer:'top',rot:Math.PI/2,life:W,fi:.05,fo:.02}));
  after(W,()=>{H.blast(el,c.x,c.y,r/110,{shake:2});inkBurst(c.x,c.y,{s:.8});for(const t of near(o,c,r))H.spark(el,t.x,t.y,hz(t)*.5,.9,4);});});
def('hy.st.zone',{th:'ท่าขโมย: พื้นที่ค้าง',tab:'steal',scene:'crowd'},o=>{const e=tg(o),el=o.el||'soul',m=mix(el),r=o.r||140,D=o.dur||3,c=e;
  A(new Sigil({x:c.x,y:c.y,r,life:D,fi:.3,fo:.4,spin:.5,tex:ART.ring('rift',m),a:.8}));H.dark(c.x,c.y,r*.9,D,.3);
  A(new Emit({x:c.x,y:c.y,life:D-.2,every:.12,fn(){const a=R(0,TAU),d=Math.sqrt(Math.random())*r*.85,x=c.x+Math.cos(a)*d,y=c.y+Math.sin(a)*d;const S=sys('top');bits(S,el,x,y,8,3,{size:.8,up:.6});S.add({im:spr('flame',m,(Math.random()*3)|0),x,y,z:2,vz:R(40,80),g:-20,s0:R(16,24),s1:5,life:.7,wob:3,fo:.5});S.add({im:spr('flame','ink',(Math.random()*3)|0),x:x+R(-10,10),y,z:2,vz:R(30,60),g:-20,s0:R(12,18),s1:4,life:.6,wob:3,fo:.5,a0:.8});}}));
  A(new Emit({x:c.x,y:c.y,life:D-.2,every:.5,fn(){for(const t of near(o,c,r))H.spark(el,t.x,t.y,hz(t)*.5,.7,3);}}));});
def('hy.st.heal',{th:'ท่าขโมย: ฮีล',tab:'steal',scene:'self'},o=>{const h=unitAt(o),el=o.el||'sakura',m=mix(el);A(new Ring({follow:h,el:m,r0:10,r1:50,w0:6,life:.45}));A(new Disc({follow:h,col:pal(el)[2],r0:24,r1:50,life:.7,a:.5}));
  H.floaters(sys('top'),[spr('hyStar',el),spr('hyStar','jest')],h.x,h.y,26,8,{s:10});A(new Flash({follow:h,z:34,el,s0:10,s1:46,life:.22}));});

/* ---------------------------------------------------------------------
   5. EXPORT
   --------------------------------------------------------------------- */
window.HYV={play:(id,o)=>FX.play(id,o),mix,inked,drawInk,Dbl,inkBurst,stare,masks,spellbound,expose,silence,lure,dismay,stabHit,backstab,firework,tear,thread,laughRing,spot,darkness,jaws,tell,facePaint,LANDEL,
  ids:()=>FX.list.filter(m=>m.cat==='hy').map(m=>m.id)};
})();
