/* =====================================================================
   PETS — phase 1 (owner 2026-11-22 23:32: 1ก 2ก 3ข 4ข 5 collar only on boss pets 6ข 7 start) · design PET_SYSTEM_TH.md · data pet_data.js
   • Tame: lock a 🐾 monster → the 🐾 ผูกใจ button on the target frame throws a bond charm of its land / tier → it calms down 12 s (stops,
     no attacks, AUTO leaves it) → every charm +1 heart → 3 / 4 / 5 hearts = an egg in the bag. Hitting it (any damage) or 12 s without a
     charm = the hearts are gone (hit = it gets angry). No random.
   • Egg → hatch in the pet window (P / 🐾 menu): zeny fee, quality rolled with the gem table (pity 20 / 50 per hero), personality lines.
   • A pet does NOT fight (owner 3ข): it follows the hero and gives flat stats like a classic RO pet — main stat by bond, a sub line from
     bond 3, a gift stat at bond 10, its personality lines. Bond 0–1,000: kills together, bosses, petting (click / tap it), sitting.
     No hunger (owner 4ข). Box of 6 per hero (owner 6ข): save af_pets_<hero>[_play].
   • Hooks: gearCalc (bonuses → BON) · onKill (bond) · hurt / hitPlayer (break taming, 'in a fight') · jgEnemyTick (a calm monster stands
     still) · command / TL.autoPick (no attacking a calm monster) · canvas pointerdown capture (petting).
   • Off in the bench (window.__RFL_OFF, set by tools/balance_bench.js) and with window.__PET_OFF.
   ===================================================================== */
