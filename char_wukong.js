/* =====================================================================
   TOTEM LEGEND — SNOW MONKEY · VESSEL OF SUN WUKONG (Japan) — 12 Tails style
   Character module. Loaded only when the monkey is played (?char=wukong); index.html calls installWukong().
   Design + numbers: WUKONG_SKILLS_TH.md (owner 2026-11-23: 'ออโต้สเปลคือตีธรรมดาแล้วสกิลออก … อัปแต่ตีไว' 00:52,
   'หงอคงขอเป็นกายภาพมีร่างแยกด้วยนะ' 00:53, look picked 07:20 = the snow-monkey yamabushi vessel, 'ทำเลย' 07:51)

     Basic · Stone Monkey — ringed-staff combo (every landed normal swing = 1 BEAT), Hair Clone autospell, Somersault Cloud,
         Golden Headband, Peach of Immortality, Hair Substitute, Fiery Golden Eyes, Furnace-Forged Body
     A · Havoc in Heaven (physical) — RAMPAGE 0–10 on one target (+1 ASPD per 2 points), momentary golden hair clones
         strike from BEHIND the target: Ruyi Rhythm / Thousand Staves / Sky-Pillar Drop autospells
     B · Seventy-Two Transformations (physical) — a lasting SWARM of 3 → 6 hair clones that copy our swings, draw monsters
         and count beats with us: Monkey Pile-On / Staff Whirlwind / Thousand-Monkey Barrage autospells
     C · Victorious Fighting Buddha — 12 nodes, each tied to the Basic / A / B skill of the same row (lit on the Totem Roots)

   AUTOSPELL: a landed normal swing = 1 beat (miss 0, crit 2 with Fiery Golden Eyes). Every autospell counts its own beats and
   fires at N, performed by a golden hair clone (the hero's own frames tinted gold), so the hero never stops swinging → ASPD is
   the stat. Autospells cost no SP, never miss, never crit, have no cooldown. Anti-cheat (WUKONG_SKILLS_TH.md 'กันโกง'):
   counters keep at most 2N, every autospell has a fixed minimum gap (N × 0.28 s, branch B N × 0.14 s), skill ASPD ≤ +10 in
   total, swarm copy-hits are o.dot hits (seals / runes / gem supports / item procs / boss hit counters skip them), formulas
   count ≤ 6 clones, clones regrow ≥ 1.5 s apart, a popped clone gives nothing back, bosses ignore the decoys.
   One hair supply (stance): while the B swarm is out, the A tools (Rampage gain, A autospells) rest; B autospells need the swarm.
   Owner's rules: no percent effects (flat numbers, counters instead of chances).
   Sprite: placeholder from the owner's 8-direction sheet (assets_wukong.js, tools/statichero.py) until his 20 clips arrive.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const WK_BAL={
  gapA:.2,gapB:.1,                      // autospell minimum gap = N × gap (Basic / A · B) — fixed, gems do not change it (binds at ~5 beats a second = ASPD 190)
  rp:{delay:2.5,decay:2,per:2,aspdMax:5},  // Rampage: −2 a second after 2.5 s without a landed swing, ASPD +1 per 2 points (max +5)
  swarm:{life:15,every:4,gap:1.5,count:6,blowKeep:15},   // clones live 15 s (a landed hit renews), grow every 4 beats ≥ 1.5 s apart, formulas count ≤ 6
  aspdSkill:10,                         // ASPD from skills, all sources together
  sk:{
    // ---- Basic · Stone Monkey
    gnStaff:{chain:[2,3,4,5],hit:2.0,len:130},   // a normal swing (2026-11-23: ×2 so a Lv 1 monkey without autospells hits like the other heroes)
    gnHair:{N:[5,4,4,3],dmg:[.9,1.0,1.1,1.2]},
    gnCloud:{dist:[220,260,300],cd:[10,9,8],mp:10,T:3,range:300},
    gnBand:{aspd:[1,1.5,2],cc:[.2,.4,.6]},
    gnPeach:{heal:[4,6,8],per:[.25,.4,.5],T:8,cd:20,mp:12},
    gnSub:{T:3,beats:[3,4],cd:[16,14],mp:10,hop:90},
    gnEyes:{hit:[4,8,12]},
    gnForge:{cut:[.15,.3,.45],burn:2},
    // ---- A · Havoc in Heaven
    gaSmash:{dmg:[1.5,1.8,2.1,2.4],rp:3,cd:6,mp:10,range:110},
    gaRhythm:{N:3,dmg:[.55,.7,.85,1.0],w:26,side:.6},
    gaHavoc:{cap:[6,8,10]},
    gaNeedle:{dmg:[1.4,1.8],cd:8,mp:10,range:300},
    gaThousand:{N:6,n:3,dmg:[.5,.65,.8]},
    gaTreasure:{every:[6,5],R:60},
    gaLeap:{dmg:[2.0,2.6],R:90,rp:2,cd:10,mp:14,range:280},
    gaQuake:{flinch:1,beats:2},
    gaSplit:{dmg:[1.3,1.6],per:[.18,.22],cd:10,mp:16,range:120},
    gaUnbound:{dmg:1.9,back:4},
    gaShift:{aspd:[2,3],reach:40,line:.4,cd:1},
    gaWill:{beats:2,gap:4},
    gaPillar:{N:10,dmg:[2.8,3.6],R:70,side:.6},
    gaRebel:{atk:[2,4,6]},
    gaUlt:{T:10,cd:[70,60],mp:50},
    gaEqual:{dmg:4.5,R:90,T:5},
    // ---- B · Seventy-Two Transformations
    gbBlow:{max:[3,4,5,6],n:3,cd:10,mp:12,range:300},
    gbPile:{N:6,dmg:[.25,.3,.35,.4],R:70},
    gbCopy:{dmg:[.08,.11,.15],reach:44},
    gbDecoy:{R:60,Rs:100,hits:[2,3],vit:40,max:4,guard:.8},   // a clone takes one blow per 0.8 s at most
    gbForm:{cd:3,mp:6},
    gbMaster:{dmg:.4,beats:2},
    gbWhirl:{N:9,me:[.7,.85,1.0],R:90,each:[.3,.35,.4],Rc:60},
    gbRecall:{heal:1,cap:6,cd:12,mp:8},
    gbMob:{T:[3,4],slow:1.2,cd:14,mp:16,range:220},
    gbCling:{def:[2,4],max:20},
    gbCave:{R:140,T:8,cut:[.2,.3],every:2,gap:1,slow:1,cd:24,mp:20,range:300},
    gbCourt:{aspd:[2,3],need:4},
    gbBarrage:{N:15,n:12,gap:.1,dmg:[.2,.25],R:110,temp:6},
    gbGold:{atk:[2,3,4]},
    gbUlt:{T:10,wind:6,cd:[70,60],mp:50},
    gbHandsome:{heal:1},
    // ---- C · Victorious Fighting Buddha
    gxStaff:{dmg:1.8,len:150},
    gxSix:{n:3,dmg:.55},
    gxFur:{plus:2,every:3,gap:1.2},
    gxLi:{dist:100,cdr:2,beats:3},
    gxHavoc:{plus:2},
    gxCount:{assist:2},
    gxPeach:{aspd:3,T:8},
    gxSky:{n:5},
    gxTwo:{},
    gxFurnace:{T:15,aspd:4,cd:90,mp:40},
    gxBang:{dmg:5.0,per:.3,R:90,cd:50,mp:40,range:260},
    gxStorm:{T:6,tick:.25,dmg:.3,R:130,wind:10,cd:50,mp:40}
  }
};
const WKS=WK_BAL.sk;
const gX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const WK_DEFS=[
 // ---------------- BASIC · STONE MONKEY ----------------
 {key:'gnStaff',id:'WK-B01',name:'Ruyi Staff',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) ฟาดไม้เท้าห่วงต่อเนื่อง ท่าสุดท้ายไม้เท้ายืดแทงทะลุ 2 ตัวในแนว · ตีปกติโดน = 1 จังหวะ (นับไปปล่อยท่าออโต้) (อัปสลับเลเวลกับ Hair Clone)',lv:i=>[`ต่อ ${WKS.gnStaff.chain[i-1]} ท่า · ครั้งละ ${gX(WKS.gnStaff.hit)}`]},
 {key:'gnHair',id:'WK-B02',name:'Hair Clone',br:'basic',row:1,max:4,passive:1,auto:1,d:'(Passive · ออโต้) ครบจังหวะ ร่างขนทองโผล่ข้างเป้า ฟาดซ้ำ 1 ที แล้วกลับเป็นขน (ท่าออโต้แรก ใช้ได้ทั้งสองสาย)',lv:i=>[`ทุก ${WKS.gnHair.N[i-1]} จังหวะ · ${gX(WKS.gnHair.dmg[i-1])}`]},
 {key:'gnCloud',id:'WK-B03',name:'Somersault Cloud',br:'basic',row:2,max:3,type:'melee',d:'ตีลังกาขึ้นเมฆพุ่งเข้าหาเป้า (ไม่มีเป้า = พุ่งไปข้างหน้า) ลงพื้นแล้ว 3 วิ ตีปกติโดน = 2 จังหวะ',lv:i=>[`ไกล ${WKS.gnCloud.dist[i-1]}`,`Cooldown ${WKS.gnCloud.cd[i-1]} วิ`]},
 {key:'gnBand',id:'WK-B04',name:'Golden Headband',br:'basic',row:2,max:3,passive:1,d:'(Passive) ห่วงทองรัดเกล้าที่วิญญาณหงอคงสิงอยู่ ตีไวขึ้น ติดสตั้น / ชะงักสั้นลง',lv:i=>[`ASPD +${WKS.gnBand.aspd[i-1]}`,`ชะงัก / สตั้นสั้นลง ${WKS.gnBand.cc[i-1]} วิ`]},
 {key:'gnPeach',id:'WK-B05',name:'Peach of Immortality',br:'basic',row:3,max:3,type:'self',d:'กินลูกท้อเซียน ฟื้น HP ทันที แล้ว 8 วิ ท่าออโต้ทุกครั้งฟื้น HP อีกนิด',lv:i=>[`ฟื้น HP เลเวล × ${WKS.gnPeach.heal[i-1]}`,`ต่อท่าออโต้ เลเวล × ${WKS.gnPeach.per[i-1]} นาน ${WKS.gnPeach.T} วิ`,`Cooldown ${WKS.gnPeach.cd} วิ`]},
 {key:'gnSub',id:'WK-B06',name:'Hair Substitute',br:'basic',row:3,max:2,type:'self',d:'3 วิ: การโจมตีครั้งถัดไปที่จะโดนเรา ร่างขนรับแทน (กันเต็ม) เราดีดถอย 90 · ท่าออโต้ทุกท่าได้จังหวะเพิ่ม — ไว้รับท่าใหญ่ของบอส',lv:i=>[`ท่าออโต้ทุกท่า +${WKS.gnSub.beats[i-1]} จังหวะ`,`Cooldown ${WKS.gnSub.cd[i-1]} วิ`]},
 {key:'gnEyes',id:'WK-B07',name:'Fiery Golden Eyes',br:'basic',row:4,max:3,passive:1,d:'(Passive) ตาไฟทองจากเตาแปดทิศ: ตีปกติคริ = 2 จังหวะ · HIT เพิ่ม · บอสที่แยกร่างหลอก: ร่างปลอม 1 ร่างต่อรอบกลไกโดนขีดกากบาทให้เห็น (ช่วย ไม่ข้ามกลไก)',lv:i=>[`HIT +${WKS.gnEyes.hit[i-1]}`]},
 {key:'gnForge',id:'WK-B08',name:'Furnace-Forged Body',br:'basic',row:4,max:3,passive:1,d:'(Passive) กายที่ถูกเผาในเตาแปดทิศ 49 วันแล้วไม่ตาย: ดาเมจที่ได้รับลด ติดไฟสั้นลง',lv:i=>[`ดาเมจที่ได้รับ −เลเวล × ${WKS.gnForge.cut[i-1]} ต่อครั้ง`,`ติดไฟ −${WKS.gnForge.burn} วิ`]},
 // ---------------- A · HAVOC IN HEAVEN ----------------
 {key:'gaSmash',id:'WK-A01',name:'Pillar Smash',br:'A',row:1,max:4,type:'melee',d:'ไม้เท้าโตเป็นเสาค้ำฟ้าทุบเป้า · แต้มอาละวาด +3 (อัปสลับเลเวลกับ Ruyi Rhythm)',lv:i=>[`${gX(WKS.gaSmash.dmg[i-1])}`,`อาละวาด +${WKS.gaSmash.rp}`,`Cooldown ${WKS.gaSmash.cd} วิ`]},
 {key:'gaRhythm',id:'WK-A02',name:'Ruyi Rhythm',br:'A',row:1,max:4,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 3 จังหวะ ร่างขนโผล่หลังเป้า แทงไม้เท้ายืดทะลุมาหาเรา (โดนทุกตัวในแนว โดนด้านหลังเป้าเสมอ)',lv:i=>[`${gX(WKS.gaRhythm.dmg[i-1])}`]},
 {key:'gaHavoc',id:'WK-A03',name:'Rampage',br:'A',row:2,max:3,passive:1,d:'(Passive) แต้มอาละวาด: ตีปกติโดนเป้าเดิม +1 (คริ +2) · ทุก 2 แต้ม ASPD +1 (สูงสุด +5) · เปลี่ยนเป้าเหลือครึ่ง · 2.5 วิไม่ได้ตีโดน ลดวิละ 2',lv:i=>[`สูงสุด ${WKS.gaHavoc.cap[i-1]} แต้ม`]},
 {key:'gaNeedle',id:'WK-A04',name:'Needle Strike',br:'A',row:2,max:2,type:'melee',d:'ย่อไม้เท้าเท่าเข็ม ขว้างไกล แล้วยืดกลับเป็นไม้เท้าฟาด · ย้ายแต้มอาละวาดไปเป้าใหม่ครบ',lv:i=>[`${gX(WKS.gaNeedle.dmg[i-1])} ไกล ${WKS.gaNeedle.range}`,`Cooldown ${WKS.gaNeedle.cd} วิ`]},
 {key:'gaThousand',id:'WK-A05',name:'Thousand Staves',br:'A',row:3,max:3,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 6 จังหวะ ร่างขน 3 ร่างล้อมเป้ารุมฟาดพร้อมกัน',lv:i=>[`3 × ${gX(WKS.gaThousand.dmg[i-1])}`]},
 {key:'gaTreasure',id:'WK-A06',name:'Eastern Sea Treasure',br:'A',row:3,max:2,passive:1,d:'(Passive) ไม้เท้าคือเสาวัดทะเลจากวังพญามังกร: ท่าออโต้สาย A ครบรอบ วิญญาณหงอคงร่างยักษ์ทำแทน ดาเมจ 2 เท่า + สะเทือนรอบเป้า 60',lv:i=>[`ท่าออโต้สาย A ทุกครั้งที่ ${WKS.gaTreasure.every[i-1]}`]},
 {key:'gaLeap',id:'WK-A07',name:'Heaven-Smashing Leap',br:'A',row:4,max:2,type:'melee',d:'กระโดดสูงลงทุบ · แต้มอาละวาด +2',lv:i=>[`${gX(WKS.gaLeap.dmg[i-1])} รัศมี ${WKS.gaLeap.R}`,`ไกล ${WKS.gaLeap.range}`,`Cooldown ${WKS.gaLeap.cd} วิ`]},
 {key:'gaQuake',id:'WK-A08',name:'Quake Landing',br:'A',row:4,max:1,passive:1,enh:'gaLeap',pre:[['gaLeap',1]],d:'(ต่อยอด Heaven-Smashing Leap) ศัตรูรอบจุดตกชะงัก (บอสช้าลงแทน) · ท่าออโต้สาย A ทุกท่า +2 จังหวะ',lv:()=>[`ชะงัก ${WKS.gaQuake.flinch} วิ · +${WKS.gaQuake.beats} จังหวะ`]},
 {key:'gaSplit',id:'WK-A09',name:'Mountain Splitter',br:'A',row:5,max:2,type:'melee',d:'ผ่าภูเขาห้านิ้วที่เคยทับวิญญาณหงอคง 500 ปี ใช้แต้มอาละวาดทั้งหมด',lv:i=>[`${gX(WKS.gaSplit.dmg[i-1])} + ${gX(WKS.gaSplit.per[i-1])} ต่อแต้ม`,`Cooldown ${WKS.gaSplit.cd} วิ`]},
 {key:'gaUnbound',id:'WK-A10',name:'Unbound',br:'A',row:5,max:1,passive:1,enh:'gaSplit',pre:[['gaSplit',1]],d:'(ต่อยอด Mountain Splitter) ใช้ตอนแต้มเต็ม: ร่างขนผ่าซ้ำจากหลังเป้า แล้วแต้มกลับมา 4',lv:()=>[`${gX(WKS.gaUnbound.dmg)}`]},
 {key:'gaShift',id:'WK-A11',name:'Ruyi Shift',br:'A',row:6,max:2,type:'self',d:'สลับยืด–หดไม้เท้า: สั้น = ASPD เพิ่ม · ยาว = ASPD ลด แต่ตีปกติแทงทะลุตัวหลังในแนว (ไกลขึ้น 40) แรงขึ้น +ATK×0.4',lv:i=>[`สั้น ASPD +${WKS.gaShift.aspd[i-1]} · ยาว ASPD −${WKS.gaShift.aspd[i-1]}`,`Cooldown ${WKS.gaShift.cd} วิ`]},
 {key:'gaWill',id:'WK-A12',name:'As You Will',br:'A',row:6,max:1,passive:1,enh:'gaShift',pre:[['gaShift',1]],d:'(ต่อยอด Ruyi Shift) สลับท่า → ท่าออโต้สาย A ทุกท่า +2 จังหวะ (ได้ทุก 4 วิ) — สลับเป็นจังหวะ ยืด หด ยืด',lv:()=>[`+${WKS.gaWill.beats} จังหวะ ทุก ${WKS.gaWill.gap} วิ`]},
 {key:'gaPillar',id:'WK-A13',name:'Sky-Pillar Drop',br:'A',row:7,max:2,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 10 จังหวะ วิญญาณหงอคงร่างยักษ์บนเมฆปักไม้เท้าทะลุฟ้าลงกลางเป้า',lv:i=>[`${gX(WKS.gaPillar.dmg[i-1])} รัศมี ${WKS.gaPillar.R}`]},
 {key:'gaRebel',id:'WK-A14',name:'Rebel King',br:'A',row:7,max:3,passive:1,d:'(Passive) ทุกแต้มอาละวาด ATK เพิ่ม',lv:i=>[`ATK +${WKS.gaRebel.atk[i-1]} ต่อแต้ม`]},
 {key:'gaUlt',id:'WK-A15',name:'Havoc in Heaven',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · หงอคงเข้าสิงเต็มตัว 10 วิ: แต้มอาละวาดเต็มค้าง · ท่าออโต้สาย A ออกเป็นคู่ (ร่างหน้า + ร่างหลังเป้า) · ไม่ทะลุเพดาน ASPD',lv:i=>[`${WKS.gaUlt.T} วิ`,`Cooldown ${WKS.gaUlt.cd[i-1]} วิ`]},
 {key:'gaEqual',id:'WK-A16',name:'Equal to Heaven',br:'A',row:8,max:1,passive:1,enh:'gaUlt',pre:[['gaUlt',1]],d:'(ต่อยอด Havoc in Heaven) จบอัลติ เรากับร่างขน 3 ร่างผ่าภูเขาพร้อมกัน (ไม่ใช้แต้ม) แล้วแต้มเต็มต่ออีก 5 วิ',lv:()=>[`${gX(WKS.gaEqual.dmg)} รัศมี ${WKS.gaEqual.R}`]},
 // ---------------- B · SEVENTY-TWO TRANSFORMATIONS ----------------
 {key:'gbBlow',id:'WK-G01',name:'Pluck & Blow',br:'B',row:1,max:4,type:'self',d:'ถอนขนเป่า ร่างขน 3 ร่างโผล่รอบเป้าทันที และเริ่มฝูง (ร่างงอกเองทุก 4 จังหวะ) (อัปสลับเลเวลกับ Monkey Pile-On)',lv:i=>[`ร่างสูงสุด ${WKS.gbBlow.max[i-1]}`,`Cooldown ${WKS.gbBlow.cd} วิ`]},
 {key:'gbPile',id:'WK-G02',name:'Monkey Pile-On',br:'B',row:1,max:4,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 6 จังหวะ ร่างขนทุกร่างกระโดดทับเป้า ทุบพร้อมกัน (นับไม่เกิน 6 ร่าง)',lv:i=>[`ร่างละ ${gX(WKS.gbPile.dmg[i-1])} รัศมี ${WKS.gbPile.R}`]},
 {key:'gbCopy',id:'WK-G03',name:'Copycat Swarm',br:'B',row:2,max:3,passive:1,d:'(Passive) ร่างขนตีตามเราทุกครั้งที่เราตีปกติ ใส่ตัวที่ใกล้ร่างนั้นที่สุด · ร่างตีโดน 2 ร่างขึ้นไป = +1 จังหวะ · การตีของร่างไม่นับเป็นการตีโดนของเรา',lv:i=>[`ร่างละ ${gX(WKS.gbCopy.dmg[i-1])}`]},
 {key:'gbDecoy',id:'WK-G04',name:'Stone Decoys',br:'B',row:2,max:2,passive:1,d:'(Passive) มอนใกล้ร่างขน (60) ตีร่างแทนเรา · ร่างรับได้ n ครั้งแล้วแตกกลับเป็นขน (ไม่คืนจังหวะ) · VIT ทุก 40 รับได้ +1 ครั้ง (สูงสุด 4) · บอสไม่หลงร่าง',lv:i=>[`รับได้ ${WKS.gbDecoy.hits[i-1]} ครั้ง`]},
 {key:'gbForm',id:'WK-G05',name:'Seventy-Two Transformations',br:'B',row:3,max:2,type:'self',d:'เปลี่ยนร่างทั้งฝูง (กดวน): เสือ = ร่างสูงสุด −2 ตีตาม ×2 รุมเป้าเดียวกับเรา · ผึ้ง = ตีตาม 2 ครั้ง ครั้งละ ×0.6 คนละตัว โดน 1 ทีแตก · หิน = รับได้ +1 ครั้ง ล่อระยะ 100 ตีตาม ×0.7',lv:i=>[i<2?'ร่างเสือ + ร่างหิน':'ครบ 3 ร่าง (เสือ ผึ้ง หิน)',`Cooldown ${WKS.gbForm.cd} วิ`]},
 {key:'gbMaster',id:'WK-G06',name:'Master of Change',br:'B',row:3,max:1,passive:1,enh:'gbForm',pre:[['gbForm',1]],d:'(ต่อยอด 72 แปลง) สลับร่าง → ทุกร่างทำท่าเข้าร่าง (เสือตะครุบ / ผึ้งต่อยให้ช้า / หินกระแทกเรียกมอน) · ท่าออโต้สาย B ทุกท่า +2 จังหวะ',lv:()=>[`ท่าเข้าร่าง ร่างละ ${gX(WKS.gbMaster.dmg)}`]},
 {key:'gbWhirl',id:'WK-G07',name:'Staff Whirlwind',br:'B',row:4,max:3,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 9 จังหวะ เรากับร่างขนทุกร่างหมุนไม้เท้าพร้อมกัน เป็นพายุหลายลูก (นับไม่เกิน 6 ร่าง)',lv:i=>[`เรา ${gX(WKS.gbWhirl.me[i-1])} รัศมี ${WKS.gbWhirl.R} · ร่างละ ${gX(WKS.gbWhirl.each[i-1])} รัศมี ${WKS.gbWhirl.Rc}`]},
 {key:'gbRecall',id:'WK-G08',name:'Hair Recall',br:'B',row:4,max:1,type:'self',d:'เรียกร่างทั้งหมดกลับเป็นขน: ร่างละ +1 จังหวะให้ทุกท่าออโต้ (รวมไม่เกิน +6) + ฟื้น HP — ใช้ตอนจบฝูง / ก่อนบอสเปิดช่อง',lv:()=>[`ฟื้น HP เลเวล × ${WKS.gbRecall.heal} ต่อร่าง`,`Cooldown ${WKS.gbRecall.cd} วิ`]},
 {key:'gbMob',id:'WK-G09',name:'Monkey Mob',br:'B',row:5,max:2,type:'melee',d:'ร่างขนทุกร่างกระโดดเกาะเป้า ตีตามทั้งหมดลงเป้านี้ เป้าช้าลง (บอสช้าลงน้อยกว่า) — ท่าเป้าเดียวของสาย B',lv:i=>[`เกาะ ${WKS.gbMob.T[i-1]} วิ`,`Cooldown ${WKS.gbMob.cd} วิ`]},
 {key:'gbCling',id:'WK-G10',name:'Clinging Fur',br:'B',row:5,max:2,passive:1,enh:'gbMob',pre:[['gbMob',1]],d:'(ต่อยอด Monkey Mob) ระหว่างเกาะ DEF เป้าลดตามจำนวนร่าง (รวมไม่เกิน −20)',lv:i=>[`DEF −${WKS.gbCling.def[i-1]} ต่อร่าง`]},
 {key:'gbCave',id:'WK-G11',name:'Water Curtain Cave',br:'B',row:6,max:2,type:'ground',radius:()=>WKS.gbCave.R,d:'ม่านน้ำตกหน้าถ้ำวานร นาน 8 วิ: ร่างในม่านงอกทุก 2 จังหวะ (ไม่ถี่กว่า 1 ร่าง / 1 วิ) · เราในม่านดาเมจที่ได้รับลด · มอนในม่านช้าลง',lv:i=>[`รัศมี ${WKS.gbCave.R} · ดาเมจที่ได้รับ −เลเวล × ${WKS.gbCave.cut[i-1]} ต่อครั้ง`,`Cooldown ${WKS.gbCave.cd} วิ`]},
 {key:'gbCourt',id:'WK-G12',name:"Monkey King's Court",br:'B',row:6,max:2,passive:1,d:'(Passive) มีร่างขน 4 ร่างขึ้นไป ตีไวขึ้น',lv:i=>[`ASPD +${WKS.gbCourt.aspd[i-1]}`]},
 {key:'gbBarrage',id:'WK-G13',name:'Thousand-Monkey Barrage',br:'B',row:7,max:2,passive:1,auto:1,d:'(Passive · ออโต้) ทุก 15 จังหวะ ร่างขนชั่วคราวโผล่เพิ่ม 6 ร่าง รัวไม้เท้าทั้งฝูงรอบเป้า 12 ครั้ง',lv:i=>[`ครั้งละ ${gX(WKS.gbBarrage.dmg[i-1])} รัศมี ${WKS.gbBarrage.R}`]},
 {key:'gbGold',id:'WK-G14',name:'Golden Fur',br:'B',row:7,max:3,passive:1,d:'(Passive) ทุกร่างขนที่มีอยู่ ATK เพิ่ม (นับไม่เกิน 6 ร่าง)',lv:i=>[`ATK +${WKS.gbGold.atk[i-1]} ต่อร่าง`]},
 {key:'gbUlt',id:'WK-G15',name:'Flower-Fruit Mountain Army',br:'B',row:8,max:2,type:'self',ult:1,d:'ULTIMATE B · เป่าหอยสังข์เรียกกองทัพวานร 10 วิ: ร่างเต็มทันที + ร่างลมชั่วคราวอีก 6 (ตีตามได้ ไม่นับในท่าที่คิดตามจำนวนร่าง) · ร่างช่วยนับจังหวะเพิ่มอีก +1 · ร่างไม่แตก',lv:i=>[`${WKS.gbUlt.T} วิ`,`Cooldown ${WKS.gbUlt.cd[i-1]} วิ`]},
 {key:'gbHandsome',id:'WK-G16',name:'Handsome Monkey King',br:'B',row:8,max:1,passive:1,enh:'gbUlt',pre:[['gbUlt',1]],d:'(ต่อยอด Flower-Fruit Mountain Army) จบอัลติ ร่างทั้งหมดกลับเป็นขนพร้อมกัน → ท่าออโต้สาย B ทุกท่าออกทันที 1 ครั้ง + ฟื้น HP',lv:()=>[`ฟื้น HP เลเวล × ${WKS.gbHandsome.heal} ต่อร่าง (นับ ≤ 6)`]},
 // ---------------- C · VICTORIOUS FIGHTING BUDDHA (12 nodes, same row) ----------------
 {key:'gxStaff',id:'WK-C01',name:'Ten-Thousand-Jin Staff',br:'C',col:'basic',tier:1,passive:1,pre:[['gnStaff',4]],d:'ตีปกติต่อได้อีก 1 ท่า ท่าสุดท้ายไม้เท้ายืดกวาดเป็นแนว นับ 2 จังหวะ',lv:()=>[`${gX(WKS.gxStaff.dmg)} แนว ${WKS.gxStaff.len}`]},
 {key:'gxSix',id:'WK-C02',name:'Three Heads, Six Arms',br:'C',col:'A',tier:1,passive:1,pre:[['gaRhythm',4]],d:'ร่างขนของ Ruyi Rhythm สามเศียรหกกร แทง 3 ครั้ง',lv:()=>[`${WKS.gxSix.n} × ${gX(WKS.gxSix.dmg)}`]},
 {key:'gxFur',id:'WK-C03',name:'Endless Fur',br:'C',col:'B',tier:1,passive:1,pre:[['gbBlow',4]],d:'ร่างสูงสุด +2 (ร่างลม ตีตามได้ ไม่นับในท่าที่คิดตามจำนวนร่าง) · งอกเองทุก 3 จังหวะ (ไม่ถี่กว่า 1.2 วิ)',lv:()=>['ร่างสูงสุด +2 · ทุก 3 จังหวะ']},
 {key:'gxLi',id:'WK-C04',name:'108,000 Li',br:'C',col:'basic',tier:2,passive:1,pre:[['gnCloud',3]],d:'ตีลังกาเดียวแสนแปดพันลี้: Somersault Cloud ไกลขึ้น คูลดาวน์ลด ลงพื้นแล้วท่าออโต้ทุกท่า +3 จังหวะ',lv:()=>[`ไกล +${WKS.gxLi.dist} · Cooldown −${WKS.gxLi.cdr} วิ · +${WKS.gxLi.beats} จังหวะ`]},
 {key:'gxHavoc',id:'WK-C05',name:'Endless Havoc',br:'C',col:'A',tier:2,passive:1,pre:[['gaHavoc',3]],d:'เปลี่ยนเป้าไม่เสียแต้มอาละวาด · แต้มสูงสุด +2 (ASPD ยังได้สูงสุด +5)',lv:()=>['แต้มสูงสุด 12']},
 {key:'gxCount',id:'WK-C06',name:'Every Hair Counts',br:'C',col:'B',tier:2,passive:1,pre:[['gbCopy',3]],d:'ร่างขนช่วยนับจังหวะได้ +2 ต่อการตีของเรา (จาก +1)',lv:()=>['ช่วยนับ +2 จังหวะ']},
 {key:'gxPeach',id:'WK-C07',name:'Peach Banquet',br:'C',col:'basic',tier:3,passive:1,pre:[['gnPeach',3]],d:'Peach of Immortality ให้ ASPD +3 นาน 8 วิ และฟื้นต่อท่าออโต้ 2 เท่า',lv:()=>[`ASPD +${WKS.gxPeach.aspd} นาน ${WKS.gxPeach.T} วิ`]},
 {key:'gxSky',id:'WK-C08',name:'Staves from the Sky',br:'C',col:'A',tier:3,passive:1,pre:[['gaThousand',3]],d:'Thousand Staves ร่างขน 3 → 5 ร่าง',lv:()=>[`${WKS.gxSky.n} × ${gX(WKS.gaThousand.dmg[2])}`]},
 {key:'gxTwo',id:'WK-C09',name:'Two Forms at Once',br:'C',col:'B',tier:3,passive:1,pre:[['gbForm',2]],d:'ฝูงแบ่งเป็น 2 ร่างพร้อมกัน (ครึ่งต่อครึ่ง) สลับร่างได้ท่าเข้าร่างทั้งสองแบบ',lv:()=>['2 ร่างพร้อมกัน']},
 {key:'gxFurnace',id:'WK-C10',name:'Out of the Furnace',br:'C',col:'basic',tier:4,type:'self',pre:[['gnForge',3]],d:'[New Active] Signature · ออกจากเตาแปดทิศ ไฟทองท่วมตัว 15 วิ: ทุก 3 จังหวะแถมอีก 1 จังหวะ (ทุกท่าเร็วขึ้นเท่ากัน) · คริ = 3 จังหวะ · ASPD +4 · Furnace-Forged Body 2 เท่า',lv:()=>[`${WKS.gxFurnace.T} วิ`,`Cooldown ${WKS.gxFurnace.cd} วิ`]},
 {key:'gxBang',id:'WK-C11',name:'Ruyi Jingu Bang, 13,500 Jin',br:'C',col:'A',tier:4,type:'melee',pre:[['gaLeap',2]],d:'[New Active] กระโดดขึ้นฟ้า ไม้เท้าโตเท่าภูเขาทุบลงเป้าเดียว ไม่ใช้แต้มอาละวาด',lv:()=>[`${gX(WKS.gxBang.dmg)} + ${gX(WKS.gxBang.per)} ต่อแต้มอาละวาด`,`Cooldown ${WKS.gxBang.cd} วิ`]},
 {key:'gxStorm',id:'WK-C12',name:'Storm of Ten Thousand Monkeys',br:'C',col:'B',tier:4,type:'self',pre:[['gbWhirl',3]],d:'[New Active] 6 วิ: ร่างขนทุกร่าง + ร่างลมชั่วคราว 10 ร่างหมุนไม้เท้าเป็นพายุตามตัวเรา (โดน = ½ จังหวะ สูงสุด 2 ต่อรอบ)',lv:()=>[`${gX(WKS.gxStorm.dmg)} ทุก ${WKS.gxStorm.tick} วิ รัศมี ${WKS.gxStorm.R}`,`Cooldown ${WKS.gxStorm.cd} วิ`]}
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const WK={beats:{},last:{},flash:{},nextFire:0,rp:0,rpE:null,rpT:-99,rpPop:0,lastTgt:null,lastHitT:-99,lastCrit:0,
  swarm:[],slotN:0,growAcc:0,growT:-99,blowT:-99,form:'none',form2:'none',shift:'short',willT:-99,
  cloudT:-99,peachT:-99,peachAT:-99,subUntil:-99,furnT:-99,furnAcc:0,trN:0,ultA:-99,ultAOn:0,ultB:-99,ultBOn:0,equalT:-99,
  mob:null,cave:null,storm:null,beatPop:0,_v:null};
const gL=k=>LV[k]||0;
/* learned and not switched off by the per-branch bench (window.__BENCH_SKIP also rests that branch's passives) */
const gOn=k=>(LV[k]||0)>0&&!(window.__BENCH_SKIP&&window.__BENCH_SKIP(k));
const gLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,gL(k)))-1];
const WKC={gold:'#ffd24a',gold2:'#fff3bf',amber:'#ff9a2a',red:'#e8463a',vermil:'#ff5a3a',indigo:'#2c3a78',sky:'#9fd8ff',cloud:'#f6f9ff',
  wood:'#5a3a22',iron:'#3c4048',ring:'#b9bec8',peach:'#ff9ab0',stone:'#bdb5a8',tiger:'#ff9b3a',hornet:'#ffe24a',water:'#7fd0ff',fire:'#ffb030',jade:'#58d6a8'};
