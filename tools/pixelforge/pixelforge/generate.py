"""Base image when the user gives none.

Real AI generation needs an external generator. Set PIXELFORGE_GEN_CMD to a shell command
containing {prompt} and {out}; it must write an image to {out}. Example:
    PIXELFORGE_GEN_CMD='my-gen --prompt {prompt} --out {out}'
Without it, a procedural placeholder (seeded by the prompt) is drawn so the pipeline still runs.
"""
import hashlib
import os
import random
import shlex
import subprocess
import tempfile

from PIL import Image, ImageDraw


def from_external(prompt):
    cmd = os.environ.get("PIXELFORGE_GEN_CMD")
    if not cmd:
        return None
    out = os.path.join(tempfile.mkdtemp(), "gen.png")
    line = cmd.format(prompt=shlex.quote(prompt), out=shlex.quote(out))
    subprocess.run(line, shell=True, check=True)
    return Image.open(out).convert("RGBA")


def placeholder(prompt, size=512):
    """Procedural creature-ish blob on transparent bg. Deterministic per prompt."""
    seed = int(hashlib.sha256(prompt.encode()).hexdigest()[:8], 16)
    r = random.Random(seed)
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    base = tuple(r.randint(60, 220) for _ in range(3))
    s = size
    d.ellipse([s * .3, s * .12, s * .7, s * .45], fill=base)                       # head
    d.rounded_rectangle([s * .27, s * .42, s * .73, s * .78], s * .06,
                        fill=tuple(max(0, c - 40) for c in base))                   # torso
    for x in (.18, .72):                                                            # arms
        d.rounded_rectangle([s * x, s * .44, s * (x + .1), s * .7], s * .04, fill=base)
    for x in (.3, .53):                                                             # legs
        d.rounded_rectangle([s * x, s * .76, s * (x + .17), s * .95], s * .04,
                            fill=tuple(max(0, c - 70) for c in base))
    for x in (.4, .54):                                                             # eyes
        d.ellipse([s * x, s * .24, s * (x + .06), s * .3], fill=(255, 255, 255))
    return img


def make(prompt):
    return from_external(prompt) or placeholder(prompt)
