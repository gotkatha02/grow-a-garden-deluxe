/* =====================================================================
   TARGET LOCK — 12 Tails style (owner 2026-11-22: 'ทำระบบล็อคเป้าแบบ 12 หาง … สมูท สเถียร เปลี่ยนเป้าง่ายๆไม่ค้าง')
   • One locked enemy (TL.e). It STAYS locked while the hero walks (a ground click or the joystick only stops the attack).
     Released by: Esc · the ✕ on the target frame · holding 🎯 · walking far away (> FAR) · another map.
     When it dies the next enemy that is fighting the hero (else the nearest close one) is locked — the reticle glides there.
   • Picking: click / tap the monster (its whole body is the hit box now) · right click = lock without attacking (PC) ·
     T / Shift+T = next / previous (PC, works on a Thai keyboard too) · 🎯 = next (phone).
     T / 🎯 walk a frozen list (bosses first, then by distance) for CYC_T s, so repeated presses go through every enemy
     on screen instead of bouncing between the two nearest.
   • Everything that needs a target uses it: skills, basic attack, the phone attack button, auto mode, ground skills on
     the phone. Switching while attacking / walking up to cast moves that to the new target.
   • Chase watchdog: if the hero is chasing the target but has not moved for CHASE_T s (a wall / water in between),
     the chase stops instead of walking on the spot forever; the lock stays, so ranged skills still work.
   • Look: red ring + 4 arrow darts on the body (drawn in screen space, sharp at every zoom). Snaps in with an overshoot,
     glides (and turns 90°) to a new target, tightens on every hit, bursts on death; boss = gold-tipped darts + gold ring;
     thin ring at the feet; arrow at the screen edge when the target is off screen.
     Target frame at the top: portrait (cut from the monster's own sheet), level pill coloured by the level gap,
     Thai + English name, HP with a damage trail, boss break gauge, status chips, aggressive mark, ✕.
   Hooks in index.html: enemyAt → TL.pick · render → TL.ground / TL.draw · useSkill / autoTick → TL.forSkill / TL.autoPrime ·
   command(attack) → TL.set · overhead HP bar also for TL.e. mobile.js: 🎯, attack button, aim preview, drag-aim, ground tap.
   ===================================================================== */
(function(){
'use strict';
const FAR=900,CYC_R=640,CYC_T=2.6,NEXT_R=340,CHASE_T=1.4;
const TAU=Math.PI*2;
const TL=window.TL={e:null};
let L=null;                       // locked enemy
let tIn=1;                        // intro 0→1
let gl=null;                      // glide {x,y,r,t} (screen) from the previous reticle
let kickT=0;                      // little pulse (cycle pressed on the same target)
let fades=[];                     // reticles playing out {x,y,r,t,T,k,boss}
let cur=null;                     // reticle as drawn last frame {x,y,r}
let lastMap;let now=performance.now()/1000,dtR=0;
let ptrTouch=matchMedia&&matchMedia('(pointer:coarse)').matches;
const sess={L:[],t:-99,i:0};
const chase={e:null,x:0,y:0,t:0,sx:0,sy:0,sd:0,st:0};
let inclT=0;

/* ---------- helpers ---------- */
const G=n=>{try{return eval(n);}catch(e){return undefined;}};
const isMob=()=>document.body.classList.contains('mob');
const alive=e=>!!(e&&!e.dead);
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,k)=>a+(b-a)*k;
const eOut=k=>1-Math.pow(1-k,3),eIO=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const eBack=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
function hOf(e){const h=window.MSPR_H?MSPR_H(e):54;return (window.MSPR_HAS&&MSPR_HAS(e))?h:h*(e.sc||1);}
function scr(e,f){const q=P(e.x,e.y,(e.z||0)+hOf(e)*f);return [q[0]*Z+ox,q[1]*Z+oy];}
function radOf(e){return Math.max(ptrTouch?26:24,clamp(hOf(e)*.42,15,70)*Z);}
function onScr(x,y,m){return x>-m&&x<VW+m&&y>-m&&y<VH+m;}
function say(t){try{msg(t);}catch(e){}}
function dHero(e){return Math.hypot(e.x-player.x,e.y-player.y);}

/* ---------- pick under the pointer: the whole drawn body is the hit box (was a 30 px dot 16 px above the feet) ---------- */
TL.pick=function(sx,sy,touch){if(touch==null)touch=ptrTouch;let best=null,bs=1e9;
  for(const e of enemies){if(e.dead||e.hidden)continue;const q=P(e.x,e.y,e.z||0),fx=q[0]*Z+ox,fy=q[1]*Z+oy;
    if(fx<-160||fx>VW+160||fy<-60||fy>VH+260)continue;const H=hOf(e);
    const hw=Math.max(15,H*.34)*Z+(touch?12:3),top=fy-H*Z-(touch?12:3),bot=fy+7*Z+(touch?10:2);
    if(sx<fx-hw||sx>fx+hw||sy<top||sy>bot)continue;
    let d=Math.hypot((sx-fx)/hw,(sy-(top+bot)/2)/((bot-top)/2))-(e.y-player.y)*.0004;   // closest to the body centre; the one in front wins a tie
    if(e===L)d-=.2;                                                                         // sticky: overlapping monsters do not steal the lock
    if(d<bs){bs=d;best=e;}}
  if(!best){let bd=(touch?40:26)*Math.max(1,Z);for(const e of enemies){if(e.dead||e.hidden)continue;const [x,y]=scr(e,.45),d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best=e;}}}
  return best;};

