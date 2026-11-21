/* =====================================================================
   TOTEM GEMS — constellation board (owner 2026-11-19 · design: TOTEM_GEM_SYSTEM_TH.md)
   Wolf board art: assets/gems/board/ (frame · sky · sock_main / sock_mut / sock_sup), painted by the owner.
   • 5 main sockets on the stars of the hero's spirit constellation, open at Lv 60/70/80/90/99 (the path of stars
     lights up as they open). Gem tier 1/2/3/4 needs Lv 60/70/80/90.
   • Each main gem has 1 mutation socket (opens with the gem) + 2 support sockets (open at gem level 3 / 5).
   • A thin rune ring between sky and frame turns slowly, and spins up + glows when a gem is set.
   • Skill stars (owner 2026-11-21 'เอาข้อ2', GAME_PILLARS_TH.md): an inner ring of 5 silver stars that open at Lv 10/20/30/40/50.
     Each holds one learned active Basic / A / B skill + one MUTATION gem (no supports, no gem level → power only moves by the
     mutation's own trade-off). The path runs Lv 10 → 50 round the inner ring, then out to the first C star (Lv 60).
     Every opened skill star gives one free mutation gem of the player's choice (D.gift counts the gifts taken).
   • Totem pages (owner 2026-11-21 'โอเค', TOTEM_GEM_SYSTEM_TH.md §1f): 3 named layouts of the whole totem (C gems + their wing gems,
     skill holes + their gold / teal gems). Free switch: in a town any time, outside only after 5 s without fighting (test mode any time).
     Switching takes every mutation / support gem off into the bag and sockets the page's gems back from it; what the bag lacks stays empty.
   • Resonance / balance (same day): 2 working mutation gems of one kind = its gain one step stronger; ≥ 5 kinds, none twice = every
     mutation's cost one step softer (gem_data.js RESO texts, RV numbers below).
   Save: localStorage 'af_gems_<hero>[_play]' = {v:4, own:{key:{lv,q,lines,dup}}, sock:[key|null ×5], mods:{key:[mut,sup,sup,mut2]},
         ss:[skill key|null ×5], sm:[mutation id|null ×5], ssu:[[sup,sup] ×5], gift:n, pity:n, pe:n, tg:0|1, sx:{skill gems}, cv:{carved holes},
         pg:{c:active page, n:[3 names], L:[layout|null ×3]}} — the active page's layout is the live sock / mods / ss / sm / ssu (L[c] is not read)
   ===================================================================== */
