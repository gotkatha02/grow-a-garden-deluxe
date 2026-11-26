"""Camera + size guide for the isometric (2.5D, Ragnarok 3 style) map pictures.

  python3 -I tools/iso_guide.py [out.jpg]      → tools/ref/iso_camera_guide.jpg (1536x1024)

What ChatGPT should copy from it: the camera only — the world turned 45 degrees (paths, walls,
fences and cliff edges run diagonally, buildings show two walls + the roof), looking down at the
game's own angle (K = 0.62 in index.html: a ground circle is an ellipse 1 / 0.62 = 1.6 times wider
than tall), no perspective, light from the upper left, shadows to the lower right, and the size of a
hero (the 2.5D wolf and rhino drawn at their in-game height for a floor picture drawn x1.5:
wolf .787 x 72.5 / 1.5 = 38 px, rhino .882 x 72.5 / 1.5 = 43 px).
Everything is plain grey on purpose (no colours or textures for ChatGPT to copy). No text."""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'tools/ref/iso_camera_guide.jpg')
W, H, SS = 1536, 1024, 2                 # drawn at 2x, then downsampled
K = 0.62                                 # ground squash of the game (index.html const K)
HW = 40.0                                # half width of one ground tile (picture px)
HH = HW * K
ZH = HW * math.sqrt(2) * math.sqrt(1 - K * K)   # one tile of height in picture px (~44)
OX, OY = W / 2, 120.0

INK = (61, 51, 44, 255)
TOP, LIT, DARK = (246, 247, 249, 255), (196, 201, 210, 255), (139, 147, 161, 255)
ROOF_N, ROOF_F = (178, 172, 170, 255), (150, 144, 142, 255)
GROUND, GRID, PATH = (233, 237, 243), (205, 212, 223, 255), (218, 223, 231, 255)
SHADOW = (120, 132, 156, 70)


def P(u, v, z=0.0):
    """ground tile coords (u → lower right, v → lower left) + height in tiles → picture px (x2)"""
    return ((OX + (u - v) * HW) * SS, (OY + (u + v) * HH - z * ZH) * SS)


def at(sx, sy):
    """ground point under picture px (sx, sy) → (u, v)"""
    a, b = (sx - OX) / HW, (sy - OY) / HH
    return (a + b) / 2, (b - a) / 2


img = Image.new('RGBA', (W * SS, H * SS), GROUND + (255,))
d = ImageDraw.Draw(img, 'RGBA')
LW = 2 * SS


def poly(pts, fill, ink=True, w=LW):
    d.polygon(pts, fill=fill)
    if ink:
        d.line(pts + [pts[0]], fill=INK, width=w, joint='curve')


# ---------------------------------------------------------------- ground grid + a diagonal path
for k in range(-60, 61):
    d.line([P(k, -60), P(k, 60)], fill=GRID, width=SS)
    d.line([P(-60, k), P(60, k)], fill=GRID, width=SS)
pu, pv = at(300, 1000)
qu, qv = at(1300, 380)
for t in np.linspace(0, 1, 400):                       # soft packed-snow path running along -v (bottom left → top right)
    u, v = pu + (qu - pu) * t, pv + (qv - pv) * t
    x, y = P(u, v)
    d.ellipse([x - 46 * SS, y - 46 * SS * K, x + 46 * SS, y + 46 * SS * K], fill=PATH)


def shadow(u0, u1, v0, v1, h):
    """cast shadow of a block toward the lower right (+u), length from its height"""
    L = h * .9
    pts = [P(u0, v0), P(u1 + L, v0 - L * .25), P(u1 + L, v1 - L * .25), P(u1, v1), P(u0, v1)]
    d.polygon(pts, fill=SHADOW)


