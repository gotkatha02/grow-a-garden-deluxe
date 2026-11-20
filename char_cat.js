/* =====================================================================
   AETHERFALL — WHITE RONIN CAT · "Shiro" (Japan · Hakusen) — 12 Tails style
   Character module. Loaded only when the Cat is played; index.html calls installCat().

     Basic  · Wandering Kitten — normal attack chain, Cat Step, Sheath Strike, Ki Gather (SP), Focus, Cloak, Nine Lives
     A Tree · Kaze Ronin       — fast, flowing cuts. FLOW stacks (every hit) → attack/move speed; afterimages
     B Tree · Oni Ronin        — heavy, charged cuts. CHARGE (wind-up, super armour) + KI (stronger with SP left)
     C Tree · Two-Tailed Ronin — 12 Tails "Additions": 4 upgrades each for Basic / A / B at Lv 55 / 60 / 70 / 80

   Design rules asked by the owner: no percent effects. Buffs and passives are flat numbers
   (+ATK, −damage per hit, crit points); random chances are fixed counters ("every 4th hit").
   Skill power is written as ATK×n. Balance: total damage tuned with tools/balance_bench.js through CHAR_DMG.cat.
   Sprites: placeholder made from one turnaround image (assets_cat.js, tools/statichero.py).

   Layout: 1. KT_BAL  2. KT_DEFS  3. systems  4. fx  5. skill actions  6. hooks / auto / install  7. icons
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE — every number in one place
   --------------------------------------------------------------------- */
const KT_BAL={
  flow:{cap:10,decay:2,atkPer:4,movePer:2},       // +4 ATK per Flow, +2 move per Flow (attack speed stays fixed)
  charge:{t:1.1,mul:1.5,ko:2,t3:1.8,mul3:1.6},     // full charge: power ×1.5, KO ×2 (3-stage: ×1.6)
  sk:{
    // ---- Basic
    knCombo:{chain:[2,3,4,4],hit:1.0,fin:1.6},
    knStep:{dist:120,cd:[6,4],mp:6},
    knSheath:{dmg:[1.4,1.7],cd:8,mp:10,range:110},
    knKi:{sp:[3,6,10],dur:8,cd:12,mp:0},
    knFocus:{crit:[5,8,12],dur:20,cd:30,mp:12},
    knCloak:{block:[6,12],icd:[20,15]},
    knNine:{icd:[180,120]},
    // ---- A · Kaze Ronin
    kaSwift:{dmg:[.8,.9,1.0,1.1],cd:5,mp:10,range:140},
    kaFeet:{move:[10,20],decay:[2.5,3]},
    kaSwallow:{dmg:[.45,.52,.6],cd:7,mp:12,range:100},
    kaReturn:{dmg:1.3,ghost:.6,flow:3,mp:8},
    kaMirage:{dist:150,iframe:[.3,.38,.45],ghost:.9,cd:9,mp:8},
    kaEcho:{every:[6,5,4,3],dmg:.5},
    kaSakura:{echo:[.4,.6],every:3,cap:15,dur:12,cd:30,mp:18},
    kaCrescent:{dmg:[1.4,1.7],len:220,cd:8,mp:14,range:220},
    kaPetals:{dmg:[.6,.7,.8],n:5,R:150,cd:12,mp:20,range:150},
    kaPetalFall:{dmg:1.6,mp:10},
    kaFlowState:{crit:[8,14]},
    kaGale:{win:.6,dmg:.5,n:6,cd:14,mp:14},
    kaUnbroken:{atk:[6,10]},
    kaTempest:{dmg:.3,max:15,min:3,cd:18,mp:26,range:120},
    kaHana:{dmg:.35,n:24,R:250,T:3,cd:70,mp:60},
    // ---- B · Oni Ronin
    kbCleave:{dmg:[1.6,1.8,2.0,2.2],R:115,half:.9,cd:7,mp:12,range:115},
    kbGrip:{atk:[12,24],cut:[.1,.2]},
    kbRising:{dmg:[1.8,2.1,2.4],cd:9,mp:14,range:100},
    kbEarth:{dmg:2.6,R:80,mp:10},
    kbSky:{dmg:[1.8,2.2],R:100,leap:200,cd:11,mp:18,range:200},
    kbIron:{block:[15,30]},
    kbRoar:{atk:[20,35],dur:12,cd:30,mp:16},
    kbKiBlade:{per:[5,4],cap:[25,40]},
    kbWheel:{dmg:[.8,.9,1.0],R:110,cd:12,mp:20},
    kbFinal:{dmg:2.6,len:240,mp:12},
    kbBreaker:{def:[10,15],dur:5},
    kbQuake:{dmg:2.0,len:280,cd:14,mp:18,range:260},
    kbMomentum:{atk:4,cap:[5,10],dur:8},
    kbExec:{dmg:3.4,cd:20,mp:28,range:110},
    kbAshura:{dur:12,sp:5,echo:.5,fin:6.0,R:160,cd:70,mp:60},
    // ---- C · Two-Tailed Ronin (Additions)
    kcCrescent:{R:90},
    kcStill:{hpPerLv:1},
    kcRoll:{dist:180,iframe:.6,cd:12,mp:10},
    kcKasa:{dmg:.9,len:240,pull:60,cd:10,mp:12,range:240},
    kcSwallows:{atk:8},
    kcShadow:{dmg:.3,dur:6,cd:30,mp:20},
    kcOverflow:{max:20},
    kcLunge:{dmg1:1.2,dmg2:2.0,len:300,win:3,flow:5,cd:14,mp:16,range:300},
    kcCleaveWind:{mul:.7,len:240},
    kcStance:{dur:4,block:30,base:1.5,per:.2,cap:10,R:120,cd:25,mp:18},
    kcOni:{dmg:2.0,R:120,def:15},
    kcAvalanche:{dmg:2.6,tick:.4,len:260,R:100,charge:.8,cd:16,mp:22,range:260}
  }};
const KB=KT_BAL.sk;
const ktX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA — 7 Basic · 15 A · 15 B · 12 C (4 per tree)
   --------------------------------------------------------------------- */
