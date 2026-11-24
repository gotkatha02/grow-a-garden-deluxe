/* =====================================================================
   TOTEM LEGEND — ODIN'S RAVEN (Norse) — 12 Tails style
   Character module. Loaded only when the raven is played (?char=raven); index.html calls installRaven().
   Design + numbers: RAVEN_SKILLS_TH.md · concept: NEW_HERO_CONCEPTS_TH.md (owner 2026-11-22: concept approved 22:57, 'ทำสกิลทั้งหมดของอีกา แบบพร้อมเล่น' 23:11)

     Basic · Wanderer Fledgling — rune spear thrusts (mid range), Muninn's Echo, Feather Cloak, Raven Dive, Nine Nights, Mimir's Well, Odin's Eye
     A · Muninn, Keeper of Memory (physical, ATK) — MEMORY 0–3: every A skill that lands is written into Muninn's memory,
         Muninn's Recall replays every memory at once (save them for a boss's open window). Shadow Echo: Muninn repeats A hits one beat late.
     B · Huginn, Thought of Odin (magic, MATK) — Huginn is a second cast point: send him anywhere (Huginn's Flight), every
         spell also comes out of him. RUNES 0–3: every 3rd B hit carves a rune round Huginn; Rune Scribe = 3 runes burst by themselves.
     C · Herald of the Allfather — 12 nodes, each tied to the Basic / A / B skill of the same row (gems on the totem)

   Two-way hero: A = ATK, B = MATK, Basic branch = the higher, normal attack = ATK.
   Owner's rules: no percent effects (flat numbers, counters instead of chances).
   The two doubles are drawn from the hero's own sprite: Muninn replays the hero's frames 0.3 s late (violet shadow, on the ground),
   Huginn is a frost-blue light copy that floats. Sprite: the wolf's stands in (dark tint) until the raven's own clips exist.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const RV_BAL={
  mem:{cap:3,deep:4,life:20},          // memory slots (Deep Memory = 4), a memory fades after 20 s
  rune:{every:3,perCast:2,cap:3,life:20},   // every 3rd B hit carves a rune (a cast counts at most twice), 3 max, they fade 20 s after the last carve
  echo:{delay:.3},                      // Muninn is one beat late
  hug:{perch:10,home:[30,-24],fly:.35}, // Huginn perches 10 s; at home he floats behind the right shoulder
  sk:{
    // ---- Basic
    vnSpear:{chain:[2,3,3,4],hit:1.0},
    vnEcho:{dmg:[.3,.45,.6]},
    vnCloak:{T:4,block:[15,25,35],cd:16,mp:12},
    vnDive:{dist:[180,210,240],dmg:1.5,R:95,cd:9,mp:12,range:240},
    vnNights:{T:6,hp:[1.0,1.5],cd:24,mp:10},
    vnMimir:{sp:[.5,1,1.5,2]},
    vnEye:{R:180,T:8,flat:[15,25,35],cd:20,mp:14},
    // ---- A · Muninn
    vaThrust:{dmg:[.8,.95,1.1,1.25],n:2,cd:5,mp:8,range:110},
    vaShadow:{dmg:[.4,.6,.8],max:3},
    vaRecall:{dmg:[.5,.8],gap:.12,cd:12,mp:14,range:220},
    vaVivid:{dmg:[1.2,1.8],R:120},
    vaSweep:{dmg:[1.3,1.7],R:150,cd:8,mp:14,range:110},
    vaWing:{slow:[1.5,2.5],push:60},
    vaSwap:{dmg:[1.4,1.8],mun:[.6,.8],cd:10,mp:14,range:260},
    vaPincer:{},
    vaGungnir:{dmg:[1.8,2.4],len:340,cd:11,mp:16,range:340},
    vaReturn:{dmg:[.8,1.1]},
    vaWar:{atk:[8,14,20]},
    vaParry:{T:1,dmg:2.4,cd:14,mp:12},
    vaValhalla:{n:14,R:260,sp:70,dmg:[.72,1.0],fin:2.5,cd:60,mp:50},
    vaEternal:{m:1.6},
    // ---- B · Huginn
    vbBolt:{dmg:[1.2,1.4,1.6,1.8],copy:[.5,.6,.7,.8],cd:4,mp:10,range:360},
    vbScribe:{dmg:[1.2,1.6,2.0],R:110},
    vbFlight:{dmg:[1.0,1.4],R:120,cd:8,mp:12,range:360},
    vbPerch:{dmg:[.35,.5],R:220},
    vbCircle:{dmg:[1.8,2.4],copy:[.8,1.0],R:120,delay:.6,cd:9,mp:14,range:320},
    vbBind:{root:[1,1.5]},
    vbStorm:{dmg:[.5,.7],R:155,T:4,tick:.5,cd:16,mp:20},
    vbGale:{scale:1.4,slow:1},
    vbTether:{dmg:[.4,.55],T:3,tick:.3,w:24,cd:14,mp:18},
    vbSnap:{dmg:2.0},
    vbMind:{matk:[8,14,20]},
    vbWard:{n:2,cd:18,mp:14},
    vbRunes:{n:9,R:280,sp:75,dmg:[1.6,2.2],gap:.16,cd:60,mp:50},
    vbFinal:{dmg:3.0,R:140},
    // ---- C · Herald of the Allfather
    vxSpear:{dmg:1.8,len:150},
    vxDeep:{},
    vxTwin:{},
    vxMirror:{dmg:.8},
    vxHaunt:{T:4,dmg:.5,n:10,cd:20,mp:20,range:220},
    vxSwift:{cdr:3},
    vxYgg:{T:12,hp:1,flat:30,cd:40,mp:20},
    vxPincer:{T:3,dmg:.4},
    vxMaelstrom:{pull:14,T:1},
    vxAllfather:{T:15,R:300,echo:.3,cd:90,mp:40},
    vxGungnir:{dmg:5.0,per:1.0,splash:1.5,R:90,cd:50,mp:40,range:420},
    vxHavamal:{dmg:4.5,per:.8,R:160,cd:50,mp:40,range:400}
  }
};
const RB=RV_BAL.sk;
const vX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const vM=n=>'MATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const RV_DEFS=[
 // ---------------- BASIC · WANDERER FLEDGLING ----------------
 {key:'vnSpear',id:'RV-B01',name:'Rune Spear',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) แทงหอกรูนต่อเนื่อง ระยะกลาง',lv:i=>[`ต่อ ${RB.vnSpear.chain[i-1]} จังหวะ`]},
 {key:'vnEcho',id:'RV-B02',name:"Muninn's Echo",br:'basic',row:1,max:3,passive:1,d:'(Passive) มูนิน ร่างเงา แทงซ้ำตามตีปกติของเราช้ากว่า 1 จังหวะ',lv:i=>[`แทงซ้ำ ${vX(RB.vnEcho.dmg[i-1])} ทุกครั้งที่ตีปกติโดน`]},
 {key:'vnCloak',id:'RV-B03',name:'Feather Cloak',br:'basic',row:2,max:3,type:'self',d:'ร่างแตกเป็นขนนกดำ ดาเมจที่ได้รับลดลง ไม่ติดชะงัก',lv:i=>[`ดาเมจที่ได้รับ −${RB.vnCloak.block[i-1]} ต่อครั้ง นาน ${RB.vnCloak.T} วิ`,`Cooldown ${RB.vnCloak.cd} วิ`]},
 {key:'vnDive',id:'RV-B04',name:'Raven Dive',br:'basic',row:2,max:3,type:'melee',d:'บินขึ้นแล้วโฉบลงใส่เป้า ศัตรูรอบจุดตกชะงัก',lv:i=>[`ระยะ ${RB.vnDive.dist[i-1]}`,`${vX(RB.vnDive.dmg)} รัศมี ${RB.vnDive.R}`,`Cooldown ${RB.vnDive.cd} วิ`]},
 {key:'vnNights',id:'RV-B05',name:'Nine Nights',br:'basic',row:3,max:2,type:'self',d:'ภาวนาแบบโอดินที่แขวนบนต้นอิกดราซิล 9 คืน ฟื้น HP ต่อเนื่อง ล้างสถานะช้า',lv:i=>[`ฟื้น HP = เลเวล × ${RB.vnNights.hp[i-1]} ทุกวิ นาน ${RB.vnNights.T} วิ`,`Cooldown ${RB.vnNights.cd} วิ`]},
 {key:'vnMimir',id:'RV-B06',name:"Mimir's Well",br:'basic',row:3,max:4,passive:1,d:'(Passive) ดื่มน้ำบ่อแห่งปัญญาของมีเมียร์ Max SP เพิ่ม',lv:i=>[`Max SP + เลเวล × ${RB.vnMimir.sp[i-1]}`]},
 {key:'vnEye',id:'RV-B07',name:"Odin's Eye",br:'basic',row:4,max:3,type:'self',d:'ดวงตาเดียวของโอดินจ้องศัตรูรอบตัว ศัตรูที่ถูกจ้องโดนเราตีแรงขึ้นทุกครั้ง',lv:i=>[`ศัตรูรอบตัว ${RB.vnEye.R} โดนเราตี ATK / MATK +${RB.vnEye.flat[i-1]} นาน ${RB.vnEye.T} วิ`,`Cooldown ${RB.vnEye.cd} วิ`]},
 // ---------------- A · MUNINN, KEEPER OF MEMORY ----------------
 {key:'vaThrust',id:'RV-A01',name:'Memory Thrust',br:'A',row:1,max:4,type:'melee',d:"แทงหอกเร็ว 2 ครั้ง ท่าที่โดนถูกจดลงความทรงจำของมูนิน (อัปสลับเลเวลกับ Muninn's Recall)",lv:i=>[`${vX(RB.vaThrust.dmg[i-1])} × ${RB.vaThrust.n}`,`Cooldown ${RB.vaThrust.cd} วิ`]},
 {key:'vaShadow',id:'RV-A02',name:'Shadow Echo',br:'A',row:2,max:3,passive:1,d:'(Passive) ทุกสกิลสาย A มูนินตีซ้ำเป้าที่โดนช้ากว่า 1 จังหวะ (สูงสุด 3 ตัวต่อครั้ง)',lv:i=>[`ตีซ้ำ ${vX(RB.vaShadow.dmg[i-1])}`]},
 {key:'vaRecall',id:'RV-A03',name:"Muninn's Recall",br:'A',row:3,max:2,type:'melee',pre:[['vaThrust',1]],d:'มูนินเล่นซ้ำทุกท่าในความทรงจำใส่เป้ารวดเดียว แล้วล้างความทรงจำ — เก็บไว้ทุ่มตอนบอสเปิดช่อง',lv:i=>[`แต่ละความทรงจำ = แรงเท่าท่าเดิม + ${vX(RB.vaRecall.dmg[i-1])}`,'ต้องมีความทรงจำอย่างน้อย 1',`Cooldown ${RB.vaRecall.cd} วิ`]},
 {key:'vaVivid',id:'RV-A04',name:'Vivid Memory',br:'A',row:3,max:2,passive:1,enh:'vaRecall',pre:[['vaRecall',1]],d:"(ต่อยอด Muninn's Recall) ถ้าความทรงจำเต็มตอนปลด จบด้วยระเบิดขนนกดำรอบเป้า",lv:i=>[`${vX(RB.vaVivid.dmg[i-1])} รัศมี ${RB.vaVivid.R}`]},
 {key:'vaSweep',id:'RV-A05',name:'Twin Crescent',br:'A',row:4,max:2,type:'melee',d:'เรากวาดหอกด้านหน้า มูนินกวาดด้านหลังพร้อมกัน โดนรอบตัว จดลงความทรงจำ',lv:i=>[`${vX(RB.vaSweep.dmg[i-1])} รัศมี ${RB.vaSweep.R}`,`Cooldown ${RB.vaSweep.cd} วิ`]},
 {key:'vaWing',id:'RV-A06',name:'Wingbeat',br:'A',row:4,max:2,passive:1,enh:'vaSweep',pre:[['vaSweep',1]],d:'(ต่อยอด Twin Crescent) ลมปีกผลักศัตรูออกและช้าลง',lv:i=>[`ผลัก ${RB.vaWing.push} · ช้าลง ${RB.vaWing.slow[i-1]} วิ`]},
 {key:'vaSwap',id:'RV-A07',name:'Shadow Swap',br:'A',row:5,max:2,type:'melee',d:'มูนินโผล่หลังเป้า เราสลับตัวไปแทนแล้วแทงประกบสองด้าน (หลบได้ระหว่างสลับ) จดลงความทรงจำ',lv:i=>[`เรา ${vX(RB.vaSwap.dmg[i-1])} + มูนิน ${vX(RB.vaSwap.mun[i-1])}`,`Cooldown ${RB.vaSwap.cd} วิ`]},
 {key:'vaPincer',id:'RV-A08',name:'Twin Memory',br:'A',row:5,max:1,passive:1,enh:'vaSwap',pre:[['vaSwap',1]],d:'(ต่อยอด Shadow Swap) จดลงความทรงจำ 2 ช่อง',lv:()=>['ความทรงจำ +2 ต่อครั้ง']},
 {key:'vaGungnir',id:'RV-A09',name:'Gungnir Throw',br:'A',row:6,max:2,type:'melee',d:'ขว้างหอกเป็นแนวตรง ทะลุทุกตัว จดลงความทรงจำ',lv:i=>[`${vX(RB.vaGungnir.dmg[i-1])} ไกล ${RB.vaGungnir.len}`,`Cooldown ${RB.vaGungnir.cd} วิ`]},
 {key:'vaReturn',id:'RV-A10',name:'Returning Spear',br:'A',row:6,max:2,passive:1,enh:'vaGungnir',pre:[['vaGungnir',1]],d:'(ต่อยอด Gungnir Throw) มูนินรับหอกที่ปลายแนวแล้วขว้างกลับ โดนซ้ำทั้งแนว',lv:i=>[`${vX(RB.vaReturn.dmg[i-1])}`]},
 {key:'vaWar',id:'RV-A11',name:'Raven of War',br:'A',row:7,max:3,passive:1,d:'(Passive) ทุกความทรงจำที่ถืออยู่ ATK เพิ่ม',lv:i=>[`ATK +${RB.vaWar.atk[i-1]} ต่อความทรงจำ`]},
 {key:'vaParry',id:'RV-A12',name:'Wing Parry',br:'A',row:7,max:1,type:'self',d:'ตั้งปีกรับ 1 วิ ถ้าโดนตีประชิด ปัดแล้วแทงสวน และจดท่าสวนลงความทรงจำ',lv:()=>[`สวน ${vX(RB.vaParry.dmg)}`,`Cooldown ${RB.vaParry.cd} วิ`]},
 {key:'vaValhalla',id:'RV-A13',name:'Memories of Valhalla',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · มูนินปลุกความทรงจำของเหล่าวีรชนแห่งวัลฮัลลา หอกวิญญาณแทงรัว 14 ครั้งรอบตัววงกว้าง (แต่ละครั้งกระแทกรอบเป้าด้วย) จบด้วยมูนินแทงใหญ่กลางวง',lv:i=>[`${vX(RB.vaValhalla.dmg[i-1])} × ${RB.vaValhalla.n} รัศมี ${RB.vaValhalla.R}`,`แทงสุดท้าย ${vX(RB.vaValhalla.fin)}`,`Cooldown ${RB.vaValhalla.cd} วิ`]},
 {key:'vaEternal',id:'RV-A14',name:'Eternal Memory',br:'A',row:8,max:1,passive:1,enh:'vaValhalla',pre:[['vaValhalla',1]],d:'(ต่อยอด Memories of Valhalla) จบอัลติ ความทรงจำเต็มทุกช่องด้วยท่าวัลฮัลลา',lv:()=>[`ความทรงจำละ ${vX(RB.vaEternal.m)}`]},
 // ---------------- B · HUGINN, THOUGHT OF ODIN ----------------
 {key:'vbBolt',id:'RV-G01',name:'Rune Bolt',br:'B',row:1,max:4,type:'melee',d:"ยิงกระสุนรูนติดตามเป้า ฮูกินยิงอีกลูกใส่ตัวที่ใกล้เขาที่สุด (อัปสลับเลเวลกับ Huginn's Flight)",lv:i=>[`เรา ${vM(RB.vbBolt.dmg[i-1])} · ฮูกิน ${vM(RB.vbBolt.copy[i-1])}`,`Cooldown ${RB.vbBolt.cd} วิ`]},
 {key:'vbScribe',id:'RV-G02',name:'Rune Scribe',br:'B',row:2,max:3,passive:1,d:'(Passive · ออโต้สเปล) รูนรอบฮูกินครบ 3 ตัว ระเบิดรูนเองที่จุดของฮูกิน (ทุกการโจมตีสาย B ครั้งที่ 3 สลักรูน 1 ตัว)',lv:i=>[`ระเบิดรูน ${vM(RB.vbScribe.dmg[i-1])} รัศมี ${RB.vbScribe.R}`]},
 {key:'vbFlight',id:'RV-G03',name:"Huginn's Flight",br:'B',row:3,max:2,type:'ground',radius:()=>RB.vbFlight.R,pre:[['vbBolt',1]],d:'ส่งฮูกินบินไปเกาะจุดที่เลือก ตีศัตรูที่จุดนั้น แล้วเป็นจุดร่ายที่สอง',lv:i=>[`${vM(RB.vbFlight.dmg[i-1])} รัศมี ${RB.vbFlight.R}`,`เกาะ ${RV_BAL.hug.perch} วิ`,`Cooldown ${RB.vbFlight.cd} วิ`]},
 {key:'vbPerch',id:'RV-G04',name:'Watchful Perch',br:'B',row:3,max:2,passive:1,enh:'vbFlight',pre:[['vbFlight',1]],d:"(ต่อยอด Huginn's Flight) ระหว่างเกาะ ฮูกินยิงศัตรูที่ใกล้ที่สุดทุก 1 วิ (นับเป็นการโจมตีสาย B)",lv:i=>[`${vM(RB.vbPerch.dmg[i-1])} ระยะ ${RB.vbPerch.R}`]},
 {key:'vbCircle',id:'RV-G05',name:'Rune Circle',br:'B',row:4,max:2,type:'ground',radius:()=>RB.vbCircle.R,d:'วาดวงรูนที่จุดที่เลือก ระเบิดหลัง 0.6 วิ ฮูกินวาดอีกวงใต้ตัวที่ใกล้เขาที่สุด',lv:i=>[`${vM(RB.vbCircle.dmg[i-1])} · ฮูกิน ${vM(RB.vbCircle.copy[i-1])} รัศมี ${RB.vbCircle.R}`,`Cooldown ${RB.vbCircle.cd} วิ`]},
 {key:'vbBind',id:'RV-G06',name:'Binding Rune',br:'B',row:4,max:2,passive:1,enh:'vbCircle',pre:[['vbCircle',1]],d:'(ต่อยอด Rune Circle) ศัตรูที่โดนถูกตรึงอยู่กับที่ (บอสช้าลงแทน)',lv:i=>[`ตรึง ${RB.vbBind.root[i-1]} วิ`]},
 {key:'vbStorm',id:'RV-G07',name:'Thought Storm',br:'B',row:5,max:2,type:'self',d:'ฮูกินหมุนตัว ฝนรูนน้ำแข็งตกรอบตัวเขา 4 วิ',lv:i=>[`${vM(RB.vbStorm.dmg[i-1])} ทุก ${RB.vbStorm.tick} วิ รัศมี ${RB.vbStorm.R}`,`Cooldown ${RB.vbStorm.cd} วิ`]},
 {key:'vbGale',id:'RV-G08',name:'Frost Thought',br:'B',row:5,max:1,passive:1,enh:'vbStorm',pre:[['vbStorm',1]],d:'(ต่อยอด Thought Storm) พายุใหญ่ขึ้น ศัตรูในพายุช้าลง',lv:()=>[`รัศมี ×${RB.vbGale.scale} · สโลว์`]},
 {key:'vbTether',id:'RV-G09',name:'Rune Tether',br:'B',row:6,max:2,type:'self',d:'สายรูนเชื่อมเรากับฮูกิน 3 วิ ศัตรูที่แตะสายโดนรัว (ถ้าฮูกินอยู่ข้างตัว เขาบินออกไปข้างหน้าก่อน)',lv:i=>[`${vM(RB.vbTether.dmg[i-1])} ทุก ${RB.vbTether.tick} วิ`,`Cooldown ${RB.vbTether.cd} วิ`]},
 {key:'vbSnap',id:'RV-G10',name:'Snapping Thread',br:'B',row:6,max:1,passive:1,enh:'vbTether',pre:[['vbTether',1]],d:'(ต่อยอด Rune Tether) จบแล้วสายขาด ระเบิดทั้งแนว',lv:()=>[`${vM(RB.vbSnap.dmg)}`]},
 {key:'vbMind',id:'RV-G11',name:'Mind of the Allfather',br:'B',row:7,max:3,passive:1,d:'(Passive) ทุกรูนที่สลักรอบฮูกิน MATK เพิ่ม',lv:i=>[`MATK +${RB.vbMind.matk[i-1]} ต่อรูน`]},
 {key:'vbWard',id:'RV-G12',name:'Algiz Ward',br:'B',row:7,max:1,type:'self',d:'รูนอัลกิซกันการโจมตี 2 ครั้ง กันได้แต่ละครั้งสลักรูน 1 ตัว',lv:()=>[`กัน ${RB.vbWard.n} ครั้ง`,`Cooldown ${RB.vbWard.cd} วิ`]},
 {key:'vbRunes',id:'RV-G13',name:'Runes of the Allfather',br:'B',row:8,max:2,type:'self',ult:1,d:'ULTIMATE B · ฮูกินบินขึ้นฟ้าเขียนรูน 9 ตัวเป็นวงรอบตัว ระเบิดทีละตัวใส่ศัตรูที่ใกล้รูนนั้นที่สุด',lv:i=>[`${vM(RB.vbRunes.dmg[i-1])} × ${RB.vbRunes.n} รัศมี ${RB.vbRunes.R}`,`Cooldown ${RB.vbRunes.cd} วิ`]},
 {key:'vbFinal',id:'RV-G14',name:'The Eighteenth Rune',br:'B',row:8,max:1,passive:1,enh:'vbRunes',pre:[['vbRunes',1]],d:'(ต่อยอด Runes of the Allfather) จบอัลติด้วยรูนยักษ์ที่จุดของฮูกิน แล้วรูนรอบฮูกินเต็ม 3',lv:()=>[`${vM(RB.vbFinal.dmg)} รัศมี ${RB.vbFinal.R}`]},
 // ---------------- C · HERALD OF THE ALLFATHER (12 nodes, same row) ----------------
 {key:'vxSpear',id:'RV-C01',name:'Gungnir Combo',br:'C',col:'basic',tier:1,passive:1,pre:[['vnSpear',4]],d:'ตีปกติต่อได้อีก 1 จังหวะ จังหวะสุดท้ายแทงทะลุเป็นแนว',lv:()=>[`${vX(RB.vxSpear.dmg)} แนว ${RB.vxSpear.len}`]},
 {key:'vxDeep',id:'RV-C02',name:'Deep Memory',br:'C',col:'A',tier:1,passive:1,pre:[['vaThrust',4]],d:'ความทรงจำของมูนินจุได้ 4 ช่อง',lv:()=>['ความทรงจำ 4 ช่อง']},
 {key:'vxTwin',id:'RV-C03',name:'Twin Thought',br:'C',col:'B',tier:1,passive:1,pre:[['vbBolt',4]],d:'Rune Bolt ฮูกินยิง 2 ลูก',lv:()=>['ฮูกินยิง 2 ลูก']},
 {key:'vxMirror',id:'RV-C04',name:'Mirror Feathers',br:'C',col:'basic',tier:2,passive:1,pre:[['vnCloak',3]],d:'ระหว่าง Feather Cloak มูนินแทงสวนศัตรูที่ตีเราประชิด',lv:()=>[`${vX(RB.vxMirror.dmg)} ต่อครั้ง`]},
 {key:'vxHaunt',id:'RV-C05',name:'Haunting Memory',br:'C',col:'A',tier:2,type:'melee',pre:[['vaRecall',2]],d:'[New Active] มูนินสิงเป้า 4 วิ ทุกครั้งที่เราตีเป้านั้นโดน มูนินตีซ้ำ',lv:()=>[`ตีซ้ำ ${vX(RB.vxHaunt.dmg)} สูงสุด ${RB.vxHaunt.n} ครั้ง`,`Cooldown ${RB.vxHaunt.cd} วิ`]},
 {key:'vxSwift',id:'RV-C06',name:'Swift Thought',br:'C',col:'B',tier:2,passive:1,pre:[['vbFlight',2]],d:"Huginn's Flight คูลดาวน์ลดลง ฮูกินลงจอดแล้วสลักรูน 1 ตัว",lv:()=>[`Cooldown −${RB.vxSwift.cdr} วิ · รูน +1`]},
 {key:'vxYgg',id:'RV-C07',name:'Yggdrasil Vigil',br:'C',col:'basic',tier:3,type:'self',pre:[['vnNights',2]],d:'[New Active] พลังต้นไม้โลกอิกดราซิล ฟื้น HP ต่อเนื่อง ATK และ MATK เพิ่ม',lv:()=>[`ฟื้น HP = เลเวล × ${RB.vxYgg.hp} ทุกวิ`,`ATK / MATK +${RB.vxYgg.flat} นาน ${RB.vxYgg.T} วิ`,`Cooldown ${RB.vxYgg.cd} วิ`]},
 {key:'vxPincer',id:'RV-C08',name:'Endless Pincer',br:'C',col:'A',tier:3,passive:1,pre:[['vaSwap',2]],d:'หลัง Shadow Swap มูนินยืนหลังเป้าต่อ 3 วิ ตีซ้ำทุกครั้งที่เราตีเป้านั้นโดน',lv:()=>[`ตีซ้ำ ${vX(RB.vxPincer.dmg)}`]},
 {key:'vxMaelstrom',id:'RV-C09',name:'Thought Maelstrom',br:'C',col:'B',tier:3,passive:1,pre:[['vbStorm',2]],d:'Thought Storm ดูดศัตรูเข้าหาฮูกิน และนานขึ้น 1 วิ',lv:()=>['ดูดเข้าหาฮูกิน · +1 วิ']},
 {key:'vxAllfather',id:'RV-C10',name:"Allfather's Gaze",br:'C',col:'basic',tier:4,type:'self',pre:[['vnEye',3]],d:'[New Active] Signature · 15 วิ ดวงตาโอดินจ้องทุกตัวรอบตัว ความทรงจำและรูนได้ 2 เท่า มูนินตีซ้ำแรงขึ้น',lv:()=>[`ตีซ้ำ +${vX(RB.vxAllfather.echo)}`,'ความทรงจำ / รูน ×2',`Cooldown ${RB.vxAllfather.cd} วิ`]},
 {key:'vxGungnir',id:'RV-C11',name:'Gungnir, Spear of Odin',br:'C',col:'A',tier:4,type:'melee',pre:[['vaValhalla',1]],d:'[New Active] ขว้างหอกกุงนีร์ของโอดินใส่เป้าเดียว ไม่มีวันพลาด ใช้ความทรงจำทั้งหมด',lv:()=>[`${vX(RB.vxGungnir.dmg)} + ${vX(RB.vxGungnir.per)} ต่อความทรงจำ`,`Cooldown ${RB.vxGungnir.cd} วิ`]},
 {key:'vxHavamal',id:'RV-C12',name:'Havamal Verse',br:'C',col:'B',tier:4,type:'self',pre:[['vbRunes',1]],d:'[New Active] ฮูกินร่ายบทกวีรูนฮาวามาลของโอดิน รูนยักษ์ตกที่จุดของฮูกิน (ถ้าฮูกินอยู่ข้างตัว เขาบินไปที่เป้าก่อน) ใช้รูนทั้งหมด',lv:()=>[`${vM(RB.vxHavamal.dmg)} + ${vM(RB.vxHavamal.per)} ต่อรูน รัศมี ${RB.vxHavamal.R}`,`Cooldown ${RB.vxHavamal.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const RV={mem:[],runes:0,runeN:0,runeT:-99,hug:null,hist:[],castN:0,parryUntil:0,ward:0,nightsUntil:0,haunt:null,pincer:null,tether:null,storm:null,
  memPop:0,runePop:0,munOv:null,hugCastT:-9,hugSoar:-9,burstPend:0,showMun:true,showHug:true};
const vL=k=>LV[k]||0;
const vLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,vL(k)))-1];
const RVC={violet:'#9a6cff',violet2:'#dccbff',shadow:'#1a0f26',frost:'#7fd8ff',frost2:'#e6fbff',gold:'#ffd36a',gold2:'#fff1c2',silver:'#dfe8f4',crimson:'#e05a5a',leaf:'#9fe6a0'};
const MUN_FLT='grayscale(1) brightness(.36) sepia(1) hue-rotate(222deg) saturate(2.8) contrast(1.15)';   /* Muninn: a dark violet shadow of the hero */
const HUG_FLT='grayscale(1) brightness(1.45) sepia(1) hue-rotate(155deg) saturate(2.2)';                /* Huginn: a pale frost-blue light copy */
const HUG_SC=.72;
/* the branch (column) of a skill key: C nodes follow their column */
const vCol=k=>{if(!k||k==='basic')return 'basic';const d=RV_DEFS.find(x=>x.key===k);if(d)return d.br==='C'?d.col:d.br;const s=SKILLS[k];return s?(s.br==='C'?(s.col||'basic'):s.br):'basic';};
const vNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const vNearest=(x,y,R)=>{let b=null,bd=R;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd){bd=d;b=e;}}return b;};
const vSegD=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const vSeg=(ax,ay,bx,by,w)=>enemies.filter(e=>!e.dead&&vSegD(e.x,e.y,ax,ay,bx,by)<w+e.r*.5);
const vLine=(x,y,phi,L,w=26)=>vSeg(x,y,x+Math.cos(phi)*L,y+Math.sin(phi)*L,w);
function vFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function vPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!vFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const vTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const vPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const vAll=()=>hasBuff('vxAllfather');
/* a cast context: memory to write, echo targets, rune counts of this one cast */
function vC(key,o){RV.castN++;return Object.assign({id:RV.castN,key},o||{});}
/* every hit of the raven goes through here (branch = the skill's column) */
function vHit(e,m,key,o={}){if(!e||e.dead)return 0;const br=vCol(key);const d=hurt(e,m,Object.assign({skill:key,br,critOK:br!=='B'},o));if(d>0&&!o.echo)vAfterHit(e);return d;}
/* Haunting Memory / Endless Pincer: Muninn repeats every hit we land on that one target */
function vAfterHit(e){const H=RV.haunt&&RV.haunt.e===e&&RV.haunt.until>gameTime&&RV.haunt.n>0?RV.haunt:(RV.pincer&&RV.pincer.e===e&&RV.pincer.until>gameTime?RV.pincer:null);
  if(!H||gameTime-(H.last||-9)<.14)return;H.last=gameTime;if(H===RV.haunt){H.n--;vEcho(e,RB.vxHaunt.dmg,'vxHaunt');}else vEcho(e,RB.vxPincer.dmg,'vxPincer',{stay:1});}
