/* =====================================================================
   TOTEM LEGEND — GREEK WHITE LION · Zeus style (Greece) — 12 Tails style
   Character module. Loaded only when the lion is played; index.html calls installLion().
   Design: LION_SKILLS_TH.md

     Basic  · Olympian Cub        — lightning fist combo, Thunder Knuckle, Nemean Hide, Lion Pounce, Laurel Rest, Royal Mane, King's Roar
     A Tree · Olympian Pankration — GRIP: grab a normal enemy and hold it (it can't act), then throw / slam / swing it.
                                    GLORY 0–3 from throws, finishers spend it (physical, ATK)
     B Tree · Thunder King        — CHARGE 0–10 stored in the lion himself, javelins / sky strikes / eagle / storm cloud,
                                    Overcharge at 10 (magic, MATK)
     C Tree · Heir of Zeus        — 12 nodes, each tied to the Basic / A / B skill of the same row (Lv 55 / 60 / 70 / 80)

   Two-way hero: A = ATK, B = MATK, Basic / normal attack = the higher of the two.
   Owner's rules: no percent effects (flat numbers, counters instead of chances). Attack speed fixed (CHAR_ASPD).
   Sprite: the wolf's sprite stands in until the lion's own clips are made.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const LI_BAL={
  glory:{cap:3,dur:10},
  charge:{cap:10,decay:5},
  hold:{T:1.5},
  sk:{
    // ---- Basic
    lnCombo:{chain:[2,3,4,4],hit:1.0},
    lnKnuckle:{every:4,dmg:[.8,1.0,1.2],R:180},
    lnHide:{T:4,block:[15,25,35],cd:16,mp:12},
    lnPounce:{dist:[160,190,220],dmg:1.5,R:70,cd:9,mp:12,range:220},
    lnRest:{T:6,hp:[1.0,1.5],cd:24,mp:10},
    lnMane:{hp:[1,2,3,4]},
    lnRoar:{R:160,weak:[10,20,30],dur:8,cd:20,mp:14},
    // ---- A · Olympian Pankration
    laGrab:{dmg:[1.0,1.2,1.4,1.6],knee:1.8,cd:6,mp:8,range:110},
    laBody:{block:[8,14,20],after:2},
    laSuplex:{dmg:[2.2,2.8],land:1.0,R:80,cd:8,mp:14,range:110},
    laPile:{add:[1.0,1.5]},
    laShove:{dmg:[1.6,2.0],push:180,cd:9,mp:12,range:110},
    laDomino:{dmg:[1.0,1.4]},
    laSpin:{dmg:[.8,1.0],R:120,turns:3,cd:13,mp:18,range:110},
    laHurricane:{turns:5},
    laLift:{dmg:[2.6,3.2],per:.8,cd:12,mp:20,range:110},
    laCrack:{dmg:[1.2,1.6],len:200},
    laPride:{atk:[10,15,20],block:[3,5,6]},
    laCounter:{T:1,dmg:2.4,cd:14,mp:12},
    laLabors:{n:12,dmg:[1.0,1.4],per:.4,fin:3.0,R:220,cd:60,mp:50},
    laLegend:{T:8,block:25},
    // ---- B · Thunder King
    lbJavelin:{dmg:[1.4,1.6,1.8,2.0],len:380,pierce:2,cd:5,mp:10,range:380},
    lbStatic:{every:5,dmg:[.8,1.0,1.2],R:120},
    lbSky:{dmg:[2.2,2.8],R:80,cd:8,mp:14,range:320},
    lbTwin:{dmg:[1.0,1.4]},
    lbEagle:{n:3,dmg:[.9,1.2],cd:11,mp:16,range:360},
    lbAetos:{T:[6,8]},
    lbCloud:{R:110,T:5,dmg:[.6,.8],cd:16,mp:20,range:320},
    lbThunderhead:{scale:1.5},
    lbOver:{T:8,tal:[40,60],cd:20,mp:10},
    lbField:{dmg:.5,R:110},
    lbConductor:{keep:[7,9,11],sp:[2,4,6]},
    lbAegis:{n:2,cd:18,mp:14},
    lbWrath:{n:12,R:260,dmg:[1.6,2.2],cd:60,mp:50},
    lbKing:{dmg:3.0,per:.4},
    // ---- C
    lcCombo:{dmg:1.8},
    lcClinch:{T:2.5,boss:.6},
    lcFork:{n:3,spread:.3},
    lcReflect:{dmg:.8},
    lcToss:{len:300,R:100,dmg:3.0,cd:18,mp:24},
    lcRain:{n:3,gap:90},
    lcCrown:{T:12,hp:1,flat:30,cd:40,mp:20},
    lcAtlas:{dmg:2.4,R:140},
    lcSupercell:{},
    lcAscend:{T:15,atk:60,cd:90,mp:40},
    lcTwelfth:{dmg:6.0,per:1.0,cd:50,mp:40,range:120},
    lcKeraunos:{dmg:5.0,per:.5,len:500,cd:50,mp:40,range:500}
  }
};
const LB=LI_BAL.sk;
const lX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const lT=n=>'MATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const LI_DEFS=[
 // ---------------- BASIC · OLYMPIAN CUB ----------------
 {key:'lnCombo',id:'LN-B01',name:'Olympian Fist Combo',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) หมัดสายฟ้าซ้าย-ขวาต่อเนื่อง',lv:i=>[`ต่อ ${LB.lnCombo.chain[i-1]} จังหวะ`]},
 {key:'lnKnuckle',id:'LN-B02',name:'Thunder Knuckle',br:'basic',row:1,max:3,passive:1,d:'(Passive) ทุกหมัดที่ 4 ของตีปกติ สายฟ้ากระโดดไปศัตรูใกล้ ๆ 1 ตัว',lv:i=>[`${lX(LB.lnKnuckle.dmg[i-1])}`]},
 {key:'lnHide',id:'LN-B03',name:'Nemean Hide',br:'basic',row:2,max:3,type:'self',d:'หนังสิงห์เนเมียน ลดดาเมจที่ได้รับ ไม่ติดชะงัก',lv:i=>[`ดาเมจที่ได้รับ −${LB.lnHide.block[i-1]} ต่อครั้ง นาน ${LB.lnHide.T} วิ`,`Cooldown ${LB.lnHide.cd} วิ`]},
 {key:'lnPounce',id:'LN-B04',name:'Lion Pounce',br:'basic',row:2,max:3,type:'melee',d:'กระโจนใส่เป้า ศัตรูรอบจุดตกชะงัก',lv:i=>[`ระยะ ${LB.lnPounce.dist[i-1]}`,`${lX(LB.lnPounce.dmg)}`,`Cooldown ${LB.lnPounce.cd} วิ`]},
 {key:'lnRest',id:'LN-B05',name:'Laurel Rest',br:'basic',row:3,max:2,type:'self',d:'สวมมงกุฎลอเรลพัก ฟื้น HP ต่อเนื่อง ล้างสถานะช้า',lv:i=>[`ฟื้น HP = เลเวล × ${LB.lnRest.hp[i-1]} ทุกวิ นาน ${LB.lnRest.T} วิ`,`Cooldown ${LB.lnRest.cd} วิ`]},
 {key:'lnMane',id:'LN-B06',name:'Royal Mane',br:'basic',row:3,max:4,passive:1,d:'(Passive) แผงคอราชสีห์ Max HP เพิ่ม',lv:i=>[`Max HP + เลเวล × ${LB.lnMane.hp[i-1]}`]},
 {key:'lnRoar',id:'LN-B07',name:"King's Roar",br:'basic',row:4,max:3,type:'self',d:'คำรามราชสีห์ ศัตรูรอบตัวตีเบาลงและชะงัก',lv:i=>[`ศัตรูรอบตัว ${LB.lnRoar.R} ตีเราเบาลง ${LB.lnRoar.weak[i-1]} ต่อครั้ง นาน ${LB.lnRoar.dur} วิ`,`Cooldown ${LB.lnRoar.cd} วิ`]},
 // ---------------- A · OLYMPIAN PANKRATION ----------------
 {key:'laGrab',id:'LN-A01',name:'Clinch Grab',br:'A',row:1,max:4,type:'melee',d:'จับเป้าไว้ ศัตรูทำอะไรไม่ได้ · บอสโดนเข่าแทน (อัปสลับเลเวลกับ Olympian Suplex)',lv:i=>[`${lX(LB.laGrab.dmg[i-1])} · จับ ${LI_BAL.hold.T} วิ`,`บอส: เข่า ${lX(LB.laGrab.knee)}`,`Cooldown ${LB.laGrab.cd} วิ`]},
 {key:'laBody',id:'LN-A02',name:"Wrestler's Body",br:'A',row:2,max:3,passive:1,d:'(Passive) ระหว่างจับและ 2 วิหลังทุ่ม ดาเมจที่ได้รับลดลง',lv:i=>[`ดาเมจที่ได้รับ −${LB.laBody.block[i-1]} ต่อครั้ง`]},
 {key:'laSuplex',id:'LN-A03',name:'Olympian Suplex',br:'A',row:3,max:2,type:'melee',pre:[['laGrab',1]],d:'ยกทุ่มไปด้านหลัง จุดตกกระแทกรอบตัว ได้เกียรติ 1 ชั้น',lv:i=>[`${lX(LB.laSuplex.dmg[i-1])}`,`จุดตก ${lX(LB.laSuplex.land)} รัศมี ${LB.laSuplex.R}`,`Cooldown ${LB.laSuplex.cd} วิ`]},
 {key:'laPile',id:'LN-A04',name:'Pile Driver',br:'A',row:3,max:2,passive:1,enh:'laSuplex',pre:[['laSuplex',1]],d:'(ต่อยอด Olympian Suplex) เป้าที่ถูกจับอยู่ โดนตอกลงพื้นแทน แรงขึ้น',lv:i=>[`+${lX(LB.laPile.add[i-1])}`]},
 {key:'laShove',id:'LN-A05',name:'Heracles Shove',br:'A',row:4,max:2,type:'melee',d:'ผลักศัตรูด้านหน้ากระเด็น',lv:i=>[`${lX(LB.laShove.dmg[i-1])} กระเด็น ${LB.laShove.push}`,`Cooldown ${LB.laShove.cd} วิ`]},
 {key:'laDomino',id:'LN-A06',name:'Domino',br:'A',row:4,max:2,passive:1,enh:'laShove',pre:[['laShove',1]],d:'(ต่อยอด Heracles Shove) ศัตรูที่กระเด็นไปชนตัวอื่น โดนทั้งสองตัว',lv:i=>[`${lX(LB.laDomino.dmg[i-1])}`]},
 {key:'laSpin',id:'LN-A07',name:'Arena Spin',br:'A',row:5,max:2,type:'melee',d:'จับเป้าเหวี่ยงรอบตัว ทุกตัวในวงโดน แล้วปล่อยกระเด็น ได้เกียรติ 1 ชั้น',lv:i=>[`${lX(LB.laSpin.dmg[i-1])} ต่อรอบ × ${LB.laSpin.turns} รอบ รัศมี ${LB.laSpin.R}`,`Cooldown ${LB.laSpin.cd} วิ`]},
 {key:'laHurricane',id:'LN-A08',name:'Hurricane Swing',br:'A',row:5,max:1,passive:1,enh:'laSpin',pre:[['laSpin',1]],d:'(ต่อยอด Arena Spin) เหวี่ยง 5 รอบ ปล่อยไกลขึ้น',lv:()=>[`${LB.laHurricane.turns} รอบ`]},
 {key:'laLift',id:'LN-A09',name:'Titan Lift',br:'A',row:6,max:2,type:'melee',d:'ยกเป้าเหนือหัวทุ่มลงพื้น ใช้เกียรติทั้งหมด',lv:i=>[`${lX(LB.laLift.dmg[i-1])} + ${lX(LB.laLift.per)} ต่อชั้นเกียรติ`,`Cooldown ${LB.laLift.cd} วิ`]},
 {key:'laCrack',id:'LN-A10',name:"Gaia's Crack",br:'A',row:6,max:2,passive:1,enh:'laLift',pre:[['laLift',1]],d:'(ต่อยอด Titan Lift) พื้นแตกเป็นแนว ศัตรูในแนวลอย',lv:i=>[`${lX(LB.laCrack.dmg[i-1])} แนว ${LB.laCrack.len}`]},
 {key:'laPride',id:'LN-A11',name:"Champion's Pride",br:'A',row:7,max:3,passive:1,d:'(Passive) แต่ละชั้นเกียรติ ATK เพิ่มและดาเมจที่ได้รับลดลง',lv:i=>[`ATK +${LB.laPride.atk[i-1]} ต่อชั้น`,`ดาเมจที่ได้รับ −${LB.laPride.block[i-1]} ต่อชั้น`]},
 {key:'laCounter',id:'LN-A12',name:'Counter Hold',br:'A',row:7,max:1,type:'self',d:'ตั้งท่า 1 วิ ถ้าโดนตีประชิด จับคนตีแล้วทุ่มทันที',lv:()=>[`${lX(LB.laCounter.dmg)}`,`Cooldown ${LB.laCounter.cd} วิ`]},
 {key:'laLabors',id:'LN-A13',name:'Labors of Heracles',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · ไล่จับทุ่มศัตรูรอบตัว 12 ครั้ง ครั้งสุดท้ายทุ่มรวมกลางวง',lv:i=>[`${lX(LB.laLabors.dmg[i-1])} + ${lX(LB.laLabors.per)} ต่อชั้นเกียรติ ต่อครั้ง`,`ครั้งสุดท้าย ${lX(LB.laLabors.fin)}`,`Cooldown ${LB.laLabors.cd} วิ`]},
 {key:'laLegend',id:'LN-A14',name:'Nemean Legend',br:'A',row:8,max:1,passive:1,enh:'laLabors',pre:[['laLabors',1]],d:'(ต่อยอด Labors of Heracles) จบอัลติ ไม่กระเด็น ไม่ชะงัก ดาเมจที่ได้รับลดลง เกียรติเต็ม',lv:()=>[`ดาเมจที่ได้รับ −${LB.laLegend.block} ต่อครั้ง นาน ${LB.laLegend.T} วิ`]},
 // ---------------- B · THUNDER KING ----------------
 {key:'lbJavelin',id:'LN-G01',name:'Thunderbolt Javelin',br:'B',row:1,max:4,type:'melee',d:'ปาหอกสายฟ้าทะลุแนวตรง ประจุ +2 (อัปสลับเลเวลกับ Sky Strike)',lv:i=>[`${lT(LB.lbJavelin.dmg[i-1])} ทะลุ ${LB.lbJavelin.pierce} ตัว`,`Cooldown ${LB.lbJavelin.cd} วิ`]},
 {key:'lbStatic',id:'LN-G02',name:'Static Body',br:'B',row:2,max:3,passive:1,d:'(Passive) ทุกครั้งที่ได้ประจุครบ 5 ช็อตศัตรูรอบตัว',lv:i=>[`${lT(LB.lbStatic.dmg[i-1])} รัศมี ${LB.lbStatic.R}`]},
 {key:'lbSky',id:'LN-G03',name:'Sky Strike',br:'B',row:3,max:2,type:'ground',radius:()=>LB.lbSky.R,pre:[['lbJavelin',1]],d:'ฟ้าผ่าลงจุดที่เลือก ประจุ +2',lv:i=>[`${lT(LB.lbSky.dmg[i-1])} รัศมี ${LB.lbSky.R}`,`Cooldown ${LB.lbSky.cd} วิ`]},
 {key:'lbTwin',id:'LN-G04',name:'Twin Strike',br:'B',row:3,max:2,passive:1,enh:'lbSky',pre:[['lbSky',1]],d:'(ต่อยอด Sky Strike) ฟ้าผ่าซ้ำจุดเดิมหลัง 0.5 วิ',lv:i=>[`${lT(LB.lbTwin.dmg[i-1])}`]},
 {key:'lbEagle',id:'LN-G05',name:'Eagle of Zeus',br:'B',row:4,max:2,type:'melee',d:'นกอินทรีทองโฉบใส่เป้า 3 ครั้ง ประจุ +1 ต่อครั้ง',lv:i=>[`${lT(LB.lbEagle.dmg[i-1])} × ${LB.lbEagle.n}`,`Cooldown ${LB.lbEagle.cd} วิ`]},
 {key:'lbAetos',id:'LN-G06',name:'Aetos Guard',br:'B',row:4,max:2,passive:1,enh:'lbEagle',pre:[['lbEagle',1]],d:'(ต่อยอด Eagle of Zeus) นกอินทรีบินวนรอบตัว กันการโจมตีให้ 1 ครั้ง',lv:i=>[`นาน ${LB.lbAetos.T[i-1]} วิ`]},
 {key:'lbCloud',id:'LN-G07',name:'Storm Cloud',br:'B',row:5,max:2,type:'ground',radius:()=>LB.lbCloud.R,d:'เมฆพายุ 5 วิ ฟ้าผ่าตัวที่ HP มากสุดในเมฆทุก 0.5 วิ',lv:i=>[`${lT(LB.lbCloud.dmg[i-1])} ทุก 0.5 วิ`,`Cooldown ${LB.lbCloud.cd} วิ`]},
 {key:'lbThunderhead',id:'LN-G08',name:'Thunderhead',br:'B',row:5,max:1,passive:1,enh:'lbCloud',pre:[['lbCloud',1]],d:'(ต่อยอด Storm Cloud) เมฆใหญ่ขึ้น ศัตรูในเมฆช้าลง',lv:()=>['เมฆใหญ่ขึ้นครึ่งหนึ่ง · สโลว์']},
 {key:'lbOver',id:'LN-G09',name:'Overcharge',br:'B',row:6,max:2,type:'self',d:'ใช้ประจุ 10 → 8 วิ สกิล B แรงขึ้น หอกทะลุทุกตัว',lv:i=>[`MATK +${LB.lbOver.tal[i-1]} นาน ${LB.lbOver.T} วิ`,'ต้องมีประจุ 10',`Cooldown ${LB.lbOver.cd} วิ`]},
 {key:'lbField',id:'LN-G10',name:'Static Field',br:'B',row:6,max:1,passive:1,enh:'lbOver',pre:[['lbOver',1]],d:'(ต่อยอด Overcharge) ระหว่าง Overcharge ศัตรูรอบตัวโดนช็อตทุก 1 วิ',lv:()=>[`${lT(LB.lbField.dmg)} รัศมี ${LB.lbField.R}`]},
 {key:'lbConductor',id:'LN-G11',name:'Conductor',br:'B',row:7,max:3,passive:1,d:'(Passive) ประจุคงอยู่นานขึ้น สกิล B ใช้ SP น้อยลง',lv:i=>[`ประจุเริ่มลดหลัง ${LB.lbConductor.keep[i-1]} วิ`,`สกิล B SP −${LB.lbConductor.sp[i-1]}`]},
 {key:'lbAegis',id:'LN-G12',name:'Aegis Flash',br:'B',row:7,max:1,type:'self',d:'โดมสายฟ้าอีจิส กันการโจมตี 2 ครั้ง คนที่ตีโดนชะงัก',lv:()=>[`กัน ${LB.lbAegis.n} ครั้ง`,`Cooldown ${LB.lbAegis.cd} วิ`]},
 {key:'lbWrath',id:'LN-G13',name:'Wrath of Olympus',br:'B',row:8,max:2,type:'self',ult:1,d:'ULTIMATE B · ฟ้าผ่า 12 สายลงรอบตัว ตีตัวที่ใกล้ที่สุดในวงก่อน',lv:i=>[`${lT(LB.lbWrath.dmg[i-1])} × ${LB.lbWrath.n} รัศมี ${LB.lbWrath.R}`,`Cooldown ${LB.lbWrath.cd} วิ`]},
 {key:'lbKing',id:'LN-G14',name:'King of the Gods',br:'B',row:8,max:1,passive:1,enh:'lbWrath',pre:[['lbWrath',1]],d:'(ต่อยอด Wrath of Olympus) จบอัลติ ฟ้าผ่ายักษ์กลางวง ใช้ประจุทั้งหมด',lv:()=>[`${lT(LB.lbKing.dmg)} + ${lT(LB.lbKing.per)} ต่อประจุ`]},
 // ---------------- C · HEIR OF ZEUS (12 nodes, same row) ----------------
 {key:'lcCombo',id:'LN-C01',name:'Thunder Combo',br:'C',col:'basic',tier:1,passive:1,pre:[['lnCombo',4]],d:'ตีปกติต่อได้ 5 จังหวะ จังหวะที่ 5 อัปเปอร์คัตสายฟ้า เป้าลอย',lv:()=>[`${lX(LB.lcCombo.dmg)}`]},
 {key:'lcClinch',id:'LN-C02',name:'Iron Clinch',br:'C',col:'A',tier:1,passive:1,pre:[['laGrab',4]],d:'Clinch Grab จับบอสได้สั้น ๆ ศัตรูธรรมดาจับนานขึ้น',lv:()=>[`จับ ${LB.lcClinch.T} วิ · บอส ${LB.lcClinch.boss} วิ`]},
 {key:'lcFork',id:'LN-C03',name:'Forked Javelin',br:'C',col:'B',tier:1,passive:1,pre:[['lbJavelin',4]],d:'Thunderbolt Javelin ปาหอก 3 เล่มเป็นพัด',lv:()=>['หอก 3 เล่ม']},
 {key:'lcReflect',id:'LN-C04',name:"Lion's Reflection",br:'C',col:'basic',tier:2,passive:1,pre:[['lnHide',3]],d:'ระหว่าง Nemean Hide ศัตรูที่ตีประชิดโดนสะท้อน',lv:()=>[`${lX(LB.lcReflect.dmg)} ต่อครั้ง`]},
 {key:'lcToss',id:'LN-C05',name:'Titan Toss',br:'C',col:'A',tier:2,type:'melee',pre:[['laSuplex',2]],d:'[New Active] ขว้างศัตรูไปไกล ระเบิดตอนตก',lv:()=>[`ไกล ${LB.lcToss.len} · ${lX(LB.lcToss.dmg)} รัศมี ${LB.lcToss.R}`,`Cooldown ${LB.lcToss.cd} วิ`]},
 {key:'lcRain',id:'LN-C06',name:'Thunder Rain',br:'C',col:'B',tier:2,passive:1,pre:[['lbSky',2]],d:'Sky Strike ฟ้าผ่าลง 3 จุดเรียงไปข้างหน้า',lv:()=>['ฟ้าผ่า 3 จุด']},
 {key:'lcCrown',id:'LN-C07',name:'Laurel Crown',br:'C',col:'basic',tier:3,type:'self',pre:[['lnRest',2]],d:'[New Active] มงกุฎลอเรลทอง ฟื้น HP ต่อเนื่อง ATK และ MATK เพิ่ม',lv:()=>[`ฟื้น HP = เลเวล × ${LB.lcCrown.hp} ทุกวิ`,`ATK / MATK +${LB.lcCrown.flat} นาน ${LB.lcCrown.T} วิ`,`Cooldown ${LB.lcCrown.cd} วิ`]},
 {key:'lcAtlas',id:'LN-C08',name:'Atlas Slam',br:'C',col:'A',tier:3,passive:1,pre:[['laSpin',2]],d:'Arena Spin จบด้วยทุ่มลงพื้นรอบตัว',lv:()=>[`${lX(LB.lcAtlas.dmg)} รัศมี ${LB.lcAtlas.R}`]},
 {key:'lcSupercell',id:'LN-C09',name:'Supercell',br:'C',col:'B',tier:3,passive:1,pre:[['lbCloud',2]],d:'เปิด Overcharge แล้วได้ Storm Cloud ตามตัวไปฟรี',lv:()=>['เมฆพายุตามตัวตลอด Overcharge']},
 {key:'lcAscend',id:'LN-C10',name:'Olympian Ascension',br:'C',col:'basic',tier:4,type:'self',pre:[['lnRoar',3]],d:'[New Active] Signature · 15 วิ ร่างเรืองทองมีปีกสายฟ้า ตีปกติแรงขึ้น เกียรติและประจุได้ 2 เท่า',lv:()=>[`ตีปกติ ATK +${LB.lcAscend.atk}`,'เกียรติ / ประจุ ×2',`Cooldown ${LB.lcAscend.cd} วิ`]},
 {key:'lcTwelfth',id:'LN-C11',name:'The Twelfth Labor',br:'C',col:'A',tier:4,type:'melee',pre:[['laLabors',1]],d:'[New Active] จับเป้าเดียว (รวมบอส) ยกขึ้นฟ้าแล้วทุ่มลง ใช้เกียรติทั้งหมด',lv:()=>[`${lX(LB.lcTwelfth.dmg)} + ${lX(LB.lcTwelfth.per)} ต่อชั้นเกียรติ`,`Cooldown ${LB.lcTwelfth.cd} วิ`]},
 {key:'lcKeraunos',id:'LN-C12',name:'Keraunos',br:'C',col:'B',tier:4,type:'melee',pre:[['lbWrath',1]],d:'[New Active] ปาสายฟ้าเคราอูนอสของซุสยักษ์ ทะลุทุกตัว ใช้ประจุทั้งหมด',lv:()=>[`${lT(LB.lcKeraunos.dmg)} + ${lT(LB.lcKeraunos.per)} ต่อประจุ ไกล ${LB.lcKeraunos.len}`,`Cooldown ${LB.lcKeraunos.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const LI={glory:0,gloryT:0,charge:0,chargeT:-9,chargeN:0,held:null,throwT:-9,knuckleN:0,counterUntil:0,aegis:0,aetos:false,cloud:null,restUntil:0,crownUntil:0};
const lL=k=>LV[k]||0;
const lLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,lL(k)))-1];
const LIC={gold:'#ffd36a',gold2:'#fff2b8',bolt:'#9adcff',bolt2:'#e8f8ff',white:'#ffffff',blue:'#3a6ad8',marble:'#f4efe4'};
const lCol=k=>{if(!k||k==='basic')return 'basic';const d=LI_DEFS.find(x=>x.key===k);if(!d)return 'basic';return d.br==='C'?d.col:d.br;};
function lHit(e,mult,key,o={}){if(!e||e.dead)return 0;const br=lCol(key);return hurt(e,mult,Object.assign({skill:key,br,critOK:br!=='B'},o));}
const lNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const lSeg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
function lFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function lPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!lFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const lTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const lPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const lAsc=()=>hasBuff('lcAscend');
const lOver=()=>hasBuff('lbOver');
/* GLORY (A) */
function lGlory(n){if(lAsc())n*=2;LI.glory=Math.min(LI_BAL.glory.cap,LI.glory+n);LI.gloryT=gameTime+LI_BAL.glory.dur;LI.gloryPop=1;}
function lSpendGlory(){const n=LI.glory;LI.glory=0;return n;}
/* CHARGE (B) */
function lCharge(n){if(lAsc())n*=2;const b=LI.charge;LI.charge=Math.min(LI_BAL.charge.cap,LI.charge+n);LI.chargeT=gameTime;
  if(lL('lbStatic')){LI.chargeN+=LI.charge-b;while(LI.chargeN>=LB.lbStatic.every){LI.chargeN-=LB.lbStatic.every;for(const e of lNear(player.x,player.y,LB.lbStatic.R)){lHit(e,lLv(LB.lbStatic.dmg,'lbStatic'),'lbStatic');lArc(player,e);}addFx(new GRing({x:player.x,y:player.y,r0:10,r1:LB.lbStatic.R,w:5,color:LIC.bolt,life:.3}));}}}
