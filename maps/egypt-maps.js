/* =====================================================================
   AETHERFALL — Egypt zone (Kemet region) map configs, read by createFieldHost (maps/fieldmap.js).
   Pieces live in maps/egypt/ and are listed in maps/viking-catalog.js (entries with d:'egypt').
   Same rules as the other zones: dense rock/palm groves are solid, open ground stays open, warps link the maps,
   tracks are faint, repeats are capped, dungeons use continuous painted walls.
   ===================================================================== */
(function(){
const PALMS=['egPalmDate1','egPalmDate2','egPalmTwin','egDoum','egPalmCluster','egPalmShort','egFanPalm','egPalmLean'];
const OTREE=['egAcacia1','egAcacia2','egFig','egTamarisk','egTamWeep','egOlive'];
const OASIS=[...PALMS,...OTREE],DRY=['egAcacia1','egAcacia2','egDeadTree','egDoum','egPalmShort'];
const CLIFF=['egCliff1','egCliff2','egCliff3','egCliff4','egCliff5','egCliff6','egSpire1','egSpire2','egSpire3','egBoulders1','egBoulders2','egBoulders3'];
const ROCKO=['egBoulder1','egBoulder2','egRockSand1','egRockSand2','egBoulders1','egBoulders2','egBoulders3'];
const SHRUB=['egShrub','egThorn','egAloe','egCactus','egDryGrass','egTumble'];
const GREEN=['egPapyrus','egReeds','egLotusBush','egFlowerBush','egPalmSprout','egMossLog','egShrub','egPalmSapling'];
const RUIN=['egColBroken','egColLotus','egColToppled','egObelisk','egObeliskBroken','egSphinxS','egRamStatue','egJackalStatue','egCatStatue','egBlocks','egHeadBuried','egCanopic','egPots','egStele','egBrazier','egWallFrag'];
const NILE=['egLotusPink','egLotusWhite','egReedsWater','egLotusPink','egPapyrusBoat'];
const NEC=['enObelisk','enSetStatue','enMastaba','enSarcOpen','enBones','enSkulls','enBrazier','enPillars','enArch','enAltar','enJackal','enHead','enTomb','enCrystal','enRamSkull'];
const SALT=['esCrys1','esCrys2','esPillar','esCrust','esRock1','esRock2','esDeadTree','esSkull'];
const STORM=['ssArch','ssMesa','ssSpires','ssTower','ssWreck','ssHead','ssHorus','ssDark'];
const TOMB=['egtPillarLotus','egtPillar','egtAnubis','egtBrazier','egtCanopic','egtUrns','egtSarcStone'];
const D={theme:'desert',ground:'egSand',mood:'desert',trailKind:'trample',dirtTex:'egCracked',lakeTex:'egNile',seaTex:'egNile',streamTex:'egNile'};
const M=(o)=>Object.assign({},D,o);
const TW={face:'egWallTomb',top:'egTombFloor',fh:160,block:1,tint:'rgba(30,16,6,.55)',dark:'12,8,4'};
const PW={face:'egWallPyr',top:'egTombFloor',fh:160,block:1,tint:'rgba(20,14,30,.6)',dark:'8,6,12'};

const EG={
/* ---------------- Kemet (home town) ---------------- */
egyT:M({name:'เคเมท Kemet',lv:'เมือง',seed:311,doorRe:'^eg(Villa|Barracks|House(A|B|White)|Market|CraftHall|Granary)$',stepTex:'egCity',fringe:.3,W:3000,H:2480,mood:'desert',green:1,mons:false,cobbleTex:'egCity',
  border:{set:[...PALMS,...CLIFF],band:200,calm:1},openTrees:0,propDens:.14,open:['egShrub','egFlowerBush','egPalmSprout','egAloe'],decalDens:.35,trails:[],
  patches:[{tex:'azGrass',scale:420,thr:.7,rim:false,a:.4}],
  /* the palace heads the city; the main street runs from the west gate to its forecourt, then on to the market and the river */
  roads:[{pts:[[190,1600],[600,1520],[1000,1340],[1300,1120]],w:120,tex:'egCity'},
    {pts:[[1500,1150],[1750,1330],[1960,1560],[2150,1900],[2350,2290]],w:104,tex:'egCity'},
    {pts:[[720,1480],[660,1840],[520,2180]],w:72,tex:'egCity'},
    {pts:[[1650,1200],[1950,950],[2300,840]],w:70,tex:'egCity'},
    {pts:[[1100,1300],[1180,1650],[1350,1950]],w:66,tex:'egCity'}],
  squares:[{x:1300,y:1030,rx:330,ry:130,tex:'egCity'},{x:1960,y:1580,rx:230,ry:150,tex:'egCity'},
    {x:2300,y:1150,rx:170,ry:95,tex:'azGrass',kc:'#5a7a3a'},{x:880,y:1960,rx:190,ry:100,tex:'azGrass',kc:'#5a7a3a'}],
  lakes:[{x:2720,y:1050,rx:200,ry:520},{x:2690,y:1900,rx:180,ry:420}],lakeSet:NILE,
  clusters:[{x:2470,y:620,r:200,set:PALMS,n:5,sp:95},{x:2470,y:1560,r:150,set:PALMS,n:3,sp:100},{x:430,y:620,r:220,set:OASIS,n:5,sp:100},{x:1750,y:2230,r:160,set:PALMS,n:3,sp:110},{x:300,y:2250,r:150,set:PALMS,n:3,sp:110}],
  land:[{n:'egTemplePalace',x:1300,y:900,walk:[[0,-110,78,112]]},
    {n:'egVilla',x:660,y:1200},{n:'egCraftHall',x:330,y:1010},{n:'egHouseA',x:420,y:1430},{n:'egHouseB',x:900,y:1660,flip:1},{n:'egHouseWhite',x:1180,y:1430},
    {n:'egShrineCat',x:1720,y:1020},{n:'egMarket',x:1960,y:1410},{n:'egGranary',x:2250,y:820},{n:'egHouseA',x:1520,y:1880,flip:1},{n:'egHouseB',x:1860,y:2120},{n:'egHouseWhite',x:460,y:2060,flip:1},{n:'egVilla',x:2290,y:1690,flip:1},
    {n:'egFountain',x:1040,y:1090},{n:'egWell',x:1570,y:1120},{n:'egTorch',x:1130,y:910},{n:'egTorch',x:1470,y:910},
    {n:'egStallFruit',x:1760,y:1650},{n:'egStallPot',x:2170,y:1690,flip:1},{n:'egStallCloth',x:1930,y:1700},{n:'egStallSpice',x:2280,y:1560},{n:'egCart',x:2060,y:1830},
    {n:'egJars',x:2190,y:1440},{n:'egSacks',x:2380,y:900},{n:'egPlanterPalm',x:1000,y:1210},{n:'egPlanterPalm',x:1600,y:1250},{n:'egBanner',x:760,y:1470},{n:'egBanner',x:1720,y:1250},
    {n:'egNotice',x:1460,y:1250},{n:'egSign',x:420,y:1580},{n:'egSign',x:2200,y:2250},{n:'egCatPed',x:1830,y:1100},{n:'egBench',x:1130,y:1180},{n:'egBench',x:2060,y:1760},{n:'azDock',x:2560,y:1000},{n:'egObelisk',x:960,y:880},{n:'egObelisk',x:1640,y:880}],
  warps:[{id:'toF1',x:200,y:1600,to:'egyF1',at:'toT',label:'โอเอซิสริมไนล์'},{id:'toF2',x:2350,y:2320,to:'egyF2',at:'toT',label:'สามเหลี่ยมปาปิรัส'}]}),

/* ---------------- Field 1 · Nile Oasis ---------------- */
egyF1:M({name:'โอเอซิสริมไนล์ Nile Oasis',lv:'1–8',seed:321,W:4800,H:3600,green:1,patches:[{tex:'azGrass',scale:700,thr:.5,rim:false,a:.85}],
  border:{set:[...PALMS,...CLIFF]},groves:{set:OASIS,thr:.6,dens:.8},under:GREEN,open:[...GREEN,...ROCKO,'egAloe'],edge:GREEN,
  lakes:[{x:3300,y:2550,rx:280,ry:160},{x:1200,y:1200,rx:240,ry:140}],lakeSet:NILE,
  bridge:[2300,1700],bridgeImg:'azCauseway',bridgeDy:125,stream:[[1700,600],[1900,1100],[2150,1450],'B',[2600,2100],[2900,2700],[3100,3300]],
  trails:[[[4330,500],[3700,900],[2900,1300],'B',[1600,2100],[900,2900],[700,3150]],[[1600,2100],[2000,2700],[2400,3200]]],
  land:[{n:'egSphinxS',x:3300,y:1300},{n:'egStele',x:1300,y:2400},{n:'egCanopic',x:3500,y:2200},{n:'egSign',x:2080,y:2000}],
  clearings:[[3300,1450,360],[1300,2500,340],[3300,2800,320]],
  warps:[{id:'toT',x:4330,y:470,to:'egyT',at:'toF1',label:'เคเมท'},{id:'toF3',x:700,y:3200,to:'egyF3',at:'toF1',label:'เนินทรายทอง'},{id:'toF5',x:2400,y:3250,to:'egyF5',at:'toF1',label:'หุบผากษัตริย์'}]}),

/* ---------------- Field 2 · Papyrus Delta ---------------- */
egyF2:M({name:'สามเหลี่ยมปาปิรัส Papyrus Delta',lv:'4–12',seed:322,W:4800,H:3600,green:1,ground:'azGrass',patches:[{tex:'egSand',scale:600,thr:.58,rim:false,a:.8}],
  border:{set:[...PALMS,'egPapyrus','egReeds',...OTREE]},groves:{set:[...PALMS,'egTamWeep','egFig'],thr:.62,dens:.8},under:GREEN,open:[...GREEN,'egPapyrus','egReeds','egBoulder1'],edge:['egPapyrus','egReeds','egLotusBush'],
  lakes:[{x:1300,y:1200,rx:380,ry:220},{x:3300,y:1100,rx:420,ry:240},{x:2300,y:2400,rx:460,ry:230},{x:3900,y:2700,rx:300,ry:200},{x:1100,y:2700,rx:260,ry:160}],lakeSet:NILE,
  trails:[[[460,520],[900,1700],[1700,1900],[2300,1700],[3000,1700],[4330,480]],[[2300,1700],[2600,2800],[3000,3250]]],
  land:[{n:'azDock',x:1600,y:1300},{n:'azDock',x:3000,y:1250},{n:'egPapyrusBoat',x:2600,y:2350},{n:'egStele',x:2400,y:1850}],
  clearings:[[2300,1800,380]],
  warps:[{id:'toT',x:460,y:470,to:'egyT',at:'toF2',label:'เคเมท'},{id:'toF4',x:4330,y:430,to:'egyF4',at:'toF2',label:'เหมืองหินแกรนิต'},{id:'toH2',x:3000,y:3300,to:'egyH2',at:'toF2',label:'ทะเลสาบเกลือ'}]}),

/* ---------------- Field 3 · Golden Dunes ---------------- */
egyF3:M({name:'เนินทรายทอง Golden Dunes',lv:'10–18',seed:323,W:4800,H:3600,patches:[{tex:'egCracked',scale:520,thr:.66,rim:false,a:.55}],
  border:{set:CLIFF},groves:{set:[...CLIFF,'egDeadTree'],thr:.63,dens:.7},openTrees:.006,open:[...SHRUB,...ROCKO,'egHeadBuried','egColToppled','egPots'],edge:[...SHRUB,'egBoulder1'],
  trails:[[[4380,3180],[3600,2600],[2600,1900],[1700,1400],[1100,800],[1100,420]]],
  land:[{n:'egCaravan',x:2650,y:1750},{n:'egSerpentBones',x:1500,y:2500},{n:'egPalmTwin',x:2400,y:1500},{n:'egPalmDate1',x:2950,y:1500}],
  lakes:[{x:2700,y:1450,rx:140,ry:70}],lakeSet:['egReedsWater','egLotusWhite'],
  clearings:[[2650,1800,460],[1500,2550,380]],
  warps:[{id:'toF1',x:4380,y:3220,to:'egyF1',at:'toF3',label:'โอเอซิสริมไนล์'},{id:'toH1',x:1100,y:380,to:'egyH1',at:'toF3',label:'วิหารคาร์นัคร้าง'}]}),

/* ---------------- Field 4 · Granite Quarry ---------------- */
egyF4:M({name:'เหมืองหินแกรนิต Granite Quarry',lv:'14–22',seed:324,W:4800,H:3600,ground:'egCracked',patches:[{tex:'egSand',scale:560,thr:.55,rim:false,a:.8}],
  border:{set:CLIFF},groves:{set:CLIFF,thr:.58,dens:.85},open:['egBlocks','egObeliskBroken','egColBroken','egBoulder1','egBoulder2','egRockSand1','egThorn','egDryGrass','egPots'],edge:['egBlocks','egBoulder1','egThorn'],
  trails:[[[1400,3300],[1700,2600],[2300,1900],[2600,1300],[2400,700],[1200,430]]],
  land:[{n:'egObeliskBroken',x:2500,y:1800},{n:'egBlocks',x:2700,y:1850},{n:'egBlocks',x:2300,y:1700},{n:'egColossus',x:3400,y:1500},{n:'egCart',x:2600,y:2000}],
  clearings:[[2500,1900,420],[3400,1650,380]],
  warps:[{id:'toF2',x:1400,y:3330,to:'egyF2',at:'toF4',label:'สามเหลี่ยมปาปิรัส'},{id:'toH2',x:1150,y:400,to:'egyH2',at:'toF4',label:'ทะเลสาบเกลือ'}]}),

/* ---------------- Field 5 · Valley of Kings ---------------- */
egyF5:M({name:'หุบผากษัตริย์ Valley of Kings',lv:'18–26',seed:325,W:4800,H:3600,patches:[{tex:'egCity',scale:600,thr:.62,rim:false,a:.55}],
  border:{set:CLIFF},groves:{set:CLIFF,thr:.6,dens:.85},open:[...RUIN,'egBoulder1','egThorn'],edge:['egWallFrag','egBlocks','egBoulder2'],
  trails:[[[2300,420],[2350,1100],[2300,1800],[2900,2300],[3700,2400],[4400,2350]],[[2300,1800],[1500,2300],[1100,2900]]],
  land:[{n:'egObeliskGreat',x:2350,y:1350},{n:'egJackalStatue',x:2100,y:1500},{n:'egJackalStatue',x:2600,y:1500,flip:1},{n:'egColossus',x:3300,y:1600},{n:'egHeadBuried',x:1500,y:1600},{n:'egStele',x:1000,y:2700}],
  clusters:[{x:1800,y:2000,r:300,n:6,set:RUIN},{x:3100,y:2100,r:300,n:6,set:RUIN}],
  clearings:[[2400,1900,480],[1100,2800,300]],
  warps:[{id:'toF1',x:2300,y:380,to:'egyF1',at:'toF5',label:'โอเอซิสริมไนล์'},{id:'toF6',x:4420,y:2350,to:'egyF6',at:'toF5',label:'ถนนหินสุริยะ'},{id:'toD1',x:1100,y:3260,to:'egyD1a',at:'up',label:'สุสานขุนนาง'}]}),

/* ---------------- Field 6 · Sunstone Road ---------------- */
egyF6:M({name:'ถนนหินสุริยะ Sunstone Road',lv:'22–30',seed:326,W:4800,H:3600,patches:[{tex:'egCracked',scale:520,thr:.64,rim:false,a:.5}],
  border:{set:CLIFF},groves:{set:[...CLIFF,'egDeadTree','egAcacia2'],thr:.63,dens:.75},openTrees:.006,open:[...SHRUB,...ROCKO,'egObeliskBroken','egColToppled','egStele'],edge:SHRUB,trails:[],
  /* an old paved road with sphinxes on both sides */
  roads:[{pts:[[380,1800],[1100,1850],[1900,1800],[2700,1900],[3400,2200],[3900,2700],[4000,3200]],w:150,tex:'egCity'}],
  land:[{n:'egSphinxS',x:1500,y:1700},{n:'egSphinxS',x:1500,y:2010,flip:1},{n:'egSphinxS',x:1950,y:1690},{n:'egSphinxS',x:1950,y:2000,flip:1},{n:'egRamStatue',x:2400,y:1720},{n:'egRamStatue',x:2400,y:2040,flip:1},{n:'egObeliskGreat',x:2800,y:1700}],
  clearings:[[1950,1850,560],[3200,2400,340]],
  warps:[{id:'toF5',x:380,y:1800,to:'egyF5',at:'toF6',label:'หุบผากษัตริย์'},{id:'toCap',x:4000,y:3260,to:'cE',at:'toEgy',label:'ทุ่งตะวันออก'}]}),

/* ---------------- Dungeon 1 · Noble's Tomb (2 floors) ---------------- */
egyD1a:M({name:'สุสานขุนนาง ชั้น 1',lv:'28–36',seed:331,W:3600,H:2700,mood:'mine',theme:'temple',ground:'egTombFloor',trailKind:'none',
  walls:TW,border:{band:240},groves:{thr:.62},propDens:.35,open:TOMB,edge:[],decals:['egtEyePlate'],decalDens:.1,
  land:[{n:'egtSarcStone',x:1800,y:1300},{n:'egtBrazier',x:1550,y:1350},{n:'egtBrazier',x:2050,y:1350},{n:'egtAnubis',x:1600,y:1150},{n:'egtAnubis',x:2000,y:1150,flip:1}],clearings:[[1800,1450,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'egyF5',at:'toD1',label:'ทางออก'},{id:'down',x:700,y:640,to:'egyD1b',at:'up',label:'ชั้น 2'}]}),
egyD1b:M({name:'สุสานขุนนาง ชั้น 2',lv:'36–44',seed:332,W:3600,H:2700,mood:'mine',theme:'temple',ground:'egTombFloor',trailKind:'none',
  walls:TW,border:{band:240},groves:{thr:.62},propDens:.35,open:TOMB,edge:[],decals:['egtEyePlate','egtSpikes'],decalDens:.12,
  land:[{n:'egtSarcGold',x:2600,y:850},{n:'egtChest',x:2900,y:880},{n:'egtCanopic',x:2350,y:870},{n:'egtTorch',x:2420,y:700},{n:'egtTorch',x:2780,y:700}],clearings:[[2600,850,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:760,y:2360,to:'egyD1a',at:'down',label:'ชั้น 1'}]}),

/* ---------------- High field · Ruined Karnak ---------------- */
egyH1:M({name:'วิหารคาร์นัคร้าง Ruined Karnak',lv:'46–56',seed:341,W:4800,H:3600,patches:[{tex:'egCity',scale:520,thr:.55,rim:false,a:.7}],
  border:{set:CLIFF},groves:{set:[...CLIFF,'egPalmDate1','egDoum'],thr:.62,dens:.75},open:[...RUIN,'egBoulder1'],edge:['egWallFrag','egBlocks','egColBroken'],trails:[],
  roads:[{pts:[[2400,3250],[2400,2500],[2300,1900],[1700,1400],[1100,900],[700,560]],w:140,tex:'egCity'}],
  land:[{n:'egColLotus',x:2150,y:2350},{n:'egColLotus',x:2650,y:2350},{n:'egColLotus',x:2150,y:2650},{n:'egColLotus',x:2650,y:2650},{n:'egColBroken',x:2150,y:2050},{n:'egColLotus',x:2650,y:2050},
    {n:'egRamStatue',x:2050,y:1750},{n:'egRamStatue',x:2550,y:1750,flip:1},{n:'egObeliskGreat',x:1500,y:1100},{n:'egHeadBuried',x:3300,y:1500},{n:'egColossus',x:3500,y:2400},{n:'egSphinxS',x:1200,y:2200}],
  clearings:[[2400,2400,460],[1500,1250,380],[3400,1700,360],[3500,2600,360]],
  warps:[{id:'toF3',x:2400,y:3300,to:'egyF3',at:'toH1',label:'เนินทรายทอง'},{id:'toD2',x:700,y:540,to:'egyD2a',at:'up',label:'มหาพีระมิด'}]}),

/* ---------------- High field · Salt Flats ---------------- */
egyH2:M({name:'ทะเลสาบเกลือ Salt Flats',lv:'52–64',seed:342,W:4800,H:3600,patches:[{tex:'egCracked',scale:600,thr:.5,rim:false,a:.6}],
  border:{set:[...CLIFF,'esRock2']},groves:{set:[...SALT,'esRock1','esRock2','esPillar'],thr:.63,dens:.75},open:SALT,edge:['esCrys1','esRock1','esCrust'],
  lakes:[{x:2400,y:1500,rx:380,ry:200},{x:3600,y:2500,rx:260,ry:140}],lakeSet:['esCrys1','esCrust'],
  trails:[[[2400,3300],[2500,2600],[3100,2100],[3900,1700],[4400,1500]],[[2500,2600],[1500,2300],[1150,420]]],
  land:[{n:'esDeadTree',x:2900,y:1900},{n:'esSkull',x:1600,y:2000},{n:'esPillar',x:2000,y:2400}],
  clearings:[[2400,2100,420],[3500,2900,340]],
  warps:[{id:'toF2',x:2400,y:3330,to:'egyF2',at:'toH2',label:'สามเหลี่ยมปาปิรัส'},{id:'toF4',x:1150,y:400,to:'egyF4',at:'toH2',label:'เหมืองหินแกรนิต'},{id:'toE1',x:4440,y:1500,to:'egyE1',at:'toH2',label:'นครคนตายแห่งเซท'}]}),

/* ---------------- Dungeon 2 · Great Pyramid (3 floors) ---------------- */
egyD2a:M({name:'มหาพีระมิด ชั้น 1',lv:'58–66',seed:351,W:3600,H:2700,mood:'mine',theme:'temple',ground:'egTombFloor',trailKind:'none',
  walls:PW,border:{band:240},groves:{thr:.62},propDens:.35,open:TOMB,edge:[],decals:['egtEyePlate','egtSpikes'],decalDens:.12,
  land:[{n:'egtScarabAltar',x:1800,y:1300},{n:'egtBrazier',x:1500,y:1350},{n:'egtBrazier',x:2100,y:1350}],clearings:[[1800,1450,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'egyH1',at:'toD2',label:'ทางออก'},{id:'down',x:3000,y:600,to:'egyD2b',at:'up',label:'ชั้น 2'}]}),
egyD2b:M({name:'มหาพีระมิด ชั้น 2',lv:'66–73',seed:352,W:3600,H:2700,mood:'mine',theme:'temple',ground:'egTombFloor',trailKind:'none',
  walls:PW,border:{band:240},groves:{thr:.62},propDens:.35,open:[...TOMB,'egtGold'],edge:[],decals:['egtEyePlate','egtSpikes'],decalDens:.12,
  land:[{n:'egtPharaoh',x:1800,y:1200},{n:'egtBrazier',x:1600,y:1260},{n:'egtBrazier',x:2000,y:1260},{n:'egtCanopic',x:1500,y:1350}],clearings:[[1800,1400,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:600,y:2400,to:'egyD2a',at:'down',label:'ชั้น 1'},{id:'down',x:3000,y:2350,to:'egyD2c',at:'up',label:'ชั้น 3'}]}),
egyD2c:M({name:'มหาพีระมิด ชั้น 3 · ห้องฟาโรห์',lv:'73–80',seed:353,W:3600,H:2700,mood:'mine',theme:'temple',ground:'egTombFloor',trailKind:'none',
  walls:PW,border:{band:240},groves:{thr:.62},propDens:.3,open:TOMB,edge:[],decals:['egtEyePlate'],decalDens:.1,
  land:[{n:'egtThrone',x:1800,y:1100},{n:'egtSarcGold',x:1800,y:1450},{n:'egtAnubis',x:1450,y:1250},{n:'egtAnubis',x:2150,y:1250,flip:1},{n:'egtTorch',x:1550,y:950},{n:'egtTorch',x:2050,y:950},{n:'egtGold',x:2150,y:1550},{n:'egtChest',x:1450,y:1550},{n:'egtGold',x:1300,y:1500}],
  clearings:[[1800,1350,520]],spawnN:20,spawnGap:300,
  warps:[{id:'up',x:600,y:2400,to:'egyD2b',at:'down',label:'ชั้น 2'},{id:'toE2',x:3050,y:500,to:'egyE2',at:'toD2',label:'ทะเลพายุทราย'}]}),

/* ---------------- End game · Necropolis of Set ---------------- */
egyE1:M({name:'นครคนตายแห่งเซท Necropolis of Set',lv:'76–86',seed:361,W:4800,H:3600,theme:'necro',mood:'necro',ground:'egNecro',dirtTex:'egNecro',
  border:{set:['ssDark','ssDark','enDeadTree','egCliff1','egCliff3','enPillars','enObelisk']},groves:{set:['ssDark','ssDark','enDeadTree','enPillars','enObelisk','egCliff2','egCliff5','enArch','enMastaba'],thr:.62,dens:.75},openTrees:.01,open:NEC,edge:['enBones','enSkulls','enPillars'],
  trails:[[[700,3250],[1400,2700],[2400,2400],[3400,2300],[4400,2350]]],
  land:[{n:'enAltar',x:2400,y:1450},{n:'enSetStatue',x:2100,y:1550},{n:'enSetStatue',x:2700,y:1550,flip:1},{n:'enBrazier',x:2200,y:1700},{n:'enBrazier',x:2600,y:1700},{n:'enHead',x:1500,y:1600},{n:'enJackal',x:3300,y:1600},{n:'enCrystal',x:3000,y:2800}],
  clearings:[[2400,2200,420],[2400,1550,380],[1500,2000,330]],
  warps:[{id:'toH2',x:700,y:3280,to:'egyH2',at:'toE1',label:'ทะเลสาบเกลือ'},{id:'toE2',x:4420,y:2350,to:'egyE2',at:'toE1',label:'ทะเลพายุทราย'}]}),

/* ---------------- End game · Sea of Storms ---------------- */
egyE2:M({name:'ทะเลพายุทราย Sea of Storms',lv:'84–94',seed:371,W:4800,H:3600,mood:'sandstorm',patches:[{tex:'egCracked',scale:600,thr:.6,rim:false,a:.5}],
  border:{set:[...STORM,...CLIFF]},groves:{set:[...STORM,'egCliff2','egCliff5','egSpire1'],thr:.6,dens:.8},openTrees:.004,open:[...ROCKO,'ssWreck','ssHead','egHeadBuried','egTumble','egDeadTree'],edge:['egRockSand1','egRockSand2','egTumble'],
  trails:[[[4400,2400],[3700,2200],[2900,1900],[2400,1500],[2400,950]],[[2900,1900],[2100,2500],[1000,3000],[600,3200]]],
  land:[{n:'egSerpentBones',x:2400,y:900},{n:'ssTower',x:1400,y:1500},{n:'ssHorus',x:3400,y:1300},{n:'ssWreck',x:2000,y:2300}],
  clearings:[[2400,1100,440],[1500,1700,340]],
  warps:[{id:'toE1',x:4440,y:2400,to:'egyE1',at:'toE2',label:'นครคนตายแห่งเซท'},{id:'toD2',x:560,y:3250,to:'egyD2c',at:'toE2',label:'มหาพีระมิด ชั้น 3'}]})
};
window.VK_MAPS=Object.assign(window.VK_MAPS||{},EG);
window.EG_ORDER=['egyT','egyF1','egyF2','egyF3','egyF4','egyF5','egyF6','egyD1a','egyD1b','egyH1','egyH2','egyD2a','egyD2b','egyD2c','egyE1','egyE2'];
/* monsters (frostling / snow-wolf models recoloured until the desert sprites exist) */
const T=(n,th,a,b,base,col,sc)=>({base,name:n,th,lv:[a,b],sc:sc||1,[base==='snowwolf'?'flt':'tint']:col});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  egyF1:[T('Little Scorpion','แมงป่องเล็ก',1,8,'frostling','#c88a40',.8),T('Scarab','ด้วงสคารับ',3,8,'frostling','#3a5aa0',.75)],
  egyF2:[T('Baby Hippo','ฮิปโปน้อย',4,12,'frostling','#9a8090',1),T('Ibis','นกไอบิส',6,12,'frostling','#e8e0d0',.8)],
  egyF3:[T('Desert Fox','หมาจิ้งจอกทะเลทราย',10,18,'snowwolf','sepia(1) saturate(1.6) brightness(1.05)',.8),T('Little Mummy','มัมมี่น้อย',12,18,'frostling','#d8ccaa',.85)],
  egyF4:[T('Ghost Slave','ทาสหินผี',14,22,'frostling','#a8a0a0',1.05),T('Granite Golem','โกเลมแกรนิต',16,22,'frostling','#7a6a6a',1.25)],
  egyF5:[T('Mummy','มัมมี่',18,26,'frostling','#d8ccaa',1),T('Jackal Soldier','ทหารหัวจิ้งจอก',20,26,'snowwolf','brightness(.45) sepia(.6)',1)],
  egyF6:[T('Little Sphinx','สฟิงซ์น้อย',22,30,'snowwolf','sepia(1) saturate(2) brightness(1.1)',1),T('Desert Vulture','แร้งทะเลทราย',24,30,'frostling','#6a4a30',.9)],
  egyD1a:[T('Noble Mummy','มัมมี่ขุนนาง',28,36,'frostling','#e0c890',1.05),T('Flesh Beetle','ด้วงกินเนื้อ',30,36,'frostling','#4a3a6a',.8)],
  egyD1b:[T('Living Trap','กับดักมีชีวิต',36,44,'frostling','#b09050',1.1),T('Tomb Jackal','จิ้งจอกสุสาน',38,44,'snowwolf','brightness(.4) sepia(.7)',.95)],
  egyH1:[T('Ram Statue','รูปปั้นแกะ',46,56,'frostling','#d8b070',1.25),T('Dark Cat Priest','นักบวชแมวมืด',48,56,'snowwolf','brightness(.35) hue-rotate(230deg)',.95)],
  egyH2:[T('Sand Worm','หนอนทราย',52,64,'frostling','#c89a60',1.2),T('Giant Scorpion','แมงป่องยักษ์',54,64,'frostling','#8a3a20',1.25)],
  egyD2a:[T('Anubis Guard','องครักษ์อนูบิส',58,66,'snowwolf','brightness(.35) contrast(1.4)',1.15),T('Royal Mummy','มัมมี่ราชวงศ์',60,66,'frostling','#f0d890',1.1)],
  egyD2b:[T('Giant Scarab','สคารับยักษ์',66,73,'frostling','#2a4aa0',1.3),T('Anubis Guard','องครักษ์อนูบิส',66,73,'snowwolf','brightness(.3) contrast(1.5)',1.2)],
  egyD2c:[T('Pharaoh Guard','องครักษ์ฟาโรห์',73,80,'frostling','#ffc840',1.35),T('Golden Jackal','จิ้งจอกทอง',74,80,'snowwolf','sepia(1) saturate(3) brightness(1.1)',1.25)],
  egyE1:[T('Set Beast','สัตว์เซท',76,86,'snowwolf','hue-rotate(250deg) brightness(.45)',1.3),T('Shadow Soldier','ทหารเงา',78,86,'frostling','#3a2a4a',1.2)],
  egyE2:[T('Giant Sand Worm','หนอนทรายยักษ์',84,94,'frostling','#b07a40',1.5),T('Djinn','จินน์',86,94,'frostling','#6ab0e8',1.2)]});
})();
