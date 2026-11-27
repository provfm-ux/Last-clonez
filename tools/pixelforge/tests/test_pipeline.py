import os, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from PIL import Image
from pixelforge import generate
from pixelforge.fetch import fetch
from pixelforge.pipeline import make, save
from pixelforge.styles import STYLES


def check(c, m):
    if not c:
        print("FAIL", m); sys.exit(1)


tmp = tempfile.mkdtemp()
white = Image.new("RGB", (300, 300), "white")
white.paste(generate.placeholder("x", 200).convert("RGB"), (50, 50), generate.placeholder("x", 200))
white.save(f"{tmp}/ref.png")

for name in STYLES:                                   # every preset runs
    art, w, cfg = make(Image.open(f"{tmp}/ref.png"), name)
    check(art.width >= 1, name)
art, warns, _ = make(Image.open(f"{tmp}/ref.png"), "sprite")
check(art.getpixel((0, 0))[3] == 0, "bg removed (corner transparent)")
check(not warns, "no warnings on plain bg")
paths = save(art, f"{tmp}/o", 4, dirs=True)
check(all(os.path.exists(p) for p in paths) and len(paths) == 3, "outputs")

noisy = Image.effect_noise((200, 200), 90).convert("RGB")           # busy bg
_, w, _ = make(noisy, "sprite")
check(w, "warns on non-uniform bg")

p = fetch("file://" + f"{tmp}/ref.png", refs=f"{tmp}/refs")         # fetch caches + sidecar
check(os.path.exists(p) and os.path.exists(p[:-4] + ".json"), "fetch")
open(f"{tmp}/bad.txt", "w").write("not image")
try:
    fetch("file://" + f"{tmp}/bad.txt", refs=f"{tmp}/refs"); check(False, "bad fetch accepted")
except Exception:
    pass
print("Tudo OK")