/* ---- MUNINN (A): the late echo + memory ---- */
function vEcho(e,m,key,o={}){if(!e||e.dead)return;const dl=o.delay??RV_BAL.echo.delay,a=Math.atan2(e.y-player.y,e.x-player.x)+(o.stay?Math.PI:2.2*(RV.castN%2?1:-1));
  RV.munOv={x:e.x+Math.cos(a)*(e.r+26),y:e.y+Math.sin(a)*(e.r+26),t0:gameTime,T:dl+.24,face:a+Math.PI,e};
  setFxTimer(dl,()=>{if(e.dead)return;const M=RV._v&&RV._v.m,sx=M?M.wx:e.x,sy=M?M.wy:e.y,ph=Math.atan2(e.y-sy,e.x-sx);
    addFx(new RvThrust({x:sx,y:sy,phi:ph,len:Math.max(20,Math.hypot(e.x-sx,e.y-sy)),col:RVC.violet,w:6,life:.2}));
    const d=vHit(e,m+(vAll()?RB.vxAllfather.echo:0),key,{echo:1,critOK:true});if(d>0){vSpark(e,false,RVC.violet);vFeathers(e.x,e.y,2,{z:30,spd:70});}});}
const vMemCap=()=>vL('vxDeep')?RV_BAL.mem.deep:RV_BAL.mem.cap;
function vRec(key,m,o={}){const n=(o.n||1)*(vAll()?2:1);for(let i=0;i<n;i++)RV.mem.unshift({key,name:(SKILLS[key]||{}).name||key,m,aoe:!!o.aoe,t:gameTime});
  const cap=vMemCap();if(RV.mem.length>cap)RV.mem.length=cap;RV.memPop=1;if(o.e&&!o.e.dead)addFx(new RvFeatherFly({x:o.e.x,y:o.e.y}));}
