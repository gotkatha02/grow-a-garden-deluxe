/* =====================================================================
   AETHERFALL — CRAFT HALLS (โรงคราฟ) : one per start town, Ragnarok-style.
   Town → walk onto the craft building's door → small indoor room → click the craft NPC → Smith window
   (craft · trait · refine · move refine · sockets · merge orbs). Walk onto the mat at the bottom to leave.

   ART (drop files in, no code change needed — missing files fall back to the placeholder art):
     assets/npc/craft_<town>_front.webp   the craft NPC standing straight (default pose, transparent background)
     assets/npc/craft_<town>_side.webp    3/4 pose looking to screen-left — shown while talking, mirrored when the hero is on the right
     assets/rooms/craft_<town>.webp|png   (optional) room interior drawn over the whole room (ROOM_W × ROOM_H = 1200×820)
     maps/<dir>/<xx>CraftHall.webp        the building outside (catalog sizes in maps/craft-halls.js)
     <town> = vik (Frostheim) · azt (Xochitlan) · grk (Ionia) · egy (Kemet) · jpn (Hakusen)
   When a room image is used, the walk area / furniture blockers / NPC spot below still apply — tune them in CRAFT[...].room.
   Loaded after items.js.
   ===================================================================== */
(function(){
if(typeof MAPDEF==='undefined'||!window.AFItems)return;
const ROOM_W=1200,ROOM_H=820,WALL_Y=250;
/* per town: map id, building used as the craft hall, NPC name, placeholder colours */
const CRAFT={
  vik:{map:'frostheim',bld:'vkCraftHall',npc:'บียอร์น',   h:88,   hello:'เหล็กดีต้องตีตอนร้อน! อยากได้อะไรล่ะ?',
       th:{wall:'#5d6f84',wall2:'#4a5a6e',floor:'#8b6a4b',floor2:'#7b5c3f',trim:'#d6ecfa',rug:'#3f6f9a',glow:'255,140,60'},tint:'hue-rotate(185deg) saturate(.75) brightness(1.02)'},
  azt:{map:'aztT',     bld:'azCraftHall',npc:'ซิตลาลี',  h:94,    hello:'หยกกับออบซิเดียน… จะคราฟอะไรดี?',
       th:{wall:'#9a6a3e',wall2:'#7f5532',floor:'#b98a55',floor2:'#a87a48',trim:'#3fae78',rug:'#c0463a',glow:'255,150,50'},tint:'hue-rotate(60deg) saturate(.9)'},
  grk:{map:'grkT',     bld:'grCraftHall',npc:'เฮฟิสตอส', h:100,   hello:'ทองแดงดีจากโอลิมปัส! มาคราฟกัน',
       th:{wall:'#e4dccb',wall2:'#cfc5b0',floor:'#c9b48e',floor2:'#bba57e',trim:'#4a7fc0',rug:'#2f5f9e',glow:'255,160,70'},tint:'sepia(.35) saturate(.9) brightness(1.05)'},
  egy:{map:'egyT',     bld:'egCraftHall',npc:'เนเฟอร์',  h:104,      hello:'ทองแห่งดวงอาทิตย์ รอผู้กล้าอยู่',
       th:{wall:'#d9b77a',wall2:'#c29f62',floor:'#caa86c',floor2:'#b8975c',trim:'#2f7fae',rug:'#b8402e',glow:'255,170,60'},tint:'sepia(.6) hue-rotate(-15deg) saturate(1.2)'},
  jpn:{map:'jpnT',     bld:'jpCraftHall',npc:'มาซามุเนะ', h:96,ownAnvil:1,  hello:'ดาบที่ดีเริ่มจากใจที่นิ่ง… จะทำอะไรดี?',
       th:{wall:'#7a5a45',wall2:'#5f4535',floor:'#c7a978',floor2:'#b89a6a',trim:'#c0394a',rug:'#8c2f3a',glow:'255,130,70'},tint:'hue-rotate(300deg) saturate(.85)'}};
/* room layout (map pixels, feet space). Same layout in every town by default; override per town with CRAFT[k].room */
const LAYOUT={
  walk:[80,WALL_Y+24,ROOM_W-80,ROOM_H-36],
  npc:{x:ROOM_W/2,y:392},
  exit:{x:ROOM_W/2,y:ROOM_H-62,r:70},start:{x:ROOM_W/2,y:ROOM_H-170},
  solids:[[170,WALL_Y-20,430,WALL_Y+46],[ROOM_W/2-158,404,ROOM_W/2-62,446],[790,318,1030,372],[110,660,290,744],[960,672,1100,744],[ROOM_W/2-30,366,ROOM_W/2+30,400]]};
/* ---- rooms drawn from real art (assets/rooms/craft_<town>.webp): walkable floor polygon, blockers, and FOREGROUND LAYERS —
   pieces clipped out of the same picture and drawn again over characters standing behind them (no extra files needed).
   fg depth: a number = the piece's base line y; line:[[x,y],[x,y]] = a slanted wall, compared at the hero's x; 'front' = always on top.
   All numbers are pixels of the room picture. */
const ART={
  vik:{W:1536,H:1024,charScale:4.2,npcH:270,   // real-life scale: the anvil comes up to the hero's waist
       charFilter:'sepia(.16) saturate(1.08) brightness(.97)',
    fires:[{cx:672,top:246,base:308,rx:50}],lamps:[[265,232,55],[1105,372,50]],
    walk:[[222,890],[222,705],[228,700],[228,578],[290,548],[285,532],[370,532],[373,418],[535,412],[548,400],[835,397],[840,362],[985,360],[985,497],[878,628],[893,650],[916,632],
          [1015,507],[1040,527],[1335,597],[1340,690],[1305,714],[1300,770],[1215,840],[975,840],[975,795],[655,795],[655,840],[318,840],[318,890]],
    solids:[[712,438,828,494],[846,438,910,490],[535,450,625,500]],
    npc:{x:580,y:478},start:{x:300,y:700},exit:{x:268,y:868,r:30},
    fg:[{n:'front',depth:'front',poly:[[0,1024],[0,620],[80,640],[138,684],[188,686],[338,735],[386,746],[386,838],[415,835],[481,835],[481,860],[569,860],[569,835],[631,835],[631,860],[658,860],[658,795],[970,795],[970,850],[1065,852],[1160,855],[1225,850],[1300,790],[1300,712],[1360,715],[1390,700],[1445,610],[1500,600],[1536,560],[1536,1024]],
          hole:[[219,765],[315,778],[315,1024],[219,1024]]},
        {n:'railing',line:[[880,640],[1016,500]],poly:[[858,505],[860,495],[925,493],[986,430],[986,340],[1046,340],[1046,500],[1000,505],[905,636],[860,642]]},
        {n:'anvil',depth:486,poly:[[695,370],[737,361],[795,362],[833,369],[820,384],[795,394],[820,406],[826,430],[823,478],[780,491],[722,484],[712,437],[719,406],[740,396],[706,383]]},
        {n:'bucket',depth:486,poly:[[845,372],[857,352],[880,350],[905,355],[908,400],[907,480],[880,489],[850,483],[850,400]]},
        {n:'barrel',depth:686,poly:[[94,590],[130,566],[190,568],[216,585],[213,665],[160,692],[102,676],[92,630]]},
        {n:'rack',depth:562,poly:[[100,383],[140,380],[230,358],[250,365],[280,450],[280,535],[245,545],[180,560],[172,568],[110,570],[85,560],[85,500],[105,480]]},
        {n:'sack',depth:524,poly:[[262,415],[300,405],[342,418],[352,445],[367,495],[345,527],[282,526],[268,490],[262,455]]},
        {n:'crates',depth:682,poly:[[1345,600],[1378,568],[1380,523],[1425,493],[1495,512],[1495,560],[1460,575],[1445,588],[1440,640],[1413,678],[1400,684],[1347,663]]}]},
  azt:{W:1536,H:1024,charScale:4.5,npcH:290,charFilter:'sepia(.14) saturate(1.1) brightness(.98)',
    fires:[{cx:556,top:315,base:388,rx:55},{cx:124,top:705,base:786,rx:33,open:1,front:1},{cx:311,top:756,base:832,rx:30,open:1,front:1}],lamps:[],
    walk:[[205,890],[205,700],[195,668],[325,665],[325,560],[400,552],[410,500],[625,492],[640,470],[870,468],[880,525],[990,552],[1045,560],[1062,625],[1135,640],[1395,705],[1395,740],[1385,752],[1215,850],[935,850],[935,800],[650,800],[650,850],[355,850],[275,850],[275,890]],
    solids:[[625,515,815,582],[505,535,605,585]],
    npc:{x:555,y:560},start:{x:390,y:705},exit:{x:236,y:872,r:28},
    fg:[{n:'front',depth:'front',poly:[[0,1024],[0,540],[90,540],[110,660],[180,660],[190,690],[270,700],[350,700],[355,858],[650,858],[650,805],[935,805],[935,858],[1205,858],[1490,715],[1536,715],[1536,1024]],hole:[[201,737],[271,748],[271,1024],[201,1024]]},
        {n:'anvil',depth:575,poly:[[637,445],[700,438],[812,442],[790,465],[760,470],[770,520],[815,535],[815,575],[720,582],[625,575],[625,535],[690,515],[695,470],[650,462]]},
        {n:'plant',depth:648,poly:[[40,420],[110,370],[200,400],[245,470],[240,545],[320,548],[322,655],[200,655],[190,645],[100,650],[60,560]]},
        {n:'basket',depth:532,poly:[[875,420],[990,400],[1040,460],[1042,545],[985,548],[930,522],[875,505]]},
        {n:'pillarL',depth:622,poly:[[1045,320],[1165,320],[1165,615],[1110,632],[1058,618],[1045,460]]},
        {n:'pillarR',depth:720,poly:[[1390,400],[1505,400],[1505,700],[1450,722],[1400,705]]}]},
  egy:{W:1536,H:1024,charScale:5.1,npcH:325,charFilter:'sepia(.14) saturate(1.08) brightness(.98)',
    fires:[{cx:605,top:278,base:350,rx:54}],lamps:[[1192,462,40]],
    walk:[[200,885],[200,690],[245,652],[330,650],[330,600],[450,590],[455,475],[530,465],[700,455],[725,440],[945,440],[950,490],[1075,495],[1085,600],[1160,615],[1395,705],[1400,745],[1360,772],[1150,850],[920,850],[920,785],[650,785],[650,850],[355,850],[280,850],[280,885]],
    solids:[[650,505,830,582],[515,535,615,585]],
    npc:{x:565,y:560},start:{x:390,y:705},exit:{x:238,y:874,r:28},
    fg:[{n:'front',depth:'front',poly:[[0,1024],[0,610],[40,620],[95,650],[205,650],[270,690],[355,700],[355,840],[650,840],[650,780],[920,780],[920,840],[1150,840],[1500,690],[1536,690],[1536,1024]],hole:[[197,738],[278,742],[278,1024],[197,1024]]},
        {n:'anvil',depth:575,poly:[[658,432],[700,423],[828,430],[810,455],[770,465],[780,490],[805,488],[830,545],[820,580],[655,580],[650,545],[675,490],[705,488],[712,462],[670,455]]},
        {n:'plant',depth:640,poly:[[40,470],[150,370],[250,450],[320,370],[445,450],[448,585],[330,590],[240,600],[230,640],[110,642],[95,600]]},
        {n:'vases',depth:488,poly:[[940,370],[1000,315],[1070,320],[1078,480],[1020,488],[945,478]]},
        {n:'pillarL',depth:602,poly:[[1068,330],[1170,330],[1165,600],[1120,612],[1080,600]]},
        {n:'pillarR',depth:702,poly:[[1395,410],[1495,410],[1488,700],[1440,712],[1400,700]]}]},
  grk:{W:1536,H:1024,charScale:4.3,npcH:275,charFilter:'sepia(.1) saturate(1.05) brightness(.99)',
    fires:[{cx:607,top:252,base:320,rx:55}],lamps:[[1145,408,40]],
    walk:[[205,888],[205,700],[200,668],[295,665],[295,560],[390,550],[390,495],[445,490],[445,435],[515,428],[730,425],[770,405],[985,405],[985,575],[1085,575],[1395,655],[1395,700],[1370,720],[1185,850],[965,850],[965,785],[685,785],[685,850],[355,850],[270,850],[270,888]],
    solids:[[655,440,830,500],[525,475,625,525]],
    npc:{x:575,y:500},start:{x:390,y:720},exit:{x:240,y:878,r:28},
    fg:[{n:'front',depth:'front',poly:[[0,1024],[0,400],[60,410],[100,650],[205,650],[240,700],[300,705],[360,725],[360,845],[685,845],[685,780],[965,780],[965,845],[1185,845],[1490,690],[1536,690],[1536,1024]],hole:[[202,723],[262,736],[262,758],[284,764],[288,781],[294,786],[294,1024],[202,1024]]},
        {n:'anvil',depth:495,poly:[[668,372],[720,362],[840,368],[815,392],[780,400],[790,428],[825,430],[830,470],[820,500],[660,500],[655,470],[670,430],[712,428],[718,398],[680,390]]},
        {n:'left',depth:656,poly:[[30,470],[110,400],[160,380],[305,370],[310,555],[290,560],[292,660],[165,662],[150,650],[70,655],[35,600]]},
        {n:'crates',depth:548,poly:[[295,440],[340,420],[385,440],[388,545],[300,548]]},
        {n:'colL',depth:575,poly:[[985,345],[1085,345],[1082,575],[1035,585],[988,575]]},
        {n:'colR',depth:698,poly:[[1372,440],[1482,440],[1478,700],[1425,710],[1378,698]]}]},
  jpn:{W:1536,H:1024,charScale:4.7,npcH:300,charFilter:'sepia(.12) saturate(1.06) brightness(.97)',
    fires:[{cx:628,top:284,base:352,rx:48}],lamps:[[492,148,70],[125,600,45],[1217,455,50]],
    walk:[[252,880],[252,740],[205,705],[370,705],[372,560],[415,555],[415,505],[565,500],[570,425],[720,422],[835,405],[995,410],[995,645],[1050,655],[1060,592],[1160,580],[1450,628],[1440,690],[1300,762],[1215,840],[950,840],[950,790],[665,790],[665,840],[370,840],[305,845],[305,880]],
    solids:[[628,495,842,557],[882,480,990,535],[505,585,615,635]],
    npc:{x:560,y:610},start:{x:430,y:720},exit:{x:278,y:868,r:26},
    fg:[{n:'front',depth:'front',poly:[[0,1024],[0,410],[60,420],[70,640],[125,665],[200,680],[330,725],[370,740],[370,845],[665,845],[665,790],[950,790],[950,845],[1215,840],[1240,830],[1480,570],[1536,570],[1536,1024]],hole:[[250,735],[305,745],[305,1024],[250,1024]]},
        {n:'anvil',depth:552,poly:[[652,425],[700,415],[790,410],[855,405],[855,418],[790,428],[760,450],[770,480],[840,483],[842,550],[735,557],[628,552],[626,485],[700,480],[708,448],[660,440]]},
        {n:'leftgroup',depth:692,poly:[[75,560],[125,525],[195,555],[365,560],[368,700],[255,700],[190,695],[90,690]]},
        {n:'tub',depth:536,poly:[[880,420],[935,400],[990,420],[990,535],[935,545],[882,535]]},
        {n:'partition',line:[[1030,648],[1200,400]],poly:[[1000,355],[1195,285],[1210,300],[1200,560],[1060,590],[1052,645],[1000,640]]}]},
};
const RID=k=>'craft_'+k,ROOMS={};window.AF_ROOM_TOWN={};
for(const k in CRAFT){const C=CRAFT[k];C.key=k;C.art=ART[k]||null;C.L=Object.assign({},LAYOUT,C.room||{},C.art?{npc:C.art.npc,start:C.art.start,exit:C.art.exit}:{});
  C.img={front:loadImg('assets/npc/craft_'+k+'_front'),side:loadImg('assets/npc/craft_'+k+'_side'),room:loadImg('assets/rooms/craft_'+k)};C.face={pose:'front',flip:false,t:-9,prev:null};
  const tn=(AFItems.TOWNS[k]||{}).name||k;C.townName=tn;
  MAPDEF[RID(k)]={name:'โรงคราฟ · '+tn,lv:'เมือง',MS:C.art&&C.art.ms||1.0,mk:()=>createRoomHost(C)};NAV_MAPS[RID(k)]=1;ROOMS[RID(k)]=C;AF_ROOM_TOWN[RID(k)]=C.map;}
/* 2026-11-20 load time: the picture is downloaded the first time something asks for it (was: every room and NPC of every town at start) */
function loadImg(base){const o={ok:false,failed:false,img:null},ext=['.webp','.png'];let i=0,on=0;
  const go=()=>{if(on)return;on=1;o.img=new Image();o.img.onload=()=>{o.ok=true;};o.img.onerror=()=>{if(++i<ext.length)o.img.src=base+ext[i];else o.failed=true;};o.img.src=base+ext[0];};
  return {get ok(){go();return o.ok;},get failed(){go();return o.failed;},get img(){go();return o.img;}};}

/* =====================================================================
   CAPITAL HALLS (2026-11): the Adventurers' Guild (guild master → world boss) and the Weapon & Armour shop (2 merchants).
   Same room engine as the craft halls; a room may hold several NPCs (C.npcs), each with its own pose, label and talk handler.
   Art: assets/rooms/cap_guild|cap_armory.webp · assets/npc/cap_guild|cap_weapon|cap_armor _front/_side.webp
   ===================================================================== */
const mkNpc=(key,name,role,icon,h,pos,onTalk,isOpen,hello)=>({key,npc:name,role,icon,h,pos,onTalk,isOpen,hello,
  img:{front:loadImg('assets/npc/'+key+'_front'),side:loadImg('assets/npc/'+key+'_side')},face:{pose:'front',flip:false,t:-9,prev:null},tint:'saturate(.9)'});
const HALL_ART={
  guild:{W:1536,H:1024,charScale:4.3,charFilter:'sepia(.12) saturate(1.06) brightness(.98)',lamps:[[540,140,60],[1000,140,60],[45,470,50],[1490,480,50],[540,790,60],[1005,790,60]],
    walk:[[585,1000],[585,915],[70,915],[45,640],[165,610],[175,415],[515,410],[525,442],[1015,442],[1030,415],[1160,415],[1160,548],[1460,548],[1495,600],[1495,915],[955,915],[955,1000]],
    solids:[[85,600,455,690],[95,735,320,835],[1125,640,1530,775],[1325,740,1405,805],[1400,770,1520,890]],
    npc:{x:770,y:428},start:{x:770,y:820},exit:{x:770,y:975,r:42},
    fg:[{n:'frontL',depth:'front',poly:[[0,1024],[0,885],[470,885],[475,815],[585,815],[585,1024]]},{n:'frontR',depth:'front',poly:[[950,1024],[950,815],[1065,815],[1070,885],[1536,885],[1536,1024]]},
      {n:'counter',depth:442,poly:[[512,300],[1028,300],[1028,442],[512,442]]},
      {n:'tableL',depth:690,poly:[[85,470],[400,470],[455,530],[458,690],[85,690]]},{n:'tableRound',depth:835,poly:[[30,680],[325,680],[332,838],[30,838]]},
      {n:'tableR',depth:775,poly:[[1122,585],[1530,585],[1530,805],[1410,808],[1122,775]]},{n:'crate',depth:890,poly:[[1398,760],[1522,760],[1522,900],[1398,900]]},
      {n:'pillarA',depth:545,poly:[[1150,360],[1240,360],[1240,545],[1150,545]]},{n:'pillarB',depth:525,poly:[[1368,360],[1462,360],[1462,525],[1368,525]]}]},
  armory:{W:1536,H:1024,charScale:4.3,charFilter:'sepia(.12) saturate(1.06) brightness(.98)',lamps:[[765,95,70],[300,320,45],[975,320,45],[45,450,45],[1488,450,45],[555,790,60],[985,790,60]],
    walk:[[610,1000],[610,880],[452,880],[442,822],[338,822],[332,762],[182,762],[172,692],[236,684],[238,505],[300,505],[300,474],[640,474],[652,392],[905,392],[916,478],[1183,478],[1183,702],[1298,722],[1298,782],[1140,786],[1134,880],[935,880],[935,1000]],
    solids:[],
    npc:{x:450,y:458},start:{x:770,y:810},exit:{x:770,y:965,r:42},
    fg:[{n:'frontL',depth:'front',poly:[[0,1024],[0,875],[500,872],[500,815],[612,815],[612,1024]]},{n:'frontR',depth:'front',poly:[[925,1024],[925,815],[1042,815],[1042,872],[1536,872],[1536,1024]]},
      {n:'counterL',depth:474,poly:[[248,318],[642,318],[642,474],[248,474]]},{n:'counterR',depth:478,poly:[[908,318],[1288,318],[1288,478],[908,478]]},
      {n:'rack',depth:688,poly:[[40,215],[238,215],[242,692],[40,692]]},{n:'grind',depth:838,poly:[[0,650],[176,650],[176,842],[0,842]]},
      {n:'anvil',depth:884,poly:[[172,758],[338,758],[338,888],[172,888]]},{n:'ingots',depth:884,poly:[[322,812],[448,812],[448,888],[322,888]]},
      {n:'mannequins',depth:722,poly:[[1183,455],[1492,455],[1492,726],[1183,726]]},{n:'chest',depth:786,poly:[[1298,622],[1492,622],[1492,792],[1298,792]]},
      {n:'table',depth:892,poly:[[1128,758],[1408,758],[1408,896],[1128,896]]},{n:'standArmor',depth:492,poly:[[1318,225],[1440,225],[1440,492],[1318,492]]}]}};
const HALLDEF=[
  {key:'cap_guild',rid:'cap_guild',map:'capT',bld:'cpGuildHall',name:'ที่ทำการกิลด์นักผจญภัย',sign:'⚔ กิลด์นักผจญภัย',art:HALL_ART.guild,
   enterMsg:'กิลด์นักผจญภัย: คลิก <b>ลีโอนาร์ด</b> เพื่อลงบอสโลก · เดินลงบันไดด้านล่างเพื่อออก',
   npcs:[mkNpc('cap_guild','ลีโอนาร์ด','กิลด์มาสเตอร์','⚔',300,{x:770,y:428},n=>guildMenu(n),()=>hlOpen==='cap_guild','บอสโลกตื่นแล้ว… กล้าพอจะลงไปไหม?')]},
  {key:'cap_armory',rid:'cap_armory',map:'capT',bld:'cpArmory',name:'ร้านอาวุธและชุดเกราะ',sign:'🗡 ร้านอาวุธ · ชุดเกราะ',art:HALL_ART.armory,
   enterMsg:'ร้านอาวุธและชุดเกราะ: <b>บรูโน่</b> ขายอาวุธ · <b>บาเจอร์</b> ขายชุดเกราะ · เดินลงบันไดด้านล่างเพื่อออก',
   npcs:[mkNpc('cap_weapon','บรูโน่','ร้านอาวุธ','🗡',300,{x:450,y:458},n=>gearShop(n,'weapon'),()=>hlOpen==='cap_weapon','อาวุธคมกริบทุกชิ้น เลือกดูได้เลย!'),
         mkNpc('cap_armor','บาเจอร์','ร้านชุดเกราะ','🛡',290,{x:1100,y:460},n=>gearShop(n,'armor'),()=>hlOpen==='cap_armor','เกราะดีช่วยชีวิตได้นะ ลองดูสิ')]}];
let hlOpen=null;
for(const H of HALLDEF){H.L={npc:H.art.npc,start:H.art.start,exit:H.art.exit};H.img={room:loadImg('assets/rooms/'+H.key)};H.face={pose:'front',flip:false,t:-9,prev:null};H.townName='เมืองหลวง';H.npc=H.npcs[0].npc;
  for(const n of H.npcs)n.art={npcH:n.h,fit:H.art.fit};
  MAPDEF[H.rid]={name:H.name,lv:'เมืองหลวง',MS:1.0,mk:()=>createRoomHost(H)};NAV_MAPS[H.rid]=1;ROOMS[H.rid]=H;AF_ROOM_TOWN[H.rid]=H.map;}

/* ---------------- the room host (same interface the game's map hosts have) ---------------- */
function createRoomHost(C){const A=C.art,W=A?A.W:ROOM_W,H=A?A.H:ROOM_H,CELL=16,COLS=Math.ceil(W/CELL),ROWS=Math.ceil(H/CELL),L=C.L,T=C.th;
  const inR=(r,x,y)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
  const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
  const blocked=A?(x,y)=>!inPoly(A.walk,x,y)||A.solids.some(r=>inR(r,x,y)):(x,y)=>!inR(L.walk,x,y)||L.solids.some(r=>inR(r,x,y));
  const grid=new Uint8Array(COLS*ROWS);for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++)grid[j*COLS+i]=blocked(i*CELL+CELL/2,j*CELL+CELL/2)?1:0;
  const nearest=p=>{if(!blocked(p.x,p.y))return {x:p.x,y:p.y};for(let r=8;r<900;r+=8)for(let k=0;k<24;k++){const a=k/24*Math.PI*2,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocked(x,y))return {x,y};}return null;};
  const clear=(a,b)=>{const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.ceil(d/6);for(let i=1;i<=n;i++){const t=i/n;if(blocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t))return false;}return true;};
  function route(a,b){if(blocked(b.x,b.y))b=nearest(b)||b;if(clear(a,b))return [b];
    const ci=p=>Math.min(COLS-1,Math.max(0,(p.x/CELL)|0))+Math.min(ROWS-1,Math.max(0,(p.y/CELL)|0))*COLS,s=ci(a),e=ci(b),g=new Float32Array(COLS*ROWS).fill(1e9),from=new Int32Array(COLS*ROWS).fill(-1),done=new Uint8Array(COLS*ROWS);
    const open=[s];g[s]=0;const hh=i=>Math.hypot((i%COLS)-(e%COLS),((i/COLS)|0)-((e/COLS)|0));
    while(open.length){let bi=0;for(let i=1;i<open.length;i++)if(g[open[i]]+hh(open[i])<g[open[bi]]+hh(open[bi]))bi=i;const c=open.splice(bi,1)[0];if(c===e)break;if(done[c])continue;done[c]=1;
      const cx=c%COLS,cy=(c/COLS)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=COLS||ny>=ROWS)continue;const n=ny*COLS+nx;
        if(grid[n]||done[n]||(dx&&dy&&(grid[cy*COLS+nx]||grid[ny*COLS+cx])))continue;const ng=g[c]+(dx&&dy?1.414:1);if(ng<g[n]){g[n]=ng;from[n]=c;open.push(n);}}}
    if(from[e]<0&&e!==s)return [];const pts=[b];for(let c=from[e];c>=0&&c!==s;c=from[c])pts.unshift({x:(c%COLS)*CELL+CELL/2,y:((c/COLS)|0)*CELL+CELL/2});
    const out=[];let cur=a;for(let i=0;i<pts.length;i++){let j=i;while(j+1<pts.length&&clear(cur,pts[j+1]))j++;out.push(pts[j]);cur=pts[j];i=j;}return out;}
  let ply={x:0,y:0},debug=false;
  /* ---- placeholder interior ---- */
  function planks(g,x0,y0,x1,y1,c1,c2,h){for(let y=y0,r=0;y<y1;y+=h,r++){g.fillStyle=r%2?c1:c2;g.fillRect(x0,y,x1-x0,Math.min(h,y1-y));g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0,y+h-2,x1-x0,2);
      for(let x=x0+((r*97)%160);x<x1;x+=160+((r*53)%70))g.fillRect(x,y,2,h);}}
  function drawRoom(g,t){g.fillStyle=A?'#000':'#120d0a';g.fillRect(-4000,-4000,W+8000,H+8000);
    if(C.img.room.ok){g.drawImage(C.img.room.img,0,0,W,H);if(A&&A.fires)A.fires.forEach((f,i)=>{if(!f.front)drawFire(g,C.img.room.img,f,t,i*2.3+1);});if(A)exitPortal(g,L.exit,t);return;}if(A)return;
    planks(g,60,WALL_Y-10,W-60,H-20,T.floor,T.floor2,34);
    /* back wall */
    g.fillStyle=T.wall;g.fillRect(40,0,W-80,WALL_Y);for(let y=20;y<WALL_Y;y+=38){g.fillStyle=T.wall2;g.fillRect(40,y,W-80,3);for(let x=40+((y/38)%2)*55;x<W-40;x+=110)g.fillRect(x,y,3,38);}
    g.fillStyle=T.trim;g.fillRect(40,WALL_Y-14,W-80,14);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(40,WALL_Y,W-80,10);g.fillStyle='#3a2a1f';g.fillRect(40,0,W-80,18);
    /* side + front walls */
    g.fillStyle=T.wall2;g.fillRect(0,0,60,H);g.fillRect(W-60,0,60,H);g.fillRect(0,H-26,W/2-90,26);g.fillRect(W/2+90,H-26,W/2-90,26);
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(56,0,6,H);g.fillRect(W-62,0,6,H);
    /* rug + exit mat */
    g.save();g.translate(W/2,560);g.scale(1,.5);g.fillStyle=T.rug;g.beginPath();g.ellipse(0,0,230,170,0,0,7);g.fill();g.strokeStyle='rgba(255,236,190,.55)';g.lineWidth=8;g.beginPath();g.ellipse(0,0,200,145,0,0,7);g.stroke();g.restore();
    g.fillStyle='#1c130d';g.fillRect(W/2-90,H-26,180,26);g.fillStyle='#6a4a30';g.fillRect(W/2-74,H-92,148,58);g.strokeStyle='#e8c87a';g.lineWidth=3;g.strokeRect(W/2-68,H-86,136,46);
    /* furnace on the back wall (flickering mouth) */
    const fl=.75+.25*Math.sin(t*.011)*Math.sin(t*.0047+1);g.fillStyle='#57514d';g.fillRect(180,40,240,WALL_Y);g.fillStyle='#6c6560';for(let y=48;y<WALL_Y+30;y+=26)for(let x=184+((y/26)%2)*20;x<414;x+=40)g.fillRect(x,y,36,22);
    g.fillStyle='#2a1a12';g.beginPath();g.moveTo(230,WALL_Y+40);g.lineTo(230,150);g.quadraticCurveTo(300,100,370,150);g.lineTo(370,WALL_Y+40);g.fill();
    const gr=g.createRadialGradient(300,WALL_Y,6,300,WALL_Y,110);gr.addColorStop(0,`rgba(${T.glow},${.95*fl})`);gr.addColorStop(1,`rgba(${T.glow},0)`);g.fillStyle=gr;g.fillRect(190,120,220,WALL_Y-60);
    g.fillStyle='#3a3330';g.fillRect(160,WALL_Y+22,280,26);
    /* weapon rack + shelf */
    g.fillStyle='#5a3d27';g.fillRect(760,70,300,12);g.fillRect(760,170,300,12);for(let i=0;i<6;i++){const x=785+i*48;g.fillStyle='#c9ccd2';g.fillRect(x,40,7,128);g.fillStyle='#7a5530';g.fillRect(x-6,150,19,6);g.fillRect(x,156,7,26);}
    g.fillStyle='#5a3d27';g.fillRect(500,110,200,10);[['#7fb0d8',520],['#c25a4a',560],['#e0c060',600],['#80b860',640]].forEach(([c,x])=>{g.fillStyle=c;g.beginPath();g.arc(x+10,96,13,0,7);g.fill();g.fillRect(x+6,74,8,10);});}
  function furniture(g,t){if(C.img.room.ok)return [];const out=[];
    if(!(C.ownAnvil&&C.img.front.ok))out.push({depth:446,draw:()=>{const x=ROOM_W/2-110,y=438;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y+4,52,12,0,0,7);g.fill();g.fillStyle='#4b4f57';g.fillRect(x-14,y-34,28,34);g.fillStyle='#5e636c';g.beginPath();g.moveTo(x-50,y-50);g.lineTo(x+46,y-50);g.lineTo(x+62,y-38);g.lineTo(x+30,y-34);g.lineTo(x-34,y-34);g.closePath();g.fill();g.fillStyle='#7c828c';g.fillRect(x-48,y-56,92,8);
      if(Math.sin(t*.004)>.92){g.fillStyle='rgba(255,200,90,.9)';for(let i=0;i<5;i++){g.fillRect(x+Math.sin(i*3+t*.01)*24,y-62-i*5,3,3);}}}});
    out.push({depth:372,draw:()=>{g.fillStyle='rgba(0,0,0,.22)';g.fillRect(790,364,240,12);g.fillStyle='#6a4a30';g.fillRect(790,318,240,20);g.fillStyle='#55391f';g.fillRect(800,338,14,34);g.fillRect(1006,338,14,34);g.fillStyle='#9aa0a8';g.fillRect(830,304,50,8);g.fillStyle='#7a5530';g.fillRect(900,300,10,22);g.fillStyle='#c9a24a';g.fillRect(950,306,40,10);}});
    for(const [x,y] of [[160,740],[240,744],[200,700]])out.push({depth:y,draw:()=>{g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x,y,36,10,0,0,7);g.fill();g.fillStyle='#7a5232';g.fillRect(x-30,y-64,60,62);g.fillStyle='#4a3a2a';g.fillRect(x-32,y-54,64,6);g.fillRect(x-32,y-18,64,6);g.fillStyle='#8f6440';g.beginPath();g.ellipse(x,y-64,30,9,0,0,7);g.fill();}});
    for(const [x,y,s] of [[1000,744,60],[1062,740,50],[1030,700,44]])out.push({depth:y,draw:()=>{g.fillStyle='#8a6338';g.fillRect(x-s/2,y-s,s,s);g.strokeStyle='#5a3d22';g.lineWidth=3;g.strokeRect(x-s/2+2,y-s+2,s-4,s-4);g.beginPath();g.moveTo(x-s/2+2,y-s+2);g.lineTo(x+s/2-2,y-2);g.stroke();}});
    return out;}
  /* foreground layers: the piece is clipped out of the room picture and drawn again at its own depth */
  const lineY=(l,x)=>{const [[x1,y1],[x2,y2]]=l,k=Math.max(0,Math.min(1,(x-x1)/(x2-x1)));return y1+(y2-y1)*k;};
  const path=(g,P)=>{g.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)g.lineTo(P[i][0],P[i][1]);g.closePath();};
  function fgItems(g){if(!A||!C.img.room.ok)return [];const im=C.img.room.img;
    return A.fg.map(p=>({depth:p.depth==='front'?1e9:p.line?lineY(p.line,ply.x):p.depth,draw:()=>{g.save();g.beginPath();path(g,p.poly);if(p.hole)path(g,p.hole);g.clip('evenodd');g.drawImage(im,0,0,W,H);
      if(debug){g.fillStyle='rgba(60,160,255,.25)';g.fillRect(0,0,W,H);}g.restore();}}));}
  const MSr=A&&A.ms||1,unscaled=(g,x,y,f)=>{g.save();g.translate(x,y);g.scale(1/MSr,1/MSr);g.translate(-x,-y);f();g.restore();};   // NPC keeps its on-screen size when the room picture is scaled
  if(!C.npcs)C.pos=L.npc;const NP=C.npcs||[C];
  const npcItem=()=>NP.map(n=>({depth:n.pos.y,draw:()=>unscaled(ctx,n.pos.x,n.pos.y,()=>drawNpc(n,n.pos.x,n.pos.y))}));
  return {W,H,get ready(){return !A||C.img.room.ok||!!C.img.room.failed;},failed:false,charFilter:A&&A.charFilter||undefined,cfg:{room:1,name:MAPDEF[C.rid||RID(C.key)].name},nav:{nearest,blocked},blocked,clear,route,isReachable:(x,y)=>!blocked(x,y),
    spawn:{start:L.start},spawns:[],warps:[],exitHit:()=>false,setPlayer(x,y){ply.x=x;ply.y=y;},update(){},set debug(v){debug=v;},
    drawBase(g,t){drawRoom(g,t);},
    drawSorted(g,t,night,items){const all=items.slice().concat(furniture(g,t),npcItem(),fgItems(g));
      if(A&&A.fires&&C.img.room.ok)A.fires.forEach((f,i)=>{if(f.front)all.push({depth:1e9+1,draw:()=>drawFire(g,C.img.room.img,f,t,i*2.3+1)});});   // fires that stand in front (braziers by the door)
      if(A&&A.charScale>1)all.push({depth:ply.y-.5,draw:()=>{const r=17*MAP_CHAR*roomK(C)*CHAR_SCALE*(window.META_K||1);g.save();g.translate(ply.x,ply.y+1);g.scale(1,.3);const gr=g.createRadialGradient(0,0,0,0,0,r*1.3);gr.addColorStop(0,'rgba(16,12,22,.42)');gr.addColorStop(.6,'rgba(16,12,22,.2)');gr.addColorStop(1,'rgba(16,12,22,0)');g.fillStyle=gr;g.fillRect(-r*1.4,-r*1.4,r*2.8,r*2.8);g.restore();}});all.sort((a,b)=>a.depth-b.depth);for(const it of all)it.draw();
      if(debug){g.save();g.fillStyle='rgba(220,40,40,.28)';for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++)if(grid[j*COLS+i])g.fillRect(i*CELL,j*CELL,CELL,CELL);g.restore();}return true;},
    foreground(g,t){const E=L.exit,b=Math.sin(t*.005)*4;
      if(A){roomLight(g,A,t);}
      else if(!C.img.room.ok){const fl=.6+.4*Math.sin(t*.011)*Math.sin(t*.0047+1),gr=g.createRadialGradient(300,WALL_Y+60,20,300,WALL_Y+60,420);gr.addColorStop(0,`rgba(${T.glow},${.16*fl})`);gr.addColorStop(1,`rgba(${T.glow},0)`);g.fillStyle=gr;g.fillRect(0,0,W,H);}
      g.save();g.globalAlpha=.9;g.fillStyle='#fff3d0';g.strokeStyle='#3a2a1f';g.lineWidth=4;g.font='700 18px Mali,sans-serif';g.textAlign='center';g.strokeText('▼ ทางออก',E.x,E.y-36+b);g.fillText('▼ ทางออก',E.x,E.y-36+b);g.restore();
      for(const n of NP)unscaled(g,n.pos.x,n.pos.y,()=>npcLabel(g,n,n.pos.x,n.pos.y,t));}};}


