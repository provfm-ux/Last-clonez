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
    d = sub.add_parser("model", help="render a built-in 3D box model in 8 true directions")
    d.add_argument("name", help="model name (see pixelforge/models)")
    d.add_argument("-o", "--out", default="out/model")
    d.add_argument("--ppu", type=float, help="pixels per model unit (size); default 3.5 organic, 2 blocky")
    d.add_argument("--colors", type=int, default=20, help="blocky models only")
    c = sub.add_parser("sheets", help="8-direction magenta sheets -> transparent foot-aligned atlases")
    c.add_argument("package", help="folder with manifesto_8_direcoes.json and the PNG sheets")
    c.add_argument("-o", "--out", default="out/chars")
    c.add_argument("--only", nargs="*", help="character ids")
    c.add_argument("--rig", help="rig settings JSON (default: tools/pixelforge/rigs.json)")
    r = sub.add_parser("poses", help="rest poses and camping props from the Pixel Lab sheet")
    r.add_argument("sheet", nargs="?", default=os.path.join(os.path.dirname(__file__), "..", "sources", "rest_poses_sheet.png"))
    r.add_argument("-o", "--out", default="out/chars")
    rc = sub.add_parser("reach", help="reaching poses (arms forward) for the infected, from the game-tier atlases")
    rc.add_argument("-o", "--out", default="out/chars")
    rc.add_argument("--only", nargs="*")
    a = p.parse_args(argv)

    if a.cmd == "styles":
        for k, v in STYLES.items():
            print(k, json.dumps(v))
        return
    if a.cmd == "fetch":
        for u in a.urls:
            print(fetch(u))
        return
    if a.cmd == "reach":
        from .reach import build as build_reach
        build_reach(a.out, a.only)
        return
    if a.cmd == "poses":
        from .poses import build, write_index
        write_index(a.out, build(a.sheet, a.out))
        return
    if a.cmd == "sheets":
        from .sheets import build
        build(a.package, a.out, a.only, a.rig)
        return
    if a.cmd == "model":
        from .models import MODELS, ORGANIC
        from .voxel import sheet_image
        if a.name in ORGANIC:
            from .organic import render_sheet
            sp = render_sheet(ORGANIC[a.name](), a.ppu or 3.5)
        elif a.name in MODELS:
            from .voxel import render_sheet
            sp = render_sheet(MODELS[a.name], a.ppu or 2, colors=a.colors)
        else:
            sys.exit(f"unknown model; have: {', '.join([*ORGANIC, *MODELS])}")
        os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
        for k, im in sp.items():
            im.save(f"{a.out}_{k}.png")
        sheet_image(sp, scale=2 if a.ppu is None or a.ppu >= 3 else 4).save(f"{a.out}_sheet.png")
        print(f"{a.out}_sheet.png  8 dirs, sprite size {next(iter(sp.values())).size}")
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
