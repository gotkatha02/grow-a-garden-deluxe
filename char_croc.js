/* =====================================================================
   AETHERFALL — AZTEC CROCODILE · skill rework (12 Tails style)
   Loaded for the crocodile; index.html calls installCrocRework() after the original croc block,
   so every existing animation / effect maker (thrust, bite, tail, death roll…) is reused.

     Basic  · River Hatchling   — spear poke + snap, Tail Sweep (now hits all around), scales, stride
     A Tree · Temple Lancer     — mid range precision. ARMOR BREAK stacks on the target (spear hits),
                                   finishers (Piercing Finish · Temple Execution · Sunpiercer) cash them in
     B Tree · River Predator    — close range brawler. BLOOD FRENZY 0–10 on the crocodile (bites / tail),
                                   bites heal at 5+, Death Roll / Apex Lunge burn it for extra damage
     C Tree · Ancient Maw       — 4 upgrades each for Basic / A / B at Lv 55 / 60 / 70 / 80 (5 new actives)

   Owner's rules: no percent effects (flat numbers; counters instead of chances). Skill power written as ATK×n.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const CRX_BAL={
  ab:{cap:5,capEdge:7,dur:6,def:4},                 // Armor Break: per stack target DEF −4
  fz:{cap:10,need:5,idle:4,decay:1.5},              // Blood Frenzy
  scale:{crTail:.8,caCrescent:.65,caBoundary:.7,caExecution:1.3,caSunpiercer:1.5,cbFrenzy:1.4},   // power trims vs. the old makers
  fin:{caFinish:.4,caExecution:.5,caSunpiercer:.3},  // ATK×n added per Armor Break stack cashed in
  v:{
    crHide:[5,10],crScales:[60,90],crStride:[40,50],crSenses:[10,20],
    caDiscipline:[10,20],caDistance:[6,12,18,24],caEdge:[20,35],caShatter:[25,40],
    cbHide:[8,15],cbHunger:[.4,.6,.8,1.0],cbIronJaws:[20,35],cbScent:[25,40],
    ccReach:15,ccScales:40,ccApex2:40,ccAwakenPer:10,ccAwakenMax:5,ccFeastHeal:1.0,ccTempleKeep:2,
    roll:.05,lunge:.25
  }};
const CXV=CRX_BAL.v;
const cxX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const cxL=(arr,k)=>arr[Math.max(1,Math.min(arr.length,LV[k]||0))-1];

/* power shown in descriptions (old maker formula × trim) */
const CXD={
  crThrust:[1.6,1.8,2.0,2.2],crTail:[1.16,1.36,1.56],crBite:[2.15,2.5,2.85],
  caPierce:[2.35,2.7,3.05,3.4],caLongFang:[1.9,2.2,2.5],caImpale:2.2,caFracture:[1.5,1.7,1.9],caCrescent:[1.17,1.37],caHook:[1.4,1.6],
  caSerpent:[.82,.94,1.06],caFinish:2.6,caBoundary:.84,caExecution:[4.68,5.98],caSunpiercer:6.3,
  cbJaw:[2.35,2.7,3.05,3.4],cbLock:[1.45,1.7,1.95],cbShake:.9,cbTailBreaker:[2.0,2.3,2.6],cbRip:[1.5,1.7],cbBodyCrush:[2.3,2.6],
  cbRoll:[[4,.82],[5,.94],[6,1.06]],cbSnap:3.2,cbDrag:1.2,cbLunge:2.8,cbFrenzy:[8,1.05,2.8],cbAmbush:2.1,ccReversal:[1.6,2.2],caRain:2.6
};

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const CRX_DEFS=[
 // ---------------- BASIC · RIVER HATCHLING ----------------
 {key:'crThrust',br:'basic',row:1,max:4,d:'แทงหอกระยะหอก +1 เกราะแตก',lv:i=>[`${cxX(CXD.crThrust[i-1])}`,'เป้า Off-Balance +ATK×0.2']},
 {key:'crBite',br:'basic',row:1,max:3,d:'งับระยะประชิด +1 เลือดเดือด',lv:i=>[`${cxX(CXD.crBite[i-1])}`]},
 {key:'crTail',br:'basic',row:2,max:3,d:'หมุนตัวฟาดหางรอบตัว ทำให้เสียหลัก (Off-Balance) +1 เลือดเดือด',lv:i=>[`${cxX(CXD.crTail[i-1])} รัศมี 84`,'Off-Balance 0.8 วิ']},
 {key:'crHide',br:'basic',row:2,max:2,passive:1,d:'(Passive) เกล็ดหนา',lv:i=>[`ดาเมจที่ได้รับ −${CXV.crHide[i-1]} ต่อครั้ง`]},
 {key:'crScales',br:'basic',row:3,max:2,d:'เกร็งเกล็ด ครั้งถัดไปที่โดนตีลดดาเมจก้อนใหญ่ (อยู่ได้ 8 วิ)',lv:i=>[`ครั้งถัดไป −${CXV.crScales[i-1]}`]},
 {key:'crStride',br:'basic',row:3,max:2,d:'ว่ายตามน้ำ เดินเร็วขึ้น ล้างสโลว์',lv:i=>[`เดิน +${CXV.crStride[i-1]}`,`${8+2*i} วิ`]},
 {key:'crSenses',br:'basic',row:4,max:2,passive:1,d:'(Passive) สัญชาตญาณนักล่า ตีเป้าที่เสียหลักแรงขึ้น',lv:i=>[`ATK +${CXV.crSenses[i-1]} ใส่เป้า Off-Balance`]},
 // ---------------- A · TEMPLE LANCER (Armor Break) ----------------
 {key:'caPierce',br:'A',row:1,max:4,d:'แทงแรง +1 เกราะแตก (อัปสลับเลเวลกับ Fracture Point)',lv:i=>[`${cxX(CXD.caPierce[i-1])}`]},
 {key:'caDiscipline',br:'A',row:1,max:2,passive:1,d:'(Passive) วินัยหอก ทุกท่าแทงแรงขึ้น',lv:i=>[`ATK +${CXV.caDiscipline[i-1]} (หอก)`]},
 {key:'caLongFang',br:'A',row:2,max:3,d:'แทงยาวทะลุแนว 5 ตัว ทุกตัว +1 เกราะแตก แทงโดนแล้วกดซ้ำเพื่อใช้ Impaling Drive',lv:i=>[`${cxX(CXD.caLongFang[i-1])} ระยะ 190`]},
 {key:'caImpale',br:'A',row:2,max:1,parent:'caLongFang',d:'(ท่าต่อ) แทงดันกระเด็น บอสไม่ถูกผลักแต่เสียหลักแทน',lv:()=>[`${cxX(CXD.caImpale)}`]},
 {key:'caFracture',br:'A',row:3,max:3,pre:[['caPierce',1]],d:'แทงจุดอ่อน +2 เกราะแตก และ DEF เป้าลด 8 วิ',lv:i=>[`${cxX(CXD.caFracture[i-1])}`,'+2 เกราะแตก']},
 {key:'caDistance',br:'A',row:3,max:4,passive:1,d:'(Passive) แทงโดนที่ระยะปลายหอก แรงขึ้นและได้เกราะแตกเพิ่ม 1',lv:i=>[`ATK +${CXV.caDistance[i-1]} ที่ปลายหอก`,'+1 เกราะแตก']},
 {key:'caCrescent',br:'A',row:4,max:2,d:'กวาดหอกครึ่งวงด้านหน้า',lv:i=>[`${cxX(CXD.caCrescent[i-1])}`]},
 {key:'caHook',br:'A',row:4,max:2,pre:[['caFracture',1]],d:'เกี่ยวด้ามหอกให้ศัตรูเสียตำแหน่ง (บอสเสียหลักแทน)',lv:i=>[`${cxX(CXD.caHook[i-1])}`,`Off-Balance ${(1.2+.3*i).toFixed(1)} วิ`]},
 {key:'caSerpent',br:'A',row:5,max:3,d:'แทงรัว 3 ครั้ง ครั้งละ +1 เกราะแตก แทงโดนแล้วกดซ้ำเพื่อใช้ Piercing Finish',lv:i=>[`${cxX(CXD.caSerpent[i-1])} × 3`]},
 {key:'caFinish',br:'A',row:5,max:1,parent:'caSerpent',d:'(ท่าต่อ) แทงปิด ใช้เกราะแตกทั้งหมดบนเป้า',lv:()=>[`${cxX(CXD.caFinish)} + ${cxX(CRX_BAL.fin.caFinish)} ต่อเกราะแตก 1 ชั้น`]},
 {key:'caEdge',br:'A',row:6,max:2,d:'ผิวหอก Obsidian ทุกท่าแทงแรงขึ้น และเกราะแตกซ้อนได้ถึง 7 ชั้น',lv:i=>[`ATK +${CXV.caEdge[i-1]} (หอก)`,'เกราะแตกสูงสุด 7 · 20 วิ']},
 {key:'caBoundary',br:'A',row:6,max:1,pre:[['caHook',1]],d:'กวาดหอกรอบตัว ผลักศัตรูทั่วไปออก รักษาระยะหอก',lv:()=>[`${cxX(CXD.caBoundary)}`]},
 {key:'caShatter',br:'A',row:7,max:2,passive:1,d:'(Passive) เกราะแหลก เป้าที่มีเกราะแตก 5 ชั้นขึ้นไปโดนทุกท่าแรงขึ้น',lv:i=>[`ATK +${CXV.caShatter[i-1]} ใส่เป้าเกราะแตก 5+`]},
 {key:'caExecution',br:'A',row:7,max:1,pre:[['caShatter',1]],d:'ชาร์จแล้วแทงจุดตาย ใช้เกราะแตกทั้งหมด เหมาะกับบอส',lv:()=>[`${cxX(CXD.caExecution[0])} (บอส ${cxX(CXD.caExecution[1])})`,`+${cxX(CRX_BAL.fin.caExecution)} ต่อเกราะแตก 1 ชั้น`]},
 {key:'caSunpiercer',br:'A',row:8,max:1,ult:1,pre:[['caExecution',1],['caFinish',1]],d:'ULTIMATE A · ถอยก้าว ชาร์จปลายหอกทอง แล้วพุ่งทะลวงแนว 280 ใช้เกราะแตกของทุกตัวในแนว',lv:()=>[`${cxX(CXD.caSunpiercer)} ทุกตัวในแนว`,`+${cxX(CRX_BAL.fin.caSunpiercer)} ต่อเกราะแตก 1 ชั้น`]},
 // ---------------- B · RIVER PREDATOR (Blood Frenzy) ----------------
 {key:'cbJaw',br:'B',row:1,max:4,d:'งับแรง +1 เลือดเดือด (อัปสลับเลเวลกับ Tail Breaker)',lv:i=>[`${cxX(CXD.cbJaw[i-1])}`]},
 {key:'cbHide',br:'B',row:1,max:2,passive:1,d:'(Passive) หนังนักล่า มีศัตรูประชิดตัวลดดาเมจที่ได้รับ',lv:i=>[`ดาเมจที่ได้รับ −${CXV.cbHide[i-1]} ต่อครั้ง`]},
 {key:'cbLock',br:'B',row:2,max:3,d:'งับล็อกมอนตัวเล็ก (บอส/ตัวใหญ่: เสียหลักแทน) ล็อกได้แล้วกดซ้ำเพื่อใช้ Violent Shake',lv:i=>[`${cxX(CXD.cbLock[i-1])} · ล็อก ${(1.1+.3*i).toFixed(1)} วิ`]},
 {key:'cbShake',br:'B',row:2,max:1,parent:'cbLock',d:'(ท่าต่อ) สะบัดเหยื่อซ้ายขวา 3 ครั้งแล้วเหวี่ยงทิ้ง',lv:()=>[`${cxX(CXD.cbShake)} × 3`]},
 {key:'cbTailBreaker',br:'B',row:3,max:3,pre:[['cbJaw',1]],d:'หมุนตัวฟาดหางแรงรอบตัว ทำให้เสียหลัก +1 เลือดเดือดต่อตัว',lv:i=>[`${cxX(CXD.cbTailBreaker[i-1])} รัศมี 100`,'Off-Balance 1.4 วิ']},
 {key:'cbHunger',br:'B',row:3,max:4,passive:1,d:'(Passive) หิวกระหาย เลือดเดือด 5 ขึ้นไป ทุกการงับฟื้น HP',lv:i=>[`ฟื้น HP = เลเวล×${CXV.cbHunger[i-1]} ต่อการงับ`]},
 {key:'cbRip',br:'B',row:4,max:2,d:'กัดฉีก เลือดไหล +2 เลือดเดือด',lv:i=>[`${cxX(CXD.cbRip[i-1])} · เลือดไหล ${4+i} วิ`]},
 {key:'cbBodyCrush',br:'B',row:4,max:2,pre:[['cbTailBreaker',1]],d:'พุ่งลำตัวกระแทก ทำให้เสียหลัก',lv:i=>[`${cxX(CXD.cbBodyCrush[i-1])}`]},
 {key:'cbRoll',br:'B',row:5,max:3,d:'งับล็อกแล้วหมุนตัว ใช้เลือดเดือดทั้งหมดเพิ่มพลังทุกฮิต หมุนจบแล้วกดซ้ำเพื่อใช้ Crushing Snap',lv:i=>[`${CXD.cbRoll[i-1][0]} ฮิต × ${cxX(CXD.cbRoll[i-1][1])}`,`+${cxX(CXV.roll)} ต่อฮิต ต่อเลือดเดือด 1 ชั้น`]},
 {key:'cbSnap',br:'B',row:5,max:1,parent:'cbRoll',d:'(ท่าต่อ) งับปิดหนักหลัง Death Roll',lv:()=>[`${cxX(CXD.cbSnap)}`]},
 {key:'cbIronJaws',br:'B',row:6,max:2,d:'ฟันเหล็ก การงับแรงขึ้น และได้เลือดเดือดเพิ่มต่อการงับ',lv:i=>[`ATK +${CXV.cbIronJaws[i-1]} (งับ)`,'+1 เลือดเดือดเพิ่มต่อการงับ · 20 วิ']},
 {key:'cbDrag',br:'B',row:6,max:1,pre:[['cbRoll',1]],d:'ดึงเป้าลงน้ำเข้าประชิด ทำให้เสียหลัก (บอสสโลว์แทน)',lv:()=>[`${cxX(CXD.cbDrag)}`]},
 {key:'cbScent',br:'B',row:7,max:2,passive:1,d:'(Passive) กลิ่นเลือด เป้า HP ต่ำกว่า 40% โดนแรงขึ้น',lv:i=>[`ATK +${CXV.cbScent[i-1]} ใส่เป้า HP ต่ำ`]},
 {key:'cbLunge',br:'B',row:7,max:1,pre:[['cbScent',1]],d:'กระโจนต่ำงับจุดอ่อน ใช้เลือดเดือดทั้งหมด',lv:()=>[`${cxX(CXD.cbLunge)} + ${cxX(CXV.lunge)} ต่อเลือดเดือด 1 ชั้น`]},
 {key:'cbFrenzy',br:'B',row:8,max:1,ult:1,pre:[['cbLunge',1],['cbSnap',1]],d:'ULTIMATE B · พุ่งงับ หมุนตัว 24 จังหวะแล้วเหวี่ยงทิ้ง เลือดเดือดเต็มก่อนหมุน',lv:()=>[`${CXD.cbFrenzy[0]} × ${cxX(CXD.cbFrenzy[1])} + ปิด ${cxX(CXD.cbFrenzy[2])}`,`+${cxX(CXV.roll)} ต่อฮิต ต่อเลือดเดือด 1 ชั้น`]},
 // ---------------- C · ANCIENT MAW (Lv 55 / 60 / 70 / 80) ----------------
 {key:'ccReach',br:'C',tier:1,col:'basic',passive:1,pre:[['crThrust',4]],name:"Hunter's Reach",d:'ตีปกติเลือกเองอัตโนมัติ: ศัตรูประชิดงับ อยู่ไกลแทง และตีปกติแรงขึ้น',lv:()=>[`ตีปกติ ATK +${CXV.ccReach}`]},
 {key:'ccPierceInst',br:'C',tier:1,col:'A',passive:1,pre:[['caLongFang',3]],name:'Piercing Instinct',icon:['bolt','#3ac890','#1a1612'],d:'Long Fang ให้เกราะแตก 2 ชั้นต่อตัว และทุกตัวที่ 3 ในแนวเสียหลัก',lv:()=>['+2 เกราะแตกต่อตัว','ทุกตัวที่ 3: Off-Balance']},
 {key:'ccDragFang',br:'C',tier:1,col:'B',passive:1,pre:[['cbLock',3]],name:'Dragging Fang',d:'Jaw Lock ลากเหยื่อถอยหลังลงน้ำ และได้เลือดเดือด 2 ชั้น',lv:()=>['ลาก 40 (บอสไม่ถูกลาก)','+2 เลือดเดือด']},
 {key:'ccScales',br:'C',tier:2,col:'basic',passive:1,pre:[['crHide',2]],name:'Ancient Scales',d:'HP ต่ำกว่า 30% เกล็ดโบราณตื่น ลดดาเมจ 5 วิ (ทุก 45 วิ)',lv:()=>[`ดาเมจที่ได้รับ −${CXV.ccScales} ต่อครั้ง`]},
 {key:'caRain',br:'C',tier:2,col:'A',pre:[['caCrescent',2]],name:'Obsidian Rain',d:'[New Active] กระโดดแทงหอกลงพื้น เศษ Obsidian กระเด็น ทุกตัว +2 เกราะแตก',lv:()=>[`${cxX(CXD.caRain)} รัศมี 90`,'+2 เกราะแตก · Cooldown 16 วิ']},
 {key:'cbAmbush',br:'C',tier:2,col:'B',pre:[['cbRip',2]],name:'Low Ambush',d:'[New Active] ย่อตัวพุ่งต่ำใต้น้ำแล้วงับจากระยะไกล +3 เลือดเดือด',lv:()=>[`${cxX(CXD.cbAmbush)} ระยะ 200`,'+3 เลือดเดือด · Cooldown 7 วิ']},
 {key:'ccReversal',br:'C',tier:3,col:'basic',pre:[['crTail',3]],name:'Tail Reversal',d:'[New Active] ฟาดหางด้านหลัง แล้วหมุนแทงหอกด้านหน้า (+เลือดเดือด และ +เกราะแตก)',lv:()=>[`หาง ${cxX(CXD.ccReversal[0])} · หอก ${cxX(CXD.ccReversal[1])}`,'Cooldown 10 วิ']},
 {key:'ccTemple2',br:'C',tier:3,col:'A',passive:1,pre:[['caExecution',1]],name:'Temple Mastery',icon:['dance','#e8b44a','#1a1612'],d:'Piercing Finish และ Temple Execution ไม่ใช้เกราะแตกหมด เหลือไว้ 2 ชั้น',lv:()=>[`เหลือเกราะแตก ${CXV.ccTempleKeep} ชั้น`]},
 {key:'ccApex2',br:'C',tier:3,col:'B',passive:1,pre:[['cbLunge',1]],name:'Apex Predator',icon:['skull','#ff6a4a','#1a1a10'],d:'Death Roll และ Apex Lunge แรงขึ้นใส่เป้า HP ต่ำกว่า 40%',lv:()=>[`ATK +${CXV.ccApex2}`]},
 {key:'ccAwaken',br:'C',tier:4,col:'basic',pre:[['crSenses',2]],name:'Ancient Maw Awakening',d:'[New Active] 18 วิ ร่างจระเข้โบราณ ตีปกติสลับแทง/งับเอง ทุกครั้งที่สลับ ATK เพิ่ม สลับครบ 4 ครั้ง ตีปกติถัดไปเป็นงับปิดยักษ์',lv:()=>[`ATK +${CXV.ccAwakenPer} ต่อการสลับ (สูงสุด ${CXV.ccAwakenMax} ครั้ง)`,'Maw Finisher ATK×3 · Cooldown 90 วิ']},
 {key:'ccSunMastery',br:'C',tier:4,col:'A',passive:1,pre:[['caSunpiercer',1]],name:'Sunpiercer Mastery',d:'Sunpiercer แรงขึ้น และเป้าตัวสุดท้ายโดนแรงอัดซ้ำ',lv:()=>[`Sunpiercer ${cxX(CXD.caSunpiercer*1.2)}`,`แรงอัดซ้ำ ${cxX(3.0)}`]},
 {key:'ccFeast',br:'C',tier:4,col:'B',pre:[['cbIronJaws',2]],name:'Feeding Frenzy',icon:['drop','#ff4a3a','#2a1208'],d:'[New Active] 10 วิ เลือดเดือดค้างเต็ม 10 ชั้น ทุกการงับฟื้น HP',lv:()=>[`ฟื้น HP = เลเวล×${CXV.ccFeastHeal} ต่อการงับ`,'Cooldown 40 วิ']}
];
const CRX_NEW={caShatter:{name:'Shattered Guard',icon:['skull','#1a1612','#e8b44a']},cbHunger:{name:'Blood Hunger',icon:['drop','#ff6a4a','#1a1a10']}};
const CRX_ZIG=[['caPierce','caFracture'],['cbJaw','cbTailBreaker']];

