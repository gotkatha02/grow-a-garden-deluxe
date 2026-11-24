/* =====================================================================
   GUIDE — quest line for new players + how-to tutorials for every system
   (owner 2026-11-22 19:27: '3 แล้วก็ระบบสอนผู้เล่นในระบบต่างๆให้ใช้เป็น'). Design + tables: GUIDE_SYSTEM_TH.md.
   • เส้นทางนักผจญภัย (Q below): a chain of quests Lv 1 → ~30, each teaching one system. Tracker card (PC: right, under the
     minimap · phone: left, under the portrait): what to do + why, live progress, 🧭 auto-path (walks map to map through the
     warps, stops when the player steers), ❓ tutorial, 🎁 reward on claim.
   • สอนวิธีใช้ (TUT below): coach marks — the screen dims, a hole opens round the real button / window part, a finger and a
     bubble say what to do; a step moves on by itself when the player does it (or with ต่อไป). Nothing is blocked.
   • คู่มือนักผจญภัย (key J or the 📖 menu button): the quest log + every system (SYS below) with a short how-to and ▶ สอน.
   Save per hero and mode: af_guide_v1_<hero>_<mode>. Play mode: the tracker is on. Test mode: off (switch in the book),
     tutorials still play from the book. ?guide=1 forces the tracker on, ?guide=0 off. window.GUIDE = debug / test handle.
   Text is written for both PC (keys / mouse) and phone (body.mob: joystick, wheel, top menu row).
   ===================================================================== */
