/* =====================================================================
   AETHERFALL — GOLDEN-FLEECE SHEEP · "Chrysie" (Greece) — 12 Tails style
   Character module. Loaded only when the Sheep is played; index.html calls installSheep().

     Basic  · Arcadian Lamb        — staff combo, Light Ball (auto-charge), Woolly Hop, Divine Channel, Free Cast, Gentle Presence, Golden Fleece
     A Tree · Asclepian Healer     — heals, shields, holy light. [Shear] skills spend GOLDEN WOOL for stronger heals / shields
     B Tree · Medea's Enchanter    — songs, curses, buffs. ENCHANT stacks on enemies → SPELLBOUND
     C Tree · Golden Wing          — 12 Tails "Additions": 4 upgrades each for Basic / A / B at Lv 55 / 60 / 70 / 80

   GOLDEN WOOL 0–5: grows on its own; each layer: damage taken −4 per hit. [Shear] uses all layers for a bigger heal / shield.
   ENCHANT 0–3 on an enemy: B skills add layers; at 3 the enemy is SPELLBOUND for 5 s (slowed, our TAL +30 against it).
   All damage is magic (TAL). Heals and shields are written as TAL×n. Owner's rules: no percent effects; counters instead of chances.
   Sprites: placeholder drawn in code (assets_sheep.js, tools/statichero.py).
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const SP_BAL={
  wool:{cap:5,block:4},
  enc:{need:3,bound:5,tal:30},
  sk:{
    // ---- Basic
    snCombo:{chain:[2,3,3],hit:1.0,fin:1.3},
    snLight:{dmg:[1.4,1.9,2.6],charge:.8,cd:4,mp:10,range:300},
    snHop:{dist:120,iframe:.25,cd:[6,4],mp:6},
    snChannel:{heal:[1.2,1.8,2.5],cd:12,mp:14},
    snFree:{every:[8,6]},
    snPresence:{cut:[30,50]},
    snFleece:{every:[4,3,2.5]},
    // ---- A · Asclepian Healer
    saHymn:{heal:[1.5,1.8,2.1,2.4],T:3,cd:10,mp:16},
    saRod:{add:[.1,.2]},
    saSun:{dmg:[1.6,1.9,2.2],len:240,heal:.2,cd:7,mp:14,range:240},
    saEcho:{dmg:1.2,heal:.2,mp:8},
    saShield:{base:[1.2,1.5,1.8],per:.5,T:8,cd:14,mp:16},
    saGrace:{add:[.1,.15,.2,.25]},
    saAegis:{block:[10,18],dur:12,cd:30,mp:16},
    saSanct:{R:130,T:8,heal:.25,cd:20,mp:20,range:260},
    saPurify:{heal:1.0,dmg:1.4,R:100,cd:12,mp:16},
    saRain:{R:160,T:4,heal:.15,dmg:.4,mp:10},
    saRegrow:{cut:[.5,1],heal:.15},
    saHermes:{move:40,dur:8,heal:.05,cd:25,mp:12},
    saCup:{cap:[300,600]},
    saHand:{heal:4.0,per:.8,hot:1.5,T:5,cd:45,mp:30},
    saOlympus:{dur:12,heal:.3,block:20,fin:3.0,dmg:5.0,R:160,cd:70,mp:60},
    // ---- B · Medea's Enchanter
    sbThread:{dmg:[1.5,1.8,2.0,2.3],len:240,cd:5,mp:10,range:240},
    sbLore:{tal:[8,16]},
    sbLullaby:{dmg:1.4,R:140,half:.75,cd:8,mp:14,range:140},
    sbShatter:{dmg:2.5,per:.6,mp:10},
    sbHex:{R:90,atk:15,def:10,T:6,cd:12,mp:14,range:200},
    sbSong:{tal:[20,35],dur:15,cd:30,mp:16},
    sbMirror:{every:[8,5],dmg:.5},
    sbRam:{dmg:2.0,len:280,cd:10,mp:18,range:280},
    sbSleep:{R:140,T:3,tal:20,cd:14,mp:20,range:260},
    sbFate:{T:6,share:.3,mp:10},
    sbBinder:{t:[2,4],tal:[10,20]},
    sbSiren:{R:200,dmg:1.8,cd:16,mp:20,range:260},
    sbHarmony:{per:[6,10]},
    sbCauldron:{dmg:4.2,R:120,cd:20,mp:28,range:260},
    sbColchis:{dur:12,bolt:1.5,tal:40,fin:4.0,R:80,cd:70,mp:60},
    // ---- C · Golden Wing (Additions)
    scPrism:{n:3,mul:.5},
    scLasting:{hot:1.0,T:3,sp:40},
    scShearing:{T:6,heal:.1,dmg:.8,R:120,cd:30,mp:16},
    scCloud:{T:3,move:60,R:100,dmg:.6,cd:20,mp:14},
    scChorus:{per:.2},
    scChariot:{dmg:1.5,n:3,R:150,heal:1.0,cd:20,mp:20},
    scGorgon:{dmg:.4,every:3},
    scWell:{cd:32},
    scNeedle:{pierce:3},
    scCharm:{T:6,hit:.6,slow:3,cd:25,mp:18,range:220},
    scSlumber:{t:1,tal:15},
    scSirens:{T:8,n:3,dmg:.6,pull:20,R:160,cd:30,mp:22}
  }};
const SB=SP_BAL.sk;
/* per-branch damage scale (2026-11-21, like KI_SCALE / BA_SCALE): once the bench kept the sheep's core ticker alive and Thread of Fate
   was fixed, each branch benched alone (owner's rule for pure heroes with two same-stat branches) gave A 2,593 · B 5,667 against
   the 2,450 target — B stacks many flat TAL bonuses (Spellbound, sleep, Lore, Harmony, War Song, Colchis). The scale is applied once
   here to each branch's damage numbers, so every tooltip shows the real TAL×n. Bench: HERO=sheep COL=sBranch tools/qa/bench_branch.py all,A,B 8 */
const SP_SCALE={A:.94,B:.215};
(()=>{const sc=(k,f,keys)=>{for(const q of keys){const v=SB[k][q];SB[k][q]=Array.isArray(v)?v.map(x=>+(x*f).toFixed(3)):+(v*f).toFixed(3);}};
  for(const [k,q] of [['saSun',['dmg']],['saEcho',['dmg']],['saPurify',['dmg']],['saRain',['dmg']],['saOlympus',['dmg']],['scChariot',['dmg']],['scGorgon',['dmg']]])sc(k,SP_SCALE.A,q);
  for(const [k,q] of [['sbThread',['dmg']],['sbLullaby',['dmg']],['sbShatter',['dmg','per']],['sbRam',['dmg']],['sbSiren',['dmg']],['sbCauldron',['dmg']],['sbColchis',['bolt','fin']],['sbMirror',['dmg']],['scCharm',['hit']],['scSirens',['dmg']]])sc(k,SP_SCALE.B,q);})();