(function(){
if(typeof PS==='undefined'||!window.PETDATA||!window.AFItems||typeof gearCalc!=='function')return;
const PD=window.PETDATA,A=window.AFItems,SP=PD.SPECIES;
const HERO=(()=>{try{return (0,eval)('CHAR');}catch(e){return 'wolf';}})();
const MODE=A.MODE,TEST=()=>MODE!=='play',SKEY='af_pets_'+HERO+(MODE==='play'?'_play':'');
const OFF=()=>!!(window.__PET_OFF||window.__RFL_OFF);
const BOX_MAX=6,THROW_R=320,CALM_T=12,PET_CD=10*60,SIT_T=120,KILL_CAP=60,SIT_CAP=20,FIGHT_CALM=5;
const $=s=>document.querySelector(s),esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const QL=()=>PD.QUAL();
/* ---------------- save ---------------- */
const fresh=()=>({v:1,box:[],act:null,seq:1,pe:0,pl:0,day:'',dk:0,ds:0,lp:0,cx:{}});
let S=(()=>{try{const o=JSON.parse(localStorage.getItem(SKEY)||'null');if(o&&o.v===1)return Object.assign(fresh(),o);}catch(e){}return fresh();})();
if(A.fresh&&S.box.length){S=fresh();}                                  // a brand-new hero starts with an empty box
function save(){try{localStorage.setItem(SKEY,JSON.stringify(S));}catch(e){}}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
function dayRoll(){const t=today();if(S.day!==t){S.day=t;S.dk=0;S.ds=0;}}
const byId=id=>S.box.find(p=>p.id===id)||null,active=()=>S.act?byId(S.act):null;
/* ---------------- bond + bonuses ---------------- */
const lvOf=bp=>{let L=1;for(let i=1;i<PD.BOND.length;i++)if(bp>=PD.BOND[i])L=i+1;return L;};
function bonusOf(p){const s=SP[p.sp],o={};if(!s)return o;const L=lvOf(p.bp||0),Q=QL()[p.q]||QL()[0],add=(k,v)=>{if(v)o[k]=(o[k]||0)+v;};
  add(s.st,Math.floor(L/2)+(L>=2?PD.Q_MAIN[p.q]||0:0));
  if(L>=3){const [k,mx]=s.sub;add(k,Math.max(1,Math.round(mx*PD.SUBF[L]*Q.m)));}
  if(L>=10)add(s.gift[0],s.gift[1]);
  for(const [k,r] of p.ln||[]){const P=PD.PERS[k];if(P)add(k,P[1][r-1]||0);}
  return o;}
const fmtB=b=>Object.keys(b).map(k=>`${PD.LBL[k]||k} +${b[k]}`).join(' · ')||'—';
{const _gc=gearCalc;gearCalc=function(){const r=_gc.apply(this,arguments);try{if(!OFF()){const p=active();if(p){const b=bonusOf(p);for(const k in b)BON[k]=(BON[k]||0)+b[k];}}}catch(e){}return r;};window.gearCalc=gearCalc;}
function restat(){try{applyStats();}catch(e){}}
function gain(n,why){const p=active();if(!p||OFF()||n<=0)return;const L0=lvOf(p.bp);p.bp=Math.min(PD.BOND[PD.BOND.length-1],(p.bp||0)+n);const L1=lvOf(p.bp);save();
  if(L1>L0){restat();emote('note',1.6);const b=bonusOf(p);chatLog('sys',`<b style="color:#ff7aa8">♥ ความผูกพันกับ ${esc(p.nm)} ขึ้นเป็นขั้น ${L1} (${PD.BOND_N[L1-1]})</b> · ${fmtB(b)}`);
    if(L1===10)addFx(new DText({x:player.x,y:player.y,z:96,text:'คู่ใจ!',color:'#ff7aa8',size:16,life:1.4}));}
  if($('#petw.open'))build();}
/* ---------------- quality + personality ---------------- */
function rollQ(){S.pe++;S.pl++;const r=Math.random();let q=r<.01?4:r<.06?3:r<.20?2:r<.50?1:0;
  if(S.pl>=PD.PITY.leg)q=4;else if(S.pe>=PD.PITY.epic&&q<3)q=3;
  if(q>=4){S.pl=0;S.pe=0;}else if(q>=3)S.pe=0;return q;}
function rollRank(q){const rk=(QL()[q]||QL()[0]).rk||[1];let r=Math.random(),i=0;for(;i<rk.length;i++){if(r<rk[i])break;r-=rk[i];}return Math.min(5,i+1);}
function rollLines(q,keep){const n=(QL()[q]||QL()[0]).lines||1,out=(keep||[]).filter(l=>l[2]).slice(0,n),used=new Set(out.map(l=>l[0])),keys=Object.keys(PD.PERS);
  while(out.length<n){const k=keys[Math.floor(Math.random()*keys.length)];if(used.has(k))continue;used.add(k);out.push([k,rollRank(q),0]);}
  return out;}
function newPet(sp,q){const s=SP[sp];if(q==null)q=rollQ();const p={id:'p'+(S.seq++),sp,nm:s.th,q,bp:0,ln:rollLines(q),born:Date.now()};S.box.push(p);S.cx[sp]=1;save();return p;}
/* ---------------- summon / switch ---------------- */
let FIGHT=-99;const fightNow=()=>{FIGHT=typeof gameTime==='number'?gameTime:0;};
function canSwitch(){if(TEST())return true;try{if(A.townHere())return true;}catch(e){}return (gameTime-FIGHT)>=FIGHT_CALM;}
function summon(id){if(!canSwitch()){msg(`ยังสู้อยู่ — รอ ${Math.ceil(FIGHT_CALM-(gameTime-FIGHT))} วิ หรือเข้าเมือง แล้วค่อยสลับสัตว์เลี้ยง`);return false;}
  S.act=id;save();restat();if(W.fx)W.fx.gone=1;W.fx=null;ensureWorld(true);const p=active();
  if(p){chatLog('sys',`🐾 พา <b>${esc(p.nm)}</b> ออกเดินทาง · ${fmtB(bonusOf(p))}`);emote('heart',1.2);}return true;}
function dismiss(){if(!S.act)return;if(!canSwitch()){msg(`ยังสู้อยู่ — รอ ${Math.ceil(FIGHT_CALM-(gameTime-FIGHT))} วิ แล้วค่อยให้สัตว์เลี้ยงพัก`);return;}
  S.act=null;save();restat();if(W.fx){W.fx.gone=1;W.fx=null;}}

/* ================================================================
   1. TAMING
   ================================================================ */
const specOf=e=>e&&!e.dead&&!e.boss&&!e.mbPart&&!e.mbOf&&!e.bossKey&&e.vdef&&PD.BYNAME[e.vdef.name]?SP[PD.BYNAME[e.vdef.name]]:null;
function charmFor(s){const B=A.BAG,ok=[];for(const id in B){const E=A.ETC[id];if(!E||E.kind!=='pcharm'||!(B[id]>0))continue;
    if((s.land==='cap'||E.land===s.land)&&E.tier>=s.tier)ok.push([E.tier,E.land===s.land?0:1,id]);}
  ok.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);return ok.length?ok[0][2]:null;}
const charmNeed=s=>s.land==='cap'?`เครื่องรางผูกใจแดนไหนก็ได้ ขั้น ${s.tier}+`:`${PD.LANDS[s.land].ch} ขั้น ${s.tier}+`;
const bagRoom=id=>(A.BAG[id]||0)>0||Object.keys(A.BAG).length<60;
let throwCd=0;
function throwCharm(e){e=e||(window.TL&&TL.e);const s=specOf(e);
  if(!s){msg('ตัวนี้เลี้ยงไม่ได้ — มองหามอนที่มี 🐾 ในกรอบเป้า');return;}
  if(player.hp<=0||throwCd>0)return;
  const d=Math.hypot(e.x-player.x,e.y-player.y);if(d>THROW_R){msg(`ไกลเกินไป — เข้าไปใกล้อีกหน่อย (โยนได้ ${THROW_R})`);return;}
  const pt=e._pt;if(pt&&pt.h>=pt.need)return;
  if((!pt||pt.h+1>=s.hearts)&&!bagRoom('pegg_'+s.k)){msg('กระเป๋าเต็ม — ทิ้งหรือฝากของก่อน แล้วค่อยผูกใจ');return;}
  let id=charmFor(s);if(!id&&!TEST()){msg(`ต้องมี ${charmNeed(s)} (ร้านค้าในเมือง${s.land==='cap'?'ทุกแดน':(A.TOWNS[s.land]||{}).name||''})`);return;}
  if(id){A.bagAdd(id,-1);A.save();}
  throwCd=.45;if(player.attackTarget===e)player.attackTarget=null;
  try{faceTo(Math.atan2(e.y-player.y,e.x-player.x));}catch(err){}
  addFx(new CharmFly(e,s,(A.ETC[id]||{}).land||s.land));fightNow();}
function soften(e,s){if(!specOf(e))return;let pt=e._pt;
  if(!pt){pt=e._pt={h:0,need:s.hearts,t:CALM_T,sp:s.k};e.mbNoAuto=true;e.atk=0;e.aggro=0;if(player.attackTarget===e)player.attackTarget=null;addFx(new CalmMark(e));
    chatLog('sys',`🐾 <b>${esc(s.th)}</b> ใจอ่อนแล้ว — โยนเครื่องรางให้ครบ ${s.hearts} ดวงภายใน ${CALM_T} วิ อย่าตีมัน`);}
  pt.h++;pt.t=CALM_T;pt.pop=gameTime;
  if(pt.h>=pt.need)tamed(e,s);}
function calmEnd(e,why){const pt=e&&e._pt;if(!pt)return;e._pt=null;e.mbNoAuto=false;
  if(why==='hit'){e.aggro=6;msg(`ผูกใจล้มเหลว — ${SP[pt.sp]?SP[pt.sp].th:'มัน'}ตกใจเพราะโดนตี`);addFx(new HeartBreak(e));}
  else if(why==='time'){msg('ผูกใจล้มเหลว — โยนเครื่องรางไม่ทันเวลา');addFx(new HeartBreak(e));}}
function tamed(e,s){e._pt=null;e.mbNoAuto=false;const id='pegg_'+s.k,got=A.bagAdd(id,1);A.save();S.cx[s.k]=1;save();
  addFx(new EggPop(e.x,e.y,s,got>0));
  if(got>0)chatLog('sys',`<b style="color:#ff7aa8">🐾 ผูกใจสำเร็จ!</b> ได้ <b>ไข่${esc(s.th)}</b> — ฟักได้ในหน้าต่างสัตว์เลี้ยง (P)`);else msg('กระเป๋าเต็ม — ไข่หล่นหายไป');
  if(player.attackTarget===e)player.attackTarget=null;e.dead=true;e.deadT=3.18;e.hp=0;e._tamed=1;
  if(window.GUIDE&&GUIDE.bump)try{GUIDE.bump('tame');}catch(err){}}
/* a calm monster stands still (jgEnemyTick hook, re-wrapped by the keeper if a hero module replaces it) */
let PREV=null;const HOOK=function(e,dt){if(e._pt){e.atk=0;e.vx=0;e.vy=0;e._mv=0;e.aggro=0;const dx=player.x-e.x;if(Math.abs(dx)>4)e.face=dx>0?1:-1;return true;}return PREV?PREV(e,dt):false;};
function hookTick(){if(window.jgEnemyTick!==HOOK){PREV=window.jgEnemyTick||null;window.jgEnemyTick=HOOK;}}
hookTick();
{const _h=hurt;hurt=function(e){if(e&&e._pt&&!e.dead)calmEnd(e,'hit');fightNow();return _h.apply(this,arguments);};window.hurt=hurt;}
if(typeof hitPlayer==='function'){const _hp=hitPlayer;hitPlayer=function(){fightNow();return _hp.apply(this,arguments);};}
if(typeof command==='function'){const _c=command;command=function(c){if(c&&c.kind==='attack'&&c.e&&c.e._pt){if(!(typeof autoMode!=='undefined'&&autoMode))msg('มันกำลังใจอ่อน — อย่าตี! กด 🐾 ผูกใจ โยนเครื่องรางต่อ');return;}return _c.apply(this,arguments);};}
if(window.TL&&TL.autoPick){const _ap=TL.autoPick;TL.autoPick=function(){const e=_ap.apply(this,arguments);return e&&e._pt?null:e;};}
if(window.TL&&TL.autoPrime){const _pr=TL.autoPrime;TL.autoPrime=function(){if(TL.e&&TL.e._pt)return;return _pr.apply(this,arguments);};}   /* AUTO's lock shortcut sets attackTarget directly */
{const _ok=onKill;onKill=function(e){_ok.apply(this,arguments);try{petKill(e);}catch(err){}};}
function petKill(e){const p=active();if(!p||OFF()||!e||e._tamed)return;dayRoll();
  if((e.boss&&!e.mini)||e.bossKey||e.fen){gain(15,'boss');return;}
  const lv=(e.m&&e.m.lv)||1;if(lv<PS.lv-10||S.dk>=KILL_CAP)return;S.dk++;gain(1,'kill');}

/* ---------------- drawing helpers (world, sorted layer) ---------------- */
function heartPath(g,x,y,s){g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.6,y-s*.2,x-s*.7,y-s*1.3,x,y-s*.45);g.bezierCurveTo(x+s*.7,y-s*1.3,x+s*1.6,y-s*.2,x,y+s*.9);g.closePath();}
function heart(g,x,y,s,fill,al){g.save();g.globalAlpha*=al==null?1:al;heartPath(g,x,y,s);g.fillStyle=fill?'#ff5d8a':'rgba(255,255,255,.35)';g.fill();g.lineWidth=1.3;g.strokeStyle=fill?'#5a1020':'rgba(90,16,32,.75)';g.stroke();
  if(fill){g.beginPath();g.ellipse(x-s*.45,y-s*.35,s*.28,s*.18,-.6,0,TAU);g.fillStyle='rgba(255,255,255,.75)';g.fill();}g.restore();}
