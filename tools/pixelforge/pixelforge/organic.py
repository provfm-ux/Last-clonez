"""Organic 3D -> high-resolution isometric pixel art. Pillow + numpy only.

Scene = ellipsoids (balls, limbs, blobs) with named materials. Rendered by analytic
ray/ellipsoid intersection into a z-buffer, then cel-shaded into a few exact palette tones per
material (hue-shifted shadows), with depth-edge inner outlines and a 1 px outer outline.
Front of a model is +x, left is +y, up is +z. Camera is 2:1 isometric.
"""
import math

import numpy as np
from PIL import Image

from .core import BAYER4, outline

DIRS = {"S": 45, "SE": 0, "E": -45, "NE": -90, "N": -135, "NW": 180, "W": 135, "SW": 90}
LIGHT = np.array([-0.35, 0.55, 0.76])
LIGHT = LIGHT / np.linalg.norm(LIGHT)
BANDS = (0.16, 0.42, 0.70)          # shade thresholds -> 4 tones
SHADOW_TINT = np.array([46, 34, 86], dtype=np.float32)     # cool purple
LIGHT_TINT = np.array([255, 236, 190], dtype=np.float32)   # warm


def ramp(base):
    """4 tones: deep shadow, shadow, base, light. Shadows drift cool, lights drift warm."""
    b = np.array(base, dtype=np.float32)
    tones = [b * 0.50 * 0.78 + SHADOW_TINT * 0.22,
             b * 0.74 * 0.90 + SHADOW_TINT * 0.10,
             b,
             b * 0.88 + LIGHT_TINT * 0.12 + 10]
    return np.clip(np.array(tones), 0, 255).astype(np.uint8)


def _frame(w):
    w = np.array(w, dtype=np.float64)
    w = w / np.linalg.norm(w)
    ref = np.array([0, 0, 1.0]) if abs(w[2]) < 0.9 else np.array([1.0, 0, 0])
    v = np.cross(w, ref)
    v /= np.linalg.norm(v)
    u = np.cross(v, w)
    return np.stack([u, v, w], axis=1)           # columns = local axes


class Scene:
    def __init__(self, mats):
        self.mats = list(mats)
        self.base = dict(mats)
        self.names = list(self.base)
        self.P = []

    def ell(self, c, r, mat, axis=None):
        """Ellipsoid. With axis, radii=(perp1, perp2, along-axis); else (rx, ry, rz)."""
        self.P.append(dict(c=np.array(c, float), r=np.array(r, float), mat=self.names.index(mat),
                           R=_frame(axis) if axis is not None else np.eye(3)))
        return len(self.P) - 1

    def ball(self, c, r, mat):
        return self.ell(c, (r, r, r), mat)

    def limb(self, a, b, r, mat, stretch=0.55):
        """Capsule-like ellipsoid from a to b with perpendicular radius r."""
        a, b = np.array(a, float), np.array(b, float)
        d = b - a
        L = np.linalg.norm(d)
        return self.ell((a + b) / 2, (r, r, L / 2 + stretch * r), mat, axis=d)

    def front_x(self, i, y, z):
        """x of the +x surface of an axis-aligned ellipsoid at (y, z), for placing details."""
        p = self.P[i]
        t = 1 - ((y - p["c"][1]) / p["r"][1]) ** 2 - ((z - p["c"][2]) / p["r"][2]) ** 2
        return p["c"][0] + p["r"][0] * math.sqrt(max(0.0, t))


def stripe(scene, i, y0, z0, y1, z1, width, mat, back=False, step=0.45):
    """Thin straight band on the front (or back) surface of axis-aligned ellipsoid i,
    from (y0,z0) to (y1,z1); built from small ellipsoids that follow the curvature."""
    p = scene.P[i]
    n = max(1, int(math.hypot(y1 - y0, z1 - z0) / step))
    for k in range(n + 1):
        t = k / n
        y, z = y0 + (y1 - y0) * t, z0 + (z1 - z0) * t
        fx = scene.front_x(i, y, z)
        x = p["c"][0] - (fx - p["c"][0]) if back else fx
        scene.ell((x, y, z), (0.3, width / 2 + 0.12, width / 2 + 0.12), mat)


def _rotz(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])


def _extent(scene):
    rxy = max(math.hypot(*p["c"][:2]) + p["r"].max() for p in scene.P)
    zmax = max(p["c"][2] + p["r"].max() for p in scene.P)
    zmin = min(p["c"][2] - p["r"].max() for p in scene.P)
    return rxy, zmax, zmin


