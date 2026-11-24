/* =====================================================================
   ROLES — one main role per skill branch (owner 2026-11-23 17:15–17:43, 2026-11-24 'คุณตัดสินใจเลย ให้มันบาลานซ์ หลากหลาย สนุกๆ
   นี่แหละคือหัวใจความสนุกของ 12 หาง' + 'ตัวซัพกับตัวแท้งก็ทำดาเมจได้ด้วยการบิ้วของไปทางนั้น แต่ไม่เท่าตัวดาเมจ').
   Design: ROLE_SYSTEM_TH.md. Every branch (A / B) of every hero has one role; picking a branch = picking a role.
   • Damage: every hit is × the role factor of its branch (DEF[role].k × CAL). It is a MULTIPLIER, so damage gear / stats still
     raise a tank's or a support's damage — they just stay under a damage hero with the same gear.
     Basic attacks and Basic-branch skills use the BUILD role = the branch with more skill levels (test mode: the stronger power,
     pure heroes A; window.__ROLE_BR = 'A' / 'B' overrides — the bench and the skill window's test button use it).
   • Crowd control (stun / knock-up / flinch interrupt a monster): a budget per role (n = skills that keep their interrupt,
     the rest lose it, slows stay): damage / mage / support / summoner 1 · fighter / tank 2 (+ every counter) · controller all,
     and its flinches become real stuns · debuffer 0 (flinches / knock-ups become slows). Basic branch: 1.
     SK_CC is rewritten at load (tooltips show the result); SK_CC0 = the originals.
   • Monsters resist chains of control: after a stun / knock-up they ignore the next one for its length + 3 s ('ต้านทาน'),
     after a flinch the next flinch for its length + 0.7 s. Hero mechanics that set statuses themselves (grabs, statues, sleep,
     boss open windows) are not touched.
   • KO gauge drain × role (controller 1.5 · tank 1.25 · fighter 1 · debuffer .9 · summoner .8 · damage / mage .7 · support .5).
   • Max HP: base HP per level + role HP per level (× (1 + VIT/100) like the base, RO job style): tank +10 · fighter +4 ·
     support +3 · controller +2 · damage / mage −2. Tank build: every monster hit −Lv × 0.4 (flat).
   window.ROLES {R, DEF, role, roleOfKey, buildBr, brOf, dmgK, kOfSkill, ccGate, hpLv, chip, info}
   ===================================================================== */
