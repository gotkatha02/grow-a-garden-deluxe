"""Big pose off a design sheet (owner 2026-11-24 'เอาอันนี้ภาพซ้ายเอาไปใส่หน้าเลือกตัว'): ChatGPT's design sheets
(1536x1024, cream background, the big pose on the LEFT, turnaround + action poses on the right) -> the big pose alone on a
transparent background, for the create screen (then tools/select_cut.py assets/heroes <hero>=OUT.png).
usage: python3 -I tools/bigpose_cut.py SHEET OUT.png [xmax=585] [ymin_shadow=900] [pockets=1] [minpiece=10]
- background = pixels near the cream (border median), plus below ymin_shadow pixels near the cream -> floor-shadow-tan
  segment (the tan is measured from the bottom band), flood-filled from the border; so the soft floor shadow goes too
- pockets=1: enclosed pure-cream pockets (area >= 40) also count as background (gaps between arm and body). Use pockets=0
  when the hero has parts in the cream colour (rhino 2026-11-24: horn highlights and teeth were taken as pockets)
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
if pn and POCK:
    sz = ndi.sum(np.ones_like(pk), pk, range(1, pn + 1))
    mean_d = ndi.mean(d_cream, pk, range(1, pn + 1))
    pobj = ndi.find_objects(pk)
    for i in range(pn):
        if sz[i] >= 40 and mean_d[i] < 8:
            B |= pk == i + 1
            sl = pobj[i]
            print('pocket', int(sz[i]), 'x', sl[1].start, sl[1].stop, 'y', sl[0].start, sl[0].stop)
F = ~B
fl, fn = ndi.label(F, structure=np.ones((3, 3)))
sizes = ndi.sum(np.ones_like(fl), fl, range(1, fn + 1))
objs = ndi.find_objects(fl)
big = int(np.argmax(sizes)) + 1
keep = np.zeros(fn + 1, bool); keep[big] = True
for i, sl in enumerate(objs):
    if sl[1].stop <= XMAX and i + 1 != big:
        keep[i + 1] = True
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
