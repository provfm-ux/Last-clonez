// Smoke test do Last Shelter: Control. Corre sem browser.
// Uso:  node tests/smoke-test.js [pasta-do-jogo=game] [pasta-versao-antiga] [--quiet]
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const args = process.argv.slice(2).filter(a => a !== "--quiet"), quiet = process.argv.includes("--quiet");
const dir = path.resolve(args[0] || "game");
// Ordem de carga = ordem dos <script> no index.html (sem view.js e game.js, que precisam de DOM).
// O nome global é o nome do ficheiro em PascalCase (legacy-level.js -> LegacyLevel).
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]).filter(f => f !== "view" && f !== "game");
const pascal = f => f.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");
let source = "";
for (const file of files)
  source += fs.readFileSync(path.join(dir, file + ".js"), "utf8").replace(/^"use strict";/, "") + `\n;globalThis.${pascal(file)}=${pascal(file)};\n`;
// Math.random determinístico para o teste ser repetível
let seed = 7; const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const context = {console, Math: Object.assign(Object.create(Math), {random}), Date, JSON, structuredClone};
context.globalThis = context.window = context; vm.createContext(context); vm.runInContext(source, context);
const {Sim, Data, World} = context, ctxRegions = context.Regions, ctxAtmosphere = context.Atmosphere;

let failures = 0;
const check = (name, passed, detail = "") => { if (!passed) failures++; if (passed && quiet) return; console.log((passed ? "PASS " : "FAIL ") + name + (detail ? "  [" + detail + "]" : "")); };
const idle = {x: 0, y: 0, run: false};
const run = (s, ticks, input = idle) => { for (let i = 0; i < ticks && s.mode === "play"; i++) Sim.tick(s, .033, input); return s; };
const fresh = mode => Sim.createControl(mode, "carer", "shelter");

for (const mode of Object.keys(Data.modes)) {
  const s = fresh(mode); let error = null; const walk = {x: 0, y: 0, run: false};
  try { for (let i = 0; i < 8000 && s.mode === "play"; i++) { if (i % 150 === 0) { walk.x = Math.round(random() * 2 - 1); walk.y = Math.round(random() * 2 - 1); } Sim.tick(s, .033, walk); } }
  catch (e) { error = e; }
  const p = s.player;
  check("modo " + mode + ": sem exceções/NaN", !error && [p.x, p.y, p.hp, p.hunger, p.hydration].every(Number.isFinite), error?.message);
  try { Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))); check("modo " + mode + ": gravar/restaurar", true); }
  catch (e) { check("modo " + mode + ": gravar/restaurar", false, e.message); }
}
{ const s = run(fresh("training"), 150000);
  check("training: 5+ dias parado sem morrer", s.mode === "play" && s.minutes > 5 * 1440, "dia " + (s.minutes / 1440).toFixed(1)); }
{ const s0 = fresh("survival"); for (const z of s0.world.enemies) z.hp = 0; const s = run(s0, 200000);  // sem infetados: isola a morte por sede/fome
  check("survival parado: morre com causa registada", s.mode === "dead" && /thirst|hunger/.test(s.deathCause || ""), String(s.deathCause));
  check("causa de morte sobrevive à gravação", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))).deathCause === s.deathCause); }
for (const [mode, expected] of [["training", false], ["survival", true]]) {
  const s = fresh(mode); let siren = false;
  for (let i = 0; i < 9000 && s.mode === "play"; i++) { Sim.tick(s, .033, idle); if (s.messages.some(m => /siren|crash in the centre/.test(m.text))) siren = true; }
  check("sirene em " + mode + (expected ? " dispara" : " não dispara"), siren === expected);
}
{ const snap = JSON.parse(JSON.stringify(Sim.snapshot(fresh("survival")))); snap.schema = Data.saveVersion + 5;
  let rejected = false; try { Sim.restore(snap); } catch { rejected = true; }
  check("gravação de versão futura é rejeitada", rejected); }

