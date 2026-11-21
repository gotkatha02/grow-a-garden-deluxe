"""C gem = the owner's painted octagonal diamond (GEM_PAGE_ART_PROMPTS_TH.md 13–14, pictures 2026-11-21).
    python3 tools/gems/oct_frame.py <frame.png> <table_shine.png> [out_dir/] [outer_apothem]
frame.png  = his diamond crown, transparent outside and in the octagonal table hole (flat top).
shine.png  = his light on the table, on black (alpha = brightness).
Both are measured (octagon = 8 supporting lines at 0°, 45°, …), centred on the table hole and scaled so the crown's outer
octagon has the given apothem in a 512² box (default 252). Writes cgem_oct0.webp (crown, full 512² box centred on
the hole) + cgem_tshine.webp (the shine made regular, rim apothem 236 in its 512² box) and prints the CSS / polygon numbers for
totem_gems.js (.sgem.cg framed, ?gframe=1 · .sgem.cg.nf frameless = the default since the owner's 14:06 'no frame, just the gem')."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

FR, SH = sys.argv[1], sys.argv[2]
OUT = sys.argv[3] if len(sys.argv) > 3 else 'assets/gems/page/'
AO = float(sys.argv[4]) if len(sys.argv) > 4 else 252.0
N = 512; C = N / 2
DIRS = [(np.cos(np.radians(45 * k)), np.sin(np.radians(45 * k))) for k in range(8)]


def supports(ys, xs):
    return np.array([(xs * nx + ys * ny).max() for nx, ny in DIRS])


def octo(sup):
    """centre + per-axis apothems (x, diag, y, anti-diag) of a centred-ish octagon from its 8 supports"""
    cx = (sup[0] - sup[4]) / 2; cy = (sup[2] - sup[6]) / 2
    ap = np.array([(sup[k] + sup[k + 4]) / 2 for k in range(4)])
    return cx, cy, ap


# ---- crown --------------------------------------------------------------------------------------------
fr = Image.open(FR).convert('RGBA'); A = np.asarray(fr)[..., 3].astype(float); H, W = A.shape
lab, _ = ndi.label(~(A > 128))
hole = lab == lab[H // 2, W // 2]; outer = ~(lab == lab[0, 0])
ocx, ocy, oap = octo(supports(*np.nonzero(outer)))
hcx, hcy, hap = octo(supports(*np.nonzero(hole)))
cx, cy = (ocx + hcx) / 2, (ocy + hcy) / 2
s = AO / oap.mean()
half = C / s
crown = fr.resize((N, N), Image.LANCZOS, box=(cx - half, cy - half, cx + half, cy + half))
crown.save(OUT + 'cgem_oct0.webp', 'WEBP', quality=92, method=6)
HA = hap * s                                     # table hole apothems in the 512 box (x, diag, y, anti-diag)

# ---- table shine --------------------------------------------------------------------------------------
sh = np.asarray(Image.open(SH).convert('RGB')).astype(float)
L = sh.max(axis=2)
# rim of the shine octagon: brightest point along rays from its centre (5 parallel rays per side, median)
scx, scy = float(np.mean(np.nonzero(L > 40)[1])), float(np.mean(np.nonzero(L > 40)[0]))
for _ in range(2):
    rim = []
    for nx, ny in DIRS:
        vals = []
        for off in (-120, -60, 0, 60, 120):
            rs = np.arange(250, 700, .5)
            xs = scx - ny * off + rs * nx; ys = scy + nx * off + rs * ny
            v = ndi.map_coordinates(L, [ys, xs], order=1, cval=0)
            vals.append(rs[np.argmax(v)])
        rim.append(np.median(vals))
    rim = np.array(rim)
    scx += (rim[0] - rim[4]) / 2; scy += (rim[2] - rim[6]) / 2
# the shine is made REGULAR with its rim at apothem RS in its own 512² box (room for its halo + star); CSS scales it onto the
# table hole (framed) or onto the gem edge (frameless)
RS = 236.0
sx = RS / ((rim[0] + rim[4]) / 2); sy = RS / ((rim[2] + rim[6]) / 2)
a = np.clip((L - 6) / 249, 0, 1)                # black (and its noise) → fully transparent, keeps the file small
rgb = np.where(a[..., None] > 1e-3, sh / np.maximum(L[..., None], 1) * 255, 0).clip(0, 255)   # un-premultiplied colour = hue at full brightness
rgba = np.dstack([rgb, a * 255]).astype(np.uint8)
pad = 700
big = Image.new('RGBA', (W + 2 * pad, H + 2 * pad), (0, 0, 0, 0)); big.paste(Image.fromarray(rgba, 'RGBA'), (pad, pad))
hx, hy = C / sx, C / sy
tsh = big.resize((N, N), Image.LANCZOS, box=(scx + pad - hx, scy + pad - hy, scx + pad + hx, scy + pad + hy))
tsh.save(OUT + 'cgem_tshine.webp', 'WEBP', quality=85, alpha_quality=90, method=6)   # lower alpha quality bands the soft glow

# ---- numbers for the CSS -------------------------------------------------------------------------------
ha = HA.mean()
ic = ha + 3.5                                    # icon octagon, tucked under the gold rim of the hole
lo = ha - 2.0                                    # rarity line just inside the gold rim
pct = lambda v: f'{v / N * 100:.2f}%'
k = np.cos(np.radians(22.5))
pts = lambda a: ' '.join(f'{50 + a / N * 100 / k * np.cos(np.radians(22.5 + 45 * i)):.2f},{50 - a / N * 100 / k * np.sin(np.radians(22.5 + 45 * i)):.2f}' for i in range(8))
shine = lambda a: f'left/top {pct(C - C * a / RS)} width/height {pct(N * a / RS)}'
print(f'frame: outer apothems {np.round(oap * s, 1)} · table hole {np.round(HA, 1)} (ratio {HA.mean() / (oap * s).mean():.3f}) · scale {s:.4f}')
print(f'shine: centre ({scx:.1f},{scy:.1f}) rim {np.round(rim, 1)} → regular, rim apothem {RS:.0f}')
print(f'framed    .sgi {pct(C - ic)} / {pct(2 * ic)} · .sgt {shine(ha)} · OCT_PTS \'{pts(lo)}\'')
FE = 247.0                                       # frameless: the gem's own edge
print(f'frameless .sgi {pct(C - FE)} / {pct(2 * FE)} · .sgt {shine(FE)} · edge \'{pts(FE)}\' · rarity \'{pts(FE - 4.5)}\'')