function lSpendCharge(){const n=LI.charge;LI.charge=0;return n;}
/* GRIP (A) */
function lHold(e,T){if(!e||e.dead)return;LI.held={e,until:gameTime+T};e.st.stagger=Math.max(e.st.stagger||0,.2);e.atk=0;}
function lRelease(){LI.held=null;LI.throwT=gameTime;}
function lHeld(){const h=LI.held;return h&&!h.e.dead&&h.until>gameTime?h.e:null;}
/* lightning helpers */
function lBolt(e,mult,key,o={}){addFx(new LiBolt({x:e.x,y:e.y}));lHit(e,mult,key,Object.assign({big:true},o));}
function lBoltAt(x,y){addFx(new LiBolt({x,y}));}
function lArc(a,b){addFx(new LiArc({a:[a.x,a.y],b:[b.x,b.y]}));}

/* ---------------------------------------------------------------------
   4. FX (code placeholders — painted pieces come later)
   --------------------------------------------------------------------- */
function lGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function lPow(e,big,col){addFx(new Impact({pos:[e.x,e.y,(e.boss?36:24)],size:big?52:28,color:col||LIC.gold2,core:'#ffffff',rays:big?10:6,life:big?.24:.15}));sparks(e.x,e.y,24,angTo(e),big?12:5,col||LIC.gold2,big?320:220,.6);}
function lSlamFx(x,y,R){addFx(new GRing({x,y,r0:10,r1:R,w:12,color:LIC.marble,life:.4}));dustPuff(x,y,8,'#e8e0d0',90,9);shake(3);stop(60);}
class LiBolt{constructor(o){Object.assign(this,{t:0,life:.32,layer:'top',w:4},o);this.j=[];for(let i=0;i<7;i++)this.j.push(rnd(-12,12));}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=P(this.x,this.y,0),top=y-240;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(LIC.bolt,a);ctx.lineWidth=this.w;ctx.beginPath();ctx.moveTo(x+this.j[0],top);
    for(let i=1;i<7;i++)ctx.lineTo(x+this.j[i]*(1-i/7),top+(y-top)*i/6);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a);ctx.lineWidth=this.w*.4;ctx.stroke();ctx.restore();lGlow(x,y,30+this.w*6,LIC.bolt,.55*a);}}
