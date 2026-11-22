/* =====================================================================
   AETHERFALL — MONSTER ROSTER (Ragnarok-style). Loaded AFTER maps/level-zones.js.
   • Adds a third monster to every field / dungeon map (the region files list two).
   • Gives every monster a role → stats & behaviour (index.html vkVar / enemyAI):
       critter  weak, never attacks first, many of them (maps next to town)
       normal   default
       brute    slow, more HP / DEF, fewer of them
       swift    fast, high FLEE, low HP
       aggr:1   attacks the player on sight (RO "aggressive" monster)
     Bosses / MVPs: boss_fenrir.js (Fenrir · vikD2c) + map_bosses.js (stand-in map bosses on every D1b / H1 / H2). Others not added yet.
   • New monsters take their level from the map band (MAP_ZONE) — lvf = fraction of the band.
   Sprites: the frostling (2-legged) / snow-wolf (4-legged) models recoloured, until each
   monster gets its own sprite sheet.
   ===================================================================== */
(function(){
const MONS=window.VK_MONS,ZONE=window.MAP_ZONE;if(!MONS||!ZONE)return;
const F=(name,th,tint,sc,role,lvf,o)=>Object.assign({base:'frostling',name,th,tint,sc,role,lvf},o||{});   // 2-legged / floating
const W=(name,th,flt,sc,role,lvf,o)=>Object.assign({base:'snowwolf',name,th,flt,sc,role,lvf},o||{});     // 4-legged
const A={aggr:1},LO=[0,.55],MID=[.2,.85],HI=[.45,1];

const ADD={
/* ---------- Viking · Frostheim ---------- */
  snowpine:[F('Pinecone Sprite','ภูตลูกสน','#8a6a40',.72,'critter',LO)],
  vikF2:[F('Icicle Bat','ค้างคาวหินย้อยน้ำแข็ง','#9fc8f0',.75,'swift',HI)],
  vikF3:[F('Runestone Golem','โกเลมหินรูน','#7a8a78',1.25,'brute',HI)],
  vikF4:[F('Narwhal Raider','นาร์วาลจอมปล้น','#8aa8c8',1.1,'normal',HI,A)],
  vikF5:[F('Thatch Troll','โทรลหลังคาฟาง','#7a9a58',1.3,'brute',HI)],
  vikF6:[W('Avalanche Ram','แกะเขาหิมะถล่ม','brightness(1.25) saturate(.3)',1.05,'brute',HI)],
  vikD1a:[F('Lamp Beetle','ด้วงตะเกียง','#e0a040',.8,'swift',LO,A)],
  vikD1b:[F('Runesmith Revenant','ช่างรูนอมตะ','#4a6080',1.05,'normal',MID,A)],
  vikH1:[F('Blackpine Treant','ต้นสนดำมีชีวิต','#2f3a2a',1.35,'brute',HI,A)],
  vikH2:[W('Frost Mammoth Calf','ลูกช้างแมมมอธ','sepia(.7) brightness(.75)',1.3,'brute',HI)],
  vikD2a:[F('Gleipnir Weaver','ช่างทอโซ่เกลปเนียร์','#5a4a8a',1,'swift',MID,A)],
  vikD2b:[F('Chain Wraith','วิญญาณโซ่','#7a7f90',1.1,'normal',HI,A)],
  vikD2c:[W('Fenrir Shade Hound','หมาเงาเฟนเรียร์','brightness(.25) contrast(1.6) hue-rotate(200deg)',1.2,'swift',HI,A)],
  vikE1:[F('Drowned Shieldmaiden','วาลคิรีจมน้ำ','#5aa8a0',1.05,'swift',HI,A)],
  vikE2:[F('Glacier Wyrmling','ลูกมังกรธารน้ำแข็ง','#a8e0ff',1.3,'brute',HI,A)],
/* ---------- Aztec · Xochitlan ---------- */
  aztF1:[F('Leafcutter Ant','มดตัดใบ','#a0602a',.7,'critter',LO)],
  aztF2:[W('Baby Tapir','ลูกสมเสร็จ','brightness(.6) saturate(.4)',.8,'critter',LO)],
  aztF3:[F('Corn Spirit','ภูตข้าวโพด','#f0d060',.9,'normal',HI)],
  aztF4:[F('Swamp Leech','ปลิงหนองน้ำ','#4a5a30',.85,'swift',MID)],
  aztF5:[F('Macaw Raider','นกมาคอว์จอมปล้น','#e04a3a',.9,'swift',HI,A)],
  aztF6:[F('Vine Snapper','ดอกไม้กินคน','#4aa040',1.15,'brute',HI)],
  aztD1a:[F('Glowworm Swarm','ฝูงหนอนเรืองแสง','#a0f080',.8,'swift',LO,A)],
  aztD1b:[F('Cave Shaman','หมอผีถ้ำ','#8a4a6a',1,'normal',MID,A)],
  aztH1:[F('Dart Shaman','หมอผีลูกดอกพิษ','#60b050',.95,'normal',HI,A)],
  aztH2:[F('Rain Spirit','ภูตฝนตลาล็อก','#60a0e0',1.05,'swift',HI)],
  aztD2a:[F('Obsidian Priest','นักบวชออบซิเดียน','#2a2030',1.05,'normal',HI,A)],
  aztD2b:[F('Sun Sentinel','ทหารเฝ้าสุริยะ','#f0a020',1.25,'brute',HI,A)],
  aztD2c:[F('Sunfeather Priestess','นักบวชหญิงขนนกสุริยะ','#30c0a0',1.05,'normal',HI,A)],
  aztE1:[F('Jungle Titan','ยักษ์ป่าดงดิบ','#3a7a30',1.5,'brute',HI,A)],
  aztE2:[F('Volcano Salamander','ซาลาแมนเดอร์ภูเขาไฟ','#ff5020',1.1,'swift',HI,A)],
/* ---------- Greek · Ionia ---------- */
  grkF1:[W('Wild Lamb','ลูกแกะป่า','brightness(1.35) saturate(.1)',.7,'critter',LO)],
  grkF2:[F('Olive Beetle','ด้วงมะกอก','#6a8a30',.75,'critter',LO)],
  grkF3:[F('Nymph','นางไม้','#90d0a0',.9,'swift',HI)],
  grkF4:[F('Bronze Automaton','หุ่นทองแดง','#c08040',1.15,'brute',HI)],
  grkF5:[F('Triton Scout','ไทรทันสอดแนม','#40a0b0',1,'normal',HI,A)],
  grkF6:[W('Erymanthian Boar','หมูป่าเอรีมันทอส','sepia(.9) brightness(.5)',1.15,'brute',HI,A)],
  grkD1a:[F('Rock Lizard','กิ้งก่าหิน','#9a8a70',.85,'swift',LO)],
  grkD1b:[W('Cave Hound','หมาถ้ำ','brightness(.45) sepia(.5)',.95,'swift',MID,A)],
  grkH1:[F('Shade','เงาวิญญาณ','#40405a',1,'swift',HI,A)],
  grkH2:[F('Bronze Hoplite','ทหารโฮพไลต์ทองแดง','#b07a3a',1.15,'brute',HI,A)],
  grkD2a:[W('Labyrinth Hound','หมาเขาวงกต','brightness(.4) sepia(.8)',1.05,'swift',MID,A)],
  grkD2b:[F('Gorgon Shade','เงากอร์กอน','#5a8a50',1.05,'normal',HI,A)],
  grkD2c:[W('Minotaur Calf','ลูกมิโนทอร์','sepia(1) saturate(1.5) brightness(.45)',1.25,'brute',HI,A)],
  grkE1:[F("Charon's Oarsman",'ฝีพายของคาโรน','#405060',1.1,'normal',HI,A)],
  grkE2:[W('Storm Pegasus','เพกาซัสพายุ','brightness(1.4) saturate(.2) hue-rotate(180deg)',1.3,'swift',HI,A)],
/* ---------- Egypt · Kemet ---------- */
  egyF1:[W('Sand Pup','ลูกหมาทะเลทราย','sepia(1) saturate(1.3) brightness(1.15)',.7,'critter',LO)],
  egyF2:[F('Lotus Sprite','ภูตดอกบัว','#80c0f0',.75,'critter',LO)],
  egyF3:[F('Dune Lizard','กิ้งก่าเนินทราย','#d0a050',.85,'swift',MID)],
  egyF4:[F('Sandstone Soldier','ทหารหินทราย','#c8a070',1.1,'brute',HI)],
  egyF5:[F('Cobra','งูเห่า','#3a4a2a',.9,'swift',HI,A)],
  egyF6:[W('Camel Raider','โจรอูฐ','sepia(.9) brightness(.85)',1.2,'normal',HI,A)],
  egyD1a:[F('Tomb Bat','ค้างคาวสุสาน','#4a3a3a',.8,'swift',LO,A)],
  egyD1b:[F('Cursed Scribe','อาลักษณ์ต้องสาป','#d0c090',1,'normal',MID,A)],
  egyH1:[W('Sphinx Cat','แมวสฟิงซ์','sepia(1) saturate(1.8) brightness(.9)',.9,'swift',HI)],
  egyH2:[F('Dust Djinn','จินน์ฝุ่น','#d0b080',1.05,'normal',HI,A)],
  egyD2a:[F('Canopic Spirit','วิญญาณโถคาโนปิก','#a0c0a0',.95,'swift',MID,A)],
  egyD2b:[W('Sekhmet Lioness','สิงโตเซคเมต','sepia(1) saturate(2.4) hue-rotate(-10deg)',1.2,'brute',HI,A)],
  egyD2c:[F('Royal Embalmer','นักทำมัมมี่หลวง','#ffd040',1.05,'normal',HI,A)],
  egyE1:[W('Ammit Devourer','อัมมิตผู้กลืนกิน','hue-rotate(80deg) brightness(.55)',1.35,'brute',HI,A)],
  egyE2:[F('Sun Barge Guardian','ผู้พิทักษ์เรือสุริยะ','#f0c060',1.35,'brute',HI,A)],
/* ---------- Japan · Hakusen ---------- */
  jpnF1:[F('Mochi Rabbit','กระต่ายโมจิ','#f8e8f0',.7,'critter',LO)],
  jpnF2:[F('Paper Lantern','โคมกระดาษ','#f0a040',.8,'critter',LO)],
  jpnF3:[F('Bamboo Sprite','ภูตไผ่','#70b050',.85,'swift',MID)],
  jpnF4:[W('Onsen Capybara','คาปิบาร่าออนเซ็น','sepia(.8) brightness(.8)',.9,'critter',LO)],
  jpnF5:[F('Kodama','โคดามะ','#e0f0d0',.8,'swift',HI)],
  jpnF6:[F('Umibozu Spawn','ลูกอุมิโบซุ','#203040',1.2,'brute',HI,A)],
  jpnD1a:[W('Ninja Hound','สุนัขนินจา','brightness(.3) saturate(.5)',.9,'swift',LO,A)],
  jpnD1b:[F('Smoke Bomber','นินจาระเบิดควัน','#605870',.95,'swift',MID,A)],
  jpnH1:[F('Rokurokubi','โรคุโรคุบิ','#e0d0e8',1,'normal',HI,A)],
  jpnH2:[F('Ashigaru Ghost','ผีทหารอาชิการุ','#7a8070',1.05,'normal',HI,A)],
  jpnD2a:[F('Onryo','วิญญาณอาฆาต','#d0d8f0',1,'swift',MID,A)],
  jpnD2b:[F('Bone Samurai','ซามูไรกระดูก','#e0d8c0',1.15,'brute',HI,A)],
  jpnD2c:[F('Hatamoto Wraith','วิญญาณองครักษ์ฮาตาโมโตะ','#901818',1.15,'brute',HI,A)],
  jpnE1:[F('Raijin Drummer','มือกลองไรจิน','#6080f0',1.2,'normal',HI,A)],
  jpnE2:[W('Storm Kirin','กิเลนพายุ','sepia(1) saturate(2) hue-rotate(160deg) brightness(1.1)',1.3,'swift',HI,A)],
/* ---------- Capital · Aetherfall ---------- */
  cN:[W('Field Rabbit','กระต่ายทุ่ง','brightness(1.3) sepia(.3)',.68,'critter',LO)],
  cW:[F('Dandelion Puff','ปุยแดนดิไลออน','#f8f0a0',.72,'critter',LO)],
  cS:[F('Wild Rooster','ไก่ป่า','#d06030',.75,'swift',MID)],
  cE:[F('Antler Beetle','ด้วงเขากวาง','#5a3a20',.85,'brute',HI)],
  cNE:[F('Scarecrow Knight','อัศวินหุ่นไล่กา','#b09050',1.1,'normal',HI,A)],
  cSW:[F('Frog Bandit','กบโจร','#60a040',.9,'swift',HI,A)],
  cata1:[F('Crypt Spider','แมงมุมสุสาน','#3a3040',.85,'swift',HI,A)],
  cata2:[F('Bone Archer','นักธนูกระดูก','#d8d0b8',1,'normal',MID,A)],
  rift1:[F('Void Mote','ละอองความว่างเปล่า','#8040ff',.8,'swift',MID,A)],
  rift2:[F('Shard Seraph','เซราฟคริสตัล','#f0a0ff',1.1,'normal',HI,A)],
  rift3:[W('Aether Drake','มังกรน้อยเอเธอร์','hue-rotate(250deg) saturate(3) brightness(1.3)',1.3,'brute',HI,A)]};

/* existing monsters that hunt the player on sight (wolf-model monsters already hunt as a pack) */
const AGGR=new Set(['Mad Dwarf Ghost','Forge Golem','Lost Villager','Forest Witchling','Wolf Priest','Draugr','Wolf High Priest','Undying Viking','Frost Giant',
  'Cave Spider','Stone Slave','Mist Spirit','Blood Priest','Sun Priest','Jade Golem','Sun Guardian','Golden Statue','Obsidian Golem','Fire Bird',
  'Little Cyclops','Cyclops','Hecate Witch','Spartan Ghost','Little Medusa','Lost One','Labyrinth Guard','Styx Ghost','Thunder Guard',
  'Noble Mummy','Living Trap','Mummy','Royal Mummy','Pharaoh Guard','Shadow Soldier','Djinn','Giant Scorpion',
  'Shadow Ninja','Kunai Trap','Yurei','Ronin','Undead Ninja','Cursed Doll','Ghost Samurai','Shogun Guard','Oni','Demon Swordsman','Thunder Dragon Priest',
  'Skeleton Soldier','Wraith Knight','Aether Wisp','Crystal Golem','Void Sentinel','Haunted Mill Spirit','Rusted Soldier']);

for(const id in ADD){const z=ZONE[id];if(!z)continue;const L=MONS[id]=MONS[id]||[];
  for(const d of ADD[id]){const f=d.lvf;d.lv=[Math.round(z[0]+f[0]*(z[1]-z[0])),Math.round(z[0]+f[1]*(z[1]-z[0]))];delete d.lvf;L.push(d);}}
/* travel routes (town → capital, and the capital fields joining the regions): nothing attacks first, so players can walk through */
const ROUTE=new Set([...Object.values(window.MAP_ROUTES||{}).flat(),'cN','cW','cS','cE']);
for(const id in MONS){const z=ZONE[id];if(!z)continue;
  const start=z[0]<=5;
  if(ROUTE.has(id))for(const m of MONS[id])m.route=1;
  for(const m of MONS[id]){if(!m.role||start)m.role=start?'critter':'normal';   // maps right next to a start town: everything is passive & weak
    if(m.role==='critter'||m.route)delete m.aggr;else if(AGGR.has(m.name))m.aggr=1;
    if(m.w==null)m.w=m.role==='critter'?3:m.role==='brute'?1:2;}}   // spawn share
})();
