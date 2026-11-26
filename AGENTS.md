# AGENTS.md - Last CloneZ

Browser zombie-survival game: isometric canvas, vanilla JavaScript, no dependencies, no bundler. Game files live in `game/`.
Tone: dark, grim zombie survival. Player-facing text is English.

## Commands (use these; output is short on purpose)
- `npm test` - smoke + render tests, prints only failures. Healthy output is `Tudo OK` twice.
- `npm run index` - regenerate `docs/CODE_INDEX.md` after adding/removing/moving functions (CI checks it).
- `npm run build` - writes `dist/` (static site + `single.html`).
- `npm run test:compat` - needs the previous release unpacked in `../old-version`; proves old saves still load.

## Save tokens (read first)
- Never open whole files. `game/sim.js` ~2400 lines, `game/game.js` ~1900, `game/view.js` ~1300.
  Find code with `grep -n "name" docs/CODE_INDEX.md`, then view only that line range.
- Open `docs/CONTENT_GUIDE.md` and read ONLY the section for your task type (story, house, item, region, graphics...).
- One task = one branch/PR, normally <= 3 files. No refactors, reformatting or renames outside the task.
- Run `npm test` once when done (and again after a failure). Quote only the failing lines.
- Do not paste large files in PR text. Describe the change in <= 6 lines.

## Hard rules (these have broken the game before)
1. Old saves must keep loading. Never add calls to the shared `rng()` in existing world generation
   (`homes.js`, `regions.js`, `world.js`): use a position hash, a separate seeded stream, or gate the change behind a new
   `generator` number. Verify with `npm run test:compat`.
2. New saved state: add it to snapshot/restore and validation in `sim.js` with a default for old saves.
   Changing `Data.saveVersion` requires an entry in `migrations`.
3. `sim.js` never touches the DOM. UI is `game.js`, drawing is `view.js`.
4. No new dependencies. Scripts are plain globals loaded in the order of `game/index.html`.
5. Every feature needs a test: `tests/smoke-test.js` (simulation) or `tests/render-test.js` (drawing).
6. Per-frame drawing must stay cheap: no gradients or hundreds of polygons per frame; static art goes in the cached ground
   (`tileArt`/`microDetail`) or in baked sprites.
7. Releases: bump the version in `game/data.js` and the `?v=` in `game/index.html`, add 3-6 lines to `CHANGELOG.md`,
   and add a save fixture for the new version: `node scripts/save-fixture.js game v<version> survival campaign` (loaded by `npm test`).

## Where things are
See `docs/ARCHITECTURE.md` (module roles, invariants) and `docs/CONTENT_GUIDE.md` (how to add content).
Backlog of ready-made tasks: `docs/TASKS.md`. Long-term plan: `docs/ROADMAP.md` (29 KB) and `CHANGELOG.md` are large: `grep` them, never read them whole.
