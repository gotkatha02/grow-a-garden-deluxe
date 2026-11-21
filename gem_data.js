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
/* support gems: [id, Thai name, symbol, colour, effect, English] */
const SUP=[
 ['echo','เงาสกิล','⟲','#9b7bff','0.5 วิหลังใช้ ออกซ้ำ ×0.35 (ท่าบัฟ: +3 วิ)','Echo'],['third','ทุกครั้งที่สาม','③','#ffb13b','ทุกครั้งที่ 3 แรง ×1.5 (ท่าบัฟ: รีเซ็ตคูลดาวน์)','Third'],
 ['force','เพิ่มแรง','✚','#ff6a4a','ทุกฮิต +ATK×0.15 หรือ TAL×0.15 (ท่าบัฟ: +2 วิ)','Force'],['splash','กระจาย','✺','#ff9a3a','ตัวที่โดนแตก ×0.3 รัศมี 70 (ท่าบัฟ: โล่ Lv×3)','Splash'],
 ['chain','ชิ่ง','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.3 (ท่าบัฟ: +2 วิ)','Chain'],['quick','เร่ง','⏱','#7fe08a','คูลดาวน์ −1.5 วิ','Quick'],
 ['thrift','ประหยัด','◆','#4aa8ff','SP −6','Thrift'],['burn','เผาไหม้','♨','#ff5a2a','ทุกฮิตติดไฟ Lv×1/วิ 3 วิ (ท่าบัฟ: ไฟรอบตัว)','Burn'],
 ['frost','เยือกแข็ง','❄','#8fe6ff','ทุกครั้งที่ 3 ช้า −40 · ทุกครั้งที่ 6 แช่แข็ง 0.8 วิ','Frost'],['pierce','ทะลวง','➶','#d8d8e8','ไม่สน DEF 20 (ท่าบัฟ: +2 วิ)','Pierce'],
 ['leech','ดูดชีวิต','♥','#e2435a','ทุกฮิตฟื้น Lv×1 สูงสุด 10 ฮิต (ท่าบัฟ: ฟื้น Lv×3)','Leech'],['impact','กระแทก','✸','#c9a46a','ทุกครั้งที่ 5 มึน 0.5 วิ + หลอด KO (ท่าบัฟ: ผลักรอบตัว)','Impact']];
/* random lines on a main gem: [id, name, group, text(rank) ] — values are flat / counters (rule 2), rank I–V multiplies them */
const R=n=>['I','II','III','IV','V'][n-1]||n;
const LINES=[
 ['lpow','พลังท่า','พลัง',r=>`ทุกฮิต +ATK×${(.03*r).toFixed(2)} (หรือ TAL)`],
 ['lfirst','ฮิตแรก','พลัง',r=>`ฮิตแรกของการใช้ +ATK×${(.15*r).toFixed(2)}`],
 ['lsts','ซ้ำเติม','พลัง',r=>`ศัตรูที่ติดสถานะ (ช้า แช่แข็ง มึน ไหม้ เลือดไหล) ทุกฮิต +ATK×${(.06*r).toFixed(2)}`],
 ['lpier','เจาะเกราะ','พลัง',r=>`ไม่สน DEF ${4*r}`],
 ['lboss','ล่าบอส','พลัง',r=>`ใส่บอส/มอนถึก ทุกฮิต +ATK×${(.06*r).toFixed(2)}`],
 ['lcd','เร่งคูลดาวน์','จังหวะ',r=>`คูลดาวน์ −${(.2*r).toFixed(1)} วิ (ไม่เกิน 1/5 ของเดิม)`],
 ['lsp','ประหยัดแรง','จังหวะ',r=>`SP −${r}`],
 ['lfree','ไม่ติดคูล','จังหวะ',r=>`ใช้ครั้งที่ ${r>=5?4:r>=3?5:6} ทุกรอบ ไม่ติดคูลดาวน์`],
 ['lshd','โล่','เอาตัวรอด',r=>`ใช้แล้วได้โล่ Lv×${(.4*r).toFixed(1)} 5 วิ`],
 ['lheal','ฟื้นตัว','เอาตัวรอด',r=>`ใช้แล้วฟื้น HP Lv×${(.3*r).toFixed(1)}`],
 ['ldr','ตั้งรับ','เอาตัวรอด',r=>`1.5 วิหลังใช้ รับดาเมจ −Lv×${(.1*r).toFixed(1)} ต่อครั้ง`],
 ['lkill','ล่าแต้ม','เอาตัวรอด',r=>`ฆ่าด้วยท่านี้ คืน SP ${2*r}`],
 ['lslow','หน่วง','คุมเกม',r=>`ทุกฮิตที่ 4 ทำให้ช้า ${(1+.3*r).toFixed(1)} วิ`],
 ['ldur','ยืดสถานะ','คุมเกม',r=>`สถานะที่ท่านี้ใส่ นานขึ้น +${(.2*r).toFixed(1)} วิ`],
 ['lpush','ผลัก','คุมเกม',r=>`ฮิตสุดท้ายผลักศัตรูออกไป (แรง ${r}/5 · บอสไม่ขยับ)`],
 ['lnext','คอมโบดาว','เชื่อมแผง',r=>`หลังใช้ ท่าของเจมดาวถัดไป ทุกฮิต +ATK×${(.05*r).toFixed(2)} นาน 5 วิ`],
 ['lelem','ดาวพี่น้อง','เชื่อมแผง',r=>`ดาวข้างกันใส่แปรสภาพชนิดเดียวกับเจมนี้ ต่อดวง ทุกฮิต +ATK×${(.03*r).toFixed(2)}`],
 ['lall','ครบกลุ่มดาว','เชื่อมแผง',r=>`ใช้ท่าของเจมครบทุกดาวที่ใส่ไว้ภายใน 20 วิ → โล่ Lv×${r} (ทุก 20 วิ)`]];
