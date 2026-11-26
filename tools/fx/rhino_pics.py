"""Cut the owner's 10 painted rhino effect pictures (2026-11-26, prompts RHINO_FX3_PROMPTS_TH.md) into the game pictures.

  python3 -I tools/fx/rhino_pics.py rx_jab=PNG rx_heavy=PNG rx_meteor=PNG rx_revenge=PNG rx_upper=PNG rx_hammer=PNG \
          rx_giant=PNG rx_wall=PNG rx_roar=PNG rx_titan=PNG [preview=PNG] [m=1.1]

Every input is a real transparent PNG from ChatGPT (1024x1536 / 1536x1024 / 1254x1254). For each:
  1. haze clean: ChatGPT leaves faint speckles (alpha 1-30) all over the transparent area. Pieces with alpha >= 10 are
     kept when they are big enough and solid somewhere (area >= AREA px, max alpha >= 90: ice bits and sparks stay),
     fainter glow is kept only within 14 px of a kept piece.
  2. trim to what is left + 8 px, fade the alpha over 14 px at the picture edge (the spirit's glow touches the frame).
  3. scale so the longer side is MAXS[name] and save assets/fx/rhino/<name>.webp.
  4. print the anchor table for rhino_vfx.js (RXA): every point is measured by eye on the ORIGINAL picture (A below)
     and turned into a fraction of the saved picture.
     Blows: tip = the front of the ice knuckles, back = the cut-off end of the fur cuff. The code gauntlet (rxFist) is
     drawn fw wide with its knuckles 0.964 fw from the back, so k = 0.964 * M * picture width / (back->tip length)
     draws the painted gauntlet M times the code one (M default 1.1, per picture in A).
     wall foot / titan foot = where the piece stands on the ground · roar head = the middle of the spirit head.
  5. rx_arm (made from the jab picture): the same gauntlet WITHOUT its speed streaks, for the giant gauntlet he holds on
     his arm while charging (Worldbreaker, Skybreaker, Shaker …). Left of the copper band every blue / white streak pixel
     is dropped, the gauntlet is the outlined piece that holds the band (holes inside it filled back), anchor = band."""
import sys, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

OUT = 'assets/fx/rhino/'
PAD, FADE, HAZE, KEEPD = 8, 14, 10, 14
MAXS = dict(rx_titan=640, rx_giant=640)          # the rest 512
# anchors in ORIGINAL picture px (read on grids 2026-11-26)
A = dict(
    rx_jab=dict(tip=(1343, 515), back=(530, 515)),
    rx_heavy=dict(tip=(1325, 522), back=(456, 522)),
    rx_meteor=dict(tip=(1290, 550), back=(525, 550)),
    rx_revenge=dict(tip=(1358, 551), back=(552, 551)),
    rx_upper=dict(tip=(490, 305), back=(490, 1075)),
    rx_hammer=dict(tip=(602, 1088), back=(602, 359)),
    rx_giant=dict(tip=(508, 1385), back=(508, 315), m=1.2),
    rx_wall=dict(foot=(627, 1085)),
    rx_roar=dict(head=(880, 560), mouth=(1006, 640)),
    rx_titan=dict(foot=(512, 1405), head=(470, 250)),
)

def clean(a):
    al = a[..., 3].astype(np.int32)
    m = al >= HAZE
    lab, n = ndi.label(m, structure=np.ones((3, 3), bool))
    km = np.zeros_like(m)
    if n:
        idx = np.arange(1, n + 1)
        area = ndi.sum(np.ones_like(al), lab, idx)
        amax = ndi.maximum(al, lab, idx)
        area_min = max(120, int(al.size * 0.00012))
        keep = np.concatenate([[False], (area >= area_min) & (amax >= 90)])
        km = keep[lab]
    near = ndi.distance_transform_edt(~km) <= KEEPD
    a = a.copy()
    a[..., 3] = np.where(km | (near & (al < HAZE)), al, 0).astype(np.uint8)
    return a

