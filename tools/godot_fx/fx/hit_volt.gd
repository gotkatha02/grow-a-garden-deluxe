extends "res://fx/hit_base.gd"
## Thunder hit: a violet-blue cut, a star, short bolts jumping off the body (re-drawn each frame), sparks
func _init() -> void:
	pal_name = "wT"

func _draw() -> void:
	soft(O, 40.0 * (1.0 - clampf(t / .25, 0, 1)), Color(p[2], .35))
	cut(96.0, 13.0, .18)
	var sr := 30.0 * C.e_out(t / .04) * (1.0 - clampf((t - .04) / .12, 0, 1))
	star(sr, t * 4.0, p[3], p[4])
	var fr := int(t * 24.0)
	var al := clampf(1.0 - t / .4, 0.0, 1.0)
	if al > 0.0:
		for i in 5:
			var an := C.rnd(fr * 7 + i, 71) * TAU
			var L := 22.0 + C.rnd(fr * 7 + i, 72) * 30.0
			var a := O + Vector2(cos(an), sin(an)) * 6.0
			var b := O + Vector2(cos(an), sin(an)) * L
			var pts := C.bolt_pts(a, b, fr * 11 + i, 6, 6.0)
			draw_polyline(pts, Color(p[1], al * .7), 4.0, true)
			draw_polyline(pts, Color(p[3], al), 2.0, true)
			draw_polyline(pts, Color(p[4], al), 0.9, true)
	for i in 8:
		var r1 := C.rnd(i, 81); var r2 := C.rnd(i, 82)
		var an := r1 * TAU
		var v := Vector2(cos(an), sin(an)) * (200.0 + r2 * 200.0)
		var h := O + v * t + Vector2(0, 300.0) * t * t * .5
		var tl := O + v * maxf(0.0, t - .03)
		var a2 := clampf(1.0 - t / .26, 0.0, 1.0)
		if a2 > 0.0:
			draw_line(tl, h, Color(p[3], a2), 1.8, true)
