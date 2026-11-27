# Content guide - read only the section you need

After any change: `npm test`; if functions were added/moved: `npm run index`.

## Add an item or weapon
1. `game/data.js` -> `items`: `{name, group, weight, icon, ...}`. Weapons: `damage, range, delay, effort, noise, wear`.
   Wearable: `slot` (head, hands, wrist, arms, body, legs, feet) + `warmth`/`guard`.
2. Source: house loot lists in `game/homes.js` (`cupboard`, `wardrobe`), wild finds in `game/regions.js` (`wildFinds`),
   or a recipe in `Data.recipes`.
3. Test: item exists and is obtainable; see the "armas novas"/"roupa" tests.

## Add a crafting recipe
`Data.recipes` entry `{id, name, out, qty, inputs:{item:n}, desc}` (optional station/skill). Test with a bag containing inputs.

## Add a skill
`Data.skills` (name, desc) -> call `addXp(s, "skill", amount)` where it is earned (`grep addXp docs/CODE_INDEX.md` for
examples) -> apply the effect via `level(s, "skill")`. Old saves default new skills to 0 automatically.

## Add a house, name or key
`game/homes.js` -> `plots[region]` `[x, y, "Name"]`. Names alluding to zombie films are encouraged. Story clues reference
names exactly (`chronicle.js`). Locks: every 2nd closed door is locked; keys are hidden in another house (`housekey` with
`lock`/`label`). Do not call `rng()` for new decisions.

## Add a story clue or note
`game/chronicle.js` -> clue entry with `at:["House name", dx, dy]` and text/source. Keep to the dark tone. Test: the world
builds without "Missing landmark" (the smoke test builds every mode).

## Add a region
1. `Regions.definitions` entry (size, `host`, `arrival`, `exitBack`, `hostExit`, `hostArrival`, `deep:true`).
2. Surface function (`regionSurface`) and a block in `create()` with buildings (`building`, `stash`), roads, resources.
3. REQUIRED or travel fails: `Atmosphere.arrivals[region]`, `nestBuildings[region]`, `outpost[region]`, `World.areaDensity`.
4. Copy the region checks from `tests/smoke-test.js` ("região ...") and render check from `tests/render-test.js`.
5. Gate new exits behind a new `generator` number so old saves stay identical.

## Add a rule/option
`Data.ruleFields` + default in the baseline; saves missing the field fall back to the default.

## Add a status ("moodle")
`Sim.moodles`: `add(id, labels, tier)`; the HUD shows the 4 worst.

## Add an event or horde
`game/atmosphere.js` (`arrivals`, events); keep deterministic; test over a few thousand ticks.

## Graphics - ground detail and blood (free in performance)
`view.js` -> `microDetail`/`tileArt`/`bloodPool`: drawn once into cached chunks. Use deterministic hash, 2-3 px dots.
Change the chunk signature if the look changes. Check with `node tests/render-test.js game`.

## Graphics - characters/props (per frame, keep cheap)
Bake sprites once to an offscreen canvas and `drawImage` them; no per-frame gradients. Keep the micro-pixel palette:
desaturated greens/browns, blood `#4a0c0f #6a1216 #8c1a1c`, cold tint, dark tone, less cartoon.

## Graphics - 8-direction character atlases (assets only, not wired in yet)
`game/assets/characters/` has 22 characters x 3 sizes (`<id>_mini|game|hd.png` = 40/80/160 px tall, default `mini`) and `index.json`
(cell size, feet anchor, scale). Each PNG is one row of 8 equal cells, order N NE E SE S SW W NW (screen directions). Regenerate with
`python3 -m pixelforge sheets <package> -o out/chars` in `tools/pixelforge` (see its AGENTS.md).

## Add sound
`game/soundscape.js`; no external files unless added to `game/`.

## Release
Bump version in `game/data.js` and `?v=` in `game/index.html`; 3-6 lines in `CHANGELOG.md`.
