/* =====================================================================
   RING OF TOTEM SHARDS (วงเศษโทเท็ม) — the advanced runes, like ROM's Rune Box. Owner 2026-11-23: '3แบบแนะนำ' (a spirit rune works in
   tiers by how many of its 3 linked small runes match its colours) · '4แนะนำ' (a circle round the totem stump) · '5ทำไรก่อนก็ได้ให้เสร็จ'.
   Tables: rune_data.js (RUNEDATA). Rules: RUNE_SYSTEM_TH.md §4.
   • 6 big sockets (spirit runes, abilities for the whole kit) + 12 small (carved runes, RO-style stats). Big i links small e(i−1), e(i), i(i);
     the e sockets sit between two big ones and count for both (the colour puzzle). Opened in pairs at Lv 30 / 40 / 50.
   • A spirit rune wants 3 colours; matched lines 1 / 2 / 3 = tier I / II / III (×0.5 / ×0.75 / ×1) × grade B / A / S (×0.6 / ×0.8 / ×1).
     No duplicates of one kind on the ring. Numbers are flat / counters by hero level (rule 2): damage is absolute, never ×ATK.
   • Small sockets have a LEVEL 1–10 (fed with carved runes + zeny); the rune in it can be swapped without losing the level.
   • Read a raw rune stone with a shaman feather = random spirit rune of its grade · smelt 5 of one grade (+ zeny) = 1 random of that
     grade (10 %: one grade up) + 1 spirit dust · 10 dust = smelt into the kind you pick · carved-rune pouches open into a random carved rune.
   • Hooks: gearCalc (carved stats, Pack Instinct ATK), hurt (flat adds in ENH_FLAT units, Night Eye DEF cut via o._msCut, Hawk Eye crit
     via D.crit), castSkillNow (counters), addBuff (buff casts), applyCC (+s), onKill, ENH_ABSORB (shield, cut, dodge, hibernation),
     updEnemies ticker (walking / dash detection, spirit wolves, queued strikes, buff-bar icons). window.__RING_OFF = all off (bench).
   • Spirit animals show when a rune fires (code SVG art from rune_data.js until painted art: RUNE_ART_PROMPTS_TH.md).
   ===================================================================== */
(function(){
const RU=window.RUNEDATA;if(!RU||typeof SKILLS==='undefined'||!window.AFItems)return;
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
const HERO=G('CHAR')||'wolf',AF=window.AFItems,TEST=()=>AF.MODE!=='play',OFF=()=>!!window.__RING_OFF;
const SKEY='af_ring_'+HERO+(AF.MODE==='play'?'_play':'');
const PLV=()=>{const P=G('PS');return (P&&P.lv)||1;};
const bagN=id=>AF.BAG[id]||0,bagAdd=(id,n)=>AF.bagAdd(id,n),bagSave=()=>AF.save(),zeny=()=>AF.zeny,payZ=z=>{if(AF.zeny<z)return false;AF.zeny=AF.zeny-z;return true;};
const fmt=n=>Math.round(n).toLocaleString('en-US'),eIcon=(id,sz)=>{try{return AF.ui.etcIcon(id,sz);}catch(e){return '';}};
const say=t=>{try{msg(t);}catch(e){}},chat=t=>{try{chatLog('sys',t);}catch(e){}};
const SM=['e0','e1','e2','e3','e4','e5','i0','i1','i2','i3','i4','i5'];
const ETC=AF.ETC,SRK=RU.SRK,CRK=RU.CRK,GR=RU.GRADE;
/* ---------------- save ---------------- */
function fresh(){return {v:1,big:[null,null,null,null,null,null],small:{},slv:{},tg:0,seen:0};}
function load(){let d=null;try{d=JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){}return d&&d.v===1?d:null;}
let S=load()||fresh();if(!Array.isArray(S.big))S.big=[null,null,null,null,null,null];S.small=S.small||{};S.slv=S.slv||{};
const save=()=>{try{localStorage.setItem(SKEY,JSON.stringify(S));}catch(e){}};
const bigOpen=i=>TEST()||PLV()>=RU.RING.open[i],smOpen=id=>TEST()||PLV()>=RU.RING.smallOpen(id),slv=id=>Math.max(1,Math.min(10,S.slv[id]||1));
/* test mode: a full set of runes and goods to try, once */
if(TEST()&&!S.tg){for(const r of RU.SR){for(const [g,n] of [[0,2],[1,1],[2,1]]){const id=`sr_${r.k}_${g}`;if(bagN(id)<n)AF.add(id,n-bagN(id));}}
  for(const r of RU.CR)if(bagN(r.k)<6)AF.add(r.k,6-bagN(r.k));
  for(const [id,n] of [['rstone0',10],['rstone1',6],['rstone2',3],['rfeather',20],['rbag',20],['sdust',10]])if(bagN(id)<n)AF.add(id,n-bagN(id));
  bagSave();S.tg=1;save();}
/* ---------------- matching ---------------- */
function match(i){const id=S.big[i],E=id&&ETC[id];if(!E||!bigOpen(i))return null;const r=SRK[E.sr];if(!r)return null;
  const L=RU.RING.links(i),pres=L.filter(s=>smOpen(s)&&S.small[s]&&CRK[S.small[s]]).map(s=>CRK[S.small[s]].c),left=pres.slice(),req=r.req.split(''),ok=req.map(()=>0);let t=0;
  req.forEach((c,q)=>{if(c==='*')return;const j=left.indexOf(c);if(j>=0){left.splice(j,1);ok[q]=1;t++;}});
  req.forEach((c,q)=>{if(c==='*'&&left.length){left.pop();ok[q]=1;t++;}});
  const m=GR[E.grade].m*RU.TIERM[t],L60=PLV();return {i,id,k:r.k,r,g:E.grade,t,ok,m,v:r.v(L60,m,E.grade,t)};}
let A={},ASIG='';
const ANY=()=>!OFF()&&Object.keys(A).length>0;
function recalc(){const a={};for(let i=0;i<6;i++){const M=match(i);if(M&&M.t>0)a[M.k]=M;}A=a;const sg=JSON.stringify([Object.keys(a).map(k=>[k,a[k].t,a[k].g]),S.small,S.slv,OFF(),PLV()]);
  if(sg!==ASIG){ASIG=sg;DIRTY=true;}}
/* ---------------- runtime state ---------------- */
const RS={hitN:0,sh:0,shT:0,shMax:1,sleepT:-999,owlN:0,owlArm:false,buffN:0,buffTok:null,moonArm:false,moonTok:null,packStk:0,packT:0,packTok:null,packSet:null,packDone:false,
  kills:0,wolves:[],walkT:0,swoopArm:false,swoopTok:null,swoopUsed:false,tbN:0,tbStk:0,chTok:null,chAdd:0,flowN:0,diveTok:null,lastFight:-99,featherN:0,q:[],lastTgt:null,px:0,py:0,waveFx:false};
let DIRTY=true;
const now=()=>G('gameTime')||0;
const isUlt=k=>{const s=SKILLS[k];return !!(s&&(s.ult||/ULTIMATE/.test(s.th||'')));};
const hasStatus=e=>{const s=e.st||{};for(const k in s)if(s[k]>0&&k!=='stagger'&&k!=='air')return true;return !!(e._gBurn||e._sb);};
function rDmg(e,raw,noDef,label,col){if(!e||e.dead)return 0;const d=Math.max(1,Math.round(noDef?raw:defAdjust(raw,(e.m&&e.m.def)||0)));e.hp-=d;e.flash=1;e.aggro=Math.max(e.aggro||0,8);
  try{dmgNum(e.x,e.y,(typeof MSPR_H==='function'?MSPR_H(e):48)+18,d,'hit',{scale:.95,who:e});}catch(x){}
  if(label)try{addFx(new DText({x:e.x,y:e.y,z:70,text:label,color:col||'#ffe9a8',size:12,life:.9}));}catch(x){}if(e.hp<=0&&!e.dead)kill(e);return d;}
const near=(x,y,R)=>{let b=null,bd=R*R;for(const e of enemies){if(e.dead||e.hidden)continue;const d=(e.x-x)**2+(e.y-y)**2;if(d<bd){bd=d;b=e;}}return b;};
const txt=(t,c,z)=>{try{addFx(new DText({x:player.x,y:player.y,z:z||104,text:t,color:c||'#ffe9a8',size:11.5,life:.9}));}catch(e){}};
/* ---------------- combat hooks ---------------- */
{const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);if(OFF())return r;
  const seen={};for(const s of SM){const c=S.small[s]&&CRK[S.small[s]];if(!c||!smOpen(s))continue;seen[c.k]=(seen[c.k]||0)+1;if(seen[c.k]>RU.RING.sameMax)continue;BON[c.s]=(BON[c.s]||0)+c.v(slv(s));}   /* the 4th copy of one kind gives nothing */
  if(A.wolfPack&&RS.packStk>0&&now()<RS.packT){const v=A.wolfPack.v.atk*RS.packStk;BON.atk=(BON.atk||0)+v;BON.matk=(BON.matk||0)+v;}return r;};window.gearCalc=gearCalc;}
