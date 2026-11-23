/* =====================================================================
   TOTEM LEGEND — FORGEBORN DRAKE (Greek) — 12 Tails style
   Character module. Loaded only when the drake is played (?char=drake); index.html calls installDrake().
   Design + numbers: DRAKE_SKILLS_TH.md (owner 2026-11-23: design 15:47 · burly stone dragon 16:14 · 'ทำสกิลของมังกรเลย' 16:36)

     Basic · Forgeborn Hatchling — forge-blade cuts (fire, fire, fire … then stone), Bellows Breath, Stone Skin, Quenching Plunge,
             Cyclops Apprentice, Molten Core, Dragon Roar
     A · Etna's Magma Blade (physical, ATK) — HEAT then QUENCH = a LAVA BURST · Heart of Etna = the Magma Drake form
     B · Stone Oracle of Delphi (magic, MATK) — HEAT then QUENCH = the enemy turns to STONE (bosses: slow + KO drain) · Heart of Gaia = the Mountain Drake
     C · Primordial Dragon — 12 nodes (lit on the Totem Roots)

   Core loop: fire hits put HEAT 1–3 on an enemy (it burns level × 0.4 a stack each second); stone hits QUENCH it (steam) →
   branch A: lava burst · branch B: statue · Basic skills: by the higher of ATK / MATK. Fighting fills DRAGON BLOOD 0–100;
   full → the branch's Heart turns the hero into that branch's dragon: every A / B button becomes the dragon move of the same skill
   (same level, same gems), the ultimate becomes the finisher that ends the form.
   Two-way hero: A = ATK, B = MATK, Basic = the higher, normal attack = ATK. No percent effects (flat numbers / counters).
   Placeholder art: the wolf sprite (warm tint) for the hero; the dragon forms are monster sheets drawn through MSPR_DRAW
   (Glacier Wyrmling re-tinted to lava = Magma Drake, Rock Lizard re-tinted to marble = Mountain Drake) until their own art exists.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const ZD_BAL={
  heat:{cap:3,white:4,life:6,burn:.4},             // stacks · seconds · burn = level × .4 per stack per second
  lava:{per:.5,R:70},                              // A quench: ATK × .5 per stack round the target
  stone:{per:.6,imm:3,weak:.3},                    // B quench: .6 s of stone per stack, then 3 s immune; quench while immune = MATK × .3 per stack
  boss:{slow:2,ko:5,crack:4},                      // bosses / mini-bosses / boss parts: slow + heavy KO drain + 'cracked' 4 s
  blood:{need:100,heavy:120,rapid:70,cap:120,basic:1,skill:2,skillCap:4,q:3,qCap:6,taken:1,takenCap:4,skin:2,skinCap:6,kill:2,idle:10,idleDrain:2,lock:8,drain:5,refA:1,refACap:2,refB:2,refBCap:4},
  form:{max:[16,19,22,25],invul:.8,rapidCut:6,A:{size:1.35,shield:6},B:{size:1.6,shield:8,slow:40}},
  sk:{
    // ---- Basic
    znHammer:{chain:[2,3,3,4],hit:1.0,last:1.2},
    znBreath:{dmg:[.75,.9,1.05,1.2],r:[110,120,130,140],half:.55,heat:2,cd:6,mp:10,range:140},
    znSkin:{T:5,block:[10,20,30],cd:18,mp:12},
    znLeap:{dist:[180,210,240],dmg:[1.0,1.2,1.4],R:80,cd:10,mp:12},
    znCyclops:{heal:[.2,.4,.6,.8]},
    znCore:{life:[.7,1.4,2],burn:[.07,.14,.2]},
    znRoar:{R:160,range:170,flinch:[.5,.75,1],blood:15,cd:24,mp:16},
    // ---- A · Etna's Magma Blade
    zaHeart:{dmg:[1.4,1.67,1.93,2.2],R:140},
    zaSear:{dmg:[.85,1.0,1.15,1.3],dd:[.65,.77,.88,1.0],cd:5,mp:9,range:90},
    zaBurst:{per:[.6,.7,.8],R:[80,90,100]},
    zaQuake:{dmg:[1.4,1.7],R:120,range:130,dd:[1.9,2.3],dR:150,dRange:260,cd:9,mp:14},
    zaAfter:{dmg:[.7,1.0],R:180,delay:.6},
    zaRush:{dmg:[1.2,1.5],len:200,dd:[1.5,1.9],dlen:260,w:34,cd:8,mp:12,range:200},
    zaCinder:{dmg:.3,T:3,tick:.5,w:30},
    zaAnvil:{dmg:[1.9,2.4],dd:[1.6,2.0],dR:130,cd:10,mp:14,range:90},
    zaCrack:{def:.25,T:6},
    zaGeyser:{dmg:[.8,1.0],n:3,R:90,gap:.35,dd:[.5,.6],dT:1.2,dTick:.2,dR:180,cd:11,mp:16,range:320},
    zaPool:{dmg:.35,T:4,R:80,tick:.5},
    zaFury:{atk:[4,8,12],R:220,max:5},
    zaGuard:{T:1,dmg:2.4,R:70,blood:10,dT:3,dn:2,cd:14,mp:12},
    zaUlt:{n:10,R:220,dmg:[1.0,1.3],gap:.1,blood:40,dn:12,ddmg:[1.1,1.4],dfin:[3.0,4.0],dR:160,cd:60,mp:50},
    zaHeir:{ext:8,drain:4},
    // ---- B · Stone Oracle of Delphi
    zbHeart:{dmg:[1.2,1.4,1.6,1.8],R:170},
    zbSpike:{dmg:[.8,.92,1.04,1.15],dd:[.6,.7,.8,.9],dR:200,half:.7,cd:4,mp:10,range:300},
    zbMark:{per:[.67,.73,.8],flat:[.33,.67,1]},
    zbVent:{dmg:[.4,.5],R:110,T:5,tick:1,dd:[.5,.6],dR:120,cd:9,mp:14,range:300},
    zbTrance:{need:2,stun:.5},
    zbChain:{dmg:[1.1,1.4],root:[1.2,1.5],dd:[1.2,1.5],stun:1.5,cd:10,mp:14,range:280},
    zbLink:{n:2,R:150},
    zbQuake:{dmg:[1.3,1.6],R:140,range:150,dd:[1.55,1.9],dR:200,cd:12,mp:18},
    zbFault:{dmg:1.0,len:260,w:32},
    zbMono:{dmg:[1.6,2.0],R:120,T:6,taunt:160,dd:[1.9,2.4],dR:140,dT:4,cd:14,mp:18,range:300},
    zbOracle:{dmg:.35,R:220},
    zbGaia:{matk:[4,8,12],R:260,max:5},
    zbAegis:{lv:5,vit:3,T:6,R:120,cd:18,mp:14},
    zbUlt:{waves:3,dmg:[.9,1.2],R:240,stat:2,blood:40,dd:[1.9,2.4],dspk:[1.2,1.5],cd:60,mp:50},
    zbProph:{ext:8,T:6},
    // ---- C · Primordial Dragon
    zxSmith:{R:90},
    zxWhite:{},
    zxStare:{R:150},
    zxLiving:{dmg:1.2,R:110},
    zxComet:{dmg:2.0,back:1.2,len:320,w:36,cd:18,mp:20,range:320},
    zxVeil:{dmg:.4,R:150,range:160,T:5,tick:.5,need:2,cd:22,mp:22},
    zxWind:{heal:4,start:25},
    zxPlate:{vit:2},
    zxGarden:{dmg:1.0,R:100},
    zxAscend:{T:15,ext:10,size:1.15,cd:90,mp:40},
    zxTyphon:{dmg:3.0,n:3,cd:50,mp:40,range:100},
    zxEmbrace:{dmg:.8,R:160,T:3,tick:.5,cd:50,mp:40,range:320}
  }
};
const ZB=ZD_BAL.sk;
const zdN=n=>(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const zdX=n=>'ATK×'+zdN(n),zdM=n=>'MATK×'+zdN(n);

/* ---------------------------------------------------------------------
   2. SKILL DATA  (dn = the dragon move on the same button)
   --------------------------------------------------------------------- */
const ZD_DEFS=[
 // ---------------- BASIC · FORGEBORN HATCHLING ----------------
 {key:'znHammer',id:'ZD-B01',name:'Forge Blade',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) ฟันดาบเตาหลอมต่อเนื่อง จังหวะแรก ๆ เป็นไฟ ติดความร้อน 1 · จังหวะสุดท้ายเป็นหิน ชุบความร้อนออก · ร่างมังกรใช้ตีปกติของมังกรแทน (อัปสลับกับ Bellows Breath)',lv:i=>[`ต่อ ${ZB.znHammer.chain[i-1]} จังหวะ (ไฟ ×${ZB.znHammer.chain[i-1]-1} แล้วหิน)`,`${zdX(ZB.znHammer.hit)} ต่อจังหวะ · จังหวะหิน ${zdX(ZB.znHammer.last)}`]},
 {key:'znBreath',id:'ZD-B02',name:'Bellows Breath',br:'basic',row:1,max:4,type:'melee',d:'พ่นไฟจากเครื่องเป่าเตาเป็นกรวยสั้นด้านหน้า ทุกตัวในกรวยติดความร้อน 2 · ร่างมังกร กรวยยาว ×1.5 (อัปสลับกับ Forge Blade)',lv:i=>[`${zdX(ZB.znBreath.dmg[i-1])} กรวย ${ZB.znBreath.r[i-1]}`,'ความร้อน +2',`Cooldown ${ZB.znBreath.cd} วิ`]},
 {key:'znSkin',id:'ZD-B03',name:'Stone Skin',br:'basic',row:2,max:3,type:'self',d:'เกล็ดกลายเป็นหินอ่อน ดาเมจที่ได้รับลดลง โดนตีได้เลือดมังกร +2 แทน +1 (สูงสุด +6 ต่อวิ)',lv:i=>[`ดาเมจที่ได้รับ −${ZB.znSkin.block[i-1]} ต่อครั้ง นาน ${ZB.znSkin.T} วิ`,`Cooldown ${ZB.znSkin.cd} วิ`]},
 {key:'znLeap',id:'ZD-B04',name:'Quenching Plunge',br:'basic',row:2,max:3,type:'ground',radius:()=>ZB.znLeap.R,d:'กระโดดปักดาบลงจุดที่เลือก ชุบความร้อนของทุกตัวในวง · ร่างมังกร กระโจนด้วยร่างมังกร วงกว้างขึ้น',lv:i=>[`ระยะ ${ZB.znLeap.dist[i-1]}`,`${zdX(ZB.znLeap.dmg[i-1])} รัศมี ${ZB.znLeap.R}`,`Cooldown ${ZB.znLeap.cd} วิ`]},
 {key:'znCyclops',id:'ZD-B05',name:'Cyclops Apprentice',br:'basic',row:3,max:4,passive:1,d:'(Passive) ศิษย์ไซคลอปส์ช่างตีเหล็ก ชุบได้แต่ละครั้งฟื้น HP (ไม่เกิน 1 ครั้งต่อวิ)',lv:i=>[`ฟื้น HP = เลเวล × ${ZB.znCyclops.heal[i-1]}`]},
 {key:'znCore',id:'ZD-B06',name:'Molten Core',br:'basic',row:3,max:3,passive:1,d:'(Passive) ความร้อนบนศัตรูอยู่นานขึ้นและไหม้แรงขึ้น',lv:i=>[`ความร้อนอยู่ ${zdN(ZD_BAL.heat.life+ZB.znCore.life[i-1])} วิ`,`ไหม้ + เลเวล × ${ZB.znCore.burn[i-1]} ต่อขั้นต่อวิ`]},
 {key:'znRoar',id:'ZD-B07',name:'Dragon Roar',br:'basic',row:4,max:3,type:'self',d:'คำรามเลือดมังกร ศัตรูรอบตัวชะงัก (บอสไม่ติด) เลือดมังกร +15 · ร่างมังกร: ร่างอยู่นานขึ้น 3 วิแทน (ไม่เกินนานสุด)',lv:i=>[`ชะงัก ${ZB.znRoar.flinch[i-1]} วิ รัศมี ${ZB.znRoar.R}`,`เลือดมังกร +${ZB.znRoar.blood}`,`Cooldown ${ZB.znRoar.cd} วิ`]},
 // ---------------- A · ETNA'S MAGMA BLADE ----------------
 {key:'zaHeart',id:'ZD-A01',name:'Heart of Etna',br:'A',row:1,max:4,type:'self',dn:'Heart of Etna · คืนร่าง',d:'แปลงร่างเป็นมังกรลาวาเอตนา (ใช้เลือดมังกร 100) ภูเขาไฟเล็กระเบิดรอบตัว ทุกตัวร้อน 2 แล้วชุบ · ร่างมังกร: ปุ่มสกิลสาย A กลายเป็นท่ามังกร ตัวใหญ่ ไม่ติดชะงัก มีโล่ · กดซ้ำ = คืนร่าง (อัปสลับกับ Searing Blade)',lv:i=>[`ระเบิด ${zdX(ZB.zaHeart.dmg[i-1])} รัศมี ${ZB.zaHeart.R}`,`โล่มังกร = เลเวล × ${ZD_BAL.form.A.shield} · นานสุด ${ZD_BAL.form.max[i-1]} วิ`]},
 {key:'zaSear',id:'ZD-A02',name:'Searing Blade',br:'A',row:1,max:4,type:'melee',dn:'Molten Maul',d:'ฟันดาบร้อน 2 ครั้ง ครั้งแรกไฟ ร้อน 2 · ครั้งที่สองหิน ชุบ · ร่างมังกร Molten Maul ตะปบซ้าย–ขวา (ไฟ) แล้วกัด (หิน)',lv:i=>[`${zdX(ZB.zaSear.dmg[i-1])} × 2`,`มังกร ${zdX(ZB.zaSear.dd[i-1])} × 3`,`Cooldown ${ZB.zaSear.cd} วิ`]},
 {key:'zaBurst',id:'ZD-A03',name:'Magma Burst',br:'A',row:2,max:3,passive:1,d:'(Passive) ระเบิดลาวาตอนชุบแรงขึ้นและกว้างขึ้น',lv:i=>[`ต่อขั้นความร้อน ${zdX(ZB.zaBurst.per[i-1])} รัศมี ${ZB.zaBurst.R[i-1]}`]},
 {key:'zaQuake',id:'ZD-A04',name:'Forge Quake',br:'A',row:3,max:2,type:'self',dn:'Volcano Dive',d:'ปักดาบกระแทกพื้นรอบตัว ชุบความร้อนทุกตัวในวง · ร่างมังกร Volcano Dive กระพือปีกขึ้นฟ้าแล้วดิ่งลงใส่เป้า ร้อน 1 แล้วชุบทั้งวง',lv:i=>[`${zdX(ZB.zaQuake.dmg[i-1])} รัศมี ${ZB.zaQuake.R}`,`มังกร ${zdX(ZB.zaQuake.dd[i-1])} รัศมี ${ZB.zaQuake.dR}`,`Cooldown ${ZB.zaQuake.cd} วิ`]},
 {key:'zaAfter',id:'ZD-A05',name:'Aftershock',br:'A',row:3,max:2,passive:1,enh:'zaQuake',pre:[['zaQuake',1]],d:'(ต่อยอด Forge Quake) 0.6 วิต่อมาพื้นแตกวงที่สองใหญ่กว่า ติดความร้อน 1',lv:i=>[`${zdX(ZB.zaAfter.dmg[i-1])} รัศมี ${ZB.zaAfter.R}`]},
 {key:'zaRush',id:'ZD-A06',name:'Bellows Rush',br:'A',row:4,max:2,type:'melee',dn:'Inferno Charge',d:'พุ่งด้วยแรงลมเป่าเตาทะลุศัตรู ทุกตัวในแนวร้อน 1 · ร่างมังกร Inferno Charge พุ่งเอาเขาชนไกลขึ้น ร้อน 2 (ไม่ผลักบอส)',lv:i=>[`${zdX(ZB.zaRush.dmg[i-1])} ไกล ${ZB.zaRush.len}`,`มังกร ${zdX(ZB.zaRush.dd[i-1])} ไกล ${ZB.zaRush.dlen}`,`Cooldown ${ZB.zaRush.cd} วิ`]},
 {key:'zaCinder',id:'ZD-A07',name:'Cinder Path',br:'A',row:4,max:1,passive:1,enh:'zaRush',pre:[['zaRush',1]],d:'(ต่อยอด Bellows Rush) รอยไฟค้างพื้น 3 วิ ศัตรูที่เหยียบร้อน 1 ทุก 1 วิ',lv:()=>[`${zdX(ZB.zaCinder.dmg)} ทุก ${ZB.zaCinder.tick} วิ`]},
 {key:'zaAnvil',id:'ZD-A08',name:'Anvil Cleaver',br:'A',row:5,max:2,type:'melee',dn:'Tail Hammer',d:'ฟันผ่าเป้าเดียวสุดแรง ชุบโดยนับความร้อนเป็น 2 เท่า · ร่างมังกร Tail Hammer หมุนตัวฟาดหางกระบองรอบตัว ชุบ ×2 ทุกตัว',lv:i=>[`${zdX(ZB.zaAnvil.dmg[i-1])}`,`มังกร ${zdX(ZB.zaAnvil.dd[i-1])} รัศมี ${ZB.zaAnvil.dR}`,`Cooldown ${ZB.zaAnvil.cd} วิ`]},
 {key:'zaCrack',id:'ZD-A09',name:'Cracked Plate',br:'A',row:5,max:1,passive:1,enh:'zaAnvil',pre:[['zaAnvil',1]],d:'(ต่อยอด Anvil Cleaver) เป้าที่ถูกชุบตั้งแต่ 2 ขั้น เกราะร้าว DEF ลด 6 วิ',lv:()=>['DEF − เลเวล ÷ 4']},
 {key:'zaGeyser',id:'ZD-A10',name:'Lava Geyser',br:'A',row:6,max:2,type:'ground',radius:()=>ZB.zaGeyser.R,dn:'Magma Breath',d:'ลาวาพุ่งจากพื้น 3 ครั้งที่จุดที่เลือก ร้อน 1 ต่อครั้ง · ร่างมังกร Magma Breath พ่นลาวาเป็นกรวยหน้า 1.2 วิ ร้อนครบทุกตัว',lv:i=>[`${zdX(ZB.zaGeyser.dmg[i-1])} × ${ZB.zaGeyser.n} รัศมี ${ZB.zaGeyser.R}`,`มังกร ${zdX(ZB.zaGeyser.dd[i-1])} ทุก ${ZB.zaGeyser.dTick} วิ กรวย ${ZB.zaGeyser.dR}`,`Cooldown ${ZB.zaGeyser.cd} วิ`]},
 {key:'zaPool',id:'ZD-A11',name:'Molten Pool',br:'A',row:6,max:1,passive:1,enh:'zaGeyser',pre:[['zaGeyser',1]],d:'(ต่อยอด Lava Geyser / Magma Breath) เหลือบ่อลาวา 4 วิ',lv:()=>[`${zdX(ZB.zaPool.dmg)} ทุก ${ZB.zaPool.tick} วิ · ร้อน 1 ทุก 1 วิ`]},
 {key:'zaFury',id:'ZD-A12',name:'Forge Fury',br:'A',row:7,max:3,passive:1,d:'(Passive) ทุกศัตรูที่ติดความร้อนรอบตัว 220 ATK เพิ่ม (สูงสุด 5 ตัว)',lv:i=>[`ATK +${ZB.zaFury.atk[i-1]} ต่อตัว`]},
 {key:'zaGuard',id:'ZD-A13',name:'Obsidian Guard',br:'A',row:7,max:1,type:'self',dn:'Obsidian Hide',d:'ยกดาบรับ 1 วิ โดนตีประชิด = กันได้ทั้งหมด สวนด้วยระเบิดลาวา + เลือดมังกร +10 · ร่างมังกร Obsidian Hide เกล็ดออบซิเดียนกันได้ 2 ครั้งใน 3 วิ',lv:()=>[`สวน ${zdX(ZB.zaGuard.dmg)} รัศมี ${ZB.zaGuard.R}`,`Cooldown ${ZB.zaGuard.cd} วิ`]},
 {key:'zaUlt',id:'ZD-A14',name:'Etna Erupts',br:'A',row:8,max:2,type:'self',ult:1,dn:'Cataclysm',d:'ULTIMATE A · ปักดาบลงพื้นจนภูเขาไฟเล็กโผล่ พ่นลาวา 10 ลูกรอบตัว แล้วทุกตัวร้อนเต็มและชุบพร้อมกัน + เลือดมังกร +40 · ร่างมังกร Cataclysm (ท่าปิดฉาก) บินขึ้น ฝนอุกกาบาตลาวา 12 ลูก ดิ่งลงกลางวง ชุบ ×2 แล้วคืนร่าง',lv:i=>[`${zdX(ZB.zaUlt.dmg[i-1])} × ${ZB.zaUlt.n} รัศมี ${ZB.zaUlt.R}`,`มังกร ${zdX(ZB.zaUlt.ddmg[i-1])} × ${ZB.zaUlt.dn} + ${zdX(ZB.zaUlt.dfin[i-1])}`,`Cooldown ${ZB.zaUlt.cd} วิ`]},
 {key:'zaHeir',id:'ZD-A15',name:'Heir of Typhon',br:'A',row:8,max:1,passive:1,enh:'zaUlt',pre:[['zaUlt',1]],d:'(ต่อยอด Etna Erupts) เลือดไทฟอนในตัวตื่น ร่างมังกรลาวาอยู่นานขึ้น',lv:()=>[`นานสุด +${ZB.zaHeir.ext} วิ · เลือดมังกรลด ${ZB.zaHeir.drain} ต่อวิ (แทน 5)`]},
 // ---------------- B · STONE ORACLE OF DELPHI ----------------
 {key:'zbHeart',id:'ZD-G01',name:'Heart of Gaia',br:'B',row:1,max:4,type:'self',dn:'Heart of Gaia · คืนร่าง',d:'แปลงร่างเป็นมังกรภูผาแห่งไกอา (ใช้เลือดมังกร 100) แผ่นดินรอบตัวยกตัว ไอร้อนพวย ทุกตัวร้อน 2 แล้วชุบ = เป็นหินทั้งวง · ร่างมังกร: ตัวใหญ่สุด ไม่ติดชะงัก ไม่โดนผลัก เดินช้าลง 40 มีโล่ · กดซ้ำ = คืนร่าง (อัปสลับกับ Stone Spike)',lv:i=>[`ระเบิด ${zdM(ZB.zbHeart.dmg[i-1])} รัศมี ${ZB.zbHeart.R}`,`โล่มังกร = เลเวล × ${ZD_BAL.form.B.shield} · นานสุด ${ZD_BAL.form.max[i-1]} วิ`]},
 {key:'zbSpike',id:'ZD-G02',name:'Stone Spike',br:'B',row:1,max:4,type:'melee',dn:'Petrifying Roar',d:'ไอร้อนพ่นใต้เป้า ร้อน 1 แล้วหนามหินแทงขึ้น ชุบ · ร่างมังกร Petrifying Roar คำรามเป็นกรวย ตาอำพันเรือง ทุกตัวในกรวยถูกชุบ',lv:i=>[`${zdM(ZB.zbSpike.dmg[i-1])} ระยะ ${ZB.zbSpike.range}`,`มังกร ${zdM(ZB.zbSpike.dd[i-1])} กรวย ${ZB.zbSpike.dR}`,`Cooldown ${ZB.zbSpike.cd} วิ`]},
 {key:'zbMark',id:'ZD-G03',name:"Gorgon's Mark",br:'B',row:2,max:3,passive:1,d:'(Passive) ศัตรูเป็นหินนานขึ้น และโดนเวทเราแรงขึ้นระหว่างเป็นหิน',lv:i=>[`เป็นหิน ${ZB.zbMark.per[i-1]} วิต่อขั้นความร้อน`,`MATK + เลเวล × ${ZB.zbMark.flat[i-1]} กับเป้าที่เป็นหิน`]},
 {key:'zbVent',id:'ZD-G04',name:'Vapour Vent',br:'B',row:3,max:2,type:'ground',radius:()=>ZB.zbVent.R,dn:'Fumarole Stomp',d:'เปิดรอยแยกพ่นไอร้อนแห่งเดลฟี 5 วิ ทุก 1 วิ ร้อน 1 + ดาเมจ · ร่างมังกร Fumarole Stomp กระทืบพื้น 3 ที ไอร้อนพวยรอบตัวตามไปทุกที่ 5 วิ',lv:i=>[`${zdM(ZB.zbVent.dmg[i-1])} ทุก 1 วิ รัศมี ${ZB.zbVent.R}`,`มังกร ${zdM(ZB.zbVent.dd[i-1])} × 3 รัศมี ${ZB.zbVent.dR}`,`Cooldown ${ZB.zbVent.cd} วิ`]},
 {key:'zbTrance',id:'ZD-G05',name:"Pythia's Trance",br:'B',row:3,max:1,passive:1,enh:'zbVent',pre:[['zbVent',1]],d:'(ต่อยอด Vapour Vent) ศัตรูที่ยืนในไอครบ 2 วิ มึน (บอสช้าลงแทน)',lv:()=>[`มึน ${ZB.zbTrance.stun} วิ ทุก ${ZB.zbTrance.need} วิ`]},
 {key:'zbChain',id:'ZD-G06',name:'Earth Chains',br:'B',row:4,max:2,type:'melee',dn:'Mountain Grip',d:'โซ่หินโผล่จากพื้นตรึงเป้าแล้วชุบ (บอสช้าลงแทน) · ร่างมังกร Mountain Grip คว้าเป้ายกขึ้นแล้วกระแทกลงพื้น 2 ครั้ง (บอสคว้าไม่ได้: ทุบแทน ลดเกจ KO หนัก)',lv:i=>[`ตรึง ${ZB.zbChain.root[i-1]} วิ · ${zdM(ZB.zbChain.dmg[i-1])}`,`มังกร ${zdM(ZB.zbChain.dd[i-1])} × 2 + มึน ${ZB.zbChain.stun} วิ`,`Cooldown ${ZB.zbChain.cd} วิ`]},
 {key:'zbLink',id:'ZD-G07',name:'Linked Fetters',br:'B',row:4,max:1,passive:1,enh:'zbChain',pre:[['zbChain',1]],d:'(ต่อยอด Earth Chains) โซ่แตกแขนงไปตรึงอีก 2 ตัวใกล้ ๆ',lv:()=>[`+${ZB.zbLink.n} ตัว ระยะ ${ZB.zbLink.R}`]},
 {key:'zbQuake',id:'ZD-G08',name:'Quake Ring',br:'B',row:5,max:2,type:'self',dn:'Mountain Quake',d:'กระแทกดาบลงพื้น แผ่นดินไหวรอบตัว ชุบทุกตัว · ร่างมังกร Mountain Quake กระโดดแล้วทิ้งตัวลงพื้น วงใหญ่กว่า',lv:i=>[`${zdM(ZB.zbQuake.dmg[i-1])} รัศมี ${ZB.zbQuake.R}`,`มังกร ${zdM(ZB.zbQuake.dd[i-1])} รัศมี ${ZB.zbQuake.dR}`,`Cooldown ${ZB.zbQuake.cd} วิ`]},
 {key:'zbFault',id:'ZD-G09',name:'Fault Line',br:'B',row:5,max:1,passive:1,enh:'zbQuake',pre:[['zbQuake',1]],d:'(ต่อยอด Quake Ring) แผ่นดินแยกเป็นแนวตรงไปข้างหน้าต่อ ชุบทุกตัวในแนว',lv:()=>[`${zdM(ZB.zbFault.dmg)} แนว ${ZB.zbFault.len}`]},
 {key:'zbMono',id:'ZD-G10',name:'Monolith',br:'B',row:6,max:2,type:'ground',radius:()=>ZB.zbMono.R,dn:'Boulder Toss',d:'เรียกแท่งหินพยากรณ์ขึ้นที่จุด 6 วิ มอนรอบ ๆ หันไปตีหิน (บอสไม่หลง) หมดเวลาระเบิดชุบรอบ · ร่างมังกร Boulder Toss ฉีกหินยักษ์ขว้างลงจุด ระเบิดชุบ แล้วหินค้างเป็นเป้าล่อ 4 วิ',lv:i=>[`ระเบิด ${zdM(ZB.zbMono.dmg[i-1])} รัศมี ${ZB.zbMono.R}`,`มังกร ${zdM(ZB.zbMono.dd[i-1])} รัศมี ${ZB.zbMono.dR}`,`Cooldown ${ZB.zbMono.cd} วิ`]},
 {key:'zbOracle',id:'ZD-G11',name:'Oracle Stone',br:'B',row:6,max:1,passive:1,enh:'zbMono',pre:[['zbMono',1]],d:'(ต่อยอด Monolith) แท่งหินพ่นไอใส่ตัวที่ใกล้ที่สุดทุก 1 วิ ร้อน 1',lv:()=>[`${zdM(ZB.zbOracle.dmg)} ระยะ ${ZB.zbOracle.R}`]},
 {key:'zbGaia',id:'ZD-G12',name:"Gaia's Favour",br:'B',row:7,max:3,passive:1,d:'(Passive) ทุกศัตรูที่เป็นหิน / ร้าวรอบตัว 260 MATK เพิ่ม (สูงสุด 5 ตัว)',lv:i=>[`MATK +${ZB.zbGaia.matk[i-1]} ต่อตัว`]},
 {key:'zbAegis',id:'ZD-G13',name:'Marble Aegis',br:'B',row:7,max:1,type:'self',dn:'Mountain Hide',d:'เกราะหินอ่อนดูดดาเมจ แตกหรือหมดเวลาแล้วชุบทุกตัวรอบตัว · ร่างมังกร Mountain Hide ผิวภูเขาดูดได้ 2 เท่า ศัตรูที่ตีเราประชิดถูกชุบ',lv:()=>[`ดูด เลเวล × ${ZB.zbAegis.lv} + VIT × ${ZB.zbAegis.vit} นาน ${ZB.zbAegis.T} วิ`,`Cooldown ${ZB.zbAegis.cd} วิ`]},
 {key:'zbUlt',id:'ZD-G14',name:"Gorgon's Eye",br:'B',row:8,max:2,type:'self',ult:1,dn:'Mountainfall',d:'ULTIMATE B · รอยแยกเดลฟีเปิดเป็นวง ไอร้อนพวย 3 ระลอก แล้วดวงตากอร์กอนบนฟ้าลืมตา ทุกตัวกลายเป็นรูปปั้นพร้อมกัน (ข้ามกันหิน) + เลือดมังกร +40 · ร่างมังกร Mountainfall (ท่าปิดฉาก) กระโดดสูงแล้วทิ้งตัวลงกลางวง หนามหินพุ่งทั่ว ชุบ ×2 แล้วคืนร่าง',lv:i=>[`${zdM(ZB.zbUlt.dmg[i-1])} × ${ZB.zbUlt.waves} + รูปปั้น ${ZB.zbUlt.stat} วิ รัศมี ${ZB.zbUlt.R}`,`มังกร ${zdM(ZB.zbUlt.dd[i-1])} + หนามหิน ${zdM(ZB.zbUlt.dspk[i-1])}`,`Cooldown ${ZB.zbUlt.cd} วิ`]},
 {key:'zbProph',id:'ZD-G15',name:"Oracle's Prophecy",br:'B',row:8,max:1,passive:1,enh:'zbUlt',pre:[['zbUlt',1]],d:"(ต่อยอด Gorgon's Eye) ร่างมังกรภูผาอยู่นานขึ้น · 6 วิหลังคืนร่าง ชุบทุกครั้งนับเต็ม 3 ขั้น",lv:()=>[`นานสุด +${ZB.zbProph.ext} วิ`]},
 // ---------------- C · PRIMORDIAL DRAGON (12 nodes, tied to the Basic / A / B skill) ----------------
 {key:'zxSmith',id:'ZD-C01',name:'Master Smith',br:'C',col:'basic',tier:1,passive:1,pre:[['znHammer',4]],d:'Forge Blade ต่อได้อีก 1 จังหวะ จังหวะหินชุบรอบตัว (ไม่ใช่แค่เป้า)',lv:()=>[`ไฟ ×4 แล้วหิน · ชุบรอบตัว ${ZB.zxSmith.R}`]},
 {key:'zxWhite',id:'ZD-C02',name:'White-Hot',br:'C',col:'A',tier:1,passive:1,pre:[['zaSear',4]],d:'ความร้อนบนศัตรูสูงสุด 4 ขั้น',lv:()=>['ความร้อนสูงสุด 4 · ระเบิดลาวาได้ถึง 4 ขั้นต่อการชุบ']},
 {key:'zxStare',id:'ZD-C03',name:'Basilisk Stare',br:'C',col:'B',tier:1,passive:1,pre:[['zbSpike',4]],d:'Stone Spike / Petrifying Roar แตกไปชุบอีก 1 ตัวที่ใกล้ที่สุด',lv:()=>[`+1 เป้า ระยะ ${ZB.zxStare.R}`]},
 {key:'zxLiving',id:'ZD-C04',name:'Living Stone',br:'C',col:'basic',tier:2,passive:1,pre:[['znSkin',3]],d:'ระหว่าง Stone Skin ศัตรูที่ตีเราประชิดร้อน 1 · หมดเวลาแล้วเกล็ดหินระเบิดชุบรอบตัว',lv:()=>[`ระเบิด ${zdX(ZB.zxLiving.dmg)} รัศมี ${ZB.zxLiving.R}`]},
 {key:'zxComet',id:'ZD-C05',name:'Molten Comet',br:'C',col:'A',tier:2,type:'melee',pre:[['zaAnvil',2]],d:'[New Active] ขว้างดาบลาวาหมุนเป็นดาวหางทะลุแนว ร้อน 2 ทุกตัว ดาบบินกลับชุบอีกรอบ · ร่างมังกร พ่นก้อนลาวาเป็นดาวหางแทน',lv:()=>[`${zdX(ZB.zxComet.dmg)} ไป + ${zdX(ZB.zxComet.back)} กลับ แนว ${ZB.zxComet.len}`,`Cooldown ${ZB.zxComet.cd} วิ`]},
 {key:'zxVeil',id:'ZD-C06',name:"Medusa's Veil",br:'C',col:'B',tier:2,type:'self',pre:[['zbVent',2]],d:'[New Active] ม่านไอหินรอบตัว 5 วิ ศัตรูในม่านร้อน 1 ทุก 1 วิและช้าลง อยู่ในม่านครบ 2 วิถูกชุบ',lv:()=>[`${zdM(ZB.zxVeil.dmg)} ทุก ${ZB.zxVeil.tick} วิ รัศมี ${ZB.zxVeil.R}`,`Cooldown ${ZB.zxVeil.cd} วิ`]},
 {key:'zxWind',id:'ZD-C07',name:"Dragon's Second Wind",br:'C',col:'basic',tier:3,passive:1,pre:[['znCyclops',4]],d:'คืนร่างแล้วฟื้น HP และเลือดมังกรเริ่มที่ 25 (ไม่ใช่ศูนย์)',lv:()=>[`ฟื้น HP = เลเวล × ${ZB.zxWind.heal} · เลือดมังกรเริ่ม ${ZB.zxWind.start}`]},
 {key:'zxPlate',id:'ZD-C08',name:'Lava Plate',br:'C',col:'A',tier:3,passive:1,pre:[['zaGuard',1]],d:'ร่างมังกรลาวา: ศัตรูที่ตีโดนเราร้อน 1 · โล่มังกรหนาขึ้น',lv:()=>[`โล่มังกร + VIT × ${ZB.zxPlate.vit}`]},
 {key:'zxGarden',id:'ZD-C09',name:'Petrified Garden',br:'C',col:'B',tier:3,passive:1,pre:[['zbMono',2]],d:'ศัตรูที่ตายตอนเป็นหิน แตกเป็นเศษหินกระเด็นชุบรอบ ๆ',lv:()=>[`${zdM(ZB.zxGarden.dmg)} รัศมี ${ZB.zxGarden.R}`]},
 {key:'zxAscend',id:'ZD-C10',name:'Primordial Ascension',br:'C',col:'basic',tier:4,type:'self',pre:[['znRoar',3]],d:'[New Active] Signature · ร่างคน: เลือดมังกรเต็มทันที และ 15 วิแรกของร่างมังกรครั้งต่อไปเป็นร่างบรรพกาล · เป็นมังกรอยู่: เข้าร่างบรรพกาลทันที + อยู่นานขึ้น 10 วิ · ร่างบรรพกาลตัวใหญ่ขึ้นอีก ทุกการโจมตีนับทั้งไฟและหิน',lv:()=>[`ร่างบรรพกาล ${ZB.zxAscend.T} วิ`,`Cooldown ${ZB.zxAscend.cd} วิ`]},
 {key:'zxTyphon',id:'ZD-C11',name:"Typhon's Wrath",br:'C',col:'A',tier:4,type:'melee',pre:[['zaUlt',1]],d:'[New Active] ฟันเป้าเดียว 3 ครั้ง ทุกครั้งร้อนเต็มแล้วชุบ (ระเบิดลาวา 3 รอบ) ไว้ทุ่มตอนบอสเปิดช่อง · ร่างมังกร กัด–ตะปบ–ฟาดหาง',lv:()=>[`${zdX(ZB.zxTyphon.dmg)} × ${ZB.zxTyphon.n} + ระเบิดลาวา`,`Cooldown ${ZB.zxTyphon.cd} วิ`]},
 {key:'zxEmbrace',id:'ZD-C12',name:"Gaia's Embrace",br:'C',col:'B',tier:4,type:'ground',radius:()=>ZB.zxEmbrace.R,pre:[['zbUlt',1]],d:'[New Active] มือหินของไกอาโผล่จากพื้นโอบวง 3 วิ ทุกตัวในวงเป็นหินตลอด (ข้ามกันหิน) · บอส: ร้าว + ลดเกจ KO หนัก',lv:()=>[`${zdM(ZB.zxEmbrace.dmg)} ทุก ${ZB.zxEmbrace.tick} วิ รัศมี ${ZB.zxEmbrace.R}`,`Cooldown ${ZB.zxEmbrace.cd} วิ`]}
];
const ZD_DN={};for(const d of ZD_DEFS)if(d.dn)ZD_DN[d.key]=d.dn;
ZD_DN.zxComet='Lava Spit Comet';ZD_DN.zxTyphon="Typhon's Maul";

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const ZD={g:0,form:null,lastForm:null,t0:-99,until:0,popT:-99,shield:0,shieldMax:0,prim:0,primNext:0,lockT:-99,fightT:-99,prophT:-99,revT:-99,
  tkT:-9,tkN:0,healT:-9,guardUntil:0,hideN:0,hideUntil:0,aegis:0,aegisMax:0,aegisUntil:0,aegisBig:0,skinOn:0,
  zones:[],castN:0,nHot:0,nStone:0,ready:0,fl:0,face:1,E:null};
