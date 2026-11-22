/* =====================================================================
   AETHERFALL — FROST IRON RHINO · flat-value rework (12 Tails rules)
   index.html calls installRhinoRework() right after the original rhino block.
   Keeps every animation / maker; replaces the percent effects with flat numbers,
   chance effects with counters, trims Class C to 12 nodes (Lv 55/60/70/80) and adds zigzag levels.
   ===================================================================== */
const RX={
  hp:{rhThickHide:300,rhFortified:[200,400]},
  red:{rhThickHide:4,rhRoar:[3,6,9],rhSkin:[5,10,15,20],rhStance:[15,20,25],rhWall:[25,35,45],rhFortress:[20,27,35],
       rhAnchor:8,rhColossus:20,rhTotem:12,rhZone:15,guard:[35,50],weak:10},
  atk:{rhRoar:[20,40,60],rhFury:[30,60],rhBrutal:[24,48],rebound:100,pactPerDef:1.5,pactCap:80},
  stg:{rhFury:[5,10]},
  unbreak:[5,4],                                    // every Nth hit taken is blocked
  shield:{stance:4,pulse:5,absolute:4.5,bastion:[8,11],cap:16},  // × character level
  absorbCap:{absolute:28,fortress:18},             // × character level
  move:{rhStance:50,rhFortress:25},
  floor:.25                                         // engine floor: a hit never drops below a quarter of its raw damage
};
const RHX={flat:0,hitN:0,brutal:0};
const rxL=(a,k)=>Array.isArray(a)?a[Math.max(1,Math.min(a.length,LV[k]||0))-1]:a;
const rxX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

