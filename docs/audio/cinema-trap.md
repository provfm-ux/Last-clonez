# Audio: cinema trap (cinema.statue)

Sound spec written with the `team-audio` skill of Claude Code Game Studios (sound-designer pass, team size "individual").
Engine: custom (vanilla JS, Web Audio). Sounds are generated in `game/soundscape.js`; the simulation queues cues with `hear()`.

## Direction
Dread first, then panic. The idol lifts in near silence, the building answers with mechanical violence (click, slams),
the room fills with the members' social from the beer-tap corner, and a low pulse stays under everything until the player is out.

## Event list

| Event | Trigger | Position | Delay | Gain | Character | Visual fallback |
|---|---|---|---|---|---|---|
| `idolClick` | idol taken | idol | 0 s | 0.24 | stone grind, mechanism click, low thud | "CLICK" + screen shake + message |
| `doorSlam` | each sealed door | the door | 0.35 s, +0.25 s per door | 0.30 | heavy slam, then the bolt | "SLAM" on each door + "Jammed" when tried |
| `tapSocial` | idol taken | beer tap corner | 0.9 s | 0.30 | pint glasses knocked over, the social's murmur sinking into groans | message names the tap corner |
| `horde` | idol taken | beer tap corner | 1.4 s | 0.43 | shuffling feet and groans (existing) | message names the tap corner |
| `tension` | the tick after the idol is taken, then every 6 s while inside the hall | player | 0 s | 0.20 | detuned low cluster, swells and pulses | none needed: mood only, carries no information |

## Mix and rules
- `tension` is a bed under the effects (lowest gain, 700 Hz low-pass); it stops for good once the player leaves the hall.
- Slams are staggered so they read as two doors, not one loud hit; peak level kept at about 0.76 (no clipping).
- No gameplay state is carried by sound alone; every critical cue has text or an on-screen effect.
- Voice limit (10) and the 5-cue queue are respected: the trap queues exactly 5 cues; tension starts on the next tick.

## Tests
`tests/audio-test.js` (new sounds render, end at silence, delays start late) and `cinema.scene` in `tests/smoke-test.js`.
