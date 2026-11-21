/* =====================================================================
   TOTEM LEGEND — BOSS RELICS · วัตถุโบราณของบอส (owner 2026-11-21: round 3 'ชุดนี้ผ่าน', then '1' = build the system)
   Design + table: GEAR_V3_PLAN_TH.md §4 · rules: ITEM_SYSTEM_TH.md §7 · icon prompts: BOSS_RELIC_ICON_PROMPTS_TH.md
   • The one accessory slot (acc1) holds a relic: a boss treasure that does something no hero kit can (MVP-card style).
   • A relic is an accessory INSTANCE {relic:'fenrir', star:1–5}: base stats = a crafted accessory of its land at the
     boss's grade (no random special stats) + its power. Powers use flat numbers / counters (design rule 2).
   • Every kill of its boss = 1 shard (account-wide: saved here, not in the bag, not tradable). The relic itself drops
     1/300 (map boss) · 1/800 (MVP) · 1/1,500 (main boss); 200 / 500 / 800 shards = make one (pity).
   • Stars ★1–5: feed a duplicate (+1 ★) or shards (20 / 30 / 40 / 60 % of the pity for ★2 / 3 / 4 / 5).
   • ⚡ relics have a skill on R: PC key R + round button above AUTO · phone: round button above the skill-set button
     (tap = use, hold = open the codex). Cooldown is fixed by star (no AGI / item cooldown).
   • Only Fenrir is in the maps (2026-11-21) → only Fenrir's Fang is live; the other 29 sit in the codex as 'coming'.
   Save: af_relic_v1[_play] (shared by every hero of that mode: shards, kills, codex, test grants). Relic items live in
   each hero's own item save like any accessory (storage moves them between heroes).
   Test mode: once per hero a ★1 Fenrir's Fang is put on; the codex has 🧪 buttons (shards, drop, cooldown, stars).
   ===================================================================== */
