/* =====================================================================
   RUNE DATA — Totem Roots + Ring of Totem Shards (owner 2026-11-23: '1ทำ · 2ได้ ต้องหาของมาปลด ฟาร์มหรือซื้อจากตลาดกลาง ·
   3แบบแนะนำ · 4แนะนำ · 5ทำไรก่อนก็ได้ให้เสร็จ'). Shared tables, loaded BEFORE items.js (goods, icons, drops, market) and read by
   totem_roots.js (roots goods, shaman) and totem_ring.js (spirit runes, carved runes, ring layout). RUNE_SYSTEM_TH.md = rules.
   • Spirit runes (big sockets): 6 animals × 3 = 18 kinds, grades B / A / S (numbers ×0.6 / ×0.8 / ×1). Each wants 3 colours on its
     3 linked small sockets; matched lines 1 / 2 / 3 = tier I / II / III (×0.5 / ×0.75 / ×1). Values are flat or counters (rule 2):
     damage is absolute by hero level (like the seals' sealDmg), never ×ATK.
   • Carved runes (small sockets): 3 colours × 6 = 18 kinds, RO-style values (owner 2026-11-22: runes may use %). The LEVEL (1–10)
     belongs to the small socket: swap runes freely, the level stays.
   ===================================================================== */
(function(){
const C3={r:{th:'แดง',en:'red',c:'#ff6a4a',d:'#8a1e10',fam:'โจมตี'},b:{th:'ฟ้า',en:'blue',c:'#5aa8ff',d:'#123a7a',fam:'ป้องกัน'},
          g:{th:'ทอง',en:'gold',c:'#ffcf3a',d:'#7a5208',fam:'วิญญาณ / เสริม'},'*':{th:'สีใดก็ได้',en:'any',c:'#d8d0c0',d:'#5a5040',fam:''}};
const GRADE=[{k:'B',th:'B',m:.6,c:'#6fd06a',rim:'#2f7a2a'},{k:'A',th:'A',m:.8,c:'#5fb0ff',rim:'#1f5aa8'},{k:'S',th:'S',m:1,c:'#ffcf3a',rim:'#a8700a'}];
const TIERM=[0,.5,.75,1],TIERN=['—','I','II','III'];
const ANIMAL={bear:{th:'หมี',en:'Bear',c:'#a8683a',note:'ทน'},owl:{th:'นกฮูก',en:'Owl',c:'#8a7ac8',note:'คุมเกม'},wolf:{th:'หมาป่า',en:'Wolf',c:'#7a92b8',note:'ตีหมู่ ฝูง'},
  eagle:{th:'อินทรี',en:'Eagle',c:'#d8a040',note:'แม่น ระยะไกล'},tbird:{th:'นกสายฟ้า',en:'Thunderbird',c:'#4a7ae8',note:'ระเบิดพลัง'},orca:{th:'วาฬเพชฌฆาต',en:'Orca',c:'#3a4a6a',note:'ไหลเวียน'}};
/* v(lv, m) = the rune's numbers at hero level lv, total multiplier m (grade × tier); n = counter for count-scaled runes */
const r1=x=>Math.max(1,Math.round(x)),r01=x=>Math.round(x*10)/10;
const SR=[
  {k:'bearHide',a:'bear',th:'หนังหมีภูเขา',en:'Mountain Hide',req:'bb*',v:(L,m)=>({sh:r1(L*3*m)}),d:v=>`โดนตีครบ 6 ครั้ง → โล่ ${v.sh} (6 วิ)`},
  {k:'bearStand',a:'bear',th:'ยืนหยัด',en:'Bear Stand',req:'bbr',v:(L,m)=>({cut:r1(L*.3*m)}),d:v=>`ระหว่างทำท่าสกิล รับดาเมจ −${v.cut} ต่อครั้ง`},
  {k:'bearSleep',a:'bear',th:'หมีจำศีล',en:'Hibernation',req:'bgb',v:(L,m)=>({hp:r1(L*20),heal:r1(L*8*m),sh:r1(L*4*m)}),d:v=>`HP ต่ำกว่า ${v.hp} → ฟื้น ${v.heal} + โล่ ${v.sh} (ทุก 90 วิ)`},
  {k:'owlNight',a:'owl',th:'ตาราตรี',en:'Night Eye',req:'ggr',v:(L,m)=>({cut:r1(L*.3*m)}),d:v=>`ใช้สกิลครั้งที่ 4 ทุกครั้ง → ฮิตถัดไปไม่สน DEF / MDEF ${v.cut}`},
  {k:'owlWing',a:'owl',th:'ปีกเงียบ',en:'Silent Wing',req:'ggb',v:(L,m)=>({s:r01(.4*m)}),d:v=>`สถานะมึน / ช้า ที่เราใส่ นานขึ้น ${v.s} วิ`},
  {k:'owlMoon',a:'owl',th:'ปัญญาจันทร์',en:'Moon Wisdom',req:'g*g',v:(L,m)=>({s:r01(2*m)}),d:v=>`ใช้สกิลบัฟครบ 3 ครั้ง → สกิลถัดไปคูลดาวน์ −${v.s} วิ`},
  {k:'wolfPack',a:'wolf',th:'สัญชาตญาณฝูง',en:'Pack Instinct',req:'rrg',v:(L,m)=>({atk:r1(L*.04*m)}),d:v=>`สกิลเดียวโดน 3 ตัวขึ้นไป → ATK / MATK +${v.atk} 5 วิ (ซ้อน 3)`},
  {k:'wolfHowl',a:'wolf',th:'หอนเรียกฝูง',en:'Howl of the Pack',req:'rr*',v:(L,m)=>({bite:r1(L*.6*m)}),d:v=>`ฆ่าครบ 8 ตัว → หมาป่าวิญญาณ 2 ตัวกัดศัตรูใกล้ๆ 6 วิ (ครั้งละ ${v.bite})`},
  {k:'wolfHunt',a:'wolf',th:'ไล่ล่า',en:'The Hunt',req:'rbr',v:(L,m)=>({add:r1(L*.15*m)}),d:v=>`ศัตรูที่ติดสถานะ โดนสกิลแรงขึ้น ${v.add} ต่อฮิต`},
  {k:'eagleEye',a:'eagle',th:'ตาเหยี่ยว',en:'Hawk Eye',req:'rgg',v:(L,m)=>({crit:r1(L*.06*m)}),d:v=>`ตีเป้าที่อยู่ไกลเกิน 220 → CRIT +${v.crit}`},
  {k:'eagleSwoop',a:'eagle',th:'โฉบเหยื่อ',en:'Swoop',req:'rgr',v:(L,m)=>({add:r1(L*1.5*m)}),d:v=>`เดินต่อเนื่อง 2 วิ → ฮิตแรกของสกิลถัดไปแรงขึ้น ${v.add}`},
  {k:'eagleFeather',a:'eagle',th:'ขนนกลม',en:'Wind Feather',req:'gbg',v:(L,m,g,t)=>({n:5+(2-g)+(3-t)}),d:v=>`โดนตีครั้งที่ ${v.n} ทุกครั้ง หลบได้`},
  {k:'tbWing',a:'tbird',th:'ปีกนกสายฟ้า',en:'Thunder Wing',req:'rrg',v:(L,m)=>({dmg:r1(L*2.5*m)}),d:v=>`ใช้สกิลครบ 6 ครั้ง → ฟ้าผ่าเป้าล่าสุด ${v.dmg} (ไม่สน DEF)`},
  {k:'tbRoar',a:'tbird',th:'ฟ้าคำราม',en:'Thunder Roar',req:'grg',v:(L,m)=>({dmg:r1(L*1.5*m)}),d:v=>`ใช้อัลติเมต → ฟ้าผ่ารอบตัว 4 ครั้ง ครั้งละ ${v.dmg}`},
  {k:'tbCharge',a:'tbird',th:'ประจุฟ้า',en:'Storm Charge',req:'r*g',v:(L,m)=>({add:r1(L*.25*m)}),d:v=>`ฆ่าศัตรู → 4 ฮิตแรกของสกิลถัดไปแรงขึ้น ${v.add} ต่อฮิต (ซ้อน 3)`},
  {k:'orcaFlow',a:'orca',th:'กระแสคืน',en:'Return Current',req:'gb*',v:(L,m)=>({sp:r1(L*.5*m)}),d:v=>`ใช้สกิลครบ 5 ครั้ง → คืน SP ${v.sp}`},
  {k:'orcaDive',a:'orca',th:'ดำดิ่ง',en:'Deep Dive',req:'b*g',v:(L,m)=>({hp:r1(L*1.5*m)}),d:v=>`สกิลพุ่ง / ขยับตัว → ฟื้น HP ${v.hp}`},
  {k:'orcaWave',a:'orca',th:'คลื่นนำ',en:'Leading Wave',req:'gbg',v:(L,m,g,t)=>({s:6+2*(2-g)+(3-t)}),d:v=>`ไม่ได้สู้ ${v.s} วิ → สกิลแรกไม่ติดคูลดาวน์`}];
const SRK={};for(const r of SR)SRK[r.k]=r;
/* carved runes: value at socket level L 1–10 */
const CL=L=>Math.max(1,Math.min(10,L)),STV=L=>[1,1,1,1,1,2,2,2,2,2][CL(L)-1],AKV=L=>Math.max(1,Math.round(.6*CL(L)));
const CR=[
  {k:'c_str',c:'r',s:'str',th:'STR',v:STV},{k:'c_dex',c:'r',s:'dex',th:'DEX',v:STV},{k:'c_atk',c:'r',s:'atk',th:'ATK',v:AKV},
  {k:'c_matk',c:'r',s:'matk',th:'MATK',v:AKV},{k:'c_hit',c:'r',s:'hit',th:'HIT',v:L=>[1,1,1,2,2,2,2,3,3,3][CL(L)-1]},{k:'c_crit',c:'r',s:'crit',th:'CRIT',v:STV},
  {k:'c_vit',c:'b',s:'vit',th:'VIT',v:STV},{k:'c_agi',c:'b',s:'agi',th:'AGI',v:STV},{k:'c_def',c:'b',s:'def',th:'DEF',v:AKV},
  {k:'c_mdef',c:'b',s:'mdef',th:'MDEF',v:AKV},{k:'c_flee',c:'b',s:'flee',th:'FLEE',v:AKV},{k:'c_dred',c:'b',s:'dmgRed',th:'รับดาเมจ −',v:L=>r01(.2*L),pc:1},
  {k:'c_int',c:'g',s:'int',th:'INT',v:STV},{k:'c_luk',c:'g',s:'luk',th:'LUK',v:STV},{k:'c_aspd',c:'g',s:'aspd',th:'ASPD',v:L=>r01(.1*L),pc:1},
  {k:'c_cast',c:'g',s:'cast',th:'ร่ายเร็ว',v:L=>r01(.3*L),pc:1},{k:'c_cdr',c:'g',s:'cdr',th:'คูลดาวน์ −',v:L=>r01(.1*L),pc:1},{k:'c_spc',c:'g',s:'spCost',th:'ใช้ SP −',v:L=>r01(.2*L),pc:1}];
const CRK={};for(const r of CR)CRK[r.k]=r;
const crTxt=(r,L)=>{const v=r.v(L);return r.pc?`${r.th}${/−$/.test(r.th)?'':' +'}${v}%`:`${r.th} +${v}`;};
/* ring: 6 big + 12 small sockets round the totem stump. Big i links E(i-1), E(i), I(i). Opened in pairs by level. */
const RING={big:6,sameMax:3,   /* one carved-rune kind works in at most 3 small sockets */
  open:[30,30,40,40,50,50],links:i=>['e'+((i+5)%6),'e'+i,'i'+i],
  smallOpen:id=>{const t=id[0],i=+id.slice(1);return t==='i'?RING.open[i]:Math.min(RING.open[i],RING.open[(i+1)%6]);}};
/* costs (zeny sinks; goods are farmed or bought in the central market) */
const COST={read:{feather:1},smelt:{n:5,z:[2000,6000,15000],up:.1,dustPick:10},slot:{z:L=>1500*L,runes:L=>L},
  shop:{rfeather:3000,rdew:50000},
  /* shaman exchange of boss parts → root skill gems (DROP_TABLE_TH.md §6) */
  ex:{1:{parts:[['map',6]],z:20000},2:{parts:[['map',15]],alt:[['mvp',5]],z:40000},3:{parts:[['mvp',10]],z:70000},4:{parts:[['mvp',8],['main',4]],z:100000}}};
/* drops: normal monsters (game level ≥ minLv), dungeons ×dun; bosses by tier */
const DROPS={minLv:28,sap:.25,medal:.004,stone:[.006,.0015,.0003],bag:.012,dun:2,
  boss:{map:{medal:[1,2],rg:[[1,.15]],stone:[[0,1]],bag:2},mvp:{medal:[3,3],rg:[[2,.15],[3,.10]],stone:[[0,1],[1,1]],bag:3},main:{medal:[5,5],rg:[[3,.2],[4,.15]],stone:[[1,1],[2,1]],bag:4}}};

/* ---------- code art (placeholders until painted icons: RUNE_ART_PROMPTS_TH.md) — friendly cartoon, thick dark-brown outlines ---------- */
const O='#3a1f14';
const ART={
  bear:`<path d="M14 20 a7 7 0 1 1 9-9 M50 20 a7 7 0 1 0-9-9" fill="#8a5530" stroke="${O}" stroke-width="3"/><circle cx="17" cy="15" r="3.5" fill="#d9a070"/><circle cx="47" cy="15" r="3.5" fill="#d9a070"/><ellipse cx="32" cy="34" rx="21" ry="19" fill="#a8683a" stroke="${O}" stroke-width="3.2"/><ellipse cx="32" cy="42" rx="11" ry="8" fill="#e8c49a" stroke="${O}" stroke-width="2.4"/><ellipse cx="32" cy="38.5" rx="4.2" ry="3" fill="${O}"/><path d="M32 41.5 v4 M28 47 q4 3 8 0" stroke="${O}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="24" cy="29" r="2.8" fill="${O}"/><circle cx="40" cy="29" r="2.8" fill="${O}"/><circle cx="25" cy="28" r=".9" fill="#fff"/><circle cx="41" cy="28" r=".9" fill="#fff"/>`,
  owl:`<path d="M15 14 L22 22 M49 14 L42 22" stroke="${O}" stroke-width="3" stroke-linecap="round"/><path d="M12 26 Q12 10 22 16 Q32 10 42 16 Q52 10 52 26 Q54 52 32 55 Q10 52 12 26Z" fill="#8a7ac8" stroke="${O}" stroke-width="3.2"/><path d="M18 44 Q32 56 46 44 Q40 52 32 52 Q24 52 18 44Z" fill="#c8b8f0" opacity=".8"/><circle cx="23" cy="29" r="8.5" fill="#fff3c8" stroke="${O}" stroke-width="2.6"/><circle cx="41" cy="29" r="8.5" fill="#fff3c8" stroke="${O}" stroke-width="2.6"/><circle cx="23" cy="30" r="4" fill="${O}"/><circle cx="41" cy="30" r="4" fill="${O}"/><circle cx="24.3" cy="28.6" r="1.3" fill="#fff"/><circle cx="42.3" cy="28.6" r="1.3" fill="#fff"/><path d="M29 36 L35 36 L32 42Z" fill="#ffb84a" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>`,
  wolf:`<path d="M13 30 L15 7 L27 19 Z M51 30 L49 7 L37 19Z" fill="#7a92b8" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M17 23 L18 13 L24 19Z M47 23 L46 13 L40 19Z" fill="#d8e2f0"/><path d="M12 28 Q14 16 32 16 Q50 16 52 28 Q53 42 44 48 L32 57 L20 48 Q11 42 12 28Z" fill="#8aa2c8" stroke="${O}" stroke-width="3.2" stroke-linejoin="round"/><path d="M24 40 Q32 34 40 40 L36 52 L32 56 L28 52Z" fill="#eef2f8" stroke="${O}" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="32" cy="47" rx="3.6" ry="2.6" fill="${O}"/><path d="M20 30 L28 32 M44 30 L36 32" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/><circle cx="24.5" cy="32" r="2.2" fill="#ffd36a" stroke="${O}" stroke-width="1.4"/><circle cx="39.5" cy="32" r="2.2" fill="#ffd36a" stroke="${O}" stroke-width="1.4"/>`,
  eagle:`<path d="M8 50 Q10 30 24 20 Q34 12 44 16 Q54 20 54 30 L58 34 Q52 34 50 38 Q46 46 36 48 Q26 50 22 58 Z" fill="#7a4a22" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M24 20 Q34 12 44 16 Q54 20 54 30 L58 34 Q52 34 50 38 Q44 44 34 42 Q26 40 24 32Z" fill="#f6f0e2" stroke="${O}" stroke-width="2.8" stroke-linejoin="round"/><path d="M50 26 Q60 26 60 34 Q58 40 52 38 Q55 33 50 31Z" fill="#ffc23a" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="43" cy="26" r="3.2" fill="#ffd36a" stroke="${O}" stroke-width="1.6"/><circle cx="43.5" cy="26" r="1.5" fill="${O}"/><path d="M36 22 Q42 19 48 22" stroke="${O}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  tbird:`<path d="M32 22 L4 14 Q8 24 6 30 Q14 28 18 34 Q22 30 26 34 L32 40 L38 34 Q42 30 46 34 Q50 28 58 30 Q56 24 60 14 Z" fill="#3a6ad8" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M10 18 L26 24 M54 18 L38 24" stroke="#9fd0ff" stroke-width="2.2" stroke-linecap="round"/><path d="M26 16 Q32 6 38 16 L38 30 Q32 36 26 30Z" fill="#4a7ae8" stroke="${O}" stroke-width="2.8"/><path d="M30 18 L34 18 L32 22Z" fill="#ffc23a" stroke="${O}" stroke-width="1.4"/><circle cx="29" cy="15" r="1.6" fill="#fff"/><circle cx="35" cy="15" r="1.6" fill="#fff"/><path d="M33 36 L27 47 L32 47 L28 58 L39 44 L34 44 L38 36Z" fill="#ffd23a" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`,
  orca:`<path d="M6 38 Q10 22 30 20 Q48 18 56 30 Q60 36 56 42 Q50 48 36 48 Q20 50 10 46 Z" fill="#26324a" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M30 20 L34 6 Q40 14 40 22Z" fill="#26324a" stroke="${O}" stroke-width="2.8" stroke-linejoin="round"/><path d="M12 44 Q26 50 44 44 Q52 42 56 38 Q52 46 40 48 Q24 50 12 44Z" fill="#f4f8ff"/><ellipse cx="44" cy="32" rx="5" ry="2.8" fill="#f4f8ff" transform="rotate(-12 44 32)"/><circle cx="50" cy="34" r="1.6" fill="${O}"/><path d="M8 40 Q2 34 4 28 Q8 34 12 36 M8 40 Q2 44 3 50 Q8 46 12 44" fill="#26324a" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`};
/* painted art (RUNE_ART_PROMPTS_TH.md): put a key here once its picture is cut — assets/rune/icons/<key>.png (sr_<kind> = one picture per
   spirit-rune kind, the grade ring + letter stay code; c_<stat> = the whole carved gem) · assets/rune/spirit/<animal>.webp for the effects */
const ICON_HAVE=new Set([]),SPIRIT_HAVE=new Set([]);
const iconPath=k=>`assets/rune/icons/${k}.png`;
/* round rune stone with the animal on it, rim = grade colour (painted medallion inside the ring when it exists) */
const srIcon=(a,g,k)=>{const G=GRADE[g]||GRADE[0];if(k&&ICON_HAVE.has('sr_'+k))return `<svg viewBox="0 0 64 64"><circle cx="32" cy="33" r="29.5" fill="${O}"/><circle cx="32" cy="32" r="28.5" fill="${G.c}"/><circle cx="32" cy="32" r="25" fill="${G.rim}"/><clipPath id="srClip"><circle cx="32" cy="32" r="24.6"/></clipPath><image href="${iconPath('sr_'+k)}" x="7.2" y="7.2" width="49.6" height="49.6" clip-path="url(#srClip)"/><text x="52" y="58" text-anchor="middle" font-family="Mali,Sarabun,sans-serif" font-size="13" font-weight="900" fill="${G.rim}" stroke="#fff" stroke-width="2.6" paint-order="stroke">${G.k}</text></svg>`;
  return `<svg viewBox="0 0 64 64"><circle cx="32" cy="33" r="29" fill="${O}"/><circle cx="32" cy="32" r="28" fill="${G.c}"/><circle cx="32" cy="32" r="23.5" fill="#6e6658" stroke="${G.rim}" stroke-width="2"/><circle cx="27" cy="26" r="14" fill="#8e8676" opacity=".7"/><g transform="translate(13.5 13.5) scale(.58)">${ART[a]||''}</g><path d="M14 18 A22 22 0 0 1 30 9" stroke="#fff" stroke-width="2.5" opacity=".55" fill="none" stroke-linecap="round"/><text x="52" y="58" text-anchor="middle" font-family="Mali,Sarabun,sans-serif" font-size="13" font-weight="900" fill="${G.rim}" stroke="#fff" stroke-width="2.6" paint-order="stroke">${G.k}</text></svg>`;};
/* carved rune: small faceted stone in its colour with the stat code */
const crIcon=k=>{if(ICON_HAVE.has(k))return `<svg viewBox="0 0 64 64"><image href="${iconPath(k)}" x="0" y="0" width="64" height="64"/></svg>`;const r=CRK[k]||CR[0],C=C3[r.c],t=r.th.replace(/ [+−]$|−$/,'').slice(0,4);return `<svg viewBox="0 0 64 64"><path d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18Z" fill="${C.d}" stroke="${O}" stroke-width="3.2" stroke-linejoin="round"/><path d="M32 10 L51 21 L51 43 L32 54 L13 43 L13 21Z" fill="${C.c}"/><path d="M32 10 L51 21 L32 30 L13 21Z" fill="#fff" opacity=".28"/><text x="32" y="${t.length>3?40:42}" text-anchor="middle" font-family="Mali,Sarabun,sans-serif" font-size="${t.length>3?12:15}" font-weight="900" fill="#fff" stroke="${O}" stroke-width="3" paint-order="stroke">${t}</text></svg>`;};
/* goods (bag items). kind 'srune' / 'crune' live in the ring's pouch view (not counted against the bag's 60 kinds) */
const GOODS={};
const svg24=s=>s;   // inner SVG in a 24×24 box (items.js etcIcon wraps it)
GOODS.rsap={n:'Spirit Sap',th:'ยางวิญญาณ',price:300,kind:'rsap',col:'#ffb43a',d:'ยางจากรากโทเท็ม · จุดโหนดรากโทเท็ม (U) · ดรอปจากมอนตั้งแต่ Lv 28 (ราว 1 ใน 4 ตัว)',
  svg:svg24(`<path d="M12 3 C16 9 19 12 19 16 A7 7 0 0 1 5 16 C5 12 8 9 12 3Z" fill="#ffb43a" stroke="${O}" stroke-width="1.6"/><path d="M9 15 Q10 11 12 9" stroke="#fff3d0" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M12 22 v-3" stroke="#6a3a1a" stroke-width="2"/>`)};
GOODS.rmedal={n:'Golden Totem Medal',th:'เหรียญโทเท็มทอง',price:20000,kind:'rmedal',col:'#ffcf3a',d:'จุดโหนดใหญ่ / โบนัสสาย / สกิล C ในรากโทเท็ม · มอนตั้งแต่ Lv 28 ดรอปน้อยมาก (มอนถึก ดันเจี้ยน บ่อยกว่า) · บอสดรอปแน่นอน',
  svg:svg24(`<circle cx="12" cy="12" r="9.5" fill="#ffcf3a" stroke="${O}" stroke-width="1.6"/><circle cx="12" cy="12" r="7" fill="none" stroke="#a8700a" stroke-width="1"/><path d="M9 8 h6 v3 h-2 v6 h-2 v-6 h-2Z" fill="#a8700a"/><circle cx="10.4" cy="9.4" r=".8" fill="#fff6d0"/><circle cx="13.6" cy="9.4" r=".8" fill="#fff6d0"/>`)};
[1,2,3,4].forEach(t=>{const col=['#d8a868','#5ac89a','#5a8cff','#ffcf5a'][t-1];   /* amber-tan · jade · sapphire · gold (painted sheet ง) */GOODS['rg'+t]={n:`Root Skill Gem T${t}`,th:`เจมสกิลราก ขั้น ${t}`,price:[30000,60000,100000,160000][t-1],kind:'rgem',tier:t,col,
  d:`จุดสกิล C ขั้น ${t} ในรากโทเท็ม (ใช้ 1 เม็ด) · บอสดรอป หรือเอาชิ้นส่วนบอสไปแลกที่หมอผีราก (U → 🧙)`,
  svg:svg24(`<path d="M12 2 L20 8 L17 20 H7 L4 8Z" fill="${col}" stroke="${O}" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6 Q10 11 12 14 Q14 17 11 21 M12 14 Q15 13 16 10" stroke="#5a3218" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M7 8 L12 2 L17 8Z" fill="#fff" opacity=".3"/><text x="18.5" y="22.5" font-size="7" font-weight="900" fill="${O}" stroke="#fff" stroke-width="1.6" paint-order="stroke" text-anchor="middle">${t}</text>`)};});
GOODS.rdew={n:'Root Dew',th:'น้ำค้างราก',price:50000,kind:'rtool',col:'#9fe8ff',d:'รีเซ็ตรากโทเท็มทั้งต้น คืนแต้มและของที่จ่ายไปครบ (ครั้งแรกฟรี) · ขายที่หมอผีราก (U → 🧙)',
  svg:svg24(`<path d="M9 3 h6 v4 l3 5 v7 q0 2-2 2 H8 q-2 0-2-2 v-7 l3-5Z" fill="#9fe8ff" stroke="${O}" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 11 C14 14 15 15 15 16.5 A3 3 0 0 1 9 16.5 C9 15 10 14 12 11Z" fill="#2a8ad8"/><rect x="8.5" y="2" width="7" height="2.5" rx="1" fill="#8a5a2a"/>`)};
['B','A','S'].forEach((k,g)=>{const G=GRADE[g];GOODS['rstone'+g]={n:`Raw Rune Stone ${k}`,th:`หินรูนดิบ ${k}`,price:[5000,20000,80000][g],kind:'rstone',grade:g,col:G.c,
  d:`อ่านด้วยขนนกหมอผี 1 อัน = รูนวิญญาณเกรด ${k} สุ่ม 1 ใน 18 แบบ (Y → อ่านรูน) · มอนตั้งแต่ Lv 28 ดรอปน้อย ดันเจี้ยนบ่อยกว่า บอสดรอปแน่นอน`,
  svg:svg24(`<path d="M4 15 L7 6 L13 3 L19 6 L21 14 L15 21 L8 20Z" fill="#6e6658" stroke="${O}" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 13 L11 9 L14 12 L17 8" stroke="${G.c}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="14" cy="12" r="1.6" fill="${G.c}"/><text x="18.5" y="22.5" font-size="7" font-weight="900" fill="${G.rim}" stroke="#fff" stroke-width="1.6" paint-order="stroke" text-anchor="middle">${k}</text>`)};});
GOODS.rfeather={n:'Shaman Feather',th:'ขนนกหมอผี',price:3000,kind:'rtool',col:'#ff9a5a',d:'อ่านหินรูนดิบ 1 ก้อน = รูนวิญญาณ 1 อัน · ขายที่หมอผีราก (U → 🧙 หรือ Y → อ่านรูน)',
  svg:svg24(`<path d="M5 21 Q8 12 17 4 Q21 8 17 13 Q13 18 5 21Z" fill="#ff9a5a" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 21 L15 8" stroke="${O}" stroke-width="1.3"/><path d="M10 15 L8 12 M13 11.5 L11.5 8.5 M12 14 L15 15" stroke="#fff3c8" stroke-width="1.1"/>`)};
GOODS.rbag={n:'Carved Rune Pouch',th:'ถุงรูนสลัก',price:4000,kind:'rbag',col:'#c8945a',d:'เปิด = รูนสลัก 1 อัน สุ่ม 1 ใน 18 แบบ (Y → อัปช่อง หรือดับเบิลคลิกในกระเป๋ารูน) · มอนตั้งแต่ Lv 28 ดรอป บอสดรอปหลายถุง',
  svg:svg24(`<path d="M7 8 Q4 14 5 18 Q6 21 12 21 Q18 21 19 18 Q20 14 17 8Z" fill="#c8945a" stroke="${O}" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 8 Q12 5 17 8 M9 5 L12 7 L15 5" stroke="${O}" stroke-width="1.5" fill="none"/><path d="M12 11 L14.5 13.5 L12 17 L9.5 13.5Z" fill="#ffcf3a" stroke="${O}" stroke-width="1"/>`)};
GOODS.sdust={n:'Spirit Dust',th:'ผงวิญญาณ',price:3000,kind:'sdust',col:'#e6eaff',d:'ได้จากการหลอมรูนวิญญาณ · ครบ 10 กำมือ = หลอมแบบเลือกชนิดรูนเองได้ (Y → หลอมรูน)',
  svg:svg24(`<ellipse cx="12" cy="17" rx="8" ry="4" fill="#9aa0b8" stroke="${O}" stroke-width="1.5"/><path d="M5 16 Q12 7 19 16" fill="#eef0ff" stroke="${O}" stroke-width="1.5"/><path d="M9 9 l1 -2 M14 7 l.6 -2.4 M16.5 10 l2 -1.2" stroke="#ffd24a" stroke-width="1.4" stroke-linecap="round"/>`)};
for(const r of SR)GRADE.forEach((G,g)=>{const A=ANIMAL[r.a];GOODS[`sr_${r.k}_${g}`]={n:`${r.en} Rune ${G.k}`,th:`รูนวิญญาณ${A.th} · ${r.th} ${G.k}`,price:[8000,30000,120000][g],kind:'srune',sr:r.k,grade:g,col:G.c,
  d:`ช่องใหญ่ของวงเศษโทเท็ม (Y) · ${r.d(r.v(60,G.m,g,3))} (ตัวเลขที่ Lv 60 ขั้น III) · ต้องการเส้นสี ${r.req.split('').map(c=>C3[c].th).join(' · ')}`,big:srIcon(r.a,g,r.k)};});
for(const r of CR){const C=C3[r.c];GOODS[r.k]={n:`Carved Rune ${r.th}`,th:`รูนสลัก${C.th} ${r.th}`,price:2500,kind:'crune',cr:r.k,col:C.c,d:`ช่องเล็กของวงเศษโทเท็ม (Y) · ${crTxt(r,1)} ที่ช่อง Lv 1 → ${crTxt(r,10)} ที่ช่อง Lv 10 · ป้อนรูนสลักอัปเลเวลช่องได้`,big:crIcon(r.k)};}
window.RUNEDATA={C3,GRADE,TIERM,TIERN,ANIMAL,SR,SRK,CR,CRK,crTxt,RING,COST,DROPS,ART,srIcon,crIcon,GOODS,ICON_HAVE,SPIRIT_HAVE,iconPath,POUCH:new Set(['srune','crune'])};
})();
