"""Hero sprite set from video clips (green background) -> assets_<id>.js (SPR_META/ATLAS schema, same as statichero.py).
usage: python3 -I tools/cliphero.py PLAN.json OUT.js PREFIX
PLAN.json: {"height":230, "flip":true, "clips":{"idle":{"S":"a.mp4",...}, "walk":{...}, "attack":{...}, "buff":{...}},
            "attack":{"S":{"frames":[...],"contact":5}, ...}, "buff":{"S":{"frames":[...],"peak":6}, ...},
            "normalize":["walk/S"]}   # clips whose size changes (character walks toward the camera) get each frame rescaled
Optional (2026-11-21, axolotl): "topFade":6 / "sideFade":60 (px faded at the top / left-right edges, default 28 — heads that touch the top need less,
  water rings wider than the video fade out instead of ending in a straight cut),
  "strict":{"buff/N":[16,17]} (frames keyed with a strict matte: light green-tinted rays / glow become transparent),
  "attack":{"S":{...,"dur":[ms ×n]}} / "buff":{...,"dur":[...]} (frame times instead of the default 55/40/75 and 70),
  "orb":true (sockets for attack AND buff = centre of the held cyan-blue orb / water burst; grip = the hand just behind it),
  "feetFit":{"buff/N":[16,17]} (frames where the CAMERA zooms: each is scaled back by the width of the feet in the clip's first
  frame ÷ its own, about the feet point — use it only where the stance does not change; the factors are printed).
Optional (2026-11-23, snow monkey): "flipDirs":["E"] (only these directions are mirrored — his side clips faced west),
  "loop":{"idle/S":[44,72]} (start frame + period of an idle / walk loop instead of the automatic one — for clips whose first
  second is a pose change that does not loop).
Optional (2026-11-24, sheep priestess): "orbMask":{"b":140,"br":70,"bg":40,"g":0,"min":90} (thresholds of the orb colour: blue > b,
  blue − red > br, blue − green > bg, green > g, blob area ≥ min — her deep-blue orb is darker than the axolotl's water, and the blue
  gems on her tiara / earrings are smaller than min), "orbAll":true (orb sockets for EVERY state — idle / walk / hurt too — so
  effects can start at the orb outside actions: the game reads them through playerFrame()),
  "orbPale":true or {b, g, br, gb, min} (when no blue orb is found, a white / pale-blue glowing one: blue > b, green > g,
  blue − red ≥ br, blue − green ≥ gb, area ≥ min — the sheep's orb glows white after the swing and at the cast peak),
  "orbFix":{"attack/S":{"4":[x,y], …}} (orb read by eye where the clip blurs / turns / hides it, in PLACED-CELL px of this
  build — re-read them after changing height / perDir / frames; null = treat as not found),
  "orbLerp":true (a frame without an orb sits on the line between the nearest frames that have one, instead of borrowing one).
Optional (2026-11-24, Bastet): "orbMask":{…,"r":70} = red > r too (her orb is the PALE cyan flame over her book, B ≈ G, red
  80–140, while the turquoise gems are red < 50 — "bg" may then be negative, e.g. -20); default -1 = no red test.
Optional (2026-11-24, jaguar): "unstreak":{"attack/SE":[16,18]} = after keying, baked effect streaks are removed from these
  frames: saturated red pieces with (almost) no dark outline whose rim touches the transparent background, plus their soft
  edge, then whatever no longer touches the body (the video model drew a red crescent behind her raised dagger; painted red
  parts of a hero always sit inside dark-brown outlines). Only for streaks on the background, not ones drawn over the body.
Optional (2026-11-24, jaguar clips): "blade":{"pick":{"attack/S":["x",6]},"fix":{"attack/E":{"2":[hx,hy,gx,gy]}}} = attack / buff sockets
  on a real dagger (head = blade tip, grip = blade base at the guard), see blade_sockets(); "stateDur":{"walk/E":[…],"hurt/S":[…]}
  = frame times for idle / walk / hurt rows (keep an older atlas's times: two skills play the walk row as a timed dash);
  "deglow":{"attack/NE":[7,8]} = a blade the video lit up white-violet is toned back to dark obsidian.
Optional (2026-11-25, rhino Glacier Titan): "breath":{"idle/S":0.02} (with explicit "frames": the row is a near-still stretch — the video
  model closed his eyes for the whole moving part of the idle — so frame j of n is stretched up by amp·(1 − cos 2πj/n)/2 about the feet
  line: one slow breath per loop, the head rises ~amp × height).
Optional (2026-11-25, wolf Fenrir's Heir): "frames":{"idle/S":[...]} (explicit 0-based video frames for an idle / walk row instead of a
  sampled loop — skips closed-eye stretches; their times come from "stateDur", default 200 / 100 ms), "trendNorm":["walk/S"] (the
  hero walks TOWARD the camera: size and feet follow a smooth quadratic fit of the bbox height / feet over the whole clip, every
  frame is scaled back to the first frame's size — no per-frame jitter),
  "axe":{"b":190,"br":45,"g":140,"bg":10,"min":40,"grip":28} (attack + buff sockets: head = centre of the largest light-blue blob = the
  rune-engraved axe blade, frames where it is hidden sit between their neighbours; grip = that far toward the chest),
  "axeFix":{"attack/S":{"5":[x,y]}} (placed-cell px, like orbFix), "cellScale":k (cell, pivot, every frame box, socket and head point
  are multiplied by k while the sheet keeps its pixels: the engine draws the sheet bigger, so a hero cut at height 230 can stand in
  for an atlas drawn at 230·k cell px — the wolf replaces the old wolf atlas without CHAR_SCALE, so every wolf effect, socket user
  and fashion point keeps its numbers).
Keying: soft green matte + despill + speck removal (keeps the body and anything touching it, e.g. the sword).
Idle / walk loops are found automatically (period of best self-match); hurt is made from the idle pose."""
import sys, io, json, base64, math, subprocess, numpy as np
from PIL import Image
from scipy import ndimage as nd
plan, out, PFX = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
HT = plan.get('height', 230); FLIP = plan.get('flip', False)
CW, CH, PX, PY = 720, 540, 360, 470
DIRS = ['S', 'SE', 'E', 'NE', 'N']
FWD = {'S': (0, 1), 'SE': (.8, .45), 'E': (1, 0), 'NE': (.8, -.45), 'N': (0, -1)}

