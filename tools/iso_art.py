"""Isometric 2.5D snow kit (ISO_MAP_TH.md §9–10, owner 2026-11-26): the owner's 13 kit pictures → the game's folders.

  python3 -I tools/iso_art.py sheet <code> <sheet.png>    S3…S9 piece sheet (3×2 on green, S3 / S7 on magenta): keyed with the boss
                                                          keyer (tools/wboss_arenas.py key_sheet), split by the grid (a loose bit belongs
                                                          to the cell its centre is in) → maps/iso/<name>.webp; the sheet is kept as
                                                          assets/iso/sheets/<code>.webp (for re-cuts)
  python3 -I tools/iso_art.py recut [<code> …]            cut again from the kept sheets
  python3 -I tools/iso_art.py tex <code> <picture.png>    T1…T6 ground texture → tools/seamless_tex.py → maps/iso/<name>.webp (1024²);
                                                          the picture is kept as assets/iso/sheets/<code>.webp
  python3 -I tools/iso_art.py cat                          write maps/iso-cat.js = VK_CAT entries of every cut piece + the textures
  python3 -I tools/iso_art.py preview <out.jpg> [code …]  every piece at its in-game size ×1.5: red dot = anchor, yellow = collision

P below: in-game size in map px — h = height (upright pieces; the width follows the picture) or w = width (flat / long pieces) —
heroes stand 38–64 px tall (HERO_SIZE), the 2.5D wolf ~57; type (tree / prop / big / flat); fd = depth of the piece's footprint on the
screen (map px): the anchor (sort point) is the middle of the footprint = fd/2 above the lowest painted pixel, so a hero standing in front
of either visible wall of an iso house is drawn in front of it; collision (centred on the anchor, ec:1 in fieldmap.js mk()): cr = circle
(radius × w × .9, trees), cw = ellipse half-width × w (its half-depth = fd × .42), diag = the piece lies along a diagonal (fences, logs,
snow banks): its two lowest ends are found in the picture, the anchor is their middle and 4 circles of radius diag × w run between them;
no cr / cw / diag = walk through. cap = repetition (common / mid / semi / unique), sw = sway, fill = may repeat side by side in a forest
mass (fieldmap.js pickFill). Every piece is lit from the upper left like the 2.5D heroes, so none may be mirrored: nf:1.
Pictures keep the sheet's resolution, at most RES × their in-game width."""
import importlib.util, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
OUT = R + 'maps/iso/'
KEEP = R + 'assets/iso/sheets/'
RES = 2.4

SHEETS = {   # code: (cols, rows, names in reading order) — the boxes of ISO_MAP_TH.md §4 / §9
 'S3': (3, 2, ['isoPineL', 'isoPineM', 'isoPineS', 'isoPineClump', 'isoBirch', 'isoPineDead']),
 'S4': (3, 2, ['isoBoulder', 'isoRocks', 'isoRunestone', 'isoIceCrystal', 'isoSled', 'isoFirewood']),
 'S5': (3, 2, ['isoLonghouse', 'isoWatchtower', 'isoTent', 'isoCampfire', 'isoFenceA', 'isoFenceB']),
 'S6': (3, 2, ['isoCliffW', 'isoCliffN', 'isoSpire', 'isoMound', 'isoIcefall', 'isoCave']),
 'S7': (3, 2, ['isoSapling', 'isoBush', 'isoBerryBush', 'isoGrass', 'isoFlowerWhite', 'isoFlowerIce']),
 'S8': (3, 2, ['isoLog', 'isoStump', 'isoBranch', 'isoStepStones', 'isoPuddle', 'isoShieldAxe']),
 'S9': (3, 2, ['isoHeap', 'isoBankA', 'isoBankB', 'isoDrift', 'isoHeapRock', 'isoHeapIce']),
}
TEXS = {'T1': 'isoSnow', 'T2': 'isoSnowWind', 'T3': 'isoPath', 'T4': 'isoIce', 'T5': 'isoRock', 'T6': 'isoThaw'}


