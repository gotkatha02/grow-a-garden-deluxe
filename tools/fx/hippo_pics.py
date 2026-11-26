"""Cut the owner's two painted gods for the hippo's ultimates (2026-11-26, prompts in HIPPO_FX_PLAN_TH.md).

  python3 -I tools/fx/hippo_pics.py TAWERET.png HAPI.png [preview=PNG]

Both inputs are real transparent PNGs (ChatGPT), one god each (the originals are kept as assets/fx/hippo/raw/hp_*_src.webp). Output: assets/fx/hippo/hp_taweret.webp + hp_hapi.webp
(trimmed, 6 px pad, scale S) and the anchor table printed as JS for hippo_vfx.js (GOD), in OUTPUT picture pixels:
  taweret  foot = the middle of her belt, just above its bottom edge = the ground line she rises through
  hapi     foot = the water line across his waist wrap (he stands in the flood up to here; below it is clipped),
           jarL / jarR = where the water leaves each jar (the lower middle of the dark opening), jw = opening width
The anchors are measured on the ORIGINAL pictures of 2026-11-26 (TAW / HAP below). The jar openings are found again
by a flood fill of the dark-brown inside from a seed point, so a slightly different picture still lands on the
opening; a redrawn picture needs the numbers checked on the preview."""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageDraw

S = 0.5
OUT = 'assets/fx/hippo/'
PAD = 6
TAW = {'foot': (567, 1318)}
HAP = {'foot': (627, 1140), 'seedL': (225, 730), 'seedR': (1018, 730)}


def rgba(p):
    return np.asarray(Image.open(p).convert('RGBA')).copy()


def bbox(a, thr=6):
    ys, xs = np.nonzero(a[..., 3] > thr)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def crop_save(a, name):
    x0, y0, x1, y1 = bbox(a)
    x0 = max(0, x0 - PAD); y0 = max(0, y0 - PAD); x1 = min(a.shape[1], x1 + PAD); y1 = min(a.shape[0], y1 + PAD)
    im = Image.fromarray(a[y0:y1, x0:x1])
    w, h = round((x1 - x0) * S), round((y1 - y0) * S)
    im = im.resize((w, h), Image.LANCZOS)
    im.save(OUT + name + '.webp', 'WEBP', quality=86, alpha_quality=90, method=6)
    return (x0, y0, w, h), im


def pt(p, org):
    return [round(float(p[0] - org[0]) * S, 1), round(float(p[1] - org[1]) * S, 1)]


def opening(a, seed, tol=38):
    """the dark inside of a jar opening: flood fill of colours near the seed's colour"""
    sx, sy = seed
    c0 = a[sy, sx, :3].astype(int)
    if not (c0[0] > c0[1] > c0[2] and c0[0] < 170):
        print('WARNING: seed', seed, 'is not dark brown', c0, '- check the preview')
    H, W = a.shape[:2]
    seen = np.zeros((H, W), bool)
    q = deque([(sx, sy)]); seen[sy, sx] = True; pts = []
    while q:
        x, y = q.popleft(); pts.append((x, y))
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not seen[ny, nx] and a[ny, nx, 3] > 200 \
                    and np.abs(a[ny, nx, :3].astype(int) - c0).max() < tol:
                seen[ny, nx] = True; q.append((nx, ny))
    p = np.array(pts)
    x0, x1, y0, y1 = p[:, 0].min(), p[:, 0].max(), p[:, 1].min(), p[:, 1].max()
    # the water leaves from the lower middle of the opening (the jars lean forward: the lower lip is nearest the viewer)
    return (float(p[:, 0].mean()), float(y0 + (y1 - y0) * .78)), float(x1 - x0)


def main():
    args = [a for a in sys.argv[1:] if '=' not in a]
    kw = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
    if len(args) != 2:
        print(__doc__); sys.exit(1)
    ta, ha = rgba(args[0]), rgba(args[1])
    (tx, ty, tw, th), tim = crop_save(ta, 'hp_taweret')
    (hx, hy, hw, hh), him = crop_save(ha, 'hp_hapi')
    jl, wl = opening(ha, HAP['seedL'])
    jr, wr = opening(ha, HAP['seedR'])
    G = {
        'taweret': {'w': tw, 'h': th, 'foot': pt(TAW['foot'], (tx, ty))},
        'hapi': {'w': hw, 'h': hh, 'foot': pt(HAP['foot'], (hx, hy)), 'jarL': pt(jl, (hx, hy)), 'jarR': pt(jr, (hx, hy)),
                 'jw': round((wl + wr) / 2 * S, 1)},
    }
    js = 'const GOD=' + str(G).replace("'", '').replace(' ', '') + ';'
    print(js)
    if 'preview' in kw:
        W = tim.width + him.width + 60
        Hh = max(tim.height, him.height) + 40
        bg = Image.new('RGBA', (W, Hh), (60, 70, 80, 255))
        d0 = ImageDraw.Draw(bg)
        for y in range(0, Hh, 20):
            for x in range(0, W, 20):
                if (x // 20 + y // 20) % 2:
                    d0.rectangle([x, y, x + 19, y + 19], fill=(80, 90, 100, 255))
        bg.alpha_composite(tim, (20, 20)); bg.alpha_composite(him, (40 + tim.width, 20))
        d = ImageDraw.Draw(bg)

        def mark(p, ox, col):
            x, y = p[0] + ox, p[1] + 20
            d.ellipse([x - 5, y - 5, x + 5, y + 5], outline=col, width=2)
            d.line([x - 12, y, x + 12, y], fill=col)
        mark(G['taweret']['foot'], 20, (255, 60, 60))
        d.line([20, G['taweret']['foot'][1] + 20, 20 + tim.width, G['taweret']['foot'][1] + 20], fill=(255, 60, 60))
        o = 40 + tim.width
        mark(G['hapi']['foot'], o, (255, 60, 60))
        d.line([o, G['hapi']['foot'][1] + 20, o + him.width, G['hapi']['foot'][1] + 20], fill=(80, 200, 255))
        mark(G['hapi']['jarL'], o, (255, 255, 0)); mark(G['hapi']['jarR'], o, (255, 255, 0))
        bg.convert('RGB').save(kw['preview'], quality=88)
        print('preview', kw['preview'])


if __name__ == '__main__':
    main()