(function(){
if(typeof SKILLS==='undefined'||/[?&]roles=0/.test(location.search))return;   /* ?roles=0 = the game without roles (comparison tests) */
const R={wolf:{A:'fight',B:'mage'},rhino:{A:'tank',B:'ctrl'},owl:{A:'dmg',B:'ctrl'},jaguar:{A:'dmg',B:'debuf'},croc:{A:'fight',B:'ctrl'},
  axolotl:{A:'mage',B:'sup'},cat:{A:'dmg',B:'fight'},hippo:{A:'tank',B:'ctrl'},sheep:{A:'sup',B:'debuf'},dragon:{A:'fight',B:'mage'},
  lion:{A:'tank',B:'mage'},kitsune:{A:'mage',B:'debuf'},bastet:{A:'debuf',B:'summ'},anubis:{A:'fight',B:'dmg'},raven:{A:'dmg',B:'mage'},
  wukong:{A:'dmg',B:'summ'},drake:{A:'fight',B:'ctrl'}};
/* k = damage vs a fighter (bench targets at Lv 60, best damage build: damage 2,450 · mage 2,250 · fighter 2,050 · summoner 1,950 ·
   debuffer 1,800 · controller 1,650 · tank 1,500 · support 1,400) */
const DEF={
  dmg:  {th:'ดาเมจ',en:'Striker',c:'#ff6b4a',k:1.2, ko:.7, hp:-2,n:1,d:'ตีแรงเป้าเดียวที่สุด · ตัวบาง · ขัดจังหวะได้ท่าเดียว'},
  mage: {th:'ยิงเวท',en:'Mage',c:'#6fb8ff',k:1.1, ko:.7, hp:-2,n:1,d:'ตีหมู่แรง พื้นที่กว้าง · ตัวบาง · มีสโลว์ ขัดจังหวะได้ท่าเดียว'},
  fight:{th:'ไฟต์เตอร์',en:'Fighter',c:'#ffab4a',k:1,   ko:1,  hp:4, n:2,d:'ตีพอดี ทนพอดี ลุยหน้า · ชะงักได้ 2 ท่า'},
  tank: {th:'แท้ง',en:'Tank',c:'#d8b26a',k:.73,ko:1.25,hp:10,n:2,cut:.4,d:'HP สูงมาก โดนตีเบาลงทุกครั้ง · ตีเบา · สวนกลับ'},
  ctrl: {th:'สตั้น',en:'Controller',c:'#ffe066',k:.8, ko:1.5,hp:2, n:99,boost:1,d:'ทุกท่าควบคุม ชะงักกลายเป็นสตั้นจริง · ตีไม่แรง'},
  debuf:{th:'ดีบัฟ',en:'Debuffer',c:'#c38aff',k:.88,ko:.9, hp:0, n:0,soft:1,d:'คำสาป สโลว์ ทำให้อ่อน · ไม่มีสตั้น'},
  sup:  {th:'ซัพพอร์ต',en:'Support',c:'#7ce88a',k:.68,ko:.5, hp:3, n:1,d:'ฮีล บัฟ ทนทาน ตายยาก · ตีเบา'},
  summ: {th:'อัญเชิญ',en:'Summoner',c:'#e8b87a',k:.95,ko:.8, hp:0, n:1,d:'ลูกน้องสู้แทน ล่อมอน · ตัวเองบาง'}};
/* per-branch calibration so every branch lands on its role target (measured with tools/roles/role_bench.py) */
const CAL={rhino:{B:.55},wolf:{B:.869},cat:{B:.882},dragon:{A:1.105},axolotl:{B:3.27},jaguar:{A:1.058,B:1.066},sheep:{B:1.067},
  lion:{A:1.052},raven:{A:1.045},hippo:{B:.946},owl:{B:.955}};   /* 2026-11-24 role bench RUNS 3 (tools/roles/role_bench.py); axolotl B = a pure healer: aimed at 1,100 (+ the biggest heal) */
const role=b=>{const h=R[CHAR];return (h&&h[b==='B'?'B':'A'])||'fight';};
const brOf=k=>{if(!k||k==='basic')return 'basic';const s=SKILLS[k];if(!s)return 'basic';let b=s.br;
  if(b==='C')b=s.col||(typeof skCol==='function'&&skCol(k))||'basic';return b==='A'||b==='B'?b:'basic';};
/* the build's branch: more skill levels in A or B (C nodes, Basic branch and enhancements do not count) */
let _bb='A',_bt=-1;
function calcBuild(){let a=0,b=0;if(!(typeof testMode!=='undefined'&&testMode))for(const k in SKILLS){const s=SKILLS[k];if(!s||!(LV[k]>0)||s.br==='C'||s.br==='basic'||s.enh)continue;
    if(s.br==='A')a+=LV[k];else if(s.br==='B')b+=LV[k];}
  if(a!==b)return a>b?'A':'B';
  /* a tie: test mode (every skill maxed) or a new hero → two-way heroes by their stronger power, pure heroes A */
  const ab=['wolf','jaguar','owl','hippo','dragon','lion','raven','drake'].includes(CHAR);
  return ab&&typeof D!=='undefined'&&D&&D.mag>D.patk?'B':'A';}
function buildBr(){const o=window.__ROLE_BR;if(o==='A'||o==='B')return o;const t=performance.now();if(t-_bt>300){_bt=t;_bb=calcBuild();}return _bb;}
const roleOfKey=k=>{const b=brOf(k);return role(b==='basic'?buildBr():b);};
const K=b=>{const r=role(b),c=CAL[CHAR];return DEF[r].k*((c&&c[b])||1);};
/* which branch a hit belongs to: its skill > an explicit branch > a normal attack > the skill being cast > Basic */
function hitBr(o){const k=o.skill||(o.owShot&&o.owShot.key)||null;
  if(k&&SKILLS[k])return brOf(k);
  if(o.br==='A'||o.br==='B')return o.br;
  if(o.auto)return 'basic';
  const k2=window.SKCTX||(typeof player!=='undefined'&&player.action&&player.action.skill);
  return k2&&SKILLS[k2]?brOf(k2):'basic';}
function dmgK(o){let b=hitBr(o);if(b==='basic')b=buildBr();return K(b);}
function kOfSkill(k){let b=brOf(k);if(b==='basic')b=buildBr();return K(b);}

/* ---------------- crowd control budget ---------------- */
const SK_CC0={},STRIP=new Set(),STATIC=new Set();
const intr=c=>!!(c&&(c.stun||c.air||c.flinch));
const COUNTER=/counter|reprisal|retribution|revenge|parry|riposte|reversal|สวน/i;
const strip=c=>{const o={};if(c.slow)o.slow=c.slow;return Object.keys(o).length?o:null;};
const toSlow=c=>{if(!intr(c))return c;return {slow:Math.max(c.slow||0,2)};};
const boost=c=>{const o={...c};if(o.flinch&&!o.stun){o.stun=+Math.min(1.6,Math.max(.9,o.flinch*3)).toFixed(2);delete o.flinch;}
  if(o.air&&!o.stun)o.stun=.9;if(o.slow)o.slow=+(o.slow*1.5).toFixed(2);return o;};
const STRICT={debuf:0,dmg:1,mage:1,sup:1,summ:1,fight:2,tank:2,ctrl:3};
function basicRole(){const a=role('A'),b=role('B');return STRICT[a]<=STRICT[b]?a:b;}
const _ko0=window.skKO;
function prio(k){const s=SKILLS[k]||{},c=SK_CC0[k]||{};return (s.ult?1000:0)+(_ko0?_ko0(k):1)*10+(c.air?5:c.stun?4:c.flinch?2:0)+(s.cd||0)*.1;}
function filterCC(){if(typeof SK_CC==='undefined')return;
  for(const k in SK_CC0){if(SK_CC0[k])SK_CC[k]=SK_CC0[k];}STRIP.clear();STATIC.clear();
  const cols={A:[],B:[],basic:[]},cn=[];
  for(const k in SKILLS){const c=SK_CC[k];if(!c)continue;if(!(k in SK_CC0))SK_CC0[k]=c;STATIC.add(k);if(!intr(c))continue;
    if(SKILLS[k].br==='C'&&!SKILLS[k].ult)cn.push(k);else cols[brOf(k)].push(k);}
  const put=(k,out)=>{if(out)SK_CC[k]=out;else{delete SK_CC[k];STRIP.add(k);}};
  const ctr=k=>{const s=SKILLS[k]||{};return COUNTER.test(k+' '+(s.name||'')+' '+(s.th||''));};
  for(const col in cols){const rl=col==='basic'?basicRole():role(col),Dr=DEF[rl];
    const n=col==='basic'?Math.min(1,Dr.n):Dr.n;let kept=0;
    cols[col].sort((a,b)=>prio(b)-prio(a)).forEach(k=>{const c=SK_CC0[k];let out;
      if(Dr.soft)out=toSlow(c);
      else if(Dr.boost&&col!=='basic')out=boost(c);
      else if((rl==='tank'||rl==='fight')&&ctr(k))out=c;   /* counters keep their interrupt (not counted) */
      else if(kept<n){out=c;kept++;}
      else out=strip(c);
      put(k,out);});}
  /* C nodes (not ultimates): the column's rule, kept only for roles that hold 2+ interrupts */
  for(const k of cn){const col=brOf(k),rl=col==='basic'?basicRole():role(col),Dr=DEF[rl],c=SK_CC0[k];
    put(k,Dr.soft?toSlow(c):(Dr.boost&&col!=='basic')?boost(c):Dr.n>=2?c:strip(c));}}
filterCC();
/* hits whose control comes from the hero's own code (o.cc) or normal attacks (SK_CC.basic): the role rule live */
function liveRule(cc,k,o){const b=(!k||k==='basic'||o.auto)?buildBr():(brOf(k)==='basic'?buildBr():brOf(k)),rl=role(b),Dr=DEF[rl];
  if(o.auto||k==='basic')return (rl==='fight'||rl==='tank'||rl==='ctrl')?cc:strip(cc);
  if(Dr.soft)return toSlow(cc);
  if(Dr.boost)return boost(cc);
  if(rl==='fight'||rl==='tank')return cc;
  return strip(cc);}
const RES_HARD=3,RES_FL=.7;
function ccGate(e,cc,o){if(!cc||!e)return cc;
  const k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX||(o.auto?'basic':null);
  if(k&&STRIP.has(k))return null;
  if(!(k&&STATIC.has(k)&&SK_CC[k]===cc))cc=liveRule(cc,k,o);
  if(!cc)return null;const t=gameTime;
  if(cc.stun||cc.air){
    if((e._ccRes||0)>t){const c2=strip(cc);if((e._resT||0)<t){e._resT=t+.9;resLabel(e);}cc=c2;}
    else e._ccRes=t+(cc.stun?(e.boss?cc.stun*.5:cc.stun):.7)+RES_HARD;}
  if(cc&&cc.flinch){if((e._flRes||0)>t){const c2={...cc};delete c2.flinch;cc=Object.keys(c2).length?c2:null;}else e._flRes=t+cc.flinch+RES_FL;}
  return cc;}
function resLabel(e){try{const z=(typeof MSPR_H==='function'?MSPR_H(e):(e.boss?62:48))+8+(e.z||0);const d=addFx(new DText({x:e.x+36,y:e.y,z,text:'ต้านทาน',color:'#aab6cc',size:12,life:.8}));if(d)d.dx=0;}catch(_){}}
/* KO gauge drain × role */
if(_ko0){window.skKO=k=>{const v=_ko0(k);return v*DEF[roleOfKey(k==='basic'?null:k)].ko;};}

/* ---------------- rapid hits: one number per target ----------------
   'dot' hits (ticks of breaths, ultimates, DoTs, copies) landing on the same target within .28 s show as ONE number. */
if(typeof dmgNum==='function'){const _dn=dmgNum;window.dmgNum=dmgNum=function(x,y,z,val,kind,o){
  if(o&&o._dot&&o.who&&kind!=='miss'&&+val>0){const e=o.who;e._rdS=(e._rdS||0)+(+val);if(!e._rdK)e._rdK=kind;
    if(!(e._rdT>gameTime)){e._rdT=gameTime+.28;setFxTimer(.28,()=>{const v=Math.round(e._rdS||0),k=e._rdK||'hit';e._rdS=0;e._rdK=null;if(v>0)_dn(e.x,e.y,z,v,k,{scale:.95,who:e});});}
    return {dx:0,t:0};}
  return _dn.apply(this,arguments);};}

/* ---------------- toughness ---------------- */
function hpLv(){return DEF[role(buildBr())].hp||0;}
{const _ab=window.ENH_ABSORB;window.ENH_ABSORB=function(d){d=_ab?_ab(d):d;if(!(d>0))return d;const r=DEF[role(buildBr())];
  if(r.cut)d=Math.max(1,d-Math.round(PS.lv*r.cut));return d;};}
/* the build role changed (skill points moved, the test button) → Max HP follows */
let _last=null;setInterval(()=>{try{const b=buildBr();if(_last!==null&&b!==_last&&typeof applyStats==='function'){applyStats();}_last=b;}catch(_){}},1000);

/* ---------------- looks: role chips ---------------- */
const ICO={
  dmg:'<path d="M3 13 L11 5 L13 3 L13 5 L5 13 Z M2 12 L4 14 M3.5 10.5 L5.5 12.5" stroke="currentColor" stroke-width="1.6" fill="currentColor" stroke-linejoin="round"/>',
  mage:'<path d="M8 1.5 L9.6 6.4 L14.5 8 L9.6 9.6 L8 14.5 L6.4 9.6 L1.5 8 L6.4 6.4 Z" fill="currentColor"/>',
  fight:'<path d="M3.5 6.5 h7 a2 2 0 0 1 2 2 v3 a3 3 0 0 1 -3 3 h-3 a3 3 0 0 1 -3 -3 Z M5 6.5 v-2.5 M7.5 6.5 v-3 M10 6.5 v-2.5" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  tank:'<path d="M8 1.5 L13.5 3.5 V8 C13.5 11.2 11 13.6 8 14.6 C5 13.6 2.5 11.2 2.5 8 V3.5 Z" fill="currentColor"/>',
  ctrl:'<path d="M8 2 L9.2 5.6 L13 5.6 L10 7.9 L11.1 11.6 L8 9.4 L4.9 11.6 L6 7.9 L3 5.6 L6.8 5.6 Z" fill="currentColor"/><circle cx="8" cy="13.6" r="1.3" fill="currentColor"/>',
  debuf:'<path d="M8 1.8 C10.5 5.2 12.6 7.6 12.6 10.2 A4.6 4.6 0 0 1 3.4 10.2 C3.4 7.6 5.5 5.2 8 1.8 Z" fill="currentColor"/><path d="M6 10.3 h4" stroke="#1a1020" stroke-width="1.4"/>',
  sup:'<path d="M6.3 2 h3.4 v4.3 H14 v3.4 H9.7 V14 H6.3 V9.7 H2 V6.3 H6.3 Z" fill="currentColor"/>',
  summ:'<path d="M8 2.5 C10.8 2.5 12.5 4.6 12.5 7.4 V13.5 L11 12.3 L9.5 13.5 L8 12.3 L6.5 13.5 L5 12.3 L3.5 13.5 V7.4 C3.5 4.6 5.2 2.5 8 2.5 Z" fill="currentColor"/><circle cx="6.4" cy="7.2" r="1" fill="#1a1020"/><circle cx="9.6" cy="7.2" r="1" fill="#1a1020"/>'};
const svg=r=>`<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" style="vertical-align:-2px">${ICO[r]||''}</svg>`;
function chip(hero,b,big){const h=R[hero];if(!h)return '';const r=h[b==='B'?'B':'A'],d=DEF[r];
  return `<rl-c class="${big?'big':''}" style="--rc:${d.c}" title="${d.th} — ${d.d}">${svg(r)}${d.th}</rl-c>`;}
function info(hero,b){const h=R[hero];if(!h)return null;const r=h[b==='B'?'B':'A'];return {key:r,...DEF[r]};}
const css=document.createElement('style');css.textContent=`
rl-c{display:inline-flex!important;align-items:center;gap:3px;padding:0 7px 0 5px!important;height:17px;border-radius:9px;font-size:11px!important;font-weight:700;line-height:17px;
  color:var(--rc)!important;background:rgba(22,13,6,.86)!important;border:1px solid var(--rc);white-space:nowrap;vertical-align:1px;letter-spacing:.2px;text-shadow:none!important;box-shadow:0 1px 2px rgba(0,0,0,.35)}
rl-c svg{flex:none}
rl-c.big{height:21px;line-height:21px;font-size:13px!important;padding:0 9px 0 6px!important}
.tt-tab rl-c{margin-left:5px;height:16px;line-height:16px;font-size:10px!important;padding:0 6px 0 4px!important}
.tt-tab rl-c svg{width:11px;height:11px}
.rl-line{margin:3px auto 7px;max-width:94%;font-size:12px;line-height:1.4;color:#f6ead0;text-align:center;background:rgba(28,17,8,.78);border-radius:9px;padding:4px 8px 5px;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.rl-line rl-c{margin-right:6px}
.rl-line .rlt{display:inline-block;margin-left:6px;padding:0 8px;height:18px;line-height:17px;font-size:11px;border-radius:9px;border:1px solid #ffd36a;
  background:rgba(40,26,8,.9);color:#ffd36a;cursor:pointer;vertical-align:1px}
.rl-line .rlt.on{background:#ffd36a;color:#2a1806}
#ccov .cc-info rl-c{margin:0 4px 0 0}
@media (max-height:520px){.tt-tab rl-c{display:none!important}.rl-line{font-size:11px;padding:2px 6px}}`;document.head.appendChild(css);
/* skill window: chip on the A / B tabs + the branch's role under its title (test mode: a button that plays this role) */
if(typeof buildSkillWin==='function'){const _b=buildSkillWin;window.buildSkillWin=buildSkillWin=function(){_b.apply(this,arguments);try{decorate();}catch(_){}};}
function decorate(){const w=document.getElementById('skw');if(!w||!w.classList.contains('open'))return;
  w.querySelectorAll('.tt-tab[data-br]').forEach(t=>{const b=t.dataset.br;if((b==='A'||b==='B')&&!t.querySelector('rl-c'))t.insertAdjacentHTML('beforeend',chip(CHAR,b));});
  const on=w.querySelector('.tt-tab.on'),b=on&&on.dataset.br,ti=w.querySelector('.tt-ti');if(!ti||w.querySelector('.rl-line'))return;
  let h;if(b==='A'||b==='B'){const r=DEF[role(b)],cur=buildBr()===b;
    h=`${chip(CHAR,b,1)}${r.d}${testMode?`<span class="rlt${cur?' on':''}" data-rb="${b}" title="โหมดทดสอบ: ใช้บทบาทของสายนี้กับการตีธรรมดา / สายเบสิก / HP">${cur?'✔ ใช้บทบาทนี้อยู่':'ทดสอบบทบาทนี้'}</span>`:cur?' <small style="color:#ffd36a">(บทบาทตอนนี้)</small>':''}`;}
  else if(b==='basic'){const cb=buildBr();h=`สายเบสิกใช้บทบาทของสายที่ลงแต้มมากกว่า: ${chip(CHAR,cb,1)}`;}
  if(!h)return;ti.insertAdjacentHTML('afterend',`<div class="rl-line">${h}</div>`);
  const bt=w.querySelector('.rl-line .rlt');if(bt)bt.onclick=ev=>{ev.stopPropagation();window.__ROLE_BR=bt.dataset.rb;_bt=-1;applyStats();buildSkillWin();};}
setTimeout(()=>{try{if(typeof applyStats==='function'){applyStats();if(typeof player!=='undefined'&&player.hp>player.maxHp)player.hp=player.maxHp;}}catch(_){}},0);
window.ROLES={R,DEF,CAL,role,roleOfKey,buildBr,brOf,hitBr,dmgK,kOfSkill,ccGate,hpLv,chip,info,filterCC,SK_CC0,STRIP,basicRole};
})();