/* ---------------- living fire (rooms drawn from art) ----------------
   The flames already painted in the picture are redrawn in 2-px rows, each row nudged sideways and up by its own slow waves
   (more at the tips, none at the coals), the fire brightens and dims, and sparks drift up. Lamps get a soft pulsing glow. */
function drawFire(g,im,f,t,seed){const {cx,top,base,rx}=f,ry=base-top,x0=cx-rx-6,w=2*rx+12;
  g.save();g.beginPath();
  if(f.open)g.ellipse(cx,top+ry*.5,rx,ry*.56,0,0,7);else{g.moveTo(cx-rx+3,base);g.ellipse(cx,base,rx-3,ry,0,Math.PI,2*Math.PI);g.closePath();}
  g.clip();
  for(let y=top-6;y<base;y+=2){const u=Math.max(0,Math.min(1,(base-y)/ry)),k=u*u*(3-2*u);
    const off=(Math.sin(t*.0115+y*.13+seed)*2.4+Math.sin(t*.0213+y*.047+seed*1.7)*1.3)*k,lift=(1+Math.sin(t*.0087+y*.09+seed))*1.6*k;
    g.drawImage(im,x0,y+lift,w,2.2,x0+off,y,w,2.2);}
  const fl=.5+.5*Math.sin(t*.0172+seed)*Math.sin(t*.0069+seed*2.1);
  g.globalCompositeOperation='lighter';g.globalAlpha=.08+.2*fl;g.drawImage(im,x0,top-6,w,ry+8,x0,top-6,w,ry+8);g.restore();
  g.save();g.globalCompositeOperation='lighter';const n=f.open?6:8,hgt=ry*(f.open?1.7:1);
  for(let i=0;i<n;i++){const ph=(t*.00055*(1+(i%3)*.25)+i*.371+seed*.13)%1,x=cx+Math.sin(i*12.9+seed)*rx*.55+Math.sin(t*.0031+i*1.7)*5,y=base-6-ph*hgt;
    if(!f.open&&y<top+ry*.25)continue;const a=(1-ph)*(.55+.45*Math.sin(t*.02+i));g.fillStyle=`rgba(255,${170+(70*(1-ph))|0},70,${a})`;g.fillRect(x,y,2.4,2.4);}
  g.restore();}
