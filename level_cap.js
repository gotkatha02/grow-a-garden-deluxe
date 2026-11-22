/* =====================================================================
   LEVEL CAP 60 (owner 2026-11-22: 'ตัดที่60ก่อนตอนเปิดเกม ปรับเลเวลมอนที่มีตอนนี้ให้ตันแค่60ด้วย').
   The game opens with a Lv 60 cap (later updates raise it). Everything that exists was designed on a Lv 1–99 scale;
   this file holds the one conversion. The files that own the numbers apply it once, at load:
   • WORLD levels (where you are in the world): monster levels, map bands, warp signs, bosses, item / material / relic
     levels → LVC.n(v): 1–99 spread evenly over 1–60 (×0.6 — Lv 90–99 endgame dungeons → 55–60). maps/level-zones.js,
     boss_fenrir.js, relics.js, items.js. LVC.o(L) = the design level behind a new level (a float): the item system reads
     material grades / ore tiers through it, so a monster still drops what it dropped before. LVC.nc(v) = the first new
     level whose design level is ≥ v (item level requirements: grade 1 = Lv 7 … grade 9 = Lv 55).
   • CHARACTER gates that were above the cap (totem pole tiers Lv 60–99, C-gem tiers, the old C-tier levels): LVC.g(v)
     keeps 1–50 as it is and squeezes 50–99 into 50–60, so the order of unlocks stays the same: skill tree complete by
     Lv 50 → skill holes Lv 10–50 → pole tiers Lv 52 / 54 / 56 / 58 / 60. LVC.gi(L) = the other way.
   • The character's own per-level rules do NOT change: 2 status points per level, level growth, 1 skill point per level
     (49 at Lv 50), skill rows, skill holes. EXP keeps its old curve shape (~21 kills at Lv 1 → ~100 for the last level)
     through LVC.o in killExp (index.html).
   • Test mode is a Lv 60 hero now (presetAt scales the stat presets). The balance bench still measures the old Lv 99
     reference (tools/balance_bench.js: window.__BENCH_LV, default 99) so the 2,450 target keeps its meaning.
   Raising the cap later: change CAP only together with new content above it (the current content would otherwise spread
   over the new range) — easiest is to bake today's converted numbers first.
   ===================================================================== */
(function(){
const CAP=60,OLD=99,K=(CAP-1)/(OLD-1);
const n=v=>v<=1?1:Math.min(CAP,Math.max(1,Math.round(1+(v-1)*K)));                 // design level → new level (nearest)
const nc=v=>v<=1?1:Math.min(CAP,Math.max(1,Math.ceil(1+(v-1)*K-1e-9)));             // design level → first new level at or past it
const o=L=>1+(Math.max(1,L)-1)/K;                                                       // new level → design level (float)
const g=v=>v<=50?v:Math.min(CAP,Math.round(50+(v-50)*(CAP-50)/(OLD-50)));             // character gate: 1–50 kept, 50–99 → 50–60
const gi=L=>L<=50?L:50+(L-50)*(OLD-50)/(CAP-50);
window.LVC={CAP,OLD,n,nc,o,g,gi};window.LV_CAP=CAP;
})();