class LiArc{constructor(o){Object.assign(this,{t:0,life:.22,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x0,y0]=P(this.a[0],this.a[1],34),[x1,y1]=P(this.b[0],this.b[1],30);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(LIC.bolt,a);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,y0);
    for(let i=1;i<6;i++)ctx.lineTo(lerp(x0,x1,i/6)+rnd(-8,8),lerp(y0,y1,i/6)+rnd(-8,8));ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();}}
/* javelin / thrown things flying in a line */
class LiShot{constructor(o){Object.assign(this,{t:0,layer:'top',speed:820,len:380,w:18,z:40,col:LIC.bolt,pierce:2,hits:new Set(),d:0,big:false},o);this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;this.d+=this.speed*dt;this.x=this.x0+Math.cos(this.phi)*this.d;this.y=this.y0+Math.sin(this.phi)*this.d;if(!lFree(this.x,this.y)){this.onEnd&&this.onEnd(this.x,this.y);return false;}
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w){this.hits.add(e);this.onHit&&this.onHit(e);if(this.hits.size>=this.pierce){this.onEnd&&this.onEnd(this.x,this.y);return false;}}}
    if(this.d>=this.len){this.onEnd&&this.onEnd(this.x,this.y);return false;}return true;}
  draw(){const [x,y]=P(this.x,this.y,this.z),ang=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi)),L=this.big?110:56;lGlow(x,y,this.w*1.6,this.col,.5);
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=this.col;ctx.lineWidth=this.big?10:5;ctx.beginPath();ctx.moveTo(-L,0);for(let i=1;i<=5;i++)ctx.lineTo(-L+L*i/5,(i%2?-1:1)*(this.big?7:4));ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=this.big?3:1.6;ctx.stroke();ctx.restore();}}
/* thrown enemy (Titan Toss / throws): moves the enemy along an arc, then calls land */
class LiFling{constructor(o){Object.assign(this,{t:0,T:.45,layer:'none',h:80},o);this.sx=this.e.x;this.sy=this.e.y;}draw(){}
  update(dt){this.t+=dt;const k=Math.min(1,this.t/this.T),e=this.e;if(!e.dead){e.x=lerp(this.sx,this.tx,k);e.y=lerp(this.sy,this.ty,k);e.z=Math.sin(Math.PI*k)*this.h;e.st.stagger=Math.max(e.st.stagger||0,.1);}
    if(k>=1){if(!e.dead)e.z=0;this.land&&this.land(this.tx,this.ty);return false;}return true;}}
