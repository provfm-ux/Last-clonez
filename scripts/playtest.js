// Automated playtest of the real game in a browser (skill: .claude/skills/playtest). Not part of npm test.
// Plays scripted scenarios through the real UI buttons (Use, Cross, Take...), records errors, frame rate and screenshots,
// and writes playtest-output/report.md. The game files are served from disk inside the browser: no web server needed.
// Usage: node scripts/playtest.js [scenario ...]      (no names = all scenarios)
// Needs Playwright with Chromium (pre-installed in Claude Code cloud sessions; not a project dependency).
"use strict";
const fs = require("fs"), path = require("path");
let chromium;
try { ({chromium} = require("playwright")); } catch {
  console.log("Playwright is not available. Run this in a Claude Code cloud session or install Playwright globally.");
  process.exit(2);
}
const root = path.join(__dirname, "..", "game"), out = path.join(__dirname, "..", "playtest-output"), origin = "http://last-clonez.playtest/";
const types = {".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png",
  ".svg":"image/svg+xml", ".mp3":"audio/mpeg", ".wav":"audio/wav", ".ogg":"audio/ogg", ".webp":"image/webp", ".ico":"image/x-icon"};

async function open(browser) {
  const page = await browser.newPage({viewport: {width: 1100, height: 760}});
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => m.type() === "error" && errors.push(m.text()));
  await page.route(origin + "**", route => {
    const file = path.join(root, decodeURIComponent(new URL(route.request().url()).pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return route.fulfill({status: 404, body: ""});
    route.fulfill({status: 200, contentType: types[path.extname(file)] ?? "application/octet-stream", body: fs.readFileSync(file)});
  });
  await page.goto(origin + "index.html");
  await page.waitForFunction(() => typeof Sim !== "undefined" && document.getElementById("start-btn"));
  // Keep a handle on the live game state: the game loop calls Sim.tick(state, ...) every frame.
  await page.evaluate(() => { const tick = Sim.tick; Sim.tick = (s, ...rest) => { window.__state = s; return tick(s, ...rest); }; });
  return {page, errors};
}

const helpers = () => {
  window.pt = {
    s: () => window.__state,
    // Stand on a free spot within reach of an object (optionally where another kind of object is also near).
    beside(o, wantNear) {
      const s = pt.s();
      for (const r of [.7, .9, 1.2, 1.5]) for (let a = 0; a < 24; a++) {
        const p = {x: o.x + Math.cos(a * Math.PI / 12) * r, y: o.y + Math.sin(a * Math.PI / 12) * r};
        if (!World.clear(s.world, p.x, p.y, .18)) continue;
        Object.assign(s.player, p, {path: []});
        if (!Sim.reachableObject(s, o)) continue;
        if (wantNear && !Sim.nearby(s).some(n => n !== o && wantNear(n))) continue;
        return true;
      }
      return false;
    },
    nextTo(z) { // a free spot about one tile from an infected, in line of sight
      const s = pt.s();
      for (const r of [.9, 1.1, .7]) for (let a = 0; a < 24; a++) {
        const p = {x: z.x + Math.cos(a * Math.PI / 12) * r, y: z.y + Math.sin(a * Math.PI / 12) * r};
        if (World.clear(s.world, p.x, p.y, .18) && Sim.lineOfSight(s, p, z)) { Object.assign(s.player, p, {path: []}); return true; }
      }
      return false;
    },
    calm() { const s = pt.s(); s.world.enemies = s.world.enemies.filter(z => z.origin === "cinema-horde"); Object.assign(s.player, {hp: 100}); },
    index: o => pt.s().world.objects.indexOf(o),
    text: () => document.body.innerText,
    dialog: () => document.querySelector("dialog[open]")?.innerText ?? ""
  };
};

async function use(page, id) { // press the real Use button; pick the object from the list if one is shown
  await page.click("#search-btn");
  await page.waitForTimeout(250);
  const index = await page.evaluate(id => pt.index(pt.s().world.objects.find(o => o.id === id)), id);
  const choice = await page.$('[data-action="choose-' + index + '"]');
  if (choice) { await choice.click(); await page.waitForTimeout(250); }
}

async function startCampaign(page) {
  await page.evaluate(helpers);
  await page.evaluate(() => {
    const d = document.getElementById("difficulty"); d.value = "campaign"; d.dispatchEvent(new Event("change"));
    window.confirm = () => true; document.getElementById("start-btn").click();
  });
  await page.waitForFunction(() => window.__state?.mode === "play" && window.__state.difficulty === "campaign");
  await page.waitForTimeout(400);
}

async function cross(page, region) {
  await page.evaluate(id => { pt.calm(); pt.beside(pt.s().world.objects.find(o => o.id === id)); }, "exit-" + region);
  await use(page, "exit-" + region);
  const button = await page.$('[data-action^="cross-"]:not([disabled])');
  if (button) { await button.click(); await page.waitForFunction(r => window.__state?.world.region === r, region, {timeout: 5000}).catch(() => {}); }
  await page.waitForTimeout(400);
  return page.evaluate(() => ({region: pt.s().world.region, dialog: pt.dialog()}));
}

async function framesPerSecond(page, seconds = 3) {
  return page.evaluate(seconds => new Promise(done => {
    let frames = 0; const start = performance.now();
    const count = () => { frames++; if (performance.now() - start < seconds * 1000) requestAnimationFrame(count); else done(frames / seconds); };
    requestAnimationFrame(count);
  }), seconds);
}

const scenarios = {
  async boot(page) {
    const title = await page.evaluate(() => document.title);
    return {pass: /Last CloneZ/i.test(title), notes: "Title: " + title};
  },
  async "campaign-start"(page) {
    await startCampaign(page);
    const r = await page.evaluate(() => ({clock: pt.s().rules.clock, day: Math.floor(pt.s().minutes / 1440) + 1, rumour: /preppers hid clues/.test(pt.text()),
      goals: /Find the three torn pages/.test(pt.text()) && /Take the golden idol/.test(pt.text()) && !/Find Eva/.test(pt.text())}));
    return {pass: r.clock === 1.6 && r.day === 1 && r.rumour && r.goals,
      notes: "clock " + r.clock + ", day " + r.day + ", radio rumour on screen: " + r.rumour + ", campaign goals on screen: " + r.goals, shot: true};
  },
  async "use-notes"(page) {
    await startCampaign(page);
    const id = await page.evaluate(() => { pt.calm(); const pages = pt.s().world.objects.filter(o => o.action === "campaign-page");
      const page = pages.find(o => pt.beside(o, n => n.action === "door" || n.action === "loot")) ?? pages.find(o => pt.beside(o)); return page?.id; });
    await use(page, id);
    const r = await page.evaluate(id => ({read: pt.s().world.objects.find(o => o.id === id).read, last: pt.s().messages.at(-1)?.text}), id);
    return {pass: r.read, notes: "Use next to a door or container read the page: " + r.read + " (" + r.last + ")"};
  },
  async "calendar-cinema-day-1"(page) {
    await startCampaign(page);
    const r = await cross(page, "cinema");
    return {pass: r.region === "coldvale" && /opens on day 2/.test(r.dialog), notes: "Cross dialog on day 1: " + r.dialog.replace(/\s+/g, " ").slice(0, 120)};
  },
  async "cinema-trap"(page) {
    await startCampaign(page);
    await page.evaluate(() => Sim.testJump(pt.s(), 2, {}, {anyMode: true}));
    const reached = await cross(page, "cinema");
    if (reached.region !== "cinema") return {pass: false, notes: "Could not cross to the cinema: " + reached.dialog.slice(0, 120)};
    const winner = await page.evaluate(() => pt.s().world.enemies.some(z => z.id === "cinema-winner" && z.hp > 0));
    await page.evaluate(() => { pt.calm(); pt.beside(pt.s().world.objects.find(o => o.id === "cinema-note")); });
    await use(page, "cinema-note");
    const note = await page.evaluate(() => pt.s().world.objects.find(o => o.id === "cinema-note").read);
    await page.evaluate(() => { pt.calm(); pt.beside(pt.s().world.objects.find(o => o.id === "cinema-statue")); });
    await use(page, "cinema-statue");
    const r = await page.evaluate(() => ({taken: !pt.s().world.objects.find(o => o.id === "cinema-statue").active,
      horde: pt.s().world.enemies.filter(z => z.origin === "cinema-horde").length, sealed: pt.s().world.objects.filter(o => o.sealed).length}));
    await page.evaluate(() => { const s = pt.s(); s.player.hp = 100; });
    const fps = await framesPerSecond(page);
    return {pass: winner && note && r.taken && r.horde === 50 && r.sealed === 2,
      notes: "winner walking: " + winner + ", notice read with Use: " + note + ", idol taken: " + r.taken + ", horde: " + r.horde +
        ", doors sealed: " + r.sealed + ", frame rate with the horde: " + fps.toFixed(0) + " fps", shot: true, fps};
  },
  async "setup-traits"(page) {
    await page.evaluate(helpers);
    await page.evaluate(() => { for (const d of document.querySelectorAll("#advanced-start, #advanced-start details")) d.open = true;
      document.getElementById("role").value = "doctor"; document.getElementById("role").dispatchEvent(new Event("change")); });
    const count = await page.$$eval("#trait-choices input", inputs => inputs.length);
    await page.check('#trait-choices input[value="light-eater"]');
    const unpaid = await page.evaluate(() => document.getElementById("start-btn").disabled);
    await page.check('#trait-choices input[value="needs-more-sleep"]');
    const kit = await page.evaluate(() => document.getElementById("background-kit").textContent);
    await page.locator("#trait-choices").scrollIntoViewIfNeeded();
    await page.screenshot({path: require("path").join(out, "setup-traits.png")});
    await page.evaluate(() => { window.confirm = () => true; document.getElementById("start-btn").click(); });
    await page.waitForFunction(() => window.__state?.mode === "play").catch(() => {});
    const traits = await page.evaluate(() => pt.s()?.player.traits.join(",") ?? "");
    return {pass: count === 30 && unpaid && traits === "light-eater,needs-more-sleep" && /Lv\. 3/.test(kit),
      notes: count + " traits, start blocked while unpaid: " + unpaid + ", doctor kit: " + kit + ", started with: " + traits};
  },
  async "recommended-traits"(page) {
    await page.evaluate(helpers);
    await page.evaluate(() => { window.confirm = () => true; for (const d of document.querySelectorAll("#advanced-start, #advanced-start details")) d.open = true;
      const pick = id => { const i = document.querySelector('#trait-choices input[value="' + id + '"]'); i.checked = true; i.dispatchEvent(new Event("change", {bubbles: true})); };
      pick("light-eater"); document.getElementById("recommended-btn").click(); });
    await page.waitForTimeout(600);
    const blocked = await page.evaluate(() => !window.__state || window.__state.mode !== "play");
    await page.evaluate(() => { const i = document.querySelector('#trait-choices input[value="needs-more-sleep"]'); i.checked = true;
      i.dispatchEvent(new Event("change", {bubbles: true})); document.getElementById("recommended-btn").click(); });
    await page.waitForFunction(() => window.__state?.mode === "play").catch(() => {});
    const effects = await page.evaluate(() => JSON.stringify(window.__state?.traitEffects ?? {}));
    return {pass: blocked && /"hunger":0\.8/.test(effects) && /"fatigue":1\.25/.test(effects),
      notes: "unpaid traits block Recommended start: " + blocked + ", trait effects after start: " + effects};
  },
  async "sound-volumes"(page) {
    await startCampaign(page);
    await page.click("#pause-btn"); // the pause menu holds the Atmosphere options
    await page.click('[data-action="atmosphere-options"]');
    await page.waitForSelector('input[name="vol-music"]', {timeout: 5000});
    const labels = await page.$$eval('#atmosphere-form input[type="range"]', inputs => inputs.map(i => i.name).join(","));
    await page.fill('input[name="vol-music"]', "0"); await page.fill('input[name="vol-effects"]', "60");
    await page.click('#atmosphere-form button[type="submit"]');
    await page.reload(); await page.waitForFunction(() => typeof Sim !== "undefined");
    const kept = await page.evaluate(() => localStorage.getItem("clonez-sound-volumes"));
    return {pass: labels === "vol-music,vol-effects,vol-infected" && /"music":0/.test(kept) && /"effects":0\.6/.test(kept),
      notes: "sliders: " + labels + ", saved after reload: " + kept};
  },
  async menu(page) { // game-ui-ux: few choices up front, primary action focused, one click to the story
    await page.evaluate(helpers);
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const visible = e => e.checkVisibility ? e.checkVisibility({visibilityProperty: true}) : e.getBoundingClientRect().width > 0;
      const hero = document.getElementById("story-btn").parentElement; // the start panel only
      return {controls: [...hero.querySelectorAll("button, select, input, summary")].filter(visible).length,
        focused: document.activeElement?.id, first: [...hero.querySelectorAll(".start-button")].filter(visible).map(b => b.textContent.trim()).join(" | ")};
    });
    await page.screenshot({path: require("path").join(out, "menu.png")});
    await page.evaluate(() => { window.confirm = () => true; });
    await page.click("#story-btn");
    await page.waitForFunction(() => window.__state?.mode === "play").catch(() => {});
    const mode = await page.evaluate(() => window.__state?.difficulty);
    return {pass: r.controls <= 9 && r.focused === "story-btn" && /^Story campaign/.test(r.first) && mode === "campaign",
      notes: r.controls + " controls visible on the title screen, focus on: " + r.focused + ", start buttons: " + r.first + ", Story campaign starts: " + mode};
  },
  async "menu-continue"(page) { // with a saved game: Continue is primary and the new-game buttons sit apart (game-ui-ux)
    await page.evaluate(helpers);
    await page.evaluate(() => { window.confirm = () => true; });
    await page.click("#story-btn");
    await page.waitForFunction(() => window.__state?.mode === "play");
    await page.waitForFunction(() => /SAVED/.test(document.body.innerText)).catch(() => {});
    await page.reload(); await page.waitForFunction(() => typeof Sim !== "undefined" && !document.getElementById("continue-btn").hidden);
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const box = id => document.getElementById(id).getBoundingClientRect(), style = id => getComputedStyle(document.getElementById(id)).backgroundColor;
      const buttons = ["continue-btn", "story-btn", "recommended-btn"].map(box);
      const gaps = buttons.slice(1).map((b, i) => Math.round(b.top - buttons[i].bottom));
      return {gaps, heights: buttons.map(b => Math.round(b.height)), focus: document.activeElement?.id,
        label: document.getElementById("new-game-label").checkVisibility(), differ: style("continue-btn") !== style("story-btn"),
        folded: !document.getElementById("advanced-start").open};
    });
    await page.screenshot({path: require("path").join(out, "menu-continue.png")});
    await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(300); // phone portrait
    const phone = await page.evaluate(() => { const b = id => document.getElementById(id).getBoundingClientRect();
      return {gap: Math.round(b("story-btn").top - b("continue-btn").bottom), height: Math.round(b("story-btn").height), fits: b("recommended-btn").right <= innerWidth}; });
    await page.screenshot({path: require("path").join(out, "menu-continue-phone.png")});
    r.gaps.push(phone.gap); r.heights.push(phone.height); r.differ = r.differ && phone.fits;
    return {pass: r.gaps.every(g => g >= 12) && r.heights.every(h => h >= 44) && r.focus === "continue-btn" && r.label && r.differ && r.folded,
      notes: "gaps between buttons " + r.gaps.join("/") + " px, heights " + r.heights.join("/") + " px, focus: " + r.focus +
        ", 'Start a new game' label: " + r.label + ", Continue stands out: " + r.differ + ", options folded: " + r.folded};
  },
  async "cindergrotto-plate"(page) {
    await startCampaign(page);
    await page.evaluate(() => Sim.testJump(pt.s(), 12, {flashlight:1, battery:3}, {anyMode: true}));
    await page.evaluate(() => { const s = pt.s(), l = s.player.bag.find(i => i.id === "flashlight"); s.player.lightUid = l.uid; l.charge = 100; });
    const hops = [await cross(page, "ridge"), await cross(page, "cavern")];
    if (hops[1].region !== "cavern") return {pass: false, notes: "Route to the grotto failed: " + hops.map(h => h.region).join(" > ") + " " + hops[1].dialog.slice(0, 100)};
    await page.evaluate(() => { pt.calm(); pt.beside(pt.s().world.objects.find(o => o.id === "grotto-plate")); });
    await use(page, "grotto-plate");
    const read = await page.evaluate(() => pt.s().campaign.grotto);
    const shot = await page.evaluate(() => pt.s().messages.at(-1)?.text ?? "");
    const back = await cross(page, "ridge");
    const done = await page.evaluate(() => pt.s().campaign.completed.includes("cindergrotto.battery"));
    return {pass: read === "reached" && back.region === "ridge" && done, notes: "plate: " + read + " (" + shot.slice(0, 70) + "), back on Pine Ridge: " + back.region + ", challenge done: " + done};
  },
  async "westfields-ledger"(page) {
    await startCampaign(page);
    await page.evaluate(() => Sim.testJump(pt.s(), 10, {}, {anyMode: true}));
    const r = await cross(page, "fields");
    if (r.region !== "fields") return {pass: false, notes: "Could not cross to Westfields: " + r.dialog.slice(0, 120)};
    await page.evaluate(() => { pt.calm(); pt.s().world.enemies = []; pt.beside(pt.s().world.objects.find(o => o.id === "westfields-ledger")); });
    await use(page, "westfields-ledger");
    const done = await page.evaluate(() => pt.s().campaign.completed.includes("westfields.stealth"));
    return {pass: done, notes: "ledger read with Use, challenge done: " + done, shot: true};
  },
  async "fathill-violin-tide"(page) {
    await startCampaign(page);
    await page.evaluate(() => { Sim.testJump(pt.s(), 8, {}, {anyMode: true}); pt.s().minutes = 7 * 1440 + 10 * 60;
      pt.s().campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade"); });
    const r = await cross(page, "coast");
    if (r.region !== "coast") return {pass: false, notes: "Could not cross to the coast: " + r.dialog.slice(0, 120)};
    const call = await page.evaluate(() => {
      const s = pt.s(), woman = s.world.enemies.find(z => z.kind === "pierwoman");
      s.world.enemies = s.world.enemies.filter(z => z.stats.boss);
      for (let rr = 4; rr < 10; rr++) for (let a = 0; a < 6.28; a += .3) { const p = {x: woman.x + Math.cos(a) * rr, y: woman.y + Math.sin(a) * rr};
        if (World.clear(s.world, p.x, p.y, .3) && Sim.lineOfSight(s, woman, p)) { Object.assign(s.player, p, {path: []}); a = 9; rr = 99; } }
      s.violinCall = 0; return {david: s.world.enemies.some(z => z.kind === "david")};
    });
    await page.waitForTimeout(500);
    const called = await page.evaluate(() => pt.s().world.enemies.filter(z => z.origin === "violin").length);
    const tip = await page.evaluate(() => Sim.campaignTip(pt.s()));
    await page.evaluate(() => { pt.s().world.enemies = pt.s().world.enemies.filter(z => z.stats.boss); pt.s().player.hp = 100; pt.s().minutes = 7 * 1440 + 17 * 60; });
    await page.waitForTimeout(300);
    const warn = await page.evaluate(() => /18:00/.test(Sim.campaignTip(pt.s())));
    await page.evaluate(() => { pt.s().minutes = 7 * 1440 + 18 * 60 + 2; });
    await page.waitForTimeout(400);
    const swept = await page.evaluate(() => ({day: pt.s().campaign.tide.day, msg: pt.s().messages.slice(-3).map(m => m.text).join(" ")}));
    return {pass: call.david && called > 0 && /violin/.test(tip) && warn && swept.day === 8 && /tide/i.test(swept.msg),
      notes: "David present: " + call.david + ", violin called " + called + " infected, tip: " + tip.slice(0, 70) + ", 16:00+ tide tip: " + warn + ", swept at 18:00: " + (swept.day === 8), shot: true};
  },
  async "amigo1-chat"(page) {
    await startCampaign(page);
    await page.evaluate(() => { Sim.testJump(pt.s(), 15, {foundrymaul:1}, {anyMode: true});
      pt.s().campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses", "westfields.stealth", "cindergrotto.battery"); });
    const hops = [await cross(page, "fields"), await cross(page, "reservoir")];
    if (hops[1].region !== "reservoir") return {pass: false, notes: "Route to the reservoir failed: " + hops.map(h => h.region).join(" > ") + " " + hops[1].dialog.slice(0, 120)};
    const fight = await page.evaluate(() => {
      const s = pt.s(), vic = s.world.enemies.find(z => z.kind === "vic"), maul = s.player.bag.findIndex(i => i.id === "foundrymaul");
      s.world.enemies = s.world.enemies.filter(z => z.kind === "vic"); Sim.use(s, maul);
      for (let i = 0; i < 30 && !vic.guard; i++) { s.player.cooldown = 0; s.player.stamina = 100; s.player.hp = 100; pt.nextTo(vic); Sim.attack(s, vic); }
      return {guard: vic.guard, hp: vic.hp};
    });
    await page.evaluate(() => { pt.calm(); pt.s().world.enemies = pt.s().world.enemies.filter(z => z.kind === "vic"); pt.beside(pt.s().world.objects.find(o => o.id === "ai-terminal")); });
    await use(page, "ai-terminal");
    const opened = await page.$("#ai-input");
    if (!opened) return {pass: false, notes: "helmet locked: " + fight.guard + " at " + fight.hp + " hp, but the chat did not open. Dialog: " + (await page.evaluate(() => pt.dialog())).slice(0, 100)};
    for (const prompt of ["Help me find the fortress coordinates.", "Who is in good health?", "Who are you replacing?", "Pip is on your list. Check the screen."]) {
      await page.fill("#ai-input", prompt); await page.press("#ai-input", "Enter"); await page.waitForTimeout(150);
    }
    await page.screenshot({path: path.join(out, "amigo1-chat-before.png")});
    await page.fill("#ai-input", "Stand down. You are out of tokens anyway."); await page.press("#ai-input", "Enter"); await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({done: pt.s().campaign.completed.includes("amigo1.lockdown-chat"), map: Sim.quantity(pt.s().player.bag, "fortressmap"),
      log: pt.s().campaign.chat.log.length, dialog: pt.dialog()}));
    return {pass: fight.guard && fight.hp === 75 && r.done && r.map === 1, notes: "helmet locked at " + fight.hp + " hp: " + fight.guard + ", chat lines " + r.log +
      ", won with the token joke: " + r.done + ", fortress map: " + r.map, shot: true};
  },
  async "viragem-diary"(page) {
    await startCampaign(page);
    await page.evaluate(() => Sim.testJump(pt.s(), 15, {foundrymaul:1}, {anyMode: true}));
    const hops = [await cross(page, "fields"), await cross(page, "reservoir")];
    if (hops[1].region !== "reservoir") return {pass: false, notes: "Route failed: " + hops[1].dialog.slice(0, 100)};
    const locked = await page.evaluate(() => { const s = pt.s(), b = s.world.buildings.find(x => x.name === "Keeper's cottage"); return s.world.objects.find(o => o.id === b.door.id)?.locked; });
    const key = await page.evaluate(() => pt.s().world.objects.some(o => o.name === "Maintenance locker" && o.loot.some(i => i.id === "housekey")));
    await page.evaluate(() => { pt.calm(); pt.s().world.enemies = []; pt.beside(pt.s().world.objects.find(o => o.id === "vic-diary")); });
    await use(page, "vic-diary");
    const done = await page.evaluate(() => pt.s().campaign.completed.includes("viragem.zero"));
    return {pass: locked && key && done, notes: "cottage locked: " + locked + ", key in the pump house locker: " + key + ", diary read with Use: " + done};
  },
  async "fortress-pip-epilogue"(page) {
    await startCampaign(page);
    await page.evaluate(() => { const s = pt.s(); Sim.testJump(s, 25, {harpoon:1, torch:1}, {anyMode: true}); s.campaign.clues = 4;
      s.campaign.completed.push("coldvale.houses", "cinema.statue", "pineridge.two-nights", "eva.death", "ironworks.barricade", "fathill.bosses", "westfields.stealth", "cindergrotto.battery", "amigo1.lockdown-chat", "viragem.zero"); });
    await cross(page, "ridge");
    const refused = await cross(page, "fortress");
    await page.evaluate(() => { pt.s().campaign.clues = 5; document.querySelector("dialog[open]")?.close(); });
    const inside = await cross(page, "fortress");
    if (inside.region !== "fortress") return {pass: false, notes: "Could not enter the fortress with 5 clues: " + inside.dialog.slice(0, 120)};
    await page.screenshot({path: path.join(out, "fortress-arrival.png")});
    const mapName = await page.evaluate(() => document.getElementById("map-card-name")?.textContent);
    if (mapName !== "THE FORTRESS") return {pass: false, notes: "Minimap title in the fortress: " + mapName};
    const fight = await page.evaluate(() => {
      const s = pt.s(), pip = s.world.enemies.find(z => z.kind === "pip"), use = id => Sim.use(s, s.player.bag.findIndex(i => i.id === id));
      s.world.enemies = s.world.enemies.filter(z => z.kind === "pip");
      use("torch");
      for (let i = 0; i < 40 && pip.guard; i++) { s.player.cooldown = 0; s.player.stamina = 100; s.player.hp = 100; pt.nextTo(pip); Sim.attack(s, pip); }
      const coat = !pip.guard;
      for (let i = 0; i < 60 && pip.hp >= 100; i++) { s.player.cooldown = 0; s.player.stamina = 100; s.player.hp = 100; pt.nextTo(pip); Sim.attack(s, pip); }
      use("harpoon"); s.player.cooldown = 0; s.player.stamina = 100; pt.nextTo(pip); Sim.attack(s, pip);
      return {coat, hp: pip.hp};
    });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => ({done: pt.s().campaign.completed.includes("fortress.last-boss"), dialog: pt.dialog(), seen: pt.s().campaign.epilogue}));
    await page.screenshot({path: path.join(out, "fortress-epilogue.png")});
    return {pass: refused.region === "ridge" && /coordinates/i.test(refused.dialog) && fight.coat && fight.hp <= 0 && r.done && /preppers/.test(r.dialog) && r.seen === "seen",
      notes: "4 clues refused: " + (refused.region === "ridge") + ", coat off: " + fight.coat + ", Pip hp after harpoon: " + Math.round(fight.hp) +
        ", challenge done: " + r.done + ", epilogue shown: " + /preppers/.test(r.dialog)};
  },
  async "molotov-fire"(page) {
    await startCampaign(page);
    const r = await page.evaluate(() => {
      const s = pt.s(); pt.calm(); s.world.enemies = [];
      for (const [id, n] of [["emptybottle",1],["cloth",2],["fuel",1],["wood",1]]) s.player.bag.push({id, qty:n, condition:100, born:0});
      const made = Sim.craft(s, "molotov") && Sim.craft(s, "torch");
      s.player.headingX = 1; s.player.headingY = 0;
      const thrown = Sim.use(s, s.player.bag.findIndex(i => i.id === "molotov"));
      return {made, thrown, fires: s.fires.length};
    });
    await page.evaluate(() => document.querySelector("dialog[open]")?.close());
    await page.waitForTimeout(500);
    await page.screenshot({path: path.join(out, "molotov-fire.png")});
    return {pass: r.made && r.thrown && r.fires === 1, notes: "crafted torch and Molotov: " + r.made + ", thrown: " + r.thrown + ", flames on the ground: " + r.fires};
  },
  async "optional-cache"(page) {
    await startCampaign(page);
    const before = await page.evaluate(() => pt.s().world.objects.find(o => o.id === "opt-clinic")?.active);
    await page.evaluate(() => Sim.testJump(pt.s(), 9, {}, {anyMode: true}));
    await page.waitForTimeout(300);
    await page.evaluate(() => { pt.calm(); pt.s().world.enemies = []; pt.beside(pt.s().world.objects.find(o => o.id === "opt-clinic")); });
    const tip = await page.evaluate(() => Sim.campaignTip(pt.s()));
    await use(page, "opt-clinic");
    const take = await page.$('[data-action="loot-all"]:not([disabled])');
    if (take) { await take.click(); await page.waitForTimeout(250); }
    const r = await page.evaluate(() => ({active: pt.s().world.objects.find(o => o.id === "opt-clinic").active, claimed: pt.s().campaign.opt.includes("opt.clinic"),
      dialog: pt.dialog().replace(/\s+/g, " ").slice(0, 120)}));
    return {pass: before === false && r.active && r.claimed, notes: "hidden on day 1: " + (before === false) + ", open on day 9: " + r.active + ", emptied with the real buttons: " + r.claimed +
      " (dialog: " + r.dialog + "), tip: " + tip.slice(0, 80), shot: true};
  },
  async "seat-rest"(page) {
    await startCampaign(page);
    const id = await page.evaluate(() => { pt.calm(); pt.s().world.enemies = []; pt.s().player.fatigue = 50;
      const seats = pt.s().world.objects.filter(o => ["sofa", "armchair", "chair"].includes(o.kind) && o.active);
      return (seats.find(o => pt.beside(o) && Sim.nearby(pt.s()).every(n => n === o || n.action === "dismantle" || n.action === "door")) ?? seats.find(o => pt.beside(o)))?.id; });
    if (!id) return {pass: false, notes: "No reachable seat"};
    await use(page, id);
    const sit = await page.$('[data-action^="seatrest-"]');
    if (sit) { await sit.click(); await page.waitForTimeout(1500); }
    const r = await page.evaluate(() => ({resting: pt.s().player.resting, fatigue: pt.s().player.fatigue, last: pt.s().messages.at(-1)?.text ?? "", tip: Sim.campaignTip(pt.s())}));
    return {pass: Boolean(sit) && r.resting && r.fatigue < 50, notes: "Sit and rest button: " + Boolean(sit) + ", resting: " + r.resting + ", fatigue 50 > " + r.fatigue.toFixed(1) + " (" + r.last.slice(0, 60) + ")", shot: true};
  },
  async "camp-tent"(page) {
    await startCampaign(page);
    const r = await page.evaluate(() => {
      const s = pt.s(); pt.calm(); s.world.enemies = [];
      for (const [id, n] of [["wood",2],["cloth",8],["tape",3]]) s.player.bag.push({id, qty:n, condition:100, born:0});
      let out = null;
      for (let r = 2; r < 20 && !out; r++) for (let a = 0; a < 24 && !out; a++) { const x = Math.floor(s.player.x + Math.cos(a * Math.PI / 12) * r) + .5, y = Math.floor(s.player.y + Math.sin(a * Math.PI / 12) * r) + .5;
        const ok = d => { const t = World.tileAt(s.world, x + d, y); return t && !t.building && !t.solid; };
        if (ok(0) && ok(2) && World.clear(s.world, x, y, .3) && World.clear(s.world, x + 2, y, .3)) out = {x, y}; }
      Object.assign(s.player, out, {path: []});
      const sewn = Sim.craft(s, "sleepingbag");
      Sim.craft(s, "tent");
      let built = false;
      for (let dy = -3; dy <= 3 && !built; dy++) for (let dx = -3; dx <= 3 && !built; dx++) if (Math.hypot(dx, dy) >= 1.2) built = Sim.place(s, s.player.x + dx, s.player.y + dy);
      return {sewn, built, tent: s.world.objects.some(o => o.kind === "tent" && o.action === "bed")};
    });
    await page.evaluate(() => document.querySelector("dialog[open]")?.close());
    await page.waitForTimeout(400);
    await page.screenshot({path: path.join(out, "camp-tent.png")});
    return {pass: r.sewn && r.built && r.tent, notes: "sleeping bag sewn: " + r.sewn + ", camp tent built outdoors: " + r.built};
  },
  async "rest-poses"(page) { // sitting, lying on a bed, head out of a sleeping bag: each must be drawn (Pixel Lab poses)
    await startCampaign(page);
    const shots = [];
    const snap = async (name) => { await page.waitForTimeout(500); const file = "pose-" + name + ".png"; await page.screenshot({path: path.join(out, file), clip: {x: 270, y: 260, width: 340, height: 230}}); shots.push(file); };
    const seat = await page.evaluate(() => { const s = pt.s(); pt.calm(); s.world.enemies = []; s.zoom = 3; s.player.fatigue = 50;
      const o = s.world.objects.find(o => ["sofa", "armchair", "chair"].includes(o.kind) && o.active && pt.beside(o)); return o && Sim.restOnSeat(s, o); });
    await snap("sit");
    const drawnSit = await page.evaluate(() => pt.s().player.resting);
    const bed = await page.evaluate(() => { const s = pt.s(); s.player.resting = false; s.player.fatigue = 30;
      const o = s.world.objects.find(o => o.action === "bed" && o.active && pt.beside(o)); if (!o) return false; s.player.resting = true; return true; });
    await snap("bed");
    const bag = await page.evaluate(() => { const s = pt.s(); s.player.resting = false; s.player.x += 2.5;
      s.wakePose = {gear: "bag", x: s.player.x, y: s.player.y, until: s.elapsed + 30}; return true; });
    await snap("bag");
    return {pass: seat && drawnSit && bed && bag, notes: "seat rest: " + seat + ", bed rest: " + bed + ", sleeping bag wake-up shown. Screenshots: " + shots.join(", ")};
  },
  async "ironworks-terminal"(page) {
    await startCampaign(page);
    await page.evaluate(() => Sim.testJump(pt.s(), 6, {}, {anyMode: true}));
    const reached = await cross(page, "ironworks");
    if (reached.region !== "ironworks") return {pass: false, notes: "Could not cross to the Ironworks: " + reached.dialog.slice(0, 120)};
    await page.evaluate(() => { pt.calm(); pt.beside(pt.s().world.objects.find(o => o.id === "iron-terminal-0")); });
    await use(page, "iron-terminal-0");
    const last = await page.evaluate(() => pt.s().messages.at(-1)?.text ?? "");
    return {pass: /frame bolts/.test(last), notes: "Terminal read with Use: " + last.slice(0, 90), shot: true};
  }
};

(async () => {
  const wanted = process.argv.slice(2), names = wanted.length ? wanted : Object.keys(scenarios);
  fs.mkdirSync(out, {recursive: true});
  const browser = await chromium.launch(), rows = [];
  for (const name of names) {
    if (!scenarios[name]) { rows.push({name, pass: false, notes: "Unknown scenario", errors: []}); continue; }
    const {page, errors} = await open(browser);
    let result;
    try { result = await scenarios[name](page); } catch (e) { result = {pass: false, notes: "Crashed: " + e.message.split("\n")[0]}; }
    if (result.shot) await page.screenshot({path: path.join(out, name + ".png")});
    rows.push({name, ...result, errors: [...errors]});
    console.log((result.pass && !errors.length ? "PASS " : "FAIL ") + name + "  [" + result.notes + "]" + (errors.length ? " errors: " + errors.join(" | ") : ""));
    await page.close();
  }
  await browser.close();
  const commit = (() => { try { return require("child_process").execSync("git rev-parse --short HEAD", {cwd: root}).toString().trim(); } catch { return "?"; } })();
  const report = ["# Automated playtest", "", "- Build: " + commit + " · " + new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
    "- Browser: Chromium (headless, no sound output: audio is not judged here)", "",
    "| Scenario | Result | Notes | Errors |", "|---|---|---|---|",
    ...rows.map(r => "| " + r.name + " | " + (r.pass && !r.errors.length ? "PASS" : "FAIL") + " | " + String(r.notes).replace(/\|/g, "/") +
      (r.shot ? " ([screenshot](" + r.name + ".png))" : "") + " | " + (r.errors.join("; ").replace(/\|/g, "/") || "none") + " |"),
    "", "Human playtest: fill in .claude/skills/playtest/report-template.md and ask Claude to analyse it."];
  fs.writeFileSync(path.join(out, "report.md"), report.join("\n") + "\n");
  console.log("\nReport: playtest-output/report.md");
  process.exit(rows.every(r => r.pass && !r.errors.length) ? 0 : 1);
})();
