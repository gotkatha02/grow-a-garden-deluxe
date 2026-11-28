extends Node2D
## Frost Fang: a cluster of ice fangs bursting out of the ground (seen from the game's 3/4 camera), holding, then shattering.
## Segments (frames at 24 fps): rise 0–5 · hold 6–9 (loops: a light sweep runs up the faces) · break 10–21.
## Anchor = the ground point under the big fang (GX, GY). REF_H = the big fang's height in px -> the game scales it to its own fang height.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(200, 232)
const FPS := 24
const FRAMES := 22
const GX := 100.0
const GY := 200.0
const T_RISE := 0.25
const T_HOLD := 0.1667
const T_BREAK := 0.5
const REF_H := 150.0

var t := 0.0
var p: Array = C.pal("wR")
# fangs: offset x, offset y (ground, + = toward camera), height, width, lean, delay
var FANGS := [
	[-34.0, -8.0, 78.0, 26.0, -0.30, 0.03],
	[30.0, -10.0, 96.0, 30.0, 0.26, 0.05],
	[0.0, 0.0, 150.0, 44.0, 0.06, 0.0],
	[-14.0, 10.0, 46.0, 18.0, -0.5, 0.07],
	[18.0, 9.0, 52.0, 19.0, 0.45, 0.08],
]
var glow: GradientTexture2D

func _ready() -> void:
	glow = GradientTexture2D.new()
	glow.width = 64; glow.height = 64
	glow.fill = GradientTexture2D.FILL_RADIAL
	glow.fill_from = Vector2(0.5, 0.5); glow.fill_to = Vector2(1.0, 0.5)
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 1)); g.set_color(1, Color(1, 1, 1, 0))
	glow.gradient = g

func set_time(s: float) -> void:
	t = s
	queue_redraw()

func _soft(c: Vector2, rx: float, ry: float, col: Color) -> void:
	draw_texture_rect(glow, Rect2(c.x - rx, c.y - ry, rx * 2, ry * 2), false, col)

func _fang_pts(f: Array, k: float) -> Dictionary:
	var x: float = GX + f[0]
	var y: float = GY + f[1]
	var h: float = f[2] * k
	var w: float = f[3]
	var ln: float = f[4]
	var top := Vector2(x + ln * h, y - h)
	var sh := 0.68
	return {
		"bl": Vector2(x - w * .5, y), "bc": Vector2(x + w * .04, y + w * .2), "br": Vector2(x + w * .5, y - w * .04),
		"sl": Vector2(x - w * .4 + ln * h * sh, y - h * sh), "sr": Vector2(x + w * .42 + ln * h * sh, y - h * sh - w * .05),
		"rg": Vector2(x + w * .06 + ln * h * sh, y - h * sh + w * .14), "tp": top,
	}

func _draw_fang(f: Array, k: float, flash: float, sweep: float) -> void:
	if k <= 0.02:
		return
	var q := _fang_pts(f, k)
	var lite: Color = (p[3] as Color).lerp(p[4], flash)
	var mid: Color = (p[2] as Color).lerp(p[4], flash * .8)
	var deep: Color = (p[1] as Color).lerp(p[3], flash * .7)
	# dark copy under it so it reads on snow
	var off := Vector2(2.0, 3.0)
	var sil := PackedVector2Array([q.bl + off, q.sl + off, q.tp + off, q.sr + off, q.br + off, q.bc + off])
	draw_colored_polygon(sil, Color(p[0], 0.45))
	# left (lit) face and right (shade) face, vertex-coloured: darker at the root, lighter toward the tip
	draw_polygon(PackedVector2Array([q.bl, q.bc, q.rg, q.sl]), PackedColorArray([mid, (mid as Color).lerp(deep, .3), lite, lite]))
	draw_polygon(PackedVector2Array([q.sl, q.rg, q.tp]), PackedColorArray([lite, lite, (lite as Color).lerp(p[4], .6)]))
	draw_polygon(PackedVector2Array([q.bc, q.br, q.sr, q.rg]), PackedColorArray([deep, (deep as Color).lerp(p[0], .25), mid, mid]))
	draw_polygon(PackedVector2Array([q.rg, q.sr, q.tp]), PackedColorArray([mid, mid, lite]))
	# ridge highlight + facet line
	draw_line(q.bc, q.rg, Color(p[4], .55), 1.6, true)
	draw_line(q.rg, q.tp, Color(p[4], .9), 1.6, true)
	draw_line(q.bl.lerp(q.sl, .3), q.rg.lerp(q.bc, .2), Color(p[3], .5), 1.0, true)
	# light sweep running up the lit face (hold loop)
	if sweep >= 0.0:
		var a: Vector2 = (q.bl as Vector2).lerp(q.sl, sweep)
		var b: Vector2 = (q.bc as Vector2).lerp(q.rg, sweep)
		var a2: Vector2 = (q.bl as Vector2).lerp(q.sl, minf(1.0, sweep + .16))
		var b2: Vector2 = (q.bc as Vector2).lerp(q.rg, minf(1.0, sweep + .16))
		draw_colored_polygon(PackedVector2Array([a, b, b2, a2]), Color(p[4], .45))
	# ink outline
	draw_polyline(PackedVector2Array([q.bl, q.sl, q.tp, q.sr, q.br]), p[0], 2.0, true)