/* an A hit: writes the cast into memory (once) and lets Muninn echo it (Shadow Echo, up to 3 targets a cast) */
function vHitA(e,m,key,C,o={}){const d=vHit(e,m,key,o);if(d<=0||!C)return d;
  if(!C.rec&&C.mem){C.rec=1;vRec(key,C.mem,{aoe:C.aoe,e,n:C.memN});}
  if(vL('vaShadow')&&!o.noEcho){C.ech=C.ech||new Set();if(!C.ech.has(e)&&C.ech.size<RB.vaShadow.max){C.ech.add(e);vEcho(e,vLv(RB.vaShadow.dmg,'vaShadow'),'vaShadow');}}
  return d;}
/* ---- HUGINN (B): second cast point + runes ---- */
function vHugXY(){const h=RV.hug;if(h&&h.until>gameTime)return [h.x,h.y];const s=RV_BAL.hug.home,ph=player.phi;
  return [player.x+Math.cos(ph+Math.PI/2)*s[0]+Math.cos(ph)*s[1],player.y+Math.sin(ph+Math.PI/2)*s[0]+Math.sin(ph)*s[1]];}
function vHugTgt(r,avoid){const [x,y]=vHugXY();let b=null,bd=r,b2=null,bd2=r;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd){b2=b;bd2=bd;b=e;bd=d;}else if(d<bd2){b2=e;bd2=d;}}return avoid&&b===avoid&&b2?b2:b;}
const vHugCast=()=>{RV.hugCastT=gameTime;};
const vPerched=()=>!!(RV.hug&&RV.hug.until>gameTime&&RV.hug.arrive<=gameTime);
function vSendHug(x,y,T,onArrive){const fly=RV_BAL.hug.fly;[x,y]=clampPt(x,y);RV.hug={x,y,arrive:gameTime+fly,until:gameTime+fly+T};if(onArrive)setFxTimer(fly,onArrive);}
function vRuneTick(C){if(C){if((C.rc||0)>=RV_BAL.rune.perCast)return;C.rc=(C.rc||0)+1;}
  RV.runeN+=vAll()?2:1;while(RV.runeN>=RV_BAL.rune.every){RV.runeN-=RV_BAL.rune.every;vCarve(1);}}
function vCarve(n){RV.runes=Math.min(RV_BAL.rune.cap,RV.runes+n);RV.runeT=gameTime;RV.runePop=1;
  if(RV.runes>=RV_BAL.rune.cap&&vL('vbScribe')&&!RV.burstPend){RV.burstPend=1;setFxTimer(.25,vRunicBurst);}}
/* Rune Scribe — the auto spell: three runes round Huginn burst by themselves */
function vRunicBurst(){RV.burstPend=0;if(RV.runes<RV_BAL.rune.cap||!vL('vbScribe'))return;RV.runes=0;const [x,y]=vHugXY(),R=RB.vbScribe.R,m=vLv(RB.vbScribe.dmg,'vbScribe');vHugCast();
  for(const e of vNear(x,y,R))vHit(e,m,'vbScribe',{big:true});vBurstFx(x,y,R,RVC.frost,{runes:3});addFx(new DText({x,y,z:96,text:'RUNIC BURST',color:RVC.frost2,size:12,life:.8}));shake(1.6);}
/* a B hit: counts toward the next rune */
function vHitB(e,m,key,C,o={}){const d=vHit(e,m,key,o);if(d>0)vRuneTick(C);return d;}

/* ---------------------------------------------------------------------
   4. FX (code VFX — painted pieces can replace them later)
   --------------------------------------------------------------------- */
function vGlow(x,y,r,col,a){if(!(a>0)||!(r>0))return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,Math.min(1,a)));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
/* Elder Futhark runes as line segments in a ±1 box (y down): ansuz algiz tiwaz kenaz sowilo raido fehu othala ingwaz */
const RV_RUNES=[[[0,-1,0,1],[0,-1,.6,-.45],[0,-.4,.6,.15]],[[0,-1,0,1],[0,-.15,-.6,-.85],[0,-.15,.6,-.85]],[[0,-1,0,1],[0,-1,-.6,-.4],[0,-1,.6,-.4]],
  [[.45,-.85,-.35,0],[-.35,0,.45,.85]],[[.3,-1,-.3,-.25],[-.3,-.25,.3,.25],[.3,.25,-.3,1]],[[-.4,-1,-.4,1],[-.4,-1,.4,-.6],[.4,-.6,-.4,-.15],[-.4,-.15,.4,1]],
  [[0,-1,0,1],[0,-.55,.6,-1],[0,-.05,.6,-.5]],[[-.55,1,.45,-.05],[.45,-.05,0,-.75],[0,-.75,-.45,-.05],[-.45,-.05,.55,1]],[[0,-1,.55,0],[.55,0,0,1],[0,1,-.55,0],[-.55,0,0,-1]]];
function vRune(x,y,s,g,col,a,lw=2.2){if(!(a>0))return;const R=RV_RUNES[((g|0)%RV_RUNES.length+RV_RUNES.length)%RV_RUNES.length];ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,a);ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='lighter';
  ctx.beginPath();for(const [a1,b1,a2,b2] of R){ctx.moveTo(a1*s,b1*s);ctx.lineTo(a2*s,b2*s);}ctx.strokeStyle=hexA(col,.45);ctx.lineWidth=lw*2.8;ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=lw;ctx.stroke();ctx.restore();}
function vFeather(x,y,len,ang,col,a){if(!(a>0))return;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha=Math.min(1,a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-len*.5,0);ctx.quadraticCurveTo(-len*.05,-len*.24,len*.5,0);ctx.quadraticCurveTo(-len*.05,len*.24,-len*.5,0);ctx.fill();
  ctx.strokeStyle='rgba(200,180,255,.45)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(-len*.6,0);ctx.lineTo(len*.42,0);ctx.stroke();ctx.restore();}
function vEyeGlyph(x,y,s,a){if(!(a>0))return;vGlow(x,y,s*2.2,RVC.gold,.35*a);ctx.save();ctx.globalAlpha=Math.min(1,a);ctx.fillStyle='#fff6d8';ctx.strokeStyle='#5a3a06';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.quadraticCurveTo(x,y-s*.85,x+s,y);ctx.quadraticCurveTo(x,y+s*.85,x-s,y);ctx.fill();ctx.stroke();
  ctx.fillStyle=RVC.gold;ctx.beginPath();ctx.arc(x,y,s*.42,0,TAU);ctx.fill();ctx.fillStyle='#1a1008';ctx.beginPath();ctx.arc(x,y,s*.2,0,TAU);ctx.fill();ctx.restore();}
/* a jagged frost beam (redrawn every frame) */
function vBeam(ax,ay,bx,by,w,a){const L=Math.hypot(bx-ax,by-ay)||1,n=Math.max(3,Math.round(L/22)),nx=-(by-ay)/L,ny=(bx-ax)/L,pts=[[ax,ay]];for(let i=1;i<n;i++){const k=i/n,j=rnd(-1,1)*w;pts.push([ax+(bx-ax)*k+nx*j,ay+(by-ay)*k+ny*j]);}pts.push([bx,by]);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';const path=()=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)ctx.lineTo(p[0],p[1]);};
  path();ctx.strokeStyle=hexA(RVC.frost,.3*a);ctx.lineWidth=10;ctx.stroke();path();ctx.strokeStyle=hexA(RVC.frost,.8*a);ctx.lineWidth=3.2;ctx.stroke();path();ctx.strokeStyle=hexA('#ffffff',.95*a);ctx.lineWidth=1.3;ctx.stroke();ctx.restore();}
/* one shared particle pool: feathers, sparks (short streaks, never round dots), falling runes */
class RvBits{constructor(){this.t=0;this.layer='top';this.p=[];}
  add(q){if(this.p.length>260)this.p.shift();this.p.push(Object.assign({t:0,life:.8,vx:0,vy:0,vz:0,z:20,g:0,drag:1.5,rot:rnd(0,TAU),vr:0,s:6,kind:'feather',col:RVC.shadow,a:1},q));}
  update(dt){this.t+=dt;for(let i=this.p.length-1;i>=0;i--){const q=this.p[i];q.t+=dt;if(q.t>=q.life){this.p.splice(i,1);continue;}const f=Math.exp(-q.drag*dt);q.vx*=f;q.vy*=f;q.vz=q.vz*f-q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z=Math.max(0,q.z+q.vz*dt);q.rot+=q.vr*dt;}return CHAR==='raven';}
  draw(){for(const q of this.p){const k=q.t/q.life,[x,y]=P(q.x,q.y,q.z),a=q.a*(k<.12?k/.12:1-Math.max(0,(k-.55)/.45));
    if(q.kind==='feather')vFeather(x,y,q.s,q.rot,q.col,a);
    else if(q.kind==='rune')vRune(x,y,q.s,q.gl||0,q.col,a,1.3);
    else{const [x2,y2]=P(q.x-q.vx*.035,q.y-q.vy*.035,Math.max(0,q.z-q.vz*.035));ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(q.col,a);ctx.lineWidth=q.s*.32;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a*.8);ctx.lineWidth=q.s*.12;ctx.stroke();ctx.restore();}}}}
function vFeathers(x,y,n,o={}){const B=RV._v&&RV._v.b;if(!B)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),v=rnd(.4,1)*(o.spd??80);B.add({kind:'feather',x,y,z:(o.z??30)+rnd(-6,6),vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:o.up??rnd(10,60),g:o.g??26,drag:o.drag??2.2,s:o.s??rnd(7,11),col:o.col||RVC.shadow,life:o.life??rnd(.6,1.1),vr:rnd(-5,5)});}}
function vSparks(x,y,z,n,col){const B=RV._v&&RV._v.b;if(!B)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),v=rnd(120,260);B.add({kind:'spark',x,y,z,vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:rnd(40,160),g:420,drag:3,s:rnd(5,9),col,life:rnd(.22,.4)});}}
function vRuneRain(x,y,R,n){const B=RV._v&&RV._v.b;if(!B)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),r=Math.sqrt(Math.random())*R;B.add({kind:'rune',x:x+Math.cos(an)*r,y:y+Math.sin(an)*r,z:rnd(80,120),vz:-200,g:300,drag:.2,s:rnd(5,7),gl:(Math.random()*9)|0,col:RVC.frost,life:.45,a:.9});}}
/* hit flash: 4-point star + glow */
class RvFlash{constructor(o){Object.assign(this,{t:0,life:.16,layer:'top',z:24,r:20,col:RVC.silver},o);this.an=rnd(0,TAU);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),a=1-k,r=this.r*(.6+.6*eOut(k));vGlow(x,y,r*1.5,this.col,.55*a);ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.an);ctx.fillStyle=hexA('#ffffff',.92*a);
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,-r*.12);ctx.lineTo(r,0);ctx.lineTo(0,r*.12);ctx.closePath();ctx.fill();}ctx.restore();}}
function vSpark(e,big,col){const z=(e.boss?36:24)+(e.z||0);addFx(new RvFlash({x:e.x,y:e.y,z,r:big?32:18,col}));vSparks(e.x,e.y,z,big?6:3,col);}
/* spear thrust: a tapered white-hot streak along the thrust */
class RvThrust{constructor(o){Object.assign(this,{t:0,life:.18,layer:'top',w:6,col:RVC.silver,z:36},o);if(this.x==null){this.x=player.x;this.y=player.y;}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=eOut(Math.min(1,k*2.4)),L=this.len*e,c=Math.cos(this.phi),s=Math.sin(this.phi),a=1-Math.max(0,(k-.45)/.55);
    const [x0,y0]=P(this.x+c*12,this.y+s*12,this.z),[x1,y1]=P(this.x+c*(12+L),this.y+s*(12+L),this.z*.92);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(this.col,.32*a);ctx.lineWidth=this.w*2.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
    const ang=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(ang),ny=Math.cos(ang),tw=this.w*.55;ctx.fillStyle=hexA('#ffffff',.92*a);ctx.beginPath();ctx.moveTo(x0+nx*tw,y0+ny*tw);ctx.lineTo(x1,y1);ctx.lineTo(x0-nx*tw,y0-ny*tw);ctx.closePath();ctx.fill();ctx.restore();
    vGlow(x1,y1,this.w*3.2,this.col,.65*a);}}
/* sweep crescent on the ground plane round the hero */
class RvCrescent{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',z:20,span:2.7,R:110,col:RVC.silver},o);this.x=player.x;this.y=player.y;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,sw=eOut(Math.min(1,k*2.2)),a=1-Math.max(0,(k-.4)/.6),a0=this.phi-this.span/2,a1=a0+this.span*sw;const [cx,cy]=P(this.x,this.y,this.z);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(cx,cy);ctx.scale(1,K);ctx.lineCap='round';
    ctx.strokeStyle=hexA(this.col,.28*a);ctx.lineWidth=24;ctx.beginPath();ctx.arc(0,0,this.R*.78,a0,a1);ctx.stroke();
    ctx.strokeStyle=hexA(this.col,.7*a);ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,0,this.R*.84,Math.max(a0,a1-1.2),a1);ctx.stroke();
    ctx.strokeStyle=hexA('#ffffff',.9*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,this.R*.86,Math.max(a0,a1-.7),a1);ctx.stroke();ctx.restore();}}
/* flying spear (Gungnir Throw, its return, Odin's Gungnir): pierces, ends at its length or a wall; `home` = steer to one target */
class RvSpear{constructor(o){Object.assign(this,{t:0,layer:'top',speed:900,len:340,z:38,col:RVC.silver,hits:new Set(),d:0,big:0},o);this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;const st=this.speed*dt;
    if(this.home){const h=this.home;if(h.dead||this.t>2)return false;const ph=Math.atan2(h.y-this.y,h.x-this.x);this.phi=ph;this.x+=Math.cos(ph)*st;this.y+=Math.sin(ph)*st;if(Math.hypot(h.x-this.x,h.y-this.y)<h.r+12){this.onHit&&this.onHit(h);return false;}return true;}
    this.d+=st;this.x=this.x0+Math.cos(this.phi)*this.d;this.y=this.y0+Math.sin(this.phi)*this.d;const end=this.d>=this.len||!vFree(this.x,this.y);
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+18){this.hits.add(e);this.onHit&&this.onHit(e);}}
    if(end){this.end&&this.end(this.x,this.y);return false;}return true;}
  draw(){const [x,y]=P(this.x,this.y,this.z),ang=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)),L=this.big?92:60,ga=this.mun?.75:1;
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(-L*2.4,0,0,0);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA(this.col,.5*ga));ctx.fillStyle=g;ctx.fillRect(-L*2.4,-5,L*2.4,10);
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=ga;ctx.strokeStyle=this.mun?'#3a2266':'#3a2a1a';ctx.lineWidth=this.big?4.5:3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-L,0);ctx.lineTo(L*.52,0);ctx.stroke();
    ctx.fillStyle=this.big?RVC.gold:this.mun?RVC.violet2:'#e8eef8';ctx.strokeStyle='rgba(40,30,20,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L*.48,0);ctx.quadraticCurveTo(L*.7,-(this.big?10:7),L,0);ctx.quadraticCurveTo(L*.7,(this.big?10:7),L*.48,0);ctx.fill();ctx.stroke();
    if(this.big){ctx.strokeStyle=RVC.gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(L*.4,-6);ctx.lineTo(L*.4,6);ctx.stroke();}ctx.restore();vGlow(x+Math.cos(ang)*L*.85,y+Math.sin(ang)*L*.85,this.big?30:16,this.col,.7*ga);}}