/* RO-style way out: a soft warm light pool on the threshold, a slow ring, and motes rising into the dark doorway */
function exitPortal(g,E,t){const x=E.x,y=E.y-4,p=.5+.5*Math.sin(t*.004);g.save();g.globalCompositeOperation='lighter';
  let gr=g.createRadialGradient(x,y,2,x,y,56);gr.addColorStop(0,`rgba(255,226,160,${.32+.12*p})`);gr.addColorStop(1,'rgba(255,200,120,0)');
  g.save();g.translate(x,y);g.scale(1,.36);g.fillStyle=gr;g.fillRect(-60,-60,120,120);
  g.rotate(t*.0012);g.strokeStyle=`rgba(255,236,190,${.35+.2*p})`;g.lineWidth=2.2;g.setLineDash([10,8]);g.beginPath();g.arc(0,0,32+3*p,0,7);g.stroke();g.restore();
  for(let i=0;i<9;i++){const ph=(t*.00042*(1+(i%3)*.2)+i*.113)%1,mx=x+Math.sin(i*7.7)*22+Math.sin(t*.002+i)*3,my=y-ph*120,a=Math.sin(ph*Math.PI)*.75;
    g.fillStyle=`rgba(255,232,170,${a})`;g.beginPath();g.arc(mx,my,1.4+1.2*(1-ph),0,7);g.fill();}
  g.restore();}
