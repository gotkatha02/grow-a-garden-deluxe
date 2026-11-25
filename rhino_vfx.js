/* =====================================================================
   WOOLLY RHINO 'Glacier Titan' (Norse, Frost Iron Guardian) — skill effects v3:
   the owner's painted pieces (assets/fx/rhino) as the main effects + code VFX on the FXLIB kit (fxlib.js) + vector art (rhino_art.js).
   Owner 2026-11-25 'ทำเอฟเฟคสกิลแรดใหม่ … มันพอมีเอฟเฟคเจนอยู่แล้ว อันไหนใช้ได้ก็ใช้ อันไหนไม่โอเคก็ส่งพรอมต์มาเจนใหม่'.
   Plan + per-skill table: RHINO_FX_PLAN_TH.md · prompts for the 10 new pictures: RHINO_FX3_PROMPTS_TH.md.

   LOOK   his gauntlets: dark iron, copper bands, glacier-ice knuckles. Basic = glacier jabs · A 'Iron Juggernaut' = iron plates,
          walls, domes and glacier light · B 'Titan Breaker' = copper heat, rock and craters · C = its column.
   TIMING every gauntlet blow is drawn from the hand to the target so its knuckles land ON the game's contact frame (the blow starts
          a little before the hit event) · slams / landings draw on the damage frame · hit sparks come from the damage (punchFx).
   PAINTED kept pieces r07 … r35 (r20 wall, r35 spirit head = stand-ins) · RXP = the new rx_* pictures once they are in the folder
          (until then the code gauntlet rxFist draws the blows, r18 the giant fist, r20 the wall, r35 the roar head).
   HOOKS  rhPunches / rhCharge / rhSlam / mkBasic / every SKILLS[k].make wrapped (extra action events only) · punchFx / frontArc /
          rhStg / setFxTimer replaced or wrapped · GiantFist, SteelWallObj, FortressZone, IceMonolith, RhOverlay keep their update
          (they carry gameplay) and get new draws · jgPreHit / jgAbsorb / jgPostHit / jgAfterHurt wrapped for the guard, shield,
          Unbreakable, Last Bastion and Earth Fracture looks · lasting buff looks are kept alive by a watcher in RhOverlay.update.
          Old look off while his own code runs: the comic punch bursts, shock rings, cracks, craters, rock spires, speed lines, wind
          arcs, roar wave, taunt lines, plates, cast seal, painted crescents and round emits; HitCrescents / PuffDust always.
   ?vfx3=0 = the old look (char_rhino_fx.js + vfx_rework.js rhino pass) · ?rhpic=0 = code art only.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='rhino'||!window.FXLIB||!window.RXART||/[?&]vfx3=0/.test(location.search))return;
const F=window.FXLIB,K_=F.k,{TAU,cl,lerp,eO,eI,back,KY,qn,rgba,pal,tex,spr,glowAt,coreAt,starAt,drawSpr,sys,bits,puffs,glints,A,after,Emit,Fn,Streak,Ring,Disc,Flash,Burst,Crack,Spike,Flames,Wave,Sigil,Spr,orbit,BIT}=K_;
const R_=K_.R,{scrAng,lite,dark,ring,flash,burst,dust}=K_.h,ART=window.RXART;
const RV=window.RHV={on:1,mom:0,tk:0};
if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('rhino');
Object.assign(F.PAL,{glacier:['#0a1e36','#1f62b0','#6cbcf0','#cdefff','#ffffff'],iron:['#0c1016','#2e3644','#5d6a7e','#a9b6c8','#eef3f8'],
  copper:['#2a1206','#a24814','#ec8a3a','#ffc88e','#fff2e0'],rage:['#2a0606','#b5260f','#ff6430','#ffbc86','#fff1e6'],stone:['#1a1714','#5e564c','#958a7c','#c9bfae','#f2ece2']});
BIT.glacier=[['rxIce',{up:[120,260],g:760,sp:170,sz:[8,15],s1:.85,life:[.5,.9],spin:10,bounce:.3}],['snow',{up:[10,60],g:40,sp:70,sz:[7,12],s1:.7,life:[.6,1.1],spin:2,wob:5}]];
BIT.stone=BIT.earth;BIT.iron=[['rock',{up:[120,260],g:860,sp:180,sz:[6,11],life:[.45,.8],spin:12,bounce:.3}],['spark',{up:[60,220],g:320,sp:240,sz:[10,16],s1:.5,life:[.22,.45],add:1,str:1}]];
BIT.copper=[['spark',{up:[60,220],g:320,sp:240,sz:[10,16],s1:.5,life:[.22,.45],add:1,str:1}],['ember',{up:[40,140],g:240,sp:150,sz:[6,10],s1:.4,life:[.3,.6]}]];
BIT.rage=BIT.fire;
const G=F.PAL.glacier,IR=F.PAL.iron,CU=F.PAL.copper,RA=F.PAL.rage;
F.dust=()=>/^(vik|snow)/i.test(typeof curMap==='string'?curMap:'')?'cloud':'dust';
/* the coloured rim the engine draws on the hero during actions: softer, the effects carry the light */
for(const nm of ['drawPlayerAura','drawPlayer']){const f0=window[nm];if(typeof f0!=='function')continue;window[nm]=function(){const g=player.glow;if(!g||!g.k)return f0.apply(this,arguments);const k0=g.k;g.k=k0*.4;try{return f0.apply(this,arguments);}finally{g.k=k0;}};}

/* ---------------------------------------------------------------------
   1. helpers
   --------------------------------------------------------------------- */
const warn=(k,e)=>{if(!RV['_w'+k]){RV['_w'+k]=1;console.warn('rhino fx',k,e);}};
const safe=(k,f)=>function(){try{return f.apply(this,arguments);}catch(e){warn(k,e);}};
const mine=()=>!!(window.SKCTX||window.__ACTEV||window.__RHCTX||RV.tk>0);
const HK=()=>window.HERO_K||1;
const TEMPO=()=>typeof ACTION_TEMPO==='number'&&ACTION_TEMPO>0?ACTION_TEMPO:.75;
const at=(a,t,f)=>{(a.events=a.events||[]).push({t:Math.max(0,t),f:safe('ev',f)});};
const first=(a,t,f)=>{(a.events=a.events||[]).unshift({t:Math.max(0,t),f:safe('ev',f)});};
/* f(seconds left until action time T) runs `lead` real seconds before T */
const pre=(a,T,lead,f)=>{const t=Math.max(0,T-lead*TEMPO());first(a,t,a2=>f(Math.max(.03,(T-((a2&&a2.t)||t))/TEMPO())));};
const hand=()=>{const s=player.socket;if(s&&s.w)return [s.w[0],s.w[1],s.w[2]];const c=Math.cos(player.phi),n=Math.sin(player.phi);return [player.x+c*12,player.y+n*12,(player.z||0)+34*HK()];};
const zOf=e=>e?(e.boss?40:26)*(e.sc||1)+(e.z||0):26;
const topZ=e=>e?(e.boss?72:52)*(e.sc||1)+(e.z||0):52;
const SCX={};function S1(l){l=l||'top';const k=l+'|'+(window.SKCTX||window.__RHCTX||'');let s=SCX[k];if(!s||!fx.includes(s))s=SCX[k]=sys(l);s.keep=s.t+.4;return s;}
const grab=fn=>{const h={parts:[],dead:0};K_.run(h,fn);return h.parts.filter(p=>p.life>=50);};
const guardDraw=(k,f)=>function(){ctx.save();try{f.call(this);}catch(e){warn(k,e);}finally{ctx.restore();}};
const brPal=k=>{const s=k&&SKILLS[k];return s&&(s.br==='B'||(s.br==='C'&&s.col==='B'))?'copper':'glacier';};
const sideOf=()=>Math.cos(player.phi)<-.05?-1:1;
/* my own parts: save / restore round every draw, a failing piece is dropped (a thrown draw would freeze the game loop) */
class RP extends K_.Part{draw(){if(this.t<0||this.t>=this.life)return;ctx.save();try{this.paint();}catch(e){warn('part '+this.constructor.name,e);this.life=0;}finally{ctx.restore();}}}
const FN=o=>{const d=o.d;o.d=function(q,k){ctx.save();try{d.call(this,q,k);}finally{ctx.restore();}};return A(new Fn(o));};
function coneTarget(phi,range,half){let b=null,bd=1e9;for(const e of enemies){if(e.dead)continue;const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy);if(d>range+(e.r||16))continue;
    let df=Math.atan2(dy,dx)-phi;df=Math.atan2(Math.sin(df),Math.cos(df));if(d>(e.r||16)+8&&Math.abs(df)>half)continue;if(d<bd){bd=d;b=e;}}return b;}

/* ---------------------------------------------------------------------
   2. painted pieces (the owner's art). RXP lists the new rx_* pictures once they are in assets/fx/rhino.
   --------------------------------------------------------------------- */
const PD='assets/fx/rhino/',PICS=['r07_hit','r08_heavyhit','r09_break','r10_armorcrack','r11_pow','r13_crack','r14_shockring','r15_erupt','r16_dust','r17_crater','r18_spiritfist',
  'r20_wall','r21_bubble','r22_pulse','r23_anchor','r24_ironskin','r25_glacierwall','r26_glacier','r27_bastion','r28_iceburst','r29_trail','r31_roar','r32_fury','r33_emblem','r34_sigil','r35_spirit'];
const RXP=[];
const PIM={},NOPIC=/[?&]rhpic=0/.test(location.search);
const img=n=>{if(NOPIC||!(PICS.includes(n)||RXP.includes(n)))return null;let o=PIM[n];if(!o){o=PIM[n]=new Image();o.decoding='async';o.src=PD+n+'.webp';}return o.complete&&o.naturalWidth?o:null;};
for(const n of PICS.concat(RXP))img(n);
/* a picture at a world point. layer 'ground' (flat pieces, drawn as painted) · 'sorted' (upright, ay ≈ .94 = its base) · 'top' (sparks)
   s0 → s1 grow (pop = seconds of an overshooting pop) · fi / fo fades in seconds · glow = an additive copy at the start · sq = squash on landing */
class Pic extends RP{constructor(o){super(o,{layer:'top',life:.4,w:80,ax:.5,ay:.5,s0:1,s1:1,pop:0,fi:.04,fo:.3,a:1,rot:0,spin:0,flip:0,flipY:0,rise:0,glow:0,add:0,sq:0,pulse:0,pf:5});}
  paint(){const im=this.im||img(this.n);if(!im)return;const t=this.t,k=t/this.life,a=this.a*cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1);if(a<=.01)return;
    const sc=(this.pop?lerp(this.s0,this.s1,back(cl(t/this.pop,0,1))):lerp(this.s0,this.s1,eO(k)))*(this.pulse?1+this.pulse*Math.sin(t*this.pf):1),o=this.pos(),q=P(o[0],o[1],o[2]+this.rise*k),
      iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,w=this.w*this.size*sc,h=w*ih/iw,gy=this.sq?1+this.sq*Math.sin(cl(t/.2,0,1)*Math.PI):1;
    ctx.save();ctx.globalAlpha*=a;if(this.add)ctx.globalCompositeOperation='lighter';ctx.translate(q[0],q[1]);const r=this.rot+this.spin*t;if(r)ctx.rotate(r);if(this.flip)ctx.scale(-1,1);if(this.flipY)ctx.scale(1,-1);if(gy!==1)ctx.scale(1/Math.sqrt(gy),gy);
    ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);if(this.glow&&k<.45){ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=this.glow*(1-k/.45);ctx.drawImage(im,-w*this.ax,-h*this.ay,w,h);}ctx.restore();}}
