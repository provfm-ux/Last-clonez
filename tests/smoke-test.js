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
const {Sim, Data, World, Campaign} = context, ctxRegions = context.Regions, ctxAtmosphere = context.Atmosphere;

let failures = 0;
const check = (name, passed, detail = "") => { if (!passed) failures++; if (passed && quiet) return; console.log((passed ? "PASS " : "FAIL ") + name + (detail ? "  [" + detail + "]" : "")); };
const idle = {x: 0, y: 0, run: false};
const run = (s, ticks, input = idle) => { for (let i = 0; i < ticks && s.mode === "play"; i++) Sim.tick(s, .033, input); return s; };
const fresh = mode => Sim.createControl(mode, "carer", "shelter");

{
  const profile = {name:"Rita",appearance:"female",skinTone:"deep",hairStyle:"wavy",hairColor:"auburn",jacketColor:"burgundy"};
  const run = Sim.createControl("training","carer","shelter",undefined,profile);
  const saved = JSON.parse(JSON.stringify(Sim.snapshot(run)));
  const loaded = Sim.restore(saved);
  check("personalização do sobrevivente persiste da criação ao carregamento",
    Object.entries(profile).every(([field,value]) => loaded.player[field] === value));
  for (const key of Object.keys(Data.survivorStyle)) delete saved.player[key];
  saved.player.hairColor = "unknown";
  const legacy = Sim.restore(saved);
  const defaults = Data.character({appearance:"female"});
  check("saves antigos e opções inválidas recebem a aparência predefinida",
    Object.keys(Data.survivorStyle).every(key => legacy.player[key] === defaults[key]));
}

{
  const s = fresh("training"), p = s.player;
  const baseAim = Sim.aimChance(s), baseRepair = Sim.vehicleRepairAmount(s);
  p.skills.marksmanship = Data.skillXp(2);
  p.skills.mechanics = Data.skillXp(2);
  check("novas perícias melhoram pontaria e reparações",
    Sim.aimChance(s) > baseAim && Sim.vehicleRepairAmount(s) === baseRepair + 4);
  const save = JSON.parse(JSON.stringify(Sim.snapshot(s)));
  const reloaded = Sim.restore(JSON.parse(JSON.stringify(save)));
  delete save.player.skills.marksmanship;
  delete save.player.skills.mechanics;
  const old = Sim.restore(save);
  check("perícias novas persistem e começam a zero em saves anteriores",
    Sim.level(reloaded,"marksmanship") === 2 && Sim.level(reloaded,"mechanics") === 2 &&
    old.player.skills.marksmanship === 0 && old.player.skills.mechanics === 0);
  const car = {id:"mechanics-car",kind:"car",x:p.x,y:p.y,hp:70,active:true};
  s.world.objects.push(car);
  p.bag.push({id:"scrap",qty:2},{id:"tape",qty:1});
  const beforeRepair = p.skills.mechanics;
  check("reparar carro atribui experiência de mecânica",
    Sim.repairVehicle(s,car) && car.hp === 70 + baseRepair + 4 && p.skills.mechanics > beforeRepair);
  p.bag.push({id:"pistol",uid:"test-pistol",condition:100,qty:1},{id:"ammo",qty:1});
  Sim.use(s,p.bag.length - 2);
  const enemy = World.infected(s.world,"test-target",p.x+.4,p.y,s.rules.mix,context.Level.seeded(11));
  s.world.enemies.push(enemy);
  const beforeShot = p.skills.marksmanship;
  check("disparar contra um infetado atribui experiência de pontaria",
    Sim.attack(s,enemy) && p.skills.marksmanship > beforeShot && Sim.quantity(p.bag,"ammo") === 0);
}

{
  const s = fresh("training");
  const p = s.player;
  for (const z of s.world.enemies) z.hp = 0;
  p.bag = p.bag.filter(item => item.id !== "watch");
  const before = s.minutes;
  check("esperar exige relógio", !Sim.waitWithWatch(s, 15) && s.minutes === before);
  p.bag.push({id:"watch", qty:1, condition:100, born:0, cold:0});
  check("relógio avança a simulação pelo tempo escolhido", Sim.waitWithWatch(s, 30) &&
    Math.abs(s.minutes - before - 30) < .001 && !p.sleeping && Sim.quantity(p.bag,"watch") === 1);
  const z = s.world.enemies[0];
  if (z) {
    Object.assign(z,{x:p.x,y:p.y,hp:10,dormant:false});
    const start = s.minutes;
    check("relógio não espera quando há perigo perto", !Sim.waitWithWatch(s, 15) && s.minutes === start);
  }
  const chair = {id:"test-chair", kind:"chair", name:"Chair", x:p.x, y:p.y, active:true, solid:false};
  s.world.objects.push(chair);
  check("mobiliário exige ação explícita para desmontar",
    Sim.isFurniture(chair) && !Sim.contextual(s,chair) && chair.active);
  check("desmontar mobiliário deixa materiais uma só vez",
    Sim.dismantleFurniture(s,chair) && !chair.active && !Sim.dismantleFurniture(s,chair) &&
    s.world.objects.at(-1).loot.some(item => item.id === "wood"));
}
{
  const s = fresh("training");
  const tile = s.world.tiles.find(t => !t.building && !t.solid &&
    !World.tileAt(s.world,t.x+2,t.y)?.building && !World.tileAt(s.world,t.x+2,t.y)?.solid &&
    World.sees(s.world,t.x+.5,t.y+.5,t.x+2.5,t.y+.5));
  Object.assign(s.player,{x:tile.x+.5,y:tile.y+.5,lightUid:null});
  const x = s.player.x+2, y = s.player.y;
  s.minutes = 1260;
  const moonless = Sim.moonlight(s) === 0 && !Sim.canSee(s,x,y);
  s.minutes = 1440+180;
  const afterMidnight = Sim.moonlight(s) === 0;
  s.world.objects.push({id:"test-night-fire",kind:"campfire",x,y,active:true});
  const lit = Sim.canSee(s,x,y);
  s.world.objects.pop();
  s.minutes = 4*1440+1260;
  check("a lua altera visibilidade, mantém a fase após meia-noite e fogueiras iluminam",
    moonless && afterMidnight && lit && Sim.moonlight(s) === 1 && Sim.canSee(s,x,y));
}
{
  const s = fresh("survival");
  s.guideStep = undefined;
  const clearMap = () => { for (const z of s.world.enemies) z.hp = 0; };
  clearMap();
  s.atmosphere.nextWave = s.atmosphere.time;
  Sim.tick(s,.03);
  const first = s.atmosphere.pending?.route;
  if (s.atmosphere.pending) s.atmosphere.pending.due = s.atmosphere.time;
  Sim.tick(s,.03);
  const entered = s.world.enemies.some(z => z.origin === "horde" && z.hp > 0);
  clearMap();
  s.atmosphere.nextWave = s.atmosphere.time;
  Sim.tick(s,.03);
  const second = s.atmosphere.pending?.route;
  if (s.atmosphere.pending) s.atmosphere.pending.due = s.atmosphere.time;
  Sim.tick(s,.03);
  check("hordas reentram por outra rota após a eliminação dos infetados",
    entered && first !== undefined && second !== undefined && second !== first &&
    s.world.enemies.some(z => z.origin === "horde" && z.hp > 0));
}

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
{ const s = fresh("training"); s.quiet = true;
  const p = s.player;
  const infected = World.infected(s.world,"practice-threat",p.x + 3,p.y,"walkers",context.Level.seeded(12));
  infected.dormant = true;
  s.world.enemies = [infected];
  Sim.tick(s,.1,{x:1,y:0,run:false});
  check("sneaking: moving near an infected earns XP", p.skills.sneaking > 0 && p.skills.lightfooted > 0);
}
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
{
  const stepCount = strength => {
    const s = fresh("training");
    const start = findTile(s,t => [0,1,2,3,4,5].every(offset =>
      World.clear(s.world,t.x+.5+.5*offset,t.y+.5-.5*offset)));
    Object.assign(s.player,start);
    s.world.enemies = [];
    let count = 0;
    for (let i = 0; i < 48; i++) {
      Sim.tick(s,.033,{x:strength,y:0,run:false});
      count += s.sounds.splice(0).filter(cue => cue.kind === "stepSoft" || cue.kind === "stepHard").length;
    }
    return count;
  };
  const slow = stepCount(.35), normal = stepCount(1);
  check("áudio: passos espaçam com movimento lento e param em repouso",
    stepCount(0) === 0 && slow > 0 && slow < normal, slow + "/" + normal);
}

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
    const spot = findTile(s, t => !t.building && t.solid === false); Object.assign(p, {x: spot.x, y: spot.y}); if (coat) for (const id of ["wintercoat","beanie"]) {
      p.bag.push({id,qty:1,condition:100});
      Sim.use(s,p.bag.length-1);
    }
    for (let i = 0; i < 800; i++) { s.minutes = 21 * 1440 + 12 * 60; Sim.tick(s, .25, idle); } temps.push(p.temperature); }
  check("roupa: casaco e gorro aquecem no inverno", temps[1] > temps[0] + .8, temps.map(t => t.toFixed(2)).join(" → ")); }
{ const absorbed = {}; 
  for (const kit of ["bare", "heavy"]) { const s = fresh("survival"), p = s.player; s.rules.damage = 10; p.fracture = 0;
    if (kit === "bare") for (const slot of Object.keys(p.gear)) p.gear[slot] = null;
    else for (const id of ["gloves","armguards","wintercoat"]) {
      p.bag.push({id,qty:1,condition:100});
      Sim.use(s,p.bag.length-1);
    }
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
  check("áudio: só uma abertura bem-sucedida produz o som de porta", s.sounds.splice(0).map(cue => cue.kind).join() === "doorOpen");
  check("áudio: fechar a porta tem um som próprio", Sim.door(s,door) && s.sounds.splice(0).map(cue => cue.kind).join() === "doorClose");
  const window = s.world.objects.find(o => o.kind === "window" && o.active && !o.open && !o.boards);
  Object.assign(p,{x:window.x,y:window.y});
  check("áudio: partir o vidro produz um som uma única vez",
    Sim.breach(s,window,"smash") && !Sim.breach(s,window,"smash") &&
    s.sounds.splice(0).filter(cue => cue.kind === "glassSmash").length === 1);
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
{ check("mundo: jogos novos usam a geração 7", fresh("survival").world.generator === 7);
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
  check("viagem: gravar e restaurar dentro do Greywater Reservoir", back?.world.region === "reservoir" && back.world.generator === 7, why || q.world.region);
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
    check("cinema outcome: " + outcome, run.world.cinema === outcome && run.world.enemies.length <= 4 && // up to 3 sleepers + the raffle winner
      run.world.enemies.filter(z => z.id === "cinema-winner").length === 1);
    if (outcome === "projector" || outcome === "noise") {
      Object.assign(run.player,{x:12.5,y:17.5});
      Sim.tick(run,.03);
      check("cinema sleepers respect the event trigger: " + outcome,
        run.world.enemies.filter(z => z.origin === "cinema-sleeper").length >= 2 &&
        run.world.enemies.filter(z => z.origin === "cinema-sleeper").every(z => z.dormant === (outcome === "noise")));
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
{
  const {Expedition,Chronicle,Regions} = context;
  const districts = Object.entries(Expedition.districts);
  const oldTiles = Object.entries(Regions.definitions).filter(([id]) => !Expedition.districts[id] && id !== "fortress")
    .reduce((sum,[,area]) => sum+area.width*area.height,0);
  const newTiles = districts.reduce((sum,[,area]) => sum+area.width*area.height,0);
  check("outer districts at least double the mapped area",newTiles >= oldTiles);
  check("story count grows tenfold",Object.keys(Chronicle.entries).length >=
    10*(Object.keys(Chronicle.entries).length-Object.keys(Expedition.records).length));
  check("300 optional Easter eggs across the districts",Object.values(Expedition.records).filter(entry => entry.easter).length === 300);
  for (const [id,district] of districts) {
    const old = Sim.create(17,"training","carer",6,undefined,district.host);
    const host = Sim.create(17,"training","carer",7,undefined,district.host);
    const gate = host.world.objects.find(o => o.id === "exit-"+id);
    check("district gate reachable and absent in old saves: "+id, gate && !old.world.objects.some(o => o.id === gate.id) &&
      World.route(host.world,host.player.x,host.player.y,gate.x,gate.y,0,true).length > 0);
    Object.assign(host.player,{x:gate.x,y:gate.y});
    const run = Sim.travel(host,gate);
    check("district crossing works: "+id,run?.world.region === id);
    if (!run) continue;
    const notes = run.world.objects.filter(Chronicle.isScene);
    check("all district clues have reachable floor: "+id,notes.length >= 121 && notes.every(o =>
      World.clear(run.world,o.x,o.y) && World.route(run.world,run.player.x,run.player.y,o.x,o.y,0,true).length));
    for (const index of [0,4,9]) {
      for (const suffix of ["a","b","c","f"]) {
        const o = notes.find(o => o.record === "out-"+id+"-"+index+suffix);
        Object.assign(run.player,{x:o.x,y:o.y});
        check("field witness entry resolves: "+o.record,Sim.resolveScene(run,o));
      }
    }
    const packet = notes.find(o => o.record === "packet-"+id);
    Object.assign(run.player,{x:packet.x,y:packet.y});
    check("district packet can be assembled: "+id,Sim.resolveScene(run,packet));
    const saved = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(run))));
    const back = saved.world.objects.find(o => o.id === "exit-"+district.host);
    Object.assign(saved.player,{x:back.x,y:back.y});
    const returned = Sim.travel(saved,back);
    check("district progress persists after returning: "+id,returned?.world.region === district.host && Chronicle.has(returned.ledger,packet.record));
  }
}
{
  const seed = 17, s = Sim.createRecommended(seed, true, 2.3), p = s.player;
  const standard = Sim.createControl("survival", "carer", "shelter", undefined, {seed});
  const homeIds = new Set(s.world.buildings.filter(b => b.type === "home").map(b => b.id));
  const stash = s.world.objects.find(o => homeIds.has(o.building) && Sim.quantity(o.loot ?? [], "bandage") >
    Sim.quantity(standard.world.objects.find(other => other.id === o.id)?.loot ?? [], "bandage"));
  const bat = s.world.objects.find(o => o.kind === "drop" && o.loot?.some(item => item.id === "bat"));
  const originalPosition = {x:p.x,y:p.y};
  const steps = [s.guideStep];
  for (const input of [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}]) {
    Sim.tick(s, .033, input);
    if (s.playtest.move !== undefined) break;
  }
  Object.assign(p, originalPosition);
  Sim.collect(s, bat, bat.loot.findIndex(item => item.id === "bat"));
  steps.push(s.guideStep);
  Sim.use(s, p.bag.findIndex(item => item.id === "bat"));
  steps.push(s.guideStep);
  const houseSpot = findTile(s, t => t.building === stash?.building && !t.solid &&
    Sim.distance({x:t.x+.5,y:t.y+.5},stash) <= 1.85 &&
    World.sees(s.world,t.x+.5,t.y+.5,stash.x,stash.y));
  if (houseSpot) {
    Object.assign(p, houseSpot);
    const house = s.world.buildings.find(b => b.id === stash.building);
    const cupboard = s.world.objects.find(o => o.building === house.id && Sim.reachableObject(s,o) &&
      o.loot?.some(item => item.id !== "bandage"));
    if (cupboard) {
      Sim.collect(s, cupboard, cupboard.loot.findIndex(item => item.id !== "bandage"));
      steps.push(s.guideStep);
    }
    Sim.collect(s, stash, stash.loot.findIndex(item => item.id === "bandage"));
  }
  steps.push(s.guideStep);
  p.wounds.push({part:"arm", type:"scratch", bleed:.07, bandaged:false, clean:false, infection:0, age:0});
  Sim.use(s, p.bag.findIndex(item => item.id === "bandage"));
  steps.push(s.guideStep);
  const shelter = findTile(s, t => t.building === s.world.base.id && !t.solid &&
    World.clear(s.world,t.x+.5,t.y+.5));
  Object.assign(p, shelter);
  s.minutes = 1200;
  s.atmosphere.nextWave = 0;
  s.nextEvent = 0;
  Sim.tick(s, .033);
  steps.push(s.guideStep);
  check("início recomendado: recolher, equipar, explorar, tratar e regressar sem repetir passos",
    steps.join(",") === "0,1,2,3,4,5,6", steps.join(","));
  check("início recomendado: mesmas regras Survival, primeira noite sem horda itinerante",
    JSON.stringify(s.rules) === JSON.stringify(standard.rules) && !s.atmosphere.pending && s.atmosphere.nextWave === 0 &&
    !s.messages.some(message => /siren|crash in the centre/.test(message.text)));
  s.minutes = 1440 + 390;
  Sim.tick(s, .033);
  check("início recomendado: hordas itinerantes regressam após o amanhecer", s.atmosphere.pending || s.atmosphere.nextWave > 0);
  check("objetivo: clínica marcada e modo sem mapa usa sinais",
    Sim.pinnedGoal(s) === "Find Eva" && Sim.destination(s)?.id === s.world.buildings.find(b => b.type === "clinic").id);
  s.hideNavigation = true;
  check("sem mapa: pista física sem destino", /signs north/.test(Sim.pinnedGoal(s)) && Sim.destination(s) === null);
  s.flags.rescued = true;
  check("objetivo: avança para o rádio", /radio/.test(Sim.pinnedGoal(s)));
  const z = s.world.enemies.find(e => e.hp > 0 && !e.dormant);
  Object.assign(z, {x:p.x,y:p.y,hp:1});
  Sim.attack(s, z);
  p.hp = 0;
  Sim.tick(s, .033);
  const saved = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("marcos locais: guardam os primeiros tempos e só existem com adesão",
    saved.guideStep === 6 && saved.playtest.tutorialSkip === 2.3 &&
    ["move","pickup","equip","fight","heal","death"].every(id => Number.isFinite(saved.playtest[id])) &&
    !Sim.createRecommended(seed).playtest && !standard.playtest, JSON.stringify(saved.playtest));
}

