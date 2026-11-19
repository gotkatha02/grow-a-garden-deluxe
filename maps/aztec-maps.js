/* =====================================================================
   AETHERFALL — Aztec zone (Xochitlan region) map configs, read by createFieldHost (maps/fieldmap.js).
   Pieces live in maps/aztec/ and are listed in maps/viking-catalog.js (entries with d:'aztec').
   Same rules as the Viking zone: dense groves are solid walls, open ground stays open, warps link the maps,
   trails are faint trampled tracks, repeats are capped per map.
   ===================================================================== */
(function(){
const J1=['azCeiba','azKapok','azPalmTall','azPalmShort','azBanana','azVineTree','azTwistTree','azOrangeTree','azMossTree','azLeanTree','azTwinTree','azUmbrella','azBanyan','azDeadVine','azFernTree'];
const J2=['azMango','azRedTree','azBromTree','azCacaoPalm','azBamboo1','azBamboo2','azBamboo3','azPalmSmall','azPalmFruit','azGreenFruit','azGingerTree','azBushTree','azGiant1','azGiant2','azYellowTree','azBerryTree'];
const JT=[...J1,...J2],JWALL=[...J1,...J2,'azGiant1','azGiant2','azBanyan','azCeiba','azKapok'];
const UND=['azFern','azMonstera','azHibRed','azHibYel','azFlowWhite','azBigLeaf','azHeliconia','azCacaoShrub','azMushroom','azMossRock','azRockPile','azVineStump','azSapling'];
const OPEN=['azFern','azMonstera','azHibRed','azHibYel','azFlowWhite','azBigLeaf','azHeliconia','azCacaoShrub','azMossLog','azMossRock','azRockPile','azVineStump','azMushroom','azSapling','azBlock','azStele','azBrokePillar','azToppled','azPots'];
const RUINS=['azBlock','azBrokePillar','azSerpentHead','azJaguarStat','azSkullRack','azStele','azStairs','azAltar','azFallenHead','azShrine','azBrazier','azWallFrag','azToppled','azObsidian','azPots','azTotem'];
const LAKE=['azLily','azLily','azLotus','azReeds','azCattailW','azWaterRock','azFloatFlower','azChinampa','azCanoe'];
const CF=['cfMossGiant','cfTreeFern','cfOrchidTree','cfTwistMoss','cfMossBig','cfTrumpetTree'];
const CFU=['cfMistRock1','cfMistRock2','cfMistRock3','cfHollowLog','cfBromStump','cfOrchidStump','cfFungStump','cfMonstera','cfBromPlant','cfMossArch'];
const VC=['vcSpires','vcBurntTree','vcBasalt','vcLavaSpire','vcBurntStumps','vcCrackRock','vcLavaMound'];
const VCO=['vcVent','vcVents2','vcSulfur','vcCrackRock','vcLavaMound','vcRuinTopple','vcBurntStumps','vcBurntTree'];
const LCW=['lcWallS','lcWallM','lcWallL','lcCornerIn','lcCornerOut','lcWallEnd','lcRubble','lcWallTorch','lcWallFungus','lcWallBat','lcWallCarved'];
const LCR=['lcPillar','lcRock1','lcRock2','lcRock3','lcStalag'];
const TPW=['tpWallGlyph','tpWallTeal','tpWallSun','tpWallSerpent','tpDoor','tpSunDoor'];
const J={theme:'jungle',ground:'azGrass',trailKind:'trample',dirtTex:'azSoil',lakeTex:'azWater',seaTex:'azWater'};
const M=(o)=>Object.assign({},J,o);
const AZ={
/* ---------------- Xochitlan (home town of Jaguar / Crocodile / Axolotl) ---------------- */
aztT:M({name:'โชชิตลัน Xochitlan',lv:'เมือง',seed:211,doorRe:'^az(Noble[AB]|House2|MarketHall|CraftHall|Work[AB]|Barracks|FeatherHouse|Long[AB]|Flat(Sun|A|B)|Hut(A|B|Round))$',stepTex:'azPlaza',fringe:.25,W:3000,H:2480,mood:'jungle',trailKind:'cobble',cobbleTex:'azPlaza',mons:false,
  border:{set:JWALL,band:200,calm:1},openTrees:0,propDens:.14,open:['azFern','azHibRed','azHibYel','azMonstera'],grass:['azTallGrass'],decalDens:.3,trails:[],
  /* a city that grew around its pyramid: the causeway bends through the temple plaza and the market, lanes wander off to the houses */
  roads:[{pts:[[190,1650],[600,1560],[950,1350],[1250,1170],[1650,1250],[2050,1420],[2450,1350],[2810,1250]],w:120},
    {pts:[[1980,1560],[1850,1850],[1600,2050],[1250,2150]],w:88},
    {pts:[[720,1500],[650,1250],[580,960]],w:80},
    {pts:[[1550,1080],[1900,920],[2250,850]],w:70},
    {pts:[[950,1400],[900,1620],[1000,1880],[960,2120]],w:62}],
  squares:[{x:1250,y:1090,rx:340,ry:150},{x:2010,y:1450,rx:240,ry:150},
    {x:640,y:1890,rx:210,ry:115,tex:'azMaize',kc:'#6a4a2a'},{x:2300,y:2010,rx:190,ry:105,tex:'azMaize',kc:'#6a4a2a'}],
  lakes:[{x:2480,y:740,rx:230,ry:125}],lakeSet:['azLily','azLotus','azReeds','azFloatFlower'],
  clusters:[{x:1820,y:520,r:220,set:J1,n:5,sp:100},{x:380,y:560,r:200,set:J1,n:5,sp:100},{x:2700,y:1880,r:150,set:J2,n:3,sp:110},{x:1450,y:1800,r:130,set:J2,n:2,sp:120},{x:330,y:2220,r:150,set:J2,n:3,sp:110}],
  land:[{n:'azGreatPyramid',x:1250,y:880},
    {n:'azTemplePalace',x:600,y:900},{n:'azNobleA',x:400,y:1300},{n:'azNobleB',x:880,y:1200,flip:1},{n:'azShrineA',x:1730,y:1010},{n:'azHouse2',x:1850,y:860},
    {n:'azMarketHall',x:2050,y:1275},{n:'azCraftHall',x:2420,y:1270},{n:'azBarracks',x:1450,y:1520},{n:'azFeatherHouse',x:2250,y:1770},{n:'azLongB',x:2620,y:1620},
    {n:'azFlatSun',x:1600,y:1890},{n:'azHutA',x:2060,y:1960,flip:1},{n:'azLongA',x:1250,y:2060},{n:'azHutRound',x:830,y:2150},{n:'azHutB',x:1560,y:2250,flip:1},{n:'azFlatB',x:390,y:1880},
    {n:'azWorkB',x:1110,y:1700},{n:'azShrineB',x:2660,y:2060},{n:'azFlatA',x:2600,y:960,flip:1},
    {n:'azSunStone',x:980,y:1130},{n:'azJaguarBig',x:1500,y:1160},{n:'azTorch',x:1080,y:1010},{n:'azTorch',x:1420,y:1010},
    {n:'azFountain',x:2010,y:1470},{n:'azStallFruit',x:1850,y:1500},{n:'azStallPot',x:2170,y:1530,flip:1},{n:'azStallCloth',x:2150,y:1400},{n:'azCart',x:1880,y:1590},
    {n:'azBanner',x:760,y:1530},{n:'azBanner',x:2610,y:1330},{n:'azPlanter',x:1700,y:1320},{n:'azPlanter',x:600,y:1700},
    {n:'azNotice',x:1650,y:1190},{n:'azSign',x:420,y:1590},{n:'azSign',x:2680,y:1330},{n:'azClayPots',x:2235,y:1320},{n:'azMaizeBasket',x:880,y:1950},{n:'azCacaoSack',x:2420,y:1880},{n:'azLoom',x:2400,y:1790},{n:'azParrot',x:1640,y:1640},{n:'azBench',x:1120,y:1240},{n:'azBench',x:2240,y:1460},{n:'azDrum',x:1370,y:1250},{n:'azCanoe',x:2320,y:840}],
  warps:[{id:'toF1',x:200,y:1650,to:'aztF1',at:'toT',label:'ป่าหยก'},{id:'toF2',x:2800,y:1250,to:'aztF2',at:'toT',label:'น้ำตกเซโนเต'}]}),



/* ---------------- Field 1 · Jade Jungle ---------------- */
aztF1:M({name:'ป่าหยก Jade Jungle',lv:'1–8',seed:221,W:4800,H:3600,mood:'jungle',patches:[{tex:'azSoil',scale:600,thr:.6,rim:false,a:.5}],
  border:{set:JWALL},groves:{set:JT,thr:.56},under:UND,open:OPEN,edge:UND,grass:['azTallGrass'],decals:['azVine'],
  lakes:[{x:3300,y:2500,rx:260,ry:150}],lakeSet:LAKE,
  trails:[[[4330,500],[3700,900],[2800,1300],[2000,1700],[1300,2300],[700,3100]],[[2000,1700],[2200,2500],[2400,3200]]],
  land:[{n:'azFallenHead',x:2700,y:1600,r:200},{n:'azStele',x:1500,y:1300},{n:'azMiniFall',x:3450,y:2330},{n:'azShrine',x:1100,y:2600},{n:'azSign',x:2080,y:1800}],
  clearings:[[2600,1700,420],[1300,2600,360],[3300,2700,320]],
  warps:[{id:'toT',x:4330,y:470,to:'aztT',at:'toF1',label:'โชชิตลัน'},{id:'toF3',x:700,y:3200,to:'aztF3',at:'toF1',label:'ไร่ข้าวโพด Lv 10–18'},{id:'toF5',x:2400,y:3250,to:'aztF5',at:'toF1',label:'ซากงูขนนก Lv 18–26'}]}),

/* ---------------- Field 2 · Cenote Falls ---------------- */
aztF2:M({name:'น้ำตกเซโนเต Cenote Falls',lv:'4–12',seed:222,W:4800,H:3600,mood:'jungle',patches:[{tex:'azPlaza',scale:520,thr:.66,rim:false,a:.75}],
  border:{set:JWALL},groves:{set:JT,thr:.58},under:UND,open:OPEN,edge:UND,grass:['azTallGrass'],decals:['azVine'],
  lakes:[{x:1700,y:1500,rx:330,ry:200},{x:3500,y:2300,rx:300,ry:180},{x:2500,y:2900,rx:220,ry:130}],lakeSet:LAKE,
  trails:[[[460,520],[900,1200],[1200,2000],[2300,2200],[3300,1300],[4330,480]],[[1200,2000],[1300,2700],[1500,3200]]],
  land:[{n:'azCenote',x:2500,y:1500,r:240},{n:'azFalls',x:3600,y:2000},{n:'azDock',x:1900,y:1700},{n:'lcWallBat',x:1500,y:3180},{n:'azStele',x:2300,y:2300}],
  clearings:[[2400,2300,380],[900,1500,300]],
  warps:[{id:'toT',x:460,y:470,to:'aztT',at:'toF2',label:'โชชิตลัน'},{id:'toF4',x:4330,y:430,to:'aztF4',at:'toF2',label:'บึงชินัมปา Lv 14–22'},{id:'toD1',x:1500,y:3260,to:'aztD1a',at:'up',label:'ถ้ำเทพค้างคาว Lv 28–44'}]}),

/* ---------------- Field 3 · Maize Terraces ---------------- */
aztF3:M({name:'ไร่ข้าวโพด Maize Terraces',lv:'10–18',seed:223,W:4800,H:3600,mood:'jungle',patches:[{tex:'azMaize',scale:700,thr:.5,rim:'rgba(90,50,20,.35)'},{tex:'azSoil',scale:420,thr:.7,rim:false,a:.45}],
  border:{set:JWALL},groves:{set:JT,thr:.64,dens:.7},openTrees:.02,under:UND,open:['azMaizeBasket','azCacaoSack','azCart','azClayPots','azHibYel','azFern','azRockPile','azMossLog','azBanana','azPalmSmall'],edge:UND,grass:['azTallGrass'],
  trails:[[[4380,3180],[3600,2600],[2600,1900],[1700,1400],[1100,800],[1100,420]]],
  land:[{n:'azHouse1',x:2300,y:1500},{n:'azHouse2',x:2900,y:1700,flip:1},{n:'azChinampa',x:3500,y:1000},{n:'azDrum',x:2600,y:1750},{n:'azShrine',x:1500,y:2600}],
  clearings:[[2600,1700,500],[1500,2600,340]],
  warps:[{id:'toF1',x:4380,y:3220,to:'aztF1',at:'toF3',label:'ป่าหยก Lv 1–8'},{id:'toH1',x:1100,y:380,to:'aztH1',at:'toF3',label:'ป่าเมฆหมอก Lv 46–56'}]}),

/* ---------------- Field 4 · Chinampa Marsh ---------------- */
aztF4:M({name:'บึงชินัมปา Chinampa Marsh',lv:'14–22',seed:224,W:4800,H:3600,mood:'jungle',patches:[{tex:'azMud',scale:520,thr:.58,rim:false,a:.55}],
  border:{set:JWALL},groves:{set:[...JT,'azMangrove'],thr:.62,dens:.75},under:['azReeds','azCattail','azFern','azMangrove','azBigLeaf'],open:['azMangrove','azDrift','azCattail','azReeds','azFern','azMossRock','azFishStakes','azHeron'],grass:['azTallGrass','azCattail'],
  lakes:[{x:1300,y:1200,rx:380,ry:240},{x:3300,y:1100,rx:420,ry:260},{x:2300,y:2400,rx:460,ry:230},{x:3900,y:2700,rx:300,ry:200}],lakeSet:LAKE,
  bridge:[2300,1700],bridgeImg:'azRopeBridge',bridgeDy:125,stream:[[1560,1330],[1880,1480],'B',[2800,2000],[3300,2350],[3720,2600]],
  trails:[[[1400,3300],[1600,2700],[1950,2000],'B',[2650,1350],[2400,700],[1200,430]]],
  land:[{n:'azDock2',x:1650,y:1300},{n:'azDock',x:2900,y:1300},{n:'azChinampa',x:3000,y:2600}],
  clearings:[[2200,1800,360]],
  warps:[{id:'toF2',x:1400,y:3330,to:'aztF2',at:'toF4',label:'น้ำตกเซโนเต Lv 4–12'},{id:'toH2',x:1150,y:400,to:'aztH2',at:'toF4',label:'ลานบูชายัญ Lv 52–64'}]}),

/* ---------------- Field 5 · Serpent Ruins ---------------- */
aztF5:M({name:'ซากงูขนนก Serpent Ruins',lv:'18–26',seed:225,W:4800,H:3600,mood:'jungle',patches:[{tex:'azPlaza',scale:600,thr:.56,rim:false,a:.65}],
  border:{set:JWALL},groves:{set:JT,thr:.6,dens:.8},under:UND,open:[...RUINS,'azFern','azMossRock','azRockPile'],edge:['azWallFrag','azBlock','azFern'],grass:['azTallGrass'],decals:['azVine'],
  trails:[[[2300,420],[2350,1100],[2300,1800],[2900,2300],[3700,2400],[4400,2350]],[[2300,1800],[1500,2300],[1100,2900]]],
  land:[{n:'azSerpentGate',x:2350,y:1350},{n:'azPyramid',x:1500,y:1500,r:260},{n:'azBallCourt',x:3300,y:1500,r:240},{n:'azSerpentHead',x:2700,y:2050},{n:'azSkullRack',x:3600,y:2100}],
  clusters:[{x:1800,y:2000,r:320,n:8,set:RUINS},{x:3100,y:2000,r:320,n:8,set:RUINS}],
  clearings:[[2400,1900,480],[1200,2800,300]],
  warps:[{id:'toF1',x:2300,y:380,to:'aztF1',at:'toF5',label:'ป่าหยก Lv 1–8'},{id:'toF6',x:4420,y:2350,to:'aztF6',at:'toF5',label:'ทางยกสูงกลางป่า Lv 22–30'}]}),

/* ---------------- Field 6 · Jungle Causeway ---------------- */
aztF6:M({name:'ทางยกสูงกลางป่า Jungle Causeway',lv:'22–30',seed:226,W:4800,H:3600,mood:'jungle',patches:[{tex:'azMud',scale:500,thr:.6,rim:false,a:.55}],
  border:{set:JWALL},groves:{set:[...JT,'azMangrove'],thr:.62,dens:.75},under:UND,open:['azMangrove','azDrift','azReeds','azMossRock','azBrokePillar','azBlock','azStele','azFern'],grass:['azTallGrass','azCattail'],
  lakes:[{x:1700,y:1100,rx:600,ry:260},{x:1800,y:2700,rx:620,ry:260},{x:3500,y:1000,rx:360,ry:200}],lakeSet:LAKE,
  bridge:[1700,1900],bridgeImg:'azCauseway',bridgeDy:125,stream:[[1180,1300],[1330,1640],'B',[2080,2160],[2150,2500]],
  trails:[[[420,1800],[900,2100],[1350,2130],'B',[2250,1620],[2700,1700],[3400,1900],[3900,2600],[4000,3220]]],
  land:[{n:'azSerpentHead',x:2800,y:1500},{n:'azSign',x:3800,y:2500}],
  clearings:[[2900,2000,400],[3300,2800,340]],
  warps:[{id:'toF5',x:380,y:1800,to:'aztF5',at:'toF6',label:'ซากงูขนนก Lv 18–26'},{id:'toCap',x:4000,y:3260,to:'cS',at:'toAzt',label:'ทุ่งใต้เมืองหลวง'}]}),

/* ---------------- Dungeon 1 · Bat God Cavern (2 floors) ---------------- */
aztD1a:M({name:'ถ้ำเทพค้างคาว ชั้น 1',lv:'28–36',seed:231,W:3600,H:2700,mood:'cave',ground:'azCaveFloor',patches:[{tex:'azSoil',scale:420,thr:.64,rim:false,a:.45}],trailKind:'none',
  walls:{face:'wallCave',top:'caveTop',fh:150,tint:'rgba(70,45,10,.28)',dark:'6,4,8'},border:{band:230},groves:{thr:.6},open:['lcRock1','lcRock2','lcRock3','lcStalag','lcPillar','goldOre','azObsidian','gdJade','azMushroom'],propDens:.45,edge:[],decals:['azVine'],decalDens:.4,
  land:[{n:'lcWallCarved',x:1800,y:1150},{n:'azBrazier',x:1550,y:1350},{n:'azBrazier',x:2050,y:1350}],clearings:[[1800,1500,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'aztF2',at:'toD1',label:'ทางออก'},{id:'down',x:700,y:640,to:'aztD1b',at:'up',label:'ชั้น 2 Lv 36–44'}]}),
aztD1b:M({name:'ถ้ำเทพค้างคาว ชั้น 2',lv:'36–44',seed:232,W:3600,H:2700,mood:'cave',ground:'azCaveFloor',patches:[{tex:'azWater',scale:400,thr:.68,rim:'rgba(20,40,40,.5)'}],trailKind:'none',
  walls:{face:'wallCave',top:'caveTop',fh:150,tint:'rgba(70,45,10,.28)',dark:'6,4,8'},border:{band:230},groves:{thr:.6},open:['lcRock1','lcRock2','lcRock3','lcStalag','lcPillar','goldOre','azObsidian','gdJade','azMushroom'],propDens:.45,edge:[],decalDens:.4,
  land:[{n:'lcWallBat',x:2600,y:700},{n:'tpChest',x:2900,y:880},{n:'azBrazier',x:2350,y:860}],clearings:[[2600,850,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:700,y:2440,to:'aztD1a',at:'down',label:'ชั้น 1'}]}),

/* ---------------- High field · Cloud Forest ---------------- */
aztH1:M({name:'ป่าเมฆหมอก Cloud Forest',lv:'46–56',seed:241,W:4800,H:3600,mood:'cloud',patches:[{tex:'azSoil',scale:520,thr:.56,rim:false,a:.45}],
  border:{set:[...CF,...JWALL]},groves:{set:[...CF,...CF,'azMossTree','azBanyan','azFernTree','azVineTree'],thr:.56,dens:.85},openTrees:.02,under:CFU,open:[...CFU,'azFern','azMushroom'],edge:CFU,grass:['azTallGrass'],decals:['azVine'],
  trails:[[[2400,3250],[2300,2500],[1700,1800],[1100,1100],[700,520]]],
  land:[{n:'cfMistRock2',x:3200,y:1500},{n:'cfMossArch',x:2300,y:1700},{n:'azShrine',x:1400,y:2600},{n:'azTempleDoorDummy',x:0,y:0}],
  clearings:[[3200,1650,420],[2300,1700,380],[1400,2750,340],[3600,2700,380],[1200,1300,360],[3700,700,360]],
  warps:[{id:'toF3',x:2400,y:3300,to:'aztF3',at:'toH1',label:'ไร่ข้าวโพด Lv 10–18'},{id:'toD2',x:700,y:540,to:'aztD2a',at:'up',label:'พีระมิดสุริยะ Lv 58–80'}]}),

/* ---------------- High field · Altar of Eagles ---------------- */
aztH2:M({name:'ลานบูชายัญ Altar of Eagles',lv:'52–64',seed:242,W:4800,H:3600,mood:'jungle',patches:[{tex:'azPlaza',scale:560,thr:.5,rim:false,a:.65},{tex:'azSoil',scale:420,thr:.68,rim:false,a:.45}],
  border:{set:JWALL},groves:{set:JT,thr:.62,dens:.75},under:UND,open:[...RUINS,'azFern','azRockPile'],edge:['azWallFrag','azBlock'],grass:['azTallGrass'],
  trails:[[[2400,3300],[2500,2600],[3100,2100],[3900,1700],[4400,1500]]],
  land:[{n:'azSunStone',x:2100,y:1700,r:300},{n:'azPyramid',x:2200,y:900,r:260},{n:'azAltar',x:2400,y:2000},{n:'azSkullRack',x:1800,y:2050},{n:'azTotem',x:2700,y:1750},{n:'azBrazier',x:1850,y:1750},{n:'azBrazier',x:2350,y:1750}],
  clearings:[[2200,1900,480],[3500,2600,350]],
  warps:[{id:'toF4',x:2400,y:3330,to:'aztF4',at:'toH2',label:'บึงชินัมปา Lv 14–22'},{id:'toE1',x:4440,y:1500,to:'aztE1',at:'toH2',label:'นครทองที่สาบสูญ Lv 76–86'}]}),

/* ---------------- Dungeon 2 · Temple of the Sun (3 floors) ---------------- */
aztD2a:M({name:'พีระมิดสุริยะ ชั้น 1',lv:'58–66',seed:251,W:3600,H:2700,mood:'mine',theme:'temple',ground:'azPlaza',patches:[{tex:'azCaveFloor',scale:420,thr:.62,rim:'rgba(30,20,10,.4)'}],trailKind:'none',
  walls:{face:'wallTemple',top:'azTempleTop',fh:160,block:1,tint:'rgba(30,18,6,.3)',dark:'12,8,4'},border:{band:240},groves:{thr:.62},propDens:.35,open:['gdPillar1','gdPillar2','tpGuardJag','tpGuardPriest','tpBrazier'],edge:[],decals:['tpSunPlate'],decalDens:.12,
  land:[{n:'tpAltarFire',x:1800,y:1350},{n:'tpBrazier',x:1500,y:2250},{n:'tpBrazier',x:2100,y:2250}],clearings:[[1800,1500,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'aztH1',at:'toD2',label:'ทางออก'},{id:'down',x:3000,y:600,to:'aztD2b',at:'up',label:'ชั้น 2 Lv 66–73'}]}),
aztD2b:M({name:'พีระมิดสุริยะ ชั้น 2',lv:'66–73',seed:252,W:3600,H:2700,mood:'mine',theme:'temple',ground:'azPlaza',patches:[{tex:'azGold',scale:420,thr:.6,rim:'rgba(60,40,10,.4)'}],trailKind:'none',
  walls:{face:'wallTemple',top:'azTempleTop',fh:160,block:1,tint:'rgba(30,18,6,.3)',dark:'12,8,4'},border:{band:240},groves:{thr:.62},propDens:.35,open:['gdPillar1','gdPillar2','tpGuardJag','tpGuardPriest','tpBrazier'],edge:[],decals:['tpSunPlate'],decalDens:.125,
  land:[{n:'tpSunDoor',x:1800,y:1200},{n:'tpBrazier',x:1620,y:1260},{n:'tpBrazier',x:1980,y:1260}],clearings:[[1800,1400,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:600,y:2400,to:'aztD2a',at:'down',label:'ชั้น 1'},{id:'down',x:3000,y:2350,to:'aztD2c',at:'up',label:'ชั้น 3 Lv 73–80'}]}),
aztD2c:M({name:'พีระมิดสุริยะ ชั้น 3 · ห้องบูชาสุริยะ',lv:'73–80',seed:253,W:3600,H:2700,mood:'mine',theme:'temple',ground:'azGold',patches:[{tex:'azPlaza',scale:420,thr:.64,rim:'rgba(60,40,10,.4)'}],trailKind:'none',
  walls:{face:'wallTemple',top:'azTempleTop',fh:160,block:1,tint:'rgba(30,18,6,.3)',dark:'12,8,4'},border:{band:240},groves:{thr:.62},propDens:.35,open:['gdPillar1','gdPillar2','tpGuardJag','tpGuardPriest','tpBrazier'],edge:[],decals:['tpSunPlate'],decalDens:.12,
  land:[{n:'tpSunAltar',x:1800,y:1150,r:330},{n:'tpGuardJag',x:1450,y:1250},{n:'tpGuardJag',x:2150,y:1250,flip:1},{n:'tpBrazier',x:1550,y:900},{n:'tpBrazier',x:2050,y:900},{n:'tpSarcoph',x:1800,y:1500},{n:'tpChest',x:2050,y:1500}],
  clearings:[[1800,1350,520]],spawnN:20,spawnGap:300,
  warps:[{id:'up',x:600,y:2400,to:'aztD2b',at:'down',label:'ชั้น 2'},{id:'toE2',x:3050,y:500,to:'aztE2',at:'toD2',label:'ภูเขาไฟออบซิเดียน Lv 84–94'}]}),

/* ---------------- End game · Lost City of Gold ---------------- */
aztE1:M({name:'นครทองที่สาบสูญ Lost City of Gold',lv:'76–86',seed:261,W:4800,H:3600,mood:'gold',patches:[{tex:'azGold',scale:640,thr:.52,rim:false,a:.7},{tex:'azPlaza',scale:420,thr:.66,rim:false}],
  border:{set:JWALL},groves:{set:JT,thr:.62,dens:.75},under:UND,open:['gdKing','gdJaguar','gdSerpent','gdSunDisc','gdJade','gdEagle','gdChest','gdBars','gdPillar1','gdPillar2','gdBrazier','gdWall','gdCorner','gdHead','azFern','azRockPile'],edge:['gdWall','gdCorner','azFern'],grass:['azTallGrass'],
  trails:[[[700,3250],[1400,2700],[2400,2400],[3400,2300],[4400,2350]]],
  land:[{n:'gdArch',x:2400,y:1500,r:200},{n:'gdStairs',x:2400,y:1150},{n:'gdSunDisc',x:2400,y:900},{n:'gdKing',x:1500,y:1400},{n:'gdEagle',x:3300,y:1400}],
  clearings:[[2400,2300,420],[2400,1300,380],[1500,2000,330]],
  warps:[{id:'toH2',x:700,y:3280,to:'aztH2',at:'toE1',label:'ลานบูชายัญ Lv 52–64'},{id:'toE2',x:4420,y:2350,to:'aztE2',at:'toE1',label:'ภูเขาไฟออบซิเดียน Lv 84–94'}]}),

/* ---------------- End game · Obsidian Volcano ---------------- */
aztE2:M({name:'ภูเขาไฟออบซิเดียน Obsidian Volcano',lv:'84–94',seed:271,W:4800,H:3600,mood:'volcano',theme:'volcano',ground:'azVolcanic',patches:[{tex:'azSoil',scale:600,thr:.6,rim:'rgba(20,8,6,.5)'}],dirtTex:'azSoil',
  border:{set:VC,sp:70},groves:{set:VC,thr:.58,dens:.8},openTrees:.015,open:VCO,edge:['vcCrackRock','vcLavaMound','vcBurntStumps'],decalDens:.4,
  trails:[[[4400,2400],[3700,2200],[2900,1900],[2400,1500],[2400,950]],[[2900,1900],[2100,2500],[1000,3000],[600,3200]]],
  land:[{n:'vcLavaPool',x:2400,y:800,r:300},{n:'vcLavaFall',x:3600,y:1100,r:220},{n:'vcRuinArch',x:1400,y:1500},{n:'vcOlmec',x:1700,y:1500},{n:'vcLavaArch',x:2400,y:1500}],
  clearings:[[2400,1100,420],[1500,1700,340]],
  warps:[{id:'toE1',x:4440,y:2400,to:'aztE1',at:'toE2',label:'นครทองที่สาบสูญ Lv 76–86'},{id:'toD2',x:560,y:3250,to:'aztD2c',at:'toE2',label:'พีระมิดสุริยะ ชั้น 3'}]})
};
/* drop a placeholder used while drafting */
AZ.aztH1.land=AZ.aztH1.land.filter(l=>l.n!=='azTempleDoorDummy');
window.VK_MAPS=Object.assign(window.VK_MAPS||{},AZ);
window.AZ_ORDER=['aztT','aztF1','aztF2','aztF3','aztF4','aztF5','aztF6','aztD1a','aztD1b','aztH1','aztH2','aztD2a','aztD2b','aztD2c','aztE1','aztE2'];
/* monsters (frostling / snow-wolf models recoloured until the jungle sprites exist) */
const T=(n,th,a,b,base,col,sc)=>({base,name:n,th,lv:[a,b],sc:sc||1,[base==='snowwolf'?'flt':'tint']:col});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  aztF1:[T('Dart Frog','กบลูกดอก',1,8,'frostling','#4fc06a',.8),T('Howler Monkey','ลิงหาง',3,8,'snowwolf','sepia(.8) saturate(1.6) hue-rotate(-15deg)',.75)],
  aztF2:[T('Wild Axolotl','แอกโซลอเติลป่า',4,12,'frostling','#f39ab8',.85),T('Quetzal','นกเควตซัล',6,12,'frostling','#2fb88a',.8)],
  aztF3:[T('Maize Rat','หนูข้าวโพด',10,18,'frostling','#d8b25a',.8),T('Scarecrow God','หุ่นไล่กาเทพ',12,18,'frostling','#c98a3a',1.1)],
  aztF4:[T('Young Crocodile','จระเข้หนุ่ม',14,22,'snowwolf','hue-rotate(60deg) saturate(1.4) brightness(.8)',.95),T('Giant Frog','กบยักษ์',16,22,'frostling','#6aa048',1.15)],
  aztF5:[T('Feathered Serpent','งูขนนก',18,26,'frostling','#3fbf9f',1),T('Stone Mask Warrior','นักรบหน้ากากหิน',20,26,'frostling','#a89a80',1.1)],
  aztF6:[T('Black Jaguar','เสือจากัวร์ดำ',22,30,'snowwolf','brightness(.4) saturate(.6)',1.05),T('Lost Priest','นักบวชหลงทาง',24,30,'frostling','#b06a3a',1)],
  aztD1a:[T('Giant Bat','ค้างคาวยักษ์',28,36,'frostling','#6a4a6a',.9),T('Cave Spider','แมงมุมถ้ำ',30,36,'frostling','#3a3030',.95)],
  aztD1b:[T('Stone Slave','ทาสหิน',36,44,'frostling','#9a9080',1.2),T('Vampire Bat Pack','ฝูงค้างคาวแวมไพร์',38,44,'snowwolf','hue-rotate(260deg) brightness(.5)',.8)],
  aztH1:[T('Jaguar Warrior','นักรบจากัวร์',46,56,'snowwolf','sepia(1) saturate(2.5) hue-rotate(-10deg)',1.05),T('Mist Spirit','ภูตหมอก',48,56,'frostling','#d8ece4',1)],
  aztH2:[T('Eagle Warrior','นักรบอินทรี',52,64,'frostling','#c8a060',1.15),T('Blood Priest','นักบวชเลือด',54,64,'frostling','#b03030',1.1)],
  aztD2a:[T('Sun Priest','นักบวชสุริยะ',58,66,'frostling','#f0b030',1.1),T('Golden Serpent','งูทอง',60,66,'frostling','#e0c040',1)],
  aztD2b:[T('Jade Golem','โกเลมหยก',66,73,'frostling','#3aa070',1.3),T('Temple Jaguar','จากัวร์วิหาร',66,73,'snowwolf','sepia(1) saturate(3) brightness(.9)',1.15)],
  aztD2c:[T('Sun Guardian','องครักษ์สุริยะ',73,80,'frostling','#ffb820',1.35),T('Obsidian Jaguar','จากัวร์ออบซิเดียน',74,80,'snowwolf','brightness(.35) contrast(1.5)',1.25)],
  aztE1:[T('Golden Statue','รูปปั้นทองคำ',76,86,'frostling','#e8b830',1.35),T('Jaguar King','ราชาจากัวร์',78,86,'snowwolf','sepia(1) saturate(3) hue-rotate(5deg)',1.3)],
  aztE2:[T('Obsidian Golem','โกเลมออบซิเดียน',84,94,'frostling','#2a2030',1.5),T('Fire Bird','นกไฟ',86,94,'frostling','#ff6a20',1.1)]});
})();