const pic=o=>A(new Pic(o));
const gpic=(n,x,y,w,o)=>pic(Object.assign({n,x,y,z:0,w,layer:'ground',life:.8,s0:.6,s1:1.05,fi:.04,fo:.4},o));
const spic=(n,x,y,w,o)=>pic(Object.assign({n,x,y,z:0,w,ay:.94,layer:'sorted',sortOff:3,life:.8,s0:.75,s1:1,pop:.14,fi:.06,fo:.35},o));
const hpic=(n,e,w,o)=>pic(Object.assign({n,x:e.x,y:e.y,z:zOf(e),w,life:.26,s0:.55,s1:1.1,pop:.08,fi:.001,fo:.16,glow:.7,rot:R_(-.4,.4)},o));
const shock=(x,y,w,o)=>gpic('r14_shockring',x,y,w,Object.assign({life:.55,s0:.3,s1:1.1,fo:.35},o));
const crackP=(x,y,w,o)=>gpic('r13_crack',x,y,w,Object.assign({life:1.3,s0:.5,s1:1,pop:.1,fo:.5},o));
const crater=(x,y,w,o)=>gpic('r17_crater',x,y,w,Object.assign({life:2.2,s0:.55,s1:1,pop:.12,fo:.7},o));
const pulse=(x,y,w,o)=>gpic('r22_pulse',x,y,w,Object.assign({life:.6,s0:.3,s1:1.15,fo:.35,glow:.5},o));
const erupt=(x,y,w,o)=>spic('r15_erupt',x,y+8,w,Object.assign({life:.65,s0:.5,s1:1.05,pop:.12,fi:.001,fo:.3,sq:.2},o));
const iceBurst=(x,y,w,o)=>spic('r28_iceburst',x,y+6,w,Object.assign({life:.6,s0:.5,s1:1.05,pop:.12,fi:.001,fo:.35},o));

/* ---------------------------------------------------------------------
   3. the gauntlet blows
   --------------------------------------------------------------------- */
const TIP=[ART.RXFIST.tip[0]/ART.RXFIST.w,ART.RXFIST.tip[1]/ART.RXFIST.h];
/* the owner's painted blows (when in RXP): tip = the knuckles as a picture fraction, k = picture width ÷ fist width — measure when they come */
const RXA={rx_jab:{tip:[.86,.5],k:2.8},rx_heavy:{tip:[.86,.5],k:2.4},rx_meteor:{tip:[.86,.5],k:2.6},rx_revenge:{tip:[.86,.5],k:2.6},rx_hammer:{tip:[.5,.9],k:1.7},rx_upper:{tip:[.5,.1],k:1.6},rx_giant:{tip:[.5,.94],k:1.15}};
/* a tapered smear of motion behind a blow (screen space), with speed lines */
function smear(ax,ay,bx,by,w,p,a){const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy);if(L<4||a<=.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(ax,ay);ctx.rotate(Math.atan2(dy,dx));
  const bl=(ws,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*.55,-w*.5*ws,L,-w*.42*ws);ctx.lineTo(L,w*.42*ws);ctx.quadraticCurveTo(L*.55,w*.5*ws,0,0);ctx.fill();};
  ctx.save();ctx.translate(1.5,2.5);bl(1.15,rgba(p[0],.32));ctx.restore();bl(1,rgba(p[1],.8));bl(.66,p[2]);bl(.36,p[3]);bl(.14,p[4]);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.45;ctx.drawImage(tex('glow',p[2]),L*.25,-w*1.1,L*.85,w*2.2);ctx.globalCompositeOperation='source-over';ctx.globalAlpha/=.45;
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineCap='round';for(const [o,l,lw] of [[-.7,.5,1.6],[.74,.42,1.3],[-.28,.3,1]]){ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(L*(1-l)-w*.4,o*w*.55);ctx.lineTo(L-w*.35,o*w*.5);ctx.stroke();}
  ctx.restore();}
/* one blow. kind jab / heavy / meteor / revenge (side view along the punch) · hammer (two fists down) · upper (one fist up).
   T = real seconds until the contact frame, then `hold` on the target and `out` to fade. to = the target (followed until contact) */
class FistFx extends RP{constructor(o){super(o,{layer:'top',T:.07,hold:.05,out:.12,kind:'jab',v:0,w:50,pl:'glacier',side:0,reach:80,jit:0});this.life=this.T+this.hold+this.out;this.p=pal(this.pl);
    if(this.ph==null)this.ph=player.phi;if(this.jit){this.jx=R_(-1,1)*12*HK();this.jz=R_(-10,12)*HK();}}
  start(){const h=hand(),c=Math.cos(this.ph),s=Math.sin(this.ph),sd=this.side+(this.jx||0);return [h[0]-s*sd,h[1]+c*sd,h[2]+(this.jz||0)*.4];}
  end(S){if(this.E&&this.t>=this.T)return this.E;const e=this.to;if(e&&!e.dead){const dx=e.x-S[0],dy=e.y-S[1],d=Math.hypot(dx,dy)||1,r=(e.r||16)*.5;this.E=[e.x-dx/d*r,e.y-dy/d*r,zOf(e)+(this.jz||0)];}
    else if(!this.E){const c=Math.cos(this.ph),s=Math.sin(this.ph),R=this.reach*HK();this.E=[player.x+c*R,player.y+s*R,S[2]];}return this.E;}
  paint(){const t=this.t,T=this.T,kd=this.kind,p=this.p;let S=this.start(),E=this.end(S);
    if(kd==='hammer')S=[E[0],E[1],E[2]+80*HK()];else if(kd==='upper'){S=[E[0],E[1],Math.max(0,E[2]-28)];E=[E[0],E[1],E[2]+40*HK()];}
    else S=[lerp(S[0],E[0],.3),lerp(S[1],E[1],.3),lerp(S[2],E[2],.3)];
    const u=cl(t/T,0,1),e=Math.pow(u,1.25),gs=.72+.28*eO(u),q2=cl((t-T-this.hold)/this.out,0,1),back2=.12*eI(q2),
      H=t<T?[lerp(S[0],E[0],e),lerp(S[1],E[1],e),lerp(S[2],E[2],e)]:[lerp(E[0],S[0],back2),lerp(E[1],S[1],back2),lerp(E[2],S[2],back2)],
      s=P(S[0],S[1],S[2]),h=P(H[0],H[1],H[2]),al=cl(t/.03,0,1)*(1-q2),fw=this.w*this.size*gs,
      side=kd!=='hammer'&&kd!=='upper',ang=side?(Math.hypot(h[0]-s[0],h[1]-s[1])>6?Math.atan2(h[1]-s[1],h[0]-s[0]):scrAng(this.ph)):(kd==='hammer'?Math.PI/2:-Math.PI/2);
    /* smear from just behind the head */
    const L=Math.hypot(h[0]-s[0],h[1]-s[1]),lk=Math.min(1,fw*2.4/Math.max(1,L)),tl=[h[0]-(h[0]-s[0])*lk,h[1]-(h[1]-s[1])*lk],sa=al*(t<T?1:cl(1-(t-T)/.09,0,1));
    if(side||kd==='upper')smear(tl[0],tl[1],h[0],h[1],fw*.62,p,sa*.95);else for(const sd of [-1,1])smear(h[0]+sd*fw*.2,h[1]-fw*1.4,h[0]+sd*fw*.2,h[1]-fw*.1,fw*.42,p,sa*.85);
    glowAt(h[0],h[1],fw*.75,p[2],.45*al);
    const pn='rx_'+kd,pim=img(pn);
    if(pim){const C=RXA[pn]||{tip:[.86,.5],k:2.5},pw=fw*C.k,ph=pw*pim.naturalHeight/pim.naturalWidth;ctx.save();ctx.globalAlpha*=al;ctx.translate(h[0],h[1]);if(side){ctx.rotate(ang);if(Math.cos(ang)<-.01)ctx.scale(1,-1);}
      else if(kd==='upper'&&sideOf()<0)ctx.scale(-1,1);ctx.drawImage(pim,-pw*C.tip[0],-ph*C.tip[1],pw,ph);ctx.restore();return;}
    const c=spr('rxFist','iron',this.v),fh=fw*c.height/c.width;ctx.save();ctx.globalAlpha*=al*.92;
    const one=(ox,oy,rot,fy)=>{ctx.save();ctx.translate(h[0]+ox,h[1]+oy);ctx.rotate(rot);if(fy)ctx.scale(1,-1);ctx.drawImage(c,-fw*TIP[0],-fh*TIP[1],fw,fh);
      ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.3+.25*(1-u);ctx.drawImage(c,-fw*TIP[0],-fh*TIP[1],fw,fh);ctx.restore();};
    if(side)one(0,0,ang,Math.cos(ang)<-.01);else if(kd==='hammer'){one(-fw*.2,0,ang,1);one(fw*.2,0,ang,0);}else one(0,0,ang,sideOf()<0);
    ctx.restore();}}
const fist=o=>A(new FistFx(o));
/* light / power gathering in the gauntlet for T real seconds */
function gatherT(pl,T){if(T<.08)return;const p=pal(pl),S=S1();
  A(new Emit({life:Math.max(.05,T-.04),every:.035,fn(){const hd=hand(),an=R_(0,TAU),d=R_(28,50)*HK();S.add({im:tex('core',p[2]),x:hd[0]+Math.cos(an)*d,y:hd[1]+Math.sin(an)*d*.6,z:hd[2]+R_(-16,26),to:{x:hd[0],y:hd[1],z:hd[2]},s0:R_(5,8),s1:2,lin:1,life:R_(.14,.22),add:1,str:1.3,fi:.04,fo:.1});}}));
  FN({layer:'top',life:T+.04,fi:.08,fo:.05,d(q,kk){const hd=hand(),m=P(hd[0],hd[1],hd[2]),r=(5+11*kk)*HK()*(1+.08*Math.sin(q.t*40));glowAt(m[0],m[1],r*2.3,p[2],.55*q.fade());coreAt(m[0],m[1],r,p[2],.85*q.fade());}});}
function gather(a,pl){const T=(a.windup||0)/TEMPO();if(T<.12)return;gatherT(pl,T);at(a,a.windup,()=>{const hd=hand();flash(pl,hd[0],hd[1],hd[2],.8*HK());});}

/* ---------------------------------------------------------------------
   4. hit sparks and the pieces of the game's own calls
   --------------------------------------------------------------------- */