(function(){
const AF=()=>window.AFItems||null;
/* CHAR is a script-level const in index.html (not on window): read it by indirect eval. Before 2026-11-21 this read window.CHAR,
   so EVERY hero saved into the wolf's key and looked for the wolf's pictures (non-wolf boards showed empty / foreign gems). */
const HERO=(()=>{try{const c=(0,eval)('CHAR');if(c)return c;}catch(e){}return window.CHAR||'wolf';})();
/* the totem page's hole table (page v3, see 'your totem pole' below) — here because the number of skill stars = the holes on its stone base */
const TOT=window.__TOT||{"pole":{"src":"totem","W":1024,"H":1536,"top":16,"foot":1500,"cx":511.7,"cut":[1140,885,625,362],"tiers":[{"m":[511.8,1327.1,69.2],"h":[[304.5,1312.2,32.4],[214.3,1312.0,32.4],[808.9,1312.0,32.3],[718.8,1312.1,32.4]]},{"m":[511.8,1075.0,64.4],"h":[[310.9,1053.3,31.7],[221.0,1053.3,31.6],[801.7,1053.3,31.7],[711.7,1053.3,31.7]]},{"m":[511.9,827.1,68.5],"h":[[310.8,808.2,32.4],[219.6,808.1,32.1],[802.5,808.1,32.0],[711.9,808.3,32.3]]},{"m":[511.4,539.6,67.9],"h":[[310.0,528.1,34.5],[215.7,528.1,34.5],[807.4,528.0,34.3],[713.9,528.2,34.6]]},{"m":[511.5,252.1,73.5],"h":[[315.6,239.4,35.1],[216.9,239.3,35.2],[806.6,239.4,35.1],[707.7,239.4,35.1]]}]},"base":{"src":"base","W":1536,"H":1024,"top":107,"bot":964,"cx":767.0,"stand":[766.0,339.0],"s":[[262.9,630.5,80.2],[515.4,680.8,79.9],[767.3,699.6,80.0],[1020.3,680.9,80.0],[1270.7,630.8,80.0]],"t":[[262.8,764.2,22.9],[515.5,816.0,22.9],[768.1,833.9,23.1],[1021.4,816.2,23.0],[1275.3,764.4,22.8]],"u":[[[197.0,745.1,21.0],[329.0,746.9,21.2]],[[450.6,796.4,21.3],[580.5,797.3,21.3]],[[702.5,816.6,21.6],[834.1,816.5,21.5]],[[955.6,798.0,21.5],[1086.2,796.4,21.5]],[[1209.8,747.3,21.2],[1340.4,744.0,21.3]]]}};   /* owner's pictures 2026-11-21: totem.webp + base.webp; base v2 = 5 skill holes × (gold mutation + 2 teal supports); foot contact 1500, stand = centre of the gold ring on the base (766, 339), cuts at the carved bands */
const SUF=AF()&&AF().MODE==='play'?'_play':'',SKEY='af_gems_'+HERO+SUF,LEGACY='af_gems_wolf'+SUF,NS=5,SOCK_LV=[60,70,80,90,99],TIER_LV=[0,60,70,80,90];
/* skill stars: as many as the base picture has holes (owner 2026-11-21: 7, one per slot of the skill wheel); unlock levels per count */
const NSS=TOT?TOT.base.s.length:5,SS_LV=({5:[10,20,30,40,50],7:[10,15,20,25,30,40,50]})[NSS]||Array.from({length:NSS},(_,i)=>Math.round(10+i*40/Math.max(1,NSS-1)));
const GEM_DIR='assets/gems/'+HERO+'/',BD='assets/gems/board/',PG='assets/gems/page/';
const PG_N=['ฟาร์ม','บอส','ปาร์ตี้'];   /* default names of the 3 totem pages (the player can rename them) */
/* page v2 art (owner's pictures 2026-11-21, assets/gems/page/): ring = inner circle fitted on ring.webp (1254 px, hanging feathers removed);
   the five C stars use one land socket each in unlock order (Norse Lv 60 · Greek 70 · Egypt 80 · Japan 90 · Aztec 99), [file, hole cx, cy, r] as
   fractions of the picture; the skill stars use the moonstone socket */
const RING={cx:616.8,cy:580.9,r:402.6,W:1254};
const LAND=[['land_norse',.4952,.4629,.2008],['land_greek',.4951,.4687,.2128],['land_egypt',.4951,.4568,.2088],['land_japan',.4961,.4550,.2167],['land_aztec',.4976,.4423,.1971]];
const SKS=['sock_skill',.4958,.5145,.2507];
const GD=window.GEMDATA;
const MUT=GD?GD.MUT:[ // mutation gems (gem_data.js; this copy is only a fallback): [id, name, symbol, colour, gain, cost]
 ['focus','รวมศูนย์','◎','#ffd23a','ศัตรูตัวแรกที่โดน ×1.6','ตัวอื่นที่โดน ×0.4'],
 ['spread','แผ่กว้าง','✺','#ff9a3a','ทุกตัวที่โดน แตกดาเมจ ×0.35 รัศมี 80','พลังหลัก ×0.75'],
 ['heavy','ทุ่มหนัก','⬇','#c9573a','พลัง ×1.5','คูลดาวน์ +4 วิ · SP +10'],
 ['rapid','รัวเร็ว','≫','#7fe08a','คูลดาวน์ ×0.6','พลัง ×0.65'],
 ['stack','สะสมแต้ม','⧉','#9fd8ff','เก็บได้ 2 ครั้ง','พลังครั้งละ ×0.8 · เติมคืนช้ากว่าเดิม'],
 ['fire','ธาตุไฟ','♨','#ff5a2a','ติดไหม้ต่อเนื่อง 4 วิ (สีไฟ)','ดาเมจทันที ×0.7'],
 ['ice','ธาตุน้ำแข็ง','❄','#8fe6ff','ทุกฮิตช้า −40 · ทุกครั้งที่ 4 แช่แข็ง 0.6 วิ','พลัง ×0.8'],
 ['volt','ธาตุสายฟ้า','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.4','พลัง ×0.8'],
 ['guard','ตั้งการ์ด','⛨','#c9ccd8','โล่ Lv×4 · รับดาเมจ −Lv×0.5 ต่อครั้ง 3 วิ','พลัง ×0.8'],
 ['rage','บ้าคลั่ง','✶','#e2435a','พลัง ×1.3','3 วิหลังใช้ รับดาเมจ +Lv×0.6 ต่อครั้ง'],
 ['siphon','ดูดพลัง','◆','#4aa8ff','ทุกฮิตคืน SP 2 (สูงสุด 12 ต่อการใช้)','พลัง ×0.85'],
 ['totem','เสาร่ายแทน','♆','#d9a441','ปักเสาร่ายสกิลทุก 2 วิ × 4 ครั้ง พลัง ×0.45','ระหว่างเสาอยู่ใช้สกิลนั้นเองไม่ได้']];
const SUP=GD?GD.SUP:[ // support gems: [id, name, symbol, colour, effect]
 ['echo','เงาสกิล','⟲','#9b7bff','0.5 วิหลังใช้ ออกซ้ำ ×0.35 (ท่าบัฟ: +3 วิ)'],['third','ทุกครั้งที่สาม','③','#ffb13b','ทุกครั้งที่ 3 แรง ×1.5 (ท่าบัฟ: รีเซ็ตคูลดาวน์)'],
 ['force','เพิ่มแรง','✚','#ff6a4a','ทุกฮิต +ATK×0.15 หรือ TAL×0.15 (ท่าบัฟ: +2 วิ)'],['splash','กระจาย','✺','#ff9a3a','ตัวที่โดนแตก ×0.3 รัศมี 70 (ท่าบัฟ: โล่ Lv×3)'],
 ['chain','ชิ่ง','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.3 (ท่าบัฟ: +2 วิ)'],['quick','เร่ง','⏱','#7fe08a','คูลดาวน์ −1.5 วิ'],
 ['thrift','ประหยัด','◆','#4aa8ff','SP −6'],['burn','เผาไหม้','♨','#ff5a2a','ทุกฮิตติดไฟ Lv×1/วิ 3 วิ (ท่าบัฟ: ไฟรอบตัว)'],
 ['frost','เยือกแข็ง','❄','#8fe6ff','ทุกครั้งที่ 3 ช้า −40 · ทุกครั้งที่ 6 แช่แข็ง 0.8 วิ'],['pierce','ทะลวง','➶','#d8d8e8','ไม่สน DEF 20 (ท่าบัฟ: +2 วิ)'],
 ['leech','ดูดชีวิต','♥','#e2435a','ทุกฮิตฟื้น Lv×1 สูงสุด 10 ฮิต (ท่าบัฟ: ฟื้น Lv×3)'],['impact','กระแทก','✸','#c9a46a','ทุกครั้งที่ 5 มึน 0.5 วิ + หลอด KO (ท่าบัฟ: ผลักรอบตัว)']];
const MUTD=Object.fromEntries(MUT.map(s=>[s[0],s])),SUPD=Object.fromEntries(SUP.map(s=>[s[0],s]));
const RESO=GD&&GD.RESO||{},BAL_N=GD&&GD.BAL_N||5;
/* resonance state of the totem, rebuilt by apply(): n = working mutation gems per kind, on = kinds that resonate (2), bal = balance */
let RES={n:{},on:new Set(),tot:0,kinds:0,bal:false};
const RS=id=>!window.__RESO_OFF&&RES.on.has(id),BAL=()=>!window.__RESO_OFF&&RES.bal;
/* the numbers behind RESO (gem_data.js): [normal, resonance (gain side) / balance (cost side)] */
const RV={focusF:[1.6,1.75],focusO:[.4,.55],spreadF:[.35,.45],spreadP:[.75,.82],heavyP:[1.5,1.65],heavyCd:[4,3],heavyMp:[10,7],
  rapidCd:[.6,.55],rapidP:[.65,.72],rapidB:[.6,.66],stackCh:[2,3],stackP:[.8,.85],stackR:[1.25,1.15],fireN:[4,5],fireP:[.7,.77],iceF:[.6,.8],iceP:[.8,.86],
  voltN:[2,3],voltP:[.8,.86],guardSh:[4,6],guardP:[.8,.86],rageP:[1.3,1.4],rageT:[.6,.4],siphonV:[2,3],siphonCap:[12,18],siphonP:[.85,.9],
  totemF:[.45,.55],totemK:[2.2,2.7],totemLock:[4,3]};
const rv=(k,up)=>RV[k][up?1:0];
/* a mutation's gain / cost text as it works right now (resonance / balance swap in the stronger line) */
const mutG=id=>RS(id)&&RESO[id]?RESO[id].g:MUTD[id][4],mutC=id=>BAL()&&RESO[id]?RESO[id].c:MUTD[id][5];
const mutTag=id=>RS(id)?' <b class="rsT" title="เรโซแนนซ์">🔗</b>':BAL()&&RES.n[id]?' <b class="blT" title="สมดุล">⚖</b>':'';
/* support strength: 1 per C-gem support, ½ per support in a skill hole (page v3, owner 2026-11-21: skill holes get 2 support sockets;
   half strength because they open from Lv 10 — the effect still shows on the skill, its numbers are halved) */
const sw=(A,id)=>(A.sup.includes(id)?1:0)+(A.supH?A.supH.filter(x=>x===id).length*.5:0);
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};   /* global lookup (indirect eval): this file has its own D / P / K */
/* the C node's column (Basic / A / B); heroes without s.col (cat, croc) list each tier's three C skills in that order */
const colName=k=>{const S=G('SKILLS')||{},s=S[k]||{};if(s.col)return s.col==='basic'?'Basic':s.col;const row=Object.keys(S).filter(q=>S[q].br==='C'&&S[q].tier===s.tier);return ['Basic','A','B'][row.indexOf(k)]||'-';};
const cKeys=()=>{const S=G('SKILLS')||{};return Object.keys(S).filter(k=>S[k].br==='C').sort((a,b)=>'basicAB'.indexOf(S[a].col)-'basicAB'.indexOf(S[b].col)||S[a].tier-S[b].tier);};
/* ---- gem farming v2 (owner 2026-11-21) ----
   own[k] = {lv 1…GEM_CAP, q 0 normal / 1 rare / 2 legend, lines [[id, rank 1–5, locked]], dup = spare copies}
   Mutation / support gems are bag goods (gmut_<id> / gsup_<id>, tradable in the central market): socketing takes one out
   of the bag, taking it out (or taking its main gem off the board) puts it back. */
const C=GD?GD.COST:{},QUAL=GD?GD.QUAL:[{n:'',c:'#ccc',g:'204,204,204',lines:1,p:1,m:1,rk:[1]}],CAP=GD?GD.GEM_CAP:5,BRK=GD?GD.BREAK:{};
/* rarity + special stats (owner 2026-11-21): QUAL = 5 rarities; a gem's lines fill nSlots(rarity, level) slots; a line's number = lineV(rank, rarity, level) */
const NSL=GD?GD.nSlots:()=>1,LVM=GD?GD.lvMul:()=>1,LV_V=GD?GD.lineV:r=>r,SLINE=GD?GD.SLINE:{},POOL=GD?GD.POOL:{c:[],s:[]},SLV=GD?GD.SLOT_LV:[],SGC=GD&&GD.SGEM,statN=GD?GD.statN:v=>Math.round(v);
const QN=QUAL.length-1,rnd=n=>Math.floor(Math.random()*n);
const HITL=new Set(['lpow','lfirst','lsts','lpier','lboss','lslow','ldur','lkill','lpush']);   /* line kinds a combo follow-up gets too (the cast side stays on its starter) */
const bagN=id=>{const a=AF();return a?(a.BAG[id]||0):0;},bagAdd=(id,n)=>{const a=AF();if(a)a.bagAdd(id,n);},bagSave=()=>{const a=AF();if(a)a.save();};
const zeny=()=>{const a=AF();return a?a.zeny:0;},payZ=z=>{const a=AF();if(!a||a.zeny<z)return false;a.zeny=a.zeny-z;return true;};
const fmtN=v=>{const a=AF();return a&&a.ui?a.ui.fmt(v):String(v);};
function rollRank(q){const P=QUAL[q||0].rk||[1];let x=Math.random();for(let i=0;i<P.length;i++){x-=P[i];if(x<0)return i+1;}return 1;}
/* fill the gem's special-stat slots (its rarity + level decide how many) with line kinds it does not have yet; kept (locked) lines stay */
function rollLines(q,lv,keep,pool){const ids=POOL[pool||'c']||[],out=(keep||[]).slice(),n=NSL(q||0,lv||1);
  while(out.length<n){const c=ids.filter(id=>!out.some(o=>o[0]===id));if(!c.length)break;out.push([c[rnd(c.length)],rollRank(q),0]);}
  return out;}
/* rarity roll: rollQfree = the plain odds (test grants, old saves); rollQ = a real roll (carve / craft / extract / re-extract) that counts
   toward the hero's two pity counters: 20 rolls without มหากาพย์ or better → มหากาพย์ · 50 without ตำนาน → ตำนาน */
function rollQfree(){let x=Math.random();for(let i=QN;i>=0;i--){x-=QUAL[i].p||0;if(x<0)return i;}return 0;}
function rollQ(){D.pity=(D.pity||0)+1;D.pe=(D.pe||0)+1;let q=rollQfree();
  if(D.pity>=(C.pity||50))q=QN;else if(D.pe>=(C.pityE||20)&&q<QN-1)q=QN-1;
  if(q>=QN-1)D.pe=0;if(q===QN)D.pity=0;return q;}
const lnTxt=(l,q,lv)=>{const d=(GD?GD.LND:{})[l[0]];if(!d)return l[0];const v=LV_V(l[1],q,lv);return d[2]==='สเตตัส'?`<b>${d[3](v)}</b>`:`<b>${d[1]}</b> ${d[3](v)}`;};
/* a non-wolf hero without its own save takes ITS gems out of the old shared save (only keys of its own skills) */
function adoptLegacy(){if(HERO==='wolf')return null;let L=null;try{L=JSON.parse(localStorage.getItem(LEGACY)||'null');}catch(e){}if(!L||(L.v!==2&&L.v!==3&&L.v!==4))return null;
  const S=G('SKILLS')||{},mine=k=>!!(k&&S[k]&&S[k].br==='C'),own={};for(const k in (L.own||{}))if(mine(k))own[k]=L.own[k];if(!Object.keys(own).length)return null;
  const mods={};for(const k in own)if(L.mods&&L.mods[k])mods[k]=L.mods[k].slice();
  return {v:L.v,own,sock:(L.sock||[]).map(k=>mine(k)?k:null),mods,mutOwn:{},supOwn:{},pity:L.pity||0,tg:0};}
function load(){let d=null,dirty=false;try{d=JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){}
  if(!d){d=adoptLegacy();if(d)dirty=true;}
  if(!d||(d.v!==2&&d.v!==3&&d.v!==4)){d={v:2,own:{},sock:Array(NS).fill(null),mods:{},mutOwn:{},supOwn:{}};
    const LV=G('LV')||{};for(const k of cKeys())if(LV[k]>0){d.own[k]={lv:1};const i=d.sock.indexOf(null);if(i>=0)d.sock[i]=k;}}   /* old C points → owned (+ socketed) gems */
  if(d.v===2){   /* v2 → v3: quality + lines for owned gems; mutation / support counts move into the bag (what is socketed stays socketed) */
    for(const k in d.own){const o=d.own[k];o.q=o.q||0;o.lines=o.lines||[];o.dup=o.dup||0;}   /* gems from before farming have empty line slots: 'สุ่มบรรทัด' fills them (keeps the bench unchanged) */
    const useN={};for(const k in d.mods)(d.mods[k]||[]).forEach((id,j)=>{if(id){const key=(j===0||j===3?'gmut_':'gsup_')+id;useN[key]=(useN[key]||0)+1;}});
    for(const [own,pre] of [[d.mutOwn||{},'gmut_'],[d.supOwn||{},'gsup_']])for(const id in own){const free=(own[id]||0)-(useN[pre+id]||0);if(free>0&&!G('testMode'))bagAdd(pre+id,free);}
    delete d.mutOwn;delete d.supOwn;d.v=3;d.pity=0;d.tg=0;bagSave();}
  if(d.v===3){/* v3 → v4 (owner 2026-11-21): 5 rarities — old quality 0 / 1 / 2 → ธรรมดา / หายาก / ตำนาน (same 1 / 2 / 3 lines); a gem that already
      rolled lines gets the special-stat slots its level opened; pity starts over (two counters now); skill gems ('1') roll when first looked at */
    for(const k in d.own){const o=d.own[k];o.q=[0,2,4][o.q||0]||0;if((o.lines||[]).length)o.lines=rollLines(o.q,o.lv,o.lines,'c');}
    d.pity=0;d.pe=0;d.v=4;dirty=true;}
  if(G('testMode')&&d.tg&&!cKeys().some(k=>d.own[k]))d.tg=0;   /* the test grant was spent on another hero in the old shared save */
  if(G('testMode')&&!d.tg){   /* test mode: every gem (Lv 5, rare) + goods to try carving / levelling / lines, once */
    for(const k of cKeys())if(!d.own[k]){const q=rollQfree();d.own[k]={lv:5,q,lines:rollLines(q,5,null,'c'),dup:2};}
    const give=[['tess',3000],['sore',60],['guard',20]];for(let t=1;t<=4;t++)give.push(['tstone'+t,30],['tfrag'+t,80]);for(const m of MUT)give.push(['gmut_'+m[0],2]);for(const m of SUP)give.push(['gsup_'+m[0],3]);
    for(const [id,c] of give)if(bagN(id)<c)bagAdd(id,c-bagN(id));bagSave();d.tg=1;dirty=true;}
  for(const k in d.mods){const a=d.mods[k];while(a.length<4)a.push(null);}
  if(!Array.isArray(d.ss))d.ss=Array(NSS).fill(null);if(!Array.isArray(d.sm))d.sm=Array(NSS).fill(null);d.gift=d.gift||0;   /* skill stars */
  while(d.ss.length<NSS)d.ss.push(null);while(d.sm.length<NSS)d.sm.push(null);
  if(!Array.isArray(d.ssu))d.ssu=[];while(d.ssu.length<NSS)d.ssu.push([null,null]);d.ssu=d.ssu.map(a=>Array.isArray(a)?a.slice(0,2).concat([null,null]).slice(0,2):[null,null]);   /* the skill holes' 2 support gems */
  if(d.ss.length>NSS||d.sm.length>NSS||d.ssu.length>NSS){for(let i=NSS;i<d.sm.length;i++)if(d.sm[i]){bagAdd('gmut_'+d.sm[i],1);bagSave();}
    for(let i=NSS;i<d.ssu.length;i++)for(const x of d.ssu[i]||[])if(x){bagAdd('gsup_'+x,1);bagSave();}d.ss.length=NSS;d.sm.length=NSS;d.ssu.length=NSS;dirty=true;}
  {/* drop keys of other heroes (left in the shared save): C sockets become empty, a foreign skill star gives its mutation back */
    const S=G('SKILLS')||{};d.sock=d.sock.map(k=>{if(k&&!(S[k]&&S[k].br==='C')){dirty=true;return null;}return k;});
    for(let i=0;i<NSS;i++)if(d.ss[i]&&!S[d.ss[i]]){d.ss[i]=null;if(d.sm[i]){bagAdd('gmut_'+d.sm[i],1);bagSave();d.sm[i]=null;}
      d.ssu[i]=d.ssu[i].map(x=>{if(x){bagAdd('gsup_'+x,1);bagSave();}return null;});dirty=true;}}
  if(!d.sx||typeof d.sx!=='object'){d.sx={};d.ss.forEach(k=>{if(k)d.sx[k]=1;});dirty=true;}   /* skill gems (extracted skills), owner 2026-11-21 */
  if(!d.cv||typeof d.cv!=='object'){/* carved holes (owner 2026-11-21: every hole is turned in to open, only skill hole 1 is free).
      A save from before keeps every hole that already holds something — nobody loses a socketed gem. */
    const cv=d.cv={};d.ss.forEach((k,i)=>{if(k||d.sm[i])cv['s'+i]=1;(d.ssu[i]||[]).forEach((x,j)=>{if(x){cv['s'+i]=1;cv['u'+i+j]=1;}});});
    d.sock.forEach((k,i)=>{if(!k)return;cv['p'+i]=1;(d.mods[k]||[]).forEach((x,j)=>{if(x&&(j===1||j===2))cv['q'+i+j]=1;});});dirty=true;}
  if(!d.pg||!Array.isArray(d.pg.L)){d.pg={c:0,n:PG_N.slice(),L:[null,null,null]};dirty=true;}   /* totem pages (2026-11-21): the board as it is = page 1 */
  else{const p=d.pg;while(p.L.length<3)p.L.push(null);p.L.length=3;p.n=[0,1,2].map(i=>String((p.n&&p.n[i])||PG_N[i]).slice(0,12));p.c=Math.max(0,Math.min(2,p.c|0));}
  if(dirty)try{localStorage.setItem(SKEY,JSON.stringify(d));}catch(e){}
  return d;}
let D=load();const save=()=>{try{localStorage.setItem(SKEY,JSON.stringify(D));}catch(e){}try{apply();}catch(e){}};
const lv=()=>(G('PS')||{}).lv||1,test=()=>!!G('testMode');
/* ---- carving (owner 2026-11-21: 'ส่งของปลดล็อคแต่ละช่อง แบบไม่ง่ายมาก แจกฟรีแค่ช่องสกิลแรก'): a hole is open when its level is
   reached AND it has been carved (goods turned in, gem_data.js CARVE). Test mode keeps every hole carved unless ?tgseal=1. ---- */
const CV=GD&&GD.CARVE,SEAL=/[?&]tgseal=1/.test(location.search)||!!window.__TG_SEAL;
const carved=id=>!CV||id==='s0'||(test()&&!SEAL)||!!(D&&D.cv&&D.cv[id]);
const sockLvOK=i=>test()||lv()>=SOCK_LV[i],ssLvOK=i=>test()||lv()>=SS_LV[i];
const sockOpen=i=>sockLvOK(i)&&carved('p'+i);
const ssOpen=i=>ssLvOK(i)&&carved('s'+i);   /* skill star i */
const uOpen=(i,j)=>ssOpen(i)&&carved('u'+i+j);   /* teal support hole j of skill hole i */
const ssOK=k=>{const s=(G('SKILLS')||{})[k];return !!(s&&s.name&&s.br!=='C'&&!s.passive&&!s.parent&&typeof s.make==='function');};   /* an active Basic / A / B skill (a combo follow-up rides on its starter's star) */
const ssChain=k=>{const S=G('SKILLS'),c=[k];for(let q=S[k]&&S[k].follow,n=0;q&&S[q]&&n<3&&!c.includes(q);q=S[q].follow,n++)c.push(q);return c;};
const ssLearned=k=>ssOK(k)&&((G('LV')||{})[k]||0)>0;
const ssAct=i=>{const k=D.ss[i];return !!(k&&ssOpen(i)&&ssLearned(k)&&extracted(k));};
const giftN=()=>Math.max(0,SS_LV.filter((l,i)=>ssOpen(i)).length-(D.gift||0));
const BRN={basic:'Basic',A:'A',B:'B'};
const tierOK=k=>test()||lv()>=TIER_LV[G('SKILLS')[k].tier];
/* side holes of pole tier i: j 0 inner mutation (opens with the tier) · j 1 / 2 outer supports (each carved) · j 3 2nd mutation (the tier's gem at the
   level cap — a reward of the gem, not carved). Before carving (2026-11-21) the supports opened at gem level 3 / 5. */
const modOpen=(i,j)=>{const k=D.sock[i];if(!k||!sockOpen(i))return false;return j===0||((j===1||j===2)&&carved('q'+i+j))||(j===3&&((D.own[k]||{}).lv||1)>=CAP);};
const isMutJ=j=>j===0||j===3;
const used=(kind,id)=>{let n=0;for(const k of D.sock)if(k&&D.mods[k])D.mods[k].forEach((x,j)=>{if(x===id&&((kind==='mut')===isMutJ(j)))n++;});if(kind==='mut')for(const x of D.sm||[])if(x===id)n++;
  if(kind==='sup')for(const a of D.ssu||[])for(const x of a||[])if(x===id)n++;return n;};
const free=(kind,id)=>bagN((kind==='mut'?'gmut_':'gsup_')+id);   /* unsocketed gems = bag goods */
const giveBack=k=>{const a=D.mods[k];if(!a)return;a.forEach((id,j)=>{if(id)bagAdd((isMutJ(j)?'gmut_':'gsup_')+id,1);});D.mods[k]=[null,null,null,null];bagSave();};
const GEM_ART={wolf:1};   /* heroes with painted main gems (assets/gems/<hero>/); the others show the skill icon set as a round gem */
const gemImg=k=>GEM_ART[HERO]?GEM_DIR+k+'.webp':'assets/icons/'+HERO+'/'+k+'.webp';
const gemIc=()=>GEM_ART[HERO]?'':'ic';
/* ---------- carving: what each sealed hole asks for (gem_data.js CARVE) ---------- */
const TIERN=['หมี','นกฮูก','หมาป่า','อินทรี','นกสายฟ้า'],LANDN={vik:'นอร์ส',grk:'กรีก',egy:'อียิปต์',jpn:'ญี่ปุ่น',azt:'แอซเท็ก'};
const LANDS=()=>Object.keys((AF()&&AF().TOWNS)||LANDN);
function hole(id){const t=id[0],i=+id[1],j=id.length>2?+id[2]:null,base=t==='s'||t==='u',arr=CV&&CV[t]||[];
  const L=base?SS_LV[i]:SOCK_LV[i],c=arr.length?arr[Math.min(i,arr.length-1)]:null;
  return {id,t,i,j,lv:L,c:t==='s'&&i===0?null:c,land:base?null:CV&&CV.land[i],par:t==='u'?'s'+i:t==='q'?'p'+i:null,g:Math.min(9,Math.floor(L/10)),
    nm:t==='s'?`หลุมสกิลที่ ${i+1}`:t==='u'?`หลุมเสริมขอบเขียว${j?'ขวา':'ซ้าย'} · หลุมสกิลที่ ${i+1}`:t==='p'?`ชั้นเสาที่ ${i+1} · ${TIERN[i]||''}`:`หลุมเสริม${j===1?'ซ้าย':'ขวา'}นอกปีก · ชั้นเสาที่ ${i+1}`};}
/* 'ma' / 'mb' = common / rare monster material of the hole's level band, from any land (base) or the tier's own land (pole) */
function needs(h){if(!h.c)return [];const out=[];
  for(const [x,n] of h.c.it)out.push(x==='ma'||x==='mb'?{x,n,ids:(h.land?[h.land]:LANDS()).map(r=>`m_${r}_${h.g}_${x[1]}`)}:{x,n,ids:[x]});if(h.c.z)out.push({x:'z',ids:[],n:h.c.z});return out;}
const haveN=e=>e.x==='z'?zeny():e.ids.reduce((a,id)=>a+bagN(id),0);
const holeLvOK=h=>h.t==='s'||h.t==='u'?ssLvOK(h.i):sockLvOK(h.i);
/* open · par (its big hole first) · lv (level not reached) · seal (goods missing) · rdy (can carve now) */
function cvState(id){const h=hole(id);if(!holeLvOK(h))return 'lv';if(carved(id))return 'open';if(h.par&&!carved(h.par))return 'par';return needs(h).every(e=>haveN(e)>=e.n)?'rdy':'seal';}
function carveNow(id){if(cvState(id)!=='rdy')return false;const L=needs(hole(id)).sort((a,b)=>(b.x==='z')-(a.x==='z'));   /* zeny first: the only payment that can still fail */
  for(const e of L){if(e.x==='z'){if(!payZ(e.n))return false;continue;}let left=e.n;
    for(const x of e.ids.slice().sort((a,b)=>bagN(b)-bagN(a))){const t=Math.min(left,bagN(x));if(t>0){bagAdd(x,-t);left-=t;}if(!left)break;}}   /* any-land materials: the land you hold most of goes first */
  bagSave();(D.cv||(D.cv={}))[id]=1;save();return true;}
/* every hole that can be carved, in the order the totem grows (base 1 → 5 with its teal holes, then the pole bottom → top) */
const HOLE_IDS=()=>{const o=[];for(let i=0;i<NSS;i++){o.push('s'+i);if(SSU[i])o.push('u'+i+'0','u'+i+'1');}for(let i=0;i<NS;i++)o.push('p'+i,'q'+i+'1','q'+i+'2');return o;};
const anyRdy=()=>!!CV&&HOLE_IDS().some(id=>cvState(id)==='rdy');
const GIVES={s:'วางสกิลที่เรียนแล้ว 1 ท่า · หลุมแปรสภาพขอบทองข้างล่างเปิดพร้อมกัน · ได้เจมแปรสภาพฟรี 1 เม็ด (ของขวัญ)',u:'ใส่เจมเสริม 1 เม็ดให้สกิลในหลุมนี้ (ผลครึ่งหนึ่ง)',
  p:'ใส่เจม C (สกิลขั้น C) 1 เม็ด · หลุมแปรสภาพด้านในปีกเปิดพร้อมกัน',q:'ใส่เจมเสริม 1 เม็ดให้เจม C ของชั้นนี้ (ผลเต็ม)'};
function needRow(e,h){const a=AF(),ui=a&&a.ui,hv=haveN(e),ok=hv>=e.n,band=`Lv ${h.g*10}–${h.g*10+9}`;let ic='',nm='',src='';
  if(e.x==='z'){ic='<b class="cvz">z</b>';nm='เงิน';src='ล่ามอน · ขายของ';}
  else{const best=e.ids.slice().sort((p,q)=>bagN(q)-bagN(p))[0];ic=ui?ui.etcIcon(best,22):'';
    if(e.x==='ma'||e.x==='mb'){const rr=e.x==='mb'?'หายาก':'ธรรมดา';   /* a short first line (the phone column is narrow), the details under it */
      nm=h.land?`${ui?ui.etcName(e.ids[0]):e.ids[0]}<small style="display:block">วัตถุดิบ${rr} มอน ${band} แดน${LANDN[h.land]}</small>`:`วัตถุดิบ${rr}<small style="display:block">มอน ${band} · แดนไหนก็ได้</small>`;
      src='ล่ามอนช่วงเลเวลนี้ · ตลาดกลาง';}   /* the land and level band are already on the line above */
    else{nm=ui?ui.etcName(e.x):e.x;const t=+e.x.slice(-1);
      src=e.x==='tess'?'มอนทุกตัว · บอส · ย่อยเจมซ้ำ · ตลาดกลาง':e.x==='sore'?'มอน Lv 70+ · บอส · ตลาดกลาง':/^tfrag/.test(e.x)?'ย่อยเจมซ้ำ (⛏ ศาล) · ตลาดกลาง':
        `มอน ${['','Lv 1–29','Lv 30–59','Lv 60–89','Lv 90+'][t]||''} (ดันเจี้ยนบ่อยกว่า) · บอส · ตลาดกลาง`;}}
  return `<div class="cvr${ok?'':' no'}" title="${src}"><span class="cvi">${ic}</span><span class="cvn">${nm}${ok?'':`<small class="cvs">หาได้: ${src}</small>`}</span><em>${fmtN(hv)}/${fmtN(e.n)}</em></div>`;}
function cvInfo(id,extra){const h=hole(id),st=cvState(id);
  const gv=`<br><span style="color:#2a5a8a">เปิดแล้วได้: ${GIVES[h.t]}</span>`;let r=`<b>⛏ สลักเปิด · ${h.nm}</b>`;   /* the list first: on a phone only a few lines show */
  if(st==='open')return r+'<br><span class="g">✔ สลักเปิดแล้ว</span>'+gv+(extra||'');
  r+='<div class="cvl">';   /* the level and the big hole only show while they are still missing (short card on a phone) */
  if(st==='lv')r+=`<div class="cvr no"><span class="cvi">⭐</span><span class="cvn">เลเวลตัวละคร ${h.lv}</span><em>${lv()}/${h.lv}</em></div>`;
  if(h.par&&!carved(h.par))r+=`<div class="cvr no"><span class="cvi">⛏</span><span class="cvn">สลัก${hole(h.par).nm} ก่อน</span><em>ยัง</em></div>`;
  r+=needs(h).map(e=>needRow(e,h)).join('')+'</div>';
  r+=st==='rdy'?'<span class="g">ของครบแล้ว — กดปุ่ม "⛏ สลักเปิด" ด้านล่าง</span>':st==='lv'?`<span class="c">ถึง Lv ${h.lv} แล้วจึงสลักได้ — เก็บของเตรียมไว้ก่อนได้</span>`:st==='par'?'<span class="c">หลุมเล็กเปิดได้หลังหลุมใหญ่ของมัน</span>':'<span class="c">ของยังไม่ครบ (แถวสีแดง)</span>';
  return r+(extra||'')+gv;}
/* ---------- skill gems (owner 2026-11-21: 'every skill must be extracted into a gem before it goes on the base') ----------
   A learned Basic / A / B skill is extracted ONCE into a skill gem (gem_data.js EXTRACT: a raw totem stone + essence + zeny by the level the
   skill is learned at); the gem can then sit in any open skill hole and be moved / taken out freely. The first extraction is free. */
const EX=GD&&GD.EXTRACT;
const extracted=k=>!EX||(test()&&!SEAL)||!!(D&&D.sx&&D.sx[k]);
const exFree=()=>!Object.keys(D.sx||{}).length;
function exCost(k){const R=G('SKREQ')||{},L=(R[k]&&R[k][0]&&R[k][0].lv)||1,b=Math.max(0,EX.findIndex(e=>L<=e[0]));return {L,b,c:EX[b][1]};}
function exNeeds(k){if(exFree())return [];const c=exCost(k).c,out=c.it.map(([x,n])=>({x,n,ids:[x]}));if(c.z)out.push({x:'z',ids:[],n:c.z});return out;}
/* done · nolearn · rdy · short */
function exState(k){if(extracted(k))return 'done';if(!ssLearned(k))return 'nolearn';return exNeeds(k).every(e=>haveN(e)>=e.n)?'rdy':'short';}
function extractNow(k){if(exState(k)!=='rdy')return false;const L=exNeeds(k).sort((a,b)=>(b.x==='z')-(a.x==='z'));
  for(const e of L){if(e.x==='z'){if(!payZ(e.n))return false;continue;}bagAdd(e.x,-e.n);}
  bagSave();(D.sx||(D.sx={}))[k]=newSG(false);save();return true;}
function exInfo(k,extra){const S=G('SKILLS'),s=S[k],st=exState(k),x=exCost(k),fr=exFree();
  let r=`<b>⚗ สกัดสกิลเป็นเจม · ${s.name}</b>`;
  if(st==='done')return r+'<br><span class="g">✔ สกัดเป็นเจมแล้ว — แตะหลุมสกิลบนแท่นหินเพื่อวาง</span>'+(extra||'');
  r+='<div class="cvl">'+(fr?'<div class="cvr"><span class="cvi">🎁</span><span class="cvn">สกัดครั้งแรกฟรี<small class="cvs">ลองวางสกิลในหลุมแรกได้เลย</small></span><em>ฟรี</em></div>'
    :exNeeds(k).map(e=>needRow(e,{g:0,land:null})).join(''))+'</div>';
  r+=st==='nolearn'?'<span class="c">ยังไม่ได้เรียนสกิลนี้ — อัปในหน้าต่างสกิล (K) ก่อน</span>':st==='rdy'?'<span class="g">ของครบ — กดปุ่ม "⚗ สกัดเป็นเจม" ด้านล่าง</span>':'<span class="c">ของยังไม่ครบ (แถวสีแดง)</span>';
  return r+(extra||'')+`<br><span style="color:#2a5a8a">สกิลต้องสกัดเป็นเจมก่อนจึงจะวางบนแท่นได้ · สกัดครั้งเดียว ถอด / ย้ายหลุมได้ตลอด · ราคาตามเลเวลที่เรียนสกิลนี้ได้ (Lv ${x.L})</span>`;}
/* skill gem = rarity + level + special stats (owner 2026-11-21), the same kind of random lines as a C gem (no board-link lines). D.sx[k] = {lv, q, lines, cand?}.
   A skill extracted before this (D.sx[k] = 1) is rolled the first time it is looked at (plain odds, no pity); test mode makes one for every learned skill. */
const saveQ=()=>{try{localStorage.setItem(SKEY,JSON.stringify(D));}catch(e){}};   /* save without apply() (sgo can run inside apply) */
function newSG(free){const q=free?rollQfree():rollQ();return {lv:1,q,lines:rollLines(q,1,null,'s')};}
function sgo(k){if(!D||!k)return null;const X=D.sx||(D.sx={});let o=X[k];
  if(o&&typeof o!=='object'){o=X[k]=newSG(true);saveQ();}
  else if(!o&&EX&&test()&&!SEAL&&ssLearned(k)){o=X[k]=newSG(true);saveQ();}
  return o&&typeof o==='object'?o:null;}
const payNeeds=L=>{const s=L.slice().sort((a,b)=>(b.x==='z')-(a.x==='z'));for(const e of s){if(e.x==='z'){if(!payZ(e.n))return false;continue;}bagAdd(e.x,-e.n);}bagSave();return true;};
/* re-extract: the extraction price again → a new rarity + lines (level kept) waits as o.cand until the player keeps one of the two */
function reNeeds(k){const c=exCost(k).c,out=c.it.map(([x,n])=>({x,n,ids:[x]}));if(c.z)out.push({x:'z',ids:[],n:c.z});return out;}
const reOK=k=>{const o=sgo(k);return !!(o&&!o.cand&&reNeeds(k).every(e=>haveN(e)>=e.n));};
function reExtract(k){const o=sgo(k);if(!reOK(k)||!payNeeds(reNeeds(k)))return false;const q=rollQ();o.cand={q,lines:rollLines(q,o.lv,null,'s')};save();return true;}
/* skill gem level: essence + zeny (half a C gem's), stones at the breakthroughs; Lv 10 / 20 / 30 / 40 open one more special-stat slot */
function sgNeed(o){const l=(o&&o.lv)||1;return {ess:SGC?SGC.lvEss(l):0,z:SGC?SGC.lvZ(l):0,brk:(SGC&&SGC.brk[l])||[]};}
const sgCan=o=>{if(!o||o.lv>=CAP)return false;const n=sgNeed(o);return bagN('tess')>=n.ess&&zeny()>=n.z&&n.brk.every(([x,c])=>bagN(x)>=c);};
function sgUp(k){const o=sgo(k);if(!sgCan(o))return null;const n=sgNeed(o);if(!payZ(n.z))return null;bagAdd('tess',-n.ess);for(const [x,c] of n.brk)bagAdd(x,-c);bagSave();
  o.lv++;const add=openSlots(o,'s',o.lv-1);save();return `<br><span class="g">✔ ${n.brk.length?'ทะลุขีด! ':''}เลเวลเจมสกิล ${o.lv}</span>`+add;}
/* a level that opens a slot rolls its new line at once (and fills any empty slot) */
function openSlots(o,pool,was){if(NSL(o.q,o.lv)<=NSL(o.q,was))return '';
  const n=(o.lines||[]).length;o.lines=rollLines(o.q,o.lv,o.lines,pool);const nw=o.lines.slice(n);
  return nw.length?`<br><span class="g">✨ เปิดช่องสเตตัสพิเศษใหม่: ${nw.map(l=>lnTxt(l,o.q,o.lv)).join(' · ')}</span>`:'';}

/* ---------- board geometry (board 680×680; frame art 1254², plain totem ring 2026-11-19, shifted so its inner rim circle sits at the centre 627,627 r 467.1) ---------- */
const BS=680,K=BS/1254,HX=627*K,HY=627*K,HR=446.6*K,FR=467.1*K;   /* centre + inner-rim radius FR fitted to the frame art (least squares on its inner edge) */
const SPREAD=1,PU=0,PV=0;
const P=(u,v)=>({x:HX+(u-PU)*HR*.96*SPREAD,y:HY+(v-PV)*HR*.96*SPREAD});
/* socket layout: 5 main stars round the sky, each with its 3 mod stars (repulsion-relaxed) */
/* owner 2026-11-19: spread over the whole sky. Page v2 (2026-11-21): re-relaxed for the bigger land sockets so every socket picture keeps
   ≥ 10 px from the others and from the inner skill ring, and stays inside the ring (search: /home/claude/work/layout/opt.py) */
const MAIN=[P(0.300,-0.468),P(-0.360,-0.413),P(-0.506,0.212),P(0.185,0.562),P(0.530,0.092)];
const MODS=[ // [mutation, support, support] per main socket
 [P(0.520,-0.737),P(0.662,-0.423),P(0.068,-0.692)],
 [P(-0.584,-0.689),P(-0.132,-0.703),P(-0.690,-0.307)],
 [P(-0.840,0.312),P(-0.731,-0.093),P(-0.400,0.531)],
 [P(0.120,0.905),P(-0.135,0.694),P(0.528,0.660)],
 [P(0.872,0.157),P(0.605,0.415),P(0.682,-0.210)]];
/* skill stars: a regular pentagon inside the C stars (radius 58, turned 46.1° = most room between the main stars),
   ordered Lv 10 top → left → lower left → lower right → right, so the path winds on to the first C star (upper right) */
const SS_A=[262.1,190.1,118.1,46.1,334.1],SS_R=58,SS_MO=24,rad=a=>a*Math.PI/180;
const SSP=SS_A.map(a=>({x:HX+Math.cos(rad(a))*SS_R,y:HY+Math.sin(rad(a))*SS_R}));
const SMP=SS_A.map(a=>({x:HX+Math.cos(rad(a))*(SS_R+SS_MO),y:HY+Math.sin(rad(a))*(SS_R+SS_MO)}));
const SSU=[];   /* SSU[i] = [left, right] support sockets of skill hole i — only when the base picture has them (TOT.base.u) */   /* their mutation socket sits on the outer rim */
{/* place each second-mutation star in the most open spot around its main star (clearance = distance − both radii) */
  const nodes=()=>[...MAIN.map(p=>[p,54]),...SSP.map(p=>[p,32]),...SMP.map(p=>[p,19]),...MODS.flatMap(m=>m.slice(0,4).map((p,j)=>p&&[p,j===2||j===1?20:26]).filter(Boolean))];
  MODS.forEach((m,i)=>{const c=MAIN[i];let best=null,bs=-1e9;
    for(let a=0;a<6.28;a+=.1)for(const rr of [84,92,100,110]){const p={x:c.x+Math.cos(a)*rr,y:c.y+Math.sin(a)*rr};if(Math.hypot(p.x-HX,p.y-HY)>HR*.86)continue;
      let cl=1e9;for(const [q,r] of nodes()){if(q===c)continue;cl=Math.min(cl,Math.hypot(q.x-p.x,q.y-p.y)-r-26);}cl-=rr*.05;if(cl>bs){bs=cl;best=p;}}
    m[3]=best;});}
/* ---------- page v3 'your totem pole' (owner 2026-11-21: 'put the gems INTO a totem' — the themed land sockets looked cluttered) ----------
   One carved pole, 5 tiers bottom → top = the C sockets (Lv 60 / 70 / 80 / 90 / 99), standing on a stone base whose 5 front holes are the
   skill stars (small hole beside each = its mutation). Every hole is painted in the two pictures; TOT = the holes measured from them by
   tools/gems/totlay.py, [cx, cy, r] in picture px. Tier holes h = [inner-left = mutation, outer-left = support,
   outer-right = support, inner-right = 2nd mutation]; cut = the y between two tiers (locked tiers are drawn as a pale ghost).
   TOT = null → the round board above. window.__TOT lets a test page try a table without editing this file. */
const TL=(()=>{if(!TOT)return null;const P=TOT.pole,B=TOT.base;
  /* the pole is drawn 1.25× the base's scale, so its foot nearly fills the gold ring; together they fill the board's height
     (pole top 6 px under the board top, base bottom 4 px over the board floor, the foot's contact point on the ring's centre) */
  const K=1.25,sb=(BS-10)/((P.foot-P.top)*K+(B.bot-B.stand[1])),sp=sb*K;
  const bx=HX-B.stand[0]*sb,by=BS-4-B.bot*sb,stY=by+B.stand[1]*sb,px=HX-P.cx*sp,py=stY-P.foot*sp;
  const pp=h=>({x:px+h[0]*sp,y:py+h[1]*sp,r:h[2]*sp}),bp=h=>({x:bx+h[0]*sb,y:by+h[1]*sb,r:h[2]*sb});
  P.tiers.forEach((t,i)=>{MAIN[i]=pp(t.m);MODS[i]=t.h.map(pp);});
  B.s.forEach((h,i)=>{SSP[i]=bp(h);SMP[i]=bp(B.t[i]);if(B.u&&B.u[i])SSU[i]=B.u[i].map(bp);});
  return {sp,px,py,pw:P.W*sp,ph:P.H*sp,ct:P.cut.map(y=>y*sp),bx,by,bw:B.W*sb,bh:B.H*sb,cw:B.W*sb+16};})();
const HOLE=p=>TL&&p&&p.r?{r:p.r}:null;
const SZ={main:116,mut:52,sup:39,skill:66,smut:34,ssup:30},CUP={main:{cx:.494,cy:.469,r:.28},mut:{cx:.498,cy:.506,r:.281},sup:{cx:.499,cy:.478,r:.341}};
const ART={skill:'sup',smut:'mut',ssup:'sup'};   /* skill star = the round socket in silver, its mutation socket = the rune rim */

/* ---------- DOM ---------- */
const css=document.createElement('style');css.textContent=`
#totemWin{position:fixed;inset:0;z-index:58;display:none;align-items:center;justify-content:center;background:rgba(6,4,10,.62)}
#totemWin.open{display:flex}
#tgBox{position:fixed;inset:8px;display:flex;gap:10px;padding:34px 12px 12px;box-sizing:border-box;border-radius:22px;background:linear-gradient(#3a2418,#24140c);border:4px solid #e9b44c;box-shadow:0 0 0 3px #3a1f14,0 14px 40px rgba(0,0,0,.6);font-family:Mitr,Sarabun,sans-serif;color:#fff3c8;user-select:none}
#tgBox h2{position:absolute;left:0;right:0;top:-24px;margin:0 auto;width:320px;height:48px;line-height:44px;text-align:center;font:700 20px Mitr,serif;color:#fff3c8;background:linear-gradient(#a8452c,#5a1a10);border:3px solid #e9b44c;border-radius:24px;box-shadow:0 4px 0 #1a0c06;text-shadow:0 2px 0 #3a1f14;z-index:2}
#tgX{position:absolute;right:-14px;top:-14px;width:40px;height:40px;border-radius:50%;border:3px solid #e9b44c;background:#a8452c;color:#fff;font:900 20px sans-serif;cursor:pointer;box-shadow:0 3px 0 #1a0c06;z-index:3}
#tgMid{flex:1;min-width:0;position:relative;display:flex;align-items:center;justify-content:center}
#tgScr{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
#tgScr.scr{overflow-x:hidden;overflow-y:auto;align-items:flex-start;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-width:none;
  -webkit-mask-image:linear-gradient(transparent,#000 28px,#000 calc(100% - 8px),transparent);mask-image:linear-gradient(transparent,#000 28px,#000 calc(100% - 8px),transparent)}
#tgScr.scr::-webkit-scrollbar{display:none}   /* short phone screens: the totem fits the column's width, scroll up and down the pole */
#tgZoom{position:relative;flex:none;width:${BS}px;height:${BS}px}
#tgScr.scr #tgBoard{position:absolute;left:0;top:0;transform-origin:0 0}
#tgBoard{position:relative;flex:none;width:${BS}px;height:${BS}px;transform-origin:center}
#tgBoard>img,#tgBoard>canvas{position:absolute;pointer-events:none}
#tgSky{left:${HX-FR*1.01}px;top:${HY-FR*1.01}px;width:${FR*2.02}px;height:${FR*2.02}px;border-radius:50%}
#tgLines,#tgRing{left:0;top:0;width:${BS}px;height:${BS}px}
#tgFrame{left:${HX-RING.cx*FR/RING.r}px;top:${HY-RING.cy*FR/RING.r}px;width:${RING.W*FR/RING.r}px;height:${RING.W*FR/RING.r}px;filter:drop-shadow(0 5px 10px rgba(0,0,0,.6))}
.tgN{position:absolute;cursor:pointer;transform:translate(-50%,-50%)}
.tgN>img.sk{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.55))}
.tgN>.in{position:absolute;border-radius:50%;overflow:hidden;pointer-events:none}
.tgN>.eg{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(var(--eg),.55),rgba(var(--eg),0) 70%);animation:tgEg 2.4s ease-in-out infinite}
@keyframes tgEg{0%,100%{opacity:.35}50%{opacity:.9}}
.tgN>.in img{width:100%;height:100%;object-fit:contain;display:block;transform:scale(1.25)}
.tgN.lock{transform:translate(-50%,-50%) scale(.8)}
.tgN.lock>img.sk{opacity:.4;filter:grayscale(.75) brightness(.85) drop-shadow(0 0 4px rgba(140,170,255,.35))}
.tgN .lk{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);padding:0 6px;border-radius:9px;background:rgba(12,10,32,.82);border:1px solid rgba(160,190,255,.4);font:700 10px/15px Mitr,sans-serif;color:#cfe0ff;white-space:nowrap;pointer-events:none}
.tgN .in.ic img,.tgN .in.ic svg{transform:scale(1.42)}
.tgN .in.ic::after{content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle at 34% 27%,rgba(255,255,255,.6) 0 9%,rgba(255,255,255,.14) 21%,transparent 38%),radial-gradient(circle at 50% 52%,transparent 56%,rgba(0,0,0,.5) 100%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.3)}
.tgN.sel>img.sk{filter:drop-shadow(0 0 7px #ffe14a) drop-shadow(0 0 3px #fff17a)}
.tgN .lvd{position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);font:900 10px sans-serif;color:#ffe9a8;text-shadow:0 1px 2px #000;letter-spacing:-1px;white-space:nowrap;pointer-events:none}
.tgSg{position:absolute;inset:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;color:#fff;text-shadow:0 1px 1px #000;
  background:radial-gradient(circle at 35% 30%,#fff9 0 12%,transparent 13%),radial-gradient(circle at 50% 55%,var(--c),color-mix(in srgb,var(--c),#000 50%));box-shadow:inset 0 -2px 3px rgba(0,0,0,.35)}
.tgSg>img{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;opacity:0}
.tgSg.art{transform:none!important;background:none!important;border:0!important;box-shadow:0 0 6px rgba(0,0,0,.55)!important}.tgSg.art>span{display:none}.tgSg.art>img{opacity:1}
.tgSg.mut{border-radius:30%;transform:rotate(45deg) scale(.82)}.tgSg.mut>span{transform:rotate(-45deg)}
#tgLeft,#tgRight{flex:none;display:flex;flex-direction:column;gap:6px;min-height:0}
#tgLeft{width:clamp(170px,21vw,300px)}#tgRight{width:clamp(200px,25vw,340px);overflow:auto}
#tgSel{display:flex;gap:8px;align-items:center;background:rgba(0,0,0,.28);border-radius:12px;padding:8px}
#tgSel .big{width:clamp(48px,7vw,96px);aspect-ratio:1;flex:none;position:relative}#tgSel .big img{width:100%;height:100%}
#tgSel .big .tgSg{inset:12%}#tgSel b{font:700 clamp(12px,1.4vw,16px) Mitr,sans-serif;color:#ffe9a8}
#tgLeft h3,#tgRight h3{margin:0;font:700 12px Mitr,sans-serif;color:#e9c98a;border-bottom:1.5px solid #6a4a2a;padding-bottom:1px}
.tgInv{display:grid;gap:5px;background:rgba(0,0,0,.25);border-radius:10px;padding:5px}
#tgGems,#tgMuts,#tgSups{grid-template-columns:repeat(auto-fill,minmax(48px,1fr))}
.tgInv button{position:relative;border:0;background:none;padding:0;cursor:pointer;aspect-ratio:1;border-radius:8px}
.tgInv button img{width:100%;height:100%;display:block}
.tgInv button .tgSg{inset:3px}
.tgInv button.used img,.tgInv button.used .tgSg{opacity:.32}
.tgInv button.lock img{filter:grayscale(1) brightness(.45)}
.tgInv button.sel{box-shadow:0 0 0 2.5px #fff17a,0 0 9px #ffe14a}
.tgInv button i{position:absolute;right:-1px;bottom:-1px;font:700 8px sans-serif;color:#fff;background:#5a2e16;border-radius:5px;padding:0 2px;font-style:normal}
#tgInfo{flex:1;min-height:0;overflow:auto;background:rgba(255,248,230,.95);color:#3a1f14;border:2px solid #c9a46a;border-radius:10px;padding:8px 10px;font:500 clamp(11px,1.15vw,14px)/1.5 Mitr,sans-serif}
#tgInfo b{color:#7a2a1c}#tgInfo .g{color:#2a7a3a}#tgInfo .c{color:#a8302a}
#tgBtns{display:flex;gap:6px}
#tgBtns button{flex:1;padding:6px 0;border-radius:12px;border:2px solid #5a2e16;background:linear-gradient(#ffd77a,#e9a43c);font:700 12px Mitr,sans-serif;color:#3a1f14;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgBtns button:disabled{filter:grayscale(1);opacity:.45;cursor:default}
.tgInv button b.dp{position:absolute;left:-1px;top:-1px;font:700 8px sans-serif;color:#fff;background:#2a5a8a;border-radius:5px;padding:0 2px}
#tgInfo .ln{display:flex;align-items:center;gap:4px;margin:2px 0;padding:2px 4px;border-radius:6px;background:rgba(201,164,106,.18)}
#tgInfo .ln i{font-style:normal;font-weight:700;color:#7a2a1c;min-width:20px}#tgInfo .ln span{flex:1}
#tgInfo .ln button,#tgInfo .rr button{border:1.5px solid #5a2e16;border-radius:8px;background:linear-gradient(#ffd77a,#e9a43c);font:700 10px Mitr,sans-serif;color:#3a1f14;cursor:pointer;padding:1px 5px}
#tgInfo .ln button:disabled,#tgInfo .rr button:disabled{filter:grayscale(1);opacity:.45;cursor:default}
#tgInfo .ln label{font-size:10px;color:#6a4a2a;white-space:nowrap}
#totemWin .q{font-weight:700;padding:0 6px;border-radius:8px;color:#1a1a2a;text-shadow:none}
#tgWsB{margin-top:2px;padding:7px 0;border-radius:12px;border:2px solid #5a2e16;background:linear-gradient(#9fe0ff,#3a8ad8);font:700 13px Mitr,sans-serif;color:#10243a;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgWs{position:absolute;inset:6px;z-index:5;display:none;flex-direction:column;gap:8px;padding:10px;border-radius:16px;background:rgba(30,18,10,.95);border:2px solid #e9b44c;overflow:auto}
#tgWs.open{display:flex}#tgWs h4{margin:0;font:700 15px Mitr,sans-serif;color:#ffe9a8}
#tgWs .tabs{display:flex;gap:6px;flex-wrap:wrap}#tgWs .tabs button{flex:1;min-width:90px;padding:6px 4px;border-radius:10px;border:2px solid #5a2e16;background:#5a3a22;color:#fff3c8;font:700 12px Mitr,sans-serif;cursor:pointer}
#tgWs .tabs button.on{background:linear-gradient(#ffd77a,#e9a43c);color:#3a1f14}
#tgWs .row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:rgba(255,248,230,.08);border-radius:10px;padding:8px}
#tgWs .row .nm{flex:1;min-width:150px;font:500 12px/1.4 Mitr,sans-serif;color:#fff3c8}#tgWs .row .nm b{color:#ffe9a8}
#tgWs .go{padding:6px 12px;border-radius:10px;border:2px solid #5a2e16;background:linear-gradient(#ffd77a,#e9a43c);font:700 12px Mitr,sans-serif;color:#3a1f14;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgWs .go:disabled{filter:grayscale(1);opacity:.45;cursor:default}
#tgWs .ic{display:inline-flex;align-items:center;gap:2px;font:700 12px Mitr,sans-serif;color:#fff}#tgWs .ic.no{color:#ff8a7a}
#tgWs .res{min-height:44px;display:flex;align-items:center;gap:10px;padding:8px;border-radius:12px;background:rgba(0,0,0,.35);font:600 13px Mitr,sans-serif;color:#fff3c8}
#tgWs .res img{width:48px;height:48px}#tgWs .note{font:500 11px/1.5 Mitr,sans-serif;color:#e9c98a}
#tgWs .gg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
#tgWs .gc{display:flex;gap:6px;align-items:center;padding:6px;border-radius:10px;background:rgba(255,248,230,.08);font:500 11px/1.35 Mitr,sans-serif;color:#fff3c8}
#tgWs .gc img{width:40px;height:40px;flex:none}#tgWs .gc button{margin-left:auto}
@keyframes tgPop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.25);opacity:1}100%{transform:scale(1)}}#tgWs .res .pop{animation:tgPop .5s ease-out}
/* skill stars (silver inner ring) */
.tgN.ss>img.sk{filter:drop-shadow(0 0 5px rgba(150,205,255,.5)) drop-shadow(0 3px 3px rgba(0,0,0,.55))}
.tgN.ss.lock>img.sk{opacity:.45;filter:grayscale(.4) brightness(.85)}
.tgN.ss.sel>img.sk{filter:brightness(1.25) drop-shadow(0 0 9px #cfeaff) drop-shadow(0 0 3px #fff)}
.tgN.mn .lvd{bottom:auto;top:61%;font-size:11px;background:rgba(20,10,4,.65);border-radius:7px;padding:0 4px}
.tgN.mn .lk{bottom:auto;top:70%}
.tgN.ss .in{background:#141026}.tgN.ss.off .in{filter:grayscale(1) brightness(.55)}
.tgN.smut.dim>img.sk{filter:brightness(.55) saturate(.6) drop-shadow(0 2px 2px rgba(0,0,0,.55))}
.tgN.smut .in .tgSg{inset:0}
#tgGiftB{padding:7px 0;border-radius:12px;border:2px solid #5a2e16;background:linear-gradient(#ffe48a,#ff9a3a);font:700 13px Mitr,sans-serif;color:#3a1f14;cursor:pointer;box-shadow:0 2px 0 #1a0c06;animation:tgGift 1.1s ease-in-out infinite alternate}
@keyframes tgGift{to{box-shadow:0 2px 0 #1a0c06,0 0 14px #ffd23a}}
#tgSkills{grid-template-columns:repeat(auto-fill,minmax(44px,1fr))}
#tgSkills button img,#tgSkills button svg{width:100%;height:100%;display:block;border-radius:8px}
#tgSkills button.used img,#tgSkills button.used svg{opacity:.38}
#tgWs .gc .gem{width:42px;height:42px;position:relative;flex:none}
@media (max-width:900px),(max-height:520px){#tgWs .gg{grid-template-columns:1fr}#tgWs .gc{font-size:12px}}
#tgInfo .ssb{margin-top:4px;border:1.5px solid #5a2e16;border-radius:8px;background:linear-gradient(#ffd77a,#e9a43c);font:700 11px Mitr,sans-serif;color:#3a1f14;cursor:pointer;padding:2px 8px}
/* gem mark on the real skill: hotbar, phone wheel, skill tree, totem lists */
.gmk{position:absolute;right:-6px;top:-7px;z-index:6;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font:900 10px/1 sans-serif;color:#fff;text-shadow:0 1px 1px #000;pointer-events:none}
.gmk::before{content:'';position:absolute;inset:2px;border-radius:4px;transform:rotate(45deg);background:radial-gradient(circle at 40% 35%,#fffa 0 14%,var(--c) 46%,color-mix(in srgb,var(--c),#000 48%));box-shadow:0 0 0 1.5px #2a1a0c,0 0 6px var(--rc,var(--c))}
.gmk>b{position:relative;font-weight:900}.gmk.two{right:8px}
.mobSk .gmk{right:-2px;top:-2px;width:21px;height:21px;font-size:11px}.mobSk .gmk.two{right:15px}
.tc .gmk{right:-5px;top:-5px}
#mgrid button[data-m="tgem"]{position:relative}
#mgrid button.tgDot::after{content:'';position:absolute;right:1px;top:1px;width:10px;height:10px;border-radius:50%;background:#ff4a3a;box-shadow:0 0 0 2px #fff,0 0 6px #ff4a3a;animation:tgGift 1s infinite alternate}
/* ---- page v2 'ศาลวิญญาณโทเท็ม' (owner 2026-11-21: a new, prettier gem page with a totem theme). Painted pieces drop in from
   assets/gems/page/ when they exist (bg.webp → .hasbg); until then the night-shrine look is made with gradients. ---- */
#totemWin{background:rgba(4,3,10,.72)}
#tgBox{background:radial-gradient(ellipse 60% 42% at 50% 6%,rgba(70,210,175,.17),transparent 70%),radial-gradient(ellipse 42% 38% at 14% 18%,rgba(130,95,230,.16),transparent 70%),
  radial-gradient(ellipse 42% 38% at 86% 22%,rgba(80,140,255,.13),transparent 70%),radial-gradient(ellipse 75% 45% at 50% 112%,rgba(255,165,80,.16),transparent 70%),linear-gradient(#151b3c,#0c0f27 55%,#1b1022);
  border:3px solid #c9963a;box-shadow:0 0 0 3px #2a160c,inset 0 0 0 2px rgba(255,220,150,.16),inset 0 0 70px rgba(0,0,0,.55),0 14px 40px rgba(0,0,0,.6)}
#tgBox.hasbg{background:linear-gradient(rgba(8,8,22,.22),rgba(8,8,22,.42)),url(assets/gems/page/bg.webp) center 38%/cover no-repeat}
#tgBox{inset:30px 8px 8px}   /* the title banner sits half above the box: keep it on screen */
#tgBox h2{width:300px;background:linear-gradient(#83522a,#4a2a14);border:3px solid #e9b44c;box-shadow:0 4px 0 #1a0c06,inset 0 2px 0 rgba(255,220,150,.3);letter-spacing:.5px}
#tgBox h2::before,#tgBox h2::after{content:'✦';position:absolute;top:0;color:#7fe8d8;text-shadow:0 0 6px #3ad8c0;font-size:14px}#tgBox h2::before{left:16px}#tgBox h2::after{right:16px}
#tgX{background:#6a3a1a}
#tgLeft,#tgRight{position:relative;background:linear-gradient(rgba(44,27,15,.9),rgba(22,13,8,.94));border:2px solid #b8873a;border-radius:14px;padding:8px;
  box-shadow:inset 0 0 0 1px rgba(255,220,150,.14),inset 0 10px 24px rgba(255,200,120,.05),0 6px 18px rgba(0,0,0,.5)}
#tgLeft::before,#tgRight::before,#tgLeft::after,#tgRight::after{content:'';position:absolute;width:9px;height:9px;transform:rotate(45deg);background:linear-gradient(135deg,#9ff0e0,#2aa890);box-shadow:0 0 0 2px #6a4a1e,0 0 6px rgba(90,230,200,.6)}
#tgLeft::before,#tgRight::before{left:-6px;top:-6px}#tgLeft::after,#tgRight::after{right:-6px;bottom:-6px}
#tgRight{overflow:hidden}
#tgLeft h3,#tgRight h3{color:#f0d49a;border-bottom-color:#8a6a3a}
${TL?`#totemWin.tot #tgSky,#totemWin.tot #tgFrame{display:none}
#tgBaseI{position:absolute;left:${TL.bx}px;top:${TL.by}px;width:${TL.bw}px;height:${TL.bh}px;pointer-events:none;filter:drop-shadow(0 8px 12px rgba(0,0,0,.55))}
#tgPole{position:absolute;left:${TL.px}px;top:${TL.py}px;width:${TL.pw}px;height:${TL.ph}px;pointer-events:none;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}
#tgPole .tgT{position:absolute;left:0;top:0;width:100%;height:100%;transition:opacity .6s,filter .6s}
#tgPole .tgT.lk{opacity:.3;filter:grayscale(1) sepia(1) hue-rotate(180deg) saturate(2.4) brightness(1.25)}   /* a tier above your level = a pale spirit of the pole, built when you get there */
.tgN.th,.tgN.th.lock{transform:translate(-50%,-50%)}
.tgN.th .ho{position:absolute;inset:20.6%;border-radius:50%;pointer-events:none;transition:box-shadow .15s}
.tgN.th:hover .ho{box-shadow:0 0 0 2px rgba(255,236,170,.75),0 0 12px rgba(255,220,130,.55)}
.tgN.th.sel .ho{box-shadow:0 0 0 3px #ffe14a,0 0 16px 5px rgba(255,225,74,.65)}
.tgN.th.lock .ho{background:radial-gradient(circle,rgba(6,8,22,.35),rgba(6,8,22,.7));box-shadow:inset 0 0 0 1px rgba(160,190,255,.25)}
.tgN.th .lk{top:50%;bottom:auto;transform:translate(-50%,-50%)}
.tgN.th .lvd{bottom:4%}
.tgN.th.ss .in{background:none}`:''}
/* the owner's carved plaque behind both side columns (plq_top / mid / bot = rows 0–460 / 460–1136 / 1136–1536 of his 1024×1536 picture):
   the caps keep their shape, the middle stretches; --s = column width / 1024 (set in fit()); inner wood = x 131–890, y 262–1240.
   Not on short phone screens: the owl and paw caps would eat a third of the height there, so phones keep the plain wood columns. */
@media (min-height:521px){
#tgLeft,#tgRight{--s:.28;background:url(assets/gems/page/plq_top.webp) top center/100% auto no-repeat,url(assets/gems/page/plq_bot.webp) bottom center/100% auto no-repeat,
  url(assets/gems/page/plq_mid.webp) 0 calc(var(--s)*460px)/100% calc(100% - var(--s)*860px + 2px) no-repeat;border:0;border-radius:0;box-shadow:none;
  padding:calc(var(--s)*262px) calc(var(--s)*138px) calc(var(--s)*290px)}
#tgLeft::before,#tgRight::before,#tgLeft::after,#tgRight::after{display:none}
#tgLeft{width:clamp(190px,23vw,330px)}#tgRight{width:clamp(220px,27vw,380px)}
}
#tgSel{background:radial-gradient(ellipse at 30% 50%,rgba(255,210,120,.12),transparent 70%),rgba(0,0,0,.3);border:1px solid rgba(184,135,58,.45)}
#tgInfo{background:linear-gradient(#f8eed6,#ecdcb6);border:2px solid #b8873a;box-shadow:inset 0 0 14px rgba(120,80,30,.22)}
.tgAct{display:flex;flex-direction:column;gap:5px}
#tgWsB{margin:0;background:linear-gradient(#7fe8d8,#2a9a88);color:#0e2a26;border-color:#1a4a40}
.tgTabs{display:grid;grid-template-columns:repeat(4,1fr);gap:3px;margin-top:2px}
.tgTabs button{padding:4px 1px 3px;border-radius:9px 9px 4px 4px;border:1.5px solid #6a4a2a;background:linear-gradient(#4c3220,#2a1a10);color:#e9c98a;font:700 11px/1.15 Mitr,sans-serif;cursor:pointer}
.tgTabs button small{display:block;font:500 9px/1.2 Mitr,sans-serif;opacity:.8}
.tgTabs button.on{background:linear-gradient(#ffd77a,#e9a43c);color:#3a1f14;border-color:#ffe9a8;box-shadow:0 0 8px rgba(255,210,110,.45)}
.tgPane{display:none;flex:1;min-height:0;overflow:auto;flex-direction:column;gap:4px}.tgPane.on{display:flex}
.tgHint{font:500 11px/1.35 Mitr,sans-serif;color:#cdb98a;padding:1px 2px}
.tgInv{background:rgba(0,0,0,.3);border:1px solid rgba(184,135,58,.3);padding:6px;align-content:start}
.tgInv button{background:radial-gradient(circle at 50% 38%,#3c2c20,#150d08);border:1.5px solid #5a3e22;padding:2px;box-shadow:inset 0 2px 5px rgba(0,0,0,.55)}
.tgInv button:hover{border-color:#e9b44c}
@media (max-height:520px){#tgSel{padding:4px 6px;gap:6px}#tgSel .big{width:46px}#tgSel b{font-size:11.5px;line-height:1.25}
  #tgSel small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:10px}   /* phone: a short preview leaves room for the gem card */
  #tgInfo .ln.ln2 .lc button{font-size:9.5px}.cand .cb button{font-size:11px}}
@media (max-height:520px){#tgBox{padding-top:30px;inset:22px 4px 4px}#tgBox h2{height:40px;line-height:36px;font-size:17px;top:-20px}.tgTabs button{font-size:10px}.tgTabs button small{display:none}.tgHint{display:none}}
/* ---- carving (owner 2026-11-21): a sealed hole wears a plug — stone on the base, a wooden peg (end grain rings) on the pole ---- */
.tgN .pl,.tgPl{position:absolute;inset:19.4%;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle at 36% 28%,rgba(255,250,235,.34),transparent 36%),radial-gradient(circle at 64% 72%,rgba(0,0,0,.2),transparent 42%),
    radial-gradient(circle,#a59b8b 0 46%,#7d7467 70%,#544c43 100%);
  box-shadow:inset 0 -2px 4px rgba(0,0,0,.5),inset 0 2px 1px rgba(255,250,235,.3),0 0 0 1px rgba(30,22,14,.55),0 2px 3px rgba(0,0,0,.45)}
.tgN .pl::before,.tgPl::before{content:'';position:absolute;inset:23%;border-radius:50%;border:1.5px solid rgba(46,36,26,.5);box-shadow:0 1px 0 rgba(255,250,235,.22)}
.tgN .pl::after,.tgPl::after{content:'';position:absolute;left:50%;top:16%;bottom:16%;width:1.5px;margin-left:-.75px;background:linear-gradient(rgba(46,36,26,0),rgba(46,36,26,.55) 30%,rgba(46,36,26,.55) 70%,rgba(46,36,26,0));transform:rotate(38deg)}
.tgN.wd .pl,.tgPl.wd{background:radial-gradient(circle at 36% 28%,rgba(255,236,200,.3),transparent 36%),repeating-radial-gradient(circle at 46% 54%,#86592f 0 1.6px,#6d4426 1.6px 3.4px),#6d4426;
  box-shadow:inset 0 -2px 4px rgba(0,0,0,.55),inset 0 2px 1px rgba(255,226,180,.3),0 0 0 1px rgba(30,16,8,.6),0 2px 3px rgba(0,0,0,.45)}
.tgN.wd .pl::before,.tgPl.wd::before{border-color:rgba(40,20,8,.45)}
.tgN.lock .pl{filter:brightness(.55) saturate(.45)}
.tgN.rdy .pl{animation:tgRdy 1.1s ease-in-out infinite alternate}
@keyframes tgRdy{from{outline:1.5px solid rgba(255,216,106,.55);outline-offset:1px;filter:brightness(1)}to{outline:2.5px solid #ffe07a;outline-offset:2px;filter:brightness(1.18) drop-shadow(0 0 6px rgba(255,210,90,.95))}}
.tgN .cvp{position:absolute;left:50%;top:82%;transform:translate(-50%,-50%);padding:0 6px;border-radius:9px;background:rgba(38,22,10,.88);border:1px solid #c9963a;font:700 10px/15px Mitr,sans-serif;color:#ffe9a8;white-space:nowrap;pointer-events:none;z-index:2}
.tgN .cvp.on{background:linear-gradient(#ffe48a,#e9a43c);color:#3a1f14;border-color:#fff3c8;animation:tgGift 1s ease-in-out infinite alternate}
.tgN.ss .cvp{top:50%}
.tgN.mn .cvp{top:66%}
#tgSel .big .tgPl{inset:14%}
#tgBtns button.cv{background:linear-gradient(#ffe48a,#ff9a3a);animation:tgGift 1.1s ease-in-out infinite alternate}
#tgInfo .cvl{margin:4px 0 3px;display:flex;flex-direction:column;gap:2px}
#tgInfo .cvr{display:flex;align-items:center;gap:5px;padding:2px 5px;border-radius:7px;background:rgba(90,170,90,.14);border:1px solid rgba(60,120,60,.22)}
#tgInfo .cvr.no{background:rgba(200,70,50,.1);border-color:rgba(170,60,40,.3)}
#tgInfo .cvi{flex:none;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:14px}#tgInfo .cvi svg,#tgInfo .cvi img{width:22px;height:22px}
#tgInfo .cvn{flex:1;min-width:0;line-height:1.25}#tgInfo .cvn small{font-size:.86em;color:#6a4a2a}#tgInfo .cvs{display:block;font-size:.8em!important;color:#8a6a4a!important;font-weight:400}
#tgInfo .cvr em{font-style:normal;font-weight:700;color:#2a7a3a;white-space:nowrap}#tgInfo .cvr.no em{color:#a8302a}
#tgInfo .cvz{display:inline-flex;width:20px;height:20px;border-radius:50%;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#fff3b0,#e9b44c 55%,#a8741c);color:#5a3a0c!important;font:900 11px sans-serif;box-shadow:0 0 0 1.5px #6a4a1a}
/* skill gems (owner 2026-11-21: skills are extracted into gems before they go on the base): a gem = round + glossy, a raw skill = dim with a ⚗ badge */
#tgSkills button.gx{padding:1px}
.sgem{position:absolute;inset:0;display:block;pointer-events:none}
.sgem .sgi{position:absolute;left:15.8%;top:15.8%;width:68.4%;height:68.4%;border-radius:50%;overflow:hidden;background:#1a1430}
.sgem .sgi img,.sgem .sgi svg{position:absolute!important;left:-16%;top:-16%;width:132%!important;height:132%!important;display:block;border-radius:0!important;transform:none!important}
.sgem .sgi::after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,transparent 58%,rgba(14,8,38,.5) 100%)}
.sgem img.sgf{position:absolute!important;inset:0;width:100%!important;height:100%!important;display:block;border-radius:0!important;transform:none!important}
.sgem img.sgs,.sgem img.sgh{position:absolute!important;left:13.77%;top:13.77%;width:72.46%!important;height:72.46%!important;display:block;border-radius:0!important}   /* shine rim (r 236 of 512) on the window */
.sgem img.sgs{transform:rotate(var(--fa,0deg)) var(--fmx,scale(1))!important}.sgem img.sgh{transform:none!important}
/* C gem with the owner's diamond crown (?gframe=1): icon in the table hole, his table shine, the crown on top */
.sgem.cg .sgi{left:20.1%;top:20.1%;width:59.8%;height:59.8%;border-radius:0;clip-path:polygon(29.29% 0,70.71% 0,100% 29.29%,100% 70.71%,70.71% 100%,29.29% 100%,0 70.71%,0 29.29%)}   /* the table hole (apothem 149.6 of 512), icon tucked under its gold edge */
.sgem.cg .sgi::after{border-radius:0;background:linear-gradient(135deg,rgba(255,255,255,.14),transparent 42%,transparent 60%,rgba(10,6,30,.42))}
.sgem.cg img.sgt{position:absolute!important;left:18.3%;top:18.3%;width:63.39%!important;height:63.39%!important;display:block;border-radius:0!important;transform:var(--fmx,scale(1))!important}
.sgem.cg img.sgf{transform:var(--ftr,scale(1))!important}
.sgem .rgo{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;filter:drop-shadow(0 0 2.5px rgba(var(--rg),.95))}
.sgem .rgo polygon{fill:none;stroke:rgba(var(--rg),.9);stroke-width:1.6;stroke-linejoin:round}.sgem.rq0 .rgo polygon{stroke:rgba(var(--rg),.35)}.sgem.rq0 .rgo{filter:none}
.tgN .in.sg{overflow:visible}.gfr .tgN .in.sg{transform:scale(1.16)}.gfr .tgN .in.sg.cgi{transform:none}   /* framed: the moonstone ring sits over the hole's painted rim */
/* frameless gems = the default (owner 2026-11-21 14:06 'take the frames off, just the gem — the faceted one and the round one'):
   the icon fills the gem, the glass light is added on top (plus-lighter, so it reads over bright icons), a thin dark cartoon outline.
   Skill gem = round glass orb (his shine, facets turned per gem) · C gem = octagonal cut gem (his table shine, mirrored per gem). */
.sgem.nf{isolation:isolate}
.sgem.nf .sgi,.sgem.nf .rgl{left:2%;top:2%;width:96%;height:96%}.sgem.nf .sgi{box-shadow:0 0 0 1.6px rgba(30,15,6,.92)}
.sgem.nf img.sgs,.sgem.nf img.sgh{left:-2.07%;top:-2.07%;width:104.14%!important;height:104.14%!important;mix-blend-mode:plus-lighter}
.sgem.nf .sgi::after{background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.16) 0 22%,transparent 46%),radial-gradient(circle at 50% 46%,transparent 50%,rgba(10,6,30,.58) 100%)}   /* dome shading */
.sgem.nf .rsw{-webkit-mask:radial-gradient(circle closest-side,transparent 0 84%,#000 88% 95%,transparent 98%);mask:radial-gradient(circle closest-side,transparent 0 84%,#000 88% 95%,transparent 98%)}
.sgem.nf.cg .sgi{left:1.76%;top:1.76%;width:96.48%;height:96.48%;box-shadow:none}   /* octagon, apothem 247 of 512 */
.sgem.nf.cg .sgi::after{background:linear-gradient(135deg,rgba(255,255,255,.2),transparent 38%,transparent 58%,rgba(10,6,30,.5)),radial-gradient(circle at 50% 50%,transparent 55%,rgba(10,6,30,.35) 100%)}   /* flat table: light from the upper left */
.sgem.nf.cg img.sgt{left:-2.33%;top:-2.33%;width:104.66%!important;height:104.66%!important;mix-blend-mode:plus-lighter}   /* the shine's rim on the gem's edge */
.sgem.nf .rgo polygon.ol{stroke:rgba(30,15,6,.92);stroke-width:1.1}.sgem.nf .rgo polygon.rl{stroke-width:1.2}
.sgem.nf.cg.rq3 .rsw,.sgem.nf.cg.rq4 .rsw{transform:none;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill-rule='evenodd' d='M98.30 29.99 70.01 1.70 29.99 1.70 1.70 29.99 1.70 70.01 29.99 98.30 70.01 98.30 98.30 70.01Z M91.00 33.02 66.98 9.00 33.02 9.00 9.00 33.02 9.00 66.98 33.02 91.00 66.98 91.00 91.00 66.98Z'/%3E%3C/svg%3E") center/100% 100% no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill-rule='evenodd' d='M98.30 29.99 70.01 1.70 29.99 1.70 1.70 29.99 1.70 70.01 29.99 98.30 70.01 98.30 98.30 70.01Z M91.00 33.02 66.98 9.00 33.02 9.00 9.00 33.02 9.00 66.98 33.02 91.00 66.98 91.00 91.00 66.98Z'/%3E%3C/svg%3E") center/100% 100% no-repeat}
/* rarity light (owner 2026-11-21): glow round the frame + a light ring inside the window in the rarity colour; มหากาพย์ / ตำนาน pulse + a light runs round the ring */
.sgem .rgl{background:none;position:absolute;left:15.8%;top:15.8%;width:68.4%;height:68.4%;border-radius:50%;pointer-events:none;box-shadow:inset 0 0 0 1.5px rgba(var(--rg),.6),inset 0 0 10px 2px rgba(var(--rg),.5)}
.sgem.rq0 .rgl{box-shadow:inset 0 0 7px 1px rgba(var(--rg),.22)}
.sgem.rq1{filter:drop-shadow(0 0 2px rgba(var(--rg),.85))}
.sgem.rq2{filter:drop-shadow(0 0 3px rgba(var(--rg),.95)) drop-shadow(0 0 5px rgba(var(--rg),.45))}
.sgem.rq3{filter:drop-shadow(0 0 3px rgba(var(--rg),1)) drop-shadow(0 0 7px rgba(var(--rg),.6));animation:rqP 2.4s ease-in-out infinite}
.sgem.rq4{filter:drop-shadow(0 0 3px rgba(var(--rg),1)) drop-shadow(0 0 9px rgba(var(--rg),.75));animation:rqL 1.9s ease-in-out infinite}
@keyframes rqP{50%{filter:drop-shadow(0 0 4px rgba(var(--rg),1)) drop-shadow(0 0 11px rgba(var(--rg),.85))}}
@keyframes rqL{50%{filter:drop-shadow(0 0 5px rgba(255,240,190,1)) drop-shadow(0 0 14px rgba(var(--rg),.95))}}
.sgem .rsw{position:absolute;inset:0;border-radius:50%;pointer-events:none;display:none}
.sgem.rq3 .rsw,.sgem.rq4 .rsw{display:block;background:conic-gradient(from 0deg,transparent 0 70%,rgba(var(--rg),.35) 78%,rgba(255,255,255,.95) 83%,rgba(var(--rg),.35) 88%,transparent 95%);
  -webkit-mask:radial-gradient(circle closest-side,transparent 0 66%,#000 69% 93%,transparent 97%);mask:radial-gradient(circle closest-side,transparent 0 66%,#000 69% 93%,transparent 97%);mix-blend-mode:screen;animation:rqS 3s linear infinite}
.sgem.rq3 .rsw{animation-duration:4.6s;opacity:.75}
@property --sw{syntax:'<angle>';inherits:false;initial-value:0deg}
.sgem.cg.rq3 .rsw,.sgem.cg.rq4 .rsw{border-radius:0;background:conic-gradient(from var(--sw),transparent 0 70%,rgba(var(--rg),.35) 78%,rgba(255,255,255,.95) 83%,rgba(var(--rg),.35) 88%,transparent 95%);
  -webkit-mask:var(--om) center/100% 100% no-repeat;mask:var(--om) center/100% 100% no-repeat;transform:var(--ftr,scale(1));animation:rqSw 3s linear infinite}   /* the light runs over the crown only */
.sgem.cg.rq3 .rsw{animation-duration:4.6s}
@keyframes rqSw{to{--sw:360deg}}
@keyframes rqS{to{transform:rotate(360deg)}}
.tgInv button.lock .sgem{filter:grayscale(1) brightness(.5)!important;animation:none!important}.tgInv button.lock .sgem .rsw{display:none}
.tgInv button b.cn{position:absolute;right:-2px;top:-3px;z-index:3;min-width:13px;height:13px;border-radius:7px;background:#e2435a;color:#fff;font:900 9px/13px sans-serif;text-align:center;box-shadow:0 0 0 1.5px #2a0c0c,0 0 6px #ff6a7a;animation:tgGift 1s ease-in-out infinite alternate}
#tgWs .gc .gem .sgem,#tgWs .res .rgem .sgem{position:absolute;inset:0}
#tgWs .res .rgem{position:relative;width:52px;height:52px;flex:none}
#tgInfo .lnh{margin-top:5px;font-size:.95em}#tgInfo .lnh small{opacity:.7}
#tgInfo .ln.st{background:rgba(120,200,255,.18)}
#tgInfo .ln.ln2{display:grid;grid-template-columns:auto 1fr;column-gap:5px;row-gap:1px;align-items:start}#tgInfo .ln.ln2>i{padding-top:1px}
#tgInfo .ln.ln2 .lc{grid-column:2;display:flex;gap:8px;justify-content:flex-end;align-items:center}#tgInfo .ln.ln2 .lc button,.cand .cb button{white-space:nowrap}
#tgSel small b{white-space:nowrap}
#tgInfo .sgc{margin:4px 0;padding:5px 6px;border-radius:9px;background:rgba(255,255,255,.45);border:1.5px solid rgba(160,120,60,.45)}
#tgInfo .sgc .up{font-size:.92em}
#tgInfo .ic{display:inline-flex;align-items:center;gap:1px;font-weight:700;font-size:.92em;color:#3a1f14;vertical-align:middle}#tgInfo .ic.no{color:#b8302a}#tgInfo .ic img,#tgInfo .ic svg{width:18px;height:18px}
.cand{margin:5px 0;padding:6px;border-radius:9px;background:rgba(40,24,60,.88);color:#f4ecff;border:1.5px solid #c9a0ff;box-shadow:0 0 10px rgba(193,123,255,.45);font-size:.95em}
.cand b{color:#ffe9a8!important}.cand .cl{margin:3px 0;line-height:1.45}.cand .cl i{font-style:normal;font-weight:700;color:#ffd27a;margin-right:2px}.cand .cl b{color:#fff!important}
.cand .cb{display:flex;gap:6px;margin-top:4px}.cand .cb button{flex:1;padding:4px 0;border-radius:9px;border:2px solid #5a2e16;background:linear-gradient(#ffd77a,#e9a43c);font:700 12px Mitr,sans-serif;color:#3a1f14;cursor:pointer}
.cand .cb button[data-cand="0"]{background:linear-gradient(#e8e2f2,#b8aecb)}
.gmk.hi::before{animation:gmkHi 1.6s ease-in-out infinite alternate}@keyframes gmkHi{to{box-shadow:0 0 0 1.5px #2a1a0c,0 0 11px var(--rc,var(--c))}}
.tgN.th.sel .in.sg{filter:drop-shadow(0 0 5px #ffe14a) drop-shadow(0 0 2px #fff17a)}
#tgSkills button.nx img,#tgSkills button.nx svg{filter:saturate(.45) brightness(.72)}
#tgSkills button .xb{position:absolute;left:-3px;top:-3px;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 10px/1 sans-serif;
  background:#3a2a1a;border:1.5px solid #c9963a;color:#ffe9a8;box-shadow:0 1px 2px rgba(0,0,0,.6);z-index:2}
#tgSkills button.rdy .xb{background:linear-gradient(#ffe48a,#e9a43c);color:#3a1f14;animation:tgGift 1s ease-in-out infinite alternate}
#tgSkills button.pop{animation:tgPop .55s ease-out}
/* the plug splits, drops out and the hole flashes open */
.tgCrk{position:absolute;transform:translate(-50%,-50%);pointer-events:none;z-index:6}
.tgCrk>i{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 36% 28%,rgba(255,250,235,.34),transparent 36%),radial-gradient(circle,#a59b8b 0 46%,#7d7467 70%,#544c43 100%);
  box-shadow:inset 0 -2px 4px rgba(0,0,0,.5);animation:tgCrkA .75s cubic-bezier(.35,.1,.6,1) var(--dl) both}
.tgCrk.wd>i{background:repeating-radial-gradient(circle at 46% 54%,#86592f 0 1.6px,#6d4426 1.6px 3.4px),#6d4426}
.tgCrk>i.a{clip-path:polygon(0 0,57% 0,45% 46%,55% 100%,0 100%);--x:-1}.tgCrk>i.b{clip-path:polygon(57% 0,100% 0,100% 100%,55% 100%,45% 46%);--x:1}
@keyframes tgCrkA{0%{transform:none;opacity:1}18%{transform:translateX(calc(var(--x)*2px)) rotate(calc(var(--x)*5deg));opacity:1}100%{transform:translate(calc(var(--x)*60%),110%) rotate(calc(var(--x)*48deg));opacity:0}}
.tgCrk>b.f{position:absolute;inset:-70%;border-radius:50%;background:radial-gradient(circle,rgba(255,246,210,.95),rgba(255,214,120,.55) 32%,rgba(255,190,90,0) 64%);opacity:0;animation:tgCrkF .7s ease-out calc(var(--dl) + .12s) both;mix-blend-mode:screen}
@keyframes tgCrkF{0%{opacity:0;transform:scale(.35)}28%{opacity:1}100%{opacity:0;transform:scale(1.3)}}
.tgCrk>s{position:absolute;left:50%;top:50%;width:4px;height:3px;margin:-1.5px -2px;background:#8d8476;border-radius:1px;box-shadow:0 0 0 .5px rgba(0,0,0,.4);animation:tgCrkS .8s cubic-bezier(.2,.6,.4,1) var(--dl) both}
.tgCrk.wd>s{background:#7a4e2c}
@keyframes tgCrkS{0%{transform:rotate(var(--a)) translateX(0)}100%{transform:rotate(var(--a)) translateX(var(--d)) rotate(160deg);opacity:0}}
/* ---- totem pages (owner 2026-11-21): 3 bookmark tabs on top of the left column; tap the active one = its card (rename, copy) ---- */
#tgPg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px;padding-bottom:3px;border-bottom:1.5px solid #8a6a3a}
#tgPg button{min-width:0;padding:3px 2px 2px;border-radius:9px 9px 4px 4px;border:1.5px solid #6a4a2a;background:linear-gradient(#4c3220,#2a1a10);color:#e9c98a;font:700 12px/1.2 Mitr,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#tgPg button small{display:block;font:500 9px/1.15 Mitr,sans-serif;opacity:.75}
#tgPg button.on{background:linear-gradient(#ffd77a,#e9a43c);color:#3a1f14;border-color:#ffe9a8;box-shadow:0 0 8px rgba(255,210,110,.45)}
#tgPg button.on small::after{content:' · ✎'}
#tgPg button.wait{opacity:.6}
@keyframes tgPgSw{0%{filter:brightness(1.55) saturate(1.25) drop-shadow(0 0 18px rgba(255,220,130,.9))}100%{filter:none}}
#tgBoard.pgsw{animation:tgPgSw .75s ease-out}
#tgInfo .pgr{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:4px 0}
#tgInfo .pgr input{flex:1;min-width:70px;font:600 12px Mitr,sans-serif;padding:2px 6px;border-radius:7px;border:1.5px solid #b8873a;background:#fffaf0;color:#3a1f14}
#tgInfo .pgr button{border:1.5px solid #5a2e16;border-radius:8px;background:linear-gradient(#ffd77a,#e9a43c);font:700 11px Mitr,sans-serif;color:#3a1f14;cursor:pointer;padding:2px 8px}
#tgInfo .pgr button.arm{background:linear-gradient(#ffb0a0,#e2604a);color:#fff}
#tgInfo .pgo{margin:2px 0 4px;padding:3px 6px;border-radius:7px;background:rgba(201,164,106,.16);font-size:.93em;color:#5a3a1a}
/* ---- resonance / balance: badges on the board's top right, a status line in the mutation tab, marks on gems and skill buttons ---- */
#tgRes{position:absolute;right:4px;top:4px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:4px}
#tgRes .rh{width:30px;height:30px;border-radius:50%;border:2px solid #8a6a3a;background:radial-gradient(circle at 40% 35%,#4a3a2a,#1a120c);color:#fff;font:14px/1 sans-serif;cursor:pointer;opacity:.55;box-shadow:0 2px 6px rgba(0,0,0,.5)}
#tgRes.on .rh{opacity:1;border-color:#9fe8ff;box-shadow:0 0 10px rgba(120,220,255,.7),0 2px 6px rgba(0,0,0,.5);animation:tgGift 1.4s ease-in-out infinite alternate}
#tgRes.bl .rh{border-color:#ffd86a;box-shadow:0 0 10px rgba(255,216,106,.75),0 2px 6px rgba(0,0,0,.5)}
#tgRes .rl{display:flex;flex-direction:column;gap:4px;align-items:center}
#tgRes .rb{position:relative;width:26px;height:26px;cursor:pointer;filter:drop-shadow(0 0 4px var(--c))}
#tgRes .rb .tgSg{inset:0}
#tgRes .rb i{position:absolute;right:-6px;bottom:-4px;font:900 9px/12px sans-serif;font-style:normal;color:#fff;background:#1a3a5a;border-radius:6px;padding:0 3px;box-shadow:0 0 0 1px #9fe8ff}
#tgRes .rb.bal{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:16px/1 sans-serif;background:radial-gradient(circle at 40% 35%,#fff3c0,#e9a43c 60%,#8a5a1a);--c:#ffd86a}
#tgRes .rb.bal i{background:#5a3a0c;box-shadow:0 0 0 1px #ffd86a}
.tgRsb{display:block;width:100%;text-align:left;border:1.5px solid rgba(159,232,255,.35);border-radius:9px;background:rgba(20,40,60,.55);color:#cfefff;font:500 11px/1.35 Mitr,sans-serif;padding:4px 7px;cursor:pointer}
.tgRsb b{color:#fff}.tgRsb.on{border-color:#9fe8ff;box-shadow:0 0 8px rgba(120,220,255,.35)}.tgRsb.bl{border-color:#ffd86a;background:rgba(60,44,12,.6);color:#ffefc0;box-shadow:0 0 8px rgba(255,216,106,.35)}
.tgInv button b.rsb{position:absolute;left:-3px;top:-4px;z-index:3;font:11px/1 sans-serif;filter:drop-shadow(0 0 3px #5ad1ff)}.tgInv button b.rsb.bl{filter:drop-shadow(0 0 3px #ffd86a)}
#tgInfo .rsT{color:#1a7ab8}#tgInfo .blT{color:#a8741c}
#tgInfo .rsx{margin:5px 0 2px;padding:4px 6px;border-radius:8px;background:rgba(90,180,230,.13);border:1px solid rgba(60,140,200,.3);font-size:.93em}
#tgInfo .rsx.on{background:rgba(90,180,230,.25);border-color:rgba(60,140,200,.6)}
#tgInfo .rst{display:grid;grid-template-columns:auto 1fr;gap:1px 6px;align-items:center;margin-top:4px;font-size:.9em}
#tgInfo .rst .gi{position:relative;width:20px;height:20px}#tgInfo .rst .gi .tgSg{inset:0;font-size:9px}
#tgInfo .rst div{line-height:1.3;padding:1px 0;border-bottom:1px dashed rgba(160,120,60,.3)}#tgInfo .rst div.on{background:rgba(90,180,230,.2)}
.gmk.rs::after,.gmk.bl::after{content:'';position:absolute;inset:-2px;border-radius:50%;pointer-events:none}
.gmk.rs::after{box-shadow:0 0 0 1.5px #e8fbff,0 0 8px 1px var(--c);animation:gmkRs 1.1s ease-in-out infinite alternate}
.gmk.bl::after{box-shadow:0 0 0 1.5px #ffd86a,0 0 7px #ffd86a}
@keyframes gmkRs{to{box-shadow:0 0 0 2px #fff,0 0 13px 3px var(--c)}}
@media (max-height:520px){#tgPg button{font-size:11px;padding:2px 1px}#tgPg button small{display:none}#tgPg button.on::after{content:' ✎';font-size:9px}#tgRes .rh{width:26px;height:26px;font-size:12px}#tgRes .rb{width:22px;height:22px}}
`;document.head.appendChild(css);
const GFRAME=/[?&]gframe=1/.test(location.search);   /* owner 2026-11-21 14:06: no frames by default; ?gframe=1 = the framed look (moonstone ring / his diamond crown) */
const win=document.createElement('div');win.id='totemWin';if(HERO!=='wolf')win.classList.add('nw');if(GFRAME)win.classList.add('gfr');
win.innerHTML=`<div id="tgBox"><h2>ศาลวิญญาณโทเท็ม</h2><button id="tgX">✕</button>
<div id="tgLeft"><div id="tgPg">${[0,1,2].map(i=>`<button data-pg="${i}"></button>`).join('')}</div><div id="tgSel"></div><div id="tgInfo"></div><div id="tgBtns"><button id="tgOut">ถอดออก</button><button id="tgUp">อัปเลเวล</button></div></div>
<div id="tgMid"><div id="tgScr"><div id="tgZoom"><div id="tgBoard"><img id="tgSky" src="${PG}sky.webp" alt="">${TL?`<img id="tgBaseI" src="${PG}${TOT.base.src}.webp" alt=""><div id="tgPole">${[0,1,2,3,4].map(i=>`<img class="tgT" data-t="${i}" src="${PG}${TOT.pole.src}.webp" alt="" style="clip-path:inset(${i<4?TL.ct[i]-.5:0}px 0 ${i?TL.ph-TL.ct[i-1]-.5:0}px 0)">`).join('')}</div>`:''}<canvas id="tgLines" width="${BS*2}" height="${BS*2}"></canvas><canvas id="tgRing" width="${BS*2}" height="${BS*2}"></canvas><img id="tgFrame" src="${PG}ring.webp" alt=""></div></div></div><div id="tgRes"><button class="rh" title="เรโซแนนซ์ / สมดุล ของเจมแปรสภาพ">🔗</button><div class="rl"></div></div><div id="tgWs"></div></div>
<div id="tgRight"><div class="tgAct"><button id="tgGiftB" style="display:none"></button><button id="tgWsB">⛏ แกะ · คราฟต์ · ย่อยเจม</button></div>
<div class="tgTabs"><button data-tab="sk">⭐ สกิล<small></small></button><button data-tab="gem">💠 เจม C<small></small></button><button data-tab="mut">🔶 แปรสภาพ<small></small></button><button data-tab="sup">🔹 เสริม<small></small></button></div>
<div class="tgPane" data-pane="sk"><div class="tgHint">${TL?'สกิลที่เรียนแล้ว → ⚗ สกัดเป็นเจม (ครั้งแรกฟรี) → วางในหลุมบนแท่นหิน (Lv '+SS_LV.join(' / ')+')':'สกิลที่เรียนแล้ว → วางบนดาวเงินวงใน (เปิด Lv '+SS_LV.join(' / ')+')'}</div><div class="tgInv" id="tgSkills"></div></div>
<div class="tgPane" data-pane="gem"><div class="tgHint">${TL?'เจมหลัก = สกิล C → หลุมใหญ่กลางชั้นเสา (ชั้นเปิด Lv 60 / 70 / 80 / 90 / 99)':'เจมหลัก = สกิล C → ดาวทองวงนอก (เปิด Lv 60–99)'}</div><div class="tgInv" id="tgGems"></div></div>
<div class="tgPane" data-pane="mut"><div class="tgHint">${TL?'ได้อย่าง เสียอย่าง · หลุมด้านในปีกเสา หรือหลุมเล็กข้างหลุมสกิล':'ได้อย่าง เสียอย่าง · ใส่ได้ทั้งดาวสกิลและดาว C'}</div><button class="tgRsb" id="tgRsb"></button><div class="tgInv" id="tgMuts"></div></div>
<div class="tgPane" data-pane="sup"><div class="tgHint">${TL?(SSU.length?'หลุมนอกปีกเสา · หลุมขอบเขียวใต้หลุมสกิล (ผลครึ่งหนึ่ง) — หลุมเสริมทุกหลุมต้องสลักเปิดก่อน':'หลุมด้านนอกปีกเสา (สลักเปิดทีละหลุม)'):'ใส่ได้เฉพาะดาว C (สลักเปิดช่องทีละช่อง)'}</div><div class="tgInv" id="tgSups"></div></div></div></div>`;
document.body.appendChild(win);
if(TL)win.classList.add('tot');
const box=win.querySelector('#tgBox'),board=win.querySelector('#tgBoard'),lines=win.querySelector('#tgLines'),ringC=win.querySelector('#tgRing');
{const bg=new Image();bg.onload=()=>box.classList.add('hasbg');bg.src='assets/gems/page/bg.webp';}   /* the painted shrine background, once it exists */
let tab='sk';
function setTab(t){tab=t;win.querySelectorAll('.tgTabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));win.querySelectorAll('.tgPane').forEach(p=>p.classList.toggle('on',p.dataset.pane===t));}
win.querySelectorAll('.tgTabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
win.addEventListener('pointerdown',e=>{if(e.target===win)close();});win.querySelector('#tgX').onclick=()=>close();

/* ---------- constellation lines (dim when locked, lit when open, gold when both ends hold a gem) ---------- */
const STARS=Array.from({length:70},(_,i)=>{const a=Math.sin(i*12.9898)*43758.5453,b=Math.sin(i*78.233)*12345.678,r=Math.sqrt(a-Math.floor(a))*HR*1.02,q=(b-Math.floor(b))*6.283;return {x:HX+Math.cos(q)*r,y:HY+Math.sin(q)*r,s:.6+((a*7)%1+1)%1*1.4,p:i*1.7};});
function drawLines(t){const g=lines.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,BS,BS);
  if(TL){totGlow(g,t);resGlow(g,t);return;}
  {g.save();for(const st of STARS){const a=(.2+.5*Math.max(0,Math.sin(t*1.3+st.p)))*(st.s>1.6?1:.7);g.globalAlpha=a;g.fillStyle='#fff';g.shadowColor='#bfe0ff';g.shadowBlur=4;
    g.beginPath();g.arc(st.x,st.y,st.s,0,7);g.fill();if(st.s>1.6){g.fillRect(st.x-st.s*2.2,st.y-.35,st.s*4.4,.7);g.fillRect(st.x-.35,st.y-st.s*2.2,.7,st.s*4.4);}}g.restore();}
  const seg=(a,b,state,ph)=>{g.save();g.lineCap='round';
    if(state===0){g.strokeStyle='rgba(160,170,210,.22)';g.lineWidth=1.5;g.setLineDash([3,5]);}
    else if(state===1){g.strokeStyle='rgba(190,220,255,.6)';g.lineWidth=2;g.shadowColor='#9fd8ff';g.shadowBlur=6;}
    else{g.strokeStyle='rgba(255,236,160,.95)';g.lineWidth=2.6;g.shadowColor='#ffd86a';g.shadowBlur=12;}
    g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
    if(state){/* a little star of light runs along every lit line */const L=Math.hypot(b.x-a.x,b.y-a.y),f=(t*34/Math.max(40,L)+(ph||0))%1,x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f,r=state===2?4.2:3.2;
      g.setLineDash([]);g.globalAlpha=Math.sin(f*Math.PI);g.fillStyle=state===2?'#fff6c8':'#eaf6ff';g.shadowColor=state===2?'#ffd86a':'#9fd8ff';g.shadowBlur=10;
      g.beginPath();for(let q=0;q<8;q++){const an=q*Math.PI/4,rr=q%2?r*.32:r;g.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr);}g.closePath();g.fill();}
    g.restore();};
  for(let i=0;i<NS-1;i++){const s=!sockOpen(i+1)?0:(D.sock[i]&&D.sock[i+1])?2:1;seg(MAIN[i],MAIN[i+1],s,i*.29);}
  for(let i=0;i<NS;i++){const k=D.sock[i];if(!k||!sockOpen(i))continue;MODS[i].forEach((p,j)=>{if(!p||(j===3&&!modOpen(i,j)&&!(D.mods[k]||[])[j]))return;const on=modOpen(i,j);seg(MAIN[i],p,!on?0:(D.mods[k]||[])[j]?2:1,i*.17+j*.31);});}
  /* skill-star path: Lv 10 → 50 round the inner ring, then out to the first C star */
  for(let i=0;i<NSS-1;i++)seg(SSP[i],SSP[i+1],!ssOpen(i+1)?0:(D.ss[i]&&D.ss[i+1])?2:1,.5+i*.23);
  seg(SSP[NSS-1],MAIN[0],!sockOpen(0)?0:(D.ss[NSS-1]&&D.sock[0])?2:1,.9);
  const light=(p,r,rgb,a,ph)=>{g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(p.x,p.y,r*.15,p.x,p.y,r);
    gr.addColorStop(0,`rgba(${rgb},${a})`);gr.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r,0,7);g.fill();
    for(let q=0;q<4;q++){const an=q*Math.PI/2+Math.PI/4+Math.sin(t*.3+ph)*.08,L=r*(1.05+.12*Math.sin(t*1.7+ph+q)),lg=g.createLinearGradient(p.x,p.y,p.x+Math.cos(an)*L,p.y+Math.sin(an)*L);
      lg.addColorStop(0,`rgba(${rgb},${a*.9})`);lg.addColorStop(1,`rgba(${rgb},0)`);g.strokeStyle=lg;g.lineWidth=1.6;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+Math.cos(an)*L,p.y+Math.sin(an)*L);g.stroke();}
    g.restore();};
  for(let i=0;i<NSS;i++)if(ssOpen(i))light(SSP[i],SZ.skill*.78,D.ss[i]?'200,230,255':'150,190,255',(D.ss[i]?.38:.16)*(.85+.15*Math.sin(t*2.2+i)),i);
  for(let i=0;i<NS;i++)if(sockOpen(i))light(MAIN[i],SZ.main*.82,D.sock[i]?'255,226,150':'170,200,255',(D.sock[i]?.4:.16)*(.85+.15*Math.sin(t*2+i)),i+5);
  resGlow(g,t);}
/* resonance: a glowing thread joins the two holes of a pair, two sparks run along it · balance: a gold halo breathes round every working mutation hole */
function mutHoles(){const out=[],LV=G('LV')||{};
  D.sock.forEach((k,i)=>{if(!k||!sockOpen(i)||!LV[k])return;const m=D.mods[k]||[];[0,3].forEach(j=>{const id=m[j],p=MODS[i][j];if(id&&p&&modOpen(i,j))out.push({id,p,r:p.r||SZ.mut/2});});});
  D.ss.forEach((k,i)=>{const id=D.sm[i],p=SMP[i];if(id&&p&&ssAct(i))out.push({id,p,r:p.r||SZ.smut/2});});return out;}
function resGlow(g,t){if(!RES.tot||window.__RESO_OFF)return;const H=mutHoles();g.save();
  if(BAL())for(const h of H){/* balance: a white-gold ring of light turns slowly round every working mutation hole */
    const R=Math.max(9,h.r*1.9),a=.65+.25*Math.sin(t*2.2+h.p.x*.05);g.globalCompositeOperation='lighter';
    const gr=g.createRadialGradient(h.p.x,h.p.y,h.r*.6,h.p.x,h.p.y,R*1.35);gr.addColorStop(0,'rgba(255,216,106,.55)');gr.addColorStop(1,'rgba(255,216,106,0)');
    g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(h.p.x,h.p.y,R*1.35,0,7);g.fill();
    g.setLineDash([R*.55,R*.35]);g.lineDashOffset=-t*R*.9;g.strokeStyle='#fff2b8';g.lineWidth=1.8;g.shadowColor='#ffd86a';g.shadowBlur=8;g.beginPath();g.arc(h.p.x,h.p.y,R,0,7);g.stroke();g.setLineDash([]);}
  let n=0;for(const id of RES.on){const ps=H.filter(h=>h.id===id).slice(0,2);if(ps.length<2)continue;const a=ps[0].p,b=ps[1].p,c=MUTD[id][3];
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;let cx,cy;
    /* side by side (the base): hangs down like a garland, each pair a little deeper so crossing pairs stay apart · one above the other (the wings): bows outward */
    if(Math.abs(dx)>=Math.abs(dy)){cx=mx;cy=my+L*(.2+.09*(n%3));}else{cx=mx+(mx<HX?-1:1)*L*(.24+.06*(n%3));cy=my;}n++;
    const pt=f=>({x:(1-f)*(1-f)*a.x+2*(1-f)*f*cx+f*f*b.x,y:(1-f)*(1-f)*a.y+2*(1-f)*f*cy+f*f*b.y}),pulse=.8+.2*Math.sin(t*3+n);
    g.globalCompositeOperation='source-over';g.beginPath();g.moveTo(a.x,a.y);g.quadraticCurveTo(cx,cy,b.x,b.y);
    g.globalAlpha=.55;g.strokeStyle='rgba(20,10,30,.9)';g.lineWidth=5.5;g.shadowBlur=0;g.stroke();   /* a dark under-line keeps the thread readable on the bright stone */
    g.globalCompositeOperation='lighter';g.globalAlpha=.85*pulse;g.strokeStyle=c;g.lineWidth=3.6;g.shadowColor=c;g.shadowBlur=12;g.stroke();
    g.globalAlpha=.9*pulse;g.strokeStyle='#fff';g.lineWidth=1.2;g.shadowBlur=4;g.stroke();
    for(const q of [a,b]){const R=Math.max(14,(ps[0].r||10)*2.4),gr=g.createRadialGradient(q.x,q.y,1,q.x,q.y,R);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');
      g.globalAlpha=.55*pulse;g.shadowBlur=0;g.fillStyle=gr;g.beginPath();g.arc(q.x,q.y,R,0,7);g.fill();}
    for(const f0 of [(t*.45)%1,1-(t*.45)%1]){const p=pt(f0);g.globalAlpha=Math.sin(f0*Math.PI);g.fillStyle='#fff';g.shadowColor=c;g.shadowBlur=10;g.beginPath();
      for(let q=0;q<8;q++){const an=q*Math.PI/4,rr=q%2?1.4:4.2;g.lineTo(p.x+Math.cos(an)*rr,p.y+Math.sin(an)*rr);}g.closePath();g.fill();}
    {/* the kind's symbol rides the middle of the thread */const p=pt(.5);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.shadowColor=c;g.shadowBlur=8;
      g.fillStyle='#1a1026';g.beginPath();g.arc(p.x,p.y,7,0,7);g.fill();g.shadowBlur=0;g.lineWidth=1.6;g.strokeStyle=c;g.stroke();
      g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(MUTD[id][2],p.x,p.y+.5);}}
  g.restore();}
/* totem: soft light in every hole that holds a gem, a faint call in empty open holes, motes rising up the built part of the pole */
function totGlow(g,t){const light=(p,r,rgb,a)=>{g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(p.x,p.y,r*.12,p.x,p.y,r);
    gr.addColorStop(0,`rgba(${rgb},${a})`);gr.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r,0,7);g.fill();g.restore();},w=q=>.82+.18*Math.sin(t*2.1+q);
  let top=null;
  for(let i=0;i<NS;i++){if(!sockOpen(i))continue;const k=D.sock[i];top=MAIN[i].y;
    light(MAIN[i],MAIN[i].r*(k?2.6:1.9),k?'255,222,140':'150,200,255',(k?.36:.13)*w(i));
    if(k)MODS[i].forEach((q,j)=>{if((D.mods[k]||[])[j])light(q,q.r*2.5,isMutJ(j)?'255,170,90':'120,220,255',.3*w(i+j));});}
  for(let i=0;i<NSS;i++){if(!ssOpen(i))continue;light(SSP[i],SSP[i].r*(D.ss[i]?2.4:1.8),D.ss[i]?'200,230,255':'150,190,255',(D.ss[i]?.3:.12)*w(i+3));if(D.sm[i])light(SMP[i],SMP[i].r*2.5,'255,170,90',.28*w(i));
    if(SSU[i])(D.ssu[i]||[]).forEach((x,j)=>{if(x)light(SSU[i][j],SSU[i][j].r*2.5,'120,220,255',.26*w(i+j+1));});}
  if(top!=null){const y0=TL.py+TOT.pole.foot*TL.sp,span=y0-top+30;g.save();g.globalCompositeOperation='lighter';
    for(let n=0;n<14;n++){const f=((t*.09+n/14)%1),y=y0-f*span,x=HX+Math.sin(n*2.3+t*.7)*TL.pw*.12,a=Math.sin(f*Math.PI)*.7;
      g.globalAlpha=a;g.fillStyle='#fff3c8';g.shadowColor='#ffd86a';g.shadowBlur=8;g.beginPath();g.arc(x,y,1.3+(n%3)*.5,0,7);g.fill();}g.restore();}}
