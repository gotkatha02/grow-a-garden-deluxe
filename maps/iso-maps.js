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
const runR=(n,x,y,k,dx,dy)=>{const o=[];for(let i=0;i<k;i++)o.push({n,x:x+i*dx,y:y+i*dy});return o;};
const ring=(n,cx,cy,rx,ry,k,a0)=>{const o=[];for(let i=0;i<k;i++){const a=(a0||0)+i/k*6.2832;o.push({n,x:Math.round(cx+Math.cos(a)*rx),y:Math.round(cy+Math.sin(a)*ry)});}return o;};
const PINES=['isoPineL','isoPineM','isoPineClump','isoPineL','isoPineM','isoPineS'];
window.VK_MAPS.isoField={name:'ทุ่งสนน้ำแข็ง Frostpine Field (ทดลอง iso)',lv:'4–12',seed:9310,W:7200,H:5400,mood:'sun',theme:'snow',ground:'isoSnow',snowy:1,
  _scaled:1,_pretty:1,colorMatch:0,baseAO:0,pool:0,lit:1,noDetails:1,camZoom:.8,camZoomMob:.75,
  texScale:{isoSnow:.34,isoSnowWind:.4,isoPath:.22,isoIce:.38,isoRock:.24,isoThaw:.3},
  patches:[{tex:'isoSnowWind',scale:900,thr:.56},{tex:'isoThaw',scale:650,thr:.72,a:.85},{tex:'isoRock',scale:480,thr:.74}],
  snowPath:1,pathTex:'isoPath',trailW:84,noPrints:1,
  border:{set:PINES,band:300},groves:{set:['isoPineL','isoPineM','isoPineS','isoPineClump','isoPineM','isoBirch','isoPineL','isoPineDead'],thr:.69,dens:.8},openTrees:.04,
  open:['isoRocks','isoBoulder','isoStump','isoBush','isoBerryBush','isoGrass','isoHeap','isoDrift'],
  edge:['isoSapling','isoBush','isoBerryBush','isoBoulder','isoPineS','isoRocks','isoGrass'],
  under:['isoSapling','isoBush','isoGrass','isoBerryBush'],
  _decor:['isoSapling','isoBush','isoBerryBush','isoGrass','isoFlowerWhite','isoFlowerIce'],
  meadow:['isoFlowerWhite','isoFlowerIce','isoGrass','isoFlowerWhite'],
  decals:['isoBranch','isoBranch','isoStepStones','isoPuddle'],decalDens:.35,grass:[],
  lakes:[{x:5300,y:2900,rx:700,ry:430}],lakeTex:'isoIce',
  lakeBank:{set:['isoHeap','isoBankA','isoBankB','isoDrift','isoHeapIce','isoHeapRock','isoHeap','isoRocks'],sp:170,skip:.35},
  vign:{n:70,sp:520,sets:[
    {main:['isoBoulder'],set:['isoRocks','isoGrass','isoBush'],k:[2,4],r:90},
    {main:['isoLog'],set:['isoBranch','isoStump','isoGrass'],k:[2,3],r:90},
    {main:['isoPineM','isoPineS'],set:['isoSapling','isoBush','isoBerryBush','isoGrass'],k:[2,4],r:100},
    {main:['isoIceCrystal'],set:['isoHeapIce','isoFlowerIce'],k:[2,3],r:90},
    {main:['isoHeap','isoDrift'],set:['isoRocks','isoGrass'],k:[1,3],r:110},
    {main:['isoBerryBush'],set:['isoBush','isoFlowerWhite','isoGrass'],k:[2,4],r:80},
    {main:['isoBirch'],set:['isoStump','isoGrass','isoFlowerWhite'],k:[2,3],r:90},
    {main:['isoRunestone'],set:['isoFlowerIce','isoGrass','isoRocks'],k:[2,3],r:80},
    {main:['isoPuddle'],set:['isoStepStones','isoGrass'],k:[1,2],r:80}]},
  trails:[[[3600,5220],[3500,4500],[3150,3700],[2900,3000],[3300,2400],[3900,1900],[3800,1300]],
          [[2900,3000],[2200,3300],[1500,3550]],
          [[3400,2380],[4100,2450],[4520,2650]]],
  land:[
    /* hunters' camp */
    {n:'isoLonghouse',x:2300,y:2250},{n:'isoWatchtower',x:2800,y:2080},{n:'isoTent',x:1980,y:2600},{n:'isoCampfire',x:2430,y:2600},
    {n:'isoSled',x:2760,y:2560},{n:'isoFirewood',x:2560,y:2300},{n:'isoShieldAxe',x:2620,y:2720},
    ...runR('isoFenceB',1790,2360,3,56,23),...runR('isoFenceA',2930,2740,3,56,-23),
    /* the cliff wall in the north, a frozen waterfall and a cave in it */
    {n:'isoCliffW',x:2350,y:800},{n:'isoCliffN',x:2660,y:760},{n:'isoSpire',x:2900,y:820},{n:'isoCliffW',x:3200,y:790},{n:'isoIcefall',x:3530,y:830},
    {n:'isoCliffW',x:3850,y:800},{n:'isoCave',x:4180,y:840},{n:'isoCliffN',x:4470,y:780},{n:'isoCliffW',x:4760,y:820},{n:'isoSpire',x:5020,y:770},{n:'isoMound',x:5280,y:830},
    /* runestone circle */
    ...ring('isoRunestone',1350,3650,230,140,6,.3),{n:'isoIceCrystal',x:1350,y:3650},
    /* lone landmarks */
    {n:'isoSpire',x:6200,y:4300},{n:'isoMound',x:900,y:1500},{n:'isoMound',x:6300,y:1150},{n:'isoSpire',x:1150,y:4750},{n:'isoIceCrystal',x:6150,y:3550}],
  clearings:[[2400,2420,560],[4560,2700,280],[1350,3650,330],[3700,1150,420],[3600,4820,380],[6150,3600,200]],
  start:[3600,4950],
  warps:[{id:'home',x:3600,y:5220,to:'capT',at:'toS',label:'กลับเมืองหลวง'}]};
window.VK_MONS=window.VK_MONS||{};
if(!window.VK_MONS.isoSnow&&window.VK_MONS.vikF2)window.VK_MONS.isoSnow=window.VK_MONS.vikF2.slice();
if(!window.VK_MONS.isoField&&window.VK_MONS.vikF2)window.VK_MONS.isoField=window.VK_MONS.vikF2.slice();
})();
