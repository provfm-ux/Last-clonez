---
applyTo: "game/sim.js,game/world.js,game/regions.js,game/homes.js,game/atmosphere.js,game/level.js,game/legacy-level.js"
---
# Simulation and world generation
- Deterministic by seed. Do not add `rng()` calls inside existing generation; use a position hash or a separate seeded stream
  (see `wardrobeChoice` in homes.js and `addWilds` in regions.js) or a new `generator`.
- New state: snapshot + restore + validation + default for old saves (tests: "gravação antiga ... abre").
- `sim.js` must not use `document`/`window`. Time is in game minutes (`s.minutes`), real seconds in `dt`.
- New regions need entries in Atmosphere `arrivals`, `nestBuildings`, `outpost` and World `areaDensity` (travel fails otherwise).
- Test with `npm test`; for save compatibility use `npm run test:compat`.
