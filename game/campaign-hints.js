"use strict";

// Campaign hints (docs/HISTORIA.md sections 4, 14 and 16). Pure: no DOM, no rng.
// After 2 in-game days without progress on the same objective, one hint per calendar day,
// from the most discreet to the most explicit. State is a small plain object kept by the caller.
const CampaignHints = (() => {
  const stuckDays = 2;
  // Per challenge id: up to three hints, discreet -> explicit. Player-facing text is English.
  const hints = {
    "coldvale.houses":["Prepper notes tend to hide in ordinary homes, not shops.", "Three houses in Cold Vale each hold a torn page.",
      "Search inside the family houses around the shelter for torn pages."],
    "westfields.stealth":["The farmland opens on day 10, and the farmhouse at the far west is the place.", "Loud noise calls a group. Keep your knife for the ones that block the way.", "Read the ledger in the Orchard farmhouse. Nothing may have noticed you."],
    "cindergrotto.battery":["The survey tunnel on Pine Ridge only opens from day 12.", "The plate is deep, in the survey room. It needs a lit flashlight to read.", "Bring spare batteries and plan the way back out before the light dies."],
    "amigo1.lockdown-chat":["It still listens to prompts.", "It is mid-lockdown. Words may work where blows did not.", "Ask it to stand down."],
    "fortress.last-boss":["The coat is scorched but whole.", "Fire made it what it is. Fire can unmake it.", "It's mutated. It burns."]
  };

  const day = minutes => Math.floor(minutes / 1440) + 1;
  const empty = () => ({objective:null, since:0, level:0, lastDay:0});

  // Call whenever the current objective is known; a new objective restarts the count.
  function track(state, objective, minutes) {
    if (state.objective !== objective) Object.assign(state, {objective, since:minutes, level:0});
    return state;
  }
  // Call when the player makes progress on the current objective.
  function progress(state, minutes) {
    state.since = minutes; state.level = 0;
    return state;
  }
  // Returns the hint text to show now, or null. At most one per calendar day.
  function next(state, minutes, table = hints) {
    const list = table[state.objective];
    if (!list || state.level >= list.length || minutes - state.since < stuckDays * 1440 || day(minutes) <= state.lastDay) return null;
    state.lastDay = day(minutes);
    return list[state.level++];
  }
  // Validates saved state; anything missing or invalid falls back to a fresh state (old saves have none).
  function restore(raw) {
    const ok = raw && typeof raw === "object" && (raw.objective === null || typeof raw.objective === "string") &&
      [raw.since, raw.level, raw.lastDay].every(n => Number.isFinite(n) && n >= 0) && Number.isInteger(raw.level) && Number.isInteger(raw.lastDay);
    return ok ? {objective:raw.objective, since:raw.since, level:raw.level, lastDay:raw.lastDay} : empty();
  }

  return {stuckDays, hints, empty, track, progress, next, restore};
})();