/* the golden hair clones are the hero's own frames: gold (normal), tiger orange, hornet yellow, stone grey-gold, wind = pale */
const FLT={none:'grayscale(1) sepia(1) saturate(4.2) hue-rotate(-12deg) brightness(1.32) contrast(1.05)',
  tiger:'grayscale(1) sepia(1) saturate(6) hue-rotate(-30deg) brightness(1.12) contrast(1.1)',
  hornet:'grayscale(1) sepia(1) saturate(7) hue-rotate(6deg) brightness(1.45)',
  stone:'grayscale(1) sepia(.4) saturate(1.3) brightness(1.02) contrast(1.15)',
  wind:'grayscale(1) sepia(.6) saturate(2.5) hue-rotate(-8deg) brightness(1.8)',
  giant:'grayscale(1) sepia(1) saturate(5) hue-rotate(-14deg) brightness(1.5)'};
const FCOL={none:WKC.gold,tiger:WKC.tiger,hornet:WKC.hornet,stone:'#d8cfa8',wind:WKC.gold2,giant:WKC.gold};
/* the branch (column) of a skill key: C nodes follow their column */
const gCol=k=>{if(!k||k==='basic')return 'basic';const d=WK_DEFS.find(x=>x.key===k);if(d)return d.br==='C'?d.col:d.br;const s=SKILLS[k];return s?(s.br==='C'?(s.col||'basic'):s.br):'basic';};
const gNear=(x,y,R)=>enemies.filter(e=>!e.dead&&!e.hidden&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const gNearest=(x,y,R,skip)=>{let b=null,bd=R;for(const e of enemies){if(e.dead||e.hidden||e===skip)continue;const d=Math.hypot(e.x-x,e.y-y)-e.r*.5;if(d<bd){bd=d;b=e;}}return b;};
const gSegD=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const gSeg=(ax,ay,bx,by,w)=>enemies.filter(e=>!e.dead&&!e.hidden&&gSegD(e.x,e.y,ax,ay,bx,by)<w+e.r*.5);
function gFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&typeof mapBlockedW==='function'&&mapBlockedW(x,y));}
function gPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!gFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const gTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const gPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
function gNo(t){if(gameTime-(gNo.t||-9)<1)return;gNo.t=gameTime;setTimeout(()=>msg(t),0);}
/* every hit of the monkey goes through here (branch = the skill's column → its coefficient) */
function gHit(e,m,key,o={}){if(!e||e.dead)return 0;return hurt(e,m,Object.assign({skill:key,br:gCol(key)},o));}
/* an autospell hit: performed by a hair clone, never misses, never crits (a skill hit: gems / seals / runes see it) */
function gAuto(e,m,key,o={}){return gHit(e,m,key,Object.assign({sure:1},o));}
/* a swarm copy-hit (rule 8): o.dot → no crit, no miss, and the seal / rune / gem-support / item / boss-counter hooks skip it */
function gCopy(e,m){if(!e||e.dead)return 0;WK._inCopy=1;try{return hurt(e,m,{dot:1,sure:1,_clone:1,skill:'gbCopy',br:'B'});}finally{WK._inCopy=0;}}

/* ---- one hair supply: while the swarm (B) is out, the A tools rest ---- */
const realClones=()=>WK.swarm.filter(c=>!c.gone&&!c.wind&&!c.tmp);
const liveClones=()=>WK.swarm.filter(c=>!c.gone&&!c.tmp);
const swarmOut=()=>WK.swarm.some(c=>!c.gone&&!c.tmp);
const countClones=()=>Math.min(WK_BAL.swarm.count,realClones().length);   // formulas count ≤ 6 (wind clones never)
const aRest=()=>swarmOut();

/* ---- RAMPAGE (A) ---- */
const rpCap=()=>gOn('gaHavoc')?gLv(WKS.gaHavoc.cap,'gaHavoc')+(gOn('gxHavoc')?WKS.gxHavoc.plus:0):0;
const rpLock=()=>WK.ultA>gameTime||WK.equalT>gameTime;
function rpAdd(n,e){const cap=rpCap();if(!cap||aRest())return;
  if(e&&WK.rpE&&WK.rpE!==e&&!WK.rpE.dead&&!gOn('gxHavoc')&&!rpLock())WK.rp=Math.floor(WK.rp/2);   // a new target keeps half (Endless Havoc: all)
  if(e)WK.rpE=e;const was=WK.rp;WK.rp=Math.min(cap,WK.rp+n);WK.rpT=gameTime;if(WK.rp>was)WK.rpPop=1;}

/* ---- ASPD from skills (RO points, all together ≤ +10, the hero's cap still holds) ---- */
function skillAspd(){let a=0;
  if(gOn('gnBand'))a+=gLv(WKS.gnBand.aspd,'gnBand');
  if(rpCap()&&!aRest())a+=Math.min(WK_BAL.rp.aspdMax,Math.floor(WK.rp/WK_BAL.rp.per));
  if(gOn('gaShift')){const v=gLv(WKS.gaShift.aspd,'gaShift');a+=WK.shift==='long'?-v:v;}
  if(gOn('gbCourt')&&countClones()>=WKS.gbCourt.need)a+=gLv(WKS.gbCourt.aspd,'gbCourt');
  if(WK.peachAT>gameTime)a+=WKS.gxPeach.aspd;
  if(WK.furnT>gameTime)a+=WKS.gxFurnace.aspd;
  return Math.min(WK_BAL.aspdSkill,a);}
