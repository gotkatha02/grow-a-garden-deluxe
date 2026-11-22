/* =====================================================================
   AETHERFALL — SKILL RULES: damage type (physical / magic / heal) + crowd control
   ---------------------------------------------------------------------
   • Physical ('p') damage scales with ATK (โจมตี), magic ('m') with MATK (เวท), heals ('h') with MATK.
     Magic hits show BLUE numbers and cannot crit; physical hits can crit.
   • Branch rule: Wolf / Jaguar / Owl → class A physical, class B magic.
     Rhino and Croc are pure physical classes; Axolotl is a pure water-magic class (class B heals).
     SK_DT below overrides single skills (C skills, special cases).
   • KO gauge (SK_KO): every hit drains it; empty = 1.5 s stun, then it refills. Skills no longer stun directly.
   • Crowd control (SK_CC): stun (KO only) = can't move or act · slow = moves slower · air = knocked up (can't act until it lands)
     · flinch = short stagger. Only stun / air / flinch interrupt a cast or a monster's attack wind-up —
     a normal hit never does. Bosses: stun is halved, knock-up becomes a flinch.
   ===================================================================== */
(function(){
const DT_CHAR={wolf:'AB',jaguar:'AB',owl:'AB',rhino:'p',croc:'p',axolotl:'m',cat:'p',hippo:'AB',sheep:'m',dragon:'AB',lion:'AB',kitsune:'m',bastet:'m',anubis:'p'};
/* single-skill overrides */
const SK_DT={
  // wolf C (enhancements / new actives follow the element they belong to)
  hoarfrostEdge:'m',runicDetonation:'m',glacialPath:'m',stormChain:'m',frostbloodPact:'m',worldstorm:'m',
  // jaguar C
  jcResidue:'m',jcSeal:'m',jcCorridor:'m',jcChain:'m',jcEternal:'m',
  // jaguar C (12 nodes): Basic column = best of ATK/MATK, A = ATK, B = MATK
  jcEndlessHunt:'b',jcEcho:'p',jcMirage:'b',jcSkyPounce:'p',jcRhythm:'b',jcThousand:'p',jcTotem:'b',jcGodfall:'p',
  // owl C
  ocMastery:'b',ocExtra:'p',ocDouble:'m',ocMantle:'b',ocTwin:'p',ocErase:'m',ocFan:'b',ocNight:'p',ocPerma:'m',ocHunt:'b',ocMoonfall:'m',ocAvalanche:'m',
  // axolotl heals
  asDrop:'h',asBlessing:'h',asMist:'h',asPurify:'h',asCushion:'h',asLift:'h',asMending:'h',asSoothing:'h',asShared:'h',
  asFloat:'h',asBloom:'h',asCascade:'h',asLastDrop:'h',asRenewal:'h',asMiracle:'h',acRipple:'h',acRestore:'h',acRecycle:'h',
  acRapid:'h',acInfinite:'h',acSpring:'h',acMembrane:'h',
};
/* crowd control per skill: {stun:sec} {slow:sec} {air:1} {flinch:sec} (can combine) */
const SK_CC={
  // ---- wolf ----
  armorBreak:{flinch:.5},wolfFinale:{air:1},revengeBreaker:{flinch:.45},cycloneLeap:{air:1},executioner:{flinch:.5},
  predatorsLeap:{flinch:.45},valhallasWrath:{air:1},frostFang:{slow:2.5},iceBreak:{flinch:.5},runeBurst:{air:1},
  thunderFang:{flinch:.45},lightningPursuit:{flinch:.4},shatterPulse:{air:1},runeStorm:{flinch:.35},blizzard:{slow:2},
  frozenDescent:{flinch:.45},thunderSpear:{flinch:.45},tempestField:{slow:2},ragnaroksJudgment:{air:1},ravenousLeap:{flinch:.45},
  // ---- jaguar ----
  jgExpose:{flinch:.45},jgRending:{flinch:.35},jgFinalTalon:{air:1},jgReprisal:{flinch:.45},jgSpiral:{air:1},jgDrop:{flinch:.45},
  jgThrone:{air:1},jgTwilight:{slow:2},jgVenom:{slow:2.5},jgBloom:{flinch:.4},jgEBackstab:{flinch:.45},jgShatter:{air:1},
  jgMoonTrap:{flinch:.45},jgSnare:{slow:3},jgNightfall:{flinch:.35},jgPhantom:{flinch:.45},jgSunEater:{air:1},jgHorizon:{slow:2.5},
  jgFifthSun:{flinch:.45},jcSkyPounce:{flinch:.45},jcSeal:{flinch:.4},
  // ---- rhino ----
  rhCharge:{air:1},rhCounter:{flinch:.45},rhCrusher:{flinch:.5},rhCrushCounter:{flinch:.45},rhQuake:{air:1},rhRetribution:{flinch:.5},
  rhPulse:{slow:2},rhUppercut:{air:1},rhMeteor:{flinch:.45},rhBone:{flinch:.5},rhRush:{flinch:.4},rhShaker:{air:1},
  rhSeismic:{flinch:.45},rhAvalanche:{slow:2.5},rhFinale:{flinch:.45},rhSkybreaker:{air:1},rhWorldbreaker:{air:1},
  rcGrip:{flinch:.45},rcTotem:{slow:2.5},rcGlacier:{air:1},
  // ---- axolotl ----
  axPop:{flinch:.35},axDrill:{flinch:.3},axDrillBurst:{air:1},axSlap:{flinch:.45},axRebound:{flinch:.35},axSaw:{slow:2},
  axCollapse:{air:1},axGyro:{slow:2},axReverse:{flinch:.4},axCompress:{flinch:.45},axDeep:{slow:2.5},axCannon:{air:1},axHeart:{flinch:.45},
  // ---- croc ----
  crTail:{flinch:.45},crBite:{flinch:.45},caImpale:{flinch:.45},caCrescent:{slow:2},caHook:{flinch:.5},caFracture:{flinch:.45},
  caFinish:{air:1},caBoundary:{slow:2},caRain:{slow:2},caExecution:{flinch:.45},caSunpiercer:{air:1},cbJaw:{flinch:.4},
  cbLock:{flinch:.45},cbShake:{flinch:.45},cbTailBreaker:{air:1},cbBodyCrush:{flinch:.45},cbAmbush:{air:1},cbRoll:{flinch:.45},
  cbDrag:{slow:2.5},cbSnap:{flinch:.45},cbLunge:{air:1},cbFrenzy:{flinch:.45},ccReversal:{air:1},
  // ---- owl ----
  oaHeavy:{flinch:.45},oaDrill:{flinch:.4},oaExec:{flinch:.45},oaLast:{air:1},obWhite:{slow:2.5},obSnare:{flinch:.45},
  obSkyfall:{flinch:.35},obVolley:{slow:2},obShatter:{flinch:.45},obCircle:{flinch:.3},
};

/* ---------------- KO GAUGE ----------------
   Every hit drains the monster's KO gauge: KO = damage multiplier × 7 × skill KO power, reduced by the monster's DEF.
   Gauge 0 → KO stun 1.5 s, then the gauge refills to full. Heavy skills (leaps, slams, uppercuts, charges, ultimates) drain far more.
   SK_KO = KO power per skill (1 = normal). Not listed → guessed from the skill's name / effect. */
const SK_KO={
  // wolf
  predatorsLeap:3.2,cycloneLeap:3.2,valhallasWrath:4,wolfFinale:2.6,revengeBreaker:2.6,executioner:2,armorBreak:2,frozenDescent:3.2,
  shatterPulse:2.6,runeBurst:2.4,thunderSpear:2.4,ragnaroksJudgment:4,ravenousLeap:3,iceBreak:1.6,axeCyclone:1.4,
  // jaguar
  jgDrop:3.2,jcSkyPounce:3.2,jgThrone:4,jgFinalTalon:2.4,jgSpiral:2.4,jgReprisal:2.2,jgShatter:2.4,jgFifthSun:4,jgSunEater:3,jgMoonTrap:2,
  // rhino (bruiser: big KO on everything heavy)
  rhCharge:3,rhUppercut:3.2,rhMeteor:3.6,rhShaker:3.2,rhQuake:3.2,rhSkybreaker:3.6,rhWorldbreaker:4.5,rhFinale:3,rhCrushCounter:2.6,
  rhCounter:2.2,rhHammer:2.2,rhBone:2.2,rhRush:2,rhAvalanche:2.4,rhSeismic:2.2,rhKnuckle:1.8,rcGrip:3,rcGlacier:3,rhFist:1.3,
  // axolotl
  axCannon:3,axCollapse:3,axDrillBurst:2.4,axSlap:2.2,axCompress:2.2,axHeart:2.4,
  // croc
  caSunpiercer:4,caExecution:3,caFinish:2.6,cbLunge:3,cbAmbush:2.8,cbTailBreaker:2.8,cbBodyCrush:2.6,cbRoll:2.6,cbFrenzy:3.2,cbLock:2.2,
  crTail:1.8,crBite:1.8,caImpale:1.8,ccReversal:2.6,cbSnap:2,
  // owl (precise shooter: little KO except heavy bolts)
  oaHeavy:2.4,oaDrill:1.8,oaLast:3.5,oaExec:2.4,obShatter:2.4,obSkyfall:1.4,obFlurry:.6,
};
function skKO(k){if(!k||k==='basic')return 1;if(SK_KO[k]!=null)return SK_KO[k];const s=(typeof SKILLS!=='undefined')&&SKILLS[k];if(!s)return 1;
  if(s.ult)return 4;const n=(s.name||'')+' '+(s.th||'');
  if(/leap|slam|smash|quake|meteor|uppercut|crush|drop|pounce|charge|break|impact|hammer|ทุบ|กระโดด|กระแทก|พุ่งชน/i.test(n))return 2.6;
  const cc=SK_CC[k];if(cc&&cc.air)return 2.4;if(cc&&cc.flinch)return 1.6;return 1;}
const KO_LV=v=>v>=3.5?['สูงมาก','#ff6a4a']:v>=2.4?['สูง','#ffa04a']:v>=1.5?['กลาง','#ffd36a']:v>=.9?['ปกติ','#cfd6e0']:['ต่ำ','#8a94a8'];
/* 12 Tails rule: a build goes one way. Pure classes use one stat for everything (ATK or MATK).
   Two-way classes (A = ATK, B = MATK): the normal attack and Basic-branch skills use whichever power is higher ('b'),
   so an ATK build and a MATK build both keep a working basic kit. */
function skCol(k){try{for(const L of [typeof HP_DEFS!=='undefined'&&HP_DEFS,typeof KT_DEFS!=='undefined'&&KT_DEFS,typeof SP_DEFS!=='undefined'&&SP_DEFS,typeof DG_DEFS!=='undefined'&&DG_DEFS,typeof LI_DEFS!=='undefined'&&LI_DEFS,typeof KI_DEFS!=='undefined'&&KI_DEFS,typeof BA_DEFS!=='undefined'&&BA_DEFS,typeof ANU_DEFS!=='undefined'&&ANU_DEFS,typeof CRX_DEFS!=='undefined'&&CRX_DEFS]){if(!L)continue;const d=L.find(x=>x.key===k);if(d&&d.col)return d.col;}}catch(_){}return null;}
/* owner 2026-11-19 (two-way heroes): normal attack = ATK only · magic-looking skills = MATK only ·
   physical-looking skills ('x') = ATK 30% + MATK power 70% (MIX below) · Basic-branch 'b' = the higher of the two */
const MIX={atk:.3,tal:.7};
function skDT(k){const t=skDT0(k),r=DT_CHAR[CHAR]||'p';return r==='AB'&&t==='p'&&k&&k!=='basic'?'x':t;}
function skDT0(k){
  const r=DT_CHAR[CHAR]||'p';
  if(!k||k==='basic')return r==='AB'?'p':r==='m'?'m':'p';
  if(SK_DT[k])return SK_DT[k];
  if(r!=='AB')return r;
  const s=(typeof SKILLS!=='undefined')&&SKILLS[k];if(!s)return 'p';
  if(s.br==='B')return 'm';
  if(s.br==='basic')return 'b';
  if(s.br==='C'){const col=s.col||skCol(k);if(col)return col==='B'?'m':col==='A'?'p':'b';const n=(s.name||'')+' '+(s.th||'');return /frost|ice|rune|thunder|storm|lightning|blizzard|snow|shadow|venom|eclipse|moon|น้ำแข็ง|สายฟ้า|เงา|พิษ/i.test(n)?'m':'p';}
  return 'p';}
/* damage type from a hurt() call: explicit magic flag > the skill behind the hit > its branch */
function hitType(o){const t=hitType0(o),r=DT_CHAR[CHAR]||'p';
  if(r==='AB'&&t==='p'&&!o.auto){const k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX;if(k&&k!=='basic')return 'x';if(!k&&o.br&&o.br!=='basic')return 'x';}
  return t;}
function hitType0(o){
  if(o.magic!==undefined)return o.magic?'m':'p';
  const k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX;
  if(k)return skDT(k)==='h'?'m':skDT(k);
  const r=DT_CHAR[CHAR]||'p';
  if(o.auto)return r==='m'?'m':'p';
  if(o.br&&r==='AB')return o.br==='B'?'m':o.br==='A'?'p':'b';
  return r==='m'?'m':r==='AB'?'b':'p';}
/* 'b' resolves to the higher of the two powers */
function hitIsMagic(o){const t=hitType(o);return t==='m'||(t==='b'&&typeof D!=='undefined'&&D.mag>D.patk);}
function hitCC(o){const k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX;return (k&&SK_CC[k])||o.cc||null;}
const CCTXT={stun:['สตั้น','#ffe066'],slow:['สโลว์','#9fe6ff'],air:['ลอย!','#ffb36a'],flinch:['ชะงัก','#ffd0a0']};
const CCLINE=c=>Object.entries(c).map(([k,v])=>k==='air'?'ยกลอย':`${CCTXT[k][0]} ${v} วิ`).join(' + ');
function skTypeHTML(k){const s=SKILLS[k];if(!s)return '';const t=skDT(k),cc=SK_CC[k];
  const T=t==='x'?`<span style="color:#ffcf8a;font-weight:700">ดาเมจกายภาพผสม</span> · <b style="color:#ffb36a">ATK 30%</b> + <b style="color:#7ec8ff">MATK 70%</b>`
    :t==='b'?`<span style="color:#e8d8ff;font-weight:700">ดาเมจตามสายที่บิ้ว</span> · ใช้ <b style="color:#ffb36a">ATK</b> หรือ <b style="color:#7ec8ff">MATK</b> ที่สูงกว่า`
    :t==='m'?`<span style="color:#7ec8ff;font-weight:700">ดาเมจเวท</span> · แรงขึ้นตาม <b style="color:#7ec8ff">MATK</b>`
    :t==='h'?`<span style="color:#8dff7a;font-weight:700">ฮีล</span> · ฮีลมากขึ้นตาม <b style="color:#8dff7a">MATK</b>`
    :`<span style="color:#ffb36a;font-weight:700">ดาเมจกายภาพ</span> · แรงขึ้นตาม <b style="color:#ffb36a">ATK</b>`;
  const s2=SKILLS[k],kv=skKO(k),[kn,kc]=KO_LV(kv),KO=(s2.passive&&!s2.make)?'':` · KO: <b style="color:${kc}">${kn}</b>`;
  return `<div class="tl" style="margin:3px 0">${T}${KO}${cc?` · สถานะ: <b style="color:#ffe066">${CCLINE(cc)}</b>`:''}</div>`;}
function skTypeText(k){const t=skDT(k),cc=SK_CC[k];return (t==='x'?'ดาเมจกายภาพผสม (ATK 30% + MATK 70%) · พลาดได้ (HIT)':t==='b'?'ดาเมจตามสายที่บิ้ว (ATK หรือ MATK ที่สูงกว่า)':t==='m'?'ดาเมจเวท (อัป INT) · โดนเสมอ':t==='h'?'ฮีล (อัป INT)':'ดาเมจกายภาพ (อัป STR) · พลาดได้ (HIT)')+(t!=='h'?' · KO '+KO_LV(skKO(k))[0]:'')+(cc?' · สถานะ: '+CCLINE(cc):'');}
Object.assign(window,{MIX,SK_KO,skKO,KO_LV,SK_DT,SK_CC,skDT,hitType,skCol,hitIsMagic,hitCC,CCTXT,skTypeHTML,skTypeText});
window.SKCTX=null;
})();
