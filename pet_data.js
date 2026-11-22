/* =====================================================================
   PET DATA (owner 2026-11-22 23:32 answers to PET_SYSTEM_TH.md: 1ก tame field monsters on their own sprites · 2ก heart gauge, no random ·
   3ข pets do NOT fight, they give stats like classic RO pets · 4ข no hunger · 5 gem collar only on pets dropped by bosses (phase 2) ·
   6ข each hero has its own pet box · start).
   Loaded BEFORE items.js (after drop_table.js): items.js reads window.PETDATA to add the goods (eggs, charms, fluff, treats) to ETC,
   the charms of tiers 1–2 to the shops (SHOP_FULL) and to draw their icons (PETDATA.icon). pets.js (loaded late) runs the system.
   Every number here is flat (design rule 2): stats, ATK / MATK / HIT / FLEE / CRIT / perfect dodge / DEF / MDEF.
   ===================================================================== */
(function(){
/* lands: the charm that calms its monsters (capital monsters take a charm of any land) */
const LANDS={
  vik:{th:'ไวกิ้ง',ch:'เครื่องรางรูนผูกใจ',en:'Rune Bond Charm',col:'#6aa8ff',dk:'#1d4a8a'},
  grk:{th:'กรีก',ch:'เหรียญลอเรลผูกใจ',en:'Laurel Bond Coin',col:'#e8c84a',dk:'#7a5a10'},
  egy:{th:'อียิปต์',ch:'อังค์ผูกใจ',en:'Ankh of Bonds',col:'#f0b040',dk:'#7a4a10'},
  jpn:{th:'ญี่ปุ่น',ch:'โอมาโมริผูกใจ',en:'Bond Omamori',col:'#e2503a',dk:'#7a1e10'},
  azt:{th:'แอซเท็ก',ch:'จี้หยกผูกใจ',en:'Jade Bond Pendant',col:'#3ac8a0',dk:'#0e5a48'},
  cap:{th:'เมืองหลวง',ch:'',en:'',col:'#c9a46a',dk:'#5a3a10'}};
const CH_PRICE=[300,1200,4000,12000];          // charm tier 1–4 (shops sell 1–2)
const HEARTS={critter:3,normal:4,swift:5,brute:5};
/* species: key · monster name (as in the map tables) · Thai · land · main stat · sub line [key, value at bond 10 ×1.00] · bond-10 gift [stat,+n] ·
   top level of its band (→ charm tier) · monster role (→ hearts) · egg colours [shell, spots] · map id(s) shown in the codex */
const SP=[
 ['yeticub','Yeti Cub','ลูกเยติ','vik','str',['atk',12],['vit',2],17,'normal',['#eef6ff','#8fb8e8'],'vikF6'],
 ['snowpup','Snow Pup','ลูกหมาป่าหิมะ','vik','agi',['flee',10],['dex',2],6,'critter',['#f4f8ff','#7fa8d8'],'snowpine'],
 ['icecrab','Ice Crab','ปูหิมะ','vik','vit',['def',8],['str',2],23,'normal',['#c8ecff','#ff8a6a'],'vikF4'],
 ['pinecone','Pinecone Sprite','ภูตลูกสน','vik','int',['matk',12],['vit',2],4,'critter',['#c8955a','#6a8a3a'],'snowpine'],
 ['lampbeetle','Lamp Beetle','ด้วงตะเกียง','vik','dex',['hit',10],['luk',2],26,'swift',['#3a4a6a','#ffd36a'],'vikD1a'],
 ['fanghare','Fang Hare','กระต่ายเขี้ยวน้ำแข็ง','vik','luk',['crit',4],['agi',2],9,'critter',['#ffffff','#9fd8ff'],'vikF2'],
 ['goat','Mountain Goat','แพะภูเขา','grk','str',['crit',4],['vit',2],6,'critter',['#f3ead8','#a88a5a'],'grkF1'],
 ['rocklizard','Rock Lizard','กิ้งก่าหิน','grk','agi',['hit',10],['str',2],26,'swift',['#c8b898','#6a5a48'],'grkD1a'],
 ['marblecrab','Marble Crab','ปูหินอ่อน','grk','vit',['mdef',8],['int',2],9,'critter',['#f6f2ea','#b8a898'],'grkF2'],
 ['olivesprite','Olive Sprite','ภูตต้นมะกอก','grk','int',['mdef',8],['dex',2],6,'critter',['#d8e8a0','#6a8a2a'],'grkF1'],
 ['honeybee','Honey Bee','ผึ้งน้ำผึ้ง','grk','dex',['atk',12],['agi',2],17,'normal',['#ffd84a','#3a2a1f'],'grkF3'],
 ['wildlamb','Wild Lamb','ลูกแกะป่า','grk','luk',['pd',3],['vit',2],4,'critter',['#fffaf0','#ffd36a'],'grkF1'],
 ['leafant','Leafcutter Ant','มดตัดใบ','azt','str',['def',8],['agi',2],4,'critter',['#d0743a','#5aa83a'],'aztF1'],
 ['howler','Howler Monkey','ลิงหาง','azt','agi',['pd',3],['luk',2],6,'critter',['#a8743a','#f0c890'],'aztF1'],
 ['tapir','Baby Tapir','ลูกสมเสร็จ','azt','vit',['def',8],['str',2],5,'critter',['#8a6a5a','#f0e0c8'],'aztF2'],
 ['glowworm','Glowworm Swarm','ฝูงหนอนเรืองแสง','azt','int',['matk',12],['luk',2],26,'swift',['#2a3a5a','#b8ff6a'],'aztD1a'],
 ['dartfrog','Dart Frog','กบลูกดอก','azt','dex',['crit',4],['agi',2],6,'critter',['#4ab0ff','#1a2a5a'],'aztF1'],
 ['quetzal','Quetzal','นกเควตซัล','azt','luk',['flee',10],['int',2],9,'critter',['#3ac88a','#e2402a'],'aztF2'],
 ['boar','Wild Boar','หมูป่า','cap','str',['hit',10],['vit',2],21,'normal',['#8a5a3a','#d8b890'],'cE'],
 ['rooster','Wild Rooster','ไก่ป่า','cap','agi',['crit',4],['str',2],20,'swift',['#f0e0c8','#e2402a'],'cS'],
 ['slime','Meadow Slime','สไลม์ทุ่ง','cap','vit',['mdef',8],['luk',2],21,'normal',['#7fd8ff','#ffffff'],'cW'],
 ['dandelion','Dandelion Puff','ปุยแดนดิไลออน','cap','int',['flee',10],['agi',2],18,'critter',['#fffbe8','#ffd84a'],'cW'],
 ['hawk','Field Hawk','เหยี่ยวทุ่ง','cap','dex',['hit',10],['luk',2],21,'normal',['#a87a4a','#f8f0e0'],'cW'],
 ['fieldrabbit','Field Rabbit','กระต่ายทุ่ง','cap','luk',['pd',3],['agi',2],18,'critter',['#f0d8b8','#ffffff'],'cN']];
const tierOf=lv=>lv<=18?1:lv<=36?2:lv<=54?3:4;          // same bands as refine stones / orbs (Lv 1–18 / 19–36 / 37–54 / 55–60)
const SPECIES={},BYNAME={},ORDER=[];
for(const [k,name,th,land,st,sub,gift,lvTop,role,egg,map] of SP){const tier=tierOf(lvTop),hearts=HEARTS[role]||4;
  SPECIES[k]={k,name,th,land,st,sub,gift,lvTop,role,tier,hearts,egg,map};BYNAME[name]=k;ORDER.push(k);}
/* labels of the stat keys pets use (BON keys of gearCalc / derive) */
const LBL={str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK',atk:'ATK',matk:'MATK',hit:'HIT',flee:'FLEE',crit:'CRIT',pd:'หลบเด็ดขาด',def:'DEF',mdef:'MDEF'};
const ROLE={str:'นักบู๊',agi:'นักไล่ล่า',vit:'ผู้พิทักษ์',int:'ภูตเวท',dex:'นักยิง',luk:'ตัวนำโชค'};
/* bond (classic RO intimacy 0–1,000 → level 1–10) */
const BOND=[0,40,100,180,280,400,540,700,850,1000];
const BOND_N=['แปลกหน้า','เริ่มคุ้น','เริ่มคุ้น','สนิท','สนิท','สนิทมาก','สนิทมาก','ซื่อสัตย์','ซื่อสัตย์','คู่ใจ'];
const SUBF=[0,0,0,.3,.4,.5,.6,.7,.8,.9,1];               // sub line share by bond level (opens at 3)
/* personality lines (rolled at hatching, count by quality like gem lines): key → [name, value by rank I–V] */
const PERS={str:['ขี้โมโห',[1,1,2,2,3]],agi:['ซุกซน',[1,1,2,2,3]],vit:['กินจุ',[1,1,2,2,3]],int:['ช่างคิด',[1,1,2,2,3]],dex:['ตาไว',[1,1,2,2,3]],luk:['ดวงดี',[1,1,2,2,3]],
  hit:['ตั้งใจ',[2,3,4,5,6]],flee:['ขี้ตกใจ',[2,3,4,5,6]],crit:['ใจกล้า',[1,1,2,2,3]],atk:['ดุดัน',[2,3,5,6,8]],matk:['เพ้อฝัน',[2,3,5,6,8]],def:['ขี้หวง',[1,2,3,4,5]],mdef:['ใจเย็น',[1,2,3,4,5]]};
/* quality = the gem table (GEMDATA.QUAL: 50 / 30 / 14 / 5 / 1 %, ×1.00–1.40, lines 1/1/2/2/3, rank odds) + extra main stat */
const Q_MAIN=[0,0,1,1,2];
const QUAL=()=>(typeof window!=='undefined'&&window.GEMDATA&&window.GEMDATA.QUAL)||[{n:'ธรรมดา',c:'#d9dee8',lines:1,p:.5,m:1,rk:[.7,.3,0,0,0]},{n:'ดี',c:'#72e07a',lines:1,p:.3,m:1.08,rk:[.45,.4,.15,0,0]},
  {n:'หายาก',c:'#4ab0ff',lines:2,p:.14,m:1.16,rk:[.3,.45,.25,0,0]},{n:'มหากาพย์',c:'#c17bff',lines:2,p:.05,m:1.28,rk:[0,.4,.45,.15,0]},{n:'ตำนาน',c:'#ffb938',lines:3,p:.01,m:1.4,rk:[0,0,.5,.35,.15]}];
const PITY={epic:20,leg:50};
const HATCH_Z=t=>[0,500,1500,4000,9000][t]||500;
const TREAT={fluff:5,tess:2,z:3000};

/* goods for items.js (ETC): eggs per species, charms per land × tier, spirit fluff, personality treat */
const KINDS={pegg:1,pcharm:1,pfluff:1,ptreat:1};
function goods(ETC){
  for(const L of ['vik','grk','egy','jpn','azt'])for(let t=1;t<=4;t++){const D=LANDS[L];
    ETC['pch_'+L+t]={n:`${D.en} T${t}`,th:`${D.ch} ขั้น ${t}`,price:CH_PRICE[t-1],kind:'pcharm',land:L,tier:t,col:D.col,
      d:`โยนใส่มอนที่เลี้ยงได้ (🐾) ของแดน${D.th} ขั้น ${t} ลงไป (มอนเมืองหลวงรับเครื่องรางทุกแดน) · มอนจะใจอ่อน 12 วิ โยนเติมหัวใจจนเต็มได้ไข่ · ห้ามตีมันระหว่างนั้น`};}
  for(const k of ORDER){const s=SPECIES[k],cp=CH_PRICE[s.tier-1];
    ETC['pegg_'+k]={n:`${s.name} Egg`,th:`ไข่${s.th}`,price:Math.round(s.hearts*cp*1.5/50)*50,kind:'pegg',sp:k,tier:s.tier,col:s.egg[0],
      d:`ฟักในหน้าต่างสัตว์เลี้ยง (P) ได้${s.th} · บทบาท ${LBL[s.st]} ${ROLE[s.st]} · สุ่มระดับตอนฟัก (ธรรมดา → ตำนาน)`};}
  ETC.pfluff={n:'Spirit Fluff',th:'ขนวิญญาณ',price:600,kind:'pfluff',col:'#f4f0ff',d:'ได้จากการปล่อยสัตว์เลี้ยงคืนป่า · ใช้ทำขนมเปลี่ยนนิสัย'};
  ETC.ptreat={n:'Personality Treat',th:'ขนมเปลี่ยนนิสัย',price:5000,kind:'ptreat',col:'#ffb0c8',d:`สุ่มนิสัยของสัตว์เลี้ยงใหม่ (ล็อกบรรทัดได้ ใช้เพิ่ม 1 ชิ้นต่อบรรทัด) · ทำในหน้าต่างสัตว์เลี้ยง: ขนวิญญาณ ${TREAT.fluff} + แก่นโทเท็ม ${TREAT.tess} + ${TREAT.z.toLocaleString()}z`};}
const shop=[];for(const L of ['vik','grk','egy','jpn','azt'])for(const t of [1,2])shop.push('pch_'+L+t);

/* code icons (bag, market, shop): eggs in the species' colours, charms by land, fluff, treat */
function icon(id,E,sz){sz=sz||26;let g='';
  if(E.kind==='pegg'){const s=SPECIES[E.sp]||{egg:['#fff','#ccc']},[a,b]=s.egg;
    g=`<ellipse cx="12" cy="13.5" rx="7.4" ry="9" fill="${a}" stroke="#3a2a1f" stroke-width="1.5"/><circle cx="9" cy="10" r="1.9" fill="${b}"/><circle cx="14.5" cy="15.5" r="2.4" fill="${b}"/><circle cx="10.5" cy="17.8" r="1.2" fill="${b}"/><circle cx="15" cy="8.6" r="1.1" fill="${b}"/><path d="M8.2 7.6 Q9.6 5.6 11.4 5.2" stroke="#fff" stroke-width="1.3" fill="none" opacity=".85" stroke-linecap="round"/>`;}
  else if(E.kind==='pcharm'){const D=LANDS[E.land]||LANDS.vik,c=D.col,k=D.dk,t=E.tier||1,rim=['#c98a4a','#c9d2e0','#ffd36a','#ff8ad8'][t-1];
    const body={vik:`<path d="M8 5 H16 L18 9 V18 L12 21 L6 18 V9 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.4"/><path d="M12 8 V17 M12 10 L15 8 M12 13 L9 11" stroke="${k}" stroke-width="1.6" stroke-linecap="round"/>`,
      grk:`<circle cx="12" cy="13" r="7.5" fill="${c}" stroke="#3a2a1f" stroke-width="1.4"/><path d="M8 15 Q9 9 12 8 M16 15 Q15 9 12 8" stroke="#4a7a2a" stroke-width="1.6" fill="none"/><path d="M8.6 12 l-1.6-.6 M9.4 10 l-1.4-1 M15.4 12 l1.6-.6 M14.6 10 l1.4-1" stroke="#4a7a2a" stroke-width="1.4" stroke-linecap="round"/>`,
      egy:`<path d="M12 4.5 C9 4.5 8.6 9 12 11 C15.4 9 15 4.5 12 4.5 Z M7 11 H17 M12 11 V21" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M12 4.5 C9 4.5 8.6 9 12 11 C15.4 9 15 4.5 12 4.5 Z M7 11 H17 M12 11 V21" stroke="#3a2a1f" stroke-width=".9" fill="none"/>`,
      jpn:`<path d="M7 8 H17 V19 Q12 22 7 19 Z" fill="${c}" stroke="#3a2a1f" stroke-width="1.4"/><path d="M9 5 Q12 3 15 5 L14 8 H10 Z" fill="#ffd36a" stroke="#3a2a1f" stroke-width="1.1"/><path d="M10 12 H14 M10 15 H14" stroke="#fff3c4" stroke-width="1.3"/>`,
      azt:`<circle cx="12" cy="13" r="7.2" fill="${c}" stroke="#3a2a1f" stroke-width="1.4"/><circle cx="12" cy="13" r="3" fill="none" stroke="${k}" stroke-width="1.6"/><path d="M12 3 V6" stroke="#3a2a1f" stroke-width="1.5"/>`}[E.land]||'';
    g=`<circle cx="12" cy="12.5" r="10.5" fill="#fff6df" stroke="${rim}" stroke-width="2"/>${body}<path d="M16.5 3.5 C15 1.8 13 3 14.8 4.6 L16.5 6 L18.2 4.6 C20 3 18 1.8 16.5 3.5 Z" fill="#ff6a9a" stroke="#5a1020" stroke-width=".8"/><text x="20" y="22" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" stroke="#3a2a1f" stroke-width="1.6" paint-order="stroke">${t}</text>`;}
  else if(E.kind==='pfluff')g=`<path d="M6 16 C3 14 4 9 8 9.5 C8 6 13 5 14 8.5 C17 7 20 10 18.5 13 C21 15 18.5 19 15.5 17.8 C14 20.5 9 20.5 8.5 17.6 C7.6 17.6 6.6 17 6 16 Z" fill="#f8f4ff" stroke="#6a5a8a" stroke-width="1.4"/><circle cx="17.5" cy="6" r="1.4" fill="#c8a8ff"/><path d="M17.5 3.5 V8.5 M15 6 H20" stroke="#c8a8ff" stroke-width=".9"/>`;
  else if(E.kind==='ptreat')g=`<circle cx="12" cy="13" r="8" fill="#f0b46a" stroke="#3a2a1f" stroke-width="1.5"/><circle cx="12" cy="13" r="5.6" fill="#ffd9a0"/><path d="M12 10.6 C10.6 8.8 8 10.2 9.6 12.3 L12 14.6 L14.4 12.3 C16 10.2 13.4 8.8 12 10.6 Z" fill="#ff5d8a" stroke="#5a1020" stroke-width=".8"/><circle cx="8.6" cy="16.5" r=".9" fill="#7a4a21"/><circle cx="15.6" cy="16.8" r=".9" fill="#7a4a21"/>`;
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" style="display:block">${g}</svg>`;}

(typeof window!=='undefined'?window:globalThis).PETDATA={LANDS,SPECIES,BYNAME,ORDER,LBL,ROLE,BOND,BOND_N,SUBF,PERS,QUAL,Q_MAIN,PITY,HATCH_Z,TREAT,CH_PRICE,KINDS,goods,shop,icon,tierOf};
})();