const COLPAL=c=>{c=(c||'').toLowerCase();if(/^#ff(6a|9a|8a|5a)/.test(c))return 'rage';if(['#8fa4c4','#d6dce4','#dfe8f4','#e4e7ec','#cfe9ff','#e8f8ff','#ffffff','#c8d4e0'].includes(c))return 'glacier';
  if(['#e0904a','#c8803a','#ffd890','#ffb35a','#ffd9a0'].includes(c))return 'copper';return '';};
function hitFx(e,phi,big,pl){if(!e)return;if(e._rvT===gameTime&&!big)return;e._rvT=gameTime;const x=e.x,y=e.y,z=zOf(e),S=S1(),gl=pl==='glacier';
  if(big){hpic(gl?'r07_hit':'r08_heavyhit',e,gl?88:96,{life:.3});burst(pl,x,y,z,.85,{n:9,life:.22});flash(pl,x,y,z,.8,{life:.15});ring(pl,x,y,46,{w0:6,life:.3});
    bits(S,gl?'glacier':pl,x,y,z,6,{size:.95,dir:phi,spread:1.1,sp:1.2});bits(S,'stone',x,y,8,4,{size:.8,dir:phi,spread:1.3});dust({},x,y,16,4,24);}
  else{hpic('r07_hit',e,54,{life:.2});flash(pl,x,y,z,.5,{life:.12});bits(S,'glacier',x,y,z,3,{size:.75,dir:phi,spread:1});}}
/* every punch of the game (Impact + AirRing + sparks + rocks …) → the new hit */
punchFx=function(e,phi,o){o=o||{};try{if(e)hitFx(e,phi==null?player.phi:phi,!!o.big,COLPAL(o.color)||brPal(window.SKCTX||window.__RHCTX));}catch(er){warn('hit',er);}};
frontArc=function(){return {layer:'none',update:()=>false,draw(){}};};
/* stagger BREAK */
function breakFx(e){const x=e.x,y=e.y,z=zOf(e)+(e.boss?12:6),S=S1();hpic('r09_break',e,e.boss?150:110,{life:.5,s0:.4,s1:1.1,pop:.12,z,glow:.8,rot:0});ring('copper',x,y,e.boss?90:62,{w0:8,life:.4});ring('gold',x,y,e.boss?60:40,{w0:4,delay:.05,life:.32});
  bits(S,'copper',x,y,z,10,{size:1.1});bits(S,'stone',x,y,8,6,{size:1});glints(S,CU[3],x,y,z,5,26,.5);}
{const SG=rhStg;rhStg=function(e,amt){const im=e&&e.stgImm||0;RV.tk++;let r;try{r=SG.apply(this,arguments);}finally{RV.tk--;}try{if(e&&!e.dead&&(e.stgImm||0)>im)breakFx(e);}catch(er){warn('brk',er);}return r;};}

/* ---------------------------------------------------------------------
   5. ground pieces, slams, plates
   --------------------------------------------------------------------- */
function iceSpikes(x,y,R,n,h,life,o){o=o||{};for(let i=0;i<n;i++){const an=(o.a0||0)+i/n*TAU+R_(-.15,.15),rr=R*R_(.85,1.05);A(new Spike({el:'glacier',x:x+Math.cos(an)*rr,y:y+Math.sin(an)*rr*.9,h:h*R_(.65,1),w:h*.34,lean:Math.cos(an)*.3,life:life||1.1,rise:.1,sink:.25,delay:(o.d||0)*i}));}}
function slamB(x,y,R,o){o=o||{};const S=S1();dark(x,y,R*.4,1.6,.32);crackP(x,y,R*2);shock(x,y,R*2.1);if(!o.noErupt)erupt(x,y-14,Math.min(160,R*.95),{sortOff:-20});ring('copper',x,y,R,{w0:12,life:.42});ring('stone',x,y,R*.7,{w0:6,delay:.06,life:.34});lite('copper',x,y,R*.9,.45,.55);
  A(new Flash({el:'copper',x,y,z:14,s0:24,s1:110,life:.2}));bits(S,'stone',x,y,6,14,{up:1.3,size:1.2});bits(S,'copper',x,y,10,8,{up:1});dust({},x,y,R*.5,8,34,20);}
function slamA(x,y,R,o){o=o||{};const S=S1();dark(x,y,R*.38,1.4,.28);pulse(x,y,R*2);shock(x,y,R*2.1,{delay:.04});ring('glacier',x,y,R,{w0:12,life:.45});ring('iron',x,y,R*.72,{w0:6,delay:.06,life:.36});lite('glacier',x,y,R,.5,.6);
  if(o.spikes!==0)iceSpikes(x,y,R*.62,o.spikes||8,30,1.1);A(new Flash({el:'glacier',x,y,z:14,s0:24,s1:110,life:.2}));bits(S,'glacier',x,y,10,12,{up:1.2,size:1.1});dust({},x,y,R*.5,8,34,20);}
function plateBurst(x,y,n){const S=S1();for(let i=0;i<qn(n);i++){const an=i/n*TAU+R_(-.2,.2),v=R_(160,280);S.add({im:spr('rxPlate','iron'),x:x+Math.cos(an)*26,y:y+Math.sin(an)*20,z:R_(16,40),vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:R_(140,260),g:640,dr:.9,s0:R_(11,15),life:R_(.8,1.2),rot:R_(0,TAU),vr:R_(-10,10),bounce:.3,fo:.3});}}
/* the shadow of something heavy about to land + a ring closing on the spot */
function dropMark(x,y,R,T){FN({layer:'ground',x,y,life:T+.06,fi:.05,fo:.06,d(q){const e=eI(cl(q.t/T,0,1)),s=P(x,y,0),r=R*(.35+.65*e),f=q.fade();ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.globalAlpha*=.5*e*f;ctx.drawImage(tex('pool','#0a0c12'),-r,-r,r*2,r*2);
    ctx.globalAlpha=f*(.4+.5*e);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=CU[3];ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,R*(1.6-1.1*e),0,TAU);ctx.stroke();ctx.restore();}});}
/* iron tower-shield plates standing on an arc round the hero (two halves so the back ones are behind him) */
class Plates extends RP{constructor(o){super(o,{layer:'sorted',life:99,n:3,arc:1.5,R:32,h:44,half:1,fixed:null,cren:0,fo:.2});}
  get sy(){return player.y+(this.half<0?-3:3);}
  paint(){const a=cl(this.t/.08,0,1)*cl((this.life-this.t)/this.fo,0,1),phi0=this.fixed!=null?this.fixed:player.phi,hk=HK(),n=this.n,st=this.arc/n,im=spr('rxPlate','iron'),act=this.act,
      gold=act&&act.t<act.perfect&&!act.ended,fl=cl(1-(gameTime-(RV.plateHit||-9))/.22,0,1);if(a<=.01)return;
    for(let i=0;i<n;i++){const an=phi0-this.arc/2+(i+.5)*st,sn=Math.sin(an);if((sn<0)!==(this.half<0))continue;const kd=cl((this.t-i*.035)/.16,0,1);if(kd<=0)continue;
      const R=this.R*hk,x=player.x+Math.cos(an)*R,y=player.y+Math.sin(an)*R,q=P(x,y,(1-back(kd))*40),w=this.h*hk*.8*(this.cren&&i%2?.82:1),h=w*im.height/im.width,sx=Math.max(.3,Math.abs(sn));
      ctx.save();ctx.globalAlpha*=a*Math.min(1,kd*2);ctx.translate(q[0],q[1]);if(gold)glowAt(0,-h*.5,w*.9,CU[3],.55+.25*Math.sin(gameTime*30));ctx.scale(sx,1);ctx.drawImage(im,-w/2,-h*.97,w,h);
      if(fl>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=fl*.7;ctx.drawImage(im,-w/2,-h*.97,w,h);}ctx.restore();}}}
const plates=o=>[A(new Plates(Object.assign({},o,{half:-1}))),A(new Plates(Object.assign({},o,{half:1})))];
/* an afterimage of the hero's current frame */
class Echo extends RP{constructor(o){super(o,{layer:'sorted',life:.22,sortOff:-1});const e=playerFrame();this.e={st:e.st,d:e.d,f:e.f};this.x=player.x;this.y=player.y;this.z=player.z||0;this.col=pal(this.pl||'copper')[2];}
  paint(){if(typeof drawFrame!=='function'||typeof tinted!=='function')return;const k=this.t/this.life,q=P(this.x,this.y,this.z);ctx.save();if(CHAR_SCALE!==1){ctx.translate(q[0],q[1]);ctx.scale(CHAR_SCALE,CHAR_SCALE);ctx.translate(-q[0],-q[1]);}
    ctx.globalCompositeOperation='lighter';drawFrame(this.e,q[0],q[1],.4*(1-k),null,tinted(this.e,this.col));ctx.restore();}}
const echo=(pl,life)=>A(new Echo({pl,life}));
/* force jaws closing round a grabbed enemy */
function jaws(e,life){FN({layer:'top',life,fi:.02,fo:.15,d(q){if(e.dead)return;const kk=back(cl(q.t/.12,0,1)),s=P(e.x,e.y,zOf(e)),R=((e.r||16)+16)*(1.5-.5*kk),f=q.fade();ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,.8);ctx.lineCap='round';
    for(const s0 of [0,Math.PI]){for(const [lw,c] of [[11,rgba(CU[0],.4)],[6.5,CU[1]],[3.6,CU[2]],[1.4,CU[4]]]){ctx.globalAlpha=f;ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.arc(0,0,R,s0-1.05,s0+1.05);ctx.stroke();}
      for(const d of [-1,1]){const an=s0+d*1.05,x=Math.cos(an)*R,y=Math.sin(an)*R;ctx.fillStyle=IR[4];ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an)*9,y-Math.sin(an)*9+d*3);ctx.lineTo(x-Math.cos(an+d*.4)*5,y-Math.sin(an+d*.4)*5);ctx.closePath();ctx.fill();}}
    ctx.restore();glowAt(s[0],s[1],R*1.2,CU[2],.3*f);}});}

/* ---------------------------------------------------------------------
   6. per skill (extra events on each action — the game's own events and numbers are untouched)
   --------------------------------------------------------------------- */
/* which blow each punching skill throws: kind, smear palette, code-fist variant (0 iron · 1 glacier spirit · 2 copper-hot · 3 crimson), width */
const FK={basic:['jab','glacier',1,36],rhCounter:['heavy','copper',2,48],rhCrusher:['heavy','iron',1,48],rhCrushCounter:['heavy','glacier',1,58],rhRevenge:['revenge','rage',3,52],
  rhKnuckle:['heavy','copper',2,48],rhHammer:['hammer','copper',2,34],rhUppercut:['upper','copper',2,42],rhTitan:['jab','copper',2,40],rhMeteor:['meteor','rage',2,56],
  rhBone:['heavy','iron',1,48],rhRush:['jab','copper',2,38],rhAvalanche:['jab','glacier',1,32],rcGrip:['heavy','glacier',1,48]};
const HOLDPAL={rhCounter:'copper',rhCrushCounter:'glacier',rhKnuckle:'copper',rhHammer:'copper',rhBone:'iron',rcGrip:'glacier',rhCrusher:'iron'};
function punchFists(o,a){const n=o.n||1,f=FK[o.key]||FK.basic,tcs=a.events.slice(0,n).map(e=>e.t);let prev=0;
  for(let i=0;i<tcs.length;i++){const tC=tcs[i],gap=i?tC-prev:tC,lead=Math.min(.075,Math.max(.03,gap/TEMPO()*.85)),last=i===n-1;prev=tC;
    let kind=f[0],w=f[3];if(o.key==='rhTitan'&&last){kind='hammer';w=36;}if((o.key==='rhRush'||o.key==='rhAvalanche')&&last&&n>1){kind='heavy';w=f[3]*1.3;}
    const side=n>1&&kind==='jab'?(i%2?-1:1)*8*HK():0,jit=o.key==='rhAvalanche'&&!last;
    pre(a,tC,lead,L=>fist({kind,v:f[2],w:w*HK(),pl:f[1],T:L,to:coneTarget(o.phi,(o.range||80)*1.3,Math.min(1.4,(o.half||.75)*1.25)),side,ph:o.phi,jit,reach:(o.range||80)*1.05}));}
  if(o.windHold&&HOLDPAL[o.key]&&tcs.length)gatherT(HOLDPAL[o.key],tcs[0]/TEMPO()-.05);}
