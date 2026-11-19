# Totem Legend

2D idle action RPG with animal heroes from world myths (Norse, Aztec, Greek, Egyptian, Japanese). Systems follow 12 Tails Online.

## Play
- **Windows:** double-click `เปิดเกม-Windows.bat` (needs Python from python.org)
- **Mac:** double-click `เปิดเกม-Mac.command`
- Or run `python3 -m http.server 8000` in this folder and open http://localhost:8000/index.html
- Pick a hero with `?char=wolf` (wolf · jaguar · owl · rhino · croc · cat · hippo · sheep · axolotl)

Do not open `index.html` by double-click: the browser blocks map images on `file://`.

## Working on it with Claude
Start any chat with: **"ทำงานต่อใน repo gotkatha02/totem-legend"**.
Claude clones this repo, works on it, then commits and pushes. No zip files needed.
Game rules for every change are in `CLAUDE.md`.

## Main files
| File | What |
|---|---|
| `index.html` | engine, stats, damage, wolf / jaguar / rhino / axolotl / croc base code, UI windows |
| `char_*.js` | one module per hero (owl, cat, hippo, sheep, croc rework, rhino rework, jaguar rework) |
| `skill_rules.js` | damage type per skill (ATK / TAL / best-of), crowd control, KO |
| `items.js` | items, crafting, refine, sockets / orbs, shops |
| `ui_v2.js` | code-drawn UI theme (Golden Forge colours, fonts Mitr + Prompt) |
| `progress.js` | save / load, play mode, character creation roll |
| `tools/balance_bench.js` | fast-forward combat benchmark |
| `assets/` | art, icons, fonts, effects |
