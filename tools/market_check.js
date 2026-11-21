#!/usr/bin/env node
/* Central market — checks of the REAL engine (part 1 of market.js), outside the game.
     node tools/market_check.js            rule tests + price table (8 random runs per situation, 14 days)
     node tools/market_check.js wait=0     the same crowd without "waiting buyers come back for a round"
   The crowd here is a toy: it has a hidden value V per item, buys faster below it and sells faster above it.
   It does not try to push prices on purpose (see section 11 of MARKET_SYSTEM_TH.md). */
const {makeMarket,K,px,crowdDef,NEWS}=require('../market.js');
const H=3600e3,T0=1.8e12;
const arg={};process.argv.slice(2).forEach(a=>{const [k,v]=a.split('=');arg[k]=v===undefined?1:+v;});
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
let fails=0;const ok=(c,msg)=>{if(!c){fails++;console.log('  FAIL: '+msg);}};
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;

/* ---------- 1. rules, one case at a time (no crowd: sup = dem = 0) ---------- */
function world(defs,seed,k){const W={t:T0,it:{},pl:{},nn:1e18};return [makeMarket(defs,W,{rand:rng(seed||1),K:Object.assign({VSIG:0},k||{})}),W];}
const quiet=(base,cap)=>({x:{base,cap:!!cap,sup:0,dem:0,qs:[1,1],qb:[1,1],m:[1,1]}});
(function rules(){console.log('rules');
  { const [M]=world(quiet(100),1);let g=M.allocate([10,5,2],10);ok(g.join()==='4,4,2','equal split 10/5/2 over 10 → '+g);
    g=M.allocate([3,3],10);ok(g.join()==='3,3','requests ≤ units → everyone gets all');
    const cnt=new Array(9).fill(0);for(let i=0;i<9000;i++){g=M.allocate([1,1,1,1,1,1,1,1,1],2);ok(g.reduce((a,b)=>a+b)===2,'2 units handed out');g.forEach((v,j)=>cnt[j]+=v);}
    ok(Math.min(...cnt)>1800&&Math.max(...cnt)<2200,'lots are fair: each of 9 wins ≈ 2000 of 9000 → '+cnt);
    for(let i=0;i<300;i++){const r=rng(i+5),n=1+Math.floor(r()*12),reqs=[...Array(n)].map(()=>1+Math.floor(r()*9)),U=1+Math.floor(r()*30),a=M.allocate(reqs,U),Q=reqs.reduce((x,y)=>x+y);
      ok(a.reduce((x,y)=>x+y)===Math.min(Q,U)&&a.every((v,j)=>v<=reqs[j]&&v>=0),'allocation sums');if(Q>U){const mx=Math.max(...a),short=a.filter((v,j)=>v<reqs[j]);ok(short.every(v=>v>=mx-1),'nobody short gets 2 less than the top');}} }
  { // out of stock → listing opens a 60-minute round; price locked; fee 1%; tax 5%; short round = -1%; leftover goes on normal sale
    const [M,W]=world(quiet(20000),2);let r=M.list('A','x',2,T0);ok(r.ok&&r.round&&r.fee===400&&r.end===T0+K.ROUND,'listing 2 × 20,000 opens a round, fee 400 → '+JSON.stringify(r));
    ok(M.reserve('A','x',1,T0).err==='own','the seller cannot reserve in his own round');ok(M.withdraw('A',r.u,T0).err==='round','no withdrawing during the round');
    ok(M.buy('B','x',1,T0).err==='round','no instant buy during a round');ok(M.reserve('B','x',3,T0).err==='units','cannot ask for more than the pool');
    let b=M.reserve('B','x',1,T0+60e3);ok(b.ok&&b.hold===20000,'B reserves 1, 20,000 held');ok(M.reserve('B','x',1,T0+61e3).err==='twice','one reservation per round');
    ok(M.list('B','x',1,T0+62e3).err==='reserved','a reserver cannot sell into the same round');
    M.advance(T0+K.ROUND+1);const v=M.view('x','A'),A=M.me('A'),B=M.me('B');
    ok(B.box.it.x===1&&B.box.z===0&&!B.rs.x,'B gets 1 unit, nothing refunded');ok(A.box.z===19000,'A receives 20,000 − 5% = 19,000 → '+A.box.z);
    ok(v.mode==='normal'&&v.stock===1&&v.own===1,'the unsold unit goes on normal sale');ok(Math.abs(W.it.x.p-19800)<1e-6,'1 of 2 reserved → −1% → 19,800 → '+W.it.x.p);
    ok(M.list('B','x',1,T0+K.ROUND+2).err==='lock','what you won in a round cannot be listed for 24 h');
    ok(M.buy('A','x',1,T0+K.ROUND+3).err==='stock','you cannot buy your own units');
    const w=M.withdraw('A',A.ls[0].u,T0+K.ROUND+4);ok(w.ok&&w.n===1&&M.view('x').mode==='empty','leftover can be taken back; item is out of stock again'); }
  { // 9 people, 2 units → 2 winners by lot, 7 refunds, +15%
    const [M,W]=world(quiet(20000),3);M.list('S','x',2,T0);for(let i=0;i<9;i++)M.reserve('p'+i,'x',1,T0+1e3);
    ok(Math.round(M.view('x','p0').rd.n)===9&&M.view('x','p0').rd.Q===9,'9 reservations shown');M.advance(T0+K.ROUND);
    let win=0,ref=0;for(let i=0;i<9;i++){const P=M.me('p'+i);win+=P.box.it.x||0;ref+=P.box.z;}
    ok(win===2&&ref===7*20000,'2 winners, 7 × 20,000 refunded → '+win+' / '+ref);ok(M.me('S').box.z===38000,'seller gets 2 × 19,000');
    ok(px(W.it.x.p)===23000&&M.view('x').mode==='empty','4.5× demand → +15% → 23,000, out of stock again → '+W.it.x.p); }
  { // no reservation at all → −3%; nobody wants it → normal sale → buy it out → +5%
    const [M,W]=world(quiet(1000),4);const r=M.list('S','x',5,T0);M.advance(T0+K.ROUND);ok(Math.abs(W.it.x.p-970)<1e-6&&M.view('x').stock===5,'empty round → −3%, 5 units on normal sale');
    const b=M.buy('B','x',5,T0+K.ROUND+1);ok(b.ok&&b.cost===5*970,'B buys 5 at 970');ok(Math.abs(W.it.x.p-970*1.05)<1e-6&&M.view('x').mode==='empty','bought out → +5%');
    ok(M.me('S').box.z===Math.floor(5*970*.95),'seller paid 95% of 5 × 970'); }
  { // cancel: money back, but not in the last 5 minutes · 10 listings at most · 48 h then the units come back
    const [M]=world({x:quiet(50).x,y:Object.assign({},quiet(50).x)},5);M.list('S','x',3,T0);M.reserve('B','x',2,T0);
    ok(M.cancel('B','x',T0+10*60e3).refund===100,'cancel gives the held 100 back');M.reserve('B','x',2,T0+11*60e3);ok(M.cancel('B','x',T0+56*60e3).err==='late','no cancel in the last 5 minutes');
    const [M2]=world(quiet(50),6);let last;for(let i=0;i<11;i++)last=M2.list('S','x',1,T0);ok(last.err==='slots','11th listing refused');
    M2.advance(T0+K.ROUND);ok(M2.view('x','S').own===10,'10 units on normal sale');M2.advance(T0+K.LIFE+60e3);ok(M2.me('S').box.it.x===10&&M2.view('x').mode==='empty','after 48 h the units are in the claim box'); }
  { // floor 65% · goods the NPC shop sells never cost more than the shop
    const [M,W]=world(quiet(100,1),7);W.it.x=undefined;M.view('x');W.it.x.p=100;for(let i=0;i<5;i++){M.list('S','x',1,T0+i*2*H);for(let j=0;j<9;j++)M.reserve('q'+i+j,'x',1,T0+i*2*H+1);M.advance(T0+i*2*H+K.ROUND);}
    ok(W.it.x.p===100,'capped at the shop price → '+W.it.x.p);for(let i=0;i<40;i++){M.me('S').lock={};M.me('S').ls=[];M.list('S','x',1,T0+(20+i*2)*H);M.advance(T0+(20+i*2)*H+K.ROUND);M.withdraw('S',M.me('S').ls[0].u,T0+(21+i*2)*H);}
    ok(Math.abs(W.it.x.p-65)<1e-9,'never under 65% of the table price → '+W.it.x.p); }
  console.log(fails?'  '+fails+' FAILED':'  all rule checks passed');})();

