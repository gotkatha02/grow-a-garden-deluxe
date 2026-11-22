/* =====================================================================
   CENTRAL MARKET v2 (owner 2026-11-21) — rules: MARKET_SYSTEM_TH.md
   · every stackable item has ONE central price, set by the system (sellers only choose the quantity)
   · stock in the market  = instant buy at the central price; bought out = +5% and the item is "out of stock"
   · out of stock + a new listing = a 60-minute reservation round (price locked, money held, more requests than
     units = hand out 1 each in turn, then draw lots), the price then moves by demand ÷ units
   · offline game: the other players are a simulated crowd that buys, sells and reserves by the same rules
   Part 1 = the engine (no DOM; `node tools/market_check.js` runs it) · Part 2 = game glue + the window.
   Gear (random stats) is NOT here yet — it still uses the old seller-priced market in items.js (phase 2).
   ===================================================================== */
(function(root){
'use strict';
const MIN=60e3,H=3600e3;
const K={ROUND:60*MIN,FEE:.01,TAX:.05,SLOTS:10,LIFE:48*H,RES_MAX:10,NOCANCEL:5*MIN,RELOCK:24*H,
  SOLDOUT:.05,R_NONE:-.03,R_SHORT:-.01,R_BASE:.02,R_DBL:.06,R_MAX:.20,          // price steps (section 7 of the design)
  HCAP:.05,MINVOL:5,IDLE_H:6,IDLE:.02,IDLE_X:4,FLOOR:.65,
  EL:2,WAIT:.6,WAIT_KEEP:.97,                                                    // simulated crowd: price elasticity · share of waiting buyers who come back when a round opens · how much of the waiting list is left after an hour
  TICK:5*MIN,BIGTICK:15*MIN,CATCH:7*24*H,HIST_H:3,HISTN:56,VSIG:.012,VPULL:.02,VMIN:.7};
/* prices are kept as decimals; money always uses the rounded price */
const px=p=>p<1000?Math.max(1,Math.round(p)):p<100000?Math.round(p/10)*10:Math.round(p/100)*100;
const hv=p=>p<100?Math.round(p*100)/100:p<1000?Math.round(p*10)/10:Math.round(p);        // price history keeps the decimals of cheap goods

function makeMarket(defs,W,opt){
  opt=opt||{};const rand=opt.rand||Math.random,C=Object.assign({},K,opt.K||{}),NW=opt.news||[];
  const gauss=()=>{let u=0,v=0;while(!u)u=rand();while(!v)v=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(6.283185307*v);};
  const pois=lam=>{if(!(lam>0))return 0;if(lam>50)return Math.max(0,Math.round(lam+Math.sqrt(lam)*gauss()));const L=Math.exp(-lam);let k=0,p=1;for(;;){p*=rand();if(p<=L)return k;k++;}};
  const ri=r=>r[0]+Math.floor(rand()*(r[1]-r[0]+1));
  const units=q=>{let s=0;for(const g of q)s+=g[0];return s;};
  const heroOf=key=>key.slice(0,key.indexOf('#'));
  const ownUnits=(q,hero)=>{let s=0;for(const g of q)if(g[1]&&heroOf(g[1])===hero)s+=g[0];return s;};
  const clamp=(id,p)=>{const d=defs[id];p=Math.max(d.base*C.FLOOR,p);return d.cap?Math.min(d.base,p):p;};
  W.it=W.it||{};W.pl=W.pl||{};
  const M={rev:0,K:C,px};
  const pl=hero=>(W.pl[hero]||(W.pl[hero]={ls:[],rs:{},box:{z:0,it:{}},lock:{},bell:{},log:[],note:[],uid:1}));
  function note(hero,n){const P=pl(hero);if(n.k==='sold'){const o=P.note.find(x=>x.k==='sold'&&x.id===n.id);if(o){o.n+=n.n;o.z+=n.z;return;}}P.note.push(n);if(P.note.length>60)P.note.shift();}
  function mk(id){const d=defs[id],m=d.m?d.m[0]+rand()*(d.m[1]-d.m[0]):d.cap?.70+rand()*.25:.8+rand()*.7;
    return {p:d.base,V:d.base*m,V0:d.base*m,q:[],rd:null,B:0,L:0,s6:0,st:0,h:[],w:0,lr:null};}
  const newsOf=()=>W.news&&NW.find(n=>n.k===W.news.k),newsMul=d=>{const n=newsOf();return n&&n.f(d)?[n.sup||1,n.dem||1]:[1,1];};M.news=newsOf;

  /* money for units a player's listing sold */
  function credit(id,key,k,P,t){const hero=heroOf(key),R=pl(hero),L=R.ls.find(l=>hero+'#'+l.u===key);const z=Math.floor(k*px(P)*(1-C.TAX));
    if(L){L.n-=k;L.sold+=k;L.gain=(L.gain||0)+z;}R.box.z+=z;note(hero,{k:'sold',id,n:k,z,t});M.rev++;}
  /* take n units from the front of a queue (never the buyer's own units) */
  function sell(id,q,n,P,t,skip){let left=n;for(let i=0;i<q.length&&left>0;){const g=q[i];if(skip&&g[1]&&heroOf(g[1])===skip){i++;continue;}
      const k=Math.min(g[0],left);g[0]-=k;left-=k;if(g[1])credit(id,g[1],k,P,t);if(g[0]<=0)q.splice(i,1);else i++;}return n-left;}
  const pushSeg=(q,n,key)=>{const l=q[q.length-1];if(!key&&l&&!l[1])l[0]+=n;else q.push(key?[n,key]:[n]);};
  function openRound(id,I,t){I.rd={e:t+C.ROUND,P:I.p,q:[],rs:[],pr:{}};
    const back=Math.round(I.w*C.WAIT);for(let i=0;i<back;i++)I.rd.rs.push(ri(defs[id].qb));I.w=0;        // people who were waiting come back to reserve
    for(const h in W.pl)if(W.pl[h].bell&&W.pl[h].bell[id]){note(h,{k:'bell',id,e:I.rd.e,t});delete W.pl[h].bell[id];}M.rev++;}
  /* a listing arrives (crowd: key undefined) */
  function addListing(id,I,n,t,key){I.L+=n;if(!I.rd&&units(I.q)===0)openRound(id,I,t);
    if(I.rd){pushSeg(I.rd.q,n,key);return true;}pushSeg(I.q,n,key);return false;}
  function soldOut(id,I){I.p=clamp(id,I.p*(1+C.SOLDOUT));M.rev++;}

  /* hand out the units of a round: everyone who asked gets 1 in turn until the rest is smaller than the people still short → draw lots */
  function allocate(reqs,U){const n=reqs.length,g=new Array(n).fill(0);let Q=0;for(const r of reqs)Q+=r;
    if(Q<=U){for(let i=0;i<n;i++)g[i]=reqs[i];return g;}
    let k=0;for(;;){let s=0;for(const r of reqs)s+=Math.min(r,k+1);if(s>U)break;k++;}
    let used=0;const cand=[];for(let i=0;i<n;i++){g[i]=Math.min(reqs[i],k);used+=g[i];if(reqs[i]>k)cand.push(i);}
    for(let i=0,rem=U-used;i<rem;i++){const j=i+Math.floor(rand()*(cand.length-i)),x=cand[i];cand[i]=cand[j];cand[j]=x;g[cand[i]]++;}
    return g;}
  M.allocate=allocate;
  function endRound(id,I,t){const R=I.rd,U=units(R.q),heroes=Object.keys(R.pr),reqs=R.rs.map(q=>Math.min(U,q)).concat(heroes.map(h=>Math.min(U,R.pr[h])));
    let Q=0;for(const r of reqs)Q+=r;const x=U?Q/U:0,ch=Q===0?C.R_NONE:x<1?C.R_SHORT:Math.min(C.R_MAX,C.R_BASE+C.R_DBL*Math.log2(x));
    const g=allocate(reqs,U),got=Math.min(Q,U),P=px(R.P);
    sell(id,R.q,got,R.P,t);
    heroes.forEach((h,i)=>{const gi=g[R.rs.length+i],want=R.pr[h],PL=pl(h),r=PL.rs[id],hold=r?r.hold:want*P,back=hold-gi*P;
      if(gi>0){PL.box.it[id]=(PL.box.it[id]||0)+gi;PL.lock[id]=t+C.RELOCK;}if(back>0)PL.box.z+=back;delete PL.rs[id];
      note(h,{k:'round',id,q:want,g:gi,back,P,n:reqs.length,U,ch,t});});
    I.s6+=got;I.p=clamp(id,I.p*(1+ch));I.lr={t,U,n:reqs.length,Q,ch,P};I.rd=null;
    if(R.q.length){I.q=R.q;I.st=t;I.B=I.L=0;for(const s of R.q)if(s[1]){const L=pl(heroOf(s[1])).ls.find(l=>heroOf(s[1])+'#'+l.u===s[1]);if(L)L.rd=0;}}
    M.rev++;}

  function stepItem(id,I,dt,t){const d=defs[id],nm=newsMul(d),f=dt/H,v=I.V;
    for(let ns=pois(d.sup*nm[0]*f*Math.pow(I.p/v,C.EL));ns>0;ns--)addListing(id,I,ri(d.qs),t);
    const lam=d.dem*nm[1]*f*Math.pow(v/I.p,C.EL);
    if(I.rd){for(let nb=pois(lam);nb>0;nb--)I.rd.rs.push(ri(d.qb));}
    else if(units(I.q)>0){for(let nb=pois(lam);nb>0;nb--){const S=units(I.q);if(S<=0){I.w++;continue;}const q=Math.min(S,ri(d.qb));sell(id,I.q,q,I.p,t);I.B+=q;if(units(I.q)===0)soldOut(id,I);}}
    else I.w+=pois(lam);}
  function hour(t){const hi=Math.round(t/H);
    for(const id in defs){const I=W.it[id];if(!I)continue;const S=I.rd?0:units(I.q);
      if(S>0&&I.B+I.L>=C.MINVOL)I.p=clamp(id,I.p*(1+C.HCAP*(I.B-I.L)/(I.B+I.L)));
      I.s6+=I.B;
      if(hi%C.IDLE_H===0){if(S>0&&S>C.IDLE_X*I.s6&&t-I.st>=C.IDLE_H*H)I.p=clamp(id,I.p*(1-C.IDLE));I.s6=0;}
      I.B=I.L=0;I.w*=C.WAIT_KEEP;
      const d=defs[id];let V=I.V*Math.exp(C.VSIG*gauss());V+=(I.V0-V)*C.VPULL;I.V=d.cap?Math.max(d.base*.68,Math.min(d.base*.97,V)):Math.max(d.base*C.VMIN,V);
      if(hi%C.HIST_H===0){I.h.push(hv(I.p));if(I.h.length>C.HISTN)I.h.shift();}}
    if(W.news&&t>=W.news.u)W.news=null;
    if(!W.news&&NW.length&&t>=(W.nn||0)){const u=t+(5+rand()*5)*H;W.news={k:NW[Math.floor(rand()*NW.length)].k,u,s:t};W.nn=u+(2+rand()*4)*H;}
    M.rev++;}
  function expire(t){for(const h in W.pl){const P=W.pl[h];for(const L of P.ls){if(L.n>0&&!L.rd&&t-L.t>=C.LIFE){const I=W.it[L.id],key=h+'#'+L.u;
        if(I){const i=I.q.findIndex(s=>s[1]===key);if(i>=0)I.q.splice(i,1);}P.box.it[L.id]=(P.box.it[L.id]||0)+L.n;note(h,{k:'expire',id:L.id,n:L.n,t});L.n=0;L.x=1;M.rev++;}}
      P.ls=P.ls.filter(L=>L.n>0||(L.sold>0&&t-L.t<C.LIFE+24*H));}}
  M.advance=function(now){
    if(!W.t){W.t=Math.floor((now-C.CATCH)/H)*H;W.it=W.it||{};W.pl=W.pl||{};W.nn=W.t+12*H;}
    if(now<=W.t)return;if(now-W.t>C.CATCH)W.t=now-C.CATCH;
    for(let n=0;W.t<now&&n<40000;n++){const big=now-W.t>6*H;let t1=Math.min(now,W.t+(big?C.BIGTICK:C.TICK));const nh=(Math.floor(W.t/H)+1)*H;if(t1>nh)t1=nh;
      const dt=t1-W.t;for(const id in defs){const I=W.it[id]||(W.it[id]=mk(id));stepItem(id,I,dt,t1);if(I.rd&&I.rd.e<=t1)endRound(id,I,t1);}
      if(t1===nh)hour(t1);expire(t1);W.t=t1;}};

  /* ---------------- what the player does (the game moves the zeny / items; these only check + change the market) ---------------- */
  const item=id=>defs[id]&&(W.it[id]||(W.it[id]=mk(id)));
  M.fee=(id,n)=>Math.max(1,Math.ceil(n*px(item(id).p)*C.FEE));
  M.list=function(hero,id,n,t){const I=item(id),P=pl(hero);n=Math.floor(n);if(!I||!(n>=1))return {err:'bad'};
    if(P.ls.filter(l=>l.n>0).length>=C.SLOTS)return {err:'slots'};if((P.lock[id]||0)>t)return {err:'lock',until:P.lock[id]};
    if(I.rd&&I.rd.pr[hero])return {err:'reserved'};
    const fee=M.fee(id,n),L={u:P.uid++,id,n0:n,n,sold:0,gain:0,t,rd:0},ahead=I.rd?0:units(I.q);
    L.rd=addListing(id,I,n,t,hero+'#'+L.u)?1:0;P.ls.unshift(L);M.rev++;return {ok:1,fee,round:!!L.rd,end:I.rd&&I.rd.e,ahead,u:L.u};};
  M.withdraw=function(hero,u,t){const P=pl(hero),L=P.ls.find(l=>l.u===u);if(!L||L.n<=0)return {err:'none'};if(L.rd)return {err:'round'};
    const I=item(L.id),key=hero+'#'+u,i=I?I.q.findIndex(s=>s[1]===key):-1;if(i>=0)I.q.splice(i,1);const n=L.n;L.n=0;if(!L.sold)P.ls=P.ls.filter(l=>l!==L);M.rev++;return {ok:1,id:L.id,n};};
  M.buy=function(hero,id,n,t){const I=item(id);n=Math.floor(n);if(!I||!(n>=1))return {err:'bad'};if(I.rd)return {err:'round'};
    const S=units(I.q),av=S-ownUnits(I.q,hero);if(n>av)return {err:'stock',av};const price=px(I.p);
    sell(id,I.q,n,I.p,t,hero);I.B+=n;if(units(I.q)===0)soldOut(id,I);M.rev++;return {ok:1,n,price,cost:n*price};};
  M.reserve=function(hero,id,n,t){const I=item(id),P=pl(hero);n=Math.floor(n);if(!I||!I.rd||!(n>=1))return {err:'bad'};const R=I.rd;
    if(ownUnits(R.q,hero)>0)return {err:'own'};if(P.rs[id])return {err:'twice'};if(Object.keys(P.rs).length>=C.RES_MAX)return {err:'max'};
    const U=units(R.q);if(n>U)return {err:'units',U};const hold=n*px(R.P);P.rs[id]={q:n,hold,P:px(R.P),e:R.e,t};R.pr[hero]=n;M.rev++;return {ok:1,hold,end:R.e};};
  M.cancel=function(hero,id,t){const I=item(id),P=pl(hero),r=P.rs[id];if(!I||!I.rd||!r)return {err:'none'};if(t>=I.rd.e-C.NOCANCEL)return {err:'late'};
    delete P.rs[id];delete I.rd.pr[hero];M.rev++;return {ok:1,refund:r.hold};};
  M.bell=function(hero,id,on){const P=pl(hero);if(on)P.bell[id]=1;else delete P.bell[id];};
  /* ---------------- what the window shows ---------------- */
  M.view=function(id,hero){const I=item(id);if(!I)return null;const d=defs[id],S=I.rd?0:units(I.q),P=hero?pl(hero):null,R=I.rd,
      h=I.h,old=h.length?h[Math.max(0,h.length-Math.round(24/C.HIST_H))]:I.p;
    const o={id,price:px(I.p),mode:R?'round':S>0?'normal':'empty',stock:S,own:P&&!R?ownUnits(I.q,hero):0,ch24:old?I.p/old-1:0,w:Math.round(I.w),lr:I.lr,hist:h,base:d.base,cap:!!d.cap,
      lock:P&&P.lock[id]>W.t?P.lock[id]:0,bell:!!(P&&P.bell[id])};
    if(R){let Q=0;for(const q of R.rs)Q+=q;for(const k in R.pr)Q+=R.pr[k];
      o.rd={e:R.e,P:px(R.P),U:units(R.q),n:R.rs.length+Object.keys(R.pr).length,Q,mine:R.pr[hero]||0,seller:P?ownUnits(R.q,hero):0};}
    return o;};
  M.me=pl;M.world=W;M.units=units;
  return M;}

/* the simulated crowd: how many sellers / buyers an hour come for an item when its price equals what they think it is worth,
   and how many units each brings (E = the item's row in ETC, npc = the NPC shop sells it → the shop price is the ceiling) */
function crowdDef(id,E,npc){const g=E.grade||0,f=Math.pow(.86,g);let sup,q,m;
  switch(E.kind){
    case 'mat':if(E.rare){sup=1.6*f;q=[1,6];}else{sup=5*f;q=[4,24];}break;
    case 'ore':if(id==='sore'){sup=.12;q=[1,2];m=[1,1.5];}else{sup=[4,3,2,1.2][(E.tier||1)-1];q=[2,10];}break;   /* sore = Star Ore (+11 … +15) */
    case 'tstone':sup=[1.2,.9,.6,.35][(E.tier||1)-1];q=[1,3];break;            /* totem goods (owner 2026-11-21) */
    case 'tfrag':sup=[1,.8,.5,.3][(E.tier||1)-1];q=[2,10];break;
    case 'tess':sup=1.5;q=[5,20];break;
    case 'gmut':sup=.12;q=[1,1];m=[1,1.6];break;
    case 'gsup':sup=.2;q=[1,2];m=[1,1.4];break;
    case 'orb':sup=[.9,.6,.4,.25][(E.tier||1)-1];q=[1,2];break;
    case 'crystal':sup=.3;q=[1,1];m=[1,1.8];break;
    case 'bpart':if(!E.live)return null;sup=[.3,.12,.06][{map:0,mvp:1,main:2}[E.btier]||1];q=[1,2];m=[1,1.6];break;   /* boss parts (drop_table.js) — only bosses in the game */
    case 'tool':sup=id==='guard'?.25:.5;q=[1,2];break;
    case 'pcharm':if((E.tier||1)>2)return null;sup=[2,1.2][(E.tier||1)-1];q=[2,8];break;            /* pets (pet_data.js): bond charms — tiers 3–4 have no monsters yet */
    case 'pegg':sup={1:.5,2:.25}[E.tier]||.15;q=[1,2];m=[1,1.5];break;                               /* eggs: tamed by players, rarer when the charm tier is higher */
    case 'pfluff':sup=.4;q=[1,4];break;
    case 'ptreat':sup=.12;q=[1,1];m=[1,1.4];break;
    /* rune goods (owner 2026-11-23, rune_data.js): roots (sap, medals, root skill gems) + ring (raw stones, pouches, dust, spirit / carved runes) */
    case 'rsap':sup=4;q=[5,30];break;
    case 'rmedal':sup=.15;q=[1,2];m=[1,1.6];break;
    case 'rgem':sup=[.12,.08,.05,.03][(E.tier||1)-1];q=[1,1];m=[1,1.8];break;
    case 'rstone':sup=[.5,.2,.06][E.grade||0];q=[1,2];m=[1,1.6];break;
    case 'rbag':sup=.8;q=[1,4];break;
    case 'sdust':sup=.3;q=[1,3];break;
    case 'srune':sup=[.08,.03,.01][E.grade||0];q=[1,1];m=[1,1.8];break;
    case 'crune':sup=.25;q=[1,2];m=[1,1.4];break;
    case 'use':if(E.hp||E.sp){sup=3.2-.5*(+id.slice(-1)||1);q=[3,15];}else if(E.full){sup=.2;q=[1,1];m=[1,1.6];}else if(E.buff){sup=.8;q=[1,4];}else if(E.exp){sup=.3;q=[1,1];}else{sup=1.5;q=[1,6];}break;
    default:return null;}
  return {id,base:E.price,cap:!!npc,sup,dem:sup,qs:q,qb:q,m,kind:E.kind,reg:E.reg,rare:!!E.rare};}
/* market news: for some hours one group of goods is wanted more (dem) or brought in more (sup) → rounds get crowded, prices move */
const NEWS=[{k:'refine',dem:2,f:d=>d.kind==='ore'||d.id==='guard'},{k:'totem',dem:2.2,f:d=>d.kind==='tstone'||d.kind==='tfrag'||d.kind==='tess'},{k:'gem',dem:2.5,f:d=>d.kind==='gmut'||d.kind==='gsup'||d.kind==='bpart'},{k:'rune',dem:2.3,f:d=>/^(rstone|rbag|sdust|srune|crune)$/.test(d.kind)},{k:'roots',dem:2,f:d=>/^(rsap|rmedal|rgem)$/.test(d.kind)},{k:'orb',dem:3,f:d=>d.kind==='orb'},{k:'crystal',dem:4,f:d=>d.kind==='crystal'},
  {k:'rare',dem:2.2,f:d=>d.kind==='mat'&&d.rare},{k:'pet',dem:2,f:d=>d.kind==='pegg'||d.kind==='ptreat'},{k:'potion',sup:1.8,f:d=>d.kind==='use'&&d.cap}];
for(const r of ['vik','azt','grk','egy','jpn']){NEWS.push({k:'want_'+r,reg:r,dem:1.7,f:d=>d.kind==='mat'&&d.reg===r});NEWS.push({k:'glut_'+r,reg:r,sup:1.7,f:d=>d.kind==='mat'&&d.reg===r});}
const API={makeMarket,K,px,crowdDef,NEWS};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.MKT_ENGINE=API;
})(typeof window!=='undefined'?window:globalThis);

