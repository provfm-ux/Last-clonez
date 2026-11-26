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
    const r = await page.evaluate(() => ({clock: pt.s().rules.clock, day: Math.floor(pt.s().minutes / 1440) + 1, rumour: /preppers hid clues/.test(pt.text())}));
    return {pass: r.clock === 1.6 && r.day === 1 && r.rumour, notes: "clock " + r.clock + ", day " + r.day + ", radio rumour on screen: " + r.rumour, shot: true};
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
    await page.evaluate(() => { for (const d of [document.querySelector("details.advanced-start"), ...document.querySelectorAll("details.survivor-customization")]) if (d) d.open = true;
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
    await page.evaluate(() => { window.confirm = () => true; const d = document.getElementById("advanced-start"); if (d) d.open = true;
      for (const c of document.querySelectorAll("details.survivor-customization")) c.open = true;
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
