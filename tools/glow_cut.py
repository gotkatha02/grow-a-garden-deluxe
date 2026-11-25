#!/usr/bin/env python3
"""Cut ONE painted effect off a flat green (or magenta) background and keep its soft glow as light.

  python3 -I tools/glow_cut.py IN.png OUT.webp [long=512] [q=90] [pad=6] [tol=8] [gt=70] [gd=0] [bg=auto|g|m] [preview=PNG] [debug=PNG]

Made for effect paintings that ChatGPT draws with a big soft glow on #00FF00 (the jaguar's spirit paw, blood moon,
black sun, 2026-11-25). The plain green keyers (companion_cut / hat_cut: alpha from 'how much greener than red / blue')
turn a RED or ORANGE glow on green into an olive fringe, because half red + half green still looks mostly green-free.
Here:
  1. background = every pixel that still holds green (G − max(R,B) > tol), flood-filled from the picture edge, plus
     enclosed pockets that hold pure background (between legs, inside a curl); then carried on through the olive middle
     of a red / orange glow: pixels that still hold some key and un-mix to the same colour as the glow next to them
     (colour distance < gt), at most gd px deep (0 = 3.2 % of the picture's short side); a dark outline, a rim light or
     the art itself un-mixes to another colour and stops it;
  2. inside that region each pixel is un-mixed against pure green with the SMALLEST alpha that keeps the colour in range
     (pixel = a·F + (1 − a)·key): a red glow pixel (128,158,0) → F (255,62,0) at alpha .5 instead of an opaque olive;
     except the anti-aliased rim of a solid outline (a few px from the body, explained by 'body colour + key'), which keeps
     the body's own colour — else a brown outline turns into a thin red line; very faint pixels take the colour of the
     nearest stronger glow, so the outer haze has one clean colour;
  3. everything the flood never reached (the painted body, its dark outlines, turquoise gems inside the art) stays
     opaque and untouched, with a light green despill on the few pixels that touch the background;
  4. trimmed to the visible glow + pad, scaled so the long side = long (premultiplied, no dark rims), saved as webp.
Prints the picture size and the BODY box (opaque painted part, glow excluded) as fractions of the output picture, so
code can line the painting up with the piece it replaces.
"""
import sys, json
import numpy as np
from PIL import Image
from scipy import ndimage


