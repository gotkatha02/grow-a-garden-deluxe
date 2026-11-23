"""Placeholder hero sprite set from ONE turnaround image (green background) -> assets_<id>.js (SPR_META/ATLAS schema).
usage: statichero.py TURNAROUND.png OUT.js PREFIX "S,SE,E,NE,N pose indices" [height_px=230] [timing=ATLAS.js]
Poses are found as the big shapes on the sheet, read left->right, top->bottom (index 0..7).
Each state is made by moving the still pose (bob, lean, squash/stretch) — swap in real clip sprites later
(same schema as assets_owl.js, so nothing else has to change).
timing=ATLAS.js (2026-11-23, the drake): copy that atlas's frame counts, frame times, attack contact frames and buff peaks
per direction (attack directions through its atkRemap, the engine default NE->E when it has none) and fit the moves
around them — a hero tuned while wearing another hero's sprite keeps every hit / release time (no re-bench needed)."""
import sys, io, json, base64, math, re, numpy as np
from PIL import Image
from scipy import ndimage as nd
src, out, PFX, order = sys.argv[1], sys.argv[2], sys.argv[3], [int(x) for x in sys.argv[4].split(',')]
HT = 230; TM = None
for a in sys.argv[5:]:
    if a.startswith('timing='):
        t = open(a[7:]).read(); TM = json.loads(re.search(r'const [A-Z_]*SPR_META=(\{.*?\});\n', t).group(1))
    else: HT = int(a)
CW, CH, PX, PY = 498, 466, 248, 405
DIRS = ['S', 'SE', 'E', 'NE', 'N']
FWD = {'S': (0, 1), 'SE': (.8, .45), 'E': (1, 0), 'NE': (.8, -.45), 'N': (0, -1)}

