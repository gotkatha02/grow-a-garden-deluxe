extends Node2D
## Blood Cleave ground wave, TOP-DOWN (the game lays it on the ground: rotate by the facing, squash by the camera's K).
## Facing = +x. Origin (160,160) = the wolf's feet. 1 px = 1 world px. A crimson crescent runs out over the cone,
## throwing blood that lands on the ground in its path and stays a moment.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(320, 320)
const FPS := 24
const FRAMES := 16
const O := Vector2(160, 160)
const SPAN := 0.95          # half-angle of the cone (radians)
const T_RUN := 0.34         # the crescent's run
var t := 0.0
var pal_name := "wA"
var splats := true          # blood landing on the ground (gold_wave / steel_wave: no)
var p: Array
var glow: GradientTexture2D

func _ready() -> void:
	p = C.pal(pal_name)
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

func _r_at(tt: float) -> float:
	return 26.0 + 118.0 * C.e_out(tt / T_RUN)

func _crescent(r: float, w: float, a: float, off: Vector2, cols: Array) -> void:
	var N := 28
	var outer := PackedVector2Array()
	var inner := PackedVector2Array()
	for i in N + 1:
		var s := float(i) / N
		var an := lerpf(-SPAN, SPAN, s)
		var pr := pow(sin(PI * s), 0.7)
		outer.append(O + off + Vector2(cos(an), sin(an)) * r)
		inner.append(O + off + Vector2(cos(an), sin(an)) * (r - w * pr))
	# bands from the front edge inward
	var bands := [[0.0, 1.0, cols[0]], [0.0, 0.78, cols[1]], [0.0, 0.5, cols[2]], [0.0, 0.22, cols[3]]]
	for b in bands:
		var pts := PackedVector2Array()
		for i in N + 1:
			pts.append(outer[i].lerp(inner[i], b[1]))
		for i in range(N, -1, -1):
			pts.append(outer[i])
		var c: Color = b[2]
		c.a *= a
		draw_colored_polygon(pts, c)

func _splat(i: int, a: float) -> void:
	var r1 := C.rnd(i, 1); var r2 := C.rnd(i, 2); var r3 := C.rnd(i, 3)
	var an := lerpf(-SPAN * .9, SPAN * .9, r1)
	var rr := 40.0 + r2 * 104.0
	var c := O + Vector2(cos(an), sin(an)) * rr
	var dir := Vector2(cos(an), sin(an))
	var s := 3.5 + r3 * 6.0
	var dark := Color(p[0], .55 * a)
	var body := Color((p[1] as Color).lerp(p[2], r3 * .5), .9 * a)
	draw_set_transform(c, an, Vector2(1.6 + r2, 1.0))
	draw_circle(Vector2(1, 1.5), s * 1.05, dark)
	draw_circle(Vector2.ZERO, s, body)
	draw_circle(Vector2(-s * .3, -s * .3), s * .32, Color(p[3], .55 * a))
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	for k in 3:   # satellite drops flung further out
		var d := c + dir * (s * 2.2 + k * s * 1.4 + r1 * 4.0) + dir.orthogonal() * (C.rnd(i, 10 + k) - .5) * s * 2.0
		draw_circle(d, s * (.45 - k * .1), body)

func _draw() -> void:
	var run := clampf(t / T_RUN, 0.0, 1.0)
	var fade := 1.0 - clampf((t - T_RUN) / (FRAMES / float(FPS) - T_RUN), 0.0, 1.0)
	# blood landing on the ground where the crescent has passed, darkening and fading at the end
	var r_now := _r_at(t)
	for i in (22 if splats else 0):
		var rr := 40.0 + C.rnd(i, 2) * 104.0
		if rr < r_now - 6.0:
			var age := clampf((r_now - rr) / 30.0, 0.0, 1.0)
			_splat(i, age * fade)
	if run < 1.0 or t < T_RUN + 0.12:
		var a := 1.0 - clampf((t - T_RUN * .7) / .2, 0.0, 1.0)
		var w := 30.0 * (1.0 - .45 * run)
		var r := r_now
		# dark copy under it (reads on snow), soft crimson light ahead, then the crescent
		_crescent(r, w * 1.08, a * .45, Vector2(2, 3), [p[0], p[0], p[0], p[0]])
		for i in 7:
			var an := lerpf(-SPAN * .8, SPAN * .8, float(i) / 6.0)
			var c := O + Vector2(cos(an), sin(an)) * (r + 4.0)
			draw_texture_rect(glow, Rect2(c.x - 22, c.y - 22, 44, 44), false, Color(p[2], .22 * a))
		_crescent(r, w, a, Vector2.ZERO, [p[1], p[2], p[3], p[4]])
		# torn wisps trailing behind the crescent
		for i in 9:
			var an := lerpf(-SPAN * .85, SPAN * .85, C.rnd(i, 7))
			var r0 := r - w * (0.6 + C.rnd(i, 8) * .8)
			var L := 10.0 + C.rnd(i, 9) * 18.0
			draw_line(O + Vector2(cos(an), sin(an)) * r0, O + Vector2(cos(an), sin(an)) * (r0 - L), Color(p[2], .7 * a), 2.0, true)
