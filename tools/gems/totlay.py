"""Measure the owner's totem pole + base pictures → the TOT table for totem_gems.js.
usage: python3 -I totlay.py <pole.webp> <base.webp> [standX standY [footY cut0 cut1 cut2 cut3]]
stand = where the pole's foot sits on the base (base px, default: below the middle of the opaque box);
footY = the pole's foot contact (default: bottom of the opaque box); cut = y between bear|owl, owl|wolf, wolf|eagle, eagle|top
(default: half way between the big holes — check them against the carved bands, each band belongs to the tier below)"""
import sys, json
import numpy as np
from PIL import Image
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from holes import find
def bbox(path):
    a = np.array(Image.open(path).convert('RGBA'))[..., 3]; ys, xs = np.where(a > 60); return xs.min(), xs.max(), ys.min(), ys.max(), a.shape[1], a.shape[0]
def main(pole, base, stand=None, foot=None, cuts=None):
    px0, px1, py0, py1, PW, PH = bbox(pole); hs = find(pole, 10)
    big = sorted(hs, key=lambda h: -h[2])[:5]; big.sort(key=lambda h: -h[1])              # bottom → top
    rest = [h for h in hs if h not in big]; med = float(np.median([h[2] for h in rest]))
    rest = [h for h in rest if h[2] > med * .6]                                          # drop dark round eyes / nostrils
    tiers = []
    for i, b in enumerate(big):
        ys = [x[1] for x in big]; lo = (ys[i] + ys[i+1]) / 2 if i < 4 else py0; hi = (ys[i] + ys[i-1]) / 2 if i else py1
        sm = sorted([h for h in rest if lo <= h[1] <= hi], key=lambda h: h[0])
        L = [h for h in sm if h[0] < b[0]]; R = [h for h in sm if h[0] > b[0]]
        assert len(L) == 2 and len(R) == 2, ('tier', i, 'small holes L/R', len(L), len(R), sm)
        tiers.append({'m': b[:3], 'h': [L[1][:3], L[0][:3], R[1][:3], R[0][:3]]})   # inner-left, outer-left, outer-right, inner-right
    ys = [t['m'][1] for t in tiers]; cut = [round((ys[i] + ys[i+1]) / 2) for i in range(4)]
    bx0, bx1, by0, by1, BW, BH = bbox(base); bh = find(base, 8)
    bb = sorted(bh, key=lambda h: -h[2]); S = sorted(bb[:5], key=lambda h: h[0]); T = sorted(bb[5:10], key=lambda h: h[0])
    assert len(S) == 5 and len(T) == 5, ('base holes', len(bh))
    if stand is None: stand = [round((bx0 + bx1) / 2), round(by0 + (S[2][1] - S[2][2] - by0) * .55)]
    if foot is not None: py1 = foot
    if cuts is not None: cut = cuts
    out = {'pole': {'src': pole.split('/')[-1].split('.')[0], 'W': PW, 'H': PH, 'top': int(py0), 'foot': int(py1), 'cx': round(float(np.mean([t['m'][0] for t in tiers])), 1), 'cut': cut, 'tiers': tiers},
           'base': {'src': base.split('/')[-1].split('.')[0], 'W': BW, 'H': BH, 'top': int(by0), 'bot': int(by1), 'cx': round((bx0 + bx1) / 2, 1), 'stand': stand, 's': [h[:3] for h in S], 't': [h[:3] for h in T]}}
    return out
if __name__ == '__main__':
    st = [float(sys.argv[3]), float(sys.argv[4])] if len(sys.argv) > 4 else None
    ft = int(sys.argv[5]) if len(sys.argv) > 5 else None
    cu = [int(v) for v in sys.argv[6:10]] if len(sys.argv) > 9 else None
    print('const TOT=' + json.dumps(main(sys.argv[1], sys.argv[2], st, ft, cu), separators=(',', ':')) + ';')
