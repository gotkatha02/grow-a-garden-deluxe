"""Cut a hero's turnaround sheet (views on a green background) for the next art steps.
usage:
  python3 -I tools/dir8cut.py start SHEET OUT_DIR [S=0,SE=1,E=2,NE=3,N=4] [size=1024] [feet=.8]
      -> OUT_DIR/start_<DIR>.png : one view per square picture on the sheet's own green, every view at the
         same scale (sheet px), feet at feet*size, body centre in the middle. These are the first frames the
         owner gives the image-to-video tool for the 20 motion clips (idle / walk / attack / buff x 5 dirs).
         Green-tinted spots INSIDE the character (a green stripe on a belt, green bounce light on metal) are
         painted over first, so the clips have no green on the hero for cliphero.py's key to eat.
  python3 -I tools/dir8cut.py sit SHEET OUT_PREFIX S=8,SE=9,E=10,N=11 [ref=0] [ht=230] [mirror=1] [back=N]
      -> OUT_PREFIX<DIR>.webp : keyed, trimmed sitting pictures for hero_sit.js (all 8 directions: the W side
         is mirrored from the E side when the sheet has no W-side views, NE / NW use `back` when missing).
         Prints the SIT entry: k = ht / height of the standing view `ref` on the SAME sheet, cx per direction.
  python3 -I tools/dir8cut.py pics SHEET OUT_PREFIX S=0,SE=1,E=2,NE=3,N=4,NW=5,W=6,SW=7 [scale=1] [q=90]
      -> OUT_PREFIX<DIR>.webp : one keyed, trimmed picture per direction, all at the same scale (sheet px x scale),
         for things drawn by code from still views (the drake's dragon forms). Prints a JS table
         {DIR:[w,h,fx,fy]} with the ground point of each view (fx = centre of the feet, fy = bottom of the body
         mass: rows narrower than 18 % of the widest row — a tail tip pointing at the camera — do not count).
Views are found as the big shapes on the sheet, read left->right, top->bottom (index 0..n-1), like statichero.py."""
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage as nd