def p(t, h=None, w=None, fd=12, cr=None, cw=None, diag=None, cap='semi', sw=0, fill=0): return dict(t=t, h=h, w=w, fd=fd, cr=cr, cw=cw, diag=diag, cap=cap, sw=sw, fill=fill)
P = {
 # S3 trees (forest masses, lone trees, the border): anchor = trunk base
 'isoPineL': p('tree', h=270, fd=14, cr=.075, cap='common', sw=.25, fill=1), 'isoPineM': p('tree', h=205, fd=12, cr=.08, cap='common', sw=.3, fill=1),
 'isoPineS': p('tree', h=128, fd=10, cr=.09, cap='common', sw=.4, fill=1), 'isoPineClump': p('tree', h=245, fd=40, cw=.3, cap='common', sw=.25, fill=1),
 'isoBirch': p('tree', h=215, fd=12, cr=.07, cap='common', sw=.35, fill=1), 'isoPineDead': p('tree', h=165, fd=12, cr=.08, cap='mid', fill=1),
 # S4 rocks, ice, camp goods
 'isoBoulder': p('prop', h=64, fd=36, cw=.4, cap='common'), 'isoRocks': p('prop', h=44, fd=28, cw=.4, cap='common'),
 'isoRunestone': p('prop', h=100, fd=30, cw=.32, cap='mid'), 'isoIceCrystal': p('prop', h=72, fd=30, cw=.32, cap='mid'),
 'isoSled': p('prop', h=62, fd=34, cw=.42, cap='unique'), 'isoFirewood': p('prop', h=58, fd=30, cw=.42, cap='semi'),
 # S5 the hunters' camp (door ≥ the biggest hero, 64 px)
 'isoLonghouse': p('big', h=300, fd=110, cw=.42, cap='unique'), 'isoWatchtower': p('big', h=250, fd=70, cw=.38, cap='unique'),
 'isoTent': p('big', h=150, fd=70, cw=.4, cap='unique'), 'isoCampfire': p('prop', h=92, fd=46, cw=.36, cap='unique'),
 'isoFenceA': p('prop', h=62, diag=.07, cap='semi'), 'isoFenceB': p('prop', h=62, diag=.07, cap='semi'),
 # S6 rock walls, landmarks
 'isoCliffW': p('big', h=235, fd=90, cw=.46, cap='common', fill=1), 'isoCliffN': p('big', h=235, fd=80, cw=.44, cap='common', fill=1),
 'isoSpire': p('big', h=240, fd=60, cw=.32, cap='mid'), 'isoMound': p('big', h=115, fd=70, cw=.42, cap='mid'),
 'isoIcefall': p('big', h=210, fd=80, cw=.42, cap='unique'), 'isoCave': p('big', h=190, fd=90, cw=.42, cap='unique'),
 # S7 small plants (walk through: the soft decor at forest edges and in meadows)
 'isoSapling': p('prop', h=74, fd=10, cap='common', sw=.6), 'isoBush': p('prop', h=46, fd=20, cap='common', sw=.4),
 'isoBerryBush': p('prop', h=56, fd=22, cap='common', sw=.4), 'isoGrass': p('prop', h=40, fd=14, cap='common', sw=1),
 'isoFlowerWhite': p('prop', h=30, fd=10, cap='common', sw=.8), 'isoFlowerIce': p('prop', h=32, fd=10, cap='common', sw=.8),
 # S8 small things on the ground
 'isoLog': p('prop', w=124, diag=.1, cap='mid'), 'isoStump': p('prop', h=46, fd=30, cw=.3, cap='common'),
 'isoBranch': p('flat', w=92, cap='common'), 'isoStepStones': p('flat', w=118, cap='semi'),
 'isoPuddle': p('flat', w=110, cap='semi'), 'isoShieldAxe': p('prop', h=56, fd=30, cw=.36, cap='unique'),
 # S9 snow heaps (pond banks, drifts)
 'isoHeap': p('prop', w=118, fd=54, cw=.4, cap='common'), 'isoBankA': p('prop', w=178, diag=.09, cap='common'),
 'isoBankB': p('prop', w=178, diag=.09, cap='common'), 'isoDrift': p('prop', w=160, fd=40, cw=.42, cap='common'),
 'isoHeapRock': p('prop', w=118, fd=50, cw=.4, cap='mid'), 'isoHeapIce': p('prop', w=128, fd=46, cw=.4, cap='mid'),
}


