extends RefCounted
## Shared helpers for the effect scripts: palettes (same five-tone ramps as wolf_vfx5.js: ink, deep, mid, lite, core),
## seamless noise textures, a tiny deterministic RNG and easing.

const PAL := {
	"wS": ["#0c1a32", "#2f5fb4", "#66a6ee", "#cfe6ff", "#ffffff"],   # the axe: steel with its ice-blue rune line
	"wA": ["#2a0408", "#8e0f20", "#e3263c", "#ff8f7e", "#fff1e8"],   # berserker crimson
	"wR": ["#06283c", "#0f7fb4", "#42d2ff", "#bdf3ff", "#ffffff"],   # rune ice-blue
	"wG": ["#3a2606", "#c98a16", "#ffcf4a", "#fff0b0", "#ffffff"],   # counter gold
	"wV": ["#2a0418", "#8c0f4c", "#e3267c", "#ff9cc4", "#fff0f6"],   # vampiric
	"wT": ["#0e0a3e", "#3a2fd6", "#5f7dff", "#c2d4ff", "#ffffff"],   # thunder
	"wF": ["#2a0a04", "#a8280c", "#f2601c", "#ffb85a", "#fff3d8"],   # cyclone leap: fury orange
	"wI": ["#0e121a", "#38465e", "#7388a8", "#b9c6da", "#eef3fb"],   # iron plates
}

static func soft_tex() -> GradientTexture2D:
	var t := GradientTexture2D.new()
	t.width = 64; t.height = 64
	t.fill = GradientTexture2D.FILL_RADIAL
	t.fill_from = Vector2(0.5, 0.5); t.fill_to = Vector2(1.0, 0.5)
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 1)); g.set_color(1, Color(1, 1, 1, 0))
	t.gradient = g
	return t

## jagged lightning polyline from a to b (deterministic for a given seed)
static func bolt_pts(a: Vector2, b: Vector2, seed: int, segs: int, jag: float) -> PackedVector2Array:
	var pts := PackedVector2Array([a])
	var n := (b - a).normalized().orthogonal()
	for i in range(1, segs):
		var s := float(i) / segs
		pts.append(a.lerp(b, s) + n * (rnd(seed, i) - 0.5) * 2.0 * jag * sin(PI * s))
	pts.append(b)
	return pts

static func pal(name: String) -> Array:
	var out := []
	for h in PAL[name]:
		out.append(Color(h))
	return out

static func noise_tex(seed: int, freq: float, cellular := false, octaves := 4) -> ImageTexture:
	var n := FastNoiseLite.new()
	n.seed = seed
	n.frequency = freq
	n.fractal_octaves = octaves
	if cellular:
		n.noise_type = FastNoiseLite.TYPE_CELLULAR
		n.cellular_return_type = FastNoiseLite.RETURN_DISTANCE2_SUB
		n.fractal_type = FastNoiseLite.FRACTAL_NONE
	else:
		n.noise_type = FastNoiseLite.TYPE_SIMPLEX_SMOOTH
		n.fractal_type = FastNoiseLite.FRACTAL_FBM
	var img := n.get_seamless_image(256, 256)
	return ImageTexture.create_from_image(img)

## deterministic hash RNG: rnd(i, k) in [0, 1)
static func rnd(i: int, k: int) -> float:
	var x := sin(float(i) * 12.9898 + float(k) * 78.233) * 43758.5453
	return x - floor(x)

static func e_out(x: float) -> float:
	x = clampf(x, 0.0, 1.0)
	return 1.0 - pow(1.0 - x, 3.0)

static func e_in(x: float) -> float:
	x = clampf(x, 0.0, 1.0)
	return x * x * x

static func e_back(x: float) -> float:   # overshoot pop
	x = clampf(x, 0.0, 1.0)
	var c1 := 1.9
	return 1.0 + (c1 + 1.0) * pow(x - 1.0, 3.0) + c1 * pow(x - 1.0, 2.0)

static func ramp(p: Array, k: float) -> Color:   # 0 = ink … 1 = core along the five tones
	k = clampf(k, 0.0, 1.0) * 4.0
	var i := mini(int(k), 3)
	return (p[i] as Color).lerp(p[i + 1], k - i)
