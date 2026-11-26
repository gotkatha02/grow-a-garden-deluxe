/* 2.5D wolf extra poses (owner 2026-11-26 11:45: his pose sheets made from WOLF25_POSE_PROMPTS_TH.md).
   Atlas states in assets_wolf25_pose.js (merged into the WLF atlas by index.html; cut by
   `python3 -I tools/sheet_state.py tools/clips/wolf25_<pose>.json`): jump 6 · howl 4 · charge 4 · dash 4 · guard 4 · spin 4
   (S E N W views); the sitting views are hero_sit.js's (assets/sit/wolf25_*.webp).
   Each skill keeps its action EXACTLY: the same seq total, windup, dur, events, dash and hit times — only the frames shown
   change. A new seq array is built (the old entries stay untouched, so closures that kept the original array — Wolf Finale's
   and the strike skills' slash paths — read the frames they always did). Strike skills keep their last wind-up frame and the
   contact frame (slashAt reads a.seq round the contact index).
   The sheets are ONE view (front three-quarter facing right = SE, the engine mirrors SW / W), so a skill uses them only while
   the wolf faces S / SE / E / SW / W (SE or SW by the horizontal side); facing N / NE / NW keeps the old frames. The dash is a
   side view (E / W by the horizontal side, not when he runs straight up or down). The spin has 4 views and turns with every
   facing. ?wpose=0 = the old frames (the pose file is not loaded). */