function punchAfter(o,a,hit,i,last){const k=o.key,phi=o.phi,e=hit&&hit[0];if(!last)return;
  if(k==='rhCrusher'||k==='rhBone'){for(const t of hit)hpic('r10_armorcrack',t,76,{life:.5,z:topZ(t),pop:.1,glow:.4,rot:0});if(k==='rhBone'&&e)crackP(e.x,e.y,110,{life:1.1});if(e)bits(S1(),'iron',e.x,e.y,zOf(e),8,{dir:phi,spread:1.2});}
  else if(k==='rhHammer'&&e){for(const sd of [-1,1])A(new Streak({el:'copper',x:e.x-Math.cos(phi+sd*1.3)*54,y:e.y-Math.sin(phi+sd*1.3)*54,x2:e.x,y2:e.y,z:34,z2:zOf(e),w:9,life:.22,go:.5,head:0}));crackP(e.x,e.y,90,{life:.9});}
  else if(k==='rhUppercut'&&e){A(new Streak({el:'glacier',x:e.x,y:e.y,x2:e.x,y2:e.y,z:0,z2:120,w:16,life:.3,go:.45,head:0}));bits(S1(),'stone',e.x,e.y,4,7,{up:1.6,sp:.6});puffs(sys('sorted',e.y+1),F.dust(),e.x,e.y,2,3,26,40,30,.5);}
  else if(k==='rhTitan'&&e){crackP(e.x,e.y,120,{life:1.2});erupt(e.x,e.y,80,{life:.5});bits(S1(),'stone',e.x,e.y,6,8,{up:1.2});}
  else if(k==='rhMeteor'&&e){ring('rage',e.x,e.y,80,{w0:12,life:.42});burst('rage',e.x,e.y,zOf(e),1.3,{n:12});shock(e.x,e.y,200,{life:.5});}
  else if(k==='rhRevenge'&&e){ring('rage',e.x,e.y,70,{w0:10,life:.4});burst('rage',e.x,e.y,zOf(e),1.1,{n:11});bits(S1(),'rage',e.x,e.y,zOf(e),8,{dir:phi,spread:1});}
  else if(k==='rhCrushCounter'){const x=player.x,y=player.y;for(let j=0;j<3;j++)A(new Wave({el:'glacier',x,y,phi,dist:130+j*30,r:30+j*8,w:12-j*2,life:.36+j*.05,delay:j*.04,z:16}));if(LV.rcReflection&&e){ring('glacier',e.x,e.y,80,{w0:10,life:.4});pulse(e.x,e.y,170,{life:.5});}}
  else if((k==='rhCounter'||k==='rhRush')&&e)ring('copper',e.x,e.y,58,{w0:7,life:.34});
  else if(k==='rhAvalanche'&&e){ring('glacier',e.x,e.y,64,{w0:8,life:.36});const S=S1();for(let j=0;j<qn(10);j++){const an=phi+R_(-.8,.8),v=R_(120,240);S.add({im:spr('snow','glacier',j),x:e.x,y:e.y,z:zOf(e),vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:R_(40,140),g:200,dr:2,s0:R_(7,12),life:R_(.5,.8),rot:R_(0,TAU),vr:R_(-4,4),fo:.4});}}}
{const RP0=rhPunches;rhPunches=function(o){const a=RP0.apply(this,arguments);try{if(a&&a.events){punchFists(o,a);const af=o.after;o.after=function(a2,hit,i,last){const r=af?af.apply(this,arguments):undefined;try{punchAfter(o,a2,hit,i,last);}catch(er){warn('pa',er);}return r;};}}catch(e){warn('punch',e);}return a;};}

/* charges: a bow wave and a snow wake, the dust trail (r29) or the glacier wedge (r26) carried along, the stop */
function bowWave(ice,life){const p=pal(ice?'glacier':'cloud');FN({layer:'top',life,fi:.04,fo:.1,d(q){const c=Math.cos(player.phi),s=Math.sin(player.phi),hk=HK(),sc=P(player.x+c*26*hk,player.y+s*26*hk,18*hk),f=q.fade(),W=32*hk*(1+.08*Math.sin(q.t*30));
    ctx.save();ctx.translate(sc[0],sc[1]);ctx.rotate(scrAng(player.phi));ctx.globalAlpha*=f;for(const [k,col] of [[1.15,rgba(p[0],.3)],[1,rgba(p[1],.75)],[.72,p[2]],[.42,p[3]],[.18,p[4]]]){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-10*k,-W*k);ctx.quadraticCurveTo(18*k,0,-10*k,W*k);ctx.quadraticCurveTo(4*k,0,-10*k,-W*k);ctx.fill();}ctx.restore();}});}
function dashStart(ice,phi,T){const x=player.x,y=player.y,hk=HK(),r=scrAng(phi),fl=Math.cos(r)<-.01;gpic('r16_dust',x,y,110*hk,{life:.6,s0:.6,s1:1.1,a:.9});
  if(ice){pic({n:'r26_glacier',follow:player,z:28*hk,w:118*hk,ax:.42,ay:.5,rot:r,flipY:fl,life:T+.3,s0:.85,s1:1,fi:.05,fo:.3,glow:.4});orbit({im:spr('rxIce','glacier'),follow:player,n:5,r:22*hk,z:34*hk,spin:9,life:T+.3,w:12,glow:G[2]});}
  else pic({n:'r29_trail',follow:player,z:14*hk,w:150*hk,ax:.95,ay:.62,rot:r,flipY:fl,life:T+.35,s0:.9,s1:1,fi:.05,fo:.35});
  bowWave(ice,T+.05);}
function chargeEnd(ice,phi){const x=player.x,y=player.y,hk=HK(),S=S1();if(ice){iceBurst(x+Math.cos(phi)*20*hk,y+Math.sin(phi)*20*hk,124*hk);bits(S,'glacier',x,y,20*hk,12,{sp:1.3,up:1.1});A(new Disc({x,y,r0:30,r1:56,life:1.6,kind:'pool',add:0,a:.4,col:G[3],fi:.05,fo:.8}));}
  else{gpic('r16_dust',x,y,120*hk,{life:.65,s0:.7,s1:1.15,a:.9});ring('iron',x,y,50,{w0:6,life:.3});}dust({},x,y,20,6,26);}
{const RC0=rhCharge;rhCharge=function(o){const ice=o.key==='rcGlacier',phi=o.phi,T=o.T||.3,oh=o.onHit,en=o.end;
  o.onHit=function(a,e){const r=oh?oh.apply(this,arguments):undefined;try{if(ice&&e)iceSpikes(e.x,e.y,28,6,24,1.1);}catch(er){}return r;};
  o.end=function(a){const r=en?en.apply(this,arguments):undefined;try{chargeEnd(ice,phi);}catch(er){warn('ce',er);}return r;};
  const a=RC0.call(this,o);try{if(a){const t0=a.windup,t1=t0+T;at(a,t0,()=>dashStart(ice,phi,T/TEMPO()));const u=a.update;let acc=0;
      a.update=function(a2,dt){if(u)u.apply(this,arguments);if(a2.t<t0||a2.t>t1)return;acc+=dt;if(acc>.03){acc=0;const c=Math.cos(phi),s=Math.sin(phi);puffs(sys('sorted',player.y+1),F.dust(),player.x-c*10,player.y-s*10,2,1,22,30,14,.45);if(ice)bits(S1(),'glacier',player.x,player.y,10,1,{only:1,sp:.6});}};}}catch(er){warn('cr',er);}return a;};}

/* ground slams (the game's rhSlam): the look of each impact */
function slamOf(key,x,y){if(key==='rhShaker'){slamB(x,y,145);if(LV.rcAvalancheChain)after(.45,()=>{shock(x,y,145*2.8,{life:.55});crackP(x,y,145*2.4,{life:1});erupt(x+R_(-50,50),y+R_(-20,20),120);erupt(x+R_(-50,50),y+R_(-20,20),110,{delay:.06});ring('copper',x,y,200,{w0:12,life:.45});bits(S1(),'stone',x,y,6,10,{up:1.3});});}
  else if(key==='rhQuake'){slamA(x,y,150,{spikes:6});shock(x,y,185*2.2,{delay:.12,life:.6});A(new Crack({el:'glacier',x,y,r:120,n:8,life:1.4,w:3.2}));bits(S1(),'stone',x,y,6,8,{up:1.2});}
  else if(key==='rhRetribution'){slamA(x,y,120,{spikes:8});plateBurst(x,y,10);}}
{const SL=rhSlam;rhSlam=function(o){const key=o.key,imp=o.impact;if(imp)o.impact=function(a,x,y){const r=imp.apply(this,arguments);try{slamOf(key,x,y);}catch(e){warn('slam',e);}return r;};return SL.apply(this,arguments);};}

/* the buffs and the skills with their own action */
function roarFx(){const x=player.x,y=player.y,hk=HK(),sd=sideOf(),S=S1();
  if(img('rx_roar'))spic('rx_roar',x,y,150*hk,{z:24*hk,follow:player,ox:sd*14*hk,oy:-2,flip:sd<0,life:.9,pop:.14,fo:.4,sortOff:-4});
  else spic('r35_spirit',x,y,94*hk,{z:44*hk,follow:player,oy:-4,life:.8,pop:.14,fo:.4,sortOff:-6,a:.85});
  spic('r31_roar',x,y,138*hk,{follow:player,life:.5,pop:.1,fo:.3,sortOff:-5,a:.8});shock(x,y,240*hk);ring('copper',x,y,150,{w0:10,life:.5});ring('glacier',x,y,110,{w0:6,delay:.08,life:.45});
  const D=F.dust();for(let i=0;i<qn(14);i++){const an=i/14*TAU+R_(-.2,.2),v=R_(160,260);S.add({im:spr('puff',D,i),x:x+Math.cos(an)*18,y:y+Math.sin(an)*12,z:6,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.6,vz:16,dr:3,s0:12,s1:30,life:R_(.45,.7),fi:.04,fo:.55,a0:.8});}
  glints(S,CU[3],x,y,40*hk,6,30,.6);}
function skinFx(){const x=player.x,y=player.y,hk=HK(),S=S1();spic('r24_ironskin',x,y,104*hk,{follow:player,oy:-2,sortOff:-8,life:.9,pop:.14,fo:.45,a:.8,glow:.5});ring('iron',x,y,56,{w0:6,life:.4});
  for(let i=0;i<qn(9);i++){const an=R_(0,TAU),d=R_(50,80)*hk;S.add({im:spr('rxPlate','iron'),x:x+Math.cos(an)*d,y:y+Math.sin(an)*d*.6,z:R_(10,60)*hk,to:{x,y,z:R_(14,50)*hk},s0:12*hk,s1:7*hk,lin:1,life:R_(.2,.3),delay:i*.025,rot:R_(-.6,.6),vr:R_(-6,6),fo:.2});}
  glints(S,IR[4],x,y,30*hk,7,22,.6);}
