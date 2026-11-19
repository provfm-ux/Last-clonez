# Copilot instructions - Last CloneZ

Vanilla-JS isometric zombie-survival game in `game/` (no dependencies). Full rules: `AGENTS.md`. Keep to these essentials:

- Run `npm test` before finishing (short output; healthy = `Tudo OK` twice). Run `npm run index` if functions were added or moved.
- Do NOT read whole big files (`sim.js`, `game.js`, `view.js`). Use `grep -n` on `docs/CODE_INDEX.md`, then open a line range.
- For your task type read only the matching section of `docs/CONTENT_GUIDE.md`.
- One task per PR, small diff (usually <= 3 files). No refactors or reformatting.
- Old saves must still load: never add `rng()` calls to existing world generation; gate new generation behind a new `generator`.
- `sim.js` has no DOM code. Per-frame drawing must stay cheap (see `docs/ARCHITECTURE.md`).
- Add a test for every feature. Add 3-6 lines to `CHANGELOG.md` when a version is cut.