let RFLAT=0;{const _f=window.ENH_FLAT;window.ENH_FLAT=()=>(_f?_f():0)+RFLAT;}
{const _h=hurt;window.hurt=hurt=function(e,mult,o){o=o||{};if(!ANY()||!e||e.dead||o.dot||o.ring)return _h(e,mult,o);
  RS.lastFight=now();RS.lastTgt=e;const a=player.action,sk=!o.auto&&a&&a.skill?a:null;let abs=0,cut=0,crit=0;
  if(A.wolfHunt&&sk&&hasStatus(e))abs+=A.wolfHunt.v.add;
  if(A.tbCharge&&sk&&RS.chTok===sk&&RS.chN<4){abs+=RS.chAdd;RS.chN++;}
  if(A.eagleSwoop&&sk&&RS.swoopTok===sk&&!RS.swoopUsed){abs+=A.eagleSwoop.v.add;RS.swoopUsed=true;fxAt('swoop',e.x,e.y,{e});}
  if(A.owlNight&&RS.owlArm){cut+=A.owlNight.v.cut;RS.owlArm=false;fxAt('owlHit',e.x,e.y,{e});}
  if(A.eagleEye&&Math.hypot(e.x-player.x,e.y-player.y)>220)crit+=A.eagleEye.v.crit;
  if(A.wolfPack&&sk){if(RS.packTok!==sk){RS.packTok=sk;RS.packSet=new Set();RS.packDone=false;}RS.packSet.add(e);
    if(!RS.packDone&&RS.packSet.size>=3){RS.packDone=true;RS.packStk=Math.min(3,(now()<RS.packT?RS.packStk:0)+1);RS.packT=now()+5;DIRTY=true;fxAt('pack',player.x,player.y);}}
  const br=o.br||(a&&a.skill&&SKILLS[a.skill]?SKILLS[a.skill].br:'basic');let u=0;if(abs){let c=1;try{c=coefOf(br)*atkMul();}catch(x){}u=abs/Math.max(.1,(mult||1)*c);}
  const p0=o._msCut,f0=RFLAT;if(cut)o._msCut=(p0||0)+cut;RFLAT=f0+u;if(crit)D.crit+=crit;
  try{return _h(e,mult,o);}finally{RFLAT=f0;if(cut)o._msCut=p0;if(crit)D.crit-=crit;}};}
{const _c=castSkillNow;window.castSkillNow=castSkillNow=function(key,c){if(!ANY())return _c(key,c);const t=now(),idle=t-RS.lastFight,wave=A.orcaWave&&idle>=A.orcaWave.v.s;
  const ok=_c(key,c);if(!ok)return ok;const a=player.action;RS.lastFight=t;
  if(A.owlNight&&!RS.owlArm&&++RS.owlN>=4){RS.owlN=0;RS.owlArm=true;fxAt('owlArm',player.x,player.y);}
  if(A.tbWing&&++RS.tbN>=6){RS.tbN=0;const e=RS.lastTgt&&!RS.lastTgt.dead?RS.lastTgt:near(player.x,player.y,420);if(e)queue(.12,()=>{fxAt('bolt',e.x,e.y,{e,big:1});rDmg(e,A.tbWing?A.tbWing.v.dmg:0,true,'ปีกนกสายฟ้า','#9fd0ff');});}
  if(A.orcaFlow&&++RS.flowN>=5){RS.flowN=0;player.mp=Math.min(player.maxMp,player.mp+A.orcaFlow.v.sp);fxAt('flow',player.x,player.y);txt('+'+A.orcaFlow.v.sp+' SP','#8fd8ff');}
  if(A.tbRoar&&isUlt(key)){const v=A.tbRoar.v.dmg;for(let i=0;i<4;i++)queue(.25*(i+1),()=>{const e=near(player.x,player.y,300);if(e){fxAt('bolt',e.x,e.y,{e});rDmg(e,v,false,i?null:'ฟ้าคำราม','#9fd0ff');}});fxAt('roar',player.x,player.y);}
  if(A.tbCharge&&RS.tbStk>0){RS.chTok=a;RS.chN=0;RS.chAdd=A.tbCharge.v.add*RS.tbStk;RS.tbStk=0;fxAt('charge',player.x,player.y);}
  if(A.eagleSwoop&&RS.swoopArm){RS.swoopArm=false;RS.swoopTok=a;RS.swoopUsed=false;RS.walkT=0;}
  if(A.owlMoon&&RS.moonArm&&RS.moonTok!==a){RS.moonArm=false;if(player.cd[key]>0){player.cd[key]=Math.max(0,player.cd[key]-A.owlMoon.v.s);txt('−'+A.owlMoon.v.s+' วิ','#d8c8ff');}fxAt('moon',player.x,player.y);}
  if(wave&&player.cd[key]>0){player.cd[key]=0;fxAt('wave',player.x,player.y);txt('คลื่นนำ: ไม่ติดคูลดาวน์','#8fd8ff');}
  return ok;};}
{const _ab=addBuff;window.addBuff=addBuff=function(k,dur){const r=_ab(k,dur);if(ANY()&&A.owlMoon){const a=player.action;if(a&&a.skill&&a!==RS.buffTok){RS.buffTok=a;if(++RS.buffN>=3){RS.buffN=0;RS.moonArm=true;RS.moonTok=a;}}}return r;};}
{const _cc=applyCC;window.applyCC=applyCC=function(e,cc){if(cc&&ANY()&&A.owlWing){const s=A.owlWing.v.s;cc=Object.assign({},cc);if(cc.stun)cc.stun+=s;if(cc.slow)cc.slow+=s;}return _cc(e,cc);};}
{const _k=onKill;onKill=function(e){_k(e);if(!ANY())return;
  if(A.wolfHowl&&++RS.kills>=8){RS.kills=0;const t=now();RS.wolves=[0,1].map(i=>({until:t+6,cd:.3+i*.4,x:player.x+(i?-30:30),y:player.y+18,tg:null}));fxAt('howl',player.x,player.y);}
  if(A.tbCharge&&RS.tbStk<3){RS.tbStk++;fxAt('chargeUp',player.x,player.y);}};}
{const _ab=window.ENH_ABSORB;window.ENH_ABSORB=function(d){d=_ab?_ab(d):d;if(!ANY()||!(d>0))return d;const t=now();RS.lastFight=t;
  if(A.eagleFeather&&++RS.featherN>=A.eagleFeather.v.n){RS.featherN=0;fxAt('feather',player.x,player.y);txt('ขนนกลม: หลบ!','#ffe9a0');return 0;}
  if(A.bearStand&&player.action&&player.action.skill)d=Math.max(1,d-A.bearStand.v.cut);
  if(RS.sh>0&&t<RS.shT){const q=Math.min(RS.sh,d);RS.sh-=q;d-=q;if(d<=0){txt('โล่หมี','#ffd8a8',80);return 0;}}
  if(A.bearHide&&++RS.hitN>=6){RS.hitN=0;RS.sh=RS.shMax=Math.max(RS.sh,A.bearHide.v.sh);RS.shT=t+6;fxAt('bear',player.x,player.y);}
  if(A.bearSleep&&t>=RS.sleepT&&player.hp-d<A.bearSleep.v.hp){RS.sleepT=t+90;const v=A.bearSleep.v;player.hp=Math.min(player.maxHp,player.hp+v.heal);RS.sh=RS.shMax=Math.max(RS.sh,v.sh);RS.shT=t+8;
    fxAt('sleep',player.x,player.y);txt('หมีจำศีล +'+v.heal,'#bff0a8',96);}
  return d;};}