/* ---------- 2. where the price goes with a crowd ---------- */
const KA=Object.assign({},arg.wait===undefined?{}:{WAIT:arg.wait},arg.keep===undefined?{}:{WAIT_KEEP:arg.keep});
function run(o,seed){const k=Object.assign({VSIG:0,VMIN:0},KA,o.K||{}),V=o.V,P0=o.P0;
  const defs={x:{base:P0,cap:false,sup:o.sup,dem:o.dem,qs:o.qs||[1,1],qb:o.qb||[1,1],m:[V/P0,V/P0]}},W={t:T0,it:{},pl:{},nn:1e18},M=makeMarket(defs,W,{rand:rng(seed),K:k});
  if(o.nofloor)k.FLOOR=0;const h=[];let rounds=0,last=null;
  for(let i=1;i<=24*(o.days||14);i++){if(o.shock&&i===o.shock[0]+1){W.it.x.V=W.it.x.V0=V*o.shock[1];}M.advance(T0+i*H);h.push(W.it.x.p);if(W.it.x.lr&&W.it.x.lr!==last){last=W.it.x.lr;rounds++;}}
  return {h,rounds};}
function many(name,o){const V=o.V,d1=[],d3=[],wk=[],lo=[],hi=[],reach=[],rd=[];
  for(let s=1;s<=8;s++){const {h,rounds}=run(o,s*7919),l=h.slice(-168);d1.push(h[23]);d3.push(h[71]);wk.push(mean(l));lo.push(Math.min(...l));hi.push(Math.max(...l));rd.push(rounds);
    const i=h.findIndex(x=>Math.abs(x/V-1)<=.05);reach.push(i<0?h.length:i+1);}
  const f=x=>(mean(x)/V).toFixed(2)+'V';
  console.log(`${name}: start ${(o.P0/V).toFixed(2)}V | within 5% of V after ${mean(reach).toFixed(0)} h | day 1 ${f(d1)}, day 3 ${f(d3)} | week 2 mean ${f(wk)}, low ${f(lo)}, high ${f(hi)} | rounds a day ${(mean(rd)/14).toFixed(1)}`);}
