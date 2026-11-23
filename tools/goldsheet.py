"""Gold-frame skill-icon sheet (dark sheet colour, 4 x 3 rounded tiles) -> one square icon per tile.
usage: python3 -I tools/goldsheet.py SHEET OUTDIR key1,key2,... [size=128] [preview=PNG]
  keys in reading order (left -> right, top -> bottom); '-' skips a tile; a key may hold a sub folder ('buff/wkRp').
  Writes OUTDIR/<key>.webp (RGBA, transparent outside the rounded frame).

ChatGPT draws the tiles a little wider than tall (about 370 x 330 on a 1536 x 1024 sheet) even when the prompt asks
for squares. Nothing is squashed: the square is built from the tile's own frame (its left and right halves joined,
the straight top / bottom gold bars cross-faded where they meet) and the inside is filled with a CENTRE crop of the
art, narrowed by at most 5 % (SQ=.95, env) so less of the sides is lost (row 1: ~12 px a side of 370, row 3: ~2 px).
A tile taller than wide is handled the same way, turned.
The sheet colour outside the rounded frame becomes transparent (flood fill from the corners, colour unmixed)."""
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage as nd
SQ = float(os.environ.get('SQ', '.95'))

def tiles_of(im, bg):
    d = np.abs(im - bg).max(-1)
    fg = nd.binary_closing(d > 45, iterations=2)
    lab, n = nd.label(fg)
    sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
    big = [i + 1 for i in np.argsort(sizes)[::-1] if sizes[i] > fg.size * .02]
    boxes = []
    for k in big:
        ys, xs = np.where(lab == k)
        boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    # a glow or a stray stroke can bridge the gap between two tiles: split boxes that are about 2 tiles wide / tall
    raw = d > 45
    for ax in (0, 1):
        sz = sorted(b[2] - b[0] if ax == 0 else b[3] - b[1] for b in boxes); med = sz[len(sz) // 2]
        out = []
        for b in boxes:
            x0, y0, x1, y1 = b; L = (x1 - x0) if ax == 0 else (y1 - y0); k = int(round(L / med))
            if k < 2 or L < med * 1.6: out.append(b); continue
            prof = raw[y0:y1, x0:x1].mean(0 if ax == 0 else 1); cuts = [0]
            for j in range(1, k):
                c = int(L * j / k); w = int(med * .15)
                cuts.append(c - w + int(np.argmin(prof[c - w:c + w])))
            cuts.append(L)
            for a0, a1 in zip(cuts, cuts[1:]):
                sub = raw[y0:y1, x0 + a0:x0 + a1] if ax == 0 else raw[y0 + a0:y0 + a1, x0:x1]
                cs = np.where(sub.mean(0) > .3)[0]; rs = np.where(sub.mean(1) > .3)[0]
                if ax == 0: out.append((x0 + a0 + cs.min(), y0, x0 + a0 + cs.max() + 1, y1))
                else: out.append((x0, y0 + a0 + rs.min(), x1, y0 + a0 + rs.max() + 1))
        boxes = out
    # tighten every box to the frame itself: the frame's sides fill (almost) whole columns / rows, a glow or a
    # stroke poking out of the frame does not (else the joined frame would be shifted inside the icon)
    tight = []
    for x0, y0, x1, y1 in boxes:
        sub = raw[y0:y1, x0:x1]
        cs = np.where(sub.mean(0) > .5)[0]; rs = np.where(sub.mean(1) > .5)[0]
        tight.append((x0 + cs.min(), y0 + rs.min(), x0 + cs.max() + 1, y0 + rs.max() + 1))
    boxes = tight
    # reading order: rows by centre y (tiles of a row share most of their height), then x
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows, cur = [], []
    for b in boxes:
        if cur and (b[1] + b[3]) / 2 - (cur[0][1] + cur[0][3]) / 2 > (cur[0][3] - cur[0][1]) * .5:
            rows.append(cur); cur = []
        cur.append(b)
    if cur: rows.append(cur)
    return [b for r in rows for b in sorted(r)]

def gold(px):
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    return (r > 140) & (g > 85) & (b < 120) & (r - b > 70)

def inner_edge(line, cap):
    """distance from the outer edge to the art along one scan line (outer outline, gold bar, inner outline)"""
    g = gold(line); lum = line.mean(-1)
    i = 0
    while i < cap and not g[i]: i += 1               # outer dark outline
    if i >= cap: return None
    while i < cap and (g[i] or lum[i] > 150): i += 1  # the gold bar (+ its highlights)
    j = i
    while j < min(cap, i + 7) and lum[j] < 105: j += 1  # inner dark outline
    return j if j < cap else None

def frame_inset(t):
    H, W, _ = t.shape; cap = int(min(H, W) * .12); v = []
    for y in range(int(H * .3), int(H * .7), 3):
        for line in (t[y], t[y, ::-1]):
            e = inner_edge(line, cap)
            if e: v.append(e)
    for x in range(int(W * .3), int(W * .7), 3):
        for line in (t[:, x], t[::-1, x]):
            e = inner_edge(line, cap)
            if e: v.append(e)
    return float(np.median(v)) if v else min(H, W) * .055

def outer_radius(fgm):
    H, W = fgm.shape; xs = []
    for y in range(min(H, 120)):
        c = np.where(fgm[y])[0]; xs.append(c.min() if len(c) else W)
    xs = np.array(xs); m = xs.min()
    hit = np.where(xs <= m + 1)[0]
    return float(hit[0]) if len(hit) else 30.0

def rrect_alpha(S, inset, rad):
    """anti-aliased mask of a rounded rectangle inset by `inset` px inside an S x S box"""
    yy, xx = np.mgrid[0:S, 0:S] + .5
    c = S / 2; half = S / 2 - inset
    qx = np.abs(xx - c) - (half - rad); qy = np.abs(yy - c) - (half - rad)
    sd = np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - rad
    return np.clip(.5 - sd, 0, 1)

def square_icon(t, bg):
    """t = one tile (H x W x 3, float). Returns an S x S x 4 float image."""
    H, W, _ = t.shape
    turned = H > W
    if turned: t = t.transpose(1, 0, 2); H, W = W, H
    S = H; ex = W - S
    d = np.abs(t - bg).max(-1); fgm = d > 45
    T = frame_inset(t); Ro = outer_radius(fgm)
    hL = S // 2; b = max(4, min(14, S // 24))
    F = np.empty((S, S, 3), np.float32)
    F[:, :hL - b] = t[:, :hL - b]
    F[:, hL + b:] = t[:, hL + b + ex:]
    w = np.linspace(0, 1, 2 * b)[None, :, None]
    F[:, hL - b:hL + b] = t[:, hL - b:hL + b] * (1 - w) + t[:, hL - b + ex:hL + b + ex] * w
    # art: a centre crop up to S / SQ wide, narrowed to S (SQ = .95 → at most 5 % thinner, invisible; keeps more of the sides)
    Wc = int(round(min(W, S / SQ))); off = (W - Wc) // 2
    A = t[:, off:off + Wc]
    if Wc != S:
        A = np.asarray(Image.fromarray(np.clip(A, 0, 255).astype(np.uint8)).resize((S, S), Image.LANCZOS)).astype(np.float32)
    m = rrect_alpha(S, T, max(6.0, Ro - T * .8))[..., None]
    out = F * (1 - m) + A * m
    # sheet colour outside the rounded frame -> transparent
    dd = np.abs(out - bg).max(-1); cand = dd < 70
    lab, _ = nd.label(cand)
    cs = {lab[0, 0], lab[0, -1], lab[-1, 0], lab[-1, -1]} - {0}
    region = np.isin(lab, list(cs))
    region = nd.binary_dilation(region, iterations=1) & (dd < 90)
    a = np.where(region, np.clip((dd - 22) / (70 - 22), 0, 1), 1.0)
    col = np.where((a < 1)[..., None], np.clip((out - (1 - a[..., None]) * bg) / np.maximum(a, 1e-3)[..., None], 0, 255), out)
    img = np.dstack([col, a * 255])
    if turned: img = img.transpose(1, 0, 2)
    return img, dict(T=round(T, 1), Ro=round(Ro, 1), S=S, ex=ex)

def save_icon(img, path, size):
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA').convert('RGBa')
    im = im.resize((size, size), Image.LANCZOS).convert('RGBA')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'WEBP', quality=90, method=6)
    return im

