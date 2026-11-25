/* =====================================================================
   Sea zone (ทะเลห้าฝั่ง, Lv 60–70 expansion) map configs, read by createFieldHost (maps/fieldmap.js).
   Pieces live in maps/sea/ and are listed in maps/sea-cat.js (entries with d:'sea'); palms are borrowed from the Aztec / Egypt sets.
   theme 'sea' (fieldmap.js): golden sand, wet-sand band, foam lace, turquoise shallows → deep blue, shells on the waterline,
   crabs + seagulls, footprints in the sand. mood 'beach' = warm sun, cool sea light.
   TEST ONLY for now (owner has not opened the zone): no warp leads here; enter with ?map=seaF1 in test mode.
   The only warp out goes back to the capital. Levels are written directly (60–62), not squeezed by level-zones.js.
   ===================================================================== */
(function(){
const PALM=['egPalmLean','egPalmTwin','egPalmCluster','egPalmDate1','azPalmTall','azPalmShort','egFanPalm','azBanana','azBushTree'];
const PALM_OPEN=['egPalmLean','azPalmSmall','egPalmSapling','azPalmTall','egPalmShort','azPalmFruit','egPalmLean'];
const ROOTS=['ocRootStump','ocRootFingers','ocRootCrystal','ocRootFingers','ocRootStump'];
const SEAO=['ocStack','ocIslet','ocRockArch','ocBuoy','ocFloatBarrel','ocKelpRaft','ocRootArchW','ocStepStones','ocTotemLog'];   // ocWaveCurl looked like a sticker on the water: the code foam does the waves
const S={theme:'sea',ground:'ocSand',mood:'beach',trailKind:'trample',dirtTex:'ocWetSand',lakeTex:'ocLagoon',seaTex:'ocDeep',streamTex:'ocLagoon',cobbleTex:'ocShellPave'};
const M=o=>Object.assign({},S,o);
const SEA={
/* ---------------- Field 1 · Goldshell Beach ---------------- */
seaF1:M({name:'หาดเปลือกหอยทอง Goldshell Beach',lv:'60–62',seed:811,W:4800,H:3600,
  /* sand mottled with paler and deeper sand; grass only far from the water, fading in (patch.inland = map px from the waterline) */
  patches:[{tex:'grBeach',scale:640,thr:.55,rim:false,a:.45,soft:.06},{tex:'egSand',scale:900,thr:.6,rim:false,a:.3,soft:.08},{tex:'azGrass',scale:520,thr:.58,rim:false,a:.7,soft:.07,inland:[2300,3700]}],
  /* sea.inland: open beach by the water, palms thicken into a palm forest further in */
  sea:{side:'S',d:1150,amp:380,inland:[450,1700,.05],reach:820},seaSet:SEAO,
  /* small composed groups across the beach (fieldmap.js cfg.vign): lone palms, dune grass, driftwood, rocks, root tips, tide pools */
  vign:{n:70,sp:560,inland:[80,2000],sets:[
    {main:['egPalmLean','egPalmLean','azPalmTall','egPalmTwin'],set:['grBeachGrass','azTallGrass','grSeaLav'],k:[1,2],r:70,inland:[260,2000]},
    {set:['grBeachGrass','grSeaLav','azTallGrass','grDryGrass','egDryGrass'],k:[2,4],r:80,gap:200},
    {main:['ocDriftLog','ocDriftBranch'],set:['ocShells','ocStarfish','ocConch','grBeachGrass'],k:[2,3],r:80,inland:[60,900]},
    {main:['ocBoulder','egRockSand1','egRockSand2'],set:['ocPebbles','ocStarfish','grBeachGrass','ocShells'],k:[2,3],r:85},
    {main:['ocRootStump','ocRootFingers','ocRootCrystal'],set:['ocRootFingers','ocRootCrystal','grBeachGrass'],k:[2,3],r:80,gap:300},
    {main:['ocRockPool'],set:['ocStarfish','ocShells','ocPebbles'],k:[1,3],r:95,inland:[90,700],gap:900},
    {main:['azHibRed','azHibYel','azHeliconia'],set:['azFern','grBeachGrass','azHibYel','azHibRed'],k:[2,3],r:70,inland:[900,2000]}]},
  border:{set:[...PALM,'egRockSand1','egRockSand2']},groves:{set:[...PALM,...PALM,'egRockSand1'],thr:.6,dens:.8},open:PALM_OPEN,edge:['azPalmSmall','egPalmSapling','azSapling'],
  trails:[[[420,880],[860,1350],[1250,1800],[2050,2000],[2900,1880],[3700,1650],[4420,1300]],[[2050,2000],[2250,1450],[2500,900],[2700,420]]],
  land:[{n:'ocWreckGrk',x:3350,y:2400,coast:-70},{n:'ocWhaleBones',x:2000,y:1250,r:260},
    {n:'ocRootArch',x:2750,y:1480,r:200},{n:'ocRootArch',x:4000,y:900,r:200},{n:'ocRootArch',x:700,y:1650,r:200},
    /* fishermen's camp by the water */
    {n:'ocCookFire',x:1250,y:2300,coast:230},{n:'ocNetPoles',x:1450,y:2300,coast:150},{n:'ocRowboat',x:1060,y:2300,coast:-10},{n:'ocCrabTrap',x:1340,y:2300,coast:330},
    {n:'ocFloats',x:1560,y:2300,coast:260},{n:'ocBarrel',x:1160,y:2300,coast:360},{n:'ocDriftLog',x:1700,y:2300,coast:120},{n:'ocSandcastle',x:1850,y:2300,coast:240},
    {n:'ocRockPool',x:2400,y:2300,coast:110},{n:'ocRockPool',x:4300,y:2300,coast:120},{n:'ocRootLog',x:3000,y:2300,coast:180},
    {n:'ocSignpost',x:560,y:1000}],
  clusters:[{x:2750,y:1480,r:150,set:ROOTS,n:5,sp:110},{x:4000,y:900,r:140,set:ROOTS,n:4,sp:110},{x:700,y:1650,r:140,set:ROOTS,n:4,sp:110},
    {x:1000,y:1350,r:240,set:PALM,n:6,sp:130},{x:3300,y:1500,r:220,set:PALM,n:5,sp:130}],
  clearings:[[2000,1250,300],[2750,1480,240],[4000,900,230],[700,1650,230]],
  start:[1300,1900],
  warps:[{id:'toCap',x:420,y:860,to:'capT',at:'toS',label:'กลับเมืองหลวง'}]})
};
window.VK_MAPS=Object.assign(window.VK_MAPS||{},SEA);
const T=(n,th,a,b,sc,tint,role)=>({base:'frostling',name:n,th,lv:[a,b],sc,tint,role});
window.VK_MONS=Object.assign(window.VK_MONS||{},{
  seaF1:[T('Goldshell Hermit Crab','ปูเสฉวนเปลือกทอง',60,61,.8,'#e8b040','critter'),T('Tidepool Starfish','ปลาดาวแอ่งน้ำลง',60,62,.8,'#f08040','normal'),
    T('Thief Gull','นกนางนวลจอมขโมย',60,62,.9,'#f0f0f0','swift'),T('Coconut Crab Brute','ปูมะพร้าวยักษ์',61,62,1.1,'#7a4aa0','brute')]});
})();