/* ---------- lock / release ---------- */
function set(e,o){o=o||{};if(!alive(e)||e.hidden&&!o.sync)return;
  if(e===L){if(o.kick)kickT=1;return;}
  if(L&&cur){gl={x:cur.x,y:cur.y,r:cur.r,t:0};}else{tIn=0;gl=null;}
  L=e;TL.e=e;kickT=0;
  if(!o.sync){   /* the player picked it: what the hero is doing follows */
    const at=player.attackTarget;if(alive(at)&&at!==e)player.attackTarget=e;
    const p=player.pending;if(p&&alive(p.target)&&p.target!==e)p.target=e;}
  frameSet(e);}
function release(kind,stop){if(!L)return;
  if(cur)fades.push({x:cur.x,y:cur.y,r:cur.r,t:0,T:kind==='die'?.36:.22,k:kind||'rel',boss:!!L.boss});
  if(stop){if(player.attackTarget===L)player.attackTarget=null;const p=player.pending;if(p&&p.target===L)player.pending=null;}
  L=null;TL.e=null;cur=null;gl=null;frameSet(null);}
TL.set=(e,o)=>set(e,o);
TL.release=(stop)=>release('rel',stop!==false);
TL.get=()=>alive(L)&&!L.hidden?L:null;
/* skills / auto: the locked target when it is within a short walk (else the skill takes the nearest and the lock follows it) */
const REACH=360;
TL.near=r=>alive(L)&&!L.hidden&&dHero(L)<=r?L:null;
TL.forSkill=function(sk){return TL.near(Math.max((sk&&sk.range)||0,G('BASIC_RANGE')||80,140)+REACH);};
TL.autoPrime=function(){if(!alive(L)||L.hidden||player.attackTarget||player.pending||player.moveT||player.casting)return;
  try{if(busy()||G('targeting'))return;}catch(e){}if(dHero(L)<=460)player.attackTarget=L;};
TL.autoPick=r=>alive(L)&&!L.hidden&&dHero(L)<=(r||460)?L:null;

/* ---------- next / previous target ---------- */
function cands(){const out=[];for(const e of enemies){if(e.dead||e.hidden||dHero(e)>CYC_R)continue;const [x,y]=scr(e,.45);if(!onScr(x,y,-6))continue;out.push(e);}return out;}
const score=e=>dHero(e)-(e.boss?5000:0)-(e.aggro>0?40:0);
function cycle(dir){const C=cands();
  if(!C.length){if(L)kickT=1;else say('ไม่มีศัตรูอยู่ใกล้ ๆ');return null;}
  C.sort((a,b)=>score(a)-score(b));
  const fresh=now-sess.t>CYC_T;let list,n;
  if(fresh){list=C;n=(list[0]===L&&list.length>1)?(dir>0?1:list.length-1):0;}
  else{list=sess.L.filter(e=>C.includes(e));for(const e of C)if(!list.includes(e))list.push(e);
    const i=list.indexOf(L);n=i<0?Math.min(sess.i||0,list.length-1):(i+dir+list.length)%list.length;}
  sess.L=list;sess.i=n;sess.t=now;const e=list[n];
  if(e===L)kickT=1;else set(e,{});return e;}
TL.cycle=d=>cycle(d||1);

/* ---------- the locked one died: lock the next enemy that is fighting the hero (or the nearest close one) ---------- */
function nextAfter(d){let best=null,bs=1e9;
  for(const e of enemies){if(e.dead||e.hidden||e===d)continue;const dh=dHero(e);if(dh>NEXT_R&&!(e.aggro>0&&dh<NEXT_R*1.6))continue;
    const [x,y]=scr(e,.45);if(!onScr(x,y,-4))continue;
    const s=dh-(e.aggro>0?160:0)-(e.boss?400:0)+Math.hypot(e.x-d.x,e.y-d.y)*.25;if(s<bs){bs=s;best=e;}}
  return best;}

