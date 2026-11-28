extends Node2D
## A bolt from the sky (Thunder Fang, Rune Storm, Thunder Spear), seen from the game's camera: the bolt cracks down,
## flickers twice, and leaves a scorch with sparks. The ground mark is solid shapes (no white blob on snow).
## Ground point (GX, GY); the bolt starts REF_H px above it.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(180, 360)
const FPS := 24
const FRAMES := 12
const GX := 90.0
const GY := 334.0
const REF_H := 320.0
var p: Array = C.pal("wT")
var t := 0.0
var glow: GradientTexture2D

func _ready() -> void:
	glow = C.soft_tex()

func set_time(s: float) -> void:
	t = s
	queue_redraw()

func _bolt(seed: int, a: Vector2, b: Vector2, w: float, al: float) -> void:
	var pts := C.bolt_pts(a, b, seed, 14, 18.0)
	draw_polyline(pts, Color(p[1], al * .55), w * 2.6, true)
	draw_polyline(pts, Color(p[2], al), w * 1.4, true)
	draw_polyline(pts, Color(p[4], al), w * .55, true)
	for k in 2:   # branches
		var i := 3 + k * 5
		var q: Vector2 = pts[i]
		var an := PI * .5 + (C.rnd(seed, 40 + k) - .5) * 2.2
		var bp := C.bolt_pts(q, q + Vector2(cos(an), sin(an)) * 50.0, seed * 3 + k, 5, 8.0)
		draw_polyline(bp, Color(p[2], al * .8), w * .8, true)
		draw_polyline(bp, Color(p[4], al * .8), w * .3, true)

func _draw() -> void:
	var G := Vector2(GX, GY)
	var top := Vector2(GX + 26.0, GY - REF_H)
	var fr := int(t * FPS)
	# scorch + glow on the ground
	var sc := clampf(t / .04, 0.0, 1.0) * (1.0 - clampf((t - .3) / .2, 0.0, 1.0))
	draw_set_transform(G, 0.0, Vector2(1.0, .38))
	draw_circle(Vector2.ZERO, 30.0, Color(p[0], .55 * sc))
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	draw_texture_rect(glow, Rect2(G.x - 60, G.y - 26, 120, 52), false, Color(p[2], .35 * (1.0 - clampf(t / .3, 0, 1))))
	for i in 7:   # ground star
		var an := float(i) / 7.0 * TAU + C.rnd(i, 3) * .4
		var L := 30.0 + C.rnd(i, 4) * 18.0
		var e := G + Vector2(cos(an) * L, sin(an) * L * .38)
		draw_colored_polygon(PackedVector2Array([G + Vector2(cos(an + .25) * 7, sin(an + .25) * 3), e, G + Vector2(cos(an - .25) * 7, sin(an - .25) * 3)]), Color(p[2], .9 * sc))
	# the bolt: full at frames 0-1, gone at 2, back at 3-4 (another path), then fading
	var al := 0.0
	var seed := 1
	if fr <= 1: al = 1.0
	elif fr == 2: al = 0.25
	elif fr <= 4: al = .85; seed = 2
	elif fr <= 6: al = .4 * (1.0 - (fr - 5) * .5); seed = 2
	if al > 0.0:
		draw_texture_rect(glow, Rect2(G.x - 40, top.y, 80 + 30, REF_H), false, Color(p[2], .18 * al))
		_bolt(seed, top, G + Vector2(0, -4), 3.2, al)
	# sparks off the strike point
	for i in 10:
		var r1 := C.rnd(i, 11); var r2 := C.rnd(i, 12)
		var an := -PI * .5 + (r1 - .5) * 2.8
		var v := Vector2(cos(an), sin(an)) * (140.0 + r2 * 160.0)
		var h := G + Vector2(0, -6) + v * t + Vector2(0, 520.0) * t * t * .5
		var tl := G + Vector2(0, -6) + v * maxf(0.0, t - .03)
		var a2 := clampf(1.0 - t / (.3 + r2 * .1), 0.0, 1.0)
		if a2 > 0.0:
			draw_line(tl, h, Color(p[3], a2), 1.8, true)
