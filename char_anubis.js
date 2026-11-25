/* =====================================================================
   TOTEM LEGEND — ANUBIS JACKAL (Egypt) — 12 Tails style
   Character module. Loaded only when the Anubis jackal is played; index.html calls installAnubis().
   Design: ANUBIS_SKILLS_TH.md

     Basic  · Duat Initiate     — chain flail, Ankh Spike, Jackal Lunge, Linen Wraps shield, Embalming heal, Standard of Ra
     A Tree · Flail Dervish     — wide sweeps, spins, leaps; MOMENTUM 0–5 (A hits), Duat Cyclone spends it
     B Tree · Judge of the Dead — hook, bind and crush one target; SIN 0–3 on the condemned, Final Judgment spends it
     C Tree · Warden of the Duat — 12 nodes, each tied to the Basic / A / B skill of the same row (Lv 55 / 60 / 70 / 80)

   Pure physical hero: every skill uses ATK.
   Owner's rules: no percent effects (flat numbers, counters instead of chances). Attack speed fixed (CHAR_ASPD).
   Sprite: the wolf's sprite stands in until Anubis's own clips are made. All FX are code placeholders.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. BALANCE
   --------------------------------------------------------------------- */
const ANU_BAL={
  mom:{cap:5,T:4},
  sin:{cap:3},
  sk:{
    // ---- Basic
    anFlail:{chain:[2,3,4,4],hit:1.0},
    anSpike:{every:4,dmg:[.6,.8,1.0],R:90},
    anLunge:{dist:[150,180,210],dmg:1.4,cd:9,mp:10},
    anWraps:{shield:[4,6,8],T:6,cd:18,mp:12},
    anRite:{hp:[5,8],sp:[15,25],cd:25,mp:0},
    anHide:{block:[3,6,9,12]},
    anStandard:{R:140,T:8,sp:[3,4,5],atk:[20,30,40],cd:30,mp:16},
    // ---- A · Flail Dervish
    aaSweep:{dmg:[1.2,1.4,1.6,1.8],R:140,cd:4,mp:10,range:140},
    aaRolling:{atk:[4,6,8]},
    aaSpin:{dmg:[.4,.5],R:150,T:2,cd:10,mp:16,range:140},
    aaEye:{pull:[40,60]},
    aaLasso:{dmg:[1.6,2.0],len:220,cd:8,mp:14,range:220},
    aaRicochet:{dmg:[.8,1.2],n:2},
    aaMeteor:{dmg:[2.4,3.0],R:140,cd:10,mp:16,range:260},
    aaShock:{dmg:1.0,R:180},
    aaCyclone:{dmg:[2.4,3.0],per:.6,R:190,cd:12,mp:20},
    aaOrbit:{back:[2,3]},
    aaIron:{block:[2,3,4]},
    aaGuard:{n:3,T:4,cd:16,mp:12},
    aaWheel:{dmg:[.7,.9],R:250,T:4,cd:60,mp:50},
    aaFlare:{dmg:4.0,R:250},
    // ---- B · Judge of the Dead
    abHook:{dmg:[1.2,1.4,1.6,1.8],cd:5,mp:10,range:260},
    abGaze:{atk:[6,9,12]},
    abCrush:{dmg:[2.6,3.2],cd:7,mp:14,range:110},
    abFeather:{stun:[.6,1]},
    abBind:{dmg:[1.0,1.4],root:2,cd:12,mp:14,range:260},
    abSpread:{n:[1,2],R:170},
    abPounce:{dmg:[1.8,2.2],cd:9,mp:14,range:260},
    abDoor:{dmg:1.5},
    abJudge:{dmg:[2.8,3.4],per:1.0,cd:12,mp:20,range:140},
    abVerdict:{dmg:[1.2,1.6]},
    abKeeper:{block:[8,12,16]},
    abGate:{T:1.5,cd:16,mp:12},
    abHall:{n:10,gap:.25,dmg:[.8,1.1],sp:130,spm:.6,T:3,cd:60,mp:50,range:320},
    abSeal:{dmg:4.0},
    // ---- C
    acFrenzy:{dmg:1.6,R:140},
    acTwin:{},
    acBarbed:{root:1,sin:2},
    acRush:{},
    acDevil:{dmg:.6,R:115,T:4,cd:14,mp:18,range:260},
    acBreaker:{dmg:3.0,len:220,w:30,cd:14,mp:20,range:220},
    acRebirth:{T:10,hp:1,atk:30,cd:40,mp:20},
    acTwinMeteor:{dmg:2.0},
    acPack:{n:2,dmg:1.0},
    acAvatar:{T:15,atk:60,cd:90,mp:40},
    acWrath:{dmg:4.0,per:.5,R:170,cd:50,mp:40,range:320},
    acVerdict:{dmg:6.0,per:1.0,cd:50,mp:40,range:200}
  }
};
const UK=ANU_BAL.sk;
/* branch tuning from the bench: damage numbers of each branch are scaled here so the shown ATK×n stays true */
const ANU_SCALE={A:0.586,B:1.579};   /* re-tuned at the Lv 60 cap 2026-11-22 (≈ 2,050 per branch, LEVEL_CAP_TH.md); older values in git */
(()=>{const r2=v=>Math.round(v*100)/100,sc=(o,f,m)=>{if(o[f]==null)return;o[f]=Array.isArray(o[f])?o[f].map(v=>r2(v*m)):r2(o[f]*m);};
  const colOf=k=>k.startsWith('aa')||['acTwin','acDevil','acTwinMeteor','acWrath'].includes(k)?'A':k.startsWith('ab')||['acBarbed','acBreaker','acPack','acVerdict'].includes(k)?'B':null;
  for(const k in UK){const c=colOf(k);if(!c)continue;for(const f of ['dmg','per'])sc(UK[k],f,ANU_SCALE[c]);}})();
const uA=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

/* ---------------------------------------------------------------------
   2. SKILL DATA
   --------------------------------------------------------------------- */