(function(){
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
if(typeof PS==='undefined'||!window.AFItems)return;
const $=s=>document.querySelector(s);
const mob=()=>document.body.classList.contains('mob');
const vis=el=>{if(!el)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05;};
const open=sel=>{const el=$(sel);return !!el&&vis(el)&&(el.classList.contains('open')||el.id==='totemWin'||getComputedStyle(el).display!=='none');};
const mg=id=>`#mgrid [data-m="${id}"]`;
const fmt=n=>Math.round(n).toLocaleString('en-US');
const A=()=>window.AFItems;
const icon=(id,sz)=>{try{return A().ui.etcIcon(id,sz||20);}catch(e){return '';}};
const etcName=id=>{try{return A().ui.etcName(id);}catch(e){return id;}};
const lv=()=>PS.lv||1;
const MODE=()=>(window.AFProgress&&AFProgress.mode)||null;
const URLG=(()=>{const m=/[?&]guide=(\d)/.exec(location.search);return m?m[1]:null;})();

/* ---------------- the hero's build advice (stat tutorial / quest text) ---------------- */
const PRE=(G('CHAR_PRESET')||{})[CHAR]||'STR',PRS=(G('PRESETS')||{})[PRE]||{str:1};
const TOP=Object.keys(PRS).sort((a,b)=>PRS[b]-PRS[a]).slice(0,2);
const SN={str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK'};
const BUILD=`${SN[TOP[0]]} + ${SN[TOP[1]]}`;
const MAINK=TOP[0];

/* ================================================================
   1. STATE + counters
   ================================================================ */
let S=null,KEY='';
function fresh(){return {v:1,q:0,st:'new',done:{},cnt:{},kc:{},base:null,seen:{},vis:{},on:MODE()==='play',min:false,gift:null,auto1:0};}
function load(){KEY='af_guide_v1_'+CHAR+'_'+(MODE()||'none');try{S=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){S=null;}
  const isNew=!S;if(!S)S=fresh();for(const k of ['done','cnt','kc','seen','vis'])S[k]=S[k]||{};
  if(URLG==='1')S.on=true;else if(URLG==='0')S.on=false;
  return isNew;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const C=k=>S.cnt[k]||0;
const bump=(k,n)=>{S.cnt[k]=(S.cnt[k]||0)+(n||1);dirty=1;};
let dirty=0;

/* ================================================================
   2. QUESTS — edit here. goal() = progress now, max = needed. 'since' goals count from the quest's start (S.base).
      rew: [id,n] items · ['z',n] zeny · ['gift','top'] a drop-set piece for your level · ['orb',1] an orb of your main stat
      nav: 'field' (best field for your level) · 'town' · 'capT' · 'boss' · a map id    tut: key of TUT
   ================================================================ */
const since=k=>C(k)-((S.base&&S.base[k])||0);
const sinceKc=k=>((S.kc&&S.kc[k])||0)-((S.base&&S.base.kc&&S.base.kc[k])||0);
const spUsed=()=>{const f=G('spUsed');return f?f():0;};
const ptsLeft=()=>{const f=G('pointsLeft');return f?f():0;};
const eqIt=sl=>{const id=EQ[sl];return id&&A().ITEMS[id];};
const TG=()=>{try{return window.totemGems&&totemGems.data();}catch(e){return null;}};
const gemSkill=()=>{const d=TG();return d&&d.ss&&d.ss[0];};
const CH=[['ก้าวแรกของนักผจญภัย','Lv 1–5'],['เตรียมตัวให้พร้อม','Lv 5–10'],['พลังแห่งโทเท็ม','Lv 10–12'],['โลกกว้าง','Lv 12–20'],['ผู้ท้าชิง','Lv 20–30']];
const Q=[
 {id:'stat',ch:0,lv:1,t:'ปลุกพลังในตัว',d:'ฮีโร่ใหม่มีแต้มสเตตัสรอใช้ — แต้มกำหนดว่าจะตีแรง ร่ายเวทเก่ง ถึก หรือหลบเก่ง',
  g:'ใช้แต้มสเตตัสให้เหลือไม่ถึง 10',goal:()=>ptsLeft()<10?1:0,max:1,
  pc:`กด A (หรือปุ่ม A มุมขวาล่าง) แล้วกด + — ฮีโร่นี้เหมาะกับ ${BUILD}`,ph:`แตะปุ่ม A แถวบน แล้วแตะ + — ฮีโร่นี้เหมาะกับ ${BUILD}`,
  tut:'stat',auto:1,rew:[['hp1',10],['z',300]]},
 {id:'hunt',ch:0,lv:1,t:'ออกล่าครั้งแรก',d:'มอนในทุ่งข้างเมืองเหมาะกับมือใหม่ — ล้มแล้วได้ EXP เงิน และของ',
  g:'ล้มมอน 5 ตัว',goal:()=>since('kill'),max:5,
  pc:'คลิกพื้น = เดิน · คลิกมอน = ตี · กด 🧭 ให้เดินไปทุ่งที่เหมาะกับเลเวลเอง',ph:'ลากจอยซ้ายล่าง = เดิน · แตะปุ่มดาบ = ตี · แตะ 🧭 ให้เดินไปเอง',
  tut:'fight',auto:1,nav:'field',rew:[['sp1',5],['z',500]]},
 {id:'lock',ch:0,lv:1,t:'ล็อกเป้าและออโต้',d:'ล็อกเป้าแล้วสกิลจะพุ่งหาตัวนั้นเสมอ · ออโต้ตีมอนใกล้สุดให้เอง',
  g:'ล็อกเป้า 1 ครั้ง + เปิด AUTO 1 ครั้ง',goal:()=>(since('lock')>0?1:0)+(since('auto')>0?1:0),max:2,
  pc:'คลิกมอน = ล็อก + ตี · T = เป้าถัดไป · Z = AUTO',ph:'แตะ 🎯 = เป้าถัดไป · ลาก 🎯 = เลือกเป้าเอง · แตะ AUTO',tut:'lock',rew:[['gift','top'],['z',300]]},
 {id:'equip',ch:0,lv:1,t:'สวมหมวกใหม่',d:'อุปกรณ์เพิ่ม ATK DEF และสเตตัส — ใส่ได้ 5 ช่อง: หมวก เกราะ อาวุธ รองเท้า เครื่องประดับ',
  g:'สวมหมวกที่ได้จากเควสต์ก่อน',goal:()=>S.gift?(Object.values(EQ).includes(S.gift)?1:0):(eqIt('top')?1:0),max:1,
  pc:'Alt+E เปิดกระเป๋า → แท็บ Equip → ดับเบิลคลิกหมวก',ph:'แตะปุ่ม E → แท็บ Equip → แตะหมวกสองครั้ง',tut:'equip',rew:[['z',1000]]},
 {id:'rest',ch:0,lv:1,t:'พักฟื้น',d:'นั่งพักฟื้น HP / SP เร็วขึ้น 2 เท่า · ยาจะกินเองเมื่อเลือดต่ำ (ตั้งได้ที่ ⚙)',
  g:'นั่งพัก 1 ครั้ง',goal:()=>since('sit')>0?1:0,max:1,
  pc:'กด Insert เพื่อนั่ง (เดินแล้วลุกเอง)',ph:'แตะปุ่ม 🧘 ข้างจอย',tut:'rest',rew:[['hp1',10],['sp1',5]]},
 {id:'wmap',ch:0,lv:1,t:'แผนที่โลก',d:'ดูว่าแมพไหนเหมาะกับเลเวล มอนตัวไหนดรอปอะไร และบอสอยู่ที่ไหน',
  g:'เปิดแผนที่โลก 1 ครั้ง',goal:()=>since('w_wm')>0?1:0,max:1,
  pc:'กด W หรือคลิกชื่อแมพใต้มินิแมพ',ph:'แตะชื่อแมพใต้มินิแมพมุมขวาบน',tut:'wmap',rew:[['ret',2],['z',300]]},
 {id:'skill',ch:0,lv:5,t:'วิชาแรก',d:'เลเวลละ 1 แต้มสกิล สกิลแรกเรียนได้ที่ Lv 5 — แต้มไม่พอเรียนทุกสาย ต้องเลือกว่าจะเก่งทางไหน',
  g:'เรียนสกิล 1 ระดับ',goal:()=>spUsed()>=1?1:0,max:1,
  pc:'กด K เปิดต้นสกิล แล้วคลิกช่องสกิลที่เรืองแสง',ph:'แตะปุ่ม K แถวบน แล้วแตะช่องสกิลที่เรืองแสง',tut:'skill',rew:[['hp1',5],['z',500]]},
 {id:'cast',ch:0,lv:5,t:'ใช้สกิลให้เป็น',d:'สกิลแรงกว่าการตีธรรมดามาก แต่ใช้ SP และต้องรอคูลดาวน์',
  g:'ใช้สกิล 5 ครั้ง',goal:()=>since('cast'),max:5,
  pc:'กดเลข 1–0 (Shift+เลข = แถวบน) หรือคลิกไอคอนในแถบสกิล',ph:'แตะสกิลในวงล้อขวาล่าง (ลากเพื่อเล็งเอง)',tut:'hotbar',nav:'field',rew:[['wore1',3],['ore1',3],['sp1',5]]},

 {id:'refine',ch:1,lv:5,t:'ตีบวกอาวุธ',d:'ตีบวก +1 ถึง +5 ไม่มีวันพัง ได้ ATK เพิ่มทุกขั้น — อาวุธใช้หินอาวุธ ชิ้นอื่นใช้หินชุด',
  g:'ตีบวกอาวุธถึง +1',goal:()=>{const w=eqIt('rhand');return w&&(w.ref||0)>=1?1:0;},max:1,
  pc:'กด B เปิดช่าง → แท็บ ตีบวก → เลือกอาวุธ → ตีบวก',ph:'แตะ E → ปุ่ม 🔨 ช่าง → แท็บ ตีบวก → เลือกอาวุธ',tut:'refine',rew:[['orb',1],['hp2',5],['z',1000]]},
 {id:'socket',ch:1,lv:5,t:'ยัดหินออฟ',d:'อุปกรณ์เจาะรูได้ 1–4 รู · หินออฟเพิ่มสเตตัส — มอนแต่ละตัวดรอปหินสเตตัสของตัวเอง',
  g:'ยัดหินออฟลงอุปกรณ์ที่สวมอยู่ 1 ก้อน',goal:()=>Object.values(EQ).some(id=>{const it=id&&A().ITEMS[id];return it&&(it.orbs||[]).length>0;})?1:0,max:1,
  pc:'B → แท็บ เจาะรู → ใช้สว่านเจาะ → คลิกหินออฟเพื่อยัด',ph:'ช่าง → แท็บ เจาะรู → เจาะ → แตะหินออฟ',tut:'socket',rew:[['drill',1],['z',1000]]},
 {id:'shop',ch:1,lv:5,t:'ร้านค้าและยา',d:'ร้านในเมืองขายยา หินตีบวกขั้น 1–2 และของใช้ · รับซื้อวัตถุดิบ',
  g:'เปิดร้านค้า 1 ครั้ง',goal:()=>since('w_shop')>0?1:0,max:1,pc:'กด N (หรือปุ่ม 🛒 ร้าน ในกระเป๋า)',ph:'แตะ E → ปุ่ม 🛒 ร้าน',tut:'shop',rew:[['hp2',5],['sp1',5]]},
 {id:'lv10',ch:1,lv:1,t:'ฝึกฝนให้แกร่ง',d:'เก็บเลเวลในทุ่งที่เหมาะกับเลเวล — Lv 10 ปลดล็อกศาลโทเท็ม ระบบแต่งสกิลด้วยเจม',
  g:'ถึง Lv 10',goal:()=>Math.min(lv(),10),max:10,pc:'กด 🧭 ให้เดินไปทุ่งที่เหมาะเอง · เปิด AUTO ช่วยตี',ph:'แตะ 🧭 ให้เดินไปเอง · เปิด AUTO ช่วยตี',
  nav:'field',rew:[['tess',5],['z',1000]]},

 {id:'extract',ch:2,lv:10,t:'ปลุกดาวสกิล',d:'Lv 10 หลุมสกิลแรกบนแท่นโทเท็มเปิด — สกัดสกิลเป็นเจม แล้วแต่งสกิลด้วยเจมได้ (สกัดครั้งแรกฟรี)',
  g:'สกัดสกิลเป็นเจม 1 สกิล',goal:()=>{const d=TG();return d&&d.sx&&Object.keys(d.sx).length?1:0;},max:1,
  pc:'กด G เปิดศาลโทเท็ม → แท็บ ⭐ สกิล → เลือกสกิล → ⚗ สกัดเป็นเจม',ph:'แตะปุ่ม G → แท็บ ⭐ สกิล → แตะสกิล → ⚗ สกัด',tut:'totem1',rew:[['tess',10]]},
 {id:'place',ch:2,lv:10,t:'แต่งสกิลด้วยเจม',d:'วางเจมสกิลลงหลุม แล้วใส่เจมแปรสภาพในหลุมทองของมัน — สกิลเปลี่ยนนิสัย (ได้อย่าง เสียอย่าง)',
  g:'วางเจมสกิล + ใส่เจมแปรสภาพ',goal:()=>{const d=TG();return d?((d.ss&&d.ss[0])?1:0)+((d.sm&&d.sm[0])?1:0):0;},max:2,
  pc:'แตะหลุมสกิลบนแท่นหิน → เลือกเจมสกิล · แท็บ 🔶 แปรสภาพ → ใส่ในหลุมทอง',ph:'แตะหลุมบนแท่นหิน → แตะเจม · แท็บ 🔶 → หลุมทอง',tut:'totem2',rew:[['tstone1',2],['z',2000]]},
 {id:'gemcast',ch:2,lv:10,t:'ลองพลังเจม',d:'ดูปุ่มสกิล — กรอบ / ไอคอนบอกว่าเจมทำงาน และเอฟเฟกต์ของสกิลก็เปลี่ยนตามเจม',
  g:'ใช้สกิลที่ใส่เจม 5 ครั้ง',goal:()=>{const k=gemSkill();return k?sinceKc(k):0;},max:5,
  pc:'กดปุ่มสกิลที่มีกรอบเจม',ph:'แตะสกิลที่มีกรอบเจมในวงล้อ',nav:'field',rew:[['tstone1',3]]},

 {id:'capital',ch:3,lv:12,t:'สู่เมืองหลวง',d:'เมืองหลวงอยู่กลางโลก — มีตลาดกลาง ร้านครบ และทางไปทุกดินแดน',
  g:'ไปถึงเมืองหลวง',goal:()=>S.vis.capT?1:0,max:1,pc:'กด 🧭 แล้วเดินตามเส้นทาง (วาร์ปทีละแมพ)',ph:'แตะ 🧭 แล้วรอเดินไปเอง',nav:'capT',rew:[['z',1000]]},
 {id:'market',ch:3,lv:12,t:'ตลาดกลาง',d:'ซื้อขายกับผู้เล่นคนอื่น ราคากลางขึ้นลงตามคนซื้อคนขาย · ของหายากเปิดรอบจอง 1 ชั่วโมง',
  g:'เปิดตลาดกลาง 1 ครั้ง',goal:()=>since('w_mkt')>0?1:0,max:1,pc:'ในเมืองหลวงกด N',ph:'ในเมืองหลวง: E → 🛒 ร้าน',tut:'market',nav:'capT',rew:[['z',1000]]},
 {id:'storage',ch:3,lv:12,t:'คลังเก็บของ',d:'คลังใช้ร่วมกันทุกฮีโร่ — ฝากของที่ยังไม่ใช้ กระเป๋าจะได้ไม่เต็ม',
  g:'เปิดคลัง 1 ครั้ง',goal:()=>since('w_sto')>0?1:0,max:1,pc:'ในเมืองกด H',ph:'ในเมือง: ตั้งค่า ⚙ หรือกด H บนคีย์บอร์ด',tut:'storage',rew:[['hp2',5],['z',500]]},
 {id:'lv15',ch:3,lv:1,t:'ไปให้ไกลขึ้น',d:'ทุ่งเลเวลสูงขึ้นให้ EXP มากขึ้น — ลองดันเจี้ยนดูก็ได้',
  g:'ถึง Lv 15',goal:()=>Math.min(lv(),15),max:15,pc:'🧭 พาไปทุ่งที่เหมาะกับเลเวล',ph:'แตะ 🧭',nav:'field',rew:[['wore2',2],['ore2',2]]},
 {id:'pet',ch:3,lv:15,t:'สัตว์เลี้ยงตัวแรก',d:'มอนที่มี 🐾 ในกรอบเป้าเลี้ยงได้ — ทุ่งรอบเมืองหลวงมีกระต่ายทุ่งกับปุยแดนดิไลออน (รับเครื่องรางผูกใจทุกแดน) · สัตว์เลี้ยงไม่ช่วยตีแต่ให้สเตตัส',
  g:'ได้ไข่ → ฟัก → พาออกเดินทาง',goal:()=>window.PETS&&PETS.goal?PETS.goal():0,max:3,
  pc:'ซื้อเครื่องรางผูกใจที่ร้านในเมือง → คลิกมอน 🐾 → กดปุ่ม 🐾 ผูกใจ ใต้กรอบเป้าจนหัวใจเต็ม (ห้ามตีมัน) → P ฟักไข่',ph:'ซื้อเครื่องรางที่ร้าน → แตะมอน 🐾 → แตะ 🐾 ผูกใจ ใต้กรอบเป้าจนหัวใจเต็ม → แตะ 🐾 เมนูบน ฟักไข่',rew:[['ptreat',1],['z',1500]]},
 {id:'carve',ch:3,lv:20,t:'สลักหลุมใหม่',d:'Lv 20 หลุมสกิลที่ 2 ถึงเลเวลแล้ว — แต่ต้องสลักเปิดด้วยของจากมอน (ฟรีแค่หลุมแรก)',
  g:'สลักเปิดหลุมสกิลที่ 2',goal:()=>{const d=TG();return d&&d.cv&&d.cv.s1?1:0;},max:1,
  pc:'G → แตะหลุมที่มีป้าย ⛏ สลัก → ดูของที่ต้องใช้ → ⛏ สลักเปิด',ph:'G → แตะหลุม ⛏ → ⛏ สลักเปิด',tut:'carve',rew:[['tess',20],['z',3000]]},

 {id:'lv25',ch:4,lv:1,t:'นักล่าตัวจริง',d:'ตีบวกให้สูงขึ้น เปลี่ยนอุปกรณ์ให้ตรงเลเวล และหาหินออฟจากมอนที่ดรอป',
  g:'ถึง Lv 25',goal:()=>Math.min(lv(),25),max:25,pc:'🧭 พาไปทุ่งที่เหมาะกับเลเวล',ph:'แตะ 🧭',nav:'field',rew:[['sp2',10],['hp3',5]]},
 {id:'boss',ch:4,lv:30,t:'ล้มบอสประจำแมพ',d:'บอสตัวแรก: ราชาแมงป่องเกลือ (ทะเลสาบเกลือ Lv 30) — ทุกบอสมีกลไกของตัวเอง ทำถูกได้ช่วงเปิด ✦ · ดรอปเจมแปรสภาพ เจมเสริม และชิ้นส่วนบอส',
  g:'ล้มบอส 1 ตัว',goal:()=>since('boss')>0?1:0,max:1,
  pc:'🧭 พาไปบอส · อ่านบรรทัดบอกใบ้ใต้แถบเลือดบอส · แดง = ออก · ฟ้า ✓ = เข้า · ทอง ◎ = ตีสิ่งนี้ (T สลับเป้า)',ph:'แตะ 🧭 · แดง = ออก · ฟ้า = เข้า · ทอง ◎ = แตะ 🎯 แล้วตี',tut:'boss',nav:'boss',rew:[['gsup',1],['z',5000]]},
 {id:'seal',ch:4,lv:20,t:'ตราแห่งดินแดน',d:'อุปกรณ์มีตราของดินแดน — ใส่ตราเดียวกัน 2 ชิ้นได้สเตตัสคู่ · 4 ชิ้นได้พลังพิเศษ',
  g:'สวมอุปกรณ์ตราเดียวกัน 2 ชิ้น',goal:()=>{const n={};for(const id of Object.values(EQ)){const it=id&&A().ITEMS[id];if(it&&it.seal)n[it.seal]=(n[it.seal]||0)+1;}return Math.min(2,Math.max(0,...Object.values(n),0));},max:2,
  pc:'คราฟต์ที่ช่าง (B) เลือกตราได้ หรือเปลี่ยนตราที่แท็บ ตรา',ph:'ช่าง → คราฟต์ / แท็บ ตรา',tut:'seal',rew:[['z',3000]]},
 {id:'end',ch:4,lv:1,t:'เส้นทางต่อจากนี้',d:'ยินดีด้วย! ต่อจากนี้: MVP เฟนเรียร์ · วัตถุโบราณจากบอส (R) · ตีบวก +10 ขึ้นไป · สเตตัสแตะ 99 ได้พลังพิเศษ · หลอมเจม 3→1 · หน้าโทเท็ม 3 หน้า',
  g:'เปิดคู่มือ (📖) อ่านระบบที่เหลือ',goal:()=>since('book')>0?1:0,max:1,pc:'กด J หรือปุ่ม 📖',ph:'แตะ 📖 บนการ์ดนี้',rew:[['tstone2',2],['z',5000]]}];

/* ================================================================
   3. TUTORIALS (coach marks) — each step: el (selector or fn → element) · t text · pc / ph per platform ·
      wait() → true advances by itself · go() runs when the step starts · cond() → false skips the step
   ================================================================ */
const learned=()=>{const SK=G('SKILLS')||{},L=G('LV')||{},B=G('BASIC_KEY');return Object.keys(SK).filter(k=>k!==B&&L[k]>0&&!SK[k].passive);};
const skBtn=()=>{const ks=learned();for(const k of ks){const el=$(mob()?`#mobSkW .mobSk[data-k="${k}"]`:`#hotbar .hbt[data-k="${k}"]`);if(vis(el))return el;}return $(mob()?'#mobSkW':'#hotbar');};
const firstSkillCell=()=>{const SK=G('SKILLS')||{},B=G('BASIC_KEY'),ok=c=>{const s=SK[c.dataset.k];return c.dataset.k!==B&&s&&!s.passive&&vis(c);};
  const L=[...document.querySelectorAll('#skw .tc.nx:not(.lk)')];return L.find(ok)||L.find(c=>c.dataset.k!==B&&vis(c))||null;};
const openStat=()=>{if(!open('#stw')){const f=G('toggleWin'),b=G('buildStatus');if(f&&b)f('stw',b);}};
const openSkill=()=>{if(!open('#skw')){const f=G('toggleSkillWin');if(f)f();}};
const openItems=()=>{if(!open('#itw')){const f=G('toggleWin'),b=G('buildItems');if(f&&b)f('itw',b);}};
const openSmith=tab=>{if(!open('#smw'))A().openSmith();if(tab){const b=$(`#smw [data-tab="${tab}"]`);if(b&&!b.classList.contains('on'))b.click();}};
const openTotem=()=>{if(!open('#totemWin')&&window.totemGems)totemGems.open();};
const tgTab=t=>{const b=$(`#tgRight [data-tab="${t}"]`);if(b&&!b.classList.contains('on'))b.click();};
const closeTotem=()=>{try{window.totemGems&&totemGems.close();}catch(e){}};
const TUT={
 stat:{t:'สเตตัส',s:[
  {el:mg('statb'),t:'ปุ่มนี้เปิดหน้าต่างสเตตัส (PC: Alt+A)',wait:()=>open('#stw')},
  {el:()=>$(`#stw .up[data-s="${MAINK}"]`),go:openStat,t:`กด + เพื่อเพิ่ม ${SN[MAINK]} — สเตตัสหลักของฮีโร่นี้ (ชุดที่แนะนำ: ${BUILD}) · ยิ่งสูงยิ่งใช้แต้มต่อขั้นมากขึ้น`,wait:()=>ptsLeft()<10},
  {el:'#stw .up[data-s="str"]',go:openStat,t:'STR = ATK สายตีกายภาพ · AGI = หลบ + ตีเร็ว · VIT = เลือด + ป้องกัน · INT = MATK + SP · DEX = แม่น + ร่ายไว · LUK = คริ + หลบเด็ดขาด'},
  {el:'#stx2',go:openStat,t:'กด รายละเอียด ดูค่า ATK MATK HIT FLEE — และพลังพิเศษเมื่อสเตตัสรวมถึง 99 (นับรวมของจากอุปกรณ์ด้วย)'}]},
 fight:{t:'การเดินและการต่อสู้',s:[
  {el:()=>mob()?$('#mobJoy'):null,pc:'คลิกพื้นเพื่อเดิน (กดค้างไว้ก็ได้) · คลิกมอนเพื่อล็อกเป้าและตี',ph:'ลากจอยตรงนี้เพื่อเดิน (แตะตรงไหนก็ได้ทางซ้ายของจอ)'},
  {el:()=>mob()?$('#mobAtk'):null,pc:'ตัวเลขเหนือหัวมอน: ขาว = ดาเมจ · เหลือง = คริ · MISS = พลาด (ค่า HIT ต่ำไป)',ph:'แตะ = ตีมอนใกล้สุด · กดค้าง = ตีต่อเนื่อง'},
  {el:'#mm',t:'มินิแมพ: จุดสีคือมอน — ทางออกไปแมพอื่นอยู่ที่ขอบแมพ'},
  {el:'#gdQ .nav',cond:()=>!!$('#gdQ .nav'),t:'กด 🧭 นำทาง แล้วฮีโร่จะเดินไปทุ่งที่เหมาะกับเลเวลเอง (ข้ามแมพให้ด้วย) — ขยับเองเมื่อไหร่ก็หยุด'}]},
 skill:{t:'ต้นสกิล',s:[
  {el:mg('skb'),t:'ปุ่มนี้เปิดต้นสกิล (PC: K)',wait:()=>open('#skw')},
  {el:'#skw .tt-tab[data-br="A"]',go:openSkill,t:'สกิลมี 3 สาย: Basic · Class A · Class B — สองสายเล่นคนละแบบ แต้มสกิลไม่พอเรียนครบ ต้องเลือกทางของตัวเอง'},
  {el:firstSkillCell,go:openSkill,t:'ช่องที่เรืองแสง = เรียนได้ตอนนี้ · แตะเพื่อเรียน (ระดับถัดไปต้องเลเวลถึงก่อน)',wait:()=>spUsed()>=1},
  {el:()=>skBtn(),pc:'สกิลที่เรียนแล้วไปอยู่ที่แถบสกิล — ลากสลับช่องได้',ph:'สกิลที่เรียนแล้วไปอยู่ในวงล้อ — กด ✎ จัดสกิล เพื่อย้ายช่อง'}]},
 hotbar:{t:'ใช้สกิล',s:[
  {el:()=>skBtn(),pc:'กดเลข 1–0 (Shift+เลข = แถวบน · Tab สลับหน้า) หรือคลิกไอคอน — สกิลจะพุ่งไปหาเป้าที่ล็อกไว้',ph:'แตะ = ใช้ทันที (เล็งเป้าให้เอง) · ลาก = เล็งเอง · ลากไปปล่อยที่ ✕ = ยกเลิก'},
  {el:()=>mob()?$('#mobTab'):null,cond:()=>mob(),t:'✎ จัดสกิล: ลากสกิลจากถาดซ้ายมาวางในวงล้อ · ชุดสกิลมี 5 ชุดสลับได้'},
  {el:'#hpb',t:'แถบฟ้าคือ SP — หมดแล้วใช้สกิลไม่ได้ · ยา SP หรือนั่งพักช่วยได้'}]},
 lock:{t:'ล็อกเป้า + ออโต้',s:[
  {el:()=>mob()?$('#mobTgt'):null,pc:'คลิกมอน = ล็อก + ตี · คลิกขวา = ล็อกอย่างเดียว · T / Shift+T = เป้าถัดไป / ก่อนหน้า · Esc = ปลดล็อก',ph:'🎯 แตะ = ล็อกเป้าถัดไป (บอสก่อน) · ลาก 🎯 = เลือกเป้าเอง (วงฟ้าเลื่อนตามนิ้ว ปล่อย = ล็อก · ลากไป ✕ = ยกเลิก) · กดค้าง = ปลดล็อก · แตะตัวมอนก็ล็อกได้'},
  {el:'#tlf',cond:()=>vis($('#tlf')),t:'กรอบเป้าหมาย: เลเวล (สีบอกว่ายากไหม) เลือด ธาตุ และของที่มอนตัวนี้ดรอป'},
  {el:()=>mob()?$('#mobAuto'):$('#autob'),pc:'AUTO (Z) = ตีมอนใกล้สุดเอง ใช้สกิลให้ด้วย — กดซ้ำเพื่อปิด',ph:'AUTO = ตีมอนใกล้สุดเอง ใช้สกิลให้ด้วย — แตะซ้ำเพื่อปิด'}]},
 equip:{t:'อุปกรณ์',s:[
  {el:mg('itb'),t:'ปุ่มนี้เปิดกระเป๋า (PC: Alt+E)',wait:()=>open('#itw')},
  {el:'#itw [data-t="equip"]',go:openItems,t:'แท็บ Equip = อุปกรณ์ในกระเป๋า · ดับเบิลคลิก (แตะสองครั้ง) เพื่อสวม · คลิกขวา = ดูรายละเอียด',wait:()=>!!$('#itw [data-t="equip"].on')},
  {el:mg('eqb'),t:'ปุ่มนี้ (PC: Alt+Q) ดูชุดที่สวมอยู่ทั้ง 5 ช่อง · ดับเบิลคลิกช่องเพื่อถอด'}]},
 rest:{t:'พักฟื้น + ยาอัตโนมัติ',s:[
  {el:()=>mob()?$('#mobSit'):null,pc:'กด Insert = นั่ง/ลุก · นั่งแล้วฟื้น HP SP เร็ว 2 เท่า · เดิน ตี หรือโดนตีแล้วลุกเอง',ph:'แตะ 🧘 = นั่ง/ลุก · นั่งแล้วฟื้นเร็ว 2 เท่า'},
  {el:mg('mggear'),t:'ตั้งค่า ⚙ → AUTO POTION: กินยาเองเมื่อ HP / SP ต่ำกว่าที่ตั้ง (เริ่มต้น HP 50% · SP 30%) · PC: F = ยา HP · V = ยา SP'}]},
 wmap:{t:'แผนที่โลก',s:[
  {el:'#mmname',t:'แตะชื่อแมพตรงนี้ (PC: W) เพื่อเปิดแผนที่โลก',wait:()=>open('#wmw')},
  {el:'#wm-sug',t:'แมพที่แนะนำสำหรับเลเวลตอนนี้ — แตะชื่อเพื่อดูรายละเอียด'},
  {el:'#wm-info',t:'รายละเอียดแมพ: เลเวลมอน บอส มอนแต่ละตัว และของดรอปพิเศษ (หินตีบวก / หินออฟ)'}]},
 refine:{t:'ตีบวก',s:[
  {el:()=>mob()?$('#itw [data-open="smith"]'):null,go:()=>{if(mob())openItems();},pc:'กด B เปิดช่างตีเหล็ก (คราฟต์ · ตรา · ตีบวก · เจาะรู)',ph:'ในกระเป๋ามีปุ่ม 🔨 ช่าง — แตะเพื่อเปิดช่าง',wait:()=>open('#smw')},
  {el:'#smw [data-tab="refine"]',go:()=>openSmith(),t:'แท็บ ตีบวก: +1–5 สำเร็จเสมอ · +6–10 พลาดได้ (ของแตกต้องซ่อม) · +11–15 ยากมากและใช้แร่ดาวตก'},
  {el:'#rfw',go:()=>{if(!open('#rfw'))A().openRefine();},t:'อาวุธใช้หินตีบวกอาวุธ ⚔ · หมวก เกราะ รองเท้า เครื่องประดับใช้หินชุด 🛡 · หินกันแตกกันของพัง · +7 / +10 / +12 / +15 ได้ความสามารถพิเศษเพิ่ม',wait:()=>{const w=eqIt('rhand');return w&&(w.ref||0)>=1;}}]},
 socket:{t:'เจาะรู + หินออฟ',s:[
  {el:'#smw [data-tab="socket"]',go:()=>openSmith(),t:'แท็บ เจาะรู: สว่านเจาะ 1–4 รู (สุ่ม · เจาะใหม่แล้วหินเดิมหาย) · คีมถอดหินได้โดยไม่เสียหิน'},
  {el:'#smw',go:()=>openSmith('socket'),t:'เลือกอุปกรณ์ แล้วแตะหินออฟด้านล่างเพื่อยัดลงรูว่าง · มอนแต่ละตัวดรอปหินสเตตัสของตัวเอง (ดูในแผนที่โลก)'}]},
 shop:{t:'ร้านค้า',s:[
  {el:()=>mob()?$('#itw [data-open="shop"]'):null,go:()=>{if(mob())openItems();},pc:'กด N เปิดร้านค้า',ph:'ในกระเป๋ามีปุ่ม 🛒 ร้าน',wait:()=>open('#shw')},
  {el:'#shw [data-stab="sell"]',t:'ร้านในเมืองเกิดขายของพื้นฐาน · เมืองหลวงขายครบและรับซื้อแพงกว่า 20% · หินตีบวกขั้น 3–4 ไม่มีขาย ต้องหาจากมอนหรือตลาดกลาง'}]},
 totem1:{t:'ศาลโทเท็ม: สกัดเจมสกิล',s:[
  {el:mg('tgem'),t:'ปุ่ม G เปิดศาลวิญญาณโทเท็ม — ที่แต่งสกิลด้วยเจม',wait:()=>open('#totemWin')},
  {el:'#tgRight [data-tab="sk"]',go:()=>{openTotem();const x=$('#wsX');if(x&&vis(x))x.click();tgTab('sk');},t:'แท็บ ⭐ สกิล = สกิลที่เรียนแล้ว · ต้องสกัดเป็นเจมก่อนวางบนแท่น (ครั้งแรกฟรี)'},
  {el:()=>$('#tgSkills button'),t:'แตะสกิลที่อยากแต่ง',wait:()=>/สกัด/.test(($('#tgUp')||{}).textContent||'')},
  {el:'#tgUp',t:'กด ⚗ สกัดเป็นเจม — ได้ระดับความหายากแบบสุ่ม (สีของเจม) พร้อมสเตตัสพิเศษ',wait:()=>{const d=TG();return d&&d.sx&&Object.keys(d.sx).length>0;}}]},
 totem2:{t:'ศาลโทเท็ม: วางเจม',s:[
  {el:()=>$('#tgBoard .tgN.ss'),go:()=>{openTotem();const x=$('#wsX');if(x&&vis(x))x.click();},t:'หลุมใหญ่บนแท่นหิน = หลุมสกิล · แตะหลุม แล้วแตะเจมสกิลในแท็บ ⭐ เพื่อวาง',wait:()=>{const d=TG();return d&&d.ss&&d.ss[0];}},
  {el:'#tgGiftB',cond:()=>vis($('#tgGiftB')),t:'ของขวัญ: ทุกหลุมสกิลที่เปิด เลือกเจมแปรสภาพฟรีได้ 1 เม็ด'},
  {el:()=>$('#tgBoard .tgN.smut'),go:()=>tgTab('mut'),t:'หลุมทองใต้หลุมสกิล = เจมแปรสภาพ: ได้อย่าง เสียอย่าง (เช่น แรงขึ้นแต่คูลนานขึ้น) · แตะหลุม แล้วแตะเจมในแท็บ 🔶',wait:()=>{const d=TG();return d&&d.sm&&d.sm[0];}},
  {el:()=>skBtn(),go:closeTotem,t:'ปุ่มสกิลที่ใส่เจมจะมีกรอบ / ไอคอนบอก และเอฟเฟกต์ของสกิลจะเปลี่ยนตามเจม'}]},
 carve:{t:'สลักหลุม',s:[
  {el:()=>$('#tgBoard .tgN.ss.pg'),go:()=>{openTotem();const x=$('#wsX');if(x&&vis(x))x.click();},t:'หลุมที่มีฝาปิด ⛏ = ยังไม่ได้สลัก · แตะเพื่อดูของที่ต้องใช้ (วัตถุดิบมอน หินโทเท็ม แก่น เงิน)'},
  {el:'#tgInfo',t:'แถวสีแดง = ยังขาด บอกด้วยว่าหาได้จากไหน · ครบแล้วกด ⛏ สลักเปิด'},
  {el:'#tgUp',t:'หลุมเสริมสีฟ้าข้างหลุมสกิลใส่เจมเสริมได้ (แรงครึ่งเดียว) · เสาโทเท็มด้านบนเปิดที่ Lv 52+ สำหรับเจม C'}]},
 market:{t:'ตลาดกลาง',s:[
  {el:'#mkx [data-mt="buy"]',go:()=>{if(!open('#mkx'))A().openMarket();},t:'ซื้อ: ทุกชิ้นราคาเดียวกัน (ราคากลาง) ขึ้นลงตามคนซื้อคนขาย'},
  {el:'#mkx [data-cat="round"]',t:'ของหายากหมด → คนลงขายใหม่เปิด "รอบจอง" 1 ชั่วโมง · คนจองมากกว่าของ = สุ่มผู้ได้ และราคาขึ้น'},
  {el:'#mkx [data-mt="sell"]',t:'ลงขาย: เลือกแค่จำนวน ราคาเป็นราคากลาง · ค่าลงขาย 1% + ภาษี 5%'},
  {el:'#mkx [data-mt="board"]',t:'กระดานราคา: ดูราคาย้อนหลังก่อนซื้อขาย'}]},
 storage:{t:'คลังเก็บของ',s:[
  {el:null,t:'คลัง (H ในเมือง) ใช้ร่วมกันทุกฮีโร่ — ฝากของไว้ให้ฮีโร่ตัวอื่นได้ · ใช้ได้ในเมืองเท่านั้น'}]},
 boss:{t:'บอส',s:[
  {el:'#mbBar',cond:()=>vis($('#mbBar')),t:'แถบบอส: เลือด · ระยะและทิศถ้าอยู่ไกล · ตายแล้วนับถอยหลังเกิดใหม่'},
  {el:'#mbCast',cond:()=>vis($('#mbCast')),t:'แถบใต้เลือดบอส = ท่าที่มันกำลังทำ + บอกใบ้ว่าต้องทำอะไร · แถบสีทอง = ขัดได้ (ทำเกจ KO ให้หมด)'},
  {el:null,t:'บอสแต่ละตัวมีกลไกของตัวเอง — สีบอกทุกอย่าง: แดง = เดินออก · ฟ้า ✓ = เข้าไปยืน · ทอง ◎ = ตีสิ่งนี้ (ออโต้ไม่ตีของทอง: คอม T / มือถือ 🎯 สลับเป้าเอง) · ม่วง = คำสาป'},
  {el:null,t:'ทำกลไกถูก = ช่วงเปิด ✦ (บอสมึน DEF 0 ตีไม่พลาด) · พลาด = โดนหนัก แต่ไม่ตายทันที · ไม่พลาดเลยทั้งไฟต์ = ล้มไร้ที่ติ ได้ชิ้นส่วนบอส +1 · เกิดใหม่ทุก 15–30 นาที'},
  {el:null,t:'ของบอส: เจมแปรสภาพ เจมเสริม ชิ้นส่วนบอส หินโทเท็ม — ชิ้นส่วนบอสใช้หลอมเจม 3→1 ที่ศาลโทเท็ม หรือขายในตลาดกลาง'}]},
 seal:{t:'ตราแห่งดินแดน',s:[
  {el:mg('eqb'),t:'อุปกรณ์ (ยกเว้นเครื่องประดับ) มีตราของดินแดน: กา งูขนนก ม้าบิน สคารับ กระเรียน — ดูที่มุมซ้ายล่างของไอคอน'},
  {el:null,t:'ตราเดียวกัน 2 ชิ้น = สเตตัสคู่ของดินแดนนั้น · 4 ชิ้น = เลือกพลังพิเศษ 1 ใน 3 (หน้าต่างอุปกรณ์) · เปลี่ยนตราที่ช่าง แท็บ ตรา'}]}};

/* ================================================================
   4. SYSTEMS for the book — icon · name · what · how · window opener · tutorial
   ================================================================ */
const SYS=[
 ['📊','สเตตัส','STR AGI VIT INT DEX LUK แบบ Ragnarok — เลเวลละหลายแต้ม ยิ่งสเตตัสสูงยิ่งใช้แต้มต่อขั้นมาก · สเตตัสรวมถึง 99 ได้พลังพิเศษ',openStat,'stat'],
 ['⚔','การต่อสู้','เดิน ตี ล็อกเป้า ออโต้ · ตีธรรมดาและสกิลกายภาพพลาดได้ (HIT ปะทะ FLEE) · เวทไม่พลาด',null,'fight'],
 ['📘','สกิล','3 สาย Basic / A / B เลเวลละ 1 แต้ม — เรียนไม่ครบทุกสาย ต้องเลือกทาง',openSkill,'skill'],
 ['🎯','ใช้สกิล + ล็อกเป้า','แถบสกิล / วงล้อ · ล็อกเป้า · ออโต้',null,'hotbar'],
 ['🛡','อุปกรณ์','5 ช่อง · ของต้องเลเวลถึงถึงจะให้พลัง · ไอคอนมุมซ้ายล่าง = ตราดินแดน',openItems,'equip'],
 ['⚒','ตีบวก','+1–5 ปลอดภัย · +6–10 พลาดแล้วแตก (ซ่อมได้) · +11–15 ยากมาก · +7/+10/+12/+15 ได้ความสามารถพิเศษ',()=>{A().openSmith();setTimeout(()=>{const b=$('#smw [data-tab="refine"]');if(b)b.click();},50);},'refine'],
 ['💎','หินออฟ + เจาะรู','เจาะรู 1–4 รู · มอนแต่ละตัวดรอปหินสเตตัสของตัวเอง · รวมหิน 3→1 ได้ขั้นสูงขึ้น',()=>openSmith('socket'),'socket'],
 ['🗺','แผนที่โลก','แมพแนะนำตามเลเวล · มอน ของดรอป และบอสของทุกแมพ',()=>{const f=window.toggleWorldMap;if(f&&!open('#wmw'))f();},'wmap'],
 ['🧘','พักฟื้น + ยา','นั่งฟื้นเร็ว 2 เท่า · ยาอัตโนมัติตั้งที่ ⚙',null,'rest'],
 ['🛒','ร้านค้า','ยา หินตีบวกขั้น 1–2 ของใช้ · ขายวัตถุดิบ / หินออฟ',()=>A().openShop(),'shop'],
 ['📦','คลัง','ใช้ร่วมทุกฮีโร่ · ในเมืองเท่านั้น (H)',()=>A().openStorage(),'storage'],
 ['🗿','ศาลโทเท็ม','สกัดสกิลเป็นเจม → วางบนแท่น → ใส่เจมแปรสภาพ (ได้อย่าง เสียอย่าง) + เจมเสริม · สลักหลุมใหม่ด้วยของ · หลอมเจม 3→1 · 3 หน้า สลับตามงาน',openTotem,'totem1'],
 ['🗿','วางเจม','หลุมสกิล · หลุมทอง (แปรสภาพ) · หลุมฟ้า (เสริม ครึ่งแรง) · เจมชนิดเดียวกัน 2 เม็ด = เรโซแนนซ์',openTotem,'totem2'],
 ['⛏','สลักหลุม','ทุกหลุมเปิดด้วยของ (ฟรีแค่หลุมแรก) · แถวแดงบอกของที่ขาดและที่หา',openTotem,'carve'],
 ['🌳','รากโทเท็ม','ปลดสกิล C ที่นี่ (Lv 31+) · เดินรากจากหัวใจ จุดโหนดด้วยแต้มราก + ยางวิญญาณ / วัตถุดิบ / เหรียญทอง · ปม C ต้องจุดรอบปม 3/6 + เจมสกิลราก (U)',()=>{try{ROOTS.open();}catch(e){}},null],
 ['🔱','วงเศษโทเท็ม','รูนวิญญาณสัตว์ 6 ช่อง (ความสามารถพิเศษทั้งชุดสกิล) + รูนสลัก 3 สี 12 ช่อง · สีตรง 1/2/3 เส้น = ขั้น I/II/III · อ่านหินรูนดิบด้วยคัมภีร์หมอผี (Y)',()=>{try{RING.open();}catch(e){}},null],
 ['🏺','ตราแห่งดินแดน','ตราเดียวกัน 2 ชิ้น = สเตตัสคู่ · 4 ชิ้น = พลังพิเศษ',()=>{const f=G('toggleWin'),b=G('buildEquip');if(f&&b&&!open('#eqw'))f('eqw',b);},'seal'],
 ['🏛','ตลาดกลาง','ราคากลางตามคนซื้อคนขาย · รอบจอง 1 ชั่วโมงเมื่อของหายากหมด',()=>A().openMarket(),'market'],
 ['👑','บอส','บอสประจำแมพ 15 ตัว · MVP เฟนเรียร์ · ของดรอปเจมและชิ้นส่วนบอส',null,'boss'],
 ['🐾','สัตว์เลี้ยง','จับมอน 🐾 ด้วยเครื่องรางผูกใจ (ไม่สุ่ม: เติมหัวใจจนเต็ม ห้ามตีมัน) → ไข่ → ฟักสุ่มระดับ → พาออกเดินทางได้สเตตัส · ความผูกพัน 1–10 จากการสู้ด้วยกัน ลูบหัว · ไม่ช่วยตี ไม่ต้องให้อาหาร',()=>window.PETS&&PETS.open(),null],
 ['🐺','วัตถุโบราณ','ของจากบอส ใส่ช่องเครื่องประดับ · ใช้ด้วยปุ่ม R · เพิ่มดาวด้วยเศษวัตถุโบราณ',()=>{window.RELIC&&RELIC.open&&RELIC.open();},null]];

/* ================================================================
   5. HOOKS — counters (monotonic, saved) + window opens + map visits
   ================================================================ */
function hooks(){
  {const f=G('onKill');if(typeof f==='function'){const _ok=f;window.onKill=onKill=function(e){const r=_ok.apply(this,arguments);try{bump('kill');if(e&&!e.mini&&(e.boss||(e.m&&e.m.boss)))bump('boss');}catch(x){}return r;};}}
  {const f=G('castSkillNow');if(typeof f==='function'){const _cs=f;castSkillNow=function(key){const r=_cs.apply(this,arguments);try{if(r!==false&&key&&key!==G('BASIC_KEY')){bump('cast');S.kc[key]=(S.kc[key]||0)+1;}}catch(x){}return r;};}}
  if(window.TL&&TL.set){const _set=TL.set;TL.set=function(e){const r=_set.apply(this,arguments);if(e)bump('lock');return r;};}
  {const f=G('mapRouteTo');if(typeof f==='function'){const _mr=f;mapRouteTo=function(){if(!NAV.self&&NAV.on)navStop('');return _mr.apply(this,arguments);};}}}
const WATCH=[['w_wm','#wmw'],['w_shop','#shw'],['w_mkt','#mkx'],['w_sto','#kfw'],['w_smith','#smw'],['w_stat','#stw'],['w_skill','#skw'],['w_item','#itw'],['w_totem','#totemWin']];
const was={};
function poll(){
  for(const [k,sel] of WATCH){const o=open(sel);if(o&&!was[k])bump(k);was[k]=o;}
  const au=!!G('autoMode');if(au&&!was.auto)bump('auto');was.auto=au;
  const si=!!(player&&player.sitting);if(si&&!was.sit)bump('sit');was.sit=si;
  const m=G('curMap');if(m&&!S.vis[m]){S.vis[m]=1;dirty=1;}}

/* ================================================================
   6. QUEST ENGINE
   ================================================================ */
const cur=()=>Q[S.q]||null;
function prog(q){let n=0;try{n=q.goal()||0;}catch(e){n=0;}return [Math.min(n,q.max),q.max];}
function begin(){const q=cur();if(!q)return;S.base=Object.assign({},S.cnt,{kc:Object.assign({},S.kc)});S.st='run';dirty=1;}
function check(){const q=cur();if(!q){return;}if(S.st==='new')begin();
  if(S.st==='run'&&lv()>=q.lv){const [n,m]=prog(q);if(n>=m){S.st='done';dirty=1;chat(`📜 เควสต์สำเร็จ: <b>${q.t}</b> — แตะ 🎁 ที่การ์ดเควสต์เพื่อรับรางวัล`);pulse();}}}
function claim(){const q=cur();if(!q||S.st!=='done')return;const got=give(q.rew||[]);S.done[q.id]=1;S.q++;S.st='new';dirty=1;
  toast(`🎁 ${q.t}`,got);chat(`🎁 รางวัลเควสต์ <b>${q.t}</b>: ${got.map(g=>g.txt).join(' · ')}`);navStop('');
  const n=cur();if(n){begin();if(lv()<n.lv)chat(`📜 เควสต์ถัดไป <b>${n.t}</b> เปิดที่ Lv ${n.lv}`);else if(n.auto&&!S.seen['q_'+n.id]){S.seen['q_'+n.id]=1;setTimeout(()=>runTut(n.tut),900);}}
  else chat('🎉 จบเส้นทางนักผจญภัยแล้ว! คู่มือ (J / 📖) ยังเปิดดูระบบต่าง ๆ ได้ตลอด');
  save();render(true);}
function give(rew){const out=[];const a=A();
  for(const [id,n] of rew){try{
    if(id==='z'){a.zeny=a.zeny+n;out.push({ic:'<b class="z">z</b>',txt:fmt(n)+'z'});}
    else if(id==='gift'){const g=a.gradeOfLv?a.gradeOfLv(Math.max(lv(),1)):1,iid=a.dropSetItem(g,n);a.buyGear(iid,0);S.gift=iid;const it=a.ITEMS[iid];out.push({ic:'🎩',txt:it?it.n:'อุปกรณ์'});}
    else if(id==='orb'){const st=['str','agi','vit','int','dex','luk'].includes(MAINK)?MAINK:'str',k=`orb_${st}_1`;a.add(k,n);out.push({ic:icon(k),txt:etcName(k)+' ×'+n});}
    else if(id==='gsup'){const L=(window.GEMDATA&&GEMDATA.SUP)||[];if(L.length){const k='gsup_'+L[Math.floor(Math.random()*L.length)][0];a.add(k,n);out.push({ic:icon(k),txt:etcName(k)+' ×'+n});}}
    else{a.add(id,n);out.push({ic:icon(id),txt:etcName(id)+' ×'+n});}}catch(e){}}
  return out;}
/* an old play save meeting the guide for the first time: quests far below its level are skipped (no reward spam) */
function fastForward(){const L=lv();if(L<5)return;let i=0;while(i<Q.length-1&&((Q[i].lv<L-2&&/^lv|^stat|^hunt|^skill|^cast|^lock|^equip|^rest|^wmap/.test(Q[i].id))||(/^lv(\d+)/.test(Q[i].id)&&+RegExp.$1<=L))){S.done[Q[i].id]='skip';i++;}S.q=i;S.st='new';}

/* ================================================================
   7. NAVIGATION (🧭) — BFS over the warps, then walk to the next warp on this map (mapRouteTo)
   ================================================================ */
const NAV={on:false,to:null,label:'',self:false,map:null,t:0,tries:0,last:null};
const VKM=()=>window.VK_MAPS||{};
function adj(){const E={};const add=(a,b)=>{(E[a]=E[a]||new Set()).add(b);(E[b]=E[b]||new Set()).add(a);};
  for(const id in VKM())for(const w of (VKM()[id].warps||[]))if(w.to)add(id,w.to);return E;}
function bfs(from,to){const E=adj();const prev={[from]:null},qq=[from];while(qq.length){const a=qq.shift();if(a===to)break;for(const b of (E[a]||[]))if(!(b in prev)){prev[b]=a;qq.push(b);}}
  if(!(to in prev))return null;const path=[];for(let x=to;x!=null;x=prev[x])path.unshift(x);return path;}
const TOWNS_M=['frostheim','aztT','grkT','egyT','jpnT','capT'];
const kindOf=id=>TOWNS_M.includes(id)?'town':/D\d|cata|rift/.test(id)?'dun':'field';
function distFrom(id){const m=G('curMap');const p=m&&bfs(m,id);return p?p.length:99;}
function navTarget(kind){const L=lv(),Z=window.MAP_ZONE||{},home=(G('HERO_TOWN')||{})[CHAR]||'frostheim';
  if(kind==='town')return home;if(kind==='capT')return 'capT';
  if(kind==='boss'){const B=window.MBOSS&&MBOSS.list||{};const c=Object.keys(B).filter(id=>(MBOSS.info(id)||{}).lv<=L+3).sort((a,b)=>distFrom(a)-distFrom(b));
    return c[0]||Object.keys(B).sort((a,b)=>(MBOSS.info(a).lv-MBOSS.info(b).lv))[0]||null;}
  if(kind==='field'){let c=Object.keys(VKM()).filter(id=>kindOf(id)==='field'&&Z[id]&&Z[id][0]<=L+1&&Z[id][1]>=L-1);
    if(!c.length)c=Object.keys(VKM()).filter(id=>kindOf(id)==='field'&&Z[id]&&Z[id][0]<=L).sort((a,b)=>Z[b][1]-Z[a][1]).slice(0,6);
    c.sort((a,b)=>distFrom(a)-distFrom(b)||Math.abs((Z[a][0]+Z[a][1])/2-L)-Math.abs((Z[b][0]+Z[b][1])/2-L));return c[0]||null;}
  return kind;}
const mapName=id=>{const D=G('MAPDEF')||{};return (D[id]&&D[id].name)||id;};
function navStart(kind){const to=navTarget(kind);if(!to){msg('ไม่เจอแมพที่เหมาะ');return;}
  const m=G('curMap');if(m===to&&kind!=='field'){msg('อยู่ที่ '+mapName(to)+' แล้ว');return;}
  if(m===to){msg('แมพนี้เหมาะกับเลเวลแล้ว — ล่ามอนได้เลย');return;}
  Object.assign(NAV,{on:true,to,label:mapName(to),map:null,t:0,tries:0,last:null});chat(`🧭 นำทางไป <b>${NAV.label}</b> — ขยับเองเมื่อไหร่ก็หยุด`);navStep();render(true);}
function navStop(why){if(!NAV.on)return;NAV.on=false;if(why)chat(why);render(true);}
function navStep(){const m=G('curMap'),h=m&&(G('mapHosts')||{})[m];if(!NAV.on||!h||!h.ready||G('mapFadeDir'))return;
  if(m===NAV.to){navStop(`🧭 ถึง <b>${NAV.label}</b> แล้ว`);return;}
  const path=bfs(m,NAV.to);if(!path||path.length<2){navStop('🧭 หาทางไป '+NAV.label+' ไม่เจอ');return;}
  const ws=(typeof h.warps==='function'?h.warps():h.warps)||[];const w=ws.find(x=>x.to===path[1]);
  if(!w){navStop('🧭 แมพนี้นำทางอัตโนมัติไม่ได้ — ดูทางออกในแผนที่โลก (W)');return;}
  const [x,y]=G('M2W')(w);NAV.self=true;let ok=false;try{ok=G('mapRouteTo')(x,y);}finally{NAV.self=false;}
  NAV.map=m;NAV.last={x:player.x,y:player.y,t:performance.now()};NAV.goal={x,y};if(!ok){if(++NAV.tries>3)navStop('🧭 เดินไปทางออกไม่ได้');}}
function navTick(){if(!NAV.on)return;const m=G('curMap');if(G('mapFadeDir'))return;
  if(m!==NAV.map){if(!NAV.t)NAV.t=performance.now();if(performance.now()-NAV.t>700){NAV.t=0;NAV.tries=0;navStep();}return;}
  const idle=!player.moveT&&!player.action&&!player.attackTarget&&!(player.moveQ&&player.moveQ.length);
  if(idle&&NAV.goal&&Math.hypot(player.x-NAV.goal.x,player.y-NAV.goal.y)>60){if(++NAV.tries>4)navStop('🧭 หยุดนำทาง');else navStep();}}
/* steering by hand stops the auto-path: WASD / arrows, or the phone joystick (left side of the canvas) */
addEventListener('keydown',e=>{if(NAV.on&&/^(KeyW|KeyA|KeyS|KeyD|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/.test(e.code)&&!/INPUT|TEXTAREA/.test(e.target.tagName))navStop('');},true);
addEventListener('pointerdown',e=>{if(NAV.on&&e.pointerType!=='mouse'&&e.target&&e.target.id==='c'&&e.clientX<innerWidth*.45)navStop('');},true);

/* ================================================================
   8. UI — tracker card, toast, coach marks, book
   ================================================================ */
const CSS=`
#gdQ{position:fixed;right:10px;top:196px;width:250px;z-index:13;box-sizing:border-box;padding:8px 10px 9px;border-radius:14px;color:#fff3d6;
  background:linear-gradient(rgba(62,34,16,.9),rgba(38,20,9,.9));border:2px solid #d9a441;box-shadow:0 6px 18px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,220,150,.25);
  font:400 12px/1.45 Prompt,Mitr,sans-serif;user-select:none;-webkit-user-select:none;display:none}
#gdQ.on{display:block}
#gdQ .hd{display:flex;align-items:center;gap:6px;font:500 10.5px Mitr,sans-serif;color:#f2c96a;letter-spacing:.2px}
#gdQ .hd span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#gdQ .hd button{flex:none;width:24px;height:22px;border-radius:7px;border:1px solid rgba(255,214,140,.5);background:rgba(255,255,255,.08);color:#ffe9b0;font:600 12px Mitr,sans-serif;cursor:pointer;padding:0}
#gdQ .tt{font:600 14px/1.25 Mitr,sans-serif;color:#fff;margin:3px 0 2px}
#gdQ .ds{color:#e9d3ad;font-size:11.5px}
#gdQ .gl{margin-top:5px;font:500 12px Mitr,sans-serif;color:#ffe08a}
#gdQ .pb{position:relative;height:7px;border-radius:5px;background:rgba(0,0,0,.45);overflow:hidden;margin-top:4px;border:1px solid rgba(255,214,140,.25)}
#gdQ .pb i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#f2bf4e,#ffe9a0);border-radius:5px;transition:width .3s}
#gdQ .hw{margin-top:4px;color:#cfe8ff;font-size:11px}
#gdQ .rw{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:5px;font-size:10.5px;color:#f2c96a}
#gdQ .rw .ri{display:inline-flex;align-items:center;gap:2px;padding:1px 5px 1px 2px;border-radius:8px;background:rgba(255,255,255,.08);color:#fff3d6}
#gdQ .rw .ri svg,#gdQ .rw .ri img{width:16px;height:16px}
#gdQ .bt{display:flex;gap:5px;margin-top:7px}
#gdQ .bt button{flex:1;height:28px;border-radius:9px;border:2px solid #5a2e16;background:linear-gradient(#fff1c9,#f2c96a);color:#3a1f14;font:600 12px Mitr,sans-serif;cursor:pointer;padding:0 4px;white-space:nowrap}
#gdQ .bt button.nav.on{background:linear-gradient(#bfe8ff,#5aa8e0);color:#0e2a44}
#gdQ .bt button.cl{background:linear-gradient(#fff9c8,#ffcf3a);animation:gdGlow 1s ease-in-out infinite}
#gdQ.done{border-color:#ffe066;box-shadow:0 0 18px rgba(255,220,90,.55),0 6px 18px rgba(0,0,0,.35)}
#gdQ.min .ds,#gdQ.min .hw,#gdQ.min .rw,#gdQ.min .gl,#gdQ.min .pb{display:none}#gdQ.min .bt{margin-top:4px}
#gdQ .z,#gdT .z{display:inline-block;width:16px;height:16px;border-radius:50%;background:#ffd36a;color:#7a4a10;font:800 11px/16px Mitr,sans-serif;text-align:center;border:1px solid #b8740c}
#gdQ .lk{color:#ff9a8a;font:500 11.5px Mitr,sans-serif;margin-top:4px}
#gdQ .bt .bk{display:none}
body.mob #gdQ{left:4px;right:auto;top:90px;width:208px;padding:4px 7px 5px;border-radius:10px;font-size:11px}
body.mob #gdQ .hd{display:none}
body.mob #gdQ .tt,body.mob #gdQ .gl,body.mob #gdQ .lk{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.mob #gdQ .tt{font-size:12px;margin:0}
body.mob #gdQ .gl,body.mob #gdQ .lk{margin-top:1px;font-size:10.5px}
body.mob #gdQ .pb{height:5px;margin-top:2px}
body.mob #gdQ .ds,body.mob #gdQ .hw,body.mob #gdQ .rw{display:none}
body.mob #gdQ.ex .ds,body.mob #gdQ.ex .hw{display:block}body.mob #gdQ.ex .rw{display:flex}body.mob #gdQ.ex .tt,body.mob #gdQ.ex .gl,body.mob #gdQ.ex .lk{white-space:normal}
body.mob #gdQ .bt{margin-top:4px;gap:4px}body.mob #gdQ .bt button{height:22px;font-size:10.5px;border-width:1.5px;border-radius:7px}
body.mob #gdQ .bt .bk{display:block;flex:none;width:26px}
body.mob #gdQ.min .bt{margin-top:3px}
@keyframes gdGlow{0%,100%{box-shadow:0 0 0 rgba(255,220,90,0)}50%{box-shadow:0 0 12px rgba(255,220,90,.9)}}
@keyframes gdPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.65}}
@keyframes gdTap{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,-7px)}}
@keyframes gdIn{from{opacity:0;transform:translate(-50%,10px) scale(.94)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
#gdC{position:fixed;inset:0;z-index:9000;pointer-events:none;display:none}
#gdC.on{display:block}
#gdC .dim{position:fixed;inset:0;background:rgba(12,6,2,.55)}
#gdC .hole{position:fixed;border-radius:12px;box-shadow:0 0 0 200vmax rgba(12,6,2,.55);transition:left .25s,top .25s,width .25s,height .25s}
#gdC .ring{position:fixed;border:3px solid #ffd77a;border-radius:14px;box-shadow:0 0 14px rgba(255,215,122,.9),inset 0 0 10px rgba(255,215,122,.5);animation:gdPulse 1.1s ease-in-out infinite;transition:left .25s,top .25s,width .25s,height .25s}
#gdC .hand{position:fixed;width:38px;height:38px;animation:gdTap 1s ease-in-out infinite;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
#gdC .tip{position:fixed;width:min(320px,86vw);box-sizing:border-box;pointer-events:auto;background:linear-gradient(#fffaf0,#ffeccc);color:#4a2a16;border:2px solid #c98953;border-radius:14px;padding:10px 12px 9px;
  box-shadow:0 10px 28px rgba(0,0,0,.45);font:400 13px/1.5 Prompt,sans-serif;transition:left .2s,top .2s}
#gdC .tip .tt{display:flex;align-items:center;gap:6px;font:600 14px Mitr,sans-serif;color:#9e3a2f;margin-bottom:3px}
#gdC .tip .tt small{margin-left:auto;font:500 11px Mitr,sans-serif;color:#a0764e}
#gdC .tip .bt{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}
#gdC .tip .bt button{height:30px;padding:0 12px;border-radius:9px;border:2px solid #8a4e24;background:linear-gradient(#fff1c9,#f2bf4e);color:#3a1f14;font:600 12.5px Mitr,sans-serif;cursor:pointer}
#gdC .tip .bt button.sk{background:rgba(255,255,255,.6);border-color:#c98953;color:#8a5a36;font-weight:500}
#gdC .tip .wt{font:500 11.5px Mitr,sans-serif;color:#2e8a3a;margin-top:5px}
body.mob #gdC .tip{font-size:12px;padding:8px 10px 7px}body.mob #gdC .tip .bt button{height:26px}
#gdT{position:fixed;left:50%;top:21%;z-index:8500;pointer-events:none;transform:translateX(-50%)}
#gdT .it{min-width:240px;max-width:min(420px,90vw);padding:12px 16px;border-radius:16px;text-align:center;color:#fff3d6;background:linear-gradient(rgba(70,38,14,.95),rgba(40,20,8,.95));
  border:2px solid #ffd36a;box-shadow:0 0 24px rgba(255,210,90,.55);font:400 13px/1.5 Prompt,sans-serif;animation:gdIn .35s ease-out}
#gdT .it b.h{display:block;font:600 16px Mitr,sans-serif;color:#ffe08a;margin-bottom:6px}
#gdT .it .g{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}#gdT .it .g span{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:9px;background:rgba(255,255,255,.1)}
#gdT .it .g svg,#gdT .it .g img{width:20px;height:20px}
#gdBook.ttw{width:min(720px,96vw);max-height:88vh}
#gdBook .ttbd{max-height:calc(88vh - 44px);overflow:auto}
#gdBook .gtabs{display:flex;gap:6px;margin:6px 0 8px}#gdBook .gtabs button{flex:1;height:32px;border-radius:10px;border:2px solid #8a4e24;background:rgba(255,250,238,.6);font:600 13px Mitr,sans-serif;color:#5a2e16;cursor:pointer}
#gdBook .gtabs button.on{background:linear-gradient(#fff1c9,#f2bf4e)}
#gdBook .chh{font:600 13px Mitr,sans-serif;color:#9e3a2f;margin:8px 0 4px}
#gdBook .qr{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:10px;background:rgba(255,250,238,.55);margin-bottom:4px;font:400 12px/1.45 Prompt,sans-serif}
#gdBook .qr .m{flex:none;width:22px;text-align:center;font:600 14px Mitr,sans-serif}
#gdBook .qr.cur{background:linear-gradient(rgba(255,241,201,.95),rgba(242,201,106,.7));border:1px solid #c98953}
#gdBook .qr.lock{opacity:.55}
#gdBook .qr b{font:600 12.5px Mitr,sans-serif;color:#4a2a16}
#gdBook .sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}
#gdBook .sc{display:flex;flex-direction:column;gap:4px;padding:8px 9px;border-radius:11px;background:rgba(255,250,238,.6);border:1px solid rgba(201,137,83,.5);font:400 12px/1.45 Prompt,sans-serif}
#gdBook .sc .n{display:flex;align-items:center;gap:6px;font:600 13.5px Mitr,sans-serif;color:#4a2a16}#gdBook .sc .n i{font-style:normal;font-size:18px}
#gdBook .sc .bb{display:flex;gap:5px;margin-top:auto}
#gdBook .sc button,#gdBook .opt button{height:28px;padding:0 10px;border-radius:9px;border:2px solid #8a4e24;background:linear-gradient(#fff1c9,#f2bf4e);color:#3a1f14;font:600 12px Mitr,sans-serif;cursor:pointer}
#gdBook .sc button.o{background:rgba(255,255,255,.65);border-color:#c98953}
#gdBook .opt{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;padding-top:8px;border-top:1px dashed rgba(138,78,36,.4);font:500 12px Mitr,sans-serif;color:#6a4026}
#mgrid button.gdNew::after{content:'';position:absolute;right:-3px;top:-3px;width:11px;height:11px;border-radius:50%;background:#ff4b3a;border:2px solid #fff}
`;
const st=document.createElement('style');st.id='gdCSS';st.textContent=CSS;document.head.appendChild(st);
const QEL=document.createElement('div');QEL.id='gdQ';document.body.appendChild(QEL);
QEL.addEventListener('pointerdown',e=>e.stopPropagation());
const TEL=document.createElement('div');TEL.id='gdT';document.body.appendChild(TEL);
function chat(h){const f=G('chatLog');if(f)f('sys',h);}
function msg(t){const f=G('msg');if(f)f(t);}
function toast(h,got){const d=document.createElement('div');d.className='it';d.innerHTML=`<b class="h">${h}</b>${got&&got.length?`<div class="g">${got.map(g=>`<span>${g.ic}${g.txt}</span>`).join('')}</div>`:''}`;
  TEL.innerHTML='';TEL.appendChild(d);setTimeout(()=>{d.style.transition='opacity .5s';d.style.opacity='0';},2600);setTimeout(()=>{if(d.parentNode)d.remove();},3200);}
function pulse(){QEL.classList.remove('min');}
const rewHtml=rew=>(rew||[]).map(([id,n])=>id==='z'?`<span class="ri"><b class="z">z</b>${fmt(n)}</span>`:id==='gift'?`<span class="ri">🎩 อุปกรณ์</span>`:id==='orb'?`<span class="ri">${icon(`orb_${MAINK}_1`,16)}หินออฟ ${SN[MAINK]}</span>`:id==='gsup'?`<span class="ri">🔹 เจมเสริม</span>`:`<span class="ri">${icon(id,16)}×${n}</span>`).join('');
let sig='';
function render(force){const q=cur(),on=S&&S.on&&MODE()&&!!q;QEL.classList.toggle('on',!!on);if(!on){sig='';return;}
  const L=lv(),lock=L<q.lv,[n,m]=lock?[0,q.max]:prog(q),done=S.st==='done';
  const k=[S.q,S.st,n,m,lock,lock?Math.floor((player.exp||0)*100):0,NAV.on,S.min,mob(),QEL.classList.contains('ex')].join('|');if(!force&&k===sig)return;sig=k;
  QEL.classList.toggle('done',done);QEL.classList.toggle('min',!!S.min);
  const how=mob()?(q.ph||q.pc||''):(q.pc||q.ph||'');
  QEL.innerHTML=`<div class="hd"><span>📜 ${CH[q.ch][0]} · ${S.q+1}/${Q.length}</span><button data-a="book" title="คู่มือ (J)">📖</button><button data-a="min" title="ย่อ / ขยาย">${S.min?'▾':'▴'}</button></div>
   <div class="tt">${q.t}</div><div class="ds">${q.d}</div>
   ${lock?`<div class="lk">🔒 ล่ามอนต่อจนถึง Lv ${q.lv} (ตอนนี้ Lv ${L} · EXP ${Math.floor((player.exp||0)*100)}%)</div>`:`<div class="gl">${done?'✔ สำเร็จ!':'▸ '+q.g}${m>1&&!done?` <b>${n}/${m}</b>`:''}</div><div class="pb"><i style="width:${(done?1:n/m)*100}%"></i></div>`}
   ${how&&!done?`<div class="hw">💡 ${how}</div>`:''}<div class="rw">รางวัล ${rewHtml(q.rew)}</div>
   <div class="bt"><button class="bk" data-a="book" title="คู่มือ">📖</button>${done?'<button class="cl" data-a="claim">🎁 รับรางวัล</button>':`${(q.nav||lock)?`<button class="nav${NAV.on?' on':''}" data-a="nav">${NAV.on?'■ หยุด':'🧭 นำทาง'}</button>`:''}${q.tut&&TUT[q.tut]?'<button data-a="tut">❓ สอน</button>':''}`}</div>`;
  QEL.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();const a=b.dataset.a;
    if(a==='claim')claim();else if(a==='nav'){if(NAV.on)navStop('🧭 หยุดนำทาง');else navStart(lv()<q.lv?'field':q.nav);}else if(a==='tut')runTut(q.tut);
    else if(a==='book')openBook();else if(a==='min'){S.min=!S.min;dirty=1;render(true);}});
  QEL.onclick=e=>{if(mob()&&e.target===QEL||e.target.classList.contains('tt')||e.target.classList.contains('ds')){QEL.classList.toggle('ex');render(true);
    clearTimeout(QEL._ex);if(QEL.classList.contains('ex'))QEL._ex=setTimeout(()=>{QEL.classList.remove('ex');render(true);},9000);}};}   /* phone: the long text folds back by itself */

/* ---------------- coach marks ---------------- */
const CEL=document.createElement('div');CEL.id='gdC';
CEL.innerHTML='<div class="hole"></div><div class="ring"></div><svg class="hand" viewBox="0 0 40 40"><path d="M14 38 Q8 30 9 24 L12 20 L13 6 Q13 3 16 3 Q19 3 19 6 L19 16 L21 15 Q24 14 25 16 L27 15 Q30 14 31 17 L32 17 Q35 17 35 20 L35 28 Q35 34 30 38 Z" fill="#fff6e0" stroke="#4a2a16" stroke-width="2.2" stroke-linejoin="round"/><path d="M19 16 L19 24 M25 16 L25 24 M31 17 L31 25" stroke="#4a2a16" stroke-width="1.6" stroke-linecap="round"/></svg><div class="tip"></div>';
document.body.appendChild(CEL);CEL.querySelector('.tip').addEventListener('pointerdown',e=>e.stopPropagation());
const CO={on:false,id:null,i:0,steps:[],raf:0,step0:0};
function runTut(id){const T=TUT[id];if(!T)return;S.seen[id]=1;dirty=1;Object.assign(CO,{on:true,id,i:-1,steps:T.s});CEL.classList.add('on');nextStep();}
function endTut(){CO.on=false;CEL.classList.remove('on');cancelAnimationFrame(CO.raf);}
function stepEl(s){let el=null;try{el=typeof s.el==='function'?s.el():s.el?$(s.el):null;}catch(e){el=null;}return el&&vis(el)?el:null;}
function nextStep(){CO.i++;
  while(CO.i<CO.steps.length){const s=CO.steps[CO.i];let ok=true;try{if(s.cond)ok=!!s.cond();}catch(e){ok=false;}if(ok)break;CO.i++;}
  if(CO.i>=CO.steps.length){endTut();return;}
  const s=CO.steps[CO.i];try{if(s.go)s.go();}catch(e){}CO.step0=performance.now();CO.done=false;
  setTimeout(()=>{if(CO.on)place(true);},s.go?260:30);}
function place(build){if(!CO.on)return;const s=CO.steps[CO.i];if(!s)return;const tip=CEL.querySelector('.tip'),hole=CEL.querySelector('.hole'),ring=CEL.querySelector('.ring'),hand=CEL.querySelector('.hand');
  const text=mob()?(s.ph||s.t||s.pc):(s.pc||s.t||s.ph);
  if(build){const T=TUT[CO.id],nn=CO.steps.filter(x=>{try{return !x.cond||x.cond();}catch(e){return false;}}).length,ii=CO.steps.slice(0,CO.i+1).filter(x=>{try{return !x.cond||x.cond();}catch(e){return false;}}).length;
    tip.innerHTML=`<div class="tt">📖 ${T.t}<small>${ii}/${nn}</small></div><div>${text}</div>${s.wait?'<div class="wt">👆 ทำตามที่ชี้ แล้วจะไปขั้นต่อไปเอง</div>':''}
      <div class="bt"><button class="sk" data-c="x">ปิดการสอน</button><button data-c="n">${CO.i>=CO.steps.length-1?'เข้าใจแล้ว ✔':s.wait?'ข้าม ▸':'ต่อไป ▸'}</button></div>`;
    tip.querySelectorAll('[data-c]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(b.dataset.c==='x')endTut();else nextStep();});}
  const el=stepEl(s),vw=innerWidth,vh=innerHeight;let r=null;
  if(el){const b=el.getBoundingClientRect(),p=6;r={x:Math.max(2,b.left-p),y:Math.max(2,b.top-p),w:Math.min(vw-4,b.width+p*2),h:Math.min(vh-4,b.height+p*2)};}
  if(r){Object.assign(hole.style,{display:'block',left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'});Object.assign(ring.style,{display:'block',left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'});
    hand.style.display='block';const hx=Math.min(vw-42,r.x+r.w*.55),hy=Math.min(vh-42,r.y+r.h*.55);hand.style.left=hx+'px';hand.style.top=hy+'px';}
  else{hole.style.display='none';ring.style.display='none';hand.style.display='none';}
  const tw=tip.offsetWidth||300,th=tip.offsetHeight||120;let tx,ty;
  if(!r){tx=(vw-tw)/2;ty=Math.max(10,vh*.62-th/2);hole.style.display='block';Object.assign(hole.style,{left:vw/2+'px',top:'-50px',width:'0px',height:'0px'});}
  else{const below=r.y+r.h+12,above=r.y-th-12;
    if(below+th<vh-8)ty=below;else if(above>8)ty=above;else ty=Math.max(8,Math.min(vh-th-8,r.y+r.h/2-th/2));
    tx=r.x+r.w/2-tw/2;if(ty!==below&&ty!==above){tx=r.x+r.w+14+tw<vw?r.x+r.w+14:r.x-tw-14;}
    tx=Math.max(8,Math.min(vw-tw-8,tx));}
  tip.style.left=tx+'px';tip.style.top=ty+'px';}
function coachTick(){if(!CO.on)return;const s=CO.steps[CO.i];if(!s)return;place(false);
  if(s.wait&&performance.now()-CO.step0>350){let ok=false;try{ok=!!s.wait();}catch(e){}if(ok&&!CO.done){CO.done=true;setTimeout(()=>{if(CO.on&&CO.steps[CO.i]===s)nextStep();},380);}}}

/* ---------------- the book ---------------- */
let bookTab='q';
function openBook(){bump('book');const a=A();if(!a||!a.ui)return;a.ui.ttWin('gdBook','📖 คู่มือนักผจญภัย');const w=$('#gdBook');w.classList.add('open');document.querySelectorAll('.ro').forEach(o=>o.style.zIndex=30);w.style.zIndex=59;buildBook();
  const b=$(mg('mgguide'));if(b)b.classList.remove('gdNew');}
function buildBook(){const w=$('#gdBook');if(!w||!w.classList.contains('open'))return;const bd=w.querySelector('.ttbd');const L=lv();
  let h=`<div class="gtabs"><button data-bt="q" class="${bookTab==='q'?'on':''}">📜 เส้นทางนักผจญภัย</button><button data-bt="s" class="${bookTab==='s'?'on':''}">📚 สอนระบบต่าง ๆ</button></div>`;
  if(bookTab==='q'){let last=-1;Q.forEach((q,i)=>{if(q.ch!==last){last=q.ch;h+=`<div class="chh">บทที่ ${q.ch+1} · ${CH[q.ch][0]} <small>(${CH[q.ch][1]})</small></div>`;}
      const dn=!!S.done[q.id],isCur=i===S.q,lk=!dn&&!isCur&&i>S.q;
      h+=`<div class="qr${isCur?' cur':''}${lk?' lock':''}"><span class="m">${dn?(S.done[q.id]==='skip'?'⏭':'✔'):isCur?(S.st==='done'?'🎁':'▶'):'🔒'}</span><div><b>${q.t}</b>${q.lv>1?` <small>Lv ${q.lv}+</small>`:''}<br>${lk?'':q.d+'<br>'}<span style="color:#9e3a2f">▸ ${q.g}</span></div></div>`;});
    if(S.q>=Q.length)h+='<div class="qr cur"><span class="m">🎉</span><div><b>จบเส้นทางนักผจญภัยแล้ว</b><br>ระบบอื่น ๆ ดูได้ในแท็บ สอนระบบต่าง ๆ</div></div>';}
  else{h+=`<div class="sg">${SYS.map(([ic,n,d,op,tu],i)=>`<div class="sc"><div class="n"><i>${ic}</i>${n}</div><div>${d}</div><div class="bb">${tu&&TUT[tu]?`<button data-tu="${tu}">▶ สอนวิธีใช้</button>`:''}${op?`<button class="o" data-op="${i}">เปิด</button>`:''}</div></div>`).join('')}</div>`;}
  h+=`<div class="opt"><label><input type="checkbox" id="gdOn" ${S.on?'checked':''}> แสดงการ์ดเควสต์นำทาง</label>${MODE()==='test'?'<button id="gdRe">↺ เริ่มเส้นทางใหม่ (ทดสอบ)</button>':''}<span style="margin-left:auto">เปิดคู่มือ: J หรือ 📖</span></div>`;
  bd.innerHTML=h;
  bd.querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>{bookTab=b.dataset.bt;buildBook();});
  bd.querySelectorAll('[data-tu]').forEach(b=>b.onclick=()=>{w.classList.remove('open');setTimeout(()=>runTut(b.dataset.tu),120);});
  bd.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>{const f=SYS[+b.dataset.op][3];w.classList.remove('open');try{f&&f();}catch(e){}});
  const on=bd.querySelector('#gdOn');if(on)on.onchange=()=>{S.on=on.checked;if(S.on&&S.st==='new')begin();dirty=1;render(true);};
  const re=bd.querySelector('#gdRe');if(re)re.onclick=()=>{const keepOn=S.on;S=fresh();S.on=keepOn;begin();save();render(true);buildBook();};}
/* menu button 📖 (J) */
function addMenu(){const g=$('#mgrid');if(!g||$(mg('mgguide')))return;const b=document.createElement('button');b.dataset.m='mgguide';b.title='คู่มือนักผจญภัย (J)';
  b.innerHTML='<span class="kb">J</span><svg viewBox="0 0 40 40"><path d="M6 8 Q13 5 20 9 Q27 5 34 8 V33 Q27 30 20 34 Q13 30 6 33 Z" fill="#fff1c9" stroke="#3a2a1f" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 9 V34" stroke="#3a2a1f" stroke-width="2.2"/><path d="M10 14 H16 M10 19 H16 M24 14 H30 M24 19 H30" stroke="#c48a2e" stroke-width="2" stroke-linecap="round"/><circle cx="31" cy="30" r="6" fill="#ffd36a" stroke="#3a2a1f" stroke-width="2"/><path d="M31 27 V31 M31 33 V33.2" stroke="#3a2a1f" stroke-width="2" stroke-linecap="round"/></svg>';
  b.onclick=e=>{e.stopPropagation();const w=$('#gdBook');if(w&&w.classList.contains('open'))w.classList.remove('open');else openBook();};g.appendChild(b);
  if(!S.seen.book)b.classList.add('gdNew');}
addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA/.test(e.target.tagName))return;
  if(e.key==='j'||e.key==='J'||e.code==='KeyJ'){const w=$('#gdBook');if(w&&w.classList.contains('open'))w.classList.remove('open');else openBook();}
  else if(e.key==='Escape'&&CO.on)endTut();});