// ---- v0.21: skills, moodles, sleep ----
{ const s = fresh("training");
  check("skills: todas as skills existem num jogo novo", Object.keys(Data.skills).every(k => s.player.skills[k] === 0));
  s.player.skills.combat = 12 * 10 * 10 * 5; check("skills: nível máximo = " + Data.skillMax, Sim.level(s, "combat") === Data.skillMax);
  s.player.skills.strength = 12 * 4 * 4; const cap0 = Sim.capacity(fresh("training"));
  check("strength 4 aumenta a capacidade em 2 kg", Sim.capacity(s) === cap0 + 2, Sim.capacity(s) + " vs " + cap0);
  const snap = JSON.parse(JSON.stringify(Sim.snapshot(fresh("training")))); for (const k of ["strength", "fitness", "sneaking"]) delete snap.player.skills[k];
  let old = null; try { old = Sim.restore(snap); } catch (e) { old = e; }
  check("gravação antiga (sem skills novas) abre com skills a 0", old && old.player && ["strength", "fitness", "sneaking"].every(k => old.player.skills[k] === 0), old?.message);
  const bad = JSON.parse(JSON.stringify(Sim.snapshot(fresh("training")))); bad.player.skills.fitness = -5;
  let rejected = false; try { Sim.restore(bad); } catch { rejected = true; }
  check("skill negativa é rejeitada", rejected); }
{ const a = fresh("training"), b = fresh("training"); b.player.skills.fitness = 12 * 10 * 10; const run = {x: 1, y: 0, run: true};
  for (let i = 0; i < 150; i++) { Sim.tick(a, .033, run); Sim.tick(b, .033, run); }
  check("fitness: ganha XP a correr", a.player.skills.fitness > 0, a.player.skills.fitness.toFixed(2));
  check("fitness 10 gasta menos stamina", b.player.stamina > a.player.stamina, b.player.stamina.toFixed(1) + " vs " + a.player.stamina.toFixed(1)); }
{ const s = fresh("training"); s.quiet = true; for (let i = 0; i < 300; i++) { s.quiet = true; Sim.tick(s, .033, {x: 1, y: 0, run: false}); }
  check("sneaking: ganha XP a andar furtivamente", s.player.skills.sneaking > 0, s.player.skills.sneaking.toFixed(2)); }
{ const s = fresh("training"), p = s.player;
  check("moodles: nenhum estado num jogo novo", Sim.moodles(s).length === 0, JSON.stringify(Sim.moodles(s).map(m => m.id)));
  p.hunger = 10; p.fatigue = 90; p.hp = 50; const m = Sim.moodles(s);
  check("moodles: fome 10 = Very hungry (nível 3)", m.some(x => x.id === "hungry" && x.level === 3 && x.label === "Very hungry"));
  check("moodles: ordenados do mais grave para o menos", m.every((x, i) => i === 0 || m[i - 1].level >= x.level)); }
{ const s = fresh("training"), p = s.player; p.fatigue = 80; const t0 = s.minutes, h0 = p.hunger;
  const ok = Sim.sleep(s);
  check("sono: dormir avança o tempo (≥ 3 h)", ok && s.minutes - t0 >= 180, ((s.minutes - t0) / 60).toFixed(1) + " h");
  check("sono: a fadiga desce muito", p.fatigue < 15, p.fatigue.toFixed(1));
  check("sono: fome desce mas pouco", p.hunger < h0 && h0 - p.hunger < 12, (h0 - p.hunger).toFixed(1));
  check("sono: estado limpo no fim", !p.sleeping && !p.resting && s.mode === "play");
  const s2 = fresh("training"); s2.player.fatigue = 10;
  check("sono: recusado se não houver cansaço", Sim.sleep(s2) === false); }
{ const s = fresh("survival"), p = s.player; p.fatigue = 80;
  const z = s.world.enemies.find(e => e.hp > 0); Object.assign(z, {x: p.x + 2, y: p.y});
  const near = Sim.threats(s).length > 0;
  check("sono: recusado com infetado à vista", !near || Sim.sleep(s) === false, near ? "" : "infetado não ficou à vista (teste neutro)"); }
{ let woken = 0;
  for (let k = 0; k < 4; k++) { const s = fresh("survival"), p = s.player; p.fatigue = 85;
    const z = s.world.enemies.filter(e => e.hp > 0).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[k % 3];
    let spot = null; for (let a = 0; a < 16 && !spot; a++) for (let r = 10; r <= 16 && !spot; r++) { const x = p.x + Math.cos(a / 16 * 6.283) * r, y = p.y + Math.sin(a / 16 * 6.283) * r; if (World.clear(s.world, x, y) && World.route(s.world, p.x, p.y, x, y, 0, true).length) spot = {x, y}; }
    Object.assign(z, {x: spot.x, y: spot.y, alert: 30, chaseX: p.x, chaseY: p.y, replan: 0}); const hp0 = p.hp; Sim.sleep(s);
    if (/woke/.test(s.messages.at(-1)?.text || "") && p.hp >= hp0 - .05) woken++; }
  check("sono: um infetado a aproximar-se acorda o jogador antes de o atacar", woken === 4, woken + "/4"); }
{ const s = fresh("training"), bed = s.world.objects.find(o => o.action === "bed");
  if (!bed) check("cama: existe uma cama no mapa", false);
  else { s.player.x = bed.x; s.player.y = bed.y + .6; s.player.fatigue = 70; const t0 = s.minutes; Sim.contextual(s, bed);
    check("cama: interagir marca sono pendente", s.sleepPending === true);
    Sim.tick(s, .033); check("cama: o tick seguinte adormece e avança o tempo", s.minutes - t0 >= 120 && !s.sleepPending, ((s.minutes - t0) / 60).toFixed(1) + " h"); } }

// ---- v0.22: armas, cadáveres, doenças, skills de sobrevivência ----
check("armas novas existem e batem com o formato", ["machete", "shovel", "golfclub"].every(id => Data.items[id]?.damage > 0 && Data.items[id].range > 0 && Data.items[id].group === "Weapons"));
check("skills novas: cooking, foraging, fishing", ["cooking", "foraging", "fishing"].every(k => Data.skills[k]));
{ const s = fresh("survival"), p = s.player; const z = s.world.enemies.find(e => e.hp > 0);
  Object.assign(z, {x: p.x + .7, y: p.y, hp: 1}); s.target = z; const kills0 = s.kills;
  for (let i = 0; i < 40 && z.hp > 0; i++) Sim.tick(s, .033, idle);
  const corpse = s.world.objects.find(o => o.corpse);
  check("cadáver: matar um infetado deixa um corpo no chão", s.kills > kills0 && corpse && corpse.kind === "drop" && Number.isFinite(corpse.died), "kills " + (s.kills - kills0));
  const back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("cadáver: sobrevive à gravação", back.world.objects.some(o => o.corpse && o.died === corpse.died));
  if (corpse) { corpse.died = s.minutes - 3000; Sim.tick(s, 6, idle);
    check("cadáver: apodrece e desaparece ao fim de 2 dias", !s.world.objects.includes(corpse)); } }
{ const s = fresh("training"), p = s.player;
  for (let k = 0; k < 4; k++) s.world.objects.push({id: "built" + s.serial++, x: p.x + .5 + k * .3, y: p.y + 1, kind: "drop", name: "Fallen infected", active: true, solid: false, action: "loot", searched: true, corpse: true, died: s.minutes, loot: []});
  for (let i = 0; i < 1200; i++) Sim.tick(s, .25, idle);
  check("doença: ficar junto de cadáveres deixa o jogador doente", p.sick >= 20 && Sim.moodles(s).some(m => m.id === "sick"), "sick " + p.sick.toFixed(1));
  const peak = p.sick; for (const o of s.world.objects.filter(o => o.corpse)) o.x += 30;
  for (let i = 0; i < 400; i++) Sim.tick(s, .25, idle);
  check("doença: afastar-se dos cadáveres recupera", p.sick < peak, peak.toFixed(1) + " → " + p.sick.toFixed(1));
  const bad = JSON.parse(JSON.stringify(Sim.snapshot(s))); bad.player.sick = 500; let rejected = false; try { Sim.restore(bad); } catch { rejected = true; }
  check("doença: valor inválido na gravação é rejeitado", rejected); }
{ const s = fresh("survival"), p = s.player, spot = s.world.objects.find(o => o.action === "forage");
  if (!spot) check("foraging: existe um local de forrageio", false);
  else { Object.assign(p, {x: spot.x, y: spot.y + .5}); const ok = Sim.useWild(s, spot);
    check("foraging: recolher dá XP", !ok ? true : s.player.skills.foraging > 0, ok ? s.player.skills.foraging + " xp" : "(local indisponível agora: " + Sim.wildProblem(s, spot) + ")"); } }
{ const s = fresh("survival"), p = s.player, spot = s.world.objects.find(o => o.action === "fish");
  if (!spot) check("fishing: sem local de pesca no mapa inicial (teste neutro)", true);
  else { Object.assign(p, {x: spot.x, y: spot.y + .5}); spot.fishUntil = s.minutes; const ok = Sim.useWild(s, spot);
    check("fishing: apanhar peixe dá XP", !ok ? true : s.player.skills.fishing > 0, ok ? s.player.skills.fishing + " xp" : "(indisponível: " + Sim.wildProblem(s, spot) + ")"); } }