/* homing rune bolt (hero = pale, Huginn = frost) */
class RvBolt{constructor(o){Object.assign(this,{t:0,layer:'top',speed:520,z:34,col:RVC.frost,range:460,tr:[]},o);this.g=(Math.random()*9)|0;this.d=0;}
  update(dt){this.t+=dt;const e=this.e&&!this.e.dead?this.e:null;if(e){const ph=Math.atan2(e.y-this.y,e.x-this.x);this.phi+=clamp(angDiff(ph,this.phi),-7*dt,7*dt);}
    const s=this.speed*dt;this.x+=Math.cos(this.phi)*s;this.y+=Math.sin(this.phi)*s;this.d+=s;this.tr.push([this.x,this.y]);if(this.tr.length>9)this.tr.shift();
    if(!vFree(this.x,this.y))return false;const tg=e&&Math.hypot(e.x-this.x,e.y-this.y)<e.r+12?e:enemies.find(q=>!q.dead&&Math.hypot(q.x-this.x,q.y-this.y)<q.r+10);
    if(tg){this.onHit&&this.onHit(tg);addFx(new RvFlash({x:tg.x,y:tg.y,z:(tg.boss?36:24),r:22,col:this.col}));vSparks(tg.x,tg.y,24,3,this.col);return false;}return this.d<this.range;}
  draw(){const n=this.tr.length;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=1;i<n;i++){const [ax,ay]=P(this.tr[i-1][0],this.tr[i-1][1],this.z),[bx,by]=P(this.tr[i][0],this.tr[i][1],this.z),k=i/n;ctx.strokeStyle=hexA(this.col,.5*k);ctx.lineWidth=7*k;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}ctx.restore();
    const [x,y]=P(this.x,this.y,this.z);vGlow(x,y,18,this.col,.75);vRune(x,y,6.5,this.g+Math.floor(this.t*10),this.col,1,1.6);}}
/* rune circle on the ground, detonates after T */
class RvCircle{constructor(o){Object.assign(this,{t:0,layer:'ground',T:.6,R:90,col:RVC.frost},o);this.done=0;this.g=(Math.random()*9)|0;}
  update(dt){this.t+=dt;if(!this.done&&this.t>=this.T){this.done=1;this.boom&&this.boom();addFx(new RvPillar({x:this.x,y:this.y,R:this.R,col:this.col}));vSparks(this.x,this.y,10,6,this.col);}return this.t<this.T+.35;}
  draw(){const k=Math.min(1,this.t/this.T),a=this.t<this.T?Math.min(1,this.t/.12):Math.max(0,1-(this.t-this.T)/.35),[x,y]=P(this.x,this.y),R=this.R*eOut(k);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,0,0,0,this.R);g.addColorStop(0,hexA(this.col,.28*a*k));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.strokeStyle=hexA(this.col,.75*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,R*.76,0,TAU);ctx.stroke();
    for(let i=0;i<6;i++){const an=i/6*TAU+this.t*1.4;vRune(Math.cos(an)*R*.88,Math.sin(an)*R*.88,7,this.g+i,this.col,.9*a,1.5);}vRune(0,0,R*.26,this.g,this.col,.8*a*k,2.4);ctx.restore();}}
/* light pillar where a rune bursts */
class RvPillar{constructor(o){Object.assign(this,{t:0,life:.42,layer:'top',R:80,col:RVC.frost,H:170},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[x,y]=P(this.x,this.y),w=this.R*.5*(1-k*.5),H=this.H*(.55+.45*eOut(k));ctx.save();ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(x,y-H,x,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(.7,hexA(this.col,.42*a));g.addColorStop(1,hexA('#ffffff',.85*a));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-H/2,w*.5,H/2,0,0,TAU);ctx.fill();ctx.restore();vGlow(x,y,this.R,this.col,.5*a);}}
/* a burst on the ground: ring + flash + (feathers | runes | gold) */
function vBurstFx(x,y,R,col,o={}){addFx(new GRing({x,y,r0:10,r1:R,w:8,color:col,life:.36}));addFx(new RvFlash({x,y,z:20,r:Math.min(60,R*.55),col,life:.22}));vSparks(x,y,16,8,col);
  if(o.feathers)vFeathers(x,y,o.feathers,{z:20,spd:R*1.6,up:80});if(o.gold)addFx(new RvPillar({x,y,R,col:RVC.gold,H:200}));
  if(o.runes){const B=RV._v&&RV._v.b;if(B)for(let i=0;i<o.runes;i++){const an=i/o.runes*TAU;B.add({kind:'rune',x,y,z:46,vx:Math.cos(an)*R*1.8,vy:Math.sin(an)*R*1.8,vz:60,g:120,drag:3,s:8,gl:i*3+1,col:RVC.frost,life:.5});}}}
/* Valhalla: a phantom einherjar spear thrusts in from outside */
class RvPhantom{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top',an:0},o);this.ox=Math.cos(this.an);this.oy=Math.sin(this.an);}update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,k=this.t/this.life,i=eOut(Math.min(1,k/.35)),a=k<.6?1:1-(k-.6)/.4,D=110*(1-i)+e.r*.3,tx=e.x+this.ox*D,ty=e.y+this.oy*D,[x0,y0]=P(tx+this.ox*80,ty+this.oy*80,50),[x1,y1]=P(tx,ty,30);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(RVC.violet,.5*a);ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=hexA(RVC.gold,.95*a);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();vGlow(x1,y1,16,RVC.gold,.75*a);}}
/* a rune written in the air (ult), bursts at T */
class RvRuneMark{constructor(o){Object.assign(this,{t:0,layer:'top',T:.5,g:0},o);}update(dt){this.t+=dt;return this.t<this.T+.2;}
  draw(){const [x,y]=P(this.x,this.y,26),k=Math.min(1,this.t/.2),a=this.t<this.T?k:Math.max(0,1-(this.t-this.T)/.2);vGlow(x,y,28,RVC.frost,.45*a);vRune(x,y,13*(this.t<this.T?1:1+(this.t-this.T)*3),this.g,RVC.frost,a,2.4);}}
/* short frost zap from a point to an enemy */
class RvZap{constructor(o){Object.assign(this,{t:0,life:.16,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const e=this.e;if(!e)return;const [ax,ay]=P(this.a[0],this.a[1],this.a[2]||30),[bx,by]=P(e.x,e.y,(e.boss?36:24)+(e.z||0));vBeam(ax,ay,bx,by,6,1-this.t/this.life);}}
/* the tether snaps */
class RvSnap{constructor(o){Object.assign(this,{t:0,life:.3,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[ax,ay]=P(this.a[0],this.a[1],40),[bx,by]=P(this.b[0],this.b[1],40),mx=(ax+bx)/2,my=(ay+by)/2,q=1-k;vBeam(ax,ay,ax+(mx-ax)*q,ay+(my-ay)*q,10,a);vBeam(bx,by,bx+(mx-bx)*q,by+(my-by)*q,10,a);vGlow(mx,my,60*(1+k),RVC.frost,.6*a);}}
/* a giant rune drops from the sky and slams (Havamal Verse, The Eighteenth Rune) */
class RvGreatRune{constructor(o){Object.assign(this,{t:0,layer:'top',R:140,delay:.35,g:1},o);this.done=0;}
  update(dt){this.t+=dt;if(!this.done&&this.t>=this.delay){this.done=1;this.boom&&this.boom();vBurstFx(this.x,this.y,this.R,RVC.frost,{runes:6});addFx(new RvPillar({x:this.x,y:this.y,R:this.R,col:RVC.frost2,H:260}));}return this.t<this.delay+.45;}
  draw(){const k=Math.min(1,this.t/this.delay),z=this.done?0:220*(1-eIn(k)),a=this.done?Math.max(0,1-(this.t-this.delay)/.45):Math.min(1,this.t/.12),[x,y]=P(this.x,this.y,z+20);vGlow(x,y,this.R*.7,RVC.frost,.5*a);vRune(x,y,this.R*.32,this.g,RVC.frost,a,5);
    if(!this.done){const [gx,gy]=P(this.x,this.y);ctx.save();ctx.translate(gx,gy);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(RVC.frost,.5*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,this.R*k,0,TAU);ctx.stroke();ctx.restore();}}}
/* a violet feather flies from the target into Muninn's memory (above the hero's head) */
class RvFeatherFly{constructor(o){Object.assign(this,{t:0,life:.42,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eInOut(Math.min(1,this.t/this.life)),hz=(player.z||0)+96*CHAR_SCALE,x=lerp(this.x,player.x,k),y=lerp(this.y,player.y,k),z=lerp(40,hz,k)+Math.sin(k*Math.PI)*50,[sx,sy]=P(x,y,z);vGlow(sx,sy,12,RVC.violet,.6);vFeather(sx,sy,12,this.t*14,'#b48cff',1);}}
/* Odin's Eye opens over the hero */
class RvEye{constructor(o){Object.assign(this,{t:0,life:.75,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=k<.2?k/.2:1-(k-.2)/.8,[x,y]=P(this.x,this.y,120);vEyeGlyph(x,y,16*(.7+.3*eOut(Math.min(1,k*3))),a);
    const [gx,gy]=P(this.x,this.y);ctx.save();ctx.translate(gx,gy);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(RVC.gold,.55*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,this.R*eOut(Math.min(1,k*1.6)),0,TAU);ctx.stroke();ctx.restore();}}

/* ---- the two doubles, drawn from the hero's own sprite ---- */
class RvAfter{constructor(o){Object.assign(this,{t:0,life:.22,layer:'sorted',a:.3,sc:1,z:0},o);}get sy(){return this.y-1;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z);try{const img=gradedFrame(this.fr,this.flt);ctx.save();ctx.translate(x,y);ctx.scale(this.sc,this.sc);drawFrame(this.fr,0,0,this.a*(1-k),null,img);ctx.restore();}catch(_){}}}
function vHist(dl){const H=RV.hist,tt=gameTime-dl;for(let i=H.length-1;i>=0;i--)if(H[i].t<=tt)return H[i];return H[0]||null;}
class RvMuninn{constructor(){this.layer='sorted';this.t=0;this.wx=player.x-30;this.wy=player.y;this.k=0;this.gt=0;}
  get sy(){return this.wy-.5;}
  spot(){const o=RV.munOv;if(o&&gameTime<o.t0+o.T)return [o.x,o.y,1];RV.munOv=null;const h=vHist(RV_BAL.echo.delay)||{x:player.x,y:player.y,phi:player.phi},ph=h.phi;
    return [h.x+Math.cos(ph-Math.PI/2)*40-Math.cos(ph)*22,h.y+Math.sin(ph-Math.PI/2)*40-Math.sin(ph)*22,0];}
  frame(){const o=RV.munOv,h=vHist(RV_BAL.echo.delay);let fr=h&&h.e?h.e:playerFrame();
    if(o&&gameTime<o.t0+o.T){const d=dirOf(o.face);if(o.pose==='atk'){const ad=atkDir(d),n=durs('attack',ad).length,ct=CT(ad),k=clamp((gameTime-o.t0)/Math.max(.05,o.T),0,1);return {st:'attack',d:ad,f:clamp(ct-2+Math.floor(k*4),0,n-1)};}
      const dd=fr.st==='attack'?atkDir(d):d,n=durs(fr.st,dd).length;return {st:fr.st,d:dd,f:Math.min(fr.f,n-1)};}
    return fr;}
  update(dt){this.t+=dt;this.k=clamp(this.k+(RV.showMun?dt*3:-dt*3),0,1);const [tx,ty,ov]=this.spot(),d=Math.hypot(tx-this.wx,ty-this.wy),o=RV.munOv;
    if(ov&&o&&o.snap&&!o._s){o._s=1;if(d>20){vFeathers(this.wx,this.wy,5,{z:40,spd:70,col:'#3a2266'});vFeathers(tx,ty,6,{z:40,spd:90,col:'#3a2266'});}this.wx=tx;this.wy=ty;}
    else if(d>420){this.wx=tx;this.wy=ty;}else{const f=Math.min(1,dt*(ov?18:8));this.wx+=(tx-this.wx)*f;this.wy+=(ty-this.wy)*f;}
    if(ov&&d>24&&this.k>.2&&(this.gt-=dt)<=0){this.gt=.04;addFx(new RvAfter({fr:this.frame(),x:this.wx,y:this.wy,flt:MUN_FLT,a:.32,life:.2}));}
    return CHAR==='raven';}
  draw(){if(this.k<=.02)return;const fr=this.frame(),[x,y]=P(this.wx,this.wy,0);
    if(curMap)try{castShadow(fr,x,y);}catch(_){}
    try{drawFrame(fr,x,y,.86*this.k,null,gradedFrame(fr,MUN_FLT));ctx.save();ctx.globalCompositeOperation='lighter';drawFrame(fr,x,y,(.1+.06*Math.sin(this.t*3))*this.k,null,tinted(fr,RVC.violet));ctx.restore();}catch(_){}
    if(Math.random()<.07*this.k)vFeathers(this.wx+rnd(-10,10),this.wy+rnd(-6,6),1,{z:rnd(30,70),spd:14,life:1.1,up:8});}}
class RvHuginn{constructor(){this.layer='sorted';this.t=0;const [x,y]=vHugXY();this.wx=x;this.wy=y;this.z=30;this.k=0;this.gt=0;this.face=player.phi;}
  get sy(){return this.wy-.4;}
  frame(){const d=dirOf(this.face),ct=gameTime-RV.hugCastT;if(ct>=0&&ct<.5){const n=durs('buff',d).length,pk=bPeak(d);return {st:'buff',d,f:clamp(Math.floor(ct/.5*(pk+1)),0,n-1)};}
    const D=durs('idle',d),T=D.reduce((a,b)=>a+b,0)||1;let ms=(this.t*1000)%T,f=0;while(f<D.length-1&&ms>=D[f]){ms-=D[f];f++;}return {st:'idle',d,f};}
  update(dt){this.t+=dt;this.k=clamp(this.k+(RV.showHug?dt*3:-dt*3),0,1);const [tx,ty]=vHugXY(),h=RV.hug&&RV.hug.until>gameTime?RV.hug:null,d=Math.hypot(tx-this.wx,ty-this.wy);
    const rem=h&&h.arrive>gameTime?h.arrive-gameTime:.1,step=Math.min(d,Math.max(80,d/Math.max(.05,rem))*dt);
    if(d>700){this.wx=tx;this.wy=ty;}else if(d>.5){this.wx+=(tx-this.wx)/d*step;this.wy+=(ty-this.wy)/d*step;}
    const zT=RV.hugSoar>gameTime?150:(h?40:60)+Math.sin(this.t*2.2)*5;this.z+=(zT-this.z)*Math.min(1,dt*5);
    const e=vHugTgt(300);this.face=e&&(h||RV.storm)?Math.atan2(e.y-this.wy,e.x-this.wx):player.phi;
    if(h&&h.arrive>gameTime&&d>30&&this.k>.2&&(this.gt-=dt)<=0){this.gt=.045;addFx(new RvAfter({fr:this.frame(),x:this.wx,y:this.wy,z:this.z,flt:HUG_FLT,a:.26,sc:HUG_SC,life:.18}));}
    if(RV.storm&&Math.random()<dt*22)vRuneRain(this.wx,this.wy,RV.storm.R*.9,1);
    return CHAR==='raven';}
  draw(){if(this.k<=.02)return;const fr=this.frame(),[gx,gy]=P(this.wx,this.wy,0),[x,y]=P(this.wx,this.wy,this.z);
    ctx.save();ctx.translate(gx,gy);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,34);g.addColorStop(0,hexA(RVC.frost,.3*this.k));g.addColorStop(1,hexA(RVC.frost,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,34,0,TAU);ctx.fill();ctx.restore();
    try{ctx.save();ctx.translate(x,y);ctx.scale(HUG_SC,HUG_SC);drawFrame(fr,0,0,.72*this.k,null,gradedFrame(fr,HUG_FLT));ctx.globalCompositeOperation='lighter';drawFrame(fr,0,0,(.14+.08*Math.sin(this.t*4))*this.k,null,tinted(fr,RVC.frost));ctx.restore();}catch(_){ctx.restore();}
    const n=RV.runes;for(let i=0;i<n;i++){const an=this.t*1.8+i*TAU/3,[rx,ry]=P(this.wx+Math.cos(an)*28,this.wy+Math.sin(an)*16,this.z+40);vGlow(rx,ry,14,RVC.frost,.5*this.k);vRune(rx,ry,7*(1+.3*(RV.runePop||0)),i*3+1,RVC.frost,this.k,1.6);}}}
/* top layer: Muninn's memory feathers over the head, eye marks, haunt rings, parry wing, Algiz ward, the tether beam */
class RvTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;RV.memPop=Math.max(0,(RV.memPop||0)-dt*4);RV.runePop=Math.max(0,(RV.runePop||0)-dt*4);return CHAR==='raven';}
  draw(){const pz=(player.z||0)+96*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    const cap=vMemCap(),n=RV.mem.length;if(n>0&&RV.showMun)for(let i=0;i<cap;i++){const on=i<n,px=x+(i-(cap-1)/2)*13,py=y-(on&&i===0?RV.memPop*4:0);
      if(on){vGlow(px,py,11,RVC.violet,.45);vFeather(px,py,13,-Math.PI/2+.3,'#b48cff',1);}else{ctx.fillStyle='rgba(20,10,30,.55)';ctx.beginPath();ctx.arc(px,py,3,0,TAU);ctx.fill();}}
    for(const e of enemies){if(e.dead||!(e.vnEyeT>gameTime))continue;const h=(typeof MSPR_H==='function'?MSPR_H(e):(e.boss?62:48))+(e.z||0)+16,[ex,ey]=P(e.x,e.y,h);vEyeGlyph(ex,ey,7,Math.min(1,(e.vnEyeT-gameTime)*2));}
    for(const H of [RV.haunt,RV.pincer]){if(!H||!H.e||H.e.dead||H.until<gameTime)continue;const e=H.e,[hx,hy]=P(e.x,e.y,(e.boss?70:52)+(e.z||0));ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(RVC.violet,.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(hx,hy+8,18,7,0,this.t*3,this.t*3+4.4);ctx.stroke();ctx.restore();}
    if(RV.parryUntil>gameTime){const ph=player.phi,[px,py]=P(player.x+Math.cos(ph)*26,player.y+Math.sin(ph)*26,44);ctx.save();ctx.translate(px,py);ctx.rotate(Math.atan2(Math.sin(ph)*K,Math.cos(ph)));ctx.globalCompositeOperation='lighter';
      for(let i=0;i<5;i++){ctx.save();ctx.rotate(-.9+i*.45);vFeather(14,0,22,0,'#b48cff',.8);ctx.restore();}ctx.restore();}
    if(RV.ward>0)for(let i=0;i<RV.ward;i++){const an=this.t*2.4+i*Math.PI,[rx,ry]=P(player.x+Math.cos(an)*34,player.y+Math.sin(an)*20,46);vGlow(rx,ry,16,RVC.frost,.55);vRune(rx,ry,8.5,1,RVC.frost,1,2);}
    const T=RV.tether,M=RV._v&&RV._v.h;if(T&&M&&!(RV.hug&&RV.hug.arrive>gameTime)){const [ax,ay]=P(player.x,player.y,40),[bx,by]=P(M.wx,M.wy,M.z+40);vBeam(ax,ay,bx,by,7,Math.min(1,(T.until-gameTime)*3));}
    if(hasBuff('vnCloak')&&Math.random()<.35)vFeathers(player.x+rnd(-20,20),player.y+rnd(-14,14),1,{z:rnd(20,80),spd:40});
    if(hasBuff('vxYgg')||RV.nightsUntil>gameTime)vGlow(x,y+60,46,RVC.leaf,.12+.05*Math.sin(this.t*4));}}
/* ground layer: Huginn's storm and his perch ring */
class RvGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='raven';}
  draw(){const M=RV._v&&RV._v.h,S=RV.storm;if(S&&M){const [x,y]=P(M.wx,M.wy),a=Math.min(1,(S.until-gameTime)*2,(gameTime-S.t0)*4),R=S.R;ctx.save();ctx.translate(x,y);ctx.scale(1,K);
      /* a dark frost-blue body first (reads on snow), then additive wind bands, runes and a bright rim */
      const g=ctx.createRadialGradient(0,0,R*.1,0,0,R);g.addColorStop(0,`rgba(16,46,92,${.26*a})`);g.addColorStop(.75,`rgba(22,70,128,${.2*a})`);g.addColorStop(1,'rgba(22,70,128,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
      ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
      for(let i=0;i<5;i++){const r=R*(.32+i*.15),sp=(i%2?-1:1)*(1.6-i*.18),a0=this.t*sp+i*1.3,len=1.3+.25*Math.sin(this.t*2+i);
        ctx.strokeStyle=hexA(RVC.frost,.32*a);ctx.lineWidth=9-i;ctx.beginPath();ctx.arc(0,0,r,a0,a0+len);ctx.stroke();
        ctx.strokeStyle=hexA('#ffffff',.75*a);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,a0+len*.35,a0+len);ctx.stroke();
        ctx.strokeStyle=hexA(RVC.frost,.22*a);ctx.lineWidth=6-i*.6;ctx.beginPath();ctx.arc(0,0,r,a0+Math.PI,a0+Math.PI+len*.7);ctx.stroke();}
      ctx.strokeStyle=hexA(RVC.frost,.7*a);ctx.lineWidth=2.4;ctx.setLineDash([12,9]);ctx.lineDashOffset=-this.t*50;ctx.beginPath();ctx.arc(0,0,R*.96,0,TAU);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<8;i++){const an=i/8*TAU-this.t*.9;vRune(Math.cos(an)*R*.84,Math.sin(an)*R*.84,9,i,RVC.frost,.9*a,1.8);}
      if(S.pull){ctx.strokeStyle=hexA('#ffffff',.35*a);ctx.lineWidth=1.4;for(let i=0;i<6;i++){const an=i/6*TAU+this.t*2.2;ctx.beginPath();ctx.moveTo(Math.cos(an)*R*.95,Math.sin(an)*R*.95);ctx.quadraticCurveTo(Math.cos(an+.7)*R*.5,Math.sin(an+.7)*R*.5,0,0);ctx.stroke();}}
      ctx.restore();}
    if(vPerched()&&M){const [x,y]=P(M.wx,M.wy),a=Math.min(1,(RV.hug.until-gameTime)*2)*.7;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(RVC.frost,.5*a);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.stroke();
      for(let i=0;i<3;i++){const an=this.t*1.4+i*TAU/3;ctx.beginPath();ctx.arc(0,0,34,an,an+.6);ctx.stroke();}ctx.restore();}}}
/* the lasting pieces are never element-tinted by a gem (__gt '-'), whichever skill was being cast when they were (re)made */
function vEnsureVis(){const C=RV._v||(RV._v={});for(const [k,Q] of [['g',RvGround],['o',RvTop],['m',RvMuninn],['h',RvHuginn],['b',RvBits]])if(!C[k]||!fx.includes(C[k])){const o=new Q();o.__gt='-';o._sk=null;C[k]=addFx(o);}}
/* buff bar: memory n/cap and runes n/3 as status icons without a timer */
function vStatusIcons(){const b=player.buffs;if(!b)return;const n=RV.mem.length;
  if(n>0&&RV.showMun){b.rvMem=b.rvMem||{t:1e9,total:1e9};b.rvMem.t=1e9;b.rvMem.lbl=n+'/'+vMemCap();}else delete b.rvMem;
  if(RV.runes>0&&RV.showHug){b.rvRune=b.rvRune||{t:1e9,total:1e9};b.rvRune.t=1e9;b.rvRune.lbl=RV.runes+'/'+RV_BAL.rune.cap;}else delete b.rvRune;}
/* per-frame logic */
class RvCore{constructor(){this.t=0;this.layer='none';this.tk=0;this.sk=0;}draw(){}
  update(dt){this.t+=dt;vEnsureVis();
    /* a new map: Huginn's perch, the storm, the tether and Muninn's marks stay behind */
    if(this.map!==curMap){if(this.map!==undefined)Object.assign(RV,{hug:null,storm:null,tether:null,haunt:null,pincer:null,munOv:null});this.map=curMap;RV.hist.length=0;}
    const H=RV.hist;H.push({t:gameTime,e:playerFrame(),x:player.x,y:player.y,phi:player.phi});while(H.length>2&&H[0].t<gameTime-1.2)H.shift();
    if(RV.mem.length&&RV.mem.some(m=>gameTime-m.t>RV_BAL.mem.life))RV.mem=RV.mem.filter(m=>gameTime-m.t<=RV_BAL.mem.life);
    if(RV.runes>0&&gameTime-RV.runeT>RV_BAL.rune.life){RV.runes=0;RV.runeN=0;}
    if((this.sk-=dt)<=0){this.sk=1;RV.showMun=vL('vnEcho')>0||RV_DEFS.some(d=>d.br==='A'&&!d.passive&&LV[d.key]>0);RV.showHug=RV_DEFS.some(d=>d.br==='B'&&!d.passive&&LV[d.key]>0);}
    vStatusIcons();
    if(RV.nightsUntil>gameTime)player.hp=Math.min(player.maxHp,player.hp+PS.lv*vLv(RB.vnNights.hp,'vnNights')*dt);
    if(hasBuff('vxYgg'))player.hp=Math.min(player.maxHp,player.hp+PS.lv*RB.vxYgg.hp*dt);
    if(RV.haunt&&(RV.haunt.until<gameTime||RV.haunt.e.dead||RV.haunt.n<=0))RV.haunt=null;
    if(RV.pincer&&(RV.pincer.until<gameTime||RV.pincer.e.dead))RV.pincer=null;
    if(RV.hug&&RV.hug.until<=gameTime)RV.hug=null;
    this.tk+=dt;const sec=this.tk>=1;if(sec)this.tk-=1;
    if(sec){
      /* Watchful Perch: Huginn shoots the nearest enemy every second while perched */
      if(vPerched()&&vL('vbPerch')){const [x,y]=vHugXY(),e=vNearest(x,y,RB.vbPerch.R);if(e){vHugCast();addFx(new RvZap({a:[x,y,46],e}));vHitB(e,vLv(RB.vbPerch.dmg,'vbPerch'),'vbPerch',null);}}
      /* Allfather's Gaze keeps every enemy around in Odin's eye */
      if(vAll()){const v=vL('vnEye')?vLv(RB.vnEye.flat,'vnEye'):RB.vnEye.flat[0];for(const e of vNear(player.x,player.y,RB.vxAllfather.R)){if(!(e.vnEyeT>gameTime))e.vnEyeV=v;else e.vnEyeV=Math.max(e.vnEyeV||0,v);e.vnEyeT=Math.max(e.vnEyeT||0,gameTime+1.5);}}}
    /* Thought Storm round Huginn */
    const S=RV.storm;if(S){if(S.until<gameTime)RV.storm=null;else if((S.tk+=dt)>=RB.vbStorm.tick){S.tk-=RB.vbStorm.tick;const [x,y]=vHugXY(),TC={rc:1};vHugCast();
      for(const e of vNear(x,y,S.R)){if(S.pull&&!e.boss){const d=Math.hypot(x-e.x,y-e.y);if(d>24){const nx=e.x+(x-e.x)/d*RB.vxMaelstrom.pull,ny=e.y+(y-e.y)/d*RB.vxMaelstrom.pull;if(vFree(nx,ny)){e.x=nx;e.y=ny;}}}
        vHitB(e,S.m,'vbStorm',TC);if(S.slow)applyCC(e,{slow:RB.vbGale.slow});}}}
    /* Rune Tether between the hero and Huginn */
    const T=RV.tether;if(T){const [hx,hy]=vHugXY();if(T.until<gameTime){RV.tether=null;if(vL('vbSnap')){for(const e of vSeg(player.x,player.y,hx,hy,RB.vbTether.w+12))vHit(e,RB.vbSnap.dmg,'vbSnap',{big:true});addFx(new RvSnap({a:[player.x,player.y],b:[hx,hy]}));shake(2);}}
      else if(!(RV.hug&&RV.hug.arrive>gameTime)&&(T.tk+=dt)>=RB.vbTether.tick){T.tk-=RB.vbTether.tick;const TC={rc:1};for(const e of vSeg(player.x,player.y,hx,hy,RB.vbTether.w))vHitB(e,T.m,'vbTether',TC);}}
    return CHAR==='raven';}}
let rvCore=null;
function vEnsure(){if(CHAR!=='raven')return;if(!rvCore||!fx.includes(rvCore)){const o=fx.find(f=>f instanceof RvCore);if(o)rvCore=o;else{const c=new RvCore();c.__gt='-';c._sk=null;rvCore=addFx(c);}}vEnsureVis();}
window.vEnsure=vEnsure;

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
/* thrusts on the attack clip: n strikes, each lands on its measured contact frame */
function vThrusts(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),sp=(o.speed||1)*aspd();let s=[];const n=o.n||1;
  for(let i=0;i<n;i++){const last=i===n-1;s=s.concat(last?seq('attack',d,Math.max(0,ct-(i>0&&o.lastFrom!=null?o.lastFrom:3)),null,(o.lastSpeed||1.3)*sp):seq('attack',d,ct-2,ct+1,(o.midSpeed||3)*sp));}
  const ks=[];for(let i=0;i<n;i++)ks.push(seqIndex(s,'attack',ct,i));const ev=ks.map((kC,i)=>({t:seqTimeAt(s,kC),f:a=>o.f(a,i,i===n-1)}));
  const kL=ks[ks.length-1];return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,ks[0]),dur:seqTimeAt(s,kL+2),hitList:[],
    update:(a,dt)=>{player.glow={color:o.glow||RVC.silver,k:a.t<seqTimeAt(s,kL)?.6:Math.max(0,1-(a.t-seqTimeAt(s,kL))/.3)};o.update&&o.update(a,dt);},events:ev.concat(o.events||[])});}
function vBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||RVC.frost,events:tP=>[{t:tP,f:()=>o.f()}]});}
const vTip=()=>[player.x+Math.cos(player.phi)*22,player.y+Math.sin(player.phi)*22];

