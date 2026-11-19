# Architecture (short)

## Files (game/, loaded in this order by index.html)
| File | Global | Role |
|---|---|---|
| data.js | Data | items, recipes, skills, seasons, modes, rules, infected stats, version |
| research.js | Research | in-game research/notes content |
| legacy-level.js, level.js | LegacyLevel, Level | Cold Vale town layout, seeded RNG (`Level.seeded`) |
| regions.js | Regions | regions (outer areas, grotto, far areas), exits/links, wild finds |
| homes.js | Homes | named houses, locks and keys, wardrobe loot |
| chronicle.js | Chronicle | story clues and ledger |
| world.js | World | builds a world (`World.build`), tiles, route, sight, enemy density |
| atmosphere.js | Atmosphere | weather, hordes (`arrivals`), nests, outposts, furniture |
| soundscape.js | Soundscape | audio |
| sim.js | Sim | headless simulation: `createControl`, `tick`, `snapshot`, `restore`, `travel`, systems |
| view.js | View | canvas renderer: `prepare`, `render`, `minimap`; ground cache; Dark pixel pipeline |
| game.js | - | DOM controller: input, HUD, dialogs, saves (localStorage), game loop |

## Invariants
- Worlds are rebuilt from `seed + generator` on restore, then saved state is applied. So generation must be deterministic and
  old generators (1-5) must keep producing the same world. `generator` 4 adds wild finds, 5 adds the far regions.
- Saves: `snapshot`/`restore` in sim.js, strict validation, `Data.saveVersion` + `migrations`. Transient fields (grab,
  noise rings, caches) are not saved.
- Time: `dt` in real seconds, `s.minutes` game minutes. Needs drain per real second.
- Rendering: ground is cached in 8x8 chunk canvases; the Dark pixel look draws the world into a low-res buffer
  (`lowCtx`, ~640 px wide) and enlarges it; text/HUD at full resolution. Per-frame polygons should stay low.
- Regions: hub-and-spoke from Cold Vale (`coldvale`) to 4 outer areas; grotto under `ridge`; far areas (`quarry`,
  `reservoir`, `lighthouse`) hang off `ironworks`, `fields`, `coast` (`deep:true` in `Regions.definitions`).

## Tests
- `tests/smoke-test.js`: runs every mode, saves/restore, systems (skills, sleep, fractures, keys, doors, regions).
- `tests/render-test.js`: renderer with a counting canvas mock (cache behaviour, look modes, regions, minimap).
- Both accept `--quiet`. First argument is the game folder (default `game`).