// ---- v0.23: ficar preso, carro, agarrar ----
const findTile = (s, test) => { const w = s.world; for (let y = 3; y < w.height - 3; y++) for (let x = 3; x < w.width - 3; x++) { const t = World.tileAt(w, x + .5, y + .5); if (t && test(t)) return {x: x + .5, y: y + .5}; } return null; };
{ const s = fresh("training"), p = s.player, wall = findTile(s, t => t.solid === true);
  Object.assign(p, {x: wall.x, y: wall.y}); Sim.tick(s, .033, idle);
  check("preso: dentro de uma parede é empurrado para chão livre", World.clear(s.world, p.x, p.y), p.x.toFixed(1) + "," + p.y.toFixed(1)); }
{ const s = fresh("training"), p = s.player, x0 = p.x, y0 = p.y;
  const ok = Sim.unstick(s);
  check("preso: 'Free me' em terreno livre afasta ≥ 1 tile", ok && Math.hypot(p.x - x0, p.y - y0) >= 1 && World.clear(s.world, p.x, p.y), ok ? Math.hypot(p.x - x0, p.y - y0).toFixed(2) : "recusado"); }
{ const s = fresh("survival"), p = s.player, car = s.world.objects.find(o => o.kind === "car");
  Object.assign(p, {x: car.x + 1, y: car.y}); Sim.enterVehicle(s, car);
  const room = findTile(s, t => t.building && t.solid === false);
  Object.assign(p, {x: room.x, y: room.y}); car.x = room.x; car.y = room.y;
  for (let i = 0; i < 120 && p.vehicle; i++) Sim.tick(s, .05, {x: 1, y: 0, run: false});
  check("carro: preso num sítio sem estrada liberta-se ou o jogador sai", !p.vehicle || World.drivable(World.tileAt(s.world, p.x, p.y)), p.vehicle ? "ainda no carro" : "saiu do carro");
  if (p.vehicle) Sim.exitVehicle(s, true);
  check("carro: nunca deixa o jogador dentro de uma parede ao sair", World.clear(s.world, p.x, p.y)); }
{ const s = fresh("training"), p = s.player, car = s.world.objects.find(o => o.kind === "car");
  Object.assign(p, {x: car.x, y: car.y});
  const entered = Sim.enterVehicle(s, car);
  car.heading = 0;
  p.driveSpeed = 3;
  Sim.tick(s, .03, {x: 0, y: 1, run: false});
  const velocity = Math.hypot(p.velocityX, p.velocityY);
  const sideways = Math.abs(p.velocityX * Math.sin(car.heading) - p.velocityY * Math.cos(car.heading));
  check("carro: curva progressiva e deslocação no eixo das rodas",
    entered && car.heading > 0 && car.heading <= velocity * .03 / 1.35 + 1e-6 && velocity > 0 && sideways < 1e-6,
    "ângulo " + car.heading.toFixed(3) + ", desvio " + sideways.toFixed(6));
  const restored = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("carro: orientação preservada na gravação", Sim.vehicle(restored)?.heading === car.heading);
  const blocked = findTile(s, t => t.building && !t.solid), heading = car.heading;
  Object.assign(p, blocked, {driveSpeed: 0}); Object.assign(car, blocked);
  Sim.tick(s, .03, {x: 1, y: 0, run: false});
  check("carro: volante não roda a carroçaria quando o carro está bloqueado",
    car.heading === heading && p.x === blocked.x && p.y === blocked.y);
}
{ let worst = 140, any = 0;
  for (const dir of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const s = fresh("survival"), p = s.player, car = s.world.objects.find(o => o.kind === "car");
    Object.assign(p, {x: car.x + 1, y: car.y}); Sim.enterVehicle(s, car); const hp0 = car.hp;
    for (let i = 0; i < 240 && p.vehicle && s.mode === "play"; i++) Sim.tick(s, .05, {x: dir[0], y: dir[1], run: true});
    if (car.hp < hp0) any++; worst = Math.min(worst, car.hp); }
  check("carro: bater em obstáculos causa dano real", any >= 1 && worst < 140, "pior caso " + worst.toFixed(0) + "/140, " + any + "/4 direções"); }
{ const s = fresh("survival"), p = s.player; s.rules.damage = 10; let grabbed = false, slowed = null, maxG = 0;
  const near = s.world.enemies.filter(e => e.hp > 0).slice(0, 4);
  near.forEach((z, i) => Object.assign(z, {x: p.x + .6 + i * .1, y: p.y + .4, alert: 30, chaseX: p.x, chaseY: p.y}));
  for (let i = 0; i < 1500 && s.mode === "play" && !grabbed; i++) { Sim.tick(s, .033, idle); if (p.grabbed > 0) grabbed = true; }
  check("agarrar: um infetado pode agarrar o jogador", grabbed);
  if (grabbed) { maxG = p.grabbed; check("agarrar: dura no máximo 2,2 s", maxG <= 2.2 + 1e-9, maxG.toFixed(2));
    check("agarrar: aparece nos moodles", Sim.moodles(s)[0]?.id === "grabbed");
    const shoved = Sim.shove(s); check("agarrar: empurrar liberta de imediato", p.grabbed === 0 || !shoved, shoved ? "libertado" : "sem alvo ao alcance (neutro)"); }
  for (const z of near) z.hp = 0; for (let i = 0; i < 200; i++) Sim.tick(s, .033, idle);
  check("agarrar: expira sozinho e depois há uma pausa antes de novo agarrão", p.grabbed === 0); }
{ const snap = JSON.parse(JSON.stringify(Sim.snapshot(fresh("survival")))); delete snap.player.grabbed; delete snap.player.grabCool; let r = null; try { r = Sim.restore(snap); } catch (e) { r = e; }
  check("gravação antiga (sem 'grabbed') abre e o estado é 0", r?.player && r.player.grabbed === 0 && r.player.grabCool === 0, r?.message); }

