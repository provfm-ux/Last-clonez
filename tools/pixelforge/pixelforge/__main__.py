import argparse
import json
import os
import sys

from PIL import Image

from . import generate
from .fetch import fetch
from .pipeline import make, save
from .styles import DEFAULT, STYLES


def load_source(src, prompt):
    if src and src.startswith(("http://", "https://")):
        return Image.open(fetch(src))
    if src:
        return Image.open(src)
    if prompt:
        return generate.make(prompt)
    sys.exit("give an image path/URL or --prompt")


def main(argv=None):
    p = argparse.ArgumentParser(prog="pixelforge")
    sub = p.add_subparsers(dest="cmd", required=True)

    f = sub.add_parser("fetch", help="download reference image(s) into refs/")
    f.add_argument("urls", nargs="+")

    sub.add_parser("styles", help="list style presets")

    m = sub.add_parser("make", help="reference (path|URL) or prompt -> pixel art")
    m.add_argument("source", nargs="?", help="image path or http(s) URL")
    m.add_argument("-p", "--prompt", help="fallback base image when no source")
    m.add_argument("-o", "--out", default="out/art", help="output prefix, e.g. out/knight")
    m.add_argument("-s", "--style", default=DEFAULT, choices=list(STYLES))
    m.add_argument("-w", "--width", type=int)
    m.add_argument("--palette")
    m.add_argument("-c", "--colors", type=int)
    m.add_argument("--dither", choices=["none", "bayer", "floyd"])
    m.add_argument("--no-outline", action="store_true", default=None)
    m.add_argument("--keep-bg", action="store_true", help="do not remove background")
    m.add_argument("--dirs", action="store_true", help="also write direction sheet (S,SE,E,SW,W)")
    m.add_argument("--scale", type=int, default=8)
    a = p.parse_args(argv)

    if a.cmd == "styles":
        for k, v in STYLES.items():
            print(k, json.dumps(v))
        return
    if a.cmd == "fetch":
        for u in a.urls:
            print(fetch(u))
        return
    img = load_source(a.source, a.prompt)
    art, warns, cfg = make(
        img, a.style, width=a.width, palette=a.palette, colors=a.colors, dither=a.dither,
        outline=False if a.no_outline else None, remove_bg=False if a.keep_bg else None)
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    for path in save(art, a.out, a.scale, a.dirs):
        print(path)
    print(f"size={art.size} style={a.style}")
    for w in warns:
        print("WARN:", w)


if __name__ == "__main__":
    main()