/* ================================================================
   9. START + loop
   ================================================================ */
let started=false;
function blocked(){return [...document.querySelectorAll('#ccov,#rollwin,#deathov,#boot')].some(vis);}
function firstSkillLv(){const R=G('SKREQ')||{},SK=G('SKILLS')||{},B=G('BASIC_KEY');let m=99;for(const k in R){const s=SK[k];if(!s||k===B||s.passive||s.br==='C'||!R[k][0])continue;m=Math.min(m,R[k][0].lv||1);}const SPM=G('SP_MAX');let sp=2;if(SPM)for(sp=1;sp<60&&SPM(sp)<1;sp++);return Math.max(m<99?m:5,sp);}   /* skill points start at Lv 2 (SP_MAX) */
function start(){if(started||!MODE())return;started=true;{const m=firstSkillLv();for(const q of Q)if(q.id==='skill'||q.id==='cast')q.lv=m;}const isNew=load();
  if(isNew&&MODE()==='play'){if(lv()>=5)fastForward();begin();save();}
  else if(S.st==='new')begin();
  hooks();addMenu();render(true);}
let acc=0;
function loop(){requestAnimationFrame(loop);if(!started){if(MODE()&&window.__bootDone!==0)start();return;}
  coachTick();
  const t=performance.now();if(t-acc<250)return;acc=t;
  poll();check();navTick();render(false);
  if(dirty&&t-(loop.sv||0)>1500){loop.sv=t;dirty=0;save();}
  /* first steps of a brand-new hero: open the tutorial of quest 1 / 2 once nothing else is on screen */
  const q=cur();if(S.on&&q&&q.auto&&!CO.on&&!S.seen['q_'+q.id]&&S.st==='run'&&lv()>=q.lv&&!blocked()&&![...document.querySelectorAll('.ro.open,.ttw.open,#skw.open,#totemWin')].some(vis)&&t>6000){
    if(!loop.idle)loop.idle=t;else if(t-loop.idle>1800){S.seen['q_'+q.id]=1;dirty=1;loop.idle=0;runTut(q.tut);}}else loop.idle=0;}
requestAnimationFrame(loop);
addEventListener('beforeunload',()=>{if(S)save();});
window.GUIDE={get S(){return S;},Q,TUT,SYS,runTut,endTut,openBook,claim,navStart,navStop,get nav(){return NAV;},
  jump(i){S.q=i;S.st='new';begin();render(true);},render,save,get started(){return started;},start};
})();
