extends SceneTree

const CELL := Vector2i(24, 40)
const FRAME_COUNT := 4
const POSE_COUNT := 4
const INK := Color("#171c1b")
const BOOT := Color("#242927")
const SKIN := Color("#b9b690")
const SKIN_SHADE := Color("#686f54")
const BLOOD := Color("#69292a")
const COATS := ["#647b68", "#816f54", "#657e87", "#795355", "#777c52", "#665e74", "#899190"]
const TROUSERS := ["#46514b", "#4c4940", "#3c4c52", "#4e4344", "#4d5140", "#41434e", "#4b5255"]
const HAIR := ["#3e4032", "#5e503e", "#464539", "#514145", "#4f513a", "#414140", "#696b5e"]
var atlas := Image.create_empty(CELL.x * COATS.size() * FRAME_COUNT, CELL.y * POSE_COUNT, false, Image.FORMAT_RGBA8)
var origin := Vector2i.ZERO

func _initialize() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() != 1:
		printerr("Pass the output PNG path after --.")
		quit(2)
		return
	for row in range(POSE_COUNT):
		for variant in range(COATS.size()):
			for frame in range(FRAME_COUNT):
				origin = Vector2i((variant * FRAME_COUNT + frame) * CELL.x, row * CELL.y)
				draw_infected(variant, row, frame)
	var result := atlas.save_png(args[0])
	if result != OK:
		printerr("Unable to write infected atlas: ", result)
	quit(result)

# Native 24×40 pixel shapes, rasterized without antialiasing.
func shape(offset: Vector2i, points: Array, color: Color) -> void:
	var polygon := PackedVector2Array()
	var low := CELL
	var high := Vector2i.ZERO
	for point in points:
		var vertex := Vector2i(point[0], point[1]) + offset
		polygon.append(Vector2(vertex))
		low = low.min(vertex)
		high = high.max(vertex)
	low = low.max(Vector2i.ZERO)
	high = high.min(CELL)
	for y in range(low.y, high.y):
		for x in range(low.x, high.x):
			if Geometry2D.is_point_in_polygon(Vector2(x + .5, y + .5), polygon):
				atlas.set_pixelv(origin + Vector2i(x, y), color)

func pixel(offset: Vector2i, x: int, y: int, color: Color) -> void:
	var pos := offset + Vector2i(x, y)
	if Rect2i(Vector2i.ZERO, CELL).has_point(pos):
		atlas.set_pixelv(origin + pos, color)

func leg(hip: Vector2i, knee: Vector2i, foot: Vector2i, color: Color) -> void:
	var center := Vector2i.ZERO
	shape(center, [[hip.x-2,hip.y],[hip.x+3,hip.y],[knee.x+2,knee.y],[foot.x+2,foot.y-1],
		[foot.x+4,foot.y],[foot.x+4,foot.y+2],[foot.x-3,foot.y+2],[foot.x-3,foot.y-1],
		[knee.x-3,knee.y],[hip.x-3,hip.y+2]], INK)
	shape(center, [[hip.x-1,hip.y],[hip.x+2,hip.y],[knee.x+1,knee.y],[foot.x+1,foot.y-2],
		[foot.x-2,foot.y-1],[knee.x-2,knee.y]], color)
	shape(foot, [[-2,-1],[2,-1],[3,0],[3,1],[-2,1]], BOOT.lightened(.13))
	pixel(knee, 0, 1, color.lightened(.19))
	pixel(foot, 1, 0, color.lightened(.22))

