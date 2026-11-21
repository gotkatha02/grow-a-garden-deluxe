/* =====================================================================
   AETHERFALL — ITEM SYSTEM (12 Tails style). Loaded last (after index.html's main script).
   • Every owned item is its own INSTANCE (ITEMS[id], id 'i123') with its own refine, holes, orbs, grade, trait, special stats.
   • Zeny + Etc bag (materials, ores, orbs, tools, trait crystals). Saved per hero in localStorage.
   • CRAFTING: each start town has 10 item grades (Lv 1,10,20…90). Each grade needs that grade's materials,
     which drop only from monsters of that level band (Lv 0–9 → grade 1, 10–19 → grade 2 …) in the town's region.
     Every craft rolls 1–3 random SPECIAL STATS (crit %, skill damage %, lifesteal, cooldown, EXP % …) → crafting
     again is how you chase a better item, so gear stays worth making for a long time.
   • Smith (B, only in the 5 start towns): craft · trait (trait crystal) · refine (+1…+10, can break from +6)
     · move refine to a new item · drill holes · set/remove orbs · merge orbs.
   • Shop (N): capital = full trade hub (buys +20%); start towns = basic shop.
   Tune everything in the tables at the top.
   ===================================================================== */
(function(){
if(typeof ITEMS==='undefined')return;
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('en-US');

/* ---------------- regions / towns ---------------- */
const TOWNS={
  vik:{name:'ฟรอสต์เฮล์ม',map:'frostheim',pair:['atk','vit'],third:'lck',col:'#7fb8e8',
    pre:['Driftwood','Iron','Wolfbone','Runic','Frostforged','Glacier','Valkyrie','Jotun','Einherjar','Fenrir']},
  azt:{name:'โชชิตลัน',map:'aztT',pair:['agi','cha'],third:'lck',col:'#5fbf6a',
    pre:['Reed','Bone','Jade','Obsidian','Feathered','Jaguar','Serpent','Sunforged','Quetzal','Solar']},
  grk:{name:'ไอโอเนีย',map:'grkT',pair:['vit','def'],third:'cha',col:'#d8c890',
    pre:['Olive','Bronze','Marble','Hoplite','Spartan','Oracle','Titan','Olympian','Aegis','Thunderlord']},
  egy:{name:'เคเมท',map:'egyT',pair:['tal','int'],third:'cha',col:'#e8b84a',
    pre:['Linen','Papyrus','Scarab','Sandstone','Jackal','Sphinx','Ankh','Pharaoh','Sun-Disk','Eternal']},
  jpn:{name:'ฮาคุเซ็น',map:'jpnT',pair:['atk','agi'],third:'lck',col:'#f08aa8',
    pre:['Bamboo','Paper','Ashigaru','Ronin','Shinobi','Samurai','Oni','Daimyo','Shogun','Raijin']}};
/* craft tiers Lv30/50/70 are their own themed sets (Lv90 = the town's signature set) */
{const TS={vik:['Fjord Fisher','Longship Raider','Bear Berserker'],azt:['Maize Farmer','Jaguar Warrior','Turquoise Serpent'],
  grk:['Olive Shepherd','Hoplite','Tide Guardian'],egy:['Nile Reed','Sand Scorpion','Jackal Guard'],jpn:['Wandering Ronin','Shinobi','Oni Lord']};
 for(const r in TS)TS[r].forEach((n,i)=>TOWNS[r].pre[3+2*i]=n);}
const HOME={wolf:'vik',rhino:'vik',owl:'vik',jaguar:'azt',croc:'azt',axolotl:'azt'};
const regionOf=id=>!id?HOME[CHAR]||'vik':id==='frostheim'||id==='snowpine'?'vik':/^(capT|c[A-Z]|cata|rift)/.test(id)?'cap':id.slice(0,3);
const townHere=()=>{const m=(window.AF_ROOM_TOWN&&AF_ROOM_TOWN[curMap])||curMap;for(const r in TOWNS)if(TOWNS[r].map===m)return r;return m==='capT'?'cap':null;};   // a craft hall room counts as its town
const tierOfLv=L=>L<30?1:L<60?2:L<90?3:4;                                      // ore / orb tier
const gradeOfLv=L=>Math.max(0,Math.min(9,Math.floor(L/10)));                    // material / item grade 0–9
const gradeLv=g=>g?g*10:1;                                                       // item level of a grade
const gradeTier=g=>1+Math.min(3,Math.floor(g/3));                               // which ore refines it (1–4)
const gradePow=g=>1+g*2/9;                                                       // trait power ×1 … ×3

/* ---------------- materials: 10 grades × (common, rare) per region ---------------- */
const MATS={
  vik:[['Frost Fur','ขนน้ำแข็ง','Pine Resin','ยางสน'],['Wolf Hide','หนังหมาป่า','Ice Crystal','ผลึกน้ำแข็ง'],['Rune Pebble','หินรูน','Moor Moss','มอสทุ่งรูน'],['Seal Blubber','ไขแมวน้ำ','Narwhal Horn','งานาร์วาล'],['Troll Straw','ฟางโทรล','Raider Iron','เหล็กโจรไวกิ้ง'],
       ['Dwarven Ore','แร่คนแคระ','Forge Ember','ถ่านเตาหลอม'],['Shadow Pelt','หนังเงา','Witch Charm','เครื่องรางแม่มด'],['Yeti Horn','เขาเยติ','Mammoth Tusk','งาแมมมอธ'],['Draugr Chain','โซ่เดรากร์','Glacier Heart','แก่นธารน้ำแข็ง'],['Gleipnir Thread','ด้ายเกลปเนียร์','Fenrir Fang','เขี้ยวเฟนเรียร์']],
  azt:[['Jungle Leaf','ใบไม้ป่า','Dart Frog Slime','เมือกกบลูกดอก'],['Monkey Fur','ขนลิง','Bright Feather','ขนนกสีสด'],['Maize Husk','เปลือกข้าวโพด','Cacao Bean','เมล็ดโกโก้'],['Croc Scale','เกล็ดจระเข้','Swamp Pearl','ไข่มุกหนองน้ำ'],['Serpent Skin','หนังงู','Stone Mask','หน้ากากหิน'],
       ['Bat Wing','ปีกค้างคาว','Obsidian Shard','เศษออบซิเดียน'],['Jaguar Pelt','หนังจากัวร์','Eagle Plume','ขนอินทรี'],['Jade Chip','เศษหยก','Sun Gold','ทองสุริยะ'],['Temple Stone','หินวิหาร','Quetzal Plume','ขนเควตซัล'],['Sunstone','หินสุริยะ','Blood Jade','หยกโลหิต']],
  grk:[['Olive Branch','กิ่งมะกอก','Goat Horn','เขาแพะ'],['Marble Chip','เศษหินอ่อน','Crab Shell','กระดองปูหินอ่อน'],['Satyr Fur','ขนซาเทอร์','Honeycomb','รังผึ้ง'],['Bronze Scrap','เศษทองแดง','Philosopher Scroll','ม้วนคัมภีร์ปราชญ์'],['Siren Scale','เกล็ดไซเรน','Harpy Talon','กรงเล็บฮาร์ปี้'],
       ['Centaur Hair','ขนเซนทอร์','Cyclops Tooth','ฟันไซคลอปส์'],['Hecate Ash','เถ้าเฮคาที','Cerberus Fang','เขี้ยวเคอร์เบอรัส'],['Spartan Crest','พู่หมวกสปาร์ตัน','Medusa Scale','เกล็ดเมดูซ่า'],['Styx Water','น้ำสติกซ์','Minotaur Horn','เขามิโนทอร์'],['Griffin Feather','ขนกริฟฟิน','Ambrosia','แอมโบรเซีย']],
  egy:[['Desert Sand','ทรายทะเลทราย','Scorpion Tail','หางแมงป่อง'],['Linen Wrap','ผ้าลินิน','Ibis Feather','ขนไอบิส'],['Fox Fur','ขนจิ้งจอกทราย','Scarab Shell','กระดองสคารับ'],['Granite Chunk','ก้อนแกรนิต','Papyrus','กระดาษปาปิรุส'],['Mummy Cloth','ผ้ามัมมี่','Jackal Fang','เขี้ยวจิ้งจอก'],
       ['Vulture Plume','ขนแร้ง','Embalming Oil','น้ำมันอาบศพ'],['Tomb Dust','ฝุ่นสุสาน','Canopic Jar','โถคาโนปิก'],['Sand Worm Hide','หนังหนอนทราย','Ankh Shard','เศษอังค์'],['Anubis Cloth','ผ้าอนูบิส','Pharaoh Gold','ทองฟาโรห์'],['Djinn Smoke','ควันจินน์','Eye of Ra','ดวงตาแห่งรา']],
  jpn:[['Sakura Petal','กลีบซากุระ','Tanuki Leaf','ใบไม้ทานุกิ'],['Rice Straw','ฟางข้าว','Kappa Plate','จานกัปปะ'],['Bamboo Strip','ซีกไผ่','Panda Fur','ขนแพนด้าแดง'],['Onsen Stone','หินออนเซ็น','Steam Crystal','ผลึกไอน้ำ'],['Fox Tail','หางจิ้งจอก','Tengu Feather','ขนเท็งงุ'],
       ['Pirate Rope','เชือกโจรสลัด','Ink Sac','ถุงหมึก'],['Shuriken','ดาวกระจาย','Toad Oil','น้ำมันคางคก'],['Spirit Talisman','ยันต์วิญญาณ','Ronin Steel','เหล็กโรนิน'],['Oni Horn','เขาโอนิ','Tamahagane','เหล็กทามาฮากาเนะ'],['Shogun Seal','ตราโชกุน','Raiju Spark','ประกายไรจู']]};
const STN={atk:'ATK',def:'DEF',agi:'AGI',vit:'VIT',int:'INT',cha:'CHA',tal:'TAL',lck:'LCK'};
const ORB_COL={atk:'#e2574c',def:'#8a96a8',agi:'#5fd0a0',vit:'#f08a3a',int:'#7fa8ff',cha:'#f0a8d8',tal:'#b07aff',lck:'#f5d040'};
const matA=(r,g)=>`m_${r}_${g}_a`,matB=(r,g)=>`m_${r}_${g}_b`;
const ETC={};
for(const r in MATS)MATS[r].forEach((m,g)=>{const lv=`Lv${g*10}–${g*10+9}`;
  ETC[matA(r,g)]={n:m[0],th:m[1],price:8+6*g,kind:'mat',reg:r,grade:g,col:TOWNS[r].col,d:`วัตถุดิบ${TOWNS[r].name} ระดับ ${g+1} (มอน ${lv}) · ใช้คราฟต์ของ Lv${gradeLv(g)}`};
  ETC[matB(r,g)]={n:m[2],th:m[3],price:30+25*g,kind:'mat',reg:r,grade:g,rare:1,col:TOWNS[r].col,d:`วัตถุดิบหายาก${TOWNS[r].name} ระดับ ${g+1} (มอน ${lv}) · ใช้คราฟต์ของ Lv${gradeLv(g)}`};});
[100,400,1500,5000].forEach((p,i)=>ETC['ore'+(i+1)]={n:`Refine Ore T${i+1}`,th:`แร่ตีบวก ขั้น ${i+1}`,price:p,kind:'ore',tier:i+1,col:['#b0b8c8','#7fd0ff','#c08aff','#ffd36a'][i],d:`ตีบวกของ Lv${[1,30,60,90][i]}–${[29,59,89,99][i]}`});
ETC.drill={n:'Drill',th:'สว่านเจาะรู',price:3000,kind:'tool',col:'#c9a46a',d:'เจาะรูอุปกรณ์ สุ่ม 1–4 รู (เจาะใหม่ หินเดิมหายหมด)'};
ETC.pliers={n:'Orb Pliers',th:'คีมถอดหิน',price:2000,kind:'tool',col:'#8a96a8',d:'ถอดหินออฟออกมาโดยหินไม่หาย'};
ETC.guard={n:'Guard Stone',th:'หินกันแตก',price:50000,kind:'tool',col:'#5fd0ff',d:'ตีบวกพลาด ของไม่แตก (ที่ +6–+10 ยังลดบวก 1) · +11 ขึ้นไปใช้ครั้งละ (บวก − 9) ก้อน'};
/* owner 2026-11-21: refine up to +15 — very hard. +11…+15 also need Star Ore (bosses / Lv 70+ monsters, tradable) */
ETC.sore={n:'Star Ore',th:'แร่ดาวตก',price:50000,kind:'ore',tier:5,col:'#ff7ad8',d:'ตีบวก +11 ถึง +15 · ใช้ครั้งละ 1/2/3/4/5 ก้อน (ไป +11/+12/+13/+14/+15) · ดรอปจากมอน Lv 70+ (ดันเจี้ยนบ่อยกว่า) และบอส'};
/* totem gem goods (owner 2026-11-21): all tradable in the central market — the way to the gem you want */
{const GD=window.GEMDATA||{MUT:[],SUP:[]},SC=['#c9b48a','#8fd0c8','#c08aff','#ffcf5a'],LB=['Lv 1–29','Lv 30–59','Lv 60–89','Lv 90+'];
  [2000,6000,15000,40000].forEach((p,i)=>ETC['tstone'+(i+1)]={n:`Totem Stone T${i+1}`,th:`หินโทเท็มดิบ ขั้น ${i+1}`,price:p,kind:'tstone',tier:i+1,col:SC[i],d:`แกะ 3 ก้อน = เจมหลักขั้น ${i+1} 1 เม็ด (สุ่มชนิด สุ่มคุณภาพ) ที่แผงกลุ่มดาว (G) · ดรอปจากมอน ${LB[i]} (ดันเจี้ยนบ่อยกว่า) และบอส`});
  [800,2400,6000,16000].forEach((p,i)=>ETC['tfrag'+(i+1)]={n:`Gem Shard T${i+1}`,th:`ชิ้นส่วนเจม ขั้น ${i+1}`,price:p,kind:'tfrag',tier:i+1,col:SC[i],d:`40 ชิ้น = คราฟต์เจมหลักขั้น ${i+1} ชนิดที่เลือกเองได้ (สุ่มคุณภาพ) · ได้จากการย่อยเจมซ้ำ`});
  ETC.tess={n:'Totem Essence',th:'แก่นโทเท็ม',price:2500,kind:'tess',col:'#ffb84a',d:'อัปเลเวลเจม · อัปขั้น/ล้างบรรทัดเจม · ดรอปจากมอนทั่วไป และได้จากการย่อยเจมซ้ำ'};
  for(const m of GD.MUT)ETC['gmut_'+m[0]]={n:`${m[6]} Mutation Gem`,th:`เจมแปรสภาพ ${m[1]}`,price:25000,kind:'gmut',gem:m[0],col:m[3],d:`ได้: ${m[4]} · เสีย: ${m[5]} · ใส่ที่ดาวกลางข้างเจมหลัก (G) · ใช้ได้ทุกฮีโร่`};
  for(const m of GD.SUP)ETC['gsup_'+m[0]]={n:`${m[5]} Support Gem`,th:`เจมเสริม ${m[1]}`,price:12000,kind:'gsup',gem:m[0],col:m[3],d:`${m[4]} · ใส่ที่ดาวเล็กข้างเจมหลัก (G) · ใช้ได้ทุกฮีโร่`};}
for(const r in TOWNS)ETC['trait_'+r]={n:`Trait Crystal (${TOWNS[r].name})`,th:`ผลึกนิสัย ${TOWNS[r].name}`,price:20000,kind:'crystal',reg:r,col:TOWNS[r].col,d:'ใช้ที่ช่างของเมืองนี้ ใส่/สุ่มนิสัยพิเศษให้ไอเทมของเมืองนี้'};
/* ---------------- consumables (Item tab · double-click to use · F = best HP potion · V = best SP potion) ---------------- */
const CONS={
  hp1:{n:'Red Potion',th:'ยาแดง',lv:1,hp:150,price:25,col:'#e2574c',d:'ฟื้น HP 150'},
  hp2:{n:'Orange Potion',th:'ยาส้ม',lv:20,hp:450,price:120,col:'#f08a3a',d:'ฟื้น HP 450'},
  hp3:{n:'Yellow Potion',th:'ยาเหลือง',lv:45,hp:1000,price:450,col:'#f5d040',d:'ฟื้น HP 1,000'},
  hp4:{n:'White Potion',th:'ยาขาว',lv:70,hp:1800,price:1100,col:'#f4f4f8',d:'ฟื้น HP 1,800'},
  sp1:{n:'Blue Herb',th:'สมุนไพรฟ้า',lv:1,sp:50,price:60,col:'#5fa0e8',d:'ฟื้น SP 50'},
  sp2:{n:'Blue Potion',th:'ยาฟ้า',lv:30,sp:150,price:300,col:'#3a6ad8',d:'ฟื้น SP 150'},
  sp3:{n:'Mana Elixir',th:'ยาน้ำมานา',lv:60,sp:300,price:900,col:'#7a4ad8',d:'ฟื้น SP 300'},
  elixir:{n:'World Tree Dew',th:'น้ำค้างต้นไม้โลก',lv:1,full:1,price:15000,col:'#7fe0a0',d:'ฟื้น HP และ SP เต็ม (ดรอปจากดันเจี้ยน ไม่มีขาย)'},
  food_atk:{n:'Roast Boar',th:'หมูป่าย่าง',lv:1,buff:'atk',price:1500,col:'#c9884a',d:'ATK +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  food_def:{n:'Iron Stew',th:'สตูว์เหล็ก',lv:1,buff:'def',price:1500,col:'#8a96a8',d:'DEF +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  food_vit:{n:'Hearty Soup',th:'ซุปบำรุง',lv:1,buff:'vit',price:1500,col:'#f0a050',d:'VIT +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  food_agi:{n:'Wind Dumpling',th:'เกี๊ยวสายลม',lv:1,buff:'agi',price:1500,col:'#5fd0a0',d:'AGI +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  food_tal:{n:'Star Tea',th:'ชาดวงดาว',lv:1,buff:'tal',price:1500,col:'#b07aff',d:'TAL +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  food_cha:{n:'Honey Cake',th:'เค้กน้ำผึ้ง',lv:1,buff:'cha',price:1500,col:'#f0a8d8',d:'CHA +5 +2 ต่อ 10 เลเวล · 10 นาที'},
  manual:{n:'Battle Manual',th:'คู่มือการต่อสู้',lv:1,exp:.5,price:20000,col:'#d8b070',d:'EXP +50% · 30 นาที'},
  ret:{n:'Return Scroll',th:'ม้วนกลับเมืองเกิด',lv:1,warp:'home',price:300,col:'#e8d8a0',d:'วาร์ปกลับเมืองเกิด'},
  capscroll:{n:'Capital Scroll',th:'ม้วนวาร์ปเมืองหลวง',lv:1,warp:'capT',price:800,col:'#f5d36a',d:'วาร์ปไปเมืองหลวง (ตลาดกลาง)'},
  wing:{n:'Fly Feather',th:'ขนนกวาร์ป',lv:1,warp:'random',price:60,col:'#bfe6ff',d:'วาร์ปไปจุดสุ่มในแมพเดิม'}};
for(const k in CONS)ETC[k]=Object.assign({kind:'use'},CONS[k]);
const ORB_RANGE=t=>[[1,1],[1,1],[1,1],[1,2]][Math.max(1,Math.min(4,t))-1];   // owner 2026-11-19: 12 Tails has 3 gear pieces × 4 holes, we have 8 pieces / 16 holes → orbs stay tiny; all items together ≈ +50 to one stat
//   // value rolled when socketed   // rebalanced 2026-11-18: was 1–5 … 16–20 (24 holes × 20 = +480 to one stat)
for(const s in STN)for(let t=1;t<=4;t++)ETC[`orb_${s}_${t}`]={n:`${STN[s]} Orb T${t}`,th:`หินออฟ ${STN[s]} ขั้น ${t}`,price:300*t*t,kind:'orb',stat:s,tier:t,col:ORB_COL[s],d:`ยัดลงรู: ${STN[s]} +${ORB_RANGE(t)[0]}–${ORB_RANGE(t)[1]} (สุ่มตอนยัด)`};

/* ---------------- tuning ---------------- */
/* economy (tuned 2026-11-16): one grade (10 levels, ~240–960 kills) drops enough for 4–16 crafts → early you choose which
   pieces to remake, later you craft extra copies to chase better special stats. */
const DROP={matA:.20,matB:.05,ore:.03,orb:.012,crystalDun:.004,crystalField:.001,zenyBase:10,zenyLv:3,hpPot:.03,spPot:.015,food:.005,elixir:.002};
/* refine v2 (owner 2026-11-21: 'it may break, but it must be repaired' · '+15 yes, but very very hard'):
   +1…+5 always · +6…+10 fail = −1 and the piece BREAKS · +11…+15 fail = the piece breaks (refine stays) · a broken piece gives
   nothing until it is repaired (a same slot + same grade piece, or zeny) · Guard Stone = no break · +11…+15 need Star Ore
   and get +1 % per failed try on that piece (at most +10 %) until it goes up. Expected +10 → +15 ≈ 39 tries · 136 Star Ore
   (tools/longterm_sim.py refine). */
const REFINE_CHANCE=[1,1,1,1,1,.9,.8,.65,.5,.4,.20,.12,.08,.05,.03];               // to reach +1 … +15 (index = current refine)
const REF_MAX=15,REF_PITY=.01,REF_PITY_CAP=.10;
const refStar=r=>r>=10?r-9:0;                                                     // Star Ore per try at +11 … +15
const refGuardN=r=>r>=10?r-9:1;                                                   // Guard Stones that keep it from breaking
const refChance=(it,r)=>r<10?REFINE_CHANCE[r]:Math.min(1,REFINE_CHANCE[r]+Math.min(REF_PITY_CAP,REF_PITY*((it&&it.rp)||0)));
const refCost=(it,r)=>{const t=Math.max(1,Math.min(4,it.tier||it.wlv||1)),c=[['ore'+t,1]];if(refStar(r))c.push(['sore',refStar(r)]);return c;};
const COST={craftA:8,craftB:2,craftZ:g=>300*(g+1),traitZ:5000,refineZ:(t,r)=>100*t*t*(r+1),moveZ:(g,r)=>500*(g+1)*r,mergeZ:t=>1000*t};
const DRILL_W=[[1,45],[2,30],[3,18],[4,7]];
/* max holes by slot: weapon & body armour 4, everything else 2 */
const holeCap=it=>it.slot==='acc'?0:it.dset!==undefined?1:(it.slot==='rhand'||it.slot==='armor')?4:2;   // weapon / armour 4 holes, other gear 2, accessories none, drop-set pieces 1
/* base stats by grade g (0–9): the slot's main stat + the town pair (×pm for small pieces) */
/* 5 kinds since 2026-11-21 (owner: weapon · headgear · armour · shoes · one accessory). The cut pieces' stats moved onto the rest so a full set
   is as strong as before: town-pair weight 1+1+.6+.6+.6+1+1 (old 7 pieces) = 1+1+1+1+1.8 (new 5) · DEF 10+3.14g = armour 5+1.75g + helm 2.5+.72g + boots 2.5+.67g.
   garment stays defined (gone:1) so old cloaks in bags still show and sell; GEAR = the kinds that exist now. */
const SLOTS={rhand:{nm:'อาวุธ',code:'W',main:g=>40+20*g,pm:1,w:150},armor:{nm:'เกราะ',code:'B',kind:'Armor',noun:'Mail',main:g=>5+1.75*g,pm:1,w:200},
  top:{nm:'หมวก',code:'T',kind:'Upper Headgear',noun:'Helm',main:g=>2.5+.72*g,pm:1,w:50},garment:{nm:'ผ้าคลุม',code:'G',kind:'Garment',noun:'Cloak',main:g=>2+.56*g,pm:.6,w:40,gone:1},
  shoes:{nm:'รองเท้า',code:'S',kind:'Shoes',noun:'Boots',main:g=>2.5+.67*g,pm:1,w:40},acc:{nm:'เครื่องประดับ',code:'A',kind:'Accessory',noun:'Charm',main:null,pm:1.8,w:10}};
const GEAR=Object.keys(SLOTS).filter(s=>!SLOTS[s].gone);
const PAIR=g=>[3+1.7*g,2+1.33*g,1+.78*g];                                        // town pair stat 1 / 2 / third stat
const W_NOUN={wolf:'Greataxe',rhino:'Knuckles',owl:'Crossbow',jaguar:'Fang Daggers',croc:'Spear',axolotl:'Bracelets'};

/* ---------------- special stats (rolled on every craft) ----------------
   value = max × (0.4 + 0.6·grade/9) × random(0.3…1) · count 1 (60%) / 2 (30%) / 3 (10%) · each stat once per item
   slots: W weapon · B armour · T helm · G cloak · S boots · A accessory */
const AFF={
  crit:{n:'คริ',max:6,s:'WAT'},critDmg:{n:'ดาเมจคริ',max:15,s:'WA'},skillDmg:{n:'ดาเมจสกิล',max:8,s:'WAT'},autoDmg:{n:'ดาเมจตีปกติ',max:10,s:'WA'},
  bossDmg:{n:'ดาเมจใส่มอนถึก/บอส',max:12,s:'W'},lifesteal:{n:'ดูดเลือด',max:2,dec:1,s:'WA'},
  hpPct:{n:'MaxHP',max:8,s:'BTGSA'},dmgRed:{n:'รับดาเมจ',max:5,neg:1,s:'BGS'},hpRegen:{n:'ฟื้น HP',max:40,s:'BTGS'},
  spPct:{n:'MaxSP',max:10,s:'TGA'},cdr:{n:'คูลดาวน์',max:5,neg:1,s:'TGSA'},move:{n:'เดินเร็ว',max:6,s:'SG'},spCost:{n:'ใช้ SP',max:8,neg:1,s:'WTA'},
  exp:{n:'EXP',max:5,s:'A'},zeny:{n:'Zeny',max:8,s:'A'},drop:{n:'ดรอปวัตถุดิบ',max:8,s:'A'}};
const affLabel=(k,v)=>{const A=AFF[k];return A?`${A.n} ${A.neg?'-':'+'}${v}%`:`${k} +${v}%`;};
function rollAffixes(slot,g){const code=SLOTS[slot].code,pool=Object.keys(AFF).filter(k=>AFF[k].s.includes(code)),x=Math.random(),n=x<.6?1:x<.9?2:3,out=[];
  while(out.length<n&&pool.length){const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0],A=AFF[k],raw=A.max*(.4+.6*g/9)*rnd(.3,1);
    out.push({k,v:A.dec?Math.max(.1,Math.round(raw*10)/10):Math.max(1,Math.round(raw))});}return out;}
const affRating=it=>(it.aff||[]).reduce((s,a)=>s+a.v/(AFF[a.k].max*(.4+.6*(it.grade||0)/9)),0);   // 0…3, how good the roll is

/* ---------------- traits (3 per town, power × grade) ---------------- */
const TRAITS={
  berserk:{town:'vik',n:'เลือดนักรบ',d:p=>`HP ต่ำกว่า 50%: ดาเมจ +${r1(6*p)}%`},
  wolfhide:{town:'vik',n:'ขนหมาป่า',d:p=>`รับดาเมจ -${r1(4*p)}%`},
  rune:{town:'vik',n:'รูนสลัก',d:p=>`ตีโดนครบ 5 ครั้ง ระเบิดรูน ${r1(40*p)}% ของพลังโจมตี`},
  obsidian:{town:'azt',n:'คมออบซิเดียน',d:p=>`ตีคริ: ศัตรูเลือดไหล ${r1(3*p)} วิ`},
  numbdart:{town:'azt',n:'ลูกดอกชา',d:p=>`ตีโดน ${r1(10*p)}%: ศัตรูช้า 2 วิ`},
  jagrush:{town:'azt',n:'สายฟ้าจากัวร์',d:p=>`ฆ่าศัตรู: เดินเร็ว +${r1(10*p)}% 3 วิ`},
  aegis:{town:'grk',n:'โล่เทพ',d:p=>`ทุก 8 วิ: ครั้งต่อไปที่โดนตี ลดดาเมจ ${Math.min(75,r1(25*p))}%`},
  phalanx:{town:'grk',n:'กำแพงฟาแลงซ์',d:p=>`ศัตรูรุมรอบตัว (สูงสุด 3): รับดาเมจ -${r1(2*p)}% ต่อตัว`},
  apollo:{town:'grk',n:'พรอพอลโล',d:p=>`ตีโดน: ฟื้น HP ${r1(2*p)}% ของดาเมจ`},
  curse:{town:'egy',n:'คำสาปฟาโรห์',d:p=>`ตีโดน: DEF ศัตรู -${r1(5*p)}% ซ้อนได้ 3 ครั้ง`},
  soulsand:{town:'egy',n:'ทรายดูดวิญญาณ',d:p=>`ตีโดน: SP +${r1(1*p)}`},
  eyeofra:{town:'egy',n:'ดวงตาแห่งรา',d:p=>`ดาเมจเวท +${r1(6*p)}%`},
  iaido:{town:'jpn',n:'ไออิโด',d:p=>`ตีศัตรูที่ HP เต็ม: ดาเมจ +${r1(25*p)}%`},
  shinobi:{town:'jpn',n:'เงานินจา',d:p=>`${r1(3*p)}% หลบการโจมตี`},
  raiden:{town:'jpn',n:'ใบมีดสายฟ้า',d:p=>`ดาเมจคริ +${r1(10*p)}%`}};
function r1(v){return Math.round(v*10)/10;}

/* ---------------- state + save ---------------- */
/* play mode (Lv1 real game) keeps its own item save, separate from the Lv99 test mode (progress.js decides the mode) */
const MODE=(()=>{try{return JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}').mode||null;}catch(e){return null;}})();
const BAG={};let ZENY=0,SEQ=0;const SKEY='af_items_v1_'+CHAR+(MODE==='play'?'_play':'');
const BUFF={food:null,manual:0};                                                 // food {stat,v,until} · manual = until (Date.now ms)
const isInst=id=>/^i\d+$/.test(id);
function newInst(base,data){const id='i'+(++SEQ);ITEMS[id]=Object.assign({},ITEMS[base]||{},data||{},{base:data&&data.base!==undefined?data.base:base});return id;}
function ownedIds(){return [...Object.values(EQ).filter(Boolean),...INV];}
function save(){try{const inst={};for(const id of ownedIds())inst[id]=ITEMS[id];localStorage.setItem(SKEY,JSON.stringify({v:1,zeny:ZENY,seq:SEQ,bag:BAG,buff:BUFF,inst,inv:INV.slice(),eq:{...EQ}}));}catch(e){}}
let FRESH=false;                                                                // no item save yet = a brand-new hero (market.js clears that hero's market record)
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){}
  if(s&&s.v===1){ZENY=s.zeny||0;SEQ=s.seq||0;Object.assign(BUFF,s.buff||{});
    for(const k in s.bag||{}){const m=/^m_(\w+)_(\d)_([ab])$/.exec(k);if(m&&!ETC[k])continue;BAG[k]=s.bag[k];}   // drop materials from the old 4-tier table
    for(const id in s.inst||{}){const it=ITEMS[id]=s.inst[id];if(it.crafted&&it.grade===undefined){it.grade=[0,3,6,9][(it.tier||1)-1];restat(id);}
      if(it.crafted&&![3,5,7,9].includes(it.grade)){it.grade=[3,3,3,3,3,5,5,7,7,9][it.grade]??3;restat(id);}
      if(it.crafted&&!it.renamed)it.n=craftName(it.town,it.cslot,it.grade);   /* crafting now has 4 tiers (Lv30/50/70/90): older pieces move to the nearest */
      if(!it.s5&&it.cslot&&SLOTS[it.cslot]&&!SLOTS[it.cslot].gone&&it.grade!=null){it.st=it.crafted?craftStats(it.town,it.cslot,it.grade,it.magic):it.dset!==undefined?dsStats(it.dset,it.cslot,it.magic):it.st;it.s5=1;}}   /* 5-slot cut (2026-11-21): helms / boots / armour / accessories carry the stats of the removed pieces */
    INV.length=0;for(const id of s.inv||[])if(ITEMS[id])INV.push(id);for(const sl in EQ)EQ[sl]=s.eq&&ITEMS[s.eq[sl]]?s.eq[sl]:null;for(const sl of ['low','lhand','mid','garment','acc2'])if(s.eq&&ITEMS[s.eq[sl]]&&!INV.includes(s.eq[sl]))INV.push(s.eq[sl]);return;}   /* removed slots (2026-11-19: low, lhand · 2026-11-21: mid, garment, acc2): old gear goes back to the bag */
  FRESH=true;
  if(MODE==='play'){newGame();return;}                                            // real game: start with the Lv1 kit only
  /* first run (test mode): turn the starting gear into instances (own refine/holes/orbs), give money, tools and a Lv1 starter kit */
  ZENY=50000;for(const sl in EQ)if(EQ[sl]&&!isInst(EQ[sl]))EQ[sl]=mkFromBase(EQ[sl]);
  for(let i=0;i<INV.length;i++)if(!isInst(INV[i]))INV[i]=mkFromBase(INV[i]);
  const home=HOME[CHAR]||'vik';INV.push(craftItem(home,'rhand',0),craftItem(home,'armor',0));
  add('drill',1);add('ore1',3);add('hp1',20);add('sp1',10);add('ret',2);add('wing',5);}
function mkFromBase(b){const T=ITEM12[b]||{},lv=T.lv||1;return newInst(b,{orbs:(T.orbs||[]).map(o=>({...o})),sockets:T.sockets||0,tier:tierOfLv(lv),lvReq:lv});}
/* bag limits: 40 equipment pieces · 60 different Etc/consumable kinds · 999 per stack (storage holds the rest) */
const BAG_EQ_MAX=40,BAG_KINDS=60,STACK_MAX=999;
const bagKinds=()=>Object.keys(BAG).length;
function add(id,n=1){if(n>0){if(!BAG[id]&&bagKinds()>=BAG_KINDS)return 0;const room=STACK_MAX-(BAG[id]||0);n=Math.min(n,room);if(n<=0)return 0;}
  BAG[id]=(BAG[id]||0)+n;if(BAG[id]<=0)delete BAG[id];return n;}
const eqFull=()=>INV.length>=BAG_EQ_MAX;
const has=(id,n=1)=>(BAG[id]||0)>=n;
const etcName=id=>ETC[id]?ETC[id].th:id;

/* ---------------- crafted item generation ---------------- */
/* the hero's weapon type (kind, speed, magic or physical) comes from the weapon it holds / owns */
function classWeapon(){const id=EQ.rhand||INV.find(i=>ITEMS[i]&&ITEMS[i].slot==='rhand'),w=ITEMS[id]||{},S=id?itemSt(id).st:{};
  return {kind:w.kind||'Weapon',two:w.two,aspd:w.aspd||150,size:w.size,magic:(S.tal||0)>(S.atk||0)};}
function craftStats(town,slot,g,magic){const T=TOWNS[town],S=SLOTS[slot],P=PAIR(g),st={},put=(k,v)=>{v=Math.round(v);if(v)st[k]=(st[k]||0)+v;};
  if(slot==='rhand')put(magic?'tal':'atk',S.main(g));else if(S.main)put('def',S.main(g));
  put(T.pair[0],P[0]*S.pm);put(T.pair[1],P[1]*S.pm);put(T.third,P[2]*S.pm);return st;}
function craftName(town,slot,g){return `${TOWNS[town].pre[g]} ${slot==='rhand'?(W_NOUN[CHAR]||'Weapon'):SLOTS[slot].noun}`;}
function craftItem(town,slot,g=0,trait=null){const S=SLOTS[slot],cw=slot==='rhand'?classWeapon():{},aff=rollAffixes(slot,g),x={};for(const a of aff)x[a.k]=(x[a.k]||0)+a.v;
  return newInst(null,{base:null,n:craftName(town,slot,g),slot,kind:slot==='rhand'?cw.kind:S.kind,two:cw.two,aspd:cw.aspd,size:cw.size,magic:!!cw.magic,
    st:craftStats(town,slot,g,cw.magic),x,aff,b:{},grade:g,tier:gradeTier(g),wlv:gradeTier(g),lvReq:gradeLv(g),town,trait,sockets:0,orbs:[],ref:0,w:S.w,crafted:1,cslot:slot,
    rank:slot==='rhand'?JOB.name:'All',d:`เซ็ทคราฟ${TOWNS[town].name} Lv${gradeLv(g)}`});}
function restat(id){const it=ITEMS[id],g=it.grade;it.tier=it.wlv=gradeTier(g);it.lvReq=gradeLv(g);it.st=craftStats(it.town,it.cslot,g,it.magic);it.n=craftName(it.town,it.cslot,g);
  if(!it.aff){it.aff=rollAffixes(it.cslot,g);it.x={};for(const a of it.aff)it.x[a.k]=(it.x[a.k]||0)+a.v;}}



/* ---------------- CRAFT SETS: 4 tiers (Lv30/50/70/90) per town · recipe = commons of the 2 bands before + a rare of the set's own band ----------------
   Set bonus (pieces of the same town AND tier, worn at your level), by town theme, stronger than drop sets. k = tier 0…3 */
const CRAFT_G=[3,5,7,9];
COST.craftA2=6;
const craftCost=(r,g)=>[[matA(r,g-2),COST.craftA2],[matA(r,g-1),COST.craftA2],[matB(r,g),COST.craftB]];
const CSET={
  vik:k=>[[2,{hpPct:5+2*k}],[4,{autoDmg:5+2*k,skillDmg:5+2*k}],[5,{bossDmg:8+3*k,lifesteal:1+.5*k}]],
  azt:k=>[[2,{move:5+k}],[4,{crit:3+k}],[5,{critDmg:10+4*k,autoDmg:5+2*k}]],
  grk:k=>[[2,{hpPct:6+2*k}],[4,{dmgRed:4+k}],[5,{hpRegen:30+10*k,dmgRed:3}]],
  egy:k=>[[2,{spPct:8+2*k}],[4,{skillDmg:6+2*k}],[5,{cdr:5+k,spCost:5+k}]],
  jpn:k=>[[2,{crit:3+k}],[4,{critDmg:10+3*k}],[5,{autoDmg:8+2*k,move:5}]]};
const csTier=g=>Math.max(0,CRAFT_G.indexOf(g));
const csCount=()=>{const c={};for(const sl in EQ){const it=ITEMS[EQ[sl]];if(it&&!it.broken&&it.crafted&&(it.lvReq||1)<=PS.lv){const k=it.town+'_'+it.grade;c[k]=(c[k]||0)+1;}}return c;};
const csBonusText=(t,g,n=-1)=>CSET[t](csTier(g)).map(([p,o])=>`<span style="${n<0?'':n>=p?'color:#2a9a28;font-weight:700':'color:#8a94a8'}">${p} ชิ้น: ${Object.entries(o).map(([k,v])=>affLabel(k,v)).join(', ')}</span>`).join(' · ');
{const _gc=gearCalc;gearCalc=function(){_gc();const c=csCount();
  for(const key in c){const [t,g]=key.split('_');for(const [p,o] of CSET[t](csTier(+g)))if(c[key]>=p)for(const k in o)BON[k]=(BON[k]||0)+o[k];}};}
/* ---------------- DROP SETS (มอนดรอป): one 5-piece set per 10 levels (6 before the 5-slot cut, 2026-11-21), ~60% of a crafted piece of the same grade ----------------
   Any monster drops pieces of the set for its level band. No random special stats, 1 socket max, can be refined.
   Set bonus (equipped pieces of the SAME set, worn at your level): 2 = MaxHP · 4 = damage · 5 = crit + move speed. */
const DSET=[['Traveler','นักเดินทาง',['vit','agi']],['Hunter','นักล่า',['atk','lck']],['Scout','หน่วยสอดแนม',['agi','lck']],['Mercenary','ทหารรับจ้าง',['atk','vit']],
  ['Ranger','เรนเจอร์',['agi','int']],['Knight','อัศวิน',['vit','def']],['Warden','ผู้พิทักษ์',['def','tal']],['Champion','แชมเปี้ยน',['atk','agi']],
  ['Warlord','ขุนศึก',['atk','vit']],['Ancient','โบราณ',['tal','lck']]];
const DSET_MUL=.6;
const dsBonus=g=>({hp:Math.round(3+g*.5),dmg:Math.round(3+g*.45),crit:Math.round(2+g*.35),move:5});
function dsStats(g,slot,magic){const S=SLOTS[slot],D=DSET[g],P=PAIR(g),st={},put=(k,v)=>{v=Math.round(v*DSET_MUL);if(v)st[k]=(st[k]||0)+v;};
  if(slot==='rhand')put(magic?'tal':'atk',S.main(g));else if(S.main)put('def',S.main(g));
  put(D[2][0],P[0]*S.pm);put(D[2][1],P[1]*S.pm);return st;}
function dropSetItem(g,slot){const S=SLOTS[slot],D=DSET[g],cw=slot==='rhand'?classWeapon():{},st=dsStats(g,slot,cw.magic);
  return newInst(null,{base:null,n:`${D[0]}'s ${slot==='rhand'?(W_NOUN[CHAR]||'Weapon'):S.noun}`,slot,kind:slot==='rhand'?cw.kind:S.kind,two:cw.two,aspd:cw.aspd,size:cw.size,magic:!!cw.magic,
    st,x:{},aff:[],b:{},grade:g,tier:gradeTier(g),wlv:gradeTier(g),lvReq:gradeLv(g),dset:g,sockets:0,orbs:[],ref:0,w:S.w,cslot:slot,
    rank:slot==='rhand'?JOB.name:'All',d:`ชุด${D[1]} (ของดรอป Lv${gradeLv(g)}) · อ่อนกว่าของคราฟ แต่สวมครบเซ็ทได้โบนัส`});}
const dsCount=()=>{const c={};for(const sl in EQ){const it=ITEMS[EQ[sl]];if(it&&!it.broken&&it.dset!==undefined&&(it.lvReq||1)<=PS.lv)c[it.dset]=(c[it.dset]||0)+1;}return c;};
{const _gc=gearCalc;gearCalc=function(){_gc();const c=dsCount();
  for(const g in c){const n=c[g],b=dsBonus(+g);if(n>=2)BON.hpPct=(BON.hpPct||0)+b.hp;if(n>=4){BON.autoDmg=(BON.autoDmg||0)+b.dmg;BON.skillDmg=(BON.skillDmg||0)+b.dmg;}if(n>=5){BON.crit=(BON.crit||0)+b.crit;BON.move=(BON.move||0)+b.move;}}};}
DROP.dset=.008;
/* ---------------- traits + special stats in combat ---------------- */
const ON={};let aegisT=-99,rushT=-99;
const _gearCalc=gearCalc;
gearCalc=function(){_gearCalc();for(const k in ON)delete ON[k];
  for(const sl in EQ){const it=ITEMS[EQ[sl]];if(it&&!it.broken&&it.trait&&(it.lvReq||1)<=PS.lv)ON[it.trait]=(ON[it.trait]||0)+gradePow(it.grade??((it.tier||1)-1)*3);}
  if(BUFF.food&&BUFF.food.until>Date.now())BON[BUFF.food.stat]=(BON[BUFF.food.stat]||0)+BUFF.food.v;};   // food buff
const B=k=>(BON[k]||0)/100;
Object.assign(window.itemFx,{
  dmgMul(e,o,crit){let m=1;
    if(o.auto)m*=1+B('autoDmg');else if(!o.dot)m*=1+B('skillDmg');
    if(e.boss||(e.m&&e.m.role==='brute'))m*=1+B('bossDmg');
    if(crit)m*=(SYS.critMul+B('critDmg'))/SYS.critMul;
    if(ON.berserk&&player.hp<player.maxHp*.5)m*=1+.06*ON.berserk;
    if(ON.eyeofra&&o.magic)m*=1+.06*ON.eyeofra;
    if(ON.iaido&&e.hp>=e.maxHp)m*=1+.25*ON.iaido;
    if(ON.raiden&&crit)m*=1+.1*ON.raiden;
    if(ON.curse&&!crit&&e._curse){const df=(e.m&&e.m.def)||0;m*=(100+df)/(100+df*(1-Math.min(.9,.05*ON.curse*e._curse)));}
    return m;},
  afterHit(e,dmg,crit,o){if(o.dot)return;
    if(BON.lifesteal)player.hp=Math.min(player.maxHp,player.hp+dmg*B('lifesteal'));
    if(ON.curse)e._curse=Math.min(3,(e._curse||0)+1);
    if(ON.obsidian&&crit)e.st.bleed=Math.max(e.st.bleed,3*ON.obsidian);
    if(ON.numbdart&&Math.random()<.1*ON.numbdart)e.st.slow=Math.max(e.st.slow,2);
    if(ON.soulsand)player.mp=Math.min(player.maxMp,player.mp+ON.soulsand);
    if(ON.apollo)player.hp=Math.min(player.maxHp,player.hp+dmg*.02*ON.apollo);
    if(ON.rune&&(e._runeN=(e._runeN||0)+1)%5===0&&!e.dead){const d=Math.max(1,Math.round(D.patk*.4*ON.rune*defMul((e.m&&e.m.def)||0)*CLASS_DMG()));e.hp-=d;
      dmgNum(e.x,e.y,60,d,'hit',{scale:.9});addFx(new DText({x:e.x,y:e.y,z:80,text:'RUNE',color:'#9fdcff',size:12,life:.7}));}},
  dodge(){return ON.shinobi?Math.random()<.03*ON.shinobi:false;},
  takenMul(e){let m=1-Math.min(.3,B('dmgRed'));if(ON.wolfhide)m*=1-.04*ON.wolfhide;
    if(ON.phalanx){const n=enemies.filter(o=>!o.dead&&o.aggro>0&&Math.hypot(o.x-player.x,o.y-player.y)<120).length;m*=1-.02*ON.phalanx*Math.min(3,n);}
    if(ON.aegis&&gameTime-aegisT>=8){aegisT=gameTime;m*=1-Math.min(.75,.25*ON.aegis);addFx(new DText({x:player.x,y:player.y,z:78,text:'AEGIS',color:'#ffe9a8',size:13,life:.7}));}
    return Math.max(.2,m);},
  moveMul(){return ON.jagrush&&gameTime<rushT?1+.1*ON.jagrush:1;}});

/* ---------------- drops ---------------- */
const Loot={rate:1};window.Loot=Loot;
const _onKill=onKill;
onKill=function(e){_onKill(e);const xb=B('exp')+(BUFF.manual>Date.now()?CONS.manual.exp:0);if(xb&&typeof killExp==='function')player.exp+=killExp(e.m||{lv:1})*xb;
  try{dropFor(e);}catch(err){console.warn(err);}if(ON.jagrush)rushT=gameTime+3;};
function dropFor(e){const m=e.m||{},L=m.lv||1,t=tierOfLv(L),g=gradeOfLv(L),R=Loot.rate,got=[],ch=p=>Math.random()<Math.min(1,p*R);
  let r=regionOf(curMap);if(!TOWNS[r])r=Object.keys(TOWNS)[Math.floor(Math.random()*5)];          // capital monsters drop goods of every town (trade hub)
  const crit=m.role==='critter'?.5:1,z=Math.round((DROP.zenyBase+L*DROP.zenyLv)*rnd(.8,1.2)*crit*(m.boss?10:1)*(1+B('zeny')));ZENY+=z;
  const dm=1+B('drop');
  if(ch(DROP.matA*dm))got.push(matA(r,g));if(ch(DROP.matB*dm))got.push(matB(r,g));
  if(ch(DROP.ore))got.push('ore'+t);
  if(ch(DROP.hpPot))got.push(L<20?'hp1':L<45?'hp2':L<70?'hp3':'hp4');if(ch(DROP.spPot))got.push(L<30?'sp1':L<60?'sp2':'sp3');
  if(ch(DROP.food))got.push(['food_atk','food_def','food_vit','food_agi','food_tal','food_cha'][Math.floor(Math.random()*6)]);
  if(ch(DROP.orb))got.push(`orb_${Object.keys(STN)[Math.floor(Math.random()*8)]}_${t}`);
  const dun=/D\d|H\d|E\d|cata|rift/.test(curMap||'');
  if(ch(dun?DROP.crystalDun:DROP.crystalField))got.push('trait_'+r);
  if(dun&&ch(DROP.elixir))got.push('elixir');
  /* totem goods (owner 2026-11-21): raw stones by the ore tier of the monster's level band, essence, Star Ore (Lv 70+), mutation / support gems */
  {const GD=window.GEMDATA,D2=GD&&GD.DROPS;if(D2){const tough=m.role==='brute'?2:1,boss=m.boss||(e.vdef&&e.vdef.role==='boss');
    if(ch((dun?D2.stoneDun:D2.stoneField)*tough))got.push('tstone'+t);
    if(ch(D2.ess))for(let i=0,k=D2.essN[0]+Math.floor(Math.random()*(D2.essN[1]-D2.essN[0]+1));i<k;i++)got.push('tess');
    if(L>=D2.soreLv&&ch(dun?D2.soreDun:D2.soreField))got.push('sore');
    if(ch(dun?D2.mutDun:(D2.mutField||0)))got.push('gmut_'+GD.MUT[Math.floor(Math.random()*GD.MUT.length)][0]);   /* field: rare, since skill stars open at Lv 10 */
    if(ch(dun?D2.supDun:D2.supField))got.push('gsup_'+GD.SUP[Math.floor(Math.random()*GD.SUP.length)][0]);
    if(boss){const B2=D2.boss;for(let i=0;i<B2.stones;i++)got.push('tstone'+t);for(let i=0;i<B2.ess;i++)got.push('tess');for(let i=0;i<B2.sore;i++)got.push('sore');
      for(let i=0;i<B2.sup;i++)got.push('gsup_'+GD.SUP[Math.floor(Math.random()*GD.SUP.length)][0]);if(Math.random()<B2.mutChance)got.push('gmut_'+GD.MUT[Math.floor(Math.random()*GD.MUT.length)][0]);}}}
  /* drop-set gear for this level band (boss: 10×) */
  if(Math.random()<Math.min(1,DROP.dset*R*dm*(m.boss?10:1))){if(eqFull())chatLog('sys','<span style="color:#e2574c">กระเป๋าอุปกรณ์เต็ม</span> — อุปกรณ์ดรอปหายไป');
    else{const sl=GEAR[Math.floor(Math.random()*GEAR.length)],id=dropSetItem(g,sl);INV.push(id);const it=ITEMS[id];
      addFx(new DText({x:e.x,y:e.y,z:70,text:'+ '+it.n,color:'#ffb35a',size:13,life:2}));chatLog('bat',`ได้รับอุปกรณ์ <b style="color:#d9861a">${it.n}</b> (ชุด${DSET[g][1]})`);
      if($('#itw')&&$('#itw').classList.contains('open')&&itTab==='equip')buildItems();}}
  const lost=got.filter(id=>!add(id,1));if(lost.length){chatLog('sys',`<span style="color:#e2574c">กระเป๋าเต็ม</span> — ทิ้ง ${lost.map(etcName).join(', ')} (ฝากของในคลัง: กด H ในเมือง)`);}
  got.splice(0,got.length,...got.filter(id=>!lost.includes(id)));
  got.forEach((id,i)=>{const E=ETC[id],rare=E.kind!=='mat'||E.rare;addFx(new DText({x:e.x,y:e.y,z:44+i*13,text:'+ '+E.th,color:E.kind==='orb'?'#c8a8ff':E.kind==='crystal'?'#ffd36a':rare?'#9fe0ff':'#fff6df',size:rare?12:11,life:1.5}));});
  if(got.length)chatLog('bat',`ได้รับ ${got.map(id=>`<b style="color:${ETC[id].kind==='crystal'?'#e0a020':ETC[id].kind==='orb'?'#9a6ae0':'inherit'}">${etcName(id)}</b>`).join(', ')} · ${z}z`);
  save();if($('#itw')&&$('#itw').classList.contains('open')&&itTab==='etc')buildItems();}

/* ---------------- item card extra info + equip/unequip save ---------------- */
const stars=it=>{const r=affRating(it);return r>=2.2?'★★★':r>=1.4?'★★':r>=.7?'★':'';};
window.itemExtraInfo=id=>{const it=ITEMS[id];if(!it)return '';const L=[];
  if(it.crafted){const n=csCount()[it.town+'_'+it.grade]||0;L.push(`เซ็ทคราฟ<b>${TOWNS[it.town].name} Lv${gradeLv(it.grade)}</b> · สวมอยู่ ${n}/5 ${stars(it)?`<span style="color:#e0a020">${stars(it)}</span>`:''}<br>${csBonusText(it.town,it.grade,n)}`);}
  if(it.dset!==undefined){const g=it.dset,b=dsBonus(g),n=dsCount()[g]||0,on=k=>n>=k?'color:#2a9a28;font-weight:700':'color:#8a94a8';
    L.push(`ชุด<b>${DSET[g][1]}</b> · ของดรอป Lv${gradeLv(g)} · สวมอยู่ ${n}/5<br><span style="${on(2)}">2 ชิ้น: MaxHP +${b.hp}%</span> · <span style="${on(4)}">4 ชิ้น: ดาเมจ +${b.dmg}%</span> · <span style="${on(5)}">5 ชิ้น: คริ +${b.crit}%, เดินเร็ว +${b.move}%</span>`);}
  if(it.aff&&it.aff.length)L.push(`<b style="color:#2a7ac8">สถานะพิเศษ</b>: ${it.aff.map(a=>affLabel(a.k,a.v)).join(' · ')}`);
  if(it.trait){const T=TRAITS[it.trait];L.push(`<span style="color:#c2541c">✦ ${T.n}</span>: ${T.d(gradePow(it.grade??0))}`);}
  return L.length?`<div class="t12x">${L.join('<br>')}</div>`:'';};
const _equip=equipItem,_unequip=unequip;
equipItem=function(id){_equip(id);save();};
unequip=function(sl){if(eqFull()){msg(`กระเป๋าอุปกรณ์เต็ม (${BAG_EQ_MAX})`);return;}_unequip(sl);save();};

/* ---------------- using consumables ---------------- */
let potCd=0;
const foodVal=()=>5+2*Math.floor(PS.lv/10);
function useItem(id){const C=CONS[id];if(!C||!has(id))return false;if(PS.lv<C.lv){msg(`ต้องเลเวล ${C.lv}`);return false;}
  const now=performance.now();
  if(C.hp||C.sp||C.full){if(now<potCd)return false;
    if(C.full){player.hp=player.maxHp;player.mp=player.maxMp;}
    else{if(C.hp&&player.hp>=player.maxHp){msg('HP เต็มแล้ว');return false;}if(C.sp&&player.mp>=player.maxMp){msg('SP เต็มแล้ว');return false;}
      if(C.hp)player.hp=Math.min(player.maxHp,player.hp+C.hp);if(C.sp)player.mp=Math.min(player.maxMp,player.mp+C.sp);}
    potCd=now+600;addFx(new DText({x:player.x,y:player.y,z:76,text:C.full?'FULL':C.hp?'+'+C.hp:'+'+C.sp+' SP',color:C.sp?'#7fb8ff':'#7fe08a',size:13,life:.8}));}
  else if(C.buff){BUFF.food={stat:C.buff,v:foodVal(),until:Date.now()+600000};applyStats();chatLog('sys',`กิน ${C.th}: ${STN[C.buff]} +${foodVal()} 10 นาที (แทนอาหารเดิม)`);}
  else if(C.exp){BUFF.manual=Math.max(Date.now(),BUFF.manual)+1800000;chatLog('sys',`อ่าน ${C.th}: EXP +50% ถึง ${new Date(BUFF.manual).toLocaleTimeString()}`);}
  else if(C.warp){const to=C.warp==='home'?TOWNS[HOME[CHAR]||'vik'].map:C.warp;
    if(C.warp==='random'){const h=curMap&&mapHost();if(h&&h.ready&&h.spawns&&h.spawns.length){const p=h.spawns[Math.floor(Math.random()*h.spawns.length)];[player.x,player.y]=M2W(p);}
      else{player.x=rnd(BOUNDS.x0+40,BOUNDS.x1-40);player.y=rnd(BOUNDS.y0+40,BOUNDS.y1-40);}player.moveT=null;player.attackTarget=null;cam.x=player.x;cam.y=player.y;}
    else{if(curMap===to){msg('อยู่ที่นี่แล้ว');return false;}enterMap(to);}}
  add(id,-1);save();if($('#itw')&&$('#itw').classList.contains('open'))buildItems();return true;}
function bestPot(kind){const L=Object.keys(CONS).filter(k=>CONS[k][kind]&&has(k)&&CONS[k].lv<=PS.lv);
  if(kind==='hp'){const miss=player.maxHp-player.hp;L.sort((a,b)=>Math.abs(CONS[a].hp-miss)-Math.abs(CONS[b].hp-miss));}else L.sort((a,b)=>CONS[b].sp-CONS[a].sp);return L[0];}
setInterval(()=>{if(BUFF.food&&BUFF.food.until<=Date.now()){chatLog('sys',`บัฟอาหาร ${STN[BUFF.food.stat]} หมดเวลา`);BUFF.food=null;applyStats();save();}},1000);
const buffLine=()=>{const L=[];if(BUFF.food&&BUFF.food.until>Date.now())L.push(`อาหาร ${STN[BUFF.food.stat]} +${BUFF.food.v} (${Math.ceil((BUFF.food.until-Date.now())/60000)} นาที)`);
  if(BUFF.manual>Date.now())L.push(`EXP +50% (${Math.ceil((BUFF.manual-Date.now())/60000)} นาที)`);return L.join(' · ');};

/* ---------------- item pictures (generated later) ----------------
   Put PNGs in assets/items/<icon key>.png and list the keys in assets/items/icons.json (["hp1","m_vik_0_a",…]).
   Keys: Etc/consumables = their id · crafted gear = eq_<town>_<slot> (weapons: wp_<town>_<hero>) · starting gear = eq_<base id>. */
const ICONS=new Set();
fetch('assets/items/icons.json').then(r=>r.ok?r.json():[]).then(a=>{for(const k of a)ICONS.add(k);buildItems();buildEquip();if(window.MKT)MKT.build();}).catch(()=>{});
const img=(k,sz)=>`<img class="ico" src="assets/items/${k}.png" width="${sz}" height="${sz}" style="object-fit:contain;image-rendering:auto" alt="">`;
/* picture icons sit in the middle of their slot (the drawn SVG icons were positioned by hand) */
{const st=document.createElement('style');st.textContent='img.ico{display:block;pointer-events:none}.ro-grid .c>img.ico,.ro-grid .c>span>img.ico{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.ro-grid .c>span:has(>img.ico){position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%)}';document.head.appendChild(st);}
const gearKey=it=>it.crafted?((k=>it.grade!=null&&ICONS.has(k+'_'+it.grade)?k+'_'+it.grade:k)(it.slot==='rhand'?`wp_${it.town}_${CHAR}`:`eq_${it.town}_${it.cslot}`)):it.dset!==undefined?(it.slot==='rhand'?`ds_${it.dset}_${CHAR}`:`ds_${it.dset}_${it.cslot}`):it.base?`eq_${it.base}`:null;
const _itemIcon=itemIcon;
itemIcon=function(it,sz=24){const k=it&&gearKey(it),h=k&&ICONS.has(k)?img(k,sz):_itemIcon(it,sz);
  return it&&it.broken?`<span class="itbrk" style="position:relative;display:inline-block;width:${sz}px;height:${sz}px;line-height:0;vertical-align:middle">${h}<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" style="position:absolute;left:0;top:0;pointer-events:none"><rect x="0" y="0" width="24" height="24" rx="4" fill="#c0202a" opacity=".22"/><path d="M13 1 L10 8 L14 11 L9 17 L12 23" fill="none" stroke="#2a0a0a" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 1 L10 8 L14 11 L9 17 L12 23" fill="none" stroke="#ff6a5a" stroke-width="1" stroke-linejoin="round"/></svg></span>`:h;};

/* ---------------- Items window: Item + Etc tabs + real Zeny ---------------- */
function etcIcon(id,sz=26){const E=ETC[id]||{},c=E.col||'#c9a46a';
  if(ICONS.has(id))return img(id,sz);
  if(E.kind==='orb'&&ICONS.has('orb_'+E.stat))return img('orb_'+E.stat,sz);   // no tier number on the picture (tier shows in the name / tooltip)   // one picture per orb stat is enough
  let g;
  if(E.kind==='use')g=E.warp?`<path d="M5 6 H19 V18 H5 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><path d="M8 10 H16 M8 13 H14" stroke="#7a4a21" stroke-width="1.2"/>`
    :E.buff||E.exp?`<ellipse cx="12" cy="15" rx="8" ry="5" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><path d="M7 12 Q12 6 17 12" fill="#fff6df" stroke="#3a2a1f" stroke-width="1.2"/>`
    :`<path d="M10 3 H14 V7 L18 12 V19 Q18 21 16 21 H8 Q6 21 6 19 V12 L10 7 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><rect x="9.5" y="2" width="5" height="2.5" rx="1" fill="#a8662d"/><circle cx="10" cy="15" r="1.6" fill="#fff" opacity=".7"/>`;
  else if(E.kind==='orb')g=`<circle cx="12" cy="12" r="8" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><circle cx="9" cy="9" r="2.5" fill="#fff" opacity=".7"/><text x="12" y="15.5" text-anchor="middle" font-size="8" font-weight="900" fill="#3a2a1f">${E.tier}</text>`;
  else if(E.kind==='ore')g=`<path d="M5 15 L9 6 L17 5 L20 13 L14 20 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><path d="M9 6 L12 13 L20 13 M12 13 L14 20" stroke="#fff" opacity=".5"/>`;
  else if(E.kind==='gmut'||E.kind==='gsup')return `<img src="assets/gems/${E.kind==='gmut'?'mut':'support'}/${E.gem}.webp" width="${sz}" height="${sz}" alt="" style="object-fit:contain;display:block" onerror="this.outerHTML='<svg width=&quot;${sz}&quot; height=&quot;${sz}&quot; viewBox=&quot;0 0 24 24&quot;><circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;8&quot; fill=&quot;${c}&quot; stroke=&quot;#3a2a1f&quot; stroke-width=&quot;1.6&quot;/></svg>'">`;
  else if(E.kind==='tstone')g=`<path d="M4 16 L7 7 L13 4 L19 7 L21 14 L15 21 L8 20 Z" fill="#7a6a58" stroke="#3a2a1f" stroke-width="1.5"/><path d="M9 9 L13 6 L17 9 L15 15 L10 15 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1"/><path d="M10 10 L13 8" stroke="#fff" opacity=".7"/><text x="18.5" y="20.5" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" stroke="#3a2a1f" stroke-width=".6">${E.tier}</text>`;
  else if(E.kind==='tfrag')g=`<path d="M5 13 L9 5 L12 12 Z M11 20 L14 9 L18 15 Z M15 7 L20 4 L19 10 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.3"/><path d="M8 8 L9.5 11 M14.5 11 L15 15" stroke="#fff" opacity=".7"/><text x="6.5" y="21" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" stroke="#3a2a1f" stroke-width=".6">${E.tier}</text>`;
  else if(E.kind==='tess')g=`<circle cx="12" cy="13" r="8" fill="#ffd77a" opacity=".35"/><path d="M12 3 C15 8 18 11 18 15 A6 6 0 0 1 6 15 C6 11 9 8 12 3 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.5"/><path d="M10 13 Q12 10 13 8" stroke="#fff" opacity=".8" fill="none"/>`;
  else if(id==='sore')g=`<path d="M5 15 L9 6 L17 5 L20 13 L14 20 Z" fill="#4a3a6a" stroke="#3a2a1f" stroke-width="1.6"/><path d="M12.5 7 L14 11 L18 11 L15 13.5 L16 17.5 L12.5 15 L9 17.5 L10 13.5 L7 11 L11 11 Z" fill="${c}" stroke="#fff" stroke-width=".6"/>`;
  else if(E.kind==='crystal')g=`<path d="M12 2 L18 9 L12 22 L6 9 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><path d="M6 9 H18 M12 2 V22" stroke="#fff" opacity=".55"/>`;
  else if(id==='drill')g=`<path d="M4 20 L13 11" stroke="#7a4a21" stroke-width="3"/><path d="M12 12 L20 4 L21 7 L15 13 Z" fill="#b0b8c8" stroke="#3a2a1f" stroke-width="1.4"/>`;
  else if(id==='pliers')g=`<path d="M6 21 L12 12 L18 21 M12 12 L8 3 M12 12 L16 3" stroke="#3a2a1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  else if(id==='guard')g=`<path d="M12 3 L20 6 L19 14 C18 18 15 20 12 22 C9 20 6 18 5 14 L4 6 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/>`;
  else g=(E.rare?`<path d="M12 3 L20 9 L16 20 H8 L4 9 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/>`:`<circle cx="12" cy="13" r="7.5" fill="${c}" stroke="#3a2a1f" stroke-width="1.6"/><path d="M8 11 Q12 7 16 11" stroke="#fff" opacity=".6" fill="none"/>`)
    +`<text x="12" y="16" text-anchor="middle" font-size="7.5" font-weight="900" fill="#3a2a1f">${(E.grade??0)+1}</text>`;
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24">${g}</svg>`;}
const _buildItems=buildItems;
buildItems=function(){const w=$('#itw');if(!w||!w.classList.contains('open'))return;
  if(itTab==='equip'){_buildItems();const f=w.querySelector('.ft span:last-child');if(f)f.textContent='Zeny : '+fmt(ZENY);addFootBtns(w);return;}
  if(itTab==='item'){const ids=Object.keys(CONS).filter(k=>has(k));let cells='';
    for(const id of ids)cells+=`<div class="c" data-use="${id}" title="${CONS[id].th} ×${BAG[id]} — ${CONS[id].d}${CONS[id].lv>1?' · Lv'+CONS[id].lv:''} · ดับเบิลคลิก = ใช้">${etcIcon(id)}<em>${BAG[id]}</em></div>`;
    for(let i=ids.length;i<35;i++)cells+=`<div class="c" style="cursor:default"></div>`;const bl=buffLine();
    roWin('itw','Items',`<div class="ro-tabs">${[['item','Item'],['equip','Equip'],['etc','Etc']].map(([k,n])=>`<button data-t="${k}" class="${itTab===k?'on':''}">${n}</button>`).join('')}</div><div class="ro-grid">${cells}</div>${bl?`<div class="ix-note" style="margin-top:4px">✦ ${bl}</div>`:''}`,
      `<span>ดับเบิลคลิกเพื่อใช้ · F ยา HP · V ยา SP</span><span style="margin-left:auto">Zeny : ${fmt(ZENY)}</span>`);
    w.querySelectorAll('.ro-tabs button').forEach(b=>b.onclick=()=>{itTab=b.dataset.t;buildItems();});w.querySelectorAll('[data-use]').forEach(c=>c.ondblclick=()=>useItem(c.dataset.use));addFootBtns(w);return;}
  const order={mat:0,ore:1,orb:2,crystal:3,tool:4},ids=Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind!=='use').sort((a,b)=>order[ETC[a].kind]-order[ETC[b].kind]||(ETC[a].grade??0)-(ETC[b].grade??0)||(a>b?1:-1));let cells='';
  for(const id of ids)cells+=`<div class="c" data-etc="${id}" title="${ETC[id].th} ×${BAG[id]}${ETC[id].d?' — '+ETC[id].d:''} · ราคา ${fmt(ETC[id].price)}z">${etcIcon(id)}<em>${BAG[id]}</em></div>`;
  for(let i=ids.length;i<35;i++)cells+=`<div class="c" style="cursor:default"></div>`;
  roWin('itw','Items',`<div class="ro-tabs">${[['item','Item'],['equip','Equip'],['etc','Etc']].map(([k,n])=>`<button data-t="${k}" class="${itTab===k?'on':''}">${n}</button>`).join('')}</div><div class="ro-grid">${cells}</div>`,
    `<span>${ids.length} ชนิด</span><span style="margin-left:auto">Zeny : ${fmt(ZENY)}</span>`);
  w.querySelectorAll('.ro-tabs button').forEach(b=>b.onclick=()=>{itTab=b.dataset.t;buildItems();});addFootBtns(w);};
function addFootBtns(w){const f=w.querySelector('.ft');if(!f||f.querySelector('[data-open]'))return;
  f.insertAdjacentHTML('beforeend',`<span style="flex-basis:100%;display:flex;gap:6px"><button class="rob" data-open="smith">🔨 ช่าง (B)</button><button class="rob" data-open="shop">🛒 ร้าน (N)</button></span>`);
  f.querySelector('[data-open=smith]').onclick=()=>openSmith();f.querySelector('[data-open=shop]').onclick=()=>openShop();}

/* ---------------- windows ---------------- */
const css=document.createElement('style');css.textContent=`
#smw,#shw{left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,96vw);z-index:36}#shw{width:min(460px,96vw)}
.ix-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}.ix-tabs button.on{background:#f5a623;color:#fff}
.ix-note{font:600 11px Mali,sans-serif;color:#8a6a4a;margin-bottom:6px}.ix-warn{color:#c0392b}
.ix-list{max-height:min(52vh,430px);overflow:auto;padding-right:4px}
.ix-row{display:flex;gap:8px;align-items:center;background:#fff;border:2px solid rgba(58,42,31,.18);border-radius:10px;padding:5px 8px;margin-bottom:5px}
.ix-row.sel{border-color:#f5a623;background:#fff8e6}.ix-row .ic{width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center}
.ix-row .mid{flex:1;min-width:0}.ix-row .mid b{font:700 12.5px Mali,sans-serif}.ix-row .mid small{display:block;font:600 10.5px/1.35 Mali,sans-serif;color:#7a5a3a}
.ix-cost{font:600 10.5px Mali,sans-serif;color:#3a6a2a}.ix-cost .no{color:#e2574c}
.ix-grades{display:flex;gap:3px;flex-wrap:wrap;margin-bottom:6px}.ix-grades button{min-width:44px}.ix-grades button.on{background:#f5a623;color:#fff}.ix-grades button.lock{opacity:.45}
.ix-holes{display:flex;gap:6px;margin:6px 0}.ix-hole{width:44px;height:44px;border-radius:50%;border:2.5px solid #3a2a1f;display:flex;align-items:center;justify-content:center;background:#fff;cursor:pointer;font:700 10px Mali}
.ix-hole.empty{background:repeating-linear-gradient(45deg,#fff,#fff 4px,#f1ead8 4px,#f1ead8 8px);cursor:default}.ix-hole.none{opacity:.25;cursor:default}
.ix-orbs{display:flex;flex-wrap:wrap;gap:4px}.ix-orbs .c{position:relative;width:34px;height:34px;border:2px solid rgba(58,42,31,.3);border-radius:8px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ix-orbs .c em{position:absolute;right:1px;bottom:-1px;font:700 9px Mali;color:#e2574c;font-style:normal}`;
document.head.appendChild(css);
for(const id of ['smw','shw'])if(!document.getElementById(id)){const d=document.createElement('div');d.id=id;d.className='ro';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());}
const costHtml=(list,z)=>list.map(([id,n])=>`<span class="${has(id,n)?'':'no'}">${etcName(id)} ${BAG[id]||0}/${n}</span>`).concat(z?[`<span class="${ZENY>=z?'':'no'}">${fmt(z)}z</span>`]:[]).join(' · ');
const canPay=(list,z)=>list.every(([id,n])=>has(id,n))&&ZENY>=(z||0);
const pay=(list,z)=>{for(const [id,n] of list)add(id,-n);ZENY-=z||0;};
const statLine=st=>ST8.filter(k=>st[k]).map(k=>`${STN[k]} ${st[k]>0?'+':''}${st[k]}`).join(' · ');
const repLine=(b,f)=>ST8.filter(k=>b[k]||f[k]).map(k=>{const v=b[k]||0,d=(f[k]||0)-v;return `${STN[k]} ${v}${d?` <b style="color:${d>0?'#2a9a28':'#d23a2a'}">${d>0?'+':''}${d}</b>`:''}`;}).join(' · ');
function itemRow(id,extra='',sel=false){const it=ITEMS[id],S=itemSt(id),eq=Object.values(EQ).includes(id);
  return `<div class="ix-row${sel?' sel':''}" data-pick="${id}"><div class="ic">${itemIcon(it,26)}</div><div class="mid"><b>${it.ref?'+'+it.ref+' ':''}${it.n}</b> <span style="color:#e0a020">${stars(it)}</span>${eq?' <span style="color:#2a9a28;font-size:10px">(สวมอยู่)</span>':''}
    <small>Lv${S.lv} · ${S.st0?'◈ '+repLine(S.st0,S.st):statLine(S.st)}${it.aff&&it.aff.length?' · '+it.aff.map(a=>affLabel(a.k,a.v)).join(' · '):''}${S.sockets?` · รู ${S.orbs.length}/${S.sockets}`:''}${it.trait?` · ✦${TRAITS[it.trait].n}`:''}</small>${extra}</div></div>`;}
function done(t){msg(t);chatLog('sys',t);save();applyStats();buildItems();buildEquip();}
function destroyItem(id){for(const sl in EQ)if(EQ[sl]===id)EQ[sl]=null;const i=INV.indexOf(id);if(i>=0)INV.splice(i,1);delete ITEMS[id];}

/* ---------------- Smith ---------------- */
let smTab='craft',smPick=null,smTown=null,smGrade=null,smFrom=null;
function openSmithOld(){const w=$('#smw');w.classList.add('open');document.querySelectorAll('.ro').forEach(o=>o.style.zIndex=30);w.style.zIndex=37;buildSmith();}
function buildSmithOld(){const w=$('#smw');if(!w.classList.contains('open'))return;const here=townHere();
  if(here&&here!=='cap')smTown=here;else if(!smTown||!TOWNS[smTown])smTown=HOME[CHAR]||'vik';
  if(smGrade===null||!CRAFT_G.includes(smGrade))smGrade=CRAFT_G.filter(x=>gradeLv(x)<=PS.lv).pop()??CRAFT_G[0];
  const T=TOWNS[smTown],test=!(here&&here!=='cap');
  const tabs=[['craft','คราฟต์'],['trait','นิสัยพิเศษ'],['refine','ตีบวก'],['move','ย้ายบวก'],['socket','เจาะรู/ยัดหิน'],['merge','รวมหิน']];
  let note=test?`<div class="ix-note ix-warn">${here==='cap'?'เมืองหลวงไม่มีช่าง (เมืองค้าขาย)':'ไม่ได้อยู่ในเมือง'} — โหมดทดสอบ: เลือกช่าง ${Object.keys(TOWNS).map(r=>`<button class="rob" data-town="${r}" style="${r===smTown?'background:#f5a623;color:#fff':''}">${TOWNS[r].name}</button>`).join(' ')}</div>`:'';
  note+=`<div class="ix-note">ช่าง<b>${T.name}</b> · ไอเทมเมืองนี้ได้ <b>${STN[T.pair[0]]} + ${STN[T.pair[1]]}</b> (+${STN[T.third]}) · Zeny <b>${fmt(ZENY)}</b></div>`;
  let body='',owned=ownedIds();
  if(smTab==='craft'){const g=smGrade,cost=craftCost(smTown,g),cz=COST.craftZ(g),cr=has('trait_'+smTown),cb=csBonusText(smTown,g);
    body=`<div class="ix-grades">${CRAFT_G.map(i=>`<button class="rob ${i===g?'on':''} ${gradeLv(i)>PS.lv?'lock':''}" data-grade="${i}">เซ็ท Lv${gradeLv(i)}</button>`).join('')}</div>
      <div class="ix-note">เซ็ทคราฟ Lv${gradeLv(g)} · ใช้ <b>${etcName(matA(smTown,g-2))}</b> + <b>${etcName(matA(smTown,g-1))}</b> (มอน Lv${(g-2)*10}–${g*10-1}) + ของหายาก <b>${etcName(matB(smTown,g))}</b> (มอน Lv${g*10}–${g*10+9} / บอส) ในภูมิภาค${T.name} · <b>ทุกครั้งที่คราฟต์ สุ่มสถานะพิเศษ 1–3 ช่อง</b><br><b style="color:#c2541c">โบนัสเซ็ท</b>: ${cb}</div>`+
      GEAR.map(sl=>`<div class="ix-row"><div class="mid"><b>${craftName(smTown,sl,g)}</b> <small>${SLOTS[sl].nm} · Lv${gradeLv(g)} · ${statLine(craftStats(smTown,sl,g,sl==='rhand'&&classWeapon().magic))} · สถานะพิเศษที่ออกได้: ${Object.keys(AFF).filter(k=>AFF[k].s.includes(SLOTS[sl].code)).map(k=>AFF[k].n).join(', ')}</small><div class="ix-cost">${costHtml(cost,cz)}</div></div>
        <button class="rob" data-craft="${sl}" ${canPay(cost,cz)?'':'disabled'}>คราฟต์</button>${cr?`<button class="rob" data-craft="${sl}" data-wt="1" ${canPay(cost,cz)?'':'disabled'} title="ใช้ผลึกนิสัย 1 ก้อน">+นิสัย</button>`:''}</div>`).join('');}
  else if(smTab==='trait'){const L=owned.filter(id=>ITEMS[id].crafted&&ITEMS[id].town===smTown),cost=[['trait_'+smTown,1]];
    body=`<div class="ix-note">นิสัยของเมืองนี้ (สุ่ม 1 แบบ · แรงขึ้นตามระดับไอเทม ×1 → ×3): ${Object.entries(TRAITS).filter(([k,v])=>v.town===smTown).map(([k,v])=>`<b>${v.n}</b> — ${v.d(1)}`).join(' · ')}</div>`+
      (L.length?L.map(id=>itemRow(id,`<div class="ix-cost">${costHtml(cost,COST.traitZ)}</div><button class="rob" data-trait="${id}" ${canPay(cost,COST.traitZ)?'':'disabled'}>${ITEMS[id].trait?'สุ่มนิสัยใหม่':'ใส่นิสัย'}</button>`)).join(''):`<div class="ix-note">ยังไม่มีไอเทมของช่าง${T.name}</div>`);}
  else if(smTab==='refine'){const g=has('guard');
    body=`<div class="ix-note">+1 ถึง +5 สำเร็จเสมอ · ตั้งแต่ +6 พลาดแล้ว<b class="ix-warn">ของแตก</b> · ${g?`<label><input type="checkbox" id="useGuard"> ใช้หินกันแตก (มี ${BAG.guard}) — พลาดแล้วลดบวก 1 แทน</label>`:'หินกันแตกซื้อได้ที่ร้านเมืองหลวง'}</div>`+
      owned.map(id=>{const it=ITEMS[id],r=it.ref||0,t=Math.max(1,Math.min(4,it.tier||it.wlv||1));if(r>=10)return itemRow(id,'<small>ตีบวกสูงสุดแล้ว (+10)</small>');
        const cost=[['ore'+t,1]],z=COST.refineZ(t,r),gain=it.slot==='rhand'?`พลังโจมตี/เวท +${REF_ATK[Math.min(4,it.wlv||t)]}`:`DEF รวม +${armorRefDef({ref:r+1,tier:it.tier||1})}`;
        return itemRow(id,`<small>+${r} → +${r+1} · โอกาส <b>${Math.round(REFINE_CHANCE[r]*100)}%</b> · ${gain}</small><div class="ix-cost">${costHtml(cost,z)}</div><button class="rob" data-ref="${id}" ${canPay(cost,z)?'':'disabled'}>ตีบวก</button>`);}).join('');}
  else if(smTab==='move'){const src=owned.filter(id=>(ITEMS[id].ref||0)>0&&!ITEMS[id].broken);if(!src.includes(smFrom))smFrom=src[0]||null;const f=ITEMS[smFrom];
    body=`<div class="ix-note">ย้ายระดับบวกจากของเก่าไปของใหม่ช่องเดียวกัน · ของใหม่ได้บวก <b>−1</b> จากของเดิม · ของเก่าเหลือ +0 · ใช้ Zeny เท่านั้น</div>`+
      (src.length?`<div style="display:flex;gap:8px"><div class="ix-list" style="flex:1"><b>ย้ายจาก</b>${src.map(id=>itemRow(id,'',id===smFrom).replace('data-pick','data-from')).join('')}</div>
        <div class="ix-list" style="flex:1"><b>ไปที่</b>${f?owned.filter(id=>id!==smFrom&&ITEMS[id].slot===f.slot&&(ITEMS[id].ref||0)<f.ref-1).map(id=>{const z=COST.moveZ(ITEMS[id].grade??((ITEMS[id].tier||1)-1)*3,f.ref);
          return itemRow(id,`<small>+${ITEMS[id].ref||0} → +${f.ref-1}</small><div class="ix-cost">${costHtml([],z)}</div><button class="rob" data-move="${id}" ${ZENY>=z?'':'disabled'}>ย้าย</button>`);}).join('')||'<div class="ix-note">ไม่มีของช่องเดียวกันที่รับได้</div>':''}</div></div>`:'<div class="ix-note">ยังไม่มีของที่ตีบวกไว้</div>');}
  else if(smTab==='socket'){if(!smPick||!ITEMS[smPick]||!owned.includes(smPick))smPick=owned[0];
    const S=smPick&&itemSt(smPick),it=ITEMS[smPick],orbs=Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind==='orb');
    body=`<div class="ix-note">เลือกไอเทม → เจาะรูด้วยสว่าน (สุ่ม 1 รู 45% · 2 รู 30% · 3 รู 18% · 4 รู 7% — อาวุธ/เกราะสูงสุด 4 รู ชิ้นอื่นสูงสุด 2 รู) → คลิกหินด้านล่างเพื่อยัดลงรูว่าง (ค่าสุ่มตอนยัด) · คลิกหินที่ยัดแล้วเพื่อถอด (มีคีม = หินคืน, ไม่มี = หินแตก)</div>
      <div style="display:flex;gap:8px"><div class="ix-list" style="flex:1">${owned.map(id=>itemRow(id,'',id===smPick)).join('')}</div>
      <div style="width:230px">${it?`<b>${it.n}</b><div class="ix-holes">${[0,1,2,3].map(i=>i<S.orbs.length?`<div class="ix-hole" data-unsock="${i}" style="background:${ORB_COL[S.orbs[i].s]}" title="ถอดหิน">${STN[S.orbs[i].s]}<br>+${S.orbs[i].v}</div>`:i<S.sockets?'<div class="ix-hole empty" title="รูว่าง"></div>':'<div class="ix-hole none"></div>').join('')}</div>
      <button class="rob" data-drill="1" ${has('drill')?'':'disabled'}>เจาะรู (สว่าน ${BAG.drill||0})</button> <small>คีม ${BAG.pliers||0}</small>
      <div style="margin-top:6px;font-weight:700">หินออฟในกระเป๋า</div><div class="ix-orbs">${orbs.length?orbs.map(k=>`<div class="c" data-sock="${k}" title="${ETC[k].th} ×${BAG[k]} — ${ETC[k].d}">${etcIcon(k,26)}<em>${BAG[k]}</em></div>`).join(''):'<small>ยังไม่มีหิน (ดรอปจากมอนทุกตัว)</small>'}</div>`:''}</div></div>`;}
  else if(smTab==='merge'){body=`<div class="ix-note">หินขั้นเดียวกัน 3 ก้อน (ชนิดใดก็ได้) → หินขั้นถัดไป 1 ก้อน ชนิดสุ่ม · ใช้หินที่มีมากที่สุดก่อน</div>`+
      [1,2,3].map(t=>{const n=Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind==='orb'&&ETC[k].tier===t).reduce((s,k)=>s+BAG[k],0);
        return `<div class="ix-row"><div class="mid"><b>หินขั้น ${t} → ขั้น ${t+1}</b><small>มีหินขั้น ${t} รวม ${n} ก้อน</small><div class="ix-cost"><span class="${n>=3?'':'no'}">หินขั้น ${t} ${n}/3</span> · <span class="${ZENY>=COST.mergeZ(t)?'':'no'}">${fmt(COST.mergeZ(t))}z</span></div></div><button class="rob" data-merge="${t}" ${n>=3&&ZENY>=COST.mergeZ(t)?'':'disabled'}>รวม</button></div>`;}).join('');}
  roWin('smw','🔨 ช่างตีเหล็ก',`${note}<div class="ix-tabs">${tabs.map(([k,n])=>`<button class="rob ${smTab===k?'on':''}" data-tab="${k}">${n}</button>`).join('')}</div>${smTab==='socket'||smTab==='move'?body:`<div class="ix-list">${body}</div>`}`);
  const q=(s,f)=>w.querySelectorAll(s).forEach(b=>b.onclick=ev=>{ev.stopPropagation();f(b);});
  q('[data-tab]',b=>{if(b.dataset.tab==='refine'){$('#smw').classList.remove('open');openRefine();return;}smTab=b.dataset.tab;buildSmith();});   /* refine has its own 12 Tails-style window */
  q('[data-town]',b=>{smTown=b.dataset.town;buildSmith();});q('[data-grade]',b=>{smGrade=+b.dataset.grade;buildSmith();});
  q('[data-craft]',b=>{if(eqFull()){msg(`กระเป๋าอุปกรณ์เต็ม (${BAG_EQ_MAX}) — ฝากของในคลังก่อน`);return;}const sl=b.dataset.craft,g=smGrade,cost=craftCost(smTown,g),cz=COST.craftZ(g);if(b.dataset.wt)cost.push(['trait_'+smTown,1]);if(!canPay(cost,cz))return;pay(cost,cz);
    const tr=b.dataset.wt?rollTrait(smTown):null,id=craftItem(smTown,sl,g,tr),it=ITEMS[id];INV.push(id);
    done(`คราฟต์สำเร็จ: ${it.n} ${stars(it)} — ${it.aff.map(a=>affLabel(a.k,a.v)).join(' · ')}${tr?' · ✦'+TRAITS[tr].n:''}`);buildSmith();});
  q('[data-trait]',b=>{const id=b.dataset.trait,cost=[['trait_'+smTown,1]];if(!canPay(cost,COST.traitZ))return;pay(cost,COST.traitZ);ITEMS[id].trait=rollTrait(smTown,ITEMS[id].trait);done(`${ITEMS[id].n} ได้นิสัย ✦${TRAITS[ITEMS[id].trait].n}`);buildSmith();});
  q('[data-ref]',b=>doRefine(b.dataset.ref));
  q('[data-from]',b=>{smFrom=b.dataset.from;buildSmith();});
  q('[data-move]',b=>{const to=ITEMS[b.dataset.move],f=ITEMS[smFrom];if(!to||!f)return;const z=COST.moveZ(to.grade??((to.tier||1)-1)*3,f.ref);if(ZENY<z)return;ZENY-=z;to.ref=f.ref-1;f.ref=0;done(`ย้ายบวกสำเร็จ: ${to.n} +${to.ref}`);buildSmith();});
  q('[data-pick]',b=>{if(smTab!=='socket')return;smPick=b.dataset.pick;buildSmith();});
  q('[data-drill]',()=>doDrill(smPick));q('[data-sock]',b=>doSocket(smPick,b.dataset.sock));q('[data-unsock]',b=>doUnsocket(smPick,+b.dataset.unsock));
  q('[data-merge]',b=>doMerge(+b.dataset.merge));}