function roomLight(g,A,t){g.save();g.globalCompositeOperation='lighter';
  (A.fires||[]).forEach((f,i)=>{const fl=.55+.45*Math.sin(t*.0093+i)*Math.sin(t*.0041+i*1.3),r=f.open?150:300,y=f.open?f.base:f.base+40,gr=g.createRadialGradient(f.cx,y,8,f.cx,y,r);
    gr.addColorStop(0,`rgba(255,150,60,${(f.open?.10:.13)*fl})`);gr.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=gr;g.fillRect(f.cx-r,y-r,2*r,2*r);});
  (A.lamps||[]).forEach(([x,y,r],i)=>{const fl=.6+.4*Math.sin(t*.0061+i*2.1)*Math.sin(t*.0137+i),gr=g.createRadialGradient(x,y,2,x,y,r);
    gr.addColorStop(0,`rgba(255,200,120,${.16*fl})`);gr.addColorStop(1,'rgba(255,190,110,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);});
  g.restore();}
/* ---------------- the craft NPC ----------------
   Two drawings: front (standing straight, the default) and side (3/4, looking to screen-left; mirrored when the hero is on the right).
   Idle: the picture is drawn in thin horizontal strips and gently deformed — breathing lifts the chest and shoulders, the upper body
   sways a little more than the feet, so it reads as alive without a sprite sheet. Pose changes cross-fade with a small squash. */
/* room scale (owner 2026-11-25 'เวลาเข้าบ้านเข้าห้องตีเหล็ก ทำให้ขนาดมันสมจริงหน่อย ไม่ใช่ใหญ่เกินไป'): art.charScale = how big the
   characters are drawn in that picture; art.fit shrinks the heroes AND the room's NPCs together (talk / exit distances keep roomK0).
   ?roomfit=<k> tries one factor for every room. */
const RFQ=+((location.search.match(/[?&]roomfit=([\d.]+)/)||[])[1])||0;
const ROOM_FIT=.7;   /* every room: heroes and NPCs × .7 (counters at chest height, the anvil at the waist; an average-size hero now fits the room's exit door) */
const rfit=C=>RFQ||(C&&C.art&&C.art.fit)||ROOM_FIT;
const npcH=C=>(C.art&&C.art.npcH||C.h||84)*rfit(C),roomK0=C=>C&&C.art&&C.art.charScale||1,roomK=C=>roomK0(C)*rfit(C);
function turnTo(C,pose,flip){const F=C.face;if(F.pose===pose&&F.flip===flip)return;F.prev={pose:F.pose,flip:F.flip};F.pose=pose;F.flip=flip;F.t=performance.now();}
function warpDraw(g,im,ax,x,y,h,t,seed,alpha){const w=h*im.width/im.height,N=30,iw=im.width,ih=im.height,
    br=Math.sin(t/3200*6.2832+seed),sw=Math.sin(t/4700*6.2832+seed*1.7),sw2=Math.sin(t/4700*6.2832+seed*1.7-.9);
  const yAt=u=>{const s=u*u*(3-2*u);return h*(u+.026*br*s);};   // height above the feet of picture row u (0 feet → 1 head), breathing stretches the top
  g.save();g.globalAlpha*=alpha;g.translate(x,y);
  for(let k=0;k<N;k++){const u0=k/N,u1=(k+1)/N,sy0=ih*(1-u1),sh=ih/N,y0=-yAt(u1),y1=-yAt(u0),um=(u0+u1)/2;
    const chest=Math.exp(-(((um-.58)/.18)**2)),sx=1+.012*br*chest,off=(sw*1.7*um*um+sw2*.6*Math.max(0,um-.7)*3)*h/86;
    g.drawImage(im,0,sy0,iw,sh+.6,(-ax*w)*sx+off,y0-.35,w*sx,y1-y0+.7);}
  g.restore();}
function drawNpc(C,x,y){const t=performance.now(),g=ctx,F=C.face,h=npcH(C);
  g.save();g.fillStyle='rgba(16,12,22,.32)';g.beginPath();g.ellipse(x,y+1,24*h/86,7.5,0,0,7);g.fill();g.restore();
  const art=p=>C.img[p]&&C.img[p].ok?C.img[p].img:(C.img.front.ok?C.img.front.img:null);
  if(art('front')){const k=Math.min(1,(t-F.t)/170),sq=1-.035*Math.sin(Math.min(1,(t-F.t)/220)*Math.PI),seed=C.key.charCodeAt(0);
    const one=(pose,flip,a)=>{const im=art(pose),ax=AX[C.key+'_'+pose]??.5;g.save();g.translate(x,y);g.scale((flip?-1:1)*(2-sq),sq);g.translate(-x,-y);warpDraw(g,im,ax,x,y,h,t,seed,a);g.restore();};
    if(F.prev&&k<1)one(F.prev.pose,F.prev.flip,1-k);one(F.pose,F.flip,F.prev&&k<1?k:1);return;}
  /* placeholder until art loads: the hero's own idle set, recoloured */
  try{const D=durs('idle','S'),TT=D.reduce((a,b)=>a+b,0);let ms=t%TT,f=0;while(f<D.length-1&&ms>=D[f]){ms-=D[f];f++;}const fe={st:'idle',d:'S',f};
    g.save();g.translate(x,y);g.scale(CHAR_SCALE*1.08,CHAR_SCALE*1.08);g.translate(-x,-y);drawFrame(fe,x,y,1,null,gradedFrame(fe,C.tint));g.restore();}catch(e){}}
/* horizontal position of each drawing's body centre = centre between the feet, 0–1 of its width (the tanuki's anvil sits beside him) */
const AX={"kf_vik_front":0.51,"kf_vik_side":0.64,"kf_azt_front":0.429,"kf_azt_side":0.421,"kf_grk_front":0.446,"kf_grk_side":0.402,"kf_egy_front":0.539,"kf_egy_side":0.602,"kf_jpn_front":0.506,"kf_jpn_side":0.481,"kf_cap_front":0.516,"kf_cap_side":0.5,"vik_front":0.55,"vik_side":0.52,"azt_front":0.54,"azt_side":0.5,"grk_front":0.535,"grk_side":0.52,"egy_front":0.53,"egy_side":0.505,"jpn_front":0.6,"jpn_side":0.58,"sea_front":0.489,"sea_side":0.547,"kf_sea_front":0.545,"kf_sea_side":0.543};
function npcLabel(g,C,x,y,t){const top=y-npcH(C)-18+Math.sin(t*.004)*3;g.save();g.textAlign='center';
  g.font='700 15px Mali,sans-serif';const nm=`${C.npc} · ${C.role||'ช่างคราฟ'}`,w=g.measureText(nm).width+18;g.fillStyle='rgba(30,22,16,.72)';rr(g,x-w/2,top-2,w,22,8);g.fill();g.fillStyle='#ffe6a8';g.fillText(nm,x,top+14);
  g.font='22px sans-serif';g.fillText(C.icon||'⚒',x,top-10);g.restore();}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}

/* ---------------- town side: the craft hall's door ---------------- */
const DOOR={};   // room id → {x,y,o,w,h,C}  (map pixels)
const HALLS=()=>Object.values(ROOMS);
function townDoors(id){return HALLS().filter(c=>c.map===id).map(c=>doorOf(c)).filter(Boolean).concat(linkDoors(id));}
/* linked doors (owner 2026-11-27 'บ้านช่างตีเหล้กให้ลิ้งเข้าไปที่ห้องเดิมที่ทำไว้'): a map piece with room:'<room id>' opens that room —
   the same room and NPC as the hall of the room's own town (the iso town's smithy opens craft_vik). door / out = offsets from the
   piece's anchor in map px: the door step, and where you stand when you come back out (default: 70 px below the door). signH = how
   high the sign hangs over the door step (default: like the halls). The way out of the room goes back to the door you came in by
   (ROOM_FROM, kept in localStorage so a reload inside the room still returns there). */
const LDOOR={};
function linkDoors(id){const h=mapHosts[id];if(!h||!h.ready||!h.cfg||!h.cfg.land)return [];const out=[];
  h.cfg.land.forEach((o,i)=>{if(!o.room||!ROOMS[o.room])return;const k=id+'|'+i;if(LDOOR[k]){out.push(LDOOR[k]);return;}
    const C=ROOMS[o.room],cat=(window.VK_CAT||{})[o.n]||{w:260,h:240},v=o.v||1,dd=o.door||[0,0],oo=o.out||[dd[0],dd[1]+70];
    let p={x:o.x+dd[0],y:o.y+dd[1]};if(h.blocked(p.x,p.y))p=h.nav.nearest(p)||p;
    let q={x:o.x+oo[0],y:o.y+oo[1]};if(h.blocked(q.x,q.y))q=h.nav.nearest(q)||q;
    out.push(LDOOR[k]={x:p.x,y:p.y,o,w:cat.w*v,h:cat.h*v,C,link:1,out:q,sh:o.signH});});
  return out;}
const linksIn=id=>(((window.VK_MAPS||{})[id]||{}).land||[]).some(o=>o.room&&ROOMS[o.room]);
const FROM_K='af_roomfrom_'+(typeof CHAR!=='undefined'?CHAR:'');
const roomFrom=v=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(FROM_K)||'null');if(v)localStorage.setItem(FROM_K,JSON.stringify(v));else localStorage.removeItem(FROM_K);}catch(e){}return null;};
function townDoor(id){return townDoors(id)[0]||null;}
function doorOf(C){const id=C.map,rid=C.rid||RID(C.key);if(DOOR[rid])return DOOR[rid];const h=mapHosts[id];if(!h||!h.ready||!h.cfg||!h.cfg.land)return null;
  const o=h.cfg.land.find(l=>l.n===C.bld);if(!o)return null;const cat=(window.VK_CAT||{})[C.bld]||{w:260,h:240},v=o.v||1;
  let y=o.y-8;while(y<o.y+260&&h.blocked(o.x,y))y+=4;let p={x:o.x,y:y+14};if(h.blocked(p.x,p.y))p=h.nav.nearest(p)||p;
  return DOOR[rid]={x:p.x,y:p.y,o,w:cat.w*v,h:cat.h*v,C};}