/* =====================================================================
   Part 2 — game glue + the market window (needs items.js: AFItems.ui)
   The world (prices, stock, rounds, crowd) is ONE per save mode and shared by all heroes on this device: af_mkt2_play / af_mkt2_test.
   Each hero has its own listings, reservations, claim box and log inside it (W.pl[hero]).
   Test mode: the ⏩ buttons move the market clock forward (W.skew) so a 60-minute round can be tried at once.
   ===================================================================== */
(function(){
if(typeof document==='undefined'||!window.AFItems||!AFItems.ui||!window.MKT_ENGINE)return;
const A=AFItems,U=A.ui,ETC=A.ETC,BAG=A.BAG,EN=MKT_ENGINE,K=EN.K,MIN=60e3,HR=3600e3,HERO=typeof CHAR==='string'?CHAR:'hero';
const TEST=()=>!!(window.AFProgress&&AFProgress.mode==='test'),WKEY='af_mkt2_'+(A.MODE==='play'?'play':'test');
const WV=1;let W={};try{W=JSON.parse(localStorage.getItem(WKEY)||'{}')||{};}catch(e){W={};}if(W.v!==WV)W={v:WV};       // bump WV only when the saved shape changes (it resets the market world)
const NPC=new Set(A.SHOP_FULL||[]),defs={};for(const id in ETC){const d=EN.crowdDef(id,ETC[id],NPC.has(id));if(d)defs[id]=d;}
const M=EN.makeMarket(defs,W,{news:EN.NEWS});
const now=()=>Date.now()+(W.skew||0),save=()=>{try{localStorage.setItem(WKEY,JSON.stringify(W,(k,v)=>typeof v==='number'&&v%1?Math.round(v*1000)/1000:v));}catch(e){}};
const fmt=U.fmt,nm=U.etcName,ico=U.etcIcon,me=()=>M.me(HERO),say=t=>{try{msg(t);}catch(e){}};
const cd=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s%60).padStart(2,'0');};
const hhmm=t=>new Date(t).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});   // the market's own clock (test mode can move it forward)
const pct=x=>{const p=Math.round(x*1000)/10;return p>0?`<span class="up">▲ +${p}%</span>`:p<0?`<span class="dn">▼ ${p}%</span>`:'<span class="fl">— 0%</span>';};
const logLine=t=>{const P=me();P.log.unshift(hhmm(now())+' · '+t);P.log=P.log.slice(0,40);};
const ERR={slots:`ลงขายได้พร้อมกัน ${K.SLOTS} รายการ`,lock:'เพิ่งได้ของชนิดนี้จากรอบจอง ยังลงขายต่อไม่ได้',reserved:'คุณจองของในรอบนี้อยู่ จึงลงขายในรอบเดียวกันไม่ได้',round:'ของอยู่ในรอบจอง',stock:'ของในตลาดไม่พอ',
  own:'คุณมีของในรอบนี้ จึงจองไม่ได้',twice:'จองได้ 1 ครั้งต่อรอบ',max:`จองค้างได้พร้อมกัน ${K.RES_MAX} รอบ`,units:'จองได้ไม่เกินจำนวนของในรอบ',late:'ยกเลิกไม่ได้ในช่วง 5 นาทีสุดท้าย',none:'ไม่พบรายการ',bad:'ทำรายการไม่ได้'};
