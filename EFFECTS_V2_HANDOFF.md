# Effects v2 — handoff for the next chat (owner 2026-11-19)

Owner's request: throw away each hero's old skill effects and rebuild them from the painted pictures + 2.5D code VFX,
one hero at a time. Done and approved: **dragon, kitsune, anubis, lion**. Still to do, in this order:
~~wolf~~ (done 2026-11-19, char_wolf_vfx.js) → **cat → hippo → croc → jaguar → owl → rhino**. (Bastet, axolotl, sheep have no pictures yet — skip.)

## Where everything is
- Repo: `gotkatha02/totem-legend` (work here). Public mirror for the play link: `gotkatha02/grow-a-garden-deluxe`
  (procedure in CLAUDE.md → Working habits → Play link).
- Pictures: `assets/fx/<hero>/*.webp` (one effect per image, transparent). Wolf also borrows 4 cat pictures:
  `assets/fx/cat/09_crater, 22_pow, 23_dust, 25_shock`.
- Shared kit: `vfx25.js` → `window.V25` = { im, add, punch, scr, aim, fwd, ribbon, GPic, SPic, XPic, HPic, Shock, Crack,
  Puffs, Debris, Whirl, Sweep, Pillar, Pool, Speed, Charge, Stain, Bolt, V (recipes slam / release / splash / windBits / zaps / charge), C, OUT }.
  Picture names are `'<hero>/<file>'`, e.g. `im('wolf/w01_axe')`.
- Finished examples to copy from: `char_kitsune_vfx.js`, `char_anubis_vfx.js`, `char_lion_vfx.js` (all use vfx25.js).
  `char_dragon_vfx.js` is the original (it has its own copy of the kit).
- Hero code: wolf skills live in `index.html` (mkBasic, SKILLS[...].make); other heroes in `char_<hero>.js`.
  Old picture-effect files: `wolf_fx.js`, `char_croc_fx.js` + `croc_vfx.js`, `char_jaguar_fx.js`, `char_owl_fx.js`, `char_rhino_fx.js`; cat and hippo pictures are placed from code inside `index.html` (search `KtImg` / `HImg`).
- Script loading: `index.html` line ~610 (`document.write(...)` per hero). For a hero, replace its old fx script with
  `vfx25.js` + `char_<hero>_vfx.js`, then `git rm` the old fx file. Install calls are near index.html line ~4810
  (`installWolfFx` etc.) — keep the same function name (`window.installWolfFx = install`).

## The method (what the owner liked / disliked)
- Liked: ground slams (shock ring + cracks + dust + debris + shake + camera punch), power releases (light pillar + ring + flash).
- Disliked: round dot particles, rotating a picture to fake a spin.
- Rules: the picture is the main shape. Ground art lies flat (GPic, never rotated). Upright art stands on its bottom edge
  (SPic: rise + squash, contact shadow, light pool). Side-view streaks/slashes are aimed along the attack (XPic, afterimages).
  Hit sparks on the body (HPic). Spins / tornadoes / whirlpools = `Whirl` / `ribbon()` drawn on the floor plane
  (optionally stacked with `h:` for a funnel), never a turning picture. Debris kinds: drop, strand, zap, shard, rock, flame, petal.
- Timing: effects fire on the skill's release moment (action windup / its first event), not at button press.
  Add `V.charge(col, T)` during wind-ups ≥ 0.12 s.

## Steps per hero (≈ what was done for kitsune / anubis / lion)
1. Read the hero file: list its skill makers, its effect helper functions (e.g. kFireBurst / uBurst / lSlamFx / lPow),
   its own effect classes (projectiles, pillars, ground/top layers) and the state they draw (buffs, zones).
2. Make a contact sheet of `assets/fx/<hero>` and map each picture to a skill or a primitive.
3. New file `char_<hero>_vfx.js` (copy the structure of char_lion_vfx.js):
   - drop old visuals while this hero is played: wrap `addFx` to skip `GRing / Impact / Streak` (and for the wolf the other
     purely visual index.html classes, see below); wrap `emit` to skip types round|spark|ember|dust|shard|frag|glint;
     replace `dustPuff` and the hero's burst / pow helpers with V25 pieces.
   - repaint the hero's projectile / pillar classes via `Class.prototype.draw = …` (keep their update = gameplay).
   - replace its ground/top layer draws with pictures; keep the HUD bits (stacks, bars) but draw them as diamonds, not dots.
   - "watchers": a `{layer:'none'}` keeper that adds an SPic/GPic while a buff/state lasts (`until:()=>!state`).
   - per-skill extras by wrapping the hero's cast helper's `o.f` (or `SKILLS[k].make` for act-based skills).
   - hit sparks by wrapping the hero's hit function (one per enemy per 0.07 s).
   - remove the hero from `TV.toonHeroes` (old toon layer) inside install.
4. Test: serve (`python3 -m http.server 8765` in the repo), Playwright frame strips on a field map
   (`?char=<hero>&map=vikF2`, click `[data-m=test]`, set all LV to max, teleport next to an enemy, `castSkillNow(k,{target,phi,gx,gy})`,
   screenshot at game times .1/.3/.5/.75/1.05/1.5 using `gameTime`). Check every skill for page errors, look at the big ones.
5. Commit + `git pull --rebase` + push, mirror to grow-a-garden-deluxe, add a line to CLAUDE.md "Still to do", send the
   owner a strip picture and the play link (Thai).

## Wolf notes (started, nothing written yet)
- `wolf_fx.js`: table `AT` = per-skill moments at contact time (good map of skill → picture, reuse it), `W.slash/crater/bolt/shatter`,
  `WAura` (rage w07 / rune w14 / banner w20 while buffs), `WTop` (fenrir spirit w19), hurt() hook for hit sparks,
  painted icons loader at the end (keep it!), `window.wImg` is read by vfx_layer.js (TV.Companion) — remove wolf from
  `TV.toonHeroes` so the companion stops.
- Pictures: w01_axe (slash, side view) · w02_blood / w12_ice (8-cell bit strips → use Debris instead) · w03_hitred / w18_shatter (hits) ·
  w04_cyclone (ring — do it as ribbons + flat GPic, not spun) · w05_howl · w06_vamp · w07_rage · w08_exec · w09_parry · w10_armor ·
  w11_frost (slash) · w13_prison · w14_rune (ground circle) · w15_bolt · w16_spear (streak) · w17_blizzard / w22_worldstorm (ground
  swirls: GPic + Whirl funnel) · w19_spirit (wolf spirit streak) · w20_banner · w21_glacial (ground ice line).
- The wolf's old code VFX are generic index.html classes. Checked 2026-11-19: these have NO gameplay in update and can be dropped
  for the wolf: GRing, Impact, Streak, RuneCircle, Crack, Bolt, Ripple, LightPillar, Ghost, Crystal, Splash, GroundShatter,
  ClawMarks, SheenSweep, LineCut, Helix, GLight, FrostGround, Drain, SoundArcs, StarCut, PathCrack, ArmorCrack, SpearLine, Trail.
  Keep: DText, Ticker, BuffEmitter, Decoy and any class not in this list (check before dropping).
