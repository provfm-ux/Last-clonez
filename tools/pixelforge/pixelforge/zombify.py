"""Make sure every zombie sprite has green skin and blood on the mouth (settings: zombify.json).

Works on the full-resolution aligned cells, before the size tiers are made, so every tier inherits it.
Skin: face/neck are found by HSV rules in the head zone, hands as small skin-coloured blobs below it (big tan areas are clothes);
they are recoloured to the target green x source brightness. Blood: found the mouth as the dark gap in the lower face, then a
small blood patch with drips in the game's blood colours (#4a0c0f #6a1216 #8c1a1c).
"""
import json
import os

import numpy as np
from PIL import Image

from .recolor import _hsv

CFG_FILE = os.path.join(os.path.dirname(__file__), "..", "zombify.json")
FACE_VIEWS = {"S", "SE", "SW", "E", "W"}
BLOOD = [(74, 12, 15), (106, 18, 22), (140, 26, 28)]


def load_cfg(path=None):
    path = path or CFG_FILE
    return json.load(open(path)) if os.path.exists(path) else {"default": {}, "characters": {}, "ids": []}


def cfg_for(cfg, cid):
    d = {"skin": "green", "blood": True, "skin_color": "#7a9a68"}
    d.update({k: v for k, v in cfg.get("default", {}).items() if not k.startswith("_")})
    d.update({k: v for k, v in cfg.get("characters", {}).get(cid, {}).items() if not k.startswith("_")})
    return d


def _label(mask):
    """4-connected components of a boolean mask -> (labels, sizes)."""
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    sizes = [0]
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if labels[y0, x0]:
            continue
        n = len(sizes)
        stack = [(y0, x0)]
        labels[y0, x0] = n
        count = 0
        while stack:
            y, x = stack.pop()
            count += 1
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = n
                    stack.append((ny, nx))
        sizes.append(count)
    return labels, sizes


def skin_masks(arr, hue=(0, 56), head_frac=0.27, big=False, bright_factor=0.78):
    """-> (face mask, bright face mask, body-skin mask) for an RGBA array."""
    alpha = arr[..., 3] > 0
    ys = np.where(alpha.any(axis=1))[0]
    top, bottom = ys.min(), ys.max()
    H = max(1, bottom - top)
    yy = np.arange(arr.shape[0])[:, None] * np.ones((1, arr.shape[1]))
    h, s, v = _hsv(arr[..., :3])
    lo, hi = hue
    warm = ((h <= hi) & (h >= lo) | (h >= 330)) & (s >= 0.12) & (s <= 0.70) & (v >= 0.40) & (v <= 0.99)
    head = yy < top + head_frac * H
    face = alpha & head & warm
    bright = face & (v >= max(0.36, bright_factor * float(np.percentile(v[face], 75)))) if face.any() else face
    strict = alpha & ~head & (h >= 5) & (h <= 35) & (s >= 0.22) & (s <= 0.68) & (v >= 0.45)
    body = np.zeros_like(face)
    if strict.any():                                       # neck / hands: small blobs only, big tan areas are clothes
        labels, sizes = _label(strict)
        area = alpha.sum()
        small = [i for i, n in enumerate(sizes) if i and (big or n < 0.012 * area)]    # big=True: huge skin areas (muscles) too
        body = np.isin(labels, small) & strict
    return face, bright, body


def _largest(mask):
    """the biggest 4-connected component of a boolean mask"""
    if not mask.any():
        return mask
    labels, sizes = _label(mask)
    return labels == int(np.argmax(sizes[1:])) + 1


def _lum(rgb):
    return rgb @ np.array([0.299, 0.587, 0.114])


def _face_box(arr, bright, dname):
    """Bounding box (y0, y1, x0, x1) of the face: the biggest skin blob, cut below the chin by a width rule."""
    blob = _largest(bright)
    ys, xs = np.nonzero(blob)
    if len(ys) < 30:
        return None, None
    y0 = ys.min()
    widths = np.array([blob[y].sum() for y in range(y0, ys.max() + 1)])
    fw0 = int(widths[: max(3, int(0.5 * len(widths)))].max())
    factor = 1.25 if dname == "S" else 1.35 if dname in ("SE", "SW") else 1.6
    blob = blob.copy()
    blob[y0 + int(factor * fw0) + 1:] = False
    ys, xs = np.nonzero(blob)
    return (ys.min(), ys.max(), xs.min(), xs.max()), blob


def _mouth_s(arr, blob, box):
    """Front view: the dark gap in the lower face -> mouth height as a fraction of the face height (or None)."""
    y0, y1, x0, x1 = box
    fh = y1 - y0 + 1
    v = arr[..., :3].astype(float).max(axis=-1) / 255
    sv = float(np.median(v[blob]))
    best = None
    for y in range(int(y0 + 0.55 * fh), int(y0 + 0.95 * fh) + 1):
        row = np.nonzero(blob[y])[0]
        if len(row) < 6:
            continue
        xa, xb = row.min(), row.max()
        w = xb - xa + 1
        run = [x for x in range(xa + int(0.2 * w), xb - int(0.2 * w)) if arr[y, x, 3] > 0 and not blob[y, x] and v[y, x] < sv * 0.75]
        if len(run) >= 3 and (best is None or len(run) > best[0]):
            best = (len(run), y)
    return None if best is None else (best[1] - y0) / fh