const KT_DEFS=[
 // ---------------- BASIC · WANDERING KITTEN ----------------
 {key:'knCombo',id:'KT-N01',name:'Paw-Blade Combo',br:'basic',row:1,max:4,passive:1,
  d:'(ตีปกติ) ฟันคาตานะต่อเนื่อง เลเวลสูงขึ้นต่อจังหวะได้ยาวขึ้น Lv4 ท่าสุดท้ายฟันหนักดันถอย · ติดตัว: กระแสดาบแต่ละชั้น ATK +'+KT_BAL.flow.atkPer+' และเดิน +'+KT_BAL.flow.movePer,lv:i=>[`ต่อได้ ${KB.knCombo.chain[i-1]} จังหวะ`,`จังหวะละ ${ktX(KB.knCombo.hit)}`,i>=4?`ท่าสุดท้าย ${ktX(KB.knCombo.fin)}`:'']},
 {key:'knStep',id:'KT-N02',name:'Cat Step',br:'basic',row:1,max:2,type:'self',
  d:'ก้าวพุ่งไปข้างหน้าเร็วๆ หลบการโจมตีได้ช่วงสั้นๆ',lv:i=>[`ระยะ ${KB.knStep.dist}`,'อมตะ 0.2 วิ',`Cooldown ${KB.knStep.cd[i-1]} วิ`]},
 {key:'knSheath',id:'KT-N03',name:'Sheath Strike',br:'basic',row:2,max:2,type:'melee',
  d:'ฟาดด้วยฝักดาบทั้งฝัก หนักและทำ KO ได้ดี',lv:i=>[`${ktX(KB.knSheath.dmg[i-1])}`,'ชะงัก 0.5 วิ','Cooldown 8 วิ']},
 {key:'knKi',id:'KT-N04',name:'Ki Gather',br:'basic',row:2,max:3,type:'self',
  d:'นั่งสมาธิกอดดาบเติม SP (แบบ Charge ของ 12 หาง) เดินหรือโดนตีแล้วหยุด',lv:i=>[`SP +${KB.knKi.sp[i-1]} ต่อวิ`,`นานสุด ${KB.knKi.dur} วิ`]},
 {key:'knFocus',id:'KT-N05',name:'Feline Focus',br:'basic',row:3,max:3,type:'self',
  d:'ตั้งสมาธิแมว เพิ่มโอกาสคริ',lv:i=>[`คริ +${KB.knFocus.crit[i-1]}`,`${KB.knFocus.dur} วิ`]},
 {key:'knCloak',id:'KT-N06',name:'Mino Cloak',br:'basic',row:3,max:2,passive:1,
  d:'(Passive) ผ้าคลุมขนนกลดดาเมจทุกครั้งที่โดนตี และปัดดีบัฟทิ้งเป็นระยะ (แบบ Resistance)',lv:i=>[`ดาเมจที่ได้รับ −${KB.knCloak.block[i-1]} ต่อครั้ง`,`ปัดดีบัฟ 1 อย่าง ทุก ${KB.knCloak.icd[i-1]} วิ`]},
 {key:'knNine',id:'KT-N07',name:'Nine Lives',br:'basic',row:4,max:2,passive:1,
  d:'(Passive) โดนตีตายจะเหลือ HP 1 แทน',lv:i=>[`ใช้ได้ทุก ${KB.knNine.icd[i-1]} วิ`]},
 // ---------------- A · KAZE RONIN ----------------
 {key:'kaSwift',id:'KT-A01',name:'Swift Draw',br:'A',row:1,max:4,type:'melee',
  d:'พุ่งเข้าหาเป้าแล้วชักดาบฟัน 2 ครั้ง (อัปสลับเลเวลกับ Swallow Cuts)',lv:i=>[`${ktX(KB.kaSwift.dmg[i-1])} × 2`,'Cooldown 5 วิ']},
 {key:'kaFeet',id:'KT-A02',name:'Light Feet',br:'A',row:1,max:2,passive:1,
  d:'(Passive) ฝีเท้าเบา เดินเร็วขึ้น กระแสดาบหายช้าลง',lv:i=>[`เดิน +${KB.kaFeet.move[i-1]}`,`กระแสอยู่ได้ ${KB.kaFeet.decay[i-1]} วิหลังตีโดนล่าสุด`]},
 {key:'kaSwallow',id:'KT-A03',name:'Swallow Cuts',br:'A',row:2,max:3,type:'melee',pre:[['kaSwift',1]],
  d:'ฟันเร็ว 4 ครั้ง ตีโดนแล้วกดซ้ำเพื่อใช้ Wind Return',lv:i=>[`${ktX(KB.kaSwallow.dmg[i-1])} × 4`,'Cooldown 7 วิ']},
 {key:'kaReturn',id:'KT-A04',name:'Wind Return',br:'A',row:2,max:1,parent:'kaSwallow',
  d:'(ท่าต่อ) ตีลังกาถอยพร้อมฟัน ทิ้งภาพติดตาฟันซ้ำ',lv:()=>[`${ktX(KB.kaReturn.dmg)} + ภาพติดตา ${ktX(KB.kaReturn.ghost)}`,`+${KB.kaReturn.flow} กระแส`]},
 {key:'kaMirage',id:'KT-A05',name:'Mirage Step',br:'A',row:3,max:3,type:'self',pre:[['kaSwift',2]],
  d:'หลบพุ่ง ทิ้งภาพลวงไว้ที่เดิม ภาพลวงฟันศัตรูรอบๆ',lv:i=>[`อมตะ ${KB.kaMirage.iframe[i-1]} วิ`,`ภาพลวง ${ktX(KB.kaMirage.ghost)}`,'Cooldown 9 วิ']},
 {key:'kaEcho',id:'KT-A06',name:'Echo Blade',br:'A',row:3,max:4,passive:1,
  d:'(Passive · แบบ Shadow Fist) ทุกๆ จำนวนครั้งที่ตีโดน (ตีปกติ/สกิล A) ภาพติดตาฟันซ้ำ 1 ครั้ง',lv:i=>[`ทุก ${KB.kaEcho.every[i-1]} ฮิต`,`${ktX(KB.kaEcho.dmg)}`]},
 {key:'kaSakura',id:'KT-A07',name:'Sakura Dance',br:'A',row:4,max:2,type:'self',
  d:'ระบำซากุระ ทุกการฟันครั้งที่ 3 กลีบซากุระฟันซ้ำ และเก็บกระแสได้มากขึ้น',lv:i=>[`กลีบฟันซ้ำ ${ktX(KB.kaSakura.echo[i-1])} ทุกฮิตที่ ${KB.kaSakura.every}`,`กระแสสูงสุด ${KB.kaSakura.cap}`,`${KB.kaSakura.dur} วิ`]},
 {key:'kaCrescent',id:'KT-A08',name:'Crescent Wind',br:'A',row:4,max:2,type:'melee',
  d:'คลื่นดาบพุ่งเป็นแนว ทะลุทุกตัว',lv:i=>[`${ktX(KB.kaCrescent.dmg[i-1])}`,`ยาว ${KB.kaCrescent.len}`,'สโลว์ 2 วิ']},
 {key:'kaPetals',id:'KT-A09',name:'Thousand Petals',br:'A',row:5,max:3,type:'self',pre:[['kaMirage',1]],
  d:'วาร์ปฟันศัตรูรอบตัวทีละตัว ตีโดนแล้วกดซ้ำเพื่อใช้ Petal Fall',lv:i=>[`สูงสุด ${KB.kaPetals.n} ตัว`,`ตัวละ ${ktX(KB.kaPetals.dmg[i-1])} × 2`]},
 {key:'kaPetalFall',id:'KT-A10',name:'Petal Fall',br:'A',row:5,max:1,parent:'kaPetals',
  d:'(ท่าต่อ) เก็บดาบ ทุกตัวที่โดน Thousand Petals แตกรอยฟัน',lv:()=>[`${ktX(KB.kaPetalFall.dmg)}`,'ชะงัก 0.4 วิ']},
 {key:'kaFlowState',id:'KT-A11',name:'Flow State',br:'A',row:6,max:2,passive:1,
  d:'(Passive) กระแส 10 ขึ้นไป คริเพิ่ม',lv:i=>[`คริ +${KB.kaFlowState.crit[i-1]}`]},
 {key:'kaGale',id:'KT-A12',name:'Gale Counter',br:'A',row:6,max:1,type:'self',pre:[['kaMirage',2]],
  d:'ตั้งท่าหลบ ถ้าโดนตีจะไม่เสียเลือด แล้วโผล่หลังศัตรูฟันรัว',lv:()=>[`ตั้งท่า ${KB.kaGale.win} วิ`,`${ktX(KB.kaGale.dmg)} × ${KB.kaGale.n}`]},
 {key:'kaUnbroken',id:'KT-A13',name:'Unbroken Flow',br:'A',row:7,max:2,passive:1,
  d:'(Passive) เดินอยู่กระแสไม่หาย ทุก 5 กระแสเพิ่ม ATK',lv:i=>[`ATK +${KB.kaUnbroken.atk[i-1]} ต่อ 5 กระแส`]},
 {key:'kaTempest',id:'KT-A14',name:'Tempest Iai',br:'A',row:7,max:1,type:'melee',pre:[['kaFlowState',1]],
  d:'ใช้กระแสทั้งหมด พุ่งทะลุไปมารอบเป้า ฟันกระแสละ 1 ครั้ง',lv:()=>[`ครั้งละ ${ktX(KB.kaTempest.dmg)}`,`${KB.kaTempest.min}–${KB.kaTempest.max} ครั้ง`]},
 {key:'kaHana',id:'KT-A15',name:'Hanafubuki',br:'A',row:8,max:1,type:'self',ult:1,pre:[['kaTempest',1],['kaPetalFall',1]],
  d:'ULTIMATE A · กลายเป็นเงาพร่า อมตะ ฟันทุกตัวรอบตัวเหมือนพายุซากุระ จบแล้วกระแสเต็ม',lv:()=>[`${KB.kaHana.n} ครั้ง ครั้งละ ${ktX(KB.kaHana.dmg)}`,`รัศมี ${KB.kaHana.R}`]},
 // ---------------- B · ONI RONIN ----------------
 {key:'kbCleave',id:'KT-B01',name:'Mountain Cleave',br:'B',row:1,max:4,type:'melee',
  d:'[ชาร์จ] เงื้อดาบแล้วฟันลงเป็นรูปพัด (อัปสลับเลเวลกับ Sky Drop)',lv:i=>[`${ktX(KB.kbCleave.dmg[i-1])} (ชาร์จเต็ม ×${KT_BAL.charge.mul})`,'ชะงัก 0.5 วิ','Cooldown 7 วิ']},
 {key:'kbGrip',id:'KT-B02',name:'Iron Grip',br:'B',row:1,max:2,passive:1,
  d:'(Passive) สกิล B แรงขึ้น ชาร์จเร็วขึ้น',lv:i=>[`ATK +${KB.kbGrip.atk[i-1]} (สกิล B)`,`ชาร์จเร็วขึ้น ${KB.kbGrip.cut[i-1]} วิ`]},
 {key:'kbRising',id:'KT-B03',name:'Rising Split',br:'B',row:2,max:3,type:'melee',
  d:'ฟันเสยขึ้น ยกลอย ตีโดนแล้วกดซ้ำเพื่อใช้ Earthfall',lv:i=>[`${ktX(KB.kbRising.dmg[i-1])}`,'ยกลอย']},
 {key:'kbEarth',id:'KT-B04',name:'Earthfall',br:'B',row:2,max:1,parent:'kbRising',
  d:'(ท่าต่อ) กระโดดตามแล้วฟันกดเป้าลงพื้น',lv:()=>[`${ktX(KB.kbEarth.dmg)} รัศมี ${KB.kbEarth.R}`]},
 {key:'kbSky',id:'KT-B05',name:'Sky Drop',br:'B',row:3,max:2,type:'melee',pre:[['kbCleave',1]],
  d:'[ชาร์จ] กระโดดสูงแล้วฟันกระแทกพื้น (แบบ Tower Rush)',lv:i=>[`${ktX(KB.kbSky.dmg[i-1])} (ชาร์จเต็ม ×${KT_BAL.charge.mul})`,`รัศมี ${KB.kbSky.R}`,'ยกลอย']},
 {key:'kbIron',id:'KT-B06',name:'Iron Body',br:'B',row:3,max:2,passive:1,
  d:'(Passive) ระหว่างชาร์จไม่โดนขัดจังหวะ และลดดาเมจที่ได้รับ',lv:i=>[`ดาเมจที่ได้รับ −${KB.kbIron.block[i-1]} ต่อครั้งระหว่างชาร์จ`]},
 {key:'kbRoar',id:'KT-B07',name:'Oni Roar',br:'B',row:4,max:2,type:'self',
  d:'คำรามอสูร เพิ่ม ATK และไม่ติดชะงัก',lv:i=>[`ATK +${KB.kbRoar.atk[i-1]}`,`${KB.kbRoar.dur} วิ`]},
 {key:'kbKiBlade',id:'KT-B08',name:'Ki Blade',br:'B',row:4,max:2,passive:1,
  d:'(Passive · แบบ Spirit) สกิล B แรงขึ้นตาม SP ที่เหลืออยู่',lv:i=>[`ATK +1 ต่อ SP ที่เหลือทุก ${KB.kbKiBlade.per[i-1]}`,`สูงสุด +${KB.kbKiBlade.cap[i-1]}`]},
 {key:'kbWheel',id:'KT-B09',name:'Grinding Wheel',br:'B',row:5,max:3,type:'self',pre:[['kbSky',1]],
  d:'หมุนดาบหนัก 3 รอบ ดูดศัตรูเข้าใกล้ ตีโดนแล้วกดซ้ำเพื่อใช้ Final Cleave',lv:i=>[`${ktX(KB.kbWheel.dmg[i-1])} × 3`,`รัศมี ${KB.kbWheel.R}`]},
 {key:'kbFinal',id:'KT-B10',name:'Final Cleave',br:'B',row:5,max:1,parent:'kbWheel',
  d:'(ท่าต่อ · ชาร์จ) ฟันดิ่งยักษ์เป็นแนวยาว',lv:()=>[`${ktX(KB.kbFinal.dmg)} (ชาร์จเต็ม ×${KT_BAL.charge.mul})`,`ยาว ${KB.kbFinal.len}`]},
 {key:'kbBreaker',id:'KT-B11',name:'Breaker Stance',br:'B',row:6,max:2,passive:1,
  d:'(Passive) ท่าชาร์จเต็มที่โดน ลด DEF เป้าหมาย',lv:i=>[`DEF เป้า −${KB.kbBreaker.def[i-1]}`,`${KB.kbBreaker.dur} วิ`]},
 {key:'kbQuake',id:'KT-B12',name:'Quake Slash',br:'B',row:6,max:1,type:'melee',pre:[['kbSky',1]],
  d:'ปักดาบลงพื้น คลื่นกระแทกวิ่งเป็นแนว',lv:()=>[`${ktX(KB.kbQuake.dmg)}`,`ยาว ${KB.kbQuake.len}`,'สโลว์ 2 วิ']},
 {key:'kbMomentum',id:'KT-B13',name:'Momentum',br:'B',row:7,max:2,passive:1,
  d:'(Passive · แบบ Combo Plus) ตีปกติหรือสกิล B โดน = ATK สะสม',lv:i=>[`ATK +${KB.kbMomentum.atk} ต่อชั้น`,`สูงสุด ${KB.kbMomentum.cap[i-1]} ชั้น`,`${KB.kbMomentum.dur} วิ`]},
 {key:'kbExec',id:'KT-B14',name:'Oni Executioner',br:'B',row:7,max:1,type:'melee',pre:[['kbBreaker',1]],
  d:'[ชาร์จ 3 ขั้น] ชาร์จนาน แล้วฟันเป้าเดียวสุดแรง',lv:()=>[`${ktX(KB.kbExec.dmg)} (ชาร์จ ${KT_BAL.charge.t3} วิ ×${KT_BAL.charge.mul3})`,'Cooldown 20 วิ']},
 {key:'kbAshura',id:'KT-B15',name:'Ashura Mask',br:'B',row:8,max:1,type:'self',ult:1,pre:[['kbExec',1],['kbFinal',1]],
  d:'ULTIMATE B · ลายคาบูกิลุกเป็นไฟ ร่างเงาแดง (แบบ Ashura) ชาร์จทันที ไม่โดนขัด SP ฟื้นไว สกิล B มีเงาฟันซ้ำ จบด้วยฟันอสูร',lv:()=>[`${KB.kbAshura.dur} วิ · SP +${KB.kbAshura.sp}/วิ`,`เงาฟันซ้ำ ${ktX(KB.kbAshura.echo)}`,`ฟันอสูร ${ktX(KB.kbAshura.fin)} รัศมี ${KB.kbAshura.R}`]},
 // ---------------- C · TWO-TAILED RONIN (Additions, Lv 55 / 60 / 70 / 80) ----------------
 {key:'kcCrescent',id:'KT-C01',name:'Crescent Finish',br:'C',tier:1,col:'basic',passive:1,pre:[['knCombo',4]],
  d:'ท่าสุดท้ายของคอมโบกลายเป็นคลื่นดาบรอบตัว (แบบ Aura Blast)',lv:()=>[`รัศมี ${KB.kcCrescent.R}`]},
 {key:'kcSwallows',id:'KT-C02',name:'Nine Swallows',br:'C',tier:1,col:'A',passive:1,pre:[['kaSwift',4],['kaSwallow',3]],
  d:'Swift Draw และ Swallow Cuts แรงขึ้นทุกฮิตที่ตีโดนในท่าเดียวกัน (แบบ Nine Steps)',lv:()=>[`ATK +${KB.kcSwallows.atk} ต่อฮิตก่อนหน้า`]},
 {key:'kcCleaveWind',id:'KT-C03',name:'Cleaving Wind',br:'C',tier:1,col:'B',passive:1,pre:[['kbCleave',4]],
  d:'Mountain Cleave ชาร์จเต็มปล่อยคลื่นดาบยักษ์เป็นแนว (แบบ Qi Burst)',lv:()=>[`คลื่นแรง ×${KB.kcCleaveWind.mul} ของท่า`,`ยาว ${KB.kcCleaveWind.len}`]},
 {key:'kcStill',id:'KT-C04',name:'Still Water',br:'C',tier:2,col:'basic',passive:1,pre:[['knKi',3]],
  d:'ระหว่างรวมลมปราณ ฟื้น HP และล้างสโลว์ (แบบ Aura Field)',lv:()=>['ฟื้น HP เท่ากับเลเวลตัวละครต่อวิ']},
 {key:'kcShadow',id:'KT-C05',name:'Shadow Dance',br:'C',tier:2,col:'A',pre:[['kaMirage',3]],
  d:'[New Active] แยกภาพติดตา 2 ร่าง ทำท่าตามทุกครั้งที่ตีปกติหรือใช้สกิล A',lv:()=>[`ร่างละ ${ktX(KB.kcShadow.dmg)} ต่อฮิต`,`${KB.kcShadow.dur} วิ`,'Cooldown 30 วิ']},
 {key:'kcStance',id:'KT-C06',name:'Mountain Stance',br:'C',tier:2,col:'B',pre:[['kbIron',2]],
  d:'[New Active] ปักหลักรับดาเมจ ไม่ติดสถานะ ยิ่งโดนตีมากยิ่งฟันสวนแรง (หมดเวลาหรือกดซ้ำ = ฟันสวน)',lv:()=>[`${KB.kcStance.dur} วิ · ดาเมจที่ได้รับ −${KB.kcStance.block} ต่อครั้ง`,`ฟันสวน ${ktX(KB.kcStance.base)} +${KB.kcStance.per} ต่อครั้งที่โดน (สูงสุด ${KB.kcStance.cap})`]},
 {key:'kcRoll',id:'KT-C07',name:'Nekomata Roll',br:'C',tier:3,col:'basic',pre:[['knStep',2]],
  d:'[New Active] ม้วนตัวหลบไกล อมตะ และล้างชะงัก/สโลว์ (แบบ Rolling Around)',lv:()=>[`ระยะ ${KB.kcRoll.dist}`,`อมตะ ${KB.kcRoll.iframe} วิ`,'Cooldown 12 วิ']},
 {key:'kcOverflow',id:'KT-C08',name:'Storm Overflow',br:'C',tier:3,col:'A',passive:1,pre:[['kaTempest',1]],
  d:'Tempest Iai ฟันได้มากขึ้น และใช้กระแสแค่ครึ่งเดียว',lv:()=>[`สูงสุด ${KB.kcOverflow.max} ครั้ง`]},
 {key:'kcOni',id:'KT-C09',name:'Oni Impact',br:'C',tier:3,col:'B',passive:1,pre:[['kbExec',1]],
  d:'Oni Executioner ชาร์จเต็มมีเงาอสูรแดงฟาดตาม (แบบ Ogre Impact)',lv:()=>[`คลื่นอสูร ${ktX(KB.kcOni.dmg)} รัศมี ${KB.kcOni.R}`,`DEF เป้า −${KB.kcOni.def}`]},
 {key:'kcKasa',id:'KT-C10',name:'Kasa Throw',br:'C',tier:4,col:'basic',pre:[['knSheath',2]],
  d:'[New Active] ขว้างงอบเป็นบูมเมอแรง โดนทั้งขาไปขากลับ ขากลับดึงศัตรูเข้าหาตัว',lv:()=>[`${ktX(KB.kcKasa.dmg)} × 2`,`ดึง ${KB.kcKasa.pull}`,'Cooldown 10 วิ']},
 {key:'kcLunge',id:'KT-C11',name:'Gale Lunge',br:'C',tier:4,col:'A',pre:[['kaCrescent',2]],
  d:'[New Active · กด 2 จังหวะ] ยิงคลื่นลมติดรอยเป้าแรก กดซ้ำภายใน 3 วิ วาร์ปไปหลังเป้าแล้วฟัน',lv:()=>[`คลื่น ${ktX(KB.kcLunge.dmg1)}`,`วาร์ปฟัน ${ktX(KB.kcLunge.dmg2)} +${KB.kcLunge.flow} กระแส`,'Cooldown 14 วิ']},
 {key:'kcAvalanche',id:'KT-C12',name:'Avalanche Rush',br:'C',tier:4,col:'B',pre:[['kbWheel',3]],
  d:'[New Active · ชาร์จ] วิ่งชน ลากศัตรูไปด้วย แล้วฟันกระแทกพื้น',lv:()=>[`ลาก ${ktX(KB.kcAvalanche.tick)} ×3`,`ฟันกระแทก ${ktX(KB.kcAvalanche.dmg)}`,'Cooldown 16 วิ']}
];

/* =====================================================================
   3. SYSTEMS — Flow · Charge · Ki · counters
   ===================================================================== */
const CAT={flow:0,lastHit:-9,echoN:0,mom:0,momT:-9,charging:0,stanceN:0,stance:false,ashura:false,lunge:null,gale:0,galeFire:null,petalHit:[],cloakT:0,nineT:0,kiOn:false};
const ktL=k=>LV[k]||0;
const ktLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,ktL(k)))-1];
const ktFlowCap=()=>hasBuff('kaSakura')?KB.kaSakura.cap:KT_BAL.flow.cap;
const ktDecay=()=>ktL('kaFeet')?ktLv(KB.kaFeet.decay,'kaFeet'):KT_BAL.flow.decay;
function ktAddFlow(n){const b=CAT.flow;CAT.flow=Math.min(ktFlowCap(),CAT.flow+n);CAT.lastHit=gameTime;if(CAT.flow>=10&&b<10)addFx(new DText({x:player.x,y:player.y,z:96,text:'FLOW',color:'#ffd0e8',size:12,life:.8}));}
const ktBranch=k=>!k?'':k==='basic'?'N':k.startsWith('ka')||k==='kcSwallows'||k==='kcShadow'||k==='kcLunge'?'A':k.startsWith('kb')||k==='kcStance'||k==='kcOni'||k==='kcAvalanche'||k==='kcCleaveWind'?'B':'N';
/* charge time for heavy skills (Iron Grip shortens, Ashura makes it instant) */
function ktChargeT(three){if(CAT.ashura)return 0;let t=three?KT_BAL.charge.t3:KT_BAL.charge.t;if(ktL('kbGrip'))t-=ktLv(KB.kbGrip.cut,'kbGrip');return Math.max(.25,t);}
/* every damaging hit from this module goes through here */
function ktHit(e,mult,key,o={}){if(!e||e.dead)return 0;return hurt(e,mult,Object.assign({critOK:true,skill:key},o));}
const ktNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const ktCone=(phi,R,half)=>enemiesInCone(player.x,player.y,phi,R,half);
const ktLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&distToSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function ktFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function ktPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!ktFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const ktTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const ktPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);

/* =====================================================================
   4. FX — sakura petals (A), crimson heavy cuts (B), afterimages
   ===================================================================== */