(function(){
if(typeof ITEMS==='undefined'||!window.AFItems||!AFItems.mkInst)return;
const A=window.AFItems,$=s=>document.querySelector(s);

/* ---------------- data ---------------- */
const TIER={map:{n:'บอสประจำแมพ',drop:300,pity:200},mvp:{n:'MVP',drop:800,pity:500},main:{n:'บอสใหญ่',drop:1500,pity:800}};
const STAR_K=[0,.2,.3,.4,.6];                                                      // shards for ★s → ★s+1 = pity × STAR_K[s]
const SLOT_TIER={D1b:'map',H1:'map',H2:'map',D2c:'mvp',E1:'mvp',E2:'main'};
const LANDS={vik:{n:'ไวกิ้ง',c:'#7fb8e8'},grk:{n:'กรีก',c:'#d8c890'},egy:{n:'อียิปต์',c:'#e8b84a'},jpn:{n:'ญี่ปุ่น',c:'#f08aa8'},azt:{n:'แอซเท็ก',c:'#5fbf6a'}};
const TYPE={act:['⚡','สกิลกด R'],rule:['🔁','เปลี่ยนกติกา'],build:['🧬','ปลดบิลด์ใหม่']};
/* key · land · boss map slot · boss · item (en) · item (th) · type · power · what it does (GEAR_V3_PLAN_TH.md §4) */
const DATA=[
 ['draugr','vik','D1b','ดรอกร์ช่างหลอม',"Deathforge Anvil",'ทั่งคนตาย','build','เกราะคือพลัง','ATK และ TAL + DEF × 0.5 → แทงก์สาย DEF ตีแรงได้'],
 ['huldra','vik','H1','ฮุลดรา',"Huldra's Lyre",'พิณฮุลดรา','act','เพลงล่อ','คูล 20 วิ: ดึงมอนทุกตัวในรัศมี 500 มากองหน้าเรา มึน 1.5 วิ (บอสไม่โดนดึง)'],
 ['jotun','vik','H2','ยักษ์โยตุน',"Jotun's Fist",'กำปั้นโยตุน','build','ร่างยักษ์','ATK และ TAL + VIT × 0.5 → สาย VIT ถึกและตีแรง'],
 ['fenrir','vik','D2c','เฟนเรียร์',"Fenrir's Fang",'เขี้ยวเฟนเรียร์','act','หอนแร็กนาร็อก','รีเซ็ตคูลดาวน์ทุกสกิลทันที ยกเว้นท่าไม้ตาย → ปล่อยชุดท่าใส่บอสได้ 2 รอบติด'],
 ['nidhogg','vik','E1','นิดฮ็อกก์',"Nidhogg's Scale",'เกล็ดนิดฮ็อกก์','rule','ซากระเบิด','มอนที่เราฆ่าระเบิดพิษ ATK/TAL×1.5 รัศมี 120 ระเบิดต่อกันเป็นลูกโซ่'],
 ['ymir','vik','E2','ยมีร์',"Heart of Ymir",'หัวใจยมีร์','rule','กายาแห่งโลก','โดนตีครั้งเดียวเสีย HP ไม่เกิน เลเวล × 4 → ท่าใหญ่ของบอสฆ่าเราในทีเดียวไม่ได้'],
 ['polyphemus','grk','D1b','โพลีฟีมัส',"Cloak of Nobody",'ผ้าคลุม "ไม่มีใคร"','act','ฉันชื่อไม่มีใคร','คูล 30 วิ: ล่องหน 6 วิ มอนไม่เห็นเรา ตีแรกออกจากล่องหนคริแน่นอน'],
 ['hecate','grk','H1','เฮคาที',"Hecate's Torch",'คบเพลิงเฮคาที','build','มนตร์ทางสามแพร่ง','ดาเมจที่โดนหักจาก SP ก่อน สูงสุด INT × 2 ต่อครั้ง → สาย INT เป็นแทงก์เวท'],
 ['trojan','grk','H2','ยักษ์ทรอย',"Trojan Horse",'ม้าไม้ทรอย','act','ม้าไม้','คูล 30 วิ: หลบเข้าม้าไม้ 2 วิ ไม่โดนดาเมจ แล้วกระโดดออกมาทุบรอบตัว ATK/TAL×4 มึน 1 วิ'],
 ['minotaur','grk','D2c','มิโนทอร์',"Minotaur's Horn",'เขามิโนทอร์','rule','ไม่หยุด','ไม่โดนมึน ผลัก ล้ม ราก ช้า → ยืนตีบอสได้ตลอด'],
 ['cerberus','grk','E1','เซอร์เบอรัส',"Three-Headed Collar",'ปลอกคอสามหัว','rule','สามหัว','ตีปกติโดน 3 ตัวพร้อมกัน (เป้า + 2 ตัวใกล้สุด)'],
 ['typhon','grk','E2','ไทฟอน',"Eye of Typhon",'ตาพายุไทฟอน','act','ตาพายุ','คูล 35 วิ: พายุหมุนรอบตัว 8 วิ รัศมี 160 ผลักมอนออกและทำให้ช้า กระสุนมอนเบี่ยง ตัวในพายุโดน ATK/TAL×0.3 ทุก 0.5 วิ'],
 ['mummy','egy','D1b','มัมมี่อัครเสนาบดี',"Burial Wraps",'ผ้าพันศพ','build','จ่ายด้วยเลือด','สกิลใช้ HP แทน SP (SP 1 = HP 3) ฆ่ามอนฟื้น HP เลเวล × 2'],
 ['sphinx','egy','H1','สฟิงซ์',"Riddle of the Sphinx",'ปริศนาสฟิงซ์','act','ย้อนเวลา','คูล 45 วิ: กลับไปตำแหน่ง HP SP เมื่อ 4 วิก่อน'],
 ['scorpion','egy','H2','ราชาแมงป่องเกลือ',"Scorpion King's Stinger",'เหล็กไนราชา','rule','เจาะเกราะ','ทุกการโจมตีไม่สน DEF ของเป้า 60 แต้ม'],
 ['pharaoh','egy','D2c','ฟาโรห์อมตะ',"Golden Pharaoh Mask",'หน้ากากทองฟาโรห์','act','พีระมิดทอง','คูล 40 วิ: พีระมิดทองครอบตัว 6 วิ รัศมี 160 ข้างในสกิลไม่เสีย SP รับดาเมจ − เลเวล × 1 ต่อครั้ง มอนที่เดินเข้ามาช้าลง'],
 ['set','egy','E1','เซ็ต',"Scepter of Set",'คทาเซ็ต','build','โชคแห่งความโกลาหล','คริทุกครั้ง คูลดาวน์ทุกสกิล −0.5 วิ → สาย LCK ใช้สกิลรัว'],
 ['apep','egy','E2','อาเปป',"Apep's Fang",'เขี้ยวอาเปป','act','กลืนกิน','คูล 12 วิ: กลืนมอนธรรมดาทั้งตัว ได้พลังมัน ATK/TAL + เลเวลมอน × 0.3 นาน 30 วิ ซ้อน 3 · บอส = กัด ATK/TAL×5 + พิษ'],
 ['tanuki','jpn','D1b','นินจาทานูกิ',"Tanuki's Leaf",'ใบไม้ทานูกิ','act','ร่างแยก','คูล 40 วิ: ร่างแยก 10 วิ ทำท่าตามทุกสกิลที่เราใช้ แรงครึ่งหนึ่ง'],
 ['jorogumo','jpn','H1','โจโรกุโมะ',"Jorogumo's Silk",'ใยโจโรกุโมะ','build','เสน่ห์พิษ','ทุกสถานะที่เราใส่ ทำดาเมจ CHA × 0.4 ต่อวิ ตลอดที่ติด → สาย CHA ตีแรงได้'],
 ['gashadokuro','jpn','H2','กาชะโดคุโระ',"Hungry Skull",'กะโหลกหิวโหย','rule','ตัดจบ','มอนธรรมดาที่ HP เหลือน้อยกว่า ATK/TAL × 3 ตายทันทีเมื่อโดนเรา'],
 ['shogun','jpn','D2c','โชกุนวิญญาณ',"Ghost Shogun's Blade",'ดาบโชกุนผี','rule','ท่าไม้ตายโชกุน','ท่าไม้ตายคูลดาวน์ −15 วิ และไม่โดนดาเมจระหว่างร่าย'],
 ['shuten','jpn','E1','ชูเท็นโดจิ',"Sake Gourd",'น้ำเต้าสาเก','rule','คอแข็ง','ยาฟื้น HP/SP แรง 2 เท่า กินยาแล้ว ATK/TAL + เลเวล × 0.5 นาน 5 วิ'],
 ['orochi','jpn','E2','ยามาตะโนะโอโรจิ',"Kusanagi Sword",'ดาบคุซานางิ','rule','แปดเศียร','ทุกครั้งที่ 8 ที่ใช้สกิล สกิลนั้นออกแรงสองเท่าและไม่เสีย SP'],
 ['camazotz','azt','D1b','คามาโซตซ์',"Camazotz Wing",'ปีกค้างคาว','act','ร่างค้างคาว','คูล 20 วิ: แปลงเป็นฝูงค้างคาว 3 วิ ไม่โดนดาเมจ บินเร็ว ทะลุมอน ดูดเลือดตัวที่บินผ่าน'],
 ['ahuizotl','azt','H1','อาฮุยซอตล์',"Ahuizotl's Tail-Hand",'มือหางอาฮุยซอตล์','act','คว้า','คูล 6 วิ: คว้าศัตรูไกล 500 มาตรงหน้า (บอส: ดึงเราไปหามัน)'],
 ['eagle','azt','H2','ขุนศึกอินทรี',"Eagle Warrior Plume",'ขนนกนักรบอินทรี','build','ปีกพายุ','เดินครบ 120 เก็บแรงลม 1 ชั้น (สูงสุด 5) สกิลถัดไป + AGI × 0.6 ต่อชั้น'],
 ['tzitzimitl','azt','D2c','ซิตซิมิตล์',"Starry Eclipse Cloak",'ผ้าคลุมดาว','act','สุริยคราส','คูล 50 วิ: ความมืดรัศมี 300 นาน 8 วิ มอนในความมืดตีพลาดทุกครั้ง (บอสครั้งเว้นครั้ง) เราตีตัวในความมืดคริทุกครั้ง'],
 ['mictlan','azt','E1','มิกตลันเตกุตลี',"Staff of Mictlan",'ไม้เท้ามิกตลัน','rule','กองทัพกระดูก','ทุกตัวที่ 5 ที่ฆ่า ลุกเป็นโครงกระดูกสู้ให้ 15 วิ (สูงสุด 3 ตัว)'],
 ['quetzal','azt','E2','เควตซัลโคอาทล์',"Quetzal Feather",'ขนนกเควตซัล','rule','ใบลมขนนก','ทุกครั้งที่ใช้สกิล ปล่อยใบลมขนนกพุ่งทะลุแถว 400 ใส่ศัตรูที่ใกล้สุด ATK/TAL×1']];
/* live relics: the boss is in the maps and the power is coded */
const LIVE={fenrir:{lv:80,map:'vikD2c',where:'บัลลังก์เฟนเรียร์ (ถ้ำเฟนเรียร์ ชั้น 3)',cd:[90,84,78,72,66],use:o=>fenrirHowl(o)}};
const R={},KEYS=[];
for(const d of DATA){const [key,land,slot,boss,en,th,type,pw,txt]=d;R[key]={key,land,slot,tier:SLOT_TIER[slot],boss,en,th,type,pw,txt,live:LIVE[key]||null};KEYS.push(key);}

/* ---------------- save (account-wide per mode) ---------------- */
const MODE=A.MODE,SKEY='af_relic_v1'+(MODE==='play'?'_play':'');
let RS={v:1,sh:{},kill:{},got:{},tgH:{}};
try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.v===1)RS=Object.assign(RS,s);}catch(e){}
const saveRS=()=>{try{localStorage.setItem(SKEY,JSON.stringify(RS));}catch(e){}};

/* ---------------- items ---------------- */
const gradeOf=r=>A.gradeOfLv(r.live?r.live.lv:80);
function makeRelic(k,star=1){const r=R[k],g=gradeOf(r),t=A.gradeTier(g);
  return A.mkInst({base:null,n:r.en,slot:'acc',kind:'Accessory',relic:k,star:Math.max(1,Math.min(5,star|0||1)),st:A.craftStats(r.land,'acc',g,false),x:{},b:{},
    grade:g,tier:t,wlv:t,lvReq:A.gradeLv(g),sockets:0,orbs:[],ref:0,w:10,rank:'All',sealM:1,d:`วัตถุโบราณจาก${r.boss} · ${TYPE[r.type][0]} ${r.pw}`});}
