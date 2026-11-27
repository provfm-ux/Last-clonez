"""Where the weapon hand is, per pose: the skin-coloured blob of the hand on the side the character faces.

Uses the same HSV skin rules as the recolour masks. Returns full-resolution canvas coordinates; the atlas builder scales
them to each size tier, and the game draws the held weapon there.
"""
import numpy as np

from .recolor import REGION, classify_cell
from .zombify import _label

# which screen side holds the weapon: the side the character faces (S / N: right), same rule the game uses for the weapon art
SIDE = {"N": 1, "NE": 1, "E": 1, "SE": 1, "S": 1, "SW": -1, "W": -1, "NW": -1}


def hand_point(arr, ax, dname):
    """arr: RGBA uint8 (h, w, 4) full-res cell or frame; ax: x of the feet anchor. -> (x, y) of the weapon hand."""
    alpha = arr[..., 3] > 0
    ys = np.where(alpha.any(axis=1))[0]
    top, bottom = ys.min(), ys.max()
    H = max(1, bottom - top)
    side = SIDE[dname]
    skin = classify_cell(arr) == REGION["skin"]
    yy = np.arange(arr.shape[0])[:, None] * np.ones((1, arr.shape[1]))
    xx = np.ones((arr.shape[0], 1)) * np.arange(arr.shape[1])[None, :]
    band = skin & (yy > top + 0.36 * H) & (yy < top + 0.66 * H)
    on_side = band & ((xx - ax) * side > 0.02 * H)
    for cand in (on_side, band):                           # profile views: the hand may sit on the anchor line
        if cand.any():
            labels, sizes = _label(cand)
            best = int(np.argmax(sizes[1:])) + 1
            py, px = np.nonzero(labels == best)
            return float(px.mean()), float(py.mean())
    return float(ax + side * 0.10 * H), float(top + 0.52 * H)   # fallback: hip height, a bit out to the side
