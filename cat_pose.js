/* 2.5D Nekomata cat extra poses (owner 2026-11-27 09:35: his sheets made from CAT25_POSE_PROMPTS_TH.md + a hurt and a KO
   sheet of his own). Atlas states in assets_cat25.js (cut by `python3 -I tools/sheet_state.py tools/clips/cat25_<pose>.json`):
     charge 8 (the iaido stance, same roles as the old one: ktChargeSeq in char_cat.js uses it by itself) · jump 6 · dash 4 ·
     roll 4 · spin 4 (S E N W views) · throw 4 · roar 4 · chop 6 · hurt (one picture per view, the engine's hit flinch) ·
     ko (one picture per view, shown while the play-mode death window is open).
   Each skill keeps its action EXACTLY: the same seq total, windup, dur, events, dash and hit times — only the frames shown
   change (a NEW seq array is built). Strikes whose attack frames are replaced keep their contact times in a._ctT (cat_vfx.js
   leadOf reads them, so the sword arcs still land on the hit) and a._melee0 (feel_hits.js keeps their lunge); the chop
   strikes draw their arc top-down (a._ktShape 'down').
   The sheets are ONE view (front three-quarter facing right = SE, the engine mirrors SW / W), so a skill uses them only while
   the cat faces S / SE / E / SW / W (SE or SW by the horizontal side); facing N / NE / NW keeps the clip frames. The roll and
   the spin turn with every facing. ?catpose=0 = the clip frames only (this file does nothing). */