function aspdCap(){let c=(typeof SYS!=='undefined'&&SYS.aspdMax)||190;try{if(window.MSF&&typeof MSF.tier==='function'&&MSF.tier('agi')>=3)c+=3;}catch(_){}return c;}
/* attacks a second the hero really swings at now (index.html: aspd() = D.aps / 1.45 × jgAspd()) */
const swingsPS=()=>Math.max(.3,aspd()*1.45);

/* ---------------------------------------------------------------------
   4. AUTOSPELL ENGINE — beats → counters → a hair clone casts
   --------------------------------------------------------------------- */
const AUTOS=[{k:'gbBarrage',br:'B'},{k:'gaPillar',br:'A'},{k:'gbWhirl',br:'B'},{k:'gaThousand',br:'A'},{k:'gbPile',br:'B'},{k:'gnHair',br:'basic'},{k:'gaRhythm',br:'A'}];   // big first
const autoN0=k=>{const N=WKS[k].N;return Array.isArray(N)?gLv(N,k):N;};
/* a gem that stretches / shortens the cooldown stretches / shortens N the same way (totem_gems.js ACT[k]); the minimum gap stays */
function gemNMul(k){try{const A=window.totemGems&&totemGems.act&&totemGems.act()[k];if(!A)return 1;const id=A.mut;return id==='heavy'?1.5:id==='rapid'?.6:1;}catch(_){return 1;}}
const autoN=k=>Math.max(1,autoN0(k)*gemNMul(k));
const autoGap=k=>autoN0(k)*(gCol(k)==='B'?WK_BAL.gapB:WK_BAL.gapA);
function autoOk(k){if(!gOn(k))return false;const br=gCol(k);if(br==='A'&&aRest())return false;if(br==='B'&&!swarmOut())return false;return true;}
/* add beats to every learned autospell (f = filter by branch); a counter keeps at most 2N */
function addBeats(n,f){if(!(n>0))return;for(const A of AUTOS){if(!gOn(A.k)||(f&&!f(A)))continue;const N=autoN(A.k);WK.beats[A.k]=Math.min(2*N,(WK.beats[A.k]||0)+n);}WK.beatPop=1;}
const beatsA=n=>addBeats(n,A=>A.br==='A');
const beatsB=n=>addBeats(n,A=>A.br==='B');
function autoTgt(){const t=WK.lastTgt;if(t&&!t.dead&&!t.hidden&&dist(player,t)<420)return t;return gNearest(player.x,player.y,320);}
function gAutoTick(){if(gameTime<WK.nextFire||player.hp<=0)return;
  for(const A of AUTOS){const k=A.k;if(!autoOk(k))continue;const N=autoN(k);if((WK.beats[k]||0)<N-1e-6)continue;if(gameTime-(WK.last[k]??-99)<autoGap(k))continue;
    const t=autoTgt();if(!t)return;   // nobody near: the beats wait
    WK.beats[k]-=N;WK.last[k]=gameTime;WK.flash[k]=gameTime;WK.nextFire=gameTime+.1;fireAuto(k,t);return;}}
function fireAuto(k,t){const br=gCol(k);let giant=0;
  if(br==='A'){WK.trN++;if(gOn('gaTreasure')&&WK.trN%gLv(WKS.gaTreasure.every,'gaTreasure')===0)giant=1;}
  const F=AUTO_FIRE[k];if(F){F(t,{giant});if(br==='A'&&WK.ultA>gameTime)setFxTimer(.09,()=>{if(!t.dead)F(t,{giant,front:1});});}   // Havoc in Heaven: A autospells come in pairs
  if(WK.peachT>gameTime){const h=Math.round(PS.lv*gLv(WKS.gnPeach.per,'gnPeach')*(gOn('gxPeach')?2:1));if(h>0){player.hp=Math.min(player.maxHp,player.hp+h);peachPop(h);}}
  WK.fired=(WK.fired||0)+1;}
/* the beats of one landed normal swing: 1 (crit 2 with the Eyes, 3 in the Furnace) · ×2 for 3 s after a Somersault Cloud landing */
function swingBeats(crit,base=1){let n=base;if(crit&&gOn('gnEyes'))n+=WK.furnT>gameTime?2:1;if(WK.cloudT>gameTime)n*=2;
  if(WK.furnT>gameTime){WK.furnAcc+=n;const x=Math.floor(WK.furnAcc/3);WK.furnAcc-=x*3;n+=x;}   // Out of the Furnace: every 3 beats one more
  return n;}

/* ---------------------------------------------------------------------
   5. THE SWARM (B)
   --------------------------------------------------------------------- */
const FORMS=()=>gL('gbForm')>=2?['none','tiger','hornet','stone']:['none','tiger','stone'];
const hasForm=f=>WK.form===f||(gOn('gxTwo')&&WK.form2===f);
function maxClones(){if(!gOn('gbBlow'))return 0;let m=gLv(WKS.gbBlow.max,'gbBlow');if(WK.form==='tiger'&&!gOn('gxTwo'))m-=2;return Math.max(1,m);}
const windMax=()=>(gOn('gxFur')?WKS.gxFur.plus:0)+(WK.ultB>gameTime?WKS.gbUlt.wind:0);
function cloneHits(c){if(c.form==='hornet')return 1;let h=gOn('gbDecoy')?gLv(WKS.gbDecoy.hits,'gbDecoy')+Math.floor(((D&&D.stat&&D.stat.vit)||0)/WKS.gbDecoy.vit):1;if(c.form==='stone')h++;return Math.max(1,Math.min(WKS.gbDecoy.max,h));}
function nextForm(){const F=FORMS();if(!gOn('gxTwo'))return F[(F.indexOf(WK.form)+1)%F.length];return F[(F.indexOf(WK.form)+1)%F.length];}
function formFor(){if(!gOn('gxTwo')||WK.form==='none')return WK.form;const n=realClones().length;return n%2?WK.form2:WK.form;}
function spawnClone(x,y,o={}){[x,y]=clampPt(x,y);const c=new WkMonkey(Object.assign({wx:x,wy:y,slot:WK.slotN++,form:o.tmp?'none':formFor()},o));c.hits=cloneHits(c);
  c.until=gameTime+(o.life||WK_BAL.swarm.life);WK.swarm.push(c);addFx(c);if(!o.quiet)hairPuff(x,y,22,o.wind?6:10);return c;}
/* grows from the hero's swings: every 4 beats (Endless Fur 3, inside the Water Curtain 2), never faster than one per 1.5 s (1.2 / 1) */
function growBeats(n){if(!gOn('gbBlow'))return;if(!(swarmOut()||gameTime-WK.blowT<WK_BAL.swarm.blowKeep))return;
  const cave=WK.cave&&WK.cave.until>gameTime&&Math.hypot(player.x-WK.cave.x,player.y-WK.cave.y)<WKS.gbCave.R;
  const every=cave?WKS.gbCave.every:gOn('gxFur')?WKS.gxFur.every:WK_BAL.swarm.every,gap=cave?WKS.gbCave.gap:gOn('gxFur')?WKS.gxFur.gap:WK_BAL.swarm.gap;
  WK.growAcc=Math.min(2*every,WK.growAcc+n);if(WK.growAcc<every||gameTime-WK.growT<gap)return;
  const real=realClones().length,wind=WK.swarm.filter(c=>!c.gone&&c.wind&&!c.tmp).length;
  if(real<maxClones())spawnClone(player.x+rnd(-40,40),player.y+rnd(-30,30));else if(wind<windMax())spawnClone(player.x+rnd(-40,40),player.y+rnd(-30,30),{wind:1});else return;
  WK.growAcc-=every;WK.growT=gameTime;}
function popClone(c,why){if(!c||c.gone)return;c.gone=1;c.fade=1;hairPuff(c.wx,c.wy,24+(c.z||0),c.wind?6:12);}
/* a hair clone takes a monster's blow (Stone Decoys) */
function cloneTakes(c,e){c.flash=1;c.hurtT=gameTime;if(WK.ultB>gameTime)return;c.hits--;if(c.hits<=0)popClone(c,'hit');}
/* the clone's target: Monkey Mob → that one · tiger → ours · else the nearest to the clone */
function cloneTgt(c,mine){const M=WK.mob&&WK.mob.until>gameTime&&WK.mob.e&&!WK.mob.e.dead?WK.mob.e:null;if(M)return M;
  if(c.form==='tiger'&&mine&&!mine.dead&&Math.hypot(mine.x-c.wx,mine.y-c.wy)<300)return mine;
  return gNearest(c.wx,c.wy,150)||(mine&&!mine.dead&&dist(player,mine)<240?mine:null);}
/* Copycat Swarm: every clone copies our normal swing (o.dot copy-hits) · ≥ 2 landed = beats for us */
function copySwing(mine){if(!swarmOut())return 0;const on=gOn('gbCopy'),m=on?gLv(WKS.gbCopy.dmg,'gbCopy'):0;let landed=0;
  for(const c of WK.swarm){if(c.gone||c.tmp)continue;const e=cloneTgt(c,mine);c.tgt=e;if(!e)continue;const reach=e.r+WKS.gbCopy.reach+(c.form==='hornet'?60:0);
    if(Math.hypot(e.x-c.wx,e.y-c.wy)>reach+20)continue;c.atkT=gameTime;c.face=Math.atan2(e.y-c.wy,e.x-c.wx);
    if(!on)continue;let hit=0;
    if(c.form==='hornet'){const e2=gNearest(c.wx,c.wy,160,e)||e;for(const q of [e,e2]){if(gCopy(q,m*.6)>0){hit=1;stingFx(c,q);}}}
    else{const mul=c.form==='tiger'?2:c.form==='stone'?.7:1;if(gCopy(e,m*mul)>0){hit=1;cloneSpark(e,c);}}
    if(hit){landed++;c.until=Math.max(c.until,gameTime+WK_BAL.swarm.life);}}
  if(landed>=2){const n=(gOn('gxCount')?WKS.gxCount.assist:1)+(WK.ultB>gameTime?1:0);return n;}return 0;}
/* Stone Decoys: monsters near a clone hit the clone instead of us (bosses / boss parts are not fooled) */
function decoyTick(){if(!gOn('gbDecoy'))return;for(const c of WK.swarm){if(c.gone||c.tmp||c.wind)continue;   /* wind clones (Endless Fur, the army) are not counted: they draw nothing */const R=c.form==='stone'?WKS.gbDecoy.Rs:WKS.gbDecoy.R;
  for(const e of enemies){if(e.dead||e.boss||e.mbPart||e.mbOf||e.wbUnit)continue;if(Math.hypot(e.x-c.wx,e.y-c.wy)<R+e.r*.5){e.wkTaunt=gameTime+.5;e.wkTauntBy=c;}}}}

/* ---------------------------------------------------------------------
   6. VISUALS (code VFX — the owner's painted effects / clips can replace them later)
   --------------------------------------------------------------------- */
function gGlow(x,y,r,col,a){if(!(a>0)||!(r>0))return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
/* one particle pool: golden hairs (curved strands, never round dots), short sparks, dust, water drops, flame tongues */
class WkBits{constructor(){this.t=0;this.layer='top';this.p=[];}
  add(o){if(this.p.length>360)this.p.shift();this.p.push(Object.assign({t:0,life:.8,z:0,vx:0,vy:0,vz:0,g:0,drag:1.6,s:1,rot:rnd(0,TAU),vr:rnd(-5,5),col:WKC.gold},o));}
  update(dt){this.t+=dt;const L=this.p;for(let i=L.length-1;i>=0;i--){const q=L[i];q.t+=dt;if(q.t>=q.life){L.splice(i,1);continue;}const f=Math.max(0,1-q.drag*dt);q.vx*=f;q.vy*=f;q.vz=q.vz*f-q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z=Math.max(0,q.z+q.vz*dt);q.rot+=q.vr*dt;}return CHAR==='wukong';}
  draw(){if(!this.p.length)return;ctx.save();for(const q of this.p){const k=q.t/q.life,a=Math.min(1,(1-k)*1.6)*(q.a??1),[x,y]=P(q.x,q.y,q.z);if(a<=.01)continue;
    if(q.kind==='hair'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;ctx.save();ctx.translate(x,y);ctx.rotate(q.rot);const L=7*q.s;ctx.lineCap='round';
      ctx.strokeStyle='#8a5a10';ctx.lineWidth=2.4*q.s;ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(0,-L*.55,L,0);ctx.stroke();ctx.strokeStyle=q.col;ctx.lineWidth=1.3*q.s;ctx.stroke();ctx.restore();
      if(q.glow!==0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.35;ctx.fillStyle=WKC.gold2;ctx.beginPath();ctx.arc(x,y,2.2*q.s,0,TAU);ctx.fill();}}
    else if(q.kind==='spark'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.strokeStyle=q.col;ctx.lineWidth=2*q.s;ctx.lineCap='round';const [x2,y2]=P(q.x-q.vx*.035,q.y-q.vy*.035,q.z-q.vz*.035);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
    else if(q.kind==='dust'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a*.42;const r=(5+k*14)*q.s;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(q.col,.9));g.addColorStop(1,hexA(q.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*.75,0,0,TAU);ctx.fill();}
    else if(q.kind==='drop'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a*.9;ctx.fillStyle=q.col;ctx.beginPath();ctx.ellipse(x,y,1.8*q.s,2.8*q.s,0,0,TAU);ctx.fill();}
    else if(q.kind==='flame'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.8;const h=(10+12*(1-k))*q.s,w=5*q.s*(1-k*.5);ctx.fillStyle=hexA(q.col,.85);ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*.4,y-h*.6,x+Math.sin(q.rot)*3,y-h);ctx.quadraticCurveTo(x+w*.4,y-h*.6,x+w,y);ctx.closePath();ctx.fill();}}
  ctx.restore();}}
const gBits=()=>WK._v&&WK._v.b;
function hairPuff(x,y,z,n,col){const b=gBits();if(!b)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),v=rnd(30,110);b.add({kind:'hair',x:x+rnd(-6,6),y:y+rnd(-4,4),z:z+rnd(-8,10),vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(10,70),g:60,drag:2.2,life:rnd(.6,1.1),s:rnd(.8,1.25),col:col||(Math.random()<.3?WKC.gold2:WKC.gold)});}
  for(let i=0;i<Math.ceil(n/3);i++)b.add({kind:'dust',x:x+rnd(-8,8),y:y+rnd(-5,5),z:z*.5,vx:rnd(-20,20),vy:rnd(-15,15),vz:rnd(5,20),life:rnd(.35,.6),s:.8,col:'#fff1c4'});}
function gSparks(x,y,z,n,col,spd=220){const b=gBits();if(!b)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),v=rnd(.4,1)*spd;b.add({kind:'spark',x,y,z,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(-40,120),g:200,drag:3,life:rnd(.18,.32),s:rnd(.8,1.2),col:col||WKC.gold2});}}
function gDust(x,y,n,col='#c8b89a',spd=60){const b=gBits();if(!b)return;for(let i=0;i<n;i++){const an=rnd(0,TAU),v=rnd(.3,1)*spd;b.add({kind:'dust',x:x+rnd(-8,8),y:y+rnd(-5,5),z:rnd(0,6),vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(8,30),drag:2.4,life:rnd(.45,.8),s:rnd(1,1.5),col});}}
/* hit flash: a four-point star + glow on the target's body */
class WkFlash{constructor(o){Object.assign(this,{t:0,life:.16,layer:'top',z:26,r:20,col:WKC.gold2},o);this.an=rnd(0,TAU);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),r=this.r*(.5+k*.8),a=1-k;gGlow(x,y,r*1.6,this.col,.55*a);ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.an);ctx.fillStyle=hexA('#ffffff',.9*a);
    ctx.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.18:r,an=i/8*TAU;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr*.8);}ctx.closePath();ctx.fill();ctx.restore();}}
function flashAt(e,big,col){if(!e)return;const z=(e.boss?40:26)+(e.z||0);addFx(new WkFlash({x:e.x,y:e.y,z,r:big?34:20,col:col||WKC.gold2}));gSparks(e.x,e.y,z,big?7:3,col);}
const cloneSpark=(e,c)=>{if(Math.random()<.6)addFx(new WkFlash({x:e.x+rnd(-6,6),y:e.y+rnd(-4,4),z:22+(e.z||0),r:12,col:FCOL[c.form]||WKC.gold,life:.12}));};
/* a staff swing crescent on the ground plane at weapon height */
class WkArc{constructor(o){Object.assign(this,{t:0,life:.17,layer:'top',R:50,span:2.1,z:24,col:WKC.gold,w:13,dir:1},o);this.__gt=this.__gt||'-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),sw=Math.min(1,k*2.4),a=k<.45?1:Math.max(0,1-(k-.45)/.55);ctx.save();ctx.translate(x,y);ctx.scale(1,.62);ctx.globalCompositeOperation='lighter';
    const a0=this.phi-this.span/2*this.dir,a1=a0+this.span*sw*this.dir,tail=a0+this.span*Math.max(0,sw-.55)*this.dir,R=this.R,w=this.w*(1-k*.5);
    for(const [ww,al,c] of [[w*1.9,.22,this.col],[w,.55,this.col],[w*.35,.9,'#ffffff']]){ctx.strokeStyle=hexA(c,al*a);ctx.lineWidth=ww;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,0,R,Math.min(tail,a1),Math.max(tail,a1));ctx.stroke();}
    ctx.restore();}}
const arcAt=(x,y,phi,o={})=>addFx(new WkArc(Object.assign({x,y,phi,dir:Math.random()<.5?1:-1},o)));
/* the ringed staff stretched out (thrusts, the combo's last strike, Ruyi Rhythm): dark wood, gold bands, iron rings at the head */
function drawStaff(ax,ay,bx,by,w,a,glow,col,butt){const L=Math.hypot(bx-ax,by-ay)||1,ux=(bx-ax)/L,uy=(by-ay)/L,nx=-uy,ny=ux;ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';
  if(glow){ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(col||WKC.gold,.32*glow);ctx.lineWidth=w*3.4;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.globalCompositeOperation='source-over';}
  ctx.strokeStyle='#2a1a0e';ctx.lineWidth=w+2;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.strokeStyle=WKC.wood;ctx.lineWidth=w;ctx.stroke();
  ctx.strokeStyle='#8a6038';ctx.lineWidth=Math.max(1,w*.3);ctx.beginPath();ctx.moveTo(ax+nx*w*.2,ay+ny*w*.2);ctx.lineTo(bx+nx*w*.2,by+ny*w*.2);ctx.stroke();
  ctx.strokeStyle='#f2c542';ctx.lineWidth=w+2.5;for(const f of [.12,.5,.86]){const px=ax+(bx-ax)*f,py=ay+(by-ay)*f;ctx.beginPath();ctx.moveTo(px-ux*2,py-uy*2);ctx.lineTo(px+ux*2,py+uy*2);ctx.stroke();}
  const hx=bx+ux*w*.9,hy=by+uy*w*.9;ctx.strokeStyle=WKC.ring;ctx.lineWidth=Math.max(1.4,w*.34);for(const s of [-1,0,1]){ctx.beginPath();ctx.ellipse(hx+nx*s*w*.9,hy+ny*s*w*.9,w*.95,w*.75,Math.atan2(uy,ux),0,TAU);ctx.stroke();}
  ctx.fillStyle='#ffd65a';ctx.beginPath();ctx.arc(bx+ux*w*1.9,by+uy*w*1.9,w*.55,0,TAU);ctx.fill();
  if(butt){ctx.fillStyle='#f2c542';ctx.beginPath();ctx.ellipse(ax,ay,w*.8,w*.45,Math.atan2(uy,ux),0,TAU);ctx.fill();}ctx.restore();}
class WkStaffFx{constructor(o){Object.assign(this,{t:0,life:.26,layer:'top',w:5,ext:.06,col:WKC.gold,z0:28,z1:28},o);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t<this.ext?this.t/this.ext:1,f=this.t<this.life*.5?1:Math.max(0,1-(this.t-this.life*.5)/(this.life*.5)),[ax,ay]=P(this.x0,this.y0,this.z0),[bx,by]=P(this.x1,this.y1,this.z1);
    const ex=ax+(bx-ax)*k,ey=ay+(by-ay)*k;drawStaff(ax,ay,ex,ey,this.w,f,1,this.col);gGlow(ex,ey,this.w*5,this.col,.5*f);}}
