/* Stat tiers (ขั้นพลังสเตตัส) + refine lines (บรรทัดตีบวก) — owner 2026-11-22:
   17:00 'ตีบวกถ้าถึงที่กำหนดจะบวกสเตตัสพิเศษหรือค่าพิเศษของแต่ละชิ้น · สเตตัสถึง 100 200 จะได้ความสามารถพิเศษ'
   17:20 '1 ได้ (ตารางตายตัวต่อช่อง)' · 17:23 'ไม่ต้องกังวลเรื่องเลเวล 60 เดี๋ยวจะปรับเพิ่มอัพเดทเรื่อยๆ'
   17:52 'ความสามารถจากขั้นสเตตัส เอาเป็น 99 100 200 300 ดีกว่า แล้วนับสเตตัสจากแหล่งอื่นด้วย ไม่ใช่แค่ที่อัพเอง' (replaces 17:20's 'count only own points')
   17:55 'เอา 100 ออก พิมผิด' → tiers 99 / 200 / 300. Rules + numbers: MILESTONES_TH.md. The tiers count the TOTAL stat (D.stat = points + hero bonus + items, seals, gems, orbs, food …).
   Everything is flat / counted (rule 2): no chance rolls. 200 / 300 are out of reach at the Lv 60 cap (a main stat with full gear ≈ 120–135) — on purpose.
   Refine lines (items may use %, rule 2 exception): +7 / +10 / +12 / +15 per slot; the 'every 10 …' lines read the total stat too.
   Loaded after gem_btn.js / feel_hits.js: its hurt / castSkillNow / hitPlayer / applyAbility / debuff / derive / gearCalc wrappers sit outside the others.
   Hooks it needs (index.html): hurt reads o._msCut (DEF / MDEF ignored), o._msCrit (counter crit), o._msSure (never misses), critChance(m,o) o._msNoSh;
   hitPlayer calls MSF.dodge(pd,e) / MSF.noMob(); castSkill calls MSF.castT(T). items.js refine window calls RFL.next(it,r).
   window.__MS_OFF=1 turns both systems off (bench comparisons). window.MSF = stat tiers, window.RFL = refine lines. */
