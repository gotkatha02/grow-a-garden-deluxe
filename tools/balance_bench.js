/* =========================================================================
   BALANCE BENCHMARK — fast-forward combat test (dev tool, not loaded by the game)
   How to use: open the game (index.html?char=wolf etc.), open the browser console (F12),
   paste this whole file, then run:   await balanceBench()
   It simulates 40 s fights (single boss, then a group of 5) at 60 steps/s without waiting,
   with a simple player that uses every ready skill + basic attacks. Enemies fight back.
   Output: dps1 (single-target damage/s), dpsG (group damage/s), score = sqrt(dps1*dpsG),
           takenPS / healPS (damage taken / healing per second at 50% HP).
   Run it in the empty test arena (enterMap(null) first; the old code-drawn battle field is gone) — towns block combat.
   Results 2026-11-16 (12 Tails stats + items, refine ATK 6–9/tier, player HP base 300, Lv99 CHAR_PRESET builds):
     wolf 2545 · jaguar 2618 · croc 2567 · owl 2439 (ranged) · axolotl 2381 (healer) · rhino 1904 (tank)
   Level-by-level fight length with crafted gear: tools/progression_bench.js
   Tune CHAR_COEF in index.html (visible skill coefficients) and re-run to keep every class within ~±5% of its role target.
   LEVEL (2026-11-22): the game caps at Lv 60 and every hero was re-tuned there (owner 'จูน') → the bench measures Lv 60 by default
   (target ≈ 2,050 · tank ≈ 1,880, dummies at their game levels 38 / 52). benchOnce switches the hero to window.__BENCH_LV (default 60)
   with the same stat preset (PS._pre, set whenever a preset is applied) scaled by presetAt, and puts the hero back afterwards.
   __BENCH_LV=99 = the old Lv 99 reference (dummies at their design levels 62 / 85; the 2,450 target of that time).
   ========================================================================= */
async function benchOnce(opts={}){
  /* refine lines (milestones.js) follow the test kit's uneven refine levels (+4 … +7) → kept out of the bench; stat tiers stay in (the presets set them) */
  const rfl0=window.__RFL_OFF;window.__RFL_OFF=1;if(typeof applyStats==='function')applyStats();
  const LVB=opts.lv||window.__BENCH_LV||60,keep=PS.lv!==LVB&&typeof presetAt==='function'?{lv:PS.lv,ps:Object.fromEntries(STATK.map(k=>[k,PS[k]]))}:null;
  if(keep){PS.lv=LVB;Object.assign(PS,presetAt(PS._pre||(typeof CHAR_PRESET!=='undefined'&&CHAR_PRESET[CHAR])||'ตีแรง',LVB));applyStats();}
  /* dummies: Lv 99 reference = their design levels (Frostling 62, Elder 85 boss) as always; any other bench level = the levels the game uses now */
  const mon0=typeof MON_LV0!=='undefined'?{frostling:MON.frostling,elder:MON.elder}:null;
  if(mon0&&LVB>=99){MON.frostling=Object.assign({},MON.frostling,monStats(MON_LV0.frostling));MON.elder=Object.assign({},MON.elder,monStats(MON_LV0.elder,'boss'));}
  try{return await benchRun(opts);}finally{window.__RFL_OFF=rfl0;if(mon0){MON.frostling=mon0.frostling;MON.elder=mon0.elder;}if(keep){PS.lv=keep.lv;Object.assign(PS,keep.ps);}applyStats();if(keep){player.hp=player.maxHp;player.mp=player.maxMp;}}}
/* 2026-11-22 (owner 'แก้บัค'): every run starts from the same hero state. Before, gauges / stacks / marks / summons of the run before carried
   over (a 20 s run took hippo fullness 0 → 120, kitsune tails 0 → 9, croc frenzy 0 → 10, bastet souls 3 → 6 …), so the group run and every
   later run in a page started warm, and fx.length=0 also wiped the heroes' core tickers (layer 'none', which enterMap keeps: owl / hippo /
   cat / wolf cores, the croc / axolotl / rhino keepers) — those heroes were benched without their gauges ticking. Now: the hero state objects
   are snapshotted once per page (fresh) and restored at every reset, cores / keepers stay, and every *Ensure() re-adds its overlay. */
const BENCH_ST='ANU AX BA CAT CR CRX DG HI HIP JGX JX KI LI OW RH RHX RV SHP SI UC KTI'.split(' ');
const BENCH_LETS={warBanner:null,fenrir:null,decoy:null,unbrokenICD:0,jgMirrorObj:null,jgTotem:null,jgSpirit:null};
function benchClone(v,d){if(v===null||typeof v!=='object')return v;if(d>4)return v;if(v instanceof Map)return new Map(v);if(v instanceof Set)return new Set(v);
  if(Array.isArray(v))return v.map(x=>benchClone(x,d+1));if(Object.getPrototypeOf(v)!==Object.prototype)return v;const o={};for(const k in v)o[k]=benchClone(v[k],d+1);return o;}
