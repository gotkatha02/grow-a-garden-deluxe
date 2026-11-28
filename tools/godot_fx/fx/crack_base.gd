extends Node2D
## Ground crack, TOP-DOWN (the game squashes it by K onto the ground): jagged branching cracks run out from the centre,
## glow hot in their colour, cool to dark seams, fade. Centre (130,130), reach R_REF px = the game's crack radius r.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(260, 260)
const FPS := 20
const FRAMES := 26
const O := Vector2(130, 130)
const R_REF := 110.0
var pal_name := "wF"
var p: Array
var t := 0.0
var glow: GradientTexture2D
var branches: Array = []

func _ready() -> void:
	p = C.pal(pal_name)
	glow = C.soft_tex()
	for i in 7:   # main cracks of uneven length and spacing, one side branch each
		var an := float(i) / 7.0 * TAU + (C.rnd(i, 1) - .5) * .8
		var L := R_REF * (.35 + C.rnd(i, 2) * .65)
		var pts := C.bolt_pts(O + Vector2(cos(an), sin(an)) * 8.0, O + Vector2(cos(an), sin(an)) * L, i * 5 + 1, 7, 9.0)
		branches.append(pts)
		var k := 2 + int(C.rnd(i, 3) * 3.0)
		var b0: Vector2 = pts[k]
		var ba := an + (.5 if C.rnd(i, 4) < .5 else -.5)
		branches.append(C.bolt_pts(b0, b0 + Vector2(cos(ba), sin(ba)) * L * .35, i * 5 + 3, 4, 5.0))

func set_time(s: float) -> void:
	t = s
	queue_redraw()

func _draw() -> void:
	var life := FRAMES / float(FPS)
	var grow := C.e_out(t / .16)
	var heat := 1.0 - clampf((t - .1) / .6, 0.0, 1.0)
	var fade := 1.0 - clampf((t - life * .65) / (life * .35), 0.0, 1.0)
	draw_texture_rect(glow, Rect2(O.x - 70, O.y - 70, 140, 140), false, Color(p[2], .35 * heat * fade))
	draw_texture_rect(glow, Rect2(O.x - 30, O.y - 30, 60, 60), false, Color(p[0], .35 * fade))
	for bi in branches.size():
		var pts: PackedVector2Array = branches[bi]
		var main := bi % 2 == 0
		var g := grow if main else clampf((grow - .4) / .6, 0.0, 1.0)
		var n := int(ceil(g * (pts.size() - 1)))
		if n < 1:
			continue
		var sub := PackedVector2Array()
		for i in n + 1:
			sub.append(pts[mini(i, pts.size() - 1)])
		var w := (4.2 if main else 2.6)
		draw_polyline(sub, Color(p[0], .8 * fade), w + 2.0, true)                                 # dark seam
		draw_polyline(sub, Color((p[1] as Color).lerp(p[2], heat), fade * (.35 + .65 * heat)), w, true)   # hot fill
		if heat > 0.05:
			draw_polyline(sub, Color(p[4], heat * fade), w * .35, true)                             # white-hot core