/* ---------- normal attack: rune spear thrusts (Muninn echoes them) ---------- */
function mkRvBasic(tgt){vEnsure();const lv=Math.max(1,vL('vnSpear')),chain=RB.vnSpear.chain[lv-1]+(vL('vxSpear')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),lunge=vL('vxSpear')&&last;
  return vThrusts({key:'basic',name:lunge?'Gungnir Combo':'Rune Spear '+(idx+1),phi,n:1,lastSpeed:last?1.15:2.1,glow:lunge?RVC.gold:RVC.silver,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+40+tgt.r)return;let d;
    if(lunge){addFx(new RvThrust({phi,len:RB.vxSpear.len,col:RVC.gold,w:11,life:.28}));const L=vLine(player.x,player.y,phi,RB.vxSpear.len);if(!L.includes(tgt))L.push(tgt);
      for(const e of L){const r=vHit(e,RB.vxSpear.dmg,'vxSpear',{big:true,knock:[phi,30]});if(e===tgt)d=r;vSpark(e,true,RVC.gold);}shake(1.6);stop(40);}
    else{addFx(new RvThrust({phi,len:Math.max(30,dist(player,tgt)-tgt.r*.4),col:RVC.silver,w:6}));d=vHit(tgt,RB.vnSpear.hit,'basic',{auto:true,knock:[phi,18]});vSpark(tgt,false,RVC.silver);shake(.7);stop(20);}
    if(d>0&&vL('vnEcho'))vEcho(tgt,vLv(RB.vnEcho.dmg,'vnEcho'),'vnEcho');
    a.hitList.push(tgt);a.hitConfirmed=true;}});}

/* ---------- BASIC ---------- */
function mkVnCloak(c){return vBurst({key:'vnCloak',name:'Feather Cloak',glow:RVC.violet,f:()=>{addBuff('vnCloak',RB.vnCloak.T);addBuff('rhSA',RB.vnCloak.T);vFeathers(player.x,player.y,16,{z:40,spd:150,up:90});addFx(new GRing({x:player.x,y:player.y,r0:10,r1:58,w:6,color:RVC.violet,life:.4}));}});}
function mkVnDive(c){const t=vTgt(c,RB.vnDive.range),phi=vPhi(c,t);faceTo(phi);const sx=player.x,sy=player.y,Lm=vLv(RB.vnDive.dist,'vnDive'),L=t?Math.min(Lm,dist(player,t)-t.r-8):Lm,[dx,dy]=vPathEnd(sx,sy,phi,Math.max(20,L)),T=.34,
    s=seq('walk',player.dir,0,null,seqTotal(seq('walk',player.dir,0,null,1))/(T+.15));
  return act({key:'vnDive',name:'Raven Dive',seq:s,windup:T,dur:T+.15,hitList:[],update:(a,dt)=>{dashUpd(a,dt,0,T,sx,sy,dx,dy,RVC.violet,72);if(a.t<T&&Math.random()<.5)vFeathers(player.x,player.y,1,{z:(player.z||0)+30,spd:30});},
    events:[{t:T,f:a=>{for(const e of vNear(player.x,player.y,RB.vnDive.R)){vHit(e,RB.vnDive.dmg,'vnDive',{big:e===t});applyCC(e,{flinch:.35});vSpark(e,e===t,RVC.silver);a.hitList.push(e);a.hitConfirmed=true;}
      addFx(new GRing({x:player.x,y:player.y,r0:8,r1:RB.vnDive.R+24,w:8,color:RVC.violet,life:.35}));vFeathers(player.x,player.y,10,{z:14,spd:150,up:70});shake(2);stop(40);}}]});}