/* ---------- rotating rune ring between sky and frame ---------- */
let spin=0,boost=0;const RUNES='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
/* painted ring shared by every hero (assets/gems/board/ring.webp): when it exists it is turned instead of the code ring */
const ringImg=new Image();let ringOK=false;ringImg.onload=()=>{ringOK=true;};ringImg.src=BD+'ring.webp';
const SHOW_RING=false;   /* owner 2026-11-19: inner rune ring off — sky reaches the wooden frame */
function drawRing(dt){const g=ringC.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,BS,BS);if(!SHOW_RING)return;
  boost=Math.max(0,boost-dt*.6);spin+=dt*(.06+boost*1.6);const R=HR*.94,glow=.35+boost*.65;
  if(ringOK){const sc=(FR+2*K)/506.5;g.save();g.translate(HX,HY);g.rotate(spin);   /* ring art: outer circle centre 510.4,511.3 r 506.5 (of 1024) */g.shadowColor=boost>0?'#7fe8ff':'rgba(0,0,0,.55)';g.shadowBlur=boost>0?18*boost:8;   /* outer edge tucks just under the frame's inner rim (≈362 px of 1254) */g.drawImage(ringImg,-510.4*sc,-511.3*sc,1024*sc,1024*sc);g.restore();return;}
  g.save();g.translate(HX,HY);g.rotate(spin);
  g.strokeStyle=`rgba(233,180,76,${.55+boost*.4})`;g.lineWidth=2;g.beginPath();g.arc(0,0,R,0,7);g.stroke();g.beginPath();g.arc(0,0,R-17,0,7);g.stroke();
  for(let q=0;q<96;q++){const a=q/96*Math.PI*2,l=q%8===0?7:3;g.beginPath();g.moveTo(Math.cos(a)*R,Math.sin(a)*R);g.lineTo(Math.cos(a)*(R-l),Math.sin(a)*(R-l));g.stroke();}
  g.font='bold 11px serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=`rgba(150,240,255,${glow})`;g.shadowColor='#7fe8ff';g.shadowBlur=6+boost*10;
  for(let q=0;q<24;q++){const a=q/24*Math.PI*2;g.save();g.rotate(a);g.translate(0,-(R-9));g.fillText(RUNES[q],0,0);g.restore();}
  g.restore();}