function patchTown(id){const h=mapHosts[id];if(!h||h._craft)return;h._craft=1;const fg=h.foreground;
  h.foreground=function(g,t,night){if(fg)fg.call(h,g,t,night);for(const d of townDoors(id))doorSign(g,d,t);};}
function doorSign(g,d,t){{const b=Math.sin(t*.004)*4,x=d.x,y=d.y-(d.sh!=null?d.sh:d.h*.62+26)+b;
    g.save();g.textAlign='center';g.font='700 17px Mali,sans-serif';const s=d.C.sign||'⚒ โรงคราฟ',w=g.measureText(s).width+24;g.fillStyle='#6a4526';rr(g,x-w/2,y-20,w,30,7);g.fill();g.strokeStyle='#e8c87a';g.lineWidth=2.5;g.stroke();
    g.fillStyle='#fff1c8';g.fillText(s,x,y+1);g.font='700 13px Mali,sans-serif';g.strokeStyle='rgba(30,20,10,.8)';g.lineWidth=3.5;g.strokeText('▼ เดินเข้าประตู',x,d.y-8+b*.5);g.fillStyle='#ffe08a';g.fillText('▼ เดินเข้าประตู',x,d.y-8+b*.5);g.restore();};}

/* ---------------- enter / leave / talk ---------------- */
let lock=true,pend=null;
const _enter=enterMap;
enterMap=function(id,sp){const prevRoom=ROOMS[curMap];_enter(id,sp);lock=true;pend=null;
  /* characters drawn at real-life size inside a room with charScale (the game resets SPR on every map change) */
  if(ROOMS[id]&&roomK(ROOMS[id])!==1){SPR=SPR_BASE*MAP_CHAR*roomK(ROOMS[id]);for(const k in tintCache)delete tintCache[k];if(typeof SHC!=='undefined')SHC.clear();}
  else if(prevRoom&&typeof SHC!=='undefined')SHC.clear();
  if(prevRoom&&!ROOMS[id]){const w=document.getElementById('smw');if(w){w.classList.remove('open');w.style.left=w.style.right=w.style.transform='';}}
  if(ROOMS[id]){const C=ROOMS[id];chatLog('sys',C.enterMsg||`โรงคราฟ${C.townName}: คลิกที่ <b>${C.npc}</b> เพื่อคราฟ / ตีบวก / เจาะรู · เดินลงพรมด้านล่างเพื่อออก`);}
  else{if(id)roomFrom(null);   /* outside every room: a remembered way back is spent */
    if(id&&(HALLS().some(c=>c.map===id)||linksIn(id))){patchTown(id);if(Object.values(CRAFT).some(c=>c.map===id)||(((window.VK_MAPS||{})[id]||{}).land||[]).some(o=>o.room&&/^craft_/.test(o.room)))chatLog('sys','⚒ <b>โรงคราฟ</b> อยู่ในเมืองนี้ — ดูป้ายแล้วเดินเข้าประตูเพื่อคุยกับช่าง');}}};
