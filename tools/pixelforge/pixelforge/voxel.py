"""Tiny 3D box-model renderer -> true 8-direction isometric pixel art. Pillow + numpy only.

Model = list of boxes (x0,y0,z0,x1,y1,z1,(r,g,b)). Front of the model is +x, up is +z.
Camera is 2:1 isometric. Direction names are screen directions (S = facing the viewer).
"""
import math

import numpy as np
from PIL import Image, ImageDraw

from .core import apply_palette, kmeans_palette, outline

# facing yaw (degrees, math angle in model xy plane) per screen direction
DIRS = {"S": 45, "SE": 0, "E": -45, "NE": -90, "N": -135, "NW": 180, "W": 135, "SW": 90}
LIGHT = np.array([-0.35, 0.55, 0.76])
LIGHT = LIGHT / np.linalg.norm(LIGHT)
FACES = {  # name: (normal, 4 corner offsets as fractions of the box)
    "+x": ((1, 0, 0), [(1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1)]),
    "-x": ((-1, 0, 0), [(0, 0, 0), (0, 1, 0), (0, 1, 1), (0, 0, 1)]),
    "+y": ((0, 1, 0), [(0, 1, 0), (1, 1, 0), (1, 1, 1), (0, 1, 1)]),
    "-y": ((0, -1, 0), [(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)]),
    "+z": ((0, 0, 1), [(0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]),
    "-z": ((0, 0, -1), [(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0)]),
}


def _rot(p, a):
    c, s = math.cos(a), math.sin(a)
    return (p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2])


def _project(p):                      # 2:1 isometric
    return ((p[0] - p[1]), (p[0] + p[1]) * 0.5 - p[2] * 1.0)


def _canvas(boxes, pp):
    r = max(max(abs(b[0]), abs(b[3]), abs(b[1]), abs(b[4])) for b in boxes) * 1.42
    zmax = max(b[5] for b in boxes)
    return (int((2 * r + 4) * pp), int((zmax + r * 1.1 + 6) * pp)), int((zmax + r * 0.75 + 2) * pp)


def render_dir(boxes, yaw_deg, ppu=8, canvas=None):
    """Render one direction at ppu px per unit, flat shaded, with a per-pixel z-buffer.
    The view axis is (1,1,1) in camera space, so depth = x+y+z and is affine in screen space."""
    a = math.radians(yaw_deg)
    canvas, oy = _canvas(boxes, ppu) if canvas is None else (canvas, canvas[1] - 70)
    W, H = canvas
    ox = W / 2
    color = np.zeros((H, W, 4), dtype=np.uint8)
    zbuf = np.full((H, W), -1e9, dtype=np.float64)
    for (x0, y0, z0, x1, y1, z1, col) in boxes:
        for name, (n, corners) in FACES.items():
            nw = _rot(n, a)
            if nw[0] + nw[1] + nw[2] <= 1e-6:                  # back-facing
                continue
            pts3 = [_rot((x0 + (x1 - x0) * fx, y0 + (y1 - y0) * fy, z0 + (z1 - z0) * fz), a)
                    for fx, fy, fz in corners]
            pts2 = [(ox + _project(p)[0] * ppu, oy + _project(p)[1] * ppu) for p in pts3]
            dep = [p[0] + p[1] + p[2] for p in pts3]
            m = np.array([[pts2[i][0], pts2[i][1], 1.0] for i in range(3)])
            if abs(np.linalg.det(m)) < 1e-6:
                continue
            ca, cb, cc = np.linalg.solve(m, np.array(dep[:3]))
            bx0 = max(0, int(math.floor(min(p[0] for p in pts2))))
            by0 = max(0, int(math.floor(min(p[1] for p in pts2))))
            bx1 = min(W, int(math.ceil(max(p[0] for p in pts2))) + 1)
            by1 = min(H, int(math.ceil(max(p[1] for p in pts2))) + 1)
            if bx1 <= bx0 or by1 <= by0:
                continue
            mask = Image.new("L", (bx1 - bx0, by1 - by0), 0)
            ImageDraw.Draw(mask).polygon([(px - bx0, py - by0) for px, py in pts2], fill=255, outline=255)
            mk = np.array(mask) > 0
            ys, xs = np.mgrid[by0:by1, bx0:bx1]
            d = ca * (xs + 0.5) + cb * (ys + 0.5) + cc
            sub = zbuf[by0:by1, bx0:bx1]
            win = mk & (d >= sub - 1e-6)
            shade = 0.42 + 0.7 * max(0.0, float(np.dot(nw, LIGHT)))
            rgb = [min(255, int(c * shade)) for c in col]
            sub[win] = d[win]
            color[by0:by1, bx0:bx1][win] = rgb + [255]
    return Image.fromarray(color)


def render_sheet(boxes, ppu=2, ss=4, colors=20, do_outline=True):
    """8 directions at `ppu` final px per unit (supersampled by ss). Shared palette. Returns {dir: RGBA}."""
    shots = {}
    for name, yaw in DIRS.items():
        big = render_dir(boxes, yaw, ppu * ss)
        shots[name] = big.resize((big.width // ss, big.height // ss), Image.BOX)
    # same crop for every direction so sprites line up
    box = None
    for im in shots.values():
        b = im.getchannel("A").point(lambda v: 255 if v > 100 else 0).getbbox()
        box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    box = (box[0] - 1, box[1] - 1, box[2] + 1, box[3] + 1)
    arrs = {k: np.array(v.crop(box)) for k, v in shots.items()}
    allpx = np.concatenate([a[..., :3][a[..., 3] > 128] for a in arrs.values()])
    pal = kmeans_palette(allpx, colors)
    out = {}
    for k, a in arrs.items():
        idx = apply_palette(a[..., :3], pal)
        res = np.zeros_like(a)
        res[..., :3] = np.array(pal, dtype=np.uint8)[idx]
        res[..., 3] = np.where(a[..., 3] > 128, 255, 0)
        im = Image.fromarray(res)
        out[k] = outline(im) if do_outline else im
    return out


def sheet_image(sprites, order=("S", "SE", "E", "NE", "N", "NW", "W", "SW"), bg=(58, 68, 102, 255), scale=4, pad=4):
    w, h = next(iter(sprites.values())).size
    sheet = Image.new("RGBA", ((w + pad) * len(order) + pad, h + pad * 2), bg)
    for i, k in enumerate(order):
        sheet.alpha_composite(sprites[k], (pad + i * (w + pad), pad))
    return sheet.resize((sheet.width * scale, sheet.height * scale), Image.NEAREST)