let raf=0,last=0,pgT=0;function loop(ts){if(!win.classList.contains('open'))return;const dt=Math.min(.05,(ts-last)/1000||0);last=ts;drawRing(dt);drawLines(ts/1000);
  if(ts-pgT>500){pgT=ts;try{pgBar();}catch(e){}}   /* the page tabs dim while you are still fighting outside a town */
  raf=requestAnimationFrame(loop);}

/* ---------- render ---------- */
let sel=null,popK=null;   // {gem:k} | {mut:id} | {sup:id} | {sock:i} | {mod:[i,j]}
const info=h=>{win.querySelector('#tgInfo').innerHTML=h;};
const qTag=q=>`<span class="q" style="background:${QUAL[q||0].c};white-space:nowrap">${QUAL[q||0].n}</span>`;
const gemPowOf=lv=>GD?GD.gemPow(lv||1):.03*((lv||1)-1);
function preview(){const e=win.querySelector('#tgSel');if(!e)return;const S=G('SKILLS');let k=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock])),art='',nm='';
  if(k){const o=D.own[k]||{};art=cgemHtml(k);nm=S[k].name+`<br><small style="font-weight:500;color:#e9c98a">เจมขั้น ${S[k].tier} · Lv ${o.lv||0}/${CAP}${o.lv?' · '+QUAL[o.q||0].n:''}</small>`;}
  else if(sel&&(sel.mut||sel.sup)){const id=sel.mut||sel.sup;art=sg(id,sel.mut?'mut':'sup');nm=(sel.mut?MUTD:SUPD)[id][1]+`<br><small style="font-weight:500;color:#e9c98a">${sel.mut?'เจมแปรสภาพ':'เจมเสริม'}</small>`;}
  else if(sel&&sel.mod){const kk=D.sock[sel.mod[0]],id=kk&&(D.mods[kk]||[])[sel.mod[1]];if(id){const m=isMutJ(sel.mod[1]);art=sg(id,m?'mut':'sup');nm=(m?MUTD:SUPD)[id][1];}}
  else if(sel&&sel.sm!=null&&D.sm[sel.sm]){const id=D.sm[sel.sm];art=sg(id,'mut');nm=MUTD[id][1]+`<br><small style="font-weight:500;color:#e9c98a">แปรสภาพในดาวสกิล ${sel.sm+1}</small>`;}
  else if(sel&&(sel.skill||(sel.ss!=null&&D.ss[sel.ss])||(sel.sm!=null&&D.ss[sel.sm]))){const sk=sel.skill||D.ss[sel.ss!=null?sel.ss:sel.sm],s=S[sk];
    if(s){const gx=extracted(sk),g=gx&&sgo(sk);art=gx?sgemHtml(sk):skArt(sk);nm=s.name+`<br><small style="font-weight:500;color:#e9c98a">${gx?`เจมสกิล <b style="color:${QUAL[g?g.q:0].c}">${QUAL[g?g.q:0].n}</b>${g?' Lv '+g.lv:''}`:'ยังไม่ได้สกัด'} · สาย ${BRN[s.br]||s.br} · Lv สกิล ${(G('LV')||{})[sk]||0}${sel.ss!=null?(TL?' · หลุมสกิล ':' · ดาวสกิล ')+(sel.ss+1):''}</small>`;}}
  if(sel&&sel.carve){const h=hole(sel.carve),st=cvState(sel.carve);art=`<span class="tgPl${h.t==='p'||h.t==='q'?' wd':''}"></span>`;
    nm=h.nm+`<br><small style="font-weight:500;color:#e9c98a">${st==='open'?'สลักแล้ว':st==='lv'?'เปิดที่ Lv '+h.lv:st==='par'?'สลักหลุมใหญ่ของมันก่อน':st==='rdy'?'ของครบ — สลักได้!':'ยังไม่ได้สลัก · ของยังไม่ครบ'}</small>`;}
  e.innerHTML=art?`<div class="big">${art}</div><b>${nm}</b>`:'<b style="opacity:.6;font-weight:500">แตะเจมหรือดาวเพื่อดูรายละเอียด</b>';}
function lvNeed(o){const l=o.lv||1;return {ess:C.lvEss?C.lvEss(l):0,z:C.lvZ?C.lvZ(l):0,dup:BRK[l]||0};}
function gemInfo(k){const S=G('SKILLS')[k],o=D.own[k],LD=GD?GD.LND:{};
  let h=`<b>${S.name}</b> · เจมขั้น ${S.tier} · สาย ${colName(k)}<br>${S.th||''}<br><span style="opacity:.75">ใส่ได้ตั้งแต่ Lv ${TIER_LV[S.tier]} · เงื่อนไขสกิล: ${S.rq||'-'}</span><br><span style="color:#2a5a8a">แปรสภาพ/เจมเสริม/บรรทัด มีผลกับ: ${tgtName(targetOf(k))} · พลังท่านั้น ×${(1+gemPowOf(o&&o.lv)).toFixed(3)} (เลเวลเจม)</span>`;
  if(!o)return h+'<br><i>ยังไม่มีเจมนี้ — แกะหินโทเท็มขั้น '+S.tier+' (สุ่มชนิด) หรือคราฟต์จากชิ้นส่วนที่ศาลโทเท็ม</i>';
  const nd=lvNeed(o),max=o.lv>=CAP;
  h+=`<br>${qTag(o.q)} เลเวลเจม <b>${o.lv}/${CAP}</b> · เจมซ้ำ ${o.dup||0} · ${o.lv>=CAP?'หลุมแปรสภาพที่ 2 เปิดแล้ว':`หลุมแปรสภาพที่ 2 เปิดที่ Lv ${CAP}`}`;
  h+=max?'<br><span class="g">เลเวลตันแล้ว (อัปเดตหน้าจะเพิ่มเลเวลตัน)</span>':`<br>อัปเลเวลถัดไป: แก่นโทเท็ม ${nd.ess} (มี ${fmtN(bagN('tess'))}) · ${fmtN(nd.z)}z${nd.dup?` · <b class="c">ทะลุขีด: ใช้เจมซ้ำ ${nd.dup} (มี ${o.dup||0})</b>`:''}`;
  h+=candHtml(o)+linesHtml(o,'c');
  return h;}
/* special-stat lines (owner 2026-11-21) — the same block for C gems ('c') and skill gems ('s'): rank badge, the real number (rank × rarity × level),
   rank-up, lock, re-roll of the unlocked lines; empty slots wait for a roll */