/* effects v3 (cat_vfx.js): ktV('name',...) runs the hook and returns true when it drew the effect, so the painted fallback below it is skipped */
const ktV=(n,...a)=>{const v=window.KTV;return !!(v&&v.on&&v[n])&&v[n](...a)!==false;};
const KTC={sakura:'#ffc8de',sakura2:'#ff8fb8',white:'#ffffff',steel:'#e8f0ff',oni:'#ff3a2a',oni2:'#ff9a3a',ember:'#ffd27a',ink:'#2a1018',gold:'#ffd36a'};
const KT_SAKURA={glow:'#ff9fc8',edge:'#ffc8de',mid:'#ffffff',core:'#ffffff'},KT_ONI={glow:'#ff3a2a',edge:'#9a1a10',mid:'#ff9a3a',core:'#fff2d8'};
const ktScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
function ktPetals(x,y,z,n,spd=90){if(window.KTV&&KTV.on){KTV.petals(x,y,z,Math.max(1,Math.round(n*.5)),{spd});return;}if(ktImg('02_petals')){for(let i=0;i<qn(Math.ceil(n*.7));i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;addFx(new KtBit({n:'02_petals',x,y,z:z+rnd(-6,10),vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(20,70),grav:40,w:rnd(9,15)}));}return;}for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;emit({type:'ember',x,y,z:z+rnd(-6,10),vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(10,60),drag:2.4,life:rnd(.6,1.1),size:rnd(1.8,3),size1:1,color:Math.random()<.6?KTC.sakura:KTC.white});}}
function ktEmbers(x,y,z,n,spd=140){if(window.KTV&&KTV.on){KTV.embers(x,y,z,Math.max(1,Math.round(n*.6)),{spd});return;}if(ktImg('07_embers')){for(let i=0;i<qn(Math.ceil(n*.6));i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;addFx(new KtBit({n:'07_embers',x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(40,130),grav:-20,spin:rnd(-2,2),rot:rnd(-.3,.3),w:rnd(9,16),life:rnd(.4,.8)}));}return;}for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;emit({type:'ember',x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(30,120),drag:2,life:rnd(.4,.8),size:rnd(1.4,2.6),size1:.2,color:Math.random()<.5?KTC.oni:KTC.oni2});}}
/* crescent cut drawn at a point (afterimage hits, waves, counters) */
class KtArc{constructor(o){Object.assign(this,{t:0,life:.26,layer:'top',R:44,w:10,z:30,col:KTC.white,core:'#ffffff',sweep:2.2},o);if(this.rot==null)this.rot=rnd(-.5,.5);if(ktV('arc',this)){this.layer='none';this.life=0;}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),a=1-k,R=this.R*(.8+.3*eOut(k)),c=ktScr(this.phi??0)+this.rot,s=this.sweep;
    if(ktDraw(this.col===KTC.oni||this.col===KTC.oni2?'06_onislash':'01_slash',x,y,R*2.4,{rot:c,fy:this.rot>0,a:Math.min(1,a*1.6)}))return;
    ctx.save();ctx.translate(x,y);ctx.scale(1,.75);ctx.rotate(c);ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(-R,0,R,0);g.addColorStop(0,hexA(this.col,0));g.addColorStop(.5,hexA(this.col,.75*a));g.addColorStop(1,hexA(this.core,a));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,-s/2,s/2);ctx.arc(-this.w*.8,0,R-this.w*(1-k*.6),s/2,-s/2,true);ctx.closePath();ctx.fill();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* ---- painted effect images (assets/fx/cat/*.webp, cartoon art made for the cat) ---- */
const KT_FX=['01_slash','02_petals','03_wave','04_xslash','05_mark','06_onislash','07_embers','08_charge','09_crater','10_quake','11_wheel','12_roar','13_onispirit','14_hana','15_mask','16_aura','17_ki','18_kasa','19_dome','20_hitpink','21_hitfire','22_pow','23_dust','24_speed','25_shock'];
const KTI={};
function ktImg(n){let o=KTI[n];if(!o){o=KTI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src='assets/fx/cat/'+n+'.webp';}return o.ok?o.im:null;}
/* draw image n centred on world point (sx,sy already projected); w = width in world px; o: rot, fy (flip), a, ax, ay, sq (vertical squash), cell (0..7 for 8-cell strips), clip (0..1 reveal from left) */
function ktDraw(n,sx,sy,w,o={}){const im=ktImg(n);if(!im)return false;const cells=o.cell!=null?(o.cells||8):1,iw=im.naturalWidth/cells,ih=im.naturalHeight;let h=w*ih/iw*(o.sq||1);
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,o.a==null?1:o.a));if(o.add)ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);
  if(o.gspin!=null){const r=h/w;ctx.scale(1,r);ctx.rotate(o.gspin);h=w;}   /* spin a perspective ring in its ground plane */
  if(o.rot)ctx.rotate(o.rot);if(o.fy)ctx.scale(1,-1);if(o.fx)ctx.scale(-1,1);
  const ax=o.ax==null?.5:o.ax,ay=o.ay==null?.5:o.ay,c=o.clip==null?1:Math.max(0,Math.min(1,o.clip));
  ctx.drawImage(im,(o.cell||0)*iw,0,iw*c,ih,-w*ax,-h*ay,w*c,h);ctx.restore();return true;}
/* one-shot image effect in the world */
/* storm extras shared by wolf + cat vortex effects: ground shadow + dust ring, code wind streaks and orbiting debris */
window.vxGround=window.vxGround||function(f,W,a){const [gx,gy]=P(f.x,f.y,0);ctx.save();ctx.globalAlpha=a*.4;
  const g=ctx.createRadialGradient(gx,gy,0,gx,gy,W*.55);g.addColorStop(0,'rgba(15,25,45,.55)');g.addColorStop(1,'rgba(15,25,45,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(gx,gy,W*.55,W*.25,0,0,TAU);ctx.fill();
  for(let i=0;i<2;i++){const p=(f.t*1.3+i*.5)%1,rr=W*(.3+.3*p);ctx.globalAlpha=a*.55*(1-p);ctx.strokeStyle=f.vc||'#eaf6ff';ctx.lineWidth=3*(1-p)+1;
    ctx.beginPath();ctx.ellipse(gx,gy,rr,rr*.45,0,0,TAU);ctx.stroke();}ctx.restore();};
window.vxExtra=window.vxExtra||function(f,half,W,H,a){const front=half==='front',dir=Math.sign(f.gspinV)||1,col=f.vc||'#eaf6ff';
  if(!f._bits){f._bits=[];const n=f.ring?12:26;for(let i=0;i<n;i++)f._bits.push({an:rnd(0,TAU),u:Math.random(),sp:rnd(2.2,4.2),sz:rnd(3,7),rot:rnd(0,TAU),vr:rnd(-8,8)});}
  const rad=u=>W*(f.ring?.44-.05*u:(.27+.33*u*u));ctx.save();
  /* wind streaks: partial ellipse arcs at several heights, the half behind / in front is clipped like the swirl */
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';const NS=f.ring?3:8;
  for(let i=0;i<NS;i++){const u=(i+.5)/NS,[cx,cy]=P(f.x,f.y,f.z+H*u),r=rad(u)*(1.05+.08*Math.sin(f.t*4+i)),s0=f.t*7*dir+i*2.4,len=(1.3+.6*Math.sin(f.t*3+i*1.7))*dir;
    ctx.save();ctx.beginPath();if(front)ctx.rect(cx-5000,cy,10000,5000);else ctx.rect(cx-5000,cy-5000,10000,5000);ctx.clip();
    ctx.strokeStyle=col;ctx.globalAlpha=a*(front?.75:.45);ctx.lineWidth=(f.ring?3:2)+3*(1-u);
    ctx.beginPath();ctx.ellipse(cx,cy,r,r*.42,0,s0,s0+len,dir<0);ctx.stroke();ctx.restore();}
  /* debris orbiting the funnel: drawn in front of the hero only while on the near side */
  ctx.globalCompositeOperation='source-over';
  for(const b of f._bits){const an=b.an+f.t*b.sp*dir,sn=Math.sin(an);if((sn>=0)!==front)continue;const u=(b.u+f.t*.25)%1,[cx,cy]=P(f.x,f.y,f.z+H*u),r=rad(u),
    px=cx+Math.cos(an)*r,py=cy+sn*r*.42,sz=b.sz*(front?1.15:.8)*(f.ring?.8:1);
    ctx.save();ctx.translate(px,py);ctx.rotate(b.rot+f.t*b.vr);ctx.globalAlpha=a*(front?1:.6)*Math.min(1,(1-u)*4);
    if(f.deb==='petal'){ctx.fillStyle='#ffb3cc';ctx.strokeStyle='#e0668f';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,sz,sz*.55,0,0,TAU);ctx.fill();ctx.stroke();}
    else if(f.deb==='ember'){ctx.globalCompositeOperation='lighter';ctx.fillStyle=f.dc||'#ff6a3a';ctx.fillRect(-sz*.6,-sz*.2,sz*1.2,sz*.4);}
    else{ctx.fillStyle='#effaff';ctx.strokeStyle='#6fb8f0';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-sz);ctx.lineTo(sz*.5,0);ctx.lineTo(0,sz);ctx.lineTo(-sz*.5,0);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  ctx.restore();};
class KtImg{constructor(o){if(ktV('img',o)){this.t=0;this.life=0;this.layer='none';return;}Object.assign(this,{t:0,life:.3,layer:'top',z:0,w:100,s0:.85,s1:1.05,a0:1,fadeIn:.04,fadeOut:.5,rot:0,spin:0,rise:0,gspinV:0,glow:0,wipe:0,pulse:0},o);
    /* vortex: a painted 3/4-view storm or ring. Back half is drawn behind the characters, front half over them,
       so the storm wraps around the hero instead of lying on the floor. The swirl turns slowly; an anchored copy keeps
       the painted depth (front rim, spikes, clouds) where it belongs instead of spinning it to the back. */
    if(this.vortex&&!this.half){const v=this.gspinV||0,sg=Math.sign(v)||1;this.gspinV=this.ring?v*.7:sg*Math.min(Math.abs(v)*.4,2.2);
      this.half='back';this.layer='ground';const f=new KtImg(Object.assign({},o,{half:'front',layer:'top',gspinV:this.gspinV,vortex:1}));addFx(f);}}
  update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),fo=this.fadeOut;
    const a=this.a0*Math.min(1,this.t/Math.max(.001,this.fadeIn))*(k>1-fo?Math.max(0,(1-k)/fo):1);
    const [x,y]=P(this.x,this.y,this.z+this.rise*k),W=this.w*s*(this.pulse?1+this.pulse*Math.sin(this.t*18):1);
    const o={rot:this.rot+this.spin*this.t,fy:this.fy,fx:this.fx,a,ax:this.ax,ay:this.ay,sq:this.sq,gspin:this.gspin!=null?this.gspin+this.gspinV*this.t:null,clip:this.wipe?eOut(Math.min(1,k/this.wipe)):null};
    if(this.cell!=null){o.cell=this.cell;o.cells=this.cells;}if(this.half){/* funnel: the swirl is stacked in slices up to height H so it has volume (tornado), each slice turning at its own speed */const N=this.ring?3:6,H=this.H||(this.ring?36:Math.min(170,this.w*.55)),a0=o.a,g0=o.gspin||0,front=this.half==='front';if(!front)vxGround(this,W,a0);for(let q=0;q<N;q++){const i=front?N-1-q:q,u=i/(N-1),zz=this.z+H*u,[xi,yi]=P(this.x,this.y,zz),wi=W*(this.ring?1-.12*u:.55+.6*u*u)*(1+.04*Math.sin(this.t*7+i*1.7)),sw=Math.sin(this.t*2.2+i*1.3)*W*.035*u;ctx.save();ctx.beginPath();if(front)ctx.rect(xi-5000,yi,10000,5000);else ctx.rect(xi-5000,yi-5000,10000,5000);ctx.clip();o.gspin=g0*(1+.35*i)+i*1.1;o.a=a0*(front?.78:1)*(this.ring?1-.3*u:(.95-.55*u));ktDraw(this.n,xi+sw,yi,wi,o);ctx.restore();}o.gspin=g0;o.a=a0;vxExtra(this,this.half,W,H,a0);if(front&&!this.ring&&typeof emit==='function'){const nn=Q&&Q.p<.6?1:3;for(let m=0;m<nn;m++){const an=Math.random()*TAU,u=Math.random(),r=this.w*s*(.25+.3*u*u);emit({type:'snow',x:this.x+Math.cos(an)*r,y:this.y+Math.sin(an)*r*.6,z:this.z+H*u,vz:rnd(60,140),vx:-Math.sin(an)*rnd(90,160),vy:Math.cos(an)*rnd(40,80),drag:.8,life:rnd(.5,.9),size:rnd(1.4,3),color:Math.random()<.5?'#ffffff':'#bfe6ff'});}}}
    else ktDraw(this.n,x,y,W,o);if(this.glow&&k<.35&&!this.half){o.a=this.glow*(1-k/.35);o.add=1;ktDraw(this.n,x,y,W,o);}}}
/* little painted bits (petals / embers) that drift and spin */
class KtBit{constructor(o){Object.assign(this,{t:0,layer:'top',vz:0,drag:2,spin:rnd(-6,6),rot:rnd(0,TAU),w:12},o);this.cell=this.cell??((Math.random()*8)|0);this.life=this.life||rnd(.6,1.1);}
  update(dt){this.t+=dt;const d=Math.exp(-this.drag*dt);this.vx*=d;this.vy*=d;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z=Math.max(0,this.z+this.vz*dt);this.vz=(this.vz-(this.grav??30)*dt);return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)/.3);ktDraw(this.n,x,y,this.w,{cell:this.cell,rot:this.rot+this.spin*this.t,a});}}
/* sword slash image swung toward phi (A: sakura, B: oni fire) */
function ktSlashImg(x,y,phi,w,heavy,flip,o={}){addFx(new KtImg(Object.assign({n:heavy?'06_onislash':'01_slash',x:x+Math.cos(phi)*w*.28,y:y+Math.sin(phi)*w*.28,z:30,w,rot:ktScr(phi),fy:!!flip,life:heavy?.36:.27,s0:.82,s1:1.06,fadeIn:.001,fadeOut:.45,wipe:heavy?.4:.32,glow:heavy?.9:.75},o)));}
/* hit spark + small extras (new painted bits, skipped until their files exist) */
let ktSparkT=0;function ktSpark(e,heavy,big){if(!e||gameTime-ktSparkT<.03&&!big)return;ktSparkT=gameTime;const n=heavy?'21_hitfire':'20_hitpink';if(!ktImg(n))return;
  addFx(new KtImg({n,x:e.x+rnd(-8,8),y:e.y+rnd(-6,6),z:(e.boss?40:26)+rnd(-6,8),w:(big?90:heavy?66:50)*(e.boss?1.3:1),rot:rnd(0,TAU),life:big?.24:.16,s0:.5,s1:1.15,fadeIn:.001,fadeOut:.6,glow:.8}));
  if(big&&ktImg('22_pow'))addFx(new KtImg({n:'22_pow',x:e.x,y:e.y,z:(e.boss?44:28),w:e.boss?150:110,rot:rnd(-.3,.3),life:.22,s0:.4,s1:1.1,fadeIn:.001,fadeOut:.6,glow:.6}));}
function ktDust(x,y,n=3,R=40){if(!ktImg('23_dust'))return;for(let i=0;i<n;i++){const a=rnd(0,TAU),r=rnd(.4,1)*R;addFx(new KtImg({n:'23_dust',x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.6,z:4,w:rnd(26,44),cell:(Math.random()*4)|0,cells:4,life:rnd(.5,.8),s0:.6,s1:1.2,rise:12,fadeOut:.6,a0:.9}));}}
function ktShock(x,y,w=160,col){if(ktImg('25_shock'))addFx(new KtImg({n:'25_shock',x,y,w,life:.4,s0:.3,s1:1.15,fadeIn:.001,fadeOut:.7,layer:'ground'}));}
function ktCrater(x,y,w=170){ktShock(x,y,w*1.2);ktDust(x,y,5,w*.45);screenFlash(.18,'#ffd8a8');addFx(new KtImg({n:'09_crater',x,y,w,sq:.85,layer:'ground',life:1.5,s0:.9,s1:1,fadeIn:.02,fadeOut:.35}));}
/* game-time delay (respects pause / bench fast-forward, unlike setTimeout) */
class KtDelay{constructor(t,f){this.t=t;this.f=f;this.layer='none';}update(dt){this.t-=dt;if(this.t<=0){try{this.f();}catch(_){}return false;}return true;}draw(){}}
const ktLater=(t,f)=>addFx(new KtDelay(t,f));
/* afterimage of the cat (fades) */
class KtGhost{constructor(o){Object.assign(this,{t:0,life:.45,layer:'top',st:'attack',f:8,a0:.55,tint:null},o);if(!this.d)this.d=player.dir;}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,0),a=this.a0*(1-this.t/this.life);try{const e={st:this.st,d:this.d,f:this.f};drawFrame(e,x,y,a,null,this.tint?tinted(e,this.tint):null);}catch(_){}}}
/* travelling blade wave: hits each enemy once */
class KtWave{constructor(o){Object.assign(this,{t:0,layer:'top',speed:620,len:220,w:26,z:28,col:KTC.sakura,core:'#ffffff',hits:new Set(),R:34,mult:1,key:'kaCrescent',heavy:false},o);this.life=this.len/this.speed;this.x0=this.x;this.y0=this.y;}
  update(dt){const d0=this.t*this.speed;this.t+=dt;const d1=Math.min(this.len,this.t*this.speed),c=Math.cos(this.phi),s=Math.sin(this.phi);
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(this.mult>0&&distToSeg(e.x,e.y,this.x0+c*d0,this.y0+s*d0,this.x0+c*d1,this.y0+s*d1)<e.r+this.w){this.hits.add(e);ktHit(e,this.mult,this.key,this.o||{});if(this.onHit)this.onHit(e);if(this.heavy)ktEmbers(e.x,e.y,26,5);else ktPetals(e.x,e.y,26,4);}}
    this.x=this.x0+c*d1;this.y=this.y0+s*d1;if(Math.random()<Q.p*(window.KTV?.28:.8)){if(this.heavy)ktEmbers(this.x,this.y,this.z,1,60);else ktPetals(this.x,this.y,this.z,1,40);}return this.t<this.life;}
  draw(){if(ktV('wave',this))return;const [x,y]=P(this.x,this.y,this.z),a=Math.min(1,(this.life-this.t)*6),R=this.R,c=ktScr(this.phi);
    if(ktDraw(this.heavy?'06_onislash':'03_wave',x,y,this.heavy?R*3.4:R*4.2,{rot:c,a,ax:this.heavy?.55:.62}))return;
    ctx.save();ctx.translate(x,y);ctx.rotate(c);ctx.scale(.55,1);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,R*.4,0,0,R);g.addColorStop(0,hexA(this.core,0));g.addColorStop(.75,hexA(this.col,.8*a));g.addColorStop(1,hexA(this.core,a));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,-1.3,1.3);ctx.arc(-R*.45,0,R*.85,1.2,-1.2,true);ctx.closePath();ctx.fill();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* ground crack line for Quake Slash */
