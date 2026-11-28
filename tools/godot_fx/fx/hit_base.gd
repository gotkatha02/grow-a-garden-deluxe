extends Node2D
## Hit marks on the target (billboards, drawn facing the camera). The cut lies along +x; the game turns the picture to
## the swing's cut angle. Subclasses pick the palette and what flies off: steel sparks, blood, ice shards.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(160, 160)
const FPS := 24
const FRAMES := 11
var O := Vector2(80, 80)
var t := 0.0
var pal_name := "wS"
var p: Array
var glow: GradientTexture2D

func _ready() -> void:
	p = C.pal(pal_name)
	glow = GradientTexture2D.new()
	glow.width = 64; glow.height = 64
	glow.fill = GradientTexture2D.FILL_RADIAL
	glow.fill_from = Vector2(0.5, 0.5); glow.fill_to = Vector2(1.0, 0.5)
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 1)); g.set_color(1, Color(1, 1, 1, 0))
	glow.gradient = g

func set_time(s: float) -> void:
	t = s
	queue_redraw()

func soft(c: Vector2, r: float, col: Color) -> void:
	draw_texture_rect(glow, Rect2(c.x - r, c.y - r, r * 2, r * 2), false, col)

## lens-shaped cut along +x: appears at once, thins and fades
func cut(L: float, w: float, life: float) -> void:
	var u := clampf(t / life, 0.0, 1.0)
	if u >= 1.0:
		return
	var grow := C.e_out(t / .05)
	var ww := w * (1.0 - u) * grow
	var LL := L * (0.75 + .25 * grow)
	var layers := [[1.25, p[0], .5], [1.0, p[1], 1.0], [.7, p[2], 1.0], [.42, p[3], 1.0], [.18, p[4], 1.0]]
	for ly in layers:
		var pts := PackedVector2Array()
		var N := 16
		for i in N + 1:
			var s := float(i) / N
			pts.append(O + Vector2(lerpf(-LL / 2, LL / 2, s), -sin(PI * s) * ww * ly[0] * .5))
		for i in range(N, -1, -1):
			var s := float(i) / N
			pts.append(O + Vector2(lerpf(-LL / 2, LL / 2, s), sin(PI * s) * ww * ly[0] * .5))
		var c: Color = ly[1]
		c.a = ly[2] * (1.0 - u * .6)
		draw_colored_polygon(pts, c)

## four-point star
func star(r: float, rot: float, col: Color, core: Color) -> void:
	if r <= .5:
		return
	for k in 2:
		var rr := r * (1.0 if k == 0 else .55)
		var pts := PackedVector2Array()
		for i in 8:
			var an := rot + float(i) / 8.0 * TAU
			var q := rr if i % 2 == 0 else rr * .18
			pts.append(O + Vector2(cos(an), sin(an)) * q)
		draw_colored_polygon(pts, col if k == 0 else core)
