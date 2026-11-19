/* =====================================================================
   AETHERFALL — SNOWY OWL · "Silent Wing" (Nordic Crossbow Hunter) — redesign v2 (12 Tails style)
   Character module. Loaded only when the Owl is played; index.html calls installOwl().

   Skill system follows 12 Tails Online:
     Basic  · Frost Owlet         — supports the normal attack (Owl Bolt chain, Charged Bolt finisher, Far Sight…)
     A Tree · Moonlit Marksman    — crit / weak point / Hunter's Mark → Silent Execution (All-Slain style)
     B Tree · Snowstorm Trickster — Frostbite stacks, traps, stealth → Blizzard Cage → Moonwind Rain
     C Tree · White Night         — 4 columns × 4 tiers: upgrades of Basic / A / B skills + unique skills
   Each tree row = one skill I–IV, or a skill and its "development" (enh) side by side.
   No gliding, no per-shot reload, no stand-still Steady Aim (removed in v2).

   Layout: 1. OW_BAL  2. OW_DEFS  3. systems (marks, frostbite, stealth)  4. textures + fx
           5. skill actions  6. hooks / auto skill / install  7. icons
   ===================================================================== */

const OW_BAL={
  boltSpeed:820,
  auto:{chain:[2,3,4,4],aim:[.13,.13,.13,.13]},
  sk:{
    // ---- Basic
    owAuto:{},
    owCharge:{dmg:[1.2,1.4,1.6],n:5,spread:.5},
    owGuard:{red:[15,25],dur:6,cd:16,mp:10},
    owSight:{range:[20,40,60,80]},
    owHop:{dist:[100,120],cd:9,mp:8},
    owEye:{every:[4,3,2],hit:[5,10,15],dur:10},
    owLantern:{dur:12,R:90,hp:[1.0,1.6],sp:[10,16],tick:2,cd:30,mp:14},
    // ---- A · Moonlit Marksman
    oaFatal:{dmg:[60,90,120,150],n:5,dur:20,cd:14,mp:12},
    oaCrit:{crit:[5,8,11,14]},
    oaPierce:{dmg:[1.6,2.0],targets:3,fall:0,cd:7,mp:12,range:320},
    oaDeep:{extra:[1,2],atk:[20,40]},
    oaAim:{dmg:[2.4,3.0],aim:.7,cd:9,mp:16,range:340},
    oaDeadeye:{dmg:[4.2,5.2],aim:1.1,cd:18,mp:30,range:360},
    oaMark:{n:3,dmg:.6,cd:10,mp:10,range:340},
    oaWeak:{per:[25,40,55]},
    oaHeavy:{dmg:[2.6,3.3],cd:10,mp:18,range:300},
    oaDrill:{dmg:[2.8,3.4],ignoreDef:[20,35],cd:13,mp:20,range:300},
    oaHyper:{far:150,max:[45,70,90]},
    oaRico:{dmg:2.0,drop:.4,n:3,jump:220,cd:12,mp:22,range:320},
    oaExec:{dmg:[3.0,4.0],aim:1.0,memory:10,maxT:12,cd:60,mp:55,range:420},
    oaLast:{low:.3,add:1.6,perMark:.7},
    // ---- B · Snowstorm Trickster
    obFlurry:{n:[3,4,5,6],dmg:.6,gap:.09,cd:8,mp:14,range:300},
    obVeil:{dur:[3,5],crit:30,cd:16,mp:12},
    obWhite:{dur:[6,9],cd:40,mp:30},
    obSnare:{dur:[2,3],dmg:.8,cd:12,mp:14,range:300},
    obSkyfall:{n:10,dmg:[.7,.9],R:80,cd:14,mp:22,range:300},
    obFrost:{every:[6,5,4,3]},
    obDeep:{cap:[2,3,4],dur:[8,10,12]},
    obBrittle:{per:18},
    obVolley:{n:12,dmg:[.9,1.2],cd:11,mp:18},
    obShatter:{dmg:[.6,.9],R:240,cd:12,mp:20},
    obCircle:{hits:[3,5],dmg:1.0,cd:14,mp:22,range:260},
    obFlash:{miss:2,R:130,dur:3,cd:18,mp:14},
    obCage:{R:110,dur:[6,9],cd:45,mp:40,range:320},
    obRain:{dmg:2.6,cd:20,mp:30},
    // ---- C · White Night
    ocMastery:{dmg:45},ocExtra:{n:10},ocDouble:{},
    ocMantle:{red:12},ocTwin:{},ocErase:{dur:4},
    ocFan:{},ocPerma:{cap:6,cage:2},
    ocNight:{extra:.6},ocMoonfall:{dmg:1.5,per:.5,R:520,cd:35,mp:40},ocAvalanche:{R:100,dur:8,dmg:.5,chainR:60,chainDur:4,chainMax:6,cd:50,mp:45,range:320},
    ocHunt:{dur:15,atk:60,aim:.2,cd:90,mp:50}
  }};

/* ---------------------------------------------------------------------
   2. SKILL DATA — 7 Basic · 14 A · 14 B · 16 C
      row  = tree row (1–8)   enh = development of that skill (drawn on the same row)
      pre  = extra prerequisites [[key,level],…]   C: tier 1–4 + pre
   --------------------------------------------------------------------- */
const owPct=n=>Math.round(n*100)+'%';
const owX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const OB=OW_BAL.sk;
const OW_DEFS=[
 // ---------------- BASIC — FROST OWLET ----------------
 {key:'owAuto',id:'OW-B01',name:'Owl Bolt',br:'basic',row:1,max:4,passive:1,
  d:'(Passive · ตีปกติ) ยิงหน้าไม้ต่อเนื่อง เลเวลสูง = ต่อจังหวะได้ยาวขึ้น (ความเร็วยิงคงที่)',lv:i=>[`ยิงต่อเนื่อง ${OW_BAL.auto.chain[i-1]} นัด`]},
 {key:'owCharge',id:'OW-B02',name:'Charged Bolt',br:'basic',row:1,max:3,passive:1,
  d:'(Passive) นัดสุดท้ายของการตีปกติเปลี่ยนเป็นการยิงชาร์จ ปล่อยพัดขนนก 5 ดอกเป็นกรวยด้านหน้า',lv:i=>[`ดอกละ ${owX(OB.owCharge.dmg[i-1])}`,'กรวยกว้าง ~60°']},
 {key:'owGuard',id:'OW-B03',name:'Feather Guard',br:'basic',row:2,max:2,type:'self',
  d:'ห่อปีกขนนกรอบตัว กันการชะงัก/กระเด็นและลดดาเมจที่รับ 6 วิ',lv:i=>[`ดาเมจที่ได้รับ −${OB.owGuard.red[i-1]} ต่อครั้ง`,'กันชะงัก/กระเด็น','Cooldown 16 วิ']},
 {key:'owSight',id:'OW-B04',name:'Far Sight',br:'basic',row:2,max:4,passive:1,
  d:'(Passive) ตานกฮูกมองไกล ระยะของสกิลยิงทุกสกิลเพิ่มขึ้น',lv:i=>[`ระยะสกิลยิง +${OB.owSight.range[i-1]}`]},
 {key:'owHop',id:'OW-B05',name:'Wing Hop',br:'basic',row:3,max:2,type:'self',
  d:'กระโดดถอยหนีศัตรูที่ใกล้ที่สุด ระหว่างกระโดดหลบการโจมตีได้',lv:i=>[`ระยะ ${OB.owHop.dist[i-1]}`,'หลบได้ระหว่างกระโดด','Cooldown 9 วิ']},
 {key:'owEye',id:'OW-B06',name:"Owl's Eye",br:'basic',row:3,max:3,passive:1,
  d:"(Passive) ตีปกติโดนครบจำนวนนัด ติด [มาร์คดวงตานกฮูก] 1 ชั้น (ซ้อนได้ 3 ชั้น อยู่ 10 วิ) และ HIT เพิ่มขึ้น · มาร์คใช้กับสกิลสาย A",lv:i=>[`ทุกนัดที่ ${OB.owEye.every[i-1]} ติดมาร์ค`,`HIT +${OB.owEye.hit[i-1]}`]},
 {key:'owLantern',id:'OW-B07',name:'Snow Lantern',br:'basic',row:4,max:2,type:'self',
  d:'วางโคมหิมะที่เท้า 12 วิ ยืนอยู่ใกล้โคมโดยไม่เดิน จะฟื้น HP/SP ทุก 2 วิ (แบบ Camp Fire)',lv:i=>[`ฟื้น HP = เลเวล×${OB.owLantern.hp[i-1]} · SP +${OB.owLantern.sp[i-1]} ต่อครั้ง`,'รัศมี 90 · Cooldown 30 วิ']},
 // ---------------- CLASS A — MOONLIT MARKSMAN ----------------
 {key:'oaFatal',id:'OW-A01',name:'Fatal Bolt',br:'A',row:1,max:4,type:'self',
  d:'ชโลมลูกดอกด้วยแสงจันทร์ ตีปกติ 5 นัดถัดไปแรงขึ้น (อยู่ได้ 20 วิ) · อัปสลับเลเวลกับ Piercing Bolt',lv:i=>[`ตีปกติ ATK +${OB.oaFatal.dmg[i-1]}`,'5 นัด · Cooldown 14 วิ']},
 {key:'oaCrit',id:'OW-A02',name:'Critical Feather',br:'A',row:2,max:4,passive:1,
  d:'(Passive) ตีปกติมีค่าคริติคอลสูงขึ้น',lv:i=>[`CRIT ตีปกติ +${OB.oaCrit.crit[i-1]}`]},
 {key:'oaPierce',id:'OW-A03',name:'Piercing Bolt',br:'A',row:3,max:2,type:'melee',shot:1,pre:[['oaFatal',1]],
  d:'ยิงลูกดอกเงินทะลุศัตรูในแนวตรง ทุกเป้าโดนเท่ากัน · อัปสลับเลเวลกับ Fatal Bolt',lv:i=>[`${owX(OB.oaPierce.dmg[i-1])}`,'ทะลุ 3 เป้า','Cooldown 7 วิ']},
 {key:'oaDeep',id:'OW-A04',name:'Deep Pierce',br:'A',row:3,max:2,passive:1,enh:'oaPierce',pre:[['oaPierce',2]],
  d:'(ต่อยอด Piercing Bolt) ทะลุได้มากขึ้นและแรงขึ้น',lv:i=>[`ทะลุเพิ่ม +${OB.oaDeep.extra[i-1]} เป้า`,`ATK +${OB.oaDeep.atk[i-1]}`]},
 {key:'oaAim',id:'OW-A05',name:'Aimed Shot',br:'A',row:4,max:2,type:'melee',shot:1,
  d:'หยุดเล็ง 0.7 วิ มีเส้นเล็งแสงจันทร์ แล้วยิงนัดหนักเป้าเดี่ยว',lv:i=>[`${owX(OB.oaAim.dmg[i-1])}`,'เล็ง 0.7 วิ · Cooldown 9 วิ']},
 {key:'oaDeadeye',id:'OW-A06',name:'Deadeye',br:'A',row:4,max:2,type:'melee',shot:1,enh:'oaAim',pre:[['oaAim',2]],
  d:'(ต่อยอด Aimed Shot) เล็ง 1.1 วิ วงจันทร์คราสล็อกเป้า ยิงจุดอ่อน · เป้าที่ติดมาร์คจะคริติคอลแน่นอน',lv:i=>[`${owX(OB.oaDeadeye.dmg[i-1])}`,'คริแน่นอนกับเป้าติดมาร์ค','Cooldown 18 วิ']},
 {key:'oaMark',id:'OW-A07',name:"Hunter's Mark",br:'A',row:5,max:1,type:'melee',shot:1,
  d:'ยิงลูกดอกนำทาง ติดมาร์คดวงตานกฮูกเต็ม 3 ชั้นทันที',lv:()=>['มาร์ค 3 ชั้น','Cooldown 10 วิ']},
 {key:'oaWeak',id:'OW-A08',name:'Weakpoint',br:'A',row:5,max:3,passive:1,enh:'oaMark',pre:[['oaMark',1]],
  d:'(ต่อยอด Hunter\'s Mark) ทุกการยิงใส่เป้าที่ติดมาร์คแรงขึ้นตามจำนวนชั้น',lv:i=>[`ATK +${OB.oaWeak.per[i-1]} ต่อชั้นมาร์ค`]},
 {key:'oaHeavy',id:'OW-A09',name:'Heavy Bolt',br:'A',row:6,max:2,type:'melee',shot:1,
  d:'ลูกดอกหนักพิเศษ ผลักศัตรูถอย แรงถีบส่งตัวถอยเล็กน้อย',lv:i=>[`${owX(OB.oaHeavy.dmg[i-1])}`,'Cooldown 10 วิ']},
 {key:'oaDrill',id:'OW-A10',name:'Armor Drill',br:'A',row:6,max:2,type:'melee',shot:1,enh:'oaHeavy',pre:[['oaHeavy',2]],
  d:'(ต่อยอด Heavy Bolt) ลูกดอกหัวเจาะหมุน เจาะเกราะ',lv:i=>[`${owX(OB.oaDrill.dmg[i-1])}`,`DEF เป้า −${OB.oaDrill.ignoreDef[i-1]} (นัดนี้)`,'Cooldown 13 วิ']},
 {key:'oaHyper',id:'OW-A11',name:'Hyper Range',br:'A',row:7,max:3,passive:1,
  d:'(Passive) ยิ่งยิงไกลยิ่งแรง (เริ่มนับที่ระยะ 150 เต็มที่ระยะ 300)',lv:i=>[`ATK สูงสุด +${OB.oaHyper.max[i-1]}`]},
 {key:'oaRico',id:'OW-A12',name:'Ricochet Bolt',br:'A',row:7,max:1,type:'melee',shot:1,enh:'oaHyper',pre:[['oaHyper',1]],
  d:'ลูกดอกแฉลบต่อ 3 ครั้ง เลือกเป้าที่ติดมาร์คก่อน แต่ละครั้งเบาลงทีละขั้น',lv:()=>[`${owX(OB.oaRico.dmg)} → ${owX(OB.oaRico.dmg-OB.oaRico.drop)} → ${owX(OB.oaRico.dmg-2*OB.oaRico.drop)} → ${owX(OB.oaRico.dmg-3*OB.oaRico.drop)}`,'Cooldown 12 วิ']},
 {key:'oaExec',id:'OW-A13',name:'Silent Execution',br:'A',row:8,max:2,type:'self',ult:1,
  d:'ULTIMATE A · ฟ้ามืดลง จันทร์เสี้ยวขึ้นหลังนกฮูก แล้วตัดเงียบใส่ศัตรู "ทุกตัวที่โดนสกิลของนกฮูกใน 10 วิล่าสุด" ตัวละ 1 ครั้ง ไม่จำกัดระยะ (แบบ All Slain)',lv:i=>[`${owX(OB.oaExec.dmg[i-1])} ต่อเป้า`,'สูงสุด 12 เป้า · Cooldown 60 วิ']},
 {key:'oaLast',id:'OW-A14',name:'Last Light',br:'A',row:8,max:1,passive:1,enh:'oaExec',pre:[['oaExec',1]],
  d:'(ต่อยอด Silent Execution) แรงขึ้นกับเป้า HP ต่ำ และกินมาร์คที่ติดอยู่เป็นดาเมจ',lv:()=>[`+${owX(OB.oaLast.add)} กับเป้า HP < 30%`,`+${owX(OB.oaLast.perMark)} ต่อชั้นมาร์ค (ล้างมาร์ค)`]},
 // ---------------- CLASS B — SNOWSTORM TRICKSTER ----------------
 {key:'obFlurry',id:'OW-G01',name:'Flurry Bolts',br:'B',row:1,max:4,type:'melee',shot:1,
  d:'ยิงรัวลูกดอกน้ำแข็งเข้าเป้าเดียว · อัปสลับเลเวลกับ Snow Snare',lv:i=>[`${OB.obFlurry.n[i-1]} ดอก × ${owX(OB.obFlurry.dmg)}`,'Cooldown 8 วิ']},
 {key:'obVeil',id:'OW-G02',name:'Snow Veil',br:'B',row:2,max:2,type:'self',
  d:'หายเข้าไปในละอองหิมะ ศัตรูเลิกไล่ตาม · ยิงนัดแรกออกจากม่าน CRIT +30 แล้วม่านหาย',lv:i=>[`พรางตัว ${OB.obVeil.dur[i-1]} วิ`,'Cooldown 16 วิ']},
 {key:'obWhite',id:'OW-G03',name:'White Out',br:'B',row:2,max:2,type:'self',enh:'obVeil',pre:[['obVeil',2]],
  d:'(ต่อยอด Snow Veil) ล่องหนในพายุขาว ศัตรูมองไม่เห็นและเลิกโจมตี · ยิงได้โดยไม่หลุดล่องหน',lv:i=>[`ล่องหน ${OB.obWhite.dur[i-1]} วิ`,'Cooldown 40 วิ']},
 {key:'obSnare',id:'OW-G04',name:'Snow Snare',br:'B',row:3,max:2,type:'melee',shot:1,pre:[['obFlurry',1]],
  d:'ยิงลูกดอกกับดัก วงเกล็ดน้ำแข็งตรึงเป้าไว้กับที่ +2 ความเย็น (บอสโดนชะลอแทน) · อัปสลับเลเวลกับ Flurry Bolts',lv:i=>[`ตรึง ${OB.obSnare.dur[i-1]} วิ`,`${owX(OB.obSnare.dmg)}`,'Cooldown 12 วิ']},
 {key:'obSkyfall',id:'OW-G05',name:'Skyfall Volley',br:'B',row:3,max:2,type:'ground',radius:()=>OB.obSkyfall.R,
  d:'กระโดดหลบขึ้นกลางอากาศ ยิงฝนลูกดอก 10 ดอกลงพื้นที่เป้าหมาย (แบบ Mass Shot)',lv:i=>[`10 ดอก × ${owX(OB.obSkyfall.dmg[i-1])}`,'รัศมี 80 · Cooldown 14 วิ']},
 {key:'obFrost',id:'OW-G06',name:'Frostbite',br:'B',row:4,max:4,passive:1,
  d:'(Passive) ตีปกติโดนครบจำนวนนัด ติด [ความเย็น] 1 ชั้น ซ้อนชั้นได้ (แบบพิษ) · ติดเย็นจะช้าลง · ซ้อนเต็มเพดาน = แช่แข็ง 1 วิ',lv:i=>[`ทุกนัดที่ ${OB.obFrost.every[i-1]} ติดความเย็น`,'เพดาน 1 ชั้น (เพิ่มด้วย Deep Chill)']},
 {key:'obDeep',id:'OW-G07',name:'Deep Chill',br:'B',row:5,max:3,passive:1,
  d:'(Passive) ความเย็นซ้อนได้สูงขึ้นและอยู่นานขึ้น',lv:i=>[`เพดาน ${OB.obDeep.cap[i-1]} ชั้น`,`อยู่ ${OB.obDeep.dur[i-1]} วิ`]},
 {key:'obBrittle',id:'OW-G08',name:'Brittle',br:'B',row:5,max:1,passive:1,enh:'obDeep',pre:[['obDeep',3]],
  d:'(ต่อยอด Deep Chill) ทุกการยิงใส่เป้าที่ติดเย็นแรงขึ้นตามชั้นความเย็น',lv:()=>[`ATK +${OB.obBrittle.per} ต่อชั้นความเย็น`]},
 {key:'obVolley',id:'OW-G09',name:'Frost Volley',br:'B',row:6,max:2,type:'self',
  d:'ยิงลูกดอกน้ำแข็ง 12 ทิศรอบตัว ทุกดอกที่โดนเพิ่มความเย็น 1 ชั้นทันที',lv:i=>[`12 ดอก × ${owX(OB.obVolley.dmg[i-1])}`,'Cooldown 11 วิ']},
 {key:'obShatter',id:'OW-G10',name:'Shatter',br:'B',row:6,max:2,type:'self',enh:'obVolley',pre:[['obVolley',2]],
  d:'(ต่อยอด Frost Volley) ระเบิดความเย็นทั้งหมดบนศัตรูรอบตัว (240) เป็นผลึกน้ำแข็งแตก ดาเมจตามจำนวนชั้น แล้วล้างความเย็น (แบบ Venom Shock)',lv:i=>[`${owX(OB.obShatter.dmg[i-1])} × ชั้นความเย็น`,'Cooldown 12 วิ']},
 {key:'obCircle',id:'OW-G11',name:'Circling Hunt',br:'B',row:7,max:2,type:'melee',shot:1,
  d:'วิ่งวนรอบเป้าหมายพร้อมยิง (แบบ Stride · วิ่งบนพื้น หยุดเมื่อติดสิ่งกีดขวาง)',lv:i=>[`${OB.obCircle.hits[i-1]} นัด × ${owX(OB.obCircle.dmg)}`,'Cooldown 14 วิ']},
 {key:'obFlash',id:'OW-G12',name:'Feather Flash',br:'B',row:7,max:1,type:'self',
  d:'สะบัดม่านขนนกใส่ศัตรูรอบตัว ตาพร่า การโจมตี 2 ครั้งถัดไปของศัตรูพลาดแน่นอน',lv:()=>[`ศัตรูตีพลาด ${OB.obFlash.miss} ครั้ง · ภายใน ${OB.obFlash.dur} วิ`,'รัศมี 130 · Cooldown 18 วิ']},
 {key:'obCage',id:'OW-G13',name:'Blizzard Cage',br:'B',row:8,max:2,type:'ground',ult:1,radius:()=>OB.obCage.R,
  d:'ULTIMATE B · ปักเสาน้ำแข็งเป็นกรงพายุหิมะ ศัตรูในกรงออกไม่ได้และถูกตรึง (บอส: ชะลอ) · ทุกวิเพิ่มความเย็น 1 ชั้น',lv:i=>[`กรง ${OB.obCage.dur[i-1]} วิ`,'รัศมี 110 · Cooldown 45 วิ']},
 {key:'obRain',id:'OW-G14',name:'Moonwind Rain',br:'B',row:8,max:1,type:'self',enh:'obCage',pre:[['obCage',1]],
  d:'(ต่อยอด Blizzard Cage) ยิงฝนลูกดอกจันทร์ลงศัตรูทุกตัวในกรง ตัวละ 1 ครั้ง (ใช้ได้เฉพาะตอนกรงยังอยู่ · แบบ Torment Rain)',lv:()=>[`${owX(OB.obRain.dmg)} ต่อเป้า`,'Cooldown 20 วิ']},
 // ---------------- CLASS C — WHITE NIGHT (12 nodes · Lv 55/60/70/80 · columns Basic / A / B) ----------------
 {key:'ocMastery',id:'OW-C01',name:'Bolt Mastery',br:'C',tier:1,passive:1,pre:[['owAuto',4]],d:'Owl Bolt: ลูกดอกตีปกติแรงขึ้นและบินเร็วขึ้น',lv:()=>[`ตีปกติ ATK +${OB.ocMastery.dmg}`]},
 {key:'ocExtra',id:'OW-C02',name:'Extra Fatal',br:'C',tier:1,passive:1,pre:[['oaFatal',4]],d:'Fatal Bolt: ใช้ได้ 10 นัดแทน 5 นัด',lv:()=>['Fatal Bolt 10 นัด']},
 {key:'ocDouble',id:'OW-C03',name:'Double Flurry',br:'C',tier:1,passive:1,pre:[['obFlurry',4]],d:'Flurry Bolts: ยิงเป็น 2 เท่า (สลับซ้าย–ขวา)',lv:()=>['จำนวนดอก ×2']},
 {key:'ocMantle',id:'OW-C05',name:'Feather Mantle',br:'C',tier:2,passive:1,pre:[['owGuard',2]],d:'Feather Guard: ล้างความเย็น/ชะงักบนตัวทันที และลดดาเมจเพิ่ม',lv:()=>[`ดาเมจที่ได้รับ −${OB.ocMantle.red} เพิ่ม · ล้างสถานะ`]},
 {key:'ocTwin',id:'OW-C10',name:'Twin Mark',br:'C',tier:2,passive:1,pre:[['oaMark',1]],d:"Hunter's Mark: ยิงแยกไปติดมาร์คศัตรูใกล้เคียงอีก 1 ตัว",lv:()=>['มาร์ค 2 เป้า']},
 {key:'ocErase',id:'OW-C07',name:'Erase Tracks',br:'C',tier:2,passive:1,pre:[['obVeil',2]],d:'Snow Veil / White Out นานขึ้น 4 วิ · นัดแรกที่ออกจากม่านคริติคอลแน่นอน',lv:()=>['+4 วิ · นัดแรกคริแน่นอน']},
 {key:'ocFan',id:'OW-C09',name:'Twin Fan',br:'C',tier:3,passive:1,pre:[['owCharge',3]],d:'Charged Bolt: ปล่อยพัดขนนก 2 ระลอก และทุกดอกที่โดนติดมาร์ค 1 ชั้น',lv:()=>['2 ระลอก · ติดมาร์ค']},
 {key:'ocNight',id:'OW-C13',name:'Night Hunter',br:'C',tier:3,passive:1,pre:[['owEye',3]],d:"Owl's Eye ติดมาร์คทุกนัด · ตีปกติใส่เป้าที่ติดมาร์คยิงลูกดอกเงาตามอีก 1 ดอก",lv:()=>['ติดมาร์คทุกนัด',`ดอกเงา ${owX(OB.ocNight.extra)}`]},
 {key:'ocPerma',id:'OW-C11',name:'Permafrost',br:'C',tier:3,passive:1,pre:[['obDeep',3]],d:'ความเย็นซ้อนได้ 6 ชั้น · Blizzard Cage อยู่นานขึ้น 2 วิ',lv:()=>['เพดาน 6 ชั้น · กรง +2 วิ']},
 {key:'ocHunt',id:'OW-C16',name:'Perfect Hunt',br:'C',tier:4,type:'self',pre:[['owSight',4]],d:'[New Active] Signature · 15 วิ: ดวงตาทองลุกโชน สกิลยิงเล็งเร็วขึ้น · ตีปกติ ATK เพิ่ม · มาร์คและความเย็นติดเป็น 2 เท่า',lv:()=>[`เวลาเล็งสกิล −${OB.ocHunt.aim} วิ`,`ตีปกติ ATK +${OB.ocHunt.atk}`,'Cooldown 90 วิ']},
 {key:'ocMoonfall',id:'OW-C14',name:'Moonfall',br:'C',tier:4,type:'self',pre:[['oaExec',1]],d:'[New Active] ลำแสงจันทร์ตกใส่ศัตรูทุกตัวที่ติดมาร์คในระยะ 520 ดาเมจตามชั้นมาร์ค แล้วล้างมาร์ค',lv:()=>[`${owX(OB.ocMoonfall.dmg).replace('ATK','TAL')} + ${owX(OB.ocMoonfall.per).replace('ATK','TAL')} ต่อชั้นมาร์ค`,'Cooldown 35 วิ']},
 {key:'ocAvalanche',id:'OW-C15',name:'Avalanche Rain',br:'C',tier:4,type:'ground',radius:()=>OB.ocAvalanche.R,pre:[['obCage',1]],d:'[New Active] พายุหิมะลงพื้นที่ 8 วิ ทุกวิดาเมจ + ความเย็น 1 ชั้น · ศัตรูตายในพายุ เกิดพายุลูกเล็กต่อตรงนั้น (สูงสุด 6 ลูก · แบบ Venom Apocalypse)',lv:()=>[`${owX(OB.ocAvalanche.dmg)} ต่อวิ`,'Cooldown 50 วิ']}
];

