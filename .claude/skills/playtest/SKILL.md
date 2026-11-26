---
name: playtest
description: Playtest Last CloneZ. Use when asked to playtest or test the game, check that a challenge works in the real browser game, or turn a human playtest's notes into bugs and tasks. Automated mode drives the real game through its UI buttons; human mode gives the tester a report template and analyses it.
---

# Playtest (Last CloneZ)

Two modes. Pick from the request; if unclear, run automated first and offer the human template.
Human-playtest structure adapted from the `playtest-report` skill of Claude Code Game Studios (MIT, Donchitos).

## Automated playtest

1. Run `node scripts/playtest.js` (all scenarios) or `node scripts/playtest.js cinema-trap use-notes` (some).
   It opens the real `game/index.html` in headless Chromium (files served from disk inside the browser, no server),
   starts a Campaign, and presses the real buttons: Use (`#search-btn`), Cross, Take, Read. Shortcuts it may use:
   `Sim.testJump(state, day, items, {anyMode:true})` to jump days, and moving the player next to an object.
2. Read `playtest-output/report.md` and open every screenshot it links. Look at them: wrong text, wrong region name,
   objectives that do not match the campaign, overlapping UI, invisible objects. These are findings too.
3. Report to the user: each scenario PASS/FAIL with its note, the frame rate measured with the cinema horde
   (flag anything under 30 fps), console errors, and what you saw in the screenshots.
4. Be honest about the limits: the browser has no sound output and nobody felt the controls. Audio, difficulty and fun
   need the human playtest. Never report them as checked.
5. When a new challenge is built, add a scenario for its id to `scripts/playtest.js` (one scenario per challenge, using
   the real buttons) in the same pull request.

## Human playtest

1. Give the user `.claude/skills/playtest/report-template.md` (Portuguese, filled on paper or in a message).
   Ask for one session at the campaign pace (15 minutes per day), on the device they target (phone or desktop).
2. When they send notes, sort every observation into exactly one bucket:
   - **Bug**: something breaks (crash, soft-lock, wrong text, a note that does not open, frame drops). Give steps to reproduce.
   - **Design**: confusion or no fun; compare with `docs/HISTORIA.md` and say when the notes conflict with it.
   - **Balance**: numbers feel wrong (needs, damage, tool wear, horde size, day length).
   - **Polish**: friction that does not block play (sound level, labels, feel).
3. For each item name the campaign id it touches (`cinema.statue`, `ironworks.barricade`...) and the next action:
   a fix pull request, a question for the user, or a test to add. Put the top 3 first.
4. Save the analysed report only if the user agrees, as `docs/playtests/playtest-<date>.md`.

## Checks before saying a playtest is done
- `npm test` still passes after any fix that came out of the playtest.
- Every bug fixed has a test (sim, render, audio or a playtest scenario) that fails without the fix.