/* a giant staff plunging from the sky onto a point (Pillar Smash, Sky-Pillar Drop, Jingu Bang): lands at T */
class WkFall{constructor(o){Object.assign(this,{t:0,layer:'top',T:.3,w:16,H:520,stay:.3,col:WKC.gold},o);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.T+this.stay;}
  draw(){const k=clamp(this.t/this.T,0,1),e=k*k,a=this.t<this.T?Math.min(1,this.t/.06):Math.max(0,1-(this.t-this.T)/this.stay),z=(1-e)*this.H,[bx,by]=P(this.x,this.y,z),[tx,ty]=P(this.x,this.y,z+this.H*1.4);
    if(this.t<this.T){ctx.save();ctx.translate(...P(this.x,this.y,0));ctx.scale(1,.62);ctx.globalCompositeOperation='lighter';const r=this.w*(1.6+2.4*e);const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,hexA(this.col,.45*e));g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
    drawStaff(bx,by,tx,ty,this.w,a,1.2,this.col,1);}}
/* ground crack star after a slam */
class WkCrack{constructor(o){Object.assign(this,{t:0,life:.9,layer:'ground',R:70,n:7},o);this.rays=[];for(let i=0;i<this.n;i++){const an=i/this.n*TAU+rnd(-.25,.25),L=this.R*rnd(.55,1),pts=[[0,0]];let px=0,py=0;for(let j=1;j<=4;j++){const r=L*j/4,a2=an+rnd(-.22,.22);px=Math.cos(a2)*r;py=Math.sin(a2)*r;pts.push([px,py]);}this.rays.push(pts);}this.__gt='-';}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=k<.25?1:1-(k-.25)/.75,[x,y]=P(this.x,this.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,.62);ctx.lineCap='round';ctx.lineJoin='round';
    for(const [w,c,al] of [[4.2,'#2a1c10',.55],[1.6,'#ffcf6a',.8]]){ctx.strokeStyle=hexA(c,al*a);ctx.lineWidth=w;for(const R of this.rays){ctx.beginPath();R.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.stroke();}}
    ctx.restore();}}
function gSlam(x,y,R,o={}){addFx(new GRing({x,y,r0:8,r1:R+20,w:o.w||9,color:o.col||WKC.gold,life:.34}));addFx(new WkCrack({x,y,R:R*.9}));gDust(x,y,o.dust||10,'#c9b994',R*1.4);gSparks(x,y,10,o.sp||6,WKC.gold2,260);}
/* a spinning golden whirl ring round a point (Staff Whirlwind, the storm) */
class WkWhirl{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',R:90,z:18,col:WKC.gold,spin:1},o);this.__gt='-';}update(dt){this.t+=dt;if(this.follow){this.x=this.follow.wx??this.follow.x;this.y=this.follow.wy??this.follow.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,a=k<.7?1:1-(k-.7)/.3,[x,y]=P(this.x,this.y,this.z);ctx.save();ctx.translate(x,y);ctx.scale(1,.55);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';const r0=this.t*14*this.spin;
    for(let i=0;i<3;i++){const st=r0+i*TAU/3,R=this.R*(.55+.45*Math.min(1,k*3));for(const [w,al,c] of [[10,.2,this.col],[4.5,.6,this.col],[1.6,.9,'#ffffff']]){ctx.strokeStyle=hexA(c,al*a);ctx.lineWidth=w;ctx.beginPath();ctx.arc(0,0,R,st,st+1.4);ctx.stroke();}}
    ctx.restore();}}
/* soft cloud puffs (Somersault Cloud under the feet, the giant's cloud) */
function cloudBlob(x,y,s,a){ctx.save();ctx.globalAlpha=a;for(const [dx,dy,r] of [[-14,2,9],[-4,-4,12],[9,-1,10],[17,4,7],[2,5,10]]){const g=ctx.createRadialGradient(x+dx*s,y+dy*s,0,x+dx*s,y+dy*s,r*s);g.addColorStop(0,'#ffffff');g.addColorStop(.7,'#eef4ff');g.addColorStop(1,hexA('#d8e4ff',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();}
  ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(WKC.gold,.5*a);ctx.lineWidth=1.4*s;ctx.beginPath();ctx.arc(x-4*s,y-4*s,12*s,-2.6,-.6);ctx.stroke();ctx.restore();}
class WkCloud{constructor(o){Object.assign(this,{t:0,life:.6,layer:'top',s:1.6},o);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const x0=this.follow?player.x:this.x,y0=this.follow?player.y:this.y,z0=this.follow?(player.z||0):(this.z||0),k=this.t/this.life,a=this.follow?Math.min(1,this.t/.08):1-k,[x,y]=P(x0,y0,z0-2);cloudBlob(x,y+6,this.s*(1+(this.follow?0:k*.5)),a*.92);}}
/* a momentary golden hair clone (A autospells, Hair Clone, Equal to Heaven): appears, strikes on its frame, bursts into hairs */
class WkMom{constructor(o){Object.assign(this,{t:0,layer:'sorted',T:.42,sc:.86,z:0,face:0,form:'none',hitAt:.12},o);this.__gt='-';}
  get sy(){return this.y-.4;}
  update(dt){this.t+=dt;if(!this._p&&this.t>this.T-.07){this._p=1;hairPuff(this.x,this.y,26*this.sc+this.z,this.sc>1.3?16:7);}return this.t<this.T;}
  draw(){const al=Math.min(1,this.t/.05)*Math.min(1,(this.T-this.t)/.1);if(al<=0)return;const d=atkDir(dirOf(this.face)),n=durs('attack',d).length,ct=CT(d);
    const f=this.t<this.hitAt?clamp(ct-3+Math.floor(this.t/this.hitAt*3),0,n-1):clamp(ct+Math.floor((this.t-this.hitAt)/.07),0,n-1),fr={st:'attack',d,f},[x,y]=P(this.x,this.y,this.z);
    const S=this.sc*CHAR_SCALE;try{if(curMap&&!this.z)castShadow(fr,x,y);ctx.save();ctx.translate(x,y);ctx.scale(S,S);drawFrame(fr,0,0,.9*al,null,gradedFrame(fr,FLT[this.form]||FLT.none));
      ctx.globalCompositeOperation='lighter';drawFrame(fr,0,0,.22*al,null,tinted(fr,FCOL[this.form]||WKC.gold));ctx.restore();}catch(_){ctx.restore();}
    if(this.six){for(const s of [-1,1]){try{ctx.save();ctx.translate(x+s*16*S,y-4);ctx.scale(S*.82,S*.82);drawFrame(fr,0,0,.42*al,null,gradedFrame(fr,FLT.none));ctx.restore();}catch(_){ctx.restore();}}}}}
const mom=o=>addFx(new WkMom(o));
/* where an A clone stands: behind the target (away from us) or, for the ult's pair, in front at the side */
function behindPt(t,front){const ph=Math.atan2(t.y-player.y,t.x-player.x),a=front?ph+Math.PI+(Math.random()<.5?.9:-.9):ph,x=t.x+Math.cos(a)*(t.r+30),y=t.y+Math.sin(a)*(t.r+30);return [x,y,Math.atan2(t.y-y,t.x-x)];}
/* a persistent swarm clone (B): follows, fights the nearest enemy, copies our swings, takes blows for us */
class WkMonkey{constructor(o){Object.assign(this,{t:0,layer:'sorted',wx:player.x,wy:player.y,z:0,face:player.phi,form:'none',wind:0,tmp:0,slot:0,atkT:-9,hurtT:-9,flash:0,gone:0,fade:1,mv:0,born:gameTime},o);this.__gt='-';}
  get sy(){return this.wy-.3;}
  spot(){const M=WK.mob&&WK.mob.until>gameTime&&WK.mob.e&&!WK.mob.e.dead?WK.mob.e:null;
    if(M){const a=this.slot*2.39+this.t*.6;return [M.x+Math.cos(a)*M.r*.55,M.y+Math.sin(a)*M.r*.35,20+Math.sin(this.t*9+this.slot)*3];}
    if(this.storm){const a=this.orb+this.t*4.2,r=74+Math.sin(this.t*3+this.orb)*16;return [player.x+Math.cos(a)*r,player.y+Math.sin(a)*r*.8,0];}
    if(this.tmp&&this.ax!=null)return [this.ax,this.ay,0];
    const e=this.tgt&&!this.tgt.dead?this.tgt:null;
    if(e){const n=Math.max(1,liveClones().length),a=Math.atan2(player.y-e.y,player.x-e.x)+((this.slot%n)-(n-1)/2)*.62+(this.form==='hornet'?Math.sin(this.t*3)*.5:0),r=e.r+(this.form==='hornet'?14:24);return [e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,this.form==='hornet'?26:0];}
    const L=liveClones(),i=Math.max(0,L.indexOf(this)),n=L.length,a=player.phi+Math.PI+(i-(n-1)/2)*.55,r=48+(i%2)*18;return [player.x+Math.cos(a)*r,player.y+Math.sin(a)*r,this.form==='hornet'?24:0];}
  update(dt){this.t+=dt;this.flash=Math.max(0,this.flash-dt*5);if(CHAR!=='wukong')return false;
    if(this.gone){this.fade-=dt*4;return this.fade>0;}
    if(this.tmp?gameTime>this.until:(gameTime>this.until&&!(WK.ultB>gameTime))){popClone(this,'time');return true;}
    if(!this.tgt||this.tgt.dead||(this.t%0.5<dt))this.tgt=cloneTgt(this,player.attackTarget||WK.lastTgt);
    let [tx,ty,tz]=this.spot();
    if(this.jump){const J=this.jump,k=clamp((gameTime-J.t0)/J.T,0,1);this.wx=lerp(J.x0,J.x1,k);this.wy=lerp(J.y0,J.y1,k);this.z=Math.sin(Math.PI*k)*J.h;if(k>=1)this.jump=null;this.mv=1;return true;}
    const d=Math.hypot(tx-this.wx,ty-this.wy),sp=(this.form==='stone'?210:this.form==='hornet'?360:290)*(this.tmp?1.6:1);
    if(d>560){this.wx=tx;this.wy=ty;hairPuff(tx,ty,20,5);}else if(d>2){const s=Math.min(d,sp*dt);this.wx+=(tx-this.wx)/d*s;this.wy+=(ty-this.wy)/d*s;}
    this.mv=d>6?1:0;this.z+=((tz||0)-this.z)*Math.min(1,dt*8);
    if(this.tgt&&!this.tgt.dead&&gameTime-this.atkT>.3)this.face=Math.atan2(this.tgt.y-this.wy,this.tgt.x-this.wx);else if(this.mv&&d>2)this.face=Math.atan2(ty-this.wy,tx-this.wx);
    return true;}
  frame(){const d0=dirOf(this.face);
    if(this.jump||gameTime-this.atkT<.28){const d=atkDir(d0),n=durs('attack',d).length,ct=CT(d),k=this.jump?.5:clamp((gameTime-this.atkT)/.28,0,1);return {st:'attack',d,f:clamp(ct-2+Math.floor(k*4),0,n-1)};}
    const st=this.mv?'walk':'idle',D_=durs(st,d0),T=D_.reduce((a,b)=>a+b,0)||1;let ms=((this.t+this.slot*.37)*1000*(this.mv?1.3:1))%T,f=0;while(f<D_.length-1&&ms>=D_[f]){ms-=D_[f];f++;}return {st,d:d0,f};}
  draw(){const al=this.gone?Math.max(0,this.fade):Math.min(1,(gameTime-this.born)/.12)*(this.wind||this.tmp?.55:.9);if(al<=.01)return;
    const fr=this.frame(),form=this.wind?'wind':this.form,sc=(this.form==='hornet'?.56:this.form==='stone'?.84:this.form==='tiger'?.8:.74)*(this.tmp?.9:1)*CHAR_SCALE,[x,y]=P(this.wx,this.wy,this.z);
    try{if(curMap&&this.z<4&&!this.wind)castShadow(fr,x,y);ctx.save();ctx.translate(x,y+(this.form==='hornet'?Math.sin(this.t*30)*1.2:0));ctx.scale(sc,sc);
      drawFrame(fr,0,0,al,null,gradedFrame(fr,FLT[form]||FLT.none));ctx.globalCompositeOperation='lighter';drawFrame(fr,0,0,(.16+.1*this.flash+.05*Math.sin(this.t*4+this.slot))*al,null,tinted(fr,FCOL[form]||WKC.gold));ctx.restore();}catch(_){ctx.restore();}
    if(this.form==='hornet'&&!this.gone){ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=hexA('#ffffff',.35*al);for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(x+s*9,y-30*sc,7,3.5,s*(.5+Math.sin(this.t*40)*.4),0,TAU);ctx.fill();}ctx.restore();}
    if(this.form==='tiger'&&!this.gone){ctx.save();ctx.strokeStyle=hexA('#3a1a06',.55*al);ctx.lineWidth=2;for(const s of [-1,0,1]){ctx.beginPath();ctx.moveTo(x+s*7-4,y-48*sc);ctx.lineTo(x+s*7+3,y-38*sc);ctx.stroke();}ctx.restore();}
    if(!this.wind&&!this.tmp&&!this.gone&&gOn('gbDecoy')&&this.hits<cloneHits(this)){const [hx,hy]=P(this.wx,this.wy,this.z+70*sc);ctx.save();ctx.fillStyle='rgba(20,12,4,.55)';ctx.fillRect(hx-9,hy,18,3);ctx.fillStyle=WKC.gold;ctx.fillRect(hx-9,hy,18*Math.max(0,this.hits)/cloneHits(this),3);ctx.restore();}}}
/* the vessel's giant Wukong spirit behind the hero (both ultimates, the Furnace) */
class WkGiant{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:10,sc:2.3},o);this.__gt='-';}get sy(){return player.y-8;}update(dt){this.t+=dt;return this.t<this.life&&CHAR==='wukong';}
  draw(){const k=this.t/this.life,a=Math.min(1,this.t/.4)*Math.min(1,(this.life-this.t)/.6)*(.26+.06*Math.sin(this.t*3)),fr=playerFrame(),[x,y]=P(player.x-Math.cos(player.phi)*26,player.y-Math.sin(player.phi)*20-6,8+Math.sin(this.t*1.7)*4);
    try{ctx.save();ctx.translate(x,y);ctx.scale(this.sc*CHAR_SCALE,this.sc*CHAR_SCALE);ctx.globalCompositeOperation='lighter';drawFrame(fr,0,0,a,null,tinted(fr,WKC.gold));drawFrame(fr,0,0,a*.6,null,gradedFrame(fr,FLT.giant));ctx.restore();}catch(_){ctx.restore();}}}
/* furnace flames round the hero */
class WkFlames{constructor(o){Object.assign(this,{t:0,layer:'top',life:15},o);this.__gt='-';}update(dt){this.t+=dt;const b=gBits();if(b&&Math.random()<dt*40){const an=rnd(0,TAU),r=rnd(10,26);b.add({kind:'flame',x:player.x+Math.cos(an)*r,y:player.y+Math.sin(an)*r*.6,z:rnd(0,40),vz:rnd(30,70),drag:1,life:rnd(.4,.7),s:rnd(.8,1.4),col:Math.random()<.5?WKC.fire:WKC.gold});}return this.t<this.life&&CHAR==='wukong';}
  draw(){const [x,y]=P(player.x,player.y,30);gGlow(x,y,60,WKC.fire,.22*Math.min(1,this.t/.3)*Math.min(1,(this.life-this.t)/.5));}}