function give(k,star,why){const id=makeRelic(k,star);A.buyGear(id,0);RS.got[k]=1;saveRS();
  chatLog('sys',`🗿 ได้ <b style="color:#b89aff">${R[k].th}</b> ★${star}${why?` (${why})`:''} — สวมที่ช่องเครื่องประดับ${R[k].type==='act'?' แล้วกด R':''}`);return id;}
const relicIds=()=>[...Object.values(EQ).filter(Boolean),...INV].filter(id=>ITEMS[id]&&ITEMS[id].relic);
function ownedMap(){const m={};for(const id of relicIds()){const it=ITEMS[id],k=it.relic;if(!R[k])continue;const o=m[k]||(m[k]={n:0,star:0,eq:false,ids:[]});
  o.n++;o.ids.push(id);o.star=Math.max(o.star,it.star||1);if(EQ.acc1===id)o.eq=true;}return m;}
/* the copy that grows: the one worn, else the highest star */
const bestOf=o=>o.ids.find(id=>EQ.acc1===id)||o.ids.slice().sort((a,b)=>(ITEMS[b].star||1)-(ITEMS[a].star||1))[0];
function eqRelic(){const id=EQ.acc1,it=id&&ITEMS[id];if(!it||!it.relic||!R[it.relic])return null;return {id,it,r:R[it.relic]};}
function usable(o){if(!o)return 'ไม่ได้สวมวัตถุโบราณ';if(!o.r.live||!o.r.live.use)return 'บอสตัวนี้ยังไม่ลงแมพ ยังใช้ไม่ได้';if(o.it.broken)return 'แตก — ซ่อมที่ช่างตีบวกก่อน';
  if((o.it.lvReq||1)>PS.lv)return `ต้องเลเวล ${o.it.lvReq}`;if(player.hp<=0)return 'ตายอยู่';return null;}
const starCost=(r,s)=>Math.round(TIER[r.tier].pity*STAR_K[Math.max(1,Math.min(4,s))]);
const cdOf=(r,s)=>r.live&&r.live.cd?r.live.cd[Math.max(1,Math.min(5,s||1))-1]:0;
const RC={};                                                                           // relic key → gameTime when ready
const cdLeft=k=>Math.max(0,(RC[k]||0)-gameTime);
const starsHtml=n=>`<span class="rls">${'★'.repeat(n)}<s>${'★'.repeat(5-n)}</s></span>`;
function statsText(k){const r=R[k],st=A.craftStats(r.land,'acc',gradeOf(r),false),N={atk:'ATK',def:'DEF',agi:'AGI',vit:'VIT',int:'INT',cha:'CHA',tal:'TAL',lck:'LCK'};
  return Object.entries(st).map(([s,v])=>`${N[s]||s} +${Math.max(1,Math.round(v*ITEM_STAT_SCALE))}`).join(' · ');}
function powerText(r,star){if(r.key==='fenrir')return `กด R: รีเซ็ตคูลดาวน์ทุกสกิลทันที ยกเว้นท่าไม้ตาย (ชาร์จสะสมของเจมก็เติมเต็ม) · คูลดาวน์ ${cdOf(r,star)} วิ`;return r.txt;}

/* ---------------- pictures (painted icon when it exists, else a code placeholder) ---------------- */
const hasPic=k=>!!(A.iconHas&&A.iconHas('relic_'+k));
const FANG_SVG=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rlfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#e6e0d0"/><stop offset="1" stop-color="#8fd4ff"/></linearGradient></defs>
<g fill="none" stroke-linecap="round"><path d="M45 7 C51 3 58 7 58 13" stroke="#3a1f14" stroke-width="5"/><path d="M45 7 C51 3 58 7 58 13" stroke="#c07a46" stroke-width="2.6"/>
<ellipse cx="50" cy="16" rx="6.2" ry="3.8" transform="rotate(35 50 16)" stroke="#3a1f14" stroke-width="4.6"/><ellipse cx="50" cy="16" rx="6.2" ry="3.8" transform="rotate(35 50 16)" stroke="#c07a46" stroke-width="2.4"/></g>
<path d="M11 23 C13 12 26 8 36 12 C43 9 51 13 51 21 C47 20 45 23 44 27 C38 23 28 23 21 29 C16 28 11 26 11 23Z" fill="#2e2660" stroke="#120c2c" stroke-width="2.2" stroke-linejoin="round"/>
<g stroke="#a8c0ff" stroke-width="1.5" stroke-linecap="round"><path d="M17 21 l2 -1.2"/><path d="M26 15.5 l1.8 -.6"/><path d="M37 16.5 l2 0"/></g>
<path d="M21 28 C29 23 40 23 44 27 C46 39 42 51 31 61 C32 49 28 37 21 28Z" fill="url(#rlfg)" stroke="#3a2a1f" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M28 31 L32 37 L30 42 L34 48" fill="none" stroke="#2aa0ff" stroke-width="2" stroke-linecap="round"/><path d="M25 30 C27 33 28 37 28 41" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
<path d="M13 31 l5 -6 5 6 -5 6z" fill="#4ab8ff" stroke="#122a52" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 30 l2.6 -3" stroke="#e6f6ff" stroke-width="1.2"/></svg>`;
const UNK_SVG=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#5c566a" stroke="#2a2430" stroke-width="3"/><circle cx="32" cy="32" r="17" fill="none" stroke="#8c86a0" stroke-width="2" stroke-dasharray="4 3"/><text x="32" y="41" text-anchor="middle" font-size="24" font-weight="900" fill="#ddd6ec" font-family="Mali,sans-serif">?</text></svg>`;
const svgSz=(svg,sz)=>svg.replace('<svg ',`<svg width="${sz}" height="${sz}" `);
function relicPic(k,sz){if(hasPic(k))return `<img src="assets/items/relic_${k}.png" width="${sz}" height="${sz}" alt="" draggable="false" style="object-fit:contain;display:block">`;return svgSz(k==='fenrir'?FANG_SVG:UNK_SVG,sz);}
/* item icons everywhere (bag, equipment, refine, market …): picture or placeholder + a small ★ badge */
{const _ii=itemIcon;itemIcon=function(it,sz=24){if(!it||!it.relic||!R[it.relic])return _ii(it,sz);
  const base=hasPic(it.relic)?_ii(it,sz):svgSz(it.relic==='fenrir'?FANG_SVG:UNK_SVG,sz)+(it.broken?`<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" style="position:absolute;left:0;top:0"><path d="M14 2 L10 9 L14 12 L9 22" fill="none" stroke="#c0202a" stroke-width="2.2"/></svg>`:'');
  return `<span class="rlico" style="position:relative;display:inline-block;width:${sz}px;height:${sz}px;line-height:0;vertical-align:middle">${base}${sz>=20?`<i class="rlbd" style="font-size:${Math.max(8,Math.round(sz*.32))}px">★${it.star||1}</i>`:''}</span>`;};}
/* item card (right click): what the relic does */
{const _ie=window.itemExtraInfo;window.itemExtraInfo=id=>{const it=ITEMS[id],base=_ie?_ie(id):'';if(!it||!it.relic||!R[it.relic])return base;const r=R[it.relic];
  return base+`<div class="t12x" style="color:#3a2a7a">🗿 <b>วัตถุโบราณของบอส · ${r.boss}</b> ${starsHtml(it.star||1)}<br>${TYPE[r.type][0]} <b>${r.pw}</b>: ${powerText(r,it.star||1)}${r.live?'':'<br><i>บอสตัวนี้ยังไม่ลงแมพ — ยังใช้พลังไม่ได้</i>'}</div>`;};}

