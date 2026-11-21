# tools/fx — effect checks (2026-11-21, made for the axolotl pass, work for any hero)

Serve the repo first: `python3 -m http.server 8765` in the repo folder. Pictures go to `$OUT` (default `/tmp/fx`). `HERO=<hero>` picks the hero (default axolotl).

| script | what it does |
|---|---|
| `harness.py` | the Game class: stubs requestAnimationFrame before load (frames are stepped by hand, exact times), pre-seeds test mode (the test room never reloads), hides the test bar |
| `strip.py TAG key1,key2 [every=3 n=24 cols=8 scale=.6 w=520 h=300 dx=75 dy=-20 skip=0 mode=one\|room extra=&vfx3=0]` | frame strips per skill, labelled with the time since the key press and **HIT** when damage landed (`basic` = the normal attack) |
| `custom.py TAG "<js run at t0>" [pre="<js>" …]` | the same strip after any JS (e.g. `cocoonStart();`, a membrane hit) |
| `timing.py [keys] [mode=one]` | real seconds of every skill: cast bar end, release frame, every hit, action end → `$OUT/timing_<mode>.json` |
| `bench_hero.py RUNS [extra …]` | whole-kit bench in the empty arena; pass `''` and `'&vfx3=0'` to prove an effect pass does not change damage |
| `axclip.py basic\|a\|b\|c` | axolotl showcase mp4 per tree with Thai labels (needs ffmpeg) |
