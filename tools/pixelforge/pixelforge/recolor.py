"""Region masks for in-game recolouring of customisable characters (skin / hair / jacket).

Mask PNGs share the layout of the atlases they belong to (grayscale): 0 = fixed colour, 85 = skin, 170 = hair,
255 = jacket. The game recolours those pixels at load time (target colour x source brightness), so shading survives.
Regions are found from the atlas colours (HSV rules) plus where the pixel sits on the figure (head zone, torso zone).
"""
import colorsys

import numpy as np
from PIL import Image

IDS = ("protagonist", "survivor_male", "survivor_female")     # characters the player can be
REGION = {"skin": 85, "hair": 170, "jacket": 255}


def _hsv(rgb):
    r, g, b = (rgb[..., i].astype(np.float32) / 255 for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    d = mx - mn
    h = np.zeros_like(mx)
    nz = d > 1e-6
    rc = nz & (mx == r); gc = nz & (mx == g) & ~rc; bc = nz & ~rc & ~gc
    h[rc] = ((g - b)[rc] / d[rc]) % 6
    h[gc] = (b - r)[gc] / d[gc] + 2
    h[bc] = (r - g)[bc] / d[bc] + 4
    return h * 60, np.where(mx > 0, d / np.maximum(mx, 1e-6), 0), mx


def classify_cell(cell):
    """cell: RGBA uint8 (h, w, 4) -> uint8 mask of the same size."""
    alpha = cell[..., 3] > 0
    out = np.zeros(alpha.shape, dtype=np.uint8)
    if not alpha.any():
        return out
    ys = np.where(alpha.any(axis=1))[0]
    top, bottom = ys.min(), ys.max()
    H = max(1, bottom - top)
    yy = np.arange(alpha.shape[0])[:, None] * np.ones((1, alpha.shape[1]))
    h, s, v = _hsv(cell[..., :3])
    head = yy < top + 0.22 * H
    feet = yy > bottom - 0.09 * H
    skin = alpha & (h >= 8) & (h <= 32) & (s >= 0.30) & (s <= 0.68) & (v >= 0.50) & ~feet
    blue = (h >= 190) & (h <= 265) & (s > 0.2)
    hair = alpha & head & ~skin & (v < 0.46) & ~blue
    jacket = alpha & ~skin & ~hair & (h >= 38) & (h <= 62) & (s >= 0.24) & (s <= 0.47) & (v >= 0.26) & (v <= 0.50) \
        & (yy > top + 0.14 * H) & (yy < bottom - 0.40 * H)
    out[skin], out[hair], out[jacket] = REGION["skin"], REGION["hair"], REGION["jacket"]
    return out


def _mask_atlas(path, cell, rows):
    img = np.array(Image.open(path).convert("RGBA"))
    cw, ch = cell
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    for r in range(rows):
        for c in range(8):
            sl = (slice(r * ch, (r + 1) * ch), slice(c * cw, (c + 1) * cw))
            mask[sl] = classify_cell(img[sl])
    return img, mask


def add_masks(out_dir, entry):
    """Write mask PNGs next to the atlases of `entry` and add entry['recolor'] (mask files + reference colours)."""
    import os
    info = {}
    for tier in ("mini", "game"):
        t = entry["tiers"][tier]
        img, mask = _mask_atlas(os.path.join(out_dir, t["file"]), t["cell"], 1)
        refs = {}
        for name, val in REGION.items():
            px = img[..., :3][(mask == val) & (img[..., 3] > 0)]
            refs[name] = [int(x) for x in px.mean(axis=0)] if len(px) else [128, 128, 128]
        mfile = t["file"].replace(".png", "_mask.png")
        Image.fromarray(mask, "L").save(os.path.join(out_dir, mfile))
        info[tier] = {"mask": mfile, "refs": refs}
        w = entry.get("walk", {}).get(tier)
        if w:
            _, wmask = _mask_atlas(os.path.join(out_dir, w["file"]), w["cell"], w["frames"])
            wfile = w["file"].replace(".png", "_mask.png")
            Image.fromarray(wmask, "L").save(os.path.join(out_dir, wfile))
            info[tier]["walkMask"] = wfile
    entry["recolor"] = info
