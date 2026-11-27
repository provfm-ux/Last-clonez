"""One call: reference image -> pixel art (+ optional direction sheet)."""
import numpy as np
from PIL import Image

from .bg import crop_to_content, keep_largest, remove_background
from .core import pixelate, upscale
from .iso import sheet
from .styles import DEFAULT, STYLES


def border_uniform(img, limit=30):
    a = np.array(img.convert("RGB")).astype(np.int16)
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    return int(edge.std(0).max()) <= limit


def make(img, style=DEFAULT, **over):
    cfg = {**STYLES[style], **{k: v for k, v in over.items() if v is not None}}
    warns = []
    img = img.convert("RGBA")
    has_alpha = np.array(img.getchannel("A")).min() < 250
    if cfg["remove_bg"] and not has_alpha:
        if border_uniform(img):
            img = crop_to_content(keep_largest(remove_background(img)), 4)
        else:
            warns.append("background not uniform: not removed. Supply a cutout or a plain-background reference.")
    elif cfg["remove_bg"] and has_alpha:
        img = crop_to_content(img, 4)
    art = pixelate(img, cfg["width"], cfg["palette"], cfg["colors"], cfg["dither"], cfg["outline"])
    return art, warns, cfg


def save(art, out_prefix, scale=8, dirs=False):
    paths = [f"{out_prefix}.png", f"{out_prefix}_x{scale}.png"]
    art.save(paths[0])
    upscale(art, scale).save(paths[1])
    if dirs:
        paths.append(f"{out_prefix}_dirs.png")
        sheet(art, scale).save(paths[2])
    return paths