/* ---------- per frame (called from render) ---------- */
function tick(){const t=performance.now()/1000;dtR=Math.min(.1,Math.max(0,t-now))*(TL.ts||1);now=t;   /* TL.ts = slow motion for test captures */
  const cm=G('curMap');if(cm!==lastMap){if(lastMap!==undefined&&L){L=null;TL.e=null;cur=null;gl=null;fades.length=0;frameSet(null);}lastMap=cm;}
  /* follow what the hero is really attacking / walking up to (auto mode, hero scripts, old code paths) */
  const at=player.attackTarget,pt=player.pending&&player.pending.target,want=alive(at)?at:alive(pt)?pt:null;
  if(want&&want!==L)set(want,{sync:1});
  if(L){
    if(L.dead){const d=L,c=cur;release('die');const n=nextAfter(d);if(n){set(n,{sync:1});if(c){gl={x:c.x,y:c.y,r:c.r,t:0};tIn=1;}}}
    else if((inclT-=dtR)<=0&&(inclT=.5,!enemies.includes(L)))release('rel');
    else if(dHero(L)>FAR&&player.attackTarget!==L&&!(player.pending&&player.pending.target===L))release('rel');}
  if(tIn<1)tIn=Math.min(1,tIn+dtR/.26);if(gl&&(gl.t+=dtR/.17)>=1)gl=null;if(kickT>0)kickT=Math.max(0,kickT-dtR/.3);
  for(const f of fades)f.t+=dtR;fades=fades.filter(f=>f.t<f.T);
  watchChase();}
/* chase watchdog (game clock, so slow motion / hit-stop never trip it): chasing (attack / walk-up-to-cast) and
   (1) not moving for CHASE_T s (pushing into a wall / water), or (2) shuffling on the spot for JIT_T s (net move < 30 px and no
   closer to the target) = blocked → stop the chase, keep the lock (ranged skills still work). Standing in range always attacks
   (startAction every frame), so an idle hero with a target is never a normal state. */
const JIT_T=3.5;
function watchChase(){const t=+G('gameTime')||0,tg=alive(player.attackTarget)?player.attackTarget:(player.pending&&alive(player.pending.target))?player.pending.target:null;
  if(!tg||player.action||player.casting||player.ccT>0||player.sitting){chase.e=null;return;}
  const d=dHero(tg);
  if(chase.e!==tg||t<chase.t){chase.e=tg;chase.x=chase.sx=player.x;chase.y=chase.sy=player.y;chase.t=chase.st=t;chase.sd=d;return;}
  if(Math.hypot(player.x-chase.x,player.y-chase.y)>6){chase.x=player.x;chase.y=player.y;chase.t=t;}
  if(Math.hypot(player.x-chase.sx,player.y-chase.sy)>30||d<chase.sd-20){chase.sx=player.x;chase.sy=player.y;chase.sd=d;chase.st=t;}
  if(t-chase.t>CHASE_T||t-chase.st>JIT_T){chase.e=null;if(player.attackTarget===tg)player.attackTarget=null;if(player.pending&&player.pending.target===tg)player.pending=null;
    say('เข้าไม่ถึงเป้าหมาย — มีสิ่งกีดขวาง');}}

/* ---------- drawing ---------- */
const RED={c:'#ff4a4a',a0:'#ffe6de',a1:'#ff6a6a',a2:'#e02e38'},GOLD={c:'#ffc84a',a0:'#fff6c8',a1:'#ffc04a',a2:'#e0503a'};
function dart(c,R,s,off,pal){   /* one arrow dart pointing to the centre along −x (local frame: +x = outward) */
  const x0=R-.24*s+off;c.beginPath();
  c.moveTo(x0,0);c.lineTo(x0+.32*s,-.21*s);c.lineTo(x0+.25*s,-.075*s);c.lineTo(x0+.54*s,-.075*s);c.lineTo(x0+.8*s,-.23*s);c.lineTo(x0+.68*s,0);
  c.lineTo(x0+.8*s,.23*s);c.lineTo(x0+.54*s,.075*s);c.lineTo(x0+.25*s,.075*s);c.lineTo(x0+.32*s,.21*s);c.closePath();
  const g=c.createLinearGradient(x0,0,x0+.8*s,0);g.addColorStop(0,pal.a0);g.addColorStop(.38,pal.a1);g.addColorStop(1,pal.a2);c.fillStyle=g;c.fill();
  c.lineWidth=1.15;c.strokeStyle='rgba(110,8,16,.85)';c.stroke();
  c.beginPath();c.moveTo(x0+.05*s,-.01*s);c.lineTo(x0+.28*s,-.15*s);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1;c.stroke();}
