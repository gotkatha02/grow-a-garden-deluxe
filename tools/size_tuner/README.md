# Hero size tuner

Owner 2026-11-25 'ขอปรับขนาดแต่ละตัวเอง'. A claude.ai artifact page where the owner sets each hero's size himself:
**ปรับขนาดฮีโร่** — https://claude.ai/artifact/Ccvn98WVfJ9RgA29sHGjBJ (slug `5e18b302-283d-4755-a294-77deab6f2855`, private to the owner).

- All 17 heroes stand in one row on a real in-game ground strip (grass grkF1 · snow vikF2 · sand egyF1 · capital capT; since 2026-11-25 no map draws characters bigger, the capital's old `charK` 1.35 is gone), idle animation from their own atlases, front (S) or 3/4 (SE) view, 4 zoom steps (1.1 = phone size in game), sort by land or height.
- One slider per hero, 0.30–1.40. **The value is the hero's height relative to the standard** (the old wolf idle = 72.5 world px, the height every hero was tuned to before 2026-11-25). Gold dashed line = the chosen hero's head, white dashed line = standard 1.00, green dashed line = the capital guild hall's door (65.7 world px from its top step to the arch = 0.906): a hero whose head stays under it walks through the door (owner 2026-11-25 'ให้ตัวที่ใหญ่ที่สุดยังขนาดพอสามารถเข้าประตูได้').
- Kitsune, lion, croc, anubis have no sprite yet → their design picture (select.webp / anubis view_S, view_SE) scaled to the standard height. The raven is the old wolf body with its in-game filter.
- The page saves its values by itself into its own database: document `sizes/current` = `{v:{wolf:1.4, …}, at, src:'size-tuner'}` (also a localStorage copy, and a 'copy numbers' button). Read it with the artifact tools: `db_get(slug, 'sizes/current')`.

## Putting the owner's values into the game

`index.html` `HERO_SIZE` = the tuner value for every hero (the wolf through his atlas boxes, every other hero × its `CHAR_SCALE`); every `CHAR_SCALE` base draws the standard height (hippo re-based 1.39 → 1.57 on 2026-11-25), so the value goes in as it is. `export.py` reads `HERO_SIZE` as the page's 'in game now' values. Placeholder heroes get their value in `HERO_SIZE` too: it carries over to their real sprite once `CHAR_SCALE` is re-measured to the standard height. Check the result with `/home/claude/work/doors/py/heights.py`-style probes: drawn idle height = (pivot.y − box top) × SPR × CHAR_SCALE.

History: owner 11:35 values (wolf 1.25 · rhino 1.4 · owl 1 · raven 1 · jaguar 1.15 · axolotl .9 · croc 1.4 · cat 1.19 · dragon 1.2 · wukong 1 · kitsune 1.38 · hippo .85 · bastet 1.15 · anubis 1.3 · sheep .95 · lion 1.2 · drake 1.1) × .63 at 11:45 so the biggest (rhino / croc .882) fits the guild door; written back into the page's `sizes/current` (src 'game-2026-11-25-door-fit').

## Rebuilding (new hero sprites, new backgrounds)

Work in a scratch folder (WORK, e.g. `/tmp/size_tuner`); the game must be served on `localhost:8765` for captures.

1. Heroes: edit the `HEROES` table in `export.py` (atlas file, prefix, base `CHAR_SCALE`; `('pic', path, pathSE)` for a design picture), then `python3 -I tools/size_tuner/export.py WORK` → `WORK/pub/h/<hero>_<S|SE>.webp` (12 idle frames, 3.2 px per world px, feet at fx, fy) + `WORK/heroes.json`.
2. Backgrounds (only if they change): `python3 tools/size_tuner/bg.py vikF2 WORK/bg/vikF2 n=2` (also grkF1, egyF1; the capital: `bg.py capT WORK/bg/capTc 'at=2400,2620;2400,2340;3050,2620'`), look at the PNGs, set `PICK` in `bgcut.py`, then `python3 -I tools/size_tuner/bgcut.py WORK`.
3. `python3 -I tools/size_tuner/build.py WORK` → `WORK/pub/index.html`.
4. Republish: `get_artifact` → `list_files` → `publish_files` (slug, base_version, every file under `WORK/pub` with `as` = its relative path). The page declares `{db:{}}`; the saved values stay.