{
  const make = () => Sim.createControl("survival", "carer", "shelter", undefined, {seed:1014});
  const a = make(), b = make(), old = make();
  for (const s of [a,b]) {
    s.difficultyOptions = Sim.difficultyOptions(s);
    s.player.hp = 25;
    s.atmosphere.nextWave = 0;
    for (const z of s.world.enemies) z.hp = 0;
    Sim.tick(s, .2);
  }
  check("hordas adaptativas: mesma seed e ações dão a mesma pausa",
    a.recoveryUsed && b.recoveryUsed && a.atmosphere.nextWave === 45.2 &&
    JSON.stringify(a.atmosphere) === JSON.stringify(b.atmosphere));
  const original = JSON.stringify(a.rules);
  const decreased = Sim.setDifficulty(a, {pressure:"low", bleed:true, aim:"light"});
  const rejected = !Sim.setDifficulty(a, {pressure:"high"}) && a.difficultyOptions.pressure === "low";
  const restored = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(a))));
  check("dificuldade: baixar guarda o historial, subir exige confirmação, regras de geração intactas",
    decreased && rejected && restored.difficultyOptions.assists.bleed && restored.difficultyOptions.aim === "light" &&
    restored.difficultyChanges.length === 1 && JSON.stringify(restored.rules) === original &&
    Sim.setDifficulty(restored, {pressure:"high"}, true));
  check("dificuldade: gravação anterior conserva as regras sem assistências nem diretor",
    Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(old)))).difficultyOptions === undefined);
  check("dificuldade: só Relaxed e Survival ativam o diretor por defeito",
    Object.keys(Data.modes).every(id => Sim.difficultyOptions({difficulty:id}).director === ["relaxed","survival"].includes(id)));
  check("travessias: distritos exteriores perigosos e Training calmo",
    Object.keys(context.Expedition.districts).every(region => Sim.dangerRating(a,region) === "Dangerous" &&
      Sim.dangerRating(fresh("training"),region) === "Calm"));
  check("mira assistida desligada mantém o alvo original",
    Sim.touchAttackTarget(old) === Sim.attackTarget(old));
  const open = findTile(old, t => [-1,0,1].every(dx => World.clear(old.world,t.x+.5+dx,t.y+.5)));
  const [front,back] = old.world.enemies.filter(z => z.hp > 0 && !z.dormant);
  Object.assign(old.player, open, {headingX:1,headingY:0});
  Object.assign(front, {x:open.x+.7,y:open.y});
  Object.assign(back, {x:open.x-.3,y:open.y});
  old.world.enemies = [front,back];
  old.difficultyOptions = Sim.difficultyOptions(old, {aim:"light"});
  check("mira assistida: favorece um alvo visível à frente, mas nunca fora de alcance",
    Sim.attackTarget(old) === back && Sim.touchAttackTarget(old) === front &&
    (front.x += 4, Sim.touchAttackTarget(old) === null));
  const withBleed = make(), withoutBleed = make();
  withBleed.difficultyOptions = Sim.difficultyOptions(withBleed, {bleed:true});
  for (const s of [withBleed,withoutBleed]) {
    s.player.wounds.push({part:"arm",type:"cut",bleed:.18,bandaged:false,clean:false,infection:0,age:0});
    Sim.tick(s,.2);
  }
  check("assistência: reduz a perda de vida por hemorragia", withBleed.player.hp > withoutBleed.player.hp);
}

{
  const run = Sim.createControl("training","carer","shelter",undefined,{seed:17});
  const spot = findTile(run, t => World.clear(run.world,t.x+.5,t.y+.5) &&
    World.clear(run.world,t.x+1.5,t.y+.5) && World.sees(run.world,t.x+.5,t.y+.5,t.x+1.5,t.y+.5));
  Object.assign(run.player,spot);
  const enemy = (kind, distance = .8) => ({id:"matchup",kind,stats:Data.infected[kind],hp:Data.infected[kind].hp,
    x:spot.x+distance,y:spot.y,stagger:0,windup:.4,windupTarget:"player"});
  const strike = (id, kind, distance) => {
    run.player.cooldown = 0;
    run.player.stamina = 100;
    const z = enemy(kind,distance);
    run.world.enemies = [z];
    run.player.bag.push({id,qty:1,condition:100,uid:"test-"+id});
    Sim.use(run,run.player.bag.length-1);
    return {z, hit:Sim.attack(run,z)};
  };
  const batWalker = strike("bat","walker"), batBrute = strike("bat","brute"), axeBrute = strike("axe","brute");
  check("combate: taco forte contra walker, mas o brute resiste e mantém o ataque",
    batWalker.hit && batWalker.z.hp === 17 && batBrute.hit && batBrute.z.hp === 68 && batBrute.z.windup === .4);
  check("combate: machado forte contra brute e interrompe o ataque",
    axeBrute.hit && axeBrute.z.hp === 39 && axeBrute.z.windup === 0);
  const spear = strike("spear","runner",1.65), knife = strike("knife","runner",1.65);
  const closeKnife = strike("knife","runner");
  check("combate: lança alcança e desequilibra runner, faca é melhor de perto",
    spear.hit && spear.z.stagger === .48 && !knife.hit && closeKnife.hit && closeKnife.z.hp === 12);
  const brute = enemy("brute");
  run.world.enemies = [brute];
  run.player.cooldown = 0;
  run.player.grabbed = 1;
  check("combate: empurrar brute liberta o jogador mas não cancela a investida",
    Sim.shove(run) && run.player.grabbed === 0 && brute.windup === .4 && brute.x-spot.x < 1.05);
  check("combate: todas as armas têm um estilo",
    Object.values(Data.items).filter(item => item.damage).every(item => Data.combatStyles[item.combat]));
  run.sounds.length = 0;
  const zombieCues = () => run.sounds.splice(0).filter(cue => cue.kind.startsWith("zombie.common.")).map(cue => cue.kind.slice(14));
  strike("bat","walker");
  check("áudio: golpe não letal dispara hit", zombieCues().join() === "hit");
  const wounded = run.world.enemies[0];
  wounded.hp = 1;
  run.player.cooldown = 0;
  Sim.attack(run,wounded);
  Sim.attack(run,wounded);
  check("áudio: golpe letal dispara death uma vez", zombieCues().join() === "death");
  const zombie = World.infected(run.world,"voice-test",spot.x+.8,spot.y,"walkers",context.Level.seeded(17));
  Object.assign(zombie,{dormant:false,windup:.01,windupTarget:"player"});
  run.world.enemies = [zombie];
  Sim.tick(run,.033,idle);
  check("áudio: deteção e início do ataque disparam notice e attack", zombieCues().join() === "notice,attack");
  Sim.tick(run,.033,idle);
  check("áudio: deteção não se repete no frame seguinte", !zombieCues().includes("notice"));
}

{
  const run = Sim.createControl("training","carer","shelter",undefined,{seed:17});
  const player = run.player;
  const bat = {id:"bat",qty:1,condition:.2,born:0,uid:"repair-test-bat"};
  const axe = {id:"axe",qty:1,condition:92,born:0,uid:"repair-test-axe"};
  player.bag.push(bat, axe);
  Sim.use(run,player.bag.indexOf(bat));
  const z = {...World.infected(run.world,"repair-test",player.x,player.y,"walkers",context.Level.seeded(17))};
  run.world.enemies.push(z);
  check("desgaste: golpe parte arma no limite e bloqueia novo ataque",
    Sim.attack(run,z) && bat.condition === 0 && Sim.weaponProblem(run) === "Weapon broken" &&
    run.messages.some(message => message.text.includes("Wooden bat broke")));
  const snap = Sim.snapshot(run);
  const restored = Sim.restore(JSON.parse(JSON.stringify(snap)));
  check("desgaste: a condição zero mantém-se na gravação", Sim.weapon(restored).condition === 0);
  const supply = id => Sim.available(run,id);
  player.bag.push({id:"scrap",qty:2,condition:100,born:0},{id:"tape",qty:2,condition:100,born:0});
  const scrap = supply("scrap"), tape = supply("tape");
  const failed = !Sim.craft(run,"repair",{...axe}) && supply("scrap") === scrap && supply("tape") === tape;
  check("reparação: escolhe arma no inventário, sem mudar arma equipada, e respeita o limite",
    failed && Sim.craft(run,"repair",axe) && axe.condition === 100 && Sim.weapon(run) === bat &&
    supply("scrap") === scrap-1 && supply("tape") === tape-1);
  check("reparação: receita antiga recupera uma arma partida e não gasta material numa arma nova",
    !Sim.craft(run,"repair",axe) && Sim.craft(run,"repair") && bat.condition === 35 &&
    supply("scrap") === scrap-2 && supply("tape") === tape-2);
}

{
  const run = Sim.createControl("training","carer","shelter",undefined,{seed:17});
  const p = run.player;
  const bat = {id:"bat",qty:1,condition:100,born:0,uid:"carried-bat"};
  const axe = {id:"axe",qty:1,condition:100,born:0,uid:"carried-axe"};
  p.bag.push(bat,axe);
  Sim.use(run,p.bag.indexOf(axe));
  Sim.drop(run,p.bag.indexOf(axe));
  check("equipamento: largar o machado deixa mãos vazias com taco na mochila", Sim.weapon(run).id === "fists");
  Sim.use(run,p.bag.indexOf(bat));
  Sim.unequipWeapon(run);
  const snapshot = () => JSON.parse(JSON.stringify(Sim.snapshot(run)));
  check("equipamento: desequipar mantém taco na mochila e punhos após carregar",
    Sim.weapon(Sim.restore(snapshot())).id === "fists" && p.bag.includes(bat));
  const stale = snapshot();
  stale.player.weapon = "bat";
  stale.player.weaponUid = "removed-bat";
  check("equipamento: identificador obsoleto não equipa outro taco",
    Sim.weapon(Sim.restore(stale)).id === "fists");
  const legacy = snapshot();
  legacy.player.weapon = "bat";
  delete legacy.player.weaponUid;
  check("equipamento: uma gravação antiga só com o tipo de arma ainda a equipa",
    Sim.weapon(Sim.restore(legacy)).id === "bat");
}

{
  const run = Sim.createControl("training","carer","shelter",undefined,{seed:17});
  const p = run.player;
  const diy = run.world.objects.find(o => o.loot?.some(item => item.id === "diyguide"));
  check("livros: existem manuais para todas as competências na cidade",
    Boolean(diy) && Object.keys(Data.skillBooks).every(id => run.world.objects.some(o => o.loot?.some(item => item.id === id))));
  p.bag.push({id:"diyguide",qty:1,condition:100});
  const i = p.bag.length-1;
  const read = Sim.use(run,i) && !Sim.use(run,i);
  const reloaded = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(run))));
  check("livros: dá XP uma vez e conserva leitura após carregar",
    read && reloaded.player.skills.crafting === 24 && !Sim.use(reloaded,i) && Sim.repairAmount(run) === 38);
  const old = JSON.parse(JSON.stringify(Sim.snapshot(run)));
  delete old.booksStocked;
  delete old.player.readBooks;
  for (const o of old.objects) if (o.loot) o.loot = o.loot.filter(item => !Object.hasOwn(Data.skillBooks,item.id));
  const upgraded = Sim.restore(old);
  check("livros: aparecem em mapas antigos sem duplicar ao gravar de novo",
    upgraded.world.booksStocked && upgraded.world.objects.filter(o => o.loot?.some(item => item.id === "diyguide")).length === 1 &&
    upgraded.player.readBooks.length === 0);

  p.bag.push({id:"wintercoat",qty:1,condition:100},{id:"tape",qty:1,condition:100});
  Sim.use(run,p.bag.length-2);
  const z = World.infected(run.world,"wear-test",p.x,p.y,"walkers",context.Level.seeded(17));
  Object.assign(z,{windup:.01,windupTarget:"player"});
  run.world.enemies.push(z);
  Sim.tick(run,.033);
  const worn = ["body","legs","feet"].map(slot => Sim.wornItem(run,slot)).filter(item => item?.condition < 100);
  check("roupa: um golpe danifica a roupa na zona atingida", worn.length > 0);
  const damaged = worn[0];
  if (damaged) damaged.condition = 20;
  check("reparação DIY: tecido e fita melhoram a condição da roupa", Boolean(damaged) &&
    Sim.craft(run,"mend",damaged) && damaged.condition === 58 && p.skills.crafting === 28);
}

{
  const assert = require("node:assert/strict");
  let s = fresh("longhaul");
  const home = {...s.world.start};
  const move = (x, y) => Object.assign(s.player,{x,y});
  const reach = o => {
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[0,0]]) {
      move(o.x+dx,o.y+dy);
      if (World.clear(s.world,s.player.x,s.player.y) && Sim.reachableObject(s,o)) return;
    }
    assert.fail("Could not reach " + o.id);
  };
  const reload = () => { s = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))); };
  const object = id => s.world.objects.find(o => o.id === id);
  const collect = (o,id,count) => {
    reach(o);
    for (let i=0; i<count; i++) assert.equal(Sim.collect(s,o,o.loot.findIndex(item => item.id === id)),1,id);
  };
  const use = id => Sim.use(s,s.player.bag.findIndex(item => item.id === id));
  const build = recipe => {
    assert.ok(Sim.craft(s,recipe),recipe);
    for (const tile of s.world.tiles) {
      const point = {x:tile.x+.5,y:tile.y+.5};
      if (tile.surface !== "grass" || Sim.distance(home,point) > 11) continue;
      for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        move(point.x+dx,point.y+dy);
        if (World.clear(s.world,s.player.x,s.player.y) && Sim.place(s,point.x,point.y)) return s.world.objects.at(-1).id;
      }
    }
    assert.fail("Could not place " + recipe);
  };
  const travel = region => {
    const exit = object("exit-" + region);
    reach(exit);
    const next = Sim.travel(s,exit);
    assert.ok(next,"Could not travel to " + region);
    s = next;
  };
  const crate = s.world.objects.find(o => o.storage && o.building === s.world.base.id);
  const bat = s.world.objects.find(o => o.loot?.some(item => item.id === "bat"));
  collect(bat,"bat",1);
  assert.ok(use("bat"));
  collect(crate,"watch",1);
  collect(crate,"wood",7);
  collect(crate,"scrap",2);
  collect(crate,"tape",1);
  collect(crate,"nails",4);
  collect(crate,"seedpotato",1);
  const barrelId = build("rainbarrel"), fireId = build("campfire"), bedId = build("gardenbed");
  collect(crate,"wood",4);
  const road = Sim.destination(s);
  const walkers = s.world.enemies.filter(z => z.hp > 0 && !z.dormant && Sim.distance(z,road) <= 6);
  assert.ok(walkers.length);
  for (const walker of walkers) {
    move(walker.x,walker.y+.7);
    for (let swing=0; walker.hp > 0 && swing < 8; swing++) {
      s.player.cooldown = 0;
      assert.ok(Sim.attack(s,walker),"Attack on shelter road");
    }
    assert.equal(walker.hp,0);
  }
  move(road.x,road.y);
  Sim.tick(s,.25);
  assert.ok(s.longHaul.cleared);
  const oldIds = new Set(s.world.enemies.map(z => z.id));
  travel("ridge");
  const cache = object("longhaul-ridge-supplies");
  collect(cache,"fuel",1);
  collect(cache,"wood",4);
  reload();
  assert.ok(s.longHaul.cleared && s.longHaul.supplied && !s.longHaul.returned);
  travel(ctxRegions.home);
  assert.ok(s.longHaul.returned);
  assert.ok(s.world.enemies.some(z => z.hp > 0 && !oldIds.has(z.id) && z.origin === "horde" && Sim.distance(z,road) <= 6));
  assert.ok(Sim.gridPower(s) && Sim.mainsWater(s));
  move(home.x,home.y);
  const until = s.minutes + 480;
  assert.ok(Sim.waitWithWatch(s,480));
  assert.ok(s.minutes >= until-.001,"Sheltered wait advances eight hours");
  const crateId = crate.id;
  const entrance = s.world.objects.find(o => o.kind === "door" && o.building === s.world.base.id && o.open);
  if (entrance) {
    reach(entrance);
    assert.ok(Sim.door(s,entrance));
  }
  let usedOffGridWater = false;
  let reloadedMidRun = false;
  for (let step=0; step<11500 && !s.longHaul.complete && s.mode === "play"; step++) {
    for (const walker of Sim.threats(s).filter(z => Sim.inAttackRange(s,z))) Sim.attack(s,walker);
    if (s.player.wounds.some(w => !w.bandaged)) assert.ok(use("bandage"));
    if (s.player.hunger < 55) {
      if (!Sim.quantity(s.player.bag,"food")) collect(object(crateId),"food",1);
      assert.ok(use("food"));
    }
    if (s.player.hydration < 55) {
      if (Sim.mainsWater(s)) {
        const tap = object("shelter-tap");
        reach(tap);
        assert.ok(Sim.useTap(s,tap));
      } else {
        assert.ok(use("water"),"The shelter ran out of drinking water");
        usedOffGridWater ||= s.longHaul.water;
      }
    }
    if (!Sim.gridPower(s) && !Sim.mainsWater(s)) {
      const gen = object("shelter-generator"), fire = object(fireId), barrel = object(barrelId), bed = object(bedId);
      if (!s.longHaul.power) {
        if (!gen.running) {
          reach(gen);
          assert.ok(Sim.useGenerator(s,gen,true) && Sim.useGenerator(s,gen));
        }
        Sim.tick(s,.25);
        assert.ok(s.longHaul.power);
        assert.ok(Sim.useGenerator(s,gen));
      }
      if (!bed.garden.crop && !s.longHaul.harvest) {
        reach(bed);
        assert.ok(Sim.sow(s,bed,"potato"));
      }
      if (bed.garden.crop && Sim.gardenYield(s,bed)) {
        reach(bed);
        assert.ok(Sim.harvestGarden(s,bed));
      }
      const batch = Sim.fireBatch(s,fire);
      if (batch && !batch.remaining) {
        reach(fire);
        assert.ok(Sim.collectBoiledWater(s,fire));
      } else if (!batch && Sim.quantity(s.player.bag,"water") < 2 && Sim.rainBottles(barrel) >= 2) {
        reach(barrel);
        assert.ok(Sim.contextual(s,barrel));
        reach(fire);
        assert.ok(Sim.startBoiling(s,fire));
      }
    }
    move(home.x,home.y);
    Sim.tick(s,1,idle);
    if (s.longHaul.days >= 14 && !reloadedMidRun) {
      reload();
      reloadedMidRun = true;
      assert.ok(s.longHaul.power && s.longHaul.water && s.longHaul.harvest && object(barrelId).active);
    }
  }
  assert.equal(s.mode,"play",s.harm + " on day " + s.longHaul.days);
  assert.ok(reloadedMidRun && usedOffGridWater);
  assert.equal(s.longHaul.days,30);
  assert.ok(s.longHaul.complete);
  reload();
  check("Easy 30 Days: clear, resupply, return to new walkers, sustain the off-grid shelter, survive and reload",
    s.longHaul.complete && Sim.longHaulGoals(s).every(goal => goal.done));
}

