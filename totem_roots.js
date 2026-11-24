/* =====================================================================
   TOTEM ROOTS (รากโทเท็ม) — the normal rune web, like ROM's Aesir Monument. Owner 2026-11-23 ('1ทำ · 2ได้ มันไม่ต้องเป็นชั่วโมงหรอก
   คือต้องหาของเพื่อเอามาปลด โดยการฟามไม่ก็หาซื้อมาจากตลาดกลาง · 5ทำไรก่อนก็ได้ให้เสร็จ'): Class C skills are LIT here (no longer by
   socketing a C gem on the totem pole); the pole keeps customising them (C gems are extracted from lit C skills, totem_gems.js).
   • Web = rune_roots_data.js (tools/rune/roots_gen.py game): one template for every hero, the 12 C knots take the hero's C skill of the
     same column + tier. 572 nodes + the heart. Rules + numbers: RUNE_SYSTEM_TH.md §2.
   • Light a node: level of its band (31 / 41 / 51 / 54) · next to a lit node (knot centres open nothing) · rune points (4 a level from
     Lv 31 → 120 at Lv 60) · goods: spirit sap, monster materials of the band, golden totem medals, root skill gems (C only), zeny.
     A C knot also needs 3 of its 6 ring nodes, 25 / 40 / 55 / 70 nodes lit in all and the skill's own tree requirement.
   • Reset = Root Dew (first one free): every point and every good comes back.
   • Effects: stats / RO specials into BON (gearCalc), SP regen (derive), DEF / MDEF pierce % (hurt → o._msCut), damage taken −%
     (itemFx.takenMul(e,mag)), status length −% (MSF.debuffT), C skill nodes + branch bonuses (castSkillNow / addBuff / applyCC).
     window.__ROOTS_OFF = node effects off (the bench); C skills stay as lit.
   • Old saves / test mode: the C skills the gem board had on are lit for free along their cheapest path (play: as far as the points go).
   • Window: key U or the 🌳 menu button; the skill tree's C nodes open it. Canvas web (drag / pinch / wheel), node card, 🧭 plan to a
     node + 'light along the plan', 🧙 root shaman (boss parts → root skill gems, feathers, dew).
   ===================================================================== */
