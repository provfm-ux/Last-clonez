"""8-direction character sheets (4x2 grid, magenta bg) -> transparent, foot-aligned atlases.

Cell order is screen-space N, NE, E, SE / S, SW, W, NW (row-major). Per character we write one
atlas per size tier (8 cells in a row, same order, one shared cell size and anchor) plus JSON metadata.
Originals are never modified.
"""
import json
import os

import numpy as np
from PIL import Image

from .core import apply_palette, kmeans_palette

DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
KEY = np.array([251, 4, 250])
# size tiers: name -> (height in px of a standard 1.0 figure, palette colours or 0 = keep all)
TIERS = {"hd": (160, 0), "game": (80, 48), "mini": (40, 32)}
SCALE_CLASS = {"brute": 1.28, "runner": 0.94}          # same factors the game already uses in view.js
ANCHOR_CENTROID = {"crawler"}                          # lies on the ground: anchor on the body, not feet


def cell_box(i, W, H):
    r, c = divmod(i, 4)
    return (round(c * W / 4), round(r * H / 2), round((c + 1) * W / 4), round((r + 1) * H / 2))


def key_out(cell, tol=60):
    """RGBA with the magenta background removed, magenta fringe trimmed, specks dropped."""
    rgb = np.array(cell.convert("RGB")).astype(np.int16)
    solid = np.abs(rgb - KEY).max(-1) > tol
    tint = (rgb[..., 0] + rgb[..., 2]) / 2 - rgb[..., 1]
    fringe = (rgb[..., 0] > 130) & (rgb[..., 2] > 130) & (tint > 90)
    near_bg = np.zeros_like(solid)
    bg = ~solid
    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        near_bg |= np.roll(np.roll(bg, dy, 0), dx, 1)
    solid &= ~(fringe & near_bg)                       # magenta halo on the figure edge
    n = sum(np.roll(np.roll(solid, dy, 0), dx, 1).astype(int)
            for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy, dx) != (0, 0))
    solid &= n >= 2                                    # isolated specks
    out = np.dstack([rgb.clip(0, 255).astype(np.uint8), np.where(solid, 255, 0).astype(np.uint8)])
    return Image.fromarray(out)


def _anchor(img, centroid):
    a = np.array(img.getchannel("A")) > 0
    ys, xs = np.where(a)
    bottom = ys.max()
    if centroid:
        return int(round(xs.mean())), int(bottom)
    band = ys >= bottom - max(2, int((bottom - ys.min()) * 0.10))
    return int(np.median(xs[band])), int(bottom)


def prepare(sheet_path, cid):
    """-> (list of 8 cropped RGBA, anchors, common cell size, anchor-in-cell). Full resolution."""
    sheet = Image.open(sheet_path)
    W, H = sheet.size
    cells = [key_out(sheet.crop(cell_box(i, W, H))) for i in range(8)]
    info = []
    for im in cells:
        ax, by = _anchor(im, cid in ANCHOR_CENTROID)
        x0, y0, x1, y1 = im.getchannel("A").getbbox()
        info.append((ax - x0, x1 - ax, by - y0 + 1, (x0, y0, x1, y1), ax))
    L = max(i[0] for i in info)
    R = max(i[1] for i in info)
    T = max(i[2] for i in info)
    pad = 4
    cw, ch = L + R + 2 * pad, T + 2 * pad
    out = []
    for im, (l, r, t, box, ax) in zip(cells, info):
        canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        canvas.alpha_composite(im.crop(box), (pad + L - l, pad + T - t))
        out.append(canvas)
    return out, (cw, ch), (pad + L, pad + T)


def to_tier(cells, anchor, cell_size, std_height, ncolors, factor, src_std):
    """Scale all 8 cells by one factor (area average), threshold alpha, optional shared palette."""
    s = std_height * factor / src_std
    cw, ch = max(1, round(cell_size[0] * s)), max(1, round(cell_size[1] * s))
    small = []
    for im in cells:
        sm = im.resize((cw, ch), Image.BOX)
        a = np.array(sm)
        a[..., 3] = np.where(a[..., 3] >= 128, 255, 0)
        small.append(a)
    if ncolors:
        px = np.concatenate([a[..., :3][a[..., 3] > 0] for a in small])
        pal = np.array(kmeans_palette(px, ncolors), dtype=np.uint8)
        for a in small:
            idx = apply_palette(a[..., :3], [tuple(c) for c in pal])
            a[..., :3] = pal[idx]
    atlas = Image.new("RGBA", (cw * 8, ch), (0, 0, 0, 0))
    for i, a in enumerate(small):
        a[..., :3][a[..., 3] == 0] = 0
        atlas.paste(Image.fromarray(a), (i * cw, 0))
    return atlas, (cw, ch), (round(anchor[0] * s), round(anchor[1] * s)), s


def build(package_dir, out_dir, only=None):
    man = json.load(open(os.path.join(package_dir, "manifesto_8_direcoes.json")))
    os.makedirs(out_dir, exist_ok=True)
    result = []
    for ch in man["characters"]:
        if only and ch["id"] not in only:
            continue
        cells, size, anchor = prepare(os.path.join(package_dir, ch["image"]), ch["id"])
        src_std = 385 if ch["id"] in ANCHOR_CENTROID else max(
            c.getchannel("A").getbbox()[3] - c.getchannel("A").getbbox()[1] for c in cells)   # crawler: same px/px as the others
        entry = {"id": ch["id"], "name": ch["name"], "category": ch.get("category"), "order": DIRS,
                 "source": ch["image"], "tiers": {}}
        factor = SCALE_CLASS.get(ch["id"], 1.0)
        for tname, (height, ncol) in TIERS.items():
            atlas, cell, anc, s = to_tier(cells, anchor, size, height, ncol, factor, src_std)
            fn = f"{ch['id']}_{tname}.png"
            atlas.save(os.path.join(out_dir, fn))
            entry["tiers"][tname] = {"file": fn, "cell": list(cell), "anchor": list(anc), "scale": round(s, 5)}
        json.dump(entry, open(os.path.join(out_dir, f"{ch['id']}.json"), "w"), indent=1)
        result.append(entry)
        print(ch["id"].ljust(14), {k: v["cell"] for k, v in entry["tiers"].items()})
    json.dump({"order": DIRS, "default_tier": "mini", "tiers": {k: {"height": v[0]} for k, v in TIERS.items()},
               "layout": "one row of 8 cells (order above), every cell the same size, anchor = feet (crawler: body)",
               "characters": result}, open(os.path.join(out_dir, "index.json"), "w"), indent=1)
    return result