def read(path):
    p = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'json', path], capture_output=True).stdout)['streams'][0]
    w, h = p['width'], p['height']
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)

TOPF = plan.get('topFade', 28); SIDEF = plan.get('sideFade', 28)
def key(fr, flip=None, strict=False):
    flip = FLIP if flip is None else flip
    im = fr.astype(np.float32)
    k = np.median(np.concatenate([im[:8].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)]), 0)
    ex = im[..., 1] - np.maximum(im[..., 0], im[..., 2]); kx = k[1] - max(k[0], k[2])
    if strict:   # flash / ray frames: anything green-tinted, even pale, is background; colours are kept as they are
        a = np.clip(1 - (ex - 6) / 24, 0, 1); col = im.copy()
    else:
        a = np.clip(1 - (ex - 18) / (kx * .55 - 18), 0, 1)          # tight matte: green-ish edge pixels go transparent
        col = np.clip((im - (1 - a[..., None]) * k) / np.maximum(a, 1e-3)[..., None], 0, 255)
    mx = np.maximum(col[..., 0], col[..., 2]); col[..., 1] = np.minimum(col[..., 1], mx + 6)   # despill everywhere
    a[a < .08] = 0
    # speck removal: keep components that touch the main body
    lab, n = nd.label(nd.binary_dilation(a > .25, iterations=3))
    if n > 1:
        sizes = nd.sum(np.ones_like(a), lab, range(1, n + 1)); main = 1 + int(np.argmax(sizes))
        keep = (lab == main) | np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * .08])
        a = a * keep
    # fade near the video border so effects that leave the frame don't end in a hard line
    if strict:   # the white glow left round the orb: near-white pixels that are not inside / against the body go
        wh = (col.min(-1) > 200) & (col.max(-1) - col.min(-1) < 40); body = (a > .5) & ~wh
        a = np.where(wh & ~nd.binary_fill_holes(nd.binary_closing(body, iterations=2)), 0, a)   # only white enclosed by the body (orb highlights) stays
    H_, W_ = a.shape; m = 28; yy = np.minimum(np.arange(H_) * m / max(1, TOPF), H_ - 1 - np.arange(H_)); xx = np.minimum(np.arange(W_), W_ - 1 - np.arange(W_)) * m / max(1, SIDEF)
    a = a * np.clip(np.minimum(yy[:, None], xx[None, :]) / m, 0, 1)
    # soften the outer fringe by one pixel
    er = nd.binary_erosion(a > .5, iterations=1); a = np.where((a > 0) & ~er, a * .7, a)
    rgba = np.dstack([col, a * 255]).astype(np.uint8)
    img = Image.fromarray(rgba)
    return img.transpose(Image.FLIP_LEFT_RIGHT) if flip else img