function stanceCast(){const x=player.x,y=player.y,hk=HK();ring('iron',x,y,60,{w0:7,life:.4});dust({},x,y,16,5,22);
  if(LV.rcFrozenBastion){spic('r27_bastion',x,y,124*hk,{follow:player,oy:4,life:.9,pop:.14,fo:.45,a:.55,glow:.4});iceSpikes(x,y,36*hk,6,22,1.2);ring('glacier',x,y,70,{w0:6,delay:.06,life:.45});}}
function wallCast(){const hk=HK(),x=player.x+Math.cos(player.phi)*40*hk,y=player.y+Math.sin(player.phi)*40*hk;dust({},x,y,20,6,26);ring('iron',x,y,50,{w0:6,life:.35});bits(S1(),'glacier',x,y,10,5,{up:.8});}
function pulseFx(){const x=player.x,y=player.y,hk=HK(),S=S1();pulse(x,y,280);spic('r21_bubble',x,y,110*hk,{follow:player,oy:6,life:.8,pop:.12,fo:.4,a:.6,glow:.5});ring('glacier',x,y,130,{w0:10,life:.5});ring('glacier',x,y,100,{w0:6,delay:.1,life:.45});
  for(let i=0;i<qn(12);i++){const an=i/12*TAU;S.add({im:spr('puff','cloud',i),x:x+Math.cos(an)*20,y:y+Math.sin(an)*14,z:6,vx:Math.cos(an)*200,vy:Math.sin(an)*120,vz:12,dr:3.2,s0:10,s1:26,life:.5,fo:.5,a0:.75});}}
function revengeCharge(a){const T=(a.events&&a.events[0]?a.events[0].t:a.windup||.2)/TEMPO();if(T<.06)return;const S=S1();
  FN({layer:'top',life:T,fi:.06,fo:.05,d(q,k){const hd=hand(),m=P(hd[0],hd[1],hd[2]),hk=HK(),r=(10+8*k)*hk,f=q.fade();ctx.save();ctx.translate(m[0],m[1]);ctx.lineCap='round';
    for(let i=0;i<3;i++){const a0=q.t*12+i*TAU/3;for(const [lw,c] of [[5,rgba(RA[0],.4)],[3.2,RA[1]],[1.6,RA[3]]]){ctx.lineWidth=lw*hk;ctx.strokeStyle=c;ctx.globalAlpha=f;ctx.beginPath();ctx.ellipse(0,0,r,r*.55,0,a0,a0+1.9);ctx.stroke();}}
    ctx.restore();glowAt(m[0],m[1],r*2.4,RA[2],.6*f);coreAt(m[0],m[1],r*.7,RA[2],.8*f);}});
  A(new Emit({life:Math.max(.05,T-.03),every:.035,fn(){const hd=hand(),an=R_(0,TAU),d=R_(26,44)*HK();S.add({im:spr('ember','rage'),x:hd[0]+Math.cos(an)*d,y:hd[1]+Math.sin(an)*d*.6,z:hd[2]+R_(-14,20),to:{x:hd[0],y:hd[1],z:hd[2]},s0:R_(7,10),s1:3,lin:1,life:R_(.14,.22),fo:.1});}}));}
function tauntMark(e){A(new Spr({im:spr('exclaim','rage'),follow:e,z:topZ(e)+6,w:12,life:.9,pop:.14,s0:.3,s1:1,fo:.3,layer:'top',bob:2}));
  FN({layer:'top',life:.6,fi:.04,fo:.35,d(q,k){if(e.dead)return;const a=P(e.x,e.y,zOf(e)),b=P(player.x,player.y,40*HK()),f=q.fade(),g=eO(Math.min(1,k*3));ctx.save();ctx.globalAlpha*=f*.85;ctx.setLineDash([7,6]);ctx.lineDashOffset=-q.t*90;ctx.lineWidth=2.2;ctx.strokeStyle=RA[2];
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(lerp(a[0],b[0],g),lerp(a[1],b[1],g));ctx.stroke();ctx.restore();}});}
function fortressCast(){const x=player.x,y=player.y,hk=HK();pic({n:'r33_emblem',follow:player,z:96*hk,w:72*hk,life:1.3,s0:.3,s1:1,pop:.16,fi:.06,fo:.45,glow:.8});ring('iron',x,y,90,{w0:10,life:.45});ring('copper',x,y,64,{w0:5,delay:.06,life:.38});dust({},x,y,22,8,28);
  for(const e of enemies){if(e.dead||dist(e,player)>320)continue;tauntMark(e);}}
function anchorCast(){const x=player.x,y=player.y;A(new Crack({el:'iron',x,y,r:46,n:7,life:1.6,w:3,hot:0}));dust({},x,y,18,6,24);bits(S1(),'stone',x,y,4,6,{up:.9});}
function colossusCast(){const x=player.x,y=player.y,hk=HK(),S=S1(),sd=sideOf();
  if(img('rx_titan'))spic('rx_titan',x,y,150*hk,{follow:player,ox:-sd*18*hk,oy:-6,flip:sd<0,life:1.5,pop:.18,fo:.6,a:.85,sortOff:-8});
  else spic('r24_ironskin',x,y,132*hk,{follow:player,oy:-3,sortOff:-10,life:1.1,pop:.16,fo:.5,a:.7,glow:.6});
  A(new Sigil({tex:ART.seal('frost','glacier'),el:'glacier',follow:player,r:70*hk,spin:.5,life:1.4,fi:.15,fo:.6}));ring('glacier',x,y,96,{w0:10,life:.5});ring('iron',x,y,70,{w0:6,delay:.08,life:.45});
  A(new Crack({el:'glacier',x,y,r:56,n:7,life:1.6,w:3,hot:1}));bits(S,'glacier',x,y,30*hk,8,{up:1});}
function furyCast(){const x=player.x,y=player.y,hk=HK();spic('r32_fury',x,y,118*hk,{follow:player,oy:2,life:.9,pop:.12,fo:.45,a:.9,sortOff:-2});ring('rage',x,y,80,{w0:8,life:.4});bits(S1(),'rage',x,y,30*hk,8,{up:1.1});}
function pactFx(a){const T=(a.windup||0)/TEMPO(),S=S1();if(T>.08)A(new Emit({life:T-.03,every:.03,fn(){const hd=hand(),an=R_(0,TAU),d=R_(36,70)*HK(),rd=Math.random()<.5;S.add({im:tex('core',rd?RA[2]:G[2]),x:player.x+Math.cos(an)*d,y:player.y+Math.sin(an)*d*.6,z:R_(10,60),to:{x:hd[0],y:hd[1],z:hd[2]},s0:R_(6,9),s1:2,lin:1,life:R_(.2,.32),add:1,str:1.3,fo:.1});}}));
  at(a,a.windup,()=>{const x=player.x,y=player.y,hd=hand();ring('rage',x,y,70,{w0:8,life:.4});ring('glacier',x,y,70,{w0:5,delay:.08,life:.4});flash('rage',hd[0],hd[1],hd[2],.9);});}
function absoluteFx(a){const G0=1.2,tS=a.windup,hk=HK();
  at(a,.02,()=>{const x=player.x,y=player.y;gpic('r34_sigil',x,y,250,{follow:player,life:tS/TEMPO()+.3,s0:.3,s1:1,pop:.2,fo:.3,glow:.4,a:.85});if(!(typeof vfxArt==='function'&&vfxArt('fortress')))spic('r21_bubble',x,y,150*hk,{follow:player,oy:8,life:G0/TEMPO()+.2,pop:.16,fo:.25,a:.45,sortOff:12});ring('glacier',x,y,120,{w0:8,life:.5});});
  at(a,G0,()=>{const x=player.x,y=player.y;flash('glacier',x,y,34*hk,1.3);ring('glacier',x,y,70,{w0:8,life:.3});bits(S1(),'glacier',x,y,30*hk,14,{sp:1.4,up:1.1});});
  at(a,tS,()=>{const x=player.x,y=player.y;slamA(x,y,240,{spikes:0});iceSpikes(x,y,220,18,44,1.4);crater(x,y,380,{life:2});plateBurst(x,y,12);
    for(let k=1;k<=6;k++)after(.18*k,()=>{const px=player.x,py=player.y;ring(k%2?'glacier':'iron',px,py,260,{w0:9,life:.36});shock(px,py,520,{life:.4,a:.6});if(k%2)bits(S1(),'stone',px,py,6,5,{sp:1.6});});});}
function meteorFx(a){const tC=a.events&&a.events[0]?a.events[0].t:.3;gatherT('rage',tC/TEMPO()-.05);at(a,.22,()=>{RV.mS=[player.x,player.y];});
  at(a,.22,()=>{const x=player.x,y=player.y;puffs(sys('sorted',y+1),F.dust(),x,y,2,3,24,60,16,.5);bits(S1(),'rage',x,y,20*HK(),4,{sp:.8});});
  A(new Emit({life:(tC+.02)/TEMPO(),every:.04,fn(){if(player.action&&player.action.t>.22)echo('rage',.2);}}));}
function rushFx(a){A(new Emit({life:.16/TEMPO(),every:.03,fn(){echo('copper',.24);puffs(sys('sorted',player.y+1),F.dust(),player.x,player.y,2,1,22,40,14,.4);}}));
  at(a,0,()=>{RV.rS=[player.x,player.y];});at(a,.16,()=>{const p0=RV.rS;if(p0&&Math.hypot(player.x-p0[0],player.y-p0[1])>10)A(new Streak({el:'copper',x:p0[0],y:p0[1],x2:player.x,y2:player.y,z:22*HK(),w:14,life:.28,go:.4,head:0}));});}
function seismicFx(a,c){const q=(c.action&&c.action.quake)||{x:player.x,y:player.y};
  at(a,a.windup,()=>{crackP(q.x,q.y,220,{life:.8});ring('copper',q.x,q.y,60,{w0:6,life:.3});
    after(.18,()=>{const x=q.x,y=q.y,S=S1();for(let i=0;i<6;i++){const an=i/6*TAU+.5;erupt(x+Math.cos(an)*62,y+Math.sin(an)*46,62,{life:.5,delay:i*.02});}ring('copper',x,y,120,{w0:14,life:.45});shock(x,y,280);dark(x,y,50,1.2,.3);bits(S,'stone',x,y,6,14,{up:1.4,size:1.2});bits(S,'copper',x,y,10,8);dust({},x,y,50,8,32,20);});});}
function avalancheFx(a){const phi=player.phi;A(new Emit({life:(a.dur||.8)/TEMPO(),every:.035,fn(){const S=S1(),c=Math.cos(phi),s=Math.sin(phi),d=R_(20,60);S.add({im:spr('snow','glacier',(Math.random()*2)|0),x:player.x+c*d+R_(-14,14),y:player.y+s*d+R_(-10,10),z:R_(14,40)*HK(),vx:c*R_(140,260),vy:s*R_(140,260),vz:R_(-10,20),dr:2,s0:R_(6,10),life:R_(.3,.5),rot:R_(0,TAU),vr:R_(-5,5),fo:.4});}}));}
function finaleFx(a,c){const t=rtgt(c,120);if(!t)return;const tx=t.x,ty=t.y;at(a,.05,()=>{RV.finHit=gameTime+Math.max(.05,(a.windup-.05)/TEMPO());});
  at(a,a.windup,()=>{slamB(tx,ty,100,{noErupt:1});crater(tx,ty,230);erupt(tx,ty,150);});}