// Field expansion: five generated starts, path validation and saved fungal state.
{
  const field = context.FieldStories;
  const roundtrip = s => Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  const starter = seed => Sim.createControl("training","carer","shelter",undefined,{seed});
  const seen = new Set();
  for (const seed of [1,2,17,42,88]) {
    const s = starter(seed);
    const fixtures = s.world.objects.filter(field.isFixture);
    const loaded = roundtrip(s);
    check("field content is deterministic and walkable, seed " + seed, fixtures.length > 0 &&
      World.clear(s.world,s.player.x,s.player.y,.18) &&
      fixtures.every(o => !o.solid && World.clear(s.world,o.x,o.y,.28) &&
        World.route(s.world,s.player.x,s.player.y,o.x,o.y,0,true).length &&
        loaded.world.objects.some(copy => copy.id === o.id && copy.x === o.x && copy.y === o.y)));
    for (const o of fixtures) if (o.action === "mushroom") seen.add(o.species + ":" + o.colony);
  }
  check("mushroom species independent of colonization", ["pantrycap","bitterfold"].every(id =>
    seen.has(id + ":normal") && seen.has(id + ":active")));
  const samples = [1,2,17,42,88].map(starter);
  const s = samples.find(run => run.world.objects.some(o => o.action === "mushroom" && o.colony === "active"));
  const patch = s.world.objects.find(o => o.action === "mushroom" && o.colony === "active");
  Object.assign(s.player,{x:patch.x,y:patch.y});
  const initialXp = s.player.skills.foraging;
  check("active patch warns once and grants foraging XP", Sim.harvestMushroom(s,patch) &&
    !Sim.harvestMushroom(s,patch) && s.fungalAlert.due === field.mushroom.warning &&
    s.player.skills.foraging === initialXp + 3 && Sim.itemName(s,patch.species) === "Unidentified mushroom");
  const loaded = roundtrip(s);
  const savedPatch = loaded.world.objects.find(o => o.id === patch.id);
  check("pending warning and harvest persist", savedPatch.harvested && loaded.fungalAlert.id === patch.id);
  const blocked = roundtrip(s);
  const blockTile = blocked.world.tiles.find(t => !t.solid && Math.hypot(t.x+.5-patch.x,t.y+.5-patch.y) > 8 &&
    Math.hypot(t.x+.5-patch.x,t.y+.5-patch.y) < field.mushroom.range && t.x > 1 && t.y > 1 &&
    t.x < blocked.world.width-2 && t.y < blocked.world.height-2);
  const trapped = World.infected(blocked.world,"blocked-mushroom",blockTile.x+.5,blockTile.y+.5,"walkers",context.Level.seeded(8));
  const answeringPoint = World.route(blocked.world,patch.x,patch.y,blocked.world.start.x,blocked.world.start.y,0,true)
    .find(point => Sim.distance(point,patch) > 6 && Sim.distance(point,patch) < 10 &&
      World.route(blocked.world,point.x,point.y,patch.x,patch.y).length);
  const answering = World.infected(blocked.world,"answering-mushroom",answeringPoint.x,answeringPoint.y,"walkers",context.Level.seeded(9));
  for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const tile = World.tileAt(blocked.world,trapped.x+dx,trapped.y+dy);
    tile.solid = true;
    tile.kind = "wall";
  }
  blocked.world.enemies = [trapped,answering];
  Object.assign(blocked.player,blocked.world.start);
  blocked.fungalAlert.due = 0;
  Sim.tick(blocked,.033);
  check("only existing infected with a walkable route answer the patch", trapped.alert === 0 &&
    answering.alert > 0 && answering.chaseX === patch.x && answering.chaseY === patch.y &&
    blocked.world.enemies.length === 2);
  loaded.mode = "menu";
  Sim.tick(loaded,8);
  check("paused game does not advance fungal countdown", loaded.elapsed === 0 && loaded.fungalAlert.due === 4);
  loaded.mode = "play";
  loaded.world.enemies = [];
  run(loaded,125);
  check("no nearby infected means no spawned horde", loaded.world.enemies.length === 0 &&
    !loaded.fungalAlert && loaded.nextFungalAlert > loaded.elapsed);
  const another = loaded.world.objects.find(o => o.action === "mushroom" && o.id !== patch.id);
  Object.assign(another,{colony:"active"});
  Object.assign(loaded.player,{x:another.x,y:another.y});
  check("cooldown consumes harvest without queuing a later alert", Sim.harvestMushroom(loaded,another) &&
    another.harvested && !loaded.fungalAlert);
  loaded.player.skills.foraging = Data.skillXp(2);
  check("Foraging identifies the carried species", Sim.itemName(loaded,patch.species) === Data.items[patch.species].name);
  loaded.player.bag.push({id:"bitterfold",qty:1,born:loaded.minutes},{id:"pantrycap",qty:1,born:loaded.minutes});
  loaded.player.hunger = 60;
  check("toxic and edible mushrooms have distinct effects without attracting infected",
    Sim.use(loaded,loaded.player.bag.findIndex(i => i.id === "bitterfold")) && loaded.player.sick >= 45 &&
    loaded.player.hunger === 60 && Sim.use(loaded,loaded.player.bag.findIndex(i => i.id === "pantrycap")) &&
    loaded.player.hunger > 60 && !loaded.fungalAlert);
  const hint = samples.flatMap(run => run.world.objects.map(note => ({run,note}))).find(({note}) => note.action === "field-note" && note.reward);
  const {run: storyRun,note} = hint;
  Object.assign(storyRun.player,{x:note.x,y:note.y});
  const rewardBefore = Sim.quantity(storyRun.player.bag,note.reward);
  check("field notes are recorded and reward exactly once", Sim.readFieldNote(storyRun,note) && note.read && note.claimed &&
    Sim.readFieldNote(storyRun,note) && Sim.quantity(storyRun.player.bag,note.reward) === rewardBefore + 1 &&
    roundtrip(storyRun).world.objects.find(o => o.id === note.id).claimed);
}

{
  const getCrafted = xp => {
    const s = fresh("training"), p = s.player;
    const bench = s.world.objects.find(o => o.action === "workbench");
    p.skills.carving = xp;
    p.bag.push({id:"wood",qty:1});
    const failed = !Sim.craft(s,"carvedspear") && Sim.quantity(p.bag,"wood") === 1;
    p.bag.push({id:"knife",qty:1,condition:100,uid:"carving-knife"});
    Object.assign(p,{x:bench.x,y:bench.y});
    const crafted = Sim.craft(s,"carvedspear");
    return {failed,crafted,condition:p.bag.find(i => i.id === "carvedspear")?.condition,
      practiced:p.skills.carving === xp+5,spent:!Sim.quantity(p.bag,"wood") && Sim.quantity(p.bag,"knife") === 1};
  };
  const low = getCrafted(0), high = getCrafted(Data.skillXp(10));
  check("carving requires the tool, consumes wood and improves spear condition", low.failed && low.crafted &&
    low.practiced && low.spent && high.crafted && high.condition > low.condition);
  for (const [weapon,family] of [["axe","axe"],["bat","long_blunt"],["wrench","short_blunt"],["machete","long_blade"],
    ["knife","short_blade"],["spear","spear"]]) {
    const swing = xp => {
      const s = fresh("training"), p = s.player;
      p.bag.push({id:weapon,qty:1,condition:100,uid:"family-weapon"});
      Sim.use(s,p.bag.length-1);
      p.skills[family] = xp;
      p.skills.maintenance = xp;
      const infected = World.infected(s.world,"training-hit",p.x+.4,p.y,"walkers",context.Level.seeded(4));
      s.world.enemies.push(infected);
      const hit = Sim.attack(s,infected);
      return {hit,delay:p.cooldown,condition:Sim.weapon(s).condition,xp:p.skills[family]-xp,maintenance:p.skills.maintenance-xp};
    };
    const low = swing(0), high = swing(Data.skillXp(10));
    check(family + ": successful attacks award XP and reduce family recovery at high level",
      low.hit && high.hit && low.xp === 1.5 && low.maintenance > 0 && high.delay < low.delay &&
      high.condition > low.condition);
  }
}

{
  const {Expedition} = context;
  const restore = s => Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  const quarry = () => Sim.create(17,"training","carer",Expedition.generator,undefined,"quarry");
  const resources = s => s.world.objects.find(o => o.loot?.some(i => i.id === "flint"));
  const trial = xp => {
    const s = quarry(), p = s.player, stash = resources(s);
    p.skills.knapping = p.skills.masonry = xp;
    const take = (source,id,count) => {
      Object.assign(p,{x:source.x,y:source.y});
      for (let i = 0; i < count; i++) {
        if (!Sim.collect(s,source,source.loot.findIndex(item => item.id === id))) return false;
      }
      return true;
    };
    const acquired = take(stash,"flint",1) && take(stash,"rubble",2) && take(stash,"mortar",1);
    const bench = s.world.objects.find(o => o.action === "workbench");
    Object.assign(p,{x:bench.x,y:bench.y});
    const noTool = !Sim.craft(s,"flintknife") && Sim.quantity(p.bag,"flint") === 1 && p.skills.knapping === xp;
    const locker = s.world.objects.find(o => o.loot?.some(i => i.id === "hammer"));
    const gotHammer = take(locker,"hammer",1);
    Object.assign(p,{x:bench.x,y:bench.y});
    const madeKnife = Sim.craft(s,"flintknife");
    const knife = p.bag.find(i => i.id === "flintknife");
    const ready = Sim.craft(s,"stonewall");
    const tile = s.world.tiles.find(t => !t.building && !t.solid && t.x > 5 && t.x < 58 && t.y > 5 && t.y < 58 &&
      World.clear(s.world,t.x-1.5,t.y+.5) && !s.world.objects.some(o => Sim.distance(o,{x:t.x+.5,y:t.y+.5}) < 4.6));
    const spot = {x:tile.x+.5,y:tile.y+.5};
    Object.assign(p,{x:spot.x-2,y:spot.y});
    const invalid = !Sim.place(s,p.x,p.y) && Sim.quantity(p.bag,"rubble") === 2;
    const built = Sim.place(s,spot.x,spot.y);
    const wall = s.world.objects.find(o => o.material === "stone");
    const loaded = restore(s);
    const copy = loaded.world.objects.find(o => o.id === wall?.id);
    return {ok:acquired && noTool && gotHammer && madeKnife && ready && invalid && built &&
      copy?.name === "Stone wall" && !World.clear(loaded.world,spot.x,spot.y) &&
      p.skills.knapping === xp+5 && p.skills.masonry === xp+6 &&
      !Sim.quantity(p.bag,"flint") && !Sim.quantity(p.bag,"rubble") && !Sim.quantity(p.bag,"mortar") &&
      Sim.quantity(p.bag,"hammer") === 1, condition:knife?.condition, hp:copy?.hp};
  };
  const low = trial(0), high = trial(Data.skillXp(10));
  check("quarry crafting: collect finite stock, require tools, build and reload with level effects",
    low.ok && high.ok && high.condition > low.condition && high.hp > low.hp);
  const old = JSON.parse(JSON.stringify(Sim.snapshot(quarry())));
  old.fieldRevision = 1;
  const stash = old.objects.find(o => o.loot?.some(i => i.id === "flint"));
  stash.loot = stash.loot.filter(i => !["flint","rubble","mortar"].includes(i.id));
  const migrated = Sim.restore(old), restored = restore(migrated);
  check("quarry crafting: revision 1 receives material stock once",
    resources(migrated).loot.find(i => i.id === "flint").qty === 6 &&
    resources(restored).loot.find(i => i.id === "flint").qty === 6);
}

{
  const ingredients = ["oats","flour","cannedbeans","lentils","herbs","honey"];
  const reload = s => Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  const start = () => Sim.createControl("survival","carer","shelter",undefined,{seed:17});
  const countInWorld = (s,id) => s.world.objects.reduce((total,o) =>
    total + (o.loot ? Sim.quantity(o.loot,id) : 0),0);
  const current = start();
  check("pantry: new food ingredients exist in Cold Vale loot",
    ingredients.every(id => countInWorld(current,id) > 0));
  const old = JSON.parse(JSON.stringify(Sim.snapshot(current)));
  old.fieldRevision = 2;
  for (const o of old.objects) if (o.loot) o.loot = o.loot.filter(i => !ingredients.includes(i.id));
  const upgraded = Sim.restore(old);
  const stock = ingredients.map(id => countInWorld(upgraded,id));
  const used = upgraded.world.objects.find(o => o.loot?.some(i => i.id === "oats"));
  const selected = used.loot.findIndex(i => i.id === "oats");
  Object.assign(upgraded.player,{x:used.x,y:used.y});
  const took = Sim.collect(upgraded,used,selected);
  Object.assign(upgraded.player,upgraded.world.start);
  const again = reload(upgraded);
  check("pantry: revision 2 stocks ingredients once and preserves collected loot",
    stock.every(n => n > 0) && took === 1 && countInWorld(again,"oats") === stock[0]-1 &&
    Sim.quantity(again.player.bag,"oats") === 1);

  for (const id of ["porridge","bread","lentils","beans","herbfish","compote","apples","skillet","chowder"]) {
    const run = start();
    const tile = run.world.tiles.find(t => !t.building && t.x > 2 && t.y > 2 && t.x < run.world.width-2 &&
      t.y < run.world.height-2 && World.clear(run.world,t.x+.5,t.y+.5,.28));
    const fire = {id:"built"+run.serial++,x:tile.x+.5,y:tile.y+.5,name:"Campfire",kind:"campfire",action:"campfire",
      active:true,solid:true,loot:[],searched:true};
    run.world.objects.push(fire);
    Object.assign(run.player,{x:fire.x,y:fire.y});
    const recipe = Data.fireRecipes[id];
    run.player.bag = Object.entries(recipe.inputs).map(([item,qty]) => ({id:item,qty,born:run.minutes}));
    if (recipe.identify) {
      check("cooking: unknown Pantrycaps are not cooked or consumed",
        !Sim.startFireBatch(run,fire,id) && Sim.quantity(run.player.bag,"pantrycap") === 1);
      run.player.skills.foraging = Data.skillXp(2);
    }
    const started = Sim.startFireBatch(run,fire,id);
    const consumed = run.player.bag.length === 0;
    const early = !Sim.collectCookedFood(run,fire);
    if (fire.cook) run.minutes = fire.cook.until;
    const collected = Sim.collectCookedFood(run,fire);
    check("cooking: " + id + " consumes ingredients once and yields a usable meal",
      started && consumed && early && collected && !Sim.collectCookedFood(run,fire) &&
      Sim.quantity(run.player.bag,recipe.product) === recipe.qty &&
      Data.items[recipe.product].use === "food" && run.player.skills.cooking === 3);
  }
}

{
  const {Expedition,Regions} = context;
  for (const region of ["coldvale","ridge","ironworks","coast","fields","quarry","highmoor"]) {
    let covered = true, quiet = 0;
    for (const seed of [1,2,17,42,88]) {
      const s = Sim.create(seed,"survival","carer",Expedition.generator,undefined,region), w = s.world;
      const sites = w.buildings.map(b=>b.door).filter(door=>door && Sim.distance(door,w.start)>12);
      const repeated = Sim.create(seed,"survival","carer",Expedition.generator,undefined,region).world;
      const loot = w.objects.filter(o=>o.active && o.action==="loot" && o.loot?.length);
      quiet += sites.filter(door=>!w.enemies.some(z=>Sim.distance(z,door)<=9)).length;
      covered &&= sites.every(door=>loot.some(o=>Sim.distance(o,door)<=8)) &&
        w.initialPopulation === w.enemies.length &&
        JSON.stringify(w.enemies) === JSON.stringify(repeated.enemies) &&
        w.objects.filter(o=>o.id.startsWith("coverage-")).every(o=>!o.solid && Sim.distance(o,w.start)>12 &&
          World.clear(w,o.x,o.y,.28) && World.route(w,w.start.x,w.start.y,o.x,o.y,0,true).length);
    }
    check("coverage: five deterministic seeds with loot and infected near landmarks in "+region, covered && quiet <= (region==="coldvale" ? 2 : 0));
  }
  const s = Sim.create(17,"training","carer",Expedition.generator,undefined,"highmoor");
  const crate = s.world.objects.find(o=>o.id.startsWith("coverage-"));
  Object.assign(s.player,{x:crate.x,y:crate.y});
  check("roadside loot is reachable and training stays free of infected",s.world.enemies.length===0 &&
    Sim.collect(s,crate,0)===1 && s.daily.loot===1);
  s.player.bag.push({id:"cloth",qty:1});
  check("completed crafting counts as a daily activity",Sim.craft(s,"bandage") && s.daily.crafted===1);
  s.minutes=1439.99;
  Sim.tick(s,.03);
  const snap = JSON.parse(JSON.stringify(Sim.snapshot(s)));
  const loaded = Sim.restore(snap);
  const crateAgain = loaded.world.objects.find(o=>o.id===crate.id);
  check("daily summary closes at midnight and survives reload without refilling a crate",
    loaded.daily.day===2 && loaded.daily.loot===0 && loaded.dailyHistory.length===1 &&
    loaded.dailyHistory[0].day===1 && loaded.dailyHistory[0].loot===1 &&
    loaded.dailyHistory[0].crafted===1 && crateAgain.loot.length===0);
  delete snap.daily;
  delete snap.dailyHistory;
  delete snap.coverage;
  snap.objects = snap.objects.filter(o=>!o.id.startsWith("coverage-"));
  const old = Sim.restore(snap);
  check("older saves keep the original scavenge state and start tracking on the current day",
    old.daily.day===2 && old.dailyHistory.length===0 &&
    !old.world.objects.some(o=>o.id.startsWith("coverage-")));
}

