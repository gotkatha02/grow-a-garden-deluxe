/* =====================================================================
   AETHERFALL — EGYPTIAN HIPPO · "Hapi" (Egypt) — 12 Tails style
   Character module. Loaded only when the Hippo is played; index.html calls installHippo().

     Basic  · Nile Calf          — heavy mace combo, Waddle Rush, Yawn taunt, Nap (SP), Feast, Blood Sweat, Hippo Heart
     A Tree · Taweret Guardian   — FULLNESS + body slams [slam]: jump, land, crush (physical, ATK)
     B Tree · Nile Flood Priest  — MUD POOLS: mud, water, lotus magic (magic, MATK)
     C Tree · Behemoth of the Nile — 12 Tails "Additions": 4 upgrades each for Basic / A / B at Lv 55 / 60 / 70 / 80

   FULLNESS 0–100 (120 with Big Appetite Lv2) comes from fighting: every hit +1, slam hits +2, kills +8.
   It does NOT drop while fighting; it drains only out of combat (4 s without dealing or taking a hit).
   Every 20 Fullness: body a little bigger, max HP +60, slam ATK +10, move −4. Big slams can burn Fullness.
   Owner's rules: no percent effects (flat numbers, counters instead of chances); balanced via tools/balance_bench.js.
   Sprites: placeholder drawn in code (assets_hippo.js, tools/statichero.py).
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const HP_BAL={
  full:{cap:100,cap2:120,hit:1,slam:2,kill:8,drain:3,idle:4,tier:20,hpPer:60,slamAtkPer:10,movePer:4,sizePer:.04},
  pool:{max:5},
  sk:{
    // ---- Basic
    hnCombo:{chain:[2,3,4,4],hit:1.15,fin:1.8,finR:70},
    hnWaddle:{dist:100,dmg:.6,cd:[7,5],mp:6},
    hnYawn:{dmg:.5,R:120,half:.8,taunt:[3,5],cd:12,mp:10},
    hnNap:{sp:[3,6,10],dur:8,cd:12,mp:0},
    hnFeast:{heal:[3,4.5,6],full:20,atk:15,dur:20,cd:30,mp:12},
    hnSweat:{regen:[.4,.8],every:5,icd:[20,14]},
    hnHeart:{hp:[150,300]},
    // ---- A · Taweret Guardian (slams)
    haFlop:{dmg:[1.6,1.8,2.0,2.2],dist:120,R:80,cd:6,mp:12,range:150},
    haAppetite:{kill:[3,6]},
    haGulp:{R:180,hold:3,tick:.4,boss:1.5,full:10,cd:10,mp:12,range:180},
    haBurp:{dmg:2.0,shot:2.6,len:260,mp:8},
    haBounce:{dmg:[1.6,1.6,1.6],hop:1.0,n:[1,2,3],R:90,cd:9,mp:16,range:220},
    haBelly:{every:[6,5,4,3],dmg:1.0},
    haWard:{block:[8,14],dur:12,cd:30,mp:16},
    haPound:{dmg:[1.6,1.8],R:130,cd:8,mp:14},
    haSky:{dmg:[2.4,2.6,2.8],R:110,air:.8,cd:12,mp:18,range:260},
    haDouble:{dmg:2.2,R:110,mp:10},
    haHeavy:{atk:[20,40]},
    haRoll:{dmg:.5,n:5,fin:1.6,len:300,cd:14,mp:20},
    haLast:{block:[15,25],heal:[1,1.5]},
    haMountain:{dmg:4.0,R:140,air:1.2,burn:60,per:.02,cd:20,mp:28,range:260},
    haBehemoth:{dur:10,block:25,size:1.35,R:1.5,fin:8.0,finR:240,cd:70,mp:60},
    // ---- B · Nile Flood Priest (magic)
    hbMud:{dmg:[1.4,1.6,1.8,2.0],len:240,poolR:60,poolT:4,cd:5,mp:10,range:240},
    hbBless:{regen:[.25,.4]},
    hbWallow:{R:120,T:8,block:10,cd:12,mp:14},
    hbSplash:{dmg:2.2,R:140,mp:10},
    hbWave:{dmg:[1.8,1.8,1.8],len:260,cd:9,mp:14,range:260},
    hbSilt:{t:[2,4],r:[10,20]},
    hbBounty:{heal:[4,6],mud:2,full:10,T:6,cd:25,mp:16},
    hbGeyser:{dmg:[2.5,2.5],dry:1.5,R:80,cd:10,mp:16,range:300},
    hbLotus:{dmg:[.8,.8,.8],n:3,cd:12,mp:18},
    hbLotusStorm:{dmg:3.0,R:90,heal:1,mp:10},
    hbInund:{tal:[15,30]},
    hbQuick:{R:150,T:6,tick:.4,cd:18,mp:20,range:300},
    hbFlood:{per:[5,8]},
    hbWrath:{dmg:4.5,len:320,cd:20,mp:28,range:300},
    hbSea:{dur:8,R:300,move:60,regen:.8,geyser:2.0,fin:6.0,cd:70,mp:60},
    // ---- C · Additions
    hcCrater:{R:100},
    hcSecond:{sp:80,full:20},
    hcMega:{size:.12,hp:250,R:10},
    hcChomp:{dmg:.9,n:4,step:60,full:3,cd:20,mp:14},
    hcTriple:{n:2,mul:.6},
    hcGobble:{R:200,n:3,dmg:1.2,full:10,cd:25,mp:18},
    hcEmbrace:{shield:400},
    hcMeteor:{dmg:2.8,n:3,R:120,burn:30,cd:30,mp:30,range:300},
    hcSticky:{pull:20},
    hcSubmerge:{hide:1.4,dmg:2.5,R:110,cd:18,mp:18},
    hcSacred:{heal:1},
    hcJar:{T:10,R:130,heal:.5,tick:.4,fin:3.0,cd:30,mp:24}
  }};
const HB=HP_BAL.sk,HF=HP_BAL.full;
const hpX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const hpT=n=>'MATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const HP_DEFS=[
 // ---------------- BASIC · NILE CALF ----------------
 {key:'hnCombo',id:'HP-N01',name:'Hippo Combo',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) เหวี่ยงคทาหิน ช้าแต่หนัก Lv4 ท่าสุดท้ายกระโดดเตี้ยแล้วทับ',lv:i=>[`ต่อได้ ${HB.hnCombo.chain[i-1]} จังหวะ`,`จังหวะละ ${hpX(HB.hnCombo.hit)}`,i>=4?`ท่าสุดท้ายทับ ${hpX(HB.hnCombo.fin)} รัศมี ${HB.hnCombo.finR}`:'']},
 {key:'hnWaddle',id:'HP-N02',name:'Waddle Rush',br:'basic',row:1,max:2,type:'self',d:'เดินตุ้ยพุ่งสั้นๆ ชนศัตรู หลบได้ช่วงสั้น',lv:i=>[`ระยะ ${HB.hnWaddle.dist}`,`ชน ${hpX(HB.hnWaddle.dmg)}`,`Cooldown ${HB.hnWaddle.cd[i-1]} วิ`]},
 {key:'hnYawn',id:'HP-N03',name:'Yawn Threat',br:'basic',row:2,max:2,type:'self',d:'หาวกว้างเป็นรูปพัด ศัตรูชะงักแล้วหันมาตีฮิปโป',lv:i=>[`${hpX(HB.hnYawn.dmg)}`,`ยั่วยุ ${HB.hnYawn.taunt[i-1]} วิ`]},
 {key:'hnNap',id:'HP-N04',name:'Nap',br:'basic',row:2,max:3,type:'self',d:'นอนหงายงีบ เติม SP เดินหรือโดนตีแล้วตื่น (แบบ Charge ของ 12 หาง)',lv:i=>[`SP +${HB.hnNap.sp[i-1]} ต่อวิ`,`นานสุด ${HB.hnNap.dur} วิ`]},
 {key:'hnFeast',id:'HP-N05',name:'Feast',br:'basic',row:3,max:3,type:'self',d:'กินแตงโมทั้งลูก ฟื้น HP ได้ความอิ่ม และ ATK เพิ่ม (แบบ Big Eater)',lv:i=>[`ฟื้น HP = เลเวล×${HB.hnFeast.heal[i-1]}`,`ความอิ่ม +${HB.hnFeast.full}`,`ATK +${HB.hnFeast.atk} ${HB.hnFeast.dur} วิ`]},
 {key:'hnSweat',id:'HP-N06',name:'Blood Sweat',br:'basic',row:3,max:2,passive:1,d:'(Passive) เหงื่อสีแดงของฮิปโป ฟื้น HP เป็นระยะ และปัดดีบัฟทิ้ง',lv:i=>[`ฟื้น HP = เลเวล×${HB.hnSweat.regen[i-1]} ทุก ${HB.hnSweat.every} วิ`,`ปัดดีบัฟ 1 อย่าง ทุก ${HB.hnSweat.icd[i-1]} วิ`]},
 {key:'hnHeart',id:'HP-N07',name:'Hippo Heart',br:'basic',row:4,max:2,passive:1,d:'(Passive) หัวใจฮิปโป HP สูงสุดเพิ่ม',lv:i=>[`HP สูงสุด +${HB.hnHeart.hp[i-1]}`]},
 // ---------------- A · TAWERET GUARDIAN ----------------
 {key:'haFlop',id:'HP-A01',name:'Belly Flop',br:'A',row:1,max:4,type:'melee',d:'[ทับ] กระโดดไปข้างหน้าแล้วทิ้งพุงทับ (อัปสลับเลเวลกับ Bounce Slam)',lv:i=>[`${hpX(HB.haFlop.dmg[i-1])} รัศมี ${HB.haFlop.R}`,'Cooldown 6 วิ']},
 {key:'haAppetite',id:'HP-A02',name:'Big Appetite',br:'A',row:1,max:2,passive:1,d:'(Passive) กระเพาะใหญ่ ฆ่ามอนได้ความอิ่มเพิ่ม Lv2 ความอิ่มสูงสุด 120',lv:i=>[`ฆ่ามอน ความอิ่ม +${HB.haAppetite.kill[i-1]} เพิ่ม`,i>=2?'ความอิ่มสูงสุด 120':'']},
 {key:'haGulp',id:'HP-A03',name:'Gulp',br:'A',row:2,max:3,type:'self',pre:[['haFlop',1]],d:'ดูดศัตรูเข้าปาก มอนธรรมดาถูกอมไว้ บอสโดนดึงแล้วงับ ฮุบแล้วกดซ้ำเพื่อใช้ Burp Cannon',lv:i=>[`อม ${HB.haGulp.hold} วิ ${hpX(HB.haGulp.tick)} ต่อวิ`,`บอส ${hpX(HB.haGulp.boss)}`,`ความอิ่ม +${HB.haGulp.full}`]},
 {key:'haBurp',id:'HP-A04',name:'Burp Cannon',br:'A',row:2,max:1,parent:'haGulp',d:'(ท่าต่อ) ถ่มมอนที่อมไว้ออกไปเป็นลูกปืนใหญ่',lv:()=>[`แนวยาว ${HB.haBurp.len} ${hpX(HB.haBurp.dmg)}`,`ตัวที่ถูกถ่ม ${hpX(HB.haBurp.shot)}`]},
 {key:'haBounce',id:'HP-A05',name:'Bounce Slam',br:'A',row:3,max:3,type:'melee',pre:[['haFlop',1]],d:'[ทับ] กระโดดทับเป้า แล้วเด้งไปทับตัวถัดไป',lv:i=>[`${hpX(HB.haBounce.dmg[i-1])} รัศมี ${HB.haBounce.R}`,`เด้งต่อ ${HB.haBounce.n[i-1]} ครั้ง ครั้งละ ${hpX(HB.haBounce.hop)}`]},
 {key:'haBelly',id:'HP-A06',name:'Belly Bounce',br:'A',row:3,max:4,passive:1,d:'(Passive) โดนตีครบจำนวนครั้ง พุงเด้งคืนดาเมจและผลักคนตีกระเด็น',lv:i=>[`ทุก ${HB.haBelly.every[i-1]} ครั้งที่โดนตี`,`เด้งคืน ${hpX(HB.haBelly.dmg)}`]},
 {key:'haWard',id:'HP-A07',name:"Taweret's Ward",br:'A',row:4,max:2,type:'self',d:'พรเทพีทาเวเรต ลดดาเมจที่ได้รับ (แบบ Sea Aegis)',lv:i=>[`ดาเมจที่ได้รับ −${HB.haWard.block[i-1]} ต่อครั้ง`,`${HB.haWard.dur} วิ`]},
 {key:'haPound',id:'HP-A08',name:'Ground Pound',br:'A',row:4,max:2,type:'self',d:'กระทืบสองเท้า พื้นสะเทือนรอบตัว',lv:i=>[`${hpX(HB.haPound.dmg[i-1])} รัศมี ${HB.haPound.R}`,'สโลว์ 2 วิ']},
 {key:'haSky',id:'HP-A09',name:'Sky Belly',br:'A',row:5,max:3,type:'ground',pre:[['haBounce',1]],d:'[ทับ] กระโดดสูงหายจากจอ (ไม่โดนตี) แล้วตกทับจุดที่เลือก ทับโดนแล้วกดซ้ำเพื่อใช้ Double Drop',lv:i=>[`${hpX(HB.haSky.dmg[i-1])} รัศมี ${HB.haSky.R}`,'ยกลอย']},
 {key:'haDouble',id:'HP-A10',name:'Double Drop',br:'A',row:5,max:1,parent:'haSky',d:'(ท่าต่อ) [ทับ] เด้งขึ้นแล้วทับจุดเดิมซ้ำ พื้นแตก',lv:()=>[`${hpX(HB.haDouble.dmg)}`,'สโลว์ 2 วิ']},
 {key:'haHeavy',id:'HP-A11',name:'Heavyweight',br:'A',row:6,max:2,passive:1,d:'(Passive) รุ่นเฮฟวี่เวท ท่าทับแรงขึ้น HP เกินครึ่งไม่ติดชะงัก',lv:i=>[`ATK +${HB.haHeavy.atk[i-1]} (ท่าทับ)`,'HP เกินครึ่ง: ไม่ติดชะงัก']},
 {key:'haRoll',id:'HP-A12',name:'Rolling Hippo',br:'A',row:6,max:1,type:'self',pre:[['haPound',1]],d:'ขดตัวกลิ้งไปข้างหน้า บดศัตรู จบด้วยเด้งทับ',lv:()=>[`${hpX(HB.haRoll.dmg)} × ${HB.haRoll.n}`,`ทับจบ ${hpX(HB.haRoll.fin)}`]},
 {key:'haLast',id:'HP-A13',name:'Last Bite',br:'A',row:7,max:2,passive:1,d:'(Passive) HP ต่ำกว่า 30% อึดขึ้น และท่าทับที่โดนฟื้น HP (แบบ Last Hope)',lv:i=>[`ดาเมจที่ได้รับ −${HB.haLast.block[i-1]} ต่อครั้ง`,`ทับโดน ฟื้น HP = เลเวล×${HB.haLast.heal[i-1]}`]},
 {key:'haMountain',id:'HP-A14',name:'Mountain Drop',br:'A',row:7,max:1,type:'ground',pre:[['haSky',1],['haHeavy',1]],d:'[ทับ · เผาความอิ่ม] กระโดดสูงแล้วตกทับเหมือนภูเขาถล่ม ยิ่งเผาความอิ่มมากยิ่งแรง',lv:()=>[`${hpX(HB.haMountain.dmg)} รัศมี ${HB.haMountain.R}`,`เผาความอิ่มสูงสุด ${HB.haMountain.burn} ทุก 1 ที่เผา +${HB.haMountain.per}`]},
 {key:'haBehemoth',id:'HP-A15',name:'Behemoth Drop',br:'A',row:8,max:1,type:'self',ult:1,pre:[['haMountain',1],['haDouble',1]],d:'ULTIMATE A · กินงานเลี้ยง ความอิ่มเต็มทันที ตัวยักษ์ไม่ติดชะงัก ท่าทับกว้างขึ้น จบด้วยกระโดดทับยักษ์',lv:()=>[`${HB.haBehemoth.dur} วิ · ดาเมจที่ได้รับ −${HB.haBehemoth.block} ต่อครั้ง`,`ทับยักษ์ ${hpX(HB.haBehemoth.fin)} รัศมี ${HB.haBehemoth.finR}`]},
 // ---------------- B · NILE FLOOD PRIEST ----------------
 {key:'hbMud',id:'HP-B01',name:'Mud Ball',br:'B',row:1,max:4,type:'melee',d:'ปาลูกโคลน ทิ้งบ่อโคลนเล็ก (อัปสลับเลเวลกับ Nile Wave)',lv:i=>[`${hpT(HB.hbMud.dmg[i-1])}`,`บ่อโคลน ${HB.hbMud.poolT} วิ`]},
 {key:'hbBless',id:'HP-B02',name:'River Blessing',br:'B',row:1,max:2,passive:1,d:'(Passive) ยืนในโคลนฟื้น HP',lv:i=>[`ฟื้น HP = เลเวล×${HB.hbBless.regen[i-1]} ต่อวิ`]},
 {key:'hbWallow',id:'HP-B03',name:'Mud Wallow',br:'B',row:2,max:3,type:'self',pre:[['hbMud',1]],d:'คลุกโคลน สร้างบ่อใหญ่ ฮิปโปในบ่ออึดขึ้น กดซ้ำเพื่อใช้ Mud Splash',lv:i=>[`บ่อรัศมี ${HB.hbWallow.R} นาน ${HB.hbWallow.T} วิ`,`ในบ่อ: ดาเมจที่ได้รับ −${HB.hbWallow.block} ต่อครั้ง`]},
 {key:'hbSplash',id:'HP-B04',name:'Mud Splash',br:'B',row:2,max:1,parent:'hbWallow',d:'(ท่าต่อ) สะบัดตัวให้โคลนกระเซ็นรอบตัว',lv:()=>[`${hpT(HB.hbSplash.dmg)} รัศมี ${HB.hbSplash.R}`]},
 {key:'hbWave',id:'HP-B05',name:'Nile Wave',br:'B',row:3,max:3,type:'melee',pre:[['hbMud',1]],d:'คลื่นน้ำเป็นแนว ดันศัตรูถอย',lv:i=>[`${hpT(HB.hbWave.dmg[i-1])} ยาว ${HB.hbWave.len}`,'สโลว์ 2 วิ']},
 {key:'hbSilt',id:'HP-B06',name:'Fertile Silt',br:'B',row:3,max:2,passive:1,d:'(Passive) บ่อโคลนอยู่นานขึ้นและใหญ่ขึ้น',lv:i=>[`นานขึ้น ${HB.hbSilt.t[i-1]} วิ`,`รัศมี +${HB.hbSilt.r[i-1]}`]},
 {key:'hbBounty',id:'HP-B07',name:"Hapi's Bounty",br:'B',row:4,max:2,type:'self',d:'พรเทพฮาปิ ฟื้น HP ต่อเนื่อง อยู่ในโคลนฟื้นเพิ่ม',lv:i=>[`ฟื้น HP = เลเวล×${HB.hbBounty.heal[i-1]} ใน ${HB.hbBounty.T} วิ`,`ในโคลน +เลเวล×${HB.hbBounty.mud}`,`ความอิ่ม +${HB.hbBounty.full}`]},
 {key:'hbGeyser',id:'HP-B08',name:'Geyser',br:'B',row:4,max:2,type:'ground',pre:[['hbWallow',1]],d:'บ่อโคลนที่เลือกพุ่งเป็นน้ำพุร้อน ถ้าไม่มีบ่อแรงน้อยลง',lv:i=>[`ในบ่อ ${hpT(HB.hbGeyser.dmg[i-1])}`,`ไม่มีบ่อ ${hpT(HB.hbGeyser.dry)}`,'ยกลอย']},
 {key:'hbLotus',id:'HP-B09',name:'Lotus Bloom',br:'B',row:5,max:3,type:'self',d:'ดอกบัวผุดในทุกบ่อโคลน ยิงกลีบใส่ศัตรู กดซ้ำเพื่อใช้ Lotus Storm',lv:i=>[`ดอกละ ${HB.hbLotus.n} กลีบ กลีบละ ${hpT(HB.hbLotus.dmg[i-1])}`]},
 {key:'hbLotusStorm',id:'HP-B10',name:'Lotus Storm',br:'B',row:5,max:1,parent:'hbLotus',d:'(ท่าต่อ) ดอกบัวทุกดอกแตกพร้อมกัน ฟื้น HP ต่อดอก',lv:()=>[`ดอกละ ${hpT(HB.hbLotusStorm.dmg)} รัศมี ${HB.hbLotusStorm.R}`,`ฟื้น HP = เลเวล×${HB.hbLotusStorm.heal} ต่อดอก`]},
 {key:'hbInund',id:'HP-B11',name:'Inundation',br:'B',row:6,max:2,passive:1,d:'(Passive) สกิล B แรงขึ้นกับศัตรูที่ยืนในโคลน',lv:i=>[`MATK +${HB.hbInund.tal[i-1]} (เป้าในโคลน)`]},
 {key:'hbQuick',id:'HP-B12',name:'Quicksand Mire',br:'B',row:6,max:1,type:'ground',pre:[['hbSilt',1]],d:'หล่มทรายดูดศัตรูเข้ากลางช้าๆ นับเป็นบ่อโคลน',lv:()=>[`รัศมี ${HB.hbQuick.R} นาน ${HB.hbQuick.T} วิ`,`${hpT(HB.hbQuick.tick)} ทุก 0.5 วิ`]},
 {key:'hbFlood',id:'HP-B13',name:'Flood Mastery',br:'B',row:7,max:2,passive:1,d:'(Passive) ทุกบ่อโคลนที่มีอยู่ เพิ่มพลังสกิล B',lv:i=>[`MATK +${HB.hbFlood.per[i-1]} ต่อบ่อ (สูงสุด 5 บ่อ)`]},
 {key:'hbWrath',id:'HP-B14',name:'Wrath of the Nile',br:'B',row:7,max:1,type:'melee',pre:[['hbQuick',1]],d:'คลื่นยักษ์กวาดเป็นแนว ทิ้งโคลนตลอดทาง',lv:()=>[`${hpT(HB.hbWrath.dmg)} ยาว ${HB.hbWrath.len}`,'ยกลอย']},
 {key:'hbSea',id:'HP-B15',name:'The Great Inundation',br:'B',row:8,max:1,type:'self',ult:1,pre:[['hbWrath',1],['hbLotusStorm',1]],d:'ULTIMATE B · รอบตัวกลายเป็นทะเลโคลน ฮิปโปว่ายน้ำ น้ำพุพุ่งใส่ศัตรูทุกวิ จบด้วยคลื่นยักษ์',lv:()=>[`${HB.hbSea.dur} วิ รัศมี ${HB.hbSea.R}`,`เดิน +${HB.hbSea.move} · ฟื้น HP = เลเวล×${HB.hbSea.regen}/วิ`,`น้ำพุ ${hpT(HB.hbSea.geyser)} · คลื่นจบ ${hpT(HB.hbSea.fin)}`]},
 // ---------------- C · BEHEMOTH OF THE NILE ----------------
 {key:'hcCrater',id:'HP-C01',name:'Crater Finish',br:'C',tier:1,col:'basic',passive:1,pre:[['hnCombo',4]],d:'ท่าทับปิดคอมโบกว้างขึ้น พื้นแตก',lv:()=>[`รัศมี ${HB.hcCrater.R}`]},
 {key:'hcTriple',id:'HP-C02',name:'Triple Flop',br:'C',tier:1,col:'A',passive:1,pre:[['haFlop',4]],d:'Belly Flop เด้งทับต่อไปข้างหน้าอีก',lv:()=>[`เด้งต่อ ${HB.hcTriple.n} ครั้ง แรง ×${HB.hcTriple.mul} ของท่า`]},
 {key:'hcSticky',id:'HP-C03',name:'Sticky Mud',br:'C',tier:1,col:'B',passive:1,pre:[['hbMud',4]],d:'บ่อจาก Mud Ball ดึงศัตรูเข้ากลางบ่อ',lv:()=>[`ดึง ${HB.hcSticky.pull} ต่อครั้ง`]},
 {key:'hcSecond',id:'HP-C04',name:'Second Helping',br:'C',tier:2,col:'basic',passive:1,pre:[['hnFeast',3]],d:'Feast ฟื้น SP ล้างดีบัฟ และได้ความอิ่มเพิ่ม',lv:()=>[`SP +${HB.hcSecond.sp}`,`ความอิ่ม +${HB.hcSecond.full}`]},
 {key:'hcGobble',id:'HP-C05',name:'Gobble Up',br:'C',tier:2,col:'A',pre:[['haGulp',3]],d:'[New Active] อ้าปากดูดรอบตัว งับมอนธรรมดาได้หลายตัวพร้อมกัน',lv:()=>[`สูงสุด ${HB.hcGobble.n} ตัว ตัวละ ${hpX(HB.hcGobble.dmg)}`,`ความอิ่ม +${HB.hcGobble.full} ต่อตัว`,'Cooldown 25 วิ']},
 {key:'hcSubmerge',id:'HP-C06',name:'Submerge',br:'C',tier:2,col:'B',pre:[['hbWallow',3]],d:'[New Active] ดำลงโคลน ไม่โดนตี แล้วโผล่ขึ้นทับศัตรู',lv:()=>[`ดำ ${HB.hcSubmerge.hide} วิ`,`โผล่ทับ ${hpT(HB.hcSubmerge.dmg)} รัศมี ${HB.hcSubmerge.R}`,'Cooldown 18 วิ']},
 {key:'hcMega',id:'HP-C07',name:'Mega Size',br:'C',tier:3,col:'basic',passive:1,pre:[['hnHeart',2]],d:'ตัวใหญ่ขึ้นถาวร (แบบ Mega Size ของวาฬ)',lv:()=>[`HP สูงสุด +${HB.hcMega.hp}`,`ท่าทับรัศมี +${HB.hcMega.R}`]},
 {key:'hcEmbrace',id:'HP-C08',name:"Taweret's Embrace",br:'C',tier:3,col:'A',passive:1,pre:[['haWard',2]],d:"Taweret's Ward ให้โล่กันดาเมจเพิ่ม",lv:()=>[`โล่ ${HB.hcEmbrace.shield} ดาเมจ`]},
 {key:'hcSacred',id:'HP-C09',name:'Sacred Lotus',br:'C',tier:3,col:'B',passive:1,pre:[['hbLotusStorm',1]],d:'Lotus Storm ฟื้นมากขึ้น และล้างดีบัฟ',lv:()=>[`ฟื้นเพิ่ม เลเวล×${HB.hcSacred.heal} ต่อดอก`]},
 {key:'hcChomp',id:'HP-C10',name:'Chomp Chomp',br:'C',tier:4,col:'basic',pre:[['hnYawn',2]],d:'[New Active] งับรัวพร้อมขยับไปข้างหน้า งับมอนธรรมดาได้ความอิ่ม',lv:()=>[`${HB.hcChomp.n} ครั้ง ครั้งละ ${hpX(HB.hcChomp.dmg)}`,`ความอิ่ม +${HB.hcChomp.full} ต่องับ`,'Cooldown 20 วิ']},
 {key:'hcMeteor',id:'HP-C11',name:'Meteor Belly',br:'C',tier:4,col:'A',pre:[['haMountain',1]],d:'[New Active] [ทับ] กระโดดทับติดกัน 3 ครั้ง ครั้งสุดท้ายเผาความอิ่ม แรงเป็นสองเท่า',lv:()=>[`${HB.hcMeteor.n} ครั้ง ครั้งละ ${hpX(HB.hcMeteor.dmg)}`,`ครั้งสุดท้ายเผา ${HB.hcMeteor.burn} ความอิ่ม ×2`,'Cooldown 30 วิ']},
 {key:'hcJar',id:'HP-C12',name:"Hapi's Jar",br:'C',tier:4,col:'B',pre:[['hbBounty',2]],d:'[New Active] วางโถศักดิ์สิทธิ์ ฟื้น HP ในวง ศัตรูในวงโดนน้ำ จบด้วยน้ำทะลัก',lv:()=>[`${HB.hcJar.T} วิ · ฟื้น HP = เลเวล×${HB.hcJar.heal}/วิ`,`${hpT(HB.hcJar.tick)} ต่อวิ · ทะลัก ${hpT(HB.hcJar.fin)}`,'Cooldown 30 วิ']}
];

/* =====================================================================
   3. SYSTEMS — Fullness · mud pools · counters
   ===================================================================== */