const NEWS_T={rune:'หมอผีทั่วแผ่นดินเปิดวงอ่านรูน — หินรูนดิบ ถุงรูนสลัก และรูนวิญญาณเป็นที่ต้องการ',roots:'รากโทเท็มตื่น — ยางวิญญาณ เหรียญโทเท็มทอง และเจมสกิลรากเป็นที่ต้องการ',pet:'กระแสเลี้ยงสัตว์มาแรง — ไข่สัตว์เลี้ยงและขนมเปลี่ยนนิสัยเป็นที่ต้องการ',refine:'ช่างทั่วแผ่นดินแห่ตีบวก — หินตีบวกและหินกันแตกเป็นที่ต้องการ',totem:'ศาลโทเท็มคึกคัก — หินโทเท็ม ชิ้นส่วนเจม และแก่นโทเท็มเป็นที่ต้องการ',gem:'นักแกะเจมทั่วแผ่นดินตามหาเจมแปรสภาพและเจมเสริม',orb:'นักผจญภัยแห่อัดหินออฟ — หินออฟเป็นที่ต้องการ',crystal:'ช่างฝีมือตามหาผลึกนิสัย — ผลึกเป็นที่ต้องการมาก',
  rare:'งานคราฟต์ชิ้นใหญ่ทั่วแผ่นดิน — วัตถุดิบหายากเป็นที่ต้องการ',potion:'นักเล่นแร่แปรธาตุเทของ — ยาเข้าตลาดเยอะ ราคาอ่อนตัว'};
function newsText(){const n=M.news();if(!n||W.news.u<=now())return '';const tn=n.reg&&A.TOWNS[n.reg]?A.TOWNS[n.reg].name:'';
  return NEWS_T[n.k]||(n.k.indexOf('want_')===0?`คาราวานมุ่งหน้าสู่${tn} — วัตถุดิบ${tn}เป็นที่ต้องการ`:`นักล่ากลับจาก${tn} — วัตถุดิบ${tn}เข้าตลาดเยอะ ราคาอ่อนตัว`);}

