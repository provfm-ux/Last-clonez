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
let heldWeapon = null;
const infectedFrames = [], survivorFrames = [];
const bagPigments = new Set(["#3b2822","#c4875e","#985b40","#714534","#513629","#e0b784"]);
const bagPixels = [];
let lastTranslate = null;
const smokeFrames = [], canopyPositions = [], rippleFrames = [], propSprites = [];
let beamOpacity = 1;
const mk = () => new Proxy({globalAlpha:1, savedAlpha:[]}, {
  get(t, k) { if (k in t) return t[k]; if (k === "canvas") return {width: 1280, height: 720}; if (k === "measureText") return () => ({width: 10});
    if (k === "createImageData") return (width,height) => ({data:new Uint8ClampedArray(width*height*4)});
    if (k === "createRadialGradient" || k === "createLinearGradient") return () => { counts[k] = (counts[k] || 0) + 1; return {addColorStop() {}}; };
    return (...args) => {
      counts[k] = (counts[k] || 0) + 1;
      if (k === "fillRect" && (t.fillStyle === "#afc1c66b" || t.fillStyle === "#879fa840")) rippleFrames.push(args);
      if (k === "fillRect" && bagPigments.has(t.fillStyle)) bagPixels.push(t.fillStyle);
      if (k === "translate" && !lastTranslate) lastTranslate = args;
      if (k === "save") t.savedAlpha.push(t.globalAlpha);
      if (k === "restore") t.globalAlpha = t.savedAlpha.pop() ?? 1;
      if (k === "drawImage" && args.length === 5) {
        if (args[0]?.width === 16 && args[0]?.height === 12) smokeFrames.push(args.slice(1));
        if (args[0]?.width === 104 && args[0]?.height === 104) counts.windowGlow = (counts.windowGlow ?? 0) + 1;
        if (args[0]?.width === 68 && args[0]?.height === 68) counts.fireWindow = (counts.fireWindow ?? 0) + 1;
        if (args[0]?.width === 206 && args[0]?.height === 206) counts.fireGlow = (counts.fireGlow ?? 0) + 1;
        if (args[0]?.width === 144 && args[0]?.height === 144) counts.mist = (counts.mist ?? 0) + 1;
        if (args[0]?.width === 256 && args[0]?.height === 256 && args[1] === -10) {
          counts.warmBeam = (counts.warmBeam ?? 0) + 1;
          beamOpacity = t.globalAlpha;
        }
      }
      if (k === "drawImage" && args.length === 3 && args[0]?.width === 54 && args[0]?.height === 61) canopyPositions.push(args[1]);
      if (k === "drawImage" && args.length === 3 && args[0]?.width === 72 && args[0]?.height === 64) {
        counts.furnitureBlit = (counts.furnitureBlit || 0) + 1;
        propSprites.push(args[0]);
      }
      if (k === "drawImage" && args.length === 3 && args[0]?.width === 36 && args[0]?.height === 36) heldWeapon = args[0];
      if (k === "drawImage" && args.length === 9 && args[3] === 24 && args[4] === 40) {
        infectedFrames.push(args.slice(1, 7));
      }
      if (k === "drawImage" && args.length === 9 && args[3] === 36 && args[4] === 48) {
        counts.actorBlit = (counts.actorBlit || 0) + 1;
        survivorFrames.push(args.slice(1, 3).join(","));
      }
    }; },
  set(t, k, v) { t[k] = v; return true; }});
const mkCanvas = () => ({width: 0, height: 0, getContext: () => mk(), getBoundingClientRect: () => ({left: 0, top: 0, width: 1280, height: 720}), style: {}, clientWidth: 160});
const worldCanvas = mkCanvas();
const context = {console, Math: Object.assign(Object.create(Math), {random: (() => { let s = 3; return () => (s = s * 16807 % 2147483647) / 2147483647; })()}), Date, JSON, structuredClone, devicePixelRatio: 1,
  Image: class { naturalWidth = 672; naturalHeight = 800; },
  ResizeObserver: class { observe() {} }, document: {getElementById: id => id === "world" ? worldCanvas : id === "micro-zombie-atlas" ? {href:"micro-zombies.png"} : mkCanvas(), createElement: () => mkCanvas()}};
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
const doorstep = home && context.World.tileAt(s.world, home.x - 1, home.y);
const wilderness = s.world.tiles.find(t => t.surface === "grass" && s.world.buildings.every(b =>
  b.type !== "home" || t.x < b.x - 2 || t.x >= b.x + b.w + 2 || t.y < b.y - 2 || t.y >= b.y + b.h + 2));