function skyFx(a,c){const gx=c.gx??player.x+Math.cos(player.phi)*120,gy=c.gy??player.y+Math.sin(player.phi)*120,tL=a.windup;
  at(a,0,()=>{const x=player.x,y=player.y;ring('iron',x,y,44,{w0:6,life:.3});dust({},x,y,24,8,28,20);bits(S1(),'stone',x,y,4,5,{up:1.2});});
  at(a,.05,()=>dropMark(gx,gy,90,Math.max(.05,(tL-.05)/TEMPO())));
  at(a,tL,()=>{slamB(gx,gy,140);crater(gx,gy,300);flash('copper',gx,gy,20,1.6);});}
function worldFx(a,c){const gx=c.gx,gy=c.gy,tL=a.windup,hk=HK(),sx=player.x,sy=player.y;let tC=tL*.6;for(const e of a.events)if(e.t>.8&&e.t<tL-.05){tC=e.t;break;}
  A(new Emit({life:tC/TEMPO(),every:.06,fn(){const S=S1(),an=R_(0,TAU),d=R_(50,90)*hk;S.add({im:spr('rock','stone',(Math.random()*3)|0),x:sx+Math.cos(an)*d,y:sy+Math.sin(an)*d*.7,z:2,vz:R_(40,80),g:-20,dr:1,s0:R_(6,11),life:R_(.5,.8),rot:R_(0,TAU),vr:R_(-3,3),fo:.4});
    puffs(sys('sorted',sy+1),F.dust(),sx+Math.cos(an)*d,sy+Math.sin(an)*d*.7,2,1,26,30,10,.5);}}));
  at(a,.35,()=>crackP(sx,sy,130,{life:1.4}));at(a,.7,()=>{crackP(sx,sy,220,{life:1.2});ring('copper',sx,sy,70,{w0:6,life:.35});bits(S1(),'stone',sx,sy,4,6,{up:1.2});});
  at(a,tC,()=>{dust({},sx,sy,30,10,36,22);ring('copper',sx,sy,90,{w0:8,life:.4});});
  at(a,tC+.05,()=>dropMark(gx,gy,150,Math.max(.05,(tL-tC-.05)/TEMPO())));
  at(a,tL,()=>{const x=gx,y=gy,S=S1();crater(x,y,560,{life:2.6});slamB(x,y,200,{noErupt:1});for(const [dx,dy,w] of [[0,8,190],[-70,-10,130],[70,-6,130]])erupt(x+dx,y+dy,w,{delay:R_(0,.05)});lite('copper',x,y,260,.6,.8);bits(S,'stone',x,y,8,20,{sp:1.8,up:1.4,size:1.4});});
  [100,150,200,250,280].forEach((r,i)=>at(a,tL+i*.16,()=>{shock(gx,gy,r*2.2,{life:.5});ring(i%2?'copper':'white',gx,gy,r,{w0:Math.max(6,16-i*2.5),life:.42});if(i)bits(S1(),'stone',gx,gy,4,5,{sp:1.5});}));}
function gripFx(a,c){const t=rtgt(c,110);if(!t)return;const tC=a.events&&a.events[0]?a.events[0].t:a.windup;
  at(a,tC,()=>{if(t.dead)return;jaws(t,t.boss?.3:.62);if(t.boss)return;after(.55,()=>{if(!t.dead)A(new Streak({el:'copper',x:t.x,y:t.y,x2:t.x,y2:t.y,z:220,z2:10,w:12,life:.18,go:.5,head:0}));});
    after(.69,()=>{if(t.dead)return;const x=t.x,y=t.y;crater(x,y,170,{life:1.6});slamB(x,y,70,{noErupt:1});erupt(x,y,100);});});}
function totemFx(a,c){const gx=c.gx??player.x,gy=c.gy??player.y;at(a,a.windup,()=>{const S=S1();RV.monoC=[gx,gy];A(new Crack({el:'glacier',x:gx,y:gy,r:90,n:8,life:1.6,w:3.4,hot:1}));pulse(gx,gy,220);ring('glacier',gx,gy,110,{w0:10,life:.5});dust({},gx,gy,40,10,34,20);bits(S,'glacier',gx,gy,10,10,{up:1.2});});}
const GPAL={rhRoar:'copper',rhSkin:'iron',rhStance:'iron',rhWall:'iron',rhPulse:'glacier',rhFortress:'iron',rhAnchor:'iron',rhColossus:'glacier',rhFury:'rage',rcPact:'rage',rhAbsolute:'glacier',
  rhSkybreaker:'copper',rhWorldbreaker:'copper',rhRetribution:'glacier',rhQuake:'glacier',rhShaker:'copper',rhSeismic:'copper',rhFinale:'copper',rcTotem:'glacier',rhCharge:'iron',rcGlacier:'glacier'};
const HKS={
  rhGuard(a){at(a,.01,()=>plates({n:3,arc:1.6,R:30,h:46,act:a,until:()=>player.action===a&&!a.ended}));},
  rhRoar(a){at(a,a.windup,roarFx);},rhSkin(a){at(a,a.windup,skinFx);},rhStance(a){at(a,a.windup,stanceCast);},rhWall(a){at(a,a.windup,wallCast);},rhPulse(a){at(a,a.windup,pulseFx);},
  rhRevenge(a){revengeCharge(a);},rhFortress(a){at(a,a.windup,fortressCast);},rhAnchor(a){at(a,a.windup,anchorCast);},rhColossus(a){at(a,a.windup,colossusCast);},rhAbsolute(a){absoluteFx(a);},
  rhMeteor(a){meteorFx(a);},rhRush(a){rushFx(a);},rhSeismic(a,c){seismicFx(a,c);},rhAvalanche(a){avalancheFx(a);},rhFinale(a,c){finaleFx(a,c);},rhFury(a){at(a,a.windup,furyCast);},
  rhSkybreaker(a,c){skyFx(a,c);},rhWorldbreaker(a,c){worldFx(a,c);},rcGrip(a,c){gripFx(a,c);},rcPact(a){pactFx(a);},rcTotem(a,c){totemFx(a,c);}};
for(const k in SKILLS){const s=SKILLS[k];if(!s||!s.make||s._rv)continue;const mk=s.make;s._rv=1;s.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events){try{const pl=GPAL[k];if(pl&&a.seq&&a.seq[0]&&a.seq[0].st==='buff')gather(a,pl);if(HKS[k])HKS[k](a,c||{});}catch(e){warn(k,e);}}return a;};}
{const MB=mkBasic;mkBasic=function(tgt){const a=MB.apply(this,arguments);try{if(a&&a.events){const fin=/Finish/.test(a.name||''),tC=a.windup||0,phi=tgt?Math.atan2(tgt.y-player.y,tgt.x-player.x):player.phi,idx=player.basicIdx||0;
      pre(a,tC,Math.min(.075,tC/TEMPO()),L=>fist({kind:fin?'heavy':'jab',v:fin?2:1,w:(fin?48:36)*HK(),pl:fin?'copper':'glacier',T:L,to:tgt,ph:phi,side:fin?0:(idx%2?-1:1)*7*HK(),reach:84}));}}catch(e){warn('basic',e);}return a;};}

/* ---------------------------------------------------------------------
   7. the game's own pieces → the new ones
   --------------------------------------------------------------------- */
const DROP=new Set(['SoftImpact','SoftRing','Fissure','GLight','PunchBurst','RhRing','Impact','GRing','StoneCrack','Crack','RhCrater','GroundShatter','RockSpire','Crystal','SnowSkid','FrostGround',
  'RockGeyser','LightPillar','RhSpeedLines','Ghost','RhForceLine','Streak','RhNoop','WindArc','AirRing','RoarWave','SoundArcs','TauntLines','StancePlate','ShoulderPlates','FrostPlates','BuffEmitter',
  'IronSeal','RuneCircle','BrushArc','GuardPlate']);
const NOFX=()=>({layer:'none',update:()=>false,draw(){},kill(){},add(){},active:false});
function exFx(f){const p=f.pos||[f.x,f.y,24],x=f.x!=null?f.x:p[0],y=f.y!=null?f.y:p[1];if(f.r1!=null)ring('copper',x,y,Math.max(40,f.r1||46),{w0:5,life:.4});else flash('copper',x,y,p[2]||24,.9);
  A(new Spr({im:spr('rxStud','copper'),follow:player,z:90*HK(),vz:20,w:14,life:.6,pop:.14,s0:.4,s1:1,fo:.3,layer:'top'}));}
function castSeal(f){const k=player.casting&&player.casting.key,pl=k==='rcTotem'?'glacier':'copper';return A(new Sigil({tex:ART.seal('iron',pl),el:pl,follow:player,r:46*HK(),spin:1.2,life:f.life||.5,fi:.15,fo:.2,a:.95}));}
{const A0=addFx;addFx=function(f){if(f&&!(f instanceof K_.Part)&&!(f instanceof K_.Sys)){const n=f.constructor&&f.constructor.name;
    if(n==='HitCrescents'||n==='PuffDust')return NOFX();
    if(f.color==='#ffe9a8'&&/Ring|Impact|PunchBurst/.test(n||'')){try{exFx(f);}catch(e){warn('ex',e);}return NOFX();}
    if(n==='IronSeal'&&f.color==='#6fc8ff'&&player.casting){try{return castSeal(f);}catch(e){warn('seal',e);}}
    if(n==='SteelWallObj'&&!Object.getOwnPropertyDescriptor(f,'sy')){f.layer='sorted';Object.defineProperty(f,'sy',{get:()=>player.y+Math.sin(player.phi)*40*HK()+1,configurable:true});}
    if(mine()&&DROP.has(n))return NOFX();}
  return A0.apply(this,arguments);};window.addFx=addFx;}
{const EM0=emit;emit=function(o){if(o&&mine()&&/^(round|spark|ember|dust|shard|frag|glint|mist|rock|rune|snow)$/.test(o.type))return;return EM0.apply(this,arguments);};window.emit=emit;}
/* a timer started by his skill keeps that skill's context, so its pieces are his look too */
{const ST0=setFxTimer;setFxTimer=function(sec,fn){if(typeof fn==='function'&&mine()){const k=window.SKCTX||window.__RHCTX||'rh',f0=fn;fn=function(){const pv=window.__RHCTX;window.__RHCTX=k;try{return f0.apply(this,arguments);}finally{window.__RHCTX=pv;}};}return ST0.call(this,sec,fn);};window.setFxTimer=setFxTimer;}

/* the giant spirit gauntlet (drop from the sky · thrust · held on the arm while charging) — its update carries hits, only the look changes */
const BAND=[ART.RXFIST.band[0]/ART.RXFIST.w,.5];
/* a giant spirit gauntlet: anchored at its knuckles (tip) or at its copper band (band: the hero's fist sits inside it) */
function bigFist(x,y,z,w,rot,v,a,fy,anc){const c=spr('rxFist','iron',v),h=w*c.height/c.width,s=P(x,y,z),q=anc||TIP;ctx.save();ctx.globalAlpha*=a;ctx.translate(s[0],s[1]);glowAt(0,0,w*.75,v===2?CU[2]:G[2],.5);ctx.rotate(rot);if(fy)ctx.scale(1,-1);
  ctx.globalAlpha*=.88;ctx.drawImage(c,-w*q[0],-h*q[1],w,h);ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.38;ctx.drawImage(c,-w*q[0],-h*q[1],w,h);ctx.restore();}