/* ---- what happened while you were not looking → the log of "ของฉัน" + chat (sales: one summary line every 10 minutes at most) ---- */
const sold={n:0,z:0,t:0};
function flush(){const P=me();if(!P.note.length)return;const ns=P.note.splice(0);for(const n of ns){const x=nm(n.id);let t='',get=' (รับที่ตลาดกลาง)';
    if(n.k==='sold'){let o=P.sl;const tn=n.t||now(),same=o&&o.id===n.id&&P.log[0]===o.s&&tn-o.t<30*MIN;if(same){o.n+=n.n;o.z+=n.z;}else o=P.sl={id:n.id,n:n.n,z:n.z,t:tn};
      o.s=hhmm(o.t)+' · '+`ขาย ${x} ×${o.n} ได้ ${fmt(o.z)}z`;if(same)P.log[0]=o.s;else P.log.unshift(o.s);sold.n+=n.n;sold.z+=n.z;continue;}
    if(n.k==='round')t=n.g?`ผลรอบจอง ${x}: ได้ ${n.g} จาก ${n.q} ชิ้นที่จอง${n.back?` · คืนเงิน ${fmt(n.back)}z`:''}`:`ผลรอบจอง ${x}: ไม่ได้ของ (${n.n} คนแย่ง ${n.U} ชิ้น) · คืนเงิน ${fmt(n.back)}z`;
    else if(n.k==='bell'){t=`🔔 ${x} มีคนลงขายแล้ว — รอบจองเปิดถึง ${hhmm(n.e)}`;get='';}
    else if(n.k==='expire')t=`${x} ×${n.n} ลงขายครบ 48 ชม. — คืนของเข้ากล่องรับของ`;
    if(!t)continue;P.log.unshift(hhmm(n.t||now())+' · '+t);try{chatLog('sys','⚖ ตลาดกลาง: '+t+get);}catch(e){}if(n.k==='round'||n.k==='bell')say('⚖ '+t);}
  if(sold.z>0&&Date.now()-sold.t>10*MIN){try{chatLog('sys',`⚖ ตลาดกลาง: ขายของได้ ${fmt(sold.n)} ชิ้น รวม ${fmt(sold.z)}z (รับเงินที่ตลาดกลาง)`);}catch(e){}sold.n=sold.z=0;sold.t=Date.now();}
  P.log=P.log.slice(0,40);save();}
function step(){const r=M.rev;M.advance(now());flush();return M.rev!==r;}

/* ---- a brand-new hero (new game / reset) starts with an empty market record; its old listings leave the market ---- */
if(A.fresh&&W.pl[HERO]){const mine=g=>g[1]&&g[1].indexOf(HERO+'#')===0;for(const id in W.it){const I=W.it[id];I.q=I.q.filter(g=>!mine(g));if(I.rd){I.rd.q=I.rd.q.filter(g=>!mine(g));delete I.rd.pr[HERO];}}delete W.pl[HERO];}
/* ---- the old market kept its stackable listings per hero: give them back (once) ---- */
(function(){const O=A.oldMarket;if(!O||!O.MK)return;const MK=O.MK,P=me();let ch=0;
  for(const l of MK.mine||[])if(l.k){if(l.n>0&&!A.fresh){P.box.it[l.k]=(P.box.it[l.k]||0)+l.n;P.log.unshift(`ตลาดเปลี่ยนเป็นระบบราคากลาง: คืน ${nm(l.k)} ×${l.n} ที่ลงขายค้างไว้ → กล่องรับของ`);}ch=1;}
  if(ch)MK.mine=MK.mine.filter(l=>!l.k);const n=(MK.list||[]).length;MK.list=(MK.list||[]).filter(l=>l.eq);if(ch||MK.list.length!==n){O.mkSave();save();}})();

/* ---- money and items move here; the engine only checks and changes the market ---- */
const give=(id,n)=>{const got=A.bagAdd(id,n);if(got<n){if(got>0)A.bagAdd(id,-got);return false;}return true;};
function doBuy(id,n){step();const v=M.view(id,HERO);n=Math.floor(n);if(!(n>=1)||v.mode!=='normal')return say(ERR.stock);const cost=n*v.price;if(A.zeny<cost)return say('Zeny ไม่พอ');
  if(!give(id,n))return say('กระเป๋าเต็ม');const r=M.buy(HERO,id,n,now());if(!r.ok){A.bagAdd(id,-n);return say(ERR[r.err]||ERR.bad);}
  A.zeny=A.zeny-r.cost;logLine(`ซื้อ ${nm(id)} ×${n} ชิ้นละ ${fmt(r.price)}z (−${fmt(r.cost)}z)`);save();U.done(`ซื้อ ${nm(id)} ×${n} (−${fmt(r.cost)}z)`);}
function doList(id,n){step();n=Math.floor(n);if(!(n>=1)||(BAG[id]||0)<n)return say('ของในกระเป๋าไม่พอ');const fee=M.fee(id,n);if(A.zeny<fee)return say(`Zeny ไม่พอจ่ายค่าวางขาย ${fmt(fee)}z`);
  const r=M.list(HERO,id,n,now());if(!r.ok)return say(ERR[r.err]||ERR.bad);A.bagAdd(id,-n);A.zeny=A.zeny-r.fee;
  logLine(`ลงขาย ${nm(id)} ×${n} (ค่าวางขาย ${fmt(r.fee)}z)${r.round?' — เปิดรอบจองถึง '+hhmm(r.end):''}`);save();U.done(r.round?`ลงขาย ${nm(id)} ×${n} — เข้ารอบจองถึง ${hhmm(r.end)}`:`ลงขาย ${nm(id)} ×${n} — ต่อคิวหลังของ ${r.ahead} ชิ้น`);return true;}
function doReserve(id,n){step();const v=M.view(id,HERO);n=Math.floor(n);if(!v.rd||!(n>=1))return say(ERR.bad);const hold=n*v.rd.P;if(A.zeny<hold)return say('Zeny ไม่พอพักเงินจอง');
  const r=M.reserve(HERO,id,n,now());if(!r.ok)return say(ERR[r.err]||ERR.bad);A.zeny=A.zeny-r.hold;logLine(`จอง ${nm(id)} ×${n} พักเงิน ${fmt(r.hold)}z (ผลออก ${hhmm(r.end)})`);save();U.done(`จอง ${nm(id)} ×${n} — พักเงิน ${fmt(r.hold)}z ผลออก ${hhmm(r.end)}`);}
function doCancel(id){step();const r=M.cancel(HERO,id,now());if(!r.ok)return say(ERR[r.err]||ERR.bad);A.zeny=A.zeny+r.refund;logLine(`ยกเลิกจอง ${nm(id)} คืนเงิน ${fmt(r.refund)}z`);save();U.done(`ยกเลิกการจอง ${nm(id)} — คืนเงิน ${fmt(r.refund)}z`);}
function doWithdraw(u){step();const r=M.withdraw(HERO,u,now());if(!r.ok)return say(ERR[r.err]||ERR.bad);const got=Math.max(0,A.bagAdd(r.id,r.n)),rest=r.n-got,P=me();if(rest>0)P.box.it[r.id]=(P.box.it[r.id]||0)+rest;
  logLine(`ถอน ${nm(r.id)} ×${r.n} ออกจากตลาด`);save();U.done(`ถอน ${nm(r.id)} ×${r.n}${rest>0?` (กระเป๋าเต็ม ${rest} ชิ้นอยู่ในกล่องรับของ)`:' กลับเข้ากระเป๋า'}`);}
function doClaim(){step();const B=me().box;let z=B.z,got=[],left=0;B.z=0;if(z)A.zeny=A.zeny+z;
  for(const id of Object.keys(B.it)){const n=B.it[id],g=ETC[id]?Math.max(0,A.bagAdd(id,n)):n;if(g>0)got.push(`${nm(id)} ×${g}`);if(g>=n)delete B.it[id];else{B.it[id]=n-g;left+=n-g;}}
  if(!z&&!got.length&&!left)return;save();U.done(`รับจากตลาดกลาง: ${z?fmt(z)+'z ':''}${got.join(', ')}${left?' · กระเป๋าเต็ม เหลือในกล่อง '+left+' ชิ้น':''}`);}