def mod(name, path):
    spec = importlib.util.spec_from_file_location(name, R + path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def keyer(): return mod('wa', 'tools/wboss_arenas.py').key_sheet


def grid(cols, rows, w, h): return [(c * w // cols, r * h // rows, (c + 1) * w // cols, (r + 1) * h // rows) for r in range(rows) for c in range(cols)]


def bottom(a):
    """lowest painted row (alpha > 40), in picture px"""
    return int(np.nonzero((a > 40).any(1))[0][-1])


def ends(a):
    """a piece lying along a diagonal: its lowest painted point in the leftmost and the rightmost 15 % of its columns (picture px)"""
    m = a > 40; xs = np.nonzero(m.any(0))[0]; x0, x1 = xs[0], xs[-1]; k = max(2, int((x1 - x0) * .15))
    def low(c0, c1):
        best = None
        for x in range(c0, c1 + 1):
            ys = np.nonzero(m[:, x])[0]
            if len(ys) and (best is None or ys[-1] > best[1]): best = (x, ys[-1])
        return best
    return low(x0, x0 + k), low(x1 - k, x1)


def anchor(nm, im):
    """(ax, ay, extra catalog fields) for a piece, from its picture"""
    d = P[nm]; a = np.asarray(im)[..., 3]; H, Wp = a.shape; gw, gh = size(nm, im); k = gh / H   # game px per picture px
    if d['diag']:
        (xl, yl), (xr, yr) = ends(a); mx, my = (xl + xr) / 2, (yl + yr) / 2 - 6 / k
        cs = [[round(((xl + (xr - xl) * t) - mx) / Wp, 3), round(((yl + (yr - yl) * t) - 6 / k - my) / Wp, 3), d['diag']] for t in (.14, .38, .62, .86)]
        return round(mx / Wp, 3), round(my / H, 3), {'cs': cs, 'c': None}
    ay = (bottom(a) + 1 - d['fd'] / 2 / k) / H
    c = d['cr'] if d['cr'] else [d['cw'], round(d['fd'] * .42 / gw, 3)] if d['cw'] else None
    return .5, round(float(ay), 3), {'c': c}


def size(nm, im):
    d = P[nm]
    if d['h']: h = d['h']; w = h * im.width / im.height
    else: w = d['w']; h = w * im.height / im.width
    return w, h


def cut_sheet(code, src):
    cols, rows, names = SHEETS[code]
    os.makedirs(OUT, exist_ok=True); os.makedirs(KEEP, exist_ok=True)
    keep = KEEP + code + '.webp'
    if os.path.abspath(src) != os.path.abspath(keep): Image.open(src).convert('RGB').save(keep, quality=95, method=6)
    rgba = keyer()(src, False); h, w = rgba.shape[:2]
    boxes = grid(cols, rows, w, h)
    al = rgba[..., 3] > 15; lab, n = nd.label(al, structure=np.ones((3, 3)))
    own = {}
    for i, (cy, cx) in enumerate(nd.center_of_mass(al, lab, range(1, n + 1))):
        for bi, (x0, y0, x1, y1) in enumerate(boxes):
            if x0 <= cx < x1 and y0 <= cy < y1: own[i + 1] = bi; break
    sizes = nd.sum(al, lab, range(1, n + 1))
    for bi, nm in enumerate(names):
        ids = [k for k, v in own.items() if v == bi and sizes[k - 1] >= 12]   # specks dropped
        m = np.isin(lab, ids); ys, xs = np.nonzero(m)
        if not len(ys): print(nm, 'EMPTY CELL'); continue
        y0, y1, x0, x1 = max(0, ys.min() - 3), min(h, ys.max() + 4), max(0, xs.min() - 3), min(w, xs.max() + 4)
        c = rgba[y0:y1, x0:x1].copy(); c[..., 3] = np.where(m[y0:y1, x0:x1], c[..., 3], 0)
        o = Image.fromarray(c, 'RGBA'); gw, gh = size(nm, o); cap = round(RES * gw)
        if o.width > cap: o = o.convert('RGBa').resize((cap, max(1, round(o.height * cap / o.width))), Image.LANCZOS).convert('RGBA')
        o.save(OUT + nm + '.webp', quality=90, method=6)
        touch = [s for s, v in (('left', x0 <= 0), ('top', y0 <= 0), ('right', x1 >= w), ('bottom', y1 >= h)) if v]
        print('%-16s %4dx%-4d game %3dx%-3d anchor %.3f,%.3f%s' % ((nm, o.width, o.height, gw, gh) + anchor(nm, o)[:2] + ((('  touches ' + ','.join(touch)) if touch else ''),)))


def cut_tex(code, src):
    os.makedirs(OUT, exist_ok=True); os.makedirs(KEEP, exist_ok=True)
    keep = KEEP + code + '.webp'
    if os.path.abspath(src) != os.path.abspath(keep): Image.open(src).convert('RGB').save(keep, quality=95, method=6)
    r = subprocess.run([sys.executable, '-I', R + 'tools/seamless_tex.py', keep, OUT + TEXS[code] + '.webp', 'size=1024', 'q=88'], capture_output=True, text=True)
    print(TEXS[code], r.stdout.strip().replace('\n', ' | '), r.stderr.strip()[-300:])


def cat():
    entries = {}
    for code, (cols, rows, names) in SHEETS.items():
        for nm in names:
            f = OUT + nm + '.webp'
            if not os.path.exists(f): continue
            im = Image.open(f); d = P[nm]; w, h = size(nm, im); ax, ay, ex = anchor(nm, im)
            e = {'w': round(w, 1), 'h': round(h, 1), 'd': 'iso', 'ax': ax, 'ay': ay, 't': d['t'], 'c': ex['c'], 'cap': d['cap'], 'nf': 1, 'ec': 1}
            if ex.get('cs'): e['cs'] = ex['cs']
            if d['sw']: e['sw'] = d['sw']
            if d['fill']: e['fill'] = 1
            entries[nm] = e
    for t in TEXS.values():
        if os.path.exists(OUT + t + '.webp'): entries[t] = {'t': 'tex', 'd': 'iso'}
    js = ('/* GENERATED by tools/iso_art.py cat — isometric 2.5D snow kit: map pieces + ground textures (ISO_MAP_TH.md §9–10).\n'
          '   Edit the P table in tools/iso_art.py and run it again; do not edit this file. Pictures: maps/iso/<name>.webp.\n'
          '   nf:1 = never mirrored (lit from the upper left like the 2.5D heroes) · ec:1 = collision centred on the anchor (the footprint middle)\n'
          '   · fill:1 = may stand side by side in a forest mass. */\n'
          'Object.assign(window.VK_CAT=window.VK_CAT||{},' + json.dumps(entries, separators=(',', ':')) + ');\n')
    open(R + 'maps/iso-cat.js', 'w').write(js)
    print('maps/iso-cat.js:', len(entries), 'entries')


def preview(out, codes):
    """every piece at its in-game size ×1.5 on a checkerboard: red dot = anchor (sort point), yellow = collision"""
    F = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 15)
    names = [n for c in (codes or SHEETS) for n in SHEETS[c][2] if os.path.exists(OUT + n + '.webp')]
    K = 1.5; items = []
    for n in names:
        im = Image.open(OUT + n + '.webp').convert('RGBA'); gw, gh = size(n, im); w = round(gw * K); h = round(gh * K)
        items.append((n, im.resize((w, h), Image.LANCZOS), anchor(n, im), gw, gh))
    W = 1800; x = y = 10; rowh = 0; places = []
    for it in items:
        if x + it[1].width + 10 > W: x = 10; y += rowh + 34; rowh = 0
        places.append((x, y) + it); x += it[1].width + 16; rowh = max(rowh, it[1].height)
    Hh = y + rowh + 40
    sh = Image.new('RGB', (W, Hh)); dr = ImageDraw.Draw(sh)
    for yy in range(0, Hh, 24):
        for xx in range(0, W, 24): dr.rectangle((xx, yy, xx + 23, yy + 23), fill=(205, 196, 176) if (xx // 24 + yy // 24) % 2 else (58, 64, 74))
    for x, y, n, im, (ax, ay, ex), gw, gh in places:
        sh.paste(im, (x, y), im); px, py = x + ax * im.width, y + ay * im.height; w = gw * K
        c = ex.get('c')
        if isinstance(c, (int, float)): r = c * gw * .9 * K; dr.ellipse((px - r, py - r, px + r, py + r), outline=(255, 220, 40), width=2)
        elif isinstance(c, list): rx, ry = c[0] * w, c[1] * w; dr.ellipse((px - rx, py - ry, px + rx, py + ry), outline=(255, 220, 40), width=2)
        for cx, cy, cr in ex.get('cs') or []:
            qx, qy, rr = px + cx * w, py + cy * w, cr * w; dr.ellipse((qx - rr, qy - rr, qx + rr, qy + rr), outline=(255, 220, 40), width=2)
        dr.ellipse((px - 4, py - 4, px + 4, py + 4), fill=(230, 30, 30))
        dr.text((x, y + im.height + 2), '%s %d×%d %s' % (n, gw, gh, P[n]['t']), fill=(255, 240, 170), font=F, stroke_width=2, stroke_fill=(20, 16, 12))
    sh.save(out, quality=86); print(out, sh.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'sheet': cut_sheet(a[1], a[2])
    elif a[0] == 'recut':
        for c in (a[1:] or [c for c in SHEETS if os.path.exists(KEEP + c + '.webp')]): print('==', c); cut_sheet(c, KEEP + c + '.webp')
    elif a[0] == 'tex': cut_tex(a[1], a[2])
    elif a[0] == 'cat': cat()
    elif a[0] == 'preview': preview(a[1], a[2:])
    else: sys.exit(__doc__)
