"""Cut the owner's painted Anubis pieces (2026-11-25, prompts ANUBIS_FX4_PROMPTS_TH.md) into the game pictures.

  python3 -I tools/fx/anubis_pics.py OPEN.png CLOSED.png SCALES.png GATE.png STANDARD.png [preview=PNG]

Every input is a real transparent PNG (ChatGPT), one piece each. Output: assets/fx/anubis/an_*.webp (never overwrites the
26 old pictures of ?vfx3=0) and the anchor table printed as JS for anubis_vfx.js (ANPIC):
  an_head_open / an_head_closed  same canvas (union box of both), so swapping them at the bite does not jump
  an_gate, an_standard           trimmed + 6 px pad
  an_sc_post / an_sc_beam / an_sc_panL / an_sc_panR   the Scales of Ma'at cut so the beam can tilt:
      beam = the bar + end rings + winged decoration + pivot gem (rotates round the gem centre)
      pans = the link under each end ring + the small ring + 3 cords + the pan (hang straight from the end ring)
      post = ankh + capital + shaft + base; the part of the shaft hidden behind the beam is filled from the shaft row
             just under the gem, so a tilted beam never shows a hole
Coordinates are the ORIGINAL picture pixels (1254 boxes); S = the output scale (pictures are drawn ~100-200 px wide in
game, so 0.5 keeps them sharp on a 2x phone screen)."""
import sys, json
import numpy as np
from PIL import Image

S = 0.5
OUT = 'assets/fx/anubis/'
PAD = 6

def rgba(p):
    return np.asarray(Image.open(p).convert('RGBA')).copy()

def bbox(a, thr=6):
    ys, xs = np.nonzero(a[..., 3] > thr)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

def crop_save(a, box, name):
    x0, y0, x1, y1 = box
    x0 = max(0, x0 - PAD); y0 = max(0, y0 - PAD); x1 = min(a.shape[1], x1 + PAD); y1 = min(a.shape[0], y1 + PAD)
    im = Image.fromarray(a[y0:y1, x0:x1])
    w, h = round((x1 - x0) * S), round((y1 - y0) * S)
    im = im.resize((w, h), Image.LANCZOS)
    im.save(OUT + name + '.webp', 'WEBP', quality=86, alpha_quality=90, method=6)
    return (x0, y0, w, h)

def pt(p, org):
    """original point → output picture px (rounded to .1)"""
    return [round((p[0] - org[0]) * S, 1), round((p[1] - org[1]) * S, 1)]

