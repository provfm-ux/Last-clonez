"use strict";

(() => {
  const $ = id => document.getElementById(id);
  const canvas = $("world"), minimap = $("minimap"), dialog = $("dialog"), body = $("dialog-body");
  const stickElement = $("move-stick"), presses = new Map();
  const keys = new Set(), storageKey = "last-shelter-control-save-v1", backupKey = storageKey + "-previous";
  const soundKey = "last-shelter-control-muted";
  const setupKey = "last-shelter-control-world-setup-v1";
  const stick = {pointer: null, originX: 0, originY: 0, x: 0, y: 0};
  const motionKeys = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"]);
  // Movement follows the physical WASD position (event.code) so AZERTY, Dvorak and similar layouts work.
  const codeKeys = {KeyW: "w", KeyA: "a", KeyS: "s", KeyD: "d", ArrowUp: "arrowup", ArrowDown: "arrowdown", ArrowLeft: "arrowleft", ArrowRight: "arrowright"};
  let state = Sim.createControl("survival", "carer", "shelter"), lastFrame = performance.now(), nextHud = 0, nextMap = 0, nextSave = 10, lastRender = 0, noiseRings = false, look = (() => { try { const v = localStorage.getItem("clonez-gfx"); return v === "classic" || v === "fast" ? v : "dark"; } catch { return "dark"; } })();
  const navigationKey = "clonez-navigation";
  const startChoiceKey = "clonez-start-choice";
  const guideKey = "clonez-beginner-hints";
  const playtestKey = "clonez-playtest-milestones";
  const assistsKey = "clonez-new-run-assists";
  const atmosphereKey = "clonez-visual-atmosphere";
  const flickerKey = "clonez-reduce-flicker";
  const volumeKey = "clonez-sound-volumes";
  const volumeLabels = {music:"Music and tension", effects:"Effects", infected:"Infected"};
  const atmosphereLabels = {full:"Full", reduced:"Reduced", off:"Off"};
  let atmosphereChoice = read(atmosphereKey);
  const storedFlicker = read(flickerKey);
  let reduceFlicker = storedFlicker === null ? Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) : storedFlicker === "1";
  let soundVolumes = (() => { try { return Soundscape.setVolumes(JSON.parse(read(volumeKey))); } catch { return Soundscape.setVolumes({}); } })();
  const skipKey = "clonez-tutorial-skip-time";
  const guideHints = [
    "Pick up the wooden bat nearby.",
    "Open Inventory and equip the bat.",
    "Search a nearby house. Listen at the door before entering.",
    "Check house cupboards and drawers for a bandage.",
    "If you get a cut or scratch, use a bandage from Inventory or Health. Otherwise, head home at dusk.",
    "Return to the shelter for the night. Close the door and sleep when it’s safe."
  ];
  let navigation = read(navigationKey) === "discover" ? "discover" : "locations";
  const mapAction = /^(mark-|station-|pindestination-|pinedit-|pinremove-|pinhere$|pincancel$)/;
  const introKey = "clonez-introduction-complete";
  let lesson = null, afterlife = null;
  let dialogView = null, lastTap = null, deathShown = false, savedText = read(storageKey);
  let bagFilter = "", bagTab = "all", bagPane = "nearby", bagSource = "", storeSource = "";
  let expandedView = false, changingView = false, pinDraft = null, craftIngredient = null;
  let customRules = null, customBase = "survival", ruleBase = "survival";
  let validatedSave = null, touchRun = false;
  let crossing = null, deathOfferUntil = null;
  const afterlifeOfferMs = 12000;
  let audio, muted = read(soundKey) === "1";
  state.mode = "menu";
  View.prepare(state.world);

  const esc = value => String(value).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
  const icon = name => '<svg class="icon"><use href="#' + name + '"/></svg>';
  const button = (label, action, disabled = false, extra = "") => navigation === "discover" && mapAction.test(action) ? "" : '<button type="button" class="small-button ' + extra + '" data-action="' + action + '"' + (disabled ? " disabled" : "") + ">" + label + "</button>";
  const time = minutes => {
    const n = Math.floor(minutes % 1440);
    return String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
  };
  const day = () => Math.floor(state.minutes / 1440) + 1;
  const itemCount = id => Sim.quantity(state.player.bag, id);
  const objectIndex = object => state.world.objects.indexOf(object);
  const formatWeight = n => n.toFixed(1);
  const active = () => state.mode === "play";

  function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  }

  function backUp(previous) {
    try {
      if (previous !== validatedSave) Sim.restore(JSON.parse(previous));
      write(backupKey, previous);
    } catch {
      // Keep the last usable copy when the previous primary save is damaged.
    }
  }

  function save(showNotice = false) {
    if (state.mode === "menu" || lesson) return false;
    try {
      const text = JSON.stringify(Sim.snapshot(state));
      const previous = read(storageKey);
      if (!write(storageKey, text)) throw new Error("Local storage unavailable");
      if (previous && previous !== text) backUp(previous);
      savedText = text;
      validatedSave = text;
      $("save-status").textContent = "SAVED · " + time(state.minutes);
      if (showNotice) Sim.notify(state, "Game saved in this browser.");
      nextSave = state.elapsed + 12;
      return true;
    } catch {
      $("save-status").textContent = "EXPORT SAVE";
      if (showNotice) Sim.notify(state, "Local save failed. Export your game from the journal.", true);
      nextSave = state.elapsed + 60;
      return false;
    }
  }

  function clearStick() {
    const held = stick.pointer;
    stick.pointer = null; stick.x = 0; stick.y = 0;
    $("stick-knob").style.transform = "translate(0px,0px)";
    if (held !== null && stickElement.hasPointerCapture?.(held)) stickElement.releasePointerCapture(held);
  }

  function resetInput() {
    keys.clear();
    for (const [id, {element}] of presses) {
      if (element.hasPointerCapture?.(id)) element.releasePointerCapture(id);
    }
    presses.clear();
    lastTap = null;
    touchRun = false;
    clearStick();
  }

  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  function updateDisplayMode() {
    const native = Boolean(fullscreenElement()), enabled = native || expandedView;
    $("game-app").classList.toggle("fullscreen-layout", enabled);
    $("game-app").classList.toggle("expanded-layout", expandedView);
    const control = $("fullscreen-btn");
    const label = expandedView ? "Exit expanded view" : native ? "Exit full screen" : "Full screen";
    control.setAttribute("aria-pressed", String(enabled));
    control.setAttribute("aria-label", label);
    control.title = label + " · Shift+Enter";
    $("fullscreen-icon").setAttribute("href", enabled ? "#collapse" : "#expand");
  }

  async function toggleFullscreen() {
    if (changingView) return;
    changingView = true;
    const root = document.documentElement;
    try {
      if (fullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) await exit.call(document);
      } else if (expandedView) expandedView = false;
      else {
        const request = document.fullscreenEnabled !== false && root?.requestFullscreen || root?.webkitRequestFullscreen;
        if (request) {
          try { await request.call(root); }
          catch { expandedView = true; }
        } else expandedView = true;
      }
    } catch {
      // The browser can exit before the page's exit request is handled.
    } finally {
      changingView = false;
      resetInput();
      updateDisplayMode();
    }
  }

  function activate(s) {
    resetInput();
    state = s;
    pinDraft = null;
    craftIngredient = null;
    state.mode = state.player.hp > 0 ? "play" : "dead";
    if (state.mode === "play") Sim.resumeEncounterWarning(state);
    View.prepare(state.world);
    if (dialog.open) dialog.close();
    $("close-dialog").hidden = false;
    dialogView = null;
    deathShown = false;
    deathOfferUntil = null;
    $("hero").hidden = true;
    canvas.setAttribute("aria-label", "Isometric view of " + Regions.definitions[state.world.region].name);
    $("start-btn").blur();
    nextHud = nextMap = 0;
    nextSave = state.elapsed + 10;
    updateHud();
  }

  function setNavigation(value) {
    navigation = value === "discover" ? "discover" : "locations";
    $("navigation-mode").value = navigation;
    write(navigationKey,navigation);
    updateHud();
  }

  function opening() {
    show("A perfectly normal clone job",
      "<p>Pip and Vic tried to clone a zombie game over a weekend. Pip lent their AI, Patchwork, a map of Cold Vale so it could copy the streets. Vic promised to keep the test offline.</p>" +
      "<p>After the test stalled, Vic put it back online just long enough to finish. Patchwork created a real virus. When the dead started getting up, Pip asked for an undo. Patchwork marked them both as playtesters.</p>" +
      "<p>‘You wanted Survival Mode,’ it said. ‘Try surviving.’</p>" +
      "<p><strong>Can you survive longer and find all the Easter eggs?</strong></p>" +
      '<div class="opening-navigation"><div>' +
      button("Discover without a map","opening-discover",false,"primary") +
      "<p>Read signs and follow clues on foot.</p></div><div>" +
      button("Play with marked locations","opening-locations") +
      "<p>Use the map, landmarks, and destination markers.</p></div></div>",
      "opening");
  }

  function startLesson() {
    const previous = state;
    const setup = ["difficulty","role","start-point","survivor-name","appearance","world-seed",
      ...Object.keys(Data.survivorStyle).map(key => "setup-" + key)].map(id => [id,$(id).value]);
    activate(Sim.createControl("training","carer","shelter"));
    const {x,y} = state.player;
    const crate = state.world.objects.find(o => o.storage && o.building === state.world.base.id);
    crate.loot.push({id:"bandage",qty:1,condition:100});
    lesson = {previous,setup,origin:{x,y}, stage:0, crate, bandages:Sim.quantity(state.player.bag,"bandage")};
    wakeSound();
    updateHud();
  }

  function endLesson() {
    if (!lesson) return;
    if (lesson.stage < 6 && $("playtest-enabled").checked) write(skipKey, String(state.elapsed));
    write(introKey,"1");
    const {previous,setup} = lesson;
    state = previous;
    lesson = null;
    titleScreen();
    for (const [id,value] of setup) $(id).value = value;
    updateSurvivorPreview("setup");
    showStartDetail();
    View.prepare(state.world);
  }

  function updateLesson() {
    if (!lesson) return;
    const p = state.player;
    if (lesson.stage === 0 && Sim.distance(p,lesson.origin) >= .8) {
      lesson.stage = 1;
      Sim.markDestination(state,"base");
    }
    if (lesson.stage >= 1 && lesson.stage <= 2 && Sim.quantity(p.bag,"bandage") > lesson.bandages) lesson.stage = 3;
    if (lesson.stage === 4 && !dialog.open) {
      const door = state.world.base.door;
      const offset = [[0,2],[-1,2],[1,2]].find(([dx,dy]) => World.clear(state.world,door.x+dx,door.y+dy));
      if (offset) {
        const [dx,dy] = offset;
        const dummy = World.infected(state.world,"lesson-walker",door.x+dx,door.y+dy,"walkers",Level.seeded(7));
        dummy.hp = 1;
        dummy.cooldown = 120;
        state.world.enemies.push(dummy);
      }
      lesson.stage = 5;
      Sim.markDestination(state,"base");
    }
    if (lesson.stage === 5 && state.kills) lesson.stage = 6;
  }

  function startAfterlife() {
    if (!state.afterlifePending || state.mode !== "dead") return;
    state.afterlifePending = false;
    save();
    close(false);
    deathOfferUntil = null;
    afterlife = Afterlife.start(state);
    updateHud();
  }

  function deathSummary() {
    deathOfferUntil = null;
    show("Your story ends here", "<p>" + esc(state.player.name) + " survived until day " + day() + " at " + time(state.minutes) +
      " and killed " + state.kills + " infected.</p>" +
      "<p>Cause of death: " + esc(state.deathCause || "unknown causes") + ".</p>" +
      (assistsOn() ? "<p>Assists on</p>" : "") +
      '<div class="item-actions death-actions">' + button("Back to main menu", "new", false, "primary") +
      button("Playtest report", "playtest") + button("Export save", "export") + "</div>", "dead");
    body.querySelector('[data-action="new"]').focus();
  }

  function skipAfterlife() {
    state.afterlifePending = false;
    save();
    deathSummary();
  }

  function endAfterlife() {
    afterlife = null;
    resetInput();
    updateHud();
    deathSummary();
  }

  function afterlifeAction(kind) {
    if (afterlife) Afterlife.action(afterlife,kind);
  }

  function confirmNewRun() {
    return $("continue-btn").hidden ||
      window.confirm("Start a new run and replace the current save? Export it first if you want to keep it.");
  }

  function start(longHaul = false) {
    if (!traitsReady()) return;
    const preset = longHaul ? "longhaul" : $("difficulty").value;
    const role = $("role").value, startPoint = longHaul ? "shelter" : $("start-point").value;
    const profile = survivorProfile("setup");
    const seedInput = $("world-seed"), enteredSeed = seedInput.value.trim();
    if (enteredSeed && !/^\d{1,9}$/.test(enteredSeed)) { seedInput.reportValidity(); return; }
    if (!confirmNewRun()) return;
    wakeSound();
    if (longHaul) {
      $("difficulty").value = preset;
      $("start-point").value = startPoint;
      $("guide-enabled").checked = true;
      write(guideKey, "1");
      setNavigation("locations");
    }
    const seed = enteredSeed ? Number(enteredSeed) : Math.floor(Math.random()*1000000000);
    const run = Sim.createControl(preset, role, startPoint, preset === "custom" ? customRules : undefined, {...profile,seed});
    run.difficultyOptions = Sim.difficultyOptions(run, savedAssists());
    run.pinStory = preset !== "longhaul";
    run.waypoint = "";
    activate(run);
    rememberSetup();
    write(startChoiceKey, "advanced");
    save();
    cue(170, 86, .3, .07);
  }

  // Every start path refuses an unpaid or contradictory trait selection instead of silently dropping it.
  function traitsReady() {
    if (!$("start-btn").disabled) return true;
    $("advanced-start").open = true;
    $("setup-survivor").open = true;
    for (const group of $("setup-survivor").querySelectorAll("details.survivor-customization")) group.open = true;
    $("trait-points").scrollIntoView?.({block:"center"});
    return false;
  }

  // Main menu primary action: the story campaign with the recommended setup (shelter start, marked map, beginner hints).
  function startStory() {
    if (!traitsReady()) return;
    $("difficulty").value = "campaign";
    $("start-point").value = "shelter";
    showStartDetail();
    start();
    if (active()) { write(startChoiceKey, "story"); $("advanced-start").open = false; } // next visit: options stay folded
  }

  function startRecommended() {
    if (!traitsReady() || !confirmNewRun()) return;
    const skip = read(skipKey);
    wakeSound();
    setNavigation("locations");
    const run = Sim.createRecommended(Math.floor(Math.random() * 1000000000), $("playtest-enabled").checked,
      skip ? Number(skip) : null, savedAssists());
    Object.assign(run.player,survivorProfile("setup"));
    run.traitEffects = Data.traitLoadout(run.player.traits).effects;
    activate(run);
    write(skipKey, "");
    write(startChoiceKey, "recommended");
    $("advanced-start").open = false;
    save();
    cue(170, 86, .3, .07);
  }

  function showStartDetail() {
    $("start-detail").textContent = Data.control.starts[$("start-point").value]?.detail || "";
    const role = Data.roles[$("role").value];
    $("background-detail").textContent = role?.desc || "";
    $("background-kit").textContent = [
      ...Object.entries(role?.levels ?? {}).map(([id,n]) => Data.skills[id].name + " Lv. " + n),
      ...Object.entries(role?.kit ?? {}).map(([id,n]) => Data.items[id].name + " ×" + n)
    ].join(" · ");
    const preset = $("difficulty").value;
    const rules = Data.worldRules(preset, preset === "custom" ? customRules : null);
    const pip = n => Math.max(1, Math.min(5, Math.round(n)));
    const combat = pip(rules.count * rules.damage / 2100);
    const scarcity = pip((180 - rules.loot) / 27);
    const needs = pip(rules.needs / 33 + (rules.weather === "rain" ? .6 : 0) + (rules.powerDays === 0 ? .4 : 0));
    $("preset-summary").textContent = (Data.modes[preset]?.desc ?? "Your saved world rules.") + " " +
      (Data.modeAdvice[preset] ?? "") + " Combat " + combat + "/5 · Scarcity " + scarcity + "/5 · Needs " + needs + "/5.";
  }

  function savedAssists() {
    try {
      const value = JSON.parse(read(assistsKey));
      return value && typeof value === "object" ? value : {};
    } catch { return {}; }
  }

  function assistsOn() {
    const options = state.difficultyOptions;
    return Boolean(options && (options.aim !== "off" || Object.values(options.assists).some(Boolean)));
  }

  function difficultyPanel(inRun = false) {
    const chosen = inRun ? state : {difficulty:$("difficulty").value};
    const options = inRun ? state.difficultyOptions ?? Sim.difficultyOptions(state,{director:false}) :
      Sim.difficultyOptions(chosen,savedAssists());
    const checks = Object.entries(Data.assistFields).map(([id,label]) =>
      '<label class="onboarding-option"><input type="checkbox" name="' + id + '"' +
      (options.assists[id] ? " checked" : "") + '> ' + label + '</label>').join("");
    const select = (name, label, values, selected) => '<label>' + label + '<select name="' + name + '">' +
      Object.entries(values).map(([id,text]) => '<option value="' + id + '"' +
      (selected === id ? " selected" : "") + '>' + text + '</option>').join("") + '</select></label>';
    show(inRun ? "Difficulty and assists" : "New run assists",
      "<p>Assists work with any preset and leave story progress available.</p>" +
      '<form id="difficulty-form" data-run="' + inRun + '">' + checks + '<div class="rules-grid">' +
      select("aim","Touch aim assist",{off:"Off",light:"Light",strong:"Strong"},options.aim) +
      select("director","Adaptive hordes",inRun ? {on:"On",off:"Off"} : {default:"Preset default",on:"On",off:"Off"},
        !inRun && typeof savedAssists().director !== "boolean" ? "default" : options.director ? "on" : "off") +
      (inRun ? select("pressure","Damage, needs and horde pressure",{low:"Lower",standard:"Standard",high:"Higher"},options.pressure) : "") +
      '</div><div class="item-actions"><button type="submit" class="small-button primary">Apply</button></div></form>',
      "difficulty-options");
  }

  function applyDifficulty(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const settings = Object.fromEntries(Object.keys(Data.assistFields).map(id => [id, form.has(id)]));
    settings.aim = form.get("aim");
    if (form.get("director") !== "default") settings.director = form.get("director") === "on";
    if (event.target.dataset.run === "true") {
      settings.pressure = form.get("pressure");
      if (!Sim.setDifficulty(state, settings)) {
        if (!window.confirm("Increase damage, needs drain, and horde pressure for this run?")) return;
        if (!Sim.setDifficulty(state, settings, true)) return;
      }
      close();
      updateHud();
    } else {
      write(assistsKey, JSON.stringify(settings));
      close(false);
      $("setup-assists").focus();
    }
  }

  function rememberSetup() {
    const profile = survivorProfile("setup");
    write(setupKey, JSON.stringify({preset:$("difficulty").value, role:$("role").value, start:$("start-point").value,
      seed:$("world-seed").value, profile, customBase, customRules}));
  }

  function worldRulesEditor(reset = false) {
    const current = $("difficulty").value;
    ruleBase = current === "custom" ? customBase : current;
    const rules = Data.worldRules(ruleBase, !reset && current === "custom" ? customRules : null);
    const inputs = Object.entries(Data.ruleFields).map(([id, field]) => {
      const inputId = "rule-" + id;
      const input = field.choices ? '<select id="' + inputId + '">' + Object.entries(field.choices).sort(([a], [b]) => field.numeric ? a - b : 0).map(([value, label]) =>
        '<option value="' + value + '"' + (String(rules[id]) === value ? " selected" : "") + ">" + label + "</option>").join("") + "</select>" :
        '<input type="number" id="' + inputId + '" min="' + field.min + '" max="' + field.max + '" value="' + rules[id] + '" required inputmode="numeric">';
      return '<label for="' + inputId + '">' + field.label + input + "</label>";
    }).join("");
    show("World rules", "<p>Based on " + Data.modes[ruleBase].name + ". The next new run will use your saved settings.</p>" +
      '<form id="rules-form"><div class="rules-grid">' + inputs + '</div>' +
      '<p class="rules-note">Utility cuts · 0 starts without service. −1 keeps it on.</p><div class="item-actions">' +
      '<button class="small-button primary" type="submit">Apply custom rules</button>' + button("Reset to " + Data.modes[ruleBase].name, "reset-rules") +
      "</div></form>", "rules");
  }

  function applyWorldRules(event) {
    if (event.target.id !== "rules-form") return;
    event.preventDefault();
    const values = Object.fromEntries(Object.entries(Data.ruleFields).map(([id, field]) => {
      const value = $("rule-" + id).value;
      return [id, !field.choices || field.numeric ? Number(value) : value];
    }));
    customBase = ruleBase;
    customRules = Data.worldRules(ruleBase, values);
    $("difficulty").value = "custom";
    rememberSetup();
    showStartDetail();
    close(false);
    $("rules-btn").focus();
  }

  // An imported save opens paused (the dialog stops the simulation) with where, when and how the survivor is.
  function importSummary() {
    const p = state.player, region = Regions.definitions[state.world.region].name, wounds = p.wounds.filter(w => !w.bandaged).length;
    const near = Sim.threats(state).length, goal = Sim.pinnedGoal(state);
    show("Save imported", "<p>" + esc(region) + " · Day " + day() + " · " + String(Math.floor(state.minutes % 1440 / 60)).padStart(2, "0") + ":" + String(Math.floor(state.minutes % 60)).padStart(2, "0") + "</p>" +
      "<p>Health " + Math.ceil(p.hp) + " · " + (wounds ? wounds + (wounds === 1 ? " open wound" : " open wounds") : "no open wounds") +
      (p.fracture > 0 ? " · broken leg" : "") + (near ? " · " + near + (near === 1 ? " infected" : " infected") + " close by" : "") + "</p>" +
      (typeof goal === "string" ? "<p>" + esc(goal) + "</p>" : "") +
      "<p>The game is paused. Nothing moves until you resume.</p>" + button("Resume", "resume", false, "primary"), "import-summary");
  }

  // Continue says what it will do: a survivor who died shows the summary, a living one resumes.
  function continueLabel() {
    let dead = false;
    try { dead = JSON.parse(read(storageKey) || savedText || "null")?.mode === "dead"; } catch {}
    const btn = $("continue-btn");
    btn.innerHTML = '<svg class="icon"><use href="#play"/></svg> ' + (dead ? "View summary" : "Continue") + ' <svg class="icon end-icon"><use href="#arrow"/></svg>';
    btn.title = dead ? "Your last survivor died. See the summary, or start a new game below." : "Resume your saved game.";
  }

  function resumeSaved() {
    try {
      const primary = read(storageKey) || savedText;
      const s = Sim.restore(JSON.parse(primary));
      validatedSave = primary;
      activate(s);
      const destination = Sim.destination(state);
      Sim.notify(state, state.world.generator === 1 ? "Recovered an early save." :
        "Day " + day() + " · Health " + Math.ceil(state.player.hp) + (destination ? " · Destination " + destination.name : ""));
      wakeSound();
    } catch {
      try {
        activate(Sim.restore(JSON.parse(read(backupKey))));
        Sim.notify(state, "Recovered the previous save.");
      } catch { show("Save unavailable", "<p>This save is incompatible or damaged. Import an earlier save or start a new game.</p>" + button("Import", "import"), "save"); }
    }
  }

  // The assistant terminal (amigo1.lockdown-chat): a short chat with five prompts; the sim keeps the log and the pause.
  function aiChat() {
    const chat = state.campaign.chat, A = Data.aiChat, waiting = chat.until > Date.now();
    const lines = chat.log.map(l => '<p class="item-meta"><strong>' + (l.who === "you" ? "You" : "Patchwork") + ':</strong> ' + esc(l.text) + '</p>').join("");
    const left = Math.max(0, A.prompts - chat.used);
    show("Assistant terminal", lines + (chat.done ? '<p>The terminal is quiet.</p>' + button("Back", "resume") :
      '<p>' + (waiting ? "Out of tokens. Try again in " + Math.ceil((chat.until - Date.now()) / 60000) + " min." : "Prompts left: " + left) + '</p>' +
      '<form id="ai-form" class="ai-form"><input id="ai-input" maxlength="200" autocomplete="off" aria-label="Prompt" placeholder="Type a prompt"><button class="small-button primary" type="submit"' + (waiting ? " disabled" : "") + '>Send</button></form>' + button("Back away", "resume")), "ai-chat");
    $("ai-input")?.focus();
  }

  function show(title, html, view) {
    resetInput();
    state.target = null; state.interaction = null; state.player.path = [];
    state.dash = false;
    if (state.player.vehicle) Sim.brake(state);
    $("dialog-title").textContent = title;
    body.innerHTML = html;
    if (dialogView !== view) dialog.scrollTop = 0;
    dialogView = view;
    $("close-dialog").hidden = view === "crossing";
    dialog.classList.toggle("wide", ["bag", "gear", "craft", "research", "rules", "map"].includes(view));
    if (!dialog.open) dialog.showModal();
  }

  function close(checkpoint = true) {
    if (crossing) return;
    if (checkpoint && state.mode === "dead" && !afterlife) {
      if (dialogView === "afterlife-offer") return skipAfterlife();
      if (dialogView === "dead") return titleScreen();
      if (dialogView === "playtest") return deathSummary();
    }
    dialog.close();
    dialogView = null;
    resetInput();
    if (checkpoint && active()) save();
  }

  function menu() {
    if (lesson) return endLesson();
    if (!save()) {
      show("Keep a copy of your game", "<p>The browser rejected the local save. Export your game to keep this session.</p>" +
        button("Export save", "export", false, "primary") + " " + button("Resume", "resume"), "save");
      return;
    }
    titleScreen();
  }

  function titleScreen() {
    if (lesson) return endLesson();
    close(false);
    state.mode = "menu";
    $("hero").hidden = false;
    $("advanced-start").open = read(startChoiceKey) === "advanced";
    requestAnimationFrame(() => { if (!$("hero").hidden && !dialog.open) ($("continue-btn").hidden ? $("story-btn") : $("continue-btn")).focus({preventScroll:true}); }); // game-ui-ux: focus the primary action
    $("intro-btn").textContent = read(introKey) ? "Replay introduction" : "Beginner introduction";
    $("continue-btn").hidden = !savedText && !read(backupKey);
    continueLabel();
    if (state.controlStart) $("start-point").value = state.controlStart;
    $("difficulty").value = state.difficulty;
    if (state.difficulty === "custom") customRules = state.rules;
    $("role").value = state.role;
    setSetupSurvivor(state.player);
    showStartDetail();
    updateHud();
  }

  function wakeSound() {
    if (muted) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      if (!audio) {
        audio = new Context();
        Soundscape.preload(audio);
      }
      if (audio.state === "suspended") audio.resume().catch(() => {});
    } catch { /* Audio is optional. */ }
  }

  function cue(from, to, duration, gain) {
    if (muted || !audio || audio.state !== "running") return;
    const osc = audio.createOscillator(), volume = audio.createGain(), t = audio.currentTime;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    volume.gain.setValueAtTime(gain, t);
    volume.gain.exponentialRampToValueAtTime(.0001, t + duration);
    osc.connect(volume).connect(audio.destination);
    osc.start(t); osc.stop(t + duration);
  }

  function syncSound() {
    if (muted && audio) Soundscape.stop(audio);
    $("sound-icon").setAttribute("href", muted ? "#mute" : "#volume");
    const control = $("sound-btn");
    control.setAttribute("aria-label", "Sound effects");
    control.setAttribute("aria-pressed",String(!muted));
    control.title = muted ? "Enable sound effects" : "Mute sound effects";
  }

  function objectives() {
    if (state.longHaul) return Sim.longHaulGoals(state);
    if (Sim.isCampaign(state)) { // the next four campaign goals, starting with the first one not done
      const goals = Sim.campaignGoals(state), first = Math.max(0, Math.min(goals.findIndex(g => !g.done), goals.length - 4));
      return goals.slice(first < 0 ? goals.length - 4 : first, (first < 0 ? goals.length - 4 : first) + 4);
    }
    const reserves = state.flags.supplies;
    return [
      {done: state.flags.barricade, text: "Protect the shelter", detail: "Barricade a door or window."},
      {done: reserves, text: "Stockpile supplies", detail: "Gather 4 food items and 3 bottles of water."},
      {done: state.flags.rescued, text: "Find another survivor", detail: "Help Eva at the clinic to the north."},
      {done: state.flags.radio, text: "Make contact", detail: "Repair the shelter radio."}
    ];
  }

  function objectiveHtml() {
    return objectives().map(o => '<div class="objective ' + (o.done ? "done" : "") + '"><i></i><div>' + o.text + "<small>" + o.detail + "</small></div></div>").join("");
  }

  function skillsHtml() {
    const rows = Object.fromEntries(Object.entries(Data.skills).map(([id, skill]) => {
      const xp = state.player.skills[id] ?? 0, lv = Sim.level(state, id), max = Data.skillMax;
      const floor = Data.skillXp(lv), next = Data.skillXp(lv + 1);
      const detail = lv >= max ? " Maxed." : " " + Math.round((xp - floor) / (next - floor) * 100) + "% to level " + (lv + 1) + ".";
      return [id, '<div class="effect-row"><b>' + esc(skill.name) + " · LV " + lv + "</b><p>" + esc(skill.desc) + detail + "</p></div>"];
    }));
    return '<div style="margin-top:14px"><div class="section-label">SKILLS</div>' +
      Object.entries(Data.skillGroups).map(([group,ids]) =>
        '<details><summary>' + esc(group) + '</summary>' + ids.map(id => rows[id]).join("") + '</details>').join("") + "</div>";
  }

  function conditions() {
    const p = state.player, list = Sim.moodles(state);
    if (p.exposure) list.unshift({label:"Viral infection",level:4});
    if (p.resting) list.push({label:"Resting",level:1});
    if (Sim.cinemaBuff(state)) list.push({label:"Idol's luck",level:1});
    if (state.blueprint) list.push({label:"Build mode",level:1});
    const {pending,time} = state.atmosphere;
    if (pending) list.unshift({label:"Horde · " + Math.max(1,Math.ceil(pending.due-time)) + "s",level:4});
    return list;
  }

  // Campaign story objects come first under Use, ahead of world notes and loot, until they are done.
  const storyActions = new Set(["campaign-page", "eva-diary", "cinema-statue", "cinema-note", "grotto-plate", "westfields-ledger", "vic-diary", "ai-terminal"]);
  const storyTarget = o => Boolean(o && storyActions.has(o.action) && o.active !== false &&
    (o.action === "ai-terminal" ? !state.campaign?.chat.done : o.action === "cinema-statue" ? o.active : !o.read));
  const taskTarget = o => o && (storyTarget(o) || o.action === "travel" || Sim.isSupplyCache(state, o) || Sim.unreadClueAt(state, o) || o.action === "radio" && state.supplyRun === "return" ||
    Chronicle.isUnseen(state.ledger,o) && !Sim.sceneProblem(state,o) || Sim.unreadNote(o) ||
    o.action === "garden" || o.action === "campfire" && Sim.fireBatch(state, o));
  const nearbyExit = () => Sim.nearby(state).find(o => o.action === "travel");

  function nearbyObjects(includeDecor = false) {
    const rank = o => {
      if (o.action === "travel") return -2;
      if ((o.action === "campfire" && Sim.fireBatch(state, o)?.remaining === 0) || Sim.gardenYield(state, o)) return -1;
      if (storyTarget(o)) return -.8;
      if (taskTarget(o)) return -.5;
      return o.action === "loot" && (o.loot.length || Sim.unreadClueAt(state, o)) ? 0 :
        o.action === "door" ? .2 : o.action === "harvest" ? 2 : .5;
    };
    const choices = Sim.nearby(state).filter(o => (o.action || Sim.isFurniture(o)) && (o.action !== "loot" || !o.searched || o.loot.length ||
      Sim.canStore(o) || Sim.unreadClueAt(state, o) || Sim.isSupplyCache(state, o)))
      .sort((a, b) => rank(a) - rank(b) || Sim.distance(state.player, a) - Sim.distance(state.player, b));
    return includeDecor || !choices.some(o => !o.decor) ? choices : choices.filter(o => !o.decor);
  }

  function guidedBat(choices) {
    if (state.guideStep !== 0 || !$("guide-enabled").checked) return null;
    return choices.find(o => o.kind === "drop" && !o.corpse &&
      o.loot.length === 1 && o.loot[0].id === "bat");
  }

  function interactionLabel(o) {
    if (Sim.isFurniture(o)) return "Furniture";
    if (o.kind === "car") return "Vehicle";
    if (o.action === "loot") return "Loot";
    if (o.action === "door") return o.kind === "fence" ? "Fence" : o.boards ? "Barricade" :
      o.broken ? "Manage" : o.locked ? "Locked" : o.latched ? "Window" : o.open ? "Close" : "Open";
    if (o.action === "bed") return state.player.fatigue >= 35 ? "Sleep" : "Rest";
    return ({bed:"Rest", barrel:"Collector", campfire:"Campfire", radio:"Radio", garden:"Garden", tap:"Tap", generator:"Generator",
      harvest:"Chop", dismantle:"Salvage", workbench:"Build", travel:"Cross", spring:"Fill", forage:"Forage", fish:"Fish",
      "ledger-record":"Read", "ledger-event":"Investigate", "ledger-desk":"Dispatch",fungus:"Inspect",mushroom:"Inspect","field-note":"Read","campaign-page":"Read","grotto-plate":"Read","westfields-ledger":"Read","ai-terminal":"Talk","vic-diary":"Read","cinema-statue":"Take","eva-diary":"Read","cinema-note":"Read","ironworks-terminal":"Read","ironworks-cage":"Dismantle",crib:"Look"}[o.action] || "Use");
  }

  function canTalk() {
    const n = state.world.npc;
    return n.hp > 0 && Sim.distance(state.player, n) <= 1.85 && Sim.lineOfSight(state, state.player, n);
  }

  const htmlCache = new Map();
  function setHtml(id, html) {
    if (htmlCache.get(id) === html) return;
    htmlCache.set(id, html);
    $(id).innerHTML = html;
  }

  function updateHud() {
    const mapName = $("map-card-name"), regionName = Regions.definitions[state.world.region].name.toUpperCase();
    if (mapName && mapName.textContent !== regionName) mapName.textContent = regionName;
    state.hideNavigation = navigation === "discover";
    $("map-btn").hidden = state.hideNavigation;
    $("map-card").hidden = state.hideNavigation;
    document.body.classList.toggle("in-afterlife",Boolean(afterlife));
    $("afterlife-tools").hidden = !afterlife;
    $("lesson").hidden = !lesson;
    const inRun = active() && !lesson;
    const goal = inRun ? state.longHaul ? state.longHaul.days + "/30 days" + (state.longHaul.complete ? " · complete" : "") : Sim.pinnedGoal(state) ?? "" : "";
    const tip = inRun && !state.longHaul ? Sim.campaignTip(state) : "";   // campaign: always a next step, whatever the guide toggle says
    const radio = inRun ? Sim.radioChecklist(state) : "";
    const hint = [tip || (inRun && $("guide-enabled").checked ? state.longHaul ? Sim.longHaulHint(state) : guideHints[state.guideStep] ?? "" : ""), radio].filter(Boolean).join(" · ");
    $("onboarding").hidden = !goal && !hint;
    if ($("pinned-goal").textContent !== goal) $("pinned-goal").textContent = goal;
    if ($("guide-hint").textContent !== hint) $("guide-hint").textContent = hint;
    if (afterlife) {
      $("move-stick").hidden = false;
      $("touch-controls").hidden = false;
      $("touch-attack").hidden = false;
      $("touch-run").hidden = true;
      $("touch-attack-label").textContent = "Bite";
      $("touch-use-label").textContent = "Grab";
      $("touch-shove-label").textContent = "Groan";
      const objective = afterlife.result ? "" : Afterlife.objective(afterlife);
      const sound = afterlife.result ? "" : afterlife.soundLabel ?? "";
      const ready = Afterlife.ready(afterlife);
      $("touch-attack").classList.toggle("ready",ready === "bite");
      $("touch-use").classList.toggle("ready",ready === "grab");
      if ($("afterlife-objective").textContent !== objective) $("afterlife-objective").textContent = objective;
      if ($("afterlife-sound").textContent !== sound) $("afterlife-sound").textContent = sound;
      const hint = afterlife.clock <= afterlife.messageUntil ? afterlife.message : "";
      if ($("afterlife-text").textContent !== hint) $("afterlife-text").textContent = hint;
      return;
    }
    $("touch-attack-label").textContent = "Attack";
    if (lesson) {
      const prompts = [
        "Move with WASD or the arrows, or drag the movement stick.",
        "Open the shelter crate. Tap it, press F nearby, or use the Use button.",
        "Take a bandage from Nearby. Close inventory when you have it.",
        "Open Pack or press I, then select Backpack to see what you carry.",
        "Close inventory. Something is moving outside the shelter.",
        "Use Attack or Space when you’re in reach. You can punch or pick up and equip the nearby bat.",
        "You’re ready. Start your own run from the title screen."
      ];
      if ($("lesson-text").textContent !== prompts[lesson.stage]) $("lesson-text").textContent = prompts[lesson.stage];
      $("lesson-exit").textContent = lesson.stage === 6 ? "Finish introduction" : "Skip introduction";
    }
    const p = state.player, stats = [["hp", p.hp], ["st", p.stamina], ["food", p.hunger], ["water", p.hydration], ["rest", 100 - p.fatigue]];
    for (const [id, value] of stats) {
      $(id + "-num").textContent = Math.ceil(value);
      $(id + "-bar").style.width = Math.max(0, value) + "%";
    }
    $("day").textContent = "DAY " + String(day()).padStart(2, "0") + " · " + Sim.season(state).short;
    $("timer").textContent = time(state.minutes);
    $("weather").textContent = state.weather;
    const area = Regions.definitions[state.world.region], zone = World.zoneAt(state.world, p.x, p.y);
    $("location").textContent = state.mode === "menu" ? "COLD VALE" : state.world.region === Regions.home || zone.short === area.name.toUpperCase() ?
      zone.short : area.name.toUpperCase() + " · " + zone.short;
    const car = Sim.vehicle(state);
    $("noise").textContent = car ? "ENGINE · " + Math.round(car.fuel) + "% FUEL" : state.running ? "RUNNING · LOUD" : state.quiet ? "SNEAKING" : "WALKING";
    $("live-tag").hidden = !active();
    $("live-tag").classList.toggle("loud", Boolean(state.running));
    const statuses = conditions(), worst = statuses[0], bar = $("condition-bar");
    $("hud-strip").hidden = !active();
    bar.dataset.level = worst?.level ?? 0;
    const label = worst?.label ?? "Stable";
    const count = statuses.length > 1 ? "+" + (statuses.length-1) : "";
    if ($("condition-summary").textContent !== label) $("condition-summary").textContent = label;
    if ($("condition-count").textContent !== count) $("condition-count").textContent = count;
    const description = "View conditions and injuries. " + (statuses.map(status => status.label).join(", ") || "Stable");
    if (bar.getAttribute("aria-label") !== description) bar.setAttribute("aria-label",description);
    const item = Sim.weapon(state), w = Data.items[item.id];
    const showEquipment = active() && Boolean(car || w);
    $("weapon").hidden = $("condition").hidden = !showEquipment;
    $("weapon").textContent = car ? "Vehicle" : w?.name ?? "";
    $("condition").textContent = car ? Math.round(car.fuel) + "% fuel · " + Math.round(car.hp/1.4) + "% condition" :
      w ? weaponCondition(item) + (w.firearm ? " · " + itemCount("ammo") + " rounds" : "") : "";
    $("shove-label").textContent = car ? "Brake" : "Shove";
    $("destination-btn").hidden = !active() || state.hideNavigation;
    $("world-tools").hidden = !active();
    $("roof-toggle").setAttribute("aria-pressed", String(state.roofsHidden));
    $("roof-toggle").setAttribute("aria-label", state.roofsHidden ? "Show roofs" : "Hide roofs");
    $("move-stick").hidden = !active();
    $("touch-controls").hidden = !active();
    $("touch-attack").hidden = !active() || Boolean(car);
    $("touch-run").hidden = Boolean(car);
    $("touch-run").setAttribute("aria-pressed", String(touchRun));
    $("touch-shove-label").textContent = car ? "Brake" : "Shove";
    $("touch-shove-icon").setAttribute("href", car ? "#brake" : "#shove");
    const destination = Sim.destination(state);
    $("destination-label").textContent = destination ? destination.name + " · " + Math.round(Sim.distance(state.player,destination)) + " m" : "Choose destination";
    $("zoom-label").textContent = (state.zoom || 1).toFixed(2).replace(/0$/,"") + "×";
    $("carry").textContent = formatWeight(Sim.weight(p.bag)) + " / " + Sim.capacity(state) + " kg";
    $("map-seed").textContent = "SEED " + state.seed;
    $("sneak-btn").setAttribute("aria-pressed", String(state.quiet));
    updateBelt();
    for (const id of ["search", "shove", "pack", "gear", "craft", "pause"]) $(id + "-btn").disabled = !active();
    $("attack-btn").disabled = !active() || Boolean(car);
    const targetInReach = active() && Boolean(Sim.attackTarget(state));
    const attackReady = targetInReach && p.cooldown <= 0 && !Sim.weaponProblem(state);
    $("attack-btn").classList.toggle("ready", attackReady);
    const touchReady = state.difficultyOptions?.aim && state.difficultyOptions.aim !== "off" ?
      active() && p.cooldown <= 0 && Boolean(Sim.touchAttackTarget(state)) && !Sim.weaponProblem(state) : attackReady;
    $("touch-attack").classList.toggle("ready", touchReady);
    $("sneak-btn").disabled = !active() || Boolean(car);
    const choices = active() && !car ? nearbyObjects() : [];
    const o = choices[0], talk = !car && canTalk();
    const bat = guidedBat(choices);
    const track = active() && !o && !talk && Sim.nearbyTrack(state);
    const exit = active() && car && nearbyExit();
    const multiple = choices.length + Number(talk) > 1 && !taskTarget(o);
    const context = car ? (exit ? "Cross" : "Exit") : multiple ? "Nearby" : o ? interactionLabel(o) : talk ? "Talk" : track ? "Tracks" : "Use";
    $("context-label").textContent = bat ? "Take bat" : context;
    $("touch-use-label").textContent = bat ? "Take bat" : car || track ? context : "Use";
    $("touch-use-icon").setAttribute("href", !bat && (exit || o?.action === "travel") ? "#map" : car ? "#exit" : "#search");
    $("touch-use").classList.toggle("ready", Boolean(car || talk || o || track));
    setHtml("objectives", objectiveHtml());
    $("quest-count").textContent = objectives().filter(o => o.done).length + " / 4";
    setHtml("radio-log", state.messages.filter(m => m?.lang === "en" && typeof m.text === "string").slice(-3).reverse().map(m => '<p' + (m.danger ? ' class="danger"' : "") + "><time>" + time(m.time) + "</time><span>" + esc(m.text) + "</span></p>").join(""));
    const notice = state.notice;
    const event = notice && notice.until >= state.elapsed && !(notice.range && targetInReach) ? notice :
      state.messages.findLast(m => m?.lang === "en" && typeof m.text === "string");
    $("event-status").hidden = !active();
    $("event-status").classList.toggle("warn", Boolean(event?.danger));
    const bandageReminder = active() && state.difficultyOptions?.assists.reminder &&
      p.wounds.some(wound => !wound.bandaged) && itemCount("bandage") > 0;
    const eventText = $("event-text"), text = bandageReminder && !(event?.danger && event === notice) ?
      "Apply a bandage in Health or press R." : event?.text ?? "";
    if (eventText.textContent !== text) eventText.textContent = text;
  }

  function help() {
    show("How to play", "<p>Close the door and collect materials from the shelter crate. The clinic is to the north. Look for radio components at a workshop or police station.</p>" +
      '<dl class="help-grid"><dt>Move</dt><dd>Drag the stick / WASD</dd><dt>Run</dt><dd>Tap Run to toggle / Hold Shift</dd><dt>Attack</dt><dd>Attack / Space</dd><dt>Shove</dt><dd>Shove / X or Q</dd><dt>Interact</dt><dd>Tap an object or its label / F</dd><dt>List nearby actions</dt><dd>K</dd><dt>Equipment</dt><dd>Gear / G</dd><dt>Quick belt</dt><dd>Tap a slot / 1–4</dd><dt>Flashlight</dt><dd>L</dd><dt>Inventory</dt><dd>Inventory / I</dd><dt>Build</dt><dd>Build / B</dd><dt>Bandage</dt><dd>Health / R</dd><dt>Full screen</dt><dd>Shift+Enter</dd></dl>' +
      "<p>The ring marks an infected target within reach. Use Attack or tap the target to strike in place. Back away or shove when you see a warning triangle. Mouse clicks on a target can start a pursuit.</p>" +
      "<p>Tap the ground to walk or double-tap to run. In a vehicle, use Brake and Exit. Use +/− to zoom and Roofs or T to hide roofs. Menus pause the game.</p>" +
      "<p>Open Map to mark a crossing. Follow its arrow to the signpost, then tap the sign or press F to cross. The north trail is on foot. Road crossings take vehicles.</p>" +
      "<p>Use the speaker button for sound. Shuffling steps can warn of a horde. Use Listen at doors to check for movement. A closed bedroom can hide an infected. Set a wristwatch down as a timed distraction in Gear.</p>" +
      "<p>In Inventory, use Nearby to choose a source, or Backpack to pin supplies and store matching items. Look for notes while searching buildings. Read them again in the journal’s Outbreak log.</p>" + button("Research and game systems", "research"), "help");
  }

  function landmarks() {
    const knownHomes = state.world.homes?.filter(b => Sim.exploredTile(state,b.door.x,b.door.y)) ?? [];
    const storySites = state.world.objects.filter(o => Chronicle.isScene(o) && !Chronicle.entries[o.record].extra &&
      Sim.exploredTile(state,o.x,o.y)).map(o => [o.id,o.name]);
    if (state.world.region === Regions.home) return [["base","Shelter"],["market","Grocery store"],["clinic","Clinic"],
      ["workshop","Workshop"],["police","Police station"],["fuel","Petrol station"],...knownHomes.map(b=>[b.id,b.name]),...storySites];
    return [...state.world.buildings.filter(b=>!b.compact).map(b => [b.id,b.name]),...knownHomes.map(b=>[b.id,b.name]),
      ...state.world.objects.filter(o => o.action === "spring" || o.action === "fish").map(o => [o.id,o.name]),...storySites];
  }

  function map(pin = null) {
    if (navigation === "discover") return;
    pinDraft = pin && Number.isFinite(pin.x) && Number.isFinite(pin.y) ? pin : null;
    const editable = active();
    const selected = Sim.destination(state);
    const current = state.world.region, area = Regions.definitions[current];
    const routes = state.world.objects.filter(o => o.action === "travel").map(exit => {
      const id = exit.id.slice(5), returning = id === Regions.home, deepBack = Boolean(area.deep) && id === area.host, annex = returning ? area : Regions.definitions[id];
      const descending = id === Regions.cavern, ascending = state.world.underground;
      const direction = id === "cinema" ? "Oxford" : descending ? "Down" : ascending ? "Up" : deepBack ? "Back" :
        returning ? {North:"South",East:"West",South:"North",West:"East"}[annex.direction] : annex.direction;
      const detail = ascending ? "Rope back to the firewatch trail." : deepBack ? "Foot trail back to " + Regions.definitions[id].name + "." : returning ? "Route back to town." : annex.detail;
      const crossingType = descending || ascending ? "Rope descent" : annex.vehicles && !deepBack ? "Road crossing" : "Foot trail";
      const visited = returning || ascending || deepBack || Boolean(state.regionStates[id]);
      return '<article class="region-route"><div><b>' + direction + ' · ' + exit.name + '</b><p>' + detail +
        '</p><div class="item-meta">' + crossingType + " · " + Sim.dangerRating(state,id) + (visited ? " · Visited" : "") + '</div></div>' +
        button(selected?.id === exit.id ? "Marked" : "Mark", "mark-" + exit.id, !editable || selected?.id === exit.id,
          selected?.id === exit.id ? "" : "primary") + '</article>';
    }).join("");
    const list = state.mapPins.map(point => '<div class="map-pin-row"><div><b><i style="--pin-color:' + Data.pinKinds[point.kind].color +
      '"></i>' + esc(point.name) + '</b><div class="item-meta">' + Data.pinKinds[point.kind].name +
      (selected?.id === point.id ? " · Destination" : "") + '</div></div><div class="item-actions">' +
      button("Edit", "pinedit-" + point.id, !editable) + button("Mark", "pindestination-" + point.id, !editable, "primary") + "</div></div>").join("");
    const editor = pinDraft ? '<form id="pin-form" class="pin-form"><label>Pin name<input id="pin-name" maxlength="36" value="' +
      esc(pinDraft.name || "") + '" required></label><label>Type<select id="pin-kind">' + Object.entries(Data.pinKinds).map(([id, data]) =>
      '<option value="' + id + '"' + (id === (pinDraft.kind || "note") ? " selected" : "") + ">" + data.name + "</option>").join("") +
      '</select></label><div class="item-actions"><button type="submit" class="small-button primary">Save pin</button>' +
      button("Cancel", "pincancel") + (pinDraft.id ? button("Remove", "pinremove-" + pinDraft.id, false, "danger") : "") + "</div></form>" : "";
    show(area.name + " · Map", '<div class="map-layout"><div><canvas class="dialog-map" id="dialog-map" width="560" height="520" aria-label="Explored map of ' + area.name + '"></canvas>' +
      '<div class="region-routes" aria-label="Regional crossings">' + routes + '</div></div>' +
      '<div class="map-notes"><p>' + (editable ? "Tap explored ground to add a pin. Pale dots mark unread story sites and amber dots mark challenges." : "Start or continue a run to add pins.") +
      '</p><div class="item-actions">' + button("Pin my position", "pinhere", !editable) + '</div><p id="pin-status" role="status"></p>' +
      '<details class="map-landmarks"><summary>Landmarks</summary><div class="item-actions">' + landmarks().map(([id,label]) =>
        button(esc(label), "mark-" + id, !editable)).join("") + '</div></details>' +
      editor + '<div class="map-pins">' + (list || '<p class="empty">No pins saved.</p>') + "</div></div></div>", "map");
    const canvas = $("dialog-map");
    View.minimap(canvas, state, pinDraft?.id ? null : pinDraft);
    if (pinDraft) $("pin-name").focus();
    canvas.addEventListener("click", event => {
      if (!active()) return;
      const point = View.mapPoint(canvas, state.world, event.clientX, event.clientY);
      const exit = state.world.objects.find(o => o.action === "travel" && Sim.distance(o, point) < 1.5);
      if (exit && !pinDraft) { Sim.markDestination(state, exit.id); close(); updateHud(); return; }
      const existing = state.mapPins.find(p => Sim.distance(p, point) < 1);
      if (existing) map(existing);
      else if (Sim.exploredTile(state, point.x, point.y)) map(point);
      else $("pin-status").textContent = "Explore that area before placing a pin.";
    });
  }

  function savePinForm() {
    if (!active() || dialogView !== "map" || !pinDraft) return;
    if (!Sim.saveMapPin(state, pinDraft, $("pin-name").value, $("pin-kind").value, pinDraft.id)) {
      $("pin-status").textContent = state.mapPins.length >= Data.maxMapPins && !pinDraft.id ? "Remove a pin before adding another." : "Enter a name for this pin.";
      return;
    }
    save();
    map();
    $("pin-status").textContent = "Pin saved.";
  }

  function itemIcon(id) {
    const sprite = View.weaponIcon(id);
    return sprite ? '<img class="weapon-item-icon" src="' + sprite + '" alt="">' : icon(Data.items[id].icon);
  }

  function weaponCondition(item) {
    const condition = item.condition ?? 100;
    if (condition <= 0) return "Broken";
    return Math.max(.1, Math.floor(condition * 10) / 10) + "% condition";
  }

  function itemDescription(item) {
    const d = Data.items[item.id], parts = [];
    parts.push(formatWeight(d.weight * item.qty) + " kg");
    if (item.id === "housekey" && item.label) parts.push("Tag: " + item.label);
    if (d.damage) {
      const style = Data.combatStyles[d.combat];
      parts.push(style.name + " · " + d.damage + " base damage · reach " + d.range +
        " · " + d.delay + "s recovery · " + d.effort + " stamina · " + weaponCondition(item));
      parts.push(d.noise >= 10 ? "Very loud" : d.noise >= 4 ? "Loud" : "Quieter");
      parts.push(d.wear >= 1 ? "Wears quickly" : d.wear <= .4 ? "Durable" : "Moderate wear");
      for (const [kind, multiplier] of Object.entries(style.damage)) {
        parts.push((multiplier > 1 ? "Strong vs " : "Weaker vs ") + Data.infected[kind].name.toLowerCase() + "s");
      }
    }
    if (Sim.canMend(item)) parts.push(weaponCondition(item));
    const book = Data.skillBooks[item.id];
    if (book) parts.push((state.player.readBooks?.includes(item.id) ? "Studied" : "+24 XP") + " · " + esc(Data.skills[book.skill].name));
    if (item.id === "flashlight") parts.push(item.charge > 0 ? Math.ceil(item.charge) + " game min of light" : "Empty battery");
    if (Sim.isMushroom(item.id) && !Sim.knownMushrooms(state)) return parts.concat("Study the foraging guide to identify it.").join(" · ");
    if (d.toxic) parts.push("Toxic · Do not eat");
    if (d.nutrition) parts.push("+" + d.nutrition + " food" + (d.hydration ? " · +" + d.hydration + " thirst relief" : ""));
    if (d.perish) {
      const freshness = Sim.freshMinutes(state, item);
      parts.push(Sim.isSpoiled(state, item) ? "Spoiled" : "Fresh for " +
        (freshness >= 60 ? Math.ceil(freshness / 60) + "h" : Math.ceil(freshness) + " min"));
    }
    if (d.detail) parts.push(esc(d.detail));
    return parts.join(" · ");
  }

  function matches(item) {
    const d = Data.items[item.id];
    const category = bagTab === "all" || d.group === bagTab || bagTab === "pinned" && state.player.pinned.includes(item.id);
    return category && Sim.itemName(state,item.id).toLowerCase().includes(bagFilter.trim().toLowerCase());
  }

  const itemInRecipe = (recipe, id) => Object.hasOwn(recipe.inputs, id) || (recipe.out || recipe.product) === id;
  const hasRecipes = id => Data.recipes.some(recipe => itemInRecipe(recipe, id)) ||
    Object.values(Data.fireRecipes).some(recipe => (!recipe.identify || Sim.knownMushrooms(state)) && itemInRecipe(recipe, id));

  function inventoryItems(store) {
    const current = Sim.weapon(state);
    const bag = state.player.bag;
    const ordered = bag.map((item, index) => ({item, index})).filter(({item}) => matches(item)).sort((a, b) =>
      Number(state.player.pinned.includes(b.item.id)) - Number(state.player.pinned.includes(a.item.id)) ||
      Sim.itemName(state,a.item.id).localeCompare(Sim.itemName(state,b.item.id)));
    return ordered.map(({item, index}) => {
      const d = Data.items[item.id], equipped = current === item;
      const worn = d.slot && Sim.wornItem(state,d.slot) === item;
      const pinned = state.player.pinned.includes(item.id);
      const useLabel = item.id === "flashlight" ? item === Sim.activeLight(state) ? "Switch off" : "Switch on" :
        d.damage ? equipped ? "Unequip" : "Equip" : d.slot ? worn ? "Remove" : "Equip" :
        ({book:state.player.readBooks?.includes(item.id) ? "Studied" : "Read", food:"Eat", water:"Drink", bandage:"Bandage", disinfectant:"Disinfect", backpack:"Equip pack", painkiller:"Take", violin:"Play",molotov:"Throw"}[d.use] || "");
      return '<div class="item-row bag-item ' + (equipped || worn ? "equipped-item" : "") + '"><div><div class="item-top">' +
        itemIcon(item.id) + "<b>" + esc(Sim.itemName(state,item.id)) + " ×" + item.qty + '</b></div><div class="item-meta">' + itemDescription(item) + '</div></div><div class="item-actions">' +
        (useLabel ? button(useLabel, (equipped ? "unequip-" : "use-") + index, (d.use === "food" && Sim.isSpoiled(state,item)) || (d.use === "book" && state.player.readBooks?.includes(item.id)), "primary") : "") +
        (store ? button(item.qty > 1 ? "Store stack" : "Store", "store-" + index) : "") + button("Drop", "drop-" + index) +
        (hasRecipes(item.id) ? button("Recipes", "recipes-" + item.id) : "") +
        '<button type="button" class="small-button pin-button" data-action="pin-' + index + '" aria-pressed="' + pinned + '">' +
        (pinned ? "Pinned" : "Pin") + "</button></div></div>";
    }).join("") || '<div class="empty">No items match your search.</div>';
  }

  function nearbyItems(sources) {
    const result = [];
    for (const o of sources) {
      o.loot.forEach((item, index) => {
        if (!matches(item)) return;
        const d = Data.items[item.id], room = Sim.roomFor(state, item.id), ref = objectIndex(o) + "-" + index;
        const equip = d.damage || d.slot && state.player.gear[d.slot] !== item.id || d.use === "backpack" && !state.player.backpack;
        result.push('<div class="item-row bag-item"><div><div class="item-top">' + itemIcon(item.id) + "<b>" + esc(Sim.itemName(state,item.id)) + " ×" + item.qty +
          '</b></div><div class="item-meta">' + esc(o.name) + " · " + itemDescription(item) +
          (room < item.qty ? " · " + (room ? room + " will fit" : "No room") : "") + '</div></div><div class="item-actions">' +
          button("Take", "take-" + ref, !room, "primary") + (item.qty > 1 ? button("Take stack", "all-" + ref, !room) : "") +
          (equip ? button("Take &amp; equip", "takegear-" + ref, !room) : "") +
          (hasRecipes(item.id) ? button("Recipes", "recipes-" + item.id) : "") + "</div></div>");
      });
    }
    return result.join("") || '<div class="empty">' + (sources.length ? "No items match this source and filter." :
      "Nothing within reach. Move closer to a container or tap an object in the world.") + "</div>";
  }

  const storageTarget = () => Sim.containers(state).find(o => o.id === storeSource && Sim.canStore(o));

  function updateInventoryLists() {
    const sources = Sim.containers(state), storage = sources.filter(Sim.canStore);
    if (!sources.some(o => o.id === bagSource)) bagSource = "";
    if (!storage.some(o => o.id === storeSource)) storeSource = (storage.find(o => o.storage) || storage[0])?.id ?? "";
    const selected = bagSource ? sources.filter(o => o.id === bagSource) : sources;
    const store = storage.find(o => o.id === storeSource);
    if (bagPane === "nearby") for (const o of selected) o.searched = true;
    const options = values => values.map(o => '<option value="' + esc(o.id) + '">' + esc(o.name) + " · " +
      formatWeight(Sim.distance(state.player, o)) + " m</option>").join("");
    const setOptions = (id, markup, value) => {
      const select = $(id);
      if (select.innerHTML !== markup) select.innerHTML = markup;
      select.value = value;
    };
    setOptions("loot-source", '<option value="">All sources</option>' + options(sources), bagSource);
    setOptions("store-source", options(storage), storeSource);
    $("storage-options").hidden = !storage.length;
    $("inventory-items").innerHTML = inventoryItems(store);
    $("nearby-items").innerHTML = nearbyItems(selected);
    $("carried-pane").hidden = bagPane !== "carried";
    $("nearby-pane").hidden = bagPane !== "nearby";
    for (const pane of ["nearby", "carried"]) $("bag-" + pane).setAttribute("aria-pressed", String(bagPane === pane));
    const candidates = selected.flatMap(o => o.loot).filter(matches);
    const take = $("take-matching");
    take.textContent = bagFilter.trim() || bagTab !== "all" ? "Take matching" : "Take all";
    take.disabled = !candidates.some(item => Sim.roomFor(state, item.id));
    $("nearby-count").textContent = candidates.reduce((n, item) => n + item.qty, 0) + " items";
    $("bag-weight").textContent = formatWeight(Sim.weight(state.player.bag)) + " / " + Sim.capacity(state) + " kg";
    const source = selected.length === 1 ? selected[0] : null;
    $("source-status").textContent = source?.kind === "fridge" ? Sim.hasPower(state, source) ? "Powered · food stays fresh longer here" : "No power · food spoils at room temperature" : "";
    $("bag-notes").innerHTML = [...new Set(selected.map(o => Sim.unreadClueAt(state, o)).filter(Boolean))].map(id =>
      button("Read " + esc(Data.story[id].title), "clue-" + id)).join("");
    $("bag-notes").hidden = !$("bag-notes").innerHTML;
    const cache = $("bag-cache");
    if (cache) {
      const fits = Sim.canCarryCache(state);
      cache.hidden = !selected.some(o => Sim.isSupplyCache(state, o));
      cache.innerHTML = "<span>MARA’S CACHE · " + itemQuantities(Data.supplyCache) + "</span>" +
        button(fits ? "Collect cache" : "Make room to collect", "collect-cache", !fits, "primary");
    }
  }

  function bag(pane, source = null) {
    if (!active()) return;
    if (state.player.vehicle) Sim.brake(state);
    bagPane = pane === "carried" || pane !== "nearby" && !Sim.containers(state).length ? "carried" : "nearby";
    bagSource = source?.id ?? "";
    if (lesson?.stage === 1 && (source === lesson.crate || !source && Sim.reachableObject(state,lesson.crate))) lesson.stage = 2;
    bagFilter = "";
    bagTab = "all";
    const categories = [["all","All"], ["Food","Food & drink"], ["Medical","Medical"], ["Weapons","Weapons"],
      ["Materials","Materials"], ["Equipment","Gear"], ["Books","Books"], ["pinned","Pinned"]];
    if (source && Sim.canStore(source)) storeSource = source.id;
    show("Inventory", '<div class="bag-controls"><div class="bag-header"><div class="bag-panes" aria-label="Inventory view">' +
      '<button type="button" id="bag-nearby" data-action="bag-nearby">Nearby</button><button type="button" id="bag-carried" data-action="bag-carried">Backpack</button>' +
      '<button type="button" data-action="equipment">Equipment</button>' +
      '</div><b id="bag-weight"></b></div><details class="bag-search-toggle"><summary>Search items</summary><input class="input-search" type="search" id="bag-search" placeholder="Item name" aria-label="Search items"></details>' +
      '<div class="tabs bag-filters" aria-label="Item category">' + categories.map(([id, label]) => '<button type="button" data-filter="' + id +
        '" aria-pressed="' + (id === bagTab) + '">' + label + "</button>").join("") +
      '</div></div><div id="bag-feedback" class="bag-feedback" role="status" hidden></div>' +
      '<section id="nearby-pane" class="inventory-section"><div class="bag-toolbar"><label for="loot-source">Source<select id="loot-source"></select></label>' +
      '<span id="nearby-count"></span><button type="button" id="take-matching" class="small-button primary" data-action="loot-all">Take all</button></div>' +
      '<div id="source-status" class="item-meta source-status"></div><div class="nearby-clues" id="bag-notes" hidden></div>' +
      '<div class="nearby-clues" id="bag-cache" hidden></div><div class="nearby-items" id="nearby-items"></div></section>' +
      '<section id="carried-pane" class="inventory-section" hidden><div id="storage-options" class="bag-toolbar"><label for="store-source">Store in<select id="store-source"></select></label>' +
      '<button type="button" class="small-button primary" data-action="stash" title="Equipped and pinned items stay with you">Stash matching</button>' +
      '</div><div class="inventory-items" id="inventory-items"></div></section>' +
      (state.player.vehicle || !nearbyObjects().some(o => o.action !== "loot") && !canTalk() ? "" :
        '<div class="item-actions">' + button("Other nearby actions", "interactions") + "</div>"), "bag");
    updateInventoryLists();
    const search = $("bag-search");
    search.addEventListener("input", () => { bagFilter = search.value; updateInventoryLists(); });
    search.parentElement.addEventListener("toggle", () => {
      if (search.parentElement.open) search.focus();
      else if (search.value) { search.value = bagFilter = ""; updateInventoryLists(); }
    });
    $("loot-source").addEventListener("change", event => { bagSource = event.target.value; updateInventoryLists(); });
    $("store-source").addEventListener("change", event => { storeSource = event.target.value; updateInventoryLists(); });
  }

  function useBelt(slot) {
    if (!active() || dialog.open) return;
    if (!state.player.belt[slot]) { beltPanel(); return; }
    if (Sim.useBelt(state, slot)) save();
    updateHud();
  }

  function updateBelt() {
    $("quick-belt").hidden = !active();
    const lamp = Sim.activeLight(state), equipped = Sim.weapon(state);
    state.player.belt.forEach((id, index) => {
      const control = $("belt-" + index), d = Data.items[id];
      const item = id && equipped.id === id ? equipped : Sim.beltItem(state,id);
      const on = Boolean(item && (item === lamp || item === equipped));
      const label = !id ? "Set slot" : !item ? "Empty" : d.damage && !on ? "Equip weapon" : Sim.itemName(state,id);
      const info = !id ? "+" : !item ? "" : id === "flashlight" ? (on ? "ON · " : "") +
        Math.ceil(item.charge / Data.flashlight.capacity * 100) + "%" : d.damage ? on ? Math.round(item.condition ?? 100) + "%" : "" : "×" + itemCount(id);
      $("belt-label-" + index).textContent = label;
      $("belt-info-" + index).textContent = info;
      $("belt-icon-" + index).setAttribute("href", "#" + (item && (!d.damage || on) ? d.icon : "pack"));
      control.classList.toggle("belt-empty", Boolean(id && !item));
      control.classList.toggle("belt-on", on);
      control.disabled = Boolean(id && !item);
      const description = "Slot " + (index + 1) + " · " + label + (info ? " · " + info : "");
      control.setAttribute("aria-label", description);
      control.title = description;
    });
  }

  function beltPanel() {
    if (!active()) return;
    const p = state.player;
    const carried = [...new Set(p.bag.map(item => item.id).filter(Sim.canBelt))].sort((a,b) => Data.items[a].name.localeCompare(Data.items[b].name));
    const slots = p.belt.map((id, slot) => {
      const options = id && !carried.includes(id) ? [...carried, id] : carried;
      return '<label for="belt-choice-' + slot + '">Slot ' + (slot + 1) + '<select id="belt-choice-' + slot + '" data-belt-slot="' + slot + '">' +
        '<option value="">Empty</option>' + options.map(item => '<option value="' + item + '"' + (item === id ? " selected" : "") + '>' +
        esc(Sim.itemName(state,item)) + (carried.includes(item) ? "" : " (unavailable)") + "</option>").join("") + "</select></label>";
    }).join("");
    show("Quick belt", '<p>Assign equipment or supplies. Use the numbered buttons or keys 1–4 while playing.</p><div class="rules-grid belt-settings">' + slots +
      '</div><p id="belt-status" role="status"></p>' + button("Back to Gear", "gear-open"), "belt");
  }

  function gear() {
    if (!active()) return;
    const p = state.player, current = Sim.weapon(state), lamp = Sim.activeLight(state), weapons = [], equipment = [], lighting = [];
    const repair = Data.recipes.find(recipe => recipe.repair);
    const mend = Data.recipes.find(recipe => recipe.mend);
    p.bag.forEach((item, index) => {
      const d = Data.items[item.id], backpack = d.use === "backpack";
      if (item.id === "flashlight") {
        lighting.push('<div class="item-row bag-item"><div><div class="item-top">' + icon(d.icon) + '<b>Flashlight</b></div><div class="item-meta">' +
          itemDescription(item) + " · Batteries ×" + itemCount("battery") + '</div></div><div class="item-actions">' +
          button(item === lamp ? "Switch off" : "Switch on", "light-" + index, Boolean(p.vehicle), "primary") +
          button("Replace battery", "battery-" + index, item.charge >= Data.flashlight.capacity || !itemCount("battery")) + "</div></div>");
        return;
      }
      if (!d.damage && !d.slot && !backpack) return;
      const equipped = item === current || (backpack && p.backpack);
      const worn = d.slot && Sim.wornItem(state,d.slot) === item;
      const details = itemDescription(item) + (d.firearm ? " · " + itemCount("ammo") + " rounds" : "") +
        (backpack ? " · Adds 10 kg of capacity" : "");
      const recipe = d.damage ? repair : Sim.canMend(item) ? mend : null;
      const needsRepair = recipe && item.condition < 100;
      const repairProblem = needsRepair ? Sim.recipeProblem(state,recipe,item) : "";
      const row = '<div class="item-row' + (equipped || worn ? " equipped-item" : "") + '"><div><div class="item-top">' +
        itemIcon(item.id) + "<b>" + esc(d.name) + '</b></div><div class="item-meta">' + details + '</div></div>' +
        '<div class="item-actions">' +
        button(item === current ? "Unequip" : equipped ? "Equipped" : worn ? "Remove" : "Equip",
          (item === current ? "unequip-" : "equip-") + index, equipped && item !== current, worn || equipped ? "" : "primary") +
        (needsRepair ? button(recipe.mend ? "Mend" : "Repair", "repairitem-" + index, Boolean(repairProblem)) +
          '<div class="item-meta">' + (repairProblem ? "Need " + esc(repairProblem) : "+" + Sim.repairAmount(state,item) +
            " condition max · " + (recipe.mend ? "1 cloth" : "1 scrap") + " · 1 tape") + '</div>' : "") + "</div></div>";
      (d.damage ? weapons : equipment).push(row);
    });
    const slots = [["In hand",Data.items[current.id]?.name],
      ["Head",Data.items[p.gear.head]?.name],["Body",Data.items[p.gear.body]?.name],["Arms",Data.items[p.gear.arms]?.name],
      ["Hands",Data.items[p.gear.hands]?.name],["Wrist",Data.items[p.gear.wrist]?.name],["Legs",Data.items[p.gear.legs]?.name],
      ["Feet",Data.items[p.gear.feet]?.name],["Back",p.backpack ? "Backpack" : null]];
    show("Equipment", '<p class="survivor-summary"><b>' + esc(p.name) + "</b> · " + Data.roles[state.role].name +
      '</p><div class="equipment-overview"><canvas id="equipment-portrait" width="48" height="48" aria-hidden="true"></canvas>' +
      '<dl class="equipment-slots">' + slots.map(([label,name]) => '<div><dt>' + label + '</dt><dd>' +
        esc(name || "Empty") + '</dd></div>').join("") + '</dl></div>' +
      (p.traits?.length ? '<p class="item-meta">' + p.traits.map(id => esc(Data.traits[id].name + " (" + Data.traits[id].description + ")")).join(" · ") + '</p>' : "") +
      '<div class="stats-summary"><span>LOAD · ' + formatWeight(Sim.weight(p.bag)) + " / " + Sim.capacity(state) + " kg</span></div>" +
      '<div class="item-actions">' + button("Backpack", "equipment-backpack") + button("Customize survivor", "edit-survivor") + button("Customize quick belt", "belt-edit", false, "primary") +
      (itemCount("watch") ? button("Wait with wristwatch", "watch-wait", Boolean(p.vehicle)) +
        button("Place watch alarm · 10 s", "arm-watch", Boolean(p.vehicle || state.atmosphere.alarm)) : "") + "</div>" +
      (lighting.length ? '<section class="inventory-section"><h3>LIGHTING</h3><div class="inventory-items">' + lighting.join("") + "</div></section>" : "") +
      '<section class="inventory-section"><h3>WEAPONS</h3><p class="item-meta">Blunt hits work well on walkers. Quick and long-reach weapons help against runners. Heavy hits can interrupt brutes.</p><div class="gear-list">' + (weapons.join("") || '<div class="empty">No weapons carried.</div>') +
      '</div></section><section class="inventory-section"><h3>WEARABLE GEAR</h3><div class="gear-list">' +
      (equipment.join("") || '<div class="empty">No wearable gear carried.</div>') + '</div></section>', "gear");
    View.equipmentPortrait($("equipment-portrait"),state);
  }

  const appearanceOptions = selected => Object.entries(Data.appearances).map(([id,label]) =>
    '<option value="' + id + '"' + (selected === id ? " selected" : "") + ">" + label + "</option>").join("");

  function survivorFields(prefix, profile) {
    return Object.entries(Data.survivorStyle).map(([key,field]) =>
      '<label>' + field.label + '<select id="' + prefix + '-' + key + '">' +
      Object.entries(field.options).map(([id,option]) =>
        '<option value="' + id + '"' + (profile[key] === id ? " selected" : "") + '>' + option.label + '</option>'
      ).join("") + '</select></label>'
    ).join("");
  }

  function survivorProfile(prefix) {
    const name = $(prefix === "setup" ? "survivor-name" : "profile-name").value;
    const appearance = $(prefix === "setup" ? "appearance" : "profile-appearance").value;
    const style = Object.fromEntries(Object.keys(Data.survivorStyle).map(key => [key,$(prefix + "-" + key).value]));
    // Traits are chosen once, at setup; editing the survivor later keeps them.
    const traits = prefix === "setup" ? [...$("trait-choices").querySelectorAll("input:checked")].map(input => input.value) : state?.player?.traits;
    return Data.character({name,appearance,...style,traits});
  }

  function showTraitPoints() {
    const choices = [...$("trait-choices").querySelectorAll("input")];
    const loadout = Data.traitLoadout(choices.filter(input => input.checked).map(input => input.value));
    for (const input of choices) input.disabled = !input.checked && Object.hasOwn(loadout.effects,Data.traits[input.value].effect);
    $("trait-points").textContent = loadout.balance + " points remaining. Drawbacks earn points. Start with zero or more.";
    $("start-btn").disabled = !loadout.valid;
  }

  function updateSurvivorPreview(prefix) {
    const preview = $(prefix + "-portrait");
    const player = {...state.player, ...survivorProfile(prefix)};
    // Show the chosen jacket in the editor even when protective gear covers it in play.
    player.gear = {...player.gear,body:null};
    View.equipmentPortrait(preview,{...state,player});
  }

  function setSetupSurvivor(profile) {
    const player = Data.character(profile);
    $("survivor-name").value = player.name;
    $("appearance").value = player.appearance;
    for (const key of Object.keys(Data.survivorStyle)) $("setup-" + key).value = player[key];
    for (const input of $("trait-choices").querySelectorAll("input")) input.checked = player.traits.includes(input.value);
    showTraitPoints();
    updateSurvivorPreview("setup");
  }

  function editSurvivor() {
    if (!active()) return;
    show("Customize survivor", '<form id="profile-form"><div class="equipment-overview">' +
      '<canvas id="profile-portrait" class="survivor-portrait" width="48" height="48" aria-label="Survivor appearance preview"></canvas>' +
      '<div class="rules-grid"><label>Name<input id="profile-name" maxlength="56" value="' +
      esc(state.player.name) + '" autocomplete="off"></label><label>Appearance<select id="profile-appearance">' +
      appearanceOptions(state.player.appearance) + '</select></label>' +
      survivorFields("profile",state.player) + '</div></div><div class="item-actions">' +
      '<button type="submit" class="small-button primary">Save survivor</button>' + button("Cancel", "gear-open") +
      "</div></form>", "edit-survivor");
    updateSurvivorPreview("profile");
    $("profile-form").addEventListener("change",() => updateSurvivorPreview("profile"));
  }

  function crafting(ingredient = null) {
    if (!active()) return;
    craftIngredient = typeof ingredient === "string" && Object.hasOwn(Data.items, ingredient) ? ingredient : null;
    const recipes = Data.recipes.filter(recipe => !craftIngredient || itemInRecipe(recipe, craftIngredient))
      .sort((a, b) => Number(Boolean(Sim.recipeProblem(state, a))) - Number(Boolean(Sim.recipeProblem(state, b))));
    const campfire = Sim.nearby(state).find(o => o.kind === "campfire");
    const fires = craftIngredient ? Object.values(Data.fireRecipes).filter(recipe => (!recipe.identify || Sim.knownMushrooms(state)) && itemInRecipe(recipe, craftIngredient)) : [];
    const requirements = inputs => Object.entries(inputs).map(([id, qty]) => '<div class="' + (Sim.available(state, id) < qty ? "missing" : "") + '">' +
      esc(Data.items[id].name) + " · " + Sim.available(state, id) + " / " + qty + "</div>").join("");
    show(craftIngredient ? "Recipes · " + Data.items[craftIngredient].name : "Craft and build", "<p>Craft with carried supplies and searched containers within reach.</p>" +
      (craftIngredient ? '<div class="item-actions recipe-nav">' + button("All recipes", "craft-open") + button("Back to inventory", "recipes-back") + "</div>" : "") +
      '<div class="recipe-list">' + recipes.map(r => {
        const problem = Sim.recipeProblem(state, r);
        return '<article class="recipe"><h3>' + r.name + "</h3><p>" + r.desc + '</p><div class="requirements">' + requirements(r.inputs) + "</div>" + button(r.build ? "Choose spot" : "Craft", "craft-" + r.id, Boolean(problem), "primary") +
          (problem ? '<div class="item-meta">Missing · ' + esc(problem) + "</div>" : "") + "</article>";
      }).join("") + fires.map(r => '<article class="recipe"><h3>' + r.name + '</h3><p>Campfire · ' + r.minutes +
        ' game min</p><div class="requirements">' + requirements(r.inputs) + '</div>' +
        (campfire ? button("Open campfire", "firepanel-" + objectIndex(campfire), false, "primary") : '<p>Move within reach of a campfire to prepare this recipe.</p>') +
        "</article>").join("") + "</div>", "craft");
  }

  function health() {
    const p = state.player;
    const effects = [
      ["Stamina", "Slow down or stop to recover stamina. Melee damage is now " + Math.round(Sim.damageFactor(state) * 100) + "% of normal."],
      ["Fatigue", Math.round(p.fatigue) + "% tired. Rest in a bed to recover."],
      ["Hunger and thirst", "Below 15%, hunger or thirst weakens combat. At zero, you begin losing health."],
      ["Pain", Math.round(p.pain) + "%. Pain above 40% reduces damage. Painkillers provide temporary relief."],
      ["Panic", Math.round(p.panic) + "%. Panic affects firearm accuracy."],
      ["Cold and wetness", state.rules.exposure === "off" ? "Exposure is off in this run." :
        p.temperature.toFixed(1) + " °C · " + Math.round(p.wetness) + "% wet. Dry off indoors, equip a waterproof jacket or warm up at a campfire."],
      ["Viral transmission", p.exposure ? "Viral exposure " + p.exposure.toFixed(1) + "%. Treating the wound helps with bleeding and pain." :
        ({bites:"Bites transmit the virus.", wounds:"Bites transmit the virus. Cuts and scratches can transmit it too.", off:"Viral transmission is off in this run."}[state.rules.infection])]
    ];
    const statuses = conditions();
    const wounds = p.wounds.map((w, index) => '<div class="effect-row injury-row"><b>' + (w.part === "arm" ? "Arm" : "Leg") + " · " + esc(w.type) +
      "</b><div><p>" + (w.bandaged ? "Bandaged" : "Bleeding") + " · " + (w.clean ? "Disinfected" : "Needs disinfecting") +
      " · Wound infection " + Math.round(w.infection) + "%" + (state.rules.care === "gradual" && w.bandaged ? " · Healing " +
        Math.round((w.healing ?? 0) / Sim.healTime(w) * 100) + "%" : "") + '</p><div class="item-actions">' +
      (!w.bandaged ? button("Bandage", "treat-" + index + "-bandage", !itemCount("bandage"), "primary") : "") +
      (!w.clean ? button("Disinfect", "treat-" + index + "-disinfectant", !itemCount("disinfectant")) : "") + "</div></div></div>").join("");
    show("Health", '<div class="stats-summary"><span>HEALTH ' + Math.ceil(p.hp) + "</span><span>COMBAT LV " + Sim.level(state, "combat") + "</span><span>BUILDING LV " + Sim.level(state, "crafting") + "</span><span>FIRST AID LV " + Sim.level(state, "medical") + "</span><span>GARDENING LV " + Sim.level(state, "gardening") + "</span></div>" +
      (statuses.length ? '<div class="health-conditions"><b>Active conditions</b><ul>' + statuses.map(status =>
        '<li>' + esc(status.label) + '</li>').join("") + '</ul></div>' : '') +
      (wounds || '<p>No injuries.</p>') + '<p>' + (state.rules.care === "gradual" ?
        "Bandage a bleeding wound, then disinfect it to help it heal. Rest somewhere safe to recover health." : "Bandages restore some health in this run.") +
      '</p><div class="item-actions">' + button("Bandage ×" + itemCount("bandage"), "quick-bandage", !itemCount("bandage")) +
      button("Disinfectant ×" + itemCount("disinfectant"), "quick-disinfectant", !itemCount("disinfectant")) + button("Painkiller ×" + itemCount("painkiller"), "quick-painkiller", !itemCount("painkiller")) +
      '</div>' + skillsHtml() + '<div style="margin-top:14px">' + effects.map(([title, text]) => '<div class="effect-row"><b>' + title + "</b><p>" + text + "</p></div>").join("") + "</div>", "health");
  }

  function dailySummary() {
    const rows = [...state.dailyHistory].reverse();
    const summary = entry => '<p>Infected defeated: '+(entry.walker+entry.runner+entry.brute)+
      ' · '+entry.walker+' walkers · '+entry.runner+' runners · '+entry.brute+' brutes</p>'+
      '<p>Attacks '+entry.attacks+' · Hits taken '+entry.hits+' · Loot '+entry.loot+' · Gathered '+entry.gathered+
      ' · Crafted '+entry.crafted+' · Meals cooked '+entry.cooked+' · Crossings '+entry.crossings+'</p>';
    show("Daily summary",'<section class="ledger-case"><h3>Day '+state.daily.day+' · In progress</h3>'+
      summary(state.daily)+rows.map((entry,i)=>'<details'+(i===0?' open':'')+'><summary>Day '+entry.day+
      '</summary>'+summary(entry)+'</details>').join("")+
      (rows.length?'':'<p>Completed days appear here at midnight.</p>')+'</section><div class="item-actions">'+
      button("Survival journal","journal")+'</div>',"daily-summary");
  }

  function diary() {
    const eva = state.world.npc.mode;
    const evaRegion = Object.keys(state.regionStates).find(id => state.regionStates[id].npc.mode !== "away");
    const evaStatus = eva === "away" ? "stayed in " + (Regions.definitions[evaRegion]?.name ?? "Cold Vale") :
      {injured:"needs help at the clinic",follow:"is following you",wait:"is waiting",refuge:"is at the shelter",dead:"has died"}[eva];
    const notes = [state.world, ...Object.values(state.regionStates)].flatMap(zone => zone.objects)
      .filter(o => o?.action === "field-note" && o.read && Object.hasOwn(FieldStories.byLine,o.line));
    const fieldNotes = notes.length ? '<details><summary>Field notes · ' + notes.length + '</summary>' +
      notes.map(o => '<p><b>' + esc(o.name) + '</b><br>' + esc(FieldStories.byLine[o.line].text) +
        (FieldStories.noteDetails[o.id.slice("field-note-".length)] ?
          '<br>' + esc(FieldStories.noteDetails[o.id.slice("field-note-".length)]) : "") + '</p>').join("") + '</details>' : "";
    show("Survival journal", '<div class="item-actions story-nav">' +
      button("Logbook", "field-ledger", false, "primary") +
      button("Daily summary", "daily-summary") +
      (Sim.nearbyTrack(state) ? button("Inspect tracks","inspect-tracks") : "") +
      button("Outbreak log · " + knownStory().length + "/" + Object.keys(Data.story).length, "outbreak-log", false, "primary") +
      (state.flags.radio ? button("Supply run" + (state.supplyRun === "complete" ? " ✓" : ""), "supply-run") : "") +
      button("Garden & kitchen" + (state.flags.gardenMeal ? " ✓" : ""), "garden-project") +
      button("Shelter utilities", "utilities") +
      button("Regional map", "regional-map") +
      button("Playtest report", "playtest", state.mode === "menu") +
      '</div><div class="waypoint-actions">' +
      landmarks().map(([id,label]) => button("Mark " + esc(label), "mark-" + id, !active())).join("") +
      '</div>' + fieldNotes + '<div class="objectives">' + objectiveHtml() + '</div><p>These tasks are optional. Keep exploring after you repair the radio.</p>' +
      '<div class="stats-summary"><span>DAY ' + day() + "</span><span>" + state.kills + " INFECTED KILLED</span><span>SEED " + state.seed + "</span></div>" +
      '<p>Eva · ' + esc(evaStatus) + '</p><div class="item-actions">' +
      button("Water for the shelter" + (state.flags.water ? " ✓" : ""), "water-project", false, "primary") +
      button("Save now", "save", state.mode === "menu") + button("Export save", "export", state.mode === "menu") + button("Import save", "import") +
      button("What's new", "releases") + button("Research and sources", "research") + "</div>", "diary");
  }

  function dispatchStatus() {
    const order = state.ledger.dispatch;
    if (!order) return "";
    const route = Chronicle.routes[order.route];
    const remaining = Math.max(0,Math.ceil(order.sent + Chronicle.dispatchDelay - state.minutes));
    const region = Regions.definitions[route.region].name, delivery = Regions.definitions[route.destination].name;
    const signal = remaining ? "Transmitting in " + remaining + " in-game minutes." : order.moved === null ? "Signal sent to " + region + "." :
      order.moved ? route.danger + " · " + order.moved + " infected responded to the signal." : "No infected answered the signal.";
    const parcel = remaining ? "A runner is due in " + delivery + "." : route.cache + " · " + delivery + ".";
    const stash = state.world.objects.find(o => o.delivery === order.route && o.active);
    return '<section class="ledger-order"><h3>' + esc(route.title) + '</h3><p>' + esc(signal) + '</p><p>' + esc(parcel) + '</p><div class="item-actions">' +
      (stash ? button("Mark parcel", "mark-" + stash.id, !active()) : "") +
      (order.reportRead ? button("Read signed check-in", "ledgerreport") : "") + '</div></section>';
  }

  function fieldLedger() {
    const {ledger, world} = state;
    const gathered = Chronicle.core.filter(id => Chronicle.has(ledger,id)).length;
    const visibleRegions = Object.keys(Chronicle.leads).filter(region =>
      (region !== Regions.cavern && !Regions.definitions[region].deep) || world.region === region || state.regionStates[region]);
    const recordList = visibleRegions.map(region => {
      const local = Object.entries(Chronicle.entries).filter(([,entry]) => entry.region === region && Chronicle.available(entry,world));
      const read = local.filter(([id]) => Chronicle.has(ledger,id));
      const unseen = local.find(([id,entry]) => (!entry.action || entry.afterDispatch) &&
        (!entry.extra || region === Regions.cavern || Regions.definitions[region].deep) && !Chronicle.has(ledger,id));
      const challenge = local.find(([id,entry]) => entry.game && !entry.afterDispatch && !Chronicle.has(ledger,id) &&
        entry.needs.every(need => Chronicle.has(ledger,need)));
      const hint = challenge ? '<p>' + esc(challenge[1].title + " · " + challenge[1].source) + '</p>' : "";
      return '<article class="ledger-region"><h3>' + Regions.definitions[region].name + '</h3><div class="item-meta">' + read.length + ' / ' + local.length +
        ' recorded</div>' + (unseen ? '<p>' + esc(Chronicle.leads[region]) + '</p>' : '') + hint + '<div class="item-actions">' +
        read.map(([id,entry]) => button(esc(entry.title),"ledgerread-" + id)).join("") + '</div></article>';
    }).join("");
    const town = world.region === Regions.home;
    const back = world.underground ? "ridge" : (Regions.definitions[world.region].host ?? Regions.home);
    const district = Object.values(Expedition.districts).find(area => area.host === world.region);
    const districtHint = world.generator >= Expedition.generator && district ? '<p>' + esc(district.lead) + '</p>' : "";
    const districtProgress = world.generator >= Expedition.generator && Chronicle.has(ledger,"shutdown") ?
      '<p>' + Expedition.packets.filter(id => Chronicle.has(ledger,id)).length + ' / ' + Expedition.packets.length +
      ' district witness packets. Bring them to the Southbank Switchroom.</p>' : "";
    const chapter = Chronicle.has(ledger,"lastreturn") ? "The automatic register is closed. The district witness copies are filed below." :
      Chronicle.has(ledger,"shutdown") ? "The recorded all-clear has stopped. The district clerks are still checking who made it home." :
      ledger.dispatch?.reportRead ? "The crew made it through. Follow the survey trail below Pine Ridge to find the source of the broadcast." :
      "The same all-clear has aired twice. Trace it across the five surface regions and give the survivors one live signal.";
    show("Logbook", '<section class="ledger-case"><h3>' + Chronicle.title + '</h3><p>' + esc(chapter) + '</p>' +
      '<p class="item-meta">' + gathered + ' / ' + Chronicle.core.length + ' core records and checks</p>' + districtHint + districtProgress +
      (world.region === "coast" && Chronicle.has(ledger,"tidebook") ? '<p>' + esc(Chronicle.tideForecast(state.minutes)) + '</p>' : '') + dispatchStatus() +
      '<div class="item-actions">' + button(town ? "Mark civil defence desk" : "Mark crossing to " + Regions.definitions[back].name,
        town ? "mark-" + Chronicle.deskId : "mark-exit-" + back, !active(), "primary") + button("Back to journal", "diary") + '</div></section>' +
      '<div class="ledger-regions">' + recordList + '</div>', "field-ledger");
  }

  const ledgerEntryText = entry => '<div class="ledger-source">' + esc(entry.source) + (entry.time ? ' · ' + esc(entry.time) : '') + '</div><p class="ledger-text">' +
    esc(entry.text) + '</p>' + (entry.lead ? '<p class="ledger-lead">' + esc(entry.lead) + '</p>' : '');

  function ledgerEntry(id) {
    if (!Object.hasOwn(Chronicle.entries,id) || !Chronicle.has(state.ledger,id)) return;
    const entry = Chronicle.entries[id];
    show(entry.title, ledgerEntryText(entry) + '<div class="item-actions">' + button("Logbook", "field-ledger", false, "primary") + '</div>', "ledger-entry");
  }

  function ledgerReport(parcel = null) {
    const order = state.ledger.dispatch;
    if (!order?.reportRead) return;
    const route = Chronicle.routes[order.route];
    show("Signed check-in", '<div class="ledger-source">' + esc(route.cache) + '</div><p>' + esc(route.report) + '</p><div class="item-actions">' +
      (parcel ? button("Open parcel", "relayparcel-" + objectIndex(parcel), false, "primary") : '') +
      button("Logbook", "field-ledger") + '</div>', "ledger-report");
  }

  function ledgerPanel(o) {
    const index = objectIndex(o), ledger = state.ledger;
    const back = button("Logbook", "field-ledger");
    if (o.action === "ledger-desk") {
      const choices = ledger.dispatch ? dispatchStatus() : '<div class="ledger-regions">' + Object.entries(Chronicle.routes).map(([id,route]) => {
        const problem = Sim.dispatchProblem(state,o,id);
        return '<article class="ledger-region"><h3>' + route.title + '</h3><p>' + esc(route.description) + '</p>' +
          (problem ? '<p class="item-meta">' + esc(problem) + '</p>' : '') +
          button("Transmit", "ledgertransmit-" + index + "-" + id, Boolean(problem), "primary") + '</article>';
      }).join("") + '</div>';
      show(o.name, '<p>The reserve circuit can send one verified diversion. The relay takes ' + Chronicle.dispatchDelay + ' in-game minutes to carry the call.</p>' +
        choices + '<div class="item-actions">' + back + '</div>', "object-" + index);
      return;
    }
    const entry = Chronicle.entries[o.record];
    if (o.action === "ledger-record" && Sim.resolveScene(state,o)) save();
    const found = Chronicle.has(ledger,o.record);
    const problem = found ? "" : Sim.sceneProblem(state,o);
    const cache = state.world.objects.find(item => item.id === Chronicle.cacheFor(o.record));
    const read = found ? ledgerEntryText(entry) : '<div class="ledger-source">' + esc(entry.source) + '</div>' +
      (problem ? '<p>' + esc(problem) + '</p>' : '<p>' + esc(entry.prompt || "Check this lead against what you recorded.") + '</p>') +
      (entry.noise && !problem ? '<p class="item-meta">The test makes noise nearby.</p>' : '');
    if (!found && !problem && entry.game) {
      const attempt = state.sceneAttempt?.record === o.record ? state.sceneAttempt : null;
      const status = attempt?.failed ? "That input reset the sequence. Try again." :
        (attempt?.step ?? 0) + " / " + entry.game.sequence.length + " inputs accepted";
      const controls = entry.game.buttons.map((label, choice) => button(esc(label), "ledgerplay-" + index + "-" + choice)).join("");
      show(o.name, read + '<p class="item-meta" role="status">' + esc(status) + '</p><div class="item-actions">' +
        controls + back + '</div>', "object-" + index);
      return;
    }
    const action = found ? (Sim.reachableObject(state,cache) ? button("Open parcel", "ledgerloot-" + index, false, "primary") : '') :
      entry.action ? button(esc(entry.action), "ledgertrigger-" + index, Boolean(problem), "primary") : '';
    show(o.name, read + '<div class="item-actions">' + action + back + '</div>', "object-" + index);
  }

  function playtestReport() {
    if (state.mode === "menu") return;
    const p = state.player;
    const startingPoint = Data.control.starts[state.controlStart]?.name ?? "Imported save";
    const report = [
      "# Last CloneZ playtest",
      "Version " + Data.control.version,
      Regions.definitions[state.world.region].name + " · seed " + state.seed + " · layout " + state.world.generator,
      "Start " + startingPoint,
      "Preset " + (Data.modes[state.difficulty]?.name ?? "Custom") + " · Background " + Data.roles[state.role].name,
      "Rules " + Object.entries(state.rules).map(([key, value]) => key + "=" + value).join(", "),
      ...(state.difficultyOptions ? [
        (assistsOn() ? "Assists on" : "Assists off") + " · " + Object.entries(state.difficultyOptions.assists)
          .filter(([, enabled]) => enabled).map(([id]) => Data.assistFields[id]).join(", ") +
          " · Touch aim " + state.difficultyOptions.aim + " · Adaptive hordes " + (state.difficultyOptions.director ? "on" : "off") +
          " · Pressure " + state.difficultyOptions.pressure,
        ...(state.difficultyChanges ?? []).map(entry => "Day " + (Math.floor(entry.minute / 1440) + 1) +
          " " + time(entry.minute) + " — " + entry.changes)
      ] : []),
      "Day " + day() + " at " + time(state.minutes) + " · " + World.zoneAt(state.world, p.x, p.y).name +
        " · Game tile " + Math.floor(p.x) + ", " + Math.floor(p.y),
      "Health " + Math.round(p.hp) + "/100 · Infected defeated " + state.kills,
      "Weather " + state.weather + " · " + p.temperature.toFixed(1) + " °C · " + Math.round(p.wetness) + "% wet",
      ...(state.playtest ? [
        "Playtest milestones (elapsed seconds)",
        ...Object.entries({tutorialSkip:"Introduction skipped (introduction time)", move:"First move", pickup:"First pickup",
          equip:"First equip", fight:"First fight", heal:"First heal", death:"First death"})
          .map(([id, label]) => label + " — " + (state.playtest[id] === undefined ? "—" : state.playtest[id].toFixed(1) + " s"))
      ] : []),
      "Device and controls — [add your phone or computer and touch, mouse or keyboard]",
      "Steps to reproduce — [add what you did]",
      "Expected behaviour — [add what you expected]",
      "Observed behaviour — [add what happened]",
      "",
      "Help me reproduce this in Last CloneZ and suggest a testable improvement."
    ].join("\n");
    show("Playtest report", '<p>Copy this snapshot and fill in the steps you took.</p>' +
      '<textarea id="playtest-text" class="playtest-text" rows="10" readonly aria-label="Playtest report"></textarea>' +
      '<div class="item-actions">' + button("Copy report", "copy-playtest", false, "primary") +
      (state.mode === "dead" ? button("Back to title", "new") : button("Back to journal", "diary")) +
      '</div><p id="playtest-status" class="item-meta" role="status"></p>', "playtest");
    $("playtest-text").value = report;
  }

  async function copyPlaytest() {
    const input = $("playtest-text"), status = $("playtest-status");
    if (!input || !status) return;
    input.focus();
    input.select();
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = "Copied. Paste the report into your project chat.";
    } catch {
      status.textContent = "The report is selected. Use your device’s Copy command.";
    }
  }

  function knownStory() {
    return Object.keys(Data.story).filter(id => id === "opening" || (id === "reply" && state.flags.radio) ||
      (id === "checkin" && state.supplyRun === "complete") || state.clues.includes(id));
  }

  function storyText(entry) {
    return '<p class="story-source">' + esc(entry.source) + " · " + esc(entry.time) + "</p><p>" + esc(entry.text) + "</p>";
  }

  function outbreakLog() {
    show("Outbreak log", "<p>Find notes while searching the town. Repair the shelter radio to make contact.</p>" +
      '<div class="item-actions story-nav">' + button("Back to journal", "diary") + '</div><div class="story-entries">' +
      knownStory().map(id => {
        const entry = Data.story[id];
        return '<article class="story-entry"><h3>' + esc(entry.title) + "</h3>" + storyText(entry) + "</article>";
      }).join("") + "</div>", "outbreak-log");
  }

  function storyEntry(id) {
    const entry = Data.story[id];
    const radioEntry = id === "reply" || id === "checkin";
    show(entry.title, '<article class="story-entry">' + storyText(entry) + '</article><div class="item-actions">' +
      (radioEntry ? button("Resume", "resume", false, "primary") + button("Supply run", "supply-run") :
        button("Back to inventory", "bag-open")) +
      button("Outbreak log", "outbreak-log") + "</div>", "story-entry");
  }

  function supplyRun() {
    if (!state.flags.radio) return;
    const complete = state.supplyRun === "complete", returning = state.supplyRun === "return";
    const step = complete ? "Checked in" : returning ? "Return to the shelter" : "Search the petrol station";
    const detail = complete ? "Mara logged your return. The supplies are yours." :
      returning ? "Use the shelter radio to tell Mara you found her cache." :
      "Mara left bandages, water and a tin of food in the petrol station cupboard. Search the cupboard on foot and leave room in your bag.";
    const action = complete ? button("Read check-in", "supply-checkin", false, "primary") :
      returning ? button("Mark shelter", "mark-base", !active(), "primary") :
      button("Mark petrol station", "mark-fuel", !active(), "primary");
    show("Mara’s supply run", '<article class="story-entry"><h3>' + step + "</h3><p>" + detail +
      '</p></article><div class="item-actions">' + action + button("Back to journal", "diary") + "</div>", "supply-run");
  }

  const itemQuantities = inputs => Object.entries(inputs).map(([id, qty]) =>
    qty + " × " + Data.items[id].name.toLocaleLowerCase("en")).join(" · ");
  const rainForecast = () => {
    const minutes = Sim.minutesToRain(state);
    if (!Number.isFinite(minutes)) return "Rain is off in this run.";
    return minutes ? "Rain expected at " + time(state.minutes + minutes) + "." : "It is raining.";
  };
  const rainStock = barrel => {
    const qty = Sim.rainBottles(barrel);
    return Math.floor(barrel.water) + "% full · " + qty + (qty === 1 ? " bottle available." : " bottles available.");
  };
  const boilingStatus = minutes => minutes === null ? "No batch at the campfire." : minutes > 0 ?
    "Boiling · " + Math.ceil(minutes) + " in-game min left." : Data.waterBatch.qty + " bottles of drinking water ready.";

  function gardenStatus(bed) {
    const {crop, moisture, growth} = bed.garden;
    const plant = Data.crops[crop], wet = Math.floor(moisture) + "% soil moisture";
    if (!plant) return "Empty bed · " + wet;
    if (growth >= plant.minutes) return plant.name + " ready · " + wet;
    const status = moisture < Data.garden.minMoisture ? "Needs water" : Math.ceil(plant.minutes - growth) + " in-game min to grow";
    return plant.name + " · " + status + " · " + wet;
  }

  function gardenProject() {
    const beds = state.world.objects.filter(o => o.active && o.kind === "garden")
      .sort((a, b) => Sim.distance(state.player, a) - Sim.distance(state.player, b));
    const recipe = Data.recipes.find(r => r.build === "garden"), problem = Sim.recipeProblem(state, recipe);
    const help = state.flags.gardenHelp && state.world.npc.mode === "refuge" && Sim.evaAtShelter(state) ?
      "Eva is tending the shelter garden. She waters dry beds up to " + Data.garden.shelterRange +
      " m from the shelter entrance if there is a stocked rain collector within " + Data.garden.collectorRange + " m of the bed." :
      "When Eva is staying at the shelter, you can ask her to water nearby beds with collected rainwater.";
    show("Garden & kitchen", '<section class="water-panel"><p>Start with radish seeds in the shelter crate. Find seed potatoes at the grocery store. Plant in an outdoor bed and water it with rainwater or bottled water. Rain waters the bed too.</p>' +
      '<div class="stats-summary"><span>GARDENING LV ' + Sim.level(state, "gardening") + "</span>" +
      (state.flags.harvested ? "<span>FIRST HARVEST ✓</span>" : "") +
      (state.flags.gardenMeal ? "<span>FIRST FOOD BATCH ✓</span>" : "") + "</div>" +
      '<div class="story-entries">' + beds.map(bed => '<article class="story-entry"><h3>' + gardenStatus(bed) + '</h3><div class="item-actions">' +
        button("Mark garden bed", "station-" + objectIndex(bed), !active()) + "</div></article>").join("") +
      '</div><p>Build a bed with ' + itemQuantities(recipe.inputs) + ". Collect one seed with each harvest. Cook potatoes or dry radishes at a campfire.</p><p>" + help + "</p>" +
      (problem ? '<p class="item-meta">For a new bed · ' + esc(problem) + "</p>" : "") +
      '<div class="item-actions">' + button("Choose bed spot", "craft-gardenbed", !active() || Boolean(problem), "primary") +
      button("Mark grocery store", "mark-market", !active()) + button("Back to journal", "diary") + "</div></section>", "garden-project");
  }

  function waterProject() {
    const stations = state.world.objects.filter(o => o.active && (o.kind === "barrel" || o.kind === "campfire"))
      .sort((a, b) => Sim.distance(state.player, a) - Sim.distance(state.player, b));
    const collector = stations.find(o => o.kind === "barrel" && o.rawRain);
    const legacyCollector = stations.some(o => o.kind === "barrel" && !o.rawRain);
    const fire = stations.find(o => o.kind === "campfire" && o.boilUntil != null) || stations.find(o => o.kind === "campfire");
    const collectorCost = Data.recipes.find(r => r.id === "rainbarrel").inputs;
    const fireCost = Data.recipes.find(r => r.id === "campfire").inputs;
    const mark = (label, station) => station ? button(label, "station-" + objectIndex(station), !active()) : "";
    show("Water for the shelter", '<section class="water-panel"><p>Build a rain collector and a campfire outdoors. Collect rainwater and boil it in batches.</p>' +
      '<div class="effect-row"><b>Rain collector</b><p>' + (collector ? rainStock(collector) : itemQuantities(collectorCost) + ".") + " " + rainForecast() +
      (!collector && legacyCollector ? " Your old collector yields drinking water. Build a new collector for this project." : "") + "</p></div>" +
      '<div class="effect-row"><b>Campfire</b><p>' + (fire ? (fire.cook ? "Food is using this campfire." : boilingStatus(Sim.boilingMinutes(state, fire))) :
        itemQuantities(fireCost) + ".") + "</p></div>" +
      '<div class="effect-row"><b>' + (state.flags.water ? "First batch collected" : "Prepare a batch") + "</b><p>" + itemQuantities(Data.waterBatch.inputs) +
      " make " + Data.waterBatch.qty + " bottles of drinking water. The batch takes " + Data.waterBatch.minutes + " in-game minutes. You can come back later.</p></div>" +
      '<div class="item-actions">' + (!collector || !fire ? button("Open crafting", "craft-open", !active(), "primary") : "") +
      mark("Mark collector", collector) + mark("Mark campfire", fire) + button("Mark workshop", "mark-workshop", !active()) +
      button("Back to journal", "diary") + "</div></section>", "water-project");
  }

  function utilities() {
    if (state.world.region !== Regions.home) {
      const back = state.world.underground ? "ridge" : Regions.home;
      show("Shelter utilities", "<p>The kitchen tap and backup generator are at your shelter in Cold Vale.</p>" +
        button("Mark crossing to " + Regions.definitions[back].name, "mark-exit-" + back, !active(), "primary") + " " +
        button("Back to journal", "diary"), "utilities");
      return;
    }
    const generator = state.world.objects.find(o => o.kind === "generator"), tap = state.world.objects.find(o => o.kind === "tap");
    const outage = days => days < 0 ? "Stays on for this run." : "Scheduled to shut off at the start of day " + (days + 1) + ".";
    show("Shelter utilities", '<div class="effect-row"><b>Town power</b><p>' + (Sim.gridPower(state) ? outage(state.rules.powerDays) : "Power is out.") +
      " Powered fridges slow food spoilage. Put food in the shelter fridge before starting the backup generator.</p></div>" +
      '<div class="effect-row"><b>Mains water</b><p>' + (Sim.mainsWater(state) ? outage(state.rules.waterDays) : "Mains water is off.") +
      " The kitchen tap has a small reserve. Keep empty bottles for refills.</p></div>" +
      '<div class="item-actions">' + button("Mark generator", "station-" + objectIndex(generator), !active()) +
      button("Mark kitchen tap", "station-" + objectIndex(tap), !active()) + button("Rainwater project", "water-project") +
      button("Back to journal", "diary") + "</div>", "utilities");
  }

  function releases() {
    show("What's new", Research.releases.map(release => '<section class="research-section"><h3>Version ' +
      esc(release.version) + '</h3><div class="item-meta">' + esc(release.date) + '</div>' +
      release.changes.map(change => '<p>• ' + esc(change) + '</p>').join("") +
      (release.checks ? '<p>' + esc(release.checks) + '</p>' : "") + '</section>').join(""), "releases");
  }

  function research() {
    show("Research and sources", '<div class="source-note">' + esc(Research.scope) + "</div><p>Reviewed on " + Research.date + ". The community sources describe individual experiences and suggestions.</p>" +
      '<table class="research-table"><thead><tr><th>System</th><th>Status</th><th>Current coverage</th></tr></thead><tbody>' +
      Research.systems.map(row => "<tr>" + row.map(cell => "<td>" + esc(cell) + "</td>").join("") + "</tr>").join("") + "</tbody></table>" +
      Research.sources.map(source => '<section class="research-section"><h3>' + esc(source.name) + '</h3><div class="item-meta">' + esc(source.kind) + "</div><p>" + esc(source.finding) + "</p><p>" + esc(source.decision) + '</p><a class="source-link" href="' + source.url + '" target="_blank" rel="noopener noreferrer">View source ↗</a></section>').join("") +
      '<section class="research-section"><h3>PZwiki</h3><p>Automated access to the wiki was blocked.</p><a class="source-link" href="https://pzwiki.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer">Open the official wiki ↗</a></section>', "research");
  }

  function npcPanel() {
    const n = state.world.npc, near = Sim.distance(state.player, n) <= 1.85;
    if (n.mode === "injured") {
      show("Eva", "<p>“It started at the bus depot. When they came in, I sent the walking wounded home. Then a few of the others started walking too.”</p>" +
        "<p>Give Eva a bandage and canned food so she can leave the clinic with you.</p>" +
        button("Help Eva", "recruit", !near || Sim.available(state, "bandage") < 1 || Sim.available(state, "food") < 1, "primary"), "npc");
    } else {
      const shelter = Sim.evaAtShelter(state);
      const detail = n.mode === "follow" ? "Eva follows you and sneaks when you do." : n.mode === "refuge" ? "Eva is staying at the shelter." : "Eva is waiting.";
      const duty = shelter ? (n.mode === "refuge" ?
        button(state.flags.gardenHelp ? "Stop tending beds" : "Tend garden beds", "garden-help") :
        button("Stay at shelter", "npc-refuge")) : "";
      show("Eva", "<p>Health " + Math.round(n.hp) + "%. " + detail + '</p><div class="item-actions">' +
        button("Follow", "npc-follow", n.hp <= 0) + button("Wait", "npc-wait", n.hp <= 0) + duty + "</div>", "npc");
    }
  }

  function gardenPanel(bed, id) {
    const g = bed.garden, crop = Data.crops[g.crop], yieldBundle = Sim.gardenYield(state, bed);
    const planting = crop ? '<progress class="water-progress" max="' + crop.minutes + '" value="' + g.growth +
      '" aria-label="Crop growth"></progress>' : '<div class="recipe-list">' +
      Object.entries(Data.crops).map(([key, plant]) => {
        const seeds = Sim.available(state, plant.seed);
        return '<article class="recipe"><h3>' + plant.name + "</h3><p>" + plant.minutes + " in-game min with moist soil · " +
          seeds + (seeds === 1 ? " seed" : " seeds") + " available</p>" +
          button("Plant " + plant.name.toLowerCase(), "sow-" + id + "-" + key, !seeds) + "</article>";
      }).join("") + "</div>";
    const fits = yieldBundle && Sim.canCarryBundle(state, yieldBundle);
    const harvest = yieldBundle ? "<p>Harvest · " + itemQuantities(yieldBundle) + "</p>" +
      button(fits ? "Harvest" : "Make room to harvest", "harvest-" + id, !fits, "primary") : "";
    const waterActions = yieldBundle ? "" : ["rainwater", "water"].map(item => {
      const qty = Sim.available(state, item);
      return button((item === "rainwater" ? "Use rainwater" : "Use bottled water") + " · " + qty,
        "irrigate-" + id + "-" + item, !qty || g.moisture >= 90);
    }).join("");
    show("Garden bed", '<section class="water-panel"><p>' + gardenStatus(bed) + '</p><progress class="water-progress" max="100" value="' +
      g.moisture + '" aria-label="Soil moisture"></progress><p>Rain waters this bed. Growth pauses below ' + Data.garden.minMoisture +
      "% soil moisture.</p>" + planting + harvest + '<div class="item-actions">' + waterActions +
      button("Resume", "resume") + "</div></section>", "object-" + id);
  }

  function stationPanel(o, id) {
    if (o.action === "barrel") {
      const bottles = Sim.rainBottles(o);
      const qty = Sim.rainDraw(state, o);
      const action = bottles ? button(qty ? "Collect water ×" + qty : "Collect water", "context-" + id, !qty, "primary") :
        button("Resume", "resume", false, "primary");
      show("Rain collector", '<section class="water-panel"><p>' + rainStock(o) + '</p>' +
        '<progress class="water-progress" max="' + Data.rainCollector.capacity + '" value="' + o.water + '" aria-label="Water in collector"></progress>' +
        '<p>Boil the collected rainwater at a campfire. ' + rainForecast() + "</p>" +
        (!bottles ? "<p>The collector fills while you play in rainy weather.</p>" :
          !qty ? "<p>Make room in your inventory to collect water.</p>" : "") +
        action + "</section>", "object-" + id);
      return;
    }
    const batch = Sim.fireBatch(state, o);
    const warm = button("Recover stamina", "context-" + id);
    if (!batch) {
      const recipes = Object.entries(Data.fireRecipes)
        .filter(([,recipe]) => !recipe.identify || Sim.knownMushrooms(state))
        .map(([key,recipe]) => ({key,recipe,missing:Sim.recipeProblem(state,recipe)}))
        .sort((a,b) => Number(Boolean(a.missing)) - Number(Boolean(b.missing)));
      show("Campfire", '<section class="water-panel"><p>Available batches appear first. Each campfire prepares one at a time.</p><div class="recipe-list">' +
        recipes.map(({key,recipe,missing}) => {
          const action = key === "water" ? "boil-" + id : "cook-" + id + "-" + key;
          return '<article class="recipe"><h3>' + Data.items[recipe.product].name + " ×" + recipe.qty + "</h3><p>" +
            itemQuantities(recipe.inputs) + " · " + recipe.minutes + " in-game min</p>" +
            (missing ? '<p class="item-meta">Missing · ' + esc(missing) + "</p>" : "") +
            button(recipe.name, action, Boolean(missing), "primary") + "</article>";
        }).join("") + '</div><div class="item-actions">' + warm + "</div></section>", "object-" + id);
      return;
    }
    const {recipe, remaining, readyAt} = batch, water = batch.id === "water", product = Data.items[recipe.product];
    const spoiled = Sim.isSpoiled(state, {id: recipe.product, born: readyAt});
    const status = water ? boilingStatus(remaining) : remaining > 0 ?
      product.name + " · " + Math.ceil(remaining) + " in-game min left." : spoiled ? "The food has spoiled." : product.name + " ×" + recipe.qty + " ready.";
    let detail = "", action;
    if (remaining > 0) {
      detail = '<progress class="water-progress" max="' + recipe.minutes + '" value="' + (recipe.minutes - remaining) +
        '" aria-label="Campfire batch progress"></progress><p>Close this panel to let time pass. You can return for the batch later.</p>';
      action = button("Resume", "resume", false, "primary");
    } else {
      const full = !spoiled && Sim.roomFor(state, recipe.product) < recipe.qty;
      if (full) detail = "<p>Make room in your inventory. The batch will stay at the campfire.</p>";
      const label = water ? "Collect drinking water" : spoiled ? "Discard spoiled food" : "Collect food";
      action = button(label, (water ? "bottles-" : "meal-") + id, full, "primary");
    }
    show("Campfire", '<section class="water-panel"><p>' + status + "</p>" + detail +
      '<div class="item-actions">' + action + warm + "</div></section>", "object-" + id);
  }

  function objectPanel(o, feedback = "") {
    if (!o?.active) return;
    if (Chronicle.isScene(o) || o.action === "ledger-desk") { ledgerPanel(o); return; }
    if (o.delivery && Sim.readDispatchReport(state,o)) { save(); ledgerReport(o); return; }
    const id = objectIndex(o);
    if (Sim.isFurniture(o)) {
      show(o.name, (Sim.isSeat(o) ? "<p>Sit down to rest. Resting restores your strength and helps wounds heal; sleep needs a bed.</p>" : "") +
        '<div class="item-actions">' + (Sim.isSeat(o) ? button("Sit and rest", "seatrest-" + id, false, "primary") : "") + button("Dismantle…", "furnituremenu-" + id) +
        button("Back", "interactions") + "</div>", "object-" + id);
      return;
    }
    if (o.kind === "car") {
      const repairProblem = Sim.vehicleRepairProblem(state,o);
      const condition = Math.round(Math.min(140 - o.hp,Sim.vehicleRepairAmount(state)) / 1.4);
      show("Vehicle", "<p>Fuel " + Math.round(o.fuel) + "% · Condition " + Math.round(o.hp/1.4) +
        "%.</p><p>Use the stick or tap an outdoor destination. Engine noise and crashes attract the infected.</p>" +
        (feedback ? '<p class="bag-feedback" role="status">' + esc(feedback) + "</p>" : "") +
        '<div class="item-actions">' + button(state.player.vehicle === o.id ? "Exit" : "Drive", state.player.vehicle === o.id ? "exit-car" : "drive-" + id, o.hp <= 0) +
        button("Refuel · 1 fuel", "refuel-" + id, Boolean(state.player.vehicle) || o.fuel >= 99 || o.hp <= 0) +
        (o.hp > 0 && o.hp < 140 && !state.player.vehicle ? button("Patch +" + condition + "% · 2 scrap, 1 tape", "patchcar-" + id, Boolean(repairProblem)) : "") +
        button("Open boot", "trunk-" + id) + "</div>", "car-" + id);
      return;
    }
    if (o.action === "loot") { bag("nearby", o); return; }
    if (o.action === "door") {
      const barrier = Sim.isBarrier(o);
      const broken = o.broken || o.hp === 0 && barrier;
      const condition = broken ? "Broken" : o.locked ? "Locked" : o.latched ? "Latched" : o.kind === "fence" ? "Standing" : o.open ? "Open" : "Closed";
      const blocked = Boolean(o.boards) || broken || o.locked && !Sim.canUnlock(state, o) || o.latched && !Sim.canUnlatch(state, o);
      const window = o.kind === "window";
      const pry = !o.open && !o.boards && !broken && (o.locked || o.latched);
      const force = window && !o.open && !o.boards && !broken;
      const explanation = o.locked ? "A spare key was left in the boot of a car southwest of the station. Forced entry can trigger an alarm while town power is on." :
        o.latched ? "The latch is on the inside. Use a crowbar or break the glass from outside." : "";
      show(o.name, "<p>" + condition + " · " + o.boards + " extra planks · Strength " + Math.round(o.hp) +
        "</p>" + (explanation ? "<p>" + explanation + "</p>" : "") +
        (window && (o.open || broken) && !o.boards ? "<p>The window is open: climb through it, or walk straight through the gap.</p>" : "") +
        (force ? "<p>Breaking glass is loud. An equipped melee weapon keeps your hands clear of the glass.</p>" : "") +
        (feedback ? '<p class="bag-feedback" role="status">' + esc(feedback) + "</p>" : "") +
        '<div class="item-actions">' + (o.kind === "fence" || broken ? "" : button(o.open ? "Close" : o.locked ? "Unlock with key" : o.latched ? "Unlatch" : "Open", "door-" + id, blocked, "primary")) +
        (window && (o.open || broken) && !o.boards ? button("Climb through", "climb-" + id, false, "primary") : "") +
        (pry ? button("Pry with crowbar", "pry-" + id, Boolean(Sim.breachProblem(state, o, "pry"))) : "") +
        (force ? button("Smash glass", "smash-" + id, Boolean(Sim.breachProblem(state, o, "smash")), "danger") : "") +
        (Sim.canListen(state,o) ? button("Listen", "listen-" + id) : "") +
        (o.material === "stone" ? "" : button("Reinforce", "board-" + id, o.boards >= 3) + button("Remove plank", "unboard-" + id, !o.boards)) +
        (barrier ? button("Dismantle", "removebarrier-" + id, false, "danger") : "") + "</div>", "object-" + id);
      return;
    }
    if (o.action === "workbench") { crafting(); return; }
    if (o.action === "garden") { gardenPanel(o, id); return; }
    if (o.action === "campfire" || o.action === "barrel" && o.rawRain) { stationPanel(o, id); return; }
    const result = feedback ? '<p class="bag-feedback" role="status">' + esc(feedback) + "</p>" : "";
    if (o.action === "field-note") {
      if (Sim.readFieldNote(state,o)) save();
      return;
    }
    if (o.action === "ironworks-cage") {
      if (Sim.dismantleCage(state,o)) save();
      return;
    }
    if (o.action === "ironworks-terminal") {
      if (Sim.readTerminal(state,o)) save();
      return;
    }
    if (o.action === "cinema-note") {
      if (Sim.readCinemaNote(state,o)) save();
      return;
    }
    if (o.action === "eva-diary") {
      if (Sim.readEvaDiary(state,o)) save();
      return;
    }
    if (o.action === "cinema-statue") {
      if (Sim.takeStatue(state,o)) save();
      return;
    }
    if (o.action === "campaign-page") {
      if (Sim.readCampaignPage(state,o)) save();
      return;
    }
    if (o.action === "grotto-plate") {
      if (Sim.readGrottoPlate(state,o)) save();
      return;
    }
    if (o.action === "ai-terminal") {
      if (Sim.useAiTerminal(state,o)) aiChat();
      return;
    }
    if (o.action === "vic-diary") {
      if (Sim.readVicDiary(state,o)) save();
      return;
    }
    if (o.action === "westfields-ledger") {
      if (Sim.readFieldsLedger(state,o)) save();
      return;
    }
    if (o.action === "mushroom") {
      const name = Sim.itemName(state,o.species);
      const conditions = {
        normal:"The ground around the caps is still.",
        dormant:"Dry filaments run under the caps. They are still.",
        active:"Low filaments pulse and snap. Picking these caps may draw nearby infected."
      };
      const problem = Sim.mushroomProblem(state,o);
      show(o.name, '<p>' + esc(name) + ' · ' + conditions[o.colony] + '</p>' + result +
        (problem ? '<p class="item-meta">' + esc(problem) + '</p>' : '') +
        button("Harvest", "mushroom-" + id, Boolean(problem), o.colony === "active" ? "danger" : "primary") +
        " " + button("Back away", "resume"), "object-" + id);
      return;
    }
    if (o.action === "fungus") {
      show(o.name, '<p>' + (state.atmosphere.awake ? "The filaments are torn. The room has already stirred." :
        "The damp threads run under the wall. Touching or stepping on them can wake infected in the next room. There is clear ground around them.") +
        '</p><div class="item-actions">' + button("Touch the filaments", "touchfungus-" + id, state.atmosphere.awake, "danger") +
        button("Back away", "resume", false, "primary") + '</div>', "object-" + id);
      return;
    }
    if (o.action === "crib") {
      const first = !state.atmosphere.nursery;
      if (Sim.inspectCrib(state,o) && first) save();
      show(o.name, "<p>The blanket moves. A tiny infected peers out between the rails and lets out a thin cry.</p>" +
        button("Back away", "resume", false, "primary"), "object-" + id);
      return;
    }
    if (o.action === "travel") {
      if (state.player.vehicle) Sim.brake(state);
      const problem = Sim.travelProblem(state, o), from = state.world.region, to = o.id.slice(5);
      const details = to === Regions.cavern ? "Descend the rope on foot. Use L or the flashlight slot to see beyond the landing." :
        state.world.underground ? "Climb the rope to the firewatch trail." :
        Regions.connection(from, to).vehicles ? "Road crossing. Vehicles can use this route." : "Forest trail. Cross on foot.";
      show("Cross to " + o.name, "<p>" + details + " Regional danger: " + Sim.dangerRating(state,to) + ".</p>" + result +
        (problem && problem !== feedback ? '<p class="item-meta">' + esc(problem) + '</p>' : "") +
        '<div class="item-actions">' + button("Cross to " + o.name, "cross-" + id, Boolean(problem), "primary") +
        (state.player.vehicle ? button("Get out", "exit-car") : "") + '</div>', "object-" + id);
      return;
    }
    if (["spring", "forage", "fish"].includes(o.action)) {
      const problem = Sim.wildProblem(state, o);
      const fish = o.action === "fish", ready = o.fishUntil != null;
      const label = fish ? (ready ? "Check line" : "Cast line") : o.action === "spring" ? "Fill a bottle" : "Gather " + Data.items[o.resource].name.toLowerCase();
      const detail = fish ? (ready ? "Your line is in the water. Time advances when you close this panel." :
        "Use a rod and one bait. Check the line after " + Data.fishingMinutes + " in-game minutes.") :
        o.action === "spring" ? "Fill an empty bottle. Boil the water at a campfire." : "This spot replenishes over time.";
      show(o.name, "<p>" + detail + "</p>" + result + (problem && problem !== feedback ? '<p class="item-meta">' + esc(problem) + '</p>' : "") +
        '<div class="item-actions">' + button(label, "wild-" + id, Boolean(problem), "primary") + '</div>', "object-" + id);
      return;
    }
    if (o.action === "tap") {
      const mains = Sim.mainsWater(state), wet = mains || o.reserve > 0;
      show("Kitchen tap", "<p>" + (mains ? "Mains water is running." : "Mains off · " + o.reserve + " fills left in the pipes.") +
        "</p>" + result + '<div class="item-actions">' + button("Drink", "tapdrink-" + id, !wet || state.player.hydration >= 99, "primary") +
        button("Fill a bottle · " + itemCount("emptybottle") + " empty", "tapfill-" + id, !wet || !itemCount("emptybottle")) +
        (!wet ? button("Rainwater project", "water-project") : "") + "</div>", "object-" + id);
      return;
    }
    if (o.action === "generator") {
      show("Shelter generator", "<p>" + (o.running ? "Running" : "Off") + " · " + Math.ceil(o.fuel) +
        " in-game minutes of fuel left.</p><p>Powers the shelter lights and fridge. The engine can draw infected. One can adds " +
        Data.utilities.minutesPerFuel + " in-game minutes.</p>" + result + '<div class="item-actions">' +
        button(o.running ? "Switch off" : "Start generator", "power-" + id, !o.fuel, "primary") +
        button("Add fuel · " + Sim.available(state, "fuel") + " available", "genfuel-" + id,
          Sim.available(state, "fuel") < 1 || o.fuel > Data.utilities.generatorCapacity - Data.utilities.minutesPerFuel) +
        "</div>", "object-" + id);
      return;
    }
    if (o.action === "radio") {
      const rows = Sim.radioNeeds(state), ready = rows.every(r => Sim.available(state, r.id) >= r.qty);   // the repair also takes from crates in reach
      const list = '<table class="radio-needs"><thead><tr><th>Needed</th><th>Why</th><th>Carried</th><th>In shelter</th></tr></thead><tbody>' +
        rows.map(r => "<tr><td>" + (r.carried + r.stored >= r.qty ? "✓ " : "") + r.qty + " " + esc(Data.items[r.id].name) + "</td><td>" + esc(r.why) +
          '</td><td class="num">' + r.carried + '</td><td class="num">' + r.stored + "</td></tr>").join("") + "</tbody></table>" +
        (rows.some(r => r.missing) ? "<p>Where to look: " + rows.filter(r => r.missing).map(r => esc(Data.items[r.id].name) + ", " + esc(r.where)).join("; ") + ".</p>" : "") +
        (!ready && rows.every(r => r.carried + r.stored >= r.qty) ? "<p>Everything is in the shelter. Carry it to the radio.</p>" : "");
      const detail = state.flags.radio ? "<p>The water tower relay is on 87.6 FM.</p>" :
        "<p>Mara's relay is on 87.6. Getting the shelter radio working takes three things.</p>" + list +
        "<p>Broadcasting makes noise. Secure the shelter before switching it on.</p>";
      const label = !state.flags.radio ? "Repair and broadcast" : state.supplyRun === "return" ? "Report cache recovered" :
        state.supplyRun === "complete" ? "Read check-in" : "Read reply";
      show("Shelter radio", detail + button(label, "context-" + id, !state.flags.radio && !ready, "primary") +
        (state.flags.radio ? "" : " " + button(state.flags.radioPin ? "Unpin checklist" : "Pin checklist", "radiopin-" + id)), "object-" + id);
      return;
    }
    Sim.contextual(state, o);
    updateHud();
  }

  function interact(o) {
    if (state.player.vehicle && o.action !== "travel") {
      if (o.id === state.player.vehicle) objectPanel(o);
      else Sim.notify(state, "Exit the vehicle to interact.");
      return;
    }
    if (Sim.approach(state, o)) objectPanel(o);
  }

  function interactions(choices = nearbyObjects(true), talk = canTalk()) {
    if (!active() || state.player.vehicle) return;
    const rows = choices.map(o => {
      const description = [formatWeight(Sim.distance(state.player, o)) + " m"];
      if (o.action === "loot" && o.kind !== "car") description.push(o.loot.reduce((sum,item) => sum + item.qty, 0) + " items");
      if (Sim.unreadClueAt(state, o)) description.push("Unread note");
      if (Sim.isSupplyCache(state, o)) description.push("Mara’s cache");
      return '<div class="item-row bag-item"><div><div class="item-top"><b>' + esc(o.name) + '</b></div><div class="item-meta">' +
        description.join(" · ") + '</div></div><div class="item-actions">' +
        button(o.action === "door" ? "Manage" : interactionLabel(o), "choose-" + objectIndex(o), false, "primary") + "</div></div>";
    });
    if (talk) rows.push('<div class="item-row bag-item"><div class="item-top"><b>Eva</b></div><div class="item-actions">' +
      button("Talk", "talk-nearby", false, "primary") + "</div></div>");
    show("Nearby actions", '<div class="interaction-list">' + (rows.join("") || '<div class="empty">Move closer to an object or a survivor.</div>') +
      '</div><div class="item-actions">' + button("Open nearby inventory", "bag-open") + "</div>", "interactions");
  }

  function nearbyAction(useClosest = false) {
    if (!active() || dialog.open) return;
    if (state.player.vehicle) {
      const exit = nearbyExit();
      if (exit) objectPanel(exit);
      else { Sim.exitVehicle(state); updateHud(); save(); }
      return;
    }
    const choices = nearbyObjects(), talk = canTalk();
    const bat = guidedBat(choices);
    if (bat || useClosest === true && choices.length) {
      const closest = bat || choices.reduce((a, b) => Sim.distance(state.player, a) <= Sim.distance(state.player, b) ? a : b);
      if (closest.kind === "drop" && !closest.corpse && closest.loot?.length === 1) {
        const {id} = closest.loot[0], qty = Sim.collect(state, closest, 0, true);
        if (qty) {
          Sim.notify(state, "Took " + qty + " × " + Sim.itemName(state,id) + ".");
          save();
        }
        updateHud();
      } else objectPanel(closest);
      return;
    }
    const o = choices[0];
    if (taskTarget(o) || o && choices.length === 1 && !talk) objectPanel(o);
    else if (!talk && choices.length > 1 && choices.every(choice => choice.action === "loot" && choice.kind !== "car")) bag("nearby");
    else if (choices.length) interactions(choices, talk);
    else if (talk) npcPanel();
    else if (Sim.inspectTrack(state)) { save(); updateHud(); }
    else {
      // Nothing in reach: point at the closest thing a step or two away instead of opening an empty Nearby list.
      const far = !Sim.containers(state).length && state.world.objects.filter(o => o.active && o.action && o.action !== "harvest" && !o.decor &&
        Sim.distance(state.player, o) < 2.8).sort((a, b) => Sim.distance(state.player, a) - Sim.distance(state.player, b))[0];
      if (far) { Sim.notify(state, "Move closer to the " + (far.action === "door" ? far.kind : far.name.toLowerCase()) + "."); updateHud(); }
      else bag("nearby");
    }
  }

  function strike(enemy = Sim.attackTarget(state)) {
    if (state.player.vehicle || state.player.cooldown > 0) return;
    if (Sim.inAttackRange(state, enemy)) Sim.attack(state, enemy);
    else if (!state.notice?.danger || state.notice.until < state.elapsed) {
      state.notice = {text: "No infected within reach.", range: true, danger: false, until: state.elapsed + 1.8};
    }
  }

  function quickUse(id, wound) {
    const index = id === "flashlight" ? state.player.bag.indexOf(Sim.beltItem(state, id)) : state.player.bag.findIndex(item => item.id === id);
    if (index >= 0) return Sim.use(state, index, wound);
    Sim.notify(state, "You do not have " + Data.items[id].name + ".");
    return false;
  }

  function pause() {
    if (!active()) return;
    if (dialog.open) { close(); return; }
    show("Paused", "<p>The game is paused.</p>" + button("Resume", "resume", false, "primary") +
      '<div class="item-actions">' + button("Save", "save") + button("Export", "export") + button("Import", "import") + button("Save and exit", "menu") + button("Stuck? Free me", "unstick") + button(noiseRings ? "Noise rings: on" : "Noise rings: off", "noise-toggle") + button("Graphics: " + {dark: "Dark pixel", fast: "Fast", classic: "Classic"}[look], "gfx-toggle") + button(state.lookahead === false ? "Driving camera · fixed" : "Driving camera · look ahead", "lookahead") +
      ((state.guideStep === undefined && !state.longHaul) || lesson ? "" : button("Guidance: " + ($("guide-enabled").checked ? "on" : "off"), "guide-toggle")) +
      button("Atmosphere: " + atmosphereLabels[visualAtmosphere()], "atmosphere-options") +
      (lesson ? "" : button("Difficulty and assists", "difficulty-options")) + "</div>", "pause");
  }

  function visualAtmosphere() {
    return Object.hasOwn(atmosphereLabels, atmosphereChoice) ? atmosphereChoice : look === "fast" ? "reduced" : "full";
  }

  function atmospherePanel() {
    const selected = Object.hasOwn(atmosphereLabels, atmosphereChoice) ? atmosphereChoice : "default";
    const options = Object.entries({default:"Graphics default (" + (look === "fast" ? "Reduced" : "Full") + ")", ...atmosphereLabels})
      .map(([id,label]) => '<option value="' + id + '"' + (id === selected ? " selected" : "") + '>' + label + '</option>').join("");
    show("Atmosphere effects", '<form id="atmosphere-form"><div class="rules-grid"><label>Effects<select name="effects">' +
      options + '</select></label></div><label class="onboarding-option"><input type="checkbox" name="reduce-flicker"' +
      (reduceFlicker ? " checked" : "") + '> Reduce flicker</label><div class="section-label">SOUND</div><div class="rules-grid">' +
      Object.entries(volumeLabels).map(([id,label]) => '<label>' + label + '<input type="range" name="vol-' + id + '" min="0" max="100" step="5" value="' +
        Math.round(soundVolumes[id] * 100) + '"></label>').join("") + '</div><div class="item-actions">' +
      '<button type="submit" class="small-button primary">Apply</button></div></form>', "atmosphere-options");
  }

  function applyAtmosphere(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const choice = form.get("effects");
    atmosphereChoice = Object.hasOwn(atmosphereLabels, choice) ? choice : "";
    reduceFlicker = form.has("reduce-flicker");
    write(atmosphereKey, atmosphereChoice);
    write(flickerKey, reduceFlicker ? "1" : "0");
    soundVolumes = Soundscape.setVolumes(Object.fromEntries(Object.keys(volumeLabels).map(id => [id, Number(form.get("vol-" + id)) / 100])));
    write(volumeKey, JSON.stringify(soundVolumes));
    close();
  }

  function exportSave() {
    const blob = new Blob([JSON.stringify(Sim.snapshot(state))], {type: "application/json"});
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = "Last-CloneZ-" + state.seed + "-Day-" + day() + ".json";
    document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  function refreshPanel() {
    if (dialogView === "bag") updateInventoryLists();
    else if (dialogView === "craft") crafting(craftIngredient);
    else if (dialogView === "health") health();
    else if (dialogView?.startsWith("object-")) objectPanel(state.world.objects[Number(dialogView.slice(7))]);
    updateHud();
  }

  function bagChanged(changed, previousNotice) {
    if (changed) save();
    refreshPanel();
    const status = $("bag-feedback");
    const notice = state.notice !== previousNotice ? state.notice : null;
    status.textContent = notice?.text || "";
    status.hidden = !notice;
    status.classList.toggle("warn", Boolean(notice?.danger));
  }

  function changeInventory(kind, index, second, source) {
    const previousNotice = state.notice, p = state.player, item = p.bag[index];
    let changed = false;
    if (kind === "use") changed = Sim.use(state, index);
    else if (kind === "drop" || kind === "store") {
      const store = kind === "store" ? storageTarget() : null;
      if (kind === "store" && !store) return;
      changed = Sim.drop(state, index, store || false, Boolean(store));
      if (changed) Sim.notify(state, (store ? "Stored " : "Dropped ") + changed + " × " + Sim.itemName(state,item.id) + ".");
    } else if (kind === "pin" && item) {
      const position = p.pinned.indexOf(item.id);
      if (position >= 0) p.pinned.splice(position, 1);
      else p.pinned.push(item.id);
      changed = true;
    } else if (["take", "takegear", "all"].includes(kind)) {
      const entry = source?.loot?.[Number(second)];
      if (!entry || bagSource && bagSource !== source.id || !matches(entry)) return;
      const data = Data.items[entry.id], before = p.bag.length;
      changed = Sim.collect(state, source, Number(second), kind === "all");
      if (changed) {
        Sim.notify(state, "Took " + changed + " × " + data.name + ".");
        if (kind === "takegear" && (data.damage || data.slot && p.gear[data.slot] !== entry.id || data.use === "backpack" && !p.backpack)) {
          const acquired = data.damage ? before : p.bag.findIndex(owned => owned.id === entry.id);
          Sim.use(state, acquired);
        }
      }
    }
    bagChanged(changed, previousNotice);
  }

  body.addEventListener("submit", event => {
    if (event.target.id === "ai-form") {
      event.preventDefault();
      if (Sim.aiSend(state, $("ai-input").value)) { save(); aiChat(); }
    }
    else if (event.target.id === "pin-form") { event.preventDefault(); savePinForm(); }
    else if (event.target.id === "difficulty-form") applyDifficulty(event);
    else if (event.target.id === "atmosphere-form") applyAtmosphere(event);
    else if (event.target.id === "profile-form" && dialogView === "edit-survivor" && active()) {
      event.preventDefault();
      Object.assign(state.player,survivorProfile("profile"));
      save();
      gear();
    }
    else applyWorldRules(event);
  });
  body.addEventListener("change", event => {
    const slot = event.target.dataset?.beltSlot;
    if (dialogView !== "belt" || slot === undefined || !Sim.setBelt(state, Number(slot), event.target.value || null)) return;
    save();
    updateHud();
    $("belt-status").textContent = "Slot " + (Number(slot) + 1) + " saved.";
  });

  body.addEventListener("click", event => {
    const filter = event.target.closest("[data-filter]")?.dataset.filter;
    if (filter && dialogView === "bag") {
      bagTab = filter;
      for (const tab of document.querySelectorAll(".bag-filters button")) tab.setAttribute("aria-pressed", String(tab.dataset.filter === filter));
      updateInventoryLists();
      return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action || navigation === "discover" && mapAction.test(action)) return;
    if (action === "opening-discover" || action === "opening-locations") {
      setNavigation(action.slice(8));
      close(false);
      $("advanced-start").open = true;
      $("start-btn").focus();
      return;
    }
    if (action === "bag-carried" && lesson?.stage === 3) lesson.stage = 4;
    if (action === "resume") close();
    else if (action === "difficulty-options" && active() && !lesson) difficultyPanel(true);
    else if (action === "atmosphere-options" && active()) atmospherePanel();
    else if (action === "guide-toggle") {
      const setting = $("guide-enabled");
      setting.checked = !setting.checked;
      write(guideKey, setting.checked ? "1" : "0");
      close();
      updateHud();
    }
    else if (action === "noise-toggle") { noiseRings = !noiseRings; close(); }
    else if (action === "gfx-toggle") { look = look === "dark" ? "fast" : look === "fast" ? "classic" : "dark"; try { localStorage.setItem("clonez-gfx", look); } catch {} close(); }
    else if (action === "unstick") { close(); Sim.unstick(state); updateHud(); }
    else if (action === "menu") menu();
    else if (action === "new") { if (lesson) endLesson(); else titleScreen(); }
    else if (action === "afterlife") startAfterlife();
    else if (action === "afterlife-skip") skipAfterlife();
    else if (action === "save") { save(true); updateHud(); }
    else if (action === "export") exportSave();
    else if (action === "import") $("import-input").click();
    else if (action === "research") research();
    else if (action === "releases") releases();
    else if (action === "diary") diary();
    else if (action === "playtest") playtestReport();
    else if (action === "copy-playtest") copyPlaytest();
    else if (action === "outbreak-log") outbreakLog();
    else if (action === "field-ledger") fieldLedger();
    else if (action === "daily-summary") dailySummary();
    else if (action === "journal") diary();
    else if (action === "inspect-tracks" && Sim.inspectTrack(state)) close();
    else if (action === "ledgerreport") ledgerReport();
    else if (action.startsWith("ledgerread-")) ledgerEntry(action.slice(11));
    else if (action === "regional-map") map();
    else if (action === "belt-edit") beltPanel();
    else if (action === "edit-survivor") editSurvivor();
    else if (action === "gear-open") gear();
    else if (action === "watch-wait" && dialogView === "gear" && itemCount("watch")) {
      const sheltered = state.longHaul && World.tileAt(state.world,state.player.x,state.player.y)?.building === state.world.base?.id &&
        Boolean(state.world.base);
      const waits = sheltered ? [15,30,60,480] : [15,30,60];
      show("Wait with wristwatch", "<p>Choose how long to wait. Nearby danger interrupts waiting." +
        (sheltered ? " The eight-hour wait also stops if food or water runs low." : "") + "</p>" +
        '<div class="item-actions">' + waits.map(minutes => button(minutes === 480 ? "8 hours" : minutes + " min", "wait-" + minutes)).join("") +
        button("Cancel", "gear-open") + "</div>", "watch-wait");
    }
    else if (action.startsWith("wait-") && dialogView === "watch-wait") {
      if (Sim.waitWithWatch(state, Number(action.slice(5)))) close();
      else { gear(); if (state.notice) $("dialog-title").textContent = state.notice.text; }
      updateHud();
    }
    else if (action === "arm-watch" && dialogView === "gear") { if (Sim.armWatch(state)) close(); updateHud(); }
    else if (action === "pinhere" && active()) map({x:state.player.x, y:state.player.y});
    else if (action === "pincancel") map();
    else if (action.startsWith("pinedit-") && active()) map(state.mapPins.find(pin => pin.id === action.slice(8)));
    else if (action.startsWith("pindestination-") && active()) { if (Sim.markPin(state, action.slice(15))) close(); updateHud(); }
    else if (action.startsWith("pinremove-") && active()) { if (Sim.removePin(state, action.slice(10))) save(); map(); }
    else if (action === "bag-open") bag("nearby");
    else if (action === "equipment") gear();
    else if (action === "equipment-backpack") bag("carried");
    else if (action === "bag-nearby" || action === "bag-carried") { bagPane = action.slice(4); updateInventoryLists(); }
    else if (action === "reset-rules") worldRulesEditor(true);
    else if (action === "interactions") interactions();
    else if (action === "talk-nearby" && canTalk()) npcPanel();
    else if (action === "supply-run") supplyRun();
    else if (action === "supply-checkin" && state.supplyRun === "complete") storyEntry("checkin");
    else if (action === "collect-cache") {
      if (dialogView === "bag" && Sim.collectSupplyCache(state)) {
        save();
        supplyRun();
      }
    }
    else if (action.startsWith("clue-")) {
      const id = action.slice(5);
      if (dialogView === "bag" && Sim.readClue(state, id)) {
        save();
        storyEntry(id);
      }
    }
    else if (action === "water-project") waterProject();
    else if (action === "garden-project") gardenProject();
    else if (action === "utilities") utilities();
    else if (action === "craft-open") crafting();
    else if (action === "recipes-back") bag(bagPane, Sim.containers(state).find(o => o.id === bagSource));
    else if (action.startsWith("recipes-") && dialogView === "bag") crafting(action.slice(8));
    else if (action === "lookahead") { state.lookahead = state.lookahead === false; close(); pause(); }
    else if (action === "exit-car") { if (Sim.exitVehicle(state)) close(); updateHud(); }
    else if (action.startsWith("mark-")) { Sim.markDestination(state, action.slice(5)); close(); updateHud(); }
    else if (action.startsWith("drive-")) { if (Sim.enterVehicle(state, state.world.objects[Number(action.slice(6))])) close(); updateHud(); }
    else if (action.startsWith("refuel-")) { Sim.refuel(state, state.world.objects[Number(action.slice(7))]); objectPanel(state.world.objects[Number(action.slice(7))]); }
    else if (action.startsWith("trunk-")) bag("nearby", state.world.objects[Number(action.slice(6))]);
    else if (action === "loot-all" && dialogView === "bag") {
      const source = Sim.containers(state).find(o => o.id === bagSource);
      if (bagSource && !source) return;
      const before = state.notice;
      bagChanged(Sim.collectAll(state, source, matches), before);
    }
    else if (action === "stash" && dialogView === "bag") {
      const before = state.notice;
      bagChanged(Sim.stash(state, storageTarget(), matches), before);
    }
    else if (action === "recruit") { if (Sim.recruit(state)) { close(); save(); } else npcPanel(); }
    else if (action === "garden-help") { if (Sim.toggleGardenHelp(state)) { save(); npcPanel(); } }
    else if (action === "npc-refuge") {
      if (Sim.evaAtShelter(state)) { state.world.npc.mode = "refuge"; close(); }
    }
    else if (action.startsWith("npc-")) { state.world.npc.mode = action.slice(4) === "follow" ? "follow" : "wait"; close(); }
    else if (action.startsWith("quick-")) { if (quickUse(action.slice(6))) save(); refreshPanel(); }
    else if (action.startsWith("craft-")) {
      Sim.craft(state, action.slice(6));
      if (state.blueprint) close(); else refreshPanel();
    } else {
      const [kind, first, second] = action.split("-");
      const index = Number(first), o = state.world.objects[index];
      if (Sim.isFurniture(o) && Sim.reachableObject(state, o)) {
        if (kind === "seatrest" && dialogView === "object-" + index) {
          if (Sim.restOnSeat(state, o)) { close(); updateHud(); }
          return;
        }
        if (kind === "furnituremenu" && dialogView === "object-" + index) {
          show("Dismantle " + o.name + "?", "<p>This removes the furniture and leaves two scrap and one plank.</p>" +
            '<div class="item-actions">' + button("Dismantle", "furnitureconfirm-" + index, false, "danger") +
            button("Cancel", "furniturecancel-" + index) + "</div>", "furniture-" + index);
          body.querySelector('[data-action="furniturecancel-' + index + '"]')?.focus();
          return;
        }
        if (dialogView === "furniture-" + index) {
          if (kind === "furniturecancel") { objectPanel(o); return; }
          if (kind === "furnitureconfirm" && Sim.dismantleFurniture(state, o)) { close(); updateHud(); return; }
        }
      }
      if (kind === "patchcar" && dialogView === "car-" + index && o?.kind === "car") {
        if (Sim.repairVehicle(state,o)) save();
        objectPanel(o,state.notice?.text);
        updateHud();
        return;
      }
      if (kind === "listen" && dialogView === "object-" + index && Sim.canListen(state,o)) {
        objectPanel(o,Sim.listenAtDoor(state,o));
        return;
      }
      if (kind === "unequip" && ["bag","gear"].includes(dialogView)) {
        if (state.player.bag[index] !== Sim.weapon(state)) return;
        Sim.unequipWeapon(state);
        if (dialogView === "gear") {
          save();
          gear();
          updateHud();
        } else bagChanged(true, state.notice);
        return;
      }
      if (dialogView === "bag" && ["use", "drop", "store", "pin", "take", "takegear", "all"].includes(kind)) {
        changeInventory(kind, index, second, o);
        return;
      }
      if (kind === "choose" && dialogView === "interactions" && Sim.reachableObject(state, o)) { objectPanel(o); return; }
      if (kind === "cross" && dialogView === "object-" + index && o?.action === "travel") {
        const problem = Sim.travelProblem(state, o);
        if (problem) objectPanel(o, problem);
        else {
          crossing = {exit:o, displayed:false};
          show("Entering " + o.name, '<p role="status">Loading terrain and your saved progress…</p>', "crossing");
        }
        return;
      }
      if (kind === "wild" && dialogView === "object-" + index) {
        if (Sim.useWild(state, o)) close();
        else if (o?.active) objectPanel(o, state.notice?.text);
        updateHud();
        return;
      }
      if (kind === "mushroom" && dialogView === "object-" + index) {
        if (Sim.harvestMushroom(state,o)) close();
        else if (o?.active) objectPanel(o,state.notice?.text);
        updateHud();
        return;
      }
      if (kind === "touchfungus" && dialogView === "object-" + index) {
        if (Sim.touchFungus(state,o)) close();
        updateHud();
        return;
      }
      if (dialogView === "object-" + index && (kind === "ledgertrigger" || kind === "ledgerplay") && o?.action === "ledger-event") {
        if (Sim.resolveScene(state,o,kind === "ledgerplay" ? Number(second) : undefined)) save();
        ledgerPanel(o);
        if (kind === "ledgerplay") {
          (body.querySelector('[data-action="' + kind + "-" + index + "-" + Number(second) + '"]') ||
            body.querySelector('[data-action="ledgerloot-' + index + '"]'))?.focus();
        }
        updateHud();
        return;
      }
      if (dialogView === "object-" + index && kind === "ledgertransmit" && o?.action === "ledger-desk") {
        if (Sim.sendDispatch(state,o,second)) save();
        ledgerPanel(o);
        updateHud();
        return;
      }
      if (dialogView === "object-" + index && kind === "ledgerloot" && Chronicle.isScene(o) && !state.player.vehicle) {
        const cache = state.world.objects.find(item => item.id === Chronicle.cacheFor(o.record));
        if (Sim.reachableObject(state,cache)) bag("nearby",cache);
        return;
      }
      if (kind === "relayparcel" && dialogView === "ledger-report" && o?.delivery && Sim.reachableObject(state,o) && !state.player.vehicle) {
        bag("nearby",o);
        return;
      }
      if (kind === "firepanel" && dialogView === "craft" && o?.kind === "campfire" && Sim.reachableObject(state, o)) { objectPanel(o); return; }
      if (["light", "battery"].includes(kind) && dialogView === "gear" && state.player.bag[index]?.id === "flashlight") {
        if (kind === "light" ? Sim.use(state, index) : Sim.replaceBattery(state, state.player.bag[index])) save();
        gear();
        updateHud();
        return;
      }
      if (kind === "radiopin" && dialogView === "object-" + index) {
        state.flags.radioPin = !state.flags.radioPin; save(); objectPanel(o); updateHud();
        return;
      }
      if (kind === "climb" && dialogView === "object-" + index) {
        if (Sim.climbThrough(state, o)) { save(); close(); updateHud(); }
        else objectPanel(o, state.notice?.text ?? "");
        return;
      }
      if (["pry", "smash", "door"].includes(kind) && dialogView === "object-" + index && Sim.reachableObject(state, o)) {
        const before = state.notice;
        const changed = kind === "door" ? Sim.door(state, o) : Sim.breach(state, o, kind);
        if (changed) save();
        objectPanel(o, state.notice !== before ? state.notice.text : "");
        updateHud();
        return;
      }
      if (["tapdrink", "tapfill", "power", "genfuel"].includes(kind) && dialogView === "object-" + index) {
        const previous = state.notice;
        const changed = kind.startsWith("tap") ? Sim.useTap(state, o, kind === "tapfill") : Sim.useGenerator(state, o, kind === "genfuel");
        if (changed) save();
        objectPanel(o, state.notice !== previous ? state.notice.text : "");
        updateHud();
        return;
      }
      if (kind === "repairitem" && dialogView === "gear") {
        const item = state.player.bag[index];
        if (item && Sim.craft(state,Sim.canMend(item) ? "mend" : "repair",item)) save();
        gear();
        updateHud();
        return;
      }
      if (kind === "equip" && dialogView === "gear") {
        const data = Data.items[state.player.bag[index]?.id];
        if ((data?.damage || data?.slot || data?.use === "backpack") && Sim.use(state, index)) {
          save();
          gear();
          updateHud();
        }
        return;
      } else if (kind === "treat" && dialogView === "health") {
        if (quickUse(second, index)) save();
      } else if (kind === "board") Sim.barricade(state, o);
      else if (kind === "unboard") Sim.unboard(state, o);
      else if (kind === "removebarrier") { if (Sim.removeBarrier(state, o)) close(); }
      else if (kind === "station") { if (Sim.markStation(state, o)) close(); }
      else if (kind === "boil") { if (Sim.startBoiling(state, o)) close(); }
      else if (kind === "bottles") { if (Sim.collectBoiledWater(state, o)) close(); }
      else if (kind === "cook") { if (Sim.startFireBatch(state, o, second)) close(); }
      else if (kind === "meal") { if (Sim.collectCookedFood(state, o)) close(); }
      else if (kind === "sow") { if (Sim.sow(state, o, second)) save(); }
      else if (kind === "irrigate") { if (Sim.waterGarden(state, o, second)) save(); }
      else if (kind === "harvest") { if (Sim.harvestGarden(state, o)) save(); }
      else if (kind === "context") {
        if (Sim.contextual(state, o) && o.action === "radio") {
          save();
          storyEntry(state.supplyRun === "complete" ? "checkin" : "reply");
        } else close();
      }
      refreshPanel();
    }
  });

  $("import-input").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 2000000) throw new Error("The file is too large.");
      const restored = Sim.restore(JSON.parse(await file.text()));
      activate(restored);
      save();
      Sim.notify(state, "Save imported.");
      importSummary();
    } catch (error) { show("Import rejected", "<p>" + esc(error.message) + "</p><p>Your current game is still open.</p>", "save"); }
    event.target.value = "";
  });

  const actionPointer = event => (event.pointerType === "touch" || event.isPrimary) && event.button === 0;
  const dragged = (start, event) => Math.hypot(event.clientX - start.x, event.clientY - start.y) > 14;

  function bindTap(element, action) {
    const control = element !== canvas;
    const available = () => (active() || afterlife && control) && !dialog.open && !element.disabled && !element.hidden;
    const press = event => {
      const start = presses.get(event.pointerId);
      return start?.element === element ? start : null;
    };
    const cancel = event => {
      if (!press(event)) return;
      presses.delete(event.pointerId);
      if (!control) lastTap = null;
    };
    element.addEventListener("pointerdown", event => {
      if (!actionPointer(event) || !available()) return;
      presses.set(event.pointerId, {element, x: event.clientX, y: event.clientY});
      if (control) {
        event.preventDefault();
        element.setPointerCapture?.(event.pointerId);
      }
    });
    element.addEventListener("pointermove", event => {
      const start = press(event);
      if (start && dragged(start, event)) cancel(event);
    });
    for (const type of ["pointercancel", "lostpointercapture", "pointerleave"]) element.addEventListener(type, cancel);
    element.addEventListener("pointerup", event => {
      const start = press(event);
      if (!start) return;
      presses.delete(event.pointerId);
      const bounds = element.getBoundingClientRect();
      if (!actionPointer(event) || !available() || dragged(start, event) ||
          event.clientX < bounds.left || event.clientX >= bounds.right ||
          event.clientY < bounds.top || event.clientY >= bounds.bottom) {
        if (!control) lastTap = null;
        return;
      }
      action(event);
    });
    if (control) element.addEventListener("click", event => {
      // Keyboard and assistive activation have no pointer press.
      if (event.detail === 0 && available()) action(event);
    });
  }

  bindTap(canvas, event => {
    wakeSound();
    const hit = View.locate(event.clientX, event.clientY, state);
    const touch = event.pointerType === "touch";
    if (state.blueprint) {
      if (Number.isFinite(hit.x)) { if (Sim.place(state, hit.x, hit.y)) save(); }
      else Sim.notify(state, "Choose a clear spot on the ground.", true);
      return;
    }
    if (hit.enemy) {
      if (touch || stick.x || stick.y || [...keys].some(key => key !== "shift")) strike(hit.enemy);
      else Sim.target(state, hit.enemy);
      lastTap = null; return;
    }
    if (hit.npc) {
      if (state.player.vehicle) { Sim.notify(state, "Exit the vehicle to talk to Eva."); return; }
      state.target = null;
      if (Sim.distance(state.player, hit.npc) <= 1.85) npcPanel();
      else { Sim.approach(state, hit.npc); state.interaction = "eva"; }
      lastTap = null; return;
    }
    if (hit.object) { interact(hit.object); lastTap = null; return; }
    const now = performance.now();
    const run = touch && lastTap && now - lastTap.time < 330 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 45;
    lastTap = touch ? {time: now, x: event.clientX, y: event.clientY} : null;
    Sim.walkTo(state, hit.x, hit.y, Boolean(run));
  });
  canvas.addEventListener("contextmenu", event => event.preventDefault());

  function updateStick(event) {
    const bounds = stickElement.getBoundingClientRect();
    const dx = event.clientX - stick.originX, dy = event.clientY - stick.originY;
    const length = Math.hypot(dx, dy), radius = Math.min(bounds.width, bounds.height) * .30;
    const deadZone = radius * .16;
    const strength = length > deadZone ? Math.min(1, (length - deadZone) / (radius - deadZone)) : 0;
    stick.x = strength ? dx / length * strength : 0;
    stick.y = strength ? dy / length * strength : 0;
    $("stick-knob").style.transform = "translate(" + stick.x * radius + "px," + stick.y * radius + "px)";
  }
  stickElement.addEventListener("pointerdown", event => {
    if (!actionPointer(event) || !(active() || afterlife) || dialog.open || stick.pointer !== null) return;
    event.preventDefault();
    stick.pointer = event.pointerId;
    stick.originX = event.clientX; stick.originY = event.clientY;
    if (stickElement.setPointerCapture) stickElement.setPointerCapture(event.pointerId);
    state.player.path = []; state.target = null; state.interaction = null;
    state.dash = false;
    lastTap = null;
  });
  stickElement.addEventListener("pointermove", event => {
    if (event.pointerId === stick.pointer) updateStick(event);
  });
  const releaseStick = event => {
    if (event.pointerId === stick.pointer) clearStick();
  };
  for (const event of ["pointerup","pointercancel","lostpointercapture"]) stickElement.addEventListener(event, releaseStick);

  function shoveOrBrake() {
    if (state.player.vehicle) { resetInput(); Sim.brake(state); }
    else Sim.shove(state);
  }

  bindTap($("touch-use"), () => afterlife ? afterlifeAction("grab") : nearbyAction(true));
  bindTap($("touch-attack"), () => afterlife ? afterlifeAction("bite") : strike(Sim.touchAttackTarget(state)));
  bindTap($("touch-shove"), () => afterlife ? afterlifeAction("groan") : shoveOrBrake());
  bindTap($("touch-run"), () => {
    touchRun = !touchRun;
    if (touchRun) state.quiet = false;
    else state.dash = false;
    updateHud();
  });

  const handlers = {
    "opening-btn":opening, "intro-btn":startLesson, "lesson-exit":endLesson, "afterlife-exit":endAfterlife,
    "start-btn": () => start(), "story-btn": startStory, "recommended-btn": startRecommended, "longhaul-btn": () => start(true), "continue-btn": resumeSaved, "rules-btn": () => worldRulesEditor(),
    "setup-assists": () => difficultyPanel(), "map-btn": () => map(), "journal-btn": diary, "diary-btn": diary,
    "help-btn": help, "pause-btn": pause, "search-btn": nearbyAction, "attack-btn": () => strike(),
    "shove-btn": shoveOrBrake, "pack-btn": bag, "gear-btn": gear, "craft-btn": crafting,
    "sneak-btn": () => { state.quiet = !state.quiet; state.dash = false; touchRun = false; updateHud(); },
    "condition-bar": health, "close-dialog": close, "save-btn": () => save(true), "destination-btn": () => map(),
    "fullscreen-btn": toggleFullscreen,
    "roof-toggle": () => { state.roofsHidden = !state.roofsHidden; updateHud(); save(); },
    "zoom-in": () => { state.zoom = Math.min(1.75, (state.zoom || 1) + .15); updateHud(); },
    "zoom-out": () => { state.zoom = Math.max(.75, (state.zoom || 1) - .15); updateHud(); }
  };
  for (const [id, handler] of Object.entries(handlers)) $(id).addEventListener("click", handler);
  document.querySelectorAll("[data-panel]").forEach(button => button.addEventListener("click", health));
  $("navigation-mode").value = navigation;
  $("advanced-start").open = read(startChoiceKey) === "advanced" || !read(startChoiceKey) && Boolean(read(setupKey));
  requestAnimationFrame(() => { if (!$("hero").hidden && !dialog.open) ($("continue-btn").hidden ? $("story-btn") : $("continue-btn")).focus({preventScroll:true}); });
  $("guide-enabled").checked = read(guideKey) !== "0";
  $("playtest-enabled").checked = read(playtestKey) === "1";
  $("guide-enabled").addEventListener("change", event => write(guideKey, event.target.checked ? "1" : "0"));
  $("playtest-enabled").addEventListener("change", event => {
    write(playtestKey, event.target.checked ? "1" : "0");
    if (!event.target.checked) write(skipKey, "");
  });
  $("navigation-mode").addEventListener("change",event => setNavigation(event.target.value));
  $("sound-btn").addEventListener("click", () => { muted = !muted; write(soundKey, muted ? "1" : "0"); syncSound(); wakeSound(); });
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    if (dialogView === "afterlife-offer") skipAfterlife();
    else close();
  });
  const displayChanged = () => { resetInput(); updateDisplayMode(); };
  document.addEventListener("fullscreenchange", displayChanged);
  document.addEventListener("webkitfullscreenchange", displayChanged);
  $("quick-belt").innerHTML = Data.beltDefaults.map((_, slot) => '<button class="belt-slot" type="button" id="belt-' + slot +
    '" aria-keyshortcuts="' + (slot + 1) + '"><kbd>' + (slot + 1) + '</kbd><svg class="icon" aria-hidden="true"><use id="belt-icon-' + slot +
    '" href="#pack"/></svg><span id="belt-label-' + slot + '"></span><small id="belt-info-' + slot + '"></small></button>').join("");
  Data.beltDefaults.forEach((_, slot) => $("belt-" + slot).addEventListener("click", () => useBelt(slot)));

  window.addEventListener("keydown", event => {
    const move = codeKeys[event.code] ?? (event.key === "Shift" ? "shift" : null), key = event.key.toLowerCase();
    if (dialog.open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (!event.repeat && (key === "enter" && event.shiftKey && !["INPUT", "SELECT", "TEXTAREA"].includes(event.target?.tagName) || key === "escape" && expandedView && !afterlife)) {
      event.preventDefault();
      return toggleFullscreen();
    }
    if (afterlife) {
      if (move) keys.add(move);
      else if (!event.repeat && key === "escape") endAfterlife();
      else if (!event.repeat && key === " ") afterlifeAction("bite");
      else if (!event.repeat && (key === "f" || key === "e")) afterlifeAction("grab");
      else if (!event.repeat && (key === "x" || key === "q")) afterlifeAction("groan");
      else return;
      event.preventDefault();
      return;
    }
    if (!active()) return;
    if (move) {
      if (!event.repeat) keys.add(move);
      event.preventDefault();
      return;
    }
    if (key === " " && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      if (!event.repeat) strike();
      return;
    }
    if (event.repeat) return;
    if (key === "escape" && state.blueprint) { state.blueprint = null; updateHud(); }
    else if (key === "escape" || key === "p") pause();
    else if (key === "f" || key === "e") nearbyAction();
    else if (key === "k") interactions();
    else if (key === "x" || key === "q" || event.code === "KeyQ") handlers["shove-btn"]();
    else if (key === "v" && state.player.vehicle) { Sim.exitVehicle(state); save(); }
    else if (key === "c") handlers["sneak-btn"]();
    else if (key === "t") handlers["roof-toggle"]();
    else if (key === "n") { noiseRings = !noiseRings; Sim.notify(state, "Noise rings " + (noiseRings ? "on" : "off") + "."); }
    else if (key === "i") bag();
    else if (key === "g") gear();
    else if (key === "b") crafting();
    else if (key === "j") diary();
    else if (key === "h") health();
    else if (key === "m") map();
    else if (/^[1-4]$/.test(key)) useBelt(Number(key) - 1);
    else if (key === "l") { if (quickUse("flashlight")) save(); updateHud(); }
    else if (key === "r") { if (quickUse("bandage")) save(); }
    else return;
    event.preventDefault();
  });
  window.addEventListener("keyup", event => { keys.delete(codeKeys[event.code] ?? event.key.toLowerCase()); keys.delete(event.key.toLowerCase()); });
  const pauseOnInterruption = () => {
    if (active()) save();
    if (active() && !dialog.open) pause();
    else resetInput();
  };
  window.addEventListener("blur", pauseOnInterruption);
  const orientation = window.screen?.orientation;
  if (orientation?.addEventListener) orientation.addEventListener("change", pauseOnInterruption);
  else window.addEventListener("orientationchange", pauseOnInterruption);
  window.addEventListener("pagehide", () => {
    if (active()) pauseOnInterruption();
    else if (state.mode !== "menu") save();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseOnInterruption();
  });

  function frame(now) {
    const delta = Math.min(.2, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (crossing?.displayed) {
      const {exit} = crossing;
      const next = Sim.travel(state, exit);
      crossing = null;
      if (next) {
        activate(next);
        save();
      } else objectPanel(exit, state.notice?.text);
    }
    if (crossing) crossing.displayed = true;
    if ((active() || afterlife) && !dialog.open && !document.hidden) {
      const input = {
        x: stick.x || Number(keys.has("d") || keys.has("arrowright")) - Number(keys.has("a") || keys.has("arrowleft")),
        y: stick.y || Number(keys.has("s") || keys.has("arrowdown")) - Number(keys.has("w") || keys.has("arrowup")),
        run: keys.has("shift") || (touchRun && stick.pointer !== null)
      };
      const steps = Math.max(1, Math.ceil(delta / .03));
      if (afterlife) {
        const movement = Afterlife.screenInput(input);
        for (let i = 0; i < steps && afterlife; i++) {
          if (Afterlife.tick(afterlife,delta/steps,movement)) endAfterlife();
          else for (const cue of afterlife.cues.splice(0)) {
            if (!muted) Soundscape.play(audio,cue,afterlife.player);
          }
        }
      } else {
        const previousDay = state.daily.day;
        for (let i = 0; i < steps && active(); i++) Sim.tick(state, delta / steps, input);
        updateLesson();
        if (state.campaign?.epilogue === "pending" && !dialog.open && Sim.seeEpilogue(state)) {
          save();
          show(Data.epilogue.title, Data.epilogue.pages.map(t => "<p>" + esc(t) + "</p>").join("") + button("Stay", "resume", false, "primary"), "epilogue");
        }
        if (state.interaction) {
          const o = state.interaction === "eva" ? state.world.npc : state.world.objects.find(o => o.id === state.interaction);
          if (o && o.active !== false && Sim.distance(state.player, o) <= 1.85 && Sim.lineOfSight(state, state.player, o)) {
            state.player.path = []; state.interaction = null;
            if (o === state.world.npc) npcPanel();
            else objectPanel(o);
          } else if (!state.player.path.length) state.interaction = null;
        }
        if (!state.flags.supplies && state.world.base) {
          const supplies = [state.player.bag, ...state.world.objects.filter(o => o.storage && o.building === state.world.base.id).map(o => o.loot)];
          let food = 0, water = 0;
          for (const bag of supplies) for (const item of bag) {
            if (item.id === "water") water += item.qty;
            else if (Data.items[item.id].use === "food" && !Sim.isSpoiled(state, item)) food += item.qty;
          }
          if (food >= 4 && water >= 3) state.flags.supplies = true;
        }
        if (!lesson && (state.daily.day !== previousDay || state.elapsed >= nextSave)) save();
      }
    }
    if (state.mode === "dead" && !deathShown && !afterlife) {
      deathShown = true;
      save();
      if (state.afterlifePending) {
        deathOfferUntil = now + afterlifeOfferMs;
        show("Something moves", "<p>A sound reaches you. Follow it to try the afterlife. If you wait 12 seconds, the run summary opens automatically.</p>" +
          '<div class="item-actions death-actions">' + button("Follow the sound","afterlife",false,"primary") +
          button("Skip to summary","afterlife-skip") + "</div>","afterlife-offer");
      } else deathSummary();
    }
    if (dialogView === "afterlife-offer" && deathOfferUntil !== null && now >= deathOfferUntil) skipAfterlife();
    if (state.sounds.length) for (const sound of state.sounds.splice(0)) if (!muted) Soundscape.play(audio,sound,state.player);
    if (now >= nextHud) { updateHud(); nextHud = now + 150; }
    if (now >= nextMap) {
      if (!afterlife && !state.hideNavigation && minimap.clientWidth) View.minimap(minimap, state);
      nextMap = now + 500;
    }
    // Menu, paused and dead screens barely change, so draw them at ~15 fps to save battery and CPU.
    if ((active() || afterlife) && !dialog.open || now - lastRender >= 66) {
      state.showNoise = noiseRings;
      state.fastGround = look !== "classic";
      state.look = look;
      state.visualAtmosphere = visualAtmosphere();
      state.reduceFlicker = reduceFlicker;
      if (afterlife) View.renderAfterlife(afterlife);
      else View.render(state, now / 1000, Math.min(.2, (now - lastRender) / 1000));
      lastRender = now;
    }
    requestAnimationFrame(frame);
  }

  $("intro-btn").textContent = read(introKey) ? "Replay introduction" : "Beginner introduction";
  const canResume = Boolean(savedText || read(backupKey));
  $("continue-btn").hidden = !canResume;
  continueLabel();
  const startPoint = $("start-point");
  startPoint.innerHTML = Object.entries(Data.control.starts).map(([id, point]) => '<option value="' + id + '">' + esc(point.name) + "</option>").join("");
  startPoint.value = "shelter";
  startPoint.addEventListener("change", showStartDetail);
  const presets = $("difficulty");
  const headline = ["campaign","longhaul","relaxed","survival","harsh"];
  const presetOption = id => '<option value="' + id + '">' + Data.modes[id].name + '</option>';
  presets.innerHTML = headline.map(presetOption).join("") + '<optgroup label="More modes">' +
    Object.keys(Data.modes).filter(id => !headline.includes(id)).map(presetOption).join("") +
    '<option value="custom">Custom</option></optgroup>';
  presets.value = "survival";
  $("role").innerHTML = Object.entries(Data.roles).map(([id,role]) => '<option value="' + id + '">' + role.name + "</option>").join("");
  $("role").value = "carer";
  $("role").addEventListener("change",showStartDetail);
  $("appearance").innerHTML = appearanceOptions("male");
  $("setup-style-fields").innerHTML = survivorFields("setup",Data.character());
  $("setup-style-fields").addEventListener("change",() => updateSurvivorPreview("setup"));
  $("appearance").addEventListener("change",() => updateSurvivorPreview("setup"));
  $("trait-choices").innerHTML = Object.entries(Data.traits).sort((a,b) => b[1].points - a[1].points || a[1].name.localeCompare(b[1].name)).map(([id,t]) =>
    '<label><input type="checkbox" value="' + id + '"><span>' + t.name + ' (' + (t.points > 0 ? "−" : "+") + Math.abs(t.points) + ')<small>' +
    t.description + '</small></span></label>').join("");
  $("trait-choices").addEventListener("change",showTraitPoints);
  setSetupSurvivor(Data.character());
  try {
    const setup = JSON.parse(read(setupKey));
    if (setup) {
      if (Object.hasOwn(Data.modes, setup.customBase)) customBase = setup.customBase;
      if (setup.customRules) customRules = Data.worldRules(customBase, setup.customRules);
      if (Object.hasOwn(Data.modes, setup.preset) || setup.preset === "custom" && customRules) presets.value = setup.preset;
      if (Object.hasOwn(Data.roles, setup.role)) $("role").value = setup.role;
      if (Object.hasOwn(Data.control.starts, setup.start)) startPoint.value = setup.start;
      if (typeof setup.seed === "string" && /^\d{1,9}$/.test(setup.seed)) $("world-seed").value = setup.seed;
      setSetupSurvivor(setup.profile);
    }
  } catch { /* Ignore a damaged menu preference. */ }
  presets.addEventListener("change", () => {
    showStartDetail();
    if (presets.value === "custom" && !customRules) worldRulesEditor();
  });
  showStartDetail();
  syncSound();
  updateDisplayMode();
  updateHud();
  requestAnimationFrame(frame);
})();