/* =====================================================================
   3. SYSTEMS
   ===================================================================== */
const CRX={fz:0,fzT:0,lastHit:-9,rollBonus:0,lungeBonus:0,altN:0,scaleT:0};
const crxKey=()=>(player.action&&player.action.key)||'basic';
function crxAB(e,n){if(!e||e.dead||n<=0)return;const cap=hasBuff('crEdge')?CRX_BAL.ab.capEdge:CRX_BAL.ab.cap;e.crAB=Math.min(cap,(e.crAB||0)+n);e.crABT=gameTime+CRX_BAL.ab.dur;}
function crxFz(n){CRX.fz=Math.min(CRX_BAL.fz.cap,CRX.fz+n);CRX.lastHit=gameTime;}
let crxLongN=0;
/* replacement damage helper: flat bonuses + the two tree gauges */
function crxHit(e,m,o={}){if(!e||e.dead)return 0;const key=crxKey(),kind=o.kind||'spear';let mul=m*(CRX_BAL.scale[key]||1),flat=0;
  if(isOff(e)){if(o.offBonus)mul+=o.offBonus;if(LV.crSenses)flat+=cxL(CXV.crSenses,'crSenses');}
  if(kind==='spear'){
    if(LV.caDiscipline)flat+=cxL(CXV.caDiscipline,'caDiscipline');if(hasBuff('crEdge'))flat+=cxL(CXV.caEdge,'caEdge');
    let g=1;if(key==='caFracture')g+=1;if(key==='caRain')g+=1;
    if(key==='caLongFang'&&LV.ccPierceInst){g+=1;crxLongN++;if(crxLongN%3===0)crOff(e);}
    const dd=dist(player,e)-(e.r||17);if(LV.caDistance&&dd>=CR_BAL.spear*CR_BAL.perfLo-20&&dd<=CR_BAL.spear*CR_BAL.perfHi){flat+=cxL(CXV.caDistance,'caDistance');g+=1;if(!o.quiet)tipGlint();}
    const per=CRX_BAL.fin[key];if(per&&(e.crAB||0)>0){const n=e.crAB;mul+=per*n;e.crAB=(LV.ccTemple2&&key!=='caSunpiercer')?Math.min(n,CXV.ccTempleKeep):0;addFx(new ArmorCrack({e,big:true}));
      addFx(new DText({x:e.x,y:e.y,z:(e.boss?96:70),text:'เกราะแตก ×'+n,color:'#ffd27a',size:12,life:.8}));}
    else crxAB(e,g);}
  if(kind==='maw'||kind==='tail'){
    let g=1;if(key==='cbRip')g+=1;if(key==='cbAmbush')g+=2;if(key==='cbLock'&&LV.ccDragFang)g+=1;if(kind==='maw'&&hasBuff('crIronJaws')){flat+=cxL(CXV.cbIronJaws,'cbIronJaws');g+=1;}
    if(key==='cbRoll'||key==='cbFrenzy')mul+=CRX.rollBonus;if(key==='cbLunge')mul+=CRX.lungeBonus;
    if(kind==='maw'){if(hasBuff('crFeast'))crxHeal(PS.lv*CXV.ccFeastHeal);else if(LV.cbHunger&&CRX.fz>=CRX_BAL.fz.need)crxHeal(PS.lv*cxL(CXV.cbHunger,'cbHunger'));}
    if(!(key==='cbRoll'||key==='cbFrenzy'||key==='cbLunge'))crxFz(g);else CRX.lastHit=gameTime;}
  if(LV.cbScent&&e.hp<e.maxHp*.4)flat+=cxL(CXV.cbScent,'cbScent');
  if(LV.ccApex2&&(key==='cbRoll'||key==='cbLunge'||key==='cbFrenzy')&&e.hp<e.maxHp*.4)flat+=CXV.ccApex2;
  if(LV.caShatter&&(e.crAB||0)>=5)flat+=cxL(CXV.caShatter,'caShatter');
  if(key==='basic'&&LV.ccReach)flat+=CXV.ccReach;
  if(hasBuff('crMaw')&&(kind==='spear'||kind==='maw')&&!o.dot){if(CR.kind&&CR.kind!==kind){CRX.altN=Math.min(CXV.ccAwakenMax,CRX.altN+1);CR.alt++;if(CR.alt>=4){CR.alt=0;CR.mawFin=true;}}flat+=CRX.altN*CXV.ccAwakenPer;}
  if((kind==='spear'||kind==='maw')&&!o.keepKind)CR.kind=kind;
  return hurt(e,mul,Object.assign({critOK:true,crFlat:flat,br:(player.action&&player.action.skill&&SKILLS[player.action.skill])?SKILLS[player.action.skill].br:'basic'},o));}