(function(){
const RD=window.ROOTS_DATA,RU=window.RUNEDATA;if(!RD||!RU||typeof SKILLS==='undefined'||!window.AFItems)return;
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
const HERO=G('CHAR')||'wolf',AF=window.AFItems,TEST=()=>AF.MODE!=='play';
const SKEY='af_roots_'+HERO+(AF.MODE==='play'?'_play':'');
const PLV=()=>{const P=G('PS');return (P&&P.lv)||1;};
const bagN=id=>AF.BAG[id]||0,bagAdd=(id,n)=>AF.bagAdd(id,n),bagSave=()=>AF.save(),zeny=()=>AF.zeny,payZ=z=>{if(AF.zeny<z)return false;AF.zeny=AF.zeny-z;return true;};
const fmt=n=>Math.round(n).toLocaleString('en-US'),eIcon=(id,sz)=>{try{return AF.ui.etcIcon(id,sz);}catch(e){return '';}};
const say=t=>{try{msg(t);}catch(e){}},chat=t=>{try{chatLog('sys',t);}catch(e){}};
/* ---------------- the web ---------------- */
const N={},ADJ={};for(const n of RD.N){N[n.id]=n;ADJ[n.id]=new Set();}
for(const [a,b,t] of RD.E){if(t==='spoke'){ADJ[b].add(a);continue;}ADJ[a].add(b);ADJ[b].add(a);}
const CEN=id=>!!(N[id]&&N[id].r),KNOT=RD.N.filter(n=>n.k==='c').map(n=>n.id);
const knotOf=id=>{const m=/^(.*)r\d$/.exec(id);return m&&N[m[1]]?m[1]:null;};
/* a C skill's column: s.col, else (cat, jaguar, owl …) the order of its tier's three C skills = basic / A / B (as totem_gems.js colName) */
const colOf=k=>{const s=SKILLS[k]||{};if(s.col)return s.col;const row=Object.keys(SKILLS).filter(q=>SKILLS[q].br==='C'&&SKILLS[q].tier===s.tier);return ['basic','A','B'][row.indexOf(k)]||'basic';};
const CSK={},CNODE={};for(const id of KNOT){const n=N[id],k=Object.keys(SKILLS).find(q=>SKILLS[q].br==='C'&&colOf(q)===n.c&&SKILLS[q].tier===n.t);if(k){CSK[id]=k;CNODE[k]=id;}}
const pt=n=>(n&&n.$&&n.$.pt)||(n&&n.k==='h'?0:1);
const ptsTotal=()=>TEST()?999:Math.max(0,4*(Math.min(PLV(),60)-30));
const BRN={A:'สาย A',B:'สาย B',basic:'สายพื้นฐาน'},TIERT=['','ขั้น 1','ขั้น 2','ขั้น 3','ขั้น 4'];
const RACE_TH=(window.AFMonsters&&AFMonsters.RACE_TH)||{},EL_TH=(window.AFMonsters&&AFMonsters.EL_TH)||{};
const skName=k=>(SKILLS[k]&&SKILLS[k].name)||k;
function nodeTxt(n){if(n.k==='h')return 'หัวใจราก — จุดเริ่มของราก';if(n.k==='c')return CSK[n.id]?`ปลดสกิล C: ${skName(CSK[n.id])}`:'สกิล C (ฮีโร่นี้ไม่มีท่าขั้นนี้)';
  if(n.k==='b')return n.tx||'โบนัสสาย';const K=RD.K[n.s];if(!K)return n.s;
  return K.t.replace('{v}',n.v).replace('{q}',n.s==='race'?(RACE_TH[n.q]||n.q):(EL_TH[n.q]||n.q||'')).replace('{sk}',skName(CSK[knotOf(n.id)]));}
/* ---------------- save ---------------- */
let R=null;
function fresh(){return {v:1,lit:{},spent:{},free:1,resets:0,owed:{},seen:0};}
function load(){let d=null;try{d=JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){}return d&&d.v===1?d:null;}
function save(){try{localStorage.setItem(SKEY,JSON.stringify(R));}catch(e){}}
const isLit=id=>id==='H'||!!(R&&R.lit[id]);
const nLit=()=>Object.keys(R.lit).length;
const ptsUsed=()=>{let s=0;for(const id in R.lit)s+=pt(N[id]);return s;};
const ptsLeft=()=>ptsTotal()-ptsUsed();
/* ---------------- costs ---------------- */
const LANDS=()=>Object.keys(AF.TOWNS||{vik:1,grk:1,egy:1,jpn:1,azt:1});
const matG=b=>{const lv=RD.BAND_LV[b]||31,L0=window.LVC&&LVC.o?LVC.o(lv):lv;return Math.max(0,Math.min(9,Math.floor(L0/10)));};
const LC0=v=>window.LVC&&LVC.nc?LVC.nc(v):v,gLv=g=>`Lv ${g?LC0(g*10):1}–${g<9?LC0((g+1)*10)-1:60}`;
const WHERE={pt:'ได้ 4 แต้มทุกเลเวลตั้งแต่ Lv 31',sap:'มอน Lv 28 ขึ้นไป (ราว 1 ใน 4 ตัว) · ตลาดกลาง',medal:'มอน Lv 28+ (หายาก · มอนถึก / ดันเจี้ยนบ่อยกว่า) · บอสทุกตัว · ตลาดกลาง',
  rg:'บอส (แมพ 15 % ขั้น 1 · MVP ขั้น 2–3 · บอสใหญ่ ขั้น 3–4) · แลกชิ้นส่วนบอสที่ 🧙 หมอผีราก · ตลาดกลาง',z:'ล่ามอน / ขายของ'};
function needs(n){const c=n.$||{},o=[];if(n.k==='h')return o;
  if(c.pt)o.push({x:'pt',n:c.pt,nm:'แต้มราก'});
  if(c.sap)o.push({x:'sap',n:c.sap,ids:['rsap'],nm:'ยางวิญญาณ'});
  if(c.ma){const g=matG(n.b);o.push({x:'ma',n:c.ma,ids:LANDS().map(r=>`m_${r}_${g}_a`),nm:`วัตถุดิบมอนธรรมดา ระดับ ${g+1}`,wh:`มอน ${gLv(g)} เขตไหนก็ได้ · ตลาดกลาง`});}
  if(c.mb){const g=matG(n.b);o.push({x:'mb',n:c.mb,ids:LANDS().map(r=>`m_${r}_${g}_b`),nm:`วัตถุดิบมอนหายาก ระดับ ${g+1}`,wh:`มอน ${gLv(g)} เขตไหนก็ได้ · ตลาดกลาง`});}
  if(c.medal)o.push({x:'medal',n:c.medal,ids:['rmedal'],nm:'เหรียญโทเท็มทอง'});
  if(c.rg)o.push({x:'rg',n:c.rg,ids:['rg'+(n.t||1)],nm:`เมล็ดราก ขั้น ${n.t||1}`});
  if(c.z)o.push({x:'z',n:c.z,nm:'Zeny'});
  return o;}
const have=e=>e.x==='pt'?ptsLeft():e.x==='z'?zeny():e.ids.reduce((a,id)=>a+bagN(id),0);
const icoOf=e=>e.x==='z'?'<b class="rtZ">z</b>':e.x==='pt'?'<b class="rtPt">◆</b>':eIcon(e.ids.slice().sort((a,b)=>bagN(b)-bagN(a))[0],18);
/* ---------------- rules ---------------- */
const ringLit=id=>(N[id].r||[]).filter(isLit).length;
const adjOK=id=>{if(CEN(id))return (N[id].r||[]).some(isLit);for(const j of ADJ[id])if(isLit(j)&&!CEN(j))return true;return false;};   /* a centre opens from its own ring (spokes are one-way) */
function treeOK(id){const k=CSK[id],s=k&&SKILLS[k];if(!s)return false;if(TEST())return true;try{return s.creq?!!s.creq():true;}catch(e){return true;}}
/* conditions of one node: [{ok, t}] (goods + points separate) */
function conds(id){const n=N[id],o=[];if(n.k==='h')return o;
  o.push({ok:PLV()>=(n.lv||1),t:`เลเวล ${n.lv||1} ขึ้นไป (ตอนนี้ ${PLV()})`});
  o.push({ok:adjOK(id),t:n.k==='c'||n.k==='n'||n.k==='b'?'โหนดรอบปมสว่างแล้วอย่างน้อย 1 ดวง':'ต่อจากโหนดที่จุดแล้ว (โหนดกลางปมไม่เปิดทางต่อ)'});
  if(n.k==='c'){o.push({ok:ringLit(id)>=3,t:`จุดโหนดรอบปมแล้ว ${ringLit(id)}/6 (ต้อง 3)`});
    o.push({ok:nLit()>=(n.n||0),t:`จุดรากรวมแล้ว ${nLit()}/${n.n} ดวง`});
    const s=SKILLS[CSK[id]];o.push({ok:treeOK(id),t:s?`ต้นสกิลเดิม: ${s.rq||'—'}`:'ฮีโร่นี้ไม่มีสกิล C ช่องนี้'});}
  return o;}
const goodsOK=id=>needs(N[id]).every(e=>have(e)>=e.n);
function canLight(id){if(!N[id]||isLit(id))return false;return conds(id).every(c=>c.ok)&&(TEST()||goodsOK(id));}
/* state for drawing: lit · av (can be lit now, goods aside) · lv (level not reached) · no */
let STC=null;const stOf=id=>{if(!STC){STC={};for(const n of RD.N){const i=n.id;STC[i]=isLit(i)?'lit':PLV()<(n.lv||1)?'lv':conds(i).every(c=>c.ok)?'av':'no';}}return STC[id];};
const dirtySt=()=>{STC=null;DIRTY=1;};
function pay(id){const L=needs(N[id]).sort((a,b)=>(b.x==='z')-(a.x==='z'));   /* zeny first: the only payment that can still fail */
  for(const e of L){if(e.x==='pt')continue;if(e.x==='z'){if(!payZ(e.n))return false;R.spent.z=(R.spent.z||0)+e.n;continue;}let left=e.n;
    for(const x of e.ids.slice().sort((a,b)=>bagN(b)-bagN(a))){const t=Math.min(left,bagN(x));if(t>0){bagAdd(x,-t);R.spent[x]=(R.spent[x]||0)+t;left-=t;}if(!left)break;}}
  bagSave();return true;}
function light(id,o){o=o||{};if(!canLight(id))return false;if(!TEST()&&!o.free&&!pay(id))return false;R.lit[id]=1;save();dirtySt();recalc();
  if(N[id].k==='c'&&!o.quiet){const k=CSK[id];fxLit(id,true);chat(`<b style="color:#ffd36a">🌳 รากโทเท็ม</b>: ปลดสกิล C <b>${skName(k)}</b> แล้ว — ใช้ได้ทันที · แต่งท่าด้วยเจมบนเสาโทเท็ม (G)`);say(`ปลดสกิล C: ${skName(k)}`);}
  else if(!o.quiet)fxLit(id);return true;}
function reset(){const free=TEST()||R.free>0;if(!free&&bagN('rdew')<1)return false;if(!free){bagAdd('rdew',-1);}
  if(!TEST()){for(const id in R.spent){if(id==='z'){AF.zeny=AF.zeny+R.spent.z;continue;}giveBack(id,R.spent[id]);}if(R.free>0)R.free--;}
  R.lit={};R.spent={};R.resets++;save();bagSave();dirtySt();recalc();return true;}
function giveBack(id,n){const got=AF.add?AF.add(id,n):(bagAdd(id,n),n);if(got<n)R.owed[id]=(R.owed[id]||0)+(n-got);}
function payOwed(){let any=0;for(const id in R.owed){const n=R.owed[id],got=AF.add?AF.add(id,n):(bagAdd(id,n),n);if(got>0){any=1;R.owed[id]-=got;if(R.owed[id]<=0)delete R.owed[id];}}if(any){bagSave();save();}}
/* ---------------- planning (port of roots_gen.py path_to / plan_c) ---------------- */
function heapPush(h,d,i){h.push([d,i]);let c=h.length-1;while(c>0){const p=(c-1)>>1;if(h[p][0]<=h[c][0])break;[h[p],h[c]]=[h[c],h[p]];c=p;}}
function heapPop(h){const top=h[0],last=h.pop();if(h.length){h[0]=last;let c=0;for(;;){const l=2*c+1,r=l+1;let m=c;if(l<h.length&&h[l][0]<h[m][0])m=l;if(r<h.length&&h[r][0]<h[m][0])m=r;if(m===c)break;[h[m],h[c]]=[h[c],h[m]];c=m;}}return top;}
function pathTo(lit,goals,plv){const dist=new Map(),prev=new Map(),h=[];for(const i of lit){dist.set(i,0);heapPush(h,0,i);}
  while(h.length){const [d,i]=heapPop(h);if(d>(dist.has(i)?dist.get(i):1e9))continue;
    if(goals.has(i)&&!lit.has(i)){const out=[];let j=i;while(!lit.has(j)){out.push(j);j=prev.get(j);}return out.reverse();}
    if(CEN(i))continue;
    for(const j of ADJ[i]){const nj=N[j];if(nj.k==='h'||(CEN(j)&&!goals.has(j))||(nj.lv||1)>plv)continue;const nd=d+pt(nj);
      if(nd<(dist.has(j)?dist.get(j):1e9)){dist.set(j,nd);prev.set(j,i);heapPush(h,nd,j);}}}
  return null;}
function plan(id){const n=N[id];if(!n||isLit(id))return [];const plv=Math.max(PLV(),n.lv||1),lit=new Set(['H',...Object.keys(R.lit)]),order=[];
  const inS=j=>lit.has(j)||order.includes(j),opened=j=>{for(const k of ADJ[j])if(inS(k)&&!CEN(k))return true;return false;};
  if(!CEN(id)){const p=pathTo(lit,new Set([id]),plv);return p||null;}
  const ring=n.r;if(!ring.some(j=>lit.has(j))){const p=pathTo(lit,new Set(ring),plv);if(!p)return null;order.push(...p);}
  const needR=n.k==='c'?3:1;while(ring.filter(inS).length<needR){const j=ring.find(q=>!inS(q)&&opened(q)&&(N[q].lv||1)<=plv);if(!j)return null;order.push(j);}
  if(n.k==='c')while(lit.size-1+order.length<(n.n||0)){const cand=RD.N.filter(m=>m.k==='m'&&!inS(m.id)&&(m.lv||1)<=plv&&opened(m.id))
      .sort((a,b)=>a.b-b.b||Math.hypot(a.x-n.x,a.y-n.y)-Math.hypot(b.x-n.x,b.y-n.y));if(!cand.length)return null;order.push(cand[0].id);}
  order.push(id);return order;}
function planCost(p){const t={pt:0},nm={};for(const id of p)for(const e of needs(N[id])){t[e.x]=(t[e.x]||0)+e.n;if(!nm[e.x])nm[e.x]=e;}return {t,nm};}
/* ---------------- effects ---------------- */
const BONK={critd:'critDmg',atkp:'atkPct',matkp:'matkPct',boss:'bossDmg',spc:'spCost',spm:'spPct'};
let EF={bon:{},spr:0,ign:0,mign:0,res:0,pred:0,mred:0,sk:{},br:{}},EFsig='';
const OFF=()=>!!window.__ROOTS_OFF;
function recalc(){const e={bon:{},spr:0,ign:0,mign:0,res:0,pred:0,mred:0,sk:{},br:{}},add=(k,v)=>{e.bon[k]=Math.round(((e.bon[k]||0)+v)*100)/100;};
  for(const id in R.lit){const n=N[id];if(!n||n.k==='h'||n.k==='c')continue;if(n.k==='b'){if(n.bb)e.br[n.bb]=1;continue;}const s=n.s,v=n.v||0;
    switch(s){case 'skcd':case 'sksp':{const k=CSK[knotOf(id)];if(k){const o=e.sk[k]||(e.sk[k]={cd:0,sp:0});if(s==='skcd')o.cd+=v;else o.sp+=v;}break;}
      case 'spr':e.spr+=v;break;case 'ign':e.ign+=v;break;case 'mign':e.mign+=v;break;case 'res':e.res+=v;break;case 'pred':e.pred+=v;break;case 'mred':e.mred+=v;break;
      case 'race':add('r_'+n.q,v);break;case 'el':add('e_'+n.q,v);break;case 'xel':add('x_'+n.q,v);break;default:add(BONK[s]||s,v);}}
  EF=e;const sg=JSON.stringify([e,OFF()]);if(sg!==EFsig){EFsig=sg;try{applyStats();}catch(x){}}
  try{if(window.totemGems)totemGems.apply();}catch(x){}}
{const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);if(!OFF())for(const k in EF.bon)BON[k]=(BON[k]||0)+EF.bon[k];return r;};window.gearCalc=gearCalc;}
{const _dv=derive;derive=function(){const r=_dv.apply(this,arguments);if(r&&EF.spr&&!OFF())r.spReg+=EF.spr;return r;};window.derive=derive;}
{const _h=hurt;window.hurt=hurt=function(e,mult,o){o=o||{};if(OFF()||(!EF.ign&&!EF.mign)||!e||e.dead||o.dot)return _h(e,mult,o);
  const m=e.m||{},HT=typeof hitType==='function'?hitType(o):'p',mag=HT==='m'||(HT==='b'&&D.mag>D.patk),p=Math.min(50,mag?EF.mign:EF.ign),cut=p?Math.round((mag?(m.mdef||0):(m.def||0))*p/100):0;
  if(!cut)return _h(e,mult,o);const p0=o._msCut;o._msCut=(p0||0)+cut;try{return _h(e,mult,o);}finally{o._msCut=p0;}};}
{const FX=window.itemFx,_t=FX&&FX.takenMul;if(_t)FX.takenMul=function(e,mag){const m=_t.call(FX,e,mag);if(OFF())return m;const p=mag?EF.mred:EF.pred;return p?m*(1-Math.min(30,p)/100):m;};}
function hookRes(){if(hookRes.ok||!window.MSF||typeof MSF.debuffT!=='function')return;hookRes.ok=1;const _d=MSF.debuffT;
  MSF.debuffT=function(k,dur){const d=_d.apply(MSF,arguments);return EF.res&&!OFF()&&d>0?d*(1-Math.min(50,EF.res)/100):d;};}