/* eagle of Zeus diving */
class LiEagle{constructor(o){Object.assign(this,{t:0,layer:'top',n:3,gap:.4,i:0,x:player.x,y:player.y,z:110},o);this.next=.15;}
  update(dt){this.t+=dt;const e=this.tg&&!this.tg.dead?this.tg:nearestEnemy(player.x,player.y,LB.lbEagle.range);
    if(e){const tz=this.t>=this.next-.12?30:110;this.x=lerp(this.x,e.x,Math.min(1,dt*8));this.y=lerp(this.y,e.y,Math.min(1,dt*8));this.z=lerp(this.z,tz,Math.min(1,dt*10));
      if(this.t>=this.next){this.next+=this.gap;this.i++;this.hit&&this.hit(e);}}
    return this.i<this.n&&this.t<3;}
  draw(){const [x,y]=P(this.x,this.y,this.z),f=Math.sin(this.t*24)*6;lGlow(x,y,22,LIC.gold,.5);ctx.save();ctx.fillStyle=LIC.gold;ctx.strokeStyle='#5a3a08';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-14,y-10-f,x-24,y-2);ctx.quadraticCurveTo(x-12,y+2,x,y+4);ctx.quadraticCurveTo(x+12,y+2,x+24,y-2);ctx.quadraticCurveTo(x+14,y-10-f,x,y);ctx.fill();ctx.stroke();ctx.restore();}}
/* ground layer: storm cloud shadow, crack lines */
class LiGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='lion';}
  draw(){const C=LI.cloud;if(C){const [x,y]=P(C.x,C.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalAlpha=.32;ctx.fillStyle='#2a3450';ctx.beginPath();ctx.arc(0,0,C.R,0,TAU);ctx.fill();ctx.globalAlpha=.6;ctx.strokeStyle=LIC.bolt;ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.lineDashOffset=this.t*30;ctx.beginPath();ctx.arc(0,0,C.R,0,TAU);ctx.stroke();ctx.restore();}}}
/* top layer: glory pips, charge bar, held marker, aegis dome, eagle guard, cloud */
class LiTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;LI.gloryPop=Math.max(0,(LI.gloryPop||0)-dt*4);return CHAR==='lion';}
  draw(){const pz=(player.z||0)+96*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    if(LI.glory>0)for(let i=0;i<LI_BAL.glory.cap;i++){const on=i<LI.glory,px=x+(i-1)*12,py=y-(on?LI.gloryPop*3:0);ctx.fillStyle=on?LIC.gold:'rgba(30,24,10,.55)';ctx.beginPath();ctx.arc(px,py,4.5,0,TAU);ctx.fill();if(on){ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();}}
    if(LI.charge>0){const w=50,yy=y+10;ctx.fillStyle='rgba(10,16,30,.6)';ctx.fillRect(x-w/2,yy,w,5);ctx.fillStyle=LI.charge>=LI_BAL.charge.cap?LIC.bolt2:LIC.bolt;ctx.fillRect(x-w/2,yy,w*LI.charge/LI_BAL.charge.cap,5);if(LI.charge>=LI_BAL.charge.cap)lGlow(x,yy+2,18,LIC.bolt,.4+.2*Math.sin(this.t*10));}
    const h=lHeld();if(h){const [hx,hy]=P(h.x,h.y,(h.boss?90:60));ctx.strokeStyle=LIC.gold;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,8+2*Math.sin(this.t*12),0,TAU);ctx.stroke();}
    if(LI.aegis>0){const [ax,ay]=P(player.x,player.y,30);ctx.save();ctx.strokeStyle=hexA(LIC.bolt,.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(ax,ay-10,40,Math.PI,0);ctx.stroke();ctx.restore();lGlow(ax,ay-14,46,LIC.bolt,.15);}
    if(hasBuff('lbAetos')){const an=this.t*3,[ex,ey]=P(player.x+Math.cos(an)*44,player.y+Math.sin(an)*26,70);lGlow(ex,ey,12,LIC.gold,.7);}
    if(lOver()||lAsc()){lGlow(x,y+40,60,lAsc()?LIC.gold:LIC.bolt,.25+.08*Math.sin(this.t*9));if(Math.random()<.4){const an=rnd(0,TAU),[sx,sy]=P(player.x+Math.cos(an)*24,player.y+Math.sin(an)*14,rnd(20,80));ctx.strokeStyle=hexA(LIC.bolt2,.8);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+rnd(-8,8),sy+rnd(-10,10));ctx.stroke();}}
    const C=LI.cloud;if(C){const [cx,cy]=P(C.x,C.y,150);ctx.save();ctx.globalAlpha=.85;ctx.fillStyle='#4a5470';for(const [ox,oy,r] of [[-C.R*.5,4,C.R*.38],[0,-6,C.R*.48],[C.R*.5,4,C.R*.38]]){ctx.beginPath();ctx.arc(cx+ox,cy+oy,r*.6,0,TAU);ctx.fill();}ctx.restore();}}}
