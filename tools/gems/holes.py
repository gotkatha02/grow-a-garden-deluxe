"""Find the empty round gem holes in a transparent picture (dark hollow + rim).
usage: python3 -I holes.py <picture> [min_r_px]  → prints JSON list of [cx, cy, r, roundness] in picture pixels"""
import sys, json
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
def find(path, min_r=12, dark=70):
    im = np.array(Image.open(path).convert('RGBA')).astype(float)
    a = im[..., 3]; lum = .299*im[..., 0] + .587*im[..., 1] + .114*im[..., 2]
    m = (a > 200) & (lum < dark)
    m = ndi.binary_opening(m, iterations=4)          # cut the thin dark outlines that touch a hole
    lab, n = ndi.label(m); out = []
    for i in range(1, n+1):
        c = ndi.binary_fill_holes(lab == i)            # highlights inside one hole only (never whole outlined areas)
        ys, xs = np.where(c); area = len(xs)
        if area < np.pi*min_r*min_r: continue
        cx, cy = xs.mean(), ys.mean(); w, h = np.ptp(xs)+1, np.ptp(ys)+1
        r = np.sqrt(area/np.pi); rnd = area/(np.pi*(max(w, h)/2)**2)
        if rnd < .72 or not (.8 < w/h < 1.25): continue
        out.append([round(cx, 1), round(cy, 1), round(r, 1), round(rnd, 2)])
    return out
if __name__ == '__main__':
    print(json.dumps(find(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 12)))
