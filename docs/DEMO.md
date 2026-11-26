# itch.io demo

A cut-down build: **Cold Vale** (survival hub: shelter, scavenging, crafting), **Oxford Night Reel** (cinema) and **Cinder Grotto** (the most advanced area), 30 real minutes of play, and a **Report a bug** button that opens an email draft.

Build: `DEMO_EMAIL=you@example.com npm run build:demo` (optional `DEMO_URL=https://...` adds a link on the end screen).
Output: `dist-demo/last-clonez-demo.zip` (a single `index.html`). On itch.io: new project, kind "HTML", upload the zip, tick "This file will be played in the browser", embed ~1280x760.

How it works (no change to `game/*.js`, so the full game and its saves are untouched): `demo/demo.js` is injected after `game.js` and
- starts the run in the Cold Vale shelter (campaign rules, so the idol trap works); Cold Vale only leads to the cinema, and the cinema has a second exit to the grotto;
- lifts the campaign day and item gating for those two areas;
- counts live play time in `localStorage` (menus, pause, hidden tabs do not count), shows the time left and an end screen at 30:00;
- builds the bug mail from the text typed plus play time, in-game clock, area and browser. "Copy report" is the fallback when the mail app does not open.

Marketing and itch page copy: `docs/MARKETING.md`.

Tests: `tests/demo-test.js` (runs in `npm test`).
