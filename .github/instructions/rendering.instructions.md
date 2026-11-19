---
applyTo: "game/view.js,game/style.css,game/index.html"
---
# Rendering and UI
- Static ground art lives in `tileArt`/`microDetail` (cached per 8x8 chunk). Per-frame code must stay small: aim to keep
  `npm run test:full` render counters near the current numbers (stable frame ~2000 canvas ops).
- `ctx` is a `let`: the Dark pixel look draws into `lowCtx` and `render` restores `mainCtx`. Never leave `ctx` swapped.
- Text, markers and HUD are drawn after the low-resolution blit, at normal resolution.
- Touch layout: Attack is the biggest button, bottom-right; keep other actions smaller and separated.
- Run `node tests/render-test.js game` after changes.