function rollTrait(town,not){const L=Object.keys(TRAITS).filter(k=>TRAITS[k].town===town&&k!==not);return L[Math.floor(Math.random()*L.length)];}
function doRefine(id){const it=ITEMS[id];if(!it)return;const r=it.ref||0,t=Math.max(1,Math.min(4,it.tier||it.wlv||1)),cost=[['ore'+t,1]],z=COST.refineZ(t,r);if(r>=10||!canPay(cost,z))return;
  const g=$('#useGuard')&&$('#useGuard').checked&&has('guard');pay(cost,z);if(g&&r>=5)add('guard',-1);
  if(Math.random()<REFINE_CHANCE[r]){it.ref=r+1;done(`ตีบวกสำเร็จ! ${it.n} +${it.ref}`);addFx(new DText({x:player.x,y:player.y,z:90,text:'+'+it.ref+' SUCCESS',color:'#ffd36a',size:15,life:1.2}));}
  else if(g){it.ref=Math.max(0,r-1);done(`ตีบวกพลาด — หินกันแตกช่วยไว้ ${it.n} เหลือ +${it.ref}`);}
  else{const n=it.n;destroyItem(id);done(`ตีบวกพลาด… ${n} แตกหายไป`);addFx(new DText({x:player.x,y:player.y,z:90,text:'BROKEN',color:'#e2574c',size:15,life:1.2}));}
  buildSmith();}
