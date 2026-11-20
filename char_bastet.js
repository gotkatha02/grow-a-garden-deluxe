/* =====================================================================
   TOTEM LEGEND — BASTET CURSE PRIESTESS (Egypt) — 12 Tails style
   Character module. Loaded only when the Bastet cat is played; index.html calls installBastet().
   Design: BASTET_SKILLS_TH.md

     Basic  · Temple Kitten          — tome pages, black-cat omen, Cat's Grace leap, Sand Veil shield, Ankh heal, Obelisk
     A Tree · Hexweaver of the Dead  — HEX 0–5 on each enemy: ticks every second, passes on at death, Word of Doom detonates
     B Tree · Tomb Warden            — summons cursed servants (mummies, scarabs, Anubis shade); SOULS 0–6 feed the servants
     C Tree · Heir of Bastet         — 12 nodes, each tied to the Basic / A / B skill of the same row (Lv 55 / 60 / 70 / 80)

   Pure magic hero: every skill uses TAL.
   Owner's rules: no percent effects (flat numbers, counters instead of chances). Attack speed fixed (CHAR_ASPD).
   Sprite: the wolf's sprite stands in until Bastet's own clips are made. All FX are code placeholders.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const BA_BAL={
  hex:{cap:5,capEternal:8,T:6,dot:.12,pass:.5,R:300},
  souls:{cap:6,every:3,tal:5},
  sk:{
    // ---- Basic
    bnTome:{chain:[2,3,4,4],hit:1.0},
    bnOmen:{every:4,dmg:[.6,.8,1.0]},
    bnGrace:{dist:[150,180,210],T:2,block:[10,15,20],cd:10,mp:8},
    bnVeil:{shield:[4,6,8],T:6,cd:18,mp:12},
    bnAnkh:{hp:[5,8],sp:[15,25],cd:25,mp:0},
    bnSistrum:{block:[3,6,9,12]},
    bnObelisk:{R:110,T:8,sp:[3,4,5],tal:[20,30,40],cd:30,mp:16},
    // ---- A · Hexweaver
    baGlyph:{dmg:[1.0,1.2,1.4,1.6],cd:4,mp:10,range:320},
    baWither:{dot:[.04,.06,.08]},
    baLocust:{dmg:[.4,.5],R:90,T:4,cd:10,mp:16,range:300},
    baSwarm:{T:[1,2],spd:60},
    baLink:{n:4,dmg:[1.0,1.3],R:200,T:6,cd:12,mp:14,range:300},
    baFate:{dmg:[.3,.5]},
    baApep:{dmg:[2.0,2.6],len:280,w:24,cd:9,mp:16,range:280},
    baVenom:{slow:2,T:3},
    baDoom:{dmg:[1.6,2.0],per:.6,R:300,cd:12,mp:20},
    baLinger:{left:[1,2]},
    baGrimoire:{tal:[6,9,12],n:5,R:300},
    baWrap:{dmg:1.2,root:1.5,cd:14,mp:12,range:260},
    baPharaoh:{dmg:[2.0,2.6],R:300,cd:60,mp:50},
    baEternal:{T:8},
    // ---- B · Tomb Warden
    bbSiphon:{n:4,dmg:[.4,.5,.6,.7],hp:1,cd:5,mp:10,range:300},
    bbJars:{start:[1,2,3],tal:[6,7,8]},
    bbMummy:{T:12,dmg:[.8,1.0],iv:1,cap:2,taunt:90,cd:8,mp:14,range:300},
    bbLash:{every:4,dmg:[.8,1.2],R:120},
    bbScarab:{n:6,T:10,dmg:[.25,.35],iv:.5,cd:14,mp:16,range:300},
    bbGolden:{dmg:[.6,.9]},
    bbAnubis:{T:10,dmg:[1.2,1.5],iv:1.2,cd:16,mp:16,range:300},
    bbWeigh:{every:5,dmg:3.0},
    bbHarvest:{dmg:[1.6,2.0],per:.7,R:260,cd:12,mp:18},
    bbReturn:{back:[2,3]},
    bbGuardian:{block:[4,6,8],cap:4},
    bbGate:{plus:3,cd:16,mp:12},
    bbArmy:{n:6,T:8,dmg:[.8,1.1],iv:1,cd:60,mp:50},
    bbAmmit:{dmg:3.0,R:160,souls:3},
    // ---- C
    bcPages:{dmg:1.6,R:120},
    bcTriple:{n:3},
    bcTether:{n:3},
    bcShadow:{dmg:1.4,R:90,T:1.5},
    bcStorm:{dmg:2.6,len:300,cd:16,mp:20,range:300},
    bcLord:{T:12,dmg:1.8,iv:1.5,R:90,taunt:160,cd:20,mp:22,range:300},
    bcBless:{T:10,hp:1,tal:30,cd:40,mp:20},
    bcApep:{dmg:2.4,R:100},
    bcPack:{n:3},
    bcAvatar:{T:15,tal:60,iv:.3,cd:90,mp:40},
    bcSekhmet:{dmg:4.0,per:.5,R:160,cd:50,mp:40,range:320},
    bcOsiris:{dmg:1.5,R:90,souls:2,cd:50,mp:40}
  }
};
const BB=BA_BAL.sk;
/* branch tuning from the bench: damage numbers of each branch are scaled here so the shown TAL×n stays true */
const BA_SCALE={A:1.38,B:.70};   /* re-benched 2026-11-21 after the core ticker fix (hex now really ticks): A 2,468 · B 2,470 (8 runs) — before the fix she sat at A 2,088 · B 1,690 */
(()=>{const r2=v=>Math.round(v*100)/100,sc=(o,f,m)=>{if(o[f]==null)return;o[f]=Array.isArray(o[f])?o[f].map(v=>r2(v*m)):r2(o[f]*m);};
  const colOf=k=>k.startsWith('ba')||['bcTriple','bcStorm','bcApep','bcSekhmet'].includes(k)?'A':k.startsWith('bb')||['bcTether','bcLord','bcPack','bcOsiris'].includes(k)?'B':null;
  for(const k in BB){const c=colOf(k);if(!c)continue;for(const f of ['dmg','per','dot'])sc(BB[k],f,BA_SCALE[c]);}
  BA_BAL.hex.dot=r2(BA_BAL.hex.dot*BA_SCALE.A);})();