const sT=n=>'TAL×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const SP_DEFS=[
 // ---------------- BASIC · ARCADIAN LAMB ----------------
 {key:'snCombo',id:'SP-N01',name:'Crook Combo',br:'basic',row:1,max:3,passive:1,d:'(ตีปกติ) ฟาดไม้เท้าคนเลี้ยงแกะ จังหวะสุดท้ายยิงลูกแสงเล็ก',lv:i=>[`ต่อได้ ${SB.snCombo.chain[i-1]} จังหวะ`,`จังหวะละ ${sT(SB.snCombo.hit)}`,`ลูกแสงปิด ${sT(SB.snCombo.fin)}`]},
 {key:'snLight',id:'SP-N02',name:'Light Ball',br:'basic',row:1,max:3,type:'melee',d:'[ชาร์จ] รวมแสงที่ฝ่ามือแล้วปล่อยเป็นลูกแสง',lv:i=>[`${sT(SB.snLight.dmg[i-1])} (ชาร์จ ${SB.snLight.charge} วิ)`,'Cooldown 4 วิ']},
 {key:'snHop',id:'SP-N03',name:'Woolly Hop',br:'basic',row:2,max:2,type:'self',d:'กระโดดหลบตัวฟู',lv:i=>[`ระยะ ${SB.snHop.dist}`,`อมตะ ${SB.snHop.iframe} วิ`,`Cooldown ${SB.snHop.cd[i-1]} วิ`]},
 {key:'snChannel',id:'SP-N04',name:'Divine Channel',br:'basic',row:2,max:3,type:'self',d:'ส่งพรศักดิ์สิทธิ์ ฟื้น HP ทันที',lv:i=>[`ฟื้น HP ${sT(SB.snChannel.heal[i-1])}`,'Cooldown 12 วิ']},
 {key:'snFree',id:'SP-N05',name:'Free Cast',br:'basic',row:3,max:2,passive:1,d:'(Passive) ใช้สกิลครบจำนวนครั้ง ครั้งถัดไปคืน SP ให้ทั้งหมด',lv:i=>[`ทุก ${SB.snFree.every[i-1]} สกิล`]},
 {key:'snPresence',id:'SP-N06',name:'Gentle Presence',br:'basic',row:3,max:2,passive:1,d:'(Passive) ใจอ่อนโยน มอนสายดุเห็นแกะในระยะสั้นลง',lv:i=>[`ระยะที่มอนเห็น −${SB.snPresence.cut[i-1]}`]},
 {key:'snFleece',id:'SP-N07',name:'Golden Fleece',br:'basic',row:4,max:3,passive:1,d:'(Passive) เปิดระบบขนทอง ขนงอกเองจนเต็ม 5 ชั้น แต่ละชั้นลดดาเมจที่ได้รับ',lv:i=>[`ขนงอก 1 ชั้น ทุก ${SB.snFleece.every[i-1]} วิ`,`ชั้นละ ดาเมจที่ได้รับ −${SP_BAL.wool.block} ต่อครั้ง`]},
 // ---------------- A · ASCLEPIAN HEALER ----------------
 {key:'saHymn',id:'SP-A01',name:'Healing Hymn',br:'A',row:1,max:4,type:'self',d:'เพลงรักษา ฟื้น HP ต่อเนื่อง (อัปสลับเลเวลกับ Fleece Shield)',lv:i=>[`ฟื้น HP ${sT(SB.saHymn.heal[i-1])} ใน ${SB.saHymn.T} วิ`,'Cooldown 10 วิ']},
 {key:'saRod',id:'SP-A02',name:'Rod of Asclepius',br:'A',row:1,max:2,passive:1,d:'(Passive) คทาแอสคลีปิอุส ทุกฮีลแรงขึ้น',lv:i=>[`ฮีลทุกอัน +${sT(SB.saRod.add[i-1])}`]},
 {key:'saSun',id:'SP-A03',name:'Sunbeam of Apollo',br:'A',row:2,max:3,type:'melee',d:'ลำแสงอะพอลโลเป็นแนว ฟื้น HP ตามจำนวนที่โดน โดนแล้วกดซ้ำเพื่อใช้ Radiant Echo',lv:i=>[`${sT(SB.saSun.dmg[i-1])} ยาว ${SB.saSun.len}`,`ฟื้น HP ${sT(SB.saSun.heal)} ต่อตัวที่โดน`]},
 {key:'saEcho',id:'SP-A04',name:'Radiant Echo',br:'A',row:2,max:1,parent:'saSun',d:'(ท่าต่อ) ลำแสงสะท้อนกลับ',lv:()=>[`${sT(SB.saEcho.dmg)}`,`ฟื้น HP ${sT(SB.saEcho.heal)} ต่อตัว`]},
 {key:'saShield',id:'SP-A05',name:'Fleece Shield',br:'A',row:3,max:3,type:'self',pre:[['saHymn',1]],d:'[ตัดขน] ถักขนทองเป็นโล่',lv:i=>[`โล่ ${sT(SB.saShield.base[i-1])} + ${sT(SB.saShield.per)} ต่อขน 1 ชั้น`,`${SB.saShield.T} วิ`]},
 {key:'saGrace',id:'SP-A06',name:"Shepherd's Grace",br:'A',row:3,max:4,passive:1,d:'(Passive) HP ต่ำกว่าครึ่ง ฮีลแรงขึ้น',lv:i=>[`ฮีลทุกอัน +${sT(SB.saGrace.add[i-1])} (HP ต่ำกว่าครึ่ง)`]},
 {key:'saAegis',id:'SP-A07',name:'Aegis of Athena',br:'A',row:4,max:2,type:'self',d:'โล่เอจิสของอาธีนา ลดดาเมจและไม่ติดชะงัก',lv:i=>[`ดาเมจที่ได้รับ −${SB.saAegis.block[i-1]} ต่อครั้ง`,`${SB.saAegis.dur} วิ`]},
 {key:'saSanct',id:'SP-A08',name:'Sanctuary',br:'A',row:4,max:2,type:'ground',pre:[['saShield',1]],d:'วงเสาหินอ่อนศักดิ์สิทธิ์ ในวงฟื้น HP ศัตรูที่เข้ามาเดินช้า',lv:i=>[`รัศมี ${SB.saSanct.R} นาน ${SB.saSanct.T} วิ`,`ฟื้น HP ${sT(SB.saSanct.heal)} ต่อวิ`]},
 {key:'saPurify',id:'SP-A09',name:'Purifying Light',br:'A',row:5,max:3,type:'self',d:'แสงชำระ ล้างดีบัฟ ฟื้น HP และแผดแสงรอบตัว กดซ้ำเพื่อใช้ Blessed Rain',lv:i=>[`ฟื้น HP ${sT(SB.saPurify.heal)}`,`แสงรอบตัว ${sT(SB.saPurify.dmg)} รัศมี ${SB.saPurify.R}`]},
 {key:'saRain',id:'SP-A10',name:'Blessed Rain',br:'A',row:5,max:1,parent:'saPurify',d:'(ท่าต่อ) ฝนทองตกรอบตัว ฟื้น HP และแผดศัตรู',lv:()=>[`${SB.saRain.T} วิ รัศมี ${SB.saRain.R}`,`ฟื้น ${sT(SB.saRain.heal)} · ศัตรู ${sT(SB.saRain.dmg)} ทุก 0.5 วิ`]},
 {key:'saRegrow',id:'SP-A11',name:'Wool Regrowth',br:'A',row:6,max:2,passive:1,d:'(Passive) ขนงอกไวขึ้น ตัดขนแล้วฟื้น HP',lv:i=>[`ขนงอกเร็วขึ้น ${SB.saRegrow.cut[i-1]} วิ`,`ตัดขน ฟื้น HP ${sT(SB.saRegrow.heal)} ต่อชั้น`]},
 {key:'saHermes',id:'SP-A12',name:"Hermes' Sandals",br:'A',row:6,max:1,type:'self',pre:[['saSanct',1]],d:'รองเท้าเฮอร์มีส เดินเร็ว ทิ้งรอยเท้าทองที่ฟื้น HP เมื่อเดินทับ',lv:()=>[`เดิน +${SB.saHermes.move} · ${SB.saHermes.dur} วิ`,`รอยเท้าละ ${sT(SB.saHermes.heal)}`]},
 {key:'saCup',id:'SP-A13',name:'Overflowing Cup',br:'A',row:7,max:2,passive:1,d:'(Passive) ฮีลเกิน HP เต็ม กลายเป็นโล่',lv:i=>[`โล่สูงสุด ${SB.saCup.cap[i-1]}`]},
 {key:'saHand',id:'SP-A14',name:'Hand of Asclepius',br:'A',row:7,max:1,type:'self',pre:[['saRegrow',1]],d:'[ตัดขน] หัตถ์แอสคลีปิอุส ฮีลก้อนใหญ่แล้วฟื้นต่อ',lv:()=>[`ฟื้นทันที ${sT(SB.saHand.heal)} + ${sT(SB.saHand.per)} ต่อขน 1 ชั้น`,`ฟื้นต่อ ${sT(SB.saHand.hot)} ใน ${SB.saHand.T} วิ`,'Cooldown 45 วิ']},
 {key:'saOlympus',id:'SP-A15',name:'Blessing of Olympus',br:'A',row:8,max:1,type:'self',ult:1,pre:[['saHand',1],['saRain',1]],d:'ULTIMATE A · ออร่าทองแห่งโอลิมปัส ฟื้น HP ต่อเนื่อง ทุกสกิลไม่เสีย SP จบด้วยฮีลใหญ่และเสาแสง',lv:()=>[`${SB.saOlympus.dur} วิ · ฟื้น ${sT(SB.saOlympus.heal)}/วิ · ดาเมจที่ได้รับ −${SB.saOlympus.block}`,`จบ: ฟื้น ${sT(SB.saOlympus.fin)} · เสาแสง ${sT(SB.saOlympus.dmg)} รัศมี ${SB.saOlympus.R}`]},
 // ---------------- B · MEDEA'S ENCHANTER ----------------
 {key:'sbThread',id:'SP-B01',name:'Golden Thread',br:'B',row:1,max:4,type:'melee',d:'ยิงด้ายมนตร์ทองคำ +1 มนตร์ (อัปสลับเลเวลกับ Hex of Weakness)',lv:i=>[`${sT(SB.sbThread.dmg[i-1])} ยาว ${SB.sbThread.len}`,'+1 มนตร์']},
 {key:'sbLore',id:'SP-B02',name:'Colchis Lore',br:'B',row:1,max:2,passive:1,d:'(Passive) ตำราคอลคิส สกิล B แรงขึ้น',lv:i=>[`TAL +${SB.sbLore.tal[i-1]} (สกิล B)`]},
 {key:'sbLullaby',id:'SP-B03',name:'Lullaby',br:'B',row:2,max:3,type:'melee',d:'เพลงกล่อมเป็นรูปพัด ศัตรูช้า +1 มนตร์ กดซ้ำเพื่อใช้ Dream Shatter',lv:i=>[`${sT(SB.sbLullaby.dmg)} รัศมี ${SB.sbLullaby.R}`,'สโลว์ 2.5 วิ · +1 มนตร์']},
 {key:'sbShatter',id:'SP-B04',name:'Dream Shatter',br:'B',row:2,max:1,parent:'sbLullaby',d:'(ท่าต่อ) ปลุกฝัน ระเบิดใส่เป้าที่ช้าอยู่ ใช้มนตร์ทั้งหมดบนเป้า',lv:()=>[`${sT(SB.sbShatter.dmg)} + ${sT(SB.sbShatter.per)} ต่อมนตร์ 1 ชั้น`]},
 {key:'sbHex',id:'SP-B05',name:'Hex of Weakness',br:'B',row:3,max:2,type:'ground',pre:[['sbThread',1]],d:'คำสาปอ่อนแรง ศัตรูตีเบาลงและ DEF ลด +1 มนตร์',lv:i=>[`รัศมี ${SB.sbHex.R} · ${SB.sbHex.T} วิ`,`ศัตรูตี −${SB.sbHex.atk} · DEF −${SB.sbHex.def}`,'+1 มนตร์']},
 {key:'sbSong',id:'SP-B06',name:'War Song',br:'B',row:3,max:2,type:'self',d:'เพลงศึก TAL เพิ่ม',lv:i=>[`TAL +${SB.sbSong.tal[i-1]}`,`${SB.sbSong.dur} วิ`]},
 {key:'sbMirror',id:'SP-B07',name:'Mirror Fleece',br:'B',row:4,max:2,passive:1,d:'(Passive) ขนกระจก โดนตีครบจำนวนครั้ง สะท้อนดาเมจและใส่มนตร์คนตี',lv:i=>[`ทุก ${SB.sbMirror.every[i-1]} ครั้งที่โดนตี`,`สะท้อน ${sT(SB.sbMirror.dmg)} · +1 มนตร์`]},
 {key:'sbRam',id:'SP-B08',name:'Golden Ram',br:'B',row:4,max:2,type:'melee',pre:[['sbHex',1]],d:'เรียกวิญญาณแกะทองคำพุ่งชนเป็นแนว',lv:()=>[`${sT(SB.sbRam.dmg)} ยาว ${SB.sbRam.len}`,'ยกลอย']},
 {key:'sbSleep',id:'SP-B09',name:"Dragon's Sleep",br:'B',row:5,max:3,type:'ground',d:'(มีเดียกล่อมมังกรเฝ้าขนแกะ) ศัตรูในวงช้ามาก และโดนแรงขึ้น +1 มนตร์ กดซ้ำเพื่อใช้ Thread of Fate',lv:i=>[`รัศมี ${SB.sbSleep.R} · ${SB.sbSleep.T} วิ`,`TAL +${SB.sbSleep.tal} ใส่ตัวที่หลับ`,'+1 มนตร์']},
 {key:'sbFate',id:'SP-B10',name:'Thread of Fate',br:'B',row:5,max:1,parent:'sbSleep',d:'(ท่าต่อ) ผูกด้ายชะตาศัตรูทุกตัวในวง ตีตัวหนึ่ง ตัวอื่นโดนด้วย',lv:()=>[`${SB.sbFate.T} วิ`,`ตัวอื่นโดน ×${SB.sbFate.share} ของดาเมจ`]},
 {key:'sbBinder',id:'SP-B11',name:'Spellbinder',br:'B',row:6,max:2,passive:1,d:'(Passive) ติดมนตร์นานขึ้นและโดนแรงขึ้น',lv:i=>[`ติดมนตร์นานขึ้น ${SB.sbBinder.t[i-1]} วิ`,`TAL +${SB.sbBinder.tal[i-1]} ใส่ตัวที่ติดมนตร์`]},
 {key:'sbSiren',id:'SP-B12',name:"Siren's Call",br:'B',row:6,max:1,type:'ground',pre:[['sbSleep',1]],d:'เสียงไซเรนดึงศัตรูรอบๆ เข้าหาจุดเดียว +1 มนตร์',lv:()=>[`รัศมี ${SB.sbSiren.R}`,`${sT(SB.sbSiren.dmg)} · +1 มนตร์`]},
 {key:'sbHarmony',id:'SP-B13',name:'Enchanted Harmony',br:'B',row:7,max:2,passive:1,d:'(Passive) บัฟที่มีอยู่บนตัว ทำให้สกิล B แรงขึ้น',lv:i=>[`TAL +${SB.sbHarmony.per[i-1]} ต่อบัฟ 1 ชิ้น (สกิล B)`]},
 {key:'sbCauldron',id:'SP-B14',name:"Medea's Cauldron",br:'B',row:7,max:1,type:'ground',pre:[['sbBinder',1]],d:'ขว้างหม้อยามีเดียเดือด ติดอ่อนแรงและช้า +2 มนตร์',lv:()=>[`${sT(SB.sbCauldron.dmg)} รัศมี ${SB.sbCauldron.R}`,'+2 มนตร์']},
 {key:'sbColchis',id:'SP-B15',name:'Fleece of Colchis',br:'B',row:8,max:1,type:'self',ult:1,pre:[['sbCauldron',1],['sbFate',1]],d:'ULTIMATE B · ขนแกะทองคำแห่งคอลคิสลอยเหนือหัว ยิงแสงใส่ศัตรูทุกวิ จบแล้วศัตรูที่ติดมนตร์ระเบิด',lv:()=>[`${SB.sbColchis.dur} วิ · แสงทอง ${sT(SB.sbColchis.bolt)}/วิ +1 มนตร์`,`TAL +${SB.sbColchis.tal}`,`ระเบิด ${sT(SB.sbColchis.fin)} ต่อตัวที่ติดมนตร์`]},
 // ---------------- C · GOLDEN WING ----------------
 {key:'scPrism',id:'SP-C01',name:'Prism Ball',br:'C',tier:1,col:'basic',passive:1,pre:[['snLight',3]],d:'ลูกแสงโดนเป้าแล้วแตกเป็น 3 ลูกใส่ตัวรอบๆ',lv:()=>[`ลูกละ ×${SB.scPrism.mul} ของท่า`]},
 {key:'scChorus',id:'SP-C02',name:'Hymn Chorus',br:'C',tier:1,col:'A',passive:1,pre:[['saHymn',4]],d:'Healing Hymn ฟื้นเพิ่มตามขนที่มี (ไม่ใช้ขน)',lv:()=>[`+${sT(SB.scChorus.per)} ต่อขน 1 ชั้น`]},
 {key:'scNeedle',id:'SP-C03',name:'Golden Needle',br:'C',tier:1,col:'B',passive:1,pre:[['sbThread',4]],d:'Golden Thread ทะลุได้หลายตัว ใส่มนตร์ทุกตัว',lv:()=>[`ทะลุ ${SB.scNeedle.pierce} ตัว`]},
 {key:'scLasting',id:'SP-C04',name:'Lasting Grace',br:'C',tier:2,col:'basic',passive:1,pre:[['snChannel',3]],d:'Divine Channel ฟื้นต่อและคืน SP',lv:()=>[`ฟื้นต่อ ${sT(SB.scLasting.hot)} ใน ${SB.scLasting.T} วิ`,`SP +${SB.scLasting.sp}`]},
 {key:'scChariot',id:'SP-C05',name:'Sun Chariot',br:'C',tier:2,col:'A',pre:[['saSun',3]],d:'[New Active] รถม้าสุริยะ ลำแสงกวาดครึ่งวงรอบตัว 3 ครั้ง',lv:()=>[`${SB.scChariot.n} ครั้ง ครั้งละ ${sT(SB.scChariot.dmg)} รัศมี ${SB.scChariot.R}`,`ฟื้น HP รวม ${sT(SB.scChariot.heal)}`,'Cooldown 20 วิ']},
 {key:'scCharm',id:'SP-C06',name:'Charm',br:'C',tier:2,col:'B',pre:[['sbHex',2]],d:'[New Active] มนตร์เสน่ห์ มอนไม่ใช่บอสกลายเป็นพวก ไปตีมอนตัวอื่น บอสโดนสโลว์แทน',lv:()=>[`${SB.scCharm.T} วิ · ตี ${sT(SB.scCharm.hit)} ต่อวิ`,`บอส: สโลว์ ${SB.scCharm.slow} วิ`,'Cooldown 25 วิ']},
 {key:'scShearing',id:'SP-C07',name:'Golden Shearing',br:'C',tier:3,col:'basic',pre:[['snFleece',3]],d:'[New Active] สลัดขนทุกชั้นเป็นลูกทองลอยรอบตัว ฟื้น HP หรือพุ่งใส่ศัตรูที่เข้าใกล้',lv:()=>[`${SB.scShearing.T} วิ · ลูกละฟื้น ${sT(SB.scShearing.heal)}/วิ`,`พุ่งใส่ ${sT(SB.scShearing.dmg)}`,'Cooldown 30 วิ']},
 {key:'scGorgon',id:'SP-C08',name:"Gorgon's Gaze",br:'C',tier:3,col:'A',passive:1,pre:[['saAegis',2]],d:'ระหว่าง Aegis สะท้อนดาเมจ ครบจำนวนครั้งคนตีติดช้า',lv:()=>[`สะท้อน ${sT(SB.scGorgon.dmg)} ต่อครั้ง`,`ทุก ${SB.scGorgon.every} ครั้ง คนตีสโลว์ 2 วิ`]},
 {key:'scSlumber',id:'SP-C09',name:'Deep Slumber',br:'C',tier:3,col:'B',passive:1,pre:[['sbSleep',3]],d:"Dragon's Sleep นานขึ้นและโดนแรงขึ้นอีก",lv:()=>[`นานขึ้น ${SB.scSlumber.t} วิ`,`TAL +${SB.scSlumber.tal}`]},
 {key:'scCloud',id:'SP-C10',name:'Woolly Cloud',br:'C',tier:4,col:'basic',pre:[['snHop',2]],d:'[New Active] กลายเป็นเมฆขนฟู ไม่โดนตี เดินเร็ว ลงมาพ่นฝุ่นกล่อมนอน',lv:()=>[`${SB.scCloud.T} วิ · เดิน +${SB.scCloud.move}`,`ลงพื้น ${sT(SB.scCloud.dmg)} รัศมี ${SB.scCloud.R} สโลว์ 2 วิ`,'Cooldown 20 วิ']},
 {key:'scWell',id:'SP-C11',name:'Wellspring',br:'C',tier:4,col:'A',passive:1,pre:[['saHand',1]],d:'Hand of Asclepius เหลือขนไว้ 1 ชั้น และคูลดาวน์สั้นลง',lv:()=>[`Cooldown ${SB.scWell.cd} วิ`]},
 {key:'scSirens',id:'SP-C12',name:'Chorus of Sirens',br:'C',tier:4,col:'B',pre:[['sbSiren',1]],d:'[New Active] เรียกเงาไซเรน 3 ตนรอบตัว ดึงศัตรูเข้าหาและใส่มนตร์',lv:()=>[`${SB.scSirens.T} วิ · ตนละ ${sT(SB.scSirens.dmg)}/วิ +1 มนตร์`,'Cooldown 30 วิ']}
];

