# Recorded audio handoff

Send the dry takes as mono WAV files if possible. Leave a short quiet margin at either end and avoid clipping, added reverb, or stereo positioning. A clear, short recording is enough. The game applies distance, panning and muffling.

| Cue ID | Take | Suggested length |
| --- | --- | --- |
| `near` | Single close infected groan | 1–1.5 s |
| `distant` | Single longer call or low moan | 2–3 s |
| `horde` | Overlapping voices and shuffling feet | 2–3 s |
| `footsteps` | Two or three separated steps | 0.5–1 s |
| `twig` | Scrape or dry twig snap | 0.5–0.8 s |
| `tin` | Metal handle or tin rattle | 1–1.5 s |
| `wings` | Nearby wingbeats | 0.5–0.8 s |
| `heartbeat` | One double heartbeat | 0.5–1 s |
| `glass` | Bottle or glass clink | 0.5–0.8 s |
| `stone` | Loose stone impacts | 1–1.5 s |
| `fungus` | Damp shifting or low rustle | 1–1.5 s |
| `crib` | Crib encounter sound | 1–1.5 s |
| `alarm` | Short alarm burst | 1–2 s |

## Integrate an approved take

1. Create `game/audio/` and add the file with a lowercase name such as `near.wav`. WAV, MP3 and Ogg are accepted.
2. Register it in `game/recordings.js`, for example `near: "audio/near.wav"`. Several game scenes may share a cue ID.
3. Run `npm test` and `npm run build`. The build copies the recordings to the static output and embeds them in `dist/single.html`.
4. In a browser, enable sound and trigger the scene. Check levels, direction, muffling, and mute on a phone and desktop. Unlisted, unavailable or undecodable clips use the existing synthesized cue.

The manifest starts empty. UI confirmation tones use their existing oscillator path.