(function(){'use strict';
if(typeof PS==='undefined'||typeof hurt!=='function'||typeof gearCalc!=='function')return;
if(/[?&]msoff=1/.test(location.search))window.__MS_OFF=1;   // ?msoff=1 = both systems off (bench comparisons)
const OFF=()=>!!window.__MS_OFF;
const KS=['str','agi','vit','int','dex','luk'];
const STEP=[99,200,300];
const tierOf=v=>{let t=0;for(const x of STEP)if(v>=x)t++;return t;};
const own=k=>Math.max(1,PS[k]||1);                       // the points the player put in (shown next to the total)
{const q=/[?&]msno=([a-z0-9,]+)/.exec(location.search);if(q)window.__MS_NO=q[1].split(',');}   // ?msno=dex1,int1 = those tiers (and the ones above them) off — bench probes
const tot=k=>(typeof D!=='undefined'&&D&&D.stat&&D.stat[k])||own(k);    // the total stat (points + hero bonus + items / seals / gems / food …)
const tierAt=(k,v)=>{if(OFF())return 0;let t=tierOf(v);const no=window.__MS_NO;if(no)for(let i=1;i<=t;i++)if(no.includes(k+i)){t=i-1;break;}return t;};
const T=k=>tierAt(k,tot(k));
const pop=(text,color,x,y,size)=>{try{addFx(new DText({x:x!=null?x:player.x,y:y!=null?y:player.y,z:96,text,color:color||'#ffe08a',size:size||12,life:.85}));}catch(_){}};

/* ---------------- 1. stat tiers ---------------- */
const AB={   // 99 / 200 / 300 (the 99 tier holds two abilities)
  str:['ไม่โดนผลักกระเด็น · ตีปกติครั้งที่ 5 ทุกครั้ง ไม่สน DEF','สกิลกายภาพครั้งที่ 5 ทุกครั้ง ไม่สน DEF (ทุกดาเมจของสกิลนั้น)','ตีโดนแล้ว DEF เป้า −Lv/5 นาน 5 วิ'],
  agi:['หลบได้ (MISS / LUCKY) → SP +1 · หลบครบ 3 ครั้ง → ตีปกติครั้งต่อไปคริ','โดนรุมไม่เสีย FLEE','ASPD สูงสุด 190 → 193'],
  vit:['ฟื้น HP ต่อรอบ +VIT/5 · พิษ / ไฟไหม้ / เลือดไหล สั้นลงครึ่ง','ไม่ติดสถานะกายภาพ (พิษ ไฟไหม้ เลือดไหล ช้า เกราะร้าว)','HP ต่ำกว่า 25% → โล่ VIT×5 นาน 10 วิ (ทุก 60 วิ)'],
  int:['ฟื้น SP ต่อรอบ +INT/10 · สกิลเวทครั้งที่ 5 ทุกครั้ง ไม่สน MDEF (ทุกดาเมจของสกิลนั้น)','ไม่ติดอ่อนแรง · ไม่โดนดูด SP','สกิลครั้งที่ 5 ทุกครั้ง ไม่ใช้ SP'],
  dex:['เวลาร่าย −0.1 วิ · สกิลกายภาพไม่พลาด','ร่ายทันที','ตีปกติครั้งที่ 4 ทุกครั้งคริ'],
  luk:['หลบเด็ดขาด (LUCKY) → HP +LUK · ตีปกติครั้งที่ 8 ทุกครั้งคริ','ติดสถานะทุกแบบ สั้นลงครึ่ง','คริไม่โดนโล่ LUK ของเป้า · หลบเด็ดขาด +5']};
const NOTE={luk:'คริได้เฉพาะตีปกติแบบกายภาพ (RO)',dex:'คริได้เฉพาะตีปกติแบบกายภาพ (RO)',agi:'คริได้เฉพาะตีปกติแบบกายภาพ (RO)'};
const S={sw:0,swT:null,f:null,dg:0,cr:0,cP:0,cM:0,cA:0,cid:0,ck:{},cd:{},sh:0,shCD:-1e9,prev:null,popT:-1};

/* flags for the basic swing this frame belongs to (a cleave that hits 3 enemies in one frame is one swing) */
function swing(){if(S.swT===gameTime&&S.f)return S.f;S.swT=gameTime;S.sw++;const n=S.sw,f={};
  if(T('str')>=1&&n%5===0)f.pierce=1;
  if((T('luk')>=1&&n%8===0)||(T('dex')>=3&&n%4===0))f.crit=1;
  if(S.cr){f.crit=1;S.cr=0;}
  return S.f=f;}
const piercePop=(e,mg)=>{if(gameTime-S.popT<.25)return;S.popT=gameTime;pop(mg?'ทะลุ MDEF':'ทะลุ DEF',mg?'#9fd8ff':'#ffd27a',e.x,e.y,11);};

{const _hurt=hurt;window.hurt=hurt=function(e,mult,o){o=o||{};
  if(OFF()||!e||e.dead||o.dot)return _hurt.call(this,e,mult,o);
  const auto=!!o.auto,k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX,mg=window.hitIsMagic?hitIsMagic(o):!!o.magic;
  let cut=0,crit=0,sure=0;
  if(auto){const f=swing();if(f.pierce&&!mg)cut=1e6;if(f.crit)crit=1;}
  else{const d=k&&k!=='basic'?castFlags(k,mg,e):null;if(d&&((d.p&&!mg)||(d.m&&mg)))cut=1e6;if(!mg&&T('dex')>=1)sure=1;}
  if(!mg&&!cut&&e._msDcT>gameTime)cut=e._msDc||0;                // STR 99: DEF −Lv/5 left by an earlier hit
  const p0=[o._msCut,o._msCrit,o._msSure,o._msNoSh];
  o._msCut=cut;o._msCrit=crit;o._msSure=sure;o._msNoSh=T('luk')>=3?1:0;
  let r;try{r=_hurt.call(this,e,mult,o);}finally{o._msCut=p0[0];o._msCrit=p0[1];o._msSure=p0[2];o._msNoSh=p0[3];}
  if(r>0){if(cut>=1e6&&auto)piercePop(e,mg);if(!mg&&T('str')>=3){e._msDc=Math.floor(PS.lv/5);e._msDcT=gameTime+5;}}
  return r;};}
/* STR 90 / INT 60: a skill cast is counted on its FIRST hit (buffs that never hit are not counted); the 5th physical / magic cast
   then ignores DEF / MDEF with every hit it makes (zones and projectiles included, until that skill is cast again) */
function castFlags(k,mg,e){const id=S.ck[k];if(!id)return null;let d=S.cd[id];if(d)return d;d=S.cd[id]={};
  if(!mg&&T('str')>=2&&++S.cP%5===0)d.p=1;
  if(mg&&T('int')>=1&&++S.cM%5===0)d.m=1;
  if(d.p||d.m)pop(d.p?'ทะลุ DEF ✦':'ทะลุ MDEF ✦',d.p?'#ffd27a':'#9fd8ff',e.x,e.y,13);
  for(const x in S.cd)if(x<id-60)delete S.cd[x];
  return d;}

/* INT 99: every 5th skill cast costs no SP (refunded right after the cast) */
{const _csn=castSkillNow;window.castSkillNow=castSkillNow=function(key,c){
  if(OFF()||!SKILLS[key])return _csn.apply(this,arguments);
  const sk=SKILLS[key],free=T('int')>=3&&(S.cA+1)%5===0;
  const ok=_csn.apply(this,arguments);
  if(ok===false)return ok;
  S.ck[key]=++S.cid;S.cA++;
  if(free){const c=Math.round((sk.mp||0)*(1-Math.min(.5,(BON.spCost||0)/100)));if(c>0){player.mp=Math.min(player.maxMp,player.mp+c);pop('SP ฟรี ✦','#7ec8ff');}}
  return ok;};}

/* monsters hitting the hero: dodges (index.html hitPlayer calls these), VIT 99 shield */
const MSF={tier:T,own,tot,AB,STEP,state:S,
  dodge(pd){if(OFF())return;
    if(T('agi')>=1&&player.mp<player.maxMp)player.mp=Math.min(player.maxMp,player.mp+1);
    if(T('agi')>=1&&!S.cr&&++S.dg>=3){S.dg=0;S.cr=1;pop('คริพร้อม ✦','#ffcf5a');}
    if(pd&&T('luk')>=1&&player.hp<player.maxHp){const h=Math.min(player.maxHp-player.hp,tot('luk'));player.hp+=h;pop('+'+h,'#8dff7a');}},
  noMob:()=>T('agi')>=2,
  castT(t){const d=T('dex');return d>=2?0:d>=1?Math.max(0,t-.1):t;}};
window.MSF=MSF;
if(typeof BUFFDEF!=='undefined')BUFFDEF.msGuard={n:'โล่ VIT (ขั้น VIT 99)',c:'#e8c070',i:'🛡'};
{const _hp=hitPlayer;hitPlayer=function(e,o){const r=_hp.apply(this,arguments);
  if(!OFF()&&T('vit')>=3&&player.hp>0&&player.hp<player.maxHp*.25&&gameTime>=S.shCD){S.sh=tot('vit')*5;S.shCD=gameTime+60;player.buffs.msGuard={t:10,total:10};pop('โล่ VIT '+S.sh,'#ffe08a',player.x,player.y,13);}
  return r;};}
{const _abs=window.ENH_ABSORB;window.ENH_ABSORB=d=>{d=_abs?_abs(d):d;
  if(S.sh>0&&d>0){if(!(player.buffs.msGuard&&player.buffs.msGuard.t>0)){S.sh=0;return d;}const a=Math.min(S.sh,d);S.sh-=a;d-=a;if(S.sh<=0)delete player.buffs.msGuard;}
  return d;};}

/* statuses from monsters (monsters.js / boss_fenrir.js debuff() + applyAbility() ask these): VIT 90 / INT 90 immunities, STR 30 no knock-back,
   VIT 60 + LUK 90 halve the time */
const PHYS={dbPoison:1,dbBurn:1,dbBleed:1,dbSlow:1,dbArmor:1},DOT3={dbPoison:1,dbBurn:1,dbBleed:1};
const AB2DB={poison:'dbPoison',burn:'dbBurn',bleed:'dbBleed',slow:'dbSlow',armor:'dbArmor',weak:'dbWeak'};
const immune=k=>(k==='dbWeak'&&T('int')>=2)||(!!PHYS[k]&&T('vit')>=2);
let resT=-1;const resPop=()=>{if(gameTime-resT<.6)return;resT=gameTime;pop('ต้านทาน','#e8f0ff');};
MSF.debuffT=(k,dur)=>{if(OFF())return dur;if(immune(k)){resPop();return 0;}if(DOT3[k]&&T('vit')>=1)dur*=.5;if(T('luk')>=2)dur*=.5;return dur;};
MSF.immuneAb=ab=>{if(OFF())return false;const im=(ab==='knock'&&T('str')>=1)||(ab==='drain'&&T('int')>=2)||(!!AB2DB[ab]&&immune(AB2DB[ab]));if(im)resPop();return im;};

/* derived numbers: VIT / INT tier 1 regen, LUK tier 4 perfect dodge, AGI tier 4 ASPD cap — from the totals this derive() just made */
{const _derive=derive,ASPD0=SYS.aspdMax;derive=function(){SYS.aspdMax=ASPD0;let r=_derive.apply(this,arguments);if(OFF())return r;
  const t=k=>tierAt(k,r.stat[k]);
  if(t('agi')>=3&&r.aspd>=ASPD0-1e-6){SYS.aspdMax=ASPD0+3;try{r=_derive.apply(this,arguments);}finally{SYS.aspdMax=ASPD0;}}
  if(t('vit')>=1)r.hpReg+=Math.floor(r.stat.vit/5);
  if(t('int')>=1)r.spReg+=Math.floor(r.stat.int/10);
  if(t('luk')>=3)r.pd+=5;
  r.ms=Object.fromEntries(KS.map(k=>[k,t(k)]));return r;};}

/* ---------------- 2. refine lines ---------------- */
let GT=null;                                              // totals while gearCalc builds BON (after the 'all stats' lines)
const d10=k=>Math.floor((GT?GT[k]:tot(k))/10);
const MAIN=()=>typeof RANGED!=='undefined'&&RANGED[CHAR]?'dex':'str';
const ADD=(k,v)=>{if(v)BON[k]=(BON[k]||0)+v;};
const ALL=v=>{for(const k of KS)ADD(k,v);};   // lines that add stats run first (s:1), then the 'every 10 …' lines read the totals
const RL={
  rhand:[{r:7,t:'ATK +3% · MATK +3%',f:()=>{ADD('atkPct',3);ADD('matkPct',3);}},
    {r:10,t:()=>`ทุก 10 ${MAIN().toUpperCase()}: ATK +2 · ทุก 10 INT: MATK +2`,f:()=>{ADD('atk',2*d10(MAIN()));ADD('matk',2*d10('int'));},now:()=>`ตอนนี้ ATK +${2*d10(MAIN())} · MATK +${2*d10('int')}`},
    {r:12,t:'รูหิน +1'},{r:15,t:'ดาเมจสกิล +5% · สถานะพิเศษของชิ้น ×1.2',f:()=>ADD('skillDmg',5)}],
  armor:[{r:7,t:'MaxHP +4%',f:()=>ADD('hpPct',4)},{r:10,t:'ทุก 10 VIT: DEF +1',f:()=>ADD('def',d10('vit')),now:()=>`ตอนนี้ DEF +${d10('vit')}`},
    {r:12,t:'รูหิน +1'},{r:15,t:'รับดาเมจ −4% · สถานะพิเศษของชิ้น ×1.2',f:()=>ADD('dmgRed',4)}],
  top:[{r:7,t:'MaxSP +5%',f:()=>ADD('spPct',5)},{r:10,t:'ทุก 10 INT: ใช้ SP −1%',f:()=>ADD('spCost',d10('int')),now:()=>`ตอนนี้ −${d10('int')}%`},
    {r:12,t:'รูหิน +1'},{r:15,t:'ATK +2% · MATK +2% · สถานะพิเศษของชิ้น ×1.2',f:()=>{ADD('atkPct',2);ADD('matkPct',2);}}],
  shoes:[{r:7,t:'FLEE +5',f:()=>ADD('flee',5)},{r:10,t:'ทุก 10 AGI: ASPD +1%',f:()=>ADD('aspd',d10('agi')),now:()=>`ตอนนี้ +${d10('agi')}%`},
    {r:12,t:'รูหิน +1'},{r:15,t:'MaxHP +4% · สถานะพิเศษของชิ้น ×1.2',f:()=>ADD('hpPct',4)}],
  acc:[{r:7,t:'สเตตัสทุกค่า +1',f:()=>ALL(1),s:1},{r:10,t:'ทุก 10 LUK: CRIT +1',f:()=>ADD('crit',d10('luk')),now:()=>`ตอนนี้ +${d10('luk')}`},
    {r:12,t:'สเตตัสทุกค่า +1 (เครื่องประดับไม่มีรู)',f:()=>ALL(1),s:1},{r:15,t:'สเตตัสทุกค่า +2 · สถานะพิเศษของชิ้น ×1.2',f:()=>ALL(2),s:1}]};
const slotOf=it=>it&&(it.slot==='acc1'?'acc':it.slot);
const txt=x=>typeof x.t==='function'?x.t():x.t;
{const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);if(OFF()||window.__RFL_OFF)return r;   // __RFL_OFF: the balance bench (tools/balance_bench.js)
  const on=[];
  for(const sl in EQ){const id=EQ[sl],it=ITEMS[id];if(!it||it.broken)continue;const L=RL[slotOf(it)];if(!L||!(it.ref>=7))continue;
    const st=itemSt(id);if(!st||st.lv>PS.lv)continue;                // gear above your level gives nothing (same rule as gearCalc)
    for(const x of L)if(it.ref>=x.r&&x.f)on.push(x);}
  for(const x of on)if(x.s)x.f();
  GT=Object.fromEntries(KS.map(k=>[k,Math.max(1,(PS[k]||1)+growStat(k)+(BON[k]||0))]));
  try{for(const x of on)if(!x.s)x.f();}finally{GT=null;}
  return r;};}