/* ---------------- Fenrir's Fang · หอนแร็กนาร็อก ---------------- */
const isUlt=k=>{const s=SKILLS[k];return !!(s&&(s.ult||/ULTIMATE/.test(s.th||'')));};
function fenrirHowl(o){const reset=[];for(const k in player.cd)if(SKILLS[k]&&!isUlt(k)&&player.cd[k]>.05)reset.push(k);
  let ch=0;try{if(window.totemGems&&totemGems.refill)ch=totemGems.refill(k=>!isUlt(k));}catch(e){}
  if(!reset.length&&!ch){msg('ยังไม่มีสกิลติดคูลดาวน์ — เก็บหอนไว้ใช้ตอนปล่อยท่าหมดแล้ว');return false;}
  for(const k of reset)player.cd[k]=0;
  howlFx(reset);chatLog('bat',`🐺 <b style="color:#a8b8ff">หอนแร็กนาร็อก</b> — รีเซ็ตคูลดาวน์ ${reset.length} สกิล${ch?` · เติมชาร์จ ${ch}`:''}`);return true;}
function useRelic(){const o=eqRelic(),why=usable(o);if(why){msg(o?`${o.r.th}: ${why}`:'ยังไม่ได้สวมวัตถุโบราณที่มีสกิล — เปิด 🗿 ในหน้าอุปกรณ์');return false;}
  if(o.r.type!=='act'){msg(`${o.r.th}: เป็นพลังติดตัว ไม่ต้องกด`);return false;}
  const left=cdLeft(o.r.key);if(left>0){msg(`${o.r.pw} · คูลดาวน์ ${left<10?left.toFixed(1):Math.ceil(left)} วิ`);return false;}
  if(!o.r.live.use(o))return false;
  RC[o.r.key]=gameTime+cdOf(o.r,o.it.star);upd(true);return true;}

/* ---------------- VFX: Fenrir's own howl clip rises behind the hero as a spirit ---------------- */
const HOWL={f:'assets/monsters/fenrirBoss_howl.webp',cw:418,ch:333,px:213,py:308,cols:8,img:null,ok:0};
function howlImg(){if(!HOWL.img){HOWL.img=new Image();HOWL.img.onload=()=>{HOWL.ok=1;};HOWL.img.src=HOWL.f;}return HOWL.ok?HOWL.img:null;}
class RlGhost{constructor(o){Object.assign(this,{t:0,layer:'sorted',f0:3,f1:34,fps:15,sc:.5,fade:.4},o);this.life=(this.f1-this.f0)/this.fps+this.fade;
    this.peak=(11-this.f0)/this.fps;this.fired=0;this.flip=/W/.test(player.dir||'')?-1:1;}
  update(dt){this.t+=dt;this.x=player.x;this.y=player.y;this.sy=this.y-2;if(!this.fired&&this.t>=this.peak){this.fired=1;howlPeak(this);}return this.t<this.life;}
  draw(){const img=howlImg();if(!img)return;const f=Math.min(this.f1,this.f0+Math.floor(this.t*this.fps)),cx=(f%HOWL.cols)*HOWL.cw,cy=Math.floor(f/HOWL.cols)*HOWL.ch,
      a=Math.min(1,this.t/.15)*Math.max(0,Math.min(1,(this.life-this.t)/this.fade)),[X,Y]=P(this.x-this.flip*22,this.y-20);
    ctx.save();ctx.translate(X,Y);ctx.scale(this.flip*this.sc,this.sc);
    ctx.globalAlpha=.9*a;ctx.drawImage(img,cx,cy,HOWL.cw,HOWL.ch,-HOWL.px,-HOWL.py,HOWL.cw,HOWL.ch);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.24*a;ctx.drawImage(img,cx,cy,HOWL.cw,HOWL.ch,-HOWL.px,-HOWL.py,HOWL.cw,HOWL.ch);ctx.restore();}}
/* dark night pool under the spirit (readable on snow) */
class RlPool{constructor(o){Object.assign(this,{t:0,layer:'ground',life:2.4},o);}update(dt){this.t+=dt;this.x=player.x;this.y=player.y;return this.t<this.life;}
  draw(){const k=this.t/this.life,a=Math.min(1,this.t/.25)*Math.min(1,(this.life-this.t)/.5),[X,Y]=P(this.x,this.y);ctx.save();ctx.translate(X,Y);ctx.scale(1,K);
    const g=ctx.createRadialGradient(0,0,4,0,0,78);g.addColorStop(0,`rgba(28,20,70,${.55*a})`);g.addColorStop(.7,`rgba(40,30,110,${.32*a})`);g.addColorStop(1,'rgba(40,30,110,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,78,0,TAU);ctx.fill();
    ctx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const an=i/9*TAU+this.t*.7,r=30+18*Math.sin(i*2.3+this.t*2);ctx.fillStyle=`rgba(150,190,255,${.55*a*(.5+.5*Math.sin(this.t*7+i))})`;ctx.beginPath();ctx.arc(Math.cos(an)*r,Math.sin(an)*r,1.6,0,TAU);ctx.fill();}
    ctx.restore();}}