def load(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    key = np.median(np.concatenate([im[:6].reshape(-1, 3), im[:, :6].reshape(-1, 3)]), 0)
    ex = im[..., 1] - np.maximum(im[..., 0], im[..., 2]); kx = key[1] - max(key[0], key[2])
    a = np.clip(1 - (ex - 20) / (kx - 20), 0, 1)
    lab, n = nd.label(nd.binary_dilation(a > .3, iterations=6))
    objs = [(sl, int((lab[sl] == i + 1).sum()), i + 1) for i, sl in enumerate(nd.find_objects(lab))]
    objs = [o for o in objs if o[1] > 15000]
    # rows: group by vertical overlap, then left -> right
    objs.sort(key=lambda o: o[0][0].start)
    rows = []
    for o in objs:
        if rows and o[0][0].start < rows[-1][0][0][0].stop - 40: rows[-1].append(o)
        else: rows.append([o])
    views = [o for r in rows for o in sorted(r, key=lambda o: o[0][1].start)]
    return im, key, a, lab, views

def args(rest, defaults):
    d = dict(defaults); order = None
    for s in rest:
        k, _, v = s.partition('=')
        if k in ('size', 'feet', 'ref', 'ht', 'mirror', 'back', 'scale', 'q'): d[k] = v
        else: order = [(p.split('=')[0], int(p.split('=')[1])) for p in s.split(',')]
    return d, order

def clean_inside(im, key):
    """Paint over green-tinted pixels that are not background: a stripe on the belt, green bounce light."""
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    keyish = (G > 180) & (R < 90) & (B < 90)
    inner = ~nd.binary_dilation(keyish, iterations=4)
    tint = inner & (G > R + 30) & (G > B + 25)
    lab, n = nd.label(nd.binary_dilation(tint, iterations=1) & inner)
    out = im.copy(); fixed = 0
    for i, sl in enumerate(nd.find_objects(lab), 1):
        y0, y1 = max(0, sl[0].start - 6), sl[0].stop + 6; x0, x1 = max(0, sl[1].start - 6), sl[1].stop + 6
        blob = lab[y0:y1, x0:x1] == i
        ring = nd.binary_dilation(blob, iterations=3) & ~blob & ~keyish[y0:y1, x0:x1]
        nb = im[y0:y1, x0:x1][ring]
        nb = nb[~((nb[:, 1] > nb[:, 0] + 20) & (nb[:, 1] > nb[:, 2] + 15))]          # neighbours that are not green
        blue = nb[(nb[:, 2] >= nb[:, 0]) & (nb[:, 2] >= nb[:, 1]) & (nb.sum(1) > 90)]
        reg = out[y0:y1, x0:x1]
        if len(nb) and len(blue) >= .3 * len(nb):                                  # inside dark-blue cloth: paint that blue
            reg[blob] = np.median(blue, 0)
        else:                                                                       # metal / fur: just take the green out
            p = reg[blob]; p[:, 1] = np.minimum(p[:, 1], np.maximum(p[:, 0], p[:, 2]) + 6); reg[blob] = p
        fixed += int(blob.sum())
    return out, fixed

def start(sheet, outdir, rest):
    d, order = args(rest, {'size': '1024', 'feet': '.8'})
    order = order or [('S', 0), ('SE', 1), ('E', 2), ('NE', 3), ('N', 4)]
    S, feet = int(d['size']), float(d['feet'])
    im, key, a, lab, views = load(sheet)
    im2, fixed = clean_inside(im, key)
    os.makedirs(outdir, exist_ok=True)
    print('views', len(views), 'green spots painted', fixed, 'px')
    for name, idx in order:
        sl, _, li = views[idx]
        m = lab[sl] == li
        crop = np.where(m[..., None], im2[sl], key)
        al = a[sl] * m
        cx = (al.sum(0) * np.arange(al.shape[1])).sum() / al.sum()
        ys = np.nonzero(al.max(1) > .3)[0]; bot = ys.max()
        can = np.empty((S, S, 3), np.float32); can[:] = key
        ox, oy = int(round(S / 2 - cx)), int(round(S * feet - bot))
        h, w = crop.shape[:2]
        X0, Y0 = max(0, ox), max(0, oy); X1, Y1 = min(S, ox + w), min(S, oy + h)
        can[Y0:Y1, X0:X1] = crop[Y0 - oy:Y1 - oy, X0 - ox:X1 - ox]
        Image.fromarray(np.clip(can, 0, 255).astype(np.uint8)).save(os.path.join(outdir, 'start_%s.png' % name))
        print(name, 'view', idx, 'body', w, 'x', bot - ys.min() + 1, 'px')

def matte(im, key, a, m):
    col = np.clip((im - (1 - a[..., None]) * key) / np.maximum(a, 1e-3)[..., None], 0, 255)
    mx = np.maximum(col[..., 0], col[..., 2]); col[..., 1] = np.where(a < 1, np.minimum(col[..., 1], mx + 4), col[..., 1])
    al = a * m; al[al < .06] = 0
    er = nd.binary_erosion(al > .5, iterations=1); al = np.where((al > 0) & ~er, al * .75, al)
    return np.dstack([col, al * 255]).astype(np.uint8)

def sit(sheet, prefix, rest):
    d, order = args(rest, {'ref': '0', 'ht': '230', 'mirror': '1', 'back': 'N'})
    im, key, a, lab, views = load(sheet)
    im2, fixed = clean_inside(im, key)
    ref = views[int(d['ref'])][0]; refh = ref[0].stop - ref[0].start
    k = float(d['ht']) / refh
    got = {}
    for name, idx in order:
        sl, _, li = views[idx]
        rgba = matte(im2[sl], key, a[sl], lab[sl] == li)
        ys, xs = np.nonzero(rgba[..., 3] > 8)
        got[name] = Image.fromarray(rgba).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    mir = {'SW': 'SE', 'W': 'E', 'NW': 'NE'}
    if d['mirror'] == '1':
        for w_, e_ in mir.items():
            if w_ not in got and e_ in got: got[w_] = got[e_].transpose(Image.FLIP_LEFT_RIGHT)
    for nm in ('NE', 'NW'):
        if nm not in got and d['back'] in got: got[nm] = got[d['back']]
    cx = {}
    for nm, pic in got.items():
        al = np.asarray(pic)[..., 3].astype(np.float32) / 255
        h = al.shape[0]; band = al[int(h * .05):int(h * .45)]          # head + shoulders: the staff lies at the feet
        cx[nm] = round(float((band.sum(0) * np.arange(al.shape[1])).sum() / band.sum() / al.shape[1]), 3)
        pic.save(prefix + nm + '.webp', 'WEBP', quality=92, method=6)
    dirs = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
    print('green spots painted', fixed, 'px · standing ref height', refh, 'px')
    print("SIT entry: {dir:'%s',k:%s/%d,cx:{%s}}" % (os.path.basename(prefix) and prefix, d['ht'], refh,
          ','.join('%s:%s' % (x, cx[x]) for x in dirs if x in cx)))

def pics(sheet, prefix, rest):
    d, order = args(rest, {'scale': '1', 'q': '90'})
    order = order or [(n, i) for i, n in enumerate(['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'])]
    k, q = float(d['scale']), int(d['q'])
    im, key, a, lab, views = load(sheet)
    im2, fixed = clean_inside(im, key)
    tab = {}
    for name, idx in order:
        sl, _, li = views[idx]
        rgba = matte(im2[sl], key, a[sl], lab[sl] == li)
        ys, xs = np.nonzero(rgba[..., 3] > 8)
        pic = Image.fromarray(rgba).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        if k != 1: pic = pic.resize((max(1, round(pic.width * k)), max(1, round(pic.height * k))), Image.LANCZOS)
        al = np.asarray(pic)[..., 3].astype(np.float32) / 255
        rs = al.sum(1); wide = np.nonzero(rs >= .18 * rs.max())[0]; fy = int(wide.max())
        band = al[max(0, fy - int(pic.height * .06)):fy + 1]
        fx = float((band.sum(0) * np.arange(al.shape[1])).sum() / max(band.sum(), 1e-3))
        pic.save(prefix + name + '.webp', 'WEBP', quality=q, method=6)
        tab[name] = [pic.width, pic.height, round(fx), fy]
    print('green spots painted', fixed, 'px')
    print('{' + ','.join('%s:[%s]' % (n, ','.join(str(v) for v in tab[n])) for n, _ in order) + '}')

if __name__ == '__main__':
    mode, sheet, out, rest = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
    {'start': start, 'sit': sit, 'pics': pics}[mode](sheet, out, rest)
