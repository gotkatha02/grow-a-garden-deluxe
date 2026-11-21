/* =====================================================================
   TOTEM SEALS — ตราโทเท็ม (owner 2026-11-21: "อยากให้ปรับแต่งชุดได้" → seal powers approved "อีกอันโอเคแล้ว")
   • Weapon, headgear, armour and shoes carry ONE seal each (it.seal = land key). Crafted pieces start with their town's seal
     (another land can be picked at the smith), drop-set pieces come with a random one, any smith can change it (tab ตรา:
     that land's materials + zeny · test mode free). The accessory has no seal (boss relics go there later).
   • 2 seals of one land = that land's stat pair (flat, grows with the sealed pieces' level S) · 4 seals = one power chosen
     from the land's three. First pick free, the other two unlock with that land's Seal Crystal (the old trait crystal ids),
     switching is free in towns. Seals replace item traits and the craft / drop set bonuses (items.js).
   • Powers use flat values and counters only (rule 2). S = average item level of the sealed pieces worn.
     window.__SEAL_FORCE={land,p,S} forces a full set for the bench (tools/qa/bench_seal.py).
   • Hooks: gearCalc (pair stats, active power) · ENH_FLAT / ENH_ABSORB · hurt (per-hit flat, curse DEF cut) · itemFx.afterHit /
     dodge / moveMul · castSkillNow · onKill · ST_HOOK (statusProxy in index.html) · updEnemies (ticker: DoT, dash, icon, FX).
   ===================================================================== */
(function(){
if(typeof ITEMS==='undefined'||!window.AFItems)return;
const AF=window.AFItems;
const f=(S,k)=>Math.max(1,Math.round(S*k));
const pairV=S=>Math.round(2+S*.07);
const STN={atk:'ATK',def:'DEF',agi:'AGI',vit:'VIT',int:'INT',cha:'CHA',tal:'TAL',lck:'LCK'};
const LK=['vik','azt','grk','egy','jpn'],SL4=['rhand','top','armor','shoes'];
const vitT=()=>(D&&D.stat&&D.stat.vit)||effStat('vit');   // VIT total (points + level growth + items)
const LANDS={
  vik:{n:'กา',realm:'ไวกิ้ง',col:'#7fb8e8',dk:'#1d3454',pair:['atk','vit'],P:[
    {k:'blood',n:'เลือดนักรบ',tag:'บู๊เลือดน้อย',d:S=>`HP ต่ำกว่าครึ่ง: ATK/TAL +${f(S,.3)} และรับดาเมจ −${f(S,.5)} ต่อครั้ง`},
    {k:'rune',n:'รูนระเบิด',tag:'ตีรัว',d:S=>`ตีโดนครบ 5 ครั้ง (ตีปกติหรือสกิล): รูนระเบิดรอบเป้า ${f(S,1.2)} รัศมี 90 (ไม่เกิน 4 ตัว · ทุก 1.5 วิ)`},
    {k:'gate',n:'ประตูวัลฮัลลา',tag:'แทงก์ · ล่าบอส',d:S=>`โดนตีจนตาย: รอดด้วย HP ${f(S,5)} และไม่โดนดาเมจ 2 วิ · ทุก 90 วิ`}]},
  azt:{n:'งูขนนก',realm:'แอซเท็ก',col:'#5fbf6a',dk:'#163f1c',pair:['agi','cha'],P:[
    {k:'obs',n:'คมออบซิเดียน',tag:'ตีเร็ว',d:S=>`ตีเป้าเดิมครบ 4 ครั้ง: เลือดออก 3 วิ (${f(S,.3)} ต่อวิ) ซ้อนได้ 3 ชั้น`},
    {k:'coil',n:'งูรัด',tag:'สายคุม CHA',d:S=>`ใส่สถานะใดก็ได้ (ช้า มึน แข็ง ราก เลือดออก พิษ…): เดินเร็ว +${f(S,.5)} 3 วิ และสกิลถัดไปคูลดาวน์ −2 วิ (ทุก 2.5 วิ)`},
    {k:'sun',n:'เครื่องบูชาสุริยะ',tag:'สายฟาร์ม',d:S=>`ฆ่าศัตรู: AGI +${f(S,.1)} 8 วิ ซ้อน 5 ชั้น · ครบ 5 ชั้น สกิลถัดไปไม่เสีย SP`}]},
  grk:{n:'ม้าบิน',realm:'กรีก',col:'#e3d09a',dk:'#5a4014',pair:['vit','def'],P:[
    {k:'aegis',n:'โล่เทพ',tag:'แทงก์',d:S=>`โดนตีครบ 4 ครั้ง: ได้โล่ ${f(S,1.5)} นาน 3 วิ`},
    {k:'phalanx',n:'ฟาแลงซ์',tag:'โดนรุม',d:S=>`ศัตรูรอบตัว (150) ตัวละ รับดาเมจ −${f(S,.06)} ต่อครั้ง สูงสุด 5 ตัว`},
    {k:'hero',n:'วีรบุรุษ',tag:'แทงก์ที่ตีแรง',d:S=>`โดนตีครบ 10 ครั้ง: สกิลถัดไปแรงขึ้น VIT × 0.4 (ตอนนี้ +${Math.round(vitT()*.4)})`}]},
  egy:{n:'สคารับ',realm:'อียิปต์',col:'#f0bf4e',dk:'#4a2a06',pair:['tal','int'],P:[
    {k:'ra',n:'ตาแห่งรา',tag:'เวทรัวสกิล',d:S=>`ร่ายครบ 3 สกิล: สกิลถัดไปไม่เสีย SP และ ATK/TAL +${f(S,.2)}`},
    {k:'curse',n:'คำสาปฟาโรห์',tag:'ล่าบอส',d:S=>`สกิลโดนเป้า: คำสาป 1 ชั้น (สูงสุด 3) DEF −${f(S,.02)} ต่อชั้น · ครบ 3 ชั้น เป้าโดนเพิ่ม ATK/TAL +${f(S,.05)} ทุกครั้ง`},
    {k:'sand',n:'ทรายดูดวิญญาณ',tag:'วนสกิลไม่หยุด',d:S=>`สกิลโดนศัตรู ตัวละ SP +${f(S,.08)} (สูงสุด 5 ตัวต่อครั้งที่ร่าย)`}]},
  jpn:{n:'กระเรียน',realm:'ญี่ปุ่น',col:'#f4a0b8',dk:'#4a1626',pair:['atk','agi'],P:[
    {k:'iaido',n:'ไออิโด',tag:'จู่โจม',d:S=>`ตีแรกใส่ศัตรูที่ HP เต็ม: ATK/TAL +${f(S,.8)}`},
    {k:'ninja',n:'เงานินจา',tag:'หลบ AGI',d:S=>`โดนตีครั้งที่ 8 ทุกรอบ: หลบได้ + สวนกลับ ${f(S,3)}`},
    {k:'leaf',n:'สายลมใบไม้',tag:'พุ่งเข้าออก',d:S=>`หลังใช้ท่าพุ่ง / กระโดด / วาร์ป: 2 ตีถัดไป ATK/TAL +${f(S,.5)}`}]}};

/* ---------------- emblems (code placeholders until painted art) ---------------- */
const EMB={
 vik:`<path d="M2.6 15.6 L6.6 14.2 C8 11.2 10.6 9.4 13.8 9.1 C15.1 7.4 17 6.6 18.7 7.1 L22.2 8.2 L19 9.2 C19 11.7 17.5 13.9 14.9 15.1 L12.5 16 L10.3 19.8 L9.9 16.5 L6.2 17.4 Z"/><path d="M8.2 13.6 C10.4 11.4 13.4 11 15.6 12.2 C13.3 12.6 10.9 13.7 9.5 15.3 Z" fill="#fff" fill-opacity=".28"/><circle cx="18.1" cy="8.5" r=".8" fill="#fff"/>`,
 azt:`<path d="M5 19.5 C2.4 16.4 5.4 13.1 9.6 13.9 C13.2 14.6 16.3 14.6 17.2 11.6 C18 8.9 15.8 7.2 13.9 7.7" fill="none" stroke-width="2.7" stroke-linecap="round"/><ellipse cx="12.6" cy="7.9" rx="2.3" ry="1.7"/><path d="M11.2 6.6 C10.4 4.4 11.2 2.6 12.6 2 C12.3 3.6 12.7 5.1 13.4 6.3 Z M13.3 6.2 C13.6 4 14.9 2.8 16.4 2.7 C15.6 4 15.3 5.3 15.2 6.7 Z M10.4 7.4 C8.6 6.4 8 4.8 8.4 3.4 C9.2 4.6 10.2 5.6 11.2 6.4 Z"/><path d="M5 19.5 L3 21.8 M5 19.5 L5.6 22.2" fill="none" stroke-width="1.4" stroke-linecap="round"/><circle cx="11.9" cy="7.6" r=".55" fill="#fff"/>`,
 grk:`<path d="M10 12.6 C6.6 12.1 3.6 9.7 2.5 5.6 C4.5 7.1 6.2 7.6 7.9 7.4 C6.1 6.2 5.3 4.5 5.5 2.6 C7.8 5 10.1 6.4 12.1 9.4 Z" fill-opacity=".85"/><path d="M8.6 21.6 L9.7 15.1 C9.9 11.2 11.9 8.2 14.5 7 L15.7 4.3 L16.7 6.7 C19.1 7.8 21.1 10.2 21.4 12.4 C21.6 13.6 20.4 14.3 19.3 13.8 L16.5 12.8 C15.5 14.8 15.3 17.4 15.9 21.6 Z"/><circle cx="17.3" cy="9.5" r=".75" fill="#fff"/>`,
 egy:`<circle cx="12" cy="4.6" r="2.9" fill="#e8492a" stroke="#5a1a08" stroke-width=".6"/><path d="M9.6 10 C9.6 8.4 10.7 7.6 12 7.6 C13.3 7.6 14.4 8.4 14.4 10 Z"/><ellipse cx="12" cy="15.2" rx="4.6" ry="5.6"/><path d="M12 10 V20.6" stroke="#fff" stroke-opacity=".45" stroke-width=".8" fill="none"/><path d="M7.6 12.4 L4.4 10.6 M7.4 15.2 L4 15.8 M7.8 18 L5 20.4 M16.4 12.4 L19.6 10.6 M16.6 15.2 L20 15.8 M16.2 18 L19 20.4 M10.2 9 L8.6 6.2 M13.8 9 L15.4 6.2" fill="none" stroke-width="1.2" stroke-linecap="round"/>`,
 jpn:`<path d="M11.6 12.6 C8 11.4 4.4 12.2 2.2 15.6 C5 14.8 7.6 15.2 10 16.6 C7.6 16.6 5.6 17.6 4.4 19.6 C7.6 18.4 10.4 18.4 12.4 18.8 Z" fill-opacity=".85"/><path d="M8.6 21.8 C9.6 17.5 11.2 13.8 12.8 10.6 C13.8 8.4 14.4 6.6 15.6 5.6 C16.6 4.8 18 5 18.6 5.8 L22.4 7.4 L18.4 7.6 C17 8.8 16 10.4 15.4 12.6 C14.4 16.4 13.2 19.4 12.4 21.8 Z"/><circle cx="16.7" cy="4.9" r="1.25" fill="#e8323a"/><circle cx="17.4" cy="6.2" r=".5" fill="#fff"/>`};
function badge(l,sz){const L=LANDS[l];if(!L)return '';return `<svg class="sbadge" width="${sz}" height="${sz}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.2" fill="${L.col}" stroke="#2a1a10" stroke-width="1.1"/><ellipse cx="9.6" cy="7.4" rx="6.4" ry="4.2" fill="#fff" opacity=".32"/><circle cx="12" cy="12" r="9.7" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><g transform="translate(12 12.3) scale(.74) translate(-12 -12)" fill="${L.dk}" stroke="${L.dk}" stroke-width="0">${EMB[l]}</g></svg>`;}
const badgeURI=l=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(badge(l,64).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
const BIMG={};for(const l of LK){const im=new Image();im.src=badgeURI(l);BIMG[l]=im;}   // for the canvas (power procs)

/* ---------------- save: unlocked powers + chosen power per land (per hero, per mode) ---------------- */
const KEY='af_seals_'+CHAR+(AF.MODE==='play'?'_play':'');
const SD={v:1,u:{},p:{}};
try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o&&!AF.fresh)Object.assign(SD,o);}catch(e){}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(SD));}catch(e){}};
const isTest=()=>AF.MODE!=='play';
const unl=(l,i)=>isTest()||!!(SD.u[l]&&SD.u[l][i]);
const nUnl=l=>[0,1,2].filter(i=>SD.u[l]&&SD.u[l][i]).length;
function grant(l,i){if(!LANDS[l])return;(SD.u[l]=SD.u[l]||[0,0,0])[i]=1;if(!(SD.p[l]>=0))SD.p[l]=i;}
if(window.__SEAL_GRANTS&&__SEAL_GRANTS.length){for(const [l,i] of __SEAL_GRANTS)grant(l,i);__SEAL_GRANTS.length=0;sv();
  setTimeout(()=>{try{chatLog('sys','<b style="color:#e0a020">🔱 ตราโทเท็ม</b>: นิสัยพิเศษบนของเก่ากลายเป็นพลังตราที่ปลดไว้ให้แล้ว (หน้าอุปกรณ์ › ตราโทเท็ม)');}catch(e){}},3000);}

