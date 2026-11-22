/* =====================================================================
   SP RULES (owner 2026-11-22 'แก้บัค 3' — physical builds must be able to keep casting)
   At Lv 60 a STR build has ~228 SP and +6 SP per 8 s, an INT build ~400 SP and +22 per 8 s, so physical builds ran dry
   long before magic ones (with SP kept full anubis STR benched 4,532 vs INT 3,068; as it was, INT ≥ STR).
   Rule: physical skills (damage type 'p' = ATK skills: every skill of rhino / croc / cat / anubis, branch A of the two-way heroes)
   cost 40 % less SP. Magic, heal and Basic-branch ('b' = whichever power is higher) skills keep their cost.
   Applied once to the skill data (after every hero installer and skill_enh.js ran, before totem_gems.js), so cost checks,
   buttons, tooltips, gem rules (thrift, heavy …) and the bench all read the same number.
   SP_RULE.base[k] = the old cost. ?spold=1 = old costs (comparison tests).
   ===================================================================== */
(function(){if(typeof SKILLS==='undefined'||typeof skDT!=='function')return;
const MUL=.6,base={};
if(!/[?&]spold=1/.test(location.search))for(const k in SKILLS){const s=SKILLS[k];if(!s||!(s.mp>0))continue;let t;try{t=skDT(k);}catch(_){continue;}
  if(t!=='p')continue;base[k]=s.mp;s.mp=Math.max(1,Math.round(s.mp*MUL));}
window.SP_RULE={mul:MUL,base,cut:k=>!!base[k]};})();