const brOf=k=>{const s=SKILLS[k];return !s?null:s.br==='C'?colOf(k):s.br;};
const curSk=()=>window.SKCTX||(player.action&&player.action.skill)||null;
let A4=0;
{const _c=castSkillNow;window.castSkillNow=castSkillNow=function(key,c){if(OFF())return _c(key,c);const mp0=player.mp,ok=_c(key,c);if(!ok)return ok;
  const br=brOf(key),spent=Math.max(0,mp0-player.mp),sk=EF.sk[key];let back=0,cd=0,free=false;
  if(sk){back+=sk.sp;cd+=sk.cd;}
  if(br==='A'&&EF.br.A2&&++A4>=4){A4=0;free=true;back=spent;}
  if((br==='A'&&EF.br.A3)||(br==='B'&&EF.br.B3))cd+=.5;
  if(br==='basic'&&EF.br.basic3)back+=2;
  back=Math.min(spent,back);if(back>0)player.mp=Math.min(player.maxMp,player.mp+back);
  if(cd>0&&player.cd[key]>0)player.cd[key]=Math.max(0,player.cd[key]-cd);
  if(free)try{addFx(new DText({x:player.x,y:player.y,z:104,text:'ราก: ไม่เสีย SP',color:'#ffd36a',size:11,life:.8}));}catch(e){}
  return ok;};}
{const _ab=addBuff;window.addBuff=addBuff=function(k,dur){const key=curSk();if(!OFF()&&EF.br.basic2&&key&&brOf(key)==='basic'&&dur>0&&dur<600)dur+=2;return _ab(k,dur);};}
{const _cc=applyCC;window.applyCC=applyCC=function(e,cc){const key=curSk();if(cc&&!OFF()&&EF.br.B2&&key&&brOf(key)==='B'){cc=Object.assign({},cc);if(cc.stun)cc.stun+=.4;if(cc.slow)cc.slow+=.4;}return _cc(e,cc);};}
/* ---------------- start: load / migrate ---------------- */
function migrate(){R=fresh();R.mig=1;let on=[];try{if(window.totemGems)totemGems.apply();}catch(e){}
  const LV=G('LV')||{};for(const k in SKILLS)if(SKILLS[k].br==='C'&&LV[k]>0&&CNODE[k])on.push(k);
  const got=[];for(const k of on){const p=plan(CNODE[k]);if(!p||!p.length)continue;let need=0;for(const id of p)need+=pt(N[id]);if(!TEST()&&ptsUsed()+need>ptsTotal())continue;
    for(const id of p)R.lit[id]=1;got.push(k);}
  R.seen=PLV()>=31?1:0;save();
  if(got.length&&!TEST())setTimeout(()=>chat(`<b style="color:#ffd36a">🌳 รากโทเท็ม</b>: สกิล C ย้ายมาปลดที่รากโทเท็มแล้ว — สกิลที่เคยใส่เจมไว้ (${got.map(skName).join(', ')}) จุดรากให้ฟรีตามแต้มที่มี · รีเซ็ตฟรี 1 ครั้ง (กด U)`),2500);}
R=load();if(!R)migrate();
for(const k of ['lit','spent','owed'])if(!R[k]||typeof R[k]!=='object')R[k]={};
for(const id in R.lit)if(!N[id])delete R.lit[id];
recalc();
const API=window.ROOTS={ready:true,N,CSK,CNODE,
  cOn:k=>{const id=CNODE[k];return !!(id&&R.lit[id]);},
  sig:()=>Object.keys(R.lit).length+':'+KNOT.map(id=>R.lit[id]?1:0).join(''),
  lit:id=>isLit(id),light,reset,plan,conds,needs,eff:()=>JSON.parse(JSON.stringify(EF)),data:()=>R,key:SKEY,
  pts:()=>({total:ptsTotal(),used:ptsUsed(),left:ptsLeft()}),open:(f)=>open(f),close:()=>close(),
  /* test helpers: light everything / clear without refunds */
  testAll(){for(const n of RD.N)if(n.k!=='h')R.lit[n.id]=1;save();dirtySt();recalc();},testClear(){R.lit={};R.spent={};save();dirtySt();recalc();}};
try{if(window.totemGems)totemGems.apply();}catch(e){}

/* ================= window ================= */
const AP='assets/rune/roots/',SOIL={W:1536,H:1024,cx:756,cy:488,a:503,b:386},PAD=100;
const SP=Math.max(...RD.N.map(n=>Math.hypot((Math.abs(n.x)+PAD)/RD.RX,(Math.abs(n.y)+PAD)/RD.RY))),BG_G=RD.RX*SP/SOIL.a;
const FRC={cx:254.9,cy:238.4,r:111.3},FRN={h:239,r:128};
const FAMPIC={stat:'rs_stat',off:'rs_off',slay:'rs_slay',def:'rs_def',util:'rs_util',skill:'rs_skill'};
const FAMCOL={stat:'#ff6b5a',off:'#ff9a4a',slay:'#ff7aa0',def:'#4f8ef0',util:'#5fd0f0',skill:'#ffc94a'};
const RIM={1:'#c98b4a',2:'#d6dde6',3:'#f3c34e',4:'#7ff5e0'},WID={root:10,ring:6,spoke:2};
let seed=17;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const EDG=RD.E.map(([a,b,t])=>{const A=N[a],B=N[b];let qx=null,qy=null;if(t==='root'){const mx=(A.x+B.x)/2,my=(A.y+B.y)/2,dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1,o=(rnd()-.5)*.25*L;qx=mx-dy/L*o;qy=my+dx/L*o;}return {a,b,t,qx,qy};});
const IMG={};let DIRTY=1;const img=src=>{let i=IMG[src];if(!i){i=IMG[src]=new Image();i.onload=()=>{DIRTY=1;};i.src=src;}return i;};
function skImg(k){const key='sk:'+k;if(IMG[key])return IMG[key];let src=null;try{const h=skIcon(SKILLS[k])||'';const m=/src="([^"]+)"/.exec(h);
    if(m)src=m[1];else if(/^\s*<svg/.test(h)){const s=/xmlns=/.test(h)?h:h.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);}}catch(e){}
  const i=new Image();i.onload=()=>{DIRTY=1;};if(src)i.src=src;IMG[key]=i;return i;}
