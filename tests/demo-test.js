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
check("demo run starts in the cinema", s0.world.region === "cinema", s0.world.region);
check("bag has a spare battery", s0.player.bag.some(i => i.id === "battery" && i.qty >= 2));
const exitA = s0.world.objects.find(o => o.action === "travel" && o.active);
check("cinema exit points at the grotto", exitA?.id === "exit-cavern", exitA?.id);
check("no exit to Cold Vale", !s0.world.objects.some(o => o.id === "exit-coldvale" && o.active));

let s = s0;
Object.assign(s.player, {x: exitA.x, y: exitA.y - 1});
s.world.enemies.length = 0;
const there = Sim.travel(s, exitA);
check("cinema -> grotto works", there?.world.region === "cavern", s.notice?.text);
if (there) {
  const back = there.world.objects.find(o => o.id === "exit-cinema");
  check("grotto exit points at the cinema", Boolean(back));
  for (let i = 0; i < 600 && there.mode === "play"; i++) Sim.tick(there, .033, idle);
  const mid = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(there))));
  check("grotto save restores", mid?.world.region === "cavern" && mid.world.objects.some(o => o.id === "exit-cinema" && o.active));
  if (back) {
    Object.assign(there.player, {x: back.x, y: back.y - 1});
    const home = Sim.travel(there, back);
    check("grotto -> cinema works", home?.world.region === "cinema", there.notice?.text);
    if (home) for (let i = 0; i < 600 && home.mode === "play"; i++) Sim.tick(home, .033, idle);
  }
}
const snap = JSON.parse(JSON.stringify(Sim.snapshot(s0)));
check("demo save restores", Sim.restore(snap)?.world.region === "cinema");

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