const C={sup:60,dem:60,qs:[5,30],qb:[5,30]};
console.log('price table'+(arg.wait===undefined?'':' (WAIT='+arg.wait+')'));
many('A common, start price right        ',Object.assign({V:100,P0:100},C));
many('B common, start half the value     ',Object.assign({V:200,P0:100},C));
many('C common, start a third too dear   ',Object.assign({V:75,P0:100},C));
many('C2 common, value under the floor   ',Object.assign({V:50,P0:100},C));
many('D rare, 5 buyers per unit listed   ',{V:20000,P0:20000,sup:.3,dem:1.5});
many('E rare, 3 units listed per buyer   ',{V:20000,P0:20000,sup:1.0,dem:.3});
many('F thin, 1 seller + 1 buyer per 5 h ',{V:5000,P0:5000,sup:.2,dem:.2});
many('F2 thin crystal as in the game     ',{V:20000,P0:20000,sup:.3,dem:.3});
for(let s=1;s<=3;s++){const {h}=run(Object.assign({V:100,P0:100,shock:[120,2]},C),s*31);
  console.log(`G demand doubles on day 5 (run ${s}): before ${h[119].toFixed(0)} · +6 h ${h[125].toFixed(0)} · +12 h ${h[131].toFixed(0)} · +1 day ${h[143].toFixed(0)} · +3 days ${h[191].toFixed(0)} · highest ${Math.max(...h.slice(120)).toFixed(0)}`);}