const css=`#rtw{position:fixed;inset:0;z-index:59;display:none;background:#06040a;font-family:Mali,Sarabun,system-ui,sans-serif;color:#fff3c8;touch-action:none;user-select:none;-webkit-user-select:none}
#rtw.open{display:block}#rtC{position:absolute;inset:0;width:100%;height:100%;cursor:grab}#rtC.drag{cursor:grabbing}
.rtP{position:absolute;background:linear-gradient(rgba(58,36,24,.95),rgba(30,17,10,.96));border:2.5px solid #e9b44c;border-radius:16px;box-shadow:0 0 0 2.5px #3a1f14,0 8px 24px rgba(0,0,0,.55)}
#rtTop{left:10px;top:10px;padding:7px 12px 8px;max-width:min(560px,calc(100% - 80px))}
#rtTop h3{margin:0;font:700 22px Mali,Sarabun,sans-serif;color:#ffd77a;text-shadow:0 2px 0 #3a1f14;display:flex;align-items:center;gap:8px}
#rtTop h3 small{font:500 12px Sarabun,sans-serif;color:#e8d3a8}
.rtChips{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}.rtChip{font:600 12px Sarabun,sans-serif;background:#1a0e07;border:1.5px solid #8a6a3a;border-radius:10px;padding:2px 8px;color:#f3e0b8;display:inline-flex;align-items:center;gap:4px}
.rtChip.g{border-color:#ffd25a;color:#ffe9a0;background:#3a2408}.rtChip svg{display:block}
#rtSide{right:10px;top:10px;bottom:62px;width:340px;padding:12px 13px;overflow:auto;font:400 13.5px/1.45 Sarabun,sans-serif}
#rtSide h4{margin:0 0 4px;font:700 18px Mali,Sarabun,sans-serif;color:#fff3c8;display:flex;align-items:center;gap:8px}
#rtSide .tg{font:600 12.5px Sarabun,sans-serif;color:#ffd77a}.rtDs{margin-top:7px;background:#1a0e07;border:1.5px solid #6a4a2a;border-radius:10px;padding:7px 10px;font-size:14px;color:#f3e6cc}
.rtSec{margin-top:10px;font:700 13.5px Sarabun,sans-serif;color:#ffd77a;border-bottom:1px solid #6a4a2a;padding-bottom:2px}
.rtRow{display:flex;gap:7px;align-items:flex-start;margin-top:4px}.rtRow i{flex:none;font-style:normal;width:16px;text-align:center}.ok{color:#bff0a8}.no{color:#ff9a8a}
.rtCost{display:grid;grid-template-columns:20px 1fr auto;gap:3px 6px;align-items:center;margin-top:5px}.rtCost b{text-align:right;font-weight:700}.rtCost small{grid-column:2/4;color:#c9b48a;font-size:11.5px;margin-top:-3px}
.rtZ{display:inline-block;width:18px;height:18px;border-radius:50%;background:#ffd36a;color:#5a3a08;text-align:center;font:900 12px/18px Sarabun}.rtPt{color:#ffd36a;font-size:15px}
.rtB{display:block;width:100%;margin-top:9px;min-height:40px;border-radius:20px;border:2.5px solid #e9b44c;background:linear-gradient(#a8742a,#6a4214);font:700 16px Mali,Sarabun,sans-serif;color:#fff3c8;cursor:pointer;box-shadow:0 2px 0 #3a1f14}
.rtB:disabled{border-color:#7a6a4a;background:linear-gradient(#5a4a34,#3a2e20);color:#b8a888;cursor:default}.rtB.s{display:inline-block;width:auto;min-height:30px;padding:0 12px;font-size:13.5px;margin:6px 6px 0 0}
.rtB.blue{border-color:#8fd0ff;background:linear-gradient(#3a72b8,#1f3e6e)}.rtB.red{border-color:#ff9a7a;background:linear-gradient(#a8442a,#5a1e10)}
#rtBar{left:10px;bottom:10px;display:flex;gap:7px;flex-wrap:wrap;background:none;border:0;box-shadow:none}#rtBar .rtB{margin:0;width:auto;padding:0 14px;min-height:40px;font-size:14px}
#rtZoom{right:358px;bottom:10px;display:flex;flex-direction:column;gap:7px;background:none;border:0;box-shadow:none}
#rtZoom button,#rtX{width:42px;height:42px;border-radius:50%;background:linear-gradient(#5a3a22,#2a160a);border:2.5px solid #e9b44c;font:700 21px Mali,sans-serif;color:#ffe3a0;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
#rtX{position:absolute;right:360px;top:10px}
.rtCl{display:grid;grid-template-columns:34px 1fr auto;gap:6px;align-items:center;margin-top:6px;cursor:pointer;padding:3px 4px;border-radius:9px}.rtCl:hover{background:#3a2412}
.rtCl img,.rtCl .ic{width:34px;height:34px;border-radius:50%;border:2px solid #8a6a3a;object-fit:cover;background:#1a120c}.rtCl.on img{border-color:#ffd25a;box-shadow:0 0 8px #ffd25a}
.rtCl .st{font:600 11.5px Sarabun;padding:1px 7px;border-radius:9px;background:#1a0e07;border:1px solid #6a4a2a}
#rtSham{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,94vw);max-height:86vh;overflow:auto;display:none;padding:12px 14px;z-index:3}#rtSham.open{display:block}
.rtTabs{display:flex;gap:6px;margin:6px 0}.rtTabs button{flex:1;min-height:34px;border-radius:12px;border:2px solid #8a6a3a;background:#2a1a0c;color:#f3e0b8;font:700 14px Sarabun;cursor:pointer}.rtTabs button.on{border-color:#ffd25a;background:#5a3a12;color:#fff3c8}
.rtIc{display:inline-block;vertical-align:-6px;margin-right:6px;line-height:0}.rtEx{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center;background:#1a0e07;border:1.5px solid #6a4a2a;border-radius:12px;padding:7px 10px;margin-top:7px}
.rtNote{font:400 12px Sarabun;color:#c9b48a;margin-top:6px;line-height:1.45}
body.mob #rtSide,#rtw.narrow #rtSide{left:6px;right:6px;top:auto;bottom:6px;width:auto;max-height:44%;border-radius:14px}
body.mob #rtZoom,#rtw.narrow #rtZoom{right:8px;bottom:calc(44% + 14px)}body.mob #rtX,#rtw.narrow #rtX{right:8px;top:8px}
body.mob #rtBar,#rtw.narrow #rtBar{left:8px;right:auto;top:auto;bottom:calc(44% + 12px);flex-direction:row}#rtw.narrow.side0 #rtBar,#rtw.narrow.side0 #rtZoom{bottom:8px}body.mob #rtBar .rtB,#rtw.narrow #rtBar .rtB{min-height:34px;padding:0 9px;font-size:12px}
body.mob #rtTop,#rtw.narrow #rtTop{padding:5px 9px;max-width:calc(100% - 70px)}body.mob #rtTop h3,#rtw.narrow #rtTop h3{font-size:17px}body.mob .rtChip,#rtw.narrow .rtChip{font-size:10.5px;padding:1px 6px}
#rtw.side0 #rtSide{display:none}#rtw:not(.narrow) [data-b="sheet"]{display:none}#rtw.side0 #rtZoom{right:10px;bottom:10px}#rtw.side0 #rtX{right:10px}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const win=document.createElement('div');win.id='rtw';
win.innerHTML=`<canvas id="rtC"></canvas><div class="rtP" id="rtTop"></div><div class="rtP" id="rtSide"></div>
  <div class="rtP" id="rtBar"><button class="rtB" data-b="sham">🧙 หมอผีราก</button><button class="rtB" data-b="reset">♻ รีเซ็ต</button><button class="rtB" data-b="ring">🔱 วงเศษ (Y)</button><button class="rtB" data-b="sheet">📋</button>${'<button class="rtB" data-b="tall" style="display:none">🧪 จุดทั้งต้น</button><button class="rtB" data-b="tclr" style="display:none">🧪 ล้าง</button>'}</div>
  <div class="rtP" id="rtZoom"><button data-z="1" title="ซูมเข้า">+</button><button data-z="-1" title="ซูมออก">−</button><button data-z="0" title="ดูทั้งต้น">⌂</button></div>
  <button id="rtX" title="ปิด (U / Esc)">✕</button><div class="rtP" id="rtSham"></div>`;
document.body.appendChild(win);
const cv=win.querySelector('#rtC'),side=win.querySelector('#rtSide'),top=win.querySelector('#rtTop'),sham=win.querySelector('#rtSham');
let V={k:.6,cx:0,cy:0},sel=null,PLAN=null,PLANFOR=null,raf=0,DPR=1,cw=0,ch=0,rstArm=0,flash=[];
const narrow=()=>document.body.classList.contains('mob')||innerWidth<760;
function area(){const n=narrow(),sw=win.classList.contains('side0')||n?0:360,bh=n&&!win.classList.contains('side0')?Math.round(ch*.44):0;return {x:0,y:0,w:cw-sw,h:ch-bh};}
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);cw=win.clientWidth;ch=win.clientHeight;cv.width=Math.round(cw*DPR);cv.height=Math.round(ch*DPR);win.classList.toggle('narrow',narrow());DIRTY=1;}
const scr=()=>{const a=area();return {sx:a.x+a.w/2,sy:a.y+a.h/2};};
const W2S=(wx,wy)=>{const c=scr();return [(wx-V.cx)*V.k+c.sx,(wy-V.cy)*V.k+c.sy];},S2W=(sx,sy)=>{const c=scr();return [(sx-c.sx)/V.k+V.cx,(sy-c.sy)/V.k+V.cy];};
const KMIN=()=>{const a=area();return Math.max(.05,Math.min(a.w/(SOIL.W*BG_G),a.h/(SOIL.H*BG_G))*.98);},KMAX=1.6;
function clampV(){V.k=Math.max(KMIN(),Math.min(KMAX,V.k));const lx=SOIL.W*BG_G/2,ly=SOIL.H*BG_G/2;V.cx=Math.max(-lx,Math.min(lx,V.cx));V.cy=Math.max(-ly,Math.min(ly,V.cy));}
function fitAll(){V.k=KMIN();V.cx=(SOIL.W/2-SOIL.cx)*BG_G;V.cy=(SOIL.H/2-SOIL.cy)*BG_G;DIRTY=1;}
function focus(id,k){const n=N[id];if(!n)return;V.cx=n.x;V.cy=n.y;if(k)V.k=k;clampV();DIRTY=1;}
/* ---------------- drawing ---------------- */
function draw(){const x=cv.getContext('2d'),d=DPR,c=scr(),k=V.k*d,ox=c.sx*d,oy=c.sy*d,X=wx=>(wx-V.cx)*k+ox,Y=wy=>(wy-V.cy)*k+oy,W=cv.width,H=cv.height,t=performance.now()/1000;
  x.setTransform(1,0,0,1,0,0);x.fillStyle='#0a0614';x.fillRect(0,0,W,H);
  const bg=img(AP+'bg.webp');if(bg.complete&&bg.naturalWidth)x.drawImage(bg,X(-SOIL.cx*BG_G),Y(-SOIL.cy*BG_G),SOIL.W*BG_G*k,SOIL.H*BG_G*k);
  const on=(sx,sy,m)=>sx>-m&&sx<W+m&&sy>-m&&sy<H+m;
  /* edges, batched */
  const pU={root:new Path2D(),ring:new Path2D()},pL={root:new Path2D(),ring:new Path2D()},pS=new Path2D(),pSL=new Path2D(),pA=new Path2D();
  for(const e of EDG){const A=N[e.a],B=N[e.b],ax=X(A.x),ay=Y(A.y),bx=X(B.x),by=Y(B.y);if(!on(ax,ay,300*d)&&!on(bx,by,300*d))continue;
    const la=isLit(e.a),lb=isLit(e.b),L=la&&lb,P=e.t==='spoke'?(L?pSL:pS):(L?pL[e.t]:pU[e.t]);
    const seg=Q=>{Q.moveTo(ax,ay);if(e.qx!=null)Q.quadraticCurveTo(X(e.qx),Y(e.qy),bx,by);else Q.lineTo(bx,by);};seg(P);
    if(!L&&e.t!=='spoke'&&((la&&!CEN(e.a)&&stOf(e.b)==='av')||(lb&&!CEN(e.b)&&stOf(e.a)==='av')))seg(pA);}
  x.lineCap='round';x.lineJoin='round';
  x.setLineDash([4*k,5*k]);x.lineWidth=Math.max(.8,WID.spoke*k);x.strokeStyle='rgba(138,106,74,.42)';x.stroke(pS);x.strokeStyle='rgba(255,224,138,.92)';x.stroke(pSL);x.setLineDash([]);
  for(const tt of ['root','ring']){x.strokeStyle='#170c05';x.lineWidth=(WID[tt]+5)*k;x.stroke(pU[tt]);x.stroke(pL[tt]);x.strokeStyle=tt==='ring'?'#6b4a2c':'#5f3c22';x.lineWidth=WID[tt]*k;x.stroke(pU[tt]);}
  for(const tt of ['root','ring']){x.strokeStyle='rgba(255,236,150,.42)';x.lineWidth=(WID[tt]+14)*k;x.stroke(pL[tt]);x.strokeStyle='#fff0a8';x.lineWidth=Math.max(1.6*d,5.5*k);x.stroke(pL[tt]);}
  x.setLineDash([6*k,6*k]);x.lineDashOffset=-t*30*k;x.strokeStyle='rgba(255,229,138,.85)';x.lineWidth=Math.max(1.2*d,2.6*k);x.stroke(pA);x.setLineDash([]);x.lineDashOffset=0;
  /* plan path */
  if(PLAN&&PLAN.length){x.setLineDash([10*k,8*k]);x.lineDashOffset=-t*40*k;x.strokeStyle='rgba(120,220,255,.9)';x.lineWidth=Math.max(1.6*d,4*k);x.beginPath();let px=null,py=null;
    const all=[...PLAN];for(const id of all){const n=N[id];const sx=X(n.x),sy=Y(n.y);if(px===null){const pr=[...ADJ[id]].find(j=>isLit(j)&&!CEN(j));if(pr){x.moveTo(X(N[pr].x),Y(N[pr].y));x.lineTo(sx,sy);}else x.moveTo(sx,sy);}else x.lineTo(sx,sy);px=sx;py=sy;}
    x.stroke();x.setLineDash([]);x.lineDashOffset=0;}
  /* nodes */
  const LBL=[],showCode=V.k>=.72,pul=.5+.5*Math.sin(t*4);
  {const n=N.H,sx=X(n.x),sy=Y(n.y),w=190*k,hi=img(AP+'heart.webp');   /* the heart first: its ring of 6 nodes sits on its carved rim */
    x.globalAlpha=.35+.1*pul;x.fillStyle='#ffcf5a';x.beginPath();x.arc(sx,sy,w*.5,0,7);x.fill();x.globalAlpha=1;if(hi.complete&&hi.naturalWidth)x.drawImage(hi,sx-w/2,sy-w/2,w,w);
    if(V.k>=.4)LBL.push([sx,sy+w*.52,'หัวใจราก','#ffe3a0',12]);}
  for(const n of RD.N){const sx=X(n.x),sy=Y(n.y);if(n.k==='h'||!on(sx,sy,90*d))continue;const s=stOf(n.id),L=s==='lit';
    if(n.k==='m'){const K=RD.K[n.s]||{f:'stat'},f=K.f,c=FAMCOL[f]||'#ccc',r=17*k,w=2*r*192/182;
      if(L){x.globalAlpha=.42;x.fillStyle=c;x.beginPath();x.arc(sx,sy,r*1.8,0,7);x.fill();x.globalAlpha=1;}
      const pic=img(AP+(L?FAMPIC[f]:s==='lv'?'rs_hole':'rs_dim')+'.webp');if(pic.complete&&pic.naturalWidth)x.drawImage(pic,sx-w/2,sy-w/2,w,w);
      else{x.fillStyle=L?c:'#3a2a1c';x.beginPath();x.arc(sx,sy,r,0,7);x.fill();}
      if(!L&&s!=='lv'){x.strokeStyle=c;x.globalAlpha=.75;x.lineWidth=Math.max(.9,2.4*k);x.beginPath();x.arc(sx,sy,r*.62,0,7);x.stroke();x.globalAlpha=1;}
      if(s==='av'){x.strokeStyle=`rgba(255,229,138,${.55+.45*pul})`;x.lineWidth=Math.max(1.2*d,2.2*k);x.setLineDash([4*k,3*k]);x.beginPath();x.arc(sx,sy,r*1.55,0,7);x.stroke();x.setLineDash([]);}
      if(showCode)LBL.push([sx,sy+r+10*d,K.s||'',L?'#fff3c8':'#d8c6a0',10]);}
    else if(n.k==='n'||n.k==='b'){const r=21*k*1.3,isN=n.k==='n',c=isN?(FAMCOL[(RD.K[n.s]||{}).f]||'#ccc'):'#ffb347',sc=r*1.25/(isN?FRN.h:240),w=512*sc,pic=img(AP+(isN?'fr_n':'fr_b')+'.webp');
      if(L){x.globalAlpha=.45;x.fillStyle=c;x.beginPath();x.arc(sx,sy,r*1.7,0,7);x.fill();x.globalAlpha=1;}
      if(!L)x.globalAlpha=.55;if(pic.complete&&pic.naturalWidth)x.drawImage(pic,sx-256*sc,sy-256*sc,w,w);x.globalAlpha=1;
      if(isN){x.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3,q=FRN.r*sc;i?x.lineTo(sx+Math.cos(a)*q,sy+Math.sin(a)*q):x.moveTo(sx+Math.cos(a)*q,sy+Math.sin(a)*q);}x.closePath();
        if(L){x.globalAlpha=.85;x.fillStyle=c;x.fill();x.globalAlpha=1;}x.strokeStyle=c;x.lineWidth=Math.max(1,2.2*k);x.stroke();}
      if(s==='av'){x.strokeStyle=`rgba(255,229,138,${.55+.45*pul})`;x.lineWidth=Math.max(1.4*d,2.6*k);x.setLineDash([5*k,4*k]);x.beginPath();x.arc(sx,sy,r*1.45,0,7);x.stroke();x.setLineDash([]);}
      if(V.k>=.45)LBL.push([sx,sy+4*d,isN?((RD.K[n.s]||{}).s||'+3'):(n.c==='A'?'A':n.c==='B'?'B':'พฐ'),L?'#2a1206':'#fff3c8',isN?11:13,1]);}
    else{/* C knot */const r=36*k*1.12,sc=r/FRC.r,w=512*sc,k2=CSK[n.id];
      if(L){x.globalAlpha=.4+.15*pul;x.fillStyle='#ffcf5a';x.beginPath();x.arc(sx,sy,r*1.75,0,7);x.fill();x.globalAlpha=1;}
      else{x.globalAlpha=.16;x.fillStyle='#ffd77a';x.beginPath();x.arc(sx,sy,r*1.6,0,7);x.fill();x.globalAlpha=1;}
      const fr=img(AP+'fr_c.webp');if(fr.complete&&fr.naturalWidth)x.drawImage(fr,sx-FRC.cx*sc,sy-FRC.cy*sc,w,w);
      x.save();x.beginPath();x.arc(sx,sy,r,0,7);x.clip();x.fillStyle='#1a120c';x.fillRect(sx-r,sy-r,2*r,2*r);const ic=k2&&skImg(k2);
      if(ic&&ic.complete&&ic.naturalWidth)x.drawImage(ic,sx-r*1.32,sy-r*1.32,r*2.64,r*2.64);if(!L){x.fillStyle='rgba(10,6,4,.5)';x.fillRect(sx-r,sy-r,2*r,2*r);}x.restore();
      if(s==='av'){x.strokeStyle=`rgba(255,229,138,${.55+.45*pul})`;x.lineWidth=Math.max(2*d,4*k);x.setLineDash([9*k,6*k]);x.beginPath();x.arc(sx,sy,r*1.5,0,7);x.stroke();x.setLineDash([]);}
      LBL.push([sx,sy+r*1.6+12*d,(k2?skName(k2):'—')+' · '+TIERT[n.t],L?'#ffe9a0':'#fff3c8',V.k>=.5?12.5:11,0,RIM[n.b]]);
      if(!L&&V.k>=.5){const on=ringLit(n.id);LBL.push([sx+r*1.15,sy-r*1.2,`ปม ${on}/6`,on>=3?'#e8ffd8':'#ffe0d0',10.5,0,on>=3?'#bff0a8':'#ff9a7a']);}}
    if(PLAN&&PLAN.includes(n.id)){x.strokeStyle='rgba(120,220,255,.95)';x.lineWidth=Math.max(1.4*d,2.4*k);x.beginPath();x.arc(sx,sy,(n.k==='c'?48:n.k==='m'?24:34)*k,0,7);x.stroke();}
    if(n.id===sel){x.strokeStyle='#fff3b8';x.lineWidth=Math.max(2*d,3.4*k);x.setLineDash([8*k,5*k]);x.lineDashOffset=-t*20*k;x.beginPath();x.arc(sx,sy,(n.k==='c'?56:n.k==='m'?28:40)*k,0,7);x.stroke();x.setLineDash([]);x.lineDashOffset=0;}}
  /* light-up bursts */
  flash=flash.filter(f=>t-f.t<.9);for(const f of flash){const n=N[f.id],sx=X(n.x),sy=Y(n.y),q=(t-f.t)/.9;x.globalAlpha=1-q;x.strokeStyle=f.c?'#fff3b8':'#ffe08a';x.lineWidth=(f.c?6:3)*d*(1-q)+1;
    x.beginPath();x.arc(sx,sy,(f.c?60:24)*k+(f.c?90:40)*k*q,0,7);x.stroke();if(f.c){x.fillStyle='rgba(255,230,150,.35)';x.beginPath();x.arc(sx,sy,(60+120*q)*k,0,7);x.fill();}x.globalAlpha=1;}
  /* labels last */
  x.textAlign='center';x.textBaseline='middle';
  for(const [lx,ly,tx,col,fs,inner,box] of LBL){x.font=`700 ${fs*d}px Mali,Sarabun,sans-serif`;if(inner){x.fillStyle=col;x.fillText(tx,lx,ly);continue;}
    const tw=x.measureText(tx).width+12*d,th=(fs+7)*d;x.globalAlpha=.86;x.fillStyle='#120a05';x.beginPath();x.roundRect?x.roundRect(lx-tw/2,ly-th/2,tw,th,7*d):x.rect(lx-tw/2,ly-th/2,tw,th);x.fill();x.globalAlpha=1;
    if(box){x.strokeStyle=box;x.lineWidth=1.2*d;x.stroke();}x.lineWidth=3*d;x.strokeStyle='#140a04';x.strokeText(tx,lx,ly+.5*d);x.fillStyle=col;x.fillText(tx,lx,ly+.5*d);}}
function fxLit(id,c){flash.push({id,t:performance.now()/1000,c:!!c||N[id].k==='c'});DIRTY=1;}
let lastT=0;function loop(ts){if(!win.classList.contains('open'))return;raf=requestAnimationFrame(loop);if(ts-lastT<33&&!DIRTY)return;lastT=ts;DIRTY=0;try{draw();}catch(e){if(!loop.err){loop.err=1;console.warn('roots draw',e);}}}
/* ---------------- side panel ---------------- */
const icon=k=>{try{return skIcon(SKILLS[k]);}catch(e){return '';}};
function chips(){const P=API.pts();top.innerHTML=`<h3>🌳 รากโทเท็ม <small>${(SKILLS[Object.keys(SKILLS)[0]]&&G('JOB')&&G('JOB').name)||''} · Lv ${PLV()}</small></h3>
  <div class="rtChips"><span class="rtChip g">◆ แต้ม ${TEST()?'∞ (ทดสอบ)':`${P.left} / ${P.total}`}</span><span class="rtChip">จุดแล้ว ${nLit()} ดวง</span>
  <span class="rtChip">${eIcon('rsap',14)} ${fmt(bagN('rsap'))}</span><span class="rtChip">${eIcon('rmedal',14)} ${fmt(bagN('rmedal'))}</span>
  <span class="rtChip">สกิล C ${KNOT.filter(id=>R.lit[id]&&CSK[id]).length}/${Object.keys(CNODE).length}</span>${PLV()<31&&!TEST()?'<span class="rtChip" style="border-color:#ff9a7a">เปิดที่ Lv 31</span>':''}</div>`;}
function effSummary(){const e=EF,o=[],K=RD.K,lab={critDmg:'critd',atkPct:'atkp',matkPct:'matkp',bossDmg:'boss',spCost:'spc',spPct:'spm'};
  for(const b in e.bon){const v=e.bon[b];let t;if(/^r_/.test(b))t=`ดาเมจใส่เผ่า${RACE_TH[b.slice(2)]||b.slice(2)} +${v}%`;else if(/^e_/.test(b))t=`ดาเมจใส่ธาตุ${EL_TH[b.slice(2)]||b.slice(2)} +${v}%`;
    else if(/^x_/.test(b))t=`ต้านธาตุ${EL_TH[b.slice(2)]||b.slice(2)} +${v}%`;else{const kk=lab[b]||b;t=K[kk]?K[kk].t.replace('{v}',v):`${b} +${v}`;}o.push(t);}
  if(e.spr)o.push(`ฟื้น SP ต่อรอบ +${e.spr}`);if(e.ign)o.push(`เจาะ DEF ${e.ign}%`);if(e.mign)o.push(`เจาะ MDEF ${e.mign}%`);if(e.res)o.push(`ติดสถานะสั้นลง ${e.res}%`);
  if(e.pred)o.push(`รับดาเมจกายภาพ −${e.pred}%`);if(e.mred)o.push(`รับดาเมจเวท −${e.mred}%`);
  for(const k in e.sk){const s=e.sk[k];o.push(`${skName(k)}: ${s.cd?'คูลดาวน์ −'+s.cd+' วิ':''}${s.cd&&s.sp?' · ':''}${s.sp?'SP −'+s.sp:''}`);}
  for(const b in e.br){const n=RD.N.find(q=>q.k==='b'&&q.bb===b);if(n)o.push('◆ '+n.tx);}
  return o;}
function homeCard(){const cs=KNOT.filter(id=>CSK[id]).sort((a,b)=>N[a].t-N[b].t||'basicAB'.indexOf(N[a].c)-'basicAB'.indexOf(N[b].c));
  const ef=effSummary();
  side.innerHTML=`<h4>รากใต้เสาโทเท็ม</h4><div class="rtDs">เดินรากจากหัวใจ (กลาง) ออกไป · โหนดเล็กให้สเตตัส · ปม ◉ = <b>ปลดสกิล C</b> (ต้องจุดรอบปม 3/6 + จุดรวม 25 / 40 / 55 / 70 ดวง + ของฟาร์ม) · ลึก = เลเวลสูง ของแพง · แตะโหนดดูเงื่อนไข · 🧭 วางเส้นทางให้อัตโนมัติ</div>
  <div class="rtSec">สกิล C (${cs.filter(id=>R.lit[id]).length}/${cs.length})</div>
  ${cs.map(id=>{const n=N[id],k=CSK[id],L=!!R.lit[id],lvOK=PLV()>=n.lv;return `<div class="rtCl ${L?'on':''}" data-go="${id}">${icon(k).replace('<img','<img style="width:34px;height:34px;border-radius:50%"')}<div><b>${skName(k)}</b><br><small>${BRN[n.c]} · ${TIERT[n.t]} · Lv ${n.lv} · จุดรวม ${n.n}</small></div><span class="st ${L?'ok':lvOK?'':'no'}">${L?'✓ ปลดแล้ว':lvOK?'🧭 ไป':'Lv '+n.lv}</span></div>`;}).join('')}
  <div class="rtSec">รากให้อะไรตอนนี้</div><div style="font-size:12.5px">${ef.length?ef.map(t=>'· '+t).join('<br>'):'<span class="rtNote">ยังไม่ได้จุดราก</span>'}</div>
  <div class="rtNote">รีเซ็ต: ${TEST()?'ฟรี (ทดสอบ)':R.free>0?'ครั้งแรกฟรี':`น้ำค้างราก 1 ขวด (มี ${bagN('rdew')})`} — คืนแต้มและของครบ${window.__ROOTS_OFF?'<br><b class="no">__ROOTS_OFF: ผลของรากปิดอยู่ (bench)</b>':''}</div>`;
  side.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{select(b.dataset.go);focus(b.dataset.go,Math.max(V.k,.62));});}
function costRows(list){return list.map(e=>{const h=have(e),ok=TEST()||h>=e.n;return `${icoOf(e)}<span>${e.nm}</span><b class="${ok?'ok':'no'}">${e.x==='pt'&&TEST()?'—':`${fmt(h)} / ${fmt(e.n)}`}</b>${ok?'':`<small>${e.wh||WHERE[e.x]||''}</small>`}`;}).join('');}
function nodeCard(id){const n=N[id],s=stOf(id),L=s==='lit',k=CSK[id];let h='';
  const head=n.k==='c'&&k?`<span style="width:44px;height:44px;flex:none;border-radius:50%;overflow:hidden;border:2.5px solid ${L?'#ffd25a':'#8a6a3a'};display:inline-block">${icon(k).replace('<img','<img style="width:100%;height:100%;object-fit:cover"')}</span>`:'';
  const nm=n.k==='h'?'หัวใจราก':n.k==='c'?(k?skName(k):'—'):n.k==='b'?'โบนัสสาย':n.k==='n'?'โหนดใหญ่':'โหนดราก';
  h+=`<h4>${head}<span>${nm}<br><span class="tg">${n.k==='h'?'จุดเริ่ม':`ชั้น ${n.b} · Lv ${n.lv}+ · ${n.k==='c'?BRN[n.c]+' '+TIERT[n.t]:n.k==='b'?BRN[n.c]:(RD.FAM[(RD.K[n.s]||{}).f]||'')}`}</span></span></h4>`;
  h+=`<div class="rtDs">${nodeTxt(n)}${n.k==='c'&&k&&SKILLS[k].th?`<br><small style="color:#d9c39a">${SKILLS[k].th}</small>`:''}</div>`;
  if(n.k==='h'){h+=`<div class="rtNote">รากทุกเส้นเริ่มจากที่นี่</div>`;side.innerHTML=h;return;}
  if(L){h+=`<div class="rtSec ok">✓ จุดแล้ว</div>`;if(n.k==='c')h+=`<button class="rtB blue" data-a="pole">💎 แต่งท่าด้วยเจมบนเสาโทเท็ม (G)</button>`;side.innerHTML=h;bindCard(id);return;}
  const cs=conds(id);h+=`<div class="rtSec">เงื่อนไข</div>`+cs.map(c=>`<div class="rtRow"><i class="${c.ok?'ok':'no'}">${c.ok?'✓':'✗'}</i><span class="${c.ok?'':'no'}">${c.t}</span></div>`).join('');
  h+=`<div class="rtSec">ของที่ใช้ ${TEST()?'<small class="ok">(โหมดทดสอบ: ฟรี)</small>':''}</div><div class="rtCost">${costRows(needs(n))}</div>`;
  const can=canLight(id);h+=`<button class="rtB" data-a="light" ${can?'':'disabled'}>✦ ${n.k==='c'?'ปลดสกิล C':'จุดราก'}</button>`;
  if(PLANFOR===id&&PLAN){const pc=planCost(PLAN);h+=`<div class="rtSec">🧭 เส้นทาง: ${PLAN.length} ดวง</div><div class="rtCost">${Object.keys(pc.t).filter(x=>pc.t[x]>0).map(x=>{const e=Object.assign({},pc.nm[x],{n:pc.t[x]});
      if(x==='pt')e.x='pt';return `${icoOf(e)}<span>${e.nm}</span><b class="${TEST()||have(e)>=e.n?'ok':'no'}">${x==='pt'&&TEST()?'—':`${fmt(have(e))} / ${fmt(e.n)}`}</b>`;}).join('')}</div>
    <button class="rtB blue" data-a="walk">🧭 จุดตามเส้นทาง (ทีละดวงจนกว่าของ / แต้มจะไม่พอ)</button><button class="rtB s" data-a="unplan">ล้างเส้นทาง</button>`;}
  else if(s!=='av')h+=`<button class="rtB blue" data-a="plan">🧭 วางเส้นทางไปโหนดนี้</button>`;
  side.innerHTML=h;bindCard(id);}
function bindCard(id){side.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
  if(a==='light'){if(light(id)){if(PLAN){PLAN=PLAN.filter(q=>!isLit(q));if(!PLAN.length)PLAN=null;}}else say('ยังจุดไม่ได้ — ดูเงื่อนไข / ของที่ขาด');refresh();}
  else if(a==='plan'){const p=plan(id);if(!p){say('หาเส้นทางไม่ได้ (เลเวลยังไม่ถึงชั้นที่ต้องผ่าน)');return;}PLAN=p;PLANFOR=id;refresh();}
  else if(a==='unplan'){PLAN=null;PLANFOR=null;refresh();}
  else if(a==='walk'){let n=0,stop=null;for(const q of PLAN.slice()){if(isLit(q))continue;if(!light(q,{quiet:N[q].k!=='c'})){stop=q;break;}n++;}
    PLAN=PLAN.filter(q=>!isLit(q));if(!PLAN.length){PLAN=null;PLANFOR=null;}
    if(stop){const why=conds(stop).find(c=>!c.ok);const lack=needs(N[stop]).find(e=>have(e)<e.n);say(`จุดได้ ${n} ดวง · หยุดที่ ${nodeTxt(N[stop])}: ${why?why.t:lack?lack.nm+' ไม่พอ':'—'}`);select(stop);focus(stop);return;}
    say(`จุดตามเส้นทางแล้ว ${n} ดวง`);refresh();}
  else if(a==='pole'){close();try{totemGems.open();}catch(e){}}});}
function select(id){sel=id;DIRTY=1;if(narrow())win.classList.remove('side0');if(id)nodeCard(id);else homeCard();}
function refresh(){chips();if(sel)nodeCard(sel);else homeCard();shamBuild();DIRTY=1;}
/* ---------------- shaman: boss parts → root skill gems, feathers, dew ---------------- */
let shTab='ex';
const partsOf=bt=>Object.keys(AF.ETC).filter(id=>AF.ETC[id].kind==='bpart'&&AF.ETC[id].btier===bt);
const partN=bt=>partsOf(bt).reduce((a,id)=>a+bagN(id),0);
const BT={map:'บอสประจำแมพ',mvp:'MVP',main:'บอสใหญ่'};
function exOK(req,z){return req.every(([bt,n])=>partN(bt)>=n)&&zeny()>=z;}
function exDo(t,alt){const E=RU.COST.ex[t],req=alt?E.alt:E.parts;if(!req||!exOK(req,E.z)||!payZ(E.z))return;
  for(const [bt,n] of req){let left=n;for(const id of partsOf(bt).sort((a,b)=>bagN(b)-bagN(a))){const q=Math.min(left,bagN(id));if(q>0){bagAdd(id,-q);left-=q;}if(!left)break;}}
  bagAdd('rg'+t,1);bagSave();say(`ได้ เมล็ดราก ขั้น ${t}`);refresh();}
function shamBuild(){if(!sham.classList.contains('open'))return;let b='';
  if(shTab==='ex')b=[1,2,3,4].map(t=>{const E=RU.COST.ex[t],row=(req,alt)=>`<div class="rtEx"><div><span class="rtIc">${eIcon('rg'+t,22)}</span><b>เมล็ดราก ขั้น ${t}</b> ← ${req.map(([bt,n])=>`ชิ้นส่วน${BT[bt]} <b class="${partN(bt)>=n?'ok':'no'}">${partN(bt)}/${n}</b>`).join(' + ')} + <b class="${zeny()>=E.z?'ok':'no'}">${fmt(E.z)}z</b></div><button class="rtB s" data-ex="${t}" data-alt="${alt?1:0}" ${exOK(req,E.z)?'':'disabled'}>แลก</button></div>`;
      return row(E.parts,0)+(E.alt?row(E.alt,1):'');}).join('')+`<div class="rtNote">ชิ้นส่วนบอสของบอสตัวไหนก็ได้ในระดับนั้น (ใช้ตัวที่มีมากสุดก่อน) · มีอยู่: แมพ ${partN('map')} · MVP ${partN('mvp')} · บอสใหญ่ ${partN('main')} · เมล็ดรากยังดรอปจากบอสตรงๆ และซื้อขายในตลาดกลางได้</div>`;
  else b=[['rfeather','คัมภีร์หมอผี — อ่านหินรูนดิบ (วงเศษโทเท็ม Y)'],['rdew','น้ำค้างราก — รีเซ็ตรากทั้งต้น คืนของครบ']].map(([id,d])=>{const p=RU.COST.shop[id];
      return `<div class="rtEx"><div><span class="rtIc">${eIcon(id,22)}</span><b>${AF.ETC[id].th}</b> · ${fmt(p)}z · มี ${bagN(id)}<br><small style="color:#c9b48a">${d}</small></div><div><button class="rtB s" data-buy="${id}" data-n="1" ${zeny()>=p?'':'disabled'}>×1</button><button class="rtB s" data-buy="${id}" data-n="10" ${zeny()>=p*10?'':'disabled'}>×10</button></div></div>`;}).join('');
  sham.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><h4 style="margin:0;font:700 19px Mali,Sarabun;color:#ffd77a">🧙 หมอผีราก</h4><span class="rtNote" style="margin:0 0 0 auto">${fmt(zeny())}z</span><button class="rtB s" data-x="1" style="margin:0">✕</button></div>
    <div class="rtTabs"><button data-t="ex" class="${shTab==='ex'?'on':''}">แลกเมล็ดราก</button><button data-t="shop" class="${shTab==='shop'?'on':''}">ร้าน</button></div>${b}`;
  sham.querySelector('[data-x]').onclick=()=>{sham.classList.remove('open');};
  sham.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{shTab=x.dataset.t;shamBuild();});
  sham.querySelectorAll('[data-ex]').forEach(x=>x.onclick=()=>exDo(+x.dataset.ex,x.dataset.alt==='1'));
  sham.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>{const id=x.dataset.buy,n=+x.dataset.n,p=RU.COST.shop[id]*n;if(!payZ(p))return;const got=AF.add(id,n);if(got<n){AF.zeny=AF.zeny+RU.COST.shop[id]*(n-got);say('กระเป๋าเต็ม');}bagSave();refresh();});}
