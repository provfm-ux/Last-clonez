"""Rest poses (sitting, lying, in a sleeping bag) and camping props, cut from one Pixel Lab sheet.

Source: sources/rest_poses_sheet.png, a 400x400 `create-image-pixflux` result (3x3 grid; see sources/rest_poses.json for
the prompt). Rows: the man (protagonist), the woman (survivor_female), props. Columns: sit, lie, bag / flat bag, rolled
bag, tent. This module removes the flat background, the drawn shadow and the drawn chair (the game draws its own seat),
writes one atlas per figure with a recolour mask (same rules as recolor.py, lying figures classified upright) and a
props atlas, and returns the metadata stored under `poses` in index.json.

Usage: python3 -m pixelforge poses [sheet] -o ../../game/assets/characters
"""
import json
import os

import numpy as np
from PIL import Image

from .recolor import REGION, _hsv, classify_cell

GRID, CELL = 3, 133
BG = (201, 170, 155)
SHADOW = (132, 128, 120)
NAMES = [["sit", "lie", "bag"], ["sit", "lie", "bag"], ["bag_flat", "bag_roll", "tent"]]
FIGURES = {0: "m", 1: "f"}
# Pose pixels -> hd character pixels: the standing reference in the sheet was 110 px tall, an hd figure is 157 px.
HD_PER_PX = 157 / 110
ANCHORS = {"sit": (.5, .74), "lie": (.5, .55), "bag": (.5, .6), "bag_flat": (.5, .6), "bag_roll": (.5, .7), "tent": (.5, .97)}


def _dist(a, b):
    return np.sqrt(((a[..., :3].astype(np.float32) - np.array(b, np.float32)) ** 2).sum(-1))


def _cut(sheet, r, c):
    cell = sheet[r * CELL:(r + 1) * CELL, c * CELL:(c + 1) * CELL].copy()
    clear = _dist(cell, BG) < 30
    if NAMES[r][c] == "lie":
        clear |= _dist(cell, SHADOW) < 16
    cell[clear] = 0
    if NAMES[r][c] == "sit":                      # the chair: the commonest colours in the right-hand post
        a = cell[..., 3] > 0
        cols = np.where(a.any(0))[0]
        right = cell[:, cols.max() - 7:cols.max() + 1]
        px = right[right[..., 3] > 0][:, :3]
        values, counts = np.unique(px, axis=0, return_counts=True)
        for colour in values[np.argsort(-counts)[:3]]:
            cell[(_dist(cell, colour) < 14) & (cell[..., 3] > 0)] = 0
    ys, xs = np.where(cell[..., 3] > 0)
    return cell[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def _mouth_fix(img):
    """The woman's sitting face came back with a dark blot at the mouth: paint it with the cheek colour."""
    h, w = img.shape[:2]
    y0, y1, x0, x1 = int(h * .20), int(h * .32), int(w * .35), int(w * .65)
    face = img[y0:y1, x0:x1]
    lum = face[..., :3].astype(np.float32).mean(-1)
    skin = face[(lum > 120) & (face[..., 3] > 0)][:, :3]
    if len(skin):
        face[(lum < 70) & (face[..., 3] > 0), :3] = skin.mean(0).astype(np.uint8)


def _mask(img, upright):
    if upright:
        mask = classify_cell(img)
    else:
        rot = np.rot90(img, -1)                   # head (left) to the top, classify, turn back
        mask = np.rot90(classify_cell(np.ascontiguousarray(rot)), 1).copy()
    h, s, _ = _hsv(img[..., :3])
    mask[(h >= 70) & (h <= 150) & (s > .2)] = 0   # the green sleeping bag is never skin, hair or jacket
    return mask


def _pack(sprites):
    w = sum(s.shape[1] for s in sprites.values()) + 2 * (len(sprites) - 1)
    h = max(s.shape[0] for s in sprites.values())
    atlas = np.zeros((h, w, 4), np.uint8)
    meta, x = {}, 0
    for name, s in sprites.items():
        y = h - s.shape[0]
        atlas[y:y + s.shape[0], x:x + s.shape[1]] = s
        ax, ay = ANCHORS[name]
        meta[name] = {"rect": [x, y, s.shape[1], s.shape[0]], "anchor": [round(s.shape[1] * ax), round(s.shape[0] * ay)]}
        x += s.shape[1] + 2
    return atlas, meta


def build(sheet_path, out_dir):
    sheet = np.array(Image.open(sheet_path).convert("RGBA"))
    poses = {"scale": HD_PER_PX}
    for row, fig in FIGURES.items():
        sprites = {NAMES[row][c]: _cut(sheet, row, c) for c in range(GRID)}
        if fig == "f":
            _mouth_fix(sprites["sit"])
        atlas, meta = _pack(sprites)
        mask = np.zeros(atlas.shape[:2], np.uint8)
        for name, m in meta.items():
            x, y, w, h = m["rect"]
            mask[y:y + h, x:x + w] = _mask(atlas[y:y + h, x:x + w], name == "sit")
        refs = {}
        for region, value in REGION.items():
            px = atlas[..., :3][(mask == value) & (atlas[..., 3] > 0)]
            refs[region] = [int(v) for v in px.mean(0)] if len(px) else [128, 128, 128]
        file, mfile = "rest_" + fig + ".png", "rest_" + fig + "_mask.png"
        Image.fromarray(atlas, "RGBA").save(os.path.join(out_dir, file))
        Image.fromarray(mask, "L").save(os.path.join(out_dir, mfile))
        poses[fig] = {"file": file, "mask": mfile, "refs": refs, "sprites": meta}
    props = {NAMES[2][c]: _cut(sheet, 2, c) for c in range(GRID)}
    atlas, meta = _pack(props)
    Image.fromarray(atlas, "RGBA").save(os.path.join(out_dir, "rest_props.png"))
    poses["props"] = {"file": "rest_props.png", "sprites": meta}
    return poses


def write_index(out_dir, poses):
    path = os.path.join(out_dir, "index.json")
    index = json.load(open(path))
    index["poses"] = poses
    json.dump(index, open(path, "w"), indent=1)