const ANU_DEFS=[
 // ---------------- BASIC · DUAT INITIATE ----------------
 {key:'anFlail',id:'AN-B01',name:'Chain Flail',br:'basic',row:1,max:4,passive:1,d:'(ตีปกติ) เหวี่ยงลูกตุ้มโซ่ ระยะ 90',lv:i=>[`ต่อ ${UK.anFlail.chain[i-1]} จังหวะ`]},
 {key:'anSpike',id:'AN-B02',name:'Ankh Spike',br:'basic',row:1,max:3,passive:1,d:'(Passive) ทุกจังหวะที่ 4 ลูกตุ้มกวาดวงรอบตัว',lv:i=>[`${uA(UK.anSpike.dmg[i-1])} รัศมี ${UK.anSpike.R}`]},
 {key:'anLunge',id:'AN-B03',name:'Jackal Lunge',br:'basic',row:2,max:3,type:'melee',d:'พุ่งไปข้างหน้า ชนศัตรูในแนว',lv:i=>[`พุ่ง ${UK.anLunge.dist[i-1]} · ${uA(UK.anLunge.dmg)}`,`Cooldown ${UK.anLunge.cd} วิ`]},
 {key:'anWraps',id:'AN-B04',name:'Linen Wraps',br:'basic',row:2,max:3,type:'self',d:'พันผ้ามัมมี่ ได้โล่',lv:i=>[`โล่ = เลเวล × ${UK.anWraps.shield[i-1]} นาน ${UK.anWraps.T} วิ`,`Cooldown ${UK.anWraps.cd} วิ`]},
 {key:'anRite',id:'AN-B05',name:'Embalming Rite',br:'basic',row:3,max:2,type:'self',d:'พิธีถนอมร่าง ฟื้น HP และ SP',lv:i=>[`ฟื้น HP = เลเวล × ${UK.anRite.hp[i-1]}`,`SP +${UK.anRite.sp[i-1]}`,`Cooldown ${UK.anRite.cd} วิ`]},
 {key:'anHide',id:'AN-B06',name:'Desert Hide',br:'basic',row:3,max:4,passive:1,d:'(Passive) ขนหนาทนทราย',lv:i=>[`ดาเมจที่ได้รับ −${UK.anHide.block[i-1]} ต่อครั้ง`]},
 {key:'anStandard',id:'AN-B07',name:'Standard of Ra',br:'basic',row:4,max:3,type:'self',d:'ปักธงสุริยะ ยืนในวงฟื้น SP และ ATK เพิ่ม',lv:i=>[`SP +${UK.anStandard.sp[i-1]} ทุกวิ`,`ATK +${UK.anStandard.atk[i-1]} นาน ${UK.anStandard.T} วิ`,`Cooldown ${UK.anStandard.cd} วิ`]},
 // ---------------- A · FLAIL DERVISH ----------------
 {key:'aaSweep',id:'AN-A01',name:'Ankh Sweep',br:'A',row:1,max:4,type:'melee',d:'กวาดลูกตุ้มครึ่งวงหน้า แรงเหวี่ยง +1 (อัปสลับเลเวลกับ Sandstorm Spin)',lv:i=>[`${uA(UK.aaSweep.dmg[i-1])} ระยะ ${UK.aaSweep.R}`,`Cooldown ${UK.aaSweep.cd} วิ`]},
 {key:'aaRolling',id:'AN-A02',name:'Rolling Momentum',br:'A',row:2,max:3,passive:1,d:'(Passive) แรงเหวี่ยงแต่ละชั้นให้ ATK เพิ่ม (สกิล A)',lv:i=>[`ATK +${UK.aaRolling.atk[i-1]} ต่อชั้น`]},
 {key:'aaSpin',id:'AN-A03',name:'Sandstorm Spin',br:'A',row:3,max:2,type:'self',pre:[['aaSweep',1]],d:'หมุนตัว 2 วิ โดนรอบตัว เดินได้ แรงเหวี่ยง +1 ทุก 1 วิ',lv:i=>[`${uA(UK.aaSpin.dmg[i-1])} ทุก 0.25 วิ รัศมี ${UK.aaSpin.R}`,`Cooldown ${UK.aaSpin.cd} วิ`]},
 {key:'aaEye',id:'AN-A04',name:'Eye of the Storm',br:'A',row:3,max:2,passive:1,enh:'aaSpin',pre:[['aaSpin',1]],d:'(ต่อยอด Sandstorm Spin) ระหว่างหมุน ดูดศัตรูเข้าหาตัว',lv:i=>[`ดูด ${UK.aaEye.pull[i-1]} ต่อวิ`]},
 {key:'aaLasso',id:'AN-A05',name:'Chain Lasso',br:'A',row:4,max:2,type:'melee',d:'ขว้างลูกตุ้มไปแล้วกระชากกลับ โดนทั้งขาไปขากลับ',lv:i=>[`${uA(UK.aaLasso.dmg[i-1])} ยาว ${UK.aaLasso.len}`,`Cooldown ${UK.aaLasso.cd} วิ`]},
 {key:'aaRicochet',id:'AN-A06',name:'Ricochet',br:'A',row:4,max:2,passive:1,enh:'aaLasso',pre:[['aaLasso',1]],d:'(ต่อยอด Chain Lasso) ปลายทางลูกตุ้มกระดอนโดนอีก 2 ตัว',lv:i=>[`${uA(UK.aaRicochet.dmg[i-1])}`]},
 {key:'aaMeteor',id:'AN-A07',name:'Meteor Ankh',br:'A',row:5,max:2,type:'ground',radius:()=>UK.aaMeteor.R,d:'กระโดดทุบพื้นที่ แรงเหวี่ยง +2',lv:i=>[`${uA(UK.aaMeteor.dmg[i-1])} รัศมี ${UK.aaMeteor.R}`,`Cooldown ${UK.aaMeteor.cd} วิ`]},
 {key:'aaShock',id:'AN-A08',name:'Shockwave Ring',br:'A',row:5,max:1,passive:1,enh:'aaMeteor',pre:[['aaMeteor',1]],d:'(ต่อยอด Meteor Ankh) วงคลื่นรอบสอง',lv:()=>[`${uA(UK.aaShock.dmg)} รัศมี ${UK.aaShock.R}`]},
 {key:'aaCyclone',id:'AN-A09',name:'Duat Cyclone',br:'A',row:6,max:2,type:'self',d:'พายุทรายรอบตัว ใช้แรงเหวี่ยงทั้งหมด',lv:i=>[`${uA(UK.aaCyclone.dmg[i-1])} + ${uA(UK.aaCyclone.per)} ต่อแรงเหวี่ยง รัศมี ${UK.aaCyclone.R}`,`Cooldown ${UK.aaCyclone.cd} วิ`]},
 {key:'aaOrbit',id:'AN-A10',name:'Endless Orbit',br:'A',row:6,max:2,passive:1,enh:'aaCyclone',pre:[['aaCyclone',1]],d:'(ต่อยอด Duat Cyclone) หลังปล่อยคืนแรงเหวี่ยง',lv:i=>[`คืน ${UK.aaOrbit.back[i-1]}`]},
 {key:'aaIron',id:'AN-A11',name:'Iron Orbit',br:'A',row:7,max:3,passive:1,d:'(Passive) แรงเหวี่ยงแต่ละชั้นลดดาเมจที่ได้รับ',lv:i=>[`−${UK.aaIron.block[i-1]} ต่อครั้ง ต่อชั้น`]},
 {key:'aaGuard',id:'AN-A12',name:'Chain Guard',br:'A',row:7,max:1,type:'self',d:'หมุนโซ่เป็นกำแพง กันการโจมตี 3 ครั้งถัดไป',lv:()=>[`ภายใน ${UK.aaGuard.T} วิ`,`Cooldown ${UK.aaGuard.cd} วิ`]},
 {key:'aaWheel',id:'AN-A13',name:'Wheel of Ra',br:'A',row:8,max:2,type:'self',ult:1,d:'ULTIMATE A · ลูกตุ้มลุกเป็นจานสุริยะ หมุนตัว แรงเหวี่ยงเต็ม 5',lv:i=>[`${uA(UK.aaWheel.dmg[i-1])} ทุก 0.25 วิ นาน ${UK.aaWheel.T} วิ รัศมี ${UK.aaWheel.R}`,`Cooldown ${UK.aaWheel.cd} วิ`]},
 {key:'aaFlare',id:'AN-A14',name:'Solar Flare',br:'A',row:8,max:1,passive:1,enh:'aaWheel',pre:[['aaWheel',1]],d:'(ต่อยอด Wheel of Ra) จบอัลติ ระเบิดสุริยะรอบตัว',lv:()=>[`${uA(UK.aaFlare.dmg)} รัศมี ${UK.aaFlare.R}`]},
 // ---------------- B · JUDGE OF THE DEAD ----------------
 {key:'abHook',id:'AN-G01',name:'Soul Hook',br:'B',row:1,max:4,type:'melee',d:'ตะขอโซ่ดึงเป้ามาหน้าตัว (บอส: เราพุ่งเข้าไป) บาป +1 (อัปสลับเลเวลกับ Heart Crush)',lv:i=>[`${uA(UK.abHook.dmg[i-1])} ระยะ ${UK.abHook.range}`,`Cooldown ${UK.abHook.cd} วิ`]},
 {key:'abGaze',id:'AN-G02',name:'Weighing Gaze',br:'B',row:2,max:3,passive:1,d:'(Passive) สกิล B ใส่ผู้ถูกตัดสิน ATK เพิ่มต่อบาป',lv:i=>[`ATK +${UK.abGaze.atk[i-1]} ต่อบาป`]},
 {key:'abCrush',id:'AN-G03',name:'Heart Crush',br:'B',row:3,max:2,type:'melee',pre:[['abHook',1]],d:'ทุบลูกตุ้มลงจากหัว ตัวเดียว บาป +1',lv:i=>[`${uA(UK.abCrush.dmg[i-1])}`,`Cooldown ${UK.abCrush.cd} วิ`]},
 {key:'abFeather',id:'AN-G04',name:"Feather of Ma'at",br:'B',row:3,max:2,passive:1,enh:'abCrush',pre:[['abCrush',1]],d:'(ต่อยอด Heart Crush) เป้ามีบาป 3 ทุบแล้วมึน',lv:i=>[`มึน ${UK.abFeather.stun[i-1]} วิ`]},
 {key:'abBind',id:'AN-G05',name:'Binding Chains',br:'B',row:4,max:2,type:'melee',d:'โซ่จากพื้นรัดเป้า ตรึงอยู่กับที่ บาป +1',lv:i=>[`${uA(UK.abBind.dmg[i-1])} · ตรึง ${UK.abBind.root} วิ`,`Cooldown ${UK.abBind.cd} วิ`]},
 {key:'abSpread',id:'AN-G06',name:'Shackle Spread',br:'B',row:4,max:2,passive:1,enh:'abBind',pre:[['abBind',1]],d:'(ต่อยอด Binding Chains) โซ่ลามไปรัดศัตรูใกล้ ๆ',lv:i=>[`อีก ${UK.abSpread.n[i-1]} ตัว`]},
 {key:'abPounce',id:'AN-G07',name:'Jackal Pounce',br:'B',row:5,max:2,type:'melee',d:'กระโจนข้ามไปลงด้านหลังเป้า บาป +1',lv:i=>[`${uA(UK.abPounce.dmg[i-1])}`,`Cooldown ${UK.abPounce.cd} วิ`]},
 {key:'abDoor',id:'AN-G08',name:"Death's Door",br:'B',row:5,max:1,passive:1,enh:'abPounce',pre:[['abPounce',1]],d:'(ต่อยอด Jackal Pounce) เป้ามีบาป 3 ดาเมจเพิ่ม',lv:()=>[`+${uA(UK.abDoor.dmg)}`]},
 {key:'abJudge',id:'AN-G09',name:'Final Judgment',br:'B',row:6,max:2,type:'melee',d:'ตัดสินโทษผู้ถูกตัดสิน ใช้บาปทั้งหมด',lv:i=>[`${uA(UK.abJudge.dmg[i-1])} + ${uA(UK.abJudge.per)} ต่อบาป`,`Cooldown ${UK.abJudge.cd} วิ`]},
 {key:'abVerdict',id:'AN-G10',name:'Second Verdict',br:'B',row:6,max:2,passive:1,enh:'abJudge',pre:[['abJudge',1]],d:'(ต่อยอด Final Judgment) 0.5 วิหลังตัดสิน ตาชั่งตกซ้ำ',lv:i=>[`${uA(UK.abVerdict.dmg[i-1])}`]},
 {key:'abKeeper',id:'AN-G11',name:'Keeper of Thresholds',br:'B',row:7,max:3,passive:1,d:'(Passive) ดาเมจที่ได้รับจากผู้ถูกตัดสินลดลง',lv:i=>[`−${UK.abKeeper.block[i-1]} ต่อครั้ง`]},
 {key:'abGate',id:'AN-G12',name:'Underworld Gate',br:'B',row:7,max:1,type:'self',d:'จมลงเงา ไม่โดนโจมตี แล้วโผล่ด้านหลังผู้ถูกตัดสิน',lv:()=>[`${UK.abGate.T} วิ`,`Cooldown ${UK.abGate.cd} วิ`]},
 {key:'abHall',id:'AN-G13',name:'Hall of Two Truths',br:'B',row:8,max:2,type:'melee',ult:1,d:'ULTIMATE B · ตาชั่งยักษ์ ตรึงผู้ถูกตัดสิน ทุบโซ่รัว 10 ครั้ง แต่ละครั้งกระแทกรอบตัวเป้าด้วย บาปเต็ม 3',lv:i=>[`${uA(UK.abHall.dmg[i-1])} × ${UK.abHall.n} · ตรึง ${UK.abHall.T} วิ`,`Cooldown ${UK.abHall.cd} วิ`]},
 {key:'abSeal',id:'AN-G14',name:"Osiris's Seal",br:'B',row:8,max:1,passive:1,enh:'abHall',pre:[['abHall',1]],d:'(ต่อยอด Hall of Two Truths) จบอัลติ ตราโอซิริสประทับ บาปกลับเป็น 3',lv:()=>[`${uA(UK.abSeal.dmg)}`]},
 // ---------------- C · WARDEN OF THE DUAT ----------------
 {key:'acFrenzy',id:'AN-C01',name:'Chain Frenzy',br:'C',col:'basic',tier:1,passive:1,pre:[['anFlail',4]],d:'ตีปกติต่อ 5 จังหวะ จังหวะที่ 5 หมุนลูกตุ้มรอบตัว',lv:()=>[`${uA(UK.acFrenzy.dmg)} รัศมี ${UK.acFrenzy.R}`]},
 {key:'acTwin',id:'AN-C02',name:'Twin Sweep',br:'C',col:'A',tier:1,passive:1,pre:[['aaSweep',4]],d:'Ankh Sweep กวาดกลับอีกรอบ',lv:()=>['2 ครั้ง']},
 {key:'acBarbed',id:'AN-C03',name:'Barbed Hook',br:'C',col:'B',tier:1,passive:1,pre:[['abHook',4]],d:'Soul Hook ตรึงเป้า และบาป +2',lv:()=>[`ตรึง ${UK.acBarbed.root} วิ · บาป +${UK.acBarbed.sin}`]},
 {key:'acRush',id:'AN-C04',name:'Jackal Rush',br:'C',col:'basic',tier:2,passive:1,pre:[['anLunge',3]],d:'Jackal Lunge พุ่ง 2 ครั้งติดกัน',lv:()=>['2 ครั้ง']},
 {key:'acDevil',id:'AN-C05',name:'Dust Devil',br:'C',col:'A',tier:2,type:'ground',radius:()=>UK.acDevil.R,pre:[['aaSpin',2]],d:'[New Active] พายุทรายหมุนเดินหาศัตรู แรงเหวี่ยง +1 ทุก 1 วิ',lv:()=>[`${uA(UK.acDevil.dmg)} ทุก 0.5 วิ นาน ${UK.acDevil.T} วิ`,`Cooldown ${UK.acDevil.cd} วิ`]},
 {key:'acBreaker',id:'AN-C06',name:'Scale Breaker',br:'C',col:'B',tier:2,type:'melee',pre:[['abCrush',2]],d:'[New Active] ทุบพื้นเป็นรอยแยกเส้นตรง บาป +1 กับผู้ถูกตัดสิน',lv:()=>[`${uA(UK.acBreaker.dmg)} ยาว ${UK.acBreaker.len}`,`Cooldown ${UK.acBreaker.cd} วิ`]},
 {key:'acRebirth',id:'AN-C07',name:'Rite of Rebirth',br:'C',col:'basic',tier:3,type:'self',pre:[['anRite',2]],d:'[New Active] ฟื้น HP ต่อเนื่อง ATK เพิ่ม',lv:()=>[`ฟื้น HP = เลเวล × ${UK.acRebirth.hp} ทุกวิ`,`ATK +${UK.acRebirth.atk} นาน ${UK.acRebirth.T} วิ`,`Cooldown ${UK.acRebirth.cd} วิ`]},
 {key:'acTwinMeteor',id:'AN-C08',name:'Twin Meteors',br:'C',col:'A',tier:3,passive:1,pre:[['aaMeteor',2]],d:'Meteor Ankh กระโดดทุบซ้ำอีกครั้ง',lv:()=>[`${uA(UK.acTwinMeteor.dmg)}`]},
 {key:'acPack',id:'AN-C09',name:'Pack Leader',br:'C',col:'B',tier:3,passive:1,pre:[['abPounce',2]],d:'Jackal Pounce มีเงาหมาจิ้งจอก 2 ตัวกระโจนตาม',lv:()=>[`${uA(UK.acPack.dmg)} ต่อตัว`]},
 {key:'acAvatar',id:'AN-C10',name:'Avatar of Anubis',br:'C',col:'basic',tier:4,type:'self',pre:[['anStandard',3]],d:'[New Active] Signature · ร่างเทพอนูบิส ตีปกติแรงขึ้น แรงเหวี่ยงและบาปได้ทีละ 2',lv:()=>[`ตีปกติ ATK +${UK.acAvatar.atk}`,`นาน ${UK.acAvatar.T} วิ · Cooldown ${UK.acAvatar.cd} วิ`]},
 {key:'acWrath',id:'AN-C11',name:"Ra's Wrath",br:'C',col:'A',tier:4,type:'ground',radius:()=>UK.acWrath.R,pre:[['aaWheel',1]],d:'[New Active] ขว้างลูกตุ้มเป็นดวงอาทิตย์ตกใส่พื้นที่ ใช้แรงเหวี่ยงทั้งหมด',lv:()=>[`${uA(UK.acWrath.dmg)} + ${uA(UK.acWrath.per)} ต่อแรงเหวี่ยง`,`Cooldown ${UK.acWrath.cd} วิ`]},
 {key:'acVerdict',id:'AN-C12',name:'Anubis Verdict',br:'C',col:'B',tier:4,type:'melee',pre:[['abHall',1]],d:'[New Active] หัวอนูบิสยักษ์งับผู้ถูกตัดสิน ใช้บาปทั้งหมด',lv:()=>[`${uA(UK.acVerdict.dmg)} + ${uA(UK.acVerdict.per)} ต่อบาป`,`Cooldown ${UK.acVerdict.cd} วิ`]},
];