const rkRange=q=>{const P=QUAL[q||0].rk||[1],a=P.findIndex(x=>x>0)+1,b=P.length-[...P].reverse().findIndex(x=>x>0);return GD.R(a)+'–'+GD.R(b);};
function linesHtml(o,kind){const LD=GD?GD.LND:{},q=o.q||0,n=NSL(q,o.lv),ls=o.lines||[],nx=SLV.find(x=>(o.lv||1)<x);
  let h=`<div class="lnh">✦ <b>สเตตัสพิเศษ</b> ${ls.length}/${n} ช่อง${nx?` · ช่องถัดไป Lv ${nx}`:''} · ตัวเลข ×${(QUAL[q].m*LVM(o.lv)).toFixed(2)} <small>(ระดับ ×${QUAL[q].m.toFixed(2)} · เลเวล ×${LVM(o.lv).toFixed(2)})</small></div>`;
  h+=ls.map((l,i)=>{const d=LD[l[0]],r=l[1],up=r<5?C.rankEss[r-1]:0,st=d&&d[2]==='สเตตัส';
    return `<div class="ln ln2${st?' st':''}"><i>${GD.R(r)}</i><span>${lnTxt(l,q,o.lv)}</span><div class="lc">${r<5?`<button data-lup="${i}" ${bagN('tess')>=up&&zeny()>=C.rankZ(r)?'':'disabled'} title="อัปขั้น: แก่น ${up} · ${fmtN(C.rankZ(r))}z">ขั้น+ ${GD.R(r+1)} · แก่น ${up}</button>`:'<small>ขั้นสูงสุด</small>'}<label><input type="checkbox" data-lock="${i}" ${l[2]?'checked':''}>ล็อก</label></div></div>`;}).join('')
    +Array.from({length:Math.max(0,n-ls.length)},()=>'<div class="ln"><i>–</i><span style="opacity:.6">ช่องว่าง — กดสุ่มเพื่อเติม</span></div>').join('');
  const lk=ls.filter(l=>l[2]).length,rz=(C.rerollEss||8)+(C.lockEss||12)*lk,ok=bagN('tess')>=rz&&zeny()>=(C.rerollZ||5000)&&(lk<ls.length||ls.length<n);
  return h+`<div class="rr">สุ่มสเตตัสที่ไม่ล็อกใหม่ (${QUAL[q].n}: ขั้นเริ่ม ${rkRange(q)}): แก่น ${rz} · ${fmtN(C.rerollZ||5000)}z <button data-reroll ${ok?'':'disabled'}>🎲 สุ่มใหม่</button></div>`;}
function bindLines(o,kind,refresh){const el=win.querySelector('#tgInfo');
  el.querySelectorAll('[data-lock]').forEach(c=>c.onchange=()=>{o.lines[+c.dataset.lock][2]=c.checked?1:0;save();refresh('');});
  el.querySelectorAll('[data-lup]').forEach(b=>b.onclick=()=>{const l=o.lines[+b.dataset.lup],r=l[1],e=C.rankEss[r-1],z=C.rankZ(r);if(r>=5||bagN('tess')<e||!payZ(z))return;bagAdd('tess',-e);bagSave();l[1]++;save();
    refresh(`<br><span class="g">✔ ${GD.LND[l[0]][1]} ขึ้นเป็นขั้น ${GD.R(l[1])}</span>`);render(true);});
  const rr=el.querySelector('[data-reroll]');if(rr)rr.onclick=()=>{const lk=o.lines.filter(l=>l[2]),e=C.rerollEss+C.lockEss*lk.length;if(bagN('tess')<e||!payZ(C.rerollZ))return;bagAdd('tess',-e);bagSave();
    o.lines=rollLines(o.q||0,o.lv,lk,kind);save();refresh('<br><span class="g">✔ สุ่มสเตตัสพิเศษใหม่แล้ว</span>');render(true);};}
/* a new roll of a gem you have (better-rarity C gem copy, or a re-extracted skill gem) waits beside the old one: keep either */
function candHtml(o){const c=o&&o.cand;if(!c)return '';
  return `<div class="cand"><b>⚗ ได้ผลใหม่</b> ${qTag(c.q)} ${NSL(c.q,o.lv)} ช่อง <small>(เดิม ${QUAL[o.q||0].n} ${NSL(o.q||0,o.lv)} ช่อง)</small><div class="cl">${c.lines.map(l=>`<div><i>${GD.R(l[1])}</i> ${lnTxt(l,c.q,o.lv)}</div>`).join('')}</div><div class="cb"><button data-cand="1">✔ ใช้อันใหม่</button><button data-cand="0">เก็บอันเดิม</button></div></div>`;}
function bindCand(root,o,done){root.querySelectorAll('[data-cand]').forEach(b=>b.onclick=()=>{const c=o.cand;if(!c)return;const yes=b.dataset.cand==='1';if(yes){o.q=c.q;o.lines=c.lines;}delete o.cand;boost=yes?1:.4;save();done(yes);render(true);});}
function bindInfo(k){const o=D.own[k];if(!o)return;bindLines(o,'c',x=>showGem(k,x));
  bindCand(win.querySelector('#tgInfo'),o,yes=>showGem(k,yes?`<br><span class="g">✔ ใช้เจมระดับ ${QUAL[o.q].n} แล้ว — เม็ดเดิมเป็นเจมซ้ำ</span>`:'<br>เก็บอันเดิม — เม็ดใหม่เป็นเจมซ้ำ'));}
/* the skill gem's block inside a skill / skill-hole card: rarity, level, special stats, re-extract */
function sgSection(k){const o=sgo(k);if(!o)return '';const q=o.q||0,nd=sgNeed(o),max=o.lv>=CAP;
  let h=`<div class="sgc">💎 <b>เจมสกิล</b> ${qTag(q)} เลเวลเจม <b>${o.lv}/${CAP}</b>`;
  h+=max?' · <span class="g">เลเวลตัน</span>':`<br><span class="up">อัปเลเวล${nd.brk.length?' <b class="c">(ทะลุขีด)</b>':''}: แก่น ${nd.ess} · ${fmtN(nd.z)}z${nd.brk.map(([x,c])=>' '+icn(x,c)).join('')} → ปุ่ม "อัปเลเวล" ด้านล่าง</span>`;
  h+=candHtml(o)+linesHtml(o,'s');
  if(!o.cand){const L=reNeeds(k);h+=`<div class="rr">⚗ สกัดใหม่ = สุ่มระดับ + สเตตัสพิเศษใหม่หมด (เลเวลเดิมอยู่ · ได้ผลแล้วเลือกเก็บอันไหนก็ได้): ${L.map(e=>e.x==='z'?`<span class="ic${zeny()<e.n?' no':''}">${fmtN(e.n)}z</span>`:icn(e.x,e.n)).join(' ')} <button data-rex ${reOK(k)?'':'disabled'}>⚗ สกัดใหม่</button></div>`;}
  return h+'</div>';}
function bindSG(k,refresh){const o=sgo(k);if(!o)return;const el=win.querySelector('#tgInfo');bindLines(o,'s',refresh);
  const rx=el.querySelector('[data-rex]');if(rx)rx.onclick=()=>{if(!reExtract(k))return;boost=.8;refresh('<br><span class="g">⚗ สกัดใหม่แล้ว — เทียบกับอันเดิม แล้วเลือกเก็บ</span>');render(true);};
  bindCand(el,o,yes=>{if(yes)popK=k;refresh(yes?`<br><span class="g">✔ ใช้เจมระดับ ${QUAL[o.q].n} แล้ว</span>`:'<br>เก็บอันเดิมไว้');});}
function showSkill(k,extra){info(skillInfo(k)+(extra||''));bindSG(k,x=>showSkill(k,x));}
function showGem(k,extra){info(gemInfo(k)+(extra||''));bindInfo(k);}
const mutInfo=id=>{const m=MUTD[id],R=RESO[id],n=RES.n[id]||0;
  let h=`<b>${m[1]}</b> (เจมแปรสภาพ)${mutTag(id)}<br><span class="g">ได้: ${mutG(id)}</span><br><span class="c">เสีย: ${mutC(id)}</span>`;
  if(R)h+=`<div class="rsx${RS(id)||(BAL()&&n)?' on':''}">🔗 <b>เรโซแนนซ์</b> (แบบนี้ 2 เม็ดบนเสา${n?` · ตอนนี้ ${n} เม็ด`:''}): ได้ → ${R.g}${RS(id)?' <b class="g">✔ ติดแล้ว</b>':''}`
    +`<br>⚖ <b>สมดุล</b> (แปรสภาพไม่ซ้ำกันครบ ${BAL_N} แบบ · ตอนนี้ ${RES.kinds}): เสีย → ${R.c}${BAL()?' <b class="g">✔ ติดแล้ว</b>':''}</div>`;
  return h;};
const supInfo=id=>{const s=SUPD[id];return `<b>${s[1]}</b> (เจมเสริม)<br>${s[4]}`;};
/* painted gem if the file exists (assets/gems/mut|support/<id>.webp), else the code-drawn badge */
const sg=(id,kind)=>{const d=kind==='mut'?MUTD[id]:SUPD[id];return `<span class="tgSg${kind==='mut'?' mut':''}" style="--c:${d[3]}"><span>${d[2]}</span><img src="assets/gems/${kind==='mut'?'mut':'support'}/${id}.webp" alt="" draggable="false" onload="this.parentNode.classList.add('art')" onerror="this.remove()"></span>`;};
/* skill gem picture (owner's frame + glass shine, 2026-11-21, GEM_PAGE_ART_PROMPTS_TH.md 11–12): the skill icon in a circle under the glass,
   the moonstone frame on top; one frame for every skill of every hero. The frame's window is .664 of its width, the icon circle .684 (tucked under the rim). */
/* glass shine (owner 2026-11-21, after the C-frame prompt: 'just this shine is already pretty — but turn its facets so the gems are not all
   the same'): his shine (prompt 12) is split into a fixed highlight (light stays upper left, cshine_hl) and the rim + facets (cshine_fc), which
   turn −42…+42° and / or mirror across the light's diagonal per gem (fcv: from the skill key, so a gem always looks the same).
   tools/gems/shine_split.py makes both 512² pictures (rim circle r 236 at the centre). Skill gems keep the moonstone frame on top; C gems are
   octagonal diamonds (below). The rarity light (rq0–4) works on both.
   C gem = octagonal cut diamond (owner 2026-11-21: 'make it like a diamond, the orb is too round' + asked for the prompt: GEM_PAGE_ART_PROMPTS_TH.md
   13–14 → his two pictures the same day): the C skill's icon in the octagonal table hole (apothem 149.6 of 512, flat top) under his table
   shine (cgem_tshine.webp, light upper left), his crown on top (cgem_oct0.webp, outer apothem 252, the hole see-through). Both pictures are
   made by tools/gems/oct_frame.py (measures both octagons, prints the numbers used in .sgem.cg and OCT_PTS). One crown for every C gem;
   each gem turns it by 0/90/180/270° and may mirror it (octOf: from the skill key) → 8 different-looking cuts, the rainbow glints and
   sparkles move round; the table shine only mirrors across the light's diagonal (light stays upper left). Rarity: glow round the
   silhouette + a coloured light just inside the gold rim of the table (.rgo) + the sweep masked to the crown. */
const SGEM={f:PG+'sgem_frame.webp',h:PG+'cshine_hl.webp',fc:PG+'cshine_fc.webp',ts:PG+'cgem_tshine.webp',oc:PG+'cgem_oct0.webp'};
const fcv=k=>{let h=7;for(const ch of String(k||''))h=(h*31+ch.charCodeAt(0))|0;h=Math.abs(h);
  return `--fa:${((h%13)-6)*7}deg;--fmx:${(h>>5)&1?'rotate(45deg) scaleY(-1) rotate(-45deg)':'scale(1)'}`;};
const OCT_ED='98.24,30.02 69.98,1.76 30.02,1.76 1.76,30.02 1.76,69.98 30.02,98.24 69.98,98.24 98.24,69.98',OCT_RL='97.36,30.38 69.62,2.64 30.38,2.64 2.64,30.38 2.64,69.62 30.38,97.36 69.62,97.36 97.36,69.62';   /* frameless C gem: edge (apothem 247) + rarity line just inside */
const MXD='rotate(45deg) scaleY(-1) rotate(-45deg)';   /* mirror across the light's diagonal (upper left stays upper left) */
const octOf=k=>{let h=3;for(const ch of String(k||''))h=(h*37+ch.charCodeAt(0))|0;h=Math.abs(h);const r=h%4,m=(h>>3)&1,t=(h>>5)&1;
  return {tr:`rotate(${r*90}deg)${m?' '+MXD:''}`,mx:t?MXD:'scale(1)'};};
const OCT_PTS='78.83,38.06 61.94,21.17 38.06,21.17 21.17,38.06 21.17,61.94 38.06,78.83 61.94,78.83 78.83,61.94';   /* apothem 147.6 of 512 */
const gemBox=(art,q,c,k)=>{q=q||0;const Q=QUAL[q]||QUAL[0];
  if(c&&!GFRAME){const v=octOf(k);
    return `<span class="sgem rq${q} cg nf" style="--rc:${Q.c};--rg:${Q.g};--fmx:${v.mx}"><span class="sgi">${art}</span><img class="sgt" src="${SGEM.ts}" alt="" draggable="false">`
      +`<svg class="rgo" viewBox="0 0 100 100"><polygon class="rl" points="${OCT_RL}"/><polygon class="ol" points="${OCT_ED}"/></svg><span class="rsw"></span></span>`;}
  if(!c&&!GFRAME)return `<span class="sgem rq${q} nf" style="--rc:${Q.c};--rg:${Q.g};${fcv(k)}"><span class="sgi">${art}</span><span class="rgl"></span>`
    +`<img class="sgs" src="${SGEM.fc}" alt="" draggable="false"><img class="sgh" src="${SGEM.h}" alt="" draggable="false"><span class="rsw"></span></span>`;
  if(c){const v=octOf(k);
    return `<span class="sgem rq${q} cg" style="--rc:${Q.c};--rg:${Q.g};--fmx:${v.mx};--ftr:${v.tr};--om:url(${SGEM.oc})"><span class="sgi">${art}</span>`
      +`<img class="sgt" src="${SGEM.ts}" alt="" draggable="false"><svg class="rgo" viewBox="0 0 100 100"><polygon points="${OCT_PTS}"/></svg>`
      +`<img class="sgf" src="${SGEM.oc}" alt="" draggable="false"><span class="rsw"></span></span>`;}
  return `<span class="sgem rq${q}" style="--rc:${Q.c};--rg:${Q.g};${fcv(k)}"><span class="sgi">${art}</span><span class="rgl"></span>`
  +`<img class="sgs" src="${SGEM.fc}" alt="" draggable="false"><img class="sgh" src="${SGEM.h}" alt="" draggable="false"><img class="sgf" src="${SGEM.f}" alt="" draggable="false"><span class="rsw"></span></span>`;};
const sgemHtml=(k,q)=>{const o=q==null?sgo(k):null;return gemBox(skArt(k),q!=null?q:o?o.q:0,0,k);};
const cgemHtml=(k,q)=>gemBox(skArt(k)||`<img src="assets/icons/${HERO}/${k}.webp" alt="">`,q!=null?q:(D.own[k]||{}).q||0,1,k);
const skArt=k=>{try{const a=G('artFor'),ic=G('iconSVG'),sk=G('SKILLS')[k];return (a&&a(k))||(ic&&sk&&ic(sk.icon))||'';}catch(e){return '';}};
function node(x,y,kind,inner,cls,title,onclick,icls,art){const el=document.createElement('div');const ak=ART[kind]||kind;let s=SZ[kind];let c=CUP[ak],src=`${BD}sock_${ak}.webp`,gk=ak==='main'?1.18:1.05;
  let sz=s;
  if(art&&art.r){sz=art.r*2*1.7;src='';c={cx:.5,cy:.5,r:1/3.4};gk=1.06;cls=(cls||'')+' th';}   /* page v3: the hole is painted in the totem — just the gem, a bit over its rim */
  else if(art){src=PG+art[0]+'.webp';c={cx:art[1],cy:art[2],r:art[3]};gk=1.04;}   /* page v2 socket picture: the gem just covers its hole */
  el.className='tgN '+(cls||'');el.style.cssText=`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px`;
  const gs=c.r*2*sz*gk;s=sz;
  el.innerHTML=(src?`<img class="sk" src="${src}" alt="">`:'<i class="ho"></i>')+(/\bpg\b/.test(cls||'')?'<i class="pl"></i>':'')+(inner?`<div class="in ${icls||''}" style="left:${c.cx*s-gs/2}px;top:${c.cy*s-gs/2}px;width:${gs}px;height:${gs}px">${inner}</div>`
    :/lock|dim|\bpg\b/.test(cls||'')?'':`<div class="eg" style="--eg:${kind==='skill'?'190,225,255':(kind==='sup'||kind==='ssup')?'120,220,255':(kind==='mut'||kind==='smut')?'255,178,96':'255,222,140'};left:${c.cx*s-gs*.32}px;top:${c.cy*s-gs*.32}px;width:${gs*.64}px;height:${gs*.64}px"></div>`);
  el.title=title||'';el.onclick=onclick;board.appendChild(el);return el;}
const selSG=()=>{if(!sel||sel.carve)return null;const k=sel.skill?sel.skill:sel.ss!=null?D.ss[sel.ss]:null;return k&&extracted(k)&&sgo(k)?k:null;};
/* ---------- totem pages (owner 2026-11-21 'โอเค' to GEAR_GEM_LONGTERM_TH.md §3.6: 3 layouts, e.g. farm / boss / party) ----------
   A page = where every gem sits: C gems in the pole tiers + their wing gems, skills in the base holes + their gold / teal gems.
   Gems themselves are shared (a C gem / skill gem is owned once; mutation / support gems come from the bag), so switching takes every
   wing / skill-hole gem off into the bag and puts the page's own back from it — a gem the bag no longer has (sold, traded) leaves
   its hole empty and is listed. Free: in a town any time, elsewhere after PG_CALM s without dealing or taking damage. */
const esc=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const snap=()=>({sock:D.sock.slice(),mods:Object.fromEntries(D.sock.filter(Boolean).map(k=>[k,(D.mods[k]||[null,null,null,null]).slice(0,4)])),ss:D.ss.slice(),sm:D.sm.slice(),ssu:D.ssu.map(a=>(a||[null,null]).slice(0,2))});
function pgCount(L){const o={c:0,s:0,m:0,u:0};if(!L)return o;(L.sock||[]).forEach(k=>{if(!k)return;o.c++;((L.mods||{})[k]||[]).forEach((x,j)=>{if(x)isMutJ(j)?o.m++:o.u++;});});
  (L.ss||[]).forEach((k,i)=>{if(k)o.s++;if((L.sm||[])[i])o.m++;(((L.ssu||[])[i])||[]).forEach(x=>{if(x)o.u++;});});return o;}
let FIGHT_T=-99;const PG_CALM=5;
/* '' = may switch now, else why not */
function pgBlock(){if(test()&&!SEAL)return '';const a=AF();try{if(a&&a.townHere&&a.townHere())return '';}catch(e){}const w=PG_CALM-(now()-FIGHT_T);
  return w>0?`เพิ่งต่อสู้ — นอกเมืองสลับหน้าได้เมื่อไม่ได้สู้ ${PG_CALM} วิ (อีก ${Math.ceil(w)} วิ)`:'';}
function switchPage(t,quiet){const P=D.pg;t=+t;if(!(t>=0&&t<3))return false;if(t===P.c)return {same:1,miss:[]};const why=pgBlock();
  if(why){if(!quiet){info(`<b>📑 สลับหน้าไม่ได้ตอนนี้</b><br><span class="c">${why}</span>`+pgRules());pgBar();}return false;}
  const S=G('SKILLS')||{},T=P.L[t];P.L[P.c]=snap();P.c=t;
  if(!T){save();return {fresh:1,miss:[]};}   /* a page used for the first time starts as a copy of the page you were on */
  /* 1 · everything comes off into the bag */
  for(const k of D.sock)if(k)giveBack(k);D.sock=Array(NS).fill(null);
  for(let i=0;i<NSS;i++){if(D.sm[i])bagAdd('gmut_'+D.sm[i],1);(D.ssu[i]||[]).forEach(x=>{if(x)bagAdd('gsup_'+x,1);});D.ss[i]=null;D.sm[i]=null;D.ssu[i]=[null,null];}
  /* 2 · the page goes on: C gems + wings, then skills + their gold / teal holes */
  const miss={},lack=s=>{miss[s]=(miss[s]||0)+1;};
  const take=(id,mu)=>{const d=(mu?MUTD:SUPD)[id];if(!d)return false;const g=(mu?'gmut_':'gsup_')+id;if(bagN(g)<=0){lack((mu?'แปรสภาพ ':'เสริม ')+d[1]+' (กระเป๋าไม่พอ)');return false;}
    if(mu&&used('mut',id)>=2)return false;bagAdd(g,-1);return true;};
  (T.sock||[]).forEach((k,i)=>{if(!k||i>=NS)return;const nm=(S[k]||{}).name||k;if(!D.own[k]||!S[k]){lack('เจม C '+nm);return;}if(!sockOpen(i)||!tierOK(k)){lack(`ชั้นเสาที่ ${i+1} ยังไม่เปิด`);return;}if(D.sock.includes(k))return;
    D.sock[i]=k;const a=D.mods[k]=[null,null,null,null];(((T.mods||{})[k])||[]).forEach((id,j)=>{if(!id||j>3)return;if(!modOpen(i,j)){lack(`หลุมปีกชั้นที่ ${i+1} ยังไม่เปิด`);return;}if(take(id,isMutJ(j)))a[j]=id;});});
  (T.ss||[]).forEach((k,i)=>{if(!k||i>=NSS)return;const nm=(S[k]||{}).name||k;if(!S[k]||!ssOpen(i)||!ssLearned(k)||!extracted(k)){lack('สกิล '+nm+(S[k]&&!ssLearned(k)?' (ยังไม่ได้เรียน)':''));return;}if(D.ss.includes(k))return;
    D.ss[i]=k;const id=(T.sm||[])[i];if(id&&take(id,true))D.sm[i]=id;((((T.ssu||[])[i])||[])).forEach((x,j)=>{if(!x||j>1)return;if(!uOpen(i,j)){lack('หลุมขอบเขียวยังไม่ได้สลัก');return;}if(take(x,false))D.ssu[i][j]=x;});});
  bagSave();save();return {miss:Object.entries(miss).map(([s,n])=>s+(n>1?' ×'+n:''))};}
const pgRules=()=>`<br><span style="color:#2a5a8a">📑 3 หน้า = จัดเสาไว้ 3 แบบ (เช่น ฟาร์ม / บอส / ปาร์ตี้) · สลับฟรี: ในเมืองได้ตลอด · นอกเมืองได้เมื่อไม่ได้สู้ ${PG_CALM} วิ · เจม C / เจมสกิลใช้ร่วมกันทุกหน้า · เจมแปรสภาพ / เสริมย้ายตามหน้า (ถอดกลับกระเป๋าแล้วหยิบใส่หน้าใหม่) — ถ้าในกระเป๋าไม่พอ หลุมนั้นว่างไว้</span>`;
function doPage(t){const P=D.pg,from=P.c;const r=switchPage(t);if(!r)return;if(r.same){pgCard();return;}
  sel=null;boost=1;render();const bd=board;bd.classList.remove('pgsw');void bd.offsetWidth;bd.classList.add('pgsw');
  try{G('msg')(`📑 เสาโทเท็ม: หน้า "${P.n[P.c]}"`);}catch(e){}
  info(`<b class="g">✔ สลับเป็นหน้า "${esc(P.n[P.c])}" แล้ว</b>`+(r.fresh?`<br>หน้านี้ใช้ครั้งแรก — เริ่มจากสำเนาหน้า "${esc(P.n[from])}" ให้แล้ว ปรับเจมได้เลย (หน้า "${esc(P.n[from])}" ยังเก็บไว้ครบ)`:'')
    +(r.miss.length?`<br><span class="c">ขาด: ${r.miss.map(esc).join(' · ')} — หลุมนั้นว่างไว้</span>`:'')+resLine()+pgRules());}
function pgCard(extra){const P=D.pg,c=P.c,n=pgCount(snap());
  let h=`<b>📑 หน้า ${c+1} "${esc(P.n[c])}"</b> · ใช้อยู่<br>บนหน้านี้: เจม C ${n.c} · สกิล ${n.s} · แปรสภาพ ${n.m} · เสริม ${n.u}`;
  h+=`<div class="pgr">ชื่อหน้า <input id="pgName" maxlength="12" value="${esc(P.n[c])}"><button data-pgren>บันทึก</button></div>`;
  h+=`<div class="pgr">คัดลอกหน้านี้ไปทับ ${[0,1,2].filter(i=>i!==c).map(i=>`<button data-pgcp="${i}">${i+1} · ${esc(P.n[i])}</button>`).join('')}</div>`;
  h+='<div class="pgo">'+[0,1,2].filter(i=>i!==c).map(i=>{const L=P.L[i],k=pgCount(L);return `<div>หน้า ${i+1} "${esc(P.n[i])}": ${L?`เจม C ${k.c} · สกิล ${k.s} · แปรสภาพ ${k.m} · เสริม ${k.u}`:'ยังไม่เคยใช้ (เปิดครั้งแรก = สำเนาหน้าที่ใช้อยู่)'}</div>`;}).join('')+'</div>';
  info(h+pgRules().replace(/^<br>/,'')+(extra||''));
  const el=win.querySelector('#tgInfo'),inp=el.querySelector('#pgName');
  const ren=()=>{const v=inp.value.trim().slice(0,12);if(!v)return;P.n[c]=v;saveQ();render(true);pgCard('<br><span class="g">✔ เปลี่ยนชื่อหน้าแล้ว</span>');};
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')ren();});inp.addEventListener('keyup',e=>e.stopPropagation());
  el.querySelector('[data-pgren]').onclick=ren;
  el.querySelectorAll('[data-pgcp]').forEach(b=>b.onclick=()=>{const i=+b.dataset.pgcp;if(!b.classList.contains('arm')){b.classList.add('arm');b.textContent=`แตะอีกครั้ง = เขียนทับหน้า "${P.n[i]}"`;return;}
    P.L[i]=snap();saveQ();pgCard(`<br><span class="g">✔ คัดลอกหน้า "${esc(P.n[c])}" ไปทับหน้า "${esc(P.n[i])}" แล้ว</span>`);});}
/* ---------- resonance / balance panels ---------- */
function resLine(){if(BAL())return `<br><span class="blT">⚖ สมดุล: แปรสภาพ ${RES.kinds} แบบไม่ซ้ำกัน — ข้อเสียของทุกเม็ดเบาลง</span>`;
  if(RES.on.size)return `<br><span class="rsT">🔗 เรโซแนนซ์: ${[...RES.on].map(id=>MUTD[id][1]).join(' · ')} — ข้อดีแรงขึ้น</span>`;return '';}
function resSum(){if(BAL())return `<b>⚖ สมดุล</b> · แปรสภาพ ${RES.kinds} แบบไม่ซ้ำ → ข้อเสียทุกเม็ดเบาลง`;
  if(RES.on.size)return `<b>🔗 เรโซแนนซ์</b> · ${[...RES.on].map(id=>MUTD[id][1]).join(' · ')} → ข้อดีแรงขึ้น`;
  return RES.tot?`🔗 แบบเดียวกัน 2 เม็ด = เรโซแนนซ์ · ⚖ ไม่ซ้ำครบ ${BAL_N} แบบ = สมดุล (ตอนนี้ ${RES.kinds}/${BAL_N})`:`🔗 เรโซแนนซ์ / ⚖ สมดุล — แตะดูวิธีติด`;}
function resInfo(){const ks=Object.keys(RES.n);
  let h=`<b>🔗 เรโซแนนซ์ · ⚖ สมดุล</b> (เจมแปรสภาพบนเสา)<br>ทำงานอยู่ ${RES.tot} เม็ด · ${ks.length} แบบ${resLine()}`;
  h+=`<div class="rsx${RES.on.size?' on':''}"><b>🔗 เรโซแนนซ์</b> = แบบเดียวกัน 2 เม็ด (หลุมไหนก็ได้บนเสา) → <b>ข้อดี</b>ของแบบนั้นแรงขึ้น ทั้ง 2 สกิล</div>`;
  h+=`<div class="rsx${BAL()?' on':''}"><b>⚖ สมดุล</b> = ไม่มีแบบไหนซ้ำ และครบ ${BAL_N} แบบขึ้นไป (ตอนนี้ ${ks.length}/${BAL_N}${Object.keys(RES.n).some(id=>RES.n[id]>1)?' · มีคู่ซ้ำอยู่ = ไม่ติด':''}) → <b>ข้อเสีย</b>ของทุกเม็ดเบาลง</div>`;
  h+='<div class="rst">'+MUT.map(m=>{const id=m[0],R=RESO[id];if(!R)return '';const n=RES.n[id]||0,on=RS(id)||(BAL()&&n);
    return `<span class="gi">${sg(id,'mut')}</span><div class="${on?'on':''}"><b>${m[1]}</b>${n?` · บนเสา ${n}`:''}${mutTag(id)}<br>🔗 ได้ ${m[4]} → <b>${R.g}</b><br>⚖ เสีย ${m[5]} → <b>${R.c}</b></div>`;}).join('')+'</div>';
  info(h);}
function pgBar(){const P=D.pg,why=pgBlock();win.querySelectorAll('#tgPg button').forEach(b=>{const i=+b.dataset.pg,on=i===P.c;b.classList.toggle('on',on);b.classList.toggle('wait',!on&&!!why);
  const h=`<small>หน้า ${i+1}</small>${esc(P.n[i])}`;if(b.innerHTML!==h)b.innerHTML=h;
  b.title=`หน้า ${i+1} "${P.n[i]}"`+(on?' · ใช้อยู่ — แตะเพื่อตั้งชื่อ / คัดลอก':why?' · '+why:' · แตะเพื่อสลับ');});}