GiantFist.prototype.draw=guardDraw('giant',function(){const t=this.t,v=this._v||1;
  if(this.mode==='drop'){const k=cl(t/this.hitT,0,1),z=t<this.hitT?lerp(this.z0,6,eI(k)):6,a=t<this.hitT?Math.min(1,t/.08):Math.max(0,1-(t-this.hitT)/.12),w=300*(this.sc||.4)*HK();
    const gp=img('rx_giant');if(gp){const C=RXA.rx_giant,pw=w*C.k,ph=pw*gp.naturalHeight/gp.naturalWidth,s=P(this.x,this.y,z);ctx.save();ctx.globalAlpha*=a;ctx.drawImage(gp,s[0]-pw*C.tip[0],s[1]-ph*C.tip[1],pw,ph);ctx.restore();return;}
    const s=P(this.x,this.y,z);if(t<this.hitT){const p=pal(v===2?'copper':'glacier');smear(s[0],s[1]-w*1.9,s[0],s[1]-w*.5,w*.55,p,a*.9);}bigFist(this.x,this.y,z,w,Math.PI/2,v,a,0);}
  else if(this.mode==='thrust'){const k=cl(t/this.hitT,0,1),x=lerp(this.sx,this.x,eO(k)),y=lerp(this.sy,this.y,eO(k)),z=this.z||26,a=t<this.hitT?Math.min(1,t/.06):Math.max(0,1-(t-this.hitT)/(this.life-this.hitT)),w=420*(this.sc||.2)*HK(),
      s0=P(this.sx,this.sy,z),s1=P(x,y,z),ang=Math.atan2(s1[1]-s0[1],s1[0]-s0[0]);smear(lerp(s0[0],s1[0],.3),lerp(s0[1],s1[1],.3),s1[0],s1[1],w*.5,pal('glacier'),a*.85);bigFist(x,y,z,w,ang,1,a*(this.alpha||.9),Math.cos(ang)<-.01);}
  else{const h=hand(),a=Math.min(1,t/.2)*(t>this.life-.15?Math.max(0,(this.life-t)/.15):1),w=380*(this.sc||.2)*HK()*Math.min(1,.4+t/Math.max(.05,this.hitT)*.6),ang=scrAng(player.phi);bigFist(h[0],h[1],h[2]+4*HK(),w,ang,v,a*.9,Math.cos(ang)<-.01,BAND);}});
{const GU=GiantFist.prototype.update;GiantFist.prototype.update=function(dt){
    if(!this._rv){this._rv=1;const sk=this._sk||(player.action&&player.action.skill)||window.SKCTX||window.__RHCTX||'';this._v=(this.art==='worldbreaker'||sk==='rhSkybreaker'||(sk==='rhWorldbreaker'&&!this.onHit))?2:1;
      if(this.mode==='drop'&&!this.onHit&&sk==='rhFinale'&&RV.finHit>gameTime){this.hitT=Math.max(.05,RV.finHit-gameTime);this.life=this.hitT+.4;}
      if(this.mode==='drop'&&this.hitT>.1)dropMark(this.x,this.y,(this.sc||.4)*170,this.hitT);}
    const h0=this.hit;RV.tk++;let r;try{r=GU.call(this,dt);}finally{RV.tk--;}
    try{if(!h0&&this.hit){if(this.mode==='drop'){spic('r18_spiritfist',this.x,this.y,300*(this.sc||.4)*1.05*HK(),{life:.45,s0:.8,s1:1,pop:.08,fi:.001,fo:.3,sortOff:4});
        if(this.onHit){const x=this.x,y=this.y;crater(x,y,360);slamA(x,y,170,{spikes:10});lite('glacier',x,y,200,.6,.8);}}
      else if(this.mode==='thrust')ring('glacier',this.x,this.y,48,{w0:6,life:.3});}}catch(e){warn('gu',e);}return r;};}
/* Steel Wall: the iron wall (rx_wall, r20 until it comes) planted in front of him, flashing when it blocks */
SteelWallObj.prototype.draw=guardDraw('wall',function(){const im=img('rx_wall')||img('r20_wall');if(!im)return;const a=Math.min(1,this.t/.18)*(this.t>this.life-.2?Math.max(0,(this.life-this.t)/.2):1),hk=HK(),ph=player.phi,
    s=P(player.x+Math.cos(ph)*40*hk,player.y+Math.sin(ph)*40*hk,0),w=98*hk,h=w*im.naturalHeight/im.naturalWidth*(.35+.65*back(cl(this.t/.22,0,1)));
  ctx.globalAlpha*=a;ctx.fillStyle='rgba(8,14,26,.32)';ctx.beginPath();ctx.ellipse(s[0],s[1]+2,w*.5,w*.14,0,0,TAU);ctx.fill();ctx.drawImage(im,s[0]-w/2,s[1]-h*.94,w,h);
  if(this.flash>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*this.flash*.6;ctx.drawImage(im,s[0]-w/2,s[1]-h*.94,w,h);}});
/* Eternal Fortress: the frost seal on the ground while its zone lasts */
FortressZone.prototype.draw=guardDraw('zone',function(){const a=Math.min(1,this.t/.2)*(this.t>this.life-.6?Math.max(0,(this.life-this.t)/.6):1),s=P(this.x,this.y,0),R=this.R,im=ART.seal('frost','glacier');
  ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.globalAlpha*=a*.8;ctx.rotate(this.t*.25);ctx.drawImage(im,-R*1.08,-R*1.08,R*2.16,R*2.16);ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.3+.2*Math.sin(this.t*3);ctx.drawImage(im,-R*1.08,-R*1.08,R*2.16,R*2.16);});
/* Glacier Bulwark: every ice pillar is a pillar cut out of the painted glacier wall (r25), rising out of the ground; cracks show before it bursts */
const CROP={C:[18,15,158,292],S:[322,8,122,298]},CROPC={};
function monoCanvas(k){if(CROPC[k])return CROPC[k];const im=img('r25_glacierwall');if(!im)return null;const [sx,sy,sw,sh]=CROP[k],c=document.createElement('canvas');c.width=sw;c.height=sh;const g=c.getContext('2d');g.drawImage(im,sx,sy,sw,sh,0,0,sw,sh);
  g.globalCompositeOperation='destination-in';const L=g.createLinearGradient(0,0,sw,0),f=16/sw;if(k==='C'){L.addColorStop(0,'#000');L.addColorStop(1-f,'#000');L.addColorStop(1,'rgba(0,0,0,0)');}else{L.addColorStop(0,'rgba(0,0,0,0)');L.addColorStop(f,'#000');L.addColorStop(1,'#000');}
  g.fillStyle=L;g.fillRect(0,0,sw,sh);return CROPC[k]=c;}
{const MD=IceMonolith.prototype.draw;IceMonolith.prototype.draw=guardDraw('mono',function(){const c=monoCanvas(this.w>=25?'C':'S');if(!c)return MD.call(this);const s=P(this.x,this.y,0),rise=back(cl(this.t/this.rise,0,1)),H=this.h*1.18,W=H*c.width/c.height,
    crack=this.t>this.life-1.5?cl((this.t-(this.life-1.5))/1.5,0,1):0,shk=crack>0?Math.sin(this.t*60)*crack*1.6:0;
  ctx.fillStyle='rgba(10,30,60,.28)';ctx.beginPath();ctx.ellipse(s[0],s[1],W*.5,W*.16,0,0,TAU);ctx.fill();
  ctx.translate(s[0]+shk,s[1]);ctx.rotate(this.lean||0);ctx.scale(this._fl?-1:1,Math.max(.01,rise));ctx.drawImage(c,-W/2,-H*.97,W,H);
  if(crack>0){ctx.strokeStyle='rgba(255,255,255,'+(.9*crack).toFixed(3)+')';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-W*.2,-H*.75);ctx.lineTo(W*.06,-H*.56);ctx.lineTo(-W*.1,-H*.34);ctx.moveTo(W*.06,-H*.56);ctx.lineTo(W*.26,-H*.5);if(crack>.5){ctx.moveTo(-W*.1,-H*.34);ctx.lineTo(W*.12,-H*.16);}ctx.stroke();}});}
{const MU=IceMonolith.prototype.update;IceMonolith.prototype.update=function(dt){const b0=this.boom;if(!this._rv){this._rv=1;const mc=RV.monoC;this._fl=!!(mc&&this.w<25&&this.x<mc[0]-4);try{iceBurst(this.x,this.y,this.h*1.1);bits(S1(),'glacier',this.x,this.y,20,8,{up:1.1});dust({dust:'cloud'},this.x,this.y,16,5,24);}catch(e){warn('mr',e);}}
    RV.tk++;let r;try{r=MU.call(this,dt);}finally{RV.tk--;}
    try{if(!b0&&this.boom){iceBurst(this.x,this.y,this.h*1.3,{life:.5});bits(S1(),'glacier',this.x,this.y,this.h*.5,16,{sp:1.5,up:1.2,size:1.2});ring('glacier',this.x,this.y,64,{w0:8,life:.36});dust({dust:'cloud'},this.x,this.y,20,8,30);}}catch(e){warn('mb',e);}return r;};}
