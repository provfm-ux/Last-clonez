# Last CloneZ

Last CloneZ v0.30 is an isometric zombie-survival browser game set in Cold Vale. It runs with vanilla JavaScript and has no runtime dependencies or build step.

## Play locally

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/public/>. For static hosting, use `public/` as the publish directory. The HTML loads its scripts, stylesheet, and icon using relative URLs, so the game also works under a URL subdirectory.

## Project structure

| Path | Contents |
| --- | --- |
| `public/index.html`, `public/style.css`, `public/icon.svg` | Game interface, styling, and favicon |
| `public/game.js`, `public/view.js`, `public/sim.js` | Input and UI, canvas rendering, and game simulation |
| `public/data.js`, `public/research.js`, `public/chronicle.js` | Game data, research, and journal content |
| `public/world.js`, `public/regions.js`, `public/homes.js`, `public/level.js`, `public/legacy-level.js` | World and level generation |
| `public/atmosphere.js`, `public/soundscape.js` | Atmosphere and procedural audio. The archive has no standalone sound files. |
| `public/_headers` | Original response header rules for compatible static hosts |
| `last-clonez-repo.zip` | Original upload. The complete runtime is in `repo/game/` inside the archive, alongside the original tests, build tools, and documentation. |

## Validation and limitations

The 17 files in `public/` match `repo/game/` byte for byte. The original ZIP passed its integrity check and is unchanged. The archived simulation and rendering tests can be run against the restored files with Node.js 20 or later:

```sh
mkdir -p /tmp/last-clonez-validation
unzip -q last-clonez-repo.zip 'repo/tests/*' -d /tmp/last-clonez-validation
node /tmp/last-clonez-validation/repo/tests/smoke-test.js public --quiet
node /tmp/last-clonez-validation/repo/tests/render-test.js public --quiet
```

Chromium loaded the game at both the site root and `/public/index.html`. The browser check covered asset loading, canvas rendering, starting a run, opening the map and journal, muting sound, and resuming a save after reload. The archive's separate compatibility test requires an older release that was absent from the repository.