function queue(dt,fn){RS.q.push({t:now()+dt,fn});}
/* ---------------- ticker ---------------- */
function tick(dt){const t=now();if(DIRTY){DIRTY=false;try{applyStats();}catch(e){}}
  if(RS.packStk>0&&t>=RS.packT){RS.packStk=0;DIRTY=true;}
  if(RS.sh>0&&t>=RS.shT)RS.sh=0;
  if(RS.q.length){const due=RS.q.filter(q=>q.t<=t);RS.q=RS.q.filter(q=>q.t>t);for(const q of due)try{q.fn();}catch(e){}}
  const dx=player.x-RS.px,dy=player.y-RS.py,mv=Math.hypot(dx,dy);RS.px=player.x;RS.py=player.y;const sp=dt>0?mv/dt:0;
  if(A.eagleSwoop&&!RS.swoopArm){if(!player.action&&sp>40&&sp<650)RS.walkT+=dt;else if(!player.action)RS.walkT=Math.max(0,RS.walkT-dt*2);if(RS.walkT>=2){RS.swoopArm=true;fxAt('eagleArm',player.x,player.y);}}
  if(A.orcaDive&&player.action&&player.action.skill&&sp>650&&mv<420&&RS.diveTok!==player.action){RS.diveTok=player.action;const v=A.orcaDive.v.hp;player.hp=Math.min(player.maxHp,player.hp+v);fxAt('dive',player.x,player.y);txt('+'+v+' HP','#9fe8a8',90);}
  if(RS.wolves.length){const bite=A.wolfHowl?A.wolfHowl.v.bite:0;RS.wolves=RS.wolves.filter(w=>w.until>t&&bite);
    for(const w of RS.wolves){if(!w.tg||w.tg.dead||Math.hypot(w.tg.x-player.x,w.tg.y-player.y)>320)w.tg=near(player.x,player.y,300);const g=w.tg,tx=g?g.x:player.x+30,ty=g?g.y+6:player.y+18,k=Math.min(1,dt*7);
      if(Math.abs(tx-w.x)>3)w.fl=tx<w.x;w.x+=(tx-w.x)*k;w.y+=(ty-w.y)*k;w.cd-=dt;if(g&&w.cd<=0&&Math.hypot(g.x-w.x,g.y-w.y)<60){w.cd=.8;rDmg(g,bite,false);fxAt('bite',g.x,g.y,{e:g});}}}
  icons();ensureAura();}
{const _u=updEnemies;updEnemies=function(dt){_u(dt);try{tick(dt);}catch(err){if(!tick.err){tick.err=1;console.warn('ring tick',err);}}};}
/* buff bar: one icon per working spirit rune with its counter */
const ICK=new Set();
/* draw a spirit picture inside a w×h box centred on (x,y), keeping its aspect (painted pictures are not square) */
/* draw a spirit picture centred on (x,y): the code art is square (fits the w×h box); painted pictures keep their aspect and get the box's AREA, so a wide wolf is not drawn smaller than a tall bear; fl = mirror */
const artFit=(X,im,x,y,w,h,fl)=>{const iw=im.naturalWidth||1,ih=im.naturalHeight||1,k=Math.abs(iw-ih)<4?Math.min(w/iw,h/ih):Math.sqrt(w*h/(iw*ih));
  if(fl){X.save();X.translate(x,y);X.scale(-1,1);X.drawImage(im,-iw*k/2,-ih*k/2,iw*k,ih*k);X.restore();}else X.drawImage(im,x-iw*k/2,y-ih*k/2,iw*k,ih*k);};
