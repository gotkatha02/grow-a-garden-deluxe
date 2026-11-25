/* =====================================================================
   AETHERFALL v2 — "เมืองแห่งแสง" (owner 2026-11-25 'ทำแมพเมืองให้ใหม่ … แบบทำใหม่หมด … อยากได้แบบเมืองแสงในเกม12หาง').
   Replaces the walled grid capital of maps/capital-maps.js (the old one comes back with ?capold=1).
   A green, warm, compact city instead of a stone checkerboard: one round Plaza of Light in the middle, the castle at the head of the
   north avenue, and four quarters around the cross of the avenues —
     NW  Garden of Light   pond, crystal lamps, blossom trees, the sealed rift portal at the back   (warp 'rift')
     NE  Cathedral         church, its yard, the old graveyard and the catacomb stairs              (warp 'cata')
     SW  Adventurers' row  guild hall (enterable), bank, inn · craft street: armory (enterable), smith, weapons, potions
     SE  Market & homes    central market tent + stall square, tavern, bakery, flower shop, houses, clock tower
   Buildings stand in ROWS that face the street below them (every door looks south, like the art), streets wander a little,
   every gap is lawn, flower bed or tree. Exits at the four edges keep the old warp ids (toN toS toW toE) so every other map,
   the world-boss arenas, the sea and the guide still lead here.
   Coordinates are map pixels of a 4400 × 3600 map.
   ===================================================================== */
(function(){
if(new URLSearchParams(location.search).get('capold')==='1')return;
const V=window.VK_MAPS||{};if(!V.capT)return;
const OAK=['cpOak1','cpOak2','cpOak3','cpOak4','cpOak5','cpOak6','cpChestnut','cpChestnut2','cpBirch1','cpBirch2','cpPoplar1','cpPoplar2'];
const PARK=['cpRound1','cpRound2','cpBlossom','cpBirchGold','cpApple'];
const BLOOM=['cpBlossom','cpBlossom','cpRound2','cpBirchGold','cpRound1'];
const HOUSES=['cpRH1','cpRH2','cpRH3','cpRH4','cpRH5','cpRH6'];
const L=[],R=[],SQ=[],PV=[],LW=[];
const P=(n,x,y,o)=>{const a=Object.assign({n,x:Math.round(x),y:Math.round(y)},o||{});L.push(a);return a;};
const H=(n,x,y,o)=>P(n,x,y,Object.assign({smolder:.86,smx:.2},o||{}));
const road=(pts,w,tex,o)=>R.push(Object.assign({pts,w,tex:tex||'grMarble'},o||{}));
/* a row of lamps (or anything) along a polyline, every `step` px, both sides when `side` is given */
function along(pts,step,fn){let acc=step/2;for(let i=0;i+1<pts.length;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],d=Math.hypot(x1-x0,y1-y0);
  while(acc<d){const t=acc/d,nx=-(y1-y0)/d,ny=(x1-x0)/d;fn(x0+(x1-x0)*t,y0+(y1-y0)*t,nx,ny);acc+=step;}acc-=d;}}

/* ---------------- streets ---------------- */
const AV_N=[[2200,1130],[2200,1300],[2200,1470]];                                   // castle → plaza
const AV_S=[[2200,2120],[2195,2500],[2210,2900],[2200,3300],[2200,3600]];           // plaza → south gate
const RD_W=[[1660,1840],[1300,1870],[900,1880],[520,1872],[0,1880]];               // plaza → west exit
const RD_E=[[2740,1800],[3150,1820],[3600,1800],[4000,1790],[4400,1800]];           // plaza → east exit
const ST_C=[[300,2610],[800,2640],[1300,2630],[1800,2610],[2200,2600],[2650,2610],[3100,2630],[3600,2640],[4100,2610]];   // craft / market street
const ST_D=[[520,3150],[1000,3170],[1500,3160],[1960,3150],[2200,3150],[2450,3150],[2900,3160],[3400,3170],[3880,3150]];   // home lane
const LN_N=[[1790,1150],[1640,900],[1560,560],[1520,0]];                            // forecourt → north exit
const LN_NW=[[1750,1560],[1460,1430],[1120,1400],[860,1240],[760,920]];             // plaza → garden → rift portal
const LN_NE=[[2660,1560],[2980,1360],[3340,1240]];                                  // plaza → cathedral yard
const LN_CATA=[[3600,1230],[3820,1100],[3960,960]];                                 // cathedral → catacomb stairs
road(AV_N,220);road(AV_S,200);road(RD_W,150);road(RD_E,150);road(ST_C,120);road(ST_D,96);
road(LN_N,120);road(LN_NW,96);road(LN_NE,110);road(LN_CATA,86);
/* side lanes between the rows (north–south) */
road([[1000,1890],[980,2250],[1010,2620]],84);road([[3420,1810],[3440,2200],[3400,2630]],84);
road([[700,2640],[690,2900],[720,3160]],80);road([[1700,2620],[1690,2900],[1720,3160]],80);
road([[2700,2620],[2690,2900],[2720,3160]],80);road([[3700,2640],[3710,2900],[3680,3160]],80);

/* ---------------- the Plaza of Light ---------------- */
SQ.push({x:2200,y:1795,rx:570,ry:350,tex:'grMarble',kc:'#d8c08a'});
PV.push({e:[2200,1812,410,255],tex:'cpPlaza',kc:'#e2c27a',kerb:11,rings:[.64],ringC:'rgba(196,150,72,.6)'});
P('cpFountain2',2200,1850);
for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]]){P('cpLamp2',2200+a*400,1795+b*235,{flip:a>0?1:0});P('cpBench2',2200+a*250,1795+b*292,{flip:a>0?1:0});}
for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])P('cpPineR',2200+a*(b<0?600:545),1795+b*(b<0?205:268),{flip:a>0?1:0});
for(const a of [-1,1]){P('cpFlowerBed',2200+a*445,1690,{flip:a>0?1:0});P('cpFlowerBed',2200+a*445,1900,{flip:a>0?1:0});}

