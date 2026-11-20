// Teste de desempenho/regressão do renderer SEM browser (usa um canvas simulado que conta operações).
// Uso:  node tests/render-test.js [pasta-do-jogo=game] [--quiet]
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const args = process.argv.slice(2).filter(a => a !== "--quiet"), quiet = process.argv.includes("--quiet");
const dir = path.resolve(args[0] || "game");
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]).filter(f => f !== "game");
const pascal = f => f.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");
const counts = {};
const mk = () => new Proxy({}, {
  get(t, k) { if (k in t) return t[k]; if (k === "canvas") return {width: 1280, height: 720}; if (k === "measureText") return () => ({width: 10});
    if (k === "createRadialGradient" || k === "createLinearGradient") return () => { counts[k] = (counts[k] || 0) + 1; return {addColorStop() {}}; };
    return () => { counts[k] = (counts[k] || 0) + 1; }; },
  set(t, k, v) { t[k] = v; return true; }});
const mkCanvas = () => ({width: 0, height: 0, getContext: () => mk(), getBoundingClientRect: () => ({width: 1280, height: 720}), style: {}, clientWidth: 160});
const worldCanvas = mkCanvas();
const context = {console, Math: Object.assign(Object.create(Math), {random: (() => { let s = 3; return () => (s = s * 16807 % 2147483647) / 2147483647; })()}), Date, JSON, structuredClone, devicePixelRatio: 1,
  ResizeObserver: class { observe() {} }, document: {getElementById: id => id === "world" ? worldCanvas : mkCanvas(), createElement: () => mkCanvas()}};
context.globalThis = context.window = context; vm.createContext(context);
let source = ""; for (const f of files) source += fs.readFileSync(path.join(dir, f + ".js"), "utf8").replace(/^"use strict";/, "") + `\n;globalThis.${pascal(f)}=${pascal(f)};\n`;
vm.runInContext(source, context);
const {Sim, View} = context;

let failures = 0;
const check = (name, ok, detail = "") => { if (!ok) failures++; if (ok && quiet) return; console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  [" + detail + "]" : "")); };
const reset = () => { for (const k of Object.keys(counts)) delete counts[k]; };
const per = (fn, n = 1) => { reset(); fn(n); return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / n])); };

const s = Sim.createControl("survival", "carer", "shelter"); View.prepare(s.world);
const home = s.world.buildings.find(b => b.compact);
const corner = home && context.World.tileAt(s.world, home.x, home.y);
check("paredes: o canto liga as duas paredes sem sobressair",
  corner?.wallOutline.some(([x]) => x === 1) &&
  corner.wallOutline.some(([, y]) => y === 1) &&
  corner.wallOutline.every(([x, y]) => x > 0 && y > 0));
const first = per(() => View.render(s, 0, 1 / 60));
const steady = per(n => { for (let i = 0; i < n; i++) View.render(s, i / 60, 1 / 60); }, 10);
s.fastGround = false; const classic = per(n => { for (let i = 0; i < n; i++) View.render(s, i / 60, 1 / 60); }, 10); s.fastGround = true;
check("chão em cache: frames estáveis não reconstroem blocos", (steady.setTransform || 0) <= 3, "setTransform/frame " + (steady.setTransform || 0).toFixed(1));
check("chão em cache: frame estável faz < 40 % dos polígonos do modo clássico", steady.fill < classic.fill * .4, Math.round(steady.fill) + " vs " + Math.round(classic.fill) + " polígonos/frame");
check("chão em cache: o primeiro frame constrói blocos", (first.setTransform || 0) > 5, (first.setTransform || 0) + " blocos");
const w = s.world, px = Math.floor(s.player.x), py = Math.floor(s.player.y);
for (let y = py - 3; y <= py + 3; y++) for (let x = px - 3; x <= px + 3; x++) w.explored[y * w.width + x] = 1;
const after = per(() => View.render(s, 0, 1 / 60));
check("chão em cache: explorar 7×7 tiles só refaz poucos blocos", (after.setTransform || 0) <= 8, (after.setTransform || 0) + " transformações");
const mode = s.mode; s.mode = "menu"; let err = null; try { View.render(s, 0, 1 / 60); View.render(s, 0, 1 / 60); } catch (e) { err = e.message; } s.mode = mode;
check("menu: desenha sem erros", err === null, err ?? "");
const hop = (st, id) => { const e = st.world.objects.find(o => o.id === "exit-" + id); Object.assign(st.player, {x: e.x, y: e.y + (e.y > st.world.height / 2 ? -1 : 1)}); for (const z of st.world.enemies) z.hp = 0; return Sim.travel(st, e) ?? st; };
for (const [host, deep] of [["ridge", "cavern"], ["ironworks", "quarry"], ["fields", "reservoir"], ["coast", "lighthouse"]]) {
  let st = s; err = null; try { st = hop(hop(st, host), deep); View.prepare(st.world); for (let i = 0; i < 5; i++) { Sim.tick(st, .05, {x: 1, y: 0, run: false}); View.render(st, i / 60, 1 / 60); } } catch (e) { err = e.message; }
  check("região " + deep + ": desenha sem erros", err === null && st.world.region === deep, err ?? st.world.region); }
