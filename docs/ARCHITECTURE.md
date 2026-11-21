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

## Current simulation audit

The active browser entry point loads plain JavaScript globals. Expedition defines generation 7 and its district content. Recordings supplies Soundscape, and Afterlife runs a separate post-death sequence. Game samples keyboard and touch input in requestAnimationFrame and subdivides elapsed time into steps of at most 30 ms. Render follows simulation. The main loop currently uses variable substeps. LocalStorage and the export/import UI use Sim's validated snapshots.

| System | Baseline | Remaining work |
|---|---|---|
| 1. Character and sandbox | Partial | Six backgrounds, name, two appearances, nine presets, custom rules and six starts. Add point budgets, starting skill levels, appearance customization and additional world controls. |
| 2. Conditions and moodles | Partial | Graded moodles, rest, sleep, needs, pain and temperature. Add morale, hygiene, richer sleep quality and more conditions. |
| 3. Wounds and illness | Partial | Arm and leg wounds, bleeding, bandages, fracture, sickness and separate viral exposure. Expand body coverage, injury types and treatment choices. |
| 4. Clothing and temperature | Partial | Equipment slots, wear, repairs, insulation and rain exposure. Add layers, location-specific tears, washing and more coverage. |
| 5. Skills and crafting | Partial | Ten level-10 skills, books, recipes and equipment repairs. Add action duration, workstations, more skill hooks and production chains. |
| 6. Combat | Partial | Melee, shove, pistol, durability and damage matchups. Expand weapon state, enemy knockdowns and the fire simulation. |
| 7. Infected and hordes | Partial | Three infected types, sight, noise, pursuit, nests and wandering hordes. Add acoustic attenuation, spatial indexing and staggered AI. |
| 8. World and loot | Partial | Seeded Cold Vale, outer districts, a cave, interiors, doors, keys and exploration pins. Add vertical layers, streaming and richer loot rules. |
| 9. Sustenance | Partial | Spoilage, cooking, gardening, rain collection, fishing and foraging. Add nutrition, refrigeration, crop conditions and broader food sources. |
| 10. Base and utilities | Partial | Construction, barricades, shelter, fuelled generators and utility cuts. Add richer placement, structural upkeep and base status. |
| 11. Vehicles | Partial | Driving, collision, fuel, storage and field repairs. Add vehicle profiles, replaceable components and component-dependent handling. |

### Implementation order

1. Extend Advanced setup in data.js, index.html and game.js, connect choices to sim.js and view.js, and cover compatibility in smoke-test.js. Use the Cold Vale backgrounds to tell the evacuation story in the setup itself.
2. Deepen conditions, wounds and clothing together in data.js, sim.js and the health and equipment UI in game.js.
3. Extend skill hooks and crafting in data.js and sim.js, then deepen combat and infected reactions in sim.js, atmosphere.js and view.js.
4. Add streaming and vertical map state through world.js, regions.js, sim.js and view.js before heavier world expansion.
5. Extend food, water, base, power and vehicles through the existing object catalogue, simulation and interaction panels.

In 0.34, Advanced setup gained 19 backgrounds, 30 traits, appearance and
starting outerwear options, and six additional Sandbox rules. The player
snapshot holds trait IDs, and Sim derives their multipliers when creating,
loading, or crossing into a region. New Sandbox keys fall back to the original
behaviour in older saves. See [system details](SYSTEMS.md) and [balance](BALANCE.md).
