/* =====================================================================
   TOTEM LEGEND — NINE-TAILED KITSUNE MIKO (Japan) — 12 Tails style
   Character module. Loaded only when the kitsune is played; index.html calls installKitsune().
   Design: KITSUNE_SKILLS_TH.md

     Basic  · Shrine Apprentice     — staff + bell, Fox Step (decoy), Ofuda Ward (shield), Inari's Blessing, Nine-Tail Fluff, Torii Gate
     A Tree · Kitsune-bi (foxfire)  — wide fire bursts, lantern traps. TAILS 0–9 lit by A hits; big spells spend them
     B Tree · Moon Mirror Priestess — moonlight beams in lines, crescents, Yata mirror splits beams, lunar circle pulls,
                                      starfall. Hit enemies are slowed; slowed enemies take more (no counter system)
     C Tree · Heir of Inari         — 12 nodes, each tied to the Basic / A / B skill of the same row (Lv 55 / 60 / 70 / 80)

   Pure magic hero: every skill uses TAL.
   Owner's rules: no percent effects (flat numbers, counters instead of chances). Attack speed fixed (CHAR_ASPD).
   Sprite: the wolf's sprite stands in until the kitsune's own clips are made.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const KI_BAL={
  tails:{cap:9},
  sk:{
    // ---- Basic
    knStaff:{chain:[2,3,4,4],hit:1.0},
    knBell:{every:4,dmg:[.6,.8,1.0],R:80},
    knStep:{dist:[150,180,210],cd:10,mp:8},
    knWard:{shield:[4,6,8],T:6,cd:18,mp:12},
    knBless:{hp:[5,8],sp:[15,25],cd:25,mp:0},
    knFluff:{block:[3,6,9,12]},
    knTorii:{R:110,T:8,sp:[3,4,5],tal:[20,30,40],cd:30,mp:16},
    // ---- A · Kitsune-bi
    kaOrb:{n:3,dmg:[.7,.8,.9,1.0],cd:5,mp:10,range:320},
    kaWisp:{dmg:[.4,.5,.6],R:90},
    kaPillar:{dmg:[2.2,2.8],R:80,cd:8,mp:14,range:300},
    kaTwin:{dmg:[1.0,1.4]},
    kaLantern:{n:4,dmg:[1.0,1.3],R:60,back:110,T:10,cd:12,mp:14},
    kaFestival:{n:3,dmg:[.4,.6]},
    kaRain:{n:10,dmg:[.5,.6],R:130,cd:12,mp:18,range:300},
    kaPetals:{dmg:.3,T:3},
    kaBurst:{dmg:[2.4,3.0],per:.5,R:150,cd:12,mp:18},
    kaAfterglow:{back:[2,3]},
    kaWisdom:{tal:[4,6,8]},
    kaVeil:{T:4,dmg:.6,R:80,cd:16,mp:12},
    kaInferno:{n:9,dmg:[1.6,2.2],R:300,cd:60,mp:50},
    kaCelestial:{T:8},
    // ---- B · Moon Mirror Priestess
    kbBeam:{dmg:[1.2,1.4,1.6,1.8],len:320,w:22,cd:5,mp:10,range:320},
    kbCalm:{slow:[1,1.5,2]},
    kbCrescent:{dmg:[1.6,2.0],len:240,cd:8,mp:14,range:240},
    kbHalf:{dmg:[1.0,1.4]},
    kbMirror:{T:8,split:[.8,1.0],cd:14,mp:14,range:260},
    kbShards:{dmg:[1.2,1.6],R:100},
    kbCircle:{R:130,T:4,dmg:[.6,.8],cd:14,mp:18,range:300},
    kbEclipse:{dmg:1.5,stun:1},
    kbStar:{n:6,dmg:[.9,1.1],cd:10,mp:16,range:340},
    kbShooting:{dmg:.5},
    kbGrace:{tal:[15,25,35]},
    kbMoonlight:{T:2,cd:18,mp:12},
    kbNight:{T:6,R:260,dmg:[1.2,1.6],cd:60,mp:50},
    kbMoonrise:{dmg:3.0,R:160},
    // ---- C
    kcChime:{dmg:1.6,R:120},
    kcSwarm:{n:5},
    kcPrism:{n:3,spread:.3},
    kcPhantom:{dmg:1.4,R:90},
    kcWheel:{dmg:2.6,len:300,cd:16,mp:20,range:300},
    kcDisc:{dmg:3.0,len:360,slow:2,cd:18,mp:22,range:360},
    kcGrace:{T:10,hp:1,tal:30,cd:40,mp:20},
    kcMeteor:{dmg:2.4},
    kcShower:{n:10},
    kcAwaken:{T:15,tal:60,cd:90,mp:40},
    kcTamamo:{dmg:5.0,per:.5,R:160,cd:50,mp:40,range:320},
    kcTsukuyomi:{dmg:5.0,len:420,w:60,cd:50,mp:40,range:420}
  }
};
const KB=KI_BAL.sk;
/* branch tuning from the bench: damage numbers of each branch are scaled here so the shown TAL×n stays true */
const KI_SCALE={A:1.84,B:1.07};
(()=>{const r2=v=>Math.round(v*100)/100,sc=(o,f,m)=>{if(o[f]==null)return;o[f]=Array.isArray(o[f])?o[f].map(v=>r2(v*m)):r2(o[f]*m);};
  const colOf=k=>k.startsWith('ka')||['kcSwarm','kcWheel','kcMeteor','kcTamamo'].includes(k)?'A':k.startsWith('kb')||['kcPrism','kcDisc','kcShower','kcTsukuyomi'].includes(k)?'B':null;
  for(const k in KB){const c=colOf(k);if(!c)continue;for(const f of ['dmg','per','split'])sc(KB[k],f,KI_SCALE[c]);}})();
