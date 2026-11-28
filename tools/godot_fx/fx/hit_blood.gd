extends "res://fx/hit_base.gd"
## Blood Cleave hit: a crimson cut with a white-hot core, a burst, blood thrown along the swing (+x) that falls
func _init() -> void:
	pal_name = "wA"

func _draw() -> void:
	soft(O, 30.0 * (1.0 - clampf(t / .18, 0, 1)), Color(p[2], .35))
	# burst: irregular crimson star
	var u := clampf(t / .16, 0.0, 1.0)
	if u < 1.0:
		var pts := PackedVector2Array()
		var R := 30.0 * C.e_out(t / .05)
		for i in 14:
			var an := float(i) / 14.0 * TAU
			var q := R * (1.0 if i % 2 == 0 else .45) * (0.75 + C.rnd(i, 4) * .5)
			pts.append(O + Vector2(cos(an), sin(an)) * q)
		draw_colored_polygon(pts, Color(p[1], 1.0 - u))
		var pts2 := PackedVector2Array()
		for q in pts:
			pts2.append(O + (q - O) * .55)
		draw_colored_polygon(pts2, Color(p[3], 1.0 - u))
	cut(112.0, 15.0, .22)
	# blood: drops thrown along the swing, stretched by their speed, falling
	for i in 16:
		var r1 := C.rnd(i, 1); var r2 := C.rnd(i, 2); var r3 := C.rnd(i, 3)
		var an := (r1 - .5) * 1.7 - .25
		var v := Vector2(cos(an), sin(an)) * (150.0 + r2 * 230.0)
		var tt := t
		var pos := O + v * tt + Vector2(0, 600.0) * tt * tt * .5
		var vel := v + Vector2(0, 600.0) * tt
		var al := clampf(1.0 - tt / (.3 + r3 * .15), 0.0, 1.0)
		if al <= 0.0:
			continue
		var s := 2.2 + r3 * 3.2
		var dir := vel.normalized()
		var L := clampf(vel.length() * .035, s, s * 4.0)
		var c := Color((p[1] as Color).lerp(p[2], r2), al)
		draw_line(pos - dir * L, pos, Color(p[0], al * .5), s * 1.25, true)
		draw_line(pos - dir * L, pos, c, s, true)
		draw_circle(pos, s * .55, c)
		draw_circle(pos - dir * s * .2 + Vector2(-.6, -.6), s * .2, Color(p[3], al * .8))