/* Water Curtain Cave: misty pool + falling curtain on the far rim */
class WkCave{constructor(o){Object.assign(this,{t:0,layer:'ground'},o);this.__gt='-';}update(dt){this.t+=dt;const C=WK.cave;return !!C&&C.until>gameTime&&CHAR==='wukong';}
  draw(){const C=WK.cave;if(!C)return;const left=C.until-gameTime,a=Math.min(1,this.t/.3)*Math.min(1,left/.5),R=WKS.gbCave.R,[x,y]=P(C.x,C.y,0);ctx.save();ctx.translate(x,y);ctx.scale(1,.62);
    const g=ctx.createRadialGradient(0,0,R*.2,0,0,R);g.addColorStop(0,hexA('#bfe8ff',.18*a));g.addColorStop(.8,hexA(WKC.water,.22*a));g.addColorStop(1,hexA(WKC.water,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.strokeStyle=hexA('#e6f7ff',.5*a);ctx.lineWidth=2;for(let i=0;i<3;i++){const r=((this.t*40+i*R/3)%R);ctx.globalAlpha=1-r/R;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}ctx.restore();}}
class WkCaveTop{constructor(){this.t=0;this.layer='top';this.__gt='-';}update(dt){this.t+=dt;const C=WK.cave;return !!C&&C.until>gameTime&&CHAR==='wukong';}
  draw(){const C=WK.cave;if(!C)return;const a=Math.min(1,this.t/.3)*Math.min(1,(C.until-gameTime)/.5),R=WKS.gbCave.R;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<22;i++){const an=Math.PI+.15+i/21*(Math.PI-.3),x=C.x+Math.cos(an)*R,y=C.y+Math.sin(an)*R,[sx,sy]=P(x,y,0),[tx,ty]=P(x,y,120+Math.sin(i*1.7)*16),off=((this.t*260+i*37)%120);
      const gr=ctx.createLinearGradient(tx,ty,sx,sy);gr.addColorStop(0,hexA('#ffffff',0));gr.addColorStop(.3,hexA('#d8f2ff',.32*a));gr.addColorStop(1,hexA(WKC.water,.12*a));ctx.strokeStyle=gr;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(sx,sy);ctx.stroke();
      ctx.fillStyle=hexA('#ffffff',.5*a);ctx.fillRect(tx-1,ty+off,2,9);}
    ctx.restore();}}
/* over the head: Rampage pips, the Substitute's waiting clone mark, the Eyes' red X on a boss's fake */
class WkTop{constructor(){this.t=0;this.layer='top';this.__gt='-';}update(dt){this.t+=dt;WK.rpPop=Math.max(0,WK.rpPop-dt*4);return CHAR==='wukong';}
  draw(){const cap=rpCap();if(cap&&!aRest()&&(WK.rp>0||rpLock())){const [x,y]=P(player.x,player.y,(player.z||0)+84),n=cap,full=WK.rp>=cap;
      for(let i=0;i<n;i++){const a=-Math.PI*.82+i/(n-1)*Math.PI*.64,px=x+Math.cos(a)*30,py=y+Math.sin(a)*12+8,on=i<Math.floor(WK.rp);ctx.save();ctx.translate(px,py);ctx.rotate(Math.PI/4);
        ctx.fillStyle=on?(full?'#ff7a3a':WKC.gold):'rgba(30,20,8,.55)';ctx.strokeStyle=on?'#fff3c0':'rgba(255,220,140,.4)';ctx.lineWidth=1;const s=on&&i===Math.floor(WK.rp)-1?3.4+WK.rpPop*2:3;ctx.fillRect(-s,-s,s*2,s*2);ctx.strokeRect(-s,-s,s*2,s*2);ctx.restore();}
      if(full)gGlow(x,y+4,30,'#ff8a3a',.18+.08*Math.sin(this.t*8));}
    if(WK.subUntil>gameTime){const [x,y]=P(player.x+18,player.y+6,0),a=Math.min(1,(WK.subUntil-gameTime)/.3);gGlow(x,y-28,26,WKC.gold,.3*a);}
    for(const e of enemies){if(e.dead||!e._wkFake)continue;const h=(typeof MSPR_H==='function'?MSPR_H(e):(e.h||60))*.6,[x,y]=P(e.x,e.y,h);ctx.save();ctx.strokeStyle='#ff3a2a';ctx.lineWidth=5;ctx.lineCap='round';ctx.shadowColor='#ffb000';ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(x-14,y-14);ctx.lineTo(x+14,y+14);ctx.moveTo(x+14,y-14);ctx.lineTo(x-14,y+14);ctx.stroke();ctx.restore();}}}
function peachPop(h){addFx(new DText({x:player.x,y:player.y,z:84,text:'+'+h,color:'#9dff8a',size:11,life:.7}));}
function stingFx(c,q){const b=gBits();if(!b)return;b.add({kind:'spark',x:q.x,y:q.y,z:30,vx:(q.x-c.wx)*2,vy:(q.y-c.wy)*2,vz:0,drag:6,life:.15,col:WKC.hornet});}

/* ---------------------------------------------------------------------
   7. AUTOSPELLS (what the hair clones do)
   --------------------------------------------------------------------- */
function gQuake(t,m,key){for(const e of gNear(t.x,t.y,WKS.gaTreasure.R))if(e!==t)gAuto(e,m,key);addFx(new GRing({x:t.x,y:t.y,r0:6,r1:WKS.gaTreasure.R+24,w:10,color:WKC.amber,life:.4}));gDust(t.x,t.y,8);shake(1.8);}
const AUTO_FIRE={
  /* Hair Clone: one clone at the target's side strikes once */
  gnHair(t){const ph=angTo(t),s=(WK.hs=-(WK.hs||1)),a=ph+Math.PI/2*s,x=t.x+Math.cos(a)*(t.r+24),y=t.y+Math.sin(a)*(t.r+24),f=Math.atan2(t.y-y,t.x-x);mom({x,y,face:f});
    setFxTimer(.12,()=>{if(t.dead)return;gAuto(t,gLv(WKS.gnHair.dmg,'gnHair'),'gnHair');arcAt(x,y,f,{R:40});flashAt(t,0);});},
  /* Ruyi Rhythm: behind the target, a staff thrust that stretches through it toward us (everyone on the line) */
  gaRhythm(t,o){const [bx,by,bf]=behindPt(t,o.front),six=gOn('gxSix'),n=six?WKS.gxSix.n:1,m=(six?WKS.gxSix.dmg:gLv(WKS.gaRhythm.dmg,'gaRhythm'))*(o.giant?2:1);
    mom({x:bx,y:by,face:bf,sc:o.giant?1.55:.86,six,T:.38+n*.07});
    for(let i=0;i<n;i++)setFxTimer(.12+i*.07,()=>{if(t.dead&&i>0)return;const ph=bf+(n>1?(i-1)*.16:0),L=Math.max(t.r+70,Math.hypot(player.x-bx,player.y-by)-26),ex=bx+Math.cos(ph)*L,ey=by+Math.sin(ph)*L;
      addFx(new WkStaffFx({x0:bx,y0:by,x1:ex,y1:ey,w:o.giant?9:5}));for(const e of gSeg(bx,by,ex,ey,WKS.gaRhythm.w))gAuto(e,e===t?m:m*WKS.gaRhythm.side,'gaRhythm',{big:e===t});flashAt(t,o.giant);shake(.6);});
    if(o.giant)setFxTimer(.14,()=>gQuake(t,m*.5,'gaRhythm'));},
  /* Thousand Staves: 3 (5) clones round the target strike together */
  gaThousand(t,o){const n=gOn('gxSky')?WKS.gxSky.n:WKS.gaThousand.n,m=gLv(WKS.gaThousand.dmg,'gaThousand')*(o.giant?2:1),a0=rnd(0,TAU),R=t.r+30;
    for(let i=0;i<n;i++){const a=a0+i/n*TAU,x=t.x+Math.cos(a)*R,y=t.y+Math.sin(a)*R,f=a+Math.PI;mom({x,y,face:f,sc:o.giant?1.3:.82,T:.46});
      setFxTimer(.13+i*.025,()=>{if(t.dead)return;gAuto(t,m,'gaThousand',{big:i===0});arcAt(x,y,f,{R:38,life:.15});if(i%2===0)flashAt(t,o.giant);});}
    shake(1);if(o.giant)setFxTimer(.18,()=>gQuake(t,m*.5,'gaThousand'));},
  /* Sky-Pillar Drop: the giant spirit on a cloud plunges the staff through the sky into the target */
  gaPillar(t,o){const x=t.x,y=t.y,m=gLv(WKS.gaPillar.dmg,'gaPillar')*(o.giant?2:1),R=WKS.gaPillar.R*(o.giant?1.3:1),T=.34;
    mom({x:x-30,y:y-24,z:150,face:Math.atan2(24,30),sc:1.9,form:'giant',T:.75,hitAt:T});addFx(new WkCloud({x:x-30,y:y-24,life:.75,s:3.2,follow:0,z:150}));
    addFx(new WkFall({x,y,T,w:o.giant?22:16}));
    setFxTimer(T,()=>{for(const e of gNear(x,y,R))gAuto(e,e===t?m:m*WKS.gaPillar.side,'gaPillar',{big:e===t});gSlam(x,y,R,{w:11,dust:14,sp:10});addFx(new DText({x,y,z:110,text:o.giant?'GIANT':'',color:WKC.gold,size:14,life:.6}));shake(o.giant?3.6:2.6);stop(50);});},
  /* Monkey Pile-On: every clone jumps on the target and slams (≤ 6 count) */
  gbPile(t){const L=liveClones(),m=gLv(WKS.gbPile.dmg,'gbPile'),R=WKS.gbPile.R;let n=0;
    for(const c of L){const a=rnd(0,TAU),r=rnd(4,t.r*.6);c.jump={x0:c.wx,y0:c.wy,x1:t.x+Math.cos(a)*r,y1:t.y+Math.sin(a)*r,t0:gameTime,T:.3,h:70};c.atkT=gameTime+.2;if(!c.wind&&n<WK_BAL.swarm.count)n++;}
    setFxTimer(.32,()=>{for(let i=0;i<n;i++)for(const e of gNear(t.x,t.y,R))gAuto(e,m,'gbPile',{big:i===0&&e===t});gSlam(t.x,t.y,R,{dust:8+n*2});shake(1+n*.3);stop(30);});},
  /* Staff Whirlwind: we and every clone spin at once */
  gbWhirl(t){const me=gLv(WKS.gbWhirl.me,'gbWhirl'),ea=gLv(WKS.gbWhirl.each,'gbWhirl');addFx(new WkWhirl({x:player.x,y:player.y,R:WKS.gbWhirl.R,follow:player,life:.42}));
    for(const e of gNear(player.x,player.y,WKS.gbWhirl.R))gAuto(e,me,'gbWhirl');let n=0;
    for(const c of liveClones()){addFx(new WkWhirl({x:c.wx,y:c.wy,R:WKS.gbWhirl.Rc,follow:c,life:.36,col:FCOL[c.wind?'wind':c.form]||WKC.gold}));c.atkT=gameTime;
      if(c.wind||n>=WK_BAL.swarm.count)continue;n++;for(const e of gNear(c.wx,c.wy,WKS.gbWhirl.Rc))gAuto(e,ea,'gbWhirl');}
    shake(1.2);},
  /* Thousand-Monkey Barrage: 6 short-lived clones appear and the whole swarm rains 12 blows round the target */
  gbBarrage(t){const x=t.x,y=t.y,R=WKS.gbBarrage.R,m=gLv(WKS.gbBarrage.dmg,'gbBarrage');
    for(let i=0;i<WKS.gbBarrage.temp;i++){const a=i/WKS.gbBarrage.temp*TAU,c=spawnClone(x+Math.cos(a)*(R*.75),y+Math.sin(a)*(R*.75),{tmp:1,life:1.5,quiet:1});c.ax=c.wx;c.ay=c.wy;c.face=a+Math.PI;}
    for(let i=0;i<WKS.gbBarrage.n;i++)setFxTimer(.08+i*WKS.gbBarrage.gap,()=>{for(const e of gNear(x,y,R))gAuto(e,m,'gbBarrage');const a=rnd(0,TAU);arcAt(x+Math.cos(a)*R*.4,y+Math.sin(a)*R*.4,a+Math.PI,{R:36,life:.13});
      for(const c of WK.swarm)if(c.tmp&&!c.gone)c.atkT=gameTime;if(i%3===0)shake(.8);});}
};

/* ---------------------------------------------------------------------
   8. THE CORE (per frame) — layer 'none', kept by enterMap and the bench
   --------------------------------------------------------------------- */
function gEnsureVis(){const C=WK._v||(WK._v={});for(const [k,Q] of [['b',WkBits],['o',WkTop]])if(!C[k]||!fx.includes(C[k])){const o=new Q();o.__gt='-';o._sk=null;C[k]=addFx(o);}
  for(const c of WK.swarm)if(!c.gone&&!fx.includes(c)){c._sk=null;fx.push(c);}}
function gStatusIcons(){const b=player.buffs;if(!b)return;const cap=rpCap(),n=liveClones().length;
  if(cap&&!aRest()&&WK.rp>0){b.wkRp=b.wkRp||{t:1e9,total:1e9};b.wkRp.t=1e9;b.wkRp.lbl=Math.floor(WK.rp)+'/'+cap;}else delete b.wkRp;
  if(n>0){b.wkSw=b.wkSw||{t:1e9,total:1e9};b.wkSw.t=1e9;b.wkSw.lbl=realClones().length+'/'+maxClones();}else delete b.wkSw;
  if(gOn('gbForm')&&WK.form!=='none'&&n>0){b.wkForm=b.wkForm||{t:1e9,total:1e9};b.wkForm.t=1e9;b.wkForm.lbl={tiger:'เสือ',hornet:'ผึ้ง',stone:'หิน'}[WK.form];}else delete b.wkForm;
  if(gOn('gaShift')){b.wkShift=b.wkShift||{t:1e9,total:1e9};b.wkShift.t=1e9;b.wkShift.lbl=WK.shift==='long'?'ยาว':'สั้น';}else delete b.wkShift;}
class WkCore{constructor(){this.t=0;this.layer='none';this.tk=0;this.sk=0;this.ui=0;}draw(){}
  update(dt){this.t+=dt;gEnsureVis();
    /* a new map: the swarm, the cave, the mob and Rampage's target stay behind */
    if(this.map!==curMap){if(this.map!==undefined){for(const c of WK.swarm)c.gone=1;WK.swarm.length=0;Object.assign(WK,{cave:null,mob:null,storm:null,rpE:null,lastTgt:null});}this.map=curMap;}
    WK.swarm=WK.swarm.filter(c=>!(c.gone&&c.fade<=0)&&(fx.includes(c)||!c.gone));
    gAutoTick();
    /* Rampage: full and locked during the ult / Equal to Heaven, else it fades 2 a second after 2.5 s without a landed swing */
    const cap=rpCap();if(cap){if(rpLock())WK.rp=cap;else if(gameTime-WK.rpT>WK_BAL.rp.delay)WK.rp=Math.max(0,WK.rp-WK_BAL.rp.decay*dt);if(WK.rp>cap)WK.rp=cap;}else WK.rp=0;
    if((this.tk-=dt)<=0){this.tk=.1;decoyTick();
      /* Water Curtain Cave + Monkey Mob slow what they hold */
      const C=WK.cave;if(C){if(C.until<gameTime)WK.cave=null;else for(const e of gNear(C.x,C.y,WKS.gbCave.R))applyCC(e,{slow:WKS.gbCave.slow*(e.boss?.5:1)});}
      const M=WK.mob;if(M){if(M.until<gameTime||M.e.dead)WK.mob=null;else applyCC(M.e,{slow:M.e.boss?.4:WKS.gbMob.slow});}
      eyesTick();}
    /* ultimates end */
    if(WK.ultAOn&&WK.ultA<=gameTime){WK.ultAOn=0;if(gOn('gaEqual'))equalToHeaven();}
    if(WK.ultBOn&&WK.ultB<=gameTime){WK.ultBOn=0;armyEnds();}
    /* Storm of Ten Thousand Monkeys */
    const S=WK.storm;if(S){if(S.until<gameTime){WK.storm=null;for(const c of WK.swarm)if(c.tmp&&c.storm)popClone(c);}else if((S.tk+=dt)>=WKS.gxStorm.tick){S.tk-=WKS.gxStorm.tick;let half=0;
      for(const e of gNear(player.x,player.y,WKS.gxStorm.R))if(gAuto(e,WKS.gxStorm.dmg,'gxStorm')>0)half+=.5;const n=Math.min(2,half);if(n>0){addBeats(n);growBeats(n);}
      if(Math.random()<.5)addFx(new WkWhirl({x:player.x,y:player.y,R:WKS.gxStorm.R,follow:player,life:.3,col:WKC.gold2}));}}
    /* Furnace-Forged Body: burns last 2 s less */
    const bu=player.buffs&&player.buffs.dbBurn;if(bu&&gOn('gnForge')&&!bu._wk){bu._wk=1;bu.t=Math.max(.3,bu.t-WKS.gnForge.burn);}
    if((this.sk-=dt)<=0){this.sk=.25;gStatusIcons();cdSync();}
    if((this.ui-=dt)<=0){this.ui=.1;try{wkBar();}catch(_){}}
    return CHAR==='wukong';}}
let wkCore=null;
function gEnsure(){if(CHAR!=='wukong')return;if(!wkCore||!fx.includes(wkCore)){const o=fx.find(f=>f instanceof WkCore);if(o)wkCore=o;else{const c=new WkCore();c.__gt='-';c._sk=null;wkCore=addFx(c);}}gEnsureVis();}
window.gEnsure=gEnsure;
/* Fiery Golden Eyes: a boss that splits into fakes gets ONE fake crossed out per round of its mechanic (a help, not a skip) */
function eyesTick(){if(!gOn('gnEyes'))return;const by=new Map();for(const e of enemies){if(e.dead||!e.mbPart||!e.mbOf)continue;const fake=e.pkind==='copy'||(e.pkind==='piece'&&e.data&&e.data.real===false);if(!fake)continue;if(!by.has(e.mbOf))by.set(e.mbOf,[]);by.get(e.mbOf).push(e);}
  for(const [b,L] of by){if(L.some(e=>e._wkFake))continue;if(gameTime-(b._wkEyeT||-99)<6)continue;const p=L[Math.floor(Math.random()*L.length)];p._wkFake=1;b._wkEyeT=gameTime;
    addFx(new DText({x:p.x,y:p.y,z:96,text:'ร่างปลอม!',color:'#ff7a5a',size:13,life:1.4}));gSparks(p.x,p.y,40,6,'#ff7a3a');}}

/* =====================================================================
   9. SKILL ACTIONS
   ===================================================================== */
/* one strike on the attack clip: lands on its contact frame. I = action-clock seconds the strike lasts (a normal swing = one attack interval) */
function gStrike(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),n=durs('attack',d).length,from=Math.max(0,ct-(o.from??3)),to=Math.min(n-1,ct+(o.to??2));
  const s0=seq('attack',d,from,to,1),T1=seqTotal(s0),I=(o.I||((ACTION_TEMPO||.75)/swingsPS()))*(o.slow||1),s=seq('attack',d,from,to,T1/Math.max(.05,I)),kC=seqIndex(s,'attack',ct),tC=seqTimeAt(s,kC);
  return act({key:o.key,name:o.name,seq:s,windup:tC,dur:seqTotal(s),hitList:[],
    update:(a,dt)=>{player.glow={color:o.glow||WKC.gold,k:a.t<tC?(o.gk??.3):Math.max(0,(o.gk??.3)-(a.t-tC)*2)};o.update&&o.update(a,dt,tC);},
    events:[{t:tC,f:a=>o.f(a)}].concat(o.events?o.events(tC,s):[])});}
function gBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2.2,glow:o.glow||WKC.gold,events:tP=>[{t:tP,f:()=>o.f()}]});}
/* the line behind the target (the combo's last strike, the long staff): the first enemy past it within `len` */
function pierceNext(t,phi,len){const x0=t.x,y0=t.y,L=gSeg(x0,y0,x0+Math.cos(phi)*len,y0+Math.sin(phi)*len,24).filter(e=>e!==t&&((e.x-x0)*Math.cos(phi)+(e.y-y0)*Math.sin(phi))>0);
  L.sort((a,b)=>Math.hypot(a.x-x0,a.y-y0)-Math.hypot(b.x-x0,b.y-y0));return L[0]||null;}

/* ---------- normal attack: the ringed-staff combo (every landed swing = a beat) ---------- */
function mkWkBasic(tgt){gEnsure();const lv=Math.max(1,gL('gnStaff')),chain=WKS.gnStaff.chain[lv-1]+(gOn('gxStaff')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),big=last&&gOn('gxStaff'),long=gOn('gaShift')&&WK.shift==='long';
  return gStrike({key:'basic',name:big?'Ten-Thousand-Jin Staff':'Ruyi Staff '+(idx+1),phi,slow:last?1.1:1,glow:big?WKC.amber:WKC.gold,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+(long?WKS.gaShift.reach:0)+50+tgt.r)return;WK.lastCrit=0;let d=0;
    if(big){const L=WKS.gxStaff.len,ex=player.x+Math.cos(phi)*L,ey=player.y+Math.sin(phi)*L;addFx(new WkStaffFx({x0:player.x,y0:player.y,x1:ex,y1:ey,w:9,life:.32,col:WKC.amber}));
      d=gHit(tgt,WKS.gxStaff.dmg,'gxStaff',{auto:true,big:true,knock:[phi,22]});for(const e of gSeg(player.x,player.y,ex,ey,30))if(e!==tgt)gHit(e,WKS.gxStaff.dmg,'gxStaff',{auto:true});flashAt(tgt,1,WKC.amber);shake(1.6);stop(40);}
    else{arcAt(player.x,player.y,phi,{R:44+(long?16:0),span:last?2.7:2.0,w:last?17:12,col:last?WKC.amber:WKC.gold});
      d=gHit(tgt,WKS.gnStaff.hit+(long?WKS.gaShift.line:0),'basic',{auto:true,big:last});
      if(last||long){const e2=pierceNext(tgt,phi,(last?WKS.gnStaff.len:0)+(long?WKS.gaShift.reach:0));if(e2){addFx(new WkStaffFx({x0:player.x,y0:player.y,x1:e2.x,y1:e2.y,w:5,life:.2}));gHit(e2,WKS.gnStaff.hit+(long?WKS.gaShift.line:0),'basic',{auto:true});}}
      flashAt(tgt,last);shake(last?1:.45);stop(last?26:12);}
    if(d>0){const crit=WK.lastCrit,n=swingBeats(crit,big?2:1);addBeats(n);growBeats(n);rpAdd(crit?2:1,tgt);WK.lastTgt=tgt;WK.lastHitT=gameTime;}
    const as=copySwing(tgt);if(as>0){addBeats(as);growBeats(as);}
    a.hitList.push(tgt);a.hitConfirmed=true;}});}

/* ---------- BASIC ---------- */
function mkGnCloud(c){const t=gTgt(c,WKS.gnCloud.range),phi=gPhi(c,t);faceTo(phi);const sx=player.x,sy=player.y,Lm=gLv(WKS.gnCloud.dist,'gnCloud')+(gOn('gxLi')?WKS.gxLi.dist:0),
    L=t?Math.min(Lm,Math.max(0,dist(player,t)-t.r-14)):Lm,[dx,dy]=gPathEnd(sx,sy,phi,Math.max(10,L)),T=.36,s=seq('buff',player.dir,0,null,seqTotal(seq('buff',player.dir,0,null,1))/(T+.12));
  addFx(new WkCloud({follow:1,life:T+.06,s:1.7}));
  return act({key:'gnCloud',name:'Somersault Cloud',seq:s,windup:T,dur:T+.12,hitList:[],update:(a,dt)=>{dashUpd(a,dt,0,T,sx,sy,dx,dy,WKC.gold,58);player.iframes=Math.max(player.iframes||0,a.t<T?.05:0);},
    events:[{t:T,f:()=>{WK.cloudT=gameTime+WKS.gnCloud.T;addBuff('gnCloud',WKS.gnCloud.T);addFx(new WkCloud({x:player.x,y:player.y,life:.5,s:2.2}));gDust(player.x,player.y,6,'#eef4ff',70);
      if(gOn('gxLi')){addBeats(WKS.gxLi.beats);addFx(new DText({x:player.x,y:player.y,z:96,text:'+'+WKS.gxLi.beats+' จังหวะ',color:WKC.gold,size:12,life:.8}));}
      if(t&&!t.dead)player.attackTarget=t;}}]});}
function mkGnPeach(c){return gBurst({key:'gnPeach',name:'Peach of Immortality',glow:WKC.peach,f:()=>{const h=Math.round(PS.lv*gLv(WKS.gnPeach.heal,'gnPeach'));player.hp=Math.min(player.maxHp,player.hp+h);
  addFx(new DText({x:player.x,y:player.y,z:96,text:'+'+h,color:'#9dff8a',size:15,life:1}));WK.peachT=gameTime+WKS.gnPeach.T;addBuff('gnPeach',WKS.gnPeach.T);
  if(gOn('gxPeach')){WK.peachAT=gameTime+WKS.gxPeach.T;addBuff('gxPeach',WKS.gxPeach.T);}addFx(new WkPeach({}));gSparks(player.x,player.y,40,8,'#b8ff9a',160);}});}
function mkGnSub(c){return gBurst({key:'gnSub',name:'Hair Substitute',speed:2.6,glow:WKC.gold,f:()=>{WK.subUntil=gameTime+WKS.gnSub.T;addBuff('gnSub',WKS.gnSub.T);hairPuff(player.x+18,player.y+6,30,10);}});}
/* the substitute takes the blow: a clone bursts where we stood, we spring back, every autospell gets beats */
function subTakes(e){WK.subUntil=0;delete player.buffs.gnSub;const ph=e?Math.atan2(player.y-e.y,player.x-e.x):player.phi+Math.PI;mom({x:player.x,y:player.y,face:ph+Math.PI,T:.3,hitAt:.05});
  const [x,y]=gPathEnd(player.x,player.y,ph,WKS.gnSub.hop);player.x=x;player.y=y;player.iframes=Math.max(player.iframes||0,.25);const n=gLv(WKS.gnSub.beats,'gnSub');addBeats(n);
  addFx(new DText({x:player.x,y:player.y,z:92,text:'แทนตัว! +'+n+' จังหวะ',color:WKC.gold,size:13,life:1}));hairPuff(player.x,player.y,30,14);}
