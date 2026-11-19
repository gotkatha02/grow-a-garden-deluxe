/* =====================================================================
   AETHERFALL — Viking zone (Frostheim region) map configs.
   Each entry is read by createFieldHost (maps/fieldmap.js). Coordinates are map pixels.
   Warps: {id, x, y, to:<map id>, at:<warp id in that map>, label}. 'snowpine' is the hand-tuned
   Snow Pine Woods (field 1) host; it uses the same warp ids.
   mons: monster table for the map (see VK_MONS in index.html wiring) — base sprite + name + level range.
   ===================================================================== */
(function(){
const SPV=['pineV01', 'pineV02', 'pineV03', 'pineV04', 'pineV05', 'pineV06', 'pineV07', 'pineV08', 'pineV09', 'pineV10', 'pineV11', 'pineV12', 'pineV13', 'pineV14', 'pineV15', 'pineV16', 'pineV17', 'pineV18', 'pineV19', 'pineV20', 'pineV21', 'pineV22', 'pineV23', 'pineV24', 'pineV25'],DKV=['darkPineV01', 'darkPineV02', 'darkPineV03', 'darkPineV04', 'darkPineV05', 'darkPineV06', 'darkPineV07', 'darkPineV08', 'darkPineV09', 'darkPineV10', 'darkPineV11', 'darkPineV12', 'darkPineV13'],DEADV=['deadTreeV01', 'deadTreeV02', 'deadTreeV03', 'deadTreeV04', 'deadTreeV05', 'deadTreeV06', 'deadTreeV07', 'deadTreeV08', 'deadTreeV09'],DSTV=['darkStumpV1', 'darkStumpV2', 'darkStumpV3'],ICEV=['iceSpireV01', 'iceSpireV02', 'iceSpireV03', 'iceSpireV04', 'iceSpireV05', 'iceSpireV06', 'iceSpireV07', 'iceSpireV08', 'iceSpireV10', 'iceSpireV11', 'iceSpireV12', 'iceSpireV13', 'iceSpireV14', 'iceSpireV15', 'iceSpireV17', 'iceSpireV18', 'iceSpireV19', 'iceSpireV20', 'iceSpireV21', 'iceSpireV22', 'iceSpireV23', 'iceSpireV25'],ICEBIG=['iceSpireV09', 'iceSpireV16', 'iceSpireV24'];
const WALLV=['caveWallV1', 'caveWallV2', 'caveWallV3', 'caveWallV4', 'caveWallV5', 'caveWallV6'],PILL=['cavePillar1', 'cavePillar2'],CROCK=['caveRockV1', 'caveRockV2', 'caveRockV3', 'caveRockV4'],PGR=['pGrass1', 'pGrass2', 'pGrass3', 'pGrass4'],PMU=['pMud1', 'pMud2', 'pMud3', 'pMud4'],PIC=['pIce1', 'pIce2', 'pIce3', 'pIce4'],PGV=['pGravel1', 'pGravel2', 'pGravel3', 'pGravel4'];
const PINES=['pineA','pineB','pineC','twinPine','pineD','deadPine',...SPV,...SPV.slice(0,8)],PINES_OPEN=['pineA','pineB','pineC','pineD','pineS','pineXS','deadPine','bareTree','twinPine','deadTree1',...SPV,...DKV.slice(0,4)];
const UNDER=['bush','berryS','berryL','rock1','rock4','pineXS','stump','rockPile1','icyBush1'];
const ROCKS=['rock1','rock2','rock4','rock5','rock6','rockPile1','rockPile2','rockPile3','icicleRock1','icicleRock2','crackRock1','crackRock2'];
const SNOW_DECALS=['rockS','mound','cones','branch','puddle','rock3'],GRASS=['grassS','grassL','grassS'];
const SEA=['floe1','floe2','floe3','floe4','seaFloe1','seaFloe2','icebergL','icebergT','islet1','islet2','islet3','wave1','wave2','wave1','planks','plank','floatBarrel'];
window.VK_MAPS={
/* ---------------- Frostheim (home town) ---------------- */
frostheim:{under:UNDER,name:'ฟรอสต์เฮล์ม Frostheim',lv:'เมือง',seed:11,doorRe:'^(house[12]|vkCottage[AB]|chiefHall|forge|vkCraftHall|tavern|vkMerchant|vkStable|vkHealer|vkStoreStone)$',stepTex:'texCobble',W:3000,H:2480,mood:'town',ground:'snow',trailKind:'cobble',mons:false,trails:[],
  border:{set:PINES,band:210,calm:1},openTrees:0,propDens:.18,open:['rock1','rockPile1','berryS','bush','stump'],decals:['rockS','mound','cones'],grass:GRASS,decalDens:.45,
  /* a village that grew along the road: the street winds up to the great hall, lanes branch off where houses were built */
  roads:[{pts:[[250,1770],[700,1690],[1050,1540],[1300,1330],[1560,1080],[1780,830]],w:118,kc:'#8a879c',shade:'rgba(240,244,255,.3)'},
    {pts:[[1320,1560],[1600,1790],[1950,1965],[2300,2120],[2660,2250]],w:96,kc:'#8a879c',shade:'rgba(240,244,255,.3)'},
    {pts:[[1540,1110],[1950,1235],[2350,1200],[2660,1060]],w:80,kc:'#8a879c',shade:'rgba(240,244,255,.3)'},
    {pts:[[1080,1590],[980,1850],[820,2100],[620,2240]],w:72,kc:'#8a879c',shade:'rgba(240,244,255,.3)'},
    {pts:[[1950,1965],[2060,1720],[2180,1520]],w:62,kc:'#8a879c',shade:'rgba(240,244,255,.3)'}],
  squares:[{x:1190,y:1470,rx:230,ry:150,kc:'#8a879c',shade:'rgba(240,244,255,.3)'},{x:1770,y:890,rx:250,ry:105,kc:'#8a879c',shade:'rgba(240,244,255,.3)'}],
  clusters:[{x:620,y:640,r:330,set:PINES,n:11,sp:90},{x:2420,y:560,r:300,set:PINES,n:9,sp:95},{x:1220,y:820,r:150,set:PINES,n:3,sp:110},{x:2600,y:1640,r:160,set:PINES,n:4,sp:100},{x:450,y:2080,r:140,set:PINES,n:3,sp:100}],
  land:[{n:'greatHall',x:1790,y:790},
    {n:'house2',x:600,y:1600},{n:'vkCottageA',x:830,y:1490},{n:'chiefHall',x:1060,y:1285},{n:'vkCraftHall',x:1390,y:985},
    {n:'tavern',x:1580,y:1430,flip:1},{n:'vkMerchant',x:1790,y:1730},{n:'vkStable',x:2170,y:1900},{n:'watchtower',x:2500,y:2075},{n:'vkCottageB',x:1480,y:2060},{n:'vkHealer',x:1960,y:2270},
    {n:'house1',x:2000,y:1135},{n:'vkStoreStone',x:2350,y:1135},{n:'vkLongDragon',x:2540,y:1000,v:.85},
    {n:'house1',x:700,y:1995,v:.9},{n:'house2',x:1150,y:2000,flip:1},
    {n:'runeAltar',x:560,y:1180,v:.85},{n:'stoneLantern',x:420,y:1250},{n:'stoneLantern',x:700,y:1240},
    {n:'well',x:1130,y:1440},{n:'wolfStatue',x:1320,y:1520},{n:'stall1',x:1010,y:1560,flip:1},{n:'stall2',x:1250,y:1350},{n:'cargoCart',x:1400,y:1600},
    {n:'bonfire',x:1770,y:930},{n:'bannerRed',x:1590,y:800},{n:'bannerBlue',x:1990,y:800},
    {n:'dummy',x:2080,y:1430},{n:'dummy',x:2230,y:1480},{n:'target',x:2390,y:1410},
    {n:'fishRack',x:430,y:1560},{n:'hayBale',x:960,y:2120},{n:'woodpile',x:1680,y:2100},{n:'woodpile',x:1185,y:995},{n:'barrels',x:2375,y:1875},{n:'barrel',x:1880,y:1670},
    {n:'noticeBoard',x:960,y:1400},{n:'signpost',x:420,y:1680},{n:'signpost',x:2440,y:2180},
    {n:'lampPost',x:760,y:1650},{n:'lampPost',x:1460,y:1250},{n:'lampPost',x:1700,y:1900},{n:'lampPost',x:2200,y:2110},{n:'lampPost',x:2150,y:1260},
    {n:'bench',x:1060,y:1640},{n:'planter1',x:1640,y:880},{n:'planter2',x:1920,y:930}],
  warps:[{id:'toF1',x:290,y:1770,to:'snowpine',at:'toT',label:'ป่าสนหิมะ'},{id:'toF2',x:2650,y:2260,to:'vikF2',at:'toT',label:'หุบเขี้ยวน้ำแข็ง'}]},

/* ---------------- Field 2 · Frostfang Vale ---------------- */
vikF2:{under:UNDER,name:'หุบเขี้ยวน้ำแข็ง Frostfang Vale',lv:'4–12',seed:22,W:4800,H:3600,mood:'sun',ground:'snow',patches:[{tex:'texRockSnow',scale:700,thr:.64}],
  border:{set:[...PINES,'cliff1','cliff2']},groves:{set:PINES_OPEN,thr:.55},
  open:['rock2','rock5','rockPile1','berryS','berryL','bush','stump','log','rock1'],edge:['pineS','pineXS','pineD','rock4'],decals:[...SNOW_DECALS,...PGV],grass:GRASS,bankSet:['rock1','rock4','bush'],
  bridge:[2400,2000],stream:[[1250,620],[1650,1350],[2050,1800],'B',[3050,2700],[3420,3560]],
  trails:[[[460,520],[800,1300],[1000,2050],[1800,2250],'B',[3300,1200],[4000,700],[4330,470]],[[1000,2050],[1180,2700],[1500,3200]]],
  land:[{n:'frozenFalls',x:2950,y:880,r:200},{n:'cliff3',x:3700,y:2200},{n:'spire1',x:2000,y:3050},{n:'mineEntrance',x:1500,y:3130},{n:'signpost',x:1080,y:2180},{n:'rockArch',x:3550,y:2900}],
  clearings:[[1700,2700,420],[3300,2500,380],[600,1800,320]],
  warps:[{id:'toT',x:460,y:470,to:'frostheim',at:'toF2',label:'ฟรอสต์เฮล์ม'},{id:'toF4',x:4330,y:430,to:'vikF4',at:'toF2',label:'ฟยอร์ดน้ำแข็ง Lv 14–22'},{id:'toD1',x:1500,y:3230,to:'vikD1a',at:'up',label:'เหมืองคนแคระ Lv 28–44'}]},

/* ---------------- Field 3 · Runestone Moor ---------------- */
vikF3:{under:UNDER,name:'ทุ่งหินรูน Runestone Moor',lv:'10–18',seed:33,W:4800,H:3600,mood:'cold',ground:'snow',patches:[{tex:'texTundra',scale:650,thr:.47,rim:'rgba(150,120,90,.35)'}],
  border:{set:PINES},groves:{set:['pineA','pineB','pineD','pineS','deadPine','bareTree',...SPV,...DEADV.slice(0,4)],thr:.62,dens:.6},openTrees:.03,
  open:['runestoneW','runestoneD','runestoneS','runestoneM','rock2','rock5','rockPile2','totem','bush','berryS'],edge:['runestoneS','rock4','pineS'],decals:['rock3','beastSkull','rockS','mound',...PGR,...PGR],grass:['grassL','grassS','grassL'],
  trails:[[[4380,3180],[3700,2600],[2600,1900],[1800,1500],[1200,800],[1100,420]],[[2600,1900],[2400,2600],[2100,2950]]],trailKind:'snow',
  land:[{n:'runeCircle',x:2500,y:1500,r:260},{n:'burialMound',x:3500,y:1100,r:220},{n:'watchtower',x:1300,y:2500},{n:'stoneRing',x:2100,y:2950},{n:'runestoneD',x:2780,y:1380},{n:'runestoneW',x:2230,y:1380},{n:'ruinHall',x:900,y:1600}],
  clearings:[[2500,1500,450],[3500,1150,380],[2100,2900,330]],
  warps:[{id:'toF1',x:4380,y:3220,to:'snowpine',at:'toF3',label:'ป่าสนหิมะ Lv 1–8'},{id:'toH1',x:1100,y:380,to:'vikH1',at:'toF3',label:'ป่าสนดำ Lv 46–56'}]},

/* ---------------- Field 4 · Frozen Fjord ---------------- */
vikF4:{under:UNDER,name:'ฟยอร์ดน้ำแข็ง Frozen Fjord',lv:'14–22',seed:44,W:4800,H:3600,mood:'cold',ground:'snow',patches:[{tex:'texSeaIce',scale:500,thr:.66,rim:'rgba(80,110,160,.4)'}],
  sea:{side:'E',d:1450,amp:330},seaSet:SEA,
  border:{set:PINES},groves:{set:PINES_OPEN,thr:.6,dens:.7},
  open:['shoreRock1','shoreRock2','driftLog1','sealRock1','sealRock2','crabTrap','anchor','rock2','fishNet','rowboat','rock5'],edge:['pineS','pineXS','rock4'],decals:['shellPile','driftLog2','oar','rockS','mound','rock3',...PIC],grass:GRASS,
  trails:[[[1400,3300],[1500,2600],[1900,1900],[2300,1300],[2000,700],[1200,430]],[[1900,1900],[2700,2050],[3000,2200]]],
  land:[{n:'lighthouse',x:3150,y:900,coast:120},{n:'fishDock',x:3150,y:2150,coast:-40},{n:'vkBoatShed',x:2900,y:1800,coast:230},{n:'rowboat',x:3020,y:2420,coast:60},{n:'whaleBones',x:2900,y:3000,coast:240},{n:'fishRack',x:2600,y:1900}],
  clearings:[[1900,1900,400],[1300,1200,300]],
  warps:[{id:'toF2',x:1400,y:3330,to:'vikF2',at:'toF4',label:'หุบเขี้ยวน้ำแข็ง Lv 4–12'},{id:'toH2',x:1150,y:400,to:'vikH2',at:'toF4',label:'ทุ่งน้ำแข็งเหนือ Lv 52–64'}]},

/* ---------------- Field 5 · Abandoned Longhouse ---------------- */
vikF5:{under:UNDER,name:'หมู่บ้านไวกิ้งร้าง Abandoned Longhouse',lv:'18–26',seed:55,W:4800,H:3600,mood:'sun',ground:'snow',patches:[{tex:'texTundra',scale:600,thr:.6,rim:false}],
  border:{set:PINES},groves:{set:PINES_OPEN,thr:.6,dens:.7},
  open:['rock2','rockPile1','berryS','bush','stump','log','hayBale','barrel'],edge:['pineS','pineD','fence1'],decals:['rockS','mound','branch','fireRing',...PGR,...PGR],grass:GRASS,
  trails:[[[2300,420],[2350,1100],[2300,1800],[2900,2300],[3700,2400],[4400,2350]],[[2300,1800],[1500,2300],[1100,2900]]],
  land:[{n:'ruinHall',x:1700,y:1500,r:260},{n:'ruinHall',x:3200,y:1500,flip:1,r:240},{n:'watchtower',x:2750,y:900},{n:'burialMound',x:1200,y:2950,r:200},{n:'totem',x:2500,y:2000},{n:'fireRing',x:2350,y:2150}],
  clusters:[{x:1800,y:1850,r:330,n:9,set:['fence1','fence2','barrels','barrel','brokenCart','shieldRack','hayBale']},{x:3150,y:1850,r:330,n:9,set:['palisade','fence2','axeRack','barrels','hayBale','barrel']},{x:2600,y:2700,r:300,n:6,set:['fence1','palisade','brokenCart','barrels']}],
  clearings:[[2400,1900,480],[1200,2800,300]],
  warps:[{id:'toF1',x:2300,y:380,to:'snowpine',at:'toF5',label:'ป่าสนหิมะ Lv 1–8'},{id:'toF6',x:4420,y:2350,to:'vikF6',at:'toF5',label:'ช่องเขาหมาป่า Lv 22–30'}]},

/* ---------------- Field 6 · Wolf's Pass ---------------- */
vikF6:{under:['rock1','rock2','rock4','icicleRock1','pineXS','bush'],name:'ช่องเขาหมาป่า Wolf\'s Pass',lv:'22–30',seed:66,W:4800,H:3600,mood:'cold',ground:'snow',patches:[{tex:'texRockSnow',scale:600,thr:.5,rim:'rgba(70,50,60,.4)'}],
  border:{set:['cliff1','cliff2','cliff3','spire1','spire2','pineA','pineB','cliff1'],band:330,sp:90},groves:{set:['cliff1','cliff2','cliff3','spire1','spire2','pineB','pineC','rock6'],thr:.6,dens:.4},openTrees:.015,propDens:.7,
  open:ROCKS,edge:['rock6','rock2','icicleRock1','pineS'],decals:['beastSkull','boneHeap','rock3','rockS','mound',...PGV],grass:['grassS'],
  trails:[[[420,1800],[1200,1700],[2000,1900],[2700,1600],[3400,1900],[3900,2600],[4000,3220]]],
  land:[{n:'wolfDen',x:2600,y:1150,r:220},{n:'rockArch',x:3400,y:1680},{n:'frozenFalls',x:1500,y:900},{n:'signpostOld',x:3800,y:2500},{n:'boneHeap',x:2500,y:1360},{n:'beastSkull',x:2760,y:1340}],
  clearings:[[2000,1900,420],[2600,1350,330],[1300,2700,380],[3200,2800,360]],
  warps:[{id:'toF5',x:380,y:1800,to:'vikF5',at:'toF6',label:'หมู่บ้านไวกิ้งร้าง Lv 18–26'},{id:'toCap',x:4000,y:3260,to:'cN',at:'toVik',label:'ทุ่งเหนือเมืองหลวง'}]},

/* ---------------- Dungeon 1 · Dwarven Mine (2 floors) ---------------- */
vikD1a:{name:'เหมืองคนแคระ ชั้น 1',lv:'28–36',seed:71,W:3600,H:2700,mood:'mine',ground:'texCave',patches:[{tex:'texRockSnow',scale:400,thr:.68,rim:false,a:.5}],trailKind:'dirt',trailW:72,
  propDens:.5,rails:1,onTrail:['minecart','minecart'],walls:{face:'wallMine',top:'caveTop',fh:150,tint:'rgba(40,24,10,.22)',dark:'5,5,10'},border:{band:230},groves:{thr:.53},
  open:['stalagmite1','stalagmite2','rockPile1','goldOre','blueOre','goldOre','blueOre','torch1','torch2','skullPile','rockPile2','blueCrystalS','scaffold'],edge:[],decals:['pickaxe','rock3','bonePile',...PGV],decalDens:.6,
  trails:[[[1800,2450],[1700,1800],[1200,1300],[700,700]],[[1700,1800],[2500,1300],[2900,700]]],
  land:[{n:'scaffold',x:1250,y:1050},{n:'crystalVein',x:2700,y:1700},{n:'torch1',x:1600,y:2200},{n:'torch2',x:1990,y:2200},{n:'chest',x:2950,y:2150}],
  clearings:[[1700,1800,360]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2480,to:'vikF2',at:'toD1',label:'ทางออก'},{id:'down',x:700,y:640,to:'vikD1b',at:'up',label:'ชั้น 2 Lv 36–44'}]},
vikD1b:{name:'เหมืองคนแคระ ชั้น 2',lv:'36–44',seed:72,W:3600,H:2700,mood:'mine',ground:'texCave',patches:[{tex:'texMud',scale:420,thr:.64,rim:false,a:.5}],trailKind:'dirt',trailW:72,
  propDens:.5,rails:1,onTrail:['minecart','minecart'],walls:{face:'wallMine',top:'caveTop',fh:150,tint:'rgba(40,24,10,.22)',dark:'5,5,10'},border:{band:230},groves:{thr:.53},
  open:['stalagmite1','stalagmite2','rockPile1','goldOre','blueOre','goldOre','blueOre','blueCrystalL','blueCrystalS','torch1','skullPile','minecart'],edge:[],decals:['pickaxe','bonePile','rock3',...PGV],decalDens:.6,
  trails:[[[700,2400],[1300,1700],[1900,1300],[2700,800]]],
  land:[{n:'dwarfForge',x:2600,y:700,r:240},{n:'chest',x:2900,y:860},{n:'goldOre',x:2350,y:860},{n:'torch1',x:2300,y:620},{n:'chainGate',x:1900,y:1000}],
  clearings:[[2600,850,360],[1300,1700,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:700,y:2440,to:'vikD1a',at:'down',label:'ชั้น 1'}]},

/* ---------------- High field · Blackpine Hollow ---------------- */
vikH1:{under:['thorn1','thorn2','glowShroomL','mossRock1','mossRock2','darkStump3','web1',...DSTV],name:'ป่าสนดำ Blackpine Hollow',lv:'46–56',seed:81,W:4800,H:3600,mood:'dark',ground:'snow',patches:[{tex:'texMud',scale:520,thr:.54,rim:'rgba(30,20,30,.45)'}],trailKind:'trample',trailW:84,
  border:{set:['darkPine1','darkPine2','darkPine3','darkPine4','deadTree1','deadTree2','hollowTrunk',...DKV,...DEADV]},groves:{set:['darkPine1','darkPine2','darkPine3','darkPine4','deadTree1','deadTree2','pineC','deadPine',...DKV,...DKV,...DEADV,...DSTV],thr:.6,dens:.7},openTrees:.02,
  open:['thorn1','thorn2','thorn3','glowShroomL','glowShroomXL','mossRock1','mossRock2','darkStump1','darkStump2','darkStump3','web1','web2','boneTotem','cauldron','lanternPole'],edge:['thorn1','web1','glowShroomL','darkStump3'],decals:['trap','boneHeap','rock3',...PMU],grass:['grassS'],decalDens:.6,
  trails:[[[2400,3250],[2300,2500],[1700,1800],[1100,1100],[700,520]]],
  land:[{n:'witchHut',x:3200,y:1500,r:250},{n:'hollowTrunk',x:1400,y:2600},{n:'stoneRing',x:2300,y:1700},{n:'cauldron',x:3380,y:1620},{n:'lanternPole',x:2960,y:1600},{n:'wolfDen',x:700,y:420}],
  clearings:[[3200,1650,420],[2300,1700,380],[1400,2750,340],[3600,2700,380],[1200,1300,360],[3700,700,360]],
  warps:[{id:'toF3',x:2400,y:3300,to:'vikF3',at:'toH1',label:'ทุ่งหินรูน Lv 10–18'},{id:'toD2',x:700,y:540,to:'vikD2a',at:'up',label:'ถ้ำเฟนเรียร์ Lv 58–80'}]},

/* ---------------- High field · Northern Icefield ---------------- */
vikH2:{under:['icicleRock1','icicleRock2','iceBlockCr','icyBush2','sealRock1'],name:'ทุ่งน้ำแข็งเหนือ Northern Icefield',lv:'52–64',seed:82,W:4800,H:3600,mood:'storm',ground:'snow',patches:[{tex:'texSeaIce',scale:600,thr:.52,rim:'rgba(80,110,160,.4)'}],
  sea:{side:'N',d:900,amp:300},seaSet:SEA,
  border:{set:['iceSpire1','iceSpire2','iceSpire3','iceSpire4','iceBlock',...ICEV]},groves:{set:['iceSpire1','iceSpire2','iceSpire3','iceSpire4','iceBlock','iceBlockCr',...ICEV,...ICEV],thr:.62,dens:.45},openTrees:.015,
  open:['iceBlock','iceBlockCr','icicleRock1','icicleRock2','crackRock1','crackRock2','sealRock1','sealRock2','frozenSword','icyBush1','icyBush2'],decals:['crystalS','rock3','mound','beastSkull',...PIC],grass:['grassS'],decalDens:.5,
  trails:[[[2400,3300],[2500,2600],[3100,2100],[3900,1700],[4400,1500]]],
  land:[{n:'frozenWarrior1',x:2000,y:2000},{n:'frozenWarrior2',x:2300,y:1900},{n:'frozenSword',x:2150,y:2150},{n:'iceBlockCr',x:3300,y:2700}],
  clearings:[[2200,2050,380],[3500,2600,350]],
  warps:[{id:'toF4',x:2400,y:3330,to:'vikF4',at:'toH2',label:'ฟยอร์ดน้ำแข็ง Lv 14–22'},{id:'toE1',x:4440,y:1500,to:'vikE1',at:'toH2',label:'สุสานเรือมังกร Lv 76–86'}]},

/* ---------------- Dungeon 2 · Fenrir's Den (3 floors) ---------------- */
vikD2a:{name:'ถ้ำเฟนเรียร์ ชั้น 1',lv:'58–66',seed:91,W:3600,H:2700,mood:'cave',ground:'texCave',patches:[{tex:'texRockSnow',scale:420,thr:.62,rim:false,a:.5}],trailKind:'none',
  propDens:.5,walls:{face:'wallCaveIce',top:'caveTop',fh:150,tint:'rgba(40,80,150,.32)',dark:'5,5,10'},border:{band:230},groves:{thr:.53},
  open:['stalagmite1','stalagmite2','rockPile1','blueCrystalS','blueCrystalL','skullPile','wolfSkeleton','bonePile','blueCrystalS','torch1','stalagmite2','giantSkull'],edge:[],decals:['bonePile','wolfSkeleton','beastSkull','boneHeap','rock3'],decalDens:.7,
  land:[{n:'giantSkull',x:1800,y:1350},{n:'torch1',x:1500,y:2250},{n:'torch2',x:2100,y:2250}],clearings:[[1800,1500,380]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:1800,y:2450,to:'vikH1',at:'toD2',label:'ทางออก'},{id:'down',x:3000,y:600,to:'vikD2b',at:'up',label:'ชั้น 2 Lv 66–73'}]},
vikD2b:{name:'ถ้ำเฟนเรียร์ ชั้น 2',lv:'66–73',seed:92,W:3600,H:2700,mood:'cave',ground:'texCave',patches:[{tex:'texSeaIce',scale:400,thr:.66,rim:false,a:.5}],trailKind:'none',
  propDens:.5,walls:{face:'wallCaveIce',top:'caveTop',fh:150,tint:'rgba(40,80,150,.32)',dark:'5,5,10'},border:{band:230},groves:{thr:.53},
  open:['stalagmite1','stalagmite2','rockPile1','blueCrystalS','blueCrystalL','skullPile','bonePile','blueCrystalL','blueCrystalS','torch2','chainGate'],edge:[],decals:['bonePile','wolfSkeleton','boneHeap','rock3'],decalDens:.7,
  land:[{n:'chainGate',x:1800,y:1200},{n:'torch1',x:1660,y:1260},{n:'torch2',x:1940,y:1260}],clearings:[[1800,1400,320]],spawnN:24,spawnGap:280,
  warps:[{id:'up',x:600,y:2400,to:'vikD2a',at:'down',label:'ชั้น 1'},{id:'down',x:3000,y:2350,to:'vikD2c',at:'up',label:'ชั้น 3 Lv 73–80'}]},
vikD2c:{name:'ถ้ำเฟนเรียร์ ชั้น 3 · บัลลังก์เฟนเรียร์',lv:'73–80',seed:93,W:3600,H:2700,mood:'cave',ground:'texCave',patches:[{tex:'texGlacier',scale:380,thr:.68,rim:false,a:.5}],trailKind:'none',
  propDens:.5,walls:{face:'wallCaveIce2',top:'caveTop',fh:150,tint:'rgba(40,80,150,.32)',dark:'5,5,10'},border:{band:240},groves:{thr:.53},
  open:['stalagmite1','stalagmite2','rockPile1','blueCrystalS','blueCrystalL','skullPile','bonePile','blueCrystalL','torch1','torch2','giantSkull'],decals:['bonePile','wolfSkeleton','boneHeap'],decalDens:.7,
  land:[{n:'wolfAltar',x:1800,y:1150,r:330},{n:'giantSkull',x:1450,y:1250},{n:'giantSkull',x:2150,y:1250,flip:1},{n:'torch1',x:1550,y:900},{n:'torch2',x:2050,y:900},{n:'chest',x:1800,y:1350}],
  clearings:[[1800,1350,520]],spawnN:20,spawnGap:300,
  warps:[{id:'up',x:600,y:2400,to:'vikD2b',at:'down',label:'ชั้น 2'},{id:'toE2',x:3050,y:500,to:'vikE2',at:'toD2',label:'ธารน้ำแข็งนิรันดร์ Lv 84–94'}]},

/* ---------------- End game · Dragonship Graveyard ---------------- */
vikE1:{under:UNDER,name:'สุสานเรือมังกร Dragonship Graveyard',lv:'76–86',seed:101,W:4800,H:3600,mood:'storm',ground:'snow',patches:[{tex:'texSeaIce',scale:500,thr:.6,rim:'rgba(80,110,160,.4)'}],
  sea:{side:'N',d:1000,amp:300},seaSet:SEA,
  border:{set:[...PINES,...DEADV,'iceSpire1','cliff1']},groves:{set:['deadPine','bareTree',...SPV,...DEADV,...ICEV.slice(0,5)],thr:.62,dens:.55},
  open:['driftLog1','anchor','runestoneW','runestoneM','shieldRack','shoreRock1','shoreRock2','sealRock1','barrels','rock6','crabTrap'],decals:['oar','driftLog2','shellPile','beastSkull','boneHeap','rock3',...PIC],grass:['grassS'],
  trails:[[[700,3250],[1400,2700],[2400,2400],[3400,2300],[4400,2350]]],
  land:[{n:'longship',x:1500,y:1350,coast:200},{n:'longship',x:3400,y:1400,coast:230,flip:1},{n:'whaleBones',x:2450,y:1300,coast:250},{n:'lighthouse',x:4100,y:1300,coast:150},{n:'burialMound',x:2400,y:3000}],
  clearings:[[2400,2300,420],[1500,2000,330]],
  warps:[{id:'toH2',x:700,y:3280,to:'vikH2',at:'toE1',label:'ทุ่งน้ำแข็งเหนือ Lv 52–64'},{id:'toE2',x:4420,y:2350,to:'vikE2',at:'toE1',label:'ธารน้ำแข็งนิรันดร์ Lv 84–94'}]},

/* ---------------- End game · Eternal Glacier ---------------- */
vikE2:{under:['crystalL','icyBush1','icyBush2','iceBlockCr','frostRune1'],name:'ธารน้ำแข็งนิรันดร์ Eternal Glacier',lv:'84–94',seed:111,W:4800,H:3600,mood:'glacier',ground:'snow',patches:[{tex:'texGlacier',scale:650,thr:.6,rim:'rgba(60,110,180,.45)'}],
  border:{set:['iceSpire1','iceSpire2','iceSpire3','iceSpire4','crystalL',...ICEV]},groves:{set:['iceSpire1','iceSpire2','iceSpire3','iceSpire4','crystalL','iceBlock','pineB','frozenWarrior1','iceSpire2',...ICEV,...ICEV,...ICEBIG],thr:.6,dens:.5},openTrees:.015,
  open:['crystalL','iceBlock','iceBlockCr','frozenWarrior1','frozenWarrior2','frostRune1','frostRune2','icyBush1','icyBush2','frozenSword'],decals:['crystalM','crystalS','crystalS','rock3',...PIC],grass:['grassS'],decalDens:.7,
  trails:[[[4400,2400],[3700,2200],[2900,1900],[2400,1500],[2400,950]],[[2900,1900],[2100,2500],[1000,3000],[600,3200]]],
  land:[{n:'jotunn',x:2400,y:800,r:300},{n:'crystalGiant',x:3600,y:1100,r:220},{n:'runeAltar',x:1400,y:1500,r:260},{n:'iceGate',x:2400,y:1500},{n:'frostRune1',x:2150,y:1150},{n:'frostRune2',x:2650,y:1150}],
  clearings:[[2400,1100,420],[1400,1700,340]],
  warps:[{id:'toE1',x:4440,y:2400,to:'vikE1',at:'toE2',label:'สุสานเรือมังกร Lv 76–86'},{id:'toD2',x:560,y:3250,to:'vikD2c',at:'toE2',label:'ถ้ำเฟนเรียร์ ชั้น 3'}]}
};

