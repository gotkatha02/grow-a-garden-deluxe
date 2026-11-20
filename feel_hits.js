/* Hit feel (owner 2026-11-20, picked 2 · 3 · 4 · 6 from the list):
   2  swing timing — inside every 'attack' sequence the frame times are re-spread but the hit time (contact frame start)
      and the action end (contact + 2) stay exactly where they were, so attack speed / DPS do not change (rule 4):
      slower wind-up, a fast swing into the contact frame, the contact pose held longer. Damage stays on the contact frame (3).
   4  hit-stop — every hit that lands from an action event freezes the game for 45–120 ms by power
      (basic 50 ms, finisher ~75 ms, big skills longer); at most one new stop per 0.1 s so multi-hit skills don't stutter.
   6  lunge — basic attacks and short melee swings step 12 px forward into the swing and brake at the contact frame,
      never into the target or a wall.
   window.__FEEL_OFF=1 turns all of it off (A/B testing). */
(()=>{
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
if(typeof seq!=='function'||!G('SPR_META'))return;
const off=()=>!!window.__FEEL_OFF;

/* ---- 2 · swing timing ---- */
const _seq=seq;
const W=(f,c)=>f<=c-3?1.4:f===c-2?1:f===c-1?.45:f===c?1.8:f===c+1?.6:1;
window.seq=seq=function(st,d,from=0,to=null,speed=1){const o=_seq(st,d,from,to,speed);if(st!=='attack'||off()||window.__FEEL_NOSEQ)return o;
  const M=G('SPR_META'),c=M&&M.contact&&M.contact.attack&&M.contact.attack[G('srcDir')(d)];
  if(c==null||!o.some(x=>x.f===c)||o.length<3)return o;
  /* re-spread inside 3 groups, each keeping its own length: before contact (so the hit time is unchanged),
     contact + next frame (so the action's end, kC+2, is unchanged), and the rest of the recovery */
  const grp=x=>x.f<c?0:x.f<=c+1?1:2;
  for(let g=0;g<3;g++){const ix=o.map((x,i)=>grp(x)===g?i:-1).filter(i=>i>=0);if(ix.length<2)continue;
    const tot=ix.reduce((a,i)=>a+o[i].ms,0),w=ix.map(i=>o[i].ms*W(o[i].f,c)),sw=w.reduce((a,b)=>a+b,0);
    ix.forEach((i,j)=>o[i].ms=w[j]*tot/sw);}
  return o;};

/* ---- 4 · hit-stop by power ---- */
let lastStop=-9;
const _hurt=hurt;
window.hurt=hurt=function(e,mult,o){const r=_hurt(e,mult,o);
  try{if(!off()&&!window.__FEEL_NOSTOP&&window.__ACTEV&&r>0&&!(o&&o.dot)){const t=G('gameTime')||0;
    if(t-lastStop>=.1){lastStop=t;G('stop')(Math.max(45,Math.min(120,26+(mult||1)*24)));}}}catch(err){}
  return r;};

/* ---- 6 · lunge into the swing ---- */
const LUNGE=12;
const _start=startAction;
window.startAction=startAction=function(a){_start(a);if(off()||window.__FEEL_NOLUNGE||!a||a.key==='hurt'||!a.seq||!a.seq.length)return;
  const S=G('SKILLS'),sk=a.skill&&S[a.skill];
  const melee=a.key==='basic'||(sk&&sk.range&&sk.range<=140&&a.seq.every(x=>x.st==='attack'));
  if(!melee||!(a.windup>0.08))return;
  const pl=G('player');a._lg={phi:pl.phi||0,t0:Math.max(0,a.windup-.12),t1:a.windup+.02,done:0};
  const up=a.update;a.update=function(A,dt){if(up)up(A,dt);lunge(A);};};
function lunge(a){const L=a._lg;if(!L||L.done>=LUNGE-.01||a.t<L.t0)return;const pl=G('player');
  const k=Math.min(1,(a.t-L.t0)/(L.t1-L.t0)),want=LUNGE*(1-(1-k)*(1-k));   /* ease-out: fast start, brakes at contact */
  let step=want-L.done;if(step<=0)return;
  const ne=G('nearestEnemy')(pl.x,pl.y,160,L.phi);if(ne){const room=Math.hypot(ne.x-pl.x,ne.y-pl.y)-(ne.r||14)-26;step=Math.min(step,Math.max(0,room));}
  if(step<=0){L.done=LUNGE;return;}
  const nx=pl.x+Math.cos(L.phi)*step,ny=pl.y+Math.sin(L.phi)*step,bl=G('mapBlockedW');
  if(G('curMap')&&typeof bl==='function'&&bl(nx,ny)){L.done=LUNGE;return;}
  pl.x=nx;pl.y=ny;L.done+=step;}
})();