func _shards(f: Array, u: float, fi: int) -> void:
	# the fang breaks into tumbling shards that fly out and fall
	var x: float = GX + f[0]
	var y: float = GY + f[1]
	var h: float = f[2]
	var n := 5 if h > 60 else 3
	for j in n:
		var r1 := C.rnd(fi * 13 + j, 1)
		var r2 := C.rnd(fi * 13 + j, 2)
		var r3 := C.rnd(fi * 13 + j, 3)
		var hy := h * (0.15 + 0.75 * float(j) / n)
		var o := Vector2(x + f[4] * hy, y - hy)
		var v := Vector2((r1 - 0.5) * 220.0 + f[4] * 90.0, -80.0 - r2 * 140.0)
		var tt := u * T_BREAK
		var pos := o + v * tt + Vector2(0, 520.0) * tt * tt * .5
		var rot := (r3 - .5) * 14.0 * tt
		var s: float = (6.0 + r2 * 7.0) * (1.0 - u * .5) * (float(f[3]) / 36.0 + .4)
		var al := clampf(1.0 - u * 1.25, 0.0, 1.0)
		var pts := PackedVector2Array()
		for k in 3:
			var an := rot + float(k) * TAU / 3.0 + (r1 - .5)
			pts.append(pos + Vector2(cos(an), sin(an) * 1.4) * s * (1.0 if k else 1.6))
		draw_colored_polygon(pts, Color((p[3] as Color).lerp(p[2], r1), al))
		draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), Color(p[0], al * .8), 1.0, true)

func _draw() -> void:
	var G := Vector2(GX, GY)
	var t_hold0 := T_RISE
	var t_brk0 := T_RISE + T_HOLD
	var breaking := t >= t_brk0
	var ub := clampf((t - t_brk0) / T_BREAK, 0.0, 1.0)
	# frost patch on the ground: appears with the burst, fades while it breaks
	var pa := C.e_out(t / .12) * (1.0 - C.e_in(ub))
	_soft(G + Vector2(0, 2), 62.0, 20.0, Color(p[3], .55 * pa))
	_soft(G + Vector2(0, 2), 36.0, 11.0, Color(p[4], .5 * pa))
	for i in 7:   # ground cracks
		var an := float(i) / 7.0 * TAU + C.rnd(i, 9) * .6
		var L := (26.0 + C.rnd(i, 4) * 22.0) * C.e_out(t / .1)
		var a := G + Vector2(cos(an) * 10.0, sin(an) * 3.5)
		var b := G + Vector2(cos(an) * L, sin(an) * L * .34)
		draw_line(a, b, Color(p[1], .8 * pa), 1.6, true)
	# fangs, back to front
	var order := FANGS.duplicate()
	order.sort_custom(func(a, b): return a[1] < b[1])
	for f in order:
		var fi := FANGS.find(f)
		if not breaking:
			var k := C.e_back((t - f[5]) / (T_RISE - .04))
			var sweep := -1.0
			if t >= t_hold0:
				sweep = fposmod((t - t_hold0) / T_HOLD + float(fi) * .23, 1.0)
			_draw_fang(f, k, 0.0, sweep)
		else:
			if ub < .12:   # a white crack-flash just before it bursts
				_draw_fang(f, 1.0 - ub * 1.5, ub / .12, -1.0)
			_shards(f, ub, fi)
	# burst debris at the rise: ice chips thrown up from the roots
	if t < .5:
		for i in 12:
			var r1 := C.rnd(i, 21)
			var r2 := C.rnd(i, 22)
			var o := G + Vector2((r1 - .5) * 50.0, (r2 - .5) * 10.0)
			var v := Vector2((r1 - .5) * 260.0, -120.0 - r2 * 200.0)
			var pos := o + v * t + Vector2(0, 700.0) * t * t * .5
			var al := clampf(1.0 - t / .45, 0.0, 1.0)
			var s := 2.0 + r2 * 3.0
			draw_colored_polygon(PackedVector2Array([pos + Vector2(0, -s), pos + Vector2(s * .7, 0), pos + Vector2(0, s), pos + Vector2(-s * .7, 0)]), Color(p[4], al))
	# frost mist puffs: at the burst and when it shatters
	for i in 5:
		var an := float(i) / 5.0 * TAU
		var r := 20.0 + 40.0 * C.e_out(t / .4)
		var a1 := .3 * (1.0 - clampf(t / .45, 0, 1))
		_soft(G + Vector2(cos(an) * r, sin(an) * r * .35 - 6.0), 22.0, 12.0, Color(p[4], a1))
		if breaking:
			var r2 := 14.0 + 52.0 * C.e_out(ub)
			_soft(G + Vector2(cos(an + .6) * r2, -40.0 + sin(an + .6) * r2 * .5 - ub * 30.0), 26.0, 18.0, Color(p[4], .32 * (1.0 - ub)))