const HIP={full:0,lastCombat:-99,pools:[],gulp:null,gulpList:[],bellyN:0,sweatT:0,sweatCD:0,shield:0,napOn:false,sea:null,jar:null,lotus:[],lastHp:0,tier:-1,behemoth:false};
const hL=k=>LV[k]||0;
const hLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,hL(k)))-1];
const hCap=()=>hL('haAppetite')>=2?HF.cap2:HF.cap;
const hTier=()=>Math.floor(HIP.full/HF.tier);
function hAddFull(n){const b=hTier();HIP.full=Math.max(0,Math.min(hCap(),HIP.full+n));if(hTier()!==b)hRefreshHP();}
function hBurn(max){const b=Math.min(max,HIP.full);HIP.full-=b;hRefreshHP();return b;}
const hBranch=k=>!k?'':k==='basic'?'N':(k.startsWith('ha')||['hcTriple','hcGobble','hcMeteor'].includes(k))?'A':(k.startsWith('hb')||['hcSticky','hcSubmerge','hcJar'].includes(k))?'B':'N';
const hSize=()=>(1+HF.sizePer*hTier()+(hL('hcMega')?HB.hcMega.size:0))*(hasBuff('haBehemoth')?HB.haBehemoth.size:1);
const hSlamR=r=>(r+(hL('hcMega')?HB.hcMega.R:0))*(1+.04*hTier())*(hasBuff('haBehemoth')?HB.haBehemoth.R:1);
function hFlatHP(){let v=HF.hpPer*hTier();if(hL('hnHeart'))v+=hLv(HB.hnHeart.hp,'hnHeart');if(hL('hcMega'))v+=HB.hcMega.hp;return v;}
function hRefreshHP(){if(typeof applyStats==='function')try{applyStats();}catch(_){}}
function hHeal(n){n=Math.round(n);if(n<=0)return;const was=player.hp;player.hp=Math.min(player.maxHp,player.hp+n);const g=Math.round(player.hp-was);if(g>0&&typeof dmgNum==='function')try{dmgNum(player.x,player.y,70,g,'heal',{who:player});}catch(_){}}
function hCleanse(n=9){let c=0;for(const k in player.buffs){if(k.startsWith('db')){delete player.buffs[k];if(++c>=n)break;}}if(player.ccT>0&&n>=9)player.ccT=0;return c;}
function hHit(e,mult,key,o={}){if(!e||e.dead)return 0;return hurt(e,mult,Object.assign({critOK:true,skill:key},o));}
const hNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const hLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&distToSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function hFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function hPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!hFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const hTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const hPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
/* ground point: cast context, else target, else ahead */
function hPt(c,range){if(c&&c.gx!=null)return [c.gx,c.gy];const t=hTgt(c,range);if(t)return [t.x,t.y];return [player.x+Math.cos(player.phi)*range*.6,player.y+Math.sin(player.phi)*range*.6];}
/* mud pools */
function hPool(x,y,r,T,o={}){r+=(hL('hbSilt')?hLv(HB.hbSilt.r,'hbSilt'):0);T+=(hL('hbSilt')?hLv(HB.hbSilt.t,'hbSilt'):0);
  const p=Object.assign({x,y,r,until:gameTime+T,born:gameTime,lotus:null},o);HIP.pools.push(p);
  const lim=HP_BAL.pool.max;while(HIP.pools.filter(q=>!q.sea).length>lim){const i=HIP.pools.findIndex(q=>!q.sea);HIP.pools.splice(i,1);}return p;}
