extends "res://fx/hit_steel.gd"
## Revenge Breaker hit: a gold cut and star, sparks, and snapped Gleipnir chain links tumbling away
func _init() -> void:
	pal_name = "wG"

func _draw() -> void:
	super._draw()
	for i in 5:
		var r1 := C.rnd(i, 31); var r2 := C.rnd(i, 32)
		var an := -PI * .5 + (r1 - .5) * 2.6
		var v := Vector2(cos(an), sin(an)) * (130.0 + r2 * 120.0)
		var pos := O + v * t + Vector2(0, 520.0) * t * t * .5
		var al := clampf(1.0 - t / .4, 0.0, 1.0)
		if al <= 0.0:
			continue
		draw_set_transform(pos, r1 * 6.0 + t * (r2 - .5) * 20.0, Vector2(1.0, .55))
		draw_arc(Vector2.ZERO, 5.5, 0, TAU, 14, Color(p[0], al * .6), 4.2, true)
		draw_arc(Vector2.ZERO, 5.5, 0, TAU, 14, Color(p[2], al), 2.6, true)
		draw_arc(Vector2.ZERO, 5.5, -2.2, -0.9, 6, Color(p[4], al), 1.2, true)
		draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
