extends Node2D
## Swing crescent strip (see shaders/slash_strip.gdshader). Subclasses set KIND and PAL_NAME.
const C := preload("res://fx/common.gd")
const SIZE := Vector2i(512, 128)
const FPS := 15
const FRAMES := 16

var kind := 0.0
var pal_name := "wS"
var rect: ColorRect

func _ready() -> void:
	var p := C.pal(pal_name)
	rect = ColorRect.new()
	rect.size = Vector2(SIZE)
	var m := ShaderMaterial.new()
	m.shader = load("res://shaders/slash_strip.gdshader")
	m.set_shader_parameter("kind", kind)
	for i in 5:
		m.set_shader_parameter("c%d" % i, p[i])
	m.set_shader_parameter("n1", C.noise_tex(11 + int(kind) * 7, 0.012))
	m.set_shader_parameter("n2", C.noise_tex(5 + int(kind) * 3, 0.03, true))
	rect.material = m
	add_child(rect)

func set_time(s: float) -> void:
	if rect:
		rect.material.set_shader_parameter("t", s * FPS / float(FRAMES - 1))
