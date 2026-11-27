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
/* ---------------------------------------------------------------------
   isoTown = the iso Viking town (owner 2026-11-27 07:24: the town kit B1–B3 · P1–P3 · T7 cobbles · T8 flagstones, ISO_MAP_TH.md §14–15).
   TEST ONLY (?map=isoTown in test mode, or the ⚙ map picker); the real Frostheim and its services are untouched.
   The world is turned 45°: street A runs from the south-west gate up to the Great Hall (north-east), street B from the chief's
   house (north-west) down to the south-east gate; they cross on the flagstone square. Only the two walls facing lower left (SW) and
   lower right (SE) of a building are ever seen and iso pieces are never mirrored, so every house stands where its door faces a street:
   a door on the SE wall looks at a SW–NE street on its lower right (the north-west side of street A), a door on the SW wall looks at a
   NW–SE street on its lower left (the north-east side of street B); the hall and the chief's house close the two streets' ends.
   DOOR = where each picture's door step is, in map px from the piece's anchor (read on the pictures); a short cobble lane runs from
   every door to its street. No monsters. Every house record carries door (the door step) and out (where you stand when you come back
   out: the door step moved 50 px toward the street), both as offsets from the anchor; a house with room:'<room id>' opens that room
   (npcs.js linked doors). Owner 2026-11-27 'บ้านช่างตีเหล้กให้ลิ้งเข้าไปที่ห้องเดิมที่ทำไว้': the smithy opens Frostheim's own craft
   room (craft_vik, บียอร์น) and its exit brings you back to this door; the town's other services stay in frostheim.
   --------------------------------------------------------------------- */
{
const TC=[2000,1650],HW=60;   /* the crossing (square centre) · street half width */
const A=a=>[TC[0]+a,TC[1]-a*.62],B=b=>[TC[0]+b,TC[1]+b*.62];
const NA=[-.527,-.85],NB=[.527,-.85],UA=[.85,-.527],UB=[.85,.527];   /* NW side of street A · NE side of street B · along A · along B */
const add=(p,v,k)=>[p[0]+v[0]*k,p[1]+v[1]*k];
const DOOR={isoGreatHall:[-125,88],isoChiefHouse:[90,50],isoSmithy:[-111,36],isoTavern:[-32,37],isoTradePost:[58,24],isoHealer:[57,6],
  isoStable:[-82,37],isoStorehouse:[63,9],isoHomeA:[-53,19],isoHomeB:[66,28],isoHomeC:[74,28],isoHomeD:[-64,19],isoLonghouse:[-55,43]};
const HOUSES=[],LANES=[],R2=v=>[Math.round(v[0]),Math.round(v[1])];
const ST={kc:'#7d7486',shade:'rgba(255,255,255,0)'};
/* a house whose door step lands on the edge of a street (half width hw) at street point p, on the side n; a short cobble lane joins them */
const house=(n,p,side,gap,hw,more)=>{const D=add(p,side,(hw??HW)+(gap??10)),o=DOOR[n];
  HOUSES.push(Object.assign({n,x:Math.round(D[0]-o[0]),y:Math.round(D[1]-o[1]),_dr:R2(D),door:o.slice(),out:R2([o[0]-side[0]*50,o[1]-side[1]*50])},more||{}));
  LANES.push({pts:[R2(D),R2(p)],w:56,tex:'isoCobble',...ST});return D;};
/* the Great Hall closes street A (its stairs at A's end), the chief's house closes street B (its door at B's end) */
const HALL=A(850),CHIEF=B(-1000);
HOUSES.push({n:'isoGreatHall',x:HALL[0]+125,y:HALL[1]-88},{n:'isoChiefHouse',x:CHIEF[0]-90,y:CHIEF[1]-50});
/* west quarter, front row: the north-west side of street A's south-west arm, doors on the SE walls */
house('isoHomeC',A(-1250),NA);house('isoHomeB',A(-860),NA);house('isoHealer',A(-540),NA);house('isoTradePost',A(-230),NA,40);
/* west quarter, back row on an alley 360 px further north-west (alleys are narrower: half width 40) */
const A2=a=>add(A(a),NA,360);
house('isoHomeB',A2(-1080),NA,8,40);house('isoStorehouse',A2(-700),NA,8,40);house('isoHomeC',A2(-330),NA,8,40);
/* north quarter: corner lots — one on street A's north-east arm (SE door), two on street B's north-west arm (SW doors) */
house('isoHomeB',A(420),NA);house('isoHomeA',B(-430),NB,20);house('isoHomeD',B(-730),NB);
/* north quarter, back rows: alleys 360 px behind street A's north-east arm (SE door) and street B's north-west arm (SW door) */
const A3=a=>add(A(a),NA,360),B3=b=>add(B(b),NB,360);
house('isoHomeC',A3(300),NA,8,40);house('isoLonghouse',B3(-700),NB,8,40);
/* east quarter, front row: the north-east side of street B's south-east arm, doors on the SW walls */
house('isoTavern',B(420),NB,24);house('isoSmithy',B(800),NB,null,null,{room:'craft_vik',signH:150});house('isoHomeA',B(1170),NB);
/* east quarter, back row on an alley 360 px further north-east */
const B2=b=>add(B(b),NB,360);
house('isoHomeD',B2(560),NB,8,40);house('isoLonghouse',B2(900),NB,8,40);
/* south quarter: the stable on a lane that leaves street A south-eastward (its barn doors face the lane), the training yard beyond */
const L0=A(-760),L=t=>add(L0,UB,t);
house('isoStable',L(330),NB,8,44);
const ALLEYS=[{pts:[R2(A2(-1300)),R2(A2(-700)),R2(A2(-150)),R2(add(A(-60),NA,170))],w:84,tex:'isoCobble',...ST},
  {pts:[R2(add(B(300),NB,190)),R2(B2(450)),R2(B2(800)),R2(B2(1080))],w:84,tex:'isoCobble',...ST},
  {pts:[R2(L0),R2(L(330)),R2(L(470))],w:92,tex:'isoCobble',...ST},
  {pts:[R2(add(A(150),NA,170)),R2(A3(180)),R2(A3(420))],w:84,tex:'isoCobble',...ST},
  {pts:[R2(add(B(-560),NB,190)),R2(B3(-620)),R2(B3(-820))],w:84,tex:'isoCobble',...ST}];
window.VK_MAPS.isoTown={name:'ฟรอสต์เฮล์ม Frostheim (ทดลอง iso)',lv:'เมือง',seed:9320,W:4000,H:3000,mood:'town',theme:'snow',ground:'isoSnow',snowy:1,mons:false,
  _scaled:1,_pretty:1,colorMatch:0,baseAO:0,pool:0,lit:1,noDetails:1,camZoom:.8,camZoomMob:.75,keepWarps:1,noAutoTrails:1,
  isoAO:NOAO?null:{a:.55,line:.62,col:'40,46,96',tree:.25},sun:NOAO?null:{a:.86},flies:0,noPrints:1,
  texScale:{isoSnow:.34,isoSnowWind:.4,isoPath:.22,isoCobble:.17,isoFlag:.23},roadWear:.74,
  patches:[{tex:'isoSnowWind',scale:900,thr:.6},
    /* trampled snow round the square, in front of the hall and in the yards */
    {tex:'isoPath',scale:260,thr:.36,soft:.06,a:.85,near:[[TC[0],TC[1],620,380],[HALL[0]-40,HALL[1]+40,260,150],[L(500)[0],L(500)[1]+40,330,170]]}],
  border:{set:PINES,band:260,calm:1},openTrees:0,open:[],clearClean:1,decorOpen:0,edge:['isoPineS','isoSapling','isoBush'],edgeN:.03,
  _decor:['isoSapling','isoBush','isoGrass'],decals:[],grass:[],trails:[],
  roads:[{pts:[A(-1600),A(-1100),A(-600),A(-100),A(400),HALL],w:124,tex:'isoCobble',...ST},
    {pts:[CHIEF,B(-600),B(-100),B(400),B(900),B(1420)],w:112,tex:'isoCobble',...ST},...ALLEYS,...LANES],
  squares:[{x:TC[0],y:TC[1],rx:440,ry:280,tex:'isoFlag',...ST}],
  clusters:[{x:1950,y:560,r:300,set:PINES,n:8,sp:100},{x:3600,y:1500,r:220,set:PINES,n:5,sp:100},{x:500,y:1500,r:230,set:PINES,n:5,sp:100},
    {x:1550,y:2620,r:230,set:PINES,n:5,sp:100},{x:3050,y:2650,r:230,set:PINES,n:5,sp:100},
    {x:3700,y:850,r:220,set:PINES,n:5,sp:100},{x:1050,y:600,r:200,set:PINES,n:4,sp:100},{x:450,y:2250,r:200,set:PINES,n:4,sp:100}],
  land:[...HOUSES,
    /* the square: the howling wolf in the middle, the well and the rune shrine, two market stalls on the south side, the notice board by
       the trade post, benches, iron fire baskets where the streets come in */
    {n:'isoWolfStatue',x:TC[0],y:TC[1]+10},{n:'isoWell',x:TC[0]-260,y:TC[1]+30},{n:'isoShrine',x:TC[0]+30,y:TC[1]-205},
    {n:'isoStallFur',x:TC[0]-150,y:TC[1]+215},{n:'isoStallFish',x:TC[0]+120,y:TC[1]+225},{n:'isoNotice',x:TC[0]-330,y:TC[1]-120},
    {n:'isoBench',x:TC[0]+255,y:TC[1]+60},{n:'isoBench',x:TC[0]-215,y:TC[1]+165},
    {n:'isoBrazier',x:TC[0]-430,y:TC[1]+120},{n:'isoBrazier',x:TC[0]+435,y:TC[1]-115},{n:'isoBrazier',x:TC[0]-300,y:TC[1]-250},{n:'isoBrazier',x:TC[0]+320,y:TC[1]+245},
    /* the hall: banners at the foot of its stairs · the chief's house: a banner by the door */
    {n:'isoBannerWolf',x:HALL[0]-95,y:HALL[1]+30},{n:'isoBannerAxe',x:HALL[0]+75,y:HALL[1]-35},{n:'isoBannerWolf',x:CHIEF[0]-70,y:CHIEF[1]+70},
    /* goods by the trade post, barrels at the tavern, firewood at the smithy and the homes, hay and a cart at the stable */
    {n:'isoCrates',x:A(-230)[0]-260,y:A(-230)[1]-25},{n:'isoCart',x:A(-230)[0]-70,y:A(-230)[1]+110},
    {n:'isoBarrels',x:B(420)[0]-160,y:B(420)[1]-15},{n:'isoBench',x:B(420)[0]+150,y:B(420)[1]-50},
    {n:'isoFirewood',x:B(800)[0]+215,y:B(800)[1]-125},{n:'isoBarrels',x:B(1170)[0]+170,y:B(1170)[1]-110},
    {n:'isoHay',x:L(330)[0]+260,y:L(330)[1]-40},{n:'isoHay',x:L(330)[0]+330,y:L(330)[1]},{n:'isoCart',x:L(520)[0]+40,y:L(520)[1]-70},
    {n:'isoFirewood',x:A(-1250)[0]+130,y:A(-1250)[1]-175},{n:'isoBarrels',x:A(-860)[0]-150,y:A(-860)[1]-40},{n:'isoCrates',x:B(-430)[0]+175,y:B(-430)[1]-50},
    /* the training yard south of the stable: dummies, fish racks, hay, a fence along its far side */
    {n:'isoDummy',x:1880,y:2240},{n:'isoDummy',x:1990,y:2300},{n:'isoDummy',x:1765,y:2300},
    {n:'isoFishRack',x:2450,y:2270},{n:'isoFishRack',x:2570,y:2330},{n:'isoBarrels',x:2690,y:2260},
    ...fence([[1560,2470],[1920,2600],[2280,2470]]),
    /* lamp posts along both streets, alternating sides; signposts at the gates */
    ...[-1350,-950,-650].map(a=>{const p=add(A(a),NA,-95);return {n:'isoLampPost',x:Math.round(p[0]),y:Math.round(p[1])};}),
    ...[620,250].map(a=>{const p=add(A(a),NA,-95);return {n:'isoLampPost',x:Math.round(p[0]),y:Math.round(p[1])};}),
    ...[-800,-550,650,1000].map(b=>{const p=add(B(b),NB,-95);return {n:'isoLampPost',x:Math.round(p[0]),y:Math.round(p[1])};}),
    {n:'isoSignpost',x:A(-1450)[0]+95,y:A(-1450)[1]+70},{n:'isoSignpost',x:B(1300)[0]-85,y:B(1300)[1]+80},
    /* watchtowers guard the two gates */
    {n:'isoWatchtower',x:A(-1560)[0]+200,y:A(-1560)[1]+120},{n:'isoWatchtower',x:B(1380)[0]+130,y:B(1380)[1]-160},
    /* snow blown against the town's edge */
    {n:'isoDrift',x:850,y:2700},{n:'isoHeap',x:3250,y:2750},{n:'isoDrift',x:3650,y:1150},{n:'isoHeap',x:420,y:1150}],
  clearings:[[TC[0],TC[1],520]],
  safe:[[TC[0],TC[1]]],
  start:A(-1350),
  warps:[{id:'home',x:A(-1600)[0],y:A(-1600)[1],to:'capT',at:'toS',label:'กลับเมืองหลวง'},
    {id:'field',x:B(1420)[0],y:B(1420)[1],to:'isoField',at:'home',label:'ทุ่งสนน้ำแข็ง (iso)'}]};
}
window.VK_MONS=window.VK_MONS||{};
if(!window.VK_MONS.isoSnow&&window.VK_MONS.vikF2)window.VK_MONS.isoSnow=window.VK_MONS.vikF2.slice();
if(!window.VK_MONS.isoField&&window.VK_MONS.vikF2)window.VK_MONS.isoField=window.VK_MONS.vikF2.slice();
})();
