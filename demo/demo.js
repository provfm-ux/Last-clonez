"use strict";

// Itch.io demo layer (see docs/DEMO.md). Loaded only by `npm run build:demo`, after game.js.
// It patches the game from the outside: no change to game/*.js, so the full game and its saves stay untouched.
//   - the run starts in Oxford Night Reel (cinema) and the cinema exit leads to Cinder Grotto, and back
//   - campaign day/item gating is lifted so both areas are open from the first minute
//   - 30 real minutes of play in total (paused screens and hidden tabs do not count), then an end screen
//   - a "Report a bug" button that opens a mail draft (and offers copy-to-clipboard as a fallback)
const Demo = (() => {
  const config = typeof DEMO_CONFIG === "undefined" ? {} : DEMO_CONFIG;
  const limitSeconds = Number.isFinite(config.limitSeconds) ? config.limitSeconds : 1800;
  const email = String(config.email || "");
  const version = String(config.version || "demo");
  const fullGameUrl = String(config.fullGameUrl || "");
  const pageUrl = String(config.pageUrl || fullGameUrl);
  const shareText = "I just survived the Last CloneZ demo: a cult cinema, a golden idol and a horde that won't stay quiet. Free to play in your browser.";
  const secondsKey = "last-clonez-demo-seconds-v1";
  const point = ([x, y]) => ({x: x + .5, y: y + .5});
  // Arrival tiles (the tile beside each door): cinema foyer and the grotto's lower gallery.
  const arrivals = {cinema: point([14, 27]), grottoReturn: point([22, 28]), cavern: point([19, 37])};
  const grottoDoor = point([22, 29]);
  const names = {cinema: "Oxford Night Reel", cavern: "Cinder Grotto"};

  function patchWorld() {
    const connection = Regions.connection, addExits = Regions.addExits;
    Regions.connection = (from, to) => {
      if (from === "cinema" && to === "cavern") return {arrival: arrivals.cavern, vehicles: false};
      if (from === "cavern" && to === "cinema") return {arrival: arrivals.grottoReturn, vehicles: false};
      if (from === "cavern" || to === "cavern") return null;
      if (from === "coldvale" && to === "cinema" || from === "cinema" && to === "coldvale") return connection(from, to);
      return null;
    };
    // Cold Vale (survival hub) -> cinema -> grotto. Every other crossing is switched off. The grotto's old ridge exit
    // stays in the world, off, because the grotto's own set-up (the rope landing cache) still looks it up by id.
    Regions.addExits = world => {
      addExits(world);
      const off = o => Object.assign(o, {active: false, action: undefined});
      if (world.region === "coldvale") {
        for (const o of world.objects) if (o.kind === "exit" && o.id !== "exit-cinema") off(o);
      } else if (world.region === "cinema") {
        world.objects.push({id: "exit-cavern", ...grottoDoor, kind: "exit", action: "travel", name: names.cavern, active: true, solid: false, tint: .5});
      } else if (world.region === "cavern") {
        const old = world.objects.find(o => o.id === "exit-ridge");
        if (old) { world.objects.push({...old, id: "exit-cinema", name: names.cinema}); off(old); }
      }
    };
    // All three areas open on day 1, no flashlight or clue prerequisites.
    Campaign.closedReason = () => "";
    Campaign.missing = () => "";
  }

  function createRun(seed, profile) {
    const s = Sim.createControl("campaign", "carer", "shelter", undefined, {...profile, seed});
    const pack = [["battery", 2], ["bandage", 2]];
    for (const [id, qty] of pack) {
      const held = s.player.bag.find(item => item.id === id);
      if (held) held.qty += qty;
      else if (Data.items[id]) s.player.bag.push({id, qty, condition: 100, born: 0, uid: "demo-" + id});
    }
    s.difficultyOptions = Sim.difficultyOptions(s, {windup: true, grabs: true, bleed: true, reminder: true, stamina: true});
    s.controlStart = "demo";
    return s;
  }

  const patchStart = () => { Sim.createRecommended = seed => createRun(seed, {}); };

  function report(text, game) {
    const lines = [
      text.trim() || "(describe what happened here)",
      "",
      "--- details (please keep) ---",
      "Build: Last CloneZ " + version,
      "Play time: " + Math.round(spent() / 60 * 10) / 10 + " min of " + limitSeconds / 60,
      ...(game ?? []),
      "Screen: " + (typeof innerWidth === "number" ? innerWidth + "x" + innerHeight : "?"),
      "Browser: " + (typeof navigator === "object" ? navigator.userAgent : "?")
    ];
    return {subject: "[Last CloneZ demo] Bug report", body: lines.join("\n")};
  }

  const mailto = ({subject, body}) => "mailto:" + encodeURIComponent(email).replace(/%40/g, "@") +
    "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  let seconds = 0;
  const spent = () => seconds;
  const remaining = () => Math.max(0, limitSeconds - seconds);
  const over = () => seconds >= limitSeconds;

  function clock(read, write) {
    seconds = Math.max(0, Number(read()) || 0);
    return {
      add(amount) { seconds = Math.min(limitSeconds, seconds + amount); write(String(Math.round(seconds * 10) / 10)); return seconds; },
      reset() { seconds = 0; write("0"); }
    };
  }

  function minutesLabel(sec) {
    const total = Math.ceil(sec);
    return Math.floor(total / 60) + ":" + String(total % 60).padStart(2, "0");
  }

  function ui() {
    const $ = id => document.getElementById(id);
    const storage = {
      read: () => { try { return localStorage.getItem(secondsKey); } catch { return null; } },
      write: value => { try { localStorage.setItem(secondsKey, value); } catch { /* private mode: the limit still applies this session */ } }
    };
    const timer = clock(storage.read, storage.write);

    document.title = "Last CloneZ - Demo";
    const style = document.createElement("style");
    style.textContent =
      ".demo-chip{position:fixed;z-index:20;left:10px;bottom:10px;display:flex;gap:6px;font:600 12px/1 system-ui,sans-serif}" +
      ".demo-chip button,.demo-chip span{background:#171d17ee;color:#e8e2d0;border:1px solid #5c6b58;border-radius:6px;padding:8px 10px}" +
      ".demo-chip button{cursor:pointer}.demo-chip button:hover{background:#2b352a}.demo-chip .low{color:#ee8e78;border-color:#ee8e78}" +
      "dialog.demo-dialog{background:#141a14;color:#e8e2d0;border:1px solid #5c6b58;border-radius:10px;max-width:min(520px,92vw);padding:20px;font:14px/1.45 system-ui,sans-serif}" +
      "dialog.demo-dialog::backdrop{background:#000b}.demo-dialog h2{margin:0 0 8px;font-size:18px}" +
      ".demo-dialog textarea{width:100%;min-height:120px;box-sizing:border-box;background:#0c100c;color:inherit;border:1px solid #5c6b58;border-radius:6px;padding:8px;font:inherit}" +
      ".demo-dialog .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.demo-dialog .row a,.demo-dialog .row button{background:#2d4a2d;color:#fff;border:0;border-radius:6px;padding:9px 14px;font:600 13px system-ui;cursor:pointer;text-decoration:none}" +
      ".demo-dialog .row .quiet{background:#2b352a}.demo-dialog small{color:#a9b3a2;display:block;margin-top:8px}";
    document.head.append(style);

    // Start screen: one clear way in, with the demo limits spelled out.
    for (const id of ["longhaul-btn", "advanced-start"]) {
      const el = $(id);
      if (el?.nextElementSibling?.classList.contains("recommended-detail")) el.nextElementSibling.hidden = true;
      if (el) el.hidden = true;
    }
    const start = $("recommended-btn");
    if (start) {
      const label = [...start.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (label) label.textContent = " Play the demo ";
      const detail = start.nextElementSibling;
      if (detail) detail.textContent = "30 minutes · Cold Vale survival + Oxford Night Reel cinema + Cinder Grotto";
    }
    const copy = document.querySelector(".hero-copy");
    if (copy) {
      const teaser = document.createElement("p");
      teaser.className = "demo-teaser";
      teaser.innerHTML = "<b>Demo:</b> a radio rumour says the preppers built a fortress with years of supplies. " +
        "Hold out in your Cold Vale shelter: scavenge, board up, cook, keep warm. Then cross town to a cult cinema where the " +
        "raffle never finished, and go underground into the Cinder Grotto. Take the golden idol if you dare.";
      copy.append(teaser);
    }
    const sub = document.querySelector(".brand-sub");
    if (sub) sub.textContent = "DEMO";
    const status = $("save-status");
    if (status) status.textContent = "DEMO " + version;

    const bugDialog = document.createElement("dialog"), endDialog = document.createElement("dialog");
    bugDialog.className = endDialog.className = "demo-dialog";
    for (const d of [bugDialog, endDialog]) {
      for (const type of ["keydown", "keyup"]) d.addEventListener(type, e => e.stopPropagation());
    }
    bugDialog.innerHTML = '<h2>Report a bug</h2><p>Tell us what went wrong. Your play time and browser are added automatically.</p>' +
      '<textarea id="demo-bug-text" maxlength="1500" placeholder="What happened? What did you expect?"></textarea>' +
      '<div class="row"><a id="demo-bug-mail" href="#" target="_blank" rel="noopener">Send by email</a>' +
      '<button type="button" class="quiet" id="demo-bug-copy">Copy report</button>' +
      '<button type="button" class="quiet" id="demo-bug-close">Close</button></div>' +
      "<small>" + (email ? "Goes to " + email + ". If your mail app does not open, copy the report and send it yourself." :
        "No email is set for this build.") + "</small>";
    endDialog.innerHTML = "<h2>That's the end of the demo</h2><p>You used your 30 minutes in Cold Vale, the Oxford Night Reel and the Cinder Grotto. " +
      "Thanks for playing.</p><p><b>In the full game</b> (30 nights, 11 areas):</p><ul>" +
      "<li>Eva, the radio and a rumour about a prepper fortress</li>" +
      "<li>Five coordinates hidden across Pine Ridge, the Ironworks, FatHill, Westfields and the Grotto</li>" +
      "<li>Bosses, a day-5 loss that stays with you, and a twist about who built the fortress</li></ul>" +
      "<p>Found something broken, or have an opinion? We read every report.</p>" +
      '<div class="row">' + (pageUrl ? '<a href="' + pageUrl + '" target="_blank" rel="noopener">Follow the game</a>' : "") +
      '<button type="button" id="demo-end-share">Share the demo</button>' +
      '<button type="button" id="demo-end-bug">Report a bug</button></div>';
    endDialog.addEventListener("cancel", e => e.preventDefault());
    document.body.append(bugDialog, endDialog);

    const gameState = () => {
      const label = $("location")?.textContent, day = $("day")?.textContent, clock = $("timer")?.textContent;
      return ["Area: " + label, "In-game: " + day + " " + clock];
    };
    const draft = () => report($("demo-bug-text").value, gameState());
    const pauseGame = () => { const b = $("pause-btn"); if (b && !b.disabled && !$("dialog").open) b.click(); };

    function openBug() {
      pauseGame();
      if (endDialog.open) endDialog.close();
      $("demo-bug-mail").href = mailto(draft());
      if (!bugDialog.open) bugDialog.showModal();
    }
    $("demo-bug-text").addEventListener("input", () => { $("demo-bug-mail").href = mailto(draft()); });
    $("demo-bug-close").addEventListener("click", () => { bugDialog.close(); if (over()) endDialog.showModal(); });
    $("demo-bug-copy").addEventListener("click", async () => {
      const {subject, body} = draft(), text = "To: " + email + "\nSubject: " + subject + "\n\n" + body;
      try { await navigator.clipboard.writeText(text); $("demo-bug-copy").textContent = "Copied"; }
      catch { $("demo-bug-text").value = text; $("demo-bug-text").select(); $("demo-bug-copy").textContent = "Select all and copy"; }
    });
    $("demo-end-bug").addEventListener("click", openBug);
    $("demo-end-share").addEventListener("click", async () => {
      const text = shareText + (pageUrl ? " " + pageUrl : "");
      try {
        if (navigator.share) await navigator.share({text, url: pageUrl || undefined});
        else { await navigator.clipboard.writeText(text); $("demo-end-share").textContent = "Copied"; }
      } catch { /* share cancelled */ }
    });

    const chip = document.createElement("div");
    chip.className = "demo-chip";
    chip.innerHTML = '<button type="button" id="demo-bug-btn">Report a bug</button><span id="demo-left"></span>';
    document.body.append(chip);
    $("demo-bug-btn").addEventListener("click", openBug);

    function finish() {
      pauseGame();
      if (bugDialog.open) bugDialog.close();
      if (!endDialog.open) endDialog.showModal();
    }
    function paint() {
      const left = $("demo-left");
      left.textContent = "Demo " + minutesLabel(remaining()) + " left";
      left.classList.toggle("low", remaining() <= 300);
    }
    // Only live play counts: the menu, pause screens, dialogs and background tabs do not.
    setInterval(() => {
      const playing = !document.hidden && $("hero").hidden && !$("dialog").open && !bugDialog.open && !endDialog.open && !$("pause-btn").disabled;
      if (playing) timer.add(1);
      paint();
      if (over()) finish();
    }, 1000);
    paint();
    if (over()) finish();
    return {timer, openBug, finish};
  }

  function install() {
    patchWorld();
    patchStart();
    if (typeof document !== "undefined") return ui();
    return null;
  }

  return {install, createRun, report, mailto, clock, minutesLabel, limitSeconds, arrivals};
})();
Demo.install();