function mkVnNights(c){return vBurst({key:'vnNights',name:'Nine Nights',glow:RVC.leaf,f:()=>{RV.nightsUntil=gameTime+RB.vnNights.T;addBuff('vnNights',RB.vnNights.T);delete player.buffs.dbSlow;
  addFx(new GRing({x:player.x,y:player.y,r0:10,r1:64,w:5,color:RVC.leaf,life:.45}));for(let i=0;i<9;i++)setFxTimer(.05*i,()=>vRuneRain(player.x,player.y,40,1));}});}
function mkVnEye(c){return vBurst({key:'vnEye',name:"Odin's Eye",glow:RVC.gold,f:()=>{const v=vLv(RB.vnEye.flat,'vnEye');for(const e of vNear(player.x,player.y,RB.vnEye.R)){const keep=e.vnEyeT>gameTime?(e.vnEyeV||0):0;e.vnEyeV=Math.max(keep,v);e.vnEyeT=gameTime+RB.vnEye.T;}
  addFx(new RvEye({x:player.x,y:player.y,R:RB.vnEye.R}));shake(1);}});}

/* ---------- A · Muninn, Keeper of Memory ---------- */
function mkVaThrust(c){const t=vTgt(c,RB.vaThrust.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=vLv(RB.vaThrust.dmg,'vaThrust'),C=vC('vaThrust',{mem:m*RB.vaThrust.n});
  return vThrusts({key:'vaThrust',name:'Memory Thrust',phi,n:RB.vaThrust.n,midSpeed:3.4,lastSpeed:1.8,lastFrom:1,glow:RVC.violet,f:(a,i,last)=>{if(t.dead||dist(player,t)>RB.vaThrust.range+t.r+30)return;
    addFx(new RvThrust({phi,len:Math.max(30,dist(player,t)-t.r*.3),col:RVC.violet2,w:7}));vHitA(t,m,'vaThrust',C,{big:last});vSpark(t,last,RVC.violet);a.hitList.push(t);a.hitConfirmed=true;shake(1);stop(26);}});}
/* Muninn stands beside the target and thrusts (the i-th replay comes from another side) */
function vMunAt(t,i){const a=Math.atan2(t.y-player.y,t.x-player.x)+Math.PI*.6+i*2.4,x=t.x+Math.cos(a)*(t.r+28),y=t.y+Math.sin(a)*(t.r+28);RV.munOv={x,y,t0:gameTime,T:.2,face:a+Math.PI,pose:'atk',e:t,snap:1};
  addFx(new RvThrust({x,y,phi:a+Math.PI,len:t.r+30,col:RVC.violet,w:8,life:.2}));}
function vNo(t){if(gameTime-(vNo.t||-9)<1)return;vNo.t=gameTime;setTimeout(()=>msg(t),0);}   /* after the engine's own 'no target' line */
function mkVaRecall(c){if(!RV.mem.length){vNo('มูนินยังไม่มีความทรงจำ — ใช้สกิลสาย A ให้โดนก่อน');return null;}const t=vTgt(c,RB.vaRecall.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return vBurst({key:'vaRecall',name:"Muninn's Recall",phi:angTo(t),speed:2.2,glow:RVC.violet,f:()=>{const mem=RV.mem.slice().reverse(),full=RV.mem.length>=vMemCap(),add=vLv(RB.vaRecall.dmg,'vaRecall'),gap=RB.vaRecall.gap,k=1/(ACTION_TEMPO||.75);RV.mem.length=0;
    mem.forEach((M,i)=>setFxTimer(.001+i*gap*k,()=>{if(t.dead)return;vMunAt(t,i);const L=M.aoe?vNear(t.x,t.y,100):[t];for(const e of L){vHit(e,M.m+add,'vaRecall',{big:e===t});vSpark(e,e===t,RVC.violet);}
      addFx(new DText({x:t.x,y:t.y,z:(t.boss?100:80)+i*12,text:M.name,color:RVC.violet2,size:11,life:.7}));shake(1.2);stop(30);}));
    if(full&&vL('vaVivid'))setFxTimer(.001+(mem.length*gap+.1)*k,()=>{const x=t.x,y=t.y;for(const e of vNear(x,y,RB.vaVivid.R))vHit(e,vLv(RB.vaVivid.dmg,'vaVivid'),'vaVivid',{big:true});vBurstFx(x,y,RB.vaVivid.R,RVC.violet,{feathers:18});shake(2.4);stop(60);});}});}
function mkVaSweep(c){const t=vTgt(c,RB.vaSweep.range),phi=vPhi(c,t),m=vLv(RB.vaSweep.dmg,'vaSweep'),C=vC('vaSweep',{mem:m,aoe:1}),R=RB.vaSweep.R;
  return vThrusts({key:'vaSweep',name:'Twin Crescent',phi,n:1,lastSpeed:1.2,glow:RVC.violet,f:a=>{addFx(new RvCrescent({phi,R,col:RVC.silver}));addFx(new RvCrescent({phi:phi+Math.PI,R,col:RVC.violet}));
    RV.munOv={x:player.x-Math.cos(phi)*30,y:player.y-Math.sin(phi)*30,t0:gameTime,T:.3,face:phi+Math.PI,pose:'atk'};const wing=vL('vaWing')>0;
    for(const e of vNear(player.x,player.y,R)){const an=angTo(e);vHitA(e,m,'vaSweep',C,wing?{knock:[an,e.boss?20:RB.vaWing.push*2]}:{});if(wing)applyCC(e,{slow:vLv(RB.vaWing.slow,'vaWing')});vSpark(e,false,RVC.violet);a.hitList.push(e);a.hitConfirmed=true;}
    vFeathers(player.x,player.y,8,{z:24,spd:160});shake(1.6);stop(30);}});}
function mkVaSwap(c){const t=vTgt(c,RB.vaSwap.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),sx=player.x,sy=player.y,[bx,by]=vPathEnd(t.x,t.y,phi,t.r+34),T=.16;
  const m=vLv(RB.vaSwap.dmg,'vaSwap'),mm=vLv(RB.vaSwap.mun,'vaSwap'),C=vC('vaSwap',{mem:m+mm,memN:vL('vaPincer')?2:1}),back=phi+Math.PI,dir2=atkDir(dirOf(back)),ct=CT(dir2);
  RV.munOv={x:bx,y:by,t0:gameTime,T:T,face:back,snap:1};vFeathers(bx,by,6,{z:30,spd:60});
  const s1=hold('walk',player.dir,0,T*1000),s2=seq('attack',dir2,Math.max(0,ct-2),null,1.5*aspd()),s=s1.concat(s2),kC=s1.length+seqIndex(s2,'attack',ct),tC=seqTimeAt(s,kC);
  return act({key:'vaSwap',name:'Shadow Swap',seq:s,windup:tC,dur:seqTimeAt(s,Math.min(s.length,kC+2)),hitList:[],
    update:(a,dt)=>{if(a.t<T+.12)player.iframes=Math.max(player.iframes||0,.05);dashUpd(a,dt,0,T,sx,sy,bx,by,RVC.violet,8);if(a.t>=T&&!a._sw){a._sw=1;faceTo(back);RV.munOv={x:sx,y:sy,t0:gameTime,T:.42,face:phi,pose:'atk',snap:1};}player.glow={color:RVC.violet,k:.6};},
    events:[{t:tC,f:a=>{if(t.dead)return;faceTo(Math.atan2(t.y-player.y,t.x-player.x));addFx(new RvThrust({phi:player.phi,len:Math.max(30,dist(player,t)),col:RVC.violet2,w:8}));
      const M=RV._v&&RV._v.m,mx=M?M.wx:sx,my=M?M.wy:sy;addFx(new RvThrust({x:mx,y:my,phi:Math.atan2(t.y-my,t.x-mx),len:Math.max(30,Math.hypot(t.x-mx,t.y-my)),col:RVC.violet,w:8}));
      vHitA(t,m,'vaSwap',C,{big:true});vHitA(t,mm,'vaSwap',C,{noEcho:1});vSpark(t,true,RVC.violet);vFeathers(t.x,t.y,8,{z:30,spd:120});applyCC(t,{flinch:.4});
      if(vL('vxPincer'))RV.pincer={e:t,until:gameTime+RB.vxPincer.T,last:0};a.hitList.push(t);a.hitConfirmed=true;shake(2);stop(50);}}]});}
function mkVaGungnir(c){const t=vTgt(c,RB.vaGungnir.range),phi=vPhi(c,t),m=vLv(RB.vaGungnir.dmg,'vaGungnir'),C=vC('vaGungnir',{mem:m});
  return vThrusts({key:'vaGungnir',name:'Gungnir Throw',phi,n:1,lastSpeed:1.1,glow:RVC.gold,f:a=>{const L=RB.vaGungnir.len,[x0,y0]=vTip();
    addFx(new RvSpear({x:x0,y:y0,phi,len:L,speed:900,onHit:e=>{vHitA(e,m,'vaGungnir',C,{big:true});vSpark(e,true,RVC.gold);a.hitConfirmed=true;},
      end:(x,y)=>{if(!vL('vaReturn'))return;RV.munOv={x,y,t0:gameTime,T:.45,face:phi+Math.PI,pose:'atk'};const dm=vLv(RB.vaReturn.dmg,'vaReturn');
        setFxTimer(.08,()=>addFx(new RvSpear({x,y,phi:phi+Math.PI,len:Math.max(0,Math.hypot(x-player.x,y-player.y)-40),speed:900,col:RVC.violet,mun:1,onHit:e=>{vHit(e,dm,'vaReturn');vSpark(e,false,RVC.violet);}})));}}));shake(1.4);}});}
function mkVaParry(c){const T=RB.vaParry.T,s=hold('buff',player.dir,2,T*1000);RV.parryUntil=gameTime+T+.05;
  return act({key:'vaParry',name:'Wing Parry',seq:s,windup:0,dur:T,hitList:[],update:()=>{player.glow={color:RVC.violet,k:.6};}});}
function mkVaValhalla(c){const n=RB.vaValhalla.n,gap=.12,R=RB.vaValhalla.R;
  return buffAct({key:'vaValhalla',name:'Memories of Valhalla',speed:1.4,glow:RVC.violet,events:tP=>{const k=1/(ACTION_TEMPO||.75);return [{t:.02,f:()=>{skyDarkT=.6;}},{t:tP,f:()=>{
    for(let i=0;i<n;i++)setFxTimer(.001+i*gap*k,()=>{const L=vNear(player.x,player.y,R).sort((a,b)=>dist(a,player)-dist(b,player));if(!L.length)return;const e=L[i%L.length];addFx(new RvPhantom({e,an:i*2.4}));
      setFxTimer(.08,()=>{if(e.dead)return;const m=vLv(RB.vaValhalla.dmg,'vaValhalla');vHit(e,m,'vaValhalla',i?{big:true,dot:1}:{big:true});vSpark(e,false,RVC.gold);for(const q of vNear(e.x,e.y,RB.vaValhalla.sp))if(q!==e)vHit(q,m,'vaValhalla',{dot:1});});});
    setFxTimer((n*gap+.2)*k,()=>{skyDarkT=0;const x=player.x,y=player.y;RV.munOv={x:x+Math.cos(player.phi)*30,y:y+Math.sin(player.phi)*30,t0:gameTime,T:.4,face:player.phi,pose:'atk'};
      for(const e of vNear(x,y,R))vHit(e,RB.vaValhalla.fin,'vaValhalla',{big:true});vBurstFx(x,y,R,RVC.violet,{feathers:26,gold:1});addFx(new DText({x,y,z:120,text:'VALHALLA',color:RVC.gold,size:16,life:1}));shake(3.5);stop(70);
      if(vL('vaEternal')){RV.mem.length=0;for(let j=0;j<vMemCap();j++)RV.mem.push({key:'vaValhalla',name:'Valhalla',m:RB.vaEternal.m,aoe:0,t:gameTime});RV.memPop=1;}});}}];}});}

/* ---------- B · Huginn, Thought of Odin ---------- */
function vBolt(x,y,z,tgt,phi,onHit,hug){addFx(new RvBolt({x,y,z,e:tgt,phi,onHit,col:hug?RVC.frost:'#cfeeff'}));}
function mkVbBolt(c){const t=vTgt(c,RB.vbBolt.range),phi=vPhi(c,t),m=vLv(RB.vbBolt.dmg,'vbBolt'),cp=vLv(RB.vbBolt.copy,'vbBolt'),C=vC('vbBolt');
  return vThrusts({key:'vbBolt',name:'Rune Bolt',phi,n:1,lastSpeed:1.4,glow:RVC.frost,f:a=>{const [x0,y0]=vTip();vBolt(x0,y0,42,t,phi,e=>{vHitB(e,m,'vbBolt',C);a.hitConfirmed=true;},0);
    const n=vL('vxTwin')?2:1;for(let i=0;i<n;i++)setFxTimer(.06+i*.12,()=>{const h=vHugTgt(RB.vbBolt.range+60,i?t:null);if(!h)return;const [hx,hy]=vHugXY();vHugCast();vBolt(hx,hy,62,h,Math.atan2(h.y-hy,h.x-hx),e=>vHitB(e,cp,'vbBolt',C),1);});}});}
function mkVbFlight(c){const t=vTgt(c,RB.vbFlight.range),x=c&&c.gx!=null?c.gx:(t?t.x:player.x+Math.cos(player.phi)*160),y=c&&c.gy!=null?c.gy:(t?t.y:player.y+Math.sin(player.phi)*160),C=vC('vbFlight');
  return vBurst({key:'vbFlight',name:"Huginn's Flight",phi:Math.atan2(y-player.y,x-player.x),speed:2.2,glow:RVC.frost,f:()=>{vSendHug(x,y,RV_BAL.hug.perch,()=>{const [hx,hy]=vHugXY();vHugCast();
    for(const e of vNear(hx,hy,RB.vbFlight.R))vHitB(e,vLv(RB.vbFlight.dmg,'vbFlight'),'vbFlight',C,{big:true});vBurstFx(hx,hy,RB.vbFlight.R,RVC.frost,{runes:2});if(vL('vxSwift'))vCarve(1);shake(1.2);});
    if(vL('vxSwift'))setFxTimer(.01,()=>{if(player.cd.vbFlight>0)player.cd.vbFlight=Math.max(0,player.cd.vbFlight-RB.vxSwift.cdr);});}});}
function vCircleAt(x,y,R,m,C,hug){addFx(new RvCircle({x,y,R,T:RB.vbCircle.delay,col:hug?RVC.frost:'#a9e6ff',boom:()=>{for(const e of vNear(x,y,R)){vHitB(e,m,'vbCircle',C,{big:!hug});
  if(vL('vbBind')){const s=vLv(RB.vbBind.root,'vbBind');if(e.boss)applyCC(e,{slow:s*1.5});else e.st.root=Math.max(e.st.root||0,s);}}shake(1.2);}}));}
function mkVbCircle(c){const t=vTgt(c,RB.vbCircle.range),x=c&&c.gx!=null?c.gx:(t?t.x:player.x+Math.cos(player.phi)*140),y=c&&c.gy!=null?c.gy:(t?t.y:player.y+Math.sin(player.phi)*140),C=vC('vbCircle'),R=RB.vbCircle.R;
  return vBurst({key:'vbCircle',name:'Rune Circle',phi:Math.atan2(y-player.y,x-player.x),speed:2,glow:RVC.frost,f:()=>{vCircleAt(x,y,R,vLv(RB.vbCircle.dmg,'vbCircle'),C,0);
    const h=vHugTgt(RB.vbCircle.range);if(h){vHugCast();vCircleAt(h.x,h.y,R*.8,vLv(RB.vbCircle.copy,'vbCircle'),C,1);}}});}
function mkVbStorm(c){return vBurst({key:'vbStorm',name:'Thought Storm',speed:2,glow:RVC.frost,f:()=>{vHugCast();const big=vL('vbGale')>0;
  RV.storm={t0:gameTime,until:gameTime+RB.vbStorm.T+(vL('vxMaelstrom')?RB.vxMaelstrom.T:0),tk:0,R:RB.vbStorm.R*(big?RB.vbGale.scale:1),slow:big,m:vLv(RB.vbStorm.dmg,'vbStorm'),pull:vL('vxMaelstrom')>0};}});}
function mkVbTether(c){return vBurst({key:'vbTether',name:'Rune Tether',speed:2,glow:RVC.frost,f:()=>{let wait=0;if(!(RV.hug&&RV.hug.until>gameTime)){const [x,y]=vPathEnd(player.x,player.y,player.phi,200);vSendHug(x,y,RB.vbTether.T+.6,null);wait=RV_BAL.hug.fly;}
  else if(RV.hug.until<gameTime+RB.vbTether.T+.3)RV.hug.until=gameTime+RB.vbTether.T+.3;RV.tether={until:gameTime+wait+RB.vbTether.T,tk:0,m:vLv(RB.vbTether.dmg,'vbTether')};vHugCast();}});}
function mkVbWard(c){return vBurst({key:'vbWard',name:'Algiz Ward',glow:RVC.frost,f:()=>{RV.ward=RB.vbWard.n;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:56,w:6,color:RVC.frost,life:.4}));}});}
function mkVbRunes(c){const n=RB.vbRunes.n,R=RB.vbRunes.R,gap=RB.vbRunes.gap;
  return buffAct({key:'vbRunes',name:'Runes of the Allfather',speed:1.4,glow:RVC.frost,events:tP=>{const k=1/(ACTION_TEMPO||.75);return [{t:.02,f:()=>{skyDarkT=.6;RV.hugSoar=gameTime+2.2;}},{t:tP,f:()=>{const cx=player.x,cy=player.y,C=vC('vbRunes');vHugCast();
    for(let i=0;i<n;i++){const an=i/n*TAU-Math.PI/2,x=cx+Math.cos(an)*R*.72,y=cy+Math.sin(an)*R*.72,T=.25+i*gap*k;addFx(new RvRuneMark({x,y,g:i,T}));
      setFxTimer(T,()=>{const L=vNear(cx,cy,R);let e=null,bd=1e9;for(const q of L){const dd=Math.hypot(q.x-x,q.y-y);if(dd<bd){bd=dd;e=q;}}if(e){const m=vLv(RB.vbRunes.dmg,'vbRunes');addFx(new RvZap({a:[x,y,26],e}));vHitB(e,m,'vbRunes',C,i?{big:true,dot:1}:{big:true});for(const q of vNear(e.x,e.y,RB.vbRunes.sp))if(q!==e)vHit(q,m*.6,'vbRunes',{dot:1});vBurstFx(e.x,e.y,RB.vbRunes.sp,RVC.frost);}vBurstFx(x,y,44,RVC.frost);shake(.9);});}
    setFxTimer(.25+(n*gap+.3)*k,()=>{skyDarkT=0;if(!vL('vbFinal'))return;const [x,y]=vHugXY();addFx(new RvGreatRune({x,y,R:RB.vbFinal.R,delay:.3,g:7,boom:()=>{for(const e of vNear(x,y,RB.vbFinal.R))vHit(e,RB.vbFinal.dmg,'vbFinal',{big:true});shake(3);stop(70);vCarve(3);}}));});}}];}});}