const hInPool=(x,y)=>HIP.pools.some(p=>Math.hypot(p.x-x,(p.y-y)*1.25)<=p.r);
const hPoolAt=(x,y,pad=0)=>HIP.pools.find(p=>Math.hypot(p.x-x,(p.y-y)*1.25)<=p.r+pad);

/* =====================================================================
   4. FX (code-drawn mud / water / lotus + shared painted crater, shock, dust)
   ===================================================================== */
const HPC={mud:'#7a5432',mud2:'#a87a4a',water:'#6ac8f0',water2:'#d8f4ff',lotus:'#ff9ac8',lotus2:'#fff0f6',gold:'#ffd36a',hip:'#b8a0d8'};
const HI={};
function hImg(n){let o=HI[n];if(!o){o=HI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src=(n[0]==='h'?'assets/fx/hippo/':'assets/fx/cat/')+n+'.webp';}return o.ok?o.im:null;}
function hDraw(n,sx,sy,w,o={}){const im=hImg(n);if(!im)return false;const cells=o.cell!=null?(o.cells||8):1,iw=im.naturalWidth/cells,ih=im.naturalHeight,h=w*ih/iw*(o.sq||1);
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,o.a==null?1:o.a));if(o.add)ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);if(o.rot)ctx.rotate(o.rot);if(o.fx)ctx.scale(-1,1);
  const ax=o.ax==null?.5:o.ax,c=o.clip==null?1:Math.max(0,Math.min(1,o.clip));ctx.drawImage(im,(o.cell||0)*iw,0,iw*c,ih,-w*ax,-h*(o.ay==null?.5:o.ay),w*c,h);ctx.restore();return true;}
const hScr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
class HImg{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',z:0,w:100,s0:.85,s1:1.05,a0:1,fadeOut:.5,rise:0},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),a=this.a0*(k>1-this.fadeOut?Math.max(0,(1-k)/this.fadeOut):1);
    if(this.follow){this.x=player.x;this.y=player.y;}const [x,y]=P(this.x,this.y,this.z+this.rise*k);const o={a,sq:this.sq,cell:this.cell,cells:this.cells,rot:this.rot,ax:this.ax,ay:this.ay,fx:this.fx,clip:this.wipe?eOut(Math.min(1,k/this.wipe)):null};hDraw(this.n,x,y,this.w*s,o);if(this.glow&&k<.35){o.a=this.glow*(1-k/.35);o.add=1;hDraw(this.n,x,y,this.w*s,o);}}}
function hDust(x,y,n=4,R=50){if(!hImg('23_dust')){dustPuff(x,y,n*2,'#a8906a',R*1.4,10);return;}for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),r=rnd(.4,1)*R;addFx(new HImg({n:'23_dust',x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.6,z:4,w:rnd(26,46),cell:(Math.random()*4)|0,cells:4,life:rnd(.5,.8),s0:.6,s1:1.2,rise:12,fadeOut:.6,a0:.9}));}}
/* landing: crater + shockwave + dust + mud splash if in a pool */
function hLand(x,y,R,big){addFx(new HImg({n:'09_crater',x,y,w:R*2.1,sq:.85,layer:'ground',life:1.4,s0:.9,s1:1,fadeOut:.35}));if(hImg('25_shock'))addFx(new HImg({n:'25_shock',x,y,w:R*2.6,layer:'ground',life:.4,s0:.3,s1:1.15,fadeOut:.7}));
  else addFx(new GRing({x,y,r0:10,r1:R+20,w:10,color:'#e8d8b0',life:.4}));hDust(x,y,big?7:4,R*.6);rocks(x,y,big?10:5,big?240:160);shake(big?6:3.5);stop(big?110:60);if(big&&typeof screenFlash==='function')screenFlash(.18,'#ffe2b0');
  if(hInPool(x,y))hSplash(x,y,R*1.1);}
class HBit{constructor(o){Object.assign(this,{t:0,layer:'top',drag:2,spin:rnd(-4,4),rot:rnd(0,TAU),w:14,grav:260},o);this.cell=this.cell??((Math.random()*8)|0);this.life=this.life||rnd(.45,.75);}
  update(dt){this.t+=dt;const d=Math.exp(-this.drag*dt);this.vx*=d;this.vy*=d;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z=Math.max(0,this.z+this.vz*dt);this.vz-=this.grav*dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);hDraw(this.n,x,y,this.w,{cell:this.cell,rot:this.rot+this.spin*this.t,a:Math.min(1,(this.life-this.t)/.25)});}}
