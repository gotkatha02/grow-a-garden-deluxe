"""Boss / monster animations from several AI videos (solid green or magenta bg, same character, made from one master image)
-> one frame-grid .webp per animation + JSON meta for monster-sprites.js (CLIP section).
usage: vidclips.py SPEC.json
SPEC = {"out":"assets/monsters/fenrirBoss", "ref":"claw", "ref_h":220, "cols":8,
        "anims":{"idle":{"video":"...mp4","loop":1,"n":16},
                 "claw":{"video":"...mp4","from":12,"to":60,"step":2,"hit":32}, ...}}
 • Every clip is lined up on the reference clip's first frame (scale + feet + body centre), because the video tool
   sometimes frames the character bigger in one clip than another.
 • loop:1 -> finds the loop length (like vidwalk.py) and takes n evenly spaced frames from one loop.
 • from/to/step -> video frame range (24 fps). 'hit' (optional) -> video frame of the impact, stored as a frame index.
 • ref_h = stored height (px) of the reference idle body; everything is scaled by the same factor (never up).
 • Each animation gets its own tight cell; px,py = where the feet anchor sits inside that cell."""
import sys, json, subprocess, tempfile, glob, os, numpy as np
from PIL import Image
from scipy import ndimage as nd
spec = json.load(open(sys.argv[1]))
OUT = spec['out']; COLS = spec.get('cols', 8); DESPILL_ALL = spec.get('despill_all', 1); TH = spec.get('th', 8)

def frames_of(video):
    tmp = tempfile.mkdtemp(); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, tmp + '/f%04d.png'], check=True)
    return [np.asarray(Image.open(f).convert('RGB')).astype(np.float32) for f in sorted(glob.glob(tmp + '/f*.png'))]

def matte(im, key):
    MAG = key[1] < min(key[0], key[2]); r, g, b = im[..., 0], im[..., 1], im[..., 2]
    ex = (np.minimum(r, b) - g) if MAG else (g - np.maximum(r, b)); kx = (min(key[0], key[2]) - key[1]) if MAG else (key[1] - max(key[0], key[2]))
    a = np.clip(1 - (ex - TH) / (kx - TH), 0, 1); col = np.clip((im - (1 - a[..., None]) * key) / np.maximum(a, 1e-3)[..., None], 0, 255)
    rim = nd.binary_dilation(a < .98, iterations=3)
    if MAG:
        sp = rim & (np.minimum(col[..., 0], col[..., 2]) > col[..., 1] + 10)
        for c in (0, 2): col[..., c] = np.where(sp, np.minimum(col[..., c], col[..., 1] + 10), col[..., c])
    else:
        mx = np.maximum(col[..., 0], col[..., 2]); col[..., 1] = np.where(rim | (a < 1), np.minimum(col[..., 1], mx + 4), col[..., 1])
        if DESPILL_ALL:   # smoke / mist that is opaque enough to keep still carries the green: neutralise it everywhere (teal glow survives)
            g2 = np.minimum(col[..., 1], mx + 14); lum = col.mean(-1); hit = col[..., 1] > g2 + .5
            col[..., 1] = g2; col[hit] = col[hit] * .7 + lum[hit][:, None] * .3
            soft = a < .97; col[..., 1] = np.where(soft, np.minimum(col[..., 1], (col[..., 0] + col[..., 2]) / 2 + 6), col[..., 1])
    a[a < .1] = 0
    lab, n = nd.label(a > .3)
    if n > 1:
        sz = nd.sum(np.ones_like(a), lab, range(1, n + 1)); a[np.isin(lab, np.where(sz < 60)[0] + 1)] = 0
    return np.dstack([col, a * 255]).clip(0, 255).astype(np.uint8)

def body_box(rgba):
    m = rgba[..., 3] > 120; ys, xs = np.where(m)
    w = m.sum(0).astype(float); cx = (w * np.arange(m.shape[1])).sum() / w.sum()
    return ys.min(), ys.max() + 1, xs.min(), xs.max() + 1, cx