/* ---------------- north: castle, forecourt, the avenue of crystal lamps ---------------- */
P('cpCastle2',2200,1020,{v:.9,walk:[[0,-110,85,125]]});
SQ.push({x:2200,y:1140,rx:430,ry:105,tex:'grMarble',kc:'#d8c08a'});
for(const y of [1210,1330,1440])for(const a of [-1,1])P('cpCrystalLamp',2200+a*140,y,{flip:a>0?1:0});
for(const a of [-1,1]){P('cpBannerR',2200+a*330,1150,{flip:a>0?1:0});P('cpTopiary',2200+a*300,1300,{v:.8});P('cpTopiary',2200+a*300,1440,{v:.8});}
/* palace gardens either side of the castle */
LW.push({r:[1330,940,1700,1260],flowers:.3},{r:[2700,940,3070,1260],flowers:.3});
for(const [x,y,n] of [[1420,1000,'cpBlossom'],[1610,1060,'cpRound2'],[1480,1230,'cpBirchGold'],[2790,1000,'cpBlossom'],[2980,1060,'cpRound2'],[2930,1230,'cpBirchGold']])P(n,x,y,{v:.85,flip:x>2200?1:0});
for(const a of [-1,1])P('cpFountainS',2200+a*700,1170);

/* ---------------- NW: the Garden of Light + sealed rift portal ---------------- */
P('cpRiftPortal',760,830,{v:.85});
for(const [x,y] of [[560,870],[960,870],[620,1010],[900,1010]])P('cpCrystalLamp',x,y,{flip:x>760?1:0});
const POND={x:1230,y:1130,rx:230,ry:118};
P('cpWayShrine',1500,1180);P('cpCrystalWell',980,1180);
for(const [x,y,f] of [[1080,1330,0],[1400,1300,1]])P('cpBench2',x,y,{flip:f});
for(const [x,y] of [[1110,960],[1360,960],[1520,1360],[880,1420]])P('cpFlowerBed',x,y);
for(const x of [600,700,820,920])P('cpHedge',x,1090);
LW.push({r:[400,560,1180,760],flowers:.2},{r:[1020,1360,1600,1520],flowers:.35},{r:[360,1180,760,1500],flowers:.25});

/* ---------------- NE: cathedral, its yard, graveyard, catacomb stairs ---------------- */
P('cpCathedral',3330,1150,{v:.85,walk:[[0,-50,50,70]]});
SQ.push({x:3330,y:1240,rx:270,ry:85,tex:'grMarble',kc:'#d8c08a'});
P('cpCataEntrance',3960,900,{v:.8});
for(const [i,y] of [[0,1080],[1,1180],[2,1280]])for(const x of [3740,3880,4020,4160])if(!(x===4160&&i===0))P('ctGrave',x+(i%2)*40,y,{flip:(x/140+i)%2|0});
P('ctAngel',3640,1000);P('cpDead',4150,1000,{v:.8});P('ctKnightTomb',4100,1180);
for(const x of [3060,3600])P('cpLamp2',x,1260,{flip:x>3330?1:0});