/* ---------------------------------------------------------------------
   3. STATE + HELPERS
   --------------------------------------------------------------------- */
const ANU={mom:0,momT:0,cond:null,sin:0,spikeN:0,shield:0,shieldUntil:0,guard:0,guardUntil:0,standard:null,spin:null,devils:[],gateT:0};
const uL=k=>LV[k]||0;
const uLv=(arr,k)=>arr[Math.max(1,Math.min(arr.length,uL(k)))-1];
const UC={sand:'#e8c87a',gold:'#ffd36a',sun:'#ff9a2a',ink:'#2a1a2a',blue:'#3a6ad8',soul:'#6ae0ff',white:'#ffffff'};
const uCol=k=>{if(!k||k==='basic')return 'basic';const d=ANU_DEFS.find(x=>x.key===k);if(!d)return 'basic';return d.br==='C'?d.col:d.br;};
const uAvatar=()=>hasBuff('acAvatar');
function uHit(e,mult,key,o={}){if(!e||e.dead)return 0;const br=uCol(key);return hurt(e,mult,Object.assign({skill:key,br},o));}
const uNear=(x,y,R)=>enemies.filter(e=>!e.dead&&Math.hypot(e.x-x,e.y-y)<=R+e.r*.5);
const uSeg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));};
const uLine=(x0,y0,phi,L,w)=>enemies.filter(e=>!e.dead&&uSeg(e.x,e.y,x0,y0,x0+Math.cos(phi)*L,y0+Math.sin(phi)*L)<e.r+w);
const uCone=(R,phi,half)=>enemies.filter(e=>{if(e.dead)return false;const d=Math.hypot(e.x-player.x,e.y-player.y);if(d>R+e.r)return false;let a=Math.atan2(e.y-player.y,e.x-player.x)-phi;while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return Math.abs(a)<=half||d<e.r+20;});
function uFree(x,y){const c=clampPt(x,y);if(c[0]!==x||c[1]!==y)return false;return !(curMap&&mapBlockedW(x,y));}
function uPathEnd(x0,y0,phi,L){let x=x0,y=y0;for(let d=6;d<=L;d+=6){const nx=x0+Math.cos(phi)*d,ny=y0+Math.sin(phi)*d;if(!uFree(nx,ny))break;x=nx;y=ny;}return [x,y];}
const uTgt=(c,r)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r*1.15,player.phi)||nearestEnemy(player.x,player.y,r*1.15);
const uPhi=(c,t)=>t?angTo(t):(c&&c.phi!=null?c.phi:player.phi);
const uPt=(c,r)=>{const t=uTgt(c,r);return [c.gx??(t?t.x:player.x+Math.cos(player.phi)*120),c.gy??(t?t.y:player.y+Math.sin(player.phi)*120)];};
const uAng=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
/* MOMENTUM (A) */
function uMom(n){if(uAvatar())n*=2;ANU.mom=Math.min(ANU_BAL.mom.cap,ANU.mom+n);ANU.momT=gameTime+ANU_BAL.mom.T;ANU.momPop=1;}
const uOnce=(a,n)=>{if(a&&!a._um){a._um=1;uMom(n);}};
/* SIN (B) on the condemned */
function uCondemn(e){if(!e||e.dead)return;if(ANU.cond!==e){ANU.cond=e;ANU.sin=0;}}
function uSin(e,n){if(!e||e.dead)return;uCondemn(e);if(uAvatar())n*=2;ANU.sin=Math.min(ANU_BAL.sin.cap,ANU.sin+n);ANU.sinPop=1;}
const uSinOf=e=>e&&e===ANU.cond?ANU.sin:0;
function uRoot(e,T){if(e.boss)applyCC(e,{slow:T*1.5});else{e.st.root=Math.max(e.st.root||0,T);e.vx=e.vy=0;}}