const RFL={RL,
  lines:it=>RL[slotOf(it)]||null,
  next(it,r){const L=RL[slotOf(it)],x=L&&L.find(x=>x.r===r);return x?` · ✦ ${txt(x)}`:'';},
  html(it){const L=RL[slotOf(it)];if(!L)return '';const r=it.ref||0;
    return `<div class="t12x msrl"><b>ตีบวกถึงขั้น</b>${L.map(x=>{const on=r>=x.r;return `<div class="${on?'on':''}"><i>+${x.r}</i>${txt(x)}${on&&x.now?` <em>(${x.now()})</em>`:''}</div>`;}).join('')}</div>`;}};
window.RFL=RFL;
{const _ie=window.itemExtraInfo;window.itemExtraInfo=id=>{const base=_ie?_ie(id):'',it=ITEMS[id];return base+(it&&!OFF()?RFL.html(it):'');};}

/* ---------------- 3. status window: tier pips + details, chat when a tier opens ---------------- */
const CSS=`.ro-st .r .msp{display:inline-flex;gap:3px;margin:0 6px 0 2px;cursor:pointer;align-items:center;padding:3px 1px}
.ro-st .r .msp i{width:7px;height:7px;transform:rotate(45deg);border:1px solid #9aa3b8;background:#fff;display:block}
.ro-st .r .msp i.on{background:linear-gradient(135deg,#fff1b8,#e0a020);border-color:#9a6a10;box-shadow:0 0 3px rgba(224,160,32,.7)}
.msdt .msrow{display:flex;flex-wrap:wrap;gap:2px 4px;align-items:baseline;margin-top:3px}
.msdt .msrow>b{width:28px}.msdt .msrow .mv{min-width:22px;color:#5a6680}
.msdt .msrow span.c{border:1px solid #d3d9e6;border-radius:6px;padding:0 4px;color:#9aa3b5;background:#fff}
.msdt .msrow span.c i{font-style:normal;font-weight:700;margin-right:3px}
.msdt .msrow span.c.on{border-color:#e0b040;color:#7a5208;background:linear-gradient(#fffbe8,#fff1c4)}
.msdt .msrow span.c.on i{color:#c07a00}
.msrl div{color:#a3a9b6;font-weight:600}.msrl div.on{color:#b8740c;font-weight:700}.msrl div i{font-style:normal;display:inline-block;min-width:30px}
.msrl em{font-style:normal;color:#5a8a2a;font-weight:600}`;
{const s=document.createElement('style');s.id='msCss';s.textContent=CSS;document.head.appendChild(s);}
const tipOf=k=>{const t=T(k),v=tot(k);return `ขั้นพลัง ${k.toUpperCase()} (สเตตัสรวม ${v} · อัพเอง ${own(k)})`+AB[k].map((a,i)=>`&#10;${i<t?'◆':'◇'} ${STEP[i]}: ${a}`).join('')+(NOTE[k]?`&#10;${NOTE[k]}`:'')+'&#10;แตะ = ดูทั้งหมด';};
function msTable(){return `<div class="ro-x msdt"><b>ขั้นพลังสเตตัส</b> · ถึง 99 / 200 / 300 ได้ความสามารถ · นับสเตตัสรวมทุกแหล่ง (แต้ม + โบนัสฮีโร่ + ของ ตรา เจม หิน อาหาร)`+
  KS.map(k=>{const t=T(k);return `<div class="msrow"><b>${k.toUpperCase()}</b><span class="mv">${tot(k)}</span>${AB[k].map((a,i)=>`<span class="c${i<t?' on':''}"><i>${STEP[i]}</i>${a}</span>`).join('')}</div>`;}).join('')+'</div>';}
