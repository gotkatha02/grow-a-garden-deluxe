/* =====================================================================
   UNLOCKS — systems come to the player one at a time (owner 2026-11-24 22:55 'แก้ให้เป็นมิตรกับผู้เล่นให้หน่อย').
   Play mode only (test mode shows everything, ?unlock=0 too):
   • the menu button of a system the hero has not reached yet is hidden (G totem · P pets · Y ring · U roots);
     its shortcut key shows '🔒 … เปิดที่ Lv N' instead of opening; the pet tame button waits for the pet unlock too.
   • reaching the level pops ONE card (เปิดดู · สอนวิธีใช้ · ไว้ทีหลัง), then the button wears a 'ใหม่' tag until the
     window is opened once. Milestones without a button of their own (C skills at Lv 51) pop a card too.
   • old saves: systems already reached are marked seen silently (no popup flood); a system the save already uses
     (an extracted gem, a pet, a rune, a lit node) counts as unlocked whatever the level.
   • dev buttons (slow-mo, the old FX editor) are gone in play mode.
   Save per hero and mode: af_unlock_v1_<hero>_<mode> {seen:{id:1}, opened:{id:1}}. window.UNLOCK = API + test handle.
   ===================================================================== */
(function(){
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
if(typeof PS==='undefined')return;
const $=s=>document.querySelector(s);
const MODE=()=>(window.AFProgress&&AFProgress.mode)||null;
const OFF=/[?&]unlock=0/.test(location.search);
const PLAY=()=>MODE()==='play'&&!OFF;
const lv=()=>PS.lv||1;
const mob=()=>document.body.classList.contains('mob');
const vis=el=>{if(!el)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden';};
const isOpen=sel=>{const el=$(sel);return !!el&&vis(el)&&(el.classList.contains('open')||getComputedStyle(el).display!=='none');};
const say=t=>{const f=G('msg');if(f)f(t);};
const chat=h=>{const f=G('chatLog');if(f)f('sys',h);};

/* ---------------- the systems (edit here) ----------------
   m = menu button (data-m) · code = shortcut key · w = its window (to know it was opened) · used() = the save already uses it */
const SY=[
 {id:'totem',m:'tgem',code:'KeyG',k:'G',lv:10,ic:'🗿',n:'ศาลโทเท็ม',w:'#totemWin',
  d:'แต่งสกิลด้วยเจม — สกัดสกิลที่เรียนแล้วเป็นเจม วางลงหลุมบนแท่นหิน แล้วใส่เจมแปรสภาพ สกิลจะเปลี่ยนนิสัย (ได้อย่าง เสียอย่าง)',
  open:()=>window.totemGems&&totemGems.open(),tut:'totem1',
  used:()=>{const d=window.totemGems&&totemGems.data();return !!(d&&d.sx&&Object.keys(d.sx).length);}},
 {id:'pet',m:'mgpet',code:'KeyP',k:'P',lv:15,ic:'🐾',n:'สัตว์เลี้ยง',w:'#petw',chat:1,
  d:'มอนที่มี 🐾 ในกรอบเป้าเลี้ยงได้ — โยนเครื่องรางผูกใจ (ขายในร้าน) จนหัวใจเต็ม → ได้ไข่ → ฟัก → พาออกเดินทางได้สเตตัส · ไม่ช่วยตี ไม่ต้องให้อาหาร',
  open:()=>window.PETS&&PETS.open(),tut:'pet',
  used:()=>{try{const s=PETS.S();return !!(s.box.length||Object.keys(s.cx||{}).length);}catch(e){return false;}}},
 {id:'ring',m:'mgring',code:'KeyY',k:'Y',lv:30,ic:'🔱',n:'วงเศษโทเท็ม',w:'#rgw',
  d:'รูนวิญญาณสัตว์ 6 ช่อง = ความสามารถพิเศษที่ใช้ได้กับทุกสกิล · รูนสีเล็ก 12 ช่องเพิ่มสเตตัส และถ้าสีตรงกับรูนวิญญาณที่ต่ออยู่ รูนวิญญาณจะแรงขึ้น',
  open:()=>window.RING&&RING.open(),tut:'ring',
  used:()=>{try{const d=RING.data();return d.big.some(Boolean)||Object.keys(d.small||{}).length>0;}catch(e){return false;}}},
 {id:'roots',m:'mgroots',code:'KeyU',k:'U',lv:31,ic:'🌳',n:'รากโทเท็ม',w:'#rtw',
  d:'ได้แต้มราก 4 แต้มทุกเลเวล — จุดโหนดต่อกันออกจากหัวใจ ได้สเตตัสทีละนิด · ปลายทางคือปม C ที่ใช้ปลดสกิล C (Lv 51+)',
  open:()=>window.ROOTS&&ROOTS.open(),tut:'roots',
  used:()=>{try{return Object.keys(ROOTS.data().lit||{}).length>0;}catch(e){return false;}}},
 {id:'cskill',lv:51,ic:'✨',n:'สกิล C',note:1,chat:1,
  d:'ร่างตำนานของฮีโร่ — ในรากโทเท็ม (U) จุดโหนดรอบปม C ให้ครบ 3 ใน 6 แล้วปลูกเมล็ดราก (ดรอปจากบอส) ปลดแล้วสกิล C ใช้ได้ทันที',
  open:()=>window.ROOTS&&ROOTS.open(),tut:'cskill',
  used:()=>{try{const R=ROOTS.data().lit||{};return Object.values(ROOTS.CNODE||{}).some(id=>R[id]);}catch(e){return false;}}}];
const BY={};for(const s of SY)BY[s.id]=s;
/* parts of the totem shrine that wait for their level (no card of their own): page bookmarks + the workshop (bosses, Lv 30),
   the support tab (carving, Lv 20), the C-gem tab (C skills, Lv 51) — shown earlier when the save already uses them */
const FEAT={pages:30,shrine:30,sup:20,cgem:51};

/* ---------------- state ---------------- */
let S=null,KEY='',started=false;
function load(){KEY='af_unlock_v1_'+CHAR+'_'+(MODE()||'none');let d=null;try{d=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
  const isNew=!d;S=d||{v:1,seen:{},opened:{}};S.seen=S.seen||{};S.opened=S.opened||{};return isNew;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const used=s=>{try{return !!(s.used&&s.used());}catch(e){return false;}};
/* ok(id): the system is open for this hero (test mode / ?unlock=0: always) */
function ok(id){if(!PLAY())return true;if(FEAT[id])return feat(id);const s=BY[id];if(!s)return true;return lv()>=s.lv||used(s);}
const TGD=()=>{try{return window.totemGems&&totemGems.data();}catch(e){return null;}};
const bag=()=>(window.AFItems&&AFItems.BAG)||{};
const hasPre=p=>{const B=bag();return Object.keys(B).some(k=>k.startsWith(p)&&B[k]>0);};
function feat(id){if(!PLAY())return true;if(lv()>=(FEAT[id]||1))return true;const d=TGD()||{};
  if(id==='pages')return !!(d.pg&&(d.pg.c||(d.pg.L||[]).some(Boolean)));
  if(id==='shrine'||id==='cgem')return Object.keys(d.own||{}).length>0;
  if(id==='sup')return hasPre('gsup_')||(d.ssu||[]).some(a=>a&&a.some(Boolean));
  return false;}

/* ---------------- menu buttons ---------------- */
const CSS=`
#mgrid button.ulLock{display:none!important}
#mgrid button.ulNew::before{content:'ใหม่';position:absolute;left:-6px;top:-7px;z-index:3;padding:0 5px;height:15px;line-height:15px;border-radius:8px;background:linear-gradient(#ffe36a,#f5a623);
  border:1.5px solid #5a2a1c;color:#5a2a1c;font:700 9.5px Mitr,sans-serif;box-shadow:0 1px 0 #5a2a1c;animation:ulBob 1.2s ease-in-out infinite;pointer-events:none}
@keyframes ulBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes ulIn{from{opacity:0;transform:translate(-50%,14px) scale(.9)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
@keyframes ulRay{to{transform:rotate(360deg)}}
#ulPop{position:fixed;left:50%;top:17%;z-index:8600;transform:translateX(-50%);display:none;width:min(400px,92vw);pointer-events:auto}
#ulPop.on{display:block;animation:ulIn .4s cubic-bezier(.2,1.5,.4,1) both}
#ulPop .c{position:relative;box-sizing:border-box;padding:12px 14px 12px;border-radius:18px;color:#fff3d6;background:linear-gradient(rgba(72,38,14,.97),rgba(40,20,8,.97));
  border:2.5px solid #ffd36a;box-shadow:0 0 30px rgba(255,210,90,.55),0 10px 26px rgba(0,0,0,.45);font:400 13px/1.5 Prompt,sans-serif;overflow:hidden}
#ulPop .h{display:flex;align-items:center;gap:6px;font:600 12px Mitr,sans-serif;color:#ffe08a;letter-spacing:.3px}
#ulPop .h::before,#ulPop .h::after{content:'';flex:1;height:1.5px;background:linear-gradient(90deg,transparent,#ffd36a,transparent)}
#ulPop .r{display:flex;gap:12px;align-items:center;margin-top:8px}
#ulPop .ic{position:relative;flex:none;width:64px;height:64px;display:flex;align-items:center;justify-content:center}
#ulPop .ic::before{content:'';position:absolute;inset:-10px;border-radius:50%;background:repeating-conic-gradient(rgba(255,226,120,.45) 0 8deg,rgba(255,226,120,0) 8deg 20deg);
  -webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%);animation:ulRay 9s linear infinite}
#ulPop .ic>*{position:relative;width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 3px 3px rgba(0,0,0,.5))}
#ulPop .ic .em{font-size:40px;line-height:58px;text-align:center}
#ulPop .n{font:600 17px/1.2 Mitr,sans-serif;color:#fff}
#ulPop .n small{font:500 11px Mitr,sans-serif;color:#f2c96a;margin-left:6px}
#ulPop .d{margin-top:3px;color:#e9d3ad;font-size:12.5px}
#ulPop .b{display:flex;gap:6px;margin-top:10px}
#ulPop .b button{flex:1;height:32px;border-radius:10px;border:2px solid #5a2e16;background:linear-gradient(#fff1c9,#f2c96a);color:#3a1f14;font:600 12.5px Mitr,sans-serif;cursor:pointer;padding:0 6px;white-space:nowrap}
#ulPop .b button.go{background:linear-gradient(#fff9c8,#ffcf3a)}
#ulPop .b button.lt{flex:.7;background:rgba(255,255,255,.12);border-color:rgba(255,214,140,.5);color:#ffe9b0;font-weight:500}
body.mob #ulPop{top:12%;width:min(380px,70vw)}body.mob #ulPop .c{padding:9px 11px}body.mob #ulPop .ic{width:52px;height:52px}body.mob #ulPop .ic>*{width:48px;height:48px}
body.mob #ulPop .n{font-size:15px}body.mob #ulPop .d{font-size:11.5px;line-height:1.4}body.mob #ulPop .b{margin-top:7px}body.mob #ulPop .b button{height:28px;font-size:11.5px}
#totemWin.ulNoPg #tgPg,#totemWin.ulNoWs #tgWsB,#totemWin.ulNoC .tgTabs [data-tab="gem"],#totemWin.ulNoSup .tgTabs [data-tab="sup"],#totemWin.ulNoRs #tgRsb{display:none!important}
#ulTrio{position:absolute;right:40px;top:-8px;z-index:3;display:flex;gap:6px}
#ulTrio button{height:30px;padding:0 11px;border-radius:15px;border:2.5px solid #e9b44c;background:linear-gradient(#5a3a22,#2a160a);color:#ffe3a0;font:600 13px Mitr,Sarabun,sans-serif;cursor:pointer;box-shadow:0 3px 0 #1a0c06;white-space:nowrap}
#ulTrio button small{font-size:10px;color:#e9b44c;margin-left:3px}
body.mob #ulTrio{right:34px;top:-6px}body.mob #ulTrio button{height:26px;padding:0 8px;font-size:11.5px}body.mob #ulTrio button small{display:none}
@media (max-width:900px){#ulTrio{top:22px;right:10px}}
#mgrid button[data-tn]::before{content:attr(data-tn);position:absolute;left:-6px;top:-7px;z-index:3;min-width:17px;height:17px;line-height:15px;padding:0 4px;box-sizing:border-box;border-radius:9px;
  background:linear-gradient(#5fd07a,#2e9a4a);border:1.5px solid #fff;color:#fff;font:700 10.5px Mitr,sans-serif;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.4);pointer-events:none}
#gdQ button[data-tn]{position:relative;overflow:visible}#gdQ button[data-tn]::after{content:attr(data-tn);position:absolute;right:-7px;top:-7px;min-width:15px;height:15px;line-height:13px;border-radius:8px;
  background:linear-gradient(#5fd07a,#2e9a4a);color:#fff;font:700 9.5px Mitr,sans-serif;border:1.5px solid #fff;padding:0 3px;box-sizing:border-box;pointer-events:none}
`;
const st=document.createElement('style');st.id='ulCSS';st.textContent=CSS;document.head.appendChild(st);
const btnOf=s=>s.m?$(`#mgrid [data-m="${s.m}"]`):null;
function syncButtons(){
  for(const s of SY){const b=btnOf(s);if(!b)continue;const lock=PLAY()&&!ok(s.id);b.classList.toggle('ulLock',lock);
    b.classList.toggle('ulNew',PLAY()&&!lock&&!!S&&!S.opened[s.id]&&!!S.seen[s.id]&&S.seen[s.id]!=='old');}
  /* dev buttons: slow-mo (L) and the old effect editor (F) are test tools — gone in play mode (and the editor when it is not loaded) */
  if(PLAY()){for(const id of ['mgslow','mgfx']){const b=$(`#mgrid [data-m="${id}"]`);if(b)b.remove();}}
  else if(!window.FXED){const b=$('#mgrid [data-m="mgfx"]');if(b)b.remove();}}

/* the totem shrine shows its deeper parts only when they matter (classes read by the CSS above) */
function totemView(){const w=$('#totemWin');if(!w)return;let rs=true;try{rs=!PLAY()||totemGems.res().tot>=2;}catch(e){}
  w.classList.toggle('ulNoPg',!feat('pages'));w.classList.toggle('ulNoWs',!feat('shrine'));w.classList.toggle('ulNoC',!feat('cgem'));
  w.classList.toggle('ulNoSup',!feat('sup'));w.classList.toggle('ulNoRs',!rs);}
/* one place, three windows: the shrine links to the roots and the ring, the roots and the ring link back to the shrine */
function swap(from,to){try{from&&from();}catch(e){}setTimeout(()=>{try{to();}catch(e){}},60);}
function trio(){
  const tb=$('#tgBox');if(tb&&!$('#ulTrio')){const g=document.createElement('div');g.id='ulTrio';
    g.innerHTML='<button data-u="roots" title="รากโทเท็ม — ปลดสกิล C (U)">🌳 ราก<small>U</small></button><button data-u="ring" title="วงเศษโทเท็ม — รูน (Y)">🔱 วงเศษ<small>Y</small></button>';tb.appendChild(g);
    g.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();swap(()=>totemGems.close(),BY[b.dataset.u].open);});}
  const g=$('#ulTrio');if(g){let n=0;g.querySelectorAll('button').forEach(b=>{const on=ok(b.dataset.u);b.style.display=on?'':'none';n+=on;});g.style.display=n?'':'none';}
  const rb=$('#rtBar');if(rb&&!rb.querySelector('[data-u="totem"]')){const b=document.createElement('button');b.className='rtB';b.dataset.u='totem';b.textContent='🗿 ศาล (G)';
    b.onclick=e=>{e.stopPropagation();swap(()=>ROOTS.close(),()=>totemGems.open());};rb.insertBefore(b,rb.querySelector('[data-b="ring"]'));}
  const rh=$('#rgw .rgHead');if(rh&&!rh.querySelector('[data-u="totem"]')){const b=document.createElement('button');b.className='rb';b.dataset.u='totem';b.textContent='🗿 ศาล (G)';
    b.onclick=e=>{e.stopPropagation();swap(()=>RING.close(),()=>totemGems.open());};rh.insertBefore(b,rh.querySelector('[data-h="roots"]'));}
  {const b=$('#rgw .rgHead [data-h="roots"]');if(b)b.style.display=ok('roots')?'':'none';}
  {const b=$('#rtBar [data-b="ring"]');if(b)b.style.display=ok('ring')?'':'none';}}

/* ---------------- "what can I do now?" (the guide book's first tab reads this) ----------------
   each entry: ic · t title · d why · go() opens the right place · b button text */
const ST_N={top:'หมวก',armor:'เกราะ',rhand:'อาวุธ',shoes:'รองเท้า',acc1:'เครื่องประดับ'};
function todo(){const out=[],A=window.AFItems;if(!A)return out;const B=A.BAG,IT=A.ITEMS,EQ=A.EQ,L=lv();
  const add=(ic,t,d,go,b,k)=>out.push({ic,t,d,go,b:b||'เปิด',k:k||t});
  const tgl=(id,f)=>()=>{const t=G('toggleWin'),bf=G(f);if(t&&bf){const w=$('#'+id);if(!(w&&w.classList.contains('open')))t(id,bf);}};
  try{const g=window.GUIDE;if(g&&g.S&&g.S.st==='done'){const q=g.Q[g.S.q];if(q)add('🎁','รับรางวัลเควสต์',`เควสต์ "${q.t}" สำเร็จแล้ว`,()=>g.claim(),'รับเลย','quest');}}catch(e){}
  {const f=G('pointsLeft'),p=f?f():0;if(p>=3)add('📊','ลงแต้มสเตตัส',`เหลือ ${p} แต้ม — ในหน้าสเตตัสมีปุ่ม ✦ ลงแต้มแนะนำ ลงตามบิลด์ของฮีโร่ให้`,tgl('stw','buildStatus'),'เปิด','stat');}
  {const mx=G('SP_MAX'),u=G('spUsed'),cr=G('canRaise'),SK=G('SKILLS')||{},BK=G('BASIC_KEY');
    if(mx&&u&&cr){const left=mx(L)-u();if(left>0&&Object.keys(SK).some(k=>k!==BK&&SK[k].br!=='C'&&cr(k)))add('📘','เรียนสกิล',`เหลือ ${left} แต้มสกิล — ช่องที่เรืองแสงในต้นสกิลเรียนได้`,()=>{const f=G('toggleSkillWin');const w=$('#skw');if(f&&!(w&&w.classList.contains('open')))f();},'เปิด','skill');}}
  const slotOf=it=>it&&(it.cslot||it.slot);
  /* gear: broken pieces, safe refines (+1–5 never break), better pieces in the bag, empty orb holes */
  let safe=[],holes=0;
  for(const sl in EQ){const it=EQ[sl]&&IT[EQ[sl]];if(!it)continue;
    if(it.broken){add('🔧',`ซ่อม${ST_N[sl]||''}`,'ของแตกไม่ให้สเตตัสเลย — ซ่อมด้วยชิ้นแบบเดียวกันระดับเดียวกัน หรือจ่ายเงินที่หน้าตีบวก',()=>A.openRefine&&A.openRefine(),'ไปซ่อม','fix_'+sl);continue;}
    const t=Math.max(1,Math.min(4,it.tier||it.wlv||1)),stone=(slotOf(it)==='rhand'?'wore':'ore')+t;
    if((it.ref||0)<5&&(B[stone]||0)>0)safe.push(ST_N[sl]||sl);
    const emp=(it.sockets||0)-((it.orbs||[]).length);if(emp>0)holes+=emp;}
  if(safe.length)add('⚒','ตีบวกแบบไม่มีวันแตก',`${safe.join(' · ')} ยังไม่ถึง +5 และมีหินตีบวกแล้ว (+1 ถึง +5 สำเร็จเสมอ)`,()=>A.openRefine&&A.openRefine(),'ไปตีบวก','refine');
  if(holes&&Object.keys(B).some(k=>/^orb_/.test(k)&&B[k]>0))add('💎','ยัดหินออฟ',`อุปกรณ์ที่สวมมีรูว่าง ${holes} รู และมีหินออฟในกระเป๋า`,()=>{A.openSmith();setTimeout(()=>{const b=$('#smw [data-tab="socket"]');b&&b.click();},60);},'ไปยัดหิน','orb');
  /* special stats (2026-11-25): reroll crystals in the bag + a worn piece with lines, until the first reroll → the smith's สถานะ tab */
  {const c=B.affcry||0,W=Object.values(EQ).map(id=>id&&IT[id]).filter(it=>it&&!it.broken&&(it.aff||[]).length),n=W.length;
    if(c>0&&n&&!W.some(it=>it.rr))add('💎','สุ่มสถานะพิเศษ',`มีผลึกสุ่มสถานะ ${c} ก้อน — สุ่มสถานะพิเศษของที่สวมใหม่ได้ ล็อกบรรทัดที่ชอบไว้ได้`,()=>{A.openSmith();setTimeout(()=>{const b=$('#smw [data-tab="trait"]');b&&b.click();},60);},'ไปช่าง','reroll');}
  {const better=[];for(const id of A.INV||[]){const it=IT[id];if(!it||it.broken)continue;const sl=slotOf(it);if(!sl||!(sl in ST_N))continue;const cur=EQ[sl]&&IT[EQ[sl]];
      if((it.lvReq||1)<=L&&(!cur||(it.lvReq||1)>(cur.lvReq||1))&&!better.includes(ST_N[sl]))better.push(ST_N[sl]);}
    if(better.length)add('🛡','ใส่อุปกรณ์ที่ดีกว่า',`ในกระเป๋ามี${better.join(' · ')}ที่เลเวลสูงกว่าชิ้นที่ใส่อยู่`,tgl('itw','buildItems'),'เปิดกระเป๋า','gear');}
  /* systems with a red dot of their own */
  const dot=m=>{const b=$(`#mgrid [data-m="${m}"]`);return !!b&&b.classList.contains('gdNew')&&!b.classList.contains('ulLock');};
  if(dot('tgem'))add('🗿','ศาลโทเท็มมีของรอ','มีหลุมที่สลักเปิดได้ หรือของขวัญเจมแปรสภาพรอรับ',()=>totemGems.open(),'เปิดศาล','totem');
  else{const d=TGD(),SK=G('SKILLS')||{},LVv=G('LV')||{},BK=G('BASIC_KEY'),hasSk=Object.keys(SK).some(k=>k!==BK&&LVv[k]>0&&!SK[k].passive&&SK[k].br!=='C');
    if(d&&hasSk&&ok('totem')&&(d.ss||[]).some((k,i)=>!k&&L>=([10,20,30,40,50][i]||99)&&(i===0||(d.cv&&d.cv['s'+i]))))add('🗿','วางเจมสกิลในหลุมว่าง','มีหลุมสกิลที่เปิดแล้วแต่ยังว่าง — สกัดสกิลเป็นเจม (แท็บ ⭐) แล้ววางลงหลุม',()=>totemGems.open(),'เปิดศาล','totem2');}
  if(dot('mgroots'))add('🌳','จุดรากได้','มีแต้มรากและของพอจุดโหนดต่อ',()=>ROOTS.open(),'เปิดราก','roots');
  if(ok('ring')){try{const d=RING.data(),OP=(window.RUNEDATA&&RUNEDATA.RING&&RUNEDATA.RING.open)||[30,30,40,40,50,50],open=i=>L>=OP[i];
      if(d.big.some((x,i)=>!x&&open(i))&&hasPre('sr_'))add('🔱','ฝังรูนวิญญาณ','วงเศษมีช่องใหญ่ว่าง และมีรูนวิญญาณในกระเป๋า',()=>RING.open(),'เปิดวงเศษ','ring');
      else if(hasPre('rstone')&&(B.rfeather||0)>0)add('📜','อ่านรูน','มีหินรูนดิบกับคัมภีร์หมอผี — อ่านแล้วได้รูนวิญญาณ',()=>RING.open(),'เปิดวงเศษ','read');}catch(e){}}
  if(ok('pet')&&window.PETS){if(hasPre('pegg_'))add('🥚','ฟักไข่','มีไข่สัตว์เลี้ยงในกระเป๋า',()=>PETS.open(),'เปิด','egg');
    else{try{if(PETS.S().box.length&&!PETS.active())add('🐾','พาสัตว์เลี้ยงออกเดินทาง','สัตว์เลี้ยงให้สเตตัสเฉพาะตอนที่พาออกมา',()=>PETS.open(),'เปิด','petout');}catch(e){}}}
  return out;}

/* ---------------- locked keys ---------------- */
addEventListener('keydown',e=>{if(!PLAY()||e.altKey||e.ctrlKey||e.metaKey)return;if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||''))return;
  for(const s of SY){if(!s.code||e.code!==s.code||ok(s.id))continue;e.stopImmediatePropagation();e.preventDefault();   /* held keys (repeat) are swallowed too */
    if(!e.repeat)say(`🔒 ${s.n} เปิดที่ Lv ${s.lv} (ตอนนี้ Lv ${lv()}) · ดูตัวอย่างได้ในคู่มือ (J)`);return;}},true);

/* ---------------- the unlock card ---------------- */
const POP=document.createElement('div');POP.id='ulPop';document.body.appendChild(POP);
['pointerdown','mousedown','touchstart'].forEach(ev=>POP.addEventListener(ev,e=>e.stopPropagation()));
const QUEUE=[];let showing=null;
function iconOf(s){const b=btnOf(s);const im=b&&b.querySelector('img,svg');if(im){const c=im.cloneNode(true);c.removeAttribute('style');c.style.cssText='';return c.outerHTML;}return `<span class="em">${s.ic}</span>`;}
const BIG=['#totemWin','#rtw','#rgw','#gdBook','#petw'];   /* a card waits while one of these is open */
const busy=()=>BIG.some(isOpen);
function blocked(){return [...document.querySelectorAll('#ccov,#rollwin,#deathov,#boot')].some(vis)||busy()||(($('#lvup')||{}).classList||{contains:()=>false}).contains('on')||(($('#gdC')||{}).classList||{contains:()=>false}).contains('on');}
function show(s){showing=s;const tut=s.tut&&window.GUIDE&&GUIDE.TUT&&GUIDE.TUT[s.tut];
  POP.innerHTML=`<div class="c"><div class="h">✨ ${s.note?'พลังใหม่':'ปลดล็อกระบบใหม่'} ✨</div>
    <div class="r"><div class="ic">${iconOf(s)}</div><div><div class="n">${s.n}${s.k&&!mob()?`<small>ปุ่ม ${s.k}</small>`:''}</div><div class="d">${s.d}</div></div></div>
    <div class="b">${s.open?`<button class="go" data-a="go">${s.note?'ไปดู':'เปิดดู'}</button>`:''}${tut?'<button data-a="tut">❓ สอนวิธีใช้</button>':''}<button class="lt" data-a="later">ไว้ทีหลัง</button></div></div>`;
  POP.classList.remove('on');void POP.offsetWidth;POP.classList.add('on');
  POP.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();const a=b.dataset.a;hide();
    if(a==='go'){try{s.open();}catch(x){}}else if(a==='tut'){try{GUIDE.runTut(s.tut);}catch(x){}}});
  if(s.chat)chat(`✨ <b style="color:#ffe08a">${s.note?'พลังใหม่':'ปลดล็อกระบบใหม่'}: ${s.n}</b>${s.k?` (ปุ่ม ${s.k})`:''} — ${s.d}`);}   /* the totem, the ring and the roots announce themselves in the chat already */
