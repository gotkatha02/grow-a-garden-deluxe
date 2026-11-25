"""Sea zone art (SEA_ZONE_TH.md · SEA_ART_PROMPTS_TH.md §8): the owner's pictures → the game's folders.

  python3 -I tools/sea_art.py sheet <code> <sheet.png>    S1…S21 map-piece sheet on green (S12 on magenta): key it with the
                                                          boss keyer (tools/wboss_arenas.py key_sheet), split it by its grid
                                                          (a loose bit belongs to the cell its centre is in) → maps/sea/<name>.webp;
                                                          the sheet itself is kept as assets/sea/sheets/<code>.webp (for re-cuts)
  python3 -I tools/sea_art.py recut [<code> …]            cut again from the kept sheets (all codes that have one)
  python3 -I tools/sea_art.py npc <key> <picture.png>     N1–N4 (left = front, right = 3/4 turned left) → assets/npc/<key>_front.webp
                                                          + _side.webp, 300 px tall like the land NPCs; prints the AX values for npcs.js
  python3 -I tools/sea_art.py boss <key> <picture.png>    B1–B4 master picture → assets/bosses/sea/<key>.png (as received) + <key>_cut.webp
                                                          (keyed, every pixel despilled — the bosses have no green by design — trimmed)
  python3 -I tools/sea_art.py mon <camelName> <sheet.png> [layout=W|A]   monster sheet (5 rows 4/4/5/2/5 on green) → tools/monsheet2.py
                                                          (layout from the MON table: W = outlines, A = the prompt's rows where W split
                                                          a lying frame) → assets/monsters/<camelName>.webp; the last death frame
                                                          (ChatGPT paints it as a see-through figure over the green → olive tint) is
                                                          replaced by the 4th death frame at 45 % alpha; prints the line for monster-sprites.js
  python3 -I tools/sea_art.py cat                          write maps/sea-cat.js = VK_CAT entries of every cut piece + the sea textures
  python3 -I tools/sea_art.py preview <out.jpg> [code …]  every piece at its in-game size ×1.5 on a checkerboard, foot line in red

Map pieces: P below = in-game width (map px, the hero is ~72 tall), type (tree / prop / big / flat / water), collision
(c = circle radius × w · [rx, ry] ellipse × w · 'gate' / 'posts' / 'log' = fieldmap.js shapes · None = walk over it), cap
(repetition: common / mid / semi / unique), sw (sway). The height comes from the picture, ay (foot, 0–1 of the height) is
measured: the widest line of the piece's footing (sand patch, foam ring) in its lowest 35 %, unless P gives ay.
Pictures are kept at the sheet's resolution, at most 2.6 × their in-game width (sharp on a zoomed phone, not wasteful).
Textures: tools/seamless_tex.py (maps/sea/oc<Name>.webp, 640²) — listed in TEX below so `cat` registers them."""
import importlib.util, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
OUT = R + 'maps/sea/'
KEEP = R + 'assets/sea/sheets/'
NPC = R + 'assets/npc/'
RES = 2.6

SHEETS = {   # code: (cols, rows, names in reading order)
 'S1': (3, 2, ['ocRootArch', 'ocRootArchW', 'ocRootCrystal', 'ocRootStump', 'ocRootLog', 'ocRootFingers']),
 'S2': (3, 2, ['ocBoulder', 'ocRockPool', 'ocStack', 'ocStepStones', 'ocPebbles', 'ocRockArch']),
 'S3': (4, 3, ['ocShells', 'ocConch', 'ocStarfish', 'ocSandcastle', 'ocDriftLog', 'ocDriftBranch', 'ocNetPoles', 'ocCrabTrap',
               'ocBarrel', 'ocCrateCoins', 'ocFloats', 'ocRowboat']),
 'S4': (3, 2, ['ocWreckVik', 'ocWreckGrk', 'ocWreckJpn', 'ocWreckEgy', 'ocWreckAzt', 'ocWhaleBones']),
 'S5': (3, 2, ['ocFloatBarrel', 'ocBuoy', 'ocKelpRaft', 'ocTotemLog', 'ocIslet', 'ocWaveCurl']),
 'S6': (2, 2, ['ocStiltHouse1', 'ocStiltHouse2', 'ocElderHut', 'ocHarbourOffice']),
 'S7': (2, 2, ['ocLighthouse', 'ocSmithy', 'ocWarehouse', 'ocTavern']),
 'S8': (3, 2, ['ocPier', 'ocPierEnd', 'ocFerryGate', 'ocStallFish', 'ocStallPearl', 'ocClamFountain']),
 'S9': (3, 2, ['ocShipVik', 'ocShipGrk', 'ocShipEgy', 'ocShipAzt', 'ocTurtleFerry', 'ocFishBoat']),
 'S10': (4, 3, ['ocPearlLamp', 'ocCrates', 'ocBarrels', 'ocBollard', 'ocLobsterPots', 'ocFishRack', 'ocSignpost', 'ocBench',
                'ocAnchorPost', 'ocCookFire', 'ocOarRack', 'ocChest']),
}