def box(u0, u1, v0, v1, z0, z1, top=TOP, lit=LIT, dark=DARK):
    poly([P(u1, v0, z0), P(u1, v1, z0), P(u1, v1, z1), P(u1, v0, z1)], dark)     # +u face → faces lower right (shadow side)
    poly([P(u0, v1, z0), P(u1, v1, z0), P(u1, v1, z1), P(u0, v1, z1)], lit)      # +v face → faces lower left (lit side)
    poly([P(u0, v0, z1), P(u1, v0, z1), P(u1, v1, z1), P(u0, v1, z1)], top)


def ground_circle(u, v, r):
    x, y = P(u, v)
    rx, ry = r * HW * math.sqrt(2) * SS, r * HW * math.sqrt(2) * K * SS
    d.ellipse([x - rx, y - ry, x + rx, y + ry], outline=INK, width=LW)


# ---------------------------------------------------------------- pieces (back to front)
# plateau upper left with carved stairs down its lower-right (+u) face
pu0, pv0 = at(430, 300)
PU0, PU1, PV0, PV1, PZ = pu0 - 3, pu0 + 2.6, pv0 - 2.6, pv0 + 2.4, 1.35
shadow(PU0, PU1, PV0, PV1, PZ)
box(PU0, PU1, PV0, PV1, 0, PZ)
SV0, SV1, NST = pv0 - 1.1, pv0 + .3, 6
for i in range(NST):                                   # steps go down toward the middle of the picture
    z = PZ * (NST - i) / (NST + 1)
    box(PU1 + i * .42, PU1 + (i + 1) * .42, SV0, SV1, 0, z)

# second, low terrace on the right (half a hero high): shows how a small height step reads
tu, tv = at(1240, 330)
shadow(tu - 2, tu + 2, tv - 1.5, tv + 1.5, .55)
box(tu - 2, tu + 2, tv - 1.5, tv + 1.5, 0, .55)

# house in the middle right: two walls + gable roof (ridge along u), a door on the lit (lower-left) wall
hu, hv = at(980, 470)
U0, U1, V0, V1, EAVE, RIDGE, OV = hu - 1.6, hu + 1.6, hv - 1.05, hv + 1.05, 1.55, 2.55, .22
shadow(U0, U1, V0, V1, RIDGE)
box(U0, U1, V0, V1, 0, EAVE, top=LIT)
vc = (V0 + V1) / 2
poly([P(U0 - OV, V0 - OV, EAVE - .12), P(U1 + OV, V0 - OV, EAVE - .12), P(U1 + OV, vc, RIDGE), P(U0 - OV, vc, RIDGE)], ROOF_F)   # far slope
poly([P(U1, V0, EAVE), P(U1, V1, EAVE), P(U1, vc, RIDGE)], DARK)                                                                  # gable end (+u face)
poly([P(U0 - OV, V1 + OV, EAVE - .12), P(U1 + OV, V1 + OV, EAVE - .12), P(U1 + OV, vc, RIDGE), P(U0 - OV, vc, RIDGE)], ROOF_N)   # near slope
du0, du1 = hu - .35, hu + .35                                                    # door: about 1.25 heroes tall
poly([P(du0, V1, 0), P(du1, V1, 0), P(du1, V1, 1.05), P(du0, V1, 1.05)], (96, 92, 96, 255))
# small window on the shadow wall
poly([P(U1, vc - .3, .7), P(U1, vc + .3, .7), P(U1, vc + .3, 1.15), P(U1, vc - .3, 1.15)], (96, 92, 96, 255))


def fence(u0, v0, u1, v1, n):
    pts = [(u0 + (u1 - u0) * i / (n - 1), v0 + (v1 - v0) * i / (n - 1)) for i in range(n)]
    for z in (.32, .62):
        d.line([P(u0, v0, z), P(u1, v1, z)], fill=INK, width=LW + 2 * SS)
        d.line([P(u0, v0, z), P(u1, v1, z)], fill=LIT, width=2 * SS)
    for u, v in pts:
        x0, y0 = P(u, v, 0)
        x1, y1 = P(u, v, .8)
        d.line([(x0, y0), (x1, y1)], fill=INK, width=7 * SS)
        d.line([(x0, y0 - SS), (x1, y1 + SS)], fill=LIT, width=3 * SS)