function crxHeal(n){n=Math.round(n);if(n<=0)return;const g=Math.min(player.maxHp-player.hp,n);if(g<=0)return;player.hp+=g;try{dmgNum(player.x,player.y,74,'+'+g,'heal');}catch(_){}}

/* gauges on screen + upkeep.
   2026-11-21 BUG FIX: enterMap() clears every effect object, and the game enters its first map right after the croc is installed,
   so CrxCore (Armor Break / Blood Frenzy decay, gauges) and the old CrOverlay (it holds the grabbed prey: Jaw Lock, Death Roll,
   Off-Balance marks, Ancient Maw reset) were gone from the start — a locked prey could still walk and attack, stacks never expired.
   crEnsure() puts them back on every cast and basic attack (like kEnsure / bEnsure / uEnsure of the other heroes).
   A keeper on layer 'none' (enterMap keeps those) calls it every frame, so after a map change nothing waits for the next cast
   (same pattern as the axolotl's AxKeeper); the bench clears everything, then the next cast brings it all back. */
let CRX_CORE=null,CRX_KEEP=null;
class CrKeeper{constructor(){this.layer='none';}update(){crEnsure();return CHAR==='croc';}draw(){}}
function crEnsure(){if(CHAR!=='croc')return;if(!CRX_CORE||!fx.includes(CRX_CORE))CRX_CORE=addFx(new CrxCore());
  try{if(typeof CrOverlay!=='undefined'&&(!crOverlay||!fx.includes(crOverlay)))crOverlay=addFx(new CrOverlay());}catch(_){}
  if(!CRX_KEEP||!fx.includes(CRX_KEEP))CRX_KEEP=addFx(new CrKeeper());
  if(window.CRV&&window.CRV.ensure)window.CRV.ensure();}