/* ---------------- row B: along the west road (adventurers) and the east road (market) ---------------- */
H('cpInn',560,1730,{v:.95});P('cpBank',930,1730,{v:.95});P('cpGuildHall',1370,1720,{v:1});
P('cpNotice',1655,1800);P('cpMailbox',748,1792);P('cpSignpost',1650,1960);
P('cpMarket',3110,1690,{v:.95});H('cpTavern',3640,1735);H('cpTall2',3930,1735,{flip:1,smx:-.2});
for(const [x,f] of [[2820,0],[3420,1]])P('cpBannerR',x,1760,{flip:f});
/* the stall square in front of the market (south of the east road) */
SQ.push({x:3170,y:2090,rx:380,ry:150,tex:'grMarble',kc:'#d8c08a'});
for(const [n,x,y,f] of [['cpStallR',2930,2010,0],['cpStallFruit',3110,1985,0],['cpStallBread',3290,1990,1],['cpStallWeapon',3450,2030,1],
  ['cpFlowerCart',2970,2190,0],['cpStallR',3380,2185,1],['cpCartR',3180,2210,0],['cpCrates2',3530,2160,1]])P(n,x,y,{flip:f});
/* a quiet garden east of the stall square */
LW.push({r:[3640,1930,4150,2330],flowers:.3});
P('cpBench2',3690,2245);P('cpFlowerBed',4020,2000,{flip:1});P('cpFlowerBed',3720,1990);
for(const [x,y,n] of [[3640,2080,'cpBlossom'],[4080,2230,'cpRound2'],[3980,2310,'cpApple']])P(n,x,y,{v:.8,flip:x%2});
/* park strip between the west road and the craft street */
LW.push({r:[380,1960,1620,2240],flowers:.22});
for(const [x,n] of [[480,'cpRound1'],[780,'cpBlossom'],[1240,'cpRound2'],[1540,'cpBirchGold']])P(n,x,2120,{v:.8,flip:x%2});
P('cpWell2',1010,2140);P('cpBench2',1380,2060);P('cpFlowerBed',640,2010);

/* ---------------- south avenue: arrival, the warp crystal, banners ---------------- */
P('cpTeleport',2620,2330,{v:.85});
for(const y of [2240,2420,2780,2960])for(const a of [-1,1])P(y%2?'cpLamp2':'cpBannerR',2200+a*135,y,{flip:a>0?1:0});
P('cpLamp2',2065,2600);P('cpLamp2',2340,2600,{flip:1});

/* ---------------- row C: craft street (west) and market street (east) ---------------- */
P('cpArmory',1330,2500,{v:1});H('cpSmith',860,2510,{smolder:.95,smx:.18});P('cpWeapon',520,2515,{v:.95});
P('cpPotion',1820,2520,{v:.95});
H('cpBakery',2620,2520,{smx:-.25});P('cpFlower',2960,2520,{v:.95});P('cpTool',3300,2520,{v:.95});P('cpArmor',3640,2520,{v:.95});H('cpHouseB',3960,2520,{v:.95});
for(const [x,n] of [[1090,'cpCrates2'],[1610,'cpCartR'],[3120,'cpFlowerCart']])P(n,x,2590);

/* ---------------- row D + E: homes ---------------- */
const ROWD=[[480,3050],[860,3085],[1230,3055],[1560,3080],[1880,3050],[2560,3055],[2900,3085],[3240,3050],[3580,3080],[3920,3055]];
ROWD.forEach(([x,y],i)=>H(HOUSES[(i*5+3)%6],x,y,{flip:i%2}));
P('cpClock',2840,2830,{v:.9});
/* behind the home lane: kitchen gardens, a haystack or two, fences — the town thins out into the green belt */
LW.push({r:[420,3220,1880,3380],flowers:.35},{r:[2520,3220,3960,3380],flowers:.35});
for(const [n,x,y,f] of [['cpFence',560,3330,0],['cpFence',690,3330,0],['cpPumpkin',620,3270,0],['cpSunflower',900,3250,0],['cpSunflower',960,3280,1],
  ['cpHaystack',1280,3300,0],['cpHayBale',1400,3330,1],['cpCartR',1560,3280,1],['cpFence',3060,3330,1],['cpFence',3190,3330,1],['cpPumpkin',3120,3270,1],
  ['cpSunflower',3460,3250,1],['cpSunflower',3520,3280,0],['cpHaystack',3820,3300,1],['cpHayBale',3700,3330,0]])P(n,x,y,{flip:f});
P('cpWell2',1700,3290);P('cpWell2',3700,3300,{flip:1});
P('cpMillR',260,3300);P('cpMillR',4150,3290,{flip:1});
for(const [x,y,n] of [[2470,2830,'cpApple'],[1950,2830,'cpAutumn'],[560,2830,'cpRound1'],[3400,2860,'cpApple'],[1220,2860,'cpRound2'],[3950,2860,'cpBlossom']])P(n,x,y,{v:.82,flip:x%2});

