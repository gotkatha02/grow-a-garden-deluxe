extends Node2D
## Fenrir's Spirit summon: a column of cold light rising out of the ground, frost motes climbing it, then thinning away.
## Ground point (GX, GY); column height REF_H px.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(150, 360)
const FPS := 24
const FRAMES := 18
const GX := 75.0
const GY := 340.0
const REF_H := 300.0
var p: Array = C.pal("wR")
var t := 0.0
var glow: GradientTexture2D
var col_tex: GradientTexture2D

func _ready() -> void:
	glow = C.soft_tex()
	col_tex = GradientTexture2D.new()   # across the column: transparent edge → light → white core → light → edge
	col_tex.width = 64; col_tex.height = 4
	var g := Gradient.new()
	g.offsets = PackedFloat32Array([0.0, .3, .5, .7, 1.0])
	g.colors = PackedColorArray([Color(p[2], 0), Color(p[2], .55), Color(p[4], .95), Color(p[2], .55), Color(p[2], 0)])
	col_tex.gradient = g

func set_time(s: float) -> void:
	t = s
	queue_redraw()

func _draw() -> void:
	var life := FRAMES / float(FPS)
	var G := Vector2(GX, GY)
	var rise := C.e_out(t / .12)
	var out := 1.0 - C.e_in(clampf((t - life * .45) / (life * .55), 0.0, 1.0))
	var w := 44.0 * (1.0 + .25 * (1.0 - rise)) * (0.55 + .45 * out)
	var h := REF_H * rise
	# base glow + dark ring under it (reads on snow)
	draw_set_transform(G, 0.0, Vector2(1.0, .36))
	draw_arc(Vector2.ZERO, w * .9, 0, TAU, 32, Color(p[0], .45 * out), 5.0, true)
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	draw_texture_rect(glow, Rect2(G.x - w * 1.4, G.y - w * .5, w * 2.8, w), false, Color(p[3], .55 * out))
	# the column, fading toward its top
	var steps := 48
	for i in steps:
		var y0 := G.y - h * float(i) / steps
		var y1 := G.y - h * float(i + 1) / steps
		var a := out * (1.0 - float(i) / steps) * (.8 + .2 * sin(t * 30.0 + i))
		draw_texture_rect(col_tex, Rect2(G.x - w * .5, y1, w, y0 - y1 + 1.0), false, Color(1, 1, 1, a))
	# frost motes spiralling up the column
	for i in 16:
		var r1 := C.rnd(i, 1); var r2 := C.rnd(i, 2)
		var ph := r1 * TAU + t * (5.0 + r2 * 3.0)
		var yy := G.y - fposmod(r2 * h + t * (180.0 + r1 * 120.0), maxf(h, 1.0))
		var x := G.x + cos(ph) * w * (.55 + r2 * .3)
		var front := sin(ph) > 0.0
		var a2 := out * (.5 + .5 * float(front))
		var s := 1.6 + r2 * 2.2
		draw_colored_polygon(PackedVector2Array([Vector2(x, yy - s * 1.6), Vector2(x + s, yy), Vector2(x, yy + s * 1.6), Vector2(x - s, yy)]), Color(p[4], a2))
