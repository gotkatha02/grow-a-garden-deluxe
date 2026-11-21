/* =====================================================================
   TOTEM LEGEND — AZURE DRAGON-LION · fist fighter (Japan) — 12 Tails style
   Character module. Loaded only when the dragon is played; index.html calls installDragon().
   Design: DRAGON_SKILLS_TH.md

     Basic  · Azure Pupil           — fist combo + tail sweep, Komainu Guard, Horn Rush, Calm Breath, Iron Mane, Lion's Roar
     A Tree · Raging Tide Fist      — melee rush, FLOW 0–5 (each layer ATK +8, lost after 3 s without a landed punch),
                                      finishers spend Flow (physical, ATK)
     B Tree · Cloud Dragon Palm     — mid range palms, KI ORBS 0–3 orbit the body, THUNDER SEALS 0–3 on enemies
                                      (3 seals = lightning). Zones, knock-back, control (magic, TAL)
     C Tree · Shishi-Ryu Sovereign  — 12 nodes, each tied to the Basic / A / B skill of the same row (Lv 55 / 60 / 70 / 80)

   Two-way hero: A = ATK, B = TAL, Basic / normal attack = the higher of the two.
   Owner's rules: no percent effects (flat numbers, counters instead of chances). Attack speed fixed (CHAR_ASPD).
   Sprites: placeholder from one turnaround image (assets_dragon.js, tools/statichero.py).
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const DG_BAL={
  flow:{cap:5,atk:8,keep:3},
  orb:{cap:3},
  seal:{need:3,dur:10},
  sk:{
    // ---- Basic
    dnCombo:{chain:[2,3,4,4],hit:1.0},
    dnSweep:{dmg:[1.2,1.4,1.6],R:90},
    dnGuard:{T:1,atk:[30,50,70],cd:10,mp:8},
    dnRush:{dist:[140,170,200],dmg:1.5,cd:8,mp:10},
    dnBreath:{T:2,hp:[4,6],sp:[15,25],cd:25,mp:0},
    dnMane:{block:[3,6,9,12]},
    dnRoar:{R:160,taunt:4,atk:[20,35,50],dur:10,cd:24,mp:14},
    // ---- A · Raging Tide Fist
    daJab:{n:3,dmg:[.7,.75,.8,.85],cd:5,mp:8,range:110},
    daRising:{every:4,dmg:[.8,1.0,1.2]},
    daHook:{dmg:[1.8,2.2],flow:2,cd:8,mp:12,range:200},
    daUndertow:{R:[90,120]},
    daStep:{dmg:[1.6,2.0],cd:9,mp:12,range:220},
    daCounter:{dmg:[2.0,2.6]},
    daHundred:{n:10,dmg:[.45,.55],cd:14,mp:20,range:110},
    daEndless:{extra:4},
    daTsunami:{dmg:[2.5,3.0],per:.6,cd:12,mp:20,range:110},
    daCrash:{dmg:[1.6,2.0],R:100},
    daFlowBody:{block:[6,10,14]},
    daEbb:{T:2,base:2.0,cap:3,cd:18,mp:16},
    daTorrent:{n:6,dmg:[3.0,4.0],per:.5,cd:60,mp:50,range:320},
    daOcean:{T:8},
    // ---- B · Cloud Dragon Palm
    dkPalm:{dmg:[1.2,1.4,1.6,1.8],len:260,cd:5,mp:10,range:260},
    dkOrbit:{dmg:[.3,.4,.5],R:100},
    dkSeal:{dmg:[1.4,1.8],bolt:3.0,cd:8,mp:12,range:240},
    dkStorm:{jump:[1,2]},
    dkCloud:{dist:120,R:70,slow:[3,4],cd:12,mp:12},
    dkRain:{dmg:[.5,.7]},
    dkTwin:{dmg:[2.0,2.5],len:300,cd:12,mp:20,range:300},
    dkCoil:{T:4,block:15},
    dkPush:{dmg:[2.2,2.8],per:.8,R:130,cd:14,mp:20},
    dkWall:{T:4,len:140},
    dkStill:{T:1,tal:[20,35,50]},
    dkMirror:{T:2,dmg:1.5,cd:20,mp:14},
    dkDescend:{R:180,T:6,dmg:[1.6,2.2],cd:60,mp:50,range:300},
    dkKingRain:{per:1.0},
    // ---- C
    dcChain:{dmg:1.6,len:120},
    dcBarrage:{n:5},
    dcFan:{n:3,spread:.35},
    dcStone:{dmg:1.5,R:110},
    dcMaelstrom:{R:150,T:2,dmg:2.4,cd:20,mp:24},
    dcThunder:{n:3,fall:[.7,.5,.35]},
    dcBreath:{dmg:2.6,R:170,cd:18,mp:20},
    dcThousand:{dmg:2.0,len:220},
    dcNine:{n:4},
    dcAwaken:{T:15,atk:60,cd:90,mp:40},
    dcAbyss:{dmg:4.5,per:.8,len:300,cd:45,mp:40},
    dcSovereign:{T:5,bolt:1.2,cd:60,mp:40}
  }
};
const DB=DG_BAL.sk;
const dX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const dT=n=>'TAL×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const DG_DEFS=[
 // ---------------- BASIC · AZURE PUPIL ----------------
 {key:'dnCombo',id:'DL-B01',name:'Azure Fist Combo',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) หมัดซ้าย-ขวาต่อเนื่อง',lv:i=>[`ต่อ ${DB.dnCombo.chain[i-1]} จังหวะ`]},
 {key:'dnSweep',id:'DL-B02',name:'Dragon Tail Sweep',br:'basic',row:1,max:3,passive:1,d:'(Passive) จังหวะสุดท้ายของตีปกติเป็นหางกวาดรอบตัว',lv:i=>[`${dX(DB.dnSweep.dmg[i-1])} รอบตัว ${DB.dnSweep.R}`,'ศัตรูชะงักสั้น ๆ']},
 {key:'dnGuard',id:'DL-B03',name:'Komainu Guard',br:'basic',row:2,max:3,type:'self',d:'ตั้งการ์ดโคมะอินุ 1 วิ กันการโจมตีครั้งแรกได้หมด แล้วหมัดถัดไปแรงขึ้น',lv:i=>[`กันได้ 1 ครั้ง (Perfect)`,`หมัดถัดไป ATK +${DB.dnGuard.atk[i-1]}`,`Cooldown ${DB.dnGuard.cd} วิ`]},
 {key:'dnRush',id:'DL-B04',name:'Horn Rush',br:'basic',row:2,max:3,type:'self',d:'พุ่งเอาเขาชนทุกตัวที่ขวางทาง ผลักถอย',lv:i=>[`ระยะ ${DB.dnRush.dist[i-1]}`,`${dX(DB.dnRush.dmg)}`,`Cooldown ${DB.dnRush.cd} วิ`]},
 {key:'dnBreath',id:'DL-B05',name:'Calm Breath',br:'basic',row:3,max:2,type:'self',d:'หายใจลึก 2 วิ ฟื้น HP และ SP · ถูกตีระหว่างนี้ไม่ขาด',lv:i=>[`ฟื้น HP = เลเวล × ${DB.dnBreath.hp[i-1]}`,`ฟื้น SP ${DB.dnBreath.sp[i-1]}`,`Cooldown ${DB.dnBreath.cd} วิ`]},
 {key:'dnMane',id:'DL-B06',name:'Iron Mane',br:'basic',row:3,max:4,passive:1,d:'(Passive) แผงคอหนา ดาเมจที่ได้รับลดลงทุกครั้ง',lv:i=>[`ดาเมจที่ได้รับ −${DB.dnMane.block[i-1]} ต่อครั้ง`]},
 {key:'dnRoar',id:'DL-B07',name:"Lion's Roar",br:'basic',row:4,max:3,type:'self',d:'คำรามดึงศัตรูรอบตัวให้หันมาตี ATK เพิ่ม',lv:i=>[`ศัตรูรอบตัว ${DB.dnRoar.R} ชะงัก`,`ATK +${DB.dnRoar.atk[i-1]} นาน ${DB.dnRoar.dur} วิ`,`Cooldown ${DB.dnRoar.cd} วิ`]},
 // ---------------- A · RAGING TIDE FIST ----------------
 {key:'daJab',id:'DL-A01',name:'Tide Jab',br:'A',row:1,max:4,type:'melee',d:'แย็บเร็ว 3 หมัด ได้กระแสทุกหมัด (อัปสลับเลเวลกับ Whirlpool Hook)',lv:i=>[`${dX(DB.daJab.dmg[i-1])} × ${DB.daJab.n}`,'กระแส +1 ต่อหมัด',`Cooldown ${DB.daJab.cd} วิ`]},
 {key:'daRising',id:'DL-A02',name:'Rising Wave',br:'A',row:2,max:3,passive:1,d:'(Passive) ตอนมีกระแส 3 ชั้นขึ้นไป ทุกหมัดที่ 4 ต่อยแถม 1 หมัด',lv:i=>[`หมัดแถม ${dX(DB.daRising.dmg[i-1])}`]},
 {key:'daHook',id:'DL-A03',name:'Whirlpool Hook',br:'A',row:3,max:2,type:'melee',pre:[['daJab',1]],d:'ฮุกดึงเป้ามาชิดตัว ได้กระแส 2 ชั้น',lv:i=>[`${dX(DB.daHook.dmg[i-1])}`,'ดึงเป้ามาชิด (บอสไม่ขยับ)',`Cooldown ${DB.daHook.cd} วิ`]},
 {key:'daUndertow',id:'DL-A04',name:'Undertow',br:'A',row:3,max:2,passive:1,enh:'daHook',pre:[['daHook',1]],d:'(ต่อยอด Whirlpool Hook) ดึงศัตรูตัวเล็กรอบเป้ามาด้วย',lv:i=>[`รัศมี ${DB.daUndertow.R[i-1]}`]},
 {key:'daStep',id:'DL-A05',name:'Riptide Step',br:'A',row:4,max:2,type:'melee',d:'พุ่งทะลุเป้าไปด้านหลัง ไม่โดนตีระหว่างพุ่ง ต่อยหลัง',lv:i=>[`${dX(DB.daStep.dmg[i-1])}`,'อมตะระหว่างพุ่ง',`Cooldown ${DB.daStep.cd} วิ`]},
 {key:'daCounter',id:'DL-A06',name:'Riptide Counter',br:'A',row:4,max:2,passive:1,enh:'daStep',pre:[['daStep',1]],d:'(ต่อยอด Riptide Step) พุ่งทะลุจังหวะที่เป้ากำลังโจมตี ต่อยสวนอีกหมัด',lv:i=>[`ต่อยสวน ${dX(DB.daCounter.dmg[i-1])}`]},
 {key:'daHundred',id:'DL-A07',name:'Hundred Waves',br:'A',row:5,max:2,type:'melee',d:'ต่อยรัว 10 หมัด กระแสเต็มทันที',lv:i=>[`${dX(DB.daHundred.dmg[i-1])} × ${DB.daHundred.n}`,`Cooldown ${DB.daHundred.cd} วิ`]},
 {key:'daEndless',id:'DL-A08',name:'Endless Current',br:'A',row:5,max:1,passive:1,enh:'daHundred',pre:[['daHundred',1]],d:'(ต่อยอด Hundred Waves) เริ่มท่าตอนกระแสเต็ม ต่อยเพิ่มอีก 4 หมัด',lv:()=>[`+${DB.daEndless.extra} หมัด`]},
 {key:'daTsunami',id:'DL-A09',name:'Tsunami Uppercut',br:'A',row:6,max:2,type:'melee',d:'อัปเปอร์คัตใช้กระแสทั้งหมด เป้าลอย',lv:i=>[`${dX(DB.daTsunami.dmg[i-1])} + ${dX(DB.daTsunami.per)} ต่อชั้นกระแส`,`Cooldown ${DB.daTsunami.cd} วิ`]},
 {key:'daCrash',id:'DL-A10',name:'Crashing Tide',br:'A',row:6,max:2,passive:1,enh:'daTsunami',pre:[['daTsunami',1]],d:'(ต่อยอด Tsunami Uppercut) ตามด้วยทุบลงพื้นรอบเป้า',lv:i=>[`${dX(DB.daCrash.dmg[i-1])} รัศมี ${DB.daCrash.R}`]},
 {key:'daFlowBody',id:'DL-A11',name:'Flowing Body',br:'A',row:7,max:3,passive:1,d:'(Passive) ตอนมีกระแส 3 ชั้นขึ้นไป ดาเมจที่ได้รับลดลง',lv:i=>[`ดาเมจที่ได้รับ −${DB.daFlowBody.block[i-1]} ต่อครั้ง`]},
 {key:'daEbb',id:'DL-A12',name:'Ebb and Flow',br:'A',row:7,max:1,type:'self',d:'ยืนรับ 2 วิ เก็บดาเมจที่ได้รับ แล้วปล่อยหมัดเดียว',lv:()=>[`${dX(DB.daEbb.base)} + ดาเมจที่เก็บ (สูงสุด ${dX(DB.daEbb.cap)})`,`Cooldown ${DB.daEbb.cd} วิ`]},
 {key:'daTorrent',id:'DL-A13',name:'Great Azure Torrent',br:'A',row:8,max:2,type:'melee',ult:1,d:'ULTIMATE A · หายตัวพุ่งต่อยศัตรูทีละตัว สูงสุด 6 ตัว แล้วกลับที่เดิม',lv:i=>[`${dX(DB.daTorrent.dmg[i-1])} + ${dX(DB.daTorrent.per)} ต่อชั้นกระแส ต่อตัว`,`Cooldown ${DB.daTorrent.cd} วิ`]},
 {key:'daOcean',id:'DL-A14',name:'Ocean Never Rests',br:'A',row:8,max:1,passive:1,enh:'daTorrent',pre:[['daTorrent',1]],d:'(ต่อยอด Great Azure Torrent) จบอัลติแล้วกระแสเต็มค้างไว้ 8 วิ',lv:()=>[`กระแสเต็ม ${DB.daOcean.T} วิ`]},
 // ---------------- B · CLOUD DRAGON PALM ----------------
 {key:'dkPalm',id:'DL-G01',name:'Wind Palm',br:'B',row:1,max:4,type:'melee',d:'ผลักฝ่ามือเป็นคลื่นลมทะลุแนวตรง ได้ลูกแก้วปราณ (อัปสลับเลเวลกับ Thunder Seal Palm)',lv:i=>[`${dT(DB.dkPalm.dmg[i-1])}`,'ลูกแก้วปราณ +1',`Cooldown ${DB.dkPalm.cd} วิ`]},
 {key:'dkOrbit',id:'DL-G02',name:'Ki Orbit',br:'B',row:2,max:3,passive:1,d:'(Passive) ลูกแก้วปราณที่ลอยรอบตัวชนศัตรูใกล้ ๆ ทุก 1 วิ',lv:i=>[`${dT(DB.dkOrbit.dmg[i-1])} ต่อลูก`]},
 {key:'dkSeal',id:'DL-G03',name:'Thunder Seal Palm',br:'B',row:3,max:2,type:'melee',pre:[['dkPalm',1]],d:'ฝ่ามือติดตราอัสนี ครบ 3 ชั้น ฟ้าผ่าลงทันที',lv:i=>[`${dT(DB.dkSeal.dmg[i-1])} + ตรา 1 ชั้น`,`ครบ 3 ชั้น ฟ้าผ่า ${dT(DB.dkSeal.bolt)}`,`Cooldown ${DB.dkSeal.cd} วิ`]},
 {key:'dkStorm',id:'DL-G04',name:'Storm Seal',br:'B',row:3,max:2,passive:1,enh:'dkSeal',pre:[['dkSeal',1]],d:'(ต่อยอด Thunder Seal Palm) ฟ้าผ่าแล้วตรากระโดดไปติดศัตรูใกล้เคียง',lv:i=>[`กระโดด ${DB.dkStorm.jump[i-1]} ตัว`]},
 {key:'dkCloud',id:'DL-G05',name:'Cloud Step',br:'B',row:4,max:2,type:'self',d:'ก้าวถอย ทิ้งก้อนเมฆที่ทำให้ศัตรูช้าลง',lv:i=>[`ถอย ${DB.dkCloud.dist}`,`เมฆอยู่ ${DB.dkCloud.slow[i-1]} วิ`,`Cooldown ${DB.dkCloud.cd} วิ`]},
 {key:'dkRain',id:'DL-G06',name:'Rain Cloud',br:'B',row:4,max:2,passive:1,enh:'dkCloud',pre:[['dkCloud',1]],d:'(ต่อยอด Cloud Step) ก้อนเมฆมีฝนตก',lv:i=>[`${dT(DB.dkRain.dmg[i-1])} ทุก 1 วิ`]},
 {key:'dkTwin',id:'DL-G07',name:'Twin Dragon Palms',br:'B',row:5,max:2,type:'melee',d:'สองมือปล่อยมังกรปราณ 2 ตัวบินไปข้างหน้า',lv:i=>[`${dT(DB.dkTwin.dmg[i-1])} ทุกเป้าในแนว`,`Cooldown ${DB.dkTwin.cd} วิ`]},
 {key:'dkCoil',id:'DL-G08',name:'Dragon Coil',br:'B',row:5,max:1,passive:1,enh:'dkTwin',pre:[['dkTwin',1]],d:'(ต่อยอด Twin Dragon Palms) มังกรกลับมาวนรอบตัว',lv:()=>[`ดาเมจที่ได้รับ −${DB.dkCoil.block} ต่อครั้ง นาน ${DB.dkCoil.T} วิ`]},
 {key:'dkPush',id:'DL-G09',name:'Heaven Push',br:'B',row:6,max:2,type:'self',d:'ฝ่ามือใหญ่ผลักศัตรูรอบตัวกระเด็น ใช้ลูกแก้วทั้งหมด',lv:i=>[`${dT(DB.dkPush.dmg[i-1])} + ${dT(DB.dkPush.per)} ต่อลูกแก้ว`,`Cooldown ${DB.dkPush.cd} วิ`]},
 {key:'dkWall',id:'DL-G10',name:'Gale Wall',br:'B',row:6,max:1,passive:1,enh:'dkPush',pre:[['dkPush',1]],d:'(ต่อยอด Heaven Push) ทิ้งกำแพงลมด้านหน้า ศัตรูเดินผ่านไม่ได้',lv:()=>[`กำแพงลม ${DB.dkWall.T} วิ`]},
 {key:'dkStill',id:'DL-G11',name:'Still Mind',br:'B',row:7,max:3,passive:1,d:'(Passive) ยืนนิ่ง 1 วิ ฝ่ามือถัดไปแรงขึ้น',lv:i=>[`TAL +${DB.dkStill.tal[i-1]}`]},
 {key:'dkMirror',id:'DL-G12',name:'Mirror Pond',br:'B',row:7,max:1,type:'self',d:'ผิวน้ำสะท้อน 2 วิ การโจมตีระยะไกลที่ยิงใส่สะท้อนกลับ',lv:()=>[`สะท้อน ${dT(DB.dkMirror.dmg)}`,`Cooldown ${DB.dkMirror.cd} วิ`]},
 {key:'dkDescend',id:'DL-G13',name:'Azure Dragon Descends',br:'B',row:8,max:2,type:'ground',ult:1,radius:()=>DB.dkDescend.R,d:'ULTIMATE B · มังกรครามยักษ์ลงมาขดรอบพื้นที่ ฟ้าผ่าทุก 1 วิ ติดตราอัสนี',lv:i=>[`${dT(DB.dkDescend.dmg[i-1])} ทุก 1 วิ นาน ${DB.dkDescend.T} วิ`,`Cooldown ${DB.dkDescend.cd} วิ`]},
 {key:'dkKingRain',id:'DL-G14',name:"Dragon King's Rain",br:'B',row:8,max:1,passive:1,enh:'dkDescend',pre:[['dkDescend',1]],d:'(ต่อยอด Azure Dragon Descends) จบอัลติ ตราอัสนีทุกตัวในพื้นที่ระเบิดพร้อมกัน',lv:()=>[`${dT(DB.dkKingRain.per)} ต่อชั้นตรา`]},
 // ---------------- C · SHISHI-RYU SOVEREIGN (12 nodes, same row) ----------------
 {key:'dcChain',id:'DL-C01',name:'Dragon Chain',br:'C',col:'basic',tier:1,passive:1,pre:[['dnCombo',4]],d:'ตีปกติต่อได้ 5 จังหวะ จังหวะที่ 5 เป็นหมัดปราณพุ่งไกล',lv:()=>[`หมัดปราณ ${dX(DB.dcChain.dmg)} ระยะ ${DB.dcChain.len}`]},
 {key:'dcBarrage',id:'DL-C02',name:'Riptide Barrage',br:'C',col:'A',tier:1,passive:1,pre:[['daJab',4]],d:'Tide Jab แย็บ 5 หมัดแทน 3 หมัดสุดท้ายผลักถอย',lv:()=>['5 หมัด']},
 {key:'dcFan',id:'DL-C03',name:'Gale Fan',br:'C',col:'B',tier:1,passive:1,pre:[['dkPalm',4]],d:'Wind Palm แตกเป็นคลื่น 3 ทาง',lv:()=>['คลื่น 3 ทาง']},
 {key:'dcStone',id:'DL-C04',name:'Stone Guardian',br:'C',col:'basic',tier:2,passive:1,pre:[['dnGuard',3]],d:'Komainu Guard กันได้ ปล่อยคลื่นกระแทกรอบตัว ผลักถอย',lv:()=>[`${dX(DB.dcStone.dmg)} รัศมี ${DB.dcStone.R}`]},
 {key:'dcMaelstrom',id:'DL-C05',name:'Maelstrom',br:'C',col:'A',tier:2,type:'self',pre:[['daHook',2]],d:'[New Active] วังน้ำวนดูดศัตรูรอบตัวเข้ากลาง 2 วิ แล้วต่อยกลางวง',lv:()=>[`ดูด ${DB.dcMaelstrom.R} หน่วย`,`${dT(DB.dcMaelstrom.dmg)}`,`Cooldown ${DB.dcMaelstrom.cd} วิ`]},
 {key:'dcThunder',id:'DL-C06',name:'Thunder Chain',br:'C',col:'B',tier:2,passive:1,pre:[['dkSeal',2]],d:'ฟ้าผ่าจากตราอัสนีกระโดดต่อ 3 ตัว เบาลงทีละขั้น',lv:()=>['ต่อ 3 ตัว']},
 {key:'dcBreath',id:'DL-C07',name:"Dragon's Breath",br:'C',col:'basic',tier:3,type:'melee',pre:[['dnBreath',2]],d:'[New Active] พ่นลมหายใจมังกรเป็นกรวยด้านหน้า ใช้ ATK หรือ TAL ที่สูงกว่า',lv:()=>[`${dX(DB.dcBreath.dmg)} ระยะ ${DB.dcBreath.R}`,`Cooldown ${DB.dcBreath.cd} วิ`]},
 {key:'dcThousand',id:'DL-C08',name:'Thousand Waves',br:'C',col:'A',tier:3,passive:1,pre:[['daHundred',2]],d:'Hundred Waves จบด้วยคลื่นน้ำพุ่งไปข้างหน้า',lv:()=>[`คลื่น ${dX(DB.dcThousand.dmg)}`]},
 {key:'dcNine',id:'DL-C09',name:'Nine Dragons',br:'C',col:'B',tier:3,passive:1,pre:[['dkTwin',2]],d:'Twin Dragon Palms ปล่อยมังกร 4 ตัว กระจายเป็นพัด',lv:()=>['มังกร 4 ตัว']},
 {key:'dcAwaken',id:'DL-C10',name:'Shishi Awakening',br:'C',col:'basic',tier:4,type:'self',pre:[['dnRoar',3]],d:'[New Active] Signature · 15 วิ แผงคอลุกเป็นไฟคราม ตีปกติแรงขึ้น กระแสและลูกแก้วได้ทีละ 2',lv:()=>[`ตีปกติ ATK +${DB.dcAwaken.atk}`,'กระแส / ลูกแก้ว ×2',`Cooldown ${DB.dcAwaken.cd} วิ`]},
 {key:'dcAbyss',id:'DL-C11',name:'Abyssal Torrent',br:'C',col:'A',tier:4,type:'melee',pre:[['daTorrent',1]],d:'[New Active] ทุบพื้นเกิดคลื่นยักษ์กวาดไปข้างหน้า ใช้กระแสทั้งหมด',lv:()=>[`${dX(DB.dcAbyss.dmg)} + ${dX(DB.dcAbyss.per)} ต่อชั้นกระแส`,`Cooldown ${DB.dcAbyss.cd} วิ`]},
 {key:'dcSovereign',id:'DL-C12',name:'Storm Sovereign',br:'C',col:'B',tier:4,type:'self',pre:[['dkDescend',1]],d:'[New Active] ขี่เมฆ 5 วิ ฝ่ามือทุกครั้งเรียกฟ้าผ่าเพิ่ม ศัตรูประชิดตีไม่โดน',lv:()=>[`ฟ้าผ่า ${dT(DB.dcSovereign.bolt)} ต่อฝ่ามือ`,`Cooldown ${DB.dcSovereign.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const DG={flow:0,flowHit:-9,flowLock:0,orbs:0,orbT:0,risingN:0,guardUntil:0,guardUsed:false,guardBonus:false,still:0,stillReady:false,
  ebb:0,ebbOn:false,clouds:[],wall:null,storm:null,mael:null,lastAttacker:null};
const dL=k=>LV[k]||0;
const dLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,dL(k)))-1];
const DGC={sea:'#3aa8ff',sea2:'#bfe8ff',white:'#f4f8ff',gold:'#ffd36a',cloud:'#c8b8ff',thunder:'#fff27a',red:'#ff5a4a',azure:'#4a7aff'};
const dCol=k=>{if(!k||k==='basic')return 'basic';const d=DG_DEFS.find(x=>x.key===k);if(!d)return 'basic';return d.br==='C'?d.col:d.br;};
function dHit(e,mult,key,o={}){if(!e||e.dead)return 0;const br=dCol(key);return hurt(e,mult,Object.assign({skill:key,br,critOK:br!=='B'},o));}
const dNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const dSeg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const dLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&dSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function dFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function dPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!dFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const dTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const dPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const dAwake=()=>hasBuff('dcAwaken');
/* FLOW (A) */
function dFlow(n){if(!dL('daJab')&&!dL('daHook')&&!dL('daHundred'))return;if(dAwake())n*=2;const b=DG.flow;DG.flow=Math.min(DG_BAL.flow.cap,DG.flow+n);DG.flowHit=gameTime;if(DG.flow>b)DG.flowPop=1;}
function dSpendFlow(){const n=DG.flow;if(DG.flowLock>gameTime)return DG_BAL.flow.cap;DG.flow=0;return n;}
/* KI ORBS (B) */
function dOrb(n){if(dAwake())n*=2;DG.orbs=Math.min(DG_BAL.orb.cap,DG.orbs+n);}
/* THUNDER SEALS (B) */
function dSeal(e,n,noJump){if(!e||e.dead)return;e.dgSeal=(e.dgSeal||0)+n;e.dgSealT=gameTime+DG_BAL.seal.dur;e.dgSealPop=1;
  if(e.dgSeal>=DG_BAL.seal.need){e.dgSeal=0;dBolt(e,DB.dkSeal.bolt,'dkSeal');
    if(dL('dcThunder')){let prev=e;const hit=new Set([e]);DB.dcThunder.fall.forEach((m,i)=>setFxTimer(.1*(i+1),()=>{const q=enemies.filter(z=>!z.dead&&!hit.has(z)).sort((a,b)=>dist(a,prev)-dist(b,prev))[0];if(!q||dist(q,prev)>220)return;hit.add(q);dArc(prev,q);dBolt(q,DB.dkSeal.bolt*m,'dcThunder');prev=q;}));}
    if(dL('dkStorm')&&!noJump){const L=enemies.filter(z=>!z.dead&&z!==e&&dist(z,e)<200).slice(0,dLv(DB.dkStorm.jump,'dkStorm'));for(const q of L){dArc(e,q);dSeal(q,1,true);}}}}