/* ---------------- gates / exits ---------------- */
P('cpGate',2200,3440,{v:.8});P('cpTowerR',1880,3470);P('cpTowerR',2520,3470,{flip:1});
P('cpGate',1530,330,{v:.7});
for(const [x,y,f] of [[260,1770,0],[260,1990,0],[4140,1690,1],[4140,1910,1]])P('cpTowerR',x,y,{flip:f,v:.85});
for(const [x,y] of [[360,1960],[4040,1890],[1680,420],[2330,3360]])P('cpSignpost',x,y);
P('cpGuardPost',2050,3350);P('cpGuardPost',1400,440);

/* lamps along the streets */
along(RD_W.slice(0,4),300,(x,y,nx,ny)=>P('cpLamp2',x+nx*92,y+ny*92));
along(RD_E.slice(0,4),300,(x,y,nx,ny)=>P('cpLamp2',x-nx*92,y-ny*92,{flip:1}));
along(ST_C,520,(x,y)=>{if(Math.abs(x-2200)>260)P('cpLamp2',x,y+78);});

/* every door gets a short worn path down to the street it faces */
const DOOR=/^cp(RH\d|House[AB]|Tall[12]|Inn|Tavern|Smith|Bakery|Bank|Potion|Tool|Armor|Weapon|Flower|GuildHall|Armory)$/;
const C=window.VK_CAT||{};
for(const o of L){if(!DOOR.test(o.n))continue;const c=C[o.n];const by=o.y+(c?c.h*(o.v||1)*(1-c.ay):16);
  const to=by<1700?null:by<1900?1860:by<2560?2615:by<3100?3160:by<3500?3560:null;if(to==null||to-by<24)continue;
  R.push({pts:[[o.x,by+2],[o.x,to]],w:Math.max(52,(c?c.w*(o.v||1):260)*.18),tex:'cpPave'});}

const old=V.capT;
V.capT=Object.assign({},{theme:'capital',dirtTex:'cpDirt',lakeTex:'cpWater',seaTex:'cpWater',streamTex:'cpWater',cobbleTex:'cpPave'},{
  name:old.name,lv:old.lv,seed:612,W:4400,H:3600,mons:false,city:1,charK:old.charK||1.35,spawnN:0,
  ground:'cpGrass',mood:'light',paveMerge:1,trailKind:'none',trails:[],roadWear:.85,fringe:.22,stepTex:'grMarble',
  doorRe:'^cp(House[AB]|Tall[12]|Inn|Tavern|Smith|Bakery|Bank|Potion|Tool|Clock|Armor|Weapon|Flower|Turret|RH[1-6])$',
  texScale:{cpPave:.5,grMarble:.5,cpPlaza:.55,cpGrass:.7,cpDirt:.6},
  lit:1,shadowCol:'#4a5a3a',noApron:1,
  border:{set:[...OAK,'cpRound1','cpRound2'],band:210,calm:1},openTrees:0,propDens:.06,open:['cpRose','cpBush','cpBerry'],decalDens:.4,
  patches:[{tex:'jpGrass',scale:640,thr:.6,a:.35,soft:.07}],
  lakes:[POND,{x:3880,y:2150,rx:150,ry:78}],lakeSet:['cpLily','cpLily'],
  squares:SQ,paves:PV,roads:R,lawns:LW.map(l=>Object.assign({flowers:.2,keep:.6,m:18,pre:1},l)),
  clusters:[{x:900,y:420,r:260,set:BLOOM,n:7,sp:110},{x:1250,y:760,r:150,set:['cpWillow','cpBlossom'],n:3,sp:110},
    {x:3700,y:520,r:260,set:['cpPoplar1','cpPoplar2','cpPine','cpBirch1'],n:7,sp:100},{x:4180,y:1350,r:140,set:['cpPine','cpPoplar2'],n:3,sp:100},
    {x:2850,y:520,r:180,set:PARK,n:4,sp:110},{x:1560,y:520,r:160,set:PARK,n:3,sp:110}],
  clearings:[[2200,1795,620],[760,930,230],[3960,980,200],[2200,3440,260]],
  land:L,start:[2200,2290],
  warps:[{id:'toS',x:2200,y:3500,to:'cS',at:'toCap',label:'ทุ่งใต้เมืองหลวง'},{id:'toN',x:1525,y:150,to:'cN',at:'toCap',label:'ทุ่งเหนือเมืองหลวง'},
    {id:'toW',x:120,y:1880,to:'cW',at:'toCap',label:'ทุ่งตะวันตก'},{id:'toE',x:4280,y:1800,to:'cE',at:'toCap',label:'ทุ่งตะวันออก'},
    {id:'cata',x:3960,y:990,to:'cata1',at:'up',label:'สุสานใต้เมืองหลวง'},{id:'rift',x:760,y:920,to:'rift1',at:'up',label:'รอยแยกเอเธอร์'}]});
window.VK_MAPS=V;
})();