const ZDH=new Set(),ZDS=new Set();   /* heated enemies · enemies turned to stone (for burn ticks and the overlays) */
const zdL=k=>LV[k]||0;
const zdLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,zdL(k)))-1];
const ZDC={fire:'#ff7a2a',fire2:'#ffd27a',lava:'#ff4a12',ember:'#ffb347',stone:'#cbbfa8',stone2:'#f2ead8',amber:'#ffb43a',steam:'#e8f0f4',
  soot:'#2a1a12',gold:'#ffd36a',obs:'#3a2838',crack:'#5a4632',marble:'#e9e2d2',moss:'#c9b48a'};
/* real seconds of n action-seconds (actions run on ACTION_TEMPO) */
const zdRT=t=>t/(typeof ACTION_TEMPO!=='undefined'&&ACTION_TEMPO>0?ACTION_TEMPO:.75);
/* the branch (column) of a skill key: C nodes follow their column */
function zdCol(k){if(!k||k==='basic')return 'basic';const d=ZD_DEFS.find(x=>x.key===k);if(d)return d.br==='C'?d.col:d.br;const s=SKILLS[k];return s?(s.br==='C'?(s.col||'basic'):s.br):'basic';}
const zdBig=e=>!!(e&&(e.boss||e.mini||e.mbPart||e.wbPart));
const zdNear=(x,y,R)=>enemies.filter(e=>!e.dead&&!e.hidden&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
function zdCone(x,y,phi,R,half){return enemies.filter(e=>{if(e.dead||e.hidden)return false;const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy);if(d>R+e.r*.5)return false;if(d<e.r+10)return true;
  return Math.abs(angDiff(Math.atan2(dy,dx),phi))<=half+Math.atan2(e.r*.5,d);});}
const zdSegD=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const zdSeg=(ax,ay,bx,by,w)=>enemies.filter(e=>!e.dead&&!e.hidden&&zdSegD(e.x,e.y,ax,ay,bx,by)<w+e.r*.5);
function zdFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function zdPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!zdFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const zdTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const zdPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const zdGround=(c,t,L)=>{const x=c&&c.gx!=null?c.gx:(t?t.x:player.x+Math.cos(player.phi)*L),y=c&&c.gy!=null?c.gy:(t?t.y:player.y+Math.sin(player.phi)*L);return [x,y];};
function zdVis(x,y,m=220){try{const [px,py]=P(x,y),sx=px*Z+ox,sy=py*Z+oy;return sx>-m&&sx<VW+m&&sy>-m&&sy<VH+m*1.4;}catch(_){return true;}}
function zdNo(t){if(gameTime-(zdNo.t||-9)<1)return;zdNo.t=gameTime;setTimeout(()=>msg(t),0);}   /* after the engine's own 'no target' line */
const zdMuts=k=>{try{const A=window.totemGems&&totemGems.act&&totemGems.act()[k];return (A&&A.mut)||[];}catch(_){return [];}};
/* a cast context: quench mode, gauge counters of this one cast, element gems (fire → heats, ice → quenches, volt → both) */
function zdC(key,o){ZD.castN++;const C=Object.assign({id:ZD.castN,key,gg:0,qg:0,rf:0},o||{});const mu=zdMuts(key);
  if(mu.includes('fire')||mu.includes('volt'))C.gh=1;if(mu.includes('ice')||mu.includes('volt'))C.gq=1;return C;}
/* every skill hit of the drake goes through here (branch = the skill's column) */
function zdHit(e,m,key,C,o={}){if(!e||e.dead)return 0;const br=o.br||zdCol(key);const d=hurt(e,m,Object.assign({skill:key,br},o));
  if(d>0){ZD.fightT=gameTime;if(C){if(ZD.form)zdRefill(C,'hit');else zdGain('skill',C);
      if(C.gh&&!o.noTag)zdHeat(e,1);if(C.gq&&!o.noTag&&!C.qNow)zdQuench(e,C);}
    if(ZD.form&&ZD.prim>gameTime&&!o.noPrim&&!e.dead){zdHeat(e,1);zdQuench(e,C||{q:ZD.form});}}
  return d;}

/* ---- DRAGON BLOOD (the transform gauge) ---- */
function zdNeedOf(k){const mu=zdMuts(k);return mu.includes('heavy')?ZD_BAL.blood.heavy:mu.includes('rapid')?ZD_BAL.blood.rapid:ZD_BAL.blood.need;}
function zdHeartKey(){const a=zdL('zaHeart'),b=zdL('zbHeart');if(!a&&!b)return null;if(a&&b)return D.mag>D.patk?'zbHeart':'zaHeart';return b?'zbHeart':'zaHeart';}
function zdNeedNow(){const k=ZD.form?(ZD.form==='A'?'zaHeart':'zbHeart'):zdHeartKey();return k?zdNeedOf(k):ZD_BAL.blood.need;}
function zdAddG(v){if(ZD.form||gameTime<ZD.lockT||!(v>0))return;const need=zdNeedNow(),was=ZD.g;ZD.g=Math.min(ZD_BAL.blood.cap,ZD.g+v);
  if(was<need&&ZD.g>=need&&zdHeartKey()){ZD.ready=gameTime;addFx(new ZdReady({}));}}
function zdGain(kind,C){const B=ZD_BAL.blood;let v=0;
  switch(kind){case 'basic':v=B.basic;break;
    case 'skill':if(!C||C.gg>=B.skillCap)return;v=Math.min(B.skill,B.skillCap-C.gg);C.gg+=v;break;
    case 'q':if(C){if(C.qg>=B.qCap)return;v=Math.min(B.q,B.qCap-C.qg);C.qg+=v;}else v=B.q;break;
    case 'kill':v=B.kill;break;case 'roar':v=ZB.znRoar.blood;break;case 'guard':v=ZB.zaGuard.blood;break;case 'ult':v=ZB.zaUlt.blood;break;}
  zdAddG(v);}
function zdTaken(){ZD.fightT=gameTime;if(ZD.form)return;const B=ZD_BAL.blood,sk=hasBuff('znSkin'),per=sk?B.skin:B.taken,cap=sk?B.skinCap:B.takenCap;
  if(gameTime-ZD.tkT>=1){ZD.tkT=gameTime;ZD.tkN=0;}if(ZD.tkN>=cap)return;const v=Math.min(per,cap-ZD.tkN);ZD.tkN+=v;zdAddG(v);}
/* dragon form: moves refill a little (A: hits +1, at most +2 a move · B: statues +2, at most +4 a move) */
function zdRefill(C,kind){if(!ZD.form||!C)return;const B=ZD_BAL.blood;
  if(ZD.form==='A'&&kind==='hit'){if(C.rf>=B.refACap)return;C.rf+=B.refA;ZD.g=Math.min(B.cap,ZD.g+B.refA);}
  else if(ZD.form==='B'&&kind==='stone'){if(C.rf>=B.refBCap)return;C.rf+=B.refB;ZD.g=Math.min(B.cap,ZD.g+B.refB);}}

/* ---- HEAT (fire) ---- */
const zdCap=()=>zdL('zxWhite')?ZD_BAL.heat.white:ZD_BAL.heat.cap;
const zdHeatLife=()=>ZD_BAL.heat.life+(zdL('znCore')?zdLv(ZB.znCore.life,'znCore'):0);
const zdBurnPer=()=>ZD_BAL.heat.burn+(zdL('znCore')?zdLv(ZB.znCore.burn,'znCore'):0);
const zdHeatOf=e=>e&&e._zH>0&&e._zHT>gameTime?e._zH:0;
function zdHeat(e,n){if(!e||e.dead||!(n>0)||e.nohp)return;const was=zdHeatOf(e);e._zH=Math.min(zdCap(),was+n);e._zHT=gameTime+zdHeatLife();if(e._zBT==null||was===0)e._zBT=0;ZDH.add(e);
  if(e._zH>was)zdEmbers(e.x,e.y,(e.boss?40:26)+(e.z||0),2+e._zH);}
/* ---- QUENCH (stone): heat → A lava burst · B statue · Basic skills by the higher power ---- */
function zdQMode(C){const q=C&&C.q;if(q==='A'||q==='B')return q;return D.mag>D.patk?'B':'A';}
function zdQuench(e,C,o={}){if(!e||e.dead)return 0;let n=zdHeatOf(e);if(ZD.prophT>gameTime)n=Math.max(n,ZD_BAL.heat.cap);if(o.min)n=Math.max(n,o.min);if(n<=0)return 0;
  e._zH=0;e._zHT=0;ZDH.delete(e);const mode=o.mode||zdQMode(C),N=n*(o.dbl?2:1);
  zdSteam(e.x,e.y,(e.boss?30:18)+(e.z||0),4+n*2);
  if(C)C.qNow=1;
  try{if(mode==='A'){zdLava(e,N,C);if(C&&C.key==='zaAnvil'&&n>=2&&zdL('zaCrack'))e._zCrA=gameTime+ZB.zaCrack.T;}else zdStone(e,N,C,o);}finally{if(C)C.qNow=0;}
  if(!ZD.form)zdGain('q',C);
  if(zdL('znCyclops')&&gameTime-ZD.healT>=1){ZD.healT=gameTime;const h=Math.round(PS.lv*zdLv(ZB.znCyclops.heal,'znCyclops'));if(h>0&&player.hp<player.maxHp){player.hp=Math.min(player.maxHp,player.hp+h);dmgNum(player.x,player.y,80,'+'+h,'heal');}}
  return n;}
function zdLava(e,n,C){const per=zdL('zaBurst')?zdLv(ZB.zaBurst.per,'zaBurst'):ZD_BAL.lava.per,R=zdL('zaBurst')?zdLv(ZB.zaBurst.R,'zaBurst'):ZD_BAL.lava.R,x=e.x,y=e.y;
  /* the quenched enemy takes its own burst; neighbours take half, once per cast (an AoE quench of a pack used to burst onto every neighbour: group damage grew with the square of the pack) */
  const seen=C?(C.lava||(C.lava=new Set())):null;hurt(e,n*per,{skill:'zqLava',br:'A',sure:true,big:true});if(seen)seen.add(e);
  for(const q of zdNear(x,y,R)){if(q===e||(seen&&seen.has(q)))continue;if(seen)seen.add(q);hurt(q,n*per*.5,{skill:'zqLava',br:'A',sure:true});}
  addFx(new ZdLava({x,y,R,n}));shake(.5+Math.min(4,n)*.35);if(n>=3)stop(28);}
function zdStone(e,n,C,o={}){
  if(zdBig(e)){applyCC(e,{slow:ZD_BAL.boss.slow});koHit(e,1,{skill:'zqStone',koMul:n*ZD_BAL.boss.ko});e._zCrk=gameTime+ZD_BAL.boss.crack;addFx(new ZdCrackBurst({e}));return;}
  if(!o.force&&e._zImm>gameTime){hurt(e,n*ZD_BAL.stone.weak,{skill:'zqStone',br:'B'});return;}
  const per=zdL('zbMark')?zdLv(ZB.zbMark.per,'zbMark'):ZD_BAL.stone.per,T=o.T||n*per,had=e._zSt>gameTime;
  e.st.stun=Math.max(e.st.stun||0,T);const real=Math.max(.2,e.st.stun||T);   /* a statue = stun without stars (the status proxy scales it by our DEX vs the monster's VIT / 2); drawn grey by the MSPR_DRAW hook */
  e._zSt=gameTime+real;e._zStT=Math.max(e._zStT&&had?e._zStT:0,real);e._zImm=gameTime+real+ZD_BAL.stone.imm;e.atk=0;e.vx=e.vy=0;ZDS.add(e);
  if(ZD.form==='B'&&C)zdRefill(C,'stone');
  if(!had)addFx(new ZdPetrify({e}));}
const zdStoned=e=>e&&!e.dead&&e._zSt>gameTime;
const zdCracked=e=>e&&!e.dead&&(e._zCrk>gameTime);

/* ---------------------------------------------------------------------
   4. FX (code VFX — painted pieces can replace them later). No round dots: streaks, chunks, puffs.
   --------------------------------------------------------------------- */
function zdGlow(x,y,r,col,a){if(!(a>0)||!(r>0))return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,Math.min(1,a)));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function zdChunk(x,y,s,rot,col,a,seed){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=Math.min(1,a);const n=5+(seed%3);ctx.beginPath();
  for(let i=0;i<n;i++){const an=i/n*TAU,r=s*(.7+.3*Math.sin(seed*3.1+i*1.7));if(i)ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r*.8);else ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r*.8);}ctx.closePath();
  ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='rgba(40,24,14,.75)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.ellipse(-s*.2,-s*.25,s*.35,s*.18,-.4,0,TAU);ctx.fill();ctx.restore();}
