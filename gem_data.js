/* =====================================================================
   GEM DATA — shared by items.js (bag goods, drops), market.js (trade) and totem_gems.js (board, carving, combat).
   Owner 2026-11-21 (answers to GEAR_GEM_LONGTERM_TH.md): gem TYPE is random when a stone is carved; the gem you want
   comes from the central market (stones, shards, essence, mutation / support gems are all tradable goods) or from
   shards (dismantle spare gems → shards → craft the gem you choose). Gem level cap 50 for now, raised with updates.
   Design + numbers: GEAR_GEM_LONGTERM_TH.md (section "เคาะแล้ว") · TOTEM_GEM_SYSTEM_TH.md section 6.
   ===================================================================== */
(function(){
/* mutation gems: [id, Thai name, symbol, colour, gain, cost, English] — one way gained, another way paid */
const MUT=[
 ['focus','รวมศูนย์','◎','#ffd23a','ศัตรูตัวแรกที่โดน ×1.6','ตัวอื่นที่โดน ×0.4','Focus'],
 ['spread','แผ่กว้าง','✺','#ff9a3a','ทุกตัวที่โดน แตกดาเมจ ×0.35 รัศมี 80','พลังหลัก ×0.75','Spread'],
 ['heavy','ทุ่มหนัก','⬇','#c9573a','พลัง ×1.5','คูลดาวน์ +4 วิ · SP +10','Heavy'],
 ['rapid','รัวเร็ว','≫','#7fe08a','คูลดาวน์ ×0.6','พลัง ×0.65','Rapid'],
 ['stack','สะสมแต้ม','⧉','#9fd8ff','เก็บได้ 2 ครั้ง','พลังครั้งละ ×0.8 · เติมคืนช้ากว่าเดิม','Stack'],
 ['fire','ธาตุไฟ','♨','#ff5a2a','ติดไหม้ต่อเนื่อง 4 วิ (สีไฟ)','ดาเมจทันที ×0.7','Fire'],
 ['ice','ธาตุน้ำแข็ง','❄','#8fe6ff','ทุกฮิตช้า −40 · ทุกครั้งที่ 4 แช่แข็ง 0.6 วิ','พลัง ×0.8','Ice'],
 ['volt','ธาตุสายฟ้า','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.4','พลัง ×0.8','Volt'],
 ['guard','ตั้งการ์ด','⛨','#c9ccd8','โล่ Lv×4 · รับดาเมจ −Lv×0.5 ต่อครั้ง 3 วิ','พลัง ×0.8','Guard'],
 ['rage','บ้าคลั่ง','✶','#e2435a','พลัง ×1.3','3 วิหลังใช้ รับดาเมจ +Lv×0.6 ต่อครั้ง','Rage'],
 ['siphon','ดูดพลัง','◆','#4aa8ff','ทุกฮิตคืน SP 2 (สูงสุด 12 ต่อการใช้)','พลัง ×0.85','Siphon'],
 ['totem','เสาร่ายแทน','♆','#d9a441','ปักเสาร่ายสกิลทุก 2 วิ × 4 ครั้ง พลัง ×0.45','ระหว่างเสาอยู่ใช้สกิลนั้นเองไม่ได้','Totem']];
/* resonance + balance (owner 2026-11-21 'โอเค' to GEAR_GEM_LONGTERM_TH.md §3.6, TOTEM_GEM_SYSTEM_TH.md §1f):
   • RESONANCE — two mutation gems of the same kind working on the totem (any holes: pole wings or skill holes; the board's cap is 2 per kind)
     = that kind's GAIN one step stronger on both skills: g = the gain text that replaces MUT[4].
   • BALANCE — no kind twice and at least BAL_N different kinds working = every mutation's COST one step softer: c replaces MUT[5].
   A totem leans one way or the other (one pair already breaks the balance). The numbers live in totem_gems.js RV (same order). */
const RESO={
 focus: {g:'ศัตรูตัวแรกที่โดน ×1.75',c:'ตัวอื่นที่โดน ×0.55'},
 spread:{g:'ทุกตัวที่โดน แตกดาเมจ ×0.45 รัศมี 80',c:'พลังหลัก ×0.82'},
 heavy: {g:'พลัง ×1.65',c:'คูลดาวน์ +3 วิ · SP +7'},
 rapid: {g:'คูลดาวน์ ×0.55',c:'พลัง ×0.72'},
 stack: {g:'เก็บได้ 3 ครั้ง',c:'พลังครั้งละ ×0.85 · เติมคืนช้ากว่าเดิมน้อยลง'},
 fire:  {g:'ติดไหม้ต่อเนื่อง 5 วิ (สีไฟ)',c:'ดาเมจทันที ×0.77'},
 ice:   {g:'ทุกฮิตช้า −40 · ทุกครั้งที่ 4 แช่แข็ง 0.8 วิ',c:'พลัง ×0.86'},
 volt:  {g:'ฮิตสุดท้ายชิ่ง 3 ตัว ×0.4',c:'พลัง ×0.86'},
 guard: {g:'โล่ Lv×6 · รับดาเมจ −Lv×0.5 ต่อครั้ง 3 วิ',c:'พลัง ×0.86'},
 rage:  {g:'พลัง ×1.4',c:'3 วิหลังใช้ รับดาเมจ +Lv×0.4 ต่อครั้ง'},
 siphon:{g:'ทุกฮิตคืน SP 3 (สูงสุด 18 ต่อการใช้)',c:'พลัง ×0.9'},
 totem: {g:'ปักเสาร่ายสกิลทุก 2 วิ × 4 ครั้ง พลัง ×0.55',c:'ใช้สกิลนั้นเองได้อีกตั้งแต่เสาร่ายครั้งที่ 3'}};
const BAL_N=5;
/* support gems: [id, Thai name, symbol, colour, effect, English] */
const SUP=[
 ['echo','เงาสกิล','⟲','#9b7bff','0.5 วิหลังใช้ ออกซ้ำ ×0.35 (ท่าบัฟ: +3 วิ)','Echo'],['third','ทุกครั้งที่สาม','③','#ffb13b','ทุกครั้งที่ 3 แรง ×1.5 (ท่าบัฟ: รีเซ็ตคูลดาวน์)','Third'],
 ['force','เพิ่มแรง','✚','#ff6a4a','ทุกฮิต +ATK×0.15 หรือ MATK×0.15 (ท่าบัฟ: +2 วิ)','Force'],['splash','กระจาย','✺','#ff9a3a','ตัวที่โดนแตก ×0.3 รัศมี 70 (ท่าบัฟ: โล่ Lv×3)','Splash'],
 ['chain','ชิ่ง','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.3 (ท่าบัฟ: +2 วิ)','Chain'],['quick','เร่ง','⏱','#7fe08a','คูลดาวน์ −1.5 วิ','Quick'],
 ['thrift','ประหยัด','◆','#4aa8ff','SP −6','Thrift'],['burn','เผาไหม้','♨','#ff5a2a','ทุกฮิตติดไฟ Lv×1/วิ 3 วิ (ท่าบัฟ: ไฟรอบตัว)','Burn'],
 ['frost','เยือกแข็ง','❄','#8fe6ff','ทุกครั้งที่ 3 ช้า −40 · ทุกครั้งที่ 6 แช่แข็ง 0.8 วิ','Frost'],['pierce','ทะลวง','➶','#d8d8e8','ไม่สน DEF 20 (ท่าบัฟ: +2 วิ)','Pierce'],
 ['leech','ดูดชีวิต','♥','#e2435a','ทุกฮิตฟื้น Lv×1 สูงสุด 10 ฮิต (ท่าบัฟ: ฟื้น Lv×3)','Leech'],['impact','กระแทก','✸','#c9a46a','ทุกครั้งที่ 5 มึน 0.5 วิ + หลอด KO (ท่าบัฟ: ผลักรอบตัว)','Impact']];
/* random lines ("special stats", owner 2026-11-21: 'random stats / statuses, tiers whose gem light changes colour by rarity, special-stat slots,
   all random; a higher gem level adds 1 slot and the rolled numbers grow') on C gems AND skill gems: [id, name, group, text(v)].
   v = the line's strength = rank (I–V) × rarity multiplier × level multiplier (lineV below), so the text always shows the real number.
   Values stay flat / counters (rule 2). Stat lines add flat character stats while the gem is active on the totem (kept small: rank V
   legend Lv 50 = +5). The board-link group only rolls on C gems (it reads the pole). */
const R=n=>['I','II','III','IV','V'][n-1]||n;
const f2=x=>(+x).toFixed(2),f1=x=>(+x).toFixed(1),ri=x=>Math.max(1,Math.round(x));
const statN=v=>Math.max(1,Math.round(.5*v));
const LINES=[
 ['lpow','พลังท่า','พลัง',v=>`ทุกฮิต +ATK×${f2(.03*v)} (หรือ MATK)`],
 ['lfirst','ฮิตแรก','พลัง',v=>`ฮิตแรกของการใช้ +ATK×${f2(.15*v)}`],
 ['lsts','ซ้ำเติม','พลัง',v=>`ศัตรูที่ติดสถานะ (ช้า แช่แข็ง มึน ไหม้ เลือดไหล) ทุกฮิต +ATK×${f2(.06*v)}`],
 ['lpier','เจาะเกราะ','พลัง',v=>`ไม่สน DEF ${ri(4*v)}`],
 ['lboss','ล่าบอส','พลัง',v=>`ใส่บอส/มอนถึก ทุกฮิต +ATK×${f2(.06*v)}`],
 ['lcd','เร่งคูลดาวน์','จังหวะ',v=>`คูลดาวน์ −${f1(.2*v)} วิ (ไม่เกิน 1/5 ของเดิม)`],
 ['lsp','ประหยัดแรง','จังหวะ',v=>`SP −${ri(v)}`],
 ['lfree','ไม่ติดคูล','จังหวะ',v=>`ใช้ครั้งที่ ${v>=5?4:v>=3?5:6} ทุกรอบ ไม่ติดคูลดาวน์`],
 ['lshd','โล่','เอาตัวรอด',v=>`ใช้แล้วได้โล่ Lv×${f1(.4*v)} 5 วิ`],
 ['lheal','ฟื้นตัว','เอาตัวรอด',v=>`ใช้แล้วฟื้น HP Lv×${f1(.3*v)}`],
 ['ldr','ตั้งรับ','เอาตัวรอด',v=>`1.5 วิหลังใช้ รับดาเมจ −Lv×${f1(.1*v)} ต่อครั้ง`],
 ['lkill','ล่าแต้ม','เอาตัวรอด',v=>`ฆ่าด้วยท่านี้ คืน SP ${ri(2*v)}`],
 ['lslow','หน่วง','คุมเกม',v=>`ทุกฮิตที่ 4 ทำให้ช้า ${f1(1+.3*v)} วิ`],
 ['ldur','ยืดสถานะ','คุมเกม',v=>`สถานะที่ท่านี้ใส่ นานขึ้น +${f1(.2*v)} วิ`],
 ['lpush','ผลัก','คุมเกม',v=>`ฮิตสุดท้ายผลักศัตรูออกไป (แรง ${Math.min(5,ri(v))}/5 · บอสไม่ขยับ)`],
 ['satk','STR','สเตตัส',v=>`STR +${statN(v)}`],
 ['stal','INT','สเตตัส',v=>`INT +${statN(v)}`],
 ['sdef','DEF','สเตตัส',v=>`DEF +${statN(v)}`],
 ['sagi','AGI','สเตตัส',v=>`AGI +${statN(v)}`],
 ['svit','VIT','สเตตัส',v=>`VIT +${statN(v)}`],
 ['sint','DEX','สเตตัส',v=>`DEX +${statN(v)}`],
 ['scha','HIT','สเตตัส',v=>`HIT +${statN(v)*2}`],
 ['slck','LUK','สเตตัส',v=>`LUK +${statN(v)}`],
 ['lnext','คอมโบดาว','เชื่อมแผง',v=>`หลังใช้ ท่าของเจมชั้นถัดไป ทุกฮิต +ATK×${f2(.05*v)} นาน 5 วิ`],
 ['lelem','ดาวพี่น้อง','เชื่อมแผง',v=>`ชั้นข้างกันใส่แปรสภาพชนิดเดียวกับเจมนี้ ต่อชั้น ทุกฮิต +ATK×${f2(.03*v)}`],
 ['lall','ครบกลุ่มดาว','เชื่อมแผง',v=>`ใช้ท่าของเจม C ครบทุกชั้นที่ใส่ไว้ภายใน 20 วิ → โล่ Lv×${f1(v)} (ทุก 20 วิ)`]];
const SLINE={satk:'str',stal:'int',sdef:'def',sagi:'agi',svit:'vit',sint:'dex',scha:'hit',slck:'luk'};   // stat line → stat key (index.html BON) · RO stats 2026-11-22: line ids kept so saved gems keep their lines (ATK→STR, TAL→INT, INT→DEX, CHA→HIT ×2, LCK→LUK)
const SLINE_MUL={hit:2};
const POOL={c:LINES.map(l=>l[0]),s:LINES.filter(l=>l[2]!=='เชื่อมแผง').map(l=>l[0])};   // C gems roll every line, skill gems no board-link lines
/* rarity (5 tiers, owner 2026-11-21): rolled when a gem is made (carve / craft / extract / re-extract). c / g = colour of the gem's light (hex / rgb),
   lines = special-stat slots it starts with, p = chance, m = multiplier on every line's number, rk = chance of the starting rank I…V of a new line.
   Old saves: quality 0 / 1 / 2 → ธรรมดา / หายาก / ตำนาน (same 1 / 2 / 3 lines). */
const QUAL=[
 {n:'ธรรมดา', c:'#d9dee8',g:'217,222,232',lines:1,p:.50,m:1.00,rk:[.70,.30,0,0,0]},
 {n:'ดี',      c:'#72e07a',g:'114,224,122',lines:1,p:.30,m:1.08,rk:[.45,.40,.15,0,0]},
 {n:'หายาก',   c:'#4ab0ff',g:'74,176,255', lines:2,p:.14,m:1.16,rk:[.30,.45,.25,0,0]},
 {n:'มหากาพย์', c:'#c17bff',g:'193,123,255',lines:2,p:.05,m:1.28,rk:[0,.40,.45,.15,0]},
 {n:'ตำนาน',   c:'#ffb938',g:'255,185,56', lines:3,p:.01,m:1.40,rk:[0,0,.50,.35,.15]}];
const RANK_P=[.55,.30,.15];                    // (old: a new line started at rank I / II / III — now per rarity in QUAL[].rk)
const SLOT_LV=[10,20,30,40];                   // the gem's level opens one more special-stat slot at each (a new line is rolled at once)
const lvMul=lv=>1+(Math.max(1,lv||1)-1)/98;    // numbers grow with the gem's level: Lv 1 ×1 … Lv 50 ×1.5
const nSlots=(q,lv)=>QUAL[q||0].lines+SLOT_LV.filter(x=>(lv||1)>=x).length;   // ธรรมดา Lv 1 = 1 slot … ตำนาน Lv 40+ = 7
const lineV=(r,q,lv)=>r*QUAL[q||0].m*lvMul(lv);
const GEM_CAP=50;                              // owner 2026-11-21: gem level cap 50 for now, raised with later updates
const BREAK={10:1,20:1,30:2,40:2};             // spare copies of the same gem needed to pass Lv 10 / 20 / 30 / 40
const COST={
  carveStones:3,carveZ:t=>1000*t*t,            // carve: 3 raw stones of tier t → random main gem of that tier
  craftFrag:40,craftZ:t=>2000*t*t,             // craft the gem you choose: 40 shards of its tier
  dismFrag:5,dismEss:3,                        // dismantle one spare copy → 5 shards + 3 essence
  lvEss:lv=>Math.round(6+2.4*lv),lvZ:lv=>400*lv,   // level lv → lv+1 (1 → 50 = 3,234 essence + 490,000z per gem)
  rankEss:[6,12,24,48],rankZ:r=>3000*r,        // rank I→II … IV→V
  rerollEss:8,lockEss:12,rerollZ:5000,
  pityE:20,pity:50};                           // 20 rolls in a row without มหากาพย์ or better → the next is มหากาพย์ · 50 without ตำนาน → ตำนาน
                                               // (one counter per hero for every roll: carving, crafting, extracting, re-extracting)
/* power of the target skill from gem level: +3 % per level up to Lv 5 (unchanged), then +0.4 % per level → Lv 50 = +30 % */
const gemPow=lv=>.03*(Math.min(lv,5)-1)+.004*Math.max(0,lv-5);
/* drops (items.js dropFor): stone tier = ore tier of the monster's level band. soreLv is a DESIGN level: dropFor compares the monster's
   design level (LVC.o, level cap 60) → Star Ore from monsters Lv 43+ */
const DROPS={stoneField:.002,stoneDun:.005,ess:.015,essN:[1,3],soreLv:70,soreField:.0005,soreDun:.0015,mutDun:.0003,mutField:.0001,supDun:.0006,supField:.00015,
  boss:{stones:3,ess:10,sore:2,sup:1,mutChance:.3}};
/* carving the totem's holes open (owner 2026-11-21: 'turn in goods to unlock each hole, not very easy; only the first skill hole is free
   so players can try it'). Every hole of the totem starts sealed by a plug; tap it on the board → the goods below → ⛏ สลักเปิด.
   ids: s<i> skill hole i on the stone base (opens with its gold mutation hole) · u<i><j> its 2 teal support holes ·
        p<i> pole tier i (opens with its inner mutation hole) · q<i><j> the tier's 2 outer support holes (j 1 / 2).
        The tier's 2nd mutation hole is not carved: it still opens when that tier's C gem reaches the level cap.
   Level = the hole's own level (skill holes SS_LV 10–50; pole tiers Lv 52/54/56/58/60 since the Lv 60 cap — designed as 60/70/80/90/99);
   a small hole needs its big hole carved first.
   Goods: 'ma' / 'mb' = common / rare monster material of the hole's DESIGN level band (grade = design Lv ÷ 10: base 1–5, pole 6/7/8/9/9 —
   unchanged by the level cap; those grades now drop from monsters Lv 7–36 / 37–60, see level_cap.js): the base takes any land's,
   a pole tier and its support holes take that tier's land (bottom → top: Norse · Greek · Egypt · Japan · Aztec).
   Totals (all 29 carvings): 1,018 essence · 4.0 M zeny · ~49 h of farming — `python3 tools/longterm_sim.py carve` prints each hole
   (keep its table in step with this one). */
const CARVE={land:['vik','grk','egy','jpn','azt'],
  s:[null,                                                                          // skill hole 1: free
     {z:8000,  it:[['ma',30],['mb',6],['tstone1',2],['tess',8]]},
     {z:25000, it:[['ma',45],['mb',10],['tstone2',2],['tess',15]]},
     {z:50000, it:[['ma',60],['mb',14],['tstone2',3],['tess',24]]},
     {z:90000, it:[['ma',80],['mb',18],['tstone2',4],['tess',35]]}],
  u:[{z:2000,  it:[['ma',15],['mb',3],['tess',3]]},                              // each teal hole of skill hole 1 … 5
     {z:5000,  it:[['ma',20],['mb',5],['tess',5]]},
     {z:12000, it:[['ma',30],['mb',7],['tstone2',1],['tess',8]]},
     {z:25000, it:[['ma',40],['mb',9],['tstone2',1],['tess',12]]},
     {z:45000, it:[['ma',50],['mb',12],['tstone2',2],['tess',16]]}],
  p:[{z:150000,it:[['ma',100],['mb',25],['tstone3',3],['tess',50]]},              // pole tier 1 … 5 (bear · owl · wolf · eagle · thunderbird)
     {z:250000,it:[['ma',120],['mb',30],['tstone3',4],['tess',70],['sore',1]]},
     {z:400000,it:[['ma',140],['mb',35],['tstone3',5],['tess',90],['sore',2]]},
     {z:600000,it:[['ma',160],['mb',40],['tstone4',3],['tess',120],['sore',3]]},
     {z:900000,it:[['ma',180],['mb',45],['tstone4',5],['tess',150],['sore',4]]}],
  q:[{z:50000, it:[['ma',40],['mb',10],['tfrag3',8],['tess',20]]},               // each outer support hole of tier 1 … 5
     {z:80000, it:[['ma',50],['mb',12],['tfrag3',12],['tess',28]]},
     {z:120000,it:[['ma',60],['mb',15],['tfrag3',16],['tess',36],['sore',1]]},
     {z:180000,it:[['ma',70],['mb',18],['tfrag4',10],['tess',45],['sore',1]]},
     {z:250000,it:[['ma',80],['mb',20],['tfrag4',14],['tess',55],['sore',2]]}]};
/* extracting a skill into a skill gem (owner 2026-11-21: 'every skill must be extracted into a gem before it goes on the base, so it
   is not too easy'). A learned Basic / A / B skill is distilled once into a gem (a raw totem stone is the vessel); the gem then goes into
   any open skill hole and can be taken out / moved freely. Band = the character level that skill's first level needs (SKREQ).
   The first extraction is free, so the free first skill hole is still a free try. */
const EXTRACT=[ // [skill learnable up to this level, cost]
  [9,  {z:1500, it:[['tstone1',1],['tess',3]]}],
  [19, {z:4000, it:[['tstone1',1],['tess',6]]}],
  [29, {z:9000, it:[['tstone1',2],['tess',10]]}],
  [39, {z:16000,it:[['tstone2',1],['tess',14]]}],
  [999,{z:28000,it:[['tstone2',2],['tess',20]]}]];
/* skill gems level like C gems (owner 2026-11-21) but cost half (they have no skill-power bonus, only their special stats);
   the breakthroughs at Lv 10 / 20 / 30 / 40 take raw totem stones (+ star ore) instead of spare copies (a skill gem has no copies).
   Re-extracting (สกัดใหม่) costs the extraction price again, rolls a new rarity + lines (level kept) and the player keeps either one. */
const SGEM={lvEss:lv=>Math.round(3+1.2*lv),lvZ:lv=>200*lv,
  brk:{10:[['tstone1',2]],20:[['tstone2',2]],30:[['tstone3',2],['sore',1]],40:[['tstone4',2],['sore',2]]}};
window.GEMDATA={MUT,SUP,RESO,BAL_N,LINES,QUAL,RANK_P,GEM_CAP,BREAK,COST,gemPow,DROPS,R,CARVE,EXTRACT,SGEM,SLINE,SLINE_MUL,POOL,SLOT_LV,lvMul,nSlots,lineV,statN,
  MUTD:Object.fromEntries(MUT.map(s=>[s[0],s])),SUPD:Object.fromEntries(SUP.map(s=>[s[0],s])),LND:Object.fromEntries(LINES.map(s=>[s[0],s]))};
})();