/* per-frame logic */
class LiCore{constructor(){this.t=0;this.layer='none';this.tk=0;}draw(){}
  update(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new LiGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new LiTop());
    if(LI.glory>0&&LI.gloryT<gameTime)LI.glory=0;
    const keep=lL('lbConductor')?lLv(LB.lbConductor.keep,'lbConductor'):LI_BAL.charge.decay;if(LI.charge>0&&!lOver()&&gameTime-LI.chargeT>keep){LI.chargeD=(LI.chargeD||0)+dt;if(LI.chargeD>=1){LI.chargeD=0;LI.charge--;}}else LI.chargeD=0;
    /* held enemy stays in front of the lion and can't act */
    const h=lHeld();if(h){const ph=player.phi,[px,py]=lPathEnd(player.x,player.y,ph,h.r+22);if(!h.boss){h.x=px;h.y=py;}h.st.stagger=Math.max(h.st.stagger||0,.15);h.atk=0;}else if(LI.held)lRelease();
    this.tk+=dt;const tick=this.tk>=1;if(tick)this.tk=0;
    /* laurel rest / crown heal over time */
    if(LI.restUntil>gameTime)player.hp=Math.min(player.maxHp,player.hp+PS.lv*lLv(LB.lnRest.hp,'lnRest')*dt);
    if(hasBuff('lcCrown'))player.hp=Math.min(player.maxHp,player.hp+PS.lv*LB.lcCrown.hp*dt);
    /* static field */
    if(tick&&lOver()&&lL('lbField'))for(const e of lNear(player.x,player.y,LB.lbField.R)){lHit(e,LB.lbField.dmg,'lbField');lArc(player,e);}
    /* supercell: storm cloud rides along with Overcharge */
    if(lL('lcSupercell')&&lOver()){if(!LI.cloud||LI.cloud.until<gameTime+.2)LI.cloud={x:player.x,y:player.y,R:LB.lbCloud.R,until:gameTime+.6,tk:LI.cloud?LI.cloud.tk:0,dmg:lLv(LB.lbCloud.dmg,'lbCloud')||LB.lbCloud.dmg[0],slow:lL('lbThunderhead')>0,follow:true};}
    const C=LI.cloud;if(C){if(C.follow){C.x=player.x;C.y=player.y;}if(C.until<gameTime)LI.cloud=null;else if((C.tk+=dt)>=.5){C.tk=0;const L=lNear(C.x,C.y,C.R);if(C.slow)for(const e of L)applyCC(e,{slow:.6});
      const e=L.sort((a,b)=>b.hp-a.hp)[0];if(e){lBolt(e,C.dmg,'lbCloud');lCharge(1);}}}
    return CHAR==='lion';}}
/* 2026-11-21 bug fix: LiCore.update returned nothing, so the engine dropped the ticker after its first frame (and the bench clears fx):
   glory and charge never ran out, a grabbed enemy was not held, Laurel Rest / Laurel Crown never healed, Static Field never shocked,
   Storm Cloud never struck and never ended, Supercell never followed. One core, re-added on every cast. */
let liCore=null;
function lEnsure(){if(CHAR!=='lion')return;if(!liCore||!fx.includes(liCore)){const o=fx.find(f=>f instanceof LiCore);liCore=o||addFx(new LiCore());}}
window.lEnsure=lEnsure;

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
function lPunches(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),sp=(o.speed||1)*aspd();let s=[];const n=o.n||1;
  for(let i=0;i<n;i++){const last=i===n-1;s=s.concat(last?seq('attack',d,Math.max(0,ct-3),null,(o.lastSpeed||1.3)*sp):seq('attack',d,ct-2,ct+1,(o.midSpeed||3)*sp));}
  const ks=[];for(let i=0;i<n;i++)ks.push(seqIndex(s,'attack',ct,i));const ev=ks.map((kC,i)=>({t:seqTimeAt(s,kC),f:a=>o.f(a,i,i===n-1)}));
  const kL=ks[ks.length-1];return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,ks[0]),dur:seqTimeAt(s,kL+2),hitList:[],
    update:(a,dt)=>{player.glow={color:o.glow||LIC.gold,k:a.t<seqTimeAt(s,kL)?.7:Math.max(0,1-(a.t-seqTimeAt(s,kL))/.3)};o.update&&o.update(a,dt);},events:ev.concat(o.events||[])});}
function lBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||LIC.gold,events:tP=>[{t:tP,f:()=>o.f()}]});}
/* a grab-type skill: target = the held enemy, else the nearest in reach */
const lGrabT=(c,r)=>lHeld()||lTgt(c,r);

/* ---------- normal attack ---------- */
function mkLiBasic(tgt){lEnsure();const lv=Math.max(1,lL('lnCombo')),chain=LB.lnCombo.chain[lv-1]+(lL('lcCombo')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),upper=lL('lcCombo')&&last;
  return lPunches({key:'basic',name:upper?'Thunder Combo':'Olympian Fist '+(idx+1),phi,n:1,lastSpeed:last?1.15:2.1,glow:LIC.bolt,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+40+tgt.r)return;
    if(upper){lHit(tgt,LB.lcCombo.dmg,'lcCombo',{auto:true,big:true});applyCC(tgt,{air:1});lBoltAt(tgt.x,tgt.y);}
    else lHit(tgt,LB.lnCombo.hit,'basic',{auto:true,knock:[phi,24]});
    lPow(tgt,upper,LIC.bolt2);a.hitList.push(tgt);a.hitConfirmed=true;shake(1);stop(24);
    if(lL('lnKnuckle')){LI.knuckleN++;if(LI.knuckleN>=LB.lnKnuckle.every){LI.knuckleN=0;const q=enemies.filter(e=>!e.dead&&e!==tgt&&dist(e,tgt)<LB.lnKnuckle.R).sort((x,y)=>dist(x,tgt)-dist(y,tgt))[0]||tgt;lArc(tgt,q);lHit(q,lLv(LB.lnKnuckle.dmg,'lnKnuckle'),'lnKnuckle');lPow(q,false,LIC.bolt);}}}});}

/* ---------- BASIC ---------- */
function mkLnHide(c){return lBurst({key:'lnHide',name:'Nemean Hide',glow:LIC.marble,f:()=>{addBuff('lnHide',LB.lnHide.T);addBuff('rhSA',LB.lnHide.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:54,w:6,color:LIC.marble,life:.4}));}});}
function mkLnPounce(c){const t=lTgt(c,LB.lnPounce.range),phi=lPhi(c,t);faceTo(phi);const sx=player.x,sy=player.y,L=t?Math.min(lLv(LB.lnPounce.dist,'lnPounce'),dist(player,t)-t.r-10):lLv(LB.lnPounce.dist,'lnPounce'),[dx,dy]=lPathEnd(sx,sy,phi,Math.max(20,L)),T=.32,s=seq('walk',player.dir,0,null,seqTotal(seq('walk',player.dir,0,null,1))/(T+.15));   /* 2026-11-21: the clip must last T+.15 (at speed 3 it ended at .267 s, before the landing at .32 -> the pounce never hit) */
  return act({key:'lnPounce',name:'Lion Pounce',seq:s,windup:T,dur:T+.15,hitList:[],update:(a,dt)=>{dashUpd(a,dt,0,T,sx,sy,dx,dy,LIC.gold2,50);},
    events:[{t:T,f:a=>{for(const e of lNear(player.x,player.y,LB.lnPounce.R)){lHit(e,LB.lnPounce.dmg,'lnPounce',{big:e===t});applyCC(e,{flinch:.35});lPow(e,e===t);a.hitList.push(e);a.hitConfirmed=true;}lSlamFx(player.x,player.y,LB.lnPounce.R);}}]});}
function mkLnRest(c){return lBurst({key:'lnRest',name:'Laurel Rest',glow:'#9aff9a',f:()=>{LI.restUntil=gameTime+LB.lnRest.T;addBuff('lnRest',LB.lnRest.T);player.slowT=0;if(player.st)player.st.slow=0;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:60,w:5,color:'#9aff9a',life:.4}));}});}
function mkLnRoar(c){return lBurst({key:'lnRoar',name:"King's Roar",glow:LIC.gold,f:()=>{for(const e of lNear(player.x,player.y,LB.lnRoar.R)){applyCC(e,{flinch:.4});e.lnWeakT=gameTime+LB.lnRoar.dur;e.lnWeak=lLv(LB.lnRoar.weak,'lnRoar');}
  addFx(new GRing({x:player.x,y:player.y,r0:20,r1:LB.lnRoar.R,w:10,color:LIC.gold,life:.45}));shake(2.2);}});}

