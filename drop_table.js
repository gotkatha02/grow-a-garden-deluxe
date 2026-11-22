/* =====================================================================
   DROP TABLE (owner 2026-11-22 17:42: 'หินตีบวกอาวุธ หินตีบวกชุดเกราะ หินยัดชุด พวกนี้ดรอปจากมอนธรรมดา แต่ไม่ได้ดรอปทุกตัวนะ
   คุณลองจัดๆเอาว่าตัวไหนจะดรอป · เจมสกิลที่อัพผังรูนดรอปจากบอสหรือเอาขยะบอสไปแลกได้ด้วย และพวกเจมต่างๆก็ดรอปจากบอส')
   Rules, numbers and the whole table in Thai: DROP_TABLE_TH.md (re-run `python3 tools/drop_yield.py` after editing this file).
   • NORMAL MONSTERS drop materials / zeny / potions as before + AT MOST ONE special drop, named here by monster:
       w      = Weapon Refine Stone of the monster's tier (wore1–4, refines the weapon)
       a      = Armour Refine Stone of its tier (ore1–4, refines helm / armour / shoes / accessory)
       o:<s>  = orb of stat s (STR AGI VIT INT DEX LUK DEF) of its tier — each orb monster has ONE signature stat (like RO cards)
       ''     = nothing special (about a quarter of the monsters)
     Tier = the monster's level band (items.js tierOfLv): Lv 1–18 / 19–36 / 37–54 / 55–60 → 1 / 2 / 3 / 4.
     Every region has a weapon-stone and an armour-stone monster in every tier it has; some maps are 'hot spots' with two of a kind.
     Themes: w = carries or is made of weapons · a = hard bodies (golems, statues, shells, scales, wraps, armoured guards) ·
             orb = what the monster is (casters INT · shooters DEX · fast AGI · brutes STR · hardy VIT · lucky / golden LUK · stone DEF).
   • BOSSES (map boss / MVP / main boss = relics.js slot tier): the gems (mutation + support, no longer from normal monsters), totem stones,
     essence, Star Ore, a few refine stones and their own BOSS PART (bm_<boss>, the 'boss junk'). Boss parts will be exchanged for
     rune skill gems when the rune roots are built (RUNE_SYSTEM_TH.md §2) and craft the boss sets (BOSS_SET_ICON_PROMPTS_TH.md).
   A boss module marks its monster with e.bossKey = relics.js key (boss_fenrir.js: 'fenrir', map_bosses.js: the 15 map bosses).
   New live boss: live:1 in BOSSES below too.
   ===================================================================== */