/* ---------------------------------------------------------------------
   4. FX (code placeholders — painted pieces come later)
   --------------------------------------------------------------------- */
function uGlow(x,y,r,col,a){if(a<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
function uPow(e,big,col){addFx(new Impact({pos:[e.x,e.y,(e.boss?36:24)],size:big?52:28,color:col||UC.gold,core:'#ffffff',rays:big?10:6,life:big?.24:.15}));}
function uBurst(x,y,R,col){addFx(new GRing({x,y,r0:8,r1:R,w:12,color:col||UC.sand,life:.35}));dustPuff(x,y,8,'#e8d3a0',R*.6,10);}
/* the flail ball drawn in the world */
function uBall(x,y,z,r,col){const [px,py]=P(x,y,z);uGlow(px,py,r*2,col||UC.gold,.35);ctx.save();ctx.fillStyle='#2a2030';ctx.strokeStyle=UC.gold;ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();ctx.stroke();
  for(let i=0;i<6;i++){const a=i*TAU/6;ctx.beginPath();ctx.moveTo(px+Math.cos(a)*r,py+Math.sin(a)*r);ctx.lineTo(px+Math.cos(a)*(r+5),py+Math.sin(a)*(r+5));ctx.stroke();}ctx.fillStyle=UC.gold;ctx.fillRect(px-1.5,py-5,3,10);ctx.fillRect(px-4,py-2,8,2.5);ctx.restore();}
function uChain(x0,y0,x1,y1,z){const [a,b]=P(x0,y0,z),[c,d]=P(x1,y1,z);ctx.save();ctx.strokeStyle=hexA(UC.gold,.9);ctx.lineWidth=2.5;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();ctx.restore();}
class USwing{constructor(o){Object.assign(this,{t:0,life:.22,layer:'top',R:90,a0:0,a1:Math.PI,col:UC.gold},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=eOut(Math.min(1,this.t/this.life)),a=this.a0+(this.a1-this.a0)*k,bx=player.x+Math.cos(a)*this.R,by=player.y+Math.sin(a)*this.R;
    const [px,py]=P(player.x,player.y,0);ctx.save();ctx.translate(px,py);ctx.scale(1,K);ctx.strokeStyle=hexA(this.col,.5*(1-this.t/this.life));ctx.lineWidth=14;ctx.beginPath();
    const s=Math.min(this.a0,a),e=Math.max(this.a0,a);ctx.arc(0,0,this.R,s,e);ctx.stroke();ctx.restore();uChain(player.x,player.y,bx,by,30);uBall(bx,by,30,8);}}
class UThrow{constructor(o){Object.assign(this,{t:0,layer:'top',speed:640,len:220,w:22,d:0,dir:1,hits:new Set()},o);}
  update(dt){this.t+=dt;this.d+=this.speed*dt*this.dir;if(this.dir>0&&this.d>=this.len){this.dir=-1;this.hits.clear();this.turn&&this.turn(this.x,this.y);}
    this.x=player.x+Math.cos(this.phi)*this.d;this.y=player.y+Math.sin(this.phi)*this.d;
    for(const e of enemies){if(e.dead||this.hits.has(e))continue;if(Math.hypot(e.x-this.x,e.y-this.y)<e.r+this.w){this.hits.add(e);this.hit&&this.hit(e);}}
    return this.dir>0||this.d>0;}
  draw(){uChain(player.x,player.y,this.x,this.y,30);uBall(this.x,this.y,30,this.big?16:9,this.col);}}
class UPillar{constructor(o){Object.assign(this,{t:0,life:.35,layer:'top',w:14,col:UC.sun},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=1-this.t/this.life,[x,y]=P(this.x,this.y,0);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(x,y-260,x,y);g.addColorStop(0,hexA(this.col,0));g.addColorStop(1,hexA(this.col,.8*a));ctx.fillStyle=g;ctx.fillRect(x-this.w/2,y-260,this.w,260);ctx.restore();uGlow(x,y,this.w*2.2,this.col,.5*a);}}
class UGround{constructor(){this.t=0;this.layer='ground';}update(dt){this.t+=dt;return CHAR==='anubis';}
  ring(x,y,R,col,a,dash){const [px,py]=P(x,y);ctx.save();ctx.translate(px,py);ctx.scale(1,K);ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=3;if(dash){ctx.setLineDash([8,6]);ctx.lineDashOffset=-this.t*30;}ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.globalAlpha=a*.2;ctx.fillStyle=col;ctx.fill();ctx.restore();}
  draw(){const S=ANU.standard;if(S){this.ring(S.x,S.y,UK.anStandard.R,UC.sun,.55,true);const [x,y]=P(S.x,S.y,0);ctx.fillStyle='#8a6a2e';ctx.fillRect(x-1.5,y-70,3,70);ctx.fillStyle=UC.gold;ctx.beginPath();ctx.arc(x,y-74,9,0,TAU);ctx.fill();}
    const c=ANU.cond;if(c&&!c.dead&&uL('abHook'))this.ring(c.x,c.y,c.r+14,UC.blue,.7,true);
    for(const D of ANU.devils)this.ring(D.x,D.y,UK.acDevil.R,UC.sand,.4,true);
    const s=ANU.spin;if(s)this.ring(player.x,player.y,s.R,s.wheel?UC.sun:UC.sand,.35,true);}}
class UTop{constructor(){this.t=0;this.layer='top';}update(dt){this.t+=dt;ANU.momPop=Math.max(0,(ANU.momPop||0)-dt*4);ANU.sinPop=Math.max(0,(ANU.sinPop||0)-dt*4);return CHAR==='anubis';}
  draw(){const pz=(player.z||0)+86*CHAR_SCALE,[x,y]=P(player.x,player.y,pz);
    if(uL('aaSweep'))for(let i=0;i<ANU_BAL.mom.cap;i++){const on=i<ANU.mom,px=x-16+i*8;ctx.fillStyle=on?(ANU.mom>=5?UC.sun:UC.gold):'rgba(40,30,20,.45)';ctx.beginPath();ctx.arc(px,y-(on?ANU.momPop*2:0),on?3.2:2.2,0,TAU);ctx.fill();}
    const c=ANU.cond;if(c&&!c.dead&&ANU.sin>0){const [cx,cy]=P(c.x,c.y,(c.boss?72:52)*(c.sc||1));for(let i=0;i<ANU.sin;i++){const px=cx-8+i*8;uGlow(px,cy,7,UC.blue,.6);ctx.fillStyle='#d8e8ff';ctx.fillRect(px-1.5,cy-3-ANU.sinPop*2,3,6);}}
    const s=ANU.spin;if(s){for(let i=0;i<2;i++){const a=this.t*16+i*Math.PI;uChain(player.x,player.y,player.x+Math.cos(a)*s.R*.8,player.y+Math.sin(a)*s.R*.8,30);uBall(player.x+Math.cos(a)*s.R*.8,player.y+Math.sin(a)*s.R*.8,30,s.wheel?14:9,s.wheel?UC.sun:UC.gold);}if(s.wheel)uGlow(x,y+50,s.R*.6,UC.sun,.18);}
    for(const D of ANU.devils){const [dx,dy]=P(D.x,D.y,30);ctx.save();ctx.strokeStyle=hexA(UC.sand,.8);ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(dx,dy-i*12,16+i*6,6+i*2,0,this.t*8+i,this.t*8+i+4.4);ctx.stroke();}ctx.restore();}
    if(ANU.shield>0&&ANU.shieldUntil>gameTime){const HZ=window.HERO_K||1,[sx,sy]=P(player.x,player.y,36*HZ);ctx.save();ctx.strokeStyle=hexA('#f4ead2',.8);ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.arc(sx,sy-6*HZ,38*HZ,this.t*2,this.t*2+TAU);ctx.stroke();ctx.restore();}
    if(ANU.guard>0&&ANU.guardUntil>gameTime){const HZ=window.HERO_K||1,[gx,gy]=P(player.x,player.y,30*HZ);ctx.save();ctx.strokeStyle=hexA(UC.gold,.8);ctx.lineWidth=3;ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(gx,gy,44*HZ,this.t*6,this.t*6+TAU);ctx.stroke();ctx.restore();}
    if(uAvatar())uGlow(x,y+40,56,UC.gold,.25+.1*Math.sin(this.t*8));
    if(ANU.gateT>gameTime)uGlow(x,y+50,40,'#3a1a5a',.5);}}
class UCore{constructor(){this.t=0;this.layer='none';this.tk=0;}draw(){}
  update(dt){this.t+=dt;if(!this.g||!fx.includes(this.g))this.g=addFx(new UGround());if(!this.o||!fx.includes(this.o))this.o=addFx(new UTop());
    this.tk+=dt;const tick=this.tk>=1;if(tick)this.tk=0;
    if(ANU.mom>0&&ANU.momT<gameTime&&!ANU.spin)ANU.mom=0;
    if(ANU.cond&&ANU.cond.dead){ANU.cond=null;ANU.sin=0;}
    const S=ANU.standard;if(S){if(S.until<gameTime)ANU.standard=null;else if(tick&&Math.hypot(player.x-S.x,player.y-S.y)<UK.anStandard.R)player.mp=Math.min(player.maxMp,player.mp+uLv(UK.anStandard.sp,'anStandard'));}
    if(hasBuff('acRebirth'))player.hp=Math.min(player.maxHp,player.hp+PS.lv*UK.acRebirth.hp*dt);
    /* spinning (Sandstorm Spin / Wheel of Ra) */
    const s=ANU.spin;if(s){if(s.until<gameTime){ANU.spin=null;if(s.wheel&&uL('aaFlare')){addFx(new UPillar({x:player.x,y:player.y,w:120,col:UC.sun,life:.6}));for(const e of uNear(player.x,player.y,UK.aaFlare.R))uHit(e,UK.aaFlare.dmg,'aaFlare',{big:true});uBurst(player.x,player.y,UK.aaFlare.R,UC.sun);shake(4);stop(80);}}
      else{if(!s.wheel&&uL('aaEye'))for(const e of uNear(player.x,player.y,s.R+60)){if(e.boss)continue;const d=Math.max(1,dist(e,player));if(d>30){const p=uLv(UK.aaEye.pull,'aaEye')*dt;e.x-=(e.x-player.x)/d*p;e.y-=(e.y-player.y)/d*p;}}
        if((s.tk+=dt)>=.25){s.tk=0;for(const e of uNear(player.x,player.y,s.R))uHit(e,s.dmg,s.key);}
        if((s.mt+=dt)>=1){s.mt=0;if(uNear(player.x,player.y,s.R).length)uMom(1);}ANU.momT=gameTime+ANU_BAL.mom.T;}}
    /* dust devils */
    ANU.devils=ANU.devils.filter(D=>{if(D.until<gameTime)return false;const q=nearestEnemy(D.x,D.y,300);if(q){const d=Math.hypot(q.x-D.x,q.y-D.y);if(d>10){D.x+=(q.x-D.x)/d*90*dt;D.y+=(q.y-D.y)/d*90*dt;}}
      if((D.tk+=dt)>=.5){D.tk=0;for(const e of uNear(D.x,D.y,UK.acDevil.R))uHit(e,UK.acDevil.dmg,'acDevil');}if((D.mt+=dt)>=1){D.mt=0;if(uNear(D.x,D.y,UK.acDevil.R).length)uMom(1);}return true;});
    /* underworld gate: re-appear behind the condemned */
    if(ANU.gateEnd&&gameTime>=ANU.gateEnd){ANU.gateEnd=0;const c=ANU.cond&&!ANU.cond.dead?ANU.cond:nearestEnemy(player.x,player.y,400);if(c){const a=uAng(player,c),[x,y]=uPathEnd(c.x,c.y,a,c.r+30);player.x=x;player.y=y;faceTo(angTo(c));}uBurst(player.x,player.y,50,'#6a3aa8');}
    if(ANU.shieldUntil<gameTime)ANU.shield=0;if(ANU.guardUntil<gameTime)ANU.guard=0;
    return true;}}   /* keep the core ticker alive (without this the game loop dropped it after one frame — fixed 2026-11-19) */

/* =====================================================================
   5. SKILL ACTIONS
   ===================================================================== */
let ANU_CORE=null;function uEnsure(){if(CHAR!=='anubis')return;if(!ANU_CORE||!fx.includes(ANU_CORE))ANU_CORE=addFx(new UCore());}
function uCast(o){uEnsure();return buffAct({key:o.key,name:o.name,phi:o.phi,speed:o.speed||2.2,glow:o.glow||UC.gold,events:tP=>[{t:tP,f:a=>o.f(a)}]});}
function uSwingAct(o){uEnsure();faceTo(o.phi);const d=atkDir(player.dir),ct=CT(d),s=seq('attack',d,Math.max(0,ct-3),null,(o.speed||1.3)*aspd());
  return act({key:o.key,name:o.name,seq:s,windup:seqTimeAt(s,seqIndex(s,'attack',ct,0)),dur:seqTimeAt(s,seqIndex(s,'attack',ct,0)+2),hitList:[],update:()=>{player.glow={color:o.glow||UC.gold,k:.5};},
    events:[{t:seqTimeAt(s,seqIndex(s,'attack',ct,0)),f:a=>o.f(a)}]});}

/* ---------- normal attack ---------- */
function mkAnBasic(tgt){uEnsure();const lv=Math.max(1,uL('anFlail')),chain=UK.anFlail.chain[lv-1]+(uL('acFrenzy')?1:0);if(gameTime-player.basicLast>1.2||player.basicIdx>=chain)player.basicIdx=0;
  const idx=player.basicIdx,last=idx===chain-1,phi=angTo(tgt),big=uL('acFrenzy')&&last;
  return uSwingAct({key:'basic',name:big?'Chain Frenzy':'Chain Flail '+(idx+1),phi,speed:last?1.15:1.7,f:a=>{player.basicIdx=idx+1;player.basicLast=gameTime;
    if(big){for(const e of uNear(player.x,player.y,UK.acFrenzy.R))uHit(e,UK.acFrenzy.dmg,'acFrenzy',{auto:true});addFx(new USwing({R:UK.acFrenzy.R,a0:phi,a1:phi+TAU,life:.3}));a.hitConfirmed=true;shake(1.6);return;}
    addFx(new USwing({R:70,a0:phi-(idx%2?-1:1)*1.1,a1:phi+(idx%2?-1:1)*1.1}));
    if(tgt.dead||dist(player,tgt)>BASIC_RANGE+30+tgt.r)return;uHit(tgt,UK.anFlail.hit,'basic',{auto:true});uPow(tgt,last);a.hitConfirmed=true;
    if(uL('anSpike')){ANU.spikeN++;if(ANU.spikeN>=UK.anSpike.every){ANU.spikeN=0;for(const e of uNear(player.x,player.y,UK.anSpike.R+20))uHit(e,uLv(UK.anSpike.dmg,'anSpike'),'anSpike');uBurst(player.x,player.y,UK.anSpike.R,UC.gold);}}}});}

/* ---------- BASIC ---------- */
function uLungeOnce(phi,hits){const sx=player.x,sy=player.y,[x,y]=uPathEnd(sx,sy,phi,uLv(UK.anLunge.dist,'anLunge'));
  for(const e of uLine(sx,sy,phi,Math.hypot(x-sx,y-sy)+20,26))if(!hits.has(e)){hits.add(e);uHit(e,UK.anLunge.dmg,'anLunge',{big:true});uPow(e,true);}
  player.x=x;player.y=y;dustPuff(sx,sy,6,'#e8d3a0',60,7);}
function mkAnLunge(c){const t=uTgt(c,220),phi=uPhi(c,t);return uCast({key:'anLunge',name:'Jackal Lunge',phi,speed:3,f:()=>{uLungeOnce(phi,new Set());if(uL('acRush'))setFxTimer(.25,()=>uLungeOnce(phi,new Set()));}});}
function mkAnWraps(c){return uCast({key:'anWraps',name:'Linen Wraps',glow:'#f4ead2',f:()=>{ANU.shield=Math.round(PS.lv*uLv(UK.anWraps.shield,'anWraps'));ANU.shieldUntil=gameTime+UK.anWraps.T;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:50,w:5,color:'#f4ead2',life:.4}));}});}
function mkAnRite(c){return uCast({key:'anRite',name:'Embalming Rite',glow:'#9aff9a',f:()=>{const h=Math.round(PS.lv*uLv(UK.anRite.hp,'anRite'));player.hp=Math.min(player.maxHp,player.hp+h);player.mp=Math.min(player.maxMp,player.mp+uLv(UK.anRite.sp,'anRite'));dmgNum(player.x,player.y,80,'+'+h,'heal');}});}
function mkAnStandard(c){return uCast({key:'anStandard',name:'Standard of Ra',glow:UC.sun,f:()=>{ANU.standard={x:player.x,y:player.y,until:gameTime+UK.anStandard.T};addFx(new GRing({x:player.x,y:player.y,r0:10,r1:UK.anStandard.R,w:8,color:UC.sun,life:.45}));}});}