function dBolt(e,mult,key){addFx(new DgBolt({x:e.x,y:e.y}));dHit(e,mult,key,{big:true});shake(1.6);}
function dArc(a,b){addFx(new DgArc({a:[a.x,a.y],b:[b.x,b.y]}));}
function dOnPunch(e){/* every landed A punch */dFlow(1);
  if(dL('daRising')&&DG.flow>=3){DG.risingN++;if(DG.risingN>=DB.daRising.every){DG.risingN=0;setFxTimer(.08,()=>{if(e.dead)return;dHit(e,dLv(DB.daRising.dmg,'daRising'),'daRising');dPow(e,false,DGC.sea);});}}}

/* ---------------------------------------------------------------------
   4. FX (code placeholders — painted pieces come later)
   --------------------------------------------------------------------- */
function dGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function dPow(e,big,col){addFx(new Impact({pos:[e.x,e.y,(e.boss?36:24)],size:big?50:28,color:col||DGC.sea2,core:'#ffffff',rays:big?10:6,life:big?.24:.15}));sparks(e.x,e.y,24,angTo(e),big?12:5,col||DGC.sea2,big?320:220,.6);}
function dSplash(x,y,n){for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(60,180);emit({type:'round',x,y,z:rnd(10,30),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(60,180),drag:1,life:rnd(.35,.6),size:rnd(1.5,3),size1:.5,color:Math.random()<.5?DGC.sea2:'#ffffff'});}}
/* ki wave / dragon projectile */
class DgWave{constructor(o){Object.assign(this,{t:0,layer:'top',speed:620,len:260,w:22,z:30,col:DGC.cloud,kind:'wave',hits:new Set(),d:0},o);this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;const st=this.speed*dt;this.d+=st;const wob=this.kind==='dragon'?Math.sin(this.t*14+this.ph)*16:0,nx=-Math.sin(this.phi),ny=Math.cos(this.phi);
    this.x=this.x0+Math.cos(this.phi)*this.d+nx*wob;this.y=this.y0+Math.sin(this.phi)*this.d+ny*wob;if(!dFree(this.x,this.y))return false;
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w){this.hits.add(e);this.onHit&&this.onHit(e);}}return this.d<this.len;}
  draw(){const [x,y]=P(this.x,this.y,this.z),k=this.d/this.len,a=Math.min(1,(1-k)*3),ang=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi));dGlow(x,y,this.w*1.8,this.col,.45*a);
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha=a;ctx.fillStyle='#ffffff';
    if(this.kind==='dragon'){ctx.fillStyle=this.col;ctx.beginPath();ctx.ellipse(0,0,this.w*.9,this.w*.45,0,0,TAU);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(this.w*.5,-2,3,0,TAU);ctx.fill();}
    else{ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-this.w*.4,0,this.w,-.9,.9);ctx.stroke();ctx.strokeStyle=this.col;ctx.lineWidth=6;ctx.globalAlpha=a*.6;ctx.beginPath();ctx.arc(-this.w*.6,0,this.w*1.1,-1,1);ctx.stroke();}
    ctx.restore();ctx.globalAlpha=1;}}