(function(){
if(typeof CHAR==='undefined'||CHAR!=='cat'||!window.CAT25||/[?&]catpose=0/.test(location.search))return;
if(typeof SPR_META==='undefined'||!SPR_META.states||!SPR_META.states.chop||!SPR_META.states.jump)return;   // atlas without the poses
const PI=Math.PI,HAS=s=>!!SPR_META.states[s];
function side(){const d=player.dir;if(d==='N'||d==='NE'||d==='NW')return null;return Math.cos(player.phi)>=0?'SE':'SW';}
/* parts [[state, frame, seconds | null, dir?], ...] -> entries summing to exactly T s (null parts share what is left) */
function build(parts,d,T){T=Math.max(0,T);const fixed=parts.reduce((a,p)=>a+(p[2]==null?0:Math.max(0,p[2])),0),nf=parts.filter(p=>p[2]==null).length;
  let k=1,fill=0;if(nf){fill=Math.max(0,T-fixed)/nf;if(fixed>T)k=T/fixed;}else if(fixed>0)k=T/fixed;
  const o=parts.map(p=>({st:p[0],d:p[3]||d,f:p[1],ms:1000*(p[2]==null?fill:Math.max(0,p[2])*k)})).filter(e=>e.ms>.01);
  const sum=o.reduce((a,e)=>a+e.ms,0);if(o.length)o[o.length-1].ms+=T*1000-sum;   // float dust onto the last entry
  return o;}
/* the entries of s that lie before time t (the one crossing t cut there), copied */
function head(s,t){const o=[];let u=0;for(const e of s){const L=e.ms/1000;if(u+L<=t+1e-9){o.push(Object.assign({},e));u+=L;continue;}if(t>u)o.push(Object.assign({},e,{ms:(t-u)*1000}));break;}return o;}
function wrapUpd(a,f){const u=a.update;a.update=function(a2,dt){const r=u?u.apply(this,arguments):undefined;try{f(a2||a,dt);}catch(e){console.warn('cat pose',a.key,e);}return r;};}
/* the contact times of a crStrike-built action (attack frame CT of its own direction, every swing) */
function contacts(a){const o=[];try{const ct=CT(atkDir(player.dir));for(let i=0;i<12;i++){const k=seqIndex(a.seq,'attack',ct,i);if(k<0)break;o.push(seqTimeAt(a.seq,k));}}catch(_){}return o;}
const ON={};
/* wrap SKILLS[k].make: fn(a, d, T, c) returns the new seq (or null = keep); o.any = every facing (d = 'SE' / 'SW' by side) */
function swap(k,fn,o={}){const S=SKILLS[k];if(!S||!S.make||(o.need||[]).some(s=>!HAS(s)))return;const mk=S.make;ON[k]=1;
  S.make=function(c){const a=mk.apply(this,arguments);if(!a||!a.seq||!a.seq.length)return a;
    try{const d=side()||(o.any?(Math.cos(player.phi)>=0?'SE':'SW'):null);if(d){const T=seqTotal(a.seq),m0=a.seq.every(x=>x.st==='attack'||x.st==='charge'),ct=contacts(a),s=fn(a,d,T,c);
        if(s&&s.length){const T2=seqTotal(s);if(Math.abs(T2-T)>1e-6)console.warn('cat pose: seq total changed',k,T,T2);a.seq=s;a._ktPose=1;
          if(a._melee0==null)a._melee0=m0;if(ct.length&&!a._ctT)a._ctT=ct;if(o.trail===0)a.trailWin=null;if(o.shape)a._ktShape=o.shape;}}}catch(e){console.warn('cat pose',k,e);}
    return a;};}

/* ---- dashes: Cat Step / Mirage Step (ktDash on the walk row ×3 before): one running stride over the dash, then the sliding
   stop; the afterimages ktDash leaves take the frame shown (they used walk frame 0) ----------------------------------- */
function ghostFrame(a){wrapUpd(a,()=>{const g=fx[fx.length-1];if(g&&g.constructor&&g.constructor.name==='KtGhost'&&g.st==='walk'&&!(g.t>0)){const fr=playerFrame();g.st=fr.st;g.f=fr.f;g.d=fr.d;}});}
const dash=TD=>(a,d,T)=>{ghostFrame(a);const t=Math.min(TD,T);return build([['dash',0,.3*t],['dash',1,.35*t],['dash',2,.35*t],['dash',3,null]],d,T);};
swap('knStep',dash(.22),{need:['dash']});swap('kaMirage',dash(.2),{need:['dash']});
/* Nekomata Roll (the hurt row ×1.6 before): dive · ball · ball upside down · crouch, from any facing */
swap('kcRoll',(a,d,T)=>{ghostFrame(a);return build([['roll',0,.16*T],['roll',1,.26*T],['roll',2,.28*T],['roll',3,null]],d,T);},{any:1,need:['roll']});

/* ---- leaps: Sky Drop (after the iaido stance, the leap = the last .28 s before the hit) · Earthfall (leap from the start) --
   take-off · rising, sword overhead · top of the leap; from the hit the landing cut, then rising. In-air frames are anchored
   on the hips over the lowest foot (the game lifts the cat by player.z). */
function leap(a,d,T,t0){const w=a.windup,F=Math.max(.001,w-t0),pre=head(a.seq,t0).map(e=>e.st==='attack'?Object.assign(e,{st:'jump',d,f:0}):e),
    land=Math.max(0,(a.dur||T)-w);
  return pre.concat(build([['jump',1,.2*F],['jump',2,.3*F],['jump',3,null]],d,F),build([['jump',4,Math.min(.2,.7*land)],['jump',5,null]],d,T-w));}
swap('kbSky',(a,d,T)=>leap(a,d,T,Math.max(0,a.windup-.28)),{need:['jump']});
swap('kbEarth',(a,d,T)=>leap(a,d,T,0),{need:['jump']});

/* ---- heavy downward cuts: Mountain Cleave / Final Cleave / Oni Executioner (after the iaido stance) · Quake Slash ----------
   the draw-cut clip rose; these now raise the sword overhead and cut DOWN (contact = the end of the cut, deep lunge) */
function chop(a,d,T){const w=a.windup;let ts=0;for(const e of a.seq){if(e.st!=='charge')break;ts+=e.ms/1000;}ts=Math.min(ts,w);
  const W=w-ts,after=Math.max(0,(a.dur||T)-w),wind=W>=.15?[['chop',0,.18*W],['chop',1,.32*W],['chop',2,.25*W],['chop',3,null]]:[['chop',1,.5*W],['chop',3,null]];
  return head(a.seq,ts).concat(build(wind,d,W),build([['chop',4,.65*after],['chop',5,null]],d,T-w));}
for(const k of ['kbCleave','kbFinal','kbExec','kbQuake'])swap(k,chop,{need:['chop'],shape:'down'});

/* ---- Grinding Wheel: every turn = the 4 spin views (S E N W), clockwise on screen from his own facing like the clip
   frames of the 8 directions did (cat_vfx on: SP .11 s a turn, 3 turns, then the clip's follow-through) -------------- */
swap('kbWheel',(a,d,T)=>{if(!(window.KTV&&KTV.on))return null;const s=a.seq;if(s.length<25)return null;const SP=s.slice(0,8).reduce((u,e)=>u+e.ms,0)/1000;
  const q0=((Math.round(player.phi/(PI/2))%4)+4)%4,VIEW=[1,0,3,2],p=[];   // q: 0 E · 1 S · 2 W · 3 N → spin frame
  for(let r=0;r<3;r++)for(let i=0;i<4;i++)p.push(['spin',VIEW[(q0+r*4+i)%4],SP/4,'S']);
  return build(p,'S',3*SP).concat(s.slice(24).map(e=>Object.assign({},e)));},{any:1,need:['spin']});

/* ---- Kasa Throw (buffAct, the hat leaves at .6 tP) · Oni Roar / Ashura Mask (buffAct: tP = the moment the buff lands) ---- */
swap('kcKasa',(a,d,T)=>{const r1=a.windup*.6;return build([['throw',0,.45*r1],['throw',1,.55*r1],['throw',2,Math.min(.12,.4*(T-r1))],['throw',3,null]],d,T);},{need:['throw'],trail:0});
const roar=(a,d,T)=>{const tP=a.windup,r=Math.max(0,T-tP);return build([['roar',0,.45*tP],['roar',1,.55*tP],['roar',2,Math.min(.3,.6*r)],['roar',3,null]],d,T);};
swap('kbRoar',roar,{need:['roar'],trail:0});swap('kbAshura',roar,{need:['roar'],trail:0});

/* ---- Avalanche Rush: the run (walk row ×3 before) = running strides; the slam at the end (tEnd + .02 = windup + .44)
   = the end of a downward cut ---------------------------------------------------------------------------------------- */
swap('kcAvalanche',(a,d,T)=>{const s=a.seq;let i=0,t=0;while(i<s.length&&s[i].st!=='walk'){t+=s[i].ms/1000;i++;}if(i>=s.length)return null;
  let L=0,j=i;while(j<s.length&&s[j].st==='walk'){L+=s[j].ms/1000;j++;}
  const run=[];let u=0,n=0;while(u<L-1e-6){const m=Math.min(.075,L-u);run.push(['dash',n%3,m]);u+=m;n++;}
  const tS=a.windup+.44,rest=Math.max(0,T-t-L),pre=Math.max(0,Math.min(rest,tS-t-L));
  return head(s,t).concat(build(run,d,L),build([['chop',3,pre],['chop',4,Math.min(.25,Math.max(0,rest-pre)*.6)],['chop',5,null]],d,rest));},{need:['dash','chop']});

/* ---- knocked out: while the play-mode death window is open the cat lies in the KO pose of his view --------------------- */
if(HAS('ko')){let OVE;const OV=()=>{if(!OVE&&(OVE===undefined||document.readyState!=='complete'))OVE=document.getElementById('deathov')||null;return !!OVE&&OVE.style.display==='flex';};const PF=window.playerFrame;
  window.playerFrame=playerFrame=function(){if(OV()&&!player.action)return {st:'ko',d:player.dir,f:0};return PF.apply(this,arguments);};}
window.CATPOSE={side,build,head,swap,ON};
})();