/* one shared particle pool: embers (streaks), rocks / lava chunks (gravity + bounce), steam puffs, sparks */
class ZdBits{constructor(){this.t=0;this.layer='top';this.p=[];}
  add(q){if(this.p.length>320)this.p.shift();this.p.push(Object.assign({t:0,life:.8,vx:0,vy:0,vz:0,z:20,g:0,drag:1.5,rot:rnd(0,TAU),vr:0,s:6,kind:'ember',col:ZDC.ember,a:1,seed:(Math.random()*97)|0},q));}
  update(dt){this.t+=dt;for(let i=this.p.length-1;i>=0;i--){const q=this.p[i];q.t+=dt;if(q.t>=q.life){this.p.splice(i,1);continue;}const f=Math.exp(-q.drag*dt);q.vx*=f;q.vy*=f;q.vz=q.vz*f-q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;
    if(q.z<0){if((q.kind==='rock'||q.kind==='lava')&&q.vz<-60){q.z=0;q.vz*=-.32;q.vx*=.6;q.vy*=.6;q.vr*=.5;}else{q.z=0;q.vz=0;}}q.rot+=q.vr*dt;}return CHAR==='drake';}
  draw(){for(const q of this.p){const k=q.t/q.life,[x,y]=P(q.x,q.y,q.z),a=q.a*(k<.08?k/.08:1-Math.max(0,(k-.6)/.4));if(!(a>.01))continue;
    if(q.kind==='rock')zdChunk(x,y,q.s,q.rot,q.col,a,q.seed);
    else if(q.kind==='lava'){zdGlow(x,y,q.s*2.4,ZDC.lava,.45*a);zdChunk(x,y,q.s,q.rot,k<.5?ZDC.fire2:ZDC.fire,a,q.seed);}
    else if(q.kind==='steam'){const r=q.s*(1+k*1.6);ctx.save();ctx.globalAlpha=a*.5;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(250,250,252,.9)');g.addColorStop(.6,'rgba(220,226,232,.45)');g.addColorStop(1,'rgba(200,210,220,0)');ctx.fillStyle=g;
      ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,TAU);ctx.fill();ctx.restore();}
    else{const [x2,y2]=P(q.x-q.vx*.04,q.y-q.vy*.04,Math.max(0,q.z-q.vz*.04));ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(q.col,a);ctx.lineWidth=q.s*.34;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',a*.7);ctx.lineWidth=q.s*.12;ctx.stroke();ctx.restore();}}}}
const zdB=()=>ZD._v&&ZD._v.b;
function zdEmbers(x,y,z,n,o={}){const B=zdB();if(!B)return;for(let i=0;i<qn(n);i++){const an=rnd(0,TAU),v=rnd(.3,1)*(o.spd??90);B.add({kind:'ember',x:x+rnd(-6,6),y:y+rnd(-4,4),z:z+rnd(-6,8),vx:Math.cos(an)*v,vy:Math.sin(an)*v*.6,vz:rnd(40,130),g:-30,drag:2.2,s:rnd(5,8),col:o.col||(Math.random()<.5?ZDC.fire:ZDC.ember),life:rnd(.4,.8)});}}
function zdRocks(x,y,n,o={}){const B=zdB();if(!B)return;for(let i=0;i<qn(n);i++){const an=rnd(0,TAU),v=rnd(.35,1)*(o.spd??160);B.add({kind:o.lava?'lava':'rock',x,y,z:o.z??6,vx:Math.cos(an)*v,vy:Math.sin(an)*v*.7,vz:rnd(120,300)*(o.up??1),g:700,drag:.6,s:rnd(3,6)*(o.big||1),col:o.col||(Math.random()<.5?'#a89880':'#cbbca2'),life:rnd(.7,1.1),vr:rnd(-9,9)});}}
function zdSteam(x,y,z,n,o={}){const B=zdB();if(!B)return;for(let i=0;i<qn(n);i++)B.add({kind:'steam',x:x+rnd(-10,10),y:y+rnd(-6,6),z:z+rnd(-4,10),vx:rnd(-24,24),vy:rnd(-14,14),vz:rnd(40,90)*(o.up??1),g:-10,drag:1.6,s:rnd(7,12)*(o.big||1),life:rnd(.6,1.1),a:.9});}
function zdSparks(x,y,z,n,col){const B=zdB();if(!B)return;for(let i=0;i<qn(n);i++){const an=rnd(0,TAU),v=rnd(140,280);B.add({kind:'spark',x,y,z,vx:Math.cos(an)*v,vy:Math.sin(an)*v,vz:rnd(40,170),g:460,drag:3,s:rnd(5,9),col,life:rnd(.2,.36)});}}
/* hit flash: 4-point star */
class ZdFlash{constructor(o){Object.assign(this,{t:0,life:.16,layer:'top',z:24,r:20,col:ZDC.fire},o);this.an=rnd(0,TAU);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,[x,y]=P(this.x,this.y,this.z),a=1-k,r=this.r*(.6+.6*eOut(k));zdGlow(x,y,r*1.5,this.col,.55*a);ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(x,y);ctx.rotate(this.an);ctx.fillStyle=hexA('#ffffff',.9*a);
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,-r*.13);ctx.lineTo(r,0);ctx.lineTo(0,r*.13);ctx.closePath();ctx.fill();}ctx.restore();}}
function zdSpark(e,big,col){const z=(e.boss?36:24)+(e.z||0);addFx(new ZdFlash({x:e.x,y:e.y,z,r:big?32:18,col}));zdSparks(e.x,e.y,z,big?6:3,col);}
/* a sword slash on the ground plane round the hero (2026-11-23: the owner's knight carries a sword): a tapered crescent that sweeps
   from a thin tail to a pointed tip, white-hot edge, soft glow; heavy = the quench strike (wider, stone colour) */
class ZdSwing{constructor(o){Object.assign(this,{t:0,life:.26,layer:'top',z:22,span:1.7,R:66,col:ZDC.fire,heavy:0},o);this.x=player.x;this.y=player.y;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,sw=eOut(Math.min(1,k*2.6)),a=1-Math.max(0,(k-.4)/.6),a0=this.phi-this.span/2,a1=a0+this.span*sw;if(a1-a0<.04||a<=0)return;
    const [cx,cy]=P(this.x,this.y,this.z),R=this.R*(this.heavy?1.08:1),W=(this.heavy?18:12)*(.55+.45*sw),N=20,sh=u=>Math.pow(u,1.2)*Math.pow(1-u,.35)/.437;
    const cres=(r,wm)=>{ctx.beginPath();for(let i=0;i<=N;i++){const an=a0+(a1-a0)*i/N;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}
      for(let i=N;i>=0;i--){const u=i/N,an=a0+(a1-a0)*u,rr=r-W*wm*sh(u);ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();};
    const stone=this.col===ZDC.stone2||this.col===ZDC.marble,dk=stone?'#4a3c30':'#7a1e0c';   /* dark backing so the cut reads on snow too (VFX_STYLE_REF_TH.md) */
    ctx.save();ctx.translate(cx,cy);ctx.scale(1,K);
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=hexA(this.col,.26*a);cres(R+6,1.8);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.fillStyle=hexA(dk,.5*a);cres(R-1,1.25);ctx.fill();
    ctx.fillStyle=hexA(this.col,.85*a);cres(R,.95);ctx.fill();
    ctx.fillStyle=hexA('#fff6e8',.92*a);cres(R,.34);ctx.fill();ctx.restore();}}
/* three claw rakes across a target */
class ZdClaw{constructor(o){Object.assign(this,{t:0,life:.24,layer:'top',col:ZDC.fire,L:44},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=this.e,[x,y]=P(e.x,e.y,(e.boss?36:24)+(e.z||0)),sw=eOut(Math.min(1,k*2.6)),a=1-Math.max(0,(k-.45)/.55),ang=this.ang;
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(let i=-1;i<=1;i++){const o=i*9,L=this.L*sw;ctx.strokeStyle=hexA(this.col,.45*a);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-this.L/2,o-4);ctx.lineTo(-this.L/2+L,o+4);ctx.stroke();ctx.strokeStyle=hexA('#ffffff',.95*a);ctx.lineWidth=2.2;ctx.stroke();}ctx.restore();}}
/* a jaw snap: two crescents closing on the target (the bite) */
class ZdBite{constructor(o){Object.assign(this,{t:0,life:.28,layer:'top',col:ZDC.stone2},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=this.e,[x,y]=P(e.x,e.y,(e.boss?36:24)+(e.z||0)),c=eIn(Math.min(1,k*2.2)),gap=22*(1-c)+4,a=1-Math.max(0,(k-.5)/.5);
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.lineCap='round';for(const s of [-1,1]){ctx.save();ctx.translate(0,s*gap);ctx.scale(1,s);ctx.fillStyle=this.col;ctx.strokeStyle='#3a2414';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(-20,0);ctx.quadraticCurveTo(0,-14,20,0);ctx.lineTo(14,2);for(let i=0;i<4;i++){const tx=12-i*8;ctx.lineTo(tx-2,8);ctx.lineTo(tx-5,2);}ctx.lineTo(-20,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    ctx.restore();if(k>.4&&k<.6)zdGlow(x,y,30,this.col,.6);}}
/* fire / lava / roar cone on the ground with tongues */
class ZdCone{constructor(o){Object.assign(this,{t:0,life:.45,layer:'top',half:.55,R:120,col:ZDC.fire,kind:'fire',follow:0},o);this.seed=Math.random()*9;}update(dt){this.t+=dt;if(this.follow){this.x=player.x;this.y=player.y;}return this.t<this.life;}
  draw(){const k=this.t/this.life,grow=eOut(Math.min(1,this.t/.14)),a=this.t<this.life-.18?1:Math.max(0,(this.life-this.t)/.18),R=this.R*grow,[cx,cy]=P(this.x,this.y,this.kind==='roar'?30:18),ph=this.phi;
    ctx.save();ctx.translate(cx,cy);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,8,0,0,R);const c1=this.kind==='roar'?ZDC.amber:this.kind==='lava'?ZDC.lava:ZDC.fire;g.addColorStop(0,hexA('#ffffff',.55*a));g.addColorStop(.25,hexA(this.kind==='roar'?ZDC.gold:ZDC.fire2,.5*a));g.addColorStop(.7,hexA(c1,.36*a));g.addColorStop(1,hexA(c1,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,ph-this.half,ph+this.half);ctx.closePath();ctx.fill();
    if(this.kind==='roar'){ctx.strokeStyle=hexA(ZDC.gold,.7*a);ctx.lineWidth=3;for(let i=0;i<3;i++){const rr=R*(.4+.3*i+.25*((this.t*3)%1));if(rr<R){ctx.beginPath();ctx.arc(0,0,rr,ph-this.half*.85,ph+this.half*.85);ctx.stroke();}}}
    else for(let i=0;i<7;i++){const an=ph+(i/6-.5)*this.half*1.8,len=R*(.55+.4*Math.abs(Math.sin(this.t*13+i*1.7+this.seed))),w=6+4*Math.sin(i+this.t*9);
      ctx.strokeStyle=hexA(this.kind==='lava'?ZDC.fire:ZDC.fire2,.5*a);ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(Math.cos(an)*R*.15,Math.sin(an)*R*.15);ctx.quadraticCurveTo(Math.cos(an+.15)*len*.6,Math.sin(an+.15)*len*.6,Math.cos(an)*len,Math.sin(an)*len);ctx.stroke();}
    ctx.restore();}}
/* lava burst: hot ring + flash + lava chunks + embers */
class ZdLava{constructor(o){Object.assign(this,{t:0,life:.42,layer:'top',R:70,n:1},o);zdRocks(this.x,this.y,3+this.n*2,{lava:1,spd:this.R*2.2});zdEmbers(this.x,this.y,16,5+this.n*2,{spd:this.R*1.8});}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[x,y]=P(this.x,this.y,0),R=this.R*(.35+.75*eOut(k));ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,hexA('#fff4d0',.8*a));g.addColorStop(.35,hexA(ZDC.fire2,.6*a));g.addColorStop(.75,hexA(ZDC.lava,.45*a));g.addColorStop(1,hexA(ZDC.lava,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.strokeStyle=hexA(ZDC.fire,.8*a);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R*.96,0,TAU);ctx.stroke();ctx.restore();
    const [fx,fy]=P(this.x,this.y,26);zdGlow(fx,fy,26+this.n*8,ZDC.fire2,.7*a);}}
/* the steam 'hiss' of a quench is the steam pool (zdSteam) — here: turning to stone */
class ZdPetrify{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top'},o);const e=this.e;zdRocks(e.x,e.y,4,{spd:70,z:20,up:.6});}
  update(dt){this.t+=dt;return this.t<this.life&&!this.e.dead;}
  draw(){const e=this.e,k=this.t/this.life,a=1-k,[x,y]=P(e.x,e.y,0),R=(e.r+30)*(1-eOut(k)*.65);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.strokeStyle=hexA(ZDC.stone2,.85*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();
    ctx.strokeStyle=hexA(ZDC.amber,.6*a);ctx.lineWidth=1.6;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(0,0,R*1.15,this.t*4,this.t*4+TAU);ctx.stroke();ctx.setLineDash([]);ctx.restore();}}
/* a boss 'cracks' instead of turning to stone */
class ZdCrackBurst{constructor(o){Object.assign(this,{t:0,life:.5,layer:'top'},o);const e=this.e;zdRocks(e.x,e.y,5,{spd:90,z:40});}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const e=this.e,k=this.t/this.life,a=1-k,h=(typeof MSPR_H==='function'?MSPR_H(e):60)*.55+(e.z||0),[x,y]=P(e.x,e.y,h);ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.strokeStyle=ZDC.amber;ctx.lineWidth=2.4;ctx.lineCap='round';
    for(let i=0;i<5;i++){const an=i/5*TAU+.4,L=10+18*eOut(Math.min(1,k*3));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*L*.5,Math.sin(an)*L*.5+3);ctx.lineTo(Math.cos(an+.3)*L,Math.sin(an+.3)*L);ctx.stroke();}ctx.restore();zdGlow(x,y,26,ZDC.amber,.5*a);}}
/* ground shock: cracked star + ring + rocks + dust */
class ZdQuake{constructor(o){Object.assign(this,{t:0,life:.7,layer:'ground',R:120,col:ZDC.fire,stone:0},o);this.cr=[];const n=7+((Math.random()*3)|0);for(let i=0;i<n;i++){const an=i/n*TAU+rnd(-.2,.2),L=this.R*rnd(.55,1.05),pts=[[0,0]];let px=0,py=0;for(let j=1;j<=4;j++){const d=L*j/4;px=Math.cos(an+rnd(-.18,.18))*d;py=Math.sin(an+rnd(-.18,.18))*d;pts.push([px,py]);}this.cr.push(pts);}
    zdRocks(this.x,this.y,6+this.R/25,{spd:this.R*1.6,col:this.stone?'#d8cdb8':'#8a7258'});try{dustPuff(this.x,this.y,10,this.stone?'#e0d6c4':'#a8957a',this.R*.9,10);}catch(_){}}
  update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-Math.max(0,(k-.35)/.65),[x,y]=P(this.x,this.y),gr=eOut(Math.min(1,k*3.5));ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.lineCap='round';ctx.lineJoin='round';
    for(const pts of this.cr){ctx.beginPath();pts.forEach(([px,py],i)=>{if(i)ctx.lineTo(px*gr,py*gr);else ctx.moveTo(0,0);});ctx.strokeStyle=`rgba(30,18,10,${.75*a})`;ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle=hexA(this.stone?ZDC.amber:ZDC.fire,.85*a*(1-k*.6));ctx.lineWidth=1.6;ctx.globalCompositeOperation='lighter';ctx.stroke();ctx.globalCompositeOperation='source-over';}
    ctx.strokeStyle=hexA(this.stone?ZDC.stone2:ZDC.fire2,.7*(1-k));ctx.lineWidth=5*(1-k)+1;ctx.beginPath();ctx.arc(0,0,this.R*(.3+.8*eOut(k)),0,TAU);ctx.stroke();ctx.restore();}}
/* a stone spike rising from the ground (sorted) */
class ZdSpike{constructor(o){Object.assign(this,{t:0,life:.9,layer:'sorted',s:1,col:ZDC.marble,delay:0},o);this.sy=this.y+1;this.lean=rnd(-.18,.18);}update(dt){this.t+=dt;return this.t<this.life+this.delay;}
  draw(){const t=this.t-this.delay;if(t<0)return;const k=t/this.life,up=eOutBack(Math.min(1,t/.14)),a=k<.7?1:1-(k-.7)/.3,[x,y]=P(this.x,this.y),h=46*this.s*up,w=11*this.s;
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(this.lean);ctx.fillStyle='rgba(30,20,12,.28)';ctx.beginPath();ctx.ellipse(0,1,w*1.3,w*.4,0,0,TAU);ctx.fill();
    ctx.fillStyle=this.col;ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-w,0);ctx.lineTo(-w*.25,-h*.55);ctx.lineTo(0,-h);ctx.lineTo(w*.35,-h*.5);ctx.lineTo(w,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(0,0,0,.16)';ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(w*.35,-h*.5);ctx.lineTo(w,0);ctx.lineTo(w*.1,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle=hexA(ZDC.amber,.85);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-w*.4,-h*.18);ctx.lineTo(-w*.05,-h*.42);ctx.lineTo(-w*.2,-h*.62);ctx.stroke();ctx.restore();}}
/* the transform burst: A lava pillar · B a ring of spikes */
class ZdPillar{constructor(o){Object.assign(this,{t:0,life:.6,layer:'top',R:90,col:ZDC.lava,H:230},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[x,y]=P(this.x,this.y),w=this.R*.55*(1-k*.4),H=this.H*(.5+.5*eOut(Math.min(1,k*2)));ctx.save();ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(x,y-H,x,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(.6,hexA(this.col,.5*a));g.addColorStop(1,hexA('#fff2c8',.9*a));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-H/2,w*.5,H/2,0,0,TAU);ctx.fill();ctx.restore();zdGlow(x,y,this.R,this.col,.5*a);}}
/* the gauge is full: a gold ring pulse round the hero */
class ZdReady{constructor(o){Object.assign(this,{t:0,life:.8,layer:'top'},o);try{addFx(new DText({x:player.x,y:player.y,z:96,text:'เลือดมังกรเต็ม!',color:ZDC.gold,size:13,life:1.1}));}catch(_){}}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=1-k,[x,y]=P(player.x,player.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(ZDC.gold,.8*a);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,30+60*eOut(k),0,TAU);ctx.stroke();ctx.restore();}}
/* falling lava rock / meteor with a trail; onLand at the end */
class ZdMeteor{constructor(o){Object.assign(this,{t:0,T:.4,layer:'top',s:1,col:ZDC.fire,H:260},o);this.sx=this.x+rnd(-80,80);this.sy0=this.y-rnd(30,70);this.done=0;}
  update(dt){this.t+=dt;if(!this.done&&this.t>=this.T){this.done=1;this.onLand&&this.onLand(this.x,this.y);}return this.t<this.T+.05;}
  draw(){const k=Math.min(1,this.t/this.T),e=eIn(k),wx=lerp(this.sx,this.x,e),wy=lerp(this.sy0,this.y,e),z=this.H*(1-e),[x,y]=P(wx,wy,z),[tx,ty]=P(lerp(this.sx,this.x,Math.max(0,e-.18)),lerp(this.sy0,this.y,Math.max(0,e-.18)),this.H*(1-Math.max(0,e-.18)));
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(this.col,.5);ctx.lineWidth=10*this.s;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();ctx.strokeStyle=hexA('#fff2c8',.85);ctx.lineWidth=3*this.s;ctx.stroke();ctx.restore();
    zdGlow(x,y,18*this.s,this.col,.8);zdChunk(x,y,6*this.s,this.t*7,this.stone?'#c8b8a0':'#5a2a1a',1,7);const [gx,gy]=P(this.x,this.y);ctx.save();ctx.globalAlpha=.25*k;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy,14*this.s*k,5*this.s*k,0,0,TAU);ctx.fill();ctx.restore();}}
/* thrown projectile with an arc (boulder) or straight line (comet) */
class ZdShot{constructor(o){Object.assign(this,{t:0,T:.45,layer:'top',arc:120,s:1,kind:'boulder'},o);this.done=0;}
  update(dt){this.t+=dt;const k=Math.min(1,this.t/this.T);if(!this.done&&k>=1){this.done=1;this.onLand&&this.onLand(this.x1,this.y1);}return !this.done;}
  draw(){const k=Math.min(1,this.t/this.T),wx=lerp(this.x0,this.x1,k),wy=lerp(this.y0,this.y1,k),z=30+this.arc*Math.sin(Math.PI*k),[x,y]=P(wx,wy,z),[gx,gy]=P(wx,wy);ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy,16*this.s,5*this.s,0,0,TAU);ctx.fill();ctx.restore();
    if(this.kind==='lava'){zdGlow(x,y,26*this.s,ZDC.lava,.8);zdChunk(x,y,9*this.s,this.t*9,ZDC.fire,1,3);}else{zdChunk(x,y,15*this.s,this.t*6,'#bdae94',1,5);zdGlow(x,y,20*this.s,ZDC.amber,.25);}}}
/* the comet sword: spins out along a line, then back to the hero (pierces) */
class ZdComet{constructor(o){Object.assign(this,{t:0,layer:'top',speed:820,len:320,back:0,z:40,lava:0},o);this.d=0;this.hits=new Set();this.dir=1;this.x0=this.x;this.y0=this.y;this.trail=[];}
  update(dt){this.t+=dt;const st=this.speed*dt;if(this.dir>0){this.d+=st;const end=this.d>=this.len||!zdFree(this.x0+Math.cos(this.phi)*this.d,this.y0+Math.sin(this.phi)*this.d);this.x=this.x0+Math.cos(this.phi)*this.d;this.y=this.y0+Math.sin(this.phi)*this.d;
      for(const e of enemies){if(e.dead||e.hidden||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w*.6){this.hits.add(e);this.onOut&&this.onOut(e);}}
      if(end){this.dir=-1;this.hits.clear();this.ex=this.x;this.ey=this.y;}}
    else{const dx=player.x-this.x,dy=player.y-this.y,L=Math.hypot(dx,dy);if(L<24||this.t>3)return false;this.x+=dx/L*st;this.y+=dy/L*st;
      for(const e of enemies){if(e.dead||e.hidden||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w*.6){this.hits.add(e);this.onBack&&this.onBack(e);}}}
    this.trail.push([this.x,this.y]);if(this.trail.length>10)this.trail.shift();return true;}
  draw(){const n=this.trail.length;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=1;i<n;i++){const [ax,ay]=P(this.trail[i-1][0],this.trail[i-1][1],this.z),[bx,by]=P(this.trail[i][0],this.trail[i][1],this.z),k=i/n;ctx.strokeStyle=hexA(ZDC.fire,.55*k);ctx.lineWidth=12*k;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}ctx.restore();
    const [x,y]=P(this.x,this.y,this.z);zdGlow(x,y,30,ZDC.lava,.8);if(this.lava)zdChunk(x,y,10,this.t*10,ZDC.fire,1,2);else zdSwordPic(x,y,this.t*14,1.1);}}
/* a code-drawn forge sword like the owner's knight carries: white marble blade with a lava core, gold crossguard + ruby, dark grip, gold pommel */
function zdSwordPic(x,y,rot,s){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
  ctx.fillStyle='#f6f1e8';ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-4.2,-2);ctx.lineTo(-3.4,-26);ctx.lineTo(0,-33);ctx.lineTo(3.4,-26);ctx.lineTo(4.2,-2);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=ZDC.fire;ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,-27);ctx.stroke();
  ctx.fillStyle='#e8b23a';ctx.strokeStyle='#2a1a10';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-11,-3);ctx.quadraticCurveTo(0,1,11,-3);ctx.lineTo(9,1.5);ctx.quadraticCurveTo(0,4,-9,1.5);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#d8242a';ctx.beginPath();ctx.arc(0,-.4,1.8,0,TAU);ctx.fill();
  ctx.fillStyle='#5a2418';ctx.fillRect(-1.8,2,3.6,10);ctx.strokeRect(-1.8,2,3.6,10);
  ctx.fillStyle='#e8b23a';ctx.beginPath();ctx.arc(0,13.5,2.6,0,TAU);ctx.fill();ctx.stroke();ctx.restore();zdGlow(x,y,16*s,ZDC.fire,.4);}
/* Gorgon's eye opening in the sky */
class ZdEye{constructor(o){Object.assign(this,{t:0,life:1.3,layer:'top',R:240},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,op=eOut(Math.min(1,k*2.2)),a=k<.75?1:1-(k-.75)/.25,[x,y]=P(this.x,this.y,170),s=34;ctx.save();ctx.globalAlpha=a;zdGlow(x,y,s*3,ZDC.amber,.45);
    ctx.fillStyle='#fff3d0';ctx.strokeStyle='#3a2414';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-s*1.5,y);ctx.quadraticCurveTo(x,y-s*1.2*op,x+s*1.5,y);ctx.quadraticCurveTo(x,y+s*1.2*op,x-s*1.5,y);ctx.fill();ctx.stroke();
    if(op>.2){ctx.fillStyle=ZDC.amber;ctx.beginPath();ctx.ellipse(x,y,s*.55*op,s*.55*op,0,0,TAU);ctx.fill();ctx.fillStyle='#1a0e06';ctx.beginPath();ctx.ellipse(x,y,s*.12,s*.5*op,0,0,TAU);ctx.fill();}
    for(let i=0;i<10;i++){const an=i/10*TAU+this.t*.6,r0=s*1.7,r1=s*2.3;ctx.strokeStyle=hexA(ZDC.gold,.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r0,y+Math.sin(an)*r0*.6);ctx.lineTo(x+Math.cos(an)*r1,y+Math.sin(an)*r1*.6);ctx.stroke();}
    if(k>.45&&k<.7){const [gx,gy]=P(this.x,this.y);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(ZDC.amber,.5*(1-(k-.45)/.25));ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x,y+s);ctx.lineTo(gx,gy);ctx.stroke();}ctx.restore();}}
/* stone chains around a target (Earth Chains) */
class ZdChains{constructor(o){Object.assign(this,{t:0,layer:'top',T:1.4},o);}update(dt){this.t+=dt;return this.t<this.T&&!this.e.dead;}
  draw(){const e=this.e,k=this.t/this.T,a=k<.85?Math.min(1,this.t/.12):1-(k-.85)/.15,[x,y]=P(e.x,e.y,0),h=(typeof MSPR_H==='function'?MSPR_H(e):48)*.5;ctx.save();ctx.globalAlpha=a;
    for(let i=0;i<4;i++){const an=i/4*TAU+.4,bx=x+Math.cos(an)*(e.r+20),by=y+Math.sin(an)*(e.r+20)*K;ctx.strokeStyle='#6a5a48';ctx.lineWidth=3.2;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo((bx+x)/2,by-h*.6,x+Math.cos(an)*6,y-h*.55);ctx.stroke();
      ctx.setLineDash([]);ctx.fillStyle='#9a8a74';ctx.beginPath();ctx.ellipse(bx,by,5,3,0,0,TAU);ctx.fill();}
    ctx.restore();}}