check("sangue no terreno: limitado à zona das casas",
  corner?.nearHome === true && doorstep?.nearHome === true && wilderness && !wilderness.nearHome);
check("paredes: o canto liga as duas paredes sem sobressair",
  corner?.wallOutline.some(([x]) => x === 1) &&
  corner.wallOutline.some(([, y]) => y === 1) &&
  corner.wallOutline.every(([x, y]) => x > 0 && y > 0));
const first = per(() => View.render(s, 0, 1 / 60));
s.blueprint = "test";
const point = View.locate(640 + 32 * 1.12, 720 * .54 + 16 * 1.12, s);
delete s.blueprint;
check("projeção isométrica 2:1: o centro do tile vizinho converte para o mundo",
  Math.abs(point.x - s.player.x - 1) < 1e-6 && Math.abs(point.y - s.player.y) < 1e-6);
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
  check("dark pixel: personagens usam os sprites do atlas", (dsteady.actorBlit || 0) > 0);
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
{
  const d = Sim.createControl("survival", "carer", "shelter");
  const z = d.world.enemies[0];
  Object.assign(z, {x:d.player.x, y:d.player.y, headingX:1, headingY:0,
    dormant:false, moving:false, phase:4, flash:0, windup:0, swing:0});
  d.world.enemies = [z];
  d.mode = "menu";
  d.look = "dark";
  View.prepare(d.world);
  const pose = () => {
    infectedFrames.length = 0;
    View.render(d, 0, 1 / 60);
    return infectedFrames[0];
  };
  const idle = pose();
  z.moving = true;
  const walk = pose();
  z.x += .22;
  const step = pose();
  z.windup = .1;
  const attack = pose();
  z.flash = .2;
  z.headingX = -1;
  const hit = pose();
  check("dark pixel: infectado anima e espelha a mesma variante",
    idle?.[1] === 40 && walk?.[1] === 240 && step?.[0] === walk[0] + 24 &&
    attack?.[1] === 440 && hit?.[1] === 720 && hit[0] === 648 - idle[0] &&
    idle[5] === walk[5] && step[5] === attack[5] && attack[5] === hit[5]);
  Object.assign(z,{moving:false,flash:0,windup:0});
  const views = [[1,1],[1,0],[1,-1],[0,-1],[-1,-1]].map(([headingX,headingY]) => {
    Object.assign(z,{headingX,headingY});
    return pose()?.[1];
  });
  check("dark pixel: infectado tem vistas distintas de frente, costas, perfil e três quartos",
    views.every((row,index) => row === index * 40));
}
{
  const d = Sim.createControl("survival", "carer", "shelter");
  d.world.enemies = [];
  d.world.npc.ridingVehicle = true;
  d.look = "dark";
  View.prepare(d.world);
  const pose = (clock = 0) => {
    survivorFrames.length = 0;
    View.render(d, clock, 1 / 60);
    return survivorFrames[0];
  };
  const idle = pose();
  const breath = pose(.6);
  d.player.moving = true;
  const walk = pose();
  d.running = true;
  const run = pose();
  d.quiet = true;
  const sneak = pose();
  d.player.moving = false;
  d.player.resting = true;
  const rest = pose();
  d.player.resting = false;
  d.player.swing = .16;
  const windup = pose();
  d.player.swing = .1;
  const strike = pose();
  d.player.swing = 0;
  d.player.flash = .3;
  const hit = pose();
  const poses = [idle, breath, walk, run, sneak, rest, windup, strike, hit];
  check("dark pixel: poses distintas do sobrevivente usam células em cache",
    poses.every(Boolean) && new Set(poses).size === poses.length && pose() === hit);

  Object.assign(d.player,{flash:0,moving:true});
  d.quiet = d.running = false;
  const directions = [[1,1],[-1,-1],[1,0],[0,-1],[1,-1],[-1,1],[0,1],[-1,0]].map(([headingX,headingY]) => {
    Object.assign(d.player,{headingX,headingY});
    return pose();
  });
  Object.assign(d.player,{headingX:1,headingY:1});
  check("dark pixel: marcha usa oito orientações de acordo com a projeção no ecrã",
    directions.every(Boolean) && new Set(directions).size === directions.length && pose() === directions[0]);
  const packPoses = [[1,1],[1,-1],[-1,1],[-1,-1]].map(([headingX,headingY]) => {
    Object.assign(d.player,{headingX,headingY,backpack:false});
    const without = pose();
    d.player.backpack = true;
    return [without,pose()];
  });
  check("dark pixel: mochila fica tapada de frente e de lado, visível de costas",
    packPoses.every(([without,withPack],index) => Boolean(without) && Boolean(withPack) &&
      (index === 3 ? without !== withPack : without === withPack)));
  Object.assign(d.player,{headingX:-1,headingY:-1,backpack:true,moving:true});
  d.player.gear.body = "raincoat";
  const bagSignature = () => {
    bagPixels.length = 0;
    pose();
    return bagPixels.sort().join(",");
  };
  const walkingBag = bagSignature();
  Object.assign(d.player,{moving:false,resting:true});
  const restingBag = bagSignature();
  Object.assign(d.player,{resting:false,swing:.10});
  const strikingBag = bagSignature();
  check("dark pixel: mochila traseira mantém os mesmos pixels e cores em marcha, repouso e ataque",
    Boolean(walkingBag) && walkingBag === restingBag && walkingBag === strikingBag);
  Object.assign(d.player,{headingX:1,headingY:1,swing:0,gear:{...d.player.gear,body:null}});
  const styles = [pose()];
  for (const [key,value] of Object.entries({skinTone:"deep",hairColor:"auburn",hairStyle:"wavy",jacketColor:"burgundy"})) {
    d.player[key] = value;
    styles.push(pose());
  }
  check("dark pixel: pele, cabelo e casaco selecionados alteram o sprite",
    styles.every(Boolean) && new Set(styles).size === styles.length && pose() === styles.at(-1));
}
{
  const interior = Sim.createControl("survival", "carer", "shelter"), world = interior.world;
  const house = world.buildings.find(b => b.compact);
  const floor = world.tiles.find(t => t.building === house.id && !t.solid);
  Object.assign(interior.player, {x:floor.x + .5, y:floor.y + .5});
  interior.look = "dark";
  world.explored.fill(1);
  View.prepare(world);
  View.render(interior, 0, 1 / 60);
  const furniture = per(() => View.render(interior, 1 / 60, 1 / 60));
  check("dark pixel: interior desenha vários móveis a partir do cache", (furniture.furnitureBlit || 0) >= 4);
}
{
  const run = Sim.createControl("training", "carer", "shelter");
  run.look = "dark";
  View.prepare(run.world);
  heldWeapon = null;
  View.render(run,0,1/60);
  check("the starting bat has a ground sprite", Sim.weapon(run).id === "fists" && Boolean(heldWeapon));
  const bat = run.world.objects.find(o => o.kind === "drop" && o.loot.some(i => i.id === "bat"));
  bat.active = false;
  heldWeapon = null;
  View.render(run,0,1/60);
  check("an unarmed survivor has no held weapon sprite", heldWeapon === null);
  const weapons = Object.keys(context.Data.items).filter(id => context.Data.items[id].damage);
  const sprites = weapons.map(id => {
    run.player.bag.push({id, qty:1, uid:"render-" + id, condition:100});
    Sim.use(run, run.player.bag.length - 1);
    heldWeapon = null;
    View.render(run, 0, 1 / 60);
    return heldWeapon;
  });
  check("dark pixel: cada arma equipada tem um sprite distinto", sprites.every(Boolean) && new Set(sprites).size === weapons.length);
  const carry = heldWeapon;
  run.target = {hp:1,x:run.player.x+.5,y:run.player.y};
  View.render(run, 0, 1 / 60);
  check("dark pixel: arma empunhada ao apontar tem pose diferente de transporte",
    run.target && heldWeapon && heldWeapon !== carry);
  run.target = null;
  run.swingVisual = {weapon:"bat", dx:1, dy:0};
  run.player.swing = .17;
  View.render(run, 0, 1 / 60);
  const raised = heldWeapon;
  run.player.swing = .08;
  View.render(run, 0, 1 / 60);
  check("dark pixel: a arma muda de pose durante o ataque", heldWeapon && raised !== heldWeapon);
  run.swingVisual.weapon = "fists";
  heldWeapon = null;
  View.render(run, 0, 1 / 60);
  check("dark pixel: empurrar não mostra um golpe de arma", heldWeapon === null);
}
if (!quiet) console.log("\nOperações por frame (jogo parado): " + Math.round(Object.values(steady).reduce((a, b) => a + b, 0)) + " (clássico: " + Math.round(Object.values(classic).reduce((a, b) => a + b, 0)) + ")");
const cinema = Sim.create(17,"survival","carer",6,undefined,"cinema");
Object.assign(cinema.player,{x:13.5,y:12.5});
Sim.tick(cinema,.03);
View.prepare(cinema.world);
const auditorium = per(() => View.render(cinema,0,.016));
check("Oxford auditorium renders with the shared renderer", auditorium.fill > 0);
const shadow = context.Afterlife.start(cinema,.1,.6);
context.Afterlife.tick(shadow,.1,{x:0,y:0});
const limited = per(() => View.renderAfterlife(shadow));
shadow.blind = true;
const blind = per(() => View.renderAfterlife(shadow));
check("afterlife draws a small field without filters or gradient passes",
  limited.fill <= 60 && blind.fill < limited.fill &&
  !limited.createRadialGradient && !limited.createLinearGradient);
