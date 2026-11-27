import sys
from PIL import Image, ImageDraw
sys.path.insert(0, ".")
from pixelforge import pixelate, upscale
from pixelforge.bg import remove_background, crop_to_content, keep_largest
from pixelforge.iso import sheet

SRC = "/root/.claude/uploads/64453697-1bec-5ca7-a881-1e772c6738c6/56102cfa-image.png"
OUT = sys.argv[1]
im = Image.open(SRC).convert("RGB")
d = ImageDraw.Draw(im)
for box in ((800, 15, 930, 130), (160, 1405, 280, 1525)):   # screenshot UI buttons
    d.rectangle(box, fill=(255, 255, 255))
im = im.crop((140, 0, 960, 1545))
cut = crop_to_content(keep_largest(remove_background(im)), 4)
cut.save(f"{OUT}/knight_cut.png")
art = pixelate(cut, 56, "auto", colors=22, dither="none", do_outline=True)
art.save(f"{OUT}/knight_px.png")
upscale(art, 8).save(f"{OUT}/knight_px_x8.png")
s = sheet(art, 6)
bg = Image.new("RGBA", s.size, (58, 68, 102, 255)); bg.alpha_composite(s)
bg.save(f"{OUT}/knight_sheet.png")
print(art.size, s.size)
