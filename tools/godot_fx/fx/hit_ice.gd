extends "res://fx/hit_base.gd"
## Frost Fang hit: a short ice cut, a white star, ice shards bursting out and tumbling, a breath of frost
func _init() -> void:
	pal_name = "wR"

func _draw() -> void:
	var u := clampf(t / .4, 0.0, 1.0)
	for i in 6:   # frost breath
		var an := float(i) / 6.0 * TAU
		var r := 10.0 + 30.0 * C.e_out(u)
		soft(O + Vector2(cos(an), sin(an)) * r, 16.0 + 8.0 * u, Color(p[4], .28 * (1.0 - u)))
	cut(84.0, 11.0, .16)
	var sr := 26.0 * C.e_out(t / .04) * (1.0 - clampf((t - .04) / .12, 0, 1))
	star(sr, t * 2.0, p[3], p[4])
	for i in 11:
		var r1 := C.rnd(i, 1); var r2 := C.rnd(i, 2); var r3 := C.rnd(i, 3)
		var an := float(i) / 11.0 * TAU + (r1 - .5) * .5
		var v := Vector2(cos(an), sin(an) * .85) * (140.0 + r2 * 160.0)
		var tt := t
		var pos := O + v * tt + Vector2(0, 380.0) * tt * tt * .5
		var al := clampf(1.0 - tt / (.32 + r3 * .12), 0.0, 1.0)
		if al <= 0.0:
			continue
		var s := 4.0 + r3 * 5.0
		var rot := an + (r1 - .5) * 10.0 * tt
		var pts := PackedVector2Array([pos + Vector2(cos(rot), sin(rot)) * s * 1.7, pos + Vector2(cos(rot + 2.3), sin(rot + 2.3)) * s * .8, pos + Vector2(cos(rot - 2.3), sin(rot - 2.3)) * s * .8])
		draw_colored_polygon(pts, Color((p[3] as Color).lerp(p[2], r2 * .6), al))
		draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), Color(p[0], al * .7), 1.0, true)
		draw_line(pts[1].lerp(pts[2], .5), pts[0], Color(p[4], al * .8), 1.0, true)
