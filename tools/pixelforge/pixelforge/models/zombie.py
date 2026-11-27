"""Shambling zombie woman: hunched (torso/head stepped forward), long brown hair, burgundy open
cardigan, blood-spotted cream shirt, torn jeans, brown boots. ~47 units. Front = +x, up = +z."""
SKIN = (124, 136, 114)
SKIN_D = (98, 110, 92)
HAIR = (84, 56, 42)
HAIR_D = (60, 40, 32)
CARD = (146, 54, 88)
CARD_D = (110, 40, 66)
SHIRT = (228, 222, 198)
BLOOD = (150, 26, 32)
JEANS = (58, 64, 80)
JEANS_D = (44, 48, 62)
BOOT = (136, 88, 52)
BOOT_D = (98, 62, 38)
RING = (66, 68, 60)
EYE = (232, 232, 216)
BLACK = (22, 22, 30)

B = []


def box(x0, y0, z0, x1, y1, z1, col):
    B.append((x0, y0, z0, x1, y1, z1, col))


# NOTE: boxes must not intersect (renderer orders whole boxes); butt them against each other.
# --- legs (one stepping forward, knees bent) ---
box(0.5, 0.4, 0, 7.0, 3.8, 3.0, BOOT)               # forward boot (+y side)
box(0.5, 0.4, 3.0, 7.0, 3.8, 4.0, BOOT_D)           # boot cuff
box(-3.5, -3.8, 0, 3.0, -0.4, 3.0, BOOT)            # back boot
box(-3.5, -3.8, 3.0, 3.0, -0.4, 4.0, BOOT_D)
box(1.0, 0.5, 4.0, 4.2, 3.6, 13.0, JEANS)           # forward shin
box(4.2, 1.2, 8.6, 4.6, 2.9, 11.6, SKIN)            # torn knee, bare skin
box(0.0, 0.5, 13.0, 4.0, 3.7, 22.5, JEANS)          # forward thigh
box(-2.6, -3.6, 4.0, 0.6, -0.5, 13.0, JEANS_D)      # back shin
box(-2.4, -3.7, 13.0, 1.4, -0.5, 22.5, JEANS_D)     # back thigh
box(-3.0, -4.4, 22.5, 3.6, 4.4, 25.5, JEANS)        # hips
# --- torso, stepped forward for the hunch ---
box(0.0, -3.6, 25.5, 4.6, 3.6, 31.5, SHIRT)         # shirt lower
box(0.8, -3.6, 31.5, 5.4, 3.6, 38.0, SHIRT)         # shirt upper / chest
for (y, z) in ((-2.4, 27.0), (1.0, 29.2), (-0.8, 33.0), (1.6, 35.0)):  # blood spots
    box(4.6 if z < 31.5 else 5.4, y, z, 5.0 if z < 31.5 else 5.8, y + 1.3, z + 1.3, BLOOD)
# cardigan: ribbed hem, back, sides, open front flaps
box(-1.4, -5.0, 24.2, 4.6, 5.0, 25.4, CARD_D)       # ribbed hem
box(-1.4, -5.0, 25.4, 0.0, 5.0, 31.5, CARD)         # back lower
box(-0.6, -5.0, 31.5, 0.8, 5.0, 38.2, CARD)         # back upper
box(0.0, 3.6, 25.4, 4.6, 5.0, 31.5, CARD)           # side +y
box(0.0, -5.0, 25.4, 4.6, -3.6, 31.5, CARD)         # side -y
box(0.8, 3.6, 31.5, 5.4, 5.0, 38.2, CARD)
box(0.8, -5.0, 31.5, 5.4, -3.6, 38.2, CARD)
box(4.6, 1.7, 25.4, 5.3, 5.0, 31.5, CARD)           # front flaps
box(4.6, -5.0, 25.4, 5.3, -1.7, 31.5, CARD)
box(5.4, 1.7, 31.5, 6.1, 5.0, 38.0, CARD_D)
box(5.4, -5.0, 31.5, 6.1, -1.7, 38.0, CARD_D)
# --- arms hanging, limp, hands forward ---
for s in (1, -1):
    y0, y1 = (5.0, 7.2) if s > 0 else (-7.2, -5.0)
    box(0.6, y0, 29.0, 3.8, y1, 37.8, CARD)         # upper arm
    box(1.8, y0, 24.0, 5.0, y1, 29.0, CARD)         # forearm swings forward
    box(1.8, y0, 23.4, 5.0, y1, 24.0, CARD_D)       # cuff
    box(2.6, y0 + 0.1, 20.6, 6.0, y1 - 0.1, 23.4, SKIN)   # hand
# --- neck + head (pushed forward, big cartoon head) ---
box(2.4, -1.8, 37.6, 5.0, 1.8, 38.4, SKIN_D)
box(3.0, -4.0, 38.4, 10.0, 4.0, 46.6, SKIN)         # head
box(10.0, -0.6, 40.0, 10.8, 0.6, 42.2, SKIN)        # nose
box(10.0, -3.4, 41.8, 10.3, -0.5, 44.6, RING)       # dark eye sockets
box(10.0, 0.5, 41.8, 10.3, 3.4, 44.6, RING)
box(10.3, -2.8, 42.4, 10.6, -1.0, 44.0, EYE)        # eyes
box(10.3, 1.0, 42.4, 10.6, 2.8, 44.0, EYE)
box(10.6, -2.2, 42.8, 10.9, -1.5, 43.6, BLACK)      # pupils
box(10.6, 1.5, 42.8, 10.9, 2.2, 43.6, BLACK)
box(10.0, -1.6, 38.9, 10.3, 1.6, 39.7, BLOOD)       # mouth
box(10.0, -3.6, 38.8, 10.3, -2.4, 41.6, SKIN_D)     # hollow cheeks
box(10.0, 2.4, 38.8, 10.3, 3.6, 41.6, SKIN_D)
# --- long hair (kept above the shoulders so it never intersects the torso) ---
box(1.2, -4.8, 46.6, 10.4, 4.8, 48.4, HAIR)         # top
box(10.0, -4.0, 44.6, 10.5, 4.0, 46.6, HAIR_D)      # fringe
box(1.2, -4.8, 38.4, 3.0, 4.8, 46.6, HAIR)          # back curtain
box(3.0, 4.0, 38.4, 9.4, 5.0, 46.6, HAIR)           # side locks
box(3.0, -5.0, 38.4, 9.4, -4.0, 46.6, HAIR)
box(3.0, 5.0, 38.4, 7.0, 5.8, 41.4, HAIR_D)         # strands draping over shoulders
box(3.0, -5.8, 38.4, 7.0, -5.0, 41.4, HAIR_D)
BOXES = B