/* ---------- A · Flail Dervish ---------- */
function uSweep(phi,dir,m,a){addFx(new USwing({R:UK.aaSweep.R,a0:phi-dir*Math.PI/2,a1:phi+dir*Math.PI/2,life:.24}));let n=0;for(const e of uCone(UK.aaSweep.R,phi,Math.PI/2)){uHit(e,m,'aaSweep');uPow(e,false);n++;}if(n)uOnce(a,1);}
function mkAaSweep(c){const t=uTgt(c,UK.aaSweep.range),phi=uPhi(c,t),m=uLv(UK.aaSweep.dmg,'aaSweep');
  return uSwingAct({key:'aaSweep',name:'Ankh Sweep',phi,speed:1.4,f:a=>{uSweep(phi,1,m,a);if(uL('acTwin'))setFxTimer(.25,()=>uSweep(phi,-1,m,null));a.hitConfirmed=true;}});}
function mkAaSpin(c){return uCast({key:'aaSpin',name:'Sandstorm Spin',speed:2.6,f:()=>{ANU.spin={until:gameTime+UK.aaSpin.T,tk:.2,mt:0,R:UK.aaSpin.R,dmg:uLv(UK.aaSpin.dmg,'aaSpin'),key:'aaSpin'};}});}
function mkAaLasso(c){const t=uTgt(c,UK.aaLasso.range),phi=uPhi(c,t),m=uLv(UK.aaLasso.dmg,'aaLasso');
  return uSwingAct({key:'aaLasso',name:'Chain Lasso',phi,speed:1.4,f:a=>{addFx(new UThrow({x:player.x,y:player.y,phi,len:UK.aaLasso.len,hit:e=>{uHit(e,m,'aaLasso');uPow(e,false);uOnce(a,1);},
    turn:(x,y)=>{if(!uL('aaRicochet'))return;const L=uNear(x,y,180).sort((p,q)=>Math.hypot(p.x-x,p.y-y)-Math.hypot(q.x-x,q.y-y)).slice(0,UK.aaRicochet.n);for(const e of L){uHit(e,uLv(UK.aaRicochet.dmg,'aaRicochet'),'aaRicochet');uPow(e,false);}}}));}});}