class RlRing{constructor(o){Object.assign(this,{t:0,layer:'ground',life:.65,r0:22,r1:190,w:6,c:'#8fa8ff'},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const k=this.t/this.life,e=1-Math.pow(1-k,2.4),r=this.r0+(this.r1-this.r0)*e,[X,Y]=P(this.x,this.y),lw=Math.max(1,this.w*(1-k*.65));ctx.save();ctx.translate(X,Y);ctx.scale(1,K);
    ctx.globalAlpha=(1-k)*.95;ctx.strokeStyle='rgba(16,10,44,.6)';ctx.lineWidth=lw+3;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();ctx.strokeStyle=this.c;ctx.lineWidth=lw;ctx.stroke();
    ctx.strokeStyle='rgba(235,245,255,.8)';ctx.lineWidth=Math.max(.8,lw*.3);ctx.beginPath();ctx.arc(0,0,r-lw*.2,0,TAU);ctx.stroke();ctx.restore();}}
function star4(s){ctx.beginPath();ctx.moveTo(0,-s);ctx.quadraticCurveTo(s*.18,-s*.18,s,0);ctx.quadraticCurveTo(s*.18,s*.18,0,s);ctx.quadraticCurveTo(-s*.18,s*.18,-s,0);ctx.quadraticCurveTo(-s*.18,-s*.18,0,-s);ctx.fill();}
class RlStar{constructor(o){Object.assign(this,{t:0,layer:'top',life:.95,z:40,s:5,c:'#9fc0ff'},o);}update(dt){this.t+=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;const d=Math.pow(.05,dt);this.vx*=d;this.vy*=d;this.vz*=d;return this.t<this.life;}
  draw(){const k=this.t/this.life,[X,Y]=P(this.x,this.y,this.z),s=this.s*(k<.15?k/.15:1-(k-.15)*.75);ctx.save();ctx.translate(X,Y);ctx.rotate(this.t*2.4);ctx.globalAlpha=1-k*k;
    ctx.fillStyle='rgba(14,10,46,.55)';star4(s+1.8);ctx.fillStyle=this.c;star4(s);ctx.fillStyle='#ffffff';star4(s*.42);ctx.restore();}}
/* broken links of Gleipnir fly off, bounce once and fade */
class RlLink{constructor(o){Object.assign(this,{t:0,layer:'sorted',life:1.5,z:44,rot:0,b:0},o);this.sy=this.y;}
  update(dt){this.t+=dt;if(this.z>0||this.vz>0){this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;this.vz-=560*dt;this.rot+=this.sp*dt;
      if(this.z<=0){this.z=0;if(!this.b&&this.vz<-90){this.b=1;this.vz*=-.32;this.vx*=.45;this.vy*=.45;this.sp*=.4;}else{this.vz=0;this.vx=this.vy=0;}}}this.sy=this.y;return this.t<this.life;}
  draw(){const [X,Y]=P(this.x,this.y,this.z),a=this.t>this.life-.4?(this.life-this.t)/.4:1;ctx.save();ctx.translate(X,Y);ctx.rotate(this.rot);ctx.globalAlpha=Math.max(0,a);
    ctx.lineCap='round';ctx.lineWidth=4.6;ctx.strokeStyle='#2e1810';ctx.beginPath();ctx.ellipse(0,0,8.4,3.5,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(8.4,-4.6);ctx.lineTo(8.4,4.6);ctx.moveTo(-8.4,-3.4);ctx.lineTo(-8.4,1.2);ctx.stroke();
    ctx.lineWidth=2.6;ctx.strokeStyle='#b26f3e';ctx.beginPath();ctx.ellipse(0,0,8.4,3.5,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(8.4,-4.6);ctx.lineTo(8.4,4.6);ctx.moveTo(-8.4,-3.4);ctx.lineTo(-8.4,1.2);ctx.stroke();   /* one link + the broken stubs of its neighbours */
    ctx.lineWidth=1.1;ctx.strokeStyle='#f0c08a';ctx.beginPath();ctx.ellipse(0,-.6,6.6,2.1,0,Math.PI*1.1,Math.PI*1.85);ctx.stroke();ctx.restore();}}
function howlFx(reset){try{howlImg();addFx(new RlPool({x:player.x,y:player.y}));addFx(new RlGhost({}));
  addFx(new DText({x:player.x,y:player.y,z:112,text:'หอนแร็กนาร็อก!',color:'#b8c8ff',size:16,life:1.3}));
  for(let i=0;i<10;i++){const an=Math.random()*TAU,sp=40+Math.random()*60;addFx(new RlStar({x:player.x,y:player.y,z:30+Math.random()*40,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:30+Math.random()*50,s:3+Math.random()*3,life:.7+Math.random()*.5}));}
  }catch(e){}flashBtns(reset);}
function howlPeak(g){try{const x=player.x,y=player.y;
  addFx(new RlRing({x,y,c:'#7f96ff',r1:200,w:7}));addFx(new RlRing({x,y,c:'#bfe2ff',r1:150,w:4,life:.5}));setFx(()=>addFx(new RlRing({x,y,c:'#5a4ad8',r1:240,w:5,life:.75})),.12);
  for(let i=0;i<6;i++){const an=i/6*TAU+Math.random()*.5,sp=110+Math.random()*90;addFx(new RlLink({x:x+Math.cos(an)*10,y:y+Math.sin(an)*6,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.62,vz:160+Math.random()*120,sp:(Math.random()-.5)*16}));}
  for(let i=0;i<14;i++){const an=i/14*TAU,sp=150+Math.random()*80;addFx(new RlStar({x,y,z:26,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:(Math.random()-.3)*40,s:3.5+Math.random()*2.5,c:i%2?'#9fc0ff':'#d8c8ff',life:.6+Math.random()*.3}));}
  shake(3.5);if(typeof flash==='object'&&flash)flash.a=Math.max(flash.a||0,.1),flash.c='#5a64ff';}catch(e){}}
function setFx(f,s){let t=0;addFx({layer:'none',update(dt){t+=dt;if(t>=s){try{f();}catch(e){}return false;}return true;},draw(){}});}
function flashBtns(reset){const S=new Set(reset);try{for(const {el,k} of slotEls)if(S.has(k)){el.classList.remove('rlFlash');void el.offsetWidth;el.classList.add('rlFlash');}}catch(e){}
  document.querySelectorAll('#mobSkW .mobSk:not(.ult):not(.empty)').forEach(el=>{el.classList.remove('rlFlash');void el.offsetWidth;el.classList.add('rlFlash');});
  setTimeout(()=>document.querySelectorAll('.rlFlash').forEach(el=>el.classList.remove('rlFlash')),900);}
/* the drop: a gold pillar where the boss fell */
class RlBeam{constructor(o){Object.assign(this,{t:0,layer:'top',life:2.6},o);}update(dt){this.t+=dt;return this.t<this.life;}
  draw(){const a=Math.min(1,this.t/.2)*Math.min(1,(this.life-this.t)/.6),[X,Y]=P(this.x,this.y),h=190,w=26+4*Math.sin(this.t*9);ctx.save();ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(0,Y-h,0,Y);g.addColorStop(0,'rgba(255,220,120,0)');g.addColorStop(.6,`rgba(255,200,90,${.35*a})`);g.addColorStop(1,`rgba(255,240,190,${.7*a})`);ctx.fillStyle=g;ctx.fillRect(X-w/2,Y-h,w,h);
    ctx.fillStyle=`rgba(255,250,220,${.8*a})`;ctx.fillRect(X-w*.12,Y-h*.8,w*.24,h*.8);ctx.restore();}}
function dropFx(e){try{const x=e?e.x:player.x,y=e?e.y:player.y;addFx(new RlBeam({x,y}));addFx(new RlRing({x,y,c:'#ffcf3a',r1:120,w:5,life:.8}));
  addFx(new DText({x,y,z:130,text:'🗿 วัตถุโบราณ!',color:'#ffd84a',size:18,life:2.2}));}catch(err){}}

/* ---------------- boss kills: shard + drop roll ---------------- */
function bossKill(k,e){const r=R[k];if(!r||!r.live)return;const T=TIER[r.tier];RS.kill[k]=(RS.kill[k]||0)+1;RS.sh[k]=(RS.sh[k]||0)+1;saveRS();
  chatLog('sys',`🗿 เศษ${r.th} +1 (${RS.sh[k]}/${T.pity})${RS.sh[k]>=T.pity?' — <b>พอสร้างแล้ว!</b> (🗿 ในหน้าอุปกรณ์)':''}`);
  if(Math.random()<1/T.drop){give(k,1,`ดรอป 1/${T.drop}`);dropFx(e);msg(`🎉 ได้${r.th}!`);}
  buildRelics();}

/* ---------------- R key · PC button above AUTO · phone button above the skill-set button ---------------- */
const css=document.createElement('style');css.textContent=`
#relicw{position:fixed;z-index:12;bottom:92px;left:calc(50% + var(--hbw,330px)/2 + 21px);display:none}
#relicw.on{display:block}
.rlbtn{position:relative;width:58px;height:58px;border-radius:50%;border:3px solid #e9b44c;padding:0;cursor:pointer;touch-action:none;
  background:radial-gradient(circle at 50% 36%,#4a4290,#151034 72%);box-shadow:0 0 0 2px #3a1f14,0 3px 8px rgba(0,0,0,.45)}
.rlbtn .ic{position:absolute;inset:5px;border-radius:50%;overflow:hidden;display:grid;place-items:center;pointer-events:none}
.rlbtn .ic img,.rlbtn .ic svg{width:100%;height:100%;object-fit:contain}
.rlbtn .sw{position:absolute;inset:0;border-radius:50%;background:conic-gradient(rgba(8,4,22,.74) calc(var(--p,0)*1turn),transparent 0);pointer-events:none}
.rlbtn .t{position:absolute;inset:0;display:grid;place-items:center;font:900 16px Mali,sans-serif;color:#fff;text-shadow:0 0 3px #000,0 1px 2px #000;pointer-events:none}
.rlbtn .st{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);font:900 10px/1 sans-serif;color:#ffd84a;text-shadow:0 0 2px #3a1f14,0 1px 1px #3a1f14;white-space:nowrap;letter-spacing:-1px;pointer-events:none}
.rlbtn .kb{position:absolute;left:-6px;top:-8px;width:18px;height:18px;border-radius:50%;background:#3a2a1f;color:#fff;font:700 10px/18px Mali,sans-serif;text-align:center;pointer-events:none}
.rlbtn.rdy{animation:rlRdy 1.8s ease-in-out infinite}.rlbtn.off{filter:grayscale(.8) brightness(.75)}.rlbtn.pr{transform:scale(.92)}
@keyframes rlRdy{50%{box-shadow:0 0 0 2px #3a1f14,0 0 16px 4px rgba(140,165,255,.9)}}
body.mob #relicw{display:none!important}
@media (max-width:640px){#relicw{left:auto;right:8px;bottom:auto;top:250px}}
#mobRelic{position:fixed;z-index:26;display:none}#mobRelic.on{display:block}body.mobEdit #mobRelic{display:none!important}
#mobRelic .rlbtn{width:52px;height:52px}#mobRelic .kb{display:none}#mobUI.op #mobRelic{opacity:var(--mop)}
.hbt.rlFlash,.mobSk.rlFlash{animation:rlFlash .8s ease-out}
@keyframes rlFlash{0%{filter:brightness(2.6)}35%{filter:brightness(1.6);box-shadow:0 0 0 3px #9fb4ff,0 0 18px 6px rgba(120,140,255,.85)}100%{filter:none}}
span.rlico i.rlbd{position:absolute;left:-1px;bottom:-2px;font-style:normal;font-weight:900;line-height:1;color:#ffd84a;text-shadow:0 0 2px #2a1a40,0 0 2px #2a1a40,0 1px 1px #000;pointer-events:none}
.ro-grid .c>span.rlico{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.rls{color:#f0a52c;letter-spacing:1px}.rls s{text-decoration:none;color:#b8c2d6}
/* codex window */
#rlw{width:min(720px,97vw)}#rlw .ttbd{max-height:calc(100vh - 66px);overflow-y:auto;overflow-x:hidden}
#rlw .rlg{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,6fr);gap:8px}
#rlw .rlrow{display:flex;align-items:center;gap:6px;margin:0 0 6px}#rlw .rll{flex:none;width:44px;font:800 11px Mali,sans-serif;color:#2d4a8a;text-align:center;line-height:1.15}
#rlw .rll i{display:block;margin:2px auto 0;width:26px;height:4px;border-radius:2px;background:var(--c)}
#rlw .rlts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;flex:1}
#rlw .rlt{position:relative;aspect-ratio:1;min-width:0;border-radius:11px;border:2.5px solid #7d9ccf;background:radial-gradient(circle at 50% 35%,#fff,#d4e3f8);padding:3px;cursor:pointer;display:grid;place-items:center}
#rlw .rlt img,#rlw .rlt svg{width:100%;height:100%}
#rlw .rlt.own{border-color:#e2a52c;background:radial-gradient(circle at 50% 35%,#fffbe8,#ffe3a0)}
#rlw .rlt.live{border:3px solid transparent;background:radial-gradient(circle at 50% 35%,#f4f6fc,#cfd8ea) padding-box,conic-gradient(#f0a52c calc(var(--p,0)*1turn),#a9b6cf 0) border-box}
#rlw .rlt.live img,#rlw .rlt.live svg{opacity:.62;filter:saturate(.6)}
#rlw .rlt.soon{border-color:#a9b2c2;background:#e3e7ef}#rlw .rlt.soon img,#rlw .rlt.soon svg{opacity:.45;filter:grayscale(.85)}
#rlw .rlt.sel{box-shadow:0 0 0 2px #ffd77a,0 0 10px #ffb02e}
#rlw .rlt>i{position:absolute;left:2px;bottom:0;font:900 10px Mali;color:#ffcf3a;font-style:normal;text-shadow:0 0 2px #2a1a40,0 0 2px #2a1a40}
#rlw .rlt>b{position:absolute;right:-4px;top:-5px;background:#2a9a28;color:#fff;border-radius:6px;font:800 8.5px/12px Mali;padding:0 3px}
#rlw .rlt>u{position:absolute;right:1px;bottom:0;font-size:10px;text-decoration:none}
#rlw .rlhd{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 6px;font:800 12.5px Mali;color:#2d4a8a}#rlw .rlhd small{font:700 11px Mali;color:#6a7a9a}
#rlw .rlh{display:flex;gap:9px;align-items:center}#rlw .rlh .bi{flex:none;width:76px;height:76px;border-radius:14px;background:radial-gradient(circle at 50% 38%,#4a4290,#151034 75%);border:3px solid #e9b44c;display:grid;place-items:center;padding:4px}
#rlw .rlh .bi img,#rlw .rlh .bi svg{width:100%;height:100%}#rlw .rlh .bi.dim img,#rlw .rlh .bi.dim svg{opacity:.45;filter:grayscale(.7)}
#rlw .rlh b{display:block;font:800 15px Mali,sans-serif;color:#2a2a5a}#rlw .rlh small{display:block;font:600 11px Mali;color:#6a7a9a}
#rlw .rls{font-size:14px;letter-spacing:1px;color:#f0a52c;text-shadow:0 1px 0 #8a5a14}#rlw .rls s{text-decoration:none;color:#b8c2d6;text-shadow:none}
#rlw .rlp{margin:7px 0 5px;padding:6px 8px;border-radius:10px;background:#fff;border:1.5px solid #c8d6ee;font:600 11.5px/1.5 Mali,sans-serif;color:#2a3a5a}
#rlw .rlp b{color:#3a2a8a}#rlw .rlty{font:800 10px Mali;color:#fff;background:#5a64b8;border-radius:8px;padding:0 6px;margin-left:3px}
#rlw .rlcd{display:flex;flex-wrap:wrap;gap:3px;margin:0 0 5px}#rlw .rlcd span{font:700 10.5px Mali;color:#5a6a8a;background:#e8eef9;border-radius:8px;padding:1px 6px}#rlw .rlcd span.on{background:#ffd77a;color:#5a3a08}
#rlw .rli{font:600 11px/1.5 Mali,sans-serif;color:#4a5a7a;margin:2px 0}
#rlw .rlbar{display:flex;align-items:center;gap:6px;margin:6px 0}#rlw .rlbar span{font:700 11.5px Mali;color:#2a3a5a;white-space:nowrap}
#rlw .rlbar i{flex:1;height:10px;border-radius:5px;background:linear-gradient(90deg,#f0a52c calc(var(--p,0)*100%),#d4dceb 0);box-shadow:inset 0 1px 2px rgba(0,0,0,.25)}
#rlw .rlact{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}#rlw .rlsoon{margin-top:8px;padding:8px;border-radius:10px;background:#eef0f5;color:#6a7080;font:700 12px Mali;text-align:center}
#rlw .rltest{margin-top:8px;padding-top:6px;border-top:2px dashed #b8c8e6;display:flex;flex-wrap:wrap;gap:4px;align-items:center}#rlw .rltest .ttnote{width:100%}
@media (max-width:600px){#rlw .rlg{grid-template-columns:1fr}}
.ro-eq .sl.rlsl{cursor:pointer}`;
document.head.appendChild(css);
function mkBtn(kb){const b=document.createElement('button');b.className='rlbtn';b.innerHTML=`${kb?'<span class="kb">R</span>':''}<span class="ic"></span><span class="sw"></span><span class="t"></span><span class="st"></span>`;
  return {btn:b,ic:b.querySelector('.ic'),sw:b.querySelector('.sw'),t:b.querySelector('.t'),st:b.querySelector('.st'),sig:''};}
const pc=mkBtn(1);pc.wrap=document.createElement('div');pc.wrap.id='relicw';pc.wrap.appendChild(pc.btn);document.body.appendChild(pc.wrap);
pc.btn.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(e.button===2)return;pc.btn.classList.add('pr');setTimeout(()=>pc.btn.classList.remove('pr'),120);useRelic();});
pc.btn.addEventListener('contextmenu',e=>{e.preventDefault();const o=eqRelic();openRelics(o&&o.r.key);});
let mob=null;
function mkMob(){const ui=document.getElementById('mobUI');if(!ui||mob)return;mob=mkBtn(0);mob.wrap=document.createElement('div');mob.wrap.id='mobRelic';mob.wrap.appendChild(mob.btn);ui.appendChild(mob.wrap);
  let lt=null,long=false;
  mob.btn.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();long=false;mob.btn.classList.add('pr');lt=setTimeout(()=>{long=true;mob.btn.classList.remove('pr');const o=eqRelic();openRelics(o&&o.r.key);try{navigator.vibrate&&navigator.vibrate(15);}catch(err){}},450);});
  const end=e=>{e.preventDefault();e.stopPropagation();clearTimeout(lt);mob.btn.classList.remove('pr');if(!long&&e.type==='pointerup')useRelic();long=true;};
  mob.btn.addEventListener('pointerup',end);mob.btn.addEventListener('pointercancel',end);mob.btn.addEventListener('contextmenu',e=>e.preventDefault());}