const mm = {width: 160, height: 160, getContext: () => mk(), clientWidth: 160};
for (let i = 0; i < w.explored.length; i++) if (i % 5 < 2) w.explored[i] = 1;
const m1 = per(() => View.minimap(mm, s)), m2 = per(n => { for (let i = 0; i < n; i++) View.minimap(mm, s); }, 5);
check("minimapa: repetições não redesenham os tiles", (m2.fillRect || 0) <= 2 && m1.fillRect > 100, Math.round(m1.fillRect) + " → " + (m2.fillRect || 0) + " fillRect");
// ---- visual "Dark pixel" (v0.30): mundo a baixa resolução + tom escuro + micro detalhe/sangue em cache ----
{ const d = Sim.createControl("survival", "carer", "shelter"); View.prepare(d.world); d.look = "dark"; let e = null;
  try { for (let i = 0; i < 6; i++) View.render(d, i / 60, 1 / 60); } catch (x) { e = x.stack.split("\n").slice(0, 2).join(" | "); }
  check("dark pixel: desenha sem erros", e === null, e ?? "");
  const dsteady = per(n => { for (let i = 0; i < n; i++) View.render(d, i / 60, 1 / 60); }, 10);
  check("dark pixel: frame estável não reconstrói blocos", (dsteady.setTransform || 0) < 12, (dsteady.setTransform || 0).toFixed(1) + " setTransform/frame");
  check("dark pixel: usa um buffer de baixa resolução (drawImage do buffer)", (dsteady.drawImage || 0) >= 1, (dsteady.drawImage || 0) + " drawImage/frame");
  const ww = d.world, cx = Math.floor(d.player.x), cy = Math.floor(d.player.y);
  for (let y = cy - 3; y <= cy + 3; y++) for (let x = cx - 3; x <= cx + 3; x++) ww.explored[y * ww.width + x] = 1;
  const rebuilt = per(() => View.render(d, 0, 1 / 60));
  check("dark pixel: explorar refaz poucos blocos", (rebuilt.setTransform || 0) < 30, (rebuilt.setTransform || 0) + " transformações");
  d.world.objects.push({id: "built9001", x: d.player.x + 2, y: d.player.y + 1, kind: "drop", name: "Fallen infected", active: true, solid: false, action: "loot", searched: true, corpse: true, died: 0, loot: []});
  e = null; try { View.render(d, 0, 1 / 60); } catch (x) { e = x.message; } check("dark pixel: cadáver com poça de sangue desenha sem erros", e === null, e ?? "");
  d.look = "fast"; e = null; try { View.render(d, 0, 1 / 60); View.minimap({width: 160, height: 160, getContext: () => mk(), clientWidth: 160}, d); } catch (x) { e = x.message; }
  check("dark pixel: voltar a Fast/Classic e desenhar o minimapa funciona (contexto restaurado)", e === null, e ?? ""); }
if (!quiet) console.log("\nOperações por frame (jogo parado): " + Math.round(Object.values(steady).reduce((a, b) => a + b, 0)) + " (clássico: " + Math.round(Object.values(classic).reduce((a, b) => a + b, 0)) + ")");
console.log(failures ? "\n" + failures + " FALHA(S)" : "\nTudo OK");
process.exit(failures ? 1 : 0);