def bbox(img):
    A = np.asarray(img)[..., 3] > 40; ys, xs = np.where(A)
    return (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None

def feet(img):
    A = np.asarray(img)[..., 3] > 60; ys, xs = np.where(A); lo = ys.max() - int((ys.max() - ys.min()) * .07)
    return float(xs[ys >= lo].mean()), float(ys.max())

def place(img, s, anchor):
    """scale by s and put anchor (feet) on the pivot"""
    q = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
    fx, fy = anchor[0] * s, anchor[1] * s
    cell = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); cell.paste(q, (round(PX - fx), round(PY - fy)), q); return cell

def mask_small(img):
    return np.asarray(img.resize((60, 88)))[..., 3] > 80

def period(masks, lo=8, hi=40):
    best, bp = 1e9, None
    for P in range(lo, min(hi, len(masks) // 2)):
        d = np.mean([np.mean(masks[i] != masks[i + P]) for i in range(10, min(len(masks) - P, 70))])
        if d < best: best, bp = d, P
    return bp

CACHE = {}; RAW = {}
FLIPDIRS = set(plan.get('flipDirs', DIRS if FLIP else []))
def clip(path, d='S'):
    k = (path, d in FLIPDIRS)
    if k not in CACHE:
        if path not in RAW: RAW[path] = read(path)
        CACHE[k] = [key(f, d in FLIPDIRS) for f in RAW[path]]
    return CACHE[k]
STRICT = plan.get('strict', {})
UNS = plan.get('unstreak', {})
def unstreak(img):
    A = np.asarray(img).astype(np.float32); col = A[..., :3]; a = A[..., 3] / 255
    R, G, B = col[..., 0], col[..., 1], col[..., 2]
    red = (a > .3) & (R > 150) & (R - G > 80) & (R - B > 60)
    dark = (a > .5) & (col.max(-1) < 95)
    lab, n = nd.label(nd.binary_closing(red, iterations=1)); kill = np.zeros_like(red)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() < 12: continue
        ring = nd.binary_dilation(m, iterations=2) & ~m; tot = max(1, ring.sum())
        if (ring & dark).sum() / tot < .04 and (ring & (a < .15)).sum() / tot > .05: kill |= nd.binary_dilation(m, iterations=1)
    if not kill.any(): return img
    ring = nd.binary_dilation(kill, iterations=4) & ~kill
    kill |= ring & ((a < .8) | ((R - G > 50) & (R > 140)))   # the streak's soft / reddish edge
    a = np.where(kill, 0, a)
    lab, n = nd.label(a > .05)
    if n > 1:
        sizes = nd.sum(np.ones_like(a), lab, range(1, n + 1)); a = a * np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * .02])
    print(f'  unstreak: {int(kill.sum())} px removed')
    return Image.fromarray(np.dstack([col, a * 255]).astype(np.uint8))
DEG = plan.get('deglow', {})
def deglow(img):
    """a blade that the video model lit up white-violet (it is black obsidian with one lavender stripe) is toned back down:
    pale violet pixels (blue > green + 12, red > green + 2, every channel > 90) are pulled toward dark violet ×.45"""
    A = np.asarray(img).astype(np.float32); col = A[..., :3]; a = A[..., 3]
    R, G, B = col[..., 0], col[..., 1], col[..., 2]
    m = (a > 70) & (B - G > 12) & (R - G > 2) & (col.min(-1) > 90)
    dk = np.array([46, 26, 48], np.float32); col[m] = dk + (col[m] - dk) * .45
    print(f'  deglow: {int(m.sum())} px')
    return Image.fromarray(np.dstack([col, a]).astype(np.uint8))