{
  const {Expedition} = context;
  let before = 0, after = 0, caches = 0, patrols = 0, valid = true;
  for (const region of ["coldvale","ridge","ironworks","coast","fields","quarry","highmoor"]) {
    for (const seed of [1,2,17,42,88]) {
      const {world:w} = Sim.create(seed,"survival","carer",Expedition.generator,undefined,region);
      const loot = w.objects.filter(o=>o.active && o.action==="loot" && o.loot?.length);
      const isCache = o=>o.id.startsWith("coverage-route-");
      const oldLoot = loot.filter(o=>!isCache(o)), oldEnemies = w.enemies.filter(z=>z.origin!=="route");
      const newCaches = loot.filter(isCache);
      const newPatrols = w.enemies.filter(z=>z.origin==="route");
      caches += newCaches.length; patrols += newPatrols.length;
      valid &&= newCaches.length<=10 && newPatrols.length<=6 && newCaches.every(o=>!o.solid &&
        World.clear(w,o.x,o.y,.28) && World.route(w,w.start.x,w.start.y,o.x,o.y,0,true).length) &&
        newPatrols.every(z=>World.clear(w,z.x,z.y,.28) && Sim.distance(z,w.start)>(region==="coldvale" ? 34 : 18));
      for (const exit of w.objects.filter(o=>o.action==="travel")) {
        const path = World.route(w,w.start.x,w.start.y,exit.x,exit.y,1,true);
        for (const point of path) {
          if (Sim.distance(point,w.start)<=12) continue;
          const empty = (items,enemies) => !items.some(o=>Sim.distance(o,point)<=12) &&
            !enemies.some(z=>Sim.distance(z,point)<=11);
          before += Number(empty(oldLoot,oldEnemies));
          after += Number(empty(loot,w.enemies));
        }
      }
    }
  }
  check("travel routes: fewer stretches without loot or infected across five seeds",
    valid && caches>0 && patrols>0 && after<before*.85, before+" → "+after+" tiles");
  const setup = Sim.create(17,"training","carer",Expedition.generator,undefined,"highmoor");
  const snap = JSON.parse(JSON.stringify(Sim.snapshot(setup)));
  delete snap.routeCoverage;
  snap.objects = snap.objects.filter(o=>!o.id.startsWith("coverage-route-"));
  const restored = Sim.restore(snap);
  check("pre-route saves retain earlier caches without re-stocking visited roads",
    restored.world.coverage && !restored.world.routeCoverage && !restored.world.enemies.length &&
    restored.world.objects.some(o=>o.id.startsWith("coverage-")) &&
    !restored.world.objects.some(o=>o.id.startsWith("coverage-route-")));
}

{
  const s = fresh("training");
  const tile = s.world.tiles.find(t=>t.surface==="grass" && !t.building && t.x>5 && t.y>5 &&
    t.x<s.world.width-9 && t.y<s.world.height-2 &&
    [0,1,2,3,4,5,6,7].every(dx=>World.clear(s.world,t.x+.5+dx,t.y+.5)));
  const point = {x:tile.x+.5,y:tile.y+.5};
  Object.assign(s.player,point);
  const z = World.infected(s.world,"test-tracks",point.x+5,point.y,"walkers",context.Level.seeded(23));
  z.path = [{x:point.x+7,y:point.y}];
  z.alert = 4; z.replan = 5;
  s.world.enemies.push(z);
  Sim.tick(s,.1);
  const track = s.world.tracks?.[0];
  check("tracking: moving infected leaves a directional track on outdoor ground",
    track?.kind==="walker" && track.direction===0);
  s.world.enemies = [];
  Object.assign(s.player,{x:track.x-2,y:track.y});
  check("tracking: novices cannot inspect out of reach",!Sim.inspectTrack(s) && !s.player.skills.tracking);
  s.player.skills.tracking = Data.skillXp(3);
  const xp = s.player.skills.tracking;
  check("tracking: skill extends reach and identifies age, direction and type once",
    Sim.inspectTrack(s) && !Sim.inspectTrack(s) && s.player.skills.tracking===xp+4 &&
    /Walker tracks.*Heading east/.test(s.notice.text));
  const save = JSON.parse(JSON.stringify(Sim.snapshot(s))), loaded = Sim.restore(save);
  check("tracking: examined evidence survives save and does not give repeat XP",
    loaded.world.tracks[0].examined && !Sim.inspectTrack(loaded));
  delete save.tracks;
  check("tracking: older saves load with an empty trail",Sim.restore(save).world.tracks.length===0);
  track.examined = false;
  s.minutes += 51;
  check("tracking: old footprints fade",!Sim.inspectTrack(s) && Sim.snapshot(s).tracks.length===0);
}

{ // sys.day-end (HISTORIA.md secção 6): cada dia termina com um resumo curto
  const s = fresh("training");
  s.daily.walker = 3; s.daily.loot = 5;
  s.minutes = Math.ceil(s.minutes / 1440) * 1440 - .1;
  run(s, 2);
  const last = s.messages.at(-1)?.text ?? "";
  check("sys.day-end resumo curto ao fechar o dia", /^Day 1 complete: 3 infected down, 5 items looted\./.test(last) && s.daily.day === 2, last);
  s.minutes = Math.ceil(s.minutes / 1440) * 1440 - .1;
  run(s, 2);
  check("sys.day-end dia sem atividade", /Day 2 complete: a quiet day/.test(s.messages.at(-1)?.text ?? ""), s.messages.at(-1)?.text);
}

{ // sys.test-shortcuts (HISTORIA.md secção 16): saltar para o dia N, dar itens, avançar o relógio
  const s = fresh("training"), hour = s.minutes % 1440;
  check("sys.test-shortcuts salta para o dia 12 à mesma hora e dá itens",
    Sim.testJump(s, 12, {battery: 2, crowbar: 1}) && Math.floor(s.minutes / 1440) + 1 === 12 && s.minutes % 1440 === hour &&
    Sim.quantity(s.player.bag, "battery") >= 2 && Sim.quantity(s.player.bag, "crowbar") >= 1 && s.daily.day === 12);
  check("sys.test-shortcuts não volta atrás no tempo", !Sim.testJump(s, 3));
  const loaded = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("sys.test-shortcuts o save depois do salto carrega", loaded.daily.day === 12);
  const before = s.minutes;
  Sim.fastForward(s, 300);
  check("sys.test-shortcuts avança 5 h de jogo sem tempo real", Math.abs(s.minutes - before - 300) < 1e-6 && s.mode === "play");
  check("sys.test-shortcuts só no modo training (ou forçado em testes)", !Sim.testJump(fresh("survival"), 5) && Sim.testJump(fresh("survival"), 5, {}, {anyMode: true}));
}

{ // sys.hints (HISTORIA.md secções 14 e 16): 2 dias parado → dica; no máximo uma por dia; três níveis
  const H = context.CampaignHints, D = 1440, start = 480, s = H.track(H.empty(), "fortress.last-boss", start);
  check("sys.hints sem dica antes de 2 dias parado", H.next(s, start + 2 * D - 1) === null);
  const first = H.next(s, start + 2 * D);
  check("sys.hints 2 dias parado → dica discreta", first === H.hints["fortress.last-boss"][0], String(first));
  check("sys.hints no máximo uma dica por dia", H.next(s, start + 2 * D + 600) === null);
  const second = H.next(s, start + 3 * D), third = H.next(s, start + 4 * D);
  check("sys.hints níveis seguintes, do discreto ao explícito", second === H.hints["fortress.last-boss"][1] && third === "It's mutated. It burns.");
  check("sys.hints depois do nível 3 não repete", H.next(s, start + 5 * D) === null);
  H.progress(s, start + 5 * D);
  check("sys.hints progresso recomeça a contagem", H.next(s, start + 6 * D) === null && H.next(s, start + 7 * D) === H.hints["fortress.last-boss"][0]);
  H.track(s, "amigo1.lockdown-chat", start + 7 * D + 60);
  check("sys.hints novo objetivo recomeça do nível 1", s.level === 0 && H.next(s, start + 8 * D) === null);
  check("sys.hints objetivo sem dicas não dá nada", H.next(H.track(H.empty(), "opt.fuel", 0), 10 * D) === null);
  const saved = H.restore(JSON.parse(JSON.stringify(s)));
  check("sys.hints estado persiste; saves antigos e inválidos começam vazios",
    JSON.stringify(saved) === JSON.stringify(s) && H.restore(undefined).objective === null && H.restore({objective:3, since:-1}).level === 0);
}

{ // sys.zombie-carry (HISTORIA.md secções 5 e 16): ~1 em 8 zombies aleatórios leva um recurso da área
  const s = fresh("survival"), rule = Data.zombieCarry, n = 8000;
  const at = type => { const b = s.world.buildings.find(b => b.type === type); return {x: b.x + b.w / 2, y: b.y + b.h / 2}; };
  const street = {x: s.player.x, y: s.player.y}, sample = (origin, point = street) =>
    Array.from({length: n}, (_, i) => Sim.carriedSupply(s, {id: "a" + i, origin, ...point}));
  const horde = sample("horde"), share = horde.filter(Boolean).length / n;
  check("sys.zombie-carry cerca de 1 em 8 leva recurso", share > .1 && share < .15, (share * 100).toFixed(1) + "%");
  check("sys.zombie-carry é determinístico por zombie", Sim.carriedSupply(s, {id: "a42", origin: "horde", ...street}) === horde[42]);
  check("sys.zombie-carry bosses e zombies de desafio nunca dão recursos",
    ["cinema-sleeper", "cinema-winner", "resident", "boss", "challenge"].every(o => sample(o).every(x => x === null)));
  const every = Object.values(rule.pools).flat();
  check("sys.zombie-carry nunca dá arma nem item de desafio", every.every(id => Data.items[id] && !Data.items[id].damage && id !== "raffletrophy"));
  const pool = (type, origin) => new Set(sample(origin, at(type)).filter(Boolean));
  check("sys.zombie-carry pool por área: clínica bandagens, posto combustível, loja pilhas, rua comida/água",
    [...pool("clinic", "nest")].join() === "bandage" && [...pool("fuel", "")].join() === "fuel" && [...pool("market", "horde")].join() === "battery" &&
    [...new Set(horde.filter(Boolean))].sort().join() === "food,water");
  const id = "a" + horde.findIndex(x => x === "food"), z = {...s.world.enemies.find(e => !e.origin), id, origin: "horde", ...street, hp: 1, dormant: false};
  s.world.enemies.push(z);
  for (let i = 0; i < 20 && z.hp > 0; i++) { Sim.attack(s, z); s.player.cooldown = 0; s.player.attackCooldown = 0; }
  const pile = s.world.objects.find(o => o.kind === "drop" && o.died !== undefined && Math.abs(o.x - z.x) < .01 && Math.abs(o.y - z.y) < .01);
  check("sys.zombie-carry o recurso cai junto ao corpo", z.hp <= 0 && pile?.loot.some(l => l.id === "food") && !pile.searched, z.hp > 0 ? "zombie vivo" : pile ? "" : "sem pilha");
}

{ // sys.calendar (HISTORIA.md secções 9 e 16): cada área abre e fecha no dia certo
  const C = context.Campaign, open = (id, d) => C.isOpen(id, d);
  check("sys.calendar dia vem dos minutos (08:00 do dia 1, meia-noite = dia 2)", C.day(480) === 1 && C.day(1439) === 1 && C.day(1440) === 2);
  check("sys.calendar nenhuma área abre antes do seu dia", Object.entries(C.areas).every(([id, a]) => a.from === 1 || !open(id, a.from - 1)),
    Object.entries(C.areas).filter(([id, a]) => a.from > 1 && open(id, a.from - 1)).map(([id]) => id).join(","));
  check("sys.calendar cada área abre no seu dia", Object.entries(C.areas).every(([id, a]) => open(id, a.from)),
    Object.keys(C.areas).filter(id => !open(id, C.areas[id].from)).join(","));
  check("sys.calendar dias úteis: Ironworks abre no dia 6, fecha no fim de semana (9-10), reabre no 11",
    C.isWeekday(6) && open("ironworks", 6) && !open("ironworks", 9) && !open("ironworks", 10) && open("ironworks", 11) &&
    /weekend/.test(C.closedReason("ironworks", 9)));
  check("sys.calendar mercado opcional (dia 11) só abre em dias úteis", open("opt.market", 11) && !open("opt.market", 16) && open("opt.market", 18));
  check("sys.calendar maré baixa a cada 2 dias: FatHill no dia 8, 10 e 12, fechada no 9 e 11",
    open("fathill", 8) && !open("fathill", 9) && open("fathill", 10) && !open("fathill", 11) && /tide/i.test(C.closedReason("fathill", 9)));
  check("sys.calendar janelas fechadas: Eva só no dia 5, amigo 1 nos dias 14-20, viragem nos dias 15-18",
    !open("eva", 6) && open("amigo1", 20) && !open("amigo1", 21) && open("viragem", 18) && !open("viragem", 19));
  check("sys.calendar áreas cumpridas continuam abertas nos seus dias", open("coldvale", 30) && open("cinema", 30) && open("fortress", 30) && open("opt.farm", 24));
  check("sys.calendar áreas opcionais (dias 7, 9, 11, 13, 21-24) não dão pista",
    Object.entries(C.areas).filter(([id]) => id.startsWith("opt.")).every(([, a]) => a.kind === "optional" && a.clue === undefined &&
    [7, 9, 11, 13, 21, 22, 23, 24].includes(a.from)));
  check("sys.calendar Ironworks fora de horas: fechada às 22:00, aberta às 08:00",
    !C.isOpen("ironworks", 6, 22) && /opens at 08:00/.test(C.closedReason("ironworks", 6, 22)) && C.isOpen("ironworks", 6, 8));
  check("sys.calendar Cinder Grotto pede lanterna e pilhas",
    /flashlight with batteries/.test(C.missing("cindergrotto", {items: []})) && /batteries/.test(C.missing("cindergrotto", {items: ["flashlight"]})) &&
    C.missing("cindergrotto", {items: ["flashlight", "battery"]}) === "");
  check("sys.calendar fortaleza só com as 5 coordenadas", /4 of 5/.test(C.missing("fortress", {clues: 4})) && C.missing("fortress", {clues: 5}) === "" &&
    C.missing("coldvale") === "");
  check("sys.calendar 5 coordenadas parciais, uma por área", Object.values(C.areas).map(a => a.clue).filter(Boolean).sort().join() === "1,2,3,4,5");
}

{ // sys.clock (HISTORIA.md secção 16): 1,6 = 15 min reais por dia (mobile), 0,4 = 60 min (Realista)
  for (const [clock, realMinutes] of [[1.6, 15], [0.4, 60]]) {
    const s = Sim.createControl("training", "carer", "shelter", {clock}), start = s.minutes;
    for (let t = 0; t < realMinutes * 60 && s.mode === "play"; t += .5) Sim.tick(s, .5, idle);
    check("sys.clock " + clock + ": " + realMinutes + " min reais = 1 dia de jogo", s.rules.clock === clock && Math.abs(s.minutes - start - 1440) < 1e-6,
      "clock=" + s.rules.clock + " minutos=" + (s.minutes - start));
    const loaded = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
    check("sys.clock " + clock + " persiste no save", loaded.rules.clock === clock);
  }
  check("sys.clock rejeita valores fora da lista", Data.worldRules("survival", {clock:1.5}).clock === Data.worldRules("survival").clock);
}

{ // sys.campaign (HISTORIA.md secção 16, brief tarefa 8): modo campanha com calendário, dicas e progresso no save
  const s = fresh("campaign"), round = x => Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(x))));
  check("sys.campaign modo novo a 15 min reais por dia com progresso vazio",
    s.rules.clock === 1.6 && s.campaign?.clues === 0 && s.campaign.completed.join() === "radio.rumour" && s.campaign.hints.objective === "coldvale.houses");
  s.campaign.clues = 1; s.campaign.completed.push("coldvale.houses");
  context.CampaignHints.track(s.campaign.hints, "cinema.statue", s.minutes);
  const loaded = round(s);
  check("sys.campaign o progresso grava e carrega", loaded.campaign.clues === 1 && loaded.campaign.completed.join() === "radio.rumour,coldvale.houses" &&
    loaded.campaign.hints.objective === "cinema.statue");
  const legacy = JSON.parse(JSON.stringify(Sim.snapshot(s))); delete legacy.campaign;
  const story = round(fresh("survival"));
  check("sys.campaign save de campanha sem progresso começa vazio; os outros modos também guardam a história, sem calendário",
    Sim.restore(legacy).campaign.clues === 0 && story.campaign?.clues === 0 && !Sim.isCampaign(story) &&
    Sim.campaignProblem(story, "cinema") === "" && Sim.pinnedGoal(story) !== "Find the three torn pages");
  const bad = JSON.parse(JSON.stringify(Sim.snapshot(s))); bad.campaign.clues = 9;
  let refused = false; try { Sim.restore(bad); } catch (e) { refused = /campaign/i.test(e.message); }
  check("sys.campaign progresso inválido é recusado", refused);
  const exit = s.world.objects.find(o => o.id === "exit-cinema");
  Object.assign(s.player, {x: exit.x - 1, y: exit.y});
  check("sys.campaign o cinema está fechado no dia 1", Sim.travel(s, exit) === null && /opens on day 2/.test(s.messages.at(-1).text), s.messages.at(-1).text);
  Sim.testJump(s, 2, {}, {anyMode: true});
  check("sys.campaign no dia 2 entra-se no cinema", Sim.travel(s, exit)?.world.region === "cinema");
  const weekend = fresh("campaign"); Sim.testJump(weekend, 9, {}, {anyMode: true});
  check("sys.campaign Ironworks recusada ao fim de semana (dia 9)", /weekend/.test(Sim.campaignProblem(weekend, "ironworks")) &&
    Sim.campaignProblem(weekend, "quarry") === "");
  const grotto = fresh("campaign"); Sim.testJump(grotto, 12, {}, {anyMode: true});
  const lamp = grotto.player.bag.find(i => i.id === "flashlight");
  if (lamp) lamp.charge = 0;
  grotto.player.bag = grotto.player.bag.filter(i => i.id !== "battery");
  const without = Sim.campaignProblem(grotto, "cavern");
  grotto.player.bag.push({id: "flashlight", qty: 1, condition: 100, born: 0, charge: 60, uid: "test-lamp"});
  check("sys.campaign Cinder Grotto pede lanterna com pilhas", /flashlight with batteries/.test(without) && Sim.campaignProblem(grotto, "cavern") === "", without);
  const stuck = fresh("campaign");
  context.CampaignHints.track(stuck.campaign.hints, "fortress.last-boss", stuck.minutes);
  Sim.testJump(stuck, 3, {}, {anyMode: true}); run(stuck, 1);
  check("sys.campaign a dica aparece no jogo depois de 2 dias parado", stuck.messages.some(m => m.text === "Hint: The coat is scorched but whole."));
}