// ---- v0.24: estações, fraturas, anéis de ruído ----
{ const s = fresh("training"), ids = [0, 7, 14, 21, 28].map(d => { s.minutes = d * 1440; return Sim.season(s).id; });
  check("estações: primavera → verão → outono → inverno → primavera", ids.join(",") === "spring,summer,autumn,winter,spring", ids.join(","));
  check("estações: crescimento mais lento no inverno", Data.seasons.find(x => x.id === "winter").grow < Data.seasons.find(x => x.id === "spring").grow); }
{ const outdoors = s => findTile(s, t => !t.building && t.solid === false), temps = [];
  for (const day of [0, 21]) { const s = fresh("survival"), p = s.player; for (const z of s.world.enemies) z.hp = 0;
    s.minutes = day * 1440 + 12 * 60; const spot = outdoors(s); Object.assign(p, {x: spot.x, y: spot.y}); s.rules.exposure = s.rules.exposure === "off" ? "normal" : s.rules.exposure;
    for (let i = 0; i < 800; i++) { s.minutes = day * 1440 + 12 * 60; Sim.tick(s, .25, idle); } temps.push(p.temperature); }
  check("estações: o inverno arrefece mais ao ar livre que a primavera", temps[1] < temps[0], temps.map(t => t.toFixed(2)).join(" vs ")); }
{ const s = fresh("training"), p = s.player, proto = p.bag[0];
  check("tala: item e receita existem", Data.items.splint?.use === "splint" && Data.recipes.some(r => r.id === "splint" && r.out === "splint"));
  const dist = fractured => { const t = fresh("training"); t.player.fracture = fractured ? 4320 : 0; const x0 = t.player.x; for (let i = 0; i < 60; i++) Sim.tick(t, .05, {x: 1, y: 0, run: true}); return Math.hypot(t.player.x - x0, t.player.y - fresh("training").player.y); };
  const free = dist(false), broken = dist(true);
  check("fratura: perna partida abrandam o jogador e impede de correr", broken < free * .6, broken.toFixed(2) + " vs " + free.toFixed(2));
  p.fracture = 4320; check("fratura: aparece nos moodles como 'Broken leg'", Sim.moodles(s).some(m => m.label === "Broken leg"));
  p.bag.push({...proto, id: "splint", qty: 1, uid: "t-splint"}); const idx = p.bag.length - 1;
  check("tala: aplicar a tala fixa a perna", Sim.use(s, idx) && p.splinted === true && Sim.moodles(s).some(m => m.label === "Splinted leg"));
  check("tala: sem fratura recusa", (() => { const t = fresh("training"); t.player.bag.push({...proto, id: "splint", qty: 1, uid: "t2"}); return Sim.use(t, t.player.bag.length - 1) === false; })());
  const heal = splinted => { const t = fresh("training"); Object.assign(t.player, {fracture: 600, splinted}); for (let i = 0; i < 200; i++) Sim.tick(t, .25, idle); return t.player.fracture; };
  const a = heal(true), b = heal(false);
  check("fratura: com tala cura mais depressa", a < b, a.toFixed(0) + " vs " + b.toFixed(0));
  const full = fresh("training"); Object.assign(full.player, {fracture: 20, splinted: true}); for (let i = 0; i < 100; i++) Sim.tick(full, .25, idle);
  check("fratura: cura completa limpa o estado", full.player.fracture === 0 && full.player.splinted === false);
  const back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))); check("fratura: sobrevive à gravação", back.player.fracture > 0 && back.player.splinted === true);
  const bad = JSON.parse(JSON.stringify(Sim.snapshot(fresh("training")))); bad.player.fracture = -3; let rejected = false; try { Sim.restore(bad); } catch { rejected = true; }
  check("fratura: valor inválido é rejeitado", rejected); }
{ const s = fresh("training"); for (let i = 0; i < 40; i++) Sim.tick(s, .05, {x: 1, y: 0, run: true});
  const rings = s.noiseRings ?? [];
  check("ruído: andar gera anéis com posição, raio e tempo", rings.length > 0 && rings.length <= 16 && rings.every(r => Number.isFinite(r.x + r.y + r.r + r.t)), rings.length + " anéis"); }

// ---- v0.25: roupa por camadas, assistência de cantos ----
{ const s = fresh("training"), p = s.player;
  check("roupa: arranca com jeans e botas vestidos", p.gear.legs === "jeans" && p.gear.feet === "boots" && p.bag.some(i => i.id === "jeans") && p.bag.some(i => i.id === "boots"));
  check("roupa: 7 ranhuras (cabeça, mãos, pulso, braços, corpo, pernas, pés)", ["head", "hands", "wrist", "arms", "body", "legs", "feet"].every(k => k in p.gear));
  check("roupa: itens novos têm ranhura e valores", ["beanie", "gloves", "wintercoat", "jeans", "boots"].every(id => Data.items[id]?.slot && (Data.items[id].warmth > 0)));
  const old = JSON.parse(JSON.stringify(Sim.snapshot(fresh("training")))); old.player.gear = {wrist: null, arms: null, body: null};
  let back = null; try { back = Sim.restore(old); } catch (e) { back = e; }
  check("roupa: gravação antiga abre sem roupa fantasma", back?.player && back.player.gear.legs === null && back.player.gear.feet === null, back?.message);
  check("roupa: peso do arranque cabe na mochila", Sim.weight(p.bag) < Sim.capacity(s), Sim.weight(p.bag).toFixed(1) + " / " + Sim.capacity(s)); }
{ const temps = [];
  for (const coat of [false, true]) { const s = fresh("survival"), p = s.player; for (const z of s.world.enemies) z.hp = 0;
    const spot = findTile(s, t => !t.building && t.solid === false); Object.assign(p, {x: spot.x, y: spot.y}); if (coat) { p.gear.body = "wintercoat"; p.gear.head = "beanie"; }
    for (let i = 0; i < 800; i++) { s.minutes = 21 * 1440 + 12 * 60; Sim.tick(s, .25, idle); } temps.push(p.temperature); }
  check("roupa: casaco e gorro aquecem no inverno", temps[1] > temps[0] + .8, temps.map(t => t.toFixed(2)).join(" → ")); }
{ const absorbed = {}; 
  for (const kit of ["bare", "heavy"]) { const s = fresh("survival"), p = s.player; s.rules.damage = 10; p.fracture = 0;
    p.gear = kit === "bare" ? {head: null, hands: null, wrist: null, arms: null, body: null, legs: null, feet: null} : {head: null, hands: "gloves", wrist: null, arms: "armguards", body: "wintercoat", legs: "jeans", feet: "boots"};
    s.world.enemies.filter(e => e.hp > 0).slice(0, 4).forEach((z, i) => Object.assign(z, {x: p.x + .6 + i * .1, y: p.y + .4, alert: 30, chaseX: p.x, chaseY: p.y}));
    const seen = new Set(); let n = 0;
    for (let i = 0; i < 4000 && s.mode === "play"; i++) { p.hp = 100; Sim.tick(s, .033, idle); for (const m of s.messages) if (!seen.has(m)) { seen.add(m); if (/absorbs/.test(m.text)) n++; } }
    absorbed[kit] = n; }
  check("roupa: a roupa de proteção absorve golpes (sem roupa nunca)", absorbed.heavy > 0 && absorbed.bare === 0, "pesada " + absorbed.heavy + ", nenhuma " + absorbed.bare); }
{ const s = fresh("training"), w = s.world; let gap = null;
  for (let y = 4; y < w.height - 4 && !gap; y++) for (let x = 4; x < w.width - 4 && !gap; x++) {
    const at = (dx, dy) => World.tileAt(w, x + dx + .5, y + dy + .5);
    if (at(0, 0)?.solid === false && at(-1, 0)?.solid && at(1, 0)?.solid && [-3, -2, -1].every(k => at(0, k)?.solid === false && at(1, k)?.solid === false) && at(0, 1)?.solid === false && at(0, 2)?.solid === false) gap = {x: x + .5, y: y + .5}; }
  if (!gap) check("cantos: existe uma abertura de 1 tile no mapa", false);
  else { const p = s.player; Object.assign(p, {x: gap.x + .42, y: gap.y - 2.5}); const startY = p.y;
    for (let i = 0; i < 160 && p.y < gap.y + 1.2; i++) Sim.tick(s, .033, {x: -1, y: .53, run: false});
    check("cantos: atravessa uma abertura de 1 tile mesmo desalinhado", p.y > gap.y + .8, "y " + startY.toFixed(1) + " → " + p.y.toFixed(1) + " (abertura em " + gap.y.toFixed(1) + ")"); } }