/* =====================================================================
   3. SYSTEMS — Golden Wool · Enchant · heals / shields
   ===================================================================== */
const SHP={wool:0,woolT:0,freeN:0,mirrorN:0,gorgN:0,shield:0,shieldT:0,cup:0,hot:[],sanct:null,rain:null,steps:[],stepT:0,orbs:[],orbT:0,colchis:null,fate:null,sirens:null,cloud:false,olympus:false,thin:0};
const sL=k=>LV[k]||0;
const sLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,sL(k)))-1];
const sBranch=k=>!k?'':k==='basic'?'N':(k.startsWith('sa')||['scChorus','scChariot','scGorgon','scWell'].includes(k))?'A':(k.startsWith('sb')||['scNeedle','scCharm','scSlumber','scSirens'].includes(k))?'B':'N';
const sTal=()=>Math.max(1,D.mag);
function sWoolEvery(){if(!sL('snFleece'))return 99;return Math.max(1,sLv(SB.snFleece.every,'snFleece')-(sL('saRegrow')?sLv(SB.saRegrow.cut,'saRegrow'):0));}
function sShear(keep=0){const n=SHP.wool;SHP.wool=Math.min(keep,n);const used=n-SHP.wool;if(used>0){SHP.thin=1;if(sL('saRegrow'))sHeal(SB.saRegrow.heal*used,true);sFluff(player.x,player.y,used*3);}return used;}
/* heal: n = TAL×n; Rod / Grace add to n; overflow → Overflowing Cup shield */
function sHeal(n,plain){let m=n;if(!plain){if(sL('saRod'))m+=sLv(SB.saRod.add,'saRod');if(sL('saGrace')&&player.hp<player.maxHp*.5)m+=sLv(SB.saGrace.add,'saGrace');}
  const amt=Math.round(sTal()*m);if(amt<=0)return 0;const room=player.maxHp-player.hp,g=Math.min(room,amt);player.hp+=g;
  if(amt>room&&sL('saCup'))SHP.cup=Math.min(sLv(SB.saCup.cap,'saCup'),SHP.cup+(amt-room));
  if(g>0&&typeof dmgNum==='function')try{dmgNum(player.x,player.y,74,'+'+g,'heal');}catch(_){}return g;}
function sHot(n,T){SHP.hot.push({rate:n/T,until:gameTime+T});}
function sShieldSet(n,T){SHP.shield=Math.max(SHP.shield,Math.round(sTal()*n));SHP.shieldT=gameTime+T;}
function sCleanse(){let c=0;for(const k in player.buffs)if(k.startsWith('db')){delete player.buffs[k];c++;}if(player.ccT>0)player.ccT=0;return c;}
function sHit(e,mult,key,o={}){if(!e||e.dead)return 0;return hurt(e,mult,Object.assign({skill:key,_m:mult},o));}   /* _m: the hit's TAL multiplier (Thread of Fate shares a part of it) */
const sNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const sLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&distToSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function sFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function sPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!sFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const sTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const sPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
function sPt(c,range){if(c&&c.gx!=null)return [c.gx,c.gy];const t=sTgt(c,range);if(t)return [t.x,t.y];return [player.x+Math.cos(player.phi)*range*.6,player.y+Math.sin(player.phi)*range*.6];}
/* enchant on enemies */
function sEnc(e,n=1){if(!e||e.dead)return;if(e.boundT>gameTime){e.boundT=Math.max(e.boundT,gameTime+1);return;}e.enc=(e.enc||0)+n;e.encT=gameTime+8;
  if(e.enc>=SP_BAL.enc.need){e.enc=0;e.boundT=gameTime+SP_BAL.enc.bound+(sL('sbBinder')?sLv(SB.sbBinder.t,'sbBinder'):0);addFx(new DText({x:e.x,y:e.y,z:(e.boss?90:60),text:'ติดมนตร์!',color:'#ffb0f0',size:13,life:1}));
    addFx(new GRing({x:e.x,y:e.y,r0:40,r1:10,w:4,color:'#ff9ae8',life:.35}));}}
const sBound=e=>e&&e.boundT>gameTime;

/* =====================================================================
   4. FX (code-drawn gold light / threads / wool + shared painted images)
   ===================================================================== */
