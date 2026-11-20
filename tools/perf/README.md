# tools/perf — how the game's speed and memory are measured (2026-11-21)

Serve the repo first: `python3 -m http.server 8765` (working copy). For before / after comparisons also serve the last pushed version on 8766:
`git worktree add --detach /tmp/tl_head HEAD && (cd /tmp/tl_head && python3 -m http.server 8766)`.

| script | what it tells you |
|---|---|
| `calls.py <map> [q=low]` | cost of ONE frame, broken down by the game function that drew it (software canvas, every canvas call forced to finish — the only reliable per-pass number; frame gaps in headless Chromium are useless) |
| `bake.py <map>` | stutter when new ground has to be painted: frame times after a jump to unpainted ground |
| `bakecalls.py <map>` | what the ground painting is made of |
| `mem.py <port> map…` · `memtop.py <port> map…` | picture memory after visiting maps in a row · which code holds it |
| `sweep.py [port]` | enters all maps in ONE session: load time, fps, monsters, errors, memory |
| `smoke.py [q=low] map…` | quick: page errors + frames still coming |
| `cmp.py map…` | old (8766) vs new (8765): layout equality (object list), painted ground difference, screenshots in out/ |
| `fg.py map…` | old vs new atmosphere (ground + foreground at a fixed time), one map per mood |

Rules that came out of it: never set `ctx.filter` on the game canvas or inside a per-object loop (draw to a scratch canvas, filter once);
every full-screen blend is a frame-cost item — new 'screen' glows in `atmosphere()` go through `SCR()`; things that keep a canvas per map must give it back in the host's `release()`.