(function(){
'use strict';
const MON={
/* Viking · Frostheim */
  'Pinecone Sprite':'','Snow Pup':'o:agi',   // snowpine
  'Fang Hare':'o:luk','Big Frostling':'a','Icicle Bat':'',   // vikF2
  'Hound of the Raiders':'w','Lost Villager':'','Thatch Troll':'o:str',   // vikF5
  'Rune Wisp':'o:int','Moor Wolf':'','Runestone Golem':'o:def',   // vikF3
  'Pass Wolf':'','Yeti Cub':'o:vit','Avalanche Ram':'a',   // vikF6
  'Ice Crab':'a','Fjord Seal Spirit':'','Narwhal Raider':'w',   // vikF4
  'Lamp Beetle':'o:dex','Mad Dwarf Ghost':'w','Ore Golem':'a',   // vikD1a
  'Shadow Wolf':'o:agi','Forest Witchling':'o:int','Blackpine Treant':'a',   // vikH1
  'Young Yeti':'o:str','Tundra Wolf':'','Frost Mammoth Calf':'o:vit',   // vikH2
  'Forge Golem':'w','Runesmith Revenant':'w','Ice Bat Pack':'o:agi',   // vikD1b
  'Undying Viking':'o:str','Sea Ghost Wolf':'','Drowned Shieldmaiden':'o:def',   // vikE1
  'Frost Giant':'a','Dark Valkyrie Wolf':'o:luk','Glacier Wyrmling':'a',   // vikE2
  'Fenrir Spawn':'o:str','Gleipnir Weaver':'o:dex','Wolf Priest':'o:int',   // vikD2a
  'Draugr':'w','Draugr Wolf':'','Chain Wraith':'a',   // vikD2b
  'Fenrir Guard':'w','Wolf High Priest':'','Fenrir Shade Hound':'o:agi',   // vikD2c
/* Greek · Ionia */
  'Mountain Goat':'o:agi','Wild Lamb':'','Olive Sprite':'',   // grkF1
  'Marble Crab':'a','Olive Beetle':'','Walking Statue':'o:def',   // grkF2
  'Siren':'o:int','Harpy':'o:dex','Triton Scout':'w',   // grkF5
  'Satyr':'o:luk','Honey Bee':'','Nymph':'o:vit',   // grkF3
  'Young Centaur':'w','Black Wolf':'','Erymanthian Boar':'a',   // grkF6
  'Cracked Soldier':'w','Philosopher Ghost':'o:int','Bronze Automaton':'a',   // grkF4
  'Little Cyclops':'w','Rock Lizard':'o:agi','Giant Ram':'a',   // grkD1a
  'Hecate Witch':'o:int','Little Cerberus':'o:str','Shade':'',   // grkH1
  'Spartan Ghost':'w','Amazon':'o:dex','Bronze Hoplite':'a',   // grkH2
  'Cave Bat':'o:agi','Cave Hound':'','Cyclops':'w',   // grkD1b
  'Cerberus':'o:str','Styx Ghost':'',"Charon's Oarsman":'o:luk',   // grkE1
  'Griffin':'a','Thunder Guard':'w','Storm Pegasus':'o:agi',   // grkE2
  'Labyrinth Hound':'o:agi','Little Medusa':'o:def','Stone Bull':'a',   // grkD2a
  'Lost One':'','Gorgon Shade':'o:int',   // grkD2b
  'Bronze Bull':'o:vit','Labyrinth Guard':'w','Minotaur Calf':'o:str',   // grkD2c
/* Egypt */
  'Little Scorpion':'','Sand Pup':'','Scarab':'o:luk',   // egyF1
  'Baby Hippo':'o:vit','Lotus Sprite':'','Ibis':'o:int',   // egyF2
  'Mummy':'a','Jackal Soldier':'w','Cobra':'o:agi',   // egyF5
  'Desert Fox':'o:luk','Dune Lizard':'','Little Mummy':'a',   // egyF3
  'Little Sphinx':'o:int','Desert Vulture':'','Camel Raider':'w',   // egyF6
  'Ghost Slave':'','Granite Golem':'o:def','Sandstone Soldier':'w',   // egyF4
  'Sand Worm':'o:vit','Giant Scorpion':'a','Dust Djinn':'o:int',   // egyH2
  'Ram Statue':'o:def','Dark Cat Priest':'o:luk','Sphinx Cat':'o:agi',   // egyH1
  'Noble Mummy':'a','Tomb Bat':'o:agi','Flesh Beetle':'o:dex',   // egyD1a
  'Living Trap':'w','Cursed Scribe':'o:int','Tomb Jackal':'',   // egyD1b
  'Set Beast':'o:str','Shadow Soldier':'w','Ammit Devourer':'a',   // egyE1
  'Giant Sand Worm':'o:vit','Djinn':'o:luk','Sun Barge Guardian':'w',   // egyE2
  'Anubis Guard':'w','Canopic Spirit':'o:int','Royal Mummy':'a',   // egyD2a
  'Giant Scarab':'o:def','Sekhmet Lioness':'o:str',   // egyD2b
  'Golden Jackal':'o:luk','Pharaoh Guard':'a','Royal Embalmer':'o:dex',   // egyD2c
/* Japan */
  'Mochi Rabbit':'','Tanuki':'o:luk','Petal Sprite':'',   // jpnF1
  'Kappa':'a','Paper Lantern':'','Walking Scarecrow':'',   // jpnF2
  'Kitsune':'o:int','Tengu':'o:dex','Kodama':'',   // jpnF5
  'Red Panda':'','Bamboo Sprite':'o:agi','Ninja Trainee':'w',   // jpnF3
  'Wako Pirate':'w','Little Octopus':'','Umibozu Spawn':'o:vit',   // jpnF6
  'Onsen Capybara':'','Snow Monkey':'','Steam Spirit':'o:int',   // jpnF4
  'Ninja Hound':'o:agi','Shadow Ninja':'w','Giant Toad':'a',   // jpnD1a
  'Yurei':'o:int','Spirit Wolf':'','Rokurokubi':'o:dex',   // jpnH1
  'Ronin':'w','War Horse':'o:vit','Ashigaru Ghost':'a',   // jpnH2
  'Kunai Trap':'w','Smoke Bomber':'o:dex',   // jpnD1b
  'Oni':'o:str','Demon Swordsman':'w','Raijin Drummer':'o:int',   // jpnE1
  'Great Serpent':'a','Thunder Dragon Priest':'','Storm Kirin':'o:luk',   // jpnE2
  'Cursed Doll':'','Onryo':'o:int','Undead Ninja':'o:dex',   // jpnD2a
  'Ghost Samurai':'w','Bone Samurai':'a',   // jpnD2b
  'Shadow Hound':'o:agi','Shogun Guard':'a','Hatamoto Wraith':'',   // jpnD2c
/* Aztec · Xochitlan */
  'Dart Frog':'o:dex','Leafcutter Ant':'','Howler Monkey':'',   // aztF1
  'Baby Tapir':'','Wild Axolotl':'o:vit','Quetzal':'',   // aztF2
  'Feathered Serpent':'o:int','Stone Mask Warrior':'w','Macaw Raider':'o:agi',   // aztF5
  'Maize Rat':'o:luk','Scarecrow God':'','Corn Spirit':'',   // aztF3
  'Black Jaguar':'o:str','Lost Priest':'','Vine Snapper':'a',   // aztF6
  'Young Crocodile':'a','Giant Frog':'','Swamp Leech':'',   // aztF4
  'Giant Bat':'o:agi','Glowworm Swarm':'','Cave Spider':'o:dex',   // aztD1a
  'Jaguar Warrior':'w','Mist Spirit':'','Dart Shaman':'o:int',   // aztH1
  'Eagle Warrior':'w','Blood Priest':'o:str','Rain Spirit':'',   // aztH2
  'Stone Slave':'o:def','Cave Shaman':'o:int','Vampire Bat Pack':'o:agi',   // aztD1b
  'Golden Statue':'o:luk','Jaguar King':'o:str','Jungle Titan':'a',   // aztE1
  'Obsidian Golem':'w','Fire Bird':'','Volcano Salamander':'o:agi',   // aztE2
  'Golden Serpent':'o:luk','Obsidian Priest':'w','Sun Priest':'o:int',   // aztD2a
  'Jade Golem':'a','Temple Jaguar':'o:str','Sun Sentinel':'w',   // aztD2b
  'Obsidian Jaguar':'o:agi','Sun Guardian':'a','Sunfeather Priestess':'',   // aztD2c
/* Capital fields · catacombs · Aether Rift */
  'Golden Stag':'o:luk','Wild Boar':'a','Antler Beetle':'w',   // cE
  'Field Rabbit':'','Wild Horse':'o:agi','Plains Wolf':'',   // cN
  'Wild Bull':'o:str','Wild Rooster':'','Giant Bee':'o:dex',   // cS
  'Dandelion Puff':'','Field Hawk':'','Meadow Slime':'o:vit',   // cW
  'Haunted Mill Spirit':'o:int','Giant Crow':'o:luk','Scarecrow Knight':'w',   // cNE
  'Water Sprite':'','Rusted Soldier':'a','Frog Bandit':'o:dex',   // cSW
  'Skeleton Soldier':'w','Sewer Rat':'o:vit','Crypt Spider':'o:agi',   // cata1
  'Wraith Knight':'a','Bone Archer':'o:dex',   // cata2
  'Aether Wisp':'o:int','Rift Hound':'o:agi','Void Mote':'',   // rift1
  'Crystal Golem':'a','Shard Seraph':'o:def',   // rift2
  'Void Sentinel':'w','Wyrm Spawn':'o:vit','Aether Drake':'a',   // rift3
};
const RATE={w:.06,a:.08,o:.025};          // per kill
const ROLE_MUL={brute:2,critter:.5};      // spawn shares are critter 3 · normal / swift 2 · brute 1 (maps/monster-roster.js) → same yield per map share
/* boss loot by relics.js slot tier: n = count (a fraction is the chance of one more) · part = [min, max] boss parts · stone = totem stones
   of the boss's tier · ess = totem essence · sore = Star Ore · ref = refine stones of its tier (40 % weapon / 60 % armour) */
/* owner 2026-11-22 18:44 ('decide — players should farm and trade, no item / money inflation'): map bosses respawn every 15 / 30 min
   (map_bosses.js), so their loot is smaller than the MVP's (respawn 60 min) — DROP_TABLE_TH.md §11 */
const BOSS={map:{th:'บอสประจำแมพ',mut:.25,sup:.6,part:[1,2],stone:1,ess:4,sore:.3,ref:1},
            mvp:{th:'MVP',mut:1,sup:2,part:[2,3],stone:3,ess:10,sore:2,ref:3},
            main:{th:'บอสใหญ่',mut:1.5,sup:2,part:[3,4],stone:4,ess:15,sore:3,ref:4}};
/* the 30 bosses (relics.js keys) and their boss part: [land, map slot, boss (th), part (en), part (th), live] — names from BOSS_SET_ICON_PROMPTS_TH.md */
const BOSSES={
  draugr:['vik','D1b','ดรอกร์ช่างหลอม','Deathforge Slag','ก้อนตะกรันเตาหลอม',1],huldra:['vik','H1','ฮุลดรา','Glowcap Mushrooms','เห็ดเรืองแสงบนเปลือกไม้',1],
  jotun:['vik','H2','ยักษ์โยตุน','Jotun Tusk','งาโยตุน',1],fenrir:['vik','D2c','เฟนเรียร์','Gleipnir Fragment','เศษโซ่เกลปนีร์',1],
  nidhogg:['vik','E1','นิดฮ็อกก์','Gnawed World-Root','รากต้นไม้โลกที่โดนแทะ'],ymir:['vik','E2','ยมีร์','Frost King\'s Beard Braid','เปียเคราราชายักษ์'],
  polyphemus:['grk','D1b','โพลีฟีมัส','Giant Fleece','มัดขนแกะยักษ์',1],hecate:['grk','H1','เฮคาที','Moonmoth','ผีเสื้อกลางคืนจันทรา',1],
  trojan:['grk','H2','ยักษ์ทรอย','Siege Timber','ไม้ซุงม้าศึก',1],minotaur:['grk','D2c','มิโนทอร์','Labyrinth Keystone','หินกลางเขาวงกต'],
  cerberus:['grk','E1','เซอร์เบอรัส','Ember of the Styx','ถ่านไฟผีแม่น้ำสติกซ์'],typhon:['grk','E2','ไทฟอน','Storm Feather','ขนปีกพายุสายฟ้าทอง'],
  mummy:['egy','D1b','มัมมี่อัครเสนาบดี','Canopic Jar','โถคาโนปิก',1],sphinx:['egy','H1','สฟิงซ์ผู้พิทักษ์','Riddle Tablet','แผ่นศิลาปริศนา',1],
  scorpion:['egy','H2','ราชาแมงป่องเกลือ','Rose Salt Crystal','ผลึกเกลือชมพู',1],pharaoh:['egy','D2c','ฟาโรห์อมตะ','Sarcophagus Gold Shard','เศษโลงทองฟาโรห์'],
  set:['egy','E1','เซ็ต','Storm Glass','แก้วสายฟ้าทรายแดง'],apep:['egy','E2','อาเปป','Apep\'s Venom Vial','ขวดพิษอาเปป'],
  tanuki:['jpn','D1b','โจนินเงา ทานูกิ','Tanuki Smoke Bomb','ระเบิดควันทานูกิ',1],jorogumo:['jpn','H1','โจโรกุโมะ','Spider-Silk Cocoon','รังไหมแมงมุม',1],
  gashadokuro:['jpn','H2','กาชาโดคุโระ','Cursed Bone','กระดูกต้องสาป',1],shogun:['jpn','D2c','โชกุนผี','Ghostfire Lantern','โคมไฟผี'],
  shuten:['jpn','E1','ชูเท็นโดจิ','Oni Horn','เขาอสูรหัก'],orochi:['jpn','E2','ยามาตะโนะโอโรจิ','Orochi Scale','เกล็ดโอโรจิ'],
  camazotz:['azt','D1b','คามาซอตซ์','Golden Bat Idol','รูปเคารพค้างคาวทอง',1],ahuizotl:['azt','H1','อาฮุยซอตล์','Lake-Spirit Pearl','ไข่มุกวิญญาณทะเลสาบ',1],
  eagle:['azt','H2','จอมทัพอินทรี','Eagle Talon','กรงเล็บอินทรี',1],tzitzimitl:['azt','D2c','ทซิทซิมิทล์','Eclipse Shard','เศษสุริยคราส'],
  mictlan:['azt','E1','มิกตลันเตกูตลี','Marigold of the Dead','ช่อดาวเรืองคนตาย'],quetzal:['azt','E2','เควตซัลโคอาทล์','Sun Serpent Scale','เกล็ดงูสุริยะ']};
const SLOT_TIER={D1b:'map',H1:'map',H2:'map',D2c:'mvp',E1:'mvp',E2:'main'};
const KIND_TH={w:'หินตีบวกอาวุธ',a:'หินตีบวกชุดเกราะ',o:'หินออฟ'};
const STAT_EN={str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK',def:'DEF'};
const rnd=Math.random,pick=a=>a[Math.floor(rnd()*a.length)],count=v=>Math.floor(v)+(rnd()<v%1?1:0);
const DT=window.DROPTAB={MON,RATE,ROLE_MUL,BOSS,BOSSES,SLOT_TIER,KIND_TH,STAT_EN,
  code:n=>MON[n]||'',
  /* the special drop of a monster on the field ('' for bosses and summons) */
  of(e){if(!e||e.boss||(e.m&&e.m.boss)||e.summon)return '';const v=e.vdef;return v&&MON[v.name]||'';},
  item(c,t){t=Math.max(1,Math.min(4,t|0||1));return c==='w'?'wore'+t:c==='a'?'ore'+t:/^o:/.test(c)?`orb_${c.slice(2)}_${t}`:'';},
  rate(c,role){return c?(RATE[c[0]]||0)*(ROLE_MUL[role]||1):0;},
  label(c){return !c?'':c[0]==='o'?`${KIND_TH.o} ${STAT_EN[c.slice(2)]||c.slice(2)}`:KIND_TH[c];},
  bossTier(key){const b=BOSSES[key];return b?SLOT_TIER[b[1]]:'mvp';},
  /* everything a boss drops on top of zeny / drop-set gear (items.js dropFor); t = stone tier of the boss's level */
  bossLoot(key,t){const GD=window.GEMDATA||{MUT:[],SUP:[]},T=BOSS[this.bossTier(key)]||BOSS.mvp,out=[];
    if(GD.MUT.length)for(let i=0,n=count(T.mut);i<n;i++)out.push('gmut_'+pick(GD.MUT)[0]);
    if(GD.SUP.length)for(let i=0,n=count(T.sup);i<n;i++)out.push('gsup_'+pick(GD.SUP)[0]);
    if(BOSSES[key])for(let i=0,n=T.part[0]+Math.floor(rnd()*(T.part[1]-T.part[0]+1));i<n;i++)out.push('bm_'+key);
    for(let i=0,n=count(T.stone);i<n;i++)out.push('tstone'+t);
    for(let i=0,n=count(T.ess);i<n;i++)out.push('tess');
    for(let i=0,n=count(T.sore);i<n;i++)out.push('sore');
    for(let i=0,n=count(T.ref);i<n;i++)out.push((rnd()<.4?'wore':'ore')+t);
    /* rune goods (owner 2026-11-23, rune_data.js DROPS.boss): golden medals, root skill gems (map 15 % T1 · MVP T2/T3 · main T3/T4),
       raw rune stones (always), carved-rune pouches */
    {const RB=window.RUNEDATA&&RUNEDATA.DROPS.boss[this.bossTier(key)];if(RB){
      for(let i=0,n=RB.medal[0]+Math.floor(rnd()*(RB.medal[1]-RB.medal[0]+1));i<n;i++)out.push('rmedal');
      for(const [g,c] of RB.rg)if(rnd()<c)out.push('rg'+g);
      for(const [g,n] of RB.stone)for(let i=0;i<n;i++)out.push('rstone'+g);
      for(let i=0;i<RB.bag;i++)out.push('rbag');}}
    return out;}};
})();