const SPC={gold:'#ffd36a',gold2:'#fff2b8',holy:'#fffbe0',pink:'#ff9ae8',violet:'#c48aff',wool:'#fff6d8',green:'#9aff9a'};
const SI={};
function sImg(n){let o=SI[n];if(!o){o=SI[n]={im:new Image(),ok:false};o.im.onload=()=>{o.ok=o.im.naturalWidth>0;};o.im.src=(n[0]==='h'?'assets/fx/hippo/':n[0]==='s'?'assets/fx/sheep/':'assets/fx/cat/')+n+'.webp';}return o.ok?o.im:null;}
function sDraw(n,sx,sy,w,o={}){const im=sImg(n);if(!im)return false;const ih=im.naturalHeight,iw=im.naturalWidth,h=w*ih/iw*(o.sq||1);
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,o.a==null?1:o.a));if(o.add)ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);if(o.rot)ctx.rotate(o.rot);
  ctx.drawImage(im,-w/2,-h*(o.ay==null?.5:o.ay),w,h);ctx.restore();return true;}
class SImg{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',z:0,w:100,s0:.85,s1:1.05,a0:1,fadeOut:.5},o);}
  update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,s=this.s0+(this.s1-this.s0)*eOut(Math.min(1,k*1.6)),a=this.a0*(k>1-this.fadeOut?Math.max(0,(1-k)/this.fadeOut):1);const [x,y]=P(this.x,this.y,this.z);sDraw(this.n,x,y,this.w*s,{a,ay:this.ay,sq:this.sq,add:this.add});}}
function sSparks(x,y,z,n,spd=110,col=SPC.gold){for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(.3,1)*spd;emit({type:'ember',x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(30,110),drag:2,life:rnd(.4,.8),size:rnd(1.6,3),size1:.3,color:Math.random()<.5?col:SPC.gold2});}}
function sFluff(x,y,n){for(let i=0;i<qn(n);i++){const a=rnd(0,TAU),s=rnd(40,120);emit({type:'round',x,y,z:rnd(20,50),vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(20,70),drag:2.5,life:rnd(.6,1),size:rnd(4,7),size1:2,color:Math.random()<.5?SPC.wool:SPC.gold2});}}
function sHealFx(){addFx(new GRing({x:player.x,y:player.y,r0:10,r1:60,w:5,color:SPC.green,life:.4}));for(let i=0;i<qn(8);i++)emit({type:'ember',x:player.x+rnd(-18,18),y:player.y+rnd(-8,8),z:rnd(10,40),vx:0,vy:0,vz:rnd(50,90),drag:1,life:.8,size:2.6,size1:.5,color:i%2?SPC.green:SPC.gold2});}
function sPow(e,big){if(sImg('22_pow'))addFx(new SImg({n:'22_pow',x:e.x,y:e.y,z:(e.boss?40:28),w:big?90:56,life:.18,s0:.5,s1:1.1,fadeOut:.6}));}
/* travelling light bolt / thread / ram */
class SBolt{constructor(o){Object.assign(this,{t:0,layer:'top',speed:620,len:300,R:14,z:34,kind:'light',hits:new Set(),pierce:1,col:SPC.gold},o);this.x0=this.x;this.y0=this.y;this.life=this.len/this.speed;this.trail=[];}
  update(dt){this.t+=dt;const d=Math.min(this.len,this.t*this.speed);this.x=this.x0+Math.cos(this.phi)*d;this.y=this.y0+Math.sin(this.phi)*d;this.trail.push([this.x,this.y]);if(this.trail.length>10)this.trail.shift();
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.R){this.hits.add(e);if(this.onHit)this.onHit(e,this);if(this.hits.size>=this.pierce){this.t=this.life;break;}}}
    if(this.t>=this.life){if(this.onEnd)this.onEnd(this.x,this.y);return false;}return true;}
  draw(){ctx.save();ctx.globalCompositeOperation='lighter';const tr=this.trail;
    if(this.kind==='thread'){ctx.strokeStyle=hexA(SPC.gold,.85);ctx.lineWidth=3;ctx.beginPath();const [ax,ay]=P(this.x0,this.y0,this.z);ctx.moveTo(ax,ay);for(let i=0;i<tr.length;i++){const [x,y]=P(tr[i][0],tr[i][1],this.z+Math.sin(i+this.t*30)*3);ctx.lineTo(x,y);}ctx.stroke();}
    else if(this.kind==='ram'){const [x,y]=P(this.x,this.y,20);ctx.fillStyle=hexA(SPC.gold,.75);ctx.beginPath();ctx.ellipse(x,y,30,20,0,0,TAU);ctx.fill();ctx.fillStyle=hexA(SPC.gold2,.9);ctx.beginPath();ctx.arc(x+Math.cos(this.phi)*24,y-8,11,0,TAU);ctx.fill();
      ctx.strokeStyle=hexA('#ffffff',.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+Math.cos(this.phi)*24,y-12,9,Math.PI*.9,Math.PI*1.9);ctx.stroke();}
    else{for(let i=0;i<tr.length;i++){const [x,y]=P(tr[i][0],tr[i][1],this.z),k=i/tr.length;ctx.fillStyle=hexA(this.col,.15+.5*k);ctx.beginPath();ctx.arc(x,y,this.R*(.4+.6*k),0,TAU);ctx.fill();}
      const [x,y]=P(this.x,this.y,this.z),g=ctx.createRadialGradient(x,y,0,x,y,this.R*1.6);g.addColorStop(0,'#fff');g.addColorStop(.4,this.col);g.addColorStop(1,hexA(this.col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,this.R*1.6,0,TAU);ctx.fill();}
    ctx.restore();}}
/* beam line (Sunbeam, Echo) */
class SBeam{constructor(o){Object.assign(this,{t:0,life:.35,layer:'top',len:240,w:26,col:SPC.gold},o);}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[x0,y0]=P(this.x,this.y,34),[x1,y1]=P(this.x+Math.cos(this.phi)*this.len,this.y+Math.sin(this.phi)*this.len,34);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    ctx.strokeStyle=hexA(this.col,.55*a);ctx.lineWidth=this.w*(1.2-k*.5);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',.9*a);ctx.lineWidth=this.w*.35;ctx.stroke();ctx.restore();}}
/* light pillar */
class SPillar{constructor(o){Object.assign(this,{t:0,life:.7,layer:'top',R:60,col:SPC.gold},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,0),h=260,w=this.R*.6*(1-k*.5);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-k;const g=ctx.createLinearGradient(0,y-h,0,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA('#ffffff',.9));ctx.fillStyle=g;ctx.fillRect(x-w,y-h,w*2,h);ctx.restore();}}
/* ground fields: sanctuary, rain, sleep, hex, footprints, siren pull, orbs, colchis fleece */
class SGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='sheep';}
  draw(){const ring=(x,y,R,col,a,dash)=>{const [sx,sy]=P(x,y,0);ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=3;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.ellipse(sx,sy,R,R*K,0,0,TAU);ctx.stroke();ctx.globalAlpha=a*.25;ctx.fillStyle=col;ctx.fill();ctx.restore();};
    const S=SHP.sanct;if(S){ring(S.x,S.y,S.R,SPC.holy,.75);for(let i=0;i<6;i++){const an=i*TAU/6+this.t*.2,[px,py]=P(S.x+Math.cos(an)*S.R,S.y+Math.sin(an)*S.R,0);ctx.fillStyle='#f4efe4';ctx.strokeStyle='#a89870';ctx.lineWidth=1.5;ctx.fillRect(px-5,py-34,10,34);ctx.strokeRect(px-5,py-34,10,34);ctx.fillRect(px-8,py-38,16,5);}}
    const R=SHP.rain;if(R)ring(R.x,R.y,R.R,SPC.gold,.6,[8,6]);
    for(const z of (SHP.zones||[]))ring(z.x,z.y,z.R,z.col,.6*Math.min(1,(z.until-gameTime)/.5));
    for(const s of SHP.steps){const [x,y]=P(s.x,s.y,0);ctx.fillStyle=hexA(SPC.gold,.6*Math.min(1,(s.until-gameTime)));ctx.beginPath();ctx.ellipse(x,y,5,3,0,0,TAU);ctx.fill();}}}
class STop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;return CHAR==='sheep';}
  draw(){const [x,y]=P(player.x,player.y,0);
    /* wool pips */
    if(sL('snFleece')){for(let i=0;i<SP_BAL.wool.cap;i++){const on=i<SHP.wool;ctx.fillStyle=on?SPC.gold:'rgba(255,255,255,.2)';ctx.beginPath();ctx.arc(x-16+i*8,y+13,on?3:1.8,0,TAU);ctx.fill();}}
    /* shield bubble */
    const sh=SHP.shield+SHP.cup;if(sh>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(SPC.gold2,.45+.2*Math.sin(this.t*5));ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-36,34,46,0,0,TAU);ctx.stroke();ctx.restore();}
    if(hasBuff('saAegis'))sDraw('h15_ward',x,y+8,120,{a:.45,ay:.9});
    if(SHP.olympus){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-30,10,x,y-30,90);g.addColorStop(0,hexA(SPC.gold2,.35));g.addColorStop(1,hexA(SPC.gold,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y-30,90,0,TAU);ctx.fill();ctx.restore();}
    /* orbs */
    for(let i=0;i<SHP.orbs.length;i++){const an=this.t*2.5+i*TAU/Math.max(1,SHP.orbs.length),[ox,oy]=P(player.x+Math.cos(an)*40,player.y+Math.sin(an)*26,46);ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=SPC.gold;ctx.beginPath();ctx.arc(ox,oy,6,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ox,oy,2.5,0,TAU);ctx.fill();ctx.restore();}
    /* Colchis fleece over the head */
    if(SHP.colchis){const [fx,fy]=P(player.x,player.y,120+6*Math.sin(this.t*3));ctx.save();ctx.translate(fx,fy);ctx.rotate(Math.sin(this.t*2)*.15);ctx.fillStyle=SPC.gold;ctx.strokeStyle='#8a5a1a';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const a=i*TAU/10;ctx.arc(Math.cos(a)*16,Math.sin(a)*9,7,0,TAU);}ctx.fill();ctx.restore();}
    /* sirens */
    if(SHP.sirens)for(let i=0;i<SB.scSirens.n;i++){const an=this.t*1.2+i*TAU/SB.scSirens.n,[sx,sy]=P(player.x+Math.cos(an)*70,player.y+Math.sin(an)*50,40+4*Math.sin(this.t*4+i));ctx.save();ctx.globalAlpha=.7;ctx.fillStyle=SPC.violet;ctx.beginPath();ctx.ellipse(sx,sy,8,14,0,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(sx,sy-16,6,0,TAU);ctx.fill();ctx.restore();}
    /* enemies: enchant pips, spellbound, hex, sleep, charm, fate */
    for(const e of enemies){if(e.dead)continue;const z=e.boss?84:56;let [ex,ey]=P(e.x,e.y,z);
      if(sBound(e)){ctx.save();ctx.strokeStyle=hexA(SPC.pink,.7+.3*Math.sin(this.t*8));ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ex,ey+z*.6,e.r+8,(e.r+8)*.4,0,0,TAU);ctx.stroke();ctx.restore();}
      else if(e.enc>0&&e.encT>gameTime){for(let i=0;i<SP_BAL.enc.need;i++){ctx.fillStyle=i<e.enc?SPC.pink:'rgba(255,255,255,.25)';ctx.beginPath();ctx.arc(ex-8+i*8,ey,3,0,TAU);ctx.fill();}}
      if(e.hexT>gameTime){ctx.fillStyle=SPC.violet;ctx.font='700 9px Cinzel, serif';ctx.textAlign='center';ctx.fillText('HEX',ex,ey-10);ctx.textAlign='start';}
      if(e.sleepT>gameTime){ctx.fillStyle='#d8e8ff';ctx.font='700 11px Cinzel, serif';ctx.fillText('z',ex+10,ey-12-4*Math.sin(this.t*3));}
      if(e.charmT>gameTime){ctx.fillStyle='#ff6aa8';ctx.font='700 12px sans-serif';ctx.textAlign='center';ctx.fillText('♥',ex,ey-14);ctx.textAlign='start';}
      if(SHP.fate&&SHP.fate.set.has(e)&&SHP.fate.until>gameTime){const [fx,fy]=P(e.x,e.y,30);ctx.save();ctx.strokeStyle=hexA(SPC.gold,.5);ctx.lineWidth=1.5;ctx.setLineDash([4,4]);for(const o of SHP.fate.set){if(o===e||o.dead)continue;const [ox,oy]=P(o.x,o.y,30);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(ox,oy);ctx.stroke();}ctx.restore();}}}}
