# Survivor setup and Sandbox balance

Edit `game/data.js` to adjust starting skill levels and kits in `roles`, trait costs and multipliers in `traitPairs`, or the limits and defaults for custom rules in `ruleFields` and `sandboxTuning`. Positive traits spend two or three points and drawbacks return the same amount. Each opposing pair is exclusive. A survivor begins with zero points and can leave points unspent.

| World rule | Default | Range |
|---|---:|---:|
| Infected speed | 100% | 50–150% |
| Infected sight | 100% | 25–175% |
| Infected hearing | 100% | 25–175% |
| Infected sound memory | 100% | 25–175% |
| Perishable lifetime | 100% | 25–200% |
| Initial bite roll | 6% | 0–40% |

Clothing may absorb a hit after the bite roll. Transmission then follows the Sandbox transmission rule. Perishable lifetime scales the base lifetime in the item catalogue, with refrigeration credited separately. Existing saves receive the defaults for the new rules and retain their old skill XP. Further simulation constants remain near their systems in `game/sim.js` and the relevant content modules.
