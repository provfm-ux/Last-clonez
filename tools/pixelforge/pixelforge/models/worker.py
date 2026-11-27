"""Zombie construction worker: orange hard hat, hi-vis vest with white stripes over an olive hooded
top, fingerless gloves, rolled torn jeans, work boots. Upright, slightly slumped. ~50 units.
Front +x, left +y, up +z. Built from a turnaround reference."""
from ..organic import Scene, stripe

MATS = {
    "skin": (126, 140, 116), "skin_d": (98, 112, 94), "sore": (150, 58, 66), "ring": (92, 56, 66),
    "eye": (232, 216, 216), "black": (22, 22, 30), "mouth": (84, 34, 40),
    "hat": (236, 116, 32), "hair": (42, 34, 40),
    "shirt": (104, 90, 60), "hood": (92, 80, 54), "tee": (86, 90, 98),
    "vest": (244, 182, 44), "vest_d": (206, 140, 30), "reflect": (244, 242, 232),
    "glove": (36, 34, 42), "jeans": (56, 64, 90), "cuff": (74, 84, 110),
    "boot": (96, 66, 46), "sole": (54, 40, 34), "blood": (140, 28, 34),
}


def build():
    s = Scene(MATS)
    # ---- legs, boots ----
    for side in (1, -1):
        hip, knee, ankle = (0.2, side * 2.4, 22.0), (0.9, side * 2.5, 12.2), (0.0, side * 2.6, 4.0)
        s.limb(hip, knee, 2.5, "jeans")
        s.ball(knee, 2.1, "jeans")
        s.limb(knee, ankle, 2.0, "jeans")
        s.ell((0.0, side * 2.6, 4.7), (2.3, 2.3, 1.0), "cuff")                    # rolled cuff
        s.limb((0.0, side * 2.6, 3.0), (0.0, side * 2.6, 6.2), 2.15, "boot")      # boot shaft
        s.ell((1.8, side * 2.6, 1.9), (3.6, 2.0, 1.9), "boot")
        s.ell((2.0, side * 2.6, 0.8), (3.8, 2.1, 0.8), "sole")
    s.ell((3.2, 2.5, 12.4), (0.6, 1.3, 1.5), "skin")                              # torn knee
    for y, z in ((3.0, 8.0), (-3.0, 14.5), (2.0, 17.5), (-2.6, 9.5)):
        s.ell((2.9, y, z), (0.35, 0.6, 0.9), "blood")
    s.ell((0.2, 0, 22.5), (3.1, 4.6, 3.0), "jeans")                               # hips
    # ---- torso: olive top, vest over it ----
    s.ell((0.4, 0, 24.2), (3.3, 4.7, 2.2), "shirt")                               # hem peeking under vest
    s.ell((-0.6, 0, 36.4), (2.4, 5.3, 1.7), "shirt")                              # shoulders
    vest = s.ell((0.7, 0, 30.4), (4.1, 5.3, 6.9), "vest")
    s.ell((3.3, 0, 36.6), (1.2, 1.5, 1.3), "tee")                                 # grey tee at the neck
    for side in (1, -1):
        stripe(s, vest, side * 2.7, 26.0, side * 2.5, 36.0, 1.3, "reflect")       # front verticals
        stripe(s, vest, side * 2.2, 25.5, side * 2.2, 35.0, 1.3, "reflect", back=True)
    stripe(s, vest, -4.6, 27.6, 4.6, 27.6, 1.2, "reflect")                        # front lower band
    stripe(s, vest, -4.6, 31.4, 4.6, 31.4, 1.2, "reflect", back=True)             # back band
    stripe(s, vest, -4.6, 26.6, 4.6, 26.6, 1.1, "reflect", back=True)
    for y, z in ((-3.0, 29.5), (2.8, 33.0), (-1.0, 26.0), (3.6, 27.0)):           # grime / blood on vest
        s.ell((s.front_x(vest, y, z) + 0.05, y, z), (0.35, 0.9, 0.8), "vest_d")
    for y, z in ((1.2, 29.0), (-2.2, 33.2)):
        s.ell((s.front_x(vest, y, z) + 0.1, y, z), (0.35, 0.5, 0.5), "blood")
    s.ell((-1.0, 0, 37.0), (2.6, 3.6, 1.8), "hood")                               # hood bunched at neck
    s.limb((0.8, 0, 37.0), (1.3, 0, 39.6), 1.7, "skin_d")                         # neck
    # ---- arms: short olive sleeves, bare sore-covered forearms, fingerless gloves ----
    for side in (1, -1):
        sh, el, wr = (0.3, side * 5.5, 35.3), (1.0, side * 6.0, 28.2), (2.2, side * 5.8, 21.8)
        s.ball(sh, 2.2, "shirt")
        s.limb(sh, el, 2.05, "shirt")
        s.limb(el, wr, 1.55, "skin")
        s.ell((1.2, side * 6.1, 26.0), (0.5, 0.6, 0.6), "sore")
        s.ell((1.6, side * 5.9, 23.8), (0.4, 0.5, 0.5), "sore")
        s.ell((2.9, side * 5.7, 19.8), (1.35, 1.3, 2.1), "glove")                 # fingerless glove
        s.ell((3.5, side * 5.7, 18.0), (0.7, 0.9, 0.8), "skin")                   # exposed fingertips
    # ---- head ----
    hz = 43.4
    skull = s.ell((1.7, 0, hz), (3.9, 3.5, 4.4), "skin")
    for side in (1, -1):
        s.ell((1.7, side * 3.1, hz - 0.5), (0.8, 0.55, 1.3), "skin_d")            # ears
        y = side * 1.35
        fx = s.front_x(skull, y, hz)
        s.ell((fx - 0.1, y, hz), (0.65, 0.95, 0.95), "ring")
        s.ell((fx + 0.2, y, hz), (0.5, 0.7, 0.62), "eye")
        s.ell((fx + 0.6, y, hz - 0.05), (0.2, 0.28, 0.3), "black")
        s.ell((s.front_x(skull, side * 2.1, hz - 2.2), side * 2.1, hz - 2.2), (0.5, 0.9, 1.1), "skin_d")
    s.ell((s.front_x(skull, 0, hz - 1.2) + 0.5, 0, hz - 1.2), (0.9, 0.55, 1.1), "skin")
    s.ell((s.front_x(skull, 0, hz - 3.0) + 0.05, 0, hz - 3.0), (0.35, 1.4, 0.3), "mouth")
    for y, z in ((2.0, hz - 1.5), (-1.8, hz + 1.8), (-2.2, hz - 2.4), (0.8, hz + 2.3)):
        s.ell((s.front_x(skull, y, z) + 0.05, y, z), (0.3, 0.55, 0.55), "sore")
    # ---- messy dark hair below the hat ----
    s.ell((-0.4, 0, hz + 0.6), (3.5, 3.4, 3.6), "hair")
    s.ell((-1.8, 0, hz - 3.4), (1.5, 2.6, 2.0), "hair")                           # nape
    for side in (1, -1):
        s.ell((0.4, side * 3.3, hz - 0.8), (1.3, 1.0, 1.8), "hair")               # side tufts
    # ---- hard hat ----
    s.ell((1.3, 0, hz + 4.3), (4.3, 3.9, 2.7), "hat")                             # dome
    s.ell((2.0, 0, hz + 3.3), (5.2, 4.3, 0.5), "hat")                             # brim
    s.ell((1.3, 0, hz + 6.9), (3.2, 0.6, 0.45), "hat")                            # ridge
    return s
