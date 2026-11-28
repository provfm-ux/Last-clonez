"""Reaching poses for the infected: arms stretched towards the victim, one frame per direction.

Built after `sheets` from the finished game-tier atlas (zombified and palette-reduced), so the look stays the same.
Front, back and diagonal views move the arm strips of the idle pose (the same outer-flank strips walk.py swings):
facing the camera they are foreshortened to the chest, facing away they are tucked behind the body, on the diagonals
they swing up towards the facing side. Side views draw one near and one far arm in the character's own sleeve and skin
colours. Arms marked "none" in rigs.json stay missing; "upper" stumps reach only to the elbow.
The game shows this frame while an infected winds up, swings or holds the player; facing straight at the camera or away
(S, N) it shows the nearest diagonal towards the victim instead, where outstretched arms read clearly.

Usage: python3 -m pixelforge reach -o ../../game/assets/characters [--only id ...]
"""
import json
import os
from collections import Counter

import numpy as np
from PIL import Image

from .walk import FRONT, VIEW, _over, _rot, load_rig, rig_for

DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
FACING_X = {"N": 0, "S": 0, "E": 1, "NE": 1, "SE": 1, "W": -1, "NW": -1, "SW": -1}
SKIP = {"crawler"}


def _dominant(pixels, avoid_dark=True):
    px = [tuple(int(v) for v in p) for p in pixels if not avoid_dark or int(p[0]) + int(p[1]) + int(p[2]) > 120]
    return np.array(Counter(px).most_common(1)[0][0] if px else (120, 140, 100), np.uint8)


def arm_strip(cell, dname, side):
    """The arm strip on one screen side of a (front-diagonal) pose, cropped, hand at the bottom."""
    a = cell[..., 3] > 0
    ys, xs = np.where(a)
    top, bottom = ys.min(), ys.max()
    H = bottom - top + 1
    shoulder, hand = int(top + .27 * H), int(top + .56 * H)
    piece = np.zeros_like(cell)
    for y in range(shoulder, hand):
        row = np.where(a[y])[0]
        if len(row) < 6:
            continue
        x0, x1 = row.min(), row.max()
        w = max(1, min(int(.22 * (x1 - x0 + 1)), int(.10 * H)))
        c0, c1 = (x0, x0 + w) if side == "L" else (x1 - w + 1, x1 + 1)
        piece[y, c0:c1] = cell[y, c0:c1]
    py, px = np.where(piece[..., 3] > 0)
    return piece[py.min():py.max() + 1, px.min():px.max() + 1] if len(py) else None