API.shop=()=>{if(!win.classList.contains('open'))open();shTab='shop';sham.classList.add('open');shamBuild();};
/* ---------------- input ---------------- */
const ptrs=new Map();let drag=null,pinch=null,moved=0;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=0;
  if(ptrs.size===1)drag={x:e.clientX,y:e.clientY,cx:V.cx,cy:V.cy};else if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),k:V.k,m:S2W((a[0]+b[0])/2,(a[1]+b[1])/2)};drag=null;}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch&&ptrs.size>=2){const [a,b]=[...ptrs.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);V.k=pinch.k*d/Math.max(1,pinch.d);clampV();const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,w=S2W(mx,my);V.cx+=pinch.m[0]-w[0];V.cy+=pinch.m[1]-w[1];clampV();moved=99;DIRTY=1;}
  else if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));if(moved>5){cv.classList.add('drag');V.cx=drag.cx-dx/V.k;V.cy=drag.cy-dy/V.k;clampV();DIRTY=1;}}});
function up(e){const was=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);cv.classList.remove('drag');if(ptrs.size<2)pinch=null;if(!was)return;
  if(ptrs.size===0){if(moved<=5)tap(e.clientX,e.clientY);drag=null;}else if(ptrs.size===1){const [p]=[...ptrs.values()];drag={x:p[0],y:p[1],cx:V.cx,cy:V.cy};}}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect(),m=S2W(e.clientX-r.left,e.clientY-r.top);V.k*=Math.exp(-e.deltaY*.0015);clampV();const w=S2W(e.clientX-r.left,e.clientY-r.top);V.cx+=m[0]-w[0];V.cy+=m[1]-w[1];clampV();DIRTY=1;},{passive:false});