function egg(g,x,y,s,cols,rot){g.save();g.translate(x,y);g.rotate(rot||0);g.beginPath();g.ellipse(0,-s*1.15,s*.82,s*1.05,0,0,TAU);g.fillStyle=cols[0];g.fill();g.lineWidth=Math.max(1.2,s*.12);g.strokeStyle='#3a2a1f';g.stroke();
  g.fillStyle=cols[1];for(const [a,b,r] of [[-.3,-1.45,.2],[.32,-.95,.26],[-.15,-.55,.14],[.35,-1.7,.12]]){g.beginPath();g.arc(a*s,b*s,r*s,0,TAU);g.fill();}
  g.beginPath();g.ellipse(-s*.35,-s*1.55,s*.16,s*.3,-.5,0,TAU);g.fillStyle='rgba(255,255,255,.7)';g.fill();g.restore();}
const sprH=e=>{try{return MSPR_H(e);}catch(err){return 40;}};
class CharmFly{constructor(e,s,land){this.layer='sorted';this.e=e;this.s=s;this.t=0;this.T=.34;this.x0=player.x;this.y0=player.y;this.col=(PD.LANDS[land]||PD.LANDS.vik).col;this.sy=player.y;}
  update(dt){this.t+=dt;const k=Math.min(1,this.t/this.T);this.sy=this.y0+(this.e.y-this.y0)*k;if(k>=1){if(!this.e.dead)soften(this.e,this.s);return false;}return true;}
  draw(){const k=Math.min(1,this.t/this.T),e=this.e,x=this.x0+(e.x-this.x0)*k,y=this.y0+(e.y-this.y0)*k,z=38+(sprH(e)*.6-38)*k+Math.sin(k*Math.PI)*46,[px,py]=P(x,y,z);
    ctx.save();ctx.translate(px,py);ctx.rotate(k*TAU*1.5);ctx.globalAlpha=.35;ctx.fillStyle=this.col;ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(5,0);ctx.lineTo(0,6);ctx.lineTo(-5,0);ctx.closePath();ctx.fillStyle=this.col;ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#3a2a1f';ctx.stroke();ctx.restore();heart(ctx,px+7,py-7,3.2,1);}}
class CalmMark{constructor(e){this.layer='sorted';this.e=e;this.sy=e.y+1;this.t=0;}
  update(dt){this.t+=dt;this.sy=this.e.y+1;return !!this.e._pt&&!this.e.dead;}
  draw(){const e=this.e,pt=e._pt;if(!pt)return;const H=sprH(e),[gx,gy]=P(e.x,e.y,0),[hx,hy]=P(e.x,e.y,H+14),pop=Math.max(0,1-(gameTime-(pt.pop||0))/.35);
    ctx.save();ctx.globalAlpha=.4+.15*Math.sin(gameTime*4);ctx.strokeStyle='#ff8ab8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(gx,gy+1,(e.r||18)+10,((e.r||18)+10)*.36,0,0,TAU);ctx.stroke();ctx.restore();
    const n=pt.need,sp=13,x0=hx-(n-1)*sp/2;
    ctx.save();ctx.fillStyle='rgba(30,16,30,.55)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x0-11,hy-12,(n-1)*sp+22,24,10);else ctx.rect(x0-11,hy-12,(n-1)*sp+22,24);ctx.fill();
    const fr=Math.max(0,pt.t/CALM_T);ctx.fillStyle=fr<.3?'#ff6a5a':'#ffd36a';ctx.fillRect(x0-6,hy+8,((n-1)*sp+12)*fr,2.5);ctx.restore();
    for(let i=0;i<n;i++){const f=i<pt.h,s=4.6*(f&&i===pt.h-1?1+.5*pop:1);heart(ctx,x0+i*sp,hy-1,s,f);}
    if(Math.random()<.04)addFx(new FloatHeart(e.x+rnd(-10,10),e.y,H*.7));}}
class FloatHeart{constructor(x,y,z,c){this.layer='sorted';this.x=x;this.y=y;this.z=z;this.t=0;this.sy=y+2;this.c=c;}
  update(dt){this.t+=dt;return this.t<1.1;}draw(){const k=this.t/1.1,[x,y]=P(this.x+Math.sin(this.t*5)*4,this.y,this.z+k*26);heart(ctx,x,y,3.4+2*Math.sin(k*Math.PI),1,Math.sin(k*Math.PI));}}
class HeartBreak{constructor(e){this.layer='sorted';this.e=e;this.x=e.x;this.y=e.y;this.z=sprH(e)+10;this.t=0;this.sy=e.y+2;}
  update(dt){this.t+=dt;return this.t<.8;}
  draw(){const k=this.t/.8,[x,y]=P(this.x,this.y,this.z+k*10),a=1-k,s=8;ctx.save();ctx.globalAlpha=a;
    for(const sd of [-1,1]){ctx.save();ctx.translate(x+sd*k*8,y+k*6);ctx.rotate(sd*k*.6);ctx.beginPath();ctx.rect(sd<0?-s*2:0,-s*2,s*2,s*4);ctx.clip();heartPath(ctx,0,0,s);ctx.fillStyle='#8a8a9a';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#2a2a3a';ctx.stroke();ctx.restore();}
    ctx.restore();}}
class EggPop{constructor(x,y,s,ok){this.layer='sorted';this.x=x;this.y=y;this.s=s;this.ok=ok;this.t=0;this.sy=y+1;}
  update(dt){this.t+=dt;if(this.t>.9){this.sy=player.y+1;}if(this.t>1.35){if(this.ok)addFx(new DText({x:player.x,y:player.y,z:76,text:'+ ไข่'+this.s.th,color:'#ff9ac0',size:13,life:1.6}));return false;}return true;}
  draw(){const t=this.t,cols=this.s.egg;let x=this.x,y=this.y,z,sc;
    if(t<.9){const k=t/.9;z=Math.abs(Math.sin(k*Math.PI*2.2))*(1-k)*34;sc=Math.min(1,t/.18)*(1+.25*Math.max(0,1-t/.25));}
    else{const k=Math.min(1,(t-.9)/.45);x=this.x+(player.x-this.x)*k;y=this.y+(player.y-this.y)*k;z=Math.sin(k*Math.PI)*40+k*30;sc=1-k*.7;}
    const [px,py]=P(x,y,z),[gx,gy]=P(x,y,0);ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(gx,gy+1,9*sc,3*sc,0,0,TAU);ctx.fill();ctx.restore();
    if(t<.35){ctx.save();ctx.globalAlpha=1-t/.35;ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(px,py-10,30*(t/.35)+6,0,TAU);ctx.fill();ctx.restore();}
    egg(ctx,px,py,11*sc,cols,Math.sin(t*14)*.18*(t<.9?1-t/.9:0));
    if(t<.9&&Math.random()<.3)addFx(new FloatHeart(x+rnd(-12,12),y,16));}}

/* ================================================================
   2. THE PET IN THE WORLD
   ================================================================ */
const W={fx:null,trail:[],em:null};
function emote(kind,dur){W.em={k:kind,t:0,T:dur||1.4};}
class PetFx{constructor(p){this.layer='sorted';this.p=p;const s=SP[p.sp],m=window.MSPR&&MSPR[s.name];this.s=s;this.m=m;
    this.e={spr:s.name,boss:true,bsc:Math.min(1,34/((m&&m.h)||34)),face:1,bob:Math.random()*6,st:{},atk:0,x:0,y:0,_mv:0};
    this.x=player.x-30;this.y=player.y-8;this.sy=this.y;this.stuck=0;this.t=0;this.sleep=0;this.place(true);}
  place(snap){const [tx,ty]=this.target();if(snap||!curMap||!mapBlockedW(tx,ty)){this.x=tx;this.y=ty;}else{this.x=player.x;this.y=player.y;}this.e.x=this.x;this.e.y=this.y;}
  target(){const tr=W.trail;let need=58,px=player.x,py=player.y;
    if(tr.length>1&&gameTime-(W.mvT||0)<.7){for(let i=tr.length-1;i>0;i--){const a=tr[i],b=tr[i-1],L=Math.hypot(a.x-b.x,a.y-b.y);if(L>=need){const k=need/L,qx=a.x+(b.x-a.x)*k,qy=a.y+(b.y-a.y)*k,nx=-(a.y-b.y)/L,ny=(a.x-b.x)/L;
          /* walk beside the path, not right behind the hero (keeps both readable); stay on the side it is already on */
          const sd=(this.x-qx)*nx+(this.y-qy)*ny;if(Math.abs(sd)>6)this.side=sd>0?1:-1;const s2=this.side||1;return [qx+nx*26*s2,qy+ny*26*s2];}need-=L;px=b.x;py=b.y;}return [px,py];}
    const hf=Math.cos(player.phi||0)>=0?1:-1;return [player.x-38*hf,player.y-7];}
  update(dt){if(this.gone||OFF()||!curMap||S.act!==this.p.id)return false;this.t+=dt;const [tx,ty]=this.target(),dx=tx-this.x,dy=ty-this.y,d=Math.hypot(dx,dy);
    if(d>520){this.place(true);puff(this.x,this.y);return true;}
    let mv=false;if(d>5){const sp=Math.min(300,Math.max(40,d*4.2)),st=Math.min(d,sp*dt),nx=this.x+dx/d*st,ny=this.y+dy/d*st;
      if(curMap&&mapBlockedW(nx,ny)){if(!mapBlockedW(nx,this.y))this.x=nx;else if(!mapBlockedW(this.x,ny))this.y=ny;else this.stuck+=dt;}else{this.x=nx;this.y=ny;this.stuck=0;}
      if(this.stuck>1.2){this.stuck=0;this.place(true);puff(this.x,this.y);}
      mv=st>.4;if(Math.abs(dx)>2)this.e.face=dx>0?1:-1;}
    else{const hf=Math.cos(player.phi||0)>=0?1:-1;this.e.face=hf;}
    this.e._mv=mv?.14:Math.max(0,(this.e._mv||0)-dt);this.e.x=this.x;this.e.y=this.y;this.sy=this.y;
    this.sleep=player.sitting?Math.min(1,this.sleep+dt*2):Math.max(0,this.sleep-dt*3);
    if(W.em){W.em.t+=dt;if(W.em.t>W.em.T)W.em=null;}
    return true;}
  draw(){const m=this.m||(window.MSPR&&MSPR[this.s.name]);if(!m)return;this.m=m;const fly=!!m.fly,lift=fly?14+Math.sin(this.t*3)*3:0,[x,y]=P(this.x,this.y,0),H=(m.h||34)*this.e.bsc;
    if(fly){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle='#27324a';ctx.beginPath();ctx.ellipse(x,y+1,(m.sw||16)*this.e.bsc*.8,(m.sw||16)*this.e.bsc*.22,0,0,TAU);ctx.fill();ctx.restore();}
    ctx.save();if(this.sleep>0){ctx.translate(x,y);ctx.scale(1,1-.12*this.sleep);ctx.translate(-x,-y);}
    try{MSPR_DRAW(this.e,x,y-lift,1,0,0);}catch(err){}ctx.restore();
    const q=this.p.q;if(q>=2&&Math.random()<.05*(q-1)){const c=(QL()[q]||{}).c||'#fff';addFx(new Glint(this.x+rnd(-12,12),this.y,lift+rnd(6,H),c));}
    /* name tag under the feet */
    const nm=this.p.nm,L=lvOf(this.p.bp||0),hide=this.y<player.y&&player.y-this.y<75&&Math.abs(this.x-player.x)<40;   /* tag hidden while the pet stands right behind the hero */
    if(!hide){ctx.save();ctx.font='700 10.5px Sarabun, Tahoma, sans-serif';const tw=ctx.measureText(nm).width+26,ty=y+12;
    ctx.globalAlpha=.88;ctx.fillStyle='rgba(18,34,40,.72)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x-tw/2,ty-8,tw,15,7.5);else ctx.rect(x-tw/2,ty-8,tw,15);ctx.fill();
    ctx.strokeStyle=(QL()[q]||{}).c||'#8ff0e0';ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#e8fffb';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(nm,x-tw/2+6,ty);
    heart(ctx,x+tw/2-13,ty-.5,3.1,1);ctx.fillStyle='#ffc0d6';ctx.font='800 9px Sarabun, Tahoma, sans-serif';ctx.fillText(String(L),x+tw/2-8.5,ty+.5);ctx.restore();}
    /* emotes */
    const top=y-lift-H-8;
    if(this.sleep>.5){ctx.save();ctx.fillStyle='#e8f0ff';ctx.strokeStyle='#2a3a5a';ctx.lineWidth=2.4;ctx.font='900 11px Mali, sans-serif';for(let i=0;i<3;i++){const k=((this.t*.6+i/3)%1);ctx.globalAlpha=Math.sin(k*Math.PI);const zx=x+8+k*10,zy=top-k*16;ctx.strokeText('z',zx,zy);ctx.fillText('z',zx,zy);}ctx.restore();}
    const em=W.em;if(em){const k=em.t/em.T,a=Math.min(1,(1-k)*3);
      if(em.k==='heart'){for(let i=0;i<3;i++){const kk=(k*1.5+i/3)%1;heart(ctx,x+Math.sin((kk+i)*6)*7,top-kk*22,3.6+1.6*Math.sin(kk*Math.PI),1,a*Math.sin(kk*Math.PI));}}
      else if(em.k==='note'){ctx.save();ctx.globalAlpha=a;ctx.font='900 15px Mali, sans-serif';ctx.lineWidth=3;ctx.strokeStyle='#5a2a40';ctx.fillStyle='#ffd36a';const yy=top-6-k*12;ctx.strokeText('♪',x-9,yy);ctx.fillText('♪',x-9,yy);ctx.fillStyle='#ff8ab8';ctx.strokeText('♫',x+4,yy-6);ctx.fillText('♫',x+4,yy-6);ctx.restore();}}}
  hit(sx,sy){const m=this.m;if(!m)return false;const H=(m.h||34)*this.e.bsc,lift=m.fly?14:0,[x,y]=P(this.x,this.y,lift+H*.5),X=x*Z+ox,Y=y*Z+oy,R=Math.max(18,H*.62)*Z;return Math.hypot(sx-X,sy-Y)<R;}}
class Glint{constructor(x,y,z,c){this.layer='sorted';this.x=x;this.y=y;this.z=z;this.c=c;this.t=0;this.sy=y+2;}
  update(dt){this.t+=dt;return this.t<.6;}draw(){const k=this.t/.6,[x,y]=P(this.x,this.y,this.z+k*6),s=4*Math.sin(k*Math.PI);ctx.save();ctx.globalAlpha=.9*Math.sin(k*Math.PI);ctx.fillStyle=this.c;
    ctx.beginPath();ctx.moveTo(x,y-s*1.6);ctx.lineTo(x+s*.35,y-s*.35);ctx.lineTo(x+s*1.6,y);ctx.lineTo(x+s*.35,y+s*.35);ctx.lineTo(x,y+s*1.6);ctx.lineTo(x-s*.35,y+s*.35);ctx.lineTo(x-s*1.6,y);ctx.lineTo(x-s*.35,y-s*.35);ctx.closePath();ctx.fill();ctx.restore();}}
function puff(x,y){try{dustPuff(x,y,5,'#e8e0f0',40,6);}catch(e){}}
function ensureWorld(snap){const p=active();if(!p||OFF()||!curMap){return;}if(W.fx&&!W.fx.gone&&fx.includes(W.fx)&&W.fx.p===p)return;if(W.fx)W.fx.gone=1;W.fx=addFx(new PetFx(p));if(snap)puff(W.fx.x,W.fx.y);}
/* keeper: lives on the 'none' layer (enterMap keeps it) */
let sitAcc=0,lastMap=null;
class PetKeeper{constructor(){this.layer='none';}
  update(dt){if(OFF())return true;throwCd=Math.max(0,throwCd-dt);hookTick();
    if(player.attackTarget&&player.attackTarget._pt)player.attackTarget=null;   /* nobody swings at a calm monster (AUTO, a click, a queued attack) */
    const tr=W.trail,l=tr[tr.length-1];if(!l||Math.hypot(player.x-l.x,player.y-l.y)>9){if(l&&Math.hypot(player.x-l.x,player.y-l.y)>200)tr.length=0;tr.push({x:player.x,y:player.y});W.mvT=gameTime;if(tr.length>40)tr.shift();}
    if(curMap!==lastMap){lastMap=curMap;tr.length=0;if(W.fx){W.fx.gone=1;W.fx=null;}}
    ensureWorld(false);
    for(const e of enemies){if(e._pt){e._pt.t-=dt;if(e._pt.t<=0||e.dead)calmEnd(e,e.dead?'gone':'time');}}
    const p=active();if(p&&player.sitting){sitAcc+=dt;if(sitAcc>=SIT_T){sitAcc=0;dayRoll();if(S.ds<SIT_CAP){S.ds++;gain(1,'sit');}}}
    tameBtn();return true;}
  draw(){}}
addFx(new PetKeeper());
/* petting: click / tap on your pet (capture phase, before the ground click and the joystick) */
{const cv=document.getElementById('c');if(cv)cv.addEventListener('pointerdown',ev=>{const f=W.fx;if(!f||f.gone||OFF()||!f.hit(ev.clientX,ev.clientY))return;
  ev.stopImmediatePropagation();ev.preventDefault();petPet();},true);}
function petPet(){const p=active();if(!p)return;dayRoll();emote('heart',1.4);const now=Date.now()/1000;
  if(now-(S.lp||0)>=PET_CD){S.lp=now;save();gain(2,'pet');addFx(new DText({x:W.fx.x,y:W.fx.y,z:52,text:'♥ +2',color:'#ff8ab8',size:12,life:1.1}));}
  else{const m=Math.ceil((PET_CD-(now-S.lp))/60);if(!petPet.n||Date.now()-petPet.n>4000){petPet.n=Date.now();msg(`${p.nm} ดีใจ ♥ (ลูบได้แต้มผูกพันอีกใน ${m} นาที)`);}}}

/* ================================================================
   3. TAME BUTTON on the target frame (#tlf, target_lock.js) — PC + phone
   ================================================================ */
let TB=null;
function tameBtn(){const F=$('#tlf');if(!F)return;if(!TB||!F.contains(TB)){TB=document.createElement('button');TB.id='petTame';TB.type='button';F.appendChild(TB);
    ['pointerdown','mousedown','touchstart','click'].forEach(ev=>TB.addEventListener(ev,e=>e.stopPropagation()));TB.addEventListener('pointerdown',e=>{e.preventDefault();throwCharm();});}
  const e=window.TL&&TL.e,s=specOf(e);if(!s||!F.classList.contains('on')){if(TB.style.display!=='none')TB.style.display='none';return;}
  const pt=e._pt,id=charmFor(s),n=id?A.BAG[id]:0,have=!!id||TEST(),h=pt?`${'♥'.repeat(pt.h)}${'♡'.repeat(pt.need-pt.h)}`:`${'♡'.repeat(s.hearts)}`,
    lab=`<b>🐾 ผูกใจ</b><span>${h}</span><small>${have?(id?`×${n}`:'ทดสอบ'):'ไม่มีเครื่องราง'}</small>`,cls=(have?'':'no ')+(pt?'calm':'');
  if(TB.dataset.l!==lab||TB.className!==cls){TB.dataset.l=lab;TB.className=cls;TB.innerHTML=lab;TB.title=`${s.th} · ต้องใช้ ${charmNeed(s)} · ${s.hearts} ดวง`;}
  if(TB.style.display!=='')TB.style.display='';}

/* ================================================================
   4. PET WINDOW (P / 🐾 menu)
   ================================================================ */
const css=`
#petw.ttw{width:min(760px,97vw)}#petw .ttbd{max-height:calc(100vh - 74px);overflow-y:auto;overflow-x:hidden}
#petw .ptpg{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:8px}
#petw .ptbox{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
#petw .ptslot{position:relative;border-radius:12px;border:2px solid #7d9ccf;background:radial-gradient(circle at 50% 40%,#fff,#d4e3f8);height:96px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;cursor:pointer;padding-bottom:3px;min-width:0}
#petw .ptslot canvas{width:64px;height:64px}#petw .ptslot b{font:800 10.5px Mali;color:#24304f;max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 3px}
#petw .ptslot.ptsel{box-shadow:0 0 0 2px #ffd77a,0 0 10px #ffb02e}#petw .ptslot.ptempty{cursor:default;opacity:.5;justify-content:center;font:700 11px Mali;color:#5a6a8a}
#petw .ptslot .pthv{position:absolute;right:4px;top:3px;font:800 10px Mali;color:#d23a6a}
#petw .ptslot .pton{position:absolute;left:50%;top:-8px;transform:translateX(-50%);background:#2a9a28;color:#fff;border-radius:7px;font:800 9px/14px Mali;padding:0 5px;white-space:nowrap;box-shadow:0 1px 0 #145a12}
#petw .ptdet{display:flex;flex-direction:column;gap:6px}
#petw .pthero{display:flex;gap:8px;align-items:center}#petw .pthero canvas{width:118px;height:118px;border-radius:14px;flex:none;background:radial-gradient(ellipse at 50% 85%,#bfe8ff,#eaf5ff 55%,#fff 80%);border:2px solid var(--qc,#9db8e6)}
#petw .ptnm{font:800 16px Mali;color:#24304f;display:flex;align-items:center;gap:5px;flex-wrap:wrap}#petw .ptnm .ttb{padding:1px 7px;font-size:11px}
#petw .ptqc{display:inline-block;border-radius:8px;padding:0 6px;font:800 10.5px/17px Mali;color:#fff;text-shadow:0 1px 0 rgba(0,0,0,.45)}
#petw .ptsub{font:700 11px Mali;color:#4a5a7a}
#petw .ptbar{position:relative;height:13px;border-radius:7px;background:#e3d6e8;border:2px solid #c89ab8;overflow:hidden;margin-top:3px}#petw .ptbar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#ff9ac0,#ff5d8a)}
#petw .ptbar span{position:absolute;inset:0;font:800 9.5px/10px Mali;color:#5a1030;text-align:center}
#petw ul{margin:0;padding:0;list-style:none}#petw li{display:flex;justify-content:space-between;gap:6px;font:700 11.5px Mali;padding:2px 0;border-bottom:1px dashed #c8d6ee}
#petw li.off{color:#98a4bc}#petw li em{font-style:normal;color:#2a8a28}#petw li.off em{color:#98a4bc}
#petw .ptln{display:flex;align-items:center;gap:6px}#petw .ptln button{border:0;background:none;cursor:pointer;font-size:13px;padding:0 2px}
#petw .ptacts{display:flex;gap:6px;flex-wrap:wrap}
#petw .ptegg,#petw .ptcx{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:10px;background:#fff;border:2px solid #c8d6ee;margin-bottom:5px}
#petw .ptegg .ptmid,#petw .ptcx .ptmid{flex:1;min-width:0}#petw .ptegg b,#petw .ptcx b{font:800 12px Mali;color:#24304f}#petw .ptegg small,#petw .ptcx small{display:block;font:600 10.5px Mali;color:#5a6a8a}
#petw .ptcx canvas{width:54px;height:54px;flex:none;border-radius:10px;background:radial-gradient(circle at 50% 40%,#fff,#e4edf9)}#petw .ptcx.ptgot{border-color:#9fdc8a}#petw .ptcx.ptnot canvas{filter:brightness(.35) saturate(.2)}
#petw .ptlh{font:800 12.5px Mali;color:#ffd77a;margin:8px 2px 5px;text-shadow:0 1px 0 #1a2850}
#petw .ptcxg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 6px}
#petTame{position:absolute;right:10px;bottom:-30px;display:flex;align-items:center;gap:5px;border:2px solid #8a2a50;border-radius:12px;padding:2px 9px 2px 7px;cursor:pointer;
  background:linear-gradient(#ffd1e2,#ff8ab8 60%,#e65a8e);box-shadow:0 3px 0 #8a2a50,0 0 10px rgba(255,120,170,.6);font:700 11px Mali,sans-serif;color:#fff;text-shadow:0 1px 0 #8a2a50;white-space:nowrap;pointer-events:auto;z-index:3}
#petTame b{font:800 12px Mali}#petTame span{letter-spacing:-1px;color:#fff3f8}#petTame small{font:700 10px Mali;opacity:.92}
#petTame.calm{animation:ptPulse .7s ease-in-out infinite alternate}#petTame.no{filter:saturate(.35) brightness(.95)}
@keyframes ptPulse{to{box-shadow:0 3px 0 #8a2a50,0 0 18px rgba(255,120,170,1)}}
#tlf.ph #petTame{bottom:-27px;right:4px;padding:1px 7px 1px 5px}#tlf.ph #petTame b{font-size:11px}
@media (max-width:640px){#petw .ptpg{grid-template-columns:1fr}#petw .ptcxg{grid-template-columns:1fr}#petw .ptslot{height:88px}}
`;
{const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);}
let TAB='box',SEL=null;
function drawSp(cv,k,fill){const s=SP[k];if(!s||!cv)return;const m=window.MSPR&&MSPR[s.name],g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);if(!m)return;
  const H=cv.height*(fill||.66),e={spr:s.name,boss:true,bsc:H/(m.h||34),face:1,bob:k.length,st:{},atk:0,x:0,y:0,_mv:0},old=ctx;ctx=g;try{MSPR_DRAW(e,cv.width/2,cv.height*(m.fly?.8:.9),1,0,0);}catch(err){}finally{ctx=old;}}
function qChip(q){const Q=QL()[q]||QL()[0];return `<span class="ptqc" style="background:${Q.c}">${Q.n}</span>`;}
function lineTxt(k,r){const P=PD.PERS[k];return P?`${P[0]} — ${PD.LBL[k]} +${P[1][r-1]}`:k;}
function bonusRows(p){const s=SP[p.sp],L=lvOf(p.bp||0),Q=QL()[p.q]||QL()[0],rows=[],main=Math.floor(L/2)+(L>=2?PD.Q_MAIN[p.q]||0:0);
  rows.push([`${PD.LBL[s.st]} (ตามความผูกพัน ขั้น 2 / 4 / 6 / 8 / 10)`,main?`+${main}`:'ขั้น 2',!main]);
  const [k,mx]=s.sub;rows.push([`${PD.LBL[k]} (เปิดที่ขั้น 3)`,L>=3?`+${Math.max(1,Math.round(mx*PD.SUBF[L]*Q.m))}`:`ถึง +${Math.round(mx*Q.m)}`,L<3]);
  rows.push([`ของขวัญคู่ใจ ${PD.LBL[s.gift[0]]} (ขั้น 10)`,`+${s.gift[1]}`,L<10]);return rows;}
function build(){const bd=$('#petw .ttbd');if(!bd)return;
  const nEgg=Object.keys(A.BAG).filter(id=>id.indexOf('pegg_')===0).reduce((a,id)=>a+A.BAG[id],0);
  let h=`<div class="tttab"><button data-t="box" class="${TAB==='box'?'on':''}">🐾 สัตว์ของฉัน (${S.box.length}/${BOX_MAX})</button><button data-t="egg" class="${TAB==='egg'?'on':''}">🥚 ฟักไข่${nEgg?`<sup>${nEgg}</sup>`:''}</button><button data-t="cx" class="${TAB==='cx'?'on':''}">📖 สมุดสัตว์</button></div>`;
  if(TAB==='box')h+=boxTab();else if(TAB==='egg')h+=eggTab();else h+=cxTab();
  bd.innerHTML=h;bd.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{TAB=b.dataset.t;build();});bind(bd);paint();}