function talk(C){pend=null;const [nx,ny]=M2W(C.pos||C.L.npc);faceTo&&faceTo(Math.atan2(ny-player.y,nx-player.x));turnTo(C,'side',player.x>nx);
  if(C.onTalk){chatLog('sys',`<b style="color:#ffd36a">${C.npc}</b> : ${C.hello}`);C.onTalk(C);return;}
  chatLog('sys',`<b style="color:#ffd36a">${C.npc}</b> : ${C.hello}`);AFItems.openSmith();
  /* slide the window to the right on wide screens so the NPC stays in view (and you see them turn to you) */
  const w=document.getElementById('smw');if(w&&innerWidth>1200){w.style.left='auto';w.style.right='16px';w.style.transform='translateY(-50%)';}}
function screenOf(mx,my,z=0){const [wx,wy]=M2W({x:mx,y:my}),q=P(wx,wy,z);return [q[0]*Z+ox,q[1]*Z+oy];}
function npcHit(sx,sy){const R=ROOMS[curMap];if(!R)return null;for(const C of (R.npcs||[R])){const P=C.pos||R.L.npc,[x,y]=screenOf(P.x,P.y);if(Math.abs(sx-x)<Math.max(36,npcH(C)*.36)*Z&&sy<y+12*Z&&sy>y-(npcH(C)+34)*Z)return C;}return null;}
function doorHit(sx,sy){if(!curMap)return null;for(const d of townDoors(curMap)){const [x,y]=screenOf(d.o.x,d.y),[,top]=screenOf(d.o.x,d.y-(d.sh!=null?Math.max(d.sh+20,d.h*.62+46):d.h*.62+46));if(Math.abs(sx-x)<d.w*.42*Z&&sy<y+20*Z&&sy>top)return d;}return null;}
addEventListener('pointerdown',e=>{if(e.target!==cvs||e.button!==0||targeting||!curMap)return;
  const C=npcHit(e.clientX,e.clientY);if(C){e.stopImmediatePropagation();const p=W2M(player.x,player.y),NPp=C.pos||C.L.npc;
    const k=roomK0(ROOMS[curMap]);if(Math.hypot(p.x-NPp.x,p.y-NPp.y)<120*Math.sqrt(k)){talk(C);return;}
    const [wx,wy]=M2W({x:NPp.x,y:NPp.y+40+30*k});command({kind:'move',x:wx,y:wy});pend={C,t:performance.now()};return;}
  const d=doorHit(e.clientX,e.clientY);if(d){e.stopImmediatePropagation();const [wx,wy]=M2W({x:d.x,y:d.y});command({kind:'move',x:wx,y:wy});}},true);
cvs.addEventListener('pointermove',e=>{if(!curMap)return;const on=!!(npcHit(e.clientX,e.clientY)||doorHit(e.clientX,e.clientY));if(on!==cvs._npcHover){cvs._npcHover=on;cvs.style.cursor=on?'pointer':'';}});
function tick(){requestAnimationFrame(tick);if(!curMap||mapFadeDir)return;const p=W2M(player.x,player.y),R=ROOMS[curMap];
  if(R){const E=R.L.exit,d=Math.hypot(p.x-E.x,p.y-E.y),sm=document.getElementById('smw'),smOpen=sm&&sm.classList.contains('open');
    /* keeps facing the hero while its window is open (and turns with them), back to standing straight a moment after it closes */
    for(const n of (R.npcs||[R])){const F=n.face,open=n.isOpen?n.isOpen():smOpen;if(F.pose==='side'){const nx=M2W(n.pos||R.L.npc)[0];if(open){F.until=performance.now()+1600;if((player.x>nx+6)!==F.flip&&Math.abs(player.x-nx)>14)turnTo(n,'side',player.x>nx);}else if(performance.now()>(F.until||0))turnTo(n,'front',false);}}
    if(pend){const Pp=pend.C.pos||R.L.npc;if(Math.hypot(p.x-Pp.x,p.y-Pp.y)<125*Math.sqrt(roomK0(R)))talk(pend.C);else if(!player.moveT&&performance.now()-pend.t>400)pend=null;}
    if(d>E.r+50)lock=false;else if(d<E.r&&!lock){lock=true;const rid=R.rid||RID(R.key),fr=roomFrom();
      if(fr&&fr.rid===rid&&fr.map&&MAPDEF[fr.map]){mapTravel(fr.map,{x:fr.x,y:fr.y});return;}   /* came in by a linked door → back out of that door */
      const dr=DOOR[rid];const o=dr?{x:dr.x,y:dr.y+70}:outsideGuess(R);mapTravel(R.map,o);}
    return;}
  const DS=townDoors(curMap);if(!DS.length)return;patchTown(curMap);const dd=DS.map(D=>[D,Math.hypot(p.x-D.x,p.y-D.y)]).sort((a,b)=>a[1]-b[1])[0],D=dd[0],d=dd[1];
  if(d>80)lock=false;else if(d<34&&!lock){lock=true;const rid=D.C.rid||RID(D.C.key);roomFrom(D.link?{rid,map:curMap,x:D.out.x,y:D.out.y}:null);
    mapTravel(rid,{x:R2(D.C).start.x,y:R2(D.C).start.y});}
  /* arrived outside before the town finished loading → step off the building if we landed on it */
  if(mapBlockedW(player.x,player.y)&&!player.moveT){const n=mapHost().nav.nearest(p);if(n){[player.x,player.y]=M2W(n);mapLastValid={x:player.x,y:player.y};}}}
const R2=C=>C.L;
function outsideGuess(C){const c=((window.VK_MAPS||{})[C.map]||{}).land||[],o=c.find(l=>l.n===C.bld);return o?{x:o.x,y:o.y+90}:null;}
requestAnimationFrame(tick);
/* the game restores the last map before this file loads: re-enter a craft room saved on the last visit */
try{const s=localStorage.getItem('af_map_'+CHAR),u=new URLSearchParams(location.search).get('map'),q=u!=null?u:s;if(q&&ROOMS[q]&&curMap!==q)enterMap(q,null);}catch(e){}
if(curMap&&!ROOMS[curMap]){patchTown(curMap);roomFrom(null);}   /* the page did not come back inside a room: no way back to remember */
window.AFCraftHalls={CRAFT,LAYOUT,ROOM_W,ROOM_H,enter:k=>mapTravel(RID(k),null)};
/* =====================================================================
   WARP NPCs (Kafra style) — staff of the Royal Gold Mine warp service, one per start town + the headquarters in the capital.
   Click → menu: save point · warp to another town (Zeny) · storage. They stand straight, turn to the hero while talking.
   Art: assets/npc/kafra_<town>_front.webp / _side.webp (town = vik azt grk egy jpn cap).
   Position: near the town's arrival point; set KAFRA[k].at = {x,y} (map pixels) to place one by hand.
   ===================================================================== */
window.AF_KAFRA_SAVE=1;
const KAFRA={
  vik:{map:'frostheim',name:'ลูมี',   h:66},
  azt:{map:'aztT',     name:'โคโค่',  h:66},
  grk:{map:'grkT',     name:'ธีอา',   h:64},
  egy:{map:'egyT',     name:'ไนลา',   h:66},
  jpn:{map:'jpnT',     name:'ยูซุ',   h:68,m:1},
  cap:{map:'capT',     name:'ออร์ริค', h:97,hq:1,m:1}};
const WARP_COST=m=>m==='capT'?1200:800;
for(const k in KAFRA){const K=KAFRA[k];K.key='kf_'+k;K.tk=k;K.img={front:loadImg('assets/npc/kafra_'+k+'_front'),side:loadImg('assets/npc/kafra_'+k+'_side')};K.face={pose:'front',flip:false,t:-9,prev:null};K.tint='saturate(.8)';}
const kafraOn=id=>Object.values(KAFRA).find(K=>K.map===id);
function kafraPos(K){if(K.pos)return K.pos;const h=mapHosts[K.map];if(!h||!h.ready)return null;
  const s=K.at||h.spawn.start;let p={x:s.x+(K.at?0:110),y:s.y-(K.at?0:30)};if(h.blocked(p.x,p.y))p=h.nav.nearest(p)||p;return K.pos=p;}
const fcache=new Map();   // the town's colour grade baked once per picture
function graded(im,flt){if(!flt||!im)return im;const k=im.src+'|'+flt;let c=fcache.get(k);if(c)return c;c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.filter=flt;g.drawImage(im,0,0);fcache.set(k,c);return c;}
function patchKafra(id){const h=mapHosts[id],K=kafraOn(id);if(!h||!K||h._kafra)return;h._kafra=1;const ds=h.drawSorted;
  h.drawSorted=function(g,t,night,items,cam){const p=kafraPos(K);if(p){const mf=h.charFilter;
      const K2=mf&&K.img.front.ok&&K.img.side.ok?Object.assign({},K,{img:{front:{ok:K.img.front.ok,img:graded(K.img.front.img,mf)},side:{ok:K.img.side.ok,img:graded(K.img.side.img,mf)}}}):K;
      items=items.concat([{depth:p.y,x:p.x,draw:()=>{drawNpc(K2,p.x,p.y);kafraLabel(g,K,p.x,p.y,t);}}]);}
    return ds.call(h,g,t,night,items,cam);};}
function kafraLabel(g,K,x,y,t){const top=y-K.h-16;g.save();g.textAlign='center';g.font='700 13px Mali,sans-serif';const nm=`${K.name} · ${K.hq?'สำนักงานใหญ่วาร์ป':'บริการวาร์ป'}`,w=g.measureText(nm).width+16;
  g.fillStyle='rgba(30,22,40,.72)';rr(g,x-w/2,top-2,w,19,7);g.fill();g.fillStyle='#ffe6a8';g.fillText(nm,x,top+12);g.font='17px sans-serif';g.fillText('🌀',x,top-8+Math.sin(t*.004)*2);g.restore();}
