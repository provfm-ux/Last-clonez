"""Pseudo-isometric direction sheet from ONE front-view sprite.

Honest limits: a single view cannot show the back or true sides. We derive
S, SE, E (+ mirrored SW, W) by narrowing the front view. N, NE, NW need a back-view
reference and are NOT faked here.
"""
import numpy as np
from PIL import Image, ImageDraw

# direction -> (width squash, mirror)
DIRS = {"S": (1.00, False), "SE": (0.82, False), "E": (0.58, False),
        "SW": (0.82, True), "W": (0.58, True)}


def squash(sprite, factor):
    w, h = sprite.size
    nw = max(1, round(w * factor))
    out = sprite.resize((nw, h), Image.NEAREST)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.paste(out, ((w - nw) // 2, 0))
    return canvas


def shadow(canvas_size, feet_y, width):
    """2:1 isometric ground ellipse."""
    img = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = canvas_size[0] // 2
    rx, ry = width // 2, width // 4
    d.ellipse([cx - rx, feet_y - ry, cx + rx, feet_y + ry], fill=(24, 20, 37, 110))
    return img


def sheet(sprite, scale=1):
    w, h = sprite.size
    cell_w, cell_h = w + 4, h + 8
    out = Image.new("RGBA", (cell_w * len(DIRS), cell_h), (0, 0, 0, 0))
    for i, (name, (f, mirror)) in enumerate(DIRS.items()):
        cell = Image.new("RGBA", (cell_w, cell_h), (0, 0, 0, 0))
        cell.alpha_composite(shadow((cell_w, cell_h), h + 2, int(w * 0.9)))
        s = squash(sprite, f)
        if mirror:
            s = s.transpose(Image.FLIP_LEFT_RIGHT)
        cell.alpha_composite(s, (2, 2))
        out.alpha_composite(cell, (i * cell_w, 0))
    return out.resize((out.width * scale, out.height * scale), Image.NEAREST) if scale > 1 else out