class DgBolt{constructor(o){Object.assign(this,{t:0,life:.35,layer:'top'},o);this.j=[];for(let i=0;i<7;i++)this.j.push(rnd(-10,10));}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=P(this.x,this.y,0),top=y-220;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(DGC.thunder,a);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+this.j[0],top);
    for(let i=1;i<7;i++)ctx.lineTo(x+this.j[i],top+(y-top)*i/6);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a);ctx.lineWidth=1.5;ctx.stroke();ctx.restore();dGlow(x,y,40,DGC.thunder,.5*a);}}
class DgArc{constructor(o){Object.assign(this,{t:0,life:.25,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x0,y0]=P(this.a[0],this.a[1],30),[x1,y1]=P(this.b[0],this.b[1],30);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(DGC.thunder,a);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,y0);
    for(let i=1;i<6;i++)ctx.lineTo(lerp(x0,x1,i/6)+rnd(-8,8),lerp(y0,y1,i/6)+rnd(-8,8));ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();}}
/* ground layer: clouds, storm zone, gale wall, maelstrom */
class DgGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='dragon';}
  draw(){for(const c of DG.clouds){const a=Math.min(1,(c.until-gameTime)/.4),[x,y]=P(c.x,c.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.45*a;const g=ctx.createRadialGradient(0,0,0,0,0,c.R);g.addColorStop(0,'#e8e0ff');g.addColorStop(1,'rgba(200,184,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,c.R,0,TAU);ctx.fill();ctx.restore();}
    const S=DG.storm;if(S){const [x,y]=P(S.x,S.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.5;ctx.strokeStyle=DGC.azure;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,S.R,this.t,this.t+TAU*.8);ctx.stroke();ctx.globalAlpha=.18;ctx.fillStyle=DGC.azure;ctx.beginPath();ctx.arc(0,0,S.R,0,TAU);ctx.fill();ctx.restore();}
    const M=DG.mael;if(M){const [x,y]=P(M.x,M.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.45;ctx.strokeStyle=DGC.sea;ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,M.R*(.35+.3*i),-this.t*6+i,-this.t*6+i+4);ctx.stroke();}ctx.restore();}
    const W=DG.wall;if(W){const nx=-Math.sin(W.phi),ny=Math.cos(W.phi),L=DB.dkWall.len/2,[ax,ay]=P(W.x+nx*L,W.y+ny*L),[bx,by]=P(W.x-nx*L,W.y-ny*L);ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='#e8f4ff';ctx.lineWidth=8;ctx.setLineDash([10,6]);ctx.lineDashOffset=-this.t*60;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.restore();}}}
/* top layer: flow pips, ki orbs, seals */
class DgTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;DG.flowPop=Math.max(0,(DG.flowPop||0)-dt*4);return CHAR==='dragon';}
  draw(){const pz=(player.z||0)+92*CHAR_SCALE;
    if(DG.flow>0){const [x,y]=P(player.x,player.y,pz);for(let i=0;i<DG_BAL.flow.cap;i++){const on=i<DG.flow,px=x+(i-2)*9;ctx.fillStyle=on?DGC.sea:'rgba(20,30,50,.55)';ctx.beginPath();ctx.moveTo(px,y-4-(on?DG.flowPop*3:0));ctx.lineTo(px+4,y);ctx.lineTo(px,y+4);ctx.lineTo(px-4,y);ctx.closePath();ctx.fill();}}
    for(let i=0;i<DG.orbs;i++){const an=this.t*2.4+i*TAU/DG_BAL.orb.cap,[x,y]=P(player.x+Math.cos(an)*30,player.y+Math.sin(an)*18,(player.z||0)+40);dGlow(x,y,12,DGC.cloud,.7);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
    if(hasBuff('dkCoil')){for(let i=0;i<2;i++){const an=-this.t*3+i*Math.PI,[x,y]=P(player.x+Math.cos(an)*40,player.y+Math.sin(an)*26,40);dGlow(x,y,14,DGC.azure,.6);}}
    if(hasBuff('dcAwaken')){const [x,y]=P(player.x,player.y,(player.z||0)+60*CHAR_SCALE);dGlow(x,y,46,DGC.azure,.35+.1*Math.sin(this.t*8));}
    if(hasBuff('dkMirror')){const [x,y]=P(player.x,player.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.strokeStyle=hexA('#bfe8ff',.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.stroke();ctx.restore();}
    for(const e of enemies){if(e.dead||!(e.dgSeal>0))continue;const [x,y]=P(e.x,e.y,(e.boss?100:70)+(e.z||0));for(let i=0;i<e.dgSeal;i++){const px=x+(i-1)*9;dGlow(px,y,7,DGC.thunder,.7);ctx.fillStyle='#fff7c0';ctx.fillRect(px-1.5,y-4,3,8);}}}}
/* per-frame logic */
class DgCore{constructor(){this.t=0;this.layer='none';this.tk=0;}draw(){}
  update(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new DgGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new DgTop());
    /* flow fades 3 s after the last landed punch (Ocean Never Rests keeps it full) */
    if(DG.flowLock>gameTime)DG.flow=DG_BAL.flow.cap;else if(DG.flow>0&&gameTime-DG.flowHit>DG_BAL.flow.keep)DG.flow=0;
    /* still mind */
    if(dL('dkStill')){if(!player.moving&&!player.action){DG.still+=dt;if(DG.still>=DB.dkStill.T)DG.stillReady=true;}else DG.still=0;}
    /* seals expire */
    for(const e of enemies)if(e.dgSeal>0&&e.dgSealT<gameTime)e.dgSeal=0;
    /* ki orbit hits */
    if(dL('dkOrbit')&&DG.orbs>0){DG.orbT+=dt;if(DG.orbT>=1){DG.orbT=0;for(let i=0;i<DG.orbs;i++){const e=nearestEnemy(player.x,player.y,DB.dkOrbit.R);if(!e)break;dHit(e,dLv(DB.dkOrbit.dmg,'dkOrbit'),'dkOrbit');dPow(e,false,DGC.cloud);}}}
    this.tk+=dt;const tick=this.tk>=1;if(tick)this.tk=0;
    /* clouds */
    DG.clouds=DG.clouds.filter(c=>c.until>gameTime);for(const c of DG.clouds){for(const e of dNear(c.x,c.y,c.R))applyCC(e,{slow:.4});if(tick&&c.rain)for(const e of dNear(c.x,c.y,c.R))dHit(e,c.rain,'dkRain');
      if(c.rain&&Math.random()<Q.p*1.2)emit({type:'round',x:c.x+rnd(-c.R,c.R),y:c.y+rnd(-c.R,c.R)*.6,z:90,vx:0,vy:0,vz:-260,drag:0,life:.35,size:1.6,size1:1,color:'#cfe8ff'});}
    /* azure dragon zone */
    const S=DG.storm;if(S){if(S.until<gameTime){DG.storm=null;if(S.king){for(const e of dNear(S.x,S.y,S.R+40)){const n=e.dgSeal||0;if(n>0){e.dgSeal=0;dBolt(e,DB.dkKingRain.per*n,'dkKingRain');}}}}
      else if((S.tk+=dt)>=1){S.tk=0;for(const e of dNear(S.x,S.y,S.R)){dBolt(e,S.dmg,'dkDescend');dSeal(e,1);}}}
    /* gale wall: enemies cannot walk through */
    const W=DG.wall;if(W){if(W.until<gameTime)DG.wall=null;else{const nx=-Math.sin(W.phi),ny=Math.cos(W.phi),L=DB.dkWall.len/2;for(const e of enemies){if(e.dead||e.boss)continue;const d=dSeg(e.x,e.y,W.x+nx*L,W.y+ny*L,W.x-nx*L,W.y-ny*L);
      if(d<e.r+10){const side=Math.cos(W.phi)*(e.x-W.x)+Math.sin(W.phi)*(e.y-W.y),s=side>=0?1:-1;e.x=W.x+nx*((e.x-W.x)*nx+(e.y-W.y)*ny)+Math.cos(W.phi)*s*(e.r+12);e.y=W.y+ny*((e.x-W.x)*nx+(e.y-W.y)*ny)+Math.sin(W.phi)*s*(e.r+12);}}}}
    /* maelstrom pull */
    const M=DG.mael;if(M){for(const e of dNear(M.x,M.y,M.R)){if(e.boss)continue;const d=Math.hypot(M.x-e.x,M.y-e.y);if(d>8){e.x+=(M.x-e.x)/d*Math.min(d,140*dt);e.y+=(M.y-e.y)/d*Math.min(d,140*dt);}}}
    return CHAR==='dragon';}}
/* 2026-11-21 bug fix: DgCore.update returned nothing, so the engine dropped the ticker after its first frame (and the bench clears
   fx entirely): flow never faded, Still Mind / Ki Orbit never worked, clouds never slowed or rained, Gale Wall never blocked,
   Maelstrom never pulled, Azure Dragon Descends never struck and its zone never ended. One core, re-added on every cast. */
let dgCore=null;
function dEnsure(){if(CHAR!=='dragon')return;if(!dgCore||!fx.includes(dgCore)){const o=fx.find(f=>f instanceof DgCore);dgCore=o||addFx(new DgCore());}}
window.dEnsure=dEnsure;

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
/* n punches on the attack clip; f(a,i,last) runs on each impact frame */
function dPunches(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),sp=(o.speed||1)*aspd();let s=[];const n=o.n||1;
  for(let i=0;i<n;i++){const last=i===n-1;s=s.concat(last?seq('attack',d,n>1?ct-3:Math.max(0,ct-3),null,(o.lastSpeed||1.4)*sp):seq('attack',d,ct-2,ct+1,(o.midSpeed||3.2)*sp));}
  const ks=[];for(let i=0;i<n;i++)ks.push(seqIndex(s,'attack',ct,i));const ev=ks.map((kC,i)=>({t:seqTimeAt(s,kC),f:a=>o.f(a,i,i===n-1)}));
  const kL=ks[ks.length-1];return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,ks[0]),dur:seqTimeAt(s,kL+2),hitList:[],
    update:(a,dt)=>{player.glow={color:o.glow||DGC.sea,k:a.t<seqTimeAt(s,kL)?.7:Math.max(0,1-(a.t-seqTimeAt(s,kL))/.3)};o.update&&o.update(a,dt);},events:ev.concat(o.events||[])});}
