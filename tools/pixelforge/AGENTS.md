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
Two renderers:
- ORGANIC (preferred, smooth pixel art): ellipsoid scenes in `pixelforge/models/*.py` with `build()`; register in `ORGANIC`.
  Helpers: `ball`, `ell`, `limb(a,b,r,mat)`, `front_x` (place eyes/spots on a surface). Built: `zombie`, `worker`. ~4 cel tones per material.
- BOXES (legacy, blocky): `police`, `knight`.
Size: `--ppu` pixels per model unit (organic default 3.5 -> ~236 px tall; raise for finer pixels). Author a model once, reuse forever.

Character sheets (4x2 grid, magenta bg, order N NE E SE / S SW W NW): `python3 -m pixelforge sheets <package_dir> -o out/chars`
writes per character 3 size tiers (hd 160 / game 80 / mini 40 px tall) as 8-cell row atlases + JSON (cell size, feet anchor, scale) + `index.json`.
Originals are never modified. Brute x1.28, runner x0.94 (same factors as game/view.js); crawler anchors on the body.

Walk cycles: `sheets` also bakes 8-frame walk atlases (mini, game) from `rigs.json`: per-character leg ratio, `arm_swing`, `leg_swing`, `bob`,
and `arms` per anatomical side (full | upper = stump | none = missing). Edit `rigs.json`, then re-run with `--only <id>` (about 7 s per character).

Customisable characters (`recolor.IDS`: protagonist, survivor_male, survivor_female): `sheets` also writes `*_mask.png` region masks
(85 skin, 170 hair, 255 jacket) and `recolor` refs in `index.json`; the game recolours them from the player's style at load time.
Tweak the HSV rules in `pixelforge/recolor.py` (`classify_cell`) if a region leaks, then re-run `--only <id>`.

Extra characters (not in the package): `sources/characters.json` + one transparent PNG per direction in `sources/<id>/` (Pixel Lab `create-character-v3`
export: `POST /v2/create-character-v3` ~3 generations at 128x128, poll `/v2/background-jobs/<id>`, `GET /v2/characters/<id>/zip`). `sheets` builds them like the rest
(obese_male, obese_female = the big infected; the muscular `brute` is kept for mutated infected).

Zombie look: every infected id in `zombify.json` gets blood on the mouth in the views where the face shows, and flesh/pink skin recoloured to green
(`skin: auto`: skin that is already green, grey or olive is NOT changed; `green` forces it, `keep` forbids it). Face, neck, hands keep their shading. In the
views where the face shows. Per-character knobs: `skin` (green|keep), `hue`, `head_frac`, `bright_factor`, `big_skin`, `mouth_k`, `mouth_y` (mouth height as a
fraction of the figure height, for dark faces). Edit, then re-run `sheets --only <id>`. Check with a face contact sheet before committing.

Limits: one photo gives one view. `--dirs` makes S,SE,E,SW,W by squashing; N-facing needs a back view.
Web images may be copyrighted: keep refs/*.json (source URL), do not commit refs/ or out/.
Tests: `python3 tests/test_core.py && python3 tests/test_pipeline.py && python3 tests/test_voxel.py && python3 tests/test_organic.py` (healthy = `Tudo OK` x4).