class CrxCore{constructor(){this.t=0;this.layer='top';this.dk=0;}
  update(dt){this.t+=dt;for(const e of enemies)if(e.crAB&&e.crABT<gameTime)e.crAB=0;
    if(hasBuff('crFeast'))CRX.fz=CRX_BAL.fz.cap;
    else if(CRX.fz>0&&gameTime-CRX.lastHit>CRX_BAL.fz.idle){this.dk+=dt;if(this.dk>=CRX_BAL.fz.decay){this.dk=0;CRX.fz--;}}else this.dk=0;
    if(!hasBuff('crMaw'))CRX.altN=0;return CHAR==='croc';}
  draw(){const [x,y]=P(player.x,player.y,0);
    if(CRX.fz>0||LV.cbJaw){for(let i=0;i<CRX_BAL.fz.cap;i++){const on=i<CRX.fz;ctx.fillStyle=on?(CRX.fz>=CRX_BAL.fz.need?'#ff4a3a':'#c86a4a'):'rgba(255,255,255,.18)';ctx.fillRect(x-25+i*5,y+11,4,on?5:3);}}
    for(const e of enemies){if(e.dead||!(e.crAB>0))continue;const [ex,ey]=P(e.x,e.y,(e.boss?78:52));const n=e.crAB;for(let i=0;i<n;i++){ctx.save();ctx.translate(ex-(n-1)*4.5+i*9,ey);ctx.rotate(Math.PI/4);ctx.fillStyle=n>=5?'#ffd27a':'#c8862e';ctx.strokeStyle='#1a1612';ctx.lineWidth=1;ctx.fillRect(-3,-3,6,6);ctx.strokeRect(-3,-3,6,6);ctx.restore();}}}}

