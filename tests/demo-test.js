// Demo layer test (docs/DEMO.md): cinema <-> grotto link, open gating, 30-minute clock, bug report mail. No browser.
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.resolve("game"), html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]).filter(f => f !== "view" && f !== "game");
const pascal = f => f.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");
let source = files.map(f => fs.readFileSync(path.join(dir, f + ".js"), "utf8").replace(/^"use strict";/, "") + `\n;globalThis.${pascal(f)}=${pascal(f)};\n`).join("");
source += "\nconst DEMO_CONFIG = {email:'bugs@example.com', version:'t', limitSeconds:1800};\n" +
  fs.readFileSync(path.resolve("demo/demo.js"), "utf8").replace(/^"use strict";/, "") + "\n;globalThis.Demo=Demo;";
const context = {console, Math, Date, JSON, structuredClone};
context.globalThis = context.window = context; vm.createContext(context); vm.runInContext(source, context);
const {Sim, Demo, Regions} = context;
let failures = 0;
const check = (name, ok, detail = "") => { if (!ok) { failures++; console.log("FAIL " + name + (detail ? " - " + detail : "")); } };
const idle = {x: 0, y: 0, run: false};

const s0 = Sim.createRecommended(12345);
check("demo run starts in Cold Vale", s0.world.region === "coldvale", s0.world.region);
check("bag has a spare battery", s0.player.bag.some(i => i.id === "battery"));
const live = w => w.objects.filter(o => o.kind === "exit" && o.active && o.action === "travel").map(o => o.id);
check("Cold Vale only leads to the cinema", live(s0.world).join() === "exit-cinema", live(s0.world).join());

function cross(s, exit, into) {
  s.world.enemies.length = 0;
  const side = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) => ({x: exit.x + dx, y: exit.y + dy}))
    .find(p => context.World.clear(s.world, p.x, p.y));
  Object.assign(s.player, side);
  const next = Sim.travel(s, exit);
  check("cross into " + into, next?.world.region === into, s.notice?.text);
  return next;
}
const cinema = cross(s0, s0.world.objects.find(o => o.id === "exit-cinema"), "cinema");
if (cinema) {
  check("cinema leads to town and grotto", live(cinema.world).sort().join() === "exit-cavern,exit-coldvale", live(cinema.world).join());
  const grotto = cross(cinema, cinema.world.objects.find(o => o.id === "exit-cavern"), "cavern");
  if (grotto) {
    check("grotto leads back to the cinema", live(grotto.world).join() === "exit-cinema", live(grotto.world).join());
    for (let i = 0; i < 600 && grotto.mode === "play"; i++) Sim.tick(grotto, .033, idle);
    const mid = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(grotto))));
    check("grotto save restores", mid?.world.region === "cavern");
    const back = cross(grotto, grotto.world.objects.find(o => o.id === "exit-cinema" && o.active), "cinema");
    if (back) for (let i = 0; i < 600 && back.mode === "play"; i++) Sim.tick(back, .033, idle);
  }
}
check("demo save restores", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s0))))?.world.region === "coldvale");

let stored = "1790";
const clock = Demo.clock(() => stored, v => { stored = v; });
clock.add(5); check("clock adds", stored === "1795", stored);
clock.add(100); check("clock stops at the limit", Number(stored) === 1800, stored);
check("minutes label", Demo.minutesLabel(125) === "2:05");
const url = Demo.mailto(Demo.report("it crashed & burned", ["Area: CINEMA"]));
check("mailto targets the configured address", url.startsWith("mailto:bugs@example.com?subject="), url.slice(0, 40));
check("mailto carries text and details", decodeURIComponent(url).includes("it crashed & burned") && decodeURIComponent(url).includes("Area: CINEMA"));
if (failures) { console.log(failures + " demo failure(s)"); process.exit(1); }
console.log("Tudo OK");