clips = {}
for name, a in spec['anims'].items():
    ims = frames_of(a['video']); key = np.median(np.concatenate([ims[0][:6].reshape(-1, 3), ims[0][:, :6].reshape(-1, 3), ims[0][:, -6:].reshape(-1, 3)]), 0)
    if a.get('loop'):
        masks = np.array([(i[..., 1] - np.maximum(i[..., 0], i[..., 2])) < 60 for i in ims])
        ys, xs = np.where(masks.any(0)); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        part = masks[:, y0:y1, x0:x1].reshape(len(ims), -1).astype(float)
        best = min(range(12, len(ims) // 2 + 1), key=lambda L: np.mean([np.abs(part[i] - part[i + L]).mean() for i in range(len(ims) - L)]))
        st = min(range(len(ims) - best), key=lambda i: np.abs(part[i] - part[i + best]).mean())
        pick = [st + round(i * best / a['n']) for i in range(a['n'])]; print(name, 'loop', best, 'start', st, file=sys.stderr)
    else:
        pick = list(range(a['from'], min(a['to'], len(ims) - 1) + 1, a.get('step', 2)))
    def fe(r):   # feather the video frame border: smoke that runs off the frame fades out instead of ending in a straight cut
        h, w = r.shape[:2]; F = 40; ry = np.clip(np.minimum(np.arange(h), h - 1 - np.arange(h)) / F, 0, 1); rx = np.clip(np.minimum(np.arange(w), w - 1 - np.arange(w)) / F, 0, 1)
        r = r.copy(); r[..., 3] = (r[..., 3] * np.minimum(ry[:, None], rx[None, :])).astype(np.uint8); return r
    clips[name] = dict(first=matte(ims[0], key), frames=[fe(matte(ims[i], key)) for i in pick], pick=pick, a=a)

# line every clip up on the reference clip's first frame
ry0, ry1, rx0, rx1, rcx = body_box(clips[spec['ref']]['first'])
idle_h = None
for name, c in clips.items():
    y0, y1, x0, x1, cx = body_box(c['first'])
    s = ((ry1 - ry0) / (y1 - y0) + (rx1 - rx0) / (x1 - x0)) / 2
    c['s'] = s; c['ox'] = rcx - cx * s; c['oy'] = ry1 - y1 * s       # video px -> reference px
    if name == 'idle': idle_h = (y1 - y0) * s
K = min(1.0, spec['ref_h'] / idle_h) if 'ref_h' in spec else 1.0      # reference px -> stored px
AX, AY = rcx, ry1                                                   # feet anchor in reference px
meta = dict(ref=round(idle_h * K))
for name, c in clips.items():
    k = c['s'] * K; placed = []
    for f in c['frames']:
        img = Image.fromarray(f); img = img.resize((max(1, round(img.width * k)), max(1, round(img.height * k))), Image.LANCZOS)
        X = (c['ox'] - AX) * K; Y = (c['oy'] - AY) * K                 # top-left of the video frame relative to the anchor (stored px)
        placed.append((np.asarray(img), X, Y))
    # tight union box around the anchor
    L = min(X + np.where(q[..., 3].any(0))[0].min() for q, X, Y in placed if q[..., 3].any())
    R = max(X + np.where(q[..., 3].any(0))[0].max() + 1 for q, X, Y in placed if q[..., 3].any())
    T = min(Y + np.where(q[..., 3].any(1))[0].min() for q, X, Y in placed if q[..., 3].any())
    B = max(Y + np.where(q[..., 3].any(1))[0].max() + 1 for q, X, Y in placed if q[..., 3].any())
    px, py = int(np.ceil(-L)) + 2, int(np.ceil(-T)) + 2; cw, ch = int(np.ceil(R - L)) + 4, int(np.ceil(B - T)) + 4
    n = len(placed); cols = min(COLS, n); rows = (n + cols - 1) // cols
    sheet = np.zeros((rows * ch, cols * cw, 4), np.uint8)
    for i, (q, X, Y) in enumerate(placed):
        gx, gy = (i % cols) * cw + px + int(round(X)), (i // cols) * ch + py + int(round(Y))
        sx0, sy0 = max(0, (i % cols) * cw - gx), max(0, (i // cols) * ch - gy)
        sx1, sy1 = min(q.shape[1], (i % cols + 1) * cw - gx), min(q.shape[0], (i // cols + 1) * ch - gy)
        if sx1 > sx0 and sy1 > sy0: sheet[gy + sy0:gy + sy1, gx + sx0:gx + sx1] = q[sy0:sy1, sx0:sx1]
    fn = OUT + '_' + name + '.webp'; Image.fromarray(sheet).save(fn, quality=88, method=6)
    a = c['a']; m = dict(f=os.path.basename(fn)[:-5], cw=cw, ch=ch, px=px, py=py, n=n, cols=cols, fps=a.get('fps', 12))
    if a.get('loop'): m['loop'] = 1
    if 'hit' in a: m['hit'] = int(np.argmin([abs(p - a['hit']) for p in c['pick']]))
    for extra in ('hold', 'beam'):
        if extra in a: m[extra] = [int(np.argmin([abs(p - v) for p in c['pick']])) for v in a[extra]]
    meta[name] = m; print(name, n, 'frames', cw, 'x', ch, sheet.shape[1], 'x', sheet.shape[0], os.path.getsize(fn) // 1024, 'KB', file=sys.stderr)
print(json.dumps(meta))
