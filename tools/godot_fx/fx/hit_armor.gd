extends "res://fx/hit_base.gd"
## Armor Break hit: a heavy steel cut, a star, and plates of the target's armour knocked off, tumbling and falling
var iron: Array

func _init() -> void:
	pal_name = "wS"

func _draw() -> void:
	if iron.is_empty():
		iron = C.pal("wI")
	soft(O, 36.0 * (1.0 - clampf(t / .2, 0, 1)), Color(p[3], .4))
	cut(118.0, 17.0, .22)
	var sr := 34.0 * C.e_out(t / .04) * (1.0 - clampf((t - .04) / .14, 0, 1))
	star(sr, .3 + t * 3.0, p[3], p[4])
	for i in 7:
		var r1 := C.rnd(i, 41); var r2 := C.rnd(i, 42); var r3 := C.rnd(i, 43)
		var an := -PI * .5 + (r1 - .5) * 3.0
		var v := Vector2(cos(an), sin(an)) * (120.0 + r2 * 170.0)
		var pos := O + v * t + Vector2(0, 640.0) * t * t * .5
		var al := clampf(1.0 - t / (.38 + r3 * .1), 0.0, 1.0)
		if al <= 0.0:
			continue
		var s := 5.0 + r3 * 6.0
		var rot := r1 * 6.0 + t * (r2 - .5) * 26.0
		var sq := absf(cos(rot * 1.3)) * .8 + .2          # the plate turns over as it flies
		var q := PackedVector2Array()
		for k in 4:
			var a := rot + float(k) * TAU / 4.0 + (.25 if k % 2 else 0.0)
			q.append(pos + Vector2(cos(a) * s * 1.3, sin(a) * s * sq))
		draw_colored_polygon(q, Color((iron[2] as Color).lerp(iron[3], sq), al))
		draw_polyline(PackedVector2Array([q[0], q[1], q[2], q[3], q[0]]), Color(iron[0], al), 1.4, true)
		draw_line(q[0].lerp(q[1], .5), q[1].lerp(q[2], .5), Color(iron[4], al * .7), 1.0, true)
	for i in 6:   # sparks
		var r1 := C.rnd(i, 51); var r2 := C.rnd(i, 52)
		var an := (r1 - .5) * 2.4
		var v := Vector2(cos(an), sin(an)) * (260.0 + r2 * 220.0)
		var h := O + v * t + Vector2(0, 420.0) * t * t * .5
		var tl := O + v * maxf(0.0, t - .03)
		var al := clampf(1.0 - t / .28, 0.0, 1.0)
		if al > 0.0:
			draw_line(tl, h, Color(p[3], al), 2.0, true)