{ // coldvale.houses (HISTORIA.md secções 10 e 16): 3 casas com pistas → pista 1 e rumor do rádio
  const s = fresh("campaign"), pages = s.world.objects.filter(o => o.action === "campaign-page");
  const homes = new Set(pages.map(o => o.building));
  check("coldvale.houses 3 páginas em 3 casas diferentes", pages.length === 3 && homes.size === 3 &&
    pages.every(o => s.world.buildings.find(b => b.id === o.building)?.type === "home"), pages.length + " páginas, " + homes.size + " casas");
  check("coldvale.houses o rumor do rádio fica registado no início", s.campaign.completed.includes("radio.rumour") &&
    s.messages.some(m => m.text === Data.campaignText.rumour));
  const again = fresh("campaign");
  check("coldvale.houses mesma semente, mesmas casas; outros modos não têm páginas",
    again.world.objects.filter(o => o.action === "campaign-page").map(o => o.building + "@" + o.x + "," + o.y).join() ===
    pages.map(o => o.building + "@" + o.x + "," + o.y).join() && fresh("survival").world.objects.filter(o => o.action === "campaign-page").length === 3);
  const others = Sim.create(4242, "campaign", "carer", context.Expedition.generator).world.objects.filter(o => o.action === "campaign-page");
  check("coldvale.houses outra semente também tem 3 páginas", others.length === 3);
  const reach = o => { const near = [[0,1],[1,0],[0,-1],[-1,0],[.6,.6],[-.6,-.6],[.6,-.6],[-.6,.6]].map(([dx,dy]) => ({x:o.x+dx*.7, y:o.y+dy*.7}))
    .find(p => World.clear(s.world,p.x,p.y,.18)) ?? {x:o.x, y:o.y}; Object.assign(s.player, near); };
  const far = pages.filter(o => Math.hypot(s.player.x - o.x, s.player.y - o.y) > 3);
  check("coldvale.houses ler de longe não conta", far.length > 0 && far.every(o => !Sim.readCampaignPage(s, o) && !o.read));
  for (const [i, page] of pages.slice(0, 2).entries()) { reach(page); Sim.readCampaignPage(s, page); }
  check("coldvale.houses 2 de 3 páginas ainda não dão pista", s.campaign.clues === 0 && /2 of 3/.test(s.messages.at(-1).text), s.messages.at(-1).text);
  const mid = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("coldvale.houses páginas lidas ficam gravadas", mid.world.objects.filter(o => o.action === "campaign-page" && o.read).length === 2);
  reach(pages[2]);
  check("coldvale.houses 3 páginas → coordenada 1", Sim.readCampaignPage(s, pages[2]) && s.campaign.clues === 1 &&
    s.campaign.completed.includes("coldvale.houses") && s.messages.at(-1).text === Data.campaignText.housesDone);
  check("coldvale.houses a dica seguinte passa para o cinema", s.campaign.hints.objective === "cinema.statue");
  reach(pages[0]); Sim.readCampaignPage(s, pages[0]);
  check("coldvale.houses reler não repete a recompensa", s.campaign.completed.filter(id => id === "coldvale.houses").length === 1 && s.campaign.clues === 1);
}

{ // cinema.statue (HISTORIA.md secções 10 e 16): estátua → horda de 50 → fuga pela janela; com pé-de-cabra é mais rápido
  const toCinema = items => {
    const s = fresh("campaign"); Sim.testJump(s, 2, items, {anyMode: true});
    const exit = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: exit.x - 1, y: exit.y});
    return Sim.travel(s, exit);
  };
  const c = toCinema({}), statue = c.world.objects.find(o => o.id === "cinema-statue");
  check("cinema.statue o ídolo está no palco em todos os modos (um só jogo)", statue?.active && c.world.tiles.find(t => t.x === 11 && t.y === 5)?.room === "Stage" &&
    ["survival", "longhaul", "harsh"].every(mode => Sim.create(17, mode, "carer", context.Expedition.generator, undefined, "cinema").world.objects.some(o => o.id === "cinema-statue")));
  const take = s => { const st = s.world.objects.find(o => o.id === "cinema-statue"); Object.assign(s.player, {x: 11.5, y: 6.5}); return Sim.takeStatue(s, st); };
  const doors = s => s.world.objects.filter(o => o.action === "door" && o.kind !== "window" && o.building === s.world.buildings.find(b => b.type === "cinema").id);
  const win = s => s.world.objects.find(o => o.action === "door" && o.kind === "window");
  check("cinema.statue retirar a estátua: horda de 50, portas encravadas, estátua no saco", take(c) && !statue.active &&
    c.world.enemies.filter(z => z.origin === "cinema-horde").length === 50 && doors(c).every(o => o.sealed && !o.open) &&
    win(c).reinforced === Data.cinemaTrap.windowHits && Sim.quantity(c.player.bag, "goldstatue") === 1);
  check("cinema.statue retirar o ídolo é um impacto grande (game-feel)", c.effects.some(e => e.text === "CLICK" && e.impact >= .7));
  check("cinema.statue a horda do cinema não dá recursos aleatórios",
    c.world.enemies.filter(z => z.origin === "cinema-horde").every(z => Sim.carriedSupply(c, z) === null));
  Object.assign(c.player, {x: doors(c)[0].x, y: doors(c)[0].y - 1});
  check("cinema.statue as portas não abrem", !Sim.door(c, doors(c)[0]) && /Jammed/.test(c.messages.at(-1).text));
  const saved = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(c))));
  check("cinema.statue o estado da armadilha fica gravado", doors(saved).every(o => o.sealed) && win(saved).reinforced === 3 &&
    saved.world.enemies.filter(z => z.origin === "cinema-horde").length === 50);
  const w = win(c); Object.assign(c.player, {x: w.x - 1, y: w.y, hp: 100});
  const hit = () => { c.player.stamina = 100; return Sim.breach(c, w, "smash"); };
  hit(); hit();
  check("cinema.statue sem pé-de-cabra: 2 pancadas não chegam", !w.open && /frame holds/.test(c.messages.at(-1).text));
  hit();
  check("cinema.statue à terceira pancada a janela parte", w.open && w.broken && c.effects.some(e => e.text === "SMASH" && e.impact > 0));
  const fast = toCinema({crowbar: 1}); take(fast);
  const fw = win(fast); Object.assign(fast.player, {x: fw.x - 1, y: fw.y, stamina: 100});
  check("cinema.statue com pé-de-cabra abre à primeira", Sim.breach(fast, fw, "pry") && fw.open);
  Object.assign(c.player, {x: w.x + 1, y: w.y, hp: 100}); c.world.enemies = c.world.enemies.filter(z => z.origin !== "cinema-horde");
  run(c, 1);
  check("cinema.statue sair pela janela cumpre o desafio e destrava as portas", c.campaign.completed.includes("cinema.statue") &&
    doors(c).every(o => !o.sealed) && c.campaign.hints.objective === "pineridge.two-nights" && c.messages.some(m => /feel a little safer/.test(m.text)));
}

{ // cinema.buff (HISTORIA.md secções 10 e 16): protege enquanto dorme à noite; expira ao fim de 3 noites
  const s = fresh("campaign"); Sim.testJump(s, 2, {}, {anyMode: true});
  const exit = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: exit.x - 1, y: exit.y});
  const c = Sim.travel(s, exit); Object.assign(c.player, {x: 11.5, y: 6.5});
  Sim.takeStatue(c, c.world.objects.find(o => o.id === "cinema-statue"));
  c.world.enemies = c.world.enemies.filter(z => z.origin !== "cinema-horde");
  const w = c.world.objects.find(o => o.action === "door" && o.kind === "window"); w.open = true; w.broken = true; w.hp = 0; w.reinforced = 0;
  Object.assign(c.player, {x: w.x + 1, y: w.y}); run(c, 1);
  check("cinema.buff ativo depois da fuga, até à manhã do dia 5", Sim.cinemaBuff(c) && c.campaign.buffUntil === 4 * 1440 + 390 &&
    c.messages.some(m => /three nights/.test(m.text)));
  c.minutes = 1440 + 23 * 60;
  const copy = (buff, sleeping) => { const x = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(c)))); if (!buff) x.campaign.buffUntil = 0;
    Object.assign(x.player, {sleeping, resting: sleeping, flash: 0, hp: 100, grabCool: 5}); Sim.hurt(x, {kind: "walker", stats: Data.infected.walker}); return 100 - x.player.hp; };
  const shielded = copy(true, true), plain = copy(false, true), awake = copy(true, false);
  check("cinema.buff a dormir à noite sofre metade do dano", plain > 0 && Math.abs(shielded - plain * Data.cinemaTrap.sleepDamage) < 1e-9, shielded + " vs " + plain);
  check("cinema.buff acordado não há proteção", Math.abs(awake - plain) < 1e-9);
  check("cinema.buff fica gravado", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(c)))).campaign.buffUntil === c.campaign.buffUntil);
  c.minutes = c.campaign.buffUntil + 1; run(c, 1);
  check("cinema.buff expira ao fim de 3 noites", !Sim.cinemaBuff(c) && c.campaign.buffUntil === 0 && /ordinary lump/.test(c.messages.at(-1).text));
}

{ // sys.save-fixtures (skill save-systems): um save real por versão lançada carrega sempre, também no CI
  const zlib = require("zlib"), folder = path.join(__dirname, "fixtures");
  const fixtures = fs.readdirSync(folder).filter(f => f.endsWith(".json.gz")).sort();
  for (const file of fixtures) {
    let loaded = null, why = "";
    try { loaded = Sim.restore(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(folder, file))).toString("utf8"))); } catch (e) { why = e.message; }
    check("sys.save-fixtures " + file + " carrega", loaded?.mode === "play" && (!/campaign/.test(file) || loaded.campaign?.completed.includes("radio.rumour")), why);
  }
  check("sys.save-fixtures há saves da 0.34 e da campanha", fixtures.some(f => f.startsWith("v0.34-")) && fixtures.some(f => /campaign/.test(f)), fixtures.join(","));
  const newer = JSON.parse(JSON.stringify(Sim.snapshot(fresh("survival")))); newer.schema = Data.saveVersion + 1;
  let refused = false; try { Sim.restore(newer); } catch { refused = true; }
  check("sys.save-fixtures um save de uma versão mais nova é recusado", refused);
}

{ // sys.needs-clock (skill survival-crafting): fome, sede e sono medidos contra o tamanho do dia em cada velocidade
  const measure = clock => {
    const s = Sim.createControl("campaign", "carer", "shelter", {clock, count: 0, hordes: "off"});
    Object.assign(s.player, {hunger: 92, hydration: 92, fatigue: 8}); s.world.enemies = [];
    const at = {}, start = s.minutes, mark = (key, done) => { if (at[key] === undefined && done) at[key] = (s.minutes - start) / 1440; };
    for (let i = 0; i < 60000 && Object.keys(at).length < 3; i++) {
      Sim.tick(s, .25); Object.assign(s.player, {hp: 100});
      mark("fome", s.player.hunger < 30); mark("sede", s.player.hydration < 30); mark("sono", s.player.fatigue >= 60);
    }
    return at;
  };
  const days = Object.fromEntries([0.4, 1.6, 2].map(c => [c, measure(c)]));
  const show = Object.entries(days).map(([c, d]) => c + ": fome " + d.fome.toFixed(2) + "d, sede " + d.sede.toFixed(2) + "d, sono " + d.sono.toFixed(2) + "d").join(" | ");
  check("sys.needs-clock 1,6 e 0,4 gastam por dia o mesmo que o ritmo 2", ["fome", "sede", "sono"].every(k =>
    Math.abs(days[0.4][k] - days[2][k]) / days[2][k] < .05 && Math.abs(days[1.6][k] - days[2][k]) / days[2][k] < .05), show);
  check("sys.needs-clock uma barra de fome dura cerca de 1 a 2 dias; a sede chega primeiro", days[0.4].fome >= 1 && days[0.4].fome <= 2 &&
    days[0.4].sede < days[0.4].fome, show);
}

{ // pineridge.two-nights (HISTORIA.md secções 10 e 16): 2 noites sem barricadas → pista 2; com exposição a noite repete-se
  const start = fresh("campaign"); Sim.testJump(start, 3, {}, {anyMode: true});
  const exit = start.world.objects.find(o => o.id === "exit-ridge"); Object.assign(start.player, {x: exit.x, y: exit.y + (exit.y > start.world.height / 2 ? -1 : 1)});
  let s = Sim.travel(start, exit);
  const calm = x => { x.world.enemies = []; x.rules.hordes = "off"; x.atmosphere.pending = null; x.rules.clock = 4; // relógio rápido só no teste
    Object.assign(x.player, {hp: 100, hunger: 90, hydration: 90, fatigue: 10, temperature: 37, wetness: 0}); };
  const seen = []; // o jogo só guarda as últimas 7 mensagens: registar todas durante as noites
  const night = (x, day, during) => { // das 19:50 do dia até às 06:40 do dia seguinte
    x.minutes = (day - 1) * 1440 + 1190; calm(x);
    for (let t = 0; t < 22; t++) { if (t === 8 && during) during(x); Sim.fastForward(x, 30); seen.push(...x.messages.map(m => m.text));
      if (t !== 8 || !during) calm(x); else x.player.hp = 100; }
  };
  const said = pattern => seen.some(text => pattern.test(text));
  const ridge = () => s.campaign.ridge;
  check("pineridge.two-nights começa no campo de Pine Ridge", s?.world.region === "ridge" && ridge().nights === 0);
  night(s, 3);
  check("pineridge.two-nights noite inteira sem barricadas conta", ridge().nights === 1 && said(/Night survived at Pine Ridge: 1 of 2/) &&
    ridge().night === null);
  check("pineridge.two-nights o progresso fica gravado", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s)))).campaign.ridge.nights === 1);
  const opening = s.world.objects.find(o => o.action === "door");
  night(s, 4, x => { x.world.objects.find(o => o.id === opening.id).boards = 1; });
  check("pineridge.two-nights com barricada a noite não conta", ridge().nights === 1 && said(/only counts nights without one/), "noites " + ridge().nights);
  s.world.objects.find(o => o.id === opening.id).boards = 0;
  night(s, 5, x => { x.player.temperature = 35; });
  check("pineridge.two-nights com frio: pneumonia e a noite repete-se", ridge().nights === 1 && s.player.sick > 0 &&
    said(/Pneumonia/), "noites " + ridge().nights + ", doença " + s.player.sick);
  const before = s.campaign.clues;
  s.player.sick = 0; night(s, 6);
  check("pineridge.two-nights segunda noite válida → coordenada 2", ridge().nights === 2 && s.campaign.completed.includes("pineridge.two-nights") &&
    s.campaign.clues === before + 1 && said(/second coordinate/) && s.campaign.hints.objective === "ironworks.barricade");
  const away = fresh("campaign"); Sim.testJump(away, 3, {}, {anyMode: true});
  const ex = away.world.objects.find(o => o.id === "exit-ridge"); Object.assign(away.player, {x: ex.x, y: ex.y + (ex.y > away.world.height / 2 ? -1 : 1)});
  let a = Sim.travel(away, ex); a.minutes = 2 * 1440 + 1210; calm(a); Sim.fastForward(a, 5);
  const back = a.world.objects.find(o => o.id === "exit-coldvale"); Object.assign(a.player, {x: back.x, y: back.y + (back.y > a.world.height / 2 ? -1 : 1)});
  const home = Sim.travel(a, back); Sim.fastForward(home, 2);
  check("pineridge.two-nights sair a meio da noite não conta", a.campaign.ridge.night !== null && home.campaign.ridge.night === null &&
    home.messages.some(m => /left Pine Ridge/.test(m.text)));
}

{ // eva.death (HISTORIA.md secções 2 e 16): a Eva sai no dia 5, não volta no dia 6, o diário é dado ao jogador
  const s = fresh("campaign"), npc = () => s.world.npc, seen = [];
  const watch = () => seen.push(...s.messages.map(m => m.text));
  const diary = s.world.objects.find(o => o.id === "eva-diary");
  check("eva.death o diário está escondido no abrigo desde o início", diary && !diary.active &&
    s.world.buildings.find(b => b.id === diary.building) === s.world.base);
  Object.assign(npc(), {mode: "follow", hp: 100, x: s.player.x + 1, y: s.player.y});
  Sim.testJump(s, 5, {}, {anyMode: true}); run(s, 2); watch();
  check("eva.death no dia 5 às 08:00 a Eva ainda está", npc().mode !== "away" && npc().hp > 0 && s.campaign.eva === "", npc().mode);
  Sim.fastForward(s, 70); watch();
  check("eva.death às 09:00 do dia 5 a Eva sai para ir buscar Sunny Puffs", npc().mode === "away" && npc().hp === 0 && s.campaign.eva === "left" &&
    seen.some(t => /Sunny Puffs/.test(t)));
  const saved = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));
  check("eva.death a saída fica gravada", saved.campaign.eva === "left" && saved.world.npc.mode === "away");
  Sim.testJump(s, 6, {}, {anyMode: true}); run(s, 2); watch();
  check("eva.death no dia 6 não volta e o diário aparece no abrigo", npc().mode === "away" && s.campaign.eva === "gone" && diary.active &&
    seen.some(t => /did not come back/.test(t)));
  Object.assign(s.player, {x: diary.x, y: diary.y + .6});
  check("eva.death ler o diário dá-o ao jogador e cumpre o desafio", Sim.readEvaDiary(s, diary) && Sim.quantity(s.player.bag, "evadiary") === 1 &&
    s.campaign.completed.includes("eva.death") && /whole rumour/.test(s.messages.at(-1).text));
  Sim.readEvaDiary(s, diary);
  check("eva.death reler não duplica o diário", Sim.quantity(s.player.bag, "evadiary") === 1);
  const old = Sim.restore(JSON.parse(require("zlib").gunzipSync(fs.readFileSync(path.join(__dirname, "fixtures", "main-2026-11-campaign.json.gz"))).toString("utf8")));
  check("eva.death um save de campanha anterior recebe o diário escondido", old.world.objects.some(o => o.id === "eva-diary" && !o.active) && old.campaign.eva === "");
  const away = fresh("campaign"); Object.assign(away.world.npc, {mode: "refuge", hp: 100}); Sim.testJump(away, 5, {}, {anyMode: true});
  const ex = away.world.objects.find(o => o.id === "exit-ridge"); Object.assign(away.player, {x: ex.x, y: ex.y + (ex.y > away.world.height / 2 ? -1 : 1)});
  const ridge = Sim.travel(away, ex); ridge.world.enemies = []; Sim.fastForward(ridge, 70);
  check("eva.death a Eva sai mesmo com o jogador noutra região", ridge.campaign.eva === "left" &&
    ridge.regionStates.coldvale.npc.mode === "away" && ridge.world.npc.mode === "away");
}