/* ---------- A · Olympian Pankration ---------- */
function mkLaGrab(c){const t=lTgt(c,LB.laGrab.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return lPunches({key:'laGrab',name:'Clinch Grab',phi,n:1,lastSpeed:1.4,f:a=>{if(t.dead||dist(player,t)>LB.laGrab.range+t.r)return;a.hitList.push(t);a.hitConfirmed=true;
    if(t.boss&&!lL('lcClinch')){lHit(t,LB.laGrab.knee,'laGrab',{big:true});lPow(t,true);shake(2);return;}
    lHit(t,lLv(LB.laGrab.dmg,'laGrab'),'laGrab');lHold(t,t.boss?LB.lcClinch.boss:(lL('lcClinch')?LB.lcClinch.T:LI_BAL.hold.T));lPow(t,false,LIC.gold);addFx(new DText({x:t.x,y:t.y,z:80,text:'GRAB!',color:LIC.gold,size:13,life:.7}));}});}
function mkLaSuplex(c){const t=lGrabT(c,LB.laSuplex.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),wasHeld=lHeld()===t;
  return lPunches({key:'laSuplex',name:wasHeld&&lL('laPile')?'Pile Driver':'Olympian Suplex',phi,n:1,lastSpeed:1.1,f:a=>{if(t.dead)return;a.hitList.push(t);a.hitConfirmed=true;lRelease();
    let m=lLv(LB.laSuplex.dmg,'laSuplex');if(wasHeld&&lL('laPile'))m+=lLv(LB.laPile.add,'laPile');
    if(t.boss){lHit(t,m,'laSuplex',{big:true});lSlamFx(t.x,t.y,LB.laSuplex.R);lGlory(1);return;}
    const [bx,by]=wasHeld&&lL('laPile')?[t.x,t.y]:lPathEnd(player.x,player.y,phi+Math.PI,t.r+40);
    addFx(new LiFling({e:t,tx:bx,ty:by,T:.28,h:wasHeld&&lL('laPile')?110:70,land:(x,y)=>{lHit(t,m,'laSuplex',{big:true});for(const e of lNear(x,y,LB.laSuplex.R))if(e!==t)lHit(e,LB.laSuplex.land,'laSuplex');lSlamFx(x,y,LB.laSuplex.R);lGlory(1);}}));}});}
function mkLaShove(c){const t=lTgt(c,LB.laShove.range),phi=lPhi(c,t);
  return lPunches({key:'laShove',name:'Heracles Shove',phi,n:1,lastSpeed:1.2,f:a=>{const L=enemiesInCone(player.x,player.y,phi,BASIC_RANGE+50,.75);const h=lHeld();if(h&&!L.includes(h))L.push(h);if(h)lRelease();
    for(const e of L){lHit(e,lLv(LB.laShove.dmg,'laShove'),'laShove',{big:true,knock:[phi,e.boss?40:LB.laShove.push*2]});lPow(e,true);a.hitList.push(e);a.hitConfirmed=true;}
    if(lL('laDomino')&&L.length)setFxTimer(.25,()=>{const done=new Set();for(const e of L){if(e.dead)continue;for(const q of enemies){if(q.dead||q===e||done.has(q)||dist(q,e)>q.r+e.r+24)continue;done.add(q);lHit(q,lLv(LB.laDomino.dmg,'laDomino'),'laDomino');lHit(e,lLv(LB.laDomino.dmg,'laDomino'),'laDomino');lPow(q,false);}}});shake(2);}});}
function mkLaSpin(c){const t=lGrabT(c,LB.laSpin.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const turns=lL('laHurricane')?LB.laHurricane.turns:LB.laSpin.turns,gap=.24,T=turns*gap+.15,d=player.dir;
  if(!t.boss)lHold(t,T+.2);const s=[];for(let i=0;i<=turns*2;i++){const dd=DIR8[(DIR8.indexOf(d)+i*2)%8];s.push(...hold('attack',dd==='N'?'NE':atkDir(dd),CT(atkDir(d)),i<turns*2?gap*500:150));}   /* 2026-11-21: one more .15 s hold so the clip lasts T (it ended .15 s early and the release at T-.05 never fired) */
  const ev=[];for(let i=0;i<turns;i++)ev.push({t:.08+i*gap,f:a=>{for(const e of lNear(player.x,player.y,LB.laSpin.R)){if(e===t)continue;lHit(e,lLv(LB.laSpin.dmg,'laSpin'),'laSpin',{knock:[angTo(e),60]});lPow(e,false);a.hitConfirmed=true;}if(!t.dead)lHit(t,lLv(LB.laSpin.dmg,'laSpin')*.5,'laSpin');addFx(new GRing({x:player.x,y:player.y,r0:20,r1:LB.laSpin.R,w:6,color:LIC.marble,life:.22}));player.phi+=Math.PI;}});
  ev.push({t:T-.05,f:a=>{lRelease();if(!t.dead&&!t.boss){const ph=player.phi,[tx,ty]=lPathEnd(t.x,t.y,ph,lL('laHurricane')?260:130);addFx(new LiFling({e:t,tx,ty,T:.3,h:50,land:(x,y)=>{lHit(t,lLv(LB.laSpin.dmg,'laSpin')*1.5,'laSpin',{big:true});dustPuff(x,y,6,'#e8e0d0',70,8);}}));}lGlory(1);
    if(lL('lcAtlas')){for(const e of lNear(player.x,player.y,LB.lcAtlas.R))lHit(e,LB.lcAtlas.dmg,'lcAtlas',{big:true});lSlamFx(player.x,player.y,LB.lcAtlas.R);}}});
  return act({key:'laSpin',name:'Arena Spin',seq:s,windup:.08,dur:T,hitList:[],update:()=>{addBuff('rhSA',.1);player.glow={color:LIC.gold,k:.6};},events:ev});}
function mkLaLift(c){const t=lGrabT(c,LB.laLift.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return lBurst({key:'laLift',name:'Titan Lift',phi,speed:1.6,f:()=>{if(t.dead)return;lRelease();const n=lSpendGlory(),m=lLv(LB.laLift.dmg,'laLift')+LB.laLift.per*n;
    addFx(new LiFling({e:t,tx:t.x,ty:t.y,T:.3,h:t.boss?20:120,land:(x,y)=>{lHit(t,m,'laLift',{big:true});lSlamFx(x,y,90);if(n)addFx(new DText({x,y,z:96,text:'GLORY ×'+n,color:LIC.gold,size:13,life:.8}));
      if(lL('laCrack')){for(const e of enemies.filter(q=>!q.dead&&lSeg(q.x,q.y,x,y,x+Math.cos(phi)*LB.laCrack.len,y+Math.sin(phi)*LB.laCrack.len)<q.r+24)){lHit(e,lLv(LB.laCrack.dmg,'laCrack'),'laCrack');applyCC(e,{air:1});}for(let i=1;i<=5;i++)dustPuff(x+Math.cos(phi)*i*40,y+Math.sin(phi)*i*40,3,'#c8b8a0',50,7);}}}));}});}
function mkLaCounter(c){const T=LB.laCounter.T,s=hold('buff',player.dir,2,T*1000);LI.counterUntil=gameTime+T+.05;
  return act({key:'laCounter',name:'Counter Hold',seq:s,windup:0,dur:T,hitList:[],update:()=>{player.glow={color:LIC.gold,k:.6};}});}
function mkLaLabors(c){const n=LB.laLabors.n,gap=.15,T=n*gap+.4,sx=player.x,sy=player.y,g=LI.glory,m=lLv(LB.laLabors.dmg,'laLabors')+LB.laLabors.per*g;
  const L0=lNear(player.x,player.y,LB.laLabors.R);if(!L0.length){msg('ไม่มีเป้าหมาย');return null;}const s=hold('attack',atkDir(player.dir),CT(atkDir(player.dir)),T*1000);
  const ev=[];for(let i=0;i<n;i++)ev.push({t:.05+i*gap,f:a=>{const L=lNear(sx,sy,LB.laLabors.R);if(!L.length)return;const e=L[i%L.length];const an=rnd(0,TAU);player.x=e.x+Math.cos(an)*(e.r+24);player.y=e.y+Math.sin(an)*(e.r+24);faceTo(angTo(e));
    lHit(e,m,'laLabors',{big:true});lPow(e,true,LIC.gold);if(!e.boss){e.x=sx+(e.x-sx)*.85;e.y=sy+(e.y-sy)*.85;}a.hitConfirmed=true;shake(1.6);stop(30);if(i===n-1)addFx(new DText({x:sx,y:sy,z:120,text:'XII',color:LIC.gold,size:18,life:1}));}});
  ev.push({t:T-.15,f:()=>{player.x=sx;player.y=sy;for(const e of lNear(sx,sy,LB.laLabors.R*.7))lHit(e,LB.laLabors.fin,'laLabors',{big:true,knock:[angTo(e),120]});lSlamFx(sx,sy,LB.laLabors.R*.7);
    if(lL('laLegend')){addBuff('laLegend',LB.laLegend.T);addBuff('rhSA',LB.laLegend.T);LI.glory=LI_BAL.glory.cap;LI.gloryT=gameTime+LI_BAL.glory.dur;}}});
  return act({key:'laLabors',name:'Labors of Heracles',seq:s,windup:.05,dur:T,hitList:[],update:()=>{player.iframes=.06;player.glow={color:LIC.gold,k:.9};},onInterrupt:()=>{player.x=sx;player.y=sy;},events:ev});}

/* ---------- B · Thunder King ---------- */
function lJavelin(phi,mult,key,o={}){addFx(new LiShot(Object.assign({x:player.x,y:player.y,phi,len:LB.lbJavelin.len,pierce:lOver()?99:LB.lbJavelin.pierce,onHit:e=>{lHit(e,mult,key);lPow(e,false,LIC.bolt);if(o.hit)o.hit(e);}},o.shot||{})));}
function mkLbJavelin(c){const t=lTgt(c,LB.lbJavelin.range),phi=lPhi(c,t),m=lLv(LB.lbJavelin.dmg,'lbJavelin'),n=lL('lcFork')?LB.lcFork.n:1;let got=false;
  return lPunches({key:'lbJavelin',name:'Thunderbolt Javelin',phi,n:1,lastSpeed:1.3,glow:LIC.bolt,f:a=>{for(let i=0;i<n;i++){const an=phi+(n>1?(i-(n-1)/2)*LB.lcFork.spread:0);lJavelin(an,m,'lbJavelin',{hit:()=>{a.hitConfirmed=true;if(!got){got=true;lCharge(2);}}});}}});}
function lSkyAt(x,y,m,key,R){lBoltAt(x,y);for(const e of lNear(x,y,R))lHit(e,m,key,{big:true});addFx(new GRing({x,y,r0:6,r1:R,w:6,color:LIC.bolt,life:.3}));shake(1.8);}
function mkLbSky(c){const t=lTgt(c,LB.lbSky.range),x0=c.gx??(t?t.x:player.x+Math.cos(player.phi)*120),y0=c.gy??(t?t.y:player.y+Math.sin(player.phi)*120),phi=Math.atan2(y0-player.y,x0-player.x);
  return lBurst({key:'lbSky',name:'Sky Strike',phi,speed:2,glow:LIC.bolt,f:()=>{const pts=lL('lcRain')?[-1,0,1].map(k=>[x0+Math.cos(phi)*k*LB.lcRain.gap,y0+Math.sin(phi)*k*LB.lcRain.gap]):[[x0,y0]];
    pts.forEach(([x,y],i)=>setFxTimer(.001+i*.12,()=>{lSkyAt(x,y,lLv(LB.lbSky.dmg,'lbSky'),'lbSky',LB.lbSky.R);if(lL('lbTwin'))setFxTimer(.5,()=>lSkyAt(x,y,lLv(LB.lbTwin.dmg,'lbTwin'),'lbTwin',LB.lbSky.R));}));lCharge(2);}});}
function mkLbEagle(c){const t=lTgt(c,LB.lbEagle.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return lBurst({key:'lbEagle',name:'Eagle of Zeus',phi:angTo(t),speed:2.2,glow:LIC.gold,f:()=>{addFx(new LiEagle({tg:t,n:LB.lbEagle.n,hit:e=>{lHit(e,lLv(LB.lbEagle.dmg,'lbEagle'),'lbEagle');lPow(e,false,LIC.gold);lCharge(1);}}));
    if(lL('lbAetos'))addBuff('lbAetos',lLv(LB.lbAetos.T,'lbAetos'));}});}
function mkLbCloud(c){const x=c.gx??player.x,y=c.gy??player.y,big=lL('lbThunderhead')>0;
  return lBurst({key:'lbCloud',name:'Storm Cloud',phi:Math.atan2(y-player.y,x-player.x),speed:2,glow:LIC.bolt,f:()=>{LI.cloud={x,y,R:LB.lbCloud.R*(big?LB.lbThunderhead.scale:1),until:gameTime+LB.lbCloud.T,tk:.3,dmg:lLv(LB.lbCloud.dmg,'lbCloud'),slow:big};}});}
function mkLbOver(c){if(LI.charge<LI_BAL.charge.cap){msg('ต้องมีประจุ 10');return null;}
  return lBurst({key:'lbOver',name:'Overcharge',speed:1.6,glow:LIC.bolt,f:()=>{lSpendCharge();addBuff('lbOver',LB.lbOver.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:110,w:10,color:LIC.bolt,life:.45}));addFx(new DText({x:player.x,y:player.y,z:110,text:'OVERCHARGE',color:LIC.bolt2,size:15,life:1}));lBoltAt(player.x,player.y);shake(2.4);}});}
function mkLbAegis(c){return lBurst({key:'lbAegis',name:'Aegis Flash',glow:LIC.bolt,f:()=>{LI.aegis=LB.lbAegis.n;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:56,w:6,color:LIC.bolt,life:.4}));}});}
function mkLbWrath(c){const n=LB.lbWrath.n,gap=.18,R=LB.lbWrath.R;
  /* 2026-11-21 bug fix: the 12 bolts were action events up to tP+2.3 s, but the buff clip ends at ~1.0 s, so only 4 bolts fell and King of the Gods
     never came. They are now timers started on the release (same rhythm: gap in action seconds = gap/ACTION_TEMPO real seconds); the lion is free to move. */
  return buffAct({key:'lbWrath',name:'Wrath of Olympus',speed:1.4,glow:LIC.bolt,events:tP=>{const ev=[{t:.02,f:()=>{skyDarkT=.8;}}],k=1/(ACTION_TEMPO||.75);ev.push({t:tP,f:()=>{for(let i=0;i<n;i++)setFxTimer(.001+i*gap*k,()=>{const L=lNear(player.x,player.y,R).sort((a,b)=>dist(a,player)-dist(b,player));
      if(L.length){const e=L[i%L.length];lBolt(e,lLv(LB.lbWrath.dmg,'lbWrath'),'lbWrath');}else{const an=i*2.4;lBoltAt(player.x+Math.cos(an)*R*.6,player.y+Math.sin(an)*R*.6);}lCharge(1);});
    setFxTimer((n*gap+(lL('lbKing')?.5:.25))*k,()=>{skyDarkT=0;});   /* the sky was left dark after the ult */
    if(lL('lbKing'))setFxTimer(.001+(n*gap+.15)*k,()=>{const ch=lSpendCharge(),m=LB.lbKing.dmg+LB.lbKing.per*ch;addFx(new LiBolt({x:player.x,y:player.y,w:12,life:.5}));for(const e of lNear(player.x,player.y,R*.6))lHit(e,m,'lbKing',{big:true});addFx(new GRing({x:player.x,y:player.y,r0:20,r1:R*.6,w:16,color:LIC.bolt,life:.5}));shake(4);stop(80);});}});
    return ev;}});}