function placeMob(){if(!mob)return;const s=document.getElementById('mobSkSet');if(!s)return;const r=s.getBoundingClientRect();if(!r.width)return;
  const sz=Math.round(Math.max(44,Math.min(60,r.width*1.15)));mob.btn.style.width=mob.btn.style.height=sz+'px';mob.wrap.style.left=Math.round(r.left+r.width/2-sz/2)+'px';mob.wrap.style.top=Math.round(r.top-sz-16)+'px';}
function upd(){if(!mob)mkMob();const o=eqRelic(),act=!!(o&&o.r.type==='act'&&o.r.live&&o.r.live.use);
  for(const B of [pc,mob]){if(!B)continue;B.wrap.classList.toggle('on',act);if(!act)continue;
    const sig=o.id+':'+(o.it.star||1)+':'+(hasPic(o.r.key)?1:0)+':'+(o.it.broken?1:0);
    if(B.sig!==sig){B.sig=sig;B.ic.innerHTML=relicPic(o.r.key,44);B.st.textContent='★'.repeat(o.it.star||1);
      B.btn.title=`${o.r.th} ★${o.it.star||1} (R)\n${TYPE[o.r.type][0]} ${o.r.pw}: ${powerText(o.r,o.it.star||1)}\nคลิกขวา = เปิดสมุดวัตถุโบราณ`;}
    const left=cdLeft(o.r.key),cd=cdOf(o.r,o.it.star)||1,why=usable(o);B.sw.style.setProperty('--p',left>0?Math.min(1,left/cd).toFixed(3):0);
    B.t.textContent=left>0?(left<10?left.toFixed(1):Math.ceil(left)):'';B.btn.classList.toggle('rdy',!left&&!why);B.btn.classList.toggle('off',!!why);}
  if(mob&&act)placeMob();}