/* =====================================================================
   4. NEW / WRAPPED MAKERS
   ===================================================================== */
/* tail skills turn the crocodile away from the nearest enemy first, so the swipe always connects */
function crxTailFace(){const t=nearestEnemy(player.x,player.y,140);if(t)faceTo(angTo(t)+Math.PI);}
function mkCcFeast(c){return buffAct({key:'ccFeast',name:'Feeding Frenzy',speed:1.8,glow:'#ff4a3a',events:tP=>[{t:tP,f:()=>{addBuff('crFeast',10);CRX.fz=CRX_BAL.fz.cap;addFx(new DText({x:player.x,y:player.y,z:100,text:'FEEDING FRENZY',color:'#ff6a4a',size:15,life:1.2}));mudSplash(player.x,player.y,14,180);shake(2.5);}}]});}

/* =====================================================================
   5. INSTALL
   ===================================================================== */
function crocAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);if(!t)return false;
  const d=dist(player,t),near=enemies.filter(e=>!e.dead&&dist(e,player)<200),cast=k=>{player.attackTarget=t;castSkill(k,{target:t,phi:angTo(t),gx:t.x,gy:t.y});return true;};
  const cb=player.combo;if(cb&&cb.parent&&SKILLS[cb.parent]&&LV[SKILLS[cb.parent].follow]>0){const fk=SKILLS[cb.parent].follow;if(!(player.cd[fk]>0)&&player.mp>=(SKILLS[fk].mp||0)){useSkill(cb.parent);if(busy())return true;}}
  if(d>260)return false;
  if(player.hp<player.maxHp*.5&&ready('crScales')&&!hasBuff('crScales'))return cast('crScales');
  if((t.boss||near.length>=3)){for(const k of ['caSunpiercer','cbFrenzy','ccAwaken'])if(ready(k))return cast(k);}
  for(const [k,b] of [['caEdge','crEdge'],['cbIronJaws','crIronJaws'],['ccFeast','crFeast']])if(ready(k)&&!hasBuff(b))return cast(k);
  if((t.crAB||0)>=5){for(const k of ['caExecution','caSerpent'])if(ready(k))return cast(k);}
  if(CRX.fz>=8){for(const k of ['cbLunge','cbRoll'])if(ready(k))return cast(k);}
  if(near.length>=3){for(const k of ['caRain','cbTailBreaker','caCrescent','crTail','caBoundary','ccReversal'])if(ready(k))return cast(k);}
  for(const k of ['caFracture','caPierce','caLongFang','caSerpent','cbJaw','cbRip','cbLock','cbAmbush','caHook','cbBodyCrush','cbDrag','crBite','crThrust','crTail','cbTailBreaker','ccReversal'])if(ready(k)){const s=SKILLS[k];if(s.type!=='melee'||d<=(s.range||120)+t.r)return cast(k);}
  return false;}