function doDrill(id){const it=ITEMS[id];if(!it||!has('drill'))return;if((it.orbs||[]).length&&!confirm(`เจาะใหม่แล้วหินที่ยัดใน ${it.n} จะหายหมด ยืนยัน?`))return;
  add('drill',-1);let x=Math.random()*100,n=1;for(const [k,w] of DRILL_W){if(x<w){n=k;break;}x-=w;}n=Math.min(n,holeCap(it));it.sockets=n;it.orbs=[];done(`เจาะรู ${it.n}: ได้ ${n} รู`);buildSmith();}
function doSocket(id,orb){const it=ITEMS[id],E=ETC[orb];if(!it||!E||!has(orb))return;const S=itemSt(id);if(S.orbs.length>=S.sockets){msg('ไม่มีรูว่าง (เจาะรูก่อน)');return;}
  const [a,b]=ORB_RANGE(E.tier),v=a+Math.floor(Math.random()*(b-a+1));add(orb,-1);it.orbs=[...S.orbs,{s:E.stat,v,t:E.tier,n2:1}];done(`ยัด ${E.th} ลง ${it.n}: ${STN[E.stat]} +${v}`);buildSmith();}
function doUnsocket(id,i){const it=ITEMS[id];if(!it)return;const S=itemSt(id),o=S.orbs[i];if(!o)return;const t=o.t||Math.max(1,Math.ceil(o.v/5));
  if(has('pliers')){add('pliers',-1);add(`orb_${o.s}_${t}`,1);}else if(!confirm('ไม่มีคีมถอดหิน — ถอดแล้วหินจะแตก ยืนยัน?'))return;
  it.orbs=S.orbs.filter((_,j)=>j!==i);done(`ถอดหิน ${STN[o.s]} +${o.v} ออกจาก ${it.n}`);buildSmith();}
