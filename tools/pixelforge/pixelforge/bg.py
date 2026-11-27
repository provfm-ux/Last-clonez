"""Background removal without ML: flood fill from the border over near-uniform background."""
from collections import deque

import numpy as np
from PIL import Image, ImageFilter


def remove_background(img, tol=22, pocket_min=1500):
    """Make border-connected pixels close to the corner color transparent."""
    rgba = img.convert("RGBA")
    a = np.array(rgba)
    h, w, _ = a.shape
    ref = np.median(np.concatenate([a[0, :, :3], a[-1, :, :3], a[:, 0, :3], a[:, -1, :3]]), axis=0)
    diff = np.abs(a[..., :3].astype(np.int16) - ref).max(-1)
    cand = diff <= tol
    bg = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if cand[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if cand[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))
    # enclosed background pockets (between arm and torso, between legs): big pure-white blobs
    pure = (a[..., :3].min(-1) >= 250) & ~bg
    seen = np.zeros_like(pure)
    for sy in range(h):
        for sx in range(w):
            if pure[sy, sx] and not seen[sy, sx]:
                comp, q = [], deque([(sy, sx)])
                seen[sy, sx] = True
                while q:
                    y, x = q.popleft(); comp.append((y, x))
                    for ny, nx in ((y-1, x), (y+1, x), (y, x-1), (y, x+1)):
                        if 0 <= ny < h and 0 <= nx < w and pure[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; q.append((ny, nx))
                if len(comp) >= pocket_min:
                    for y, x in comp: bg[y, x] = True
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))  # eat halo
    a[..., 3] = np.array(alpha)
    return Image.fromarray(a)


def keep_largest(img, min_alpha=10):
    """Drop floating specks: keep only the biggest connected opaque blob."""
    a = np.array(img)
    solid = a[..., 3] > min_alpha
    h, w = solid.shape
    seen = np.zeros_like(solid)
    best = []
    for sy in range(h):
        for sx in range(w):
            if solid[sy, sx] and not seen[sy, sx]:
                comp, q = [], deque([(sy, sx)])
                seen[sy, sx] = True
                while q:
                    y, x = q.popleft(); comp.append((y, x))
                    for ny, nx in ((y-1, x), (y+1, x), (y, x-1), (y, x+1)):
                        if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; q.append((ny, nx))
                if len(comp) > len(best): best = comp
    keep = np.zeros_like(solid)
    for y, x in best: keep[y, x] = True
    a[~keep, 3] = 0
    return Image.fromarray(a)


def crop_to_content(img, pad=0):
    box = img.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(img.width, box[2] + pad), min(img.height, box[3] + pad))
    return img.crop(box)