/* the drake's lasting ground zones: vents, lava pools, cinder paths, the veil, Gaia's hands */
class ZdGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='drake';}
  draw(){const t=this.t;
    for(const Zn of ZD.zones){if(!zdVis(Zn.x,Zn.y,Zn.R+60))continue;const a=Math.min(1,(gameTime-Zn.t0)*4,(Zn.until-gameTime)*2.5);if(!(a>0))continue;const [x,y]=P(Zn.x,Zn.y);
      if(Zn.kind==='cinder'){const [bx,by]=P(Zn.x2,Zn.y2);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=hexA(ZDC.lava,.35*a);ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(bx,by);ctx.stroke();
        ctx.strokeStyle=hexA(ZDC.fire2,.55*a);ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*40;ctx.stroke();ctx.setLineDash([]);ctx.restore();if(Math.random()<.4)zdEmbers(lerp(Zn.x,Zn.x2,Math.random()),lerp(Zn.y,Zn.y2,Math.random()),4,1,{spd:30});continue;}
      ctx.save();ctx.translate(x,y);ctx.scale(1,K);const R=Zn.R;
      if(Zn.kind==='pool'){const g=ctx.createRadialGradient(0,0,R*.1,0,0,R);g.addColorStop(0,`rgba(255,190,90,${.75*a})`);g.addColorStop(.6,`rgba(230,70,20,${.6*a})`);g.addColorStop(1,'rgba(90,20,8,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
        ctx.strokeStyle=`rgba(40,14,6,${.6*a})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R*.9,0,TAU);ctx.stroke();for(let i=0;i<4;i++){const an=i*1.7+t*.7,r=R*(.25+.45*((i*.37+t*.3)%1));ctx.fillStyle=`rgba(255,236,170,${.5*a})`;ctx.beginPath();ctx.ellipse(Math.cos(an)*r,Math.sin(an)*r,4,3,0,0,TAU);ctx.fill();}}
      else if(Zn.kind==='vent'){ctx.fillStyle=`rgba(40,30,24,${.3*a})`;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.strokeStyle=hexA(ZDC.amber,.7*a);ctx.lineWidth=2.4;ctx.lineCap='round';
        for(let i=0;i<5;i++){const an=i/5*TAU+.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*R*.4,Math.sin(an)*R*.4+5);ctx.lineTo(Math.cos(an+.25)*R*.85,Math.sin(an+.25)*R*.85);ctx.stroke();}
        ctx.strokeStyle=hexA(ZDC.stone2,.5*a);ctx.lineWidth=2;ctx.setLineDash([9,7]);ctx.lineDashOffset=t*20;ctx.beginPath();ctx.arc(0,0,R*.97,0,TAU);ctx.stroke();ctx.setLineDash([]);}
      else if(Zn.kind==='veil'){const g=ctx.createRadialGradient(0,0,R*.2,0,0,R);g.addColorStop(0,`rgba(220,214,200,${.08*a})`);g.addColorStop(.8,`rgba(200,190,170,${.22*a})`);g.addColorStop(1,'rgba(200,190,170,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
        ctx.strokeStyle=hexA(ZDC.stone2,.6*a);ctx.lineWidth=3;for(let i=0;i<3;i++){const a0=t*(i%2?-.8:1)+i*2;ctx.beginPath();ctx.arc(0,0,R*(.7+.12*i),a0,a0+1.6);ctx.stroke();}}
      else if(Zn.kind==='embrace'){ctx.fillStyle=`rgba(60,48,36,${.25*a})`;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.strokeStyle=hexA(ZDC.amber,.7*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R*.98,0,TAU);ctx.stroke();
        ctx.strokeStyle=hexA(ZDC.stone2,.55*a);ctx.lineWidth=2;for(let i=0;i<12;i++){const an=i/12*TAU+t*.3;ctx.beginPath();ctx.moveTo(Math.cos(an)*R*.55,Math.sin(an)*R*.55);ctx.lineTo(Math.cos(an)*R*.92,Math.sin(an)*R*.92);ctx.stroke();}}
      else if(Zn.kind==='mono'){ctx.strokeStyle=hexA(ZDC.amber,.4*a);ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*18;ctx.beginPath();ctx.arc(0,0,Zn.taunt||R,0,TAU);ctx.stroke();ctx.setLineDash([]);}
      ctx.restore();
      if(Zn.kind==='vent'&&Math.random()<.35)zdSteam(Zn.x+rnd(-Zn.R*.5,Zn.R*.5),Zn.y+rnd(-Zn.R*.3,Zn.R*.3),4,1);
      if(Zn.kind==='pool'&&Math.random()<.2)zdEmbers(Zn.x+rnd(-Zn.R*.5,Zn.R*.5),Zn.y+rnd(-Zn.R*.3,Zn.R*.3),4,1,{spd:24});}
    /* heated enemies glow from the ground up */
    for(const e of ZDH){if(e.dead)continue;const n=zdHeatOf(e);if(!n||!zdVis(e.x,e.y))continue;const [x,y]=P(e.x,e.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(0,0,0,0,0,e.r+14);g.addColorStop(0,hexA(ZDC.fire,.12+.1*n));g.addColorStop(1,hexA(ZDC.fire,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,e.r+14,0,TAU);ctx.fill();ctx.restore();}}}
/* standing pieces: the monolith / boulder decoys, the mini volcano, Gaia's hands (one sorted object each) */
class ZdStand{constructor(o){Object.assign(this,{t:0,layer:'sorted',kind:'mono'},o);this.sy=this.y+2;}
  update(dt){this.t+=dt;const Zn=this.zone;if(Zn){this.x=Zn.x;this.y=Zn.y;this.sy=this.y+2;return ZD.zones.includes(Zn)||this.t<(this.fade||0);}return this.t<(this.life||1);}
  draw(){const [x,y]=P(this.x,this.y),up=eOutBack(Math.min(1,this.t/.25)),Zn=this.zone,a=Zn?Math.min(1,(Zn.until-gameTime)*3+.0001):Math.max(0,1-(this.t-(this.life||1)+.3)/.3);
    if(!(a>0))return;ctx.save();ctx.globalAlpha=Math.min(1,a);
    if(this.kind==='mono'||this.kind==='boulder'){const H=(this.kind==='mono'?70:34)*up,W=this.kind==='mono'?18:26;ctx.fillStyle='rgba(20,14,8,.3)';ctx.beginPath();ctx.ellipse(x,y+1,W*1.4,W*.45,0,0,TAU);ctx.fill();
      if(this.kind==='mono'){ctx.fillStyle='#cfc2a6';ctx.strokeStyle='#3e3024';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-W,y);ctx.lineTo(x-W*.8,y-H*.85);ctx.lineTo(x,y-H);ctx.lineTo(x+W*.85,y-H*.82);ctx.lineTo(x+W,y);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle='rgba(0,0,0,.14)';ctx.beginPath();ctx.moveTo(x+W*.1,y);ctx.lineTo(x+W*.1,y-H*.95);ctx.lineTo(x+W*.85,y-H*.82);ctx.lineTo(x+W,y);ctx.closePath();ctx.fill();
        const gl=.55+.35*Math.sin(this.t*5);ctx.strokeStyle=hexA(ZDC.amber,gl);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-W*.45,y-H*.62);ctx.quadraticCurveTo(x-W*.05,y-H*.78,x+W*.35,y-H*.62);ctx.quadraticCurveTo(x-W*.05,y-H*.46,x-W*.45,y-H*.62);ctx.stroke();
        ctx.fillStyle=hexA(ZDC.amber,gl);ctx.beginPath();ctx.ellipse(x-W*.05,y-H*.62,2.6,3.6,0,0,TAU);ctx.fill();zdGlow(x,y-H*.62,16,ZDC.amber,.35*gl);}
      else{zdChunk(x,y-H*.6,W,.3,'#b8a88c',1,4);zdGlow(x,y-H*.6,W*1.2,ZDC.amber,.15);}}
    else if(this.kind==='volcano'){const H=60*up,W=46;ctx.fillStyle='rgba(20,10,6,.35)';ctx.beginPath();ctx.ellipse(x,y+1,W*1.25,W*.4,0,0,TAU);ctx.fill();
      const g=ctx.createLinearGradient(x,y-H,x,y);g.addColorStop(0,'#3a2418');g.addColorStop(1,'#1e120c');ctx.fillStyle=g;ctx.strokeStyle='#0e0804';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-W,y);ctx.lineTo(x-W*.32,y-H);ctx.lineTo(x+W*.32,y-H);ctx.lineTo(x+W,y);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=hexA(ZDC.lava,.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-W*.2,y-H);ctx.lineTo(x-W*.35,y-H*.5);ctx.lineTo(x-W*.55,y-H*.15);ctx.moveTo(x+W*.15,y-H);ctx.lineTo(x+W*.32,y-H*.4);ctx.stroke();
      ctx.fillStyle=ZDC.fire2;ctx.beginPath();ctx.ellipse(x,y-H,W*.32,6,0,0,TAU);ctx.fill();zdGlow(x,y-H,40,ZDC.lava,.6+.3*Math.sin(this.t*12));if(Math.random()<.5)zdEmbers(this.x,this.y,H,2,{spd:70});}
    else if(this.kind==='hand'){const H=44*up,s=this.s||1,an=this.an||0;ctx.translate(x,y);ctx.scale(Math.cos(an)<0?-s:s,s);ctx.fillStyle='#b9a888';ctx.strokeStyle='#3e3024';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-7,-H*.6);for(let i=0;i<4;i++){const fx=-6+i*4.4;ctx.lineTo(fx,-H*.62);ctx.quadraticCurveTo(fx+1,-H-2+i*3,fx+3.4,-H*.62);}ctx.lineTo(10,-H*.5);ctx.quadraticCurveTo(16,-H*.55,13,-H*.35);ctx.lineTo(8,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=hexA(ZDC.amber,.7);ctx.beginPath();ctx.moveTo(-4,-H*.2);ctx.lineTo(0,-H*.4);ctx.lineTo(-2,-H*.55);ctx.stroke();}
    ctx.restore();}}
/* top layer: heat embers over heads, stone cracks, boss crack marks, the hero's guard / aegis / hide */
class ZdTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;return CHAR==='drake';}
  draw(){const t=this.t;
    for(const e of ZDH){if(e.dead)continue;const n=zdHeatOf(e);if(!n||!zdVis(e.x,e.y))continue;const h=(typeof MSPR_H==='function'?MSPR_H(e):(e.boss?62:48))+(e.z||0)+12,[x,y]=P(e.x,e.y,h);
      for(let i=0;i<n;i++){const px=x+(i-(n-1)/2)*10,py=y+Math.sin(t*6+i)*1.5;zdGlow(px,py,9,ZDC.fire,.55);ctx.save();ctx.translate(px,py);ctx.rotate(Math.PI/4);ctx.fillStyle=i===n-1&&n>=zdCap()?'#fff2c8':ZDC.fire2;ctx.strokeStyle='#5a1a08';ctx.lineWidth=1;ctx.fillRect(-3,-3,6,6);ctx.strokeRect(-3,-3,6,6);ctx.restore();}}
    for(const e of ZDS){if(!zdStoned(e)||!zdVis(e.x,e.y))continue;const H=(typeof MSPR_H==='function'?MSPR_H(e):48),[x,y]=P(e.x,e.y,(e.z||0));ctx.save();ctx.globalAlpha=.75;ctx.strokeStyle='#3a2c1e';ctx.lineWidth=1.3;ctx.lineCap='round';
      const s=((e.x*13+e.y*7)|0)%5;for(let i=0;i<3;i++){const sx=x+(-8+i*8+s),sy=y-H*(.25+.22*i);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+4,sy-6);ctx.lineTo(sx+1,sy-11);ctx.lineTo(sx+5,sy-15);ctx.stroke();}ctx.restore();}
    for(const e of enemies){if(e.dead||!(e._zCrk>gameTime)||!zdVis(e.x,e.y))continue;const h=(typeof MSPR_H==='function'?MSPR_H(e):62)*.6+(e.z||0),[x,y]=P(e.x,e.y,h);ctx.save();ctx.globalAlpha=Math.min(1,(e._zCrk-gameTime)*2)*.8;ctx.strokeStyle=ZDC.amber;ctx.lineWidth=1.6;
      ctx.beginPath();ctx.moveTo(x-8,y-10);ctx.lineTo(x-2,y-2);ctx.lineTo(x-6,y+6);ctx.moveTo(x-2,y-2);ctx.lineTo(x+7,y-4);ctx.stroke();ctx.restore();}
    const [px,py]=P(player.x,player.y,(player.z||0)+38);
    if(ZD.guardUntil>gameTime){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(ZDC.lava,.8);ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,py,30,-2.6,-.5);ctx.stroke();ctx.restore();zdGlow(px,py,34,ZDC.obs,.3);}
    if(ZD.hideN>0&&ZD.hideUntil>gameTime){for(let i=0;i<ZD.hideN;i++){const an=t*2.2+i*Math.PI,[hx,hy]=P(player.x+Math.cos(an)*40,player.y+Math.sin(an)*24,50);zdChunk(hx,hy,9,an,ZDC.obs,1,6);zdGlow(hx,hy,14,ZDC.lava,.4);}}
    if(ZD.aegis>0&&ZD.aegisUntil>gameTime){const s=ZD.form?1.4:1,[ax,ay]=P(player.x,player.y,(player.z||0)+34*s),r=38*s*(ZD.aegisBig?1.15:1),k=ZD.aegis/Math.max(1,ZD.aegisMax);ctx.save();
      ctx.fillStyle=`rgba(236,228,210,${.12+.1*k})`;ctx.strokeStyle=`rgba(255,240,205,${.45+.35*k})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ax,ay,r,r*.92,0,0,TAU);ctx.fill();ctx.stroke();
      ctx.strokeStyle=hexA(ZDC.amber,.35);for(let i=0;i<6;i++){const an=i/6*TAU+t*.4;ctx.beginPath();ctx.moveTo(ax+Math.cos(an)*r*.3,ay+Math.sin(an)*r*.3);ctx.lineTo(ax+Math.cos(an)*r*.95,ay+Math.sin(an)*r*.88);ctx.stroke();}ctx.restore();}
    if(hasBuff('znSkin')&&!ZD.form&&Math.random()<.2)zdRocks(player.x+rnd(-14,14),player.y+rnd(-8,8),1,{spd:20,z:rnd(20,60),up:.2,col:ZDC.marble});}}

/* ---- the dragon forms, FALLBACK: a monster sheet re-tinted once (the first placeholder), used only until the owner's pictures below have loaded ---- */
const ZD_FORM={A:{spr:'Glacier Wyrmling',key:'__zdMagma',flt:'hue-rotate(165deg) saturate(2.8) brightness(.62) contrast(1.35)',glow:ZDC.lava,vis:1.1},
               B:{spr:'Rock Lizard',key:'__zdMount',flt:'sepia(.35) saturate(.6) brightness(1.2) contrast(1.1)',glow:ZDC.amber,vis:1.15}};   /* vis: four-legged sheets read shorter than a standing hero */
function zdFormDef(f){const F=ZD_FORM[f],M=window.MSPR;if(!M)return null;if(M[F.key])return M[F.key];const src=M[F.spr];if(!src)return null;let cv=null;
  const my={file:src.file,cw:src.cw,ch:src.ch,px:src.px,py:src.py,ref:src.ref,h:src.h,sw:src.sw};
  Object.defineProperties(my,{ok:{get(){if(cv)return true;if(!src.ok)return false;const im=src.img;if(!im||!im.naturalWidth)return false;cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;const g=cv.getContext('2d');g.filter=F.flt;g.drawImage(im,0,0);return true;}},
    img:{get(){return cv||src.img;}},wok:{get:()=>false},wimg:{get:()=>null}});
  M[F.key]=my;return my;}
const zdHeroH=()=>228*SPR*CHAR_SCALE;
const zdFormSize=()=>ZD.form?ZD_BAL.form[ZD.form].size*(ZD.prim>gameTime?ZB.zxAscend.size:1):1;
function zdPose(dt){const E=ZD.E||(ZD.E={spr:null,boss:true,bsc:1,face:1,bob:0,st:{},atk:0,x:player.x,y:player.y,_mv:0,_px:player.x,_py:player.y,wd:0});
  const mv=Math.hypot(player.x-E._px,player.y-E._py);E._px=player.x;E._py=player.y;E._mv=mv>.25?.16:Math.max(0,E._mv-dt);E.wd+=Math.min(mv,24);
  const c=Math.cos(player.phi);if(Math.abs(c)>.22)ZD.face=c>0?1:-1;E.face=ZD.face;
  const a=player.action;E.atk=0;
  if(a&&!a.ended&&a.ev&&a.key!=='hurt'){let done=0,next=null;for(const v of a.ev){if(v.done)done++;else if(next==null||v.t<next)next=v.t;}
    if(a._zdDone==null)a._zdDone=0;if(done>a._zdDone){a._zdDone=done;E._hitT=gameTime;}if(next!=null&&next>a.t&&next-a.t<.5)E.atk=next-a.t;}
  else if(player.casting)E.atk=.2;}
/* ---- the dragon forms in the owner's art (2026-11-23 'หน้าตาประมาณนี้'): 8 still views per form
   (assets/heroes/drake/<magma|mountain>_<DIR>.webp, cut from his sheets by `tools/dir8cut.py pics`), moved by code.
   P[dir] = [w, h, ground x, ground y] in picture px; one scale for every view (his sheet draws them at one size),
   the S view's height = the form's height (hero height × ZD_BAL.form size). vis = extra size knob. ---- */
const ZD_PIC={A:{f:'magma',vis:1,P:{S:[323,297,159,289],SE:[297,290,164,281],E:[453,302,235,292],NE:[314,282,146,278],N:[324,312,162,292],NW:[304,294,142,289],W:[453,285,222,276],SW:[320,299,140,290]}},
              B:{f:'mountain',vis:1,P:{S:[299,346,148,342],SE:[342,347,170,342],E:[383,332,173,327],NE:[320,334,164,331],N:[313,334,156,331],NW:[348,339,173,337],W:[375,335,187,332],SW:[342,347,173,343]}}};
const ZD_FWD={S:[0,1],SE:[.75,.55],E:[1,0],NE:[.75,-.55],N:[0,-1],NW:[-.75,-.55],W:[-1,0],SW:[-.75,.55]};
const ZD_IM={},ZD_CV=new Map();
function zdPicLoad(){for(const f in ZD_PIC)for(const d in ZD_PIC[f].P){const k=f+d;if(ZD_IM[k])continue;const im=new Image();im.decoding='async';im.src='assets/heroes/drake/'+ZD_PIC[f].f+'_'+d+'.webp?v=1';ZD_IM[k]=im;}}
const zdPic=(f,d)=>{const im=ZD_IM[f+d];return im&&im.complete&&im.naturalWidth?im:null;};
/* cached copies: graded by the map's colour (no ctx.filter per frame), white for the hit flash, soft black for the shadow */
function zdCopy(f,d,kind,flt){const key=kind+f+d+'|'+(flt||'');let c=ZD_CV.get(key);if(c)return c;const im=zdPic(f,d);if(!im)return null;if(ZD_CV.size>40)ZD_CV.clear();
  const pad=kind==='s'?6:0;c=document.createElement('canvas');c.width=im.naturalWidth+pad*2;c.height=im.naturalHeight+pad*2;c.pad=pad;const g=c.getContext('2d');
  if(kind==='g'){g.filter=flt;g.drawImage(im,0,0);}
  else{if(kind==='s')g.filter='blur(3px)';g.drawImage(im,pad,pad);g.filter='none';g.globalCompositeOperation='source-in';g.fillStyle=kind==='s'?'#000':'#fff';g.fillRect(0,0,c.width,c.height);}
  ZD_CV.set(key,c);return c;}
function zdDrawDragon(){const f=ZD.form,D=ZD_PIC[f],E=ZD.E;if(!D||!E)return false;
  const fr=playerFrame(),d=(fr&&D.P[fr.d])?fr.d:(D.P[player.dir]?player.dir:'S'),im=zdPic(f,d);if(!im)return zdDrawDragonOld();
  const F=ZD_FORM[f],heavy=f==='B',t=gameTime,dt=Math.min(.1,Math.max(0,t-(E.lt||t)));E.lt=t;
  const pop=Math.min(1,(t-ZD.popT)/.3),sc=.7+.3*eOutBack(pop),H=zdHeroH()*zdFormSize()*(D.vis||1)*sc,[pw,ph,fx,fy]=D.P[d],k=H/D.P.S[1];
  const fw=ZD_FWD[d]||[0,1],side=Math.abs(fw[0])>.5,lr=fw[0]>=0?1:-1;
  /* motion: breathing · footfalls (bob + rock on the side views, sway from the front / back) · wind-up crouch → lunge on the hit · rear up for casts · shake when hit */
  let ox=0,oy=0,sx=1,sy=1,rot=0;
  const br=Math.sin(t*(heavy?1.7:2.3));sy+=.016*br;sx-=.008*br;
  const walk=E._mv>0?Math.min(1,E._mv/.12):0;
  if(walk){const s1=Math.sin(E.wd/(heavy?34:26)*Math.PI),a1=Math.abs(s1);oy-=a1*H*(heavy?.022:.03)*walk;sy-=(1-a1)*.022*walk;sx+=(1-a1)*.011*walk;
    if(side)rot+=s1*(heavy?.03:.022)*walk*lr;else ox+=s1*H*.018*walk;}
  const castOn=!!((fr&&fr.st==='buff')||player.casting);E.cu=(E.cu||0)+((castOn?1:0)-(E.cu||0))*Math.min(1,dt*9);
  const wu=E.atk>0&&!castOn?1-Math.min(1,E.atk/.32):0,hs=E._hitT!=null?Math.max(0,1-(t-E._hitT)/(heavy?.3:.24)):0,lean=(heavy?.055:.075)*(side?lr:0);
  if(wu>0){const w=wu*wu*(3-2*wu);ox-=fw[0]*H*.05*w;oy-=fw[1]*H*.025*w;sy*=1-.07*w;sx*=1+.035*w;rot-=lean*w;}
  if(hs>0){const s=hs*hs;ox+=fw[0]*H*.1*s;oy+=fw[1]*H*.045*s;sy*=1+.05*s;sx*=1-.025*s;rot+=lean*1.2*s;}
  if(E.cu>.01){const u=E.cu;oy-=H*.045*u;sy*=1+.05*u;sx*=1-.02*u;rot-=lean*.5*u;}
  if(ZD.fl>0)ox+=Math.sin(t*70)*H*.012*ZD.fl;
  if(player.z>2){const z=Math.min(1,player.z/40);sy*=1+.06*z;sx*=1-.03*z;}
  const [gx,gy]=P(player.x,player.y,0),[x,y]=P(player.x,player.y,player.z||0),mf=curMap&&mapHost()&&mapHost().charFilter,pa=JH('jgPlayerAlpha')?jgPlayerAlpha():1;
  const put=(img,pad)=>ctx.drawImage(img,-fx-(pad||0),-fy-(pad||0));
  /* shadow: the picture laid on the ground like every hero's (castShadow), a soft contact pool under the feet */
  if(curMap){const lift=Math.min(1,(player.z||0)/60),sil=zdCopy(f,d,'s');if(typeof softShadow==='function')softShadow(gx,gy,pw*k*.3*(1-.4*lift),pw*k*.09*(1-.4*lift),.9*(1-.5*lift));
    if(sil&&lift<.95){const MH=mapHost(),SU=MH&&MH.sun;ctx.save();ctx.translate(gx,gy);if(SU)ctx.transform(0,SU.kd,-SU.sx*.8,-SU.sy*.8,0,0);else ctx.transform(1,0,-.5,.34,0,0);
      ctx.globalAlpha*=(SU?.4:.36)*(1-lift)*pa;ctx.scale(k*sx,k*sy);put(sil,sil.pad);ctx.restore();}}
  else if(player.z>2){ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy,pw*k*.3,pw*k*.08,0,0,TAU);ctx.fill();ctx.restore();}
  /* light behind the body: the magma drake glows; stone does not (an additive amber halo turns white on snow) */
  const pulse=.5+.5*Math.sin(t*4);if(!heavy||ZD.prim>t)zdGlow(x,y-H*.45,H*.75,F.glow,(heavy?0:.1+.06*pulse)+(ZD.prim>t?.15:0));
  ctx.save();ctx.translate(x+ox,y+oy);ctx.rotate(rot);ctx.scale(k*sx,k*sy);ctx.globalAlpha*=pa;
  put((mf&&zdCopy(f,d,'g',mf))||im);
  if(ZD.fl>0){const wh=zdCopy(f,d,'w');if(wh){ctx.globalAlpha=pa*.55*ZD.fl;put(wh);}}
  ctx.restore();
  /* a faint lava light over the magma body, the Ascension ring, embers from the magma drake's back · pebbles shaken off the mountain drake as it walks */
  if(!heavy){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.06+.04*pulse;zdGlow(x,y-H*.4,H*.5,F.glow,.5);ctx.restore();}
  if(ZD.prim>t){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(ZDC.gold,.5+.3*pulse);ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x,y-H*.45,H*.62,H*.55,0,0,TAU);ctx.stroke();ctx.restore();}
  if(!heavy){if(Math.random()<.3*Q.p){const bx=player.x-fw[0]*pw*k*.25,by=player.y-fw[1]*8;zdEmbers(bx+rnd(-8,8),by+rnd(-4,4),H*rnd(.45,.85),1,{spd:30});}}
  else if(walk&&Math.random()<.16*Q.p)zdRocks(player.x+rnd(-.25,.25)*pw*k,player.y+rnd(-6,6),1,{spd:40,z:H*rnd(.2,.5),up:.25});
  return true;}
function zdDrawDragonOld(){const M=zdFormDef(ZD.form);if(!M||!M.ok)return false;const E=ZD.E;if(!E)return false;const F=ZD_FORM[ZD.form];
  const pop=Math.min(1,(gameTime-ZD.popT)/.3),sc=.7+.3*eOutBack(pop),H=zdHeroH()*zdFormSize()*(F.vis||1)*sc;E.spr=F.key;E.bsc=H/M.h;E.x=player.x;E.y=player.y;
  const [x,y]=P(player.x,player.y,player.z||0),mf=curMap&&mapHost()&&mapHost().charFilter;
  if(player.z>2){const [gx,gy]=P(player.x,player.y,0);ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy,M.sw*E.bsc,M.sw*E.bsc*.27,0,0,TAU);ctx.fill();ctx.restore();}
  /* glow behind the body */
  const pulse=.5+.5*Math.sin(gameTime*4);zdGlow(x,y-H*.45,H*.85,F.glow,.18+.1*pulse+(ZD.prim>gameTime?.15:0));
  ctx.save();if(mf)ctx.filter=mf;const ok=window.MSPR_DRAW(E,x,y,1,0,ZD.fl);ctx.restore();if(!ok)return false;
  /* lava / amber light on top + a few embers or steam from the back */
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.16+.1*pulse;zdGlow(x,y-H*.4,H*.5,F.glow,.5);ctx.restore();
  if(ZD.prim>gameTime){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=hexA(ZDC.gold,.5+.3*pulse);ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x,y-H*.45,H*.62,H*.55,0,0,TAU);ctx.stroke();ctx.restore();}
  if(Math.random()<.35*Q.p){if(ZD.form==='A')zdEmbers(player.x-ZD.face*H*.2+rnd(-8,8),player.y+rnd(-4,4),H*rnd(.4,.8),1,{spd:30});else zdSteam(player.x-ZD.face*H*.25+rnd(-6,6),player.y,H*rnd(.5,.8),1,{up:.6});}
  return true;}

/* ---- the drake's lasting visuals and per-frame logic ---- */
function zdEnsureVis(){const C=ZD._v||(ZD._v={});for(const [k,Q0] of [['g',ZdGround],['o',ZdTop],['b',ZdBits]])if(!C[k]||!fx.includes(C[k])){const o=new Q0();o.__gt='-';o._sk=null;C[k]=addFx(o);}}
function zdStatusIcons(){const b=player.buffs;if(!b)return;
  const hk=zdHeartKey();if(!ZD.form&&hk&&ZD.g>0){const need=zdNeedNow();b.zdBlood=b.zdBlood||{t:1e9,total:1e9};b.zdBlood.t=1e9;b.zdBlood.lbl=Math.floor(Math.min(ZD.g,need))+'/'+need;}else delete b.zdBlood;
  if(ZD.form){const k=ZD.form==='A'?'zdFormA':'zdFormB',drain=zdDrain(),left=Math.max(0,Math.min(ZD.until-gameTime,ZD.g/drain));b[k]=b[k]||{t:left,total:left};b[k].t=left;b[k].total=Math.max(b[k].total||0,left);delete b[ZD.form==='A'?'zdFormB':'zdFormA'];
    if(ZD.shield>0){b.zdShield=b.zdShield||{t:1e9,total:1e9};b.zdShield.t=1e9;b.zdShield.lbl=String(Math.round(ZD.shield));}else delete b.zdShield;
    if(ZD.prim>gameTime){b.zdPrim={t:ZD.prim-gameTime,total:ZB.zxAscend.T};}else delete b.zdPrim;}
  else{delete b.zdFormA;delete b.zdFormB;delete b.zdShield;delete b.zdPrim;}
  if(ZD.aegis>0&&ZD.aegisUntil>gameTime){b.zbAegis=b.zbAegis||{t:ZD.aegisUntil-gameTime,total:ZB.zbAegis.T};b.zbAegis.t=ZD.aegisUntil-gameTime;b.zbAegis.lbl=String(Math.round(ZD.aegis));}else delete b.zbAegis;
  if(ZD.hideN>0&&ZD.hideUntil>gameTime){b.zdHide={t:ZD.hideUntil-gameTime,total:ZB.zaGuard.dT,lbl:'×'+ZD.hideN};}else delete b.zdHide;}