function hSplash(x,y,R){if(hImg('h01_mud')){for(let i=0;i<qn(9);i++){const a=rnd(0,TAU),s=rnd(.4,1)*R*2;addFx(new HBit({n:'h01_mud',x,y,z:8,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(80,180),w:rnd(14,26)}));}return;}for(let i=0;i<qn(14);i++){const a=rnd(0,TAU),s=rnd(.4,1)*R*2.2;emit({type:'round',x,y,z:8,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(60,160),drag:1.8,life:rnd(.4,.7),size:rnd(3,6),size1:1,color:Math.random()<.6?HPC.mud:HPC.mud2});}}
function hDrops(x,y,z,n,spd=120,col=HPC.water){for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;emit({type:'round',x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(40,140),drag:1.6,life:rnd(.4,.8),size:rnd(2,4),size1:.6,color:Math.random()<.6?col:HPC.water2});}}
/* travelling projectile (mud ball / burp shot) */
class HProj{constructor(o){Object.assign(this,{t:0,layer:'top',speed:520,len:240,R:20,z:30,kind:'mud',hits:new Set(),pierce:false},o);this.x0=this.x;this.y0=this.y;this.life=this.len/this.speed;}
  update(dt){this.t+=dt;const d=Math.min(this.len,this.t*this.speed);this.x=this.x0+Math.cos(this.phi)*d;this.y=this.y0+Math.sin(this.phi)*d;
    for(const e of enemies){if(e.dead||this.hits.has(e)||e===this.carry)continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.R){this.hits.add(e);if(this.onHit)this.onHit(e,this);if(!this.pierce){this.t=this.life;break;}}}
    if(this.carry&&!this.carry.dead){this.carry.x=this.x;this.carry.y=this.y;}
    if(Math.random()<Q.p)(this.kind==='mud'?hSplash:hDrops)(this.x,this.y,8);
    if(this.t>=this.life){if(this.onEnd)this.onEnd(this.x,this.y,this);return false;}return true;}
  draw(){const [x,y]=P(this.x,this.y,this.z);if(this.kind==='mud'&&hDraw('h02_mudball',x,y,this.R*4.2,{rot:hScr(this.phi),ax:.72}))return;if(this.kind==='petal'&&hDraw('h10_petals',x,y,22,{cell:this.cell??(this.cell=(Math.random()*8)|0),rot:this.t*12}))return;if(this.kind==='burp'&&this.R>20&&hDraw('h13_burp',x,y,120,{rot:hScr(this.phi),ax:.6,a:.9}))return;ctx.save();if(this.kind==='mud'){ctx.fillStyle=HPC.mud;ctx.strokeStyle='#3a2414';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,this.R*.8,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=HPC.mud2;ctx.beginPath();ctx.arc(x-4,y-4,this.R*.3,0,TAU);ctx.fill();}
    else{ctx.globalCompositeOperation='lighter';ctx.fillStyle=hexA('#ffe0a0',.8);ctx.beginPath();ctx.arc(x,y,this.R,0,TAU);ctx.fill();}ctx.restore();}}
/* water wave sweeping a line (hits each enemy once) */
class HWave{constructor(o){Object.assign(this,{t:0,layer:'top',speed:560,len:260,w:40,mult:1.8,key:'hbWave',hits:new Set(),push:30,big:false},o);this.x0=this.x;this.y0=this.y;this.life=this.len/this.speed+.15;}
  update(dt){const d0=Math.min(this.len,this.t*this.speed);this.t+=dt;const d1=Math.min(this.len,this.t*this.speed),c=Math.cos(this.phi),s=Math.sin(this.phi);
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(distToSeg(e.x,e.y,this.x0+c*d0,this.y0+s*d0,this.x0+c*d1,this.y0+s*d1)<e.r+this.w){this.hits.add(e);hHit(e,this.mult,this.key,{knock:[this.phi,this.push],big:this.big});hDrops(e.x,e.y,20,5);}}
    this.x=this.x0+c*d1;this.y=this.y0+s*d1;if(this.onStep)this.onStep(this.x,this.y);if(Math.random()<Q.p*1.4)hDrops(this.x,this.y,14,1,60);return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,10),a=Math.min(1,(this.life-this.t)*6),W=this.w*(this.big?1.6:1),c=Math.atan2(Math.sin(this.phi)*K,Math.cos(this.phi));
    {const fl=Math.cos(this.phi)<0;if(hDraw(this.big?'h06_bigwave':'h05_wave',x,y-W*.3,this.big?W*4.2:W*3.4,{rot:fl?c+Math.PI:c,fx:fl,a,ax:.6,ay:.7}))return;}
    ctx.save();ctx.translate(x,y);ctx.rotate(c);ctx.globalAlpha=a;ctx.fillStyle=hexA(HPC.water,.75);ctx.strokeStyle=HPC.water2;ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(-W*.6,-W);ctx.quadraticCurveTo(W*.7,-W*.6,W*.4,0);ctx.quadraticCurveTo(W*.7,W*.6,-W*.6,W);ctx.quadraticCurveTo(-W*.2,0,-W*.6,-W);ctx.fill();ctx.stroke();ctx.restore();}}
/* geyser column */
class HGeyser{constructor(o){Object.assign(this,{t:0,life:.7,layer:'top',R:70},o);hDrops(this.x,this.y,10,16,160);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,0),h=140*Math.sin(Math.PI*Math.min(1,k*1.4)),w=this.R*.45*(1-k*.3);
    if(hImg('h07_geyser')){const im=hImg('h07_geyser'),W=this.R*1.5,H=W*im.naturalHeight/im.naturalWidth,g=Math.min(1,k*3.5);ctx.save();ctx.globalAlpha=k>.7?(1-k)/.3:1;ctx.drawImage(im,0,0,im.naturalWidth,im.naturalHeight*g,x-W/2,y-H*g+8,W,H*g);ctx.restore();return;}
    ctx.save();ctx.globalAlpha=1-k*.7;const g=ctx.createLinearGradient(0,y-h,0,y);g.addColorStop(0,HPC.water2);g.addColorStop(1,HPC.water);ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*.6,y-h*.6,x-w*.3,y-h);ctx.lineTo(x+w*.3,y-h);ctx.quadraticCurveTo(x+w*.6,y-h*.6,x+w,y);ctx.closePath();ctx.fill();ctx.restore();}}
/* pools / lotus / jar / sea drawn on the ground */
class HGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='hippo';}
  draw(){for(const p of HIP.pools){const left=p.until-gameTime,a=Math.min(1,left/.6,(gameTime-p.born)/.25),[x,y]=P(p.x,p.y,0);
      if(!p.quick&&hImg(p.sea?'h17_sea':'h03_pool')){hDraw(p.sea?'h17_sea':'h03_pool',x,y,p.r*2.3*(p.sea?1.05:1),{a:.92*a,sq:p.sea?1:.95});if(p.lotus)hDraw('h08_lotus',x,y-6+2*Math.sin(this.t*3),34,{ay:.75});continue;}
      ctx.save();ctx.globalAlpha=.85*a;ctx.translate(x,y);ctx.scale(1,K*.9);
      const g=ctx.createRadialGradient(0,0,p.r*.2,0,0,p.r);g.addColorStop(0,p.sea?'#5a8ab0':'#6a4628');g.addColorStop(.8,p.sea?'#4a7aa0':HPC.mud);g.addColorStop(1,hexA(p.quick?'#c8a868':HPC.mud2,0));
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,p.r,0,TAU);ctx.fill();
      ctx.strokeStyle=hexA(p.sea?HPC.water2:HPC.mud2,.5);ctx.lineWidth=2;for(let i=0;i<3;i++){const rr=(p.r*.3+((this.t*20+i*p.r*.25)%(p.r*.7)));ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.stroke();}
      ctx.restore();
      if(p.lotus&&hDraw('h08_lotus',x,y-6+2*Math.sin(this.t*3),34,{ay:.75})){}else if(p.lotus){const [lx,ly]=P(p.x,p.y,6+2*Math.sin(this.t*3));ctx.save();ctx.translate(lx,ly);for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.fillStyle=i%2?HPC.lotus:HPC.lotus2;ctx.strokeStyle='#8a3a5a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,-9,5,10,0,0,TAU);ctx.fill();ctx.stroke();}ctx.fillStyle=HPC.gold;ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.restore();}}
    if(HIP.jar){const j=HIP.jar,[x,y]=P(j.x,j.y,0);ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle=HPC.water;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,j.R,j.R*K,0,0,TAU);ctx.stroke();ctx.restore();
      if(hDraw('h18_jar',x,y+4,64,{ay:.92})){}else{
      ctx.save();ctx.fillStyle='#4a7ac8';ctx.strokeStyle='#1a2a5a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-18,14,18,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=HPC.gold;ctx.fillRect(x-10,y-38,20,6);ctx.restore();}}}}
/* fullness gauge + overlays */
class HAura{constructor(){this.t=0;this.layer='ground';this.w=0;this.b=0;}update(dt){this.t+=dt;const f=(v,on)=>Math.max(0,Math.min(1,v+(on?dt*4:-dt*3)));this.w=f(this.w,hasBuff('haWard'));this.b=f(this.b,hasBuff('haBehemoth'));return CHAR==='hippo';}
  draw(){const [x,y]=P(player.x,player.y,0),s=hSize();if(this.b>0)hDraw('h16_aura',x,y+8,150*s*(1+.04*Math.sin(this.t*10)),{a:.85*this.b,ay:.86});if(this.w>0)hDraw('h15_ward',x,y+8,130*s,{a:.55*this.w*(.85+.15*Math.sin(this.t*4)),ay:.9});}}
class HOverlay{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;return CHAR==='hippo';}
  draw(){const [x,y]=P(player.x,player.y,0),w=52,cap=hCap(),f=HIP.full/cap;
    ctx.save();ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(x-w/2-1,y+10,w+2,7);const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#ffcf6a');g.addColorStop(1,'#ff7a4a');ctx.fillStyle=g;ctx.fillRect(x-w/2,y+11,w*f,5);
    ctx.strokeStyle='rgba(255,255,255,.35)';for(let i=1;i<cap/20;i++){const tx=x-w/2+w*i*20/cap;ctx.beginPath();ctx.moveTo(tx,y+11);ctx.lineTo(tx,y+16);ctx.stroke();}
    ctx.fillStyle='#fff';ctx.font='700 8px Cinzel, serif';ctx.textAlign='center';ctx.fillText('อิ่ม '+Math.round(HIP.full),x,y+26);ctx.textAlign='start';ctx.restore();
    if(HIP.gulp&&!HIP.gulp.e.dead){const [gx,gy]=P(HIP.gulp.e.x,HIP.gulp.e.y,60);ctx.fillStyle=HPC.gold;ctx.font='700 10px Cinzel, serif';ctx.textAlign='center';ctx.fillText('อม!',gx,gy);ctx.textAlign='start';}
    if(HIP.shield>0){ctx.save();ctx.translate(x,y-40);ctx.scale(1,1.1);ctx.strokeStyle=hexA('#ffe7a8',.5+.2*Math.sin(this.t*6));ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,40*hSize(),0,TAU);ctx.stroke();ctx.restore();}}}
/* per-frame state */
class HCore{constructor(){this.t=0;this.layer='none';this.tk=0;}draw(){}
  update(dt){this.tick(dt);return CHAR==='hippo';}
  tick(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new HGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new HOverlay());if(!this.au||!fx.includes(this.au))this.au=addFx(new HAura());
    const A=player.action;if(player.jgHide&&!(A&&A.hpHide))player.jgHide=false;if(player.z>0&&!A)player.z=0;
    /* fullness drains only out of combat */
    if(gameTime-HIP.lastCombat>HF.idle&&HIP.full>0)hAddFull(-HF.drain*dt);
    if(hTier()!==HIP.tier){HIP.tier=hTier();hRefreshHP();}
    /* pools expire; enemies inside slowed; sticky pull; quicksand */
    HIP.pools=HIP.pools.filter(p=>p.until>gameTime);this.tk+=dt;const tick=this.tk>=.25;if(tick)this.tk=0;
    if(tick)for(const p of HIP.pools){for(const e of hNear(p.x,p.y,p.r)){applyCC(e,{slow:.4});if(!e.boss&&(p.sticky||p.quick)){const a=Math.atan2(p.y-e.y,p.x-e.x),d=Math.hypot(p.x-e.x,p.y-e.y);if(d>6){const s=Math.min(d,p.quick?10:HB.hcSticky.pull*.25);e.x+=Math.cos(a)*s;e.y+=Math.sin(a)*s;}}}
      if(p.quick&&(p.qT=(p.qT||0)+.25)>=.5){p.qT=0;for(const e of hNear(p.x,p.y,p.r))hHit(e,HB.hbQuick.tick,'hbQuick',{dot:false});}}
    const inMud=hInPool(player.x,player.y);
    if(inMud&&hL('hbBless'))hHeal(PS.lv*hLv(HB.hbBless.regen,'hbBless')*dt);
    /* Nap (SP) */
    if(hasBuff('hnNap')){if(player.moving||(A&&A.key!=='hnNap'))delete player.buffs.hnNap;else player.mp=Math.min(player.maxMp,player.mp+hLv(HB.hnNap.sp,'hnNap')*dt);}
    /* Blood Sweat */
    if(hL('hnSweat')){HIP.sweatT+=dt;if(HIP.sweatT>=HB.hnSweat.every){HIP.sweatT=0;hHeal(PS.lv*hLv(HB.hnSweat.regen,'hnSweat'));}
      if(HIP.sweatCD<=gameTime&&hCleanse(1)){HIP.sweatCD=gameTime+hLv(HB.hnSweat.icd,'hnSweat');addFx(new DText({x:player.x,y:player.y,z:90,text:'เหงื่อแดง ปัดดีบัฟ',color:'#ff8a8a',size:11,life:.8}));}}
    /* Heavyweight: super armour above half HP */
    if(hL('haHeavy')&&player.hp>player.maxHp*.5)addBuff('rhSA',.3);
    /* Bounty HoT */
    if(HIP.hot&&HIP.hot.until>gameTime){hHeal(HIP.hot.rate*dt*(inMud?(HIP.hot.mud+HIP.hot.rate)/HIP.hot.rate:1));}
    /* gulp: hold the swallowed enemy in front of the mouth */
    if(HIP.gulp){const g=HIP.gulp;if(g.e.dead||g.until<gameTime){HIP.gulp=null;}else{g.e.x=player.x+Math.cos(player.phi)*28;g.e.y=player.y+Math.sin(player.phi)*28;if((g.tk=(g.tk||0)+dt)>=1){g.tk=0;hHit(g.e,HB.haGulp.tick,'haGulp');applyCC(g.e,{stun:1.1});}}}
    /* Behemoth end */
    const beh=hasBuff('haBehemoth');if(HIP.behemoth&&!beh)hBehemothEnd();HIP.behemoth=beh;
    /* Great Inundation */
    if(HIP.sea){const s=HIP.sea;if(s.until<gameTime){hSeaEnd();}else{if((s.tk=(s.tk||0)+dt)>=1){s.tk=0;const L=hNear(s.x,s.y,s.R);if(L.length){const e=L[(Math.random()*L.length)|0];addFx(new HGeyser({x:e.x,y:e.y,R:70}));hHit(e,HB.hbSea.geyser,'hbSea',{cc:{air:1}});}}
      if(Math.hypot(player.x-s.x,player.y-s.y)<s.R)hHeal(PS.lv*HB.hbSea.regen*dt);}}
    /* Hapi's Jar */
    if(HIP.jar){const j=HIP.jar;if(j.until<gameTime){for(const e of hNear(j.x,j.y,j.R+40)){hHit(e,HB.hcJar.fin,'hcJar',{big:true});}addFx(new HGeyser({x:j.x,y:j.y,R:j.R}));hDrops(j.x,j.y,20,26,240);HIP.jar=null;}
      else{if(Math.hypot(player.x-j.x,player.y-j.y)<j.R)hHeal(PS.lv*HB.hcJar.heal*dt);if((j.tk=(j.tk||0)+dt)>=1){j.tk=0;for(const e of hNear(j.x,j.y,j.R))hHit(e,HB.hcJar.tick,'hcJar');}}}}}

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
/* generic body slam: crouch → jump arc (no damage taken in the air) → land */
function hSlam(o){const sx=player.x,sy=player.y,[tx,ty]=o.to||[sx,sy];const phi=(tx===sx&&ty===sy)?player.phi:Math.atan2(ty-sy,tx-sx);faceTo(phi);
  const d=player.dir,pre=o.pre??.16,air=o.air??.34,H=o.h??70,[dx,dy]=(tx===sx&&ty===sy)?[sx,sy]:hPathEnd(sx,sy,phi,Math.hypot(tx-sx,ty-sy));
  const s=[...hold('buff',d,bPeak(d),pre*1000),...hold('buff',d,bPeak(d),air*1000),...seq('attack',atkDir(d),CT(atkDir(d)),null,1.4)];
  return act({key:o.key,name:o.name,seq:s,windup:pre+air,dur:Math.max(seqTotal(s),pre+air+.18),hitList:[],hpHide:!!o.hide,
    update:(a,dt)=>{if(a.t>=pre&&a.t<=pre+air){dashUpd(a,dt,pre,pre+air,sx,sy,dx,dy,HPC.hip,H);player.iframes=.06;if(o.hide)player.jgHide=a.t>pre+air*.15&&a.t<pre+air*.85;}if(o.update)o.update(a,dt);},
    events:[{t:.01,f:()=>hDust(sx,sy,2,20)},{t:pre+air,f:a=>{player.z=0;player.jgHide=false;player.x=dx;player.y=dy;const R=hSlamR(o.R);
      const L=hNear(dx,dy,R);for(const e of L){hHit(e,o.mult,o.key,Object.assign({hpSlam:1,big:true,knock:[Math.atan2(e.y-dy,e.x-dx),o.push??90]},o.hitO||{}));a.hitList.push(e);}
      if(L.length){a.hitConfirmed=true;if(hL('haLast')&&player.hp<player.maxHp*.3)hHeal(PS.lv*hLv(HB.haLast.heal,'haLast'));}
      hLand(dx,dy,R,o.big);if(o.land)o.land(a,dx,dy,L);}}].concat(o.events||[]),
    onEnd:()=>{player.z=0;player.jgHide=false;if(o.onEnd)o.onEnd();}});}
