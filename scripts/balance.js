// Usage: node scripts/balance.js [runs per preset] [game directory] [days to simulate]
"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const [runs = "3", dir = "game", days = "2"] = process.argv.slice(2);
const size = Number(runs), horizon = Number(days);
if (!Number.isInteger(size) || size < 1 || !Number.isFinite(horizon) || horizon <= 0) {
  throw new Error("Use a positive integer run count and a positive day limit.");
}
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]).filter(file => !["view","game"].includes(file));
const source = files.map(file => fs.readFileSync(path.join(dir, file + ".js"), "utf8")).join("\n");
const context = vm.createContext({console, Math:Object.create(Math)});
vm.runInContext(source + "\nObject.assign(globalThis,{Sim,Data,World,Level});", context);
const {Sim, Data, World, Level} = context;
const use = (s, id) => Sim.use(s, s.player.bag.findIndex(item => item.id === id));

function bot(preset, seed) {
  context.Math.random = Level.seeded(seed);
  const s = preset === "recommended" ? Sim.createRecommended(seed, true) : Sim.createControl(preset, "carer", "shelter", undefined, {seed});
  if (preset !== "recommended" && Sim.difficultyOptions) s.difficultyOptions = Sim.difficultyOptions(s);
  const p = s.player, home = {...p}, start = s.minutes, searched = new Set();
  let firstFight, firstGuide, collected = 0, needsFailures = 0, unmet = false;
  let target = null;
  const houses = new Set(s.world.buildings.filter(b => b.type === "home").map(b => b.id));
  const bed = s.world.objects.find(o => o.action === "bed" && o.building === s.world.base.id);
  const door = s.world.base.door;
  const inside = () => World.tileAt(s.world,p.x,p.y)?.building === s.world.base.id;
  const headHome = run => {
    if (!inside() && (!p.path.length || run && !s.dash)) Sim.walkTo(s,bed.x,bed.y,run);
    if (inside() && door.open && Sim.reachableObject(s,door)) Sim.door(s,door);
  };
  const supplies = s.world.objects.filter(o => o.action === "loot" && o.loot?.length &&
    Sim.distance(home, o) <= 28);
  while (s.mode === "play" && s.minutes - start < horizon * 1440) {
    const danger = Sim.threats(s), enemy = Sim.attackTarget(s);
    if (enemy || p.hp < 100 && firstFight === undefined && danger.length) firstFight ??= s.elapsed;
    if (s.guideStep === 6) firstGuide ??= s.elapsed;
    if (p.wounds.some(w => !w.bandaged)) use(s, "bandage");
    if (p.hunger < 40) use(s, "food");
    if (p.hydration < 46) use(s, "water");
    if (!unmet && (!p.hunger || !p.hydration)) needsFailures++;
    unmet = !p.hunger || !p.hydration;
    if (enemy && danger.length < 3 && p.hp > 30) Sim.attack(s, enemy);
    else if (danger.length && (p.hp <= 30 || danger.length >= 3)) {
      target = null;
      headHome(true);
    } else if (s.guideStep >= 4 && s.guideStep <= 5 && !Sim.isNight(s)) {
      headHome(false);
    } else if (Sim.isNight(s) && p.fatigue >= 20 && bed) {
      if (Sim.reachableObject(s, bed)) { headHome(false); Sim.contextual(s, bed); }
      else if (!p.path.length) Sim.approach(s, bed);
    } else if (!p.path.length || target && Sim.reachableObject(s, target)) {
      if (target && Sim.reachableObject(s, target)) {
        collected += Sim.collectAll(s, target);
        if (Sim.weapon(s).id === "fists") use(s, "bat");
      }
      if (target) searched.add(target.id);
      const guidedSearch = s.guideStep === 2 || s.guideStep === 3;
      const candidates = supplies.filter(o => !searched.has(o.id) && o.loot.length && (!guidedSearch || houses.has(o.building)));
      if (guidedSearch) {
        candidates.sort((a,b) => Number(b.loot.some(item => item.id === "bandage")) - Number(a.loot.some(item => item.id === "bandage")) ||
          Sim.distance(p,a) - Sim.distance(p,b));
      } else candidates.sort((a,b) => Sim.distance(p,a) - Sim.distance(p,b));
      target = candidates[0] ?? null;
      if (target) Sim.approach(s, target);
      else if (Sim.distance(p,home) > 1) Sim.walkTo(s,home.x,home.y);
    }
    for (let i = 0; i < 4 && s.mode === "play"; i++) Sim.tick(s, .2);
  }
  const lived = s.minutes - start;
  return [preset,seed,(lived/1440).toFixed(3),s.mode === "dead" ? s.deathCause : "censored",
    firstFight?.toFixed(1) ?? "",s.mode === "dead" ? s.elapsed.toFixed(1) : "",s.kills,
    (collected / Math.max(lived / 60,.01)).toFixed(2),needsFailures,firstGuide?.toFixed(1) ?? ""];
}

console.log("preset,seed,days_survived,death_cause,first_fight_seconds,death_seconds,kills,items_per_game_hour,needs_failures,guide_complete_seconds");
for (const preset of ["recommended", ...Object.keys(Data.modes)]) {
  for (let i = 0; i < size; i++) console.log(bot(preset, 17 + i * 997).join(","));
}