function kafraHit(sx,sy){const K=kafraOn(curMap);if(!K)return null;const p=kafraPos(K);if(!p)return null;const [x,y]=screenOf(p.x,p.y);return Math.abs(sx-x)<Math.max(30,K.h*.36)*Z&&sy<y+10*Z&&sy>y-(K.h+30)*Z?K:null;}
/* ---- dialog ---- */
const kcss=document.createElement('style');kcss.textContent=`
#kfdlg{position:fixed;left:50%;bottom:150px;transform:translateX(-50%);width:min(440px,94vw);z-index:60;display:none;background:#fffaf0;border:3px solid #3a2a1f;border-radius:14px;box-shadow:0 6px 0 rgba(58,42,31,.35);font:600 13px Mali,sans-serif;color:#3a2a1f;overflow:hidden}
#kfdlg .hd{display:flex;gap:10px;align-items:center;background:linear-gradient(#4a3a6a,#3a2c55);color:#ffe6a8;padding:6px 10px}
#kfdlg .hd img{width:46px;height:46px;object-fit:cover;object-position:50% 12%;border-radius:50%;background:#fff3d8;border:2px solid #e8c87a}
#kfdlg .hd b{font-size:14px}#kfdlg .hd small{display:block;color:#d8c8f0;font-size:11px}
#kfdlg .tx{padding:10px 12px 6px;line-height:1.5;min-height:38px}#kfdlg .bt{display:flex;flex-direction:column;gap:5px;padding:4px 12px 12px}
#kfdlg .bt button{text-align:left;padding:7px 10px;border-radius:9px;border:2px solid rgba(58,42,31,.25);background:#fff;font:700 12.5px Mali,sans-serif;color:#3a2a1f;cursor:pointer;display:flex;justify-content:space-between}
#kfdlg .bt button:hover:not(:disabled){background:#fff1cf;border-color:#f5a623}#kfdlg .bt button:disabled{opacity:.45;cursor:default}#kfdlg .bt button em{font-style:normal;color:#8a6a4a}`;
document.head.appendChild(kcss);
const dlg=document.createElement('div');dlg.id='kfdlg';document.body.appendChild(dlg);dlg.addEventListener('pointerdown',e=>e.stopPropagation());
let kfCur=null;
function kafraClose(){dlg.style.display='none';kfCur=null;}
function kafraShow(K,text,buttons){kfCur=K;const fr=K.img.front.ok?K.img.front.img.src:'';
  dlg.innerHTML=`<div class="hd">${fr?`<img src="${fr}">`:''}<div><b>${K.name}</b><small>${K.sub||((K.hq?'สำนักงานใหญ่ · ':'')+'บริการวาร์ปเหมืองทองหลวง')}</small></div></div><div class="tx">${text}</div><div class="bt"></div>`;
  const bt=dlg.querySelector('.bt');for(const b of buttons){const e=document.createElement('button');e.innerHTML=b.t+(b.r?`<em>${b.r}</em>`:'');if(b.off)e.disabled=true;e.onclick=b.f;bt.appendChild(e);}dlg.style.display='block';}
const zeny=()=>AFItems.zeny,tname=m=>(window.AFProgress&&AFProgress.townName?AFProgress.townName(m):(MAPDEF[m]||{}).name||m).replace(/ [A-Za-z].*$/,'');
function kafraMain(K){const sv=window.AFProgress&&AFProgress.savePoint;
  kafraShow(K,`ยินดีต้อนรับสู่บริการวาร์ป<b>เหมืองทองหลวง</b>${K.m?'ครับ':'ค่ะ'}! วันนี้ให้ช่วยอะไรดี${K.m?'ครับ':'คะ'}?${sv?`<br><small style="color:#8a6a4a">จุดเกิดปัจจุบัน: ${tname(sv.map)}</small>`:''}`,[
    {t:'💾 บันทึกจุดเกิดที่นี่',f:()=>{if(window.AFProgress&&AFProgress.setSave)AFProgress.setSave(K.map);chatLog('sys',`บันทึกจุดเกิดที่ <b>${tname(K.map)}</b>`);kafraShow(K,`บันทึกจุดเกิดที่ <b>${tname(K.map)}</b> เรียบร้อย${K.m?'ครับ':'ค่ะ'} ถ้าพ่ายแพ้จะกลับมาที่นี่นะ${K.m?'ครับ':'คะ'}`,[{t:'↩ กลับ',f:()=>kafraMain(K)},{t:'ปิด',f:kafraClose}]);}},
    {t:'🌀 บริการวาร์ป',f:()=>kafraWarp(K)},
    {t:'📦 เปิดคลังเก็บของ',f:()=>{kafraClose();AFItems.openStorage();}},
    {t:'ยกเลิก',f:kafraClose}]);}
function kafraWarp(K){const L=Object.values(KAFRA).filter(o=>o.map!==K.map&&MAPDEF[o.map]);
  kafraShow(K,`จะไปเมืองไหนดี${K.m?'ครับ':'คะ'}? <small style="color:#8a6a4a">(Zeny ${zeny().toLocaleString('en-US')})</small>`,L.map(o=>{const c=WARP_COST(o.map);return {t:(o.hq?'🏛 ':'')+tname(o.map),r:c.toLocaleString('en-US')+'z',off:zeny()<c,
      f:()=>{if(zeny()<c){return;}AFItems.zeny=zeny()-c;kafraClose();chatLog('sys',`วาร์ปไป <b>${tname(o.map)}</b> (−${c}z)`);mapTravel(o.map,null);}};}).concat([{t:'↩ กลับ',f:()=>kafraMain(K)}]));}
function kafraTalk(K){pendK=null;const p=kafraPos(K),[nx,ny]=M2W(p);faceTo&&faceTo(Math.atan2(ny-player.y,nx-player.x));turnTo(K,'side',player.x>nx);
  player.moveT=null;player.moveQ=null;kafraMain(K);}
let pendK=null;
addEventListener('pointerdown',e=>{if(e.target!==cvs||e.button!==0||targeting||!curMap)return;const K=kafraHit(e.clientX,e.clientY);if(!K)return;e.stopImmediatePropagation();
  const p=kafraPos(K),m=W2M(player.x,player.y);if(Math.hypot(m.x-p.x,m.y-p.y)<95){kafraTalk(K);return;}
  const [wx,wy]=M2W({x:p.x,y:p.y+45});command({kind:'move',x:wx,y:wy});pendK={K,t:performance.now()};},true);
cvs.addEventListener('pointermove',e=>{if(!curMap||cvs._npcHover)return;const on=!!kafraHit(e.clientX,e.clientY);if(on!==cvs._kfHover){cvs._kfHover=on;cvs.style.cursor=on?'pointer':'';}});
function kafraTick(){requestAnimationFrame(kafraTick);const K=kafraOn(curMap);if(!K){if(kfCur)kafraClose();return;}if(kfCur&&kfCur.market){const mp=W2M(player.x,player.y);if(Math.hypot(mp.x-kfCur.pos.x,mp.y-kfCur.pos.y)>260)kafraClose();}const p=kafraPos(K);if(!p)return;patchKafra(curMap);const m=W2M(player.x,player.y),d=Math.hypot(m.x-p.x,m.y-p.y);
  if(pendK){if(d<100)kafraTalk(K);else if(!player.moveT&&performance.now()-pendK.t>400)pendK=null;}
  if(kfCur&&kfCur===K&&d>260)kafraClose();   // walked away
  const F=K.face;if(F.pose==='side'){const nx=M2W(p)[0];if(kfCur){F.until=performance.now()+1500;if((player.x>nx+6)!==F.flip&&Math.abs(player.x-nx)>12)turnTo(K,'side',player.x>nx);}else if(performance.now()>(F.until||0))turnTo(K,'front',false);}}
requestAnimationFrame(kafraTick);
{const _e2=enterMap;enterMap=function(id,sp){_e2(id,sp);kafraClose();if(kafraOn(id))patchKafra(id);};}
if(curMap&&kafraOn(curMap))patchKafra(curMap);
addEventListener('keydown',e=>{if(e.key==='Escape'&&kfCur)kafraClose();});
window.AFKafra={KAFRA,WARP_COST,open:k=>kafraMain(KAFRA[k])};
/* =====================================================================
   CENTRAL MARKET MERCHANT (capital only) — raccoon on the red carpet in front of the market tent (cpMarket).
   Six drawn frames (assets/npc/market_0..5.webp): 0/3/5 idle looks, 1/4 blinks, 2 = looking up at the customer (used while talking,
   mirrored when the hero is on the left). Frames cross-fade, and the same breathing as the other NPCs runs underneath.
   ===================================================================== */
const MERCH={map:'capT',name:'โทบี้',sub:'พ่อค้าตลาดกลาง · เมืองหลวง',h:94,m:1,market:1,key:'mk',ax:.423,
  fr:[0,1,2,3,4,5].map(i=>loadImg('assets/npc/market_'+i)),talk:false,flip:false,cur:0,prev:0,ft:0};
MERCH.img={front:MERCH.fr[0]};
/* idle timeline: [frame, seconds] */
const MK_SEQ=[[0,2.2],[1,.14],[0,1.6],[5,1.8],[4,.14],[5,1.2],[3,2.0],[4,.14],[3,1.1],[0,.9],[1,.12],[0,.2],[1,.12],[0,1.4]];
const MK_T=MK_SEQ.reduce((a,b)=>a+b[1],0);
function mkFrame(t){if(MERCH.talk)return 2;let s=(t/1000)%MK_T;for(const [f,d] of MK_SEQ){if(s<d)return f;s-=d;}return 0;}
function mkPos(){if(MERCH.pos)return MERCH.pos;const h=mapHosts.capT;if(!h||!h.ready||!h.cfg||!h.cfg.land)return null;const o=h.cfg.land.find(l=>l.n==='cpMarket');if(!o)return null;
  let p={x:o.x,y:o.y+66};if(h.blocked(p.x,p.y))p=h.nav.nearest(p)||p;return MERCH.pos=p;}
function drawMerch(g,x,y,t){const f=mkFrame(t);if(f!==MERCH.cur){MERCH.prev=MERCH.cur;MERCH.cur=f;MERCH.ft=t;}
  const k=Math.min(1,(t-MERCH.ft)/(MERCH.cur===1||MERCH.cur===4||MERCH.prev===1||MERCH.prev===4?60:160)),fl=MERCH.talk&&MERCH.flip;
  g.save();g.fillStyle='rgba(16,12,22,.32)';g.beginPath();g.ellipse(x,y+1,22,7,0,0,7);g.fill();g.restore();
  const one=(i,a)=>{const F=MERCH.fr[i];if(!F||!F.ok)return;g.save();if(fl){g.translate(x,y);g.scale(-1,1);g.translate(-x,-y);}warpDraw(g,F.img,MERCH.ax,x,y,MERCH.h,t,7,a);g.restore();};
  if(k<1)one(MERCH.prev,1-k);one(MERCH.cur,k<1?k:1);}
function patchMerch(){const h=mapHosts.capT;if(!h||h._merch)return;h._merch=1;const ds=h.drawSorted;
  const fg=h.foreground;h.foreground=function(g,t,night){if(fg)fg.call(h,g,t,night);const o=h.cfg&&h.cfg.land&&h.cfg.land.find(l=>l.n==='cpMarket');if(!o)return;   /* big gold sign over the central market */
    const c=(window.VK_CAT||{}).cpMarket||{h:398},v=o.v||1,b=Math.sin(t*.003)*4,x=o.x,y=o.y-c.h*v*.6+b,s='⚖  ตลาดกลาง  ⚖';g.save();g.textAlign='center';g.font='800 26px Mali,sans-serif';const w=g.measureText(s).width+44;
    const gr=g.createLinearGradient(0,y-24,0,y+16);gr.addColorStop(0,'#c0392b');gr.addColorStop(1,'#7a1d14');g.fillStyle=gr;rr(g,x-w/2,y-26,w,44,12);g.fill();g.strokeStyle='#ffd86a';g.lineWidth=3.5;g.stroke();
    g.fillStyle='#fff1c8';g.strokeStyle='rgba(60,10,6,.85)';g.lineWidth=4;g.strokeText(s,x,y+6);g.fillText(s,x,y+6);g.font='700 13px Mali,sans-serif';g.fillStyle='#ffe08a';g.strokeText('ศูนย์กลางการค้าของเซิร์ฟเวอร์',x,y+36);g.fillText('ศูนย์กลางการค้าของเซิร์ฟเวอร์',x,y+36);g.restore();};
  h.drawSorted=function(g,t,night,items,cam){const p=mkPos();if(p)items=items.concat([{depth:p.y,x:p.x,draw:()=>{drawMerch(g,p.x,p.y,t);
      const top=p.y-MERCH.h-16;g.save();g.textAlign='center';g.font='700 13px Mali,sans-serif';const nm=`${MERCH.name} · ตลาดกลาง`,w=g.measureText(nm).width+16;g.fillStyle='rgba(60,20,20,.72)';rr(g,p.x-w/2,top-2,w,19,7);g.fill();g.fillStyle='#ffe6a8';g.fillText(nm,p.x,top+12);g.font='17px sans-serif';g.fillText('⚖',p.x,top-8+Math.sin(t*.004)*2);g.restore();}}]);
    return ds.call(h,g,t,night,items,cam);};}