function boxTab(){if(!SEL||!byId(SEL))SEL=S.act||(S.box[0]&&S.box[0].id)||null;
  let L=`<div class="ptbox">`;for(let i=0;i<BOX_MAX;i++){const p=S.box[i];
    if(!p){L+=`<div class="ptslot ptempty">ว่าง</div>`;continue;}const Q=QL()[p.q]||QL()[0];
    L+=`<div class="ptslot ${p.id===SEL?'ptsel':''}" data-sel="${p.id}" style="border-color:${Q.c}">${p.id===S.act?'<span class="pton">ออกเดินทาง</span>':''}<span class="pthv">♥${lvOf(p.bp||0)}</span><canvas width="124" height="124" data-sp="${p.sp}"></canvas><b>${esc(p.nm)}</b></div>`;}
  L+=`</div><p class="ttnote" style="margin:6px 2px 0">จับมอนที่มี 🐾 ในกรอบเป้า (โยนเครื่องรางผูกใจจากร้านในเมือง) → ได้ไข่ → ฟักในแท็บ 🥚 · สัตว์เลี้ยงไม่ช่วยตี แต่ให้สเตตัสเมื่อพาออกเดินทาง · ลูบหัวได้ (คลิก / แตะที่ตัว)</p>`;
  const p=byId(SEL);let R='';
  if(!p)R=`<div class="ttp"><h4>ยังไม่มีสัตว์เลี้ยง</h4><p class="ttnote">มอนตัวเล็กแถวแมพแรกของทุกแดนจับได้ง่ายที่สุด (3 ดวง) — ดูในแท็บ 📖 สมุดสัตว์</p></div>`;
  else{const s=SP[p.sp],Q=QL()[p.q]||QL()[0],Lv=lvOf(p.bp||0),lo=PD.BOND[Lv-1],hi=PD.BOND[Lv]||PD.BOND[PD.BOND.length-1],fr=Lv>=10?1:((p.bp||0)-lo)/(hi-lo),on=p.id===S.act;
    const nTreat=(A.BAG.ptreat||0),locks=(p.ln||[]).filter(l=>l[2]).length,need=1+locks;
    R=`<div class="ttp ptdet"><div class="pthero"><canvas width="236" height="236" data-sp="${p.sp}" data-big="1" style="--qc:${Q.c}"></canvas><div style="flex:1;min-width:0">
      <div class="ptnm" id="ptNm">${esc(p.nm)} <button class="ttb sm blue" data-ren="1">✎</button></div>
      <div class="ptsub">${esc(s.th)} · ${PD.LANDS[s.land].th} · ${PD.LBL[s.st]} ${PD.ROLE[s.st]} ${qChip(p.q)}</div>
      <div class="ptsub" style="margin-top:5px">♥ ความผูกพัน ขั้น ${Lv} · ${PD.BOND_N[Lv-1]}</div><div class="ptbar"><i style="width:${Math.round(fr*100)}%"></i><span>${Lv>=10?'เต็ม':`${p.bp||0} / ${hi}`}</span></div>
      <div class="ttnote" style="margin-top:3px">ได้แต้มจาก: ล้มมอนด้วยกัน +1 (วันละ ${KILL_CAP}) · บอส +15 · ลูบหัว +2 (ทุก 10 นาที)${HERO==='cat'?' · นั่งพักด้วยกัน +1 / 2 นาที':''}</div></div></div>
      <div><h4 style="margin:2px 0 3px;font:800 12px Mali;color:#2d4a8a">สเตตัสที่ให้ ${on?'<em style="color:#2a9a28;font-style:normal">(กำลังใช้)</em>':'<span class="ttnote">(พาออกเดินทางเพื่อใช้)</span>'}</h4>
      <ul>${bonusRows(p).map(([a,b,off])=>`<li class="${off?'off':''}"><span>${a}</span><em>${b}</em></li>`).join('')}</ul></div>
      <div><h4 style="margin:4px 0 3px;font:800 12px Mali;color:#2d4a8a">นิสัย (${Q.n}: ${Q.lines} บรรทัด)</h4>
      <ul>${(p.ln||[]).map((l,i)=>`<li><span class="ptln"><button data-lock="${i}" title="ล็อกบรรทัดนี้ไว้ตอนสุ่มใหม่">${l[2]?'🔒':'🔓'}</button>${lineTxt(l[0],l[1])}</span><em>ขั้น ${'I II III IV V'.split(' ')[l[1]-1]}</em></li>`).join('')}</ul>
      <div class="ptacts" style="margin-top:5px"><button class="ttb sm" data-reroll="1" ${nTreat>=need||TEST()?'':'disabled'}>🍪 สุ่มนิสัยใหม่ (ขนม ${need}${TEST()?' · ทดสอบฟรี':` · มี ${nTreat}`})</button>
      <button class="ttb sm blue" data-treat="1">ทำขนม (ขน ${PD.TREAT.fluff} + แก่น ${PD.TREAT.tess} + ${PD.TREAT.z.toLocaleString()}z)</button></div></div>
      <div class="ptacts">${on?`<button class="ttb" data-dis="1">🏠 ให้พักในกล่อง</button>`:`<button class="ttb" data-sum="${p.id}">🐾 พาออกเดินทาง</button>`}<button class="ttb sm blue" data-rel="${p.id}" style="margin-left:auto">ปล่อยคืนป่า (ได้ขน ${p.q+1})</button>
      ${TEST()?`<button class="ttb sm" data-tb="1">🧪 ผูกพัน +1 ขั้น</button><button class="ttb sm" data-tb0="1">🧪 รีเซ็ต</button>`:''}</div></div>`;}
  return `<div class="ptpg"><div>${L}</div><div>${R}</div></div>`;}
