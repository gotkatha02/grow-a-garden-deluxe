# Hero size tuner

Owner 2026-11-25 'ขอปรับขนาดแต่ละตัวเอง'. A claude.ai artifact page where the owner sets each hero's size himself:
**ปรับขนาดฮีโร่** — https://claude.ai/artifact/Ccvn98WVfJ9RgA29sHGjBJ (slug `5e18b302-283d-4755-a294-77deab6f2855`, private to the owner).

- All 17 heroes stand in one row on a real in-game ground strip (grass grkF1 · snow vikF2 · sand egyF1 · capital capT, where the game draws characters ×1.35 = `charK`), idle animation from their own atlases, front (S) or 3/4 (SE) view, 4 zoom steps (1.1 = phone size in game), sort by land or height.
- One slider per hero, 0.60–1.80. **The value is the hero's height relative to the standard** (the old wolf idle = 72.5 world px, the height every hero was tuned to before 2026-11-25). Gold dashed line = the chosen hero's head, white dashed line = standard 1.00.
- Kitsune, lion, croc, anubis have no sprite yet → their design picture (select.webp / anubis view_S, view_SE) scaled to the standard height. The raven is the old wolf body with its in-game filter.
- The page saves its values by itself into its own database: document `sizes/current` = `{v:{wolf:1.4, …}, at, src:'size-tuner'}` (also a localStorage copy, and a 'copy numbers' button). Read it with the artifact tools: `db_get(slug, 'sizes/current')`.

## Putting the owner's values into the game

`index.html` `HERO_SIZE` = the value for every hero (the wolf through his atlas boxes, every other hero × its `CHAR_SCALE`), **except the hippo**: its base `CHAR_SCALE` 1.39 draws it at 0.89 of the standard (its clip atlas is shorter), so the tuner treats it as re-based to 1.57 (its 'now' 0.80 = 1.39 × .9 / 1.57). When applying, set `CHAR_SCALE.hippo` 1.57 and `HERO_SIZE.hippo` = the tuner value. Other heroes' bases are within ±1.5 % of the standard. Placeholder heroes get their value in `HERO_SIZE` too: it carries over to their real sprite once `CHAR_SCALE` is re-measured to the standard height.

## Rebuilding (new hero sprites, new backgrounds)

Work in a scratch folder (WORK, e.g. `/tmp/size_tuner`); the game must be served on `localhost:8765` for captures.

1. Heroes: edit the `HEROES` table in `export.py` (atlas file, prefix, base `CHAR_SCALE`; `('pic', path, pathSE)` for a design picture), then `python3 -I tools/size_tuner/export.py WORK` → `WORK/pub/h/<hero>_<S|SE>.webp` (12 idle frames, 3.2 px per world px, feet at fx, fy) + `WORK/heroes.json`.
2. Backgrounds (only if they change): `python3 tools/size_tuner/bg.py vikF2 WORK/bg/vikF2 n=2` (also grkF1, egyF1; the capital: `bg.py capT WORK/bg/capTc 'at=2400,2620;2400,2340;3050,2620'`), look at the PNGs, set `PICK` in `bgcut.py`, then `python3 -I tools/size_tuner/bgcut.py WORK`.
3. `python3 -I tools/size_tuner/build.py WORK` → `WORK/pub/index.html`.
4. Republish: `get_artifact` → `list_files` → `publish_files` (slug, base_version, every file under `WORK/pub` with `as` = its relative path). The page declares `{db:{}}`; the saved values stay.