FIT = plan.get('feetFit', {})
def fspan(img):
    """width of the feet: alpha extent of the bottom 15 rows (camera-zoom gauge where the stance stays the same)"""
    A = np.asarray(img)[..., 3] > 60; ys = np.nonzero(A.any(1))[0]; fy = ys.max(); xs = np.nonzero(A[fy - 14:fy + 1].any(0))[0]
    return float(xs.max() - xs.min())

# one global scale from the front idle pose
ref = clip(plan['clips']['idle']['S'], 'S')[0]; b = bbox(ref); S0 = HT / (b[3] - b[1])
# perDir: every direction is scaled so its own idle pose is HT tall (clips filmed at slightly different zoom per direction)
SD = {}
for _d in DIRS:
    if plan.get('perDir'):
        _b = bbox(clip(plan['clips']['idle'][_d], _d)[0]); SD[_d] = HT / (_b[3] - _b[1])
    else: SD[_d] = S0

TREND = {}
def trend(path, d, F):
    """quadratic fit of bbox height and feet point over the whole clip (hero walking toward the camera)"""
    k = (path, d)
    if k not in TREND:
        i = np.arange(len(F)); H_, X_, Y_ = [], [], []
        for f in F:
            bb = bbox(f); ft = feet(f); H_.append(bb[3] - bb[1]); X_.append(ft[0]); Y_.append(ft[1])
        fitq = lambda v: np.polyval(np.polyfit(i, np.array(v, float), 2), i)
        TREND[k] = (fitq(H_), fitq(X_), fitq(Y_)); h = TREND[k][0]; print(f'  trendNorm {d}: height {h[0]:.0f} -> {h[-1]:.0f} px over the clip')
    return TREND[k]

def frames_for(st, d):
    path = plan['clips'][st][d]; F = clip(path, d); norm = f'{st}/{d}' in plan.get('normalize', [])
    anchor0 = feet(F[0]); fit = FIT.get(f'{st}/{d}', []); span0 = fspan(F[0]) if fit else None
    tn = trend(path, d, F) if f'{st}/{d}' in plan.get('trendNorm', []) else None
    def cell(i):
        img = F[i] if i not in STRICT.get(f'{st}/{d}', []) else key(RAW[path][i], d in FLIPDIRS, True)
        if i in UNS.get(f'{st}/{d}', []): img = unstreak(img)
        if i in DEG.get(f'{st}/{d}', []): img = deglow(img)
        if tn:   # walking toward the camera: smooth size / feet trend, scaled back to the first frame's size
            h, fx, fy = tn; return place(img, SD[d] * h[0] / h[i], (fx[i], fy[i]))
        if norm:
            bb = bbox(img); s = HT / (bb[3] - bb[1]); return place(img, s, feet(img))
        if i in fit:   # undo the camera zoom about the feet: video point p -> c + (p - c)·k, then placed like every other frame
            k = span0 / fspan(img); c = feet(img); print(f'  feetFit {st}/{d} frame {i}: ×{k:.3f}')
            return place(img, SD[d] * k, (c[0] - (c[0] - anchor0[0]) / k, c[1] - (c[1] - anchor0[1]) / k))
        return place(img, SD[d], anchor0)
    if st in ('idle', 'walk') and f'{st}/{d}' in plan.get('frames', {}):
        cs = [cell(i) for i in plan['frames'][f'{st}/{d}']]; amp = plan.get('breath', {}).get(f'{st}/{d}')
        if amp:   # breathing on a near-still stretch: frame j is stretched up by amp·(1 − cos 2πj/n)/2 about the feet line
            n_ = len(cs); cs = [c_.transform((CW, CH), Image.AFFINE, (1, 0, 0, 0, 1 / k_, PY * (1 - 1 / k_)), resample=Image.BICUBIC)
                               for c_, k_ in ((c_, 1 + amp * (1 - math.cos(2 * math.pi * j / n_)) / 2) for j, c_ in enumerate(cs))]
        return cs, None
    if st in ('idle', 'walk'):
        if f'{st}/{d}' in plan.get('loop', {}): s0, P = plan['loop'][f'{st}/{d}']
        else: P = period([mask_small(f) for f in F], 20 if st == 'walk' else 16, 40 if st == 'walk' else 70) or len(F) // 2; s0 = 12
        n = 8 if st == 'walk' else 12; n = min(n, P)
        idx = [s0 + round(i * P / n) for i in range(n)]
        return [cell(i) for i in idx], P
    if st == 'attack':
        idx = plan['attack'][d]['frames']; return [cell(i) for i in idx], None
    if st == 'buff':
        idx = plan['buff'][d]['frames']; return [cell(i) for i in idx], None

