"""Cut the owner's 5 wolf effect paintings (2026-11-26, prompts in WOLF_FX5_PLAN_TH.md §4) into game pictures.

python3 -I tools/fx/wolf_pics.py EXEC.png VALHALLA.png HOWL.png BANNER.png SHIELD.png [out=assets/fx/wolf] [preview=PNG]

Every input is a real transparent PNG (no keying). Each picture is trimmed to its pixels + a small margin and scaled;
the anchor table printed at the end (fractions of the OUTPUT picture) is what wolf_fx.js WPG uses:
  n01_exec_axe      crimson ghost axe, blade down          haft x, axe-head centre, blade tip
  n02_valhalla_axe  golden axe WITH its light rays         (Valhalla's falling god axe)
  n02_valhalla_core the same axe without rays / feathers   (Valhalla's dash swings): dark-outline fill for haft, wolf head,
                    ribbon + a traced polygon for the glowing blade (it has no dark outline and shares the rays' colours)
  n03_howl          spirit wolf head + gold sound arcs, facing right   head centre
  n04_banner        war banner on a stone pile                          pole x, ground line
  n05_rune_shield   round rune shield                                   centre
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

args = [a for a in sys.argv[1:] if '=' not in a]
kw = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
if len(args) != 5:
    sys.exit(__doc__)
OUT = kw.get('out', 'assets/fx/wolf')
os.makedirs(OUT, exist_ok=True)
EXEC, VAL, HOWL, BAN, SHIELD = args


def load(p):
    return Image.open(p).convert('RGBA')


def cut(im, name, size, by='h', pad=10, pts=None, q=90):
    """trim to alpha>8, pad, scale so that `by` side = size; return scale + offsets to map source points."""
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 8)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    c = im.crop((x0, y0, x1, y1))
    w, h = c.size
    k = size / (h if by == 'h' else w)
    pd = int(round(pad / k))
    cc = Image.new('RGBA', (w + 2 * pd, h + 2 * pd), (0, 0, 0, 0))
    cc.paste(c, (pd, pd))
    W, H = max(1, round(cc.width * k)), max(1, round(cc.height * k))
    o = cc.resize((W, H), Image.LANCZOS)
    o.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=q, method=6)
    fr = {}
    for key, (px, py) in (pts or {}).items():
        fr[key] = (round((px - x0 + pd) / cc.width, 3), round((py - y0 + pd) / cc.height, 3))
    print('%-18s %4dx%-4d %s' % (name, W, H, fr))
    return o, fr


def core_mask(a, th=110):
    """filled dark-outline shapes, the biggest one"""
    al = a[..., 3]
    lum = a[..., :3] @ np.array([.299, .587, .114])
    dark = (lum < th) & (al > 150)
    fill = ndi.binary_fill_holes(ndi.binary_closing(dark, iterations=2))
    lab, nl = ndi.label(fill)
    sz = ndi.sum(fill, lab, range(1, nl + 1))
    return lab == (np.argmax(sz) + 1)


def mass(m, ymin=None):
    m = m.copy()
    if ymin is not None:
        m[:ymin] = 0
    ys, xs = np.nonzero(m)
    return float(xs.mean()), float(ys.mean())


res = {}
# 1. Executioner ghost axe
im = load(EXEC)
a = np.asarray(im).astype(np.float32)
op = a[..., 3] > 200
ys, xs = np.nonzero(op)
y0, y1 = ys.min(), ys.max()
haft = []
for fr in (.15, .25, .35):
    y = int(y0 + (y1 - y0) * fr)
    row = np.where(op[y])[0]
    runs = np.split(row, np.where(np.diff(row) > 1)[0] + 1)
    r = max(runs, key=len)
    haft.append((r[0] + r[-1]) / 2)
hx = float(np.median(haft))
head = mass(op, int(y0 + (y1 - y0) * .6))
tip_y = y1
tip_x = float(np.where(op[tip_y])[0].mean())
_, res['exec'] = cut(im, 'n01_exec_axe', 640, pts={'haft': (hx, y0), 'head': head, 'tip': (tip_x, tip_y)})

# 2. Valhalla god axe: full picture with its rays + the axe alone
im = load(VAL)
a = np.asarray(im).astype(np.float32)
core = core_mask(a)
outer = [(422, 726), (360, 756), (300, 798), (250, 848), (214, 908), (193, 968), (186, 1030), (193, 1092), (213, 1152),
         (248, 1212), (298, 1262), (358, 1306), (418, 1336), (452, 1348)]
inner = [(426, 1302), (396, 1252), (366, 1192), (346, 1122), (336, 1060), (336, 1000), (346, 940), (360, 880), (372, 830),
         (386, 790), (406, 752)]
sx, sy = im.width / 1024, im.height / 1536          # the polygon was traced on the 1024 x 1536 upload
poly = Image.new('L', im.size, 0)
ImageDraw.Draw(poly).polygon([(x * sx, y * sy) for x, y in outer + inner], fill=255)
m = ndi.binary_dilation(core | (np.asarray(poly) > 0), iterations=2)
soft = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32) / 255
ca = a.copy()
ca[..., 3] = a[..., 3] * soft
core_im = Image.fromarray(ca.clip(0, 255).astype(np.uint8), 'RGBA')
cm = ca[..., 3] > 200
ys, xs = np.nonzero(cm)
top = ys.min()
row = np.where(cm[top + 60])[0]
hx = float((row.min() + row.max()) / 2)
headv = mass(cm, int(top + (ys.max() - top) * .55))
blade_tip = (452 * sx, 1345 * sy)
_, res['god'] = cut(im, 'n02_valhalla_axe', 768, pts={'haft': (hx, top), 'head': headv, 'tip': blade_tip})
_, res['swing'] = cut(core_im, 'n02_valhalla_core', 640, pts={'haft': (hx, top), 'head': headv, 'tip': blade_tip})

# 3. howl
im = load(HOWL)
a = np.asarray(im).astype(np.float32)
op = a[..., 3] > 200
lab, nl = ndi.label(op)
sz = ndi.sum(op, lab, range(1, nl + 1))
headm = lab == (np.argmax(sz) + 1)
_, res['howl'] = cut(im, 'n03_howl', 512, by='w', pts={'head': mass(headm)})

# 4. banner: pole x at the bottom, ground line = widest row of the stone pile
im = load(BAN)
a = np.asarray(im).astype(np.float32)
op = a[..., 3] > 200
ys, xs = np.nonzero(op)
yb = ys.max()
wid = [(np.ptp(np.where(op[y])[0]) if op[y].any() else 0, y) for y in range(yb - 80, yb)]
gy = max(wid)[1] + 14
mid = int(yb - (yb - ys.min()) * .2)
row = np.where(op[mid])[0]
_, res['banner'] = cut(im, 'n04_banner', 512, pts={'pole': (float((row.min() + row.max()) / 2), gy)})

# 5. shield
im = load(SHIELD)
a = np.asarray(im).astype(np.float32)
_, res['shield'] = cut(im, 'n05_rune_shield', 256, by='w', pts={'c': mass(a[..., 3] > 200)})

if kw.get('preview'):
    names = ['n01_exec_axe', 'n02_valhalla_axe', 'n02_valhalla_core', 'n03_howl', 'n04_banner', 'n05_rune_shield']
    S = 300
    sheet = Image.new('RGB', (S * len(names), S + 20), (40, 46, 60))
    d = ImageDraw.Draw(sheet)
    for i, n in enumerate(names):
        p = Image.open(os.path.join(OUT, n + '.webp')).convert('RGBA')
        k = min((S - 20) / p.width, (S - 20) / p.height)
        p = p.resize((max(1, int(p.width * k)), max(1, int(p.height * k))), Image.LANCZOS)
        sheet.paste(p, (i * S + (S - p.width) // 2, 20 + (S - 20 - p.height) // 2), p)
        d.text((i * S + 4, 4), n, fill=(255, 255, 255))
    sheet.save(kw['preview'])
print('anchors', res)
