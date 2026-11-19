# Task backlog (each item = one issue/PR; paste into the "Agent task" template)

Format: Goal | Files | Done when. Read the matching section of `docs/CONTENT_GUIDE.md` first.

1. **Survivor's journal** | After death, a new game inherits 50% of each skill's XP (saved in localStorage, applied in `createControl`; show "Inherited" in Skills). | game/sim.js, game/game.js, tests/smoke-test.js | New game after death starts with 50% XP; test covers it.
2. **Solo option** | Rule `companion: on/off`; off = Eva never appears, objective list skips her, radio part given at start. | game/data.js (ruleFields), game/sim.js, game/game.js, game/view.js | Custom game can turn Eva off; story still reachable.
3. **Dynamic blood decals** | Killing/hurting leaves blood on the ground and on the player's tile that persists while on the map (transient list, cap 80). | game/sim.js, game/view.js | Decals drawn cheaply; render test shows no big op increase.
4. **Micro-pixel sprites** | Bake player/infected/Eva sprites (mockup style: dark, bloody, less cartoon) to offscreen canvases and draw with `drawImage`; 2-frame walk. | game/view.js | Characters keep animation; per-frame ops lower than before.
5. **Story clues for the far regions** | 1 clue each in Slag Quarry, Greywater Reservoir, Gull Point that tie to the ledger. | game/chronicle.js, tests | Clues placeable; ledger lists them.
6. **Loot tables by room** | `Data.loot[roomType]` with rarity; replace hard-coded cupboard lists. Must not consume shared `rng()`. | game/data.js, game/homes.js, tests | Same seeds still load; tests for table validity.
7. **Trapping** | Snare/cage trap item + recipe, placeable outdoors, catches small game after hours, Trapping skill. | data.js, sim.js, view.js, tests | Placeable, saved, validated.
8. **Burn or bury corpses** | Shovel buries (time + skill), fire burns; removes the corpse and its sickness effect. | sim.js, game.js, tests | Corpse removed; no sickness after.
9. **Roof/wall cache per building** | Cache building roofs and walls like the ground to cut the remaining ~230 polygons/frame. | view.js, tests/render-test.js | Steady-frame polygons drop; visuals unchanged.
10. **Vehicle trunk** | Cars get a trunk container (store/take items), saved. | sim.js, game.js, tests | Items persist across save/restore.
11. **Winter balance** | Winter nights + rain too harsh: add warm clothing loot and a campfire warmth bonus; verify with the winter test. | data.js, homes.js, sim.js, tests | Survivable with coat + fire.
12. **Snow and fog weather** | New weather types tied to seasons, with a visual overlay and temperature effect. | atmosphere.js, view.js, sim.js | Appears in autumn/winter; cheap overlay.
13. **Key rebinding** | Settings screen to remap movement/actions; saved in localStorage. | game.js, index.html, style.css | Remap persists; AZERTY works.
14. **Portuguese (pt-PT) texts** | String table + language setting; start with UI and moodles. | game.js, data.js | Language switch persists.
15. **More wounds** | Fractures on other parts, burns, glass cuts; splints/disinfect interactions. | sim.js, data.js, tests | Wounds saved/validated; moodles shown.