def reach_cell(cell, dname, arms_cfg, side_arm=None):
    arr = cell.copy()
    a = arr[..., 3] > 0
    if not a.any() or dname in ("N", "S"):                # straight on, reaching does not read: the game uses a diagonal
        return arr
    ys, xs = np.where(a)
    top, bottom = ys.min(), ys.max()
    H = bottom - top + 1
    cx = int(np.median(xs[ys > top + .3 * H])) if (ys > top + .3 * H).any() else int(xs.mean())
    shoulder, hy = int(top + .27 * H), int(top + .53 * H)
    hand = int(hy + .03 * H)
    elbow = int(shoulder + .5 * (hy - shoulder))
    view, fx, front = VIEW[dname], FACING_X[dname], dname in FRONT
    kind = {"L": arms_cfg["right" if front else "left"], "R": arms_cfg["left" if front else "right"]}
    back, fore = np.zeros_like(arr), np.zeros_like(arr)
    if view != "side":
        frac = .24 if view == "fb" else .22
        pieces = {"L": np.zeros_like(arr), "R": np.zeros_like(arr)}
        for y in range(shoulder, hand):
            row = np.where(a[y])[0]
            if len(row) < 6:
                continue
            x0, x1 = row.min(), row.max()
            w = max(1, min(int(frac * (x1 - x0 + 1)), int(.10 * H)))   # an arm, not a slice of a wide belly
            for side, (c0, c1) in (("L", (x0, x0 + w)), ("R", (x1 - w + 1, x1 + 1))):
                if kind[side] == "none" or kind[side] == "upper" and y >= elbow:
                    continue
                pieces[side][y, c0:c1] = arr[y, c0:c1]
                arr[y, c0:c1] = 0
        for side, piece in pieces.items():
            m = piece[..., 3] > 0
            if not m.any():
                continue
            py, px = np.where(m)
            piv = (int(px.mean()), int(py.min()))
            if view == "fb":                              # facing the camera: a short sleeve, the hands up at the chest
                crop = piece[py.min():py.max() + 1, px.min():px.max() + 1]
                h, w = crop.shape[:2]
                cut = int(h * .68)
                sleeve = Image.fromarray(crop[:cut]).resize((w, max(1, int(cut * .3))), Image.NEAREST)
                handimg = crop[cut:]
                moved = np.zeros_like(arr)
                inward = (1 if side == "L" else -1) * max(1, int(.45 * w))
                y0, x0 = py.min(), px.min()
                moved[y0:y0 + sleeve.height, x0:x0 + w] = np.array(sleeve)
                hy0, hx0 = y0 + sleeve.height - 1, x0 + inward
                hand_layer = np.zeros_like(arr)
                hand_layer[hy0:hy0 + handimg.shape[0], hx0:hx0 + w] = handimg[:max(0, min(handimg.shape[0], arr.shape[0] - hy0))]
                moved = _over(moved, hand_layer)
                target = fore
            else:
                ang = 68 * fx if front else 58 * fx
                moved = _rot(piece, ang, piv, 0, -int(.02 * H), int(.5 * H))
                target = fore if front else back
            target[:] = _over(target, moved)
    else:
        if side_arm is not None:                          # the real arm from the front diagonal, turned to point ahead
            for far in (True, False):
                if kind["R" if far else "L"] == "none":
                    continue
                piece = side_arm if kind["R" if far else "L"] != "upper" else side_arm[:max(1, side_arm.shape[0] // 2)]
                turned = np.array(Image.fromarray(piece).rotate(90 * fx, expand=True, resample=Image.NEAREST))
                if far:
                    turned[..., :3] = (turned[..., :3] * .72).astype(np.uint8)
                layer = np.zeros_like(arr)
                y0 = shoulder + int(.05 * H) - (2 if far else 0) - turned.shape[0] // 2
                x0 = cx - (fx < 0) * turned.shape[1] - fx * int(.03 * H) + (-2 * fx if far else 0)
                ys_, xs_ = slice(max(0, y0), min(arr.shape[0], y0 + turned.shape[0])), slice(max(0, x0), min(arr.shape[1], x0 + turned.shape[1]))
                layer[ys_, xs_] = turned[ys_.start - y0:ys_.stop - y0, xs_.start - x0:xs_.stop - x0]
                if far:
                    back = _over(back, layer)
                else:
                    fore = _over(fore, layer)
            return _over(_over(back, arr), fore)
        band = arr[shoulder + 1:int(shoulder + .14 * H), max(0, cx - 3):cx + 4, :3][arr[shoulder + 1:int(shoulder + .14 * H), max(0, cx - 3):cx + 4, 3] > 0]
        sleeve = _dominant(band) if len(band) else np.array((90, 90, 70), np.uint8)
        head = arr[top:int(top + .16 * H), :, :3][arr[top:int(top + .16 * H), :, 3] > 0]
        skin = _dominant(head)
        L, t = int(.30 * H), max(2, int(.07 * H))
        for far in (True, False):
            if kind["R" if far else "L"] == "none":
                continue
            reach = L if kind["R" if far else "L"] != "upper" else int(L * .5)
            y = shoulder + int(.07 * H) - (2 if far else 0)
            x_start = cx - fx * int(.04 * H)
            dark = .72 if far else 1.0
            layer = np.zeros_like(arr)
            for i in range(reach):
                x = x_start + fx * i
                if not 0 <= x < arr.shape[1]:
                    break
                colour = sleeve if i < reach * .7 else skin
                thick = t if i < reach * .7 else t + 1
                for j in range(thick):
                    yy = y + j - (1 if i >= reach * .7 else 0)
                    if 0 <= yy < arr.shape[0]:
                        edge = j == 0 or j == thick - 1 or i == reach - 1
                        c = (colour * (.55 if edge else 1) * dark).astype(np.uint8)
                        layer[yy, x, :3] = c
                        layer[yy, x, 3] = 255
            if far:
                back = _over(back, layer)
            else:
                fore = _over(fore, layer)
    out = _over(back, arr)
    return _over(out, fore)


def _palette_snap(a, colours):
    flat = a[..., :3].reshape(-1, 3).astype(np.int32)
    d = ((flat[:, None, :] - colours[None, :, :]) ** 2).sum(-1)
    a[..., :3] = colours[d.argmin(1)].reshape(a.shape[:2] + (3,))
    return a


def build(out_dir, only=None):
    path = os.path.join(out_dir, "index.json")
    index = json.load(open(path))
    rig = load_rig()
    for ch in index["characters"]:
        if ch.get("category") not in ("infected", "boss") or ch["id"] in SKIP or (only and ch["id"] not in only):
            continue
        g = ch["tiers"]["game"]
        atlas = np.array(Image.open(os.path.join(out_dir, g["file"])).convert("RGBA"))
        cw, chh = g["cell"]
        pad = int(.32 * chh)
        cells = []
        # Arms: only the characters that really miss one keep it missing (the walk rig also turns arms off for big bellies).
        arms = rig_for(rig, ch["id"])["arms"] if ch["id"].startswith("missing_") else {"left": "full", "right": "full"}
        raw = [atlas[:, d * cw:(d + 1) * cw] for d in range(8)]
        side_arms = {"E": arm_strip(raw[DIRS.index("SE")], "SE", "R"), "W": arm_strip(raw[DIRS.index("SW")], "SW", "L")}
        for d, dname in enumerate(DIRS):
            cell = np.zeros((chh, cw + 2 * pad, 4), np.uint8)
            cell[:, pad:pad + cw] = raw[d]
            r = reach_cell(cell, dname, arms, side_arms.get(dname))
            r[..., 3] = np.where(r[..., 3] >= 128, 255, 0)
            r[..., :3][r[..., 3] == 0] = 0
            cells.append(r)
        full = np.concatenate(cells, axis=1)
        colours = np.unique(atlas[..., :3][atlas[..., 3] > 0].reshape(-1, 3), axis=0).astype(np.int32)
        full = _palette_snap(full, colours)
        gfile = ch["id"] + "_reach_game.png"
        Image.fromarray(full, "RGBA").save(os.path.join(out_dir, gfile))
        reach = {"game": {"file": gfile, "cell": [cw + 2 * pad, chh], "anchor": [g["anchor"][0] + pad, g["anchor"][1]]}}
        m = ch["tiers"].get("mini")
        if m:
            s = m["cell"][1] / chh
            mw, mh = max(1, round((cw + 2 * pad) * s)), m["cell"][1]
            mini_cells = []
            for c in cells:
                im = np.array(Image.fromarray(c).resize((mw, mh), Image.BOX))
                im[..., 3] = np.where(im[..., 3] >= 128, 255, 0)
                mini_cells.append(im)
            mfull = np.concatenate(mini_cells, axis=1)
            mat = np.array(Image.open(os.path.join(out_dir, m["file"])).convert("RGBA"))
            mcol = np.unique(mat[..., :3][mat[..., 3] > 0].reshape(-1, 3), axis=0).astype(np.int32)
            mfull = _palette_snap(mfull, mcol)
            mfull[..., :3][mfull[..., 3] == 0] = 0
            mfile = ch["id"] + "_reach_mini.png"
            Image.fromarray(mfull, "RGBA").save(os.path.join(out_dir, mfile))
            reach["mini"] = {"file": mfile, "cell": [mw, mh], "anchor": [round(reach["game"]["anchor"][0] * s), m["anchor"][1]]}
        ch["reach"] = reach
        print(ch["id"].ljust(22), reach["game"]["cell"], reach.get("mini", {}).get("cell"))
    json.dump(index, open(path, "w"), indent=1)
