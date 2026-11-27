"""Image -> pixel art. Pillow + numpy only."""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

from . import palettes

BAYER4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0 - 0.5


def prepare(img, contrast=1.15, saturation=1.25, sharpen=True):
    img = img.convert("RGBA")
    rgb = img.convert("RGB").filter(ImageFilter.MedianFilter(3))  # kill noise, keep edges
    rgb = ImageEnhance.Contrast(rgb).enhance(contrast)
    rgb = ImageEnhance.Color(rgb).enhance(saturation)
    if sharpen:
        rgb = rgb.filter(ImageFilter.UnsharpMask(2, 80, 2))
    out = rgb.convert("RGBA")
    out.putalpha(img.getchannel("A"))
    return out


def downscale(img, width):
    """Reduce to `width` px wide. BOX average over RGB, alpha thresholded."""
    w, h = img.size
    height = max(1, round(h * width / w))
    rgb = img.convert("RGB").resize((width, height), Image.BOX)
    alpha = img.getchannel("A").resize((width, height), Image.BOX).point(lambda a: 255 if a >= 128 else 0)
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def kmeans_palette(rgb, k, iters=12, seed=0):
    px = rgb.reshape(-1, 3).astype(np.float32)
    rng = np.random.default_rng(seed)
    cent = px[rng.choice(len(px), size=min(k, len(px)), replace=False)]
    for _ in range(iters):
        d = ((px[:, None, :] - cent[None]) ** 2).sum(-1)
        lab = d.argmin(1)
        for i in range(len(cent)):
            m = lab == i
            if m.any():
                cent[i] = px[m].mean(0)
    return [tuple(int(c) for c in row) for row in cent.round()]


def apply_palette(rgb, pal, dither="none", strength=0.6):
    pal_a = np.array(pal, dtype=np.float32)
    h, w, _ = rgb.shape
    src = rgb.astype(np.float32)
    if dither == "bayer":
        step = 255.0 / max(2, len(pal) ** (1 / 3))
        src = src + BAYER4[np.arange(h)[:, None] % 4, np.arange(w)[None] % 4][..., None] * step * strength
    if dither == "floyd":
        out = np.zeros((h, w), dtype=np.int32)
        buf = src.copy()
        for y in range(h):
            for x in range(w):
                old = buf[y, x]
                i = ((pal_a - old) ** 2).sum(1).argmin()
                out[y, x] = i
                err = (old - pal_a[i]) * strength
                if x + 1 < w: buf[y, x + 1] += err * 7 / 16
                if y + 1 < h:
                    if x > 0: buf[y + 1, x - 1] += err * 3 / 16
                    buf[y + 1, x] += err * 5 / 16
                    if x + 1 < w: buf[y + 1, x + 1] += err * 1 / 16
        return out
    d = ((src[:, :, None, :] - pal_a[None, None]) ** 2).sum(-1)
    return d.argmin(-1)


def clean_orphans(idx, alpha):
    """Replace single pixels that differ from all 4 neighbours (which agree) with that neighbour."""
    out = idx.copy()
    h, w = idx.shape
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            n = [idx[y - 1, x], idx[y + 1, x], idx[y, x - 1], idx[y, x + 1]]
            if alpha[y, x] and all(v == n[0] for v in n) and idx[y, x] != n[0]:
                out[y, x] = n[0]
    return out


def outline(rgba, color=None):
    """1px outline around opaque pixels (darkened edge color if color is None)."""
    a = np.array(rgba)
    h, w, _ = a.shape
    pad = np.zeros((h + 2, w + 2, 4), dtype=np.uint8)
    pad[1:-1, 1:-1] = a
    solid = pad[..., 3] > 0
    nb = np.zeros_like(solid)
    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nb |= np.roll(np.roll(solid, dy, 0), dx, 1)
    edge = nb & ~solid
    col = color or (24, 20, 37)
    pad[edge] = (*col, 255)
    return Image.fromarray(pad)


def pixelate(img, width=48, palette="auto", colors=16, dither="none",
             do_outline=True, clean=True):
    small = downscale(prepare(img), width)
    arr = np.array(small)
    rgb, alpha = arr[..., :3], arr[..., 3] > 0
    if palette == "auto":
        pal = kmeans_palette(rgb[alpha] if alpha.any() else rgb.reshape(-1, 3), colors)
    else:
        pal = palettes.get(palette)
    idx = apply_palette(rgb, pal, dither)
    if clean:
        idx = clean_orphans(idx, alpha)
    out = np.zeros(arr.shape, dtype=np.uint8)
    out[..., :3] = np.array(pal, dtype=np.uint8)[idx]
    out[..., 3] = np.where(alpha, 255, 0)
    res = Image.fromarray(out)
    return outline(res) if do_outline and not alpha.all() else res


def upscale(img, factor):
    return img.resize((img.width * factor, img.height * factor), Image.NEAREST)