/* ---------------- window ---------------- */
const css=document.createElement('style');css.textContent=`
#mkx{width:min(880px,97vw)}#mkx .ttbd{position:relative;max-height:calc(100vh - 66px);overflow-y:auto;overflow-x:hidden}
#mkx .tttab{display:flex;gap:4px;margin-bottom:8px}#mkx .tttab button{flex:1;padding:7px 4px;cursor:pointer;white-space:nowrap}#mkx .tttab button.gear{flex:none;padding:7px 12px}
#mkx .tttab .nb{display:inline-block;min-width:16px;height:16px;line-height:16px;border-radius:8px;background:#e2402a;color:#fff;font:600 10px/16px Prompt,sans-serif;font-style:normal;margin-left:5px;padding:0 3px;vertical-align:middle;box-sizing:border-box;text-shadow:none}
#mkx .mkgrid{display:grid;grid-template-columns:116px 1fr;gap:8px}
#mkx .cats{display:flex;flex-direction:column;gap:4px}
#mkx .cats button,#mkx .chips button{text-align:left;font:500 12px Mitr,Mali,sans-serif;color:var(--v2-ink,#2d4a8a);background:var(--v2-card2,#fff);border:1px solid var(--v2-line2,#b8cdee);border-radius:9px;padding:6px 8px;cursor:pointer}
#mkx .cats button.on,#mkx .chips button.on{background:linear-gradient(#fff3c4,#ffd77a);border-color:#c48a2e;color:#5a3a08}
#mkx .chips{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}#mkx .chips button{padding:2px 9px;border-radius:14px;font-size:11px}
#mkx .mkbar{display:flex;gap:6px;align-items:center;margin-bottom:6px}#mkx .mkbar .zz{color:#9a5a08;font:600 12.5px Prompt,sans-serif;white-space:nowrap}
#mkx .tbl{max-height:min(46vh,372px);overflow:auto;border-radius:9px;background:rgba(255,255,255,.82);border:1px solid var(--v2-line2,#b8cdee)}
#mkx .row{display:grid;grid-template-columns:50px 1fr 92px 150px 64px;align-items:center;gap:6px;padding:4px 6px;border-bottom:1px solid rgba(201,137,83,.25);cursor:pointer}
#mkx .row.h{position:sticky;top:0;background:#f6e2c4;font:500 11px Mitr,Mali,sans-serif;color:var(--v2-ink2,#5a6a8a);z-index:1;padding:5px 6px;cursor:default}
#mkx .row:nth-child(even):not(.h){background:rgba(255,246,228,.7)}#mkx .row:hover:not(.h){background:#fff0c8}
#mkx .nm{min-width:0}#mkx .nm b{display:block;font:500 12.5px Mitr,Mali,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mkx .nm small{display:block;font:400 10.5px Prompt,sans-serif;color:var(--v2-ink2,#7a8aa8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mkx .pr{text-align:right;font:600 13px Prompt,sans-serif;color:#9a5a08}#mkx .pr small{display:block;font:500 10.5px Prompt,sans-serif}
#mkx .up{color:#1f8a34}#mkx .dn{color:#cc3a2a}#mkx .fl{color:#9a8f80}
#mkx .bd{display:inline-block;font:500 11px Prompt,sans-serif;border-radius:8px;padding:3px 7px;text-align:center;white-space:nowrap}
#mkx .bd.n{background:#e4f4e2;color:#1f6f2c;border:1px solid #9fd09c}#mkx .bd.r{background:#fff0c2;color:#7a4c06;border:1px solid #dba93c}#mkx .bd.e{background:#ece8e2;color:#7a7268;border:1px solid #c9c0b4}
#mkx .sellgrid{display:grid;grid-template-columns:1fr 310px;gap:8px}
#mkx .bag{display:grid;grid-template-columns:repeat(auto-fill,46px);gap:6px;max-height:min(44vh,330px);overflow:auto;padding:2px}
#mkx .frm label{display:flex;justify-content:space-between;align-items:center;margin:6px 0;font:500 12px Mitr,Mali,sans-serif}
#mkx .q{display:flex;gap:4px;align-items:center}#mkx .q .ttin{width:70px;text-align:center}
#mkx .sum{background:rgba(255,255,255,.85);border:1px solid var(--v2-line2,#c8d6ee);border-radius:9px;padding:6px 9px;margin:6px 0;font:400 12px/1.75 Prompt,sans-serif}#mkx .sum b{font-weight:600}
#mkx .cash{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:linear-gradient(#fff8dc,#ffe9a8);border:1px solid #c48a2e;border-radius:11px;padding:8px 10px;margin-bottom:8px;font:500 13px Mitr,Mali,sans-serif;color:#6b4a14}
#mkx .cash .its{display:flex;gap:4px;flex-wrap:wrap}#mkx .cash .tts{width:38px;height:38px;cursor:default}
#mkx .log{max-height:96px;overflow:auto;font:400 11px/1.6 Prompt,sans-serif;color:var(--v2-ink2,#5a6a8a)}
#mkx .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}#mkx .ttp h4{margin:0 0 6px;font:500 12.5px Mitr,Mali,sans-serif}
#mkx .li{display:flex;align-items:center;gap:6px;padding:3px 2px;border-bottom:1px dashed rgba(201,137,83,.3);font:400 12px Prompt,sans-serif;cursor:pointer}#mkx .li:last-child{border-bottom:0}
#mkx .li .tts{width:30px;height:30px;border-radius:8px}#mkx .li b{font:500 12px Mitr,Mali,sans-serif;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mkx .news{background:linear-gradient(#fff3c4,#ffe2a0);border:1px solid #c48a2e;border-radius:10px;padding:7px 10px;margin-bottom:8px;font:500 12.5px Mitr,Mali,sans-serif;color:#5a3a08}
#mkx .scr{max-height:min(58vh,440px);overflow:auto;padding-right:2px}
#mkx .tbar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:8px;padding:5px 8px;border:1px dashed #b06a2a;border-radius:9px;font:400 11.5px Prompt,sans-serif;color:#7a4c06}
#mkx .foot{margin-top:6px;text-align:center;font:400 11px Prompt,sans-serif;color:var(--v2-ink2,#7a6a4a)}
#mkxpop{position:absolute;inset:0;background:rgba(40,22,10,.55);display:none;align-items:center;justify-content:center;border-radius:14px;z-index:5}
#mkxpop .pc{width:min(370px,94%);max-height:calc(100% - 14px);overflow:auto;box-sizing:border-box;position:relative;background:#fff6e2;border:2px solid #c48a2e;border-radius:14px;padding:11px 12px;box-shadow:0 8px 24px rgba(0,0,0,.45);text-align:center;color:#4a2a16}
#mkxpop .ph{display:flex;gap:9px;align-items:center;text-align:left;padding-right:24px}#mkxpop .ph>div:last-child{min-width:0}#mkxpop .ph b{font:500 14px Mitr,Mali,sans-serif;color:#4a2a16}#mkxpop .ph .ttnote{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mkxpop .px{position:absolute;right:8px;top:8px;width:24px;height:24px;border-radius:50%;border:0;background:#c8463c;color:#fff;font:700 12px/24px sans-serif;cursor:pointer;padding:0}
#mkxpop .big{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:7px 0 4px;text-align:left}#mkxpop .big>b{font:600 22px Prompt,sans-serif;color:#9a5a08}#mkxpop .big small{display:block;font:500 11px Prompt,sans-serif}
#mkxpop .gr{text-align:right;font:400 10px Prompt,sans-serif;color:#8a5a36}
#mkxpop .inf{font:400 12px/1.7 Prompt,sans-serif;color:#4a2a16;text-align:left;margin:6px 0}#mkxpop .inf b{font-weight:600}
#mkxpop .acts{display:flex;gap:8px;justify-content:center;margin-top:9px}
@media (max-width:700px){#mkx .mkgrid{grid-template-columns:1fr}#mkx .cats{flex-direction:row;flex-wrap:wrap}#mkx .cats button{padding:4px 7px;font-size:11px}
  #mkx .row{grid-template-columns:42px 1fr 78px 58px}#mkx .row>.stc{display:none}#mkx .sellgrid,#mkx .two{grid-template-columns:1fr}#mkx .tbl{max-height:44vh}}
@media (max-height:500px){#mkx .foot{display:none}#mkx .tbl{max-height:calc(100vh - 226px)}#mkx .scr{max-height:calc(100vh - 176px)}#mkx .bag{max-height:calc(100vh - 250px)}#mkx .sellgrid>.ttp{max-height:calc(100vh - 176px);overflow:auto;box-sizing:border-box}
  #mkx .tbar{margin-top:5px;padding:3px 8px}#mkx .sum{margin:4px 0;padding:4px 8px;line-height:1.55}#mkx .tttab{margin-bottom:6px}#mkx .tttab button{padding:5px 4px}}`;
document.head.appendChild(css);