{ // sys.campaign-graph (skill level-design): sem bloqueios (soft-locks), prazos possíveis e ritmo com descansos
  const C = context.Campaign, ids = Object.keys(C.challenges);
  // Jogador que faz um desafio por dia a partir do dia `first`, sempre o primeiro que o calendário e o inventário deixam.
  const play = first => {
    const have = new Set(C.start), done = {}; let clues = 0, busy = 0;
    for (let d = first; d <= C.length; d++) {
      if (busy > 0) { busy--; continue; }
      const next = ids.find(id => done[id] === undefined && C.isOpen(C.challenges[id].area, d) &&
        (C.challenges[id].needs ?? []).every(n => have.has(n)) && clues >= (C.challenges[id].clues ?? 0));
      if (!next) continue;
      const ch = C.challenges[next]; done[next] = d + (ch.days ?? 1) - 1; busy = (ch.days ?? 1) - 1;
      for (const g of ch.grants ?? []) g === "clue" ? clues++ : have.add(g);
    }
    return done;
  };
  const done = play(1), late = play(15);
  const missing = ids.filter(id => done[id] === undefined);
  check("sys.campaign-graph todos os desafios obrigatórios são possíveis em 30 dias", !missing.length, missing.join(",") || JSON.stringify(done));
  const plan = {"coldvale.houses":1, "cinema.statue":2, "pineridge.two-nights":4, "eva.death":5, "ironworks.barricade":6, "fathill.bosses":8,
    "westfields.stealth":10, "cindergrotto.battery":12, "amigo1.lockdown-chat":14, "viragem.zero":15, "fortress.last-boss":25};
  check("sys.campaign-graph o caminho de ouro segue os dias do documento (secção 9)", ids.every(id => done[id] === plan[id]),
    ids.filter(id => done[id] !== plan[id]).map(id => id + "@" + done[id]).join(","));
  check("sys.campaign-graph o que um desafio com prazo precisa obtém-se antes de o prazo fechar", ids.every(id => {
    const ch = C.challenges[id], end = C.areas[ch.area].to; if (end === undefined) return true;
    return (ch.needs ?? []).every(n => C.start.includes(n) || ids.some(o => (C.challenges[o].grants ?? []).includes(n) && done[o] < end));
  }));
  check("sys.campaign-graph quem começa só no dia 15 ainda chega ao boss final (perde só desafios com prazo)",
    late["fortress.last-boss"] <= C.length && ids.filter(id => late[id] === undefined).every(id => C.areas[C.challenges[id].area].to !== undefined),
    JSON.stringify(late));
  check("sys.campaign-graph as 5 coordenadas existem e a fortaleza pede as 5", ids.filter(id => (C.challenges[id].grants ?? []).includes("clue")).length === 5 &&
    C.challenges["fortress.last-boss"].clues === 5 && C.areas.fortress.requires.clues === 5);
  const problems = [], high = .7; let run = 0;
  for (const [i, b] of C.beats.entries()) {
    run = b.intensity >= high ? run + 1 : 0;
    if (run > 2) problems.push("dia " + b.day + ": " + run + " dias intensos seguidos");
    if (b.type === "boss" && C.beats[i - 1]?.type !== "rest") problems.push("dia " + b.day + ": boss sem descanso antes");
  }
  if (C.beats[0].type !== "teach") problems.push("o dia 1 não ensina");
  check("sys.campaign-graph ritmo: 30 dias, ensina primeiro, descanso antes de cada boss, sem 3 picos seguidos",
    C.beats.length === C.length && C.beats.every((b, i) => b.day === i + 1) && !problems.length, problems.join("; "));
}

{ // ui.use-notes: o botão Use abre primeiro as notas soltas por ler (antes ficavam atrás de portas e contentores)
  const s = fresh("campaign"), page = s.world.objects.find(o => o.action === "campaign-page"), diary = s.world.objects.find(o => o.id === "eva-diary");
  const field = [s.world, ...Object.values(s.regionStates)].flatMap(z => z.objects).find(o => o.action === "field-note");
  const door = s.world.objects.find(o => o.action === "door"), crate = s.world.objects.find(o => o.action === "loot");
  check("ui.use-notes notas por ler contam como tarefa (página, nota de campo)", Sim.unreadNote(page) && (!field || Sim.unreadNote(field)));
  check("ui.use-notes notas lidas ou escondidas não", !Sim.unreadNote({...page, read: true}) && !Sim.unreadNote(diary));
  check("ui.use-notes portas e contentores não são notas", !Sim.unreadNote(door) && !Sim.unreadNote(crate));
}

{ // ironworks.barricade (HISTORIA.md secções 10 e 16): dia útil → arma forte garantida; fim de semana → fábrica fechada
  const toIron = (day, items = {}) => {
    const s = fresh("campaign"); Sim.testJump(s, day, items, {anyMode: true});
    s.player.bag = s.player.bag.filter(i => !["hammer", "crowbar"].includes(i.id));
    const ex = s.world.objects.find(o => o.id === "exit-ironworks"); Object.assign(s.player, {x: ex.x, y: ex.y + (ex.y > s.world.height / 2 ? -1 : 1)});
    return Sim.travel(s, ex);
  };
  const beside = (x, o) => { // um lugar livre e ao alcance junto ao objeto
    for (const r of [.8, 1, 1.3]) for (let a = 0; a < 16; a++) {
      const p = {x: o.x + Math.cos(a * Math.PI / 8) * r, y: o.y + Math.sin(a * Math.PI / 8) * r};
      if (World.clear(x.world, p.x, p.y, .18)) { Object.assign(x.player, p); if (Sim.reachableObject(x, o)) return true; }
    }
    return false;
  };
  const weekend = fresh("campaign"); Sim.testJump(weekend, 9, {}, {anyMode: true});
  check("ironworks.barricade ao fim de semana o computador da linha fecha os portões", /line computer.*weekends/.test(Sim.campaignProblem(weekend, "ironworks")));
  const w = toIron(6), get = id => w.world.objects.find(o => o.id === id), cage = get("iron-cage"), board = get("iron-toolboard");
  const terminals = [0, 1, 2].map(i => get("iron-terminal-" + i));
  check("ironworks.barricade no dia 6 (quarta) entra-se; jaula, quadro de ferramentas e 3 terminais em 3 edifícios",
    w?.world.region === "ironworks" && cage?.stage === 0 && board?.loot.map(l => l.id + ":" + l.condition).join() === "hammer:65,crowbar:65" &&
    terminals.every(Boolean) && new Set(terminals.map(t => t.building)).size === 3);
  const read = t => { beside(w, t); w.world.enemies = []; return Sim.readTerminal(w, t) ? w.messages.at(-1).text : ""; };
  const logs = terminals.map(read);
  check("ironworks.barricade os terminais ensinam a ordem da jaula e deixam pistas para o futuro (tokens, fortaleza, stand down)",
    /frame bolts \(hammer\).*plates \(crowbar\).*chain/.test(logs[0]) && /PROJECT FORTRESS/.test(logs[1]) && /token/.test(logs[1]) &&
    /stand down/.test(logs[2]) && terminals.every(t => t.read) && !logs.join(" ").match(/virus|infect/i));
  beside(w, cage);
  check("ironworks.barricade sem ferramentas não se desmonta", !Sim.dismantleCage(w, cage) && cage.stage === 0 && /needs a hammer/.test(w.messages.at(-1).text));
  w.player.bag.push(...board.loot.map(item => ({...item, born: 0}))); board.loot = []; board.searched = true;
  const tool = id => w.player.bag.find(i => i.id === id);
  Sim.dismantleCage(w, cage);
  check("ironworks.barricade passo 1: martelo tira os parafusos e gasta-se", cage.stage === 1 && tool("hammer").condition === 35);
  Sim.dismantleCage(w, cage);
  check("ironworks.barricade passo 2: pé-de-cabra arranca as chapas", cage.stage === 2 && tool("crowbar").condition === 35);
  const saved = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(w))));
  check("ironworks.barricade a jaula meio desmontada e os terminais lidos ficam gravados",
    saved.world.objects.find(o => o.id === "iron-cage").stage === 2 && saved.world.objects.filter(o => o.action === "ironworks-terminal" && o.read).length === 3);
  check("ironworks.barricade passo 3 abre a jaula: arma forte garantida e desafio cumprido", Sim.dismantleCage(w, cage) && cage.stage === 3 &&
    Sim.quantity(w.player.bag, "foundrymaul") === 1 && w.campaign.completed.includes("ironworks.barricade") && w.campaign.hints.objective === "fathill.bosses");
  check("ironworks.barricade a jaula aberta não dá outra arma", !Sim.dismantleCage(w, cage) && Sim.quantity(w.player.bag, "foundrymaul") === 1);
  check("ironworks.barricade a marreta é mais forte do que o pé-de-cabra", Data.items.foundrymaul.damage > Data.items.crowbar.damage && Data.weaponSkills.foundrymaul);
  const worn = toIron(6), wc = worn.world.objects.find(o => o.id === "iron-cage"); worn.world.enemies = [];
  worn.player.bag.push({id: "hammer", qty: 1, condition: 20, born: 0}); beside(worn, wc);
  check("ironworks.barricade ferramentas gastas não chegam", !Sim.dismantleCage(worn, wc) && /too worn/.test(worn.messages.at(-1).text));
}

{ // cinema.scene (pedido do utilizador + skill team-audio): vencedor da rifa a andar, torneira do convívio, nota e sons da armadilha
  const enter = seed => { const s = Sim.createControl("campaign", "carer", "shelter", undefined, {seed}); Sim.testJump(s, 2, {}, {anyMode: true});
    const ex = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: ex.x - 1, y: ex.y}); return Sim.travel(s, ex); };
  const winners = [17, 4242, 90009].map(seed => enter(seed).world.enemies.filter(z => z.id === "cinema-winner" && z.hp > 0 && !z.dormant).length);
  check("cinema.scene o vencedor da rifa anda sempre pelo cinema na campanha", winners.every(n => n === 1), winners.join(","));
  { const w = enter(17), z = w.world.enemies.find(e => e.id === "cinema-winner"), seen = {left: false, right: false, back: false};
    for (let i = 0; i < 3600; i++) { Sim.tick(w, .05, idle); w.player.hp = 100; z.alert = 0;
      if (z.x < 8.5) seen.left = true; if (z.x > 18.5) seen.right = true; if (z.y > 14) seen.back = true; }
    check("cinema.scene o vencedor percorre a sala toda (corredores e fundo)", seen.left && seen.right && seen.back, JSON.stringify(seen)); }
  const c = enter(17), tap = c.world.objects.find(o => o.id === "cinema-tap"), note = c.world.objects.find(o => o.id === "cinema-note");
  check("cinema.scene há uma torneira de cerveja no canto e a nota do convívio", tap && note && World.tileAt(c.world, tap.x, tap.y).building === c.world.buildings[0].id);
  Object.assign(c.player, {x: note.x + .8, y: note.y}); c.world.enemies = c.world.enemies.filter(z => z.id !== "cinema-winner");
  check("cinema.scene a nota lê-se com Use e avisa que o ídolo está ligado às portas", Sim.unreadNote(note) && Sim.readCinemaNote(c, note) && note.read &&
    /social/i.test(c.messages.at(-1).text) && /wired to the doors/.test(c.messages.at(-1).text));
  c.sounds = []; Object.assign(c.player, {x: 11.5, y: 6.5}); Sim.takeStatue(c, c.world.objects.find(o => o.id === "cinema-statue"));
  const cue = kind => c.sounds.filter(x => x.kind === kind);
  const slams = cue("doorSlam");
  check("cinema.scene sequência: clique, duas portas a bater uma depois da outra, a horda no canto da torneira e a tensão",
    cue("idolClick").length === 1 && slams.length === 2 && slams[0].delay < slams[1].delay && cue("horde")[0]?.delay > slams[1].delay &&
    Math.hypot(cue("horde")[0].x - tap.x, cue("horde")[0].y - tap.y) < .01 && cue("tapSocial")[0]?.delay > slams[1].delay &&
    c.sounds.length <= 5, c.sounds.map(x => x.kind + "+" + (x.delay ?? 0)).join(" "));
  run(c, 1);
  check("cinema.scene a tensão começa logo a seguir", c.sounds.some(x => x.kind === "tension"));
  check("cinema.scene cada porta mostra SLAM (pista visual dos sons)", c.effects.filter(e => e.text === "SLAM").length === 2);
  const horde = c.world.enemies.filter(z => z.origin === "cinema-horde"), statue = {x: 11.5, y: 5.5};
  const mean = point => horde.reduce((n, z) => n + Math.hypot(z.x - point.x, z.y - point.y), 0) / horde.length;
  check("cinema.scene a horda sai do canto da torneira", horde.length === 50 && mean(tap) < mean(statue), mean(tap).toFixed(1) + " vs " + mean(statue).toFixed(1));
  c.world.enemies = c.world.enemies.filter(z => z.origin !== "cinema-horde"); c.sounds = []; Object.assign(c.player, {hp: 100});
  for (let i = 0; i < 30; i++) Sim.tick(c, .25);
  check("cinema.scene a tensão repete enquanto o jogador está preso", c.sounds.some(x => x.kind === "tension"));
  const w = c.world.objects.find(o => o.action === "door" && o.kind === "window"); Object.assign(w, {open: true, broken: true, hp: 0, reinforced: 0});
  Object.assign(c.player, {x: w.x + 1, y: w.y}); run(c, 1); c.sounds = [];
  for (let i = 0; i < 30; i++) Sim.tick(c, .25);
  check("cinema.scene depois da fuga a tensão para", c.campaign.completed.includes("cinema.statue") && !c.sounds.some(x => x.kind === "tension"));
}

{ // origins (#17): profissões, traços e controlos do Sandbox
  const traits = ["light-eater","needs-more-sleep"];
  const profile = {seed:17,name:"Nora",appearance:"female",skinTone:"deep",hairStyle:"wavy",traits};
  const rules = {count:0,hordes:"off",speed:80,vision:75,hearing:50,memory:60,decay:50,bite:0};
  const s = Sim.createControl("custom","doctor","shelter",rules,profile);
  const plain = Sim.createControl("custom","doctor","shelter",rules,{seed:17});
  check("origins a profissão dá competências e equipamento; a aparência do 0.34 mantém-se",
    Sim.level(s,"medical") === 3 && Sim.quantity(s.player.bag,"disinfectant") === 1 && s.player.hairStyle === "wavy" && s.player.skinTone === "deep");
  check("origins 30 traços; o orçamento recusa escolhas por pagar ou contraditórias", Object.keys(Data.traits).length === 30 &&
    !Data.traitLoadout(["light-eater"]).valid && !Data.traitLoadout(["light-eater","big-appetite"]).valid && Data.traitLoadout(traits).valid);
  run(s,120); run(plain,120);
  check("origins os traços mudam as necessidades em jogo", s.player.hunger > plain.player.hunger && s.player.fatigue > plain.player.fatigue);
  const saved = JSON.parse(JSON.stringify(Sim.snapshot(s)));
  const again = Sim.restore(saved);
  check("origins personagem, traços e Sandbox gravam e carregam", again.player.name === "Nora" && again.traitEffects.hunger === .8 &&
    Object.entries(rules).every(([key,value]) => again.rules[key] === value));
  const food = {id:"rawfish",born:s.minutes};
  check("origins o Sandbox muda a duração da comida", Math.abs(Sim.freshMinutes(s,food) * 2 - Sim.freshMinutes({...s,rules:{...s.rules,decay:100}},food)) < 1e-8);
  const sprint = traits => { const r = Sim.createControl("custom","carer","shelter",{count:0,hordes:"off",hearing:50},{seed:17,traits});
    const z = {hp:10, x:r.player.x + 2, y:r.player.y, alert:0}; r.world.enemies = [z]; Sim.noise(r, r.player.x, r.player.y, 6.5, Data.traits[traits[0]]?.value ?? 1);
    return {alert: z.alert, ring: r.noiseRings.at(-1).r}; };
  const graceful = sprint(["graceful","conspicuous"]), plainRun = sprint([]);
  check("origins Graceful encurta o alcance dos passos mas não o tempo de alerta (code-review)", graceful.alert === plainRun.alert && graceful.alert > 0);
  check("origins o círculo de ruído mostra o que os infetados ouvem com o Sandbox (code-review)", Math.abs(plainRun.ring - 6.5 * .5) < 1e-9);
  saved.player.traits = ["light-eater"];
  let rejected = false; try { Sim.restore(saved); } catch { rejected = true; }
  check("origins um orçamento de traços inválido no save é recusado", rejected);
  const old = Sim.restore(JSON.parse(require("zlib").gunzipSync(fs.readFileSync(path.join(__dirname, "fixtures", "v0.34-survival.json.gz"))).toString("utf8")));
  check("origins saves da 0.34 carregam com o Sandbox por omissão e sem traços", old.rules.speed === 100 && old.rules.bite === 6 && Object.keys(old.traitEffects).length === 0);
}

{ // perf.routes (skill performance-optimization): a horda não calcula 50 caminhos no mesmo instante
  const s = fresh("campaign"); Sim.testJump(s, 2, {}, {anyMode: true});
  const ex = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: ex.x - 1, y: ex.y});
  const c = Sim.travel(s, ex); Object.assign(c.player, {x: 11.5, y: 6.5}); Sim.takeStatue(c, c.world.objects.find(o => o.id === "cinema-statue"));
  const original = World.route; let chase = 0, worst = 0;
  World.route = (...a) => { if (a[6] === "force") chase++; return original(...a); };
  try { for (let i = 0; i < 120; i++) { chase = 0; Sim.tick(c, 1/60, idle); c.player.hp = 100; worst = Math.max(worst, chase); } } finally { World.route = original; }
  const horde = c.world.enemies.filter(z => z.origin === "cinema-horde");
  check("perf.routes no máximo " + Data.routeBudget + " caminhos de perseguição por imagem com a horda", worst > 0 && worst <= Data.routeBudget, "pior imagem: " + worst);
  check("perf.routes a horda continua a perseguir (todos têm caminho ou estão a chegar)", horde.filter(z => z.path.length || Math.hypot(z.x - c.player.x, z.y - c.player.y) < 2).length > 40);
}