/* cone punch: hit everything in front, return the list */
function dCone(a,phi,key,mult,o={}){const L=enemiesInCone(player.x,player.y,phi,o.range||(BASIC_RANGE+30),o.half||.7);for(const e of L){dHit(e,mult,key,o.hurt||{});if(!a.hitList.includes(e))a.hitList.push(e);if(o.each)o.each(e);dPow(e,o.big,o.col);}
  if(L.length){a.hitConfirmed=true;shake(o.big?2.6:1);stop(o.big?60:24);}return L;}
function dBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||DGC.sea,events:tP=>[{t:tP,f:()=>o.f()}]});}
function dDash(o){faceTo(o.phi);const sx=player.x,sy=player.y,[dx,dy]=dPathEnd(sx,sy,o.phi,o.L),T=o.T||.24,s=seq('walk',player.dir,0,null,3.2);
  return act({key:o.key,name:o.name,seq:s,windup:0,dur:T+.12,hitList:[],update:(a,dt)=>{if(o.iframe)player.iframes=a.t<T?.06:0;dashUpd(a,dt,0,T,sx,sy,dx,dy,o.col||DGC.sea2);
      if(o.hit)for(const e of enemies){if(e.dead||a.hitList.includes(e))continue;if(Math.hypot(e.x-player.x,e.y-player.y)<e.r+24){a.hitList.push(e);a.hitConfirmed=true;o.hit(a,e);}}},
    events:[{t:.01,f:()=>{dustPuff(sx,sy,4,'#e8f0f8',50,6);o.start&&o.start();}},{t:T,f:a=>{o.end&&o.end(a);}}]});}

