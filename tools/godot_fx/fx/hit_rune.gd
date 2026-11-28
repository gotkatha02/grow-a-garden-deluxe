extends "res://fx/hit_base.gd"
## Rune Burst hit: a cold flash and one carved rune (Algiz, the warding rune) that lights up on the body and drifts up
func _init() -> void:
	pal_name = "wR"

func _rune(c: Vector2, s: float, col: Color, w: float) -> void:
	var lines := [[Vector2(0, 1), Vector2(0, -1)], [Vector2(0, -.15), Vector2(-.6, -.85)], [Vector2(0, -.15), Vector2(.6, -.85)]]
	for l in lines:
		draw_line(c + l[0] * s, c + l[1] * s, col, w, true)

func _draw() -> void:
	soft(O, 36.0 * (1.0 - clampf(t / .25, 0, 1)), Color(p[3], .45))
	var sr := 26.0 * C.e_out(t / .04) * (1.0 - clampf((t - .04) / .12, 0, 1))
	star(sr, .78, p[3], p[4])
	var u := clampf(t / .42, 0.0, 1.0)
	var pop := C.e_back(t / .1)
	var c := O + Vector2(0, -26.0 * C.e_out(u))
	var al := 1.0 - C.e_in(u)
	var s := 16.0 * pop
	soft(c, 26.0, Color(p[2], .4 * al))
	_rune(c + Vector2(1.5, 2), s, Color(p[0], .5 * al), 5.0)
	_rune(c, s, Color(p[2], al), 4.6)
	_rune(c, s, Color(p[4], al), 1.8)
	for i in 6:
		var an := float(i) / 6.0 * TAU + .3
		var r := 10.0 + 40.0 * C.e_out(u)
		var q := O + Vector2(cos(an), sin(an) * .7) * r
		var a2 := (1.0 - u)
		draw_colored_polygon(PackedVector2Array([q + Vector2(0, -3), q + Vector2(2, 0), q + Vector2(0, 3), q + Vector2(-2, 0)]), Color(p[3], a2))