const kT=n=>'TAL×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const KI_DEFS=[
 // ---------------- BASIC · SHRINE APPRENTICE ----------------
 {key:'knStaff',id:'KN-B01',name:'Shrine Staff',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) ฟาดไม้เท้าศาลเจ้า ลูกไฟเล็กพุ่งใส่เป้า',lv:i=>[`ต่อ ${KB.knStaff.chain[i-1]} จังหวะ`]},
 {key:'knBell',id:'KN-B02',name:'Bell Chime',br:'basic',row:1,max:3,passive:1,d:'(Passive) ทุกจังหวะที่ 4 ของตีปกติ กระดิ่งดังเป็นวงรอบเป้า',lv:i=>[`${kT(KB.knBell.dmg[i-1])} รัศมี ${KB.knBell.R}`]},
 {key:'knStep',id:'KN-B03',name:'Fox Step',br:'basic',row:2,max:3,type:'self',d:'วาร์ปถอย ทิ้งเงาจิ้งจอกรับการโจมตีครั้งแรกแทน',lv:i=>[`วาร์ป ${KB.knStep.dist[i-1]}`,`Cooldown ${KB.knStep.cd} วิ`]},
 {key:'knWard',id:'KN-B04',name:'Ofuda Ward',br:'basic',row:2,max:3,type:'self',d:'ยันต์กันภัย ได้โล่',lv:i=>[`โล่ = เลเวล × ${KB.knWard.shield[i-1]} นาน ${KB.knWard.T} วิ`,`Cooldown ${KB.knWard.cd} วิ`]},
 {key:'knBless',id:'KN-B05',name:"Inari's Blessing",br:'basic',row:3,max:2,type:'self',d:'พรอินาริ ฟื้น HP และ SP',lv:i=>[`ฟื้น HP = เลเวล × ${KB.knBless.hp[i-1]}`,`SP +${KB.knBless.sp[i-1]}`,`Cooldown ${KB.knBless.cd} วิ`]},
 {key:'knFluff',id:'KN-B06',name:'Nine-Tail Fluff',br:'basic',row:3,max:4,passive:1,d:'(Passive) หางฟูกันกระแทก',lv:i=>[`ดาเมจที่ได้รับ −${KB.knFluff.block[i-1]} ต่อครั้ง`]},
 {key:'knTorii',id:'KN-B07',name:'Torii Gate',br:'basic',row:4,max:3,type:'self',d:'ตั้งประตูโทริอิ ยืนในวงฟื้น SP และ TAL เพิ่ม',lv:i=>[`SP +${KB.knTorii.sp[i-1]} ทุกวิ`,`TAL +${KB.knTorii.tal[i-1]} นาน ${KB.knTorii.T} วิ`,`Cooldown ${KB.knTorii.cd} วิ`]},
 // ---------------- A · KITSUNE-BI ----------------
 {key:'kaOrb',id:'KN-A01',name:'Foxfire Orb',br:'A',row:1,max:4,type:'melee',d:'ลูกไฟจิ้งจอก 3 ลูกวิ่งตามเป้า หาง +1 (อัปสลับเลเวลกับ Spirit Flame Pillar)',lv:i=>[`${kT(KB.kaOrb.dmg[i-1])} × ${KB.kaOrb.n}`,`Cooldown ${KB.kaOrb.cd} วิ`]},
 {key:'kaWisp',id:'KN-A02',name:'Wisp Dance',br:'A',row:2,max:3,passive:1,d:'(Passive) ไฟจิ้งจอก 2 ดวงวนรอบตัว ชนศัตรูใกล้ ๆ ทุก 1 วิ',lv:i=>[`${kT(KB.kaWisp.dmg[i-1])} ต่อดวง`]},
 {key:'kaPillar',id:'KN-A03',name:'Spirit Flame Pillar',br:'A',row:3,max:2,type:'ground',radius:()=>KB.kaPillar.R,pre:[['kaOrb',1]],d:'เสาไฟพุ่งจากพื้น หาง +1',lv:i=>[`${kT(KB.kaPillar.dmg[i-1])} รัศมี ${KB.kaPillar.R}`,`Cooldown ${KB.kaPillar.cd} วิ`]},
 {key:'kaTwin',id:'KN-A04',name:'Twin Pillars',br:'A',row:3,max:2,passive:1,enh:'kaPillar',pre:[['kaPillar',1]],d:'(ต่อยอด Spirit Flame Pillar) เกิดเสาที่สองข้าง ๆ หลัง 0.4 วิ',lv:i=>[`${kT(KB.kaTwin.dmg[i-1])}`]},
 {key:'kaLantern',id:'KN-A05',name:'Fox Lantern Trail',br:'A',row:4,max:2,type:'self',d:'วิ่งถอยทิ้งโคมไฟจิ้งจอก 4 ดวง ระเบิดเมื่อศัตรูเหยียบ',lv:i=>[`${kT(KB.kaLantern.dmg[i-1])} ต่อดวง`,`Cooldown ${KB.kaLantern.cd} วิ`]},
 {key:'kaFestival',id:'KN-A06',name:'Lantern Festival',br:'A',row:4,max:2,passive:1,enh:'kaLantern',pre:[['kaLantern',1]],d:'(ต่อยอด Fox Lantern Trail) โคมระเบิดแตกเป็นไฟเล็ก 3 ดวงวิ่งหาเป้า',lv:i=>[`${kT(KB.kaFestival.dmg[i-1])} ต่อดวง`]},
 {key:'kaRain',id:'KN-A07',name:"Will-o'-Wisp Rain",br:'A',row:5,max:2,type:'ground',radius:()=>KB.kaRain.R,d:'ฝนไฟจิ้งจอก 10 ลูกตกลงพื้นที่ หาง +2',lv:i=>[`${kT(KB.kaRain.dmg[i-1])} × ${KB.kaRain.n}`,`Cooldown ${KB.kaRain.cd} วิ`]},
 {key:'kaPetals',id:'KN-A08',name:'Burning Petals',br:'A',row:5,max:1,passive:1,enh:'kaRain',pre:[['kaRain',1]],d:'(ต่อยอด Will-o\'-Wisp Rain) ทิ้งกลีบซากุระไฟ ศัตรูที่เหยียบโดนต่อเนื่อง',lv:()=>[`${kT(KB.kaPetals.dmg)} ทุก 0.5 วิ นาน ${KB.kaPetals.T} วิ`]},
 {key:'kaBurst',id:'KN-A09',name:'Tail Burst',br:'A',row:6,max:2,type:'self',d:'ปล่อยไฟจากหางทั้งหมดเป็นคลื่นรอบตัว ใช้หางทั้งหมด',lv:i=>[`${kT(KB.kaBurst.dmg[i-1])} + ${kT(KB.kaBurst.per)} ต่อหาง`,`Cooldown ${KB.kaBurst.cd} วิ`]},
 {key:'kaAfterglow',id:'KN-A10',name:'Afterglow',br:'A',row:6,max:2,passive:1,enh:'kaBurst',pre:[['kaBurst',1]],d:'(ต่อยอด Tail Burst) หลังปล่อยคืนหาง',lv:i=>[`คืน ${KB.kaAfterglow.back[i-1]} หาง`]},
 {key:'kaWisdom',id:'KN-A11',name:'Fox Wisdom',br:'A',row:7,max:3,passive:1,d:'(Passive) หางที่จุดอยู่ให้ TAL เพิ่ม',lv:i=>[`TAL +${KB.kaWisdom.tal[i-1]} ต่อหาง`]},
 {key:'kaVeil',id:'KN-A12',name:'Foxfire Veil',br:'A',row:7,max:1,type:'self',d:'ม่านไฟรอบตัว ศัตรูที่เข้ามาใกล้โดนไฟและกระเด็นออก',lv:()=>[`${kT(KB.kaVeil.dmg)} ทุก 0.5 วิ นาน ${KB.kaVeil.T} วิ`,`Cooldown ${KB.kaVeil.cd} วิ`]},
 {key:'kaInferno',id:'KN-A13',name:'Nine-Tailed Inferno',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · หางทั้งเก้ากางออก ยิงลำแสงไฟ 9 สายใส่ศัตรูรอบตัว',lv:i=>[`${kT(KB.kaInferno.dmg[i-1])} × 9 รัศมี ${KB.kaInferno.R}`,`Cooldown ${KB.kaInferno.cd} วิ`]},
 {key:'kaCelestial',id:'KN-A14',name:'Celestial Fox',br:'A',row:8,max:1,passive:1,enh:'kaInferno',pre:[['kaInferno',1]],d:'(ต่อยอด Nine-Tailed Inferno) จบอัลติ หางเต็ม 9 และสกิล A ไม่ใช้ SP',lv:()=>[`นาน ${KB.kaCelestial.T} วิ`]},
 // ---------------- B · MOON MIRROR PRIESTESS ----------------
 {key:'kbBeam',id:'KN-G01',name:'Moon Mirror Beam',br:'B',row:1,max:4,type:'melee',d:'ส่องกระจกยิงลำแสงจันทร์ทะลุแนวตรง (อัปสลับเลเวลกับ Crescent Blade)',lv:i=>[`${kT(KB.kbBeam.dmg[i-1])} ยาว ${KB.kbBeam.len}`,`Cooldown ${KB.kbBeam.cd} วิ`]},
 {key:'kbCalm',id:'KN-G02',name:'Moonlit Calm',br:'B',row:2,max:3,passive:1,d:'(Passive) ศัตรูที่โดนเวท B ช้าลง',lv:i=>[`ช้าลง ${KB.kbCalm.slow[i-1]} วิ`]},
 {key:'kbCrescent',id:'KN-G03',name:'Crescent Blade',br:'B',row:3,max:2,type:'melee',pre:[['kbBeam',1]],d:'ขว้างจันทร์เสี้ยวไปแล้ววนกลับ โดนทั้งขาไปขากลับ',lv:i=>[`${kT(KB.kbCrescent.dmg[i-1])}`,`Cooldown ${KB.kbCrescent.cd} วิ`]},
 {key:'kbHalf',id:'KN-G04',name:'Half Moons',br:'B',row:3,max:2,passive:1,enh:'kbCrescent',pre:[['kbCrescent',1]],d:'(ต่อยอด Crescent Blade) จันทร์เสี้ยวอีกอันไปทางตรงข้าม',lv:i=>[`${kT(KB.kbHalf.dmg[i-1])}`]},
 {key:'kbMirror',id:'KN-G05',name:'Yata Mirror',br:'B',row:4,max:2,type:'ground',radius:()=>40,d:'วางกระจกศักดิ์สิทธิ์ ลำแสงจันทร์ที่โดนกระจกแตกเป็น 3 ลำ',lv:i=>[`ลำแยก ${kT(KB.kbMirror.split[i-1])}`,`อยู่ ${KB.kbMirror.T} วิ`,`Cooldown ${KB.kbMirror.cd} วิ`]},
 {key:'kbShards',id:'KN-G06',name:'Mirror Shards',br:'B',row:4,max:2,passive:1,enh:'kbMirror',pre:[['kbMirror',1]],d:'(ต่อยอด Yata Mirror) กระจกหมดเวลาแตกกระจาย',lv:i=>[`${kT(KB.kbShards.dmg[i-1])} รัศมี ${KB.kbShards.R}`]},
 {key:'kbCircle',id:'KN-G07',name:'Lunar Circle',br:'B',row:5,max:2,type:'ground',radius:()=>KB.kbCircle.R,d:'วงจันทร์บนพื้น ดึงศัตรูเข้ากลางช้า ๆ',lv:i=>[`${kT(KB.kbCircle.dmg[i-1])} ทุก 0.5 วิ นาน ${KB.kbCircle.T} วิ`,`Cooldown ${KB.kbCircle.cd} วิ`]},
 {key:'kbEclipse',id:'KN-G08',name:'Eclipse Core',br:'B',row:5,max:1,passive:1,enh:'kbCircle',pre:[['kbCircle',1]],d:'(ต่อยอด Lunar Circle) วงจบ ศัตรูกลางวงโดนตรึง',lv:()=>[`ตรึง ${KB.kbEclipse.stun} วิ · ${kT(KB.kbEclipse.dmg)}`]},
 {key:'kbStar',id:'KN-G09',name:'Starfall',br:'B',row:6,max:2,type:'melee',d:'ดาว 6 ดวงตกใส่เป้าทีละดวง',lv:i=>[`${kT(KB.kbStar.dmg[i-1])} × ${KB.kbStar.n}`,`Cooldown ${KB.kbStar.cd} วิ`]},
 {key:'kbShooting',id:'KN-G10',name:'Shooting Star',br:'B',row:6,max:1,passive:1,enh:'kbStar',pre:[['kbStar',1]],d:'(ต่อยอด Starfall) ดาวแต่ละดวงเด้งไปโดนศัตรูใกล้ ๆ อีกตัว',lv:()=>[`${kT(KB.kbShooting.dmg)}`]},
 {key:'kbGrace',id:'KN-G11',name:"Moon's Grace",br:'B',row:7,max:3,passive:1,d:'(Passive) ศัตรูที่ช้าอยู่ โดนเวท B แรงขึ้น',lv:i=>[`TAL +${KB.kbGrace.tal[i-1]}`]},
 {key:'kbMoonlight',id:'KN-G12',name:'Moonlight Form',br:'B',row:7,max:1,type:'self',d:'กลายเป็นแสงจันทร์ ไม่โดนโจมตี เดินทะลุศัตรู',lv:()=>[`นาน ${KB.kbMoonlight.T} วิ`,`Cooldown ${KB.kbMoonlight.cd} วิ`]},
 {key:'kbNight',id:'KN-G13',name:"Tsukuyomi's Night",br:'B',row:8,max:2,type:'self',ult:1,d:'ULTIMATE B · ฟ้ามืดเป็นกลางคืน ทุก 1 วิ ลำแสงจันทร์ลงใส่ศัตรูทุกตัวรอบตัว',lv:i=>[`${kT(KB.kbNight.dmg[i-1])} ทุก 1 วิ นาน ${KB.kbNight.T} วิ รัศมี ${KB.kbNight.R}`,`Cooldown ${KB.kbNight.cd} วิ`]},
 {key:'kbMoonrise',id:'KN-G14',name:'Moonrise',br:'B',row:8,max:1,passive:1,enh:'kbNight',pre:[['kbNight',1]],d:'(ต่อยอด Tsukuyomi\'s Night) จบอัลติ จันทร์เต็มดวงตกกลางวง',lv:()=>[`${kT(KB.kbMoonrise.dmg)} รัศมี ${KB.kbMoonrise.R}`]},
 // ---------------- C · HEIR OF INARI ----------------
 {key:'kcChime',id:'KN-C01',name:'Sacred Chime',br:'C',col:'basic',tier:1,passive:1,pre:[['knStaff',4]],d:'ตีปกติต่อได้ 5 จังหวะ จังหวะที่ 5 กระดิ่งใหญ่รอบตัว',lv:()=>[`${kT(KB.kcChime.dmg)} รัศมี ${KB.kcChime.R}`]},
 {key:'kcSwarm',id:'KN-C02',name:'Foxfire Swarm',br:'C',col:'A',tier:1,passive:1,pre:[['kaOrb',4]],d:'Foxfire Orb ยิงลูกไฟ 5 ลูกแทน 3',lv:()=>['5 ลูก']},
 {key:'kcPrism',id:'KN-C03',name:'Prism Beam',br:'C',col:'B',tier:1,passive:1,pre:[['kbBeam',4]],d:'Moon Mirror Beam ยิงลำแสง 3 ลำเป็นพัด',lv:()=>['3 ลำ']},
 {key:'kcPhantom',id:'KN-C04',name:'Phantom Step',br:'C',col:'basic',tier:2,passive:1,pre:[['knStep',3]],d:'เงาจิ้งจอกจาก Fox Step ระเบิดตอนหาย',lv:()=>[`${kT(KB.kcPhantom.dmg)} รัศมี ${KB.kcPhantom.R}`]},
 {key:'kcWheel',id:'KN-C05',name:'Fox Fire Wheel',br:'C',col:'A',tier:2,type:'melee',pre:[['kaPillar',2]],d:'[New Active] วงล้อไฟจิ้งจอกกลิ้งไปข้างหน้า หาง +2',lv:()=>[`${kT(KB.kcWheel.dmg)} ทุกตัวในแนว ${KB.kcWheel.len}`,`Cooldown ${KB.kcWheel.cd} วิ`]},
 {key:'kcDisc',id:'KN-C06',name:'Full Moon Disc',br:'C',col:'B',tier:2,type:'melee',pre:[['kbCrescent',2]],d:'[New Active] ขว้างจานจันทร์เต็มดวงทะลุทุกตัว ศัตรูช้าลง',lv:()=>[`${kT(KB.kcDisc.dmg)} ยาว ${KB.kcDisc.len}`,`Cooldown ${KB.kcDisc.cd} วิ`]},
 {key:'kcGrace',id:'KN-C07',name:"Inari's Grace",br:'C',col:'basic',tier:3,type:'self',pre:[['knBless',2]],d:'[New Active] ข้าวศักดิ์สิทธิ์ ฟื้น HP ต่อเนื่อง TAL เพิ่ม',lv:()=>[`ฟื้น HP = เลเวล × ${KB.kcGrace.hp} ทุกวิ`,`TAL +${KB.kcGrace.tal} นาน ${KB.kcGrace.T} วิ`,`Cooldown ${KB.kcGrace.cd} วิ`]},
 {key:'kcMeteor',id:'KN-C08',name:'Meteor Wisp',br:'C',col:'A',tier:3,passive:1,pre:[['kaRain',2]],d:'Will-o\'-Wisp Rain ปิดท้ายด้วยลูกไฟยักษ์กลางวง',lv:()=>[`${kT(KB.kcMeteor.dmg)}`]},
 {key:'kcShower',id:'KN-C09',name:'Meteor Shower',br:'C',col:'B',tier:3,passive:1,pre:[['kbStar',2]],d:'Starfall ดาวตก 10 ดวงแทน 6',lv:()=>['10 ดวง']},
 {key:'kcAwaken',id:'KN-C10',name:'Nine-Tail Awakening',br:'C',col:'basic',tier:4,type:'self',pre:[['knTorii',3]],d:'[New Active] Signature · ร่างเก้าหางเรืองแสง ตีปกติแรงขึ้น หางได้ทีละ 2 คูลดาวน์สกิล B เดินเร็วขึ้น',lv:()=>[`ตีปกติ TAL +${KB.kcAwaken.tal}`,'หาง ×2 · CD สกิล B −1 วิ ทุกวิ',`Cooldown ${KB.kcAwaken.cd} วิ`]},
 {key:'kcTamamo',id:'KN-C11',name:"Tamamo's Sun",br:'C',col:'A',tier:4,type:'ground',radius:()=>KB.kcTamamo.R,pre:[['kaInferno',1]],d:'[New Active] ดวงอาทิตย์ไฟจิ้งจอกตกกลางพื้นที่ ใช้หางทั้งหมด',lv:()=>[`${kT(KB.kcTamamo.dmg)} + ${kT(KB.kcTamamo.per)} ต่อหาง`,`Cooldown ${KB.kcTamamo.cd} วิ`]},
 {key:'kcTsukuyomi',id:'KN-C12',name:'Tsukuyomi Descends',br:'C',col:'B',tier:4,type:'melee',pre:[['kbNight',1]],d:'[New Active] เทพจันทราส่องลำแสงยักษ์ทะลุแนว',lv:()=>[`${kT(KB.kcTsukuyomi.dmg)} ยาว ${KB.kcTsukuyomi.len}`,`Cooldown ${KB.kcTsukuyomi.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const KI={tails:0,freeNext:false,bellN:0,shield:0,shieldUntil:0,torii:null,mirror:null,circle:null,lanterns:[],petals:[],night:null,wispT:0};
const kL=k=>LV[k]||0;
const kLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,kL(k)))-1];
const KIC={fire:'#ff7ab8',fire2:'#7ad8ff',moon:'#d8e4ff',moon2:'#b8a8ff',gold:'#ffd36a',red:'#ff5a5a',white:'#ffffff'};
const kCol=k=>{if(!k||k==='basic')return 'basic';const d=KI_DEFS.find(x=>x.key===k);if(!d)return 'basic';return d.br==='C'?d.col:d.br;};
function kHit(e,mult,key,o={}){if(!e||e.dead)return 0;const br=kCol(key);const r=hurt(e,mult,Object.assign({skill:key,br},o));
  if(br==='B'&&!e.dead&&kL('kbCalm')){const T=kLv(KB.kbCalm.slow,'kbCalm');applyCC(e,{slow:T});e.kSlowT=Math.max(e.kSlowT||0,gameTime+T);}return r;}
const kNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const kSeg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const kLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&kSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
function kFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function kPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!kFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const kTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const kPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const kPt=(c,r)=>{const t=kTgt(c,r);return [c.gx??(t?t.x:player.x+Math.cos(player.phi)*120),c.gy??(t?t.y:player.y+Math.sin(player.phi)*120)];};
const kAwake=()=>hasBuff('kcAwaken');
/* TAILS (A) */
function kTail(n){if(kAwake())n*=2;const b=KI.tails;KI.tails=Math.min(KI_BAL.tails.cap,KI.tails+n);if(KI.tails>b)KI.tailPop=1;if(b<KI_BAL.tails.cap&&KI.tails>=KI_BAL.tails.cap)KI.freeNext=true;}
function kSpendTails(){const n=KI.tails;KI.tails=0;return n;}
/* once-per-cast tail gain */
const kOnce=(a,n)=>{if(a&&!a._kt){a._kt=1;kTail(n);}};

/* ---------------------------------------------------------------------
   4. FX (code placeholders — painted pieces come later)
   --------------------------------------------------------------------- */
function kGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function kPow(e,big,col){addFx(new Impact({pos:[e.x,e.y,(e.boss?36:24)],size:big?48:26,color:col||KIC.fire,core:'#ffffff',rays:big?10:6,life:big?.24:.15}));}
function kFireBurst(x,y,R,col){addFx(new GRing({x,y,r0:8,r1:R,w:10,color:col||KIC.fire,life:.35}));for(let i=0;i<qn(12);i++){const a=rnd(0,TAU),s=rnd(60,160);emit({type:'round',x,y,z:rnd(6,30),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rnd(40,140),drag:1.2,life:rnd(.35,.6),size:rnd(2,4),size1:.5,color:Math.random()<.5?col||KIC.fire:'#ffffff'});}}
/* homing fox fire */
class KiHome{constructor(o){Object.assign(this,{t:0,layer:'top',speed:420,z:40,col:KIC.fire2,turn:7,life:2.2,r:7},o);this.vx=Math.cos(this.phi)*this.speed;this.vy=Math.sin(this.phi)*this.speed;}
  update(dt){this.t+=dt;let e=this.tg&&!this.tg.dead?this.tg:nearestEnemy(this.x,this.y,360);if(e){const a=Math.atan2(e.y-this.y,e.x-this.x),c=Math.atan2(this.vy,this.vx);let d=a-c;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;const n=c+clamp(d,-this.turn*dt,this.turn*dt);this.vx=Math.cos(n)*this.speed;this.vy=Math.sin(n)*this.speed;
      if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+12){this.hit&&this.hit(e);kPow(e,false,this.col);return false;}}
    this.x+=this.vx*dt;this.y+=this.vy*dt;return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);kGlow(x,y,18,this.col,.6);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,this.r*.5,0,TAU);ctx.fill();}}
/* projectile that flies out and (optionally) back */
class KiShot{constructor(o){Object.assign(this,{t:0,layer:'top',speed:620,len:240,w:20,z:36,col:KIC.moon,back:false,pierce:99,d:0,dir:1,hits:new Set(),kind:'crescent'},o);this.x0=this.x;this.y0=this.y;}
  update(dt){this.t+=dt;this.d+=this.speed*dt*this.dir;if(this.back&&this.dir>0&&this.d>=this.len){this.dir=-1;this.hits.clear();}
    const ox=this.back&&this.dir<0?player.x:this.x0,oy=this.back&&this.dir<0?player.y:this.y0;this.x=ox+Math.cos(this.phi)*this.d;this.y=oy+Math.sin(this.phi)*this.d;
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w){this.hits.add(e);this.hit&&this.hit(e);if(this.hits.size>=this.pierce)return false;}}
    if(this.back)return this.dir>0||this.d>0;if(!kFree(this.x,this.y))return false;return this.d<this.len;}
  draw(){const [x,y]=P(this.x,this.y,this.z);kGlow(x,y,this.w*1.6,this.col,.5);ctx.save();ctx.translate(x,y);ctx.rotate(this.t*14);ctx.strokeStyle='#ffffff';ctx.lineWidth=3;
    if(this.kind==='wheel'){ctx.strokeStyle=KIC.fire;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,this.w,0,TAU);ctx.stroke();for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(i)*this.w,Math.sin(i)*this.w);ctx.stroke();}}
    else if(this.kind==='disc'){ctx.fillStyle=hexA(KIC.moon,.8);ctx.beginPath();ctx.arc(0,0,this.w,0,TAU);ctx.fill();}
    else{ctx.beginPath();ctx.arc(0,0,this.w,.3,Math.PI*1.4);ctx.stroke();}ctx.restore();}}
/* straight beam (instant line, drawn for a moment) */
class KiBeam{constructor(o){Object.assign(this,{t:0,life:.28,layer:'top',w:10,col:KIC.moon},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x0,y0]=P(this.x,this.y,34),[x1,y1]=P(this.x+Math.cos(this.phi)*this.L,this.y+Math.sin(this.phi)*this.L,34);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    ctx.strokeStyle=hexA(this.col,.55*a);ctx.lineWidth=this.w*2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a);ctx.lineWidth=this.w*.5;ctx.stroke();ctx.restore();}}
/* light pillar from the sky (moon beams, stars) */
class KiPillar{constructor(o){Object.assign(this,{t:0,life:.35,layer:'top',w:14,col:KIC.moon},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=P(this.x,this.y,0);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x,y-260,x,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA(this.col,.8*a));ctx.fillStyle=g;ctx.fillRect(x-this.w/2,y-260,this.w,260);ctx.restore();kGlow(x,y,this.w*2.2,this.col,.5*a);}}
/* ground layer */
class KiGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='kitsune';}
  ring(x,y,R,col,a,dash){const [px,py]=P(x,y);ctx.save();ctx.translate(px,py);ctx.scale(1,K);ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=3;if(dash){ctx.setLineDash([8,6]);ctx.lineDashOffset=-this.t*30;}ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.globalAlpha=a*.25;ctx.fillStyle=col;ctx.fill();ctx.restore();}
  draw(){const T=KI.torii;if(T)this.ring(T.x,T.y,KB.knTorii.R,KIC.red,.6,true);const C=KI.circle;if(C)this.ring(C.x,C.y,KB.kbCircle.R,KIC.moon2,.6,true);
    for(const p of KI.petals)this.ring(p.x,p.y,p.R,KIC.fire,.35,false);
    for(const l of KI.lanterns){const [x,y]=P(l.x,l.y,14);kGlow(x,y,14,KIC.fire,.7);ctx.fillStyle='#ffe0f0';ctx.fillRect(x-4,y-6,8,10);}}}
/* top layer: tails fan, shield, mirror, wisps, awakening */
class KiTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;KI.tailPop=Math.max(0,(KI.tailPop||0)-dt*4);return CHAR==='kitsune';}
  draw(){const pz=(player.z||0)+92*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    if(kL('kaOrb')){for(let i=0;i<KI_BAL.tails.cap;i++){const an=-Math.PI*.9+i*(Math.PI*.8/8)+Math.PI*.05,px=x+Math.cos(an)*22,py=y+8+Math.sin(an)*12,on=i<KI.tails;ctx.fillStyle=on?(KI.tails>=9?KIC.fire2:KIC.fire):'rgba(40,20,30,.45)';ctx.beginPath();ctx.arc(px,py-(on?KI.tailPop*2:0),on?3.2:2.2,0,TAU);ctx.fill();if(on)kGlow(px,py,7,KIC.fire,.35);}}
    if(KI.shield>0&&KI.shieldUntil>gameTime){const [sx,sy]=P(player.x,player.y,36);ctx.save();ctx.strokeStyle=hexA(KIC.gold,.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy-6,38,0,TAU);ctx.stroke();ctx.restore();}
    if(kL('kaWisp'))for(let i=0;i<2;i++){const an=this.t*2.6+i*Math.PI,[wx,wy]=P(player.x+Math.cos(an)*34,player.y+Math.sin(an)*20,44);kGlow(wx,wy,10,KIC.fire2,.7);}
    const M=KI.mirror;if(M){const [mx,my]=P(M.x,M.y,40);kGlow(mx,my,26,KIC.moon,.5);ctx.save();ctx.fillStyle='#e8f0ff';ctx.strokeStyle=KIC.gold;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(mx,my,12,0,TAU);ctx.fill();ctx.stroke();ctx.restore();}
    if(hasBuff('kaVeil')){const [vx,vy]=P(player.x,player.y,0);ctx.save();ctx.translate(vx,vy);ctx.scale(1,K);ctx.strokeStyle=hexA(KIC.fire,.6);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,KB.kaVeil.R,this.t*4,this.t*4+TAU*.85);ctx.stroke();ctx.restore();}
    if(hasBuff('kbMoonlight'))kGlow(x,y+50,44,KIC.moon,.4);
    if(kAwake())kGlow(x,y+40,56,KIC.fire,.25+.1*Math.sin(this.t*8));
    const N=KI.night;if(N){ctx.save();ctx.fillStyle='rgba(10,12,40,.18)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}}}
/* per-frame logic */
class KiCore{constructor(){this.t=0;this.layer='none';this.tk=0;this.h=0;}draw(){}
  update(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new KiGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new KiTop());
    this.tk+=dt;const tick=this.tk>=1;if(tick)this.tk=0;this.h+=dt;const half=this.h>=.5;if(half)this.h=0;
    /* wisp dance */
    if(kL('kaWisp')&&tick){for(let i=0;i<2;i++){const e=nearestEnemy(player.x,player.y,KB.kaWisp.R);if(!e)break;kHit(e,kLv(KB.kaWisp.dmg,'kaWisp'),'kaWisp');kPow(e,false,KIC.fire2);}}
    /* torii gate */
    const T=KI.torii;if(T){if(T.until<gameTime)KI.torii=null;else if(tick&&Math.hypot(player.x-T.x,player.y-T.y)<KB.knTorii.R)player.mp=Math.min(player.maxMp,player.mp+kLv(KB.knTorii.sp,'knTorii'));}
    /* grace heal */
    if(hasBuff('kcGrace'))player.hp=Math.min(player.maxHp,player.hp+PS.lv*KB.kcGrace.hp*dt);
    /* awakening: B cooldowns run faster */
    if(kAwake())for(const k in player.cd){if(player.cd[k]>0&&kCol(k)==='B')player.cd[k]=Math.max(0,player.cd[k]-dt);}
    /* foxfire veil */
    if(hasBuff('kaVeil')&&half)for(const e of kNear(player.x,player.y,KB.kaVeil.R)){kHit(e,KB.kaVeil.dmg,'kaVeil',{knock:[angTo(e),120]});kPow(e,false);}
    /* lanterns */
    KI.lanterns=KI.lanterns.filter(l=>{if(l.until<gameTime)return false;const e=enemies.find(q=>!q.dead&&Math.hypot(q.x-l.x,q.y-l.y)<q.r+20);if(!e)return true;
      for(const q of kNear(l.x,l.y,KB.kaLantern.R))kHit(q,kLv(KB.kaLantern.dmg,'kaLantern'),'kaLantern');kFireBurst(l.x,l.y,KB.kaLantern.R);kTail(1);
      if(kL('kaFestival'))for(let i=0;i<KB.kaFestival.n;i++)addFx(new KiHome({x:l.x,y:l.y,phi:i*TAU/3,col:KIC.fire,speed:360,hit:q=>kHit(q,kLv(KB.kaFestival.dmg,'kaFestival'),'kaFestival')}));return false;});
    /* petals */
    KI.petals=KI.petals.filter(p=>p.until>gameTime);if(half)for(const p of KI.petals)for(const e of kNear(p.x,p.y,p.R))kHit(e,KB.kaPetals.dmg,'kaPetals');
    /* lunar circle */
    const C=KI.circle;if(C){if(C.until<gameTime){KI.circle=null;if(kL('kbEclipse'))for(const e of kNear(C.x,C.y,60)){kHit(e,KB.kbEclipse.dmg,'kbEclipse',{big:true});applyCC(e,{stun:KB.kbEclipse.stun});}kFireBurst(C.x,C.y,70,KIC.moon2);}
      else{for(const e of kNear(C.x,C.y,KB.kbCircle.R)){if(e.boss)continue;const d=Math.hypot(C.x-e.x,C.y-e.y);if(d>10){e.x+=(C.x-e.x)/d*60*dt;e.y+=(C.y-e.y)/d*60*dt;}}
        if(half)for(const e of kNear(C.x,C.y,KB.kbCircle.R))kHit(e,C.dmg,'kbCircle');}}
    /* yata mirror expiry */
    const M=KI.mirror;if(M&&M.until<gameTime){KI.mirror=null;if(kL('kbShards')){for(const e of kNear(M.x,M.y,KB.kbShards.R))kHit(e,kLv(KB.kbShards.dmg,'kbShards'),'kbShards');kFireBurst(M.x,M.y,KB.kbShards.R,KIC.moon);}}
    /* tsukuyomi's night */
    const N=KI.night;if(N){if(N.until<gameTime){KI.night=null;if(N.rise){addFx(new KiPillar({x:player.x,y:player.y,w:60,life:.6}));for(const e of kNear(player.x,player.y,KB.kbMoonrise.R))kHit(e,KB.kbMoonrise.dmg,'kbMoonrise',{big:true});kFireBurst(player.x,player.y,KB.kbMoonrise.R,KIC.moon);shake(3);}}
      else if((N.tk+=dt)>=1){N.tk=0;skyDarkT=Math.max(skyDarkT||0,.4);for(const e of kNear(player.x,player.y,KB.kbNight.R)){addFx(new KiPillar({x:e.x,y:e.y}));kHit(e,N.dmg,'kbNight');applyCC(e,{slow:1.2});}}}
    /* shield expiry */
    if(KI.shieldUntil<gameTime)KI.shield=0;}}

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
let KI_CORE=null;function kEnsure(){if(CHAR!=='kitsune')return;if(!KI_CORE||!fx.includes(KI_CORE))KI_CORE=addFx(new KiCore());}
function kCast(o){kEnsure();return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2.2,glow:o.glow||KIC.fire,events:tP=>[{t:tP,f:a=>o.f(a)}]});}
function kStaff(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),s=seq('attack',d,Math.max(0,ct-3),null,(o.speed||1.3)*aspd());
  return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,seqIndex(s,'attack',ct,0)),dur:seqTimeAt(s,seqIndex(s,'attack',ct,0)+2),hitList:[],update:()=>{player.glow={color:o.glow||KIC.fire,k:.6};},
    events:[{t:seqTimeAt(s,seqIndex(s,'attack',ct,0)),f:a=>o.f(a)}]});}

/* ---------- normal attack ---------- */
function mkKiBasic(tgt){kEnsure();const lv=Math.max(1,kL('knStaff')),chain=KB.knStaff.chain[lv-1]+(kL('kcChime')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),big=kL('kcChime')&&last;
  return kStaff({key:'basic',name:big?'Sacred Chime':'Shrine Staff '+(idx+1),phi,speed:last?1.15:2,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(big){for(const e of kNear(player.x,player.y,KB.kcChime.R))kHit(e,KB.kcChime.dmg,'kcChime',{auto:true});kFireBurst(player.x,player.y,KB.kcChime.R,KIC.gold);a.hitConfirmed=true;shake(1.6);return;}
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+60+tgt.r)return;
    addFx(new KiHome({x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,phi,tg:tgt,speed:560,r:5,col:KIC.fire,hit:e=>{kHit(e,KB.knStaff.hit,'basic',{auto:true});
      if(kL('knBell')){KI.bellN++;if(KI.bellN>=KB.knBell.every){KI.bellN=0;for(const q of kNear(e.x,e.y,KB.knBell.R))kHit(q,kLv(KB.knBell.dmg,'knBell'),'knBell');kFireBurst(e.x,e.y,KB.knBell.R,KIC.gold);}}}}));a.hitConfirmed=true;}});}

/* ---------- BASIC ---------- */
function mkKnStep(c){const near=nearestEnemy(player.x,player.y,260),phi=near?Math.atan2(player.y-near.y,player.x-near.x):player.phi+Math.PI;
  return kCast({key:'knStep',name:'Fox Step',speed:3,glow:KIC.white,f:()=>{const sx=player.x,sy=player.y;if(typeof Decoy==='function'){if(decoy)decoy.dead=true;decoy=addFx(new Decoy({life:1.5}));
      if(kL('kcPhantom')){const dd=decoy;setFxTimer(1.5,()=>{for(const e of kNear(sx,sy,KB.kcPhantom.R))kHit(e,KB.kcPhantom.dmg,'kcPhantom');kFireBurst(sx,sy,KB.kcPhantom.R);});}}
    const [x,y]=kPathEnd(sx,sy,phi,kLv(KB.knStep.dist,'knStep'));player.x=x;player.y=y;kFireBurst(sx,sy,30,KIC.white);if(near)faceTo(angTo(near));}});}
function mkKnWard(c){return kCast({key:'knWard',name:'Ofuda Ward',glow:KIC.gold,f:()=>{KI.shield=Math.round(PS.lv*kLv(KB.knWard.shield,'knWard'));KI.shieldUntil=gameTime+KB.knWard.T;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:50,w:5,color:KIC.gold,life:.4}));}});}
function mkKnBless(c){return kCast({key:'knBless',name:"Inari's Blessing",glow:'#9aff9a',f:()=>{const h=Math.round(PS.lv*kLv(KB.knBless.hp,'knBless'));player.hp=Math.min(player.maxHp,player.hp+h);player.mp=Math.min(player.maxMp,player.mp+kLv(KB.knBless.sp,'knBless'));dmgNum(player.x,player.y,80,'+'+h,'heal');}});}
function mkKnTorii(c){return kCast({key:'knTorii',name:'Torii Gate',glow:KIC.red,f:()=>{KI.torii={x:player.x,y:player.y,until:gameTime+KB.knTorii.T};addFx(new GRing({x:player.x,y:player.y,r0:10,r1:KB.knTorii.R,w:8,color:KIC.red,life:.45}));}});}

/* ---------- A · Kitsune-bi ---------- */
function mkKaOrb(c){const t=kTgt(c,KB.kaOrb.range),phi=kPhi(c,t),n=kL('kcSwarm')?KB.kcSwarm.n:KB.kaOrb.n,m=kLv(KB.kaOrb.dmg,'kaOrb');
  return kCast({key:'kaOrb',name:'Foxfire Orb',phi,f:a=>{for(let i=0;i<n;i++)addFx(new KiHome({x:player.x,y:player.y,phi:phi+(i-(n-1)/2)*.5,tg:t,col:KIC.fire2,hit:e=>{kHit(e,m,'kaOrb');kOnce(a,1);a.hitConfirmed=true;}}));}});}
function kPillarAt(x,y,m,key,a){setFxTimer(.2,()=>{addFx(new KiPillar({x,y,w:36,col:KIC.fire,life:.4}));for(const e of kNear(x,y,KB.kaPillar.R)){kHit(e,m,key,{big:true});if(a)kOnce(a,1);}kFireBurst(x,y,KB.kaPillar.R);shake(1.6);});}
function mkKaPillar(c){const [x,y]=kPt(c,KB.kaPillar.range);return kCast({key:'kaPillar',name:'Spirit Flame Pillar',phi:Math.atan2(y-player.y,x-player.x),f:a=>{kPillarAt(x,y,kLv(KB.kaPillar.dmg,'kaPillar'),'kaPillar',a);
  if(kL('kaTwin'))setFxTimer(.4,()=>{const an=rnd(0,TAU);kPillarAt(x+Math.cos(an)*60,y+Math.sin(an)*40,kLv(KB.kaTwin.dmg,'kaTwin'),'kaTwin');});}});}
function mkKaLantern(c){const near=nearestEnemy(player.x,player.y,260),phi=near?Math.atan2(player.y-near.y,player.x-near.x):player.phi+Math.PI;
  return kCast({key:'kaLantern',name:'Fox Lantern Trail',speed:2.6,f:()=>{const sx=player.x,sy=player.y,[ex,ey]=kPathEnd(sx,sy,phi,KB.kaLantern.back);for(let i=0;i<KB.kaLantern.n;i++){const k=i/(KB.kaLantern.n-1);KI.lanterns.push({x:lerp(sx,ex,k)+rnd(-10,10),y:lerp(sy,ey,k)+rnd(-10,10),until:gameTime+KB.kaLantern.T});}
    player.x=ex;player.y=ey;if(near)faceTo(angTo(near));}});}
function mkKaRain(c){const [x,y]=kPt(c,KB.kaRain.range);return kCast({key:'kaRain',name:"Will-o'-Wisp Rain",phi:Math.atan2(y-player.y,x-player.x),f:a=>{const n=KB.kaRain.n,m=kLv(KB.kaRain.dmg,'kaRain');kOnce(a,2);
  for(let i=0;i<n;i++)setFxTimer(.08*i,()=>{const an=i*2.4,r=KB.kaRain.R*Math.sqrt((i+.5)/n),px=x+Math.cos(an)*r,py=y+Math.sin(an)*r*.7;addFx(new KiPillar({x:px,y:py,w:12,col:KIC.fire2,life:.25}));for(const e of kNear(px,py,40))kHit(e,m,'kaRain');
    if(kL('kaPetals'))KI.petals.push({x:px,y:py,R:30,until:gameTime+KB.kaPetals.T});});
  if(kL('kcMeteor'))setFxTimer(.08*n+.1,()=>{addFx(new KiPillar({x,y,w:60,col:KIC.fire,life:.5}));for(const e of kNear(x,y,90))kHit(e,KB.kcMeteor.dmg,'kcMeteor',{big:true});kFireBurst(x,y,90);shake(2.4);});}});}
function mkKaBurst(c){return kCast({key:'kaBurst',name:'Tail Burst',speed:1.6,f:()=>{const n=kSpendTails(),m=kLv(KB.kaBurst.dmg,'kaBurst')+KB.kaBurst.per*n;
  for(const e of kNear(player.x,player.y,KB.kaBurst.R))kHit(e,m,'kaBurst',{big:true,knock:[angTo(e),140]});kFireBurst(player.x,player.y,KB.kaBurst.R);shake(2.6);stop(60);
  if(n)addFx(new DText({x:player.x,y:player.y,z:100,text:'TAILS ×'+n,color:KIC.fire,size:13,life:.8}));if(kL('kaAfterglow'))setFxTimer(.1,()=>kTail(kLv(KB.kaAfterglow.back,'kaAfterglow')));}});}
function mkKaVeil(c){return kCast({key:'kaVeil',name:'Foxfire Veil',f:()=>{addBuff('kaVeil',KB.kaVeil.T);kFireBurst(player.x,player.y,KB.kaVeil.R);}});}
function mkKaInferno(c){return buffAct({key:'kaInferno',name:'Nine-Tailed Inferno',speed:1.4,glow:KIC.fire,events:tP=>{const ev=[];for(let i=0;i<9;i++)ev.push({t:tP+i*.08,f:()=>{const L=kNear(player.x,player.y,KB.kaInferno.R).sort((a,b)=>dist(a,player)-dist(b,player));if(!L.length)return;const e=L[i%L.length];
    addFx(new KiBeam({x:player.x,y:player.y,phi:angTo(e),L:dist(player,e),col:KIC.fire,w:8}));kHit(e,kLv(KB.kaInferno.dmg,'kaInferno'),'kaInferno',{big:true});kPow(e,true);}});
    ev.push({t:tP+.8,f:()=>{if(kL('kaCelestial')){KI.tails=KI_BAL.tails.cap;addBuff('kaCelestial',KB.kaCelestial.T);}}});return ev;}});}

/* ---------- B · Moon Mirror Priestess ---------- */
function kBeamLine(x,y,phi,L,w,m,key,o={}){addFx(new KiBeam({x,y,phi,L,w:w/2,col:o.col||KIC.moon}));for(const e of kLine(x,y,phi,L,w))kHit(e,m,key,{big:o.big});
  /* a beam passing over the Yata mirror splits into 3 */
  const M=KI.mirror;if(M&&!o.split&&kSeg(M.x,M.y,x,y,x+Math.cos(phi)*L,y+Math.sin(phi)*L)<30){const sm=kLv(KB.kbMirror.split,'kbMirror');for(const d of [-.55,0,.55])kBeamLine(M.x,M.y,phi+d,220,18,sm,'kbMirror',{split:true});kFireBurst(M.x,M.y,30,KIC.moon);}}
function mkKbBeam(c){const t=kTgt(c,KB.kbBeam.range),phi=kPhi(c,t),n=kL('kcPrism')?KB.kcPrism.n:1,m=kLv(KB.kbBeam.dmg,'kbBeam');
  return kCast({key:'kbBeam',name:'Moon Mirror Beam',phi,glow:KIC.moon,f:a=>{for(let i=0;i<n;i++)kBeamLine(player.x,player.y,phi+(n>1?(i-(n-1)/2)*KB.kcPrism.spread:0),KB.kbBeam.len,KB.kbBeam.w,m,'kbBeam');a.hitConfirmed=true;}});}
function mkKbCrescent(c){const t=kTgt(c,KB.kbCrescent.range),phi=kPhi(c,t);
  return kCast({key:'kbCrescent',name:'Crescent Blade',phi,glow:KIC.moon,f:a=>{addFx(new KiShot({x:player.x,y:player.y,phi,len:KB.kbCrescent.len,back:true,hit:e=>{kHit(e,kLv(KB.kbCrescent.dmg,'kbCrescent'),'kbCrescent');kPow(e,false,KIC.moon);}}));
    if(kL('kbHalf'))addFx(new KiShot({x:player.x,y:player.y,phi:phi+Math.PI,len:KB.kbCrescent.len*.8,back:true,hit:e=>kHit(e,kLv(KB.kbHalf.dmg,'kbHalf'),'kbHalf')}));}});}
function mkKbMirror(c){const [x,y]=kPt(c,KB.kbMirror.range);return kCast({key:'kbMirror',name:'Yata Mirror',phi:Math.atan2(y-player.y,x-player.x),glow:KIC.moon,f:()=>{KI.mirror={x,y,until:gameTime+KB.kbMirror.T};kFireBurst(x,y,30,KIC.moon);}});}
function mkKbCircle(c){const [x,y]=kPt(c,KB.kbCircle.range);return kCast({key:'kbCircle',name:'Lunar Circle',phi:Math.atan2(y-player.y,x-player.x),glow:KIC.moon2,f:()=>{KI.circle={x,y,until:gameTime+KB.kbCircle.T,dmg:kLv(KB.kbCircle.dmg,'kbCircle')};}});}
function mkKbStar(c){const t=kTgt(c,KB.kbStar.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const n=kL('kcShower')?KB.kcShower.n:KB.kbStar.n,m=kLv(KB.kbStar.dmg,'kbStar');
  return kCast({key:'kbStar',name:'Starfall',phi:angTo(t),glow:KIC.moon,f:()=>{for(let i=0;i<n;i++)setFxTimer(.15*i,()=>{const e=!t.dead?t:nearestEnemy(t.x,t.y,200);if(!e)return;addFx(new KiPillar({x:e.x,y:e.y,w:12,col:'#fff2b0',life:.25}));kHit(e,m,'kbStar');
    if(kL('kbShooting')){const q=enemies.filter(z=>!z.dead&&z!==e&&dist(z,e)<180).sort((a,b)=>dist(a,e)-dist(b,e))[0];if(q){addFx(new KiBeam({x:e.x,y:e.y,phi:angTo.call?Math.atan2(q.y-e.y,q.x-e.x):0,L:dist(e,q),col:'#fff2b0',w:4,life:.18}));kHit(q,KB.kbShooting.dmg,'kbShooting');}}});}});}
function mkKbMoonlight(c){return kCast({key:'kbMoonlight',name:'Moonlight Form',speed:3,glow:KIC.moon,f:()=>{addBuff('kbMoonlight',KB.kbMoonlight.T);}});}
function mkKbNight(c){return kCast({key:'kbNight',name:"Tsukuyomi's Night",speed:1.4,glow:KIC.moon,f:()=>{KI.night={until:gameTime+KB.kbNight.T,tk:.8,dmg:kLv(KB.kbNight.dmg,'kbNight'),rise:kL('kbMoonrise')>0};skyDarkT=.8;addFx(new DText({x:player.x,y:player.y,z:110,text:"TSUKUYOMI'S NIGHT",color:KIC.moon,size:15,life:1.1}));}});}

/* ---------- C ---------- */
function mkKcWheel(c){const t=kTgt(c,KB.kcWheel.range),phi=kPhi(c,t);return kCast({key:'kcWheel',name:'Fox Fire Wheel',phi,f:a=>{addFx(new KiShot({x:player.x,y:player.y,phi,len:KB.kcWheel.len,speed:460,w:26,kind:'wheel',col:KIC.fire,hit:e=>{kHit(e,KB.kcWheel.dmg,'kcWheel',{big:true});kOnce(a,2);kPow(e,true);}}));}});}
function mkKcDisc(c){const t=kTgt(c,KB.kcDisc.range),phi=kPhi(c,t);return kCast({key:'kcDisc',name:'Full Moon Disc',phi,glow:KIC.moon,f:()=>{addFx(new KiShot({x:player.x,y:player.y,phi,len:KB.kcDisc.len,speed:520,w:30,kind:'disc',col:KIC.moon,hit:e=>{kHit(e,KB.kcDisc.dmg,'kcDisc',{big:true});applyCC(e,{slow:KB.kcDisc.slow});e.kSlowT=gameTime+KB.kcDisc.slow;kPow(e,true,KIC.moon);}}));}});}
function mkKcGrace(c){return kCast({key:'kcGrace',name:"Inari's Grace",glow:KIC.gold,f:()=>{addBuff('kcGrace',KB.kcGrace.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:6,color:KIC.gold,life:.45}));}});}
function mkKcAwaken(c){return kCast({key:'kcAwaken',name:'Nine-Tail Awakening',speed:1.4,f:()=>{addBuff('kcAwaken',KB.kcAwaken.T);kTail(1);kFireBurst(player.x,player.y,130);addFx(new DText({x:player.x,y:player.y,z:116,text:'NINE-TAIL AWAKENING',color:KIC.fire,size:15,life:1.1}));shake(3);}});}
function mkKcTamamo(c){const [x,y]=kPt(c,KB.kcTamamo.range);return kCast({key:'kcTamamo',name:"Tamamo's Sun",speed:1.4,phi:Math.atan2(y-player.y,x-player.x),f:()=>{const n=kSpendTails(),m=KB.kcTamamo.dmg+KB.kcTamamo.per*n;skyDarkT=.5;
  setFxTimer(.35,()=>{addFx(new KiPillar({x,y,w:110,col:KIC.fire,life:.6}));for(const e of kNear(x,y,KB.kcTamamo.R))kHit(e,m,'kcTamamo',{big:true});kFireBurst(x,y,KB.kcTamamo.R);shake(4);stop(80);});}});}
function mkKcTsukuyomi(c){const t=kTgt(c,KB.kcTsukuyomi.range),phi=kPhi(c,t);return kCast({key:'kcTsukuyomi',name:'Tsukuyomi Descends',speed:1.4,phi,glow:KIC.moon,f:()=>{kBeamLine(player.x,player.y,phi,KB.kcTsukuyomi.len,KB.kcTsukuyomi.w,KB.kcTsukuyomi.dmg,'kcTsukuyomi',{big:true});shake(3);stop(60);}});}

const KI_MAKE={knStep:mkKnStep,knWard:mkKnWard,knBless:mkKnBless,knTorii:mkKnTorii,
  kaOrb:mkKaOrb,kaPillar:mkKaPillar,kaLantern:mkKaLantern,kaRain:mkKaRain,kaBurst:mkKaBurst,kaVeil:mkKaVeil,kaInferno:mkKaInferno,
  kbBeam:mkKbBeam,kbCrescent:mkKbCrescent,kbMirror:mkKbMirror,kbCircle:mkKbCircle,kbStar:mkKbStar,kbMoonlight:mkKbMoonlight,kbNight:mkKbNight,
  kcWheel:mkKcWheel,kcDisc:mkKcDisc,kcGrace:mkKcGrace,kcAwaken:mkKcAwaken,kcTamamo:mkKcTamamo,kcTsukuyomi:mkKcTsukuyomi};
const KI_ZIGZAG=[['kaOrb','kaPillar'],['kbBeam','kbCrescent']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function kitsuneAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['kcGrace','knBless','knWard'])if(ready(k)&&!hasBuff(k))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=kNear(player.x,player.y,240);
  if(d<70&&near.length>=2){for(const k of ['knStep','kaLantern','kbMoonlight','kaVeil'])if(ready(k))return cast(k);}
  if(ready('kcAwaken')&&!kAwake()&&d<300)return cast('kcAwaken');if(ready('knTorii')&&!KI.torii&&d<320)return cast('knTorii');
  /* pick the branch with more levels */
  const lvA=['kaOrb','kaPillar','kaRain','kaBurst','kaInferno'].reduce((s,k)=>s+kL(k),0),lvB=['kbBeam','kbCrescent','kbCircle','kbStar','kbNight'].reduce((s,k)=>s+kL(k),0),useB=window.__KI_BR==='B'||(window.__KI_BR!=='A'&&lvB>lvA&&window.__BENCH_AVOID!=='B');
  if((t.boss||near.length>=3)&&ready(useB?'kbNight':'kaInferno'))return cast(useB?'kbNight':'kaInferno');
  if(useB){if(ready('kbMirror')&&!KI.mirror)return cast('kbMirror');for(const k of ['kcTsukuyomi','kcDisc','kbCircle','kbStar','kbCrescent','kbBeam'])if(ready(k)&&!(k==='kbCircle'&&KI.circle)&&d<=(SKILLS[k].range||300)+t.r)return cast(k);return false;}
  if(KI.tails>=6){for(const k of ['kcTamamo'])if(ready(k))return cast(k);if(ready('kaBurst')&&near.length>=2&&d<KB.kaBurst.R)return cast('kaBurst');}
  for(const k of ['kcWheel','kaRain','kaPillar','kaOrb'])if(ready(k)&&d<=(SKILLS[k].range||300)+t.r)return cast(k);
  return false;}

function installKitsune(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  for(const d of KI_DEFS){const b=KB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:kIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'nine_tailed_kitsune'};
    if(b.mp!=null){const mp=b.mp,isA=d.br==='A'||d.col==='A';Object.defineProperty(sk,'mp',{get(){return isA&&(KI.freeNext||hasBuff('kaCelestial'))?0:mp;},enumerable:true,configurable:true});}
    if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(KI_MAKE[d.key]){const mk=KI_MAKE[d.key],isA=d.br==='A'||d.col==='A';sk.make=function(c){const a=mk.apply(this,arguments);if(a&&isA&&KI.freeNext)setFxTimer(.02,()=>{KI.freeNext=false;});return a;};}
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${KI_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of KI_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* pure magic: every skill is TAL */
  const m={};for(const d of KI_DEFS)m[d.key]='m';Object.assign(SK_DT,m,{basic:'m'});
  Object.assign(SK_CC,{kaPillar:{flinch:.35},kaBurst:{flinch:.5},kaInferno:{flinch:.3},kaLantern:{flinch:.3},kcTamamo:{air:1},kcWheel:{flinch:.4},
    kbCrescent:{flinch:.2},kbStar:{flinch:.2},kbNight:{flinch:.2},kbMoonrise:{air:1},kcDisc:{flinch:.4},kcTsukuyomi:{flinch:.5},kcChime:{flinch:.3}});
  Object.assign(SK_KO,{basic:.8,kaOrb:.6,kaPillar:1.8,kaTwin:1.2,kaRain:.5,kaBurst:2.6,kaInferno:1.4,kaLantern:1.2,kcTamamo:4,kcWheel:2,kcMeteor:2.2,
    kbBeam:1,kbCrescent:1,kbMirror:.6,kbCircle:.5,kbStar:.7,kbNight:1,kbMoonrise:3,kcDisc:2.4,kcTsukuyomi:3.6,kcChime:1.6,knBell:.8});
  TABS.length=0;TABS.push({n:'Foxfire',keys:['kaOrb','kaPillar','kaLantern','kaRain','kaBurst','kaVeil','kaInferno','knStep','knWard','knTorii']},
    {n:'Moon',keys:['kbBeam','kbCrescent','kbMirror','kbCircle','kbStar','kbMoonlight','kbNight','knStep','knWard','knTorii']},
    {n:'Inari',keys:['kcWheel','kcDisc','kcGrace','kcAwaken','kcTamamo','kcTsukuyomi','knBless']});
  Object.assign(BUFFDEF,{kaVeil:{n:'Foxfire Veil',c:KIC.fire,i:'VEIL'},kaCelestial:{n:'Celestial Fox',c:KIC.fire2,i:'FOX'},kbMoonlight:{n:'Moonlight Form',c:KIC.moon,i:'MOON'},kcGrace:{n:"Inari's Grace",c:KIC.gold,i:'GRACE'},kcAwaken:{n:'Nine-Tail Awakening',c:KIC.fire,i:'NINE'}});
  JOB.name='Shrine Apprentice';JOB.hpA=1.15;JOB.hpB=4.2;JOB.spB=4.2;
  ITEMS.inariStaff={n:'Inari Shrine Staff',slot:'rhand',two:1,kind:'Staff',atk:60,matk:180,wlv:3,aspd:156,ref:6,cards:2,w:80,b:{tal:2},size:{small:1,medium:1,large:1},d:'ไม้เท้าศาลเจ้าอินาริ TAL +2'};
  ITEMS.moonMirrorStaff={n:'Moon Mirror Staff',slot:'rhand',two:1,kind:'Staff',atk:60,matk:200,wlv:4,aspd:154,ref:4,cards:1,w:90,b:{int:3},size:{small:1,medium:1,large:1},d:'ไม้เท้ากระจกจันทรา INT +3'};
  EQ.rhand='inariStaff';INV.length=0;INV.push('moonMirrorStaff','vikinghelm','ringPrec','clipLuck');
  /* flat TAL bonuses */
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null)),col=kCol(k);let b=0;
    if(KI.torii&&Math.hypot(player.x-KI.torii.x,player.y-KI.torii.y)<KB.knTorii.R)b+=kLv(KB.knTorii.tal,'knTorii');
    if(hasBuff('kcGrace'))b+=KB.kcGrace.tal;
    if(col==='A'&&kL('kaWisdom'))b+=KI.tails*kLv(KB.kaWisdom.tal,'kaWisdom');
    if(col==='B'&&kL('kbGrace')&&e&&e.kSlowT>gameTime)b+=kLv(KB.kbGrace.tal,'kbGrace');
    if(kAwake()&&o&&o.auto)b+=KB.kcAwaken.tal;
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,D.mag);return (base+flat(e,o))/base;};
  window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{if(hasBuff('kbMoonlight'))return 0;
    if(kL('knFluff'))d=Math.max(1,d-kLv(KB.knFluff.block,'knFluff'));
    if(KI.shield>0&&KI.shieldUntil>gameTime){const a=Math.min(KI.shield,d);KI.shield-=a;d-=a;if(d<=0)return 0;}
    return d;};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>hasBuff('kbMoonlight')?.45:1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.kitsuneAutoTick=kitsuneAutoTick;
  mkBasic=mkKiBasic;kEnsure();
  try{document.title='Aetherfall — Nine-Tailed Kitsune';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Nine-Tailed Kitsune';if(cl)cl.textContent='Shrine Apprentice';}catch(e){}
  window.KI=KI;window.KI_DEFS=KI_DEFS;window.KI_BAL=KI_BAL;}

/* =====================================================================
   7. ICONS (painted if present in assets/icons/kitsune, code SVG fallback)
   ===================================================================== */
function kIconSpec(d){const col=d.br==='A'?'#ffc0e0':d.br==='B'?'#d8e4ff':d.br==='C'?'#ffe9a8':'#fff2c8',bg=d.br==='A'?'#3a1020':d.br==='B'?'#141a3a':d.br==='C'?'#2a2214':'#2a1a1a';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const flame=`<path d="M22 38 C12 34 12 24 18 18 C18 24 22 24 22 18 C22 12 26 8 28 6 C28 14 34 18 32 28 C31 34 27 38 22 38Z" fill="${col}" stroke="#6a1030" stroke-width="1.2"/>`;
  const moon=`<path d="M28 8 A14 14 0 1 0 34 32 A11 11 0 1 1 28 8Z" fill="${col}" stroke="#2a2a6a" stroke-width="1.2"/>`;
  const torii=`<path d="M8 14 H36 M10 19 H34 M14 14 V36 M30 14 V36" stroke="#ff5a5a" stroke-width="3.5" fill="none"/>`;
  const g=d.br==='A'||d.col==='A'?flame:d.br==='B'||d.col==='B'?moon:torii;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/kitsune/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