def cut(name, path):
    a = clean(np.asarray(Image.open(path).convert('RGBA')))
    H, W = a.shape[:2]
    ys, xs = np.nonzero(a[..., 3] > 0)
    x0, y0, x1, y1 = max(0, xs.min() - PAD), max(0, ys.min() - PAD), min(W, xs.max() + 1 + PAD), min(H, ys.max() + 1 + PAD)
    c = a[y0:y1, x0:x1].copy()
    h, w = c.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy))
    c[..., 3] = (c[..., 3] * np.clip(d / FADE, 0, 1)).astype(np.uint8)
    S = MAXS.get(name, 512) / max(w, h)
    im = Image.fromarray(c).resize((round(w * S), round(h * S)), Image.LANCZOS)
    im.save(OUT + name + '.webp', 'WEBP', quality=88, alpha_quality=92, method=6)
    fr = lambda p: [round((p[0] - x0) / w, 4), round((p[1] - y0) / h, 4)]
    o = {'size': list(im.size)}
    an = A[name]
    for k, p in an.items():
        if isinstance(p, tuple):
            o[k] = fr(p)
    if 'tip' in an:
        L = float(np.hypot(an['tip'][0] - an['back'][0], an['tip'][1] - an['back'][1]))
        o['k'] = round(0.964 * an.get('m', M) * w / L, 3)
    return o, im

def arm(path):
    """the jab gauntlet without its streaks / ice bits: the piece around the copper band, streak colours dropped left of x 760"""
    a = clean(np.asarray(Image.open(path).convert('RGBA'))).astype(np.int32)
    H, W = a.shape[:2]
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    xx = np.mgrid[0:H, 0:W][1]
    streak = (xx < 760) & (((b >= 150) & (b >= r + 30)) | (np.minimum(np.minimum(r, g), b) >= 225))
    m = (al > 40) & ~streak
    lab, n = ndi.label(m, structure=np.ones((3, 3), bool))
    body = lab == lab[515, 909]                       # the copper band
    body = ndi.binary_fill_holes(body)
    soft = np.minimum(body, ndi.gaussian_filter(body.astype(float), 0.7) * 1.6)
    c = a.copy(); c[..., 3] = (al * np.where(xx < 760, soft, np.maximum(soft, (xx >= 760)))).astype(np.int32)
    c = c.astype(np.uint8)
    ys, xs = np.nonzero(c[..., 3] > 0)
    x0, y0, x1, y1 = max(0, xs.min() - PAD), max(0, ys.min() - PAD), min(W, xs.max() + 1 + PAD), min(H, ys.max() + 1 + PAD)
    c = c[y0:y1, x0:x1]
    h, w = c.shape[:2]
    S = 512 / max(w, h)
    im = Image.fromarray(c).resize((round(w * S), round(h * S)), Image.LANCZOS)
    im.save(OUT + 'rx_arm.webp', 'WEBP', quality=88, alpha_quality=92, method=6)
    L = 1343 - 530
    o = {'size': list(im.size), 'band': [round((909 - x0) / w, 4), round((515 - y0) / h, 4)], 'tip': [round((1343 - x0) / w, 4), round((515 - y0) / h, 4)],
         'k': round(0.964 * M * w / L, 3)}
    return o, im

def preview(res, out):
    cells = []
    for n, (o, im) in res.items():
        W, H = im.size
        s = 300 / max(W, H)
        c = Image.new('RGBA', (320, 340), (44, 50, 62, 255))
        t = im.resize((max(1, round(W * s)), max(1, round(H * s))), Image.LANCZOS)
        ox, oy = (320 - t.width) // 2, (320 - t.height) // 2 + 14
        c.alpha_composite(t, (ox, oy))
        d = ImageDraw.Draw(c)
        d.text((4, 2), n, fill=(255, 255, 0))
        for k, col in [('tip', (255, 60, 60)), ('back', (60, 255, 60)), ('band', (255, 255, 255)), ('foot', (255, 60, 255)), ('head', (60, 200, 255)), ('mouth', (255, 160, 40))]:
            if k in o:
                px, py = ox + o[k][0] * t.width, oy + o[k][1] * t.height
                d.ellipse([px - 4, py - 4, px + 4, py + 4], outline=col, width=2)
        cells.append(c)
    S = Image.new('RGBA', (320 * 5, 340 * ((len(cells) + 4) // 5)), (20, 20, 20, 255))
    for i, c in enumerate(cells):
        S.paste(c, ((i % 5) * 320, (i // 5) * 340))
    S.convert('RGB').save(out)

if __name__ == '__main__':
    kv = dict(x.split('=', 1) for x in sys.argv[1:] if '=' in x)
    M = float(kv.pop('m', 1.1))
    pv = kv.pop('preview', None)
    res = {}
    for n in A:
        if n in kv:
            res[n] = cut(n, kv[n])
    if 'rx_jab' in kv:
        res['rx_arm'] = arm(kv['rx_jab'])
    print(json.dumps({n: o for n, (o, im) in res.items()}, separators=(',', ':')))
    if pv:
        preview(res, pv)
