"use strict";

// Campaign calendar (docs/HISTORIA.md sections 9 and 16). Pure data and functions: no DOM, no rng, no saved state.
// Everything is derived from the run's in-game minutes, so old saves need nothing new.
const Campaign = (() => {
  const length = 30;
  // Day 1 is a Friday, so day 6 (Ironworks) and day 11 (market) fall on weekdays and days 9-10 are a weekend.
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const firstWeekday = 4;
  // Low tide on even days, so FatHill is reachable on day 8 and every two days after.
  const tideDays = 2;

  // from/to: first and last day the area can be visited (to omitted = stays open). weekdays/tide: extra day rules.
  // hours: [open, close) in-game hours on open days. requires: items the player carries or clues already found.
  // kind: clue (mandatory clue chain), event (story beat on a fixed day) or optional (resources, never a clue).
  const areas = {
    coldvale:{name:"Cold Vale", kind:"clue", from:1, clue:1},
    cinema:{name:"Cinema", kind:"clue", from:2},
    pineridge:{name:"Pine Ridge", kind:"clue", from:3, clue:2},
    eva:{name:"Eva leaves", kind:"event", from:5, to:5},
    ironworks:{name:"Ironworks", kind:"clue", from:6, weekdays:true, hours:[8, 18],
      closed:{weekend:"The line computer keeps the Ironworks gates locked at weekends. They reopen on Monday.",
        hours:"Ironworks opens at 08:00. The line computer keeps the gates shut overnight."}},
    fathill:{name:"FatHill", kind:"clue", from:8, tide:true, clue:3},
    westfields:{name:"Westfields", kind:"clue", from:10, clue:4},
    cindergrotto:{name:"Cinder Grotto", kind:"clue", from:12, clue:5, requires:{items:["flashlight", "battery"], text:"a flashlight with batteries"}},
    amigo1:{name:"The first friend", kind:"clue", from:14, to:20, requires:{items:["foundrymaul"], text:"the Foundry maul from the Ironworks"}},
    viragem:{name:"Patient zero", kind:"event", from:15, to:18},
    fortress:{name:"The fortress", kind:"clue", from:25, requires:{clues:5}},
    "opt.fuel":{name:"Petrol station", kind:"optional", from:7},
    "opt.clinic":{name:"Village clinic", kind:"optional", from:9},
    "opt.market":{name:"Market", kind:"optional", from:11, weekdays:true, hours:[8, 18]},
    "opt.farm":{name:"Farm", kind:"optional", from:13},
    "opt.marina":{name:"Marina", kind:"optional", from:21},
    "opt.school":{name:"Primary school", kind:"optional", from:22},
    "opt.station":{name:"Train station", kind:"optional", from:23},
    "opt.harvest":{name:"Farm harvest", kind:"optional", from:24}
  };

  // Challenge graph (sections 9 and 16): the area that hosts each mandatory challenge, what it needs and what it grants.
  // "clue" is one partial coordinate; "start" items exist in the world from day 1. Checked for soft-locks by the tests.
  const start = ["flashlight", "battery"];
  const challenges = {
    "coldvale.houses":{area:"coldvale", grants:["clue"]},
    "cinema.statue":{area:"cinema", grants:["idol"]},
    "pineridge.two-nights":{area:"pineridge", days:2, grants:["clue"]},
    "eva.death":{area:"eva", grants:["diary"]},
    "ironworks.barricade":{area:"ironworks", grants:["strong-weapon"]},
    "fathill.bosses":{area:"fathill", grants:["clue"]},
    "westfields.stealth":{area:"westfields", grants:["clue"]},
    "cindergrotto.battery":{area:"cindergrotto", needs:["flashlight", "battery"], grants:["clue"]},
    "amigo1.lockdown-chat":{area:"amigo1", needs:["strong-weapon"], grants:["fortress-map"]},
    "viragem.zero":{area:"viragem", grants:["patient-zero"]},
    "fortress.last-boss":{area:"fortress", clues:5}
  };
  // Intended intensity per day (level-design pacing, 0..1): teach first, rest before each boss, no long run of peaks.
  // Later areas can drive spawn density from this table.
  const beats = [
    [1,"teach",.2],[2,"set-piece",.8],[3,"survive",.6],[4,"survive",.6],[5,"story",.3],[6,"challenge",.6],[7,"rest",.3],
    [8,"boss",.9],[9,"rest",.4],[10,"challenge",.7],[11,"rest",.3],[12,"challenge",.7],[13,"rest",.2],[14,"boss",1],
    [15,"story",.5],[16,"challenge",.5],[17,"challenge",.5],[18,"challenge",.5],[19,"challenge",.5],[20,"challenge",.5],
    [21,"rest",.3],[22,"challenge",.4],[23,"rest",.3],[24,"rest",.2],[25,"challenge",.7],[26,"rest",.3],[27,"challenge",.8],
    [28,"rest",.3],[29,"boss",1],[30,"rest",.2]
  ].map(([day,type,intensity]) => ({day,type,intensity}));

  // Game regions that belong to a campaign area (travel there follows the calendar). Other regions stay free.
  const regions = {coldvale:"coldvale", cinema:"cinema", ridge:"pineridge", ironworks:"ironworks", coast:"fathill", fields:"westfields", cavern:"cindergrotto", reservoir:"amigo1"};

  const day = minutes => Math.floor(minutes / 1440) + 1;
  const weekday = d => weekdays[(d - 1 + firstWeekday) % 7];
  const isWeekday = d => (d - 1 + firstWeekday) % 7 < 5;
  const lowTide = d => d % tideDays === 0;

  // "" when the area can be visited on day d (and hour, if given), otherwise a short English reason for the player.
  function closedReason(id, d, hour) {
    const area = areas[id];
    if (!area) return "Unknown area.";
    if (d < area.from) return area.name + " opens on day " + area.from + ".";
    if (area.to !== undefined && d > area.to) return area.name + " is past. It closed after day " + area.to + ".";
    if (area.weekdays && !isWeekday(d)) return area.closed?.weekend ?? area.name + " is closed at the weekend. It reopens on Monday.";
    if (area.tide && !lowTide(d)) return "High tide covers the road to " + area.name + ". Low tide tomorrow.";
    if (area.hours && hour !== undefined && (hour < area.hours[0] || hour >= area.hours[1]))
      return area.closed?.hours ?? area.name + " is shut for the night. It opens at " + String(area.hours[0]).padStart(2, "0") + ":00.";
    return "";
  }
  const isOpen = (id, d, hour) => closedReason(id, d, hour) === "";
  const openOn = (d, hour) => Object.keys(areas).filter(id => isOpen(id, d, hour));
  // Pre-requisites (HISTORIA.md section 16). have = {items:[ids carried], clues:number found}. "" when met.
  function missing(id, have = {}) {
    const need = areas[id]?.requires;
    if (!need) return "";
    const lacking = (need.items ?? []).filter(item => !(have.items ?? []).includes(item));
    if (lacking.length) return "You need " + (need.text ?? lacking.map(item => Data.items[item]?.name.toLowerCase() ?? item).join(" and ")) + " first.";
    if (need.clues && (have.clues ?? 0) < need.clues) return "The coordinates are incomplete: " + (have.clues ?? 0) + " of " + need.clues + ".";
    return "";
  }

  return {length, areas, regions, start, challenges, beats, day, weekday, isWeekday, lowTide, closedReason, isOpen, openOn, missing};
})();