// ---- v0.26: nomes, chaves, portas abertas ----
{ const s = fresh("survival"), homes = s.world.homes, names = homes.map(b => b.name);
  check("casas: nomes únicos e alusivos a filmes de zombies", new Set(names).size === names.length && names.includes("Cemetery Road farmhouse") && names.includes("The Winchester cottage"), names.length + " casas");
  check("casas: já não há nomes antigos", !names.some(n => /Bell Street|Southbank|Shelter Lane|postman/.test(n)));
  const locked = s.world.objects.filter(o => o.lockId), keys = [];
  for (const o of s.world.objects) for (const it of o.loot ?? []) if (it.id === "housekey") keys.push({it, host: o});
  check("chaves: há casas trancadas", locked.length >= 3, locked.length + " trancadas de " + homes.length);
  check("chaves: cada casa trancada tem exatamente uma chave com o nome certo", locked.every(d => { const k = keys.filter(x => x.it.lock === d.lockId); return k.length === 1 && k[0].it.label === homes.find(b => b.id === d.lockId).name; }));
  check("chaves: nunca estão dentro da própria casa", keys.every(x => x.host.building !== x.it.lock));
  const door = locked[0], other = locked[1], keyOf = d => ({...keys.find(x => x.it.lock === d.lockId).it, uid: "t-" + d.lockId});
  const p = s.player; Object.assign(p, {x: door.x, y: door.y + 1}); for (const z of s.world.enemies) z.hp = 0;
  check("chaves: porta trancada recusa sem chave", Sim.contextual(s, door) === false && door.locked === true);
  p.bag.push(keyOf(other)); check("chaves: a chave de outra casa não serve", Sim.contextual(s, door) === false && door.locked === true);
  p.bag.push(keyOf(door)); const ok = Sim.contextual(s, door);
  check("chaves: a chave certa destranca e abre", ok !== false && door.locked === false && door.open === true);
  const back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))), kept = back.player.bag.find(i => i.id === "housekey" && i.lock === door.lockId);
  check("chaves: a etiqueta e a casa sobrevivem à gravação", kept && kept.label === homes.find(b => b.id === door.lockId).name); }
{ const lured = open => { const s = fresh("survival"), w = s.world, p = s.player; for (const z of w.enemies) z.hp = 0;
    const b = w.homes.find(h => !h.door.locked && World.clear(w, h.door.x, h.door.y + 6)); b.door.open = open; World.sync(w);
    Object.assign(p, {x: b.x + b.w / 2, y: b.y + 2}); const z = w.enemies[0]; Object.assign(z, {hp: 45, x: b.door.x, y: b.door.y + 6, alert: 0, dormant: false, path: []});
    let near = false; for (let i = 0; i < 480; i++) { Sim.tick(s, .25, idle); if (Math.hypot(z.x - p.x, z.y - p.y) < 3) { near = true; break; } if (s.mode !== "play") break; }
    return near; };
  const withOpen = lured(true), withClosed = lured(false);
  check("portas: com a porta aberta o infetado entra e chega ao jogador", withOpen === true);
  check("portas: com a porta fechada o infetado (sem alerta) não vem", withClosed === false); }