/* ---------- C ---------- */
function mkLcToss(c){const t=lGrabT(c,LB.laGrab.range+20);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return lBurst({key:'lcToss',name:'Titan Toss',phi,speed:2,f:()=>{if(t.dead)return;lRelease();const boom=(x,y)=>{for(const e of lNear(x,y,LB.lcToss.R))lHit(e,LB.lcToss.dmg,'lcToss',{big:true,knock:[Math.atan2(e.y-y,e.x-x),120]});lSlamFx(x,y,LB.lcToss.R);};
    if(t.boss){lHit(t,LB.lcToss.dmg,'lcToss',{big:true});lSlamFx(t.x,t.y,LB.lcToss.R);return;}const [tx,ty]=lPathEnd(player.x,player.y,phi,LB.lcToss.len);addFx(new LiFling({e:t,tx,ty,T:.5,h:130,land:boom}));}});}
function mkLcCrown(c){return lBurst({key:'lcCrown',name:'Laurel Crown',glow:LIC.gold,f:()=>{addBuff('lcCrown',LB.lcCrown.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:6,color:LIC.gold,life:.45}));}});}
function mkLcAscend(c){return lBurst({key:'lcAscend',name:'Olympian Ascension',speed:1.4,glow:LIC.gold,f:()=>{addBuff('lcAscend',LB.lcAscend.T);lGlory(1);lCharge(2);lBoltAt(player.x,player.y);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:130,w:12,color:LIC.gold,life:.5}));addFx(new DText({x:player.x,y:player.y,z:116,text:'OLYMPIAN ASCENSION',color:LIC.gold,size:15,life:1.1}));shake(3);}});}
function mkLcTwelfth(c){const t=lGrabT(c,LB.lcTwelfth.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return lBurst({key:'lcTwelfth',name:'The Twelfth Labor',phi,speed:1.5,f:()=>{if(t.dead)return;lRelease();const n=lSpendGlory(),m=LB.lcTwelfth.dmg+LB.lcTwelfth.per*n;
    addFx(new LiFling({e:t,tx:t.x,ty:t.y,T:.6,h:t.boss?60:220,land:(x,y)=>{lHit(t,m,'lcTwelfth',{big:true});lSlamFx(x,y,120);lBoltAt(x,y);addFx(new DText({x,y,z:110,text:'XII',color:LIC.gold,size:18,life:1}));shake(4);}}));}});}
function mkLcKeraunos(c){const t=lTgt(c,LB.lcKeraunos.range),phi=lPhi(c,t);
  return lBurst({key:'lcKeraunos',name:'Keraunos',phi,speed:1.5,glow:LIC.bolt,f:()=>{const ch=lSpendCharge(),m=LB.lcKeraunos.dmg+LB.lcKeraunos.per*ch;
    addFx(new LiShot({x:player.x,y:player.y,phi,len:LB.lcKeraunos.len,pierce:99,w:34,speed:900,big:true,col:LIC.bolt2,onHit:e=>{lHit(e,m,'lcKeraunos',{big:true});lBoltAt(e.x,e.y);}}));shake(3);stop(60);}});}

const LI_MAKE={lnHide:mkLnHide,lnPounce:mkLnPounce,lnRest:mkLnRest,lnRoar:mkLnRoar,
  laGrab:mkLaGrab,laSuplex:mkLaSuplex,laShove:mkLaShove,laSpin:mkLaSpin,laLift:mkLaLift,laCounter:mkLaCounter,laLabors:mkLaLabors,
  lbJavelin:mkLbJavelin,lbSky:mkLbSky,lbEagle:mkLbEagle,lbCloud:mkLbCloud,lbOver:mkLbOver,lbAegis:mkLbAegis,lbWrath:mkLbWrath,
  lcToss:mkLcToss,lcCrown:mkLcCrown,lcAscend:mkLcAscend,lcTwelfth:mkLcTwelfth,lcKeraunos:mkLcKeraunos};
const LI_ZIGZAG=[['laGrab','laSuplex'],['lbJavelin','lbSky']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function lionAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['lcCrown','lnRest','lnHide','lbAegis'])if(ready(k)&&!hasBuff(k))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=lNear(player.x,player.y,220),tal=D.mag>D.patk;
  for(const k of ['lcAscend','lnRoar'])if(ready(k)&&!hasBuff(k)&&d<220)return cast(k);
  if(tal){if((t.boss||near.length>=3)&&ready('lbWrath'))return cast('lbWrath');
    if(LI.charge>=LI_BAL.charge.cap&&ready('lbOver')&&!lOver())return cast('lbOver');
    if(LI.charge>=6&&ready('lcKeraunos'))return cast('lcKeraunos');
    for(const k of ['lbCloud','lbEagle','lbSky','lbJavelin'])if(ready(k)&&!(k==='lbCloud'&&LI.cloud)&&d<=(SKILLS[k].range||300)+t.r)return cast(k);
    return false;}
  if((t.boss||near.length>=3)&&ready('laLabors'))return cast('laLabors');
  if(d>140&&ready('lnPounce'))return cast('lnPounce');
  const h=lHeld();
  if(h){for(const k of ['lcTwelfth','laSpin','lcToss','laSuplex','laLift'])if(ready(k))return cast(k);}
  if(LI.glory>=LI_BAL.glory.cap){for(const k of ['lcTwelfth','laLift'])if(ready(k)&&d<=140)return cast(k);}
  for(const k of ['laGrab','laShove','laSuplex','laSpin'])if(ready(k)&&d<=(SKILLS[k].range||120)+t.r)return cast(k);
  return false;}