function doMerge(t){const L=Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind==='orb'&&ETC[k].tier===t);let need=3;if(L.reduce((s,k)=>s+BAG[k],0)<3||ZENY<COST.mergeZ(t))return;
  L.sort((a,b)=>BAG[b]-BAG[a]);for(const k of L){while(need>0&&BAG[k]){add(k,-1);need--;}}ZENY-=COST.mergeZ(t);
  const s=Object.keys(STN)[Math.floor(Math.random()*8)];add(`orb_${s}_${t+1}`,1);done(`รวมหินสำเร็จ: ได้ ${ETC[`orb_${s}_${t+1}`].th}`);buildSmith();}

/* ---------------- Shop ---------------- */
let shTab='buy';
const FOODS=['food_atk','food_def','food_vit','food_agi','food_tal','food_cha'];
const SHOP_FULL=['hp1','hp2','hp3','hp4','sp1','sp2','sp3',...FOODS,'manual','ret','capscroll','wing','ore1','ore2','ore3','ore4','drill','pliers','guard'],
      SHOP_BASIC=['hp1','hp2','sp1','sp2',...FOODS,'ret','capscroll','wing','ore1','ore2','drill'];
function openShop(){const w=$('#shw');w.classList.add('open');document.querySelectorAll('.ro').forEach(o=>o.style.zIndex=30);w.style.zIndex=37;buildShop();}
function buildShop(){const w=$('#shw');if(!w.classList.contains('open'))return;const here=townHere(),cap=here==='cap',test=!here;
  const list=cap||test?SHOP_FULL:SHOP_BASIC,sellMul=cap?1.2:1;
  let body='';if(shTab==='buy')body=list.map(id=>`<div class="ix-row"><div class="ic">${etcIcon(id)}</div><div class="mid"><b>${ETC[id].th}</b><small>${ETC[id].d||ETC[id].n}</small></div><b>${fmt(ETC[id].price)}z</b>
      <button class="rob" data-buy="${id}" data-n="1" ${ZENY>=ETC[id].price?'':'disabled'}>×1</button><button class="rob" data-buy="${id}" data-n="10" ${ZENY>=ETC[id].price*10?'':'disabled'}>×10</button></div>`).join('');
  else{const L=Object.keys(BAG).filter(k=>ETC[k]&&(ETC[k].kind==='mat'||ETC[k].kind==='orb'));
    body=(L.length?L.map(id=>{const p=Math.round(ETC[id].price*.5*sellMul);return `<div class="ix-row"><div class="ic">${etcIcon(id)}</div><div class="mid"><b>${ETC[id].th}</b><small>มี ${BAG[id]} · ขายชิ้นละ ${fmt(p)}z</small></div>
      <button class="rob" data-sell="${id}" data-n="1">ขาย 1</button><button class="rob" data-sell="${id}" data-n="${BAG[id]}">ขายหมด</button></div>`;}).join(''):'<div class="ix-note">ไม่มีของขาย</div>');}
  roWin('shw',cap?'🛒 ตลาดเมืองหลวง':here?'🛒 ร้านค้าเมือง':'🛒 ร้านค้า',`<div class="ix-note">${cap?'เมืองหลวง = ศูนย์กลางการค้า: ขายของครบทุกอย่าง และรับซื้อวัตถุดิบแพงกว่า 20%':here?'ร้านเมืองเกิด: ของพื้นฐาน (ของหายากต้องไปเมืองหลวง)':'<span class="ix-warn">ไม่ได้อยู่ในเมือง — โหมดทดสอบ (ร้านเต็ม)</span>'} · Zeny <b>${fmt(ZENY)}</b></div>
    <div class="ix-tabs"><button class="rob ${shTab==='buy'?'on':''}" data-stab="buy">ซื้อ</button><button class="rob ${shTab==='sell'?'on':''}" data-stab="sell">ขายวัตถุดิบ/หิน</button></div><div class="ix-list">${body}</div>`);
  w.querySelectorAll('[data-stab]').forEach(b=>b.onclick=()=>{shTab=b.dataset.stab;buildShop();});
  w.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const id=b.dataset.buy,n=+b.dataset.n,p=ETC[id].price*n;if(ZENY<p)return;ZENY-=p;add(id,n);done(`ซื้อ ${ETC[id].th} ×${n} (${fmt(p)}z)`);buildShop();buildSmith();});
  w.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const id=b.dataset.sell,n=Math.min(+b.dataset.n,BAG[id]||0),p=Math.round(ETC[id].price*.5*sellMul)*n;if(!n)return;add(id,-n);ZENY+=p;done(`ขาย ${ETC[id].th} ×${n} ได้ ${fmt(p)}z`);buildShop();});}

/* ---------------- Storage (H) — shared by all heroes, in any town (capital included) ---------------- */
const STKEY='af_storage_v1',STO={equip:{},etc:{}},STO_EQ_MAX=300;
try{Object.assign(STO,JSON.parse(localStorage.getItem(STKEY)||'{}'));}catch(e){}
const saveSto=()=>{try{localStorage.setItem(STKEY,JSON.stringify(STO));}catch(e){}};
let kfTab='equip';
function openStorage(){const w=$('#kfw');if(!townHere()&&!(window.AFProgress&&AFProgress.mode==='test')){msg('คลังใช้ได้ในเมืองเท่านั้น');return;}
  w.classList.add('open');document.querySelectorAll('.ro').forEach(o=>o.style.zIndex=30);w.style.zIndex=37;buildStorage();}