/* ---------------- what is worn ---------------- */
function countSeals(){const c={};for(const sl of SL4){const id=EQ[sl],it=ITEMS[id];if(!it||it.broken||!LANDS[it.seal])continue;const lv=(itemSt(id).lv)||it.lvReq||1;if(lv>PS.lv)continue;
  const o=c[it.seal]||(c[it.seal]={n:0,lv:0});o.n++;o.lv+=lv;}for(const l in c)c[l].S=Math.max(1,Math.round(c[l].lv/c[l].n));return c;}
let POW=null,SET={},PK=null;
const ST={};
function resetST(){Object.assign(ST,{hitN:0,runeT:0,takenN:0,heroN:0,heroReady:false,castN:0,raReady:false,flatV:0,flatT:-9,ninjaN:0,gateT:-999,gateUntil:-9,shield:0,shieldMax:1,shieldT:-9,
  sun:0,sunT:-9,sunFree:false,leaf:0,leafT:-9,leafCd:-9,px:player.x,py:player.y,coilT:-9,coilCd:false,coilCdT:-9,coilFxT:-9,phN:0,blood:false,castSet:new Set()});}
resetST();
const BLEED=new Set(),CURSED=new Set();
{const _gc=gearCalc;gearCalc=function(){_gc();SET=countSeals();const F=window.__SEAL_FORCE;if(F&&LANDS[F.land])SET={[F.land]:{n:F.n||4,S:F.S||90}};
  POW=null;for(const l in SET){const o=SET[l];if(o.n>=2){const v=pairV(o.S);for(const k of LANDS[l].pair)BON[k]=(BON[k]||0)+v;}
    if(o.n>=4){const i=F&&F.land===l?F.p:SD.p[l];if(i>=0&&i<3&&(F||unl(l,i)))POW={l,i,k:LANDS[l].P[i].k,S:o.S};}}
  const nk=POW?POW.k:null;if(nk!==PK){PK=nk;resetST();BLEED.clear();CURSED.clear();}
  if(POW&&POW.k==='sun'&&ST.sun>0&&gameTime<ST.sunT)BON.agi=(BON.agi||0)+f(POW.S,.1)*ST.sun;};}
let DIRTY=false;const dirty=()=>{DIRTY=true;};

/* ---------------- combat hooks ---------------- */
let HIT_FLAT=0;
{const _f=window.ENH_FLAT;window.ENH_FLAT=()=>(_f?_f():0)+HIT_FLAT+(POW&&POW.k==='blood'&&player.hp>0&&player.hp<player.maxHp*.5?f(POW.S,.3):0);}
{const _h=hurt;window.hurt=hurt=function(e,mult,o){o=o||{};if(!POW||!e||e.dead||o.seal||o.dot)return _h(e,mult,o);
  const k=POW.k,S=POW.S;let add=0,cut=0;
  if(k==='iaido'&&e.hp>=e.maxHp){add+=f(S,.8);fxIaido(e);}
  else if(k==='leaf'&&ST.leaf>0&&gameTime<ST.leafT){add+=f(S,.5);ST.leaf--;fxAt('leafHit',e.x,e.y,{e});}
  else if((k==='hero'||k==='ra')&&!o.auto&&gameTime<ST.flatT)add+=ST.flatV;
  else if(k==='curse'&&e._curse>0&&e._curseT>gameTime){cut=f(S,.02)*e._curse;if(e._curse>=3)add+=f(S,.05);}
  const mon=e.m,prev=HIT_FLAT;HIT_FLAT=prev+add;if(cut&&mon)mon.def=(mon.def||0)-cut;
  try{return _h(e,mult,o);}finally{HIT_FLAT=prev;if(cut&&mon)mon.def+=cut;}};}
