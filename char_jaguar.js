/* =====================================================================
   AETHERFALL — ECLIPSE JAGUAR · rework (12 Tails rules)
   index.html calls installJaguarRework() after every other jaguar block.
     A · Blood Fang      — Prey Mark on the target, bleeding, finishers cash Prey in (Final Talon · Predator Drop · Throne)
                           Savage Tempo: every 3rd hit adds an extra claw + Prey Mark (attack speed itself never changes)
     B · Eclipse Shadow  — Eclipse Brand, poison, stealth and backstabs; Shadow Burst / Black Horizon / Fifth Sun cash Brand in
   Rules: attack speed is fixed per character (CHAR_ASPD) · no percent effects · counters instead of chances.
   ===================================================================== */
const JX={
  atk:{jgCry:[20,40,60],jgTotem:60,veil:[80,140],slip:[50,70,90],exec:[40,80],execFin:[30,60],backAuto:40,backSkill:80,riposte:80,rhythm:60},
  tempo:{every:3,dmg:[.5,.6,.7,.8]},
  crimson:{every:[5,4],bleed:[20,40]},
  sun:{every:3,sp:[12,18]},
  mirror:[60,90],
  evadeEvery:6,
  totemCrit:10
};
const JGX={hitN:0,tempoN:0,crimN:0,sunN:0,block:0};
const jxL=(a,k)=>Array.isArray(a)?a[Math.max(1,Math.min(a.length,LV[k]||0))-1]:a;
const jxX=n=>'ATK×'+(+n).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');

