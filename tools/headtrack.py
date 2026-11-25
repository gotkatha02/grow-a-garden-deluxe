"""Head point of every frame of a hero atlas (for fashion headgear / wings / capes: fashion.js reads FASHION.head, and a hero
atlas that carries meta.head replaces it) — template tracking from one marked frame per direction.
usage: python3 -I tools/headtrack.py ATLAS.js PREFIX REFS.json [preview.png]
REFS.json: {"S": {"frame": "idle:0", "point": [x, y], "box": [x0, y0, x1, y1]}, "SE": {...}, ...,
            "_search": 220, "_fix": {"attack/S/3": [x, y], "attack/E/2": null, …}, "_copy": {"attack/NE": "attack/E"}}
  point = the head point on that frame in FINAL cell px (after cellScale): forehead centre between the ears, about where
  the old wolf's points sat (~32 cell px above the eyes); box = the template (the head only — keep the weapon out of it).
For every state / direction / frame the head template of that direction is searched (normalised cross-correlation on the
frame composed over mid grey, window ±search px round the reference point) and point + shift is written into
<PREFIX>SPR_META.head[state][dir] (rounded ints). Frames whose best match scores under .45 are listed (check them): where the head turns away or hides behind the arms
the template finds the tail — fix those by eye in "_fix" (null = between its row's neighbours).
Made 2026-11-25 for the wolf's Fenrir's Heir atlas (assets_wolf.js)."""
import sys, json, base64, io, re
import numpy as np, cv2
from PIL import Image, ImageDraw
js, pre, refp = sys.argv[1], sys.argv[2], sys.argv[3]; prev_out = sys.argv[4] if len(sys.argv) > 4 else None
REFS = json.load(open(refp)); SEARCH = REFS.pop('_search', 200); FIX = REFS.pop('_fix', {}); COPY = REFS.pop('_copy', {})
REFS = {k: v for k, v in REFS.items() if not k.startswith('_')}   # '_note' etc.
s = open(js).read()
def span(name):
    i = s.index(name + '=') + len(name) + 1; d = 0
    for j in range(i, len(s)):
        if s[j] == '{': d += 1
        elif s[j] == '}':
            d -= 1
            if not d: return i, j + 1
mi = span(pre + 'SPR_META'); M = json.loads(s[mi[0]:mi[1]]); ai = span(pre + 'SPR_ATLAS'); A = json.loads(s[ai[0]:ai[1]])
cw, ch = M['cell']['w'], M['cell']['h']; SH = {}
def cell(st, d, i):
    if st not in SH: SH[st] = Image.open(io.BytesIO(base64.b64decode(A[st].split(',', 1)[1]))).convert('RGBA')
    x, y, w, h, bx, by, bw, bh = M['states'][st]['dirs'][d]['f'][i]
    c = Image.new('RGBA', (cw, ch), (128, 128, 128, 255)); c.alpha_composite(SH[st].crop((x, y, x + w, y + h)).resize((bw, bh), Image.LANCZOS), (bx, by))
    return np.asarray(c.convert('L')).astype(np.float32)
head = {}; low = []
for d, R in REFS.items():
    st0, f0 = R['frame'].split(':'); g = cell(st0, d, int(f0)); x0, y0, x1, y1 = R['box']; T = g[y0:y1, x0:x1].copy(); px, py = R['point']
    for st, sv in M['states'].items():
        L = []
        for i in range(len(sv['dirs'][d]['f'])):
            G = cell(st, d, i); sx0, sy0 = max(0, x0 - SEARCH), max(0, y0 - SEARCH); W = G[sy0:min(ch, y1 + SEARCH), sx0:min(cw, x1 + SEARCH)]
            r = cv2.matchTemplate(W, T, cv2.TM_CCOEFF_NORMED); _, sc, _, loc = cv2.minMaxLoc(r)
            dx, dy = sx0 + loc[0] - x0, sy0 + loc[1] - y0; L.append([round(px + dx), round(py + dy)])
            if sc < .45: low.append(f'{st}/{d}/{i} {sc:.2f}')
        head.setdefault(st, {})[d] = L
for k, v in FIX.items():   # read by eye ("st/dir/i": [x, y]); null = sits between the nearest good frames of its row
    st, d, i = k.split('/'); head[st][d][int(i)] = v
for st in head:
    for d, L in head[st].items():
        good = [i for i, p in enumerate(L) if p]
        for i, p in enumerate(L):
            if p: continue
            a = max((j for j in good if j < i), default=None); b = min((j for j in good if j > i), default=None)
            if a is not None and b is not None: t = (i - a) / (b - a); L[i] = [round(L[a][0] + (L[b][0] - L[a][0]) * t), round(L[a][1] + (L[b][1] - L[a][1]) * t)]
            else: L[i] = list(L[a if a is not None else b])
for dst, src in COPY.items():   # a row cut from another direction's clip (the wolf's NE attack = the E clip)
    (s1, d1), (s2, d2) = dst.split('/'), src.split('/'); head[s1][d1] = [list(p) for p in head[s2][d2]]
M['head'] = head
s = s[:mi[0]] + json.dumps(M, separators=(',', ':')) + s[mi[1]:]
open(js, 'w').write(s); print('head points written for', list(REFS), '| low scores:', low or 'none')
if prev_out:   # contact sheet: every frame's head point
    rows = []
    for st, sv in M['states'].items():
        for d in REFS:
            rows.append((st, d, len(sv['dirs'][d]['f'])))
    n = max(r[2] for r in rows); W_, H_ = 120, 120; img = Image.new('RGB', (W_ * n, (H_ + 12) * len(rows)), (40, 40, 40)); dr = ImageDraw.Draw(img)
    for r, (st, d, k) in enumerate(rows):
        for i in range(k):
            hx, hy = head[st][d][i]; c = Image.fromarray(cell(st, d, i).astype(np.uint8)).convert('RGB')
            dd = ImageDraw.Draw(c); dd.ellipse([hx - 6, hy - 6, hx + 6, hy + 6], outline=(255, 0, 255), width=3)
            img.paste(c.crop((hx - 90, hy - 70, hx + 90, hy + 110)).resize((W_, H_)), (i * W_, r * (H_ + 12) + 12)); dr.text((i * W_ + 2, r * (H_ + 12)), f'{st} {d} {i}', fill=(255, 255, 0))
    img.save(prev_out); print(prev_out, img.size)