/* ---------- C · Herald of the Allfather ---------- */
function mkVxHaunt(c){const t=vTgt(c,RB.vxHaunt.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return vBurst({key:'vxHaunt',name:'Haunting Memory',phi:angTo(t),speed:2.2,glow:RVC.violet,f:()=>{RV.haunt={e:t,until:gameTime+RB.vxHaunt.T,n:RB.vxHaunt.n,last:0};vMunAt(t,0);vFeathers(t.x,t.y,10,{z:40,spd:90});addFx(new DText({x:t.x,y:t.y,z:96,text:'HAUNT',color:RVC.violet2,size:13,life:.8}));}});}
function mkVxYgg(c){return vBurst({key:'vxYgg',name:'Yggdrasil Vigil',speed:1.6,glow:RVC.leaf,f:()=>{addBuff('vxYgg',RB.vxYgg.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:80,w:7,color:RVC.leaf,life:.5}));addFx(new RvPillar({x:player.x,y:player.y,R:70,col:RVC.leaf,H:220}));}});}
function mkVxAllfather(c){return vBurst({key:'vxAllfather',name:"Allfather's Gaze",speed:1.4,glow:RVC.gold,f:()=>{addBuff('vxAllfather',RB.vxAllfather.T);addFx(new RvEye({x:player.x,y:player.y,R:RB.vxAllfather.R,life:1}));
  addFx(new DText({x:player.x,y:player.y,z:126,text:"ALLFATHER'S GAZE",color:RVC.gold,size:15,life:1.1}));vFeathers(player.x,player.y,14,{z:50,spd:120,up:80});vBurstFx(player.x,player.y,120,RVC.gold,{runes:3});shake(2.6);}});}
function mkVxGungnir(c){const t=vTgt(c,RB.vxGungnir.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return vBurst({key:'vxGungnir',name:'Gungnir, Spear of Odin',phi,speed:1.5,glow:RVC.gold,f:()=>{const n=RV.mem.length;RV.mem.length=0;const m=RB.vxGungnir.dmg+RB.vxGungnir.per*n,[x0,y0]=vTip();
    addFx(new RvSpear({x:x0,y:y0,phi,home:t,speed:1100,big:1,col:RVC.gold,onHit:e=>{vHit(t,m,'vxGungnir',{big:true,sure:true});for(const q of vNear(t.x,t.y,RB.vxGungnir.R))if(q!==t)vHit(q,RB.vxGungnir.splash,'vxGungnir',{sure:true});
      vBurstFx(t.x,t.y,RB.vxGungnir.R,RVC.gold,{gold:1,feathers:n*4});if(n)addFx(new DText({x:t.x,y:t.y,z:104,text:'MEMORY ×'+n,color:RVC.violet2,size:13,life:.9}));shake(3);stop(80);}}));}});}
/* the verse falls where Huginn is: perched → there; at the shoulder → he first flies to the target (perches 3 s) */
function mkVxHavamal(c){const t=vTgt(c,RB.vxHavamal.range);return vBurst({key:'vxHavamal',name:'Havamal Verse',phi:t?angTo(t):null,speed:1.5,glow:RVC.frost,f:()=>{const n=RV.runes;RV.runes=0;RV.runeN=0;const m=RB.vxHavamal.dmg+RB.vxHavamal.per*n;
  const drop=()=>{const [x,y]=vHugXY();vHugCast();addFx(new RvGreatRune({x,y,R:RB.vxHavamal.R,delay:.35,g:0,boom:()=>{for(const e of vNear(x,y,RB.vxHavamal.R))vHit(e,m,'vxHavamal',{big:true});shake(3.4);stop(80);if(n)addFx(new DText({x,y,z:112,text:'RUNES ×'+n,color:RVC.frost2,size:13,life:.9}));}}));};
  if(!(RV.hug&&RV.hug.until>gameTime)&&t){vSendHug(t.x,t.y,3,drop);}else drop();}});}

const RV_MAKE={vnCloak:mkVnCloak,vnDive:mkVnDive,vnNights:mkVnNights,vnEye:mkVnEye,
  vaThrust:mkVaThrust,vaRecall:mkVaRecall,vaSweep:mkVaSweep,vaSwap:mkVaSwap,vaGungnir:mkVaGungnir,vaParry:mkVaParry,vaValhalla:mkVaValhalla,
  vbBolt:mkVbBolt,vbFlight:mkVbFlight,vbCircle:mkVbCircle,vbStorm:mkVbStorm,vbTether:mkVbTether,vbWard:mkVbWard,vbRunes:mkVbRunes,
  vxHaunt:mkVxHaunt,vxYgg:mkVxYgg,vxAllfather:mkVxAllfather,vxGungnir:mkVxGungnir,vxHavamal:mkVxHavamal};
const RV_ZIGZAG=[['vaThrust','vaRecall'],['vbBolt','vbFlight']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function ravenAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['vxYgg','vnNights','vnCloak','vbWard'])if(ready(k)&&!hasBuff(k)&&!(k==='vbWard'&&RV.ward>0)&&!(k==='vnNights'&&RV.nightsUntil>gameTime))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=vNear(player.x,player.y,220),mag=D.mag>D.patk;
  if((t.boss||near.length>=3)&&ready('vxAllfather')&&!vAll())return cast('vxAllfather');
  if((t.boss||near.length>=2)&&ready('vnEye')&&!(t.vnEyeT>gameTime)&&d<RB.vnEye.R)return cast('vnEye');
  if(mag){if((t.boss||near.length>=3)&&ready('vbRunes'))return cast('vbRunes');
    if(!(RV.hug&&RV.hug.until>gameTime)&&ready('vbFlight')&&d<=RB.vbFlight.range+t.r)return cast('vbFlight');
    if(RV.runes>=2&&ready('vxHavamal'))return cast('vxHavamal');
    for(const k of ['vbStorm','vbTether','vbCircle','vbBolt'])if(ready(k)&&!(k==='vbStorm'&&RV.storm)&&!(k==='vbTether'&&RV.tether)&&d<=(SKILLS[k].range||300)+t.r)return cast(k);
    return false;}
  if((t.boss||near.length>=3)&&ready('vaValhalla'))return cast('vaValhalla');
  if(d>150&&ready('vnDive'))return cast('vnDive');
  if(t.boss&&ready('vxHaunt')&&!(RV.haunt&&RV.haunt.until>gameTime))return cast('vxHaunt');
  if(RV.mem.length>=vMemCap()){for(const k of ['vxGungnir','vaRecall'])if(ready(k)&&d<=(SKILLS[k].range||200)+t.r)return cast(k);}
  for(const k of ['vaSwap','vaGungnir','vaSweep','vaThrust'])if(ready(k)&&d<=(SKILLS[k].range||120)+t.r)return cast(k);
  return false;}