win.querySelectorAll('#tgPg button').forEach(b=>b.onclick=()=>{const t=+b.dataset.pg;if(t===D.pg.c){sel=null;render(true);pgCard();return;}doPage(t);});
win.querySelector('#tgRes').onclick=()=>{sel=null;setTab('mut');render(true);resInfo();};
win.querySelector('#tgRsb').onclick=()=>{sel=null;render(true);resInfo();};
function render(keepInfo){const S=G('SKILLS');if(!S)return;
  const inv=(id,list)=>{const e=win.querySelector(id);e.innerHTML='';list.forEach(b=>e.appendChild(b));};
  inv('#tgGems',cKeys().map(k=>{const b=document.createElement('button'),own=D.own[k];b.className='cgb '+(own?'':'lock ')+(D.sock.includes(k)?'used ':'')+(sel&&sel.gem===k?'sel':'');
    b.innerHTML=cgemHtml(k)+(own?`<i>${own.lv}</i>`+(own.dup?`<b class="dp">×${own.dup}</b>`:'')+(own.cand?'<b class="cn">!</b>':''):'');b.title=S[k].name+(own?` · Lv ${own.lv} · ${QUAL[own.q||0].n}`:' · ยังไม่มี');b.onclick=()=>{const t=sel;sel=own?{gem:k}:null;if(own&&t&&t.sock!=null&&!D.sock[t.sock]){clickSock(t.sock);return;}showGem(k);render(true);};return b;}));
  for(const [kind,list,el] of [['mut',MUT,'#tgMuts'],['sup',SUP,'#tgSups']])
    inv(el,list.map(([id,n])=>{const fr=free(kind,id),u=used(kind,id);const b=document.createElement('button');b.className=(fr<=0?'used ':'')+(sel&&sel[kind]===id?'sel':'');
      const rz=kind==='mut'?(RS(id)?'<b class="rsb" title="เรโซแนนซ์">🔗</b>':BAL()&&RES.n[id]?'<b class="rsb bl" title="สมดุล">⚖</b>':''):'';
      b.innerHTML=sg(id,kind)+(fr||u?`<i>${fr}</i>`:'')+rz;b.title=n+(kind==='mut'&&RS(id)?' · 🔗 เรโซแนนซ์':kind==='mut'&&BAL()&&RES.n[id]?' · ⚖ สมดุล':'');
      b.onclick=()=>{const t=sel;sel=fr>0?{[kind]:id}:null;
        if(fr>0&&t){if(t.mod&&(isMutJ(t.mod[1])?'mut':'sup')===kind&&!(D.mods[D.sock[t.mod[0]]]||[])[t.mod[1]]){clickMod(t.mod[0],t.mod[1]);return;}
          if(kind==='sup'&&t.ssu&&D.ss[t.ssu[0]]&&!(D.ssu[t.ssu[0]]||[])[t.ssu[1]]){clickSSU(t.ssu[0],t.ssu[1]);return;}
          const si=t.ss!=null?t.ss:t.sm;if(kind==='mut'&&si!=null&&D.ss[si]&&!D.sm[si]){placeSM(si,id);return;}}
        info((kind==='mut'?mutInfo(id):supInfo(id))+`<br><span style="opacity:.75">ในกระเป๋า ${fr} · ใส่อยู่ ${u} — ${fr>0?(TL?`แตะหลุม${kind==='mut'?'ในปีกเสา หรือหลุมขอบทองใต้หลุมสกิล':'นอกปีกเสา หรือหลุมขอบเขียวใต้หลุมสกิล (ผลครึ่งหนึ่ง)'}เพื่อใส่`:`แตะดาว${kind==='mut'?'กลาง (ขอบรูน)':'เล็ก'}ข้างเจมหลักเพื่อใส่`):'หาเพิ่ม: ดรอปจากมอนดันเจี้ยน · ตลาดกลาง (หมวดเจม/โทเท็ม)'}</span>`);render(true);};return b;}));
  {const LVx=G('LV')||{},ks=Object.keys(S).filter(k=>ssOK(k)&&(LVx[k]||0)>0).sort((a,b)=>'basicAB'.indexOf(S[a].br)-'basicAB'.indexOf(S[b].br)||(S[a].row||0)-(S[b].row||0));
    inv('#tgSkills',ks.length?ks.map(k=>{const b=document.createElement('button'),on=D.ss.indexOf(k),gx=extracted(k),xs=gx?'done':exState(k);
      b.className=(on>=0?'used ':'')+(gx?'gx ':'nx '+(xs==='rdy'?'rdy ':''))+(sel&&sel.skill===k?'sel ':'')+(popK===k?'pop':'');b.dataset.k=k;
      b.innerHTML=(gx?sgemHtml(k):skArt(k))+gemMark(k)+(gx?'':'<b class="xb">⚗</b>');b.title=S[k].name+(gx?' · เจมสกิล '+QUAL[(sgo(k)||{}).q||0].n+(sgo(k)?' Lv '+sgo(k).lv:''):' · ยังไม่ได้สกัดเป็นเจม')+(on>=0?` · หลุมสกิล ${on+1}`:'');
      b.onclick=()=>{const t=sel,ok=i=>i!=null&&!D.ss[i]&&ssOpen(i),hole=t&&ok(t.ss)?t.ss:t&&ok(t.ph)?t.ph:null;sel={skill:k};   /* an empty hole picked first (or still pending) */
        if(!extracted(k)){if(hole!=null)sel.ph=hole;info(exInfo(k,hole!=null?'<br><span class="c">สกัดสกิลนี้เป็นเจมก่อน แล้วระบบจะวางในหลุมที่เลือกไว้ให้</span>':''));render(true);return;}
        if(hole!=null){clickSS(hole);return;}showSkill(k);render(true);};return b;})
      :[Object.assign(document.createElement('div'),{style:'grid-column:1/-1;font:500 11px/1.4 Mitr,sans-serif;color:#e9c98a;padding:4px',textContent:'ยังไม่มีสกิลกดใช้ที่เรียน — อัปสกิลในหน้าต่างสกิล (K) ก่อน'})]);popK=null;}
  {const gb=win.querySelector('#tgGiftB'),n=giftN();gb.style.display=n?'':'none';gb.textContent=`🎁 รับเจมแปรสภาพฟรี ${n} เม็ด (ของขวัญดาวสกิล)`;}
  {const T=win.querySelectorAll('.tgTabs button small'),nOpen=SS_LV.filter((l,i)=>ssOpen(i)).length,nPl=D.ss.filter((k,i)=>k&&ssOpen(i)).length;   /* tab counters */
    if(T.length===4){T[0].textContent=`${nPl}/${nOpen} ดาว`;T[1].textContent=`มี ${cKeys().filter(k=>D.own[k]).length}`;T[2].textContent=`มี ${MUT.reduce((a,m)=>a+free('mut',m[0]),0)}`;T[3].textContent=`มี ${SUP.reduce((a,m)=>a+free('sup',m[0]),0)}`;}}
  pgBar();
  {const R=win.querySelector('#tgRes'),bl=BAL();R.classList.toggle('on',bl||RES.on.size>0);R.classList.toggle('bl',bl);   /* resonance badges (board, top right) + the status line of the mutation tab */
    R.querySelector('.rl').innerHTML=bl?`<span class="rb bal" title="สมดุล: แปรสภาพ ${RES.kinds} แบบไม่ซ้ำกัน">⚖<i>${RES.kinds}</i></span>`
      :[...RES.on].map(id=>`<span class="rb" style="--c:${MUTD[id][3]}" title="เรโซแนนซ์ ${MUTD[id][1]}">${sg(id,'mut')}<i>×2</i></span>`).join('');
    const rb=win.querySelector('#tgRsb');rb.innerHTML=resSum();rb.className='tgRsb'+(bl?' bl':RES.on.size?' on':'');}
  board.querySelectorAll('.tgN').forEach(e=>e.remove());
  /* order: C stars (land sockets) → their side stars on top of the wing tips → the inner skill stars last (on top) */
  /* sealed holes (carving, owner 2026-11-21): level reached + not carved = a plug in the hole (wooden peg on the pole, stone on the base) with a
     ⛏ badge, gold pulse when the goods are all in the bag; tapping any sealed / locked hole shows what it asks for */
  const cvp=cs=>`<div class="cvp${cs==='rdy'?' on':''}">⛏ ${cs==='rdy'?'สลักได้!':'สลัก'}</div>`,sc=id=>sel&&sel.carve===id?' sel':'';
  MAIN.forEach((p,i)=>{const k=D.sock[i],open=sockOpen(i),cs=open?'open':cvState('p'+i),pid='p'+i;
    const o=k&&D.own[k];
    const el=node(p.x,p.y,'main',k?cgemHtml(k):'','mn '+(open?'':cs==='lv'||!TL?'lock ':'pg wd '+(cs==='rdy'?'rdy ':''))+(sel&&(sel.sock===i||sel.carve===pid)?'sel':''),
      open?(k?S[k].name:TL?'หลุมเจม C ของชั้นนี้':'ช่องเจมหลัก'):cs==='lv'?`เปิดที่ Lv ${SOCK_LV[i]}`:`${hole(pid).nm} · ยังไม่ได้สลัก — แตะเพื่อดูของที่ต้องส่ง`,()=>clickSock(i),k?'sg cgi':'',HOLE(p)||LAND[i]);
    if(cs==='lv')el.insertAdjacentHTML('beforeend',`<div class="lk">🔒 Lv ${SOCK_LV[i]}</div>`);else if(!open)el.insertAdjacentHTML('beforeend',cvp(cs));
    if(o&&open)el.insertAdjacentHTML('beforeend',`<span class="lvd">Lv ${o.lv}</span>`);
    MODS[i].forEach((q,j)=>{if(!q||cs==='lv'||(!TL&&(!open||!k)))return;   /* round board: an empty / locked main star shows no side stars; a tier above your level is a ghost */
      const id=k&&(D.mods[k]||[])[j],kind=isMutJ(j)?'mut':'sup';
      if(!open){/* tier not carved yet: all its holes are plugged (the 2nd mutation hole still opens with the gem's level once the tier is carved) */
        const cid=j===0||j===3?pid:'q'+i+j;node(q.x,q.y,kind,'','pg wd'+(cs==='lv'?' lock':'')+sc(cid),j===3?`หลุมแปรสภาพที่ 2 · ชั้นนี้ยังไม่ได้สลัก (หลุมนี้เปิดเมื่อเจม C ในชั้นถึง Lv ${CAP})`:`${hole(cid).nm} · ${j===0?'เปิดพร้อมชั้นเสา':'สลักชั้นเสานี้ก่อน'}`,()=>clickCarve(cid),undefined,HOLE(q));return;}
      if((j===1||j===2)&&!carved('q'+i+j)){const cid='q'+i+j,st=cvState(cid);
        node(q.x,q.y,kind,'','pg wd'+(st==='rdy'?' rdy':'')+sc(cid),`${hole(cid).nm} · ยังไม่ได้สลัก — แตะเพื่อดูของที่ต้องส่ง`,()=>clickCarve(cid),undefined,HOLE(q));return;}
      const on=modOpen(i,j);
      if(j===3&&!on&&!id&&!TL)return;   /* the second mutation star only shows once its gem reaches the cap */
      node(q.x,q.y,kind,id?sg(id,kind):'',(on?'':k?'lock ':'dim ')+(sel&&sel.mod&&sel.mod[0]===i&&sel.mod[1]===j?'sel':''),
        !k?(TL?'ใส่เจม C ในหลุมใหญ่ของชั้นนี้ก่อน':'ใส่เจมหลักก่อน'):!on?`หลุมแปรสภาพที่ 2 · เปิดเมื่อเจมนี้ถึง Lv ${CAP}`:id?(kind==='mut'?MUTD[id][1]:SUPD[id][1]):(kind==='mut'?'ช่องแปรสภาพ':'ช่องเจมเสริม'),
        ()=>on?clickMod(i,j):info(!k?(TL?'ใส่เจม C ในหลุมใหญ่กลางชั้นนี้ก่อน แล้วหลุมบนปีกสองข้างจะใช้ได้':'ใส่เจมหลักในดาวดวงใหญ่ก่อน'):`หลุมแปรสภาพที่ 2 เปิดเมื่อเจม C ในชั้นนี้ถึงเลเวล ${CAP} — เป็นรางวัลของเจม ไม่ต้องสลัก`),undefined,HOLE(q));});});
  /* skill holes on the stone base + their gold mutation hole and 2 teal support holes */
  SSP.forEach((p,i)=>{const k=D.ss[i],open=ssOpen(i),id=D.sm[i],sid='s'+i,cs=open?'open':cvState(sid),lvl=cs==='lv';
    const pc=open?'':TL?' pg'+(lvl?' lock':cs==='rdy'?' rdy':''):' lock';
    const el=node(p.x,p.y,'skill',k&&open?(extracted(k)?sgemHtml(k):skArt(k)):'',`ss${pc}${k&&open&&!ssAct(i)?' off':''}${sel&&(sel.ss===i||sel.carve===sid)?' sel':''}`,
      open?(k?S[k].name+(id?' · '+MUTD[id][1]:''):'ดาวสกิลว่าง'):lvl?`หลุมสกิลที่ ${i+1} · เปิดที่ Lv ${SS_LV[i]}`:`หลุมสกิลที่ ${i+1} · ยังไม่ได้สลัก — แตะเพื่อดูของที่ต้องส่ง`,()=>clickSS(i),k&&open?(extracted(k)?'sg':'ic'):'',HOLE(p)||SKS);
    if(lvl)el.insertAdjacentHTML('beforeend',`<div class="lk">🔒 Lv ${SS_LV[i]}</div>`);else if(!open)el.insertAdjacentHTML('beforeend',cvp(cs));
    if(open){const q=SMP[i];node(q.x,q.y,'smut',id?sg(id,'mut'):'',`smut${k?'':' dim'}${sel&&sel.sm===i?' sel':''}`,!k?'วางสกิลก่อน':id?MUTD[id][1]:'ช่องแปรสภาพของดาวสกิล',()=>clickSM(i),undefined,HOLE(q));
      if(SSU[i])SSU[i].forEach((q,j)=>{const cid='u'+i+j;
        if(!carved(cid)){const st=cvState(cid);node(q.x,q.y,'ssup','','ssup pg'+(st==='rdy'?' rdy':'')+sc(cid),`${hole(cid).nm} · ยังไม่ได้สลัก — แตะเพื่อดูของที่ต้องส่ง`,()=>clickCarve(cid),undefined,HOLE(q));return;}
        const su=(D.ssu[i]||[])[j];node(q.x,q.y,'ssup',su?sg(su,'sup'):'',`ssup${k?'':' dim'}${sel&&sel.ssu&&sel.ssu[0]===i&&sel.ssu[1]===j?' sel':''}`,
        !k?'วางสกิลก่อน':su?SUPD[su][1]+' (ผลครึ่งหนึ่ง)':'ช่องเจมเสริมของหลุมสกิล (ผลครึ่งหนึ่ง)',()=>clickSSU(i,j),undefined,HOLE(q));});}
    else if(TL){/* a sealed skill hole: its gold and teal holes are plugged as well */
      node(SMP[i].x,SMP[i].y,'smut','','smut pg'+(lvl?' lock':'')+sc(sid),`หลุมแปรสภาพของหลุมสกิลที่ ${i+1} · เปิดพร้อมหลุมสกิล`,()=>clickCarve(sid),undefined,HOLE(SMP[i]));
      if(SSU[i])SSU[i].forEach((q,j)=>{const cid='u'+i+j;node(q.x,q.y,'ssup','','ssup pg'+(lvl?' lock':'')+sc(cid),`${hole(cid).nm} · สลักหลุมสกิลก่อน`,()=>clickCarve(cid),undefined,HOLE(q));});}});
  if(TL)win.querySelectorAll('#tgPole .tgT').forEach(e=>{const i=+e.dataset.t;e.classList.toggle('lk',!sockLvOK(i));e.classList.toggle('on',sockOpen(i)&&!!D.sock[i]);});   /* ghost = above your level; a reached but uncarved tier is drawn whole with plugged holes */
  const b1=win.querySelector('#tgOut'),b2=win.querySelector('#tgUp');
  b1.disabled=!(sel&&((sel.ssu&&(D.ssu[sel.ssu[0]]||[])[sel.ssu[1]])||(sel.sock!=null&&D.sock[sel.sock])||(sel.mod&&(D.mods[D.sock[sel.mod[0]]]||[])[sel.mod[1]])||(sel.ss!=null&&D.ss[sel.ss])||(sel.sm!=null&&D.sm[sel.sm])));
  const gk=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock])),go=gk&&D.own[gk];
  if(sel&&sel.skill&&!extracted(sel.skill)){const st=exState(sel.skill);b2.disabled=st!=='rdy';b2.textContent='⚗ สกัดเป็นเจม';b2.classList.toggle('cv',st==='rdy');}
  else if(sel&&sel.carve){const st=cvState(sel.carve);b2.disabled=st!=='rdy';b2.textContent=st==='open'?'สลักแล้ว':'⛏ สลักเปิด';b2.classList.toggle('cv',st==='rdy');}   /* a sealed hole: this button carves it */
  else if(selSG()){const o=sgo(selSG()),n=sgNeed(o);b2.disabled=!sgCan(o);b2.textContent=!o?'อัปเลเวล':o.lv>=CAP?'เลเวลตัน':n.brk.length?`ทะลุขีด Lv ${o.lv+1}`:`อัปเลเวลเจม ${o.lv+1}`;}
  else if(go){const nd=lvNeed(go);b2.disabled=go.lv>=CAP||bagN('tess')<nd.ess||zeny()<nd.z||(go.dup||0)<nd.dup;b2.textContent=go.lv>=CAP?'เลเวลตัน':nd.dup?`ทะลุขีด Lv ${go.lv+1}`:`อัปเลเวล ${go.lv+1}`;}
  else{b2.disabled=true;b2.textContent='อัปเลเวล';}
  if(!(sel&&(sel.carve||(sel.skill&&!extracted(sel.skill)))))b2.classList.remove('cv');
  preview();if(!keepInfo&&gk&&go)bindInfo(gk);}
function clickSock(i){const S=G('SKILLS');
  if(!sockOpen(i)){clickCarve('p'+i,sel&&sel.gem?'ชั้นนี้ยังไม่ได้สลัก — สลักเปิดก่อนจึงจะใส่เจมได้':'');return;}
  if(sel&&sel.gem){const k=sel.gem;if(!tierOK(k)){info(`${S[k].name} เป็นเจมขั้น ${S[k].tier} ใส่ได้ตั้งแต่ Lv ${TIER_LV[S[k].tier]}`);return;}
    const j=D.sock.indexOf(k),old=D.sock[i];if(j>=0&&j!==i)D.sock[j]=old;else if(old&&old!==k)giveBack(old);   /* a gem taken off the board gives its mutation / supports back */
    D.sock[i]=k;const fm=fitMods(i)+(j>=0&&j!==i?fitMods(j):'');sel=null;boost=1;save();showGem(k,'<br>✔ ใส่เจมแล้ว'+fm);render(true);return;}
  if(sel&&sel.sock!=null&&sel.sock!==i){const a=sel.sock;[D.sock[a],D.sock[i]]=[D.sock[i],D.sock[a]];const fm=fitMods(a)+fitMods(i);sel=null;boost=.6;save();render();if(fm)info('สลับชั้นแล้ว'+fm);return;}
  sel={sock:i};if(D.sock[i])showGem(D.sock[i],TL?'<br>แตะหลุมใหญ่ของชั้นอื่นเพื่อสลับ หรือกด "ถอดออก"':'<br>แตะดาวดวงใหญ่อื่นเพื่อสลับ หรือกด "ถอดออก"');else{setTab('gem');info('ดาวว่าง · เลือกเจมหลักในแท็บ "เจม C" แล้วแตะดาวดวงนี้');}render(true);}
/* ---- carving a hole open ---- */
/* a gem moved into tier i keeps its support gems only in holes of that tier that are carved (the rest go back to the bag) */
function fitMods(i){const k=D.sock[i],a=k&&D.mods[k];if(!a)return '';let n=0;
  [1,2].forEach(j=>{if(a[j]&&!carved('q'+i+j)){bagAdd('gsup_'+a[j],1);a[j]=null;n++;}});if(n)bagSave();
  return n?`<br>เจมเสริม ${n} เม็ดกลับเข้ากระเป๋า (หลุมเสริมของชั้นนี้ยังไม่ได้สลัก)`:'';}
function fitSSU(i){const a=D.ssu[i];if(!a)return '';let n=0;a.forEach((x,j)=>{if(x&&!carved('u'+i+j)){bagAdd('gsup_'+x,1);a[j]=null;n++;}});if(n)bagSave();
  return n?`<br>เจมเสริม ${n} เม็ดกลับเข้ากระเป๋า (หลุมขอบเขียวของหลุมนี้ยังไม่ได้สลัก)`:'';}
function clickCarve(id,why){sel={carve:id};info(cvInfo(id,why?`<br><span class="c">${why}</span>`:''));render(true);}
/* the plug splits and drops out of the hole, a flash and a few chips (board coordinates, so it scales with the totem) */
function crackFx(id){const h=hole(id),wd=h.t==='p'||h.t==='q';
  const pts=h.t==='s'?[SSP[h.i],SMP[h.i]]:h.t==='u'?[(SSU[h.i]||[])[h.j]]:h.t==='p'?[MAIN[h.i],MODS[h.i][0]]:[MODS[h.i][h.j]];
  pts.forEach((p,n)=>{if(!p)return;const r=p.r||14,d=document.createElement('div');d.className='tgCrk'+(wd?' wd':'');
    d.style.cssText=`left:${p.x}px;top:${p.y}px;width:${r*2}px;height:${r*2}px;--dl:${n*.09}s`;
    d.innerHTML='<b class="f"></b><i class="a"></i><i class="b"></i>'+Array.from({length:7},(_,q)=>`<s style="--a:${Math.round(q*51+Math.random()*25)}deg;--d:${(r*(1.3+Math.random()*.9)).toFixed(1)}px"></s>`).join('');
    board.appendChild(d);setTimeout(()=>d.remove(),1100);});}
function doCarve(id){const h=hole(id);if(!carveNow(id)){info(cvInfo(id));render(true);return;}
  boost=1;crackFx(id);
  const nx={s:'ต่อไป: แตะสกิลในแท็บ "สกิล" (ยังไม่ได้สกัด → กด ⚗ สกัดเป็นเจมก่อน) แล้วแตะหลุมนี้ · ใส่เจมแปรสภาพในหลุมขอบทองข้างล่าง'+(giftN()>0?' · 🎁 รับเจมแปรสภาพฟรีได้ที่ปุ่มด้านขวา':''),
    u:'ต่อไป: แตะเจมในแท็บ "เสริม" แล้วแตะหลุมนี้ (ในหลุมสกิลได้ผลครึ่งหนึ่ง)',
    p:'ต่อไป: แตะเจม C ในแท็บ "เจม C" แล้วแตะหลุมใหญ่ของชั้นนี้ · หลุมแปรสภาพด้านในปีกใช้ได้แล้ว',
    q:'ต่อไป: แตะเจมในแท็บ "เสริม" แล้วแตะหลุมนี้'+(D.sock[h.i]?'':' (ใส่เจม C ในชั้นนี้ก่อน)')}[h.t];
  sel=h.t==='s'?{ss:h.i}:h.t==='u'?{ssu:[h.i,h.j]}:h.t==='p'?{sock:h.i}:D.sock[h.i]?{mod:[h.i,h.j]}:null;
  setTab(h.t==='s'?'sk':h.t==='p'?'gem':'sup');render(true);
  info(`<b class="g">✔ สลักเปิด ${h.nm} แล้ว!</b><br>${nx}`);try{G('msg')(`⛏ สลักเปิด ${h.nm} แล้ว`);}catch(e){}}
/* extract a skill into its gem; when a hole was picked first, the new gem goes straight into it */
function doExtract(k){const S=G('SKILLS'),fr=exFree(),ph=sel&&sel.ph;if(!extractNow(k)){info(exInfo(k));render(true);return;}
  popK=k;boost=.8;try{const o=sgo(k);G('msg')(`⚗ สกัด ${S[k].name} เป็นเจมแล้ว — ระดับ ${QUAL[o?o.q:0].n}`);}catch(e){}
  if(ph!=null&&ssOpen(ph)&&!D.ss[ph]){sel={skill:k};clickSS(ph);return;}
  sel={skill:k};render(true);info(`<b class="g">✔ สกัด ${S[k].name} เป็นเจมแล้ว${fr?' (ครั้งแรกฟรี)':''}!</b> ${exRes(k)}<br>ต่อไป: แตะหลุมสกิลบนแท่นหินที่เปิดแล้ว เพื่อวางเจมสกิลนี้<hr style="border:0;border-top:1px solid #c9a46a;margin:5px 0">`+skillInfo(k));bindSG(k,x=>showSkill(k,x));}
/* what the extraction rolled: rarity + its special stats */
const exRes=k=>{const o=sgo(k);return o?`<br>ได้ระดับ ${qTag(o.q)} · สเตตัสพิเศษ: ${(o.lines||[]).map(l=>lnTxt(l,o.q,o.lv)).join(' · ')}`:'';};
/* ---- skill stars ---- */
const cDup=(k,id)=>{const A=ACT[k];return !!(A&&A.cmut&&A.cmut.includes(id));};   /* the skill already gets this mutation from a C gem */
function ssInfo(i,extra){const S=G('SKILLS'),k=D.ss[i],id=D.sm[i];
  let h=`<b>⭐ ${TL?'หลุมสกิลที่':'ดาวสกิลดวงที่'} ${i+1}</b> · เปิดที่ Lv ${SS_LV[i]}${i?'':' (ฟรี)'}<br>`;
  if(!k)return h+(TL?'ว่าง · เลือกเจมสกิลในแท็บ "สกิล" (สกิลที่ยังไม่ได้สกัด กด ⚗ สกัดก่อน) แล้วแตะหลุมนี้':'ว่าง · เลือกสกิลในแท็บ "สกิล" แล้วแตะดาวนี้')+(extra||'');
  const s=S[k],l=(G('LV')||{})[k]||0;
  const fu=ssChain(k).slice(1).map(q=>S[q].name);
  h+=`สกิล <b>${s.name}</b>${fu.length?' + ท่าต่อ '+fu.join(', '):''} · สาย ${BRN[s.br]||s.br} · Lv สกิล ${l}${l?'':' <b class="c">(ยังไม่ได้เรียน — ดาวนี้ยังไม่มีผล)</b>'}<br>`+sgSection(k);
  if(id){const m=MUTD[id];h+=`แปรสภาพ <b>${m[1]}</b>${cDup(k,id)?' <b class="c">(ซ้ำกับเจม C — ไม่มีผล)</b>':mutTag(id)}<br><span class="g">ได้: ${mutG(id)}</span><br><span class="c">เสีย: ${mutC(id)}</span><br><button class="ssb" data-ssoff="${i}">ถอดเฉพาะเจมแปรสภาพ</button>`;}
  else{const av=MUT.filter(m=>free('mut',m[0])>0&&!cDup(k,m[0])&&used('mut',m[0])<2);   /* one-tap buttons: no need to scroll the gem list on a phone */
    h+=av.length?`<span style="color:#2a5a8a">ยังไม่ใส่เจมแปรสภาพ — แตะปุ่มเพื่อใส่เลย</span><div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px">${av.map(m=>`<button class="ssb" data-ssput="${m[0]}" style="margin:0">${m[1]} ×${free('mut',m[0])}</button>`).join('')}</div>`
      :`<span style="color:#2a5a8a">ยังไม่มีเจมแปรสภาพในกระเป๋า — ${giftN()?'รับฟรีที่ปุ่ม 🎁':'หาได้จากดันเจี้ยน บอส มอนสนาม (หายาก) หรือตลาดกลาง'}</span>`;}
  return h+'<br><span style="opacity:.75">ผลติดไปกับสกิลจริง: คูลดาวน์ / SP ในคำอธิบายสกิลเปลี่ยนตาม · ปุ่มสกิลมีเครื่องหมายเจม · ย้ายสกิล = แตะสกิลในแท็บ "สกิล" แล้วแตะดาวใหม่ · "ถอดออก" = เอาสกิลและเจมออกจากดาว</span>'+(extra||'');}
function showSS(i,extra){info(ssInfo(i,extra));win.querySelectorAll('#tgInfo [data-ssput]').forEach(b=>b.onclick=()=>placeSM(i,b.dataset.ssput));const b=win.querySelector('#tgInfo [data-ssoff]');if(b)b.onclick=()=>{if(D.sm[i]){bagAdd('gmut_'+D.sm[i],1);bagSave();D.sm[i]=null;save();}showSS(i,'<br><span class="g">✔ ถอดเจมแปรสภาพกลับเข้ากระเป๋าแล้ว</span>');render(true);};if(D.ss[i])bindSG(D.ss[i],x=>showSS(i,x));}
function skillInfo(k){const S=G('SKILLS'),s=S[k],j=D.ss.indexOf(k),A=ACT[k];
  const fu=ssChain(k).slice(1).map(q=>S[q].name);
  return `<b>${s.name}</b> · สาย ${BRN[s.br]||s.br} · Lv สกิล ${(G('LV')||{})[k]||0}<br>${s.th||''}${fu.length?`<br><span style="color:#6a4a2a">ท่าต่อ ${fu.join(', ')} ได้ผลแปรสภาพ + สเตตัสพิเศษฝั่งการตีไปด้วย (คูลดาวน์ / SP คิดที่ท่าเริ่ม)</span>`:''}<br>`+sgSection(k)
    +(j>=0?`อยู่บน${TL?'หลุมสกิลที่':'ดาวสกิลดวงที่'} ${j+1}${D.sm[j]?' · แปรสภาพ <b>'+MUTD[D.sm[j]][1]+'</b>':''} — ย้ายได้: แตะดาวสกิลดวงอื่นตอนนี้`
      :TL?'<span style="color:#2a5a8a">แตะหลุมสกิลบนแท่นหินที่เปิดแล้วเพื่อวาง แล้วใส่เจมแปรสภาพ (ขอบทอง)'+(SSU.length?' และเจมเสริม (ขอบเขียว)':'')+' — สกิลนี้จะเปลี่ยนไปตามเจมจริงๆ</span>':'<span style="color:#2a5a8a">แตะดาวสกิลวงใน (ดาวเงิน) ที่เปิดแล้วเพื่อวาง แล้วใส่เจมแปรสภาพ — สกิลนี้จะเปลี่ยนไปตามเจมจริงๆ</span>')
    +(A&&A.cmut&&A.cmut.length?`<br>ได้แปรสภาพจากเจม C อยู่แล้ว: ${A.cmut.map(x=>MUTD[x][1]).join(', ')}`:'');}
function placeSM(i,id){const S=G('SKILLS'),k=D.ss[i];
  if(!k){info('วางสกิลบนดาวนี้ก่อน แล้วค่อยใส่เจมแปรสภาพ');return;}
  if(D.sm[i]===id){showSS(i);return;}
  if(free('mut',id)<=0){info('ไม่มีเจมนี้เหลือในกระเป๋า');return;}
  if(cDup(k,id)){info(`${S[k].name} ได้ <b>${MUTD[id][1]}</b> จากเจม C อยู่แล้ว — ใส่ซ้ำไม่มีผล`);return;}
  if(used('mut',id)>=2){info('เจมแปรสภาพชนิดเดียวกันใส่ได้ไม่เกิน 2 เม็ดทั้งแผง (นับดาวสกิลด้วย)');return;}
  if(D.sm[i])bagAdd('gmut_'+D.sm[i],1);bagAdd('gmut_'+id,-1);bagSave();D.sm[i]=id;sel={ss:i};boost=.8;save();
  showSS(i,`<br><span class="g">✔ ใส่ ${MUTD[id][1]} ให้ ${S[k].name} แล้ว — ลองใช้สกิลดูได้เลย</span>`);render(true);}
function clickSS(i){
  if(!ssOpen(i)){clickCarve('s'+i,sel&&(sel.skill||sel.mut||sel.sup)?'หลุมนี้ยังไม่ได้สลัก — สลักเปิดก่อนจึงจะวางได้':'');return;}
  if(sel&&sel.skill){const k=sel.skill;if(!ssLearned(k)){info('วางได้เฉพาะสกิลกดใช้ (Basic / A / B) ที่เรียนแล้ว');return;}
    if(!extracted(k)){sel={skill:k,ph:i};info(exInfo(k,'<br><span class="c">สกิลนี้ยังไม่ได้สกัดเป็นเจม — สกัดก่อน แล้วระบบจะวางในหลุมนี้ให้</span>'));render(true);return;}
    const j=D.ss.indexOf(k);let note='<br><span class="g">✔ วางสกิลแล้ว</span>';
    if(j>=0&&j!==i){[D.ss[j],D.ss[i]]=[D.ss[i],D.ss[j]];[D.sm[j],D.sm[i]]=[D.sm[i],D.sm[j]];[D.ssu[j],D.ssu[i]]=[D.ssu[i],D.ssu[j]];note+=fitSSU(i)+fitSSU(j);}   /* moving a placed skill swaps the two stars (mutations travel with their skill) */
    else D.ss[i]=k;   /* a new skill takes over the star's mutation */
    if(D.sm[i]&&cDup(k,D.sm[i])){bagAdd('gmut_'+D.sm[i],1);bagSave();note+=`<br>${MUTD[D.sm[i]][1]} ซ้ำกับเจม C ของสกิลนี้ — เก็บเข้ากระเป๋าให้แล้ว`;D.sm[i]=null;}
    sel={ss:i};boost=.8;save();showSS(i,note);render(true);return;}
  if(sel&&sel.mut){placeSM(i,sel.mut);return;}
  if(sel&&sel.sup){if(SSU[i]&&D.ss[i]){const j=(D.ssu[i]||[]).findIndex(x=>!x);clickSSU(i,j<0?0:j);return;}info(SSU.length?'วางสกิลในหลุมนี้ก่อน แล้วค่อยใส่เจมเสริมในหลุมขอบเขียว':'ดาวสกิลใส่ได้เฉพาะเจมแปรสภาพ (เจมเสริมใส่ที่ดาว C วงนอก)');return;}
  setTab(D.ss[i]?(D.sm[i]?tab:'mut'):'sk');sel={ss:i};showSS(i);render(true);}