function tap(cx0,cy0){const r=cv.getBoundingClientRect(),[wx,wy]=S2W(cx0-r.left,cy0-r.top);let best=null,bd=1e9;
  for(const n of RD.N){const rad=(n.k==='c'?44:n.k==='h'?80:n.k==='m'?20:30)+10/V.k,d=Math.hypot(n.x-wx,n.y-wy);if(d<rad&&d<bd){bd=d;best=n.id;}}
  if(best)select(best===sel?null:best);else{select(null);}}
win.querySelectorAll('#rtZoom [data-z]').forEach(b=>b.onclick=()=>{const z=+b.dataset.z;if(!z)fitAll();else{V.k*=z>0?1.35:1/1.35;clampV();DIRTY=1;}});
win.querySelector('#rtX').onclick=()=>close();
win.querySelectorAll('#rtBar [data-b]').forEach(b=>b.onclick=()=>{const a=b.dataset.b;
  if(a==='sham'){sham.classList.toggle('open');shamBuild();}
  else if(a==='ring'){close();try{window.RING&&RING.open();}catch(e){}}
  else if(a==='reset'){const free=TEST()||R.free>0;if(!nLit()){say('ยังไม่ได้จุดราก');return;}
    if(!free&&bagN('rdew')<1){say('ต้องใช้น้ำค้างราก 1 ขวด (🧙 หมอผีราก → ร้าน)');return;}
    if(Date.now()-rstArm>3000){rstArm=Date.now();b.textContent='♻ แตะอีกครั้งเพื่อรีเซ็ต';setTimeout(()=>{b.textContent='♻ รีเซ็ต';},3000);return;}
    rstArm=0;b.textContent='♻ รีเซ็ต';if(reset()){PLAN=null;PLANFOR=null;sel=null;say(`รีเซ็ตรากแล้ว — คืนแต้มและของครบ${free&&!TEST()?' (ครั้งแรกฟรี)':''}`);}refresh();}
  else if(a==='sheet'){win.classList.toggle('side0');DIRTY=1;}
  else if(a==='tall'){API.testAll();refresh();}else if(a==='tclr'){API.testClear();refresh();}});