def hurt_from(c, d):
    fx, fy = FWD[d]; side = abs(fx) > .5; bk = [-6, -10, -8, -5, -3, -1, 0]; F = []
    for v in bk:
        big = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); r = v * (1 if fx >= 0 else -1) if side else 0
        q = c.rotate(-r, resample=Image.BICUBIC, center=(PX, PY)) if r else c
        big.paste(q, (round(v * fx * .8), round(v * fy * .3)), q); F.append(big)
    return F

CELLS = {}
OM = dict({'b': 165, 'br': 60, 'bg': 15, 'g': 110, 'min': 40, 'r': -1}, **plan.get('orbMask', {}))
ORB_ALL = plan.get('orb') and plan.get('orbAll')
OPv = plan.get('orbPale'); OP = dict({'b': 205, 'g': 190, 'br': 8, 'gb': -4, 'min': 25}, **(OPv if isinstance(OPv, dict) else {})) if OPv else None
def orb_pick(m, mn, prev):
    lab, n = nd.label(m); best, bs = None, 0
    for i, sl in enumerate(nd.find_objects(lab)):
        hh, ww = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start; ar = (lab[sl] == i + 1).sum()
        asp = max(hh, ww) / max(1, min(hh, ww))
        if ar < mn or asp > 2.4: continue
        fill = ar / (hh * ww); cy, cx = nd.center_of_mass(lab == i + 1)
        sc = ar * fill ** 3 * (1 if asp <= 1.5 else .15) * (1 if cy < PY - HT * .3 else .1)   # the orb is round and held above the waist; rings round the feet are not
        if prev is not None: sc /= 1 + math.hypot(cx - prev[0], cy - prev[1]) / 60
        if sc > bs: bs = sc; best = (float(cx), float(cy))
    return best
def orb_at(c_, prev):
    """centre of the held orb / water burst in a placed cell: compact cyan-blue blob (rings and spray are thin or tiny);
    with "orbPale" a white / pale-blue glowing orb is tried when no blue one is found"""
    A = np.asarray(c_).astype(np.int16)
    m = (A[..., 3] > 120) & (A[..., 2] > OM['b']) & (A[..., 2] - A[..., 0] > OM['br']) & (A[..., 1] > OM['g']) & (A[..., 2] - A[..., 1] > OM['bg']) & (A[..., 0] > OM['r'])   # blue, not the teal gems
    best = orb_pick(m, OM['min'], prev)
    if best is None and OP:
        m = (A[..., 3] > 120) & (A[..., 2] > OP['b']) & (A[..., 1] > OP['g']) & (A[..., 2] - A[..., 0] >= OP['br']) & (A[..., 2] - A[..., 1] >= OP['gb'])
        best = orb_pick(m, OP['min'], prev)
    return best
BLADE = plan.get('blade')
def blades_at(c_):
    """dagger blades in a placed cell: violet obsidian (+ its lavender stripe) or near-neutral black pixels, long thin components;
    tip / base = the two ends of the main axis, base = the end with the gold guard next to it (else the end nearer the body)"""
    A = np.asarray(c_).astype(np.int16); R, G, B, a = A[..., 0], A[..., 1], A[..., 2], A[..., 3]; mx = A[..., :3].max(-1)
    m = (a > 120) & (B >= G + 4) & (B * 100 >= 55 * R) & (R >= G - 4) & (mx < 235)
    m |= (a > 120) & (mx < 75) & (B >= G - 3) & (R - G < 22) & (R >= G - 6)
    core = nd.binary_opening(m, iterations=1); lab, n = nd.label(m, structure=np.ones((3, 3)))
    gold = (a > 120) & (R > 170) & (G > 110) & (B < 100) & (R - B > 100); out = []
    for i in range(1, n + 1):
        comp = lab == i
        if (comp & core).sum() < BLADE.get('minA', 40): continue
        ys, xs = np.nonzero(comp); P_ = np.stack([xs, ys], 1).astype(float); mu = P_.mean(0)
        _, sv, vt = np.linalg.svd(P_ - mu, full_matrices=False); t = (P_ - mu) @ vt[0]; e0, e1 = P_[np.argmin(t)], P_[np.argmax(t)]
        if t.max() - t.min() < 14 or sv[0] / max(1e-3, sv[1]) < 1.6: continue
        gn = lambda p: gold[max(0, int(p[1]) - 9):int(p[1]) + 10, max(0, int(p[0]) - 9):int(p[0]) + 10].sum()
        g0, g1 = gn(e0), gn(e1); body = (PX, PY - HT * .6)
        if g0 != g1: tip, base = (e1, e0) if g0 > g1 else (e0, e1)
        else: tip, base = (e0, e1) if math.hypot(e0[0] - body[0], e0[1] - body[1]) > math.hypot(e1[0] - body[0], e1[1] - body[1]) else (e1, e0)
        out.append((float(tip[0]), float(tip[1]), float(base[0]), float(base[1])))
    return out
