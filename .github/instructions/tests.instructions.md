---
applyTo: "tests/**"
---
# Tests
- Tests run in Node with no browser: simulation via `Sim`, drawing via a counting canvas mock.
- Write checks with `check(name, passed, detail)`. Test names are in Portuguese; keep that style.
- Prefer behaviour checks (what the player sees) over implementation details. Make setups robust (find a clear tile instead
  of hard-coded coordinates).
