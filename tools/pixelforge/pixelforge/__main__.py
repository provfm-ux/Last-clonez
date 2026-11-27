import argparse
import sys

from PIL import Image

from . import generate
from .core import pixelate, upscale


def main(argv=None):
    p = argparse.ArgumentParser(prog="pixelforge", description="Photo/drawing/prompt -> pixel art")
    p.add_argument("input", nargs="?", help="image file; omit to use --prompt")
    p.add_argument("-p", "--prompt", help="generate a base image when no input is given")
    p.add_argument("-o", "--out", default="out.png")
    p.add_argument("-w", "--width", type=int, default=48, help="pixel grid width")
    p.add_argument("--palette", default="auto", help="auto | pico8 | gameboy | endesga32")
    p.add_argument("-c", "--colors", type=int, default=16, help="colors when palette=auto")
    p.add_argument("--dither", choices=["none", "bayer", "floyd"], default="none")
    p.add_argument("--no-outline", action="store_true")
    p.add_argument("--scale", type=int, default=8, help="nearest-neighbour preview upscale")
    a = p.parse_args(argv)

    if a.input:
        img = Image.open(a.input)
    elif a.prompt:
        img = generate.make(a.prompt)
    else:
        p.error("give an input image or --prompt")
    art = pixelate(img, a.width, a.palette, a.colors, a.dither, not a.no_outline)
    art.save(a.out)
    big = a.out.rsplit(".", 1)[0] + f"_x{a.scale}.png"
    upscale(art, a.scale).save(big)
    print(f"{a.out} {art.size}  {big}")


if __name__ == "__main__":
    sys.exit(main())