function installLion(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of LI_DEFS){const b=LB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:lIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'olympian_white_lion'};
    if(b.mp!=null){const mp=b.mp,isB=d.br==='B'||d.col==='B';Object.defineProperty(sk,'mp',{get(){return Math.max(0,mp-(isB&&lL('lbConductor')?lLv(LB.lbConductor.sp,'lbConductor'):0));},enumerable:true,configurable:true});}
    if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(LI_MAKE[d.key])sk.make=LI_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${LI_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of LI_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* damage type: Basic column = higher of ATK / MATK, A = ATK, B = MATK */
  Object.assign(SK_DT,{lnKnuckle:'b',lnPounce:'b',lcCombo:'b',lcReflect:'b',lcClinch:'p',lcToss:'p',lcAtlas:'p',lcTwelfth:'p',lcFork:'m',lcRain:'m',lcSupercell:'m',lcKeraunos:'m',
    laPile:'p',laDomino:'p',laCrack:'p',lbStatic:'m',lbTwin:'m',lbField:'m',lbKing:'m'});
  Object.assign(SK_CC,{laSuplex:{flinch:.5},laShove:{flinch:.4},laSpin:{flinch:.3},laLift:{air:1},laCrack:{air:1},laLabors:{flinch:.35},lnPounce:{flinch:.35},
    lbSky:{flinch:.35},lbTwin:{flinch:.3},lbEagle:{flinch:.25},lbWrath:{flinch:.3},lbKing:{air:1},lcToss:{air:1},lcTwelfth:{air:1},lcKeraunos:{flinch:.45}});
  Object.assign(SK_KO,{basic:1,laGrab:1.4,laSuplex:3,laShove:2.2,laSpin:1.4,laLift:3.6,laCrack:2.4,laLabors:3,laDomino:1.4,lnPounce:2.4,lnKnuckle:1,
    lbJavelin:1,lbSky:1.6,lbTwin:1.2,lbEagle:.8,lbCloud:.6,lbWrath:1.6,lbKing:3,lbStatic:.5,lbField:.3,lcToss:3.2,lcTwelfth:4,lcKeraunos:3,lcAtlas:2.6,lcCombo:2});
  TABS.length=0;TABS.push({n:'Pankration',keys:['laGrab','laSuplex','laShove','laSpin','laLift','laCounter','laLabors','lnHide','lnPounce','lnRoar']},
    {n:'Thunder',keys:['lbJavelin','lbSky','lbEagle','lbCloud','lbOver','lbAegis','lbWrath','lnHide','lnRest','lnRoar']},
    {n:'Zeus',keys:['lcToss','lcCrown','lcAscend','lcTwelfth','lcKeraunos','lnRest']});
  Object.assign(BUFFDEF,{lnHide:{n:'Nemean Hide',c:LIC.marble,i:'HIDE'},lnRest:{n:'Laurel Rest',c:'#9aff9a',i:'REST'},lbOver:{n:'Overcharge',c:LIC.bolt,i:'OVER'},lbAetos:{n:'Aetos Guard',c:LIC.gold,i:'EAGLE'},
    laLegend:{n:'Nemean Legend',c:LIC.gold,i:'LEGEND'},lcCrown:{n:'Laurel Crown',c:LIC.gold,i:'CROWN'},lcAscend:{n:'Olympian Ascension',c:LIC.gold,i:'ZEUS'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Olympian Cub';JOB.hpA=1.5;JOB.hpB=5.5;JOB.spB=3.2;
  ITEMS.olympianCestus={n:'Olympian Cestus',slot:'rhand',two:1,kind:'Knuckle',atk:145,matk:125,wlv:3,aspd:152,ref:6,cards:2,w:150,b:{vit:2},size:{small:1,medium:1,large:.85},d:'ถุงมือนักชกโอลิมปิก VIT +2'};
  ITEMS.zeusGauntlets={n:"Zeus's Thunder Gauntlets",slot:'rhand',two:1,kind:'Knuckle',atk:150,matk:165,wlv:4,aspd:150,ref:4,cards:1,w:160,b:{tal:3},size:{small:1,medium:1,large:.85},d:'ปลอกแขนสายฟ้าของซุส MATK +3'};
  EQ.rhand='olympianCestus';INV.length=0;INV.push('zeusGauntlets','vikinghelm','ringPrec','clipLuck');
  /* Royal Mane: flat max HP (level × n) */
  if(typeof applyStats==='function'&&!applyStats._lion){const _as=applyStats;applyStats=function(){_as.apply(this,arguments);const f=lL('lnMane')?PS.lv*lLv(LB.lnMane.hp,'lnMane'):0;if(f>0){const r=player.hp/player.maxHp;player.maxHp+=f;if(D)D.maxHp=player.maxHp;player.hp=Math.min(player.maxHp,Math.round(player.maxHp*r));}};applyStats._lion=1;}
  /* flat ATK / MATK bonuses */
  const flat=(e,o)=>{let b=0;
    if(hasBuff('lcCrown'))b+=LB.lcCrown.flat;
    if(!(o&&o.magic)){if(lL('laPride'))b+=LI.glory*lLv(LB.laPride.atk,'laPride');if(lAsc()&&(o&&o.auto))b+=LB.lcAscend.atk;}
    else if(lOver()&&lCol(o&&o.skill)==='B')b+=lLv(LB.lbOver.tal,'lbOver');
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+Math.min(flat(e,o),base))/base;};   // 2026-11-22: a flat bonus adds at most the hit's own power (off-stat builds got ×10+ from it)
  window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{const melee=e&&!e.dead&&dist(player,e)<e.r+90;
    /* Counter Hold: catch the attacker and throw */
    if(LI.counterUntil>gameTime&&melee){LI.counterUntil=0;faceTo(angTo(e));lHit(e,LB.laCounter.dmg,'laCounter',{big:true});if(e.boss)applyCC(e,{flinch:1});else{const [tx,ty]=lPathEnd(player.x,player.y,player.phi+Math.PI,e.r+40);addFx(new LiFling({e,tx,ty,T:.28,h:70,land:(x,y)=>lSlamFx(x,y,70)}));}lGlory(1);addFx(new DText({x:player.x,y:player.y,z:90,text:'COUNTER HOLD',color:LIC.gold,size:13,life:.8}));return 1;}
    /* Aegis Flash / Aetos Guard block whole hits */
    if(LI.aegis>0){LI.aegis--;if(e&&!e.dead)applyCC(e,{flinch:1});lArc(player,e||player);return 1;}
    if(hasBuff('lbAetos')){delete player.buffs.lbAetos;addFx(new DText({x:player.x,y:player.y,z:90,text:'AETOS!',color:LIC.gold,size:12,life:.7}));return 1;}
    let r=0;
    if(hasBuff('lnHide')){r+=lLv(LB.lnHide.block,'lnHide');if(lL('lcReflect')&&melee)lHit(e,LB.lcReflect.dmg,'lcReflect');}
    if(lL('laBody')&&(lHeld()||gameTime-LI.throwT<LB.laBody.after))r+=lLv(LB.laBody.block,'laBody');
    if(lL('laPride'))r+=LI.glory*lLv(LB.laPride.block,'laPride');
    if(hasBuff('laLegend'))r+=LB.laLegend.block;
    if(e&&e.lnWeakT>gameTime)r+=e.lnWeak||0;
    return Math.max(1,d-r);};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.lionAutoTick=lionAutoTick;
  mkBasic=mkLiBasic;lEnsure();
  for(const k in SKILLS){const sk=SKILLS[k];if(sk.make&&!sk.make._lE){const mk=sk.make;sk.make=function(){lEnsure();return mk.apply(this,arguments);};sk.make._lE=1;}}
  try{document.title='Aetherfall — Olympian White Lion';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Olympian Lion';if(cl)cl.textContent='Olympian Cub';}catch(e){}
  window.LI=LI;window.LI_DEFS=LI_DEFS;window.LI_BAL=LI_BAL;}

/* =====================================================================
   7. ICONS (painted if present in assets/icons/lion, code SVG fallback)
   ===================================================================== */
function lIconSpec(d){const col=d.br==='A'?'#ffe0a0':d.br==='B'?'#bfe8ff':d.br==='C'?'#ffe9a8':'#fff2c8',bg=d.br==='A'?'#3a2a10':d.br==='B'?'#0f2244':d.br==='C'?'#2a2214':'#2a2620';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const bolt=`<path d="M24 6 L14 24 H22 L18 38 L32 18 H24Z" fill="#bfe8ff" stroke="#1a3a6a" stroke-width="1"/>`;
  const fist=`<rect x="13" y="15" width="18" height="15" rx="5" fill="${col}" stroke="#3a2a10" stroke-width="1.4"/><path d="M13 20 H31 M13 25 H31" stroke="#3a2a10" stroke-width="1"/>`;
  const laurel=`<path d="M10 30 Q22 6 34 30" stroke="#ffd36a" stroke-width="3" fill="none"/><circle cx="12" cy="24" r="3" fill="#ffd36a"/><circle cx="32" cy="24" r="3" fill="#ffd36a"/><circle cx="16" cy="16" r="3" fill="#ffd36a"/><circle cx="28" cy="16" r="3" fill="#ffd36a"/>`;
  let g;
  if(d.br==='B'||/Javelin|Keraunos|Thunder|Rain|Supercell|Fork/.test(d.name))g=bolt;
  else if(/Laurel|Crown|Ascension|Mane|Roar/.test(d.name))g=laurel;
  else g=fist;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/lion/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
