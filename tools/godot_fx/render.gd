extends SceneTree
## Offline flipbook renderer.
## godot --path tools/godot_fx --script render.gd -- fx=<name> out=<dir> [ss=2]
## Every effect (fx/<name>.gd) is a Node2D with:
##   const SIZE := Vector2i(w, h)   frame size in output px (rendered ss× bigger, the packer scales it down = anti-aliasing)
##   const FPS := 24, const FRAMES := n
##   func set_time(t: float)        pure function of t (seconds) -> fully deterministic, scrubbable
## Frames are saved as straight PNG with PREMULTIPLIED colour (Godot blends onto the transparent target);
## tools/godot_fx/pack.py un-premultiplies, scales down, trims and packs them.

func _initialize() -> void:
	_run.call_deferred()

func _arg(name: String, def: String) -> String:
	for a in OS.get_cmdline_user_args():
		if a.begins_with(name + "="):
			return a.substr(name.length() + 1)
	return def

func _run() -> void:
	var fx_name := _arg("fx", "")
	var out_dir := _arg("out", "")
	var ss := int(_arg("ss", "2"))
	var scr: GDScript = load("res://fx/%s.gd" % fx_name)
	if scr == null or not scr.can_instantiate():
		printerr("effect failed to load: ", fx_name); quit(1); return
	var fx: Node2D = scr.new()
	var size: Vector2i = fx.SIZE * ss
	var vp := SubViewport.new()
	vp.size = size
	vp.transparent_bg = true
	vp.disable_3d = true
	vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	vp.canvas_item_default_texture_filter = Viewport.DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_LINEAR
	root.add_child(vp)
	var holder := Node2D.new()
	holder.scale = Vector2(ss, ss)
	vp.add_child(holder)
	holder.add_child(fx)
	DirAccess.make_dir_recursive_absolute(out_dir)
	var n: int = fx.FRAMES
	for i in n:
		fx.set_time(float(i) / fx.FPS)
		await process_frame
		await RenderingServer.frame_post_draw
		await RenderingServer.frame_post_draw
		var img := vp.get_texture().get_image()
		img.save_png("%s/%03d.png" % [out_dir, i])
	print("rendered %s: %d frames %dx%d" % [fx_name, n, size.x, size.y])
	quit(0)