const zdDrain=()=>ZD.form==='A'&&zdL('zaHeir')?ZB.zaHeir.drain:ZD_BAL.blood.drain;
/* statues: the monster sheet drawn grey and held in one pose (hooked lazily: monster-sprites.js loads after the main script) */
function zdHookMspr(){const M=window.MSPR_DRAW;if(typeof M!=='function'||M._zd)return;
  window.MSPR_DRAW=function(e,x,y,al,cold,fl){if(!(e&&!e.dead&&e._zSt>gameTime))return M.apply(this,arguments);const bob=e.bob;e.bob=.05-gameTime;ctx.save();ctx.filter='grayscale(1) sepia(.45) brightness(.82) contrast(1.25)';
    try{return M.call(this,e,x,y,al,0,fl);}finally{ctx.restore();e.bob=bob;}};window.MSPR_DRAW._zd=1;}   /* the old monster-sheet forms are made lazily now (fallback while the painted views load) */
class ZdCore{constructor(){this.t=0;this.layer='none';this.n=0;this.pr=0;}draw(){}
  update(dt){this.t+=dt;zdEnsureVis();zdHookMspr();
    /* a new map: zones, heat and statues stay behind */
    if(this.map!==curMap){if(this.map!==undefined){ZD.zones.length=0;ZDH.clear();ZDS.clear();}this.map=curMap;}
    if((this.pr-=dt)<=0){this.pr=1;const live=new Set(enemies);for(const e of ZDH)if(e.dead||!live.has(e))ZDH.delete(e);for(const e of ZDS)if(e.dead||!live.has(e))ZDS.delete(e);}
    ZD.fl=Math.max(0,ZD.fl-dt*5);
    /* burn: level × .4 per stack every second (direct, like bleed) */
    const bp=zdBurnPer();for(const e of ZDH){if(e.dead){ZDH.delete(e);continue;}if(!(e._zHT>gameTime)){e._zH=0;ZDH.delete(e);continue;}if(e.mbPart||e.wbPart||e.nohp)continue;
      e._zBT=(e._zBT||0)+dt;if(e._zBT>=1){e._zBT-=1;const d=Math.max(1,Math.round(PS.lv*bp*e._zH));e.hp-=d;e.flash=Math.max(e.flash||0,.3);dmgNum(e.x,e.y,44,d,'taken',{scale:.55});if(e.hp<=0&&!e.dead)kill(e);}}
    /* statues end: crumble */
    for(const e of ZDS){if(e.dead){ZDS.delete(e);continue;}if(!(e._zSt>gameTime)){ZDS.delete(e);zdRocks(e.x,e.y,4,{spd:60,z:20,col:'#c8bca6'});}}
    /* counts for Forge Fury / Gaia's Favour (every 0.1 s) */
    if((this.n-=dt)<=0){this.n=.1;let h=0,s=0;const R1=ZB.zaFury.R,R2=ZB.zbGaia.R;for(const e of enemies){if(e.dead)continue;const d=Math.abs(e.x-player.x)+Math.abs(e.y-player.y);if(d>R2*1.5)continue;const dd=Math.hypot(e.x-player.x,e.y-player.y);
        if(dd<=R1&&zdHeatOf(e))h++;if(dd<=R2&&(zdStoned(e)||zdCracked(e)))s++;}ZD.nHot=Math.min(ZB.zaFury.max,h);ZD.nStone=Math.min(ZB.zbGaia.max,s);}
    /* zones */
    for(let i=ZD.zones.length-1;i>=0;i--){const Zn=ZD.zones[i];if(Zn.follow){Zn.x=player.x;Zn.y=player.y;}if(gameTime>=Zn.until){ZD.zones.splice(i,1);try{Zn.end&&Zn.end(Zn);}catch(_){}continue;}
      Zn.acc=(Zn.acc||0)+dt;while(Zn.acc>=Zn.tick){Zn.acc-=Zn.tick;try{Zn.onTick&&Zn.onTick(Zn);}catch(_){}}}
    /* Stone Skin ended → Living Stone bursts */
    const sk=hasBuff('znSkin');if(ZD.skinOn&&!sk&&zdL('zxLiving')){const C=zdC('zxLiving',{q:'b'});for(const e of zdNear(player.x,player.y,ZB.zxLiving.R)){zdHit(e,ZB.zxLiving.dmg,'zxLiving',C);zdQuench(e,C);}addFx(new ZdQuake({x:player.x,y:player.y,R:ZB.zxLiving.R,stone:1}));shake(1.4);}ZD.skinOn=sk?1:0;
    /* Marble Aegis ran out */
    if(ZD.aegis>0&&ZD.aegisUntil<=gameTime)zdAegisBreak();
    /* human form: out of a fight 10 s → the blood cools */
    if(!ZD.form&&ZD.g>0&&gameTime-ZD.fightT>ZD_BAL.blood.idle)ZD.g=Math.max(0,ZD.g-ZD_BAL.blood.idleDrain*dt);
    /* dragon form */
    if(ZD.form){zdPose(dt);ZD.g-=zdDrain()*dt;if(ZD.g<=0||gameTime>=ZD.until||player.sitting||player.hp<=0)zdRevert(player.sitting?'sit':'time');}
    zdStatusIcons();
    if((this.ui=(this.ui||0)-dt)<=0){this.ui=.1;try{zdUi();}catch(_){}}
    return CHAR==='drake';}}
let zdCoreObj=null;
function zdEnsure(){if(CHAR!=='drake')return;if(!zdCoreObj||!fx.includes(zdCoreObj)){const o=fx.find(f=>f instanceof ZdCore);if(o)zdCoreObj=o;else{const c=new ZdCore();c.__gt='-';c._sk=null;zdCoreObj=addFx(c);}}zdEnsureVis();}
window.zdEnsure=zdEnsure;

/* ---- zones ---- */
function zdZone(o){const Zn=Object.assign({t0:gameTime,acc:0,tick:1,R:100},o);ZD.zones.push(Zn);return Zn;}
function zdPool(x,y){const C=zdC('zaPool',{q:'A'}),R=ZB.zaPool.R;let n=0;zdZone({kind:'pool',x,y,R,until:gameTime+ZB.zaPool.T,tick:ZB.zaPool.tick,onTick:Zn=>{n++;for(const e of zdNear(Zn.x,Zn.y,R)){zdHit(e,ZB.zaPool.dmg,'zaPool',C,{noTag:1});if(n%2===0)zdHeat(e,1);}}});}
function zdTaunt(e,dt){if(zdBig(e)||e.dead)return false;let best=null;for(const Zn of ZD.zones){if(!Zn.taunt||gameTime>=Zn.until)continue;const d=Math.hypot(e.x-Zn.x,e.y-Zn.y);if(d<=Zn.taunt+e.r&&(!best||d<best.d))best={Zn,d};}
  if(!best||zdStoned(e)||(e.st&&(e.st.stun>0||e.st.frozen>0)))return false;const Zn=best.Zn,dx=Zn.x-e.x,dy=Zn.y-e.y,L=Math.hypot(dx,dy)||1,stopD=e.r+(Zn.kind==='mono'?22:26);
  if(L>stopD){const sp=58*((e.m&&e.m.spd)||1)*(e.st.slow>0?.4:1)*(e.st.root>0?0:1);e.x+=dx/L*sp*dt;e.y+=dy/L*sp*dt;e.face=dx>0?1:-1;e.atk=0;}
  else{e.face=dx>0?1:-1;e.acd=Math.max(0,(e.acd||0)-dt);if(!(e.atk>0)&&e.acd<=0)e.atk=.6;else if(e.atk>0){e.atk-=dt;if(e.atk<=0){e._hitT=gameTime;e.acd=1.6;zdRocks(Zn.x,Zn.y,2,{spd:50,z:30,col:'#cfc2a6'});}}}
  return true;}

/* ---------------------------------------------------------------------
   5. FORMS
   --------------------------------------------------------------------- */
function zdMaxT(f,key){return zdLv(ZD_BAL.form.max,key)+(f==='A'&&zdL('zaHeir')?ZB.zaHeir.ext:0)+(f==='B'&&zdL('zbProph')?ZB.zbProph.ext:0)-(zdMuts(key).includes('rapid')?ZD_BAL.form.rapidCut:0);}
function zdTransform(f,key){if(ZD.form)return;const F=ZD_BAL.form[f],C=zdC(key,{q:f}),R=f==='A'?ZB.zaHeart.R:ZB.zbHeart.R,m=zdLv(f==='A'?ZB.zaHeart.dmg:ZB.zbHeart.dmg,key),maxT=zdMaxT(f,key);
  ZD.form=f;ZD.lastForm=f;ZD.t0=gameTime;ZD.until=gameTime+maxT;ZD.popT=gameTime;ZD.g=Math.max(ZD.g,zdNeedOf(key));ZD.revT=-99;
  ZD.shield=Math.round(PS.lv*F.shield+(f==='A'&&zdL('zxPlate')?D.stat.vit*ZB.zxPlate.vit:0));ZD.shieldMax=ZD.shield;
  player.iframes=Math.max(player.iframes||0,ZD_BAL.form.invul);
  if(ZD.primNext){ZD.primNext=0;ZD.prim=gameTime+ZB.zxAscend.T;}
  const x=player.x,y=player.y;
  for(const e of zdNear(x,y,R)){zdHit(e,m,key,C,{big:true,knock:[Math.atan2(e.y-y,e.x-x),f==='A'?40:0],noPrim:1});zdHeat(e,2);zdQuench(e,C);}
  if(f==='A'){addFx(new ZdPillar({x,y,R,col:ZDC.lava,H:260}));addFx(new ZdQuake({x,y,R,col:ZDC.fire}));zdRocks(x,y,14,{lava:1,spd:R*2.2,up:1.3});zdEmbers(x,y,20,20,{spd:R*1.6});}
  else{addFx(new ZdQuake({x,y,R,stone:1}));for(let i=0;i<9;i++){const an=i/9*TAU+rnd(-.15,.15),r=R*rnd(.55,.9);addFx(new ZdSpike({x:x+Math.cos(an)*r,y:y+Math.sin(an)*r*.8,s:rnd(.9,1.3),delay:i*.025}));}zdSteam(x,y,8,16,{big:1.4});}
  addFx(new DText({x,y,z:110,text:f==='A'?'MAGMA DRAKE':'MOUNTAIN DRAKE',color:f==='A'?ZDC.fire2:ZDC.stone2,size:16,life:1.2}));
  try{screenFlash(.25,f==='A'?'#ffd0a0':'#f4ead0');}catch(_){}shake(4);stop(90);zdUi(1);}
function zdRevert(why){if(!ZD.form)return;const f=ZD.form;ZD.form=null;ZD.revT=gameTime;ZD.shield=0;ZD.prim=0;ZD.hideN=0;
  const b=player.buffs;if(b){delete b.zdFormA;delete b.zdFormB;delete b.zdShield;delete b.zdPrim;delete b.zdHide;}
  ZD.g=zdL('zxWind')?ZB.zxWind.start:0;ZD.lockT=gameTime+ZD_BAL.blood.lock;
  if(zdL('zxWind')){const h=Math.round(PS.lv*ZB.zxWind.heal);player.hp=Math.min(player.maxHp,player.hp+h);dmgNum(player.x,player.y,80,'+'+h,'heal');}
  if(f==='B'&&zdL('zbProph'))ZD.prophT=gameTime+ZB.zbProph.T;
  zdSteam(player.x,player.y,10,18,{big:1.5});zdSteam(player.x,player.y,40,8,{big:1.2});
  addFx(new DText({x:player.x,y:player.y,z:96,text:'คืนร่าง',color:ZDC.steam,size:13,life:.9}));zdUi(1);}

/* =====================================================================
   6. SKILL ACTIONS
   ===================================================================== */
/* sword swings on the attack clip: n strikes, each lands on its measured contact frame (copied from the raven's thrusts) */
function zdSwings(o){faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),sp=(o.speed||1)*aspd();let s=[];const n=o.n||1;
  for(let i=0;i<n;i++){const last=i===n-1;s=s.concat(last?seq('attack',d,Math.max(0,ct-(i>0&&o.lastFrom!=null?o.lastFrom:3)),null,(o.lastSpeed||1.3)*sp):seq('attack',d,ct-2,ct+1,(o.midSpeed||3)*sp));}
  const ks=[];for(let i=0;i<n;i++)ks.push(seqIndex(s,'attack',ct,i));const ev=ks.map((kC,i)=>({t:seqTimeAt(s,kC),f:a=>o.f(a,i,i===n-1)}));
  const kL=ks[ks.length-1];return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,ks[0]),dur:seqTimeAt(s,kL+2),hitList:[],
    update:(a,dt)=>{player.glow={color:o.glow||ZDC.fire,k:a.t<seqTimeAt(s,kL)?.6:Math.max(0,1-(a.t-seqTimeAt(s,kL))/.3)};o.update&&o.update(a,dt);},events:ev.concat(o.events||[])});}
function zdCast(o){return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2,glow:o.glow||ZDC.fire,update:o.update,events:tP=>[{t:tP,f:()=>o.f(tP)}].concat(o.ev?o.ev(tP):[])});}
/* a held channel on the buff clip: wind up to the peak, hold T (action seconds); events relative to the peak */
function zdChannel(o){faceTo(o.phi??player.phi);const d=player.dir,pk=bPeak(d),s0=seq('buff',d,0,pk,o.speed||2.2),t0=seqTimeAt(s0,s0.length),s=s0.concat(hold('buff',d,pk,(o.T+(o.tail||.08))*1000));
  return act({key:o.key,name:o.name,seq:s,windup:t0,dur:t0+o.T+(o.tail||.08)-.02,hitList:[],update:(a,dt)=>{player.glow={color:o.glow||ZDC.fire,k:.7};o.update&&o.update(a,dt,t0);},events:(o.events||[]).map(v=>({t:t0+v.t,f:v.f}))});}
/* a dash / leap between two points (no human afterimages in dragon form) */
function zdDash(a,dt,t0,t1,sx,sy,dx,dy,arc,col){if(a.t<t0||a.t>t1+.001)return;const k=eInOut(clamp((a.t-t0)/(t1-t0),0,1));player.x=lerp(sx,dx,k);player.y=lerp(sy,dy,k);player.z=(arc||0)*Math.sin(Math.PI*k);
  if(!ZD.form){a.gt=(a.gt||0)-dt;if(a.gt<=0){a.gt=.03;try{addFx(new Ghost({snap:snapPlayer(),color:col||ZDC.fire}));}catch(_){}}}else if(Math.random()<.6)(col===ZDC.amber?zdSteam:zdEmbers)(player.x,player.y,10,1,{spd:40});}
function zdMoveAct(o){faceTo(o.phi);const T=o.T,s=seq('walk',player.dir,0,null,seqTotal(seq('walk',player.dir,0,null,1))/(T+(o.tail||.15)));
  return act({key:o.key,name:o.name,seq:s,windup:T,dur:T+(o.tail||.15),hitList:[],update:(a,dt)=>{zdDash(a,dt,0,T,o.sx,o.sy,o.dx,o.dy,o.arc||0,o.col);o.update&&o.update(a,dt);if(a.t>T)player.z=0;},events:o.events||[]});}

/* ---------- normal attack: forge blade (human) · Magma Claw (A drake) · Quake Stomp (B drake) ---------- */
function mkZdBasic(tgt){zdEnsure();if(ZD.form==='A')return zdClawBasic(tgt);if(ZD.form==='B')return zdStompBasic(tgt);
  const lv=Math.max(1,zdL('znHammer')),chain=ZB.znHammer.chain[lv-1]+(zdL('zxSmith')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),col=last?ZDC.stone2:ZDC.fire;
  return zdSwings({key:'basic',name:last?'Forge Blade · Quench':'Forge Blade '+(idx+1),phi,n:1,lastSpeed:last?1.1:2.0,glow:col,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+40+tgt.r)return;addFx(new ZdSwing({phi,col,R:60,heavy:last}));
    const d=hurt(tgt,last?ZB.znHammer.last:ZB.znHammer.hit,{skill:'basic',auto:true,br:'basic',knock:[phi,last?30:14]});
    if(d>0){ZD.fightT=gameTime;zdGain('basic');const C=zdC('basic',{q:'b'});if(last){if(zdL('zxSmith')){for(const e of zdNear(tgt.x,tgt.y,ZB.zxSmith.R))zdQuench(e,C);addFx(new ZdQuake({x:tgt.x,y:tgt.y,R:ZB.zxSmith.R,stone:1}));}else zdQuench(tgt,C);}else zdHeat(tgt,1);}
    zdSpark(tgt,last,col);shake(last?1.2:.6);stop(last?40:18);a.hitList.push(tgt);a.hitConfirmed=true;}});}
function zdClawBasic(tgt){const chain=4;if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),col=last?ZDC.stone2:ZDC.fire;
  return zdSwings({key:'basic',name:last?'Magma Bite':'Magma Claw '+(idx+1),phi,n:1,lastSpeed:last?1.15:2.1,glow:ZDC.lava,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+60+tgt.r)return;const C=zdC('basic',{q:'A'});
    if(last)addFx(new ZdBite({e:tgt,col:ZDC.stone2}));else addFx(new ZdClaw({e:tgt,ang:phi+(idx%2?.9:-.9),col:ZDC.fire}));
    const d=hurt(tgt,last?1.25:1.0,{skill:'basic',auto:true,br:'basic',knock:[phi,last?24:10]});
    if(d>0){ZD.fightT=gameTime;zdRefill(C,'hit');if(last)zdQuench(tgt,C);else zdHeat(tgt,1);if(ZD.prim>gameTime){zdHeat(tgt,1);zdQuench(tgt,C);}}
    zdSpark(tgt,last,col);shake(last?1.3:.7);stop(last?44:20);a.hitList.push(tgt);a.hitConfirmed=true;}});}
function zdStompBasic(tgt){const chain=3;if(gameTime-player.basicLast>1.3||player.basicIdx>=chain)player.basicIdx=0;const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt);
  return zdSwings({key:'basic',name:last?'Quake Stomp · Quench':'Quake Stomp '+(idx+1),phi,n:1,lastSpeed:last?1.0:1.6,glow:ZDC.amber,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    const C=zdC('zdStomp',{q:'B'}),cx=player.x+Math.cos(phi)*50,cy=player.y+Math.sin(phi)*50;addFx(new ZdQuake({x:cx,y:cy,R:70,stone:1}));zdSteam(cx,cy,6,4);
    for(const e of zdCone(player.x,player.y,phi,130,.8)){const d=hurt(e,.8,{skill:'zdStomp',br:'B',auto:true,knock:[phi,0]});if(d>0){ZD.fightT=gameTime;zdHeat(e,1);if(last)zdQuench(e,C);if(ZD.prim>gameTime)zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}
    shake(last?1.8:1);stop(last?40:20);}});}

/* ---------- BASIC ---------- */
function mkZnBreath(c){const t=zdTgt(c,ZB.znBreath.range+60),phi=zdPhi(c,t),R=zdLv(ZB.znBreath.r,'znBreath')*(ZD.form?1.5:1),m=zdLv(ZB.znBreath.dmg,'znBreath'),C=zdC('znBreath',{q:'b'}),half=ZB.znBreath.half;
  return zdCast({key:'znBreath',name:ZD.form?'Dragon Breath':'Bellows Breath',phi,speed:2.6,glow:ZDC.fire,f:()=>{addFx(new ZdCone({x:player.x,y:player.y,phi,R,half,col:ZDC.fire,life:.5,kind:'fire'}));
    for(const e of zdCone(player.x,player.y,phi,R,half)){if(zdHit(e,m,'znBreath',C)>0)zdHeat(e,ZB.znBreath.heat);zdSpark(e,false,ZDC.fire);}zdEmbers(player.x+Math.cos(phi)*R*.5,player.y+Math.sin(phi)*R*.5,20,10,{spd:R});shake(.9);}});}
function mkZnSkin(c){return zdCast({key:'znSkin',name:'Stone Skin',speed:2.6,glow:ZDC.stone2,f:()=>{addBuff('znSkin',ZB.znSkin.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:56,w:6,color:ZDC.stone2,life:.4}));zdRocks(player.x,player.y,8,{spd:60,z:30,up:.6,col:ZDC.marble});}});}
function mkZnLeap(c){const L=zdLv(ZB.znLeap.dist,'znLeap'),t=zdTgt(c,L);let [gx,gy]=zdGround(c,t,L*.7);const phi=Math.atan2(gy-player.y,gx-player.x),dd=Math.min(L,Math.hypot(gx-player.x,gy-player.y)),[dx,dy]=zdPathEnd(player.x,player.y,phi,dd),
    R=ZB.znLeap.R*(ZD.form?1.3:1),m=zdLv(ZB.znLeap.dmg,'znLeap'),C=zdC('znLeap',{q:'b'}),T=.42;
  return zdMoveAct({key:'znLeap',name:ZD.form?'Dragon Pounce':'Quenching Plunge',phi,T,sx:player.x,sy:player.y,dx,dy,arc:ZD.form?60:90,col:ZDC.fire,events:[{t:T,f:a=>{player.z=0;
    for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'znLeap',C,{big:true})>0){zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}addFx(new ZdQuake({x:player.x,y:player.y,R:R+20,stone:zdQMode(C)==='B'}));shake(2.4);stop(50);}}]});}
function mkZnRoar(c){return zdCast({key:'znRoar',name:ZD.form?'Dragon Roar · Blood Surge':'Dragon Roar',speed:2.2,glow:ZDC.fire,f:()=>{const R=ZB.znRoar.R,fl=zdLv(ZB.znRoar.flinch,'znRoar');
  for(const e of zdNear(player.x,player.y,R))if(!zdBig(e))applyCC(e,{flinch:fl});
  if(ZD.form)ZD.g=Math.min(ZD_BAL.blood.cap,ZD.g+ZB.znRoar.blood);else zdGain('roar');ZD.fightT=gameTime;
  for(let i=0;i<3;i++)setFxTimer(.001+i*.1,()=>addFx(new GRing({x:player.x,y:player.y,r0:20,r1:R+i*20,w:7-i*2,color:i?ZDC.fire2:ZDC.fire,life:.4})));addFx(new ZdCone({x:player.x,y:player.y,phi:player.phi,R:R,half:1.2,kind:'roar',life:.5}));shake(2);}});}