let lastT=0;(function tick(){requestAnimationFrame(tick);const n=performance.now();if(n-lastT<90)return;lastT=n;try{upd();}catch(e){}})();
addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;if(/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;
  if(e.key==='r'||e.key==='R'){e.preventDefault();useRelic();}else if(e.key==='Escape'){const w=$('#rlw');if(w)w.classList.remove('open');}});

/* ---------------- codex window ---------------- */
let SEL='fenrir';
function openRelics(k){if(k&&R[k])SEL=k;A.ui.ttWin('rlw','🗿 วัตถุโบราณของบอส');const w=$('#rlw');w.classList.add('open');w.style.zIndex=60;buildRelics();}
function tile(k,o){const r=R[k],sh=RS.sh[k]||0,st=o?'own':r.live?'live':'soon';
  return `<button class="rlt ${st}${k===SEL?' sel':''}" data-k="${k}" title="${r.th} · ${r.boss}" ${st==='live'?`style="--p:${Math.min(1,sh/TIER[r.tier].pity).toFixed(3)}"`:''}>${relicPic(k,44)}${o?`<i>★${o.star}</i>`:''}${o&&o.eq?'<b>E</b>':''}${st==='soon'?'<u>🔒</u>':''}</button>`;}
function detail(k,o){const r=R[k],T=TIER[r.tier],sh=RS.sh[k]||0,cur=o?o.star:0;
  let h=`<div class="rlh"><div class="bi${o?'':' dim'}">${relicPic(k,68)}</div><div><b>${r.th}</b><small>${r.en}</small>${starsHtml(cur)}<small>จาก <b style="display:inline;font-size:11px">${r.boss}</b> · ${T.n}${r.live?` Lv${r.live.lv}`:''} · แดน${LANDS[r.land].n}</small></div></div>`;
  h+=`<div class="rlp">${TYPE[r.type][0]} <b>${r.pw}</b><span class="rlty">${TYPE[r.type][1]}</span><br>${r.live?powerText(r,cur||1):r.txt}</div>`;
  if(r.live&&r.live.cd)h+=`<div class="rlcd">${r.live.cd.map((c,i)=>`<span class="${cur===i+1?'on':''}">★${i+1} คูล ${c} วิ</span>`).join('')}</div>`;
  if(!r.live)return h+`<div class="rlsoon">🔒 ${r.boss}ยังไม่ลงแมพ — ของชิ้นนี้เปิดพร้อมบอส</div>`;
  h+=`<div class="rli">ค่าพลัง: ${statsText(k)} (เท่าเครื่องประดับคราฟต์แดน${LANDS[r.land].n} Lv${r.live.lv})</div>`;
  h+=`<div class="rli">ที่อยู่บอส: ${r.live.where} · ดรอป 1/${T.drop} ต่อการล้ม · ล้มไปแล้ว ${RS.kill[k]||0} ครั้ง</div>`;
  h+=`<div class="rlbar"><span>เศษ ${sh}/${T.pity}</span><i style="--p:${Math.min(1,sh/T.pity).toFixed(3)}"></i></div><div class="rli" style="margin-top:-3px">ได้เศษ 1 ชิ้นทุกครั้งที่ล้มบอส (ใช้ร่วมกันทุกฮีโร่) · ครบ ${T.pity} สร้างของได้ 1 ชิ้น</div>`;
  const a=[];a.push(`<button class="ttb sm" data-a="craft" ${sh>=T.pity?'':'disabled'}>⚒ สร้างจากเศษ ${T.pity}</button>`);
  if(o){const tgt=ITEMS[bestOf(o)],s=tgt.star||1;
    if(s<5){const dup=o.ids.filter(id=>id!==bestOf(o)&&INV.includes(id)).length,c=starCost(r,s);
      a.push(`<button class="ttb sm" data-a="dup" ${dup?'':'disabled'} title="ใช้ชิ้นซ้ำในกระเป๋า 1 ชิ้น">★${s}→★${s+1} ชิ้นซ้ำ (${dup})</button>`);
      a.push(`<button class="ttb sm" data-a="shard" ${sh>=c?'':'disabled'}>★${s}→★${s+1} เศษ ${c}</button>`);}
    else a.push(`<span class="ttnote ttgood">★5 เต็มแล้ว</span>`);
    if(!o.eq)a.push(`<button class="ttb sm" data-a="equip">สวมใส่</button>`);}
  h+=`<div class="rlact">${a.join('')}</div>`;
  if(!o)h+=`<div class="rli">ยังไม่มีชิ้นนี้ — ล้ม${r.boss}ให้ดรอป หรือเก็บเศษให้ครบ</div>`;
  else if(o.eq&&r.type==='act')h+=`<div class="rli">สวมอยู่ · กด <b>R</b> (มือถือ: ปุ่มกลมเหนือ "ชุดสกิล") · คูลเหลือ ${Math.ceil(cdLeft(k))} วิ</div>`;
  if(MODE!=='play')h+=`<div class="rltest"><span class="ttnote">🧪 โหมดทดสอบ</span><button class="ttb sm" data-a="t100">เศษ +100</button><button class="ttb sm" data-a="tdrop">ดรอปชิ้นใหม่</button><button class="ttb sm" data-a="tcd">รีเซ็ตคูล R</button><button class="ttb sm" data-a="tst">วนดาว ★1–5</button></div>`;
  return h;}