function eggTab(){const ids=Object.keys(A.BAG).filter(id=>id.indexOf('pegg_')===0&&A.ETC[id]);let h='';
  if(!ids.length)h+=`<div class="ttp"><h4>ยังไม่มีไข่</h4><p class="ttnote">ล็อกเป้ามอนที่มี 🐾 → กดปุ่ม <b>🐾 ผูกใจ</b> ใต้กรอบเป้า → โยนเครื่องรางจนหัวใจเต็ม = ได้ไข่ · เครื่องรางขายที่ร้านค้าในเมืองของแต่ละแดน (เมืองหลวงมีครบทุกแดน)</p></div>`;
  for(const id of ids){const E=A.ETC[id],s=SP[E.sp],z=TEST()?0:PD.HATCH_Z(s.tier),full=S.box.length>=BOX_MAX;
    h+=`<div class="ptegg"><div>${PD.icon(id,E,40)}</div><div class="ptmid"><b>${E.th} ×${A.BAG[id]}</b><small>${PD.LBL[s.st]} ${PD.ROLE[s.st]} · ${PD.LANDS[s.land].th} · ค่าฟัก ${z?z.toLocaleString()+'z':'ฟรี (ทดสอบ)'}</small></div>
      <button class="ttb sm" data-hatch="${E.sp}" ${full||A.zeny<z?'disabled':''}>${full?'กล่องเต็ม':'ฟัก'}</button></div>`;}
  const Q=QL();h+=`<p class="ttnote" style="margin:6px 2px;line-height:1.9">ระดับตอนฟัก: ${Q.map((q,i)=>`${qChip(i)} ${Math.round(q.p*100)}%`).join(' ')}<br>การันตี ${qChip(3)} ขึ้นไปทุก ${PD.PITY.epic} ฟัก (อีก ${Math.max(1,PD.PITY.epic-S.pe)}) · ${qChip(4)} ทุก ${PD.PITY.leg} ฟัก (อีก ${Math.max(1,PD.PITY.leg-S.pl)}) · ระดับสูง = ตัวเลขสูงขึ้น + นิสัยมากขึ้น</p>`;
  if(TEST())h+=`<div class="ptacts"><button class="ttb sm" data-tegg="1">🧪 +ไข่สุ่ม 1 ใบ</button></div>`;
  return h;}