function clickSSU(i,j){const S=G('SKILLS'),k=D.ss[i];if(!uOpen(i,j)){clickCarve(ssOpen(i)?'u'+i+j:'s'+i);return;}const arr=D.ssu[i]||(D.ssu[i]=[null,null]);
  if(!k){setTab('sk');sel={ss:i};info('วางสกิลในหลุมสกิลนี้ก่อน (เลือกในแท็บ "สกิล") แล้วค่อยใส่เจมเสริมในหลุมขอบเขียวด้านล่าง');render(true);return;}
  if(sel&&sel.sup){const id=sel.sup;if(free('sup',id)<=0){info('ไม่มีเจมนี้เหลือในกระเป๋า');return;}
    if(arr.includes(id)&&arr[j]!==id){info('เจมเสริมชนิดเดียวกันใส่ซ้ำในหลุมสกิลเดียวกันไม่ได้');return;}
    if(arr[j])bagAdd('gsup_'+arr[j],1);bagAdd('gsup_'+id,-1);bagSave();arr[j]=id;sel={ssu:[i,j]};boost=.8;save();
    info(`✔ ใส่ <b>${SUPD[id][1]}</b> ให้ ${S[k].name} แล้ว — ในหลุมสกิลได้ผลครึ่งหนึ่ง (${SUPD[id][4]} → ครึ่งเดียว)`);render(true);return;}
  if(sel&&sel.mut){info('หลุมขอบเขียวรับเฉพาะเจมเสริม · เจมแปรสภาพใส่หลุมกลางขอบทอง');return;}
  setTab('sup');sel={ssu:[i,j]};info(arr[j]?supInfo(arr[j])+`<br>อยู่ในหลุมสกิล ${i+1} · ${S[k].name} — ผลครึ่งหนึ่ง · กด "ถอดออก" เพื่อเก็บเข้ากระเป๋า`
    :`หลุมเจมเสริมของ <b>${S[k].name}</b> ว่าง · แตะเจมในแท็บ "เสริม" เพื่อใส่ (ในหลุมสกิลได้ผลครึ่งหนึ่งของในชั้นเสา)`);render(true);}
function clickSM(i){const S=G('SKILLS'),k=D.ss[i];if(!ssOpen(i)){clickCarve('s'+i);return;}setTab(k?'mut':'sk');
  if(sel&&sel.mut){placeSM(i,sel.mut);return;}
  if(sel&&sel.sup){info(SSU.length?'หลุมขอบทองรับเฉพาะเจมแปรสภาพ · เจมเสริมใส่หลุมขอบเขียวสองข้าง':'ดาวสกิลใส่ได้เฉพาะเจมแปรสภาพ (เจมเสริมใส่ที่ดาว C วงนอก)');return;}
  if(!k){info(TL?'วางสกิลในหลุมสกิลก่อน (เลือกในแท็บ "สกิล")':'วางสกิลบนดาวสกิลก่อน (เลือกในแท็บ "สกิล")');return;}
  sel={sm:i};info(D.sm[i]?mutInfo(D.sm[i])+`<br>อยู่ในดาวสกิล ${i+1} · ${S[k].name} · กด "ถอดออก" เพื่อเก็บเข้ากระเป๋า`:'ช่องแปรสภาพของดาวสกิลว่าง · เลือกเจมในแท็บ "แปรสภาพ" แล้วแตะช่องนี้ (หรือแตะดาวสกิลก็ได้)');render(true);}
function clickMod(i,j){const k=D.sock[i];if(!k){info(TL?'ใส่เจม C ในหลุมใหญ่ของชั้นนี้ก่อน':'ใส่เจมหลักก่อน');return;}const arr=D.mods[k]||(D.mods[k]=[null,null,null,null]);while(arr.length<4)arr.push(null);const kind=isMutJ(j)?'mut':'sup',pre=kind==='mut'?'gmut_':'gsup_';
  if(sel&&sel[kind]){const id=sel[kind];if(free(kind,id)<=0){info('ไม่มีเจมนี้เหลือในกระเป๋า');return;}
    if(kind==='sup'&&arr.includes(id)&&arr[j]!==id){info('เจมเสริมชนิดเดียวกันใส่ซ้ำในเจมเดียวกันไม่ได้');return;}
    if(kind==='mut'&&((j===0&&arr[3]===id)||(j===3&&arr[0]===id))){info('แปรสภาพสองช่องของเจมเดียวกันต้องเป็นคนละชนิด');return;}
    if(kind==='mut'&&used('mut',id)>=2&&arr[j]!==id){info('เจมแปรสภาพชนิดเดียวกันใส่ได้ไม่เกิน 2 เม็ดทั้งแผง');return;}
    if(arr[j])bagAdd(pre+arr[j],1);bagAdd(pre+id,-1);bagSave();
    arr[j]=id;sel=null;boost=.8;save();info(`ใส่ <b>${kind==='mut'?MUTD[id][1]:SUPD[id][1]}</b> ใน ${G('SKILLS')[k].name} แล้ว`);render(true);return;}
  if(sel&&(sel.mut||sel.sup)){info(TL?(sel.mut?'เจมแปรสภาพใส่หลุมในปีกเสา (หรือหลุมขอบทองใต้หลุมสกิล)':'เจมเสริมใส่หลุมนอกปีกเสา (หรือหลุมขอบเขียวใต้หลุมสกิล)'):(sel.mut?'เจมแปรสภาพใส่ได้เฉพาะดาวกลาง (ขอบรูน)':'เจมเสริมใส่ได้เฉพาะดาวเล็ก'));return;}
  setTab(kind);sel={mod:[i,j]};info(arr[j]?(kind==='mut'?mutInfo(arr[j]):supInfo(arr[j]))+`<br>อยู่ใน ${G('SKILLS')[k].name} · กด "ถอดออก" เพื่อเก็บเข้ากระเป๋า`:(kind==='mut'?'ช่องแปรสภาพว่าง · เลือกเจมในแท็บ "แปรสภาพ"':'ช่องเจมเสริมว่าง · เลือกเจมในแท็บ "เสริม"'));render(true);}
win.querySelector('#tgOut').onclick=()=>{if(!sel)return;
  if(sel.sock!=null){const k=D.sock[sel.sock];D.sock[sel.sock]=null;if(k)giveBack(k);}
  else if(sel.mod){const k=D.sock[sel.mod[0]],a=D.mods[k];if(a&&a[sel.mod[1]]){bagAdd((isMutJ(sel.mod[1])?'gmut_':'gsup_')+a[sel.mod[1]],1);bagSave();a[sel.mod[1]]=null;}}
  else if(sel.ssu){const [i,j]=sel.ssu,a=D.ssu[i];if(a&&a[j]){bagAdd('gsup_'+a[j],1);bagSave();a[j]=null;}}
  else if(sel.ss!=null||sel.sm!=null){const i=sel.ss!=null?sel.ss:sel.sm;if(D.sm[i]){bagAdd('gmut_'+D.sm[i],1);bagSave();D.sm[i]=null;}
    if(sel.ss!=null){D.ss[i]=null;D.ssu[i]=(D.ssu[i]||[]).map(x=>{if(x){bagAdd('gsup_'+x,1);bagSave();}return null;});}}
  sel=null;save();info('ถอดออกแล้ว (เจมแปรสภาพ / เจมเสริมกลับเข้ากระเป๋า)');render();};
win.querySelector('#tgUp').onclick=()=>{if(sel&&sel.skill&&!extracted(sel.skill)){doExtract(sel.skill);return;}if(sel&&sel.carve){doCarve(sel.carve);return;}
  {const sk=selSG();if(sk){const m=sgUp(sk);if(m==null)return;boost=.7;if(sel.ss!=null)showSS(sel.ss,m);else showSkill(sk,m);render(true);return;}}const k=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock]));const o=k&&D.own[k];if(!o||o.lv>=CAP)return;
  const nd=lvNeed(o);if(bagN('tess')<nd.ess||(o.dup||0)<nd.dup||zeny()<nd.z)return;payZ(nd.z);bagAdd('tess',-nd.ess);bagSave();o.dup-=nd.dup;o.lv++;const add=openSlots(o,'c',o.lv-1);boost=.7;save();
  showGem(k,`<br><span class="g">✔ ${nd.dup?'ทะลุขีด! ':''}เลเวลเจม ${o.lv}${o.lv===CAP?' · เปิดช่องแปรสภาพที่ 2!':''}</span>`+add);render(true);};

/* ---------- totem shrine: carve (random gem) · craft from shards (the gem you choose) · dismantle spare copies ---------- */
let wsTab='carve',wsRes='',wsKey=null;
const wsEl=win.querySelector('#tgWs');
/* a new copy of a C gem you own: better rarity → it waits as o.cand beside the old one (keep either; the other becomes the spare copy), else a spare */
function gain(k,q){const o=D.own[k];if(!o){D.own[k]={lv:1,q,lines:rollLines(q,1,null,'c'),dup:0};return 'new';}
  o.dup=(o.dup||0)+1;if(q>(o.q||0)&&(!o.cand||q>o.cand.q)){o.cand={q,lines:rollLines(q,o.lv,null,'c')};return 'cand';}
  return 'dup';}
const pityTxt=()=>`แต้มนำโชค: มหากาพย์ขึ้นไป ${D.pe||0}/${C.pityE||20} · ตำนาน ${D.pity||0}/${C.pity||50}`;
const oddsTxt=()=>QUAL.map(Q=>`<span style="color:${Q.c}">${Q.n} ${+(Q.p*100).toFixed(1)}%</span> (${Q.lines} ช่อง)`).join(' · ');
function resHtml(k,q,how){const S=G('SKILLS')[k],o=D.own[k];return `<span class="pop rgem">${cgemHtml(k,q)}</span><div style="flex:1">${qTag(q)} <b style="color:${QUAL[q].c}">${S.name}</b><br><small>${how==='new'?'ได้เจมใหม่! สเตตัสพิเศษ: '+o.lines.map(l=>lnTxt(l,o.q,o.lv)).join(' · '):how==='cand'?'ระดับสูงกว่าเม็ดเดิม! เลือกเก็บอันไหนก็ได้ (เลเวลเดิมอยู่ · อีกเม็ดเป็นเจมซ้ำ)':'ได้เจมซ้ำ +1 (ใช้ทะลุขีด / ย่อยเป็นชิ้นส่วน)'}</small>${how==='cand'?candHtml(o):''}</div>`;}
const tierKeys=t=>cKeys().filter(k=>G('SKILLS')[k].tier===t);
const icn=(id,need)=>{const a=AF(),h=a&&a.ui?a.ui.etcIcon(id,22):'',have=bagN(id);return `<span class="ic ${have<need?'no':''}" title="${a?a.ui.etcName(id):id}">${h}${fmtN(have)}/${need}</span>`;};
function giftBuild(){const n=giftN();
  wsEl.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><h4>🎁 ของขวัญดาวสกิล</h4><span class="note" style="margin-left:auto">เลือกได้อีก ${n} เม็ด</span><button class="go" id="wsX">${n?'ไว้ทีหลัง':'✕ กลับแผง'}</button></div>
    <div class="note">ดาวสกิลเปิด 1 ดวง = เลือกเจมแปรสภาพฟรี 1 เม็ด · ทุกเม็ด "ได้อย่าง เสียอย่าง" — สกิลเดียวกันใส่คนละเม็ด เล่นไม่เหมือนกัน · ถอดได้ตลอด กลับเข้ากระเป๋า · เม็ดต่อไปได้จากดันเจี้ยน บอส มอนสนาม (หายาก) หรือตลาดกลาง</div>
    <div class="res">${wsRes||'<span class="note">เลือกแบบที่อยากลองกับสกิลของคุณ</span>'}</div>
    <div class="gg">${MUT.map(m=>`<div class="gc"><span class="gem">${sg(m[0],'mut')}</span><div><b>${m[1]}</b> <small style="opacity:.7">มี ${bagN('gmut_'+m[0])}</small><br><span style="color:#9fe8a0">ได้: ${m[4]}</span><br><span style="color:#ff9a8a">เสีย: ${m[5]}</span></div><button class="go" data-gift="${m[0]}" ${n?'':'disabled'}>เลือก</button></div>`).join('')}</div>`;
  wsEl.querySelector('#wsX').onclick=()=>{wsEl.classList.remove('open');wsTab='carve';render();};
  wsEl.querySelectorAll('[data-gift]').forEach(b=>b.onclick=()=>{const id=b.dataset.gift;if(giftN()<=0)return;bagAdd('gmut_'+id,1);bagSave();D.gift=(D.gift||0)+1;save();
    wsRes=`<span class="pop" style="display:inline-block;width:48px;height:48px;position:relative">${sg(id,'mut')}</span><div>ได้ <b>${MUTD[id][1]}</b> แล้ว!<br><small>${TL?'วางสกิลในหลุมบนแท่นหิน':'วางสกิลบนดาวเงินวงใน'} แล้วกดปุ่มใส่เจมในช่องรายละเอียด</small></div>`;
    if(giftN()>0)giftBuild();else{wsEl.classList.remove('open');wsTab='carve';sel=null;setTab('sk');render();info(`✔ ได้ <b>${MUTD[id][1]}</b> แล้ว · ต่อไป: แตะสกิลในแท็บ "สกิล" → ${TL?'กด ⚗ สกัดเป็นเจม (ครั้งแรกฟรี) → แตะหลุมสกิลบนแท่นหินที่เปิดแล้ว':'แตะดาวเงินวงในที่เปิดแล้ว'} → กดปุ่ม "${MUTD[id][1]}" ที่ขึ้นตรงนี้`);}});}
function openGift(){wsTab='gift';wsRes='';wsEl.classList.add('open');giftBuild();}
function wsBuild(){if(!wsEl.classList.contains('open'))return;if(wsTab==='gift'){giftBuild();return;}const S=G('SKILLS');let body='';
  if(wsTab==='carve'){body=[1,2,3,4].map(t=>{const ks=tierKeys(t),z=C.carveZ(t),ok=bagN('tstone'+t)>=C.carveStones&&zeny()>=z&&ks.length;
      return `<div class="row"><div class="nm"><b>หินโทเท็มขั้น ${t}</b> → เจมขั้น ${t} (สุ่ม 1 ใน ${ks.length}: ${ks.map(k=>S[k].name).join(' · ')})</div>${icn('tstone'+t,C.carveStones)}<span class="ic">${fmtN(z)}z</span><button class="go" data-carve="${t}" ${ok?'':'disabled'}>⛏ แกะ</button></div>`;}).join('')
      +`<div class="note">ระดับสุ่ม: ${oddsTxt()} · เลเวลเจม 10 / 20 / 30 / 40 เปิดช่องสเตตัสพิเศษเพิ่มทีละ 1 · ${pityTxt()} (นับรวมการสกัดเจมสกิล) · หินขั้น 1 ดรอปจากมอน Lv 1–29, ขั้น 2 Lv 30–59, ขั้น 3 Lv 60–89, ขั้น 4 Lv 90+ · หาเพิ่มที่ตลาดกลาง (หมวดเจม/โทเท็ม)</div>`;}
  else if(wsTab==='craft'){body=`<div class="gg">${cKeys().map(k=>{const t=S[k].tier,z=C.craftZ(t),ok=bagN('tfrag'+t)>=C.craftFrag&&zeny()>=z;
      return `<div class="gc"><span class="gem">${cgemHtml(k)}</span><div><b>${S[k].name}</b><br>ขั้น ${t} · ${icn('tfrag'+t,C.craftFrag)} · ${fmtN(z)}z</div><button class="go" data-craft="${k}" ${ok?'':'disabled'}>คราฟต์</button></div>`;}).join('')}</div>
      <div class="note">เลือกชนิดเจมเองได้ (ระดับยังสุ่ม นับรวมแต้มนำโชค · ${pityTxt()}) · ชิ้นส่วนได้จากการย่อยเจมซ้ำ หรือซื้อที่ตลาดกลาง</div>`;}
  else{const ks=cKeys().filter(k=>D.own[k]&&D.own[k].dup>0);body=ks.length?`<div class="gg">${ks.map(k=>{const t=S[k].tier;
      return `<div class="gc"><span class="gem">${cgemHtml(k)}</span><div><b>${S[k].name}</b><br>เจมซ้ำ ×${D.own[k].dup} → ชิ้นส่วนขั้น ${t} ${C.dismFrag} + แก่น ${C.dismEss}</div><button class="go" data-dism="${k}">ย่อย 1</button></div>`;}).join('')}</div>`:'<div class="note">ยังไม่มีเจมซ้ำ</div>';
    body+=`<div class="note">เก็บเจมซ้ำไว้ใช้ทะลุขีดเลเวล 10 / 20 / 30 / 40 (ใช้ 1 / 1 / 2 / 2 เม็ด) — ย่อยเฉพาะที่เหลือ</div>`;}
  wsEl.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><h4>⛏ ศาลโทเท็ม</h4><span class="note" style="margin-left:auto">แก่น ${fmtN(bagN('tess'))} · ${fmtN(zeny())}z</span><button class="go" id="wsX">✕ กลับแผง</button></div>
    <div class="tabs">${[['carve','⛏ แกะหิน (สุ่ม)'],['craft','🔨 คราฟต์จากชิ้นส่วน (เลือกได้)'],['dism','♻ ย่อยเจมซ้ำ']].map(([k,n])=>`<button data-wt="${k}" class="${wsTab===k?'on':''}">${n}</button>`).join('')}</div>
    <div class="res">${wsRes||'<span class="note">ผลการแกะ / คราฟต์จะแสดงที่นี่</span>'}</div>${body}`;
  wsEl.querySelector('#wsX').onclick=()=>{wsEl.classList.remove('open');render();};
  wsEl.querySelectorAll('[data-wt]').forEach(b=>b.onclick=()=>{wsTab=b.dataset.wt;wsRes='';wsBuild();});
  {const o=wsKey&&D.own[wsKey],r=wsEl.querySelector('.res');if(o&&o.cand&&r)bindCand(r,o,yes=>{const k=wsKey;wsRes=`<span class="pop rgem">${cgemHtml(k)}</span><div>${yes?`✔ ใช้ <b>${G('SKILLS')[k].name}</b> ระดับ ${qTag(o.q)} แล้ว — เม็ดเดิมเป็นเจมซ้ำ`:`เก็บ <b>${G('SKILLS')[k].name}</b> อันเดิมไว้ — เม็ดใหม่เป็นเจมซ้ำ`}</div>`;wsBuild();});}
  wsEl.querySelectorAll('[data-carve]').forEach(b=>b.onclick=()=>{const t=+b.dataset.carve,ks=tierKeys(t),z=C.carveZ(t);if(bagN('tstone'+t)<C.carveStones||!ks.length||!payZ(z))return;
    bagAdd('tstone'+t,-C.carveStones);bagSave();const k=ks[Math.floor(Math.random()*ks.length)],q=rollQ(),how=gain(k,q);save();wsRes=resHtml(k,q,how);wsKey=k;wsBuild();});
  wsEl.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>{const k=b.dataset.craft,t=G('SKILLS')[k].tier,z=C.craftZ(t);if(bagN('tfrag'+t)<C.craftFrag||!payZ(z))return;
    bagAdd('tfrag'+t,-C.craftFrag);bagSave();const q=rollQ(),how=gain(k,q);save();wsRes=resHtml(k,q,how);wsKey=k;wsBuild();});
  wsEl.querySelectorAll('[data-dism]').forEach(b=>b.onclick=()=>{const k=b.dataset.dism,o=D.own[k];if(!o||!(o.dup>0))return;const t=G('SKILLS')[k].tier;o.dup--;bagAdd('tfrag'+t,C.dismFrag);bagAdd('tess',C.dismEss);bagSave();save();
    wsRes=`<span>♻ ย่อย ${G('SKILLS')[k].name} → ชิ้นส่วนขั้น ${t} +${C.dismFrag} · แก่น +${C.dismEss}</span>`;wsBuild();});}
win.querySelector('#tgWsB').onclick=()=>{if(wsTab==='gift')wsTab='carve';wsEl.classList.add('open');wsRes='';wsBuild();};
win.querySelector('#tgGiftB').onclick=()=>openGift();

function fit(){for(const id of ['#tgLeft','#tgRight']){const p=win.querySelector(id);if(p&&p.offsetWidth)p.style.setProperty('--s',(p.offsetWidth/1024).toFixed(4));}
  const m=win.querySelector('#tgMid'),sc=win.querySelector('#tgScr'),zm=win.querySelector('#tgZoom');
  if(TL){const hs=m.clientHeight/BS,ws=m.clientWidth/TL.cw;
    if(hs<.62&&ws>hs*1.3){/* a short (phone) column: fit the totem's width and let the pole scroll — the holes would be too small to tap otherwise */
      const s=Math.min(ws,1.25),was=sc.classList.contains('scr');sc.classList.add('scr');zm.style.width=TL.cw*s+'px';zm.style.height=BS*s+'px';
      board.style.transform=`translate(${-(HX-TL.cw/2)*s}px,0) scale(${s})`;if(!was)sc.scrollTop=sc.scrollHeight;return;}}
  sc.classList.remove('scr');zm.style.width=zm.style.height='';
  const s=Math.max(.3,Math.min(m.clientWidth,m.clientHeight)/BS);board.style.transform=`scale(${s})`;}
const DEF_INFO=TL?'<b>เสาโทเท็มของคุณ</b> — สลักขึ้นใหม่จากเศษโทเท็มใหญ่ ทีละชั้นตามเลเวล<br><b>⛏ หลุมที่มีฝาปิด</b> ต้องส่งของสลักเปิดก่อน — แตะหลุมเพื่อดูว่าต้องใช้อะไร (หลุมสกิลแรกเปิดฟรีให้ลอง)<br><b>แท่นหินฐานเสา = ดาวสกิล</b> (เปิด Lv '+SS_LV.join(' / ')+'): สกัดสกิลที่เรียนแล้วเป็นเจม (แท็บ "สกิล" → ⚗ สกัด · ครั้งแรกฟรี) แล้วใส่ในหลุม แล้วใส่เจมแปรสภาพในหลุมเล็ก'+(SSU.length?' (ขอบทอง) และเจมเสริมในหลุมขอบเขียว 2 หลุม (ผลครึ่งหนึ่ง)':'ข้างๆ')+' — สกิลจะเปลี่ยนไปจริงตามเจม<br><b>ชั้นเสา 5 ชั้น = เจม C</b> (หมี Lv 60 · นกฮูก 70 · หมาป่า 80 · อินทรี 90 · นกสายฟ้า 99): หลุมใหญ่กลางชั้น = เจมหลัก · หลุมด้านในปีก = แปรสภาพ (ข้างขวาเปิดเมื่อเจมเลเวลตัน) · หลุมด้านนอกปีก = เจมเสริม':'<b>ดาวเงินวงใน = ดาวสกิล</b> (เปิด Lv '+SS_LV.join(' / ')+'): เลือกสกิลที่เรียนแล้วในแท็บ "สกิล" วางบนดาว แล้วใส่เจมแปรสภาพ — สกิลจะเปลี่ยนไปจริงตามเจม<br><b>ดาวทองวงนอก = เจม C</b> (Lv 60–99): ดาวใหญ่ = เจมหลัก · ดาวขอบรูน = แปรสภาพ · ดาวเล็ก = เจมเสริม · เส้นทางดาวเปิดเพิ่มทุก 10 เลเวล';
let giftSeen=false;
const DEF_MORE=()=>`<br><b>📑 หน้า 1–3</b> (แท็บบนสุดของช่องนี้): จัดเสาไว้ 3 แบบ เช่น ฟาร์ม / บอส / ปาร์ตี้ — สลับได้ฟรี<br><b>🔗 เรโซแนนซ์ / ⚖ สมดุล</b>: เจมแปรสภาพแบบเดียวกัน 2 เม็ด = ข้อดีแรงขึ้น · ไม่ซ้ำกันครบ ${BAL_N} แบบ = ข้อเสียเบาลง — แตะปุ่ม 🔗 มุมขวาบนของเสา`+resLine();
function open(){D=load();sel=null;win.classList.add('open');setTab(tab);fit();try{apply();}catch(e){}render();info(DEF_INFO+DEF_MORE());win.classList.add('open');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  if(giftN()>0&&!giftSeen){giftSeen=true;openGift();}}
function close(){win.classList.remove('open');}
addEventListener('resize',()=>{if(win.classList.contains('open'))fit();});
addEventListener('keydown',e=>{if(e.key==='Escape'&&win.classList.contains('open'))close();
  if((e.key==='g'||e.key==='G')&&!/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))win.classList.contains('open')?close():open();});
(function addBtn(){const mg=document.getElementById('mgrid');if(!mg||!mg.children.length){setTimeout(addBtn,300);return;}if(mg.querySelector('[data-m="tgem"]'))return;
  const b=document.createElement('button');b.dataset.m='tgem';b.title='กลุ่มดาวโทเท็ม (G)';
  b.innerHTML=`<span class="kb">G</span><img src="${BD}sock_main.webp" alt="" draggable="false" style="width:100%;height:100%;object-fit:contain">`;
  b.addEventListener('click',e=>{e.stopPropagation();e.stopImmediatePropagation();open();},true);mg.appendChild(b);})();

/* =====================================================================
   COMBAT HOOKS (design step 2–3) — generic for every hero
   • A socketed main gem = its C skill is learned (LV[k]=1); no C points any more. Unsocketed C skills are off.
     window.__GEMS_ALL=1 keeps every C skill on (old bench setup).
   • The mutation + supports of a gem work on its TARGET skill: the gem itself when it is a cast skill, else the
     cast skill it upgrades (last cast skill named in its requirement; TGT_OVR fixes odd ones). A passive with no
     cast parent (e.g. Endless Chain → Wolf Combo) targets normal attacks at half strength, no cooldown/SP effects.
   • Gem level: target skill power ×(1 + 0.03 per level above 1).
   • Hooks wrap hurt / castSkillNow / addBuff / ENH_ABSORB / canRaise / skChange; the per-frame work runs in one
     core fx (re-added if the bench clears fx).
   ===================================================================== */
const TGT_OVR={wolf:{stormChain:'thunderFang'}};
let ACT={},lastSig='';const REC={},STK={},NB={},LASTC={};let curCast=null,GU={sh:0,shT:0,guardT:0,rageT:0,drT:0,drV:0,allT:-99};
const now=()=>G('gameTime')||0,plv=()=>(G('PS')||{}).lv||1;
function targetOf(k){const S=G('SKILLS'),s=S[k],o=(TGT_OVR[HERO]||{})[k];if(o&&S[o])return o;if(!s.passive&&s.make)return k;
  const rq=s.rq||'';let best=null,bi=-1;for(const q in S){const t=S[q];if(t.br==='C'||t.passive||!t.make||!t.name)continue;const i=rq.lastIndexOf(t.name);if(i>bi){bi=i;best=q;}}
  return best||'@auto';}
const tgtName=t=>t==='@auto'?'ท่าตีธรรมดา (ผลครึ่งเดียว · ไม่มีผลกับคูลดาวน์/SP)':((G('SKILLS')[t]||{}).name||t);
let GST={};   /* stat lines of the active gems → {atk:…} */
function setGST(g){if(JSON.stringify(g)===JSON.stringify(GST))return;GST=g;try{const f=G('applyStats');if(typeof f==='function')f();}catch(e){}}
{const _gc=G('gearCalc');if(typeof _gc==='function'){gearCalc=function(){const r=_gc.apply(this,arguments);const B=G('BON');if(B)for(const k in GST)B[k]=(B[k]||0)+GST[k];return r;};window.gearCalc=gearCalc;}}
window.gemStats=()=>Object.assign({},GST);
function apply(){const S=G('SKILLS'),LV=G('LV');if(!S||!LV)return;let chg=false;
  if(!window.__GEMS_ALL)for(const k of cKeys()){const i=D.sock.indexOf(k),on=i>=0&&sockOpen(i)&&tierOK(k)&&!!D.own[k],w=on?1:0;if((LV[k]||0)!==w){LV[k]=w;chg=true;}}
  const sig=JSON.stringify([D.sock,D.mods,D.own,cKeys().map(k=>LV[k]),D.ss,D.sm,D.ssu,D.ss.map((k,i)=>ssAct(i)?1:0),D.cv,D.sx,test(),!!window.__RESO_OFF]);if(sig===lastSig&&!chg)return;lastSig=sig;   /* rebuild only on change: ACT keeps its hit / cast counters */
  for(const k in S){const s=S[k];if(s._gb){s.mp=s._gb.mp;s.cd=s._gb.cd;delete s._gb;}}
  ACT={};
  const tgt=D.sock.map(k=>k&&LV[k]&&D.own[k]?targetOf(k):null);
  const GS={},addS=(l,q,lv)=>{const st=SLINE[l[0]];if(!st)return false;GS[st]=(GS[st]||0)+statN(LV_V(l[1],q,lv));return true;};   /* stat lines → character stats */
  const MC={};   /* working mutation gems per kind (resonance / balance) */
  D.sock.forEach((k,i)=>{if(!k||!LV[k]||!D.own[k])return;const t=targetOf(k);if(t!=='@auto'&&!S[t])return;const m=D.mods[k]||[];
    const A=ACT[t]||(ACT[t]={gems:[],lv:1,mut:[],sup:[],n:0,casts:0,ln:{},elem:0,next:null,socks:[]});A.gems.push(k);A.lv=Math.max(A.lv,D.own[k].lv||1);A.socks.push(i);
    m.forEach((id,j)=>{if(id&&modOpen(i,j)){(isMutJ(j)?A.mut:A.sup).push(id);if(isMutJ(j)&&MUTD[id])MC[id]=(MC[id]||0)+1;}});
    /* random lines (gem farming v2): ranks add up per line kind on the target skill */
    {const o=D.own[k];for(const l of (o.lines||[])){if(addS(l,o.q,o.lv))continue;A.ln[l[0]]=(A.ln[l[0]]||0)+LV_V(l[1],o.q,o.lv);}A.rq=Math.max(A.rq==null?-1:A.rq,o.q||0);}
    const lr=(D.own[k].lines||[]).find(l=>l[0]==='lelem');if(lr){const my=[m[0],m[3]].filter(Boolean);let c=0;for(const d of [-1,1]){const kn=D.sock[(i+d+NS)%NS],mm=kn&&D.mods[kn]||[];if(my.some(x=>x===mm[0]||x===mm[3]))c++;}A.elem+=.03*LV_V(lr[1],D.own[k].q,D.own[k].lv)*c;}
    if((D.own[k].lines||[]).some(l=>l[0]==='lnext')){for(let d=1;d<NS;d++){const tn=tgt[(i+d)%NS];if(tn&&tn!==t){A.next=tn;break;}}}});
  for(const t in ACT)ACT[t].cmut=ACT[t].mut.slice();   /* mutations from C gems (a skill star cannot repeat one) */
  /* skill stars: the star's mutation works on its own skill (no gem level, no supports, no lines) */
  /* a combo follow-up (no cooldown of its own) gets the hit side of its starter's mutation; cooldown / SP / charges / pillar stay on the starter */
  D.ss.forEach((k,i)=>{if(!k||!ssAct(i))return;const id=D.sm[i]&&MUTD[D.sm[i]]?D.sm[i]:null,su=SSU[i]?(D.ssu[i]||[]).filter((x,j)=>x&&SUPD[x]&&uOpen(i,j)):[],g=sgo(k);
    const eff=g?(g.lines||[]).filter(l=>!addS(l,g.q,g.lv)):[];   /* the skill gem's special stats (owner 2026-11-21): stat lines → character, the rest on the skill */
    if(!id&&!su.length&&!g)return;
    ssChain(k).forEach((t,c)=>{const A=ACT[t]||(ACT[t]={gems:[],lv:1,mut:[],sup:[],n:0,casts:0,ln:{},elem:0,next:null,socks:[],cmut:[]});(A.ss||(A.ss=[])).push(i);if(c&&!A.gems.length)A.fol=1;
      if(id&&!A.mut.includes(id)){A.mut.push(id);if(!c)MC[id]=(MC[id]||0)+1;}if(su.length)(A.supH||(A.supH=[])).push(...su);
      for(const l of eff){if(c&&!HITL.has(l[0]))continue;A.ln[l[0]]=(A.ln[l[0]]||0)+LV_V(l[1],g.q,g.lv);}   /* a follow-up gets the hit side only */
      if(g)A.sq=Math.max(A.sq==null?-1:A.sq,g.q||0);});});
  setGST(GS);
  {const ks=Object.keys(MC),on=new Set(ks.filter(id=>MC[id]>=2));RES={n:MC,on,tot:ks.reduce((a,id)=>a+MC[id],0),kinds:ks.length,bal:!on.size&&ks.length>=BAL_N};}
  for(const t in ACT){if(t==='@auto'||ACT[t].fol)continue;const A=ACT[t],s=S[t];s._gb={mp:s.mp,cd:s.cd};const has=id=>A.mut.includes(id)||A.sup.includes(id);
    if(typeof s.cd==='number'){let cd=s.cd;if(has('heavy'))cd+=rv('heavyCd',BAL());if(has('rapid'))cd*=rv('rapidCd',RS('rapid'));{const q=sw(A,'quick');if(q)cd-=Math.min(1.5*q,cd*.2*q);}   /* −1.5 s, at most a fifth of the cooldown (short skills would double up) */s.cd=Math.round(cd*10)/10;}
    if(typeof s.cd==='number'&&A.ln.lcd){s.cd=Math.round((s.cd-Math.min(.2*A.ln.lcd,s.cd*.2))*10)/10;}   /* line: cooldown −0.2 s per rank, at most a fifth */
    if(typeof s.mp==='number'){let mp=s.mp;if(has('heavy'))mp+=rv('heavyMp',BAL());{const w=sw(A,'thrift');if(w)mp=Math.max(0,mp-6*w);}if(A.ln.lsp)mp=Math.max(0,mp-Math.round(A.ln.lsp));s.mp=mp;}
    if(has('stack')){const mx=rv('stackCh',RS('stack'));if(!STK[t])STK[t]={ch:mx,rT:0,mx};else{STK[t].mx=mx;if(STK[t].ch>mx)STK[t].ch=mx;}}else delete STK[t];}
  for(const t in STK)if(!ACT[t])delete STK[t];
  window.GEM_V=(window.GEM_V||0)+1;try{G('buildHotbar')();}catch(e){}   /* gem marks on the skill buttons (the phone wheel watches GEM_V) */
  if(chg){try{G('buildLevels')();}catch(e){}}}
