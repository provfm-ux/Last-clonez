extends SceneTree

const CELL := Vector2i(18, 32)
const INK := Color("#171c1b")
const BOOT := Color("#242927")
const SKIN := Color("#a7a985")
const SKIN_SHADE := Color("#67775d")
const BLOOD := Color("#6a2427")
const COATS := ["#647b68", "#816f54", "#657e87", "#795355", "#777c52", "#665e74", "#899190"]
const TROUSERS := ["#46514b", "#4c4940", "#3c4c52", "#4e4344", "#4d5140", "#41434e", "#4b5255"]
const HAIR := ["#3e4032", "#5e503e", "#464539", "#514145", "#4f513a", "#414140", "#696b5e"]
var atlas := Image.create_empty(504, 128, false, Image.FORMAT_RGBA8)
var origin := Vector2i.ZERO

func _initialize() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() != 1:
		printerr("Pass the output PNG path after --.")
		quit(2)
		return
	for row in range(4):
		for variant in range(COATS.size()):
			for frame in range(4):
				origin = Vector2i((variant * 4 + frame) * CELL.x, row * CELL.y)
				draw_infected(variant, row, frame)
	var result := atlas.save_png(args[0])
	if result != OK:
		printerr("Unable to write infected atlas: ", result)
	quit(result)

func pixels(x: int, y: int, w: int, h: int, color: Color) -> void:
	var region := Rect2i(x, y, w, h).intersection(Rect2i(Vector2i.ZERO, CELL))
	region.position += origin
	atlas.fill_rect(region, color)

func draw_infected(variant: int, pose: int, frame: int) -> void:
	var coat := Color(COATS[variant])
	var pants := Color(TROUSERS[variant])
	var hair := Color(HAIR[variant])
	var stride := [0, 2, 0, -2][frame] as int if pose == 1 else 0
	var bob := int(frame == 1 or frame == 3) if pose < 2 else 0
	var lean := [0, -1, 1, 2][frame] as int if pose == 2 else 0
	if pose == 3:
		lean = [-2, -1, -1, 0][frame]
	var shoulder := 10 - bob + int(pose == 3 and frame == 0)
	var head_x := 7 + lean - int(pose == 1 and frame == 2)
	var head_y := 3 - bob + int(pose == 3)
	# Far leg and near leg share a planted baseline at y=30.
	pixels(5, 20, 7, 4, INK)
	for leg in range(2):
		var foot_x := 5 + leg * 4 + stride * (1 if leg == 0 else -1)
		var foot_y := 28 - int((leg == 0 and stride > 0) or (leg == 1 and stride < 0))
		pixels(foot_x - 1, 23, 5, foot_y - 21, INK)
		pixels(foot_x, 23, 3, foot_y - 23, pants.darkened(0.20) if leg == 0 else pants)
		pixels(foot_x, foot_y, 4, 2, BOOT)
		pixels(foot_x + 1, foot_y, 2, 1, pants)
	# Far sleeve, ragged jacket, and forward arm.
	pixels(3 + lean, shoulder + 3, 4, 9, INK)
	pixels(4 + lean, shoulder + 4, 2, 6, coat.darkened(0.26))
	pixels(4 + lean, shoulder + 10, 2, 1, SKIN_SHADE)
	pixels(6 + lean, shoulder, 7, 12, INK)
	pixels(7 + lean, shoulder + 1, 5, 9, coat)
	pixels(7 + lean, shoulder + 2, 2, 5, coat.lightened(0.15))
	pixels(10 + lean, shoulder + 5, 2, 5, coat.darkened(0.25))
	pixels(8 + lean, shoulder + 9, 1, 2, coat)
	pixels(9 + lean, shoulder + 4, 1, 2, BLOOD)
	pixels(8 + lean, shoulder + 5, 1, 1, BLOOD.darkened(0.2))
	var reach := 3 + int(pose == 2 and frame >= 2)
	var arm_x := mini(11 + lean, 18 - reach - 2)
	var arm_y := shoulder + 4 - int(pose == 2 and frame >= 2) * 2 + int(pose == 0 and frame == 2)
	pixels(arm_x, shoulder + 2, 3, arm_y - shoulder + 1, INK)
	pixels(arm_x, arm_y, reach + 2, 4, INK)
	pixels(arm_x + 1, arm_y + 1, reach, 2, coat.darkened(0.11))
	pixels(arm_x + reach, arm_y + 1, 2, 2, SKIN_SHADE)
	pixels(arm_x + reach, arm_y + 1, 1, 1, SKIN)
	# Head silhouette, cheek highlight and recessed eye.
	pixels(head_x + 1, head_y, 5, 1, INK)
	pixels(head_x, head_y + 1, 7, 6, INK)
	pixels(head_x + 1, head_y + 1, 5, 2, hair)
	pixels(head_x + 2, head_y + 3, 5, 3, SKIN_SHADE)
	pixels(head_x + 3, head_y + 3, 3, 2, SKIN)
	pixels(head_x + 5, head_y + 3, 1, 1, INK)
	pixels(head_x + 5, head_y + 5, 2, 1, BLOOD)
	pixels(head_x + 3, head_y + 6, 3, 1, SKIN_SHADE)
	if pose == 3:
		pixels(head_x + 4, head_y + 4, 1, 1, Color("#c68170"))

	# Outfit details stay readable at native scale and follow torso or head motion.
	match variant:
		0: # Torn field jacket
			pixels(8 + lean, shoulder + 2, 2, 1, Color("#a3a080"))
		1: # Hooded worker
			pixels(head_x, head_y + 1, 2, 5, coat.darkened(0.34))
			pixels(head_x + 1, head_y, 5, 2, coat)
		2: # Medical scrubs
			pixels(8 + lean, shoulder + 3, 2, 1, Color("#a0aeaa"))
			pixels(8 + lean, shoulder + 4, 1, 1, Color("#a0aeaa"))
		3: # Split scarf
			pixels(7 + lean, shoulder, 6, 2, Color("#594444"))
			pixels(7 + lean, shoulder + 2, 1, 4, Color("#594444"))
		4: # Patched coveralls
			pixels(8 + lean, shoulder + 3, 4, 1, coat.lightened(0.23))
			pixels(11 + lean, shoulder + 4, 1, 3, coat.lightened(0.23))
		5: # Battered cap
			pixels(head_x, head_y, 6, 2, Color("#383441"))
			pixels(head_x + 3, head_y + 2, 5, 1, Color("#514a60"))
		6: # Bone showing through a torn sleeve
			pixels(4 + lean, shoulder + 8, 2, 1, Color("#b3b39a"))
			pixels(5 + lean, shoulder + 9, 1, 2, Color("#b3b39a"))
