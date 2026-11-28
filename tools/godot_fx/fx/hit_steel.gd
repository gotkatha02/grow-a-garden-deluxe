extends "res://fx/hit_base.gd"
## basic attack hit: a steel-blue cut, a quick star, sparks that streak out and fall
func _init() -> void:
	pal_name = "wS"

func _draw() -> void:
	soft(O, 34.0 * (1.0 - clampf(t / .2, 0, 1)), Color(p[3], .4))
	cut(104.0, 14.0, .2)
	var sr := 30.0 * C.e_out(t / .04) * (1.0 - clampf((t - .04) / .14, 0, 1))
	star(sr, .4 + t * 3.0, p[3], p[4])
	for i in 10:
		var r1 := C.rnd(i, 1); var r2 := C.rnd(i, 2)
		var an := (r1 - .5) * 2.4 + (PI if i % 3 == 0 else 0.0)
		var v := Vector2(cos(an), sin(an)) * (260.0 + r2 * 260.0)
		var tt := t
		var head := O + v * tt + Vector2(0, 420.0) * tt * tt * .5
		var tailp := O + v * maxf(0.0, tt - .035) + Vector2(0, 420.0) * pow(maxf(0.0, tt - .035), 2) * .5
		var al := clampf(1.0 - tt / (.25 + r2 * .15), 0.0, 1.0)
		if al > 0.0:
			draw_line(tailp, head, Color(p[2], al), 2.4, true)
			draw_line(tailp.lerp(head, .5), head, Color(p[4], al), 1.4, true)
