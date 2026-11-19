/* =====================================================================
   AETHERFALL — Japan zone (Hakusen region) map configs, read by createFieldHost (maps/fieldmap.js).
   Pieces live in maps/japan/ and are listed in maps/viking-catalog.js (entries with d:'japan').
   Same rules as the other zones: cliffs, bamboo and dense groves are solid, open ground stays open,
   warps link the maps, tracks are faint, repeats are capped, dungeons use continuous painted walls.
   ===================================================================== */
(function(){
const SAKURA=['jpSakura1','jpSakura2','jpSakura3','jpSakuraWeep','jpSakuraYoung'];
const PINE=['jpPine1','jpPine2','jpPine3','jpCedar'];
const MAPLE=['jpMaple1','jpMaple2','jpGinkgo'];
const MIX=[...PINE,'jpSakura1','jpMaple1','jpCamellia','jpPlum','jpCedar'];
const BAMBOO=['jpBamboo1','jpBamboo2','jpBamboo3','jpBamboo4','jpBamboo1','jpBamboo2'];
const CLIFF=['jpCliff1','jpCliff2','jpCliff3','jpCliff4','jpCliff5','jpCliff6','jpPillar1','jpPillar2','jpPillar3','jpBoulders1','jpBoulders2','jpBoulders3'];
const ROCKO=['jpBoulder1','jpBoulder2','jpBoulders1','jpBoulders2','jpBoulders3'];
const SHRUB=['jpAzalea','jpHydrangea','jpShrubRound','jpFern','jpSusuki','jpIris','jpSasa','jpStump','jpTea','jpBonsaiRock'];
const SHR=['jpLantern','jpLanternTall','jpJizo','jpShrineS','jpBasin','jpEma','jpMarker','jpRopeGate','jpSake','jpToriiBroken'];
const SPI=['spGraves','spUmbrella','spWell','spShrine','spTalisman','spLantern','jpToriiBroken','jpJizo'];
const BAT=['btBanners','btArmor','btKatana','btPalisade','btCurtain','btDrum','btTarget','btCart'];
const ONI=['oniClub','oniMask','oniBones','oniBrazier','oniCage','oniTree'];
const DRG=['drPillar','drFountain','drShrine','drBell','drPearl','drLantern','drRopeGate'];
const NJ=['njDummy','njRack','njCrates','njLamp','njSmoke','njScroll','njToad'];
const CS=['csArmor','csScreen','csAndon','csDoll','csTea','csAndon'];
const POND=['jpLotus','jpLotus','jpReeds'];
const J={theme:'japan',ground:'jpGrass',mood:'japan',trailKind:'trample',dirtTex:'azSoil',lakeTex:'jpWater',seaTex:'jpWater',streamTex:'jpWater',cobbleTex:'jpPave'};
const M=(o)=>Object.assign({},J,o);
const CW={face:'jpWallCave',top:'caveTop',fh:150,tint:'rgba(40,30,30,.3)',dark:'8,6,6'};
const KW={face:'jpWallCastle',top:'caveTop',fh:160,block:1,tint:'rgba(30,20,14,.5)',dark:'10,6,4'};

const JP={
/* ---------------- Hakusen (home town) ---------------- */
jpnT:M({name:'ฮาคุเซ็น Hakusen',lv:'เมือง',seed:511,doorRe:'^jp(Ryokan|Ramen|TeaHouse|Machiya[AB]|Farmhouse|Smith|CraftHall|Dojo|Sake)$',stepTex:'jpPave',fringe:.25,W:3000,H:2480,mons:false,mood:'sakura',sakura:1,roadWear:.85,dirtTex:'jpPave',
  border:{set:[...PINE,...SAKURA,'jpCliff1','jpCliff3'],band:200,calm:1},openTrees:0,propDens:.1,open:['jpAzalea','jpHydrangea','jpShrubRound','jpIris'],decalDens:.5,trails:[],
  /* castle on the hill -> stone stair avenue -> market square with the koi pond -> streets west and east -> lower street over the stream */
  roads:[{pts:[[1500,960],[1490,1150],[1500,1320]],w:190},
    {pts:[[190,1350],[520,1390],[820,1440],[1120,1480]],w:112},
    {pts:[[1880,1450],[2200,1340],[2520,1210],[2810,1150]],w:112},
    {pts:[[1500,1680],[1530,1820],[1560,1950]],w:130},
    {pts:[[700,1990],[1150,1975],[1560,1965],[1980,1975],[2420,1960],[2820,1950]],w:110}],
  squares:[{x:1500,y:930,rx:440,ry:120},{x:1500,y:1490,rx:430,ry:215}],
  bridge:[2400,1962],bridgeImg:'jpBridgeRed',bridgeDy:70,stream:[[2760,1300],[2620,1560],[2460,1800],'B',[2360,2150],[2300,2480]],
  clusters:[{x:560,y:620,r:300,set:SAKURA,n:8,sp:100},{x:2420,y:600,r:280,set:[...SAKURA,'jpPine1'],n:7,sp:100},{x:420,y:1760,r:170,set:['jpMaple1','jpMaple2'],n:3,sp:100},{x:1500,y:330,r:260,set:PINE,n:5,sp:110},{x:2750,y:2250,r:150,set:SAKURA,n:3,sp:100}],
  land:[{n:'jpCastle',x:1500,y:860,walk:[[0,-80,80,110]]},
    {n:'jpLantern',x:1290,y:1010},{n:'jpLantern',x:1710,y:1010},{n:'jpNobori',x:1370,y:1130},{n:'jpNobori',x:1630,y:1130},
    /* around the square */
    {n:'jpRyokan',x:1030,y:1250},{n:'jpRamen',x:1980,y:1240},{n:'jpTeaHouse',x:860,y:1700,flip:1},{n:'jpMachiyaA',x:2150,y:1640},
    {n:'jpKoi',x:1500,y:1500},{n:'jpStallFish',x:1200,y:1400},{n:'jpStallVeg',x:1800,y:1400},{n:'jpStallDango',x:1190,y:1620},{n:'jpStallFan',x:1810,y:1630,flip:1},
    {n:'jpBenchUmb',x:1370,y:1650},{n:'jpBenchUmb',x:1640,y:1650,flip:1},{n:'jpLanternT',x:1300,y:1330},{n:'jpLanternT',x:1700,y:1330},{n:'jpNotice',x:1330,y:1210},{n:'jpLuckyCat',x:1690,y:1215},{n:'jpRickshaw',x:1960,y:1540},{n:'jpRiceBales',x:1050,y:1560},
    /* west and east streets */
    {n:'jpMachiyaB',x:380,y:1250},{n:'jpMachiyaA',x:680,y:1290,flip:1},{n:'jpFarmhouse',x:560,y:1660},{n:'jpWell',x:860,y:1340},{n:'jpBonsaiPot',x:240,y:1260},
    {n:'jpCraftHall',x:2380,y:1160},{n:'jpMachiyaB',x:2660,y:1030,flip:1},{n:'jpNobori',x:2230,y:1250},
    /* lower street */
    {n:'jpDojo',x:1160,y:1890,flip:1},{n:'jpMachiyaA',x:1930,y:1880},{n:'jpSake',x:1700,y:1910},{n:'jpRiceBales',x:900,y:1930},{n:'jpLanternT',x:1360,y:1930},
    {n:'jpShrineS',x:1500,y:2200},{n:'jpToriiS',x:1500,y:2105},{n:'jpFoxL',x:1400,y:2160},{n:'jpFoxR',x:1600,y:2160},
    {n:'jpSign',x:330,y:1430},{n:'jpSign',x:2700,y:1230},{n:'jpSign',x:1640,y:1860}],
  warps:[{id:'toF1',x:200,y:1350,to:'jpnF1',at:'toT',label:'หุบซากุระ'},{id:'toF2',x:2800,y:1150,to:'jpnF2',at:'toT',label:'นาข้าวขั้นบันได'}]}),

/* ---------------- Field 1 · Sakura Valley ---------------- */
jpnF1:M({name:'หุบซากุระ Sakura Valley',lv:'1–8',seed:521,W:4800,H:3600,mood:'sakura',sakura:1,lily:1,patches:[{tex:'jpPetals',scale:620,thr:.55,rim:false,a:.8}],
  border:{set:[...SAKURA,...PINE]},groves:{set:[...SAKURA,...SAKURA,'jpPine1'],thr:.6,dens:.8},under:SHRUB,open:[...SHRUB,...ROCKO,'jpJizo','jpLantern'],edge:['jpAzalea','jpIris','jpFern'],
  lakes:[{x:3300,y:2700,rx:300,ry:170},{x:1200,y:1200,rx:240,ry:140}],lakeSet:POND,
  trails:[[[4330,500],[3700,900],[2800,1300],[2000,1700],[1300,2300],[700,3100]],[[2000,1700],[2200,2500],[2400,3200]]],
  land:[{n:'jpSacredTree',x:2650,y:1560},{n:'jpToriiS',x:2650,y:1720},{n:'jpJizo',x:1500,y:1300},{n:'jpShrineS',x:1300,y:2600},{n:'jpSign',x:2080,y:1800}],
  clearings:[[2650,1750,440],[1300,2650,360]],
  warps:[{id:'toT',x:4330,y:470,to:'jpnT',at:'toF1',label:'ฮาคุเซ็น'},{id:'toF3',x:700,y:3200,to:'jpnF3',at:'toF1',label:'ป่าไผ่'},{id:'toF5',x:2400,y:3250,to:'jpnF5',at:'toF1',label:'ภูเขาศาลจิ้งจอก'}]}),

/* ---------------- Field 2 · Rice Terraces ---------------- */
jpnF2:M({name:'นาข้าวขั้นบันได Rice Terraces',lv:'4–12',seed:522,W:4800,H:3600,lily:1,
  border:{set:[...PINE,...CLIFF]},groves:{set:[...PINE,'jpCamellia','jpPlum'],thr:.68,dens:.7},openTrees:.01,open:['jpSusuki','jpFern','jpTea','jpStump','jpJizo','jpRiceBales'],edge:['jpSusuki','jpSasa'],
  paddies:{x:850,y:850,w:300,h:190,gap:44,cols:10,ny:9,shift:160,skip:[[2350,1700,330],[1200,2050,170],[3000,1350,150]]},
  trails:[[[460,520],[900,1200],[1200,2000],[2300,2200],[3000,1300],[3200,480]],[[1200,2000],[1300,2700],[1500,3200]]],
  land:[{n:'jpFarmhouse',x:2350,y:1650},{n:'jpRiceBales',x:2560,y:1680},{n:'jpWell',x:2150,y:1700},{n:'jpSign',x:1500,y:3000}],
  clearings:[[2350,1750,300]],
  warps:[{id:'toT',x:460,y:470,to:'jpnT',at:'toF2',label:'ฮาคุเซ็น'},{id:'toF4',x:3200,y:430,to:'jpnF4',at:'toF2',label:'เนินออนเซ็น'},{id:'toD1',x:1500,y:3260,to:'jpnD1a',at:'up',label:'ถ้ำนินจา'}]}),

/* ---------------- Field 3 · Bamboo Forest ---------------- */
jpnF3:M({name:'ป่าไผ่ Bamboo Forest',lv:'10–18',seed:523,W:4800,H:3600,
  border:{set:BAMBOO},groves:{set:BAMBOO,thr:.52,dens:1},openTrees:.03,under:['jpSasa','jpFern'],open:['jpSasa','jpFern','jpStump','jpLantern','jpBasin','jpJizo'],edge:['jpSasa','jpBamboo4'],
  trails:[[[4380,3180],[3600,2600],[2600,1900],[1700,1400],[1100,800],[1100,420]],[[2600,1900],[3300,1300],[3900,1000]]],
  land:[{n:'jpShrineS',x:2600,y:1750},{n:'jpBasin',x:2400,y:1800},{n:'jpLanternTall',x:2800,y:1800},{n:'njToad',x:3900,y:1050}],
  clearings:[[2600,1850,340],[3900,1100,260]],
  warps:[{id:'toF1',x:4380,y:3220,to:'jpnF1',at:'toF3',label:'หุบซากุระ'},{id:'toH1',x:1100,y:380,to:'jpnH1',at:'toF3',label:'ป่าวิญญาณ'}]}),

/* ---------------- Field 4 · Onsen Hills ---------------- */
jpnF4:M({name:'เนินออนเซ็น Onsen Hills',lv:'14–22',seed:524,W:4800,H:3600,maple:1,hot:1,
  border:{set:[...CLIFF,...MAPLE]},groves:{set:[...MAPLE,...MAPLE,'jpPine1','jpPine2','jpCamellia'],thr:.62,dens:.78},open:[...SHRUB,...ROCKO,'jpLantern'],edge:['jpFern','jpBoulder1'],
  lakes:[{x:2300,y:2250,rx:200,ry:110},{x:3500,y:1400,rx:170,ry:95},{x:1500,y:1300,rx:150,ry:85}],lakeSet:['jpReeds'],
  trails:[[[1400,3300],[1700,2600],[2300,1900],[2600,1300],[2400,700],[1200,430]]],
  land:[{n:'jpOnsen',x:2700,y:1750},{n:'jpLanternTall',x:2450,y:1800},{n:'jpBasin',x:2950,y:1820},{n:'jpPagoda',x:1700,y:2300}],
  clearings:[[2700,1850,400],[1700,2400,320]],
  warps:[{id:'toF2',x:1400,y:3330,to:'jpnF2',at:'toF4',label:'นาข้าวขั้นบันได'},{id:'toH2',x:1150,y:400,to:'jpnH2',at:'toF4',label:'สนามรบซามูไร'}]}),

/* ---------------- Field 5 · Fox Shrine Mountain ---------------- */
jpnF5:M({name:'ภูเขาศาลจิ้งจอก Fox Shrine Mountain',lv:'18–26',seed:525,W:4800,H:3600,maple:1,
  border:{set:[...CLIFF,...PINE]},groves:{set:[...PINE,...MAPLE,'jpCamellia','jpPlum'],thr:.62,dens:.8},open:[...SHRUB,'jpLantern','jpFoxL','jpFoxR','jpJizo'],edge:['jpFern','jpSasa'],trails:[],
  /* the shrine path, lined with red gates */
  roads:[{pts:[[2300,420],[2350,1000],[2300,1500]],w:120},{pts:[[2300,1800],[2900,2050],[3700,2100],[4400,1900]],w:100},{pts:[[2300,1800],[1500,2000],[1000,2250]],w:90}],
  land:[{n:'jpFoxShrine',x:2300,y:1700},{n:'jpToriiS',x:2340,y:700},{n:'jpToriiS',x:2350,y:900},{n:'jpToriiS',x:2340,y:1100},{n:'jpToriiS',x:2320,y:1300},
    {n:'jpFoxL',x:2150,y:1450},{n:'jpFoxR',x:2470,y:1450},{n:'jpLanternTall',x:2100,y:1250},{n:'jpLanternTall',x:2520,y:1250},{n:'jpEma',x:2700,y:1800},{n:'jpBasin',x:1950,y:1780},{n:'jpToriiBig',x:3600,y:2050}],
  clearings:[[2300,1850,380],[1100,2250,300]],
  warps:[{id:'toF1',x:2300,y:380,to:'jpnF1',at:'toF5',label:'หุบซากุระ'},{id:'toF6',x:4420,y:1900,to:'jpnF6',at:'toF5',label:'ท่าเรือฮาคุเซ็น'}]}),

/* ---------------- Field 6 · Hakusen Port ---------------- */
jpnF6:M({name:'ท่าเรือฮาคุเซ็น Hakusen Port',lv:'22–30',seed:526,W:4800,H:3600,
  sea:{side:'S',d:1050,amp:220},seaSet:['jpSeaRock1','jpSeaRock2'],
  border:{set:[...CLIFF,...PINE]},groves:{set:[...PINE,'jpPine3','jpSakura1','jpCamellia'],thr:.63,dens:.75},open:[...SHRUB,'jpRiceBales','jpSake','jpNetRack','jpLantern'],edge:['jpSusuki','jpBoulder1'],trails:[],
  roads:[{pts:[[380,1800],[1100,1850],[1900,1800],[2700,1900],[3400,2200]],w:130},{pts:[[3400,2200],[3900,2400],[4000,2500]],w:110}],
  land:[{n:'jpShip',x:2000,y:2650,coast:-270},{n:'jpNetRack',x:1500,y:2250},{n:'jpNetRack',x:2600,y:2250},{n:'jpRiceBales',x:1750,y:2180},{n:'jpSake',x:2350,y:2200},{n:'jpMachiyaB',x:1100,y:1700},{n:'jpRamen',x:2900,y:1750},{n:'jpLanternTall',x:1950,y:1950}],
  clearings:[[2000,2100,460]],
  warps:[{id:'toF5',x:380,y:1800,to:'jpnF5',at:'toF6',label:'ภูเขาศาลจิ้งจอก'},{id:'toCap',x:4000,y:2480,to:'cNE',at:'toJpn',label:'เนินกังหันลมเก่า'}]}),

/* ---------------- Dungeon 1 · Ninja Hideout (2 floors) ---------------- */
jpnD1a:M({name:'ถ้ำนินจา ชั้น 1',lv:'28–36',seed:531,W:3600,H:2700,mood:'cave',ground:'jpPave',dark:1,trailKind:'none',
  walls:CW,border:{band:230},groves:{thr:.53},open:NJ,propDens:.45,edge:[],decals:['njSpikes'],decalDens:.08,
  land:[{n:'njDummy',x:1650,y:1300},{n:'njDummy',x:1950,y:1300},{n:'njRack',x:1800,y:1220}],clearings:[[1800,1450,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'jpnF2',at:'toD1',label:'ทางออก'},{id:'down',x:700,y:640,to:'jpnD1b',at:'up',label:'ชั้น 2'}]}),
jpnD1b:M({name:'ถ้ำนินจา ชั้น 2 · ห้องโจนิน',lv:'36–44',seed:532,W:3600,H:2700,mood:'cave',ground:'jpPave',dark:1,trailKind:'none',
  walls:CW,border:{band:230},groves:{thr:.53},open:NJ,propDens:.45,edge:[],decals:['njSpikes'],decalDens:.1,
  land:[{n:'njToad',x:2600,y:800},{n:'njScroll',x:2900,y:880},{n:'njLamp',x:2350,y:820},{n:'njLamp',x:2850,y:760}],clearings:[[2600,850,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:760,y:2360,to:'jpnD1a',at:'down',label:'ชั้น 1'}]}),

/* ---------------- High field · Spirit Woods ---------------- */
jpnH1:M({name:'ป่าวิญญาณ Spirit Woods',lv:'46–56',seed:541,W:4800,H:3600,mood:'spirit',ground:'jpSpirit',dirtTex:'jpSpirit',dark:1,
  border:{set:['spTree1','spTree2','jpCedar','jpBare']},groves:{set:['spTree1','spTree2','jpCedar','jpBare','jpCedar'],thr:.58,dens:.85},openTrees:.02,under:['jpFern','jpSasa'],open:SPI,edge:['jpFern','spGraves'],
  trails:[[[2400,3250],[2300,2500],[1700,1800],[1100,1100],[700,520]]],
  land:[{n:'spShrine',x:2300,y:1700},{n:'spGraves',x:3200,y:1500},{n:'spWell',x:1400,y:2600},{n:'spLantern',x:2100,y:1650},{n:'spLantern',x:2500,y:1650},{n:'jpToriiBroken',x:2300,y:1900}],
  clearings:[[3200,1650,420],[2300,1800,380],[1400,2750,340],[3600,2700,380],[1200,1300,360]],
  warps:[{id:'toF3',x:2400,y:3300,to:'jpnF3',at:'toH1',label:'ป่าไผ่'},{id:'toD2',x:700,y:540,to:'jpnD2a',at:'up',label:'ปราสาทผีสิง'}]}),

/* ---------------- High field · Warlord's Battlefield ---------------- */
jpnH2:M({name:'สนามรบซามูไร Warlord\'s Battlefield',lv:'52–64',seed:542,W:4800,H:3600,ruinBits:1,maple:1,patches:[{tex:'azSoil',scale:620,thr:.52,rim:false,a:.5}],
  border:{set:[...CLIFF,'jpBare','jpPine3']},groves:{set:['jpBare','jpBare','jpPine3','jpPine1','jpMaple2'],thr:.64,dens:.7},open:[...BAT,'jpSusuki','jpStump'],edge:['btPalisade','jpSusuki'],
  trails:[[[2400,3300],[2500,2600],[3100,2100],[3900,1700],[4400,1500]],[[2500,2600],[1500,2300],[1150,420]]],
  land:[{n:'btCurtain',x:2300,y:1500},{n:'btDrum',x:2100,y:1600},{n:'btBanners',x:2500,y:1560},{n:'btArmor',x:2700,y:1900},{n:'btKatana',x:1900,y:2000},{n:'btCart',x:3100,y:1400}],
  clearings:[[2400,1900,460],[3200,1500,340]],
  warps:[{id:'toF4',x:2400,y:3330,to:'jpnF4',at:'toH2',label:'เนินออนเซ็น'},{id:'toE1',x:4440,y:1500,to:'jpnE1',at:'toH2',label:'เกาะอสูร'}]}),

/* ---------------- Dungeon 2 · Haunted Castle (3 floors) ---------------- */
jpnD2a:M({name:'ปราสาทผีสิง ชั้น 1',lv:'58–66',seed:551,W:3600,H:2700,mood:'mine',theme:'temple',ground:'jpTatami',trailKind:'none',
  walls:KW,border:{band:240},groves:{thr:.62},propDens:.35,open:CS,edge:[],decals:['csPlate'],decalDens:.08,
  land:[{n:'csArmor',x:1650,y:1250},{n:'csArmor',x:1950,y:1250},{n:'csScreen',x:1800,y:1200}],clearings:[[1800,1400,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2060,to:'jpnH1',at:'toD2',label:'ทางออก'},{id:'down',x:3000,y:600,to:'jpnD2b',at:'up',label:'ชั้น 2'}]}),
jpnD2b:M({name:'ปราสาทผีสิง ชั้น 2',lv:'66–73',seed:552,W:3600,H:2700,mood:'mine',theme:'temple',ground:'jpTatami',trailKind:'none',
  walls:KW,border:{band:240},groves:{thr:.62},propDens:.35,open:CS,edge:[],decals:['csPlate'],decalDens:.08,
  land:[{n:'csDoll',x:1800,y:1200},{n:'csAndon',x:1600,y:1250},{n:'csAndon',x:2000,y:1250},{n:'csTea',x:1800,y:1400}],clearings:[[1800,1350,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:640,y:2260,to:'jpnD2a',at:'down',label:'ชั้น 1'},{id:'down',x:2960,y:2260,to:'jpnD2c',at:'up',label:'ชั้น 3'}]}),
jpnD2c:M({name:'ปราสาทผีสิง ชั้น 3 · ห้องโชกุน',lv:'73–80',seed:553,W:3600,H:2700,mood:'mine',theme:'temple',ground:'jpTatami',trailKind:'none',
  walls:KW,border:{band:240},groves:{thr:.62},propDens:.3,open:CS,edge:[],decals:['csPlate'],decalDens:.06,
  land:[{n:'csSeat',x:1800,y:1100},{n:'csArmor',x:1500,y:1200},{n:'csArmor',x:2100,y:1200},{n:'csAndon',x:1600,y:1000},{n:'csAndon',x:2000,y:1000},{n:'csChest',x:1550,y:1500},{n:'csChest',x:2050,y:1500},{n:'csScreen',x:1800,y:1550}],
  clearings:[[1800,1350,520]],spawnN:20,spawnGap:300,
  warps:[{id:'up',x:640,y:2260,to:'jpnD2b',at:'down',label:'ชั้น 2'},{id:'toE2',x:3050,y:500,to:'jpnE2',at:'toD2',label:'ศาลเทพมังกร'}]}),

/* ---------------- End game · Onigashima ---------------- */
jpnE1:M({name:'เกาะอสูร Onigashima',lv:'76–86',seed:561,W:4800,H:3600,mood:'oni',ground:'jpOni',dirtTex:'jpOni',dark:1,
  sea:{side:'S',d:520,amp:200},
  border:{set:['oniRocks','oniRocks','oniRocks','oniTree']},groves:{set:['oniRocks','oniRocks','oniRocks','oniTree'],thr:.6,dens:.9},openTrees:.01,open:ONI,edge:['oniBones','oniRocks'],
  trails:[[[700,2800],[1400,2500],[2400,2200],[3400,2300],[4400,2350]]],
  land:[{n:'oniGate',x:2400,y:1450},{n:'oniBrazier',x:2150,y:1550},{n:'oniBrazier',x:2650,y:1550},{n:'oniMask',x:1500,y:1600},{n:'oniCage',x:3300,y:1600},{n:'oniClub',x:2800,y:1950}],
  clearings:[[2400,2000,420],[2400,1550,360],[1500,1900,330]],
  warps:[{id:'toH2',x:700,y:2820,to:'jpnH2',at:'toE1',label:'สนามรบซามูไร'},{id:'toE2',x:4420,y:2350,to:'jpnE2',at:'toE1',label:'ศาลเทพมังกร'}]}),

/* ---------------- End game · Dragon Kami Shrine ---------------- */
jpnE2:M({name:'ศาลเทพมังกร Dragon Kami Shrine',lv:'84–94',seed:571,W:4800,H:3600,mood:'dragon',ground:'jpPave',dirtTex:'jpPave',dark:1,patches:[{tex:'jpSpirit',scale:560,thr:.55,rim:false,a:.6}],
  border:{set:[...CLIFF,'jpCedar','jpPine2']},groves:{set:['jpCedar','jpCedar','jpPine2','jpPine1','jpPillar1'],thr:.62,dens:.8},openTrees:.006,open:DRG,edge:['drLantern','jpBoulder1'],
  lakes:[{x:2400,y:1550,rx:260,ry:120}],lakeSet:['jpLotus'],
  trails:[[[4400,2400],[3700,2200],[2900,1900],[2400,1850]],[[2400,1850],[2100,2500],[1000,3000],[600,3200]]],
  land:[{n:'jpDragonStatue',x:2400,y:1250},{n:'drShrine',x:2900,y:1300},{n:'drBell',x:1900,y:1300},{n:'drPearl',x:2400,y:1820},{n:'drRopeGate',x:2400,y:2050},{n:'drPillar',x:2150,y:1950},{n:'drPillar',x:2650,y:1950}],
  clearings:[[2400,1650,480],[1500,1700,340]],
  warps:[{id:'toE1',x:4440,y:2400,to:'jpnE1',at:'toE2',label:'เกาะอสูร'},{id:'toD2',x:560,y:3250,to:'jpnD2c',at:'toE2',label:'ปราสาทผีสิง ชั้น 3'}]})
};
window.VK_MAPS=Object.assign(window.VK_MAPS||{},JP);
window.JP_ORDER=['jpnT','jpnF1','jpnF2','jpnF3','jpnF4','jpnF5','jpnF6','jpnD1a','jpnD1b','jpnH1','jpnH2','jpnD2a','jpnD2b','jpnD2c','jpnE1','jpnE2'];
const T=(n,th,a,b,base,col,sc)=>({base,name:n,th,lv:[a,b],sc:sc||1,[base==='snowwolf'?'flt':'tint']:col});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  jpnF1:[T('Tanuki','ทานุกิ',1,8,'snowwolf','sepia(.8) brightness(.85)',.7),T('Petal Sprite','ภูตกลีบซากุระ',3,8,'frostling','#f0a8c0',.75)],
  jpnF2:[T('Kappa','กัปปะ',4,12,'frostling','#70a860',.9),T('Walking Scarecrow','หุ่นฟางเดินได้',6,12,'frostling','#d0b070',1)],
  jpnF3:[T('Red Panda','แพนด้าแดง',10,18,'snowwolf','sepia(1) saturate(2.4) hue-rotate(-15deg)',.8),T('Ninja Trainee','นินจาฝึกหัด',12,18,'frostling','#404050',.95)],
  jpnF4:[T('Snow Monkey','ลิงหิมะ',14,22,'snowwolf','brightness(1.2) saturate(.3)',.85),T('Steam Spirit','ภูตไอน้ำ',16,22,'frostling','#d0e8f0',1)],
  jpnF5:[T('Kitsune','คิทสึเนะ',18,26,'snowwolf','sepia(1) saturate(2) brightness(1.1)',.95),T('Tengu','เท็งงุ',20,26,'frostling','#c84040',1)],
  jpnF6:[T('Wako Pirate','โจรสลัดวาโค',22,30,'frostling','#6a5040',1.05),T('Little Octopus','ปลาหมึกน้อย',24,30,'frostling','#d06080',.85)],
  jpnD1a:[T('Shadow Ninja','นินจาเงา',28,36,'frostling','#302838',1),T('Giant Toad','คางคกยักษ์',30,36,'frostling','#8a7a40',1.3)],
  jpnD1b:[T('Kunai Trap','กับดักคุไน',36,44,'frostling','#888898',.9),T('Shadow Ninja','นินจาเงา',38,44,'frostling','#201828',1.05)],
  jpnH1:[T('Yurei','ยูเร',46,56,'frostling','#c0d0f0',1),T('Spirit Wolf','หมาป่าวิญญาณ',48,56,'snowwolf','brightness(1.3) hue-rotate(180deg) saturate(.5)',1)],
  jpnH2:[T('Ronin','ซามูไรไร้นาย',52,64,'frostling','#7a4a3a',1.1),T('War Horse','ม้าศึก',54,64,'snowwolf','sepia(.9) brightness(.6)',1.15)],
  jpnD2a:[T('Undead Ninja','นินจาอันเดด',58,66,'frostling','#4a4a5a',1.05),T('Cursed Doll','ตุ๊กตาสาป',60,66,'frostling','#e0b0b0',.8)],
  jpnD2b:[T('Ghost Samurai','ซามูไรผี',66,73,'frostling','#8090b0',1.15),T('Cursed Doll','ตุ๊กตาสาป',66,73,'frostling','#d09090',.85)],
  jpnD2c:[T('Shogun Guard','องครักษ์โชกุน',73,80,'frostling','#a03030',1.3),T('Shadow Hound','หมาเงา',74,80,'snowwolf','brightness(.3)',1.2)],
  jpnE1:[T('Oni','ยักษ์โอนิ',76,86,'frostling','#c03020',1.45),T('Demon Swordsman','นักดาบปีศาจ',78,86,'frostling','#602030',1.15)],
  jpnE2:[T('Great Serpent','งูยักษ์',84,94,'snowwolf','hue-rotate(90deg) brightness(.8)',1.35),T('Thunder Dragon Priest','นักบวชมังกร',86,94,'frostling','#80a0e0',1.25)]});
})();