def p(w, t, c=None, cap='semi', sw=0, **k): return dict(w=w, t=t, c=c, cap=cap, sw=sw, **k)
P = {
 # S1 golden roots — the 'trees' of the surface maps (palms come from the Aztec / Egypt sets)
 'ocRootArch': p(270, 'big', 'gate', 'semi'), 'ocRootArchW': p(270, 'water', None, 'semi'),
 'ocRootCrystal': p(120, 'prop', .26, 'semi'), 'ocRootStump': p(104, 'prop', .3, 'common'),
 'ocRootLog': p(180, 'prop', 'log', 'semi'), 'ocRootFingers': p(92, 'prop', .22, 'common'),
 # S2 coast rocks
 'ocBoulder': p(112, 'prop', .36, 'common'), 'ocRockPool': p(150, 'prop', [.42, .14], 'semi'), 'ocStack': p(120, 'water', None, 'semi'),
 'ocStepStones': p(150, 'water', None, 'semi'), 'ocPebbles': p(90, 'flat', None, 'common'), 'ocRockArch': p(200, 'water', None, 'unique'),
 # S3 beach bits
 'ocShells': p(72, 'flat', None, 'common'), 'ocConch': p(58, 'flat', None, 'semi'), 'ocStarfish': p(62, 'flat', None, 'common'),
 'ocSandcastle': p(84, 'prop', .3, 'unique'), 'ocDriftLog': p(112, 'prop', 'log', 'semi'), 'ocDriftBranch': p(92, 'flat', None, 'semi'),
 'ocNetPoles': p(112, 'prop', 'posts', 'semi'), 'ocCrabTrap': p(80, 'prop', .3, 'semi'), 'ocBarrel': p(72, 'prop', .3, 'semi'),
 'ocCrateCoins': p(82, 'prop', .32, 'unique'), 'ocFloats': p(70, 'flat', None, 'semi'), 'ocRowboat': p(124, 'prop', [.36, .1], 'unique'),
 # S4 wrecks of the five lands (Wreck Coast, Rán's map)
 'ocWreckVik': p(360, 'big', [.38, .12], 'unique'), 'ocWreckGrk': p(360, 'big', [.38, .12], 'unique'),
 'ocWreckJpn': p(340, 'big', [.38, .12], 'unique'), 'ocWreckEgy': p(320, 'big', [.38, .11], 'unique'),
 'ocWreckAzt': p(320, 'big', [.38, .1], 'unique'), 'ocWhaleBones': p(380, 'big', [.34, .08], 'unique'),
 # S5 sea floats (bob on the water)
 'ocFloatBarrel': p(80, 'water', None, 'semi'), 'ocBuoy': p(78, 'water', None, 'semi'), 'ocKelpRaft': p(124, 'water', None, 'common'),
 'ocTotemLog': p(140, 'water', None, 'unique'), 'ocIslet': p(150, 'water', None, 'semi'), 'ocWaveCurl': p(124, 'water', None, 'common'),
 # S6 harbour houses (Rootarch Haven)
 'ocStiltHouse1': p(300, 'big', [.44, .2], 'unique'), 'ocStiltHouse2': p(290, 'big', [.44, .2], 'unique'),
 'ocElderHut': p(290, 'big', [.44, .21], 'unique'), 'ocHarbourOffice': p(300, 'big', [.44, .2], 'unique'),
 # S7 landmarks
 'ocLighthouse': p(250, 'big', [.4, .16], 'unique'), 'ocSmithy': p(320, 'big', [.44, .2], 'unique'),
 'ocWarehouse': p(320, 'big', [.44, .2], 'unique'), 'ocTavern': p(330, 'big', [.44, .21], 'unique'),
 # S8 harbour
 'ocPier': p(430, 'flat', None, 'unique', ay=.5), 'ocPierEnd': p(270, 'flat', None, 'unique', ay=.5),
 'ocFerryGate': p(250, 'big', 'gate', 'unique'), 'ocStallFish': p(150, 'prop', [.42, .1], 'unique'),
 'ocStallPearl': p(150, 'prop', [.42, .1], 'unique'), 'ocClamFountain': p(180, 'big', [.4, .15], 'unique'),
 # S9 ships moored in the harbour (the Japanese one is jpShip)
 'ocShipVik': p(380, 'water', None, 'unique'), 'ocShipGrk': p(380, 'water', None, 'unique'), 'ocShipEgy': p(360, 'water', None, 'unique'),
 'ocShipAzt': p(340, 'water', None, 'unique'), 'ocTurtleFerry': p(340, 'water', None, 'unique'), 'ocFishBoat': p(220, 'water', None, 'semi'),
 # S10 harbour bits
 'ocPearlLamp': p(60, 'prop', .16, 'semi'), 'ocCrates': p(92, 'prop', .34, 'semi'), 'ocBarrels': p(82, 'prop', .34, 'semi'),
 'ocBollard': p(58, 'prop', .3, 'semi'), 'ocLobsterPots': p(82, 'prop', .32, 'semi'), 'ocFishRack': p(112, 'prop', [.42, .06], 'semi'),
 'ocSignpost': p(80, 'prop', .16, 'unique'), 'ocBench': p(92, 'prop', [.42, .06], 'semi'), 'ocAnchorPost': p(84, 'prop', .2, 'unique'),
 'ocCookFire': p(92, 'prop', .3, 'semi'), 'ocOarRack': p(104, 'prop', [.42, .06], 'semi'), 'ocChest': p(72, 'prop', .34, 'unique'),
}
TEX = ['ocSand', 'ocWetSand', 'ocLagoon', 'ocDeep', 'ocPlanks', 'ocShellPave']   # batch 1 (T1–T6); T7–T15 follow