/* per-frame state. SCore lives on layer 'none' (enterMap keeps it); the balance bench clears every fx, so every cast / basic calls
   sEnsure() to put it back (2026-11-21: without it the bench never counted rain ticks, wool orbs, the fleece's bolts, the sirens,
   charm hits, the ends of Olympus / Colchis / the cloud, HoTs and wool growth) */
let S_CORE=null;function sEnsure(){if(CHAR!=='sheep')return;if(!S_CORE||!fx.includes(S_CORE))S_CORE=addFx(new SCore());}
class SCore{constructor(){this.t=0;this.layer='none';this.tk=0;}draw(){}
  update(dt){this.tick(dt);return CHAR==='sheep';}
  tick(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new SGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new STop());
    const A=player.action;if(player.jgHide&&!(A&&A.spHide)&&!SHP.cloud)player.jgHide=false;
    /* wool */
    if(sL('snFleece')&&SHP.wool<SP_BAL.wool.cap){SHP.woolT+=dt;if(SHP.woolT>=sWoolEvery()){SHP.woolT=0;SHP.wool++;SHP.thin=Math.max(0,SHP.thin-.2);if(SHP.wool===SP_BAL.wool.cap)sFluff(player.x,player.y,4);}}else SHP.woolT=0;
    /* heals over time */
    SHP.hot=SHP.hot.filter(h=>h.until>gameTime);for(const h of SHP.hot)sHeal(h.rate*dt,true);
    if(SHP.shieldT<gameTime)SHP.shield=0;
    this.tk+=dt;const tick=this.tk>=.5;if(tick)this.tk=0;
    /* sanctuary */
    const S=SHP.sanct;if(S){if(S.until<gameTime)SHP.sanct=null;else{if(Math.hypot(player.x-S.x,(player.y-S.y)*1.2)<S.R)sHeal(SB.saSanct.heal*dt,true);if(tick)for(const e of sNear(S.x,S.y,S.R))applyCC(e,{slow:.6});}}
    /* blessed rain */
    const R=SHP.rain;if(R){if(R.until<gameTime)SHP.rain=null;else{R.x=player.x;R.y=player.y;if(tick){sHeal(SB.saRain.heal);for(const e of sNear(R.x,R.y,R.R))sHit(e,SB.saRain.dmg,'saRain');}if(Math.random()<Q.p*1.5)emit({type:'round',x:R.x+rnd(-R.R,R.R),y:R.y+rnd(-R.R,R.R)*.6,z:120,vx:0,vy:0,vz:-260,drag:0,life:.45,size:2,size1:1.5,color:SPC.gold2});}}
    /* zones (hex / sleep / siren markers) */
    SHP.zones=(SHP.zones||[]).filter(z=>z.until>gameTime);
    /* hermes footprints */
    if(hasBuff('saHermes')){SHP.stepT+=dt;if(SHP.stepT>.3&&player.moving){SHP.stepT=0;SHP.steps.push({x:player.x,y:player.y,until:gameTime+6,used:false});}}
    SHP.steps=SHP.steps.filter(s=>s.until>gameTime&&!s.used);for(const s of SHP.steps)if(gameTime-(s.until-6)>.6&&Math.hypot(s.x-player.x,s.y-player.y)<18){s.used=true;sHeal(SB.saHermes.heal,true);}
    /* golden shearing orbs */
    if(SHP.orbs.length){if(SHP.orbUntil<gameTime)SHP.orbs=[];else{sHeal(SB.scShearing.heal*SHP.orbs.length*dt,true);const e=nearestEnemy(player.x,player.y,SB.scShearing.R);
      if(e&&(SHP.orbT-=dt)<=0){SHP.orbT=.4;SHP.orbs.pop();addFx(new SBolt({x:player.x,y:player.y,phi:angTo(e),len:Math.hypot(e.x-player.x,e.y-player.y)+10,R:9,speed:700,onHit:t=>sHit(t,SB.scShearing.dmg,'scShearing')}));}}}
    /* enemies: spellbound slow, sleep slow, charm */
    if(tick)for(const e of enemies){if(e.dead)continue;if(sBound(e))applyCC(e,{slow:.6});if(e.sleepT>gameTime)applyCC(e,{slow:.6});
      if(e.charmT>gameTime){e.aggro=0;e.atk=0;const o=enemies.filter(q=>q!==e&&!q.dead).sort((p,q)=>Math.hypot(p.x-e.x,p.y-e.y)-Math.hypot(q.x-e.x,q.y-e.y))[0];
        if(o){const d=Math.hypot(o.x-e.x,o.y-e.y);if(d>e.r+o.r+10){e.x+=(o.x-e.x)/d*Math.min(d,40);e.y+=(o.y-e.y)/d*Math.min(d,40);}else{sHit(o,SB.scCharm.hit,'scCharm',{noFate:true});sPow(o,false);}}}}
    /* Colchis fleece */
    const C=SHP.colchis;if(C){if(C.until<gameTime)sColchisEnd();else if((C.tk=(C.tk||0)+dt)>=1){C.tk=0;const L=sNear(player.x,player.y,320);if(L.length){const e=L[(Math.random()*L.length)|0];
      addFx(new SBolt({x:player.x,y:player.y-20,z:110,phi:angTo(e),len:Math.hypot(e.x-player.x,e.y-player.y)+10,R:12,speed:800,onHit:t=>{sHit(t,SB.sbColchis.bolt,'sbColchis');sEnc(t,1);sSparks(t.x,t.y,30,6);}}));}}}
    /* Chorus of Sirens */
    const Sr=SHP.sirens;if(Sr){if(Sr.until<gameTime)SHP.sirens=null;else if((Sr.tk=(Sr.tk||0)+dt)>=1){Sr.tk=0;const L=sNear(player.x,player.y,SB.scSirens.R).slice(0,SB.scSirens.n);
      for(const e of L){if(!e.boss){const a=Math.atan2(player.y-e.y,player.x-e.x);e.x+=Math.cos(a)*SB.scSirens.pull;e.y+=Math.sin(a)*SB.scSirens.pull;}sHit(e,SB.scSirens.dmg,'scSirens');sEnc(e,1);}}}
    /* Olympus */
    const ol=hasBuff('saOlympus');if(ol)sHeal(SB.saOlympus.heal*dt,true);if(SHP.olympus&&!ol)sOlympusEnd();SHP.olympus=ol;
    /* cloud */
    if(SHP.cloud&&!hasBuff('scCloud'))sCloudEnd();
    if(SHP.fate&&SHP.fate.until<gameTime)SHP.fate=null;}}

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
function sBurst(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||SPC.gold,events:tP=>[{t:tP,f:()=>{o.f();}}]});}
/* staff swing on the attack clip */
function sSwing(o){const phi=o.phi;faceTo(phi);const d=atkDir(player.dir),c=CT(d),s=seq('attack',d,Math.max(0,c-3),null,(o.speed||1.6)*aspd()),kC=seqIndex(s,'attack',c),tC=seqTimeAt(s,kC);
  return act({key:o.key,name:o.name,seq:s,windup:tC,dur:seqTimeAt(s,kC+2),hitList:[],events:[{t:tC,f:a=>o.f(a)}]});}

/* ---------- normal attack ---------- */
function mkSpBasic(tgt){const lv=Math.max(1,sL('snCombo')),chain=SB.snCombo.chain[lv-1];if(gameTime-player.basicLast>1.3||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,fin=idx===chain-1,phi=angTo(tgt);
  return sSwing({key:'basic',name:'Crook Combo '+(idx+1),phi,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(fin){addFx(new SBolt({x:player.x,y:player.y,phi,len:Math.min(260,dist(player,tgt)+20),R:10,speed:700,onHit:e=>{sHit(e,SB.snCombo.fin,'basic',{auto:true});sSparks(e.x,e.y,30,5);}}));return;}
    if(!tgt.dead&&dist(player,tgt)<=BASIC_RANGE+40+tgt.r){sHit(tgt,SB.snCombo.hit,'basic',{auto:true,knock:[phi,30]});metalHit(tgt,phi,false);a.hitList.push(tgt);a.hitConfirmed=true;shake(1);stop(26);sSparks(tgt.x,tgt.y,30,3);}}});}

/* ---------- BASIC ---------- */
function mkSnLight(c){const t=sTgt(c,SB.snLight.range),phi=sPhi(c,t),T=SB.snLight.charge,base=sLv(SB.snLight.dmg,'snLight');faceTo(phi);const d=player.dir,s=[...hold('buff',d,bPeak(d),T*1000),...seq('attack',atkDir(d),CT(atkDir(d)),null,1.6)];
  return act({key:'snLight',name:'Light Ball',seq:s,windup:T,dur:T+.25,hitList:[],update:(a)=>{if(a.t<T&&Math.random()<Q.p*1.4){const an=rnd(0,TAU),r=rnd(30,50);emit({type:'ember',x:player.x+Math.cos(an)*r,y:player.y+Math.sin(an)*r,z:50,vx:-Math.cos(an)*r*3,vy:-Math.sin(an)*r*3,vz:0,drag:1,life:.3,size:2,size1:.3,color:SPC.gold2});}},
    events:[{t:T,f:a=>{const ph=t&&!t.dead?angTo(t):phi;addFx(new SBolt({x:player.x,y:player.y,phi:ph,len:SB.snLight.range,R:18,speed:640,onHit:e=>{sHit(e,base,'snLight',{big:true});sSparks(e.x,e.y,30,8);sPow(e,true);a.hitConfirmed=true;
      if(sL('scPrism')){const L=sNear(e.x,e.y,180).filter(q=>q!==e).slice(0,SB.scPrism.n);for(const q of L)addFx(new SBolt({x:e.x,y:e.y,phi:Math.atan2(q.y-e.y,q.x-e.x),len:Math.hypot(q.x-e.x,q.y-e.y)+10,R:9,speed:700,col:'#fff2b8',onHit:z=>sHit(z,base*SB.scPrism.mul,'scPrism')}));}}}));}}]});}
function mkSnHop(c){const phi=c&&c.phi!=null?c.phi:player.phi;faceTo(phi);const sx=player.x,sy=player.y,[dx,dy]=sPathEnd(sx,sy,phi,SB.snHop.dist),s=seq('walk',player.dir,0,null,3);
  return act({key:'snHop',name:'Woolly Hop',seq:s,windup:0,dur:.34,hitList:[],update:(a,dt)=>{player.iframes=a.t<SB.snHop.iframe?.06:0;dashUpd(a,dt,0,.28,sx,sy,dx,dy,SPC.wool,40);},events:[{t:.01,f:()=>sFluff(sx,sy,6)}]});}