const PIC={};function artImg(a){if(PIC[a])return PIC[a];const i=new Image();if(RU.SPIRIT_HAVE.has(a)){i.src=`assets/rune/spirit/${a}.webp`;PIC[a]=i;return i;}i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="160" height="160">${RU.ART[a]||''}</svg>`);PIC[a]=i;return i;}
const svgURI=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
function lbl(k){const t=now();switch(k){case 'bearHide':return RS.sh>0&&t<RS.shT?Math.ceil(RS.sh)+'':RS.hitN+'/6';case 'bearSleep':return t<RS.sleepT?Math.ceil(RS.sleepT-t)+'s':'พร้อม';
  case 'owlNight':return RS.owlArm?'พร้อม':RS.owlN+'/4';case 'owlMoon':return RS.moonArm?'พร้อม':RS.buffN+'/3';case 'wolfPack':return RS.packStk>0&&t<RS.packT?'×'+RS.packStk:'';
  case 'wolfHowl':return RS.wolves.length?'หมาป่า':RS.kills+'/8';case 'eagleSwoop':return RS.swoopArm?'พร้อม':RS.walkT>.2?RS.walkT.toFixed(1)+'s':'';case 'eagleFeather':return RS.featherN+'/'+(A.eagleFeather?A.eagleFeather.v.n:5);
  case 'tbWing':return RS.tbN+'/6';case 'tbCharge':return RS.tbStk?'×'+RS.tbStk:'';case 'orcaFlow':return RS.flowN+'/5';case 'orcaWave':return A.orcaWave&&t-RS.lastFight>=A.orcaWave.v.s?'พร้อม':'';default:return '';}}
function icons(){const want=new Set();if(!OFF())for(const k in A){const M=A[k],key='rn_'+k;want.add(key);
    if(!BUFFDEF[key]||BUFFDEF[key]._s!==M.t+':'+M.g){const An=RU.ANIMAL[M.r.a];BUFFDEF[key]={n:`รูนวิญญาณ${An.th} · ${M.r.th} ${GR[M.g].k} ขั้น ${RU.TIERN[M.t]} — ${M.r.d(M.v)}`,c:An.c,i:'✦',_s:M.t+':'+M.g};
      if(!window.BUFF_ART)window.BUFF_ART={};BUFF_ART[key]=RU.ICON_HAVE.has('sr_'+k)?RU.iconPath('sr_'+k):svgURI(RU.srIcon(M.r.a,M.g));}   /* painted medallion when cut, else the code stone */
    const b=player.buffs[key]||(player.buffs[key]={t:1e9,total:1e9});b.t=1e9;b.lbl=lbl(k);}
  for(const key of ICK)if(!want.has(key)&&player.buffs[key])delete player.buffs[key];ICK.clear();for(const k of want)ICK.add(k);}
/* ---------------- effects: the spirit animals show up when a rune fires ---------------- */
const KY=()=>{try{return typeof K==='number'?K:.5;}catch(e){return .5;}};
const LIFE={bear:.9,sleep:1.2,owlArm:.8,owlHit:.5,moon:.8,pack:.8,howl:1,bite:.35,swoop:.55,eagleArm:.7,feather:.7,bolt:.45,roar:.9,charge:.6,chargeUp:.5,flow:.8,dive:.7,wave:.8};
const ANI={bear:'bear',sleep:'bear',owlArm:'owl',owlHit:'owl',moon:'owl',pack:'wolf',howl:'wolf',bite:'wolf',swoop:'eagle',eagleArm:'eagle',feather:'eagle',bolt:'tbird',roar:'tbird',charge:'tbird',chargeUp:'tbird',flow:'orca',dive:'orca',wave:'orca'};
const COL={bear:'#ffb36a',owl:'#c8b0ff',wolf:'#a8c8ff',eagle:'#ffd36a',tbird:'#7fc8ff',orca:'#7fe0ff'};
class RingFx{constructor(o){Object.assign(this,{t:0,layer:'top'},o);this.life=LIFE[this.kind]||.6;}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){try{const q=Math.min(1,this.t/this.life),a=ANI[this.kind],im=artImg(a),c=COL[a],e=this.e,x0=e&&!e.dead?e.x:this.x,y0=e&&!e.dead?e.y:this.y;const X=ctx;X.save();
    const pic=(sx,sy,sz,al,rot)=>{if(!im.complete||!im.naturalWidth)return;X.globalAlpha=Math.max(0,al);X.translate(sx,sy);if(rot)X.rotate(rot);artFit(X,im,0,0,sz,sz);X.setTransform(1,0,0,1,0,0);};
    const ring=(sx,sy,r,w,al)=>{X.globalAlpha=Math.max(0,al);X.strokeStyle=c;X.lineWidth=w;X.beginPath();X.ellipse(sx,sy,r,r*KY(),0,0,7);X.stroke();};
    const glow=(sx,sy,r,al)=>{X.globalCompositeOperation='lighter';X.globalAlpha=Math.max(0,al);const g=X.createRadialGradient(sx,sy,0,sx,sy,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.arc(sx,sy,r,0,7);X.fill();X.globalCompositeOperation='source-over';};
    const k=this.kind;
    if(k==='bolt'){const [tx,ty]=P(x0,y0,40),[sx,sy]=P(x0,y0,260);X.globalCompositeOperation='lighter';for(const [w,col,al] of [[9,'#3a6ad8',.5],[4,'#9fd0ff',.9],[1.6,'#ffffff',1]]){X.globalAlpha=(1-q)*al;X.strokeStyle=col;X.lineWidth=w;X.beginPath();X.moveTo(sx,sy);
        let px=sx,py=sy;for(let i=1;i<=6;i++){const f=i/6;px=sx+(tx-sx)*f+(i<6?(Math.sin(i*7.3+this.x)*16):0);py=sy+(ty-sy)*f;X.lineTo(px,py);}X.stroke();}X.globalCompositeOperation='source-over';
      glow(tx,ty,46*(this.big?1.4:1),(1-q)*.9);pic(sx,sy-6,(this.big?92:64)*(.8+.2*q),(1-q)*.95);}
    else if(k==='swoop'){const [tx,ty]=P(x0,y0,40),sx=tx-160*(1-q),sy=ty-150*(1-q);pic(sx,sy,70,1-q*q,RU.SPIRIT_HAVE.has('eagle')?.5:-.5);glow(tx,ty,34,q<.6?q/.6:(1-q)/.4);}
    else if(k==='bite'){const [tx,ty]=P(x0,y0,36);pic(tx-18+20*q,ty-6,46,(1-q)*.95,.2);X.globalAlpha=(1-q);X.strokeStyle='#e8f0ff';X.lineWidth=2.4;for(const s of [-1,1]){X.beginPath();X.arc(tx+s*6,ty,14,s>0?2.2:0.1,s>0?3.6:1.4);X.stroke();}}
    else if(k==='owlHit'){const [tx,ty]=P(x0,y0,70);pic(tx,ty,58*(1+.3*q),1-q);ring(...P(x0,y0,0),22+40*q,3,1-q);}
    else if(k==='feather'){const [sx,sy]=P(x0,y0,50);X.fillStyle='#fff6d8';X.strokeStyle='#7a4a22';X.lineWidth=1.2;for(let i=0;i<7;i++){const an=i/7*6.28+this.x,r=12+60*q;X.globalAlpha=1-q;X.save();X.translate(sx+Math.cos(an)*r,sy+Math.sin(an)*r*.6-20*q);X.rotate(an+q*3);X.beginPath();X.ellipse(0,0,9,3.4,0,0,7);X.fill();X.stroke();X.restore();}pic(sx,sy-40,54,(1-q)*.85);}
    else{/* a spirit appears over / behind the hero */const [gx,gy]=P(x0,y0,0),[sx,sy]=P(x0,y0,108+30*q),sz=(k==='howl'||k==='roar'||k==='sleep'?96:72)*(.7+.3*Math.min(1,q*3)),al=q<.2?q/.2:(1-q)/.8;
      glow(sx,sy,sz*.75,al*.7);pic(sx,sy,sz,al*.95);ring(gx,gy,26+40*q,3,al*.9);
      if(k==='bear'||k==='sleep'){X.globalAlpha=al*.35;X.fillStyle='#c88a4a';X.beginPath();X.ellipse(gx,gy-34,34,44,0,0,7);X.fill();}
      if(k==='wave'||k==='dive'||k==='flow'){X.globalAlpha=al;X.strokeStyle='#7fe0ff';X.lineWidth=3;for(let i=0;i<3;i++){X.beginPath();X.arc(gx,gy-10,22+i*12+30*q,3.6,5.8);X.stroke();}}}
    X.restore();}catch(err){}}}
function fxAt(kind,x,y,o){try{addFx(new RingFx(Object.assign({kind,x,y},o||{})));}catch(e){}}
/* lasting looks: bear-hide shield, owl eye ready, eagle circling, charge sparks, spirit wolves */
class RingAura{constructor(){this.layer='top';this.t=0;}update(dt){this.t+=dt;return true;}
  draw(){if(!ANY())return;const t=this.t,X=ctx,HK=window.HERO_K||1;try{X.save();   /* HK: the pieces round the hero follow its size (HERO_SIZE) */
    if(RS.sh>0&&now()<RS.shT){const [sx,sy]=P(player.x,player.y,40*HK),f=Math.max(.25,RS.sh/Math.max(1,RS.shMax));X.globalAlpha=.22+.18*f;X.fillStyle='#d89a5a';X.beginPath();X.ellipse(sx,sy,34*HK,46*HK,0,0,7);X.fill();
      X.globalAlpha=.75*f+.2;X.strokeStyle='#7a4a22';X.lineWidth=2.6;X.setLineDash([6,4]);X.lineDashOffset=-t*20;X.beginPath();X.ellipse(sx,sy,34*HK,46*HK,0,0,7);X.stroke();X.setLineDash([]);}
    const head=(a,dy,sz,al,bob)=>{const im=artImg(a);if(!im.complete||!im.naturalWidth)return;const [sx,sy]=P(player.x,player.y,(118+dy)*HK+(bob?Math.sin(t*3)*4:0));X.globalAlpha=al;artFit(X,im,sx,sy,sz,sz);};
    if(A.owlNight&&RS.owlArm)head('owl',0,30,.85,1);
    if(A.eagleSwoop&&RS.swoopArm){const im=artImg('eagle');if(im.complete&&im.naturalWidth){const an=t*2.2,[sx,sy]=P(player.x+Math.cos(an)*46*HK,player.y+Math.sin(an)*20*HK,150*HK);X.globalAlpha=.85;artFit(X,im,sx,sy,34,34);}}
    if(A.tbCharge&&RS.tbStk>0){for(let i=0;i<RS.tbStk;i++){const an=t*3+i*2.09,[sx,sy]=P(player.x+Math.cos(an)*22*HK,player.y+Math.sin(an)*10*HK,70*HK);X.globalAlpha=.9;X.fillStyle='#ffd23a';X.strokeStyle='#3a1f14';X.lineWidth=1.4;
        X.beginPath();X.moveTo(sx,sy-7);X.lineTo(sx-4,sy+1);X.lineTo(sx,sy+1);X.lineTo(sx-2,sy+8);X.lineTo(sx+5,sy-1);X.lineTo(sx+1,sy-1);X.closePath();X.fill();X.stroke();}}
    if(A.wolfPack&&RS.packStk>0&&now()<RS.packT){const [gx,gy]=P(player.x,player.y,0);X.globalAlpha=.6;X.strokeStyle='#a8c8ff';X.lineWidth=2;for(let i=0;i<RS.packStk;i++){X.beginPath();X.ellipse(gx,gy,(26+i*8)*HK,(26+i*8)*HK*KY(),0,t*2+i,t*2+i+2.2);X.stroke();}}
    for(const w of RS.wolves){const im=artImg('wolf');if(!im.complete||!im.naturalWidth)continue;const [sx,sy]=P(w.x,w.y,26+Math.abs(Math.sin(t*9+w.x))*6),al=Math.min(1,(w.until-now())*2);
      X.globalAlpha=.25*al;X.fillStyle='#a8c8ff';X.beginPath();X.ellipse(sx,sy+22,18,7,0,0,7);X.fill();X.globalAlpha=.82*al;artFit(X,im,sx,sy,48,48,w.fl&&RU.SPIRIT_HAVE.has('wolf'));}
    X.restore();}catch(err){}}}
let AUR=null;function ensureAura(){if(!ANY())return;if(!AUR)AUR=new RingAura();if(!fx.includes(AUR))fx.push(AUR);}
/* ================= window ================= */
const css=`#rgw{position:fixed;inset:0;z-index:59;display:none;align-items:center;justify-content:center;background:rgba(6,4,10,.66);font-family:Mali,Sarabun,system-ui,sans-serif;color:#fff3c8}
#rgw.open{display:flex}.rgBox{width:min(1040px,98vw);height:min(660px,96vh);display:flex;flex-direction:column;background:linear-gradient(rgba(50,30,20,.97),rgba(24,14,8,.98));border:2.5px solid #e9b44c;border-radius:18px;box-shadow:0 0 0 2.5px #3a1f14,0 10px 30px rgba(0,0,0,.6);overflow:hidden}
.rgHead{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1.5px solid #6a4a2a}.rgHead h3{margin:0;font:700 21px Mali,Sarabun;color:#ffd77a;text-shadow:0 2px 0 #3a1f14}.rgHead .sub{font:500 12.5px Sarabun;color:#e8d3a8}
.rgHead button{margin-left:auto;width:38px;height:38px;border-radius:50%;background:linear-gradient(#5a3a22,#2a160a);border:2.5px solid #e9b44c;font:700 19px Mali;color:#ffe3a0;cursor:pointer}
.rgHead .rb{margin-left:0;width:auto;border-radius:16px;padding:0 10px;font:700 13px Sarabun}
.rgBody{flex:1;display:flex;min-height:0}.rgRing{position:relative;flex:none;aspect-ratio:1;height:100%;max-width:58%}
.rgRing svg.bg{position:absolute;inset:0;width:100%;height:100%}.rgS{position:absolute;transform:translate(-50%,-50%);border-radius:50%;cursor:pointer;padding:0;border:0;background:none}
.rgS.b{width:var(--bB,19%);height:var(--bB,19%)}.rgS.s{width:var(--bS,11.5%);height:var(--bS,11.5%)}.rgS .in{position:absolute;inset:0;border-radius:50%;display:flex;align-items:center;justify-content:center}
.rgS.b .in{background:radial-gradient(circle at 40% 35%,#4a3a5a,#1a1020 70%);border:3px solid #7a6a8a;box-shadow:0 0 0 2px #1a0c06,inset 0 0 12px #000}.rgS.s .in{background:radial-gradient(circle at 40% 35%,#3a3040,#140c14 70%);border:2.5px solid #6a5a6a;box-shadow:0 0 0 2px #1a0c06}
.rgS svg.ic{width:92%;height:92%}.rgRing.artB .rgS.b .in,.rgRing.artS .rgS.s .in{background:none;border-color:transparent!important;box-shadow:none}.rgRing.artB .rgS.b.sel .in,.rgRing.artS .rgS.s.sel .in{box-shadow:0 0 0 2.5px #fff3b8,0 0 18px #ffe08a!important}.rgRing.artS .rgS.s .bd{bottom:-15%}.rgRing.artB .rgS.b .bd{bottom:-7%}.rgRing.artB .rgS.b.lock .in,.rgRing.artS .rgS.s.lock .in{opacity:1}.rgRing.artB .rgS.b.lock .lk,.rgRing.artS .rgS.s.lock .lk{text-shadow:0 1px 2px #000,0 0 6px #000}.rgS.sel .in{border-color:#fff3b8!important;box-shadow:0 0 0 2px #1a0c06,0 0 16px #ffe08a}.rgS.lock .in{opacity:.45}
.rgS .bd{position:absolute;left:50%;bottom:-9%;transform:translateX(-50%);font:900 11px Sarabun;padding:0 6px;border-radius:8px;background:#1a0e07;border:1.5px solid #8a6a3a;color:#ffe9a0;white-space:nowrap}
.rgS.b .bd{bottom:-4%;font-size:12px}.rgS .lk{font:700 11px Sarabun;color:#e8d3a8;text-align:center;line-height:1.1}
.rgSide{flex:1;min-width:0;display:flex;flex-direction:column;border-left:1.5px solid #6a4a2a}
.rgTabs{display:flex;gap:5px;padding:7px 8px 0}.rgTabs button{flex:1;min-height:34px;border-radius:11px 11px 0 0;border:2px solid #8a6a3a;border-bottom:0;background:#2a1a0c;color:#f3e0b8;font:700 13.5px Sarabun;cursor:pointer}.rgTabs button.on{border-color:#ffd25a;background:#5a3a12;color:#fff3c8}
.rgPane{flex:1;overflow:auto;padding:9px 11px;font:400 13.5px/1.45 Sarabun;border-top:2px solid #8a6a3a}
.rgCard{background:#1a0e07;border:1.5px solid #6a4a2a;border-radius:12px;padding:8px 10px;margin-bottom:8px}.rgCard h4{margin:0;font:700 16px Mali,Sarabun;color:#fff3c8;display:flex;align-items:center;gap:8px}
.rgCard h4 svg{width:42px;height:42px;flex:none}.ok{color:#bff0a8}.no{color:#ff9a8a}.rgN{font:400 12px Sarabun;color:#c9b48a;margin-top:5px}
.rgDot{display:inline-block;width:13px;height:13px;border-radius:50%;border:2px solid #1a0c05;vertical-align:-2px;margin:0 2px}
.rgL{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:6px;margin-top:6px}.rgI{position:relative;background:#2a1a0e;border:1.5px solid #6a4a2a;border-radius:11px;padding:4px 2px 2px;cursor:pointer;text-align:center;font:600 10.5px/1.2 Sarabun;color:#f3e0b8}
.rgI svg{width:44px;height:44px;display:block;margin:0 auto}.rgI em{position:absolute;right:3px;top:2px;font:900 11px Sarabun;font-style:normal;color:#fff;text-shadow:0 1px 2px #000}.rgI.dim{opacity:.4;cursor:default}.rgI:hover{border-color:#ffd25a}
.rgB{min-height:34px;border-radius:17px;border:2.5px solid #e9b44c;background:linear-gradient(#a8742a,#6a4214);font:700 14px Mali,Sarabun;color:#fff3c8;cursor:pointer;padding:0 12px;margin:6px 6px 0 0;box-shadow:0 2px 0 #3a1f14}
.rgB:disabled{border-color:#7a6a4a;background:linear-gradient(#5a4a34,#3a2e20);color:#b8a888;cursor:default}.rgB.red{border-color:#ff9a7a;background:linear-gradient(#a8442a,#5a1e10)}.rgB.blue{border-color:#8fd0ff;background:linear-gradient(#3a72b8,#1f3e6e)}
.rgRow{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}.rgRes{min-height:52px;display:flex;align-items:center;gap:10px;background:#120a05;border:1.5px dashed #8a6a3a;border-radius:12px;padding:6px 10px;margin:6px 0}
.rgRes svg{width:48px;height:48px;flex:none}.rgPop{animation:rgPop .5s ease-out}@keyframes rgPop{0%{transform:scale(.3) rotate(-20deg);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1)}}
@media (max-width:760px),(max-height:470px){.rgBox{width:100vw;height:100vh;border-radius:0}.rgRing{max-width:50%}.rgS .bd{font-size:9px;padding:0 4px;border-radius:7px}.rgS.b .bd{font-size:9.5px}.rgRing.artS .rgS.s .lvw{display:none}.rgRing.artS .rgS.s .bd{bottom:-16%;min-width:15px;text-align:center}.rgHead h3{font-size:17px}.rgHead .sub{display:none}.rgPane{font-size:12.5px}}
@media (max-aspect-ratio:4/5){.rgBody{flex-direction:column}.rgRing{height:auto;width:min(100%,54vh);max-width:none;align-self:center}.rgSide{border-left:0;border-top:1.5px solid #6a4a2a;min-height:0}.rgTabs button{white-space:nowrap;padding-left:4px;padding-right:4px}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const win=document.createElement('div');win.id='rgw';win.innerHTML=`<div class="rgBox"><div class="rgHead"><h3>🔱 วงเศษโทเท็ม</h3><span class="sub"></span><button class="rb" data-h="roots">🌳 ราก (U)</button><button class="rb" data-h="shop">🧙 ร้าน</button><button data-h="x" title="ปิด (Y / Esc)">✕</button></div>
  <div class="rgBody"><div class="rgRing"></div><div class="rgSide"><div class="rgTabs"></div><div class="rgPane"></div></div></div></div>`;
document.body.appendChild(win);
const ringEl=win.querySelector('.rgRing'),tabsEl=win.querySelector('.rgTabs'),pane=win.querySelector('.rgPane');
let tab='sock',sel='b0',res='',smG=0,smPick={},smK='';
const ANG=i=>(-90+i*60)*Math.PI/180;
const POS={},setPOS=(R,Ri)=>{for(let i=0;i<6;i++){POS['b'+i]=[50+R*Math.cos(ANG(i)),50+R*Math.sin(ANG(i))];POS['e'+i]=[50+R*Math.cos(ANG(i)+Math.PI/6),50+R*Math.sin(ANG(i)+Math.PI/6)];POS['i'+i]=[50+Ri*Math.cos(ANG(i)),50+Ri*Math.sin(ANG(i))];}};setPOS(38,21);
{const L=(window.RUNEDATA||{}).RING_LAY;if(L&&(window.RUNEDATA.RING_ART||new Set()).has('shard'))setPOS(L.R,L.Ri);}   /* painted page: its own circles */
const C3=RU.C3;
/* ring background: the code look, or the painted parts assembled at the exact socket spots (RUNEDATA.RING_ART / RING_LAY) */
const RA=RU.RING_ART||new Set(),RL=RU.RING_LAY||{};
const partW=k=>RL[k].w||(k==='shard'?RL.bB:RL.bS)*.868/RL[k].hd;   /* the painted hole = 0.868 × the socket button */
function partImg(k,x,y,lay,rot,op){const w=partW(k),h=w*(lay.ar||1);return `<g transform="translate(${x} ${y})${rot?` rotate(${rot})`:''}"${op<1?` opacity="${op}"`:''}><image href="${RU.ringPath(k)}" x="${-w*(lay.hx==null?.5:lay.hx)}" y="${-h*(lay.hy==null?.5:lay.hy)}" width="${w}" height="${h}" preserveAspectRatio="none"/></g>`;}
function linkLines(onOnly){let lines='';for(let i=0;i<6;i++){const M=match(i),L=RU.RING.links(i),[bx,by]=POS['b'+i];
    L.forEach((s2,q)=>{const [sx,sy]=POS[s2],c=S.small[s2]&&CRK[S.small[s2]]?C3[CRK[S.small[s2]].c].c:'#5a4a5a',on=!!(M&&S.small[s2]);
      if(onOnly===!on)return;lines+=on?`<line x1="${bx}" y1="${by}" x2="${sx}" y2="${sy}" stroke="${c}" stroke-width="2.6" opacity=".35" stroke-linecap="round"/><line x1="${bx}" y1="${by}" x2="${sx}" y2="${sy}" stroke="${c}" stroke-width="1.1" opacity=".95" stroke-linecap="round"/>`
        :`<line x1="${bx}" y1="${by}" x2="${sx}" y2="${sy}" stroke="#c8b0ff" stroke-width=".6" stroke-dasharray="1.4 1.2" opacity=".45"/>`;});}return lines;}
function ringSVG(){if(!RA.size)return ringSVGcode();
  const code=ringSVGcode();   /* parts that are not painted yet still come from the code look */
  const sky=RA.has('bg')?`<image href="${RU.ringPath('bg')}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>`:(code.match(/<rect width="100"[\s\S]*?(?=<circle cx="50" cy="50" r="38")/)||[''])[0];
  const guide=`<circle cx="50" cy="50" r="${RL.R||38}" fill="none" stroke="#ffe08a" stroke-width=".35" opacity=".35"/><circle cx="50" cy="50" r="${RL.Ri||21}" fill="none" stroke="#ffe08a" stroke-width=".3" opacity=".3"/>`;
  const shards=RA.has('shard')?[0,1,2,3,4,5].map(i=>{const [x,y]=POS['b'+i];return partImg('shard',x,y,RL.shard,ANG(i)*180/Math.PI+90,bigOpen(i)?1:.5);}).join(''):'';
  const socks=RA.has('sock')?SM.map(id=>{const [x,y]=POS[id];return partImg('sock',x,y,RL.sock,RL.sockTurn?Math.atan2(y-50,x-50)*180/Math.PI+90:0,smOpen(id)?1:.5);}).join(''):'';
  const stump=RA.has('stump')?`<ellipse cx="50" cy="53" rx="${RL.stump.w*.5}" ry="${RL.stump.w*.2}" fill="#000" opacity=".4"/>`+partImg('stump',50,50,RL.stump,0,1):'';
  const defs=(code.match(/<defs>[\s\S]*?<\/defs>/)||[''])[0];
  return `<svg class="bg" viewBox="0 0 100 100">${defs}${sky}${guide}${RA.has('shard')?'':(code.match(/<g transform="translate[\s\S]*?<\/g>(?=[^]*<line|[^]*<ellipse)/g)||[]).join('')}${linkLines(false)}${shards}${linkLines(true)}${socks}${stump||(code.match(/<ellipse cx="50" cy="53"[\s\S]*<\/svg>/)||['</svg>'])[0].replace('</svg>','')}</svg>`;}
function ringSVGcode(){let lines='';for(let i=0;i<6;i++){const M=match(i),L=RU.RING.links(i),[bx,by]=POS['b'+i];
    L.forEach((s,q)=>{const [sx,sy]=POS[s],c=S.small[s]&&CRK[S.small[s]]?C3[CRK[S.small[s]].c].c:'#5a4a5a',on=!!(M&&S.small[s]);
      lines+=`<line x1="${bx}" y1="${by}" x2="${sx}" y2="${sy}" stroke="${on?c:'#4a3a4a'}" stroke-width="${on?1.1:.6}" stroke-dasharray="${on?'':'1.4 1.2'}" opacity="${on?.9:.6}"/>`;});}
  const shards=[0,1,2,3,4,5].map(i=>{const [x,y]=POS['b'+i],a=ANG(i)*180/Math.PI;return `<g transform="translate(${x} ${y}) rotate(${a+90})"><path d="M0 -14 L10 -4 L8 11 L-7 13 L-11 -3Z" fill="${bigOpen(i)?'#5a4a6a':'#2a2232'}" stroke="#1a0c06" stroke-width=".8"/><path d="M0 -14 L10 -4 L0 -2Z" fill="#fff" opacity=".12"/></g>`;}).join('');
  return `<svg class="bg" viewBox="0 0 100 100"><defs><radialGradient id="rgSky" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="#3a2a4a"/><stop offset=".6" stop-color="#1a1226"/><stop offset="1" stop-color="#0a0610"/></radialGradient>
    <radialGradient id="rgStump" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#c8945a"/><stop offset=".55" stop-color="#8a5a32"/><stop offset="1" stop-color="#4a2a14"/></radialGradient></defs>
    <rect width="100" height="100" fill="url(#rgSky)"/>${[...Array(26)].map((_,j)=>`<circle cx="${(j*37)%100}" cy="${(j*61+13)%100}" r="${.25+(j%3)*.15}" fill="#fff" opacity="${.3+(j%4)*.12}"/>`).join('')}
    <circle cx="50" cy="50" r="38" fill="none" stroke="#7a5a8a" stroke-width=".5" stroke-dasharray="1 1.6" opacity=".7"/><circle cx="50" cy="50" r="21" fill="none" stroke="#7a5a8a" stroke-width=".4" stroke-dasharray="1 1.4" opacity=".6"/>
    ${shards}${lines}
    <ellipse cx="50" cy="53" rx="13" ry="5" fill="#000" opacity=".45"/><circle cx="50" cy="50" r="12" fill="url(#rgStump)" stroke="#2a160a" stroke-width="1.2"/>
    ${[9,6.3,3.8].map(r=>`<circle cx="50" cy="50" r="${r}" fill="none" stroke="#5a3418" stroke-width=".5" opacity=".8"/>`).join('')}
    <path d="M44 41 L49 48 L46 52 L52 58 M55 42 L52 47 L56 51" stroke="#ffd25a" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".85"/><path d="M44 41 L49 48 L46 52 L52 58" stroke="#fff3b8" stroke-width=".35" fill="none"/></svg>`;}
const crDead=id=>{const c=S.small[id];if(!c)return false;let n=0;for(const s2 of SM){if(S.small[s2]===c&&smOpen(s2))n++;if(s2===id)break;}return n>RU.RING.sameMax;};
function sockHTML(id){const b=id[0]==='b',i=+id.slice(1),open=b?bigOpen(i):smOpen(id),cur=b?S.big[i]:S.small[id];let inner='',bd='';
  if(!open)inner=`<span class="lk">🔒<br>Lv ${b?RU.RING.open[i]:RU.RING.smallOpen(id)}</span>`;
  else if(cur&&ETC[cur])inner=ETC[cur].big.replace('<svg ','<svg class="ic" ');
  if(b&&open&&cur){const M=match(i);bd=`<span class="bd" style="color:${M&&M.t?'#ffe9a0':'#ff9a8a'}">${M&&M.t?'ขั้น '+RU.TIERN[M.t]:'ยังไม่ทำงาน'}</span>`;}
  else if(!b&&open)bd=crDead(id)?`<span class="bd" style="color:#ff9a8a">ซ้ำเกิน ${RU.RING.sameMax}</span>`:`<span class="bd"><span class="lvw">Lv </span>${slv(id)}</span>`;
  const [x,y]=POS[id];return `<button class="rgS ${b?'b':'s'} ${open?'':'lock'} ${sel===id?'sel':''}" data-s="${id}" style="left:${x}%;top:${y}%"><span class="in" style="${b&&cur?`border-color:${GR[ETC[cur].grade].c}`:!b&&cur?`border-color:${C3[CRK[cur].c].c}`:''}">${inner}</span>${bd}</button>`;}
function drawRing(){ringEl.classList.toggle('artB',RA.has('shard'));ringEl.classList.toggle('artS',RA.has('sock'));if(RA.has('shard')){ringEl.style.setProperty('--bB',RL.bB+'%');ringEl.style.setProperty('--bS',RL.bS+'%');}ringEl.innerHTML=ringSVG()+[...[0,1,2,3,4,5].map(i=>'b'+i),...SM].map(sockHTML).join('');
  ringEl.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sel=b.dataset.s;if(tab!=='sock'&&!(tab==='lvl'&&sel[0]!=='b'))tab='sock';if(tab==='lvl'&&sel[0]==='b')tab='sock';build();});}
const reqHTML=(r,ok)=>r.req.split('').map((c,q)=>`<span class="rgDot" title="${C3[c].th}" style="background:${C3[c].c};${ok&&ok[q]?'box-shadow:0 0 0 2px #bff0a8':''}"></span>`).join('');
function pouch(kind,filter){const ids=Object.keys(AF.BAG).filter(id=>ETC[id]&&ETC[id].kind===kind&&AF.BAG[id]>0&&(!filter||filter(id)));
  return ids.sort((a,b)=>(ETC[b].grade||0)-(ETC[a].grade||0)||(a>b?1:-1));}
function sockPane(){const b=sel[0]==='b',i=+sel.slice(1);let h='';
  if(b){const open=bigOpen(i),cur=S.big[i],M=cur&&match(i);h+=`<div class="rgCard"><h4>${cur?ETC[cur].big:''}<span>ช่องใหญ่ ${i+1}${cur?' · '+ETC[cur].th:' · ว่าง'}</span></h4>`;
    if(!open)h+=`<div class="no">เปิดที่ Lv ${RU.RING.open[i]}</div>`;
    else if(cur){const r=SRK[ETC[cur].sr],An=RU.ANIMAL[r.a],t=M?M.t:0,v=r.v(PLV(),GR[ETC[cur].grade].m*RU.TIERM[Math.max(1,t)],ETC[cur].grade,Math.max(1,t));
      h+=`<div style="margin-top:4px">${An.th} · ${An.note} · เกรด <b style="color:${GR[ETC[cur].grade].c}">${GR[ETC[cur].grade].k}</b> · ${t?`<b class="ok">ทำงานขั้น ${RU.TIERN[t]}</b>`:'<b class="no">ยังไม่ทำงาน (ต่อเส้นสีให้ตรงอย่างน้อย 1)</b>'}</div>
        <div style="margin-top:4px;font-size:14.5px;color:#fff3c8">${r.d(v)}${t?'':' <small class="no">(ตัวเลขขั้น I)</small>'}</div>
        <div class="rgN">ต้องการเส้นสี: ${reqHTML(r,M&&M.ok)} (ช่องเล็กที่ต่อกับช่องนี้ 3 ช่อง · ✓ = ตรงแล้ว) · ตรง 1 / 2 / 3 เส้น = ขั้น I / II / III (×0.5 / ×0.75 / ×1)</div>
        <button class="rgB red" data-a="unb">ถอดเก็บกระเป๋า</button>`;}
    else h+=`<div class="rgN">เลือกรูนวิญญาณจากกระเป๋าข้างล่าง · รูนชนิดเดียวกันใส่ได้ช่องเดียว</div>`;h+='</div>';
    if(open){const used=new Set(S.big.filter(Boolean).map(x=>ETC[x]&&ETC[x].sr)),L=pouch('srune');
      h+=`<div class="rgN">รูนวิญญาณในกระเป๋า (${L.reduce((a,id)=>a+AF.BAG[id],0)})</div><div class="rgL">${L.map(id=>{const E=ETC[id],r=SRK[E.sr],dup=used.has(E.sr)&&!(cur&&ETC[cur].sr===E.sr);
        return `<div class="rgI ${dup?'dim':''}" data-put="${id}" title="${E.th} — ${r.d(r.v(PLV(),GR[E.grade].m,E.grade,3))} · สี ${r.req.split('').map(c=>C3[c].th).join(' ')}">${E.big}<em>${AF.BAG[id]}</em>${r.th}<br>${reqHTML(r)}</div>`;}).join('')||'<span class="rgN">ยังไม่มี — อ่านหินรูนดิบ (แท็บ "อ่านรูน") หรือซื้อที่ตลาดกลาง</span>'}</div>`;}}
  else{const open=smOpen(sel),cur=S.small[sel],c=cur&&CRK[cur];h+=`<div class="rgCard"><h4>${cur?ETC[cur].big:''}<span>ช่องเล็ก ${sel[0]==='e'?'ระหว่างช่องใหญ่':'ด้านใน'} · Lv ${slv(sel)}${cur?' · '+ETC[cur].th:' · ว่าง'}</span></h4>`;
    if(!open)h+=`<div class="no">เปิดที่ Lv ${RU.RING.smallOpen(sel)}</div>`;
    else{if(c)h+=`<div style="margin-top:4px;font-size:14.5px">${RU.crTxt(c,slv(sel))} <small class="rgN">(Lv 10: ${RU.crTxt(c,10)})</small></div>`;
      const feeds=[0,1,2,3,4,5].filter(i=>RU.RING.links(i).includes(sel)).map(i=>'ช่องใหญ่ '+(i+1));h+=`<div class="rgN">ต่อกับ: ${feeds.join(' · ')} · เลเวลอยู่ที่ช่อง เปลี่ยนรูนได้ไม่เสียเลเวล</div>`;
      h+=`${c?'<button class="rgB red" data-a="uns">ถอดเก็บกระเป๋า</button>':''}<button class="rgB blue" data-a="lvl">⬆ อัปเลเวลช่อง</button>`;}h+='</div>';
    if(open){const L=pouch('crune');h+=`<div class="rgRow"><span class="rgN" style="margin:0">รูนสีในกระเป๋า (${L.reduce((a,id)=>a+AF.BAG[id],0)})</span><button class="rgB" data-a="bag" ${bagN('rbag')?'':'disabled'}>🎁 เปิดถุงรูนสี (${bagN('rbag')})</button></div>
      <div class="rgL">${L.map(id=>{const c2=CRK[id];return `<div class="rgI" data-put="${id}" title="${ETC[id].th} — ${RU.crTxt(c2,slv(sel))} ที่ Lv ${slv(sel)}">${ETC[id].big}<em>${AF.BAG[id]}</em>${c2.th}</div>`;}).join('')||'<span class="rgN">ยังไม่มี — เปิดถุงรูนสี (มอน Lv 28+ / บอส) หรือซื้อที่ตลาดกลาง</span>'}</div>`;}}
  if(res)h=`<div class="rgRes">${res}</div>`+h;return h;}
function readPane(){const fe=bagN('rfeather');return `<div class="rgRes">${res||'<span class="rgN" style="margin:0">อ่านหินรูนดิบ 1 ก้อน + คัมภีร์หมอผี 1 ม้วน = รูนวิญญาณ 1 อัน สุ่ม 1 ใน 18 แบบ ในเกรดของหิน</span>'}</div>
  ${[0,1,2].map(g=>{const id='rstone'+g,n=bagN(id);return `<div class="rgCard"><div class="rgRow" style="margin:0">${eIcon(id,30)}<b>${ETC[id].th}</b><span class="rgN" style="margin:0">มี ${n}</span>
    <span style="margin-left:auto"></span><button class="rgB" data-read="${g}" data-n="1" ${n&&fe?'':'disabled'}>อ่าน</button><button class="rgB" data-read="${g}" data-n="5" ${n>=5&&fe>=5?'':'disabled'}>อ่าน ×5</button></div></div>`;}).join('')}
  <div class="rgRow">${eIcon('rfeather',24)} คัมภีร์หมอผี <b>${fe}</b><button class="rgB" data-a="shop">🧙 ซื้อคัมภีร์</button></div>
  <div class="rgN">หินรูนดิบ: มอน Lv 28+ ดรอปน้อย (ดันเจี้ยน ×2) · บอสดรอปแน่นอน (แมพ B · MVP B + A · บอสใหญ่ A + S) · ซื้อขายที่ตลาดกลาง (หมวด 🔱 รูน)</div>`;}
function smeltPane(){const G2=smG,C=RU.COST.smelt,z=C.z[G2],L=pouch('srune',id=>ETC[id].grade===G2),pick=Object.keys(smPick).reduce((a,id)=>a+smPick[id],0),dust=bagN('sdust');
  return `<div class="rgRes">${res||`<span class="rgN" style="margin:0">หลอมรูนวิญญาณเกรดเดียวกัน ${C.n} อัน + ${fmt(z)}z = รูนใหม่ 1 อัน (สุ่มชนิด · มีโอกาส ${Math.round(C.up*100)}% ได้เกรดสูงขึ้น) + ไฟวิญญาณ 1 · ไฟครบ ${C.dustPick} = เลือกชนิดเองได้</span>`}</div>
  <div class="rgRow">${[0,1,2].map(g=>`<button class="rgB ${g===G2?'blue':''}" data-sg="${g}">เกรด ${GR[g].k}</button>`).join('')}<span class="rgN" style="margin:0">เลือกแล้ว <b>${pick}/${C.n}</b></span></div>
  <div class="rgL">${L.map(id=>{const E=ETC[id],r=SRK[E.sr],p=smPick[id]||0;return `<div class="rgI" data-sp="${id}" title="แตะ = ใส่ 1 · แตะค้าง/คลิกขวา = เอาออก">${E.big}<em>${p?p+'/':''}${AF.BAG[id]}</em>${r.th}</div>`;}).join('')||'<span class="rgN">ไม่มีรูนเกรดนี้</span>'}</div>
  <div class="rgRow">${eIcon('sdust',22)} ไฟวิญญาณ <b>${dust}</b>${dust>=C.dustPick?`<select data-a="sk" style="font:600 13px Sarabun;border-radius:8px;padding:3px"><option value="">สุ่มชนิด</option>${RU.SR.map(r=>`<option value="${r.k}" ${smK===r.k?'selected':''}>${RU.ANIMAL[r.a].th} · ${r.th}</option>`).join('')}</select>`:''}</div>
  <button class="rgB" data-a="smelt" ${pick===C.n&&zeny()>=z?'':'disabled'}>🔥 หลอม (${fmt(z)}z)</button><button class="rgB" data-a="spclr">ล้างที่เลือก</button>`;}
function lvlPane(){if(sel[0]==='b')sel='e0';const L=slv(sel),C=RU.COST.slot,nR=C.runes(L),z=C.z(L),have=pouch('crune').reduce((a,id)=>a+AF.BAG[id],0),cur=S.small[sel];
  return `<div class="rgRes">${res||'<span class="rgN" style="margin:0">ป้อนรูนสีให้ช่องเล็ก = เลเวลช่องขึ้น (สูงสุด 10) · รูนในช่องแรงขึ้นตามเลเวล · เปลี่ยนรูนได้ไม่เสียเลเวล</span>'}</div>
  <div class="rgCard"><h4>${cur?ETC[cur].big:''}<span>ช่อง ${sel} · Lv ${L}${cur?' · '+RU.crTxt(CRK[cur],L):''}</span></h4>
    ${L>=10?'<div class="ok">เลเวลตันแล้ว</div>':`<div style="margin-top:4px">Lv ${L} → ${L+1}: รูนสีชนิดไหนก็ได้ <b class="${have>=nR?'ok':'no'}">${have}/${nR}</b> + <b class="${zeny()>=z?'ok':'no'}">${fmt(z)}z</b>${cur?` → ${RU.crTxt(CRK[cur],L+1)}`:''}</div>
    <button class="rgB" data-a="lvup" ${have>=nR&&zeny()>=z&&smOpen(sel)?'':'disabled'}>⬆ อัปเลเวล</button>`}<div class="rgN">ใช้รูนสีที่มีมากที่สุดก่อน (ไม่แตะรูนที่ใส่อยู่) · ช่องทั้งหมด: ${SM.map(s=>`<a data-go="${s}" style="cursor:pointer;color:${s===sel?'#ffd25a':'#e8d3a8'}">${s} Lv${slv(s)}</a>`).join(' · ')}</div></div>`;}
function build(){recalc();drawRing();win.querySelector('.rgHead .sub').textContent=`Lv ${PLV()} · ทำงาน ${Object.keys(A).length}/6 · ช่องเปิด ${[0,1,2,3,4,5].filter(bigOpen).length}/6${OFF()?' · __RING_OFF':''}`;
  tabsEl.innerHTML=[['sock','💎 ฝังรูน'],['read','📜 อ่านรูน'],['smelt','🔥 หลอมรูน'],['lvl','⬆ อัปช่อง']].map(([k,n])=>`<button data-t="${k}" class="${tab===k?'on':''}">${n}</button>`).join('');
  tabsEl.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;res='';build();});
  pane.innerHTML=tab==='read'?readPane():tab==='smelt'?smeltPane():tab==='lvl'?lvlPane():sockPane();bindPane();}
function put(id){const E=ETC[id];if(!E||!bagN(id))return;if(sel[0]==='b'){const i=+sel.slice(1);if(!bigOpen(i)||E.kind!=='srune')return;
    if(S.big.some((x,j)=>j!==i&&x&&ETC[x]&&ETC[x].sr===E.sr)){say('รูนชนิดนี้ใส่อยู่อีกช่องแล้ว');return;}const old=S.big[i];bagAdd(id,-1);if(old)AF.add(old,1);S.big[i]=id;}
  else{if(!smOpen(sel)||E.kind!=='crune')return;const old=S.small[sel];bagAdd(id,-1);if(old)AF.add(old,1);S.small[sel]=id;}
  bagSave();save();res='';DIRTY=true;try{applyStats();}catch(e){}build();}
function pickUse(n,keep){const L=pouch('crune').map(id=>[id,AF.BAG[id]]).sort((a,b)=>b[1]-a[1]);let left=n;const use=[];for(const [id,c] of L){const q=Math.min(left,c);if(q>0){use.push([id,q]);left-=q;}if(!left)break;}return left?null:use;}
function bindPane(){pane.querySelectorAll('[data-put]').forEach(b=>b.onclick=()=>{if(!b.classList.contains('dim'))put(b.dataset.put);});
  pane.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{sel=b.dataset.go;res='';build();});
  pane.querySelectorAll('[data-sg]').forEach(b=>b.onclick=()=>{smG=+b.dataset.sg;smPick={};res='';build();});
  pane.querySelectorAll('[data-sp]').forEach(b=>{b.onclick=()=>{const id=b.dataset.sp,n=Object.keys(smPick).reduce((a,k)=>a+smPick[k],0);if(n<RU.COST.smelt.n&&(smPick[id]||0)<AF.BAG[id]){smPick[id]=(smPick[id]||0)+1;build();}};
    b.oncontextmenu=e=>{e.preventDefault();const id=b.dataset.sp;if(smPick[id]){smPick[id]--;if(!smPick[id])delete smPick[id];build();}};});
  pane.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{const g=+b.dataset.read,n=+b.dataset.n,got=[];for(let j=0;j<n;j++){if(!bagN('rstone'+g)||!bagN('rfeather'))break;bagAdd('rstone'+g,-1);bagAdd('rfeather',-1);
      const r=RU.SR[Math.floor(Math.random()*RU.SR.length)],id=`sr_${r.k}_${g}`;AF.add(id,1);got.push(id);}bagSave();
    res=got.map(id=>`<span class="rgPop" style="display:inline-block;width:48px">${ETC[id].big}</span>`).join('')+`<div>${got.map(id=>`<b style="color:${GR[ETC[id].grade].c}">${ETC[id].th}</b>`).join('<br>')}</div>`;build();});
  const sk=pane.querySelector('[data-a="sk"]');if(sk)sk.onchange=()=>{smK=sk.value;};
  pane.querySelectorAll('[data-a]').forEach(b=>{if(b.tagName==='SELECT')return;b.onclick=()=>{const a=b.dataset.a;
    if(a==='unb'){const i=+sel.slice(1),old=S.big[i];if(old){AF.add(old,1);S.big[i]=null;}}
    else if(a==='uns'){const old=S.small[sel];if(old){AF.add(old,1);S.small[sel]=null;}}
    else if(a==='lvl'){tab='lvl';res='';}
    else if(a==='shop'){try{ROOTS.shop();}catch(e){}return;}
    else if(a==='bag'){if(!bagN('rbag'))return;bagAdd('rbag',-1);const c=RU.CR[Math.floor(Math.random()*RU.CR.length)];AF.add(c.k,1);res=`<span class="rgPop" style="display:inline-block;width:48px">${ETC[c.k].big}</span><div>ได้ <b>${ETC[c.k].th}</b></div>`;}
    else if(a==='spclr'){smPick={};res='';}
    else if(a==='smelt'){const C=RU.COST.smelt,n=Object.keys(smPick).reduce((x,k)=>x+smPick[k],0);if(n!==C.n||!payZ(C.z[smG]))return;for(const id in smPick)bagAdd(id,-smPick[id]);
      let g=smG;if(g<2&&Math.random()<C.up)g++;let k=null;if(smK&&bagN('sdust')>=C.dustPick){k=smK;bagAdd('sdust',-C.dustPick);}const r=k?SRK[k]:RU.SR[Math.floor(Math.random()*RU.SR.length)],id=`sr_${r.k}_${g}`;
      AF.add(id,1);AF.add('sdust',1);smPick={};smK='';res=`<span class="rgPop" style="display:inline-block;width:48px">${ETC[id].big}</span><div>ได้ <b style="color:${GR[g].c}">${ETC[id].th}</b>${g>smG?' <b class="ok">เกรดขึ้น!</b>':''} + ไฟวิญญาณ 1</div>`;}
    else if(a==='lvup'){const L=slv(sel),C=RU.COST.slot;if(L>=10)return;const use=pickUse(C.runes(L));if(!use||!payZ(C.z(L)))return;for(const [id,q] of use)bagAdd(id,-q);S.slv[sel]=L+1;res=`<div>ช่อง ${sel} ขึ้น <b class="ok">Lv ${L+1}</b>${S.small[sel]?' · '+RU.crTxt(CRK[S.small[sel]],L+1):''}</div>`;}
    bagSave();save();DIRTY=true;try{applyStats();}catch(e){}build();};});}
win.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{const h=b.dataset.h;if(h==='x')close();else if(h==='roots'){close();try{ROOTS.open();}catch(e){}}else if(h==='shop'){try{ROOTS.shop();}catch(e){}}});
win.addEventListener('click',e=>{if(e.target===win)close();});
function open(){if(!TEST()&&PLV()<30)say('วงเศษโทเท็มเปิดที่ Lv 30 — ดูได้ก่อน');win.classList.add('open');res='';build();}
function close(){win.classList.remove('open');}
addEventListener('keydown',e=>{const tg=(e.target&&e.target.tagName)||'';if(/INPUT|TEXTAREA|SELECT/.test(tg)||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==='y'||e.key==='Y'||e.code==='KeyY'){win.classList.contains('open')?close():open();}else if(e.key==='Escape'&&win.classList.contains('open'))close();});
(function addBtn(){const mg=document.getElementById('mgrid');if(!mg||!mg.children.length){setTimeout(addBtn,300);return;}if(mg.querySelector('[data-m="mgring"]'))return;
  const b=document.createElement('button');b.dataset.m='mgring';b.title='วงเศษโทเท็ม (Y)';
  /* painted ring button (RUNE_ART_PROMPTS_TH.md ง, ring_btn) when it exists, else the code ring */
  if(RU.ICON_HAVE.has('ring_btn'))b.innerHTML=`<span class="kb">Y</span><img src="${RU.iconPath('ring_btn')}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none">`;else
  b.innerHTML=`<span class="kb">Y</span><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="#3a1f14" stroke-width="5"/><circle cx="20" cy="20" r="15" fill="none" stroke="#8a6ac8" stroke-width="2.4" stroke-dasharray="3 3"/>${[0,1,2,3,4,5].map(i=>{const a=(-90+i*60)*Math.PI/180;return `<circle cx="${20+15*Math.cos(a)}" cy="${20+15*Math.sin(a)}" r="4.2" fill="${['#ff6a4a','#5aa8ff','#ffcf3a'][i%3]}" stroke="#3a1f14" stroke-width="1.8"/>`;}).join('')}<circle cx="20" cy="20" r="6.5" fill="#a8683a" stroke="#3a1f14" stroke-width="2.2"/><path d="M18 16 L21 20 L19 23" stroke="#ffd25a" stroke-width="1.6" fill="none"/></svg>`;
  b.addEventListener('click',e=>{e.stopPropagation();e.stopImmediatePropagation();win.classList.contains('open')?close():open();},true);mg.appendChild(b);})();
let lastLv=PLV();setInterval(()=>{const lv=PLV();if(lv!==lastLv){lastLv=lv;recalc();if(win.classList.contains('open'))build();}
  if(!TEST()&&lv>=30&&!S.seen){S.seen=1;save();chat('<b style="color:#c8a8ff">🔱 วงเศษโทเท็มเปิดแล้ว!</b> — ใส่รูนวิญญาณสัตว์ (ความสามารถพิเศษทั้งชุดสกิล) + รูนสี (แดง · ฟ้า · ทอง) · อ่านหินรูนดิบด้วยคัมภีร์หมอผี · กด Y หรือปุ่ม 🔱');say('วงเศษโทเท็มเปิดแล้ว (Y)');}},1000);
recalc();
window.RING={open,close,data:()=>S,act:()=>A,rs:()=>RS,match,key:SKEY,recalc,fx:fxAt,   /* fx: tests / previews */
  
  /* tests: put runes straight in (no bag) — RING.force([[0,'sr_wolfHunt_2'],…],{e0:'c_str',…},lv) */
  force(big,small,lv){S.big=[null,null,null,null,null,null];for(const [i,id] of big||[])S.big[i]=id;S.small=Object.assign({},small||{});if(lv)for(const s of SM)S.slv[s]=lv;save();recalc();DIRTY=true;try{applyStats();}catch(e){}},
  clear(){S.big=[null,null,null,null,null,null];S.small={};S.slv={};save();recalc();DIRTY=true;try{applyStats();}catch(e){}}};
})();
