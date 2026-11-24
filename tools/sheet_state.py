"""Add ONE animation state to a hero atlas (assets_<hero>.js, SPR_META / ATLAS schema of cliphero.py) from a single picture
of frames on a flat green (or magenta) background — e.g. a special move the owner drew as one sheet (2026-11-23: the snow
monkey's jump smash, 8 frames in 2 rows).

usage: python3 -I tools/sheet_state.py SPEC.json [preview.png]
SPEC (JSON):
  "js": "assets_wukong.js", "prefix": "WKG", "state": "jump",
  "sheet": "assets/heroes/wukong/jump_sheet.webp",
  "rows": 2, "cols": 4,                       frame order = row by row, left to right
  "centers": [[180,560,980,1360], [...]],     optional: x centre of every frame per row — loose pieces (swooshes, rocks, sparks)
                                              go to the nearest one (default: equal columns)
  "scale": 0.6,                               sheet px -> cell px (the atlas's own cell + feet pivot are read from its META:
                                              cliphero 720x540 / 360,470, statichero placeholders 498x466 / 248,405)
  "anchors": [[x,y], ...] | "auto",           per frame, in that frame's own cut box (the tool prints the boxes): the point that
                                              sits on the pivot = body centre x, feet y. In-air frames: the lowest foot — the game
                                              lifts the hero itself (player.z), so the drawn jump height must not be in the frame.
                                              "auto" (or left out) = centre of the lowest 8 % of the figure, its bottom row.
  "variants": [[sx,sy,deg], ...],             optional, for ONE picture (rows 1, cols 1 — the hippo's jump / gulp poses
                                              2026-11-24): the picture becomes one frame per variant, scaled sx / sy and turned
                                              deg (+ = clockwise) about its anchor — a little life for a single still.
  "dirs": ["S","SE","E","NE","N"],            source directions that get these frames (the engine mirrors SW / W / NW)
  "flip": false,                              true when the sheet faces left (it is mirrored so the frames face right)
  "dur": [ms, ...], "loop": false             default frame times (skills usually build their own timed sequence)
The state is replaced when it already exists; nothing else in the file changes. A preview (every frame on the pivot, with
the idle pose of the first listed direction beside it for size) is written when a second argument is given."""
import sys, io, json, base64, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

spec = json.load(open(sys.argv[1]))
PREV = sys.argv[2] if len(sys.argv) > 2 else None
_m0 = open(spec['js']).read(); _t0 = f"const {spec['prefix']}_SPR_META="
_meta0 = json.JSONDecoder().raw_decode(_m0[_m0.index(_t0) + len(_t0):])[0]
CW, CH = _meta0.get('cell', {}).get('w', 720), _meta0.get('cell', {}).get('h', 540)
PX, PY = _meta0.get('pivot', {}).get('x', 360), _meta0.get('pivot', {}).get('y', 470)
del _m0

# ---- key the sheet -------------------------------------------------------------------------------------------------
im = np.asarray(Image.open(spec['sheet']).convert('RGB')).astype(np.float32)
bord = np.concatenate([im[:6].reshape(-1, 3), im[-6:].reshape(-1, 3), im[:, :6].reshape(-1, 3), im[:, -6:].reshape(-1, 3)])
k = np.median(bord, 0)
magenta = k[0] > 150 and k[2] > 150 and k[1] < 100
if magenta:
    ex = np.minimum(im[..., 0], im[..., 2]) - im[..., 1]; kx = min(k[0], k[2]) - k[1]
else:
    ex = im[..., 1] - np.maximum(im[..., 0], im[..., 2]); kx = k[1] - max(k[0], k[2])
a = np.clip(1 - (ex - 18) / (kx * .55 - 18), 0, 1)                      # same soft matte as cliphero.py
col = np.clip((im - (1 - a[..., None]) * k) / np.maximum(a, 1e-3)[..., None], 0, 255)
if magenta:
    e2 = np.minimum(col[..., 0], col[..., 2]) - col[..., 1] - 6; e2 = np.maximum(e2, 0)
    col[..., 0] -= e2; col[..., 2] -= e2
else:
    col[..., 1] = np.minimum(col[..., 1], np.maximum(col[..., 0], col[..., 2]) + 6)
a[a < .08] = 0
er = nd.binary_erosion(a > .5, iterations=1); a = np.where((a > 0) & ~er, a * .75, a)   # soften the outer fringe
rgba = np.dstack([np.clip(col, 0, 255), a * 255]).astype(np.uint8)

# ---- split into frames: every piece goes to its row and the nearest frame centre ---------------------------------
R, C = spec['rows'], spec['cols']; Hs, Ws = a.shape
cen = spec.get('centers') or [[(c + .5) * Ws / C for c in range(C)] for _ in range(R)]
lab, n = nd.label(nd.binary_dilation(a > .25, iterations=3))
masks = [np.zeros(a.shape, bool) for _ in range(R * C)]
for i, sl in enumerate(nd.find_objects(lab)):
    m = lab[sl] == i + 1
    if m.sum() < 40: continue                                            # specks
    ys, xs = np.nonzero(m); cy = ys.mean() + sl[0].start; cx = xs.mean() + sl[1].start
    r = min(R - 1, int(cy * R / Hs)); c = int(np.argmin([abs(cx - q) for q in cen[r]]))
    masks[r * C + c][sl] |= m
S = spec['scale']; anchors = spec.get('anchors', 'auto'); flip = spec.get('flip', False); VAR = spec.get('variants')
def autoanchor(fr):        # centre of the lowest 8 % of the opaque pixels, bottom row (like statichero.py feet())
    A = np.asarray(fr)[..., 3] > 60; ys, xs = np.where(A); lo = ys.max() - int(fr.height * .08)
    return round(float(xs[ys >= lo].mean()), 1), float(ys.max())