function uSlam(x,y,R,m,key,big){addFx(new UPillar({x,y,w:40,col:UC.sand,life:.3}));let n=0;for(const e of uNear(x,y,R)){uHit(e,m,key,{big});n++;}uBurst(x,y,R,UC.sand);shake(2.6);stop(50);return n;}
function mkAaMeteor(c){const [gx,gy]=uPt(c,UK.aaMeteor.range);return uCast({key:'aaMeteor',name:'Meteor Ankh',speed:2,phi:Math.atan2(gy-player.y,gx-player.x),f:a=>{
  const phi=Math.atan2(gy-player.y,gx-player.x),[x,y]=uPathEnd(player.x,player.y,phi,Math.min(UK.aaMeteor.range,Math.hypot(gx-player.x,gy-player.y)));player.x=x;player.y=y;
  if(uSlam(x,y,UK.aaMeteor.R,uLv(UK.aaMeteor.dmg,'aaMeteor'),'aaMeteor',true))uOnce(a,2);
  if(uL('aaShock'))setFxTimer(.25,()=>{for(const e of uNear(x,y,UK.aaShock.R))uHit(e,UK.aaShock.dmg,'aaShock');addFx(new GRing({x,y,r0:UK.aaMeteor.R,r1:UK.aaShock.R,w:10,color:UC.gold,life:.35}));});
  if(uL('acTwinMeteor'))setFxTimer(.5,()=>uSlam(player.x,player.y,UK.aaMeteor.R,UK.acTwinMeteor.dmg,'acTwinMeteor',true));}});}
function mkAaCyclone(c){return uCast({key:'aaCyclone',name:'Duat Cyclone',speed:1.6,f:()=>{const n=ANU.mom;ANU.mom=0;const m=uLv(UK.aaCyclone.dmg,'aaCyclone')+UK.aaCyclone.per*n;
  for(const e of uNear(player.x,player.y,UK.aaCyclone.R))uHit(e,m,'aaCyclone',{big:true,knock:[angTo(e),140]});addFx(new USwing({R:UK.aaCyclone.R*.7,a0:0,a1:TAU*2,life:.4,col:UC.sand}));uBurst(player.x,player.y,UK.aaCyclone.R,UC.sand);shake(2.6);stop(60);
  if(n)addFx(new DText({x:player.x,y:player.y,z:100,text:'MOMENTUM ×'+n,color:UC.gold,size:13,life:.8}));if(uL('aaOrbit'))setFxTimer(.1,()=>uMom(uLv(UK.aaOrbit.back,'aaOrbit')));}});}
function mkAaGuard(c){return uCast({key:'aaGuard',name:'Chain Guard',speed:2.6,f:()=>{ANU.guard=UK.aaGuard.n;ANU.guardUntil=gameTime+UK.aaGuard.T;}});}
function mkAaWheel(c){return uCast({key:'aaWheel',name:'Wheel of Ra',speed:1.4,glow:UC.sun,f:()=>{ANU.mom=ANU_BAL.mom.cap;ANU.momT=gameTime+UK.aaWheel.T+ANU_BAL.mom.T;ANU.spin={until:gameTime+UK.aaWheel.T,tk:.2,mt:0,R:UK.aaWheel.R,dmg:uLv(UK.aaWheel.dmg,'aaWheel'),key:'aaWheel',wheel:true};
  addFx(new DText({x:player.x,y:player.y,z:110,text:'WHEEL OF RA',color:UC.sun,size:15,life:1.1}));shake(2.4);}});}

