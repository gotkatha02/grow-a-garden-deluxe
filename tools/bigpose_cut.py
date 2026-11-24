"""Big pose off a design sheet (owner 2026-11-24 'เอาอันนี้ภาพซ้ายเอาไปใส่หน้าเลือกตัว'): ChatGPT's design sheets
(1536x1024, cream background, the big pose on the LEFT, turnaround + action poses on the right) -> the big pose alone on a
transparent background, for the create screen (then tools/select_cut.py assets/heroes <hero>=OUT.png).
usage: python3 -I tools/bigpose_cut.py SHEET OUT.png [xmax=585] [ymin_shadow=900] [pockets=1] [minpiece=10]
- background = pixels near the cream (border median), plus below ymin_shadow pixels near the cream -> floor-shadow-tan
  segment (the tan is measured from the bottom band), flood-filled from the border; so the soft floor shadow goes too
- shadow=R,G,B: the floor-shadow colour by hand when the sheet's shadow is not the usual warm tan (owl 2026-11-24: pink-lilac
  225,184,187 — the auto pick found boot highlights instead and left pink crumbs under the boots); measure its median first
- pockets=1: enclosed pure-cream pockets (area >= 40) also count as background (gaps between arm and body). Use pockets=0
  when the hero has parts in the cream colour (rhino 2026-11-24: horn highlights and teeth were taken as pockets)
- pockbox=x0,y0,x1,y1;x0,y0,x1,y1 (quote it in the shell): ONLY enclosed cream pockets whose centre lies in one of these
  boxes are background (any size >= 4, any shade of the cream) — for heroes with cream costume parts AND see-through gaps
  (anubis 2026-11-24: cream collar / kilt underlayer / shin wraps kept, chain-link holes + arm and leg gaps removed;
  dragon 2026-11-24: pockets=1 would have holed the cream abs, jaw fur and tail belly -> pockbox on the 4 real gaps only)
- pockgrow=T (with pockbox): also remove every pixel closer than T to the cream that is connected to a removed pocket (the
  pocket's slightly darker fringe; owl 2026-11-24 used 28 — check that no light costume part touches the pocket first)
- wedge=T [wedgemax=60]: grow the background into near-cream pixels (d < T, 4-connected) and keep each added bit only when
  it is small — the whiter tips of V-shaped gaps between feathers / fur spikes (owl 2026-11-24: T 26, 200+ bits, none big).
  Bigger bits are refused and listed (a leak through a broken outline into a light costume part)
- rimfix=1: rim pixels whose nearest interior pixel is as light as the background (a thin dark line with cream fur or a
  highlight behind it, next to a removed pocket) are un-mixed against the most different kept pixel within 2 px instead of
  being kept solid (owl 2026-11-24: light crumbs inside the crossbow loop and between the bow cords)
- kept: the biggest piece + small pieces whose box lies left of xmax (sparkles / chips of the big pose; the right-hand
  figures' bits stay out) · specks under minpiece px dropped
- rim pixels (<= 2 px from the background) are un-mixed against the background colour they sit on (cream or tan), using
  the nearest interior pixel as the foreground colour -> no cream halo on dark ground
Check the result on dark / green / white grounds before using it. Wolf (Fenrir's Heir) was cut the same way by hand."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1], sys.argv[2]
kw = dict(a.split('=') for a in sys.argv[3:])
XMAX = int(kw.get('xmax', 585)); YSH = int(kw.get('ymin_shadow', 900)); POCK = int(kw.get('pockets', 1))
a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = a.shape
cream = np.median(np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]), 0)
# floor shadow colour: mode of the warm tan pixels in the bottom band
band = a[YSH:].reshape(-1, 3)
dc = np.sqrt(((band - cream) ** 2).sum(-1))
cand = band[(dc > 40) & (band[:, 0] > 190) & (band[:, 0] < 235) & (band[:, 0] - band[:, 2] > 40) & (band[:, 0] - band[:, 2] < 75)]
tan = np.median(cand, 0) if len(cand) > 200 else None
if 'shadow' in kw:  # floor shadow colour given by hand (owl 2026-11-24: a pink-lilac shadow, R-B ~38, the auto pick took boot highlights)
    tan = np.array([float(v) for v in kw['shadow'].split(',')], np.float32)
print('cream', cream, 'tan', tan, 'n', len(cand))
d_cream = np.sqrt(((a - cream) ** 2).sum(-1))
bgc = d_cream < 16
if tan is not None:
    v = tan - cream; L = (v ** 2).sum()
    t = np.clip(((a - cream) * v).sum(-1) / L, 0, 1.15)
    p = cream + t[..., None] * v
    dseg = np.sqrt(((a - p) ** 2).sum(-1))
    yy = np.arange(H)[:, None] * np.ones((1, W))
    bgc |= (dseg < 13) & (yy >= YSH)
lab, n = ndi.label(bgc)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
B = np.isin(lab, list(edge))
# enclosed pure-cream pockets
pk, pn = ndi.label(bgc & ~B)
PBOX = [tuple(int(v) for v in b.split(',')) for b in kw['pockbox'].split(';')] if 'pockbox' in kw else None
if pn and PBOX:
    sz = ndi.sum(np.ones_like(pk), pk, range(1, pn + 1))
    cyx = ndi.center_of_mass(np.ones_like(pk), pk, range(1, pn + 1))
    pobj = ndi.find_objects(pk)
    PK = np.zeros((H, W), bool)
    for i in range(pn):
        cy, cx = cyx[i]
        if sz[i] >= 4 and any(b[0] <= cx <= b[2] and b[1] <= cy <= b[3] for b in PBOX):
            PK |= pk == i + 1
            sl = pobj[i]
            print('pocket', int(sz[i]), 'x', sl[1].start, sl[1].stop, 'y', sl[0].start, sl[0].stop)
    GROW = float(kw.get('pockgrow', 0))
    if GROW and PK.any():
        # owl 2026-11-24: the cream inside a pocket darkens a little toward its lines (d 16-28) in a band wider than the
        # 2 px rim -> light crumbs; take every near-cream pixel (d < pockgrow) connected to a removed pocket as well
        gl, _ = ndi.label(d_cream < GROW, structure=np.ones((3, 3)))
        ids = np.unique(gl[PK]); ids = ids[ids > 0]
        add = np.isin(gl, ids) & ~PK & ~B
        PK |= np.isin(gl, ids)
        print('pockgrow', GROW, '+', int(add.sum()), 'px')
    B |= PK
elif pn and POCK:
    sz = ndi.sum(np.ones_like(pk), pk, range(1, pn + 1))
    mean_d = ndi.mean(d_cream, pk, range(1, pn + 1))
    pobj = ndi.find_objects(pk)
    for i in range(pn):
        if sz[i] >= 40 and mean_d[i] < 8:
            B |= pk == i + 1
            sl = pobj[i]
            print('pocket', int(sz[i]), 'x', sl[1].start, sl[1].stop, 'y', sl[0].start, sl[0].stop)
WEDGE = float(kw.get('wedge', 0))
if WEDGE:
    # owl 2026-11-24: in the V-shaped gaps between feathers the cream turns whiter (d 16-25) toward the tip, so the flood
    # stopped early and left white wedge tips. Grow the background through d < wedge (4-connected) and keep only the small
    # additions (<= wedgemax px each): a big addition would mean a leak into a light costume part through a broken line.
    WMAX = int(kw.get('wedgemax', 60))
    grow = ndi.binary_propagation(B, mask=B | (d_cream < WEDGE))
    add = grow & ~B
    wl, wn = ndi.label(add)
    if wn:
        wsz = ndi.sum(np.ones_like(wl), wl, range(1, wn + 1))
        ok = np.zeros(wn + 1, bool); ok[1:] = wsz <= WMAX
        B |= ok[wl]
        print('wedge', WEDGE, 'added', int(wsz[wsz <= WMAX].sum()), 'px in', int((wsz <= WMAX).sum()), 'bits; refused',
              int((wsz > WMAX).sum()), 'bigger ones', [int(s) for s in wsz[wsz > WMAX]][:8])
F = ~B
fl, fn = ndi.label(F, structure=np.ones((3, 3)))
sizes = ndi.sum(np.ones_like(fl), fl, range(1, fn + 1))
objs = ndi.find_objects(fl)
big = int(np.argmax(sizes)) + 1
keep = np.zeros(fn + 1, bool); keep[big] = True
for i, sl in enumerate(objs):
    if sl[1].stop <= XMAX and i + 1 != big:
        keep[i + 1] = True
        if sizes[i] >= 30:
            print('  small piece', int(sizes[i]), 'x', sl[1].start, sl[1].stop, 'y', sl[0].start, sl[0].stop)
K = keep[fl]
print('kept pieces', int(keep.sum()), 'main box x', objs[big - 1][1], 'y', objs[big - 1][0])
# alpha: interior 1, rim un-mixed
dist = ndi.distance_transform_edt(K)
rim = K & (dist <= 2.0)
inner = K & (dist > 2.0)
# local background colour: nearest background pixel
_, ib = ndi.distance_transform_edt(~B, return_indices=True)
bgl = a[ib[0], ib[1]]
# local foreground colour: nearest interior pixel
_, ii = ndi.distance_transform_edt(~inner, return_indices=True)
fgl = a[ii[0], ii[1]]
alpha = np.zeros((H, W), np.float32); alpha[inner] = 1
v = fgl - bgl; L = (v ** 2).sum(-1) + 1e-6
if int(kw.get('rimfix', 0)):
    # owl 2026-11-24: light rim pixels between a thin dark line and a cream pocket took the light fur / highlight behind the
    # line as their foreground (fg ~ bg -> kept solid = light crumbs). For those, the foreground is the kept pixel within
    # 2 px that differs most from the background (the dark line), so they un-mix to almost nothing.
    amb = rim & (L < 400)
    nfix = 0
    for y, x in zip(*np.nonzero(amb)):
        y0, y1, x0, x1 = max(0, y - 2), min(H, y + 3), max(0, x - 2), min(W, x + 3)
        win = a[y0:y1, x0:x1]
        dd = ((win - bgl[y, x]) ** 2).sum(-1) * K[y0:y1, x0:x1]
        j = np.unravel_index(int(np.argmax(dd)), dd.shape)
        if dd[j] >= 400:
            fgl[y, x] = win[j]; nfix += 1
    v = fgl - bgl; L = (v ** 2).sum(-1) + 1e-6
    print('rimfix', int(amb.sum()), 'ambiguous rim px,', nfix, 'un-mixed against a darker neighbour')
al = np.clip(((a - bgl) * v).sum(-1) / L, 0, 1)
al[L < 400] = 1.0  # fg too close to bg to tell: keep solid
alpha[rim] = al[rim]
col = a.copy()
m = rim & (alpha > 0.04)
col[m] = np.clip((a[m] - (1 - alpha[m, None]) * bgl[m]) / alpha[m, None], 0, 255)
col[rim & ~m] = fgl[rim & ~m]
# drop specks (< MINP px) left after un-mixing
MINP = int(kw.get('minpiece', 10))
sl_, sn_ = ndi.label(alpha > 0.04, structure=np.ones((3, 3)))
if sn_:
    ssz = ndi.sum(np.ones_like(sl_), sl_, range(1, sn_ + 1))
    small = np.zeros(sn_ + 1, bool); small[1:] = ssz < MINP
    alpha[small[sl_]] = 0
    print('specks dropped', int(small.sum()))
rgba = np.dstack([col, alpha * 255]).astype(np.uint8)
ys, xs = np.nonzero(alpha > 0.02)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
print('box', x0, y0, x1, y1, '->', x1 - x0, y1 - y0)
Image.fromarray(rgba[y0:y1, x0:x1]).save(out)