function reticle(c,x,y,R,o){const pal=o.boss?GOLD:RED,s=clamp(R*.92,20,42);
  c.save();c.translate(x,y);c.globalAlpha=o.a;
  /* ring: dark halo + red line (+ gold outer line for bosses) */
  const rr=R*o.rs;c.lineWidth=5;c.strokeStyle='rgba(60,0,6,.32)';c.beginPath();c.arc(0,0,rr,0,TAU);c.stroke();
  c.lineWidth=2.4;c.strokeStyle=pal===GOLD?'#ff5a4a':pal.c;c.shadowColor='rgba(255,40,40,.7)';c.shadowBlur=6;c.beginPath();c.arc(0,0,rr,0,TAU);c.stroke();c.shadowBlur=0;
  if(o.boss){c.lineWidth=1.4;c.strokeStyle='rgba(255,214,110,.9)';c.beginPath();c.arc(0,0,rr+4.5,0,TAU);c.stroke();}
  for(let i=0;i<4;i++){c.save();c.rotate(Math.PI/4+i*Math.PI/2+o.spin);c.globalAlpha=o.a*o.da;dart(c,R,s,o.off,pal);c.restore();}
  c.restore();}
function edge(c,e,pal){   /* target off screen: small arrow at the screen edge pointing to it */
  const [x,y]=scr(e,.45),cx=VW/2,cy=VH/2,a=Math.atan2(y-cy,x-cx),m=34;
  const k=Math.min((VW/2-m)/Math.max(1e-3,Math.abs(Math.cos(a))),(VH/2-m)/Math.max(1e-3,Math.abs(Math.sin(a))));
  const px=cx+Math.cos(a)*k,py=cy+Math.sin(a)*k,b=1+.12*Math.sin(now*6);
  c.save();c.translate(px,py);c.rotate(a);c.scale(b,b);c.beginPath();c.moveTo(13,0);c.lineTo(-7,-10);c.lineTo(-3,0);c.lineTo(-7,10);c.closePath();
  c.fillStyle=pal.a1;c.strokeStyle='rgba(60,0,6,.9)';c.lineWidth=1.6;c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=4;c.fill();c.stroke();c.restore();}
TL.draw=function(){try{tick();}catch(err){console.warn('TL',err);}
  const c=ctx;c.save();c.setTransform(DPR,0,0,DPR,0,0);
  for(const f of fades){const k=f.t/f.T;
    if(f.k==='die')reticle(c,f.x,f.y,f.r,{a:1-k,rs:1-.45*eOut(k),off:f.r*1.1*eOut(k),spin:k*.6,da:1,boss:f.boss});
    else reticle(c,f.x,f.y,f.r,{a:(1-k)*.9,rs:1+.35*eOut(k),off:f.r*.45*eOut(k),spin:0,da:1,boss:f.boss});}
  if(alive(L)){let [x,y]=scr(L,.48),r=radOf(L),spin=0;
    if(gl){const k=eIO(gl.t);x=lerp(gl.x,x,k);y=lerp(gl.y,y,k);r=lerp(gl.r,r,k);spin=(1-k)*Math.PI/2;}
    cur={x,y,r};
    const vis=onScr(x,y,r*1.6);
    if(vis){const iB=eBack(tIn),fl=clamp(L.flash||0,0,1),br=Math.sin(now*TAU*1.25)*.07;
      const off=r*1.5*(1-iB)+r*(br-.16*fl)-r*.16*Math.sin(kickT*Math.PI);
      reticle(c,x,y,r,{a:(L.hidden?.3:1)*clamp(tIn*2.2,0,1),rs:1+.55*(1-iB)+.07*Math.sin(kickT*Math.PI),off,spin,da:1,boss:!!L.boss});}
    else edge(c,L,L.boss?GOLD:RED);}
  c.restore();frameTick();};