const FX=window.itemFx;
{const _a=FX.afterHit;FX.afterHit=function(e,dmg,crit,o){_a.call(FX,e,dmg,crit,o);if(!POW||!o||o.dot||o.seal)return;const k=POW.k,S=POW.S;
  if(k==='rune'){if(ST.hitN<5)ST.hitN++;if(ST.hitN>=5&&gameTime>=ST.runeT){ST.hitN=0;ST.runeT=gameTime+1.5;rune(e);}}
  else if(k==='obs'){if(!e.dead&&(e._obsN=(e._obsN||0)+1)>=4){e._obsN=0;bleed(e);}}
  else if(k==='curse'){if(!o.auto&&!e.dead){if(!(e._curseT>gameTime))e._curse=0;e._curse=Math.min(3,(e._curse||0)+1);e._curseT=gameTime+6;CURSED.add(e);}}
  else if(k==='sand'){if(!o.auto&&ST.castSet.size<5&&!ST.castSet.has(e)){ST.castSet.add(e);player.mp=Math.min(player.maxMp,player.mp+f(S,.08));fxAt('sand',e.x,e.y,{e});}}};}
{const _d=FX.dodge;FX.dodge=function(e){if(_d.call(FX,e))return true;if(POW&&POW.k==='ninja'&&++ST.ninjaN>=8){ST.ninjaN=0;ninja(e);return true;}return false;};}
{const _m=FX.moveMul;FX.moveMul=function(){const m=_m.call(FX);return POW&&POW.k==='coil'&&gameTime<ST.coilT&&player.speed>0?m*(player.speed+f(POW.S,.5))/player.speed:m;};}
{const _ab=window.ENH_ABSORB;window.ENH_ABSORB=function(d){d=_ab?_ab(d):d;if(!POW)return d;if(gameTime<ST.gateUntil)return 0;if(!(d>0))return d;const k=POW.k,S=POW.S;
  if(k==='blood'){if(player.hp<player.maxHp*.5)d=Math.max(1,d-f(S,.5));}
  else if(k==='phalanx'){const n=nearN();if(n)d=Math.max(1,d-f(S,.06)*n);}
  else if(k==='aegis'){if(ST.shield>0&&gameTime<ST.shieldT){const a=Math.min(ST.shield,d);ST.shield-=a;d-=a;if(d<=0)addFx(new DText({x:player.x,y:player.y,z:74,text:'โล่',color:'#ffe08a',size:12,life:.6}));}
    if(++ST.takenN>=4){ST.takenN=0;ST.shield=ST.shieldMax=f(S,1.5);ST.shieldT=gameTime+3;fxAt('aegisOn',player.x,player.y);}}
  else if(k==='hero'){if(!ST.heroReady&&++ST.heroN>=10){ST.heroN=0;ST.heroReady=true;fxAt('heroOn',player.x,player.y);}}
  else if(k==='gate'&&d>=player.hp&&gameTime>=ST.gateT){ST.gateT=gameTime+90;ST.gateUntil=gameTime+2;player.hp=Math.min(player.maxHp,Math.max(1,f(S,5)));gate();return 0;}
  return d;};}
{const _c=castSkillNow;window.castSkillNow=castSkillNow=function(key,c){if(!POW)return _c(key,c);const k=POW.k,mp0=player.mp;
  const free=(k==='ra'&&ST.raReady)||(k==='sun'&&ST.sunFree);const ok=_c(key,c);if(!ok)return ok;ST.castSet=new Set();
  if(free){player.mp=mp0;addFx(new DText({x:player.x,y:player.y,z:104,text:'ไม่เสีย SP',color:k==='ra'?'#ffd860':'#ffb84a',size:11,life:.8}));}
  if(k==='ra'){if(ST.raReady){ST.raReady=false;ST.flatV=f(POW.S,.2);ST.flatT=gameTime+1.6;fxAt('raUse',player.x,player.y);}else if(++ST.castN>=3){ST.castN=0;ST.raReady=true;fxAt('raOn',player.x,player.y);}}
  else if(k==='sun'&&free){ST.sunFree=false;ST.sun=0;dirty();}
  else if(k==='hero'&&ST.heroReady){ST.heroReady=false;ST.flatV=Math.round(vitT()*.4);ST.flatT=gameTime+1.6;fxAt('heroUse',player.x,player.y);}
  else if(k==='coil'&&ST.coilCd){ST.coilCd=false;if(player.cd[key]>0){player.cd[key]=Math.max(0,player.cd[key]-2);addFx(new DText({x:player.x,y:player.y,z:104,text:'−2 วิ',color:'#8af0a0',size:11,life:.7}));}}
  return ok;};}
{const _k=onKill;onKill=function(e){_k(e);if(!POW)return;if(POW.k==='sun'){ST.sun=Math.min(5,ST.sun+1);ST.sunT=gameTime+8;if(ST.sun>=5&&!ST.sunFree){ST.sunFree=true;fxAt('sunFull',player.x,player.y);}dirty();}};}
window.ST_HOOK=function(e,k,v,o){if(!POW||POW.k!=='coil'||k==='stagger'||!(v>0)||!e||e.dead)return;ST.coilT=gameTime+3;
  if(gameTime>=ST.coilCdT){ST.coilCd=true;ST.coilCdT=gameTime+2.5;}if(gameTime>=ST.coilFxT){ST.coilFxT=gameTime+.7;fxAt('coil',player.x,player.y);}};

function nearN(){let n=0;const px=player.x,py=player.y;for(const e of enemies){if(e.dead||!(e.aggro>0))continue;const dx=e.x-px,dy=e.y-py;if(dx*dx+dy*dy<22500&&++n>=5)break;}return n;}
/* rune burst: every 5th landed hit, ATK/TAL×1.2 around the target (o.dot: no crit, no item / gem / combo chains) */
/* seal damage is absolute (S × n through the target's DEF), not ×ATK: every hero's damage is balanced to the same total, but their per-hit scales differ a lot */
function sealDmg(e,raw,label,col){if(!e||e.dead)return 0;const d=Math.max(1,Math.round(defAdjust(raw,(e.m&&e.m.def)||0)));e.hp-=d;e.flash=1;e.aggro=Math.max(e.aggro||0,8);dmgNum(e.x,e.y,(typeof MSPR_H==='function'?MSPR_H(e):48)+18,d,'hit',{scale:.9,who:e});
  if(label)addFx(new DText({x:e.x,y:e.y,z:64,text:label,color:col||'#ffe9a8',size:12,life:.9}));if(e.hp<=0&&!e.dead)kill(e);return d;}
function rune(t){fxAt('rune',t.x,t.y);const L=enemies.filter(e=>!e.dead&&(e.x-t.x)**2+(e.y-t.y)**2<8100+(e.r||17)**2).sort((a,b)=>((a.x-t.x)**2+(a.y-t.y)**2)-((b.x-t.x)**2+(b.y-t.y)**2)).slice(0,4);
  const raw=f(POW.S,1.2);for(const e of L)sealDmg(e,raw,e===t?'RUNE':null,'#9fdcff');}
function bleed(e){const b=e._sb&&e._sb.t>gameTime?e._sb:(e._sb={n:0,t:0,acc:0});b.n=Math.min(3,b.n+1);b.t=gameTime+3;BLEED.add(e);fxAt('obs',e.x,e.y,{e});}
function ninja(e){fxAt('ninja',player.x,player.y);if(e&&!e.dead){fxAt('ninjaCut',e.x,e.y,{e});sealDmg(e,f(POW.S,3),'สวนกลับ','#d8b0ff');}}
function gate(){fxAt('gate',player.x,player.y);addFx(new DText({x:player.x,y:player.y,z:96,text:'ประตูวัลฮัลลา!',color:'#ffd860',size:15,life:1.5}));try{shake(2);}catch(e){}}
function fxIaido(e){fxAt('iaido',e.x,e.y,{e});}

/* ---------------- ticker ---------------- */
let ICONK=null,LAST4={};
function lbl(){const k=POW.k,t=gameTime;switch(k){
  case 'blood':return player.hp<player.maxHp*.5?'เดือด':'';case 'rune':return t<ST.runeT?Math.ceil(ST.runeT-t)+'s':ST.hitN+'/5';case 'gate':return t<ST.gateT?Math.ceil(ST.gateT-t)+'s':'พร้อม';
  case 'obs':return '';case 'coil':return t<ST.coilT?Math.ceil(ST.coilT-t)+'s':'';case 'sun':return ST.sunFree?'ฟรี':ST.sun+'/5';
  case 'aegis':return ST.shield>0&&t<ST.shieldT?Math.ceil(ST.shield)+'':ST.takenN+'/4';case 'phalanx':return ST.phN?'×'+ST.phN:'';case 'hero':return ST.heroReady?'พร้อม':ST.heroN+'/10';
  case 'ra':return ST.raReady?'พร้อม':ST.castN+'/3';case 'ninja':return ST.ninjaN+'/8';case 'leaf':return ST.leaf>0&&t<ST.leafT?'×'+ST.leaf:'';default:return '';}}