const QUAL=[{n:'ธรรมดา',c:'#cfd6e0',lines:1,p:.70},{n:'หายาก',c:'#5ab4ff',lines:2,p:.25},{n:'ตำนาน',c:'#ffc83a',lines:3,p:.05}];
const RANK_P=[.55,.30,.15];                    // a new line starts at rank I / II / III
const GEM_CAP=50;                              // owner 2026-11-21: gem level cap 50 for now, raised with later updates
const BREAK={10:1,20:1,30:2,40:2};             // spare copies of the same gem needed to pass Lv 10 / 20 / 30 / 40
const COST={
  carveStones:3,carveZ:t=>1000*t*t,            // carve: 3 raw stones of tier t → random main gem of that tier
  craftFrag:40,craftZ:t=>2000*t*t,             // craft the gem you choose: 40 shards of its tier
  dismFrag:5,dismEss:3,                        // dismantle one spare copy → 5 shards + 3 essence
  lvEss:lv=>Math.round(6+2.4*lv),lvZ:lv=>400*lv,   // level lv → lv+1 (1 → 50 = 3,234 essence + 490,000z per gem)
  rankEss:[6,12,24,48],rankZ:r=>3000*r,        // rank I→II … IV→V
  rerollEss:8,lockEss:12,rerollZ:5000,
  pity:20};                                    // 20 carvings in a row without a legend → the next one is legend
/* power of the target skill from gem level: +3 % per level up to Lv 5 (unchanged), then +0.4 % per level → Lv 50 = +30 % */
const gemPow=lv=>.03*(Math.min(lv,5)-1)+.004*Math.max(0,lv-5);
/* drops (items.js dropFor): stone tier = ore tier of the monster's level band */
const DROPS={stoneField:.002,stoneDun:.005,ess:.015,essN:[1,3],soreLv:70,soreField:.0005,soreDun:.0015,mutDun:.0003,mutField:.0001,supDun:.0006,supField:.00015,
  boss:{stones:3,ess:10,sore:2,sup:1,mutChance:.3}};
window.GEMDATA={MUT,SUP,LINES,QUAL,RANK_P,GEM_CAP,BREAK,COST,gemPow,DROPS,R,
  MUTD:Object.fromEntries(MUT.map(s=>[s[0],s])),SUPD:Object.fromEntries(SUP.map(s=>[s[0],s])),LND:Object.fromEntries(LINES.map(s=>[s[0],s]))};
})();