function cxTab(){let h='';const got=Object.keys(S.cx).length;h+=`<p class="ttnote" style="margin:2px">สมุดสัตว์ ${got} / ${PD.ORDER.length} · จับได้แล้ว = สีสด · ไอคอน ♡ = จำนวนหัวใจที่ต้องเติม · รุ่นต่อไป: อียิปต์ / ญี่ปุ่น และลูกบอส</p>`;
  for(const land of ['vik','grk','azt','cap']){const D=PD.LANDS[land];h+=`<div class="ptlh">${land==='cap'?'🏰':'🗺'} ${D.th}${land==='cap'?' (รับเครื่องรางทุกแดน)':` · ${D.ch}`}</div><div class="ptcxg">`;
    for(const k of PD.ORDER){const s=SP[k];if(s.land!==land)continue;const M=window.VK_MAPS&&VK_MAPS[s.map],mn=(M&&(M.th||M.name))||s.map,def=window.VK_MONS&&VK_MONS[s.map]&&VK_MONS[s.map].find(d=>d.name===s.name),lv=def&&def.lv?`Lv ${def.lv[0]}–${def.lv[1]}`:'';
      h+=`<div class="ptcx ${S.cx[k]?'ptgot':'ptnot'}"><canvas width="108" height="108" data-sp="${k}"></canvas><div class="ptmid"><b>${s.th}${S.cx[k]?' ✓':''}</b><small>${PD.LBL[s.st]} ${PD.ROLE[s.st]} · ให้ ${PD.LBL[s.sub[0]]} / ${PD.LBL[s.gift[0]]}</small><small>${esc(mn)} ${lv} · ${'♡'.repeat(s.hearts)} · เครื่องรางขั้น ${s.tier}</small></div>
        ${TEST()?`<button class="ttb sm" data-tget="${k}" title="ทดสอบ: ได้สัตว์ตัวนี้ทันที">🧪</button>`:''}</div>`;}
    h+='</div>';}
  return h;}