const CATS=[['all','ทั้งหมด','🗂'],['round','รอบจอง','⏳'],['mat','วัตถุดิบ','🌿'],['ore','หินตีบวก','⛏'],['orb','หินออฟ','💎'],['use','ยา/อาหาร','🧪'],['tool','ของใช้/ผลึก','🧰'],['gem','เจม/โทเท็ม','🔮'],['rune','รูน','🔱'],['pet','สัตว์เลี้ยง','🐾']];
const GEMK={tstone:1,tfrag:1,tess:1,gmut:1,gsup:1,bpart:1,rsap:1,rmedal:1,rgem:1},RUNK={rstone:1,rbag:1,sdust:1,srune:1,crune:1},PETK={pegg:1,pcharm:1,pfluff:1,ptreat:1},catOf=id=>defs[id].kind==='crystal'?'tool':GEMK[defs[id].kind]?'gem':RUNK[defs[id].kind]?'rune':PETK[defs[id].kind]?'pet':defs[id].kind,IDS=Object.keys(defs);
let tab='buy',cat='all',reg='',qy='',sort='def',pick=null,qty=1,popId=null,popN=1,lastRev=-1,lastDraw=0;
const win=()=>document.getElementById('mkx'),isOpen=()=>{const w=win();return !!(w&&w.classList.contains('open'));};
const badge=v=>v.mode==='round'?`<span class="bd r">⏳ <span data-cd="${v.rd.e}">${cd(v.rd.e-now())}</span> · จอง ${v.rd.n} คน</span>`:v.mode==='normal'?`<span class="bd n">มีของ ×${fmt(v.stock)}</span>`:`<span class="bd e">ขาดตลาด${v.w>=1?' · รอ '+v.w+' คน':''}</span>`;
function spark(h,cur,w,ht){const a=h.concat([cur]);if(a.length<2)return '';const lo=Math.min(...a),hi=Math.max(...a),r=hi-lo||1;
  const pts=a.map((v,i)=>`${(i/(a.length-1)*(w-6)+3).toFixed(1)},${(ht-4-(v-lo)/r*(ht-8)).toFixed(1)}`).join(' ');
  return `<svg width="${w}" height="${ht}" viewBox="0 0 ${w} ${ht}"><rect x=".5" y=".5" width="${w-1}" height="${ht-1}" rx="6" fill="#fff" stroke="#e3c79a"/><polyline points="${pts}" fill="none" stroke="${a[a.length-1]>=a[0]?'#1f8a34':'#cc3a2a'}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>
    <div>${Math.round((a.length-1)*K.HIST_H/24)||1} วัน · ต่ำสุด ${fmt(lo)}z · สูงสุด ${fmt(hi)}z</div>`;}
const lrText=l=>l?`รอบล่าสุด ${hhmm(l.t)}: ${l.n?`${l.n} คนจอง ${l.Q} ชิ้น`:'ไม่มีคนจอง'} · ของ ${l.U} ชิ้น → ราคา ${l.ch>0?'+':''}${Math.round(l.ch*1000)/10}%`:'';

function open(){if(typeof curMap!=='undefined'&&curMap!=='capT'&&!TEST()){say('ตลาดกลางมีแค่ในเมืองหลวง');return;}
  U.ttWin('mkx','⚖ ตลาดกลาง · เมืองหลวง');const w=win();w.classList.add('open');document.querySelectorAll('.ttw').forEach(o=>{if(o!==w)o.style.zIndex=58;});w.style.zIndex=59;popId=null;step();build();}
