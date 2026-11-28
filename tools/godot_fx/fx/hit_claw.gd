extends "res://fx/hit_base.gd"
## Savage Rend / Predator's Leap hit: Fenrir's three claw rakes torn across the body one after another, blood thrown
## (hit_claw_ice = the spirit wolf's ice claws: same rakes, ice chips instead of blood)
var ice := false

func _init() -> void:
	pal_name = "wA"

func _rake(off: float, delay: float, L: float, w: float) -> void:
	var tt := t - delay
	if tt <= 0.0:
		return
	var u := clampf(tt / .22, 0.0, 1.0)
	if u >= 1.0:
		return
	var g := C.e_out(tt / .05)
	var ww := w * (1.0 - u)
	var c := O + Vector2(0, off)
	var a := c + Vector2(-L * .5, -L * .18)
	var b := a.lerp(c + Vector2(L * .5, L * .18), g)
	var n := (b - a).normalized().orthogonal()
	for ly in [[1.35, p[0], .45], [1.0, p[1], 1.0], [.62, p[2], 1.0], [.3, p[4], 1.0]]:
		var pts := PackedVector2Array()
		for i in 13:
			var s := float(i) / 12.0
			pts.append(a.lerp(b, s) + n * sin(PI * pow(s, .8)) * ww * ly[0] * .5)
		for i in range(12, -1, -1):
			var s := float(i) / 12.0
			pts.append(a.lerp(b, s) - n * sin(PI * pow(s, .8)) * ww * ly[0] * .5)
		var col: Color = ly[1]
		col.a = ly[2] * (1.0 - u * .5)
		draw_colored_polygon(pts, col)

func _draw() -> void:
	soft(O, 30.0 * (1.0 - clampf(t / .2, 0, 1)), Color(p[2], .3))
	for i in 3:
		_rake((i - 1) * 13.0, i * .03, 96.0 - absf(i - 1) * 14.0, 11.0)
	for i in 12:
		var r1 := C.rnd(i, 61); var r2 := C.rnd(i, 62); var r3 := C.rnd(i, 63)
		var an := (r1 - .5) * 1.8 + .3
		var v := Vector2(cos(an), sin(an)) * (130.0 + r2 * 200.0)
		var tt := maxf(0.0, t - .03)
		var pos := O + v * tt + Vector2(0, 600.0) * tt * tt * .5
		var al := clampf(1.0 - tt / (.3 + r3 * .12), 0.0, 1.0)
		if al <= 0.0 or tt <= 0.0:
			continue
		var s := 2.2 + r3 * 3.0
		if ice:
			var rot := an + tt * 12.0 * (r1 - .5)
			var q := PackedVector2Array([pos + Vector2(cos(rot), sin(rot)) * s * 1.8, pos + Vector2(cos(rot + 2.4), sin(rot + 2.4)) * s * .8, pos + Vector2(cos(rot - 2.4), sin(rot - 2.4)) * s * .8])
			draw_colored_polygon(q, Color(p[3], al))
		else:
			var vel := v + Vector2(0, 600.0) * tt
			var dir := vel.normalized()
			draw_line(pos - dir * s * 2.5, pos, Color(p[1].lerp(p[2], r2), al), s, true)
			draw_circle(pos, s * .55, Color(p[2], al))
