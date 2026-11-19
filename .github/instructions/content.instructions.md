---
applyTo: "game/data.js,game/chronicle.js,game/research.js"
---
# Content and story
- Items, recipes, skills, rules, modes live in `data.js`. New items need `name`, `group`, `weight`, `icon`; weapons also
  `damage, range, delay, effort, noise, wear`. Use existing icon names only.
- Story clues in `chronicle.js` point to houses by exact name (`at:["House name",dx,dy]`). Renaming a house breaks the clue.
- Player-facing text: English, grim, short.
- Add the item/clue to a loot source and a test (see `docs/CONTENT_GUIDE.md`).