/* ---------- A · Etna's Magma Blade (human) ---------- */
function mkZaSear(c){const t=zdTgt(c,ZB.zaSear.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=zdLv(ZB.zaSear.dmg,'zaSear'),C=zdC('zaSear',{q:'A'});
  return zdSwings({key:'zaSear',name:'Searing Blade',phi,n:2,midSpeed:2.6,lastSpeed:1.5,lastFrom:1,glow:ZDC.lava,f:(a,i,last)=>{if(t.dead||dist(player,t)>ZB.zaSear.range+t.r+40)return;
    const col=last?ZDC.stone2:ZDC.lava;addFx(new ZdSwing({phi,col,R:66,heavy:last}));if(zdHit(t,m,'zaSear',C,{big:last})>0){if(!last)zdHeat(t,2);else zdQuench(t,C);}zdSpark(t,last,col);a.hitList.push(t);a.hitConfirmed=true;shake(last?1.4:.8);stop(last?40:24);}});}
function mkZaQuake(c){const R=ZB.zaQuake.R,m=zdLv(ZB.zaQuake.dmg,'zaQuake'),C=zdC('zaQuake',{q:'A'}),t=zdTgt(c,R+60);
  return zdSwings({key:'zaQuake',name:'Forge Quake',phi:zdPhi(c,t),n:1,lastSpeed:1.1,glow:ZDC.lava,f:a=>{for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zaQuake',C,{big:true})>0){zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}
    addFx(new ZdQuake({x:player.x,y:player.y,R,col:ZDC.fire}));shake(2.4);stop(50);zdAfter(player.x,player.y);}});}
function zdAfter(x,y){if(!zdL('zaAfter'))return;const C=zdC('zaAfter',{q:'A'});setFxTimer(ZB.zaAfter.delay,()=>{const R=ZB.zaAfter.R;for(const e of zdNear(x,y,R)){if(zdHit(e,zdLv(ZB.zaAfter.dmg,'zaAfter'),'zaAfter',C)>0)zdHeat(e,1);}addFx(new ZdQuake({x,y,R,col:ZDC.lava}));shake(1.6);});}
function mkZaRush(c){const t=zdTgt(c,ZB.zaRush.range),phi=zdPhi(c,t),L=ZB.zaRush.len,[dx,dy]=zdPathEnd(player.x,player.y,phi,L),sx=player.x,sy=player.y,m=zdLv(ZB.zaRush.dmg,'zaRush'),C=zdC('zaRush',{q:'A'}),T=.24,hit=new Set();
  return zdMoveAct({key:'zaRush',name:'Bellows Rush',phi,T,sx,sy,dx,dy,col:ZDC.fire,update:(a)=>{if(a.t>T+.02)return;for(const e of zdNear(player.x,player.y,ZB.zaRush.w)){if(hit.has(e))continue;hit.add(e);if(zdHit(e,m,'zaRush',C)>0){zdHeat(e,1);zdSpark(e,false,ZDC.fire);a.hitList.push(e);a.hitConfirmed=true;}}if(Math.random()<.8)zdEmbers(player.x,player.y,14,1,{spd:50});},
    events:[{t:T,f:()=>{zdCinder(sx,sy,player.x,player.y);shake(1);}}]});}
function zdCinder(x,y,x2,y2){if(!zdL('zaCinder'))return;const C=zdC('zaCinder',{q:'A'});let n=0;zdZone({kind:'cinder',x,y,x2,y2,R:Math.hypot(x2-x,y2-y)/2+30,until:gameTime+ZB.zaCinder.T,tick:ZB.zaCinder.tick,onTick:Zn=>{n++;for(const e of zdSeg(Zn.x,Zn.y,Zn.x2,Zn.y2,ZB.zaCinder.w)){zdHit(e,ZB.zaCinder.dmg,'zaCinder',C,{noTag:1});if(n%2===0)zdHeat(e,1);}}});}
function mkZaAnvil(c){const t=zdTgt(c,ZB.zaAnvil.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=zdLv(ZB.zaAnvil.dmg,'zaAnvil'),C=zdC('zaAnvil',{q:'A'});
  return zdSwings({key:'zaAnvil',name:'Anvil Cleaver',phi,n:1,lastSpeed:.95,lastFrom:4,glow:ZDC.stone2,f:a=>{if(t.dead||dist(player,t)>ZB.zaAnvil.range+t.r+40)return;addFx(new ZdSwing({phi,col:ZDC.stone2,R:70,heavy:1}));
    if(zdHit(t,m,'zaAnvil',C,{big:true})>0)zdQuench(t,C,{dbl:1});addFx(new ZdQuake({x:t.x,y:t.y,R:70,col:ZDC.fire}));zdSpark(t,true,ZDC.stone2);a.hitList.push(t);a.hitConfirmed=true;shake(2.6);stop(70);}});}
function mkZaGeyser(c){const t=zdTgt(c,ZB.zaGeyser.range),[x,y]=zdGround(c,t,160),R=ZB.zaGeyser.R,m=zdLv(ZB.zaGeyser.dmg,'zaGeyser'),C=zdC('zaGeyser',{q:'A'});
  return zdCast({key:'zaGeyser',name:'Lava Geyser',phi:Math.atan2(y-player.y,x-player.x),speed:2.2,glow:ZDC.lava,f:()=>{for(let i=0;i<ZB.zaGeyser.n;i++)setFxTimer(.001+i*ZB.zaGeyser.gap,()=>{
      for(const e of zdNear(x,y,R)){if(zdHit(e,m,'zaGeyser',C)>0)zdHeat(e,1);}addFx(new ZdPillar({x,y,R,col:ZDC.lava,H:150+i*30,life:.45}));zdRocks(x,y,6,{lava:1,spd:R*1.4,up:1.4});zdEmbers(x,y,30,6,{spd:R});shake(1.2);
      if(i===ZB.zaGeyser.n-1&&zdL('zaPool'))zdPool(x,y);});}});}
function mkZaGuard(c){const T=ZB.zaGuard.T,s=hold('buff',player.dir,2,T*1000);ZD.guardUntil=gameTime+zdRT(T)+.05;
  return act({key:'zaGuard',name:'Obsidian Guard',seq:s,windup:0,dur:T,hitList:[],update:()=>{player.glow={color:ZDC.lava,k:.7};}});}
function mkZaUlt(c){const n=ZB.zaUlt.n,R=ZB.zaUlt.R,gap=ZB.zaUlt.gap,m=zdLv(ZB.zaUlt.dmg,'zaUlt'),C=zdC('zaUlt',{q:'A'});
  return buffAct({key:'zaUlt',name:'Etna Erupts',speed:1.4,glow:ZDC.lava,events:tP=>[{t:.02,f:()=>{skyDarkT=.5;}},{t:tP,f:()=>{const cx=player.x,cy=player.y;zdGain('ult');
    addFx(new ZdStand({kind:'volcano',x:cx+Math.cos(player.phi)*20,y:cy+Math.sin(player.phi)*12,life:1.9}));addFx(new ZdQuake({x:cx,y:cy,R:90,col:ZDC.fire}));shake(3);
    for(let i=0;i<n;i++)setFxTimer(.15+i*gap,()=>{const L=zdNear(cx,cy,R);const e=L.length?L[i%L.length]:null,an=rnd(0,TAU),r=rnd(40,R),tx=e?e.x+rnd(-14,14):cx+Math.cos(an)*r,ty=e?e.y+rnd(-10,10):cy+Math.sin(an)*r*.8;
      addFx(new ZdMeteor({x:tx,y:ty,T:.32,H:180,s:.8,onLand:(lx,ly)=>{for(const q of zdNear(lx,ly,52)){zdHit(q,m,'zaUlt',C);zdHeat(q,1);}zdRocks(lx,ly,4,{lava:1,spd:80});addFx(new ZdFlash({x:lx,y:ly,z:12,r:26,col:ZDC.fire}));shake(.9);}}));});
    setFxTimer(.15+n*gap+.45,()=>{skyDarkT=0;for(const e of zdNear(cx,cy,R)){zdHeat(e,zdCap());zdQuench(e,C);}addFx(new ZdQuake({x:cx,y:cy,R,col:ZDC.lava}));addFx(new DText({x:cx,y:cy,z:120,text:'ETNA ERUPTS',color:ZDC.fire2,size:16,life:1}));shake(4);stop(80);});}}]});}

/* ---------- A · dragon moves (Magma Drake) ---------- */
function dmZaSear(c){const t=zdTgt(c,ZB.zaSear.range+30);if(!t){msg('ไม่มีเป้าหมาย');return null;}const phi=angTo(t),m=zdLv(ZB.zaSear.dd,'zaSear'),C=zdC('zaSear',{q:'A'});
  return zdSwings({key:'zaSear',name:'Molten Maul',phi,n:3,midSpeed:2.8,lastSpeed:1.5,lastFrom:1,glow:ZDC.lava,f:(a,i,last)=>{if(t.dead||dist(player,t)>ZB.zaSear.range+t.r+70)return;
    if(last)addFx(new ZdBite({e:t}));else addFx(new ZdClaw({e:t,ang:phi+(i?.9:-.9),col:ZDC.fire}));if(zdHit(t,m,'zaSear',C,{big:last})>0){if(last)zdQuench(t,C);else zdHeat(t,1);}zdSpark(t,last,last?ZDC.stone2:ZDC.fire);a.hitList.push(t);a.hitConfirmed=true;shake(last?1.6:.9);stop(last?44:24);}});}
function dmZaQuake(c){const t=zdTgt(c,ZB.zaQuake.dRange),phi=zdPhi(c,t),sx=player.x,sy=player.y,L=t?Math.max(0,Math.min(ZB.zaQuake.dRange,dist(player,t)-t.r*.3)):120,[dx,dy]=zdPathEnd(sx,sy,phi,L),R=ZB.zaQuake.dR,m=zdLv(ZB.zaQuake.dd,'zaQuake'),C=zdC('zaQuake',{q:'A'}),T=.5;
  return zdMoveAct({key:'zaQuake',name:'Volcano Dive',phi,T,sx,sy,dx,dy,arc:150,col:ZDC.fire,events:[{t:T,f:a=>{player.z=0;for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zaQuake',C,{big:true})>0){zdHeat(e,1);zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}
    addFx(new ZdQuake({x:player.x,y:player.y,R,col:ZDC.lava}));addFx(new ZdPillar({x:player.x,y:player.y,R,col:ZDC.lava,H:180,life:.5}));zdRocks(player.x,player.y,10,{lava:1,spd:R*1.6});shake(3.4);stop(80);zdAfter(player.x,player.y);}}]});}
function dmZaRush(c){const t=zdTgt(c,ZB.zaRush.dlen),phi=zdPhi(c,t),[dx,dy]=zdPathEnd(player.x,player.y,phi,ZB.zaRush.dlen),sx=player.x,sy=player.y,m=zdLv(ZB.zaRush.dd,'zaRush'),C=zdC('zaRush',{q:'A'}),T=.28,hit=new Set();
  return zdMoveAct({key:'zaRush',name:'Inferno Charge',phi,T,sx,sy,dx,dy,col:ZDC.fire,update:(a)=>{if(a.t>T+.02)return;for(const e of zdNear(player.x,player.y,ZB.zaRush.w+10)){if(hit.has(e))continue;hit.add(e);
      const side=Math.sign(Math.sin(Math.atan2(e.y-player.y,e.x-player.x)-phi))||1;if(zdHit(e,m,'zaRush',C,{big:true,knock:[phi+side*Math.PI/2,zdBig(e)?0:110]})>0){zdHeat(e,2);zdSpark(e,true,ZDC.fire);a.hitList.push(e);a.hitConfirmed=true;}}zdEmbers(player.x,player.y,20,2,{spd:70});},
    events:[{t:T,f:()=>{zdCinder(sx,sy,player.x,player.y);addFx(new ZdQuake({x:player.x,y:player.y,R:60,col:ZDC.fire}));shake(1.8);}}]});}
function dmZaAnvil(c){const R=ZB.zaAnvil.dR,m=zdLv(ZB.zaAnvil.dd,'zaAnvil'),C=zdC('zaAnvil',{q:'A'}),t=zdTgt(c,R);
  return zdSwings({key:'zaAnvil',name:'Tail Hammer',phi:zdPhi(c,t),n:1,lastSpeed:1.0,lastFrom:4,glow:ZDC.lava,f:a=>{addFx(new ZdSwing({phi:player.phi+Math.PI,col:ZDC.fire,R,span:TAU*.95,life:.35,heavy:1}));
    for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zaAnvil',C,{big:true,knock:[Math.atan2(e.y-player.y,e.x-player.x),zdBig(e)?0:60]})>0){zdQuench(e,C,{dbl:1});a.hitList.push(e);a.hitConfirmed=true;}}shake(2.6);stop(60);}});}
function dmZaGeyser(c){const t=zdTgt(c,ZB.zaGeyser.dR+60),phi=zdPhi(c,t),R=ZB.zaGeyser.dR,m=zdLv(ZB.zaGeyser.dd,'zaGeyser'),C=zdC('zaGeyser',{q:'A'}),T=ZB.zaGeyser.dT,tk=ZB.zaGeyser.dTick,n=Math.round(T/tk),ev=[];
  ev.push({t:.001,f:()=>addFx(new ZdCone({x:player.x,y:player.y,phi,R,half:.5,kind:'lava',life:zdRT(T)+.1,follow:1}))});
  for(let i=0;i<n;i++)ev.push({t:.02+i*tk,f:a=>{for(const e of zdCone(player.x,player.y,phi,R,.5)){if(zdHit(e,m,'zaGeyser',C)>0){zdHeat(e,1);a.hitList.push(e);a.hitConfirmed=true;}}zdRocks(player.x+Math.cos(phi)*R*.5,player.y+Math.sin(phi)*R*.5,2,{lava:1,spd:90});}});
  if(zdL('zaPool'))ev.push({t:T-.04,f:()=>zdPool(player.x+Math.cos(phi)*R*.62,player.y+Math.sin(phi)*R*.62)});
  return zdChannel({key:'zaGeyser',name:'Magma Breath',phi,T,glow:ZDC.lava,events:ev});}
function dmZaGuard(c){ZD.hideN=ZB.zaGuard.dn;ZD.hideUntil=gameTime+ZB.zaGuard.dT;return zdCast({key:'zaGuard',name:'Obsidian Hide',speed:3,glow:ZDC.obs,f:()=>{zdRocks(player.x,player.y,6,{spd:50,z:40,col:ZDC.obs});}});}
function dmZaUlt(c){const n=ZB.zaUlt.dn,R=ZB.zaUlt.dR,m=zdLv(ZB.zaUlt.ddmg,'zaUlt'),fin=zdLv(ZB.zaUlt.dfin,'zaUlt'),C=zdC('zaUlt',{q:'A'}),T=1.6,cx=player.x,cy=player.y,ev=[];
  ev.push({t:.001,f:()=>{skyDarkT=.6;player.iframes=Math.max(player.iframes||0,zdRT(T)+.3);}});
  ev.push({t:.05,f:()=>{for(let i=0;i<n;i++)setFxTimer(.15+i*.08,()=>{const L=zdNear(cx,cy,R+60),e=L.length?L[i%L.length]:null,an=rnd(0,TAU),r=rnd(30,R),tx=e?e.x+rnd(-16,16):cx+Math.cos(an)*r,ty=e?e.y+rnd(-12,12):cy+Math.sin(an)*r*.8;
    addFx(new ZdMeteor({x:tx,y:ty,T:.34,H:280,s:1,onLand:(lx,ly)=>{for(const q of zdNear(lx,ly,58)){zdHit(q,m,'zaUlt',C,{noPrim:1});zdHeat(q,1);}zdRocks(lx,ly,5,{lava:1,spd:100});addFx(new ZdFlash({x:lx,y:ly,z:12,r:30,col:ZDC.fire}));shake(1.1);}}));});}});
  ev.push({t:T-.02,f:a=>{player.z=0;for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,fin,'zaUlt',C,{big:true,noPrim:1})>0){zdQuench(e,C,{dbl:1});a.hitList.push(e);a.hitConfirmed=true;}}
    addFx(new ZdQuake({x:player.x,y:player.y,R:R+30,col:ZDC.lava}));addFx(new ZdPillar({x:player.x,y:player.y,R,col:ZDC.lava,H:300}));addFx(new DText({x:player.x,y:player.y,z:130,text:'CATACLYSM',color:ZDC.fire2,size:17,life:1.1}));
    skyDarkT=0;shake(5);stop(110);try{screenFlash(.3,'#ffd0a0');}catch(_){}setFxTimer(.25,()=>zdRevert('finisher'));}});
  return zdChannel({key:'zaUlt',name:'Cataclysm',T,glow:ZDC.lava,update:(a,dt,t0)=>{const k=clamp((a.t-t0)/T,0,1);player.z=k<.75?150*eOut(Math.min(1,k/.25)):150*(1-eIn((k-.75)/.25));},events:ev});}

/* ---------- B · Stone Oracle of Delphi (human) ---------- */
function zdStare(t,C,m,key){if(!zdL('zxStare'))return;let b=null,bd=ZB.zxStare.R;for(const e of enemies){if(e.dead||e===t||e.hidden)continue;const d=Math.hypot(e.x-t.x,e.y-t.y);if(d<bd){bd=d;b=e;}}if(!b)return;
  addFx(new ZdSpike({x:b.x,y:b.y,s:.9}));if(zdHit(b,m*.6,key,C)>0)zdQuench(b,C,{min:1});}
function mkZbSpike(c){const t=zdTgt(c,ZB.zbSpike.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const m=zdLv(ZB.zbSpike.dmg,'zbSpike'),C=zdC('zbSpike',{q:'B'});
  return zdCast({key:'zbSpike',name:'Stone Spike',phi:angTo(t),speed:2.4,glow:ZDC.amber,f:()=>{if(t.dead)return;zdHeat(t,1);zdSteam(t.x,t.y,4,6);addFx(new ZdQuake({x:t.x,y:t.y,R:40,stone:1}));
    setFxTimer(.22,()=>{if(t.dead)return;addFx(new ZdSpike({x:t.x,y:t.y,s:1.2}));if(zdHit(t,m,'zbSpike',C,{big:true})>0)zdQuench(t,C);zdStare(t,C,m,'zbSpike');shake(1);});}});}
function mkZbVent(c){const t=zdTgt(c,ZB.zbVent.range),[x,y]=zdGround(c,t,150),R=ZB.zbVent.R,m=zdLv(ZB.zbVent.dmg,'zbVent'),C=zdC('zbVent',{q:'B'});
  return zdCast({key:'zbVent',name:'Vapour Vent',phi:Math.atan2(y-player.y,x-player.x),speed:2.2,glow:ZDC.amber,f:()=>{zdVentZone(x,y,R,m,C,0);addFx(new ZdQuake({x,y,R,stone:1}));zdSteam(x,y,4,12,{big:1.3});}});}
function zdVentZone(x,y,R,m,C,follow){const tr=new Map();return zdZone({kind:'vent',x,y,R,follow,until:gameTime+ZB.zbVent.T,tick:.5,n:0,onTick:Zn=>{Zn.n++;const L=zdNear(Zn.x,Zn.y,R);
  if(Zn.n%2===0)for(const e of L){if(zdHit(e,m,'zbVent',C)>0)zdHeat(e,1);}
  if(zdL('zbTrance'))for(const e of L){const v=(tr.get(e)||0)+.5;if(v>=ZB.zbTrance.need){tr.set(e,0);if(zdBig(e))applyCC(e,{slow:1});else applyCC(e,{stun:ZB.zbTrance.stun});}else tr.set(e,v);}}});}
function mkZbChain(c){const t=zdTgt(c,ZB.zbChain.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const m=zdLv(ZB.zbChain.dmg,'zbChain'),root=zdLv(ZB.zbChain.root,'zbChain'),C=zdC('zbChain',{q:'B'});
  return zdCast({key:'zbChain',name:'Earth Chains',phi:angTo(t),speed:2.4,glow:ZDC.amber,f:()=>{const L=[t];if(zdL('zbLink')){const o=enemies.filter(e=>!e.dead&&!e.hidden&&e!==t&&Math.hypot(e.x-t.x,e.y-t.y)<=ZB.zbLink.R).sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y));L.push(...o.slice(0,ZB.zbLink.n));}
    for(const e of L){if(e.dead)continue;jgRoot(e,root);addFx(new ZdChains({e,T:root}));if(zdHit(e,m,'zbChain',C,{big:e===t})>0)zdQuench(e,C);addFx(new ZdQuake({x:e.x,y:e.y,R:36,stone:1}));}shake(1.2);}});}
function mkZbQuake(c){const R=ZB.zbQuake.R,m=zdLv(ZB.zbQuake.dmg,'zbQuake'),C=zdC('zbQuake',{q:'B'}),t=zdTgt(c,R+60);
  return zdSwings({key:'zbQuake',name:'Quake Ring',phi:zdPhi(c,t),n:1,lastSpeed:1.1,glow:ZDC.amber,f:a=>{for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zbQuake',C,{big:true})>0){zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}
    addFx(new ZdQuake({x:player.x,y:player.y,R,stone:1}));shake(2.2);stop(40);zdFault(player.x,player.y,player.phi);}});}
function zdFault(x,y,phi){if(!zdL('zbFault'))return;const C=zdC('zbFault',{q:'B'}),L=ZB.zbFault.len,[ex,ey]=zdPathEnd(x,y,phi,L);
  for(let i=1;i<=6;i++){const k=i/6;setFxTimer(.04*i,()=>{addFx(new ZdSpike({x:lerp(x,ex,k)+rnd(-8,8),y:lerp(y,ey,k)+rnd(-5,5),s:.8+.1*i}));});}
  setFxTimer(.18,()=>{for(const e of zdSeg(x,y,ex,ey,ZB.zbFault.w)){if(zdHit(e,ZB.zbFault.dmg,'zbFault',C)>0)zdQuench(e,C);}shake(1.2);});}
function mkZbMono(c){const t=zdTgt(c,ZB.zbMono.range),[x,y]=zdGround(c,t,150),C=zdC('zbMono',{q:'B'}),m=zdLv(ZB.zbMono.dmg,'zbMono');
  return zdCast({key:'zbMono',name:'Monolith',phi:Math.atan2(y-player.y,x-player.x),speed:2.2,glow:ZDC.amber,f:()=>{const [mx,my]=zdFree(x,y)?[x,y]:zdPathEnd(player.x,player.y,Math.atan2(y-player.y,x-player.x),Math.hypot(x-player.x,y-player.y));
    const Zn=zdZone({kind:'mono',x:mx,y:my,R:ZB.zbMono.R,taunt:ZB.zbMono.taunt,until:gameTime+ZB.zbMono.T,tick:1,onTick:Z0=>{if(!zdL('zbOracle'))return;let b=null,bd=ZB.zbOracle.R;for(const e of enemies){if(e.dead||e.hidden)continue;const d=Math.hypot(e.x-Z0.x,e.y-Z0.y);if(d<bd){bd=d;b=e;}}
        if(b){zdSteam(b.x,b.y,6,4);addFx(new ZdFlash({x:b.x,y:b.y,z:20,r:16,col:ZDC.amber}));if(zdHit(b,ZB.zbOracle.dmg,'zbOracle',C,{noTag:1})>0)zdHeat(b,1);}},
      end:Z0=>{for(const e of zdNear(Z0.x,Z0.y,Z0.R)){if(zdHit(e,m,'zbMono',C,{big:true})>0)zdQuench(e,C);}addFx(new ZdQuake({x:Z0.x,y:Z0.y,R:Z0.R,stone:1}));zdRocks(Z0.x,Z0.y,12,{spd:150,z:40,col:'#cfc2a6'});shake(2);}});
    addFx(new ZdStand({kind:'mono',x:mx,y:my,zone:Zn}));addFx(new ZdQuake({x:mx,y:my,R:60,stone:1}));shake(1.4);}});}
function mkZbAegis(c){const big=ZD.form==='B';return zdCast({key:'zbAegis',name:big?'Mountain Hide':'Marble Aegis',speed:2.6,glow:ZDC.stone2,f:()=>{const v=Math.round((PS.lv*ZB.zbAegis.lv+D.stat.vit*ZB.zbAegis.vit)*(big?2:1));
  ZD.aegis=v;ZD.aegisMax=v;ZD.aegisUntil=gameTime+ZB.zbAegis.T;ZD.aegisBig=big?1:0;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:60,w:6,color:ZDC.stone2,life:.4}));zdRocks(player.x,player.y,8,{spd:60,z:40,col:ZDC.marble});}});}
function zdAegisBreak(){ZD.aegis=0;ZD.aegisUntil=0;const C=zdC('zbAegis',{q:'B'});for(const e of zdNear(player.x,player.y,ZB.zbAegis.R))zdQuench(e,C,{min:ZD.aegisBig?1:0});addFx(new ZdQuake({x:player.x,y:player.y,R:ZB.zbAegis.R,stone:1}));zdRocks(player.x,player.y,10,{spd:140,z:40,col:ZDC.marble});shake(1.4);}
function mkZbUlt(c){const R=ZB.zbUlt.R,m=zdLv(ZB.zbUlt.dmg,'zbUlt'),C=zdC('zbUlt',{q:'B'});
  return buffAct({key:'zbUlt',name:"Gorgon's Eye",speed:1.4,glow:ZDC.amber,events:tP=>[{t:.02,f:()=>{skyDarkT=.55;}},{t:tP,f:()=>{const cx=player.x,cy=player.y;zdGain('ult');
    addFx(new ZdVentRing({x:cx,y:cy,R,T:1.5}));
    for(let w=0;w<ZB.zbUlt.waves;w++)setFxTimer(.001+w*.45,()=>{for(const e of zdNear(cx,cy,R)){if(zdHit(e,m,'zbUlt',C)>0)zdHeat(e,1);}zdSteam(cx,cy,6,10,{big:1.4});addFx(new GRing({x:cx,y:cy,r0:20,r1:R,w:8,color:ZDC.stone2,life:.4}));shake(1);});
    setFxTimer(.95,()=>addFx(new ZdEye({x:cx,y:cy,R})));
    setFxTimer(1.55,()=>{skyDarkT=0;for(const e of zdNear(cx,cy,R)){if(zdBig(e)){zdStone(e,ZD_BAL.heat.cap*2,C);continue;}zdQuench(e,C,{min:1,force:1,T:ZB.zbUlt.stat});if(!zdStoned(e))zdStone(e,1,C,{force:1,T:ZB.zbUlt.stat});}
      addFx(new DText({x:cx,y:cy,z:120,text:"GORGON'S EYE",color:ZDC.amber,size:16,life:1}));shake(3);stop(70);});}}]});}
/* the Delphi rift ring under the ultimate */
class ZdVentRing{constructor(o){Object.assign(this,{t:0,layer:'ground',R:240,T:1.5},o);}update(dt){this.t+=dt;if(Math.random()<.7)zdSteam(this.x+rnd(-this.R,this.R)*.8,this.y+rnd(-this.R,this.R)*.6,4,1,{big:1.2});return this.t<this.T;}
  draw(){const k=this.t/this.T,a=Math.min(1,this.t*4,(this.T-this.t)*3),[x,y]=P(this.x,this.y);ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.fillStyle=`rgba(40,30,22,${.32*a})`;ctx.beginPath();ctx.arc(0,0,this.R,0,TAU);ctx.fill();
    ctx.strokeStyle=hexA(ZDC.amber,.8*a);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,this.R*(.95+.03*Math.sin(this.t*9)),0,TAU);ctx.stroke();ctx.lineWidth=2;for(let i=0;i<8;i++){const an=i/8*TAU+.2;ctx.beginPath();ctx.moveTo(Math.cos(an)*this.R*.2,Math.sin(an)*this.R*.2);ctx.lineTo(Math.cos(an+.1)*this.R*.6,Math.sin(an+.1)*this.R*.6);ctx.lineTo(Math.cos(an-.05)*this.R*.92,Math.sin(an-.05)*this.R*.92);ctx.stroke();}ctx.restore();}}

/* ---------- B · dragon moves (Mountain Drake) ---------- */
function dmZbSpike(c){const t=zdTgt(c,ZB.zbSpike.dR),phi=zdPhi(c,t),R=ZB.zbSpike.dR,half=ZB.zbSpike.half,m=zdLv(ZB.zbSpike.dd,'zbSpike'),C=zdC('zbSpike',{q:'B'});
  return zdCast({key:'zbSpike',name:'Petrifying Roar',phi,speed:2.4,glow:ZDC.amber,f:()=>{addFx(new ZdCone({x:player.x,y:player.y,phi,R,half,kind:'roar',life:.55}));const L=zdCone(player.x,player.y,phi,R,half);
    for(const e of L){if(zdHit(e,m,'zbSpike',C)>0)zdQuench(e,C,{min:1});}if(L[0])zdStare(L[0],C,m,'zbSpike');shake(1.6);}});}
