"""Walk cycles from static 8-direction sprites by rigid-part puppetry (no new art needed).

Each pose is cut into parts at full resolution: legs (split left/right at the feet anchor, pivot at the hip),
forearms (outer flank of the torso below the elbow, pivot at the elbow) and the rest. Parts are rotated about
their joints with sub-pixel interpolation (premultiplied alpha), then everything is scaled down like the idle atlases.
Views: N/S = legs lift alternately; E/W = legs swing in-plane; diagonals = a bit of both. Crawler is left static.
"""
import json
import math
import os

import numpy as np
from PIL import Image

VIEW = {"N": "fb", "S": "fb", "E": "side", "W": "side", "NE": "diag", "NW": "diag", "SE": "diag", "SW": "diag"}
NO_WALK = {"crawler"}


def _rot(arr, angle, pivot, dx, dy, margin):
    """Rotate an RGBA uint8 array (premultiplied internally) about pivot (x, y) by angle degrees (counter-clockwise on
    screen = positive), then translate. Works on a cropped window around the part for speed."""
    a = arr[..., 3] > 0
    if not a.any():
        return arr
    ys, xs = np.where(a)
    x0, y0 = max(0, xs.min() - margin), max(0, ys.min() - margin)
    x1, y1 = min(arr.shape[1], xs.max() + margin + 1), min(arr.shape[0], ys.max() + margin + 1)
    win = arr[y0:y1, x0:x1].astype(np.float32)
    al = win[..., 3:4] / 255.0
    pm = np.concatenate([win[..., :3] * al, win[..., 3:4]], axis=-1)
    out = np.zeros_like(pm)
    for c in range(4):
        im = Image.fromarray(pm[..., c], mode="F")
        out[..., c] = np.array(im.rotate(angle, resample=Image.BILINEAR, center=(pivot[0] - x0, pivot[1] - y0),
                                         translate=(dx, dy)))
    alpha = np.clip(out[..., 3], 0, 255)
    rgb = np.where(alpha[..., None] > 0, out[..., :3] / np.maximum(alpha[..., None] / 255.0, 1e-3), 0)
    res = np.zeros_like(arr)
    # translation can push pixels outside the window: paste into full canvas with an offset
    h, w = alpha.shape
    res[y0:y0 + h, x0:x0 + w, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    res[y0:y0 + h, x0:x0 + w, 3] = alpha.astype(np.uint8)
    return res


def _over(dst, src):
    """alpha-composite src over dst (both RGBA uint8, same shape)"""
    a = src[..., 3:4].astype(np.float32) / 255.0
    b = dst[..., 3:4].astype(np.float32) / 255.0
    out_a = a + b * (1 - a)
    rgb = (src[..., :3] * a + dst[..., :3] * b * (1 - a)) / np.maximum(out_a, 1e-6)
    return np.dstack([np.clip(rgb, 0, 255), out_a * 255]).astype(np.uint8)


def _pad(arr, mx, mt):
    out = np.zeros((arr.shape[0] + mt, arr.shape[1] + 2 * mx, 4), dtype=np.uint8)
    out[mt:, mx:mx + arr.shape[1]] = arr
    return out


RIG_FILE = os.path.join(os.path.dirname(__file__), "..", "rigs.json")
FRONT = {"S", "SE", "SW"}                  # facing the camera: the character's right arm is on the screen's left


def load_rig(path=None):
    path = path or RIG_FILE
    return json.load(open(path)) if os.path.exists(path) else {"default": {}, "characters": {}}


def rig_for(rig, cid):
    d = {"leg_ratio": 0.47, "leg_swing": 1.0, "arm_swing": 1.0, "bob": 1.0, "arms": {"left": "full", "right": "full"}}
    d.update(rig.get("default", {}))
    own = rig.get("characters", {}).get(cid, {})
    d.update({k: v for k, v in own.items() if not k.startswith("_")})
    d["arms"] = {**{"left": "full", "right": "full"}, **rig.get("default", {}).get("arms", {}), **own.get("arms", {})}
    return d


def pose_frames(img, anchor, cid, dname, F=8, rig=None):
    """img: RGBA cell (full res); anchor (ax, bottom). Returns (list of F RGBA arrays on a padded canvas, (mx, mt))."""
    cfg = rig_for(rig or load_rig(), cid)
    arr = np.array(img)
    ch, cw = arr.shape[:2]
    ax, bottom = anchor
    ys, xs = np.where(arr[..., 3] > 0)
    top = ys.min()
    H = bottom - top
    mx, mt = int(0.14 * H), int(0.05 * H)
    base = _pad(arr, mx, mt)
    ax, bottom, top = ax + mx, bottom + mt, top + mt
    if cid in NO_WALK:
        return [base.copy() for _ in range(F)], (mx, mt)
    view = VIEW[dname]
    hy = int(top + H * (1 - cfg["leg_ratio"]))
    alpha = base[..., 3] > 0
    yy, xx = np.mgrid[0:base.shape[0], 0:base.shape[1]]
    # screen side of each anatomical arm: facing the camera, anatomical right = screen left; facing away, the reverse
    kind = {"L": cfg["arms"]["right" if dname in FRONT else "left"], "R": cfg["arms"]["left" if dname in FRONT else "right"]}
    shoulder = int(top + 0.27 * H)
    elbow = int(shoulder + 0.50 * (hy - shoulder))
    hand = int(hy + 0.03 * H)
    arms = {k: np.zeros_like(alpha) for k in ("UL", "FL", "UR", "FR")}
    if view != "side":
        frac = 0.24 if view == "fb" else 0.22
        for y in range(shoulder, hand):
            row = np.where(alpha[y])[0]
            if len(row) < 8:
                continue
            x0, x1 = row.min(), row.max()
            w = max(2, int(frac * (x1 - x0 + 1)))
            seg = "U" if y < elbow else "F"
            for side, (c0, c1) in (("L", (x0, x0 + w)), ("R", (x1 - w + 1, x1 + 1))):
                if kind[side] == "none":
                    continue
                if kind[side] == "upper":
                    seg2 = "U"                                      # a stump: the whole arm is one swinging piece
                else:
                    seg2 = seg
                arms[seg2 + side][y, c0:c1] = True
        for k in arms:
            arms[k] &= alpha
    armall = arms["UL"] | arms["FL"] | arms["UR"] | arms["FR"]
    legs = alpha & (yy >= hy) & ~armall
    left, right = legs & (xx < ax), legs & (xx >= ax)
    body = alpha & ~legs & ~armall

    def part(mask):
        p = base.copy(); p[~mask] = 0; return p
    P = {k: part(m) for k, m in (("body", body), ("L", left), ("R", right), ("LEGS", legs), *arms.items())}
    back = P["LEGS"].copy()
    back[..., :3] = (back[..., :3] * 0.8).astype(np.uint8)       # profile: the far leg is a darker copy of the whole leg
    pad = int(0.3 * H)
    ls, am = cfg["leg_swing"], cfg["arm_swing"]
    frames = []
    for i in range(F):
        s = math.sin(2 * math.pi * i / F)
        bob = -0.036 * H * cfg["bob"] * (1 - abs(s))
        if view == "side":
            la, ra, lift = 20 * s * ls, -20 * s * ls, 0
        elif view == "diag":
            la, ra, lift = 15 * s * ls, -15 * s * ls, 0.03 * H * ls
        else:
            la, ra, lift = 0, 0, 0.085 * H * ls
        dyl, dyr = (-lift * max(0, s), -lift * max(0, -s)) if view != "side" else (0, 0)
        out = np.zeros_like(base)
        if view == "side":                                        # two full legs, scissoring about the hip
            far, near = (ra, la) if s >= 0 else (la, ra)
            out = _over(out, _rot(back, far, (ax, hy), 0, bob, pad))
            out = _over(out, _rot(P["LEGS"], near, (ax, hy), 0, bob, pad))
        else:
            order = ("R", "L") if s >= 0 else ("L", "R")          # the leg swinging back is drawn first
            for k in order:
                ang, dyk = (la, dyl) if k == "L" else (ra, dyr)
                out = _over(out, _rot(P[k], ang, (ax, hy), 0, dyk + bob, pad))
        out = _over(out, _rot(P["body"], 0, (ax, hy), 0, bob, pad))
        if view != "side":
            for side, sgn in (("L", 1), ("R", -1)):                # arms swing against the leg on the same side
                phase = -s * sgn if view == "diag" else s * sgn
                up, fo = P["U" + side], P["F" + side]
                if view == "fb":                                   # seen head-on, fore-aft swing = up/down + a little sideways
                    dy_arm = -0.045 * H * am * phase
                    ang_u, ang_f = 4 * am * phase * sgn, 4 * am * phase * sgn + 9 * am * max(0, phase) * sgn
                else:                                              # diagonal: the arm really swings
                    dy_arm = 0
                    ang_u = 10 * am * phase * sgn
                    ang_f = ang_u + 14 * am * max(0, phase) * sgn
                for piece, is_fore in ((up, False), (fo, True)):
                    m = piece[..., 3] > 0
                    if not m.any():
                        continue
                    yy_, xx_ = np.where(m)
                    if not is_fore:
                        piv = (int(xx_.mean()), int(yy_.min()))    # shoulder: top of the upper arm
                        out = _over(out, _rot(piece, -ang_u, piv, 0, bob + dy_arm, pad))
                    else:
                        # the forearm hangs from the (already swung) elbow: rotate about the elbow, carry the upper arm's motion
                        piv = (int(xx_.mean()), int(yy_.min()))
                        carried = _rot(piece, -ang_u, (int(xx_.mean()), shoulder), 0, bob + dy_arm, pad)
                        out = _over(out, _rot(carried, -(ang_f - ang_u), (piv[0], piv[1] + int(bob + dy_arm)), 0, 0, pad))
        frames.append(out)
    return frames, (mx, mt)