function buildStorage(){const w=$('#kfw');if(!w||!w.classList.contains('open'))return;let L='',R='';
  if(kfTab==='equip'){L=INV.map(id=>itemRow(id,`<button class="rob" data-dep="${id}">ฝาก →</button>`)).join('')||'<div class="ix-note">ว่าง</div>';
    R=Object.keys(STO.equip).map(k=>{const it=STO.equip[k];return `<div class="ix-row"><div class="ic">${itemIcon(it,26)}</div><div class="mid"><b>${it.ref?'+'+it.ref+' ':''}${it.n}</b> <span style="color:#e0a020">${stars(it)}</span><small>Lv${it.lvReq||1}${it.aff&&it.aff.length?' · '+it.aff.map(a=>affLabel(a.k,a.v)).join(' · '):''}</small></div><button class="rob" data-wd="${k}">← ถอน</button></div>`;}).join('')||'<div class="ix-note">ว่าง</div>';}
  else{L=Object.keys(BAG).filter(k=>ETC[k]).map(k=>`<div class="ix-row"><div class="ic">${etcIcon(k)}</div><div class="mid"><b>${ETC[k].th}</b><small>×${BAG[k]}</small></div><button class="rob" data-dep1="${k}">1</button><button class="rob" data-depa="${k}">ฝากหมด →</button></div>`).join('')||'<div class="ix-note">ว่าง</div>';
    R=Object.keys(STO.etc).filter(k=>ETC[k]).map(k=>`<div class="ix-row"><div class="ic">${etcIcon(k)}</div><div class="mid"><b>${ETC[k].th}</b><small>×${STO.etc[k]}</small></div><button class="rob" data-wd1="${k}">1</button><button class="rob" data-wda="${k}">← ถอนหมด</button></div>`).join('')||'<div class="ix-note">ว่าง</div>';}
  roWin('kfw','📦 คลังเก็บของ (ใช้ร่วมทุกฮีโร่)',`<div class="ix-tabs"><button class="rob ${kfTab==='equip'?'on':''}" data-kt="equip">อุปกรณ์</button><button class="rob ${kfTab==='etc'?'on':''}" data-kt="etc">ของ/วัตถุดิบ</button></div>
    <div style="display:flex;gap:8px"><div style="flex:1"><b>กระเป๋า</b> <small>${kfTab==='equip'?`${INV.length}/${BAG_EQ_MAX}`:`${bagKinds()}/${BAG_KINDS} ชนิด`}</small><div class="ix-list">${L}</div></div>
    <div style="flex:1"><b>คลัง</b> <small>${kfTab==='equip'?`${Object.keys(STO.equip).length}/${STO_EQ_MAX}`:`${Object.keys(STO.etc).length} ชนิด`}</small><div class="ix-list">${R}</div></div></div>`);
  const q=(s,f)=>w.querySelectorAll(s).forEach(b=>b.onclick=ev=>{ev.stopPropagation();f(b.dataset);buildStorage();buildItems();save();saveSto();});
  q('[data-kt]',d=>{kfTab=d.kt;});
  q('[data-dep]',d=>{if(Object.keys(STO.equip).length>=STO_EQ_MAX){msg('คลังเต็ม');return;}const it=ITEMS[d.dep];STO.equip['s'+Date.now()+Math.floor(Math.random()*1e4)]=it;INV.splice(INV.indexOf(d.dep),1);delete ITEMS[d.dep];});
  q('[data-wd]',d=>{if(eqFull()){msg('กระเป๋าอุปกรณ์เต็ม');return;}const it=STO.equip[d.wd];const id='i'+(++SEQ);ITEMS[id]=it;INV.push(id);delete STO.equip[d.wd];});
  const mv=(from,to,k,n,toBag)=>{n=Math.min(n,from[k]||0);if(!n)return;const got=toBag?add(k,n):n;if(!toBag)to[k]=(to[k]||0)+n;from[k]-=got;if(from[k]<=0)delete from[k];if(toBag&&got<n)msg('กระเป๋าเต็ม');};
  q('[data-dep1]',d=>{STO.etc[d.dep1]=(STO.etc[d.dep1]||0)+1;add(d.dep1,-1);});
  q('[data-depa]',d=>{STO.etc[d.depa]=(STO.etc[d.depa]||0)+BAG[d.depa];delete BAG[d.depa];});
  q('[data-wd1]',d=>mv(STO.etc,BAG,d.wd1,1,true));q('[data-wda]',d=>mv(STO.etc,BAG,d.wda,STO.etc[d.wda],true));}
if(!document.getElementById('kfw')){const d=document.createElement('div');d.id='kfw';d.className='ro';d.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,96vw);z-index:36';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());}

/* ---------------- new game (Lv1): wipe this hero's items, give the starter kit ---------------- */
function newGame(){const home=HOME[CHAR]||'vik',w=craftItem(home,'rhand',0),a=craftItem(home,'armor',0);   // craft first: the weapon type is read from the hero's current weapon
  for(const id of ownedIds())delete ITEMS[id];for(const sl in EQ)EQ[sl]=null;INV.length=0;for(const k in BAG)delete BAG[k];ZENY=500;BUFF.food=null;BUFF.manual=0;
  EQ.rhand=w;EQ.armor=a;
  add('hp1',20);add('sp1',10);add('ret',2);add('wing',5);add('drill',1);save();applyStats();}

/* ---------------- keys, town hint, init ---------------- */
addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA/.test(e.target.tagName))return;const k=e.key.toLowerCase();
  if(k==='b'){const w=$('#smw');if(w.classList.contains('open'))w.classList.remove('open');else openSmith();}
  else if(k==='n'){const w=$('#shw');if(w.classList.contains('open'))w.classList.remove('open');else openShop();}
  else if(k==='h'){const w=$('#kfw');if(w.classList.contains('open'))w.classList.remove('open');else openStorage();}
  else if(k==='f'||k==='v'){const id=bestPot(k==='f'?'hp':'sp');if(id)useItem(id);else msg(k==='f'?'ไม่มียา HP':'ไม่มียา SP');}
  else if(e.key==='Escape'){$('#smw').classList.remove('open');$('#shw').classList.remove('open');$('#kfw').classList.remove('open');}});
const _enterMap=enterMap;
enterMap=function(id,sp){_enterMap(id,sp);const t=townHere();if(t==='cap')chatLog('sys','เมืองหลวง: ตลาดกลาง — <b>N</b> ร้านค้า · <b>H</b> คลัง');else if(t&&!(window.AF_ROOM_TOWN&&AF_ROOM_TOWN[curMap]))chatLog('sys',`${TOWNS[t].name}: <b>B</b> ช่างตีเหล็ก · <b>N</b> ร้านค้า · <b>H</b> คลัง`);buildSmith();buildShop();buildStorage();};
load();applyStats();player.hp=player.maxHp;save();
/* =====================================================================
   12 TAILS-STYLE WINDOWS: Refine (ตีบวก) + Central Market (ตลาดกลาง)
   Shared look: navy panel, gold trim, pale-blue inner boxes, round slots, orange buttons.
   ===================================================================== */
const tcss=document.createElement('style');tcss.textContent=`
.ttw{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:58;display:none;font:600 12.5px Mali,sans-serif;color:#24304f;user-select:none;-webkit-user-select:none;
  background:linear-gradient(#34508c,#22335e);border:3px solid #e2b64e;border-radius:16px;box-shadow:0 0 0 2px #6b4a14,0 10px 28px rgba(0,0,0,.55);padding:0 8px 8px}
.ttw.open{display:block}
.ttw .tth{position:relative;margin:0 -8px 8px;height:36px;line-height:36px;text-align:center;border-radius:12px 12px 0 0;cursor:move;
  background:linear-gradient(#ffd77a,#f0a52c 55%,#d9861a);border-bottom:2px solid #8a5a14;font:800 16px Mali,sans-serif;color:#fff;text-shadow:0 2px 0 #8a4a10,0 0 4px #8a4a10;letter-spacing:.5px}
.ttw .ttx{position:absolute;right:8px;top:6px;width:24px;height:24px;border-radius:50%;border:2px solid #7a1e10;background:radial-gradient(circle at 35% 30%,#ff9a80,#e2402a 60%,#a82410);color:#fff;font:900 13px/19px Mali;cursor:pointer;text-shadow:0 1px 0 #7a1e10;padding:0}
.ttp{background:linear-gradient(#f4f8ff,#dfeafb);border:2px solid #9db8e6;border-radius:12px;padding:8px;box-shadow:inset 0 2px 0 #fff}
.ttp h4{margin:0 0 6px;font:800 12.5px Mali;color:#2d4a8a;display:flex;align-items:center;gap:6px}
.tts{position:relative;width:46px;height:46px;border-radius:11px;border:2px solid #7d9ccf;background:radial-gradient(circle at 50% 35%,#fff,#d4e3f8);display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none}
.tts:hover{border-color:#f0a52c}.tts.sel{border-color:#f0a52c;box-shadow:0 0 0 2px #ffd77a,0 0 10px #ffb02e}.tts.empty{cursor:default;opacity:.55}
.tts em{position:absolute;right:2px;bottom:0;font:800 10px Mali;color:#fff;font-style:normal;text-shadow:0 0 2px #000,0 0 2px #000}
.tts i{position:absolute;left:2px;top:0;font:800 10px Mali;color:#ffd36a;font-style:normal;text-shadow:0 0 2px #000,0 0 2px #000}
.tts b.eq{position:absolute;left:-4px;top:-5px;background:#2a9a28;color:#fff;border-radius:6px;font:800 8.5px/12px Mali;padding:0 3px}
.ttb{font:800 13px Mali,sans-serif;color:#fff;text-shadow:0 1px 0 #8a4a10,0 0 3px #8a4a10;background:linear-gradient(#ffc163,#f08a1e 60%,#d8700c);border:2px solid #8a4a10;border-radius:11px;padding:6px 14px;cursor:pointer;box-shadow:0 3px 0 #8a4a10}
.ttb:hover:not(:disabled){filter:brightness(1.08)}.ttb:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 #8a4a10}
.ttb:disabled{background:linear-gradient(#c9ced8,#a3a9b6);border-color:#6a7080;box-shadow:0 3px 0 #6a7080;text-shadow:0 1px 0 #555;cursor:default}
.ttb.blue{background:linear-gradient(#8fd0ff,#3d8fe0 60%,#2a6fc0);border-color:#1d4a8a;box-shadow:0 3px 0 #1d4a8a;text-shadow:0 1px 0 #1d4a8a}
.ttb.sm{padding:3px 9px;font-size:11.5px;border-radius:9px}
.tttab{display:flex;gap:4px;margin-bottom:8px}.tttab button{flex:1;font:800 12.5px Mali;color:#cfe0ff;background:linear-gradient(#3a5592,#2a3f70);border:2px solid #5a78b8;border-radius:10px 10px 4px 4px;padding:6px 4px;cursor:pointer;position:relative}
.tttab button.on{color:#5a3a08;background:linear-gradient(#fff3c4,#ffd77a);border-color:#e2b64e}.tttab button sup{position:absolute;right:6px;top:-6px;background:#e2402a;color:#fff;border-radius:9px;padding:0 5px;font:800 10px/16px Mali}
.ttin{font:700 12.5px Mali;color:#24304f;border:2px solid #9db8e6;border-radius:9px;padding:4px 8px;background:#fff;outline:none}.ttin:focus{border-color:#f0a52c}
.ttnote{font:600 11px Mali;color:#5a6a8a}.ttwarn{color:#d23a2a}.ttgood{color:#2a9a28}
/* ---- refine ---- */
#rfw{width:min(660px,96vw)}#rfw .rfgrid{display:grid;grid-template-columns:5fr 7fr;gap:8px}
#rfw .inv{display:grid;grid-template-columns:repeat(5,46px);gap:6px;max-height:330px;overflow:auto;padding:2px}
#rfw .stage{position:relative;height:186px;border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 100%,#ffb35a 0%,#a8501c 30%,#3a2030 70%,#1f1626 100%);border:2px solid #6b4a14;box-shadow:inset 0 0 30px rgba(0,0,0,.6)}
#rfw .anvil{position:absolute;left:50%;bottom:10px;transform:translateX(-50%)}
#rfw .big{position:absolute;left:50%;top:22px;transform:translateX(-50%);width:84px;height:84px;border-radius:50%;border:3px solid #ffd77a;background:radial-gradient(circle at 50% 40%,#fffbe8,#e8d0a0 70%,#b08440);display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px #ffb02e,inset 0 0 10px rgba(120,70,10,.5)}
#rfw .big.none{border-style:dashed;opacity:.6;box-shadow:none;color:#6b4a14;font:700 11px Mali;text-align:center}
#rfw .lv{position:absolute;left:0;right:0;top:4px;text-align:center;font:900 15px Mali;color:#fff;text-shadow:0 2px 0 #000,0 0 6px #000}
#rfw .lv span{color:#ffd36a}
#rfw .hammer{position:absolute;right:92px;top:18px;width:62px;transform-origin:85% 85%;transform:rotate(25deg);opacity:0;pointer-events:none}
#rfw .stage.strike .hammer{opacity:1;animation:rfham .36s ease-in 3}
@keyframes rfham{0%{transform:rotate(35deg)}70%{transform:rotate(-38deg)}100%{transform:rotate(35deg)}}
#rfw .stage.strike .big{animation:rfshake .36s 3}
@keyframes rfshake{0%,60%,100%{transform:translateX(-50%)}72%{transform:translate(calc(-50% - 3px),2px)}84%{transform:translate(calc(-50% + 3px),-1px)}}
#rfw .spk{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff3a0;box-shadow:0 0 6px #ffb02e;pointer-events:none}
#rfw .res{position:absolute;left:0;right:0;top:66px;text-align:center;font:900 30px Mali;opacity:0;pointer-events:none;letter-spacing:1px}
#rfw .res.on{animation:rfres 1.4s ease-out forwards}
@keyframes rfres{0%{opacity:0;transform:scale(.4)}18%{opacity:1;transform:scale(1.25)}30%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-14px)}}
#rfw .res.ok{color:#fff3a0;text-shadow:0 0 10px #ffb02e,0 3px 0 #8a4a10}#rfw .res.fail{color:#cfd8ea;text-shadow:0 3px 0 #333,0 0 8px #000}#rfw .res.broke{color:#ff7a6a;text-shadow:0 3px 0 #5a0a0a,0 0 10px #000}
#rfw .stage.flash:after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 35%,rgba(255,245,180,.95),rgba(255,200,80,0) 60%);animation:rffl .6s forwards}
@keyframes rffl{from{opacity:1}to{opacity:0}}
#rfw .big.shatter{animation:rfsh .7s forwards}@keyframes rfsh{0%{filter:none}30%{transform:translateX(-50%) scale(1.1);filter:brightness(2)}100%{transform:translateX(-50%) scale(.6) rotate(12deg);opacity:0;filter:grayscale(1)}}
#rfw .prog{height:8px;border-radius:5px;background:#1f1626;border:1px solid #6b4a14;overflow:hidden;margin-top:6px}#rfw .prog div{height:100%;width:0;background:linear-gradient(90deg,#ffd77a,#ff8a1e)}
#rfw .stage.strike~.prog div{transition:width 1.08s linear;width:100%}
#rfw .mats{display:flex;gap:8px;align-items:center;margin-top:8px}#rfw .mats .lab{font:700 10.5px Mali;color:#5a6a8a;text-align:center;margin-top:2px}
#rfw .rate{font:900 26px Mali;line-height:1}#rfw .bar{height:10px;border-radius:6px;background:#c8d6ee;overflow:hidden;margin:4px 0}#rfw .bar div{height:100%}
#rfw .stat{display:flex;justify-content:space-between;font:700 12px Mali;background:#fff;border-radius:8px;padding:4px 8px;margin-top:6px;border:1px solid #c8d6ee}
/* ---- market ---- */
#mkw{width:min(820px,97vw)}#mkw .mkgrid{display:grid;grid-template-columns:118px 1fr;gap:8px}
#mkw .cats{display:flex;flex-direction:column;gap:4px}#mkw .cats button{text-align:left;font:800 12px Mali;color:#2d4a8a;background:#fff;border:2px solid #b8cdee;border-radius:9px;padding:6px 8px;cursor:pointer}
#mkw .cats button.on{background:linear-gradient(#fff3c4,#ffd77a);border-color:#e2b64e;color:#5a3a08}
#mkw .mkbar{display:flex;gap:6px;align-items:center;margin-bottom:6px}
#mkw .tbl{max-height:min(48vh,380px);overflow:auto;border-radius:9px;background:#fff;border:2px solid #b8cdee}
#mkw .row{display:grid;grid-template-columns:52px 1fr 110px 54px 104px 70px;align-items:center;gap:6px;padding:4px 6px;border-bottom:1px solid #e3ecf9}
#mkw .row.h{position:sticky;top:0;background:#e8f0fc;font:800 11px Mali;color:#5a6a8a;z-index:1;padding:5px 6px}
#mkw .row:nth-child(even):not(.h){background:#f6f9ff}#mkw .row:hover:not(.h){background:#fff6dc}
#mkw .nm b{display:block;font:800 12.5px Mali}#mkw .nm small{font:600 10.5px Mali;color:#7a8aa8}
#mkw .sel{font:700 11px Mali;color:#4a5a7a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mkw .pr{text-align:right;font:900 13px Mali;color:#b8740c}#mkw .pr small{display:block;font:700 10px Mali}
#mkw .sellgrid{display:grid;grid-template-columns:1fr 290px;gap:8px}
#mkw .bag{display:grid;grid-template-columns:repeat(auto-fill,46px);gap:6px;max-height:330px;overflow:auto;padding:2px}
#mkw .frm label{display:flex;justify-content:space-between;align-items:center;margin:6px 0;font:700 12px Mali}
#mkw .q{display:flex;gap:4px;align-items:center}#mkw .q .ttin{width:84px;text-align:right}
#mkw .sum{background:#fff;border:1px solid #c8d6ee;border-radius:9px;padding:6px 8px;margin:6px 0;font:700 12px Mali;line-height:1.7}
#mkw .cash{display:flex;align-items:center;gap:10px;background:linear-gradient(#fff8dc,#ffe9a8);border:2px solid #e2b64e;border-radius:11px;padding:8px 10px;margin-bottom:8px;font:800 13px Mali;color:#6b4a14}
#mkw .log{max-height:110px;overflow:auto;font:600 11px Mali;color:#5a6a8a;margin-top:6px}
#mkpop{position:absolute;inset:0;background:rgba(10,16,34,.55);display:none;align-items:center;justify-content:center;border-radius:14px;z-index:5}
#mkpop .ttp{width:300px;text-align:center}`;
document.head.appendChild(tcss);
function ttWin(id,title){let w=document.getElementById(id);if(!w){w=document.createElement('div');w.id=id;w.className='ttw';document.body.appendChild(w);w.addEventListener('pointerdown',e=>e.stopPropagation());}
  w.innerHTML=`<div class="tth">${title}<button class="ttx">✕</button></div><div class="ttbd"></div>`;w.querySelector('.ttx').onclick=()=>w.classList.remove('open');
  const tb=w.querySelector('.tth');tb.onpointerdown=e=>{if(e.target.classList.contains('ttx'))return;const r=w.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;w.style.transform='none';w.style.left=r.left+'px';w.style.top=r.top+'px';
    const mv=ev=>{w.style.left=Math.max(0,Math.min(innerWidth-80,ev.clientX-ox))+'px';w.style.top=Math.max(0,Math.min(innerHeight-40,ev.clientY-oy))+'px';},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);};
    addEventListener('pointermove',mv);addEventListener('pointerup',up);};
  return w.querySelector('.ttbd');}
addEventListener('keydown',e=>{if(e.key!=='Escape')return;for(const id of ['rfw','mkw']){const w=document.getElementById(id);if(w&&w.classList.contains('open')){w.classList.remove('open');}}});
const refCol=r=>r>=15?'#ff2bd6':r>=13?'#ff4a5a':r>=11?'#b86aff':r>=9?'#ff6ad5':r>=7?'#ffb02e':r>=5?'#7fd0ff':'#ffffff';
const tierOf=it=>Math.max(1,Math.min(4,it.tier||it.wlv||1));
function refGain(it,r){const t=tierOf(it);return it.slot==='rhand'?{lab:'พลังโจมตี/เวท จากบวก',v:r*REF_ATK[Math.min(4,it.wlv||t)]}:{lab:'DEF จากบวก',v:armorRefDef({ref:r,tier:it.tier||1})};}
/* one refine attempt → 'ok' | 'down' (guarded, −1) | 'held' (guarded at +11…, nothing lost) | 'broke' (broken: −1 below +11) */
function rollRefine(id,guard){const it=ITEMS[id];if(!it||it.broken)return null;const r=it.ref||0,t=tierOf(it),cost=refCost(it,r),z=COST.refineZ(t,r);if(r>=REF_MAX||!canPay(cost,z))return null;
  const gn=refGuardN(r),g=guard&&r>=5&&has('guard',gn);pay(cost,z);if(g)add('guard',-gn);
  if(Math.random()<refChance(it,r)){it.ref=r+1;it.rp=0;return 'ok';}
  if(r>=10)it.rp=(it.rp||0)+1;
  if(r<10)it.ref=Math.max(0,r-1);
  if(g)return r<10?'down':'held';
  it.broken=1;try{applyStats();}catch(e){}return 'broke';}
/* repair (a broken piece gives nothing until repaired): another piece of the same kind — same slot + same grade (crafted or drop set),
   or the same base item — is used up, or zeny is paid. The used piece's refine and orbs are lost. */
const sameKind=(a,b)=>!!a&&!!b&&a!==b&&(a.cslot||a.slot)===(b.cslot||b.slot)&&(a.grade!==undefined&&b.grade!==undefined?a.grade===b.grade:!!a.base&&a.base===b.base);
function repairMates(id){const it=ITEMS[id],eq=Object.values(EQ);return ownedIds().filter(o=>o!==id&&!eq.includes(o)&&ITEMS[o]&&!ITEMS[o].broken&&sameKind(ITEMS[o],it));}
const repairZ=it=>3000*tierOf(it)*tierOf(it)*((it.ref||0)+1);
function repairItem(id,by){const it=ITEMS[id];if(!it||!it.broken)return false;
  if(by==='z'){const z=repairZ(it);if(ZENY<z)return false;ZENY-=z;}
  else{if(!repairMates(id).includes(by))return false;destroyItem(by);}
  delete it.broken;try{applyStats();}catch(e){}save();return true;}