function benchSnap(){const S={};for(const n of BENCH_ST){let o;try{o=(0,eval)(n);}catch(_){continue;}if(o&&typeof o==='object'&&!Array.isArray(o))S[n]={o,v:benchClone(o,0)};}return S;}
function benchRestore(S){for(const n in S){const {o,v}=S[n];for(const k of Object.keys(o))if(!(k in v))delete o[k];for(const k in v)o[k]=benchClone(v[k],0);}
  for(const k in BENCH_LETS){try{(0,eval)(k+'='+JSON.stringify(BENCH_LETS[k]));}catch(_){}}}
function benchEnsure(){for(const k of ['axEnsure','bEnsure','crEnsure','dEnsure','kEnsure','lEnsure','rhEnsure','sEnsure','uEnsure','vEnsure'])if(typeof window[k]==='function')try{window[k]();}catch(_){}}   // each returns at once for another hero
async function benchRun(opts={}){
  if(!window.__BENCH_SNAP)window.__BENCH_SNAP=benchSnap();
  const SIM=opts.sim||40, DT=1/60;
  const follows=new Set(Object.values(SKILLS).map(s=>s.follow).filter(Boolean));
  const skills=Object.keys(SKILLS).filter(k=>{const s=SKILLS[k];return s.make&&!s.passive&&LV[k]>0&&!follows.has(k)&&!/Tent|Lantern|Stride|Hop|Step/.test(s.name||'')&&!(window.__BENCH_AVOID&&typeof skDT==='function'&&skDT(k)===window.__BENCH_AVOID)&&!(window.__BENCH_SKIP&&window.__BENCH_SKIP(k));});
  timeScale=0;
  const reset=()=>{for(const k in player.cd)player.cd[k]=0;player.buffs={};player.action=null;player.casting=null;player.combo=null;player.pending=null;player.attackTarget=null;player.moveT=null;player.queue=null;player.x=0;player.y=0;player.z=0;player.mp=player.maxMp;player.hp=player.maxHp;
    const keep=fx.filter(f=>f&&f.layer==='none'&&/(Core|Keeper)$/.test((f.constructor&&f.constructor.name)||''));fx.length=0;fx.push(...keep);
    if(!window.__BENCH_WARM){benchRestore(window.__BENCH_SNAP);}benchEnsure();};
  const place=(list)=>{enemies.length=0;for(const [x,y,b] of list){const e=spawnEnemy(x,y,b);e.x=x;e.y=y;e.hp=e.maxHp=1e9;}};
  const step=()=>{gameTime+=DT;if(hitStop>0){hitStop-=DT;}updatePlayer(DT);updEnemies(DT);updPrisons(DT);updParticles(DT);for(let i=fx.length-1;i>=0;i--)if(!fx[i].update(DT))fx.splice(i,1);};
  const brain=()=>{if(busy()||player.pending)return;
    const t=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];if(!t)return;
    const d=Math.hypot(t.x-player.x,t.y-player.y);
    const cb=player.combo;if(cb&&cb.key&&LV[cb.key]&&!(player.cd[cb.key]>0)&&player.mp>=(SKILLS[cb.key].mp||0)){try{useSkill(cb.parent);}catch(e){}if(busy())return;}
    for(const k of skills){const s=SKILLS[k];if(player.cd[k]>0||player.mp<(s.mp||0))continue;const r=(s.range||300);if(d>Math.max(r,120)+t.r)continue;
      try{castSkill(k,{target:t,phi:Math.atan2(t.y-player.y,t.x-player.x),gx:t.x,gy:t.y});}catch(e){}
      if(busy()||player.casting)return;}
    if(!player.attackTarget)command({kind:'attack',e:t});};
  const run=(layout)=>{reset();place(layout);let dealt=0,taken=0,heal=0;const steps=Math.round(SIM/DT);
    for(let i=0;i<steps;i++){const hp0=enemies.map(e=>e.hp);player.hp=player.maxHp*.5;for(const e of enemies)e.aggro=99;
      brain();const pb=player.hp;step();
      enemies.forEach((e,j)=>{const dd=hp0[j]-e.hp;if(dd>0&&dd<1e8)dealt+=dd;});
      const dh=player.hp-pb;if(dh<0)taken-=dh;else heal+=dh;player.hp=player.maxHp*.5;}
    return {dealt,taken,heal};};
  const single=run([[60,0,true]]),group=run([[55,0],[60,30],[60,-30],[-45,20],[-45,-20]]);
  timeScale=1;
  return {dps1:single.dealt/SIM,dpsG:group.dealt/SIM,takenPS:(single.taken+group.taken)/SIM/2,healPS:(single.heal+group.heal)/SIM/2,maxHp:player.maxHp,lv:PS.lv};}
async function balanceBench(runs=3){const R=[];for(let i=0;i<runs;i++)R.push(await benchOnce());const avg=k=>Math.round(R.reduce((s,r)=>s+r[k],0)/R.length);
  const o={char:CHAR,classDmg:(typeof CLASS_DMG==='function'?CLASS_DMG():1),dps1:avg('dps1'),dpsG:avg('dpsG'),takenPS:avg('takenPS'),healPS:avg('healPS'),maxHp:R[0].maxHp,lv:R[0].lv};o.score=Math.round(Math.sqrt(o.dps1*o.dpsG));console.table([o]);return o;}