/* ---------- 3. the whole market as the game builds it (same item table as items.js, 7 days warm-up + 30 days) ---------- */
(function whole(){const ETC={},REG=['vik','azt','grk','egy','jpn'];
  for(const r of REG)for(let g=0;g<10;g++){ETC[`m_${r}_${g}_a`]={price:8+6*g,kind:'mat',reg:r,grade:g};ETC[`m_${r}_${g}_b`]={price:30+25*g,kind:'mat',reg:r,grade:g,rare:1};}
  [100,400,1500,5000].forEach((p,i)=>ETC['ore'+(i+1)]={price:p,kind:'ore',tier:i+1});ETC.drill={price:3000,kind:'tool'};ETC.pliers={price:2000,kind:'tool'};ETC.guard={price:50000,kind:'tool'};
  for(const r of REG)ETC['trait_'+r]={price:20000,kind:'crystal',reg:r};
  const U={hp1:[25,'hp'],hp2:[120,'hp'],hp3:[450,'hp'],hp4:[1100,'hp'],sp1:[60,'sp'],sp2:[300,'sp'],sp3:[900,'sp'],elixir:[15000,'full'],manual:[20000,'exp'],ret:[300,'warp'],capscroll:[800,'warp'],wing:[60,'warp']};
  for(const k in U)ETC[k]={price:U[k][0],kind:'use',[U[k][1]]:1};for(const f of ['atk','def','vit','agi','tal','cha'])ETC['food_'+f]={price:1500,kind:'use',buff:f};
  for(const st of ['atk','def','agi','vit','int','cha','tal','lck'])for(let t=1;t<=4;t++)ETC[`orb_${st}_${t}`]={price:300*t*t,kind:'orb',tier:t};
  /* 2026-11-21: Star Ore + totem goods (same as items.js; ids of the 12 + 12 mutation / support gems from gem_data.js) */
  ETC.sore={price:50000,kind:'ore',tier:5};
  [2000,6000,15000,40000].forEach((p,i)=>ETC['tstone'+(i+1)]={price:p,kind:'tstone',tier:i+1});[800,2400,6000,16000].forEach((p,i)=>ETC['tfrag'+(i+1)]={price:p,kind:'tfrag',tier:i+1});
  ETC.tess={price:2500,kind:'tess'};
  for(const g of ['focus','spread','heavy','rapid','stack','fire','ice','volt','guard','rage','siphon','totem'])ETC['gmut_'+g]={price:25000,kind:'gmut'};
  for(const g of ['echo','third','force','splash','chain','quick','thrift','burn','frost','pierce','leech','impact'])ETC['gsup_'+g]={price:12000,kind:'gsup'};
  const NPC=new Set(['hp1','hp2','hp3','hp4','sp1','sp2','sp3','food_atk','food_def','food_vit','food_agi','food_tal','food_cha','manual','ret','capscroll','wing','ore1','ore2','ore3','ore4','drill','pliers','guard']);
  const defs={};for(const id in ETC){const d=crowdDef(id,ETC[id],NPC.has(id));if(d)defs[id]=d;}
  const W={},M=makeMarket(defs,W,{rand:rng(4242),news:NEWS,K:KA});let t0=Date.now();M.advance(T0);const warm=Date.now()-t0;
  const st={rounds:0,r0:0,r1:0,lot:0,big:0,empty:0,inround:0,samples:0,news:{}},seen=new Map();t0=Date.now();const day={},prev={};
  for(let i=1;i<=24*30;i++){M.advance(T0+i*H);st.samples++;if(i%24===0)for(const id in defs){const k=defs[id].kind+(defs[id].rare?' rare':''),pp=W.it[id].p;if(prev[id])(day[k]=day[k]||[]).push(Math.abs(pp/prev[id]-1));prev[id]=pp;}if(W.news)st.news[W.news.k]=(st.news[W.news.k]||0)+1;
    for(const id in defs){const I=W.it[id];if(I.rd)st.inround++;else if(!M.units(I.q))st.empty++;
      if(I.lr&&seen.get(id)!==I.lr){seen.set(id,I.lr);st.rounds++;if(I.lr.n===0)st.r0++;else if(I.lr.Q<=I.lr.U)st.r1++;else{st.lot++;if(I.lr.Q>=3*I.lr.U)st.big++;}}}}
  const live=Date.now()-t0,n=Object.keys(defs).length,by={};
  for(const id in defs){const k=defs[id].kind+(defs[id].rare?' rare':''),r=W.it[id].p/defs[id].base;(by[k]=by[k]||[]).push(r);}
  console.log(`whole market: ${n} items · warm-up 7 days ${warm} ms · 30 days hour by hour ${live} ms · saved state ${(JSON.stringify(W).length/1024).toFixed(0)} KB`);
  console.log(`  rounds per day ${(st.rounds/30).toFixed(0)}: nobody reserved ${(100*st.r0/st.rounds).toFixed(0)}% · everyone served ${(100*st.r1/st.rounds).toFixed(0)}% · lots drawn ${(100*st.lot/st.rounds).toFixed(0)}% (3× or more: ${(100*st.big/st.rounds).toFixed(0)}%)`);
  console.log(`  at any time: ${(st.inround/st.samples).toFixed(1)} items in a round · ${(st.empty/st.samples).toFixed(1)} out of stock · news on ${(100*Object.values(st.news).reduce((a,b)=>a+b,0)/st.samples).toFixed(0)}% of the time`);
  for(const k in by){const a=by[k].sort((x,y)=>x-y),d=day[k].sort((x,y)=>x-y),pc=q=>(100*d[Math.floor(q*(d.length-1))]).toFixed(0)+'%';
    console.log(`  ${k.padEnd(9)}: price ÷ table price low ${a[0].toFixed(2)} · middle ${a[a.length>>1].toFixed(2)} · high ${a[a.length-1].toFixed(2)} | move in a day: usual ${pc(.5)} · 1 day in 10 ${pc(.9)} · biggest ${pc(1)}`);}
})();
process.exit(fails?1:0);