/* monsters per map: base = which existing sprite/model draws it; lv range; share of spawns */
window.VK_MONS={
  snowpine:[{base:'snowwolf',name:'Snow Pup',th:'ลูกหมาป่าหิมะ',lv:[3,8],sc:.78}],
  vikF2:[{base:'snowwolf',name:'Fang Hare',th:'กระต่ายเขี้ยวน้ำแข็ง',lv:[4,12],sc:.85},{base:'frostling',name:'Big Frostling',th:'ฟรอสต์ลิงใหญ่',lv:[6,12],sc:1.05}],
  vikF3:[{base:'frostling',name:'Rune Wisp',th:'ภูตหินรูน',lv:[10,18],sc:.95,tint:'#7fd6c8'},{base:'snowwolf',name:'Moor Wolf',th:'หมาป่าทุ่ง',lv:[12,18],sc:.92,flt:'sepia(.35) saturate(1.2)'}],
  vikF4:[{base:'frostling',name:'Ice Crab',th:'ปูหิมะ',lv:[14,22],sc:.9,tint:'#e0896a'},{base:'frostling',name:'Fjord Seal Spirit',th:'ภูตแมวน้ำ',lv:[16,22],sc:1.1,tint:'#d8dde6'}],
  vikF5:[{base:'snowwolf',name:'Hound of the Raiders',th:'หมาล่าเนื้อ',lv:[18,26],sc:.95,flt:'sepia(.6) saturate(1.4) brightness(.9)'},{base:'frostling',name:'Lost Villager',th:'ผีชาวบ้าน',lv:[20,26],sc:1,tint:'#c8c8cc'}],
  vikF6:[{base:'snowwolf',name:'Pass Wolf',th:'หมาป่าหิมะ',lv:[22,30],sc:1},{base:'frostling',name:'Yeti Cub',th:'ลูกเยติ',lv:[24,30],sc:1.15,tint:'#f2f2f6'}],
  vikD1a:[{base:'frostling',name:'Mad Dwarf Ghost',th:'วิญญาณคนแคระ',lv:[28,36],sc:.9,tint:'#d9b25a'},{base:'frostling',name:'Ore Golem',th:'โกเลมแร่',lv:[30,36],sc:1.2,tint:'#6f6a72'}],
  vikD1b:[{base:'frostling',name:'Forge Golem',th:'โกเลมเตาหลอม',lv:[36,44],sc:1.25,tint:'#e0703a'},{base:'snowwolf',name:'Ice Bat Pack',th:'ค้างคาวน้ำแข็ง',lv:[38,44],sc:.8,flt:'hue-rotate(180deg) brightness(.85)'}],
  vikH1:[{base:'snowwolf',name:'Shadow Wolf',th:'หมาป่าเงา',lv:[46,56],sc:1.05,flt:'brightness(.45) contrast(1.3)'},{base:'frostling',name:'Forest Witchling',th:'แม่มดป่า',lv:[48,56],sc:1,tint:'#6aa860'}],
  vikH2:[{base:'frostling',name:'Young Yeti',th:'เยติ',lv:[52,64],sc:1.35,tint:'#f4f6fa'},{base:'snowwolf',name:'Tundra Wolf',th:'หมาป่าทุนดรา',lv:[54,64],sc:1.1}],
  vikD2a:[{base:'snowwolf',name:'Fenrir Spawn',th:'ลูกเฟนเรียร์',lv:[58,66],sc:1.05,flt:'brightness(.6) hue-rotate(200deg)'},{base:'frostling',name:'Wolf Priest',th:'นักบวชหมาป่า',lv:[60,66],sc:1.05,tint:'#7a5aa8'}],
  vikD2b:[{base:'snowwolf',name:'Draugr Wolf',th:'หมาป่าเดรากร์',lv:[66,73],sc:1.15,flt:'grayscale(.6) brightness(.7) contrast(1.3)'},{base:'frostling',name:'Draugr',th:'เดรากร์',lv:[66,73],sc:1.2,tint:'#5d6670'}],
  vikD2c:[{base:'snowwolf',name:'Fenrir Guard',th:'องครักษ์เฟนเรียร์',lv:[73,80],sc:1.25,flt:'brightness(.5) contrast(1.4)'},{base:'frostling',name:'Wolf High Priest',th:'มหานักบวชหมาป่า',lv:[74,80],sc:1.25,tint:'#b04a8a'}],
  vikE1:[{base:'frostling',name:'Undying Viking',th:'ไวกิ้งอมตะ',lv:[76,86],sc:1.3,tint:'#8a8f9a'},{base:'snowwolf',name:'Sea Ghost Wolf',th:'หมาป่าวิญญาณทะเล',lv:[78,86],sc:1.15,flt:'hue-rotate(170deg) brightness(1.1) saturate(.6)'}],
  vikE2:[{base:'frostling',name:'Frost Giant',th:'ยักษ์น้ำแข็ง',lv:[84,94],sc:1.55,tint:'#79c8f0'},{base:'snowwolf',name:'Dark Valkyrie Wolf',th:'หมาป่าวาลคิรีมืด',lv:[86,94],sc:1.25,flt:'brightness(.55) hue-rotate(230deg)'}]
};
})();