def blade_sockets(st, d):
    """one dagger per row: picked at a key frame by a rule (x = right-most tip, -x = left-most, up = highest tip, fwd = furthest
    along the facing), then followed frame by frame (nearest hand + tip); frames where it is hidden sit between their neighbours;
    "bladeFix" {frame: [head x, head y, grip x, grip y] | null} = read by eye in placed-cell px of this build"""
    F = CELLS[(st, d)]; C = [blades_at(c_) for c_ in F]; n = len(F)
    rule, k0 = (BLADE.get('pick', {}).get(f'{st}/{d}') or ['fwd' if st == 'attack' else 'up', meta['contact']['attack'][d] if st == 'attack' else meta['buffPeak'][d]])
    fx, fy = FWD[d]; score = {'x': lambda b: b[0], '-x': lambda b: -b[0], 'up': lambda b: -b[1], 'fwd': lambda b: b[0] * fx + b[1] * fy}[rule]
    pick = [None] * n; fix = BLADE.get('fix', {}).get(f'{st}/{d}', {})
    if C[k0]: pick[k0] = max(C[k0], key=score)
    for rng in (range(k0 + 1, n), range(k0 - 1, -1, -1)):
        prev = pick[k0]
        for i in rng:
            if C[i] and prev: pick[i] = min(C[i], key=lambda b: math.hypot(b[2] - prev[2], b[3] - prev[3]) + .5 * math.hypot(b[0] - prev[0], b[1] - prev[1]))
            elif C[i]: pick[i] = max(C[i], key=score)
            if pick[i]: prev = pick[i]
    for k, v in fix.items(): pick[int(k)] = tuple(v) if v else None
    known = [i for i, p in enumerate(pick) if p]
    for i in range(n):
        if pick[i] or not known: continue
        a_ = max((j for j in known if j < i), default=None); b_ = min((j for j in known if j > i), default=None)
        if a_ is not None and b_ is not None: t = (i - a_) / (b_ - a_); pick[i] = tuple(pick[a_][q] + (pick[b_][q] - pick[a_][q]) * t for q in range(4))
        else: pick[i] = pick[a_ if a_ is not None else b_]
    return [{'head': [round(p[0]), round(p[1])], 'grip': [round(p[2]), round(p[3])]} if p else {'head': [PX + 40, PY - 60], 'grip': [PX + 34, PY - 70]} for p in pick]
meta = {'cell': {'w': CW, 'h': CH}, 'pivot': {'x': PX, 'y': PY}, 'scale': .56, 'states': {}, 'sockets': ({'idle': {}, 'walk': {}, 'attack': {}, 'buff': {}, 'hurt': {}} if ORB_ALL else {'attack': {}, 'buff': {}}) if plan.get('orb') else ({'attack': {}, 'buff': {}} if BLADE or plan.get('axe') else {'attack': {}}),
        'contact': {'attack': {}}, 'mirror': {'SW': 'SE', 'W': 'E', 'NW': 'NE'}, 'qa': {}, 'buffPeak': {}}