/* ---------- normal attack ---------- */
function mkDgBasic(tgt){dEnsure();const lv=Math.max(1,dL('dnCombo')),chain=DB.dnCombo.chain[lv-1]+(dL('dcChain')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),ki=dL('dcChain')&&last,sweep=dL('dnSweep')&&last&&!ki&&chain>=2;
  return dPunches({key:'basic',name:ki?'Dragon Chain':sweep?'Dragon Tail Sweep':'Azure Fist '+(idx+1),phi,n:1,lastSpeed:last?1.15:2.2,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    const awk=dAwake()?1:0;
    if(ki){addFx(new DgWave({x:player.x,y:player.y,phi,len:DB.dcChain.len,w:18,speed:700,col:DGC.sea,onHit:e=>{dHit(e,DB.dcChain.dmg,'dcChain',{auto:true});dPow(e,true);a.hitConfirmed=true;}}));return;}
    if(sweep){for(const e of dNear(player.x,player.y,DB.dnSweep.R)){dHit(e,dLv(DB.dnSweep.dmg,'dnSweep'),'dnSweep',{auto:true});applyCC(e,{flinch:.25});dPow(e,false);a.hitList.push(e);a.hitConfirmed=true;}addFx(new GRing({x:player.x,y:player.y,r0:10,r1:DB.dnSweep.R,w:8,color:DGC.white,life:.3}));shake(1.4);return;}
    if(!tgt.dead&&dist(player,tgt)<=BASIC_RANGE+40+tgt.r){dHit(tgt,DB.dnCombo.hit,'basic',{auto:true,knock:[phi,24]});dPow(tgt,false);a.hitList.push(tgt);a.hitConfirmed=true;shake(1);stop(24);if(awk)dFlow(0);}}});}

/* ---------- BASIC ---------- */
function mkDnGuard(c){const T=DB.dnGuard.T,s=hold('buff',player.dir,2,T*1000);DG.guardUntil=gameTime+T+.05;DG.guardUsed=false;
  return act({key:'dnGuard',name:'Komainu Guard',seq:s,windup:0,dur:T,hitList:[],update:()=>{player.glow={color:DGC.gold,k:.6};}});}
function mkDnRush(c){const phi=c&&c.target&&!c.target.dead?angTo(c.target):(c&&c.phi!=null?c.phi:player.phi);
  return dDash({key:'dnRush',name:'Horn Rush',phi,L:dLv(DB.dnRush.dist,'dnRush'),T:.26,hit:(a,e)=>{dHit(e,DB.dnRush.dmg,'dnRush',{knock:[phi,200],big:true});dPow(e,true,DGC.gold);shake(2);}});}
function mkDnBreath(c){const T=DB.dnBreath.T,s=hold('buff',player.dir,bPeak(player.dir),T*1000);
  return act({key:'dnBreath',name:'Calm Breath',seq:s,windup:0,dur:T,hitList:[],update:a=>{addBuff('rhSA',.1);player.glow={color:'#9aff9a',k:.5};if(Math.random()<Q.p*.8)emit({type:'round',x:player.x+rnd(-20,20),y:player.y+rnd(-8,8),z:rnd(10,40),vx:0,vy:0,vz:40,drag:.5,life:.6,size:2,size1:.5,color:'#bfffcf'});},
    events:[{t:T-.02,f:()=>{const h=Math.round(PS.lv*dLv(DB.dnBreath.hp,'dnBreath'));player.hp=Math.min(player.maxHp,player.hp+h);player.mp=Math.min(player.maxMp,player.mp+dLv(DB.dnBreath.sp,'dnBreath'));dmgNum(player.x,player.y,80,'+'+h,'heal');addFx(new GRing({x:player.x,y:player.y,r0:10,r1:60,w:5,color:'#9aff9a',life:.4}));}}]});}
function mkDnRoar(c){return dBurst({key:'dnRoar',name:"Lion's Roar",glow:DGC.gold,f:()=>{addBuff('dnRoar',DB.dnRoar.dur);for(const e of dNear(player.x,player.y,DB.dnRoar.R)){applyCC(e,{flinch:.4});e.aggro=99;}
  addFx(new GRing({x:player.x,y:player.y,r0:20,r1:DB.dnRoar.R,w:10,color:DGC.gold,life:.45}));shake(2.2);}});}

