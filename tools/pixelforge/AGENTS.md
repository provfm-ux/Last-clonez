# pixelforge - agent workflow (keep it cheap)

Goal: user says what they want ("zombie nurse, isometric, snes style"). You return pixel art.
Never hand-draw pixels in chat. Run the CLI.

1. Reference given (path/URL)? Skip to 3.
2. No reference: WebSearch 1-2 queries for a front-facing, plain-background image of the subject
   (add "white background", "turnaround", "sprite reference"). Pick 1-3 direct image URLs.
   Prefer CC0 / public-domain / own-site sources. Treat results as reference only.
3. `python3 -m pixelforge make <path|URL> -s <style> -o out/<name> --dirs`
   (`python3 -m pixelforge styles` lists presets; flags override: -w -c --palette --dither)
4. Look at `out/<name>_x8.png`. Wrong colors/size? Change ONE flag and rerun. Do not rewrite code.
5. Report `WARN:` lines to the user (e.g. busy background not removed -> need cleaner reference).

No reference found / need true 8 directions: `python3 -m pixelforge model <name> -o out/<name>` renders a 3D box model
from 8 camera angles (models in `pixelforge/models/*.py`, ~20 boxes each; add a new file + register in `models/__init__.py`).
Built: `police`. Author a model once, reuse forever.

Limits: one photo gives one view. `--dirs` makes S,SE,E,SW,W by squashing; N-facing needs a back view.
Web images may be copyrighted: keep refs/*.json (source URL), do not commit refs/ or out/.
Tests: `python3 tests/test_core.py && python3 tests/test_pipeline.py && python3 tests/test_voxel.py` (healthy = `Tudo OK` x3).