(function(){
if(typeof CHAR==='undefined'||CHAR!=='wolf'||/[?&]wpose=0/.test(location.search))return;
if(typeof SPR_META==='undefined'||!SPR_META.states||!SPR_META.states.jump||!SPR_META.states.spin)return;   // atlas without the poses
function side(){const d=player.dir;if(d==='N'||d==='NE'||d==='NW')return null;return Math.cos(player.phi)>=0?'SE':'SW';}
function dside(){const d=player.dir;if(d==='N'||d==='S')return null;return Math.cos(player.phi)>=0?'E':'W';}
/* parts [[state, frame, seconds | null, dir?], ...] -> entries summing to exactly T s (null parts share what is left) */
function build(parts,d,T){const fixed=parts.reduce((a,p)=>a+(p[2]==null?0:p[2]),0),nf=parts.filter(p=>p[2]==null).length;
  let k=1,fill=0;if(nf){fill=Math.max(0,T-fixed)/nf;if(fixed>T)k=T/fixed;}else if(fixed>0)k=T/fixed;
  const o=parts.map(p=>({st:p[0],d:p[3]||d,f:p[1],ms:1000*(p[2]==null?fill:p[2]*k)})).filter(e=>e.ms>.01);
  const sum=o.reduce((a,e)=>a+e.ms,0);if(o.length)o[o.length-1].ms+=T*1000-sum;   // float dust onto the last entry
  return o;}
function head(s,t){const o=[];let u=0;for(const e of s){const L=e.ms/1000;if(u+L<=t){o.push(e);u+=L;continue;}if(t>u)o.push(Object.assign({},e,{ms:(t-u)*1000}));break;}return o;}
function tail(a,parts,d){const T=seqTotal(a.seq),now=Math.min(a.t,T),h=head(a.seq,now);a.seq=h.concat(build(parts,d,Math.max(.001,T-now)));}
function wrapUpd(a,f){const u=a.update;a.update=function(a2,dt){const r=u?u.apply(this,arguments):undefined;try{f(a2||a,dt);}catch(e){console.warn('wolf pose',a.key,e);}return r;};}
const copy=s=>s.map(e=>Object.assign({},e));
const ON={};
/* wrap SKILLS[k].make: fn(a, d, T, c) returns the new seq (or null = keep); o.dash = side view dir; o.any = every facing */
function swap(k,fn,o={}){const S=SKILLS[k];if(!S||!S.make)return;const mk=S.make;ON[k]=1;
  S.make=function(c){const a=mk.apply(this,arguments);if(!a||!a.seq||!a.seq.length)return a;
    try{const d=o.any?'S':(o.dash?dside():side());if(d){const T=seqTotal(a.seq),s=fn(a,d,T,c);
        if(s&&s.length){const T2=seqTotal(s);if(Math.abs(T2-T)>1e-6)console.warn('wolf pose: seq total changed',k,T,T2);a.seq=s;a._wPose=1;}}}catch(e){console.warn('wolf pose',k,e);}
    return a;};}

/* ---- howls (buffAct: tP = a.windup = the moment the buff lands) -------------------------------------------------------
   War Howl / Fenrir's Spirit / War Banner: stand · head up · full howl from the buff on · head coming down.
   War Fury: stand, then the snarl (frame 4) from 60 % of the wind-up to the end. */
const howl=(a,d,T)=>{const tP=a.windup,r=Math.max(0,T-tP);return build([['howl',0,.35*tP],['howl',1,.65*tP],['howl',2,.7*r],['howl',1,null]],d,T);};
swap('warHowl',howl);swap('fenrirsSpirit',howl);swap('warBanner',howl);
swap('warFury',(a,d,T)=>{const tP=a.windup;return build([['howl',0,.6*tP],['howl',3,null]],d,T);});

/* ---- guards: Iron Counter holds the braced guard; a block switches to the 'hit absorbed' shout · Rune Guard raises the
   axe as a shield, then braces · Rune Burst braces, then the counter swing when the runes burst (tP) ------------------- */
swap('ironCounter',a=>{wrapUpd(a,a2=>{if(!a2.blocked||a2._wBl)return;a2._wBl=1;const d=side();if(d)tail(a2,[['guard',2,null]],d);});
  const d=side(),T=seqTotal(a.seq);return build([['guard',0,Math.min(.08,.2*T)],['guard',1,null]],d,T);});
swap('runeGuard',(a,d,T)=>{const tP=a.windup;return build([['guard',0,.5*tP],['guard',1,null]],d,T);});
swap('runeBurst',(a,d,T)=>{const tP=a.windup;return build([['guard',1,tP],['guard',3,null]],d,T);});

/* ---- dashes: Battle Step (moves over 0 .. .85 T) / Storm Step (moves over 0 .. .38 T, then slides on) ---------------- */
swap('battleStep',(a,d,T)=>build([['dash',0,.12*T],['dash',1,.3*T],['dash',2,.33*T],['dash',3,null]],d,T),{dash:1});
swap('stormStep',(a,d,T)=>build([['dash',0,.06*T],['dash',1,.14*T],['dash',2,.18*T],['dash',3,null]],d,T),{dash:1});

/* ---- leaps: in-air frames are anchored on the lowest foot (the game lifts him by player.z) ------------------------------
   Predator's Leap: flies 0 .. tL (= a.windup, the hit) · Cyclone Leap: up 0 .. .26, down to .38 = a.windup
   Ravenous Leap: crouch (prep) · rise · hang — its contact frames round the impact stay (its slash reads a.seq there). */
const LAND=[['jump',4,.16],['jump',5,null]];
swap('predatorsLeap',(a,d,T)=>{const tL=a.windup;return build([['jump',0,.08*tL],['jump',1,.22*tL],['jump',2,.34*tL],['jump',3,.36*tL],...LAND],d,T);});
swap('cycloneLeap',(a,d,T)=>{const tL=a.windup;return build([['jump',1,.3*tL],['jump',2,.38*tL],['jump',3,.32*tL],...LAND],d,T);});
swap('ravenousLeap',(a,d,T)=>{const s=a.seq,ct=CT(atkDir(player.dir)),i=s.findIndex(e=>e.st==='attack'&&e.f===Math.max(0,ct-1));if(i<1)return null;
  const tHang=seqTimeAt(s,i),tJ=a.windup-.09-.58;if(!(tJ>0&&tHang>tJ))return null;
  return build([['jump',0,tJ],['jump',1,Math.min(.24,tHang-tJ)],['jump',2,null]],d,tHang).concat(copy(s.slice(i)));});

/* ---- charges: Executioner (the chop at .7 speed): the charge stance replaces the wind-up frames before the last one ----
   Wolf Finale: the charge replaces the buff raise (its slash path reads its own original array) ---------------------- */
swap('executioner',(a,d,T)=>{const s=a.seq,ct=CT(atkDir(player.dir)),kC=s.findIndex(e=>e.st==='attack'&&e.f===ct);if(kC<2)return null;
  /* one charge frame per replaced entry, each keeping its time: slashAt(a, kC) reads a.seq by the original index */
  return s.map((e,j)=>j<kC-1?{st:'charge',d,f:Math.min(3,Math.floor(j*4/(kC-1))),ms:e.ms}:Object.assign({},e));});
swap('wolfFinale',(a,d,T)=>{const s=a.seq,i=s.findIndex(e=>e.st==='attack');if(i<1)return null;const tB=seqTimeAt(s,i);
  return build([['charge',0,.2*tB],['charge',1,.2*tB],['charge',2,.25*tB],['charge',3,null]],d,tB).concat(copy(s.slice(i)));});

/* ---- Axe Cyclone: every spin entry (one sprite direction per 55 ms, clockwise) shows the spin view of its direction;
   the closing attack frames stay ------------------------------------------------------------------------------------- */
const VIEW={E:1,SE:1,S:0,SW:0,W:3,NW:3,N:2,NE:2};
swap('axeCyclone',a=>{const s=a.seq,n=s.findIndex((e,i)=>i>0&&e.f!==CT(e.d));const m=n<0?s.length:n;
  return s.map((e,i)=>i<m?{st:'spin',d:'S',f:VIEW[e.d]??0,ms:e.ms}:Object.assign({},e));},{any:1});

window.WPOSE={side,dside,build,head,swap,ON};
})();