def mod(name, path):
    spec = importlib.util.spec_from_file_location(name, R + path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def keyer(): return mod('wa', 'tools/wboss_arenas.py').key_sheet


def grid(cols, rows, w, h): return [(c * w // cols, r * h // rows, (c + 1) * w // cols, (r + 1) * h // rows) for r in range(rows) for c in range(cols)]


def foot(a):
    """ay: widest line of the footing (sand patch / foam ring) in the lowest 35 % of the alpha mask"""
    m = a > 40; ys = np.nonzero(m.any(1))[0]; y0, y1 = ys[0], ys[-1]; H = y1 - y0 + 1
    wid = np.array([(lambda xs: xs[-1] - xs[0] + 1 if len(xs) else 0)(np.nonzero(m[y])[0]) for y in range(y0, y1 + 1)])
    lo = int(H * .65); band = wid[lo:]
    if not len(band) or band.max() <= 0: return .9
    best = lo + np.median(np.nonzero(band >= band.max() * .97)[0])
    return float(round(min(.98, max(.5, (best + .5) / H)), 3))


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
    for bi, nm in enumerate(names):
        m = np.isin(lab, [k for k, v in own.items() if v == bi]); ys, xs = np.nonzero(m)
        if not len(ys): print(nm, 'EMPTY CELL'); continue
        y0, y1, x0, x1 = max(0, ys.min() - 3), min(h, ys.max() + 4), max(0, xs.min() - 3), min(w, xs.max() + 4)
        c = rgba[y0:y1, x0:x1].copy(); c[..., 3] = np.where(m[y0:y1, x0:x1], c[..., 3], 0)
        o = Image.fromarray(c, 'RGBA'); cap = round(RES * P[nm]['w'])
        if o.width > cap: o = o.convert('RGBa').resize((cap, max(1, round(o.height * cap / o.width))), Image.LANCZOS).convert('RGBA')
        o.save(OUT + nm + '.webp', quality=90, method=6)
        touch = [s for s, v in (('left', x0 <= 0), ('top', y0 <= 0), ('right', x1 >= w), ('bottom', y1 >= h)) if v]
        print('%-16s %4dx%-4d ay %.3f%s' % (nm, o.width, o.height, foot(np.asarray(o)[..., 3]), ('  touches ' + ','.join(touch)) if touch else ''))


def cut_npc(key, src):
    rgba = keyer()(src, True); h, w = rgba.shape[:2]; al = rgba[..., 3] > 15
    cols = al.sum(0); mid = w // 2; win = cols[w // 4: 3 * w // 4]; gap = w // 4 + int(np.argmin(np.convolve(win, np.ones(15), 'same')))
    out = {}
    for pose, (x0, x1) in (('front', (0, gap)), ('side', (gap, w))):
        part = rgba[:, x0:x1]; m = part[..., 3] > 15; lab, n = nd.label(m, structure=np.ones((3, 3)))
        sz = nd.sum(m, lab, range(1, n + 1)); big = int(np.argmax(sz)) + 1
        keepm = np.zeros_like(m)
        for i, s in enumerate(sz):   # the figure + bits close to it (a feather, a whisker) — not stray specks
            if s >= 30: keepm |= (lab == i + 1)
        ys, xs = np.nonzero(keepm); y0, y1, xa, xb = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        c = part[y0:y1, xa:xb].copy(); c[..., 3] = np.where(keepm[y0:y1, xa:xb], c[..., 3], 0)
        o = Image.fromarray(c, 'RGBA'); k = 300 / o.height
        o = o.convert('RGBa').resize((max(1, round(o.width * k)), 300), Image.LANCZOS).convert('RGBA')
        o.save(NPC + key + '_' + pose + '.webp', quality=92, method=6)
        a = np.asarray(o)[..., 3] > 60; rows = np.nonzero(a.any(1))[0]; lo = rows[-1] - int(.06 * 300)
        xs2 = np.nonzero(a[lo:rows[-1] + 1].any(0))[0]; ax = round(float((xs2[0] + xs2[-1]) / 2 / o.width), 3)
        out[key + '_' + pose] = ax
        print('%s_%s %dx%d  AX %.3f' % (key, pose, o.width, o.height, ax))
    print(json.dumps(out))


def cut_boss(key, src):
    d = R + 'assets/bosses/sea/'; os.makedirs(d, exist_ok=True)
    if os.path.abspath(src) != os.path.abspath(d + key + '.png'): Image.open(src).convert('RGB').save(d + key + '.png', optimize=True)
    rgba = keyer()(src, True); o = Image.fromarray(rgba, 'RGBA'); bb = Image.fromarray(((rgba[..., 3] > 8) * 255).astype(np.uint8)).getbbox()
    o = o.crop((max(0, bb[0] - 2), max(0, bb[1] - 2), min(o.width, bb[2] + 2), min(o.height, bb[3] + 2)))
    o.save(d + key + '_cut.webp', quality=90, method=6); print(key, 'cut', o.size)


MON = {   # camelName: (name in the map files, on-map height h, extra options for monster-sprites.js S(), monsheet2 layout)
 # layout W (outlines) is the default; A (the prompt's own rows) where W split a lying death frame in two
 'goldshellHermitCrab': ('Goldshell Hermit Crab', 34, {}, 'A'), 'coconutCrabBrute': ('Coconut Crab Brute', 70, {'sw': 46}, 'W'),
 'thiefGull': ('Thief Gull', 36, {'fly': 1}, 'W'), 'tidepoolStarfish': ('Tidepool Starfish', 34, {}, 'W'),
 'foamSprite': ('Foam Sprite', 38, {'fly': 1}, 'W'), 'lagoonRay': ('Lagoon Ray', 46, {'fly': 1, 'sw': 40}, 'W'),
 'shellbackTurtle': ('Shellback Turtle', 46, {'sw': 40}, 'W'), 'barnacleGolem': ('Barnacle Golem', 72, {'sw': 46}, 'W'),
 'netWraith': ('Net Wraith', 54, {'fly': 1}, 'W'), 'barrelMimic': ('Barrel Mimic', 38, {}, 'W'),
 'drownedOarsman': ('Drowned Oarsman', 54, {}, 'A'),
}


def cut_mon(name, src, layout=None):
    import subprocess, tempfile, shutil
    layout = layout or MON[name][3]
    tmp = tempfile.mkdtemp()
    r = subprocess.run([sys.executable, '-I', R + 'tools/monsheet2.py', src, tmp + '/' + name, layout], capture_output=True, text=True)
    meta = json.loads(r.stdout.strip().splitlines()[-1]); print(r.stderr.strip().splitlines()[0] if r.stderr.strip() else '', meta)
    im = np.asarray(Image.open(tmp + '/' + name + '.webp').convert('RGBA')).copy(); cw, ch = meta['cw'], meta['ch']
    f4 = im[4 * ch:5 * ch, 3 * cw:4 * cw].copy(); f4[..., 3] = (f4[..., 3].astype(np.float32) * .45).astype(np.uint8)
    im[4 * ch:5 * ch, 4 * cw:5 * cw] = f4
    drop = 0
    for r in range(5):   # stray specks from a neighbouring frame: keep the body + pieces close to it or not tiny
        for c in range(5):
            cell = im[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw]; m = cell[..., 3] > 20; lab, n = nd.label(m, structure=np.ones((3, 3)))
            if n < 2: continue
            sz = nd.sum(m, lab, range(1, n + 1)); big = int(np.argmax(sz)) + 1; near = nd.binary_dilation(lab == big, iterations=12)
            for i, v in enumerate(sz):
                if i + 1 != big and v < .02 * sz.max() and not (near & (lab == i + 1)).any():
                    cell[lab == i + 1] = 0; drop += 1
    if drop: print('dropped', drop, 'stray specks')
    dst = R + 'assets/monsters/' + name + '.webp'; Image.fromarray(im, 'RGBA').save(dst, quality=92, method=6)
    shutil.copy(tmp + '/' + name + '_preview.png', '/tmp/' + name + '_preview.png'); shutil.rmtree(tmp)
    nm, h, o, _ = MON[name]; opt = (',' + json.dumps(o, separators=(',', ':')).replace('"', '')) if o else ''
    line = '  %s:S(%s,%d,%d,%d,%d,%d,%d%s),' % (json.dumps(nm), "'" + name + "'", cw, ch, meta['px'], meta['py'], meta['ref'], h, opt)
    print(line); return line


def cat():
    entries = {}
    for code, (cols, rows, names) in SHEETS.items():
        for nm in names:
            f = OUT + nm + '.webp'
            if not os.path.exists(f): continue
            im = Image.open(f); d = P[nm]; h = d['w'] * im.height / im.width
            e = {'w': d['w'], 'h': round(h, 1), 'd': 'sea', 'ay': d.get('ay') or foot(np.asarray(im)[..., 3]), 't': d['t'], 'c': d['c'], 'cap': d['cap']}
            if d['sw']: e['sw'] = d['sw']
            entries[nm] = e
    for t in TEX:
        if os.path.exists(OUT + t + '.webp'): entries[t] = {'t': 'tex', 'd': 'sea'}
    js = ('/* GENERATED by tools/sea_art.py cat — sea zone map pieces + textures (SEA_ZONE_TH.md, SEA_ART_PROMPTS_TH.md §8).\n'
          '   Edit the P table in tools/sea_art.py and run it again; do not edit this file. Pictures: maps/sea/<name>.webp */\n'
          'Object.assign(window.VK_CAT=window.VK_CAT||{},' + json.dumps(entries, separators=(',', ':')) + ');\n')
    open(R + 'maps/sea-cat.js', 'w').write(js)
    print('maps/sea-cat.js:', len(entries), 'entries')


def preview(out, codes):
    F = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 15)
    names = [n for c in (codes or SHEETS) for n in SHEETS[c][2] if os.path.exists(OUT + n + '.webp')]
    K = 1.5; items = []
    for n in names:
        im = Image.open(OUT + n + '.webp').convert('RGBA'); d = P[n]; w = round(d['w'] * K); h = round(w * im.height / im.width)
        items.append((n, im.resize((w, h), Image.LANCZOS), d.get('ay') or foot(np.asarray(im)[..., 3])))
    W = 1800; x = y = 10; rowh = 0; places = []
    for n, im, ay in items:
        if x + im.width + 10 > W: x = 10; y += rowh + 34; rowh = 0
        places.append((x, y, n, im, ay)); x += im.width + 16; rowh = max(rowh, im.height)
    Hh = y + rowh + 40
    sh = Image.new('RGB', (W, Hh)); dr = ImageDraw.Draw(sh)
    for yy in range(0, Hh, 24):   # checkerboard: light + dark so fringes show on both
        for xx in range(0, W, 24): dr.rectangle((xx, yy, xx + 23, yy + 23), fill=(205, 196, 176) if (xx // 24 + yy // 24) % 2 else (58, 64, 74))
    for x, y, n, im, ay in places:
        sh.paste(im, (x, y), im); fy = y + round(ay * im.height); dr.line((x, fy, x + im.width, fy), fill=(230, 40, 40), width=2)
        dr.text((x, y + im.height + 2), '%s %d×%d %s' % (n, P[n]['w'], round(P[n]['w'] * im.height / im.width), P[n]['t']), fill=(255, 240, 170), font=F, stroke_width=2, stroke_fill=(20, 16, 12))
    sh.save(out, quality=86); print(out, sh.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'sheet': cut_sheet(a[1], a[2])
    elif a[0] == 'recut':
        for c in (a[1:] or [c for c in SHEETS if os.path.exists(KEEP + c + '.webp')]): print('==', c); cut_sheet(c, KEEP + c + '.webp')
    elif a[0] == 'npc': cut_npc(a[1], a[2])
    elif a[0] == 'boss': cut_boss(a[1], a[2])
    elif a[0] == 'mon': cut_mon(a[1], a[2], *(x.split('=', 1)[1] for x in a[3:4]))
    elif a[0] == 'cat': cat()
    elif a[0] == 'preview': preview(a[1], a[2:])
    else: sys.exit(__doc__)