function icon(){const key='sl_'+POW.k;if(ICONK&&ICONK!==key&&player.buffs[ICONK])delete player.buffs[ICONK];ICONK=key;
  if(!BUFFDEF[key]){const L=LANDS[POW.l],p=L.P[POW.i];BUFFDEF[key]={n:`ตรา${L.n} · ${p.n} — ${p.d(POW.S)}`,c:L.col,i:'✦'};}
  if(!window.BUFF_ART)window.BUFF_ART={};if(!BUFF_ART[key])BUFF_ART[key]=badgeURI(POW.l);
  const b=player.buffs[key]||(player.buffs[key]={t:1e9,total:1e9});b.t=1e9;b.lbl=lbl();}
function tick(dt){
  if(DIRTY){DIRTY=false;applyStats();}
  /* a land just reached 4 seals and no power is picked yet → tell the player where to choose */
  for(const l in SET){const n=SET[l].n;if(n>=4&&!(LAST4[l]>=4)&&!(SD.p[l]>=0)&&!window.__SEAL_FORCE){try{chatLog('sys',`<b style="color:#e0a020">🔱 ครบ 4 ตรา${LANDS[l].n}</b> — เปิดหน้าอุปกรณ์ (Alt+E) เลือกพลัง 1 ใน 3 (แบบแรกฟรี)`);msg(`ครบ 4 ตรา${LANDS[l].n} — เลือกพลังที่หน้าอุปกรณ์`);}catch(e){}}LAST4[l]=n;}
  for(const l in LAST4)if(!SET[l])LAST4[l]=0;
  if(!POW){if(ICONK&&player.buffs[ICONK])delete player.buffs[ICONK];ICONK=null;return;}
  const k=POW.k,S=POW.S;
  if(!fx.includes(AUG)){AUG.t=0;fx.push(AUG);}if(!fx.includes(AUT)){AUT.t=0;fx.push(AUT);}
  if(k==='phalanx')ST.phN=nearN();
  else if(k==='sun'){if(ST.sun>0&&gameTime>=ST.sunT){ST.sun=0;dirty();}}
  else if(k==='obs'){for(const e of BLEED){const b=e._sb;if(!b||e.dead||b.t<=gameTime){BLEED.delete(e);if(b)e._sb=null;continue;}b.acc+=dt;
    if(b.acc>=1){b.acc-=1;const d=f(S,.3)*b.n;e.hp-=d;dmgNum(e.x,e.y,40,d,'taken',{scale:.5});fxAt('drop',e.x,e.y,{e});if(e.hp<=0&&!e.dead){BLEED.delete(e);kill(e);}}}}
  else if(k==='curse'){for(const e of CURSED)if(e.dead||!(e._curseT>gameTime)){CURSED.delete(e);e._curse=0;}}
  else if(k==='leaf'){const dx=player.x-ST.px,dy=player.y-ST.py,d=Math.hypot(dx,dy);ST.px=player.x;ST.py=player.y;
    if(dt>0&&d>6&&d<420&&d/dt>650&&(player.action||player.z>2)&&gameTime>=ST.leafCd){ST.leaf=2;ST.leafT=gameTime+6;ST.leafCd=gameTime+.7;fxAt('leafOn',player.x,player.y);}}
  icon();}
{const _u=updEnemies;updEnemies=function(dt){_u(dt);try{tick(dt);}catch(err){if(!tick.err){tick.err=1;console.warn('seal tick',err);}}};}

/* ---------------- effects (code VFX, own classes so the heroes' effect filters leave them alone) ---------------- */
const HX=(c,a)=>hexA(c,Math.max(0,Math.min(1,a)));
const headZ=()=>86+(player.z||0);
const bodyZ=e=>((typeof MSPR_H==='function'?MSPR_H(e):50)||50)*.55+(e.z||0);
const RUNES=[c=>{c.moveTo(0,-5);c.lineTo(0,5);c.moveTo(0,-5);c.lineTo(-3,-2);c.moveTo(0,-5);c.lineTo(3,-2);},c=>{c.moveTo(0,5);c.lineTo(0,-5);c.moveTo(0,-1);c.lineTo(-3,-4);c.moveTo(0,-1);c.lineTo(3,-4);},
  c=>{c.moveTo(-2,5);c.lineTo(-2,-5);c.lineTo(2,-2);c.lineTo(-2,0);c.lineTo(2,5);},c=>{c.moveTo(-2,5);c.lineTo(-2,-5);c.moveTo(-2,-3);c.lineTo(2,-5);c.moveTo(-2,0);c.lineTo(2,-2);},
  c=>{c.moveTo(-3,5);c.lineTo(0,1);c.lineTo(3,5);c.moveTo(0,1);c.lineTo(-3,-2);c.lineTo(0,-5);c.lineTo(3,-2);c.lineTo(0,1);},c=>{c.moveTo(0,-5);c.lineTo(0,5);c.moveTo(-3,-1);c.lineTo(3,1);}];
/* every piece has a saturated body drawn normally (reads on snow and sand) + a darker rim, light only on top as a highlight */
function groundRing(x,y,r,w,col,a,dark){const [sx,sy]=P(x,y);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);
  ctx.strokeStyle=dark||'rgba(20,16,30,'+(.35*a)+')';ctx.lineWidth=w+2.4;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();
  ctx.strokeStyle=HX(col,a);ctx.lineWidth=w;ctx.stroke();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=HX('#ffffff',.55*a);ctx.lineWidth=Math.max(.8,w*.3);ctx.stroke();ctx.restore();}