/* =====================================================================
   3. SYSTEMS — Owl's Mark · Frostbite · stealth · hit memory
   ===================================================================== */
const OW={combo:0,comboT:-9,fatal:0,log:new Map(),cage:null,tent:null,stormN:0,lastMove:0,px:0,py:0};
const owL=k=>LV[k]||0;
const owLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,owL(k)))-1];
const owHunt=()=>hasBuff('ocHunt');
const owStealth=()=>hasBuff('obWhite')?2:hasBuff('obVeil')?1:0;
function owFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function owLOS(t){if(!curMap)return true;const h=mapHost();if(!h||!h.ready||!h.clear)return true;return h.clear(W2M(player.x,player.y),W2M(t.x,t.y));}
function owPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!owFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
/* Owl's Mark: up to 3 stacks, 10 s, refreshed on every new stack */
function owMark(e,n){if(!e||e.dead)return;if(owHunt())n*=2;const b=e.owMark||0;e.owMark=Math.min(3,b+n);e.owMarkT=OB.owEye.dur;if(e.owMark>b)e.owMarkPop=1;}
function owTakeMarks(e){const n=e.owMark||0;e.owMark=0;e.owMarkT=0;return n;}
/* Frostbite: stacks up to the cap, slows; reaching the cap freezes non-boss targets for 1 s */
const owChillCap=()=>owL('ocPerma')?6:1+(owL('obDeep')?owLv([1,2,3],'obDeep'):0);
function owChill(e,n){if(!e||e.dead)return;if(owHunt())n*=2;const cap=owChillCap(),b=e.owChill||0;e.owChill=Math.min(cap,b+n);e.owChillT=owL('obDeep')?owLv(OB.obDeep.dur,'obDeep'):6;
  if(e.owChill>b)e.owChillPop=1;e.st.slow=Math.max(e.st.slow,.5);
  if(e.owChill>=cap&&b<cap&&cap>=2){freeze(e,1);owSheet({key:'freeze',x:e.x,y:e.y,layer:'sorted',sortOff:4,s:e.boss?.5:.36,speed:3.2});}}
/* hit memory for Silent Execution (skills only, last 10 s) */
function owRemember(e){OW.log.set(e,gameTime);}


/* ---------- code-drawn sprite textures (placeholder art) ---------- */
const OWT={ready:false};
function owTex(){if(OWT.ready)return OWT;
  const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;};
  const speck=(g,x0,y0,w,h,n)=>{g.fillStyle='rgba(110,105,100,.55)';for(let i=0;i<n;i++){const x=x0+((i*37)%w),y=y0+((i*53)%h);g.beginPath();g.ellipse(x,y,1.2,.8,0,0,Math.PI*2);g.fill();}};
  const bolt=(o)=>cv(o.w||104,24,(g,w,h)=>{const cy=h/2,sh=o.shaft||3,hx=w-(o.head||16);
      // fletching
      for(const s of [-1,1]){g.fillStyle='#f6f2ea';g.strokeStyle='#7a7266';g.lineWidth=1;g.beginPath();g.moveTo(4,cy);g.lineTo(6,cy+s*(o.fl||7));g.lineTo(26,cy+s*2);g.lineTo(26,cy);g.closePath();g.fill();g.stroke();}
      speck(g,8,cy-6,16,12,5);
      // shaft
      const gr=g.createLinearGradient(0,cy-sh,0,cy+sh);gr.addColorStop(0,o.wood2||'#d8a56a');gr.addColorStop(.5,o.wood||'#9a6a3a');gr.addColorStop(1,'#5a3a1e');g.fillStyle=gr;g.fillRect(6,cy-sh/2,hx-6,sh);g.strokeStyle='#3a2410';g.lineWidth=.8;g.strokeRect(6,cy-sh/2,hx-6,sh);
      if(o.bands)for(const x of o.bands){g.fillStyle='#8a96a8';g.fillRect(x,cy-sh/2-1,3,sh+2);}
      if(o.coat){g.strokeStyle='rgba(190,230,255,.85)';g.lineWidth=1;g.beginPath();g.moveTo(30,cy-sh/2+.5);g.lineTo(hx-2,cy-sh/2+.5);g.stroke();}
      // head
      const hg=g.createLinearGradient(hx,cy-6,hx,cy+6);hg.addColorStop(0,'#f4f8fc');hg.addColorStop(.5,o.metal||'#aab4c4');hg.addColorStop(1,'#5a6474');g.fillStyle=hg;g.strokeStyle='#2a3240';g.lineWidth=1;g.beginPath();
      const hh=o.hh||4;if(o.broad){g.moveTo(w-1,cy);g.lineTo(hx,cy-hh);g.lineTo(hx+4,cy-1);g.lineTo(hx,cy);g.lineTo(hx+4,cy+1);g.lineTo(hx,cy+hh);}else{g.moveTo(w-1,cy);g.lineTo(hx,cy-hh);g.lineTo(hx+2,cy);g.lineTo(hx,cy+hh);}
      g.closePath();g.fill();g.stroke();
      if(o.drill){g.strokeStyle='#2a3240';g.lineWidth=1;for(let i=0;i<4;i++){g.beginPath();g.moveTo(hx+3+i*3,cy-hh+1.5+i*.6);g.lineTo(hx+5+i*3,cy+hh-1.5-i*.6);g.stroke();}g.fillStyle='#e8b44a';g.fillRect(hx-3,cy-sh/2-1,3,sh+2);}});
  OWT.bolt={std:bolt({}),pierce:bolt({w:112,head:18,hh:3.5}),broad:bolt({head:18,hh:8,broad:1}),heavy:bolt({w:116,shaft:5,head:20,hh:6,bands:[40,70]}),
    drill:bolt({head:20,hh:5,drill:1,shaft:4}),dead:bolt({w:120,head:20,hh:5,wood:'#5a3a24',wood2:'#8a5a36',metal:'#d8e2ee',fl:8}),
    exec:bolt({w:128,head:22,hh:5.5,wood:'#3e2a1c',wood2:'#6a4a30',metal:'#eef4fa',fl:9,coat:1,bands:[44]}),sub:bolt({w:60,head:12,hh:3,fl:4})};
  OWT.feather=cv(30,12,(g,w,h)=>{g.fillStyle='#fbf8f2';g.strokeStyle='#8a8070';g.lineWidth=.8;g.beginPath();g.moveTo(1,h/2);g.quadraticCurveTo(w*.5,-2,w-1,h/2);g.quadraticCurveTo(w*.5,h+2,1,h/2);g.closePath();g.fill();g.stroke();
    g.strokeStyle='#b0a898';g.beginPath();g.moveTo(2,h/2);g.lineTo(w-2,h/2);g.stroke();speck(g,6,3,18,6,4);});
  OWT.wing=cv(140,84,(g,w,h)=>{const sx=10,sy=26;
    for(let i=0;i<9;i++){const an=-.55+i*.17,L=118-i*6,wd=10;g.save();g.translate(sx,sy);g.rotate(an);
      const fg=g.createLinearGradient(0,0,L,0);fg.addColorStop(0,'#f2ede2');fg.addColorStop(1,i<3?'#ffffff':'#e8e2d6');g.fillStyle=fg;g.strokeStyle='#6e6656';g.lineWidth=1.2;
      g.beginPath();g.moveTo(0,-wd*.4);g.quadraticCurveTo(L*.6,-wd,L,0);g.quadraticCurveTo(L*.6,wd,0,wd*.4);g.closePath();g.fill();g.stroke();
      g.fillStyle='rgba(120,112,100,.5)';for(let k=0;k<4;k++){g.beginPath();g.ellipse(L*(.35+k*.14),(k%2?2:-2),1.6,1,0,0,Math.PI*2);g.fill();}g.restore();}
    // coverts
    g.fillStyle='#f6f1e6';g.strokeStyle='#6e6656';g.lineWidth=1.2;g.beginPath();g.ellipse(34,26,30,15,-.15,0,Math.PI*2);g.fill();g.stroke();speck(g,14,18,40,14,7);
    g.strokeStyle='rgba(60,90,140,.55)';g.lineWidth=2;g.beginPath();g.moveTo(10,30);g.quadraticCurveTo(34,40,60,30);g.stroke();});
  OWT.bow=cv(56,40,(g,w,h)=>{const cy=h/2;
    const st=g.createLinearGradient(0,cy-3,0,cy+3);st.addColorStop(0,'#c89058');st.addColorStop(1,'#6a4424');g.fillStyle=st;g.strokeStyle='#2a1a0c';g.lineWidth=1;g.fillRect(2,cy-3,40,6);g.strokeRect(2,cy-3,40,6);
    g.fillStyle='#8a96a8';g.fillRect(14,cy-4,4,8);g.fillRect(30,cy-2,10,4);
    g.strokeStyle='#5a6474';g.lineWidth=3;g.beginPath();g.moveTo(38,2);g.quadraticCurveTo(48,cy,38,h-2);g.stroke();g.strokeStyle='#c8d2de';g.lineWidth=1;g.beginPath();g.moveTo(38,3);g.quadraticCurveTo(47,cy,38,h-3);g.stroke();});
  OWT.star=cv(48,48,(g,w,h)=>{g.translate(24,24);g.fillStyle='#ffffff';g.strokeStyle='#9aa6b8';g.lineWidth=1;g.beginPath();for(let i=0;i<8;i++){const r=i%2?5:22,a=i/8*Math.PI*2;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fill();g.stroke();});
  OWT.ready=true;return OWT;}


