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
  // kind: clue (mandatory clue chain), event (story beat on a fixed day) or optional (resources, never a clue).
  const areas = {
    coldvale:{name:"Cold Vale", kind:"clue", from:1, clue:1},
    cinema:{name:"Cinema", kind:"clue", from:2},
    pineridge:{name:"Pine Ridge", kind:"clue", from:3, clue:2},
    eva:{name:"Eva leaves", kind:"event", from:5, to:5},
    ironworks:{name:"Ironworks", kind:"clue", from:6, weekdays:true},
    fathill:{name:"FatHill", kind:"clue", from:8, tide:true, clue:3},
    westfields:{name:"Westfields", kind:"clue", from:10, clue:4},
    cindergrotto:{name:"Cinder Grotto", kind:"clue", from:12, clue:5},
    amigo1:{name:"The first friend", kind:"clue", from:14, to:20},
    viragem:{name:"Patient zero", kind:"event", from:15, to:18},
    fortress:{name:"The fortress", kind:"clue", from:25},
    "opt.fuel":{name:"Petrol station", kind:"optional", from:7},
    "opt.clinic":{name:"Village clinic", kind:"optional", from:9},
    "opt.market":{name:"Market", kind:"optional", from:11, weekdays:true},
    "opt.farm":{name:"Farm", kind:"optional", from:13},
    "opt.marina":{name:"Marina", kind:"optional", from:21},
    "opt.school":{name:"Primary school", kind:"optional", from:22},
    "opt.station":{name:"Train station", kind:"optional", from:23},
    "opt.harvest":{name:"Farm harvest", kind:"optional", from:24}
  };

  const day = minutes => Math.floor(minutes / 1440) + 1;
  const weekday = d => weekdays[(d - 1 + firstWeekday) % 7];
  const isWeekday = d => (d - 1 + firstWeekday) % 7 < 5;
  const lowTide = d => d % tideDays === 0;

  // "" when the area can be visited on day d, otherwise a short English reason for the player.
  function closedReason(id, d) {
    const area = areas[id];
    if (!area) return "Unknown area.";
    if (d < area.from) return area.name + " opens on day " + area.from + ".";
    if (area.to !== undefined && d > area.to) return area.name + " is past. It closed after day " + area.to + ".";
    if (area.weekdays && !isWeekday(d)) return area.name + " is closed at the weekend. It reopens on Monday.";
    if (area.tide && !lowTide(d)) return "High tide covers the road to " + area.name + ". Low tide tomorrow.";
    return "";
  }
  const isOpen = (id, d) => closedReason(id, d) === "";
  const openOn = d => Object.keys(areas).filter(id => isOpen(id, d));

  return {length, areas, day, weekday, isWeekday, lowTide, closedReason, isOpen, openOn};
})();