class WkPeach{constructor(o){Object.assign(this,{t:0,life:.8,layer:'top'},o);this.__gt='-';}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(player.x,player.y,96+k*30),a=k<.7?1:1-(k-.7)/.3,r=9*(1+Math.min(1,this.t*8)*.2);ctx.save();ctx.globalAlpha=a;const g=ctx.createRadialGradient(x-3,y-3,1,x,y,r);g.addColorStop(0,'#fff0e8');g.addColorStop(.5,'#ffb0a8');g.addColorStop(1,'#e8606a');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y-r);ctx.bezierCurveTo(x+r*1.3,y-r*.8,x+r,y+r,x,y+r);ctx.bezierCurveTo(x-r,y+r,x-r*1.3,y-r*.8,x,y-r);ctx.fill();ctx.fillStyle='#5ac46a';ctx.beginPath();ctx.ellipse(x+4,y-r,5,2.4,-.5,0,TAU);ctx.fill();ctx.restore();gGlow(x,y,24,'#ffd0c0',.3*a);}}

/* ---------- A · Havoc in Heaven ---------- */
function mkGaSmash(c){const t=gTgt(c,WKS.gaSmash.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=gLv(WKS.gaSmash.dmg,'gaSmash');
  return gStrike({key:'gaSmash',name:'Pillar Smash',phi,I:.46,from:4,to:3,glow:WKC.amber,gk:.6,events:tC=>[{t:Math.max(0,tC-.2),f:()=>{if(!t.dead)addFx(new WkFall({x:t.x,y:t.y,T:.2/(ACTION_TEMPO||.75),w:20,H:380}));}}],
    f:a=>{if(t.dead)return;gHit(t,m,'gaSmash',{big:true,knock:[phi,16]});gSlam(t.x,t.y,60,{dust:10});flashAt(t,1,WKC.amber);rpAdd(WKS.gaSmash.rp,t);WK.lastTgt=t;shake(2.4);stop(55);a.hitList.push(t);a.hitConfirmed=true;}});}
class WkNeedle{constructor(o){Object.assign(this,{t:0,layer:'top',speed:950,z:34},o);this.x=this.x0;this.y=this.y0;this.__gt='-';}
  update(dt){this.t+=dt;const e=this.e,tx=e.dead?this.tx:e.x,ty=e.dead?this.ty:e.y;this.tx=tx;this.ty=ty;const d=Math.hypot(tx-this.x,ty-this.y),s=this.speed*dt;
    if(d<=s+e.r*.3){this.done&&this.done(e);return false;}this.x+=(tx-this.x)/d*s;this.y+=(ty-this.y)/d*s;return this.t<2;}
  draw(){const ph=Math.atan2(this.ty-this.y,this.tx-this.x),[x,y]=P(this.x,this.y,this.z),[x2,y2]=P(this.x-Math.cos(ph)*26,this.y-Math.sin(ph)*26,this.z);ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.strokeStyle=hexA(WKC.gold,.5);ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x,y);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();ctx.restore();gGlow(x,y,12,WKC.gold,.6);}}
function mkGaNeedle(c){const t=gTgt(c,WKS.gaNeedle.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=gLv(WKS.gaNeedle.dmg,'gaNeedle');
  return gStrike({key:'gaNeedle',name:'Needle Strike',phi,I:.3,glow:WKC.gold,f:a=>{addFx(new WkNeedle({x0:player.x+Math.cos(phi)*16,y0:player.y+Math.sin(phi)*16,e:t,done:e=>{
    if(gOn('gaHavoc')&&!aRest()){WK.rpE=e;WK.rpT=gameTime;}   // Rampage moves to the new target whole
    addFx(new WkFall({x:e.x,y:e.y,T:.1,w:11,H:200,stay:.2}));setFxTimer(.1,()=>{if(e.dead)return;gHit(e,m,'gaNeedle',{big:true});flashAt(e,1);shake(1.2);WK.lastTgt=e;});}}));a.hitConfirmed=true;}});}
function mkGaLeap(c){const t=gTgt(c,WKS.gaLeap.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);faceTo(phi);const sx=player.x,sy=player.y,L=Math.max(0,dist(player,t)-t.r-10),[dx,dy]=gPathEnd(sx,sy,phi,L),T=.42,
    s=seq('buff',player.dir,0,null,seqTotal(seq('buff',player.dir,0,null,1))/(T+.16));
  return act({key:'gaLeap',name:'Heaven-Smashing Leap',seq:s,windup:T,dur:T+.16,hitList:[],update:(a,dt)=>{dashUpd(a,dt,0,T,sx,sy,dx,dy,WKC.gold,120);player.iframes=Math.max(player.iframes||0,a.t<T?.05:0);player.glow={color:WKC.amber,k:.6};},
    events:[{t:Math.max(0,T-.12),f:()=>{addFx(new WkFall({x:dx+Math.cos(phi)*20,y:dy+Math.sin(phi)*20,T:.12/(ACTION_TEMPO||.75),w:14,H:260,stay:.25}));}},
      {t:T,f:a=>{const m=gLv(WKS.gaLeap.dmg,'gaLeap'),x=player.x+Math.cos(phi)*20,y=player.y+Math.sin(phi)*20;for(const e of gNear(x,y,WKS.gaLeap.R)){gHit(e,m,'gaLeap',{big:e===t});if(gOn('gaQuake'))applyCC(e,e.boss?{slow:1}:{flinch:WKS.gaQuake.flinch});a.hitList.push(e);a.hitConfirmed=true;}
        gSlam(x,y,WKS.gaLeap.R,{w:12,dust:16,sp:10});if(gOn('gaQuake'))beatsA(WKS.gaQuake.beats);if(!t.dead){rpAdd(WKS.gaLeap.rp,t);WK.lastTgt=t;player.attackTarget=t;}shake(3);stop(60);}}]});}
function mkGaSplit(c){const t=gTgt(c,WKS.gaSplit.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);
  return gStrike({key:'gaSplit',name:'Mountain Splitter',phi,I:.55,from:5,to:3,glow:'#ff7a3a',gk:.7,f:a=>{if(t.dead)return;const cap=rpCap(),pts=aRest()?0:WK.rp,full=cap>0&&pts>=cap,m=gLv(WKS.gaSplit.dmg,'gaSplit')+gLv(WKS.gaSplit.per,'gaSplit')*Math.floor(pts);
    if(!rpLock())WK.rp=0;const ex=t.x+Math.cos(phi)*90,ey=t.y+Math.sin(phi)*90;addFx(new WkFall({x:t.x,y:t.y,T:.06,w:18,H:300,stay:.35,col:'#ff8a3a'}));addFx(new WkCrack({x:t.x,y:t.y,R:110,n:3}));
    gHit(t,m,'gaSplit',{big:true});for(const e of gSeg(player.x,player.y,ex,ey,22))if(e!==t)gHit(e,m*.5,'gaSplit');flashAt(t,1,'#ff9a4a');addFx(new DText({x:t.x,y:t.y,z:110,text:Math.floor(pts)>0?'×'+Math.floor(pts):'',color:'#ffb070',size:14,life:.7}));shake(3);stop(70);
    if(full&&gOn('gaUnbound'))setFxTimer(.25,()=>{if(t.dead)return;const [bx,by,bf]=behindPt(t);mom({x:bx,y:by,face:bf,sc:1.05,T:.4,hitAt:.1});setFxTimer(.1,()=>{if(t.dead)return;gHit(t,WKS.gaUnbound.dmg,'gaUnbound',{big:true});addFx(new WkFall({x:t.x,y:t.y,T:.05,w:14,H:240,stay:.3}));flashAt(t,1);shake(2);
      if(!rpLock()&&rpCap())WK.rp=Math.min(rpCap(),WKS.gaUnbound.back);});});
    a.hitList.push(t);a.hitConfirmed=true;}});}
function mkGaShift(c){const s=hold('buff',player.dir,1,90);return act({key:'gaShift',name:'Ruyi Shift',seq:s,windup:.02,dur:.09,hitList:[],events:[{t:.01,f:()=>{WK.shift=WK.shift==='long'?'short':'long';
  addFx(new DText({x:player.x,y:player.y,z:92,text:WK.shift==='long'?'ไม้เท้ายาว':'ไม้เท้าสั้น',color:WKC.gold,size:12,life:.7}));const ph=player.phi;addFx(new WkStaffFx({x0:player.x,y0:player.y,x1:player.x+Math.cos(ph)*(WK.shift==='long'?120:50),y1:player.y+Math.sin(ph)*(WK.shift==='long'?120:50),w:6,life:.25}));
  if(gOn('gaWill')&&gameTime-WK.willT>=WKS.gaWill.gap){WK.willT=gameTime;beatsA(WKS.gaWill.beats);addFx(new DText({x:player.x,y:player.y,z:108,text:'+'+WKS.gaWill.beats+' จังหวะ',color:WKC.gold2,size:11,life:.7}));}}}]});}
function mkGaUlt(c){const T=WKS.gaUlt.T;return buffAct({key:'gaUlt',name:'Havoc in Heaven',speed:1.5,glow:WKC.amber,events:tP=>[{t:.02,f:()=>{skyDarkT=.4;}},{t:tP,f:()=>{
  WK.ultA=gameTime+T;WK.ultAOn=1;if(rpCap())WK.rp=rpCap();addBuff('gaUlt',T);addFx(new WkGiant({life:T}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:120,w:12,color:WKC.amber,life:.5}));hairPuff(player.x,player.y,40,20);
  addFx(new DText({x:player.x,y:player.y,z:120,text:'HAVOC IN HEAVEN',color:WKC.gold,size:16,life:1.2}));shake(2.5);skyDarkT=0;}}]});}
/* Equal to Heaven: the ult ends — we and 3 clones split the mountain together, Rampage stays full 5 s more */
function equalToHeaven(){const t=(WK.rpE&&!WK.rpE.dead&&dist(player,WK.rpE)<300)?WK.rpE:gNearest(player.x,player.y,260);WK.equalT=gameTime+WKS.gaEqual.T;if(!t)return;
  for(let i=0;i<3;i++){const a=angTo(t)+Math.PI+(i-1)*1.3,x=t.x+Math.cos(a)*(t.r+34),y=t.y+Math.sin(a)*(t.r+34);mom({x,y,face:Math.atan2(t.y-y,t.x-x),sc:1.1,T:.5,hitAt:.18});addFx(new WkFall({x:(x+t.x)/2,y:(y+t.y)/2,T:.18,w:12,H:260,stay:.3}));}
  setFxTimer(.2,()=>{for(const e of gNear(t.x,t.y,WKS.gaEqual.R))gHit(e,WKS.gaEqual.dmg,'gaEqual',{big:true});gSlam(t.x,t.y,WKS.gaEqual.R,{w:14,dust:18,sp:12});addFx(new DText({x:t.x,y:t.y,z:120,text:'EQUAL TO HEAVEN',color:WKC.gold,size:15,life:1.1}));shake(4);stop(80);});}

/* ---------- B · Seventy-Two Transformations ---------- */
function mkGbBlow(c){const t=gTgt(c,WKS.gbBlow.range);return gBurst({key:'gbBlow',name:'Pluck & Blow',phi:t?angTo(t):null,speed:2.6,glow:WKC.gold,f:()=>{WK.blowT=gameTime;const cx=t&&!t.dead?t.x:player.x+Math.cos(player.phi)*60,cy=t&&!t.dead?t.y:player.y+Math.sin(player.phi)*60,r0=t?t.r+30:50;
  const room=Math.max(0,maxClones()-realClones().length),n=Math.min(WKS.gbBlow.n,room);for(const c2 of realClones())c2.until=Math.max(c2.until,gameTime+WK_BAL.swarm.life);
  const b=gBits();for(let i=0;i<n;i++){const a=rnd(0,TAU),x=cx+Math.cos(a)*r0,y=cy+Math.sin(a)*r0;if(b)for(let j=0;j<4;j++){const k=j/4;b.add({kind:'hair',x:lerp(player.x,x,k),y:lerp(player.y,y,k),z:40,vx:(x-player.x)*1.4,vy:(y-player.y)*1.4,vz:20,drag:3,life:.4,s:1});}
    setFxTimer(.12+i*.05,()=>spawnClone(x,y));}
  if(t&&!t.dead)player.attackTarget=t;}});}
function setForm(f,entry){WK.form=f;const F=FORMS().filter(q=>q!=='none');WK.form2=gOn('gxTwo')&&f!=='none'?F[(F.indexOf(f)+1)%F.length]:f;
  const L=realClones();L.forEach((c,i)=>{c.form=gOn('gxTwo')&&i%2?WK.form2:WK.form;c.hits=cloneHits(c);c.flash=1;hairPuff(c.wx,c.wy,24,4,FCOL[c.form]);});
  while(realClones().length>maxClones()){const r=realClones();popClone(r[r.length-1]);}
  if(entry&&gOn('gbMaster')){beatsB(WKS.gbMaster.beats);for(const c of realClones()){const e=gNearest(c.wx,c.wy,200);if(!e)continue;
    if(c.form==='tiger'){c.jump={x0:c.wx,y0:c.wy,x1:e.x-Math.cos(angTo(e))*e.r*.4,y1:e.y-Math.sin(angTo(e))*e.r*.4,t0:gameTime,T:.25,h:50};setFxTimer(.25,()=>{if(!e.dead){gHit(e,WKS.gbMaster.dmg,'gbMaster');flashAt(e,0,WKC.tiger);}});}
    else if(c.form==='hornet'){c.atkT=gameTime;gHit(e,WKS.gbMaster.dmg,'gbMaster');applyCC(e,{slow:1.5});stingFx(c,e);}
    else if(c.form==='stone'){c.atkT=gameTime;for(const q of gNear(c.wx,c.wy,50))gHit(q,WKS.gbMaster.dmg,'gbMaster');for(const q of gNear(c.wx,c.wy,140)){if(!q.boss){q.wkTaunt=gameTime+2;q.wkTauntBy=c;}}gSlam(c.wx,c.wy,40,{dust:5,sp:3});}
    else{c.atkT=gameTime;gHit(e,WKS.gbMaster.dmg,'gbMaster');}}}}
function mkGbForm(c){const s=hold('buff',player.dir,2,180);return act({key:'gbForm',name:'Seventy-Two Transformations',seq:s,windup:.05,dur:.18,hitList:[],events:[{t:.04,f:()=>{const f=nextForm();setForm(f,1);
  addFx(new DText({x:player.x,y:player.y,z:96,text:{none:'ร่างขน',tiger:'ร่างเสือ!',hornet:'ร่างผึ้ง!',stone:'ร่างหิน!'}[f]+(gOn('gxTwo')&&f!=='none'?' + '+{tiger:'เสือ',hornet:'ผึ้ง',stone:'หิน'}[WK.form2]:''),color:FCOL[f]||WKC.gold,size:13,life:.9}));hairPuff(player.x,player.y,40,10,FCOL[f]);}}]});}
function mkGbRecall(c){const L=liveClones();if(!L.length){gNo('ยังไม่มีร่างขน — ใช้ Pluck & Blow ก่อน');return null;}
  return gBurst({key:'gbRecall',name:'Hair Recall',speed:2.6,glow:WKC.gold,f:()=>{const L2=liveClones(),n=Math.min(WKS.gbRecall.cap,L2.filter(c=>!c.wind).length||L2.length),b=gBits();
    for(const c of L2){if(b)for(let j=0;j<5;j++)b.add({kind:'hair',x:c.wx,y:c.wy,z:30,vx:(player.x-c.wx)*2.2,vy:(player.y-c.wy)*2.2,vz:10,drag:2.5,life:.45,s:1.1});popClone(c,'recall');}
    addBeats(n);const h=Math.round(PS.lv*WKS.gbRecall.heal*n);if(h>0)player.hp=Math.min(player.maxHp,player.hp+h);WK.blowT=-99;
    addFx(new DText({x:player.x,y:player.y,z:100,text:'+'+n+' จังหวะ · +'+h+' HP',color:WKC.gold,size:13,life:1}));addFx(new GRing({x:player.x,y:player.y,r0:70,r1:10,w:8,color:WKC.gold,life:.35}));}});}
function mkGbMob(c){if(!liveClones().length){gNo('ยังไม่มีร่างขน — ใช้ Pluck & Blow ก่อน');return null;}const t=gTgt(c,WKS.gbMob.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return gBurst({key:'gbMob',name:'Monkey Mob',phi:angTo(t),speed:2.4,glow:WKC.gold,f:()=>{if(t.dead)return;WK.mob={e:t,until:gameTime+gLv(WKS.gbMob.T,'gbMob')};if(WK.venomT>gameTime-1.5){applyCC(t,{slow:WK.venomN*(t.boss?.5:1)});WK.venomT=-99;}
    for(const c of liveClones()){const a=rnd(0,TAU);c.jump={x0:c.wx,y0:c.wy,x1:t.x+Math.cos(a)*t.r*.5,y1:t.y+Math.sin(a)*t.r*.3,t0:gameTime,T:.3,h:80};}
    addFx(new DText({x:t.x,y:t.y,z:100,text:'รุมเกาะ!',color:WKC.gold,size:13,life:.9}));player.attackTarget=t;}});}
function mkGbCave(c){const x0=c&&c.gx!=null?c.gx:player.x,y0=c&&c.gy!=null?c.gy:player.y;
  return gBurst({key:'gbCave',name:'Water Curtain Cave',speed:2,glow:WKC.water,f:()=>{const [x,y]=clampPt(x0,y0);WK.cave={x,y,until:gameTime+WKS.gbCave.T};addFx(new WkCave({}));addFx(new WkCaveTop());
    addFx(new GRing({x,y,r0:20,r1:WKS.gbCave.R,w:8,color:WKC.water,life:.5}));const b=gBits();if(b)for(let i=0;i<24;i++){const an=rnd(0,TAU),r=rnd(0,WKS.gbCave.R);b.add({kind:'drop',x:x+Math.cos(an)*r,y:y+Math.sin(an)*r,z:rnd(60,140),vz:-rnd(40,120),g:500,drag:.5,life:.6,s:1,col:'#cfefff'});}}});}
function mkGbUlt(c){const T=WKS.gbUlt.T;return buffAct({key:'gbUlt',name:'Flower-Fruit Mountain Army',speed:1.5,glow:WKC.gold,events:tP=>[{t:tP,f:()=>{WK.ultB=gameTime+T;WK.ultBOn=1;WK.blowT=gameTime;addBuff('gbUlt',T);
  const room=Math.max(0,maxClones()-realClones().length);for(let i=0;i<room;i++){const a=i/Math.max(1,room)*TAU;spawnClone(player.x+Math.cos(a)*60,player.y+Math.sin(a)*40);}
  for(let i=0;i<WKS.gbUlt.wind;i++){const a=(i+.5)/WKS.gbUlt.wind*TAU;spawnClone(player.x+Math.cos(a)*90,player.y+Math.sin(a)*60,{wind:1,life:T+.5});}
  for(const c of liveClones())c.until=Math.max(c.until,gameTime+T+.5);
  addFx(new WkGiant({life:T}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:150,w:12,color:WKC.gold,life:.6}));addFx(new DText({x:player.x,y:player.y,z:120,text:'FLOWER-FRUIT MOUNTAIN!',color:WKC.gold,size:15,life:1.2}));shake(2.5);}}]});}
/* the army goes home: wind clones go; Handsome Monkey King: every B autospell fires once, then the swarm returns as hair (+HP) */
function armyEnds(){const extra=WK.swarm.filter(c=>!c.gone&&c.wind&&!c.tmp);const keep=gOn('gxFur')?WKS.gxFur.plus:0;extra.slice(keep).forEach(c=>popClone(c));
  if(!gOn('gbHandsome'))return;const t=autoTgt();let i=0;if(t)for(const k of ['gbPile','gbWhirl','gbBarrage'])if(gOn(k)){setFxTimer(.05+i*.18,()=>{if(!t.dead&&AUTO_FIRE[k]){AUTO_FIRE[k](t,{});WK.flash[k]=gameTime;}});i++;}
  setFxTimer(.15+i*.18+.4,()=>{const L=liveClones(),n=Math.min(6,L.filter(c=>!c.wind).length);for(const c of L)popClone(c,'home');const h=Math.round(PS.lv*WKS.gbHandsome.heal*n);if(h>0){player.hp=Math.min(player.maxHp,player.hp+h);addFx(new DText({x:player.x,y:player.y,z:100,text:'+'+h+' HP',color:'#9dff8a',size:13,life:.9}));}});}