function installRhinoRework(){if(CHAR!=='rhino')return;
  /* ---------- Class C → 12 nodes (Basic / A / B per tier) ---------- */
  const CL=[
    ['rcEndless',1,()=>LV.rhFist>=3,'Iron Fist Combo Lv.3'],['rcReflection',1,()=>LV.rhCrushCounter>=1,'Crushing Counter Lv.1'],['rcFracture',1,()=>LV.rhKnuckle>=3,'Heavy Knuckle Lv.3'],
    ['rcGlacier',2,()=>LV.rhCharge>=2,'Rhino Charge Lv.2'],['rcFrozenBastion',2,()=>LV.rhStance>=3,'Guardian Stance Lv.3'],['rcTitanEcho',2,()=>LV.rhTitan>=3,'Titan Combo Lv.3'],
    ['rcGrip',3,()=>LV.rhCrusher>=2,'Armor Crusher Lv.2'],['rcPact',3,()=>LV.rhSkin>=3,'Iron Skin Lv.3'],['rcAvalancheChain',3,()=>LV.rhShaker>=3,'Earthshaker Lv.3'],
    ['rcTotem',4,()=>LV.rhRoar>=3,'Battle Roar Lv.3'],['rcEternal',4,()=>LV.rhAbsolute>=1,'Absolute Fortress Lv.1'],['rcCataclysm',4,()=>LV.rhWorldbreaker>=1,'Worldbreaker Impact Lv.1']];
  const keep={};for(const [k,t,cr,rq] of CL){const s=CSK[k];if(!s)continue;Object.assign(s,{tier:t,creq:cr,rq});keep[k]=s;}
  for(const k in CSK){delete SKILLS[k];delete LV[k];delete CSK[k];}
  for(const k in keep){CSK[k]=keep[k];SKILLS[k]=Object.assign({br:'C',max:1},keep[k]);LV[k]=1;}
  setTimeout(()=>{try{CTIER_LV[1]=LVC.g(55);CTIER_LV[2]=LVC.g(60);CTIER_LV[3]=LVC.g(70);CTIER_LV[4]=LVC.g(80);}catch(_){}},0);
  /* ---------- zigzag ---------- */
  SKILLS.rhStance.pre=[['rhSkin',1]];SKILLS.rhHammer.pre=[['rhKnuckle',1]];
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of [['rhSkin','rhStance'],['rhKnuckle','rhHammer']]){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  TABS[TABS.length-1]={n:'Colossus',keys:['rcGrip','rcGlacier','rcTotem']};
  if(window.CAST){delete CAST.rcSpirit;}

  /* ---------- damage dealt: flat ATK ---------- */
  const _rh=rh;rh=(e,m,o={})=>{RHX.brutal=LV.rhBrutal||0;LV.rhBrutal=0;try{return _rh(e,m,Object.assign({},o,{rhHeavy:!!o.heavy}));}finally{LV.rhBrutal=RHX.brutal;}};
  window.jgAtk=()=>0;
  window.jgDmgMul=(e,o)=>{let f=0;o=o||{};
    if(hasBuff('rhRoar'))f+=rxL(RX.atk.rhRoar,'rhRoar');if(hasBuff('rhFury'))f+=rxL(RX.atk.rhFury,'rhFury');
    if(hasBuff('rhPact'))f+=Math.min(RX.atk.pactCap,Math.round(ARMOR.def*RX.atk.pactPerDef));
    if(o.rhHeavy&&RHX.brutal)f+=Math.min(RH.mom,5)*RX.atk.rhBrutal[RHX.brutal-1];
    if(!o.dot&&o.counter&&hasBuff('rhRebound')){f+=RX.atk.rebound;delete player.buffs.rhRebound;}
    const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+Math.min(f,base))/base;};   // 2026-11-22: flat bonus ≤ the hit's own power
  /* stagger: flat bonus instead of percent */
  rhStg=function(e,amt){if(!e||e.dead||!amt||e.stgImm>0)return;if(hasBuff('rhFury'))amt+=rxL(RX.stg.rhFury,'rhFury');
    e.stg=(e.stg||0)+amt;e.stgLast=0;const max=e.boss?RH_BAL.stgMaxBoss:RH_BAL.stgMax;
    if(e.stg>=max){e.stg=0;e.stgImm=e.boss?RH_BAL.stgImmuneBoss:RH_BAL.stgImmune;e.st.stagger=Math.max(e.st.stagger,e.boss?RH_BAL.stgBreakBoss:RH_BAL.stgBreak);
      addFx(new DText({x:e.x,y:e.y,z:(e.boss?110:70),text:'BREAK!',color:RHC.gold,size:e.boss?20:16,life:1}));addFx(new Impact({pos:[e.x,e.y,26],size:e.boss?80:56,color:RHC.gold,core:'#ffffff',rays:12,life:.3}));
      addFx(new GRing({x:e.x,y:e.y,r0:8,r1:e.boss?90:60,w:8,color:'#fff4d8',life:.4}));rocks(e.x,e.y,6,160);shake(2.2);stop(70);}};

  /* ---------- survivability: flat HP / flat damage blocks / shields in character level ---------- */
  window.jgHpMul=()=>{const base=Math.max(1,(SYS.hpBase+PS.lv*(SYS.hpLvP||SYS.hpLv))*(1+((typeof D!=='undefined'&&D.stat&&D.stat.vit)||PS.vit||0)/100));   /* RO HP (2026-11-22): flat HP bonus ÷ the hero's base HP */return 1+((LV.rhThickHide?RX.hp.rhThickHide:0)+(LV.rhFortified?rxL(RX.hp.rhFortified,'rhFortified'):0))/base;};
  window.jgMove=()=>.88*(1-((hasBuff('rhStance')?RX.move.rhStance:0)+(hasBuff('rhFortress')?RX.move.rhFortress:0))/165);
  window.jgDmgTaken=()=>1;
  const _sh=rhShield;rhShield=(amt,dur)=>{const r=Math.round(amt/Math.max(1,player.maxHp)*100)/100,L=PS.lv;
    if(!RHX.raw){if(r===.08)amt=L*RX.shield.stance;else if(r===.12)amt=L*RX.shield.pulse;else if(r===.1)amt=L*RX.shield.absolute;}
    RH.shield=Math.min(L*RX.shield.cap,Math.max(RH.shield,0)+amt);RH.shieldT=Math.max(RH.shieldT,dur);if(rhOverlay)rhOverlay.domeT=0;};
  const shieldFlat=(amt,dur)=>{RHX.raw=1;rhShield(amt,dur);RHX.raw=0;};
  window.jgPreHit=(e)=>{const a=player.action;RHX.flat=0;if(e.rhWeak>0)RHX.flat+=RX.red.weak;
    if(a&&a.guard&&!a.ended){const perfect=a.t<a.perfect;a.blocked=true;a.bt=gameTime;a.attacker=e;a.hitList=[e];
      const w=player.socket?player.socket.w:[player.x,player.y,32];sparks(w[0],w[1],w[2],angTo(e),perfect?18:9,perfect?RHC.gold:'#e8f0ff',300,1.1);addFx(new Impact({pos:[w[0],w[1],w[2]],size:perfect?40:26,color:perfect?RHC.gold:'#cfe0ff',core:'#fff',rays:8,life:.18}));
      if(a.key==='rhAbsolute'){RH.absorbed=Math.min(PS.lv*RX.absorbCap.absolute,RH.absorbed+e.m.atk[1]);addFx(new GRing({x:player.x,y:player.y,r0:30,r1:50,w:6,color:'#8fa4c4',life:.25}));return 0;}
      if(LV.rcRebound)addBuff('rhRebound',4);
      if(perfect){addFx(new DText({x:player.x,y:player.y,z:84,text:'PERFECT GUARD',color:RHC.gold,size:14,life:.9}));addMom(1);stop(80);shake(2);a.perfectHit=true;a.dur=Math.min(a.dur,a.t+.12);rhStg(e,20);return 0;}
      addFx(new DText({x:player.x,y:player.y,z:80,text:'GUARD',color:'#e8f0ff',size:13,life:.7}));stop(40);RHX.flat+=RX.red.guard[Math.max(1,Math.min(2,a.glv||1))-1];return 1;}
    if(hasBuff('rhStance'))player.combo={parent:'rhStance',key:'rhCrushCounter',t:FOLLOW_WIN,total:FOLLOW_WIN,action:{skill:'rhStance',blocked:true,attacker:e,hitList:[e]}};
    if(hasBuff('rhWall')){const d=Math.abs(((angTo(e)-player.phi+Math.PI*3)%(TAU))-Math.PI);if(d<1.1){RHX.flat+=rxL(RX.red.rhWall,'rhWall');if(rhWallObj)rhWallObj.flash=1;}}
    if(hasBuff('rhFortress'))e.aggro=Math.max(e.aggro||0,5);return 1;};
  window.jgAbsorb=(d)=>{const raw=d;
    if(LV.rhUnbreakable){RHX.hitN++;if(RHX.hitN>=rxL(RX.unbreak,'rhUnbreakable')){RHX.hitN=0;addFx(new DText({x:player.x,y:player.y,z:80,text:'UNBREAKABLE',color:'#dfe8f4',size:12,life:.7}));addFx(new GRing({x:player.x,y:player.y,r0:6,r1:30,w:5,color:'#dfe8f4',life:.25}));return 0;}}
    let r=RHX.flat;RHX.flat=0;if(LV.rhThickHide)r+=RX.red.rhThickHide;
    for(const k of ['rhRoar','rhSkin','rhStance','rhFortress'])if(hasBuff(k))r+=rxL(RX.red[k],k);
    if(hasBuff('rhColossus'))r+=RX.red.rhColossus;if(hasBuff('rhAnchor'))r+=RX.red.rhAnchor;if(hasBuff('rhTotem'))r+=RX.red.rhTotem;if(hasBuff('rhZone'))r+=RX.red.rhZone;
    d=Math.max(Math.ceil(raw*RX.floor),d-r);
    if(RH.shield>0){const ab=Math.min(RH.shield,d);RH.shield-=ab;d-=ab;if(rhOverlay)rhOverlay.domeT=.05;if(ab)dmgNum(player.x,player.y,90,'-'+ab,'miss',{scale:.7});}return d;};
  window.jgPostHit=(e,d)=>{const hp=player.hp,mx=player.maxHp;
    if(LV.rhRevenge)RH.rev=Math.min(ATK*RH_BAL.revengeCap,RH.rev+d*.6);
    if(hasBuff('rhFortress'))RH.absorbed=Math.min(PS.lv*RX.absorbCap.fortress,RH.absorbed+d);
    if(LV.rhBastion&&hp>0&&hp<mx*.3&&RH.icd.bastion<=0){RH.icd.bastion=60;shieldFlat(PS.lv*rxL(RX.shield.bastion,'rhBastion'),6);addFx(new DText({x:player.x,y:player.y,z:96,text:'LAST BASTION',color:'#c4ccd8',size:15,life:1.2}));addFx(new GRing({x:player.x,y:player.y,r0:10,r1:70,w:10,color:'#8fa4c4',life:.5}));}};

  /* ---------- descriptions ---------- */
  const L=(max,f)=>{const o={};for(let i=1;i<=max;i++)o[i]=f(i);return o;},Dd=(k,d,lv)=>{JG_DESC[k]={d,lv};};
  Dd('rhRoar','คำรามคลื่นหัวแรด ATK เพิ่มและลดดาเมจที่ได้รับ',L(3,i=>[`ATK +${RX.atk.rhRoar[i-1]} · ดาเมจที่ได้รับ −${RX.red.rhRoar[i-1]} ต่อครั้ง`,`นาน ${20+10*i} วิ`]));
  Dd('rhThickHide','(Passive) หนังหนา',L(1,()=>[`Max HP +${RX.hp.rhThickHide} · ดาเมจที่ได้รับ −${RX.red.rhThickHide} ต่อครั้ง`]));
  Dd('rhSkin','เหล็กไหลผ่านเกราะ · อัปสลับเลเวลกับ Guardian Stance',L(4,i=>[`ดาเมจที่ได้รับ −${RX.red.rhSkin[i-1]} ต่อครั้ง นาน 20 วิ`]));
  Dd('rhFortified','(Passive) ร่างแข็งแกร่ง',L(2,i=>[`Max HP +${RX.hp.rhFortified[i-1]}`]));
  Dd('rhStance','ตั้งท่าป้องกัน · โดนตีระหว่างนี้เปิด Crushing Counter · อัปสลับเลเวลกับ Iron Skin',L(3,i=>[`ดาเมจที่ได้รับ −${RX.red.rhStance[i-1]} ต่อครั้ง · เดิน −${RX.move.rhStance}`,`นาน ${6+i} วิ`]));
  Dd('rhGuard','ยกหมัดป้องกัน ลดดาเมจ · ช่วงแรกเป็น Perfect Guard (ไม่เสียเลือด + Momentum +1) · ป้องกันสำเร็จเปิด Counter Punch',L(2,i=>[`นาน ${(0.8+.2*i).toFixed(1)} วิ · ดาเมจที่ได้รับ −${RX.red.guard[i-1]} ต่อครั้ง`,'Perfect Guard: ไม่เสียเลือด']));
  Dd('rhWall','กำแพงเหล็กพลังงานด้านหน้า ลดดาเมจจากทิศหน้า',L(3,i=>[`ดาเมจจากด้านหน้า −${RX.red.rhWall[i-1]} ต่อครั้ง · นาน ${6+i} วิ`]));
  Dd('rhPulse','(คอมโบ) ปล่อยพลังกำแพงเป็นเกราะ',L(1,()=>[`เกราะ = เลเวล×${RX.shield.pulse} นาน 8 วิ · ผลักศัตรู ATK×0.6`]));
  Dd('rhUnbreakable','(Passive) ร่างที่ไม่มีวันแตก โดนตีครบจำนวนครั้ง ครั้งนั้นไม่เสียเลือด',L(2,i=>[`ทุกครั้งที่ ${RX.unbreak[i-1]} ที่โดนตี: ไม่เสียเลือด`]));
  Dd('rhRevenge','เก็บพลังจากดาเมจที่รับ (ดาเมจ×0.6) แล้วต่อยสวน',L(2,i=>[`${rxX(1.6+.3*i)} + พลังที่เก็บไว้ (สูงสุด ${rxX(RH_BAL.revengeCap)})`]));
  Dd('rhFortress','ป้อมปราการ ลดดาเมจมาก + ยั่วศัตรูรอบตัว · เปิด Iron Retribution',L(3,i=>[`ดาเมจที่ได้รับ −${RX.red.rhFortress[i-1]} ต่อครั้ง นาน ${4+i} วิ · เดิน −${RX.move.rhFortress}`,'ศัตรูในระยะ 320 หันมาตี']));
  Dd('rhRetribution','(คอมโบ) ต่อยพื้น ปล่อยพลังที่เก็บไว้ตอน Fortress',L(1,()=>[`ATK×1.8 + พลังที่เก็บ (สูงสุด ATK×1.5) รัศมี 120`,`เก็บได้สูงสุด เลเวล×${RX.absorbCap.fortress}`]));
  Dd('rhAnchor','ปักเท้ายึดพื้น',L(3,i=>[`Super Armor + ดาเมจที่ได้รับ −${RX.red.rhAnchor} ต่อครั้ง นาน ${6+2*i} วิ`]));
  Dd('rhQuake','(คอมโบ) Shockwave สองชั้น ศัตรูตีเบาลง',L(1,()=>[`ATK×2.2 รัศมี 140 · ศัตรูที่โดนตีเรา −${RX.red.weak} ต่อครั้ง 6 วิ`]));
  Dd('rhBastion','(Passive) HP ต่ำกว่า 30% ได้เกราะฉุกเฉิน (ทุก 60 วิ)',L(2,i=>[`เกราะ = เลเวล×${RX.shield.bastion[i-1]} นาน 6 วิ`]));
  Dd('rhColossus','Super Armor + ลดดาเมจ (ยังรับดาเมจอยู่)',L(1,()=>[`8 วิ · ดาเมจที่ได้รับ −${RX.red.rhColossus} ต่อครั้ง`]));
  Dd('rhBrutal','(Passive) หมัดหนักแรงขึ้นตาม Momentum (สูงสุด 5 ชั้น)',L(2,i=>[`ATK +${RX.atk.rhBrutal[i-1]} ต่อชั้น (สูงสุด +${RX.atk.rhBrutal[i-1]*5})`]));
  Dd('rhKnuckle','หมัดหนัก · อัปสลับเลเวลกับ Double Hammer Fist',L(4,i=>[`${rxX(1.6+.3*i)} · Stagger ${25+5*i} · Momentum +1`]));
  Dd('rhHammer','หมัดคู่ · เปิด Rising Uppercut · อัปสลับเลเวลกับ Heavy Knuckle',L(3,i=>[`${rxX(2+.4*i)} · Stagger 35 · ชะงัก 0.3 วิ`]));
  Dd('rhTitan','ซ้าย-ขวา-ทุบ · เปิด Meteor Knuckle',L(3,i=>{const t=[2.6,3.2,3.8][i-1];return [`${rxX(t/4)} + ${rxX(t/4)} + ${rxX(t/2)} · ทุบ Stagger 40`];}));
  Dd('rhMeteor','(คอมโบ) หมัดชาร์จพุ่ง ใช้ Momentum ทั้งหมด',L(1,()=>['ATK×3 + ATK×0.15 ต่อ Momentum · Stagger 50 +10/ชั้น']));
  Dd('rhFury','ไอพลังแดงทอง',L(2,i=>[`ATK +${RX.atk.rhFury[i-1]} · Stagger +${RX.stg.rhFury[i-1]} ต่อครั้ง นาน 20 วิ`]));
  Dd('rhWorldbreaker','ULTIMATE B — ชาร์จหมัดยักษ์ กระโดดทุบ คลื่น 3 ชั้น (แต่ละชั้นโดนเป้าได้ครั้งเดียว)',L(1,()=>['ATK×3 / ×2 / ×1.5 (รัศมี 90 / 140 / 190)','Stagger 60+25+25']));
  Dd('rhAbsolute','ULTIMATE A — ป้องกัน 1.2 วิ ดูดซับแรงโจมตี แล้วต่อยพื้นพร้อมกัน',L(1,()=>[`ATK×3.5 + พลังดูดซับ (สูงสุด ATK×3) รัศมี 160 · Stagger 80`,`เกราะ = เลเวล×${RX.shield.absolute} นาน 8 วิ`]));
  const C={rcFrozenBastion:['Guardian Stance ให้เกราะน้ำแข็ง',`เกราะ = เลเวล×${RX.shield.stance} นาน 6 วิ`],rcEternal:['จบ Absolute Fortress เหลือวงป้องกัน 5 วิ',`ในวง: ดาเมจที่ได้รับ −${RX.red.rhZone} ต่อครั้ง`],
    rcPact:['ผสาน ATK กับ DEF 12 วิ (คิดจาก DEF อุปกรณ์)',`ATK + DEF×${RX.atk.pactPerDef} (สูงสุด +${RX.atk.pactCap})`],rcTotem:['[New Active] ทุบพื้นให้เสาน้ำแข็งเป็นกำแพง ผลักและชะลอศัตรู · ยืนหลังกำแพงลดดาเมจ',`ดาเมจที่ได้รับ −${RX.red.rhTotem} ต่อครั้ง`]};
  for(const k in C)if(JG_DESC[k])JG_DESC[k]={d:(SKILLS[k].make&&k!=='rcTotem'?'[New Active] ':k==='rcTotem'?'':'[Enhancement] ')+C[k][0],lv:{1:[C[k][1],'เงื่อนไข: '+SKILLS[k].rq]}};
  for(const k of Object.keys(CSK))if(!C[k]&&JG_DESC[k]){const v=JG_DESC[k].lv[1];v[v.length-1]='เงื่อนไข: '+SKILLS[k].rq;}
  /* remaining power values: ATK 170% → ATK×1.7 */
  const fx=t=>typeof t==='string'?t.replace(/ATK (\d+(?:\.\d+)?)%/g,(_,n)=>rxX(n/100)).replace(/(\d+(?:\.\d+)?)%(?= (?:รัศมี|·|\+|$)|$)/g,(_,n)=>'ATK×'+(+(n/100).toFixed(2))):t;
  for(const k in SKILLS){const g=JG_DESC[k];if(!g)continue;g.d=fx(g.d);for(const i in g.lv)g.lv[i]=g.lv[i].map(fx);}
}
