"""Shambling zombie woman built from ellipsoids (organic renderer).
Hunched, head forward, long brown hair, burgundy open cardigan over blood-spotted cream shirt,
torn jeans, brown boots, gaunt grey-green face. ~48 units tall. Front +x, left +y, up +z."""
from ..organic import Scene

MATS = {
    "skin": (128, 142, 120), "skin_d": (98, 112, 96), "jeans": (64, 72, 92),
    "boot": (142, 94, 58), "sole": (76, 52, 40), "cardi": (152, 58, 94), "cardi_d": (118, 44, 74),
    "shirt": (232, 226, 202), "blood": (150, 28, 34), "hair": (96, 64, 48), "hair_d": (68, 46, 36),
    "eye": (238, 238, 224), "black": (22, 22, 30), "ring": (76, 80, 70), "mouth": (92, 32, 38),
}


def build():
    s = Scene(MATS)
    U = 5.0                                    # extra leg length: lifts everything above the knees
    # ---- legs: left leg steps forward, knees bent ----
    for hip, knee, ankle in (((0.2, 2.3, 23.5 + U), (4.0, 2.5, 14.0 + U / 2), (2.2, 2.5, 4.0)),
                             ((0.2, -2.3, 23.5 + U), (0.6, -2.4, 13.5 + U / 2), (-2.0, -2.4, 4.0))):
        s.limb(hip, knee, 2.35, "jeans")
        s.ball(knee, 1.95, "jeans")
        s.limb(knee, ankle, 1.75, "jeans")
        s.limb(ankle, (ankle[0], ankle[1], 7.0), 2.0, "boot")                 # boot shaft
        s.ell((ankle[0] + 1.6, ankle[1], 2.0), (3.3, 1.9, 2.0), "boot")       # foot
        s.ell((ankle[0] + 1.8, ankle[1], 0.8), (3.5, 2.0, 0.8), "sole")
    s.ell((5.9, 2.5, 14.0 + U / 2), (0.6, 1.2, 1.4), "skin")                  # torn knee
    s.ell((5.7, 3.1, 11.6 + U / 2), (0.35, 0.5, 0.9), "blood")
    s.ell((0.3, 0, 24.6 + U), (3.0, 4.2, 3.0), "jeans")                       # hips
    # ---- torso (slim) ----
    s.ell((0.5, 0, 31.8 + U), (2.4, 4.2, 7.0), "cardi")                        # cardigan back
    s.ell((2.1, 0, 36.6 + U), (2.2, 4.6, 3.0), "cardi")                        # shoulders
    for side in (1, -1):
        s.ell((1.9, side * 3.2, 30.8 + U), (2.7, 1.9, 6.8), "cardi")           # open front flaps
    shirt = s.ell((2.7, 0, 32.0 + U), (2.8, 2.8, 6.6), "shirt")
    s.ell((1.4, 0, 25.0 + U), (3.0, 4.4, 0.9), "cardi_d")                      # ribbed hem
    for y, z in ((-1.5, 29.0), (1.0, 31.4), (-0.4, 35.0), (1.8, 27.4), (-2.1, 33.0)):
        s.ell((s.front_x(shirt, y, z + U) + 0.1, y, z + U), (0.35, 0.8, 0.65), "blood")
    for side in (1, -1):
        s.ell((3.9, side * 1.7, 38.7 + U), (1.1, 0.9, 1.5), "shirt")           # collar
    s.limb((3.3, 0, 38.4 + U), (5.2, 0, 41.0 + U), 1.5, "skin_d")              # neck
    # ---- arms hang limp, hands forward ----
    for side in (1, -1):
        sh = (2.2, side * 4.5, 36.4 + U)
        el = (3.0, side * 5.3, 29.8 + U)
        wr = (4.8, side * 5.2, 23.4 + U)
        s.ball(sh, 2.0, "cardi")
        s.limb(sh, el, 1.7, "cardi")
        s.limb(el, wr, 1.5, "cardi")
        s.ball(wr, 1.7, "cardi_d")
        s.ell((5.5, side * 5.2, 20.9 + U), (1.0, 0.9, 2.5), "skin")
    # ---- head ----
    hz = 43.6 + U
    skull = s.ell((6.2, 0, hz), (3.9, 3.3, 4.6), "skin")
    for side in (1, -1):
        y = side * 1.4
        fx = s.front_x(skull, y, hz + 0.6)
        s.ell((fx - 0.1, y, hz + 0.6), (0.7, 1.0, 1.05), "ring")
        s.ell((fx + 0.2, y, hz + 0.6), (0.55, 0.75, 0.7), "eye")
        s.ell((fx + 0.65, y, hz + 0.55), (0.2, 0.3, 0.3), "black")
        s.ell((s.front_x(skull, side * 2.2, hz - 2.0), side * 2.2, hz - 2.0), (0.5, 0.9, 1.1), "skin_d")
    s.ell((s.front_x(skull, 0, hz - 1.2) + 0.5, 0, hz - 1.2), (0.9, 0.55, 1.1), "skin")
    s.ell((s.front_x(skull, 0, hz - 3.2) + 0.05, 0, hz - 3.2), (0.35, 1.5, 0.35), "mouth")
    # ---- long hair ----
    s.ell((5.0, 0, hz + 1.6), (4.3, 3.9, 4.5), "hair")
    s.ell((3.2, 0, hz - 3.2), (2.0, 3.8, 5.6), "hair")
    s.ell((2.5, 0, hz - 7.6), (1.7, 3.4, 2.4), "hair_d")
    for side in (1, -1):
        s.limb((7.0, side * 3.0, hz + 2.6), (5.6, side * 4.0, hz - 6.0), 1.4, "hair")
        s.limb((6.2, side * 3.6, hz + 0.4), (4.4, side * 4.4, hz - 7.2), 1.2, "hair_d")
    s.ell((8.9, -0.8, hz + 4.2), (2.0, 3.3, 1.4), "hair_d")
    return s
