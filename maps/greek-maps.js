/* =====================================================================
   AETHERFALL — Greek zone (Ionia region) map configs, read by createFieldHost (maps/fieldmap.js).
   Pieces live in maps/greek/ and are listed in maps/viking-catalog.js (entries with d:'greek').
   Same rules as the other zones: limestone cliffs and olive groves are solid, open ground stays open,
   warps link the maps, tracks are faint, repeats are capped, dungeons use continuous painted walls.
   ===================================================================== */
(function(){
const OLIVE=['grOlive1','grOlive2','grOlive3','grOlive4','grOliveYoung'];
const MED=[...OLIVE,'grCypress','grCypress2','grUmbPine','grLaurel','grOak','grFig'];
const FRUIT=['grLemon','grPomegr','grFig','grOrange','grOleanderT'];
const CLIFF=['grCliff1','grCliff2','grCliff3','grCliff4','grCliff5','grCliff6','grCliff7','grCliff8','grCliff9','grCliff10','grCliff11','grCliff12','grStack1','grStack2','grStack3','grStack4','grBoulders1','grBoulders2','grBoulders3','grBoulders4'];
const ROCKO=['grBoulder1','grBoulder2','grBoulders1','grBoulders2','grBoulders5','grBoulders6'];
const SHRUB=['grLavender','grRosemary','grOleander','grThyme','grPoppy','grAgave','grPear','grDryGrass','grMyrtle','grAcanthus','grIvyStump','grSeaLav'];
const RUIN=['grColDoric','grColBroken','grColToppled','grColIonic','grCapital','grHeroStatue','grHeadless','grHead','grAmphorae','grAltar','grBench','grPediment','grArch','grHerm','grBrazier','grMosaic'];
const SEAR=['grSeaRock1','grSeaRock2','grSeaRock3','grSeaRock4','grSeaRock5','grSeaRock6'];
const HEC=['hcTree','hcTree','hcLanternTree','grCypress','grCypress2','grOliveDead'];
const HECO=['hcShrooms','hcCauldron','hcDogStatue','hcStones','hcLantern','grIvyStump','grHerm'];
const TROY=['trChariot','trShields','trHelmet','trBarricade','trTent','trCatapult','trBanner','trRubble'];
const HAD=['hdRocks','hdTree','hdBones','hdPillar','hdBrazier','hdGate','hdTomb'];
const OLY=['olCols','olStruck','olEagle','olFountain','olBrazier','grColIonic','grColDoric','grHeroStatue'];
const CYC=['cyBones','cyClub','cyFire','cyStalag','cyFleece','cyJar','cyStalag'];
const LAB=['lbBull','lbPillar','lbPillarBroken','lbBrazier','lbBones'];
const G={theme:'greek',ground:'grGrass',mood:'greek',trailKind:'trample',dirtTex:'grVineSoil',lakeTex:'grSea',seaTex:'grSea',streamTex:'grSea',cobbleTex:'grMarble'};
const M=(o)=>Object.assign({},G,o);
const CW={face:'grWallCave',top:'caveTop',fh:150,tint:'rgba(60,60,70,.25)',dark:'8,8,12'};
const LW={face:'grWallLab',top:'grMarble',fh:160,block:1,tint:'rgba(40,24,10,.55)',dark:'10,6,4'};

const GR={
/* ---------------- Ionia (home town) ---------------- */
grkT:M({name:'ไอโอเนีย Ionia',lv:'เมือง',seed:411,doorRe:'^gr(Villa|Bakery|Potter|Tavern|House(A|B|Vine)|Smith|CraftHall)$',stepTex:'grMarble',fringe:.22,W:3000,H:2480,mons:false,dirtTex:'grBeach',roadWear:.8,noShells:1,
  border:{set:[...CLIFF,...OLIVE,'grCypress'],band:200,calm:1},openTrees:0,propDens:.1,open:['grLavender','grRosemary','grOleander','grThyme','grPoppy'],decalDens:.5,trails:[],
  sea:{side:'S',d:400,amp:70},seaSet:SEAR,
  /* temple on the hill -> broad stair avenue -> agora with the fountain -> harbour street -> quay along the sea */
  roads:[{pts:[[1500,960],[1490,1150],[1500,1320]],w:190,tex:'grMarble'},
    {pts:[[190,1350],[520,1390],[820,1440],[1120,1480]],w:112,tex:'grMarble'},
    {pts:[[1880,1450],[2200,1340],[2520,1210],[2810,1150]],w:112,tex:'grMarble'},
    {pts:[[1500,1680],[1530,1820],[1560,1950]],w:130,tex:'grMarble'},
    {pts:[[760,1960],[1150,1975],[1560,1965],[1980,1975],[2420,1950]],w:120,tex:'grMarble'}],
  squares:[{x:1500,y:930,rx:440,ry:120,tex:'grMarble'},{x:1500,y:1490,rx:430,ry:215,tex:'grMarble'}],
  clusters:[{x:560,y:620,r:300,set:OLIVE,n:8,sp:100},{x:2420,y:600,r:280,set:OLIVE,n:7,sp:100},{x:2620,y:1560,r:170,set:FRUIT,n:4,sp:100},{x:420,y:1760,r:170,set:FRUIT,n:4,sp:100},{x:1500,y:330,r:260,set:['grCypress','grCypress2','grLaurel'],n:5,sp:110}],
  land:[{n:'grAthena',x:1500,y:860,walk:[[0,-80,80,105]]},
    {n:'grCypress2',x:1120,y:830},{n:'grCypress2',x:1880,y:830},{n:'grOwlStatue',x:1290,y:1010},{n:'grOwlStatue',x:1710,y:1010},{n:'grBrazierT',x:1370,y:1130},{n:'grBrazierT',x:1620,y:1130},
    /* around the agora */
    {n:'grVilla',x:1030,y:1250},{n:'grBakery',x:1980,y:1240},{n:'grPotter',x:860,y:1700,flip:1},{n:'grTavern',x:2150,y:1640},
    {n:'grFountain',x:1500,y:1490},{n:'grStallOil',x:1200,y:1400},{n:'grStallFlower',x:1800,y:1400},{n:'grStallPot',x:1190,y:1620},{n:'grStallFish',x:1810,y:1630,flip:1},
    {n:'grBenchT',x:1380,y:1640},{n:'grBenchT',x:1630,y:1640},{n:'grLemonPot',x:1300,y:1330},{n:'grLemonPot',x:1700,y:1330},{n:'grNotice',x:1330,y:1210},{n:'grBanner',x:1670,y:1210},{n:'grCart',x:1960,y:1540},{n:'grAmphoraStack',x:1050,y:1560},
    /* west and east streets */
    {n:'grHouseA',x:380,y:1250},{n:'grHouseB',x:680,y:1290,flip:1},{n:'grHouseVine',x:560,y:1640},{n:'grWell',x:860,y:1340},
    {n:'grCraftHall',x:2380,y:1160},{n:'grHouseB',x:2660,y:1030},{n:'grHouseA',x:2480,y:1480,flip:1},{n:'grBanner',x:2230,y:1250},
    /* harbour */
    {n:'grHouseVine',x:1160,y:1890,flip:1},{n:'grHouseA',x:1930,y:1890},{n:'grNetRack',x:900,y:1930},{n:'grNetRack',x:2250,y:1920},{n:'grAmphoraStack',x:1700,y:1920},{n:'grCart',x:1360,y:1930},
    {n:'grTrireme',x:2080,y:2200,coast:-190},{n:'grLighthouse',x:2640,y:1990,coast:-90},{n:'grSign',x:330,y:1430},{n:'grSign',x:2700,y:1230},{n:'grSign',x:1640,y:1860}],
  warps:[{id:'toF1',x:200,y:1350,to:'grkF1',at:'toT',label:'เนินมะกอก'},{id:'toF2',x:2800,y:1150,to:'grkF2',at:'toT',label:'หาดหินอ่อน'}]}),

/* ---------------- Field 1 · Olive Hills ---------------- */
grkF1:M({name:'เนินมะกอก Olive Hills',lv:'1–8',seed:421,W:4800,H:3600,patches:[{tex:'grVineSoil',scale:620,thr:.66,rim:false,a:.4}],
  border:{set:[...CLIFF,...OLIVE]},groves:{set:[...OLIVE,...OLIVE,'grCypress','grLaurel'],thr:.6,dens:.8},under:SHRUB,open:[...SHRUB,...ROCKO],edge:SHRUB,
  trails:[[[4330,500],[3700,900],[2800,1300],[2000,1700],[1300,2300],[700,3100]],[[2000,1700],[2200,2500],[2400,3200]]],
  land:[{n:'grAltar',x:2700,y:1600},{n:'grHerm',x:1500,y:1300},{n:'grColToppled',x:1300,y:2600},{n:'grSign',x:2080,y:1800}],
  clearings:[[2600,1700,420],[1300,2600,360],[3300,2700,320]],
  warps:[{id:'toT',x:4330,y:470,to:'grkT',at:'toF1',label:'ไอโอเนีย'},{id:'toF3',x:700,y:3200,to:'grkF3',at:'toF1',label:'ไร่องุ่นขั้นบันได'},{id:'toF5',x:2400,y:3250,to:'grkF5',at:'toF1',label:'เกาะไซเรน'}]}),

/* ---------------- Field 2 · Marble Shore ---------------- */
grkF2:M({name:'หาดหินอ่อน Marble Shore',lv:'4–12',seed:422,W:4800,H:3600,ground:'grBeach',patches:[{tex:'grGrass',scale:620,thr:.55,rim:false,a:.85}],
  sea:{side:'E',d:1300,amp:320},
  border:{set:[...CLIFF,'grUmbPine']},groves:{set:['grUmbPine','grUmbPine','grOlive1','grCypress','grStack1','grCliff3'],thr:.64,dens:.75},open:[...SHRUB,'grBeachGrass','grColBroken','grCapital','grBoulder1'],edge:['grBeachGrass','grSeaLav','grBoulder2'],
  seaSet:SEAR,
  trails:[[[460,520],[900,1200],[1200,2000],[2300,2200],[3000,1300],[3200,480]],[[1200,2000],[1300,2700],[1500,3200]]],
  land:[{n:'grTrireme',x:3150,y:2300,coast:-60},{n:'grColossusGod',x:2200,y:1500},{n:'grLighthouse',x:3300,y:900,coast:120}],
  clearings:[[2300,2300,380],[900,1500,300]],
  warps:[{id:'toT',x:460,y:470,to:'grkT',at:'toF2',label:'ไอโอเนีย'},{id:'toF4',x:3200,y:430,to:'grkF4',at:'toF2',label:'ตลาดเก่าร้าง'},{id:'toD1',x:1500,y:3260,to:'grkD1a',at:'up',label:'ถ้ำไซคลอปส์'}]}),

/* ---------------- Field 3 · Vineyard Terraces ---------------- */
grkF3:M({name:'ไร่องุ่นขั้นบันได Vineyard Terraces',lv:'10–18',seed:423,W:4800,H:3600,patches:[{tex:'grVineSoil',scale:700,thr:.48,rim:false,a:.9}],
  border:{set:[...CLIFF,...MED]},groves:{set:[...FRUIT,...OLIVE,'grCypress'],thr:.66,dens:.7},openTrees:.02,open:['grTrellis','grTrellis','grVineStake','grVineStake','grAmphorae','grDryGrass','grThyme','grPoppy'],edge:['grVineStake','grLavender'],
  /* rows of vines along the terraces */
  rows:{n:'grTrellis',x0:900,x1:3900,y0:900,y1:2900,dx:150,dy:260,keep:.75},
  trails:[[[4380,3180],[3600,2600],[2600,1900],[1700,1400],[1100,800],[1100,420]]],
  land:[{n:'grHouseVine',x:2500,y:1750},{n:'grAmphoraStack',x:2750,y:1780},{n:'grCart',x:2300,y:1800},{n:'grAltar',x:1500,y:2600}],
  clearings:[[2600,1800,420],[1500,2600,300]],
  warps:[{id:'toF1',x:4380,y:3220,to:'grkF1',at:'toF3',label:'เนินมะกอก'},{id:'toH1',x:1100,y:380,to:'grkH1',at:'toF3',label:'ป่าเฮคาที'}]}),

/* ---------------- Field 4 · Ruined Agora ---------------- */
grkF4:M({ruinBits:1,name:'ตลาดเก่าร้าง Ruined Agora',lv:'14–22',seed:424,W:4800,H:3600,patches:[{tex:'grMarble',scale:560,thr:.52,rim:false,a:.8}],
  border:{set:[...CLIFF,'grCypress']},groves:{set:['grCypress','grCypress2','grOliveDead','grOlive2','grLaurel','grCliff2'],thr:.62,dens:.75},open:[...RUIN,'grDryGrass','grIvyStump'],edge:['grColBroken','grCapital','grDryGrass'],
  trails:[[[1400,3300],[1700,2600],[2300,1900],[2600,1300],[2400,700],[1200,430]]],
  land:[{n:'grTheatre',x:3300,y:1500},{n:'grParthenon',x:1500,y:1500},{n:'grMosaic',x:2400,y:1900},{n:'grPediment',x:2700,y:2100},{n:'grHeadless',x:2100,y:2050}],
  clusters:[{x:2200,y:2200,r:320,n:7,set:RUIN},{x:2800,y:1300,r:260,n:5,set:RUIN}],
  clearings:[[2400,2000,460],[3300,1700,380],[1500,1700,360]],
  warps:[{id:'toF2',x:1400,y:3330,to:'grkF2',at:'toF4',label:'หาดหินอ่อน'},{id:'toH2',x:1150,y:400,to:'grkH2',at:'toF4',label:'สนามรบทรอย'}]}),

/* ---------------- Field 5 · Isle of Sirens ---------------- */
grkF5:M({ruinBits:1,name:'เกาะไซเรน Isle of Sirens',lv:'18–26',seed:425,W:4800,H:3600,ground:'grBeach',patches:[{tex:'grGrass',scale:520,thr:.5,rim:false,a:.9}],
  sea:{side:'S',d:1200,amp:360},seaSet:SEAR,
  border:{set:CLIFF},groves:{set:['grUmbPine','grUmbPine','grCypress','grOlive3','grStack2','grCliff4'],thr:.62,dens:.8},open:[...SHRUB,'grBeachGrass','grHead','grColToppled','grBoulder1'],edge:['grBeachGrass','grSeaLav'],
  trails:[[[2300,420],[2350,1100],[2300,1800],[2900,2050],[3700,2100],[4400,1900]],[[2300,1800],[1500,2000],[1000,2250]]],
  land:[{n:'grHelmetBig',x:1600,y:1400},{n:'grArch',x:2600,y:1500},{n:'grMosaic',x:3200,y:1200}],
  clearings:[[2400,1700,460],[1100,2200,300]],
  warps:[{id:'toF1',x:2300,y:380,to:'grkF1',at:'toF5',label:'เนินมะกอก'},{id:'toF6',x:4420,y:1900,to:'grkF6',at:'toF5',label:'ถนนวีรบุรุษ'}]}),

/* ---------------- Field 6 · Hero's Road ---------------- */
grkF6:M({ruinBits:1,name:'ถนนวีรบุรุษ Hero\'s Road',lv:'22–30',seed:426,W:4800,H:3600,patches:[{tex:'grVineSoil',scale:560,thr:.64,rim:false,a:.45}],
  border:{set:[...CLIFF,...MED]},groves:{set:[...MED,'grCliff5'],thr:.63,dens:.75},open:[...SHRUB,...ROCKO,'grHerm','grColBroken'],edge:SHRUB,trails:[],
  roads:[{pts:[[380,1800],[1100,1850],[1900,1800],[2700,1900],[3400,2200],[3900,2700],[4000,3200]],w:140,tex:'grMarble'}],
  land:[{n:'grHeroStatue',x:1500,y:1690},{n:'grHeroStatue',x:1500,y:2010,flip:1},{n:'grHerm',x:2000,y:1690},{n:'grHerm',x:2000,y:2000},{n:'grLionGate',x:2800,y:1740},{n:'grCypress',x:1250,y:1680},{n:'grCypress',x:1750,y:1680}],
  clearings:[[1900,1850,520],[3200,2400,340]],
  warps:[{id:'toF5',x:380,y:1800,to:'grkF5',at:'toF6',label:'เกาะไซเรน'},{id:'toCap',x:4000,y:3260,to:'cW',at:'toGrk',label:'ทุ่งตะวันตก'}]}),

/* ---------------- Dungeon 1 · Cyclops Cave (2 floors) ---------------- */
grkD1a:M({name:'ถ้ำไซคลอปส์ ชั้น 1',lv:'28–36',seed:431,W:3600,H:2700,mood:'cave',ground:'grBeach',patches:[{tex:'grVineSoil',scale:420,thr:.64,rim:false,a:.35}],trailKind:'none',
  walls:CW,border:{band:230},groves:{thr:.6},open:CYC,propDens:.45,edge:[],
  land:[{n:'cyPen',x:1800,y:1250},{n:'cyFire',x:1500,y:1400},{n:'cyClub',x:2100,y:1380}],clearings:[[1800,1450,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'grkF2',at:'toD1',label:'ทางออก'},{id:'down',x:700,y:640,to:'grkD1b',at:'up',label:'ชั้น 2'}]}),
grkD1b:M({name:'ถ้ำไซคลอปส์ ชั้น 2 · ถ้ำโพลีฟีมัส',lv:'36–44',seed:432,W:3600,H:2700,mood:'cave',ground:'grBeach',patches:[{tex:'grSea',scale:400,thr:.7,rim:false,a:.6}],trailKind:'none',
  walls:CW,border:{band:230},groves:{thr:.6},open:CYC,propDens:.45,edge:[],
  land:[{n:'cyTable',x:2600,y:800},{n:'cyFleece',x:2900,y:880},{n:'cyJar',x:2350,y:860},{n:'cyBones',x:2600,y:1000}],clearings:[[2600,850,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:760,y:2360,to:'grkD1a',at:'down',label:'ชั้น 1'}]}),

/* ---------------- High field · Hecate's Grove ---------------- */
grkH1:M({name:'ป่าเฮคาที Hecate\'s Grove',lv:'46–56',seed:441,W:4800,H:3600,mood:'moon',ground:'grHecate',dirtTex:'grHecate',dark:1,
  border:{set:HEC},groves:{set:HEC,thr:.58,dens:.85},openTrees:.02,under:HECO,open:HECO,edge:['hcShrooms','grIvyStump'],
  trails:[[[2400,3250],[2300,2500],[1700,1800],[1100,1100],[700,520]]],
  land:[{n:'hcShrine',x:2300,y:1700},{n:'hcStones',x:3200,y:1500},{n:'hcCauldron',x:1400,y:2600},{n:'hcDogStatue',x:2100,y:1650},{n:'hcDogStatue',x:2500,y:1650,flip:1},{n:'hcLantern',x:2300,y:1450}],
  clearings:[[3200,1650,420],[2300,1700,380],[1400,2750,340],[3600,2700,380],[1200,1300,360]],
  warps:[{id:'toF3',x:2400,y:3300,to:'grkF3',at:'toH1',label:'ไร่องุ่นขั้นบันได'},{id:'toD2',x:700,y:540,to:'grkD2a',at:'up',label:'เขาวงกตไมนอส'}]}),

/* ---------------- High field · Plains of Troy ---------------- */
grkH2:M({ruinBits:1,name:'สนามรบทรอย Plains of Troy',lv:'52–64',seed:442,W:4800,H:3600,patches:[{tex:'grVineSoil',scale:560,thr:.5,rim:false,a:.75}],
  border:{set:[...CLIFF,'grOliveDead','grCypress']},groves:{set:['grOliveDead','grOliveDead','grCypress','grOak','grCliff6','grBoulders3'],thr:.64,dens:.7},open:[...TROY,'grDryGrass','grColToppled'],edge:['trBarricade','grDryGrass','trRubble'],
  trails:[[[2400,3300],[2500,2600],[3100,2100],[3900,1700],[4400,1500]],[[2500,2600],[1500,2300],[1150,420]]],
  land:[{n:'grTrojanHorse',x:2300,y:1500},{n:'trCatapult',x:1700,y:1800},{n:'trTent',x:3000,y:1300},{n:'trTent',x:3300,y:1450,flip:1},{n:'trBanner',x:2700,y:1700},{n:'trChariot',x:1900,y:2300}],
  clearings:[[2400,1900,460],[3200,1500,340]],
  warps:[{id:'toF4',x:2400,y:3330,to:'grkF4',at:'toH2',label:'ตลาดเก่าร้าง'},{id:'toE1',x:4440,y:1500,to:'grkE1',at:'toH2',label:'ประตูยมโลก'}]}),

/* ---------------- Dungeon 2 · Labyrinth of Minos (3 floors) ---------------- */
grkD2a:M({name:'เขาวงกตไมนอส ชั้น 1',lv:'58–66',seed:451,W:3600,H:2700,mood:'mine',theme:'temple',ground:'grMarble',trailKind:'none',maze:1,
  walls:LW,border:{band:240},groves:{thr:.62},propDens:.25,open:LAB,edge:[],decals:['lbPlate','lbThread'],decalDens:.1,
  land:[{n:'lbBull',x:1800,y:1300}],clearings:[[1800,1350,260]],spawnN:24,spawnGap:260,
  warps:[{id:'up',x:1800,y:2280,to:'grkH1',at:'toD2',label:'ทางออก'},{id:'down',x:3000,y:600,to:'grkD2b',at:'up',label:'ชั้น 2'}]}),
grkD2b:M({name:'เขาวงกตไมนอส ชั้น 2',lv:'66–73',seed:452,W:3600,H:2700,mood:'mine',theme:'temple',ground:'grMarble',trailKind:'none',maze:1,
  walls:LW,border:{band:240},groves:{thr:.62},propDens:.25,open:LAB,edge:[],decals:['lbPlate','lbThread'],decalDens:.1,
  land:[{n:'lbBull',x:1800,y:1300},{n:'lbChest',x:1950,y:1380}],clearings:[[1800,1350,260]],spawnN:24,spawnGap:260,
  warps:[{id:'up',x:640,y:2260,to:'grkD2a',at:'down',label:'ชั้น 1'},{id:'down',x:2960,y:2260,to:'grkD2c',at:'up',label:'ชั้น 3'}]}),
grkD2c:M({name:'เขาวงกตไมนอส ชั้น 3 · ใจกลางเขาวงกต',lv:'73–80',seed:453,W:3600,H:2700,mood:'mine',theme:'temple',ground:'grMarble',trailKind:'none',maze:1,
  walls:LW,border:{band:240},groves:{thr:.62},propDens:.2,open:LAB,edge:[],decals:['lbPlate'],decalDens:.08,
  land:[{n:'lbBull',x:1800,y:1150},{n:'lbBrazier',x:1550,y:1200},{n:'lbBrazier',x:2050,y:1200},{n:'lbChest',x:1800,y:1450},{n:'lbBones',x:1550,y:1500}],
  clearings:[[1800,1300,460]],spawnN:20,spawnGap:280,
  warps:[{id:'up',x:640,y:2260,to:'grkD2b',at:'down',label:'ชั้น 2'},{id:'toE2',x:3050,y:500,to:'grkE2',at:'toD2',label:'ยอดเขาโอลิมปัส'}]}),

/* ---------------- End game · Gates of Hades ---------------- */
grkE1:M({name:'ประตูยมโลก Gates of Hades',lv:'76–86',seed:461,W:4800,H:3600,mood:'hades',ground:'grHades',dirtTex:'grHades',lakeTex:'grSea',dark:1,
  border:{set:['hdRocks','hdRocks','hdTree','hdPillar']},groves:{set:['hdRocks','hdRocks','hdTree','hdPillar','hdGate'],thr:.6,dens:.8},openTrees:.01,open:HAD,edge:['hdBones','hdRocks'],
  lakes:[{x:2400,y:2650,rx:700,ry:180}],lakeSet:['hdBoat'],
  trails:[[[700,3250],[1400,2700],[2400,2200],[3400,2300],[4400,2350]]],
  land:[{n:'hdGate',x:2400,y:1450},{n:'hdBrazier',x:2150,y:1550},{n:'hdBrazier',x:2650,y:1550},{n:'hdTomb',x:1500,y:1600},{n:'hdTomb',x:3300,y:1600}],
  clearings:[[2400,2000,420],[2400,1550,360],[1500,1900,330]],
  warps:[{id:'toH2',x:700,y:3280,to:'grkH2',at:'toE1',label:'สนามรบทรอย'},{id:'toE2',x:4420,y:2350,to:'grkE2',at:'toE1',label:'ยอดเขาโอลิมปัส'}]}),

/* ---------------- End game · Mount Olympus ---------------- */
grkE2:M({name:'ยอดเขาโอลิมปัส Mount Olympus',lv:'84–94',seed:471,W:4800,H:3600,mood:'olympus',ground:'grOlympus',dirtTex:'grMarble',dark:1,
  border:{set:['olCloud','olCloud','olCloud','olStruck']},groves:{set:['olCloud','olCloud','olCloud','olStruck','olCols'],thr:.62,dens:.8},openTrees:.004,open:OLY,edge:['olCloud','grColIonic'],
  trails:[[[4400,2400],[3700,2200],[2900,1900],[2400,1500],[2400,950]],[[2900,1900],[2100,2500],[1000,3000],[600,3200]]],
  land:[{n:'olThrone',x:2400,y:900},{n:'olBrazier',x:2200,y:980},{n:'olBrazier',x:2600,y:980},{n:'olFloat',x:1400,y:1400},{n:'olEagle',x:3300,y:1300},{n:'olFountain',x:2400,y:1500}],
  clearings:[[2400,1150,440],[1500,1700,340]],
  warps:[{id:'toE1',x:4440,y:2400,to:'grkE1',at:'toE2',label:'ประตูยมโลก'},{id:'toD2',x:560,y:3250,to:'grkD2c',at:'toE2',label:'เขาวงกตไมนอส ชั้น 3'}]})
};
window.VK_MAPS=Object.assign(window.VK_MAPS||{},GR);
window.GR_ORDER=['grkT','grkF1','grkF2','grkF3','grkF4','grkF5','grkF6','grkD1a','grkD1b','grkH1','grkH2','grkD2a','grkD2b','grkD2c','grkE1','grkE2'];
const T=(n,th,a,b,base,col,sc)=>({base,name:n,th,lv:[a,b],sc:sc||1,[base==='snowwolf'?'flt':'tint']:col});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  grkF1:[T('Mountain Goat','แพะภูเขา',1,8,'snowwolf','sepia(.4) brightness(1.2)',.75),T('Olive Sprite','ภูตต้นมะกอก',3,8,'frostling','#9ab060',.8)],
  grkF2:[T('Marble Crab','ปูหินอ่อน',4,12,'frostling','#e8e0d0',.85),T('Walking Statue','รูปปั้นเดินได้',6,12,'frostling','#d8d0c0',1)],
  grkF3:[T('Satyr','ซาเทอร์',10,18,'snowwolf','sepia(.8) brightness(.8)',.9),T('Honey Bee','ผึ้งน้ำผึ้ง',12,18,'frostling','#f0c040',.75)],
  grkF4:[T('Cracked Soldier','ทหารหินแตก',14,22,'frostling','#b0a898',1.05),T('Philosopher Ghost','นักปรัชญาผี',16,22,'frostling','#c8d8f0',1)],
  grkF5:[T('Siren','ไซเรน',18,26,'frostling','#80c8d8',1),T('Harpy','ฮาร์ปี้',20,26,'frostling','#a87850',.95)],
  grkF6:[T('Young Centaur','เซนทอร์หนุ่ม',22,30,'snowwolf','sepia(.7) brightness(.9)',1.05),T('Black Wolf','หมาป่าดำ',24,30,'snowwolf','brightness(.35)',1)],
  grkD1a:[T('Little Cyclops','ไซคลอปส์น้อย',28,36,'frostling','#c8a888',1.2),T('Giant Ram','แกะยักษ์',30,36,'snowwolf','brightness(1.3) saturate(.2)',1)],
  grkD1b:[T('Cave Bat','ค้างคาวถ้ำ',36,44,'frostling','#5a4a5a',.85),T('Cyclops','ไซคลอปส์',38,44,'frostling','#b89878',1.35)],
  grkH1:[T('Hecate Witch','แม่มดเฮคาที',46,56,'frostling','#8a60c0',1),T('Little Cerberus','สุนัขสามหัวน้อย',48,56,'snowwolf','brightness(.3) hue-rotate(250deg)',1)],
  grkH2:[T('Spartan Ghost','ทหารสปาร์ตันผี',52,64,'frostling','#c87850',1.1),T('Amazon','อามาซอน',54,64,'frostling','#d0a070',1.05)],
  grkD2a:[T('Stone Bull','กระทิงหิน',58,66,'snowwolf','saturate(.2) brightness(.9)',1.15),T('Little Medusa','งูเมดูซ่าน้อย',60,66,'frostling','#70a060',1)],
  grkD2b:[T('Lost One','ผู้หลงทาง',66,73,'frostling','#a09080',1.05),T('Stone Bull','กระทิงหิน',66,73,'snowwolf','saturate(.1) brightness(.8)',1.2)],
  grkD2c:[T('Labyrinth Guard','องครักษ์เขาวงกต',73,80,'frostling','#c88a40',1.3),T('Bronze Bull','กระทิงทองแดง',74,80,'snowwolf','sepia(1) saturate(2.5)',1.25)],
  grkE1:[T('Cerberus','เคอร์เบอรัส',76,86,'snowwolf','brightness(.3) hue-rotate(150deg)',1.35),T('Styx Ghost','ผีแม่น้ำสติกซ์',78,86,'frostling','#60c8b8',1.1)],
  grkE2:[T('Griffin','กริฟฟิน',84,94,'snowwolf','sepia(1) saturate(2) brightness(1.15)',1.35),T('Thunder Guard','องครักษ์สายฟ้า',86,94,'frostling','#f0e080',1.3)]});
})();