function installRaven(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of RV_DEFS){const b=RB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:vIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'odin_raven'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(RV_MAKE[d.key])sk.make=RV_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${RV_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of RV_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* damage type: Basic column = higher of ATK / MATK, A = ATK, B = MATK; Muninn's echoes copy physical spear work → ATK */
  Object.assign(SK_DT,{vnEcho:'p',vnDive:'b',vxSpear:'b',vxMirror:'b',vaShadow:'p',vaVivid:'p',vaReturn:'p',vaParry:'p',vaRecall:'p',vxHaunt:'p',vxPincer:'p',vxGungnir:'p',
    vbScribe:'m',vbPerch:'m',vbSnap:'m',vbFinal:'m',vxHavamal:'m'});
  Object.assign(SK_CC,{vnDive:{flinch:.35},vaSweep:{flinch:.3},vaSwap:{flinch:.4},vaGungnir:{flinch:.3},vaValhalla:{flinch:.3},vaVivid:{flinch:.4},vaParry:{flinch:.6},
    vbFlight:{flinch:.25},vbCircle:{flinch:.35},vbRunes:{flinch:.3},vbScribe:{flinch:.3},vbFinal:{air:1},vbSnap:{flinch:.35},vxGungnir:{air:1},vxHavamal:{air:1}});
  Object.assign(SK_KO,{basic:1,vnEcho:.6,vnDive:2.4,vaThrust:1.2,vaShadow:.6,vaRecall:1.4,vaVivid:2,vaSweep:1.4,vaSwap:2.2,vaGungnir:2,vaReturn:1,vaParry:2.4,vaValhalla:1.4,
    vbBolt:1,vbScribe:1.6,vbFlight:1.2,vbPerch:.3,vbCircle:1.6,vbStorm:.5,vbTether:.4,vbSnap:2,vbRunes:1.6,vbFinal:3,vxSpear:2,vxHaunt:.6,vxPincer:.6,vxMirror:.8,vxGungnir:4,vxHavamal:3});
  TABS.length=0;TABS.push({n:'Muninn',keys:['vaThrust','vaRecall','vaSweep','vaSwap','vaGungnir','vaParry','vaValhalla','vnDive','vnCloak','vnEye']},
    {n:'Huginn',keys:['vbBolt','vbFlight','vbCircle','vbStorm','vbTether','vbWard','vbRunes','vnDive','vnCloak','vnEye']},
    {n:'Allfather',keys:['vxHaunt','vxGungnir','vxHavamal','vxAllfather','vxYgg','vnNights','vnDive','vnCloak','vnEye']});
  Object.assign(BUFFDEF,{vnCloak:{n:'Feather Cloak',c:RVC.violet,i:'CLOAK'},vnNights:{n:'Nine Nights',c:RVC.leaf,i:'REST'},vxYgg:{n:'Yggdrasil Vigil',c:RVC.leaf,i:'YGG'},
    vxAllfather:{n:"Allfather's Gaze",c:RVC.gold,i:'ODIN'},rvMem:{n:'ความทรงจำของมูนิน',c:RVC.violet,i:'MEM'},rvRune:{n:'รูนของฮูกิน',c:RVC.frost,i:'RUNE'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Wanderer Fledgling';JOB.hpA=1.5;JOB.hpB=5.5;JOB.spB=3.2;
  ITEMS.wanderersRuneSpear={n:"Wanderer's Rune Spear",slot:'rhand',two:1,kind:'Spear',atk:140,matk:130,wlv:3,aspd:156,ref:6,cards:2,w:140,b:{dex:2},size:{small:.75,medium:1,large:1},d:'หอกรูนของผู้พเนจร DEX +2'};
  ITEMS.gungnirReplica={n:'Gungnir Replica',slot:'rhand',two:1,kind:'Spear',atk:150,matk:160,wlv:4,aspd:154,ref:4,cards:1,w:150,b:{int:3},size:{small:.75,medium:1,large:1},d:'หอกจำลองกุงนีร์ของโอดิน INT +3'};
  EQ.rhand='wanderersRuneSpear';INV.length=0;INV.push('gungnirReplica','vikinghelm','ringPrec','clipLuck');
  /* Mimir's Well: flat max SP (level × n) */
  if(typeof applyStats==='function'&&!applyStats._raven){const _as=applyStats;applyStats=function(){_as.apply(this,arguments);const f=vL('vnMimir')?Math.round(PS.lv*vLv(RB.vnMimir.sp,'vnMimir')):0;
    if(f>0){const r=player.mp/Math.max(1,player.maxMp);player.maxMp+=f;if(D)D.maxSp=player.maxMp;player.mp=Math.min(player.maxMp,Math.round(player.maxMp*r));}};applyStats._raven=1;}
  /* flat ATK / MATK bonuses */
  const flat=(e,o)=>{let b=0;const mg=o&&o.magic;
    if(hasBuff('vxYgg'))b+=RB.vxYgg.flat;
    if(e&&e.vnEyeT>gameTime)b+=e.vnEyeV||0;
    if(!mg){if(vL('vaWar'))b+=RV.mem.length*vLv(RB.vaWar.atk,'vaWar');}
    else if(vL('vbMind'))b+=RV.runes*vLv(RB.vbMind.matk,'vbMind');
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+Math.min(flat(e,o),base))/base;};   // a flat bonus adds at most the hit's own power (2026-11-22 rule)
  window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{const melee=e&&!e.dead&&dist(player,e)<e.r+90;
    /* Wing Parry: catch a melee blow, thrust back, remember it */
    if(RV.parryUntil>gameTime&&melee){RV.parryUntil=0;faceTo(angTo(e));vHit(e,RB.vaParry.dmg,'vaParry',{big:true});vRec('vaParry',RB.vaParry.dmg,{e});vSpark(e,true,RVC.violet);vFeathers(player.x,player.y,10,{z:40,spd:120});
      addFx(new DText({x:player.x,y:player.y,z:90,text:'PARRY',color:RVC.violet2,size:13,life:.8}));return 0;}
    /* Algiz Ward blocks a whole hit and carves a rune */
    if(RV.ward>0){RV.ward--;vCarve(1);addFx(new DText({x:player.x,y:player.y,z:90,text:'ALGIZ',color:RVC.frost2,size:12,life:.7}));vSparks(player.x,player.y,40,5,RVC.frost);return 0;}
    let r=0;
    if(hasBuff('vnCloak')){r+=vLv(RB.vnCloak.block,'vnCloak');if(vL('vxMirror')&&melee){vEcho(e,RB.vxMirror.dmg,'vxMirror',{delay:.12});}}
    return Math.max(1,d-r);};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.ravenAutoTick=ravenAutoTick;
  mkBasic=mkRvBasic;vEnsure();
  for(const k in SKILLS){const sk=SKILLS[k];if(sk.make&&!sk.make._vE){const mk=sk.make;sk.make=function(){vEnsure();return mk.apply(this,arguments);};sk.make._vE=1;}}
  try{document.title="Totem Legend — Odin's Raven";const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent="Odin's Raven";if(cl)cl.textContent='Wanderer Fledgling';}catch(e){}
  window.RV=RV;window.RV_DEFS=RV_DEFS;window.RV_BAL=RV_BAL;window.vCol=vCol;
  /* dev tools (tools/skill_shapes_probe.js): forget what earlier casts left behind (memory, runes, Huginn's perch, storm, tether …) */
  window.heroShapeReset=()=>{Object.assign(RV,{mem:[{key:'vaThrust',name:'Memory Thrust',m:1,aoe:0,t:gameTime}],runes:0,runeN:0,runeT:-99,hug:null,storm:null,tether:null,haunt:null,pincer:null,ward:0,parryUntil:0,nightsUntil:0,munOv:null,burstPend:0});};}

/* =====================================================================
   7. ICONS (code SVG until painted ones exist in assets/icons/raven — set RV_ICONS_PAINTED then)
   ===================================================================== */
const RV_ICONS_PAINTED=false;
if(!RV_ICONS_PAINTED)window.EX_ICON_SKIP=Object.assign(window.EX_ICON_SKIP||{},{raven:1});   /* skill_enh.js: no painted ex_ icons to look for yet */
function vIconSpec(d){const k=d.key,br=d.br,col=br==='A'?'#c8a8ff':br==='B'?'#a8e8ff':br==='C'?'#ffe9a8':'#e8eef8',bg=br==='A'?'#24123a':br==='B'?'#0c2238':br==='C'?'#2a2214':'#1e2230';
  const ink='#120a1c',gold='#ffd36a',vio='#b48cff',frost='#9fe4ff',wood='#8a6a3a',L=(a,b,c,e,cl=col,w=2.6,x='')=>`<path d="M${a} ${b} L${c} ${e}" stroke="${cl}" stroke-width="${w}" stroke-linecap="round" fill="none" ${x}/>`;
  /* building blocks (44 × 44 box) */
  const spear=(x1,y1,x2,y2,hc=col,sc=wood,w=3)=>{const a=Math.atan2(y2-y1,x2-x1),ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,bx=x2-ux*10,by=y2-uy*10;
    return L(x1,y1,bx,by,sc,w)+`<path d="M${bx+nx*.5} ${by+ny*.5} Q${bx+ux*3+nx*4.6} ${by+uy*3+ny*4.6} ${x2} ${y2} Q${bx+ux*3-nx*4.6} ${by+uy*3-ny*4.6} ${bx-nx*.5} ${by-ny*.5} Z" fill="${hc}" stroke="${ink}" stroke-width="1"/>`;};
  const feather=(x,y,len,ang,c=col)=>`<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M${-len/2} 0 Q${-len*.05} ${-len*.26} ${len/2} 0 Q${-len*.05} ${len*.26} ${-len/2} 0 Z" fill="${c}" stroke="${ink}" stroke-width="1"/><path d="M${-len*.6} 0 L${len*.42} 0" stroke="#fff" stroke-opacity=".5" stroke-width=".9"/></g>`;
  const raven=(x,y,s,c='#141018',rim=col,ang=0,fl=0)=>`<g transform="translate(${x} ${y}) rotate(${ang}) scale(${fl?-s:s} ${s})"><path d="M-15 4 Q-9 -6 2 -6 Q5 -10 10 -9 L19 -6 L10 -3 Q10 6 0 8 Q-8 10 -15 4 Z M-14 3 L-22 8 L-21 1 Z M-3 -3 Q-7 -17 -19 -17 Q-14 -8 -12 2 Z" fill="${c}" stroke="${rim}" stroke-width="${1.4/s}" stroke-linejoin="round"/><circle cx="6" cy="-6" r="${1.5/s}" fill="${gold}"/></g>`;
  const rune=(g,cx=22,cy=22,sz=10,c=col,w=2.8)=>{const R=RV_RUNES[((g%RV_RUNES.length)+RV_RUNES.length)%RV_RUNES.length];return `<path d="${R.map(([a,b,c2,e])=>`M${(cx+a*sz).toFixed(1)} ${(cy+b*sz).toFixed(1)} L${(cx+c2*sz).toFixed(1)} ${(cy+e*sz).toFixed(1)}`).join(' ')}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;};
  const eye=(cx=22,cy=22,s=1,c=gold)=>`<path d="M${cx-14*s} ${cy} Q${cx} ${cy-13*s} ${cx+14*s} ${cy} Q${cx} ${cy+13*s} ${cx-14*s} ${cy} Z" fill="#fff4d0" stroke="#5a3a06" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${5.5*s}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${2.4*s}" fill="${ink}"/>`;
  const tree=(c=col)=>L(22,38,22,16,c,3)+L(22,24,13,16,c)+L(22,21,31,12,c)+L(22,29,12,25,c)+L(22,28,32,23,c)+L(22,38,14,41,c,2.2)+L(22,38,30,41,c,2.2)+`<circle cx="22" cy="13" r="5" fill="none" stroke="${c}" stroke-width="2"/>`;
  const ring=(r=13,c=col,w=2.4,x='')=>`<circle cx="22" cy="22" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" ${x}/>`;
  const cres=(a0,a1,r,c=col,w=3.2)=>{const p=(a)=>[22+Math.cos(a)*r,22+Math.sin(a)*r];const [x0,y0]=p(a0),[x1,y1]=p(a1);return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;};
  const spiral=(c=col)=>`<path d="M22 22 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a9 9 0 1 1 -9 -9 a13 13 0 1 1 13 13" stroke="${c}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
  const zig=(x1,y1,x2,y2,c=frost,n=5)=>{let d=`M${x1} ${y1}`;for(let i=1;i<n;i++){const t=i/n,j=(i%2?1:-1)*3.5,dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy);d+=` L${(x1+dx*t-dy/l*j).toFixed(1)} ${(y1+dy*t+dx/l*j).toFixed(1)}`;}d+=` L${x2} ${y2}`;return `<path d="${d}" stroke="${c}" stroke-width="2.4" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="#fff" stroke-width=".9" fill="none"/>`;};
  const valknut=(c=gold)=>{const tri=(cx,cy)=>`<path d="M${cx} ${cy-8} L${cx+7} ${cy+4.5} L${cx-7} ${cy+4.5} Z" fill="none" stroke="${c}" stroke-width="2.3" stroke-linejoin="round"/>`;return tri(22,17)+tri(17.5,25)+tri(26.5,25);};
  const shield=(c=col)=>`<path d="M22 7 L35 12 Q35 30 22 38 Q9 30 9 12 Z" fill="${bg}" stroke="${c}" stroke-width="2.2"/>`;
  const star=(cx,cy,r,c='#fff')=>`<path d="M${cx} ${cy-r} L${cx+r*.25} ${cy-r*.25} L${cx+r} ${cy} L${cx+r*.25} ${cy+r*.25} L${cx} ${cy+r} L${cx-r*.25} ${cy+r*.25} L${cx-r} ${cy} L${cx-r*.25} ${cy-r*.25} Z" fill="${c}"/>`;
  const speed=(c=col)=>L(5,14,13,14,c,1.6,'stroke-opacity=".7"')+L(3,20,12,20,c,1.6,'stroke-opacity=".7"')+L(6,26,13,26,c,1.6,'stroke-opacity=".7"');
  const G={
    vnSpear:spear(9,35,37,7),
    vnEcho:spear(13,38,37,12,vio,'#4a3070')+spear(7,33,31,7),
    vnCloak:feather(14,24,20,-120)+feather(22,20,22,-90)+feather(30,24,20,-60)+feather(22,30,18,-90,'#3a2a5a'),
    vnDive:raven(24,23,.78,'#141018',col,38)+L(8,8,14,14,col,1.6)+L(14,5,19,11,col,1.6)+`<path d="M14 36 Q22 32 30 36" stroke="${col}" stroke-width="1.6" fill="none"/>`,
    vnNights:tree()+`<path d="M33 9 A6 6 0 1 0 38 16 A5 5 0 1 1 33 9 Z" fill="${gold}"/>`,
    vnMimir:`<ellipse cx="22" cy="30" rx="13" ry="5" fill="#0e2a3a" stroke="${col}" stroke-width="2"/><path d="M9 30 V22 M35 30 V22" stroke="${col}" stroke-width="2"/><ellipse cx="22" cy="22" rx="13" ry="5" fill="#1d5a78" stroke="${col}" stroke-width="2"/>`+eye(22,12,.55,'#7fd8ff'),
    vnEye:eye(),
    vaThrust:spear(8,30,38,14)+spear(8,38,36,24,vio),
    vaShadow:raven(27,26,.72,'#3a2266',vio)+raven(19,19,.72),
    vaRecall:`<path d="M33 14 A13 13 0 1 0 35 25" stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M35 9 L33 15 L39 16" stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`+feather(22,22,14,-50,vio)+feather(18,28,10,-80,vio),
    vaVivid:star(22,22,15,vio)+feather(10,10,10,45)+feather(34,10,10,135)+feather(10,34,10,-45)+feather(34,34,10,-135),
    vaSweep:cres(-2.6,.2,14)+cres(.55,3.35,10,vio),
    vaWing:`<path d="M8 30 Q14 12 36 8 Q30 16 33 18 Q26 20 29 24 Q22 26 24 30 Q16 30 8 30 Z" fill="${col}" stroke="${ink}" stroke-width="1.2"/>`+L(4,36,14,36,col,1.6)+L(6,40,16,40,col,1.6),
    vaSwap:`<path d="M10 16 H32 M28 11 L33 16 L28 21" stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M34 28 H12 M16 23 L11 28 L16 33" stroke="${vio}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+raven(22,38,.45,'#141018',col),
    vaPincer:spear(7,37,35,9)+spear(37,37,9,9,vio,'#4a3070'),
    vaGungnir:L(4,30,18,22,col,1.4,'stroke-opacity=".6"')+L(4,36,16,29,col,1.4,'stroke-opacity=".6"')+spear(12,32,39,8,col,wood,3.2),
    vaReturn:spear(8,30,36,16)+`<path d="M36 26 Q30 38 14 36" stroke="${vio}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M18 32 L13 36 L18 40" stroke="${vio}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    vaWar:spear(6,38,34,6,col,wood,2.4)+spear(38,38,10,6,col,wood,2.4)+raven(23,25,.62),
    vaParry:`<path d="M10 34 Q8 14 22 8 Q36 14 34 34 Q28 28 22 30 Q16 28 10 34 Z" fill="${col}" stroke="${ink}" stroke-width="1.2"/>`+L(22,10,22,29,ink,1)+L(15,14,18,30,ink,.8)+L(29,14,26,30,ink,.8)+star(37,7,5,gold),
    vaValhalla:valknut(gold),
    vaEternal:ring(15,vio,2)+valknut(col),
    vbBolt:`<path d="M18 12 L4 40 L32 26 Z" fill="${frost}" opacity=".35"/><path d="M21 16 L9 36 L29 24 Z" fill="#fff" opacity=".3"/><circle cx="25" cy="19" r="10" fill="#1b4a6a" stroke="${frost}" stroke-width="1.6"/>`+rune(0,25,19,6,'#fff',2.2),
    vbScribe:rune(0,13,30,6)+rune(1,31,30,6)+rune(2,22,12,6)+`<path d="M13 30 L22 12 L31 30 Z" fill="none" stroke="${col}" stroke-opacity=".45" stroke-width="1.2"/>`,
    vbFlight:raven(23,20,.82,'#d8f4ff',frost,-12)+L(22,40,22,32,col,1.6)+L(16,40,18,33,col,1.4)+L(28,40,26,33,col,1.4),
    vbPerch:`<rect x="12" y="30" width="20" height="9" rx="2" fill="#2a4a5a" stroke="${col}" stroke-width="1.6"/>`+rune(1,22,34.5,3.4,col,1.6)+raven(23,21,.68,'#d8f4ff',frost),
    vbCircle:ring(14)+ring(10,col,1.2)+rune(4,22,22,7),
    vbBind:ring(13)+`<path d="M8 14 Q22 22 36 30 M8 30 Q22 22 36 14" stroke="#9aa6b8" stroke-width="2" fill="none" stroke-dasharray="3 2"/>`+rune(1,22,22,6),
    vbStorm:spiral(),
    vbGale:spiral(frost)+star(33,11,5,'#fff')+star(10,33,4,'#fff'),
    vbTether:`<circle cx="9" cy="33" r="4" fill="${col}"/><circle cx="35" cy="11" r="4" fill="${frost}"/>`+zig(11,31,33,13),
    vbSnap:zig(6,36,18,24)+zig(26,20,38,8)+star(22,22,7,'#fff'),
    vbMind:`<path d="M12 34 Q8 22 14 14 Q22 6 31 11 Q37 16 34 24 L36 30 L31 30 L30 35 Z" fill="#0f3550" stroke="${col}" stroke-width="1.8"/>`+rune(6,23,21,6),
    vbWard:shield()+rune(1,22,22,8),
    vbRunes:(()=>{let h='';for(let i=0;i<9;i++){const a=i/9*Math.PI*2-Math.PI/2;h+=rune(i,22+Math.cos(a)*14,22+Math.sin(a)*14,3,col,1.4);}return h+rune(0,22,22,6,'#fff',2.4);})(),
    vbFinal:(()=>{let h='';for(let i=0;i<8;i++){const a=i/8*Math.PI*2;h+=L(22+Math.cos(a)*12,22+Math.sin(a)*12,22+Math.cos(a)*18,22+Math.sin(a)*18,frost,1.6);}return h+rune(7,22,22,9,'#fff',3);})(),
    vxSpear:spear(8,36,37,7,gold)+star(33,25,5,'#fff')+L(30,13,38,21,gold,1.2,'stroke-opacity=".6"'),
    vxDeep:feather(10,22,14,-90,vio)+feather(18,22,14,-90,vio)+feather(26,22,14,-90,vio)+feather(34,22,14,-90,gold),
    vxTwin:L(4,34,14,26,frost,2.4,'stroke-opacity=".5"')+L(4,24,14,16,frost,2.4,'stroke-opacity=".5"')+rune(0,22,28,6)+rune(4,30,16,6),
    vxMirror:feather(14,24,18,-110)+feather(22,20,20,-90)+feather(30,24,18,-70)+spear(36,38,22,26,vio,'#4a3070',2.2),
    vxHaunt:raven(23,23,.72,'#141018',col)+ring(16,vio,1.8,'stroke-dasharray="4 3"'),
    vxSwift:raven(26,21,.78,'#d8f4ff',frost,-10)+speed(),
    vxYgg:tree(gold)+star(31,9,4,'#fff'),
    vxPincer:spear(7,37,35,9,gold)+spear(37,37,9,9,vio,'#4a3070')+ring(17,col,1.2,'stroke-opacity=".5"'),
    vxMaelstrom:spiral(frost)+`<path d="M6 22 Q12 18 16 22 M28 22 Q32 26 38 22" stroke="${col}" stroke-width="1.6" fill="none"/>`,
    vxAllfather:(()=>{let h='';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;h+=L(22+Math.cos(a)*15,22+Math.sin(a)*15,22+Math.cos(a)*20,22+Math.sin(a)*20,gold,1.6);}return h+eye(22,22,.95);})(),
    vxGungnir:`<circle cx="31" cy="13" r="9" fill="${gold}" opacity=".25"/>`+spear(6,38,38,6,gold,'#c8a060',3.6)+star(31,13,6,'#fff'),
    vxHavamal:`<path d="M6 12 Q14 9 22 13 Q30 9 38 12 V34 Q30 31 22 35 Q14 31 6 34 Z" fill="#f4ead2" stroke="${col}" stroke-width="1.6"/>`+L(22,13,22,35,'#8a6a3a',1.2)+rune(0,14,23,4.6,'#2a4a8a',1.6)+rune(6,30,23,4.6,'#2a4a8a',1.6)
  };
  const g=G[k]||feather(22,22,22,-45);
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><defs><radialGradient id="g" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="${col}" stop-opacity=".22"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><rect width="44" height="44" rx="7" fill="${bg}"/><rect width="44" height="44" rx="7" fill="url(#g)"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);SKILL_ICON_ART[d.name]=fb;
    if(RV_ICONS_PAINTED){const src='assets/icons/raven/'+d.key+'.webp',im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}}
  return ['star',col,bg];}
