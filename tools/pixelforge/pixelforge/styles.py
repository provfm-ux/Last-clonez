"""Style presets. Pick one with --style; override single fields with CLI flags."""
STYLES = {
    # clean modern sprite: outline, no dither, 32-color Endesga look
    "sprite":  dict(width=48, palette="endesga32", colors=16, dither="none",  outline=True,  remove_bg=True),
    # keeps source colors (good for metal, skin, photos)
    "detail":  dict(width=64, palette="auto",      colors=22, dither="none",  outline=True,  remove_bg=True),
    "snes":    dict(width=64, palette="auto",      colors=32, dither="bayer", outline=True,  remove_bg=True),
    "pico8":   dict(width=32, palette="pico8",     colors=16, dither="none",  outline=True,  remove_bg=True),
    "gameboy": dict(width=40, palette="gameboy",   colors=4,  dither="bayer", outline=False, remove_bg=True),
    # scenery / full frame: keep background
    "scene":   dict(width=160, palette="auto",     colors=24, dither="bayer", outline=False, remove_bg=False),
}
DEFAULT = "detail"