/* ---------------- REFINE window ---------------- */
let rfSel=null,rfGuard=true,rfBusy=false;
const HAMMER=`<svg class="hammer" viewBox="0 0 64 64"><rect x="30" y="18" width="8" height="44" rx="3" fill="#8a5a2a" stroke="#3a2a1f" stroke-width="2.5"/><rect x="10" y="6" width="44" height="18" rx="4" fill="#9aa4b4" stroke="#3a2a1f" stroke-width="2.5"/><rect x="12" y="8" width="40" height="5" rx="2" fill="#d8dee8"/></svg>`;
const ANVIL=`<svg class="anvil" width="190" height="70" viewBox="0 0 190 70"><path d="M20 10 H160 Q182 12 186 22 Q160 24 146 30 L136 34 V44 H54 V34 L44 30 Q30 24 20 22 Z" fill="#5c6270" stroke="#1f1626" stroke-width="3"/><path d="M24 12 H158 Q172 13 178 18 H26Z" fill="#8a92a2"/><path d="M60 44 H130 L140 66 H50 Z" fill="#4a4f5a" stroke="#1f1626" stroke-width="3"/></svg>`;
function openRefine(){const b=ttWin('rfw','⚒ ตีบวกอุปกรณ์');document.getElementById('rfw').classList.add('open');buildRefine();}
function buildRefine(){const w=document.getElementById('rfw');if(!w||!w.classList.contains('open')||rfBusy)return;const b=w.querySelector('.ttbd'),owned=ownedIds();if(rfSel&&!ITEMS[rfSel])rfSel=null;
  const inv=owned.map(id=>{const it=ITEMS[id],eq=Object.values(EQ).includes(id);return `<div class="tts ${id===rfSel?'sel':''}" data-rf="${id}" title="${it.n}${it.broken?' (แตก — ต้องซ่อม)':''}">${itemIcon(it,30)}${it.ref?`<em style="color:${refCol(it.ref)}">+${it.ref}</em>`:''}${eq?'<b class="eq">E</b>':''}</div>`;}).join('')
    +Array.from({length:Math.max(0,20-owned.length)},()=>'<div class="tts empty"></div>').join('');
  const it=rfSel&&ITEMS[rfSel];let right;
  const rule=`<div class="ttnote" style="margin-top:8px">+1 ถึง +5 สำเร็จเสมอ · +6–+10 พลาด = ลดบวก 1 และ<b class="ttwarn">ของแตก</b> · +11–+15 พลาด = <b class="ttwarn">ของแตก</b> (บวกไม่ลด) ใช้แร่ดาวตก · ของแตกไม่ให้ค่าพลังจนกว่าจะซ่อม · หินกันแตก = ไม่แตก</div>`;
  if(!it)right=`<div class="stage">${HAMMER}<div class="big none">เลือกอุปกรณ์<br>ทางซ้าย</div>${ANVIL}<div class="res"></div></div><div class="prog"><div></div></div>${rule}`;
  else if(it.broken){const mates=repairMates(rfSel),z=repairZ(it);
    right=`<div class="stage"><div class="lv">${it.n} <span style="color:${refCol(it.ref||0)}">+${it.ref||0}</span></div><div class="big">${itemIcon(it,58)}</div>${ANVIL}<div class="res"></div></div>
      <div style="margin-top:6px;padding:5px 8px;border-radius:10px;background:#c0202a;color:#fff;font:700 14px Mali,Mitr,sans-serif;text-align:center;box-shadow:0 2px 0 #5a0a0a">💔 แตก — ต้องซ่อมก่อนใช้ / ตีบวกต่อ</div>
      <div class="ttnote" style="margin-top:6px">ของแตกไม่ให้ค่าพลังและตีบวกต่อไม่ได้ · ซ่อมด้วย<b>ของชนิดเดียวกัน 1 ชิ้น</b> (ช่องเดียวกัน ระดับเดียวกัน — บวกและหินของชิ้นนั้นหายไป) หรือจ่ายเงิน</div>
      ${mates.length?`<div class="inv" style="margin-top:6px;grid-template-columns:repeat(auto-fill,minmax(40px,1fr))">${mates.map(o=>{const m=ITEMS[o];return `<div class="tts" data-rpby="${o}" title="ใช้ ${m.n}${m.ref?' +'+m.ref:''} ซ่อม">${itemIcon(m,30)}${m.ref?`<em style="color:${refCol(m.ref)}">+${m.ref}</em>`:''}</div>`;}).join('')}</div><div class="ttnote">แตะชิ้นที่จะใช้ซ่อม</div>`:'<div class="ttnote" style="margin-top:6px">ไม่มีของชนิดเดียวกันในกระเป๋า — คราฟต์ชิ้นช่องเดียวกัน ระดับเดียวกัน หรือซื้อที่ตลาดอุปกรณ์</div>'}
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px"><div class="ttnote" style="flex:1">ซ่อมด้วยเงิน <b style="color:${ZENY>=z?'#b8740c':'#d23a2a'}">${fmt(z)}z</b> · มี ${fmt(ZENY)}z</div><button class="ttb" id="rfz" ${ZENY>=z?'':'disabled'}>🔧 ซ่อมด้วยเงิน</button></div>`;}
  else{const r=it.ref||0,t=tierOf(it),max=r>=REF_MAX,ore='ore'+t,z=COST.refineZ(t,r),ch=max?0:refChance(it,r),base=max?0:REFINE_CHANCE[r],risky=r>=5,gn=refGuardN(r),gHave=(BAG.guard||0)>=gn,g=rfGuard&&gHave,st=refStar(r),ok=!max&&canPay(refCost(it,r),z);
    const a=refGain(it,r),bb=refGain(it,r+1),col=ch>=.8?'#2a9a28':ch>=.4?'#e0a020':'#d23a2a',ms=r+1===12?' · ได้รูหินเพิ่ม 1':r+1===15?' · สถานะพิเศษของชิ้นนี้ ×1.2':'';
    right=`<div class="stage">${HAMMER}<div class="lv">${it.n} <span style="color:${refCol(r)}">+${r}</span>${max?'':` ➜ <span style="color:${refCol(r+1)}">+${r+1}</span>`}</div>
        <div class="big">${itemIcon(it,58)}</div>${ANVIL}<div class="res"></div></div><div class="prog"><div></div></div>
      <div class="stat"><span>${a.lab}</span><span>+${a.v}${max?'':` ➜ <b class="ttgood">+${bb.v}</b>${ms}`}</span></div>
      ${max?`<div class="ttnote" style="margin-top:8px;text-align:center">ตีบวกสูงสุดแล้ว (+${REF_MAX})</div>`:`
      <div class="mats"><div><div class="tts" style="cursor:default" title="${etcName(ore)}">${etcIcon(ore,28)}<em class="${has(ore)?'':'ttwarn'}">${BAG[ore]||0}/1</em></div><div class="lab">แร่ขั้น ${t}</div></div>
        ${st?`<div><div class="tts" style="cursor:default" title="${etcName('sore')}">${etcIcon('sore',28)}<em class="${has('sore',st)?'':'ttwarn'}">${BAG.sore||0}/${st}</em></div><div class="lab">แร่ดาวตก</div></div>`:''}
        <div><div class="tts ${g&&risky?'sel':''}" data-guard title="หินกันแตก — พลาดแล้วของไม่แตก${r>=10?' (ใช้ '+gn+' ก้อน)':''}" style="${gHave?'':'opacity:.5'}">${etcIcon('guard',28)}<em>${BAG.guard||0}${risky&&gn>1?'/'+gn:''}</em></div><div class="lab">กันแตก${risky?(g?' ✔':''):' (ไม่ต้อง)'}</div></div>
        <div style="flex:1;padding-left:4px"><div class="ttnote">โอกาสสำเร็จ${ch>base?` <span style="color:#2a9a28">(+${Math.round((ch-base)*100)}% แต้มช่าง)</span>`:''}</div><div class="rate" style="color:${col}">${Math.round(ch*100)}%</div><div class="bar"><div style="width:${ch*100}%;background:${col}"></div></div>
          <div class="ttnote">${!risky?'ปลอดภัย ไม่มีแตก':g?(r<10?`พลาด = ลดบวก 1 (ใช้หินกันแตก ${gn})`:`พลาด = ไม่แตก บวกไม่ลด (ใช้หินกันแตก ${gn})`):(r<10?'<b class="ttwarn">พลาด = ลดบวก 1 + ของแตก ต้องซ่อม</b>':'<b class="ttwarn">พลาด = ของแตก ต้องซ่อม</b> (บวกไม่ลด)')}</div></div></div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px"><div class="ttnote" style="flex:1">ค่าตีบวก <b style="color:${ZENY>=z?'#b8740c':'#d23a2a'}">${fmt(z)}z</b> · มี ${fmt(ZENY)}z</div>
        <button class="ttb" id="rfgo" ${ok?'':'disabled'}>⚒ ตีบวก</button></div>`}`;}
  b.innerHTML=`<div class="rfgrid"><div class="ttp"><h4>🎒 อุปกรณ์ของฉัน</h4><div class="inv">${inv}</div><div class="ttnote" style="margin-top:6px">E = สวมอยู่ · 💔 = แตก ต้องซ่อม · คลิกเพื่อวางบนทั่ง</div></div><div class="ttp">${right}</div></div>
    <div style="display:flex;justify-content:space-between;margin-top:8px"><button class="ttb blue sm" id="rfback">← หน้าช่าง (คราฟ/เจาะรู)</button><span class="ttnote" style="color:#cfe0ff;align-self:center">หินกันแตก & แร่ ซื้อได้ที่ร้านเมืองหลวง · แร่ดาวตก ดรอปจากมอน Lv 70+ / ตลาดกลาง</span></div>`;
  b.querySelectorAll('[data-rf]').forEach(e=>e.onclick=()=>{rfSel=e.dataset.rf;buildRefine();});
  const gd=b.querySelector('[data-guard]');if(gd)gd.onclick=()=>{rfGuard=!rfGuard;buildRefine();};
  b.querySelectorAll('[data-rpby]').forEach(e=>e.onclick=()=>{const m=ITEMS[e.dataset.rpby],nm=ITEMS[rfSel]&&ITEMS[rfSel].n;if(m&&((m.ref||0)>0||(m.orbs||[]).length)&&!confirm(`ใช้ ${m.n}${m.ref?' +'+m.ref:''} ซ่อม? บวกและหินของชิ้นนั้นจะหายไป`))return;
    if(repairItem(rfSel,e.dataset.rpby)){done(`ซ่อม ${nm} แล้ว`);buildRefine();}});
  const rz=b.querySelector('#rfz');if(rz)rz.onclick=()=>{const nm=ITEMS[rfSel]&&ITEMS[rfSel].n;if(repairItem(rfSel,'z')){done(`ซ่อม ${nm} แล้ว`);buildRefine();}};
  b.querySelector('#rfback').onclick=()=>{w.classList.remove('open');smTab='craft';openSmith();};
  const go=b.querySelector('#rfgo');if(go)go.onclick=()=>refineAnim(b);}