def vary(fr, ax_, ay_, sx, sy, deg):   # scale sx / sy about the anchor, then turn deg (+ = clockwise) about it
    q = fr.resize((max(1, round(fr.width * sx)), max(1, round(fr.height * sy))), Image.LANCZOS); ax2, ay2 = ax_ * sx, ay_ * sy
    if deg:
        R = int(math.hypot(q.width, q.height)) + 4
        big = Image.new('RGBA', (2 * R, 2 * R), (0, 0, 0, 0)); big.paste(q, (round(R - ax2), round(R - ay2)), q)
        big = big.rotate(-deg, resample=Image.BICUBIC, center=(R, R))
        bb = big.getchannel('A').getbbox(); q = big.crop(bb); ax2, ay2 = R - bb[0], R - bb[1]
    return q, ax2, ay2
frames = []
for i, m in enumerate(masks):
    m = m & (a > 0); ys, xs = np.nonzero(m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cut = rgba[y0:y1 + 1, x0:x1 + 1].copy(); cut[..., 3] = np.where(m[y0:y1 + 1, x0:x1 + 1], cut[..., 3], 0)
    fr = Image.fromarray(cut)
    ax_, ay_ = anchors[i] if isinstance(anchors, list) and i < len(anchors) else autoanchor(fr)
    print(f'frame {i + 1}: cut box {x0},{y0} - {x1},{y1} ({x1 - x0 + 1}x{y1 - y0 + 1}), anchor {ax_},{ay_}')
    if flip: fr = fr.transpose(Image.FLIP_LEFT_RIGHT); ax_ = fr.width - 1 - ax_
    frames.append((fr, ax_, ay_))
if VAR: frames = [vary(frames[0][0], frames[0][1], frames[0][2], *v) for v in VAR]
pieces = []
for i, (fr, ax_, ay_) in enumerate(frames):
    q = fr.resize((max(1, round(fr.width * S)), max(1, round(fr.height * S))), Image.LANCZOS)
    cell = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); cell.paste(q, (round(PX - ax_ * S), round(PY - ay_ * S)), q)
    bb = cell.getchannel('A').point(lambda v: 255 if v > 0 else 0).getbbox()
    if bb[0] <= 0 or bb[1] <= 0 or bb[2] >= CW or bb[3] >= CH: print('  WARNING: frame', i + 1, 'touches the cell edge', bb)
    pieces.append((cell.crop(bb), bb))

# ---- pack one atlas row --------------------------------------------------------------------------------------------
G = 2; AW = sum(p.width for p, _ in pieces) + G * (len(pieces) + 1); AH = max(p.height for p, _ in pieces) + 2 * G
atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); x = G; rects = []
for p, bb in pieces:
    atlas.paste(p, (x, G)); rects.append([x, G, p.width, p.height, bb[0], bb[1], p.width, p.height]); x += p.width + G
bio = io.BytesIO(); atlas.save(bio, 'WEBP', quality=90, method=6)
uri = 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode()
print(f'atlas {AW}x{AH}, {len(bio.getvalue()) // 1024} KB')

# ---- write the state into the hero file ----------------------------------------------------------------------------
js = spec['js']; P = spec['prefix']; src = open(js).read(); dec = json.JSONDecoder()
def grab(name):
    tag = f'const {P}_{name}='; i = src.index(tag) + len(tag); obj, end = dec.raw_decode(src[i:]); return i, i + end, obj
mi, me, meta = grab('SPR_META')
st = spec['state']; nf = len(rects); dur = spec.get('dur') or [80] * nf
meta['states'][st] = {'loop': bool(spec.get('loop', False)), 'dirs': {d: {'dur': dur, 'f': rects} for d in spec.get('dirs', ['S', 'SE', 'E', 'NE', 'N'])}}
src = src[:mi] + json.dumps(meta, separators=(',', ':')) + src[me:]
ai, ae, atl = grab('SPR_ATLAS'); atl[st] = uri
src = src[:ai] + json.dumps(atl) + src[ae:]
open(js, 'w').write(src); print(f'{js}: state "{st}" written ({nf} frames, dirs {list(meta["states"][st]["dirs"])})')

# ---- preview: the frames on the pivot + the idle pose for size --------------------------------------------------------
if PREV:
    d0 = spec.get('dirs', ['SE'])[0]
    try:
        ii = atl['idle']; idl = Image.open(io.BytesIO(base64.b64decode(ii.split(',', 1)[1]))); r = meta['states']['idle']['dirs'][d0]['f'][0]
        ref = (idl.crop((r[0], r[1], r[0] + r[2], r[1] + r[3])), r)
    except Exception:
        ref = None
    tiles = ([ref] if ref else []) + [(p, [0, 0, 0, 0, bb[0], bb[1]]) for p, bb in pieces]
    TW, TH = 260, 340; out = Image.new('RGB', (TW * len(tiles), TH), (44, 48, 58)); dr = ImageDraw.Draw(out)
    for j, (p, r) in enumerate(tiles):
        ox = j * TW; gy = 260                                        # pivot drawn at (ox+130, 260)
        dr.line([(ox + 10, gy), (ox + TW - 10, gy)], fill=(110, 116, 130)); dr.line([(ox + TW // 2, 20), (ox + TW // 2, TH - 10)], fill=(70, 74, 86))
        out.paste(p, (ox + TW // 2 - PX + r[4], gy - PY + r[5]), p)
        dr.text((ox + 6, 6), 'idle ' + d0 if (ref and j == 0) else f'{st} {j + (0 if ref else 1)}', fill=(255, 220, 140))
    out.save(PREV); print('preview', PREV)