function bind(bd){const on=(sel,f)=>bd.querySelectorAll(sel).forEach(b=>b.onclick=ev=>{ev.stopPropagation();f(b);});
  on('[data-sel]',b=>{SEL=b.dataset.sel;build();});
  on('[data-sum]',b=>{if(summon(b.dataset.sum))build();});on('[data-dis]',()=>{dismiss();build();});
  on('[data-rel]',b=>{const id=b.dataset.rel,p=byId(id);if(!p)return;if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent='แตะอีกครั้งเพื่อปล่อย';setTimeout(()=>{if(b.isConnected){b.dataset.ok='';b.textContent=`ปล่อยคืนป่า (ได้ขน ${p.q+1})`;}},2500);return;}
    if(S.act===id){if(!canSwitch()){msg('ยังสู้อยู่ — ปล่อยไม่ได้ตอนนี้');return;}S.act=null;if(W.fx){W.fx.gone=1;W.fx=null;}}
    S.box=S.box.filter(q=>q.id!==id);save();restat();A.bagAdd('pfluff',p.q+1);A.save();chatLog('sys',`🌿 ปล่อย <b>${esc(p.nm)}</b> คืนป่า · ได้ขนวิญญาณ ×${p.q+1}`);SEL=null;build();});
  on('[data-ren]',()=>{const p=byId(SEL);if(!p)return;const box=$('#ptNm');box.innerHTML=`<input class="ttin" id="ptIn" maxlength="12" value="${esc(p.nm)}" style="width:130px"> <button class="ttb sm" id="ptOk">✓</button>`;
    const inp=$('#ptIn');inp.focus();inp.select();const ok=()=>{const v=inp.value.trim().slice(0,12);if(v){p.nm=v;save();}build();};$('#ptOk').onclick=ok;inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')ok();if(e.key==='Escape')build();};});
  on('[data-lock]',b=>{const p=byId(SEL),l=p&&p.ln[+b.dataset.lock];if(!l)return;const n=p.ln.filter(x=>x[2]).length;if(!l[2]&&n>=p.ln.length-1){msg('ต้องเหลืออย่างน้อย 1 บรรทัดไว้สุ่ม');return;}l[2]=l[2]?0:1;save();build();});
  on('[data-reroll]',()=>{const p=byId(SEL);if(!p)return;const need=1+p.ln.filter(l=>l[2]).length;if(!TEST()){if((A.BAG.ptreat||0)<need)return;A.bagAdd('ptreat',-need);A.save();}
    p.ln=rollLines(p.q,p.ln);save();if(S.act===p.id)restat();emote('note',1.2);build();});
  on('[data-treat]',()=>{const T=PD.TREAT;if(!TEST()&&((A.BAG.pfluff||0)<T.fluff||(A.BAG.tess||0)<T.tess||A.zeny<T.z)){msg(`ต้องมี ขนวิญญาณ ${T.fluff} · แก่นโทเท็ม ${T.tess} · ${T.z.toLocaleString()}z`);return;}
    if(!TEST()){A.bagAdd('pfluff',-T.fluff);A.bagAdd('tess',-T.tess);A.zeny=A.zeny-T.z;}if(!A.bagAdd('ptreat',1)){msg('กระเป๋าเต็ม');return;}A.save();chatLog('sys','🍪 ทำขนมเปลี่ยนนิสัย 1 ชิ้น');build();});
  on('[data-hatch]',b=>hatch(b.dataset.hatch));
  on('[data-tegg]',()=>{const k=PD.ORDER[Math.floor(Math.random()*PD.ORDER.length)];A.bagAdd('pegg_'+k,1);A.save();build();});
  on('[data-tget]',b=>{if(S.box.length>=BOX_MAX){msg('กล่องเต็ม (6 ตัว)');return;}const p=newPet(b.dataset.tget);SEL=p.id;TAB='box';build();});
  on('[data-tb]',()=>{const p=byId(SEL);if(!p)return;const L=lvOf(p.bp||0);if(L>=10)return;p.bp=PD.BOND[L];save();if(S.act===p.id){restat();emote('note',1.2);}build();});
  on('[data-tb0]',()=>{const p=byId(SEL);if(!p)return;p.bp=0;save();if(S.act===p.id)restat();build();});}
function hatch(sp){const s=SP[sp],id='pegg_'+sp;if(!s||!(A.BAG[id]>0))return;const z=TEST()?0:PD.HATCH_Z(s.tier);
  if(S.box.length>=BOX_MAX){msg('กล่องสัตว์เลี้ยงเต็ม (6 ตัว) — ปล่อยคืนป่าก่อน');return;}if(A.zeny<z){msg(`ค่าฟัก ${z.toLocaleString()}z`);return;}
  A.bagAdd(id,-1);if(z)A.zeny=A.zeny-z;A.save();const p=newPet(sp),Q=QL()[p.q];SEL=p.id;TAB='box';
  chatLog('sys',`🥚 ฟักไข่ได้ <b>${esc(s.th)}</b> ระดับ <b style="color:${Q.c};text-shadow:0 0 2px #000">${Q.n}</b> · นิสัย: ${p.ln.map(l=>lineTxt(l[0],l[1])).join(', ')}`);
  build();hatchFx(p);}
function hatchFx(p){const bd=$('#petw .ttbd'),cv=bd&&bd.querySelector('canvas[data-big]');if(!cv)return;const g=cv.getContext('2d'),s=SP[p.sp],Q=QL()[p.q],t0=performance.now();cv.dataset.hold='1';
  const step=()=>{const t=(performance.now()-t0)/1000;if(!cv.isConnected)return;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);const W2=cv.width,H2=cv.height;
    if(t<1.1){const wob=Math.sin(t*22)*.22*Math.min(1,t*2);egg(g,W2/2,H2*.86,H2*.3,s.egg,wob);if(t>.6){g.strokeStyle='#3a2a1f';g.lineWidth=3;g.beginPath();g.moveTo(W2*.38,H2*.5);g.lineTo(W2*.47,H2*.56);g.lineTo(W2*.53,H2*.48);g.lineTo(W2*.62,H2*.55);g.stroke();}requestAnimationFrame(step);return;}
    if(t<1.7){const k=(t-1.1)/.6;g.save();g.globalAlpha=1-k;g.fillStyle=Q.c;g.beginPath();g.arc(W2/2,H2*.55,W2*.2+k*W2*.4,0,TAU);g.fill();g.restore();g.globalAlpha=Math.min(1,k*2);drawSpOn(g,cv,p.sp);g.globalAlpha=1;requestAnimationFrame(step);return;}
    delete cv.dataset.hold;};step();}