addEventListener('resize',()=>{if(win.classList.contains('open')){resize();clampV();}});
function open(f){if(PLV()<31&&!TEST())say('รากโทเท็มเปิดที่ Lv 31 — ดูผังได้ก่อน');payOwed();win.classList.add('open');resize();
  win.querySelectorAll('[data-b="tall"],[data-b="tclr"]').forEach(b=>b.style.display=TEST()?'':'none');dirtySt();if(f&&(N[f]||CNODE[f])){const id=N[f]?f:CNODE[f];sel=id;focus(id,.62);if(!isLit(id)&&stOf(id)!=='av'){const p=plan(id);if(p){PLAN=p;PLANFOR=id;}}}
  else if(!V.init){V.init=1;if(nLit()){fitAll();}else focus('H',.62);}
  clampV();refresh();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}
function close(){win.classList.remove('open');sham.classList.remove('open');cancelAnimationFrame(raf);}
addEventListener('keydown',e=>{const tg=(e.target&&e.target.tagName)||'';if(/INPUT|TEXTAREA/.test(tg)||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==='u'||e.key==='U'||e.code==='KeyU'){win.classList.contains('open')?close():open();}else if(e.key==='Escape'&&win.classList.contains('open'))close();});
/* menu button */
(function addBtn(){const mg=document.getElementById('mgrid');if(!mg||!mg.children.length){setTimeout(addBtn,300);return;}if(mg.querySelector('[data-m="mgroots"]'))return;
  const b=document.createElement('button');b.dataset.m='mgroots';b.title='รากโทเท็ม (U)';
  /* painted button = the owner's root heart (assets/rune/roots/heart.webp) */
  if(window.RUNEDATA)b.innerHTML=`<span class="kb">U</span><img src="assets/rune/roots/heart.webp" alt="" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;transform:scale(1.18)">`;else
  b.innerHTML=`<span class="kb">U</span><svg viewBox="0 0 40 40"><path d="M20 4 v14 M20 18 Q12 22 7 34 M20 18 Q28 22 33 34 M20 18 Q18 27 14 36 M20 18 Q23 27 27 36" stroke="#3a1f14" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 4 v14 M20 18 Q12 22 7 34 M20 18 Q28 22 33 34 M20 18 Q18 27 14 36 M20 18 Q23 27 27 36" stroke="#b07a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="20" cy="18" r="6.5" fill="#ffd25a" stroke="#3a1f14" stroke-width="2.4"/><circle cx="7" cy="34" r="3" fill="#ff6b5a" stroke="#3a1f14" stroke-width="1.6"/><circle cx="33" cy="34" r="3" fill="#4f8ef0" stroke="#3a1f14" stroke-width="1.6"/><circle cx="14" cy="36" r="2.6" fill="#5fd0f0" stroke="#3a1f14" stroke-width="1.4"/><circle cx="27" cy="36" r="2.6" fill="#ffc94a" stroke="#3a1f14" stroke-width="1.4"/></svg>`;
  b.addEventListener('click',e=>{e.stopPropagation();e.stopImmediatePropagation();win.classList.contains('open')?close():open();},true);mg.appendChild(b);})();
