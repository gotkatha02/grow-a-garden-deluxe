"""Rune art pictures (RUNE_ART_PROMPTS_TH.md) -> game files.
usage (run from the repo root, python3 -I):
  rune_art.py icons <cut dir>                 sr_*.png / c_*.png cut by tools/iconsheet.py (plain mode) -> assets/rune/icons/<key>.webp
  rune_art.py spirit <animal> <picture.png>   transparent spirit picture -> assets/rune/spirit/<animal>.webp (trimmed, max 512 px)
  rune_art.py pic <cut png> <key>             one cut picture -> assets/rune/icons/<key>.webp (sheet ง2: rsap, rdew)
  rune_art.py goods <cut dir>                 goods sheet cut with keys g01..g13 (iconsheet.py size 256) -> assets/rune/icons:
      rstone0/1/2 = g01 with its glowing spiral recoloured to the grade colour (B green / A blue / S gold),
      rg1–3 = g08 crystal recoloured jade / sapphire / ruby, rg4 = g09 (cosmic stone), rmedal = g03, rbag = g11,
      rfeather = g04 (shaman scroll), sdust = g10 (spirit flame), ring_btn = g12 (menu button of the ring)
Every icon is a 128 px lossless-alpha WEBP (q 90).
Add every key written here to ICON_HAVE / SPIRIT_HAVE in rune_data.js."""
import sys, os, numpy as np
from PIL import Image

OUT = 'assets/rune/icons'


def save(im, key, size=128):
    im.convert('RGBA').resize((size, size), Image.LANCZOS).save(f'{OUT}/{key}.webp', 'WEBP', quality=90, method=6)


def hsv(a):
    r, g, b = a[..., 0] / 255, a[..., 1] / 255, a[..., 2] / 255
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 0, d / (mx + 1e-9), 0)
    return h, s, mx


def from_hsv(h, s, v):
    c = v * s; x = c * (1 - np.abs((h / 60) % 2 - 1)); m = v - c
    k = (h // 60).astype(int) % 6
    r = np.choose(k, [c, x, 0 * c, 0 * c, x, c]); g = np.choose(k, [x, c, c, x, 0 * c, 0 * c]); b = np.choose(k, [0 * c, 0 * c, x, c, c, x])
    return np.stack([(r + m), (g + m), (b + m)], -1) * 255


def recolour(src, key, h0, h1, to, sat=1.0, val=1.0):
    """pixels whose hue is in [h0,h1] (and are coloured) move to hue `to`; whites / golds / greys stay"""
    im = Image.open(src).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    h, s, v = hsv(a)
    m = (h >= h0) & (h <= h1) & (s > .18)
    w = np.clip((s - .18) / .2, 0, 1) * m                       # soft edge so the glow fades into white cores
    nh = np.where(m, to, h); ns = np.clip(s * np.where(m, sat, 1), 0, 1); nv = np.clip(v * np.where(m, val, 1), 0, 1)
    rgb = from_hsv(nh, ns, nv)
    out = a.copy(); out[..., :3] = a[..., :3] * (1 - w[..., None]) + rgb * w[..., None]
    save(Image.fromarray(out.clip(0, 255).astype(np.uint8)), key)


def main():
    cmd = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    if cmd == 'icons':
        d = sys.argv[2]; n = 0
        for f in sorted(os.listdir(d)):
            if f.endswith('.png') and (f.startswith('sr_') or f.startswith('c_')):
                save(Image.open(os.path.join(d, f)), f[:-4]); n += 1
        print(n, 'icons ->', OUT)
    elif cmd == 'spirit':
        a, src = sys.argv[2], sys.argv[3]
        im = Image.open(src).convert('RGBA'); al = np.asarray(im)[..., 3]
        ys, xs = np.where(al > 8); im = im.crop((max(0, xs.min() - 4), max(0, ys.min() - 4), min(im.width, xs.max() + 5), min(im.height, ys.max() + 5)))
        im.thumbnail((512, 512), Image.LANCZOS)
        os.makedirs('assets/rune/spirit', exist_ok=True)
        im.save(f'assets/rune/spirit/{a}.webp', 'WEBP', quality=86, method=6)
        print(a, im.size)
    elif cmd == 'goods':
        d = sys.argv[2]
        g = lambda k: os.path.join(d, k + '.png')
        # raw rune stones: the cyan spiral glow (hue ~175–215) takes the grade colour
        recolour(g('g01'), 'rstone0', 165, 225, 118, sat=1.05, val=.95)     # B green
        recolour(g('g01'), 'rstone1', 165, 225, 207, sat=1.0, val=1.0)      # A blue
        recolour(g('g01'), 'rstone2', 165, 225, 44, sat=1.15, val=1.0)      # S gold
        recolour(g('g08'), 'rg1', 175, 260, 150, sat=1.0, val=.95)          # jade
        recolour(g('g08'), 'rg2', 175, 260, 214, sat=1.0, val=1.0)          # sapphire
        recolour(g('g08'), 'rg3', 175, 260, 352, sat=1.05, val=.95)         # ruby
        for src, key in (('g09', 'rg4'), ('g03', 'rmedal'), ('g11', 'rbag'), ('g04', 'rfeather'), ('g10', 'sdust'), ('g12', 'ring_btn')):
            save(Image.open(g(src)), key)
        print('goods ->', OUT)
    elif cmd == 'pic':                                   # one more cut picture under its own key (e.g. rsap / rdew of sheet ง2)
        save(Image.open(sys.argv[2]), sys.argv[3]); print(sys.argv[3], '->', OUT)


main()