atlas = {}; report = {}
for st in ['idle', 'walk', 'attack', 'buff', 'hurt']:
    rows = []; meta['states'][st] = {'loop': st in ('idle', 'walk'), 'dirs': {}}
    for d in DIRS:
        if st == 'hurt':
            F = hurt_from(frames_for('idle', d)[0][0], d); dur = plan.get('stateDur', {}).get(f'hurt/{d}', [70] * 7)
        else:
            F, P = frames_for(st, d)
            if st == 'idle': dur = [round(1000 * P / 24 / len(F))] * len(F) if P else [200] * len(F)
            elif st == 'walk': dur = [max(70, round(1000 * P / 24 / len(F)))] * len(F) if P else [100] * len(F)
            elif st == 'attack':
                c = plan['attack'][d]['contact']; n = len(F)
                dur = plan['attack'][d].get('dur') or [55 if i < c - 1 else 40 if i <= c + 1 else 75 for i in range(n)]
                meta['contact']['attack'][d] = c
            else:
                dur = plan['buff'][d].get('dur') or [70] * len(F); meta['buffPeak'][d] = plan['buff'][d]['peak']
            dur = plan.get('stateDur', {}).get(f'{st}/{d}', dur)
            assert len(dur) == len(F), f'{st}/{d}: {len(dur)} durations for {len(F)} frames'
            report[f'{st}/{d}'] = (len(F), P)
        if st in ('attack', 'buff') or ORB_ALL: CELLS[(st, d)] = F
        crops, rects = [], []
        for c_ in F:
            bb = bbox(c_) or (0, 0, 1, 1); bx, by, bw, bh = int(bb[0]), int(bb[1]), int(bb[2] - bb[0] + 1), int(bb[3] - bb[1] + 1)
            crops.append(c_.crop((bx, by, bx + bw, by + bh))); rects.append([bx, by, bw, bh])
        rows.append((d, crops, rects, dur))
    W = max(sum(c.width + 2 for c in r[1]) for r in rows); Hh = sum(max(c.height for c in r[1]) + 2 for r in rows)
    sheet = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); y = 0
    for d, crops, rects, dur in rows:
        x = 0; fl = []; hmax = max(c.height for c in crops)
        for c_, (bx, by, bw, bh) in zip(crops, rects):
            sheet.paste(c_, (x, y)); fl.append([x, y, bw, bh, bx, by, bw, bh]); x += c_.width + 2
        meta['states'][st]['dirs'][d] = {'dur': dur, 'f': fl}; y += hmax + 2
    bio = io.BytesIO(); sheet.save(bio, 'WEBP', quality=90, method=6); atlas[st] = 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode()
    if plan.get('orb') and (st in ('attack', 'buff') or ORB_ALL):
        for d in DIRS:
            o = []; prev = None; pts = [orb_at(c_, None) for c_ in CELLS[(st, d)]]
            for k, v in plan.get('orbFix', {}).get(f'{st}/{d}', {}).items(): pts[int(k)] = tuple(v) if v else None   # read by eye: placed-cell px of this build
            if plan.get('orbLerp'):   # a frame where the orb is hidden sits between the nearest frames where it is seen
                fd = [i for i, p in enumerate(pts) if p]; q = list(pts)
                for i, p in enumerate(pts):
                    if p or not fd: continue
                    a = max((j for j in fd if j < i), default=None); b = min((j for j in fd if j > i), default=None)
                    if a is not None and b is not None: t = (i - a) / (b - a); q[i] = (pts[a][0] + (pts[b][0] - pts[a][0]) * t, pts[a][1] + (pts[b][1] - pts[a][1]) * t)
                    else: q[i] = pts[a if a is not None else b]
                pts = q
            for i, p in enumerate(pts):   # a frame where the orb is hidden borrows its neighbour
                p = p or next((q for q in pts[i + 1:] if q), None) or next((q for q in reversed(pts[:i]) if q), None) or (PX + 30, PY - HT * .45)
                gx = p[0] + (8 if p[0] < PX else -8); o.append({'head': [round(p[0]), round(p[1])], 'grip': [round(gx), round(p[1] + 6)]})
            meta['sockets'][st][d] = o
        if st == 'buff': continue
    if BLADE and st in ('attack', 'buff'):
        for d in DIRS: meta['sockets'][st][d] = blade_sockets(st, d)
        continue
    if plan.get('axe') and st in ('attack', 'buff'):
        AX = dict({'b': 190, 'br': 45, 'g': 140, 'bg': 10, 'min': 40, 'grip': 28}, **plan['axe'])
        for d in DIRS:
            pts = []; prev = None
            for c_ in CELLS[(st, d)]:
                A = np.asarray(c_).astype(np.int16)
                m = (A[..., 3] > 120) & (A[..., 2] > AX['b']) & (A[..., 2] - A[..., 0] > AX['br']) & (A[..., 1] > AX['g']) & (A[..., 2] - A[..., 1] > AX['bg'])
                lab, n = nd.label(nd.binary_closing(m, iterations=2)); best, bs = None, 0
                for i in range(1, n + 1):
                    ar = int((lab == i).sum())
                    if ar < AX['min']: continue
                    cy, cx = nd.center_of_mass(lab == i); sc = ar / (1 + (math.hypot(cx - prev[0], cy - prev[1]) / 90 if prev else 0))
                    if sc > bs: bs, best = sc, (float(cx), float(cy))
                pts.append(best); prev = best or prev
            for k, v in plan.get('axeFix', {}).get(f'{st}/{d}', {}).items(): pts[int(k)] = tuple(v) if v else None
            fd = [i for i, p in enumerate(pts) if p]; q = list(pts)
            for i, p in enumerate(pts):
                if p or not fd: continue
                a = max((j for j in fd if j < i), default=None); b = min((j for j in fd if j > i), default=None)
                if a is not None and b is not None: t = (i - a) / (b - a); q[i] = (pts[a][0] + (pts[b][0] - pts[a][0]) * t, pts[a][1] + (pts[b][1] - pts[a][1]) * t)
                else: q[i] = pts[a if a is not None else b]
            o = []; chest = (PX, PY - HT * .55)
            for p in q:
                p = p or (PX + 40, PY - HT * .5); vx, vy = chest[0] - p[0], chest[1] - p[1]; L = math.hypot(vx, vy) or 1; g = min(AX['grip'], L * .45)
                o.append({'head': [round(p[0]), round(p[1])], 'grip': [round(p[0] + vx / L * g), round(p[1] + vy / L * g)]})
            meta['sockets'][st][d] = o
            print(f'  axe {st}/{d}: found {len(fd)}/{len(pts)}' + (f' — between neighbours: {[i for i, p in enumerate(pts) if not p]}' if len(fd) < len(pts) else ''))
    if st == 'attack' and not plan.get('orb') and not plan.get('axe'):
        for d in DIRS:
            fx, fy = FWD[d]; sgn = 1 if fx >= -.01 else -1; gx, gy = PX + 18 * sgn, PY - HT * .42; n = len(meta['states'][st]['dirs'][d]['f']); c = meta['contact']['attack'][d]; o = []
            for i in range(n):
                k = 0 if i < c else min(1, (i - c + 1) / 2)
                o.append({'head': [round(gx + (-34 * sgn) * (1 - k) + 62 * (fx if abs(fx) > .3 else sgn * .8) * k), round(gy - 52 * (1 - k) + (10 + 40 * fy) * k)], 'grip': [round(gx), round(gy)]})
            meta['sockets']['attack'][d] = o
CS = plan.get('cellScale')
if CS:   # the engine draws the sheet pixels into these bigger cell boxes (see the usage note)
    meta['cell'] = {'w': round(CW * CS), 'h': round(CH * CS)}; meta['pivot'] = {'x': round(PX * CS), 'y': round(PY * CS)}; meta['cellScale'] = CS
    for st_ in meta['states'].values():
        for v in st_['dirs'].values():
            for f in v['f']: f[4:8] = [round(f[4] * CS), round(f[5] * CS), round(f[6] * CS), round(f[7] * CS)]
    for st_ in meta['sockets'].values():
        for v in st_.values():
            for q in v:
                for kk in q: q[kk] = [round(q[kk][0] * CS), round(q[kk][1] * CS)]
open(out, 'w').write(f'/* {PFX} hero sprites — cut from video clips by tools/cliphero.py (green key, despill, speck removal). */\n'
                     f'const {PFX}_SPR_META={json.dumps(meta, separators=(",", ":"))};\nconst {PFX}_SPR_ATLAS={json.dumps(atlas)};\n')
print('ok', out, {k: len(v) // 1024 for k, v in atlas.items()}, 'KB'); print(report)