class KtQuake{constructor(o){Object.assign(this,{t:0,layer:'ground',speed:560,len:280,w:30,hits:new Set(),mult:2,key:'kbQuake'},o);this.T=this.len/this.speed;this.life=this.T+.8;}
  update(dt){const d0=Math.min(this.len,this.t*this.speed);this.t+=dt;const d1=Math.min(this.len,this.t*this.speed),c=Math.cos(this.phi),s=Math.sin(this.phi);
    if(d1>d0){for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(distToSeg(e.x,e.y,this.x+c*d0,this.y+s*d0,this.x+c*d1,this.y+s*d1)<e.r+this.w){this.hits.add(e);ktHit(e,this.mult,this.key);ktEmbers(e.x,e.y,10,6);}}
      if(ktV('quakeFront',this,d1,dt)){}else if(Math.random()<Q.p*1.5){rocks(this.x+c*d1,this.y+s*d1,2,140);dustPuff(this.x+c*d1,this.y+s*d1,2,'#8a6a5a',60,9);}}return this.t<this.life;}
  draw(){if(ktV('quakeDraw',this))return;const d=Math.min(this.len,this.t*this.speed),a=this.t<this.T?1:Math.max(0,1-(this.t-this.T)/.8),c=Math.cos(this.phi),s=Math.sin(this.phi);
    {const [x0,y0]=P(this.x,this.y);if(ktDraw('10_quake',x0,y0,this.len,{rot:ktScr(this.phi),ax:0,clip:d/this.len,a,sq:Math.max(.55,Math.abs(Math.cos(this.phi))*.4+.6)}))return;}
    ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#2a1612';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=d;i+=14){const j=(i%28?5:-5),[x,y]=P(this.x+c*i-s*j,this.y+s*i+c*j);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(KTC.oni2,.7*a);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* straw hat boomerang */
class KtKasa{constructor(o){Object.assign(this,{t:0,layer:'top',len:240,speed:520,z:34,out:new Set(),back:new Set()},o);this.T=this.len/this.speed;this.life=this.T*2+.1;this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;const goingOut=this.t<this.T,k=goingOut?this.t/this.T:Math.max(0,1-(this.t-this.T)/this.T);const px=goingOut?this.x0:player.x,py=goingOut?this.y0:player.y;
    this.x=px+Math.cos(this.phi)*this.len*eOut(k);this.y=py+Math.sin(this.phi)*this.len*eOut(k);const set=goingOut?this.out:this.back;
    for(const e of enemies){if(e.dead||set.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+26){set.add(e);ktHit(e,KB.kcKasa.dmg,'kcKasa');if(!goingOut&&!e.boss){const a=Math.atan2(player.y-e.y,player.x-e.x);e.x+=Math.cos(a)*KB.kcKasa.pull;e.y+=Math.sin(a)*KB.kcKasa.pull;}sparks(e.x,e.y,26,rnd(0,TAU),3,'#e8c890',160,Math.PI);ktV('kasaHit',e,goingOut);}}
    return this.t<this.life;}
  draw(){if(ktV('kasaDraw',this))return;const [x,y]=P(this.x,this.y,this.z),r=this.t*26;if(ktDraw('18_kasa',x,y,48,{rot:r,sq:.5}))return;ctx.save();ctx.translate(x,y);ctx.scale(1,.42);ctx.rotate(r);
    ctx.fillStyle='#d8a85a';ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#a8783a';ctx.lineWidth=1.2;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(i*TAU/8)*20,Math.sin(i*TAU/8)*20);ctx.stroke();}
    ctx.fillStyle='#c0303a';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.restore();}}
/* charge aura: gathering ring + stage marks */
class KtCharge{constructor(o){Object.assign(this,{t:0,layer:'top',T:1.1,col:KTC.oni},o);this.life=this.T+.05;this.st=0;}
  update(dt){this.t+=window.KTV&&KTV.on&&typeof ACTION_TEMPO==='number'?dt*ACTION_TEMPO:dt;ktV('chargeTick',this,dt);const st=this.t>=this.T?2:this.t>=this.T*.45?1:0;if(st>this.st){this.st=st;ktV('chargeStage',this,st);addFx(new DText({x:player.x,y:player.y,z:100,text:st===2?'ชาร์จ Ⅱ':'ชาร์จ Ⅰ',color:st===2?KTC.oni2:KTC.ember,size:13,life:.6}));addFx(new GRing({x:player.x,y:player.y,r0:40,r1:8,w:4,color:this.col,life:.25}));}
    if(Math.random()<Q.p*1.4){const a=rnd(0,TAU),r=rnd(40,70);emit({type:'ember',x:player.x+Math.cos(a)*r,y:player.y+Math.sin(a)*r,z:rnd(10,50),vx:-Math.cos(a)*r*2.5,vy:-Math.sin(a)*r*2.5,vz:20,drag:1,life:.35,size:2,size1:.3,color:this.col});}
    return this.t<this.life&&player.action&&player.action===this.a;}
  draw(){if(ktV('chargeDraw',this))return;const k=Math.min(1,this.t/this.T),[x,y]=P(player.x,player.y,0);if(ktDraw('08_charge',x,y,(150-50*k)*(1+.04*Math.sin(this.t*30)),{a:.45+.5*k,sq:.9,gspin:this.t*(4+10*k)})){if(this.st===2)ktDraw('08_charge',x,y,100,{a:.35+.25*Math.sin(this.t*40),add:1,sq:.9,gspin:-this.t*8});return;}ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    ctx.strokeStyle=hexA(this.col,.25+.5*k);ctx.lineWidth=2+3*k;ctx.beginPath();ctx.arc(0,0,60-34*k,0,TAU);ctx.stroke();ctx.restore();ctx.globalCompositeOperation='source-over';}}
/* auras under / around the cat: Ki Gather mist, Ashura fire column (drawn on the ground layer so the cat stays in front) */
class KtGroundAura{constructor(){this.t=0;this.layer='ground';this.ki=0;this.ash=0;}update(dt){this.t+=dt;const f=(v,on)=>Math.max(0,Math.min(1,v+(on?dt*4:-dt*3)));this.ki=f(this.ki,hasBuff('knKi'));this.ash=f(this.ash,hasBuff('kbAshura'));return CHAR==='cat';}
  draw(){const [x,y]=P(player.x,player.y,0);
    if(ktV('groundAura',this,x,y))return;
    if(this.ki>0)ktDraw('17_ki',x,y,120*(1+.03*Math.sin(this.t*3)),{a:.85*this.ki,gspin:this.t*.8});
    if(this.ash>0)ktDraw('16_aura',x,y+6,120*(1+.04*Math.sin(this.t*12)),{a:.8*this.ash,ay:.9,fx:Math.sin(this.t*7)>0});}}
/* overlay: Flow pips under the cat, Momentum, Stance, def-down marks */
class KtOverlay{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;return CHAR==='cat';}
  draw(){const [x,y]=P(player.x,player.y,0);if(ktV('overlay',this,x,y))return;
    if(CAT.flow>0){const n=CAT.flow,cap=ktFlowCap();for(let i=0;i<cap;i++){const on=i<n,ax=x-(cap-1)*3.2+i*6.4;ctx.fillStyle=on?(n>=10?KTC.sakura2:KTC.sakura):'rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(ax,y+12,on?2.2:1.4,0,TAU);ctx.fill();}}
    if(CAT.mom>0){ctx.fillStyle=KTC.oni2;ctx.font='700 9px Cinzel, serif';ctx.textAlign='center';ctx.fillText('MOM '+CAT.mom,x,y+24);ctx.textAlign='start';}
    if(CAT.stance){ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.strokeStyle=hexA(KTC.oni2,.6+.3*Math.sin(this.t*10));ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,34,0,TAU);ctx.stroke();ctx.restore();
      ctx.fillStyle='#fff';ctx.font='700 10px Cinzel, serif';ctx.textAlign='center';ctx.fillText('×'+CAT.stanceN,x,y-92);ctx.textAlign='start';}
    if(CAT.stance){const [dx,dy]=P(player.x,player.y,0);ktDraw('19_dome',dx,dy,130*(1+.03*Math.sin(this.t*6)),{a:.55,ay:.8});}
    if(CAT.lunge&&!CAT.lunge.e.dead){const e=CAT.lunge.e,[mx,my]=P(e.x,e.y,(e.boss?84:56)+4*Math.sin(this.t*5));ktDraw('05_mark',mx,my,34,{rot:this.t*2,a:.95});}
    for(const e of enemies){if(e.dead||!(e.ktDefT>gameTime))continue;const [ex,ey]=P(e.x,e.y,(e.boss?70:46));ctx.fillStyle=KTC.oni2;ctx.font='700 9px Cinzel, serif';ctx.textAlign='center';ctx.fillText('DEF −'+e.ktDef,ex,ey);ctx.textAlign='start';}}}
/* per-frame state: Flow decay, Momentum, Ki, Ashura, Stance, Lunge timeout, Gale counter, Cloak */
class KtCore{constructor(){this.t=0;this.layer='none';}draw(){}
  update(dt){this.t+=dt;window.__KTSELF=1;try{this.tick(dt);}finally{window.__KTSELF=0;}return CHAR==='cat';}
  tick(dt){if(!this.ov||!fx.includes(this.ov))this.ov=addFx(new KtOverlay());if(!this.ga||!fx.includes(this.ga))this.ga=addFx(new KtGroundAura());
    const A=player.action;if(CAT.charging&&!(A&&(A.ktCharge!=null||A.key==='kcAvalanche')))CAT.charging=0;
    if(player.jgHide&&!(A&&A.key==='kaHana')){player.jgHide=false;skyDarkT=0;}
    if(CAT.flow>0&&gameTime-CAT.lastHit>ktDecay()&&!(ktL('kaUnbroken')&&player.moving))CAT.flow=0;
    if(CAT.flow>ktFlowCap())CAT.flow=ktFlowCap();
    if(CAT.mom>0&&gameTime-CAT.momT>KB.kbMomentum.dur)CAT.mom=0;
    if(hasBuff('knKi')){if(player.moving||(player.action&&player.action.key!=='knKi')){delete player.buffs.knKi;}
      else{player.mp=Math.min(player.maxMp,player.mp+ktLv(KB.knKi.sp,'knKi')*dt);if(ktL('kcStill')){player.hp=Math.min(player.maxHp,player.hp+PS.lv*KB.kcStill.hpPerLv*dt);if(player.buffs.dbSlow)delete player.buffs.dbSlow;}
        if(!window.KTV&&Math.random()<Q.p*.5)emit({type:'mist',x:player.x+rnd(-14,14),y:player.y,z:rnd(10,40),vz:20,life:.8,size:6,size1:12,color:'#d8e8ff'});}}
    const ash=hasBuff('kbAshura');if(ash){player.mp=Math.min(player.maxMp,player.mp+KB.kbAshura.sp*dt);if(!window.KTV&&Math.random()<Q.p)ktEmbers(player.x,player.y,rnd(20,60),1,40);}
    if(CAT.ashura&&!ash){CAT.ashura=false;ktAshuraEnd();}CAT.ashura=ash;
    const st=hasBuff('kcStance');if(CAT.stance&&!st)ktStanceRelease();CAT.stance=st;
    if(CAT.lunge&&(CAT.lunge.until<gameTime||CAT.lunge.e.dead)){CAT.lunge=null;player.cd.kcLunge=KB.kcLunge.cd;}
    if(CAT.galeFire){const e=CAT.galeFire;CAT.galeFire=null;if(!e.dead){endAction();startAction(ktGaleStrike(e));}}
    if(ktL('knCloak')&&CAT.cloakT<=gameTime){for(const k in player.buffs){if(k.startsWith('db')&&player.buffs[k].t>0){delete player.buffs[k];CAT.cloakT=gameTime+ktLv(KB.knCloak.icd,'knCloak');addFx(new DText({x:player.x,y:player.y,z:84,text:'ปัดดีบัฟ',color:'#f4e8d0',size:12,life:.8}));ktV('cloak');break;}}}}}

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
/* generic sword strike on the attack clip (re-uses the engine's crStrike timeline + the sprite slash arc) */
function ktStrike(o){const n=o.n||1,a=crStrike(Object.assign({midSpeed:2.6,lastSpeed:1.25},o,{
  vfx:(a,i,last)=>{const ph=o.phi!=null?o.phi:player.phi;if(ktV('swing',{a,i,last,phi:ph,heavy:!!o.heavy,key:o.key,o})){}else if(ktImg(o.heavy?'06_onislash':'01_slash'))ktSlashImg(player.x,player.y,ph,o.heavy?(last?170:150):(last?125:110),o.heavy,i%2,o.slash&&o.slash.rot<-1?{rot:ktScr(ph)-1.2}:{});
    else try{const k=seqIndex(a.seq,'attack',CT(atkDir(player.dir)),i);slashAt(a,k,Object.assign({W:o.heavy?20:12,colors:o.heavy?KT_ONI:KT_SAKURA,hold:.03,fade:o.heavy?.22:.14,streaks:o.heavy?6:3,dissolve:o.heavy?KTC.oni2:KTC.sakura,rot:(i%2?.3:-.25)},o.slash||{}));}catch(_){}if(o.vfx2)o.vfx2(a,i,last);}}));return a;}
/* charged strike: hold the wind-up pose while charging (super armour with Iron Body), then strike */
function ktCharged(o){const T=ktChargeT(o.three),mul=o.three?KT_BAL.charge.mul3:KT_BAL.charge.mul;
  const a=ktStrike(Object.assign({},o,{heavy:true,windHold:Math.round(T*1000),lastSpeed:1.1,lastShake:4,lastStop:90,
    each:(a,e,i,last)=>o.each(a,e,i,last,mul),extra:Object.assign({ktCharge:T},o.extra||{})}));
  const ev0={t:0,f:a2=>{CAT.charging=1;if(T>0){addFx(new KtCharge({T,a:a2,col:o.three?KTC.oni2:KTC.oni}));if(ktL('kbIron')||CAT.ashura)addBuff('rhSA',T+.1);}}};
  const ev1={t:Math.max(0,a.windup-.01),f:()=>{CAT.charging=0;}};a.events=[ev0,ev1].concat(a.events||[]);
  const _end=a.onEnd;a.onEnd=()=>{CAT.charging=0;_end&&_end();};return a;}
/* dash helper (used by Cat Step / Mirage / Roll) */
function ktDash(key,name,phi,L,T,iframe,o={}){faceTo(phi);const d=player.dir,s=seq(o.st||'walk',d,0,null,o.speed||3),sx=player.x,sy=player.y,[dx,dy]=ktPathEnd(sx,sy,phi,L);
  if(ktV('dash',key,sx,sy,dx,dy,phi,T,o)){}else{ktDust(sx,sy,2,14);if(ktImg('24_speed'))addFx(new KtImg({n:'24_speed',x:(sx+dx)/2,y:(sy+dy)/2,z:26,w:Math.max(80,Math.hypot(dx-sx,dy-sy)*1.1),rot:ktScr(phi),life:.3,s0:.9,s1:1.05,fadeIn:.001,fadeOut:.7,a0:.85}));}let gT=0;
  return act(Object.assign({key,name,seq:s,windup:0,dur:Math.min(seqTotal(s),T+.08),hitList:[],update:(a,dt)=>{player.iframes=a.t<iframe?.06:0;gT-=dt;if(gT<=0&&a.t<T){gT=.035;addFx(new KtGhost({x:player.x,y:player.y,st:player.st||'walk',f:player.f||0,life:.28,a0:.45}));}dashUpd(a,dt,0,T,sx,sy,dx,dy,o.col||'#ffffff',o.arc||0);if(ktV('dashTick',key,a,dt,T)){}else if(Math.random()<Q.p*1.2)(o.heavy?ktEmbers:ktPetals)(player.x,player.y,20,1,50);if(o.update)o.update(a,dt);}},o.extra||{}));}

/* ---------- normal attack: Paw-Blade Combo ---------- */
function mkKtBasic(tgt){const lv=Math.max(1,ktL('knCombo')),chain=KB.knCombo.chain[lv-1];if(gameTime-player.basicLast>1.1||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,fin=lv>=4&&idx===chain-1,phi=angTo(tgt);faceTo(phi);const d=atkDir(player.dir),c=CT(d),sp=aspd();
  const s=fin?seq('attack',d,0,null,1.1*sp):(idx%2?seq('attack',d,c-2,null,2.4*sp):seq('attack',d,c-3,null,2*sp));const kC=seqIndex(s,'attack',c),tC=seqTimeAt(s,kC);
  return act({key:'basic',name:fin?'Paw-Blade · Finish':'Paw-Blade '+(idx+1),seq:s,windup:tC,dur:seqTimeAt(s,kC+2),hitList:[],
    events:[{t:seqTimeAt(s,kC-1),f:a=>{if(ktV('basic',a,idx,fin,phi,tC)){}else if(ktImg('01_slash'))ktSlashImg(player.x,player.y,phi,fin?135:100,false,idx%2,{life:fin?.26:.2});else try{slashAt(a,kC,{W:fin?18:10,colors:KT_SAKURA,hold:.03,fade:fin?.2:.12,streaks:fin?6:3,dissolve:fin?KTC.sakura:null,rot:[0,.32,-.3,0][idx]});}catch(_){}}},
      {t:tC,f:a=>{const R=fin&&ktL('kcCrescent')?KB.kcCrescent.R:0;const hits=R?ktNear(player.x,player.y,R):(!tgt.dead&&dist(player,tgt)<=BASIC_RANGE+40+tgt.r?[tgt]:[]);
        for(const e of hits){ktHit(e,fin?KB.knCombo.fin:KB.knCombo.hit,'basic',{auto:true,knock:[angTo(e),fin?160:35],big:fin,ktFin:fin});if(!window.KTV)metalHit(e,angTo(e),fin);a.hitList.push(e);}
        if(hits.length){a.hitConfirmed=true;shake(fin?3.5:1.1);stop(fin?70:28);}if(R&&!ktV('crescentFinish',player.x,player.y,R,phi)){addFx(new GRing({x:player.x,y:player.y,r0:10,r1:R,w:7,color:KTC.sakura,life:.3}));ktPetals(player.x,player.y,24,10,160);}
        player.basicIdx=idx+1;player.basicLast=gameTime;}}]});}

/* ---------- BASIC actives ---------- */
function mkKnStep(c){const phi=c&&c.phi!=null?c.phi:player.phi;return ktDash('knStep','Cat Step',phi,KB.knStep.dist,.22,.2);}
function mkKnSheath(c){const t=ktTgt(c,KB.knSheath.range);const phi=ktPhi(c,t);return ktStrike({key:'knSheath',name:'Sheath Strike',phi,heavy:true,lastShake:3,
  hits:()=>ktCone(phi,KB.knSheath.range,.6).slice(0,1),each:(a,e)=>{ktHit(e,ktLv(KB.knSheath.dmg,'knSheath'),'knSheath',{knock:[angTo(e),120],big:true});if(!window.KTV)metalHit(e,angTo(e),true);}});}
function mkKnKi(c){return buffAct({key:'knKi',name:'Ki Gather',speed:2.4,glow:'#d8e8ff',events:tP=>[{t:tP*.5,f:()=>{addBuff('knKi',KB.knKi.dur);if(!ktV('kiStart'))addFx(new GRing({x:player.x,y:player.y,r0:50,r1:10,w:3,color:'#d8e8ff',life:.4}));}}]});}
function mkKnFocus(c){return buffAct({key:'knFocus',name:'Feline Focus',speed:2,glow:KTC.gold,events:tP=>[{t:tP,f:()=>{addBuff('knFocus',KB.knFocus.dur);if(!ktV('focus'))addFx(new GRing({x:player.x,y:player.y,r0:8,r1:60,w:5,color:KTC.gold,life:.35}));}}]});}

/* ---------- A · KAZE RONIN ---------- */
function mkKaSwift(c){const t=ktTgt(c,KB.kaSwift.range);if(!t)return null;const phi=angTo(t),sx=player.x,sy=player.y,L=Math.max(0,dist(player,t)-t.r-26),[dx,dy]=ktPathEnd(sx,sy,phi,L);let n=0;
  return ktStrike({key:'kaSwift',name:'Swift Draw',phi,n:2,midSpeed:2.8,lastSpeed:1.6,update:(a,dt)=>dashUpd(a,dt,0,window.KTV&&KTV.on?.028:.12,sx,sy,dx,dy,KTC.sakura),events:[{t:0,f:()=>ktV('swiftStart',sx,sy,dx,dy,phi)}],
    hits:()=>(!t.dead&&dist(player,t)<=t.r+70)?[t]:[],each:(a,e,i)=>{ktHit(e,ktLv(KB.kaSwift.dmg,'kaSwift'),'kaSwift',{ktStack:n++,knock:[phi,i?60:15]});ktPetals(e.x,e.y,26,3);}});}
function mkKaSwallow(c){const t=ktTgt(c,KB.kaSwallow.range);const phi=ktPhi(c,t);let n=0;
  return ktStrike({key:'kaSwallow',name:'Swallow Cuts',phi,n:4,midSpeed:3,lastSpeed:1.7,hits:()=>ktCone(phi,KB.kaSwallow.range,.7).slice(0,3),
    each:(a,e,i)=>{ktHit(e,ktLv(KB.kaSwallow.dmg,'kaSwallow'),'kaSwallow',{ktStack:n++,knock:[phi,12]});ktPetals(e.x,e.y,26,2);}});}
function mkKaReturn(c){const t=(c.action&&c.action.hitList||[]).find(e=>!e.dead)||ktTgt(c,140);if(!t)return null;const phi=angTo(t),back=phi+Math.PI,sx=player.x,sy=player.y,[dx,dy]=ktPathEnd(sx,sy,back,120);
  return ktStrike({key:'kaReturn',name:'Wind Return',phi,lastSpeed:1.5,update:(a,dt)=>{if(a.t>a.windup)dashUpd(a,dt,a.windup,a.windup+.2,sx,sy,dx,dy,KTC.sakura,26);},
    hits:()=>ktCone(phi,120,.8).slice(0,3),each:(a,e)=>{ktHit(e,KB.kaReturn.dmg,'kaReturn',{knock:[phi,80]});},
    after:(a,hit)=>{ktAddFlow(KB.kaReturn.flow);ktV('returnAfter',sx,sy,dx,dy,phi);addFx(new KtGhost({x:sx,y:sy,life:.5}));ktLater(.18,()=>{for(const e of ktNear(sx,sy,90)){ktHit(e,KB.kaReturn.ghost,'kaReturn',{ktEcho:1});addFx(new KtArc({x:e.x,y:e.y,phi:angTo(e),col:KTC.sakura}));}});}});}
function mkKaMirage(c){const near=nearestEnemy(player.x,player.y,220),phi=near?Math.atan2(player.y-near.y,player.x-near.x):(c&&c.phi!=null?c.phi:player.phi),sx=player.x,sy=player.y;
  addFx(new KtGhost({x:sx,y:sy,st:'idle',f:0,life:.6,a0:.6}));
  return ktDash('kaMirage','Mirage Step',phi,KB.kaMirage.dist,.2,ktLv(KB.kaMirage.iframe,'kaMirage'),{extra:{events:[{t:.3,f:()=>{for(const e of ktNear(sx,sy,80)){ktHit(e,KB.kaMirage.ghost,'kaMirage',{ktEcho:1});addFx(new KtArc({x:e.x,y:e.y,phi:rnd(0,TAU),col:KTC.sakura}));}if(!ktV('mirageBurst',sx,sy))ktPetals(sx,sy,24,8,120);}}]}});}
function mkKaSakura(c){return buffAct({key:'kaSakura',name:'Sakura Dance',speed:2,glow:KTC.sakura,events:tP=>[{t:tP,f:()=>{addBuff('kaSakura',KB.kaSakura.dur);if(ktV('sakuraOn'))return;ktPetals(player.x,player.y,40,24,180);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:90,w:6,color:KTC.sakura,life:.4}));}}]});}
function mkKaCrescent(c){const t=ktTgt(c,KB.kaCrescent.range);const phi=ktPhi(c,t);
  return ktStrike({key:'kaCrescent',name:'Crescent Wind',phi,lastSpeed:1.4,hits:()=>[],each:()=>{},
    after:()=>{addFx(new KtWave({x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,phi,len:KB.kaCrescent.len,mult:ktLv(KB.kaCrescent.dmg,'kaCrescent'),key:'kaCrescent'}));}});}
