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
  "clean": true,                              optional (jaguar poses 2026-11-26): mend ChatGPT's green / yellow-green glow
                                              smudges on the figure (painted with the colour round them) and drop floating ones
  "erase": [[x0,y0,x1,y1] | [x1,y1,x2,y2,...]], optional with "clean": sheet boxes / polygons that are wiped (a smudge
                                              the cleanup cannot tell from the body)
  "clean_debug": "dbg.png",                   optional: where the cleanup acted (magenta painted, cyan erased, yellow restored)
  "tone": {"L":.9,"C":.88,"blur":.45},        optional: a crisp hand-drawn pose made as soft / pale as the clip frames round it
                                              (luma contrast × L about "mid" .42, chroma × C, premultiplied blur in cell px)
  "pics": {"prefix": "assets/sit/jaguar_", "names": ["S",...], "k": .489, "q": 92}   optional: write every frame as its
                                              own picture instead of an atlas state (sitting views for hero_sit.js, "scale"
                                              1 = sheet px); "anchors" = sit point (body centre x, ground line y) -> the
                                              tool prints the SIT entry (cx / fy fractions); "names" follow the SHEET order
                                              (any order); "mirror": ["SW"] = these names are written flipped left-right
                                              (a view the sheet lacks, made from its opposite: the 2.5D cat's sheet drew the
                                              lower-right view twice and no lower-left one, 2026-11-27); their anchor is
                                              given unflipped and flipped with the picture
  "dirs": ["S","SE","E","NE","N"],            source directions that get these frames (the engine mirrors SW / W / NW)
  "views": {"S":[0,0,0], "E":[1,1,1], ...}    optional (the 2.5D cat's hurt / KO sheets 2026-11-27: one picture per VIEW): each
                                              direction's row = these sheet frames (0-based, in sheet order) instead of all of them;
  "nudge": {"S":[[dx,dy], ...], ...}          optional with "views": every row frame's box moved by dx / dy cell px (a recoil)
  "flip": false,                              true when the sheet faces left (it is mirrored so the frames face right)
  "dur": [ms, ...], "loop": false             default frame times (skills usually build their own timed sequence)
  "store": 1.5478                             optional (the 2.5D wolf 2026-11-26): the atlas stores its frames smaller than
                                              their boxes (cliphero "cellScale") — every frame is stored at 1 / store of its
                                              cell-px size, its box stays in cell px (the engine scales the picture to the box)
  "sheet_coords": true                        optional (the 2.5D wolf's Axe Dance sheets 2026-11-26): "anchors" and "sockets" are
                                              given in SHEET px (not in each frame's cut box) — stays right when the cut box moves
  "sockets": [[x, y] | null, ...]             optional (same): the weapon head of every frame (the axe blade's rune band, like
                                              cliphero.py's "axe" sockets), in cut-box px or sheet px with "sheet_coords" ->
                                              meta.sockets[state][dir] = {head, grip} (grip = up to 28 × store cell px toward the
                                              chest of the idle pose), so slashAt / headR / liveSocket can read the pose
  "head": [[x, y], ...]                       optional (the 2.5D wolf poses 2026-11-26): the head point of every frame in
                                              cell px (read by eye: the far ear's tip side, like tools/headtrack.py's points)
                                              -> meta.head[state][dir] for every listed dir, so fashion wings follow the pose;
                                              a state without it has no head points (fashion.js draws no wings on it)
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
if spec.get('clean'):
    # "clean": true (jaguar poses 2026-11-26) — ChatGPT sometimes leaves a soft green / yellow-green glow on the figure
    # although the prompt says no effects. The matte turns it into see-through patches (holes in an arm or the tail)
    # and floating dark / yellow smears. Inside the figure (the solid matte, closed and hole-filled) such pixels are
    # painted with the colour of the nearest clean pixel and made opaque; a pixel the matte only thinned (a teal stripe
    # whose green is a bit above its blue) gets its own colour back; pure background inside the figure (real gaps between
    # arm and body) stays transparent; outside the figure everything farther than 2.5 px from the solid matte goes.
    # A smudge = strongly key-tinted seeds + the weaker yellow-green wash connected to them. Each smudge that sits
    # inside the figure is painted, one whose surroundings are mostly background (a glow floating beside the body,
    # enclosed only by the closing) is erased; "erase": [[x0,y0,x1,y1], ...] sheet boxes force erasing.
    R_, G_, B_ = im[..., 0], im[..., 1], im[..., 2]
    if magenta:
        seed = (np.minimum(R_, B_) - G_ > 45) & (np.abs(R_ - B_) < 70); weak = (np.minimum(R_, B_) - G_ > 30)
    else:
        seed = (G_ - B_ > 45) & (G_ - R_ > 8); weak = (G_ - B_ > 30) & (G_ - R_ > -12) & (np.maximum(R_, G_) < 248)
    keyd = np.sqrt(((im - k) ** 2).sum(-1)) < 45
    rim = nd.binary_dilation(keyd, iterations=2)          # an outline pixel mixed with the background is not a smudge
    seed &= ~rim & (a > .02); weak &= ~rim
    seed = nd.binary_opening(seed, structure=np.ones((3, 3)))   # a smudge is a blob; a 1-2 px line is a colour edge
    lab0, _ = nd.label(weak | seed, structure=np.ones((3, 3)))
    ids = np.unique(lab0[seed]); tint = np.isin(lab0, ids[ids > 0])
    S = (a > .9) & ~tint
    F = nd.binary_fill_holes(nd.binary_closing(S, structure=nd.generate_binary_structure(2, 1), iterations=3))
    def hsv(c):
        mx = c.max(-1); mn = c.min(-1); d = np.maximum(mx - mn, 1e-4); r, g, b = c[..., 0], c[..., 1], c[..., 2]
        h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) / 6
        return h, (mx - mn) / np.maximum(mx, 1e-4), mx
    def rgb_of(h, s_, v):
        i = np.floor(h * 6) % 6; f = h * 6 - np.floor(h * 6); p_ = v * (1 - s_); q_ = v * (1 - f * s_); t_ = v * (1 - (1 - f) * s_)
        return np.stack([np.choose(i.astype(int), c) for c in ((v, q_, p_, p_, t_, v), (t_, v, v, q_, p_, p_), (p_, p_, t_, v, v, q_))], -1)
    lab1, n1 = nd.label(tint & F, structure=np.ones((3, 3))); paint = np.zeros_like(tint); gone = np.zeros_like(tint)
    newc = col.copy()
    for i, sl in enumerate(nd.find_objects(lab1), 1):
        sl2 = tuple(slice(max(0, s.start - 4), s.stop + 4) for s in sl)
        ci = lab1[sl2] == i; ring = nd.binary_dilation(ci, iterations=3) & ~ci & ~tint[sl2]
        bgf = (a[sl2][ring] < .5).mean() if ring.any() else 0
        if bgf > .45: gone[sl2] |= ci; continue
        paint[sl2] |= ci
        # the smudge keeps its light and shade but takes the hue / saturation of the clean body round it
        rc = col[sl2][ring & (a[sl2] > .9)] / 255.
        if len(rc) < 5: continue
        rh, rs, rv = hsv(rc); ang = np.angle(np.exp(2j * np.pi * rh).mean()) / (2 * np.pi) % 1
        ph, ps, pv = hsv(col[sl2][ci] / 255.)
        sub = newc[sl2]; sub[ci] = rgb_of(np.full_like(pv, ang), np.maximum(ps * .6, np.median(rs) * .9), pv) * 255; newc[sl2] = sub
    for er_ in spec.get('erase', []):                       # hand-picked boxes / polygons: everything in them goes
        if len(er_) == 4:
            x0, y0, x1, y1 = er_; gone[y0:y1, x0:x1] = True; paint[y0:y1, x0:x1] = False
        else:                                               # [x1,y1, x2,y2, ...] = a polygon (keeps a nearby outline)
            pm_ = Image.new('L', (gone.shape[1], gone.shape[0]), 0)
            ImageDraw.Draw(pm_).polygon([(er_[i], er_[i + 1]) for i in range(0, len(er_) - 1, 2)], fill=1)
            pm_ = np.asarray(pm_) > 0; gone |= pm_; paint &= ~pm_
    thin = F & ~tint & ~gone & (a > 0) & (a < 1) & ~nd.binary_dilation(a < .3, iterations=1)   # not the rim of a real gap
    soft = np.dstack([nd.gaussian_filter(newc[..., c], .8) for c in range(3)])
    col = np.where(paint[..., None], soft, col)
    a = np.where(paint | thin, 1.0, a)
    a = np.where(gone | (~F & tint) | (~F & (nd.distance_transform_edt(~S) > 2.5)), 0.0, a)
    if spec.get('clean_debug'):                                       # where the cleanup acted: painted magenta,
        dbg = np.where(paint[..., None], [255, 0, 255], np.where(gone[..., None], [0, 255, 255],     # erased cyan,
              np.where(thin[..., None], [255, 255, 0], im * .55)))                                   # restored yellow
        Image.fromarray(dbg.astype(np.uint8)).save(spec['clean_debug'])
    print(f'clean: {int(paint.sum())} smudge px painted, {int(gone.sum())} erased, {int(thin.sum())} thinned px restored')
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
frames = []; SHEETC = bool(spec.get('sheet_coords')); SOCK = spec.get('sockets'); socks = []
for i, m in enumerate(masks):
    m = m & (a > 0); ys, xs = np.nonzero(m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cut = rgba[y0:y1 + 1, x0:x1 + 1].copy(); cut[..., 3] = np.where(m[y0:y1 + 1, x0:x1 + 1], cut[..., 3], 0)
    fr = Image.fromarray(cut)
    hasA = isinstance(anchors, list) and i < len(anchors)
    ax_, ay_ = anchors[i] if hasA else autoanchor(fr)
    if SHEETC and hasA: ax_, ay_ = ax_ - x0, ay_ - y0
    sk_ = list(SOCK[i]) if SOCK and i < len(SOCK) and SOCK[i] else None
    if sk_ and SHEETC: sk_ = [sk_[0] - x0, sk_[1] - y0]
    print(f'frame {i + 1}: cut box {x0},{y0} - {x1},{y1} ({x1 - x0 + 1}x{y1 - y0 + 1}), anchor {ax_},{ay_}' + (f', socket {sk_[0]},{sk_[1]}' if sk_ else ''))
    if flip:
        fr = fr.transpose(Image.FLIP_LEFT_RIGHT); ax_ = fr.width - 1 - ax_
        if sk_: sk_[0] = fr.width - 1 - sk_[0]
    frames.append((fr, ax_, ay_)); socks.append(sk_)
if VAR: frames = [vary(frames[0][0], frames[0][1], frames[0][2], *v) for v in VAR]
TONE = spec.get('tone')
def tone(q, T):
    """"tone": {"L": .9, "C": .88, "blur": .45, "mid": .42} — bring a crisp, saturated drawing closer to clip-built
    atlas frames (video frames are softer and paler): luma contrast about `mid` × L, chroma × C, a premultiplied blur in
    cell px — so a pose drawn by hand does not pop out of the clip frames around it."""
    arr = np.asarray(q).astype(np.float32) / 255; rgb, al = arr[..., :3], arr[..., 3]
    Y = rgb @ np.array([.299, .587, .114], np.float32); mid = T.get('mid', .42)
    rgb = np.clip((mid + (Y - mid) * T.get('L', 1))[..., None] + (rgb - Y[..., None]) * T.get('C', 1), 0, 1)
    s = T.get('blur', 0)
    if s:
        pm = np.dstack([nd.gaussian_filter(rgb[..., c] * al, s) for c in range(3)]); al = nd.gaussian_filter(al, s)
        rgb = np.where(al[..., None] > 1e-3, pm / np.maximum(al, 1e-3)[..., None], 0)
    return Image.fromarray(np.dstack([np.clip(rgb, 0, 1) * 255, np.clip(al, 0, 1) * 255]).astype(np.uint8))
PICS = spec.get('pics')
if PICS:
    # loose pictures instead of an atlas state (the jaguar's 8 sitting views 2026-11-26, for hero_sit.js): every frame is
    # written as <prefix><name>.webp at sheet px × "scale" (keep 1: hero_sit scales them by its own k), toned with the
    # blur in output px; the anchor = where she sits: x = body centre, y = the body's ground line (things lying in front
    # of her, like the jaguar's crossed daggers, may reach below it) -> printed as cx / fy fractions for the SIT entry.
    cxs, fys = {}, {}
    for i, (fr, ax_, ay_) in enumerate(frames):
        nm = PICS['names'][i]
        q = fr if S == 1 else fr.resize((max(1, round(fr.width * S)), max(1, round(fr.height * S))), Image.LANCZOS)
        if nm in PICS.get('mirror', []):                 # a missing view made from its opposite (flipped with its anchor)
            fr = fr.transpose(Image.FLIP_LEFT_RIGHT); q = q.transpose(Image.FLIP_LEFT_RIGHT); ax_ = fr.width - 1 - ax_
        if TONE: q = tone(q, TONE)
        q.save(PICS['prefix'] + nm + '.webp', 'WEBP', quality=PICS.get('q', 92), method=6)
        cxs[nm] = round(ax_ / fr.width, 3); fys[nm] = round((ay_ + 1) / fr.height, 3)
        print(f'  {PICS["prefix"]}{nm}.webp {q.width}x{q.height} cx {cxs[nm]} fy {fys[nm]}')
    D8_ = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
    ord_ = [n for n in D8_ if n in cxs] + [n for n in PICS['names'] if n not in D8_]   # the entry in the usual direction order
    js_ = lambda d: ','.join(f'{n}:{d[n]}' for n in ord_)
    print("SIT entry: {dir:'%s',k:%s,cx:{%s},fy:{%s}}" % (PICS['prefix'], PICS.get('k', '?'), js_(cxs), js_(fys)))
    sys.exit()
pieces = []; cellSock = []
for i, (fr, ax_, ay_) in enumerate(frames):
    q = fr.resize((max(1, round(fr.width * S)), max(1, round(fr.height * S))), Image.LANCZOS)
    if TONE: q = tone(q, TONE)
    cell = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); cell.paste(q, (round(PX - ax_ * S), round(PY - ay_ * S)), q)
    sk_ = socks[i] if i < len(socks) else None
    cellSock.append((round(PX - ax_ * S) + sk_[0] * S, round(PY - ay_ * S) + sk_[1] * S) if sk_ else None)
    bb = cell.getchannel('A').point(lambda v: 255 if v > 0 else 0).getbbox()
    if bb[0] <= 0 or bb[1] <= 0 or bb[2] >= CW or bb[3] >= CH: print('  WARNING: frame', i + 1, 'touches the cell edge', bb)
    pieces.append((cell.crop(bb), bb))

# ---- pack one atlas row --------------------------------------------------------------------------------------------
G = 2; ST = float(spec.get('store', 1))
stored = [p if ST == 1 else p.resize((max(1, round(p.width / ST)), max(1, round(p.height / ST))), Image.LANCZOS) for p, _ in pieces]
AW = sum(q.width for q in stored) + G * (len(stored) + 1); AH = max(q.height for q in stored) + 2 * G
atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); x = G; rects = []
for q, (p, bb) in zip(stored, pieces):
    atlas.paste(q, (x, G)); rects.append([x, G, q.width, q.height, bb[0], bb[1], p.width, p.height]); x += q.width + G
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
if spec.get('views'):   # per-direction rows made of the sheet's frames (one view per direction), each frame box nudged by [dx, dy] cell px
    VW, NG = spec['views'], spec.get('nudge') or {}
    meta['states'][st]['dirs'] = {d: {'dur': dur if len(dur) == len(ix) else [dur[0]] * len(ix),
                                      'f': [rects[i][:4] + [rects[i][4] + round((NG.get(d) or [[0, 0]] * len(ix))[j][0]), rects[i][5] + round((NG.get(d) or [[0, 0]] * len(ix))[j][1])] + rects[i][6:]
                                            for j, i in enumerate(ix)]} for d, ix in VW.items()}
if SOCK:
    # weapon sockets like cliphero.py's "axe" ones: head = the blade point, grip = up to 28 (× store) cell px toward the chest
    try: HT = meta['states']['idle']['dirs'][spec.get('dirs', ['SE'])[0]]['f'][0][7]
    except Exception: HT = 230 * float(spec.get('store', 1))
    chest = (PX, PY - HT * .55); so = []
    for p in cellSock:
        if not p: so.append(None); continue
        vx, vy = chest[0] - p[0], chest[1] - p[1]; L = math.hypot(vx, vy) or 1; g = min(28 * float(spec.get('store', 1)), L * .45)
        so.append({'head': [round(p[0]), round(p[1])], 'grip': [round(p[0] + vx / L * g), round(p[1] + vy / L * g)]})
    meta.setdefault('sockets', {})[st] = {d: so for d in spec.get('dirs', ['S', 'SE', 'E', 'NE', 'N'])}
    print('sockets', [q['head'] if q else None for q in so])
if spec.get('head'):
    assert len(spec['head']) == nf, f"head: {len(spec['head'])} points for {nf} frames"
    meta.setdefault('head', {})[st] = {d: [list(map(round, q)) for q in spec['head']] for d in spec.get('dirs', ['S', 'SE', 'E', 'NE', 'N'])}
src = src[:mi] + json.dumps(meta, separators=(',', ':')) + src[me:]
ai, ae, atl = grab('SPR_ATLAS'); atl[st] = uri
src = src[:ai] + json.dumps(atl) + src[ae:]
open(js, 'w').write(src); print(f'{js}: state "{st}" written ({nf} frames, dirs {list(meta["states"][st]["dirs"])})')

# ---- preview: the frames on the pivot + the idle pose for size --------------------------------------------------------
if PREV:
    d0 = spec.get('dirs', ['SE'])[0]
    try:
        ii = atl['idle']; idl = Image.open(io.BytesIO(base64.b64decode(ii.split(',', 1)[1]))); r = meta['states']['idle']['dirs'][d0]['f'][0]
        rc = idl.crop((r[0], r[1], r[0] + r[2], r[1] + r[3])); ref = (rc if (r[2], r[3]) == (r[6], r[7]) else rc.resize((r[6], r[7]), Image.LANCZOS), r)
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