function groundDisc(x,y,r,col,a){const [sx,sy]=P(x,y);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,HX(col,a));g.addColorStop(.7,HX(col,a*.6));g.addColorStop(1,HX(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
function groundGlow(x,y,r,col,a){const [sx,sy]=P(x,y);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,HX(col,a));g.addColorStop(1,HX(col,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
function halo(x,y,r,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(24,16,34,${.3*a})`);g.addColorStop(1,'rgba(24,16,34,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
function star4(x,y,r,col,a,rot=0,edge='#6a3a08'){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.3:r,an=i/8*TAU;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}ctx.closePath();
  ctx.lineJoin='round';ctx.strokeStyle=HX(edge,.75*a);ctx.lineWidth=1.6;ctx.stroke();ctx.fillStyle=HX(col,a);ctx.fill();ctx.fillStyle=HX('#ffffff',a*.95);ctx.beginPath();ctx.arc(0,0,r*.24,0,TAU);ctx.fill();ctx.restore();}
function leafShape(x,y,s,rot,col,a){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*.75,s,0);ctx.quadraticCurveTo(0,s*.75,-s,0);
  ctx.strokeStyle=HX('#0f4a1a',.8*a);ctx.lineWidth=1.3;ctx.stroke();ctx.fillStyle=HX(col,a);ctx.fill();ctx.strokeStyle=HX('#e8ffe0',.8*a);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-s*.8,0);ctx.lineTo(s*.8,0);ctx.stroke();ctx.restore();}
function ankh(x,y,s,a){ctx.save();ctx.translate(x,y);ctx.lineCap='round';const path=()=>{ctx.beginPath();ctx.ellipse(0,-s*.55,s*.32,s*.42,0,0,TAU);ctx.moveTo(-s*.5,0);ctx.lineTo(s*.5,0);ctx.moveTo(0,-s*.13);ctx.lineTo(0,s);};
  path();ctx.strokeStyle=HX('#2a0a40',.7*a);ctx.lineWidth=4.2;ctx.stroke();ctx.strokeStyle=HX('#a24ae8',a);ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle=HX('#f0d8ff',.85*a);ctx.lineWidth=.9;ctx.stroke();ctx.restore();}
function drop(x,y,s,col,a){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.7,-s*.1,s*.7,s*.75,0,s*.85);ctx.bezierCurveTo(-s*.7,s*.75,-s*.7,-s*.1,0,-s);
  ctx.strokeStyle=HX('#3a0408',.7*a);ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=HX(col,a);ctx.fill();ctx.fillStyle=HX('#ffd0d0',.7*a);ctx.beginPath();ctx.arc(-s*.2,s*.1,s*.18,0,TAU);ctx.fill();ctx.restore();}
function eye(x,y,s,a,open=1){ctx.save();ctx.translate(x,y);halo(0,0,s*1.6,a);ctx.lineCap='round';ctx.lineJoin='round';
  const outline=()=>{ctx.beginPath();ctx.moveTo(-s,0);ctx.quadraticCurveTo(0,-s*.75*open,s,0);ctx.quadraticCurveTo(0,s*.6*open,-s,0);};
  const marks=()=>{ctx.beginPath();ctx.moveTo(-s*.9,-s*.55);ctx.quadraticCurveTo(0,-s*1.05,s*.9,-s*.5);ctx.moveTo(-s*.15,s*.3);ctx.lineTo(-s*.35,s*.95);ctx.moveTo(s*.2,s*.32);ctx.quadraticCurveTo(s*.55,s*.95,s*.95,s*.75);};
  outline();ctx.fillStyle=HX('#fff3c0',.9*a);ctx.fill();ctx.strokeStyle=HX('#5a2a04',.85*a);ctx.lineWidth=3.6;ctx.stroke();marks();ctx.stroke();
  outline();ctx.strokeStyle=HX('#f2b51c',a);ctx.lineWidth=2;ctx.stroke();marks();ctx.stroke();
  ctx.fillStyle=HX('#3a1a06',a);ctx.beginPath();ctx.arc(0,-s*.02,s*.24,0,TAU);ctx.fill();ctx.fillStyle=HX('#ffffff',a);ctx.beginPath();ctx.arc(-s*.07,-s*.09,s*.08,0,TAU);ctx.fill();ctx.restore();}
function shieldShape(x,y,s,a,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=HX('#c8913a',a);ctx.strokeStyle=HX('#5a3a10',a);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-s*.7,-s*.8);ctx.lineTo(s*.7,-s*.8);ctx.lineTo(s*.7,0);ctx.quadraticCurveTo(s*.6,s*.7,0,s);ctx.quadraticCurveTo(-s*.6,s*.7,-s*.7,0);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=HX('#ffe08a',a);ctx.lineWidth=.9;ctx.stroke();ctx.fillStyle=HX('#fff2c0',a);ctx.beginPath();ctx.arc(0,-s*.1,s*.2,0,TAU);ctx.fill();ctx.restore();}
function slash(L,w,body,core,a,ink){ctx.beginPath();ctx.moveTo(-L,0);ctx.quadraticCurveTo(0,-w,L,0);ctx.quadraticCurveTo(0,w,-L,0);if(ink){ctx.fillStyle=ink;ctx.fill();}
  ctx.beginPath();ctx.moveTo(-L*.92,0);ctx.quadraticCurveTo(0,-w*.62,L*.92,0);ctx.quadraticCurveTo(0,w*.62,-L*.92,0);ctx.fillStyle=HX(body,a);ctx.fill();
  ctx.beginPath();ctx.moveTo(-L*.7,0);ctx.quadraticCurveTo(0,-w*.22,L*.7,0);ctx.quadraticCurveTo(0,w*.22,-L*.7,0);ctx.fillStyle=HX(core,a);ctx.fill();}
const DRAW={
  rune(k){const r=20+70*eOut(Math.min(1,k*2.4)),a=1-k*k;const [sx,sy]=P(this.x,this.y);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(16,44,110,${.34*a})`);g.addColorStop(.8,`rgba(30,90,200,${.22*a})`);g.addColorStop(1,'rgba(30,90,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
    for(const [rr,w] of [[r,3.4],[r*.7,1.8]]){ctx.strokeStyle=`rgba(10,24,60,${.5*a})`;ctx.lineWidth=w+2.6;ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.stroke();ctx.strokeStyle=HX('#3d9bff',a);ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle=HX('#e0f6ff',.85*a);ctx.lineWidth=w*.35;ctx.stroke();}
    ctx.lineCap='round';ctx.lineJoin='round';for(let i=0;i<6;i++){const an=i/6*TAU+k*1.2;ctx.save();ctx.translate(Math.cos(an)*r*.85,Math.sin(an)*r*.85);ctx.rotate(an+Math.PI/2);ctx.beginPath();RUNES[i](ctx);
      ctx.strokeStyle=`rgba(10,24,60,${.6*a})`;ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle=HX('#bfe8ff',a);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    ctx.restore();},
  runeFlash(k){const a=(1-k)*(k<.2?k/.2:1);const [sx,sy]=P(this.x,this.y,0);ctx.save();const h=96*(.6+.4*k),w=24*(1-k*.5);
    const g=ctx.createLinearGradient(0,sy-h,0,sy);g.addColorStop(0,HX('#3d9bff',0));g.addColorStop(.6,HX('#3d9bff',.55*a));g.addColorStop(1,HX('#8fd8ff',.8*a));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy-h/2,w/2,h/2,0,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=HX('#ffffff',.5*a);ctx.beginPath();ctx.ellipse(sx,sy-h/2,w*.16,h*.45,0,0,TAU);ctx.fill();ctx.restore();},
  gate(k){const a=k<.12?k/.12:1-(k-.12)/.88;const [sx,sy]=P(player.x,player.y,0);ctx.save();const w=58*(1-.35*k),h=300;
    const g0=ctx.createLinearGradient(0,sy-h,0,sy);g0.addColorStop(0,HX('#e8a020',0));g0.addColorStop(.6,HX('#e8a020',.35*a));g0.addColorStop(1,HX('#f0b020',.55*a));ctx.fillStyle=g0;ctx.fillRect(sx-w*.62,sy-h,w*1.24,h);
    ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(0,sy-h,0,sy);g.addColorStop(0,HX('#fff2b0',0));g.addColorStop(.55,HX('#ffd860',.5*a));g.addColorStop(1,HX('#fff6d0',.85*a));ctx.fillStyle=g;ctx.fillRect(sx-w/2,sy-h,w,h);
    ctx.fillStyle=HX('#ffffff',.55*a);ctx.fillRect(sx-w*.13,sy-h,w*.26,h);ctx.globalCompositeOperation='source-over';
    for(let i=0;i<6;i++){const yy=sy-((k*220+i*50)%h);star4(sx+Math.sin(i*2.1+k*6)*w*.7,yy,6,'#ffd860',a*.95,k*4+i);}ctx.restore();},
  gateRing(k){const a=1-k;groundDisc(this.x,this.y,90*eOut(k),'#e8a020',.3*a);groundRing(this.x,this.y,14+80*eOut(k),5*(1-k*.6),'#ffc83a',a);},
  obs(k){const e=this.e;if(!e)return;const [sx,sy]=P(e.x,e.y,bodyZ(e));const a=1-k*k;ctx.save();ctx.translate(sx,sy);halo(0,0,30,a);
    for(let i=-1;i<=1;i++){const L=12*eOut(Math.min(1,k*5));ctx.save();ctx.translate(i*8,0);ctx.rotate(-.95);slash(L,4.4,'#d0182a','#ffd0d0',a,`rgba(30,4,12,${.75*a})`);ctx.restore();}ctx.restore();},
  drop(k){const e=this.e;if(!e)return;const z=bodyZ(e)*(1-k*k);const [sx,sy]=P(e.x+(this.dx||0),e.y,z);drop(sx,sy,4,'#c8101e',1-k*.5);},
  coil(k){const a=1-k*k;const [sx,sy]=P(this.x,this.y);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);ctx.lineCap='round';
    const R=14+34*eOut(k);const sp=()=>{ctx.beginPath();for(let i=0;i<=40;i++){const t=i/40,an=t*TAU*1.6+k*3,r=R*(.25+.75*t);i?ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r):ctx.moveTo(Math.cos(an)*r,Math.sin(an)*r);}};
    sp();ctx.strokeStyle=`rgba(8,40,16,${.55*a})`;ctx.lineWidth=7*(1-k*.5);ctx.stroke();ctx.strokeStyle=HX('#29b54a',a);ctx.lineWidth=4.4*(1-k*.5);ctx.stroke();ctx.strokeStyle=HX('#d8ffd8',.8*a);ctx.lineWidth=1.3;ctx.stroke();
    const an=TAU*1.6+k*3,hx=Math.cos(an)*R,hy=Math.sin(an)*R;ctx.fillStyle=HX('#1f8a3a',a);ctx.beginPath();ctx.ellipse(hx,hy,5,3.6,an+Math.PI/2,0,TAU);ctx.fill();ctx.restore();},
  sunFull(k){const a=1-k;const [sx,sy]=P(player.x,player.y,headZ()+6);ctx.save();ctx.lineCap='round';for(let i=0;i<10;i++){const an=i/10*TAU,r0=8+30*k,r1=16+44*k;
      ctx.strokeStyle=HX('#7a3a04',.6*a);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx+Math.cos(an)*r0,sy+Math.sin(an)*r0);ctx.lineTo(sx+Math.cos(an)*r1,sy+Math.sin(an)*r1);ctx.stroke();ctx.strokeStyle=HX('#ffb81c',a);ctx.lineWidth=2.2;ctx.stroke();}ctx.restore();},
  aegisOn(k){const a=1-k;const [sx,sy]=P(player.x,player.y,34);ctx.save();ctx.strokeStyle=HX('#8a5a10',.6*a);ctx.lineWidth=6*(1-k);ctx.beginPath();ctx.ellipse(sx,sy,30+16*k,40+18*k,0,0,TAU);ctx.stroke();
    ctx.strokeStyle=HX('#ffd860',a);ctx.lineWidth=3.4*(1-k);ctx.stroke();ctx.restore();},
  heroOn(k){const a=1-k;const [sx,sy]=P(player.x,player.y,40);ctx.save();for(let i=0;i<8;i++){const an=i/8*TAU,r=10+40*eOut(k);star4(sx+Math.cos(an)*r,sy+Math.sin(an)*r*.7,6,'#ffcf3a',a,an);}ctx.restore();},
  heroUse(k){const a=1-k;const [sx,sy]=P(player.x,player.y,44);star4(sx,sy,28*eOut(Math.min(1,k*3)),'#ffcf3a',a,k*2);},
  raOn(k){const a=k<.3?k/.3:1-(k-.3)/.7;const [sx,sy]=P(player.x,player.y,headZ()+16);eye(sx,sy,10+8*(1-k),a,Math.min(1,k*3));},
  raUse(k){const a=1-k;const [sx,sy]=P(player.x,player.y,headZ()+16);ctx.save();ctx.lineCap='round';for(let i=0;i<8;i++){const an=i/8*TAU,r0=12,r1=18+40*k;
      ctx.strokeStyle=HX('#6a3a08',.6*a);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx+Math.cos(an)*r0,sy+Math.sin(an)*r0);ctx.lineTo(sx+Math.cos(an)*r1,sy+Math.sin(an)*r1);ctx.stroke();ctx.strokeStyle=HX('#ffcf3a',a);ctx.lineWidth=2.2;ctx.stroke();}ctx.restore();eye(sx,sy,12+10*k,a);},
  sand(k){const e=this.e,ex=e?e.x:this.x,ey=e?e.y:this.y;const z0=e?bodyZ(e):30,z1=60;ctx.save();
    for(let i=0;i<6;i++){const t=Math.max(0,Math.min(1,k*1.3-i*.06)),mx=(ex+player.x)/2,my=(ey+player.y)/2,lift=40;
      const x=(1-t)*(1-t)*ex+2*(1-t)*t*mx+t*t*player.x,y=(1-t)*(1-t)*ey+2*(1-t)*t*my+t*t*player.y,z=(1-t)*(1-t)*z0+2*(1-t)*t*(z1+lift)+t*t*z1;const [sx,sy]=P(x,y,z),al=.95*(1-t*.5),s=3.6-i*.3;
      ctx.beginPath();ctx.moveTo(sx,sy-s);ctx.lineTo(sx+s*.7,sy);ctx.lineTo(sx,sy+s);ctx.lineTo(sx-s*.7,sy);ctx.closePath();ctx.strokeStyle=HX('#5a3a08',.7*al);ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle=HX('#e8b040',al);ctx.fill();}ctx.restore();},
  iaido(k){const e=this.e;if(!e)return;const [sx,sy]=P(e.x,e.y,bodyZ(e));const a=1-k*k,L=58*eOut(Math.min(1,k*5));ctx.save();ctx.translate(sx,sy);ctx.rotate(-.18);
    slash(L,5.4*a+1,'#5ac8ff','#ffffff',a,`rgba(8,16,34,${.7*a})`);ctx.restore();},
  ninja(k){const a=1-k;ctx.save();for(let i=0;i<4;i++){const an=i/4*TAU+.6,r=10+22*k;const [sx,sy]=P(this.x+Math.cos(an)*r,this.y+Math.sin(an)*r,26+i*8);
      const g=ctx.createRadialGradient(sx,sy,0,sx,sy,14+10*k);g.addColorStop(0,`rgba(60,30,90,${.55*a})`);g.addColorStop(1,'rgba(60,30,90,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,14+10*k,0,TAU);ctx.fill();}ctx.restore();},
  ninjaCut(k){const e=this.e;if(!e)return;const [sx,sy]=P(e.x,e.y,bodyZ(e));const a=1-k;ctx.save();ctx.translate(sx,sy);ctx.lineCap='round';
    ctx.strokeStyle=`rgba(20,8,34,${.6*a})`;ctx.lineWidth=7*(1-k*.4);ctx.beginPath();ctx.arc(0,0,24,-2.4+k*1.2,-.4+k*1.2);ctx.stroke();ctx.strokeStyle=HX('#9a5aff',a);ctx.lineWidth=4*(1-k*.5);ctx.stroke();ctx.strokeStyle=HX('#ffffff',.9*a);ctx.lineWidth=1.3;ctx.stroke();ctx.restore();},
  leafOn(k){const a=1-k;const [sx,sy]=P(player.x,player.y,30);ctx.save();for(let i=0;i<8;i++){const an=i/8*TAU+k*4,r=14+36*k;leafShape(sx+Math.cos(an)*r,sy+Math.sin(an)*r*.6,6,an+k*6,'#3cbf4a',a);}ctx.restore();},
  leafHit(k){const e=this.e;if(!e)return;const a=1-k;const [sx,sy]=P(e.x,e.y,bodyZ(e));ctx.save();for(let i=0;i<6;i++){const an=i/6*TAU+.3,r=6+30*eOut(k);leafShape(sx+Math.cos(an)*r,sy+Math.sin(an)*r*.7,6,an*2+k*8,'#4ccf5a',a);}ctx.restore();}};
const GROUND={rune:1,gateRing:1,coil:1};
class SealFx{constructor(o){Object.assign(this,{t:0,life:.5,layer:'top'},o);}update(dt){this.t+=dt;return this.t<this.life;}draw(){const k=Math.min(1,this.t/this.life);try{DRAW[this.kind].call(this,k);}catch(e){}}}
const LIFE={rune:.45,runeFlash:.28,gate:1.3,gateRing:.7,obs:.32,drop:.45,coil:.6,sunFull:.5,aegisOn:.4,heroOn:.6,heroUse:.35,raOn:.7,raUse:.45,sand:.5,iaido:.24,ninja:.45,ninjaCut:.3,leafOn:.55,leafHit:.4};
function fxAt(kind,x,y,o){try{const ext=Object.assign({kind,x,y,life:LIFE[kind]||.5,layer:GROUND[kind]?'ground':'top'},o||{});if(kind==='drop')ext.dx=(Math.random()-.5)*10;addFx(new SealFx(ext));
  if(kind==='rune')addFx(new SealFx({kind:'runeFlash',x,y,life:LIFE.runeFlash,layer:'top'}));if(kind==='gate')addFx(new SealFx({kind:'gateRing',x,y,life:LIFE.gateRing,layer:'ground'}));}catch(e){}}
/* persistent pieces while a power is on: ground (feet) + top (body / above the head) */
class SealAura{constructor(layer){this.layer=layer;this.t=0;}update(dt){this.t+=dt;return !!POW;}
  draw(){if(!POW)return;const k=POW.k,t=this.t,px=player.x,py=player.y;try{
    if(this.layer==='ground'){
      if(k==='blood'&&player.hp>0&&player.hp<player.maxHp*.5){const p=.5+.5*Math.sin(t*6);groundDisc(px,py,44,'#c01020',.16+.08*p);groundRing(px,py,30+3*p,3,'#e8202a',.6+.3*p);}
      if(k==='coil'&&gameTime<ST.coilT){const [sx,sy]=P(px,py);ctx.save();ctx.translate(sx,sy);ctx.scale(1,K);ctx.setLineDash([9,7]);ctx.lineDashOffset=-t*40;ctx.strokeStyle='rgba(8,40,16,.4)';ctx.lineWidth=4.5;ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.stroke();ctx.strokeStyle=HX('#29b54a',.85);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}
      if(k==='hero'&&ST.heroReady){groundDisc(px,py,44,'#e8a020',.18+.06*Math.sin(t*5));groundRing(px,py,32,2.2,'#ffc83a',.7);}
      if(gameTime<ST.gateUntil)groundRing(px,py,32,3,'#ffc83a',.6+.3*Math.sin(t*10));}
    else{
      if(k==='sun'&&(ST.sun>0||ST.sunFree)){const n=ST.sunFree?5:ST.sun;const [sx,sy]=P(px,py,headZ()+4);ctx.save();ctx.globalCompositeOperation='lighter';
        ctx.globalCompositeOperation='source-over';for(let i=0;i<n;i++){const an=t*1.6+i/Math.max(1,n)*TAU,x=sx+Math.cos(an)*17,y=sy+Math.sin(an)*6;
          for(let j=0;j<8;j++){const b=j/8*TAU+t;ctx.strokeStyle='rgba(122,58,4,.7)';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+Math.cos(b)*4,y+Math.sin(b)*4);ctx.lineTo(x+Math.cos(b)*7.5,y+Math.sin(b)*7.5);ctx.stroke();ctx.strokeStyle='#ffb81c';ctx.lineWidth=1.3;ctx.stroke();}
          ctx.fillStyle='#ffcf3a';ctx.strokeStyle='rgba(122,58,4,.8)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#fff6d0';ctx.beginPath();ctx.arc(x-1,y-1,1.4,0,TAU);ctx.fill();}
        if(ST.sunFree){ctx.strokeStyle='rgba(122,58,4,.5)';ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(sx,sy,22,8.5,0,0,TAU);ctx.stroke();ctx.strokeStyle='#ffcf3a';ctx.lineWidth=1.8;ctx.stroke();}ctx.restore();}
      if(k==='aegis'&&ST.shield>0&&gameTime<ST.shieldT){const fr=Math.min(1,ST.shield/ST.shieldMax),[sx,sy]=P(px,py,34);ctx.save();ctx.globalCompositeOperation='lighter';
        const g=ctx.createRadialGradient(sx,sy-8,4,sx,sy,44);g.addColorStop(0,HX('#fff4c8',0));g.addColorStop(.75,HX('#ffd860',.1+.12*fr));g.addColorStop(1,HX('#ffe9a0',.35*fr));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,sy,32,42,0,0,TAU);ctx.fill();
        ctx.strokeStyle=HX('#fff0b0',.45+.35*fr);ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(sx,sy,32,42,0,0,TAU);ctx.stroke();ctx.strokeStyle=HX('#ffffff',.5*fr);ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(sx,sy,26,36,0,-2.6,-1.6);ctx.stroke();ctx.restore();}
      if(k==='phalanx'&&ST.phN>0){ctx.save();ctx.globalCompositeOperation='source-over';for(let i=0;i<ST.phN;i++){const an=t*.8+i/ST.phN*TAU,[sx,sy]=P(px+Math.cos(an)*30,py+Math.sin(an)*30,18);shieldShape(sx,sy,8,.9,Math.cos(an)*.3);}ctx.restore();}
      if(k==='hero'&&ST.heroReady){const [sx,sy]=P(px,py,0);ctx.save();for(let i=0;i<4;i++){const ph=(t*.8+i/4)%1,an=i*1.7+t;star4(sx+Math.cos(an)*20,sy-20-ph*70,5.5,'#ffcf3a',.95*(1-ph),t*3+i);}ctx.restore();}
      if(k==='ra'&&ST.raReady){const [sx,sy]=P(px,py,headZ()+16+Math.sin(t*3)*2);eye(sx,sy,11,.85+.15*Math.sin(t*5));}
      if(k==='leaf'&&ST.leaf>0&&gameTime<ST.leafT){const [sx,sy]=P(px,py,36);ctx.save();const n=ST.leaf*2;for(let i=0;i<n;i++){const an=t*3+i/n*TAU;leafShape(sx+Math.cos(an)*24,sy+Math.sin(an)*9,6,an+Math.PI/2,'#3cbf4a',.95);}ctx.restore();}
      if(k==='curse'&&CURSED.size){for(const e of CURSED){if(e.dead||!(e._curse>0))continue;const n=e._curse,[sx,sy]=P(e.x,e.y,((typeof MSPR_H==='function'?MSPR_H(e):50)||50)+16+(e.z||0));for(let i=0;i<n;i++)ankh(sx+(i-(n-1)/2)*12,sy+Math.sin(t*4+i)*1.5,9,n>=3?1:.8);}}
      if(gameTime<ST.gateUntil){const [sx,sy]=P(px,py,40),a=.55+.3*Math.sin(t*12);ctx.save();ctx.strokeStyle=HX('#8a5a10',.5*a);ctx.lineWidth=4.5;ctx.beginPath();ctx.ellipse(sx,sy,28,46,0,0,TAU);ctx.stroke();ctx.strokeStyle=HX('#ffd860',a);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}}
  }catch(e){}}}
const AUG=new SealAura('ground'),AUT=new SealAura('top');

/* ---------------- equipment window: seal panel ---------------- */
let SEL=null;
const css=document.createElement('style');css.textContent=`
#eqw .sealp{margin-top:8px;border-top:2px dashed rgba(122,74,33,.22);padding-top:6px;font:600 11.5px/1.45 Mali,sans-serif;color:#5a3a1f}
#eqw .sealp .sh{display:flex;align-items:center;gap:6px;font:800 13px Mali,sans-serif;color:#7a3a12}#eqw .sealp .sh small{font:600 10.5px Mali,sans-serif;color:#9a7a5a}
#eqw .sealp .chips{display:flex;gap:4px;flex-wrap:wrap;margin:5px 0 4px}
#eqw .sealp .lc{display:inline-flex;align-items:center;gap:3px;padding:2px 8px 2px 3px;border-radius:13px;border:1.5px solid rgba(122,74,33,.22);background:#fffaf0;cursor:pointer;font:700 11px Mali,sans-serif;color:#6a4a2a}
#eqw .sealp .lc .n{color:#a08a6a;font-weight:800}#eqw .sealp .lc.on{border-color:#e0a030;background:#fff3d0}#eqw .sealp .lc.full .n{color:#2a9a28}
#eqw .sealp .lc.sel{box-shadow:0 0 0 2px #f5a623 inset}
#eqw .sealp .bl{margin:1px 0}#eqw .sealp .bl b{color:#7a3a12}#eqw .sealp .hint{color:#9a7a5a;font-size:10.5px}
#eqw .sealp .pw{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}
#eqw .sealp .pc{border:1.5px solid rgba(122,74,33,.2);border-radius:9px;background:#fff;padding:5px 6px 5px;cursor:pointer;font:600 10.5px/1.38 Mali,sans-serif;color:#6a4a2a;position:relative}
#eqw .sealp .pc b{display:block;font:800 11.5px Mali,sans-serif;color:#7a3a12;padding-right:44px}#eqw .sealp .pc i{display:block;font-style:normal;color:#a08060;font-size:9.5px}
#eqw .sealp .pc.act{border-color:#2a9a28;background:#eefbe8;box-shadow:0 0 0 1px #2a9a28 inset}#eqw .sealp .pc.pick{border-color:#e0a030}
#eqw .sealp .pc.lock{background:#f3ede2;color:#8a7a6a}#eqw .sealp .pc.lock b{color:#8a6a4a}
#eqw .sealp .pc .st{position:absolute;right:5px;top:4px;font:800 9.5px Mali,sans-serif;color:#2a9a28}#eqw .sealp .pc.lock .st{color:#a0602a}
#eqw .sealp svg.sbadge{flex:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}
@media (max-width:640px){#eqw .sealp .pw{grid-template-columns:1fr}}
#smw .slands{display:flex;flex-direction:column;gap:3px;margin:6px 0}
#smw .sland{display:flex;gap:6px;align-items:center;border:1.5px solid rgba(122,74,33,.2);border-radius:9px;background:#fffdf6;padding:3px 6px;cursor:pointer;font:600 10.5px/1.35 Mali,sans-serif;color:#6a4a2a}
#smw .sland b{color:#7a3a12;font-size:11.5px}#smw .sland .cur{margin-left:auto;font:800 9.5px Mali;color:#2a9a28;white-space:nowrap}
#smw .sland.sel{border-color:#f5a623;background:#fff4d6;box-shadow:0 0 0 1px #f5a623 inset}#smw .sland.cur0{opacity:.75}
#smw .sealpick{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:6px 0;font:700 11px Mali,sans-serif;color:#7a3a12}
#smw .sealpick button{padding:1px;border-radius:50%;border:2px solid transparent;background:none;cursor:pointer;line-height:0}#smw .sealpick button.on{border-color:#f5a623;background:#fff3d0}
#smw .sealpick small{color:#9a7a5a;font-weight:600}
.ro-grid .c>span.slic{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}`;
document.head.appendChild(css);
const inTown=()=>isTest()||!!AF.townHere();
function panelHtml(){const C=countSeals(),F=window.__SEAL_FORCE;if(F&&LANDS[F.land])C[F.land]={n:4,S:F.S||90};
  if(!SEL||!LANDS[SEL]){let best='vik',bn=-1;for(const l of LK){const n=(C[l]&&C[l].n)||0;if(n>bn){bn=n;best=l;}}SEL=best;}
  const chips=LK.map(l=>{const n=(C[l]&&C[l].n)||0;return `<span class="lc${n>=2?' on':''}${n>=4?' full':''}${l===SEL?' sel':''}" data-sl="${l}" title="ตรา${LANDS[l].n} (${LANDS[l].realm})">${badge(l,18)}${LANDS[l].n} <span class="n">${n}/4</span></span>`;}).join('');
  const lines=[];for(const l of LK){const o=C[l];if(o&&o.n>=2)lines.push(`<div class="bl">✓ <b>2 ตรา${LANDS[l].n}</b>: ${LANDS[l].pair.map(k=>STN[k]+' +'+pairV(o.S)).join(' · ')}${o.n>=4?` · <b>4 ตรา</b>: ${POW&&POW.l===l?'<span style="color:#2a9a28">'+LANDS[l].P[POW.i].n+'</span>':'<span style="color:#c0602a">ยังไม่ได้เลือกพลัง ↓</span>'}`:''}</div>`);}
  const L=LANDS[SEL],o=C[SEL],n=(o&&o.n)||0,S=o?o.S:Math.max(1,PS.lv),pick=SD.p[SEL],free=!isTest()&&nUnl(SEL)===0;
  const cards=L.P.map((p,i)=>{const u=unl(SEL,i),act=!!(POW&&POW.l===SEL&&POW.i===i),pk=pick===i;
    const st=act?'✓ ใช้อยู่':!u?(free?'เลือกฟรี':'🔒 ผลึก×1'):pk?'เลือกไว้':'';
    return `<div class="pc${act?' act':''}${!u?' lock':''}${pk&&!act?' pick':''}" data-pw="${i}"><span class="st">${st}</span><b>${p.n}</b><i>${p.tag}</i>${p.d(S)}</div>`;}).join('');
  const note=n>=4?(pick>=0&&unl(SEL,pick)?'':'<span style="color:#c0602a">ครบ 4 ตรา — แตะพลังที่ต้องการ</span>'):`ใส่ตรา${L.n}ครบ 4 ชิ้นเพื่อใช้พลัง (ตอนนี้ ${n}/4) · ค่าที่เห็นคิดจากเลเวลของ${o?'ตราที่ใส่':'ตัวละคร'}`;
  return `<div class="sh">${badge(SEL,20)} ตราโทเท็ม <small>อาวุธ · หมวก · ชุด · รองเท้า · เปลี่ยนตราที่ช่าง (B) แท็บ ตรา</small></div><div class="chips">${chips}</div>
    ${lines.join('')||'<div class="hint">ตราแดนเดียวกัน 2 ชิ้น = สเตตัสคู่ของแดน · 4 ชิ้น = พลังเลือกได้ 1 ใน 3</div>'}
    <div class="bl" style="margin-top:4px"><b>ตรา${L.n}</b> (${L.realm}) · 2 ตรา: ${L.pair.map(k=>STN[k]).join(' + ')} · 4 ตรา เลือกพลัง 1 แบบ${isTest()?'':' · แบบแรกฟรี แบบที่เหลือใช้ผลึกตรา'+L.n+' · เปลี่ยนพลังได้ในเมือง'}</div>
    <div class="pw">${cards}</div>${note?`<div class="hint" style="margin-top:3px">${note}</div>`:''}`;}
function pickPower(i){const l=SEL,L=LANDS[l];if(!L)return;const p=L.P[i];
  if(!unl(l,i)){if(nUnl(l)===0){grant(l,i);SD.p[l]=i;}
    else{const cid='trait_'+l;if(!AF.has(cid,1)){msg(`ต้องใช้ผลึกตรา${L.n} 1 ก้อน (ดรอปจากมอนแดน${L.realm} ดันเจี้ยนบ่อยกว่า · ตลาดกลาง)`);return;}
      if(!confirm(`ใช้ผลึกตรา${L.n} 1 ก้อน ปลดพลัง "${p.n}"?`))return;AF.add(cid,-1);grant(l,i);if(inTown())SD.p[l]=i;else msg('ปลดแล้ว · เปลี่ยนมาใช้ได้เมื่ออยู่ในเมือง');}}
  else if(SD.p[l]!==i){if(!inTown()&&SD.p[l]>=0){msg('เปลี่ยนพลังตราได้เฉพาะในเมือง');return;}SD.p[l]=i;}
  sv();applyStats();try{chatLog('sys',`🔱 ตรา${L.n}: พลัง <b>${p.n}</b>`);}catch(e){}}
{const _be=buildEquip;buildEquip=function(){_be();const w=document.getElementById('eqw');if(!w||!w.classList.contains('open'))return;const bd=w.querySelector('.bd');if(!bd)return;
  const d=document.createElement('div');d.className='sealp';d.innerHTML=panelHtml();bd.appendChild(d);
  d.querySelectorAll('[data-sl]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();SEL=b.dataset.sl;buildEquip();});
  d.querySelectorAll('[data-pw]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();pickPower(+b.dataset.pw);});};}
/* seal badge on item icons (bag, equipment, smith, market) */
{const _ii=itemIcon;itemIcon=function(it,sz=24){const h=_ii(it,sz);if(!it||!LANDS[it.seal]||sz<18)return h;const b=Math.round(Math.max(10,sz*.44)),o=-Math.round(b*.18);
  return `<span class="slic" style="position:relative;display:inline-block;width:${sz}px;height:${sz}px;line-height:0;vertical-align:middle">${h}<span style="position:absolute;left:${o}px;bottom:${o}px;width:${b}px;height:${b}px;pointer-events:none">${badge(it.seal,b)}</span></span>`;};}   /* bottom-left: refine numbers sit bottom-right, 'E' top-left */

/* ---------------- API for items.js (smith, item card) + tests ---------------- */
window.SEALS={LANDS,badge,badgeURI,countSeals,get POW(){return POW;},get ST(){return ST;},SD,
  name:l=>LANDS[l]?LANDS[l].n:'',
  itemLine(it){if(!it)return '';if(!LANDS[it.seal])return SL4.includes(it.slot)?'<span style="color:#9a7a5a">ยังไม่มีตรา — ประทับที่ช่าง (B) แท็บ ตรา</span>':'';
    const L=LANDS[it.seal],C=countSeals(),n=(C[it.seal]&&C[it.seal].n)||0,on=x=>n>=x?'color:#2a9a28;font-weight:700':'color:#8a94a8';
    return `<span style="display:inline-flex;align-items:center;gap:3px;vertical-align:middle">${badge(it.seal,16)}<b style="color:#7a3a12">ตรา${L.n}</b></span> (${L.realm}) · สวมอยู่ ${n}/4<br><span style="${on(2)}">2 ตรา: ${L.pair.map(k=>STN[k]).join(' + ')}</span> · <span style="${on(4)}">4 ตรา: ${L.P.map(p=>p.n).join(' / ')}</span>`;},
  setText(l){const L=LANDS[l];if(!L)return '';return `<b style="color:#c2541c">ตรา${L.n}</b> 2 ชิ้น: ${L.pair.map(k=>STN[k]).join(' + ')} · 4 ชิ้น เลือกพลัง: ${L.P.map(p=>p.n).join(' / ')}`;},
  landRow(l,s){const L=LANDS[l];return `<div class="sland${s.sel?' sel':''}" data-sto="${l}">${badge(l,30)}<div><b>ตรา${L.n}</b> <small>(${L.realm})</small><br>2 ตรา: ${L.pair.map(k=>STN[k]).join(' + ')} · 4 ตรา: ${L.P.map(p=>p.n).join(' / ')}</div>${s.cur?'<span class="cur">✓ ตราตอนนี้</span>':''}</div>`;},
  stamp(id){try{const it=ITEMS[id];if(!it)return;const isEq=Object.values(EQ).includes(id);if(isEq)setTimeout(()=>{try{fxAt('heroOn',player.x,player.y);}catch(e){}},50);}catch(e){}},
  force(land,p,S=90,n=4){window.__SEAL_FORCE=land?{land,p,S,n}:null;applyStats();return POW;},
  test:{rune,bleed,ninja,gate,fxAt}};
})();