/* ground pass (world space, called where the old dashed rings were): hover ring (mouse only) + thin ring at the locked feet */
TL.ground=function(){const c=ctx;
  const ho=mouse.over;if(!ptrTouch&&alive(ho)&&ho!==L){const [x,y]=P(ho.x,ho.y);c.save();c.translate(x,y);c.scale(1,K);c.strokeStyle='rgba(255,236,210,.75)';c.lineWidth=1.6;c.setLineDash([6,4]);c.lineDashOffset=-gameTime*20;c.beginPath();c.arc(0,0,(ho.r||18)+8,0,TAU);c.stroke();c.restore();}
  if(alive(L)&&!L.hidden){const [x,y]=P(L.x,L.y),s=.7+.3*eBack(tIn),rr=((L.r||18)+9)*s;c.save();c.translate(x,y);c.scale(1,K);c.globalAlpha=gl?eIO(gl.t):1;
    const g=c.createRadialGradient(0,0,rr*.3,0,0,rr);g.addColorStop(0,'rgba(255,60,60,0)');g.addColorStop(1,'rgba(255,60,60,.22)');c.fillStyle=g;c.beginPath();c.arc(0,0,rr,0,TAU);c.fill();
    c.lineWidth=1.6;c.strokeStyle=L.boss?'rgba(255,200,90,.85)':'rgba(255,82,82,.8)';c.beginPath();c.arc(0,0,rr,0,TAU);c.stroke();
    c.restore();}};