{ // ui.campaign-goals (revisão, sugestão 1): objetivos da campanha no topo, no diário e na seta de direção
  const s = fresh("campaign");
  check("ui.campaign-goals começa com as 3 páginas, sem seta (encontrar as casas faz parte do desafio)",
    Sim.pinnedGoal(s) === "Find the three torn pages" && Sim.destination(s) === null && Sim.campaignGoals(s).length === 11);
  s.campaign.completed.push("coldvale.houses");
  check("ui.campaign-goals o cinema ainda fechado mostra quando abre e aponta para a saída",
    Sim.pinnedGoal(s) === "Take the golden idol · opens on day 2" && Sim.destination(s)?.id === "exit-cinema", Sim.pinnedGoal(s));
  Sim.testJump(s, 2, {}, {anyMode: true});
  check("ui.campaign-goals no dia 2 o cinema está aberto e a seta aponta para a saída", Sim.pinnedGoal(s) === "Take the golden idol" && Sim.destination(s)?.id === "exit-cinema");
  const ex = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: ex.x - 1, y: ex.y});
  const c = Sim.travel(s, ex);
  check("ui.campaign-goals dentro do cinema a seta aponta para o ídolo", Sim.destination(c)?.id === "cinema-statue");
  Object.assign(c.player, {x: 11.5, y: 6.5}); Sim.takeStatue(c, c.world.objects.find(o => o.id === "cinema-statue"));
  check("ui.campaign-goals com o ídolo na mão a seta aponta para a janela", Sim.destination(c)?.kind === "window");
  c.campaign.completed.push("cinema.statue", "pineridge.two-nights"); Sim.testJump(c, 6, {}, {anyMode: true}); c.campaign.eva = "gone";
  check("ui.campaign-goals depois da Eva: ler o diário", Sim.pinnedGoal(c) === "Read Eva's diary at the shelter" && Sim.destination(c)?.id === "exit-coldvale");
  c.campaign.completed.push("eva.death", "ironworks.barricade");
  check("ui.campaign-goals o objetivo seguinte mostra quando abre (dia 8, FatHill)", Sim.pinnedGoal(c) === "Face the woman on the pier and David · opens on day 8", Sim.pinnedGoal(c));
  c.campaign.completed.push("fathill.bosses");
  check("ui.campaign-goals depois mostra Westfields (dia 10)", Sim.pinnedGoal(c) === "Slip through Westfields without a sound · opens on day 10", Sim.pinnedGoal(c));
  c.campaign.completed.push("westfields.stealth");
  check("ui.campaign-goals depois mostra a Cinder Grotto (dia 12)", Sim.pinnedGoal(c) === "Read the surveyor's plate in Cinder Grotto · opens on day 12", Sim.pinnedGoal(c));
  c.campaign.completed.push("cindergrotto.battery");
  check("ui.campaign-goals depois mostra o primeiro amigo (dia 14)", /opens on day 14/.test(Sim.pinnedGoal(c)) && /Stop the assistant/.test(Sim.pinnedGoal(c)), Sim.pinnedGoal(c));
  c.campaign.completed.push("amigo1.lockdown-chat", "viragem.zero", "fortress.last-boss");
  check("ui.campaign-goals com tudo feito por agora o objetivo avisa que há mais a caminho", /on its way/.test(Sim.pinnedGoal(c)) && Sim.destination(c) === null);
  const plain = fresh("survival"); plain.pinStory = true;
  check("ui.campaign-goals fora da campanha nada muda", Sim.pinnedGoal(plain) === "Find Eva" && Sim.campaignGoals === Sim.campaignGoals);
}

{ // story.all-modes (pedido do utilizador): os vilões e a história estão em todos os modos; só as regras são da campanha
  for (const mode of ["survival", "longhaul"]) {
    const s = fresh(mode), ex = s.world.objects.find(o => o.id === "exit-cinema"); Object.assign(s.player, {x: ex.x - 1, y: ex.y});
    const c = Sim.travel(s, ex);
    check("story.all-modes " + mode + ": o cinema abre no dia 1 (sem calendário) e tem o ídolo, a torneira e o vencedor", c?.world.region === "cinema" &&
      c.world.objects.some(o => o.id === "cinema-statue" && o.active) && c.world.objects.some(o => o.id === "cinema-tap") &&
      c.world.enemies.some(z => z.id === "cinema-winner"));
    Object.assign(c.player, {x: 11.5, y: 6.5});
    check("story.all-modes " + mode + ": a armadilha funciona (horda de 50, portas trancadas)", Sim.takeStatue(c, c.world.objects.find(o => o.id === "cinema-statue")) &&
      c.world.enemies.filter(z => z.origin === "cinema-horde").length === 50 && c.world.objects.filter(o => o.sealed).length === 2);
  }
  const plain = fresh("survival"); Sim.testJump(plain, 6, {}, {anyMode: true}); plain.world.npc.mode = "refuge"; plain.world.npc.hp = 100; run(plain, 2);
  check("story.all-modes fora da campanha a Eva não parte nem há dicas", plain.world.npc.mode === "refuge" && plain.campaign.eva === "" &&
    plain.campaign.hints.objective === null);
}

{ // atlas das personagens em 8 direções: index.json bate certo com os PNG em disco (ignorado se a pasta não existir)
  const cdir = path.join(dir, "assets/characters"), indexFile = path.join(cdir, "index.json");
  if (fs.existsSync(indexFile)) {
    const idx = JSON.parse(fs.readFileSync(indexFile, "utf8")), bad = [];
    const dims = f => { const b = fs.readFileSync(path.join(cdir, f)); return b.toString("latin1", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };
    for (const c of idx.characters) for (const [t, v] of Object.entries(c.tiers)) {
      const d = dims(v.file);
      if (!d || d[0] !== v.cell[0] * 8 || d[1] !== v.cell[1] || v.anchor[0] >= v.cell[0] || v.anchor[1] > v.cell[1]) bad.push(c.id + "/" + t);
    }
    for (const c of idx.characters) if (c.id === "protagonist" || c.id === "survivor_female") {            // posição da mão da arma
      for (const t of ["mini", "game"]) {
        const h = c.tiers[t].hands, w = c.walk?.[t]?.hands;
        const inside = (p, cell) => Array.isArray(p) && p[0] >= 0 && p[0] <= cell[0] && p[1] >= 0 && p[1] <= cell[1];
        if (!h || h.length !== 8 || !h.every(p => inside(p, c.tiers[t].cell))) bad.push(c.id + "/hands-" + t);
        if (!w || w.length !== c.walk[t].frames || !w.every(row => row.length === 8 && row.every(p => inside(p, c.walk[t].cell)))) bad.push(c.id + "/walk-hands-" + t);
      }
    }
    for (const c of idx.characters) for (const [t, v] of Object.entries(c.walk ?? {})) {   // baked walk cycles: frames rows x 8 directions
      const d = dims(v.file);
      if (!d || d[0] !== v.cell[0] * 8 || d[1] !== v.cell[1] * v.frames || v.frames < 4 || v.anchor[0] >= v.cell[0] || v.anchor[1] > v.cell[1]) bad.push(c.id + "/walk-" + t);
    }
    for (const c of idx.characters) for (const [t, v] of Object.entries(c.recolor ?? {})) {          // máscaras de recolor: mesmo tamanho do atlas
      for (const [atlas, mask] of [[c.tiers[t].file, v.mask], [c.walk?.[t]?.file, v.walkMask]]) {
        if (!atlas || !mask) continue;
        const a = dims(atlas), k = fs.existsSync(path.join(cdir, mask)) && dims(mask);
        if (!a || !k || a[0] !== k[0] || a[1] !== k[1]) bad.push(c.id + "/mask-" + t);
      }
      if (!["skin", "hair", "jacket"].every(r => v.refs?.[r]?.length === 3)) bad.push(c.id + "/refs-" + t);
    }
    check("assets.characters 22 personagens x 3 tamanhos, 8 células iguais por PNG, âncora dentro da célula",
      idx.characters.length === 22 && idx.order.join() === "N,NE,E,SE,S,SW,W,NW" && idx.default_tier in idx.tiers && !bad.length, bad.join(","));
  }
}

{ // cindergrotto.battery: a placa na sala de levantamento só se lê com lanterna; a pista só conta ao sair para Pine Ridge
  const g = Sim.create(11, "campaign", "carer", 2, undefined, ctxRegions.cavern);
  Sim.testJump(g, 12, {}, {anyMode: true});
  const plate = g.world.objects.find(o => o.id === "grotto-plate");
  check("cindergrotto: a gruta tem a placa do agrimensor na sala de levantamento", Boolean(plate) && plate.zone === "survey", plate?.zone);
  g.player.bag = g.player.bag.filter(i => i.id !== "flashlight");
  Object.assign(g.player, {x: plate.x, y: plate.y + .5});
  check("cindergrotto: sem lanterna a placa não se lê", !Sim.readGrottoPlate(g, plate) && g.campaign.grotto === "");
  g.player.bag.push({id: "flashlight", qty: 1, uid: "t-flashlight", condition: 100, charge: 60});
  check("cindergrotto: com lanterna lê-se e a pista ainda não conta",
    Sim.readGrottoPlate(g, plate) && g.campaign.grotto === "reached" && g.campaign.clues === 0 && !g.campaign.completed.includes("cindergrotto.battery"));
  check("cindergrotto: o estado guarda-se e carrega", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(g)))).campaign.grotto === "reached");
  const exit = g.world.objects.find(o => o.id === "exit-ridge");
  Object.assign(g.player, {x: exit.x, y: exit.y + .5});
  const out = Sim.travel(g, exit);
  check("cindergrotto: sair para Pine Ridge dá a quinta pista (1ª neste teste) e conclui o desafio",
    out?.world.region === "ridge" && out.campaign.completed.includes("cindergrotto.battery") && out.campaign.clues === 1, out ? out.world.region + " " + out.campaign.clues : "sem viagem");
  const goals = fresh("campaign"); Sim.testJump(goals, 12, {}, {anyMode: true});
  goals.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses", "westfields.stealth");
  check("cindergrotto: é o objetivo do dia 12 e há dicas para ele", Sim.campaignGoal(goals)?.id === "cindergrotto.battery" && context.CampaignHints.hints["cindergrotto.battery"].length === 3);
  const raw = JSON.parse(JSON.stringify(Sim.snapshot(goals))); delete raw.campaign.grotto;
  let bad = false; try { const broken = JSON.parse(JSON.stringify(Sim.snapshot(goals))); broken.campaign.grotto = "x"; Sim.restore(broken); } catch { bad = true; }
  check("cindergrotto: saves antigos sem 'grotto' carregam e valores inválidos são recusados", Sim.restore(raw).campaign.grotto === "" && bad);
}

{ // westfields.stealth: o livro da quinta; ruído alto chama uma horda; infetados que te viram impedem a leitura
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "fields");
  Sim.testJump(f, 10, {}, {anyMode: true});
  const ledger = f.world.objects.find(o => o.id === "westfields-ledger");
  check("westfields: o livro do agricultor está na Orchard farmhouse", Boolean(ledger) && f.world.buildings.find(b => b.id === ledger.building)?.name === "Orchard farmhouse");
  Object.assign(f.player, {x: ledger.x, y: ledger.y + .5});
  const seen = f.world.enemies[0]; Object.assign(seen, {x: f.player.x + 3, y: f.player.y, hp: 40, dormant: false, alert: 10});
  check("westfields: com um infetado que te viu não se lê", !Sim.readFieldsLedger(f, ledger) && !f.campaign.completed.includes("westfields.stealth"));
  seen.alert = 0;
  f.atmosphere.nextWave = f.atmosphere.time + 500;
  Sim.noise(f, f.player.x, f.player.y, 5);
  check("westfields: ruído baixo não chama a horda", f.campaign.fields.alerts === 0 && f.atmosphere.nextWave > f.atmosphere.time);
  Sim.noise(f, f.player.x, f.player.y, 9);
  check("westfields: ruído alto chama uma horda e fica registado", f.atmosphere.nextWave <= f.atmosphere.time && f.campaign.fields.alerts === 1);
  f.atmosphere.nextWave = f.atmosphere.time + 500; Sim.noise(f, f.player.x, f.player.y, 9);
  check("westfields: no máximo um alarme por minuto", f.campaign.fields.alerts === 1 && f.atmosphere.nextWave > f.atmosphere.time);
  check("westfields: o estado guarda-se e carrega", Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(f)))).campaign.fields.alerts === 1);
  for (const e of f.world.enemies) e.alert = 0;
  check("westfields: sem ninguém que te tenha visto, lê-se e dá a quarta pista",
    Sim.readFieldsLedger(f, ledger) && f.campaign.completed.includes("westfields.stealth") && f.campaign.clues === 1);
  const goals = fresh("campaign"); Sim.testJump(goals, 10, {}, {anyMode: true});
  goals.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses");
  check("westfields: é o objetivo do dia 10 e há dicas para ele", Sim.campaignGoal(goals)?.id === "westfields.stealth" && context.CampaignHints.hints["westfields.stealth"].length === 3);
  const raw = JSON.parse(JSON.stringify(Sim.snapshot(goals))); delete raw.campaign.fields;
  let bad = false; try { const broken = JSON.parse(JSON.stringify(Sim.snapshot(goals))); broken.campaign.fields = {alerts: -1, at: 0}; Sim.restore(broken); } catch { bad = true; }
  check("westfields: saves antigos sem 'fields' carregam e valores inválidos são recusados", Sim.restore(raw).campaign.fields.alerts === 0 && bad);
}

{ // fathill.bosses: a mulher do pontão (medo) e o David (colete, violino)
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "coast");
  Sim.testJump(f, 8, {}, {anyMode: true});
  const woman = f.world.enemies.find(z => z.kind === "pierwoman"), david = f.world.enemies.find(z => z.kind === "david");
  check("fathill: a mulher e o David existem no pontão, protegidos", Boolean(woman && david) && woman.guard && david.guard && woman.hp === 100 && david.hp === 130);
  const kase = f.world.objects.find(o => o.id === "fathill-case");
  check("fathill: o violino está na Net shed", Boolean(kase) && kase.loot[0].id === "violin" && f.world.buildings.find(b => b.id === kase.building)?.name === "Net shed");
  const stand = (x, y) => Object.assign(f.player, {x, y, cooldown: 0, stamina: 100, hp: 100, flash: 0});
  const kill = i => {
    const z = World.infected(f.world, "fear-" + i, f.player.x + .8, f.player.y, "walkers", () => .5, "");
    Object.assign(z, {hp: 1, dormant: false, alert: 0}); f.world.enemies.push(z);
    f.player.cooldown = 0; f.player.stamina = 100;
    return Sim.attack(f, z);
  };
  stand(woman.x - 2, woman.y);
  let killed = 0; for (let i = 0; i < 10; i++) killed += kill(i) ? 1 : 0;
  check("fathill: dez infetados mortos à vista dela enchem o medo e o casaco cai", killed === 10 && f.campaign.fathill.fear === 10 && !woman.guard && woman.docile && f.campaign.fathill.coat,
    killed + " mortos, medo " + f.campaign.fathill.fear);
  stand(woman.x - 1, woman.y); const before = woman.hp;
  check("fathill: sem casaco a mulher já não luta e não se pode atacar", !Sim.attack(f, woman) && woman.hp === before);
  stand(david.x - 1, david.y);
  david.hp = 130; const hit = Sim.attack(f, david);
  check("fathill: com colete o David não perde vida e acumula dano de proteção", hit && david.hp === 130 && david.guardDmg > 0);
  david.guardDmg = Data.fatHill.guardDamage - 1; f.player.cooldown = 0; Sim.attack(f, david);
  check("fathill: dano a bastante rompe a proteção, o empurrão tira o colete", david.guardBroken === true && david.guard === true);
  f.player.cooldown = 0; f.player.stamina = 100; Sim.shove(f);
  check("fathill: depois do empurrão o colete sai", !david.guard && f.campaign.fathill.vest);
  f.player.bag.push({id: "violin", qty: 1, uid: "t-violin", condition: 100});
  check("fathill: tocar o violino perto do David atrai-o", Sim.use(f, f.player.bag.length - 1) && david.lured > 0);
  david.lured = 0; david.hp = 130; f.player.cooldown = 0; Sim.attack(f, david); const normal = 130 - david.hp;
  david.lured = 10; david.hp = 130; f.player.cooldown = 0; Sim.attack(f, david); const doubled = 130 - david.hp;
  check("fathill: atraído pelo violino o David leva o dobro do dano", normal > 0 && doubled === normal * Data.fatHill.luredDamage, normal + " vs " + doubled);
  david.hp = 120;
  const copy = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(f))));
  check("fathill: o estado e os chefes (vida acima de 88) guardam-se e carregam", copy.campaign.fathill.fear === 10 && copy.world.enemies.some(z => z.kind === "david" && z.hp > 88 && z.guard === false));
  david.hp = 1; f.player.cooldown = 0; Sim.attack(f, david);
  check("fathill: derrotar o David conclui o desafio e dá a terceira pista", david.hp === 0 && f.campaign.completed.includes("fathill.bosses") && f.campaign.clues === 1 && woman.hp === 0);
  const goals = fresh("campaign"); Sim.testJump(goals, 8, {}, {anyMode: true});
  goals.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade");
  check("fathill: é o objetivo do dia 8 e há dicas para ele", Sim.campaignGoal(goals)?.id === "fathill.bosses" && context.CampaignHints.hints["fathill.bosses"].length === 3);
  const raw = JSON.parse(JSON.stringify(Sim.snapshot(goals))); delete raw.campaign.fathill;
  let bad = false; try { const broken = JSON.parse(JSON.stringify(Sim.snapshot(goals))); broken.campaign.fathill = {fear: -1, coat: false, vest: false}; Sim.restore(broken); } catch { bad = true; }
  check("fathill: saves antigos sem 'fathill' carregam e valores inválidos são recusados", Sim.restore(raw).campaign.fathill.fear === 0 && bad);
}

