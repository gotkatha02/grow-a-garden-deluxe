/* =====================================================================
   STAT HELP (owner 2026-11-22 'แก้บัค 2'): a new hero starts with 48 unspent stat points (+4–14 every level) and nothing
   pointed at them — until they were spent the first monster took about a minute to kill.
   • red dot on the STATUS menu button (PC grid + phone) while points can be spent
   • chat hint after a level-up / on load (at most once every 2 minutes)
   • status window: '✦ ลงแต้มแนะนำ' buttons that spend the free points toward the hero's best build of a branch
     (REC below = the best build per hero / branch from tools/qa/build_matrix.py; two-way heroes get one button per branch,
     the branch the player has put more skill levels into is marked). Points already spent are never taken back.
   window.STH {rec, plan, spend, can}
   ===================================================================== */
(function(){
if(typeof PS==='undefined'||typeof pointsLeft!=='function')return;
/* best build per branch at Lv 60 (2026-11-22, after branch A = ATK / branch B = MATK, the SP rule and the retune — build_matrix.py):
   [branch ('' = any), preset, label]; the first option of a one-branch hero = CHAR_PRESET, the build the new-player guide (guide.js) teaches.
   The rhino gets two: tank (VIT) and damage (STR, ~35 % more damage, less HP); the cat AGI and STR (STR ~7 % more damage, AGI faster / dodges). */
const REC={wolf:[['A','STR'],['B','INT']],jaguar:[['A','AGI'],['B','INT']],owl:[['A','DEX'],['B','INT']],hippo:[['A','STR'],['B','INT']],
  dragon:[['A','STR'],['B','INT']],lion:[['A','STR'],['B','INT']],kitsune:[['','INT']],bastet:[['','INT']],sheep:[['','INT']],axolotl:[['','INT']],
  anubis:[['','STR']],croc:[['','STR']],cat:[['','AGI'],['','STR']],rhino:[['','VIT','ถึก (แทงก์)'],['','STR']]};
const BNAME={STR:'ตีแรง',AGI:'ว่องไว',INT:'เวท',VIT:'ถึก',DEX:'แม่น',LUK:'ดวง',INTDEX:'เวทแม่น'};
const PRE=n=>PRESETS[n]?n:(n==='INTDEX'?'INT':'STR');
const minCost=()=>{let m=1e9;for(const k of STATK)if(PS[k]<SYS.max)m=Math.min(m,statCost(PS[k]));return m;};
const can=()=>pointsLeft()>=minCost();
const recOf=()=>REC[CHAR]||[['',(typeof CHAR_PRESET!=='undefined'&&CHAR_PRESET[CHAR])||'STR']];
/* which branch has the player put more skill levels into (A / B), null on a tie (test mode maxes everything) */
function branchNow(){let a=0,b=0;for(const k in SKILLS){const s=SKILLS[k];if(!s||!(LV[k]>0)||s.br==='C'||s.br==='basic')continue;if(s.br==='A')a+=LV[k];else if(s.br==='B')b+=LV[k];}
  return a>b?'A':b>a?'B':null;}
/* spend the free points toward presetAt(build, Lv): always raise the stat furthest below its target (relative), then the main stat */
function plan(name){const T=presetAt(PRE(name),PS.lv),o={};for(const k of STATK)o[k]=PS[k];let left=pointsLeft();
  for(let g=0;g<4000;g++){let best=null,bv=-1;for(const k of STATK){if(o[k]>=SYS.max||o[k]>=T[k])continue;const c=statCost(o[k]);if(c>left)continue;const v=(T[k]-o[k])/Math.max(1,T[k]);if(v>bv){bv=v;best=k;}}
    if(!best)break;left-=statCost(o[best]);o[best]++;}
  for(const k of STATK.slice().sort((a,b)=>T[b]-T[a]))while(o[k]<SYS.max&&statCost(o[k])<=left){left-=statCost(o[k]);o[k]++;}
  return o;}
function diff(o){return STATK.filter(k=>o[k]!==PS[k]).map(k=>`${STLAB[k]||k.toUpperCase()} ${PS[k]} → ${o[k]}`);}
function spend(name){const o=plan(name),d=diff(o);if(!d.length)return false;for(const k of STATK)PS[k]=o[k];PS._pre=PRE(name);applyStats();
  if(typeof chatLog==='function')chatLog('sys',`✦ ลงแต้มแนะนำ (${BNAME[name]||name}): ${d.join(' · ')}`);if(typeof msg==='function')msg('ลงแต้มสถานะแล้ว ✦');
  try{if(window.AFProgress)AFProgress.save();}catch(_){}return true;}
/* buttons for the status window (index.html buildStatus calls html / bind) */
function html(){if(!can())return '';const R=recOf(),bn=branchNow(),hasBr=R.some(r=>r[0]);
  return `<div class="sth">${R.map(([br,n,lab],i)=>{const o=plan(n),d=diff(o),on=hasBr?(br===bn||(!bn&&i===0)):i===0;
    return `<button class="sthb${on?' on':''}" data-rec="${n}" title="${d.join('&#10;')}"><b>✦ ลงแต้มแนะนำ</b><small>${br?'สาย '+br+' · ':''}${lab||BNAME[n]||n} (${n==='INTDEX'?'INT+DEX':n})</small></button>`;}).join('')}</div>`;}
function bind(w){w.querySelectorAll('.sthb').forEach(b=>b.onclick=()=>{spend(b.dataset.rec);if(typeof buildStatus==='function')buildStatus();});}
const css=document.createElement('style');css.textContent=`
#mgrid button[data-m="statb"]{position:relative}
#mgrid button.stDot::after{content:'!';position:absolute;left:-3px;top:-3px;right:auto;width:15px;height:15px;border-radius:50%;background:#ff3a2a;color:#fff;font:900 11px/15px Mali,Sarabun,sans-serif;text-align:center;
  box-shadow:0 0 0 2px #fff,0 0 7px #ff4a3a;animation:stDot 1s infinite alternate;pointer-events:none;z-index:3}
@keyframes stDot{from{transform:scale(.85)}to{transform:scale(1.15)}}
.sth{display:flex;flex-direction:column;gap:5px;margin-top:3px}
.sthb{display:flex;flex-direction:column;align-items:center;gap:1px;width:100%;padding:5px 6px;line-height:1.15;white-space:normal;cursor:pointer;
  font:700 11.5px Mali,Sarabun,sans-serif;color:#5a3410;background:linear-gradient(#fff8e6,#f1dcb0);border:2px solid #b98a4a;border-radius:10px;box-shadow:0 2px 0 #8a5a24}
.sthb b{font-size:12px;font-weight:800}.sthb small{font-size:10.5px;font-weight:700;opacity:.8}
.sthb:hover{filter:brightness(1.06)}.sthb:active{transform:translateY(1px);box-shadow:0 1px 0 #8a5a24}
.sthb.on{background:linear-gradient(#fff0b8,#f3c45a);border-color:#a8741c;color:#3a2408;box-shadow:0 2px 0 #7a4a14,0 0 10px rgba(255,190,60,.6);animation:sthGlow 1.2s infinite alternate}
@keyframes sthGlow{from{box-shadow:0 2px 0 #7a4a14,0 0 4px rgba(255,190,60,.35)}to{box-shadow:0 2px 0 #7a4a14,0 0 14px rgba(255,190,60,.85)}}`;
document.head.appendChild(css);
/* red dot + chat hints */
let lastHint=-1e9,hinted=0;
function hint(force){if(!can())return;const now=performance.now();if(!force&&now-lastHint<120000)return;lastHint=now;
  if(typeof chatLog==='function')chatLog('sys',`มีแต้มสถานะเหลือ <b style="color:#ffd36a">${pointsLeft()}</b> แต้ม — เปิด STATUS (Alt+A / ปุ่มสถานะ) แล้วกด <b style="color:#ffd36a">✦ ลงแต้มแนะนำ</b> หรือลงเอง`);}
setInterval(()=>{const b=document.querySelector('#mgrid [data-m="statb"]');if(b)b.classList.toggle('stDot',can());
  if(!hinted&&window.__bootDone&&performance.now()>8000){hinted=1;if(pointsLeft()>=10)hint(true);}},500);
if(typeof levelUpFx==='function'){const _l=levelUpFx;levelUpFx=function(){const r=_l.apply(this,arguments);try{setTimeout(()=>hint(false),1800);}catch(_){}return r;};}
window.STH={rec:REC,plan,spend,can,html,bind,branchNow};
})();