function hide(){POP.classList.remove('on');showing=null;syncButtons();}
function queue(s){if(!QUEUE.includes(s)&&showing!==s)QUEUE.push(s);}

/* ---------------- loop ---------------- */
let acc=0,lastLv=0;
function start(){if(started||!MODE())return;started=true;const isNew=load();
  /* first time this hero meets the unlock system: what it already reached is old news */
  if(isNew){for(const s of SY)if(lv()>=s.lv||used(s)){S.seen[s.id]='old';S.opened[s.id]=1;}save();}
  lastLv=lv();syncButtons();}
let tn=0;
/* how many things the player can do right now = a small green number on the 📖 buttons (menu + quest card) */
function badge(){const n=PLAY()?todo().length:0,t=n?String(n):null;
  for(const b of document.querySelectorAll('#mgrid [data-m="mgguide"],#gdQ [data-a="book"]')){if(t){if(b.dataset.tn!==t)b.dataset.tn=t;}else if(b.dataset.tn)delete b.dataset.tn;}}
function tick(){if(!started){if(MODE())start();return;}
  trio();totemView();if(++tn%5===0)try{badge();}catch(e){}
  if(!PLAY()){syncButtons();return;}
  for(const s of SY){if(S.seen[s.id]||!ok(s.id))continue;S.seen[s.id]=1;save();queue(s);}
  for(const s of SY)if(s.w&&!S.opened[s.id]&&isOpen(s.w)){S.opened[s.id]=1;save();}
  /* the player went there by himself while its card was up → the card goes; a full-screen window on top → the card waits behind it */
  if(showing){if(showing.w&&isOpen(showing.w))hide();else POP.style.visibility=busy()?'hidden':'';}
  if(!showing&&QUEUE.length&&!blocked()){const s=QUEUE.shift();if(S.opened[s.id]||(s.w&&isOpen(s.w))){S.opened[s.id]=1;save();}else show(s);}   /* already looking at it: no card */
  syncButtons();lastLv=lv();}
(function loop(){requestAnimationFrame(loop);const t=performance.now();if(t-acc<400)return;acc=t;try{tick();}catch(e){}})();

window.UNLOCK={SY,FEAT,ok,feat,todo,lv:id=>(BY[id]||FEAT[id]&&{lv:FEAT[id]}||{}).lv||1,get S(){return S;},sync:syncButtons,
  /* tests: show a card now / forget what was seen */
  pop(id){const s=BY[id];if(s)show(s);},hide,reset(){S={v:1,seen:{},opened:{}};save();syncButtons();},get showing(){return showing&&showing.id;}};
})();
