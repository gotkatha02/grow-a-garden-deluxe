"""Make a generated ground texture tile seamlessly and save it at the game's size.
usage: python3 -I tools/seamless_tex.py <in.png> <out.webp> [size=640] [force=x,y] [skip=x,y] [q=90]

ChatGPT's 'seamless' textures are often almost seamless already; an axis is only fixed when the wrap edge differs
clearly more than two neighbouring rows / columns do (or when force= names it; skip= leaves an axis alone —
the cross-fade can ghost a big detail such as a shell, which can look worse than a faint seam).
Fix = overlap cross-fade on the full-size picture: the last B rows (columns) fade into the first B, so the wrap edge
continues the picture; B is searched (80…260 px) where the two bands match best, so plank gaps / tile rows line up.
The picture loses B px on that axis and is then resized to size × size.
Prints the edge difference before and after (mean |edge − opposite edge|, and the same for two neighbouring lines)."""
import sys
import numpy as np
from PIL import Image


def seam(a, axis):
    """(wrap edge difference, neighbour difference) along the axis"""
    if axis == 0: return np.abs(a[0] - a[-1]).mean(), np.abs(a[a.shape[0] // 2] - a[a.shape[0] // 2 + 1]).mean()
    return np.abs(a[:, 0] - a[:, -1]).mean(), np.abs(a[:, a.shape[1] // 2] - a[:, a.shape[1] // 2 + 1]).mean()


def fix(a, axis, bmin=80, bmax=260):
    if axis == 1: return fix(a.transpose(1, 0, 2), 0, bmin, bmax).transpose(1, 0, 2)
    H = a.shape[0]; best = None
    for B in range(bmin, min(bmax, H // 3) + 1, 2):
        d = np.abs(a[H - B:H] - a[0:B]).mean()
        if best is None or d < best[0]: best = (d, B)
    B = best[1]; t = (np.arange(B) + .5) / B; w = (t * t * (3 - 2 * t))[:, None, None]   # 0 → 1 smoothstep
    out = a[:H - B].copy()
    out[:B] = a[H - B:H] * (1 - w) + a[0:B] * w      # row 0 = old row H−B = the row after the new last row (H−B−1)
    return out


def main():
    src, dst = sys.argv[1], sys.argv[2]
    opt = dict(x.split('=', 1) for x in sys.argv[3:])
    size = int(opt.get('size', 640)); force = set(opt.get('force', '').split(',')) - {''}; skip = set(opt.get('skip', '').split(',')) - {''}; q = int(opt.get('q', 90))
    a = np.asarray(Image.open(src).convert('RGB')).astype(float)
    for axis, name in ((0, 'y'), (1, 'x')):
        e, n = seam(a, axis)
        if name not in skip and (name in force or e > 1.6 * n):
            a = fix(a, axis); e2, n2 = seam(a, axis); print('%s fixed: edge %.1f → %.1f (neighbours %.1f)' % (name, e, e2, n2))
        else: print('%s ok: edge %.1f (neighbours %.1f)' % (name, e, n))
    im = Image.fromarray(np.clip(a, 0, 255).round().astype(np.uint8)).resize((size, size), Image.LANCZOS)
    im.save(dst, quality=q, method=6)
    b = np.asarray(im).astype(float)
    print('saved %s %dx%d  final edges y %.1f x %.1f' % (dst, size, size, seam(b, 0)[0], seam(b, 1)[0]))


if __name__ == '__main__':
    main()