function mkSnChannel(c){return sBurst({key:'snChannel',name:'Divine Channel',glow:SPC.green,f:()=>{sHeal(sLv(SB.snChannel.heal,'snChannel'));sHealFx();if(sL('scLasting')){sHot(SB.scLasting.hot,SB.scLasting.T);player.mp=Math.min(player.maxMp,player.mp+SB.scLasting.sp);}}});}

/* ---------- A · healer ---------- */
function mkSaHymn(c){return sBurst({key:'saHymn',name:'Healing Hymn',glow:SPC.green,f:()=>{let n=sLv(SB.saHymn.heal,'saHymn');if(sL('scChorus'))n+=SB.scChorus.per*SHP.wool;
  if(sL('saRod'))n+=sLv(SB.saRod.add,'saRod');if(sL('saGrace')&&player.hp<player.maxHp*.5)n+=sLv(SB.saGrace.add,'saGrace');sHot(n,SB.saHymn.T);sHealFx();addFx(new DText({x:player.x,y:player.y,z:96,text:'♪',color:SPC.green,size:16,life:1}));}});}
function mkSaSun(c){const t=sTgt(c,SB.saSun.range),phi=sPhi(c,t);return sBurst({key:'saSun',name:'Sunbeam of Apollo',phi,speed:2.4,f:()=>{addFx(new SBeam({x:player.x,y:player.y,phi,len:SB.saSun.len}));
  const L=sLine(player.x,player.y,phi,SB.saSun.len,24);for(const e of L){sHit(e,sLv(SB.saSun.dmg,'saSun'),'saSun');sSparks(e.x,e.y,30,5);}if(L.length){sHeal(SB.saSun.heal*L.length,true);player.action&&(player.action.hitConfirmed=true);SHP.sunPhi=phi;}}});}
function mkSaEcho(c){const phi=(SHP.sunPhi??player.phi)+Math.PI,x=player.x+Math.cos(phi+Math.PI)*SB.saSun.len,y=player.y+Math.sin(phi+Math.PI)*SB.saSun.len;
  return sBurst({key:'saEcho',name:'Radiant Echo',speed:2.6,f:()=>{addFx(new SBeam({x,y,phi,len:SB.saSun.len,col:SPC.gold2}));const L=sLine(x,y,phi,SB.saSun.len,24);for(const e of L)sHit(e,SB.saEcho.dmg,'saEcho');if(L.length)sHeal(SB.saEcho.heal*L.length,true);}});}
function mkSaShield(c){return sBurst({key:'saShield',name:'Fleece Shield',glow:SPC.gold,f:()=>{const n=sShear();sShieldSet(sLv(SB.saShield.base,'saShield')+SB.saShield.per*n,SB.saShield.T);addFx(new DText({x:player.x,y:player.y,z:100,text:'ตัดขน ×'+n,color:SPC.gold,size:13,life:1}));
  addFx(new GRing({x:player.x,y:player.y,r0:60,r1:20,w:6,color:SPC.gold,life:.4}));}});}
function mkSaAegis(c){return sBurst({key:'saAegis',name:'Aegis of Athena',glow:SPC.gold,f:()=>{addBuff('saAegis',SB.saAegis.dur);addBuff('rhSA',SB.saAegis.dur);SHP.gorgN=0;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:80,w:6,color:SPC.gold,life:.4}));}});}
function mkSaSanct(c){const [x,y]=sPt(c,SB.saSanct.range);return sBurst({key:'saSanct',name:'Sanctuary',phi:Math.atan2(y-player.y,x-player.x),f:()=>{SHP.sanct={x,y,R:SB.saSanct.R,until:gameTime+SB.saSanct.T};addFx(new SPillar({x,y,R:80,col:SPC.holy}));}});}
function mkSaPurify(c){return sBurst({key:'saPurify',name:'Purifying Light',speed:2.2,f:()=>{const n=sCleanse();sHeal(SB.saPurify.heal);sHealFx();for(const e of sNear(player.x,player.y,SB.saPurify.R))sHit(e,SB.saPurify.dmg,'saPurify');
  addFx(new GRing({x:player.x,y:player.y,r0:10,r1:SB.saPurify.R+20,w:10,color:SPC.holy,life:.4}));if(n)addFx(new DText({x:player.x,y:player.y,z:100,text:'ล้างดีบัฟ '+n,color:SPC.holy,size:12,life:.9}));player.action&&(player.action.hitConfirmed=true);}});}
function mkSaRain(c){return sBurst({key:'saRain',name:'Blessed Rain',f:()=>{SHP.rain={x:player.x,y:player.y,R:SB.saRain.R,until:gameTime+SB.saRain.T};}});}
function mkSaHermes(c){return sBurst({key:'saHermes',name:"Hermes' Sandals",glow:SPC.gold,f:()=>{addBuff('saHermes',SB.saHermes.dur);sSparks(player.x,player.y,10,10);}});}
function mkSaHand(c){return sBurst({key:'saHand',name:'Hand of Asclepius',speed:1.6,glow:SPC.green,f:()=>{const n=sShear(sL('scWell')?1:0);sHeal(SB.saHand.heal+SB.saHand.per*n);sHot(SB.saHand.hot,SB.saHand.T);sHealFx();addFx(new SPillar({x:player.x,y:player.y,R:70,col:SPC.green}));
  addFx(new DText({x:player.x,y:player.y,z:110,text:'หัตถ์แอสคลีปิอุส',color:SPC.green,size:13,life:1}));}});}
function mkSaOlympus(c){return buffAct({key:'saOlympus',name:'Blessing of Olympus',speed:1.4,glow:SPC.gold,events:tP=>[{t:.05,f:()=>{skyDarkT=.4;addFx(new DText({x:player.x,y:player.y,z:120,text:'OLYMPUS',color:SPC.gold,size:18,life:1.6}));}},
  {t:tP,f:()=>{addBuff('saOlympus',SB.saOlympus.dur);SHP.olympus=true;skyDarkT=0;addFx(new SPillar({x:player.x,y:player.y,R:100}));sSparks(player.x,player.y,40,30,200);}}]});}
function sOlympusEnd(){const B=SB.saOlympus;sHeal(B.fin);sHealFx();for(let i=0;i<6;i++){const a=i*TAU/6,x=player.x+Math.cos(a)*B.R*.6,y=player.y+Math.sin(a)*B.R*.6;addFx(new SPillar({x,y,R:50}));}
  for(const e of sNear(player.x,player.y,B.R))sHit(e,B.dmg,'saOlympus',{cc:{air:1},big:true,koMul:2});shake(5);if(typeof screenFlash==='function')screenFlash(.2,'#fff2b8');}

/* ---------- B · enchanter ---------- */
function mkSbThread(c){const t=sTgt(c,SB.sbThread.range),phi=sPhi(c,t),pierce=sL('scNeedle')?SB.scNeedle.pierce:1;
  return sBurst({key:'sbThread',name:'Golden Thread',phi,speed:2.6,f:()=>{addFx(new SBolt({x:player.x,y:player.y,phi,len:SB.sbThread.len,R:10,kind:'thread',speed:760,pierce,onHit:e=>{sHit(e,sLv(SB.sbThread.dmg,'sbThread'),'sbThread');sEnc(e,1);}}));}});}
function mkSbLullaby(c){const t=sTgt(c,SB.sbLullaby.range),phi=sPhi(c,t);return sBurst({key:'sbLullaby',name:'Lullaby',phi,speed:2.2,glow:SPC.pink,f:()=>{const L=enemiesInCone(player.x,player.y,phi,SB.sbLullaby.R,SB.sbLullaby.half);
  for(const e of L){sHit(e,SB.sbLullaby.dmg,'sbLullaby');sEnc(e,1);applyCC(e,{slow:2.5});e.lullT=gameTime+2.5;}if(L.length){player.action&&(player.action.hitConfirmed=true);SHP.lullList=L;}
  if(sImg('h14_yawn')){const fl=Math.cos(phi)<0,cc=Math.atan2(Math.sin(phi)*K,Math.cos(phi));addFx(new SImg({n:'h14_yawn',x:player.x+Math.cos(phi)*30,y:player.y+Math.sin(phi)*30,z:50,w:SB.sbLullaby.R*1.3,life:.5,s0:.5,s1:1.05,fadeOut:.5}));}
  addFx(new DText({x:player.x,y:player.y,z:96,text:'♫',color:SPC.pink,size:16,life:1}));}});}
function mkSbShatter(c){const L=(SHP.lullList||[]).filter(e=>!e.dead&&(e.lullT>gameTime||e.st.slow>0));if(!L.length)return null;
  return sBurst({key:'sbShatter',name:'Dream Shatter',speed:2.4,glow:SPC.pink,f:()=>{for(const e of L){const n=sBound(e)?SP_BAL.enc.need:(e.enc||0);e.enc=0;sHit(e,SB.sbShatter.dmg+SB.sbShatter.per*n,'sbShatter',{big:true});addFx(new GRing({x:e.x,y:e.y,r0:10,r1:60,w:8,color:SPC.pink,life:.35}));sSparks(e.x,e.y,30,10,160,SPC.pink);sPow(e,true);}shake(2.5);}});}
function mkSbHex(c){const [x,y]=sPt(c,SB.sbHex.range);return sBurst({key:'sbHex',name:'Hex of Weakness',phi:Math.atan2(y-player.y,x-player.x),glow:SPC.violet,f:()=>{for(const e of sNear(x,y,SB.sbHex.R)){e.hexT=gameTime+SB.sbHex.T;sEnc(e,1);}
  (SHP.zones=SHP.zones||[]).push({x,y,R:SB.sbHex.R,col:SPC.violet,until:gameTime+.8});addFx(new GRing({x,y,r0:SB.sbHex.R,r1:10,w:5,color:SPC.violet,life:.4}));}});}
function mkSbSong(c){return sBurst({key:'sbSong',name:'War Song',glow:SPC.pink,f:()=>{addBuff('sbSong',SB.sbSong.dur);addFx(new DText({x:player.x,y:player.y,z:100,text:'♪♫',color:SPC.pink,size:16,life:1}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:90,w:5,color:SPC.pink,life:.4}));}});}
function mkSbRam(c){const t=sTgt(c,SB.sbRam.range),phi=sPhi(c,t);return sBurst({key:'sbRam',name:'Golden Ram',phi,speed:2.2,f:()=>{addFx(new SBolt({x:player.x,y:player.y,phi,len:SB.sbRam.len,R:30,kind:'ram',speed:560,pierce:99,onHit:e=>{sHit(e,SB.sbRam.dmg,'sbRam',{cc:{air:1},big:true,knock:[phi,120]});sSparks(e.x,e.y,20,8);}}));}});}
function mkSbSleep(c){const [x,y]=sPt(c,SB.sbSleep.range);return sBurst({key:'sbSleep',name:"Dragon's Sleep",phi:Math.atan2(y-player.y,x-player.x),glow:'#d8e8ff',f:()=>{const T=SB.sbSleep.T+(sL('scSlumber')?SB.scSlumber.t:0);
  const L=sNear(x,y,SB.sbSleep.R);for(const e of L){e.sleepT=gameTime+T;applyCC(e,{slow:T});sEnc(e,1);}SHP.sleepList=L;(SHP.zones=SHP.zones||[]).push({x,y,R:SB.sbSleep.R,col:'#d8e8ff',until:gameTime+T});
  if(L.length)player.action&&(player.action.hitConfirmed=true);for(let i=0;i<qn(14);i++)emit({type:'mist',x:x+rnd(-SB.sbSleep.R,SB.sbSleep.R)*.7,y:y+rnd(-SB.sbSleep.R,SB.sbSleep.R)*.5,z:rnd(5,30),vz:15,life:1.2,size:10,size1:20,color:'#d8e8ff'});}});}