/* ---------- A · Raging Tide Fist ---------- */
function mkDaJab(c){const t=dTgt(c,DB.daJab.range),phi=dPhi(c,t),n=dL('dcBarrage')?DB.dcBarrage.n:DB.daJab.n,m=dLv(DB.daJab.dmg,'daJab');
  return dPunches({key:'daJab',name:'Tide Jab',phi,n,midSpeed:3.6,f:(a,i,last)=>{dCone(a,phi,'daJab',m,{range:BASIC_RANGE+40,each:e=>{dOnPunch(e);if(last&&dL('dcBarrage')&&!e.boss)applyCC(e,{flinch:.3});},hurt:last&&dL('dcBarrage')?{knock:[phi,120]}:{}});}});}
function mkDaHook(c){const t=dTgt(c,DB.daHook.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return dPunches({key:'daHook',name:'Whirlpool Hook',phi,n:1,lastSpeed:1.3,events:[{t:.02,f:()=>{if(t.dead)return;const pull=e=>{if(e.boss)return;const a=Math.atan2(e.y-player.y,e.x-player.x);const [px,py]=dPathEnd(player.x,player.y,a,e.r+30);e.x=px;e.y=py;};
      const L=[t];if(dL('daUndertow'))for(const e of dNear(t.x,t.y,dLv(DB.daUndertow.R,'daUndertow')))if(e!==t)L.push(e);for(const e of L){addFx(new Streak({a:[e.x,e.y,26],b:[player.x,player.y,26],color:DGC.sea,w:5,life:.2}));pull(e);}}}],
    f:a=>{for(const e of [t,...dNear(player.x,player.y,BASIC_RANGE+40).filter(q=>q!==t)].slice(0,dL('daUndertow')?6:1)){if(e.dead)continue;dHit(e,dLv(DB.daHook.dmg,'daHook'),'daHook',{big:e===t});dPow(e,e===t);a.hitList.push(e);a.hitConfirmed=true;}dFlow(DB.daHook.flow);dSplash(t.x,t.y,6);shake(2);}});}
function mkDaStep(c){const t=dTgt(c,DB.daStep.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),L=dist(player,t)+t.r+40,counter=dL('daCounter')&&t.atk>0;
  return dDash({key:'daStep',name:'Riptide Step',phi,L,T:.22,iframe:true,end:a=>{if(t.dead)return;faceTo(angTo(t));dHit(t,dLv(DB.daStep.dmg,'daStep'),'daStep',{big:true});dOnPunch(t);dPow(t,true,DGC.sea);dSplash(t.x,t.y,6);a.hitConfirmed=true;shake(2);
    if(counter)setFxTimer(.12,()=>{if(t.dead)return;dHit(t,dLv(DB.daCounter.dmg,'daCounter'),'daCounter',{big:true});dOnPunch(t);dPow(t,true,DGC.gold);addFx(new DText({x:t.x,y:t.y,z:80,text:'COUNTER!',color:DGC.gold,size:14,life:.8}));});}});}
function mkDaHundred(c){const t=dTgt(c,DB.daHundred.range),phi=dPhi(c,t),full=DG.flow>=DG_BAL.flow.cap,n=DB.daHundred.n+(dL('daEndless')&&full?DB.daEndless.extra:0),m=dLv(DB.daHundred.dmg,'daHundred');
  return dPunches({key:'daHundred',name:'Hundred Waves',phi,n,midSpeed:4.4,events:[{t:.02,f:()=>dFlow(DG_BAL.flow.cap)}],f:(a,i,last)=>{dCone(a,phi,'daHundred',m,{range:BASIC_RANGE+40,each:e=>dOnPunch(e)});
    if(last&&dL('dcThousand')){addFx(new DgWave({x:player.x,y:player.y,phi,len:DB.dcThousand.len,w:30,speed:640,col:DGC.sea,onHit:e=>{dHit(e,DB.dcThousand.dmg,'dcThousand',{big:true,knock:[phi,120]});dSplash(e.x,e.y,5);}}));}}});}
function mkDaTsunami(c){const t=dTgt(c,DB.daTsunami.range),phi=dPhi(c,t);
  return dPunches({key:'daTsunami',name:'Tsunami Uppercut',phi,n:1,lastSpeed:1.1,f:a=>{const n=dSpendFlow(),m=dLv(DB.daTsunami.dmg,'daTsunami')+DB.daTsunami.per*n;const L=dCone(a,phi,'daTsunami',m,{range:BASIC_RANGE+40,big:true,col:DGC.sea2});dSplash(player.x+Math.cos(phi)*40,player.y+Math.sin(phi)*40,10);
    if(n)addFx(new DText({x:player.x,y:player.y,z:96,text:'FLOW ×'+n,color:DGC.sea,size:13,life:.8}));
    if(dL('daCrash')&&L.length){const e0=L[0];setFxTimer(.38,()=>{const x=e0.x,y=e0.y;for(const e of dNear(x,y,DB.daCrash.R))dHit(e,dLv(DB.daCrash.dmg,'daCrash'),'daCrash',{big:true});addFx(new GRing({x,y,r0:10,r1:DB.daCrash.R,w:12,color:DGC.sea2,life:.4}));dSplash(x,y,12);shake(3);});}}});}
function mkDaEbb(c){const T=DB.daEbb.T,s=hold('buff',player.dir,2,T*1000);DG.ebb=0;DG.ebbOn=true;
  return act({key:'daEbb',name:'Ebb and Flow',seq:s,windup:0,dur:T+.05,hitList:[],update:a=>{player.glow={color:DGC.sea,k:.4+.4*Math.min(1,DG.ebb/Math.max(1,D.patk))};addBuff('rhSA',.1);},onInterrupt:()=>{DG.ebbOn=false;},
    events:[{t:T,f:a=>{DG.ebbOn=false;const t=nearestEnemy(player.x,player.y,BASIC_RANGE+70);if(!t)return;faceTo(angTo(t));const m=DB.daEbb.base+Math.min(DB.daEbb.cap,DG.ebb/Math.max(1,D.patk));dHit(t,m,'daEbb',{big:true,knock:[angTo(t),180]});dPow(t,true,DGC.sea2);dSplash(t.x,t.y,10);a.hitConfirmed=true;shake(3);stop(70);}}]});}
function mkDaTorrent(c){const lv=dL('daTorrent'),n0=DB.daTorrent.n,sx=player.x,sy=player.y,flow=dSpendFlow(),m=dLv(DB.daTorrent.dmg,'daTorrent')+DB.daTorrent.per*flow;
  const L=enemies.filter(e=>!e.dead&&dist(e,player)<DB.daTorrent.range).sort((a,b)=>dist(a,player)-dist(b,player)).slice(0,n0);if(!L.length){msg('ไม่มีเป้าหมาย');return null;}
  const gap=.16,T=L.length*gap+.25,s=hold('attack',atkDir(player.dir),CT(atkDir(player.dir)),T*1000);
  const ev=L.map((e,i)=>({t:.05+i*gap,f:a=>{if(e.dead)return;const an=rnd(0,TAU);player.x=e.x+Math.cos(an)*(e.r+26);player.y=e.y+Math.sin(an)*(e.r+26);faceTo(angTo(e));dHit(e,m,'daTorrent',{big:true});dPow(e,true,DGC.sea);dSplash(e.x,e.y,6);a.hitConfirmed=true;shake(2);stop(40);}}));
  ev.push({t:T-.05,f:()=>{player.x=sx;player.y=sy;if(dL('daOcean')){DG.flowLock=gameTime+DB.daOcean.T;DG.flow=DG_BAL.flow.cap;}}});
  return act({key:'daTorrent',name:'Great Azure Torrent',seq:s,windup:.05,dur:T,hitList:[],update:a=>{player.iframes=.06;player.glow={color:DGC.sea,k:.9};},onInterrupt:()=>{player.x=sx;player.y=sy;},events:ev});}

/* ---------- B · Cloud Dragon Palm ---------- */
function dStillBonus(){if(DG.stillReady){DG.stillReady=false;DG.still=0;return true;}return false;}
function dPalmExtra(e){if(hasBuff('dcSovereign')){dBolt(e,DB.dcSovereign.bolt,'dcSovereign');}}
function mkDkPalm(c){const t=dTgt(c,DB.dkPalm.range),phi=dPhi(c,t),m=dLv(DB.dkPalm.dmg,'dkPalm'),st=dStillBonus(),ways=dL('dcFan')?DB.dcFan.n:1;
  return dPunches({key:'dkPalm',name:'Wind Palm',phi,n:1,lastSpeed:1.4,glow:DGC.cloud,f:a=>{let got=false;for(let w=0;w<ways;w++){const an=phi+(ways>1?(w-(ways-1)/2)*DB.dcFan.spread:0);
    addFx(new DgWave({x:player.x,y:player.y,phi:an,len:DB.dkPalm.len,w:22,speed:640,col:DGC.cloud,onHit:e=>{dHit(e,m,'dkPalm',{still:st});dPow(e,false,DGC.cloud);dPalmExtra(e);if(!got){got=true;dOrb(1);}a.hitConfirmed=true;}}));}}});}
function mkDkSeal(c){const t=dTgt(c,DB.dkSeal.range),phi=dPhi(c,t),st=dStillBonus();
  return dPunches({key:'dkSeal',name:'Thunder Seal Palm',phi,n:1,lastSpeed:1.3,glow:DGC.thunder,f:a=>{addFx(new DgWave({x:player.x,y:player.y,phi,len:DB.dkSeal.range,w:18,speed:760,col:DGC.thunder,onHit:function(e){if(this.done)return;this.done=true;this.d=this.len;dHit(e,dLv(DB.dkSeal.dmg,'dkSeal'),'dkSeal',{still:st});dSeal(e,1);dOrb(1);dPalmExtra(e);dPow(e,false,DGC.thunder);a.hitConfirmed=true;}}));}});}
function mkDkCloud(c){const near=nearestEnemy(player.x,player.y,240),phi=near?Math.atan2(player.y-near.y,player.x-near.x):player.phi+Math.PI,sx=player.x,sy=player.y;
  const a=dDash({key:'dkCloud',name:'Cloud Step',phi,L:DB.dkCloud.dist,T:.22,iframe:true,col:DGC.cloud,start:()=>{DG.clouds.push({x:sx,y:sy,R:DB.dkCloud.R,until:gameTime+dLv(DB.dkCloud.slow,'dkCloud'),rain:dL('dkRain')?dLv(DB.dkRain.dmg,'dkRain'):0});for(let i=0;i<qn(10);i++)emit({type:'round',x:sx+rnd(-30,30),y:sy+rnd(-15,15),z:rnd(5,30),vx:rnd(-30,30),vy:rnd(-10,10),vz:rnd(10,30),drag:1,life:rnd(.5,.9),size:rnd(4,7),size1:2,color:'#efe8ff'});}});
  if(near)setFxTimer(.24,()=>faceTo(angTo(near)));return a;}
function mkDkTwin(c){const t=dTgt(c,DB.dkTwin.range),phi=dPhi(c,t),n=dL('dcNine')?DB.dcNine.n:2,m=dLv(DB.dkTwin.dmg,'dkTwin'),st=dStillBonus();
  return dPunches({key:'dkTwin',name:'Twin Dragon Palms',phi,n:1,lastSpeed:1.2,glow:DGC.azure,f:a=>{for(let i=0;i<n;i++){const an=phi+(n>2?(i-(n-1)/2)*.28:0);
    addFx(new DgWave({x:player.x,y:player.y,phi:an,len:DB.dkTwin.len,w:24,speed:560,kind:'dragon',ph:i*Math.PI,col:i%2?DGC.azure:DGC.cloud,onHit:e=>{dHit(e,m,'dkTwin',{still:st});dPow(e,false,DGC.azure);dPalmExtra(e);a.hitConfirmed=true;}}));}
    dOrb(1);if(dL('dkCoil'))setFxTimer(.5,()=>addBuff('dkCoil',DB.dkCoil.T));shake(1.4);}});}
function mkDkPush(c){const t=dTgt(c,200),phi=dPhi(c,t);return dBurst({key:'dkPush',name:'Heaven Push',phi,speed:2.2,glow:DGC.cloud,f:()=>{const n=DG.orbs;DG.orbs=0;const m=dLv(DB.dkPush.dmg,'dkPush')+DB.dkPush.per*n,st=dStillBonus();
  for(const e of dNear(player.x,player.y,DB.dkPush.R)){dHit(e,m,'dkPush',{still:st,big:true,knock:[angTo(e),260]});dPow(e,true,DGC.cloud);dPalmExtra(e);}
  addFx(new GRing({x:player.x,y:player.y,r0:20,r1:DB.dkPush.R+20,w:14,color:'#e8e0ff',life:.4}));shake(2.6);stop(50);
  if(n)addFx(new DText({x:player.x,y:player.y,z:96,text:'KI ×'+n,color:DGC.cloud,size:13,life:.8}));
  if(dL('dkWall'))DG.wall={x:player.x+Math.cos(phi)*70,y:player.y+Math.sin(phi)*70,phi,until:gameTime+DB.dkWall.T};}});}
function mkDkMirror(c){return dBurst({key:'dkMirror',name:'Mirror Pond',glow:'#bfe8ff',f:()=>{addBuff('dkMirror',DB.dkMirror.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:50,w:5,color:'#bfe8ff',life:.4}));}});}
function mkDkDescend(c){const x=c.gx??player.x,y=c.gy??player.y;return buffAct({key:'dkDescend',name:'Azure Dragon Descends',speed:1.5,glow:DGC.azure,phi:Math.atan2(y-player.y,x-player.x),
  events:tP=>[{t:.02,f:()=>{skyDarkT=.6;}},{t:tP,f:()=>{DG.storm={x,y,R:DB.dkDescend.R,until:gameTime+DB.dkDescend.T,tk:.7,dmg:dLv(DB.dkDescend.dmg,'dkDescend'),king:dL('dkKingRain')>0};shake(3);addFx(new DText({x,y,z:120,text:'AZURE DRAGON',color:DGC.azure,size:16,life:1.2}));}}]});}

