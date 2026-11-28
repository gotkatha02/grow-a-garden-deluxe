/* 2.5D Bastet (Daughter of Ra) extra poses (owner 2026-11-27: her ChatGPT sheets from BASTET25_POSE_PROMPTS_TH.md, Drive
   folder 'Basted'). Atlas states in assets_bastet25.js (cut by `python -X utf8 -I tools/sheet_state.py tools/clips/bastet25_<pose>.json`):
     leap 6 (① cat leap) · sign 4 (② curse point) · summon 4 (③ call from the ground) · burst 4 (④ arms-wide release) ·
     pray 4 (⑥ prayer) · drain 4 (⑦ soul drain) · hurt (⑧ one picture per view, replaces the clip-made flinch row, the engine
     plays it by itself) · ko (⑨ one picture per view, shown while the play-mode death window is open).
   No ⑤ sheet (arms raised to the sky) came, so the ults (Curse of the Pharaoh · Sekhmet's Plague Sun · Avatar of Bastet) keep
   the raise-the-book clip row.
   Every skill is bCast → buffAct (char_bastet.js): tP = a.windup = the release, the action ends at a.dur = tP + .15 s. Each skill
   keeps its action EXACTLY: the same seq total, windup, dur and events — only the frames shown change (a NEW seq array).
   The sheets are ONE view (front three-quarter facing right = SE, the engine mirrors SW / W), so a skill uses them only while
   she faces S / SE / E / SW / W (SE or SW by the horizontal side); facing N / NE / NW keeps the clip frames.
   ?bstpose=0 = the clip frames only (this file does nothing). */
(function(){
if(typeof CHAR==='undefined'||CHAR!=='bastet'||!window.BST25||/[?&]bstpose=0/.test(location.search))return;
if(typeof SPR_META==='undefined'||!SPR_META.states||!SPR_META.states.sign||!SPR_META.states.leap)return;   // atlas without the poses
const HAS=s=>!!SPR_META.states[s];
function side(){const d=player.dir;if(d==='N'||d==='NE'||d==='NW')return null;return Math.cos(player.phi)>=0?'SE':'SW';}
/* parts [[state, frame, seconds | null], ...] -> entries summing to exactly T s (null parts share what is left) */
function build(parts,d,T){T=Math.max(0,T);const fixed=parts.reduce((a,p)=>a+(p[2]==null?0:Math.max(0,p[2])),0),nf=parts.filter(p=>p[2]==null).length;
  let k=1,fill=0;if(nf){fill=Math.max(0,T-fixed)/nf;if(fixed>T)k=T/fixed;}else if(fixed>0)k=T/fixed;
  const o=parts.map(p=>({st:p[0],d,f:p[1],ms:1000*(p[2]==null?fill:Math.max(0,p[2])*k)})).filter(e=>e.ms>.01);
  const sum=o.reduce((a,e)=>a+e.ms,0);if(o.length)o[o.length-1].ms+=T*1000-sum;   // float dust onto the last entry
  return o;}
const ON={};
/* wrap SKILLS[k].make: fn(tP, V, d) returns the parts list; V = the visible time after the release (a.dur − tP) */
function swap(k,st,fn){const S=SKILLS[k];if(!S||!S.make||!HAS(st))return;const mk=S.make;ON[k]=st;
  S.make=function(c){const a=mk.apply(this,arguments);if(!a||!a.seq||!a.seq.length)return a;
    try{const d=side();if(d){const T=seqTotal(a.seq),tP=Math.min(a.windup||0,T),V=Math.max(0,Math.min(T,a.dur||T)-tP),s=build(fn(tP,V),d,T);
        if(s.length){const T2=seqTotal(s);if(Math.abs(T2-T)>1e-6)console.warn('bastet pose: seq total changed',k,T,T2);a.seq=s;a._bstPose=st;}}}catch(e){console.warn('bastet pose',k,e);}
    return a;};}

/* ① Cat's Grace (warp at tP): crouch · take-off · top of the leap · coming down before the warp; she lands crouched where
   the warp puts her, then stands. Drawn a little off the ground in the air frames (no player.z: the warp stays a warp). */
swap('bnGrace','leap',(tP,V)=>[['leap',0,.3*tP],['leap',1,.25*tP],['leap',2,.25*tP],['leap',3,.2*tP],['leap',4,Math.max(.6*V,.08)],['leap',5,null]]);
/* ② branch-A curses aimed at a target: free hand raised · pointing at the release · the lunge holds the point */
for(const k of ['baGlyph','baLink','baApep','baWrap','baLocust','bcStorm'])
  swap(k,'sign',(tP,V)=>[['sign',0,.55*tP],['sign',1,.45*tP],['sign',2,Math.max(V,.1)],['sign',3,null]]);
/* ③ branch-B summons (+ Temple Obelisk): crouched, the free hand on the ground (two breaths) · rising at the release · standing */
for(const k of ['bbMummy','bbArmy','bcLord','bbAnubis','bbGate','bnObelisk'])
  swap(k,'summon',(tP,V)=>[['summon',0,.3*tP],['summon',1,.3*tP],['summon',0,.2*tP],['summon',1,.2*tP],['summon',2,Math.max(V,.1)],['summon',3,null]]);
/* ④ releases round her: gather, arms crossed · arms flung wide at the release · hold · settle */
for(const k of ['baDoom','bbHarvest','bbScarab','bcOsiris'])
  swap(k,'burst',(tP,V)=>[['burst',0,tP],['burst',1,.4*V],['burst',2,Math.max(.6*V,.06)],['burst',3,null]]);
/* ⑥ heal / shield: hands coming together · palms pressed, eyes closed · arms opened at the release (the blessing) */
for(const k of ['bnAnkh','bcBless','bnVeil'])
  swap(k,'pray',(tP,V)=>[['pray',0,.3*tP],['pray',1,.35*tP],['pray',2,.35*tP],['pray',3,Math.max(V,.1)],['pray',3,null]]);
/* ⑦ Soul Siphon: the open hand reaches out · fingers curl at the release · the fist pulls back (the drain ticks go on after) */
swap('bbSiphon','drain',(tP,V)=>[['drain',0,.6*tP],['drain',1,.4*tP],['drain',2,Math.max(V,.1)],['drain',3,null]]);

/* ⑨ knocked out: while the play-mode death window is open she lies in the KO pose of her view */
if(HAS('ko')){let OVE;const OV=()=>{if(!OVE&&(OVE===undefined||document.readyState!=='complete'))OVE=document.getElementById('deathov')||null;return !!OVE&&OVE.style.display==='flex';};const PF=window.playerFrame;
  window.playerFrame=playerFrame=function(){if(OV()&&!player.action)return {st:'ko',d:player.dir,f:0};return PF.apply(this,arguments);};}
window.BSTPOSE={side,build,swap,ON};
})();