/* quick stand-and-hit (pound, yawn, splash…) */
function hBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||HPC.hip,events:tP=>[{t:tP,f:()=>{o.f();}}]});}

/* ---------- normal attack ---------- */
function mkHpBasic(tgt){const lv=Math.max(1,hL('hnCombo')),chain=HB.hnCombo.chain[lv-1];if(gameTime-player.basicLast>1.4||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,fin=lv>=4&&idx===chain-1,phi=angTo(tgt);faceTo(phi);
  if(fin){player.basicIdx=0;player.basicLast=gameTime;const R=hL('hcCrater')?HB.hcCrater.R:HB.hnCombo.finR;
    return hSlam({key:'basic',name:'Hippo Combo · Finish',to:[player.x+Math.cos(phi)*30,player.y+Math.sin(phi)*30],pre:.12,air:.26,h:44,R,mult:HB.hnCombo.fin,hitO:{auto:true},land:(a,x,y)=>{if(hL('hcCrater'))addFx(new Crack({x,y,r:R*.7,color:'#c89a6a'}));}});}
  const d=atkDir(player.dir),c=CT(d),sp=aspd(),s=seq('attack',d,c-3,null,1.6*sp),kC=seqIndex(s,'attack',c),tC=seqTimeAt(s,kC);
  return act({key:'basic',name:'Hippo Combo '+(idx+1),seq:s,windup:tC,dur:seqTimeAt(s,kC+2),hitList:[],
    events:[{t:tC,f:a=>{if(!tgt.dead&&dist(player,tgt)<=BASIC_RANGE+40+tgt.r){hHit(tgt,HB.hnCombo.hit,'basic',{auto:true,knock:[phi,40]});metalHit(tgt,phi,false);a.hitList.push(tgt);a.hitConfirmed=true;shake(1.4);stop(34);
      if(hImg('22_pow'))addFx(new HImg({n:'22_pow',x:tgt.x,y:tgt.y,z:28,w:56,life:.16,s0:.5,s1:1.1,fadeOut:.6}));}player.basicIdx=idx+1;player.basicLast=gameTime;}}]});}

/* ---------- BASIC ---------- */
function mkHnWaddle(c){const phi=c&&c.phi!=null?c.phi:player.phi;faceTo(phi);const sx=player.x,sy=player.y,[dx,dy]=hPathEnd(sx,sy,phi,HB.hnWaddle.dist),hit=new Set(),s=seq('walk',player.dir,0,null,3);
  return act({key:'hnWaddle',name:'Waddle Rush',seq:s,windup:0,dur:.32,hitList:[],update:(a,dt)=>{player.iframes=a.t<.2?.06:0;dashUpd(a,dt,0,.26,sx,sy,dx,dy,HPC.hip,8);
    for(const e of hNear(player.x,player.y,30))if(!hit.has(e)){hit.add(e);hHit(e,HB.hnWaddle.dmg,'hnWaddle',{knock:[phi,60]});}},events:[{t:.01,f:()=>hDust(sx,sy,3,20)}]});}
function mkHnYawn(c){const t=hTgt(c,140),phi=hPhi(c,t);return hBurst({key:'hnYawn',name:'Yawn Threat',phi,f:()=>{const T=hLv(HB.hnYawn.taunt,'hnYawn');
  for(const e of enemiesInCone(player.x,player.y,phi,HB.hnYawn.R,HB.hnYawn.half)){hHit(e,HB.hnYawn.dmg,'hnYawn');e.aggro=Math.max(e.aggro||0,T);e.tauntT=gameTime+T;}
  {const fl=Math.cos(phi)<0,c=hScr(phi);if(hImg('h14_yawn'))addFx(new HImg({n:'h14_yawn',x:player.x+Math.cos(phi)*30,y:player.y+Math.sin(phi)*30,z:60,w:HB.hnYawn.R*1.4,rot:fl?c+Math.PI:c,fx:fl,ax:.1,life:.6,s0:.5,s1:1.05,fadeOut:.5}));else addFx(new GRing({x:player.x+Math.cos(phi)*40,y:player.y+Math.sin(phi)*40,r0:10,r1:HB.hnYawn.R,w:6,color:'#ffd8e8',life:.35}));}addFx(new DText({x:player.x,y:player.y,z:96,text:'หาววว~',color:'#ffe0f0',size:13,life:.9}));}});}
function mkHnNap(c){return buffAct({key:'hnNap',name:'Nap',speed:2.2,glow:'#d8e8ff',events:tP=>[{t:tP*.5,f:()=>{addBuff('hnNap',HB.hnNap.dur);addFx(new DText({x:player.x,y:player.y,z:90,text:'Zzz',color:'#d8e8ff',size:14,life:1.2}));}}]});}
function mkHnFeast(c){return hBurst({key:'hnFeast',name:'Feast',glow:'#8aff8a',f:()=>{addFx(new HImg({n:'h11_melon',x:player.x,y:player.y,z:110*hSize(),w:52,life:.9,s0:.4,s1:1.05,rise:14,fadeOut:.35}));hHeal(PS.lv*hLv(HB.hnFeast.heal,'hnFeast'));hAddFull(HB.hnFeast.full+(hL('hcSecond')?HB.hcSecond.full:0));addBuff('hnFeast',HB.hnFeast.dur);
  if(hL('hcSecond')){player.mp=Math.min(player.maxMp,player.mp+HB.hcSecond.sp);hCleanse(9);}
  for(let i=0;i<qn(10);i++){const a=rnd(0,TAU);emit({type:'round',x:player.x,y:player.y,z:60,vx:Math.cos(a)*90,vy:Math.sin(a)*90,vz:rnd(40,100),drag:2,life:.6,size:rnd(2,4),size1:1,color:Math.random()<.5?'#ff4a5a':'#4ac85a'});}
  addFx(new DText({x:player.x,y:player.y,z:100,text:'อร่อย! อิ่ม +'+(HB.hnFeast.full+(hL('hcSecond')?HB.hcSecond.full:0)),color:'#9aff7a',size:13,life:1}));}});}

/* ---------- A · slams ---------- */
function mkHaFlop(c){const t=hTgt(c,HB.haFlop.range),phi=hPhi(c,t),L=t?Math.min(HB.haFlop.dist+20,Math.max(30,dist(player,t)-10)):HB.haFlop.dist,base=hLv(HB.haFlop.dmg,'haFlop');
  const tx=player.x+Math.cos(phi)*L,ty=player.y+Math.sin(phi)*L;let hops=hL('hcTriple')?HB.hcTriple.n:0;
  return hSlam({key:'haFlop',name:'Belly Flop',to:[tx,ty],R:HB.haFlop.R,mult:base,h:60,
    land:(a,x,y)=>{if(!hops)return;let px=x,py=y;for(let i=1;i<=hops;i++){const k=i;addFx(new HDelay(.18*k,()=>{px+=Math.cos(phi)*70;py+=Math.sin(phi)*70;const [qx,qy]=hFree(px,py)?[px,py]:[player.x,player.y];player.x=qx;player.y=qy;const R=hSlamR(HB.haFlop.R*.8);
      for(const e of hNear(qx,qy,R))hHit(e,base*HB.hcTriple.mul,'haFlop',{hpSlam:1,big:true});hLand(qx,qy,R,false);}));}}});}
function mkHaGulp(c){return hBurst({key:'haGulp',name:'Gulp',speed:2.4,f:()=>{addFx(new HImg({n:'h12_gulp',x:player.x+Math.cos(player.phi)*40,y:player.y+Math.sin(player.phi)*40,z:30,w:HB.haGulp.R*1.6,life:.5,s0:1.3,s1:.4,fadeOut:.4,rot:0}));const L=hNear(player.x,player.y,HB.haGulp.R).sort((a,b)=>dist(a,player)-dist(b,player));const e=L[0];
  for(let i=0;i<qn(12);i++){const a=rnd(0,TAU),r=HB.haGulp.R;emit({type:'dust',x:player.x+Math.cos(a)*r,y:player.y+Math.sin(a)*r,z:20,vx:-Math.cos(a)*r*3,vy:-Math.sin(a)*r*3,vz:0,drag:1,life:.3,size:5,size1:1,color:'#d8c8b0'});}
  if(!e)return;if(e.boss){e.x=player.x+Math.cos(angTo(e))*(e.r+30);e.y=player.y+Math.sin(angTo(e))*(e.r+30);hHit(e,HB.haGulp.boss,'haGulp',{big:true});HIP.gulpList=[e];}
  else{HIP.gulp={e,until:gameTime+HB.haGulp.hold};HIP.gulpList=[e];applyCC(e,{stun:1.2});}
  hAddFull(HB.haGulp.full);addFx(new DText({x:player.x,y:player.y,z:96,text:'ฮุบ! อิ่ม +'+HB.haGulp.full,color:HPC.gold,size:13,life:.9}));player.action&&(player.action.hitConfirmed=true);}});}
function mkHaBurp(c){const list=(HIP.gulpList||[]).filter(e=>!e.dead);const t=hTgt(c,260),phi=hPhi(c,t);
  return hBurst({key:'haBurp',name:'Burp Cannon',phi,speed:2.4,f:()=>{const shot=HIP.gulp&&!HIP.gulp.e.dead?HIP.gulp.e:null;HIP.gulp=null;
    if(shot)hHit(shot,HB.haBurp.shot,'haBurp',{big:true});
    addFx(new HProj({x:player.x,y:player.y,phi,len:HB.haBurp.len,R:26,kind:'burp',pierce:true,carry:shot,speed:640,onHit:e=>{hHit(e,HB.haBurp.dmg,'haBurp',{big:true,knock:[phi,120]});}}));
    {const fl=Math.cos(phi)<0,c=hScr(phi);addFx(new HImg({n:'h13_burp',x:player.x+Math.cos(phi)*70,y:player.y+Math.sin(phi)*70,z:44,w:180,rot:fl?c+Math.PI:c,fx:fl,life:.45,s0:.5,s1:1.1,fadeOut:.5,ax:.25}));}
    addFx(new DText({x:player.x,y:player.y,z:96,text:'เอิ้ก!',color:'#ffe0a0',size:15,life:.8}));shake(3);}});}
function mkHaBounce(c){const t=hTgt(c,HB.haBounce.range);if(!t)return null;const n=hLv(HB.haBounce.n,'haBounce'),base=hLv(HB.haBounce.dmg,'haBounce');const done=new Set([t]);
  return hSlam({key:'haBounce',name:'Bounce Slam',to:[t.x,t.y],R:HB.haBounce.R,mult:base,h:80,
    land:(a,x,y)=>{let k=0,cx=x,cy=y;const hop=()=>{if(k>=n)return;const nx=enemies.filter(e=>!e.dead&&!done.has(e)&&Math.hypot(e.x-cx,e.y-cy)<240).sort((p,q)=>Math.hypot(p.x-cx,p.y-cy)-Math.hypot(q.x-cx,q.y-cy))[0];if(!nx)return;
      done.add(nx);k++;addFx(new HDelay(.22,()=>{if(nx.dead)return;player.x=nx.x;player.y=nx.y;cx=nx.x;cy=nx.y;const R=hSlamR(HB.haBounce.R);for(const e of hNear(cx,cy,R))hHit(e,HB.haBounce.hop,'haBounce',{hpSlam:1,big:true});hLand(cx,cy,R,false);hop();}));};hop();}});}
function mkHaWard(c){return hBurst({key:'haWard',name:"Taweret's Ward",glow:HPC.gold,f:()=>{addBuff('haWard',HB.haWard.dur);if(hL('hcEmbrace'))HIP.shield=HB.hcEmbrace.shield;addFx(new GRing({x:player.x,y:player.y,r0:70,r1:20,w:6,color:HPC.gold,life:.4}));}});}
function mkHaPound(c){return hBurst({key:'haPound',name:'Ground Pound',speed:2.2,f:()=>{const R=hSlamR(HB.haPound.R);for(const e of hNear(player.x,player.y,R))hHit(e,hLv(HB.haPound.dmg,'haPound'),'haPound',{big:true});hLand(player.x,player.y,R*.8,false);}});}
function mkHaSky(c){const [x,y]=hPt(c,HB.haSky.range);return hSlam({key:'haSky',name:'Sky Belly',to:[x,y],pre:.2,air:HB.haSky.air,h:260,hide:true,big:true,R:HB.haSky.R,mult:hLv(HB.haSky.dmg,'haSky'),hitO:{cc:{air:1}},
  land:()=>{HIP.skyPt=[player.x,player.y];}});}
function mkHaDouble(c){const [x,y]=HIP.skyPt||[player.x,player.y];return hSlam({key:'haDouble',name:'Double Drop',to:[x,y],pre:.06,air:.45,h:140,big:true,R:HB.haDouble.R,mult:HB.haDouble.dmg,land:(a,lx,ly)=>{addFx(new Crack({x:lx,y:ly,r:80,color:'#c89a6a'}));}});}
function mkHaRoll(c){const t=hTgt(c,300),phi=hPhi(c,t);faceTo(phi);const sx=player.x,sy=player.y,[dx,dy]=hPathEnd(sx,sy,phi,HB.haRoll.len),T=.9,s=hold('hurt',player.dir,2,T*1000+300),hits=new Map();
  return act({key:'haRoll',name:'Rolling Hippo',seq:s,windup:0,dur:T+.32,hitList:[],update:(a,dt)=>{if(a.t<=T){dashUpd(a,dt,0,T,sx,sy,dx,dy,HPC.hip,10);player.iframes=.05;if(Math.random()<Q.p*2)hDust(player.x,player.y,1,10);
      for(const e of hNear(player.x,player.y,46)){const n=hits.get(e)||0;if(n<HB.haRoll.n&&a.t>=(n*T/HB.haRoll.n)){hits.set(e,n+1);hHit(e,HB.haRoll.dmg,'haRoll',{knock:[phi,12]});a.hitConfirmed=true;}}}},
    events:[{t:T+.02,f:a=>{const R=hSlamR(90);for(const e of hNear(player.x,player.y,R))hHit(e,HB.haRoll.fin,'haRoll',{hpSlam:1,big:true,cc:{air:1}});hLand(player.x,player.y,R,false);}}]});}
function mkHaMountain(c){const [x,y]=hPt(c,HB.haMountain.range);let mult=HB.haMountain.dmg;
  return hSlam({key:'haMountain',name:'Mountain Drop',to:[x,y],pre:.24,air:HB.haMountain.air,h:340,hide:true,big:true,R:HB.haMountain.R,get mult(){return mult;},
    events:[{t:.2,f:()=>{const b=hBurn(HB.haMountain.burn);mult=HB.haMountain.dmg+b*HB.haMountain.per;addFx(new DText({x:player.x,y:player.y,z:110,text:'เผาความอิ่ม '+Math.round(b),color:'#ff9a5a',size:13,life:1}));}}]});}
function mkHaBehemoth(c){return buffAct({key:'haBehemoth',name:'Behemoth Drop',speed:1.4,glow:HPC.gold,events:tP=>[{t:.05,f:()=>{skyDarkT=.4;addFx(new DText({x:player.x,y:player.y,z:120,text:'BEHEMOTH',color:HPC.gold,size:18,life:1.6}));}},
  {t:tP,f:()=>{HIP.full=hCap();hRefreshHP();addBuff('haBehemoth',HB.haBehemoth.dur);addBuff('rhSA',HB.haBehemoth.dur);HIP.behemoth=true;skyDarkT=0;hLand(player.x,player.y,120,true);}}]});}
function hBehemothEnd(){const R=HB.haBehemoth.finR;addFx(new DText({x:player.x,y:player.y,z:120,text:'ทับยักษ์!',color:HPC.gold,size:17,life:1.2}));for(const e of hNear(player.x,player.y,R))hHit(e,HB.haBehemoth.fin,'haBehemoth',{hpSlam:1,big:true,cc:{air:1},koMul:2});hLand(player.x,player.y,R,true);}

/* ---------- B · mud & water (magic) ---------- */
function mkHbMud(c){const t=hTgt(c,HB.hbMud.range),phi=hPhi(c,t),L=t?Math.min(HB.hbMud.len,dist(player,t)):HB.hbMud.len*.7;
  return hBurst({key:'hbMud',name:'Mud Ball',phi,speed:2.6,glow:HPC.mud2,f:()=>{addFx(new HProj({x:player.x,y:player.y,phi,len:L,R:18,kind:'mud',onHit:e=>{hHit(e,hLv(HB.hbMud.dmg,'hbMud'),'hbMud');},
    onEnd:(x,y)=>{hSplash(x,y,40);hPool(x,y,HB.hbMud.poolR,HB.hbMud.poolT,{sticky:!!hL('hcSticky')});}}));}});}
function mkHbWallow(c){return hBurst({key:'hbWallow',name:'Mud Wallow',speed:1.8,glow:HPC.mud2,f:()=>{hPool(player.x,player.y,HB.hbWallow.R,HB.hbWallow.T);hSplash(player.x,player.y,80);player.action&&(player.action.hitConfirmed=true);}});}
function mkHbSplash(c){return hBurst({key:'hbSplash',name:'Mud Splash',speed:2.4,glow:HPC.mud2,f:()=>{for(const e of hNear(player.x,player.y,HB.hbSplash.R))hHit(e,HB.hbSplash.dmg,'hbSplash',{knock:[angTo(e),70]});hSplash(player.x,player.y,HB.hbSplash.R);shake(2.5);}});}
function mkHbWave(c){const t=hTgt(c,HB.hbWave.range),phi=hPhi(c,t);return hBurst({key:'hbWave',name:'Nile Wave',phi,speed:2.4,glow:HPC.water,f:()=>{addFx(new HWave({x:player.x,y:player.y,phi,len:HB.hbWave.len,mult:hLv(HB.hbWave.dmg,'hbWave'),key:'hbWave',push:40}));}});}
function mkHbBounty(c){return hBurst({key:'hbBounty',name:"Hapi's Bounty",glow:'#8aff8a',f:()=>{const lv=hLv(HB.hbBounty.heal,'hbBounty');HIP.hot={until:gameTime+HB.hbBounty.T,rate:PS.lv*lv/HB.hbBounty.T,mud:PS.lv*HB.hbBounty.mud/HB.hbBounty.T};hAddFull(HB.hbBounty.full);
  addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:5,color:'#9aff9a',life:.4}));}});}