/* ---------- C ---------- */
function mkDcMaelstrom(c){const x=player.x,y=player.y,T=DB.dcMaelstrom.T;return dBurst({key:'dcMaelstrom',name:'Maelstrom',glow:DGC.sea,f:()=>{DG.mael={x,y,R:DB.dcMaelstrom.R};
  setFxTimer(T,()=>{DG.mael=null;for(const e of dNear(x,y,DB.dcMaelstrom.R*.6)){dHit(e,DB.dcMaelstrom.dmg,'dcMaelstrom',{big:true});dOnPunch(e);dPow(e,true,DGC.sea);}addFx(new GRing({x,y,r0:10,r1:DB.dcMaelstrom.R*.6,w:12,color:DGC.sea2,life:.4}));dSplash(x,y,14);shake(3);});}});}
function mkDcBreath(c){const t=dTgt(c,DB.dcBreath.R),phi=dPhi(c,t);return dBurst({key:'dcBreath',name:"Dragon's Breath",phi,speed:2,glow:DGC.azure,f:()=>{
  for(const e of enemiesInCone(player.x,player.y,phi,DB.dcBreath.R,.55)){dHit(e,DB.dcBreath.dmg,'dcBreath',{big:true,knock:[phi,120]});dPow(e,true,DGC.azure);}
  for(let i=0;i<qn(22);i++){const an=phi+rnd(-.5,.5),s=rnd(220,420);emit({type:'round',x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,z:40,vx:Math.cos(an)*s,vy:Math.sin(an)*s,vz:rnd(-20,20),drag:1.8,life:rnd(.35,.55),size:rnd(4,8),size1:1,color:Math.random()<.5?'#cfe0ff':'#ffffff'});}shake(2);}});}
function mkDcAwaken(c){return dBurst({key:'dcAwaken',name:'Shishi Awakening',speed:1.4,glow:DGC.azure,f:()=>{addBuff('dcAwaken',DB.dcAwaken.T);dFlow(2);dOrb(2);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:120,w:12,color:DGC.azure,life:.5}));addFx(new DText({x:player.x,y:player.y,z:110,text:'SHISHI AWAKENING',color:DGC.azure,size:15,life:1.1}));shake(3);}});}
function mkDcAbyss(c){const t=dTgt(c,DB.dcAbyss.len),phi=dPhi(c,t);return dPunches({key:'dcAbyss',name:'Abyssal Torrent',phi,n:1,lastSpeed:1,f:a=>{const n=dSpendFlow(),m=DB.dcAbyss.dmg+DB.dcAbyss.per*n;
  addFx(new DgWave({x:player.x,y:player.y,phi,len:DB.dcAbyss.len,w:46,speed:520,col:DGC.sea,onHit:e=>{dHit(e,m,'dcAbyss',{big:true,knock:[phi,220]});dSplash(e.x,e.y,8);a.hitConfirmed=true;}}));dSplash(player.x,player.y,16);shake(3.5);stop(60);}});}
function mkDcSovereign(c){return dBurst({key:'dcSovereign',name:'Storm Sovereign',speed:1.6,glow:DGC.thunder,f:()=>{addBuff('dcSovereign',DB.dcSovereign.T);dOrb(1);addFx(new DgBolt({x:player.x,y:player.y}));shake(2);}});}

const DG_MAKE={dnGuard:mkDnGuard,dnRush:mkDnRush,dnBreath:mkDnBreath,dnRoar:mkDnRoar,
  daJab:mkDaJab,daHook:mkDaHook,daStep:mkDaStep,daHundred:mkDaHundred,daTsunami:mkDaTsunami,daEbb:mkDaEbb,daTorrent:mkDaTorrent,
  dkPalm:mkDkPalm,dkSeal:mkDkSeal,dkCloud:mkDkCloud,dkTwin:mkDkTwin,dkPush:mkDkPush,dkMirror:mkDkMirror,dkDescend:mkDkDescend,
  dcMaelstrom:mkDcMaelstrom,dcBreath:mkDcBreath,dcAwaken:mkDcAwaken,dcAbyss:mkDcAbyss,dcSovereign:mkDcSovereign};
