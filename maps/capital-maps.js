/* =====================================================================
   AETHERFALL — Capital region: the walled royal city, the six plains around it, the catacombs under it and the Aether Rift.
   Pieces live in maps/capital/ (catalog entries with d:'capital'). Read by createFieldHost (maps/fieldmap.js).
   Layout rule for the city: everything sits where it would really be — palace at the head of the royal road, cathedral with its
   graveyard (the catacomb stairs are there), guild + bank on the main avenue, smith/weapon/armour together on the craft street,
   inn by the east gate, market stalls on the royal road south of the fountain, barracks yard by the north gate, houses at the back.
   ===================================================================== */
(function(){
const OAK=['cpOak1','cpOak2','cpOak3','cpOak4','cpOak5','cpOak6','cpChestnut','cpChestnut2','cpBirch1','cpBirch2','cpPoplar1','cpPoplar2','cpPine'];
const ORCH=['cpApple','cpBlossom','cpRound1','cpBirchGold','cpAutumn'];
const PARK=['cpRound1','cpRound2','cpBlossom','cpBirch1','cpTopiary'];
const CLIFF=['cpCliff1','cpCliff2','cpCliff3','cpCliff4','cpCliff5','cpCliff6','cpOutcrop1','cpOutcrop2','cpOutcrop3'];
const ROCKO=['cpBoulder1','cpBoulder2','cpLow1','cpLow2','cpBoulders1','cpBoulders2','cpBoulders3'];
const BUSH=['cpBush','cpBerry','cpTallGrass','cpRose','cpStumpAxe'];
const FARM=['cpSheaf','cpHayBale','cpHaystack','cpPumpkin','cpSunflower','cpFence'];
const RUIN=['cpRuinWall','cpRuinArch','cpFallenPillar','cpKnightBroken','cpBarricade','cpCartBroken'];
const CT=['ctCoffin','ctCoffinOpen','ctSkulls','ctBones','ctCandle','ctBrazier','ctPillar','ctPillarBroken','ctGrave','ctCage','ctShields'];
const RF=['rfSpire','rfPink','rfShards','rfFloat','rfPillar','rfRuneStone','rfTree','rfArch','rfRibs'];
const C={theme:'capital',ground:'cpGrass',mood:'capital',trailKind:'trample',dirtTex:'cpDirt',lakeTex:'cpWater',seaTex:'cpWater',streamTex:'cpWater',cobbleTex:'cpPave'};
const M=(o)=>Object.assign({},C,o);
const CWALL={face:'cpWallCity',top:'cpPave',fh:160,block:1,tint:'rgba(110,100,80,.3)',dark:'60,96,44'};
const KW={face:'cpWallCata',top:'caveTop',fh:160,block:1,tint:'rgba(20,18,30,.5)',dark:'8,8,12'};
const RW={face:'cpWallRift',top:'caveTop',fh:150,tint:'rgba(90,40,150,.4)',dark:'14,6,30'};
const F=(o)=>M(Object.assign({W:4800,H:3600,border:{set:[...OAK,...CLIFF]},groves:{set:OAK,thr:.67,dens:.8},under:BUSH,open:[...BUSH,...ROCKO],edge:['cpBush','cpTallGrass','cpBerry']},o));
/* street furniture generated in rows so lamps and trees line the avenues evenly */
const row=(n,x0,x1,dx,y,o)=>{const a=[];for(let x=x0;x<=x1;x+=dx)a.push(Object.assign({n,x,y},o||{}));return a;};
const col=(n,x,y0,y1,dy,o)=>{const a=[];for(let y=y0;y<=y1;y+=dy)a.push(Object.assign({n,x,y},o||{}));return a;};
const GATE=(x,y)=>[{n:'cpGate',x,y},{n:'cpRuinWall',x:x-330,y:y-10},{n:'cpRuinWall',x:x+330,y:y-10,flip:1},{n:'cpGuardPost',x:x-190,y:y+90},{n:'cpBanner',x:x+190,y:y+80}];

/* ---------------------------------------------------------------------
   THE ROYAL CITY (capT) — the classic RO-capital plan: one square wall, a gate in the middle of each side,
   two broad avenues crossing at a ROUND FOUNTAIN PLAZA, the castle at the head of the north side, the church in the NE quarter.
   Everything is mirrored left/right about x 2400 and placed on a grid — no random scatter inside the walls.
     wall ring (outer)  x 480–4320, y 576–3744 · inside x 576–4224, y 672–3488
     plaza  ellipse (2400,2010) r 520×400 · E–W avenue y 1900–2120 · S avenue x 2240–2560 · forecourt x 1900–2900, y 1260–1660
     streets: N–S x 1294–1394 (north gate) and x 3406–3506 · E–W y 1180–1280 (north half) and y 2850–2950 (south half)
     tree-lined verges (narrow raised lawns) run along both avenues; each city block is a lawn or a row of buildings facing a street.
   --------------------------------------------------------------------- */
const LCG=s=>()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);
/* only used OUTSIDE the walls: n pieces scattered in a box, never closer than minD (deterministic) */
function scatter(set,x0,y0,x1,y1,n,seed,minD,avoid,vr){const r=LCG(seed),out=[];for(let t=0;t<n*60&&out.length<n;t++){const x=x0+r()*(x1-x0),y=y0+r()*(y1-y0);
    if(avoid&&avoid(x,y))continue;if(out.some(o=>Math.hypot(o.x-x,(o.y-y)*1.4)<minD))continue;out.push({n:set[(r()*set.length)|0],x:Math.round(x),y:Math.round(y),flip:r()<.5?1:0,v:+((vr?vr[0]:.82)+r()*((vr?vr[1]:1.1)-(vr?vr[0]:.82))).toFixed(2)});}return out;}
const HOUSE=(n,x,y,o)=>Object.assign({n,x,y,smolder:.86,smx:.2},o||{});
/* a verge planted at an even rhythm: tree, lamp, tree, lamp… centred in its run */
const rowAlt=(x0,x1,y,step,tn,tv)=>{const n=Math.floor((x1-x0)/step),o=x0+((x1-x0)-n*step)/2,out=[];for(let i=0;i<=n;i++){const x=Math.round(o+i*step);out.push(i%2?{n:'cpLamp',x,y:y-2}:{n:tn,x,y,v:tv,flip:(i/2)%2?1:0});}return out;};
const colAlt=(x,y0,y1,step,tn,tv)=>{const n=Math.floor((y1-y0)/step),o=y0+((y1-y0)-n*step)/2,out=[];for(let i=0;i<=n;i++){const y=Math.round(o+i*step);out.push(i%2?{n:'cpLamp',x,y}:{n:tn,x,y,v:tv,flip:(i/2)%2?1:0});}return out;};
/* mirror a list of pieces to the east half (x' = 4800 − x), flipping the sprite */
const MIR=a=>a.map(o=>Object.assign({},o,{x:4800-o.x,flip:o.flip?0:1,smx:o.smx!=null?-o.smx:undefined}));
const VERGE={rad:14,kerb:8,h:6,flowers:.22};
const CITY_LAWNS=[
  /* NW rift garden · NE graveyard (low kerb) */ {r:[660,740,1250,1150],rad:36,flowers:.1},{r:[3550,740,4140,1150],rad:24,kerb:9,h:6,flowers:.04},
  /* gardens behind the avenue shops */          {r:[660,1310,1250,1470],rad:26},{r:[1430,1310,1860,1470],rad:26},{r:[2940,1310,3370,1470],rad:26,flowers:.3},{r:[3550,1310,4140,1470],rad:26},
  /* south quarter parks */                      {r:[660,2210,1250,2470],rad:30},{r:[2650,2210,3370,2470],rad:30,flowers:.25},{r:[3550,2210,4140,2470],rad:30},
  /* verges along the E–W avenue (north + south side) */
  ...[[610,1262],[1426,1860],[2940,3374],[3538,4190]].flatMap(([a,b])=>[Object.assign({r:[a,1850,b,1892]},VERGE),Object.assign({r:[a,2128,b,2170]},VERGE)]),
  /* verges along the south avenue */
  ...[[2420,2840],[2960,3400]].flatMap(([a,b])=>[Object.assign({r:[2186,a,2226,b]},VERGE),Object.assign({r:[2574,a,2614,b]},VERGE)]),
  /* flower beds along the inside of the south wall */
  ...[[610,1262],[1426,2140],[2660,3374],[3538,4190]].map(([a,b])=>({r:[a,3418,b,3474],rad:16,kerb:8,h:6,flowers:.4}))];
const outside=(x,y)=>(Math.abs(x-1405)<200&&y<640)||(Math.abs(x-2400)<230&&y>3700)||(Math.abs(y-2010)<190&&(x<620||x>4180));
const EXT=[...OAK,...OAK,'cpBlossom','cpAutumn','cpBirchGold','cpApple','cpWillow'],EXTLOW=['cpBush','cpBerry','cpTallGrass','cpRose','cpBoulder1','cpLow1','cpBoulders1','cpSapling'];
/* west half of the city; the east half is its mirror plus the pieces that only exist once (church, graveyard, castle…) */
const WEST=[
  /* avenue shops (north side), gardens behind them */
  {n:'cpBank',x:805,y:1800},{n:'cpGuild',x:1130,y:1800},{n:'cpRound2',x:760,y:1450,v:.62},{n:'cpRound2',x:955,y:1450,v:.62,flip:1},{n:'cpRound2',x:1150,y:1450,v:.62},{n:'cpRound1',x:1560,y:1445,v:.6},
  /* south quarter park (3×2 trees on a grid) */
  ...[770,955,1140].flatMap((x,i)=>[{n:'cpRound1',x,y:2320,v:.64,flip:i%2},{n:'cpBlossom',x,y:2455,v:.6,flip:(i+1)%2}]),
  /* craft row on the south street */
  {n:'cpSmith',x:800,y:2810,smolder:.95,smx:.18},{n:'cpWeapon',x:1130,y:2810},
  /* back rows of homes */
  HOUSE('cpHouseA',790,3290),HOUSE('cpTall1',1080,3290),HOUSE('cpHouseB',1540,3290),HOUSE('cpTall2',1800,3290),HOUSE('cpHouseA',2050,3290,{flip:1,smx:-.2}),
  /* west gate: paired towers */
  {n:'cpTower',x:528,y:1868},{n:'cpTower',x:528,y:2340},
  /* tree + lamp rhythm on the verges */
  ...rowAlt(650,1222,2162,108,'cpRound1',.56),...rowAlt(1466,1820,2162,108,'cpRound1',.56),...colAlt(2206,2470,2820,105,'cpRound1',.56),...colAlt(2206,2990,3380,105,'cpRound1',.56),
  /* plaza furniture */
  {n:'cpCrystalLamp',x:2124,y:1798},{n:'cpCrystalLamp',x:2124,y:2222},{n:'cpPlanter',x:1950,y:1880},{n:'cpPlanter',x:1950,y:2140},{n:'cpPlanter',x:2210,y:2370},{n:'cpBench',x:2250,y:2300},
  /* forecourt */
  {n:'cpCrystalLamp',x:2240,y:1330},{n:'cpBanner',x:1940,y:1300},{n:'cpTopiary',x:1960,y:1600,v:.75},{n:'cpKnightS',x:2200,y:1560}];
const CP={
capT:M({name:'เอเธอร์ฟอลล์ Aetherfall',lv:'เมืองหลวง',seed:611,W:4800,H:4100,mons:false,city:1,ground:'cpGrass',dirtTex:'cpDirt',roadWear:.985,trailKind:'none',trails:[],propDens:0,open:[],edge:[],decalDens:.7,spawnN:0,
  start:[2400,2300],paveMerge:1,stepTex:'grMarble',
  doorRe:'^cp(House[AB]|Tall[12]|Inn|Tavern|Smith|Bakery|Bank|Guild|Potion|Tool|Clock|Armor|Weapon|Flower|Turret)$',
  texScale:{cpPave:.5,jpPave:.42,grMarble:.5,cpPlaza:.6,cpGrass:.7,cpDirt:.6},
  walls:{face:'cpWallCity',top:'cpPave',fh:160,block:1,noEdge:1,tint:'rgba(150,130,100,.18)',dark:'70,56,40',deep:.3,rim:'#6b5a42',parapet:'rgba(236,224,196,.9)'},border:{band:240},groves:{thr:9},
  rooms:[[576,672,4224,3648],[0,0,4800,576],[0,3744,4800,4100],[0,576,480,3744],[4320,576,4800,3744],
    [1309,0,1501,760],[2304,3480,2496,4100],[0,1872,700,2304],[4100,1872,4800,2304]],
  /* SOFT GROUND: the whole city floor is grass; every street, plaza and yard is an organic stone surface with a worn, sunken edge
     and grass creeping over it (no rectangles, no kerbs). Widths stay inside the wall gaps so no street opens a hole in the wall. */
  roadWear:.8,shadowCol:'#3a4a2a',fringe:.1,roadShade:'rgba(255,244,222,.07)',
  /* the city floor inside the walls is stone (grey cobble); the walls hide the edges of this block, streets of pale brick run over it */
  /* ROM-capital look: wide avenues and the plaza edged by a band of pale dressed stone, so the main ways read clearly
     against the cobbled side quarters; a half-round pad of marble opens in front of the south gate */
  paves:[{r:[576,672,4224,3488],tex:'jpPave',kerb:0,grime:.2},
    {r:[576,1905,4224,2115],tex:'cpPave',kc:'#d2bf96',kerb:14,grime:.14},{r:[2190,2300,2610,3488],tex:'cpPave',kc:'#d2bf96',kerb:14,grime:.14},
    {r:[1900,1270,2900,1660],tex:'grMarble',kc:'#d8c08a',kerb:12},{e:[2400,2010,550,415],tex:'cpPlaza',kc:'#d8c08a',kerb:16,rings:[.47,.85]},
    {e:[2400,3488,330,175],tex:'grMarble',kc:'#d2bf96',kerb:14}],
  squares:[{x:1645,y:945,rx:235,ry:215,tex:'cpDirt'},{x:1790,y:2445,rx:215,ry:125,tex:'grMarble'}],
  roads:[
    /* outside the gates (earth) */ {pts:[[1405,640],[1405,380],[1320,80]],w:130,tex:'cpDirt'},{pts:[[2400,3760],[2400,3950],[2420,4090]],w:140,tex:'cpDirt'},{pts:[[560,2010],[300,2006],[30,2020]],w:130,tex:'cpDirt'},{pts:[[4240,2010],[4500,2006],[4780,2020]],w:130,tex:'cpDirt'},
    /* through the gates */ {pts:[[1405,420],[1405,760]],w:150,tex:'cpPave'},{pts:[[2400,3400],[2400,3740]],w:170,tex:'cpPave'},{pts:[[470,2008],[700,2008]],w:180,tex:'cpPave'},{pts:[[4100,2008],[4330,2008]],w:180,tex:'cpPave'},
    /* (the two avenues are bordered paving now, see paves) */
    /* streets */ {pts:[[1405,740],[1346,2000],[1405,3420]],w:120,tex:'cpPave'},{pts:[[3456,760],[3454,2000],[3456,3420]],w:120,tex:'cpPave'},
    {pts:[[640,1230],[1300,1232],[1900,1230]],w:110,tex:'cpPave'},{pts:[[2900,1230],[3500,1232],[4160,1230]],w:110,tex:'cpPave'},{pts:[[640,2900],[2400,2903],[4160,2900]],w:120,tex:'cpPave'},
    /* back lane behind the homes (cobble) */ {pts:[[660,3385],[2400,3388],[4140,3385]],w:90,tex:'jpPave'}],
  land:[
    ...WEST,...MIR(WEST.filter(o=>!/^cp(Bank|Guild|Smith|Weapon|HouseA|HouseB|Tall1|Tall2|Round1|Round2|Blossom)$/.test(o.n)||/cpRound1/.test(o.n)&&(o.y===2162||o.x===2206))),
    /* east-side buildings: same footprint as their west twins */
    {n:'cpTool',x:3995,y:1800,v:.9},HOUSE('cpInn',3680,1800,{smx:-.22}),{n:'cpRound2',x:3650,y:1450,v:.62},{n:'cpRound2',x:3845,y:1450,v:.62,flip:1},{n:'cpRound2',x:4040,y:1450,v:.62},{n:'cpRound1',x:3240,y:1445,v:.6,flip:1},
    ...[3660,3845,4030].flatMap((x,i)=>[{n:'cpRound1',x,y:2320,v:.64,flip:(i+1)%2},{n:'cpBlossom',x,y:2455,v:.6,flip:i%2}]),
    HOUSE('cpHouseA',3670,2810,{flip:1,smx:-.2}),HOUSE('cpTall2',4000,2810,{flip:1,smx:-.2}),
    HOUSE('cpHouseA',4010,3290,{flip:1,smx:-.2}),HOUSE('cpTall1',3720,3290,{flip:1,smx:-.2}),HOUSE('cpHouseB',3260,3290,{flip:1,smx:-.2}),HOUSE('cpTall2',3000,3290,{flip:1,smx:-.2}),HOUSE('cpHouseA',2750,3290),
    /* NORTH: castle at the head of the plaza */
    {n:'cpCastle',x:2400,y:1250,walk:[[0,-110,95,135]]},{n:'cpFountain',x:2400,y:2080},
    /* NW: sealed rift garden · N: barracks yard by the north gate */
    {n:'cpRiftPortal',x:955,y:1110,v:.9},{n:'cpCrystalLamp',x:720,y:1120},{n:'cpCrystalLamp',x:1190,y:1120},{n:'cpHedge',x:720,y:820},{n:'cpHedge',x:1190,y:820},
    {n:'cpGate',x:1405,y:672},{n:'cpGuardPost',x:1225,y:770},{n:'cpGuardPost',x:1463,y:770},{n:'cpDummy',x:1530,y:880},{n:'cpDummy',x:1645,y:880},{n:'cpDummy',x:1760,y:880},{n:'cpRack',x:1510,y:1090},{n:'cpBallista',x:1645,y:1080},{n:'cpRack',x:1780,y:1090},
    {n:'cpPotion',x:1520,y:1800,v:.85},{n:'cpClock',x:1785,y:1800},
    /* NE: the church opposite the barracks, the graveyard opposite the rift garden */
    {n:'cpCathedral',x:3155,y:1150,v:.8,walk:[[0,-56,56,76]]},{n:'cpCataEntrance',x:3845,y:1120,v:.85},
    ...[830,960,1090].flatMap((y,i)=>[{n:'ctGrave',x:3615,y,flip:i%2},{n:'ctGrave',x:4075,y,flip:(i+1)%2}]),
    {n:'cpFlower',x:3280,y:1800,v:.85},HOUSE('cpTall2',3015,1800,{flip:1,smx:-.2}),
    /* S: teleport crystal on its pad, armour + bakery · SE: the central market, tavern + flower shop */
    {n:'cpTeleport',x:1790,y:2500},{n:'cpArmor',x:1560,y:2810},HOUSE('cpBakery',1960,2810,{smx:-.25}),
    /* the central market (ตลาดกลาง): the big trade tent opposite the teleport crystal, its merchant on the red carpet (npcs.js) */
    {n:'cpMarket',x:3010,y:2500},
    HOUSE('cpTavern',2840,2810),{n:'cpFlower',x:3240,y:2810,v:.9},
    /* gates */
    {n:'cpGate',x:2400,y:3744},
    /* the green belt outside the walls */
    ...scatter(EXT,90,70,4720,330,34,21,150,outside),...scatter(EXT,60,420,350,3980,22,22,150,outside),...scatter(EXT,4475,420,4740,3980,22,23,150,outside),...scatter(EXT,90,3840,4720,4060,26,24,150,outside),
    ...scatter(EXTLOW,90,60,4720,340,22,25,110,outside,[.75,1]),...scatter(EXTLOW,60,420,360,3980,14,26,110,outside,[.75,1]),...scatter(EXTLOW,4440,420,4740,3980,14,27,110,outside,[.75,1]),...scatter(EXTLOW,90,3830,4720,4070,16,28,110,outside,[.75,1]),
    {n:'cpMilestone',x:1470,y:300},{n:'cpSignWood',x:2540,y:3930},{n:'cpSignWood',x:330,y:2130},{n:'cpSignWood',x:4470,y:2130}],
  warps:[{id:'toS',x:2400,y:3990,to:'cS',at:'toCap',label:'ทุ่งใต้เมืองหลวง'},{id:'toN',x:1405,y:170,to:'cN',at:'toCap',label:'ทุ่งเหนือเมืองหลวง'},{id:'toW',x:130,y:2010,to:'cW',at:'toCap',label:'ทุ่งตะวันตก'},{id:'toE',x:4670,y:2010,to:'cE',at:'toCap',label:'ทุ่งตะวันออก'},
    {id:'cata',x:3845,y:1225,to:'cata1',at:'up',label:'สุสานใต้เมืองหลวง'},{id:'rift',x:955,y:1225,to:'rift1',at:'up',label:'รอยแยกเอเธอร์'}]}),
cN:F({name:'ทุ่งเหนือเมืองหลวง Aetherfall Plains N',lv:'18–26',seed:621,farm:1,trails:[],
  roads:[{pts:[[2400,3250],[2400,2600],[2300,1900],[2400,1200],[2400,430]],w:120,tex:'cpDirt'},{pts:[[2300,1900],[1500,1850],[420,1800]],w:96,tex:'cpDirt'},{pts:[[2350,1500],[3300,1450],[4380,1500]],w:96,tex:'cpDirt'}],
  squares:[{x:1500,y:2500,rx:420,ry:230,tex:'cpWheat'},{x:3300,y:2300,rx:460,ry:240,tex:'cpWheat'}],
  land:[...GATE(2400,3180),{n:'cpHouseA',x:1750,y:2150},{n:'cpWellOld',x:1560,y:2180},{n:'cpHaystack',x:1960,y:2200},{n:'cpScarecrow',x:1500,y:2520},{n:'cpScarecrow',x:3300,y:2330},{n:'cpHayBale',x:2950,y:2020},{n:'cpHayBale',x:3080,y:2040},{n:'cpFence',x:1100,y:2260},{n:'cpFence',x:1900,y:2760},{n:'cpMilestone',x:2500,y:1250},{n:'cpSignWood',x:2440,y:1880},{n:'cpWayShrine',x:2200,y:900}],
  clusters:[{x:3400,y:900,r:300,set:ORCH,n:7,sp:110}],clearings:[[1700,2300,420],[2400,1000,300],[2400,3080,330]],
  warps:[{id:'toCap',x:2400,y:3290,to:'capT',at:'toN',label:'เอเธอร์ฟอลล์'},{id:'toVik',x:2400,y:400,to:'vikF6',at:'toCap',label:'ธารน้ำแข็งละลาย'},{id:'toW',x:400,y:1800,to:'cW',at:'toN',label:'ทุ่งตะวันตก'},{id:'toNE',x:4400,y:1500,to:'cNE',at:'toN',label:'เนินกังหันลมเก่า'}]}),

cW:F({name:'ทุ่งตะวันตก Aetherfall Plains W',lv:'18–26',seed:622,trails:[],
  roads:[{pts:[[4350,1800],[3500,1850],[2500,1800],[1500,1900],[420,1800]],w:120,tex:'cpDirt'},{pts:[[2500,1800],[2450,1000],[2400,430]],w:96,tex:'cpDirt'},{pts:[[2500,1800],[2450,2600],[2400,3270]],w:96,tex:'cpDirt'}],
  lakes:[{x:1400,y:2700,rx:320,ry:180},{x:3400,y:1000,rx:260,ry:150}],lakeSet:['cpLily'],
  land:[{n:'cpTower',x:4180,y:1640},{n:'cpGuardPost',x:4150,y:1960},{n:'cpTent',x:2800,y:2050},{n:'cpCampfire',x:2650,y:2120},{n:'cpCratesRoad',x:2950,y:2100},{n:'cpMilestone',x:2580,y:1720},{n:'cpSwordStone',x:1300,y:1200},{n:'cpSignWood',x:2380,y:1900}],
  clearings:[[2700,2050,360],[1300,1300,300]],
  warps:[{id:'toCap',x:4400,y:1800,to:'capT',at:'toW',label:'เอเธอร์ฟอลล์'},{id:'toGrk',x:400,y:1800,to:'grkF6',at:'toCap',label:'ถนนวีรบุรุษ'},{id:'toN',x:2400,y:400,to:'cN',at:'toW',label:'ทุ่งเหนือเมืองหลวง'},{id:'toSW',x:2400,y:3300,to:'cSW',at:'toW',label:'ท่อส่งน้ำโบราณ'}]}),

cS:F({name:'ทุ่งใต้เมืองหลวง Aetherfall Plains S',lv:'22–30',seed:623,farm:1,trails:[],
  bridge:[2420,2300],bridgeImg:'azCauseway',bridgeDy:125,stream:[[600,2700],[1400,2450],'B',[3300,2250],[4300,2500]],
  roads:[{pts:[[2400,520],[2400,1200],[2420,1900]],w:120,tex:'cpDirt'},{pts:[[2420,2500],[2400,3270]],w:120,tex:'cpDirt'},{pts:[[2400,1500],[3400,1600],[4380,1800]],w:96,tex:'cpDirt'},{pts:[[2400,1500],[1400,1650],[420,1800]],w:96,tex:'cpDirt'}],
  squares:[{x:1300,y:1000,rx:440,ry:230,tex:'cpWheat'},{x:3500,y:1050,rx:420,ry:220,tex:'cpWheat'}],
  land:[...GATE(2400,640),{n:'cpHouseB',x:1300,y:1420},{n:'cpHaystack',x:1560,y:1440},{n:'cpPumpkin',x:1050,y:1450},{n:'cpScarecrow',x:1300,y:1020},{n:'cpScarecrow',x:3500,y:1080},{n:'cpHayBale',x:3250,y:1400},{n:'cpSunflower',x:1500,y:1300},{n:'cpMilestone',x:2500,y:1250},{n:'cpSignWood',x:2330,y:1560},{n:'cpCartBroken',x:2700,y:2800}],
  clearings:[[2400,2800,340],[2400,720,330]],
  warps:[{id:'toCap',x:2400,y:400,to:'capT',at:'toS',label:'เอเธอร์ฟอลล์'},{id:'toAzt',x:2400,y:3300,to:'aztF6',at:'toCap',label:'ชายป่าเมฆ'},{id:'toE',x:4400,y:1800,to:'cE',at:'toS',label:'ทุ่งตะวันออก'},{id:'toSW',x:400,y:1800,to:'cSW',at:'toS',label:'ท่อส่งน้ำโบราณ'}]}),

cE:F({name:'ทุ่งตะวันออก Aetherfall Plains E',lv:'22–30',seed:624,trails:[],
  roads:[{pts:[[450,1800],[1300,1850],[2300,1800],[3300,2000],[4380,2200]],w:120,tex:'cpDirt'},{pts:[[2300,1800],[2350,1000],[2400,430]],w:96,tex:'cpDirt'},{pts:[[1300,1850],[1250,2600],[1200,3270]],w:96,tex:'cpDirt'}],
  lakes:[{x:3300,y:2900,rx:340,ry:180}],lakeSet:['cpLily'],clusters:[{x:3400,y:1100,r:320,set:ORCH,n:8,sp:110}],
  land:[{n:'cpTower',x:640,y:1640},{n:'cpGuardPost',x:660,y:1960},{n:'cpWayShrine',x:2450,y:1650},{n:'cpKnight',x:2100,y:1700},{n:'cpWellOld',x:3000,y:1750},{n:'cpScarecrow',x:1900,y:2500},{n:'cpStumpAxe',x:3700,y:1500},{n:'cpSignWood',x:1380,y:1950}],
  clearings:[[2300,1700,340]],
  warps:[{id:'toCap',x:400,y:1800,to:'capT',at:'toE',label:'เอเธอร์ฟอลล์'},{id:'toEgy',x:4400,y:2200,to:'egyF6',at:'toCap',label:'ถนนหินสุริยะ'},{id:'toS',x:1200,y:3300,to:'cS',at:'toE',label:'ทุ่งใต้เมืองหลวง'},{id:'toNE',x:2400,y:400,to:'cNE',at:'toE',label:'เนินกังหันลมเก่า'}]}),

cNE:F({name:'เนินกังหันลมเก่า Old Windmill Hill',lv:'26–34',seed:625,farm:1,ruinBits:1,trails:[],groves:{set:[...OAK,'cpDead','cpAutumn'],thr:.63,dens:.75},
  roads:[{pts:[[420,1800],[1300,1750],[2300,1700]],w:100,tex:'cpDirt'},{pts:[[2300,1700],[2400,2500],[2400,3270]],w:100,tex:'cpDirt'},{pts:[[2300,1700],[3300,1550],[4380,1500]],w:100,tex:'cpDirt'}],
  bridge:[3300,1560],bridgeImg:'azCauseway',bridgeDy:125,stream:[[3000,500],[3200,1100],'B',[3450,2100],[3700,3200]],
  squares:[{x:1500,y:2500,rx:400,ry:210,tex:'cpWheat'}],
  land:[{n:'cpMill',x:3050,y:1300},{n:'cpHaystack',x:2100,y:1500},{n:'cpScarecrow',x:1500,y:2520},{n:'cpCartBroken',x:2600,y:1850},{n:'cpBarricade',x:1900,y:1850},{n:'cpDead',x:2750,y:1150},{n:'cpFence',x:1100,y:2280},{n:'cpSignWood',x:2240,y:1800}],
  clearings:[[2700,1500,420]],
  warps:[{id:'toN',x:400,y:1800,to:'cN',at:'toNE',label:'ทุ่งเหนือเมืองหลวง'},{id:'toE',x:2400,y:3300,to:'cE',at:'toNE',label:'ทุ่งตะวันออก'},{id:'toJpn',x:4400,y:1500,to:'jpnF6',at:'toCap',label:'ท่าเรือฮาคุเซ็น'}]}),

cSW:F({name:'ท่อส่งน้ำโบราณ Ruined Aqueduct',lv:'26–34',seed:626,ruinBits:1,trails:[],open:[...BUSH,...ROCKO,...RUIN],
  roads:[{pts:[[2400,430],[2400,1200],[2500,1800]],w:100,tex:'cpDirt'},{pts:[[2500,1800],[3400,1850],[4380,1800]],w:100,tex:'cpDirt'}],
  lakes:[{x:1900,y:2500,rx:420,ry:200}],lakeSet:['cpLily'],
  /* the aqueduct marches across the valley; one span has collapsed into the pool */
  land:[{n:'cpAqueduct',x:900,y:2250},{n:'cpAqueduct',x:1500,y:2330,flip:1},{n:'cpAqPillar',x:2500,y:2350},{n:'cpAqueduct',x:3100,y:2300},{n:'cpAqPillar',x:3650,y:2330,flip:1},{n:'cpFallenPillar',x:2250,y:2750},{n:'cpRuinArch',x:2800,y:1500},{n:'cpKnightBroken',x:2100,y:1500},{n:'cpCampfire',x:3000,y:2000},{n:'cpTent',x:3180,y:1960}],
  clearings:[[2500,1700,380],[2700,2700,340]],
  warps:[{id:'toW',x:2400,y:400,to:'cW',at:'toSW',label:'ทุ่งตะวันตก'},{id:'toS',x:4400,y:1800,to:'cS',at:'toSW',label:'ทุ่งใต้เมืองหลวง'}]}),

cata1:M({name:'สุสานใต้เมืองหลวง ชั้น 1',lv:'30–37',seed:631,W:3600,H:2700,mood:'mine',theme:'temple',ground:'cpCataFloor',trailKind:'none',
  walls:KW,border:{band:240},groves:{thr:.62},propDens:.35,open:CT,edge:[],decals:['ctGrate'],decalDens:.08,
  land:[{n:'ctKnightTomb',x:1800,y:1300},{n:'ctCandle',x:1620,y:1320},{n:'ctCandle',x:1980,y:1320},{n:'ctAngel',x:1800,y:1130}],clearings:[[1800,1400,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2060,to:'capT',at:'cata',label:'ทางออก'},{id:'down',x:700,y:640,to:'cata2',at:'up',label:'ชั้น 2'}]}),
cata2:M({name:'สุสานใต้เมืองหลวง ชั้น 2',lv:'37–44',seed:632,W:3600,H:2700,mood:'mine',theme:'temple',ground:'cpCataFloor',trailKind:'none',
  walls:KW,border:{band:240},groves:{thr:.62},propDens:.35,open:CT,edge:[],decals:['ctGrate','ctRune'],decalDens:.08,
  land:[{n:'ctKnightTomb',x:2600,y:820},{n:'ctBrazier',x:2400,y:860},{n:'ctBrazier',x:2800,y:860},{n:'ctChest',x:2600,y:980},{n:'ctRune',x:2600,y:1100}],clearings:[[2600,900,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:760,y:2260,to:'cata1',at:'down',label:'ชั้น 1'}]}),

rift1:M({name:'รอยแยกเอเธอร์ ชั้น 1',lv:'90–93',seed:641,W:3600,H:2700,mood:'rift',ground:'cpRift',dirtTex:'cpRift',dark:1,trailKind:'none',
  walls:RW,border:{band:230},groves:{thr:.56},open:RF,propDens:.45,edge:[],decals:['rfCrack'],decalDens:.08,
  land:[{n:'rfAltar',x:1800,y:1300},{n:'rfOrb',x:1560,y:1380},{n:'rfOrb',x:2040,y:1380}],clearings:[[1800,1450,380]],spawnN:22,spawnGap:290,
  warps:[{id:'up',x:1800,y:2450,to:'capT',at:'rift',label:'ทางออก'},{id:'down',x:700,y:640,to:'rift2',at:'up',label:'ชั้น 2'}]}),
rift2:M({name:'รอยแยกเอเธอร์ ชั้น 2',lv:'94–97',seed:642,W:3600,H:2700,mood:'rift',ground:'cpRift',dirtTex:'cpRift',dark:1,trailKind:'none',
  walls:RW,border:{band:230},groves:{thr:.56},open:[...RF,'rfTear'],propDens:.45,edge:[],decals:['rfCrack','rfCircle'],decalDens:.08,
  land:[{n:'rfSkull',x:1800,y:1300},{n:'rfRibs',x:2100,y:1380},{n:'rfTear',x:1500,y:1250}],clearings:[[1800,1400,360]],spawnN:22,spawnGap:290,
  warps:[{id:'up',x:760,y:2360,to:'rift1',at:'down',label:'ชั้น 1'},{id:'down',x:2900,y:640,to:'rift3',at:'up',label:'ชั้น 3'}]}),
rift3:M({name:'รอยแยกเอเธอร์ ชั้น 3 · รังเอเธอร์เวิร์ม',lv:'98–99',seed:643,W:3600,H:2700,mood:'rift',ground:'cpRift',dirtTex:'cpRift',dark:1,trailKind:'none',
  walls:RW,border:{band:230},groves:{thr:.6},open:RF,propDens:.3,edge:[],decals:['rfCrack'],decalDens:.06,
  /* the boss arena: a ring of spires around the nest */
  land:[{n:'rfEgg',x:1800,y:1150},{n:'rfSkull',x:1500,y:1050},{n:'rfRibs',x:2120,y:1080},{n:'rfCircle',x:1800,y:1450},{n:'rfSpire',x:1300,y:1300},{n:'rfSpire',x:2300,y:1300,flip:1},{n:'rfPink',x:1400,y:1700},{n:'rfPink',x:2200,y:1700,flip:1},{n:'cpCrystalBig',x:1800,y:900}],
  clearings:[[1800,1400,560]],spawnN:14,spawnGap:320,
  warps:[{id:'up',x:1800,y:2420,to:'rift2',at:'down',label:'ชั้น 2'}]})
};
/* a stone city: no trees, grass, hedges or flowers inside the walls (the green belt outside stays). The flower shops become houses,
   and the emptied garden blocks get stone furniture instead — wells, benches, statues, notice boards — mirrored like the rest */
{const c=CP.capT,inside=o=>o.x>576&&o.x<4224&&o.y>672&&o.y<3488,GREEN=/^(cpRound\d|cpBlossom|cpOak\d|cpBirch\d|cpChestnut\d?|cpPoplar\d|cpTopiary|cpRose|cpBush|cpBerry|cpHedge|cpTallGrass|cpSapling|cpPlanter|cpTreePlanter|cpDead)$/;
  c.land=c.land.filter(o=>!(inside(o)&&GREEN.test(o.n))).map(o=>o.n==='cpFlower'&&inside(o)?Object.assign({},o,{n:'cpHouseB',smolder:.86,smx:.2,v:.9}):o);
  /* the old verge lamps stood where the wider avenue now runs */
  c.land=c.land.filter(o=>!(o.n==='cpLamp'&&(o.x===2206||o.x===2594)));
  const W=[{n:'cpNotice',x:760,y:1445},{n:'cpKnight',x:955,y:1450},{n:'cpMailbox',x:1150,y:1440},
    {n:'cpSwordStone',x:1645,y:1440},{n:'cpCrystalLamp',x:1950,y:1870},{n:'cpCrystalLamp',x:1950,y:2150},{n:'cpKnightS',x:2225,y:2380},{n:'cpBanner',x:2270,y:1640},
    /* packed housing: a back row behind the craft street, its roofs layered behind the front row like an old town */
    HOUSE('cpHouseB',790,2545),HOUSE('cpTall1',1075,2545),
    /* along the avenue edge: lamps and pines in stone planters standing in the avenue, market stalls by the plaza */
    ...[2480,2770,3060,3340].map(y=>({n:'cpLamp',x:2216,y})),{n:'cpTreePlanter',x:2222,y:2625,nowc:1},{n:'cpTreePlanter',x:2222,y:3200,nowc:1},
    {n:'cpStallFruit',x:2115,y:2470},{n:'cpCrates',x:2120,y:2330},{n:'cpGuardPost',x:2150,y:3400,nowc:1}];
  const E=W.map(o=>Object.assign({},o,{x:4800-o.x,flip:o.flip?0:1,smx:o.smx!=null?-o.smx:undefined,n:o.n==='cpStallFruit'?'cpStallWeapon':o.n==='cpCrates'?'cpCart':o.n}));
  c.land.push(...W,...E);}
/* ---- PRONTERA-STYLE REDESIGN (2026-11): castle on its terrace with the grand stair, knight fountain, red-roof houses,
   the Adventurers' Guild (west of the plaza, enterable: guild master → world boss) and the Weapon & Armour shop (craft row, enterable: 2 merchants).
   The old pieces are swapped in place so the street grid, walls and paths stay as they were. ---- */
{const c=CP.capT,inside=o=>o.x>576&&o.x<4224&&o.y>672&&o.y<3488;
  const HOUSES=['cpRH1','cpRH2','cpRH3','cpRH4','cpRH5','cpRH6'];let hi=0;
  c.land=c.land.filter(o=>!(o.n==='cpLamp'&&(Math.abs(o.x-2216)<8||Math.abs(o.x-2584)<8)&&o.y>2400));
  c.land=c.land.filter(o=>!(['cpPotion','cpClock','cpArmor','cpBakery','cpWeapon','cpGuild'].includes(o.n)&&inside(o)&&o.x<2400));   // the guild + shop take these lots
  c.land=c.land.map(o=>{
    if(o.n==='cpCastle')return Object.assign({},o,{n:'cpCastle2',y:o.y+10});
    if(o.n==='cpFountain')return Object.assign({},o,{n:'cpFountain2'});
    if(/^cp(HouseA|HouseB|Tall1|Tall2)$/.test(o.n)&&inside(o)){const n=HOUSES[(hi++*5+Math.floor(o.x/97))%HOUSES.length];return Object.assign({},o,{n,v:1});}
    if(o.n==='cpLamp'&&inside(o))return Object.assign({},o,{n:'cpLamp2'});   // (avenue-kerb lamps are dropped below: banners + lamps line the royal road now)
    if(o.n==='cpBanner'&&inside(o))return Object.assign({},o,{n:'cpBannerR'});
    if(o.n==='cpStallFruit')return Object.assign({},o,{n:'cpStallR'});
    if(o.n==='cpCrates'&&inside(o))return Object.assign({},o,{n:'cpCrates2'});
    if(o.n==='cpTower')return Object.assign({},o,{n:'cpTowerR'});
    return o;});
  /* the old guild lot on the west avenue gets a big house; the guild hall itself stands right at the plaza */
  c.land.push({n:'cpRH2',x:1130,y:1800},
    {n:'cpGuildHall',x:1660,y:1800},{n:'cpArmory',x:1720,y:2810},{n:'cpRH4',x:1130,y:2810},
    /* the royal road south: banner, lamp, banner… on both kerbs */
    ...[2620,2780,2940,3100,3260].flatMap((y,i)=>[{n:i%2?'cpLamp2':'cpBannerR',x:2170,y},{n:i%2?'cpLamp2':'cpBannerR',x:2630,y,flip:1}]),
    /* the plaza: pines in stone rings, benches and flower beds round the fountain */
    {n:'cpPineR',x:2000,y:1760},{n:'cpPineR',x:2800,y:1760,flip:1},{n:'cpPineR',x:1960,y:2300},{n:'cpPineR',x:2840,y:2300,flip:1},
    {n:'cpFlowerBed',x:2050,y:1680},{n:'cpFlowerBed',x:2750,y:1680,flip:1},{n:'cpBench2',x:2160,y:1720},{n:'cpBench2',x:2640,y:1720,flip:1},
    /* market side: stalls and carts beside the trade tent */
    {n:'cpStallR',x:3330,y:2420},{n:'cpStallR',x:3330,y:2600,flip:1},{n:'cpCartR',x:2730,y:2600},{n:'cpCrates2',x:2740,y:2440},
    /* by the guild and the shop */
    {n:'cpSignpost',x:1930,y:2010},{n:'cpCrates2',x:1990,y:2870},{n:'cpCartR',x:1440,y:2900},
    /* quiet wells in the housing quarters */
    {n:'cpWell2',x:1340,y:3180},{n:'cpWell2',x:3460,y:3180,flip:1},
    /* windmills and corner towers like the old capital (outside / on the wall) */
    {n:'cpMillR',x:300,y:880},{n:'cpMillR',x:4500,y:3330,flip:1},{n:'cpMillR',x:4540,y:880,flip:1},
    {n:'cpTowerR',x:520,y:660},{n:'cpTowerR',x:4280,y:660,flip:1},{n:'cpTowerR',x:520,y:3720},{n:'cpTowerR',x:4280,y:3720,flip:1});
  c.doorRe=c.doorRe.replace('Turret)$','Turret|RH[1-6])$');
  /* a calm plaza: only the fountain, four lamps and two pines (no crystal lamps, statues, stalls, beds round it) */
  const CLUT=/^cp(CrystalLamp|KnightS|BannerR|Banner|FlowerBed|Signpost|Bench2|PineR|StallR|StallWeapon|Crates2|Cart|CartR|Lamp2|Lamp|Planter|Bench|TreePlanter)$/;
  c.land=c.land.filter(o=>!(CLUT.test(o.n)&&o.x>1840&&o.x<2960&&o.y>1250&&o.y<2580));
  c.land.push({n:'cpLamp2',x:2090,y:1820},{n:'cpLamp2',x:2710,y:1820,flip:1},{n:'cpLamp2',x:2090,y:2250},{n:'cpLamp2',x:2710,y:2250,flip:1},
    {n:'cpPineR',x:1990,y:1690},{n:'cpPineR',x:2810,y:1690,flip:1});
  /* ONE smooth stone floor for the whole city: no bands, rectangles or kerbs pasted on top — only a soft, feathered pale-marble
     circle round the fountain blends into it; side streets are the same stone so they no longer show as strips */
  c.paves=[{r:[576,672,4224,3488],tex:'jpPave',kerb:0,grime:.16}];
  c.roads=c.roads.filter(r=>r.tex==='cpDirt'||r.pts.some(([x,y])=>x<560||x>4240||y<660||y>3500));
  c.roads=c.roads.filter(r=>!(r.tex==='cpPave'&&r.pts.every(([x,y])=>x>=560&&x<=4240&&y>=660&&y<=3500)));
  c.squares=[{x:1645,y:945,rx:235,ry:215,tex:'cpDirt'}];
  c.noPath=1;}

/* ---- PAINTED PRONTERA FLOOR (2026-11): the city floor is one hand-painted picture (maps/capital/cpCityFloor.webp, raised blocks baked in);
   every building stands on a block of its 8×8 street grid, special halls round the central plaza, houses packed in the rest ---- */
{const c=CP.capT,S=1254,mx=u=>Math.round(576+u*3648/S),my=v=>Math.round(672+v*2816/S),inside=o=>o.x>576&&o.x<4224&&o.y>672&&o.y<3488;
  const CX=[[22,146],[159,279],[291,426],[438,549],[703,815],[827,962],[975,1095],[1109,1232]],RY=[[22,132],[144,248],[259,366],[376,549],[696,876],[886,995],[1007,1109],[1121,1232]];
  const GREEN=new Set(['2,1','5,1','2,6','5,6','0,2','7,2','2,2','5,2','0,3','7,3','0,5','7,5','2,5','5,5','0,6','7,6']);   // blocks with a lawn / flower bed: left open
  /* the big halls each take TWO blocks (the side street between them is built over) */
  /* the big halls each take TWO blocks; the CENTRAL MARKET sits on the south royal road like Prontera's vendor street:
     the tent on 2×2 blocks west of the avenue, a stall square in front of it, stalls lining both kerbs down to the south gate */
  const SPECIAL={'3,3':{n:'cpGuildHall',v:1.15,dx:-1},'4,3':{n:'cpBank',v:1.05,dx:1},'4,4':{n:'cpArmory',v:1.1,dx:1},'6,3':{n:'cpInn',v:1.0,dx:1},
    '3,5':{n:'cpMarket',v:.95,dx:-1},'6,1':{n:'cpCathedral',v:.9,dx:1},'0,0':{n:'cpRiftPortal',v:.75},'7,0':{n:'cpCataEntrance',v:.8}};
  const TAKEN=new Set(['2,3','5,3','5,4','7,3','7,1','2,4','3,4','2,5','2,6','3,6']);
  const HOUSES=['cpRH1','cpRH2','cpRH3','cpRH4','cpRH5','cpRH6'],R=LCG(911),KEEP=/^cp(Gate|TowerR|MillR)$/;
  c.land=c.land.filter(o=>!inside(o)||KEEP.test(o.n));
  const L=[];
  for(let j=0;j<8;j++)for(let i=0;i<8;i++){if((i===3||i===4)&&j===0)continue;   // the castle forecourt
    const x0=mx(CX[i][0]),x1=mx(CX[i][1]),y0=my(RY[j][0]),y1=my(RY[j][1]),cx=(x0+x1)/2,k=i+','+j,sp=SPECIAL[k];
    if(TAKEN.has(k)){R();continue;}
    if(GREEN.has(k)){R();continue;}
    if(TAKEN.has(k))continue;
    if(sp){const i2=i+(sp.dx||0),bx=sp.dx?(mx(CX[Math.min(i,i2)][0])+mx(CX[Math.max(i,i2)][1]))/2:cx;L.push({n:sp.n,v:sp.v,x:Math.round(bx),y:Math.round(y1-22)});continue;}
    const n=HOUSES[(R()*HOUSES.length)|0];L.push({n,x:Math.round(cx+(R()-.5)*24),y:Math.round(y1-18),flip:R()<.5?1:0,smolder:.86,smx:.2});
    if(R()<.35)L.push({n:R()<.5?'cpCrates2':'cpCartR',x:Math.round(x1-38),y:Math.round(y1-8),flip:R()<.5?1:0});}
  /* castle on the forecourt at the head of the north avenue, the knight fountain in the plaza */
  L.push({n:'cpCastle2',x:2400,y:1230,walk:[[0,-120,95,140]]},{n:'cpFountain2',x:2400,y:2110});
  /* plaza: four lamps, two pines · avenues: banners and lamps along both kerbs */
  L.push({n:'cpLamp2',x:1960,y:2090},{n:'cpPineR',x:2120,y:1700},{n:'cpPineR',x:2680,y:1700,flip:1});
  {const m=L.find(o=>o.n==='cpMarket');if(m){
    const sx0=mx(CX[2][0]),sx1=mx(CX[3][1]),sy0=my(RY[6][0]),sy1=my(RY[6][1]);   // stall square in front of the tent
    for(const k of [0,2])L.push({n:k%2?'cpStallWeapon':'cpStallR',x:Math.round(sx0+130+k*(sx1-sx0-260)/2),y:Math.round(sy0+150),flip:k%2});
    L.push({n:'cpCartR',x:sx0+70,y:sy1-10},{n:'cpCrates2',x:sx1-50,y:sy1-10,flip:1},{n:'cpBannerR',x:m.x-430,y:m.y+20},{n:'cpBannerR',x:m.x+430,y:m.y+20,flip:1});
    /* vendor street: stalls on both kerbs of the south avenue, a banner between every pair */
    for(let y=2700,i=0;y<3420;y+=180,i++)L.push({n:i%2?'cpStallWeapon':'cpStallR',x:2560+(i%2?6:0),y,flip:1},...(i%2?[]:[{n:'cpBannerR',x:2240,y:y+40}]),{n:i%2?'cpStallR':'cpStallWeapon',x:2240-(i%2?6:0),y:y+90});}}

  /* pines on the four lawns */
  for(const [u,v] of [[333,250],[921,250],[921,999]])L.push({n:'cpPineR',x:mx(u),y:my(v)+40});
  c.land.push(...L);
  /* warps into the rift garden and the catacombs follow their buildings */
  const W=c.warps;const wr=W.find(w=>w.id==='rift'),wc=W.find(w=>w.id==='cata');if(wr){wr.x=mx(84);wr.y=my(138);}if(wc){wc.x=mx(1170);wc.y=my(138);}
  c.groundImg={n:'cpCityFloor',r:[576,672,4224,3488]};
  c.paves=[{r:[576,672,4224,3488],tex:'jpPave',kerb:0,grime:0}];c.squares=[];
  c.roads=c.roads.filter(r=>r.pts.some(([x,y])=>x<560||x>4240||y<660||y>3500)&&!r.pts.every(([x,y])=>x>=560&&x<=4240&&y>=660&&y<=3500));
  c.start=[2400,2620];c.noPath=1;c.charK=1.35;}
/* every door gets a short worn path down to the street (or the back lane) it faces */
if(!CP.capT.noPath){const re=new RegExp(CP.capT.doorRe),C=window.VK_CAT||{};for(const o of CP.capT.land){if(!re.test(o.n))continue;const c=C[o.n];const by=o.y+(c?c.h*(o.v||1)*(1-c.ay):18);
  const to=by<1900?1885:by<2850?2850:by>3200&&by<3380?3350:null;if(to==null||to-by<22)continue;
  /* a back-row house whose way down is blocked by the row in front gets no path (it uses the side alley) */
  if(CP.capT.land.some(b=>b!==o&&re.test(b.n)&&Math.abs(b.x-o.x)<(C[b.n]?C[b.n].w*(b.v||1)*.45:120)&&b.y>by+10&&b.y<to+20))continue;CP.capT.roads.push({pts:[[o.x,by+4],[o.x,to+14]],w:Math.max(56,(c?c.w*(o.v||1):260)*.2),tex:'cpPave'});}}
window.VK_MAPS=Object.assign(window.VK_MAPS||{},CP);
window.CP_ORDER=['capT','cN','cW','cS','cE','cNE','cSW','cata1','cata2','rift1','rift2','rift3'];
const T=(n,th,a,b,base,col,sc)=>({base,name:n,th,lv:[a,b],sc:sc||1,[base==='snowwolf'?'flt':'tint']:col});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  cN:[T('Wild Horse','ม้าป่า',18,26,'snowwolf','sepia(.9) brightness(.8)',1.05),T('Plains Wolf','หมาป่าทุ่ง',20,26,'snowwolf','sepia(.4) brightness(.9)',.95)],
  cW:[T('Field Hawk','เหยี่ยวทุ่ง',18,26,'frostling','#a87848',.85),T('Meadow Slime','สไลม์ทุ่ง',20,26,'frostling','#80c850',.9)],
  cS:[T('Wild Bull','กระทิงป่า',22,30,'snowwolf','sepia(1) brightness(.6)',1.15),T('Giant Bee','ผึ้งยักษ์',24,30,'frostling','#f0c030',.85)],
  cE:[T('Golden Stag','กวางเขาทอง',22,30,'snowwolf','sepia(1) saturate(2) brightness(1.1)',1.05),T('Wild Boar','หมูป่า',24,30,'snowwolf','sepia(.8) brightness(.55)',1)],
  cNE:[T('Haunted Mill Spirit','ผีโรงสี',26,34,'frostling','#b0b8d0',1.05),T('Giant Crow','อีกายักษ์',28,34,'frostling','#303040',.95)],
  cSW:[T('Water Sprite','ภูตน้ำ',26,34,'frostling','#60b0e8',1),T('Rusted Soldier','ทหารสนิม',28,34,'frostling','#a06840',1.1)],
  cata1:[T('Skeleton Soldier','โครงกระดูกทหาร',30,37,'frostling','#e0dcc8',1.05),T('Sewer Rat','หนูท่อ',32,37,'snowwolf','brightness(.5) saturate(.3)',.75)],
  cata2:[T('Wraith Knight','อัศวินวิญญาณ',37,44,'frostling','#8098c8',1.2),T('Skeleton Soldier','โครงกระดูกทหาร',38,44,'frostling','#d0c8b0',1.1)],
  rift1:[T('Aether Wisp','ภูตเอเธอร์',90,93,'frostling','#60e0ff',1.1),T('Rift Hound','หมารอยแยก',91,93,'snowwolf','hue-rotate(240deg) saturate(2)',1.25)],
  rift2:[T('Crystal Golem','โกเลมคริสตัล',94,97,'frostling','#ff80e0',1.45),T('Rift Hound','หมารอยแยก',95,97,'snowwolf','hue-rotate(200deg) saturate(2.5)',1.3)],
  rift3:[T('Wyrm Spawn','ลูกเอเธอร์เวิร์ม',98,99,'snowwolf','hue-rotate(260deg) saturate(3) brightness(1.2)',1.5),T('Void Sentinel','ผู้เฝ้าความว่างเปล่า',98,99,'frostling','#a060ff',1.5)]});
})();