/* the skill tree's C nodes open the roots; tooltips say how the C skill is unlocked */
{const _skc=window.skChange;if(typeof _skc==='function')window.skChange=skChange=function(k,d){const s=SKILLS[k];if(s&&s.br==='C'&&!window.__GEMS_ALL){open(k);return;}return _skc(k,d);};}
{const _tip=window.skTip;if(typeof _tip==='function')window.skTip=skTip=function(k,l){const h=_tip(k,l);const s=SKILLS[k];if(!s||s.br!=='C'||!CNODE[k])return h;const id=CNODE[k],n=N[id];
  return h+`<div style="margin-top:6px;padding:5px 8px;border-radius:8px;background:#2a1a0c;border:1.5px solid #8a6a3a;color:#ffe9a0;font-size:12.5px">🌳 <b>รากโทเท็ม</b>: ${R.lit[id]?'✓ ปลดแล้ว ใช้ได้เลย<br><span style="color:#d8c8a0">อยากแต่งเพิ่ม: สกัดเป็นเจม C ที่ศาลโทเท็ม (G → ⛏ ศาล) แล้ววางบนเสาโทเท็ม</span>'
    :`ยังไม่ปลด (${TIERT[n.t]})<br><span style="color:#d8c8a0">① Lv ${n.lv} ② จุดรากรวม ${n.n} ดวง ③ จุดโหนดรอบปมครบ 3 ใน 6 ④ เมล็ดราก ขั้น ${n.t} 1 เมล็ด (บอสดรอป / แลกที่หมอผีราก)</span>`}</div>`;};}   /* 2026-11-24: the steps spelled out */
/* ticker: level-ups (Lv 31 notice), menu dot, owed refunds, the status-length hook (milestones.js loads after this file) */
let tk=0,lastLv=PLV();
setInterval(()=>{hookRes();const lv=PLV();if(lv!==lastLv){lastLv=lv;dirtySt();if(win.classList.contains('open'))refresh();}
  if(!TEST()&&lv>=31&&!R.seen){R.seen=1;save();chat('<b style="color:#ffd36a">🌳 รากโทเท็มเปิดแล้ว!</b> — ได้แต้มราก 4 แต้มทุกเลเวล · จุดโหนดด้วยยางวิญญาณ (มอน Lv 28+) · กด U หรือปุ่ม 🌳');say('รากโทเท็มเปิดแล้ว (U)');}
  const b=document.querySelector('#mgrid [data-m="mgroots"]');if(b&&++tk%4===0){let dot=false;if(!TEST()&&lv>=31&&ptsLeft()>0)for(const n of RD.N){if(n.k==='m'&&stOf(n.id)==='av'&&goodsOK(n.id)){dot=true;break;}}b.classList.toggle('gdNew',dot);}},1000);
})();