function installJaguarRework(){if(CHAR!=='jaguar')return;
  /* ---------- Class C → 12 nodes ---------- */
  const CL=[
    ['jcEndlessHunt',1,()=>LV.jgTwinFang>=3,'Twin Fang Combo Lv.3'],['jcEcho',1,()=>LV.jgRending>=3,'Rending Fang Lv.3'],['jcSeal',1,()=>LV.jgTwilight>=3,'Twilight Fang Lv.3'],
    ['jcMirage',2,()=>LV.jgStep>=2,'Jaguar Step Lv.2'],['jcSkyPounce',2,()=>LV.jgDrop>=1,'Predator Drop Lv.1'],['jcCorridor',2,()=>LV.jgSlip>=3,'Shadow Slip Lv.3'],
    ['jcRhythm',3,()=>LV.jgNightSight>=2,'Night Sight Lv.2'],['jcThousand',3,()=>LV.jgTalon>=3&&LV.jgFinalTalon>=1,'Twin Talon Dance 3 + Final Talon 1'],['jcChain',3,()=>LV.jgVenom>=2&&LV.jgEBackstab>=1,'Venom Sigil 2 + Eclipse Backstab 1'],
    ['jcTotem',4,()=>LV.jgCry>=3,"Predator's Cry Lv.3"],['jcGodfall',4,()=>LV.jgThrone>=1,'Throne of Claws Lv.1'],['jcEternal',4,()=>LV.jgFifthSun>=1,'Eclipse of the Fifth Sun Lv.1']];
  const keep={};for(const [k,t,cr,rq] of CL){const s=CSK[k];if(!s)continue;Object.assign(s,{tier:t,creq:cr,rq});keep[k]=s;}
  for(const k in CSK){delete SKILLS[k];delete LV[k];delete CSK[k];}
  for(const k in keep){CSK[k]=keep[k];SKILLS[k]=Object.assign({br:'C',max:1},keep[k]);LV[k]=1;}
  setTimeout(()=>{try{CTIER_LV[1]=55;CTIER_LV[2]=60;CTIER_LV[3]=70;CTIER_LV[4]=80;}catch(_){}},0);
  /* ---------- zigzag ---------- */
  SKILLS.jgRending.pre=[['jgTempo',1]];SKILLS.jgVenom.pre=[['jgTwilight',1]];
  if(typeof jgBuildReq==='function'){const _b=jgBuildReq;jgBuildReq=function(){_b();for(const [a,b] of [['jgTempo','jgRending'],['jgTwilight','jgVenom']]){const A=SKREQ[a],B=SKREQ[b];if(!A||!B)continue;
    B.forEach((r,i)=>{if(i>0)r.need.push([a,Math.min(SKILLS[a].max,i+1)]);});A.forEach((r,i)=>{if(i>0&&i<=B.length)r.need.push([b,i]);});}};}
  TABS[TABS.length-1]={n:'Avatar',keys:['jcSeal','jcSkyPounce','jcTotem']};
  Object.assign(BUFFDEF.jgCry||{},{i:'ATK'});

  /* ---------- hooks (fixed attack speed · flat values · counters) ---------- */
  window.jgAspd=()=>1;window.jgRecover=()=>1;window.jgDmgTaken=()=>1;window.jgCritDmg=()=>0;window.jgPostHit=()=>{};
  window.jgCrit=(e,o)=>(hasBuff('jgFocus')?10:0)+((e.prey>0&&LV.jgNightSight)?4*LV.jgNightSight:0)+(o&&o.echoCrit?25:0)+(hasBuff('jgTotem')?JX.totemCrit:0);
  window.jgHit=(e)=>(e.prey>0&&LV.jgNightSight)?6*LV.jgNightSight:0;
  window.jgBleedMul=()=>{const b=Math.max(1,ATK*.18);return LV.jgCrimson?(b+jxL(JX.crimson.bleed,'jgCrimson'))/b:1;};
  let bsT=0;
  window.jgDmgMul=(e,o)=>{o=o||{};if(o.dot)return 1;let f=0;
    if(hasBuff('jgCry'))f+=jxL(JX.atk.jgCry,'jgCry');if(hasBuff('jgTotem'))f+=JX.atk.jgTotem;
    if(hasBuff('jgVeil')){f+=jxL(JX.atk.veil,'jgVeil');delete player.buffs.jgVeil;addFx(new DText({x:player.x,y:player.y,z:96,text:'AMBUSH',color:'#c9a8ff',size:13,life:.8}));}
    if(hasBuff('jgSlipNext')){f+=jxL(JX.atk.slip,'jgSlip');delete player.buffs.jgSlipNext;}
    if(LV.jgExecInst){if(e.hp<e.maxHp*.35)f+=jxL(JX.atk.exec,'jgExecInst');if(o.finisher&&e.prey>0)f+=jxL(JX.atk.execFin,'jgExecInst');}
    const behind=(player.x-e.x)*(e.face||1)<-4||e.jgBlind>0;if(behind){f+=o.auto?JX.atk.backAuto:JX.atk.backSkill;if(gameTime-bsT>.2){bsT=gameTime;addFx(new BackTick({e}));}}
    if(hasBuff('jgRiposte')){f+=JX.atk.riposte;delete player.buffs.jgRiposte;}
    if(!o.auto&&hasBuff('jgRhythm')){f+=JX.atk.rhythm;delete player.buffs.jgRhythm;}
    const base=Math.max(1,o&&o.magic?D.mag:D.patk);return (base+f)/base;};
  window.jgPreHit=(e)=>{const a=player.action;JGX.block=0;
    if(a&&a.key==='jgCountercut'&&!a.ended&&!a.cc){countercut(a,e);return 0;}if(a&&a.key==='jgCountercut'&&a.cc)return 0;
    if(a&&a.key==='jgParry'&&!a.ended){a.blocked=true;a.attacker=e;a.hitList=[e];parryFx(e,true);return 0;}
    if(hasBuff('jgMirror')){delete player.buffs.jgMirror;if(jgMirrorObj)jgMirrorObj.crack();parryFx(e,false);
      if(LV.jgShatter)player.combo={parent:'jgMirror',key:'jgShatter',t:FOLLOW_WIN,total:FOLLOW_WIN,action:{skill:'jgMirror',blocked:true,attacker:e,hitList:[e]}};JGX.block=jxL(JX.mirror,'jgMirror');return 1;}
    JGX.hitN++;if(JGX.hitN>=JX.evadeEvery){JGX.hitN=0;addFx(new JgShade({life:.35}));leafBurst(player.x,player.y,4,player.phi);addBuff('jgRiposte',2);return 0;}   // jungle reflex: every 6th hit is dodged → Riposte
    return 1;};
  window.jgAbsorb=(d)=>{if(JGX.block){d=Math.max(1,d-JGX.block);JGX.block=0;}return d;};
  window.jgAfterHurt=(e,dmg,crit,o)=>{if(o.dot||!dmg)return;
    if(!o.auto&&(!e.rupT||gameTime-e.rupT>.14)){e.rupT=gameTime;addFx(new JgRupture({e,col:o.br==='B'?'#38e0d0':o.br==='A'?'#ff5a6a':'#ffd27a'}));}
    if(crit&&LV.jcRhythm&&jgICD.rhythm<=0){jgICD.rhythm=2;addBuff('jgRhythm',3);addFx(new JgEye({x:e.x,y:e.y,z:80,life:.6,col:JGC.turq}));}
    if(e.brand>0&&LV.jgSunEater){JGX.sunN++;if(JGX.sunN>=JX.sun.every){JGX.sunN=0;const g=jxL(JX.sun.sp,'jgSunEater');player.mp=Math.min(player.maxMp,player.mp+g);addFx(new Drain({from:{x:e.x,y:e.y},color:JGC.gold}));dmgNum(player.x,player.y,80,'+'+g+' SP','heal',{scale:.45});}}
    if((o.br==='A'||o.br==='basic')&&LV.jgCrimson&&!o.noBleedProc){JGX.crimN++;if(JGX.crimN>=jxL(JX.crimson.every,'jgCrimson')){JGX.crimN=0;jgBleed(e,4);sparks(e.x,e.y,24,rnd(0,TAU),4,'#ff3a4a',160,Math.PI);}}
    if(hasBuff('jgTempo')&&!o.tempo&&!e.dead){JGX.tempoN++;if(JGX.tempoN>=JX.tempo.every){JGX.tempoN=0;setFxTimer(.06,()=>{if(e.dead)return;jh(e,jxL(JX.tempo.dmg,'jgTempo'),{tempo:true,noBleedProc:true,br:'A'});addPrey(e);if(typeof stab==='function')stab(e,'#ff5a4a');});}}};

  /* ---------- descriptions ---------- */
  const L=(max,f)=>{const o={};for(let i=1;i<=max;i++)o[i]=f(i);return o;},Dd=(k,d,lv)=>{JG_DESC[k]={d,lv};};
  Dd('jgStep','พุ่งไปทางเมาส์ ไม่โดนโจมตีช่วงต้นของการพุ่ง',L(2,i=>[`ระยะ ${100+35*i}`,`ไม่โดนโจมตีช่วงต้นท่า (Lv.2 นานขึ้น)`]));
  Dd('jgCry','คำรามบรรพบุรุษ ATK เพิ่ม',L(3,i=>[`ATK +${JX.atk.jgCry[i-1]}`,`นาน ${20+10*i} วิ`]));
  Dd('jgTempo','จังหวะดุร้าย ทุกฮิตที่ 3 (ตีปกติหรือสกิล) แถมกรงเล็บอีก 1 ครั้งและติด Prey Mark · อัปสลับเลเวลกับ Rending Fang',L(4,i=>[`กรงเล็บแถม ${jxX(JX.tempo.dmg[i-1])} + Prey Mark 1`,`นาน ${20+5*i} วิ`]));
  Dd('jgRending','ฟันไขว้ 2 ครั้งแล้วแทงปิด สร้าง Prey Mark · เปิดคอมโบ Open Wound · อัปสลับเลเวลกับ Savage Tempo',(JG_DESC.jgRending||{}).lv||{});
  Dd('jgCrimson','(Passive) คมมีดสีเลือด ตีปกติ/สกิล A โดนครบจำนวนครั้งทำให้เลือดไหล และเลือดไหลแรงขึ้น',L(2,i=>[`ทุกฮิตที่ ${JX.crimson.every[i-1]}: เลือดไหล 4 วิ`,`เลือดไหล +${JX.crimson.bleed[i-1]} ต่อวิ`]));
  Dd('jgExecInst','(Passive) สัญชาตญาณประหาร',L(2,i=>[`ATK +${JX.atk.exec[i-1]} ใส่เป้า HP < 35%`,`ท่าปิด ATK +${JX.atk.execFin[i-1]} ใส่เป้าที่มี Prey Mark`]));
  Dd('jgFinalTalon','(คอมโบ) ฟัน X ปิด ใช้ Prey Mark สูงสุด 2',L(1,()=>['ATK×1.7','+ATK×0.45 ต่อ Prey Mark ที่ใช้']));
  Dd('jgDrop','กระโดดข้ามแล้วแทงลงพื้น ใช้ Prey Mark ทั้งหมด',L(1,()=>['เป้าหลัก ATK×3 + ATK×0.6 ต่อ Prey Mark · รอบข้าง ATK×1.5']));
  Dd('jgThrone','ULTIMATE A — เทเลพอร์ตรอบเป้าฟัน 7 ครั้ง ปิดด้วยวิญญาณจากัวร์ตะปบ',L(1,()=>['7 ฮิต × ATK×0.8 + ฮิตปิด ATK×3.6','+ATK×0.4 ต่อ Prey Mark ที่ใช้']));
  Dd('jgTwilight','ฟันเงาสนธยา สร้าง Eclipse Brand · อัปสลับเลเวลกับ Venom Sigil',L(4,i=>[jxX([1.4,1.67,1.93,2.2][i-1]),'+ATK×0.5 ถ้าเป้ามี Brand อยู่แล้ว']));
  Dd('jgVenom','ฝังตราพิษ · เปิดคอมโบ Venom Bloom · อัปสลับเลเวลกับ Twilight Fang',L(3,i=>[jxX([.9,1.2,1.5][i-1]),`พิษ 5 วิ วินาทีละ ${jxX([.1,.13,.16][i-1])}`]));
  Dd('jgVeil','พรางตัวในเงา การโจมตีครั้งแรกแรงขึ้น',L(2,i=>[`นาน ${6+2*i} วิ`,`ฮิตแรก ATK +${JX.atk.veil[i-1]}`]));
  Dd('jgSlip','ย้ายผ่านเงาไปด้านข้าง/หลังเป้า ท่าถัดไปแรงขึ้น · เปิดคอมโบ Eclipse Backstab',L(3,i=>[`ท่าถัดไป ATK +${JX.atk.slip[i-1]}`,'เป้าตาพร่า 1.5 วิ (นับเป็นการแทงหลัง)']));
  Dd('jgEBackstab','(คอมโบ) แทงหลัง ใช้ Eclipse Brand ทั้งหมดเกิด Shadow Burst',L(1,()=>['ATK×2.3','Shadow Burst ATK×0.7 + ATK×0.2 ต่อ Brand ที่เกิน 1']));
  Dd('jgMirror','กระจกออบซิเดียนรับการโจมตีครั้งแรกที่โดน 2 วิ · แตกแล้วเปิด Mirror Shatter',L(2,i=>[`ครั้งนั้นดาเมจ −${JX.mirror[i-1]}`]));
  Dd('jgSunEater','(Passive) กลืนสุริยะ',L(2,i=>[`ตีเป้าที่มี Brand ทุกฮิตที่ ${JX.sun.every}: SP +${JX.sun.sp[i-1]}`,`Shadow Burst / Black Horizon +${jxX(.15*i)} ต่อ Brand`]));
  Dd('jgHorizon','คลื่นเงารูปพัดระยะไกล ใช้ Eclipse Brand',L(1,()=>['ATK×2.4 พัด 86° ระยะ 190','+ATK×0.3 ต่อ Brand ที่ใช้']));
  Dd('jgTwinFang',(JG_DESC.jgTwinFang||{}).d+' · ติดตัว: ทุกครั้งที่ 6 ที่โดนตีจะหลบได้ แล้วฮิตถัดไป ATK +'+JX.atk.riposte+' · แทงจากด้านหลัง ATK +'+JX.atk.backAuto+' (สกิล +'+JX.atk.backSkill+')',(JG_DESC.jgTwinFang||{}).lv||{});
  const C={jcRhythm:['คริติคอลแล้ว สกิลถัดไปแรงขึ้น (ทุก 2 วิ)',`สกิลถัดไป ATK +${JX.atk.rhythm}`],jcTotem:['[New Active] จันทร์เลือด 15 วิ ATK และ CRIT เพิ่ม',`ATK +${JX.atk.jgTotem} · CRIT +${JX.totemCrit}`]};
  for(const k in C)if(JG_DESC[k])JG_DESC[k]={d:(k==='jcTotem'?'':'[Enhancement] ')+C[k][0],lv:{1:[C[k][1],'เงื่อนไข: '+SKILLS[k].rq]}};
  for(const k of Object.keys(CSK))if(!C[k]&&JG_DESC[k]){const v=JG_DESC[k].lv[1];v[v.length-1]='เงื่อนไข: '+SKILLS[k].rq;}
  Dd('jgSiphon','แทง 2 ครั้งดูดเลือด · ถ้าเป้าเลือดไหลเปิด Blood Chase',L(3,i=>[`รวม ${jxX([1.6,2.1,2.6][i-1])}`,'ฟื้น HP = เลเวล×2 (เป้าเลือดไหล: เลเวล×3)']));
  {const r=JG_DESC.jgRending;if(r)for(const i in r.lv)r.lv[i]=r.lv[i].map(t=>t.replace(/ \(30\/30\/40%\)/,'').replace('แทงปิดแรงขึ้น 25% ถ้าเป้ามี Prey Mark','แทงปิด +ATK×0.4 ถ้าเป้ามี Prey Mark'));}
  if(JG_DESC.jcSeal)JG_DESC.jcSeal.lv[1]=JG_DESC.jcSeal.lv[1].map(t=>t.replace('DEF ลด 10% 4 วิ','DEF ลด 4 วิ'));
  if(JG_DESC.jcChain)JG_DESC.jcChain.lv[1]=JG_DESC.jcChain.lv[1].map(t=>t.replace('60% ของ Burst','Burst −ATK×0.3'));
  const fx=t=>typeof t==='string'?t.replace(/ATK (\d+(?:\.\d+)?)%/g,(_,n)=>jxX(n/100)).replace(/(\d+(?:\.\d+)?)%(?= (?:รัศมี|·|\+|×|$)|$)/g,(_,n)=>'ATK×'+(+(n/100).toFixed(2))):t;
  for(const k in SKILLS){const g=JG_DESC[k];if(!g)continue;g.d=fx(g.d);for(const i in g.lv)g.lv[i]=g.lv[i].map(fx);}
}