const DG_ZIGZAG=[['daJab','daHook'],['dkPalm','dkSeal']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function dragonAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,420);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.4&&ready('dnBreath')&&!nearestEnemy(player.x,player.y,120))return cast('dnBreath');
  if(!t)return false;const d=dist(player,t),near=dNear(player.x,player.y,200),tal=D.mag>D.patk;
  for(const k of ['dcAwaken','dnRoar'])if(ready(k)&&!hasBuff(k)&&d<220)return cast(k);
  if((t.boss||near.length>=3)&&ready(tal?'dkDescend':'daTorrent'))return cast(tal?'dkDescend':'daTorrent');
  if(tal){if(ready('dcSovereign')&&!hasBuff('dcSovereign')&&d<260)return cast('dcSovereign');
    if(d<90&&ready('dkCloud'))return cast('dkCloud');
    if(near.length>=2&&DG.orbs>=2&&ready('dkPush'))return cast('dkPush');
    for(const k of ['dcBreath','dkTwin','dkSeal','dkPalm'])if(ready(k)&&d<=(SKILLS[k].range||200)+t.r)return cast(k);
    return false;}
  if(d>140&&ready('daStep'))return cast('daStep');if(d>140&&ready('daHook'))return cast('daHook');if(d>140&&ready('dnRush'))return cast('dnRush');
  if(near.length>=3&&ready('dcMaelstrom'))return cast('dcMaelstrom');
  if(DG.flow>=DG_BAL.flow.cap){for(const k of ['dcAbyss','daTsunami'])if(ready(k)&&d<=200)return cast(k);}
  for(const k of ['daHundred','dcBreath','daJab','daHook'])if(ready(k)&&d<=(SKILLS[k].range||120)+t.r)return cast(k);
  return false;}

function installDragon(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  for(const d of DG_DEFS){const b=DB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:dIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'azure_dragon_lion'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(DG_MAKE[d.key])sk.make=DG_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${DG_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of DG_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* damage type: Basic column = higher of ATK / TAL, A = ATK, B = TAL */
  Object.assign(SK_DT,{dnSweep:'b',dnRush:'b',dcChain:'b',dcStone:'b',dcBreath:'b',dcAwaken:'b',dcBarrage:'p',dcMaelstrom:'m',dcThousand:'p',dcAbyss:'p',dcFan:'m',dcThunder:'m',dcNine:'m',dcSovereign:'m',
    daRising:'p',daCounter:'p',daCrash:'p',dkOrbit:'m',dkRain:'m',dkStorm:'m',dkKingRain:'m'});
  Object.assign(SK_CC,{daHook:{flinch:.4},daStep:{flinch:.4},daTsunami:{air:1},daCrash:{flinch:.45},daEbb:{flinch:.5},daTorrent:{flinch:.45},dnRush:{flinch:.45},
    dkSeal:{flinch:.3},dkTwin:{flinch:.3},dkPush:{air:1},dkDescend:{flinch:.3},dcMaelstrom:{air:1},dcBreath:{flinch:.45},dcAbyss:{air:1},dcThousand:{flinch:.4}});
  Object.assign(SK_KO,{basic:1,daJab:.8,daHook:2,daStep:2,daHundred:.5,daTsunami:3.2,daCrash:2.6,daEbb:3,daTorrent:3.6,dnRush:2.4,dnSweep:1.4,
    dkPalm:1,dkSeal:1.2,dkTwin:1.6,dkPush:2.8,dkDescend:1.6,dkOrbit:.3,dkRain:.3,dcMaelstrom:3,dcAbyss:4,dcBreath:2.4,dcChain:1.6,dcThousand:2});
  TABS.length=0;TABS.push({n:'Tide',keys:['daJab','daHook','daStep','daHundred','daTsunami','daEbb','daTorrent','dnGuard','dnRush','dnRoar']},
    {n:'Cloud',keys:['dkPalm','dkSeal','dkCloud','dkTwin','dkPush','dkMirror','dkDescend','dnGuard','dnBreath','dnRoar']},
    {n:'Sovereign',keys:['dcMaelstrom','dcBreath','dcAwaken','dcAbyss','dcSovereign','dnBreath']});
  Object.assign(BUFFDEF,{dnRoar:{n:"Lion's Roar",c:DGC.gold,i:'ROAR'},dkCoil:{n:'Dragon Coil',c:DGC.azure,i:'COIL'},dkMirror:{n:'Mirror Pond',c:'#bfe8ff',i:'MIRROR'},dcAwaken:{n:'Shishi Awakening',c:DGC.azure,i:'SHISHI'},dcSovereign:{n:'Storm Sovereign',c:DGC.thunder,i:'STORM'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Azure Pupil';JOB.hpA=1.35;JOB.hpB=5;JOB.spB=3.4;
  ITEMS.azureKnuckles={n:'Azure Wave Knuckles',slot:'rhand',two:1,kind:'Knuckle',atk:140,matk:120,wlv:3,aspd:156,ref:6,cards:2,w:120,b:{agi:2},size:{small:1,medium:1,large:.85},d:'สนับมือลายคลื่นคราม AGI +2'};
  ITEMS.cloudKnuckles={n:'Cloud Dragon Knuckles',slot:'rhand',two:1,kind:'Knuckle',atk:150,matk:160,wlv:4,aspd:154,ref:4,cards:1,w:130,b:{tal:3},size:{small:1,medium:1,large:.85},d:'สนับมือมังกรเมฆ TAL +3'};
  EQ.rhand='azureKnuckles';INV.length=0;INV.push('cloudKnuckles','vikinghelm','ringPrec','clipLuck');
  /* flat ATK / TAL bonuses */
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null))||window.SKCTX,col=dCol(k);let b=0;
    if(!(o&&o.magic)){b+=DG.flow*DG_BAL.flow.atk;if(hasBuff('dnRoar'))b+=dLv(DB.dnRoar.atk,'dnRoar');if(DG.guardBonus){DG.guardBonus=false;b+=dLv(DB.dnGuard.atk,'dnGuard');}if(dAwake()&&(o&&o.auto))b+=DB.dcAwaken.atk;}
    else{if(o&&o.still)b+=dLv(DB.dkStill.tal,'dkStill');}
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+flat(e,o))/base;};
  window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{
    /* Komainu Guard: the first hit inside the guard is fully blocked */
    if(DG.guardUntil>gameTime&&!DG.guardUsed){DG.guardUsed=true;DG.guardBonus=true;addFx(new DText({x:player.x,y:player.y,z:90,text:'PERFECT GUARD',color:DGC.gold,size:13,life:.8}));addFx(new Impact({pos:[player.x,player.y,40],size:34,color:DGC.gold,core:'#ffffff',rays:8,life:.2}));
      if(dL('dcStone')){for(const q of dNear(player.x,player.y,DB.dcStone.R)){dHit(q,DB.dcStone.dmg,'dcStone',{knock:[angTo(q),200],big:true});dPow(q,true,DGC.gold);}addFx(new GRing({x:player.x,y:player.y,r0:10,r1:DB.dcStone.R,w:12,color:DGC.gold,life:.4}));shake(2.4);}
      return 1;}
    /* Storm Sovereign: melee can't reach the cloud */
    if(hasBuff('dcSovereign')&&e&&dist(player,e)<e.r+90)return 1;
    /* Mirror Pond: ranged hits bounce back */
    if(hasBuff('dkMirror')&&e&&!e.dead&&dist(player,e)>e.r+90){dHit(e,DB.dkMirror.dmg,'dkMirror');dArc(player,e);return 1;}
    let r=0;if(dL('dnMane'))r+=dLv(DB.dnMane.block,'dnMane');if(dL('daFlowBody')&&DG.flow>=3)r+=dLv(DB.daFlowBody.block,'daFlowBody');if(hasBuff('dkCoil'))r+=DB.dkCoil.block;
    d=Math.max(1,d-r);if(DG.ebbOn)DG.ebb+=d;return d;};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.dragonAutoTick=dragonAutoTick;
  mkBasic=mkDgBasic;dEnsure();
  for(const k in SKILLS){const sk=SKILLS[k];if(sk.make&&!sk.make._dE){const mk=sk.make;sk.make=function(){dEnsure();return mk.apply(this,arguments);};sk.make._dE=1;}}
  try{document.title='Aetherfall — Azure Dragon-Lion';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Azure Dragon-Lion';if(cl)cl.textContent='Azure Pupil';}catch(e){}
  window.DG=DG;window.DG_DEFS=DG_DEFS;window.DG_BAL=DG_BAL;}

/* =====================================================================
   7. ICONS (painted if present in assets/icons/dragon, code SVG fallback)
   ===================================================================== */
function dIconSpec(d){const col=d.br==='A'?'#bfe8ff':d.br==='B'?'#e0d0ff':d.br==='C'?'#ffe9a8':'#fff2c8',bg=d.br==='A'?'#0f2a44':d.br==='B'?'#2a1a44':d.br==='C'?'#2a2214':'#2a2030';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const fist=`<rect x="13" y="15" width="18" height="15" rx="5" fill="${col}" stroke="#1a2030" stroke-width="1.4"/><path d="M13 20 H31 M13 25 H31" stroke="#1a2030" stroke-width="1"/>`;
  const palm=`<path d="M16 34 V18 a2 2 0 0 1 4 0 V14 a2 2 0 0 1 4 0 V16 a2 2 0 0 1 4 0 V22 l3 -3 a2 2 0 0 1 3 3 l-6 10 Q26 36 20 36Z" fill="${col}" stroke="#1a2030" stroke-width="1.2"/>`;
  const wave=`<path d="M4 28 Q12 16 20 28 T36 28 T44 28" stroke="${col}" stroke-width="4" fill="none"/>`;
  const bolt=`<path d="M24 6 L14 24 H22 L18 38 L32 18 H24Z" fill="#fff27a" stroke="#6a5a10" stroke-width="1"/>`;
  let g;
  if(/Seal|Thunder|Storm|Sovereign/.test(d.name))g=bolt;
  else if(d.br==='B'||/Breath/.test(d.name))g=palm;
  else if(/Wave|Tide|Torrent|Current|Ocean|Flow|Ebb|Maelstrom|Whirlpool|Undertow|Riptide|Abyss/.test(d.name))g=wave+fist;
  else g=fist;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/dragon/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