if(typeof buildStatus==='function'){const _bs=buildStatus;buildStatus=function(){const r=_bs.apply(this,arguments);try{decorate();}catch(e){console.error('milestones status',e);}return r;};}
function decorate(){const w=document.getElementById('stw');if(!w||!w.classList.contains('open')||OFF())return;
  for(const b of w.querySelectorAll('button.dn[data-s]')){const k=b.dataset.s,row=b.parentElement;if(!row||row.querySelector('.msp'))continue;const t=T(k);
    const s=document.createElement('span');s.className='msp';s.title=tipOf(k).replace(/&#10;/g,'\n');s.innerHTML=STEP.map((_,i)=>`<i class="${i<t?'on':''}"></i>`).join('');
    s.onclick=ev=>{ev.stopPropagation();if(typeof stOpenX!=='undefined'&&!stOpenX){stOpenX=true;buildStatus();}const d=document.querySelector('#stw .msdt');if(d)d.scrollIntoView({block:'nearest'});};
    row.insertBefore(s,b);}
  if(typeof stOpenX!=='undefined'&&stOpenX&&!w.querySelector('.msdt')){const bd=w.querySelector('.bd'),x=bd&&bd.querySelector('.ro-x');if(x)x.insertAdjacentHTML('beforebegin',msTable());else if(bd)bd.insertAdjacentHTML('beforeend',msTable());}}
/* a new tier (points, gear, food …) → chat line + a word over the hero. Not in the first seconds after loading (the save fills the stats in steps) */
const BOOT0=performance.now();
function tiersNow(){return Object.fromEntries(KS.map(k=>[k,T(k)]));}
if(typeof applyStats==='function'){const _as=applyStats;applyStats=function(){const r=_as.apply(this,arguments);try{
    const now=tiersNow(),p=S.prev;S.prev=now;
    if(p&&window.__bootDone&&performance.now()-BOOT0>8000)for(const k of KS)for(let t=p[k]+1;t<=now[k];t++){
      if(typeof chatLog==='function')chatLog('sys',`✦ ขั้นพลัง <b>${k.toUpperCase()} ${STEP[t-1]}</b>: ${AB[k][t-1]}`);
      pop(`${k.toUpperCase()} ${STEP[t-1]} ✦`,'#ffd36a',player.x,player.y,14);}
  }catch(e){}return r;};}
S.prev=tiersNow();
try{if(typeof applyStats==='function'&&typeof player!=='undefined'&&player)applyStats();}catch(_){}
})();