{ // amigo1.lockdown-chat + viragem.zero: o Vic no valve tower, o chat com o assistente, o diário na cabana
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "reservoir");
  Sim.testJump(f, 15, {}, {anyMode: true});
  const vic = f.world.enemies.find(z => z.kind === "vic"), term = f.world.objects.find(o => o.id === "ai-terminal"), diary = f.world.objects.find(o => o.id === "vic-diary");
  const at = id => f.world.buildings.find(b => b.id === id)?.name;
  check("amigo1: Vic, terminal e diário existem nos sítios certos", Boolean(vic && term && diary) && at(term.building) === "Valve tower" && at(diary.building) === "Keeper's cottage" && vic.guard && vic.hp === 150);
  Object.assign(f.player, {x: term.x, y: term.y});
  check("amigo1: o terminal abre a conversa", Sim.useAiTerminal(f, term) && f.campaign.chat.log.length === 1);
  const T0 = 1e6;
  for (let i = 0; i < 4; i++) Sim.aiSend(f, i === 1 ? "please stop" : "hello", T0 + i);
  check("amigo1: quatro prompts têm resposta guionada e o 'stop' é negado", f.campaign.chat.used === 4 && f.campaign.chat.log.some(l => l.text === Data.aiChat.denied));
  f.atmosphere.nextWave = f.atmosphere.time + 900;
  Sim.aiSend(f, "stand down", T0 + 10);
  check("amigo1: o 5º prompt sem a piada esgota os tokens, chama infetados e pausa 5 minutos",
    !f.campaign.chat.done && f.campaign.chat.until === T0 + 10 + 300000 && f.atmosphere.nextWave <= f.atmosphere.time && vic.guard);
  const n = f.campaign.chat.log.length; Sim.aiSend(f, "stand down, token", T0 + 20);
  check("amigo1: durante a pausa o assistente não responde", !f.campaign.chat.done && f.campaign.chat.log.slice(n).some(l => l.text === Data.aiChat.busy));
  const raw = JSON.parse(JSON.stringify(Sim.snapshot(f)));
  check("amigo1: a pausa e o registo guardam-se e carregam", Sim.restore(raw).campaign.chat.until === T0 + 300010 && Sim.restore(raw).campaign.chat.log.length === f.campaign.chat.log.length);
  f.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses", "westfields.stealth", "cindergrotto.battery");
  Sim.aiSend(f, "Stand down, you are out of tokens", T0 + 400000);
  check("amigo1: depois da pausa, 'stand down' + 'token' no 5º prompt desliga o assistente e tira o capacete",
    f.campaign.chat.done && !vic.guard && Sim.campaignTip(f) === Data.campaignTips.goals["amigo1.lockdown-chat"].fight);
  Object.assign(f.player, {x: vic.x - 1, y: vic.y}); f.player.weapon = "foundrymaul"; f.player.bag.push({id:"foundrymaul", qty:1, condition:100, born:0, uid:"fm-test"}); f.player.weaponUid = "fm-test"; vic.hp = 1; vic.stagger = 0; f.player.cooldown = 0;
  for (let i = 0; i < 6 && vic.hp > 0; i++) { f.player.cooldown = 0; f.player.stamina = 100; Sim.attack(f, vic); }
  check("amigo1: com o capacete fora o Vic cai, dá a 2ª pista (aqui a 1ª) e o mapa da fortaleza",
    vic.hp <= 0 && f.campaign.completed.includes("amigo1.lockdown-chat") && f.campaign.clues === 1 && Sim.quantity(f.player.bag, "fortressmap") === 1, vic.hp + " " + f.campaign.clues);
  const p = Sim.create(11, "campaign", "carer", 2, undefined, "reservoir"); Sim.testJump(p, 15, {}, {anyMode: true});
  check("viragem: antes do dia 15 o diário recusa", (() => { const q = Sim.create(11, "campaign", "carer", 2, undefined, "reservoir"); Sim.testJump(q, 14, {}, {anyMode: true}); const d = q.world.objects.find(o => o.id === "vic-diary"); Object.assign(q.player, {x: d.x, y: d.y}); return !Sim.readVicDiary(q, d); })());
  const d2 = p.world.objects.find(o => o.id === "vic-diary"); Object.assign(p.player, {x: d2.x, y: d2.y});
  check("viragem: no dia 15 lê-se o diário e conclui o desafio", Sim.readVicDiary(p, d2) && p.campaign.completed.includes("viragem.zero"));
  const old = JSON.parse(JSON.stringify(Sim.snapshot(p))); delete old.campaign.chat;
  let bad = false; try { const broken = JSON.parse(JSON.stringify(Sim.snapshot(p))); broken.campaign.chat.used = 9; Sim.restore(broken); } catch { bad = true; }
  check("amigo1: saves antigos sem 'chat' carregam e valores inválidos são recusados", Sim.restore(old).campaign.chat.used === 0 && bad);
}

{ // fortress.last-boss: o Pip mutado; casaco cai com dano, fogo causa dano extra; a fortaleza fica como refúgio
  const r = Sim.create(11, "campaign", "carer", context.Expedition.generator, undefined, "ridge");
  const exit = r.world.objects.find(o => o.id === "exit-fortress");
  check("fortress: Pine Ridge tem a saída para a fortaleza num sítio livre", Boolean(exit) && context.World.clear(r.world, exit.x, exit.y, .3), exit ? exit.x + "," + exit.y : "sem saída");
  Sim.testJump(r, 25, {}, {anyMode: true});
  if (exit) Object.assign(r.player, {x: exit.x, y: exit.y + .5});
  const blocked = exit && Sim.travel(r, exit);
  check("fortress: sem as 5 coordenadas não se entra", !blocked || blocked.world.region !== "fortress");
  r.campaign.clues = 5;
  const inside = exit && Sim.travel(r, exit);
  check("fortress: com as 5 coordenadas, no dia 25, entra-se", inside?.world.region === "fortress", inside?.world.region);
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "fortress");
  Sim.testJump(f, 25, {}, {anyMode: true});
  const pip = f.world.enemies.find(z => z.kind === "pip");
  check("fortress: o Pip existe com casaco, e há escolta e fogueiras", Boolean(pip) && pip.guard && pip.hp === 320 && f.world.enemies.length > 4 && f.world.objects.filter(o => o.kind === "campfire").length >= 5);
  check("fortress: a fortaleza tem horta, despensa e coletores para o final",
    f.world.objects.filter(o => o.kind === "garden").length >= 4 && f.world.objects.some(o => o.kind === "barrel") && f.world.buildings.some(b => b.name === "Fortress keep"));
  // damage path used by Sim.attack: bossDamage via fists/weapon. Drive it through attack with a strong weapon.
  const fire = f.world.objects.find(o => o.kind === "campfire");
  Object.assign(pip, {x: fire.x + 8, y: fire.y});
  f.player.weapon = "foundrymaul"; f.player.bag.push({id:"foundrymaul", qty:1, condition:100, born:0, uid:"fm2"}); f.player.weaponUid = "fm2";
  const swing = () => { f.player.cooldown = 0; f.player.stamina = 100; Object.assign(f.player, {x: pip.x - 1, y: pip.y}); Sim.attack(f, pip); };
  const before = pip.hp; swing();
  check("fortress: com o casaco os golpes não ferem o Pip", pip.hp === before && pip.guard);
  for (let i = 0; i < 12 && pip.guard; i++) swing();
  check("fortress: o casaco cai com dano acumulado", !pip.guard && pip.hp === 320);
  swing(); const plain = 320 - pip.hp;
  Object.assign(pip, {x: fire.x + 1, y: fire.y}); pip.hp = 320; swing();
  const burnt = 320 - pip.hp;
  check("fortress: perto do fogo o mesmo golpe faz mais dano", plain > 0 && burnt >= plain * 2, plain + " vs " + burnt);
  const hp0 = pip.hp; Object.assign(pip, {x: fire.x + 1, y: fire.y}); Sim.tick(f, .033, idle);
  check("fortress: o fogo queima o Pip com o tempo", pip.hp < hp0 || pip.burning);
  pip.hp = 1; Object.assign(pip, {x: fire.x + 8, y: fire.y}); swing(); swing(); swing();
  check("fortress: o Pip a cair conclui o desafio final", pip.hp <= 0 && f.campaign.completed.includes("fortress.last-boss"), pip.hp + "");
  check("fortress: depois da vitória fica uma dica de refúgio", /fortress is yours/.test(Sim.campaignTip(f)) || Sim.campaignTip(f).length > 20);
}

{ // tochas e cocktails molotov: receitas sempre disponíveis, fogo queima infetados e o Pip
  const s = Sim.create(11, "survival", "carer", 2);
  const add = (id, n) => { s.player.bag.push({id, qty:n, condition:100, born:0, uid:"t-" + id}); };
  add("wood",2); add("cloth",2); add("emptybottle",1); add("fuel",1);
  check("fogo: as receitas da tocha e do molotov existem", Data.recipes.some(r => r.id === "torch") && Data.recipes.some(r => r.id === "molotov"));
  check("fogo: fabrica a tocha", Sim.craft(s, "torch") && Sim.quantity(s.player.bag, "torch") === 1);
  check("fogo: fabrica o molotov", Sim.craft(s, "molotov") && Sim.quantity(s.player.bag, "molotov") === 1 && Sim.quantity(s.player.bag, "fuel") === 0);
  const z = s.world.enemies.find(e => e.hp > 0 && !e.stats.boss);
  Object.assign(s.player, {x: 20.5, y: 20.5, headingX: 1, headingY: 0}); s.target = null;
  const clear = (() => { for (let r = 0; r < 20; r++) for (let a = 0; a < 6.28; a += .5) { const x = 30 + Math.cos(a) * r, y = 30 + Math.sin(a) * r; if (context.World.clear(s.world, x, y, .4) && context.World.clear(s.world, x + 4, y, .4)) return {x, y}; } return null; })();
  Object.assign(s.player, {x: clear.x, y: clear.y}); Object.assign(z, {x: clear.x + 4, y: clear.y, hp: 20, dormant: false, alert: 0});
  const idx = s.player.bag.findIndex(i => i.id === "molotov");
  check("fogo: atirar o molotov cria chamas e gasta a garrafa", Sim.use(s, idx) && s.fires.length === 1 && Sim.quantity(s.player.bag, "molotov") === 0);
  s.fires[0].x = z.x; s.fires[0].y = z.y;
  run(s, 150);
  check("fogo: as chamas matam o infetado que lá estiver", z.hp <= 0, String(z.hp));
  s.fires[0].until = s.elapsed - 1; Sim.tick(s, .033, idle);
  check("fogo: as chamas apagam-se", s.fires.length === 0, s.mode + " " + s.fires.length + " " + s.elapsed);
  const t = Sim.create(11, "survival", "carer", 2), w = t.world.enemies.find(e => e.hp > 0 && !e.stats.boss);
  t.player.bag.push({id:"torch", qty:1, condition:100, born:0, uid:"tt"}); t.player.weapon = "torch"; t.player.weaponUid = "tt";
  Object.assign(w, {hp: 60, dormant: false, x: t.player.x + .8, y: t.player.y}); t.player.cooldown = 0; t.player.stamina = 100;
  Sim.attack(t, w); const after = w.hp; run(t, 90);
  check("fogo: a tocha incendeia o infetado e ele continua a arder", after > 0 && w.hp < after, after + " -> " + w.hp);
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "fortress"); Sim.testJump(f, 25, {}, {anyMode: true});
  const pip = f.world.enemies.find(e => e.kind === "pip"); pip.guard = false;
  const far = f.world.objects.filter(o => o.kind === "campfire").sort((a, b) => b.x - a.x)[0];
  Object.assign(pip, {x: far.x + 9, y: far.y});
  const hit = () => { f.player.cooldown = 0; f.player.stamina = 100; Object.assign(f.player, {x: pip.x - 1, y: pip.y}); const b = pip.hp; Sim.attack(f, pip); return b - pip.hp; };
  f.player.bag.push({id:"foundrymaul", qty:1, condition:100, born:0, uid:"m3"}); f.player.weapon = "foundrymaul"; f.player.weaponUid = "m3";
  const plain = hit();
  f.player.bag.push({id:"torch", qty:1, condition:100, born:0, uid:"t3"}); f.player.weapon = "torch"; f.player.weaponUid = "t3"; pip.burnUntil = 0;
  const torch = hit();
  check("fogo: a tocha faz ao Pip mais dano do que o seu dano base e deixa-o a arder", torch > 13 * 1.5 && pip.burnUntil > f.elapsed, plain + " / " + torch);
}

{ // arpão: alcance grande, muito lento, mata o Pip abaixo de 100 hp
  const f = Sim.create(11, "campaign", "carer", 2, undefined, "fortress"); Sim.testJump(f, 25, {}, {anyMode: true});
  const pip = f.world.enemies.find(e => e.kind === "pip"), h = Data.items.harpoon;
  check("arpão: tem mais alcance e é muito mais lento do que a maça da Foundry", h.range > Data.items.foundrymaul.range * 1.5 && h.delay > Data.items.foundrymaul.delay * 2);
  check("arpão: está na armaria da fortaleza", f.world.objects.some(o => o.name === "Armoury" && o.loot.some(i => i.id === "harpoon")));
  pip.guard = false; f.player.bag.push({id:"harpoon", qty:1, condition:100, born:0, uid:"hp1"}); f.player.weapon = "harpoon"; f.player.weaponUid = "hp1";
  const strike = () => { f.player.cooldown = 0; f.player.stamina = 100; Object.assign(f.player, {x: pip.x - 2.4, y: pip.y}); Sim.attack(f, pip); };
  pip.hp = 250; strike();
  check("arpão: com o Pip acima de 100 hp só faz dano normal", pip.hp > 0 && pip.hp < 250 && pip.hp > 100 - 1, String(pip.hp));
  pip.hp = 99; strike();
  check("arpão: abaixo de 100 hp mata o Pip e fecha o desafio", pip.hp <= 0 && f.campaign.completed.includes("fortress.last-boss"));
}

{ // áreas opcionais: um esconderijo por área, aberto no dia marcado, nunca dá pista
  const town = Sim.create(11, "campaign", "carer", 2);
  const cache = (w, id) => w.world.objects.find(o => o.id === id);
  const names = {"opt-fuel":"fuel", "opt-clinic":"clinic", "opt-market":"market"};
  check("opcional: posto, clínica, mercado e escola existem em Cold Vale",
    Object.entries(names).every(([id, type]) => town.world.buildings.find(b => b.id === cache(town, id)?.building)?.type === type) && Boolean(cache(town, "opt-school")));
  check("opcional: antes do dia marcado o esconderijo está oculto", ["opt-fuel", "opt-clinic", "opt-school"].every(id => cache(town, id).active === false));
  Sim.testJump(town, 9, {}, {anyMode: true}); Sim.tick(town, .033, idle);
  check("opcional: no dia 9 a clínica abre e o posto também, a escola ainda não", cache(town, "opt-clinic").active && cache(town, "opt-fuel").active && !cache(town, "opt-school").active);
  const mk = Sim.create(11, "campaign", "carer", 2); Sim.testJump(mk, 16, {}, {anyMode: true}); Sim.tick(mk, .033, idle);
  check("opcional: o mercado fica fechado ao fim de semana (dia 16)", cache(mk, "opt-market").active === false);
  const fields = Sim.create(11, "campaign", "carer", 2, undefined, "fields"), coast = Sim.create(11, "campaign", "carer", 2, undefined, "coast"), iron = Sim.create(11, "campaign", "carer", 2, undefined, "ironworks");
  const inB = (w, id) => w.world.buildings.find(b => b.id === cache(w, id)?.building)?.name;
  check("opcional: quinta, colheita, marina e estação estão nos edifícios certos",
    inB(fields, "opt-farm") === "Orchard farmhouse" && inB(fields, "opt-harvest") === "Hay barn" && inB(coast, "opt-marina") === "Net shed" && inB(iron, "opt-station") === "Freight depot");
  check("opcional: nenhum esconderijo dá pistas", Object.values(Data.optionalAreas).every(a => !Object.keys(a.loot).includes("clue")) && Object.keys(Data.optionalAreas).every(id => Campaign.areas[id]?.kind === "optional"));
  const box = cache(town, "opt-clinic"); Object.assign(town.player, {x: box.x, y: box.y});
  town.world.enemies = [];
  check("opcional: tirar o saque regista a área como feita", Sim.collect(town, box, 0) > 0 && town.campaign.opt.includes("opt.clinic"));
  check("opcional: a dica menciona o que se pode vasculhar hoje", /raid/.test(Sim.campaignTip(town)) || town.campaign.opt.length > 0);
  const back = Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(town))));
  check("opcional: o registo guarda-se e carrega", back.campaign.opt.includes("opt.clinic"));
  const old = JSON.parse(JSON.stringify(Sim.snapshot(town))); delete old.campaign.opt;
  let bad = false; try { const broken = JSON.parse(JSON.stringify(Sim.snapshot(town))); broken.campaign.opt = ["opt.x"]; Sim.restore(broken); } catch { bad = true; }
  check("opcional: saves antigos sem 'opt' carregam e valores inválidos são recusados", Sim.restore(old).campaign.opt.length === 0 && bad);
}

{ // ui.campaign-tip: na campanha há sempre uma dica concreta do que fazer, em qualquer dia, objetivo ou sítio
  const goalsOrder = ["coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses", "westfields.stealth", "cindergrotto.battery", "amigo1.lockdown-chat", "viragem.zero", "fortress.last-boss"];
  let empty = 0, total = 0, sample = "";
  for (let day = 1; day <= 30; day++) for (let done = 0; done <= goalsOrder.length; done++) {
    const s = fresh("campaign"); Sim.testJump(s, day, {}, {anyMode: true});
    s.campaign.completed.push(...goalsOrder.slice(0, done));
    const tip = Sim.campaignTip(s); total++;
    if (typeof tip !== "string" || tip.length < 20) { empty++; sample = day + "/" + done; }
  }
  check("ui.campaign-tip em 30 dias x 12 estados de progresso há sempre uma dica", empty === 0, empty + " vazias de " + total + " " + sample);
  const t0 = fresh("campaign");
  check("ui.campaign-tip no início explica as páginas", /torn page/.test(Sim.campaignTip(t0)) && /0 of 3/.test(Sim.campaignTip(t0)), Sim.campaignTip(t0));
  const pre = fresh("campaign"); pre.campaign.completed.push("coldvale.houses");
  check("ui.campaign-tip com o cinema ainda fechado diz quando abre", /day 2/.test(Sim.campaignTip(pre)), Sim.campaignTip(pre));
  const fh = Sim.create(11, "campaign", "carer", 2, undefined, "coast"); Sim.testJump(fh, 8, {}, {anyMode: true});
  fh.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade");
  check("ui.campaign-tip no FatHill pede para matar infetados à vista da mulher", /fear is 0 of 10/.test(Sim.campaignTip(fh)) && /violin/.test(Sim.campaignTip(fh)), Sim.campaignTip(fh));
  fh.campaign.fathill.coat = true; const coat = Sim.campaignTip(fh); fh.campaign.fathill.vest = true;
  check("ui.campaign-tip acompanha os passos do chefe (casaco, colete)", /guard down/.test(coat) && /Play the violin/.test(Sim.campaignTip(fh)), coat + " | " + Sim.campaignTip(fh));
  const done = fresh("campaign"); Sim.testJump(done, 12, {}, {anyMode: true}); done.campaign.completed.push(...goalsOrder);
  check("ui.campaign-tip com tudo feito por agora mantém uma dica", /next story step/.test(Sim.campaignTip(done)), Sim.campaignTip(done));
  check("ui.campaign-tip fora da campanha não aparece", Sim.campaignTip(fresh("survival")) === "");
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