im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
key = np.median(np.concatenate([im[:6].reshape(-1, 3), im[:, :6].reshape(-1, 3)]), 0)
ex = im[..., 1] - np.maximum(im[..., 0], im[..., 2]); kx = key[1] - max(key[0], key[2])
a = np.clip(1 - (ex - 20) / (kx - 20), 0, 1)
col = np.clip((im - (1 - a[..., None]) * key) / np.maximum(a, 1e-3)[..., None], 0, 255)
mx = np.maximum(col[..., 0], col[..., 2]); col[..., 1] = np.where(a < 1, np.minimum(col[..., 1], mx + 4), col[..., 1])
a[a < .06] = 0
rgba = np.dstack([col, a * 255]).astype(np.uint8)
lab, n = nd.label(nd.binary_dilation(a > .3, iterations=6))
objs = [(sl, int((lab[sl] == i + 1).sum()), i + 1) for i, sl in enumerate(nd.find_objects(lab))]
objs = [o for o in objs if o[1] > 20000]
objs.sort(key=lambda o: (o[0][0].start // 300, o[0][1].start))
poses = []
for sl, _, k in objs:
    p = rgba[sl].copy(); p[..., 3] = p[..., 3] * (lab[sl] == k)
    ys, xs = np.where(p[..., 3] > 40); p = p[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    poses.append(Image.fromarray(p))
H0 = np.median([p.height for p in poses]); s = HT / H0
poses = [p.resize((round(p.width * s), round(p.height * s)), Image.LANCZOS) for p in poses]

def feet(p):  # foot centre: centre of the lowest 8% of opaque pixels
    A = np.asarray(p)[..., 3] > 60; ys, xs = np.where(A); lo = ys.max() - int(p.height * .08)
    return float(xs[ys >= lo].mean()), float(ys.max())

def frame(p, sx=1, sy=1, rot=0, dx=0, dy=0):
    """pose -> full cell RGBA, feet at pivot (+dx,dy); rot in degrees, + = leans toward screen right."""
    fx, fy = feet(p); q = p.resize((max(1, round(p.width * sx)), max(1, round(p.height * sy))), Image.LANCZOS)
    fx, fy = fx * sx, fy * sy
    big = Image.new('RGBA', (CW * 2, CH * 2), (0, 0, 0, 0)); ox, oy = CW - fx, CH - fy
    big.paste(q, (round(ox), round(oy)), q)
    if rot: big = big.rotate(-rot, resample=Image.BICUBIC, center=(CW, CH))
    cell = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    cell.paste(big, (round(PX + dx - CW), round(PY + dy - CH)), big)
    return cell

PEAK0 = {'E': 7, 'S': 7, 'NE': 7, 'N': 7, 'SE': 3}          # the engine's BUFF_PEAK when an atlas has none
REMAP = ({'NE': 'E', 'NW': 'W'} if TM.get('atkRemap') is None else TM['atkRemap']) if TM else {}
def tsrc(st, d):
    sd = REMAP.get(d, d) if st == 'attack' else d
    return TM.get('mirror', {}).get(sd, sd)
def tdur(st, d):
    D = TM['states'][st]['dirs']; return list((D.get(tsrc(st, d)) or D['S'])['dur'])
def nfr(st, d, own): return len(tdur(st, d)) if TM else own
def kc(d): return TM['contact']['attack'][tsrc('attack', d)] if TM else 8          # attack contact frame
def kp(d): return (TM.get('buffPeak') or PEAK0)[d] if TM else 7                   # buff peak frame
def rs(vals, n):
    if n <= 1: return [vals[-1]] * max(n, 0)
    return list(np.interp(np.linspace(0, len(vals) - 1, n), np.arange(len(vals)), vals))
LEAN = [0, -2, -4, -6, -7, -8, -8, -6, 11, 9, 4, 1]; PUSH = [0, -1, -2, -3, -4, -5, -5, -3, 13, 11, 5, 1]
SQ = [1, 1, .99, .98, .97, .965, .96, .97, 1.03, 1.02, 1.01, 1]; UP = [0, 1, 2, 4, 6, 8, 10, 12, 10, 6, 3, 0]; BK = [-6, -10, -8, -5, -3, -1, 0]
def keyed(arr, at, n, c):    # wind-up part (before index `at`) fitted to c frames, the rest to n - c frames
    return rs(arr[:at], c) + rs(arr[at:], n - c)

def anim(d, st):
    p = poses[order[DIRS.index(d)]]; fx, fy = FWD[d]; side = abs(fx) > .5; F = []
    if st == 'idle':
        n = nfr(st, d, 12)
        for i in range(n):
            w = math.sin(i / n * math.tau); F.append(frame(p, 1 - .006 * w, 1 + .014 * w))
    elif st == 'walk':
        n = nfr(st, d, 8)
        for i in range(n):
            ph = i / n * math.tau
            F.append(frame(p, 1 + .01 * math.cos(2 * ph), 1 - .02 * math.cos(2 * ph), rot=(math.sin(ph) * 3 if side else math.sin(ph) * 1.5), dy=-abs(math.sin(ph)) * 7))
    elif st == 'attack':
        n, c = nfr(st, d, 12), kc(d); lean, push, sq = keyed(LEAN, 8, n, c), keyed(PUSH, 8, n, c), keyed(SQ, 8, n, c)
        for i in range(n):
            r = lean[i] * (1 if fx >= 0 else -1) if side else lean[i] * .3
            F.append(frame(p, 2 - sq[i], sq[i], rot=r, dx=push[i] * fx, dy=push[i] * fy * .45))
    elif st == 'buff':
        n, pk = nfr(st, d, 12), kp(d); up = rs(UP[:8], pk + 1) + rs(UP[7:], n - pk)[1:]
        for i in range(n): F.append(frame(p, 1 - up[i] * .002, 1 + up[i] * .004, dy=-up[i] * .8))
    elif st == 'hurt':
        bk = rs(BK, nfr(st, d, 7))
        for b_ in bk: F.append(frame(p, 1, 1 + b_ * .003, rot=(b_ * (1 if fx >= 0 else -1) if side else 0), dx=b_ * fx * .8, dy=b_ * fy * .3))
    return F

DUR = {'idle': [190] * 12, 'walk': [110] * 8, 'attack': [60] * 8 + [70, 80, 90, 100], 'buff': [80] * 12, 'hurt': [70] * 7}
meta = {'cell': {'w': CW, 'h': CH}, 'pivot': {'x': PX, 'y': PY}, 'scale': .56, 'states': {}, 'sockets': {'attack': {}},
        'contact': {'attack': {d: kc(d) for d in DIRS}}, 'mirror': {'SW': 'SE', 'W': 'E', 'NW': 'NE'}, 'qa': {}, 'buffPeak': {d: kp(d) for d in DIRS}}
atlas = {}
for st in ['idle', 'walk', 'attack', 'buff', 'hurt']:
    rows = []; meta['states'][st] = {'loop': st in ('idle', 'walk'), 'dirs': {}}
    for d in DIRS:
        F = anim(d, st); rects = []; crops = []
        for c in F:
            A = np.asarray(c)[..., 3] > 8; ys, xs = np.where(A); bx, by, bw, bh = int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)
            crops.append(c.crop((bx, by, bx + bw, by + bh))); rects.append([bx, by, bw, bh])
        rows.append((d, crops, rects))
    W = max(sum(c.width + 2 for c in r[1]) for r in rows); Hh = sum(max(c.height for c in r[1]) + 2 for r in rows)
    sheet = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); y = 0
    for d, crops, rects in rows:
        x = 0; fl = []; hmax = max(c.height for c in crops)
        for c, (bx, by, bw, bh) in zip(crops, rects):
            sheet.paste(c, (x, y)); fl.append([x, y, bw, bh, bx, by, bw, bh]); x += c.width + 2
        meta['states'][st]['dirs'][d] = {'dur': tdur(st, d) if TM else DUR[st], 'f': fl}; y += hmax + 2
    b = io.BytesIO(); sheet.save(b, 'WEBP', quality=90, method=6); atlas[st] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    if st == 'attack':
        for d in DIRS:
            fx, fy = FWD[d]; sgn = 1 if fx >= -.01 else -1; gx, gy = PX + 18 * sgn, PY - HT * .42; out_ = []
            c = kc(d)
            for i in range(nfr('attack', d, 12)):
                k = 0 if i < c else min(1, (i - c + 1) / 2)
                hx = gx + (-34 * sgn) * (1 - k) + (62 * (fx if abs(fx) > .3 else sgn * .8)) * k
                hy = gy - 52 * (1 - k) + (10 + 40 * fy) * k
                out_.append({'head': [round(hx), round(hy)], 'grip': [round(gx), round(gy)]})
            meta['sockets']['attack'][d] = out_
open(out, 'w').write(f'/* {PFX} placeholder sprites — made by tools/statichero.py from one turnaround image (swap for clip sprites later). */\n'
                     f'const {PFX}_SPR_META={json.dumps(meta, separators=(",", ":"))};\nconst {PFX}_SPR_ATLAS={json.dumps(atlas)};\n')
print('ok', out, {k: len(v) // 1024 for k, v in atlas.items()}, 'KB')