function dmZbVent(c){const m=zdLv(ZB.zbVent.dd,'zbVent'),R=ZB.zbVent.dR,C=zdC('zbVent',{q:'B'}),ev=[];
  for(let i=0;i<3;i++)ev.push({t:.02+i*.26,f:a=>{for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zbVent',C)>0){zdHeat(e,1);a.hitList.push(e);a.hitConfirmed=true;}}addFx(new ZdQuake({x:player.x,y:player.y,R,stone:1}));zdSteam(player.x,player.y,6,8,{big:1.3});shake(1.4);}});
  ev.push({t:.6,f:()=>zdVentZone(player.x,player.y,R,zdLv(ZB.zbVent.dmg,'zbVent'),C,1)});
  return zdChannel({key:'zbVent',name:'Fumarole Stomp',T:.66,glow:ZDC.amber,events:ev});}
function dmZbChain(c){const t=zdTgt(c,ZB.zbChain.range*.5+60);if(!t){msg('ไม่มีเป้าหมาย');return null;}const m=zdLv(ZB.zbChain.dd,'zbChain'),C=zdC('zbChain',{q:'B'}),big=zdBig(t);
  return zdSwings({key:'zbChain',name:'Mountain Grip',phi:angTo(t),n:3,midSpeed:2.2,lastSpeed:1.3,lastFrom:1,glow:ZDC.amber,f:(a,i,last)=>{if(t.dead||dist(player,t)>ZB.zbChain.range*.5+t.r+80)return;
    if(i===0){if(!big){t.z=Math.max(t.z||0,.1);t.vz=420;t.atk=0;}zdRocks(t.x,t.y,4,{spd:60});return;}
    const d=zdHit(t,m,'zbChain',C,{big:true,koMul:big?3:1});if(d>0){if(!big)applyCC(t,{stun:ZB.zbChain.stun});if(last)zdQuench(t,C,{min:1});a.hitList.push(t);a.hitConfirmed=true;}
    addFx(new ZdQuake({x:t.x,y:t.y,R:70,stone:1}));zdSpark(t,true,ZDC.stone2);shake(2.2);stop(60);}});}
function dmZbQuake(c){const t=zdTgt(c,180),phi=zdPhi(c,t),sx=player.x,sy=player.y,L=t?Math.max(0,Math.min(120,dist(player,t)-t.r)):0,[dx,dy]=zdPathEnd(sx,sy,phi,L),R=ZB.zbQuake.dR,m=zdLv(ZB.zbQuake.dd,'zbQuake'),C=zdC('zbQuake',{q:'B'}),T=.46;
  return zdMoveAct({key:'zbQuake',name:'Mountain Quake',phi,T,sx,sy,dx,dy,arc:90,col:ZDC.amber,events:[{t:T,f:a=>{player.z=0;for(const e of zdNear(player.x,player.y,R)){if(zdHit(e,m,'zbQuake',C,{big:true})>0){zdQuench(e,C);a.hitList.push(e);a.hitConfirmed=true;}}
    addFx(new ZdQuake({x:player.x,y:player.y,R,stone:1}));for(let i=0;i<6;i++){const an=i/6*TAU;addFx(new ZdSpike({x:player.x+Math.cos(an)*R*.6,y:player.y+Math.sin(an)*R*.45,s:1,delay:.05}));}shake(3.4);stop(80);zdFault(player.x,player.y,phi);}}]});}
function dmZbMono(c){const t=zdTgt(c,ZB.zbMono.range),[x,y]=zdGround(c,t,150),m=zdLv(ZB.zbMono.dd,'zbMono'),C=zdC('zbMono',{q:'B'}),R=ZB.zbMono.dR,phi=Math.atan2(y-player.y,x-player.x);
  return zdCast({key:'zbMono',name:'Boulder Toss',phi,speed:2,glow:ZDC.amber,f:()=>{zdRocks(player.x,player.y,6,{spd:80});addFx(new ZdShot({x0:player.x,y0:player.y,x1:x,y1:y,T:.45,arc:130,s:1.3,kind:'boulder',onLand:(lx,ly)=>{
      for(const e of zdNear(lx,ly,R)){if(zdHit(e,m,'zbMono',C,{big:true})>0)zdQuench(e,C);}addFx(new ZdQuake({x:lx,y:ly,R,stone:1}));zdRocks(lx,ly,10,{spd:160,col:'#cfc2a6'});shake(2.6);stop(50);
      const [bx,by]=zdFree(lx,ly)?[lx,ly]:[player.x,player.y];const Zn=zdZone({kind:'mono',x:bx,y:by,R:60,taunt:ZB.zbMono.taunt,until:gameTime+ZB.zbMono.dT,tick:1});addFx(new ZdStand({kind:'boulder',x:bx,y:by,zone:Zn}));}}));}});}
function dmZbUlt(c){const R=ZB.zbUlt.R,m=zdLv(ZB.zbUlt.dd,'zbUlt'),spk=zdLv(ZB.zbUlt.dspk,'zbUlt'),C=zdC('zbUlt',{q:'B'}),T=1.0,ev=[];
  ev.push({t:.001,f:()=>{skyDarkT=.5;player.iframes=Math.max(player.iframes||0,zdRT(T)+.3);}});
  ev.push({t:T-.02,f:a=>{player.z=0;const cx=player.x,cy=player.y;for(const e of zdNear(cx,cy,R)){if(zdHit(e,m,'zbUlt',C,{big:true,noPrim:1})>0){a.hitList.push(e);a.hitConfirmed=true;}}addFx(new ZdQuake({x:cx,y:cy,R,stone:1}));
    for(let i=0;i<14;i++){const an=rnd(0,TAU),r=rnd(30,R);addFx(new ZdSpike({x:cx+Math.cos(an)*r,y:cy+Math.sin(an)*r*.8,s:rnd(1,1.6),delay:.05+i*.02}));}
    setFxTimer(.2,()=>{for(const e of zdNear(cx,cy,R)){if(zdHit(e,spk,'zbUlt',C,{noPrim:1})>=0)zdQuench(e,C,{min:1,dbl:1});}addFx(new DText({x:cx,y:cy,z:130,text:'MOUNTAINFALL',color:ZDC.stone2,size:17,life:1.1}));shake(3);});
    skyDarkT=0;shake(5);stop(110);try{screenFlash(.25,'#f4ead0');}catch(_){}setFxTimer(.45,()=>zdRevert('finisher'));}});
  return zdChannel({key:'zbUlt',name:'Mountainfall',T,glow:ZDC.amber,update:(a,dt,t0)=>{const k=clamp((a.t-t0)/T,0,1);player.z=k<.6?170*eOut(Math.min(1,k/.6)):170*(1-eIn((k-.6)/.4));},events:ev});}

/* ---------- C · Primordial Dragon ---------- */
function mkZxComet(c){const t=zdTgt(c,ZB.zxComet.range),phi=zdPhi(c,t),C=zdC('zxComet',{q:'A'}),lava=!!ZD.form;
  return zdCast({key:'zxComet',name:lava?'Lava Spit Comet':'Molten Comet',phi,speed:2.2,glow:ZDC.lava,f:()=>{faceTo(phi);addFx(new ZdComet({x:player.x+Math.cos(phi)*20,y:player.y+Math.sin(phi)*20,phi,len:ZB.zxComet.len,w:ZB.zxComet.w,lava,
    onOut:e=>{if(zdHit(e,ZB.zxComet.dmg,'zxComet',C,{big:true})>0)zdHeat(e,2);zdSpark(e,true,ZDC.fire);},onBack:e=>{if(zdHit(e,ZB.zxComet.back,'zxComet',C)>0)zdQuench(e,C);zdSpark(e,false,ZDC.stone2);}}));shake(1.2);}});}
function mkZxVeil(c){const C=zdC('zxVeil',{q:'B'}),R=ZB.zxVeil.R;return zdCast({key:'zxVeil',name:"Medusa's Veil",speed:2.2,glow:ZDC.stone2,f:()=>{const tr=new Map();zdZone({kind:'veil',x:player.x,y:player.y,R,follow:1,until:gameTime+ZB.zxVeil.T,tick:ZB.zxVeil.tick,n:0,onTick:Zn=>{Zn.n++;
  for(const e of zdNear(Zn.x,Zn.y,R)){zdHit(e,ZB.zxVeil.dmg,'zxVeil',C,{noTag:1});applyCC(e,{slow:1});if(Zn.n%2===0)zdHeat(e,1);const v=(tr.get(e)||0)+Zn.tick;if(v>=ZB.zxVeil.need){tr.set(e,0);zdQuench(e,C,{min:1});}else tr.set(e,v);}}});zdSteam(player.x,player.y,10,14,{big:1.4});}});}
function mkZxAscend(c){return zdCast({key:'zxAscend',name:'Primordial Ascension',speed:1.6,glow:ZDC.gold,f:()=>{if(ZD.form){ZD.prim=gameTime+ZB.zxAscend.T;ZD.until+=ZB.zxAscend.ext;ZD.g=Math.min(ZD_BAL.blood.cap,ZD.g+ZB.zxAscend.ext*zdDrain());}
  else{ZD.lockT=-99;ZD.g=Math.max(ZD.g,zdNeedNow());ZD.primNext=1;}addFx(new ZdPillar({x:player.x,y:player.y,R:80,col:ZDC.gold,H:260}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:110,w:8,color:ZDC.gold,life:.5}));
  addFx(new DText({x:player.x,y:player.y,z:120,text:'PRIMORDIAL',color:ZDC.gold,size:15,life:1.1}));shake(2.4);}});}
function mkZxTyphon(c){const t=zdTgt(c,ZB.zxTyphon.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}const C=zdC('zxTyphon',{q:'A'}),dr=!!ZD.form;
  return zdSwings({key:'zxTyphon',name:dr?"Typhon's Maul":"Typhon's Wrath",phi:angTo(t),n:3,midSpeed:2,lastSpeed:1.1,lastFrom:2,glow:ZDC.lava,f:(a,i,last)=>{if(t.dead||dist(player,t)>ZB.zxTyphon.range+t.r+50)return;
    if(dr){if(i===0)addFx(new ZdBite({e:t}));else if(i===1)addFx(new ZdClaw({e:t,ang:angTo(t)+.9,col:ZDC.fire,L:56}));else addFx(new ZdSwing({phi:angTo(t),col:ZDC.fire,R:90,span:2.4,heavy:1}));}else addFx(new ZdSwing({phi:angTo(t),col:i===2?ZDC.stone2:ZDC.lava,R:72,heavy:1}));
    if(zdHit(t,ZB.zxTyphon.dmg,'zxTyphon',C,{big:true,sure:true})>0){zdHeat(t,zdCap());zdQuench(t,C);}zdSpark(t,true,ZDC.fire);a.hitList.push(t);a.hitConfirmed=true;shake(last?3.2:2);stop(last?90:50);}});}
function mkZxEmbrace(c){const t=zdTgt(c,ZB.zxEmbrace.range),[x,y]=zdGround(c,t,160),R=ZB.zxEmbrace.R,C=zdC('zxEmbrace',{q:'B'});
  return zdCast({key:'zxEmbrace',name:"Gaia's Embrace",phi:Math.atan2(y-player.y,x-player.x),speed:2,glow:ZDC.amber,f:()=>{const Zn=zdZone({kind:'embrace',x,y,R,until:gameTime+ZB.zxEmbrace.T,tick:ZB.zxEmbrace.tick,onTick:Z0=>{
      for(const e of zdNear(Z0.x,Z0.y,R)){zdHit(e,ZB.zxEmbrace.dmg,'zxEmbrace',C,{noTag:1});if(zdBig(e)){koHit(e,1,{skill:'zqStone',koMul:6});e._zCrk=gameTime+ZD_BAL.boss.crack;applyCC(e,{slow:1});}else zdStone(e,1,C,{force:1,T:Z0.tick+.15});}}});
    for(let i=0;i<8;i++){const an=i/8*TAU;addFx(new ZdStand({kind:'hand',x:x+Math.cos(an)*R*.9,y:y+Math.sin(an)*R*.72,zone:Zn,an:an+Math.PI,s:1.1}));}addFx(new ZdQuake({x,y,R,stone:1}));shake(2.6);}});}

/* the button → human move or dragon move (same skill key: same level, cooldown and gems) */
const ZD_MAKE={znBreath:mkZnBreath,znSkin:mkZnSkin,znLeap:mkZnLeap,znRoar:mkZnRoar,
  zaHeart:null,zaSear:mkZaSear,zaQuake:mkZaQuake,zaRush:mkZaRush,zaAnvil:mkZaAnvil,zaGeyser:mkZaGeyser,zaGuard:mkZaGuard,zaUlt:mkZaUlt,
  zbHeart:null,zbSpike:mkZbSpike,zbVent:mkZbVent,zbChain:mkZbChain,zbQuake:mkZbQuake,zbMono:mkZbMono,zbAegis:mkZbAegis,zbUlt:mkZbUlt,
  zxComet:mkZxComet,zxVeil:mkZxVeil,zxAscend:mkZxAscend,zxTyphon:mkZxTyphon,zxEmbrace:mkZxEmbrace};
const ZD_DRAGON={zaSear:dmZaSear,zaQuake:dmZaQuake,zaRush:dmZaRush,zaAnvil:dmZaAnvil,zaGeyser:dmZaGeyser,zaGuard:dmZaGuard,zaUlt:dmZaUlt,
  zbSpike:dmZbSpike,zbVent:dmZbVent,zbChain:dmZbChain,zbQuake:dmZbQuake,zbMono:dmZbMono,zbAegis:mkZbAegis,zbUlt:dmZbUlt,zxComet:mkZxComet,zxTyphon:mkZxTyphon};
function zdHeartMake(f){const key=f==='A'?'zaHeart':'zbHeart';return function(c){
  if(ZD.form){if(ZD.form!==f){zdNo('อยู่ในร่างมังกรอีกสาย — คืนร่างก่อน');return null;}if(c&&c.target)return null;   /* AUTO / bench never turn back by themselves */
    return zdCast({key,name:'คืนร่าง',speed:3,glow:ZDC.steam,f:()=>zdRevert('press')});}
  const need=zdNeedOf(key);if(ZD.g<need){zdNo(`เลือดมังกร ${Math.floor(ZD.g)}/${need} — ยังแปลงร่างไม่ได้`);return null;}
  return buffAct({key,name:f==='A'?'Heart of Etna':'Heart of Gaia',speed:2.4,glow:f==='A'?ZDC.lava:ZDC.amber,events:tP=>[{t:.01,f:()=>{player.iframes=Math.max(player.iframes||0,zdRT(tP)+.2);}},{t:tP,f:()=>zdTransform(f,key)}]});};}
function zdButton(key,br){const hm=ZD_MAKE[key],dm=ZD_DRAGON[key];return function(c){zdEnsure();
  if(ZD.form&&(br==='A'||br==='B')&&ZD.form!==br){zdNo(`ร่างมังกร${ZD.form==='A'?'ลาวา':'ภูผา'}ใช้สกิลสายนี้ไม่ได้`);return null;}
  if(ZD.form&&dm)return dm(c);return hm?hm(c):null;};}
const ZD_ZIGZAG=[['znHammer','znBreath'],['zaSear','zaHeart'],['zbSpike','zbHeart']];

/* =====================================================================
   7. AUTO · HOOKS · UI · INSTALL
   ===================================================================== */
function drakeAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:(window.TL&&TL.autoPick?TL.autoPick(460):null)||nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['zbAegis','znSkin','zaGuard'])if(ready(k)&&!(k==='znSkin'&&hasBuff('znSkin'))&&!(k==='zbAegis'&&ZD.aegis>0)&&!(ZD.form&&ZD.form!==zdCol(k)&&zdCol(k)!=='basic'))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=zdNear(player.x,player.y,220),br=ZD.form||(D.mag>D.patk?'B':'A'),heart=br==='A'?'zaHeart':'zbHeart';
  if(!ZD.form){if(LV[heart]>0&&ZD.g>=zdNeedOf(heart)&&(t.boss||near.length>=3))return cast(heart);
    if(ready('zxAscend')&&LV[heart]>0&&(t.boss||near.length>=4))return cast('zxAscend');}
  else{const ult=br==='A'?'zaUlt':'zbUlt',left=Math.min(ZD.until-gameTime,ZD.g/zdDrain());if(ready(ult)&&left<3)return cast(ult);}
  if(ready('znRoar')&&near.length>=2)return cast('znRoar');
  const order=br==='A'?['zxTyphon','zaUlt','zaGeyser','zaAnvil','zaQuake','zxComet','zaRush','zaSear','znLeap','znBreath']:['zxEmbrace','zbUlt','zxVeil','zbQuake','zbMono','zbVent','zbChain','zbSpike','znLeap','znBreath'];
  for(const k of order){if(!ready(k))continue;const s=SKILLS[k];
    if((k==='zaUlt'||k==='zbUlt')&&(ZD.form||!(t.boss||near.length>=3)))continue;
    if((k==='zxTyphon'||k==='zxEmbrace')&&!t.boss&&near.length<3)continue;
    if(s.type==='self'){const R=k==='zaQuake'?(ZD.form?ZB.zaQuake.dRange:ZB.zaQuake.R):k==='zbQuake'?ZB.zbQuake.R+(ZD.form?60:0):k==='zxVeil'?ZB.zxVeil.R:200;if(d>R+t.r)continue;}
    else if(d>(s.range||ZB.znLeap.dist[2])+t.r)continue;
    return cast(k);}
  return false;}

/* the gauge bar (above the hot bar on PC, the bottom strip on phones) + the dragon frame on the buttons */
function zdUi(force){let el=document.getElementById('zdBar');const hk=zdHeartKey();
  if(!hk||!(curMap||window.__ZD_BAR)){if(el)el.style.display='none';zdBtns();return;}
  if(!el){el=document.createElement('div');el.id='zdBar';document.body.appendChild(el);const st=document.createElement('style');st.textContent=
    '#zdBar{position:fixed;z-index:12;pointer-events:none;width:210px;height:26px;padding:3px 8px;border-radius:13px;background:rgba(24,12,6,.55);box-shadow:0 0 0 1px rgba(255,200,120,.25) inset;font:700 11px/1 Sarabun,Tahoma,sans-serif;color:#fff3dc}'+
    '#zdBar .zt{position:absolute;left:10px;top:3px;letter-spacing:.2px;text-shadow:0 1px 2px #000}#zdBar .zn{position:absolute;right:10px;top:3px;text-shadow:0 1px 2px #000}'+
    '#zdBar .zb{position:absolute;left:8px;right:8px;bottom:4px;height:7px;border-radius:4px;background:rgba(0,0,0,.55);overflow:hidden}'+
    '#zdBar .zf{height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,#7a1a06,#ff5a1a 55%,#ffd27a);transition:width .12s}'+
    '#zdBar.B .zf{background:linear-gradient(90deg,#5a4a36,#c8a46a 55%,#ffe7b0)}#zdBar.full{box-shadow:0 0 0 1px #ffd36a inset,0 0 14px 2px rgba(255,190,80,.55);animation:zdPulse 1s ease-in-out infinite}'+
    '#zdBar.form .zf{background:linear-gradient(90deg,#ff3a0a,#ffb347)}#zdBar.form.B .zf{background:linear-gradient(90deg,#8a7458,#f2ead8)}'+
    '@keyframes zdPulse{50%{box-shadow:0 0 0 1px #fff3c8 inset,0 0 22px 5px rgba(255,200,90,.75)}}'+
    '.zdHo{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4}.zdHo.rdy{box-shadow:0 0 0 2px #ffd36a inset,0 0 12px 3px rgba(255,190,80,.7);animation:zdPulse 1s ease-in-out infinite}'+
    '.zdHo.fm{box-shadow:0 0 0 2px #ff8a3a inset}.zdHo.fm.B{box-shadow:0 0 0 2px #f2ead8 inset}.zdHo.off{background:rgba(10,6,4,.62)}'+
    '.zdHo i{position:absolute;right:-3px;top:-4px;width:17px;height:17px;background:no-repeat center/contain url("data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2 12 Q4 6 9 6 L11 3 L12 6 Q16 6 18 9 L14 10 L17 12 Q13 13 11 15 L7 14 Q4 15 2 12 Z" fill="#ff7a2a" stroke="#2a1206" stroke-width="1.2"/><circle cx="13" cy="8.4" r="1.1" fill="#fff3c8"/></svg>')+'")}'+
    '.zdHo.B i{filter:sepia(1) saturate(.6) brightness(1.3)}';document.head.appendChild(st);
    el.innerHTML='<span class="zt">เลือดมังกร</span><span class="zn"></span><div class="zb"><div class="zf"></div></div>';}
  el.style.display='block';const need=zdNeedNow(),full=!ZD.form&&ZD.g>=need,f=ZD.form||(hk==='zbHeart'?'B':'A');
  el.classList.toggle('full',full);el.classList.toggle('form',!!ZD.form);el.classList.toggle('B',f==='B');
  const fr=ZD.form?Math.max(0,Math.min(1,Math.min(ZD.g/zdDrain(),ZD.until-gameTime)/Math.max(1,(ZD.until-ZD.t0)))):Math.min(1,ZD.g/need);el.querySelector('.zf').style.width=(fr*100).toFixed(1)+'%';
  const tx=ZD.form?(ZD.form==='A'?'มังกรลาวา ':'มังกรภูผา ')+Math.ceil(Math.max(0,Math.min(ZD.g/zdDrain(),ZD.until-gameTime)))+' วิ':Math.floor(Math.min(ZD.g,need))+'/'+need;const zn=el.querySelector('.zn');if(zn.textContent!==tx)zn.textContent=tx;
  const zt=el.querySelector('.zt'),tt=ZD.form?'ร่างมังกร':full?'แปลงร่างได้!':'เลือดมังกร';if(zt.textContent!==tt)zt.textContent=tt;
  const mob=document.body.classList.contains('mob');
  if(mob){if(force||!(el._pt>performance.now()-500)){el._pt=performance.now();const H=innerHeight,band=H-84;let lo=6,hi=innerWidth-6;
      for(const q of document.querySelectorAll('#mobJoy,#mobChat,#mobAuto,#mobSit')){const r=q.getBoundingClientRect();if(r.width&&r.bottom>band&&r.left<innerWidth*.45)lo=Math.max(lo,r.right+8);}
      for(const q of document.querySelectorAll('#mobSkW .mobSk,#mobSkSet,#mobTab,#mobAtk,#mobRot,#mobTgt')){const r=q.getBoundingClientRect();if(r.width&&r.bottom>band&&r.left>innerWidth*.3)hi=Math.min(hi,r.left-8);}
      const w=226,sc=Math.max(.6,Math.min(1,(hi-lo)/w));el.style.transformOrigin='50% 100%';el.style.transform=sc<1?`scale(${sc.toFixed(3)})`:'';el.style.left=Math.round((lo+hi)/2-w/2)+'px';el.style.top='';el.style.bottom='14px';}}
  else{const ref=document.getElementById('hotbar'),r=ref&&ref.getBoundingClientRect();
    if(r&&r.width){el.style.left=Math.round(r.left+r.width/2-113)+'px';el.style.top=Math.round(r.top-38)+'px';el.style.bottom='';el.style.transform='';}
    else{el.style.left='50%';el.style.top='';el.style.bottom='96px';el.style.transform='translateX(-50%)';}}
  zdBtns();}
function zdBtns(){const bs=document.querySelectorAll('#hotbar [data-k],#mobSkW [data-k]');for(const b of bs){const k=b.getAttribute('data-k'),s=SKILLS[k];if(!s||!ZD_DEFS.some(d=>d.key===k)){const o=b.querySelector(':scope>.zdHo');if(o)o.remove();continue;}
    const col=zdCol(k),isH=k==='zaHeart'||k==='zbHeart',need=isH?zdNeedOf(k):0;let cls='';
    if(ZD.form){if(col===ZD.form&&(ZD_DRAGON[k]||isH))cls='fm '+ZD.form;else if((col==='A'||col==='B')&&col!==ZD.form)cls='off';}
    else if(isH&&ZD.g>=need&&!(gameTime<ZD.lockT))cls='rdy';
    let o=b.querySelector(':scope>.zdHo');if(!cls){if(o)o.remove();continue;}if(!o){o=document.createElement('div');o.className='zdHo';o.innerHTML='<i></i>';if(getComputedStyle(b).position==='static')b.style.position='relative';b.appendChild(o);}
    const want='zdHo '+cls;if(o.className!==want)o.className=want;const ic=o.querySelector('i');ic.style.display=cls.startsWith('fm')?'':'none';}}