/* ---------- target frame (top of the screen) ---------- */
const css=`
#tlf{position:fixed;left:50%;top:40px;z-index:13;display:flex;align-items:center;pointer-events:none;opacity:0;transform:translate(-50%,-6px);transition:opacity .16s,transform .16s;font-family:'Mitr',Mali,Sarabun,sans-serif}
#tlf.on{opacity:1;transform:translate(-50%,0)}
#tlf .pt{position:relative;width:50px;height:50px;border-radius:50%;flex:none;z-index:2;background:radial-gradient(circle at 50% 36%,#fff6ea,#e9c9a2);box-shadow:0 0 0 2px #fff0d0,0 0 0 4.5px #9e2a22,0 3px 0 4.5px #4a1a10,0 6px 12px rgba(0,0,0,.35);overflow:hidden}
#tlf.boss .pt{box-shadow:0 0 0 2px #fff6c8,0 0 0 4.5px #d89a28,0 3px 0 4.5px #5a3206,0 0 14px rgba(255,200,80,.55)}
#tlf .pt canvas{width:100%;height:100%;display:block}
#tlf .bd{position:relative;margin-left:-14px;padding:5px 12px 6px 22px;width:286px;box-sizing:border-box;background:var(--v2-paper,linear-gradient(rgba(255,226,186,.95),rgba(238,190,140,.95)));border:2px solid #8a4e24;border-radius:14px;box-shadow:0 4px 12px rgba(60,26,8,.35);pointer-events:auto}
#tlf.boss .bd{border-color:#b87a1e;box-shadow:0 0 0 2px rgba(255,214,110,.6),0 4px 12px rgba(60,26,8,.35)}
#tlf .nm{display:flex;align-items:center;gap:5px;white-space:nowrap;min-width:0;height:18px}
#tlf .lv{flex:none;font:600 10px/1 'Mitr',Mali,sans-serif;padding:3px 6px 2px;border-radius:999px;background:var(--lc,#fff3d6);color:#2a1406;border:1px solid rgba(74,26,0,.5)}
#tlf .nm b{font:600 13.5px/1.2 'Mitr',Mali,sans-serif;color:#4a2a16;overflow:hidden;text-overflow:ellipsis;min-width:0}
#tlf .nm small{font:400 10.5px/1.2 'Prompt',Sarabun,sans-serif;color:#8a5a36;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
#tlf .tg{display:flex;gap:3px;align-items:center;flex:none}
#tlf .tg i{width:9px;height:9px;transform:rotate(45deg);background:var(--c);border:1px solid rgba(40,10,0,.65);border-radius:2px;display:block}
#tlf .tg .ag,#tlf .tg .bs{font:600 9px/1 'Mitr',sans-serif;color:#fff;background:#c8463c;border-radius:5px;padding:2px 4px;border:1px solid #6a1a12}
#tlf .tg .bs{background:linear-gradient(#ffd86a,#e8a020);color:#4a1a00;border-color:#8a5a10}
#tlf .hp{position:relative;height:14px;margin-top:4px;border-radius:999px;background:rgba(40,18,10,.8);border:1px solid #c48a2e;box-shadow:inset 0 2px 3px rgba(0,0,0,.45);overflow:hidden}
#tlf .hp i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:0 50%;border-radius:999px;will-change:transform}
#tlf .hp .tr{background:linear-gradient(#fff6cf,#f4c95e)}
#tlf .hp .fl{background:linear-gradient(#ff9a7a,#e0382e 55%,#9a1c1c);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
#tlf.boss .hp .fl{background:linear-gradient(#ffb07a,#e8502a 50%,#a01c10)}
#tlf .hp b{position:absolute;inset:0;font:500 10.5px/13px 'Prompt',Sarabun,sans-serif;color:#fff;text-align:center;text-shadow:0 1px 0 #000,0 0 2px #000;white-space:nowrap}
#tlf .ko{position:relative;height:5px;margin-top:2px;border-radius:999px;background:rgba(40,18,10,.7);overflow:hidden;display:none}
#tlf.hasko .ko{display:block}
#tlf .ko i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:0 50%;background:linear-gradient(#fff0a0,#f0b020);border-radius:999px}
#tlf .ko.out i{background:#9aa3b4}
#tlf .x{position:absolute;right:-9px;top:-9px;width:22px;height:22px;padding:0;border-radius:50%;border:2px solid #6a3a14;background:linear-gradient(#fae386,#f2bf4e);color:#4a1a00;font:700 11px/1 sans-serif;cursor:pointer;box-shadow:0 2px 0 #6a3a14;display:flex;align-items:center;justify-content:center}
#tlf .x:active{transform:translateY(1px)}
#tlf.ph{left:0;transform:translate(0,-4px)}#tlf.ph.on{transform:none}
#tlf.ph .pt{width:32px;height:32px;box-shadow:0 0 0 1.5px #fff0d0,0 0 0 3.5px #9e2a22,0 2px 0 3.5px #4a1a10}
#tlf.ph.boss .pt{box-shadow:0 0 0 1.5px #fff6c8,0 0 0 3.5px #d89a28,0 2px 0 3.5px #5a3206}
#tlf.ph .bd{margin-left:-10px;padding:3px 18px 4px 15px;width:auto;flex:1;min-width:0;border-radius:11px}
#tlf.ph .nm{height:14px;gap:4px}#tlf.ph .lv{font-size:9px;padding:2px 4px 1px}#tlf.ph .nm b{font-size:11.5px}#tlf.ph .nm small{display:none}
#tlf.ph .hp{height:11px;margin-top:2px}#tlf.ph .hp b{font-size:9px;line-height:10px}
#tlf.ph .x{right:-7px;top:-7px;width:20px;height:20px;font-size:10px}
#mobTgt.lk{box-shadow:0 0 0 3px #ff5a4a,0 0 14px rgba(255,80,60,.8)!important}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const F=document.createElement('div');F.id='tlf';
F.innerHTML='<div class="pt"><canvas width="96" height="96"></canvas></div><div class="bd"><div class="nm"><span class="lv"></span><b></b><small></small><span class="tg"></span></div><div class="hp"><i class="tr"></i><i class="fl"></i><b></b></div><div class="ko"><i></i></div><button class="x" title="ปลดเป้า (Esc)" aria-label="ปลดเป้า">✕</button></div>';
document.body.appendChild(F);
const fe={pc:F.querySelector('canvas'),lv:F.querySelector('.lv'),nm:F.querySelector('.nm b'),en:F.querySelector('.nm small'),tg:F.querySelector('.tg'),
  tr:F.querySelector('.hp .tr'),fl:F.querySelector('.hp .fl'),ht:F.querySelector('.hp b'),ko:F.querySelector('.ko'),koI:F.querySelector('.ko i'),x:F.querySelector('.x')};
['pointerdown','mousedown','touchstart','click'].forEach(ev=>F.addEventListener(ev,e=>e.stopPropagation()));
fe.x.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();release('rel',true);});
const FS={e:null,hp:-1,max:-1,fr:1,tr:1,hold:0,sig:'',ko:-1,lvS:'',seenHp:0};
function lvCol(d){return d<=-10?'#c9ced6':d<=-4?'#a6e88a':d<=3?'#fff3d6':d<=6?'#ffbe6a':'#ff7a64';}
function nameOf(e){const v=e.vdef||{},m=e.m||{};return {th:e.bossName||v.th||m.th||v.name||m.name||'มอนสเตอร์',en:e.bossName?'':(v.th||m.th)?(v.name||m.name||''):''};}
function frameSet(e){FS.e=e;const mt=document.getElementById('mobTgt');if(mt)mt.classList.toggle('lk',!!e);if(!e){F.classList.remove('on');return;}
  const n=nameOf(e),lv=(e.m&&e.m.lv)||e.lv||0,pl=(window.PS&&PS.lv)||1;
  fe.nm.textContent=n.th;fe.en.textContent=n.en;fe.lv.textContent=lv?'Lv.'+lv:'Lv.?';F.style.setProperty('--lc',e.boss?'#ffd86a':lvCol(lv-pl));
  fe.lv.title=lv?(lv-pl>6?'เลเวลสูงกว่ามาก — อันตราย':lv-pl>3?'เลเวลสูงกว่า':lv-pl<=-10?'เลเวลต่ำกว่ามาก':lv-pl<=-4?'เลเวลต่ำกว่า':'เลเวลใกล้เคียง'):'';
  F.classList.toggle('boss',!!e.boss);F.classList.toggle('hasko',!!e.koMax);
  FS.hp=-1;FS.max=-1;FS.sig=null;FS.ko=-1;fe.tg.innerHTML='';const r=e.maxHp?clamp(e.hp/e.maxHp,0,1):1;FS.fr=r;FS.tr=r;FS.hold=0;FS.seenHp=e.hp;
  fe.fl.style.transform=fe.tr.style.transform='scaleX('+r+')';FS.w1=FS.w2='';
  portrait(e);F.classList.add('on');place();}
const STC=[['bleed','#ff3a4a','เลือดไหล'],['poison','#7ad05a','พิษ'],['slow','#7fdcff','ช้าลง'],['root','#9a7a4a','ตรึง'],['frozen','#e6f8ff','แช่แข็ง'],['stun','#ffd23a','มึนงง'],['stagger','#ffb347','เสียหลัก'],['armor','#d8b45a','เกราะแตก'],['defdown','#c8a0ff','เกราะลด'],['owBlind','#5a5a7a','ตาบอด']];
function frameTick(){const e=FS.e;if(!e)return;if(e!==L||e.dead){if(!alive(L))frameSet(null);return;}
  const max=Math.max(1,e.maxHp||1),hp=Math.max(0,e.hp),r=clamp(hp/max,0,1);
  if(hp<FS.seenHp-.01)FS.hold=.38;FS.seenHp=hp;
  FS.fr=lerp(FS.fr,r,Math.min(1,dtR*18));if(FS.tr<FS.fr)FS.tr=FS.fr;if(FS.hold>0)FS.hold-=dtR;else FS.tr=Math.max(FS.fr,FS.tr-dtR*.9);
  const a1=FS.fr.toFixed(3),a2=FS.tr.toFixed(3);if(a1!==FS.w1){FS.w1=a1;fe.fl.style.transform='scaleX('+a1+')';}if(a2!==FS.w2){FS.w2=a2;fe.tr.style.transform='scaleX('+a2+')';}
  const hpI=Math.ceil(hp);if(hpI!==FS.hp||max!==FS.max){FS.hp=hpI;FS.max=max;fe.ht.textContent=hpI.toLocaleString('en-US')+' / '+Math.round(max).toLocaleString('en-US');}
  if(e.koMax){const kr=e.koOut?1-clamp((e.st&&e.st.stun||0)/(G('KO_STUN')||4),0,1):clamp(e.ko/e.koMax,0,1);if(Math.abs(kr-FS.ko)>.004){FS.ko=kr;fe.koI.style.transform='scaleX('+kr.toFixed(3)+')';}fe.ko.classList.toggle('out',!!e.koOut);}
  let sig=(e.vdef&&e.vdef.aggr?'a':'')+(e.hidden?'h':'')+(e.boss?'b':'');const s=e.st||{};for(const [k] of STC)if(s[k]>0)sig+=k[0]+k[1];
  if(sig!==FS.sig){FS.sig=sig;let h='';for(const [k,c,t] of STC)if(s[k]>0)h+=`<i style="--c:${c}" title="${t}"></i>`;
    if(e.vdef&&e.vdef.aggr)h+='<em class="ag" title="ดุร้าย — เข้าโจมตีก่อน">ดุ</em>';if(e.boss)h+='<em class="bs">บอส</em>';if(e.hidden)h+='<em class="ag" title="หายตัว">หาย</em>';fe.tg.innerHTML=h;}}
/* portrait: the monster's first idle frame, cropped round its head (bbox of the top part of the body), cached per sprite */
const PCACHE=new Map();
function sheetOf(e){const M=window.MSPR;if(!M)return null;const m=(e.vdef&&M[e.vdef.name])||(e.spr&&M[e.spr]);if(!m)return null;
  if(m.clip){const a=m.clip.idle;if(!m.ok||!a||!a.img||!a.img.naturalWidth)return {wait:1};return {img:a.img,cw:a.cw,ch:a.ch,flip:!!m.flip,key:a.f};}
  const im=m.img;if(!im||!im.naturalWidth||!m.ok)return {wait:1};return {img:im,cw:m.cw,ch:m.ch,flip:!!m.flip,key:m.file};}
function crop(s){let c=PCACHE.get(s.key);if(c)return c;const cv=document.createElement('canvas');cv.width=s.cw;cv.height=s.ch;const g=cv.getContext('2d',{willReadFrequently:true});g.drawImage(s.img,0,0,s.cw,s.ch,0,0,s.cw,s.ch);
  let d;try{d=g.getImageData(0,0,s.cw,s.ch).data;}catch(err){c={x:0,y:0,w:s.cw,cv};PCACHE.set(s.key,c);return c;}
  let x0=s.cw,x1=0,y0=s.ch,y1=0;for(let y=0;y<s.ch;y+=2)for(let x=0;x<s.cw;x+=2)if(d[(y*s.cw+x)*4+3]>60){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<=x0){c={x:0,y:0,w:Math.min(s.cw,s.ch),cv};PCACHE.set(s.key,c);return c;}
  const bh=y1-y0,bw=x1-x0,lim=y0+bh*.42;let sx=0,n=0;for(let y=y0;y<=lim;y+=2)for(let x=x0;x<=x1;x+=2)if(d[(y*s.cw+x)*4+3]>60){sx+=x;n++;}
  const hx=n?sx/n:(x0+x1)/2,w=clamp(Math.min(bw,bh)*.86,24,Math.max(bw,bh));
  c={x:clamp(hx-w/2,x0-w*.1,x1-w*.9),y:y0-w*.06,w,cv};PCACHE.set(s.key,c);return c;}
let pWait=null;
function portrait(e){const cv=fe.pc,g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,96,96);pWait=null;
  const s=sheetOf(e);if(s&&s.wait){pWait=e;}
  if(!s||s.wait){g.fillStyle='rgba(120,40,20,.55)';g.font='700 40px Mitr,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(e.boss?'☠':'?',48,52);return;}
  const c=crop(s);g.save();if(s.flip){g.translate(96,0);g.scale(-1,1);}g.drawImage(c.cv,c.x,c.y,c.w,c.w,4,6,88,88);g.restore();}
setInterval(()=>{if(pWait&&pWait===FS.e)portrait(pWait);},400);
/* where the frame sits: PC = top centre under the map name · phone = beside the second menu row (else under the menus) */
function place(){if(!isMob()){F.classList.remove('ph');F.style.left=F.style.top=F.style.width='';return;}
  F.classList.add('ph');const vis=el=>{if(!el)return null;const r=el.getBoundingClientRect();return r.width>4&&r.height>4&&getComputedStyle(el).display!=='none'?r:null;};
  const mg=document.getElementById('mgrid'),mr=vis(mg);let x0=Math.round(innerWidth/2-125),x1=x0+250,y=8;
  if(mr){const K=[...mg.children].map(vis).filter(Boolean).sort((a,b)=>a.top-b.top);if(K.length){const t0=K[0].top,row2=K.filter(k=>k.top>t0+12);
      if(row2.length&&mr.right-Math.max(...row2.map(k=>k.right))>=190){x0=Math.max(...row2.map(k=>k.right))+8;x1=mr.right-6;y=row2[0].top+2;}
      else{y=mr.bottom+6;x0=Math.round(mr.left+mr.width/2-125);x1=x0+250;}}}
  const tp=vis(document.getElementById('top'));if(tp&&x0<tp.right+6&&y<tp.bottom){x0=tp.right+8;}
  F.style.left=x0+'px';F.style.top=y+'px';F.style.width=Math.max(170,x1-x0)+'px';}
addEventListener('resize',()=>setTimeout(place,60));setInterval(()=>{if(FS.e)place();},1500);

/* ---------- input ---------- */
const cv=document.getElementById('c');
if(cv){cv.addEventListener('pointerdown',e=>{ptrTouch=e.pointerType!=='mouse';
    if(e.button===2&&!ptrTouch&&!G('targeting')){const en=TL.pick(e.clientX,e.clientY,false);if(en){set(en,{});}}},true);   /* right click = lock only (no attack) */
  cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')ptrTouch=false;},true);}
const busyUI=()=>[...document.querySelectorAll('#skw.open,#totemWin.open,#rlw.open,#panel.open,#kfdlg.open,#mkx.open,#smw.open,#shw.open,#rfw.open,#mkw.open,#eqw.open,#itw.open,#stw.open,#lookw.open,.ttw.open,#ccov')].some(el=>el.offsetWidth>0&&el.offsetHeight>0);   /* a window on screen: Esc is for it */
addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;const tn=(e.target&&e.target.tagName)||'';if(/INPUT|TEXTAREA|SELECT/.test(tn))return;
  if(e.code==='KeyT'){e.preventDefault();if(!e.repeat)cycle(e.shiftKey?-1:1);}
  else if(e.key==='Escape'&&L&&!G('targeting')&&!busyUI())release('rel',true);},true);   /* capture: read the state before Esc closes windows / ground aiming */
})();