function mkKaPetals(c){const T=ktNear(player.x,player.y,KB.kaPetals.R).sort((a,b)=>dist(a,player)-dist(b,player)).slice(0,KB.kaPetals.n);if(!T.length)return null;
  const sx=player.x,sy=player.y,d=player.dir,ct=CT(atkDir(d));let s=[];T.forEach(()=>{s=s.concat(seq('attack',atkDir(d),ct-1,ct+1,3.2));});s=s.concat(seq('attack',atkDir(d),ct+1,null,1.6));
  CAT.petalHit=[];const ev=T.map((e,i)=>({t:seqTimeAt(s,seqIndex(s,'attack',ct,i)),f:a=>{if(e.dead)return;const an=rnd(0,TAU),px=player.x,py=player.y;player.x=e.x+Math.cos(an)*(e.r+18);player.y=e.y+Math.sin(an)*(e.r+18);faceTo(angTo(e));ktV('petalCut',e,px,py,i);
    addFx(new KtGhost({x:player.x,y:player.y,life:.3}));for(let j=0;j<2;j++){ktHit(e,ktLv(KB.kaPetals.dmg,'kaPetals'),'kaPetals',{knock:[angTo(e),10]});}addFx(new KtArc({x:e.x,y:e.y,phi:angTo(e),col:KTC.sakura,R:40}));ktPetals(e.x,e.y,26,6);
    CAT.petalHit.push(e);a.hitList.push(e);a.hitConfirmed=true;shake(1);stop(24);}}));
  ev.push({t:seqTotal(s)-.05,f:()=>{ktV('petalBack',player.x,player.y,sx,sy);player.x=sx;player.y=sy;}});
  return act({key:'kaPetals',name:'Thousand Petals',seq:s,windup:0,dur:seqTotal(s),hitList:[],update:()=>{player.iframes=.05;},events:ev});}
function mkKaPetalFall(c){const list=(CAT.petalHit||[]).filter(e=>!e.dead);if(!list.length)return null;
  return buffAct({key:'kaPetalFall',name:'Petal Fall',speed:2.4,glow:KTC.sakura,events:tP=>[{t:.01,f:()=>ktV('petalFallStart',list,tP)},{t:tP,f:()=>{for(const e of list){ktHit(e,KB.kaPetalFall.dmg,'kaPetalFall',{big:true});ktV('petalFallHit',e);addFx(new KtImg({n:'04_xslash',x:e.x,y:e.y,z:30,w:e.boss?150:110,life:.45,s0:.6,s1:1.1,glow:.9,fadeIn:.001}));ktSpark(e,false,true);addFx(new KtArc({x:e.x,y:e.y,phi:rnd(0,TAU),R:56,w:14,col:KTC.sakura2,life:.35}));ktPetals(e.x,e.y,26,12,200);}shake(2.5);stop(60);}}]});}
function mkKaGale(c){return buffAct({key:'kaGale',name:'Gale Counter',speed:1.6,glow:'#ffffff',events:tP=>[{t:.02,f:()=>{CAT.gale=gameTime+KB.kaGale.win;ktV('galeStance',KB.kaGale.win);addFx(new GRing({x:player.x,y:player.y,r0:40,r1:30,w:3,color:'#ffffff',life:KB.kaGale.win}));}}]});}
function ktGaleStrike(e){const an=angTo(e),bx=e.x+Math.cos(an)*(e.r+20),by=e.y+Math.sin(an)*(e.r+20);addFx(new KtGhost({x:player.x,y:player.y,life:.35}));ktV('blink',player.x,player.y,bx,by,'wind');player.x=bx;player.y=by;const phi=Math.atan2(e.y-by,e.x-bx);
  addFx(new DText({x:player.x,y:player.y,z:90,text:'GALE COUNTER',color:'#ffffff',size:13,life:.9}));
  return ktStrike({key:'kaGale',name:'Gale Counter',phi,n:KB.kaGale.n,midSpeed:3.4,lastSpeed:1.6,hits:()=>!e.dead?[e]:[],each:(a,t)=>{ktHit(t,KB.kaGale.dmg,'kaGale');ktPetals(t.x,t.y,26,2);}});}
function mkKaTempest(c){const t=ktTgt(c,KB.kaTempest.range);if(!t)return null;const max=ktL('kcOverflow')?KB.kcOverflow.max:KB.kaTempest.max;
  const n=Math.max(KB.kaTempest.min,Math.min(max,CAT.flow));CAT.flow=ktL('kcOverflow')?Math.floor(CAT.flow/2):0;const sx=player.x,sy=player.y,d=atkDir(player.dir),ct=CT(d);let s=[];
  for(let i=0;i<n;i++)s=s.concat(seq('attack',d,ct,ct,4));s=s.concat(seq('attack',d,ct+1,null,1.5));
  if(window.KTV&&KTV.on){const tot=seqTotal(s),tail=Math.min(.16,tot*.35),iv=(tot-tail)/n*1000,tl=seq('attack',d,ct+1,null,1.5),k=tail/Math.max(.001,seqTotal(tl));s=[];for(let i=0;i<n;i++)s=s.concat(hold('attack',d,ct,iv));for(const q of tl)s.push({st:q.st,d:q.d,f:q.f,ms:q.ms*k});}
  const tEnd=seqTimeAt(s,n);const ev=[];for(let i=0;i<n;i++)ev.push({t:seqTimeAt(s,i),f:a=>{if(t.dead)return;const an=rnd(0,TAU);addFx(new KtGhost({x:player.x,y:player.y,life:.22,a0:.4}));player.x=t.x+Math.cos(an)*(t.r+22);player.y=t.y+Math.sin(an)*(t.r+22);faceTo(angTo(t));
    ktHit(t,KB.kaTempest.dmg,'kaTempest');if(!ktV('tempestCut',t,i,n,an,tEnd-seqTimeAt(s,i)))addFx(new KtArc({x:t.x,y:t.y,phi:an+Math.PI,col:i%2?KTC.white:KTC.sakura,R:46}));a.hitConfirmed=true;if(i%3===0)shake(1);}});
  ev.push({t:tEnd,f:()=>ktV('tempestEnd',t)});
  ev.push({t:seqTotal(s)-.05,f:()=>{player.x=sx;player.y=sy;}});
  return act({key:'kaTempest',name:'Tempest Iai',seq:s,windup:0,dur:seqTotal(s),hitList:[],update:()=>{player.iframes=.05;},events:ev});}