function mkHbGeyser(c){const [x,y]=hPt(c,HB.hbGeyser.range);const p=hPoolAt(x,y,20),gx=p?p.x:x,gy=p?p.y:y,m=p?hLv(HB.hbGeyser.dmg,'hbGeyser'):HB.hbGeyser.dry;
  return hBurst({key:'hbGeyser',name:'Geyser',phi:Math.atan2(gy-player.y,gx-player.x),speed:2.4,glow:HPC.water,f:()=>{const R=p?Math.max(HB.hbGeyser.R,p.r):HB.hbGeyser.R;addFx(new HGeyser({x:gx,y:gy,R}));for(const e of hNear(gx,gy,R))hHit(e,m,'hbGeyser',{cc:{air:1}});shake(2.5);}});}
function mkHbLotus(c){return hBurst({key:'hbLotus',name:'Lotus Bloom',glow:HPC.lotus,f:()=>{if(!HIP.pools.length)hPool(player.x,player.y,60,4);HIP.lotus=[];
  for(const p of HIP.pools){p.lotus=true;HIP.lotus.push(p);for(let i=0;i<HB.hbLotus.n;i++)addFx(new HDelay(.12+i*.18,()=>{const e=nearestEnemy(p.x,p.y,240);if(!e)return;addFx(new HProj({x:p.x,y:p.y,phi:Math.atan2(e.y-p.y,e.x-p.x),len:Math.hypot(e.x-p.x,e.y-p.y)+10,R:10,kind:'petal',speed:700,onHit:t=>hHit(t,hLv(HB.hbLotus.dmg,'hbLotus'),'hbLotus')}));}));}
  player.action&&(player.action.hitConfirmed=true);}});}
