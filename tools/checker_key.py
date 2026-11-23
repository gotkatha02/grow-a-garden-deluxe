"""Key a picture that ChatGPT drew on a FAKE transparency checkerboard (RGB, grey/white squares) — 2026-11-23, the monkey's FX.

usage: python3 -I tools/checker_key.py IN.png OUT.png [maxside=640] [barrier=185] [tol=6] [close=0] [abar=] [seal=] [sealw=7] [fillc=] [clearc=] [nogrid=1] [dbg=prefix]

1. fit the checker grid (cell size + phase) on the outer background and its two grey levels -> W(x,y); when the cells are
   jittered (no clean fit) the WHITE level is used everywhere and the faint grey-cell haze is cut afterwards
2. ink barrier = pixels clearly darker / more coloured than light glow (lum < barrier, or saturated);
   abar=0.3 also makes strong glow a barrier (glows that break the outline); interior = barrier + enclosed holes that do
   NOT look like checker (both checker levels / grid-correlated) → opaque, original colour
3. outside → colour-to-alpha against the local checker value, from the channels that got DARKER than it (yellow / gold /
   cyan glows keep a soft alpha; white glow cores can't be told from the white cells, so they go transparent)
4. trim (alpha > 24), pad 6, premultiplied resize to maxside, save RGBA
Fix-ups per picture, in SOURCE pixels: seal=x1,y1,x2,y2;… draws barrier lines over gaps in an outline (a cloud interior
leaking out), fillc=x,y,r;… forces a round patch to be solid, clearc=x,y,r;… forces one to be keyed.
dbg=prefix writes prefix_mask.png (blue = outer background, orange = barrier, green = filled interior, black = keyed glow).
The monkey's settings per picture: WUKONG_FX_PROMPTS_TH.md, section 'ใส่ในเกมแล้ว'.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

args = dict(a.split('=', 1) for a in sys.argv[3:])
src, dst = sys.argv[1], sys.argv[2]
MAXS = int(args.get('maxside', 640))
BAR = float(args.get('barrier', 185))
TOL = float(args.get('tol', 6))
CLOSE = int(args.get('close', 0))
DBG = args.get('dbg')

im = Image.open(src).convert('RGB')
C = np.asarray(im).astype(np.float32)
H, Wd, _ = C.shape
lum = C @ np.array([.299, .587, .114], np.float32)
spread = C.max(2) - C.min(2)

# ---- 1. outer background (neutral light, connected to the border)
NL = (spread <= 8) & (lum >= 222)
lab, n = ndi.label(NL)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
border = border[border > 0]
O0 = np.isin(lab, border)

def edges_1d(v, valid):
    """sub-pixel positions where v crosses its median (only inside valid runs)"""
    v = ndi.uniform_filter1d(v, 3)
    m = np.median(v[valid]) if valid.any() else np.median(v)
    s = v - m
    out = []
    for i in range(len(v) - 1):
        if valid[i] and valid[i + 1] and s[i] * s[i + 1] < 0 and abs(s[i] - s[i + 1]) > 2:
            out.append(i + s[i] / (s[i] - s[i + 1]))
    return out

def fit_axis(axis):
    es = []
    L = lum if axis == 0 else lum.T
    Ok = O0 if axis == 0 else O0.T
    rows = list(range(1, 10)) + list(range(L.shape[0] - 10, L.shape[0] - 1))
    for r in rows:
        if Ok[r].mean() < .5:
            continue
        es += edges_1d(L[r], Ok[r])
    es = np.array(es)
    if len(es) < 8:
        return None
    d = np.diff(np.sort(es))
    d = d[d > 4]
    p0 = np.median(d)
    best = None
    for p in np.linspace(p0 * .94, p0 * 1.06, 600):
        z = np.exp(2j * np.pi * es / p).mean()
        if best is None or abs(z) > best[0]:
            best = (abs(z), p, z)
    R, p, z = best
    ph = (np.angle(z) / (2 * np.pi) * p) % p
    return p, ph, R

fx = fit_axis(0)
fy = fit_axis(1)
grid = fx is not None and fy is not None and fx[2] > .9 and fy[2] > .9 and not args.get('nogrid')
ys, xs = np.mgrid[0:H, 0:Wd].astype(np.float32)
if grid:
    px, ox, _ = fx
    py, oy, _ = fy
    par = ((np.floor((xs - ox) / px) + np.floor((ys - oy) / py)) % 2).astype(np.int8)
    # away from cell edges for the level estimate
    fxp = ((xs - ox) / px) % 1
    fyp = ((ys - oy) / py) % 1
    core = (fxp > .2) & (fxp < .8) & (fyp > .2) & (fyp < .8) & O0
    lev = []
    for k in (0, 1):
        m = core & (par == k)
        lev.append(np.median(C[m], axis=0) if m.sum() > 50 else np.median(C[O0], axis=0))
    lev = np.array(lev)
    # anti-aliased W by 4x supersampling of the parity
    acc = np.zeros((H, Wd), np.float32)
    for sy in range(4):
        for sx in range(4):
            acc += ((np.floor((xs + (sx + .5) / 4 - .5 - ox) / px) + np.floor((ys + (sy + .5) / 4 - .5 - oy) / py)) % 2)
    t = acc / 16.0
    Wm = lev[0][None, None, :] * (1 - t[..., None]) + lev[1][None, None, :] * t[..., None]
    diff = abs(lev[0].mean() - lev[1].mean())
else:
    # no clean grid: use the WHITE cell level everywhere (grey cells then read
    # as a faint haze that the cleanup below removes)
    lev = np.array([np.percentile(C[O0], 10, axis=0), np.percentile(C[O0], 92, axis=0)])
    Wm = np.broadcast_to(lev[1], C.shape).copy()
    diff = float(lev[1].mean() - lev[0].mean())
print('grid', grid, fx, fy, 'levels', lev.round(1).tolist(), 'diff', round(float(diff), 1))

# ---- 2. colour to alpha against the local checker value
def c2a(C, W, noise=3.0):
    """alpha from the channels that got DARKER than the checker (yellow / gold /
    cyan glows); brighter-than-checker is ignored: on the white cells it can't be
    seen, so using it would print the checker into white glow cores"""
    a = np.zeros(C.shape[:2], np.float32)
    for c in range(3):
        ac = np.maximum(W[..., c] - C[..., c] - noise, 0) / np.maximum(W[..., c] - noise, 1)
        a = np.maximum(a, ac)
    a = np.clip(a, 0, 1)
    G = W + (C - W) / np.maximum(a, 1e-3)[..., None]
    return a, np.clip(G, 0, 255)

A, G = c2a(C, Wm)

# ---- 3. interior
sat = spread / np.maximum(C.max(2), 1)
barrier = (lum < BAR) | ((sat > .55) & (lum < BAR + 25))
if args.get('abar'):
    barrier |= A > float(args['abar'])
if CLOSE:
    barrier = ndi.binary_closing(barrier, iterations=CLOSE)
if args.get('seal'):
    from PIL import ImageDraw
    sm = Image.new('L', (Wd, H), 0)
    dr = ImageDraw.Draw(sm)
    for seg in args['seal'].split(';'):
        v = [float(t) for t in seg.split(',')]
        dr.line([(v[0], v[1]), (v[2], v[3])], fill=255, width=int(args.get('sealw', 7)))
    barrier |= np.asarray(sm) > 0
holes = ~barrier
hl, hn = ndi.label(holes)
bl = np.unique(np.concatenate([hl[0], hl[-1], hl[:, 0], hl[:, -1]]))
interior = barrier.copy()
match = (np.abs(C - Wm).max(2) <= TOL)
Wl = Wm.mean(2)
objs = ndi.find_objects(hl)
nbg = nfill = 0
for i, sl in enumerate(objs, 1):
    if sl is None or i in bl:
        continue
    m = hl[sl] == i
    npx = m.sum()
    mf = match[sl][m].mean()
    wl = Wl[sl][m]
    corr = None
    if wl.std() > 1.5 and npx > 30:
        ll = lum[sl][m]
        if ll.std() > .5:
            corr = float(np.corrcoef(ll, wl)[0, 1])
    # checker texture test (works without a grid): neutral light pixels at
    # the two checker levels, both levels present
    gl, wl_ = float(lev.mean(1).min()), float(lev.mean(1).max())
    if wl_ - gl < 4:
        gl = float(np.percentile(lum[O0], 10)); wl_ = float(np.percentile(lum[O0], 92))
    ll = lum[sl][m]; spr = spread[sl][m]
    neu = (spr <= 6) & (ll >= gl - 5) & (ll <= wl_ + 4)
    mid = (gl + wl_) / 2
    lowf = ((ll < mid) & neu).mean(); highf = ((ll >= mid) & neu).mean()
    tex = neu.mean() > .85 and ((lowf > .1 and highf > .1) or (npx < 600 and lowf > .8))
    if corr is not None:
        is_bg = (corr > .55 and mf > .35) or tex
    else:
        is_bg = tex
    if is_bg:
        nbg += 1
    else:
        nfill += 1
        interior[sl][m] = True
print('holes: background', nbg, 'filled', nfill)
# fillc=x,y,r;... : force a round patch of non-barrier pixels to be interior
if args.get('fillc'):
    for seg in args['fillc'].split(';'):
        cx, cy, r = [float(t) for t in seg.split(',')]
        interior |= ((xs - cx) ** 2 + (ys - cy) ** 2) <= r * r
# clearc=x,y,r;... : force a round patch to be outside (colour-to-alpha)
if args.get('clearc'):
    for seg in args['clearc'].split(';'):
        cx, cy, r = [float(t) for t in seg.split(',')]
        interior &= ~((((xs - cx) ** 2 + (ys - cy) ** 2) <= r * r) & ~barrier)

alpha = np.where(interior, 1.0, A)
col = np.where(interior[..., None], C, G)
# clean faint haze outside
t0 = .03 if grid else max(.03, (diff - 3) / 250 + .012)
print('haze cut', round(t0, 3))
alpha = np.where(interior, alpha, np.clip((alpha - t0) / (1 - t0), 0, 1))
# anti-alias the interior edge a little: blend 1px border with c2a result
er = ndi.binary_erosion(interior, iterations=1)
edge = interior & ~er
alpha = np.where(edge, np.maximum(A, .5 * alpha + .5 * A), alpha)
col = np.where(edge[..., None], np.where((A > .2)[..., None], G, C), col)

alpha = np.where(alpha < 6 / 255, 0, alpha)
out = np.dstack([col, alpha * 255]).round().clip(0, 255).astype(np.uint8)
img = Image.fromarray(out, 'RGBA')
bb = img.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
img = img.crop(bb)
pad = 6
w, h = img.size
canvas = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
canvas.paste(img, (pad, pad))
img = canvas
s = min(1.0, MAXS / max(img.size))
if s < 1:
    # premultiplied resize to avoid dark fringes
    a = np.asarray(img).astype(np.float32)
    pm = a.copy()
    pm[..., :3] *= a[..., 3:4] / 255
    pim = Image.fromarray(pm.round().astype(np.uint8), 'RGBA')
    nw, nh = max(1, round(img.size[0] * s)), max(1, round(img.size[1] * s))
    r = np.asarray(pim.resize((nw, nh), Image.LANCZOS)).astype(np.float32)
    al = r[..., 3:4]
    r[..., :3] = np.where(al > 0, r[..., :3] * 255 / np.maximum(al, 1), 0)
    img = Image.fromarray(r.round().clip(0, 255).astype(np.uint8), 'RGBA')
img.save(dst)
print('saved', dst, img.size, 'bbox', bb)

if DBG:
    vis = np.zeros((H, Wd, 3), np.uint8)
    vis[O0] = (40, 40, 160)
    vis[barrier] = (200, 120, 40)
    vis[interior & ~barrier] = (60, 200, 60)
    Image.fromarray(vis).resize((Wd // 2, H // 2)).save(DBG + '_mask.png')