function build(){const w=win();if(!w||!w.classList.contains('open'))return;const b=w.querySelector('.ttbd'),old=b.querySelector('.tbl'),sc=old?old.scrollTop:0,P=me();
  const boxN=(P.box.z?1:0)+Object.keys(P.box.it).length,rounds=IDS.filter(id=>W.it[id]&&W.it[id].rd).length;
  const tabs=`<div class="tttab">${[['buy','🛒 ซื้อ'],['sell','📦 ลงขาย'],['mine','🎒 ของฉัน'+(boxN?`<i class="nb">${boxN}</i>`:'')],['board','📈 กระดานราคา']].map(([k,t])=>`<button data-mt="${k}" class="${tab===k?'on':''}">${t}</button>`).join('')}<button class="gear" data-gear="1">⚔ อุปกรณ์</button></div>`;
  let body='';
  if(tab==='buy'){let L=IDS.filter(id=>(cat==='all'||(cat==='round'?W.it[id]&&W.it[id].rd:catOf(id)===cat))&&(cat!=='mat'||!reg||defs[id].reg===reg)&&(!qy||nm(id).toLowerCase().includes(qy.toLowerCase()))).map(id=>M.view(id,HERO));
    const ord={round:0,empty:1,normal:2};if(sort==='round')L.sort((a,b)=>ord[a.mode]-ord[b.mode]);else if(sort==='up')L.sort((a,b)=>b.ch24-a.ch24);else if(sort==='down')L.sort((a,b)=>a.ch24-b.ch24);else if(sort==='high')L.sort((a,b)=>b.price-a.price);
    const chips=cat==='mat'?`<div class="chips"><button data-reg="" class="${reg?'':'on'}">ทุกเมือง</button>${Object.keys(A.TOWNS).map(r=>`<button data-reg="${r}" class="${reg===r?'on':''}">${A.TOWNS[r].name}</button>`).join('')}</div>`:'';
    body=`<div class="mkgrid"><div class="cats">${CATS.map(([k,n,ic])=>`<button data-cat="${k}" class="${cat===k?'on':''}">${ic} ${n}${k==='round'?` (${rounds})`:''}</button>`).join('')}</div>
      <div><div class="mkbar"><input class="ttin" id="mkq" placeholder="🔍 ค้นหาชื่อสินค้า" value="${qy.replace(/"/g,'')}" style="flex:1;min-width:0"><select class="ttin" id="mks">${[['def','เรียงตามชนิด'],['round','รอบจองก่อน'],['up','ขึ้นแรงสุด 24 ชม.'],['down','ลงแรงสุด 24 ชม.'],['high','ราคาสูง→ต่ำ']].map(([k,t])=>`<option value="${k}" ${sort===k?'selected':''}>${t}</option>`).join('')}</select>
        <span class="zz">💰 ${fmt(A.zeny)}z</span></div>${chips}
      <div class="tbl"><div class="row h"><span></span><span>สินค้า</span><span style="text-align:right">ราคากลาง</span><span class="stc">สถานะ</span><span></span></div>
      ${L.length?L.map(v=>`<div class="row" data-it="${v.id}"><div class="tts" style="cursor:pointer">${ico(v.id,28)}</div><div class="nm"><b>${nm(v.id)}</b><small>${(ETC[v.id].d||ETC[v.id].n||'').slice(0,54)}</small></div>
          <div class="pr">${fmt(v.price)}z<small>${pct(v.ch24)}</small></div><div class="stc">${badge(v)}</div>
          <button class="ttb sm ${v.mode==='empty'?'blue':''}">${v.mode==='round'?(v.rd.mine?'จองแล้ว':'จอง'):v.mode==='normal'?'ซื้อ':(v.bell?'🔔 รออยู่':'🔔')}</button></div>`).join(''):`<div class="ttnote" style="padding:14px;text-align:center">${cat==='round'?'ตอนนี้ไม่มีรอบจองที่เปิดอยู่':'ไม่พบสินค้า'}</div>`}</div></div></div>`;}
  else if(tab==='sell'){const all=Object.keys(BAG).filter(k=>defs[k]&&BAG[k]>0);if(pick&&!all.includes(pick))pick=null;
    let frm='<div class="ttnote" style="padding:22px 6px;text-align:center">เลือกของจากกระเป๋าทางซ้าย<br>ระบบตั้งราคาให้ คุณเลือกแค่จำนวน</div>';
    if(pick){const v=M.view(pick,HERO),have=BAG[pick]||0;qty=Math.max(1,Math.min(have,qty));const tot=qty*v.price,fee=M.fee(pick,qty),get=Math.floor(tot*(1-K.TAX)),act=P.ls.filter(l=>l.n>0).length;
      const st=v.lock?`<span class="dn">เพิ่งได้ของชนิดนี้จากรอบจอง — ลงขายต่อได้ในอีก <span data-cd="${v.lock}">${cd(v.lock-now())}</span></span>`
        :v.mode==='empty'?`<b>ของชนิดนี้ขาดตลาด</b> → ลงแล้วเปิด<b>รอบจอง 60 นาที</b> ราคารอบล็อกที่ ${fmt(v.price)}z${v.w>=1?` · มีคนรออยู่ราว ${v.w} คน`:''}`
        :v.mode==='round'?(v.rd.mine?'<span class="dn">คุณจองของในรอบนี้อยู่ จึงลงขายในรอบเดียวกันไม่ได้</span>':`มี<b>รอบจอง</b>เปิดอยู่ (เหลือ <span data-cd="${v.rd.e}">${cd(v.rd.e-now())}</span> · จอง ${v.rd.n} คน) → ของคุณเข้ารอบนี้ที่ราคา ${fmt(v.rd.P)}z`)
        :`มีของรอขายอยู่ก่อน <b>${fmt(v.stock)}</b> ชิ้น → ของคุณต่อคิวท้าย ได้เงินตามราคากลางตอนที่ขายออก`;
      frm=`<div style="display:flex;gap:8px;align-items:center"><div class="tts sel" style="cursor:default">${ico(pick,30)}</div><div class="nm"><b style="font-size:13.5px">${nm(pick)}</b><div class="ttnote">มี ${fmt(have)} · ราคากลาง <b>${fmt(v.price)}z</b> ${pct(v.ch24)}</div></div></div>
        <div class="frm"><label>จำนวน <span class="q"><button class="ttb blue sm" data-qd="-10">−10</button><button class="ttb blue sm" data-qd="-1">−</button><input class="ttin" id="mkqty" value="${qty}"><button class="ttb blue sm" data-qd="1">+</button><button class="ttb blue sm" data-qd="max">หมด</button></span></label></div>
        <div class="sum">${st}</div>
        <div class="sum">ราคารวม <b>${fmt(tot)}z</b><br>ค่าวางขาย 1% (จ่ายตอนลง ไม่คืน) <b class="dn">−${fmt(fee)}z</b><br>ภาษีขาย 5% (หักตอนขายได้) <b class="dn">−${fmt(tot-get)}z</b><br>ถ้าขายหมดที่ราคานี้ ได้รับ <b style="color:#9a5a08">${fmt(get)}z</b></div>
        <button class="ttb" id="mklist" style="width:100%" ${act>=K.SLOTS||v.lock||(v.rd&&v.rd.mine)||A.zeny<fee?'disabled':''}>📦 ลงขาย (${act}/${K.SLOTS} รายการ)</button>`;}
    body=`<div class="sellgrid"><div class="ttp"><h4>🎒 กระเป๋า — ของที่ลงขายในตลาดกลางได้</h4><div class="bag">${all.map(k=>`<div class="tts ${pick===k?'sel':''}" data-pk="${k}" title="${nm(k)}">${ico(k,28)}<em>${BAG[k]}</em></div>`).join('')||'<div class="ttnote" style="grid-column:1/-1">ไม่มีของที่ขายได้</div>'}</div>
      <div class="ttnote" style="margin-top:6px">อุปกรณ์ขายที่ปุ่ม "⚔ อุปกรณ์" (ยังเป็นแบบตั้งราคาเอง)</div></div><div class="ttp">${frm}</div></div>`;}
  else if(tab==='mine'){const act=P.ls,rs=Object.keys(P.rs),its=Object.keys(P.box.it);
    body=`<div class="scr"><div class="cash">📬 กล่องรับของ <span style="font:600 16px Prompt,sans-serif;color:#9a5a08">${fmt(P.box.z)}z</span><span class="its">${its.map(id=>`<div class="tts" title="${nm(id)}">${ico(id,24)}<em>${P.box.it[id]}</em></div>`).join('')}</span>
        <button class="ttb sm" id="mkclaim" ${P.box.z||its.length?'':'disabled'} style="margin-left:auto">รับทั้งหมด</button></div>
      <div class="two"><div class="ttp"><h4>📦 ของที่ลงขาย (${act.filter(l=>l.n>0).length}/${K.SLOTS})</h4>${act.length?act.map(l=>{const v=M.view(l.id,HERO),key=HERO+'#'+l.u,I=W.it[l.id];let ahead=0;if(!l.rd&&I)for(const g of I.q){if(g[1]===key)break;ahead+=g[0];}
          const stt=l.n<=0?(l.x?'<span class="fl">ครบ 48 ชม. คืนของแล้ว</span>':'<span class="up">ขายหมดแล้ว ✔</span>'):l.rd?`<span class="bd r">⏳ รอบจอง <span data-cd="${v.rd?v.rd.e:0}">${v.rd?cd(v.rd.e-now()):''}</span></span>`:`คิวก่อนหน้า ${fmt(ahead)} ชิ้น`;
          return `<div class="li" data-it="${l.id}"><div class="tts">${ico(l.id,20)}</div><b>${nm(l.id)}</b><span>เหลือ ${l.n}/${l.n0} · ${stt}${l.gain?` · <span class="up">+${fmt(l.gain)}z</span>`:''}</span>${l.n>0&&!l.rd?`<button class="ttb blue sm" data-wd="${l.u}">ถอน</button>`:''}</div>`;}).join(''):'<div class="ttnote">ยังไม่ได้ลงขายอะไร</div>'}</div>
      <div class="ttp"><h4>⏳ การจองที่รอผล (${rs.length}/${K.RES_MAX})</h4>${rs.length?rs.map(id=>{const r=P.rs[id],v=M.view(id,HERO),late=now()>=r.e-K.NOCANCEL;
          return `<div class="li" data-it="${id}"><div class="tts">${ico(id,20)}</div><b>${nm(id)}</b><span>×${r.q} · พัก ${fmt(r.hold)}z · <span data-cd="${r.e}">${cd(r.e-now())}</span>${v.rd?` · ${v.rd.n} คน/${v.rd.U} ชิ้น`:''}</span><button class="ttb blue sm" data-cx="${id}" ${late?'disabled':''}>ยกเลิก</button></div>`;}).join(''):'<div class="ttnote">ไม่มีการจองค้างอยู่</div>'}</div></div>
      <div class="ttp" style="margin-top:8px"><h4>📜 ประวัติ</h4><div class="log">${P.log.length?P.log.map(s=>`<div>${s}</div>`).join(''):'ยังไม่มีรายการ'}</div></div></div>`;}
  else{const V=IDS.map(id=>M.view(id,HERO)),li=(v,t)=>`<div class="li" data-it="${v.id}"><div class="tts">${ico(v.id,20)}</div><b>${nm(v.id)}</b><span>${t}</span></div>`,nw=newsText();
    const up=V.filter(v=>v.ch24>.001).sort((a,b)=>b.ch24-a.ch24).slice(0,5),dn=V.filter(v=>v.ch24<-.001).sort((a,b)=>a.ch24-b.ch24).slice(0,5),rd=V.filter(v=>v.rd).sort((a,b)=>a.rd.e-b.rd.e).slice(0,6),wt=V.filter(v=>v.mode==='empty').sort((a,b)=>b.w-a.w).slice(0,6);
    body=`<div class="scr">${nw?`<div class="news">📰 ข่าวตลาด: ${nw} <span class="fl" style="font-weight:400">(อีก <span data-cd="${W.news.u}">${cd(W.news.u-now())}</span>)</span></div>`:''}
      <div class="two"><div class="ttp"><h4>▲ ขึ้นแรงสุดใน 24 ชม.</h4>${up.map(v=>li(v,`${fmt(v.price)}z ${pct(v.ch24)}`)).join('')||'<div class="ttnote">—</div>'}</div>
      <div class="ttp"><h4>▼ ลงแรงสุดใน 24 ชม.</h4>${dn.map(v=>li(v,`${fmt(v.price)}z ${pct(v.ch24)}`)).join('')||'<div class="ttnote">—</div>'}</div>
      <div class="ttp"><h4>⏳ รอบจองที่เปิดอยู่ (${V.filter(v=>v.rd).length})</h4>${rd.map(v=>li(v,`${fmt(v.rd.P)}z · ${v.rd.n} คน/${v.rd.U} ชิ้น · <span data-cd="${v.rd.e}">${cd(v.rd.e-now())}</span>`)).join('')||'<div class="ttnote">ตอนนี้ไม่มี</div>'}</div>
      <div class="ttp"><h4>🔔 ขาดตลาด — ลงขายตอนนี้ได้เปิดรอบจอง</h4>${wt.map(v=>li(v,`${fmt(v.price)}z${v.w>=1?' · รอ '+v.w+' คน':''}`)).join('')||'<div class="ttnote">ตอนนี้ของมีครบ</div>'}</div></div></div>`;}
  const tbar=TEST()?`<div class="tbar">🧪 โหมดทดสอบ — เร่งเวลาตลาด: <button class="ttb blue sm" data-sk="${10*MIN}">+10 นาที</button><button class="ttb blue sm" data-sk="${HR}">+1 ชม.</button><button class="ttb blue sm" data-sk="${24*HR}">+1 วัน</button><span class="fl">รอบจองยาว 60 นาที · เวลาตลาด ${hhmm(now())}</span></div>`:'';
  b.innerHTML=tabs+body+tbar+`<div class="foot">ราคากลางขยับเองตามคนซื้อคนขาย · ผู้เล่นคนอื่นเป็นผู้เล่นจำลอง (เกมออฟไลน์) ตลาดเดินต่อแม้ปิดเกม · ค่าวางขาย 1% + ภาษีขาย 5%</div>`;
  const nt=b.querySelector('.tbl');if(nt)nt.scrollTop=sc;lastRev=M.rev;lastDraw=Date.now();
  const q=(s,f)=>b.querySelectorAll(s).forEach(f);
  q('[data-mt]',e=>e.onclick=()=>{tab=e.dataset.mt;build();});q('[data-gear]',e=>e.onclick=()=>A.openGearMarket&&A.openGearMarket());
  q('[data-cat]',e=>e.onclick=()=>{cat=e.dataset.cat;build();});q('[data-reg]',e=>e.onclick=()=>{reg=e.dataset.reg;build();});
  const qi=b.querySelector('#mkq');if(qi){qi.oninput=()=>{qy=qi.value;const pos=qi.selectionStart;build();const n=b.querySelector('#mkq');n.focus();n.setSelectionRange(pos,pos);};qi.onkeydown=e=>e.stopPropagation();}
  const so=b.querySelector('#mks');if(so)so.onchange=()=>{sort=so.value;build();};
  q('[data-it]',e=>e.onclick=ev=>{if(ev.target.closest('[data-wd],[data-cx]'))return;popId=e.dataset.it;popN=1;drawPop();});
  q('[data-pk]',e=>e.onclick=()=>{pick=e.dataset.pk;qty=BAG[pick]||1;build();});
  q('[data-qd]',e=>e.onclick=()=>{const have=BAG[pick]||0,d=e.dataset.qd;qty=d==='max'?have:Math.max(1,Math.min(have,qty+(+d)));build();});
  const qt=b.querySelector('#mkqty');if(qt){qt.onkeydown=e=>e.stopPropagation();qt.onchange=()=>{qty=Math.max(1,parseInt(qt.value)||1);build();};}
  const ls=b.querySelector('#mklist');if(ls)ls.onclick=()=>{if(doList(pick,qty)){tab='mine';}build();};
  const cl=b.querySelector('#mkclaim');if(cl)cl.onclick=()=>{doClaim();build();};
  q('[data-wd]',e=>e.onclick=()=>{doWithdraw(+e.dataset.wd);build();});q('[data-cx]',e=>e.onclick=()=>{doCancel(e.dataset.cx);build();});
  q('[data-sk]',e=>e.onclick=()=>{W.skew=(W.skew||0)+(+e.dataset.sk);step();save();build();});
  if(popId)drawPop();else{const p=w.querySelector('#mkxpop');if(p)p.style.display='none';}}