function mkHbLotusStorm(c){return hBurst({key:'hbLotusStorm',name:'Lotus Storm',glow:HPC.lotus,f:()=>{const L=(HIP.lotus||[]).filter(p=>p.until>gameTime);
  for(const p of L){p.lotus=null;for(const e of hNear(p.x,p.y,HB.hbLotusStorm.R))hHit(e,HB.hbLotusStorm.dmg,'hbLotusStorm',{big:true});addFx(new HImg({n:'h09_lotusburst',x:p.x,y:p.y,z:20,w:HB.hbLotusStorm.R*2.2,life:.5,s0:.4,s1:1.1,fadeOut:.5,glow:.6}));
    for(let i=0;i<qn(10);i++){const a=rnd(0,TAU);emit({type:'ember',x:p.x,y:p.y,z:10,vx:Math.cos(a)*140,vy:Math.sin(a)*140,vz:rnd(40,120),drag:2,life:.7,size:3,size1:1,color:Math.random()<.5?HPC.lotus:HPC.lotus2});}
    hHeal(PS.lv*(HB.hbLotusStorm.heal+(hL('hcSacred')?HB.hcSacred.heal:0)));}
  if(hL('hcSacred'))hCleanse(9);HIP.lotus=[];shake(3);}});}
function mkHbQuick(c){const [x,y]=hPt(c,HB.hbQuick.range);return hBurst({key:'hbQuick',name:'Quicksand Mire',phi:Math.atan2(y-player.y,x-player.x),glow:'#d8b878',f:()=>{hPool(x,y,HB.hbQuick.R,HB.hbQuick.T,{quick:true});}});}
function mkHbWrath(c){const t=hTgt(c,HB.hbWrath.range),phi=hPhi(c,t);let lastP=-99;
  return hBurst({key:'hbWrath',name:'Wrath of the Nile',phi,speed:1.8,glow:HPC.water,f:()=>{addFx(new HWave({x:player.x,y:player.y,phi,len:HB.hbWrath.len,mult:HB.hbWrath.dmg,key:'hbWrath',w:60,big:true,push:80,
    onStep:(x,y)=>{if(Math.hypot(x-player.x,y-player.y)-lastP>110){lastP=Math.hypot(x-player.x,y-player.y);hPool(x,y,50,5);}}}));shake(4);if(typeof screenFlash==='function')screenFlash(.15,'#9ad8ff');}});}
function mkHbSea(c){return buffAct({key:'hbSea',name:'The Great Inundation',speed:1.4,glow:HPC.water,events:tP=>[{t:.05,f:()=>{skyDarkT=.4;addFx(new DText({x:player.x,y:player.y,z:120,text:'GREAT INUNDATION',color:HPC.water2,size:16,life:1.6}));}},
  {t:tP,f:()=>{const B=HB.hbSea;HIP.sea={x:player.x,y:player.y,R:B.R,until:gameTime+B.dur};HIP.pools.push({x:player.x,y:player.y,r:B.R,until:gameTime+B.dur,born:gameTime,sea:true});addBuff('hbSea',B.dur);skyDarkT=0;hDrops(player.x,player.y,10,30,260);}}]});}
function hSeaEnd(){const s=HIP.sea;HIP.sea=null;addFx(new DText({x:s.x,y:s.y,z:110,text:'คลื่นยักษ์!',color:HPC.water2,size:16,life:1.2}));for(const e of hNear(s.x,s.y,s.R))hHit(e,HB.hbSea.fin,'hbSea',{big:true,cc:{air:1},koMul:2});
  for(let i=0;i<8;i++){const a=i*TAU/8;addFx(new HWave({x:s.x,y:s.y,phi:a,len:s.R,mult:0,key:'hbSea',w:50,big:true,hits:new Set(enemies)}));}shake(6);if(typeof screenFlash==='function')screenFlash(.25,'#9ad8ff');}

/* ---------- C · actives ---------- */
function mkHcChomp(c){const t=hTgt(c,200),phi=hPhi(c,t);faceTo(phi);const d=atkDir(player.dir),ct=CT(d);let s=[];for(let i=0;i<HB.hcChomp.n;i++)s=s.concat(seq('attack',d,ct-1,ct+1,2.6));
  const ev=[];for(let i=0;i<HB.hcChomp.n;i++)ev.push({t:seqTimeAt(s,seqIndex(s,'attack',ct,i)),f:a=>{const [nx,ny]=hPathEnd(player.x,player.y,phi,HB.hcChomp.step);player.x=nx;player.y=ny;
    for(const e of enemiesInCone(player.x,player.y,phi,90,.7)){hHit(e,HB.hcChomp.dmg,'hcChomp');if(!e.boss)hAddFull(HB.hcChomp.full);a.hitConfirmed=true;}addFx(new DText({x:player.x+Math.cos(phi)*40,y:player.y+Math.sin(phi)*40,z:50,text:'งับ!',color:'#fff',size:11,life:.4}));shake(1.4);}});
  return act({key:'hcChomp',name:'Chomp Chomp',seq:s,windup:ev[0].t,dur:seqTotal(s),hitList:[],events:ev});}
function mkHcGobble(c){return hBurst({key:'hcGobble',name:'Gobble Up',speed:2,f:()=>{const L=hNear(player.x,player.y,HB.hcGobble.R).filter(e=>!e.boss).sort((a,b)=>dist(a,player)-dist(b,player)).slice(0,HB.hcGobble.n);
  for(const e of L){hHit(e,HB.hcGobble.dmg,'hcGobble');e.x=player.x+Math.cos(angTo(e))*(e.r+24);e.y=player.y+Math.sin(angTo(e))*(e.r+24);applyCC(e,{stun:1.5});hAddFull(HB.hcGobble.full);}
  if(L.length){HIP.gulp={e:L[0],until:gameTime+2};HIP.gulpList=L;addFx(new DText({x:player.x,y:player.y,z:100,text:'ฮุบรวบ ×'+L.length,color:HPC.gold,size:13,life:.9}));}}});}
function mkHcSubmerge(c){const t=hTgt(c,400),sx=player.x,sy=player.y,[tx,ty]=t?[t.x,t.y]:[sx+Math.cos(player.phi)*160,sy+Math.sin(player.phi)*160];const s=hold('hurt',player.dir,2,HB.hcSubmerge.hide*1000+300);
  return act({key:'hcSubmerge',name:'Submerge',seq:s,windup:HB.hcSubmerge.hide,dur:HB.hcSubmerge.hide+.3,hitList:[],hpHide:true,update:(a)=>{const hid=a.t<HB.hcSubmerge.hide;player.jgHide=hid;player.iframes=hid?.06:0;},
    events:[{t:.02,f:()=>{hSplash(sx,sy,60);hPool(sx,sy,70,4);}},{t:HB.hcSubmerge.hide,f:a=>{const [px,py]=hFree(tx,ty)?[tx,ty]:[sx,sy];player.x=px;player.y=py;player.jgHide=false;hPool(px,py,70,4);
      for(const e of hNear(px,py,HB.hcSubmerge.R))hHit(e,HB.hcSubmerge.dmg,'hcSubmerge',{cc:{air:1},big:true});hLand(px,py,HB.hcSubmerge.R,false);}}],onEnd:()=>{player.jgHide=false;}});}
function mkHcMeteor(c){const t=hTgt(c,HB.hcMeteor.range);if(!t)return null;let n=0;const go=()=>{const tg=(t&&!t.dead)?t:nearestEnemy(player.x,player.y,300);const last=n===HB.hcMeteor.n-1;let m=HB.hcMeteor.dmg;
    return hSlam({key:'hcMeteor',name:'Meteor Belly '+(n+1),to:tg?[tg.x,tg.y]:[player.x,player.y],pre:.08,air:.42,h:200,big:true,R:HB.hcMeteor.R,get mult(){return m;},hitO:{cc:{air:1}},
      events:last?[{t:.05,f:()=>{if(hBurn(HB.hcMeteor.burn)>=1)m=HB.hcMeteor.dmg*2;}}]:[],onEnd:()=>{n++;if(n<HB.hcMeteor.n)addFx(new HDelay(.01,()=>{if(!player.action){const a=go();if(a)startAction(a);}}));}});};
  return go();}
function mkHcJar(c){return hBurst({key:'hcJar',name:"Hapi's Jar",glow:HPC.water,f:()=>{HIP.jar={x:player.x+Math.cos(player.phi)*30,y:player.y+Math.sin(player.phi)*30,R:HB.hcJar.R,until:gameTime+HB.hcJar.T};}});}

class HDelay{constructor(t,f){this.t=t;this.f=f;this.layer='none';}update(dt){this.t-=dt;if(this.t<=0){try{this.f();}catch(_){}return false;}return true;}draw(){}}

const HP_MAKE={hnWaddle:mkHnWaddle,hnYawn:mkHnYawn,hnNap:mkHnNap,hnFeast:mkHnFeast,
  haFlop:mkHaFlop,haGulp:mkHaGulp,haBurp:mkHaBurp,haBounce:mkHaBounce,haWard:mkHaWard,haPound:mkHaPound,haSky:mkHaSky,haDouble:mkHaDouble,haRoll:mkHaRoll,haMountain:mkHaMountain,haBehemoth:mkHaBehemoth,
  hbMud:mkHbMud,hbWallow:mkHbWallow,hbSplash:mkHbSplash,hbWave:mkHbWave,hbBounty:mkHbBounty,hbGeyser:mkHbGeyser,hbLotus:mkHbLotus,hbLotusStorm:mkHbLotusStorm,hbQuick:mkHbQuick,hbWrath:mkHbWrath,hbSea:mkHbSea,
  hcChomp:mkHcChomp,hcGobble:mkHcGobble,hcSubmerge:mkHcSubmerge,hcMeteor:mkHcMeteor,hcJar:mkHcJar};
const HP_FOLLOW={haGulp:['haBurp',3],haSky:['haDouble',1.2],hbWallow:['hbSplash',2],hbLotus:['hbLotusStorm',3]};
const HP_ZIGZAG=[['haFlop','haBounce'],['hbMud','hbWave']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function hippoAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  if(!t){if(player.mp<player.maxMp*.5&&ready('hnNap')&&!hasBuff('hnNap'))return castSkill('hnNap',{}),true;return false;}
  const d=dist(player,t),near=hNear(player.x,player.y,220),cast=(k,c)=>{player.attackTarget=t;castSkill(k,c||{target:t,phi:angTo(t),gx:t.x,gy:t.y});return true;};
  const cb=player.combo;if(cb&&cb.parent&&SKILLS[cb.parent]&&LV[SKILLS[cb.parent].follow]>0){const fk=SKILLS[cb.parent].follow;if(!(player.cd[fk]>0)&&player.mp>=(SKILLS[fk].mp||0)){useSkill(cb.parent);if(busy())return true;}}
  if(d>300)return false;
  if(player.hp<player.maxHp*.55){for(const k of ['hnFeast','hbBounty','haWard','hcJar'])if(ready(k))return cast(k);}
  if((t.boss||near.length>=3)&&ready('haBehemoth')&&!hasBuff('haBehemoth'))return cast('haBehemoth');
  if((t.boss||near.length>=3)&&ready('hbSea')&&!HIP.sea)return cast('hbSea');
  if(ready('haWard')&&!hasBuff('haWard'))return cast('haWard');
  if(HIP.full<40&&ready('haGulp'))return cast('haGulp');
  if(near.length>=3){for(const k of ['hcMeteor','haMountain','hbWrath','haRoll','haPound','hbQuick','hcGobble','hbLotus','haSky','hbWallow'])if(ready(k))return cast(k);}
  if(HIP.full>=60&&ready('haMountain'))return cast('haMountain');
  for(const k of ['hcMeteor','haBounce','haFlop','haSky','hbWave','hbMud','hbGeyser','hcChomp','hbWrath','haPound','hbLotus','haRoll','hcSubmerge','hnFeast','haGulp','hnYawn'])if(ready(k)){const s=SKILLS[k];if(s.type!=='melee'||d<=(s.range||120)+t.r)return cast(k);}
  return false;}