/* ---------- C · Victorious Fighting Buddha ---------- */
function mkGxFurnace(c){const T=WKS.gxFurnace.T;return buffAct({key:'gxFurnace',name:'Out of the Furnace',speed:1.6,glow:WKC.fire,events:tP=>[{t:tP,f:()=>{WK.furnT=gameTime+T;WK.furnAcc=0;addBuff('gxFurnace',T);addFx(new WkFlames({life:T}));
  addFx(new GRing({x:player.x,y:player.y,r0:10,r1:110,w:12,color:WKC.fire,life:.5}));addFx(new DText({x:player.x,y:player.y,z:120,text:'OUT OF THE FURNACE',color:WKC.fire,size:15,life:1.1}));shake(2);}}]});}
function mkGxBang(c){const t=gTgt(c,WKS.gxBang.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t);faceTo(phi);const sx=player.x,sy=player.y,L=Math.max(0,dist(player,t)-t.r-60),[dx,dy]=gPathEnd(sx,sy,phi,L),T=.5,
    s=seq('buff',player.dir,0,null,seqTotal(seq('buff',player.dir,0,null,1))/(T+.2));
  return act({key:'gxBang',name:'Ruyi Jingu Bang',seq:s,windup:T,dur:T+.2,hitList:[],update:(a,dt)=>{dashUpd(a,dt,0,T,sx,sy,dx,dy,WKC.gold,170);player.iframes=Math.max(player.iframes||0,.05);player.glow={color:WKC.gold,k:.8};},
    events:[{t:.05,f:()=>{if(!t.dead)addFx(new WkFall({x:t.x,y:t.y,T:(T-.05)/(ACTION_TEMPO||.75),w:34,H:700,stay:.5}));skyDarkT=.35;}},
      {t:T,f:a=>{if(t.dead)return;const pts=aRest()?0:Math.floor(WK.rp),m=WKS.gxBang.dmg+WKS.gxBang.per*pts;gHit(t,m,'gxBang',{big:true});for(const e of gNear(t.x,t.y,WKS.gxBang.R))if(e!==t)applyCC(e,{flinch:.6});
        gSlam(t.x,t.y,WKS.gxBang.R+30,{w:16,dust:24,sp:16});addFx(new DText({x:t.x,y:t.y,z:130,text:'13,500 JIN',color:WKC.gold,size:17,life:1.1}));shake(4.5);stop(90);skyDarkT=0;a.hitList.push(t);a.hitConfirmed=true;}}]});}
function mkGxStorm(c){const T=WKS.gxStorm.T;return gBurst({key:'gxStorm',name:'Storm of Ten Thousand Monkeys',speed:1.8,glow:WKC.gold,f:()=>{WK.storm={until:gameTime+T,tk:0};addBuff('gxStorm',T);
  for(let i=0;i<WKS.gxStorm.wind;i++){const c2=spawnClone(player.x,player.y,{tmp:1,storm:1,life:T,quiet:1});c2.orb=i/WKS.gxStorm.wind*TAU;}
  addFx(new GRing({x:player.x,y:player.y,r0:10,r1:WKS.gxStorm.R,w:10,color:WKC.gold,life:.5}));hairPuff(player.x,player.y,40,24);shake(2);}});}

const WK_MAKE={gnCloud:mkGnCloud,gnPeach:mkGnPeach,gnSub:mkGnSub,
  gaSmash:mkGaSmash,gaNeedle:mkGaNeedle,gaLeap:mkGaLeap,gaSplit:mkGaSplit,gaShift:mkGaShift,gaUlt:mkGaUlt,
  gbBlow:mkGbBlow,gbForm:mkGbForm,gbRecall:mkGbRecall,gbMob:mkGbMob,gbCave:mkGbCave,gbUlt:mkGbUlt,
  gxFurnace:mkGxFurnace,gxBang:mkGxBang,gxStorm:mkGxStorm};
const WK_ZIGZAG=[['gnStaff','gnHair'],['gaSmash','gaRhythm'],['gbBlow','gbPile']];

/* =====================================================================
   10. AUTO · HOOKS · INSTALL
   ===================================================================== */
function wukongAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.4&&ready('gnPeach'))return cast('gnPeach');
  if(!t)return false;const d=dist(player,t),near=gNear(player.x,player.y,220);
  let a=0,b=0;for(const k in SKILLS){const s=SKILLS[k];if(!(LV[k]>0)||s.br==='C'||s.br==='basic')continue;if(s.br==='A')a+=LV[k];else if(s.br==='B')b+=LV[k];}
  const BB=b>a||(b===a&&swarmOut());   /* the branch the player built (test mode maxes both: the swarm decides) */
  if(t.boss&&ready('gxFurnace'))return cast('gxFurnace');
  if(hp<.55&&d<120&&ready('gnSub')&&!(WK.subUntil>gameTime))return cast('gnSub');
  if(d>170&&ready('gnCloud'))return cast('gnCloud');
  if(BB){if(realClones().length<Math.min(3,maxClones())&&ready('gbBlow'))return cast('gbBlow');
    if((t.boss||near.length>=3)&&ready('gbUlt'))return cast('gbUlt');
    if(near.length>=3&&ready('gxStorm'))return cast('gxStorm');
    if(near.length>=3&&ready('gbCave'))return cast('gbCave',{target:t,gx:player.x,gy:player.y});
    if((t.boss||near.length<2)&&liveClones().length>=3&&ready('gbMob')&&d<=WKS.gbMob.range+t.r)return cast('gbMob');
    return false;}
  if((t.boss||near.length>=3)&&ready('gaUlt'))return cast('gaUlt');
  if(t.boss&&ready('gxBang')&&d<=WKS.gxBang.range+t.r)return cast('gxBang');
  if(ready('gaSmash')&&d<=WKS.gaSmash.range+t.r)return cast('gaSmash');
  if(rpCap()&&WK.rp>=rpCap()&&ready('gaSplit')&&d<=WKS.gaSplit.range+t.r)return cast('gaSplit');
  if((d>130||near.length>=3)&&ready('gaLeap')&&d<=WKS.gaLeap.range+t.r)return cast('gaLeap');
  if(d>150&&ready('gaNeedle')&&d<=WKS.gaNeedle.range+t.r)return cast('gaNeedle');
  return false;}

/* the autospell bar (owner's design 'หน้าจอ'): learned autospells above the hot bar / skill wheel, a ring fills beat by beat,
   gold flash when a clone casts it, darker while its minimum gap holds it back */
function wkBar(){const L=AUTOS.filter(A=>gOn(A.k));let el=document.getElementById('wkBar');
  if(!L.length||!(curMap||window.__WK_BAR)){if(el)el.style.display='none';return;}
  if(!el){el=document.createElement('div');el.id='wkBar';document.body.appendChild(el);const st=document.createElement('style');st.textContent=
    '#wkBar{position:fixed;z-index:12;display:flex;gap:6px;pointer-events:none;padding:3px 6px;border-radius:12px;background:rgba(18,12,6,.38)}'+
    '#wkBar .wkA{position:relative;width:34px;height:34px;border-radius:50%;}#wkBar .wkA img{position:absolute;inset:3px;width:28px;height:28px;border-radius:50%;object-fit:cover;filter:saturate(1.1)}'+
    '#wkBar .wkA i{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#ffd24a var(--f,0deg),rgba(40,26,8,.75) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3.5px))}'+
    '#wkBar .wkA b{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);font:700 9px/1 sans-serif;color:#fff3c8;text-shadow:0 1px 2px #000;white-space:nowrap}'+
    '#wkBar .wkA.off{opacity:.35}#wkBar .wkA.gap img{filter:brightness(.55)}#wkBar .wkA.fl{animation:wkFl .32s ease-out}#wkBar .wkA.fl i{background:#fff6c8}'+
    '@keyframes wkFl{0%{transform:scale(1.35);box-shadow:0 0 18px 6px #ffd24a}100%{transform:scale(1);box-shadow:0 0 0 0 transparent}}';document.head.appendChild(st);}
  el.style.display='flex';const sig=L.map(A=>A.k).join(',');
  if(el._sig!==sig){el._sig=sig;el.innerHTML=L.map(A=>`<div class="wkA" data-k="${A.k}" title="${SKILLS[A.k].name}"><img src="${(typeof SKILL_ICON_ART!=='undefined'&&SKILL_ICON_ART[SKILLS[A.k].name])||''}"><i></i><b></b></div>`).join('');}
  const mob=document.body.classList.contains('mob');
  if(mob){/* phone: the free strip at the bottom between the joystick and the skill wheel (the wheel's box is only an anchor, its buttons sit above it) */
    if(!(el._pt>performance.now()-500)){el._pt=performance.now();const H=innerHeight,band=H-84;let lo=6,hi=innerWidth-6;
      for(const q of document.querySelectorAll('#mobJoy,#mobChat,#mobAuto,#mobSit')){const r=q.getBoundingClientRect();if(r.width&&r.bottom>band&&r.left<innerWidth*.45)lo=Math.max(lo,r.right+8);}
      for(const q of document.querySelectorAll('#mobSkW .mobSk,#mobSkSet,#mobTab,#mobAtk,#mobRot,#mobTgt')){const r=q.getBoundingClientRect();if(r.width&&r.bottom>band&&r.left>innerWidth*.3)hi=Math.min(hi,r.left-8);}
      const w=L.length*40+12,sc=Math.max(.6,Math.min(1,(hi-lo)/w));el.style.transformOrigin='50% 100%';el.style.transform=sc<1?`scale(${sc.toFixed(3)})`:'';
      el.style.left=Math.round((lo+hi)/2-w/2)+'px';el.style.top='';el.style.bottom='14px';}}
  else{const ref=document.getElementById('hotbar'),r=ref&&ref.getBoundingClientRect();
    if(r&&r.width){const w=el.offsetWidth||L.length*40;el.style.left=Math.round(r.left+r.width/2-w/2)+'px';el.style.top=Math.round(r.top-46)+'px';el.style.bottom='';el.style.transform='';}
    else{el.style.left='50%';el.style.top='';el.style.bottom='96px';el.style.transform='translateX(-50%)';}}
  for(const A of L){const dv=el.querySelector(`[data-k="${A.k}"]`);if(!dv)continue;const N=autoN(A.k),b=WK.beats[A.k]||0;dv.style.setProperty('--f',Math.round(Math.min(1,b/N)*360)+'deg');
    dv.classList.toggle('off',!autoOk(A.k));dv.classList.toggle('fl',gameTime-(WK.flash[A.k]??-9)<.3);dv.classList.toggle('gap',b>=N-1e-6&&gameTime-(WK.last[A.k]??-99)<autoGap(A.k));
    const tx=Math.floor(b+1e-6)+'/'+Math.round(N*10)/10;const q=dv.querySelector('b');if(q.textContent!==tx)q.textContent=tx;}}

function installWukong(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of WK_DEFS){const b=WKS[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:gIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'snow_monkey'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd!=null)sk.cd=Array.isArray(b.cd)?b.cd[b.cd.length-1]:b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.auto)sk.auto=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(['gaShift','gbRecall','gbForm'].includes(d.key))sk.noBench=1;   // switches / clean-up: the greedy bench would spam them
    if(WK_MAKE[d.key])sk.make=WK_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${WK_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of WK_ZIGZAG){const A=SKREQ[a],B_=SKREQ[b];if(!A||!B_)continue;
    B_.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B_.length)r.need.push([b,i]);});}};}
  Object.assign(SK_CC,{gaSmash:{flinch:.35},gaNeedle:{flinch:.25},gaLeap:{flinch:.3},gaSplit:{flinch:.45},gaUnbound:{flinch:.3},gaPillar:{flinch:.3},gaEqual:{flinch:.5},gbPile:{flinch:.2},gbMaster:{flinch:.25},gxBang:{air:1},gxStaff:{flinch:.25}});
  Object.assign(SK_KO,{basic:1,gxStaff:2,gnHair:.8,gaSmash:2.4,gaRhythm:.8,gaNeedle:1.2,gaThousand:.6,gaLeap:2.4,gaSplit:3,gaUnbound:2,gaPillar:2.6,gaEqual:3,gbPile:.6,gbWhirl:.5,gbBarrage:.3,gbMaster:.6,gbCopy:.2,gxBang:4,gxStorm:.3});
  TABS.length=0;TABS.push({n:'Havoc',keys:['gaSmash','gaNeedle','gaLeap','gaSplit','gaShift','gaUlt','gnCloud','gnPeach','gnSub']},
    {n:'Seventy-Two',keys:['gbBlow','gbForm','gbMob','gbCave','gbRecall','gbUlt','gnCloud','gnPeach','gnSub']},
    {n:'Buddha',keys:['gxFurnace','gxBang','gxStorm','gnCloud','gnPeach','gnSub']});
  Object.assign(BUFFDEF,{gnCloud:{n:'Somersault Cloud — ตีโดน = 2 จังหวะ',c:WKC.cloud,i:'CLOUD'},gnPeach:{n:'Peach of Immortality',c:WKC.peach,i:'PEACH'},gxPeach:{n:'Peach Banquet',c:WKC.peach,i:'ASPD'},
    gnSub:{n:'Hair Substitute',c:WKC.gold,i:'SUB'},gaUlt:{n:'Havoc in Heaven',c:WKC.amber,i:'HAVOC'},gbUlt:{n:'Flower-Fruit Mountain Army',c:WKC.gold,i:'ARMY'},gxFurnace:{n:'Out of the Furnace',c:WKC.fire,i:'FIRE'},
    gxStorm:{n:'Storm of Ten Thousand Monkeys',c:WKC.gold,i:'STORM'},wkRp:{n:'แต้มอาละวาด',c:'#ff8a3a',i:'RAGE'},wkSw:{n:'ร่างขน',c:WKC.gold,i:'HAIR'},wkForm:{n:'ร่างของฝูง',c:WKC.tiger,i:'FORM'},wkShift:{n:'Ruyi Shift',c:WKC.gold2,i:'RUYI'}});
  JOB.name='Stone Monkey';JOB.hpA=1.4;JOB.hpB=5.4;JOB.spB=3.0;
  ITEMS.yamabushiStaff={n:'Yamabushi Ringed Staff',slot:'rhand',two:1,kind:'Ringed Staff',atk:165,matk:0,wlv:3,aspd:160,ref:6,cards:2,w:130,b:{agi:2},size:{small:1,medium:1,large:.75},d:'ไม้เท้าห่วงของนักพรตภูเขา AGI +2'};
  ITEMS.ruyiReplica={n:'Ruyi Staff Replica',slot:'rhand',two:1,kind:'Ringed Staff',atk:185,matk:0,wlv:4,aspd:158,ref:4,cards:1,w:150,b:{str:3},size:{small:1,medium:1,large:.75},d:'ไม้เท้าจำลองหรู่อี้จินกูปัง STR +3'};
  EQ.rhand='yamabushiStaff';INV.length=0;INV.push('ruyiReplica','vikinghelm','ringPrec','clipLuck');
  /* Fiery Golden Eyes: HIT · Golden Headband: shorter stuns / flinches */
  if(typeof gearCalc==='function'&&!gearCalc._wk){const _g=gearCalc;gearCalc=function(){const r=_g.apply(this,arguments);if(CHAR==='wukong'&&gOn('gnEyes'))BON.hit=(BON.hit||0)+gLv(WKS.gnEyes.hit,'gnEyes');return r;};gearCalc._wk=1;}
  if(typeof playerCC==='function'&&!playerCC._wk){const _p=playerCC;playerCC=function(k,dur){if(CHAR==='wukong'&&gOn('gnBand')&&dur>0)dur=Math.max(.1,dur-gLv(WKS.gnBand.cc,'gnBand'));return _p.call(this,k,dur);};playerCC._wk=1;}
  /* the swarm's copy-hits: one number per target every 0.35 s instead of a number per clone (6 clones × 5 swings a second buried the screen) */
  if(typeof dmgNum==='function'&&!dmgNum._wk){const _dn=dmgNum;dmgNum=function(x,y,z,val,kind,o){if(WK._inCopy&&o&&o.who&&kind!=='miss'){const e=o.who;e._wkCS=(e._wkCS||0)+(+val||0);
      if(!(e._wkCT>gameTime)){e._wkCT=gameTime+.35;setFxTimer(.35,()=>{const v=Math.round(e._wkCS||0);e._wkCS=0;if(v>0)_dn(e.x,e.y,z,v,'hit',{scale:.8,who:e});});}return {dx:0,t:0};}
    return _dn.apply(this,arguments);};dmgNum._wk=1;}
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  /* flat ATK: Rebel King (per Rampage point) + Golden Fur (per clone ≤ 6), at most the hit's own power (2026-11-22 rule) · Clinging Fur cuts DEF */
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,D.patk);let fl=0;
    if(gOn('gaRebel')&&!aRest()&&WK.rp>=1)fl+=Math.floor(WK.rp)*gLv(WKS.gaRebel.atk,'gaRebel');
    if(gOn('gbGold'))fl+=countClones()*gLv(WKS.gbGold.atk,'gbGold');
    if(o&&e&&WK.mob&&WK.mob.e===e&&WK.mob.until>gameTime&&gOn('gbCling'))o._defCut=(o._defCut||0)+Math.min(WKS.gbCling.max,countClones()*gLv(WKS.gbCling.def,'gbCling'));
    return (base+Math.min(fl,base))/base;};
  /* a monster's blow: a decoy clone takes it (Stone Decoys) · else the Hair Substitute does */
  window.jgPreHit=e=>{if(e&&e.wkTaunt>gameTime&&e.wkTauntBy&&!e.wkTauntBy.gone&&!e.boss&&gameTime-(e.wkTauntBy.takeT??-9)>=WKS.gbDecoy.guard){const c=e.wkTauntBy;c.takeT=gameTime;cloneTakes(c,e);gSparks(c.wx,c.wy,26,3,FCOL[c.form]);return 0;}
    if(WK.subUntil>gameTime){subTakes(e);return 0;}return 1;};
  window.jgAbsorb=(d,e)=>{let r=0;if(gOn('gnForge'))r+=PS.lv*gLv(WKS.gnForge.cut,'gnForge')*(WK.furnT>gameTime?2:1);
    const C=WK.cave;if(C&&C.until>gameTime&&gOn('gbCave')&&Math.hypot(player.x-C.x,player.y-C.y)<WKS.gbCave.R)r+=PS.lv*gLv(WKS.gbCave.cut,'gbCave');return Math.max(1,Math.round(d-r));};
  window.jgPostHit=()=>{};window.jgAfterHurt=(e,dmg,crit,o)=>{if(o&&o.auto)WK.lastCrit=crit?1:0;};
  /* ASPD from skills = RO points (≤ +10 together), converted to the swing speed multiplier; the hero's ASPD cap still holds */
  window.jgAspd=()=>{const b=skillAspd();if(!b||!D||!(D.aps>0))return 1;const t=Math.max(100,Math.min(Math.max(aspdCap(),D.aspd),D.aspd+b));return (50/(200-t))/D.aps;};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};
  window.wukongAutoTick=wukongAutoTick;
  mkBasic=mkWkBasic;gEnsure();
  for(const k in SKILLS){const sk=SKILLS[k];if(sk.make&&!sk.make._gE){const mk=sk.make;sk.make=function(){gEnsure();return mk.apply(this,arguments);};sk.make._gE=1;}}
  try{document.title='Totem Legend — Snow Monkey';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Snow Monkey';if(cl)cl.textContent='Stone Monkey';}catch(e){}
  window.WK=WK;window.WK_DEFS=WK_DEFS;window.WK_BAL=WK_BAL;window.gCol=gCol;window.WK_AUTOS=AUTOS;
  window.WKB={add:addBeats,addA:beatsA,addB:beatsB,venom:n=>{WK.venomN=n;WK.venomT=gameTime;},clones:liveClones,spawn:spawnClone,fire:fireAuto};
  /* dev tools (tools/skill_shapes_probe.js): a fresh state, three clones so the swarm skills have something to command */
  window.heroShapeReset=()=>{for(const c of WK.swarm)c.gone=1;WK.swarm.length=0;Object.assign(WK,{beats:{},last:{},rp:0,rpE:null,mob:null,cave:null,storm:null,subUntil:0,cloudT:-99,ultA:-99,ultAOn:0,ultB:-99,ultBOn:0,equalT:-99,furnT:-99});
    if(gL('gbBlow'))for(let i=0;i<3;i++)spawnClone(player.x+Math.cos(i*2.1)*50,player.y+Math.sin(i*2.1)*40,{quiet:1});};}
