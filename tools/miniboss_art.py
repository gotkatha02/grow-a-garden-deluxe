"""Mini-boss master pictures (MINI_BOSS_TH.md): the owner's pictures on flat green → assets/bosses/mini/.
usage: python3 -I tools/miniboss_art.py add <key> <picture.png> [<key> <picture.png> …]
         → assets/bosses/mini/<key>.webp      = the picture as received (green background, webp q95)
           assets/bosses/mini/<key>_cut.webp  = keyed + trimmed (boss keyer of tools/wboss_arenas.py; every pixel
                                                despilled: a mini-boss has no green by design)
       python3 -I tools/miniboss_art.py recut [<key> …]   → cut again from the stored raw <key>.webp (all keys that have one)
       python3 -I tools/miniboss_art.py sheet <out.jpg>   → overview of all 56 slots (picture or 'ยังไม่มีรูป')
       python3 -I tools/miniboss_art.py list              → keys with / without a picture
Keys = the third field of every entry in tools/miniboss_prompts.py LANDS (or PLANNED: the sea's keys, before its maps exist). After adding pictures re-run
`python3 tools/miniboss_prompts.py` (the doc's table shows which ones are in)."""
import os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
OUT = R + 'assets/bosses/mini/'
CUT_MAX = 640   # long side of the cut picture: the game draws a mini-boss ≤ 118 world px (≤ ~450 screen px on a sharp phone)


def mod(name, path):
    spec = importlib.util.spec_from_file_location(name, R + path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def lands():
    return mod('mb', 'tools/miniboss_prompts.py').LANDS


def planned():   # regions with prompt files only (the sea, Lv 60–70): pictures can come before their maps
    return getattr(mod('mb', 'tools/miniboss_prompts.py'), 'PLANNED', [])


def edges(path):
    """how many pixels of the figure touch each side of the picture (the figure was cut by the frame there)"""
    a = np.asarray(Image.open(path).convert('RGB')).astype(int)
    fg = (a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60
    s = {'top': fg[:3].any(0).sum(), 'bottom': fg[-3:].any(0).sum(), 'left': fg[:, :3].any(1).sum(), 'right': fg[:, -3:].any(1).sum()}
    return {k: int(v) for k, v in s.items() if v > 4}


def add(pairs):
    keys = {e[2] for L in lands() + planned() for e in L[4]}
    key_sheet = mod('wa', 'tools/wboss_arenas.py').key_sheet
    os.makedirs(OUT, exist_ok=True)
    for key, src in pairs:
        if key not in keys: sys.exit('unknown mini-boss key ' + key)
        if os.path.abspath(src) != os.path.abspath(OUT + key + '.webp'):
            Image.open(src).convert('RGB').save(OUT + key + '.webp', quality=95, method=6)
        rgba = key_sheet(src, True)
        o = Image.fromarray(rgba, 'RGBA'); bb = Image.fromarray(((rgba[..., 3] > 8) * 255).astype(np.uint8)).getbbox()
        o = o.crop((max(0, bb[0] - 2), max(0, bb[1] - 2), min(o.width, bb[2] + 2), min(o.height, bb[3] + 2)))
        if max(o.size) > CUT_MAX:   # premultiplied so the keyed edge does not pick up the background colour
            k = CUT_MAX / max(o.size); o = o.convert('RGBa').resize((max(1, round(o.width * k)), max(1, round(o.height * k))), Image.LANCZOS).convert('RGBA')
        o.save(OUT + key + '_cut.webp', quality=90, method=6)
        e = edges(src)
        print(key, 'cut', o.size, ('  touches the frame: ' + str(e)) if e else '')


def sheet(out):
    F = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 16); FB = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 26)
    T, LH, HD, G = 210, 46, 44, 6; L = lands(); cols = max(len(x[4]) for x in L)
    sh = Image.new('RGB', (cols * (T + G) + G, len(L) * (HD + T + LH + G) + G), (44, 38, 34)); d = ImageDraw.Draw(sh)

    def fit(s):
        while d.textlength(s, font=F) > T - 6 and len(s) > 2: s = s[:-2] + '…'
        return s
    y = G; tot = 0
    for fn, land, land_th, where, items in L:
        n = sum(os.path.exists(OUT + e[2] + '_cut.webp') for e in items); tot += n
        d.text((G + 4, y + 6), f'{land_th}  ({n}/{len(items)})', fill=(255, 226, 150), font=FB); y += HD
        for i, e in enumerate(items):
            x = G + i * (T + G); p = OUT + e[2] + '_cut.webp'
            d.rectangle([x, y, x + T - 1, y + T - 1], fill=(96, 86, 74))
            if os.path.exists(p):
                im = Image.open(p).convert('RGBA'); r = min((T - 10) / im.width, (T - 10) / im.height)
                im = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS); sh.paste(im, (x + (T - im.width) // 2, y + (T - im.height) // 2), im)
            else:
                d.rectangle([x + 8, y + 8, x + T - 9, y + T - 9], outline=(150, 130, 110), width=2)
                d.text((x + T // 2, y + T // 2), 'ยังไม่มีรูป', fill=(200, 180, 160), font=F, anchor='mm')
            d.text((x + 4, y + T + 3), fit(f'#{i + 1} {e[4]}'), fill=(255, 255, 255), font=F)
            d.text((x + 4, y + T + 23), fit(e[3]), fill=(190, 175, 160), font=F)
        y += T + LH + G
    sh.save(out, quality=86); print(out, sh.size, tot, 'pictures')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['add'] and len(a) >= 3 and len(a) % 2 == 1: add(list(zip(a[1::2], a[2::2])))
    elif a[:1] == ['recut']:
        ks = a[1:] or sorted(f[:-5] for f in os.listdir(OUT) if f.endswith('.webp') and not f.endswith('_cut.webp'))
        add([(k, OUT + k + '.webp') for k in ks])
    elif a[:1] == ['sheet'] and len(a) == 2: sheet(a[1])
    elif a[:1] == ['list']:
        for L in lands():
            have = [e[2] for e in L[4] if os.path.exists(OUT + e[2] + '_cut.webp')]
            print(L[2], len(have), '/', len(L[4]), 'missing:', [e[2] for e in L[4] if e[2] not in have])
    else: sys.exit(__doc__)