function merchHit(sx,sy){if(curMap!=='capT')return false;const p=mkPos();if(!p)return false;const [x,y]=screenOf(p.x,p.y);return Math.abs(sx-x)<34*Z&&sy<y+10*Z&&sy>y-(MERCH.h+30)*Z;}
function merchTalk(){pendM=null;const p=mkPos(),[nx,ny]=M2W(p);faceTo&&faceTo(Math.atan2(ny-player.y,nx-player.x));MERCH.talk=true;MERCH.flip=player.x<nx;player.moveT=null;player.moveQ=null;
  kafraShow(MERCH,'ยินดีต้อนรับสู่<b>ตลาดกลาง</b>ครับ! ของจากทั้งห้าเมืองมารวมกันที่นี่ ซื้อขายราคาดีที่สุดในแผ่นดิน — วันนี้จะเอาอะไรดีครับ?',[
    {t:'⚖ ตลาดกลาง (ซื้อขายกับพ่อค้าทั่วแผ่นดิน)',f:()=>{kafraClose();AFItems.openMarket();}},{t:'🛒 ร้านค้าเมืองหลวง',f:()=>{kafraClose();AFItems.openShop();}},{t:'ยกเลิก',f:kafraClose}]);}
let pendM=null;
addEventListener('pointerdown',e=>{if(e.target!==cvs||e.button!==0||targeting||!merchHit(e.clientX,e.clientY))return;e.stopImmediatePropagation();
  const p=mkPos(),m=W2M(player.x,player.y);if(Math.hypot(m.x-p.x,m.y-p.y)<95){merchTalk();return;}
  const [wx,wy]=M2W({x:p.x,y:p.y+45});command({kind:'move',x:wx,y:wy});pendM={t:performance.now()};},true);
cvs.addEventListener('pointermove',e=>{if(curMap!=='capT'||cvs._npcHover||cvs._kfHover)return;const on=merchHit(e.clientX,e.clientY);if(on!==cvs._mkHover){cvs._mkHover=on;cvs.style.cursor=on?'pointer':'';}});
(function mtick(){requestAnimationFrame(mtick);if(curMap!=='capT'){MERCH.talk=false;pendM=null;return;}patchMerch();const p=mkPos();if(!p)return;const m=W2M(player.x,player.y),d=Math.hypot(m.x-p.x,m.y-p.y);
  if(pendM){if(d<100)merchTalk();else if(!player.moveT&&performance.now()-pendM.t>400)pendM=null;}
  if(MERCH.talk){const nx=M2W(p)[0];if(kfCur===MERCH)MERCH.until=performance.now()+1400;else if(performance.now()>(MERCH.until||0))MERCH.talk=false;if(Math.abs(player.x-nx)>12)MERCH.flip=player.x<nx;}})();
if(curMap==='capT')patchMerch();
window.AFMarket={MERCH,open:merchTalk};

/* ---------------- capital halls: dialogs ---------------- */
const hcss=document.createElement('style');hcss.textContent=kcss.textContent.replace(/#kfdlg/g,'#hldlg')+`
#hldlg{bottom:auto;top:50%;transform:translate(-50%,-50%);width:min(520px,94vw)}#hldlg .bt{max-height:52vh;overflow:auto}
#hldlg .row{display:flex;gap:8px;align-items:center}#hldlg .row img{width:34px;height:34px;object-fit:contain}#hldlg .row .m{flex:1;text-align:left}#hldlg .row small{display:block;color:#8a6a4a;font-weight:600}
#hldlg .x{margin-left:auto;cursor:pointer;font-size:18px;padding:0 4px}`;document.head.appendChild(hcss);
const hdlg=document.createElement('div');hdlg.id='hldlg';document.body.appendChild(hdlg);hdlg.addEventListener('pointerdown',e=>e.stopPropagation());
function hlClose(){hdlg.style.display='none';hlOpen=null;}
function hlShow(n,sub,text,buttons){hlOpen=n.key;const fr=n.img.front.ok?n.img.front.img.src:'';
  hdlg.innerHTML=`<div class="hd">${fr?`<img src="${fr}">`:''}<div><b>${n.npc}</b><small>${sub}</small></div><span class="x">✕</span></div><div class="tx">${text}</div><div class="bt"></div>`;
  hdlg.querySelector('.x').onclick=hlClose;const bt=hdlg.querySelector('.bt');
  for(const b of buttons){const e=document.createElement('button');e.innerHTML=b.html;if(b.dis)e.disabled=true;e.onclick=b.fn;bt.appendChild(e);}
  const c=document.createElement('button');c.innerHTML='<span>ปิด</span>';c.onclick=hlClose;bt.appendChild(c);hdlg.style.display='block';}
/* close the dialog when the hero walks away from the counter */
(function hlTick(){requestAnimationFrame(hlTick);if(!hlOpen)return;const R=ROOMS[curMap],n=R&&R.npcs&&R.npcs.find(x=>x.key===hlOpen);if(!n){hlClose();return;}
  const m=W2M(player.x,player.y);if(Math.hypot(m.x-n.pos.x,m.y-n.pos.y)>420)hlClose();})();
/* ---- weapon / armour merchants: the monster-drop sets (Traveler Lv1 … Ancient Lv90), up to the hero's level band ---- */
const SLOT_TH={armor:'ชุดเกราะ',top:'หมวก',garment:'ผ้าคลุม',shoes:'รองเท้า',acc:'เครื่องประดับ'};
function gearShop(n,kind){const A=AFItems,lv=(typeof PS!=='undefined'&&PS.lv)||1,maxG=A.gradeOfLv?A.gradeOfLv(lv):Math.min(9,Math.floor(lv/10)),slots=kind==='weapon'?['rhand']:['armor','top','shoes','acc'];   /* 5 gear slots since 2026-11-21 */
  const price=g=>Math.round(A.eqFair(g,0)*.6/10)*10,btn=[];
  for(let g=0;g<=maxG;g++)for(const s of slots){const D=A.DSET[g],nm=s==='rhand'?`${D[0]}'s ${A.W_NOUN[CHAR]||'Weapon'}`:`${D[0]}'s ${(A.SLOTS[s]&&A.SLOTS[s].noun)||s}`,pr=price(g);
    const key=s==='rhand'?`ds_${g}_${CHAR}`:`ds_${g}_${s}`;
    btn.push({html:`<span class="row"><img src="assets/items/${key}.png" onerror="this.style.visibility='hidden'"><span class="m">${nm}<small>${s==='rhand'?'อาวุธ':SLOT_TH[s]} · เซ็ทดรอป Lv${g?g*10:1}</small></span></span><em>${pr.toLocaleString()}z</em>`,dis:A.zeny<pr,
      fn:()=>{const id=A.dropSetItem(g,s);if(A.buyGear(id,pr)){chatLog('sys',`ซื้อ <b>${nm}</b> แล้ว (−${pr.toLocaleString()}z)`);msg('ซื้อแล้ว: '+nm);gearShop(n,kind);}else{A.dropItem(id);msg('Zeny ไม่พอ');}}});}
  hlShow(n,kind==='weapon'?'ร้านอาวุธ · เมืองหลวง':'ร้านชุดเกราะ · เมืองหลวง',`${n.hello}<br><small>มี ${A.zeny.toLocaleString()}z · ขายของเซ็ทดรอปถึงระดับเลเวลของคุณ (อยากได้ของแรงกว่านี้ต้องคราฟที่โรงคราฟ)</small>`,btn);}
/* ---- guild master: the world bosses (world_boss.js, 2026-11-23 — replaces the old Aether Wyrm placeholder) ---- */
function guildMenu(n){const W=window.WBOSS,I=W&&W.INFO,now=Date.now(),day=['khepra','puijantra','burumba','mayawee','brontara','lumina','urtok'][new Date(now+7*3600e3).getUTCDay()],T=I&&I[day];
  const nx=W&&W.nextRound?W.nextRound(now):null,cur=W&&W.curRound?W.curRound(now):null,hh=ms=>{const d=new Date(ms+7*3600e3);return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
  hlShow(n,'กิลด์มาสเตอร์ · กิลด์นักผจญภัย',`${n.hello}<br><small>บอสโลกวันนี้ <b>${T?T.full:'-'}</b> · ตื่นทุกวัน 12:30 และ 20:30 (เวลาไทย) · ${cur?'<b style="color:#ffd36a">ประตูลานเปิดอยู่!</b>':nx?'รอบต่อไป '+hh(nx.st):''} · Lv 20+</small>`,
    [{html:'<span>⚔ บอสโลก</span><em>'+(cur?'เปิดลาน':'ดูรอบ')+'</em>',dis:!W,fn:()=>{hlClose();W.open();}},
     {html:'<span>⭐ ร้านเกล็ดดาว</span><em>แลกของ</em>',dis:!W,fn:()=>{hlClose();W.shop();}},
     {html:'<span>🗺 ลานบอสโลก 7 ลาน</span><em>ชมลาน</em>',dis:!(window.WB_ARENAS||[]).length,fn:()=>wbArenaMenu(n)}]);}
/* world-boss arenas (maps/wboss-arenas.js): walk round each themed arena; outside a fight its boss sleeps in the middle */
function wbArenaMenu(n){const DAY={wbKhepra:'อาทิตย์',wbPuijantra:'จันทร์',wbBurumba:'อังคาร',wbMayawee:'พุธ',wbBrontara:'พฤหัส',wbLumina:'ศุกร์',wbLuminaIn:'ศุกร์',wbUrtok:'เสาร์'};
  hlShow(n,'กิลด์มาสเตอร์ · ลานบอสโลก','ลานของบอสโลกทั้ง 7 วัน · นอกเวลาศึก บอสนอนหลับอยู่กลางลาน<br><small>ทางกลับ = วงเรืองแสงหน้าหินจุดเกิดในค่ายกิลด์</small>',
    [...(window.WB_ARENAS||[]).filter(id=>id!=='wbLuminaIn').map(id=>({html:`<span>${DAY[id]?DAY[id]+' · ':''}${(VK_MAPS[id]||{}).name||id}</span><em>ไป</em>`,fn:()=>{hlClose();chatLog('sys','กิลด์พาคุณไปยัง <b>'+((VK_MAPS[id]||{}).name||id)+'</b>');mapTravel(id,null);}})),
     {html:'<span>← กลับ</span>',fn:()=>guildMenu(n)}]);}


})();