/* skills whose cooldown follows their level (and Somersault Cloud with 108,000 Li); a gem-modified skill keeps the gem's number */
function cdSync(){for(const k of ['gnCloud','gnSub','gaUlt','gbUlt']){const s=SKILLS[k];if(!s||s._gb)continue;const v=Math.max(1,gLv(WKS[k].cd,k)-(k==='gnCloud'&&gOn('gxLi')?WKS.gxLi.cdr:0));if(s.cd!==v)s.cd=v;}}

/* =====================================================================
   11. ICONS (code SVG until painted ones exist in assets/icons/wukong — set WK_ICONS_PAINTED then)
   ===================================================================== */
const WK_ICONS_PAINTED=false;
if(!WK_ICONS_PAINTED)window.EX_ICON_SKIP=Object.assign(window.EX_ICON_SKIP||{},{wukong:1});
function gIconSpec(d){const k=d.key,br=d.br,col=br==='A'?'#ffb070':br==='B'?'#ffe27a':br==='C'?'#ffd36a':'#f4e6c8',bg=br==='A'?'#3a1408':br==='B'?'#2a2206':br==='C'?'#2a1430':'#1e2230';
  const ink='#1a0f06',gold='#ffd24a',red='#e8463a',fur='#d8d0cc',face='#ef7a6a',L=(a,b,c,e,cl=col,w=2.6,x='')=>`<path d="M${a} ${b} L${c} ${e}" stroke="${cl}" stroke-width="${w}" stroke-linecap="round" fill="none" ${x}/>`;
  const staff=(x1,y1,x2,y2,w=3.2,hc=gold)=>{const a=Math.atan2(y2-y1,x2-x1),ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux;let s=L(x1,y1,x2,y2,ink,w+1.6)+L(x1,y1,x2,y2,'#6b4628',w);
    for(const f of [.15,.55])s+=L(x1+(x2-x1)*f-ux*1.2,y1+(y2-y1)*f-uy*1.2,x1+(x2-x1)*f+ux*1.2,y1+(y2-y1)*f+uy*1.2,hc,w+1.4);
    for(const q of [-1,0,1])s+=`<ellipse cx="${(x2+ux*2+nx*q*2.6).toFixed(1)}" cy="${(y2+uy*2+ny*q*2.6).toFixed(1)}" rx="2.6" ry="2" fill="none" stroke="#c8ccd4" stroke-width="1.1"/>`;return s+`<circle cx="${(x2+ux*4.5).toFixed(1)}" cy="${(y2+uy*4.5).toFixed(1)}" r="1.7" fill="${hc}"/>`;};
  const head=(cx,cy,s=1,c=fur,band=gold,fc=face,alpha=1)=>`<g transform="translate(${cx} ${cy}) scale(${s})" opacity="${alpha}"><circle cx="-9" cy="1" r="3.6" fill="${fc}" stroke="${ink}" stroke-width="1"/><circle cx="9" cy="1" r="3.6" fill="${fc}" stroke="${ink}" stroke-width="1"/>`+
    `<path d="M-9 -2 Q-11 -13 0 -13 Q11 -13 9 -2 Q9 9 0 10 Q-9 9 -9 -2 Z" fill="${c}" stroke="${ink}" stroke-width="1.2"/><path d="M-6 -1 Q0 -5 6 -1 Q6 7 0 8 Q-6 7 -6 -1 Z" fill="${fc}"/>`+
    `<path d="M-8 -6 Q0 -10 8 -6" stroke="${band}" stroke-width="2.2" fill="none"/><circle cx="-2.4" cy="1" r="1.1" fill="${ink}"/><circle cx="2.4" cy="1" r="1.1" fill="${ink}"/></g>`;
  const gh=(cx,cy,s=1)=>head(cx,cy,s,'#ffd86a',gold,'#ffb84a',.95);
  const hair=(x,y,a,c=gold)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-6 0 Q0 -4 6 0" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;
  const cloud=(x,y,s=1,c='#f4f8ff')=>`<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-7" cy="1" r="5" fill="${c}"/><circle cx="0" cy="-2" r="6.5" fill="${c}"/><circle cx="7" cy="1" r="5" fill="${c}"/><rect x="-12" y="1" width="24" height="5" rx="2.5" fill="${c}"/><path d="M-11 6 Q0 9 11 6" stroke="${gold}" stroke-width="1" fill="none"/></g>`;
  const peach=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -9 C10 -8 9 9 0 9 C-9 9 -10 -8 0 -9 Z" fill="#ffa8b4" stroke="${ink}" stroke-width="1"/><path d="M0 -9 Q-1 0 0 9" stroke="#e86a7a" stroke-width="1" fill="none"/><ellipse cx="4" cy="-10" rx="4.5" ry="2" fill="#5ac46a" transform="rotate(-25 4 -10)"/></g>`;
  const eye=(cx=22,cy=22,s=1)=>`<path d="M${cx-13*s} ${cy} Q${cx} ${cy-12*s} ${cx+13*s} ${cy} Q${cx} ${cy+12*s} ${cx-13*s} ${cy} Z" fill="#fff4d0" stroke="#6a3a06" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${5.5*s}" fill="#ff8a1a"/><circle cx="${cx}" cy="${cy}" r="${2.6*s}" fill="${gold}"/><circle cx="${cx}" cy="${cy}" r="${1.2*s}" fill="${ink}"/>`;
  const flame=(x,y,s=1,c='#ffb030')=>`<path d="M${x} ${y-12*s} Q${x+8*s} ${y-2*s} ${x+5*s} ${y+6*s} Q${x} ${y+10*s} ${x-5*s} ${y+6*s} Q${x-8*s} ${y-2*s} ${x} ${y-12*s} Z" fill="${c}"/><path d="M${x} ${y-4*s} Q${x+3*s} ${y+2*s} ${x} ${y+6*s} Q${x-3*s} ${y+2*s} ${x} ${y-4*s} Z" fill="#fff3b0"/>`;
  const ring=(r=14,c=col,w=2.2,x='')=>`<circle cx="22" cy="22" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" ${x}/>`;
  const star=(cx,cy,r,c='#fff')=>`<path d="M${cx} ${cy-r} L${cx+r*.25} ${cy-r*.25} L${cx+r} ${cy} L${cx+r*.25} ${cy+r*.25} L${cx} ${cy+r} L${cx-r*.25} ${cy+r*.25} L${cx-r} ${cy} L${cx-r*.25} ${cy-r*.25} Z" fill="${c}"/>`;
  const spiral=(c=col)=>`<path d="M22 22 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a9 9 0 1 1 -9 -9 a13 13 0 1 1 13 13" stroke="${c}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
  const mount=(c='#8a7a6a')=>`<path d="M4 38 L15 16 L22 26 L29 12 L40 38 Z" fill="${c}" stroke="${ink}" stroke-width="1.2"/><path d="M29 12 L26 18 L30 20" stroke="#f4f4f8" stroke-width="2" fill="none"/>`;
  const num=(t,x=33,y=40,c=gold)=>`<text x="${x}" y="${y}" font-family="sans-serif" font-size="10" font-weight="900" fill="${c}" stroke="${ink}" stroke-width="2.4" paint-order="stroke" text-anchor="middle">${t}</text>`;
  const speed=(c=col)=>L(4,14,12,14,c,1.6,'stroke-opacity=".7"')+L(2,20,11,20,c,1.6,'stroke-opacity=".7"')+L(5,26,12,26,c,1.6,'stroke-opacity=".7"');
  const tiger=`<g transform="translate(22 22)"><path d="M-12 -2 Q-12 -13 0 -13 Q12 -13 12 -2 Q12 10 0 11 Q-12 10 -12 -2 Z" fill="#ff9b3a" stroke="${ink}" stroke-width="1.2"/><path d="M-3 -13 L-1 -7 M3 -13 L1 -7 M-12 -3 L-6 -2 M12 -3 L6 -2 M-11 4 L-6 3 M11 4 L6 3" stroke="${ink}" stroke-width="1.6"/><circle cx="-4" cy="0" r="1.5" fill="${ink}"/><circle cx="4" cy="0" r="1.5" fill="${ink}"/><path d="M-3 5 Q0 8 3 5" stroke="${ink}" stroke-width="1.2" fill="none"/></g>`;
  const hornet=`<g transform="translate(22 23)"><ellipse cx="-7" cy="-8" rx="7" ry="4" fill="#ffffff" fill-opacity=".6" stroke="${ink}" stroke-width=".8"/><ellipse cx="7" cy="-8" rx="7" ry="4" fill="#ffffff" fill-opacity=".6" stroke="${ink}" stroke-width=".8"/><ellipse cx="0" cy="2" rx="7" ry="10" fill="#ffe24a" stroke="${ink}" stroke-width="1.2"/><path d="M-6 0 H6 M-6 5 H6" stroke="${ink}" stroke-width="2.2"/><path d="M0 12 L0 16" stroke="${ink}" stroke-width="1.6"/></g>`;
  const rock=`<path d="M8 34 L12 16 L22 10 L33 15 L37 33 Z" fill="#b8b0a2" stroke="${ink}" stroke-width="1.2"/><path d="M12 16 L22 22 L33 15 M22 22 L22 34" stroke="#8a8274" stroke-width="1.2" fill="none"/>`;
  const fall=`<path d="M6 6 Q4 24 8 40 M14 4 Q12 24 15 40 M30 4 Q32 24 29 40 M38 6 Q40 24 36 40" stroke="#9fd8ff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const conch=`<path d="M10 30 Q8 12 26 8 Q36 8 36 18 Q34 30 18 34 Z" fill="#f4e6d0" stroke="${ink}" stroke-width="1.2"/><path d="M14 28 Q14 16 26 13 M18 30 Q20 20 30 18" stroke="#c89a6a" stroke-width="1.4" fill="none"/><path d="M36 18 L41 14" stroke="${ink}" stroke-width="2"/>`;
  const G={
    gnStaff:staff(9,36,35,9)+`<path d="M8 22 Q16 10 30 8" stroke="${col}" stroke-width="1.6" fill="none" stroke-opacity=".7"/>`,
    gnHair:hair(12,12,-30)+hair(18,8,-10)+gh(25,26,.8),
    gnCloud:cloud(22,28,1.2)+head(22,15,.55),
    gnBand:`<path d="M6 26 Q22 4 38 26" stroke="${gold}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M17 15 q5 -6 10 0 q-5 4 -10 0" fill="${gold}" stroke="${ink}" stroke-width=".8"/>`+speed(),
    gnPeach:peach(22,23,1.4)+star(34,10,4,'#fff'),
    gnSub:head(16,22,.75)+gh(28,22,.75)+L(22,8,22,36,col,1.4,'stroke-dasharray="3 2"'),
    gnEyes:eye(),
    gnForge:flame(22,26,1.4)+`<path d="M8 38 H36" stroke="#8a5a2a" stroke-width="3"/>`,
    gaSmash:`<rect x="16" y="4" width="12" height="28" rx="3" fill="#6b4628" stroke="${ink}" stroke-width="1.2"/><rect x="15" y="8" width="14" height="3" fill="${gold}"/><rect x="15" y="26" width="14" height="3" fill="${gold}"/>`+`<path d="M6 38 Q22 30 38 38" stroke="${col}" stroke-width="2.4" fill="none"/>`,
    gaRhythm:gh(30,20,.7)+staff(28,24,6,34,2.6)+num('3'),
    gaHavoc:(()=>{let h='';for(let i=0;i<10;i++){const a=-Math.PI*.9+i/9*Math.PI*.8;h+=`<rect x="${(22+Math.cos(a)*14-2).toFixed(1)}" y="${(28+Math.sin(a)*14-2).toFixed(1)}" width="4" height="4" fill="${i<7?'#ff8a3a':'#5a3a20'}" transform="rotate(45 ${(22+Math.cos(a)*14).toFixed(1)} ${(28+Math.sin(a)*14).toFixed(1)})"/>`;}return h+head(22,28,.6,fur,gold,'#ff5a3a');})(),
    gaNeedle:L(6,36,34,10,'#fff',1.6)+star(34,10,5,gold)+L(8,30,12,26,col,1,'stroke-opacity=".6"'),
    gaThousand:gh(10,14,.5)+gh(34,14,.5)+gh(22,36,.5)+ring(6,'#ff8a3a',2)+num('6',22,26,'#fff'),
    gaTreasure:`<path d="M22 6 Q30 14 22 22 Q14 30 22 38" stroke="#7fd0ff" stroke-width="2.4" fill="none"/>`+staff(10,38,34,8,3.4),
    gaLeap:head(22,12,.6)+`<path d="M10 20 Q22 2 34 20" stroke="${col}" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>`+L(6,38,38,38,'#c8a070',3)+L(22,30,22,38,col,2),
    gaQuake:`<path d="M4 34 H40" stroke="#8a6a4a" stroke-width="3"/><path d="M22 34 L18 26 L24 20 L19 12 M22 34 L28 28 L26 22" stroke="${col}" stroke-width="1.8" fill="none"/>`+star(22,34,5,'#fff'),
    gaSplit:mount()+L(28,6,16,40,'#ff8a3a',3)+L(28,6,16,40,'#fff',1.2),
    gaUnbound:mount('#6a5a4a')+gh(30,26,.55)+`<path d="M6 10 L12 4 M38 10 L32 4" stroke="${col}" stroke-width="1.6"/>`,
    gaShift:staff(6,30,24,12,2.6)+staff(20,38,40,18,2.6,'#ff8a3a')+`<path d="M8 8 h8 M12 4 v8" stroke="${col}" stroke-width="1.6"/>`,
    gaWill:spiral(gold)+staff(14,32,30,14,2.2),
    gaPillar:cloud(22,10,.9,'#ffe8a0')+staff(22,14,22,40,4.2),
    gaRebel:head(22,24,1.05,fur,'#ff5a3a','#ff6a4a')+`<path d="M12 9 L16 14 M32 9 L28 14 M22 5 L22 11" stroke="#ff8a3a" stroke-width="2"/>`,
    gaUlt:`<circle cx="22" cy="22" r="15" fill="#ffd24a" fill-opacity=".18"/>`+head(22,24,1.1,'#ffe48a',gold,'#ff9a5a')+star(34,8,5,'#fff'),
    gaEqual:head(13,24,.55)+gh(31,24,.55)+gh(22,13,.55)+staff(6,40,38,40,2.4),
    gbBlow:head(14,24,.65)+hair(26,16,0)+hair(31,22,10)+hair(27,28,-10)+gh(37,22,.35),
    gbPile:gh(22,30,.6)+gh(14,18,.45)+gh(30,16,.45)+gh(22,8,.4)+`<path d="M6 40 H38" stroke="${col}" stroke-width="2"/>`,
    gbCopy:head(14,24,.6)+gh(30,24,.6)+`<path d="M18 36 h8 M24 33 l3 3 l-3 3" stroke="${col}" stroke-width="1.6" fill="none"/>`,
    gbDecoy:rock+gh(22,22,.45),
    gbForm:tiger.replace('translate(22 22)','translate(14 14) scale(.55)')+hornet.replace('translate(22 23)','translate(31 15) scale(.55)')+`<g transform="translate(13 22) scale(.6)">${rock}</g>`,
    gbMaster:spiral(gold)+gh(22,22,.55),
    gbWhirl:spiral()+gh(22,22,.45),
    gbRecall:ring(16,col,1.6,'stroke-dasharray="4 3"')+head(22,22,.65)+hair(8,10,40)+hair(36,10,-40)+hair(8,34,-40)+hair(36,34,40),
    gbMob:`<circle cx="22" cy="24" r="12" fill="#5a4a3a" stroke="${ink}" stroke-width="1.2"/>`+gh(14,14,.4)+gh(30,14,.4)+gh(12,30,.4)+gh(32,30,.4),
    gbCling:`<circle cx="22" cy="24" r="12" fill="#5a4a3a" stroke="${ink}" stroke-width="1.2"/>`+gh(22,16,.45)+`<path d="M12 34 L32 14" stroke="#ff6a4a" stroke-width="2.4"/>`+num('−DEF',22,42,'#ff8a6a'),
    gbCave:fall+`<ellipse cx="22" cy="36" rx="14" ry="4" fill="#7fd0ff" fill-opacity=".5"/>`+gh(22,26,.4),
    gbCourt:gh(10,30,.4)+gh(18,30,.4)+gh(26,30,.4)+gh(34,30,.4)+`<path d="M12 12 L16 6 L22 11 L28 6 L32 12 Z" fill="${gold}" stroke="${ink}" stroke-width="1"/>`,
    gbBarrage:(()=>{let h='';for(let i=0;i<6;i++){const a=i/6*Math.PI*2;h+=gh(22+Math.cos(a)*13,22+Math.sin(a)*13,.32);}return h+star(22,22,6,'#fff');})(),
    gbGold:gh(22,22,1)+star(34,9,4,'#fff')+star(9,32,3,'#fff'),
    gbUlt:conch+gh(36,34,.35)+gh(30,38,.3),
    gbHandsome:head(22,22,1,fur,gold,face)+`<path d="M10 10 L14 4 L18 9 L22 3 L26 9 L30 4 L34 10 Z" fill="${gold}" stroke="${ink}" stroke-width="1"/>`,
    gxStaff:staff(4,40,40,4,3.6)+`<path d="M6 26 Q20 6 38 4" stroke="#ff8a3a" stroke-width="2" fill="none"/>`,
    gxSix:gh(22,24,.75)+gh(12,22,.45)+gh(32,22,.45)+L(6,10,14,16,col,1.4)+L(38,10,30,16,col,1.4)+L(22,4,22,12,col,1.4),
    gxFur:(()=>{let h='';for(let i=0;i<8;i++){const a=i/8*Math.PI*2;h+=hair(22+Math.cos(a)*14,22+Math.sin(a)*14,a*57);}return h+gh(22,22,.55);})(),
    gxLi:cloud(16,30,.9)+speed()+`<path d="M24 14 L38 8" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 2"/>`+num('∞',30,24),
    gxHavoc:(()=>{let h='';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;h+=`<rect x="${(22+Math.cos(a)*15-1.8).toFixed(1)}" y="${(22+Math.sin(a)*15-1.8).toFixed(1)}" width="3.6" height="3.6" fill="#ff8a3a"/>`;}return h+head(22,22,.6,fur,gold,'#ff5a3a');})(),
    gxCount:gh(14,22,.45)+gh(30,22,.45)+num('+2',22,40),
    gxPeach:peach(14,24,.9)+peach(30,24,.9)+speed(gold),
    gxSky:cloud(22,8,.8,'#ffe8a0')+staff(8,14,14,38,2.2)+staff(22,12,22,40,2.2)+staff(36,14,30,38,2.2),
    gxTwo:tiger.replace('translate(22 22)','translate(13 22) scale(.6)')+`<g transform="translate(31 22) scale(.6)">${rock}</g>`,
    gxFurnace:flame(14,26,1)+flame(30,26,1)+head(22,22,.6,'#ffe48a',gold,'#ff7a4a'),
    gxBang:`<rect x="14" y="2" width="16" height="34" rx="3" fill="#6b4628" stroke="${ink}" stroke-width="1.2"/><rect x="13" y="6" width="18" height="4" fill="${gold}"/><rect x="13" y="28" width="18" height="4" fill="${gold}"/>`+mount('#7a6a5a').replace('M4 38','M4 42'),
    gxStorm:spiral(gold)+(()=>{let h='';for(let i=0;i<5;i++){const a=i/5*Math.PI*2;h+=gh(22+Math.cos(a)*15,22+Math.sin(a)*15,.28);}return h;})()
  };
  const g=G[k]||head(22,22,.9);
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const au=d.auto?`<circle cx="37" cy="7" r="5" fill="#ffd24a" stroke="${ink}" stroke-width="1"/><path d="M34.5 7 h5 M37 4.5 v5" stroke="${ink}" stroke-width="1.4"/>`:'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><defs><radialGradient id="g" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="${col}" stop-opacity=".22"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><rect width="44" height="44" rx="7" fill="${bg}"/><rect width="44" height="44" rx="7" fill="url(#g)"/>${g}${ult}${au}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);SKILL_ICON_ART[d.name]=fb;
    if(WK_ICONS_PAINTED){const src='assets/icons/wukong/'+d.key+'.webp',im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}}
  return ['star',col,bg];}