/* guard, perfect guard, the wall and Absolute Fortress taking a blow · Unbreakable · the shield · Last Bastion · Earth Fracture */
function guardHitFx(e,kind){const an=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,hk=HK(),x=player.x+Math.cos(an)*28*hk,y=player.y+Math.sin(an)*28*hk,z=32*hk,S=S1();RV.plateHit=gameTime;
  if(kind==='perfect'){pic({n:'r11_pow',x,y,z,w:84,life:.32,s0:.5,s1:1.1,pop:.08,fi:.001,fo:.2,glow:.8,rot:R_(-.3,.3)});ring('copper',player.x,player.y,56,{w0:6,life:.3});bits(S,'copper',x,y,z,10,{size:1,dir:an,spread:1.2});}
  else if(kind==='absorb'){flash('glacier',player.x,player.y,34*hk,1);ring('glacier',player.x,player.y,52,{w0:6,life:.28});RV.domeHit=gameTime;}
  else{flash('iron',x,y,z,.75,{life:.14});bits(S,'iron',x,y,z,5,{size:.85,dir:an,spread:1.1});}}
{const PH=window.jgPreHit;window.jgPreHit=function(e){const a=player.action,g=a&&a.guard&&!a.ended,pf=g&&a.t<a.perfect,abs=g&&a.key==='rhAbsolute',w0=typeof rhWallObj!=='undefined'&&rhWallObj?rhWallObj.flash:0;
    RV.tk++;let r;try{r=PH?PH.apply(this,arguments):1;}finally{RV.tk--;}
    try{if(g&&a.bt===gameTime)guardHitFx(e,abs?'absorb':pf?'perfect':'guard');else if(typeof rhWallObj!=='undefined'&&rhWallObj&&rhWallObj.flash===1&&w0!==1){const an=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi,hk=HK(),x=player.x+Math.cos(an)*40*hk,y=player.y+Math.sin(an)*40*hk;flash('iron',x,y,30*hk,.8,{life:.14});bits(S1(),'iron',x,y,30*hk,5,{dir:an,spread:1});}}catch(er){warn('ph',er);}return r;};}
{const AB=window.jgAbsorb;window.jgAbsorb=function(d,e){const sh0=RH.shield,n0=typeof RHX!=='undefined'?RHX.hitN:0;RV.tk++;let r;try{r=AB?AB.apply(this,arguments):d;}finally{RV.tk--;}
    try{if(LV.rhUnbreakable&&r===0&&d>0&&typeof RHX!=='undefined'&&RHX.hitN===0&&n0>0){const hk=HK();pic({n:'r11_pow',follow:player,z:36*hk,w:70,life:.3,s0:.5,s1:1.05,pop:.08,fi:.001,fo:.2,glow:.6});ring('iron',player.x,player.y,40,{w0:6,life:.26});}
      if(RH.shield<sh0)RV.domeHit=gameTime;}catch(_){}return r;};}
{const PO=window.jgPostHit;window.jgPostHit=function(e,d){const b0=RH.icd.bastion;RV.tk++;let r;try{r=PO?PO.apply(this,arguments):undefined;}finally{RV.tk--;}
    try{if(RH.icd.bastion>b0+1){const x=player.x,y=player.y,hk=HK();spic('r27_bastion',x,y,124*hk,{follow:player,oy:4,life:1,pop:.14,fo:.5,a:.6,glow:.5});ring('glacier',x,y,80,{w0:10,life:.45});RV.domeHit=gameTime;}}catch(er){warn('po',er);}return r;};}
{const AH=window.jgAfterHurt;window.jgAfterHurt=function(e,dmg,crit,o){const f0=RH.icd.fracture;const r=AH?AH.apply(this,arguments):undefined;
    try{if(e&&RH.icd.fracture>f0+.5){const x=e.x,y=e.y;crackP(x,y,90,{life:1});after(.35,()=>{ring('copper',x,y,46,{w0:6,life:.3});erupt(x,y,70,{life:.5});bits(S1(),'stone',x,y,4,6,{up:1.2});});}}catch(er){warn('ah',er);}return r;};}

/* ---------------------------------------------------------------------
   8. gauges (Momentum studs, stagger bars, the shield dome, Super Armour) and the lasting buff looks
   --------------------------------------------------------------------- */
RhOverlay.prototype.draw=guardDraw('ovl',function(){const hk=HK(),t=this.t;
  if(RH.mom>0){const s=P(player.x,player.y,(player.z||0)+82*hk),n=RH_BAL.momMax,full=RH.mom>=n,im=spr('rxStud','copper');for(let i=0;i<n;i++){const lit=i<RH.mom,px=s[0]+(i-(n-1)/2)*10*hk,py=s[1]-Math.sin((i+.5)/n*Math.PI)*3*hk-(lit&&this.momFlash>0?this.momFlash*8:0);
      if(lit){glowAt(px,py,(full?11:8)*hk,full?RA[2]:CU[2],.6+(full?.2*Math.sin(t*10+i):0));drawSpr(im,px,py,(full?10:9)*hk,0);}
      else{ctx.fillStyle='rgba(20,16,12,.45)';ctx.beginPath();ctx.moveTo(px,py-3*hk);ctx.lineTo(px+3*hk,py);ctx.lineTo(px,py+3*hk);ctx.lineTo(px-3*hk,py);ctx.closePath();ctx.fill();}}}
  for(const e of enemies){if(e.dead)continue;const max=e.boss?RH_BAL.stgMaxBoss:RH_BAL.stgMax;if(!(e.stg>0)&&!(e.stgImm>0))continue;const q=P(e.x,e.y,0),x=q[0],bw=e.boss?52:32,by=q[1]+11;
    ctx.fillStyle='rgba(14,16,22,.72)';ctx.fillRect(x-bw/2-1.5,by-1.5,bw+3,6);
    if(e.stgImm>0){ctx.fillStyle='rgba(150,172,204,.75)';ctx.fillRect(x-bw/2,by,bw*Math.min(1,e.stgImm/(e.boss?RH_BAL.stgImmuneBoss:RH_BAL.stgImmune)),3);}
    else{const k=Math.min(1,e.stg/max),hot=k>.75,g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,CU[1]);g.addColorStop(1,hot?CU[4]:CU[2]);ctx.fillStyle=g;ctx.fillRect(x-bw/2,by,bw*k,3);if(hot)glowAt(x-bw/2+bw*k,by+1.5,7,CU[2],.5+.3*Math.sin(t*14));}}
  if(RH.shield>0){const im=img('r21_bubble'),gk=cl((gameTime-(RV.shGain||-9))/.22,0,1),a=(RH.shieldT<1?Math.max(0,RH.shieldT):1)*Math.min(1,gk*2),hit=cl(1-(gameTime-(RV.domeHit||-9))/.25,0,1);
    if(im){const s=P(player.x,player.y,0),w=104*hk*(1+.05*hit)*(.6+.4*back(gk)),h=w*im.naturalHeight/im.naturalWidth;ctx.save();ctx.globalAlpha*=.38*a;ctx.drawImage(im,s[0]-w/2,s[1]-h*.92+6*hk,w,h);if(hit>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5*hit*a;ctx.drawImage(im,s[0]-w/2,s[1]-h*.92+6*hk,w,h);}ctx.restore();}}
  if(hasBuff('rhSA')&&player.buffs.rhSA.t>.15){const s=P(player.x,player.y,0),r=28*hk;ctx.save();ctx.translate(s[0],s[1]);ctx.scale(1,KY());ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba(IR[3],.45+.2*Math.sin(t*8));ctx.lineWidth=2.4;ctx.beginPath();
    for(let i=0;i<=6;i++){const an=i/6*TAU+t*.4;i?ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r):ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.stroke();ctx.restore();}});
/* Fury: a fire aura behind the hero (sorted just behind him) — a red glow and flame tongues licking up round his body */
class FuryAura extends RP{constructor(o){super(o,{layer:'sorted',life:99,fi:.25,fo:.3});}
  get sy(){return player.y-2;}
  paint(){const t=this.t,a=cl(t/this.fi,0,1)*cl((this.life-t)/this.fo,0,1);if(a<=.01||player.dead)return;const hk=HK(),q=P(player.x,player.y,player.z||0);
    glowAt(q[0],q[1]-34*hk,58*hk,RA[2],.42*a*(1+.15*Math.sin(t*9)));
    for(let i=0;i<7;i++){const ph=t*(3.2+i*.37)+i*1.7,k=.5+.5*Math.sin(ph),x=q[0]+(i/6-.5)*70*hk,h=(46+30*k)*hk*(i>=2&&i<=4?1.3:1),w=h*.42,im=spr('flame','rage',i);
      ctx.save();ctx.globalAlpha=a*.78;ctx.translate(x,q[1]-2*hk);ctx.rotate(Math.sin(ph*1.3)*.12+(i/6-.5)*.35);ctx.drawImage(im,-w/2,-h,w,h);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.25;ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}}}
const LIVE={};
function keep(key,on,mk){const cur=LIVE[key];if(on){if(!cur||(cur.parts.length&&!cur.parts.every(p=>fx.includes(p)))){if(cur)cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]={parts:grab(mk)};}}else if(cur){cur.parts.forEach(p=>p.kill&&p.kill());LIVE[key]=null;}}
const B=k=>()=>hasBuff(k);
const LOOKS={
  anchor:()=>gpic('r23_anchor',player.x,player.y,130*HK(),{follow:player,life:99,until:B('rhAnchor'),s0:.4,s1:1,pop:.18,fo:.4,a:.85,pulse:.03,pf:3}),
  stance:()=>{A(new Sigil({tex:ART.seal('iron','glacier'),el:'glacier',follow:player,r:44*HK(),spin:.3,life:99,until:B('rhStance'),fi:.2,fo:.3,a:.85}));plates({n:2,arc:1.1,R:36,h:32,until:B('rhStance')});},
  fort:()=>{plates({n:10,arc:TAU,fixed:0,R:46,h:36,cren:1,until:B('rhFortress')});pic({n:'r33_emblem',follow:player,z:100*HK(),w:30*HK(),life:99,until:B('rhFortress'),s0:.4,s1:1,pop:.2,fi:.3,fo:.3,a:.9,pulse:.04,pf:3});},
  colos:()=>{A(new Sigil({tex:ART.seal('frost','glacier'),el:'glacier',follow:player,r:52*HK(),spin:.2,life:99,until:B('rhColossus'),fi:.3,fo:.4,a:.55}));
    A(new Emit({life:99,until:B('rhColossus'),every:.12,fn(){const S=sys('sorted',player.y+2),an=R_(0,TAU),d=R_(14,30)*HK();S.add({im:spr('mist','glacier',(Math.random()*3)|0),x:player.x+Math.cos(an)*d,y:player.y+Math.sin(an)*d*.6,z:R_(0,10),vz:R_(18,34),dr:1,s0:16,s1:34,life:R_(.8,1.2),fi:.2,fo:.6,a0:.6});}}));},
  fury:()=>{A(new FuryAura({until:B('rhFury')}));
    A(new Emit({life:99,until:B('rhFury'),every:.12,fn(){const hd=hand();S1().add({im:spr('ember','rage'),x:hd[0]+R_(-5,5),y:hd[1],z:hd[2]+R_(-3,3),vx:R_(-12,12),vz:R_(40,90),dr:1.5,s0:R_(5,8),s1:1,life:R_(.35,.55),fo:.4});}}));},
  roar:()=>A(new Emit({life:99,until:B('rhRoar'),every:.45,fn(){glints(S1(),CU[3],player.x,player.y,(46+R_(0,14))*HK(),2,14,.5);}})),
  pact:()=>A(new Emit({life:99,until:B('rhPact'),every:.15,fn(){const hd=hand(),rd=Math.random()<.5;S1().add({im:tex('core',rd?RA[2]:G[2]),x:hd[0]+R_(-6,6),y:hd[1],z:hd[2]+R_(-4,4),vz:R_(30,60),dr:2,s0:6,s1:1,life:.4,add:1,fo:.3});}})),
  skin:()=>A(new Emit({life:99,until:B('rhSkin'),every:.35,fn(){const hk=HK();glints(S1(),IR[4],player.x,player.y,R_(16,56)*hk,1,12,.45);}}))};
function watch(){if(RH.shield>(RV.sh||0)+.5)RV.shGain=gameTime;RV.sh=RH.shield;for(const [k,b] of [['anchor','rhAnchor'],['stance','rhStance'],['fort','rhFortress'],['colos','rhColossus'],['fury','rhFury'],['roar','rhRoar'],['pact','rhPact'],['skin','rhSkin']])keep(k,hasBuff(b),LOOKS[k]);
  if(RH.mom>RV.mom){const s=[player.x,player.y,(player.z||0)+82*HK()];glints(S1(),CU[3],s[0],s[1],s[2],2,12,.4);}RV.mom=RH.mom;}
{const OU=RhOverlay.prototype.update;RhOverlay.prototype.update=function(dt){const r=OU.call(this,dt);const sk=window.SKCTX;window.SKCTX=null;try{watch();}catch(e){warn('watch',e);}finally{window.SKCTX=sk;}return r;};}
for(const C of [RhOverlay,GiantFist,SteelWallObj,FortressZone,IceMonolith])C.prototype.__gt='-';
RV.ready=1;
})();