function installDrake(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of ZD_DEFS){const b=ZB[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:zdIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'forgeborn_drake'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(d.key==='znLeap')sk.range=ZB.znLeap.dist[2];
    if(d.key==='zaHeart'||d.key==='zbHeart')sk.make=zdHeartMake(d.key==='zaHeart'?'A':'B');else if(!d.passive)sk.make=zdButton(d.key,d.br==='C'?d.col:d.br);
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${ZD_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of ZD_ZIGZAG){const A=SKREQ[a],B_=SKREQ[b];if(!A||!B_)continue;
    B_.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B_.length)r.need.push([b,i]);});}};}
  /* damage type: Basic column = higher of ATK / MATK, A = ATK, B = MATK; the internal hit keys of the quench + the Mountain Drake's stomp */
  Object.assign(SK_DT,{zqLava:'p',zqStone:'m',zdStomp:'m'});
  Object.assign(SK_CC,{znLeap:{flinch:.35},zaHeart:{flinch:.4},zaQuake:{flinch:.35},zaRush:{flinch:.3},zaAnvil:{flinch:.5},zaUlt:{flinch:.3},zbHeart:{flinch:.4},zbQuake:{flinch:.3},zbMono:{flinch:.35},zbUlt:{flinch:.3},zxComet:{flinch:.3},zxTyphon:{flinch:.45},zxLiving:{flinch:.3}});
  Object.assign(SK_KO,{basic:1,zdStomp:1.6,zqLava:1.2,zqStone:1,znBreath:.8,znLeap:2.4,zaHeart:3,zaSear:1.2,zaQuake:2.4,zaAfter:1.4,zaRush:1.6,zaCinder:.2,zaAnvil:3,zaGeyser:1,zaPool:.2,zaGuard:2.4,zaUlt:1.4,
    zbHeart:3,zbSpike:1.2,zbVent:.4,zbChain:2,zbQuake:2.4,zbFault:1.6,zbMono:2.4,zbOracle:.3,zbUlt:1.4,zxSmith:1.6,zxLiving:1.6,zxComet:2,zxVeil:.3,zxGarden:1.2,zxTyphon:4,zxEmbrace:.6});
  /* the Heart first in each set: the phone wheel takes the learned skills in this order, 7 a set */
  TABS.length=0;TABS.push({n:'Etna',keys:['zaHeart','zaSear','zaQuake','zaAnvil','zaGeyser','zaRush','zaUlt','zaGuard','znBreath','znLeap','znRoar','znSkin']},
    {n:'Delphi',keys:['zbHeart','zbSpike','zbVent','zbChain','zbQuake','zbMono','zbUlt','zbAegis','znBreath','znLeap','znRoar','znSkin']},
    {n:'Primordial',keys:['zxAscend','zxTyphon','zxComet','zxEmbrace','zxVeil','zaHeart','zbHeart','znRoar','znSkin']});
  Object.assign(BUFFDEF,{znSkin:{n:'Stone Skin',c:ZDC.stone2,i:'SKIN'},zbAegis:{n:'Marble Aegis',c:ZDC.marble,i:'AEGIS'},zdFormA:{n:'ร่างมังกรลาวาเอตนา',c:ZDC.lava,i:'MAGMA'},zdFormB:{n:'ร่างมังกรภูผาแห่งไกอา',c:ZDC.amber,i:'MOUNT'},
    zdShield:{n:'โล่มังกร',c:ZDC.fire2,i:'SHLD'},zdBlood:{n:'เลือดมังกร',c:ZDC.fire,i:'BLOOD'},zdPrim:{n:'ร่างบรรพกาล',c:ZDC.gold,i:'PRIM'},zdHide:{n:'Obsidian Hide',c:ZDC.obs,i:'HIDE'}});
  JOB.name='Forgeborn Hatchling';JOB.hpA=1.6;JOB.hpB=6;JOB.spB=3;
  ITEMS.forgebornHammer={n:'Forgeborn Blade',slot:'rhand',two:1,kind:'Forge Blade',atk:140,matk:130,wlv:3,aspd:156,ref:6,cards:2,w:150,b:{vit:2},size:{small:.75,medium:1,large:1},d:'ดาบเตาหลอม ใบหินอ่อนขาว แกนลาวา ด้ามทองฝังทับทิม VIT +2'};
  ITEMS.etnaMaul={n:'Etna Greatsword',slot:'rhand',two:1,kind:'Forge Blade',atk:160,matk:150,wlv:4,aspd:154,ref:4,cards:1,w:170,b:{str:2,int:2},size:{small:.75,medium:1,large:1},d:'ดาบใหญ่จากเตาเฮฟเฟสตัสใต้เอตนา STR +2 INT +2'};
  EQ.rhand='forgebornHammer';INV.length=0;INV.push('etnaMaul','vikinghelm','ringPrec','clipLuck');
  /* hooks */
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  /* flat ATK / MATK: Forge Fury (heated enemies), Gaia's Favour (statues / cracked), Gorgon's Mark (magic on a statue) — at most the hit's own power · Cracked Plate cuts DEF */
  window.jgDmgMul=(e,o)=>{const mg=o&&o.magic,base=Math.max(1,mg?D.mag:D.patk);let fl=0;
    if(!mg&&zdL('zaFury'))fl+=ZD.nHot*zdLv(ZB.zaFury.atk,'zaFury');
    if(mg&&zdL('zbGaia'))fl+=ZD.nStone*zdLv(ZB.zbGaia.matk,'zbGaia');
    if(mg&&zdL('zbMark')&&zdStoned(e))fl+=PS.lv*zdLv(ZB.zbMark.flat,'zbMark');
    if(o&&e&&e._zCrA>gameTime&&!mg)o._defCut=(o._defCut||0)+Math.round(PS.lv*ZB.zaCrack.def);
    return (base+Math.min(fl,base))/base;};
  window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{const melee=e&&!e.dead&&dist(player,e)<e.r+90*(ZD.form?zdFormSize():1);zdTaken();if(ZD.form)ZD.fl=1;
    /* Obsidian Guard: a melee blow is caught, lava bursts back, blood +10 */
    if(ZD.guardUntil>gameTime&&melee&&!ZD.form){ZD.guardUntil=0;faceTo(angTo(e));const C=zdC('zaGuard',{q:'A'});for(const q of zdNear(e.x,e.y,ZB.zaGuard.R))zdHit(q,ZB.zaGuard.dmg,'zaGuard',C,{big:q===e,sure:true});
      addFx(new ZdLava({x:e.x,y:e.y,R:ZB.zaGuard.R,n:2}));zdGain('guard',null);addFx(new DText({x:player.x,y:player.y,z:90,text:'GUARD',color:ZDC.fire2,size:13,life:.8}));shake(2);stop(60);return 0;}
    /* Obsidian Hide (Magma Drake): 2 blows within 3 s */
    if(ZD.hideN>0&&ZD.hideUntil>gameTime){ZD.hideN--;if(melee)zdHeat(e,1);zdRocks(player.x,player.y,4,{spd:80,z:40,col:ZDC.obs});addFx(new DText({x:player.x,y:player.y,z:96,text:'OBSIDIAN',color:'#d8b8e8',size:12,life:.7}));return 0;}
    /* Living Stone / Lava Plate: melee attackers heat up · Mountain Hide: melee attackers are quenched */
    if(melee&&((hasBuff('znSkin')&&zdL('zxLiving')&&!ZD.form)||(ZD.form==='A'&&zdL('zxPlate'))))zdHeat(e,1);
    if(melee&&ZD.aegis>0&&ZD.aegisBig&&ZD.form==='B')zdQuench(e,zdC('zbAegis',{q:'B'}),{min:1});
    /* Marble Aegis */
    if(ZD.aegis>0&&ZD.aegisUntil>gameTime){const a=Math.min(ZD.aegis,d);ZD.aegis-=a;d-=a;if(ZD.aegis<=0)zdAegisBreak();if(d<=0)return 0;}
    /* the dragon's shield */
    if(ZD.form&&ZD.shield>0){const a=Math.min(ZD.shield,d);ZD.shield-=a;d-=a;if(d<=0)return 0;}
    if(hasBuff('znSkin'))d=Math.max(1,d-zdLv(ZB.znSkin.block,'znSkin'));
    return Math.max(1,Math.round(d));};
  window.jgPostHit=()=>{};window.jgAfterHurt=()=>{};
  window.jgNoInterrupt=()=>!!ZD.form;   /* dragon forms: no stun / knock-up / flinch from monster hits */
  window.jgMove=()=>{if(ZD.form!=='B'||!(player.speed>0))return 1;return Math.max(.3,(player.speed-ZD_BAL.form.B.slow)/player.speed);};
  window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};
  window.jgEnemyTick=(e,dt)=>ZD.zones.length?zdTaunt(e,dt):false;
  window.drakeAutoTick=drakeAutoTick;
  /* kills: blood +2 · Petrified Garden shatters statues */
  if(typeof onKill==='function'&&!onKill._zd){const _k=onKill;onKill=function(e){const st=zdStoned(e)||(e&&e._zSt>gameTime-.05);const r=_k.apply(this,arguments);try{if(CHAR==='drake'){zdGain('kill');ZD.fightT=gameTime;
      if(st&&zdL('zxGarden')){const x=e.x,y=e.y;setFxTimer(.01,()=>{const C=zdC('zxGarden',{q:'B'});for(const q of zdNear(x,y,ZB.zxGarden.R)){if(zdHit(q,ZB.zxGarden.dmg,'zxGarden',C)>0)zdQuench(q,C);}zdRocks(x,y,10,{spd:160,col:'#cfc2a6'});addFx(new ZdQuake({x,y,R:ZB.zxGarden.R,stone:1}));});}}}catch(_){}return r;};onKill._zd=1;}
  /* dragon forms do not play the human 'hurt' flinch */
  if(typeof startAction==='function'&&!startAction._zd){const _sa=startAction;startAction=function(a){if(CHAR==='drake'&&ZD.form&&a&&a.key==='hurt')return;return _sa.apply(this,arguments);};startAction._zd=1;}
  /* the dragon move's own name on the cast text / chat while in dragon form */
  if(typeof castSkillNow==='function'&&!castSkillNow._zd){const _c=castSkillNow;castSkillNow=function(key,c){const sk=SKILLS[key],dn=ZD.form&&sk&&ZD_DRAGON[key]&&zdCol(key)===ZD.form&&ZD_DN[key];if(!dn)return _c.apply(this,arguments);
    const nm=sk.name;sk.name=dn;try{return _c.apply(this,arguments);}finally{sk.name=nm;}};castSkillNow._zd=1;}
  /* drawing: the dragon in place of the hero · statues are grey stone, not ice */
  if(typeof drawPlayer==='function'&&!drawPlayer._zd){const _dp=drawPlayer;window.drawPlayer=drawPlayer=function(){if(CHAR==='drake'&&ZD.form){try{if(zdDrawDragon())return;}catch(_){}}return _dp.apply(this,arguments);};drawPlayer._zd=1;}
  if(typeof drawPlayerAura==='function'&&!drawPlayerAura._zd){const _da=drawPlayerAura;window.drawPlayerAura=drawPlayerAura=function(){if(CHAR==='drake'&&ZD.form)return;return _da.apply(this,arguments);};drawPlayerAura._zd=1;}
  mkBasic=mkZdBasic;zdEnsure();zdPicLoad();
  /* HUD portrait: the knight's head from the owner's sheet (index.html drawPortrait reads window.HUD_FACE) */
  try{const hf=new Image();hf.src='assets/heroes/drake/face.webp?v=1';window.HUD_FACE=hf;hf.onload=()=>{try{drawPortrait();}catch(_){}};}catch(_){}
  try{document.title='Totem Legend — Forgeborn Drake';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Forgeborn Drake';if(cl)cl.textContent='Forgeborn Hatchling';}catch(e){}
  window.ZD=ZD;window.ZD_DEFS=ZD_DEFS;window.ZD_BAL=ZD_BAL;window.zdCol=zdCol;
  window.ZDK={heat:zdHeat,quench:zdQuench,transform:(f)=>zdTransform(f,f==='A'?'zaHeart':'zbHeart'),revert:zdRevert,gain:v=>{ZD.lockT=-99;ZD.fightT=gameTime;zdAddG(v);},heatOf:zdHeatOf,stoned:zdStoned};
  /* dev tools (tools/skill_shapes_probe.js): forget what earlier casts left behind */
  window.heroShapeReset=()=>{if(ZD.form)zdRevert('reset');Object.assign(ZD,{g:0,lockT:-99,zones:[],aegis:0,aegisUntil:0,guardUntil:0,hideN:0,prim:0,primNext:0,prophT:-99});ZDH.clear();ZDS.clear();};}

/* =====================================================================
   8. ICONS (code SVG until painted ones exist in assets/icons/drake — set ZD_ICONS_PAINTED then)
   ===================================================================== */
const ZD_ICONS_PAINTED=false;
if(!ZD_ICONS_PAINTED)window.EX_ICON_SKIP=Object.assign(window.EX_ICON_SKIP||{},{drake:1});   /* skill_enh.js: no painted ex_ icons to look for yet */
function zdIconSpec(d){const k=d.key,br=d.br,col=br==='A'?'#ffb38a':br==='B'?'#ffe0a8':br==='C'?'#ffe9a8':'#ffd9a8',bg=br==='A'?'#3a1208':br==='B'?'#1f2228':br==='C'?'#2a2214':'#2a1e16';
  const ink='#1a0e06',gold='#ffd36a',fire='#ff7a2a',fire2='#ffd27a',lava='#ff4a12',stone='#cbbfa8',marble='#efe6d4',amber='#ffb43a',
    L=(a,b,c,e,cl=col,w=2.6,x='')=>`<path d="M${a} ${b} L${c} ${e}" stroke="${cl}" stroke-width="${w}" stroke-linecap="round" fill="none" ${x}/>`;
  const hammer=(x1,y1,x2,y2,face=fire,w=3.2)=>{const a=Math.atan2(y2-y1,x2-x1),ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,hl=8.5,ht=4.6,p=(s,t)=>`${(x2+nx*s+ux*t).toFixed(1)} ${(y2+ny*s+uy*t).toFixed(1)}`;
    return L(x1,y1,x2-ux*2,y2-uy*2,'#8a5a2e',w)+`<path d="M${p(-hl,-ht)} L${p(hl,-ht)} L${p(hl,ht)} L${p(-hl,ht)} Z" fill="#5a5048" stroke="${ink}" stroke-width="1.2"/><path d="M${p(hl-3.6,-ht)} L${p(hl,-ht)} L${p(hl,ht)} L${p(hl-3.6,ht)} Z" fill="${face}"/><path d="M${p(-hl,-ht)} L${p(-hl+3.6,-ht)} L${p(-hl+3.6,ht)} L${p(-hl,ht)} Z" fill="${marble}"/>`;};
  /* the knight's sword (owner's art 2026-11-23): x1,y1 = pommel end, x2,y2 = tip · white blade, lava core in the glow colour, gold crossguard + ruby */
  const sword=(x1,y1,x2,y2,glow=fire,w=3.2)=>{const a=Math.atan2(y2-y1,x2-x1),ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,Lg=Math.hypot(x2-x1,y2-y1),g=Lg*.26,bw=2.3+w*.25,
      Q=(t,s2)=>[x1+ux*t+nx*s2,y1+uy*t+ny*s2],q=(t,s2)=>Q(t,s2).map(v=>v.toFixed(1)).join(' '),pm=Q(-.4,0),rb=Q(g,0);
    return `<path d="M${q(0,0)} L${q(g-1,0)}" stroke="${ink}" stroke-width="${w+1.6}" stroke-linecap="round"/><path d="M${q(0,0)} L${q(g-1,0)}" stroke="#6a2a1c" stroke-width="${w}" stroke-linecap="round"/>`+
      `<circle cx="${pm[0].toFixed(1)}" cy="${pm[1].toFixed(1)}" r="2.2" fill="${gold}" stroke="${ink}" stroke-width="1"/>`+
      `<path d="M${q(g+1,-bw)} L${q(Lg-4.5,-bw*.85)} L${q(Lg,0)} L${q(Lg-4.5,bw*.85)} L${q(g+1,bw)} Z" fill="#f4efe6" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>`+
      `<path d="M${q(g+3,0)} L${q(Lg-6,0)}" stroke="${glow}" stroke-width="1.5" stroke-linecap="round"/>`+
      `<path d="M${q(g,-6.8)} L${q(g,6.8)}" stroke="${ink}" stroke-width="4.6" stroke-linecap="round"/><path d="M${q(g,-6.8)} L${q(g,6.8)}" stroke="${gold}" stroke-width="2.6" stroke-linecap="round"/>`+
      `<circle cx="${rb[0].toFixed(1)}" cy="${rb[1].toFixed(1)}" r="1.6" fill="#d8242a" stroke="${ink}" stroke-width=".6"/>`;};
  const flame=(cx,cy,s=1,c1=fire,c2=fire2)=>`<path d="M${cx} ${cy-14*s} C${cx+9*s} ${cy-4*s} ${cx+8*s} ${cy+8*s} ${cx} ${cy+9*s} C${cx-8*s} ${cy+8*s} ${cx-9*s} ${cy-2*s} ${cx-3*s} ${cy-8*s} C${cx-3*s} ${cy-3*s} ${cx} ${cy-3*s} ${cx} ${cy-14*s} Z" fill="${c1}" stroke="${ink}" stroke-width="1"/><path d="M${cx} ${cy-5*s} C${cx+4*s} ${cy} ${cx+3*s} ${cy+6*s} ${cx} ${cy+6*s} C${cx-3*s} ${cy+6*s} ${cx-4*s} ${cy+1*s} ${cx} ${cy-5*s} Z" fill="${c2}"/>`;
  const rock=(cx,cy,s=1,c=stone)=>`<path d="M${cx-9*s} ${cy+6*s} L${cx-7*s} ${cy-4*s} L${cx-1*s} ${cy-8*s} L${cx+7*s} ${cy-5*s} L${cx+9*s} ${cy+4*s} L${cx+2*s} ${cy+8*s} Z" fill="${c}" stroke="${ink}" stroke-width="1.1"/><path d="M${cx-1*s} ${cy-8*s} L${cx+1*s} ${cy} L${cx+9*s} ${cy+4*s} M${cx+1*s} ${cy} L${cx-9*s} ${cy+6*s}" stroke="${ink}" stroke-opacity=".35" stroke-width=".9" fill="none"/>`;
  const head=(cx,cy,s=1,c='#c0402a',eye=fire2)=>`<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-13 6 Q-14 -4 -6 -8 L-9 -16 L-1 -9 Q6 -10 10 -5 L16 -3 Q17 1 13 3 L16 6 Q11 9 4 8 Q-2 12 -13 6 Z" fill="${c}" stroke="${ink}" stroke-width="1.3" stroke-linejoin="round"/><path d="M-4 -9 L-12 -18 L-3 -12 Z" fill="${gold}" stroke="${ink}" stroke-width=".8"/><circle cx="4" cy="-3" r="1.9" fill="${eye}"/><path d="M8 4 L12 5" stroke="${ink}" stroke-width="1"/></g>`;
  const spike=(x,y,h=18,w=7,c=marble)=>`<path d="M${x-w} ${y} L${x-w*.2} ${y-h*.55} L${x} ${y-h} L${x+w*.4} ${y-h*.5} L${x+w} ${y} Z" fill="${c}" stroke="${ink}" stroke-width="1.1"/><path d="M${x-w*.3} ${y-h*.2} L${x} ${y-h*.45}" stroke="${amber}" stroke-width="1.2"/>`;
  const ring=(r=13,c=col,w=2.4,x='')=>`<circle cx="22" cy="22" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" ${x}/>`;
  const crack=(c=amber)=>`<path d="M22 22 L15 28 L10 27 M22 22 L28 29 L33 28 M22 22 L23 13 L27 9 M22 22 L13 18" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const ground=(c='#4a3a2a')=>`<path d="M4 36 Q22 30 40 36 L40 44 L4 44 Z" fill="${c}"/>`;
  const steam=(x,y,c=marble)=>`<path d="M${x} ${y} q-4 -5 0 -9 q4 -4 0 -9" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".9"/>`;
  const eye=(cx=22,cy=22,s=1)=>`<path d="M${cx-14*s} ${cy} Q${cx} ${cy-12*s} ${cx+14*s} ${cy} Q${cx} ${cy+12*s} ${cx-14*s} ${cy} Z" fill="#fff3d0" stroke="#3a2414" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="${5.5*s}" fill="${amber}"/><ellipse cx="${cx}" cy="${cy}" rx="${1.3*s}" ry="${4.6*s}" fill="${ink}"/>`;
  const star=(cx,cy,r,c='#fff')=>`<path d="M${cx} ${cy-r} L${cx+r*.25} ${cy-r*.25} L${cx+r} ${cy} L${cx+r*.25} ${cy+r*.25} L${cx} ${cy+r} L${cx-r*.25} ${cy+r*.25} L${cx-r} ${cy} L${cx-r*.25} ${cy-r*.25} Z" fill="${c}"/>`;
  const chain=(x1,y1,x2,y2,c='#9a8a74')=>{let h='';const n=4;for(let i=0;i<n;i++){const t=(i+.5)/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,a=Math.atan2(y2-y1,x2-x1)*180/Math.PI+(i%2?90:0);h+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4.2" ry="2.4" transform="rotate(${a.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${c}" stroke-width="2"/>`;}return h;};
  const mono=(x=22,y=38,c='#cfc2a6')=>`<path d="M${x-7} ${y} L${x-6} ${y-24} L${x} ${y-28} L${x+6} ${y-23} L${x+7} ${y} Z" fill="${c}" stroke="${ink}" stroke-width="1.2"/><path d="M${x-3.5} ${y-17} Q${x} ${y-21} ${x+3.5} ${y-17} Q${x} ${y-13} ${x-3.5} ${y-17} Z" fill="none" stroke="${amber}" stroke-width="1.3"/>`;
  const volcano=(c=lava)=>`<path d="M6 38 L17 18 L27 18 L38 38 Z" fill="#3a2418" stroke="${ink}" stroke-width="1.2"/><path d="M17 18 L15 26 L12 33 M27 18 L29 25" stroke="${c}" stroke-width="2" fill="none"/><ellipse cx="22" cy="18" rx="5" ry="2" fill="${fire2}"/>`;
  const shield=(c=col,fill=bg)=>`<path d="M22 7 L35 12 Q35 30 22 38 Q9 30 9 12 Z" fill="${fill}" stroke="${c}" stroke-width="2.2"/>`;
  const hand=(x,y,s=1,c=stone)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 L-6 -10 L-5 -16 L-3 -10 L-2 -18 L0 -10 L1 -17 L3 -10 L4 -15 L6 -9 L8 -11 L8 -5 L6 0 Z" fill="${c}" stroke="${ink}" stroke-width="1"/></g>`;
  const G={
    znHammer:sword(9,37,32,12)+flame(35,10,.42),
    znBreath:flame(16,24,.7)+flame(26,18,.8)+flame(33,28,.6)+`<path d="M5 26 L12 22 M5 30 L12 28" stroke="${col}" stroke-width="2"/>`,
    znSkin:`<path d="M22 6 L34 12 L34 26 L22 38 L10 26 L10 12 Z" fill="${marble}" stroke="${ink}" stroke-width="1.4"/><path d="M10 19 L34 19 M16 12 L16 32 M28 12 L28 32 M22 6 L22 38" stroke="#b8ab92" stroke-width="1.1"/>`,
    znLeap:`<path d="M5 34 Q6 10 24 6" stroke="${col}" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/><g transform="translate(0 9)">`+crack()+`</g>`+sword(28,3,22,32),
    znCyclops:`<circle cx="22" cy="19" r="11" fill="#e8d8b8" stroke="${ink}" stroke-width="1.3"/>`+eye(22,19,.55)+hammer(26,40,36,30,fire,2.6),
    znCore:`<circle cx="22" cy="22" r="10" fill="${lava}" stroke="${ink}" stroke-width="1.3"/><circle cx="22" cy="22" r="5" fill="${fire2}"/>`+flame(10,16,.4)+flame(34,16,.4)+flame(22,36,.4),
    znRoar:head(20,22,1.05,'#a85a2a')+`<path d="M33 14 Q38 22 33 30 M37 11 Q43 22 37 33" stroke="${col}" stroke-width="2" fill="none"/>`,
    zaHeart:head(22,22,1.1,'#b02a12',fire2)+flame(32,30,.45,lava),
    zaSear:sword(8,37,30,14,lava)+star(32,12,5,fire2)+star(36,22,3.5,fire),
    zaBurst:star(22,22,16,fire)+star(22,22,9,fire2)+`<circle cx="22" cy="22" r="4" fill="#fff"/>`,
    zaQuake:ground()+`<g transform="translate(0 11)">`+crack(fire)+`</g>`+sword(20,1,22,33,lava),
    zaAfter:ring(8,fire,2.4)+ring(14,lava,2,'stroke-dasharray="4 3"')+crack(fire2),
    zaRush:sword(15,33,36,13,lava)+`<path d="M4 18 L16 18 M2 24 L14 24 M6 30 L16 30" stroke="${fire}" stroke-width="2.2" stroke-linecap="round"/>`,
    zaCinder:flame(10,32,.45)+flame(20,28,.5)+flame(30,24,.55)+`<path d="M4 38 L40 24" stroke="${lava}" stroke-width="2.4" stroke-dasharray="4 3"/>`,
    zaAnvil:`<path d="M8 30 L36 30 L32 24 L14 24 Q8 22 6 18 L16 18 L16 24 Z" fill="#4a4048" stroke="${ink}" stroke-width="1.2"/><path d="M18 30 L16 38 L28 38 L26 30 Z" fill="#3a3038"/>`+sword(35,2,23,21,lava,2.6),
    zaCrack:shield(stone,'#3a2a20')+crack(fire),
    zaGeyser:ground('#3a2418')+`<path d="M18 34 Q16 18 20 6 Q22 12 24 6 Q28 18 26 34 Z" fill="${lava}" stroke="${ink}" stroke-width="1.1"/><path d="M20 30 Q20 18 22 12 Q24 18 24 30 Z" fill="${fire2}"/>`,
    zaPool:`<ellipse cx="22" cy="28" rx="16" ry="8" fill="${lava}" stroke="${ink}" stroke-width="1.3"/><ellipse cx="22" cy="27" rx="10" ry="4.5" fill="${fire2}" opacity=".8"/><circle cx="16" cy="25" r="2" fill="#fff3c8"/><circle cx="27" cy="29" r="1.6" fill="#fff3c8"/>`+steam(30,22,fire2),
    zaFury:flame(22,24,1.1,lava)+`<path d="M14 28 L18 22 M30 28 L26 22" stroke="${ink}" stroke-width="2"/>`,
    zaGuard:shield(lava,'#2a1a24')+`<path d="M15 14 L22 26 L29 14" stroke="${lava}" stroke-width="2" fill="none"/>`,
    zaUlt:volcano()+flame(22,10,.5,lava)+star(10,10,3,fire2)+star(34,8,3,fire2),
    zaHeir:head(22,24,1.05,'#5a1a2a',fire2)+`<path d="M14 10 L17 4 L20 9 L22 3 L24 9 L27 4 L30 10 Z" fill="${gold}" stroke="${ink}" stroke-width=".8"/>`,
    zbHeart:head(22,22,1.1,'#9a8a74',amber)+rock(33,32,.45),
    zbSpike:ground()+spike(22,36,26,9)+steam(12,30)+steam(33,30),
    zbMark:eye(22,22,1)+`<path d="M8 10 Q12 6 16 10 M28 10 Q32 6 36 10" stroke="#6a9a5a" stroke-width="2" fill="none"/>`,
    zbVent:ground()+`<path d="M14 34 L20 30 L26 34" stroke="${amber}" stroke-width="2" fill="none"/>`+steam(18,26)+steam(24,24)+steam(30,27),
    zbTrance:`<path d="M22 22 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a9 9 0 1 1 -9 -9" stroke="${amber}" stroke-width="2.2" fill="none"/>`+steam(32,34),
    zbChain:rock(22,24,1.1)+chain(4,10,40,34)+chain(4,34,40,10),
    zbLink:rock(22,22,.7)+chain(22,22,6,8)+chain(22,22,38,8)+chain(22,22,22,40),
    zbQuake:ground()+ring(9,amber,2.2)+ring(15,stone,1.8,'stroke-dasharray="4 3"')+crack(),
    zbFault:`<path d="M4 34 L12 30 L18 32 L26 24 L32 26 L40 16" stroke="${amber}" stroke-width="3" fill="none"/>`+spike(14,30,12,4)+spike(28,24,14,5),
    zbMono:mono()+ground('#3a3026'),
    zbOracle:mono(18)+steam(31,24)+steam(35,30),
    zbGaia:`<path d="M6 36 L16 16 L22 24 L28 12 L38 36 Z" fill="#8a7a62" stroke="${ink}" stroke-width="1.3"/><path d="M26 16 L28 12 L30 17" fill="${marble}"/><circle cx="16" cy="28" r="2" fill="${amber}"/>`,
    zbAegis:shield(marble,'#d8cdb8')+`<path d="M15 14 Q22 22 29 14 M14 22 Q22 30 30 22" stroke="#a89878" stroke-width="1.4" fill="none"/>`,
    zbUlt:eye(22,20,1.15)+`<path d="M6 38 L12 30 L18 36 L24 28 L30 36 L38 30" stroke="${stone}" stroke-width="2" fill="none"/>`,
    zbProph:`<path d="M12 36 L22 12 L32 36" stroke="#a89878" stroke-width="2.4" fill="none"/><path d="M14 30 L30 30" stroke="#a89878" stroke-width="2"/>`+eye(22,14,.5)+steam(34,24),
    zxSmith:sword(8,37,29,14,fire)+star(30,10,3,fire2)+star(36,16,3,fire2)+star(34,24,3,fire2)+star(28,30,3,marble),
    zxWhite:flame(22,24,1.15,'#fff4d0','#ffffff')+`<circle cx="22" cy="24" r="14" fill="none" stroke="${fire2}" stroke-width="1.4"/>`,
    zxStare:eye(16,20,.75)+`<path d="M26 20 L38 14 M26 20 L38 28" stroke="${amber}" stroke-width="2"/>`+rock(36,34,.4),
    zxLiving:`<path d="M22 6 L34 12 L34 26 L22 38 L10 26 L10 12 Z" fill="${marble}" stroke="${ink}" stroke-width="1.3"/>`+star(22,22,9,amber),
    zxComet:`<path d="M3 24 L15 13" stroke="${lava}" stroke-width="3.6" stroke-linecap="round" opacity=".75"/><path d="M10 41 L22 30" stroke="${fire}" stroke-width="3.6" stroke-linecap="round" opacity=".75"/><path d="M2 33 L9 27" stroke="${fire2}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`+sword(13,33,32,12,lava,3)+star(32,12,5,fire2),
    zxVeil:`<circle cx="22" cy="22" r="15" fill="#d8cdb8" opacity=".35"/>`+ring(15,marble,1.8,'stroke-dasharray="5 3"')+rock(22,24,.7),
    zxWind:head(20,24,.95,'#c0402a')+`<path d="M30 12 Q38 14 34 20 Q30 24 36 26" stroke="${col}" stroke-width="2" fill="none"/>`,
    zxPlate:`<path d="M10 12 L34 12 L32 34 L12 34 Z" fill="#2a1a18" stroke="${ink}" stroke-width="1.3"/><path d="M12 20 L32 20 M13 27 L31 27 M22 12 L22 34" stroke="${lava}" stroke-width="1.6"/>`,
    zxGarden:rock(14,30,.8)+rock(30,30,.7)+rock(22,16,.6)+star(22,26,6,amber),
    zxAscend:head(22,24,1.15,gold,'#ffffff')+`<path d="M10 40 Q22 34 34 40" stroke="${gold}" stroke-width="2" fill="none"/>`+star(36,8,4,'#fff'),
    zxTyphon:sword(8,37,28,16,lava)+star(30,12,5,fire2)+star(35,20,4,fire)+star(30,28,3.5,fire2),
    zxEmbrace:hand(10,34,1.1)+hand(34,34,1.1)+hand(22,30,1.2)+ring(15,amber,1.8)
  };
  const g=G[k]||flame(22,22,1);
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><defs><radialGradient id="g" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="${col}" stop-opacity=".22"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><rect width="44" height="44" rx="7" fill="${bg}"/><rect width="44" height="44" rx="7" fill="url(#g)"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);SKILL_ICON_ART[d.name]=fb;
    if(ZD_ICONS_PAINTED){const src='assets/icons/drake/'+d.key+'.webp',im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}}
  return ['star',col,bg];}