if __name__ == '__main__':
    src, outdir, keys = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    size = 128; prev = None
    for a in sys.argv[4:]:
        if a.startswith('preview='): prev = a.split('=', 1)[1]
        else: size = int(a)
    im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    bd = np.concatenate([im[:3].reshape(-1, 3), im[-3:].reshape(-1, 3), im[:, :3].reshape(-1, 3), im[:, -3:].reshape(-1, 3)])
    bg = np.median(bd, 0)
    boxes = tiles_of(im, bg)
    assert len(boxes) == len(keys), f'{len(boxes)} tiles found, {len(keys)} keys given'
    shots = []
    for (x0, y0, x1, y1), k in zip(boxes, keys):
        if k == '-': continue
        img, info = square_icon(im[y0:y1, x0:x1], bg)
        shots.append(save_icon(img, os.path.join(outdir, k + '.webp'), size))
        print(f'{k:24s} tile {x1 - x0}x{y1 - y0} at {x0},{y0}  inset {info["T"]}  outer r {info["Ro"]}')
    if prev and shots:
        c = 6; pad = 8; n = len(shots); r = (n + c - 1) // c
        sh = Image.new('RGBA', (c * (size + pad) + pad, r * (size + pad) + pad), (70, 92, 70, 255))
        for i, s in enumerate(shots): sh.alpha_composite(s, (pad + (i % c) * (size + pad), pad + (i // c) * (size + pad)))
        sh.save(prev)