fu, fv = at(520, 640)
fence(fu, fv, fu + 4, fv, 5)                           # fence along u: runs to the lower right
gu, gv = at(1180, 690)
fence(gu, gv, gu, gv - 4, 5)                           # fence along -v: runs to the upper right


def tree(sx, sy, h):
    u, v = at(sx, sy)
    shadow(u - .4, u + .4, v - .4, v + .4, h * .55)
    x, y = P(u, v)
    tw, th = 10 * SS, .9 * ZH * SS
    d.rectangle([x - tw / 2, y - th, x + tw / 2, y], fill=DARK, outline=INK, width=LW)
    for i, (w, top, bot) in enumerate([(1.25, .45, .05), (1.0, .68, .3), (.72, .9, .55), (.42, 1.0, .78)]):
        rx = w * HW * SS
        yb, yt = y - (th + (h * ZH * SS - th) * bot), y - (th + (h * ZH * SS - th) * top) - 18 * SS
        cone = [(x - rx, yb), (x, yt), (x + rx, yb)]
        d.ellipse([x - rx, yb - rx * K * .5, x + rx, yb + rx * K * .5], fill=LIT, outline=INK, width=LW)
        poly(cone, LIT)
        d.polygon([(x + 2, yb), (x, yt + 4), (x + rx - 2, yb)], fill=DARK)


tree(250, 760, 4.8)
tree(1330, 820, 5.2)
tree(1430, 560, 3.6)

ru, rv = at(720, 820)
ground_circle(ru, rv, 1.6)                             # a circle on the ground: 1.6 times wider than tall
bu, bv = at(1080, 900)
shadow(bu - .9, bu + .9, bv - .7, bv + .7, .8)
box(bu - .9, bu + .9, bv - .7, bv + .7, 0, .8)           # a low crate / rock block about two thirds of a hero

# ---------------------------------------------------------------- heroes at their in-game size (picture drawn x1.5 in the game)
small = img.resize((W, H), Image.LANCZOS)


def hero(path, height):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.int16)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    a = np.clip(255 - (g - np.maximum(r, b) - 40) * 6, 0, 255).astype(np.uint8)
    a[(g > 150) & (r < 120) & (b < 120)] = 0
    rgb = im.copy()
    spill = g > np.maximum(r, b)
    rgb[..., 1] = np.where(spill, np.maximum(r, b), g)
    out = Image.fromarray(np.dstack([rgb.astype(np.uint8), a]), 'RGBA')
    out = out.crop(out.getbbox())
    k = height / out.height
    return out.resize((max(1, round(out.width * k)), round(height)), Image.LANCZOS)


wolf = hero(os.path.join(ROOT, 'assets/heroes/wolf/view25_SE.webp'), 38)
rhino = hero(os.path.join(ROOT, 'assets/heroes/rhino/view25_SE.webp'), 43)
sd = ImageDraw.Draw(small, 'RGBA')


def put(fig, sx, sy):
    sd.ellipse([sx - fig.width * .42, sy - 4, sx + fig.width * .42, sy + 4], fill=(90, 100, 125, 90))
    small.alpha_composite(fig, (round(sx - fig.width / 2), round(sy - fig.height + 2)))


x, y = P(hu, V1 + .55)
put(wolf, x / SS - 6, y / SS)                          # at the house door
x, y = P(PU0 + 2.2, PV0 + 2.6, PZ)
put(wolf, x / SS, y / SS)                              # on the plateau
x, y = P(ru, rv)
put(rhino, x / SS, y / SS)                             # in the ground circle
put(wolf, 1290, 870)                                   # beside a big tree
put(rhino, 610, 980)
small.convert('RGB').save(OUT, quality=92)
print(OUT, small.size, 'tile', HW * 2, 'x', round(HH * 2, 1), 'height/tile', round(ZH, 1))