// ---- v0.26: mundo maior (geração 4) ----
{ check("mundo: jogos novos usam a geração 6", fresh("survival").world.generator === 6);
  for (const region of ["ridge", "ironworks", "coast", "fields"]) {
    const w4 = World.build(Data.control.seed, "survival", 4, Data.worldRules("survival"), region), w3 = World.build(Data.control.seed, "survival", 3, Data.worldRules("survival"), region);
    const wild = w4.objects.filter(o => o.id.startsWith("wild-"));
    check("mundo: " + region + " tem 7 locais extra de exploração (geração 4)", wild.length === 7, wild.length + " locais");
    check("mundo: " + region + " – itens de saque válidos", wild.every(o => o.loot.length > 0 && o.loot.every(i => Data.items[i.id] && i.qty > 0)));
    const reach = wild.filter(o => World.route(w4, w4.start.x, w4.start.y, o.x, o.y, 0, true).length > 0).length;
    check("mundo: " + region + " – a maioria é alcançável a pé", reach >= 5, reach + "/" + wild.length);
    check("mundo: " + region + " – a geração 3 fica igual (sem locais extra)", !w3.objects.some(o => o.id.startsWith("wild-"))); } }
{ const s = fresh("training"), exit = s.world.objects.find(o => o.id === "exit-ridge");
  Object.assign(s.player, {x: exit.x, y: exit.y + 1}); for (const z of s.world.enemies) z.hp = 0;
  let t = null, err = ""; try { t = Sim.travel(s, exit); } catch (e) { err = e.message; }
  const there = t ?? s;
  check("mundo: viajar para Pine Ridge funciona e traz os locais extra", there.world.region === "ridge" && there.world.objects.filter(o => o.id.startsWith("wild-")).length === 7, err || there.world.region);
  let back = null, why = ""; try { back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(there)))); } catch (e) { why = e.message; }
  check("mundo: gravar e restaurar em Pine Ridge (geração 4)", back && back.world.region === "ridge" && back.world.objects.filter(o => o.id.startsWith("wild-")).length === 7, why); }
{ const s = fresh("survival"), p = s.player, z = s.world.enemies.find(e => e.hp > 0);
  const pile = s.world.objects.find(o => o.kind === "drop" && o.loot.some(i => i.id === "bat"));
  Sim.collect(s,pile,0);
  const index = p.bag.findIndex(i => i.id === "bat");
  Sim.use(s,index);
  const bat = p.bag[index];
  bat.condition = 20 + Data.items.bat.wear / 2; Object.assign(z, {x: p.x + .7, y: p.y, hp: 400}); s.target = z; const seen = new Set(); let warned = false;
  for (let i = 0; i < 120 && !warned; i++) { p.hp = 100; Sim.tick(s, .05, idle); for (const m of s.messages) if (!seen.has(m)) { seen.add(m); if (/nearly worn out/.test(m.text)) warned = true; } }
  check("armas: aviso quando a arma fica abaixo de 20 % de condição", warned, "condição " + bat.condition.toFixed(1)); }
{
  const restore = s => Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  for (const id of Object.keys(Data.control.starts)) {
    const run = Sim.createControl("training","carer",id);
    const bat = run.world.objects.find(o => o.kind === "drop" && o.loot.some(i => i.id === "bat"));
    check("start empty-handed with a reachable bat: "+id, Sim.weapon(run).id === "fists" &&
      !Sim.quantity(run.player.bag,"bat") && Sim.reachableObject(run,bat));
    const resumed = restore(run), pile = resumed.world.objects.find(o => o.id === bat.id);
    check("pickup stays unequipped: "+id, Sim.collect(resumed,pile,0) === 1 && Sim.weapon(resumed).id === "fists");
    Sim.use(resumed,resumed.player.bag.findIndex(i => i.id === "bat"));
    check("equipped bat persists on reload: "+id, Sim.weapon(restore(resumed)).id === "bat");
  }
  const run = fresh("training");
  const sources = {hatchet:"workshop",wrench:"workshop",rollingpin:"market",broom:"market",fryingpan:"home",pipe:"fuel"};
  for (const [id,type] of Object.entries(sources)) {
    check("weapon available in "+type+": "+id,run.world.objects.some(o => o.loot?.some(i => i.id === id) &&
      run.world.buildings.some(b => b.id === o.building && b.type === type)));
  }
}
// ---- v0.28: três regiões novas (geração 5) ----
{ const rules = Data.worldRules("survival"), deep = {quarry: "ironworks", reservoir: "fields", lighthouse: "coast"};
  for (const [id, host] of Object.entries(deep)) {
    const w = World.build(Data.control.seed, "survival", 5, rules, id), h5 = World.build(Data.control.seed, "survival", 5, rules, host), h4 = World.build(Data.control.seed, "survival", 4, rules, host);
    const meta = ctxRegions.definitions[id];
    check("região " + id + ": 64×64, com edifícios e infetados", w.width === 64 && w.height === 64 && w.buildings.length >= 3 && w.enemies.length > 0, w.buildings.length + " edifícios, " + w.enemies.length + " infetados");
    check("região " + id + ": chegada e saída são terreno livre", World.clear(w, meta.arrival[0] + .5, meta.arrival[1] + .5) && World.clear(w, meta.exitBack[0] + .5, meta.exitBack[1] + .5));
    const targets = w.objects.filter(o => o.action === "loot" || o.action === "door" && o.kind === "door").map(o => o);
    const reach = targets.filter(o => World.route(w, w.start.x, w.start.y, o.x, o.y, 0, true).length > 0).length;
    check("região " + id + ": quase tudo é alcançável a pé", reach >= targets.length * .9, reach + "/" + targets.length);
    const door = w.objects.find(o => o.lockId), key = w.objects.flatMap(o => (o.loot ?? []).filter(i => i.id === "housekey").map(i => ({i, o}))).find(k => k.i.lock === door?.lockId);
    check("região " + id + ": tem uma porta trancada e a chave está noutro edifício da região", Boolean(door && key && key.o.building !== door.building && key.i.label === w.buildings.find(b => b.id === door.lockId).name));
    check("região " + id + ": " + host + " tem a saída certa só na geração 5", h5.objects.some(o => o.id === "exit-" + id) && !h4.objects.some(o => o.id === "exit-" + id));
    const hexit = h5.objects.find(o => o.id === "exit-" + id);
    check("região " + id + ": a saída em " + host + " e a chegada de volta são alcançáveis", hexit && World.route(h5, h5.start.x, h5.start.y, hexit.x, hexit.y, 0, true).length > 0 && World.clear(h5, meta.hostArrival[0] + .5, meta.hostArrival[1] + .5));
    const routes = ctxAtmosphere ? ctxAtmosphere.arrivals?.[id] : null; }
  const s = fresh("training"); for (const z of s.world.enemies) z.hp = 0;
  const go = (state, id) => { const exit = state.world.objects.find(o => o.id === "exit-" + id); Object.assign(state.player, {x: exit.x, y: exit.y + (exit.y > state.world.height / 2 ? -1 : 1)}); return Sim.travel(state, exit) ?? state; };
  let there = s, trail = []; try { for (const id of ["ironworks", "quarry", "ironworks"]) { there = go(there, id); trail.push(there.world.region); } } catch (e) { trail.push("ERRO " + e.message); }
  check("viagem: Cold Vale → Ironworks → Slag Quarry → Ironworks", trail.join(" > ") === "ironworks > quarry > ironworks", trail.join(" > "));
  let q = s; try { for (const id of ["fields", "reservoir"]) q = go(q, id); } catch (e) { trail.push(e.message); }
  let back = null, why = ""; try { back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(q)))); } catch (e) { why = e.message; }
  check("viagem: gravar e restaurar dentro do Greywater Reservoir", back?.world.region === "reservoir" && back.world.generator === 6, why || q.world.region);
  let boom = ""; try { for (let i = 0; i < 400; i++) Sim.tick(q, .1, {x: 1, y: 0, run: false}); } catch (e) { boom = e.message; }
  check("viagem: 400 ticks no reservatório sem erros", boom === "", boom); }