function mkKaHana(c){const B=KB.kaHana,sx=player.x,sy=player.y,d=player.dir,s=[...hold('buff',d,bPeak(d),B.T*1000*.15),...hold('attack',d,CT(atkDir(d)),B.T*1000*.85)];const ev=[];
  for(let i=0;i<B.n;i++)ev.push({t:.45+i*(B.T-.6)/B.n,f:()=>{const L=ktNear(sx,sy,B.R);if(!L.length)return;const e=L[(Math.random()*L.length)|0],last=i===B.n-1;
    addFx(new KtArc({x:e.x,y:e.y,phi:rnd(0,TAU),col:i%2?KTC.sakura:KTC.white,R:rnd(36,60),w:12}));ktHit(e,B.dmg,'kaHana',last?{cc:{air:1},big:true}:{});ktPetals(e.x,e.y,30,3);if(i%4===0)shake(1.2);}});
  ev.unshift({t:.05,f:()=>{addFx(new KtImg({n:'14_hana',x:sx,y:sy,z:10,w:B.R*1.5,life:B.T-.05,s0:.3,s1:1,a0:.45,fadeIn:.3,fadeOut:.15,gspin:0,gspinV:5,vortex:1,H:110,vc:'#ffe0ec',deb:'petal'}));skyDarkT=.6;addFx(new DText({x:sx,y:sy,z:110,text:'HANAFUBUKI',color:KTC.sakura2,size:18,life:1.6}));}});
  ev.push({t:B.T-.05,f:()=>{skyDarkT=0;CAT.flow=ktFlowCap();CAT.lastHit=gameTime;if(!ktV('hanaEnd',sx,sy,B.R))ktPetals(sx,sy,30,40,260);shake(3);}});
  return act({key:'kaHana',name:'Hanafubuki',seq:s,windup:0,dur:B.T,hitList:[],update:(a)=>{player.iframes=.1;player.jgHide=a.t>.4&&a.t<B.T-.2;if(!window.KTV&&Math.random()<Q.p*2)ktPetals(sx+rnd(-B.R,B.R)*.7,sy+rnd(-B.R,B.R)*.7,rnd(10,60),1,60);},
    onEnd:()=>{player.jgHide=false;skyDarkT=0;},events:ev});}

/* ---------- B · ONI RONIN ---------- */
function ktDefDown(e,v){if(!e||e.dead)return;e.ktDef=Math.max(e.ktDef&&e.ktDefT>gameTime?e.ktDef:0,v);e.ktDefT=gameTime+KB.kbBreaker.dur;}
function ktChargedHit(e,base,mul,key,o={}){ktHit(e,base*mul,key,Object.assign({koMul:KT_BAL.charge.ko,big:true},o));ktSpark(e,true,true);if(mul>1)screenFlash(.12,'#ffb070');if(ktL('kbBreaker'))ktDefDown(e,ktLv(KB.kbBreaker.def,'kbBreaker'));ktEmbers(e.x,e.y,26,6);}
function mkKbCleave(c){const t=ktTgt(c,KB.kbCleave.range);const phi=ktPhi(c,t),base=ktLv(KB.kbCleave.dmg,'kbCleave');
  return ktCharged({key:'kbCleave',name:'Mountain Cleave',phi,hits:()=>ktCone(phi,KB.kbCleave.R,KB.kbCleave.half),each:(a,e,i,last,mul)=>{ktChargedHit(e,base,mul,'kbCleave',{knock:[angTo(e),140]});},
    after:(a,hit)=>{ktV('cleaveAfter',phi);addFx(new Crack({x:player.x+Math.cos(phi)*50,y:player.y+Math.sin(phi)*50,r:50,color:KTC.oni2}));dustPuff(player.x+Math.cos(phi)*50,player.y+Math.sin(phi)*50,8,'#8a6a5a',90,10);
      if(ktL('kcCleaveWind'))addFx(new KtWave({x:player.x+Math.cos(phi)*30,y:player.y+Math.sin(phi)*30,phi,len:KB.kcCleaveWind.len,mult:base*KT_BAL.charge.mul*KB.kcCleaveWind.mul,key:'kcCleaveWind',col:KTC.oni,core:'#fff2d8',heavy:true,R:44,w:30}));}});}
function mkKbRising(c){const t=ktTgt(c,KB.kbRising.range);const phi=ktPhi(c,t);
  return ktStrike({key:'kbRising',name:'Rising Split',phi,heavy:true,lastSpeed:1.3,slash:{rot:-1.2},hits:()=>ktCone(phi,KB.kbRising.range,.7).slice(0,3),
    each:(a,e)=>{ktHit(e,ktLv(KB.kbRising.dmg,'kbRising'),'kbRising',{big:true});ktEmbers(e.x,e.y,20,5);}});}
function mkKbEarth(c){const t=(c.action&&c.action.hitList||[]).find(e=>!e.dead)||ktTgt(c,160);if(!t)return null;const phi=angTo(t),sx=player.x,sy=player.y,[dx,dy]=ktPathEnd(sx,sy,phi,Math.max(0,dist(player,t)-t.r-10));
  return ktStrike({key:'kbEarth',name:'Earthfall',phi,heavy:true,windHold:120,lastShake:5,lastStop:110,update:(a,dt)=>dashUpd(a,dt,0,Math.max(.1,a.windup-.02),sx,sy,dx,dy,KTC.oni,60),
    hits:()=>ktNear(player.x+Math.cos(phi)*20,player.y+Math.sin(phi)*20,KB.kbEarth.R),each:(a,e)=>{ktHit(e,KB.kbEarth.dmg,'kbEarth',{big:true});},
    after:()=>{ktCrater(player.x,player.y,160);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:KB.kbEarth.R+20,w:12,color:KTC.oni2,life:.4}));addFx(new Crack({x:player.x,y:player.y,r:60,color:KTC.oni2}));rocks(player.x,player.y,8,200);}});}
function mkKbSky(c){const t=ktTgt(c,KB.kbSky.range);const phi=ktPhi(c,t),sx=player.x,sy=player.y,L=t?Math.min(KB.kbSky.leap,Math.max(0,dist(player,t)-20)):60,[dx,dy]=ktPathEnd(sx,sy,phi,L),base=ktLv(KB.kbSky.dmg,'kbSky');
  return ktCharged({key:'kbSky',name:'Sky Drop',phi,update:(a,dt)=>{const w=a.windup;if(a.t>w-.28&&a.t<=w)dashUpd(a,dt,w-.28,w,sx,sy,dx,dy,KTC.oni,90);},
    hits:()=>ktNear(player.x,player.y,KB.kbSky.R),each:(a,e,i,last,mul)=>{ktChargedHit(e,base,mul,'kbSky');},
    after:()=>{ktV('skyLand');ktCrater(player.x,player.y,190);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:KB.kbSky.R+30,w:14,color:KTC.oni,life:.45}));addFx(new Crack({x:player.x,y:player.y,r:70,color:KTC.oni2}));rocks(player.x,player.y,10,240);dustPuff(player.x,player.y,12,'#8a6a5a',140,12);}});}
function mkKbRoar(c){return buffAct({key:'kbRoar',name:'Oni Roar',speed:1.8,glow:KTC.oni,events:tP=>[{t:tP,f:()=>{addBuff('kbRoar',KB.kbRoar.dur);addBuff('rhSA',KB.kbRoar.dur);shake(2.5);addFx(new KtImg({n:'12_roar',x:player.x,y:player.y,w:260,sq:.9,life:.6,s0:.35,s1:1.15,fadeOut:.5,glow:.7}));screenFlash(.15,'#ff8a5a');addFx(new GRing({x:player.x,y:player.y,r0:10,r1:120,w:10,color:KTC.oni,life:.45}));ktEmbers(player.x,player.y,40,14,160);}}]});}
function mkKbWheel(c){const d=atkDir(player.dir),ct=CT(d);let s=[];for(let i=0;i<3;i++)s=s.concat(seq('attack',d,ct-1,ct+1,2.2));s=s.concat(seq('attack',d,ct+1,null,1.4));
  const V3=window.KTV&&KTV.on,SP=.11;   /* seconds (action clock) per turn */if(V3){const tot=seqTotal(s),tl=seq('attack',d,ct+1,null,1.4),i0=Math.max(0,DIR8.indexOf(player.dir)),k=Math.max(.05,tot-SP*3)/Math.max(.001,seqTotal(tl));s=[];for(let r=0;r<3;r++)for(let j=0;j<8;j++){const dd=atkDir(DIR8[(i0+j)%8]);s.push({st:'attack',d:dd,f:CT(dd),ms:SP*1000/8});}for(const q of tl)s.push({st:q.st,d:q.d,f:q.f,ms:q.ms*k});}
  const ev=[0,1,2].map(i=>({t:V3?SP*(i+.5):seqTimeAt(s,seqIndex(s,'attack',ct,i)),f:a=>{ktV('wheelHit',i);const L=ktNear(player.x,player.y,KB.kbWheel.R);for(const e of L){ktHit(e,ktLv(KB.kbWheel.dmg,'kbWheel'),'kbWheel',{knock:[angTo(e),10]});if(!e.boss){const an=Math.atan2(player.y-e.y,player.x-e.x);e.x+=Math.cos(an)*14;e.y+=Math.sin(an)*14;}a.hitList.push(e);}
    if(L.length){a.hitConfirmed=true;shake(1.6);stop(30);}addFx(new KtImg({n:'11_wheel',x:player.x,y:player.y,z:22,w:KB.kbWheel.R*2.3,life:.36,s0:.75,s1:1.08,gspin:rnd(0,TAU),gspinV:-14,glow:.6,vortex:1,ring:1,vc:'#ffe2c0',deb:'ember',dc:'#ff9a4a'}));if(!ktImg('11_wheel'))for(let j=0;j<3;j++)addFx(new KtArc({x:player.x,y:player.y,phi:i*2.1+j*2.1,R:KB.kbWheel.R*.8,w:16,col:KTC.oni,core:'#fff2d8',z:26}));ktEmbers(player.x,player.y,24,6,180);}}));
  const w0=ev[0].t;if(V3)for(let i=0;i<3;i++)ev.push({t:SP*i+.001,f:()=>ktV('wheelSpin',i,SP)});
  return act({key:'kbWheel',name:'Grinding Wheel',seq:s,windup:w0,dur:seqTotal(s),hitList:[],events:ev});}
function mkKbFinal(c){const t=(c.action&&c.action.hitList||[]).find(e=>!e.dead)||ktTgt(c,200);const phi=ktPhi(c,t);
  return ktCharged({key:'kbFinal',name:'Final Cleave',phi,hits:()=>ktLine(player.x,player.y,phi,KB.kbFinal.len,24),each:(a,e,i,last,mul)=>{ktChargedHit(e,KB.kbFinal.dmg,mul,'kbFinal',{knock:[phi,160]});},
    after:()=>{ktV('finalAfter',phi,KB.kbFinal.len);addFx(new KtWave({x:player.x,y:player.y,phi,len:KB.kbFinal.len,mult:0,key:'kbFinal',col:KTC.oni,core:'#fff2d8',heavy:true,R:50,w:0,speed:900}));rocks(player.x+Math.cos(phi)*60,player.y+Math.sin(phi)*60,6,200);}});}
function mkKbQuake(c){const t=ktTgt(c,KB.kbQuake.range);const phi=ktPhi(c,t);
  return ktStrike({key:'kbQuake',name:'Quake Slash',phi,heavy:true,windHold:80,lastShake:3,hits:()=>[],each:()=>{},after:()=>{addFx(new KtQuake({x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,phi,len:KB.kbQuake.len,mult:KB.kbQuake.dmg}));}});}
function mkKbExec(c){const t=ktTgt(c,KB.kbExec.range);if(!t)return null;const phi=angTo(t);
  return ktCharged({key:'kbExec',name:'Oni Executioner',phi,three:true,lastShake:6,lastStop:140,hits:()=>(!t.dead&&dist(player,t)<=t.r+KB.kbExec.range)?[t]:[],
    each:(a,e,i,last,mul)=>{ktChargedHit(e,KB.kbExec.dmg,mul,'kbExec',{knock:[phi,200],label:'EXECUTE',labelColor:KTC.oni2});
      if(ktL('kcOni')){ktV('oniImpact',e,KB.kcOni.R);addFx(new KtImg({n:'13_onispirit',x:e.x,y:e.y+4,w:230,ay:.92,life:.75,s0:.8,s1:1.05,fadeIn:.08,fadeOut:.45,glow:.5}));screenFlash(.22,'#ff6a3a');addFx(new GRing({x:e.x,y:e.y,r0:10,r1:KB.kcOni.R,w:16,color:KTC.oni,life:.5}));for(const o of ktNear(e.x,e.y,KB.kcOni.R)){ktHit(o,KB.kcOni.dmg,'kcOni',{big:true});ktDefDown(o,KB.kcOni.def);}ktEmbers(e.x,e.y,40,24,240);}}});}
function mkKbAshura(c){return buffAct({key:'kbAshura',name:'Ashura Mask',speed:1.4,glow:KTC.oni,events:tP=>[{t:.05,f:()=>{skyDarkT=.5;ktV('ashuraStart',tP-.05);addFx(new DText({x:player.x,y:player.y,z:110,text:'ASHURA',color:KTC.oni2,size:18,life:1.5}));}},
  {t:tP,f:()=>{addBuff('kbAshura',KB.kbAshura.dur);addBuff('rhSA',KB.kbAshura.dur);CAT.ashura=true;ktV('ashuraOn');shake(4);screenFlash(.3,'#ff5a2a');ktShock(player.x,player.y,260);addFx(new KtImg({n:'15_mask',x:player.x,y:player.y,z:110,w:90,life:1.3,s0:.4,s1:1.1,rise:24,fadeOut:.4}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:150,w:14,color:KTC.oni,life:.5}));ktEmbers(player.x,player.y,40,30,220);skyDarkT=0;}}]});}
function ktAshuraEnd(){const B=KB.kbAshura;addFx(new DText({x:player.x,y:player.y,z:110,text:'ONI CLEAVE',color:KTC.oni2,size:16,life:1.2}));for(const e of ktNear(player.x,player.y,B.R)){ktHit(e,B.fin,'kbAshura',{cc:{air:1},big:true,koMul:2});}
  ktV('ashuraEnd',B.R);ktCrater(player.x,player.y,240);addFx(new KtImg({n:'15_mask',x:player.x,y:player.y,z:100,w:110,life:.9,s0:1.2,s1:.9,fadeOut:.6}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:B.R+30,w:18,color:KTC.oni,life:.55}));ktEmbers(player.x,player.y,30,40,300);rocks(player.x,player.y,12,260);shake(6);stop(120);}

/* ---------- C · actives ---------- */
function mkKcRoll(c){const phi=c&&c.phi!=null?c.phi:player.phi;player.ccT=0;for(const k of ['dbSlow'])delete player.buffs[k];
  return ktDash('kcRoll','Nekomata Roll',phi,KB.kcRoll.dist,.45,KB.kcRoll.iframe,{st:'hurt',speed:1.6});}
function mkKcKasa(c){const t=ktTgt(c,KB.kcKasa.range);const phi=ktPhi(c,t);return buffAct({key:'kcKasa',name:'Kasa Throw',phi,speed:2.4,glow:'#e8c890',events:tP=>[{t:tP*.6,f:()=>{addFx(new KtKasa({x:player.x,y:player.y,phi,len:KB.kcKasa.len}));}}]});}
function mkKcShadow(c){return buffAct({key:'kcShadow',name:'Shadow Dance',speed:2,glow:KTC.sakura,events:tP=>[{t:tP,f:()=>{addBuff('kcShadow',KB.kcShadow.dur);if(ktV('shadowOn'))return;for(const s of [-1,1])addFx(new KtGhost({x:player.x+s*30,y:player.y,st:'idle',f:0,life:.6}));ktPetals(player.x,player.y,30,16,140);}}]});}
function mkKcLunge(c){const L=CAT.lunge;
  if(L&&L.until>gameTime&&!L.e.dead){CAT.lunge=null;const e=L.e,an=angTo(e),bx=e.x+Math.cos(an)*(e.r+22),by=e.y+Math.sin(an)*(e.r+22);addFx(new KtGhost({x:player.x,y:player.y,life:.4}));ktV('blink',player.x,player.y,bx,by,'wind');player.x=bx;player.y=by;const phi=Math.atan2(e.y-by,e.x-bx);
    return ktStrike({key:'kcLunge',name:'Gale Lunge · Strike',phi,lastSpeed:1.5,hits:()=>!e.dead?[e]:[],each:(a,t)=>{ktHit(t,KB.kcLunge.dmg2,'kcLunge',{big:true,knock:[phi,120]});ktPetals(t.x,t.y,26,10,180);},after:()=>ktAddFlow(KB.kcLunge.flow)});}
  const t=ktTgt(c,KB.kcLunge.range);const phi=ktPhi(c,t);
  return ktStrike({key:'kcLunge',name:'Gale Lunge',phi,lastSpeed:1.5,hits:()=>[],each:()=>{},events:[{t:.01,f:()=>{player.cd.kcLunge=.35;}}],
    after:()=>{let marked=false;addFx(new KtWave({x:player.x,y:player.y,phi,len:KB.kcLunge.len,mult:KB.kcLunge.dmg1,key:'kcLunge',col:'#e8f8ff',onHit:e=>{if(marked)return;marked=true;CAT.lunge={e,until:gameTime+KB.kcLunge.win};ktV('lungeMark',e);addFx(new DText({x:e.x,y:e.y,z:70,text:'MARK',color:'#e8f8ff',size:12,life:1}));}}));
      ktLater(.7,()=>{if(!CAT.lunge)player.cd.kcLunge=Math.max(player.cd.kcLunge||0,KB.kcLunge.cd);});}});}