function mkSbFate(c){const L=(SHP.sleepList||[]).filter(e=>!e.dead);if(!L.length)return null;return sBurst({key:'sbFate',name:'Thread of Fate',glow:SPC.gold,f:()=>{SHP.fate={set:new Set(L),until:gameTime+SB.sbFate.T};addFx(new DText({x:player.x,y:player.y,z:100,text:'ด้ายชะตา ×'+L.length,color:SPC.gold,size:13,life:1}));}});}
function mkSbSiren(c){const [x,y]=sPt(c,SB.sbSiren.range);return sBurst({key:'sbSiren',name:"Siren's Call",phi:Math.atan2(y-player.y,x-player.x),glow:SPC.violet,f:()=>{for(const e of sNear(x,y,SB.sbSiren.R)){if(!e.boss){const d=Math.hypot(x-e.x,y-e.y);if(d>10){const k=Math.max(0,d-e.r-10)/d;e.x+=(x-e.x)*k;e.y+=(y-e.y)*k;}}sHit(e,SB.sbSiren.dmg,'sbSiren');sEnc(e,1);}
  addFx(new GRing({x,y,r0:SB.sbSiren.R,r1:10,w:6,color:SPC.violet,life:.45}));shake(2);}});}
function mkSbCauldron(c){const [x,y]=sPt(c,SB.sbCauldron.range);return sBurst({key:'sbCauldron',name:"Medea's Cauldron",phi:Math.atan2(y-player.y,x-player.x),speed:1.8,glow:'#7aff9a',f:()=>{
  addFx(new SDelay(.35,()=>{for(const e of sNear(x,y,SB.sbCauldron.R)){sHit(e,SB.sbCauldron.dmg,'sbCauldron',{big:true});e.hexT=gameTime+SB.sbHex.T;applyCC(e,{slow:2});sEnc(e,2);}
    addFx(new GRing({x,y,r0:10,r1:SB.sbCauldron.R+20,w:12,color:'#7aff9a',life:.45}));for(let i=0;i<qn(16);i++){const a=rnd(0,TAU),s=rnd(40,160);emit({type:'round',x,y,z:10,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:rnd(80,180),drag:1.6,life:.7,size:rnd(3,6),size1:1,color:Math.random()<.5?'#7aff9a':'#c48aff'});}shake(3.5);}));}});}
function mkSbColchis(c){return buffAct({key:'sbColchis',name:'Fleece of Colchis',speed:1.4,glow:SPC.gold,events:tP=>[{t:.05,f:()=>{skyDarkT=.4;addFx(new DText({x:player.x,y:player.y,z:120,text:'FLEECE OF COLCHIS',color:SPC.gold,size:16,life:1.6}));}},
  {t:tP,f:()=>{SHP.colchis={until:gameTime+SB.sbColchis.dur};addBuff('sbColchis',SB.sbColchis.dur);skyDarkT=0;sSparks(player.x,player.y,100,24,200);}}]});}
function sColchisEnd(){SHP.colchis=null;const L=enemies.filter(e=>!e.dead&&sBound(e)&&dist(player,e)<420);addFx(new DText({x:player.x,y:player.y,z:120,text:'มนตร์แตก ×'+L.length,color:SPC.pink,size:15,life:1.2}));
  for(const e of L){for(const o of sNear(e.x,e.y,SB.sbColchis.R))sHit(o,SB.sbColchis.fin,'sbColchis',{big:true,koMul:2});e.boundT=0;addFx(new GRing({x:e.x,y:e.y,r0:10,r1:SB.sbColchis.R+20,w:10,color:SPC.pink,life:.45}));sSparks(e.x,e.y,30,12,200,SPC.pink);}shake(L.length?5:2);}

/* ---------- C · actives ---------- */
function mkScShearing(c){return sBurst({key:'scShearing',name:'Golden Shearing',glow:SPC.gold,f:()=>{const n=Math.max(1,sShear());SHP.orbs=Array(n).fill(1);SHP.orbUntil=gameTime+SB.scShearing.T;SHP.orbT=.3;}});}
function mkScCloud(c){return sBurst({key:'scCloud',name:'Woolly Cloud',speed:2.4,glow:SPC.wool,f:()=>{addBuff('scCloud',SB.scCloud.T);SHP.cloud=true;player.jgHide=true;sFluff(player.x,player.y,16);}});}
function sCloudEnd(){SHP.cloud=false;player.jgHide=false;for(const e of sNear(player.x,player.y,SB.scCloud.R)){sHit(e,SB.scCloud.dmg,'scCloud');applyCC(e,{slow:2});e.sleepT=gameTime+2;}sFluff(player.x,player.y,20);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:SB.scCloud.R,w:6,color:SPC.wool,life:.4}));}
function mkScChariot(c){const d=atkDir(player.dir),ct=CT(d);let s=[];for(let i=0;i<SB.scChariot.n;i++)s=s.concat(seq('attack',d,ct-1,ct+1,2));
  const ev=[];for(let i=0;i<SB.scChariot.n;i++)ev.push({t:seqTimeAt(s,seqIndex(s,'attack',ct,i)),f:a=>{const base=player.phi+i*Math.PI*.66;for(let j=0;j<5;j++)addFx(new SBeam({x:player.x,y:player.y,phi:base+(j-2)*.35,len:SB.scChariot.R,w:16,life:.25}));
    for(const e of enemiesInCone(player.x,player.y,base,SB.scChariot.R,Math.PI/2)){sHit(e,SB.scChariot.dmg,'scChariot');a.hitConfirmed=true;}sHeal(SB.scChariot.heal/SB.scChariot.n,true);shake(1.4);}});
  return act({key:'scChariot',name:'Sun Chariot',seq:s,windup:ev[0].t,dur:seqTotal(s),hitList:[],events:ev});}
function mkScCharm(c){const t=sTgt(c,SB.scCharm.range);if(!t)return null;return sBurst({key:'scCharm',name:'Charm',phi:angTo(t),glow:'#ff6aa8',f:()=>{if(t.boss){applyCC(t,{slow:SB.scCharm.slow});addFx(new DText({x:t.x,y:t.y,z:90,text:'บอสต้านเสน่ห์ · สโลว์',color:'#ff9ac8',size:12,life:1}));}
  else{t.charmT=gameTime+SB.scCharm.T;t.aggro=0;addFx(new DText({x:t.x,y:t.y,z:70,text:'♥ เป็นพวก!',color:'#ff6aa8',size:13,life:1}));}for(let i=0;i<qn(8);i++)emit({type:'ember',x:t.x,y:t.y,z:50,vx:rnd(-40,40),vy:rnd(-20,20),vz:rnd(40,90),drag:1,life:.8,size:3,size1:1,color:'#ff6aa8'});}});}
function mkScSirens(c){return sBurst({key:'scSirens',name:'Chorus of Sirens',glow:SPC.violet,f:()=>{SHP.sirens={until:gameTime+SB.scSirens.T};}});}

class SDelay{constructor(t,f){this.t=t;this.f=f;this.layer='none';}update(dt){this.t-=dt;if(this.t<=0){try{this.f();}catch(_){}return false;}return true;}draw(){}}

const SP_MAKE={snLight:mkSnLight,snHop:mkSnHop,snChannel:mkSnChannel,
  saHymn:mkSaHymn,saSun:mkSaSun,saEcho:mkSaEcho,saShield:mkSaShield,saAegis:mkSaAegis,saSanct:mkSaSanct,saPurify:mkSaPurify,saRain:mkSaRain,saHermes:mkSaHermes,saHand:mkSaHand,saOlympus:mkSaOlympus,
  sbThread:mkSbThread,sbLullaby:mkSbLullaby,sbShatter:mkSbShatter,sbHex:mkSbHex,sbSong:mkSbSong,sbRam:mkSbRam,sbSleep:mkSbSleep,sbFate:mkSbFate,sbSiren:mkSbSiren,sbCauldron:mkSbCauldron,sbColchis:mkSbColchis,
  scShearing:mkScShearing,scCloud:mkScCloud,scChariot:mkScChariot,scCharm:mkScCharm,scSirens:mkScSirens};
const SP_FOLLOW={saSun:['saEcho',1.2],saPurify:['saRain',1.5],sbLullaby:['sbShatter',2.5],sbSleep:['sbFate',2.5]};
const SP_ZIGZAG=[['saHymn','saShield'],['sbThread','sbHex']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function sheepAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.35&&ready('saHand'))return cast('saHand');
  if(hp<.55){for(const k of ['snChannel','saHymn','saShield','saPurify'])if(ready(k))return cast(k);}
  if(!t)return false;
  const cb=player.combo;if(cb&&cb.parent&&SKILLS[cb.parent]&&LV[SKILLS[cb.parent].follow]>0){const fk=SKILLS[cb.parent].follow;if(!(player.cd[fk]>0)&&player.mp>=(SKILLS[fk].mp||0)){useSkill(cb.parent);if(busy())return true;}}
  const d=dist(player,t),near=sNear(player.x,player.y,240);if(d>320)return false;
  if((t.boss||near.length>=3)&&ready('saOlympus')&&!hasBuff('saOlympus'))return cast('saOlympus');
  if((t.boss||near.length>=3)&&ready('sbColchis')&&!SHP.colchis)return cast('sbColchis');
  for(const k of ['saAegis','sbSong'])if(ready(k)&&!hasBuff(k))return cast(k);
  if(near.length>=3){for(const k of ['sbSleep','sbCauldron','sbSiren','scSirens','scChariot','saSanct','sbLullaby'])if(ready(k))return cast(k);}
  for(const k of ['sbCauldron','sbRam','sbThread','saSun','snLight','sbLullaby','sbHex','scCharm','scChariot','saPurify'])if(ready(k)){const s=SKILLS[k];if(s.type!=='melee'||d<=(s.range||120)+t.r)return cast(k);}
  return false;}

