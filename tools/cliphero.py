"""Hero sprite set from video clips (green background) -> assets_<id>.js (SPR_META/ATLAS schema, same as statichero.py).
usage: python3 -I tools/cliphero.py PLAN.json OUT.js PREFIX
PLAN.json: {"height":230, "flip":true, "clips":{"idle":{"S":"a.mp4",...}, "walk":{...}, "attack":{...}, "buff":{...}},
            "attack":{"S":{"frames":[...],"contact":5}, ...}, "buff":{"S":{"frames":[...],"peak":6}, ...},
            "normalize":["walk/S"]}   # clips whose size changes (character walks toward the camera) get each frame rescaled
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

def key(fr, flip=None):
    flip = FLIP if flip is None else flip
    im = fr.astype(np.float32)
    k = np.median(np.concatenate([im[:8].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)]), 0)
    ex = im[..., 1] - np.maximum(im[..., 0], im[..., 2]); kx = k[1] - max(k[0], k[2])
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
    H_, W_ = a.shape; m = 28; yy = np.minimum(np.arange(H_), H_ - 1 - np.arange(H_)); xx = np.minimum(np.arange(W_), W_ - 1 - np.arange(W_))
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

CACHE = {}
FLIPDIRS = set(plan.get('flipDirs', DIRS if FLIP else []))
def clip(path, d='S'):
    k = (path, d in FLIPDIRS)
    if k not in CACHE: CACHE[k] = [key(f, d in FLIPDIRS) for f in read(path)]
    return CACHE[k]

# one global scale from the front idle pose
ref = clip(plan['clips']['idle']['S'], 'S')[0]; b = bbox(ref); S0 = HT / (b[3] - b[1])
# perDir: every direction is scaled so its own idle pose is HT tall (clips filmed at slightly different zoom per direction)
SD = {}
for _d in DIRS:
    if plan.get('perDir'):
        _b = bbox(clip(plan['clips']['idle'][_d], _d)[0]); SD[_d] = HT / (_b[3] - _b[1])
    else: SD[_d] = S0

def frames_for(st, d):
    path = plan['clips'][st][d]; F = clip(path, d); norm = f'{st}/{d}' in plan.get('normalize', [])
    anchor0 = feet(F[0])
    def cell(i):
        img = F[i]
        if norm:
            bb = bbox(img); s = HT / (bb[3] - bb[1]); return place(img, s, feet(img))
        return place(img, SD[d], anchor0)
    if st in ('idle', 'walk'):
        P = period([mask_small(f) for f in F], 20 if st == 'walk' else 16, 40 if st == 'walk' else 70) or len(F) // 2
        n = 8 if st == 'walk' else 12; n = min(n, P); s0 = 12
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

meta = {'cell': {'w': CW, 'h': CH}, 'pivot': {'x': PX, 'y': PY}, 'scale': .56, 'states': {}, 'sockets': {'attack': {}},
        'contact': {'attack': {}}, 'mirror': {'SW': 'SE', 'W': 'E', 'NW': 'NE'}, 'qa': {}, 'buffPeak': {}}
atlas = {}; report = {}
for st in ['idle', 'walk', 'attack', 'buff', 'hurt']:
    rows = []; meta['states'][st] = {'loop': st in ('idle', 'walk'), 'dirs': {}}
    for d in DIRS:
        if st == 'hurt':
            F = hurt_from(frames_for('idle', d)[0][0], d); dur = [70] * 7
        else:
            F, P = frames_for(st, d)
            if st == 'idle': dur = [round(1000 * P / 24 / len(F))] * len(F)
            elif st == 'walk': dur = [max(70, round(1000 * P / 24 / len(F)))] * len(F)
            elif st == 'attack':
                c = plan['attack'][d]['contact']; n = len(F)
                dur = [55 if i < c - 1 else 40 if i <= c + 1 else 75 for i in range(n)]
                meta['contact']['attack'][d] = c
            else:
                dur = [70] * len(F); meta['buffPeak'][d] = plan['buff'][d]['peak']
            report[f'{st}/{d}'] = (len(F), P)
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
    if st == 'attack':
        for d in DIRS:
            fx, fy = FWD[d]; sgn = 1 if fx >= -.01 else -1; gx, gy = PX + 18 * sgn, PY - HT * .42; n = len(meta['states'][st]['dirs'][d]['f']); c = meta['contact']['attack'][d]; o = []
            for i in range(n):
                k = 0 if i < c else min(1, (i - c + 1) / 2)
                o.append({'head': [round(gx + (-34 * sgn) * (1 - k) + 62 * (fx if abs(fx) > .3 else sgn * .8) * k), round(gy - 52 * (1 - k) + (10 + 40 * fy) * k)], 'grip': [round(gx), round(gy)]})
            meta['sockets']['attack'][d] = o
open(out, 'w').write(f'/* {PFX} hero sprites — cut from video clips by tools/cliphero.py (green key, despill, speck removal). */\n'
                     f'const {PFX}_SPR_META={json.dumps(meta, separators=(",", ":"))};\nconst {PFX}_SPR_ATLAS={json.dumps(atlas)};\n')
print('ok', out, {k: len(v) // 1024 for k, v in atlas.items()}, 'KB'); print(report)
