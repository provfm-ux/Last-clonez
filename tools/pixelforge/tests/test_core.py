import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from pixelforge import pixelate, generate, palettes


def check(cond, msg):
    if not cond:
        print("FAIL", msg); sys.exit(1)


img = generate.placeholder("zombie")
for dither in ("none", "bayer", "floyd"):
    out = pixelate(img, 32, "auto", 8, dither)
    check(out.width >= 32, f"width {dither}")
    cols = {tuple(p) for p in np.array(out).reshape(-1, 4) if p[3]}
    check(len(cols) <= 9, f"colors {dither} {len(cols)}")  # 8 + outline
pico = set(palettes.get("pico8")) | {(24, 20, 37)}
out = pixelate(img, 32, "pico8")
check(all(tuple(p[:3]) in pico for p in np.array(out).reshape(-1, 4) if p[3]), "pico8 palette")
check(generate.placeholder("a").tobytes() == generate.placeholder("a").tobytes(), "deterministic")
print("Tudo OK")