function mkKcStance(c){if(hasBuff('kcStance')){delete player.buffs.kcStance;return buffAct({key:'kcStance',name:'Mountain Stance · Release',speed:3,glow:KTC.oni,events:()=>[]});}
  return buffAct({key:'kcStance',name:'Mountain Stance',speed:2,glow:KTC.oni,events:tP=>[{t:tP*.5,f:()=>{addBuff('kcStance',KB.kcStance.dur);addBuff('rhSA',KB.kcStance.dur);CAT.stanceN=0;CAT.stance=true;ktV('stanceOn');addFx(new GRing({x:player.x,y:player.y,r0:60,r1:20,w:6,color:KTC.oni2,life:.4}));}}]});}
function ktStanceRelease(){const B=KB.kcStance,n=Math.min(B.cap,CAT.stanceN),m=B.base+B.per*n;CAT.stanceN=0;if(player.buffs.rhSA)player.buffs.rhSA.t=Math.min(player.buffs.rhSA.t,.2);
  addFx(new DText({x:player.x,y:player.y,z:100,text:'COUNTER ×'+n,color:KTC.oni2,size:14,life:1}));for(const e of ktNear(player.x,player.y,B.R)){ktHit(e,m,'kcStance',{big:true,knock:[angTo(e),160]});ktEmbers(e.x,e.y,26,6);}
  ktV('stanceRelease',n,B.R);  addFx(new KtImg({n:'11_wheel',x:player.x,y:player.y,z:20,w:B.R*2.3,life:.45,s0:.6,s1:1.1,gspin:0,gspinV:-16,glow:.8,vortex:1,ring:1,vc:'#ffe2c0',deb:'ember',dc:'#ff9a4a'}));ktShock(player.x,player.y,B.R*2.4);screenFlash(.2,'#ffcf9a');if(!ktImg('11_wheel'))for(let j=0;j<3;j++)addFx(new KtArc({x:player.x,y:player.y,phi:j*2.1,R:B.R*.85,w:18,col:KTC.oni,core:'#fff2d8'}));shake(3.5);stop(80);}
function mkKcAvalanche(c){const t=ktTgt(c,KB.kcAvalanche.range);const phi=ktPhi(c,t),B=KB.kcAvalanche,T=CAT.ashura?0:B.charge;faceTo(phi);const d=player.dir,s=[...hold('attack',d,Math.max(0,CT(atkDir(d))-3),T*1000+1),...seq('walk',d,0,null,3),...seq('attack',atkDir(d),CT(atkDir(d)),null,1.2)];
  const sx=player.x,sy=player.y,[dx,dy]=ktPathEnd(sx,sy,phi,B.len),tRun=T,tEnd=T+.42,drag=new Map();
  return act({key:'kcAvalanche',name:'Avalanche Rush',seq:s,windup:tRun,dur:seqTotal(s),hitList:[],events:[{t:0,f:a=>{if(T>0){addFx(new KtCharge({T,a,col:KTC.oni}));if(ktL('kbIron'))addBuff('rhSA',T+.5);}CAT.charging=T>0?1:0;}},
    {t:tEnd+.02,f:a=>{CAT.charging=0;for(const e of ktNear(player.x,player.y,B.R)){ktHit(e,B.dmg,'kcAvalanche',{big:true,koMul:1.5});a.hitList.push(e);}a.hitConfirmed=true;ktV('avalancheSlam',B.R);ktCrater(player.x,player.y,180);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:B.R+20,w:14,color:KTC.oni,life:.45}));rocks(player.x,player.y,10,240);shake(5);stop(100);}}],
    update:(a,dt)=>{if(a.t<tRun)return;dashUpd(a,dt,tRun,tEnd,sx,sy,dx,dy,KTC.oni);if(a.t<=tEnd){for(const e of ktNear(player.x,player.y,46)){if(e.boss)continue;const n=drag.get(e)||0;e.x=player.x+Math.cos(phi)*(e.r+16);e.y=player.y+Math.sin(phi)*(e.r+16);
      if(n<3&&a.t-tRun>n*.12){drag.set(e,n+1);ktHit(e,B.tick,'kcAvalanche');}}if(ktV('avalancheRun',a,dt,phi,tRun,tEnd)){}else if(Math.random()<Q.p*2)dustPuff(player.x,player.y,2,'#8a6a5a',60,9);}}});}

const KT_MAKE={knStep:mkKnStep,knSheath:mkKnSheath,knKi:mkKnKi,knFocus:mkKnFocus,
  kaSwift:mkKaSwift,kaSwallow:mkKaSwallow,kaReturn:mkKaReturn,kaMirage:mkKaMirage,kaSakura:mkKaSakura,kaCrescent:mkKaCrescent,kaPetals:mkKaPetals,kaPetalFall:mkKaPetalFall,kaGale:mkKaGale,kaTempest:mkKaTempest,kaHana:mkKaHana,
  kbCleave:mkKbCleave,kbRising:mkKbRising,kbEarth:mkKbEarth,kbSky:mkKbSky,kbRoar:mkKbRoar,kbWheel:mkKbWheel,kbFinal:mkKbFinal,kbQuake:mkKbQuake,kbExec:mkKbExec,kbAshura:mkKbAshura,
  kcRoll:mkKcRoll,kcKasa:mkKcKasa,kcShadow:mkKcShadow,kcLunge:mkKcLunge,kcStance:mkKcStance,kcAvalanche:mkKcAvalanche};
const KT_FOLLOW={kaSwallow:['kaReturn',1],kaPetals:['kaPetalFall',1.2],kbRising:['kbEarth',1],kbWheel:['kbFinal',1.1]};
const KT_ZIGZAG=[['kaSwift','kaSwallow'],['kbCleave','kbSky']];

/* =====================================================================
   6. AUTO SKILL (idle play) · HOOKS · INSTALL
   ===================================================================== */
function catAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  if(!t){if(player.mp<player.maxMp*.5&&ready('knKi')&&!hasBuff('knKi'))return castSkill('knKi',{}),true;return false;}
  const d=dist(player,t),near=ktNear(player.x,player.y,220),cast=(k,c)=>{player.attackTarget=t;castSkill(k,c||{target:t,phi:angTo(t)});return true;};
  const cb=player.combo;if(cb&&cb.parent&&SKILLS[cb.parent]&&LV[SKILLS[cb.parent].follow]>0){const fk=SKILLS[cb.parent].follow;if(!(player.cd[fk]>0)&&player.mp>=(SKILLS[fk].mp||0)){useSkill(cb.parent);if(busy())return true;}}
  if(CAT.lunge&&ready('kcLunge'))return cast('kcLunge');
  if(d>200)return false;
  if(player.hp<player.maxHp*.5&&ready('kcStance')&&near.length)return cast('kcStance');
  if((t.boss||near.length>=3)&&ready('kaHana'))return cast('kaHana');
  if((t.boss||near.length>=3)&&ready('kbAshura')&&!hasBuff('kbAshura'))return cast('kbAshura');
  for(const k of ['kbRoar','kaSakura','knFocus','kcShadow'])if(ready(k)&&!hasBuff(k))return cast(k);
  if(near.length>=3){for(const k of ['kaPetals','kbWheel','kcAvalanche','kbSky','kaCrescent','kbQuake'])if(ready(k))return cast(k);}
  if(CAT.flow>=10&&ready('kaTempest'))return cast('kaTempest');
  for(const k of ['kbExec','kbCleave','kaSwallow','kbRising','kaSwift','kaCrescent','kbQuake','kcLunge','kcKasa','knSheath','kbSky','kaPetals','kbWheel','kcAvalanche'])if(ready(k)){const s=SKILLS[k];if(s.type!=='melee'||d<=(s.range||120)+t.r)return cast(k);}
  return false;}

function installCat(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);   // 12 Tails: C Additions at Lv 55 / 60 / 70 / 80 (CTIER_LV is declared later in index.html)
  for(const d of KT_DEFS){const b=KB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:ktIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').slice(0,40),characterId:'white_ronin_cat'};
    if(b.mp!=null)sk.mp=b.mp;const cd=Array.isArray(b.cd)?b.cd:null;if(cd)Object.defineProperty(sk,'cd',{get(){return ktLv(cd,d.key);},enumerable:true,configurable:true});else if(b.cd)sk.cd=b.cd;
    if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(KT_MAKE[d.key])sk.make=KT_MAKE[d.key];
    if(KT_FOLLOW[d.key]){sk.follow=KT_FOLLOW[d.key][0];sk.comboWin=KT_FOLLOW[d.key][1];}
    if(d.parent){sk.parent=d.parent;sk.needHit='hit';}
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${KT_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Addition] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  /* zigzag levels (12 Tails Pummel ⇄ Tower Rush): level n of the second skill needs level n of the first, level n+1 of the first needs level n of the second */
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of KT_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  Object.assign(SK_CC,{knSheath:{flinch:.5},kaSwift:{flinch:.3},kaReturn:{flinch:.35},kaCrescent:{slow:2},kaPetalFall:{flinch:.4},kaGale:{flinch:.3},kaTempest:{flinch:.25},
    kbCleave:{flinch:.5},kbRising:{air:1},kbEarth:{flinch:.5},kbSky:{air:1},kbFinal:{flinch:.5},kbQuake:{slow:2},kbExec:{flinch:.5},kcKasa:{slow:1.5},kcAvalanche:{flinch:.4},kcStance:{flinch:.5},kcOni:{flinch:.4},kcLunge:{flinch:.35}});
  Object.assign(SK_KO,{knSheath:2.2,kaSwift:1,kaSwallow:.9,kaReturn:1.2,kaMirage:.8,kaCrescent:1.2,kaPetals:.9,kaPetalFall:1.6,kaGale:1,kaTempest:.8,kaHana:.6,
    kbCleave:2.4,kbRising:2.4,kbEarth:3.2,kbSky:3.2,kbWheel:1.6,kbFinal:3.2,kbQuake:2.4,kbExec:3.6,kbAshura:4,kcKasa:1.4,kcLunge:1.6,kcStance:2.6,kcOni:2.4,kcAvalanche:2.6,kcCleaveWind:2});
  TABS.length=0;TABS.push({n:'Kaze',keys:['kaSwift','kaSwallow','kaMirage','kaCrescent','kaPetals','kaGale','kaTempest','kaHana','kaSakura','knStep']},
    {n:'Oni',keys:['kbCleave','kbRising','kbSky','kbWheel','kbQuake','kbExec','kbAshura','kbRoar','knSheath','knKi']},
    {n:'Two Tails',keys:['kcRoll','kcKasa','kcShadow','kcLunge','kcStance','kcAvalanche','knFocus']});
  Object.assign(BUFFDEF,{knKi:{n:'Ki Gather',c:'#d8e8ff',i:'KI'},knFocus:{n:'Feline Focus',c:KTC.gold,i:'FOCUS'},kaSakura:{n:'Sakura Dance',c:KTC.sakura,i:'SAKURA'},kbRoar:{n:'Oni Roar',c:KTC.oni,i:'ROAR'},
    kbAshura:{n:'Ashura Mask',c:KTC.oni2,i:'ASHURA'},kcShadow:{n:'Shadow Dance',c:KTC.sakura2,i:'SHADOW'},kcStance:{n:'Mountain Stance',c:KTC.oni2,i:'STANCE'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Wandering Kitten';JOB.hpA=1.3;JOB.hpB=5;JOB.spB=3.2;
  ITEMS.roninKatana={n:'Ronin Katana',slot:'rhand',two:1,kind:'Sword',atk:158,wlv:3,aspd:154,ref:6,cards:2,w:150,b:{},size:{small:1,medium:1,large:.85},d:'คาตานะฝักสีชาดของโรนินพเนจร'};
  ITEMS.hakusenBlade={n:'Hakusen Blade',slot:'rhand',two:1,kind:'Sword',atk:180,wlv:4,aspd:152,ref:4,cards:1,w:160,b:{},size:{small:1,medium:1,large:.85},d:'ดาบเมืองฮาคุเซ็น'};
  EQ.rhand='roninKatana';INV.length=0;INV.push('hakusenBlade','vikinghelm','ringPrec','clipLuck');
  // ---- shared-combat hooks (flat values only) ----
  const flatAtk=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null))||window.SKCTX,br=ktBranch(k);let b=0;
    b+=CAT.flow*KT_BAL.flow.atkPer;
    if(ktL('kaUnbroken'))b+=Math.floor(CAT.flow/5)*ktLv(KB.kaUnbroken.atk,'kaUnbroken');
    if(hasBuff('kbRoar'))b+=ktLv(KB.kbRoar.atk,'kbRoar');
    if(CAT.mom>0)b+=CAT.mom*KB.kbMomentum.atk;
    if(br==='B'){if(ktL('kbGrip'))b+=ktLv(KB.kbGrip.atk,'kbGrip');if(ktL('kbKiBlade'))b+=Math.min(ktLv(KB.kbKiBlade.cap,'kbKiBlade'),Math.floor(player.mp/ktLv(KB.kbKiBlade.per,'kbKiBlade')));}
    if(o&&o.ktStack&&ktL('kcSwallows'))b+=o.ktStack*KB.kcSwallows.atk;return b;};
  window.jgHit=()=>0;
  window.jgCrit=(e,o)=>{let v=0;if(hasBuff('knFocus'))v+=ktLv(KB.knFocus.crit,'knFocus');if(ktL('kaFlowState')&&CAT.flow>=10)v+=ktLv(KB.kaFlowState.crit,'kaFlowState');return v;};
  window.jgCritDmg=()=>0;
  window.jgDmgMul=(e,o)=>{const atk=Math.max(1,o&&o.magic?D.mag:D.patk),b=flatAtk(e,o);let m=(atk+b)/atk;
    if(e&&e.ktDefT>gameTime&&e.ktDef>0){const df=(e.m&&e.m.def)||0;if(df>0&&o)o._defCut=(o._defCut||0)+e.ktDef;}return m;};
  window.jgDmgTaken=()=>1;
  window.jgAbsorb=(d,e)=>{let r=0;if(ktL('knCloak'))r+=ktLv(KB.knCloak.block,'knCloak');if(CAT.charging&&ktL('kbIron'))r+=ktLv(KB.kbIron.block,'kbIron');if(hasBuff('kcStance')){r+=KB.kcStance.block;CAT.stanceN++;}
    d=Math.max(1,d-r);if(ktL('knNine')&&d>=player.hp&&CAT.nineT<=gameTime){CAT.nineT=gameTime+ktLv(KB.knNine.icd,'knNine');d=Math.max(0,player.hp-1);addFx(new DText({x:player.x,y:player.y,z:96,text:'NINE LIVES',color:KTC.gold,size:15,life:1.2}));ktV('nine');player.iframes=Math.max(player.iframes,.6);}return d;};
  window.jgPreHit=(e)=>{if(CAT.gale>gameTime){CAT.gale=0;CAT.galeFire=e;addFx(new DText({x:player.x,y:player.y,z:80,text:'MIKIRI',color:'#ffffff',size:14,life:.8}));return 0;}return 1;};
  window.jgPostHit=()=>{if(hasBuff('knKi'))delete player.buffs.knKi;};
  window.jgMove=()=>{let b=CAT.flow*KT_BAL.flow.movePer;if(ktL('kaFeet'))b+=ktLv(KB.kaFeet.move,'kaFeet');return 1+b/165;};
  window.jgAspd=()=>1;   // attack speed is fixed per character (CHAR_ASPD)
  window.jgRecover=()=>1;window.jgDetect=()=>1;window.jgPlayerAlpha=()=>player.jgHide?.15:1;window.jgBleedMul=()=>1;window.jgSquash=()=>[1,1];window.jgOnSkillHit=()=>{};
  /* every hit: Flow, Echo Blade, Momentum, Ashura echo, Shadow Dance clones */
  window.jgAfterHurt=(e,dmg,crit,o)=>{if(!o||o.dot)return;{const k0=o.skill||(o.auto?'basic':null)||window.SKCTX;if(!ktV('hit',e,k0,!!(crit||o.big),crit,o))ktSpark(e,ktBranch(k0)==='B',!!(crit||o.big));}if(o.ktEcho)return;if(hasBuff('kaSakura')&&!e.dead){CAT.sakN=(CAT.sakN||0)+1;if(CAT.sakN>=KB.kaSakura.every){CAT.sakN=0;setFxTimer(.05,()=>{if(e.dead)return;hurt(e,ktLv(KB.kaSakura.echo,'kaSakura'),{critOK:true,ktEcho:true,br:'A'});ktPetals(e.x,e.y,30,6,120);});}}const k=o.skill||(o.auto?'basic':null)||window.SKCTX,br=ktBranch(k);
    ktAddFlow(1);
    if(ktL('kaEcho')&&(br==='A'||k==='basic')){CAT.echoN++;if(CAT.echoN>=ktLv(KB.kaEcho.every,'kaEcho')){CAT.echoN=0;const ex=e.x,ey=e.y;ktLater(.09,()=>{if(e.dead)return;addFx(new KtGhost({x:ex-Math.cos(player.phi)*24,y:ey-Math.sin(player.phi)*24,life:.3,a0:.45}));ktHit(e,KB.kaEcho.dmg,'kaEcho',{ktEcho:1});addFx(new KtArc({x:e.x,y:e.y,phi:rnd(0,TAU),col:KTC.sakura}));});}}
    if(ktL('kbMomentum')&&(br==='B'||k==='basic')){CAT.mom=Math.min(ktLv(KB.kbMomentum.cap,'kbMomentum'),CAT.mom+1);CAT.momT=gameTime;}
    if(hasBuff('kbAshura')&&br==='B'){ktLater(.12,()=>{if(e.dead)return;ktHit(e,KB.kbAshura.echo,'kbAshura',{ktEcho:1});addFx(new KtArc({x:e.x,y:e.y,phi:rnd(0,TAU),col:KTC.oni,core:'#fff2d8',R:50,w:14}));});}
    if(hasBuff('kcShadow')&&(br==='A'||k==='basic')){for(const s of [-1,1])ktLater(.06+(s+1)*.04,()=>{if(e.dead)return;ktHit(e,KB.kcShadow.dmg,'kcShadow',{ktEcho:1});addFx(new KtArc({x:e.x+s*8,y:e.y,phi:rnd(0,TAU),col:KTC.sakura2,R:34,w:8}));});}};
  window.catAutoTick=catAutoTick;
  mkBasic=mkKtBasic;addFx(new KtCore());for(const n of KT_FX)ktImg(n);
  try{document.title='Aetherfall — White Ronin Cat';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Ronin Cat';if(cl)cl.textContent='Wandering Kitten';}catch(e){}
  window.CAT=CAT;window.KT_DEFS=KT_DEFS;window.KT_BAL=KT_BAL;}

/* =====================================================================
   7. SKILL ICONS (code-drawn SVG, one motif per skill)
   ===================================================================== */
function ktIconSpec(d){const col=d.br==='A'?'#ffd0e4':d.br==='B'?'#ffb08a':d.br==='C'?'#ffe9a8':'#f4efe4',bg=d.br==='A'?'#2a1a24':d.br==='B'?'#2a1210':d.br==='C'?'#2a2214':'#2a2620';
  const svg=ktIconSVG(d,col,bg);if(typeof SKILL_ICON_ART!=='undefined'){SKILL_ICON_ART[d.name]='assets/icons/cat/'+d.key+'.webp';   /* painted icons; code-drawn SVG kept as fallback */
    const im=new Image();im.onerror=()=>{SKILL_ICON_ART[d.name]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);};im.src=SKILL_ICON_ART[d.name];}return ['star',col,bg];}