const has=(A,id)=>A.mut.includes(id)||A.sup.includes(id)||!!(A.supH&&A.supH.includes(id));
function rec(key,fresh){let R=REC[key];if(fresh||!R||now()-R.t>(key==='@auto'?3:6))R=REC[key]={t:now(),first:null,hits:0,sp:0,heal:0,sum:0,tg:new Set(),third:false,chainAt:0,buffs:[]};return R;}
/* hit on behalf of a skill outside its own frame (echo, chains, pillar): set SKCTX so damage type + KO follow the skill */
function gh(e,m,key,x){if(!e||e.dead)return 0;const old=window.SKCTX;window.SKCTX=key==='@auto'?null:key;let d=0;try{d=hurt(e,m,Object.assign({_gem:1,skill:key==='@auto'?undefined:key,auto:key==='@auto'},x||{}));}catch(err){}window.SKCTX=old;return d;}
function mut(A,auto){let pm=1+gemPowOf(A.lv);const b=BAL();   /* gains move with resonance, costs with balance */
  const M={heavy:rv('heavyP',RS('heavy')),rapid:rv('rapidP',b),stack:rv('stackP',b),fire:rv('fireP',b),ice:rv('iceP',b),volt:rv('voltP',b),guard:rv('guardP',b),rage:rv('rageP',RS('rage')),siphon:rv('siphonP',b),spread:rv('spreadP',b)};
  for(const id of A.mut)if(M[id])pm*=M[id];return pm;}
function freeze(e,d){const s=e.st;if(!s)return;d=e.boss?d*.5:d;s.frozen=Math.max(s.frozen||0,d);s.slow=Math.max(s.slow||0,d+1);}

/* ---- damage ---- */
const _hurt=G('hurt');
if(_hurt)window.hurt=hurt=function(e,mult,o){o=o||{};FIGHT_T=now();if(o._gem||o.dot||!e||e.dead||!Object.keys(ACT).length)return _hurt(e,mult,o);
  const pa=G('player');const auto=!!o.auto,key=auto?'@auto':(o.skill||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null);const A=key&&ACT[key];if(!A)return _hurt(e,mult,o);
  ensureCore();const R=rec(key);let m=mult;{const w=sw(A,'force');if(w)m+=(auto?.075:.15)*w;}let pm=mut(A,auto);
  {const L=A.ln,h=auto?.5:1,st=e.st||{};let add=0;   /* random lines on the gem: flat additions to the hit (half on normal attacks) */
    if(L.lpow)add+=.03*L.lpow;if(L.lfirst&&!R.hits)add+=.15*L.lfirst;if(L.lboss&&(e.boss||(e.m&&e.m.role==='brute')))add+=.06*L.lboss;
    if(L.lsts&&(st.slow>0||st.stun>0||st.frozen>0||st.stagger>0||st.bleed>0||st.burn>0||st.poison>0||e._gBurn||e._gFlat))add+=.06*L.lsts;
    if(A.elem)add+=A.elem;const nb=NB[key];if(nb&&nb.u>now())add+=nb.v;m+=add*h;}
  if(A.mut.includes('focus')){if(!R.first)R.first=e;pm*=e===R.first?rv('focusF',RS('focus')):rv('focusO',BAL());}
  if(R.third)pm*=1+.5*R.third;if(auto)pm=1+(pm-1)/2;
  let mon=e.m,dd=0;{const pv=20*sw(A,'pierce')+Math.round(4*(A.ln.lpier||0));if(pv&&mon&&mon.def){dd=Math.min(mon.def,pv);mon.def-=dd;}}
  let dmg=0;try{dmg=_hurt(e,m*pm,o);}finally{if(dd)mon.def+=dd;}
  if(!(dmg>0))return dmg;A.n++;R.hits++;R.sum+=m*pm;R.tg.add(e);const hm=m*pm,L=plv(),pl=G('player');
  if(A.ln.lslow&&A.n%4===0)G('applyCC')(e,{slow:1+.3*A.ln.lslow});
  if(A.ln.lkill&&(e.dead||e.hp<=0)&&!auto)pl.mp=Math.min(pl.maxMp,pl.mp+Math.round(2*A.ln.lkill));
  if(A.ln.lpush&&!e.boss){const tag=R.hits;TIM.push({at:now()+.3,f:()=>{if(R.hits!==tag||e.dead)return;const a=Math.atan2(e.y-pl.y,e.x-pl.x),v=40+30*Math.min(5,A.ln.lpush);e.vx=(e.vx||0)+Math.cos(a)*v;e.vy=(e.vy||0)+Math.sin(a)*v;}});}
  if(has(A,'spread')||has(A,'splash')){const f=(A.mut.includes('spread')?rv('spreadF',RS('spread')):0)+.3*sw(A,'splash'),r=A.mut.includes('spread')?80:70;
    for(const t of G('enemiesInCircle')(e.x,e.y,r))if(t!==e)gh(t,hm*f,key);}
  if(A.mut.includes('fire')){{const o=e._gBurn;e._gBurn={n:rv('fireN',RS('fire')),nt:o?o.nt:now()+1,m:Math.max(o?o.m:0,hm*.35/4),key};}   /* refresh keeps the tick timer, else fast hits would postpone every tick; resonance = 5 ticks */}
  {const w=sw(A,'burn');if(w){const o=e._gFlat;e._gFlat={n:3,nt:o?o.nt:now()+1,v:L*w,key};}}
  if(A.mut.includes('ice')){G('applyCC')(e,{slow:2});if(A.n%4===0)freeze(e,rv('iceF',RS('ice')));}
  {const w=sw(A,'frost');if(w){if(A.n%3===0)G('applyCC')(e,{slow:2*w});if(A.n%6===0)freeze(e,.8*w);}}
  {const w=sw(A,'impact');if(w&&A.n%5===0){G('applyCC')(e,{stun:.5*w});try{G('koHit')(e,3*w,{skill:key==='@auto'?undefined:key,koMul:2});}catch(err){}}}
  if(A.mut.includes('siphon')){const rs=RS('siphon'),cap=rv('siphonCap',rs);if(R.sp<cap){const v=Math.min(rv('siphonV',rs),cap-R.sp);R.sp+=v;pl.mp=Math.min(pl.maxMp,pl.mp+v);}}
  {const w=sw(A,'leech');if(w&&R.heal<10){R.heal++;pl.hp=Math.min(pl.maxHp,pl.hp+L*w);}}
  if(A.mut.includes('volt')||sw(A,'chain')){R.lastE=e;R.lastM=hm;R.chainAt=now()+.3;}
  {const w=sw(A,'echo');if(w&&!auto)TIM.push({at:now()+.5,f:()=>{if(!e.dead){gh(e,hm*.35*w,key,{label:'ECHO',labelColor:'#c9b4ff'});}}});}
  return dmg;};

/* ---- casting ---- */
const _cast=G('castSkillNow');
if(_cast)window.castSkillNow=castSkillNow=function(key,c){const A=ACT[key];if(!A)return _cast(key,c);ensureCore();
  const S=G('SKILLS'),pl=G('player'),st=STK[key];
  if(PIL.some(p=>p.key===key&&!(p.bal&&p.n<=1))){G('msg')('เสาโทเท็มกำลังร่ายท่านี้อยู่');return false;}   /* balance: free again from the pillar's 3rd cast */
  const R=rec(key,true),nc=A.casts+1;R.third=nc%3===0?sw(A,'third'):0;curCast=key;let ok=false;try{ok=_cast(key,c);}finally{curCast=null;}
  if(!ok)return ok;A.casts=nc;const L=plv();   /* only casts that really happen count (a press with no target used to advance 'every third cast') */
  if(R.third)G('addFx')(new (G('DText'))({x:pl.x,y:pl.y,z:110,text:'×3!',color:'#ffb13b',size:14,life:.9}));
  if(st){st.ch=Math.max(0,st.ch-1);if(st.rT<=0)st.rT=(S[key].cd||1)*rv('stackR',BAL());pl.cd[key]=st.ch>0?0:st.rT;}
  if(A.mut.includes('guard')){GU.sh=L*rv('guardSh',RS('guard'));GU.shT=now()+5;GU.guardT=now()+3;ring(pl.x,pl.y,'#c9ccd8',60);}
  {const N=A.ln;   /* random lines on cast */
    if(N.lshd){GU.sh=Math.max(GU.sh,L*.4*N.lshd);GU.shT=now()+5;}
    if(N.lheal)pl.hp=Math.min(pl.maxHp,pl.hp+L*.3*N.lheal);
    if(N.ldr){GU.drT=now()+1.5;GU.drV=Math.max(GU.drT>now()?GU.drV:0,L*.1*N.ldr);}
    if(N.lfree&&!st){const ev=N.lfree>=5?4:N.lfree>=3?5:6;if(A.casts%ev===0){pl.cd[key]=0;G('addFx')(new (G('DText'))({x:pl.x,y:pl.y,z:120,text:'FREE!',color:'#9fe0ff',size:13,life:.9}));}}
    if(N.lnext&&A.next)NB[A.next]={v:.05*N.lnext,u:now()+5};
    LASTC[key]=now();if(N.lall&&now()-GU.allT>20){const T=Object.keys(ACT).filter(t=>t!=='@auto'&&ACT[t].gems.length);if(T.every(t=>LASTC[t]&&now()-LASTC[t]<=20)){GU.allT=now();GU.sh=Math.max(GU.sh,L*N.lall);GU.shT=now()+6;ring(pl.x,pl.y,'#ffd27a',90);}}}
  if(A.mut.includes('rage')){GU.rageT=now()+3;GU.rageV=L*rv('rageT',BAL());ring(pl.x,pl.y,'#e2435a',60);}
  if(A.mut.includes('totem')&&!A.fol){const tr=RS('totem'),tb=BAL();
    const p={key,f:Math.min(rv('totemF',tr),Math.max(.12,rv('totemK',tr)/Math.max(1,S[key].cd||5))),x:pl.x+Math.cos(pl.phi||0)*-30,y:pl.y+Math.sin(pl.phi||0)*-30,n:4,nt:now()+2,R,born:now(),bal:tb};
    PIL.push(p);pl.cd[key]=Math.max(pl.cd[key]||0,2*rv('totemLock',tb)+(S[key].cd||0));}
  /* skills that hit nothing within 0.9 s count as buff skills → the support gems' buff-side effect */
  TIM.push({at:now()+.9,f:()=>{if(R.hits)return;const e0=G('enemiesInCircle')(pl.x,pl.y,90);
    {const w=sw(A,'splash');if(w){GU.sh=Math.max(GU.sh,L*3*w);GU.shT=now()+5;}}
    {const w=sw(A,'burn');if(w)for(const e of e0)e._gFlat={n:3,nt:now()+1,v:L*w,key};}
    {const w=sw(A,'frost');if(w)for(const e of e0)G('applyCC')(e,{slow:2*w});}
    {const w=sw(A,'leech');if(w)pl.hp=Math.min(pl.maxHp,pl.hp+L*3*w);}
    {const w=sw(A,'impact');if(w)for(const e of e0)G('applyCC')(e,{flinch:.4*w}),e.vx+=Math.cos(Math.atan2(e.y-pl.y,e.x-pl.x))*160*w,e.vy+=Math.sin(Math.atan2(e.y-pl.y,e.x-pl.x))*160*w;}
    if(R.third&&!st)pl.cd[key]=Math.max(0,(pl.cd[key]||0)*(1-Math.min(1,R.third)));}});
  return ok;};
const _buff=G('addBuff');
if(_buff)window.addBuff=addBuff=function(k,dur){const key=curCast||window.SKCTX,A=key&&ACT[key];
  if(A){let x=3*sw(A,'echo'),f=1;for(const id of['force','chain','pierce'])x+=2*sw(A,id);
    /* time trade-offs reach buffs too, so a faster / slower / stored skill keeps the same uptime per SP (rapid on a buff skill gave free uptime) */
    /* resonance / balance: heavy's longer buff grows with its gain, rapid's / stack's shorter buff shrinks less with balance */
    if(A.mut.includes('heavy'))f*=rv('heavyP',RS('heavy'));if(A.mut.includes('rapid'))f*=rv('rapidB',BAL());if(A.mut.includes('stack'))f*=rv('stackP',BAL());
    dur=dur*f+x;const R=REC[key];if(R)R.buffs.push([k,dur]);}
  return _buff(k,dur);};
const _acc=G('applyCC');
if(_acc)window.applyCC=applyCC=function(e,cc){const key=curCast||window.SKCTX,A=key&&ACT[key];if(A&&A.ln&&A.ln.ldur&&cc){cc=Object.assign({},cc);for(const f of ['stun','flinch','slow'])if(cc[f])cc[f]+=.2*A.ln.ldur;}return _acc(e,cc);};
const _abs=window.ENH_ABSORB;
window.ENH_ABSORB=function(d){const t=now(),L=plv();if(d>0)FIGHT_T=t;if(GU.guardT>t)d=Math.max(0,d-L*.5);if(GU.drT>t)d=Math.max(0,d-GU.drV);if(GU.rageT>t)d+=GU.rageV||L*.6;if(GU.sh>0&&GU.shT>t){const a=Math.min(GU.sh,d);GU.sh-=a;d-=a;}return _abs?_abs(d):d;};
/* the skill tree no longer takes C points: tapping a C node opens this board */
const _cr=G('canRaise');if(_cr)window.canRaise=canRaise=function(k){const s=G('SKILLS')[k];if(s&&s.br==='C'&&!window.__GEMS_ALL)return false;return _cr(k);};
const _skc=G('skChange');if(_skc)window.skChange=skChange=function(k,d){const s=G('SKILLS')[k];if(s&&s.br==='C'&&!window.__GEMS_ALL){open();return;}return _skc(k,d);};

/* ---- the gems show on the real skill (pillar 2): a gem mark on its button / wheel / tree cell + a gem section in its tooltip ---- */
function gemMark(k,txt){const A=ACT[k];if(!A)return '';
  if(txt){const j=D.ss.indexOf(k),g=j>=0&&sgo(k),pl=h=>h.replace(/<[^>]+>/g,'');   /* the button's title: rarity + special stats too */
    return (g?`\n💎 เจมสกิล ${QUAL[g.q].n} Lv ${g.lv}: `+(g.lines||[]).map(l=>pl(lnTxt(l,g.q,g.lv))).join(' · '):'')
      +A.gems.map(c=>{const o=D.own[c]||{};return `\n◆ เจม C ${QUAL[o.q||0].n} Lv ${o.lv||1}`+((o.lines||[]).length?': '+o.lines.map(l=>pl(lnTxt(l,o.q||0,o.lv))).join(' · '):'');}).join('')
      +(A.mut.length?'\n💎 แปรสภาพ: '+A.mut.map(x=>MUTD[x][1]+(RS(x)?' (🔗 เรโซแนนซ์: '+mutG(x)+')':BAL()?' (⚖ สมดุล: เสีย '+mutC(x)+')':'')).join(', '):'')+(A.sup.length||(A.supH&&A.supH.length)?'\n💎 เจมเสริม: '+A.sup.map(x=>SUPD[x][1]).concat((A.supH||[]).map(x=>SUPD[x][1]+' (½)')).join(', '):'');}
  const rq=Math.max(A.rq==null?-1:A.rq,A.sq==null?-1:A.sq),rc=rq>=0?`;--rc:${QUAL[rq].c}`:'',hi=rq>=QN-1?' hi':'';   /* the best rarity working on this skill lights the mark */
  if(!A.mut.length)return A.gems.length||(A.supH&&A.supH.length)||A.sq!=null?`<span class="gmk${hi}" style="--c:${rq>=0?QUAL[rq].c:A.gems.length?'#ffc83a':'#5ad1ff'}${rc}"><b>◆</b></span>`:'';
  return A.mut.slice(0,2).map((x,i)=>`<span class="gmk${i?' two':''}${hi}${RS(x)?' rs':BAL()?' bl':''}" style="--c:${MUTD[x][3]}${rc}"><b>${MUTD[x][2]}</b><img src="assets/gems/mut/${x}.webp" alt="" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;border-radius:50%;box-shadow:0 0 0 1.5px #2a1a0c"></span>`).join('');}
function gemTip(k){const S=G('SKILLS'),A=ACT[k];let j=D.ss.indexOf(k);if(j<0&&A&&A.fol&&A.ss)j=A.ss[0];if(!A&&j<0)return '';
  let h='<div class="tb"><small style="color:#9fd8ff">💎 เจมที่แต่งสกิลนี้</small>';
  if(j>=0){const id=D.sm[j],su=SSU[j]?(D.ssu[j]||[]).filter(Boolean):[];h+=`<div class="tl">⭐ ดาวสกิล ${j+1}: ${id?`แปรสภาพ <b>${MUTD[id][1]}</b>${RS(id)?' 🔗 เรโซแนนซ์':BAL()?' ⚖ สมดุล':''} — ได้ ${mutG(id)} · เสีย ${mutC(id)}${!ssAct(j)||cDup(k,id)?' (ยังไม่มีผล)':''}`:'ยังไม่ใส่เจมแปรสภาพ'}</div>`
    +(su.length?`<div class="tl">🔹 เจมเสริม (ผลครึ่งหนึ่ง): ${su.map(x=>`<b>${SUPD[x][1]}</b> — ${SUPD[x][4]}`).join(' · ')}</div>`:'');
    const g=D.ss[j]&&sgo(D.ss[j]);if(g)h+=`<div class="tl">💎 เจมสกิล <b style="color:${QUAL[g.q].c}">${QUAL[g.q].n}</b> Lv ${g.lv}: ${(g.lines||[]).map(l=>lnTxt(l,g.q,g.lv)).join(' · ')}${D.ss[j]!==k?' (ท่าต่อได้เฉพาะผลตอนตี)':''}</div>`;}
  if(A)for(const g of A.gems){const m=D.mods[g]||[],mu=[m[0],m[3]].filter(Boolean),su=[m[1],m[2]].filter(Boolean);
    const o=D.own[g]||{};h+=`<div class="tl">◆ เจม C <b>${S[g].name}</b> <b style="color:${QUAL[o.q||0].c}">${QUAL[o.q||0].n}</b> Lv ${o.lv||1}${mu.length?' · แปรสภาพ '+mu.map(x=>MUTD[x][1]+(RS(x)?' 🔗':BAL()?' ⚖':'')).join(', '):''}${su.length?' · เสริม '+su.map(x=>SUPD[x][1]).join(', '):''}${(o.lines||[]).length?' · '+o.lines.map(l=>lnTxt(l,o.q||0,o.lv)).join(' · '):''}</div>`;}
  if(A&&A.mut.length){const rs=A.mut.filter(x=>RS(x));   /* resonance / balance on this skill's mutations, with the numbers that work now */
    if(rs.length)h+=`<div class="tl">🔗 <b>เรโซแนนซ์</b>: ${rs.map(x=>`${MUTD[x][1]} — ได้ ${mutG(x)}`).join(' · ')}</div>`;
    else if(BAL())h+=`<div class="tl">⚖ <b>สมดุล</b> (แปรสภาพ ${RES.kinds} แบบไม่ซ้ำ): ${A.mut.map(x=>`${MUTD[x][1]} — เสียเหลือ ${mutC(x)}`).join(' · ')}</div>`;}
  return h+'</div>';}
window.gemMark=gemMark;
const _tip=G('skTip');if(_tip)window.skTip=skTip=function(k,l){const h=_tip(k,l);try{return h+gemTip(k);}catch(e){return h;}};
const _cell=G('skIconCell');if(_cell)window.skIconCell=skIconCell=function(k,l,o){const h=_cell(k,l,o);try{if(l===1&&!(o&&o.c)){const m=gemMark(k);if(m)return h.replace(/<\/div>$/,m+'</div>');}}catch(e){}return h;};

/* ---- one fx for everything that runs per frame: burns, chains, echoes, totem pillars, charges ---- */
const TIM=[],PIL=[];
function ring(x,y,c,r){if(window.GEMFX&&GEMFX.mutOn)return;   /* gem_mut_fx.js draws guard / rage / pillar pulses itself */
  try{G('addFx')(new (G('GRing'))({x,y,r0:8,r1:r,w:8,color:c,life:.4}));}catch(e){}}
class GemZap{constructor(a,b,c){this.a={x:a.x,y:a.y};this.b={x:b.x,y:b.y};this.c=c;this.t=0;this.layer='top';}
  update(dt){this.t+=dt;return this.t<.25;}
  draw(){const P=G('P'),ctx=G('ctx');const [x1,y1]=P(this.a.x,this.a.y,30),[x2,y2]=P(this.b.x,this.b.y,30);ctx.save();ctx.globalAlpha=1-this.t/.25;ctx.strokeStyle=this.c;ctx.lineWidth=3;ctx.shadowColor=this.c;ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(x1,y1);for(let i=1;i<6;i++){const k=i/6;ctx.lineTo(x1+(x2-x1)*k+(Math.random()-.5)*14,y1+(y2-y1)*k+(Math.random()-.5)*14);}ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}}
const CORE={layer:'sorted',sy:0,_gemCore:1,
  update(dt){const t=now(),S=G('SKILLS'),pl=G('player'),en=G('enemies')||[];
    for(let i=TIM.length-1;i>=0;i--)if(t>=TIM[i].at){const f=TIM[i].f;TIM.splice(i,1);try{f();}catch(e){}}
    for(const e of en){if(e.dead)continue;
      const b=e._gBurn;if(b&&t>=b.nt){b.n--;b.nt=t+1;gh(e,b.m,b.key,{dot:true});try{G('sparks')(e.x,e.y,30,-Math.PI/2,3,'#ff7a2a',80,.6);}catch(er){}if(b.n<=0)e._gBurn=null;}
      const f=e._gFlat;if(f&&t>=f.nt){f.n--;f.nt=t+1;e.hp-=f.v;try{G('dmgNum')(e.x,e.y,40,Math.max(1,Math.round(f.v)),'hit',{who:e});}catch(er){}if(e.hp<=0&&!e.dead)G('kill')(e);if(f.n<=0)e._gFlat=null;}}
    for(const key in REC){const R=REC[key],A=ACT[key];if(!A||!R.chainAt||t<R.chainAt)continue;R.chainAt=0;const src=R.lastE;if(!src)continue;
      const f=(A.mut.includes('volt')?.4:0)+.3*sw(A,'chain');let from=src;
      const pool=en.filter(o=>!o.dead&&o!==src&&Math.hypot(o.x-src.x,o.y-src.y)<170).sort((p,q)=>Math.hypot(p.x-src.x,p.y-src.y)-Math.hypot(q.x-src.x,q.y-src.y)).slice(0,A.mut.includes('volt')?rv('voltN',RS('volt')):2);
      for(const o of pool){G('addFx')(new GemZap(from,o,A.mut.includes('volt')?'#5ad1ff':'#bfe8ff'));gh(o,R.lastM*f,key);from=o;}}
    for(let i=PIL.length-1;i>=0;i--){const p=PIL[i];if(t<p.nt)continue;p.nt=t+2;p.n--;const R=p.R;ring(p.x,p.y,'#d9a441',150);
      if(R.hits){const m=R.sum/Math.max(1,R.tg.size)*p.f;   /* ×0.45 at most; long-cooldown skills get less (the pillar would out-cast the skill) */for(const e of G('enemiesInCircle')(p.x,p.y,150).slice(0,4))gh(e,m,p.key,{label:'TOTEM',labelColor:'#ffd27a'});}
      else for(const [k,d] of R.buffs)_buff(k,Math.min(d,2.5));
      if(p.n<=0)PIL.splice(i,1);}
    const cdm=(G('D')||{}).cdMul||1;
    for(const k in STK){const st=STK[k],mx=st.mx||2;if(st.ch<mx){st.rT-=dt/cdm;if(st.rT<=0){st.ch++;st.rT=st.ch<mx?(S[k].cd||1)*rv('stackR',BAL()):0;}}pl.cd[k]=st.ch>0?0:Math.max(.01,st.rT);}
    this.sy=PIL.length?PIL[0].y:-1e9;return true;},
  draw(){if(!PIL.length||(window.GEMFX&&GEMFX.pole))return;const P=G('P'),ctx=G('ctx'),t=now();
    for(const p of PIL){const [x,y]=P(p.x,p.y,0),h=58,a=Math.min(1,(t-p.born)*4);ctx.save();ctx.globalAlpha=a;
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y,14,5,0,0,7);ctx.fill();
      const cols=['#8a4b2a','#c94a3a','#e9b44c','#3a8a7a'];for(let i=0;i<4;i++){ctx.fillStyle=cols[i];ctx.fillRect(x-7,y-h+i*h/4,14,h/4);}
      ctx.strokeStyle='#3a1f14';ctx.lineWidth=2;ctx.strokeRect(x-7,y-h,14,h);
      ctx.fillStyle='#ffe9a0';ctx.shadowColor='#ffd27a';ctx.shadowBlur=12+6*Math.sin(t*6);ctx.beginPath();ctx.arc(x,y-h-6,5,0,7);ctx.fill();ctx.restore();}}};
function ensureCore(){const f=G('fx');if(f&&!f.includes(CORE))f.push(CORE);}
let seenLv=0;
setInterval(()=>{if(!localStorage.getItem(SKEY))D=load();apply();if(Object.keys(ACT).length||PIL.length)ensureCore();
  /* skill star opened: tell the player once, and mark the menu button while a free mutation gem waits */
  const L=lv();if(seenLv&&L>seenLv){const say=t=>{try{G('msg')(t);}catch(e){}};
    for(let i=0;i<NSS;i++)if(seenLv<SS_LV[i]&&L>=SS_LV[i])say(i===0||carved('s'+i)?`⭐ หลุมสกิลที่ ${i+1} เปิดแล้ว! กด G (เสาโทเท็ม) รับเจมแปรสภาพฟรี แล้วแต่งสกิลของคุณ`
      :`⛏ ถึง Lv ${SS_LV[i]} แล้ว — หลุมสกิลที่ ${i+1} บนเสาโทเท็มสลักได้! กด G แล้วแตะหลุมที่มีฝาปิดเพื่อดูของที่ต้องส่ง`);
    for(let i=0;i<NS;i++)if(seenLv<SOCK_LV[i]&&L>=SOCK_LV[i])say(`🗿 ถึง Lv ${SOCK_LV[i]} แล้ว — ชั้นเสาที่ ${i+1} (${TIERN[i]}) สลักได้! กด G แล้วแตะหลุมใหญ่ของชั้นนั้น`);}
  /* the menu button gets a red dot while a free mutation gem waits or a hole can be carved right now */
  seenLv=L;const mb=document.querySelector('#mgrid [data-m="tgem"]');if(mb)mb.classList.toggle('tgDot',giftN()>0||anyRdy());},400);
setTimeout(apply,50);
window.totemGems={open,close,data:()=>D,apply,act:()=>ACT,fxs:()=>({REC,STK,GU,PIL}),   /* live state for gem_mut_fx.js (read only) */
  targetOf,key:SKEY,ssPos:()=>({star:SSP,mut:SMP}),gift:openGift,
  refill:f=>{let n=0;for(const t in STK){if(f&&!f(t))continue;const st=STK[t],mx=st.mx||2;if(st.ch<mx)n++;st.ch=mx;st.rT=0;}return n;},   /* relics.js: Fenrir's Fang refills 'stack' charges too */
  res:()=>({n:Object.assign({},RES.n),on:[...RES.on],tot:RES.tot,kinds:RES.kinds,bal:RES.bal}),stk:()=>JSON.parse(JSON.stringify(STK)),page:p=>p==null?{c:D.pg.c,n:D.pg.n.slice()}:switchPage(p,true),canSwitch:()=>pgBlock()};
})();