/* ---------- small fx classes ---------- */
class OwFeather{constructor(o){Object.assign(this,{t:0,life:rnd(.7,1.3),layer:'top',vx:0,vy:0,vz:0,rot:rnd(0,TAU),vr:rnd(-4,4),s:rnd(.45,.75)},o);}
  update(dt){this.t+=dt;this.vx*=1-1.8*dt;this.vy*=1-1.8*dt;this.vz=Math.max(-28,this.vz-60*dt);this.x+=this.vx*dt;this.y+=this.vy*dt;this.z=Math.max(0,this.z+this.vz*dt);this.rot+=this.vr*dt+Math.sin(this.t*6)*dt*2;return this.t<this.life;}
  draw(){const T=owTex().feather,[x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.35);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.rot);ctx.scale(this.s,this.s);ctx.drawImage(T,-15,-6);ctx.restore();ctx.globalAlpha=1;}}
function owFeathers(x,y,z,n,o={}){for(let i=0;i<qn(n);i++){const a=o.dir!=null?o.dir+rnd(-.9,.9):rnd(0,TAU),s=rnd(.3,1)*(o.spd||70);addFx(new OwFeather({x:x+rnd(-(o.spread||8),o.spread||8)*.3,y:y+rnd(-4,4),z:z+rnd(-6,6),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(10,40)}));}}
/* thin white air streak (wind) */
class OwStreak{constructor(o){Object.assign(this,{t:0,life:.28,layer:'top',w:1.6,col:'#ffffff',z:30},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x1,y1]=P(this.ax,this.ay,this.az??this.z),[x2,y2]=P(this.bx,this.by,this.bz??this.z),dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,h=lerp(0,1,Math.min(1,k*3)),a=1-k;
    ctx.save();ctx.globalAlpha=a*.8;ctx.fillStyle=this.col;ctx.beginPath();ctx.moveTo(x1+dx*h*.6,y1+dy*h*.6);ctx.lineTo(x2+nx*this.w,y2+ny*this.w);ctx.lineTo(x2+dx/L*6,y2+dy/L*6);ctx.lineTo(x2-nx*this.w,y2-ny*this.w);ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
/* short air-pressure ring */
class OwRing{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',r0:6,r1:30,z:30,col:'rgba(255,255,255,.75)',w:1.6},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eOut(this.t/this.life),[x,y]=P(this.x,this.y,this.z),r=lerp(this.r0,this.r1,k);ctx.save();ctx.globalAlpha=1-this.t/this.life;ctx.strokeStyle=this.col;ctx.lineWidth=this.w;ctx.beginPath();ctx.ellipse(x,y,r,r*(this.flat?K:1),this.rot||0,0,TAU);ctx.stroke();ctx.restore();ctx.globalAlpha=1;}}
/* impact: silver star flash + splinters (no big glow) */
class OwImpact{constructor(o){Object.assign(this,{t:0,life:.22,layer:'top',s:.5,z:26},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),s=this.s*(.6+.6*eOut(k));ctx.save();ctx.globalAlpha=1-k;ctx.translate(x,y);ctx.rotate(this.rot||0);ctx.scale(s,s);ctx.drawImage(owTex().star,-24,-24);ctx.restore();ctx.globalAlpha=1;}}
function owImpact(e,phi,o={}){const x=e.x,y=e.y;addFx(new OwImpact({x,y,s:o.s||.5,rot:phi}));sparks(x,y,26,phi+Math.PI,o.n||4,o.col||'#d8dee8',o.spd||140,.8);if(o.dust)dustPuff(x,y,o.dust,'#d6d0c4',60,6);if(o.feath)owFeathers(x,y,26,o.feath,{dir:phi});}



/* ---------- v2 fx: moonlight / snow / feathers (soft, restrained) ---------- */
const OWC={moon:'#e6eeff',moon2:'#b8c8ff',ice:'#bfe8ff',ice2:'#7fd0ff',gold:'#ffd86a',warm:'#ffd8a0'};
/* soft round glow (additive) */
function owGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
/* six-spoke snowflake */
function owFlake(x,y,r,col,a,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=hexA(col,a);ctx.lineWidth=Math.max(.8,r*.22);ctx.lineCap='round';for(let i=0;i<3;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.stroke();ctx.beginPath();ctx.moveTo(r*.55,0);ctx.lineTo(r*.8,-r*.25);ctx.moveTo(r*.55,0);ctx.lineTo(r*.8,r*.25);ctx.stroke();}ctx.restore();}
/* owl-eye sigil: almond eye + golden iris + slit pupil */
function owEyeSigil(x,y,s,a,open=1){ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;owGlow(0,0,s*1.6,OWC.gold,.25*a);
  const h=s*.5*open;ctx.fillStyle='rgba(16,14,24,.75)';ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-h*1.6,s,0);ctx.quadraticCurveTo(0,h*1.6,-s,0);ctx.fill();
  ctx.strokeStyle='rgba(255,246,220,.95)';ctx.lineWidth=1.2;ctx.stroke();if(open>.2){ctx.fillStyle=OWC.gold;ctx.beginPath();ctx.arc(0,0,Math.min(h,s*.42),0,TAU);ctx.fill();ctx.fillStyle='#1a1208';ctx.beginPath();ctx.ellipse(0,0,s*.09,Math.min(h,s*.38),0,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-s*.14,-s*.12,s*.08,0,TAU);ctx.fill();}
  ctx.restore();ctx.globalAlpha=1;}
/* frost burst: shards + mist + flake pop (used by Frostbite cap, Shatter, cage) */
function owFrostBurst(x,y,z,s=1){shardBurst(x,y,z,Math.round(8*s),200*s,null,Math.PI,OWC.ice);mist(x,y,z*.5,Math.round(3*s),'#cfefff',20*s,30);addFx(new OwPop({x,y,z,col:OWC.ice,R:26*s,life:.35}));}
/* owl ground impact: no drawn circle — packed snow and a few feathers are flung outward along the ground */
function owGust(x,y,R){for(let i=0;i<qn(Math.round(10+R/8));i++){const an=rnd(0,TAU),s=rnd(.6,1)*R*2.2;emit({type:'snow',x:x+Math.cos(an)*8,y:y+Math.sin(an)*6,z:rnd(1,8),vx:Math.cos(an)*s,vy:Math.sin(an)*s*.8,vz:rnd(20,70),g:260,drag:2.4,life:rnd(.4,.7),size:rnd(1.1,2.4),color:Math.random()<.6?'#ffffff':'#e2eef8'});}
  dustPuff(x,y,Math.round(3+R/25),'#eef3f8',R*.9,7);if(R>=60)owFeathers(x,y,10,2,{spd:R});}
/* soft shadow that darkens where bolts are about to fall (telegraph without a circle) */
class DropShadowOw{constructor(o){Object.assign(this,{t:0,T:.6,layer:'ground',R:60},o);this.life=this.T+.1;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=Math.min(1,this.t/this.T),a=this.t>this.T?Math.max(0,1-(this.t-this.T)/.1):1,[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,`rgba(12,18,30,${.32*k*a})`);g.addColorStop(1,'rgba(12,18,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();ctx.restore();}}
/* expanding soft disc + ring (impact core, not a hard star) */
class OwPop{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',R:24,col:'#ffffff',z:26},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=eOut(k),[x,y]=P(this.x,this.y,this.z),a=Math.pow(1-k,1.3);owGlow(x,y,this.R*(.5+.7*e),this.col,.45*a);if(this.R>30)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA('#ffffff',.5*a);ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y,this.R*(.3+e),this.R*(.3+e)*.6,0,0,TAU);ctx.stroke();ctx.restore();}}
/* crossbow bolt — real projectile with a soft tinted light trail */
class OwBolt{constructor(o){Object.assign(this,{t:0,layer:'sorted',kind:'std',speed:OW_BAL.boltSpeed,range:340,pierce:1,fall:0,mult:1,z:30,zEnd:24,rad:7,hits:0,dead:false,fade:0,homing:0,target:null,scale:.24,tint:'#ffffff',glow:0,trailN:6},o);this.hitSet=this.hitSet||new Set();this.trav=0;this.trail=[];}
  get sy(){return this.y+1;}
  update(dt){if(this.dead){this.fade-=dt;return this.fade>0;}this.t+=dt;
    if(this.homing&&this.target&&!this.target.dead){const want=Math.atan2(this.target.y-this.y,this.target.x-this.x),m=this.homing*dt;this.phi+=clamp(angDiff(want,this.phi),-m,m);}
    const st=this.speed*dt,nx=this.x+Math.cos(this.phi)*st,ny=this.y+Math.sin(this.phi)*st;
    if(!owFree(nx,ny)){this.end(nx,ny,'wall');return true;}
    for(const e of enemies){if(e.dead||this.hitSet.has(e))continue;if(distToSeg(e.x,e.y,this.x,this.y,nx,ny)<e.r+this.rad){this.hitSet.add(e);const m=this.mult*Math.pow(1-this.fall,this.hits);this.hits++;
        if(this.onHit)this.onHit(e,m,this);if(this.hits>=this.pierce){this.x=e.x;this.y=e.y;this.end(e.x,e.y,'hit');return true;}}}
    this.trail.push([this.x,this.y,this.z]);if(this.trail.length>this.trailN)this.trail.shift();
    this.x=nx;this.y=ny;this.trav+=st;this.z=lerp(this.z,this.zEnd,Math.min(1,dt*3));
    if(this.trav>=this.range)this.end(nx,ny,'range');return true;}
  end(x,y,why){this.dead=true;this.fade=why==='hit'?.05:.14;if(why==='wall'){dustPuff(x,y,3,'#cfc8b6',40,5);sparks(x,y,this.z,this.phi+Math.PI,3,'#c8b090',90,.9);}if(this.onEnd)this.onEnd(x,y,why,this);}
  draw(){const T=owTex().bolt[this.kind]||owTex().bolt.std,[x,y]=P(this.x,this.y,this.z),ang=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)),a=this.dead?Math.max(0,this.fade/.14):Math.min(1,this.t/.02);
    if(this.trail.length>1){const [tx,ty]=P(...this.trail[0]),dx=x-tx,dy=y-ty,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,w=this.trailW||1.8;ctx.save();ctx.globalCompositeOperation='lighter';
      for(const [ww,al] of this.glow?[[w*3.2,.18],[w,.7]]:[[w,.55]]){const g=ctx.createLinearGradient(tx,ty,x,y);g.addColorStop(0,hexA(this.tint,0));g.addColorStop(1,hexA(this.tint,al*a));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x+nx*ww,y+ny*ww);ctx.lineTo(x-nx*ww,y-ny*ww);ctx.closePath();ctx.fill();}ctx.restore();}
    if(this.glow)owGlow(x,y,10+this.glow*6,this.tint,.35*a);
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(ang);ctx.scale(this.scale,this.scale);ctx.drawImage(T,-T.width*.9,-T.height/2);ctx.restore();ctx.globalAlpha=1;}}
/* bolt falling from the sky onto a point (Skyfall, Moonwind Rain, Moonfall) */
class OwSkyBolt{constructor(o){Object.assign(this,{t:0,T:.28,delay:0,layer:'top',h:220,tint:OWC.moon,kind:'std',beam:0,R:16},o);}
  update(dt){this.t+=dt;const lt=this.t-this.delay;if(lt>=this.T&&!this.landed){this.landed=true;if(this.onLand)this.onLand(this);}return lt<this.T+(this.beam?.45:.12);}
  draw(){const lt=this.t-this.delay;if(lt<0)return;const k=Math.min(1,lt/this.T),z=lerp(this.h,4,eIn(k)),[x,y]=P(this.x,this.y,z),[,gy]=P(this.x,this.y,0);
    if(this.beam){const ba=lt<this.T?k*.5:Math.max(0,1-(lt-this.T)/.45),w=this.beam;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x,gy-this.h,x,gy);g.addColorStop(0,hexA(this.tint,0));g.addColorStop(.7,hexA(this.tint,.35*ba));g.addColorStop(1,hexA('#ffffff',.6*ba));ctx.fillStyle=g;ctx.fillRect(x-w,gy-this.h,w*2,this.h);ctx.restore();owGlow(x,gy,w*3,this.tint,.4*ba);}
    if(lt>=this.T)return;
    ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x,y-60,x,y);g.addColorStop(0,hexA(this.tint,0));g.addColorStop(1,hexA(this.tint,.6));ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-60);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
    const T=owTex().bolt[this.kind]||owTex().bolt.std;ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);ctx.scale(.24,.24);ctx.drawImage(T,-T.width*.9,-T.height/2);ctx.restore();
    ctx.save();ctx.globalAlpha=.25*k;ctx.fillStyle='#0a0e18';ctx.beginPath();ctx.ellipse(x,gy,6+6*k,2.5+2.5*k,0,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
/* aiming line (Aimed Shot / Deadeye / Execution): thin moonlight beam that brightens */
class OwSight{constructor(o){Object.assign(this,{t:0,layer:'top',T:.7,eclipse:false},o);this.life=this.T+.05;}update(dt){this.t+=dt;return this.t<this.life&&!(this.a&&this.a!==player.action);}
  draw(){const t=this.tg;if(!t||t.dead)return;const k=Math.min(1,this.t/this.T),[mx,my,mz]=owMuzzle(angTo(t)),[x0,y0]=P(mx,my,mz),[x1,y1]=P(t.x,t.y,(t.boss?40:24)+(t.z||0));ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.strokeStyle=hexA(OWC.moon,.15+.45*k);ctx.lineWidth=1+k;ctx.setLineDash([6,5]);ctx.lineDashOffset=-this.t*40;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([]);
    const R=lerp(26,9,eOut(k));ctx.strokeStyle=hexA(OWC.moon,.4+.5*k);ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(x1,y1,R,0,TAU);ctx.stroke();for(let i=0;i<4;i++){const an=i*Math.PI/2+this.t*2;ctx.beginPath();ctx.moveTo(x1+Math.cos(an)*R*1.25,y1+Math.sin(an)*R*1.25);ctx.lineTo(x1+Math.cos(an)*R*.75,y1+Math.sin(an)*R*.75);ctx.stroke();}
    if(this.eclipse){const er=R*1.8;ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(8,10,20,${.35*k})`;ctx.beginPath();ctx.arc(x1,y1,er,0,TAU);ctx.fill();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(OWC.gold,.6*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x1,y1,er,-.9+this.t,2.2+this.t);ctx.stroke();}
    ctx.restore();}}
/* silver crescent cut on a target (Silent Execution) */
class OwMoonCut{constructor(o){Object.assign(this,{t:0,life:.5,layer:'top',R:30},o);this.rot=rnd(-.6,.6);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,g=eOut(Math.min(1,this.t/.08)),a=k<.4?1:1-(k-.4)/.6,[x,y]=P(this.x,this.y,this.z||26),R=this.R;ctx.save();ctx.translate(x,y);ctx.rotate(this.rot);ctx.globalCompositeOperation='lighter';
    const cut=()=>{ctx.beginPath();ctx.arc(0,0,R,-2.5,-2.5+2.2*g);ctx.arc(R*.35,-R*.2,R*.82,-2.5+2.2*g,-2.5,true);ctx.closePath();};
    owGlow(0,0,R*1.4,OWC.moon2,.3*a);cut();ctx.fillStyle=hexA(OWC.moon,.8*a);ctx.fill();ctx.strokeStyle=hexA('#ffffff',a);ctx.lineWidth=1;ctx.stroke();ctx.restore();}}
/* ---------- painted sprite-sheet effects (made in Game Mellow VFX Lab, assets/skill-vfx/owl/*.png) ----------
   frames read left→right, top→bottom; ax/ay = pivot inside a frame (0..1), placed on the world point. */
const OW_SHEETS={
  shatter:{n:39,cols:8,fps:15,fw:256,ax:.5,ay:.58},     // ice thorn forest: crack + crystal spikes that burst into shards
  moon_cut:{n:25,cols:8,fps:15,fw:256,ax:.5,ay:.5},     // silver crescent cut (Silent Execution)
  veil_puff:{n:29,cols:8,fps:15,fw:256,ax:.5,ay:.5},    // white snow puff (Snow Veil / White Out)
  moon_beam:{n:30,cols:8,fps:15,fw:256,ax:.5,ay:.64},   // silver moonlight pillar (Moonfall)
  freeze:{n:52,cols:8,fps:15,fw:256,ax:.5,ay:.74},      // ice crystals encase a target (Frostbite at cap)
  wings:{n:62,cols:8,fps:15,fw:256,ax:.5,ay:.5},        // white wings + falling feathers (Feather Flash, Perfect Hunt)
  feather_guard:{n:25,cols:8,fps:15,fw:256,ax:.5,ay:.55}, // white feathers + soft wind wrapping the owl (Feather Guard)
  ice_snare:{n:34,cols:8,fps:15,fw:256,ax:.5,ay:.72},   // ring of small clear ice thorns + snow dust (Snow Snare)
  snow_impact:{n:15,cols:8,fps:15,fw:256,ax:.5,ay:.5},  // small star flash + packed-snow puff + flung snow (Heavy Bolt)
  silver_glint:{n:19,cols:8,fps:15,fw:256,ax:.5,ay:.5}, // silver motes swirl in + soft star (Fatal Bolt)
  snow_storm:{n:49,cols:8,fps:15,fw:256,ax:.5,ay:.7},   // falling snow + low wind swirl (Avalanche Rain zone)
  moon_rain:{n:33,cols:8,fps:15,fw:256,ax:.5,ay:.78},   // silver moonlight needles raining and sticking (Moonwind Rain)
  pierce_hit:{n:9,cols:8,fps:15,fw:256,ax:.5,ay:.5},    // silver flash + thin fan of streaks pointing +x (rotate to bolt dir) (Piercing / Aimed / Deadeye)
  mark_hit:{n:17,cols:8,fps:15,fw:256,ax:.5,ay:.5},     // small gold star + gold dust falling (Hunter's Mark)
  drill_sparks:{n:12,cols:8,fps:15,fw:256,ax:.5,ay:.5}, // gold drill sparks spraying +x (rotate) (Armor Drill)
  frost_volley:{n:11,cols:8,fps:15,fw:256,ax:.5,ay:.5}, // ice streaks bursting outward + ice flakes (Frost Volley)
  wing_hop:{n:18,cols:8,fps:15,fw:256,ax:.5,ay:.5},     // snow puff + feathers flung by the wing beat (Wing Hop)
  tent_rest:{n:37,cols:8,fps:15,fw:256,ax:.5,ay:.6}     // slow warm motes twinkling while resting (Snow Tent)
};
/* screen-space rotation of a world direction (for directional sheets) */
const owScrAng=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const OW_IMG={};
function owSheetImg(k){if(OW_IMG[k])return OW_IMG[k];const im=new Image();im.src='assets/skill-vfx/owl/'+k+'.png';return OW_IMG[k]=im;}
for(const k in OW_SHEETS)owSheetImg(k);
class OwSheet{constructor(o){Object.assign(this,{t:0,layer:'top',z:0,s:.4,speed:1,alpha:1,flip:false,rot:0,sy0:0},o);this.m=OW_SHEETS[this.key];this.img=owSheetImg(this.key);this.life=this.m.n/this.m.fps/this.speed;if(this.layer==='sorted')this.sy0=this.y+(this.sortOff||2);}
  get sy(){return this.sy0;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const im=this.img;if(!im.complete||!im.naturalWidth)return;const m=this.m,f=Math.min(m.n-1,Math.floor(this.t*this.speed*m.fps)),cx=(f%m.cols)*m.fw,cy=Math.floor(f/m.cols)*m.fw;
    const e=this.follow&&!this.follow.dead?this.follow:this,[x,y]=P(e.x,e.y,this.z+(this.follow?(this.follow.z||0):0)),W=m.fw*this.s,fade=Math.min(1,(this.life-this.t)/.15);
    ctx.save();ctx.globalAlpha=this.alpha*fade;ctx.translate(x,y);if(this.rot)ctx.rotate(this.rot);if(this.flip)ctx.scale(-1,1);ctx.drawImage(im,cx,cy,m.fw,m.fw,-W*m.ax,-W*m.ay,W,W);ctx.restore();ctx.globalAlpha=1;}}
const owSheet=o=>addFx(new OwSheet(o));
/* crescent moon behind the owl during Silent Execution */
class OwMoon{constructor(o){Object.assign(this,{t:0,life:2,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=Math.min(1,this.t/.4)*Math.min(1,(this.life-this.t)/.4),[x,y]=P(player.x-dirSide(player.dir)*10,player.y,110),R=30;owGlow(x,y,R*2.6,OWC.moon2,.3*a);ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#eef3ff';ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x+R*.45,y-R*.25,R*.9,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
/* ring of ice spikes + flakes holding a snared enemy */
class OwSnareFx{constructor(o){Object.assign(this,{t:0,life:2,layer:'sorted'},o);}get sy(){return this.e.y+2;}update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,a=Math.min(1,this.t/.12)*Math.min(1,(this.life-this.t)/.3),R=e.r+10,[x,y]=P(e.x,e.y);ctx.save();ctx.globalAlpha=a*.5;ctx.translate(x,y);ctx.scale(1,K);const fg=ctx.createRadialGradient(0,0,0,0,0,R);fg.addColorStop(0,'rgba(230,246,255,.5)');fg.addColorStop(1,'rgba(230,246,255,0)');ctx.fillStyle=fg;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.restore();ctx.globalAlpha=a;
    for(let i=0;i<6;i++){const an=i/6*TAU+this.t*.4,px=e.x+Math.cos(an)*R,py=e.y+Math.sin(an)*R,[sx,sy]=P(px,py,0),h=10*Math.min(1,this.t/.1);const g=ctx.createLinearGradient(sx,sy,sx,sy-h);g.addColorStop(0,`rgba(90,170,230,${.85*a})`);g.addColorStop(1,`rgba(240,252,255,${.95*a})`);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sx-3,sy);ctx.lineTo(sx,sy-h);ctx.lineTo(sx+3,sy);ctx.fill();}
    ctx.globalAlpha=1;}}
/* lantern (world prop) */
class OwLanternObj{constructor(o){Object.assign(this,{t:0,life:12,layer:'sorted',R:90,acc:0},o);}get sy(){return this.y;}
  update(dt){this.t+=dt;const near=Math.hypot(player.x-this.x,player.y-this.y)<this.R;if(near&&!player.moving&&!player.action){this.acc+=dt;if(this.acc>=OB.owLantern.tick){this.acc=0;const h=Math.round(PS.lv*owLv(OB.owLantern.hp,'owLantern')),s=owLv(OB.owLantern.sp,'owLantern');player.hp=Math.min(player.maxHp,player.hp+h);player.mp=Math.min(player.maxMp,player.mp+s);dmgNum(player.x,player.y,80,'+'+h,'heal',{scale:.8});}}else this.acc=0;
    if(Math.random()<dt*4*Q.p)emit({type:'snow',x:this.x+rnd(-this.R,this.R)*.7,y:this.y+rnd(-this.R,this.R)*.5,z:rnd(40,80),vz:-rnd(8,20),drag:.5,life:rnd(1,1.6),size:rnd(1,1.8),color:'#f4f8ff'});return this.t<this.life;}
  draw(){const a=Math.min(1,this.t/.3)*Math.min(1,(this.life-this.t)/.5),[x,y]=P(this.x,this.y),fl=.85+.15*Math.sin(this.t*7)+.05*Math.sin(this.t*17);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,hexA(OWC.warm,.22*a*fl));g.addColorStop(1,hexA(OWC.warm,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.restore();
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#4a3a2a';ctx.fillRect(x-1.5,y-34,3,34);ctx.fillStyle='#2a2018';ctx.fillRect(x-7,y-38,14,3);
    ctx.fillStyle='#e8eef6';ctx.strokeStyle='#3a3028';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-6,y-52);ctx.lineTo(x+6,y-52);ctx.lineTo(x+5,y-38);ctx.lineTo(x-5,y-38);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#f6f2ea';ctx.beginPath();ctx.moveTo(x-8,y-52);ctx.lineTo(x,y-58);ctx.lineTo(x+8,y-52);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    const lg=window.svgImg&&svgImg('lantern_glow');
    if(lg){const W=58*(.94+.06*fl);ctx.save();ctx.globalAlpha=.75*a*fl;ctx.globalCompositeOperation='lighter';ctx.translate(x,y-45);ctx.rotate(this.t*.15);ctx.drawImage(lg,-W/2,-W/2,W,W);ctx.restore();ctx.globalCompositeOperation='source-over';}
    else owGlow(x,y-45,16,OWC.warm,.6*a*fl);ctx.globalAlpha=1;}}
/* Snow Tent: small canvas tent the owl rests in */
class OwTentObj{constructor(o){Object.assign(this,{t:0,life:7,layer:'sorted'},o);}get sy(){return this.y+3;}update(dt){this.t+=dt;return this.t<this.life&&!this.gone;}
  draw(){const a=Math.min(1,this.t/.25)*Math.min(1,(this.life-this.t)/.3),[x,y]=P(this.x,this.y),up=eOutBack(Math.min(1,this.t/.3)),H=44*up,W=34;ctx.save();ctx.globalAlpha=a;
    ctx.fillStyle='rgba(10,14,20,.25)';ctx.beginPath();ctx.ellipse(x,y+2,W+6,9,0,0,TAU);ctx.fill();
    ctx.fillStyle='#e8e2d4';ctx.strokeStyle='#4a4034';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-W,y);ctx.lineTo(x,y-H);ctx.lineTo(x+W,y);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#c8bca8';ctx.beginPath();ctx.moveTo(x,y-H);ctx.lineTo(x+W,y);ctx.lineTo(x+W*.55,y);ctx.closePath();ctx.fill();ctx.fillStyle='#3a3a4a';ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x,y-H*.55);ctx.lineTo(x+8,y);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(x-W*.35,y-H*.48,9,3,-.9,0,TAU);ctx.fill();
    if(this.t>.6){ctx.font='bold 10px sans-serif';ctx.fillStyle='rgba(230,240,255,.9)';for(let i=0;i<2;i++){const k=((this.t*.6+i*.5)%1);ctx.globalAlpha=a*(1-k);ctx.fillText('z',x+8+k*10,y-H-6-k*18);}}
    ctx.restore();ctx.globalAlpha=1;}}
/* Blizzard Cage: ice pillars ring + swirling snow band. Enemies inside cannot leave, get rooted and chilled. */
class OwCageObj{constructor(o){Object.assign(this,{t:0,life:6,layer:'ground',R:110,acc:0,alive:true},o);this.pil=[];const n=12;for(let i=0;i<n;i++){const an=i/n*TAU;this.pil.push(addFx(new Crystal({x:this.x+Math.cos(an)*this.R,y:this.y+Math.sin(an)*this.R,h:rnd(34,48),w:rnd(9,12),lean:Math.cos(an)*.15,life:this.life,delay:i*.025,rise:.14,melt:.35})));}
    addFx(new FrostGround({x:this.x,y:this.y,r:this.R*1.05,life:this.life+.3,grow:.35}));this.inside=new Set(enemiesInCircle(this.x,this.y,this.R));}
  update(dt){this.t+=dt;if(this.t>=this.life){this.alive=false;if(!this.broke){this.broke=true;for(const p of this.pil)p.shatter&&p.shatter(this.x,this.y);}return false;}
    for(const e of enemies){if(e.dead)continue;const dx=e.x-this.x,dy=e.y-this.y,d=Math.hypot(dx,dy)||1;if(this.inside.has(e)){if(d>this.R-e.r){e.x=this.x+dx/d*(this.R-e.r);e.y=this.y+dy/d*(this.R-e.r);}if(e.boss)e.st.slow=Math.max(e.st.slow,.3);else e.st.root=Math.max(e.st.root,.3);}
      else if(d<this.R+e.r&&d>this.R-e.r){e.x=this.x+dx/d*(this.R+e.r);e.y=this.y+dy/d*(this.R+e.r);}}
    this.acc+=dt;if(this.acc>=1){this.acc=0;for(const e of this.inside)if(!e.dead)owChill(e,1);}
    if(Math.random()<dt*30*Q.p){const an=rnd(0,TAU),r=this.R*rnd(.2,1);emit({type:'snow',x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r,z:rnd(10,70),vx:-Math.sin(an)*90,vy:Math.cos(an)*60,vz:-rnd(5,20),drag:.6,life:rnd(.6,1.1),size:rnd(1,2.2),color:'#ffffff'});}return true;}
  draw(){}}
/* Avalanche Rain storm zone */
class OwStorm{constructor(o){Object.assign(this,{t:0,life:8,layer:'ground',R:100,acc:0,chain:true,sh:0},o);}
  update(dt){this.t+=dt;this.acc+=dt;
    // painted snow-storm sheet, re-spawned so overlapping copies cover the whole zone duration
    this.sh-=dt;if(this.sh<=0&&this.t<this.life-1){this.sh=1.5;owSheet({key:'snow_storm',x:this.x,y:this.y,s:this.R/100*1.25,speed:1.35,alpha:.8});}if(this.acc>=1&&this.t<this.life){this.acc=0;for(const e of enemiesInCircle(this.x,this.y,this.R)){owHurt(e,OB.ocAvalanche.dmg,{key:'ocAvalanche'},{color:'#dff4ff'});owChill(e,1);
        if(e.dead&&this.chain&&OW.stormN<OB.ocAvalanche.chainMax){OW.stormN++;addFx(new OwStorm({x:e.x,y:e.y,R:OB.ocAvalanche.chainR,life:OB.ocAvalanche.chainDur,chain:true}));}}}
    if(Math.random()<dt*40*Q.p){const an=rnd(0,TAU),r=this.R*Math.sqrt(Math.random());emit({type:'snow',x:this.x+Math.cos(an)*r-30,y:this.y+Math.sin(an)*r,z:rnd(60,120),vx:rnd(40,70),vz:-rnd(80,140),drag:.2,life:rnd(.6,.9),size:rnd(1.2,2.4),color:Math.random()<.5?'#ffffff':'#dff0ff'});}return this.t<this.life;}
  draw(){const a=Math.min(1,this.t/.4)*Math.min(1,(this.life-this.t)/.5),[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,`rgba(220,238,255,${.28*a})`);g.addColorStop(.8,`rgba(180,215,245,${.18*a})`);g.addColorStop(1,'rgba(180,215,245,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.restore();}}
/* feather fan cone (Charged Bolt) */
class OwFan{constructor(o){Object.assign(this,{t:0,life:.32,layer:'top',R:110,half:.5,z:28},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=eOut(k),a=Math.pow(1-k,1.2),[x,y]=P(this.x,this.y,this.z),R=this.R*(.3+.7*e),ang=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi));ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(1,.6);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,R*.2,0,0,R);g.addColorStop(0,hexA('#ffffff',0));g.addColorStop(.75,hexA(OWC.moon,.22*a));g.addColorStop(1,hexA('#ffffff',0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,-this.half,this.half);ctx.closePath();ctx.fill();ctx.restore();}}

function owMuzzle(phi){const z=(player.z||0)+30*CHAR_SCALE;return [player.x+Math.cos(phi)*14,player.y+Math.sin(phi)*14,z];}
function owSnap(phi,big,tint){const [x,y,z]=owMuzzle(phi);addFx(new OwRing({x:x+Math.cos(phi)*6,y:y+Math.sin(phi)*6,z,r0:3,r1:big?16:10,life:.18,w:1.2}));addFx(new OwStreak({ax:x,ay:y,az:z,bx:x+Math.cos(phi)*(big?46:30),by:y+Math.sin(phi)*(big?46:30),bz:z,life:.16,w:big?1.6:1.1,col:tint||'#ffffff'}));
  if(big)owFeathers(player.x,player.y,(player.z||0)+36,2,{dir:phi+Math.PI,spd:50});}

/* ---------- overlay: marks above heads, frost flakes at feet, Fatal Bolt pips, stealth shimmer ---------- */
let owOverlay=null,owCore=null;
class OwOverlay{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;return CHAR==='owl';}
  draw(){for(const e of enemies){if(e.dead)continue;
      if(e.owMark>0){const pop=e.owMarkPop||0,[x,y]=P(e.x,e.y,(e.boss?104:76)+(e.z||0)),fade=Math.min(1,e.owMarkT/1);owEyeSigil(x,y,7*(1+pop*.5),.9*fade,1);
        for(let i=0;i<3;i++){ctx.fillStyle=i<e.owMark?OWC.gold:'rgba(40,36,30,.6)';ctx.beginPath();const px=x+(i-1)*6,py=y+8;ctx.moveTo(px,py-2.5);ctx.lineTo(px+2,py);ctx.lineTo(px,py+2.5);ctx.lineTo(px-2,py);ctx.closePath();ctx.fill();}}
      if(e.owChill>0){const n=e.owChill,R=e.r+4,pop=e.owChillPop||0;for(let i=0;i<n;i++){const an=i/n*TAU+this.t*.8,[x,y]=P(e.x+Math.cos(an)*R,e.y+Math.sin(an)*R*.8,4);owFlake(x,y,3.2+pop*2,OWC.ice,.85,this.t*2+i);}}}
    if(OW.fatal>0){const [x,y]=P(player.x,player.y,(player.z||0)+84*CHAR_SCALE);for(let i=0;i<OW.fatal;i++){const an=this.t*2+i/OW.fatal*TAU;owGlow(x+Math.cos(an)*12,y+Math.sin(an)*4,4,OWC.moon,.7);}}
    if(owStealth()&&Math.random()<.3){const [x,y]=P(player.x+rnd(-14,14),player.y,rnd(10,60));owFlake(x,y,2,'#ffffff',.6,rnd(0,3));}}}
/* ---------- core: timers for marks / chill / stealth / combo ---------- */
class OwCore{constructor(){this.t=0;this.layer='none';}draw(){}
  update(dt){this.t+=dt;if(!owOverlay||!fx.includes(owOverlay))owOverlay=addFx(new OwOverlay());
    for(const e of enemies){if(e.dead){e.owMark=0;e.owChill=0;continue;}
      if(e.owMark>0){e.owMarkT-=dt;e.owMarkPop=Math.max(0,(e.owMarkPop||0)-dt*4);if(e.owMarkT<=0)e.owMark=0;}
      if(e.owChill>0){e.owChillT-=dt;e.owChillPop=Math.max(0,(e.owChillPop||0)-dt*4);e.st.slow=Math.max(e.st.slow,.15);if(e.owChillT<=0){e.owChill=0;}}}
    if(owStealth()){for(const e of enemies){if(e.dead)continue;e.aggro=0;if(e.atk>0&&owStealth()===2)e.atk=0;}}
    for(const [e,t] of OW.log)if(e.dead||gameTime-t>OB.oaExec.memory)OW.log.delete(e);
    if(OW.fatal<=0&&hasBuff('oaFatal'))delete player.buffs.oaFatal;if(!hasBuff('oaFatal'))OW.fatal=0;
    if(OW.tent&&(!player.action||player.action.key!=='ocTent'))OW.tent=null;      // tent ends with its action (interrupt, cancel, reset)
    return CHAR==='owl';}}

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
const owRange=k=>SKILLS[k]?SKILLS[k].range:300;
function owTgt(c,range){if(c.target&&!c.target.dead)return c.target;return nearestEnemy(player.x,player.y,range*1.15,player.phi)||nearestEnemy(player.x,player.y,range*1.15);}
const owPhi=(c,t)=>t?angTo(t):(c.phi??player.phi);
/* shot context: who fired, from stealth or not. Firing out of Snow Veil ends the veil (White Out keeps it). */
function owCtx(a,o){if(a.owCtx)return a.owCtx;const st=owStealth(),ctx={key:o.key,auto:o.key==='basic',veil:st>0,erase:st>0&&owL('ocErase')>0,ignoreDef:o.ignoreDef||0,fatal:false};
  if(st===1)delete player.buffs.obVeil;if(st>0)owFeathers(player.x,player.y,40,2,{spd:40});return a.owCtx=ctx;}
function owHurt(e,mult,ctx,o={}){const d=hurt(e,mult,Object.assign({critOK:true,owShot:ctx},o));if(ctx&&ctx.key!=='basic')owRemember(e);return d;}
/* generic crossbow action: aim → N fire events → recovery. Damage lands when a bolt touches an enemy. */
function owShotAction(o){faceTo(o.phi);let aim=o.aim;if(owHunt())aim=Math.max(.05,aim-OB.ocHunt.aim);
  const d=player.dir,ad=atkDir(d),ct=CT(ad),f0=Math.max(0,ct-2),fF=Math.max(0,ct-1),n=o.shots||1,gap=o.gap||.14,tF=aim,rec=o.recover??.2;
  const s=[...hold('attack',ad,f0,Math.max(.03,aim)*1000)];for(let i=0;i<n;i++)s.push(...hold('attack',ad,fF,(i<n-1?gap:.12)*1000));s.push(...hold('attack',ad,f0,rec*1000));
  const ev=[];for(let i=0;i<n;i++)ev.push({t:tF+i*gap,f:a=>{a.lastFire=a.t;const c=owCtx(a,o);o.fire(a,i,c);owSnap(player.phi,o.heavy,o.tint);}});
  if(o.events)ev.push(...o.events);
  return act({key:o.key,name:o.name,seq:s,windup:tF,dur:tF+(n-1)*gap+.12,hitList:[],owShot:true,aimT:[0,tF],events:ev,update:(a,dt)=>{if(o.update)o.update(a,dt);}});}
/* fire one bolt toward a target (or phi) */
function owFire(a,ctx,o){const phi=o.phi??(o.target&&!o.target.dead?Math.atan2(o.target.y-player.y,o.target.x-player.x):player.phi),[x,y,z]=owMuzzle(phi);
  const b=addFx(new OwBolt(Object.assign({x,y,z,phi,target:o.target,homing:o.homing||0,range:(o.range||owRange(ctx.key)||300)*1.15,mult:o.mult??1,
    onHit:(e,m,bb)=>{const d=owHurt(e,m,ctx,o.hurt||{});a.hitConfirmed=true;if(o.hit)o.hit(e,m,bb,d);else owImpact(e,bb.phi,o.imp||{});owOnHit(e,ctx);}},o.bolt||{})));return b;}
/* on-hit passives (normal attacks only): Owl's Eye marks, Frostbite chill */
function owOnHit(e,ctx){if(!ctx.auto||e.dead)return;
  OW.eyeN=(OW.eyeN||0)+1;OW.frostN=(OW.frostN||0)+1;
  if(owL('owEye')&&(owL('ocNight')||OW.eyeN>=owLv(OB.owEye.every,'owEye'))){OW.eyeN=0;owMark(e,1);}
  if(owL('obFrost')&&OW.frostN>=owLv(OB.obFrost.every,'obFrost')){OW.frostN=0;owChill(e,1);const [x,y]=[e.x,e.y];mist(x,y,24,1,'#dff4ff',12,20);}}

/* ---------- normal attack: Owl Bolt chain → Charged Bolt fan finisher ---------- */
function mkOwBasic(tgt){const lv=Math.max(1,owL('owAuto')),chain=OW_BAL.auto.chain[lv-1];if(gameTime-OW.comboT>1.2||OW.combo>=chain)OW.combo=0;const idx=OW.combo,fin=owL('owCharge')>0&&idx===chain-1&&chain>=2;
  const sp=aspd(),phi=angTo(tgt);
  if(fin)return owShotAction({key:'basic',name:'Charged Bolt',phi,aim:.22/sp,recover:.22/sp,heavy:1,
    events:[{t:.02,f:()=>{const [x,y,z]=owMuzzle(phi);addFx(new OwPop({x,y,z,R:14,col:OWC.moon,life:.25}));}}],
    fire:(a,i,c)=>{OW.combo=0;OW.comboT=gameTime;const waves=owL('ocFan')?2:1,dm=owLv(OB.owCharge.dmg,'owCharge');
      for(let w=0;w<waves;w++)setFxTimer(w*.16+.001,()=>{addFx(new OwFan({x:player.x,y:player.y,phi,R:120}));for(let k=0;k<OB.owCharge.n;k++){const an=phi+(k/(OB.owCharge.n-1)-.5)*2*OB.owCharge.spread;
        owFire(a,c,{phi:an,mult:dm,range:170,bolt:{kind:'sub',speed:760,scale:.3,tint:OWC.moon,glow:.5,trailN:5},hit:(e,m,b)=>{owImpact(e,b.phi,{s:.4,n:2,feath:1});if(owL('ocFan'))owMark(e,1);}});}
        owFeathers(player.x,player.y,34,3,{dir:phi,spd:120});});shake(1.4);}});
  return owShotAction({key:'basic',name:'Owl Bolt',phi,aim:OW_BAL.auto.aim[lv-1]/sp,recover:.12/sp,
    fire:(a,i,c)=>{OW.combo=idx+1;OW.comboT=gameTime;let tint='#ffffff',glow=0;if(OW.fatal>0){c.fatal=true;OW.fatal--;tint=OWC.moon;glow=1;}
      owFire(a,c,{target:tgt,mult:1,bolt:{kind:c.fatal?'dead':'std',speed:owL('ocMastery')?980:OW_BAL.boltSpeed,tint,glow,trailW:c.fatal?2:1.5},hurt:{auto:true},imp:{s:.35,n:2},
        hit:(e,m,b)=>{owImpact(e,b.phi,{s:c.fatal?.55:.35,n:c.fatal?4:2});if(c.fatal)addFx(new OwPop({x:e.x,y:e.y,R:20,col:OWC.moon,life:.25}));
          if(owL('ocNight')&&e.owMark>0&&!e.dead)setFxTimer(.08,()=>{if(e.dead)return;const sb=addFx(new OwBolt({x:player.x,y:player.y,z:34,phi:angTo(e),target:e,homing:6,kind:'sub',tint:OWC.gold,glow:.6,scale:.22,mult:OB.ocNight.extra,onHit:(e2,m2,bb)=>{owHurt(e2,m2,c,{auto:true});owImpact(e2,bb.phi,{s:.3,n:1});}}));});}});}});}

/* ---------- BASIC actives ---------- */
function mkOwGuard(c){return buffAct({key:'owGuard',name:'Feather Guard',speed:2.2,glow:'#e8ecf4',events:tP=>[{t:tP*.5,f:()=>{addBuff('owGuard',OB.owGuard.dur);owFeathers(player.x,player.y,36,4,{spd:-50,spread:40});owSheet({key:'feather_guard',follow:player,x:player.x,y:player.y,z:6,s:.62,speed:1.1,alpha:.95});
  if(owL('ocMantle')){player.buffs&&delete player.buffs.slowed;addFx(new DText({x:player.x,y:player.y,z:90,text:'CLEANSE',color:'#f4f8ff',size:11,life:.7}));}
  addFx(new BuffEmitter({buff:'owGuard',rate:5,emit:()=>{const an=rnd(0,TAU);addFx(new OwFeather({x:player.x+Math.cos(an)*20,y:player.y+Math.sin(an)*10,z:rnd(14,50),vx:-Math.sin(an)*30,vy:Math.cos(an)*18,vz:rnd(-5,10),life:.7,s:.45}));}}));}}]});}
function mkOwHop(c){const lv=owL('owHop'),L=OB.owHop.dist[lv-1],near=nearestEnemy(player.x,player.y,220);let phi=near?Math.atan2(player.y-near.y,player.x-near.x):player.phi+Math.PI;
  let [ex,ey]=owPathEnd(player.x,player.y,phi,L);if(Math.hypot(ex-player.x,ey-player.y)<L*.5){for(const s of [1,-1]){const p2=phi+s*Math.PI/2,[qx,qy]=owPathEnd(player.x,player.y,p2,L);if(Math.hypot(qx-player.x,qy-player.y)>Math.hypot(ex-player.x,ey-player.y)){ex=qx;ey=qy;}}}
  const sx=player.x,sy=player.y,T=.32,d=player.dir;
  return act({key:'owHop',name:'Wing Hop',seq:[...hold('buff',d,1,T*1000),...hold('buff',d,0,120)],windup:.05,dur:T+.05,hitList:[],events:[{t:.01,f:()=>{player.iframes=Math.max(player.iframes,T);owSheet({key:'wing_hop',x:sx,y:sy,z:14,s:.5,speed:1.2});owFeathers(sx,sy,30,2,{dir:phi+Math.PI});}},
      {t:T,f:()=>{dustPuff(player.x,player.y,3,'#eef2f6',30,5);}}],
    update:(a,dt)=>{const k=Math.min(1,a.t/T);if(a.t<=T+.01){player.x=lerp(sx,ex,eOut(k));player.y=lerp(sy,ey,eOut(k));player.z=Math.sin(Math.PI*k)*18;}}});}
function mkOwLantern(c){return buffAct({key:'owLantern',name:'Snow Lantern',speed:2,glow:OWC.warm,events:tP=>[{t:tP,f:()=>{const [x,y]=owPathEnd(player.x,player.y,player.phi,16);addFx(new OwLanternObj({x,y,life:OB.owLantern.dur,R:OB.owLantern.R}));dustPuff(x,y,3,'#eef2f6',30,5);}}]});}

/* ---------- A · MOONLIT MARKSMAN ---------- */
function mkOaFatal(c){return buffAct({key:'oaFatal',name:'Fatal Bolt',speed:1.8,glow:OWC.moon,events:tP=>[{t:tP,f:()=>{OW.fatal=owL('ocExtra')?OB.ocExtra.n:OB.oaFatal.n;addBuff('oaFatal',OB.oaFatal.dur);const [x,y,z]=owMuzzle(player.phi);owSheet({key:'silver_glint',x,y,z,s:.36,speed:1.2});
  for(let i=0;i<8;i++){const an=i/8*TAU;emit({type:'ember',x:player.x+Math.cos(an)*30,y:player.y+Math.sin(an)*15,z:z,vx:-Math.cos(an)*60,vy:-Math.sin(an)*30,vz:10,drag:3,life:.4,size:1.6,size1:.3,color:OWC.moon});}}}]});}
function mkOaPierce(c){const t=owTgt(c,owRange('oaPierce')),lv=owL('oaPierce'),deep=owL('oaDeep');return owShotAction({key:'oaPierce',name:'Piercing Bolt',phi:owPhi(c,t),aim:.18,tint:OWC.moon,
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,mult:OB.oaPierce.dmg[lv-1],bolt:{kind:'pierce',speed:980,pierce:OB.oaPierce.targets+(deep?OB.oaDeep.extra[deep-1]:0),fall:deep?0:OB.oaPierce.fall,trailN:12,trailW:2.2,tint:OWC.moon,glow:1},
    hit:(e,m,b)=>{owImpact(e,b.phi,{s:.4,n:2});owSheet({key:'pierce_hit',x:e.x,y:e.y,z:24,s:.42,speed:1.2,rot:owScrAng(b.phi)});}});}});}
function owAimed(c,key,name,dmg,aim,eclipse){const t=owTgt(c,owRange(key));let sight=null;return owShotAction({key,name,phi:owPhi(c,t),aim,heavy:1,recover:.3,tint:OWC.moon,
  update:(a)=>{if(t&&!t.dead&&a.t<a.windup)faceTo(angTo(t));},
  events:[{t:.02,f:a=>{if(t)sight=addFx(new OwSight({tg:t,T:owHunt()?Math.max(.05,aim-OB.ocHunt.aim):aim,eclipse,a}));owEyeSigil&&addFx(new OwRing({x:player.x,y:player.y,z:(player.z||0)+56*CHAR_SCALE,r0:1,r1:7,life:.25,w:1.4,col:'rgba(255,214,90,.95)'}));}}],
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:2.5,mult:dmg,bolt:{kind:eclipse?'exec':'dead',speed:1250,scale:.28,trailN:12,trailW:2.4,tint:OWC.moon,glow:1.4},hurt:{big:true},
    hit:(e,m,b)=>{owImpact(e,b.phi,{s:.6,n:5,feath:2});owSheet({key:'pierce_hit',x:e.x,y:e.y,z:(e.boss?32:24),s:eclipse?.7:.56,speed:1,rot:owScrAng(b.phi)});if(eclipse){addFx(new OwMoonCut({x:e.x,y:e.y,R:30}));stop(80);}shake(eclipse?3:1.8);}});
    const [x,y,z]=owMuzzle(player.phi);addFx(new OwStreak({ax:x,ay:y,az:z,bx:x+Math.cos(player.phi)*90,by:y+Math.sin(player.phi)*90,bz:z,life:.3,w:2,col:OWC.moon}));}});}
function mkOaAim(c){return owAimed(c,'oaAim','Aimed Shot',owLv(OB.oaAim.dmg,'oaAim'),OB.oaAim.aim,false);}
function mkOaDeadeye(c){return owAimed(c,'oaDeadeye','Deadeye',owLv(OB.oaDeadeye.dmg,'oaDeadeye'),OB.oaDeadeye.aim,true);}
function mkOaMark(c){const t=owTgt(c,owRange('oaMark'));return owShotAction({key:'oaMark',name:"Hunter's Mark",phi:owPhi(c,t),aim:.15,tint:OWC.gold,
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:6,mult:OB.oaMark.dmg,bolt:{kind:'dead',tint:OWC.gold,glow:1,trailW:1.8},hit:(e,m,b)=>{owMark(e,OB.oaMark.n);owImpact(e,b.phi,{s:.4,n:2});owSheet({key:'mark_hit',x:e.x,y:e.y,z:(e.boss?104:76),s:.34,speed:1.1});
      if(owL('ocTwin')){const o=enemies.filter(q=>!q.dead&&q!==e&&dist(q,e)<220).sort((p,q)=>dist(p,e)-dist(q,e))[0];if(o)addFx(new OwBolt({x:e.x,y:e.y,z:26,phi:Math.atan2(o.y-e.y,o.x-e.x),target:o,homing:6,kind:'sub',tint:OWC.gold,glow:.6,mult:OB.oaMark.dmg*.5,onHit:(e2,m2,bb)=>{owHurt(e2,m2,ctx);owMark(e2,OB.oaMark.n);owImpact(e2,bb.phi,{s:.3});}}));}}});}});}
function mkOaHeavy(c){const t=owTgt(c,owRange('oaHeavy')),lv=owL('oaHeavy'),phi=owPhi(c,t);return owShotAction({key:'oaHeavy',name:'Heavy Bolt',phi,aim:.3,heavy:1,recover:.32,
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:1.5,mult:OB.oaHeavy.dmg[lv-1],bolt:{kind:'heavy',speed:660,rad:9,scale:.28,zEnd:20,trailW:2.6,tint:'#f0e8dc'},hurt:{knock:[phi,140],big:true},
      hit:(e,m,b)=>{owImpact(e,b.phi,{s:.5,n:4});owSheet({key:'snow_impact',x:e.x,y:e.y,z:(e.boss?32:22),s:e.boss?.5:.4,speed:1.3});if(window.svgFx)svgFx('snow_crown',{x:e.x,y:e.y+2,z:0,s:e.boss?.42:.34,ay:.86,layer:'sorted',sortOff:3,life:.5,grow:[.3,1],growT:.1,fadeOut:.55});owGust(e.x,e.y,44);shake(2);}});
    const [bx,by]=owPathEnd(player.x,player.y,phi+Math.PI,10);player.x=bx;player.y=by;dustPuff(player.x,player.y,2,'#eef2f6',30,5);}});}
function mkOaDrill(c){const t=owTgt(c,owRange('oaDrill')),lv=owL('oaDrill'),phi=owPhi(c,t);return owShotAction({key:'oaDrill',name:'Armor Drill',phi,aim:.28,heavy:1,ignoreDef:OB.oaDrill.ignoreDef[lv-1],
  fire:(a,i,sc)=>{const b=owFire(a,sc,{target:t,homing:2,mult:OB.oaDrill.dmg[lv-1],bolt:{kind:'drill',speed:780,scale:.27,trailW:2,tint:OWC.gold,glow:.6},
      hit:(e,m,b)=>{owSheet({key:'drill_sparks',x:e.x,y:e.y,z:(e.boss?32:24),s:.4,speed:1,rot:owScrAng(b.phi+Math.PI)});owImpact(e,b.phi,{s:.45,n:3,col:'#fff4c8',spd:200});}});
    if(b){const d=b.draw.bind(b);b.draw=function(){d();if(this.dead)return;const [x,y]=P(this.x,this.y,this.z);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(OWC.gold,.6);ctx.lineWidth=1.2;for(let k=0;k<3;k++){const an=this.t*40+k*TAU/3;ctx.beginPath();ctx.ellipse(x,y,6,6*Math.abs(Math.sin(an)),Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)),0,TAU);ctx.stroke();}ctx.restore();};}}});}
function mkOaRico(c){const t=owTgt(c,owRange('oaRico'));return owShotAction({key:'oaRico',name:'Ricochet Bolt',phi:owPhi(c,t),aim:.16,tint:OWC.moon,
  fire:(a,i,ctx)=>{let left=OB.oaRico.n;const hitSet=new Set();
    const onHit=(e,m,b)=>{owHurt(e,m,ctx);a.hitConfirmed=true;owImpact(e,b.phi,{s:.45,n:4});addFx(new OwPop({x:e.x,y:e.y,R:16,col:OWC.moon,life:.2}));hitSet.add(e);if(left<=0)return;
      const pool=enemies.filter(q=>!q.dead&&!hitSet.has(q)&&dist(q,e)<=OB.oaRico.jump).sort((p,q)=>((q.owMark||0)-(p.owMark||0))||dist(p,e)-dist(q,e)),nx=pool[0];if(!nx)return;left--;
      if(window.svgFx){const p2=Math.atan2(nx.y-e.y,nx.x-e.x);svgFx('rico_glint',{x:e.x,y:e.y,z:26,s:.42,rot:owScrAng(p2)+35*Math.PI/180,life:.34,grow:[.5,1.05],growT:.08,fadeOut:.6});}
      addFx(new OwBolt({x:e.x,y:e.y,z:26,phi:Math.atan2(nx.y-e.y,nx.x-e.x),target:nx,homing:6,kind:'std',speed:760,range:OB.oaRico.jump*1.3,mult:Math.max(.4,m-OB.oaRico.drop),tint:OWC.moon,glow:.8,trailN:8,hitSet:new Set(hitSet),onHit}));};
    const b=owFire(a,ctx,{target:t,mult:OB.oaRico.dmg,bolt:{kind:'std',tint:OWC.moon,glow:.8,trailN:8}});if(b)b.onHit=onHit;}});}
/* Ultimate A — Silent Execution */
function mkOaExec(c){const lv=owL('oaExec'),T=OB.oaExec.aim,d=player.dir,pk=bPeak(d),t0=c.target&&!c.target.dead?c.target:nearestEnemy(player.x,player.y,owRange('oaExec'));
  let list=[...OW.log.keys()].filter(e=>!e.dead).slice(0,OB.oaExec.maxT);if(!list.length&&t0)list=[t0];if(!list.length){msg('ยังไม่มีเป้าที่โดนสกิล');return null;}
  const s=[...seq('buff',d,0,pk,1.4),...hold('buff',d,pk,Math.max(0,T-.3)*1000),...seq('attack',atkDir(d),CT(atkDir(d)),null,1.2)],tF=T+.1;
  const ev=[{t:.02,f:()=>{skyDarkT=.55;addFx(new OwMoon({life:T+1.1}));owFeathers(player.x,player.y,58,3,{spd:20});}},{t:T*.6,f:()=>{for(const e of list)if(!e.dead)addFx(new OwSight({tg:e,T:T*.4+.1}));}}];
  list.forEach((e,i)=>ev.push({t:tF+i*.06,f:a=>{if(e.dead)return;const ctx=owCtx(a,{key:'oaExec'});let m=OB.oaExec.dmg[lv-1];if(owL('oaLast')){if(e.hp<e.maxHp*OB.oaLast.low)m+=OB.oaLast.add;m+=OB.oaLast.perMark*owTakeMarks(e);}
    owSheet({key:'moon_cut',x:e.x,y:e.y,z:(e.boss?44:28),s:e.boss?.5:.36,speed:1.6,flip:i%2===1});owHurt(e,m,ctx,{big:true});a.hitConfirmed=true;owFeathers(e.x,e.y,30,2,{spd:40});if(i===0){shake(4);stop(110);}}}));
  ev.push({t:tF+list.length*.06+.25,f:()=>{skyDarkT=0;}});
  return act({key:'oaExec',name:'Silent Execution',seq:s,windup:tF,dur:tF+list.length*.06+.3,hitList:[],events:ev,onInterrupt:()=>{skyDarkT=0;},update:a=>{player.glow={color:OWC.moon,k:.6};}});}

/* ---------- B · SNOWSTORM TRICKSTER ---------- */
function mkObFlurry(c){const t=owTgt(c,owRange('obFlurry')),n=OB.obFlurry.n[owL('obFlurry')-1]*(owL('ocDouble')?2:1);return owShotAction({key:'obFlurry',name:'Flurry Bolts',phi:owPhi(c,t),aim:.1,shots:n,gap:OB.obFlurry.gap*(owL('ocDouble')?.6:1),tint:OWC.ice,
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:4,mult:OB.obFlurry.dmg,phi:(t&&!t.dead?angTo(t):player.phi)+(i%2?.06:-.06),bolt:{kind:'std',speed:900,tint:OWC.ice,glow:.5,trailN:5},hit:(e,m,b)=>{owImpact(e,b.phi,{s:.3,n:1});if(window.svgFx)svgFx('frost_flake',{x:e.x+rnd(-6,6),y:e.y,z:(e.boss?34:26)+rnd(-6,6),s:.26,life:.5,spin:rnd(-2.5,2.5),rot:rnd(0,1),grow:[.35,1],growT:.1,fadeOut:.55});else mist(e.x,e.y,24,1,'#dff4ff',10,20);}});}});}
function mkObVeil(c){const lv=owL('obVeil');return act({key:'obVeil',name:'Snow Veil',seq:hold('buff',player.dir,1,260),windup:.08,dur:.26,hitList:[],events:[{t:.06,f:()=>{addBuff('obVeil',OB.obVeil.dur[lv-1]+(owL('ocErase')?OB.ocErase.dur:0));owSheet({key:'veil_puff',x:player.x,y:player.y+2,z:30,s:.42,speed:1.3});
  for(let i=0;i<qn(16);i++){const an=rnd(0,TAU);emit({type:'snow',x:player.x+Math.cos(an)*rnd(4,30),y:player.y+Math.sin(an)*rnd(2,16),z:rnd(5,60),vx:Math.cos(an)*rnd(20,60),vy:Math.sin(an)*rnd(10,30),vz:rnd(-10,20),drag:1.5,life:rnd(.6,1),size:rnd(1,2.4),color:'#ffffff'});}
  owFeathers(player.x,player.y,36,3,{spd:40});}}]});}
function mkObWhite(c){const lv=owL('obWhite');return buffAct({key:'obWhite',name:'White Out',speed:1.8,glow:'#ffffff',events:tP=>[{t:tP,f:()=>{addBuff('obWhite',OB.obWhite.dur[lv-1]+(owL('ocErase')?OB.ocErase.dur:0));owSheet({key:'veil_puff',x:player.x,y:player.y+2,z:32,s:.6,speed:1.1});owGust(player.x,player.y,50);for(let i=0;i<qn(20);i++){const an=rnd(0,TAU);emit({type:'snow',x:player.x+Math.cos(an)*rnd(6,26),y:player.y+Math.sin(an)*rnd(3,12),z:rnd(5,70),vx:-Math.sin(an)*80,vy:Math.cos(an)*40,vz:rnd(0,30),drag:1.2,life:rnd(.6,1),size:rnd(1,2.4),color:'#ffffff'});}
  addFx(new BuffEmitter({buff:'obWhite',rate:12,emit:()=>{const an=rnd(0,TAU);emit({type:'snow',x:player.x+Math.cos(an)*30,y:player.y+Math.sin(an)*14,z:rnd(5,60),vx:-Math.sin(an)*60,vy:Math.cos(an)*30,vz:rnd(-5,10),drag:1,life:.6,size:rnd(1,2),color:'#ffffff'});}}));}}]});}
function mkObSnare(c){const t=owTgt(c,owRange('obSnare')),lv=owL('obSnare');return owShotAction({key:'obSnare',name:'Snow Snare',phi:owPhi(c,t),aim:.16,tint:OWC.ice,
  fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:4,mult:OB.obSnare.dmg,bolt:{kind:'pierce',tint:OWC.ice,glow:1,trailN:8},hit:(e,m,b)=>{const dur=OB.obSnare.dur[lv-1];if(e.boss)e.st.slow=Math.max(e.st.slow,dur*1.5);else{e.st.root=Math.max(e.st.root,dur);e.vx=e.vy=0;}
      addFx(new OwSnareFx({e,life:dur}));owSheet({key:'ice_snare',x:e.x,y:e.y,layer:'sorted',sortOff:4,s:e.boss?.52:.42,speed:Math.max(1,2.27/(dur+.3))});if(window.svgFx)svgFx('frost_flake',{x:e.x,y:e.y,z:(e.boss?44:34),s:.3,life:.6,spin:1.5,grow:[.3,1],growT:.12,fadeOut:.5});owFrostBurst(e.x,e.y,20,.4);owChill(e,2);}});}});}
function mkObSkyfall(c){const gx=c.gx??player.x+Math.cos(player.phi)*120,gy=c.gy??player.y+Math.sin(player.phi)*120,phi=Math.atan2(gy-player.y,gx-player.x),R=OB.obSkyfall.R,d=player.dir,T=.3,lv=owL('obSkyfall');faceTo(phi);
  const s=[...hold('buff',d,1,T*1000),...hold('buff',d,Math.min(3,bPeak(d)),420),...hold('buff',d,1,240)];
  return act({key:'obSkyfall',name:'Skyfall Volley',seq:s,windup:T,dur:T+.66,hitList:[],owShot:true,
    events:[{t:.01,f:()=>{player.iframes=Math.max(player.iframes,.9);dustPuff(player.x,player.y,4,'#eef2f6',40,6);owFeathers(player.x,player.y,20,3,{spd:60});addFx(new DropShadowOw({x:gx,y:gy,R,T:.75}));}},
      {t:T,f:a=>{const ctx=owCtx(a,{key:'obSkyfall'});owSnap(phi,true,OWC.ice);for(let i=0;i<OB.obSkyfall.n;i++){const an=rnd(0,TAU),r=R*Math.sqrt(Math.random())*.85,x=gx+Math.cos(an)*r,y=gy+Math.sin(an)*r;
        addFx(new OwSkyBolt({x,y,delay:i*.05,T:.22,tint:OWC.ice,onLand:()=>{for(const e of enemiesInCircle(x,y,24)){owHurt(e,OB.obSkyfall.dmg[lv-1],ctx);a.hitConfirmed=true;}dustPuff(x,y,2,'#e8f2fa',50,6);if(window.svgFx)svgFx('snow_crown',{x,y,z:0,s:.3,ay:.86,layer:'sorted',sortOff:3,life:.5,grow:[.3,1],growT:.1,fadeOut:.55,flip:Math.random()<.5?-1:1});else addFx(new OwPop({x,y,z:2,R:14,col:OWC.ice,life:.25}));for(let k=0;k<3;k++)emit({type:'snow',x,y,z:2,vx:rnd(-60,60),vy:rnd(-30,30),vz:rnd(60,120),g:300,drag:1,life:.5,size:rnd(1,2),color:'#ffffff'});}}));}
        setFxTimer(.55,()=>shake(2));}}],
    update:(a)=>{const k=a.t/(T+.66);player.z=Math.sin(Math.PI*Math.min(1,k))*46;}});}
function mkObVolley(c){const lv=owL('obVolley'),d=player.dir;return act({key:'obVolley',name:'Frost Volley',seq:[...seq('buff',d,0,bPeak(d),2.2),...hold('buff',d,bPeak(d),200)],windup:.18,dur:.4,hitList:[],
  events:[{t:.18,f:a=>{const ctx=owCtx(a,{key:'obVolley'});owSheet({key:'frost_volley',x:player.x,y:player.y,z:30*CHAR_SCALE,s:.62,speed:1});owGust(player.x,player.y,70);
    for(let i=0;i<OB.obVolley.n;i++){const an=i/OB.obVolley.n*TAU,[x,y,z]=owMuzzle(an);addFx(new OwBolt({x,y,z,phi:an,kind:'std',speed:720,range:240,tint:OWC.ice,glow:.6,trailN:6,mult:OB.obVolley.dmg[lv-1],onHit:(e,m,b)=>{owHurt(e,m,ctx);a.hitConfirmed=true;owChill(e,1);owImpact(e,b.phi,{s:.35,n:2});}}));}}}]});}
function mkObShatter(c){const lv=owL('obShatter'),d=player.dir;return act({key:'obShatter',name:'Shatter',seq:[...seq('buff',d,0,bPeak(d),2),...hold('buff',d,bPeak(d),220)],windup:.22,dur:.45,hitList:[],
  events:[{t:.22,f:a=>{const ctx=owCtx(a,{key:'obShatter'});let n=0;owGust(player.x,player.y,90);
    for(const e of enemiesInCircle(player.x,player.y,OB.obShatter.R)){const st=e.owChill||0;if(!st)continue;n++;e.owChill=0;const ex=e.x,ey=e.y;setFxTimer(.05+n*.04,()=>{if(e.dead)return;owHurt(e,OB.obShatter.dmg[lv-1]*st,ctx,{big:st>=3});a.hitConfirmed=true;
      owSheet({key:'shatter',x:ex,y:ey,layer:'sorted',sortOff:6,s:.3+st*.03,speed:1.7,flip:Math.random()<.5});
      shardBurst(ex,ey,20,4+st,150,null,Math.PI,OWC.ice);shake(1+st*.4);});}
    if(!n)msg('ไม่มีศัตรูที่ติดความเย็นในระยะ');}}]});}
function mkObCircle(c){const t=owTgt(c,owRange('obCircle'));if(!t){msg('ต้องมีเป้าหมาย');return null;}const lv=owL('obCircle'),n=OB.obCircle.hits[lv-1],r=clamp(dist(player,t),90,170),a0=Math.atan2(player.y-t.y,player.x-t.x);
  const sweep=1.6,sideOK=s=>{for(let k=1;k<=6;k++){const an=a0+s*sweep*k/6;if(!owFree(t.x+Math.cos(an)*r,t.y+Math.sin(an)*r))return k;}return 7;},side=sideOK(1)>=sideOK(-1)?1:-1,T=.2+n*.2;
  return owShotAction({key:'obCircle',name:'Circling Hunt',phi:angTo(t),aim:.12,shots:n,gap:.2,recover:.15,tint:OWC.ice,
    update:(a,dt)=>{if(a.t>T||t.dead)return;const an=a0+side*sweep*Math.min(1,a.t/T),nx=t.x+Math.cos(an)*r,ny=t.y+Math.sin(an)*r;if(owFree(nx,ny)){player.x=lerp(player.x,nx,Math.min(1,dt*12));player.y=lerp(player.y,ny,Math.min(1,dt*12));}faceTo(angTo(t));
      if(Math.random()<dt*16)dustPuff(player.x,player.y,1,'#eef2f6',30,5);if(Math.random()<dt*10)owFeathers(player.x,player.y,30,1,{spd:30});},
    fire:(a,i,ctx)=>{owFire(a,ctx,{target:t,homing:4,mult:OB.obCircle.dmg,bolt:{kind:'std',tint:OWC.ice,glow:.4},imp:{s:.4}});
      // feathered wind crescent wrapping the hunted target on the owl's side
      if(window.svgFx&&!t.dead){const toOwl=Math.atan2(player.y-t.y,player.x-t.x);svgFx('hunt_arc',{follow:t,z:(t.boss?34:26),s:(t.boss?.62:.48),squash:.62,rot:Math.atan2(Math.sin(toOwl)*K,Math.cos(toOwl))+Math.PI/2,spin:side*.9,life:.42,grow:[.85,1],growT:.1,fadeIn:.06,fadeOut:.6,flip:side});}}});}
function mkObFlash(c){const d=player.dir,R=OB.obFlash.R;return act({key:'obFlash',name:'Feather Flash',seq:[...seq('buff',d,0,3,2.4),...hold('buff',d,3,160)],windup:.18,dur:.36,hitList:[],
  events:[{t:.18,f:a=>{for(let i=0;i<qn(16);i++){const an=rnd(0,TAU),s=rnd(.5,1)*R*1.4;addFx(new OwFeather({x:player.x,y:player.y,z:rnd(18,44),vx:Math.cos(an)*s,vy:Math.sin(an)*s*.6,vz:rnd(5,30),life:rnd(1,1.6),s:rnd(.5,.8)}));}
    owGlow&&owSheet({key:'wings',x:player.x,y:player.y,z:40,s:.5,speed:2.6});
    for(const e of enemiesInCircle(player.x,player.y,R)){e.st.owBlind=Math.max(e.st.owBlind||0,OB.obFlash.dur);e.owBlindN=OB.obFlash.miss;addFx(new DText({x:e.x,y:e.y,z:56,text:'MISS ×'+OB.obFlash.miss,color:'#e8ecf4',size:10,life:.7}));}}}]});}
/* Ultimate B — Blizzard Cage */
function mkObCage(c){const gx=c.gx,gy=c.gy,lv=owL('obCage'),dur=OB.obCage.dur[lv-1]+(owL('ocPerma')?OB.ocPerma.cage:0);return buffAct({key:'obCage',name:'Blizzard Cage',speed:1.6,glow:OWC.ice,phi:Math.atan2(gy-player.y,gx-player.x),
  events:tP=>[{t:.02,f:()=>{for(let i=0;i<qn(18);i++){const an=rnd(0,TAU),r=OB.obCage.R*Math.sqrt(Math.random());emit({type:'snow',x:gx+Math.cos(an)*r,y:gy+Math.sin(an)*r,z:rnd(60,110),vz:-rnd(40,80),drag:.3,life:rnd(.6,1),size:rnd(1,2),color:'#ffffff'});}}},
    {t:tP,f:a=>{if(OW.cage&&OW.cage.alive)OW.cage.life=Math.min(OW.cage.life,OW.cage.t+.2);OW.cage=addFx(new OwCageObj({x:gx,y:gy,R:OB.obCage.R,life:dur}));a.hitConfirmed=true;owFrostBurst(gx,gy,10,1.2);owGust(gx,gy,OB.obCage.R);shake(3);stop(60);
      for(const e of OW.cage.inside)owRemember(e);}}]});}
function mkObRain(c){const cg=OW.cage;if(!cg||!cg.alive){msg('ต้องมี Blizzard Cage อยู่');return null;}if(dist(player,cg)>420){msg('อยู่ห่างกรงเกินไป');return null;}
  const tg=[...cg.inside].filter(e=>!e.dead);return buffAct({key:'obRain',name:'Moonwind Rain',speed:1.8,glow:OWC.moon,phi:Math.atan2(cg.y-player.y,cg.x-player.x),
    events:tP=>[{t:tP,f:a=>{const ctx=owCtx(a,{key:'obRain'});owSnap(player.phi,true,OWC.moon);
      owSheet({key:'moon_rain',x:cg.x,y:cg.y,s:cg.R/110*1.5,speed:1.3,alpha:.9});
      for(let i=0;i<8;i++){const an=rnd(0,TAU),r=cg.R*Math.sqrt(Math.random());addFx(new OwSkyBolt({x:cg.x+Math.cos(an)*r,y:cg.y+Math.sin(an)*r,delay:i*.04,T:.25,tint:OWC.moon}));}
      tg.forEach((e,i)=>addFx(new OwSkyBolt({x:e.x,y:e.y,delay:.08+i*.07,T:.25,tint:OWC.moon,kind:'dead',beam:6,onLand:()=>{if(e.dead)return;owHurt(e,OB.obRain.dmg,ctx,{big:true});a.hitConfirmed=true;owImpact(e,-Math.PI/2,{s:.6,n:5});addFx(new OwPop({x:e.x,y:e.y,R:26,col:OWC.moon,life:.3}));}})));
      setFxTimer(.3,()=>shake(2.5));}}]});}

/* ---------- C actives ---------- */
function mkOcTent(c){const d=player.dir,T=OB.ocTent.T;let tent=null;return act({key:'ocTent',name:'Snow Tent',seq:[...seq('buff',d,0,2,1.6),...hold('buff',d,1,T*1000)],windup:.3,dur:T+.3,hitList:[],
  events:[{t:.25,f:()=>{tent=addFx(new OwTentObj({x:player.x,y:player.y,life:T+.6}));OW.tent={broken:null};dustPuff(player.x,player.y,4,'#eef2f6',40,6);}},
    // warm resting motes, re-spawned so they last the whole rest (stop if the rest is broken)
    ...[.6,2.6,4.6].filter(t=>t<T).map(t=>({t,f:()=>{if(OW.tent&&!OW.tent.broken)owSheet({key:'tent_rest',x:player.x,y:player.y,z:20,s:.5,speed:.9,alpha:.9});}})),
    {t:T+.25,f:()=>{const ok=OW.tent&&!OW.tent.broken;OW.tent=null;if(tent)tent.life=Math.min(tent.life,tent.t+.3);if(!ok){msg('ถูกรบกวน — พักไม่ครบ');return;}
      player.hp=player.maxHp;player.mp=player.maxMp;for(const k in player.cd)if(k!=='ocTent')player.cd[k]=0;dmgNum(player.x,player.y,90,'FULL REST','heal');addFx(new OwPop({x:player.x,y:player.y,z:40,R:40,col:OWC.warm,life:.5}));}}],
  onInterrupt:()=>{OW.tent=null;if(tent)tent.gone=true;}});}
function mkOcMoonfall(c){const tg=enemies.filter(e=>!e.dead&&e.owMark>0&&dist(e,player)<=OB.ocMoonfall.R);if(!tg.length){msg('ไม่มีศัตรูที่ติดมาร์คในระยะ');return null;}
  return buffAct({key:'ocMoonfall',name:'Moonfall',speed:1.6,glow:OWC.moon,events:tP=>[{t:.02,f:()=>{skyDarkT=.35;}},{t:tP,f:a=>{const ctx=owCtx(a,{key:'ocMoonfall'});
    tg.forEach((e,i)=>{const n=e.owMark||1;addFx(new OwSkyBolt({x:e.x,y:e.y,delay:i*.08,T:.3,h:260,tint:OWC.moon,kind:'exec',beam:0,onLand:()=>{owSheet({key:'moon_beam',x:e.x,y:e.y,layer:'sorted',sortOff:3,s:.55,speed:1.4});if(e.dead)return;owTakeMarks(e);owHurt(e,OB.ocMoonfall.dmg+OB.ocMoonfall.per*n,ctx,{big:true});a.hitConfirmed=true;
      owGust(e.x,e.y,40);addFx(new OwPop({x:e.x,y:e.y,R:34,col:OWC.moon,life:.35}));shake(1.6);}}));});
    setFxTimer(.4+tg.length*.08,()=>{skyDarkT=0;});}}],extra:{onInterrupt:()=>{skyDarkT=0;}}});}
function mkOcAvalanche(c){const gx=c.gx,gy=c.gy;return buffAct({key:'ocAvalanche',name:'Avalanche Rain',speed:1.6,glow:OWC.ice,phi:Math.atan2(gy-player.y,gx-player.x),
  events:tP=>[{t:tP,f:a=>{OW.stormN=0;addFx(new OwStorm({x:gx,y:gy,R:OB.ocAvalanche.R,life:OB.ocAvalanche.dur}));a.hitConfirmed=true;mist(gx,gy,20,6,'#eef8ff',40,40);}}]});}
function mkOcHunt(c){return buffAct({key:'ocHunt',name:'Perfect Hunt',speed:1.4,glow:OWC.gold,events:tP=>[
  {t:tP*.6,f:()=>{owFeathers(player.x,player.y,40,6,{spd:-60,spread:60});}},
  {t:tP,f:()=>{addBuff('ocHunt',OB.ocHunt.dur);owSheet({key:'wings',x:player.x,y:player.y,z:44,s:.55,speed:1.6});const [x,y]=P(player.x,player.y,(player.z||0)+56*CHAR_SCALE);addFx(new OwPop({x:player.x,y:player.y,z:(player.z||0)+56*CHAR_SCALE,R:30,col:OWC.gold,life:.5}));addFx(new DText({x:player.x,y:player.y,z:100,text:'PERFECT HUNT',color:OWC.gold,size:15,life:1.1}));
    addFx(new BuffEmitter({buff:'ocHunt',rate:6,emit:()=>{emit({type:'ember',x:player.x+rnd(-10,10),y:player.y+rnd(-4,4),z:(player.z||0)+rnd(30,60),vz:rnd(20,50),drag:2,life:.5,size:rnd(1,1.8),size1:.2,color:Math.random()<.5?OWC.gold:'#ffffff'});}}));}}]});}

/* =====================================================================
   6. HOOKS · AUTO SKILL · INSTALL
   ===================================================================== */
const OW_MAKE={owGuard:mkOwGuard,owHop:mkOwHop,owLantern:mkOwLantern,oaFatal:mkOaFatal,oaPierce:mkOaPierce,oaAim:mkOaAim,oaDeadeye:mkOaDeadeye,oaMark:mkOaMark,oaHeavy:mkOaHeavy,oaDrill:mkOaDrill,oaRico:mkOaRico,oaExec:mkOaExec,
  obFlurry:mkObFlurry,obVeil:mkObVeil,obWhite:mkObWhite,obSnare:mkObSnare,obSkyfall:mkObSkyfall,obVolley:mkObVolley,obShatter:mkObShatter,obCircle:mkObCircle,obFlash:mkObFlash,obCage:mkObCage,obRain:mkObRain,
  ocTent:mkOcTent,ocMoonfall:mkOcMoonfall,ocAvalanche:mkOcAvalanche,ocHunt:mkOcHunt};
const owDef=k=>OW_DEFS.find(d=>d.key===k);

/* Auto Skill: keeps distance, builds marks / chill, spends them */
function owAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);if(!t)return false;
  const d=dist(player,t),los=owLOS(t),near=enemies.filter(e=>!e.dead&&dist(e,player)<300);
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const inRange=k=>{const s=SKILLS[k];return s.type!=='melee'||d<=s.range;};
  const cast=(k,c)=>{player.attackTarget=t;castSkill(k,c||{target:t,phi:angTo(t)});return true;};
  if(d<t.r+50){for(const k of ['owHop','obFlash','obVolley'])if(ready(k))return cast(k);}
  if(!los)return false;
  if(player.hp<player.maxHp*.35&&ready('obWhite'))return cast('obWhite');
  if(ready('ocHunt')&&(t.boss||near.length>=3))return cast('ocHunt');
  if(ready('obCage')&&near.length>=3)return cast('obCage',{gx:t.x,gy:t.y});
  if(OW.cage&&OW.cage.alive&&ready('obRain'))return cast('obRain');
  if(ready('oaExec')&&OW.log.size>=3)return cast('oaExec');
  if(ready('ocMoonfall')&&enemies.filter(e=>!e.dead&&e.owMark>=2).length>=2)return cast('ocMoonfall');
  const chilled=enemiesInCircle(player.x,player.y,OB.obShatter.R).filter(e=>(e.owChill||0)>=2).length;if(ready('obShatter')&&chilled>=2)return cast('obShatter');
  if(ready('ocAvalanche')&&enemiesInCircle(t.x,t.y,100).length>=3)return cast('ocAvalanche',{gx:t.x,gy:t.y});
  if(ready('obSkyfall')&&enemiesInCircle(t.x,t.y,OB.obSkyfall.R).length>=2)return cast('obSkyfall',{gx:t.x,gy:t.y});
  if(ready('oaFatal')&&!hasBuff('oaFatal'))return cast('oaFatal');
  if(ready('oaMark')&&(t.owMark||0)<2&&inRange('oaMark'))return cast('oaMark');
  const line=enemies.filter(e=>!e.dead&&e!==t&&distToSeg(e.x,e.y,player.x,player.y,t.x+(t.x-player.x),t.y+(t.y-player.y))<e.r+10).length;
  const order=[(t.owMark||0)>=2?'oaDeadeye':null,line>=1?'oaPierce':null,'oaRico','obFlurry','oaDrill','oaHeavy','obCircle','oaAim','obSnare','oaPierce'];
  for(const k of order){if(!k||!ready(k)||!inRange(k))continue;return cast(k);}
  return false;}

function installOwl(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  for(const d of OW_DEFS){const b=OB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:owIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').slice(0,40),characterId:'snowy_owl'};
    const mp=b.mp||0,cd=b.cd||0;Object.defineProperty(sk,'mp',{get(){return mp;},enumerable:true,configurable:true});
    Object.defineProperty(sk,'cd',{get(){return cd;},enumerable:true,configurable:true});
    if(b.range){const base=b.range;Object.defineProperty(sk,'range',{get(){return base+(LV.owSight?owLv(OB.owSight.range,'owSight'):0);},enumerable:true,configurable:true});}
    if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(OW_MAKE[d.key])sk.make=OW_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.length?pre.map(([q,l])=>`${OW_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + '):'—';CSK[d.key]=sk;SKILLS[d.key]=sk;}
    else SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':'[New Active] '):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  if(typeof jgBuildReq==='function'&&!jgBuildReq.owZig){const _b=jgBuildReq;jgBuildReq=function(){_b();if(CHAR!=='owl')return;for(const [a,b] of [['oaFatal','oaPierce'],['obFlurry','obSnare']]){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
      B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};jgBuildReq.owZig=1;}
  TABS.length=0;TABS.push({n:'Marksman',keys:['oaFatal','oaPierce','oaAim','oaDeadeye','oaMark','oaHeavy','oaDrill','oaRico','oaExec','owHop']},
    {n:'Trickster',keys:['obFlurry','obVeil','obWhite','obSnare','obSkyfall','obVolley','obShatter','obCircle','obFlash','owGuard']},
    {n:'White Night',keys:['obCage','obRain','ocMoonfall','ocAvalanche','ocHunt','owLantern']});
  Object.assign(BUFFDEF,{owGuard:{n:'Feather Guard',c:'#e8ecf4',i:'GUARD'},oaFatal:{n:'Fatal Bolt',c:OWC.moon,i:'FATAL'},obVeil:{n:'Snow Veil',c:'#f4f8ff',i:'VEIL'},obWhite:{n:'White Out',c:'#ffffff',i:'WHITE'},ocHunt:{n:'Perfect Hunt',c:'#ffe9a8',i:'HUNT'}});
  JOB.name='Frost Owlet';JOB.hpA=1.2;JOB.hpB=5;JOB.spB=3.5;
  ITEMS.nordicCrossbow={n:'Nordic Crossbow',slot:'rhand',two:1,kind:'Bow',atk:150,wlv:3,aspd:152,ref:5,cards:2,w:150,b:{dex:2},size:{small:1,medium:1,large:.75},d:'หน้าไม้ไม้และเหล็กแดนเหนือ'};
  ITEMS.whiteNightBow={n:'White Night Crossbow',slot:'rhand',two:1,kind:'Bow',atk:172,wlv:4,aspd:150,ref:4,cards:1,w:160,b:{dex:3},size:{small:1,medium:1,large:.75},d:'หน้าไม้คืนขาว DEX +3'};
  EQ.rhand='nordicCrossbow';INV.length=0;INV.push('whiteNightBow','vikinghelm','ringPrec','clipLuck');
  Object.assign(PS,{lv:99,str:55,agi:70,vit:40,int:1,dex:95,luk:30});
  // shared-combat hooks
  window.jgHit=(e,o)=>owL('owEye')?owLv(OB.owEye.hit,'owEye'):0;
  window.jgCrit=(e,o)=>{const c=o&&o.owShot;if(!c)return 0;let v=0;if(c.auto&&owL('oaCrit'))v+=owLv(OB.oaCrit.crit,'oaCrit');if(c.veil)v+=c.erase?100:OB.obVeil.crit;if(c.key==='oaDeadeye'&&(e.owMark||0)>0)v+=100;return v;};
  window.jgCritDmg=()=>0;
  window.jgDmgMul=(e,o)=>{const c=o&&o.owShot;if(!c)return 1;let f=0;
    if(c.auto&&owL('ocMastery'))f+=OB.ocMastery.dmg;if(c.auto&&owHunt())f+=OB.ocHunt.atk;if(c.fatal)f+=owLv(OB.oaFatal.dmg,'oaFatal');
    if(c.key==='oaPierce'&&owL('oaDeep'))f+=owLv(OB.oaDeep.atk,'oaDeep');
    if(owL('oaWeak')&&(e.owMark||0)>0)f+=owLv(OB.oaWeak.per,'oaWeak')*e.owMark;
    if(owL('obBrittle')&&(e.owChill||0)>0)f+=OB.obBrittle.per*e.owChill;
    if(owL('oaHyper')){const d=dist(e,player);if(d>OB.oaHyper.far)f+=owLv(OB.oaHyper.max,'oaHyper')*Math.min(1,(d-OB.oaHyper.far)/150);}
    const base=Math.max(1,o&&o.magic?D.mag:D.patk);let m=(base+f)/base;
    if(c.ignoreDef)o._defCut=(o._defCut||0)+c.ignoreDef;return m;};
  window.jgDmgTaken=()=>1;
  window.jgAbsorb=(d,e)=>{if(!hasBuff('owGuard'))return d;return Math.max(1,d-owLv(OB.owGuard.red,'owGuard')-(owL('ocMantle')?OB.ocMantle.red:0));};
  window.jgPreHit=(e)=>{if(owStealth()===2)return 0;if(e.st&&e.st.owBlind>0&&(e.owBlindN||0)>0){e.owBlindN--;addFx(new DText({x:player.x,y:player.y,z:70,text:'MISS',color:'#f4f8ff',size:13,life:.7}));owFeathers(player.x,player.y,30,2,{spd:50});return 0;}
    if(hasBuff('owGuard')){owFeathers(player.x,player.y,34,3,{dir:Math.atan2(e.y-player.y,e.x-player.x),spd:80});addBuff('rhSA',.3);}return 1;};
  window.jgPostHit=()=>{if(OW.tent)OW.tent.broken=true;if(hasBuff('obVeil'))delete player.buffs.obVeil;};
  window.jgMove=()=>1;window.jgRecover=()=>1;window.jgDetect=()=>owStealth()?0:1;
  window.jgPlayerAlpha=()=>OW.tent?0:owStealth()===2?.22:owStealth()===1?.45:1;
  window.jgAspd=()=>1;window.jgBleedMul=()=>1;window.jgSquash=()=>[1,1];window.jgAfterHurt=()=>{};window.jgOnSkillHit=()=>{};
  window.owAutoTick=owAutoTick;
  mkBasic=mkOwBasic;owCore=addFx(new OwCore());owTex();
  // HUD / title name
  try{document.title='Aetherfall — Snowy Owl';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Snowy Owl';if(cl)cl.textContent='Frost Owlet';}catch(e){}
  window.OW=OW;window.OW_DEFS=OW_DEFS;window.OW_BAL=OW_BAL;}

/* ---------- skill icons (code-drawn, one motif per skill) ---------- */
function owIconSpec(d){const col=d.br==='A'?'#e8eef8':d.br==='B'?'#bfe6ff':d.br==='C'?'#ffe9a8':'#f4efe4',bg=d.br==='A'?'#1a2230':d.br==='B'?'#0f2236':d.br==='C'?'#2a2214':'#2a2620';
  const svg=owIconSVG(d,col,bg);if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/owl/'+d.key+'.webp';SKILL_ICON_ART[d.name]=src;   /* painted icon; code SVG as fallback */
    const im=new Image();im.onerror=()=>{SKILL_ICON_ART[d.name]=fb;};im.src=src;}
  return ['star',col,bg];}
function owIconSVG(d,col,bg){const k=d.key,ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const bolt=(x1,y1,x2,y2,w=2.2,c='#a87444')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2} ${y2} l${(x1-x2)*.18-3} ${(y1-y2)*.18+2} l4 -4 z" fill="#dfe6ee" stroke="#2a3240" stroke-width=".8"/><path d="M${x1} ${y1} l-3 4 m3 -4 l4 3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  const feather=(x,y,r=0,s=1)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0 Q8 -14 2 -26 Q-6 -14 0 0Z" fill="#fbf8f2" stroke="#8a8070" stroke-width="1"/><line x1="0" y1="0" x2="2" y2="-25" stroke="#b0a898" stroke-width="1"/></g>`;
  const wing=(x,y,s=1,fl=1)=>`<g transform="translate(${x} ${y}) scale(${s*fl} ${s})">${[0,1,2,3,4].map(i=>`<path d="M0 0 Q${14+i*2} ${-10+i*5} ${24-i*2} ${-2+i*6}" stroke="#fbf8f2" stroke-width="${5-i*.5}" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
  const eye=(cx=22,cy=22,r=9)=>`<path d="M${cx-r*1.4} ${cy} Q${cx} ${cy-r*1.3} ${cx+r*1.4} ${cy} Q${cx} ${cy+r*1.3} ${cx-r*1.4} ${cy}Z" fill="#1a1620" stroke="#fff6dc" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${r*.55}" fill="#ffd34a"/><ellipse cx="${cx}" cy="${cy}" rx="${r*.12}" ry="${r*.5}" fill="#1a1208"/>`;
  const flake=(cx,cy,r,c='#dff4ff')=>[0,60,120].map(a=>`<line x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`).join('');
  const moon=(cx,cy,r,c='#e8eef8')=>`<path d="M${cx+r*.3} ${cy-r} A${r} ${r} 0 1 0 ${cx+r*.9} ${cy+r*.6} A${r*.8} ${r*.8} 0 1 1 ${cx+r*.3} ${cy-r}Z" fill="${c}"/>`;
  const ring=`<circle cx="22" cy="22" r="12" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  const glow=(c)=>`<circle cx="22" cy="22" r="16" fill="${c}" opacity=".18"/>`;
  let g='';
  switch(k){
    case 'owAuto':g=bolt(8,34,36,10)+bolt(8,40,34,20,1.6);break;
    case 'owCharge':g=[-30,-15,0,15,30].map(a=>`<g transform="rotate(${a} 10 34)">${bolt(10,34,38,34,1.4)}</g>`).join('');break;
    case 'owGuard':g=wing(10,24,1.1)+wing(34,24,1.1,-1)+feather(22,38,0,.6);break;
    case 'owSight':g=eye()+'<path d="M2 22 h5 M37 22 h5" stroke="#fff" stroke-width="1.4"/>';break;
    case 'owHop':g=wing(12,28,1)+wing(32,28,1,-1)+'<path d="M22 38 v-10 l-4 4 m4 -4 l4 4" stroke="#fff" stroke-width="1.6" fill="none"/>';break;
    case 'owEye':g=eye(22,20,10)+'<path d="M15 34 l3 -3 l3 3 l-3 3z M21 34 l3 -3 l3 3 l-3 3z M27 34 l3 -3 l3 3 l-3 3z" fill="#ffd34a"/>';break;
    case 'owLantern':g=glow('#ffd8a0')+'<line x1="22" y1="40" x2="22" y2="22" stroke="#6a5038" stroke-width="2"/><path d="M15 12 h14 l-2 12 h-10z" fill="#fff4dc" stroke="#3a3028"/><path d="M13 12 l9 -6 l9 6z" fill="#f6f2ea"/>';break;
    case 'oaFatal':g=glow('#e6eeff')+moon(16,16,9)+bolt(8,36,38,16,2.4,'#c8d4ff');break;
    case 'oaCrit':g=feather(22,38,0,1.1)+'<path d="M30 8 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z" fill="#ffd34a" transform="scale(.8) translate(10 0)"/>';break;
    case 'oaPierce':g=bolt(4,22,40,22,2.4,'#c8d4ff')+'<circle cx="16" cy="22" r="4" fill="none" stroke="#e8eef8"/><circle cx="28" cy="22" r="4" fill="none" stroke="#e8eef8"/>';break;
    case 'oaDeep':g=bolt(2,22,42,22,2,'#c8d4ff')+[10,18,26,34].map(x=>`<circle cx="${x}" cy="22" r="3.2" fill="none" stroke="${col}"/>`).join('');break;
    case 'oaAim':g=ring+'<path d="M22 6 v8 M22 30 v8 M6 22 h8 M30 22 h8" stroke="#e8eef8" stroke-width="1.4"/>';break;
    case 'oaDeadeye':g=`<circle cx="22" cy="22" r="13" fill="#0a0c14" stroke="#ffd36a" stroke-width="1.6"/>`+moon(22,22,8,'#e8eef8')+'<path d="M22 4 v6 M22 34 v6 M4 22 h6 M34 22 h6" stroke="#ffd36a" stroke-width="1.4"/>';break;
    case 'oaMark':g=eye(22,22,10)+'<circle cx="22" cy="22" r="16" fill="none" stroke="#ffd34a" stroke-width="1" stroke-dasharray="3 3"/>';break;
    case 'oaWeak':g=eye(22,20,8)+'<path d="M22 30 v10 M17 35 h10" stroke="#ff7a6a" stroke-width="1.6"/>';break;
    case 'oaHeavy':g=bolt(6,34,36,12,4.2);break;
    case 'oaDrill':g=bolt(6,34,32,14,3)+'<path d="M32 14 l6 -5 M30 12 l5 -6 M34 17 l6 -3" stroke="#ffd36a" stroke-width="1.4"/>';break;
    case 'oaHyper':g=bolt(4,30,40,26,2,'#c8d4ff')+'<path d="M6 14 Q22 8 38 14" stroke="#fff" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>';break;
    case 'oaRico':g='<path d="M6 34 L18 12 L30 30 L40 10" stroke="#e8eef8" stroke-width="1.4" fill="none" stroke-dasharray="3 2"/>'+bolt(30,30,40,10,1.8,'#c8d4ff');break;
    case 'oaExec':g=`<rect x="4" y="4" width="36" height="36" rx="5" fill="#0a0c18"/>`+moon(24,18,11)+bolt(4,40,40,26,2.4,'#c8d4ff');break;
    case 'oaLast':g=moon(22,20,12,'#ffe9a8')+'<path d="M8 38 h28" stroke="#ff9a7a" stroke-width="2"/>';break;
    case 'obFlurry':g=bolt(6,26,36,14,1.6,'#7fd0ff')+bolt(6,32,38,24,1.6,'#7fd0ff')+bolt(6,38,36,34,1.6,'#7fd0ff');break;
    case 'obVeil':g=glow('#ffffff')+flake(14,14,4)+flake(30,20,5)+flake(18,32,4)+feather(30,40,20,.6);break;
    case 'obWhite':g=`<rect x="4" y="4" width="36" height="36" rx="5" fill="#eef6ff" opacity=".85"/>`+flake(22,22,9,'#7fb0d8');break;
    case 'obSnare':g=`<circle cx="22" cy="24" r="12" fill="none" stroke="#bfe8ff" stroke-width="2"/>`+[0,60,120,180,240,300].map(a=>`<path d="M22 12 l-2 6 h4z" fill="#eaf8ff" transform="rotate(${a} 22 24)"/>`).join('')+flake(22,24,4);break;
    case 'obSkyfall':g=[10,18,26,34].map((x,i)=>bolt(x,4+i*2,x,22+i*3,1.4,'#7fd0ff')).join('')+'<ellipse cx="22" cy="36" rx="14" ry="4" fill="none" stroke="#fff" stroke-width="1.2"/>';break;
    case 'obFrost':g=flake(22,22,12)+`<circle cx="22" cy="22" r="3" fill="#ffffff"/>`;break;
    case 'obDeep':g=flake(16,18,7)+flake(28,28,7)+flake(30,12,4);break;
    case 'obBrittle':g=flake(22,22,11)+'<path d="M12 10 L22 22 L18 30 L28 38" stroke="#ff9a8a" stroke-width="1.4" fill="none"/>';break;
    case 'obVolley':g=[0,45,90,135,180,225,270,315].map(a=>`<line x1="22" y1="22" x2="38" y2="22" stroke="#7fd0ff" stroke-width="1.6" transform="rotate(${a} 22 22)"/>`).join('')+'<circle cx="22" cy="22" r="4" fill="#fff"/>';break;
    case 'obShatter':g=[0,60,120,180,240,300].map(a=>`<path d="M22 22 l3 -14 l-6 0z" fill="#dff4ff" stroke="#5a9ac8" stroke-width=".8" transform="rotate(${a} 22 22)"/>`).join('');break;
    case 'obCircle':g=`<circle cx="22" cy="22" r="13" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="5 3"/>`+bolt(8,12,20,20,1.6,'#7fd0ff')+bolt(36,32,24,24,1.6,'#7fd0ff');break;
    case 'obFlash':g=feather(12,34,-35,.8)+feather(22,34,0,.8)+feather(32,34,35,.8)+'<circle cx="22" cy="14" r="5" fill="#fff" opacity=".8"/>';break;
    case 'obCage':g=[0,1,2,3,4,5].map(i=>`<path d="M${8+i*5.6} 36 l2.8 -${16+(i%2)*6} l2.8 ${16+(i%2)*6}z" fill="#dff4ff" stroke="#5a9ac8" stroke-width=".8"/>`).join('')+flake(22,12,5);break;
    case 'obRain':g=moon(30,10,7)+[10,18,26,34].map((x,i)=>bolt(x,10+i,x-4,30+i,1.4,'#c8d4ff')).join('');break;
    case 'ocMastery':g=bolt(8,34,36,10,2.6)+'<circle cx="34" cy="12" r="5" fill="none" stroke="#ffe9a8" stroke-width="1.4"/>';break;
    case 'ocExtra':g=moon(14,14,7)+[0,1,2,3,4].map(i=>`<circle cx="${10+i*6}" cy="34" r="2.4" fill="#e6eeff"/>`).join('');break;
    case 'ocDouble':g=bolt(4,22,36,10,1.4,'#7fd0ff')+bolt(4,30,38,22,1.4,'#7fd0ff')+bolt(4,38,36,34,1.4,'#7fd0ff')+'<text x="30" y="40" font-size="10" fill="#ffe9a8" font-weight="bold">×2</text>';break;
    case 'ocRevSkill':g='<text x="22" y="28" text-anchor="middle" font-size="13" fill="#bfe6ff" font-weight="bold">SP</text><path d="M8 34 h28" stroke="#ffe9a8" stroke-width="2"/>';break;
    case 'ocMantle':g=wing(8,22,1.1)+wing(36,22,1.1,-1)+'<circle cx="22" cy="22" r="6" fill="#ffe9a8" opacity=".8"/>';break;
    case 'ocBull':g='<circle cx="22" cy="22" r="13" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="22" cy="22" r="7" fill="none" stroke="#ff7a6a" stroke-width="1.6"/><circle cx="22" cy="22" r="2.4" fill="#ffd34a"/>';break;
    case 'ocErase':g=glow('#ffffff')+feather(22,38,0,1)+'<path d="M8 10 l28 24" stroke="#bfe6ff" stroke-width="1" opacity=".7"/>';break;
    case 'ocRevArt':g='<circle cx="22" cy="22" r="13" fill="none" stroke="#bfe6ff" stroke-width="2"/><path d="M22 22 v-9 M22 22 l7 4" stroke="#ffe9a8" stroke-width="2"/>';break;
    case 'ocFan':g=[-30,-15,0,15,30].map(a=>`<g transform="rotate(${a} 8 30)">${feather(30,30,90,.55)}</g>`).join('')+eye(34,10,4);break;
    case 'ocTwin':g=eye(14,20,6)+eye(30,26,6);break;
    case 'ocPerma':g=flake(22,22,13,'#9fd8ff')+'<text x="22" y="42" text-anchor="middle" font-size="8" fill="#ffe9a8">6</text>';break;
    case 'ocTent':g='<path d="M6 36 L22 10 L38 36Z" fill="#e8e2d4" stroke="#4a4034" stroke-width="1.4"/><path d="M18 36 L22 26 L26 36Z" fill="#3a3a4a"/><text x="32" y="14" font-size="8" fill="#fff">z</text>';break;
    case 'ocNight':g=eye(22,18,9)+bolt(6,38,30,30,1.4,'#ffd34a');break;
    case 'ocMoonfall':g=moon(22,10,8)+'<rect x="18" y="16" width="8" height="22" fill="#e6eeff" opacity=".5"/><ellipse cx="22" cy="38" rx="10" ry="3" fill="none" stroke="#fff"/>';break;
    case 'ocAvalanche':g='<circle cx="22" cy="24" r="14" fill="#dff0ff" opacity=".25"/>'+flake(14,18,4)+flake(28,14,4)+flake(22,30,5)+flake(32,30,3);break;
    case 'ocHunt':g=eye(22,22,9)+wing(4,24,.9)+wing(40,24,.9,-1);break;
    default:g=bolt(8,34,36,10);}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="6" fill="${bg}"/>${g}${ult}</svg>`;}