function refineAnim(b){if(rfBusy)return;const id=rfSel,it=ITEMS[id];if(!it)return;const r0=it.ref||0,name=it.n;
  const res=rollRefine(id,rfGuard);if(!res)return;rfBusy=true;const st=b.querySelector('.stage'),go=b.querySelector('#rfgo');go.disabled=true;b.querySelector('.ttp').style.pointerEvents='none';
  st.classList.add('strike');
  for(const tm of [300,660,1020])setTimeout(()=>{for(let i=0;i<9;i++){const s=document.createElement('div');s.className='spk';const a=Math.random()*Math.PI*2,d=30+Math.random()*50;s.style.left='50%';s.style.top='64px';st.appendChild(s);
      s.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d*.7-10}px)`,opacity:0}],{duration:420+Math.random()*200,easing:'ease-out'}).onfinish=()=>s.remove();}},tm);
  setTimeout(()=>{st.classList.remove('strike');const R=st.querySelector('.res'),big=st.querySelector('.big');
    if(res==='ok'){st.classList.add('flash');R.className='res ok on';R.textContent=`+${r0+1} สำเร็จ!`;done(`ตีบวกสำเร็จ! ${name} +${r0+1}`);addFx(new DText({x:player.x,y:player.y,z:90,text:'+'+(r0+1)+' SUCCESS',color:'#ffd36a',size:15,life:1.2}));
      if(r0+1>=11)chatLog('sys',`<span style="color:${refCol(r0+1)}">✦ ${name} ตีบวกสำเร็จเป็น +${r0+1}!</span>`);}
    else if(res==='down'){R.className='res fail on';R.textContent=`ล้มเหลว… +${Math.max(0,r0-1)}`;done(`ตีบวกพลาด — หินกันแตกช่วยไว้ ${name} เหลือ +${Math.max(0,r0-1)}`);}
    else if(res==='held'){R.className='res fail on';R.textContent=`ล้มเหลว… +${r0}`;done(`ตีบวกพลาด — หินกันแตกช่วยไว้ ${name} ยัง +${r0} (แต้มช่าง +1%)`);}
    else{big.classList.add('shatter');R.className='res broke on';R.textContent='ของแตก!';done(`ตีบวกพลาด… ${name} แตก${r0<10?` เหลือ +${Math.max(0,r0-1)}`:''} — ต้องซ่อมก่อนใช้`);addFx(new DText({x:player.x,y:player.y,z:90,text:'BROKEN',color:'#e2574c',size:15,life:1.2}));}
    setTimeout(()=>{rfBusy=false;buildRefine();buildSmith();},1300);},1120);}

/* ---------------- GEAR MARKET (the old central market, gear only since 2026-11-21) ----------------
   Stackable goods moved to the central-price market in market.js (MARKET_SYSTEM_TH.md); AFItems.openMarket() opens that one and its
   "⚔ อุปกรณ์" button opens this window. Gear stays seller-priced until phase 2 of that design.
   Offline game: the other "players" are simulated traders. Their stalls change every 15 minutes (real time, keeps going while the
   game is closed). Your own listings sell over time — the cheaper versus the market price, the faster. Fee 3% on each sale. */
const MKEY='af_market_v1_'+CHAR+(MODE==='play'?'_play':''),MK_FEE=.03,MK_MAX=10,MK_REFRESH=15*60000;
const MK={list:[],mine:[],cash:0,log:[],next:0,uid:1};try{Object.assign(MK,JSON.parse(localStorage.getItem(MKEY)||'{}'));}catch(e){}
const mkSave=()=>{try{localStorage.setItem(MKEY,JSON.stringify(MK));}catch(e){}};
const MK_NAMES=['หมีขั้วโลก99','ลูกแมวนักรบ','KafraLover','ป้าขายยา','จิ้งจอกเงิน','NightOwl_TH','ช่างตีเหล็กมือใหม่','ราชาแร่','สายฟาร์มOrb','MoonRabbit','แมวส้มรวยมาก','IceQueen','เต่าซิ่ง','ตลาดนัดเฟนเรียร์','พ่อค้าทะเลทราย','SamuraiMeow','ร้านลุงหนวด','HoneyBadger','BlueSlime','คุณนายเหมืองทอง'];
const MK_CATS=[['eq','อุปกรณ์','⚔']];
const catOf=l=>l.eq?'eq':(ETC[l.k]||{}).kind==='crystal'?'tool':(ETC[l.k]||{}).kind;
const eqFair=(g,ref)=>Math.round(1500*Math.pow(g+1,1.6)*(1+(ref||0)*.35));
const fairOf=l=>l.eq?Math.round(eqFair(l.eq.g??l.eq.grade??0,l.eq.ref)*(l.eq.copy&&l.eq.copy.dset!==undefined?.35:1)):Math.max(1,(ETC[l.k]||{}).price||1);
const rnd2=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
function mkGen(n){const G=gradeOfLv(PS.lv),out=[];                                 // gear only (stackable goods: market.js)
  for(let i=0;i<n;i++){const g=Math.max(0,Math.min(9,G-Math.floor(Math.random()*2))),ref=Math.random()<.5?0:Math.floor(rnd2(1,7)),town=pick(Object.keys(TOWNS)),slot=pick(GEAR);
      if(Math.random()<.45){const id=dropSetItem(g,slot),c=JSON.parse(JSON.stringify(ITEMS[id]));delete ITEMS[id];c.ref=ref;out.push({u:MK.uid++,eq:{n:c.n,slot,grade:g,ref,copy:c},n:1,p:Math.round(eqFair(g,ref)*.35*rnd2(.8,1.5)/10)*10,s:pick(MK_NAMES),t:Date.now()-Math.random()*36e5});continue;}
      const cg=CRAFT_G.filter(x=>x<=Math.max(3,g)).pop();out.push({u:MK.uid++,eq:{town,slot,g:cg,ref},n:1,p:Math.round(eqFair(cg,ref)*rnd2(.8,1.55)/10)*10,s:pick(MK_NAMES),t:Date.now()-Math.random()*36e5});}
  return out;}
function mkRefresh(){const now=Date.now();if(!MK.list.length){MK.list=mkGen(12);MK.next=now+MK_REFRESH;}
  while(now>=MK.next){MK.list=MK.list.filter(()=>Math.random()<.5).concat(mkGen(6)).slice(-14);MK.next+=MK_REFRESH;if(now-MK.next>MK_REFRESH*8)MK.next=now+MK_REFRESH;}}
/* your listings sell over time: per minute, chance ~ (market price / your price)^3 */
function mkSim(){const now=Date.now();let got=[];
  for(const l of MK.mine){if(!l.n)continue;let mins=Math.min(720,(now-(l.last||now))/60000);l.last=now;const r=l.p/fairOf(l),pm=Math.max(.004,Math.min(.7,.3*Math.pow(1/r,3)));
    while(mins>=1&&l.n>0){mins--;if(Math.random()<pm){const q=Math.min(l.n,Math.max(1,Math.ceil(l.n0*rnd2(.05,.25))));l.n-=q;l.sold=(l.sold||0)+q;const gain=Math.floor(q*l.p*(1-MK_FEE));MK.cash+=gain;
        const nm=l.eq?l.eq.n:etcName(l.k);MK.log.unshift(`${new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})} · ${pick(MK_NAMES)} ซื้อ ${nm} ×${q} (+${fmt(gain)}z)`);got.push(`${nm} ×${q}`);}}}
  MK.log=MK.log.slice(0,30);if(got.length){chatLog('sys',`⚔ ตลาดอุปกรณ์: ขายได้แล้ว — ${got.join(', ')} (ไปรับเงินที่ร้านของฉัน)`);mkSave();}}
setInterval(()=>{mkSim();const w=document.getElementById('mkw');if(w&&w.classList.contains('open')&&mkTab!=='sell')buildMarket();},30000);
let mkTab='buy',mkCat='eq',mkQ='',mkSort='cheap',mkPick=null,mkQty=1,mkPrice=0;
function mkIcon(l,sz){if(l.eq&&l.eq.copy)return itemIcon(l.eq.copy,sz);return l.eq?itemIcon({crafted:1,slot:l.eq.slot,cslot:l.eq.slot,town:l.eq.town,grade:l.eq.g,n:'',b:{}},sz):etcIcon(l.k,sz);}
function mkName(l){if(l.eq){const e=l.eq;return `${e.ref?'+'+e.ref+' ':''}${e.n||craftName(e.town,e.slot,e.g??e.grade??0)}`;}return etcName(l.k);}
function mkSub(l){if(l.eq){const e=l.eq,ds=e.copy&&e.copy.dset!==undefined;return `${SLOTS[e.slot].nm} · Lv${gradeLv(e.g??e.grade??0)} · ${ds?'ชุด'+DSET[e.copy.dset][1]+' (ของดรอป)':'ช่าง'+(TOWNS[e.town]||{name:'?'}).name}`;}const E=ETC[l.k]||{};return E.d?E.d.slice(0,46):E.n||'';}
function openGearMarket(){if(curMap!=='capT'&&!(window.AFProgress&&AFProgress.mode==='test')){msg('ตลาดกลางมีแค่ในเมืองหลวง');return;}ttWin('mkw','⚔ ตลาดอุปกรณ์ · เมืองหลวง');const w=document.getElementById('mkw');w.classList.add('open');w.style.zIndex=60;mkRefresh();mkSim();buildMarket();}
function openMarket(){if(window.MKT)return MKT.open();openGearMarket();}       // market.js = central-price market for stackable goods
function buildMarket(){const w=document.getElementById('mkw');if(!w||!w.classList.contains('open'))return;mkRefresh();const b=w.querySelector('.ttbd');const pend=MK.cash;
  const tabs=`<div class="tttab"><button data-mt="buy" class="${mkTab==='buy'?'on':''}">🛒 ซื้อสินค้า</button><button data-mt="sell" class="${mkTab==='sell'?'on':''}">📦 ลงขาย</button><button data-mt="mine" class="${mkTab==='mine'?'on':''}">🏪 ร้านของฉัน${pend?'<sup>z</sup>':''}</button></div>`;
  let body='';
  if(mkTab==='buy'){let L=MK.list.filter(l=>(mkCat==='all'||catOf(l)===mkCat)&&(!mkQ||mkName(l).toLowerCase().includes(mkQ.toLowerCase())));
    L.sort(mkSort==='cheap'?(a,b)=>a.p/fairOf(a)-b.p/fairOf(b):mkSort==='high'?(a,b)=>b.p-a.p:(a,b)=>b.t-a.t);
    const left=Math.max(0,MK.next-Date.now()),mm=Math.floor(left/60000),ss=Math.floor(left/1000)%60;
    body=`<div class="mkgrid"><div class="cats">${MK_CATS.map(([k,n,ic])=>`<button data-cat="${k}" class="${mkCat===k?'on':''}">${ic} ${n}</button>`).join('')}<div class="ttnote" style="color:#cfe0ff;margin-top:6px">สินค้าใหม่ใน<br><b style="color:#ffd77a">${mm}:${String(ss).padStart(2,'0')}</b></div></div>
      <div><div class="mkbar"><input class="ttin" id="mkq" placeholder="🔍 ค้นหาชื่อสินค้า" value="${mkQ.replace(/"/g,'')}" style="flex:1"><select class="ttin" id="mks"><option value="cheap" ${mkSort==='cheap'?'selected':''}>คุ้มสุด</option><option value="high" ${mkSort==='high'?'selected':''}>ราคาสูง→ต่ำ</option><option value="new" ${mkSort==='new'?'selected':''}>ลงล่าสุด</option></select>
        <span style="color:#ffd77a;font:800 12.5px Mali;white-space:nowrap">💰 ${fmt(ZENY)}z</span></div>
      <div class="tbl"><div class="row h"><span></span><span>สินค้า</span><span>ผู้ขาย</span><span>จำนวน</span><span style="text-align:right">ราคา/ชิ้น</span><span></span></div>
      ${L.length?L.map(l=>{const f=fairOf(l),r=l.p/f,pc=Math.round((r-1)*100),c=r<.92?'ttgood':r>1.12?'ttwarn':'';
        return `<div class="row"><div class="tts" style="cursor:default">${mkIcon(l,28)}</div><div class="nm"><b>${mkName(l)}</b><small>${mkSub(l)}</small></div><div class="sel">🐾 ${l.s}</div><div style="font:800 12px Mali">×${l.n}</div>
          <div class="pr">${fmt(l.p)}z<small class="${c}">${pc>0?'+':''}${pc}% ราคากลาง</small></div><button class="ttb sm" data-buy="${l.u}" ${ZENY>=l.p?'':'disabled'}>ซื้อ</button></div>`;}).join(''):'<div class="ttnote" style="padding:14px;text-align:center">ไม่พบสินค้า</div>'}</div></div></div>`;}
  else if(mkTab==='sell'){const etc=[];                                                // stackable goods are sold in the central-price market (market.js)
    const eqs=INV.filter(id=>ITEMS[id]&&!ITEMS[id].broken&&(ITEMS[id].crafted||ITEMS[id].dset!==undefined)).map(id=>({id}));   /* broken pieces must be repaired before they can be sold */const all=[...eqs,...etc];
    if(mkPick&&!all.some(o=>o.k===mkPick.k&&o.id===mkPick.id))mkPick=null;
    let frm='<div class="ttnote" style="padding:20px 6px;text-align:center">เลือกของจากกระเป๋าทางซ้าย<br>เพื่อตั้งราคาลงขาย</div>';
    if(mkPick){const isEq=!!mkPick.id,it=isEq&&ITEMS[mkPick.id],have=isEq?1:BAG[mkPick.k]||0,fair=isEq?Math.round(eqFair(it.grade||0,it.ref)*(it.dset!==undefined?.35:1)):(ETC[mkPick.k].price||1);
      if(!mkPrice)mkPrice=fair;mkQty=Math.max(1,Math.min(have,mkQty));const r=mkPrice/fair,spd=r<=.85?['ขายเร็วมาก','ttgood']:r<=1.05?['ขายเร็ว','ttgood']:r<=1.3?['ปกติ','']:r<=1.7?['ช้า','ttwarn']:['ช้ามาก','ttwarn'];
      const tot=mkQty*mkPrice,fee=Math.ceil(tot*MK_FEE);
      frm=`<div style="display:flex;gap:8px;align-items:center"><div class="tts sel" style="cursor:default">${isEq?itemIcon(it,30):etcIcon(mkPick.k,30)}</div><div class="nm"><b style="font:800 13px Mali">${isEq?(it.ref?'+'+it.ref+' ':'')+it.n:etcName(mkPick.k)}</b><div class="ttnote">มี ${have} · ราคากลาง <b>${fmt(fair)}z</b></div></div></div>
        <div class="frm"><label>จำนวน <span class="q"><button class="ttb blue sm" data-qd="-1">−</button><input class="ttin" id="mkqty" value="${mkQty}" ${isEq?'disabled':''}><button class="ttb blue sm" data-qd="1">+</button><button class="ttb blue sm" data-qd="max">สูงสุด</button></span></label>
        <label>ราคา/ชิ้น <span class="q"><input class="ttin" id="mkpr" value="${mkPrice}"> z</span></label>
        <div class="q" style="justify-content:flex-end"><button class="ttb blue sm" data-pf=".8">−20%</button><button class="ttb blue sm" data-pf="1">ราคากลาง</button><button class="ttb blue sm" data-pf="1.2">+20%</button></div></div>
        <div class="sum">รวม ${fmt(tot)}z · ค่าธรรมเนียม 3% −${fmt(fee)}z<br>ได้รับเมื่อขายหมด <b style="color:#b8740c">${fmt(tot-fee)}z</b><br>ความเร็วในการขาย: <b class="${spd[1]}">${spd[0]}</b></div>
        <button class="ttb" id="mklist" style="width:100%" ${MK.mine.filter(l=>l.n).length>=MK_MAX?'disabled':''}>📦 ลงขาย (${MK.mine.filter(l=>l.n).length}/${MK_MAX} ช่อง)</button>`;}
    body=`<div class="sellgrid"><div class="ttp"><h4>🎒 กระเป๋า — ของที่ขายได้</h4><div class="bag">${all.map(o=>{const sel=mkPick&&(o.k?mkPick.k===o.k:mkPick.id===o.id);
        if(o.id){const it=ITEMS[o.id];return `<div class="tts ${sel?'sel':''}" data-pk="${o.id}" data-eq="1" title="${it.n}">${itemIcon(it,30)}${it.ref?`<em style="color:${refCol(it.ref)}">+${it.ref}</em>`:''}</div>`;}
        return `<div class="tts ${sel?'sel':''}" data-pk="${o.k}" title="${etcName(o.k)}">${etcIcon(o.k,28)}<em>${BAG[o.k]}</em></div>`;}).join('')||'<div class="ttnote">ไม่มีของที่ขายได้</div>'}</div>
      <div class="ttnote" style="margin-top:6px">ของที่สวมอยู่ต้องถอดก่อนถึงจะลงขายได้</div></div><div class="ttp">${frm}</div></div>`;}
  else{const act=MK.mine.filter(l=>l.n),fin=MK.mine.filter(l=>!l.n);
    body=`<div class="cash">💰 เงินรอรับ <span style="font-size:18px;color:#b8740c">${fmt(MK.cash)}z</span><button class="ttb sm" id="mkcash" ${MK.cash?'':'disabled'} style="margin-left:auto">รับเงิน</button></div>
      <div class="tbl" style="max-height:240px"><div class="row h" style="grid-template-columns:52px 1fr 90px 104px 70px"><span></span><span>สินค้าที่วางขาย (${act.length}/${MK_MAX})</span><span>เหลือ / ขายแล้ว</span><span style="text-align:right">ราคา/ชิ้น</span><span></span></div>
      ${MK.mine.length?MK.mine.map(l=>`<div class="row" style="grid-template-columns:52px 1fr 90px 104px 70px"><div class="tts" style="cursor:default">${mkIcon(l,28)}</div><div class="nm"><b>${mkName(l)}</b><small>${l.n?'กำลังขาย…':'<span class="ttgood">ขายหมดแล้ว ✔</span>'}</small></div>
        <div style="font:800 12px Mali">${l.n} / <span class="ttgood">${l.sold||0}</span></div><div class="pr">${fmt(l.p)}z</div>${l.n?`<button class="ttb blue sm" data-cancel="${l.u}">ยกเลิก</button>`:`<button class="ttb blue sm" data-clear="${l.u}">ลบ</button>`}</div>`).join(''):'<div class="ttnote" style="padding:14px;text-align:center">ยังไม่ได้วางขายอะไร — ไปที่แท็บ "ลงขาย"</div>'}</div>
      <div class="ttp" style="margin-top:8px"><h4>📜 ประวัติการขาย</h4><div class="log">${MK.log.length?MK.log.map(s=>`<div>${s}</div>`).join(''):'ยังไม่มีคนซื้อ'}</div></div>`;}
  b.innerHTML=tabs+body+`<div class="ttnote" style="color:#a9bde6;margin-top:6px;text-align:center">อุปกรณ์ยังขายแบบตั้งราคาเอง · ผู้ขายเป็นพ่อค้าจำลอง (เกมออฟไลน์) · ของที่คุณวางขายจะค่อยๆ ขายได้แม้ปิดเกม · ค่าธรรมเนียม 3%</div>`;
  const q=(s,f)=>b.querySelectorAll(s).forEach(f);
  q('[data-mt]',e=>e.onclick=()=>{mkTab=e.dataset.mt;buildMarket();});q('[data-cat]',e=>e.onclick=()=>{mkCat=e.dataset.cat;buildMarket();});
  const qi=b.querySelector('#mkq');if(qi){qi.oninput=()=>{mkQ=qi.value;const pos=qi.selectionStart;buildMarket();const n=b.querySelector('#mkq');n.focus();n.setSelectionRange(pos,pos);};qi.onkeydown=e=>e.stopPropagation();}
  const so=b.querySelector('#mks');if(so)so.onchange=()=>{mkSort=so.value;buildMarket();};
  q('[data-buy]',e=>e.onclick=()=>mkBuyAsk(+e.dataset.buy));
  q('[data-pk]',e=>e.onclick=()=>{mkPick=e.dataset.eq?{id:e.dataset.pk}:{k:e.dataset.pk};mkQty=e.dataset.eq?1:(BAG[e.dataset.pk]||1);mkPrice=0;buildMarket();});
  q('[data-qd]',e=>e.onclick=()=>{const have=mkPick.id?1:BAG[mkPick.k]||0,d=e.dataset.qd;mkQty=d==='max'?have:Math.max(1,Math.min(have,mkQty+(+d)));buildMarket();});
  const qt=b.querySelector('#mkqty');if(qt){qt.onkeydown=e=>e.stopPropagation();qt.onchange=()=>{mkQty=Math.max(1,parseInt(qt.value)||1);buildMarket();};}
  const pr=b.querySelector('#mkpr');if(pr){pr.onkeydown=e=>e.stopPropagation();pr.onchange=()=>{mkPrice=Math.max(1,parseInt(pr.value)||1);buildMarket();};}
  q('[data-pf]',e=>e.onclick=()=>{const it=mkPick.id&&ITEMS[mkPick.id],fair=mkPick.id?Math.round(eqFair(it.grade||0,it.ref)*(it.dset!==undefined?.35:1)):ETC[mkPick.k].price;mkPrice=Math.max(1,Math.round(fair*(+e.dataset.pf)));buildMarket();});
  const ls=b.querySelector('#mklist');if(ls)ls.onclick=mkList;
  const cs=b.querySelector('#mkcash');if(cs)cs.onclick=()=>{ZENY+=MK.cash;done(`รับเงินจากตลาดอุปกรณ์ ${fmt(MK.cash)}z`);MK.cash=0;mkSave();buildMarket();};
  q('[data-cancel]',e=>e.onclick=()=>mkCancel(+e.dataset.cancel));q('[data-clear]',e=>e.onclick=()=>{MK.mine=MK.mine.filter(l=>l.u!==+e.dataset.clear);mkSave();buildMarket();});}
function mkPop(html){const w=document.getElementById('mkw');let p=w.querySelector('#mkpop');if(!p){p=document.createElement('div');p.id='mkpop';w.appendChild(p);}p.innerHTML=`<div class="ttp">${html}</div>`;p.style.display='flex';return p;}
function mkBuyAsk(u){const l=MK.list.find(o=>o.u===u);if(!l)return;let n=1;const max=()=>Math.max(1,Math.min(l.n,Math.floor(ZENY/l.p)));
  const draw=()=>{const p=mkPop(`<div style="display:flex;gap:8px;align-items:center;justify-content:center"><div class="tts sel">${mkIcon(l,30)}</div><div style="text-align:left"><b style="font:800 13px Mali">${mkName(l)}</b><div class="ttnote">ผู้ขาย 🐾 ${l.s} · มี ${l.n}</div></div></div>
      ${l.eq?'':`<div class="q" style="justify-content:center;margin:10px 0;display:flex;gap:4px"><button class="ttb blue sm" data-n="-1">−</button><input class="ttin" id="bn" value="${n}" style="width:70px;text-align:center"><button class="ttb blue sm" data-n="1">+</button><button class="ttb blue sm" data-n="max">สูงสุด</button></div>`}
      <div class="sum" style="background:#fff;border:1px solid #c8d6ee;border-radius:9px;padding:6px;margin:8px 0;font:800 13px Mali">รวม <span style="color:${ZENY>=n*l.p?'#b8740c':'#d23a2a'}">${fmt(n*l.p)}z</span> <span class="ttnote">(มี ${fmt(ZENY)}z)</span></div>
      <div style="display:flex;gap:8px;justify-content:center"><button class="ttb blue" id="bno">ยกเลิก</button><button class="ttb" id="byes" ${ZENY>=n*l.p?'':'disabled'}>ซื้อเลย</button></div>`);
    p.querySelectorAll('[data-n]').forEach(e=>e.onclick=()=>{n=e.dataset.n==='max'?max():Math.max(1,Math.min(l.n,n+(+e.dataset.n)));draw();});
    const bi=p.querySelector('#bn');if(bi){bi.onkeydown=e=>e.stopPropagation();bi.onchange=()=>{n=Math.max(1,Math.min(l.n,parseInt(bi.value)||1));draw();};}
    p.querySelector('#bno').onclick=()=>p.style.display='none';p.querySelector('#byes').onclick=()=>{p.style.display='none';mkBuy(l,n);};};draw();}
function mkBuy(l,n){const cost=n*l.p;if(ZENY<cost)return;
  if(l.eq){if(eqFull()){msg(`กระเป๋าอุปกรณ์เต็ม (${BAG_EQ_MAX})`);return;}const id=l.eq.copy?newInst(null,l.eq.copy):craftItem(l.eq.town,l.eq.slot,l.eq.g);ITEMS[id].ref=l.eq.ref||0;INV.push(id);}
  else{const got=add(l.k,n);if(got<n){if(got>0)add(l.k,-got);msg('กระเป๋าเต็ม');return;}}
  ZENY-=cost;l.n-=n;if(l.n<=0)MK.list=MK.list.filter(o=>o!==l);mkSave();done(`ซื้อ ${mkName(l)} ×${n} จาก ${l.s} (−${fmt(cost)}z)`);buildMarket();}
function mkList(){if(!mkPick)return;if(MK.mine.filter(l=>l.n).length>=MK_MAX){msg('ช่องวางขายเต็ม');return;}const p=Math.max(1,mkPrice|0);let l;
  if(mkPick.id){const it=ITEMS[mkPick.id];if(!it||Object.values(EQ).includes(mkPick.id))return;const copy=JSON.parse(JSON.stringify(it));
    l={u:MK.uid++,eq:Object.assign({n:it.n,town:it.town,slot:it.cslot||it.slot,grade:it.grade||0,ref:it.ref||0},{copy}),n:1,n0:1,p,last:Date.now()};destroyItem(mkPick.id);}
  else{const q=Math.min(mkQty,BAG[mkPick.k]||0);if(!q)return;add(mkPick.k,-q);l={u:MK.uid++,k:mkPick.k,n:q,n0:q,p,last:Date.now()};}
  MK.mine.unshift(l);mkPick=null;mkPrice=0;mkSave();done(`วางขาย ${mkName(l)} ×${l.n} ชิ้นละ ${fmt(p)}z ที่ตลาดอุปกรณ์`);mkTab='mine';buildMarket();}
function mkCancel(u){const l=MK.mine.find(o=>o.u===u);if(!l||!l.n)return;
  if(l.eq){if(eqFull()){msg(`กระเป๋าอุปกรณ์เต็ม (${BAG_EQ_MAX})`);return;}const id=newInst(null,l.eq.copy);INV.push(id);}else{const got=add(l.k,l.n);if(got<l.n){if(got)add(l.k,-got);msg('กระเป๋าเต็ม');return;}}
  done(`ยกเลิกการขาย ${mkName(l)} ×${l.n} — ของกลับเข้ากระเป๋า`);l.n=0;MK.mine=MK.mine.filter(o=>o!==l||o.sold);mkSave();buildMarket();}


/* =====================================================================
   SMITH WINDOW — graphical, 12 Tails style (same look as the refine window): every tab works with item pictures,
   material icons with have/need counts, big previews and one clear action button. Logic = the old smith handlers.
   ===================================================================== */
const smCss=document.createElement('style');smCss.textContent=`
#smw.ttw{width:min(720px,96vw)}#smw .sgrid{display:grid;grid-template-columns:5fr 7fr;gap:8px}
#smw .topbar{display:flex;align-items:center;gap:8px;margin-bottom:6px}#smw .zchip{margin-left:auto;font:800 12px Mali;color:#8a5a14;background:linear-gradient(#fff6d8,#ffe39a);border:2px solid #e2b64e;border-radius:20px;padding:2px 10px}
#smw .topbar .ttnote{color:#e8f0ff}#smw .topbar .ttnote b{color:#ffd77a}#smw .tchip{font:800 12px Mali;color:#fff;background:linear-gradient(#5a78b8,#3a5592);border:2px solid #2a3f70;border-radius:20px;padding:2px 10px}
#smw .inv{display:grid;grid-template-columns:repeat(5,46px);gap:6px;max-height:300px;overflow:auto;padding:2px}
#smw .stage2{position:relative;height:150px;border-radius:12px;overflow:hidden;border:2px solid #6b4a14;box-shadow:inset 0 0 30px rgba(0,0,0,.6);background:radial-gradient(ellipse at 50% 100%,#ffb35a 0%,#a8501c 32%,#3a2030 72%,#1f1626 100%)}
#smw .stage2.blue{background:radial-gradient(ellipse at 50% 100%,#8fd0ff 0%,#2a5aa0 35%,#1a2448 75%,#101428 100%);border-color:#1d4a8a}
#smw .stage2.violet{background:radial-gradient(ellipse at 50% 100%,#e0a8ff 0%,#7a3aa8 35%,#2a1848 75%,#160c28 100%);border-color:#4a2a7a}
#smw .bigc{position:absolute;left:50%;top:30px;transform:translateX(-50%);width:84px;height:84px;border-radius:50%;border:3px solid #ffd77a;background:radial-gradient(circle at 50% 40%,#fffbe8,#e8d0a0 70%,#b08440);display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px #ffb02e}
#smw .bigc.none{border-style:dashed;opacity:.6;box-shadow:none;color:#6b4a14;font:700 11px Mali;text-align:center}
#smw .lv2{position:absolute;left:0;right:0;top:5px;text-align:center;font:900 14px Mali;color:#fff;text-shadow:0 2px 0 #000,0 0 6px #000}
#smw .sub2{position:absolute;left:0;right:0;bottom:6px;text-align:center;font:800 11px Mali;color:#ffe6a8;text-shadow:0 1px 0 #000,0 0 4px #000}
#smw .chips{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}#smw .chip{font:800 11px Mali;border-radius:8px;padding:2px 7px;background:#fff;border:1.5px solid #9db8e6;color:#2d4a8a}
#smw .chip.g{border-color:#f0a52c;color:#8a5a14;background:#fff8e4}#smw .chip.p{border-color:#b07aff;color:#5a2a9a;background:#f6efff}
#smw .mats{display:flex;gap:8px;align-items:flex-start;margin-top:6px}#smw .mats .lab{font:700 10px Mali;color:#5a6a8a;text-align:center;max-width:64px;margin-top:2px;line-height:1.15}
#smw .act{display:flex;align-items:center;gap:8px;margin-top:8px}#smw .act .ttnote{flex:1}
#smw .grades{display:flex;gap:4px;margin-bottom:6px}#smw .grades button{flex:1;font:800 11.5px Mali;color:#5a3a08;background:linear-gradient(#fff,#e8eefa);border:2px solid #9db8e6;border-radius:9px;padding:4px 2px;cursor:pointer}
#smw .grades button.on{background:linear-gradient(#fff3c4,#ffd77a);border-color:#e2b64e}#smw .grades button.lock{opacity:.5}
#smw .slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}#smw .slots .s{display:flex;flex-direction:column;align-items:center;gap:2px;font:800 10.5px Mali;color:#2d4a8a}
#smw .slots .tts{width:62px;height:62px}
#smw .holes{display:flex;justify-content:center;gap:10px;position:absolute;left:0;right:0;bottom:12px}
#smw .hole{width:40px;height:40px;border-radius:50%;border:3px solid #ffd77a;background:radial-gradient(circle at 50% 40%,#2a2238,#0e0a16);display:flex;align-items:center;justify-content:center;font:900 10px/1.05 Mali;color:#fff;text-align:center;text-shadow:0 1px 0 #000;cursor:default;box-shadow:inset 0 2px 6px #000}
#smw .hole.full{cursor:pointer;box-shadow:0 0 10px currentColor,inset 0 2px 4px rgba(255,255,255,.4)}#smw .hole.none{opacity:.25;border-style:dashed}
#smw .orbs{display:grid;grid-template-columns:repeat(6,46px);gap:6px;margin-top:4px}
#smw .flow{display:flex;align-items:center;justify-content:center;gap:10px;position:absolute;left:0;right:0;top:38px}
#smw .flow .bigc{position:static;transform:none;width:70px;height:70px}#smw .arrow{font:900 30px Mali;color:#ffd77a;text-shadow:0 0 8px #ffb02e}
#smw .mrow{display:flex;align-items:center;gap:6px;padding:6px;border-radius:12px;background:linear-gradient(#fff,#eef4ff);border:2px solid #c6d6f2;margin-bottom:6px}
#smw .mrow .arrow{font-size:22px;color:#f0a52c;text-shadow:none}#smw .mrow .info{flex:1;font:700 11px Mali;color:#5a6a8a}#smw .mrow .info b{font-size:12.5px;color:#2d4a8a}
#smw .bonus{font:700 10.5px Mali;color:#5a6a8a;line-height:1.4;margin-top:4px}
#smw .tlist{display:flex;flex-direction:column;gap:4px;margin-top:6px}#smw .tlist div{font:700 11px Mali;color:#4a3a6a;background:#f6efff;border:1.5px solid #c9a8ff;border-radius:8px;padding:3px 7px}
#smw .tlist div.cur{background:linear-gradient(#fff3c4,#ffd77a);border-color:#e2b64e;color:#5a3a08}`;
smCss.textContent+=`
/* ---- painted skin (assets/ui) ---- */
.ttb{background:url(assets/ui/btn_gold.webp) center/100% 100% no-repeat!important;border:0!important;box-shadow:none!important;padding:8px 18px 10px;text-shadow:0 1px 0 #8a4a10,0 0 3px #8a4a10}
.ttb.blue{background-image:url(assets/ui/btn_blue.webp)!important;text-shadow:0 1px 0 #1d4a8a,0 0 3px #1d4a8a}.ttb:disabled{background-image:url(assets/ui/btn_grey.webp)!important;filter:none}
.ttb.sm{padding:4px 11px 6px}
.tts{background:url(assets/ui/slot.webp) center/100% 100% no-repeat!important;border:0!important}.tts.sel{background-image:url(assets/ui/slot_sel.webp)!important;box-shadow:none!important;filter:drop-shadow(0 0 5px #ffb02e)}
.tts.empty{opacity:.45}
#smw .stage2,#rfw .stage{background:url(assets/ui/stage_forge.webp) center/100% 100% no-repeat!important;border:0!important;box-shadow:none!important;height:162px}
#smw .stage2.violet{background-image:url(assets/ui/stage_violet.webp)!important}#smw .stage2.blue{background-image:url(assets/ui/stage_blue.webp)!important}#smw .stage2.jewel{background-image:url(assets/ui/stage_jewel.webp)!important}
#smw .lv2,#rfw .lv{top:20px;font-size:13px}#smw .sub2{bottom:16px}
#smw .bigc,#rfw .big{background:none!important;border:0!important;box-shadow:none!important;border-radius:0;width:118px;height:90px;top:42px;align-items:center}
#smw .bigc>*,#rfw .big>*{filter:drop-shadow(0 4px 6px rgba(0,0,0,.55)) drop-shadow(0 0 10px rgba(255,220,140,.55));transform:scale(1.25)}
#smw .bigc.none,#rfw .big.none{opacity:.75;color:#fff;text-shadow:0 1px 0 #000;align-items:center}
#smw .flow{top:40px}#smw .flow .bigc{width:96px;height:90px;overflow:visible}#smw .bigc,#rfw .big{overflow:visible}
#smw .sub2{left:50%;right:auto;transform:translateX(-50%);background:rgba(20,14,30,.62);border-radius:10px;padding:1px 10px;white-space:nowrap}
#smw .hole{width:42px;height:42px;border:0;background:url(assets/ui/hole.webp) center/100% 100% no-repeat;box-shadow:none}
#smw .hole.none{background-image:url(assets/ui/hole_lock.webp);opacity:.8;border:0}
#smw .hole.full{background:url(assets/ui/hole.webp) center/100% 100% no-repeat!important;box-shadow:none}#smw .hole.full{position:relative}#smw .hole.full img,#smw .hole.full svg{filter:drop-shadow(0 0 6px #fff8) drop-shadow(0 2px 2px #0009)}#smw .hole.full .hv{position:absolute;right:-6px;bottom:-4px;font:900 10px Mali;color:#fff;background:#3a2a4a;border:1.5px solid #ffd77a;border-radius:7px;padding:0 3px;text-shadow:none}
#smw .hole.full span{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:8.5px}
#smw .tttab button{display:flex;align-items:center;justify-content:center;gap:4px;padding:3px 2px}#smw .tttab img{width:30px;height:30px;filter:drop-shadow(0 1px 1px #0008)}
#smw .tttab button:not(.on) img{filter:grayscale(.35) brightness(.9)}
.uiarrow{width:46px;height:auto;filter:drop-shadow(0 0 4px #ffb02e)}#smw .mrow .uiarrow{width:34px}
.ttw .ttx{background:url(assets/ui/x_btn.webp) center/100% 100% no-repeat!important;border:0!important;width:28px;height:28px;color:transparent!important;text-shadow:none!important;top:4px}`;
document.head.appendChild(smCss);
let smSlot='rhand',smTraitSel=null,smTo=null;
const SM_TABS=[['craft','คราฟต์'],['trait','นิสัย'],['refine','ตีบวก'],['move','ย้ายบวก'],['replica','จำลอง'],['socket','เจาะรู'],['merge','รวมหิน']];
let rpSrc=null,rpDst=null;const REP_Z=it=>Math.round(3000*Math.pow((it.grade??((it.tier||1)-1)*3)+1,1.5)/100)*100;
function openSmith(){const w=$('#smw');w.classList.add('open');document.querySelectorAll('.ro').forEach(o=>o.style.zIndex=30);w.style.zIndex=37;buildSmith();}
const smSlotIcon=(sl,g,sz)=>itemIcon({crafted:1,slot:sl,cslot:sl,town:smTown,grade:g,n:'',b:{}},sz);
const matCell=(id,need,label)=>`<div><div class="tts" style="cursor:default" title="${etcName(id)}">${id==='zeny'?'<b style="font:900 15px Mali;color:#b8740c">z</b>':etcIcon(id,28)}<em class="${(BAG[id]||0)>=need?'':'ttwarn'}">${BAG[id]||0}/${need}</em></div><div class="lab">${label||etcName(id)}</div></div>`;
const invGrid=(ids,sel,attr,max=20)=>ids.map(id=>{const it=ITEMS[id],eq=Object.values(EQ).includes(id);return `<div class="tts ${id===sel?'sel':''}" data-${attr}="${id}" title="${it.n}">${itemIcon(it,30)}${it.ref?`<em style="color:${refCol(it.ref)}">+${it.ref}</em>`:''}${eq?'<b class="eq">E</b>':''}</div>`;}).join('')
  +Array.from({length:Math.max(0,max-ids.length)},()=>'<div class="tts empty"></div>').join('');