function buildRelics(){const w=$('#rlw');if(!w||!w.classList.contains('open'))return;const bd=w.querySelector('.ttbd');if(!bd)return;
  const own=ownedMap(),got=KEYS.filter(k=>own[k]).length,live=KEYS.filter(k=>R[k].live).length;
  let grid='';for(const l in LANDS)grid+=`<div class="rlrow"><span class="rll">${LANDS[l].n}<i style="--c:${LANDS[l].c}"></i></span><div class="rlts">${KEYS.filter(k=>R[k].land===l).map(k=>tile(k,own[k])).join('')}</div></div>`;
  bd.innerHTML=`<div class="rlg"><div class="ttp"><div class="rlhd">สมุดวัตถุโบราณ <small>มีแล้ว ${got}/30 · เปิดแล้ว ${live}/30</small></div>${grid}
    <div class="ttnote">ใส่ได้ทีละชิ้นที่ช่องเครื่องประดับ · กรอบทองวนรอบ = เศษที่เก็บได้ · 🔒 = บอสยังไม่ลงแมพ</div></div><div class="ttp">${detail(SEL,own[SEL])}</div></div>`;
  bd.querySelectorAll('.rlt').forEach(b=>b.onclick=()=>{SEL=b.dataset.k;buildRelics();});
  bd.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>act(b.dataset.a));}
function act(a){const k=SEL,r=R[k],T=TIER[r.tier],o=ownedMap()[k];
  if(a==='craft'){if((RS.sh[k]||0)<T.pity||!r.live)return;RS.sh[k]-=T.pity;saveRS();give(k,1,`สร้างจากเศษ ${T.pity}`);}
  else if(a==='dup'||a==='shard'){if(!o)return;const tid=bestOf(o),it=ITEMS[tid],s=it.star||1;if(s>=5)return;
    if(a==='dup'){const fod=o.ids.filter(id=>id!==tid&&INV.includes(id)).sort((x,y)=>(ITEMS[x].star||1)-(ITEMS[y].star||1))[0];if(!fod)return;INV.splice(INV.indexOf(fod),1);delete ITEMS[fod];}
    else{const c=starCost(r,s);if((RS.sh[k]||0)<c)return;RS.sh[k]-=c;saveRS();}
    it.star=s+1;A.save();msg(`⭐ ${r.th} ★${s+1}`);chatLog('sys',`⭐ <b style="color:#b89aff">${r.th}</b> ขึ้น ★${s+1}${r.live&&r.live.cd?` — คูลดาวน์ ${cdOf(r,s+1)} วิ`:''}`);}
  else if(a==='equip'){if(!o)return;const id=o.ids.filter(i=>INV.includes(i)).sort((x,y)=>(ITEMS[y].star||1)-(ITEMS[x].star||1))[0];if(id)equipItem(id);}
  else if(MODE!=='play'){
    if(a==='t100'){RS.sh[k]=(RS.sh[k]||0)+100;saveRS();}
    else if(a==='tdrop'&&r.live){give(k,1,'ทดสอบ');dropFx(null);}
    else if(a==='tcd'){RC[k]=0;}
    else if(a==='tst'&&o){const it=ITEMS[bestOf(o)];it.star=(it.star||1)%5+1;A.save();}}
  try{buildItems();buildEquip();}catch(e){}buildRelics();upd();}

/* ---------------- equipment window: a card under the accessory slot opens the codex ---------------- */
{const _be=buildEquip;buildEquip=function(){_be();const w=document.getElementById('eqw');if(!w||!w.classList.contains('open'))return;const col=w.querySelector('.ro-eq .col.rt');if(!col)return;
  const own=ownedMap(),o=eqRelic(),d=document.createElement('div');d.className='sl rlsl';d.title='สมุดวัตถุโบราณของบอส';
  d.innerHTML=`<div class="ic" style="display:grid;place-items:center;overflow:hidden">${o?relicPic(o.r.key,24):'<span style="font-size:17px;line-height:1">🗿</span>'}</div><div class="nm">🗿 วัตถุโบราณ<small>สะสม ${KEYS.filter(k=>own[k]).length}/30 · แตะเพื่อเปิด</small></div>`;
  d.onclick=()=>openRelics(o?o.r.key:undefined);col.appendChild(d);};}

/* ---------------- test mode: one ★1 Fenrir's Fang put on, once per hero ---------------- */
if(MODE!=='play'&&!(RS.tgH||{})[CHAR]){RS.tgH=RS.tgH||{};RS.tgH[CHAR]=1;RS.got.fenrir=1;saveRS();
  try{const id=makeRelic('fenrir',1);if(EQ.acc1&&ITEMS[EQ.acc1]&&!ITEMS[EQ.acc1].relic)INV.push(EQ.acc1);if(!(EQ.acc1&&ITEMS[EQ.acc1]&&ITEMS[EQ.acc1].relic))EQ.acc1=id;else INV.push(id);
    A.save();applyStats();setTimeout(()=>chatLog('sys','🧪 โหมดทดสอบ: สวม <b style="color:#b89aff">เขี้ยวเฟนเรียร์</b> ให้แล้ว — กด <b>R</b> หลังปล่อยสกิลจนติดคูล · คลิกขวาปุ่ม R = สมุดวัตถุโบราณ'),1500);}catch(e){}}
/* preload Fenrir's howl strip when the fang is worn */
setTimeout(()=>{const o=eqRelic();if(o&&o.r.key==='fenrir')howlImg();},2500);

window.RELIC={R,KEYS,TIER,RS:()=>RS,save:saveRS,bossKill,give,make:makeRelic,use:useRelic,open:openRelics,equipped:eqRelic,cdLeft,isUlt,owned:ownedMap,
  _test:{howl:()=>howlFx(Object.keys(player.cd)),peak:()=>howlPeak({}),drop:dropFx}};
})();