/* one item: price, 7-day line, and what you can do with it right now */
function drawPop(){const w=win();if(!w||!popId)return;let p=w.querySelector('#mkxpop');if(!p){p=document.createElement('div');p.id='mkxpop';w.appendChild(p);}const id=popId,v=M.view(id,HERO),E=ETC[id],P=me();let st='',acts='<button class="ttb blue" data-px="1">ปิด</button>';
  const qrow=(max)=>`<div class="q" style="justify-content:center;margin:8px 0"><button class="ttb blue sm" data-pn="-10">−10</button><button class="ttb blue sm" data-pn="-1">−</button><input class="ttin" id="mkpn" value="${popN}"><button class="ttb blue sm" data-pn="1">+</button><button class="ttb blue sm" data-pn="max">สูงสุด</button></div>`;
  let max=1;
  if(v.mode==='normal'){const av=v.stock-v.own;max=Math.max(1,Math.min(av,Math.floor(A.zeny/v.price)||1));popN=Math.max(1,Math.min(Math.max(1,av),popN));const cost=popN*v.price;
    st=`<div class="inf"><span class="bd n">มีของ ×${fmt(v.stock)}</span>${v.own?` <span class="fl">(ของคุณเอง ${v.own} ชิ้น ซื้อไม่ได้)</span>`:''}</div>${av>0?qrow()+`<div class="sum">รวม <b style="color:${A.zeny>=cost?'#9a5a08':'#cc3a2a'}">${fmt(cost)}z</b> <span class="fl">(มี ${fmt(A.zeny)}z)</span>${popN>=av?'<br><span class="fl">ซื้อจนหมด ราคากลางจะขึ้น 5%</span>':''}</div>`:''}`;
    if(av>0)acts+=`<button class="ttb" data-do="buy" ${A.zeny>=cost?'':'disabled'}>ซื้อเลย</button>`;}
  else if(v.mode==='round'){const R=v.rd,left=R.e-now(),r=P.rs[id];max=Math.max(1,Math.min(R.U,Math.floor(A.zeny/R.P)||1));popN=Math.max(1,Math.min(R.U,popN));
    st=`<div class="inf"><span class="bd r">⏳ รอบจองเหลือ <span data-cd="${R.e}">${cd(left)}</span></span><br>ของในรอบ <b>${R.U}</b> ชิ้น · จองแล้ว <b>${R.n}</b> คน (${R.Q} ชิ้น) · ราคารอบ <b>${fmt(R.P)}z</b> (ล็อก)</div>`;
    if(R.seller)st+=`<div class="sum">คุณมีของ ${R.seller} ชิ้นในรอบนี้ จึงจองไม่ได้</div>`;
    else if(r){st+=`<div class="sum">คุณจองไว้ <b>${r.q}</b> ชิ้น · พักเงิน <b>${fmt(r.hold)}z</b><br><span class="fl">ไม่ได้ของ ได้เงินคืนเต็ม · ได้ของแล้วรับที่แท็บ "ของฉัน"</span></div>`;acts+=`<button class="ttb blue" data-do="cancel" ${left<=K.NOCANCEL?'disabled':''}>${left<=K.NOCANCEL?'ยกเลิกไม่ได้แล้ว (5 นาทีสุดท้าย)':'ยกเลิกการจอง'}</button>`;}
    else{const hold=popN*R.P,odds=R.Q+popN<=R.U?100:Math.min(100,Math.round(100*R.U/(R.n+1)));
      st+=qrow()+`<div class="sum">พักเงิน <b style="color:${A.zeny>=hold?'#9a5a08':'#cc3a2a'}">${fmt(hold)}z</b> <span class="fl">(มี ${fmt(A.zeny)}z)</span><br>โอกาสได้อย่างน้อย 1 ชิ้น ≈ <b>${odds}%</b> <span class="fl">(ถ้าไม่มีคนจองเพิ่ม)</span><br><span class="fl">ของไม่พอ = สุ่มคนที่ได้ · ไม่ได้ของ ได้เงินคืนเต็ม</span></div>`;
      acts+=`<button class="ttb" data-do="reserve" ${A.zeny>=hold&&Object.keys(P.rs).length<K.RES_MAX?'':'disabled'}>จอง (พักเงิน ${fmt(hold)}z)</button>`;}}
  else{st=`<div class="inf"><span class="bd e">ขาดตลาด</span> ยังไม่มีคนลงขาย${v.w>=1?` · มีคนรออยู่ราว <b>${v.w}</b> คน`:''}</div><div class="sum">${(BAG[id]||0)>0?`คุณมี ${BAG[id]} ชิ้น — ลงขายตอนนี้จะเปิด<b>รอบจอง 60 นาที</b>`:'เมื่อมีคนลงขาย ระบบจะเปิดรอบจอง 60 นาที ให้กดจอง'}</div>`;
    acts+=`<button class="ttb" data-do="bell">${v.bell?'🔕 เลิกแจ้งเตือน':'🔔 แจ้งเตือนเมื่อมีของ'}</button>`+((BAG[id]||0)>0?`<button class="ttb" data-do="gosell">📦 ไปลงขาย</button>`:'');}
  p.innerHTML=`<div class="pc"><button class="px" data-px="1">✕</button><div class="ph"><div class="tts sel" style="cursor:default">${ico(id,30)}</div><div><b>${nm(id)}</b><div class="ttnote">${E.d||E.n||''}</div></div></div>
    <div class="big"><b>${fmt(v.price)}z<small>${pct(v.ch24)} <span class="fl">ใน 24 ชม.</span></small></b><div class="gr">${spark(v.hist,v.price,150,46)}</div></div>
    ${st}${v.lr?`<div class="ttnote" style="text-align:left">${lrText(v.lr)}</div>`:''}${v.cap?'<div class="ttnote" style="text-align:left">ร้าน NPC มีขาย — ราคากลางไม่เกินราคาร้าน</div>':''}<div class="acts">${acts}</div></div>`;
  p.style.display='flex';p.onclick=e=>{if(e.target===p){popId=null;p.style.display='none';}};
  p.querySelectorAll('[data-px]').forEach(e=>e.onclick=()=>{popId=null;p.style.display='none';});
  p.querySelectorAll('[data-pn]').forEach(e=>e.onclick=()=>{const d=e.dataset.pn;popN=d==='max'?max:Math.max(1,popN+(+d));drawPop();});
  const pi=p.querySelector('#mkpn');if(pi){pi.onkeydown=e=>e.stopPropagation();pi.onchange=()=>{popN=Math.max(1,parseInt(pi.value)||1);drawPop();};}
  p.querySelectorAll('[data-do]').forEach(e=>e.onclick=()=>{const d=e.dataset.do;if(d==='buy'){doBuy(id,popN);popId=null;}else if(d==='reserve')doReserve(id,popN);else if(d==='cancel')doCancel(id);
    else if(d==='bell'){M.bell(HERO,id,!v.bell);save();}else if(d==='gosell'){popId=null;tab='sell';pick=id;qty=BAG[id]||1;}build();});}

/* clock: the market always runs; the window refreshes its countdowns every second and its rows when something changed */
setInterval(()=>{const o=isOpen();if(!o&&Date.now()%15000>1000)return;const ch=step();if(!o)return;const w=win();
  w.querySelectorAll('[data-cd]').forEach(e=>{e.textContent=cd(+e.dataset.cd-now());});const typing=w.contains(document.activeElement)&&/INPUT|SELECT/.test(document.activeElement.tagName);
  if(!typing&&(ch||M.rev!==lastRev||Date.now()-lastDraw>12000)){if(popId&&!ch&&M.rev===lastRev)return;build();}},1000);
setInterval(save,60000);addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
setTimeout(()=>{step();save();},2600);
try{if(new URLSearchParams(location.search).get('market')){let n=0;const iv=setInterval(()=>{if(++n>90)return clearInterval(iv);if(window.AFProgress&&AFProgress.mode&&typeof player!=='undefined'&&(TEST()||curMap==='capT')){clearInterval(iv);open();}},1000);}}catch(e){}
window.MKT={open,build,M,defs,world:()=>W,save,now,step,skip:ms=>{W.skew=(W.skew||0)+ms;step();save();build();},reset(){localStorage.removeItem(WKEY);location.reload();}};
})();