function installHippo(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of HP_DEFS){const b=HB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:hIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').slice(0,40),characterId:'nile_hippo'};
    if(b.mp!=null)sk.mp=b.mp;const cd=Array.isArray(b.cd)?b.cd:null;if(cd)Object.defineProperty(sk,'cd',{get(){return hLv(cd,d.key);},enumerable:true,configurable:true});else if(b.cd)sk.cd=b.cd;
    if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(HP_MAKE[d.key])sk.make=HP_MAKE[d.key];
    if(HP_FOLLOW[d.key]){sk.follow=HP_FOLLOW[d.key][0];sk.comboWin=HP_FOLLOW[d.key][1];}
    if(d.parent){sk.parent=d.parent;sk.needHit='hit';}
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${HP_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'&&d.passive?'[Addition] ':'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of HP_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  Object.assign(SK_DT,{hcSticky:'m',hcSubmerge:'m',hcSacred:'m',hcJar:'m',hbBounty:'h'});
  Object.assign(SK_CC,{hnYawn:{flinch:.5},haFlop:{flinch:.45},haBurp:{flinch:.45},haBounce:{flinch:.4},haPound:{slow:2},haSky:{air:1},haDouble:{slow:2},haRoll:{air:1},haMountain:{flinch:.5},haBehemoth:{air:1},
    hbMud:{slow:1.5},hbSplash:{flinch:.4},hbWave:{slow:2},hbGeyser:{air:1},hbLotusStorm:{flinch:.45},hbWrath:{air:1},hcChomp:{flinch:.3},hcSubmerge:{air:1},hcMeteor:{air:1}});
  Object.assign(SK_KO,{hnWaddle:1,hnYawn:1.6,haFlop:2.2,haBurp:2.6,haBounce:2.4,haPound:2.4,haSky:3.2,haDouble:3.2,haRoll:2.4,haMountain:3.6,haBehemoth:4,
    hbMud:1,hbSplash:1.6,hbWave:1.6,hbGeyser:2.4,hbLotus:.8,hbLotusStorm:2.4,hbQuick:.6,hbWrath:3.2,hbSea:3,hcChomp:1.6,hcGobble:1,hcSubmerge:2.4,hcMeteor:3.2,hcJar:1.6,basic:1});
  TABS.length=0;TABS.push({n:'Taweret',keys:['haFlop','haBounce','haGulp','haPound','haSky','haRoll','haMountain','haBehemoth','haWard','hnFeast']},
    {n:'Nile',keys:['hbMud','hbWave','hbWallow','hbGeyser','hbLotus','hbQuick','hbWrath','hbSea','hbBounty','hnNap']},
    {n:'Behemoth',keys:['hcChomp','hcGobble','hcSubmerge','hcMeteor','hcJar','hnWaddle','hnYawn']});
  Object.assign(BUFFDEF,{hnNap:{n:'Nap',c:'#d8e8ff',i:'NAP'},hnFeast:{n:'Feast',c:'#8aff8a',i:'FEAST'},haWard:{n:"Taweret's Ward",c:HPC.gold,i:'WARD'},haBehemoth:{n:'Behemoth',c:HPC.gold,i:'GIANT'},hbSea:{n:'Great Inundation',c:HPC.water,i:'SEA'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Nile Calf';JOB.hpA=1.6;JOB.hpB=6;JOB.spB=3;
  ITEMS.nileScepter={n:'Nile Stone Scepter',slot:'rhand',two:1,kind:'Mace',atk:150,matk:130,wlv:3,aspd:150,ref:6,cards:2,w:180,b:{},size:{small:1,medium:1,large:1},d:'คทาค้อนหินจากริมแม่น้ำไนล์'};
  ITEMS.hapiScepter={n:"Hapi's Scepter",slot:'rhand',two:1,kind:'Mace',atk:170,matk:150,wlv:4,aspd:148,ref:4,cards:1,w:190,b:{},size:{small:1,medium:1,large:1},d:'คทาของเทพฮาปิ'};
  EQ.rhand='nileScepter';INV.length=0;INV.push('hapiScepter','vikinghelm','ringPrec','clipLuck');
  /* flat max HP from fullness / Hippo Heart / Mega Size */
  if(typeof applyStats==='function'&&!applyStats._hp){const _as=applyStats;applyStats=function(){_as.apply(this,arguments);const f=hFlatHP();if(f>0){const r=player.hp/player.maxHp;player.maxHp+=f;if(D)D.maxHp=player.maxHp;player.hp=Math.min(player.maxHp,Math.round(player.maxHp*r));}};applyStats._hp=1;}
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null))||window.SKCTX,br=hBranch(k);let b=0;
    if(hasBuff('hnFeast'))b+=HB.hnFeast.atk;
    if(o&&o.hpSlam){b+=HF.slamAtkPer*hTier();if(hL('haHeavy'))b+=hLv(HB.haHeavy.atk,'haHeavy');}
    if(br==='B'&&e){if(hL('hbInund')&&hInPool(e.x,e.y))b+=hLv(HB.hbInund.tal,'hbInund');if(hL('hbFlood'))b+=Math.min(5,HIP.pools.filter(p=>!p.sea).length)*hLv(HB.hbFlood.per,'hbFlood');}
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+flat(e,o))/base;};
  window.jgAbsorb=(d,e)=>{HIP.lastCombat=gameTime;let r=0;if(hasBuff('haWard'))r+=hLv(HB.haWard.block,'haWard');if(hL('haLast')&&player.hp<player.maxHp*.3)r+=hLv(HB.haLast.block,'haLast');
    if(hasBuff('haBehemoth'))r+=HB.haBehemoth.block;if(hInPool(player.x,player.y)&&HIP.pools.some(p=>p.r>=HB.hbWallow.R&&Math.hypot(p.x-player.x,(p.y-player.y)*1.25)<=p.r))r+=HB.hbWallow.block;
    d=Math.max(1,d-r);if(HIP.shield>0){const s=Math.min(HIP.shield,d-1);HIP.shield-=s;d-=s;}
    if(hasBuff('hnNap'))delete player.buffs.hnNap;
    if(hL('haBelly')&&e&&!e.dead&&dist(player,e)<e.r+90){HIP.bellyN++;if(HIP.bellyN>=hLv(HB.haBelly.every,'haBelly')){HIP.bellyN=0;hHit(e,HB.haBelly.dmg,'haBelly',{knock:[angTo(e),160],big:true});addFx(new DText({x:player.x,y:player.y,z:90,text:'พุงเด้ง!',color:'#ffd0f0',size:13,life:.8}));}}
    return d;};
  window.jgPreHit=()=>1;window.jgPostHit=()=>{};
  window.jgMove=()=>{let b=-HF.movePer*hTier();if(HIP.sea&&Math.hypot(player.x-HIP.sea.x,player.y-HIP.sea.y)<HIP.sea.R)b+=HB.hbSea.move;return Math.max(.4,1+b/165);};
  window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgDetect=()=>1;window.jgPlayerAlpha=()=>player.jgHide?.08:1;window.jgBleedMul=()=>1;
  window.jgSquash=()=>{const s=hSize();return [s,s];};window.jgOnSkillHit=()=>{};
  window.jgAfterHurt=(e,dmg,crit,o)=>{if(!o||o.dot)return;if(e&&hImg('h04_hit')&&gameTime-(HIP.sparkT||0)>.04){HIP.sparkT=gameTime;addFx(new HImg({n:'h04_hit',x:e.x+rnd(-8,8),y:e.y,z:(e.boss?40:26)+rnd(-4,6),w:(o.big||crit?78:52)*(e.boss?1.3:1),life:.2,s0:.5,s1:1.1,fadeOut:.6,glow:.5}));}HIP.lastCombat=gameTime;hAddFull(o.hpSlam?HF.slam:HF.hit);if(e&&e.dead)hAddFull(HF.kill+(hL('haAppetite')?hLv(HB.haAppetite.kill,'haAppetite'):0));};
  window.hippoAutoTick=hippoAutoTick;
  mkBasic=mkHpBasic;addFx(new HCore());for(const n of ['09_crater','25_shock','23_dust','22_pow','h01_mud','h02_mudball','h03_pool','h04_hit','h05_wave','h06_bigwave','h07_geyser','h08_lotus','h09_lotusburst','h10_petals','h11_melon','h12_gulp','h13_burp','h14_yawn','h15_ward','h16_aura','h17_sea','h18_jar'])hImg(n);
  try{document.title='Aetherfall — Nile Hippo';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Hapi';if(cl)cl.textContent='Nile Calf';}catch(e){}
  window.HIP=HIP;window.HP_DEFS=HP_DEFS;window.HP_BAL=HP_BAL;hRefreshHP();}

/* =====================================================================
   7. ICONS (placeholder SVG)
   ===================================================================== */
function hIconSpec(d){const col=d.br==='A'?'#ffd88a':d.br==='B'?'#9adcff':d.br==='C'?'#ffe9a8':'#e8dcf4',bg=d.br==='A'?'#3a2a1a':d.br==='B'?'#12304a':d.br==='C'?'#2a2214':'#2a2234';
  const k=d.key,ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const hippo=`<ellipse cx="22" cy="26" rx="13" ry="10" fill="#b8a0d8" stroke="#3a2228" stroke-width="1.5"/><ellipse cx="22" cy="30" rx="8" ry="5" fill="#e0c8d4"/><circle cx="17" cy="23" r="1.6" fill="#3a2228"/><circle cx="27" cy="23" r="1.6" fill="#3a2228"/>`;
  const drop=(x,y,s=1,c='#6ac8f0')=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -8 Q6 0 0 6 Q-6 0 0 -8Z" fill="${c}" stroke="#123" stroke-width=".8"/>`;
  const mud=`<ellipse cx="22" cy="32" rx="15" ry="6" fill="#7a5432" stroke="#3a2414"/>`;
  const lotus=`<g transform="translate(22 22)">${[0,60,120,180,240,300].map(a=>`<ellipse cx="0" cy="-7" rx="3.4" ry="7" fill="#ff9ac8" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#ffd36a"/></g>`;
  const down=`<path d="M22 4 v12 l-5 -5 m5 5 l5 -5" stroke="${col}" stroke-width="2.4" fill="none"/>`;
  let g;
  if(/Sky|Mountain|Double|Behemoth|Meteor/.test(d.name))g=hippo+down+`<path d="M6 38 h32" stroke="#ffb06a" stroke-width="3"/>`;
  else if(/Flop|Bounce|Pound|Crater|Roll|Triple/.test(d.name))g=hippo+`<path d="M6 38 Q22 30 38 38" stroke="#ffb06a" stroke-width="3" fill="none"/>`;
  else if(/Gulp|Gobble|Chomp|Burp|Yawn/.test(d.name))g=`<path d="M8 14 Q22 4 36 14 L36 22 Q22 18 8 22Z M8 26 Q22 30 36 26 L36 32 Q22 40 8 32Z" fill="#b8a0d8" stroke="#3a2228" stroke-width="1.5"/><path d="M12 22 v3 M18 21 v3 M26 21 v3 M32 22 v3" stroke="#fff" stroke-width="2"/>`;
  else if(/Feast|Second|Appetite/.test(d.name))g=`<circle cx="22" cy="24" r="13" fill="#3aa84a" stroke="#1a4a1a" stroke-width="1.5"/><path d="M12 24 a10 10 0 0 0 20 0Z" fill="#ff5a6a"/>`;
  else if(/Lotus|Sacred/.test(d.name))g=lotus;
  else if(/Mud|Wallow|Splash|Silt|Sticky|Quick|Submerge|Bless/.test(d.name))g=mud+drop(16,18,1,'#a87a4a')+drop(28,14,.8,'#7a5432');
  else if(/Wave|Wrath|Flood|Inundation|Geyser|Jar|Bounty/.test(d.name))g=`<path d="M4 28 Q12 18 20 28 T36 28 T44 28" stroke="#9adcff" stroke-width="4" fill="none"/>`+drop(22,14,1.2);
  else if(/Ward|Embrace|Last|Heavy|Heart|Sweat|Belly/.test(d.name))g=`<path d="M22 6 L36 12 V24 Q36 34 22 40 Q8 34 8 24 V12Z" fill="#5a4a6a" stroke="${col}" stroke-width="1.6"/>`+(/Heart/.test(d.name)?`<path d="M22 30 l-7 -7 a4 4 0 0 1 7 -5 a4 4 0 0 1 7 5z" fill="#ff5a6a"/>`:'');
  else if(/Nap/.test(d.name))g=hippo+`<text x="30" y="14" font-size="9" fill="#d8e8ff" font-weight="700">z</text>`;
  else g=hippo;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/hippo/'+d.key+'.webp';SKILL_ICON_ART[d.name]=src;   /* painted icon; code SVG as fallback */
    const im=new Image();im.onerror=()=>{SKILL_ICON_ART[d.name]=fb;};im.src=src;}return ['star',col,bg];}