function buildSmith(){const w=$('#smw');if(!w||!w.classList.contains('open'))return;const here=townHere();
  if(here&&here!=='cap')smTown=here;else if(!smTown||!TOWNS[smTown])smTown=HOME[CHAR]||'vik';
  if(smGrade===null||!CRAFT_G.includes(smGrade))smGrade=CRAFT_G.filter(x=>gradeLv(x)<=PS.lv).pop()??CRAFT_G[0];
  const keep={left:w.style.left,right:w.style.right,top:w.style.top,transform:w.style.transform};
  w.className='ttw open';ttWin('smw','🔨 ช่างตีเหล็ก');Object.assign(w.style,keep);const bd=w.querySelector('.ttbd'),T=TOWNS[smTown],test=!(here&&here!=='cap'),owned=ownedIds();
  let top=`<div class="topbar"><span class="tchip">ช่าง${T.name}</span><span class="ttnote">ของเมืองนี้ได้ <b>${STN[T.pair[0]]} + ${STN[T.pair[1]]}</b> (+${STN[T.third]})</span><span class="zchip">💰 ${fmt(ZENY)}z</span></div>`;
  if(test)top+=`<div class="topbar"><span class="ttnote ttwarn">${here==='cap'?'เมืองหลวงไม่มีช่าง':'ไม่ได้อยู่ในเมือง'} · โหมดทดสอบ เลือกช่าง:</span>${Object.keys(TOWNS).map(r=>`<button class="ttb ${r===smTown?'':'blue'} sm" data-town="${r}">${TOWNS[r].name}</button>`).join('')}</div>`;
  top+=`<div class="tttab">${SM_TABS.map(([k,n])=>`<button class="${smTab===k?'on':''}" data-tab="${k}"><img src="assets/ui/tab_${k}.webp" alt="">${n}</button>`).join('')}</div>`;
  let body='';
  if(!GEAR.includes(smSlot))smSlot='rhand';
  if(smTab==='craft'){const g=smGrade,cost=craftCost(smTown,g),cz=COST.craftZ(g),cr=has('trait_'+smTown),ok=canPay(cost,cz),sl=smSlot,st=craftStats(smTown,sl,g,sl==='rhand'&&classWeapon().magic);
    const affs=Object.keys(AFF).filter(k=>AFF[k].s.includes(SLOTS[sl].code)).map(k=>AFF[k].n);
    body=`<div class="sgrid"><div class="ttp"><h4>📜 เลือกเซ็ทและชิ้น</h4><div class="grades">${CRAFT_G.map(i=>`<button class="${i===g?'on':''} ${gradeLv(i)>PS.lv?'lock':''}" data-grade="${i}">Lv${gradeLv(i)}</button>`).join('')}</div>
      <div class="slots">${GEAR.map(s=>`<div class="s"><div class="tts ${s===sl?'sel':''}" data-slot="${s}">${smSlotIcon(s,g,42)}</div>${SLOTS[s].nm}</div>`).join('')}</div>
      <div class="bonus"><b style="color:#c2541c">โบนัสเซ็ท</b> ${csBonusText(smTown,g)}</div></div>
      <div class="ttp"><div class="stage2"><div class="lv2">${craftName(smTown,sl,g)}</div><div class="bigc">${smSlotIcon(sl,g,58)}</div><div class="sub2">${SLOTS[sl].nm} · Lv${gradeLv(g)} · สุ่มสถานะพิเศษ 1–3 ช่อง</div></div>
      <div class="chips">${Object.entries(st).map(([k,v])=>`<span class="chip">${STN[k]||k.toUpperCase()} +${v}</span>`).join('')}</div>
      <div class="chips">${affs.slice(0,8).map(a=>`<span class="chip p">${a}</span>`).join('')}</div>
      <div class="mats">${cost.map(([id,n])=>matCell(id,n)).join('')}${cr?matCell('trait_'+smTown,1,'ผลึกนิสัย (เลือกใส่)'):''}</div>
      <div class="act"><span class="ttnote">ค่าคราฟต์ <b style="color:${ZENY>=cz?'#b8740c':'#d23a2a'}">${fmt(cz)}z</b></span>
        ${cr?`<button class="ttb blue" data-craft="${sl}" data-wt="1" ${ok?'':'disabled'}>✦ คราฟต์+นิสัย</button>`:''}<button class="ttb" data-craft="${sl}" ${ok?'':'disabled'}>⚒ คราฟต์</button></div></div></div>`;}
  else if(smTab==='trait'){const L=owned.filter(id=>ITEMS[id].crafted&&ITEMS[id].town===smTown);if(!L.includes(smTraitSel))smTraitSel=L[0]||null;const it=smTraitSel&&ITEMS[smTraitSel],cost=[['trait_'+smTown,1]],ok=it&&canPay(cost,COST.traitZ);
    const TL=Object.entries(TRAITS).filter(([k,v])=>v.town===smTown);
    body=`<div class="sgrid"><div class="ttp"><h4>🎒 ของคราฟ${T.name}</h4><div class="inv">${invGrid(L,smTraitSel,'tsel')}</div>${L.length?'':'<div class="ttnote" style="margin-top:6px">ยังไม่มีของที่คราฟจากช่างเมืองนี้</div>'}</div>
      <div class="ttp"><div class="stage2 violet"><div class="lv2">${it?it.n:'เลือกของทางซ้าย'}</div><div class="bigc ${it?'':'none'}">${it?itemIcon(it,58):'ยังไม่<br>เลือก'}</div><div class="sub2">${it?(it.trait?'นิสัยตอนนี้: ✦ '+TRAITS[it.trait].n:'ยังไม่มีนิสัย'):''}</div></div>
      <div class="tlist">${TL.map(([k,v])=>`<div class="${it&&it.trait===k?'cur':''}">✦ <b>${v.n}</b> — ${v.d(1)}</div>`).join('')}</div>
      <div class="mats">${matCell('trait_'+smTown,1,'ผลึกนิสัย')}</div>
      <div class="act"><span class="ttnote">สุ่ม 1 แบบ · แรงขึ้นตามระดับไอเทม · ค่าใช้ <b>${fmt(COST.traitZ)}z</b></span><button class="ttb" ${it?`data-trait="${smTraitSel}"`:''} ${ok?'':'disabled'}>✦ ${it&&it.trait?'สุ่มนิสัยใหม่':'ใส่นิสัย'}</button></div></div></div>`;}
  else if(smTab==='move'){const src=owned.filter(id=>(ITEMS[id].ref||0)>0&&!ITEMS[id].broken);if(!src.includes(smFrom))smFrom=src[0]||null;const f=ITEMS[smFrom];
    const dst=f?owned.filter(id=>id!==smFrom&&!ITEMS[id].broken&&ITEMS[id].slot===f.slot&&(ITEMS[id].ref||0)<f.ref-1):[];if(!dst.includes(smTo))smTo=dst[0]||null;const to=smTo&&ITEMS[smTo];
    const z=to?COST.moveZ(to.grade??((to.tier||1)-1)*3,f.ref):0;
    body=`<div class="sgrid"><div class="ttp"><h4>⬅ ย้ายจาก (ของที่ตีบวกแล้ว)</h4><div class="inv" style="max-height:140px">${invGrid(src,smFrom,'from',10)}</div>
      <h4 style="margin-top:8px">➡ ไปที่ (ช่องเดียวกัน)</h4><div class="inv" style="max-height:140px">${invGrid(dst,smTo,'mto',10)}</div></div>
      <div class="ttp"><div class="stage2 blue" style="height:170px"><div class="lv2">ย้ายระดับบวก</div>
        <div class="flow"><div class="bigc ${f?'':'none'}">${f?itemIcon(f,48):'?'}</div><img class="uiarrow" src="assets/ui/arrow.webp" alt="➜"><div class="bigc ${to?'':'none'}">${to?itemIcon(to,48):'?'}</div></div>
        <div class="sub2">${f?`<span style="color:${refCol(f.ref)}">+${f.ref}</span> ➜ +0`:''}${to?` · <span style="color:${refCol(to.ref||0)}">+${to.ref||0}</span> ➜ <span style="color:${refCol(f.ref-1)}">+${f.ref-1}</span>`:''}</div></div>
      <div class="ttnote" style="margin-top:6px">${f?f.n:'ยังไม่มีของที่ตีบวกไว้'}${to?' ➜ '+to.n:f?' · ไม่มีของช่องเดียวกันที่รับได้':''}</div>
      <div class="ttnote">ของใหม่ได้บวก <b>−1</b> จากของเดิม · ของเก่ากลับเป็น +0 · ใช้ Zeny เท่านั้น</div>
      <div class="act"><span class="ttnote">ค่าย้าย <b style="color:${ZENY>=z?'#b8740c':'#d23a2a'}">${fmt(z)}z</b></span><button class="ttb" ${to?`data-move="${smTo}"`:''} ${to&&ZENY>=z?'':'disabled'}>⇄ ย้ายบวก</button></div></div></div>`;}
  else if(smTab==='replica'){const has8=id=>{const S=itemSt(id);return S&&ST8.some(k=>(S.st0||S.st)[k]);};const src=owned.filter(has8);if(!src.includes(rpSrc))rpSrc=null;const s=rpSrc&&ITEMS[rpSrc];
    const dst=s?owned.filter(id=>id!==rpSrc&&ITEMS[id].slot===s.slot):owned.filter(id=>ITEMS[id].rep);if(!dst.includes(rpDst))rpDst=null;const d=rpDst&&ITEMS[rpDst];
    const S1=s&&itemSt(rpSrc),S2=d&&itemSt(rpDst),base=S2?(S2.st0||S2.st):{},after=S1?(S1.st0||S1.st):{};const z=d?REP_Z(d):0,ok=s&&d&&ZENY>=z,eqSrc=s&&Object.values(EQ).includes(rpSrc);
    const rows=s&&d?ST8.filter(k=>base[k]||after[k]).map(k=>{const v=base[k]||0,f=after[k]||0,df=f-v;return `<span class="chip ${df>0?'g':''}">${STN[k]} ${v}${df?` <b style="color:${df>0?'#2a9a28':'#d23a2a'}">${df>0?'+':''}${df}</b>`:''}</span>`;}).join(''):'';
    body=`<div class="sgrid"><div class="ttp"><h4>📋 ต้นแบบ (ให้สเตตัส · จะหายไป)</h4><div class="inv" style="max-height:140px">${invGrid(src,rpSrc,'rpsrc',10)}</div>
      <h4 style="margin-top:8px">◈ ตัวรับ (ช่องเดียวกัน · เก็บความสามารถเดิม)</h4><div class="inv" style="max-height:140px">${invGrid(dst,rpDst,'rpdst',10)}</div></div>
      <div class="ttp"><div class="stage2 violet" style="height:170px"><div class="lv2">จำลองสเตตัส (Replica)</div>
        <div class="flow"><div class="bigc ${s?'':'none'}">${s?itemIcon(s,48):'ต้นแบบ'}</div><img class="uiarrow" src="assets/ui/arrow.webp" alt="➜"><div class="bigc ${d?'':'none'}">${d?itemIcon(d,48):'ตัวรับ'}</div></div>
        <div class="sub2">${s?s.n:'เลือกต้นแบบ'}${d?' ➜ '+d.n:''}</div></div>
      <div class="chips">${rows||'<span class="ttnote">เลือกต้นแบบก่อน แล้วเลือกตัวรับช่องเดียวกัน</span>'}</div>
      ${S1&&S2&&S1.lv>S2.lv?`<div class="ttnote ttwarn">เลเวลที่ต้องใช้ของตัวรับจะเป็น Lv${S1.lv} ตามต้นแบบ</div>`:''}<div class="ttnote">ตัวรับ<b>เก็บ</b> สถานะพิเศษ · นิสัย · โบนัสเซ็ท · ตีบวก · หิน ไว้ทั้งหมด เปลี่ยนแค่สเตตัสหลักเป็นของต้นแบบ · ต้นแบบ<b class="ttwarn">จะหายไป</b>${eqSrc?' · <b class="ttwarn">ถอดต้นแบบก่อน</b>':''}</div>
      <div class="act"><span class="ttnote">ค่าจำลอง <b style="color:${ZENY>=z?'#b8740c':'#d23a2a'}">${fmt(z)}z</b></span>
        ${!s&&d&&d.rep?`<button class="ttb blue" data-rpclear="${rpDst}">ล้างสเตตัสจำลอง</button>`:''}<button class="ttb" ${ok&&!eqSrc?'data-rpgo="1"':''} ${ok&&!eqSrc?'':'disabled'}>◈ จำลองสเตตัส</button></div></div></div>`;}
  else if(smTab==='socket'){if(!smPick||!ITEMS[smPick]||!owned.includes(smPick))smPick=owned[0];const it=smPick&&ITEMS[smPick],S=it&&itemSt(smPick),cap=it?Math.max(holeCap(it),S.sockets):0,orbs=Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind==='orb');
    body=`<div class="sgrid"><div class="ttp"><h4>🎒 อุปกรณ์ของฉัน</h4><div class="inv">${invGrid(owned,smPick,'pick')}</div></div>
      <div class="ttp"><div class="stage2" style="height:170px"><div class="lv2">${it?it.n:'เลือกอุปกรณ์'}</div><div class="bigc" style="top:26px;width:72px;height:72px">${it?itemIcon(it,48):''}</div>
        <div class="holes">${Array.from({length:Math.max(4,cap)},(_,i)=>i).map(i=>!it||i>=cap?'<div class="hole none"></div>':i<S.orbs.length?`<div class="hole full" data-unsock="${i}" title="${STN[S.orbs[i].s]} +${S.orbs[i].v} — คลิกเพื่อถอดหิน">${etcIcon(`orb_${S.orbs[i].s}_${S.orbs[i].t||1}`,30)}<b class="hv">+${S.orbs[i].v}</b></div>`:i<S.sockets?'<div class="hole" title="รูว่าง — คลิกหินด้านล่าง"></div>':'<div class="hole" style="border-color:#7a6a4a;opacity:.55" title="ยังไม่ได้เจาะ"></div>').join('')}</div></div>
      <div class="mats">${matCell('drill',1,'สว่าน (เจาะใหม่)')}${matCell('pliers',1,'คีม (ถอดแล้วหินคืน)')}<div style="flex:1"><div class="ttnote">ชิ้นนี้เจาะได้สูงสุด <b>${cap} รู</b>${it&&it.dset!==undefined?' (ของเซ็ทดรอป)':''} · สุ่ม 1 รู 45% · 2 รู 30% · 3 รู 18% · 4 รู 7%</div>
        <div class="act" style="margin-top:4px"><button class="ttb" data-drill="1" ${it&&has('drill')?'':'disabled'}>◎ เจาะรู</button></div></div></div>
      <h4 style="margin-top:6px">💎 หินออฟในกระเป๋า <span class="ttnote">— คลิกเพื่อยัดลงรูว่าง</span></h4><div class="orbs">${orbs.length?orbs.map(k=>`<div class="tts" data-sock="${k}" title="${ETC[k].th} — ${ETC[k].d}">${etcIcon(k,30)}<em>${BAG[k]}</em></div>`).join(''):'<span class="ttnote">ยังไม่มีหิน (ดรอปจากมอนทุกตัว)</span>'}</div></div></div>`;}
  else if(smTab==='merge'){const orbOf=t=>Object.keys(BAG).filter(k=>ETC[k]&&ETC[k].kind==='orb'&&ETC[k].tier===t),cnt=t=>orbOf(t).reduce((s,k)=>s+BAG[k],0),rep=t=>orbOf(t).sort((a,b)=>BAG[b]-BAG[a])[0]||`orb_atk_${t}`;
    body=`<div class="ttp"><div class="stage2 jewel" style="height:120px;margin-bottom:8px"><div class="lv2">💎 โต๊ะรวมหินออฟ</div></div><h4>💎 รวมหินออฟ <span class="ttnote">— หินขั้นเดียวกัน 3 ก้อน (ชนิดใดก็ได้) → หินขั้นถัดไป 1 ก้อน ชนิดสุ่ม</span></h4>`+[1,2,3].map(t=>{const n=cnt(t),z=COST.mergeZ(t),ok=n>=3&&ZENY>=z,r=rep(t);
      return `<div class="mrow">${[0,1,2].map(i=>`<div class="tts" style="cursor:default;${i<n?'':'opacity:.35'}">${etcIcon(r,28)}</div>`).join('')}<img class="uiarrow" src="assets/ui/arrow.webp" alt="➜">
        <div class="tts" style="cursor:default;border-color:#f0a52c;background:radial-gradient(circle at 50% 35%,#fffbe8,#ffe39a)">${etcIcon(`orb_atk_${t+1}`,28)}<i>?</i></div>
        <div class="info"><b>ขั้น ${t} → ขั้น ${t+1}</b><br>มีหินขั้น ${t} รวม <b style="color:${n>=3?'#2a9a28':'#d23a2a'}">${n}</b>/3 · ค่ารวม <b style="color:${ZENY>=z?'#b8740c':'#d23a2a'}">${fmt(z)}z</b></div>
        <button class="ttb" data-merge="${t}" ${ok?'':'disabled'}>💎 รวม</button></div>`;}).join('')+`</div>`;}
  bd.innerHTML=top+body;
  const q=(s,f)=>bd.querySelectorAll(s).forEach(b=>b.onclick=ev=>{ev.stopPropagation();f(b);});
  q('[data-tab]',b=>{if(b.dataset.tab==='refine'){w.classList.remove('open');openRefine();return;}smTab=b.dataset.tab;buildSmith();});
  q('[data-town]',b=>{smTown=b.dataset.town;buildSmith();});q('[data-grade]',b=>{smGrade=+b.dataset.grade;buildSmith();});q('[data-slot]',b=>{smSlot=b.dataset.slot;buildSmith();});
  q('[data-craft]',b=>{if(eqFull()){msg(`กระเป๋าอุปกรณ์เต็ม (${BAG_EQ_MAX}) — ฝากของในคลังก่อน`);return;}const sl=b.dataset.craft,g=smGrade,cost=craftCost(smTown,g),cz=COST.craftZ(g);if(b.dataset.wt)cost.push(['trait_'+smTown,1]);if(!canPay(cost,cz))return;pay(cost,cz);
    const tr=b.dataset.wt?rollTrait(smTown):null,id=craftItem(smTown,sl,g,tr),it=ITEMS[id];INV.push(id);
    done(`คราฟต์สำเร็จ: ${it.n} ${stars(it)} — ${it.aff.map(a=>affLabel(a.k,a.v)).join(' · ')}${tr?' · ✦'+TRAITS[tr].n:''}`);buildSmith();});
  q('[data-tsel]',b=>{smTraitSel=b.dataset.tsel;buildSmith();});
  q('[data-trait]',b=>{const id=b.dataset.trait,cost=[['trait_'+smTown,1]];if(!canPay(cost,COST.traitZ))return;pay(cost,COST.traitZ);ITEMS[id].trait=rollTrait(smTown,ITEMS[id].trait);done(`${ITEMS[id].n} ได้นิสัย ✦${TRAITS[ITEMS[id].trait].n}`);buildSmith();});
  q('[data-from]',b=>{smFrom=b.dataset.from;smTo=null;buildSmith();});q('[data-mto]',b=>{smTo=b.dataset.mto;buildSmith();});
  q('[data-move]',b=>{const to=ITEMS[b.dataset.move],f=ITEMS[smFrom];if(!to||!f)return;const z=COST.moveZ(to.grade??((to.tier||1)-1)*3,f.ref);if(ZENY<z)return;ZENY-=z;to.ref=f.ref-1;f.ref=0;done(`ย้ายบวกสำเร็จ: ${to.n} +${to.ref}`);buildSmith();});
  q('[data-pick]',b=>{smPick=b.dataset.pick;buildSmith();});
  q('[data-rpsrc]',b=>{rpSrc=b.dataset.rpsrc===rpSrc?null:b.dataset.rpsrc;rpDst=null;buildSmith();});q('[data-rpdst]',b=>{rpDst=b.dataset.rpdst;buildSmith();});
  q('[data-rpgo]',()=>{const s=ITEMS[rpSrc],d=ITEMS[rpDst];if(!s||!d||s.slot!==d.slot)return;const z=REP_Z(d);if(ZENY<z)return;if(!confirm(`จำลองสเตตัสของ ${s.n} ไปให้ ${d.n}?\n${s.n} จะหายไป`))return;
    const S=itemSt(rpSrc),st={...(S.st0||S.st)};ZENY-=z;d.rep={n:s.n,st,lv:S.lv};destroyItem(rpSrc);rpSrc=null;done(`◈ จำลองสเตตัสสำเร็จ: ${d.n} ใช้สเตตัสของ ${d.rep.n}`);buildSmith();});
  q('[data-rpclear]',b=>{const d=ITEMS[b.dataset.rpclear];if(!d||!confirm(`ล้างสเตตัสจำลองของ ${d.n}? (กลับเป็นสเตตัสเดิม ต้นแบบไม่คืน)`))return;delete d.rep;done(`ล้างสเตตัสจำลอง ${d.n} แล้ว`);buildSmith();});
  q('[data-drill]',()=>doDrill(smPick));q('[data-sock]',b=>doSocket(smPick,b.dataset.sock));q('[data-unsock]',b=>doUnsocket(smPick,+b.dataset.unsock));
  q('[data-merge]',b=>doMerge(+b.dataset.merge));}
/* ---------------- auto potion (owner 2026-11-19: no potion buttons, potions are used by themselves) ----------------
   HP below the set level → best HP potion for the HP missing; SP below its level → biggest SP potion (same pick as F / V).
   Uses the normal 0.6 s potion cooldown. Settings ⚙ → AUTO POTION, saved in 'af_autopot_hp' / 'af_autopot_sp' (0 = off). */
const APOT={hp:[['0','ปิด'],['30','30%'],['50','50%'],['70','70%']],sp:[['0','ปิด'],['20','20%'],['30','30%'],['50','50%']]},APOT_DEF={hp:'50',sp:'30'};
const apGet=k=>{try{return +(localStorage.getItem('af_autopot_'+k)??APOT_DEF[k]);}catch(e){return +APOT_DEF[k];}};
let apWarn={hp:0,sp:0};
setInterval(()=>{try{if(typeof player==='undefined'||player.hp<=0||player.dead)return;
  for(const [k,cur,max] of [['hp',player.hp,player.maxHp],['sp',player.mp,player.maxMp]]){const th=apGet(k);if(!th||cur>=max*th/100)continue;
    const id=bestPot(k);if(id){useItem(id);break;}
    if(Date.now()-apWarn[k]>60000){apWarn[k]=Date.now();msg(k==='hp'?'ยา HP หมด (กินยาอัตโนมัติ)':'ยา SP หมด (กินยาอัตโนมัติ)');}}}catch(e){}},250);
(function apUI(){const p=document.getElementById('panel');if(!p){setTimeout(apUI,500);return;}if(document.getElementById('apHp'))return;
  const frag=document.createDocumentFragment();
  for(const k of ['sp','hp']){const h=document.createElement('h3');h.textContent=k==='hp'?'AUTO POTION · กินยา HP เมื่อต่ำกว่า':'AUTO POTION · กินยา SP เมื่อต่ำกว่า';
    const g=document.createElement('div');g.className='seg';g.id=k==='hp'?'apHp':'apSp';g.innerHTML=APOT[k].map(([v,t])=>`<button data-v="${v}">${t}</button>`).join('');
    const sy=()=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.v===apGet(k)));
    g.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();try{localStorage.setItem('af_autopot_'+k,b.dataset.v);}catch(_){}sy();});sy();
    p.insertBefore(g,p.firstChild);p.insertBefore(h,g);}})();
window.AFItems={buyGear(id,price){if(ZENY<price)return false;ZENY-=price;INV.push(id);save();try{buildItems();buildEquip();}catch(e){}return true;},dropItem(id){delete ITEMS[id];},get ITEMS(){return ITEMS;},eqFair:(g,r)=>Math.round(1500*Math.pow(g+1,1.6)*(1+(r||0)*.35)),dropSetItem,DSET,DROP,openRefine,openMarket,BAG,ETC,CONS,TRAITS,TOWNS,AFF,MATS,SLOTS,W_NOUN,useItem,BUFF,newGame,openStorage,STO,townHere,HOME,get zeny(){return ZENY;},set zeny(v){ZENY=v;save();},add:(id,n)=>{add(id,n);save();},craftItem,rollAffixes,openSmith,openShop,save,
  ui:{ttWin,etcIcon,etcName,fmt,done},bagAdd:add,MODE,SHOP_FULL,oldMarket:{MK,mkSave},openGearMarket,get fresh(){return FRESH;},          // for market.js
  reset(){localStorage.removeItem(SKEY);location.reload();}};
})();
