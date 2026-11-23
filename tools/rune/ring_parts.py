"""Ring page parts (RUNE_ART_PROMPTS_TH.md จ1–จ4) -> assets/rune/ring/<part>.webp + the RING_LAY numbers for rune_data.js.
usage (repo root, python3 -I):  ring_parts.py <bg|stump|shard|sock> <picture.png> [rot=<deg>]
  bg     : centre square crop -> 1024 px
  stump  : transparent picture (or one colour background, keyed from the border) -> trimmed, max 640 px
  shard  : same; the tip must point UP (rot= turns it first) -> the painted hole is measured (largest dark enclosed region)
  sock   : same, hole measured
Then add the part to RING_ART and paste the printed numbers into RING_LAY (rune_data.js): hd = hole diameter ÷ picture width,
hx / hy = hole centre as fractions of the picture, ar = height ÷ width. The game sizes shard / sock so their hole = 0.868 × the socket button."""
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage as nd
part, src = sys.argv[1], sys.argv[2]
opt = dict(a.split('=') for a in sys.argv[3:])
os.makedirs('assets/rune/ring', exist_ok=True)
im = Image.open(src).convert('RGBA')
if 'rot' in opt: im = im.rotate(float(opt['rot']), expand=True, resample=Image.BICUBIC)
if part == 'bg':
    s = min(im.size); l, t = (im.width - s) // 2, (im.height - s) // 2
    im.crop((l, t, l + s, t + s)).convert('RGB').resize((1024, 1024), Image.LANCZOS).save('assets/rune/ring/bg.webp', 'WEBP', quality=85, method=6)
    print("RING_ART += 'bg'"); sys.exit()
a = np.asarray(im).astype(np.float32)
if (a[..., 3] < 250).mean() < .02:                      # no real transparency: key the border colour (flood from the edges)
    rgb = a[..., :3]; bd = np.concatenate([rgb[:3].reshape(-1, 3), rgb[-3:].reshape(-1, 3), rgb[:, :3].reshape(-1, 3), rgb[:, -3:].reshape(-1, 3)])
    key = np.median(bd, 0); dist = np.abs(rgb - key).max(-1)
    lab, _ = nd.label(dist < 40); edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])); edge = edge[edge > 0]
    a[..., 3] = np.where(np.isin(lab, edge), 0, 255)
al = a[..., 3]; ys, xs = np.where(al > 20)
a = a[max(0, ys.min() - 2):ys.max() + 3, max(0, xs.min() - 2):xs.max() + 3]
out = Image.fromarray(a.astype(np.uint8)); mx = 640 if part == 'stump' else 512
out.thumbnail((mx, mx), Image.LANCZOS); out.save(f'assets/rune/ring/{part}.webp', 'WEBP', quality=88, method=6)
h, w = out.height, out.width; b = np.asarray(out).astype(np.float32)
lay = {'w': None, 'ar': float(round(h / w, 3))}
if part in ('shard', 'sock'):
    # the hole = the biggest dark region that does not touch the picture edge (its inside may be a lighter gradient:
    # holes inside the region are filled), measured by its bounding box; a check picture with the circle is saved too
    v = b[..., :3].max(-1) / 255; dark = (v < float(opt.get('v', .5))) & (b[..., 3] > 200)
    rr = max(3, w // 70); yk, xk = np.mgrid[-rr:rr + 1, -rr:rr + 1]; disk = (xk * xk + yk * yk) <= rr * rr
    dark = nd.binary_opening(dark, structure=disk)                            # thin outlines go, the big hole stays
    lab, n = nd.label(dark); best = None
    for i in range(1, n + 1):
        m = lab == i; yy, xx = np.where(m)
        if yy.min() == 0 or xx.min() == 0 or yy.max() == h - 1 or xx.max() == w - 1: continue
        if xx.max() - xx.min() > .85 * w or yy.max() - yy.min() > .85 * h: continue   # the outline round the whole piece, not a hole
        if best is None or len(yy) > best[0]: best = (len(yy), i)
    reg = nd.binary_dilation(nd.binary_fill_holes(lab == best[1]), structure=disk); yy, xx = np.where(reg)
    cx, cy = (xx.min() + xx.max()) / 2, (yy.min() + yy.max()) / 2; d = ((xx.max() - xx.min()) + (yy.max() - yy.min())) / 2
    hd = d / w
    lay.pop('w'); lay.update(hd=float(round(hd, 3)), hx=float(round(cx / w, 3)), hy=float(round(cy / h, 3)))   # the game sizes the part so the hole = 0.868 × the socket button
    print(f'hole: centre {cx:.0f},{cy:.0f} of {w}x{h}, diameter {hd:.3f} of the width')
    from PIL import ImageDraw
    chk = out.copy(); dr = ImageDraw.Draw(chk); dr.ellipse((cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2), outline=(255, 0, 255, 255), width=3)
    chk.save(f'/tmp/ring_{part}_hole.png')
else:
    lay['w'] = 27
print(f"RING_ART += '{part}'   RING_LAY.{part} = {lay}")
