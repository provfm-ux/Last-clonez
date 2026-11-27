"""Download a reference image into refs/ (stdlib only). Keeps source URL for attribution."""
import hashlib
import io
import json
import os
import time
import urllib.request

from PIL import Image

REFS = os.environ.get("PIXELFORGE_REFS", "refs")
MAX_BYTES = 15 * 1024 * 1024


def fetch(url, refs=None):
    refs = refs or REFS
    os.makedirs(refs, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "pixelforge/0.1"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError("image too large")
    img = Image.open(io.BytesIO(data))
    img.verify()                       # not an image -> raises
    name = hashlib.sha1(url.encode()).hexdigest()[:12]
    path = os.path.join(refs, f"{name}.png")
    Image.open(io.BytesIO(data)).convert("RGBA").save(path)
    with open(os.path.join(refs, f"{name}.json"), "w") as f:
        json.dump({"url": url, "fetched": time.strftime("%Y-%m-%d"), "note": "reference only; check license"}, f)
    return path
