# tools/qa — bug sweeps (2026-11-21). Serve the repo on 8765 first.

| script | what it checks |
|---|---|
| `herosweep.py hero…` | test room: every skill cast once (direct cast), script errors, missing files, NaN |
| `combo.py hero…` | the REAL input path: basic attack, every hot-bar skill through `useSkill`, every combo follow-up through its parent's key |
| `nohit.py hero k1,k2 …` · `one.py hero key` | skills that looked like they did nothing: watch the dummy's health / trace one cast |
| `ranges.py hero…` | melee / ground skills without a usable `range` (a melee skill with a target walks up first — it needs `range`) |
| `leak.py hero` | effect objects that pile up cast after cast |
| `lostev.py hero…` | action events timed after the action ends (the engine drops them: the skill silently loses hits / its finisher) |
| `ui.py hero map` | menu buttons, shortcut keys, item / market / craft windows and every tab |
| `data.py` · `mons.py` | warps lead to existing maps and back · every map monster has a sprite and its files exist |
| `play1.py` · `mob.py` | first-time player in play mode (create hero → field → fight) · phone touch controls + save / reload |
| `bench_branch.py` | per-branch bench for kitsune / bastet / anubis |