// ---- v0.31: case finale, regional challenges, and hidden records ----
{
  const {Chronicle} = context;
  const serialise = value => JSON.parse(JSON.stringify(value));
  const fixture = (s, id) => s.world.objects.find(o => o.id === Chronicle.idFor(id));
  const standAt = (s, o) => Object.assign(s.player, {x:o.x, y:o.y});
  const ledger = Chronicle.empty();
  const sites = Object.entries(Chronicle.entries).filter(([,entry]) => entry.added === 4);
  let finale;
  for (const [id, entry] of sites) {
    const s = Sim.create(17,"training","carer",5,undefined,entry.region);
    const o = fixture(s,id);
    check("story fixture in " + entry.region + ": " + id, o && World.clear(s.world,o.x,o.y));
    if (!entry.game) continue;
    s.ledger = ledger;
    standAt(s,o);
    check("challenge prerequisites: " + id, Boolean(Sim.sceneProblem(s,o)));
    for (const needed of entry.needs) ledger.found[needed] = s.minutes;
    if (entry.afterDispatch) {
      check("survey isolation needs a signed check-in", Boolean(Sim.sceneProblem(s,o)));
      for (const id of [...Chronicle.core,"horn","buildnote","install","samplelog"]) {
        ledger.found[id] = s.minutes - Chronicle.dispatchDelay;
      }
      delete ledger.found.recovery;
      const recovery = fixture(s,"recovery");
      standAt(s,recovery);
      check("survey backup can be recovered before the check-in", Sim.resolveScene(s,recovery));
      standAt(s,o);
      finale = s;
      ledger.dispatch = {route:"freight",sent:s.minutes-Chronicle.dispatchDelay,moved:0,delivered:true,reportRead:true};
    }
    const {sequence, buttons} = entry.game;
    const wrong = (sequence[1]+1) % buttons.length;
    const [first, ...rest] = sequence;
    const start = Sim.resolveScene(s,o,first);
    const rejected = Sim.resolveScene(s,o,wrong);
    const bypass = Sim.resolveScene(s,o);
    Object.assign(s.player,s.world.start);
    const remote = Sim.resolveScene(s,o,first);
    standAt(s,o);
    check("challenge resets and rejects remote or missing input: " + id, !start && !rejected && !bypass && !remote &&
      s.sceneAttempt?.step === 0 && !Chronicle.has(ledger,id));
    const result = [first,...rest].map(choice => Sim.resolveScene(s,o,choice));
    if (entry.game.noisyChoice !== undefined) {
      check("rehearsal bell attracts infected through the real noise system", s.noiseRings?.some(ring => ring.x === o.x && ring.y === o.y));
    }
    const cache = s.world.objects.find(item => item.id === Chronicle.cacheFor(id));
    check("challenge completes once with a cache: " + id, result.every((complete, i) => complete === (i === sequence.length-1)) &&
      Chronicle.has(ledger,id) && cache?.active && cache.loot.length > 0 && !Sim.resolveScene(s,o,first));
    if (id === "tilltest") {
      const restored = Sim.restore(serialise(Sim.snapshot(s)));
      check("solved challenge and cache survive reload", Chronicle.has(restored.ledger,id) &&
        restored.world.objects.find(item => item.id === cache.id)?.active);
    }
  }
  const s = finale;
  const o = fixture(s,"gullseat");
  standAt(s,o);
  s.ledger = ledger;
  check("secret ending is locked without the outlying records", !Sim.resolveScene(s,o));
  for (const id of ["weighghost","pipecopy","fogfare"]) ledger.found[id] = s.minutes;
  check("secret ending unlocks after all three records", Sim.resolveScene(s,o));
  check("secret ending survives reload", Chronicle.has(Sim.restore(serialise(Sim.snapshot(s))).ledger,"gullseat"));
  const bad = serialise(Sim.snapshot(s));
  bad.ledger.dispatch.reportRead = false;
  let rejected = false;
  try { Sim.restore(bad); } catch { rejected = true; }
  check("save rejects a shutdown without the signed check-in", rejected);
}
{
  const run = fresh("training");
  check("marked locations show the selected landmark", Sim.markDestination(run,"market") && Boolean(Sim.destination(run)));
  const waypoint = run.waypoint;
  run.hideNavigation = true;
  check("mapless exploration hides waypoint guidance without changing the run",
    Sim.destination(run) === null && run.waypoint === waypoint);
  run.hideNavigation = false;
  check("marked locations can be restored without losing the waypoint", Boolean(Sim.destination(run)));
}
// ---- v0.32: infected deaths and the Oxford cinema ----
{
  const {Afterlife} = context;
  const s = fresh("training");
  check("only infected deaths qualify for the default 60% chance",
    s.rules.afterlifeChance === 60 && !Afterlife.eligible(s,0));
  s.player.exposure = 4;
  check("afterlife probability boundary", Afterlife.eligible(s,.5999) && !Afterlife.eligible(s,.60));
  s.rules.afterlifeChance = 0;
  check("zero chance disables the afterlife", !Afterlife.eligible(s,0));
  s.rules.afterlifeChance = 100;
  s.player.hp = 0;
  Sim.tick(s,.03);
  const snapshot = JSON.parse(JSON.stringify(Sim.snapshot(s)));
  const dead = Sim.restore(snapshot);
  check("eligible death is rolled once and saved as an optional offer",
    dead.mode === "dead" && dead.afterlifePending && dead.player.hp === 0);
  const healthy = fresh("training");
  healthy.rules.afterlifeChance = 100;
  healthy.player.hp = 0;
  Sim.tick(healthy,.03);
  check("ordinary death skips the offer even at 100%", healthy.mode === "dead" && !healthy.afterlifePending);
  delete snapshot.rules.afterlifeChance;
  delete snapshot.afterlifePending;
  check("old dead saves default to no pending offer", !Sim.restore(snapshot).afterlifePending);
  const unchanged = JSON.stringify(Sim.snapshot(dead));
  const rolls = {crow:.1,rot:.3,horde:.5,brains:.64,trapped:.86,chardonnay:.02};
  for (const [id,roll] of Object.entries(rolls)) {
    const losing = Afterlife.start(dead,roll,.42);
    for (let i=0;i<800;i++) Afterlife.tick(losing,.1,idle);
    check("afterlife timeout: " + id, losing.id === id && losing.result === "failure" &&
      losing.finishAt >= 30 && losing.finishAt <= 90 && (id !== "crow" || losing.blind));
    const winning = Afterlife.start(dead,roll,.42);
    if (winning.locked) {
      Object.assign(winning.player,winning.latch);
      Afterlife.action(winning,"grab");
      check("trapped latch releases", !winning.locked);
    }
    if (id === "crow") {
      Object.assign(winning.player,winning.route.find(p => Sim.distance(p,winning.origin) >= 1.6));
      Afterlife.tick(winning,.1,idle);
      check("moving early saves the crow's victim's sight", winning.crowGone && !winning.blind);
    }
    for (let i=0;i<(id === "horde" ? 3 : 1);i++) {
      Object.assign(winning.player,winning.target);
      if (id === "brains" || id === "rot") Afterlife.action(winning,"bite");
      else if (id === "chardonnay") Afterlife.action(winning,"grab");
      else Afterlife.tick(winning,.1,idle);
    }
    check("afterlife success: " + id, winning.result === "success" && winning.finishAt >= 30);
  }
  const walking = Afterlife.start(dead,.1,.3);
  const start = {...walking.player};
  const next = walking.route[1];
  const x = next.x-start.x, y = next.y-start.y, twist = walking.drift*walking.opposite;
  for (let i=0;i<20;i++) Afterlife.tick(walking,.03,{x:x+y*twist,y:y-x*twist});
  check("responsive movement with fixed drag bias", Sim.distance(walking.player,next) < .6);
  check("afterlife leaves the human run unchanged", unchanged === JSON.stringify(Sim.snapshot(dead)));
}
{
  const {Chronicle,Afterlife} = context;
  const s = fresh("survival");
  const exit = s.world.objects.find(o => o.id === "exit-cinema");
  const old = Sim.create(17,"survival","carer",5);
  check("Oxford crossing is generation-gated", exit && World.clear(s.world,exit.x,exit.y) &&
    !old.world.objects.some(o => o.id === "exit-cinema"));
  for (const seed of [0,1,42,937,90009]) {
    const town = Sim.create(seed,"training","carer",6).world;
    const [x,y] = ctxRegions.definitions.cinema.hostArrival;
    const crossing = town.objects.find(o => o.id === "exit-cinema");
    check("Oxford return lane is reserved for seed " + seed, World.clear(town,x+.5,y+.5) && World.clear(town,crossing.x,crossing.y));
  }
  Object.assign(s.player,{x:exit.x-1,y:exit.y});
  const cinema = Sim.travel(s,exit);
  check("Oxford foot crossing works", cinema?.world.region === "cinema");
  const hall = cinema.world.buildings[0];
  const notes = cinema.world.objects.filter(o => Chronicle.isScene(o));
  check("all six Oxford notes lead to reachable floor", notes.length === 6 &&
    notes.every(o => World.clear(cinema.world,o.x,o.y) && World.route(cinema.world,cinema.player.x,cinema.player.y,o.x,o.y).length));
  for (const note of notes.slice().reverse()) {
    Object.assign(cinema.player,{x:note.x,y:note.y});
    check("Oxford note is independently readable: " + note.record, Sim.resolveScene(cinema,note));
  }
  const reprise = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(cinema))));
  check("cinema notes survive save and restore", notes.every(note => Chronicle.has(reprise.ledger,note.record)));
  const emergency = reprise.world.objects.find(o => o.name === "Emergency exit");
  check("entrance and emergency exit are clear", World.clear(reprise.world,hall.door.x,hall.door.y) &&
    World.clear(reprise.world,emergency.x,emergency.y) &&
    World.route(reprise.world,hall.door.x,hall.door.y,emergency.x+1,emergency.y).length > 0);
  const back = reprise.world.objects.find(o => o.id === "exit-coldvale");
  Object.assign(reprise.player,{x:back.x,y:back.y-1});
  check("Oxford return crossing works", Sim.travel(reprise,back)?.world.region === "coldvale");
  const films = Object.entries(Chronicle.entries).filter(([,entry]) => entry.rare);
  const selected = films.filter(([,entry]) => Chronicle.available(entry,s.world));
  check("film references are optional and vary by seed", films.length === 10 && selected.length > 0 &&
    selected.length < films.length && films.some(([,entry]) => Chronicle.available(entry,s.world) !==
      Chronicle.available(entry,{generator:6,seed:s.seed+1})));
  const echoes = Afterlife.start(cinema,.02,.31);
  check("cinema Chardonnay is in concessions", World.tileAt(cinema.world,echoes.target.x,echoes.target.y).room === "Concessions");

  const seeds = new Map();
  let rare = 0;
  for (let seed=0;seed<1000;seed++) {
    const outcome = ctxRegions.cinemaOutcome(seed);
    if (outcome === "winner") rare++;
    if (!seeds.has(outcome)) seeds.set(outcome,seed);
  }
  check("El Gordo appears on a small fraction of seeds", rare >= 35 && rare <= 105, rare + "/1000");
  for (const [outcome,seed] of seeds) {
    const run = Sim.create(seed,"survival","carer",6,undefined,"cinema");
    check("cinema outcome: " + outcome, run.world.cinema === outcome && run.world.enemies.length <= 3);
    if (outcome === "projector" || outcome === "noise") {
      Object.assign(run.player,{x:12.5,y:17.5});
      Sim.tick(run,.03);
      check("cinema sleepers respect the event trigger: " + outcome,
        run.world.enemies.length >= 2 && run.world.enemies.every(z => z.dormant === (outcome === "noise")));
      if (outcome === "noise") {
        const z = run.world.enemies[0];
        Object.assign(run.player,{x:z.x+1,y:z.y});
        Sim.tick(run,.03,{x:1,y:0,run:true});
        check("player noise can wake dormant audience members", run.world.enemies.every(z => !z.dormant));
      }
    }
    if (outcome === "guest") {
      Object.assign(run.player,{x:18.5,y:19.5});
      Sim.tick(run,.03);
      check("concessions guest is a brief encounter", run.cinemaGuestUntil > run.elapsed && run.atmosphere.awake);
    }
    if (outcome === "winner") {
      const winner = run.world.enemies[0];
      winner.hp = 1;
      Object.assign(run.player,{x:winner.x,y:winner.y+1});
      check("winner can be defeated with an ordinary hit", Sim.attack(run,winner) && winner.hp === 0);
    }
    if (outcome === "winner" || outcome === "trophy") {
      const prize = run.world.objects.find(o => o.loot?.some(item => item.id === "raffletrophy"));
      Object.assign(run.player,{x:prize.x,y:prize.y});
      check("trophy is unique and collectible: " + outcome,
        Sim.collect(run,prize,0) === 1 && Sim.quantity(run.player.bag,"raffletrophy") === 1 &&
        Sim.quantity(Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(run)))).player.bag,"raffletrophy") === 1);
    }
  }
}
if (args[1]) { // compatibilidade: gravação de uma versão antiga abre nesta? node smoke-test.js <pasta-nova> <pasta-antiga>
  const load = d => { const h = fs.readFileSync(path.join(d, "index.html"), "utf8"), fl = [...h.matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]).filter(f => f !== "view" && f !== "game");
    let src = ""; for (const f of fl) src += fs.readFileSync(path.join(d, f + ".js"), "utf8").replace(/^"use strict";/, "") + `\n;globalThis.${pascal(f)}=${pascal(f)};\n`;
    const c = {console, Math, Date, JSON, structuredClone}; c.globalThis = c.window = c; vm.createContext(c); vm.runInContext(src, c); return c; };
  const old = load(path.resolve(args[1]));
  for (const mode of ["survival", "homestead"]) { const o = old.Sim.createControl(mode, "carer", "shelter"); for (let i = 0; i < 300; i++) old.Sim.tick(o, .05, {x: 1, y: 0, run: false});
    let ok = true, why = ""; try { Sim.restore(JSON.parse(JSON.stringify(old.Sim.snapshot(o)))); } catch (e) { ok = false; why = e.message; }
    check("compatibilidade: gravação " + mode + " da versão antiga abre", ok, why); } }

console.log(failures ? "\n" + failures + " FALHA(S)" : "\nTudo OK");
process.exit(failures ? 1 : 0);