function drawSpOn(g,cv,k){const s=SP[k],m=window.MSPR&&MSPR[s.name];if(!m)return;const e={spr:s.name,boss:true,bsc:cv.height*.66/(m.h||34),face:1,bob:1,st:{},atk:0,x:0,y:0,_mv:0},old=ctx;ctx=g;try{MSPR_DRAW(e,cv.width/2,cv.height*(m.fly?.8:.9),1,0,0);}catch(err){}finally{ctx=old;}}
function paint(){const w=$('#petw');if(!w||!w.classList.contains('open'))return;w.querySelectorAll('canvas[data-sp]').forEach(cv=>{if(cv.dataset.hold)return;drawSp(cv,cv.dataset.sp,cv.dataset.big?.66:.62);});}
setInterval(paint,180);
function open(){A.ui.ttWin('petw','🐾 สัตว์เลี้ยง');const w=$('#petw');w.classList.add('open');w.style.zIndex=60;build();}
function toggle(){const w=$('#petw');if(w&&w.classList.contains('open'))w.classList.remove('open');else open();}
/* menu button 🐾 (P) */
function addMenu(){const g=$('#mgrid');if(!g||g.querySelector('[data-m="mgpet"]'))return;const b=document.createElement('button');b.dataset.m='mgpet';b.title='สัตว์เลี้ยง (P)';
  b.innerHTML='<span class="kb">P</span><svg viewBox="0 0 40 40"><ellipse cx="20" cy="26" rx="9.5" ry="8" fill="#ffd1e2" stroke="#3a2a1f" stroke-width="2.4"/><ellipse cx="9.5" cy="16" rx="4" ry="5" fill="#ffd1e2" stroke="#3a2a1f" stroke-width="2.2"/><ellipse cx="16" cy="9.5" rx="4" ry="5" fill="#ffd1e2" stroke="#3a2a1f" stroke-width="2.2"/><ellipse cx="24" cy="9.5" rx="4" ry="5" fill="#ffd1e2" stroke="#3a2a1f" stroke-width="2.2"/><ellipse cx="30.5" cy="16" rx="4" ry="5" fill="#ffd1e2" stroke="#3a2a1f" stroke-width="2.2"/><path d="M20 23.5 C18.6 21.6 15.8 23 17.4 25.2 L20 27.6 L22.6 25.2 C24.2 23 21.4 21.6 20 23.5 Z" fill="#ff5d8a"/></svg>';
  b.onclick=e=>{e.stopPropagation();toggle();};g.appendChild(b);}
addMenu();setTimeout(addMenu,1500);
addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='p'||e.key==='P'||e.code==='KeyP')toggle();});
/* test mode: a few bond charms once so taming can be tried right away (free throws work anyway in test mode) */
window.PETS={dbg:()=>({cd:throwCd,keeper:fx.some(f=>f instanceof PetKeeper)}),S:()=>S,goal:()=>(Object.keys(S.cx).length?1:0)+(S.box.length?1:0)+(S.act?1:0),open,toggle,build,summon,dismiss,hatch,newPet,throwCharm,soften,bonusOf,lvOf,active,gain,specOf,charmFor,W,save,reset(){S=fresh();save();restat();if(W.fx){W.fx.gone=1;W.fx=null;}}};
})();