function installSheep(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of SP_DEFS){const b=SB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:sIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').slice(0,40),characterId:'golden_fleece_sheep'};
    if(b.mp!=null)sk.mp=b.mp;const cd=Array.isArray(b.cd)?b.cd:null;if(cd)Object.defineProperty(sk,'cd',{get(){return sLv(cd,d.key);},enumerable:true,configurable:true});else if(b.cd)sk.cd=b.cd;
    if(d.key==='saHand')Object.defineProperty(sk,'cd',{get(){return sL('scWell')?SB.scWell.cd:SB.saHand.cd;},enumerable:true,configurable:true});
    if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.pre&&d.br!=='C')sk.pre=d.pre;
    if(SP_MAKE[d.key]){const mk=SP_MAKE[d.key];sk.make=function(c){sEnsure();const a=mk.apply(this,arguments);if(a)sFreeCast(sk);return a;};}
    if(SP_FOLLOW[d.key]){sk.follow=SP_FOLLOW[d.key][0];sk.comboWin=SP_FOLLOW[d.key][1];}
    if(d.parent){sk.parent=d.parent;sk.needHit='hit';}
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${SP_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'&&d.passive?'[Addition] ':'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of SP_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  Object.assign(SK_CC,{snLight:{flinch:.3},saEcho:{flinch:.3},saPurify:{flinch:.3},sbLullaby:{slow:2.5},sbShatter:{flinch:.4},sbRam:{air:1},sbSiren:{flinch:.4},sbCauldron:{slow:2},sbColchis:{flinch:.5},saOlympus:{air:1},scChariot:{flinch:.3},scCloud:{slow:2}});
  Object.assign(SK_KO,{basic:.8,snLight:1.4,saSun:1.2,saEcho:1,saPurify:1.2,saRain:.4,sbThread:1,sbLullaby:.8,sbShatter:2,sbRam:2.6,sbSiren:1.6,sbCauldron:2.6,sbColchis:1.6,saOlympus:3,scChariot:1.2,scShearing:.6,scCloud:.8,scSirens:.6,scPrism:.6,scCharm:.6});
  TABS.length=0;TABS.push({n:'Asclepius',keys:['saHymn','saShield','saSun','saPurify','saSanct','saAegis','saHand','saOlympus','saHermes','snChannel']},
    {n:'Medea',keys:['sbThread','sbHex','sbLullaby','sbSleep','sbRam','sbSiren','sbCauldron','sbColchis','sbSong','snLight']},
    {n:'Golden Wing',keys:['scShearing','scCloud','scChariot','scCharm','scSirens','snHop']});
  Object.assign(BUFFDEF,{saAegis:{n:'Aegis of Athena',c:SPC.gold,i:'AEGIS'},saHermes:{n:"Hermes' Sandals",c:SPC.gold,i:'HERMES'},saOlympus:{n:'Olympus',c:SPC.gold,i:'OLYMP'},sbSong:{n:'War Song',c:SPC.pink,i:'SONG'},sbColchis:{n:'Fleece of Colchis',c:SPC.gold,i:'FLEECE'},scCloud:{n:'Woolly Cloud',c:SPC.wool,i:'CLOUD'},rhSA:BUFFDEF.rhSA||{n:'Steady',c:'#c8b898',i:'SA'}});
  JOB.name='Arcadian Lamb';JOB.hpA=1.15;JOB.hpB=4.5;JOB.spB=4.2;
  ITEMS.shepherdCrook={n:"Golden Shepherd's Crook",slot:'rhand',two:1,kind:'Staff',atk:70,matk:170,wlv:3,aspd:156,ref:6,cards:2,w:110,b:{},size:{small:1,medium:1,large:1},d:'ไม้เท้าคนเลี้ยงแกะสีทอง'};
  ITEMS.colchisStaff={n:'Staff of Colchis',slot:'rhand',two:1,kind:'Staff',atk:80,matk:195,wlv:4,aspd:154,ref:4,cards:1,w:120,b:{},size:{small:1,medium:1,large:1},d:'ไม้เท้าแห่งคอลคิส'};
  EQ.rhand='shepherdCrook';INV.length=0;INV.push('colchisStaff','vikinghelm','ringPrec','clipLuck');
  /* flat TAL bonuses for magic hits */
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null))||window.SKCTX,br=sBranch(k);let b=0;
    if(hasBuff('sbSong'))b+=sLv(SB.sbSong.tal,'sbSong');if(SHP.colchis)b+=SB.sbColchis.tal;
    if(br==='B'){if(sL('sbLore'))b+=sLv(SB.sbLore.tal,'sbLore');if(sL('sbHarmony')){let n=0;for(const q in player.buffs)if(!q.startsWith('db')&&!q.startsWith('sl_')&&q!=='rhSA')n++;b+=n*sLv(SB.sbHarmony.per,'sbHarmony');}}
    if(e){if(sBound(e))b+=SP_BAL.enc.tal+(sL('sbBinder')?sLv(SB.sbBinder.tal,'sbBinder'):0);if(e.sleepT>gameTime)b+=SB.sbSleep.tal+(sL('scSlumber')?SB.scSlumber.tal:0);}
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=o&&o.magic?sTal():Math.max(1,D.patk);let m=(base+flat(e,o))/base;
    if(e&&e.hexT>gameTime){const df=(e.m&&e.m.def)||0;if(df>0&&o)o._defCut=(o._defCut||0)+SB.sbHex.def;}return m;};
  window.jgPreHit=(e)=>{if(e&&e.charmT>gameTime)return 0;return 1;};
  window.jgAbsorb=(d,e)=>{let r=SHP.wool*SP_BAL.wool.block;if(hasBuff('saAegis'))r+=sLv(SB.saAegis.block,'saAegis');if(hasBuff('saOlympus'))r+=SB.saOlympus.block;if(e&&e.hexT>gameTime)r+=SB.sbHex.atk;
    if(SHP.cloud)return 0;d=Math.max(1,d-r);
    for(const k of ['shield','cup']){if(SHP[k]>0&&d>0){const s=Math.min(SHP[k],d-1);SHP[k]-=s;d-=s;}}
    if(e&&!e.dead){if(sL('sbMirror')){SHP.mirrorN++;if(SHP.mirrorN>=sLv(SB.sbMirror.every,'sbMirror')){SHP.mirrorN=0;sHit(e,SB.sbMirror.dmg,'sbMirror');sEnc(e,1);addFx(new DText({x:player.x,y:player.y,z:90,text:'ขนกระจก!',color:SPC.gold2,size:12,life:.8}));}}
      if(hasBuff('saAegis')&&sL('scGorgon')){sHit(e,SB.scGorgon.dmg,'scGorgon');SHP.gorgN++;if(SHP.gorgN>=SB.scGorgon.every){SHP.gorgN=0;applyCC(e,{slow:2});}}}
    return d;};
  window.jgPostHit=()=>{};
  window.jgMove=()=>{let b=0;if(hasBuff('saHermes'))b+=SB.saHermes.move;if(SHP.cloud)b+=SB.scCloud.move;return 1+b/165;};
  window.jgDetect=()=>sL('snPresence')?(150-sLv(SB.snPresence.cut,'snPresence'))/150:1;
  window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>SHP.cloud?.35:(player.jgHide?.1:1);window.jgBleedMul=()=>1;
  window.jgSquash=()=>{const s=1+.025*SHP.wool-.04*SHP.thin;return [s,1+.01*SHP.wool];};window.jgOnSkillHit=()=>{};
  /* Thread of Fate: damage shared to the other bound enemies */
  /* 2026-11-21 fix: the share used to be dmg×0.3÷TAL, which went through the coefficient / bonuses a second time (≈ ×1.3 of the damage
     per linked enemy instead of ×0.3); now each linked enemy takes the hit's own multiplier × share */
  window.jgAfterHurt=(e,dmg,crit,o)=>{if(!o||o.dot||o.noFate||o.fate||!(o._m>0))return;const F=SHP.fate;if(F&&F.until>gameTime&&F.set.has(e)){for(const q of F.set){if(q===e||q.dead)continue;sHit(q,o._m*SB.sbFate.share,'sbFate',{fate:true});}}};
  window.sheepAutoTick=sheepAutoTick;
  mkBasic=function(t){sEnsure();return mkSpBasic(t);};sEnsure();window.sEnsure=sEnsure;for(const n of ['22_pow','h14_yawn','h15_ward'])sImg(n);
  try{document.title='Aetherfall — Golden Fleece Sheep';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Chrysie';if(cl)cl.textContent='Arcadian Lamb';}catch(e){}
  window.SHP=SHP;window.SP_DEFS=SP_DEFS;window.SP_BAL=SP_BAL;}
/* Free Cast counter (and Olympus: every skill free) */
function sFreeCast(sk){if(!sk.mp)return;if(SHP.olympus){player.mp=Math.min(player.maxMp,player.mp+sk.mp);return;}
  if(!sL('snFree'))return;SHP.freeN++;if(SHP.freeN>=sLv(SB.snFree.every,'snFree')){SHP.freeN=0;player.mp=Math.min(player.maxMp,player.mp+sk.mp);addFx(new DText({x:player.x,y:player.y,z:104,text:'ร่ายฟรี!',color:'#9adcff',size:12,life:.8}));}}

/* =====================================================================
   7. ICONS (painted if present, code SVG fallback)
   ===================================================================== */
function sIconSpec(d){const col=d.br==='A'?'#c8ffb0':d.br==='B'?'#ffb0f0':d.br==='C'?'#ffe9a8':'#fff2c8',bg=d.br==='A'?'#1a3a2a':d.br==='B'?'#3a1a3a':d.br==='C'?'#2a2214':'#2a2618';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const wool=`<g fill="#fff6d8" stroke="#8a6a3a" stroke-width="1">${[[14,20],[22,16],[30,20],[18,28],[26,28]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g>`;
  const star=`<path d="M22 8 L25 18 L35 18 L27 24 L30 34 L22 28 L14 34 L17 24 L9 18 L19 18Z" fill="${col}"/>`;
  let g;
  if(/Fleece|Wool|Shear|Cloud|Hop/.test(d.name))g=wool;
  else if(/Hymn|Channel|Grace|Hand|Cup|Rain|Rod|Lasting|Chorus|Well/.test(d.name))g=`<path d="M22 34 l-10 -10 a6 6 0 0 1 10 -8 a6 6 0 0 1 10 8z" fill="#7aff9a" stroke="#1a4a2a"/>`;
  else if(/Shield|Aegis|Gorgon|Sanct/.test(d.name))g=`<path d="M22 6 L36 12 V24 Q36 34 22 40 Q8 34 8 24 V12Z" fill="#c8a040" stroke="${col}" stroke-width="1.6"/>`;
  else if(/Thread|Needle|Fate/.test(d.name))g=`<path d="M6 34 Q14 10 22 22 T38 10" stroke="#ffd36a" stroke-width="3" fill="none"/>`;
  else if(/Lullaby|Song|Siren|Harmony/.test(d.name))g=`<text x="12" y="32" font-size="22" fill="${col}">♪</text>`;
  else if(/Hex|Charm|Cauldron|Binder|Lore|Mirror|Sleep|Slumber|Shatter/.test(d.name))g=`<circle cx="22" cy="22" r="12" fill="none" stroke="${col}" stroke-width="2.5"/>`+star;
  else if(/Ram/.test(d.name))g=`<ellipse cx="20" cy="26" rx="12" ry="8" fill="#ffd36a"/><circle cx="32" cy="20" r="6" fill="#ffd36a"/><path d="M28 16 a5 5 0 1 1 8 0" stroke="#fff" stroke-width="2" fill="none"/>`;
  else g=`<circle cx="22" cy="22" r="10" fill="#fff6c8"/><circle cx="22" cy="22" r="15" fill="none" stroke="#ffd36a" stroke-width="2"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/sheep/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