func draw_infected(variant: int, pose: int, frame: int) -> void:
	var coat := Color(COATS[variant])
	var pants := Color(TROUSERS[variant])
	var hair := Color(HAIR[variant])
	var skin := [SKIN, Color("#a8a17b"), Color("#b1b498"), Color("#b7a087"),
		Color("#adab76"), Color("#aab0a2"), Color("#c2b890")][variant] as Color
	var walk := pose == 1
	var attack := pose == 2
	var hurt := pose == 3
	var phase := [0, 2, 0, -3][frame] as int if walk else 0
	var lean := [-1, -2, 1, 4][frame] as int if attack else ([-3, -2, -1, 0][frame] as int if hurt else 0)
	var bob := [0, 1, 0, 2][frame] as int if not attack and not hurt else 0
	var build := [0, 1, 0, -1, 2, -1, 0][variant] as int
	var height := [0, 1, -1, 2, -2, 1, 0][variant] as int
	var body := Vector2i(8 + lean, 12 + bob + height)
	var hips := Vector2i(10 + int(lean / 2.0), 25)
	leg(hips + Vector2i(2,0), Vector2i(14 - phase,31), Vector2i(12 - phase*2,36 - int(phase < 0)), pants.darkened(.29))
	leg(hips - Vector2i(3,0), Vector2i(7 + phase,30), Vector2i(7 + phase*2,36 - int(phase > 0)), pants)

	# Far arm and rounded back give each stance a three-quarter silhouette.
	shape(body, [[4,-1],[8,0],[10,3],[8,7],[6,6],[5,3]], coat.darkened(.32))
	shape(body, [[1-build,-2],[5,-2],[8,1],[8,6],[6,10],[3,14],[-3-build,13],
		[-4-build,10],[-3-build,5],[-2-build,1]], INK)
	shape(body, [[1-build,-1],[5,-1],[7,1],[7,6],[5,10],[3,13],[-2-build,12],
		[-3-build,9],[-2-build,4]], coat.darkened(.24))
	shape(body, [[1-build,0],[4,0],[6,2],[5,6],[3,7],[1,11],[-2-build,10],[-2-build,5]], coat)
	shape(body, [[1-build,0],[4,0],[4,2],[1,2],[-1-build,4],[-2-build,4]], coat.lightened(.22))
	shape(body, [[5,2],[6,4],[5,8],[3,11],[2,10],[3,7],[3,4]], coat.darkened(.45))
	shape(body, [[0,5],[2,4],[3,6],[1,8],[0,7]], BLOOD)
	pixel(body, 2, 8, BLOOD.darkened(.28))
	pixel(body, 0, 11, coat.lightened(.28))
	pixel(body, 1, 10, coat.lightened(.16))
	pixel(body, 4, 6, coat.darkened(.42))
	pixel(body, 3, 8, coat.lightened(.20))

	# A crooked elbow drives the reach. The near hand drops again during recovery.
	var reach := attack and frame >= 2
	var elbow := Vector2i(4, 7) if reach else Vector2i(0, 8 + int(walk and frame == 3))
	var hand := Vector2i(11-int(frame == 3), 5-int(frame == 3)*2) if reach else Vector2i(1+int(walk and frame == 1), 13)
	shape(body, [[-2,2],[2,2],[elbow.x+1,elbow.y-2],[hand.x+1,hand.y-2],
		[hand.x+2,hand.y],[hand.x+1,hand.y+2],[elbow.x,elbow.y+2],[-2,8],[-3,5]], INK)
	shape(body, [[-1,3],[1,3],[elbow.x,elbow.y-1],[elbow.x-1,elbow.y+1],[-2,7]], coat.lightened(.13))
	shape(body, [[elbow.x,elbow.y-1],[hand.x+1,hand.y-1],[hand.x+1,hand.y+1],
		[hand.x-1,hand.y+1],[elbow.x-1,elbow.y+1]], skin.darkened(.34))
	pixel(body, hand.x, hand.y-1, skin)
	pixel(body, hand.x+1, hand.y, skin.darkened(.16))
	pixel(body, hand.x, hand.y+1, BLOOD)

	var head := body + Vector2i(4, -5 + int(variant == 1))
	shape(head, [[0,-3],[4,-4],[7,-2],[8,1],[8,4],[6,7],[3,6],[1,4],[-1,2],[-1,-1]], INK)
	shape(head, [[0,-2],[4,-3],[6,-2],[7,0],[6,2],[3,3],[1,2],[0,1]], hair)
	shape(head, [[3,-1],[6,-1],[7,1],[7,4],[5,6],[3,5],[2,3],[3,1]], skin.darkened(.28))
	shape(head, [[4,-1],[6,0],[6,1],[4,1],[4,3],[3,3],[3,1]], skin)
	shape(head, [[5,1],[7,1],[7,3],[5,3],[4,2]], INK)
	pixel(head, 6, 2, Color("#d2bd95"))
	pixel(head, 4, 3, skin.lightened(.10))
	pixel(head, 6, 4, BLOOD)
	pixel(head, 5, 4, BLOOD.darkened(.3))
	pixel(head, 5, 5, skin)
	pixel(head, 6, 5, skin.darkened(.43))
	if hurt:
		pixel(head, 3, 3, BLOOD)
		pixel(head, 4, 4, BLOOD.lightened(.17))

	match variant:
		0: # Ripped field coat and brass fastener
			pixel(body, 3, 3, Color("#b5a17c"))
		1: # Hood hides the far side of the face
			shape(head, [[-2,1],[-1,-3],[3,-5],[6,-4],[7,-2],[4,-2],[2,0],[0,4]], coat)
			pixel(head, 2, -4, coat.lightened(.22))
		2: # Faded staff badge and scrub neckline
			shape(body, [[2,1],[5,1],[4,3],[3,3]], coat.lightened(.32))
			pixel(body, 4, 5, Color("#c2c4b1"))
		3: # Loose scarf and a narrower body
			shape(body, [[3,-1],[7,0],[6,3],[4,2],[3,5],[2,3]], Color("#81494a"))
		4: # Bulky workwear with a torn reflective strip
			shape(body, [[-2,2],[2,2],[3,3],[0,4],[-2,3]], Color("#b6ad72"))
			pixel(body, 5, 7, Color("#a9a270"))
		5: # Battered cap and low brim
			shape(head, [[-1,-3],[3,-5],[6,-4],[7,-2],[9,-2],[9,-1],[0,-1]], Color("#484456"))
			pixel(head, 4, -4, Color("#716778"))
		6: # Rolled sleeve and split shirt
			shape(body, [[-2,5],[1,4],[2,6],[0,7],[-2,7]], Color("#aaa99a"))
			pixel(body, 3, 10, Color("#bbad93"))