const borough = Sim.create(17,"training","carer",7,undefined,"southbank");
View.prepare(borough.world);
const districtDraw = per(() => View.render(borough,0,.016));
check("outer district shares the isometric renderer",districtDraw.fill > 0);
{
  const run = Sim.createControl("survival","carer","shelter",undefined,{seed:17});
  const window = run.world.objects.find(o => o.active && o.kind === "window" && o.building);
  const {player} = run;
  Object.assign(player,{x:window.x+1,y:window.y+1,headingX:0,headingY:1});
  run.world.explored.fill(1);
  run.minutes = 1260;
  run.weather = "Rain";
  run.visualAtmosphere = "full";
  View.prepare(run.world);
  const lamp = player.bag.findIndex(item => item.id === "flashlight");
  player.bag[lamp].charge = 4;
  Sim.use(run,lamp);
  const powered = per(() => View.render(run,.2,.016));
  const dim = beamOpacity;
  View.render(run,.6,.016);
  check("lanterna quente: sprite recortado pela geometria e cintila com bateria fraca",
    powered.warmBeam === 1 && powered.clip >= 1 && beamOpacity !== dim && beamOpacity < 1);
  run.reduceFlicker = true;
  View.render(run,.8,.016);
  check("reduzir cintilação estabiliza a lanterna", beamOpacity === 1);
  run.minutes += 1440*run.rules.powerDays;
  const unpowered = per(() => View.render(run,1,.016));
  check("janelas: brilho com rede e desaparece após corte", powered.windowGlow > 0 && !unpowered.windowGlow);
  const power = run.world.objects.find(o => o.id === "shelter-generator");
  Object.assign(power,{x:window.x,y:window.y,running:true,fuel:25});
  const generator = per(() => View.render(run,1,.016));
  check("janelas: gerador em funcionamento volta a iluminar janelas próximas", generator.windowGlow > 0);
  power.running = false;
  run.world.objects.push({kind:"campfire",x:player.x,y:player.y,active:true});
  const fire = per(() => View.render(run,1,.016));
  check("fogueira no exterior: luz no chão e brilho fraco perto da janela após corte", fire.fireGlow > 0 && fire.fireWindow > 0);

  run.look = "dark";
  run.reduceFlicker = false;
  run.world.objects.push({kind:"tree",x:player.x,y:player.y,active:true,tint:.25});
  const worldMotion = clock => {
    smokeFrames.length = canopyPositions.length = rippleFrames.length = propSprites.length = 0;
    View.render(run, clock, .016);
    return {smoke:JSON.stringify(smokeFrames), trees:JSON.stringify(canopyPositions), rain:JSON.stringify(rippleFrames), props:[...propSprites]};
  };
  const ambientStart = worldMotion(1), ambientLater = worldMotion(1.85);
  run.reduceFlicker = true;
  const stillStart = worldMotion(1), stillLater = worldMotion(1.85);
  check("dark pixel: fogueira alterna sprites e mantém uma pose com redução de cintilação",
    ambientStart.props.length > 0 && ambientStart.props.some((sprite, index) => sprite !== ambientLater.props[index]) &&
    stillStart.props.length > 0 && stillStart.props.every((sprite, index) => sprite === stillLater.props[index]));
  check("dark pixel: fumo, copas e poças animam, reduzir cintilação desativa o movimento ambiente",
    ambientStart.smoke !== "[]" && ambientStart.smoke !== ambientLater.smoke &&
    ambientStart.trees !== "[]" && ambientStart.trees !== ambientLater.trees &&
    ambientStart.rain !== "[]" && ambientStart.rain !== ambientLater.rain &&
    stillStart.smoke === "[]" && stillLater.smoke === "[]" && stillStart.trees === stillLater.trees &&
    stillStart.rain === "[]" && stillLater.rain === "[]");

  const barrel = {kind:"barrel", x:player.x, y:player.y, active:true, water:0};
  const radio = {kind:"radio", x:player.x, y:player.y, active:true};
  run.world.objects.push(barrel, radio);
  run.flags.radio = false;
  const emptyProps = worldMotion(1).props;
  barrel.water = context.Data.rainCollector.bottleVolume;
  run.flags.radio = true;
  const activeProps = worldMotion(1).props;
  const reusedProps = worldMotion(1).props;
  check("dark pixel: rádio e barril alternam entre sprites em cache",
    emptyProps.length === activeProps.length &&
    emptyProps.filter((sprite, index) => sprite !== activeProps[index]).length === 2 &&
    activeProps.every((sprite, index) => sprite === reusedProps[index]));

  const door = {kind:"door", action:"door", x:player.x, y:player.y, active:true};
  run.world.objects.push(door);
  const closedProps = worldMotion(1).props;
  door.open = true;
  const openProps = worldMotion(1).props;
  door.broken = true;
  const brokenProps = worldMotion(1).props;
  const doorIndex = closedProps.findIndex((sprite, index) => sprite !== openProps[index]);
  check("dark pixel: porta usa sprites próprios para fechar, abrir e quebrar",
    doorIndex >= 0 && new Set([closedProps[doorIndex], openProps[doorIndex], brokenProps[doorIndex]]).size === 3 &&
    worldMotion(1).props[doorIndex] === brokenProps[doorIndex]);

  const cart = {kind:"cart", x:player.x, y:player.y, active:true};
  run.world.objects.push(cart);
  const stockedProps = worldMotion(1).props;
  cart.opened = true;
  const searchedProps = worldMotion(1).props;
  check("dark pixel: carrinho aberto usa sprite próprio em cache",
    stockedProps.length === searchedProps.length &&
    stockedProps.filter((sprite, index) => sprite !== searchedProps[index]).length === 1 &&
    worldMotion(1).props.every((sprite, index) => sprite === searchedProps[index]));

  run.minutes = 19*60;
  for (const look of ["dark","fast","classic"]) {
    run.look = look;
    run.fastGround = look !== "classic";
    run.visualAtmosphere = "full";
    View.render(run,1,.016);
    const full = per(n => { for (let i = 0; i < n; i++) View.render(run,1+i/60,.016); }, 8);
    run.visualAtmosphere = "reduced";
    const reduced = per(() => View.render(run,1,.016));
    run.visualAtmosphere = "off";
    const off = per(() => View.render(run,1,.016));
    check(look + ": Full, Reduced e Off desenham, com menos chuva em Reduced e ambiente original em Off",
      full.warmBeam === 1 && reduced.warmBeam === 1 && !off.warmBeam && !off.windowGlow && !off.mist &&
      reduced.lineTo < full.lineTo && full.createRadialGradient <= off.createRadialGradient);
  }
}
{
  const marsh = Sim.create(17,"training","carer",7,undefined,"lowtide");
  marsh.minutes = 6*60;
  marsh.visualAtmosphere = "full";
  View.prepare(marsh.world);
  const dawn = per(() => View.render(marsh,12,.016));
  check("Lowtide Marsh: neblina leve ao amanhecer", dawn.mist > 0);
  const cave = Sim.create(17,"training","carer",7,undefined,"cavern");
  cave.visualAtmosphere = "full";
  cave.weather = "Rain";
  View.prepare(cave.world);
  const lamp = cave.player.bag.findIndex(item => item.id === "flashlight");
  Sim.use(cave,lamp);
  const under = per(() => View.render(cave,12,.016));
  check("Cinder Grotto: lanterna presente sem chuva ou neblina", under.warmBeam === 1 && !under.mist);
}
{
  const run = Sim.createControl("training","carer","shelter");
  run.player.bag.push({id:"spear",qty:1,condition:100,uid:"portrait-spear"});
  Sim.use(run,run.player.bag.length-1);
  const portrait = mkCanvas();
  portrait.width = portrait.height = 48;
  const equipped = per(() => View.equipmentPortrait(portrait,run));
  check("equipamento: retrato apresenta jogador e arma equipada", equipped.drawImage >= 2);
}
{ // cinema.statue: a estátua desenha-se no palco, barata e sem gradientes, e desaparece depois de apanhada
  const run = Sim.createControl("campaign","carer","shelter"); Sim.testJump(run, 2, {}, {anyMode: true});
  const exit = run.world.objects.find(o => o.id === "exit-cinema"); Object.assign(run.player, {x: exit.x - 1, y: exit.y});
  const c = Sim.travel(run, exit); View.prepare(c.world); Object.assign(c.player, {x: 11.5, y: 7.5}); for (let i = 0; i < 5; i++) Sim.tick(c, .05);
  const statue = c.world.objects.find(o => o.id === "cinema-statue");
  const total = r => Object.entries(r).filter(([k]) => !/Gradient/.test(k)).reduce((n, [, v]) => n + v, 0);
  View.render(c, 0, 1/60);
  const shown = per(() => View.render(c, 0, 1/60)); statue.active = false;
  const gone = per(() => View.render(c, 0, 1/60)); statue.active = true;
  check("cinema.statue estátua desenhada no palco, barata e sem gradientes", total(shown) > total(gone) && total(shown) - total(gone) < 200 &&
    (shown.createRadialGradient ?? 0) === (gone.createRadialGradient ?? 0) && (shown.createLinearGradient ?? 0) === (gone.createLinearGradient ?? 0),
    total(shown) + " vs " + total(gone));
}
{ // game-feel: impactos abanam só o desenho, decaem em tempo real e respeitam "Reduce flicker"
  const run = Sim.createControl("training","carer","shelter"); View.prepare(run.world); run.visualAtmosphere = "full"; run.reduceFlicker = false;
  const frame = dt => { lastTranslate = null; View.render(run, 0, dt); return lastTranslate.slice(); };
  for (let i = 0; i < 30; i++) frame(1/60);
  const rest = frame(1/60);
  run.effects.push({x: run.player.x, y: run.player.y, text: "CLICK", color: "#fff", life: 1, impact: .8});
  frame(.03);
  run.effects.push({x: run.player.x, y: run.player.y, text: "SMASH", color: "#fff", life: 1, impact: .45});
  const hit = frame(1/60);
  check("game-feel dois impactos somam trauma e abanam o ecrã", View.trauma() > .9 && (Math.abs(hit[0] - rest[0]) > .5 || Math.abs(hit[1] - rest[1]) > .5),
    "trauma " + View.trauma().toFixed(2));
  for (let t = 0; t < 1 / 1.2; t += 1/60) frame(1/60);
  const after = frame(1/60);
  check("game-feel o abanão volta a zero em menos de 1/decaimento segundos", View.trauma() === 0 && after[0] === rest[0] && after[1] === rest[1]);
  run.reduceFlicker = true;
  run.effects.push({x: run.player.x, y: run.player.y, text: "CLICK", color: "#fff", life: 1, impact: .8});
  const calm = frame(1/60);
  check("game-feel com Reduce flicker o ecrã não abana", calm[0] === rest[0] && calm[1] === rest[1]);
}
{ // ironworks: o terminal do computador da linha desenha-se, barato e sem gradientes
  const run = Sim.createControl("campaign","carer","shelter"); Sim.testJump(run, 6, {}, {anyMode: true});
  const ex = run.world.objects.find(o => o.id === "exit-ironworks"); Object.assign(run.player, {x: ex.x, y: ex.y + (ex.y > run.world.height / 2 ? -1 : 1)});
  const w = Sim.travel(run, ex), t = w.world.objects.find(o => o.id === "iron-terminal-0"); View.prepare(w.world); w.world.enemies = [];
  Object.assign(w.player, {x: t.x, y: t.y + 1.2}); for (let i = 0; i < 5; i++) Sim.tick(w, .05);
  const total = r => Object.entries(r).filter(([k]) => !/Gradient/.test(k)).reduce((n, [, v]) => n + v, 0);
  View.render(w, 0, 1/60);
  const shown = per(() => View.render(w, 0, 1/60)); t.active = false;
  const gone = per(() => View.render(w, 0, 1/60)); t.active = true;
  check("ironworks terminal desenhado, barato e sem gradientes", total(shown) > total(gone) && total(shown) - total(gone) < 80 &&
    (shown.createRadialGradient ?? 0) === (gone.createRadialGradient ?? 0) && (shown.createLinearGradient ?? 0) === (gone.createLinearGradient ?? 0),
    total(shown) + " vs " + total(gone));
}
console.log(failures ? "\n" + failures + " FALHA(S)" : "\nTudo OK");
process.exit(failures ? 1 : 0);