def render_dir(scene, yaw_deg, ppu=4, canvas=None, edge=5.0, dither=0.05):
    rxy, zmax, zmin = _extent(scene)
    if canvas is None:
        top = zmax + 0.71 * rxy + 1
        bot = 0.71 * rxy + 1 - min(zmin, 0)
        W, H, oy = int((2 * 1.42 * rxy + 2) * ppu), int((top + bot) * ppu), top * ppu
    else:
        W, H, oy = canvas
    ox = W / 2
    Ra = _rotz(math.radians(yaw_deg))
    mat_id = np.full((H, W), -1, dtype=np.int16)
    shade = np.zeros((H, W), dtype=np.float32)
    depth = np.full((H, W), -1e9, dtype=np.float32)
    D = np.array([1.0, 1.0, 1.0])
    for p in scene.P:
        c = Ra @ p["c"]
        Rl = Ra @ p["R"]
        M = np.diag(1.0 / p["r"]) @ Rl.T
        Rb = p["r"].max()
        scx, scy = c[0] - c[1], (c[0] + c[1]) / 2 - c[2]
        half = 1.5 * Rb * ppu + 2
        i0, i1 = max(0, int(ox + scx * ppu - half)), min(W, int(ox + scx * ppu + half) + 1)
        j0, j1 = max(0, int(oy + scy * ppu - half)), min(H, int(oy + scy * ppu + half) + 1)
        if i1 <= i0 or j1 <= j0:
            continue
        jj, ii = np.mgrid[j0:j1, i0:i1]
        sx, sy = (ii + 0.5 - ox) / ppu, (jj + 0.5 - oy) / ppu
        P0 = np.stack([sy + sx / 2, sy - sx / 2, np.zeros_like(sx)], axis=-1)
        q0 = (P0 - c) @ M.T
        qd = M @ D
        a = qd @ qd
        b = q0 @ qd
        cc = (q0 * q0).sum(-1) - 1
        disc = b * b - a * cc
        hit = disc > 0
        t = (-b + np.sqrt(np.where(hit, disc, 0))) / a
        dep = 2 * sy + 3 * t
        sub = depth[j0:j1, i0:i1]
        win = hit & (dep > sub)
        if not win.any():
            continue
        q = q0 + t[..., None] * qd
        n = q @ M
        n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-9
        s = np.clip(n @ LIGHT, 0, 1)
        sub[win] = dep[win]
        mat_id[j0:j1, i0:i1][win] = p["mat"]
        shade[j0:j1, i0:i1][win] = s[win]
    return mat_id, shade, depth, (W, H, oy)


def shade_to_image(scene, mat_id, shade, depth, edge=5.0, dither=0.05):
    H, W = mat_id.shape
    alpha = mat_id >= 0
    s = shade + dither * BAYER4[np.arange(H)[:, None] % 4, np.arange(W)[None] % 4]
    band = np.digitize(s, BANDS)
    tones = np.array([ramp(scene.base[n]) for n in scene.names])          # (mats, 4, 3)
    rgb = tones[np.clip(mat_id, 0, None), band].astype(np.float32)
    # inner outline: darken pixels that a nearer surface overlaps abruptly (limb over torso etc.)
    occl = np.zeros_like(alpha)
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        nb = np.roll(np.roll(depth, dy, 0), dx, 1)
        nba = np.roll(np.roll(alpha, dy, 0), dx, 1)
        occl |= alpha & nba & (nb > depth + edge)
    rgb[occl] *= 0.55
    out = np.zeros((H, W, 4), dtype=np.uint8)
    out[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out[..., 3] = np.where(alpha, 255, 0)
    return Image.fromarray(out)


def render_sheet(scene, ppu=4, do_outline=True, edge=5.0, dither=0.05):
    """8 directions, same canvas and crop so sprites line up. Returns {dir: RGBA}."""
    shots, canvas = {}, None
    for name, yaw in DIRS.items():
        m, s, d, canvas = render_dir(scene, yaw, ppu, canvas)
        shots[name] = shade_to_image(scene, m, s, d, edge, dither)
    box = None
    for im in shots.values():
        b = im.getchannel("A").getbbox()
        box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    box = (box[0] - 2, box[1] - 2, box[2] + 2, box[3] + 2)
    out = {}
    for k, im in shots.items():
        im = im.crop(box)
        out[k] = outline(im) if do_outline else im
    return out
