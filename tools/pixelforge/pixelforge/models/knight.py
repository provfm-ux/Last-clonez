"""Cartoon late-medieval knight (pointed bascinet, mail collar, spiked pauldrons, longsword
held diagonally across the chest). ~56 units tall. Front = +x, left = +y, up = +z.
Built from a reference photo; proportions read off it (head ~ 1/5, big cartoon head)."""
import math

STEEL = (176, 188, 210)
STEEL_D = (126, 134, 150)
BRASS = (156, 130, 74)
MAIL = (108, 110, 120)
MAIL_D = (54, 54, 62)
LEATHER = (104, 46, 54)
GOLD = (218, 172, 72)
BLADE = (200, 200, 188)
GRIP = (72, 42, 32)
BLACK = (22, 22, 30)

B = []


def box(x0, y0, z0, x1, y1, z1, col):
    B.append((x0, y0, z0, x1, y1, z1, col))


def sym(x0, y0, z0, x1, y1, z1, col):
    """Add box and its mirror across y=0 (y0,y1 given for the +y side)."""
    box(x0, y0, z0, x1, y1, z1, col)
    box(x0, -y1, z0, x1, -y0, z1, col)


def line(p0, p1, th, col, step=0.7):
    n = max(1, int(math.dist(p0, p1) / step))
    for i in range(n + 1):
        t = i / n
        x, y, z = (p0[k] + (p1[k] - p0[k]) * t for k in range(3))
        h = th / 2
        box(x - h * 0.5, y - h, z - h, x + h * 0.5, y + h, z + h, col)


# --- legs ---
sym(-2.4, 0.1, 0, 4.0, 3.9, 3.2, MAIL_D)            # mail sabatons
sym(-1.9, 0.3, 3.2, 1.9, 3.5, 15, BRASS)            # greaves
sym(-2.5, 0.1, 14.5, 2.6, 3.9, 18, STEEL)           # knee cops
sym(-2.0, 0.3, 18, 2.0, 3.6, 21, STEEL_D)           # cuisses
# --- skirt, faulds, belt ---
box(-3.9, -5.8, 19, 3.9, 5.8, 27, MAIL_D)           # mail skirt
box(3.9, -5.0, 22, 4.7, -0.3, 29.5, STEEL)          # front faulds (two plates)
box(3.9, 0.3, 22, 4.7, 5.0, 29.5, STEEL)
box(3.9, -4.6, 21, 4.5, -0.6, 22, STEEL_D)
box(3.9, 0.6, 21, 4.5, 4.6, 22, STEEL_D)
sym(-3.0, 5.8, 22, 3.0, 6.6, 29, STEEL_D)           # side plates
box(-3.9, -5.8, 29, 3.9, 5.8, 31, LEATHER)          # belt
box(3.9, -0.9, 29.2, 4.4, 0.9, 30.8, GOLD)          # buckle
# --- torso ---
box(-3.8, -5.4, 31, 3.8, 5.4, 36, (160, 146, 112))  # breastplate, bronze tarnish low
box(-3.8, -5.4, 36, 3.8, 5.4, 40, STEEL)            # breastplate upper
box(3.8, -4.4, 33.5, 4.7, 4.4, 40, STEEL)           # chest bulge
box(3.8, -0.4, 31, 4.4, 0.4, 40, STEEL_D)           # centre ridge
# --- shoulders, collar ---
sym(-3.6, 5.0, 37, 3.6, 9.6, 43, STEEL)             # pauldrons
sym(-3.2, 5.6, 36, 3.2, 9.8, 37, STEEL_D)           # lower lame
sym(-0.6, 7.0, 43, 0.6, 8.6, 45.2, STEEL)           # pauldron spikes
box(-4.2, -5.8, 39.5, 4.2, 5.8, 42.5, MAIL)         # mail collar
# --- arms (sword arms) ---
sym(-1.6, 6.6, 31, 1.6, 9.4, 38, STEEL)             # upper arms
box(-1.6, -9.4, 24.5, 1.6, -6.4, 31, STEEL_D)       # model-right elbow+forearm drop
box(1.6, -8.9, 24.6, 4.0, -6.5, 27.4, STEEL_D)      # model-right forearm forward
box(-1.6, 6.6, 33, 1.6, 9.4, 38, STEEL_D)
box(1.6, 5.2, 35.8, 4.0, 8.4, 38.6, STEEL_D)        # model-left forearm forward
# --- sword: pommel low-right to tip high-left of the viewer ---
P0, P1 = (5.0, -12.0, 22.5), (5.0, 12.5, 43.0)
def at(t):
    return tuple(P0[k] + (P1[k] - P0[k]) * t for k in range(3))
line(P0, at(0.22), 1.8, GRIP)                       # grip
line(at(0.22), P1, 2.2, BLADE)                      # blade
box(P0[0] - 1, P0[1] - 1, P0[2] - 1, P0[0] + 1, P0[1] + 1, P0[2] + 1, GOLD)   # pommel
gx, gy, gz = at(0.24)
line((gx, gy + 2.6, gz - 3.1), (gx, gy - 2.6, gz + 3.1), 1.8, GOLD)           # crossguard
# gauntlets on the grip / blade
for t in (0.12, 0.74):
    x, y, z = at(t)
    box(3.7, y - 1.7, z - 1.7, 6.3, y + 1.7, z + 1.7, STEEL)
# --- neck gorget, helmet ---
box(-2.9, -2.9, 40.5, 2.9, 2.9, 44, STEEL_D)        # bevor
box(2.9, -1.3, 40.2, 4.4, 1.3, 44, STEEL)           # bevor point
box(-3.9, -3.9, 44, 3.9, 3.9, 51, STEEL)            # skull
box(3.9, -3.0, 44.2, 4.7, 3.0, 49.5, STEEL_D)       # visor
box(4.7, -2.6, 47.0, 5.0, 2.6, 48.2, BLACK)         # eye slit
box(3.9, -0.5, 44.2, 5.0, 0.5, 51, STEEL)           # front ridge
box(-3.0, -3.0, 51, 3.0, 3.0, 53, STEEL)            # dome taper
box(-2.0, -2.0, 53, 2.0, 2.0, 54.8, STEEL)
box(-1.0, -1.0, 54.8, 1.0, 1.0, 56.4, STEEL)        # point
# mirror y so the sword rises to the viewer's right like the reference photo
BOXES = [(x0, -y1, z0, x1, -y0, z1, c) for (x0, y0, z0, x1, y1, z1, c) in B]