def main(a):
    o = dict(x.split('=', 1) for x in a if '=' in x)
    f = [x for x in a if '=' not in x]
    op, cl, sc, gt, sd = f
    T = {}
    # --- the giant head: one box for both so the swap at the bite is seamless
    A, B = rgba(op), rgba(cl)
    b1, b2 = bbox(A), bbox(B)
    box = (min(b1[0], b2[0]), min(b1[1], b2[1]), max(b1[2], b2[2]), max(b1[3], b2[3]))
    org = crop_save(A, box, 'an_head_open'); crop_save(B, box, 'an_head_closed')
    # bite = where the teeth meet (closed picture), neck = bottom centre of the gold collar, nose = tip of the snout
    T['head'] = dict(w=org[2], h=org[3], bite=pt((905, 790), org), neck=pt((450, 1227), org), nose=pt((1160, 640), org))
    # --- gate + standard
    G = rgba(gt); org = crop_save(G, bbox(G), 'an_gate')
    T['gate'] = dict(w=org[2], h=org[3], foot=pt((572, 1366), org), door=pt((569, 1273), org))
    D = rgba(sd); org = crop_save(D, bbox(D), 'an_standard')
    T['std'] = dict(w=org[2], h=org[3], tip=pt((510.5, 1526), org), sun=pt((510, 130), org))
    # --- the scales
    C = rgba(sc); al = C[..., 3]; H, W = al.shape
    yy, xx = np.mgrid[0:H, 0:W]
    op_ = al > 6
    piv = (627.5, 400.0); hookL = (210.5, 395.0); hookR = (2 * 626.5 - 210.5, 395.0)
    link = lambda cx: (xx >= cx - 15) & (xx <= cx + 15) & (yy >= 398) & (yy <= 446)
    pans = (yy >= 437) & (yy <= 1000)                       # the base starts below 1000: it stays with the post
    wing = yy < 470                                          # the beam's wing feathers reach y 450 at x 380-420 / 833-870
    ringtop = lambda cx: (yy < 452) & (np.abs(xx - cx) > 26)   # above the pan's ring only the link and the ring belong to the pan
    panL = op_ & ((pans & (xx < 420) & ~(wing & (xx > 300)) & ~ringtop(hookL[0])) | link(hookL[0]))
    panR = op_ & ((pans & (xx > 833) & ~(wing & (xx < 953)) & ~ringtop(hookR[0])) | link(hookR[0]))
    col = (xx >= 555) & (xx <= 700)                          # the post column: its capital ends at 345, the end rings start at 336
    beam = op_ & (((yy >= 345) & col) | ((yy >= 336) & ~col)) & (yy <= 459) & ~panL & ~panR
    post = op_ & ~beam & ~panL & ~panR
    P = C.copy(); P[~post] = 0
    # fill the shaft behind the beam from the row just under the gem
    src = C[466].copy()
    for y in range(340, 462):
        for x in range(585, 669):
            if P[y, x, 3] < 250 and src[x, 3] > 0:
                P[y, x] = src[x]
    def piece(mask, name, base=None):
        X = C.copy(); X[~mask] = 0
        if base is not None: X = base
        return X, bbox(X)
    T['sc'] = {}
    Pp, bp = P, bbox(P)
    org = crop_save(Pp, bp, 'an_sc_post')
    T['sc']['post'] = dict(w=org[2], h=org[3], foot=pt((627, 1240), org), piv=pt(piv, org))
    for name, m, extra in (('beam', beam, dict(piv=piv, hL=hookL, hR=hookR)), ('panL', panL, dict(hook=hookL, rim=(207, 828))),
                           ('panR', panR, dict(hook=hookR, rim=(1046, 828)))):
        X = C.copy(); X[~m] = 0
        org = crop_save(X, bbox(X), 'an_sc_' + name)
        T['sc'][name] = dict(w=org[2], h=org[3], **{k: pt(v, org) for k, v in extra.items()})
    T['sc']['S'] = S
    T['head']['S'] = T['gate']['S'] = T['std']['S'] = S
    print('const ANPIC=' + json.dumps(T, separators=(',', ':')) + ';')
    if 'preview' in o:
        preview(o['preview'], T)

def preview(path, T):
    """the scales put back together at tilt -0.36 / 0 / +0.36 on a dark ground (checks the cut and the hidden shaft)"""
    import math
    def L(n): return Image.open(OUT + n + '.webp').convert('RGBA')
    post, beam, pl, pr = L('an_sc_post'), L('an_sc_beam'), L('an_sc_panL'), L('an_sc_panR')
    sc = T['sc']; out = Image.new('RGBA', (3 * 700, 700), (46, 40, 58, 255))
    for i, tilt in enumerate((-0.36, 0, 0.36)):
        ox, oy = i * 700 + 350, 660
        fp = sc['post']['foot']; pv = sc['post']['piv']
        out.alpha_composite(post, (int(ox - fp[0]), int(oy - fp[1])))
        PX, PY = ox - fp[0] + pv[0], oy - fp[1] + pv[1]
        bp = sc['beam']['piv']
        for side, im, key in (('L', pl, 'hL'), ('R', pr, 'hR')):
            h = sc['beam'][key]; dx, dy = h[0] - bp[0], h[1] - bp[1]
            c, s = math.cos(-tilt), math.sin(-tilt)
            hx, hy = PX + dx * c - dy * s, PY + dx * s + dy * c
            a = sc['pan' + side]['hook']
            out.alpha_composite(im, (int(hx - a[0]), int(hy - a[1])))
        # rotate the beam round its pivot
        big = Image.new('RGBA', (beam.width * 3, beam.height * 3), (0, 0, 0, 0))
        big.paste(beam, (beam.width, beam.height))
        rot = big.rotate(math.degrees(tilt), resample=Image.BICUBIC, center=(beam.width + bp[0], beam.height + bp[1]))
        out.alpha_composite(rot, (int(PX - beam.width - bp[0]), int(PY - beam.height - bp[1])))
    out.convert('RGB').save(path, quality=88)

if __name__ == '__main__':
    main(sys.argv[1:])
