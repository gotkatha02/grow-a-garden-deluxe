/* Jaguar extra poses (owner 2026-11-26 07:13–07:14: his 8 sheets made from JAGUAR_POSE_PROMPTS_TH.md).
   Atlas states in assets_jaguar.js (cut by `python3 -I tools/sheet_state.py tools/clips/jaguar_<pose>.json`):
     pounce 8 · dash 4 · guard 4 · roar 4 · cast 4 · throw 4 · spin 4 (S E N W views); the sitting views are hero_sit.js's.
   Each skill below keeps its action EXACTLY: the same seq total, the same events, dash and hit times — only the frames
   shown change (a.seq is rebuilt after the skill's own make; nothing reads its indices for these skills).
   The sheets are ONE view (front three-quarter facing right = SE, the engine mirrors SW / W), so a skill uses them only
   while she faces S / SE / E / SW / W (SE or SW by the horizontal side); facing N / NE / NW keeps the old frames.
   The spin has 4 views and turns with her from any facing (clockwise on screen, like the game's Cyclone).
   The cast bar of Fifth Sun / Throne / Spirit / Blood Moon Hunt shows the cast / crouch pose instead of buff frames 0-2.
   ?jgpose=0 = the old frames. */
(function(){
if(typeof CHAR==='undefined'||CHAR!=='jaguar'||/[?&]jgpose=0/.test(location.search))return;
if(typeof SPR_META==='undefined'||!SPR_META.states||!SPR_META.states.pounce||!SPR_META.states.spin)return;   // atlas without the poses
const PI=Math.PI;
/* the pose side for the current facing: SE / SW, or null (facing away: keep the old frames) */
function side(){const d=player.dir;if(d==='N'||d==='NE'||d==='NW')return null;return Math.cos(player.phi)>=0?'SE':'SW';}
/* parts [[state, frame, seconds | null, dir?], ...] -> entries summing to exactly T s (null parts share what is left) */
function build(parts,d,T){const fixed=parts.reduce((a,p)=>a+(p[2]==null?0:p[2]),0),nf=parts.filter(p=>p[2]==null).length;
  let k=1,fill=0;if(nf){fill=Math.max(0,T-fixed)/nf;if(fixed>T)k=T/fixed;}else if(fixed>0)k=T/fixed;
  const o=parts.map(p=>({st:p[0],d:p[3]||d,f:p[1],ms:1000*(p[2]==null?fill:p[2]*k)})).filter(e=>e.ms>.01);
  const sum=o.reduce((a,e)=>a+e.ms,0);if(o.length)o[o.length-1].ms+=T*1000-sum;   // float dust onto the last entry
  return o;}
/* the entries of s that lie before time t (the one crossing t cut there) */
function head(s,t){const o=[];let u=0;for(const e of s){const L=e.ms/1000;if(u+L<=t){o.push(e);u+=L;continue;}if(t>u)o.push(Object.assign({},e,{ms:(t-u)*1000}));break;}return o;}
/* replace what is left of a running action from now on (total time unchanged) */
function tail(a,parts,d){const T=seqTotal(a.seq),now=Math.min(a.t,T),h=head(a.seq,now);a.seq=h.concat(build(parts,d,Math.max(.001,T-now)));}
function wrapUpd(a,f){const u=a.update;a.update=function(a2,dt){const r=u?u.apply(this,arguments):undefined;try{f(a2||a,dt);}catch(e){console.warn('jaguar pose',a.key,e);}return r;};}
const ON={};
/* wrap SKILLS[k].make: fn(a, d, T) returns the new seq (or null = keep); any:1 = also when she faces away (d = null) */
function swap(k,fn,o={}){const S=SKILLS[k];if(!S||!S.make)return;const mk=S.make;ON[k]=1;
  S.make=function(c){const a=mk.apply(this,arguments);if(!a||!a.seq||!a.seq.length)return a;
    try{const d=side();if(d||o.any){const T=seqTotal(a.seq),s=fn(a,d,T,c);if(s&&s.length){a.seq=s;a._jgPose=1;}}}catch(e){console.warn('jaguar pose',k,e);}
    return a;};}

/* ---- leaps: Predator Drop / Sky-Pounce ------------------------------------------------------------------------------
   the flight (dashUpd 0 / t0 .. tL = a.windup) = take-off · rise · apex dive · dive down; from the landing (tL, the hit)
   the landing crouch, rise, ready. In-air frames are anchored on the lowest foot (the game lifts her by player.z). */
const FLIGHT=F=>[['pounce',1,.16*F],['pounce',2,.24*F],['pounce',3,.22*F],['pounce',4,.38*F]];
const LAND=[['pounce',5,.2],['pounce',6,.12],['pounce',7,null]];
swap('jgDrop',(a,d,T)=>{const tL=a.windup;return build([...FLIGHT(tL),...LAND],d,T);});
swap('jcSkyPounce',(a,d,T)=>{const tL=a.windup,pk=bPeak(player.dir),i0=seqIndex(a.seq,'buff',Math.min(2,pk),1),t0=i0>0?seqTimeAt(a.seq,i0):Math.min(.25,tL*.3);
  return build([['pounce',0,t0],...FLIGHT(tL-t0),...LAND],d,T);});

/* ---- dashes: Jaguar Step / Blood Chase (walk row ×3.6 before) · Shadow Slip arrives in the sliding stop ---------------- */
swap('jgStep',(a,d,T)=>build([['dash',0,.15*T],['dash',1,.3*T],['dash',2,.35*T],['dash',3,null]],d,T));
swap('jgBloodChase',(a,d,T)=>build([['dash',0,.12*T],['dash',1,.3*T],['dash',2,.33*T],['dash',3,null]],d,T));
swap('jgSlip',(a,d,T)=>build([['dash',3,null]],d,T));

/* ---- guards: Countercut / Obsidian Parry hold the crossed daggers (breathing f2 / f3); a counter or a parry that
   lands switches to the wide deflect (f4) — after Countercut's side-step she faces the enemy again ---------------------- */
function guardParts(T){const p=[['guard',0,.08]];let t=.08,i=0;while(t<T-1e-4){const s=Math.min(.18,T-t);p.push(['guard',1+(i%2),s]);t+=s;i++;}return p;}
function deflect(flag){return a=>{wrapUpd(a,a2=>{if(!a2[flag]||a2._jgDf)return;a2._jgDf=1;const d=side();
  if(d)tail(a2,[['guard',3,null]],d);else{const T=seqTotal(a2.seq),now=Math.min(a2.t,T);a2.seq=head(a2.seq,now).concat(hold('buff',player.dir,2,Math.max(1,(T-now)*1000)));}});};}
swap('jgCountercut',(a,d,T)=>{deflect('cc')(a);return build(guardParts(T),d,T);});
swap('jgParry',(a,d,T)=>{deflect('blocked')(a);return build(guardParts(T),d,T);});
swap('jgMirror',(a,d,T)=>{const tP=a.windup;return build([['guard',0,.5*tP],['guard',1,null]],d,T);});

/* ---- roars: Predator's Cry / Savage Tempo (buffAct: tP = a.windup = the moment the buff lands) -------------------- */
const roar=(a,d,T)=>{const tP=a.windup,r=Math.max(0,T-tP);return build([['roar',0,.45*tP],['roar',1,.55*tP],['roar',2,Math.min(.3,.6*r)],['roar',3,null]],d,T);};
swap('jgCry',roar);swap('jgTempo',roar);
/* Hunter's Focus: eyes closed, gathering — then the fierce crouch when the eyes light up */
swap('jgFocus',(a,d,T)=>{const tP=a.windup;return build([['cast',0,tP],['roar',0,null]],d,T);});

/* ---- casts --------------------------------------------------------------------------------------------------------- */
const castBig=(a,d,T)=>{const tP=a.windup,r=Math.max(0,T-tP);return build([['cast',0,.45*tP],['cast',1,.55*tP],['cast',2,Math.min(.25,.6*r)],['cast',3,null]],d,T);};
for(const k of ['jcTotem','jcPact','jcSpirit'])swap(k,castBig);
swap('jgVeil',(a,d,T)=>{const tP=a.windup;return build([['cast',0,.55*tP],['cast',1,null]],d,T);});
swap('jgNightfall',(a,d,T)=>build([['cast',0,.4*T],['cast',1,null]],d,T));
swap('jgPhantom',(a,d,T)=>build([['cast',0,.5*T],['cast',1,null]],d,T));
/* Eclipse of the Fifth Sun: raise (tA = T − the 2.6 s hold), then the eclipse cast pulses through the hold */
swap('jgFifthSun',(a,d,T)=>{const tA=Math.max(.1,T-2.6),p=[['cast',0,.45*tA],['cast',1,.55*tA]];let t=tA,i=0;
  while(t<T-1e-4){const s=Math.min(.2,T-t);p.push(['cast',2+(i%2),s]);t+=s;i++;}return build(p,d,T);});

/* ---- throws: Obsidian Seal / Moon Trap (buffAct, the thing leaves at tP) · Mirror Shatter (shards .08, hit .2) ------- */
const toss=(a,d,T)=>{const tP=a.windup,r1=Math.max(.02,tP-.06),r=Math.max(0,T-r1);return build([['throw',0,r1],['throw',1,Math.min(.16,.45*r)],['throw',2,Math.min(.12,.3*r)],['throw',3,null]],d,T);};
swap('jcSeal',toss);swap('jgMoonTrap',toss);
swap('jgShatter',(a,d,T)=>build([['throw',0,.05],['throw',1,.15],['throw',2,.15],['throw',3,null]],d,T));

/* ---- Jaguar Cyclone: one full turn per hit (n hits = n turns), clockwise on screen from her own facing ------------- */
swap('jgCyclone',(a,d,T)=>{const lv=Math.max(1,Math.min(3,LV.jgCyclone||1)),n=[3,4,5][lv-1],q0=((Math.round(player.phi/(PI/2))%4)+4)%4,VIEW=[1,0,3,2],p=[];   // q: 0 E · 1 S · 2 W · 3 N → spin frame
  for(let i=0;i<4*n;i++)p.push(['spin',VIEW[(q0+i)%4],T/(4*n),'S']);return build(p,'S',T);},{any:1});

/* ---- Throne of Claws: crouch until she vanishes (a.windup), dash afterimages during the cuts (the Ghost snapshots
   take her frame: they turn to her live facing), sliding stop when she reappears (a.dur − .92), then the wide guard --- */
swap('jgThrone',(a,d,T)=>{const tV=a.windup,tE=a.dur,tR=Math.max(tV,tE-.92),p=[['pounce',0,tV]];let t=tV,i=0;
  while(t<tR-1e-4){const s=Math.min(.085,tR-t);p.push(['dash',1+(i%2),s]);t+=s;i++;}
  p.push(['dash',3,Math.min(.2,T-tR)],['guard',3,null]);const s=build(p,d,T);
  wrapUpd(a,a2=>{if(a2.t>=tR&&!player.jgHide&&!a2._jgRe){a2._jgRe=1;const d2=side();if(d2){for(const e of a2.seq)if(e.st==='dash'&&e.f===3||e.st==='guard')e.d=d2;}
      else{const now=Math.min(a2.t,T);a2.seq=head(a2.seq,now).concat(hold('buff',player.dir,bPeak(player.dir),Math.max(1,(T-now)*1000)));}}
    else if(a2.t>=tV&&a2.t<tR&&player.jgHide){const r=seqAt(a2.seq,a2.t);if(r.e.st==='dash')r.e.d=Math.cos(player.phi)>=0?'SE':'SW';}});
  return s;});

/* ---- the cast bar (before the action starts) ------------------------------------------------------------------------ */
const CASTPOSE={jgFifthSun:['cast',0],jcSpirit:['cast',0],jcTotem:['cast',0],jgThrone:['pounce',0]};
const PF=window.playerFrame;
window.playerFrame=function(){const c=player.casting;if(!player.action&&c&&CASTPOSE[c.key]){const d=side();if(d)return {st:CASTPOSE[c.key][0],d,f:CASTPOSE[c.key][1]};}return PF.apply(this,arguments);};
window.JGPOSE={side,build,head,swap,ON};
})();