function installCrocRework(){if(CHAR!=='croc')return;
  const OLD=Object.assign({},SKILLS);
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  const MAKE={ccFeast:mkCcFeast};
  for(const d of CRX_DEFS){const o=OLD[d.key]||{},nw=CRX_NEW[d.key]||{};
    const sk=Object.assign({},o,{br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,name:d.name||nw.name||o.name,icon:d.icon||nw.icon||o.icon||['star','#e8b44a','#1a1612']});
    delete sk.follow;delete sk.comboWin;delete sk.parent;delete sk.needHit;delete sk.creq;delete sk.rq;delete sk.tier;delete sk.pre;
    if(d.passive){sk.passive=1;delete sk.make;}else if(MAKE[d.key])sk.make=MAKE[d.key];
    if(!d.passive&&!sk.make)console.warn('croc rework: no maker for',d.key);
    if(d.key==='ccFeast'){sk.mp=20;sk.cd=40;sk.type='self';}
    if(d.key==='caRain'||d.key==='cbAmbush'||d.key==='ccReversal'||d.key==='ccAwaken'){}
    if(d.ult)sk.ult=1;if(d.pre&&d.br!=='C')sk.pre=d.pre;
    if(d.parent){sk.parent=d.parent;sk.needHit=d.key==='cbShake'?'grab':'hit';}
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${(CRX_DEFS.find(x=>x.key===q)||{}).name||OLD[q]&&OLD[q].name||q} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;}
  /* follow-ups (kept from the original): parents open their combo */
  Object.assign(SKILLS.caLongFang,{follow:'caImpale',comboWin:1});Object.assign(SKILLS.caSerpent,{follow:'caFinish',comboWin:1});
  Object.assign(SKILLS.cbLock,{follow:'cbShake',needHit0:1,comboWin:1.3});Object.assign(SKILLS.cbRoll,{follow:'cbSnap',comboWin:1.2});
  /* tail skills face away first; roll / lunge / frenzy burn Blood Frenzy at the start */
  for(const k of ['crTail','cbTailBreaker'])if(SKILLS[k].make){const mk=SKILLS[k].make;SKILLS[k].make=function(c){crxTailFace();return mk.apply(this,arguments);};}
  for(const k of ['cbRoll','cbFrenzy','cbLunge'])if(SKILLS[k].make){const mk=SKILLS[k].make;SKILLS[k].make=function(c){if(k==='cbFrenzy')CRX.fz=CRX_BAL.fz.cap;const a=mk.apply(this,arguments);if(a){const n=CRX.fz;CRX.fz=0;CRX.rollBonus=k==='cbLunge'?0:n*CXV.roll;CRX.lungeBonus=k==='cbLunge'?n*CXV.lunge:0;if(n)addFx(new DText({x:player.x,y:player.y,z:96,text:'เลือดเดือด ×'+n,color:'#ff6a4a',size:12,life:.8}));}return a;};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  /* descriptions (flat numbers only) */
  for(const d of CRX_DEFS){const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);if(d.br==='C')o[1].push('เงื่อนไข: '+SKILLS[d.key].rq);JG_DESC[d.key]={d:(d.br==='C'&&d.passive?'[Addition] ':'')+d.d,lv:o};}
  /* zigzag levels */
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of CRX_ZIG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  Object.assign(SK_KO,{caFracture:1.6,caShatter:0,cbAmbush:2,ccFeast:0});
  TABS.length=0;TABS.push({n:'Basic',keys:['crThrust','crBite','crTail','crScales','crStride']},
    {n:'Lancer',keys:['caPierce','caFracture','caLongFang','caSerpent','caCrescent','caHook','caBoundary','caEdge','caExecution','caSunpiercer']},
    {n:'Predator',keys:['cbJaw','cbTailBreaker','cbLock','cbRip','cbBodyCrush','cbRoll','cbDrag','cbIronJaws','cbLunge','cbFrenzy']},
    {n:'Ancient',keys:['caRain','cbAmbush','ccReversal','ccAwaken','ccFeast']});
  Object.assign(BUFFDEF,{crFeast:{n:'Feeding Frenzy',c:'#ff4a3a',i:'FEAST'}});
  /* damage helper + hooks: flat values only */
  cr=crxHit;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,o&&o.magic?D.mag:D.patk);let m=(base+((o&&o.crFlat)||0))/base;
    if(e&&e.crAB>0){const df=(e.m&&e.m.def)||0;if(df>0&&o)o._defCut=(o._defCut||0)+e.crAB*CRX_BAL.ab.def;}return m;};
  window.jgDmgTaken=()=>1;window.jgPreHit=()=>1;
  window.jgAbsorb=(d,e)=>{let r=0;if(LV.crHide)r+=cxL(CXV.crHide,'crHide');if(LV.cbHide&&enemies.some(q=>!q.dead&&dist(q,player)<q.r+70))r+=cxL(CXV.cbHide,'cbHide');if(hasBuff('crAncient'))r+=CXV.ccScales;
    if(hasBuff('crScales')){r+=cxL(CXV.crScales,'crScales');delete player.buffs.crScales;addFx(new SheenSweep({color:'#f4ead2',life:.35}));}return Math.max(1,d-r);};
  window.jgPostHit=()=>{if(LV.ccScales&&player.hp>0&&player.hp<player.maxHp*.3&&CRX.scaleT<=gameTime){CRX.scaleT=gameTime+45;addBuff('crAncient',5);addFx(new SheenSweep({color:'#ffb060'}));}};
  window.jgMove=()=>1+(hasBuff('crStride')?cxL(CXV.crStride,'crStride'):0)/165;
  /* every cast and basic attack re-adds the core tickers if a map change took them away */
  for(const k in SKILLS){const sk=SKILLS[k];if(!sk.make)continue;const mk=sk.make;sk.make=function(){crEnsure();return mk.apply(this,arguments);};}
  if(typeof mkBasic==='function'){const mb=mkBasic;mkBasic=function(){crEnsure();return mb.apply(this,arguments);};}
  window.crocAutoTick=crocAutoTick;crEnsure();window.crEnsure=crEnsure;window.CRX=CRX;
  /* branch of a skill (C skills: the column they belong to) — for the per-branch bench: HERO=croc COL=crCol tools/qa/bench_branch.py */
  window.crCol=k=>{const s=SKILLS[k];if(!s)return 'basic';if(s.br!=='C')return s.br;const d=CRX_DEFS.find(x=>x.key===k);return d&&d.col||'basic';};}