const bT=n=>'TAL×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const BA_DEFS=[
 // ---------------- BASIC · TEMPLE KITTEN ----------------
 {key:'bnTome',id:'BN-B01',name:'Ankh Tome',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) เปิดคัมภีร์ ยิงหน้ากระดาษไฟวิญญาณใส่เป้า',lv:i=>[`ต่อ ${BB.bnTome.chain[i-1]} จังหวะ`]},
 {key:'bnOmen',id:'BN-B02',name:'Black Cat Omen',br:'basic',row:1,max:3,passive:1,d:'(Passive) ทุกจังหวะที่ 4 ของตีปกติ เงาแมวดำกระโจนใส่เป้า',lv:i=>[`${bT(BB.bnOmen.dmg[i-1])}`]},
 {key:'bnGrace',id:'BN-B03',name:"Cat's Grace",br:'basic',row:2,max:3,type:'self',d:'กระโดดแบบแมว หลังกระโดดดาเมจที่ได้รับลดลง',lv:i=>[`กระโดด ${BB.bnGrace.dist[i-1]}`,`${BB.bnGrace.T} วิ ดาเมจที่ได้รับ −${BB.bnGrace.block[i-1]} ต่อครั้ง`,`Cooldown ${BB.bnGrace.cd} วิ`]},
 {key:'bnVeil',id:'BN-B04',name:'Sand Veil',br:'basic',row:2,max:3,type:'self',d:'ผ้าคลุมทรายพันรอบตัว ได้โล่',lv:i=>[`โล่ = เลเวล × ${BB.bnVeil.shield[i-1]} นาน ${BB.bnVeil.T} วิ`,`Cooldown ${BB.bnVeil.cd} วิ`]},
 {key:'bnAnkh',id:'BN-B05',name:'Ankh of Life',br:'basic',row:3,max:2,type:'self',d:'ชูอังค์ ฟื้น HP และ SP',lv:i=>[`ฟื้น HP = เลเวล × ${BB.bnAnkh.hp[i-1]}`,`SP +${BB.bnAnkh.sp[i-1]}`,`Cooldown ${BB.bnAnkh.cd} วิ`]},
 {key:'bnSistrum',id:'BN-B06',name:'Sistrum Charm',br:'basic',row:3,max:4,passive:1,d:'(Passive) เครื่องรางกระดิ่งซิสตรัม',lv:i=>[`ดาเมจที่ได้รับ −${BB.bnSistrum.block[i-1]} ต่อครั้ง`]},
 {key:'bnObelisk',id:'BN-B07',name:'Temple Obelisk',br:'basic',row:4,max:3,type:'self',d:'ปักเสาโอเบลิสก์ ยืนในวงฟื้น SP และ TAL เพิ่ม',lv:i=>[`SP +${BB.bnObelisk.sp[i-1]} ทุกวิ`,`TAL +${BB.bnObelisk.tal[i-1]} นาน ${BB.bnObelisk.T} วิ`,`Cooldown ${BB.bnObelisk.cd} วิ`]},
 // ---------------- A · HEXWEAVER OF THE DEAD ----------------
 {key:'baGlyph',id:'BN-A01',name:'Curse Glyph',br:'A',row:1,max:4,type:'melee',d:'ยิงอักษรคำสาปใส่เป้า คำสาป +1 (อัปสลับเลเวลกับ Plague of Locusts)',lv:i=>[`${bT(BB.baGlyph.dmg[i-1])}`,`Cooldown ${BB.baGlyph.cd} วิ`]},
 {key:'baWither',id:'BN-A02',name:'Withering',br:'A',row:2,max:3,passive:1,d:'(Passive) คำสาปกัดแรงขึ้น',lv:i=>[`+${bT(BB.baWither.dot[i-1])} ต่อชั้นต่อวิ`]},
 {key:'baLocust',id:'BN-A03',name:'Plague of Locusts',br:'A',row:3,max:2,type:'ground',radius:()=>BB.baLocust.R,pre:[['baGlyph',1]],d:'ฝูงตั๊กแตนต้องสาป ทุก 1 วิในฝูง คำสาป +1',lv:i=>[`${bT(BB.baLocust.dmg[i-1])} ทุก 0.5 วิ นาน ${BB.baLocust.T} วิ`,`Cooldown ${BB.baLocust.cd} วิ`]},
 {key:'baSwarm',id:'BN-A04',name:'Endless Swarm',br:'A',row:3,max:2,passive:1,enh:'baLocust',pre:[['baLocust',1]],d:'(ต่อยอด Plague of Locusts) ฝูงบินตามศัตรูที่มีคำสาปมากที่สุด',lv:i=>[`อยู่นานขึ้น +${BB.baSwarm.T[i-1]} วิ`]},
 {key:'baLink',id:'BN-A05',name:'Curse Link',br:'A',row:4,max:2,type:'melee',d:'ผูกด้ายคำสาปโยงศัตรู 4 ตัว ใส่คำสาปตัวหนึ่ง ตัวที่โยงกันได้ด้วย',lv:i=>[`${bT(BB.baLink.dmg[i-1])} · โยง ${BB.baLink.T} วิ`,`Cooldown ${BB.baLink.cd} วิ`]},
 {key:'baFate',id:'BN-A06',name:'Shared Fate',br:'A',row:4,max:2,passive:1,enh:'baLink',pre:[['baLink',1]],d:'(ต่อยอด Curse Link) ตัวที่โยงกันโดนสกิล A ตัวอื่นในเส้นโดนด้วย',lv:i=>[`${bT(BB.baFate.dmg[i-1])}`]},
 {key:'baApep',id:'BN-A07',name:'Mark of Apep',br:'A',row:5,max:2,type:'melee',d:'งูอาเปปเงาดำเลื้อยทะลุแนวตรง คำสาป +2',lv:i=>[`${bT(BB.baApep.dmg[i-1])} ยาว ${BB.baApep.len}`,`Cooldown ${BB.baApep.cd} วิ`]},
 {key:'baVenom',id:'BN-A08',name:'Venom Coil',br:'A',row:5,max:1,passive:1,enh:'baApep',pre:[['baApep',1]],d:'(ต่อยอด Mark of Apep) ศัตรูที่โดนงูช้าลง คำสาปอยู่นานขึ้น',lv:()=>[`ช้าลง ${BB.baVenom.slow} วิ · คำสาป +${BB.baVenom.T} วิ`]},
 {key:'baDoom',id:'BN-A09',name:'Word of Doom',br:'A',row:6,max:2,type:'self',d:'ศัตรูทุกตัวที่มีคำสาปรอบตัวระเบิด ล้างคำสาปตัวที่ระเบิด',lv:i=>[`${bT(BB.baDoom.dmg[i-1])} + ${bT(BB.baDoom.per)} ต่อชั้น รัศมี ${BB.baDoom.R}`,`Cooldown ${BB.baDoom.cd} วิ`]},
 {key:'baLinger',id:'BN-A10',name:'Lingering Doom',br:'A',row:6,max:2,passive:1,enh:'baDoom',pre:[['baDoom',1]],d:'(ต่อยอด Word of Doom) ระเบิดแล้วเหลือคำสาปไว้',lv:i=>[`เหลือ ${BB.baLinger.left[i-1]} ชั้น`]},
 {key:'baGrimoire',id:'BN-A11',name:'Black Grimoire',br:'A',row:7,max:3,passive:1,d:'(Passive) ศัตรูที่มีคำสาปใกล้ตัว (สูงสุด 5 ตัว) ให้ TAL เพิ่มกับสกิล A',lv:i=>[`TAL +${BB.baGrimoire.tal[i-1]} ต่อตัว`]},
 {key:'baWrap',id:'BN-A12',name:"Mummy's Wrap",br:'A',row:7,max:1,type:'melee',d:'ผ้าพันมัมมี่พุ่งรัดเป้า ตรึงอยู่กับที่ คำสาป +1',lv:()=>[`${bT(BB.baWrap.dmg)} · ตรึง ${BB.baWrap.root} วิ`,`Cooldown ${BB.baWrap.cd} วิ`]},
 {key:'baPharaoh',id:'BN-A13',name:'Curse of the Pharaoh',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · ดวงตาฟาโรห์ลืมบนฟ้า ศัตรูรอบตัวคำสาปเต็ม 5 ชั้น',lv:i=>[`${bT(BB.baPharaoh.dmg[i-1])} รัศมี ${BB.baPharaoh.R}`,`Cooldown ${BB.baPharaoh.cd} วิ`]},
 {key:'baEternal',id:'BN-A14',name:'Eternal Curse',br:'A',row:8,max:1,passive:1,enh:'baPharaoh',pre:[['baPharaoh',1]],d:'(ต่อยอด Curse of the Pharaoh) จบอัลติ คำสาปไม่หมดเวลา เพดาน 5 → 8 ชั้น',lv:()=>[`นาน ${BB.baEternal.T} วิ`]},
 // ---------------- B · TOMB WARDEN ----------------
 {key:'bbSiphon',id:'BN-G01',name:'Soul Siphon',br:'B',row:1,max:4,type:'melee',d:'สายวิญญาณดูดจากเป้า 4 ครั้ง ฟื้น HP ทุกครั้ง (อัปสลับเลเวลกับ Raise Mummy)',lv:i=>[`${bT(BB.bbSiphon.dmg[i-1])} × ${BB.bbSiphon.n}`,`ฟื้น HP = เลเวล × ${BB.bbSiphon.hp} ต่อครั้ง`,`Cooldown ${BB.bbSiphon.cd} วิ`]},
 {key:'bbJars',id:'BN-G02',name:'Canopic Jars',br:'B',row:2,max:3,passive:1,d:'(Passive) เริ่มมีวิญญาณ และวิญญาณแต่ละดวงเพิ่ม TAL ผู้รับใช้มากขึ้น',lv:i=>[`เริ่ม ${BB.bbJars.start[i-1]} ดวง`,`TAL ผู้รับใช้ +${BB.bbJars.tal[i-1]} ต่อดวง`]},
 {key:'bbMummy',id:'BN-G03',name:'Raise Mummy',br:'B',row:3,max:2,type:'self',pre:[['bbSiphon',1]],d:'มัมมี่ผู้รับใช้โผล่จากทราย ยั่วศัตรูใกล้ ๆ (สูงสุด 2 ตัว)',lv:i=>[`${bT(BB.bbMummy.dmg[i-1])} ทุก 1 วิ นาน ${BB.bbMummy.T} วิ`,`Cooldown ${BB.bbMummy.cd} วิ`]},
 {key:'bbLash',id:'BN-G04',name:'Bandage Lash',br:'B',row:3,max:2,passive:1,enh:'bbMummy',pre:[['bbMummy',1]],d:'(ต่อยอด Raise Mummy) ทุกครั้งที่ 4 ที่มัมมี่ตี ผ้าพันแผลดึงศัตรูรอบ ๆ เข้ามา',lv:i=>[`${bT(BB.bbLash.dmg[i-1])} รัศมี ${BB.bbLash.R}`]},
 {key:'bbScarab',id:'BN-G05',name:'Scarab Swarm',br:'B',row:4,max:2,type:'self',d:'ปล่อยแมลงสคารับทอง 6 ตัว บินไปกัดเป้า',lv:i=>[`${bT(BB.bbScarab.dmg[i-1])} ทุก 0.5 วิ นาน ${BB.bbScarab.T} วิ`,`Cooldown ${BB.bbScarab.cd} วิ`]},
 {key:'bbGolden',id:'BN-G06',name:'Golden Scarab',br:'B',row:4,max:2,passive:1,enh:'bbScarab',pre:[['bbScarab',1]],d:'(ต่อยอด Scarab Swarm) หมดเวลา สคารับพุ่งระเบิดใส่ศัตรูใกล้สุด',lv:i=>[`${bT(BB.bbGolden.dmg[i-1])} ต่อตัว`]},
 {key:'bbAnubis',id:'BN-G07',name:'Anubis Shade',br:'B',row:5,max:2,type:'self',d:'เงาอนูบิสพุ่งกัดจากตัวหนึ่งไปอีกตัว',lv:i=>[`${bT(BB.bbAnubis.dmg[i-1])} ทุก ${BB.bbAnubis.iv} วิ นาน ${BB.bbAnubis.T} วิ`,`Cooldown ${BB.bbAnubis.cd} วิ`]},
 {key:'bbWeigh',id:'BN-G08',name:'Weighing of the Heart',br:'B',row:5,max:1,passive:1,enh:'bbAnubis',pre:[['bbAnubis',1]],d:'(ต่อยอด Anubis Shade) ทุกครั้งที่ 5 ที่อนูบิสกัด ตาชั่งลงตัดสิน',lv:()=>[`${bT(BB.bbWeigh.dmg)}`]},
 {key:'bbHarvest',id:'BN-G09',name:'Soul Harvest',br:'B',row:6,max:2,type:'self',d:'ปล่อยวิญญาณทั้งหมดเป็นผีพุ่งใส่ศัตรูรอบตัว (ใช้วิญญาณทั้งหมด)',lv:i=>[`${bT(BB.bbHarvest.dmg[i-1])} + ${bT(BB.bbHarvest.per)} ต่อดวง รัศมี ${BB.bbHarvest.R}`,`Cooldown ${BB.bbHarvest.cd} วิ`]},
 {key:'bbReturn',id:'BN-G10',name:'Return to the Jar',br:'B',row:6,max:2,passive:1,enh:'bbHarvest',pre:[['bbHarvest',1]],d:'(ต่อยอด Soul Harvest) หลังปล่อย คืนวิญญาณ',lv:i=>[`คืน ${BB.bbReturn.back[i-1]} ดวง`]},
 {key:'bbGuardian',id:'BN-G11',name:'Guardian of the Tomb',br:'B',row:7,max:3,passive:1,d:'(Passive) ผู้รับใช้ในสนามตัวละ ลดดาเมจที่เราได้รับ (สูงสุด 4 ตัว)',lv:i=>[`−${BB.bbGuardian.block[i-1]} ต่อครั้ง ต่อตัว`]},
 {key:'bbGate',id:'BN-G12',name:'Duat Gate',br:'B',row:7,max:1,type:'self',d:'สลับที่กับผู้รับใช้ตัวที่ไกลสุด ผู้รับใช้ทุกตัวอยู่นานขึ้น',lv:()=>[`+${BB.bbGate.plus} วิ`,`Cooldown ${BB.bbGate.cd} วิ`]},
 {key:'bbArmy',id:'BN-G13',name:'Army of the Duat',br:'B',row:8,max:2,type:'self',ult:1,d:'ULTIMATE B · ประตูสุสานเปิด มัมมี่นักรบ 6 ตัวออกมาสู้',lv:i=>[`${bT(BB.bbArmy.dmg[i-1])} ทุก 1 วิ นาน ${BB.bbArmy.T} วิ`,`Cooldown ${BB.bbArmy.cd} วิ`]},
 {key:'bbAmmit',id:'BN-G14',name:"Ammit's Feast",br:'B',row:8,max:1,passive:1,enh:'bbArmy',pre:[['bbArmy',1]],d:'(ต่อยอด Army of the Duat) จบอัลติ อัมมิตโผล่งับกลางวง วิญญาณ +3',lv:()=>[`${bT(BB.bbAmmit.dmg)} รัศมี ${BB.bbAmmit.R}`]},
 // ---------------- C · HEIR OF BASTET ----------------
 {key:'bcPages',id:'BN-C01',name:'Nine Pages',br:'C',col:'basic',tier:1,passive:1,pre:[['bnTome',4]],d:'ตีปกติต่อได้ 5 จังหวะ จังหวะที่ 5 กระดาษคัมภีร์วนรอบตัว',lv:()=>[`${bT(BB.bcPages.dmg)} รัศมี ${BB.bcPages.R}`]},
 {key:'bcTriple',id:'BN-C02',name:'Triple Glyph',br:'C',col:'A',tier:1,passive:1,pre:[['baGlyph',4]],d:'Curse Glyph ยิงอักษร 3 ดวงใส่ 3 ตัว',lv:()=>['3 ดวง']},
 {key:'bcTether',id:'BN-C03',name:'Soul Tether',br:'C',col:'B',tier:1,passive:1,pre:[['bbSiphon',4]],d:'Soul Siphon ดูดพร้อมกัน 3 ตัว',lv:()=>['3 ตัว']},
 {key:'bcShadow',id:'BN-C04',name:'Shadow Cat',br:'C',col:'basic',tier:2,passive:1,pre:[['bnGrace',3]],d:"Cat's Grace ทิ้งเงาแมวดำล่อศัตรู แล้วระเบิด",lv:()=>[`${bT(BB.bcShadow.dmg)} รัศมี ${BB.bcShadow.R}`]},
 {key:'bcStorm',id:'BN-C05',name:'Locust Storm',br:'C',col:'A',tier:2,type:'melee',pre:[['baLocust',2]],d:'[New Active] พายุตั๊กแตนพุ่งไปข้างหน้า คำสาป +2',lv:()=>[`${bT(BB.bcStorm.dmg)} ทุกตัวในแนว ${BB.bcStorm.len}`,`Cooldown ${BB.bcStorm.cd} วิ`]},
 {key:'bcLord',id:'BN-C06',name:'Mummy Lord',br:'C',col:'B',tier:2,type:'self',pre:[['bbMummy',2]],d:'[New Active] มัมมี่ฟาโรห์ตัวใหญ่ ตีวงรอบตัว ยั่วศัตรูในวงกว้าง',lv:()=>[`${bT(BB.bcLord.dmg)} ทุก ${BB.bcLord.iv} วิ นาน ${BB.bcLord.T} วิ`,`Cooldown ${BB.bcLord.cd} วิ`]},
 {key:'bcBless',id:'BN-C07',name:"Bastet's Blessing",br:'C',col:'basic',tier:3,type:'self',pre:[['bnAnkh',2]],d:'[New Active] พรบาสเทต ฟื้น HP ต่อเนื่อง TAL เพิ่ม',lv:()=>[`ฟื้น HP = เลเวล × ${BB.bcBless.hp} ทุกวิ`,`TAL +${BB.bcBless.tal} นาน ${BB.bcBless.T} วิ`,`Cooldown ${BB.bcBless.cd} วิ`]},
 {key:'bcApep',id:'BN-C08',name:'Apep Awakens',br:'C',col:'A',tier:3,passive:1,pre:[['baApep',2]],d:'Mark of Apep จบด้วยงูตัวใหญ่งับปลายทาง คำสาป +1',lv:()=>[`${bT(BB.bcApep.dmg)} รัศมี ${BB.bcApep.R}`]},
 {key:'bcPack',id:'BN-C09',name:'Jackal Pack',br:'C',col:'B',tier:3,passive:1,pre:[['bbAnubis',2]],d:'Anubis Shade เรียกเงาอนูบิส 3 ตัว',lv:()=>['3 ตัว']},
 {key:'bcAvatar',id:'BN-C10',name:'Avatar of Bastet',br:'C',col:'basic',tier:4,type:'self',pre:[['bnObelisk',3]],d:'[New Active] Signature · ร่างเทพีแมวทอง ตีปกติแรงขึ้น คำสาปใส่ทีละ 2 เท่า ผู้รับใช้ตีถี่ขึ้น',lv:()=>[`ตีปกติ TAL +${BB.bcAvatar.tal}`,`ผู้รับใช้ช่วงตี −${BB.bcAvatar.iv} วิ`,`นาน ${BB.bcAvatar.T} วิ · Cooldown ${BB.bcAvatar.cd} วิ`]},
 {key:'bcSekhmet',id:'BN-C11',name:"Sekhmet's Plague Sun",br:'C',col:'A',tier:4,type:'ground',radius:()=>BB.bcSekhmet.R,pre:[['baPharaoh',1]],d:'[New Active] ดวงอาทิตย์แดงตกกลางพื้นที่ ล้างคำสาป',lv:()=>[`${bT(BB.bcSekhmet.dmg)} + ${bT(BB.bcSekhmet.per)} ต่อชั้นคำสาปของตัวที่โดน`,`Cooldown ${BB.bcSekhmet.cd} วิ`]},
 {key:'bcOsiris',id:'BN-C12',name:'Judgment of Osiris',br:'C',col:'B',tier:4,type:'self',pre:[['bbArmy',1]],d:'[New Active] ผู้รับใช้ทุกตัวระเบิดพร้อมกันแล้วสู้ต่อ วิญญาณ +2',lv:()=>[`${bT(BB.bcOsiris.dmg)} ต่อตัว รัศมี ${BB.bcOsiris.R}`,`Cooldown ${BB.bcOsiris.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const BA={souls:0,soulN:0,bellN:0,shield:0,shieldUntil:0,obelisk:null,locusts:[],link:null,minions:[],armyEnd:0,armyAmmit:false};
const MINION_KEYS=new Set(['bbMummy','bbLash','bbScarab','bbGolden','bbAnubis','bbWeigh','bbArmy','bcLord','bcOsiris']);
const bL=k=>LV[k]||0;
const bLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,bL(k)))-1];
const BAC={hex:'#b06aff',hex2:'#6a2aa8',soul:'#6ae0ff',gold:'#ffd36a',sand:'#e8d3a0',red:'#ff5a3a',dark:'#2a1a3a',white:'#ffffff'};
const bCol=k=>{if(!k||k==='basic')return 'basic';if(k==='baHex')return 'A';const d=BA_DEFS.find(x=>x.key===k);if(!d)return 'basic';return d.br==='C'?d.col:d.br;};
const bAvatar=()=>hasBuff('bcAvatar');
const bEternal=()=>hasBuff('baEternal');
const bHexCap=()=>bEternal()?BA_BAL.hex.capEternal:BA_BAL.hex.cap;
function bHit(e,mult,key,o={}){if(!e||e.dead)return 0;const br=bCol(key);const r=hurt(e,mult,Object.assign({skill:key,br},o));
  if(br==='B'&&!MINION_KEYS.has(key)&&key!=='bbHarvest'&&key!=='bbAmmit'){if(++BA.soulN>=BA_BAL.souls.every){BA.soulN=0;bSoul(1);}}
  if(e.dead){if(br==='B')bSoul(1);if(e.bHex>0)bPassHex(e);}
  /* Shared Fate: A damage on a linked enemy echoes to the rest of the link */
  else if(br==='A'&&key!=='baFate'&&key!=='baHex'&&bL('baFate')&&BA.link&&BA.link.until>gameTime&&BA.link.set.includes(e)){
    for(const q of BA.link.set)if(q!==e&&!q.dead)bHit(q,bLv(BB.baFate.dmg,'baFate'),'baFate');}
  return r;}
function bSoul(n){const b=BA.souls;BA.souls=Math.min(BA_BAL.souls.cap,BA.souls+n);if(BA.souls>b)BA.soulPop=1;}
const bNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const bSeg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const bLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&bSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function bFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function bPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!bFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const bTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const bPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const bPt=(c,r)=>{const t=bTgt(c,r);return [c.gx??(t?t.x:player.x+Math.cos(player.phi)*120),c.gy??(t?t.y:player.y+Math.sin(player.phi)*120)];};
const bAng=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
/* HEX (A) — stacks on each enemy */
function bAddHex(e,n,raw){if(!e||e.dead||n<=0)return;if(bAvatar()&&!raw)n*=2;e.bHex=Math.min(bHexCap(),(e.bHex||0)+n);e.bHexT=Math.max(e.bHexT||0,gameTime+BA_BAL.hex.T);e.bHexPop=1;
  const L=BA.link;if(!raw&&L&&L.until>gameTime&&L.set.includes(e)&&!L.busy){L.busy=true;for(const q of L.set)if(q!==e)bAddHex(q,n,true);L.busy=false;}}
function bPassHex(e){const n=Math.floor(e.bHex*BA_BAL.hex.pass);e.bHex=0;if(!n)return;const q=enemies.filter(z=>!z.dead&&z!==e&&dist(z,e)<BA_BAL.hex.R).sort((a,b)=>dist(a,e)-dist(b,e))[0];
  if(q){addFx(new BaBeam({x:e.x,y:e.y,phi:bAng(e,q),L:dist(e,q),col:BAC.hex,w:4,life:.3}));bAddHex(q,n,true);}}
const bMinions=k=>BA.minions.filter(m=>!m.dead&&(!k||m.kind===k));
const bSoulTal=()=>BA.souls*(bL('bbJars')?bLv(BB.bbJars.tal,'bbJars'):BA_BAL.souls.tal);

/* ---------------------------------------------------------------------
   4. FX (code placeholders — painted pieces come later)
   --------------------------------------------------------------------- */
function bGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function bPow(e,big,col){addFx(new Impact({pos:[e.x,e.y,(e.boss?36:24)],size:big?48:26,color:col||BAC.hex,core:'#ffffff',rays:big?10:6,life:big?.24:.15}));}
function bBurst(x,y,R,col){addFx(new GRing({x,y,r0:8,r1:R,w:10,color:col||BAC.hex,life:.35}));for(let i=0;i<qn(12);i++){const a=rnd(0,TAU),s=rnd(60,160);emit({type:'round',x,y,z:rnd(6,30),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(40,140),drag:1.2,life:rnd(.35,.6),size:rnd(2,4),size1:.5,color:(i&1)?col||BAC.hex:'#ffffff'});}}
class BaHome{constructor(o){Object.assign(this,{t:0,layer:'top',speed:460,z:40,col:BAC.hex,turn:7,life:2.2,r:7},o);this.vx=Math.cos(this.phi)*this.speed;this.vy=Math.sin(this.phi)*this.speed;}
  update(dt){this.t+=dt;let e=this.tg&&!this.tg.dead?this.tg:nearestEnemy(this.x,this.y,360);if(e){const a=Math.atan2(e.y-this.y,e.x-this.x),c=Math.atan2(this.vy,this.vx);let d=a-c;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;const n=c+clamp(d,-this.turn*dt,this.turn*dt);this.vx=Math.cos(n)*this.speed;this.vy=Math.sin(n)*this.speed;
      if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+12){this.hit&&this.hit(e);bPow(e,false,this.col);return false;}}
    this.x+=this.vx*dt;this.y+=this.vy*dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);bGlow(x,y,18,this.col,.6);ctx.save();ctx.translate(x,y);ctx.rotate(this.t*6);ctx.fillStyle='#fff4dc';ctx.fillRect(-this.r*.7,-this.r*.9,this.r*1.4,this.r*1.8);ctx.restore();}}
class BaShot{constructor(o){Object.assign(this,{t:0,layer:'top',speed:560,len:280,w:24,z:20,col:BAC.dark,d:0,hits:new Set(),kind:'snake'},o);this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;this.d+=this.speed*dt;this.x=this.x0+Math.cos(this.phi)*this.d;this.y=this.y0+Math.sin(this.phi)*this.d;
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w){this.hits.add(e);this.hit&&this.hit(e);}}
    if(!bFree(this.x,this.y)||this.d>=this.len){this.end&&this.end(this.x,this.y);return false;}return true;}
  draw(){const [x,y]=P(this.x,this.y,this.z);bGlow(x,y,this.w*1.6,this.kind==='storm'?BAC.sand:BAC.hex,.5);ctx.save();ctx.translate(x,y);
    if(this.kind==='storm'){ctx.strokeStyle=hexA(BAC.sand,.9);ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,this.w*(.4+i*.3),this.t*10+i,this.t*10+i+4);ctx.stroke();}}
    else{ctx.strokeStyle=BAC.dark;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<6;i++){const k=i*8,px=-Math.cos(this.phi)*k,py=-Math.sin(this.phi)*k*K+Math.sin(this.t*20-i)*5;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.fillStyle=BAC.hex;ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();}ctx.restore();}}
class BaBeam{constructor(o){Object.assign(this,{t:0,life:.28,layer:'top',w:8,col:BAC.soul,z0:34,z1:34},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x0,y0]=P(this.x,this.y,this.z0),[x1,y1]=P(this.x+Math.cos(this.phi)*this.L,this.y+Math.sin(this.phi)*this.L,this.z1);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    ctx.strokeStyle=hexA(this.col,.55*a);ctx.lineWidth=this.w*2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a);ctx.lineWidth=this.w*.5;ctx.stroke();ctx.restore();}}
class BaPillar{constructor(o){Object.assign(this,{t:0,life:.35,layer:'top',w:14,col:BAC.hex},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=P(this.x,this.y,0);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x,y-260,x,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA(this.col,.8*a));ctx.fillStyle=g;ctx.fillRect(x-this.w/2,y-260,this.w,260);ctx.restore();bGlow(x,y,this.w*2.2,this.col,.5*a);}}

/* ---------- B servants ---------- */
class BaMinion{constructor(o){Object.assign(this,{t:0,layer:'top',kind:'mummy',life:12,iv:1,cd:.4,reach:30,spd:150,dmg:1,key:'bbMummy',n:0,slot:0,dead:false,flash:0},o);this.x=this.x??player.x;this.y=this.y??player.y;BA.minions.push(this);}
  tgt(){const a=player.attackTarget;if(a&&!a.dead&&dist(a,player)<460)return a;return nearestEnemy(this.x,this.y,340)||nearestEnemy(player.x,player.y,340);}
  update(dt){if(this.dead||CHAR!=='bastet')return this.kill();this.t+=dt;this.flash=Math.max(0,this.flash-dt*4);if(this.t>=this.life){this.onEnd&&this.onEnd(this);return this.kill();}
    this.cd-=dt;const e=this.tgt();
    if(this.kind==='anubis'){if(e&&this.cd<=0){const L=bNear(this.x,this.y,300);const q=L.length>1?L.filter(z=>z!==this.last).sort((a,b)=>dist(a,this)-dist(b,this))[0]:e;
        if(q){addFx(new BaBeam({x:this.x,y:this.y,phi:bAng(this,q),L:dist(this,q),col:BAC.dark,w:6,life:.2,z0:20,z1:20}));this.x=q.x-Math.cos(bAng(this,q))*20;this.y=q.y-Math.sin(bAng(this,q))*20;this.last=q;this.cd=this.iv-(bAvatar()?BB.bcAvatar.iv:0);this.atk(q);}}
      else if(!e)this.follow(dt);return true;}
    if(e){const d=dist(this,e);if(d>e.r+this.reach){const a=bAng(this,e);this.x+=Math.cos(a)*this.spd*dt;this.y+=Math.sin(a)*this.spd*dt;}
      else if(this.cd<=0){this.cd=this.iv-(bAvatar()?BB.bcAvatar.iv:0);this.atk(e);this.flash=1;}}
    else this.follow(dt);
    if(this.taunt)for(const q of bNear(this.x,this.y,this.taunt)){q.bTaunt=gameTime+.6;q.bTauntBy=this;}
    return true;}
  follow(dt){const an=this.slot*1.3+this.t*.4,tx=player.x+Math.cos(an)*60,ty=player.y+Math.sin(an)*40,d=Math.hypot(tx-this.x,ty-this.y);if(d>8){this.x+=(tx-this.x)/d*Math.min(d,this.spd*dt);this.y+=(ty-this.y)/d*Math.min(d,this.spd*dt);}}
  atk(e){this.n++;const m=this.dmg;
    if(this.kind==='lord'){for(const q of bNear(this.x,this.y,BB.bcLord.R))bHit(q,m,this.key);bBurst(this.x,this.y,BB.bcLord.R,BAC.gold);return;}
    bHit(e,m,this.key);bPow(e,false,this.kind==='scarab'?BAC.gold:this.kind==='anubis'?BAC.dark:BAC.sand);
    if(this.kind==='anubis'&&bL('bbWeigh')&&this.n%BB.bbWeigh.every===0){addFx(new BaPillar({x:e.x,y:e.y,w:30,col:BAC.gold,life:.45}));bHit(e,BB.bbWeigh.dmg,'bbWeigh',{big:true});}
    if(this.kind==='mummy'&&bL('bbLash')&&this.n%BB.bbLash.every===0){for(const q of bNear(this.x,this.y,BB.bbLash.R)){if(!q.boss){const d=Math.max(1,dist(q,this));q.x+=(this.x-q.x)/d*Math.min(d-20,60);q.y+=(this.y-q.y)/d*Math.min(d-20,60);}bHit(q,bLv(BB.bbLash.dmg,'bbLash'),'bbLash');}bBurst(this.x,this.y,BB.bbLash.R,BAC.sand);}}
  kill(){this.dead=true;const i=BA.minions.indexOf(this);if(i>=0)BA.minions.splice(i,1);return false;}
  draw(){const a=Math.min(1,this.t/.3,(this.life-this.t)/.3);if(a<=0)return;const [x,y]=P(this.x,this.y,0);ctx.save();ctx.globalAlpha=a;
    if(this.kind==='scarab'){const [sx,sy]=P(this.x,this.y,26+Math.sin(this.t*12)*4);bGlow(sx,sy,10,BAC.gold,.5);ctx.fillStyle=BAC.gold;ctx.beginPath();ctx.ellipse(sx,sy,5,4,0,0,TAU);ctx.fill();}
    else if(this.kind==='anubis'){ctx.fillStyle=hexA('#141020',.8);ctx.beginPath();ctx.ellipse(x,y-14,14,11,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x-6,y-24);ctx.lineTo(x-3,y-40);ctx.lineTo(x,y-24);ctx.moveTo(x+2,y-24);ctx.lineTo(x+6,y-40);ctx.lineTo(x+9,y-24);ctx.fill();ctx.fillStyle=BAC.gold;ctx.fillRect(x-2,y-20,3,2);ctx.fillRect(x+4,y-20,3,2);}
    else{const s=this.kind==='lord'?1.6:this.kind==='army'?.9:1,col=this.kind==='lord'?'#f2dc9a':this.kind==='army'?'#bfae86':BAC.sand;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y,14*s,5*s,0,0,TAU);ctx.fill();
      ctx.fillStyle=this.flash?'#ffffff':col;ctx.strokeStyle='#6a5a3a';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-10*s,y-44*s,20*s,44*s,7*s);ctx.fill();ctx.stroke();
      for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x-10*s,y-i*9*s);ctx.lineTo(x+10*s,y-i*9*s-3*s);ctx.stroke();}ctx.fillStyle=this.kind==='lord'?BAC.gold:BAC.soul;ctx.fillRect(x-5*s,y-37*s,3*s,3*s);ctx.fillRect(x+2*s,y-37*s,3*s,3*s);}
    ctx.restore();}}
/* ground layer */
class BaGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='bastet';}
  ring(x,y,R,col,a,dash){const [px,py]=P(x,y);ctx.save();ctx.translate(px,py);ctx.scale(1,K);ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=3;if(dash){ctx.setLineDash([8,6]);ctx.lineDashOffset=-this.t*30;}ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.globalAlpha=a*.25;ctx.fillStyle=col;ctx.fill();ctx.restore();}
  draw(){const O=BA.obelisk;if(O){this.ring(O.x,O.y,BB.bnObelisk.R,BAC.gold,.6,true);const [x,y]=P(O.x,O.y,0);ctx.fillStyle='#d8c08a';ctx.strokeStyle='#6a5a3a';ctx.beginPath();ctx.moveTo(x-7,y);ctx.lineTo(x-5,y-60);ctx.lineTo(x,y-68);ctx.lineTo(x+5,y-60);ctx.lineTo(x+7,y);ctx.fill();ctx.stroke();}
    for(const L of BA.locusts){this.ring(L.x,L.y,BB.baLocust.R,'#8a7a3a',.45,true);for(let i=0;i<qn(10);i++){const an=this.t*3+i*.63,r=(i*13%BB.baLocust.R),[lx,ly]=P(L.x+Math.cos(an)*r,L.y+Math.sin(an*1.3)*r*.7,10+(i%3)*8);ctx.fillStyle='#4a4a1a';ctx.fillRect(lx-2,ly-1,4,2);}}}}
/* top layer: hex marks, souls, shield, link threads */
class BaTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;BA.soulPop=Math.max(0,(BA.soulPop||0)-dt*4);return CHAR==='bastet';}
  draw(){for(const e of enemies){if(e.dead||!(e.bHex>0))continue;const [x,y]=P(e.x,e.y,(e.boss?70:50)*(e.sc||1));for(let i=0;i<e.bHex;i++){const an=this.t*2+i*TAU/e.bHex,px=x+Math.cos(an)*12,py=y+Math.sin(an)*4;bGlow(px,py,6,BAC.hex,.6);ctx.fillStyle='#e8d0ff';ctx.fillRect(px-1.5,py-2,3,4);}}
    const L=BA.link;if(L&&L.until>gameTime){ctx.save();ctx.strokeStyle=hexA(BAC.hex,.6);ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();const s=L.set.filter(e=>!e.dead);s.forEach((e,i)=>{const [x,y]=P(e.x,e.y,30);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();}
    const pz=(player.z||0)+80*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    if(bL('bbSiphon'))for(let i=0;i<BA.souls;i++){const an=this.t*2.2+i*TAU/Math.max(1,BA.souls),px=x+Math.cos(an)*26,py=y+Math.sin(an)*9;bGlow(px,py,8,BAC.soul,.6);ctx.fillStyle='#e8fbff';ctx.beginPath();ctx.arc(px,py-BA.soulPop*2,2.4,0,TAU);ctx.fill();}
    if(BA.shield>0&&BA.shieldUntil>gameTime){const [sx,sy]=P(player.x,player.y,36);ctx.save();ctx.strokeStyle=hexA(BAC.sand,.8);ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.arc(sx,sy-6,38,this.t*2,this.t*2+TAU);ctx.stroke();ctx.restore();}
    if(bAvatar())bGlow(x,y+40,56,BAC.gold,.25+.1*Math.sin(this.t*8));
    if(hasBuff('baEternal')){ctx.save();ctx.fillStyle='rgba(40,10,60,.12)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}}}
/* per-frame logic */
class BaCore{constructor(){this.t=0;this.layer='none';this.tk=0;this.h=0;}draw(){}
  update(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new BaGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new BaTop());
    this.tk+=dt;const tick=this.tk>=1;if(tick)this.tk=0;this.h+=dt;const half=this.h>=.5;if(half)this.h=0;
    /* hex: tick + expiry */
    if(tick){const per=BA_BAL.hex.dot+(bL('baWither')?bLv(BB.baWither.dot,'baWither'):0);for(const e of enemies){if(e.dead||!(e.bHex>0))continue;
      if(!bEternal()&&e.bHexT<gameTime){e.bHex=0;continue;}if(e.bHex>bHexCap())e.bHex=bHexCap();bHit(e,per*e.bHex,'baHex');}}
    /* obelisk */
    const O=BA.obelisk;if(O){if(O.until<gameTime)BA.obelisk=null;else if(tick&&Math.hypot(player.x-O.x,player.y-O.y)<BB.bnObelisk.R)player.mp=Math.min(player.maxMp,player.mp+bLv(BB.bnObelisk.sp,'bnObelisk'));}
    if(hasBuff('bcBless'))player.hp=Math.min(player.maxHp,player.hp+PS.lv*BB.bcBless.hp*dt);
    /* locust swarms */
    BA.locusts=BA.locusts.filter(L=>{if(L.until<gameTime)return false;
      if(bL('baSwarm')){const q=bNear(L.x,L.y,320).sort((a,b)=>(b.bHex||0)-(a.bHex||0))[0];if(q){const d=Math.hypot(q.x-L.x,q.y-L.y);if(d>10){L.x+=(q.x-L.x)/d*BB.baSwarm.spd*dt;L.y+=(q.y-L.y)/d*BB.baSwarm.spd*dt;}}}
      if(half)for(const e of bNear(L.x,L.y,BB.baLocust.R))bHit(e,L.dmg,'baLocust');
      if((L.tk+=dt)>=1){L.tk=0;for(const e of bNear(L.x,L.y,BB.baLocust.R))bAddHex(e,1);}return true;});
    if(BA.link&&BA.link.until<gameTime)BA.link=null;
    /* army end → Ammit */
    if(BA.armyEnd&&gameTime>=BA.armyEnd){BA.armyEnd=0;if(BA.armyAmmit){const c=BA.armyAt;addFx(new BaPillar({x:c.x,y:c.y,w:90,col:'#3aa860',life:.6}));for(const e of bNear(c.x,c.y,BB.bbAmmit.R))bHit(e,BB.bbAmmit.dmg,'bbAmmit',{big:true});bBurst(c.x,c.y,BB.bbAmmit.R,'#3aa860');shake(3.6);bSoul(BB.bbAmmit.souls);}}
    if(BA.shieldUntil<gameTime)BA.shield=0;
    return CHAR==='bastet';}}   /* 2026-11-21: the ticker returned nothing, so the engine dropped it after ONE frame — hex damage, locust swarms, obelisk SP, blessing heal, the army's end and the shield's expiry only ran on the frame of a cast, and every cast left one more BaGround + BaTop behind (the game got slower the longer she was played) */

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
/* keep the core ticking even if something clears fx (the bench does) */
let BA_CORE=null;function bEnsure(){if(CHAR!=='bastet')return;if(!BA_CORE||!fx.includes(BA_CORE))BA_CORE=addFx(new BaCore());for(const m of BA.minions.slice())if(!fx.includes(m))m.kill();}
function bCast(o){bEnsure();return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2.2,glow:o.glow||BAC.hex,events:tP=>[{t:tP,f:a=>o.f(a)}]});}
function bStaff(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),s=seq('attack',d,Math.max(0,ct-3),null,(o.speed||1.3)*aspd());
  return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,seqIndex(s,'attack',ct,0)),dur:seqTimeAt(s,seqIndex(s,'attack',ct,0)+2),hitList:[],update:()=>{player.glow={color:o.glow||BAC.soul,k:.6};},
    events:[{t:seqTimeAt(s,seqIndex(s,'attack',ct,0)),f:a=>o.f(a)}]});}

/* ---------- normal attack ---------- */
function mkBaBasic(tgt){bEnsure();const lv=Math.max(1,bL('bnTome')),chain=BB.bnTome.chain[lv-1]+(bL('bcPages')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),big=bL('bcPages')&&last;
  return bStaff({key:'basic',name:big?'Nine Pages':'Ankh Tome '+(idx+1),phi,speed:last?1.15:2,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(big){for(const e of bNear(player.x,player.y,BB.bcPages.R))bHit(e,BB.bcPages.dmg,'bcPages',{auto:true});bBurst(player.x,player.y,BB.bcPages.R,'#fff4dc');a.hitConfirmed=true;shake(1.6);return;}
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+60+tgt.r)return;
    addFx(new BaHome({x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,phi,tg:tgt,speed:560,r:5,col:BAC.soul,hit:e=>{bHit(e,BB.bnTome.hit,'basic',{auto:true});
      if(bL('bnOmen')){BA.bellN++;if(BA.bellN>=BB.bnOmen.every){BA.bellN=0;addFx(new BaBeam({x:player.x,y:player.y,phi:angTo(e),L:dist(player,e),col:BAC.dark,w:7,life:.22,z0:10,z1:20}));bHit(e,bLv(BB.bnOmen.dmg,'bnOmen'),'bnOmen');}}}}));a.hitConfirmed=true;}});}

/* ---------- BASIC ---------- */
function mkBnGrace(c){const near=nearestEnemy(player.x,player.y,260),phi=near?Math.atan2(player.y-near.y,player.x-near.x):player.phi+Math.PI;
  return bCast({key:'bnGrace',name:"Cat's Grace",speed:3,glow:BAC.white,f:()=>{const sx=player.x,sy=player.y;
    if(bL('bcShadow')&&typeof Decoy==='function'){if(decoy)decoy.dead=true;decoy=addFx(new Decoy({life:BB.bcShadow.T}));setFxTimer(BB.bcShadow.T,()=>{for(const e of bNear(sx,sy,BB.bcShadow.R))bHit(e,BB.bcShadow.dmg,'bcShadow');bBurst(sx,sy,BB.bcShadow.R,BAC.dark);});}
    const [x,y]=bPathEnd(sx,sy,phi,bLv(BB.bnGrace.dist,'bnGrace'));player.x=x;player.y=y;addBuff('bnGrace',BB.bnGrace.T);dustPuff(sx,sy,6,'#e8d3a0',60,7);if(near)faceTo(angTo(near));}});}
function mkBnVeil(c){return bCast({key:'bnVeil',name:'Sand Veil',glow:BAC.sand,f:()=>{BA.shield=Math.round(PS.lv*bLv(BB.bnVeil.shield,'bnVeil'));BA.shieldUntil=gameTime+BB.bnVeil.T;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:50,w:5,color:BAC.sand,life:.4}));}});}
function mkBnAnkh(c){return bCast({key:'bnAnkh',name:'Ankh of Life',glow:'#9aff9a',f:()=>{const h=Math.round(PS.lv*bLv(BB.bnAnkh.hp,'bnAnkh'));player.hp=Math.min(player.maxHp,player.hp+h);player.mp=Math.min(player.maxMp,player.mp+bLv(BB.bnAnkh.sp,'bnAnkh'));dmgNum(player.x,player.y,80,'+'+h,'heal');}});}
function mkBnObelisk(c){return bCast({key:'bnObelisk',name:'Temple Obelisk',glow:BAC.gold,f:()=>{BA.obelisk={x:player.x+Math.cos(player.phi)*20,y:player.y+Math.sin(player.phi)*20,until:gameTime+BB.bnObelisk.T};addFx(new GRing({x:player.x,y:player.y,r0:10,r1:BB.bnObelisk.R,w:8,color:BAC.gold,life:.45}));}});}

/* ---------- A · Hexweaver ---------- */
function mkBaGlyph(c){const t=bTgt(c,BB.baGlyph.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=bLv(BB.baGlyph.dmg,'baGlyph');
  const T=bL('bcTriple')?[t,...bNear(t.x,t.y,260).filter(e=>e!==t).sort((a,b)=>dist(a,t)-dist(b,t))].slice(0,BB.bcTriple.n):[t];while(bL('bcTriple')&&T.length<BB.bcTriple.n)T.push(t);
  return bCast({key:'baGlyph',name:'Curse Glyph',phi,f:a=>{T.forEach((q,i)=>addFx(new BaHome({x:player.x,y:player.y,phi:phi+(i-(T.length-1)/2)*.5,tg:q,col:BAC.hex,hit:e=>{bHit(e,m,'baGlyph');bAddHex(e,1);}})));a.hitConfirmed=true;}});}
function mkBaLocust(c){const [x,y]=bPt(c,BB.baLocust.range);return bCast({key:'baLocust',name:'Plague of Locusts',phi:Math.atan2(y-player.y,x-player.x),f:()=>{
  BA.locusts.push({x,y,tk:.5,dmg:bLv(BB.baLocust.dmg,'baLocust'),until:gameTime+BB.baLocust.T+(bL('baSwarm')?bLv(BB.baSwarm.T,'baSwarm'):0)});bBurst(x,y,BB.baLocust.R,'#8a7a3a');}});}
function mkBaLink(c){const t=bTgt(c,BB.baLink.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return bCast({key:'baLink',name:'Curse Link',phi:angTo(t),f:()=>{const set=[t,...bNear(t.x,t.y,BB.baLink.R).filter(e=>e!==t).sort((a,b)=>dist(a,t)-dist(b,t))].slice(0,BB.baLink.n);
    BA.link={set,until:gameTime+BB.baLink.T};for(const e of set){bHit(e,bLv(BB.baLink.dmg,'baLink'),'baLink');bPow(e,false);}}});}
function mkBaApep(c){const t=bTgt(c,BB.baApep.range),phi=bPhi(c,t);return bCast({key:'baApep',name:'Mark of Apep',phi,f:()=>{
  addFx(new BaShot({x:player.x,y:player.y,phi,len:BB.baApep.len,w:BB.baApep.w,hit:e=>{bHit(e,bLv(BB.baApep.dmg,'baApep'),'baApep',{big:true});bAddHex(e,2);
      if(bL('baVenom')){applyCC(e,{slow:BB.baVenom.slow});e.bHexT=(e.bHexT||gameTime)+BB.baVenom.T;}},
    end:(x,y)=>{if(!bL('bcApep'))return;addFx(new BaPillar({x,y,w:50,col:BAC.hex2,life:.45}));for(const e of bNear(x,y,BB.bcApep.R)){bHit(e,BB.bcApep.dmg,'bcApep',{big:true});bAddHex(e,1);}bBurst(x,y,BB.bcApep.R,BAC.hex2);shake(2);}}));}});}
function mkBaDoom(c){return bCast({key:'baDoom',name:'Word of Doom',speed:1.6,f:()=>{const L=bNear(player.x,player.y,BB.baDoom.R).filter(e=>e.bHex>0);let tot=0;
  for(const e of L){const n=e.bHex;tot+=n;e.bHex=bL('baLinger')?Math.min(n,bLv(BB.baLinger.left,'baLinger')):0;addFx(new BaPillar({x:e.x,y:e.y,w:24+n*4,col:BAC.hex,life:.4}));bHit(e,bLv(BB.baDoom.dmg,'baDoom')+BB.baDoom.per*n,'baDoom',{big:true});}
  bBurst(player.x,player.y,90,BAC.hex);shake(2.6);stop(60);if(tot)addFx(new DText({x:player.x,y:player.y,z:100,text:'DOOM ×'+tot,color:BAC.hex,size:13,life:.8}));}});}
function mkBaWrap(c){const t=bTgt(c,BB.baWrap.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}return bCast({key:'baWrap',name:"Mummy's Wrap",phi:angTo(t),glow:BAC.sand,f:()=>{
  addFx(new BaBeam({x:player.x,y:player.y,phi:angTo(t),L:dist(player,t),col:BAC.sand,w:6,life:.3}));bHit(t,BB.baWrap.dmg,'baWrap');bAddHex(t,1);
  if(t.boss)applyCC(t,{slow:BB.baWrap.root*1.5});else{t.st.root=Math.max(t.st.root||0,BB.baWrap.root);t.vx=t.vy=0;}}});}
function mkBaPharaoh(c){return bCast({key:'baPharaoh',name:'Curse of the Pharaoh',speed:1.4,f:()=>{skyDarkT=.7;addFx(new DText({x:player.x,y:player.y,z:116,text:'CURSE OF THE PHARAOH',color:BAC.hex,size:15,life:1.1}));
  setFxTimer(.35,()=>{for(const e of bNear(player.x,player.y,BB.baPharaoh.R)){e.bHex=Math.max(e.bHex||0,BA_BAL.hex.cap);e.bHexT=gameTime+BA_BAL.hex.T;addFx(new BaPillar({x:e.x,y:e.y,w:20,col:BAC.hex}));bHit(e,bLv(BB.baPharaoh.dmg,'baPharaoh'),'baPharaoh',{big:true});}
    bBurst(player.x,player.y,BB.baPharaoh.R,BAC.hex);shake(3.6);stop(80);if(bL('baEternal'))addBuff('baEternal',BB.baEternal.T);});
  setFxTimer(1.2,()=>{skyDarkT=0;});}});}

/* ---------- B · Tomb Warden ---------- */
function mkBbSiphon(c){const t=bTgt(c,BB.bbSiphon.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const m=bLv(BB.bbSiphon.dmg,'bbSiphon');
  const T=bL('bcTether')?[t,...bNear(t.x,t.y,240).filter(e=>e!==t).sort((a,b)=>dist(a,t)-dist(b,t))].slice(0,BB.bcTether.n):[t];
  return bCast({key:'bbSiphon',name:'Soul Siphon',phi:angTo(t),glow:BAC.soul,f:a=>{a.hitConfirmed=true;for(let i=0;i<BB.bbSiphon.n;i++)setFxTimer(.001+i*.3,()=>{for(const q of T){if(q.dead||dist(player,q)>BB.bbSiphon.range+80)continue;
    addFx(new BaBeam({x:q.x,y:q.y,phi:bAng(q,player),L:dist(q,player),col:BAC.soul,w:5,life:.3}));bHit(q,m,'bbSiphon');player.hp=Math.min(player.maxHp,player.hp+PS.lv*BB.bbSiphon.hp);}});}});}
function mkBbMummy(c){return bCast({key:'bbMummy',name:'Raise Mummy',glow:BAC.sand,f:()=>{const M=bMinions('mummy');while(M.length>=BB.bbMummy.cap)M.shift().kill();
  const t=bTgt(c,300),x=t?lerp(player.x,t.x,.6):player.x+Math.cos(player.phi)*60,y=t?lerp(player.y,t.y,.6):player.y+Math.sin(player.phi)*60;
  addFx(new BaMinion({kind:'mummy',x,y,life:BB.bbMummy.T,iv:BB.bbMummy.iv,dmg:bLv(BB.bbMummy.dmg,'bbMummy'),key:'bbMummy',taunt:BB.bbMummy.taunt,slot:M.length}));dustPuff(x,y,8,'#e8d3a0',70,9);}});}
function mkBbScarab(c){return bCast({key:'bbScarab',name:'Scarab Swarm',glow:BAC.gold,f:()=>{const m=bLv(BB.bbScarab.dmg,'bbScarab');
  for(let i=0;i<BB.bbScarab.n;i++)addFx(new BaMinion({kind:'scarab',x:player.x+rnd(-20,20),y:player.y+rnd(-20,20),life:BB.bbScarab.T,iv:BB.bbScarab.iv,cd:rnd(0,.4),spd:320,reach:10,dmg:m,key:'bbScarab',slot:i,
    onEnd:s=>{if(!bL('bbGolden'))return;const q=nearestEnemy(s.x,s.y,220);if(q){addFx(new BaBeam({x:s.x,y:s.y,phi:bAng(s,q),L:dist(s,q),col:BAC.gold,w:4,life:.2}));bHit(q,bLv(BB.bbGolden.dmg,'bbGolden'),'bbGolden');bPow(q,false,BAC.gold);}}}));}});}
function mkBbAnubis(c){return bCast({key:'bbAnubis',name:'Anubis Shade',glow:BAC.dark,f:()=>{const n=bL('bcPack')?BB.bcPack.n:1;
  for(let i=0;i<n;i++)addFx(new BaMinion({kind:'anubis',x:player.x+rnd(-30,30),y:player.y+rnd(-30,30),life:BB.bbAnubis.T,iv:BB.bbAnubis.iv,cd:.2+i*.4,dmg:bLv(BB.bbAnubis.dmg,'bbAnubis'),key:'bbAnubis',slot:i}));}});}
function mkBbHarvest(c){return bCast({key:'bbHarvest',name:'Soul Harvest',speed:1.6,glow:BAC.soul,f:()=>{const n=BA.souls;BA.souls=0;const m=bLv(BB.bbHarvest.dmg,'bbHarvest')+BB.bbHarvest.per*n;
  const L=bNear(player.x,player.y,BB.bbHarvest.R);L.forEach((e,i)=>addFx(new BaHome({x:player.x,y:player.y,phi:i*TAU/Math.max(1,L.length),tg:e,col:BAC.soul,speed:520,hit:q=>bHit(q,m,'bbHarvest',{big:true})})));
  bBurst(player.x,player.y,60,BAC.soul);if(n)addFx(new DText({x:player.x,y:player.y,z:100,text:'SOULS ×'+n,color:BAC.soul,size:13,life:.8}));if(bL('bbReturn'))setFxTimer(.1,()=>bSoul(bLv(BB.bbReturn.back,'bbReturn')));}});}
function mkBbGate(c){return bCast({key:'bbGate',name:'Duat Gate',speed:2.6,glow:BAC.soul,f:()=>{const M=bMinions();for(const m of M)m.life+=BB.bbGate.plus;
  const far=M.slice().sort((a,b)=>dist(b,player)-dist(a,player))[0];if(far){const px=player.x,py=player.y;bBurst(px,py,40,BAC.soul);player.x=far.x;player.y=far.y;far.x=px;far.y=py;bBurst(player.x,player.y,40,BAC.soul);}}});}
function mkBbArmy(c){return bCast({key:'bbArmy',name:'Army of the Duat',speed:1.4,glow:BAC.gold,f:()=>{const t=bTgt(c,300),cx=t?t.x:player.x+Math.cos(player.phi)*100,cy=t?t.y:player.y+Math.sin(player.phi)*100;
  BA.armyAt={x:cx,y:cy};BA.armyEnd=gameTime+BB.bbArmy.T;BA.armyAmmit=bL('bbAmmit')>0;addFx(new GRing({x:cx,y:cy,r0:10,r1:130,w:12,color:BAC.gold,life:.6}));shake(2.4);
  addFx(new DText({x:player.x,y:player.y,z:110,text:'ARMY OF THE DUAT',color:BAC.gold,size:15,life:1.1}));
  for(let i=0;i<BB.bbArmy.n;i++){const an=i*TAU/BB.bbArmy.n;addFx(new BaMinion({kind:'army',x:cx+Math.cos(an)*70,y:cy+Math.sin(an)*50,life:BB.bbArmy.T,iv:BB.bbArmy.iv,cd:.3+i*.1,dmg:bLv(BB.bbArmy.dmg,'bbArmy'),key:'bbArmy',slot:i}));}}});}

/* ---------- C ---------- */
function mkBcStorm(c){const t=bTgt(c,BB.bcStorm.range),phi=bPhi(c,t);return bCast({key:'bcStorm',name:'Locust Storm',phi,f:()=>{addFx(new BaShot({x:player.x,y:player.y,phi,len:BB.bcStorm.len,speed:440,w:34,z:30,kind:'storm',hit:e=>{bHit(e,BB.bcStorm.dmg,'bcStorm',{big:true});bAddHex(e,2);bPow(e,true,BAC.sand);}}));}});}
function mkBcLord(c){return bCast({key:'bcLord',name:'Mummy Lord',speed:1.6,glow:BAC.gold,f:()=>{for(const m of bMinions('lord'))m.kill();const t=bTgt(c,300),x=t?lerp(player.x,t.x,.6):player.x,y=t?lerp(player.y,t.y,.6):player.y;
  addFx(new BaMinion({kind:'lord',x,y,life:BB.bcLord.T,iv:BB.bcLord.iv,reach:40,spd:110,dmg:BB.bcLord.dmg,key:'bcLord',taunt:BB.bcLord.taunt}));bBurst(x,y,90,BAC.gold);shake(2);}});}
function mkBcBless(c){return bCast({key:'bcBless',name:"Bastet's Blessing",glow:BAC.gold,f:()=>{addBuff('bcBless',BB.bcBless.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:6,color:BAC.gold,life:.45}));}});}
function mkBcAvatar(c){return bCast({key:'bcAvatar',name:'Avatar of Bastet',speed:1.4,glow:BAC.gold,f:()=>{addBuff('bcAvatar',BB.bcAvatar.T);bBurst(player.x,player.y,130,BAC.gold);addFx(new DText({x:player.x,y:player.y,z:116,text:'AVATAR OF BASTET',color:BAC.gold,size:15,life:1.1}));shake(3);}});}
function mkBcSekhmet(c){const [x,y]=bPt(c,BB.bcSekhmet.range);return bCast({key:'bcSekhmet',name:"Sekhmet's Plague Sun",speed:1.4,phi:Math.atan2(y-player.y,x-player.x),glow:BAC.red,f:()=>{skyDarkT=.5;
  setFxTimer(.35,()=>{addFx(new BaPillar({x,y,w:110,col:BAC.red,life:.6}));for(const e of bNear(x,y,BB.bcSekhmet.R)){const n=e.bHex||0;e.bHex=0;bHit(e,BB.bcSekhmet.dmg+BB.bcSekhmet.per*n,'bcSekhmet',{big:true});}bBurst(x,y,BB.bcSekhmet.R,BAC.red);shake(4);stop(80);skyDarkT=0;});}});}
function mkBcOsiris(c){const M=bMinions();if(!M.length){msg('ไม่มีผู้รับใช้');return null;}return bCast({key:'bcOsiris',name:'Judgment of Osiris',speed:1.4,glow:BAC.gold,f:()=>{
  for(const m of bMinions()){addFx(new BaPillar({x:m.x,y:m.y,w:40,col:BAC.gold,life:.45}));for(const e of bNear(m.x,m.y,BB.bcOsiris.R))bHit(e,BB.bcOsiris.dmg,'bcOsiris',{big:true});bBurst(m.x,m.y,BB.bcOsiris.R,BAC.gold);}
  bSoul(BB.bcOsiris.souls);shake(3);stop(60);}});}

const BA_MAKE={bnGrace:mkBnGrace,bnVeil:mkBnVeil,bnAnkh:mkBnAnkh,bnObelisk:mkBnObelisk,
  baGlyph:mkBaGlyph,baLocust:mkBaLocust,baLink:mkBaLink,baApep:mkBaApep,baDoom:mkBaDoom,baWrap:mkBaWrap,baPharaoh:mkBaPharaoh,
  bbSiphon:mkBbSiphon,bbMummy:mkBbMummy,bbScarab:mkBbScarab,bbAnubis:mkBbAnubis,bbHarvest:mkBbHarvest,bbGate:mkBbGate,bbArmy:mkBbArmy,
  bcStorm:mkBcStorm,bcLord:mkBcLord,bcBless:mkBcBless,bcAvatar:mkBcAvatar,bcSekhmet:mkBcSekhmet,bcOsiris:mkBcOsiris};
const BA_ZIGZAG=[['baGlyph','baLocust'],['bbSiphon','bbMummy']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function bastetAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['bcBless','bnAnkh','bnVeil'])if(ready(k)&&!hasBuff(k))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=bNear(player.x,player.y,240);
  const lvA=['baGlyph','baLocust','baApep','baDoom','baPharaoh'].reduce((s,k)=>s+bL(k),0),lvB=['bbSiphon','bbMummy','bbScarab','bbAnubis','bbArmy'].reduce((s,k)=>s+bL(k),0),useB=window.__BA_BR==='B'||(window.__BA_BR!=='A'&&lvB>lvA);
  if(d<70&&near.length>=2){for(const k of useB?['bnGrace','bbGate','bnVeil']:['bnGrace','baWrap','bnVeil'])if(ready(k))return cast(k);}
  if(ready('bcAvatar')&&!bAvatar()&&d<300)return cast('bcAvatar');if(ready('bnObelisk')&&!BA.obelisk&&d<320)return cast('bnObelisk');
  if((t.boss||near.length>=3)&&ready(useB?'bbArmy':'baPharaoh'))return cast(useB?'bbArmy':'baPharaoh');
  if(useB){if(ready('bbMummy')&&bMinions('mummy').length<BB.bbMummy.cap)return cast('bbMummy');
    for(const k of ['bcLord','bbAnubis','bbScarab'])if(ready(k))return cast(k);
    if(ready('bcOsiris')&&bMinions().length>=4)return cast('bcOsiris');if(ready('bbHarvest')&&BA.souls>=5&&d<BB.bbHarvest.R)return cast('bbHarvest');
    if(ready('bbSiphon')&&d<=BB.bbSiphon.range+t.r)return cast('bbSiphon');return false;}
  const hexSum=bNear(player.x,player.y,BB.baDoom.R).reduce((s,e)=>s+(e.bHex||0),0);
  if(ready('bcSekhmet')&&(t.bHex||0)>=4)return cast('bcSekhmet');if(ready('baDoom')&&(hexSum>=8||(t.bHex||0)>=4))return cast('baDoom');
  if(ready('baLink')&&!BA.link&&bNear(t.x,t.y,BB.baLink.R).length>=2)return cast('baLink');
  for(const k of ['bcStorm','baApep','baLocust','baGlyph'])if(ready(k)&&d<=(SKILLS[k].range||300)+t.r)return cast(k);
  return false;}

function installBastet(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  for(const d of BA_DEFS){const b=BB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:bIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'bastet_curse_priestess'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(BA_MAKE[d.key])sk.make=BA_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${BA_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of BA_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* pure magic: every skill is TAL */
  const m={};for(const d of BA_DEFS)m[d.key]='m';Object.assign(SK_DT,m,{basic:'m',baHex:'m'});
  Object.assign(SK_CC,{baApep:{flinch:.3},baDoom:{flinch:.4},baPharaoh:{flinch:.4},bcStorm:{flinch:.4},bcApep:{air:1},bcSekhmet:{air:1},
    bbWeigh:{flinch:.4},bbAmmit:{air:1},bcOsiris:{flinch:.4},bcPages:{flinch:.3},bcShadow:{flinch:.3}});
  Object.assign(SK_KO,{basic:.8,baGlyph:.8,baLocust:.4,baLink:.8,baApep:1.8,baDoom:2.4,baPharaoh:1.6,baWrap:1,bcStorm:2,bcApep:2.2,bcSekhmet:4,
    bbSiphon:.5,bbMummy:.6,bbScarab:.3,bbAnubis:.8,bbWeigh:2.2,bbHarvest:1.4,bbArmy:.6,bbAmmit:3,bcLord:1.2,bcOsiris:1.6,bcPages:1.6,bnOmen:.8});
  TABS.length=0;TABS.push({n:'Curse',keys:['baGlyph','baLocust','baLink','baApep','baDoom','baWrap','baPharaoh','bnGrace','bnVeil','bnObelisk']},
    {n:'Tomb',keys:['bbSiphon','bbMummy','bbScarab','bbAnubis','bbHarvest','bbGate','bbArmy','bnGrace','bnVeil','bnObelisk']},
    {n:'Bastet',keys:['bcStorm','bcLord','bcBless','bcAvatar','bcSekhmet','bcOsiris','bnAnkh']});
  Object.assign(BUFFDEF,{bnGrace:{n:"Cat's Grace",c:BAC.white,i:'CAT'},baEternal:{n:'Eternal Curse',c:BAC.hex,i:'HEX'},bcBless:{n:"Bastet's Blessing",c:BAC.gold,i:'BLESS'},bcAvatar:{n:'Avatar of Bastet',c:BAC.gold,i:'BAST'}});
  JOB.name='Temple Kitten';JOB.hpA=1.15;JOB.hpB=4.2;JOB.spB=4.2;
  ITEMS.ankhTome={n:'Ankh Tome',slot:'rhand',two:1,kind:'Staff',atk:60,matk:180,wlv:3,aspd:156,ref:6,cards:2,w:60,b:{tal:2},size:{small:1,medium:1,large:1},d:'คัมภีร์อังค์ TAL +2'};
  ITEMS.bookOfDead={n:'Book of the Dead',slot:'rhand',two:1,kind:'Staff',atk:60,matk:200,wlv:4,aspd:154,ref:4,cards:1,w:70,b:{int:3},size:{small:1,medium:1,large:1},d:'คัมภีร์แห่งความตาย INT +3'};
  EQ.rhand='ankhTome';INV.length=0;INV.push('bookOfDead','vikinghelm','ringPrec','clipLuck');
  BA.souls=bL('bbJars')?bLv(BB.bbJars.start,'bbJars'):0;
  /* flat TAL bonuses */
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null)),col=bCol(k);let b=0;
    if(BA.obelisk&&Math.hypot(player.x-BA.obelisk.x,player.y-BA.obelisk.y)<BB.bnObelisk.R)b+=bLv(BB.bnObelisk.tal,'bnObelisk');
    if(hasBuff('bcBless'))b+=BB.bcBless.tal;
    if(col==='A'&&bL('baGrimoire')){const n=Math.min(BB.baGrimoire.n,bNear(player.x,player.y,BB.baGrimoire.R).filter(q=>q.bHex>0).length);b+=n*bLv(BB.baGrimoire.tal,'baGrimoire');}
    if(MINION_KEYS.has(k))b+=bSoulTal();
    if(bAvatar()&&o&&o.auto)b+=BB.bcAvatar.tal;
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,D.mag);return (base+flat(e,o))/base;};
  /* taunted enemies strike the servant instead of Bastet */
  window.jgPreHit=e=>{if(e&&e.bTaunt>gameTime&&e.bTauntBy&&!e.bTauntBy.dead){const m=e.bTauntBy;m.flash=1;dustPuff(m.x,m.y,4,'#e8d3a0',40,6);return 0;}return 1;};
  window.jgAbsorb=(d,e)=>{if(bL('bnSistrum'))d-=bLv(BB.bnSistrum.block,'bnSistrum');
    if(hasBuff('bnGrace'))d-=bLv(BB.bnGrace.block,'bnGrace');
    if(bL('bbGuardian'))d-=Math.min(BB.bbGuardian.cap,bMinions().length)*bLv(BB.bbGuardian.block,'bbGuardian');
    d=Math.max(1,d);
    if(BA.shield>0&&BA.shieldUntil>gameTime){const a=Math.min(BA.shield,d);BA.shield-=a;d-=a;if(d<=0)return 0;}
    return d;};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.bastetAutoTick=bastetAutoTick;
  mkBasic=mkBaBasic;bEnsure();
  try{document.title='Aetherfall — Bastet Curse Priestess';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Bastet Priestess';if(cl)cl.textContent='Temple Kitten';}catch(e){}
  window.BA=BA;window.BA_DEFS=BA_DEFS;window.BA_BAL=BA_BAL;}

/* =====================================================================
   7. ICONS (painted if present in assets/icons/bastet, code SVG fallback)
   ===================================================================== */
function bIconSpec(d){const isA=d.br==='A'||d.col==='A',isB=d.br==='B'||d.col==='B';const col=isA?'#d8b0ff':isB?'#b8f0ff':'#ffe9a8',bg=isA?'#24123a':isB?'#10243a':'#2a2214';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const eye=`<path d="M6 22 Q22 8 38 22 Q22 34 6 22Z" fill="none" stroke="${col}" stroke-width="2.5"/><circle cx="22" cy="22" r="5" fill="${col}"/><path d="M18 27 L14 37 M24 27 Q30 34 26 38" stroke="${col}" stroke-width="2" fill="none"/>`;
  const jar=`<path d="M15 14 H29 L31 20 Q33 36 22 38 Q11 36 13 20Z" fill="${col}" stroke="#2a4a6a" stroke-width="1.2"/><path d="M14 10 H30 V14 H14Z" fill="#ffd36a"/>`;
  const ankh=`<circle cx="22" cy="13" r="6" fill="none" stroke="#ffd36a" stroke-width="3.5"/><path d="M22 19 V38 M12 22 H32" stroke="#ffd36a" stroke-width="3.5"/>`;
  const g=isA?eye:isB?jar:ankh;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/bastet/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
