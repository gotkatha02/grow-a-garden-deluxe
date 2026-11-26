/* =====================================================================
   Isometric 2.5D maps like Ragnarok 3 (owner 2026-11-26, ISO_MAP_TH.md) — TEST ONLY: no warp leads here.
   isoSnow = the owner's ground picture ② (Frostpine Hollow, maps/iso/iso_floor_v1.webp, 1536×1024) laid over the whole map
   like the world-boss arenas (fieldmap.js groundImg): the plateau, stairs, cliffs and the frozen pond are painted in,
   the walk shapes below follow them (picture px × S). ?map=isoSnow in test mode · ?isok=1.2 tries another size
   (S = map px per picture px; heroes stand 57–64 map px tall).
   ===================================================================== */
(function(){
Object.assign(window.VK_CAT=window.VK_CAT||{},{isoFloor1:{t:'tex',d:'iso',f:'iso_floor_v1'}});
const S=+(new URLSearchParams(location.search).get('isok'))||1.5,W=Math.round(1536*S),H=Math.round(1024*S);
const P=a=>({p:a.map(v=>Math.round(v*S))});
/* picture px: the lower snowfield (path, pond ice), the plateau top, the carved stairs */
const LOW=[0,365,60,372,110,405,200,422,300,460,420,470,500,482,600,497,650,492,770,466,800,388,845,372,850,300,848,215,900,248,1000,246,1100,244,1200,234,1300,250,1400,262,1536,272,
  1536,712,1480,722,1400,740,1340,748,1280,758,1200,795,1110,826,1060,860,1000,890,900,930,790,985,720,1024,0,1024];
const TOP=[0,240,60,200,130,185,200,140,300,92,420,64,500,80,570,102,650,112,720,142,770,190,772,245,700,248,620,255,600,258,500,258,480,295,400,315,300,295,200,265,100,255,0,250];
const STAIRS=[495,250,602,250,772,466,648,496];
window.VK_MAPS=Object.assign(window.VK_MAPS||{},{
isoSnow:{name:'ป่าสนหิมะ Frostpine Hollow (ทดลอง iso)',lv:'4–12',seed:9300,W,H,mood:'sun',theme:'snow',ground:'snow',
  groundImg:{n:'isoFloor1',r:[0,0,W,H]},clean:1,noDetails:1,colorMatch:0,lit:1,noCritters:1,mirror:1,camZoom:.8,camZoomMob:.75,fieldScale:1,keepWarps:1,noAutoTrails:1,noPretty:1,
  walk:[P(LOW),P(TOP),P(STAIRS)],
  start:[Math.round(560*S),Math.round(700*S)],
  warps:[{id:'home',x:Math.round(150*S),y:Math.round(985*S),to:'capT',at:'toS',label:'กลับเมืองหลวง'}]}
});
/* ---------------------------------------------------------------------
   isoField = the KIT route (owner 2026-11-26 'เจนชิ้นส่วนมาเยอะๆแล้วเอามาประกอบเป็นแมพ … จะทำกี่แมพก็ได้'): the same field builder as every
   levelling map (fieldmap.js), but every texture and piece is the generated 2.5D kit (maps/iso-cat.js, tools/iso_art.py):
   ground isoSnow + soft patches of wind-swept snow / thawing grass / rock, a worn path (isoPath through the street painter),
   a frozen pond (isoIce) ringed by snow heaps (cfg.lakeBank), pine forest masses and a forest border, a hunters' camp, a cliff
   wall with a frozen waterfall and a cave, a runestone circle, small composed groups (cfg.vign) on the open snow.
   Pieces are never mirrored (nf), their anchor is the middle of the footprint (ec), forest pines may repeat (fill).
   ?map=isoField in test mode; no warp leads here. W × H are map px as written (_scaled:1 = scaleField leaves it alone).
   --------------------------------------------------------------------- */
const ring=(n,cx,cy,rx,ry,k,a0)=>{const o=[];for(let i=0;i<k;i++){const a=(a0||0)+i/k*6.2832;o.push({n,x:Math.round(cx+Math.cos(a)*rx),y:Math.round(cy+Math.sin(a)*ry)});}return o;};
/* fence lines that really join (owner 2026-11-26 'ของบางอย่างวางไม่สมเหตุสมผล'): corner posts in → isoFenceA pieces on the up-right / down-left
   legs, isoFenceB on the down-right / up-left legs, each leg cut into whole pieces so their end posts land on the corners
   (post feet measured on the pictures: A left (-32.2,16.9) right (31.4,-5.3) · B left (-29.7,-5.9) right (36,17.4)) */
const fence=pts=>{const o=[];for(let i=0;i+1<pts.length;i++){const p=pts[i],q=pts[i+1],L=q[0]<p[0]?q:p,Rt=q[0]<p[0]?p:q,up=Rt[1]<L[1],n=up?'isoFenceA':'isoFenceB',
  k=Math.max(1,Math.round((Rt[0]-L[0])/(up?63.6:65.7))),off=up?[32.2,-16.9]:[29.7,5.9];
  for(let j=0;j<k;j++)o.push({n,x:Math.round(L[0]+(Rt[0]-L[0])*j/k+off[0]),y:Math.round(L[1]+(Rt[1]-L[1])*j/k+off[1])});}return o;};
/* a continuous rock wall: pieces overlap by 16 % of their widths so no gap shows the snow behind */
const WALLW={isoSpire:136.5,isoCliffW:343.5,isoCliffN:194.7,isoIcefall:212.4,isoCave:253,isoMound:200.4};
const wall=(x0,names,ys)=>{const o=[];let x=x0;names.forEach((n,i)=>{if(i)x+=(WALLW[names[i-1]]+WALLW[n])/2*.84;o.push({n,x:Math.round(x),y:ys[i%ys.length]});});return o;};
const PINES=['isoPineL','isoPineM','isoPineClump','isoPineL','isoPineM','isoPineS'];
/* the hunters' camp: a fenced yard on the door side (south-west) of the longhouse — house corner P0, back fence 6 pieces down-left, side fence 5 pieces
   down-right, the front stays open toward the path; fire with a log bench and two stumps as seats, the tent in the yard, shield and axe by the door,
   firewood stacked against the long wall, the sled parked beside it, the watchtower at the camp entrance by the path */
const NOAO=new URLSearchParams(location.search).get('isoao')==='0';
const CLIFF=[[3600,905,1700,190]];   /* the scree at the foot of the cliff wall: the forest is up on the plateau, so no fallen trunks or forest shrubs down here */   /* ?isoao=0 = without the grounding below (to compare) */
const P0=[2178,2330],P1=[P0[0]-6*63.6,P0[1]+6*22.2],P2=[P1[0]+5*65.7,P1[1]+5*23.3];
const CAMP=[
  {n:'isoLonghouse',x:2330,y:2300},{n:'isoShieldAxe',x:2214,y:2352},
  {n:'isoFirewood',x:2405,y:2362},{n:'isoFirewood',x:2457,y:2343},{n:'isoSled',x:2532,y:2354},
  {n:'isoCampfire',x:2160,y:2445},{n:'isoLog',x:2268,y:2452},{n:'isoStump',x:2078,y:2458},{n:'isoStump',x:2150,y:2522},
  {n:'isoTent',x:1968,y:2460},
  /* the watchtower guards the camp entrance beside the path (a tall piece hides whatever stands just north of it: never in front of the fire) */
  {n:'isoWatchtower',x:2640,y:2545},
  ...fence([P0,P1,P2]),
  /* wind-blown snow piled against the outside of the back fence and the corner */
  {n:'isoDrift',x:1940,y:2378},{n:'isoHeap',x:1752,y:2442}];
window.VK_MAPS.isoField={name:'ทุ่งสนน้ำแข็ง Frostpine Field (ทดลอง iso)',lv:'4–12',seed:9310,W:7200,H:5400,mood:'sun',theme:'snow',ground:'isoSnow',snowy:1,
  _scaled:1,_pretty:1,colorMatch:0,baseAO:0,pool:0,lit:1,noDetails:1,camZoom:.8,camZoomMob:.75,
  /* grounding (owner 2026-11-26 'ต้นไม้ดูลอยๆ ของที่วางในแมพก็ลอย'): occlusion pools under every piece + a stronger sun shadow; no butterflies on snow */
  isoAO:NOAO?null:{a:.55,line:.62,col:'40,46,96',tree:.25},sun:NOAO?null:{a:.86},flies:0,
  texScale:{isoSnow:.34,isoSnowWind:.4,isoPath:.22,isoIce:.38,isoRock:.24,isoThaw:.3},
  patches:[{tex:'isoSnowWind',scale:900,thr:.56},{tex:'isoThaw',scale:650,thr:.72,a:.85},
    /* bare rock only where rock is: the scree at the foot of the cliff wall and round the lone spires / mounds */
    {tex:'isoRock',scale:320,thr:.42,near:[[3600,885,1660,125],[6200,4335,270,150],[1150,4785,270,150],[900,1535,300,160],[6300,1185,300,160]]},
    /* the camp yard is trampled */
    {tex:'isoPath',scale:240,thr:.3,soft:.06,a:.9,near:[[2165,2450,335,170]]}],
  snowPath:1,pathTex:'isoPath',trailW:84,noPrints:1,
  border:{set:PINES,band:300},groves:{set:['isoPineL','isoPineM','isoPineS','isoPineClump','isoPineM','isoBirch','isoPineL','isoPineDead'],thr:.69,dens:.8},openTrees:.04,
  /* the forest on the plateau behind the cliff wall (the wall is its edge, nobody walks behind it) */
  woods:[{p:[1700,0,5650,0,5650,560,5300,630,4800,600,4300,612,3800,596,3300,610,2800,600,2300,614,2000,640,1700,610],m:170}],
  /* placement rules (owner 'ของนั้นไม่ควรวางอยู่ตรงนั้น'): nothing scattered over the open snow — props grow at forest edges, fallen branches lie
     only under trees, grass and snowdrops only on thawed ground, everything else comes in composed groups that go only where they make sense */
  open:[],clearClean:1,decorOpen:0,
  edge:['isoSapling','isoBush','isoBerryBush','isoPineS','isoGrass','isoSapling'],edgeN:.045,   /* shrubs right at the forest's edge only (rocks come with the cliffs and the boulder groups) */
  under:['isoSapling','isoBush','isoGrass','isoBerryBush'],
  _decor:['isoSapling','isoBush','isoBerryBush','isoGrass','isoFlowerWhite'],
  meadow:['isoGrass','isoFlowerWhite','isoGrass','isoFlowerWhite'],meadowPatch:'isoThaw',
  treeLitter:{set:['isoBranch'],p:.12,v:[.55,.8]},
  decals:[],grass:[],
  lakes:[{x:5300,y:2900,rx:700,ry:430}],lakeTex:'isoIce',
  lakeBank:{set:['isoHeap','isoBankA','isoBankB','isoDrift','isoHeapIce','isoHeapRock','isoHeap','isoRocks'],sp:170,skip:.35},
  vign:{n:44,sp:540,strict:1,sets:[
    /* in the open: a little copse, a boulder with snow blown against it, a lone birch, a wind drift */
    {main:['isoPineM','isoPineS','isoPineL'],set:['isoSapling','isoBush','isoPineS','isoBerryBush'],k:[2,4],r:100,open:.12},
    {main:['isoBoulder','isoHeapRock'],set:['isoRocks','isoDrift','isoGrass'],k:[2,3],r:95,open:.06},
    {main:['isoBirch'],set:['isoStump','isoGrass','isoBush'],k:[2,3],r:90,open:.1},
    {main:['isoDrift'],set:['isoHeap','isoDrift'],k:[1,2],r:120,open:.14},
    /* along the forest's edge: a fallen trunk with its stump and branches, a dead snag, berry bushes */
    {main:['isoLog'],set:['isoStump','isoBranch','isoBush'],k:[2,3],r:90,forest:[.025,.16],not:CLIFF},
    {main:['isoPineDead'],set:['isoLog','isoBranch','isoStump'],k:[2,3],r:90,forest:[.025,.16],not:CLIFF},
    {main:['isoBerryBush'],set:['isoBush','isoSapling','isoGrass'],k:[2,3],r:80,forest:[.025,.16],not:CLIFF},
    /* ice grows only by the ice: the frozen pond, the frozen waterfall, the cave */
    {main:['isoIceCrystal'],set:['isoHeapIce','isoFlowerIce','isoFlowerIce','isoRocks'],k:[2,4],r:90,zone:[[5300,2900,880,570],[3037,910,300,130],[3973,920,240,120]]},
    /* rock falls from the cliffs and lies round the spires */
    {main:['isoBoulder','isoRocks','isoHeapRock'],set:['isoRocks','isoDrift','isoHeap'],k:[2,3],r:100,zone:[[3600,905,1640,150],[6200,4335,340,200],[1150,4785,340,200],[900,1535,360,210],[6300,1185,360,210]]},
    /* melt water stands only on thawed ground, with stepping stones across */
    {main:['isoPuddle'],set:['isoStepStones','isoGrass','isoFlowerWhite'],k:[1,3],r:90,patch:'isoThaw'}]},
  trails:[[[3600,5220],[3500,4500],[3150,3700],[2900,3000],[3300,2400],[3900,1900],[3800,1300],[3900,1080],[3952,885]],
          [[2900,3000],[2200,3300],[1500,3550]],
          [[3400,2380],[4100,2450],[4520,2650]],
          /* from the camp yard's open front to the main path */
          [[2316,2513],[2520,2600],[2760,2740],[2967,2900]]],
  land:[
    ...CAMP,
    /* the cliff wall closing the valley in the north, with the frozen waterfall and the cave in it */
    ...wall(2150,['isoSpire','isoCliffW','isoCliffN','isoCliffW','isoIcefall','isoCliffW','isoCliffN','isoCliffW','isoCave','isoCliffW','isoCliffN','isoCliffW','isoMound','isoSpire'],
      [800,790,770,795,815,795,775,800,820,795,770,800,815,790]),
    /* runestone circle + runestones that mark the path junctions */
    ...ring('isoRunestone',1350,3650,230,140,6,.3),{n:'isoIceCrystal',x:1350,y:3650},
    {n:'isoRunestone',x:2820,y:3140},{n:'isoRunestone',x:3560,y:2290},
    /* lone landmarks */
    {n:'isoSpire',x:6200,y:4300},{n:'isoMound',x:900,y:1500},{n:'isoMound',x:6300,y:1150},{n:'isoSpire',x:1150,y:4750}],
  clearings:[[2200,2440,390],[4560,2700,240],[1350,3650,330],[3037,960,200],[3960,985,220],[3600,4820,380]],
  safe:[[2200,2440]],
  start:[3600,4950],
  warps:[{id:'home',x:3600,y:5220,to:'capT',at:'toS',label:'กลับเมืองหลวง'}]};
window.VK_MONS=window.VK_MONS||{};
if(!window.VK_MONS.isoSnow&&window.VK_MONS.vikF2)window.VK_MONS.isoSnow=window.VK_MONS.vikF2.slice();
if(!window.VK_MONS.isoField&&window.VK_MONS.vikF2)window.VK_MONS.isoField=window.VK_MONS.vikF2.slice();
})();