/* ---------- B · Judge of the Dead ---------- */
function mkAbHook(c){const t=uTgt(c,UK.abHook.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uSwingAct({key:'abHook',name:'Soul Hook',phi:angTo(t),speed:1.4,glow:UC.blue,f:a=>{a.hitConfirmed=true;const phi=angTo(t);
    addFx(new UThrow({x:player.x,y:player.y,phi,len:Math.max(30,dist(player,t)-t.r),speed:900,w:14,hit:()=>{},turn:()=>{if(t.dead)return;
      uHit(t,uLv(UK.abHook.dmg,'abHook'),'abHook');uPow(t,false,UC.blue);uSin(t,uL('acBarbed')?UK.acBarbed.sin:1);if(uL('acBarbed'))uRoot(t,UK.acBarbed.root);
      if(t.boss){const [x,y]=uPathEnd(player.x,player.y,phi,Math.max(0,dist(player,t)-t.r-30));player.x=x;player.y=y;}
      else{const [x,y]=uPathEnd(player.x,player.y,phi,40+t.r);t.x=x;t.y=y;}}}));}});}
function mkAbCrush(c){const t=uTgt(c,UK.abCrush.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uSwingAct({key:'abCrush',name:'Heart Crush',phi:angTo(t),speed:1.1,glow:UC.blue,f:a=>{a.hitConfirmed=true;if(t.dead)return;const three=uSinOf(t)>=3;
    addFx(new UPillar({x:t.x,y:t.y,w:30,col:UC.blue,life:.3}));uHit(t,uLv(UK.abCrush.dmg,'abCrush'),'abCrush',{big:true});uPow(t,true,UC.blue);shake(2);stop(50);
    if(three&&uL('abFeather'))applyCC(t,{stun:uLv(UK.abFeather.stun,'abFeather')});uSin(t,1);}});}
function mkAbBind(c){const t=uTgt(c,UK.abBind.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uCast({key:'abBind',name:'Binding Chains',phi:angTo(t),glow:UC.blue,f:()=>{const L=[t];if(uL('abSpread'))L.push(...uNear(t.x,t.y,UK.abSpread.R).filter(e=>e!==t).sort((p,q)=>dist(p,t)-dist(q,t)).slice(0,uLv(UK.abSpread.n,'abSpread')));
    for(const e of L){uHit(e,uLv(UK.abBind.dmg,'abBind'),'abBind');uRoot(e,UK.abBind.root);addFx(new GRing({x:e.x,y:e.y,r0:e.r+20,r1:e.r,w:4,color:UC.gold,life:.4}));}uSin(t,1);}});}
function mkAbPounce(c){const t=uTgt(c,UK.abPounce.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uCast({key:'abPounce',name:'Jackal Pounce',phi:angTo(t),speed:2.4,glow:UC.blue,f:()=>{if(t.dead)return;const phi=angTo(t),three=uSinOf(t)>=3,[x,y]=uPathEnd(t.x,t.y,phi,t.r+34);player.x=x;player.y=y;faceTo(angTo(t));
    uHit(t,uLv(UK.abPounce.dmg,'abPounce')+(three&&uL('abDoor')?UK.abDoor.dmg:0),'abPounce',{big:true});uPow(t,true,UC.blue);uSin(t,1);
    if(uL('acPack'))for(let i=0;i<UK.acPack.n;i++)setFxTimer(.15+i*.15,()=>{if(t.dead)return;addFx(new UPillar({x:t.x,y:t.y,w:18,col:'#3a2a5a',life:.25}));uHit(t,UK.acPack.dmg,'acPack');uPow(t,false,'#6a4aa8');});}});}
function mkAbJudge(c){const t=ANU.cond&&!ANU.cond.dead&&dist(player,ANU.cond)<UK.abJudge.range+ANU.cond.r?ANU.cond:uTgt(c,UK.abJudge.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uSwingAct({key:'abJudge',name:'Final Judgment',phi:angTo(t),speed:1,glow:UC.blue,f:a=>{a.hitConfirmed=true;if(t.dead)return;const n=uSinOf(t);if(t===ANU.cond)ANU.sin=0;uCondemn(t);
    addFx(new UPillar({x:t.x,y:t.y,w:50+n*10,col:UC.gold,life:.45}));uHit(t,uLv(UK.abJudge.dmg,'abJudge')+UK.abJudge.per*n,'abJudge',{big:true});uPow(t,true,UC.gold);shake(3);stop(80);
    if(n)addFx(new DText({x:t.x,y:t.y,z:90,text:'SIN ×'+n,color:UC.blue,size:13,life:.8}));
    if(uL('abVerdict'))setFxTimer(.5,()=>{if(t.dead)return;addFx(new UPillar({x:t.x,y:t.y,w:40,col:UC.gold,life:.35}));uHit(t,uLv(UK.abVerdict.dmg,'abVerdict'),'abVerdict',{big:true});});}});}
function mkAbGate(c){return uCast({key:'abGate',name:'Underworld Gate',speed:2.6,glow:'#6a3aa8',f:()=>{player.iframes=Math.max(player.iframes||0,UK.abGate.T);ANU.gateT=gameTime+UK.abGate.T;ANU.gateEnd=gameTime+UK.abGate.T;uBurst(player.x,player.y,50,'#6a3aa8');}});}
function mkAbHall(c){const t=ANU.cond&&!ANU.cond.dead&&dist(player,ANU.cond)<UK.abHall.range?ANU.cond:uTgt(c,UK.abHall.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uCast({key:'abHall',name:'Hall of Two Truths',speed:1.4,glow:UC.gold,f:()=>{uCondemn(t);uRoot(t,UK.abHall.T);skyDarkT=.5;addFx(new DText({x:player.x,y:player.y,z:110,text:'HALL OF TWO TRUTHS',color:UC.gold,size:15,life:1.1}));
    for(let i=0;i<UK.abHall.n;i++)setFxTimer(.3+i*UK.abHall.gap,()=>{if(t.dead)return;const m=uLv(UK.abHall.dmg,'abHall');addFx(new UPillar({x:t.x,y:t.y,w:30,col:UC.gold,life:.3}));uHit(t,m,'abHall',i?{big:true,dot:1}:{big:true});
      for(const q of enemiesInCircle(t.x,t.y,UK.abHall.sp))if(q!==t&&!q.dead)uHit(q,m*UK.abHall.spm,'abHall',{dot:1});if(i%2===0)addFx(new GRing({x:t.x,y:t.y,r0:20,r1:UK.abHall.sp,w:6,color:UC.gold,life:.28}));uPow(t,true,UC.gold);shake(1.6);uCondemn(t);ANU.sin=ANU_BAL.sin.cap;});
    setFxTimer(.3+UK.abHall.n*UK.abHall.gap,()=>{skyDarkT=0;if(t.dead||!uL('abSeal'))return;addFx(new UPillar({x:t.x,y:t.y,w:80,col:UC.sun,life:.5}));uHit(t,UK.abSeal.dmg,'abSeal',{big:true});uCondemn(t);ANU.sin=ANU_BAL.sin.cap;shake(3.6);stop(80);});}});}

/* ---------- C ---------- */
function mkAcDevil(c){const [x,y]=uPt(c,UK.acDevil.range);return uCast({key:'acDevil',name:'Dust Devil',phi:Math.atan2(y-player.y,x-player.x),f:()=>{ANU.devils.push({x,y,tk:.3,mt:0,until:gameTime+UK.acDevil.T});uBurst(x,y,UK.acDevil.R,UC.sand);}});}
function mkAcBreaker(c){const t=uTgt(c,UK.acBreaker.range),phi=uPhi(c,t);return uSwingAct({key:'acBreaker',name:'Scale Breaker',phi,speed:1.1,glow:UC.blue,f:a=>{a.hitConfirmed=true;
  for(let i=1;i<=5;i++){const d=i*UK.acBreaker.len/5;setFxTimer(i*.05,()=>{const x=player.x+Math.cos(phi)*d,y=player.y+Math.sin(phi)*d;dustPuff(x,y,6,'#e8d3a0',50,8);});}
  for(const e of uLine(player.x,player.y,phi,UK.acBreaker.len,UK.acBreaker.w)){uHit(e,UK.acBreaker.dmg,'acBreaker',{big:true});uPow(e,true,UC.blue);if(e===ANU.cond||!ANU.cond)uSin(e,1);}shake(2.4);}});}
function mkAcRebirth(c){return uCast({key:'acRebirth',name:'Rite of Rebirth',glow:'#9aff9a',f:()=>{addBuff('acRebirth',UK.acRebirth.T);addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:6,color:'#9aff9a',life:.45}));}});}
function mkAcAvatar(c){return uCast({key:'acAvatar',name:'Avatar of Anubis',speed:1.4,glow:UC.gold,f:()=>{addBuff('acAvatar',UK.acAvatar.T);uBurst(player.x,player.y,130,UC.gold);addFx(new DText({x:player.x,y:player.y,z:116,text:'AVATAR OF ANUBIS',color:UC.gold,size:15,life:1.1}));shake(3);}});}
function mkAcWrath(c){const [x,y]=uPt(c,UK.acWrath.range);return uCast({key:'acWrath',name:"Ra's Wrath",speed:1.4,glow:UC.sun,phi:Math.atan2(y-player.y,x-player.x),f:()=>{const n=ANU.mom;ANU.mom=0;const m=UK.acWrath.dmg+UK.acWrath.per*n;skyDarkT=.4;
  setFxTimer(.35,()=>{addFx(new UPillar({x,y,w:110,col:UC.sun,life:.6}));for(const e of uNear(x,y,UK.acWrath.R))uHit(e,m,'acWrath',{big:true});uBurst(x,y,UK.acWrath.R,UC.sun);shake(4);stop(80);skyDarkT=0;});}});}
function mkAcVerdict(c){const t=ANU.cond&&!ANU.cond.dead&&dist(player,ANU.cond)<UK.acVerdict.range+ANU.cond.r?ANU.cond:uTgt(c,UK.acVerdict.range);if(!t){msg('ไม่มีเป้าหมาย');return null;}
  return uCast({key:'acVerdict',name:'Anubis Verdict',speed:1.4,phi:angTo(t),glow:UC.ink,f:()=>{const n=uSinOf(t);if(t===ANU.cond)ANU.sin=0;
    setFxTimer(.3,()=>{if(t.dead)return;addFx(new UPillar({x:t.x,y:t.y,w:90,col:'#3a2a5a',life:.5}));uHit(t,UK.acVerdict.dmg+UK.acVerdict.per*n,'acVerdict',{big:true});uPow(t,true,UC.gold);shake(4);stop(90);uCondemn(t);});}});}

const ANU_MAKE={anLunge:mkAnLunge,anWraps:mkAnWraps,anRite:mkAnRite,anStandard:mkAnStandard,
  aaSweep:mkAaSweep,aaSpin:mkAaSpin,aaLasso:mkAaLasso,aaMeteor:mkAaMeteor,aaCyclone:mkAaCyclone,aaGuard:mkAaGuard,aaWheel:mkAaWheel,
  abHook:mkAbHook,abCrush:mkAbCrush,abBind:mkAbBind,abPounce:mkAbPounce,abJudge:mkAbJudge,abGate:mkAbGate,abHall:mkAbHall,
  acDevil:mkAcDevil,acBreaker:mkAcBreaker,acRebirth:mkAcRebirth,acAvatar:mkAcAvatar,acWrath:mkAcWrath,acVerdict:mkAcVerdict};
const ANU_ZIGZAG=[['aaSweep','aaSpin'],['abHook','abCrush']];

/* =====================================================================
   6. AUTO · HOOKS · INSTALL
   ===================================================================== */
function anubisAutoTick(){if(busy()||player.casting||targeting||player.pending)return false;
  const ready=k=>LV[k]>0&&SKILLS[k]&&SKILLS[k].make&&!(player.cd[k]>0)&&player.mp>=(SKILLS[k].mp||0);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:nearestEnemy(player.x,player.y,460);
  const hp=player.hp/player.maxHp,cast=(k,c)=>{if(t)player.attackTarget=t;castSkill(k,c||(t?{target:t,phi:angTo(t),gx:t.x,gy:t.y}:{}));return true;};
  if(hp<.45){for(const k of ['acRebirth','anRite','anWraps'])if(ready(k)&&!hasBuff(k))return cast(k);}
  if(!t)return false;const d=dist(player,t),near=uNear(player.x,player.y,200);
  const lvA=['aaSweep','aaSpin','aaLasso','aaMeteor','aaWheel'].reduce((s,k)=>s+uL(k),0),lvB=['abHook','abCrush','abBind','abPounce','abHall'].reduce((s,k)=>s+uL(k),0),useB=window.__ANU_BR==='B'||(window.__ANU_BR!=='A'&&lvB>lvA);
  if(ready('acAvatar')&&!uAvatar()&&d<200)return cast('acAvatar');if(ready('anStandard')&&!ANU.standard&&d<200)return cast('anStandard');
  if(useB){if(ready('abHall')&&(t.boss||t===ANU.cond))return cast('abHall');
    if(ready('acVerdict')&&uSinOf(t)>=3)return cast('acVerdict');if(ready('abJudge')&&uSinOf(t)>=3&&d<UK.abJudge.range+t.r)return cast('abJudge');
    if(d>110&&ready('abHook'))return cast('abHook');if(d>110&&ready('abPounce'))return cast('abPounce');if(d>110&&ready('anLunge'))return cast('anLunge');
    for(const k of ['abBind','abCrush','acBreaker','abPounce','abHook'])if(ready(k)&&d<=(SKILLS[k].range||200)+t.r)return cast(k);
    if(hp<.6&&ready('abGate'))return cast('abGate');return false;}
  if((t.boss||near.length>=3)&&ready('aaWheel')&&!ANU.spin)return cast('aaWheel');
  if(ANU.mom>=4){if(ready('acWrath'))return cast('acWrath');if(ready('aaCyclone')&&d<UK.aaCyclone.R)return cast('aaCyclone');}
  if(d>150&&ready('aaMeteor'))return cast('aaMeteor');if(d>150&&ready('anLunge'))return cast('anLunge');
  if(near.length>=2&&ready('aaGuard')&&hp<.7)return cast('aaGuard');
  for(const k of ['acDevil','aaSpin','aaMeteor','aaLasso','aaSweep'])if(ready(k)&&!(k==='aaSpin'&&ANU.spin)&&d<=(SKILLS[k].range||200)+t.r)return cast(k);
  return false;}

function installAnubis(){
  for(const k in SKILLS)delete SKILLS[k];for(const k in LV)delete LV[k];for(const k in CSK)delete CSK[k];
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  for(const d of ANU_DEFS){const b=UK[d.key]||{};const sk={id:d.id,name:d.name,br:d.br,row:d.row||d.tier,max:d.br==='C'?1:d.max,type:d.type,icon:uIconSpec(d),th:d.d.replace(/^\([^)]*\)\s*/,'').replace(/^\[[^\]]*\]\s*/,'').slice(0,40),characterId:'anubis_jackal'};
    if(b.mp!=null)sk.mp=b.mp;if(b.cd)sk.cd=b.cd;if(b.range)sk.range=b.range;if(d.passive)sk.passive=1;if(d.ult)sk.ult=1;if(d.enh)sk.enh=d.enh;if(d.pre&&d.br!=='C')sk.pre=d.pre;if(d.radius)sk.radius=d.radius;if(d.col)sk.col=d.col;
    if(ANU_MAKE[d.key])sk.make=ANU_MAKE[d.key];
    if(d.br==='C'){sk.tier=d.tier;const pre=d.pre||[];sk.creq=()=>pre.every(([q,l])=>(LV[q]||0)>=l);sk.rq=pre.map(([q,l])=>`${ANU_DEFS.find(x=>x.key===q).name} Lv.${l}`).join(' + ');CSK[d.key]=sk;}
    SKILLS[d.key]=sk;
    JG_DESC[d.key]={d:(d.br==='C'?(d.passive?'[Enhancement] ':''):'')+d.d,lv:(()=>{const o={};for(let i=1;i<=(d.br==='C'?1:d.max);i++)o[i]=d.lv(i).filter(Boolean);return o;})()};}
  for(const k in SKILLS)LV[k]=SKILLS[k].max;
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of ANU_ZIGZAG){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  /* pure physical: every skill is ATK */
  const m={};for(const d of ANU_DEFS)m[d.key]='p';Object.assign(SK_DT,m,{basic:'p'});
  Object.assign(SK_CC,{basic:{flinch:.15},aaSweep:{flinch:.25},aaLasso:{flinch:.25},aaMeteor:{air:1},aaCyclone:{flinch:.5},aaFlare:{air:1},acWrath:{air:1},acTwinMeteor:{flinch:.4},
    abHook:{flinch:.3},abCrush:{flinch:.5},abPounce:{flinch:.4},abJudge:{flinch:.6},abVerdict:{flinch:.3},abSeal:{air:1},acVerdict:{flinch:.6},acBreaker:{flinch:.4},anLunge:{flinch:.3},acFrenzy:{flinch:.3}});
  Object.assign(SK_KO,{basic:1,aaSweep:1.2,aaSpin:.4,aaLasso:1.2,aaMeteor:2.4,aaCyclone:2.6,aaWheel:.5,aaFlare:3.6,acWrath:4,acDevil:.4,acTwinMeteor:2,
    abHook:1,abCrush:2.4,abBind:.8,abPounce:1.8,abJudge:3,abVerdict:1.4,abHall:1.6,abSeal:3.6,acVerdict:4.4,acBreaker:2.4,anLunge:1.4,acFrenzy:1.6,anSpike:.8});
  TABS.length=0;TABS.push({n:'Dervish',keys:['aaSweep','aaSpin','aaLasso','aaMeteor','aaCyclone','aaGuard','aaWheel','anLunge','anWraps','anStandard']},
    {n:'Judge',keys:['abHook','abCrush','abBind','abPounce','abJudge','abGate','abHall','anLunge','anWraps','anStandard']},
    {n:'Duat',keys:['acDevil','acBreaker','acRebirth','acAvatar','acWrath','acVerdict','anRite']});
  Object.assign(BUFFDEF,{acRebirth:{n:'Rite of Rebirth',c:'#9aff9a',i:'RITE'},acAvatar:{n:'Avatar of Anubis',c:UC.gold,i:'ANUB'}});
  JOB.name='Duat Initiate';JOB.hpA=1.3;JOB.hpB=5.2;JOB.spB=3.2;
  ITEMS.ankhFlail={n:'Ankh Flail',slot:'rhand',two:1,kind:'Mace',atk:180,matk:0,wlv:3,aspd:152,ref:6,cards:2,w:160,b:{str:2},size:{small:1,medium:1,large:1},d:'ลูกตุ้มโซ่ลายอังค์ STR +2'};
  ITEMS.duatFlail={n:'Flail of the Duat',slot:'rhand',two:1,kind:'Mace',atk:200,matk:0,wlv:4,aspd:150,ref:4,cards:1,w:180,b:{vit:3},size:{small:1,medium:1,large:1},d:'ลูกตุ้มแห่งดูอัต VIT +3'};
  EQ.rhand='ankhFlail';INV.length=0;INV.push('duatFlail','vikinghelm','ringPrec','clipLuck');
  /* flat ATK bonuses */
  const flat=(e,o)=>{const k=o&&(o.skill||(o.auto?'basic':null)),col=uCol(k);let b=0;
    if(ANU.standard&&Math.hypot(player.x-ANU.standard.x,player.y-ANU.standard.y)<UK.anStandard.R)b+=uLv(UK.anStandard.atk,'anStandard');
    if(hasBuff('acRebirth'))b+=UK.acRebirth.atk;
    if(col==='A'&&uL('aaRolling'))b+=ANU.mom*uLv(UK.aaRolling.atk,'aaRolling');
    if(col==='B'&&uL('abGaze'))b+=uSinOf(e)*uLv(UK.abGaze.atk,'abGaze');
    if(uAvatar()&&o&&o.auto)b+=UK.acAvatar.atk;
    return b;};
  window.jgHit=()=>0;window.jgCrit=()=>0;window.jgCritDmg=()=>0;window.jgDmgTaken=()=>1;
  window.jgDmgMul=(e,o)=>{const base=Math.max(1,D.patk);return (base+Math.min(flat(e,o),base))/base;};   // 2026-11-22: a flat bonus adds at most the hit's own power (off-stat builds got ×10+ from it)
  window.jgPreHit=()=>{if(ANU.guard>0&&ANU.guardUntil>gameTime){ANU.guard--;addFx(new GRing({x:player.x,y:player.y,r0:30,r1:50,w:4,color:UC.gold,life:.25}));return 0;}return 1;};
  window.jgAbsorb=(d,e)=>{if(uL('anHide'))d-=uLv(UK.anHide.block,'anHide');
    if(uL('aaIron'))d-=ANU.mom*uLv(UK.aaIron.block,'aaIron');
    if(uL('abKeeper')&&e&&e===ANU.cond)d-=uLv(UK.abKeeper.block,'abKeeper');
    d=Math.max(1,d);
    if(ANU.shield>0&&ANU.shieldUntil>gameTime){const a=Math.min(ANU.shield,d);ANU.shield-=a;d-=a;if(d<=0)return 0;}
    return d;};
  window.jgPostHit=()=>{};
  window.jgMove=()=>1;window.jgDetect=()=>1;window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgPlayerAlpha=()=>ANU.gateT>gameTime?.3:1;window.jgBleedMul=()=>1;window.jgOnSkillHit=()=>{};window.jgAfterHurt=()=>{};
  window.anubisAutoTick=anubisAutoTick;
  mkBasic=mkAnBasic;uEnsure();
  try{document.title='Aetherfall — Anubis Jackal';const nm=document.querySelector('.nm b'),cl=document.querySelector('.nm .cls');if(nm)nm.textContent='Anubis Jackal';if(cl)cl.textContent='Duat Initiate';}catch(e){}
  window.ANU=ANU;window.ANU_DEFS=ANU_DEFS;window.ANU_BAL=ANU_BAL;}

/* =====================================================================
   7. ICONS (painted if present in assets/icons/anubis, code SVG fallback)
   ===================================================================== */
function uIconSpec(d){const isA=d.br==='A'||d.col==='A',isB=d.br==='B'||d.col==='B';const col=isA?'#ffd08a':isB?'#a8c8ff':'#ffe9a8',bg=isA?'#3a2410':isB?'#121a3a':'#2a2214';
  const ult=d.ult?'<rect x="1.5" y="1.5" width="41" height="41" rx="6" fill="none" stroke="#ffd36a" stroke-width="2"/>':'';
  const flail=`<path d="M8 8 L22 22" stroke="#ffd36a" stroke-width="2.5" stroke-dasharray="3 2"/><circle cx="27" cy="27" r="9" fill="#2a2030" stroke="${col}" stroke-width="2"/><path d="M27 21 V33 M23 25 H31" stroke="#ffd36a" stroke-width="2"/>`;
  const scale=`<path d="M22 8 V36 M10 14 H34 M14 36 H30" stroke="${col}" stroke-width="2.5" fill="none"/><path d="M6 24 L10 14 L14 24 Z M30 24 L34 14 L38 24 Z" fill="${col}"/>`;
  const ankh=`<circle cx="22" cy="13" r="6" fill="none" stroke="#ffd36a" stroke-width="3.5"/><path d="M22 19 V38 M12 22 H32" stroke="#ffd36a" stroke-width="3.5"/>`;
  const g=isA?flail:isB?scale:ankh;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="7" fill="${bg}"/>${g}${ult}</svg>`;
  if(typeof SKILL_ICON_ART!=='undefined'){const fb='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),src='assets/icons/anubis/'+d.key+'.webp';SKILL_ICON_ART[d.name]=fb;const im=new Image();im.onload=()=>{SKILL_ICON_ART[d.name]=src;};im.src=src;}
  return ['star',col,bg];}