function ktIconSVG(d,col,bg){const k=d.key,ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const blade=(x1,y1,x2,y2,c='#eef3ff')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x1+(x2-x1)*.22}" y2="${y1+(y2-y1)*.22}" stroke="#c0303a" stroke-width="4" stroke-linecap="round"/>`;
  const arc=(c,r=13,w=3)=>`<path d="M${22-r} ${26} A${r} ${r} 0 0 1 ${22+r} ${26}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const petal=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-4" rx="2.6" ry="4.4" fill="#ffc8de" transform="rotate(${a})"/>`).join('')}<circle r="1.6" fill="#ff8fb8"/></g>`;
  const mount=`<path d="M6 36 L18 16 L24 26 L29 19 L38 36Z" fill="#5a2a22" stroke="${col}" stroke-width="1.4"/>`;
  const flame=(x,y,s=1)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 Q-7 0 -2 -9 Q0 -4 3 -7 Q8 0 0 8Z" fill="#ff5a2a" stroke="#ffb03a" stroke-width="1"/>`;
  const up=`<path d="M22 8 l7 9 h-4 v10 h-6 v-10 h-4z" fill="${col}"/>`;
  const ring=`<circle cx="22" cy="22" r="13" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  const hat=`<path d="M6 28 L22 12 L38 28 Z" fill="#d8a85a" stroke="#5a3a1a" stroke-width="1.4"/><circle cx="22" cy="24" r="2.4" fill="#c0303a"/>`;
  const ghost=(x,o)=>`<g opacity="${o}" transform="translate(${x} 0)"><circle cx="22" cy="14" r="5" fill="#fff"/><path d="M15 36 Q22 18 29 36Z" fill="#fff"/></g>`;
  let g='';
  switch(k){
    case 'knCombo':g=blade(8,34,34,10)+arc('#fff',14,2);break;
    case 'knStep':g=ghost(-8,.3)+ghost(0,.6)+ghost(8,1);break;
    case 'knSheath':g=`<rect x="10" y="20" width="26" height="6" rx="3" fill="#c0303a" transform="rotate(-30 22 22)"/>`+`<path d="M30 10 l4 4" stroke="#ffd36a" stroke-width="2"/>`;break;
    case 'knKi':g=`<circle cx="22" cy="22" r="12" fill="#d8e8ff" opacity=".25"/>`+blade(12,30,32,30,'#dfe8ff')+up;break;
    case 'knFocus':g=`<path d="M8 22 Q22 8 36 22 Q22 36 8 22Z" fill="#1a1620" stroke="#ffd36a"/><ellipse cx="22" cy="22" rx="2.2" ry="7" fill="#ffd36a"/>`;break;
    case 'knCloak':g=`<path d="M10 12 h24 l4 22 l-6 -4 l-4 5 l-4 -5 l-4 5 l-4 -5 l-6 4z" fill="#4a2a20" stroke="${col}"/>`;break;
    case 'knNine':g=[0,1,2].map(i=>`<path d="M${10+i*9} 30 q4 -14 0 -18" stroke="#fff" stroke-width="2.4" fill="none"/>`).join('')+`<text x="30" y="18" font-size="10" fill="#ffd36a" font-weight="700">9</text>`;break;
    case 'kaSwift':g=blade(6,36,36,8)+`<path d="M4 30 h10 M6 24 h8" stroke="#ffc8de" stroke-width="2"/>`;break;
    case 'kaFeet':g=`<path d="M12 32 q4 -6 10 -4 q6 2 10 -4" stroke="#ffc8de" stroke-width="3" fill="none"/>`+petal(30,16,.8);break;
    case 'kaSwallow':g=[0,1,2,3].map(i=>blade(8+i*3,34-i*2,30+i*3,12-i*2,'#fff')).join('');break;
    case 'kaReturn':g=`<path d="M30 30 A10 10 0 1 1 30 14" stroke="#ffc8de" stroke-width="3" fill="none"/><path d="M30 8 l2 7 l-7 -1z" fill="#ffc8de"/>`+ghost(-6,.5);break;
    case 'kaMirage':g=ghost(-8,.35)+ghost(6,1);break;
    case 'kaEcho':g=blade(8,34,34,10,'#fff')+`<g opacity=".45">${blade(14,36,40,12,'#ffc8de')}</g>`;break;
    case 'kaSakura':g=petal(16,16)+petal(28,26)+petal(14,30,.7);break;
    case 'kaCrescent':g=`<path d="M10 34 Q30 30 34 10 Q24 26 10 34Z" fill="#ffc8de"/>`;break;
    case 'kaPetals':g=petal(22,22,1.4)+[0,1,2,3,4].map(i=>`<circle cx="${22+Math.cos(i*1.26)*15}" cy="${22+Math.sin(i*1.26)*15}" r="2" fill="#fff"/>`).join('');break;
    case 'kaPetalFall':g=petal(14,12,.8)+petal(30,18,.8)+petal(20,32,.8)+blade(8,38,36,30,'#fff');break;
    case 'kaFlowState':g=ring+petal(22,22,1);break;
    case 'kaGale':g=`<path d="M8 22 h28" stroke="#fff" stroke-width="2"/><path d="M12 14 q10 -6 20 0 M12 30 q10 6 20 0" stroke="#e8f8ff" stroke-width="2" fill="none"/>`;break;
    case 'kaUnbroken':g=`<path d="M6 22 Q14 12 22 22 T38 22" stroke="#ffc8de" stroke-width="3" fill="none"/>`;break;
    case 'kaTempest':g=[0,60,120].map(a=>`<g transform="rotate(${a} 22 22)">${blade(8,22,36,22,'#fff')}</g>`).join('');break;
    case 'kaHana':g=petal(12,12)+petal(32,14)+petal(22,24,1.3)+petal(12,32)+petal(32,32);break;
    case 'kbCleave':g=blade(10,8,30,36,'#ffe0c8')+`<path d="M8 36 h28" stroke="#ff5a2a" stroke-width="2"/>`;break;
    case 'kbGrip':g=`<rect x="16" y="12" width="12" height="22" rx="3" fill="#c0303a" stroke="#ffd36a"/><path d="M14 18 h16 M14 24 h16 M14 30 h16" stroke="#2a1210" stroke-width="1.6"/>`;break;
    case 'kbRising':g=blade(14,36,30,6,'#ffe0c8')+`<path d="M26 34 v-12 l-4 4 m4 -4 l4 4" stroke="#ff9a3a" stroke-width="2" fill="none"/>`;break;
    case 'kbEarth':g=mount+`<path d="M22 6 v12 l-4 -4 m4 4 l4 -4" stroke="#ff9a3a" stroke-width="2" fill="none"/>`;break;
    case 'kbSky':g=`<path d="M22 4 v14" stroke="#ffe0c8" stroke-width="3"/>`+mount;break;
    case 'kbIron':g=`<path d="M22 6 L36 12 V24 Q36 34 22 40 Q8 34 8 24 V12Z" fill="#5a5a66" stroke="${col}" stroke-width="1.6"/>`;break;
    case 'kbRoar':g=`<path d="M10 14 Q22 4 34 14 L30 32 Q22 38 14 32Z" fill="#c0303a" stroke="#fff" stroke-width="1.2"/><path d="M16 20 l4 2 M28 20 l-4 2" stroke="#fff" stroke-width="2"/>`;break;
    case 'kbKiBlade':g=blade(10,34,34,10,'#ffe0c8')+`<circle cx="22" cy="22" r="14" fill="#6ab0ff" opacity=".2"/>`;break;
    case 'kbWheel':g=[0,90,180,270].map(a=>`<g transform="rotate(${a} 22 22)">${blade(22,22,22,6,'#ffe0c8')}</g>`).join('')+`<circle cx="22" cy="22" r="15" fill="none" stroke="#ff5a2a" stroke-width="1.6"/>`;break;
    case 'kbFinal':g=blade(22,4,22,38,'#ffe0c8')+`<path d="M8 38 h28" stroke="#ff5a2a" stroke-width="3"/>`;break;
    case 'kbBreaker':g=`<path d="M22 6 L36 12 V24 Q36 34 22 40 Q8 34 8 24 V12Z" fill="#3a3a44"/><path d="M14 12 L24 22 L18 26 L28 36" stroke="#ff9a3a" stroke-width="2.4" fill="none"/>`;break;
    case 'kbQuake':g=`<path d="M4 30 L12 26 L18 32 L26 24 L32 30 L40 26" stroke="#ff9a3a" stroke-width="2.4" fill="none"/>`+blade(22,4,22,24,'#ffe0c8');break;
    case 'kbMomentum':g=[0,1,2].map(i=>`<path d="M${10+i*8} 32 l6 -10 l6 10" stroke="#ff9a3a" stroke-width="2.4" fill="none"/>`).join('');break;
    case 'kbExec':g=blade(8,8,36,36,'#ffe0c8')+flame(30,14,1);break;
    case 'kbAshura':g=`<path d="M10 12 Q22 2 34 12 L32 30 Q22 40 12 30Z" fill="#f4ece0" stroke="#c0303a" stroke-width="1.6"/><path d="M14 18 l6 3 M30 18 l-6 3" stroke="#c0303a" stroke-width="2.4"/><path d="M16 28 q6 4 12 0" stroke="#c0303a" stroke-width="2" fill="none"/>`+flame(34,8,.8)+flame(10,8,.8);break;
    case 'kcCrescent':g=arc('#ffc8de',14,3)+`<path d="M22 26 m-16 0 a16 16 0 0 0 32 0" stroke="#fff" stroke-width="1.4" fill="none"/>`;break;
    case 'kcSwallows':g=[0,1,2].map(i=>`<path d="M${8+i*10} ${20+i*4} q5 -6 10 0 q-5 -2 -10 0z" fill="#fff"/>`).join('');break;
    case 'kcCleaveWind':g=`<path d="M8 34 Q30 30 36 8 Q24 26 8 34Z" fill="#ff7a4a"/>`;break;
    case 'kcStill':g=`<circle cx="22" cy="22" r="13" fill="#bfe0ff" opacity=".35"/><path d="M10 24 q6 -4 12 0 t12 0" stroke="#fff" stroke-width="2" fill="none"/>`;break;
    case 'kcShadow':g=ghost(-9,.5)+ghost(9,.5)+ghost(0,1);break;
    case 'kcStance':g=mount+`<circle cx="22" cy="22" r="17" fill="none" stroke="#ff9a3a" stroke-width="2"/>`;break;
    case 'kcRoll':g=`<circle cx="22" cy="24" r="10" fill="#f4ece0" stroke="#c0303a" stroke-width="1.6"/><path d="M30 14 A14 14 0 0 1 12 34" stroke="#fff" stroke-width="2" fill="none"/>`;break;
    case 'kcOverflow':g=[0,45,90,135].map(a=>`<g transform="rotate(${a} 22 22)">${blade(6,22,38,22,'#fff')}</g>`).join('');break;
    case 'kcOni':g=`<path d="M10 14 Q22 4 34 14 L30 32 Q22 38 14 32Z" fill="#c0303a"/><path d="M14 10 l-2 -6 M30 10 l2 -6" stroke="#fff" stroke-width="2"/>`;break;
    case 'kcKasa':g=hat+`<path d="M8 36 Q22 30 36 36" stroke="#fff" stroke-width="1.4" fill="none" stroke-dasharray="3 2"/>`;break;
    case 'kcLunge':g=`<path d="M6 30 Q22 22 30 10" stroke="#e8f8ff" stroke-width="3" fill="none"/>`+ghost(8,.8);break;
    case 'kcAvalanche':g=mount+`<path d="M4 22 h14" stroke="#ff9a3a" stroke-width="3"/>`;break;
    default:g=blade(8,34,34,10);}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect x="0" y="0" width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;}