def _mouth_at(arr, blob, box, k, dname):
    """Mouth centre for a face view at height fraction k of the face: (x, y, width, face h, face w)."""
    y0, y1, x0, x1 = box
    fh, fw = y1 - y0 + 1, x1 - x0 + 1
    y = int(y0 + k * fh)
    row = np.nonzero(blob[max(y0, y - 2): y + 3].any(axis=0))[0]
    if len(row) == 0:
        return None
    xa, xb = row.min(), row.max()
    w = xb - xa + 1
    if dname in ("E",):
        cx = xb - 0.16 * w
    elif dname in ("W",):
        cx = xa + 0.16 * w
    else:
        cx = (xa + xb) / 2
    return float(cx), float(y), 0.26 * w, fh, fw


def _mouth_fig(arr, dname, yfrac):
    """Mouth by figure geometry (for faces the skin rules cannot find): row = top + yfrac * height, centre from the opaque extent."""
    alpha = arr[..., 3] > 0
    rows = np.where(alpha.any(axis=1))[0]
    top, H = rows.min(), rows.max() - rows.min() + 1
    y = int(top + yfrac * H)
    xs = np.nonzero(alpha[y])[0]
    if len(xs) < 4:
        return None
    xa, xb = xs.min(), xs.max()
    w = xb - xa + 1
    cx = xb - 0.14 * w if dname == "E" else xa + 0.14 * w if dname == "W" else (xa + xb) / 2
    return float(cx), float(y), 0.2 * w, 0.2 * H, 0.14 * H


def _paint_blood(arr, mouth):
    cx, cy, mw, fh, fw = mouth
    u = max(1, int(round(fh / 24)))                         # one "art pixel" at this resolution
    w = int(min(max(mw + u * 2, 5 * u), 0.5 * fw))
    x0, x1 = int(cx - w / 2), int(cx + w / 2)
    y0, y1 = int(cy - u), int(cy + u)
    H, W = arr.shape[:2]

    def put(x, y, col):
        if 0 <= y < H and 0 <= x < W and arr[y, x, 3] > 0:
            arr[y, x, :3] = col
    for y in range(y0, y1 + 1):                            # smear across the mouth
        for x in range(x0, x1 + 1):
            inner = x0 + u <= x <= x1 - u
            put(x, y, BLOOD[1] if inner else BLOOD[0])
    for x in range(x0 + u, x1 - u + 1):
        put(x, y0, BLOOD[2])                               # wet highlight on top
    for dx, ln in ((int(w * 0.28), 3), (int(w * 0.62), 5), (int(w * 0.80), 2)):   # drips down the chin
        for k in range(ln):
            for ux in range(u):
                put(x0 + dx + ux, y1 + 1 + k * u, BLOOD[1] if k < ln - 1 else BLOOD[2])
                put(x0 + dx + ux, y1 + 2 + k * u, BLOOD[1])
    return arr


def _is_flesh(arrs, masks):
    """True when the face skin is flesh / pink (hue below 25 or wrapping past 330) and not grey or olive."""
    hs, ss = [], []
    for a, (face, _, _) in zip(arrs, masks):
        if face.any():
            h, s, _ = _hsv(a[..., :3])
            hs.append(h[face]); ss.append(s[face])
    if not hs:
        return False
    h, s = np.concatenate(hs), np.concatenate(ss)
    flesh = ((h < 25) | (h >= 330)) & (s >= 0.22)
    return float(flesh.mean()) > 0.5


def zombify(cells, dnames, cid, cfg=None):
    """cells: list of 8 RGBA PIL images (full res, same canvas). Returns new list."""
    full = cfg or load_cfg()
    c = cfg_for(full, cid)
    hue = tuple(c.get("hue", (0, 56)))
    head_frac = c.get("head_frac", 0.27)
    arrs = [np.array(im) for im in cells]
    masks = [skin_masks(a, hue, head_frac, bool(c.get("big_skin")), c.get("bright_factor", 0.78)) for a in arrs]
    mode = c["skin"]
    if mode == "auto":                                     # already green / grey / olive skin is left alone
        mode = "green" if _is_flesh(arrs, masks) else "keep"
    if mode == "green":
        target = np.array([int(c["skin_color"][i:i + 2], 16) for i in (1, 3, 5)], float)
        sel = [(f | b) for f, _, b in masks]
        px = np.concatenate([a[..., :3][m] for a, m in zip(arrs, sel) if m.any()])
        ref = max(1.0, float(_lum(px.astype(float)).mean())) if len(px) else 128.0
        for a, m in zip(arrs, sel):
            if not m.any():
                continue
            ratio = np.clip(_lum(a[..., :3][m].astype(float)) / ref, 0.35, 1.7)
            a[..., :3][m] = np.clip(target[None, :] * ratio[:, None], 0, 255).astype(np.uint8)
    if c["blood"]:
        boxes = {dn: _face_box(a, bright, dn) for a, (_, bright, _), dn in zip(arrs, masks, dnames) if dn in FACE_VIEWS}
        k = c.get("mouth_k", 0.80)                                          # mouth height as a fraction of the face height
        for a, dn in zip(arrs, dnames):
            if "mouth_y" in c and dn in FACE_VIEWS:
                m = _mouth_fig(a, dn, c["mouth_y"])
                if m:
                    _paint_blood(a, m)
            elif dn in boxes and boxes[dn][0] is not None:
                kk = c.get("mouth_k_view", {}).get(dn, k)
                m = _mouth_at(a, boxes[dn][1], boxes[dn][0], kk, dn)
                if m:
                    _paint_blood(a, m)
    return [Image.fromarray(a) for a in arrs]