def cut(rgb, tol=8.0, bg='auto', gt=70.0, gd=0):
    a = rgb.astype(np.float32)
    H, W, _ = a.shape
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    med = np.median(edge, 0)
    if bg == 'auto':
        bg = 'm' if min(med[0], med[2]) > med[1] + 60 else 'g'
    if bg == 'm':
        dom = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
        K = np.array([255, 0, 255], np.float32)
    else:
        dom = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
        K = np.array([0, 255, 0], np.float32)
    # 1. background region, first pass: green-holding pixels connected to the picture edge or to a pocket of pure background
    keyish = dom > tol
    lab, n = ndimage.label(keyish)
    keep = np.zeros(n + 1, bool)
    border = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    keep[np.unique(border)] = True
    pure = dom > 200
    cnt = ndimage.sum(pure, lab, index=np.arange(n + 1))
    keep[np.asarray(cnt) >= 30] = True
    # a glow-filled pocket (between two legs) never reaches pure key: keep pockets holding clearly key-tinted pixels — the
    # third channel low, so a turquoise rim (green AND blue) inside the art is not taken for background
    third = a[..., 2] if bg != 'm' else a[..., 1]
    kl = (dom >= 70) & (third <= 70)
    cnt2 = ndimage.sum(kl, lab, index=np.arange(n + 1))
    keep[np.asarray(cnt2) >= 6] = True
    keep[0] = False
    R1 = keep[lab]
    # smallest-alpha un-mix against the key: pixel = a·F + (1 − a)·key with the smallest a that keeps F in range
    d = a - K
    lim = np.maximum(np.where(d > 0, 255.0 - K, K), 1)  # room each channel has on its side of the key
    a_star = np.clip((np.abs(d) / lim).max(-1), 1e-3, 1)            # exact smallest alpha → the colour
    al = np.clip((np.maximum(np.abs(d) - tol, 0) / lim).max(-1), 0, 1)  # with a noise allowance → the opacity
    F = np.clip(K + d / a_star[..., None], 0, 255)
    # second pass: a RED / ORANGE glow on green passes through olive (R ≈ G), where 'greener than red' is ~0, so the first
    # pass stops in the middle of the glow. Carry on through pixels that still hold some key (a* < .97) and whose un-mixed
    # colour matches the glow colour next to them (taken from the mid-glow of the first pass); a dark outline / a rim light /
    # the body of the art un-mixes to a different colour or to a* ≈ 1 and stops it.
    mid = R1 & (a_star > .25) & (a_star < .75)
    BG = R1
    ramp = np.zeros((H, W), np.float32)
    if mid.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~mid, return_indices=True)
        Fg = F[iy, ix]
        Fglob = np.median(F[mid], 0)                         # the picture's main glow colour: a brown outline next to a
        dF = lambda X: np.sqrt(((F - X) ** 2).sum(-1))       # yellow glow un-mixes to red and must not pass for glow
        grow = (a_star < .97) & (dF(Fg) < gt) & (dF(Fglob) < gt * 1.6)
        # only as deep as a glow band goes (gd px from the first pass): a dark-red ribbon lying on the glow (the moon's mist)
        # would otherwise carry it into the art behind it; past gd / 2 it fades back to the painted pixel
        D = gd if gd > 0 else max(12, round(.032 * min(H, W)))
        st = np.ones((3, 3), bool)
        reach = R1.copy(); dist = np.zeros((H, W), np.int32)
        m = R1 | grow
        for i in range(1, D + 1):
            nx = ndimage.binary_dilation(reach, st, mask=m)
            new_ = nx & ~reach
            if not new_.any(): break
            dist[new_] = i; reach = nx
        BG = reach
        ramp = np.clip((dist - D * .5) / max(1, D * .5), 0, 1) * (BG & ~R1)
    # the anti-aliased rim of a solid outline is NOT glow: un-mixed toward the brightest colour it turns a brown outline into a
    # thin red line. A background pixel next to the painted body that is explained by 'that body's own colour + key' keeps
    # that colour, with the alpha that mix needs (projection onto body − key)
    core = ndimage.binary_erosion(~BG, iterations=1)
    if core.any():
        dist, (iy, ix) = ndimage.distance_transform_edt(~core, return_indices=True)
        Fo = a[iy, ix]
        v = Fo - K
        al2 = np.clip(((a - K) * v).sum(-1) / np.maximum((v * v).sum(-1), 1), 0, 1)
        res = np.sqrt(((a - (K + al2[..., None] * v)) ** 2).sum(-1))
        edge = BG & (dist <= 4.5) & (res < 16) & (al2 > .04)
        F = np.where(edge[..., None], Fo, F)
        al = np.where(edge, al2, al)
    # very faint pixels take the colour of the nearest stronger glow, so the outer haze has one clean colour
    strong = BG & (al >= .3)
    if strong.any():
        weak = BG & (al < .3)
        _, (iy, ix) = ndimage.distance_transform_edt(~strong, return_indices=True)
        w = np.clip(al / .3, 0, 1)[..., None]
        Fn = F[iy, ix]
        F = np.where(weak[..., None], Fn * (1 - w) + F * w, F)
    out = np.zeros((H, W, 4), np.float32)
    al_b = np.where(BG, al, 1.0)
    t = ramp
    A_ = al_b * (1 - t) + t                                   # fade the un-mix out toward the painted pixel
    C_ = (np.where(BG[..., None], F, a) * (al_b * (1 - t))[..., None] + a * t[..., None]) / np.maximum(A_, 1e-3)[..., None]
    out[..., :3] = C_
    out[..., 3] = A_
    # 3. despill the painted pixels that touch the background
    near = (~BG) & ndimage.binary_dilation(BG, iterations=3)
    if bg == 'm':
        lowRB = np.minimum(out[..., 0], out[..., 2])
        cap = out[..., 1] + 10
        for c in (0, 2):
            out[..., c] = np.where(near & (out[..., c] > cap) & (lowRB > out[..., 1] + 10), np.minimum(out[..., c], cap), out[..., c])
    else:
        cap = np.maximum(out[..., 0], out[..., 2]) + 6
        out[..., 1] = np.where(near, np.minimum(out[..., 1], cap), out[..., 1])
    return out, BG, R1


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    opt = dict(x.split('=', 1) for x in sys.argv[3:] if '=' in x)
    long_ = int(opt.get('long', 512)); q = int(opt.get('q', 90)); pad = int(opt.get('pad', 6))
    tol = float(opt.get('tol', 8)); bg = opt.get('bg', 'auto')
    rgb = np.asarray(Image.open(src).convert('RGB'))
    out, BG, R1 = cut(rgb, tol, bg, float(opt.get('gt', 70)), int(opt.get('gd', 0)))
    out[:3, :, 3] = 0; out[-3:, :, 3] = 0; out[:, :3, 3] = 0; out[:, -3:, 3] = 0   # generators leave noise on the outer rows
    A = out[..., 3]
    ys, xs = np.where(A > .04)
    y0, y1 = max(0, ys.min() - pad), min(A.shape[0], ys.max() + 1 + pad)
    x0, x1 = max(0, xs.min() - pad), min(A.shape[1], xs.max() + 1 + pad)
    crop = out[y0:y1, x0:x1]
    body = (~BG[y0:y1, x0:x1]) & (crop[..., 3] > .5)
    by, bx = np.where(body)
    ch, cw = crop.shape[:2]
    px = crop.copy(); px[..., 3] *= 255
    im = Image.fromarray(np.clip(px + .5, 0, 255).astype(np.uint8), 'RGBA')
    s = long_ / max(cw, ch)
    W, H = max(1, round(cw * s)), max(1, round(ch * s))
    im = im.convert('RGBa').resize((W, H), Image.LANCZOS).convert('RGBA')
    im.save(dst, 'WEBP', quality=q, method=6)
    info = {'src': src.split('/')[-1], 'out': dst, 'w': W, 'h': H,
            'body': [round(bx.min() / cw, 4), round(by.min() / ch, 4), round((bx.max() + 1) / cw, 4), round((by.max() + 1) / ch, 4)],
            'bodyc': [round(bx.mean() / cw, 4), round(by.mean() / ch, 4)]}
    print(json.dumps(info))
    if 'debug' in opt:  # the picture with the first pass tinted blue and what the glow pass added tinted magenta
        dbg = rgb.astype(np.float32).copy()
        dbg[R1] = dbg[R1] * .4 + np.array([40, 90, 255]) * .6
        g2 = BG & ~R1
        dbg[g2] = dbg[g2] * .3 + np.array([255, 0, 255]) * .7
        Image.fromarray(dbg.astype(np.uint8)).save(opt['debug'])
    if 'preview' in opt:
        pv = Image.new('RGB', (W * 3, H), (0, 0, 0))
        for i, col in enumerate([(236, 240, 246), (60, 120, 60), (30, 30, 40)]):
            bgim = Image.new('RGBA', (W, H), col + (255,))
            bgim.alpha_composite(im)
            pv.paste(bgim.convert('RGB'), (i * W, 0))
        pv.save(opt['preview'])


if __name__ == '__main__':
    main()
