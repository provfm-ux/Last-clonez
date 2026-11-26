"use strict";

const Sim = (() => {
  let itemSerial = 0;
  const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lineOfSight = (s, a, b) => World.sees(s.world, a.x, a.y, b.x, b.y);
  const quantity = (bag, id, accepts) => bag.filter(item => item.id === id && (!accepts || accepts(item))).reduce((sum, item) => sum + item.qty, 0);
  const weight = bag => bag.reduce((sum, item) => sum + Data.items[item.id].weight * item.qty, 0);
  const capacity = s => (s.player.backpack ? 26 : 16) + Math.floor(level(s, "strength") / 2);
  const canCarryBundle = (s, bundle) => weight(s.player.bag) +
    Object.entries(bundle).reduce((sum, [id, qty]) => sum + Data.items[id].weight * qty, 0) <= capacity(s) + .00001;
  const freshMinutes = (s, item) => Data.items[item.id].perish * 1440 - s.minutes + (item.born ?? 0) + (item.cold ?? 0);
  const isSpoiled = (s, item) => Boolean(Data.items[item.id].perish && freshMinutes(s, item) <= 0);
  const roomFor = (s, id) => Math.max(0, Math.floor((capacity(s) - weight(s.player.bag) + .00001) / Data.items[id].weight));
  const reachableObject = (s, o, radius = 1.85) => o?.active && distance(s.player, o) <= radius &&
    (s.world.underground ? canSee(s,o.x,o.y) : lineOfSight(s,s.player,o));
  const lootReachable = (s, o) => o?.action === "loot" && (s.player.vehicle ? o === vehicle(s) && s.player.driveSpeed === 0 : reachableObject(s, o));
  function weapon(s) {
    const {bag, weaponUid, weapon:id} = s.player;
    const item = bag.find(item => Data.items[item.id].damage &&
      (weaponUid === undefined ? item.id === id : weaponUid !== null && item.uid === weaponUid));
    return item ?? {id:"fists", condition:100};
  }

  function unequipWeapon(s) {
    s.player.weapon = "fists";
    s.player.weaponUid = null;
  }

  const fists = {combat: "unarmed", name: "Fists", damage: 9, range: 1.05, delay: .48, effort: 5, noise: 2, wear: 0};
  const weaponData = s => Data.items[weapon(s).id] || fists;
  const level = (s, skill) => Math.min(Data.skillMax, Math.floor(Math.sqrt((s.player.skills[skill] ?? 0) / Data.skillXp(1))));
  const season = s => Data.seasons[Math.floor(s.minutes / 1440 / Data.seasonDays) % Data.seasons.length];
  function wornItem(s, slot) {
    const id = s.player.gear[slot];
    return id ? s.player.bag.find(item => item.id === id) : undefined;
  }
  const wearableCondition = item => (item?.condition ?? 100) / 100;
  const canMend = item => Boolean(Data.items[item?.id]?.warmth || Data.items[item?.id]?.guard);
  const clothingWarmth = s => Object.keys(s.player.gear).reduce((total, slot) => {
    const item = wornItem(s,slot);
    return total + (Data.items[item?.id]?.warmth ?? 0) * wearableCondition(item);
  }, 0);
  function addXp(s, skill, amount) {
    const skills = s.player.skills, before = level(s, skill);
    skills[skill] = (skills[skill] ?? 0) + amount;
    const after = level(s, skill);
    if (after > before) notify(s, Data.skills[skill].name + " reached level " + after + ".");
  }
  const windupTime = .5, bruteWindup = .18;
  const legacyWoundParts = new Map([["Braço", "arm"], ["Perna", "leg"]]);
  const legacyWoundTypes = new Map([["mordida", "bite"], ["corte", "cut"], ["arranhão", "scratch"]]);
  const legacyDropNames = new Map([
    ["No chão", "On the ground"], ["Tábua recuperada", "Recovered plank"], ["Madeira cortada", "Chopped wood"],
    ["Mobiliário desmontado", "Dismantled furniture"], ["Infetado caído", "Fallen infected"]
  ]);
  const dropNames = new Set([...legacyDropNames.values(),"Recovered stone"]);
  const builtNames = new Map(Data.recipes.filter(recipe => recipe.build && !recipe.material).map(recipe => [recipe.build, recipe.name]));
  const utilityIds = new Set(["shelter-tap", "shelter-generator"]);
  const beamLimit = Math.cos(Data.flashlight.angle);
  const individualItem = id => Data.items[id].damage || id === "flashlight" || Data.items[id].individual;
  const canBelt = id => {
    const d = Object.hasOwn(Data.items, id) && Data.items[id];
    return Boolean(d && (d.damage || d.use && d.use !== "backpack"));
  };

  function add(bag, id, qty, extra = {}) {
    if (!Data.items[id] || qty <= 0) return;
    const item = Data.items[id];
    if (individualItem(id)) {
      for (let i = 0; i < qty; i++) bag.push({id, qty:1, condition:100, born:0,
        ...(id === "flashlight" ? {charge:0} : {}), uid:Date.now().toString(36) + "-" + itemSerial++, ...extra});
      return;
    }
    const match = !item.perish && bag.find(entry => entry.id === id && (!canMend(entry) || (entry.condition ?? 100) === (extra.condition ?? 100)));
    if (match) match.qty += qty;
    else bag.push({id, qty, condition: 100, born: 0, ...extra});
  }

  function remove(bag, id, qty, accepts) {
    for (const item of bag) {
      if (item.id !== id || qty <= 0 || (accepts && !accepts(item))) continue;
      const amount = Math.min(item.qty, qty);
      item.qty -= amount;
      qty -= amount;
    }
    for (let i = bag.length - 1; i >= 0; i--) if (bag[i].qty <= 0) bag.splice(i, 1);
  }

  function notify(s, text, danger = false) {
    s.messages.push({text, danger, time: s.minutes, lang: "en"});
    if (s.messages.length > 7) s.messages.shift();
    s.notice = {text, danger, until: s.elapsed + 4};
  }

  function stockGardenSeeds(s) {
    const {world} = s;
    const shelter = world.objects.find(o => o.storage && o.building === world.base.id);
    const market = world.buildings.find(b => b.type === "market");
    const shelf = world.objects.find(o => o.building === market?.id && o.kind === "shelf" && o.action === "loot");
    if (shelter?.loot && shelf?.loot) {
      add(shelter.loot, "radishseed", 2);
      add(shelf.loot, "seedpotato", 2);
      s.flags.gardenSeeded = true;
    }
  }

  function prepareSupplies(world, rules) {
    const roll = Level.seeded(world.seed ^ 0x2545f491);
    for (const o of world.objects) {
      if (o.storage || !o.loot) continue;
      o.loot = o.loot.flatMap(item => {
        const scaled = item.qty * rules.loot / 100;
        const essential = item.id === "part" || item.id === "fuel" || item.id === "rod";
        const qty = Math.max(essential ? 1 : 0, Math.floor(scaled) + Number(roll() < scaled % 1));
        if (!qty) return [];
        if (item.id === "flashlight") {
          const lamps = [];
          add(lamps, item.id, qty);
          return lamps;
        }
        return individualItem(item.id) ? Array.from({length:qty}, () => ({...item, qty:1})) : [{...item, qty}];
      });
    }
  }

  function addUtilities(world) {
    const kitchen = world.objects.find(o => o.kind === "fridge" && o.building === world.base.id);
    const otherKitchen = world.objects.find(o => o.kind === "fridge" && o.building !== world.base.id);
    if (kitchen) {
      kitchen.name = "Shelter fridge";
      add(kitchen.loot, "emptybottle", 1);
      add(kitchen.loot, "raincoat", 1);
    }
    if (otherKitchen) add(otherKitchen.loot, "raincoat", 1);
    const addFixture = (id, x, y, kind, name, data) => {
      const t = World.tileAt(world, x, y);
      world.objects.push({id, x, y, kind, name, action:kind, zone:t.zone, building:t.building,
        active:true, solid:false, tint:.5, ...data});
    };
    addFixture("shelter-tap", 6.5, 43.5, "tap", "Kitchen tap", {reserve:Data.utilities.tapReserve});
    addFixture("shelter-generator", 13.5, 45.5, "generator", "Shelter generator", {fuel:0, running:false, nextNoise:0});
  }

  function stockFieldGear(world) {
    const police = world.buildings.find(b => b.type === "police");
    police.door.locked = true;
    police.door.alarmArmed = true;
    for (const b of world.buildings.filter(b => b.type === "home" && b.h === 7)) {
      world.objects.find(o => o.building === b.id && o.kind === "window").latched = true;
    }
    const cars = world.objects.filter(o => o.kind === "car");
    const nearest = cars.sort((a, b) => distance(a, police.door) - distance(b, police.door))[0];
    add(nearest.loot, "policekey", 1);
    const workshop = world.buildings.find(b => b.type === "workshop");
    const toolbox = world.objects.find(o => o.building === workshop.id && o.action === "loot");
    add(toolbox.loot, "crowbar", 1);
    add(toolbox.loot, "flashlight", 1);
    add(toolbox.loot, "battery", 2);
    const crate = world.objects.find(o => o.storage && o.building === world.base.id);
    add(crate.loot, "battery", 1);
    const finds = [["workshop","wrench"],["workshop","hatchet"],["market","rollingpin"],
      ["market","broom"],["fuel","pipe"]];
    for (const [type,id] of finds) {
      const site = world.buildings.find(b => b.type === type);
      const storage = world.objects.find(o => o.building === site.id && o.action === "loot");
      add(storage.loot,id,1);
    }
    const kitchen = world.objects.find(o => o.kind === "fridge" && o.building === world.base.id);
    add((kitchen ?? crate).loot,"fryingpan",1);
  }

  function placeStartingBat(s) {
    const item = s.player.bag.findIndex(i => i.id === "bat");
    if (item < 0 || !drop(s,item)) return;
    const {x,y} = s.player;
    const pile = s.world.objects.at(-1);
    const point = [[1,0],[0,1],[-1,0],[0,-1]].map(([dx,dy]) => ({x:x+dx,y:y+dy})).find(p =>
      World.clear(s.world,p.x,p.y) && !s.world.objects.some(o => o.active && distance(o,p) < .65));
    if (point) Object.assign(pile,point);
    unequipWeapon(s);
    notify(s,"A wooden bat lies nearby. Pick it up and equip it in your inventory.");
  }

  function stockSkillBooks(world) {
    if (world.region !== Regions.home || world.booksStocked) return;
    const shelter = world.objects.find(o => o.storage && o.building === world.base?.id);
    for (const [index,[id,book]] of Object.entries(Data.skillBooks).entries()) {
      const sites = world.buildings.filter(b => b.type === book.site);
      const site = sites.length ? sites[index % sites.length] : null;
      const container = (site && world.objects.find(o => o.building === site.id && o.action === "loot")) || shelter;
      if (container) add(container.loot,id,1);
    }
    world.booksStocked = true;
  }

  const shelterRoad = {x:29.5,y:40.5,name:"Shelter road"};
  const longHaulCache = "longhaul-ridge-supplies";
  const longHaulFields = ["cleared","supplied","returned","water","power","harvest","complete"];
  const newLongHaul = () => ({days:0,...Object.fromEntries(longHaulFields.map(key => [key,false]))});

  function stockLongHaul(world, seed) {
    if (world.region === Regions.home) {
      const crate = world.objects.find(o => o.storage && o.building === world.base.id);
      for (const [item,count] of Object.entries({watch:1,wood:11,scrap:2,tape:1,nails:4,cloth:3,
        food:7,water:4,seedpotato:2,axe:1,bandage:3})) add(crate.loot,item,count);
      const rng = Level.seeded(seed ^ 0x38caf162);
      for (const dx of [-1,0,1]) {
        const x = shelterRoad.x+dx, y = shelterRoad.y;
        if (World.clear(world,x,y) && !world.enemies.some(z => distance(z,{x,y}) < 1)) {
          world.enemies.push(World.infected(world,"road-walker-"+dx,x,y,"walkers",rng,"resident"));
        }
      }
    } else if (world.region === "ridge") {
      const exit = world.objects.find(o => o.id === "exit-" + Regions.home);
      const spot = world.tiles.filter(t => !t.building && !t.baseSolid)
        .map(t => ({x:t.x+.5,y:t.y+.5})).filter(point => distance(exit,point) >= 3 && distance(exit,point) <= 7)
        .sort((a,b) => distance(exit,a)-distance(exit,b))
        .find(point => World.clear(world,point.x,point.y) && !world.objects.some(o => distance(o,point) < .7));
      if (!spot) throw new Error("The guided supply cache has no clear site.");
      const loot = [];
      for (const [item,count] of Object.entries({fuel:4,food:7,wood:4,tape:1})) add(loot,item,count);
      world.objects.push({id:longHaulCache,...spot,building:null,zone:World.tileAt(world,spot.x,spot.y).zone,
        kind:"crate",name:"Ridge supply cache",action:"loot",active:true,solid:false,searched:false,loot});
    }
  }

  function stockStoneMaterials(world) {
    if (!["quarry","highmoor"].includes(world.region)) return;
    const building = world.buildings.find(b => b.name === (world.region === "quarry" ? "Crusher shed" : "Stonecutters Hut"));
    if (!building) return;
    const stash = world.objects.find(o => o.building === building.id && o.action === "loot" &&
      (world.region !== "quarry" || o.name === "Spare parts"));
    if (!stash) return;
    for (const [id,qty] of Object.entries({flint:6,rubble:6,mortar:3})) add(stash.loot,id,qty);
  }

  const pantryStock = {
    coldvale:[
      ["base",{oats:2,flour:2,cannedbeans:2,herbs:1}],
      ["market",{oats:4,flour:4,cannedbeans:4,lentils:4,herbs:3,honey:3}]
    ],
    fields:[["Orchard farmhouse",{oats:3,flour:3,lentils:3,honey:3}]],
    coast:[["Net shed",{cannedbeans:3,lentils:2,herbs:4}]],
    southbank:[["Night Bakery",{oats:4,flour:5,honey:3}],["Union Kitchen",{cannedbeans:3,lentils:4,herbs:3}]],
    farfields:[["Common Kitchen",{oats:3,flour:4,cannedbeans:3,lentils:4,herbs:3,honey:3}]]
  };

  function stockPantry(world, rules) {
    for (const [landmark,stock] of pantryStock[world.region] ?? []) {
      const building = landmark === "base" ? world.base :
        world.buildings.find(b => b.name === landmark || b.type === landmark);
      if (!building) continue;
      const containers = world.objects.filter(o => o.building === building.id && o.action === "loot" &&
        o.active && o.kind !== "car" && (landmark !== "base" || o.kind === "crate" && o.storage));
      if (!containers.length) continue;
      for (const [index,[id,qty]] of Object.entries(stock).entries()) {
        const count = Math.max(1,Math.round(qty * rules.loot / 100));
        add(containers[index % containers.length].loot,id,count);
      }
    }
  }

  const coverageCrate = o => o.id.startsWith("coverage-");
  const coverageDistance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
  const coverageOffsets = [[3,1],[-3,1],[2,4],[-2,4],[5,2],[-5,2],[1,6],[-1,6],[4,-2],[-4,-2]];
  const roadsideSupplies = ["food","water","cloth","wood","bandage"];

  function balanceExploration(world, difficulty) {
    world.coverage = true;
    if (world.underground || world.region === "cinema" || world.generator < 3) return;
    const sites = world.buildings.map(b => b.door).filter(door => door && coverageDistance(door,world.start) > 12);
    const rng = Level.seeded((world.seed ^ 0x74b39e17) >>> 0);
    const ordered = sites.map(site => ({site,order:rng()})).sort((a,b) => a.order-b.order).map(({site}) => site);
    const loot = world.objects.filter(o => o.active && o.action === "loot" && o.loot?.length);
    const used = new Set(world.objects.map(o => Math.floor(o.x)+":"+Math.floor(o.y)));
    const enemies = world.enemies;
    const nearbyInfected = (enemy,site) => coverageDistance(enemy,site) <= 9;
    const occupied = point => enemies.some(z => coverageDistance(z,point) < 1.2);
    const candidate = (site, avoid, startBuffer = 12) => {
      const offset = Math.floor(rng()*coverageOffsets.length);
      for (let i=0; i<coverageOffsets.length; i++) {
        const [dx,dy] = coverageOffsets[(i+offset)%coverageOffsets.length];
        const x = Math.floor(site.x+dx)+.5, y = Math.floor(site.y+dy)+.5;
        const t = World.tileAt(world,x,y), point = {x,y};
        if (!t || x<=1 || y<=1 || x>=world.width-1 || y>=world.height-1 || t.building ||
            used.has(t.x+":"+t.y) || !World.clear(world,x,y,.28) || occupied(point) ||
            coverageDistance(world.start,point)<=startBuffer || avoid && coverageDistance(avoid,point)<2) continue;
        if (World.route(world,world.start.x,world.start.y,x,y,0,true).length) return {t,x,y};
      }
      return null;
    };
    const infectedBuffer = world.region === Regions.home ? 34 : 18;
    let moved = 0;
    for (const site of ordered) {
      let crate;
      if (!loot.some(o => coverageDistance(o,site)<=8)) {
        const point = candidate(site);
        if (point) {
          const {t,x,y} = point;
          const item = roadsideSupplies[Math.floor(rng()*roadsideSupplies.length)];
          crate = {id:"coverage-"+site.id,x,y,zone:t.zone,building:null,kind:"crate",name:"Roadside supplies",
            active:true,solid:false,action:"loot",searched:false,loot:[{id:item,qty:1}]};
          world.objects.push(crate);
          loot.push(crate);
          used.add(t.x+":"+t.y);
        }
      }
      if (difficulty === "longhaul" || moved >= Math.ceil(enemies.length/3) || enemies.some(z=>nearbyInfected(z,site))) continue;
      const point = candidate(site,crate,infectedBuffer);
      if (!point) continue;
      const donor = enemies.find(z => !z.dormant && z.origin !== "resident" &&
        (world.region !== Regions.home || coverageDistance(z,world.start)>infectedBuffer) &&
        ordered.every(other => !nearbyInfected(z,other) || nearbyInfected(point,other) ||
          enemies.some(guard => guard !== z && nearbyInfected(guard,other))));
      if (!donor) continue;
      const {x,y} = point;
      Object.assign(donor,{x,y,homeX:x,homeY:y,chaseX:x,chaseY:y});
      moved++;
    }
  }

  const routeCrate = o => o.id.startsWith("coverage-route-");
  const routeCrateLimit = 10;

  function stockTravelRoutes(world, rules, difficulty) {
    world.routeCoverage = true;
    world.basePopulation = world.initialPopulation;
    if (world.underground || world.region === "cinema" || world.generator < 3) return;
    const exits = world.objects.filter(o => o.action === "travel");
    const doors = world.buildings.map(b => b.door).filter(Boolean);
    const connected = [world.start];
    const paths = exits.map(exit => World.route(world,world.start.x,world.start.y,exit.x,exit.y,1,true));
    // Connect each group of nearby buildings to the network. Crossings get their own paths.
    for (const door of doors) {
      const nearest = connected.reduce((a,b) => coverageDistance(a,door)<=coverageDistance(b,door) ? a : b);
      if (coverageDistance(nearest,door)>15) paths.push(World.route(world,nearest.x,nearest.y,door.x,door.y,1,true));
      connected.push(door);
    }
    const rng = Level.seeded((world.seed ^ 0x19cdb432) >>> 0);
    const loot = world.objects.filter(o => o.active && o.action === "loot" && o.loot?.length);
    const occupied = new Set(world.objects.map(o => Math.floor(o.x)+":"+Math.floor(o.y)));
    const buffer = world.region === Regions.home ? 34 : 18;
    const patrolLimit = difficulty === "longhaul" || !rules.count ? 0 : Math.min(6,Math.ceil(world.enemies.length*.3));
    let crates = 0, patrols = 0;
    const stops = new Map();
    for (const path of paths) for (let i=8;i<path.length-5;i+=8) {
      const point = path[i], tile = World.tileAt(world,point.x,point.y);
      if (!tile || tile.building || point.x>=world.width-1 || point.y>=world.height-1 || coverageDistance(point,world.start)<=12 ||
          !World.clear(world,point.x,point.y,.28)) continue;
      stops.set(tile.x+":"+tile.y,{point,tile});
    }
    // Fill the longest gaps first so intersecting routes can share a cache or patrol.
    const scored = [...stops.entries()].map(([key,stop]) => ({key,...stop,
      gap:loot.reduce((n,o)=>Math.min(n,coverageDistance(o,stop.point)),Infinity)}));
    scored.sort((a,b)=>b.gap-a.gap);
    for (const {key,point,tile} of scored) {
      if (crates>=routeCrateLimit && patrols>=patrolLimit) break;
      if (occupied.has(key)) continue;
      if (crates<routeCrateLimit && !loot.some(o=>coverageDistance(o,point)<=12) &&
          !world.enemies.some(z=>coverageDistance(z,point)<1.2)) {
        const item = roadsideSupplies[Math.floor(rng()*roadsideSupplies.length)];
        const crate = {id:"coverage-route-"+tile.x+"-"+tile.y,...point,zone:tile.zone,building:null,kind:"crate",
          name:"Abandoned travel supplies",active:true,solid:false,action:"loot",searched:false,loot:[{id:item,qty:1}]};
        world.objects.push(crate);
        loot.push(crate);
        occupied.add(key);
        crates++;
        continue;
      }
      if (patrols>=patrolLimit || coverageDistance(point,world.start)<=buffer ||
          world.enemies.some(z=>coverageDistance(z,point)<=11)) continue;
      world.enemies.push(World.infected(world,"route-"+tile.x+"-"+tile.y,point.x,point.y,rules.mix,rng,"route"));
      patrols++;
    }
    world.initialPopulation = world.enemies.length;
  }

  const dailyKeys = ["walker","runner","brute","attacks","hits","loot","gathered","crafted","cooked","crossings"];
  const reportLimit = 45;
  const runDay = minutes => Math.floor(minutes/1440)+1;
  const newDaily = day => ({day,...Object.fromEntries(dailyKeys.map(key=>[key,0]))});
  const recordDaily = (s,key,count=1) => { s.daily[key] += count; };

  function closeDaily(s) {
    const day = runDay(s.minutes);
    if (day === s.daily.day) return;
    s.dailyHistory.push(s.daily);
    if (s.dailyHistory.length > reportLimit) s.dailyHistory.shift();
    const done = s.daily, kills = done.walker + done.runner + done.brute;
    const parts = [[kills,"infected down"],[done.loot,"items looted"],[done.gathered,"gathered"],[done.cooked + done.crafted,"made"]]
      .filter(([n]) => n > 0).map(([n,label]) => n + " " + label);
    s.daily = newDaily(day);
    notify(s,"Day "+(day-1)+" complete: "+(parts.length ? parts.join(", ") : "a quiet day")+". Full summary in the journal.");
  }

  // Test shortcuts (HISTORIA.md section 16). Training mode only, unless a headless test passes {anyMode:true}.
  function testJump(s, day, items = {}, options = {}) {
    if (s.difficulty !== "training" && !options.anyMode) return false;
    if (!Number.isInteger(day) || day < runDay(s.minutes)) return false;
    s.minutes = (day - 1) * 1440 + s.minutes % 1440;
    closeDaily(s);
    for (const [id, qty] of Object.entries(items)) add(s.player.bag, id, qty, {born:s.minutes});
    return true;
  }
  // Runs the simulation for the given in-game minutes without waiting in real time.
  function fastForward(s, minutes, input) {
    const end = s.minutes + minutes;
    while (s.mode === "play" && end - s.minutes > .000001) tick(s, Math.min(.25, (end - s.minutes) / s.rules.clock), input);
    return s;
  }

  function restoreDaily(s, data) {
    const day = runDay(data.minutes);
    const valid = entry => entry && Number.isSafeInteger(entry.day) && entry.day >= 1 &&
      dailyKeys.every(key=>Number.isSafeInteger(entry[key]) && entry[key]>=0 && entry[key]<=1e9);
    const history = data.dailyHistory === undefined ? [] : data.dailyHistory;
    if (!Array.isArray(history) || history.length>reportLimit ||
        history.some((entry,i)=>!valid(entry) || entry.day>=day || i>0 && history[i-1].day>=entry.day) ||
        data.daily !== undefined && (!valid(data.daily) || data.daily.day!==day)) throw new Error("Invalid daily summary.");
    const copy = entry => ({day:entry.day,...Object.fromEntries(dailyKeys.map(key=>[key,entry[key]]))});
    s.daily = data.daily === undefined ? newDaily(day) : copy(data.daily);
    s.dailyHistory = history.map(copy);
  }

  function create(seed, difficulty = "survival", role = "carer", generator = 2, options, region = Regions.home, profile) {
    const rules = Data.worldRules(difficulty, options);
    const world = World.build(seed, difficulty, generator, rules, region);
    prepareSupplies(world, rules);
    const town = region === Regions.home;
    if (town) {
      addUtilities(world);
      stockFieldGear(world);
      stockSkillBooks(world);
    }
    if (region === "cinema") {
      const rng = Level.seeded(seed ^ 0x3beb2d58);
      world.cinema = Regions.cinemaOutcome(seed);
      if (rules.count && world.cinema === "winner") {
        const z = World.infected(world,"cinema-winner",13.5,7.5,"walkers",rng,"cinema-winner");
        z.outfit = "hiker";
        Object.assign(z,{homeX:13.5,homeY:8.5});
        world.enemies.push(z);
      }
      if (rules.count && ["projector","noise"].includes(world.cinema)) {
        const sleepers = [[11.5,10.5],[16.5,12.5],[10.5,14.5]].slice(0,2+Number(rng() < .5));
        for (const [i,[x,y]] of sleepers.entries()) {
          const z = World.infected(world,"cinema-sleeper-"+i,x,y,"walkers",rng,"cinema-sleeper");
          z.dormant = true;
          world.enemies.push(z);
        }
      }
      if (difficulty === "campaign") world.objects.push({id:"cinema-statue",kind:"statue",name:"Golden idol",action:"cinema-statue",
        x:11.5,y:5.5,building:world.buildings[0].id,zone:world.buildings[0].id,tint:.7,active:true,solid:false});
      if (world.cinema === "trophy" || !rules.count && world.cinema === "winner") {
        world.objects.push({id:"cinema-trophy",kind:"crate",name:"Abandoned prize case",x:20.5,y:7.5,
          building:world.buildings[0].id,zone:world.buildings[0].id,tint:.65,active:true,solid:false,action:"loot",searched:false,
          loot:[{id:"raffletrophy",qty:1,condition:100}]});
      }
    }
    Chronicle.place(world);
    Atmosphere.place(world);
    // Place new evidence after existing fixtures so old saves retain their coordinates.
    Chronicle.place(world, true);
    if (region === "ridge" || world.underground) {
      const exit = world.objects.find(o => o.id === (world.underground ? "exit-ridge" : "exit-" + Regions.cavern));
      const x = exit.x + 1, y = exit.y - (world.underground ? 1 : 0);
      const loot = [];
      if (!world.underground) add(loot,"flashlight",1,{charge:Data.flashlight.starter});
      add(loot,"battery",world.underground ? 1 : 2);
      world.objects.push({id:world.underground ? "grotto-spares" : "cave-gear", x,y,zone:World.tileAt(world,x,y).zone,building:null,
        kind:"crate",name:world.underground ? "Rope landing cache" : "Survey gear box",action:"loot",tint:.64,active:true,solid:false,storage:true,searched:false,loot});
    }
    if (difficulty === "longhaul") stockLongHaul(world,seed);
    World.sync(world);
    FieldStories.place(world);
    stockStoneMaterials(world);
    stockPantry(world,rules);
    balanceExploration(world,difficulty);
    stockTravelRoutes(world,rules,difficulty);
    const bag = [];
    for (const [id, qty] of [["bat", 1], ["bandage", 2], ["cloth", 2], ["food", 2], ["water", 2], ["jeans", 1], ["boots", 1]]) add(bag, id, qty);
    for (const [id,qty] of Object.entries(Data.roles[role]?.kit ?? {})) add(bag,id,qty);
    add(bag, "flashlight", 1, {charge:Data.flashlight.starter});
    const s = {
      schema: Data.saveVersion, seed, difficulty, role, rules, world, regionStates:{}, mode: "play", elapsed: 0, minutes: rules.startHour * 60, controlStart: null,
      player: {...world.start, ...Data.character(profile), hp: 100, stamina: 100, hunger: 92, hydration: 92, fatigue: 8, panic: 0, pain: 0, sick: 0, grabbed: 0, grabCool: 0, fracture: 0, splinted: false,
        bag, weapon: "bat", weaponUid: bag[0].uid, backpack: false, gear: {head: null, hands: null, wrist: null, arms: null, body: null, legs: "jeans", feet: "boots"}, wounds: [], exposure: 0, medicine: 0,
        wetness:0, temperature:37, pinned:[], belt:[...Data.beltDefaults], lightUid:null, headingX:0, headingY:1,
        skills: Object.fromEntries(Object.keys(Data.skills).map(k => [k, 0])), path: [], face: 1, flash: 0, swing: 0,
        cooldown: 0, staminaDelay: 0, footstep: 0, moving: false, resting: false,
        vehicle: null, driveSpeed: 0, velocityX: 0, velocityY: 0},
      quiet: false, running: false, dash: false, target: null, interaction: null, replan: 0,
      aim: 0, effects: [], kills: 0, messages: [], clues: [], supplyRun: "search", notice: null, serial: 0, blueprint: null, mapPins:[], ledger:Chronicle.empty(),
      atmosphere:Atmosphere.create(world,rules.hordes),sounds:[],
      flags: {barricade: false, supplies: false, rescued: false, radio: false, water: false,
        gardenSeeded: false, harvested: false, gardenMeal: false, gardenHelp: false}, nextEvent: 180, weather: "Overcast",
      exploredAt: 0, radioWave: false, zoom: 1, waypoint: town ? "market" : world.underground ? "exit-ridge" : "exit-" + (Regions.definitions[region].host ?? Regions.home), lookahead: true, roofsHidden: false
    };
    if (difficulty === "campaign") {
      s.campaign = newCampaign();
      if (town) {
        placeCampaignPages(world, seed);
        s.campaign.completed.push("radio.rumour");
        CampaignHints.track(s.campaign.hints, "coldvale.houses", s.minutes);
      }
    }
    if (difficulty === "longhaul") {
      s.longHaul = newLongHaul();
      s.waypoint = "";
      s.atmosphere.nextWave = Math.max(s.atmosphere.nextWave,360);
    }
    s.daily = newDaily(runDay(s.minutes));
    s.dailyHistory = [];
    s.weather = localWeather(s);
    explore(s);
    if (town) {
      stockGardenSeeds(s);
      notify(s, "87.6 FM · Keep your doors shut. The dead are getting up.");
      notify(s, "The shelter crate holds supplies. Open your inventory to collect them.");
      if (s.campaign) notify(s, Data.campaignText.rumour);
    }
    return s;
  }

  function createControl(difficulty, role, startId, options, profile) {
    if (!Object.hasOwn(Data.control.starts, startId)) throw new Error("Choose a starting point on the control map.");
    const seed = Number.isInteger(profile?.seed) && profile.seed >= 0 && profile.seed <= 999999999 ? profile.seed : Data.control.seed;
    const s = create(seed, difficulty, role, Expedition.generator, options, Regions.home, profile);
    s.controlStart = startId;
    if (startId === "shelter") {
      placeStartingBat(s);
      return s;
    }
    const start = Data.control.starts[startId];
    const entrance = s.world.buildings.find(b => b.type === start.type)?.door;
    if (!entrance) throw new Error("The selected landmark is missing.");
    const offsets = [[0, 1], [0, 2], [-1, 1], [1, 1], [-2, 2], [2, 2]];
    const point = offsets.map(([dx, dy]) => ({x: entrance.x + dx, y: entrance.y + dy}))
      .find(p => !World.tileAt(s.world, p.x, p.y)?.building && World.clear(s.world, p.x, p.y));
    if (!point) throw new Error("The entrance has no clear starting tile.");
    Object.assign(s.player, point);
    const nearbyEnemies = s.world.enemies.filter(z => distance(z, point) <= 3);
    if (nearbyEnemies.length) {
      const occupied = new Set(s.world.enemies.map(z => World.tileAt(s.world, z.x, z.y)));
      const open = s.world.tiles.filter(t => !t.building && !t.solid && !occupied.has(t)).map(t => ({x:t.x + .5, y:t.y + .5}));
      const clear = open.filter(p => distance(p, point) >= 6 && distance(p, World.start) > 12)
        .sort((a,b) => distance(a, point) - distance(b, point));
      for (const [index, enemy] of nearbyEnemies.entries()) {
        const {x, y} = clear[index];
        Object.assign(enemy, {x, y, homeX:x, homeY:y, chaseX:x, chaseY:y});
        if (enemy.origin === "resident") {
          delete enemy.origin;
          delete enemy.dormant;
        }
        enemy.outfit = World.infectedOutfit(s.world, enemy);
      }
    }
    s.world.explored.fill(0);
    explore(s);
    s.waypoint = "base";
    s.messages.pop();
    notify(s, start.detail + " Your shelter is marked on the map.");
    placeStartingBat(s);
    return s;
  }

  const playtestMoments = ["tutorialSkip", "move", "pickup", "equip", "fight", "heal", "death"];
  const firstNightEnd = 1440 + 390;
  const assist = (s, id) => s.difficultyOptions?.assists[id] === true;
  const pressure = s => Data.pressureLevels[s.difficultyOptions?.pressure] ?? 1;
  const firstNight = s => s.guideStep !== undefined && !s.firstSleep && s.minutes < firstNightEnd;
  const regionalDamage = (s, region) => s.difficultyOptions && Object.hasOwn(Expedition.districts, region) ? 1.15 : 1;
  const infectedDamage = (s, region = s.world.region) => s.rules.damage / 100 * pressure(s) * regionalDamage(s, region) *
    (s.difficultyOptions && firstNight(s) && region === Regions.home ? .6 : 1);
  const staminaCost = s => assist(s, "stamina") ? .7 : 1;

  function difficultyOptions(s, settings = {}, previous = s.difficultyOptions) {
    const assists = Object.fromEntries(Object.keys(Data.assistFields).map(id => [id, settings[id] === true]));
    const aim = ["off","light","strong"].includes(settings.aim) ? settings.aim : "off";
    const director = typeof settings.director === "boolean" ? settings.director :
      previous?.director ?? ["relaxed","survival"].includes(s.difficulty);
    return {assists, aim, director,
      pressure:Object.hasOwn(Data.pressureLevels, settings.pressure) ? settings.pressure : "standard"};
  }

  function setDifficulty(s, settings, confirmed = false) {
    if (s.mode !== "play") return false;
    const old = s.difficultyOptions ?? difficultyOptions(s, {director:false});
    const next = difficultyOptions(s, settings, old);
    if (Data.pressureLevels[next.pressure] > Data.pressureLevels[old.pressure] && !confirmed) return false;
    const changes = [];
    for (const id of Object.keys(Data.assistFields)) {
      if (old.assists[id] !== next.assists[id]) changes.push(id + " " + (next.assists[id] ? "on" : "off"));
    }
    for (const id of ["aim","director","pressure"]) {
      if (old[id] !== next[id]) changes.push(id + " " + next[id]);
    }
    if (changes.length) {
      s.difficultyOptions = next;
      s.difficultyChanges = [...(s.difficultyChanges ?? []).slice(-19), {minute:s.minutes, changes:changes.join(", ")}];
    }
    return true;
  }

  function dangerRating(s, region) {
    const count = World.infectedCount(region, s.rules.count);
    if (!count) return "Calm";
    const threat = count * (region === Regions.home ? .45 : 1) * infectedDamage(s, region) *
      (s.rules.mix === "runners" ? 1.25 : s.rules.mix === "mixed" ? 1.1 : 1) * 100 / s.rules.loot;
    return Object.hasOwn(Expedition.districts, region) || threat >= 35 ? "Dangerous" : threat >= 12 ? "Tense" : "Calm";
  }

  function recordPlaytest(s, moment) {
    if (s.playtest) s.playtest[moment] ??= Math.round(s.elapsed * 10) / 10;
  }

  function createRecommended(seed, track = false, skipTime = null, settings = {}) {
    const s = createControl("survival", "carer", "shelter", undefined, {seed});
    s.guideStep = 0;
    s.difficultyOptions = difficultyOptions(s, {windup:true, grabs:true, bleed:true, reminder:true, stamina:true, ...settings});
    s.waypoint = "";
    if (track) {
      s.playtest = {};
      if (Number.isFinite(skipTime) && skipTime >= 0) s.playtest.tutorialSkip = Math.round(skipTime * 10) / 10;
    }
    const house = s.world.buildings.filter(b => b.type === "home")
      .sort((a, b) => distance(s.world.base.door, a.door) - distance(s.world.base.door, b.door))
      .find(b => s.world.objects.some(o => o.building === b.id && o.action === "loot"));
    const container = house && s.world.objects.find(o => o.building === house.id && o.action === "loot");
    if (container) add(container.loot, "bandage", 1);
    return s;
  }

  function pinnedGoal(s) {
    if ((!s.pinStory && s.guideStep === undefined) || s.flags.radio) return null;
    if (s.world.region !== Regions.home) return "Return to Cold Vale.";
    if (s.flags.rescued || s.world.npc.mode === "dead") {
      return s.hideNavigation ? "Repair the radio inside the shelter." : "Repair the shelter radio";
    }
    return s.hideNavigation ? "Find Eva. Follow the clinic signs north." : "Find Eva";
  }

  function nearby(s, radius = 1.85) {
    return s.world.objects.filter(o => reachableObject(s, o, radius));
  }

  function containers(s) {
    if (s.player.vehicle) {
      const car = vehicle(s);
      return lootReachable(s, car) ? [car] : [];
    }
    return nearby(s).filter(o => o.action === "loot").sort((a, b) => distance(s.player, a) - distance(s.player, b));
  }

  const canStore = o => o.storage || o.kind === "car" || o.kind === "fridge";
  const isEquipped = (s, item) => weapon(s) === item || wornItem(s,Data.items[item.id].slot) === item ||
    item.id === "flashlight" && item.uid && item.uid === s.player.lightUid;
  const isBarrier = o => o?.kind === "fence" || o?.kind === "gate";
  const itemState = item => ({condition:item.condition ?? 100, born:item.born ?? 0, cold:item.cold ?? 0,
    ...(item.id === "flashlight" ? {charge:item.charge ?? 0} : {}),
    ...(item.id === "housekey" ? {lock:item.lock, label:item.label, uid:item.uid} : {})});

  function unreadClueAt(s, o) {
    if (o.action !== "loot" || !o.building || o.id.startsWith("built")) return null;
    const building = s.world.buildings.find(b => b.id === o.building);
    const id = building?.base ? (o.storage ? "shelter" : null) : building?.type;
    return Data.story[id]?.field && !s.clues.includes(id) ? id : null;
  }

  function nearbyClues(s) {
    if (s.player.vehicle) return [];
    return [...new Set(containers(s).map(o => unreadClueAt(s, o)).filter(Boolean))];
  }

  function readClue(s, id) {
    if (!nearbyClues(s).includes(id)) return false;
    s.clues.push(id);
    return true;
  }

  function isSupplyCache(s, o) {
    return Boolean(s.flags.radio && s.supplyRun === "search" && o.active && o.kind === "locker" && o.action === "loot" &&
      s.world.buildings.some(b => b.id === o.building && b.type === "fuel"));
  }

  function nearbySupplyCache(s) {
    return !s.player.vehicle && containers(s).some(o => isSupplyCache(s, o));
  }

  const canCarryCache = s => canCarryBundle(s, Data.supplyCache);

  function collectSupplyCache(s) {
    if (!nearbySupplyCache(s)) return false;
    if (!canCarryCache(s)) {
      notify(s, "Make room for Mara’s supplies first.", true);
      return false;
    }
    for (const [id, qty] of Object.entries(Data.supplyCache)) add(s.player.bag, id, qty);
    s.supplyRun = "return";
    notify(s, "Cache collected. Check in at the shelter radio.");
    return true;
  }

  function sources(s) {
    return [s.player.bag, ...containers(s).filter(o => o.searched).map(o => o.loot)];
  }

  function available(s, id) {
    return sources(s).reduce((sum, bag) => sum + quantity(bag, id, item => !isSpoiled(s, item)), 0);
  }

  function consume(s, inputs) {
    const bags = sources(s), fresh = item => !isSpoiled(s, item);
    if (Object.entries(inputs).some(([id, count]) => bags.reduce((sum, bag) => sum + quantity(bag, id, fresh), 0) < count)) return false;
    for (const [id, count] of Object.entries(inputs)) {
      let remaining = count;
      for (const bag of bags) {
        const amount = Math.min(remaining, quantity(bag, id, fresh));
        remove(bag, id, amount, fresh);
        remaining -= amount;
      }
    }
    return true;
  }

  function collect(s, object, index, all = false, silent = false) {
    if (!lootReachable(s, object)) return 0;
    const item = object.loot[index];
    if (!item) return 0;
    const amount = Math.min(item.qty, roomFor(s, item.id), all ? Infinity : 1);
    if (amount <= 0) {
      if (!silent) notify(s, "Inventory full. Store or drop some items.", true);
      return 0;
    }
    add(s.player.bag, item.id, amount, itemState(item));
    recordDaily(s,"loot",amount);
    if (item.id === "housekey") notify(s, "Key tag: \u201c" + item.label + "\u201d. It opens that house.");
    item.qty -= amount;
    if (!item.qty) object.loot.splice(index, 1);
    object.searched = true;
    if (s.longHaul && object.id === longHaulCache && item.id === "fuel" && !s.longHaul.supplied) {
      s.longHaul.supplied = true;
      notify(s,"Supplies secured. Bring that fuel home. You’re giving this shelter a second chance.");
    }
    recordPlaytest(s, "pickup");
    if (s.guideStep === 0 && item.id === "bat") s.guideStep = 1;
    if ((s.guideStep === 2 || s.guideStep === 3) &&
        s.world.buildings.some(b => b.id === object.building && b.type === "home")) {
      s.guideStep = item.id === "bandage" ? 4 : 3;
    }
    return amount;
  }

  function collectAll(s, source = null, matches = () => true) {
    let total = 0, left = 0;
    for (const o of containers(s)) {
      if (source && o !== source) continue;
      o.searched = true;
      for (let i = 0; i < o.loot.length;) {
        const item = o.loot[i], qty = item.qty;
        if (!matches(item)) { i++; continue; }
        const taken = collect(s, o, i, true, true);
        total += taken;
        left += qty - taken;
        if (taken < qty) i++;
      }
    }
    notify(s, (total ? "Collected " + total + " " + (total === 1 ? "item." : "items.") : left ? "Inventory full." : "No items match.") +
      (left ? " " + left + " left in place due to weight." : ""), Boolean(left));
    return total;
  }

  function drop(s, index, store = false, all = false) {
    const item = s.player.bag[index];
    if (!item) return 0;
    const wasEquipped = Data.items[item.id].damage && weapon(s) === item;
    const slot = Data.items[item.id].slot;
    const wasWorn = slot && wornItem(s,slot) === item;
    const qty = all ? item.qty : 1;
    if (store) {
      const target = containers(s).find(o => canStore(o) && (store === true || store === o));
      if (!target) { notify(s, "Move closer to a crate, fridge or car boot.", true); return 0; }
      add(target.loot, item.id, qty, itemState(item));
      target.searched = true;
    } else {
      let pile = s.world.objects.find(o => o.kind === "drop" && distance(o, s.player) < .6);
      if (!pile) {
        pile = {id: "built" + s.serial++, x: s.player.x, y: s.player.y, kind: "drop", name: "On the ground",
          active: true, solid: false, action: "loot", searched: true, loot: []};
        s.world.objects.push(pile);
      }
      add(pile.loot, item.id, qty, itemState(item));
    }
    item.qty -= qty;
    if (!item.qty) s.player.bag.splice(index, 1);
    if (item.id === "flashlight" && item.uid === s.player.lightUid) s.player.lightUid = null;
    if (wasWorn && !item.qty) s.player.gear[slot] = null;
    if (wasEquipped) unequipWeapon(s);
    return qty;
  }

  function stash(s, target, matches = () => true) {
    if (!target || !canStore(target) || !lootReachable(s, target)) return 0;
    const p = s.player;
    const packed = p.bag.filter(item => !isEquipped(s, item) && !p.pinned.includes(item.id) && matches(item));
    let total = 0;
    for (const item of packed) total += drop(s, p.bag.indexOf(item), target, true);
    notify(s, total ? "Stored " + total + " " + (total === 1 ? "item" : "items") + " in " + target.name + "." : "No unpinned, unequipped items match.");
    return total;
  }

  function use(s, index, selectedWound) {
    const item = s.player.bag[index], p = s.player;
    if (!item) return false;
    const data = Data.items[item.id];
    if (item.id === "flashlight") return toggleLight(s, item);
    if (data.slot) {
      const worn = wornItem(s,data.slot) === item;
      p.gear[data.slot] = worn ? null : item.id;
      if (!worn) {
        const first = p.bag.findIndex(other => other.id === item.id);
        if (first !== index) [p.bag[first],p.bag[index]] = [item,p.bag[first]];
        recordPlaytest(s, "equip");
      }
      notify(s, (worn ? "Removed " : "Equipped ") + data.name.toLocaleLowerCase("en") + ".");
      return true;
    }
    if (data.damage) {
      p.weapon = item.id;
      p.weaponUid = item.uid;
      recordPlaytest(s, "equip");
      if (s.guideStep === 1 && item.id === "bat") s.guideStep = 2;
      notify(s, data.name + " equipped.");
      return true;
    }
    if (data.use === "book") {
      if (p.readBooks?.includes(item.id)) { notify(s,"You already studied this title."); return false; }
      if (threats(s).length || p.grabbed > 0) { notify(s,"Find a safe place to read."); return false; }
      const skill = Data.skillBooks[item.id].skill;
      (p.readBooks ??= []).push(item.id);
      addXp(s,skill,24);
      notify(s,data.name + " studied. +24 " + Data.skills[skill].name + " XP.");
      return true;
    }
    if (data.use === "food") {
      if (isSpoiled(s, item)) {
        notify(s, "This food has spoiled. Look for canned food.", true);
        return false;
      }
      if (data.toxic) {
        p.sick = Math.min(100, p.sick + 45);
        p.pain = Math.min(100, p.pain + 12);
        if (--item.qty === 0) p.bag.splice(index, 1);
        notify(s, "The mushroom leaves a bitter taste. You feel ill.", true);
        return true;
      }
      if (p.hunger >= 99 && (!data.hydration || p.hydration >= 99)) { notify(s, "You are already well fed."); return false; }
      p.hunger = Math.min(100, p.hunger + data.nutrition);
      if (data.hydration) p.hydration = Math.min(100, p.hydration + data.hydration);
    } else if (data.use === "water") {
      if (p.hydration >= 99) { notify(s, "You are already hydrated."); return false; }
      p.hydration = Math.min(100, p.hydration + 45);
      add(p.bag, "emptybottle", 1);
    } else if (data.use === "bandage") {
      const wound = selectedWound === undefined ? p.wounds.filter(w => !w.bandaged).sort((a,b) => b.bleed - a.bleed)[0] : p.wounds[selectedWound];
      if (wound?.bandaged || !wound && (s.rules.care === "gradual" || p.hp >= 100 || selectedWound !== undefined)) {
        notify(s, "No open wound to bandage."); return false;
      }
      if (wound) { wound.bandaged = true; wound.bleed = 0; }
      if (s.rules.care === "quick") p.hp = Math.min(100, p.hp + 16 * Data.roles[s.role].medical);
      addXp(s, "medical", 3);
      recordPlaytest(s, "heal");
      if (s.guideStep === 4) s.guideStep = 5;
    } else if (data.use === "disinfectant") {
      const wound = selectedWound === undefined ? p.wounds.find(w => !w.clean) : p.wounds[selectedWound];
      if (!wound || wound.clean) { notify(s, "No wound needs disinfecting."); return false; }
      wound.clean = true;
      wound.infection = 0;
      addXp(s, "medical", 2);
    } else if (data.use === "splint") {
      if (!(p.fracture > 0)) { notify(s, "Nothing is broken."); return false; }
      if (p.splinted) { notify(s, "Your leg is already splinted."); return false; }
      p.splinted = true;
      addXp(s, "medical", 6);
    } else if (data.use === "painkiller") {
      if (p.pain < 1) return false;
      p.medicine = 150;
    } else if (data.use === "backpack") {
      if (p.backpack) return false;
      p.backpack = true;
    } else return false;
    const name = itemName(s, item.id);
    item.qty--;
    if (!item.qty) p.bag.splice(index, 1);
    notify(s, name + " used.");
    return true;
  }

  function beltItem(s, id) {
    if (!canBelt(id)) return null;
    const options = s.player.bag.filter(i => i.id === id);
    if (id === "flashlight") return activeLight(s) || options.sort((a,b) => b.charge - a.charge)[0];
    if (Data.items[id].damage) return options.sort((a,b) => (b.condition ?? 100) - (a.condition ?? 100))[0];
    return options.find(item => !isSpoiled(s, item));
  }

  function setBelt(s, slot, id) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= Data.beltDefaults.length ||
        id !== null && (!canBelt(id) || !quantity(s.player.bag, id) && s.player.belt[slot] !== id)) return false;
    s.player.belt[slot] = id;
    return true;
  }

  function useBelt(s, slot) {
    const p = s.player, id = p.belt[slot];
    if (!id) return false;
    if (p.vehicle && p.driveSpeed > .15) { notify(s, "Stop the vehicle before using your belt."); return false; }
    const item = beltItem(s, id);
    if (!item) { notify(s, "No usable " + itemName(s,id).toLowerCase() + " in your pack."); return false; }
    return use(s, p.bag.indexOf(item));
  }

  function activeLight(s) {
    const p = s.player;
    return p.lightUid && !p.vehicle ? p.bag.find(i => i.id === "flashlight" && i.uid === p.lightUid && i.charge > 0) || null : null;
  }

  function replaceBattery(s, item) {
    if (item?.id !== "flashlight" || !s.player.bag.includes(item) || item.charge >= Data.flashlight.capacity) return false;
    if (!quantity(s.player.bag, "battery")) { notify(s, "You need a spare battery.", true); return false; }
    remove(s.player.bag, "battery", 1);
    item.charge = Data.flashlight.capacity;
    notify(s, "Replaced the flashlight battery.");
    return true;
  }

  function toggleLight(s, item) {
    const p = s.player;
    if (p.vehicle) { notify(s, "Exit the vehicle to use the flashlight."); return false; }
    if (p.lightUid === item.uid) {
      p.lightUid = null;
      notify(s, "Flashlight off.");
      return true;
    }
    if (!(item.charge > 0) && !replaceBattery(s, item)) return false;
    p.lightUid = item.uid;
    s.exploredAt = 0;
    notify(s, "Flashlight on.");
    return true;
  }

  const repairAmount = (s,item = weapon(s)) => 35 + 3*level(s,"crafting") +
    2*level(s,canMend(item) ? "tailoring" : "maintenance");

  function recipeProblem(s, recipe, repairItem = weapon(s)) {
    if (recipe.repair || recipe.mend) {
      if (!s.player.bag.includes(repairItem) || (repairItem.condition ?? 100) >= 100 ||
          (recipe.mend ? !canMend(repairItem) : !Data.items[repairItem.id]?.damage)) {
        return recipe.mend ? "Choose damaged clothing in Equipment." : "Choose a damaged weapon you carry.";
      }
    }
    if (recipe.tool) {
      if (!s.player.bag.some(i => i.id === recipe.tool && (i.condition ?? 100) > 0)) {
        return "Bring a usable " + Data.items[recipe.tool].name.toLowerCase() + ".";
      }
      if (s.player.vehicle || !recipe.build && !nearby(s).some(o => o.action === "workbench")) {
        return recipe.build ? "Exit the vehicle to build." : "Work within reach of a workbench.";
      }
    }
    const missing = Object.entries(recipe.inputs).filter(([id, n]) => available(s, id) < n);
    if (missing.length) return missing.map(([id, n]) => (n - available(s, id)) + " " + Data.items[id].name).join(" · ");
    if (recipe.out) {
      const freed = Object.entries(recipe.inputs).reduce((n, [id, qty]) => n + Math.min(qty, quantity(s.player.bag, id)) * Data.items[id].weight, 0);
      if (weight(s.player.bag) - freed + Data.items[recipe.out].weight * recipe.qty > capacity(s)) return "Make room in your inventory.";
    }
    return "";
  }

  function craft(s, id, repairItem = weapon(s)) {
    const recipe = Data.recipes.find(r => r.id === id);
    if (!recipe) return false;
    const problem = recipeProblem(s, recipe, repairItem);
    if (problem) { notify(s, problem, true); return false; }
    if (recipe.build) { s.blueprint = id; notify(s, "Tap a clear spot within reach to build."); return true; }
    if (!consume(s, recipe.inputs)) return false;
    if (recipe.repair || recipe.mend) {
      if (repairItem.qty > 1) {
        s.player.bag.splice(s.player.bag.indexOf(repairItem)+1,0,{...repairItem,qty:repairItem.qty-1});
        repairItem.qty = 1;
      }
      repairItem.condition = Math.min(100, repairItem.condition + repairAmount(s,repairItem));
      addXp(s, recipe.mend ? "tailoring" : "maintenance", 4);
    }
    else {
      const condition = recipe.skill ? 65 + 3.5 * level(s,recipe.skill) : 100;
      add(s.player.bag, recipe.out, recipe.qty, {born:s.minutes,condition});
      if (recipe.skill) addXp(s,recipe.skill,5);
    }
    addXp(s, "crafting", 4);
    recordDaily(s,"crafted");
    notify(s, recipe.repair || recipe.mend ? Data.items[repairItem.id].name + " repaired." : recipe.name + " completed.");
    return true;
  }

  function place(s, x, y) {
    const recipe = Data.recipes.find(r => r.id === s.blueprint);
    if (!recipe) return false;
    if (s.player.vehicle) { notify(s, "Exit the vehicle to build."); return false; }
    x = Math.floor(x) + .5; y = Math.floor(y) + .5;
    const t = World.tileAt(s.world, x, y), p = s.player, spot = {x, y};
    const barrier = recipe.build === "fence" || recipe.build === "gate";
    const occupied = s.world.objects.some(o => o.active && (o.kind !== "drop" && distance(o, spot) < .65 ||
      o.action === "door" && !isBarrier(o) && distance(o, spot) < 1.6));
    const person = [s.world.npc, ...s.world.enemies].some(actor => actor.hp > 0 && distance(actor, spot) < .75);
    if (s.world.objects.some(o => o.action === "travel" && distance(o, spot) < 4.5)) {
      notify(s, "Keep the crossing clear. Build farther from the signpost.", true);
      return false;
    }
    if (!t || t.solid || distance(p, spot) > 3 || distance(p, spot) < .8 || !lineOfSight(s, p, spot) || occupied || person ||
        recipe.build !== "crate" && t.building || recipe.build === "garden" && t.surface !== "grass") {
      notify(s, recipe.build === "garden" ? "Choose clear grass outdoors, away from doors." :
        "Choose a clear spot within reach, away from entrances. Only crates can go indoors.", true);
      return false;
    }
    const problem = recipeProblem(s,recipe);
    if (problem) { notify(s,problem,true); return false; }
    if (!consume(s, recipe.inputs)) return false;
    const structure = {id: "built" + s.serial++, x, y, kind: recipe.build, name: recipe.name,
      active: true, solid: !barrier, action: barrier ? "door" : recipe.build === "crate" ? "loot" : recipe.build,
      storage: recipe.build === "crate", searched: true, loot: []};
    if (barrier) {
      const horizontal = s.world.objects.some(o => o.active && isBarrier(o) && Math.abs(o.x - x) === 1 && o.y === y);
      const hp = recipe.material === "stone" ? 145 + 8 * level(s,recipe.skill) : recipe.build === "fence" ? 90 : 75;
      Object.assign(structure, {open:false, boards:0, hp, axis:horizontal ? "x" : "y"});
      if (recipe.material) structure.material = recipe.material;
    }
    if (recipe.build === "barrel") { structure.water = 0; structure.rawRain = true; }
    if (recipe.build === "garden") structure.garden = {crop: null, moisture: 0, growth: 0};
    s.world.objects.push(structure);
    World.sync(s.world);
    addXp(s, recipe.skill ?? "crafting", 6);
    recordDaily(s,"crafted");
    s.blueprint = null;
    notify(s, recipe.name + " built.");
    return true;
  }

  function vehicle(s) {
    return s.world.objects.find(o => o.id === s.player.vehicle && o.kind === "car" && o.active) || null;
  }

  function enterVehicle(s, car) {
    if (!car || car.kind !== "car" || s.player.vehicle || distance(s.player, car) > 2.2 ||
        !lineOfSight(s, s.player, car)) return false;
    if (car.hp <= 0) { notify(s, "The vehicle is wrecked.", true); return false; }
    const p = s.player;
    p.vehicle = car.id;
    p.lightUid = null;
    p.x = car.x; p.y = car.y; p.path = []; p.resting = false; p.driveSpeed = 0;
    p.velocityX = 0; p.velocityY = 0;
    s.target = null; s.interaction = null; s.quiet = false; s.dash = false;
    car.solid = false;
    const npc = s.world.npc;
    if (npc.mode === "follow" && npc.hp > 0 && distance(p, npc) < 3.2) {
      npc.ridingVehicle = car.id;
      npc.x = p.x; npc.y = p.y; npc.path = [];
    }
    World.sync(s.world);
    notify(s, "Steer with the stick or tap an outdoor destination. Use Brake to stop.");
    return true;
  }

  function exitVehicle(s, force = false) {
    const car = vehicle(s);
    if (!car) return false;
    let positions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]]
      .map(([dx, dy]) => ({x: car.x + dx, y: car.y + dy}))
      .filter(point => World.clear(s.world, point.x, point.y) &&
        !s.world.enemies.some(z => z.hp > 0 && distance(z, point) < .65));
    if (!positions.length) { const far = freeSpot(s, car.x, car.y, force ? 8 : 3.5); if (far) positions = [far]; }
    if (!positions.length && !force) {
      notify(s, "The exit is blocked. Move the vehicle into the open.", true);
      return false;
    }
    const p = s.player, point = positions[0] || {x: car.x, y: car.y};
    p.vehicle = null; p.x = point.x; p.y = point.y; p.path = [];
    p.driveSpeed = 0; p.velocityX = 0; p.velocityY = 0;
    const carTile = World.tileAt(s.world, car.x, car.y);
    const overlapsCar = Math.abs(point.x - carTile.x - .5) <= .68 && Math.abs(point.y - carTile.y - .5) <= .68;
    car.solid = Boolean(positions.length) && !overlapsCar;
    const npc = s.world.npc;
    if (npc.ridingVehicle === car.id) {
      const next = positions[1] || point;
      npc.ridingVehicle = null; npc.x = next.x; npc.y = next.y; npc.path = [];
    }
    World.sync(s.world);
    notify(s, "You got out of the vehicle.");
    return true;
  }

  function refuel(s, car) {
    if (!car || car.kind !== "car" || distance(s.player, car) > 2.2 || s.player.vehicle) return false;
    if (car.hp <= 0) { notify(s, "The vehicle is wrecked.", true); return false; }
    if (car.fuel >= 99) { notify(s, "The fuel tank is full."); return false; }
    if (!consume(s, {fuel: 1})) { notify(s, "You need one unit of fuel."); return false; }
    car.fuel = Math.min(100, car.fuel + 40);
    car.warnedFuel = false;
    notify(s, "Vehicle refuelled.");
    return true;
  }

  const patchMaterials = {scrap:2,tape:1};
  const vehicleRepairAmount = s => (Data.roles[s.role].vehicleRepair ?? 28) + 2 * level(s, "mechanics");

  function vehicleRepairProblem(s, car) {
    if (car?.kind !== "car" || !onFootAt(s,car)) return "Stand beside the vehicle on foot.";
    if (car.hp <= 0) return "The vehicle is wrecked.";
    if (car.hp >= 140) return "The vehicle is already in good condition.";
    if (Object.entries(patchMaterials).some(([id,qty]) => available(s,id) < qty)) return "You need two scrap and one duct tape.";
    return "";
  }

  function repairVehicle(s, car) {
    const problem = vehicleRepairProblem(s,car);
    if (problem) { notify(s,problem,true); return false; }
    if (!consume(s,patchMaterials)) return false;
    const restored = Math.min(140 - car.hp, vehicleRepairAmount(s));
    car.hp += restored;
    addXp(s, "mechanics", restored / 4);
    noise(s,car.x,car.y,8);
    notify(s,"Vehicle patched. Condition " + Math.round(car.hp / 1.4) + "%.");
    return true;
  }

  function brake(s) {
    if (!s.player.vehicle) return false;
    s.player.path = []; s.player.driveSpeed = 0; s.dash = false;
    s.player.velocityX = 0; s.player.velocityY = 0;
    return true;
  }

  function updateVehicle(s, dt, input) {
    const p = s.player, car = vehicle(s);
    if (!car || car.hp <= 0) { exitVehicle(s, true); return; }
    const manual = Boolean(input.x || input.y);
    const moving = manual || p.path.length > 0;
    const surface = World.tileAt(s.world, p.x, p.y)?.surface;
    const footing = surface === "sand" ? .64 : surface === "field" ? .78 : 1;
    const strength = manual ? Math.min(1, Math.hypot(input.x, input.y)) : 1;
    const desired = moving && car.fuel > 0 ? (input.run || s.dash ? 6.2 : 4.6) * footing * strength * (car.hp < 45 ? .7 : 1) : 0;
    const crashSpeed = p.driveSpeed;
    p.driveSpeed += clamp(desired - p.driveSpeed, -8 * dt, 4.5 * dt);
    const beforeX = p.x, beforeY = p.y;
    let wantsToMove = car.fuel > 0 && moving;
    if (car.fuel <= 0) {
      p.path = [];
      if (!car.warnedFuel) { notify(s, "Out of fuel. Exit to refuel.", true); car.warnedFuel = true; }
      p.moving = false;
    } else if (manual) {
      p.path = [];
      const target = Math.atan2(input.y - input.x * .5, input.x * .5 + input.y);
      const heading = car.heading ?? (car.axis === "x" ? Math.PI : -Math.PI / 2);
      const delta = Math.atan2(Math.sin(target - heading), Math.cos(target - heading));
      const backing = Math.abs(delta) > Math.PI * .55;
      const turn = backing ? delta - Math.sign(delta) * Math.PI : delta;
      // Turn radius is tied to wheel travel, including while reversing.
      const traction = Math.max(.4, Math.cos(turn));
      const step = p.driveSpeed * dt * traction * (backing ? -.65 : 1);
      const maxTurn = Math.abs(step) / 1.35;
      const angle = heading + clamp(turn, -maxTurn, maxTurn);
      wantsToMove = Math.abs(step) > .0001;
      p.moving = wantsToMove && move(s, p, Math.cos(angle) * step, Math.sin(angle) * step);
      if (p.moving) car.heading = Math.atan2(Math.sin(angle), Math.cos(angle));
    } else p.moving = follow(s, p, p.driveSpeed * dt);
    p.velocityX = (p.x - beforeX) / dt;
    p.velocityY = (p.y - beforeY) / dt;
    car.x = p.x; car.y = p.y; car.face = p.face;
    if (!manual && p.moving) car.heading = Math.atan2(p.velocityY, p.velocityX);
    if (wantsToMove && !p.moving) {
      if (s.carMoving && crashSpeed > 2.2) {
        s.carMoving = false;
        const damage = Math.round(crashSpeed * 5);
        car.hp = Math.max(0, car.hp - damage); p.driveSpeed = 0;
        noise(s, p.x, p.y, 14);
        hear(s,"crash",p);
        if (damage >= 25 && !(p.fracture > 0) && s.world.rng() < .25) breakLeg(s, "The crash broke your leg.");
        s.effects.push({x: p.x, y: p.y, text: "CRASH −" + damage, color: "#e3a289", life: 1});
        if (car.hp > 0 && car.hp < 45 && !car.warnedSmoke) { car.warnedSmoke = true; notify(s, "The engine is smoking. Repair the vehicle soon.", true); }
      }
      s.stuck = (s.stuck ?? 0) + dt;
      if (s.stuck > 2.5) {
        s.stuck = 0;
        const spot = freeSpot(s, p.x, p.y, 4, .40, t => World.drivable(t));
        if (spot) { p.x = spot.x; p.y = spot.y; car.x = p.x; car.y = p.y; p.driveSpeed = 0; notify(s, "The vehicle was stuck. You freed it."); }
        else exitVehicle(s, true);
      }
    } else s.stuck = 0;
    if (p.moving) s.carMoving = true;
    if (p.moving) car.axis = Math.abs(p.velocityX) > Math.abs(p.velocityY) ? "x" : "y";
    s.running = false;
    p.stamina = Math.min(100, p.stamina + dt * 7);
    if (!p.path.length) s.dash = false;
    if (!p.moving) return;
    car.fuel = Math.max(0, car.fuel - dt * (.14 + p.driveSpeed * .02));
    p.footstep -= dt;
    if (p.footstep <= 0) { noise(s, p.x, p.y, 11 + p.driveSpeed); p.footstep = .7; }
    for (const zombie of s.world.enemies) {
      if (zombie.hp <= 0 || distance(p, zombie) > .95 || p.driveSpeed < 2.5 ||
          s.elapsed - (zombie.lastRam ?? -10) < 1) continue;
      zombie.lastRam = s.elapsed;
      const damage = Math.round(18 + p.driveSpeed * 7);
      zombie.hp = Math.max(0, zombie.hp - damage); zombie.stagger = 1.5; zombie.flash = .3;
      car.hp = Math.max(0, car.hp - Math.round(10 + p.driveSpeed * 1.5));
      s.effects.push({x: zombie.x, y: zombie.y, text: "−" + damage, color: "#edc28b", life: .8});
      if (!zombie.hp) defeat(s, zombie);
      else hearZombie(s,"hit",zombie);
    }
    if (car.hp <= 0) { exitVehicle(s, true); notify(s, "The vehicle was wrecked.", true); }
  }

  const nearLongHaulShelter = (s,o) => s.world.region === Regions.home && distance(s.world.start,o) <= 12;

  function longHaulGoals(s) {
    const run = s.longHaul;
    if (!run) return [];
    return [
      {done:run.cleared,text:"Clear the shelter road",detail:"Take the bat beside the shelter, equip it and clear the marked stretch of road."},
      {done:run.supplied && run.returned,text:"Bring fuel back from Ridge",detail:"Cross to Ridge, take fuel from the marked cache, and return to Cold Vale."},
      {done:run.water,text:"Collect off-grid drinking water",detail:"Build a rain collector and campfire near the shelter. After the cutoffs, collect two bottles of rainwater, boil them with a plank, and collect the batch."},
      {done:run.power,text:"Run backup power",detail:"After both utilities fail, add fuel to the shelter generator and start it. Switch it off when you’re done to save fuel."},
      {done:run.harvest,text:"Harvest off-grid food",detail:"Build a garden bed near the shelter, sow a seed and harvest after both cutoffs. Water the bed during dry spells."},
      {done:run.days >= 30,text:"Survive 30 days",detail:run.days + " / 30 full days survived."}
    ];
  }

  function longHaulHint(s) {
    const run = s.longHaul;
    if (!run) return "";
    if (run.complete) return "Thirty days. You kept the lights, water and food going. Cold Vale is yours to explore.";
    const p = s.player;
    if (p.wounds.some(w => !w.bandaged)) return "Use a bandage from your inventory to stop the bleeding before moving on.";
    if (p.hydration < 32) return "Take a water break. Use a carried bottle or check the shelter’s supplies.";
    if (p.hunger < 32) return "Eat before the next job. Small steps keep you alive.";
    if (!run.cleared && weapon(s).id === "fists") return "Start with the shelter crate and the bat outside. Equip the bat in Gear.";
    if (!run.returned && s.world.region === "ridge") return run.supplied ? "You have the fuel. Follow the marked crossing home." : "Find the marked Ridge supply cache and take a can of fuel.";
    if (run.returned && !nearLongHaulShelter(s,p)) return "Head back to the shelter. Check the road for new walkers along the way.";
    if (run.returned && (gridPower(s) || mainsWater(s))) {
      const nearby = s.world.objects.filter(o => o.active && nearLongHaulShelter(s,o));
      if (!nearby.some(o => o.kind === "barrel")) return "Open Build and craft a rain collector outside the shelter.";
      if (!nearby.some(o => o.kind === "campfire")) return "Build a campfire outside. You’ll use it to boil rainwater and cook.";
      const beds = nearby.filter(o => o.kind === "garden");
      if (!beds.length) return "Build a garden bed on clear grass near the shelter.";
      if (!beds.some(o => o.garden.crop)) return "Interact with your garden bed and plant a seed potato.";
      return "Your shelter is set up. Use the wristwatch indoors to wait for the cutoffs, or look for more supplies.";
    }
    if (run.water && run.power && run.harvest && run.days < 30) return "Your shelter is working off-grid. Keep food and water stocked, and use the wristwatch indoors to pass time safely.";
    return longHaulGoals(s).find(goal => !goal.done)?.detail ?? "";
  }

  function updateLongHaul(s) {
    const run = s.longHaul;
    if (run.complete) return;
    if (!run.cleared && s.world.region === Regions.home && distance(s.player,shelterRoad) <= 4 &&
        !s.world.enemies.some(z => z.hp > 0 && !z.dormant && distance(z,shelterRoad) <= 6)) {
      run.cleared = true;
      notify(s,"The shelter road is clear. That’s breathing room. Next up: the fuel cache in Ridge.");
    }
    if (!run.power && nearLongHaulShelter(s,s.player) && !gridPower(s) && !mainsWater(s) && shelterGenerator(s)?.running) {
      run.power = true;
      notify(s,"The shelter has backup power. One repair at a time, you’re making this place work.");
    }
    const days = Math.min(30,Math.floor((s.minutes - s.rules.startHour * 60) / 1440));
    if (days > run.days) {
      run.days = days;
      const notes = {1:"One full day down. Stay steady.",7:"A week alive. Your routines are paying off.",
        14:"Two weeks. A little preparation goes a long way.",21:"Three weeks. Keep the shelter stocked for the final stretch."};
      if (notes[days]) notify(s,notes[days]);
    }
    if (run.days === 30 && longHaulFields.every(key => key === "complete" || run[key])) {
      run.complete = true;
      notify(s,"30 days survived. You turned a temporary shelter into a home.");
    }
  }

  function destination(s) {
    if (s.hideNavigation) return null;
    const goal = s.world.region === Regions.home && pinnedGoal(s);
    const run = s.longHaul;
    if (run && !s.waypoint && !run.complete) {
      if (s.world.region === Regions.home && !run.cleared) return shelterRoad;
      if (s.world.region === Regions.home && !run.returned) return s.world.objects.find(o => o.id === "exit-ridge");
      if (s.world.region === "ridge") return s.world.objects.find(o => o.id === (run.supplied ? "exit-" + Regions.home : longHaulCache));
      if (s.world.region === Regions.home) return {...s.world.start,name:"Shelter"};
    }
    const id = s.waypoint || (goal ? (s.flags.rescued || s.world.npc.mode === "dead" ? "base" : "clinic") : "");
    if (!id) return null;
    if (id.startsWith("pin")) return s.mapPins.find(pin => pin.id === id) || null;
    if (id.startsWith("built") || utilityIds.has(id)) return s.world.objects.find(o => o.id === id && isStation(o)) || null;
    const building = id === "base" ? s.world.base : s.world.buildings.find(b => b.id === id) ||
      s.world.buildings.find(b => b.type === id);
    if (!building) return s.world.objects.find(o => o.id === id && canMarkFeature(o)) || null;
    return {id: building.id, name: building.name, x: building.door.x, y: building.door.y + 1};
  }

  function markDestination(s, type) {
    const point = s.world.objects.find(o => o.id === type && canMarkFeature(o));
    if (point) {
      s.waypoint = point.id;
      notify(s, point.name + (point.action === "travel" ? " crossing" : "") + " marked on the map.");
      return true;
    }
    const choices = type === "base" ? [s.world.base].filter(Boolean) : s.world.buildings.filter(b => b.type === type || b.id === type);
    const building = choices.sort((a, b) => distance(s.player, a.door) - distance(s.player, b.door))[0];
    if (!building) return false;
    s.waypoint = building.id;
    notify(s, building.name + " marked on the map.");
    return true;
  }

  const canMarkFeature = o => o.active && (o.action === "travel" || o.action === "spring" || o.action === "fish" ||
    o.action === "ledger-desk" || o.delivery || Chronicle.isScene(o));

  const isStation = o => o?.active && (o.kind === "barrel" || o.kind === "campfire" || o.kind === "garden" || utilityIds.has(o.id));

  function markStation(s, o) {
    if (!isStation(o) || !s.world.objects.includes(o)) return false;
    s.waypoint = o.id;
    notify(s, o.name + " marked on the map.");
    return true;
  }

  // Campaign state (HISTORIA.md section 16): clues found, challenge ids completed, hint progress.
  const newCampaign = () => ({clues:0, completed:[], hints:CampaignHints.empty(), buffUntil:0});
  // cinema.buff: after the cinema escape, sleep at night is safer and panic rises slower for a few nights.
  const cinemaBuff = s => Boolean(s.campaign && s.campaign.buffUntil > s.minutes);
  const challengeId = /^[a-z0-9]+(\.[a-z0-9-]+)?$/;
  function restoreCampaign(raw) {
    if (raw === undefined) return newCampaign();
    if (!raw || !Number.isInteger(raw.clues) || raw.clues < 0 || raw.clues > 5 || !Array.isArray(raw.completed) || raw.completed.length > 64 ||
        raw.completed.some((id,i) => typeof id !== "string" || !challengeId.test(id) || raw.completed.indexOf(id) !== i)) throw new Error("Invalid campaign progress.");
    if (raw.buffUntil !== undefined && (!Number.isFinite(raw.buffUntil) || raw.buffUntil < 0)) throw new Error("Invalid campaign progress.");
    return {clues:raw.clues, completed:[...raw.completed], hints:CampaignHints.restore(raw.hints), buffUntil:raw.buffUntil ?? 0};
  }
  // coldvale.houses: one torn page in each of three family homes, picked by a hash of the seed (no shared rng).
  function placeCampaignPages(world, seed) {
    const hash = text => [...String(seed) + ":" + text].reduce((h,c) => Math.imul(h ^ c.charCodeAt(0),16777619) >>> 0,2166136261);
    const homes = world.buildings.filter(b => b.type === "home").sort((a,b) => hash(a.id) - hash(b.id) || String(a.id).localeCompare(String(b.id)));
    let page = 0;
    for (const b of homes) {
      if (page === Data.campaignText.pages.length) break;
      const tiles = [];
      for (let y = b.y + 1; y < b.y + b.h - 1; y++) for (let x = b.x + 1; x < b.x + b.w - 1; x++) tiles.push(World.tileAt(world,x,y));
      const tile = tiles.filter(Boolean).sort((a,c) => hash(b.id + ":" + a.x + ":" + a.y) - hash(b.id + ":" + c.x + ":" + c.y)).find(t =>
        t.building === b.id && World.clear(world,t.x+.5,t.y+.5,.28) &&
        !world.objects.some(o => Math.floor(o.x) === t.x && Math.floor(o.y) === t.y) &&
        World.route(world,world.start.x,world.start.y,t.x+.5,t.y+.5,0,true).length);
      if (!tile) continue;
      world.objects.push({id:"campaign-page-" + page, x:tile.x+.5, y:tile.y+.5, building:b.id, zone:tile.zone, tint:.54,
        kind:"record", action:"campaign-page", name:"Torn page", page, read:false, active:true, solid:false});
      page++;
    }
  }

  // cinema.statue: taking the statue jams the doors, wakes a horde of 50 and leaves the windows as the only way out.
  function takeStatue(s, statue) {
    if (!s.campaign || s.mode !== "play" || statue?.action !== "cinema-statue" || !statue.active ||
        !s.world.objects.includes(statue) || !reachableObject(s,statue)) return false;
    statue.active = false;
    add(s.player.bag,"goldstatue",1,{born:s.minutes});
    const hall = s.world.buildings.find(b => b.type === "cinema");
    for (const o of s.world.objects) {
      if (o.action !== "door" || o.building !== hall.id) continue;
      if (o.kind === "window") { if (!o.open) o.reinforced = Data.cinemaTrap.windowHits; }
      else Object.assign(o,{open:false, sealed:true});
    }
    World.sync(s.world);
    const rng = Level.seeded((s.seed ^ 0x51a7e) >>> 0), spots = [];
    for (let y = hall.y + 1; y < hall.y + hall.h - 1; y++) for (let x = hall.x + 1; x < hall.x + hall.w - 1; x++) {
      const point = {x:x+.5, y:y+.5};
      if (World.tileAt(s.world,x,y)?.building === hall.id && World.clear(s.world,point.x,point.y,.18) && distance(point,s.player) > 3.5) spots.push(point);
    }
    for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
    for (let i = 0; i < Data.cinemaTrap.horde; i++) {
      const z = newInfected(s, spots[i % spots.length], "cinema-horde", rng);
      Object.assign(z,{alert:1, chaseX:s.player.x, chaseY:s.player.y});
    }
    s.atmosphere.awake = true;
    noise(s, statue.x, statue.y, 14);
    notify(s, Data.campaignText.statueTaken, true);
    return true;
  }

  function updateCinemaTrap(s) {
    if (s.world.region !== "cinema" || s.campaign.completed.includes("cinema.statue")) return;
    const statue = s.world.objects.find(o => o.id === "cinema-statue"), hall = s.world.buildings.find(b => b.type === "cinema");
    if (!statue || statue.active || World.tileAt(s.world,s.player.x,s.player.y)?.building === hall.id) return;
    for (const o of s.world.objects) if (o.sealed) o.sealed = false;
    s.campaign.completed.push("cinema.statue");
    CampaignHints.track(s.campaign.hints, "pineridge.two-nights", s.minutes);
    s.campaign.buffUntil = (runDay(s.minutes) + Data.cinemaTrap.buffNights - 1) * 1440 + 390;
    notify(s, Data.campaignText.cinemaEscape);
    notify(s, Data.campaignText.cinemaBuff);
  }

  function updateCinemaBuff(s) {
    if (!s.campaign.buffUntil || s.minutes < s.campaign.buffUntil) return;
    s.campaign.buffUntil = 0;
    notify(s, Data.campaignText.cinemaBuffEnds);
  }

  function readCampaignPage(s, note) {
    if (!s.campaign || s.mode !== "play" || s.player.vehicle || note?.action !== "campaign-page" ||
        !s.world.objects.includes(note) || !reachableObject(s,note)) return false;
    note.read = true;
    notify(s, Data.campaignText.pages[note.page] ?? "The page is blank.");
    const read = s.world.objects.filter(o => o.action === "campaign-page" && o.read).length;
    if (read < Data.campaignText.pages.length) { notify(s, "Torn pages found: " + read + " of " + Data.campaignText.pages.length + "."); return true; }
    if (!s.campaign.completed.includes("coldvale.houses")) {
      s.campaign.completed.push("coldvale.houses");
      s.campaign.clues = Math.max(s.campaign.clues, Campaign.areas.coldvale.clue);
      CampaignHints.track(s.campaign.hints, "cinema.statue", s.minutes);
      notify(s, Data.campaignText.housesDone);
    }
    return true;
  }

  // "" when the calendar lets the player into region `to` now, otherwise the reason shown to the player.
  function campaignProblem(s, to) {
    const area = s.campaign && Campaign.regions[to];
    if (!area) return "";
    const bag = s.player.bag, items = [...new Set(bag.map(item => item.id))];
    if (bag.some(item => item.id === "flashlight" && item.charge > 0)) items.push("battery");
    return Campaign.closedReason(area, runDay(s.minutes), Math.floor(s.minutes % 1440 / 60)) ||
      Campaign.missing(area, {items, clues:s.campaign.clues});
  }

  function travelProblem(s, exit) {
    const connection = exit?.action === "travel" && Regions.connection(s.world.region, exit.id.slice(5));
    if (s.mode !== "play" || !connection || !s.world.objects.includes(exit) || !reachableObject(s, exit)) return "Move closer to the crossing.";
    const closed = campaignProblem(s, exit.id.slice(5));
    if (closed) return closed;
    const car = vehicle(s), npc = s.world.npc;
    if (car && !connection.vehicles) return "The trail is on foot. Park and get out here.";
    if (car && s.player.driveSpeed > .15) return "Brake before crossing.";
    if (npc.mode === "follow" && npc.hp > 0 && distance(npc, s.player) > 4.5) return "Wait for Eva to catch up.";
    return "";
  }

  function arrivalPosition(s, center, following) {
    const car = vehicle(s), points = [];
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      points.push({x:center.x + dx, y:center.y + dy});
    }
    return points.sort((a,b) => distance(a, center) - distance(b, center)).find(point =>
      World.clear(s.world, point.x, point.y, car ? .40 : .18) && (!car || World.drivable(World.tileAt(s.world, point.x, point.y))) &&
      !s.world.enemies.some(z => z.hp > 0 && distance(z, point) < 1) &&
      (following || s.world.npc.hp <= 0 || distance(s.world.npc, point) >= .65));
  }

  function travel(s, exit) {
    const problem = travelProblem(s, exit);
    if (problem) { notify(s, problem, true); return null; }
    try {
      const from = s.world.region, to = exit.id.slice(5), {arrival} = Regions.connection(from, to);
      const template = create(s.seed, s.difficulty, s.role, s.world.generator, s.rules, to);
      const source = {...snapshotZone(s),leftAt:s.minutes}, target = {...(s.regionStates[to] || snapshotZone(template))};
      const car = vehicle(s), following = source.npc.mode === "follow" && source.npc.hp > 0;
      if (following) {
        target.npc = {...source.npc, ...arrival, replan:0, ridingVehicle:car?.id ?? null};
        source.npc = {id:"eva",name:"Eva",...s.world.start,hp:0,mode:"away",path:[],moving:false};
      }
      if (car) {
        source.objects = car.homeRegion === from ? source.objects.map(o => o === car ? {...o,active:false,solid:false,away:true,loot:[]} : o) :
          source.objects.filter(o => o !== car);
        const moved = {...car,...arrival,active:true,solid:false,away:false,building:null,zone:World.tileAt(template.world, arrival.x, arrival.y).zone};
        target.objects = [...target.objects.filter(o => o.id !== car.id), moved];
      }
      const regionStates = {...s.regionStates,[from]:source};
      delete regionStates[to];
      const entry = template.world.objects.find(o => o.id === "exit-" + from);
      const run = snapshotRun(s);
      const player = {...run.player,...arrival,headingX:Math.sign(arrival.x-entry.x),headingY:Math.sign(arrival.y-entry.y)};
      const next = restore({...target,...run,region:to,regionStates,player}, {template,arrival,following});
      const supplyReturn = to === Regions.home && next.longHaul?.cleared && next.longHaul.supplied && !next.longHaul.returned;
      if (target.leftAt < next.minutes || supplyReturn) catchUpArea(next, target.leftAt);
      if (supplyReturn) {
        next.longHaul.returned = true;
        notify(next,"You made it back. Check the road before carrying supplies through town.");
      }
      explore(next);
      notify(next, "Entered " + Regions.definitions[to].name + ". " + (to === Regions.home ? "The other routes are on your map." : Regions.definitions[to].detail));
      recordDaily(next,"crossings");
      settleDispatch(next, true);
      if (next.atmosphere.pending) warnHorde(next);
      return next;
    } catch (error) {
      notify(s, "Crossing failed. " + error.message, true);
      return null;
    }
  }

  function exploredTile(s, x, y) {
    const tile = World.tileAt(s.world, x, y);
    return Boolean(tile && s.world.explored[tile.y * s.world.width + tile.x]);
  }

  function saveMapPin(s, point, name, kind, id = null) {
    const label = typeof name === "string" ? name.trim() : "";
    const tile = Number.isFinite(point?.x) && Number.isFinite(point?.y) && World.tileAt(s.world, point.x, point.y);
    if (!tile || !label || label.length > 36 || !Object.hasOwn(Data.pinKinds, kind)) return null;
    const cell = tile.y * s.world.width + tile.x;
    if (!s.world.explored[cell] && tile !== World.tileAt(s.world, s.player.x, s.player.y)) return null;
    if (id) {
      const pin = s.mapPins.find(p => p.id === id);
      if (!pin) return null;
      Object.assign(pin, {name:label, kind});
      return pin;
    }
    if (s.mapPins.length >= Data.maxMapPins) return null;
    s.world.explored[cell] = 1;
    const pin = {id:"pin" + s.serial++, x:tile.x + .5, y:tile.y + .5, name:label, kind};
    s.mapPins.push(pin);
    return pin;
  }

  function markPin(s, id) {
    const pin = s.mapPins.find(p => p.id === id);
    if (!pin) return false;
    s.waypoint = pin.id;
    notify(s, pin.name + " set as your destination.");
    return true;
  }

  function removePin(s, id) {
    const index = s.mapPins.findIndex(pin => pin.id === id);
    if (index < 0) return false;
    s.mapPins.splice(index, 1);
    if (s.waypoint === id) s.waypoint = "";
    return true;
  }

  function noise(s, x, y, radius) {
    s.noiseRings = (s.noiseRings ?? []).filter(r => s.elapsed - r.t < 1.2);
    s.noiseRings.push({x, y, r: radius, t: s.elapsed});
    if (s.noiseRings.length > 16) s.noiseRings.shift();
    const wakeAudience = s.world.cinema && radius >= 4 && s.world.enemies.some(z =>
      z.origin === "cinema-sleeper" && z.dormant && z.hp > 0 && Math.hypot(z.x-x,z.y-y) <= radius);
    for (const z of s.world.enemies) {
      if (z.hp <= 0) continue;
      const audience = wakeAudience && z.origin === "cinema-sleeper" && z.dormant;
      const d = Math.hypot(z.x - x, z.y - y);
      if (!audience && (d > radius || d > radius * .55 && !World.sees(s.world, x, y, z.x, z.y))) continue;
      z.alert = Math.max(z.alert, audience || radius > 6 ? 14 : 5);
      z.chaseX = x; z.chaseY = y; z.replan = 0;
    }
  }

  function hear(s, kind, point, intensity = 1) {
    const zombieVoice = kind === "near" || kind === "distant" || kind === "horde";
    s.sounds.push({kind,x:point.x,y:point.y,muffled:!lineOfSight(s,s.player,point),zombieVoice,intensity});
    if (s.sounds.length > 5) s.sounds.shift();
  }

  const zombieVoices = new WeakMap();

  function hearZombie(s, role, zombie) {
    if (distance(s.player,zombie) > 20) return;
    const kind = "zombie.common." + role;
    const cue = {kind,x:zombie.x,y:zombie.y,muffled:!lineOfSight(s,s.player,zombie),
      entity:s.world.region+":"+zombie.id};
    // Preserve the existing five-slot atmospheric queue for warnings and other cues.
    // Events share this queue, but idle and chase cannot evict an existing warning.
    if (s.sounds.length >= 5) {
      const background = s.sounds.findIndex(sound => sound.kind === "zombie.common.idle" || sound.kind === "zombie.common.chase");
      if (background < 0 || role === "idle" || role === "chase") return;
      s.sounds.splice(background,1);
    }
    s.sounds.push(cue);
  }

  function encounterSlots(s, reserve = 0) {
    if (s.world.enemies.length > 181) s.world.enemies = s.world.enemies.filter(z => z.hp > 0 || !z.origin);
    const living = s.world.enemies.reduce((n,z) => n + Number(z.hp > 0),0);
    return Math.max(0,Math.min(Math.max(22,s.world.initialPopulation+18)-living-reserve,200-s.world.enemies.length-reserve));
  }

  function newInfected(s, point, origin, rng) {
    const z = World.infected(s.world,"a" + s.atmosphere.serial++,point.x,point.y,s.rules.mix,rng,origin);
    s.world.enemies.push(z);
    return z;
  }

  function freeEncounterSpot(s, point, safeDistance) {
    return World.clear(s.world,point.x,point.y) && distance(s.player,point) > safeDistance &&
      (s.world.npc.hp <= 0 || distance(s.world.npc,point) > 1.25) &&
      !s.world.enemies.some(z => z.hp > 0 && distance(z,point) < .75);
  }

  function wakeNest(s) {
    const state = s.atmosphere;
    if (state.awake) return false;
    state.awake = true;
    const {nest} = s.world, rng = Level.seeded(state.rng);
    const expected = s.rules.count || s.rules.hordes !== "off" ? 3 + Math.floor(s.rules.count/50) : 0;
    const count = Math.min(expected,encounterSlots(s));
    const positions = nest.positions.filter(point => freeEncounterSpot(s,point,3)).slice(0,count);
    for (const spot of positions) {
      const z = newInfected(s,spot,"nest",rng);
      Object.assign(z,{alert:24,chaseX:s.player.x,chaseY:s.player.y,replan:0});
    }
    state.rng = rng.state();
    s.player.panic = Math.min(100,s.player.panic + (positions.length ? 24 : 6));
    hear(s,"fungus",nest.marker);
    notify(s, positions.length ? "The filaments pull tight. Infected are waking behind the walls." : "The filaments twitch. The room stays quiet.",Boolean(positions.length));
    return true;
  }

  function touchFungus(s,o) {
    return o?.action === "fungus" && onFootAt(s,o) && wakeNest(s);
  }

  function noticeCrib(s) {
    if (s.atmosphere.nursery) return;
    s.atmosphere.nursery = true;
    s.player.panic = Math.min(100,s.player.panic+22);
    const crib = s.world.nursery;
    hear(s,"crib",crib);
    noise(s,crib.x,crib.y,10);
    notify(s,"A tiny infected stirs behind the crib rails. Something outside answers the cry.",true);
  }

  function inspectCrib(s,o) {
    if (o?.action !== "crib" || !onFootAt(s,o)) return false;
    noticeCrib(s);
    return true;
  }

  function warnHorde(s) {
    const pending = s.atmosphere.pending;
    const route = Atmosphere.arrivals[s.world.region][pending.route];
    hear(s,"horde",Atmosphere.marker(...route.entry));
    notify(s,"Shuffling steps from " + route.name + ". A horde is approaching.",true);
  }

  function resumeEncounterWarning(s) {
    if (s.atmosphere.pending && !s.sounds.some(cue => cue.kind === "horde")) warnHorde(s);
  }

  function waveSpots(s, route) {
    const spots = [], [x,y] = route.entry;
    const center = Atmosphere.marker(x,y);
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const point = Atmosphere.marker(x+dx,y+dy);
      if (World.clear(s.world,point.x,point.y) && !World.tileAt(s.world,point.x,point.y)?.building && freeEncounterSpot(s,point,12)) spots.push(point);
    }
    return spots.sort((a,b) => distance(a,center)-distance(b,center));
  }

  function updateHordes(s) {
    const a = s.atmosphere, mode = s.rules.hordes, pending = a.pending;
    if (firstNight(s)) return;
    if (s.world.cinema || s.world.underground || mode === "off") return;
    if (s.difficultyOptions?.director) {
      if (s.player.hp > 45) s.recoveryUsed = false;
      if (s.player.hp < 30 && !s.recoveryUsed) {
        s.recoveryUsed = true;
        a.pending = null;
        a.nextWave = Math.max(a.nextWave, a.time + 45);
        if (pending) notify(s, "The approaching horde moves on.");
        return;
      }
      const atRest = !s.player.sleeping && !s.player.moving && !s.player.path.length && !s.player.vehicle &&
        s.world.base && World.tileAt(s.world, s.player.x, s.player.y)?.building === s.world.base.id && s.player.panic < 8;
      if (!atRest) s.shelterIdleSince = undefined;
      else if (s.shelterIdleSince === undefined) s.shelterIdleSince = s.elapsed;
      else if (!pending && s.elapsed - s.shelterIdleSince >= 90 && s.player.hp > 45) {
        a.nextWave = Math.min(a.nextWave, a.time + 15);
        s.shelterIdleSince = s.elapsed;
      }
    }
    if (a.time < (pending?.due ?? a.nextWave)) return;
    const room = encounterSlots(s,a.awake ? 0 : 6), rng = Level.seeded(a.rng);
    const routes = Atmosphere.arrivals[s.world.region] ?? [];
    if (pending) {
      const route = routes[pending.route], goal = Atmosphere.marker(...route.goal);
      const slots = waveSpots(s,route);
      let entered = 0;
      for (const point of slots) {
        if (entered >= Math.min(room,pending.size)) break;
        const path = World.route(s.world,point.x,point.y,goal.x,goal.y,1.45,true);
        if (!path.length) continue;
        const z = newInfected(s,point,"horde",rng), end = path.at(-1);
        Object.assign(z,{homeX:end.x,homeY:end.y,chaseX:end.x,chaseY:end.y,alert:72,replan:4+rng()*4,path});
        entered++;
      }
      a.pending = null;
      a.nextWave = a.time + (entered ? Atmosphere.nextWave(mode,rng) * (s.longHaul ? 2.5 : 1) / pressure(s) : 8);
      if (entered) notify(s,"A group entered from " + route.name + ".",true);
      else notify(s,"The shuffling drifts along the boundary.");
    } else {
      const options = routes.map((route,index) => ({route,index})).filter(({route}) => room > 0 && waveSpots(s,route).length > 0);
      const alternatives = options.filter(({index}) => index !== a.lastRoute);
      const choices = alternatives.length ? alternatives : options;
      const choice = choices[Math.floor(rng()*choices.length)];
      if (!choice) a.nextWave = a.time + 20;
      else {
        const size = Math.min(room,(mode === "frequent" ? 8 : 5) + Math.floor(rng()*7));
        a.lastRoute = choice.index;
        a.pending = {route:choice.index,size,due:a.time+Atmosphere.warningSeconds};
        warnHorde(s);
      }
    }
    a.rng = rng.state();
  }

  function waitWithWatch(s, duration) {
    const overnight = duration === 480 && s.longHaul && nearLongHaulShelter(s,s.player) &&
      World.tileAt(s.world,s.player.x,s.player.y)?.building === s.world.base?.id;
    if ((!overnight && ![15, 30, 60].includes(duration)) || s.mode !== "play" || !quantity(s.player.bag, "watch")) return false;
    const p = s.player;
    if (p.vehicle || p.sleeping || p.grabbed > 0 || threats(s).length) {
      notify(s, "Find a safe place on foot before waiting.", true);
      return false;
    }
    const end = s.minutes + duration, hp = p.hp;
    endPursuit(s);
    p.path = [];
    p.resting = false;
    s.interaction = null;
    s.dash = false;
    while (s.mode === "play" && end - s.minutes > .000001) {
      tick(s, Math.min(.25, (end - s.minutes) / s.rules.clock));
      if (p.hp < hp || threats(s).length || overnight && Math.min(p.hunger,p.hydration) < 25) break;
    }
    if (s.mode === "play") notify(s, end - s.minutes > .001 ? "Waiting interrupted." : "You waited " + duration + " minutes.");
    return true;
  }

  function armWatch(s) {
    const index = s.player.bag.findIndex(item => item.id === "watch");
    if (index < 0 || s.mode !== "play" || s.player.vehicle || s.atmosphere.alarm) return false;
    if (!drop(s,index)) return false;
    const pile = s.world.objects.find(o => o.kind === "drop" && distance(o,s.player) < .6);
    s.atmosphere.alarm = {id:pile.id,due:s.atmosphere.time+10};
    notify(s,"Alarm armed. The watch will ring in 10 seconds.");
    return true;
  }

  function updateAtmosphere(s,dt) {
    const a = s.atmosphere, p = s.player;
    a.time += dt;
    if (!a.awake && s.world.cinema && World.tileAt(s.world,p.x,p.y)?.building) {
      if (s.world.cinema === "projector" && p.y < 19) {
        a.awake = true;
        const projector = s.world.objects.find(o => o.name === "Projector");
        noise(s,projector.x,projector.y,21);
        hear(s,"tin",projector);
        notify(s,"The projector catches. Something shifts in the seats.",true);
      } else if (s.world.cinema === "guest" && p.x >= 17.5 && p.y >= 17.5) {
        a.awake = true;
        s.cinemaGuestUntil = s.elapsed + 7;
        notify(s,"A figure ducks behind the concessions counter. ‘Keep the trophy,’ they whisper.");
      }
    }
    if (!a.awake && World.tileAt(s.world,p.x,p.y)?.tendril) wakeNest(s);
    const crib = s.world.nursery;
    if (crib && !a.nursery && !p.vehicle && distance(p,crib) < 3.2 &&
        World.tileAt(s.world,p.x,p.y)?.building === crib.building && lineOfSight(s,p,crib)) noticeCrib(s);
    if (a.alarm && a.time >= a.alarm.due) {
      const pile = s.world.objects.find(o => o.id === a.alarm.id && o.active);
      a.alarm = null;
      if (pile?.loot.some(item => item.id === "watch")) {
        noise(s,pile.x,pile.y,25);
        if (distance(p,pile) < 30) { hear(s,"alarm",pile); notify(s,"A wristwatch alarm rings."); }
      }
    }
    updateHordes(s);
    if (a.time < a.nextSound || a.pending) return;
    const rng = Level.seeded(a.rng);
    a.nextSound = a.time+17+rng()*30;
    let nearest = null, range = 35;
    for (const z of s.world.enemies) if (z.hp > 0) {
      const d = distance(p,z);
      if (d < range) { nearest = z; range = d; }
    }
    const roll = rng();
    if (range < 7 && roll < .52) {
      hear(s,"near",nearest);
      p.panic = Math.min(100,p.panic+10);
      if (!s.notice?.danger || s.notice.until < s.elapsed) notify(s,"A close, ragged growl.");
    } else if (nearest && range >= 7 && roll < .68) {
      hear(s,"distant",nearest);
      if (!s.notice?.danger || s.notice.until < s.elapsed) notify(s,"A distant moan carries through the air.");
    } else {
      const angle = rng()*Math.PI*2, point = {x:p.x+4*Math.cos(angle),y:p.y+4*Math.sin(angle)};
      const kind = s.world.underground ? "stone" : rng() < .54 ? "twig" : "tin";
      hear(s,kind,point);
      if (World.tileAt(s.world,point.x,point.y)) noise(s,point.x,point.y,kind === "tin" ? 9 : 6);
      p.panic = Math.min(100,p.panic+12);
      if (!s.notice?.danger || s.notice.until < s.elapsed) notify(s,kind === "stone" ? "Loose stones clatter in a passage." :
        kind === "twig" ? "A branch snaps nearby." : "A tin falls and rolls away.");
    }
    a.rng = rng.state();
  }

  const onFootAt = (s,o) => s.mode === "play" && !s.player.vehicle && s.world.objects.includes(o) && reachableObject(s,o);

  const canListen = (s,o) => o?.kind === "door" && !o.broken && onFootAt(s,o);

  function listenAtDoor(s, o) {
    if (!canListen(s,o)) return "";
    const axis = World.tileAt(s.world,o.x,o.y).wallAxis === "x" ? "y" : "x";
    const side = Math.sign(s.player[axis] - o[axis]) || 1;
    const across = {x:o.x,y:o.y,[axis]:o[axis] - side * .61};
    let z = null;
    for (const enemy of s.world.enemies) {
      if (enemy.hp <= 0 || (enemy[axis]-o[axis])*side >= 0 || distance(enemy,o) >= 5.5) continue;
      const sameHouse = enemy.origin === "resident" && World.tileAt(s.world,enemy.x,enemy.y)?.building === o.building;
      if (!sameHouse && !lineOfSight(s,across,enemy)) continue;
      z = enemy;
      if (!z.dormant) break;
    }
    if (z) hear(s,z.dormant ? "distant" : "near",z);
    const result = z?.dormant ? "A faint rasp comes from somewhere inside." :
      z ? "You hear shuffling on the other side." : o.open ? "No sound comes from inside." : "You hear nothing through the door.";
    notify(s,result);
    return result;
  }

  function sceneProblem(s, o) {
    if (!Chronicle.isScene(o) || !onFootAt(s,o)) return "Move within reach on foot.";
    return Chronicle.incidentProblem(s.ledger,o.record,s.minutes,isNight(s));
  }

  function revealLedgerCache(s, id, contents) {
    const cache = s.world.objects.find(o => o.id === id);
    cache.active = true;
    for (const [item, qty] of Object.entries(contents)) add(cache.loot,item,qty,{born:s.minutes});
  }

  function resolveScene(s, o, choice) {
    const problem = sceneProblem(s,o);
    if (problem) return false;
    const entry = Chronicle.entries[o.record];
    if (entry.game) {
      const {buttons, sequence, noisyChoice} = entry.game;
      if (!Number.isInteger(choice) || choice < 0 || choice >= buttons.length) return false;
      const step = s.sceneAttempt?.record === o.record ? s.sceneAttempt.step : 0;
      if (choice === noisyChoice) noise(s,o.x,o.y,14);
      if (sequence[step] !== choice) {
        s.sceneAttempt = {record:o.record, step:0, failed:true};
        return false;
      }
      if (step + 1 < sequence.length) {
        s.sceneAttempt = {record:o.record, step:step+1};
        return false;
      }
      s.sceneAttempt = null;
    }
    s.ledger.found[o.record] = s.minutes;
    if (entry.reward) revealLedgerCache(s,Chronicle.cacheFor(o.record),entry.reward);
    if (entry.noise) noise(s,o.x,o.y,entry.noise);
    notify(s, entry.noise ? entry.title + " recorded. The sound may draw infected." : entry.title + " added to your logbook.", Boolean(entry.noise));
    return true;
  }

  function dispatchProblem(s, desk, id) {
    if (desk?.action !== "ledger-desk" || !onFootAt(s,desk)) return "Use the civil defence desk in Cold Vale.";
    if (!Object.hasOwn(Chronicle.routes,id)) return "Unknown relay.";
    if (s.ledger.dispatch) return "The reserve circuit has already been used.";
    if (Chronicle.core.some(key => !Chronicle.has(s.ledger,key))) return "Verify the records from all five areas. See your logbook.";
    if (!Chronicle.ready(s.ledger,id)) return "Verify this outlet in the field before sending.";
    return "";
  }

  function sendDispatch(s, desk, id) {
    if (dispatchProblem(s,desk,id)) return false;
    s.ledger.dispatch = {route:id,sent:s.minutes,moved:null,delivered:false,reportRead:false};
    notify(s, Chronicle.routes[id].title + " scheduled in " + Chronicle.dispatchDelay + " in-game minutes.");
    return true;
  }

  function readDispatchReport(s,o) {
    const order = s.ledger.dispatch;
    if (!order?.delivered || order.reportRead || o?.delivery !== order.route || !onFootAt(s,o)) return false;
    order.reportRead = true;
    notify(s, "The crew's signed check-in is in your logbook.");
    return true;
  }

  function settleDispatch(s, arrived = false) {
    const order = s.ledger.dispatch;
    if (!order || s.minutes < order.sent + Chronicle.dispatchDelay) return;
    const {world} = s, route = Chronicle.routes[order.route];
    if (!order.delivered && world.region === route.destination) {
      revealLedgerCache(s,Chronicle.deliveryFor(order.route),route.reward);
      order.delivered = true;
      notify(s, "Relay check-in received. Find the " + route.cache.toLowerCase() + ".");
    }
    if (order.moved !== null || world.region !== route.region) return;
    const source = world.buildings.find(b => b.name === route.from).door;
    const center = {x:route.decoy[0]+.5,y:route.decoy[1]+.5};
    const living = world.enemies.filter(z => z.hp > 0);
    const candidates = living.filter(z => distance(z,source) <= 18 && distance(z,center) > 8)
      .sort((a,b) => distance(a,source)-distance(b,source)).slice(0,7);
    const spots = world.tiles.filter(t => !t.solid && !t.building && Math.hypot(t.x+.5-center.x,t.y+.5-center.y) < 5)
      .map(t => ({x:t.x+.5,y:t.y+.5})).sort((a,b) => distance(a,center)-distance(b,center));
    order.moved = 0;
    for (const z of candidates) {
      const index = spots.findIndex(point => distance(point,s.player) > 1.8 && (world.npc.hp <= 0 || distance(point,world.npc) > 1.2) &&
        !living.some(other => distance(point,other) < .8) && World.route(world,z.x,z.y,point.x,point.y,0,true).length);
      if (index < 0) continue;
      const [spot] = spots.splice(index,1);
      Object.assign(z,{homeX:spot.x,homeY:spot.y,chaseX:spot.x,chaseY:spot.y,path:[],moving:false,bash:null,windup:0,windupTarget:null,
        alert:arrived ? 0 : 90,replan:0});
      if (arrived) Object.assign(z,spot);
      order.moved++;
    }
    if (order.moved) notify(s, route.danger + " · The diversion drew " + order.moved + " infected toward the signal.", true);
    else notify(s, route.title + " sent. No infected were in reach of the signal.");
  }

  function openingOccupied(s, o) {
    return distance(s.player, o) < .65 || s.world.npc.hp > 0 && distance(s.world.npc, o) < .65 ||
      s.world.enemies.some(z => z.hp > 0 && distance(z, o) < .65);
  }

  const canUnlock = (s, o) => o?.locked && s.player.bag.some(i => o.lockId ? i.id === "housekey" && i.lock === o.lockId : i.id === "policekey");
  const doorHouse = (s, o) => s.world.buildings.find(b => b.id === o.building)?.name;
  const canUnlatch = (s, o) => o?.latched && World.tileAt(s.world, s.player.x, s.player.y)?.building === o.building;
  const crowbar = s => s.player.bag.find(i => i.id === "crowbar" && i.condition > 0);
  const smashTool = s => {
    const item = weapon(s), data = Data.items[item.id];
    return data?.damage && !data.firearm && item.condition > 0 ? item : null;
  };

  function breachProblem(s, o, method) {
    if (s.player.vehicle || !reachableObject(s, o) || o.action !== "door" || o.open || o.boards || o.broken) return "The opening is blocked.";
    if (o.sealed) return Data.campaignText.jammed;
    if (method === "pry") {
      if (!(o.locked || o.kind === "window")) return "This opening does not need prying.";
      if (!crowbar(s)) return "Carry a crowbar in usable condition.";
    } else if (method !== "smash" || o.kind !== "window") return "Choose a closed window.";
    return s.player.stamina < 9 ? "Rest to recover stamina." : "";
  }

  function breach(s, o, method) {
    const problem = breachProblem(s, o, method);
    if (problem) { notify(s, problem, true); return false; }
    const tool = method === "pry" ? crowbar(s) : smashTool(s), p = s.player;
    p.stamina -= 9 * staminaCost(s);
    if (tool) tool.condition = Math.max(0, tool.condition - (method === "pry" ? 2.5 : 1.5));
    if (method === "smash" && o.reinforced > 1) {
      o.reinforced--;
      noise(s, o.x, o.y, 13);
      hear(s,"glassSmash",o);
      notify(s, Data.campaignText.frameHolds);
      return true;
    }
    o.reinforced = 0;
    o.open = true;
    o.locked = false;
    o.latched = false;
    if (method === "smash") { o.broken = true; o.hp = 0; }
    World.sync(s.world);
    noise(s, o.x, o.y, method === "pry" ? 6.5 : 13);
    hear(s,method === "pry" ? "pry" : "glassSmash",o);
    const cut = method === "smash" && !tool;
    if (cut) {
      p.hp = Math.max(0, p.hp - 5);
      if (!p.hp) s.deathCause = "an injury while breaking in";
      if (p.wounds.length < 6) p.wounds.push({part:"arm", type:"cut", bleed:.18, bandaged:false, clean:false, infection:0, age:0});
    }
    notify(s, method === "pry" ? o.name + " pried open." : cut ? "Glass cut your arm. Apply a bandage." : "Window smashed.", cut);
    const station = s.world.buildings.find(b => b.type === "police" && b.id === o.building);
    if (station?.door.alarmArmed && gridPower(s)) {
      station.door.alarmArmed = false;
      noise(s, o.x, o.y, 25);
      hear(s,"alarm",o);
      notify(s, "Police alarm. The infected are coming.", true);
    }
    return true;
  }

  function door(s, o, auto = false) {
    if (!o?.active || o.action !== "door" || o.kind === "fence" || o.broken || o.kind === "gate" && o.hp === 0) return false;
    if (o.boards > 0) {
      if (!auto) notify(s, "The barricade blocks the opening. Remove a plank from the door or window panel.", true);
      return false;
    }
    if (o.sealed) {
      if (!auto) notify(s, Data.campaignText.jammed, true);
      return false;
    }
    if (o.open && openingOccupied(s, o)) {
      if (!auto) notify(s, "The doorway is occupied.");
      return false;
    }
    if (o.locked) {
      if (auto || !canUnlock(s, o)) { if (!auto) notify(s, o.lockId ? "Locked: " + (doorHouse(s, o) ?? "this house") + ". Find its key, tagged with the house name, or pry it open." : "Locked. Find the key or pry it open."); return false; }
      if (o.lockId) notify(s, "Unlocked with the " + doorHouse(s, o) + " key.");
      o.locked = false;
      o.alarmArmed = false;
    }
    if (o.latched) {
      if (auto || !canUnlatch(s, o)) { if (!auto) notify(s, "Latched inside. Pry it or break the glass."); return false; }
      o.latched = false;
    }
    o.open = !o.open;
    World.sync(s.world);
    noise(s, o.x, o.y, auto ? 1.2 : 2);
    hear(s,o.kind === "window" ? "windowSlide" : o.open ? "doorOpen" : "doorClose",o,auto ? .75 : 1);
    return true;
  }

  function barricade(s, o) {
    if (!reachableObject(s, o) || o.action !== "door" || s.player.vehicle || o.material === "stone" || o.boards >= 3) return false;
    if (openingOccupied(s, o)) { notify(s, "The opening is occupied.", true); return false; }
    const inputs = available(s, "nails") >= 4 ? {wood: 2, nails: 4} : {wood: 3, tape: 1};
    if (!consume(s, inputs)) { notify(s, "You need 2 planks and 4 nails, or 3 planks and duct tape.", true); return false; }
    o.open = false; o.boards++;
    o.hp += (70 + 4 * level(s,"crafting")) * Data.roles[s.role].craft;
    s.flags.barricade = true;
    addXp(s, "crafting", 5);
    World.sync(s.world);
    noise(s, o.x, o.y, 5);
    hear(s,"hammer",o);
    notify(s, "Barricade reinforced. The noise may attract the infected.");
    return true;
  }

  function unboard(s, o) {
    if (!reachableObject(s, o) || !o.boards || s.player.vehicle) return false;
    o.boards--; o.hp = Math.max(30, o.hp - 70 * Data.roles[s.role].craft);
    if (o.broken && !o.boards) { o.hp = 0; o.open = true; }
    if (weight(s.player.bag) + Data.items.wood.weight <= capacity(s)) add(s.player.bag, "wood", 1);
    else s.world.objects.push({id: "built" + s.serial++, x: s.player.x, y: s.player.y, kind: "drop",
      name: "Recovered plank", active: true, solid: false, action: "loot", searched: true, loot: [{id: "wood", qty: 1}]});
    World.sync(s.world);
    return true;
  }

  function removeBarrier(s, o) {
    if (!isBarrier(o) || !reachableObject(s, o) || s.player.vehicle) return false;
    o.active = false;
    World.sync(s.world);
    if (o.hp > 0) s.world.objects.push({id:"built" + s.serial++, x:o.x, y:o.y, kind:"drop", name:o.material === "stone" ? "Recovered stone" : "Recovered plank",
      active:true, solid:false, action:"loot", searched:true,
      loot:[{id:o.material === "stone" ? "rubble" : "wood",qty:1+o.boards}]});
    noise(s, o.x, o.y, 5);
    notify(s, o.name + " dismantled.");
    return true;
  }

  function minutesToRain(s) {
    if (s.world?.underground || s.rules.weather === "dry") return Infinity;
    if (s.rules.weather === "rain") return 0;
    if (s.rules.weather === "showers") return s.minutes % 450 < 150 ? 150 - s.minutes % 450 : 0;
    const block = 180;
    const phase = (Math.floor(s.minutes / block) + s.seed % 3 + 3) % 3;
    if (phase === 1) return 0;
    return block - s.minutes % block + (phase === 2 ? block : 0);
  }

  const localWeather = s => s.world.underground ? "Underground" : minutesToRain(s) === 0 ? "Rain" : "Overcast";
  const gridOnline = (s, days) => days < 0 || s.minutes < days * 1440;
  const gridPower = s => gridOnline(s, s.rules.powerDays);
  const mainsWater = s => gridOnline(s, s.rules.waterDays);
  const isNight = s => s.minutes % 1440 < 390 || s.minutes % 1440 >= 1200;
  const shelterGenerator = s => s.world.objects.find(o => o.id === "shelter-generator");
  const generatorReaches = (o, gen) => gen?.active && distance(o, gen) <= Data.utilities.generatorRange;
  const hasPower = (s, o) => {
    if (gridPower(s)) return true;
    const gen = shelterGenerator(s);
    return gen?.running && gen.fuel > 0 && generatorReaches(o, gen);
  };

  const moonlight = s => {
    const hour = s.minutes % 1440;
    const day = Math.floor(s.minutes / 1440) - Number(hour < 390);
    return [0, .25, .5, .75, 1, .75, .5, .25][((day % 8) + 8) % 8];
  };

  function sight(s) {
    const p = s.player, inside = World.tileAt(s.world, p.x, p.y)?.building;
    const dark = isNight(s) && !(inside && hasPower(s, p));
    const fires = (s.world.underground || dark) ? s.world.objects.filter(o => o.active && o.kind === "campfire" && distance(p,o) <= 5) : null;
    return {radius:s.world.underground ? 1.25 : dark ? .65 + moonlight(s) * 4.55 : 8.5, lamp:activeLight(s),fires};
  }

  function canSee(s, x, y, optics = sight(s)) {
    const p = s.player, dx = x - p.x, dy = y - p.y, distance = Math.hypot(dx, dy);
    const beam = optics.lamp && distance <= Data.flashlight.range &&
      dx * p.headingX + dy * p.headingY >= distance * beamLimit;
    const firelight = distance <= 8 && optics.fires?.some(fire =>
      Math.hypot(x-fire.x,y-fire.y) <= 3 && World.sees(s.world,fire.x,fire.y,x,y));
    return (distance <= optics.radius || beam || firelight) && World.sees(s.world, p.x, p.y, x, y);
  }

  function drainLight(s, minutes) {
    const lamp = activeLight(s);
    if (!lamp) return;
    const previous = lamp.charge;
    lamp.charge = Math.max(0, lamp.charge - minutes * (Data.roles[s.role].lampDrain ?? 1));
    if (!lamp.charge) { s.player.lightUid = null; notify(s, "The flashlight battery ran out."); }
    else if (previous > 12 && lamp.charge <= 12) notify(s,"Flashlight battery low. Replace it in Gear.");
  }

  function useTap(s, tap, fill = false) {
    if (s.player.vehicle || !reachableObject(s, tap) || tap.kind !== "tap") return false;
    const mains = mainsWater(s), p = s.player;
    if (!mains && !tap.reserve) { notify(s, "The pipes are empty. Collect and boil rainwater.", true); return false; }
    if (fill) {
      if (!quantity(p.bag, "emptybottle")) { notify(s, "You need an empty bottle.", true); return false; }
      if (weight(p.bag) - Data.items.emptybottle.weight + Data.items.water.weight > capacity(s) + .00001) {
        notify(s, "Your inventory is full.", true); return false;
      }
      remove(p.bag, "emptybottle", 1);
      add(p.bag, "water", 1);
    } else {
      if (p.hydration >= 99) { notify(s, "You are already hydrated."); return false; }
      p.hydration = Math.min(100, p.hydration + 45);
    }
    if (!mains) tap.reserve--;
    notify(s, fill ? "Filled one bottle with clean water." : "Drank from the tap.");
    return true;
  }

  function useGenerator(s, gen, refuel = false) {
    if (s.player.vehicle || !reachableObject(s, gen) || gen.kind !== "generator") return false;
    const config = Data.utilities;
    if (refuel) {
      if (gen.fuel > config.generatorCapacity - config.minutesPerFuel) { notify(s, "The tank cannot take a full can."); return false; }
      if (!consume(s, {fuel:1})) { notify(s, "You need a can of fuel.", true); return false; }
      gen.fuel += config.minutesPerFuel;
      notify(s, "Generator refuelled.");
    } else {
      if (!gen.fuel) { notify(s, "The generator needs fuel.", true); return false; }
      gen.running = !gen.running;
      if (gen.running) {
        noise(s, gen.x, gen.y, 15);
        gen.nextNoise = s.minutes + config.noiseInterval;
      }
      notify(s, gen.running ? "Generator running. The noise can attract infected." : "Generator switched off.", gen.running);
    }
    return true;
  }

  function updateUtilities(s, before, minutes, away = false) {
    const gen = shelterGenerator(s);
    const gridMinutes = s.rules.powerDays < 0 ? minutes : clamp(s.rules.powerDays * 1440 - before, 0, minutes);
    const fuelRate = 1 - .025 * level(s,"electrical");
    const backupMinutes = gen?.running ? Math.min(gen.fuel / fuelRate, minutes) : 0;
    if (backupMinutes) {
      gen.fuel = Math.max(0, gen.fuel - backupMinutes * fuelRate);
      if (!gen.fuel) { gen.running = false; if (!away) notify(s, "The shelter generator ran out of fuel.", true); }
      else if (s.minutes >= gen.nextNoise) {
        if (!away) noise(s, gen.x, gen.y, 12);
        gen.nextNoise = s.minutes + Data.utilities.noiseInterval;
      }
    }
    if (!away && s.world.base) {
      if (gridMinutes > 0 && !gridPower(s)) notify(s, "The town power is out. The shelter has a backup generator.", true);
      if (!mainsWater(s) && before < s.rules.waterDays * 1440) notify(s, "Water mains shut off. The kitchen tap has a small reserve.", true);
    }
    for (const o of s.world.objects) {
      if (!o.active || o.kind !== "fridge") continue;
      const chilled = generatorReaches(o, gen) ? Math.max(gridMinutes, backupMinutes) : gridMinutes;
      if (!chilled) continue;
      for (const item of o.loot) {
        if (Data.items[item.id].perish && freshMinutes(s, item) + minutes > 0) item.cold = (item.cold ?? 0) + chilled * .75;
      }
    }
  }

  const rainBottles = barrel => Math.floor(barrel.water / Data.rainCollector.bottleVolume);
  const rainDraw = (s, barrel) => Math.min(rainBottles(barrel), barrel.rawRain ? Data.waterBatch.inputs.rainwater : 1,
    roomFor(s, barrel.rawRain ? "rainwater" : "water"));
  const boilingMinutes = (s, fire) => fire.boilUntil == null ? null : Math.max(0, fire.boilUntil - s.minutes);
  const canUseFire = (s, fire) => !s.player.vehicle && fire?.action === "campfire" && reachableObject(s, fire);

  function fireBatch(s, fire) {
    const id = fire?.cook?.id ?? (fire?.boilUntil != null ? "water" : null);
    if (!id) return null;
    const readyAt = id === "water" ? fire.boilUntil : fire.cook.until;
    return {id, recipe: Data.fireRecipes[id], readyAt, remaining: Math.max(0, readyAt - s.minutes)};
  }

  function startFireBatch(s, fire, id) {
    if (!canUseFire(s, fire) || fire.boilUntil != null || fire.cook || !Object.hasOwn(Data.fireRecipes, id)) return false;
    const recipe = Data.fireRecipes[id];
    if (recipe.identify && !knownMushrooms(s)) return false;
    if (!consume(s, recipe.inputs)) {
      notify(s, id === "water" ? "You need untreated water and a plank for this batch." : "You need fresh ingredients and fuel for this batch.", true);
      return false;
    }
    const until = s.minutes + (id === "water" ? recipe.minutes : Math.max(4, Math.round(recipe.minutes * (1 - level(s, "cooking") * .03))));
    if (id === "water") fire.boilUntil = until;
    else fire.cook = {id, until};
    noise(s, fire.x, fire.y, 6);
    notify(s, id === "water" ? "Water is boiling. Come back to collect the batch." : "Food is on the fire. Come back to collect it.");
    return true;
  }

  function collectFireBatch(s, fire, id) {
    if (!canUseFire(s, fire)) return false;
    const batch = fireBatch(s, fire);
    if (!batch || batch.id !== id || batch.remaining > 0) return false;
    const {product, qty} = batch.recipe;
    if (isSpoiled(s, {id: product, born: batch.readyAt})) {
      fire.cook = null;
      notify(s, "You cleared the spoiled food from the campfire.");
      return true;
    }
    if (roomFor(s, product) < qty) {
      notify(s, "Make room in your inventory. The batch will stay at the campfire.", true);
      return false;
    }
    add(s.player.bag, product, qty, {born: batch.readyAt});
    addXp(s, "cooking", 3);
    if (id !== "water") recordDaily(s,"cooked",qty);
    if (id === "water") {
      fire.boilUntil = null;
      notify(s, s.flags.water ? "Collected drinking water." : "Shelter water project complete. You collected your first batch of drinking water.");
      s.flags.water = true;
      if (s.longHaul && !s.longHaul.water && nearLongHaulShelter(s,fire) && !mainsWater(s) && !gridPower(s)) {
        s.longHaul.water = true;
        notify(s,"Clean water after the cutoffs. That’s one less thing the town can take from you.");
      }
    } else {
      fire.cook = null;
      if (batch.recipe.garden) s.flags.gardenMeal = true;
      notify(s, "Collected " + Data.items[product].name.toLowerCase() + ".");
    }
    return true;
  }

  const startBoiling = (s, fire) => startFireBatch(s, fire, "water");
  const collectBoiledWater = (s, fire) => collectFireBatch(s, fire, "water");
  const collectCookedFood = (s, fire) => Boolean(fire?.cook && collectFireBatch(s, fire, fire.cook.id));

  const forageAmount = (s, site) => Data.wildResources[site.resource].qty + (Data.roles[s.role].forageBonus ?? 0) + Math.floor(level(s, "foraging") / 3);

  const knownMushrooms = s => level(s,"foraging") >= 2 || s.player.readBooks?.includes("forageguide");
  const isMushroom = id => id === "pantrycap" || id === "bitterfold";
  const itemName = (s,id) => isMushroom(id) && !knownMushrooms(s) ? "Unidentified mushroom" : Data.items[id].name;

  function mushroomProblem(s, site) {
    if (s.mode !== "play" || site?.action !== "mushroom" || !site.active || s.player.vehicle ||
        !s.world.objects.includes(site) || !reachableObject(s,site)) return "Move closer on foot.";
    if (site.harvested) return "Already picked.";
    return roomFor(s,site.species) < 1 ? "Make room in your inventory." : "";
  }

  function harvestMushroom(s, site) {
    const problem = mushroomProblem(s,site);
    if (problem) { notify(s,problem,true); return false; }
    site.harvested = true;
    add(s.player.bag,site.species,1,{born:s.minutes});
    addXp(s,"foraging",3);
    recordDaily(s,"gathered");
    if (site.colony === "active" && !s.fungalAlert && s.elapsed >= (s.nextFungalAlert ?? 0)) {
      s.fungalAlert = {region:s.world.region,id:site.id,due:s.elapsed + FieldStories.mushroom.warning};
      hear(s,"fungus",site);
      notify(s,"The filaments are snapping. Infected may converge in four seconds.",true);
    } else notify(s,"Gathered " + itemName(s,site.species) + ".");
    return true;
  }

  function updateFungalAlert(s) {
    const pending = s.fungalAlert;
    if (!pending || pending.due > s.elapsed) return;
    s.fungalAlert = null;
    s.nextFungalAlert = s.elapsed + FieldStories.mushroom.cooldown;
    if (pending.region !== s.world.region) return;
    const site = s.world.objects.find(o => o.id === pending.id);
    if (!site?.harvested || site.colony !== "active") return;
    for (const z of s.world.enemies) {
      if (z.hp <= 0 || distance(z,site) > FieldStories.mushroom.range) continue;
      const path = World.route(s.world,z.x,z.y,site.x,site.y);
      if (!path.length && World.tileAt(s.world,z.x,z.y) !== World.tileAt(s.world,site.x,site.y)) continue;
      Object.assign(z,{path,alert:Math.max(z.alert,14),chaseX:site.x,chaseY:site.y,replan:1});
    }
  }

  function readFieldNote(s, note) {
    if (s.mode !== "play" || s.player.vehicle || note?.action !== "field-note" ||
        !s.world.objects.includes(note) || !reachableObject(s,note)) return false;
    const prerequisite = FieldStories.prereqs[note.id.slice("field-note-".length)];
    if (prerequisite && ![s.world,...Object.values(s.regionStates)].some(zone =>
        zone.objects.some(o => o?.id === "field-note-" + prerequisite && o.read))) {
      notify(s,"The note refers to an earlier route card. Read that first.");
      return false;
    }
    note.read = true;
    const line = FieldStories.byLine[note.line].text;
    if (note.reward && !note.claimed && roomFor(s,note.reward) >= 1) {
      add(s.player.bag,note.reward,1,{born:s.minutes});
      note.claimed = true;
      notify(s,"Recovered " + Data.items[note.reward].name + ".");
    }
    notify(s,line);
    return true;
  }

  function wildProblem(s, site) {
    if (s.mode !== "play" || s.player.vehicle || !s.world.objects.includes(site) || !reachableObject(s, site)) return "Move closer on foot.";
    if (site.action === "spring") {
      if (!quantity(s.player.bag, "emptybottle")) return "Bring an empty bottle.";
      if (weight(s.player.bag) + Data.items.rainwater.weight - Data.items.emptybottle.weight > capacity(s) + .00001) return "Make room in your inventory.";
    } else if (site.action === "forage") {
      if (site.forageAt > s.minutes) return "Ready again in " + Math.ceil(site.forageAt - s.minutes) + " in-game minutes.";
      if (roomFor(s, site.resource) < forageAmount(s,site)) return "Make room in your inventory.";
    } else if (site.action === "fish") {
      if (site.fishUntil != null) {
        if (site.fishUntil > s.minutes) return "Check the line in " + Math.ceil(site.fishUntil - s.minutes) + " in-game minutes.";
        if (!isSpoiled(s, {id:"rawfish",born:site.fishUntil}) && roomFor(s, "rawfish") < 1) return "Make room in your inventory.";
      } else {
        if (site.fishStock === 0 && site.fishRecovery > s.minutes) return "The water is quiet. Try again in " +
          Math.ceil(site.fishRecovery - s.minutes) + " in-game minutes.";
        if (!quantity(s.player.bag, "rod")) return "Bring a fishing rod. Look in the net shed.";
        if (!available(s, "bait")) return "Search under driftwood for bait.";
      }
    }
    return "";
  }

  function useWild(s, site) {
    if (!site || !["spring", "forage", "fish"].includes(site.action)) return false;
    const problem = wildProblem(s, site);
    if (problem) { notify(s, problem, true); return false; }
    if (site.action === "spring") {
      remove(s.player.bag, "emptybottle", 1);
      add(s.player.bag, "rainwater", 1);
      notify(s, "Filled a bottle with untreated water. Boil it at a campfire.");
    } else if (site.action === "forage") {
      const qty = forageAmount(s,site), {recovery} = Data.wildResources[site.resource];
      add(s.player.bag, site.resource, qty, {born:s.minutes});
      addXp(s, "foraging", 2 * qty);
      recordDaily(s,"gathered",qty);
      site.forageAt = s.minutes + recovery;
      notify(s, "Gathered " + qty + " × " + Data.items[site.resource].name + ".");
    } else if (site.fishUntil == null) {
      if (!consume(s, {bait:1})) return false;
      const stock = site.fishStock || Data.fishingStock.capacity;
      site.fishStock = stock - 1;
      if (!site.fishStock) site.fishRecovery = s.minutes + Data.fishingStock.recovery;
      else delete site.fishRecovery;
      const wait = Math.max(10, Math.round(Data.fishingMinutes * (1 - level(s, "fishing") * .04)));
      site.fishUntil = s.minutes + wait;
      notify(s, "Line cast. Return to this spot in " + wait + " in-game minutes.");
    } else {
      const born = site.fishUntil;
      site.fishUntil = null;
      if (isSpoiled(s, {id:"rawfish",born})) notify(s, "The catch spoiled. You cleared the line.");
      else { add(s.player.bag, "rawfish", 1, {born}); addXp(s, "fishing", 4); recordDaily(s,"gathered"); notify(s, "Caught a fish. Grill it at a campfire."); }
    }
    return true;
  }

  const canTendGarden = (s, bed) => !s.player.vehicle && bed?.action === "garden" && reachableObject(s, bed);

  function sow(s, bed, id) {
    if (!canTendGarden(s, bed) || bed.garden.crop || !Object.hasOwn(Data.crops, id)) return false;
    const crop = Data.crops[id];
    if (!consume(s, {[crop.seed]: 1})) return false;
    bed.garden.crop = id;
    bed.garden.growth = 0;
    notify(s, "Planted " + crop.name.toLowerCase() + ".");
    return true;
  }

  function waterGarden(s, bed, item) {
    if (!canTendGarden(s, bed) || bed.garden.moisture >= 90 || !["rainwater", "water"].includes(item)) return false;
    if (!consume(s, {[item]: 1})) return false;
    bed.garden.moisture = Math.min(100, bed.garden.moisture + Data.garden.water);
    notify(s, "Watered the garden bed.");
    return true;
  }

  function gardenYield(s, bed) {
    const g = bed?.garden, crop = Data.crops[g?.crop];
    if (!crop || g.growth < crop.minutes) return null;
    return {[crop.product]: crop.qty + Math.floor(level(s, "gardening") / 2), [crop.seed]: 1};
  }

  function harvestGarden(s, bed) {
    if (!canTendGarden(s, bed)) return false;
    const bundle = gardenYield(s, bed);
    if (!bundle || !canCarryBundle(s, bundle)) return false;
    for (const [id, qty] of Object.entries(bundle)) add(s.player.bag, id, qty, {born: s.minutes});
    notify(s, "Harvested " + Data.crops[bed.garden.crop].name.toLowerCase() + ". Saved one seed for next time.");
    bed.garden.crop = null;
    bed.garden.growth = 0;
    addXp(s, "gardening", 6);
    recordDaily(s,"gathered",Object.values(bundle).reduce((sum,qty)=>sum+qty,0));
    s.flags.harvested = true;
    if (s.longHaul && !s.longHaul.harvest && nearLongHaulShelter(s,bed) && !mainsWater(s) && !gridPower(s)) {
      s.longHaul.harvest = true;
      notify(s,"Food grown at home after the cutoffs. Save the seed and keep the garden going.");
    }
    return true;
  }

  function growGarden(bed, minutes, raining, grow = 1) {
    const g = bed.garden, crop = Data.crops[g.crop];
    const {minMoisture, rainRate, emptyDryRate} = Data.garden;
    const rate = (raining ? rainRate : 0) - (crop?.dryRate ?? emptyDryRate);
    const moisture = g.moisture;
    g.moisture = clamp(moisture + rate * minutes, 0, 100);
    if (!crop || g.growth >= crop.minutes) return;
    const wetMinutes = raining ? Math.max(0, minutes - Math.max(0, minMoisture - moisture) / rate) :
      Math.min(minutes, Math.max(0, (moisture - minMoisture) / -rate));
    g.growth = Math.min(crop.minutes, g.growth + wetMinutes * grow);
  }

  function updateOutdoor(s, minutes, raining) {
    const collector = Data.rainCollector;
    for (const o of s.world.objects) {
      if (!o.active) continue;
      if (o.kind === "garden") growGarden(o, minutes, raining, season(s).grow);
      else if (raining && o.kind === "barrel") {
        o.water = Math.min(collector.capacity, o.water + minutes / 2 * (o.rawRain ? collector.rate : collector.legacyRate));
      }
    }
  }

  function catchUpArea(s, leftAt) {
    if (s.longHaul?.cleared && s.world.region === Regions.home && s.rules.hordes !== "off") {
      const elapsed = s.minutes - leftAt;
      const firstSupplyReturn = s.longHaul.supplied && !s.longHaul.returned;
      if (firstSupplyReturn || elapsed >= 30) {
        const count = Math.min(3,Math.max(1,Math.floor(elapsed/30)),encounterSlots(s));
        const rng = Level.seeded((s.seed ^ Math.floor(leftAt) ^ 0x4e21371a) >>> 0);
        const entries = [shelterRoad,{x:29.5,y:45.5},{x:29.5,y:35.5}];
        let arrived = 0;
        for (const point of entries) {
          if (arrived >= count) break;
          if (!freeEncounterSpot(s,point,10)) continue;
          newInfected(s,point,"horde",rng);
          arrived++;
        }
        if (arrived) notify(s,"Tracks on the shelter road. New infected moved into Cold Vale while you were away.",true);
      }
    }
    updateUtilities(s, leftAt, s.minutes - leftAt, true);
    if (s.world.underground) { updateOutdoor(s,s.minutes - leftAt,false); return; }
    const {weather} = s.rules;
    if (weather === "dry" || weather === "rain") {
      updateOutdoor(s, s.minutes - leftAt, weather === "rain");
      return;
    }
    // A week of repeating rain is enough to fill collectors and mature either crop.
    const start = Math.max(leftAt, s.minutes - 7 * 1440);
    for (let at = start; at < s.minutes;) {
      const until = minutesToRain({minutes:at,rules:s.rules,seed:s.seed});
      const rainEnds = weather === "showers" ? 450 - at % 450 : 180 - at % 180;
      const end = Math.min(s.minutes, at + (until || rainEnds));
      if (end <= at) break;
      updateOutdoor(s, end - at, until === 0);
      at = end;
    }
  }

  function evaAtShelter(s) {
    const {npc, base} = s.world;
    return Boolean(base && s.flags.rescued && npc.hp > 0 && World.tileAt(s.world, npc.x, npc.y)?.building === base.id);
  }

  function toggleGardenHelp(s) {
    const npc = s.world.npc;
    if (!evaAtShelter(s) || npc.mode !== "refuge" || s.player.vehicle ||
        distance(s.player, npc) > 1.85 || !lineOfSight(s, s.player, npc)) return false;
    s.flags.gardenHelp = !s.flags.gardenHelp;
    notify(s, s.flags.gardenHelp ? "Eva will water dry beds with collected rainwater." : "Eva stopped tending the garden.");
    return true;
  }

  function tendShelterGarden(s) {
    if (!s.flags.gardenHelp || s.world.npc.mode !== "refuge" || !evaAtShelter(s)) return;
    const {base, enemies, objects} = s.world;
    if (enemies.some(z => z.hp > 0 && distance(z, base.door) < 5)) return;
    const {minMoisture, shelterRange, collectorRange, water} = Data.garden;
    const volume = Data.rainCollector.bottleVolume;
    const collectors = objects.filter(o => o.active && o.kind === "barrel" && o.rawRain && o.water >= volume);
    for (const bed of objects) {
      const g = bed.garden;
      if (!bed.active || bed.kind !== "garden" || !g.crop || g.growth >= Data.crops[g.crop].minutes ||
          g.moisture >= minMoisture || distance(bed, base.door) > shelterRange) continue;
      const collector = collectors.find(o => distance(o, bed) <= collectorRange);
      if (!collector) continue;
      collector.water -= volume;
      g.moisture = Math.min(100, g.moisture + water);
      return;
    }
  }

  const isFurniture = o => Boolean(o && (o.action === "dismantle" ||
    (!o.action && ["armchair", "bench", "chair", "rug", "sofa", "table"].includes(o.kind))));

  function dismantleFurniture(s, o) {
    if (!isFurniture(o) || !reachableObject(s, o) || s.player.vehicle) return false;
    o.active = false;
    World.sync(s.world);
    s.world.objects.push({id: "built" + s.serial++, x: o.x, y: o.y, kind: "drop", active: true, solid: false,
      name: "Dismantled furniture", action: "loot", searched: true, loot: [{id: "scrap", qty: 2}, {id: "wood", qty: 1}]});
    noise(s, o.x, o.y, 5);
    return true;
  }

  function contextual(s, o) {
    if (!reachableObject(s, o) || isFurniture(o)) return false;
    const p = s.player;
    if (p.vehicle) { notify(s, "Exit the vehicle to interact."); return false; }
    if (o.action === "door") return door(s, o);
    if (o.action === "bed") {
      if (threats(s).length) { notify(s, "Infected are nearby. Find a safer place to rest.", true); return false; }
      if (!p.resting && p.fatigue >= 35) {
        if (!startSleep(s)) return false;
        s.sleepPending = true; p.path = [];
      } else {
        p.resting = !p.resting; p.path = [];
        notify(s, p.resting ? "Resting. Move to stop resting." : "Stopped resting.");
      }
    } else if (o.action === "harvest") {
      if (!quantity(p.bag, "axe")) { notify(s, "You need an axe to chop this tree."); return false; }
      o.active = false; World.sync(s.world);
      s.world.objects.push({id: "built" + s.serial++, x: o.x, y: o.y, kind: "drop", active: true, solid: false,
        name: "Chopped wood", action: "loot", searched: true, loot: [{id: "wood", qty: 4}]});
      noise(s, o.x, o.y, 9);
    } else if (o.action === "radio") {
      if (s.flags.radio) {
        if (s.supplyRun === "return") {
          s.supplyRun = "complete";
          notify(s, "Mara logged your check-in. Supply run complete.");
        }
        return true;
      }
      if (!consume(s, {part: 2, scrap: 2, fuel: 1})) {
        notify(s, "The radio needs 2 radio components, 2 scrap and 1 fuel."); return false;
      }
      s.flags.radio = true;
      addXp(s,"electrical",12);
      noise(s, o.x, o.y, 24);
      notify(s, "The water tower heard your signal. So did the infected.");
    } else if (o.action === "barrel") {
      const bottles = rainBottles(o);
      if (!bottles) { notify(s, "The collector needs more rain."); return false; }
      const item = o.rawRain ? "rainwater" : "water";
      const qty = rainDraw(s, o);
      if (!qty) { notify(s, "Your inventory is full.", true); return false; }
      o.water -= qty * Data.rainCollector.bottleVolume;
      add(p.bag, item, qty);
      notify(s, o.rawRain ? "Collected rainwater. Boil it at a campfire." : "Collected water.");
    } else if (o.action === "campfire") {
      p.stamina = Math.min(100, p.stamina + 20);
      if (s.rules.exposure === "on") {
        p.wetness = Math.max(0, p.wetness - 15);
        p.temperature = Math.min(37, p.temperature + .65);
      }
      noise(s, o.x, o.y, 6);
      notify(s, "The fire restores some stamina.");
    }
    return true;
  }

  function recruit(s) {
    const npc = s.world.npc;
    if (npc.mode !== "injured" || distance(s.player, npc) > 1.85) return false;
    if (!consume(s, {bandage: 1, food: 1})) { notify(s, "Eva needs a bandage and canned food."); return false; }
    npc.mode = "follow"; npc.hp = 100;
    addXp(s, "medical", 6);
    notify(s, "Eva is with you. Bring her to the shelter or ask her to wait.");
    return true;
  }

  function threats(s) {
    return s.world.enemies.filter(z => z.hp > 0 && distance(s.player, z) < 8 && lineOfSight(s, s.player, z));
  }

  function damageFactor(s) {
    const p = s.player;
    return (p.stamina < 15 ? .5 : p.stamina < 35 ? .72 : 1) *
      (p.fatigue > 80 ? .65 : p.fatigue > 60 ? .85 : 1) * (p.pain > 40 && !p.medicine ? .8 : 1) *
      (p.hunger < 15 || p.hydration < 15 ? .8 : 1) * (1 + level(s, "combat") * .04);
  }

  function aimChance(s, enemy = s.target) {
    const aim = enemy && enemy === s.target ? s.aim : 0;
    return clamp(.5 + aim * .45 + level(s, "marksmanship") * .015 - s.player.panic * .0015 - s.player.fatigue * .001, .2, .98);
  }

  function inAttackRange(s, enemy, range = weaponData(s).range) {
    return enemy?.hp > 0 && !enemy.dormant && distance(s.player, enemy) <= range && canSee(s, enemy.x, enemy.y);
  }

  function closestInReach(s, range) {
    let closest = null, reach = range;
    for (const enemy of s.world.enemies) {
      if (inAttackRange(s, enemy, reach)) {
        closest = enemy;
        reach = distance(s.player, enemy);
      }
    }
    return closest;
  }

  function attackTarget(s) {
    if (s.player.vehicle) return null;
    const range = weaponData(s).range;
    return inAttackRange(s, s.target, range) ? s.target : closestInReach(s, range);
  }

  function touchAttackTarget(s) {
    const mode = s.difficultyOptions?.aim;
    if (!mode || mode === "off") return attackTarget(s);
    const p = s.player, arc = mode === "strong" ? .3 : .65;
    if (p.vehicle) return null;
    let target = null, reach = weaponData(s).range;
    for (const enemy of s.world.enemies) {
      const dx = enemy.x - p.x, dy = enemy.y - p.y, d = Math.hypot(dx,dy);
      if (d > reach || dx*p.headingX + dy*p.headingY < d*arc || !inAttackRange(s,enemy,reach)) continue;
      target = enemy;
      reach = d;
    }
    return target;
  }

  function weaponProblem(s, item = weapon(s)) {
    if (item.condition <= 0) return "Weapon broken";
    if (Data.items[item.id]?.firearm && !quantity(s.player.bag, "ammo")) return "No ammo";
    return "";
  }

  function endPursuit(s) {
    s.target = null;
    s.player.path = [];
    s.aim = 0;
  }

  function endWindup(enemy) {
    enemy.windup = 0;
    enemy.windupTarget = null;
  }

  function faceTowards(actor, target) {
    const side = Math.sign(target.x - actor.x - (target.y - actor.y));
    if (side) actor.face = side;
  }

  // Deterministic per run and infected (no shared rng): the same infected always carries the same supply.
  function carriedSupply(s, enemy) {
    const rule = Data.zombieCarry;
    if (!rule.origins.includes(enemy.origin ?? "")) return null;
    let h = (s.seed >>> 0) ^ 2166136261;
    for (const c of String(enemy.id)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    h = Math.imul(h ^ h >>> 15, 2246822507) >>> 0;
    if (h % rule.oneIn) return null;
    const type = s.world.buildings?.find(b => b.id === World.tileAt(s.world, enemy.x, enemy.y)?.building)?.type;
    const pool = rule.pools[type] ?? rule.pools.town;
    return pool[Math.floor(h / rule.oneIn) % pool.length];
  }

  function defeat(s, enemy) {
    s.kills++;
    recordDaily(s,enemy.kind);
    hearZombie(s,"death",enemy);
    const winner = enemy.origin === "cinema-winner";
    const item = winner ? "raffletrophy" : Data.outfits[enemy.outfit]?.item, supply = winner ? null : carriedSupply(s, enemy);
    const loot = item ? [{id: item, qty: 1, condition: Data.items[item].damage ? 60 : 100}] : [];
    if (supply) loot.push({id: supply, qty: 1, condition: 100});
    s.world.objects.push({id: "built" + s.serial++, x: enemy.x, y: enemy.y, kind: "drop",
      name: winner ? "The El Gordo Winner" : "Fallen infected", active: true, solid: false, action: "loot", searched: !loot.length, corpse: !winner, died: s.minutes,
      loot});
  }

  function attack(s, z) {
    const p = s.player, item = weapon(s), w = Data.items[item.id] || fists;
    if (p.vehicle || p.cooldown > 0 || !inAttackRange(s, z, w.range)) return false;
    const problem = weaponProblem(s, item);
    if (problem) {
      notify(s, problem + (item.condition <= 0 ? ". Equip another weapon or repair it." : "."), true);
      if (s.target === z) endPursuit(s);
      return false;
    }
    recordPlaytest(s, "fight");
    recordDaily(s,"attacks");
    faceTowards(p, z);
    s.swingVisual = {weapon:item.id, dx:z.x - p.x, dy:z.y - p.y};
    const family = Data.weaponSkills[item.id];
    p.cooldown = w.delay * (family ? 1 - .025 * level(s,family) : 1); p.staminaDelay = .7; p.swing = .18;
    p.stamina = Math.max(0, p.stamina - w.effort * staminaCost(s));
    if (w.firearm) remove(p.bag, "ammo", 1);
    const conditionBefore = item.condition;
    item.condition = Math.max(0, item.condition - w.wear * (1 - .035 * level(s,"maintenance")));
    if (conditionBefore > 0 && item.condition === 0) notify(s, w.name + " broke. Repair it in Equipment or switch weapons.", true);
    else if (conditionBefore >= 20 && item.condition < 20) notify(s, "Your " + Data.items[item.id].name + " is nearly worn out. Repair it or switch weapons.", true);
    noise(s, p.x, p.y, w.noise);
    const hit = !w.firearm || s.world.rng() < aimChance(s, z);
    hear(s,w.firearm ? "shot" : "strike",w.firearm ? p : z);
    const matchup = Data.combatStyles[w.combat].damage[z.kind] ?? 1;
    const amount = hit ? Math.round(w.damage * matchup * damageFactor(s) * (w.firearm ? 1 : 1 + level(s, "strength") * .03) * (item.condition < 20 ? .8 : 1)) : 0;
    z.hp = Math.max(0, z.hp - amount);
    if (hit) {
      if (z.hp > 0) hearZombie(s,"hit",z);
      z.flash = .2;
      if (z.kind !== "brute" || matchup >= 1) {
        z.stagger = Math.max(z.stagger, z.kind === "runner" && w.combat === "reach" ? .48 : .28);
        z.swing = 0;
        endWindup(z);
      }
    }
    s.effects.push({x: z.x, y: z.y, text: hit ? (matchup < 1 ? "RESISTED " : matchup > 1 ? "STRONG " : "") + "−" + amount : "MISS", color: hit ? "#efc785" : "#d2cfb6", life: .8});
    addXp(s, "combat", hit ? 1.5 : .2);
    if (hit && family) addXp(s,family,1.5);
    if (w.wear > 0) addXp(s,"maintenance",.25);
    if (w.firearm) addXp(s, "marksmanship", hit ? 3 : 1);
    else addXp(s, "strength", hit ? .8 : .1);
    if (!z.hp) {
      defeat(s, z);
      if (s.target === z) endPursuit(s);
    }
    else { z.alert = 9; z.chaseX = p.x; z.chaseY = p.y; z.replan = 0; }
    return true;
  }

  function shove(s) {
    const p = s.player;
    const effort = 10 * staminaCost(s);
    if (p.vehicle || p.stamina < effort || p.cooldown > 0) return false;
    const near = closestInReach(s, 1.65);
    if (!near) return false;
    recordPlaytest(s, "fight");
    if (s.target) endPursuit(s);
    faceTowards(p, near);
    s.swingVisual = {weapon:"fists", dx:near.x - p.x, dy:near.y - p.y};
    p.stamina -= effort; p.cooldown = .7; p.swing = .18;
    const brute = near.kind === "brute";
    if (!brute || near.windup <= 0) {
      near.stagger = Math.max(near.stagger, brute ? .25 : 1.1);
      near.swing = 0;
      endWindup(near);
    }
    const d = distance(p, near), dx = (near.x - p.x) / (d || 1), dy = (near.y - p.y) / (d || 1);
    const push = brute ? .18 : .6;
    if (World.clear(s.world, near.x + dx * push, near.y + dy * push)) { near.x += dx * push; near.y += dy * push; }
    s.effects.push({x: near.x, y: near.y, text: brute ? "BRACED" : "SHOVED", color: "#c9d6ae", life: .65});
    if (p.grabbed > 0) { p.grabbed = 0; p.grabCool = 3; notify(s, "You shoved the infected away and broke free."); }
    noise(s, p.x, p.y, 3);
    return true;
  }

  function hurt(s, z) {
    const p = s.player;
    if (p.flash > 0) return;
    recordDaily(s,"hits");
    recordPlaytest(s, "fight");
    const car = vehicle(s);
    if (car) {
      car.hp = Math.max(0, car.hp - z.stats.damage * 1.1 * infectedDamage(s));
      p.flash = .3;
      if (!car.hp) { exitVehicle(s, true); notify(s, "The vehicle was wrecked.", true); }
      return;
    }
    if (!(p.grabbed > 0) && !(p.grabCool > 0) && s.world.rng() < (z.kind === "brute" ? .5 : z.kind === "runner" ? .2 : .3)) {
      p.grabbed = assist(s, "grabs") ? .9 : 2.2;
      s.effects.push({x: p.x, y: p.y, text: "GRABBED", color: "#e3a289", life: 1});
      notify(s, "An infected grabs you. Shove it or struggle free!", true);
    }
    if (z.kind === "brute" && !(p.fracture > 0) && s.world.rng() < .08) breakLeg(s, "A heavy blow breaks your leg.");
    const roll = s.world.rng(), type = roll < .06 ? "bite" : roll < .46 ? "cut" : "scratch";
    const part = s.world.rng() < .5 ? "arm" : "leg";
    let guard = 0;
    const wear = Math.max(1, Math.round(z.stats.damage * infectedDamage(s) * .45));
    for (const slot of part === "arm" ? ["arms","hands","body"] : ["legs","feet"]) {
      const item = wornItem(s,slot);
      guard += (Data.items[item?.id]?.guard ?? 0) * wearableCondition(item);
      if (!canMend(item) || item.condition === 0) continue;
      if (item.qty > 1) {
        p.bag.splice(p.bag.indexOf(item)+1,0,{...item,qty:item.qty-1});
        item.qty = 1;
      }
      item.condition = Math.max(0,(item.condition ?? 100)-wear);
    }
    guard = Math.min(.7,guard);
    const shielded = p.sleeping && isNight(s) && cinemaBuff(s);
    const amount = z.stats.damage * infectedDamage(s) * (1 - guard) * (shielded ? Data.cinemaTrap.sleepDamage : 1);
    const absorbed = guard > 0 && s.world.rng() < guard * .9;
    p.hp = Math.max(0, p.hp - amount); p.flash = .75; p.resting = false;
    if (!p.hp) s.deathCause = "a " + z.stats.name.toLowerCase();
    if (absorbed) notify(s, "Your clothing absorbs the worst of it.", true);
    else {
      if (p.wounds.length < 6) p.wounds.push({part, type, bleed: type === "scratch" ? .07 : .18, bandaged: false, clean: false, infection: 0, age: 0});
      const infected = type === "bite" ? s.rules.infection !== "off" :
        s.rules.infection === "wounds" && s.world.rng() < (type === "cut" ? .25 : .07);
      if (infected) p.exposure = Math.max(1, p.exposure);
      notify(s, infected ? "The " + type + " transmitted the virus. Treat the wound." :
        (part === "arm" ? "Arm " : "Leg ") + type + ". Apply a bandage.", true);
    }
    s.effects.push({x: p.x, y: p.y, text: "−" + Math.round(amount), color: "#ff9778", life: .7});
  }

  function move(s, actor, dx, dy) {
    const beforeX = actor.x, beforeY = actor.y;
    const driving = actor === s.player && actor.vehicle;
    const radius = driving ? .40 : .18;
    const passable = (x, y) => World.clear(s.world, x, y, radius) &&
      (!driving || World.drivable(World.tileAt(s.world, x, y)));
    if (driving) {
      if (!passable(actor.x + dx, actor.y + dy)) return false;
      actor.x += dx; actor.y += dy;
      return Math.hypot(dx, dy) > .0001;
    }
    if (passable(actor.x + dx, actor.y)) actor.x += dx;
    if (passable(actor.x, actor.y + dy)) actor.y += dy;
    // Corner assist: when blocked head-on beside an opening (door, gap), slide toward the opening.
    const wanted = Math.hypot(dx, dy), got = Math.hypot(actor.x - beforeX, actor.y - beforeY);
    if (wanted > 1e-6 && got < wanted * .5) {
      const nx = -dy / wanted, ny = dx / wanted;
      assist: for (const off of [.1, .2, .3, .4]) for (const side of [1, -1]) {
        const ox = beforeX + nx * off * side, oy = beforeY + ny * off * side;
        if (passable(ox, oy) && passable(ox + dx, oy + dy)) {
          const step = Math.min(off, wanted * 1.2);
          actor.x = beforeX + nx * step * side; actor.y = beforeY + ny * step * side;
          if (passable(actor.x + dx, actor.y + dy)) { actor.x += dx; actor.y += dy; }
          break assist;
        }
      }
    }
    const screenX = actor.x - beforeX - actor.y + beforeY;
    if (!(actor.swing > 0) && Math.abs(screenX) > .008) actor.face = Math.sign(screenX);
    const length = Math.hypot(actor.x - beforeX, actor.y - beforeY);
    if (length > .0001) {
      actor.headingX = (actor.x - beforeX) / length;
      actor.headingY = (actor.y - beforeY) / length;
    }
    return length > .0001;
  }

  function follow(s, actor, amount, enemy = false) {
    let moved = false;
    while (amount > .0001 && actor.path.length) {
      const next = actor.path[0], d = distance(actor, next);
      if (d < .03) { actor.path.shift(); continue; }
      const tile = World.tileAt(s.world, next.x, next.y);
      if (tile?.kind === "door" && d < 1.45) {
        const o = s.world.objects.find(o => o.id === tile.doorId);
        if (o && enemy) {
          actor.bash = o.id;
          return moved;
        }
        if (!o || o.boards || !door(s, o, true)) {
          actor.path = [];
          if (actor === s.player) notify(s, "The opening blocks the route.");
          return moved;
        }
      }
      const step = Math.min(d, amount);
      if (!move(s, actor, (next.x - actor.x) / d * step, (next.y - actor.y) / d * step)) { actor.path = []; break; }
      amount -= step; moved = true;
      if (distance(actor, next) < .03) actor.path.shift();
    }
    return moved;
  }

  function walkTo(s, x, y, run = false) {
    s.target = null; s.interaction = null; s.player.resting = false;
    s.dash = run;
    if (run) s.quiet = false;
    const driving = Boolean(s.player.vehicle);
    const avoid = s.world.underground ? tile => !exploredTile(s,tile.x,tile.y) && !canSee(s,tile.x+.5,tile.y+.5) : sneakAvoids(s);
    s.player.path = World.route(s.world, s.player.x, s.player.y, x, y, 0, !driving, driving, null, avoid);
    if (driving && !s.player.path.length) notify(s, "Choose a clear route outdoors.");
  }

  const sneakAvoids = s => s.quiet && !s.atmosphere.awake ? t => t.tendril && s.world.explored[t.y*s.world.width+t.x] : null;

  function target(s, enemy) {
    if (s.player.vehicle) { notify(s, "Exit the vehicle to fight."); return; }
    if (s.target === enemy) return;
    s.target = enemy; s.interaction = null; s.player.resting = false;
    s.player.path = []; s.replan = 0; s.aim = 0; s.dash = false;
  }

  function approach(s, object) {
    const driving = Boolean(s.player.vehicle);
    if (driving && object.action !== "travel") { notify(s, "Exit the vehicle to interact."); return false; }
    s.target = null; s.dash = false; s.player.resting = false;
    s.interaction = null;
    if (distance(s.player, object) <= 1.85 && lineOfSight(s, s.player, object)) { s.player.path = []; return true; }
    const canUse = tile => World.sees(s.world, tile.x + .5, tile.y + .5, object.x, object.y);
    s.player.path = World.route(s.world, s.player.x, s.player.y, object.x, object.y, 1.5, !driving, driving, canUse,
      object.action === "fungus" ? null : sneakAvoids(s));
    s.interaction = s.player.path.length ? object.id : null;
    if (!s.interaction && object.action) notify(s, "No clear path to " + object.name.toLowerCase() + ".", true);
    return false;
  }

  const audibleStride = new WeakMap();

  function updatePlayer(s, dt, input) {
    const p = s.player;
    if (p.grabbed > 0 && p.grabbed - dt <= 0) p.grabCool = 4;
    for (const key of ["cooldown", "flash", "swing", "staminaDelay", "medicine", "grabbed", "grabCool"]) p[key] = Math.max(0, (p[key] ?? 0) - dt);
    const manual = input.x || input.y;
    if (manual) { p.path = []; s.target = null; s.interaction = null; p.resting = false; }
    if (p.vehicle) { updateVehicle(s, dt, input); return; }
    if (s.target && (s.target.hp <= 0 || !canSee(s, s.target.x, s.target.y))) endPursuit(s);
    if (s.target) {
      const w = weaponData(s);
      if (inAttackRange(s, s.target, w.range)) {
        p.path = [];
        s.aim = Math.min(1, s.aim + dt * 1.1);
        if (!w.firearm || s.aim > .45) attack(s, s.target);
      } else {
        s.aim = 0; s.replan -= dt;
        if (s.replan <= 0) {
          p.path = World.route(s.world, p.x, p.y, s.target.x, s.target.y, 0, true);
          s.replan = .4;
          if (!p.path.length) endPursuit(s);
        }
      }
    }
    const load = weight(p.bag) / capacity(s), injury = p.wounds.some(w => w.part === "leg" && !w.bandaged);
    const cold = p.temperature < 35.9;
    s.running = !s.quiet && p.stamina > 8 && p.fatigue < 85 && !(p.grabbed > 0) && !(p.fracture > 0) && (s.dash || input.run) && (manual || p.path.length);
    const surface = World.tileAt(s.world, p.x, p.y)?.surface;
    const footing = surface === "sand" ? .78 : surface === "field" ? .88 : 1;
    const combatStep = s.quiet && (manual || p.path.length) && s.world.enemies.some(z =>
      z.hp > 0 && !z.dormant && distance(z,p) < 5 && lineOfSight(s,p,z));
    const speed = (s.running ? 4 : s.quiet ? 1.6 * (combatStep ? 1 + .025 * level(s,"nimble") : 1) : 2.55) * (injury ? .8 : 1) * (load > .9 ? .9 : 1) * (p.fatigue > 85 || cold ? .8 : 1) * (p.grabbed > 0 ? .4 : 1) * (p.fracture > 0 ? (p.splinted ? Data.fracture.splintSpeed : Data.fracture.brokenSpeed) : 1) * footing;
    const startX = p.x, startY = p.y;
    if (manual) {
      const dx = input.x * .5 + input.y, dy = input.y - input.x * .5, mag = Math.hypot(dx, dy);
      const strength = Math.min(1, Math.hypot(input.x, input.y));
      p.moving = move(s, p, dx / mag * speed * dt * strength, dy / mag * speed * dt * strength);
    } else p.moving = follow(s, p, speed * dt);
    const travelled = Math.hypot(p.x-startX,p.y-startY);
    if (!p.path.length) s.dash = false;
    if (p.grabbed > 0 && p.moving) { p.grabbed = Math.max(0, p.grabbed - dt * 1.2); if (!p.grabbed) p.grabCool = 4; }
    if (!World.clear(s.world, p.x, p.y)) unstick(s, true);
    else if ((manual || p.path.length) && !p.moving) {
      s.stuck = (s.stuck ?? 0) + dt;
      if (s.stuck > 4 && !s.stuckHinted) { s.stuckHinted = true; notify(s, "You seem stuck. Open the menu and choose Free me.", true); }
    } else { s.stuck = 0; s.stuckHinted = false; }
    if (p.moving) {
      recordPlaytest(s, "move");
      p.footstep -= dt;
      s.aim = Math.max(0, s.aim - dt * 2);
      if (p.footstep <= 0) {
        p.footstep = s.running ? .22 : .4;
        const quiet = (s.role === "scout" ? .75 : 1) * (1 - level(s,"lightfooted") * .03) *
          (s.quiet ? 1 - level(s,"sneaking") * .04 : 1);
        if (combatStep) addXp(s,"nimble",.3);
        if (s.world.enemies.some(z => z.hp > 0 && distance(z,p) < 8)) {
          addXp(s,"lightfooted",.2);
          if (s.quiet) addXp(s,"sneaking",.25);
        }
        const terrain = surface === "cave" ? 1.35 : surface === "grass" || surface === "sand" ? .8 :
          surface === "tile" || surface === "rail" ? 1.15 : 1;
        const rain = s.weather === "Rain" && surface !== "tile" ? .8 : 1;
        noise(s, p.x, p.y, (s.running ? 6.5 : s.quiet ? 1 : 2.4) * quiet * terrain * rain);
      }
      // Audible strides follow distance; the separate noise timer drives infected AI.
      let remaining = (audibleStride.get(p) ?? 0) - travelled;
      if (remaining <= 0) {
        remaining += s.running ? .92 : 1.05;
        if (!s.sounds.length) {
          const soft = surface === "grass" || surface === "sand" || surface === "field";
          hear(s,soft ? "stepSoft" : "stepHard",p,s.quiet ? .38 : s.running ? 1.22 : .78);
        }
      }
      audibleStride.set(p,remaining);
    }
    const fit = 1 + level(s, "fitness") * .05;
    if (s.running && p.moving) {
      p.stamina = Math.max(0, p.stamina - 13 * dt * staminaCost(s) / (Data.roles[s.role].fitness * fit * (1 + level(s,"running") * .035)));
      p.staminaDelay = .4;
      addXp(s, "fitness", dt * .5);
      addXp(s,"running",travelled * .15);
    } else if (!p.staminaDelay) p.stamina = Math.min(100, p.stamina + dt * (p.moving ? 5 : 12) * fit * (p.fatigue > 70 || cold ? .6 : 1));
  }

  function canTargetEva(npc) {
    return npc.hp > 0 && !npc.ridingVehicle && npc.mode !== "injured" && npc.mode !== "dead";
  }

  function updateEnemies(s, dt) {
    const p = s.player, npc = s.world.npc;
    const lit = World.tileAt(s.world, p.x, p.y)?.building && hasPower(s, p);
    const dark = isNight(s) || s.world.underground;
    const light = activeLight(s) && dark;
    const vision = light ? 1.2 : lit ? 1 : s.world.underground ? .43 : dark ? .6 : s.weather === "Rain" ? .85 : 1;
    let ambient = null, bestDistance = 16;
    const chooseVoice = s.elapsed >= (s.nextZombieAmbience ?? 0);
    for (const z of s.world.enemies) {
      if (z.hp <= 0 || distance(p, z) > 23 && z.alert <= 0) continue;
      if (z.dormant) {
        const close = distance(z,p) < 2.6 && lineOfSight(s,z,p);
        const companionClose = canTargetEva(npc) && distance(z,npc) < 2.3 && lineOfSight(s,z,npc);
        if (z.alert < 8 && (z.origin === "cinema-sleeper" || !close && !companionClose)) continue;
        z.dormant = false;
        z.cooldown = Math.max(z.cooldown,1.2);
        z.replan = 0;
        if (close || companionClose) {
          Object.assign(z,{alert:8,chaseX:p.x,chaseY:p.y});
          hear(s,"near",z);
          notify(s,"Something stirs by the furniture.",true);
        }
        continue;
      }
      z.cooldown -= dt; z.replan -= dt;
      z.flash = Math.max(0, z.flash - dt); z.stagger = Math.max(0, z.stagger - dt);
      z.alert = Math.max(0, z.alert - dt); z.swing = Math.max(0, (z.swing || 0) - dt);
      const d = distance(z, p), sight = (s.quiet ? 2.6 * (1 - level(s,"sneaking") * .025) : s.running ? 7.5 : 5.7) * vision;
      const seen = d < sight && lineOfSight(s, z, p);
      const npcSeen = canTargetEva(npc) && distance(z, npc) < 3.8 && lineOfSight(s, z, npc);
      const victim = npcSeen && (!seen || distance(z, npc) < d) ? npc : p;
      let voice = zombieVoices.get(z);
      if (!voice) {
        voice = {noticed:false,next:s.elapsed+1+(z.phase ?? 0)%6};
        zombieVoices.set(z,voice);
      }
      if (seen && !voice.noticed) {
        voice.noticed = true;
        hearZombie(s,"notice",z);
      }
      if (seen || npcSeen) {
        z.alert = 8; z.chaseX = victim.x; z.chaseY = victim.y;
      }
      if (z.stagger > 0) { z.moving = false; endWindup(z); continue; }
      if (z.windup > 0) {
        if (!z.windupTarget) z.windupTarget = victim === npc ? "eva" : "player";
        z.windup -= dt; z.moving = false;
        if (z.windup <= 0) {
          const pending = z.windupTarget === "eva" ? npc : p;
          endWindup(z);
          z.swing = .18;
          hearZombie(s,"attack",z);
          if ((pending === p || canTargetEva(npc)) && distance(z, pending) < 1.15 && lineOfSight(s, z, pending)) {
            if (pending === p) hurt(s, z);
            else {
              npc.hp = Math.max(0, npc.hp - z.stats.damage * infectedDamage(s));
              npc.flash = .5;
              if (!npc.hp) { npc.mode = "dead"; notify(s, "Eva died from her injuries.", true); }
            }
          }
        }
        continue;
      }
      if (distance(z, victim) < 1 && (seen || npcSeen)) {
        z.moving = false;
        if (z.cooldown <= 0) {
          z.windup = windupTime + (z.kind === "brute" ? bruteWindup : 0) + (assist(s, "windup") && victim === p ? .35 : 0);
          z.windupTarget = victim === npc ? "eva" : "player";
          z.cooldown = 1.5;
          faceTowards(z, victim);
        }
        continue;
      }
      if (z.bash) {
        const o = s.world.objects.find(o => o.id === z.bash);
        if (!o || o.open || distance(z, o) > 1.55) z.bash = null;
        else {
          if (z.cooldown <= 0) {
            o.hp -= 19; z.cooldown = 1.1; z.swing = .2; noise(s, o.x, o.y, 5);
            if (o.hp <= 0) {
              Object.assign(o, {boards:0, open:true, hp:0, locked:false, latched:false, broken:true});
              World.sync(s.world);
              hear(s,o.kind === "window" ? "glassSmash" : "crash",o);
              z.bash = null;
              notify(s, o.name + " gave way.", true);
            }
          }
          continue;
        }
      }
      if (z.alert > 0 && z.replan <= 0) {
        z.path = World.route(s.world, z.x, z.y, z.chaseX, z.chaseY, 0, "force");
        z.replan = .7 + s.world.rng() * .4;
      } else if (z.alert <= 0) {
        z.wander -= dt;
        if (z.wander <= 0) {
          z.wander = 3 + s.world.rng() * 8;
          const width = z.origin === "cinema-winner" ? 9 : 5;
          const x = z.homeX + (s.world.rng() - .5) * width, y = z.homeY + (s.world.rng() - .5) * 5;
          if (World.clear(s.world, x, y)) z.path = World.route(s.world, z.x, z.y, x, y);
        }
      }
      z.moving = follow(s, z, z.stats.speed * dt * (z.alert > 0 ? 1 : .45) * (z.origin === "cinema-winner" ? .85 : 1), true);
      if (chooseVoice && d < bestDistance && s.elapsed >= voice.next && (z.alert <= 0 || z.moving)) {
        bestDistance = d;
        ambient = z;
      }
    }
    if (ambient) {
      const chase = ambient.alert > 0, phase = ambient.phase ?? 0;
      zombieVoices.get(ambient).next = s.elapsed + (chase ? 3 : 8) + ((phase+s.elapsed)%4);
      s.nextZombieAmbience = s.elapsed + 1.2;
      hearZombie(s,chase ? "chase" : "idle",ambient);
    }
  }

  function updateNpc(s, dt) {
    const n = s.world.npc;
    if (n.mode === "away") return;
    n.flash = Math.max(0, n.flash - dt);
    if (n.ridingVehicle && n.ridingVehicle === s.player.vehicle) {
      n.x = s.player.x; n.y = s.player.y; n.moving = false;
      return;
    }
    if (n.mode !== "follow" || n.hp <= 0) { n.moving = false; return; }
    if (distance(n, s.player) > 2.4) {
      n.replan -= dt;
      if (n.replan <= 0) { n.path = World.route(s.world, n.x, n.y, s.player.x, s.player.y, 0, true); n.replan = .8; }
      n.moving = follow(s, n, dt * (s.quiet ? 1.65 : 2.6));
    } else { n.moving = false; n.path = []; }
    if (s.world.base && !s.flags.rescued && World.tileAt(s.world, n.x, n.y)?.building === s.world.base.id) {
      s.flags.rescued = true; n.mode = "refuge";
      const bag = weight(s.player.bag) + Data.items.part.weight <= capacity(s) ? s.player.bag :
        s.world.objects.find(o => o.storage && o.building === s.world.base.id).loot;
      add(bag, "part", 1);
      notify(s, "Eva reached the shelter and gave you a radio component.");
    }
  }

  function explore(s) {
    const p = s.player, optics = sight(s), radius = Math.ceil(optics.lamp ? Data.flashlight.range : optics.fires?.length ? 8 : optics.radius);
    const {width, height} = s.world;
    for (let y = Math.max(0, Math.floor(p.y) - radius); y <= Math.min(height - 1, Math.floor(p.y) + radius); y++) {
      for (let x = Math.max(0, Math.floor(p.x) - radius); x <= Math.min(width - 1, Math.floor(p.x) + radius); x++) {
        if (canSee(s, x + .5, y + .5, optics)) s.world.explored[y * width + x] = 1;
      }
    }
  }

  function updateExposure(s, dt) {
    if (s.rules.exposure === "off") return;
    const p = s.player, shelter = p.vehicle || World.tileAt(s.world, p.x, p.y)?.building;
    const rain = !shelter && s.weather === "Rain", jacket = p.gear.body === "raincoat" ? wearableCondition(wornItem(s,"body")) : 0;
    const wetRate = rain ? (2.1 - 1.55*jacket) : shelter ? -1.4 : -.45;
    p.wetness = clamp(p.wetness + dt * wetRate, 0, 100);
    const target = shelter ? 37 - p.wetness * .007 : 36.6 - p.wetness * .016 - Number(isNight(s)) * .7 - (Regions.definitions[s.world.region].cold || 0) +
      clothingWarmth(s) + (s.running ? .35 : 0) - season(s).chill;
    p.temperature = clamp(p.temperature + (target - p.temperature) * Math.min(1, dt * .025), 33, 37.3);
    if (p.temperature < 34.5) { p.hp -= dt * .16; s.harm = "hypothermia"; }
  }

  function updateNeeds(s, dt) {
    const p = s.player, rate = s.rules.needs / 100 * pressure(s), gradual = s.rules.care === "gradual";
    const inDanger = threats(s).length > 0;
    const floor = Data.modes[s.difficulty]?.noStarve ? 8 : 0;
    p.hunger = Math.max(floor, p.hunger - dt * .07 * rate * (p.sleeping ? .5 : 1));
    p.hydration = Math.max(floor, p.hydration - dt * (s.running ? .15 : .1) * rate * (p.sleeping ? .5 : 1));
    p.fatigue = clamp(p.fatigue + dt * (p.sleeping ? -.45 : p.resting ? -1.6 : (s.running ? .075 : .04) * rate), 0, 100);
    if (p.resting) {
      if (inDanger) { p.resting = false; notify(s, "Danger interrupted your rest.", true); }
      else if (p.hunger > 25 && p.hydration > 25 && (!gradual || !p.wounds.some(w => !w.bandaged))) {
        p.hp = Math.min(100, p.hp + dt * (gradual ? .38 : .12) * (p.sleeping ? .5 : 1));
      }
    }
    p.panic = clamp(p.panic + dt * (inDanger ? 6 * (cinemaBuff(s) ? Data.cinemaTrap.panicRate : 1) : -9), 0, 100);
    let pain = 0;
    for (const w of p.wounds) {
      w.age += dt;
      if (!w.bandaged) { p.hp -= w.bleed * dt * (assist(s, "bleed") ? .55 : 1); s.harm = "blood loss"; }
      if (!w.clean) w.infection = Math.min(100, w.infection + dt * (gradual ? w.bandaged ? .04 : .24 : .018));
      if (gradual && w.infection >= 40) { p.hp -= dt * .08; s.harm = "a wound infection"; }
      if (gradual && w.bandaged) {
        const progress = (p.resting ? 1.8 : 1) * (w.clean ? 1 : .5) * Data.roles[s.role].medical;
        w.healing = (w.healing ?? 0) + dt * progress;
      }
      pain += (w.bandaged ? 6 : 14) + w.infection * .1;
    }
    p.wounds = p.wounds.filter(w => gradual ? (w.healing ?? 0) < healTime(w) : !(w.bandaged && w.clean && w.age > 300));
    p.pain = clamp(pain, 0, 100);
    if (p.exposure) { p.exposure = Math.min(100, p.exposure + dt * .045); if (p.exposure >= 100) { p.hp -= dt * 2; s.harm = "the virus"; } }
    if (!p.hunger || !p.hydration) { p.hp -= dt * .2; s.harm = p.hydration ? "hunger" : p.hunger ? "thirst" : "thirst and hunger"; }
    p.hp = clamp(p.hp, 0, 100);
  }

  const healTime = wound => ({scratch:80, cut:150, bite:210}[wound.type]);

  function tick(s, dt, input = {x: 0, y: 0, run: false}) {
    if (s.mode !== "play") return;
    const previousMinutes = s.minutes;
    const minutes = dt * s.rules.clock;
    s.elapsed += dt; s.minutes += minutes;
    if (runDay(s.minutes) !== runDay(previousMinutes)) closeDaily(s);
    s.weather = localWeather(s);
    settleDispatch(s);
    updatePlayer(s, dt, input);
    updateAtmosphere(s,dt);
    drainLight(s, minutes);
    healFracture(s, minutes);
    updateDoorLure(s, dt);
    updateFungalAlert(s);
    updateEnemies(s, dt);
    updateNpc(s, dt);
    updateNeeds(s, dt);
    updateSickness(s, dt);
    updateExposure(s, dt);
    if (s.guideStep === 4 && (isNight(s) || s.minutes >= 1440) && !s.player.wounds.some(w => !w.bandaged)) s.guideStep = 5;
    if (s.guideStep === 5 && (isNight(s) || s.minutes >= 1440 || s.firstSleep) && s.world.base &&
        World.tileAt(s.world, s.player.x, s.player.y)?.building === s.world.base.id) s.guideStep = 6;
    updateUtilities(s, previousMinutes, minutes);
    const raining = s.weather === "Rain";
    updateOutdoor(s, minutes, raining);
    if (s.longHaul && s.player.hp > 0) updateLongHaul(s);
    if (s.campaign) { updateCinemaTrap(s); updateCinemaBuff(s); }
    if (s.campaign?.hints.objective) {
      const hint = CampaignHints.next(s.campaign.hints, s.minutes);
      if (hint) notify(s, "Hint: " + hint);
    }
    const interval = Data.garden.dutyInterval;
    if (!raining && Math.floor(previousMinutes / interval) !== Math.floor(s.minutes / interval)) tendShelterGarden(s);
    for (const effect of s.effects) effect.life -= dt;
    s.effects = s.effects.filter(effect => effect.life > 0);
    s.exploredAt -= dt;
    if (s.exploredAt <= 0) { explore(s); s.exploredAt = .4; }
    if (s.world.region === Regions.home && s.elapsed >= s.nextEvent) {
      s.nextEvent = s.elapsed + 180;
      if (s.rules.count > 0 && s.rules.hordes !== "off" && !(s.difficultyOptions && firstNight(s))) {
        const x = s.world.rng() < .5 ? 29.5 : 47.5, y = 29.5;
        noise(s, x, y, 32);
        notify(s, x > 30 ? "A siren to the east is drawing the horde." : "A crash in the centre of town is drawing the infected.");
      }
    }
    if (s.player.hp <= 0) {
      recordPlaytest(s, "death");
      s.deathCause ??= s.harm || "unknown causes";
      s.afterlifePending = s.player.exposure > 0 && Afterlife.eligible(s,Math.random());
      s.mode = "dead";
      s.target = null;
      s.player.path = [];
      notify(s, "Your story ended in " + Regions.definitions[s.world.region].name + ".", true);
    }
    if (s.sleepPending && s.mode === "play") { s.sleepPending = false; fastSleep(s); }
  }

  // Open doors invite the dead in. Wandering infected near an open door sometimes drift inside, and
  // when the survivor is inside a house with an open door, infected nearby notice and come.
  function updateDoorLure(s, dt) {
    s.lureCheck = (s.lureCheck ?? 0) - dt;
    if (s.lureCheck > 0) return;
    s.lureCheck = 1.5;
    const world = s.world, p = s.player, here = World.tileAt(world, p.x, p.y)?.building;
    const doors = world.objects.filter(o => o.action === "door" && o.kind === "door" && o.open && o.building);
    if (!doors.length) return;
    let lured = 0;
    for (const z of world.enemies) {
      if (z.hp <= 0 || z.alert > 0 || z.dormant) continue;
      for (const door of doors) {
        const d = Math.hypot(z.x - door.x, z.y - door.y);
        const inside = here && door.building === here;
        if (d > (inside ? 13 : 8) || World.tileAt(world, z.x, z.y)?.building === door.building) continue;
        if (s.world.rng() < (inside ? .3 : .1)) {
          const b = world.buildings.find(x => x.id === door.building);
          z.alert = inside ? 9 : 6;
          z.chaseX = inside ? p.x : b.x + b.w / 2; z.chaseY = inside ? p.y : b.y + b.h / 2 - 1; z.replan = 0;
          lured++;
        }
        break;
      }
    }
    if (lured && here && s.lureNote !== here) { s.lureNote = here; notify(s, "The open door is drawing infected toward you. Close it.", true); }
    if (!here) s.lureNote = null;
  }

  function breakLeg(s, message) {
    const p = s.player;
    if (p.fracture > 0) return;
    p.fracture = Data.fracture.healMinutes; p.splinted = false; p.path = []; s.dash = false;
    notify(s, message + " Make a splint (wood and cloth) and rest.", true);
    s.effects.push({x: p.x, y: p.y, text: "FRACTURE", color: "#e3a289", life: 1.2});
  }

  function healFracture(s, minutes) {
    const p = s.player;
    if (!(p.fracture > 0)) return;
    const rate = (p.splinted ? 1 : Data.fracture.unsplintedHeal) * (p.resting ? 1.6 : 1) * (1 + level(s, "medical") * .1);
    p.fracture = Math.max(0, p.fracture - minutes * rate);
    if (!p.fracture) { p.splinted = false; notify(s, "Your leg has healed."); }
  }

  // Dead infected stay where they fall, rot away after two days, and make nearby survivors ill.
  function updateSickness(s, dt) {
    const p = s.player;
    s.corpseCheck = (s.corpseCheck ?? 0) - dt;
    if (s.corpseCheck <= 0) {
      s.corpseCheck = 5;
      const corpses = s.world.objects.filter(o => o.corpse);
      const gone = new Set(corpses.filter(o => s.minutes - o.died > (o.loot.length ? 5760 : 2880)).map(o => o));
      const keep = corpses.filter(o => !gone.has(o)).sort((a, b) => a.died - b.died);
      for (const o of keep.slice(0, Math.max(0, keep.length - 60))) gone.add(o);
      if (gone.size) s.world.objects = s.world.objects.filter(o => !gone.has(o));
    }
    const before = p.sick ?? 0;
    const near = s.world.objects.reduce((n, o) => n + (o.corpse && distance(o, p) < 4 ? 1 : 0), 0);
    let rise = near >= 2 ? .02 * Math.min(near, 8) : 0;
    if (p.temperature < 35.5 && p.wetness >= 45) rise += .04;
    const fall = rise ? 0 : p.sleeping ? .2 : p.resting ? .15 : .06;
    p.sick = clamp(before + dt * (rise - fall), 0, 100);
    if (before < 20 && p.sick >= 20) notify(s, near >= 2 ? "The smell of the dead is making you queasy. Move away from the bodies." : "You are catching a chill. Dry off and warm up.", true);
    if (p.sick >= 40) p.fatigue = clamp(p.fatigue + dt * .02 * (p.sick / 100), 0, 100);
    if (p.sick > 70) { p.hp -= dt * .03 * (p.sick - 70) / 30; s.harm = "illness"; }
  }

  // Nearest standable point around (x, y). `accept` can add terrain rules (e.g. drivable).
  function freeSpot(s, x, y, maxRadius = 6, radius = .18, accept = () => true, minRadius = 0) {
    for (let r = minRadius; r <= maxRadius; r += .5) {
      const steps = r ? Math.max(8, Math.round(r * 10)) : 1;
      for (let i = 0; i < steps; i++) {
        const a = i / steps * Math.PI * 2, point = {x: x + Math.cos(a) * r, y: y + Math.sin(a) * r};
        if (World.clear(s.world, point.x, point.y, radius) && accept(World.tileAt(s.world, point.x, point.y)) &&
            !s.world.enemies.some(z => z.hp > 0 && distance(z, point) < .6)) return point;
      }
    }
    return null;
  }

  // Always-available way out when the survivor is wedged in a wall, a corner or a vehicle.
  function unstick(s, automatic = false) {
    const p = s.player;
    if (s.mode !== "play") return false;
    if (p.vehicle) return exitVehicle(s, true);
    const clear = World.clear(s.world, p.x, p.y);
    const spot = clear ? freeSpot(s, p.x + .01, p.y + .01, 6) : freeSpot(s, p.x, p.y, 8);
    let target = spot;
    if (clear && !automatic) {
      // Wedged on open ground: step to the nearest clear point at least 1.2 tiles away.
      target = freeSpot(s, p.x, p.y, 5, .18, () => true, 1.2);
    }
    if (!target) { if (!automatic) notify(s, "No free ground nearby.", true); return false; }
    p.x = target.x; p.y = target.y; p.path = []; p.moving = false; s.target = null; s.interaction = null; s.stuck = 0; s.stuckHinted = false; p.grabbed = 0;
    notify(s, automatic ? "You were pushed out of a blocked spot." : "You worked yourself free.");
    return true;
  }

  function startSleep(s) {
    const p = s.player;
    if (s.mode !== "play" || p.vehicle) return false;
    if (threats(s).length) { notify(s, "Infected are nearby. Find a safer place to sleep.", true); return false; }
    if (p.fatigue < 20) { notify(s, "You are not tired enough to sleep."); return false; }
    if (p.hunger < 12 || p.hydration < 12) { notify(s, "You are too hungry or thirsty to sleep.", true); return false; }
    return true;
  }

  // Fast-forwards the normal simulation while the survivor sleeps. Danger, pain or morning ends it.
  function fastSleep(s) {
    const p = s.player, start = s.minutes, hp0 = p.hp;
    let cause = "";
    p.resting = true; p.sleeping = true; s.quiet = false; s.dash = false;
    for (let i = 0; i < 6000 && s.mode === "play"; i++) {
      tick(s, .25);
      if (p.hp < hp0 - .05) { cause = "Pain woke you. "; break; }
      if (!p.resting) { cause = "Something woke you. "; break; }
      if (p.fatigue <= 4 || s.minutes - start >= 600) break;
    }
    p.sleeping = false; p.resting = false;
    if (s.guideStep !== undefined && s.mode === "play" && s.minutes - start >= 60) s.firstSleep = true;
    if (s.mode === "play") { const h = Math.round((s.minutes - start) / 6) / 10; notify(s, cause + "You slept " + h + (h === 1 ? " hour." : " hours.")); }
  }

  function sleep(s) {
    if (!startSleep(s)) return false;
    fastSleep(s);
    return true;
  }

  // Graded survivor states ("moodles"), most severe first.
  function moodles(s) {
    const p = s.player, list = [];
    const low = (value, cuts) => cuts.filter(c => value < c).length;
    const high = (value, cuts) => cuts.filter(c => value >= c).length;
    const add = (id, labels, tier) => { if (tier > 0) list.push({id, level: tier, label: labels[Math.min(tier, labels.length) - 1]}); };
    const open = p.wounds.filter(w => !w.bandaged).length, infection = p.wounds.reduce((m, w) => Math.max(m, w.infection), 0);
    add("fracture", ["Splinted leg", "Broken leg"], p.fracture > 0 ? (p.splinted ? 1 : 3) : 0);
    add("grabbed", ["Grabbed"], (p.grabbed ?? 0) > 0 ? 4 : 0);
    add("hurt", ["Hurt", "Injured", "Badly injured", "Critical"], low(p.hp, [80, 60, 40, 20]));
    add("bleeding", ["Bleeding", "Bleeding heavily"], Math.min(2, open));
    add("woundinfection", ["Wound infected", "Wound badly infected"], infection >= 70 ? 2 : infection >= 40 ? 1 : 0);
    add("sick", ["Queasy", "Sick", "Very sick"], high(p.sick ?? 0, [20, 45, 70]));
    add("hungry", ["Peckish", "Hungry", "Very hungry", "Starving"], low(p.hunger, [50, 30, 15, 5]));
    add("thirsty", ["Thirsty", "Very thirsty", "Parched", "Dehydrated"], low(p.hydration, [50, 30, 15, 5]));
    add("tired", ["Drowsy", "Tired", "Very tired", "Exhausted"], high(p.fatigue, [60, 75, 88, 95]));
    add("winded", ["Winded", "Out of breath", "Gasping", "Spent"], low(p.stamina, [45, 30, 15, 5]));
    add("pain", ["Sore", "In pain", "Severe pain", "Agony"], p.medicine ? 0 : high(p.pain, [20, 40, 60, 80]));
    add("panic", ["Startled", "Anxious", "Panicked", "Terrified"], high(p.panic, [8, 25, 50, 75]));
    add("cold", ["Chilly", "Cold", "Freezing", "Hypothermic"], low(p.temperature, [35.9, 35.2, 34.5, 33.5]));
    add("wet", ["Wet", "Soaked"], high(p.wetness, [45, 80]));
    add("load", ["Heavy load", "Very heavy load", "Overloaded"], high(weight(p.bag) / capacity(s), [.75, .9, .97]));
    return list.sort((a, b) => b.level - a.level);
  }

  function snapshotPlayer(s) {
    return {...s.player,path:[],moving:false,cooldown:0,flash:0,swing:0,resting:false,sleeping:false,grabbed:0,grabCool:0,driveSpeed:0,velocityX:0,velocityY:0};
  }

  function snapshotZone(s) {
    const a = s.atmosphere;
    return {booksStocked:s.world.booksStocked, coverage:s.world.coverage, routeCoverage:s.world.routeCoverage, mapRevision:Regions.mapRevision,ledgerRevision:Chronicle.revision,fieldRevision:FieldStories.revision,atmosphere:{...a,pending:a.pending?{...a.pending}:null,alarm:a.alarm?{...a.alarm}:null},
      waypoint:s.waypoint,mapPins:s.mapPins.map(pin => ({...pin})),npc:{...s.world.npc,path:[],moving:false},
      objects:s.world.objects,enemies:s.world.enemies.map(({stats,path,...enemy}) => ({...enemy,path:[]})),
      explored:Array.from(s.world.explored),rng:s.world.rng.state()};
  }

  function snapshotRun(s) {
    return {
      schema: Data.saveVersion, generator: s.world.generator, seed: s.seed, difficulty: s.difficulty, role: s.role, rules:{...s.rules},
      region:s.world.region, regionStates:s.regionStates,
      elapsed: s.elapsed, minutes: s.minutes, mode: s.mode, quiet: s.quiet, kills: s.kills, serial: s.serial, controlStart: s.controlStart,
      daily:s.daily?.day === runDay(s.minutes) ? {...s.daily} : undefined,
      dailyHistory:s.dailyHistory.map(entry=>({...entry})),
      guideStep:s.guideStep, firstSleep:s.firstSleep, pinStory:s.pinStory, playtest:s.playtest,
      fungalAlert:s.fungalAlert ? {...s.fungalAlert} : null, nextFungalAlert:s.nextFungalAlert,
      longHaul:s.longHaul ? {...s.longHaul} : undefined,
      campaign:s.campaign ? {clues:s.campaign.clues, completed:[...s.campaign.completed], hints:{...s.campaign.hints}, buffUntil:s.campaign.buffUntil} : undefined,
      difficultyOptions:s.difficultyOptions, difficultyChanges:s.difficultyChanges,
      recoveryUsed:s.recoveryUsed, shelterIdleSince:s.shelterIdleSince,
      nextEvent: s.nextEvent, deathCause: s.deathCause, afterlifePending:s.afterlifePending ?? false, flags: {...s.flags}, messages: s.messages, clues: [...s.clues], supplyRun: s.supplyRun,
      ledger:{found:{...s.ledger.found},dispatch:s.ledger.dispatch ? {...s.ledger.dispatch} : null},
      zoom: s.zoom, lookahead: s.lookahead, roofsHidden: s.roofsHidden, player:snapshotPlayer(s)
    };
  }

  const snapshot = s => ({...snapshotRun(s),...snapshotZone(s)});

  function zoneShape(data, region) {
    const map = Regions.definitions[region];
    const mapSize = data?.mapRevision === undefined ? Regions.oldWidth(region)**2 : map?.width * map?.height;
    const supportedMap = data?.mapRevision === Regions.mapRevision ||
      region !== Regions.cavern && (data?.mapRevision === undefined || data.mapRevision === 2);
    return data && Object.hasOwn(Regions.definitions, region) && supportedMap &&
      (data.coverage === undefined || typeof data.coverage === "boolean") &&
      (data.routeCoverage === undefined || typeof data.routeCoverage === "boolean") &&
      (data.fieldRevision === undefined || [1,2,FieldStories.revision].includes(data.fieldRevision)) &&
      (data.ledgerRevision === undefined || [1,2,3,4,Chronicle.revision].includes(data.ledgerRevision)) &&
      Array.isArray(data.objects) && data.objects.length <= 1000 &&
      Array.isArray(data.enemies) && data.enemies.length <= 200 && Array.isArray(data.explored) && data.explored.length === mapSize &&
      data.npc && ["injured", "follow", "wait", "refuge", "dead", "away"].includes(data.npc.mode);
  }

  // Save migrations: migrations[n] upgrades a schema-n save to schema n+1.
  // Add an entry here whenever Data.saveVersion is raised, so old saves keep working.
  const migrations = {};
  function migrate(data) {
    let d = data;
    while (d && Number.isInteger(d.schema) && d.schema < Data.saveVersion && migrations[d.schema]) d = migrations[d.schema](d);
    return d;
  }

  function restore(data, crossing = null) {
    data = migrate(data);
    const region = data?.region ?? Regions.home, regionStates = data?.regionStates ?? {};
    if (!data || data.schema !== Data.saveVersion || ![1, 2, 3, 4, 5, 6, Expedition.generator].includes(data.generator) || !Number.isInteger(data.seed) ||
        !(data.difficulty === "custom" || Object.hasOwn(Data.modes, data.difficulty)) || !Object.hasOwn(Data.roles, data.role) ||
        typeof region !== "string" || data.generator < (Regions.definitions[region]?.generator ?? 1) || !zoneShape(data, region) || typeof regionStates !== "object" || Array.isArray(regionStates) ||
        Object.entries(regionStates).some(([id, zone]) => id === region || !zoneShape(zone, id) ||
          zone.leftAt !== undefined && (!Number.isFinite(zone.leftAt) || zone.leftAt < 0 || zone.leftAt > data.minutes))) throw new Error("Incompatible save.");
    const areas = [data,...Object.values(regionStates)];
    const carIds = areas.flatMap(zone => zone.objects.filter(o => o?.kind === "car" && o.active).map(o => o.id));
    if (areas.filter(zone => zone.npc.mode !== "away").length > 1 || new Set(carIds).size !== carIds.length) throw new Error("Duplicate traveller data.");
    const legacy = data.rules === undefined;
    const oldMap = data.mapRevision === undefined;
    const rules = Data.worldRules(data.difficulty, legacy ? Data.legacyRules : data.rules);
    if (!legacy && Object.keys(rules).some(key => rules[key] !== data.rules?.[key] && !(key === "afterlifeChance" && data.rules[key] === undefined) && !(oldMap && key === "hordes" && data.rules.hordes === undefined))) throw new Error("Invalid world rules.");
    const s = crossing?.template ?? create(data.seed, data.difficulty, data.role, data.generator, rules, region), p = data.player;
    s.regionStates = {...regionStates};
    s.ledger = Chronicle.restore(data.ledger,data.minutes);
    s.world.coverage = data.coverage === true;
    s.world.routeCoverage = data.routeCoverage === true;
    if (!s.world.routeCoverage) s.world.initialPopulation = s.world.basePopulation;
    if (Number.isFinite(data.minutes) && data.minutes >= 0) restoreDaily(s,data);
    if (typeof data.deathCause === "string" && data.deathCause.length <= 80) s.deathCause = data.deathCause;
    s.atmosphere = Atmosphere.restore(data.atmosphere,s.world,s.rules.hordes);
    const {width, height} = s.world;
    const savedWidth = oldMap ? Regions.oldWidth(region) : width;
    if ((data.generator >= 3 || data.seed === Data.control.seed && data.generator === 2) && typeof data.controlStart === "string" &&
        Object.hasOwn(Data.control.starts, data.controlStart)) s.controlStart = data.controlStart;
    const wounds = Array.isArray(p?.wounds) && p.wounds.length <= 6 ? p.wounds.map(wound => wound && {
      ...wound, part: legacyWoundParts.get(wound.part) ?? wound.part, type: legacyWoundTypes.get(wound.type) ?? wound.type
    }) : null;
    const validPosition = a => a && Number.isFinite(a.x) && Number.isFinite(a.y) && a.x > 0 && a.y > 0 && a.x < width - 1 && a.y < height - 1;
    const validBag = bag => Array.isArray(bag) && bag.length < 300 && bag.every(i => i && Object.hasOwn(Data.items, i.id) && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 1000 &&
      (!individualItem(i.id) || i.qty === 1) &&
      (i.id !== "flashlight" || typeof i.uid === "string" && i.uid.length > 0 && i.uid.length <= 64 &&
        Number.isFinite(i.charge) && i.charge >= 0 && i.charge <= Data.flashlight.capacity) &&
      (i.condition === undefined || Number.isFinite(i.condition) && i.condition >= 0 && i.condition <= 100) &&
      (i.born === undefined || Number.isFinite(i.born)) && (i.cold === undefined || Number.isFinite(i.cold) && i.cold >= 0));
    if (!validPosition(p) || !validBag(p.bag) || !wounds ||
        ["hp", "stamina", "hunger", "hydration", "fatigue", "panic", "pain", "exposure"].some(k => !Number.isFinite(p[k]) || p[k] < 0 || p[k] > 100) ||
        !p.skills || ["combat", "crafting", "medical"].some(k => !Number.isFinite(p.skills[k]) || p.skills[k] < 0) ||
        (p.fracture !== undefined && !(Number.isFinite(p.fracture) && p.fracture >= 0 && p.fracture <= 10080)) ||
        (p.splinted !== undefined && typeof p.splinted !== "boolean") ||
        (p.sick !== undefined && !(Number.isFinite(p.sick) && p.sick >= 0 && p.sick <= 100)) ||
        Object.keys(Data.skills).some(k => p.skills[k] !== undefined && (!Number.isFinite(p.skills[k]) || p.skills[k] < 0)) ||
        !Number.isFinite(data.minutes) || data.minutes < 0 || !Number.isFinite(data.elapsed) || data.elapsed < 0 ||
        !validPosition(data.npc) || !Number.isFinite(data.npc.hp) || data.npc.hp < 0 || data.npc.hp > 100 ||
        data.npc.mode === "away" && (data.npc.hp !== 0 || data.npc.ridingVehicle) ||
        !Number.isFinite(data.rng) || !Number.isFinite(p.medicine) || p.medicine < 0 ||
        !wounds.every(w => w && ["arm", "leg"].includes(w.part) && ["bite", "cut", "scratch"].includes(w.type) &&
          typeof w.bandaged === "boolean" && typeof w.clean === "boolean" &&
          ["bleed", "infection", "age"].every(k => Number.isFinite(w[k]) && w[k] >= 0) &&
          (w.healing === undefined || Number.isFinite(w.healing) && w.healing >= 0)) ||
        p.wetness !== undefined && (!Number.isFinite(p.wetness) || p.wetness < 0 || p.wetness > 100) ||
        p.temperature !== undefined && (!Number.isFinite(p.temperature) || p.temperature < 33 || p.temperature > 37.3) ||
        p.pinned !== undefined && (!Array.isArray(p.pinned) || p.pinned.length > Object.keys(Data.items).length ||
          !p.pinned.every(id => typeof id === "string" && Object.hasOwn(Data.items, id)))) throw new Error("Invalid character data.");
    if (p.vehicle !== undefined && p.vehicle !== null && typeof p.vehicle !== "string" ||
        p.driveSpeed !== undefined && (!Number.isFinite(p.driveSpeed) || p.driveSpeed < 0 || p.driveSpeed > 6.3) ||
        ["velocityX", "velocityY"].some(k => p[k] !== undefined && (!Number.isFinite(p[k]) || Math.abs(p[k]) > 7))) {
      throw new Error("Invalid driving data.");
    }
    if (p.belt !== undefined && (!Array.isArray(p.belt) || p.belt.length !== Data.beltDefaults.length ||
        !p.belt.every(id => id === null || typeof id === "string" && canBelt(id)))) throw new Error("Invalid quick belt.");
    const heading = Math.hypot(p.headingX, p.headingY);
    const validHeading = Number.isFinite(heading) && heading > .001;
    const pins = data.mapPins === undefined ? [] : data.mapPins;
    if (!Number.isSafeInteger(data.serial) || data.serial < 0 || !Array.isArray(pins) || pins.length > Data.maxMapPins ||
        !pins.every(pin => pin && typeof pin.id === "string" && /^pin\d+$/.test(pin.id) && Number(pin.id.slice(3)) < data.serial &&
          typeof pin.name === "string" && pin.name.trim() && pin.name.length <= 36 && Object.hasOwn(Data.pinKinds, pin.kind) &&
          Number.isInteger(pin.x - .5) && Number.isInteger(pin.y - .5) && World.tileAt(s.world, pin.x, pin.y) &&
          pin.x < savedWidth && pin.y < savedWidth && data.explored[Math.floor(pin.y) * savedWidth + Math.floor(pin.x)]) ||
        new Set(pins.map(pin => pin.id)).size !== pins.length) throw new Error("Invalid map pins.");
    s.mapPins = pins.map(({id,x,y,name,kind}) => ({id,x,y,name,kind}));
    const originalObjects = new Map(s.world.objects.map(o => [o.id, o]));
    const addedKinds = new Set(["crate", "barrel", "campfire", "garden", "drop", "fence", "gate"]);
    const missingLegacyFixture = o => {
      const entry = Chronicle.entries[o.record];
      const ledgerVersion = data.ledgerRevision ?? 0;
      return coverageCrate(o) && (!s.world.coverage || routeCrate(o) && !s.world.routeCoverage) || legacy && utilityIds.has(o.id) || data.region === undefined && o.action === "travel" ||
        region === "ridge" && data.mapRevision !== Regions.mapRevision && ["exit-" + Regions.cavern,"cave-gear"].includes(o.id) ||
        Chronicle.isFixture(o) && (ledgerVersion === 0 || ledgerVersion === 1 && entry?.extra || ledgerVersion < (entry?.added ?? 0)) ||
        data.fieldRevision === undefined && FieldStories.isFixture(o) || oldMap && Atmosphere.isFixture(o);
    };
    const validTimer = (until, recipe) => Number.isFinite(until) && until > 0 && until <= data.minutes + recipe.minutes;
    const validStation = (o, original) => {
      if (original && coverageCrate(original)) return o.active && !o.solid && o.building === null;
      if (FieldStories.isFixture(original)) {
        if (o.solid || !o.active || o.building !== original.building) return false;
        if (original.action === "mushroom") return o.species === original.species && o.colony === original.colony &&
          typeof o.harvested === "boolean";
        return o.scene === original.scene && o.line === original.line && o.reward === original.reward &&
          typeof o.read === "boolean" && typeof o.claimed === "boolean" && (!o.claimed || o.read && o.reward);
      }
      if (original && Chronicle.isFixture(original)) {
        if (o.solid || o.building !== original.building || o.record !== original.record || o.delivery !== original.delivery) return false;
        if (o.action !== "loot") return o.active;
        const revealed = original.delivery ? s.ledger.dispatch?.route === original.delivery && s.ledger.dispatch.delivered : Chronicle.has(s.ledger,original.record);
        return o.storage && o.searched && o.active === Boolean(revealed) && (o.active || o.loot?.length === 0);
      }
      if (o.action === "travel") return o.active && !o.solid;
      if (o.kind === "forage") return o.resource === original?.resource && (o.forageAt === undefined ||
        validTimer(o.forageAt, {minutes:Data.wildResources[o.resource].recovery}));
      if (o.kind === "fish") return (o.fishUntil == null || validTimer(o.fishUntil, {minutes:Data.fishingMinutes})) &&
        (o.fishStock === undefined || Number.isInteger(o.fishStock) && o.fishStock >= 0 && o.fishStock <= Data.fishingStock.capacity) &&
        (o.fishStock === 0 ? validTimer(o.fishRecovery,{minutes:Data.fishingStock.recovery}) : o.fishRecovery === undefined);
      if (isBarrier(o)) {
        const tile = World.tileAt(s.world, o.x, o.y);
        return o.action === "door" && !o.solid && tile && !tile.building && !tile.baseSolid && ["x", "y"].includes(o.axis);
      }
      if (o.kind === "tap") return Number.isInteger(o.reserve) && o.reserve >= 0 && o.reserve <= Data.utilities.tapReserve;
      if (o.kind === "generator") return Number.isFinite(o.fuel) && o.fuel >= 0 && o.fuel <= Data.utilities.generatorCapacity &&
        typeof o.running === "boolean" && (!o.running || o.fuel > 0) && Number.isFinite(o.nextNoise) && o.nextNoise >= 0;
      if (o.kind === "barrel") {
        return o.action === "barrel" && (o.rawRain === undefined || typeof o.rawRain === "boolean") &&
          (o.water === undefined || Number.isFinite(o.water) && o.water >= 0 && o.water <= Data.rainCollector.capacity);
      }
      if (o.kind === "campfire") {
        if (o.action !== "campfire") return false;
        if (o.cook == null) return o.boilUntil == null || validTimer(o.boilUntil, Data.waterBatch);
        const id = o.cook.id;
        return o.boilUntil == null && id !== "water" && Object.hasOwn(Data.fireRecipes, id) &&
          validTimer(o.cook.until, Data.fireRecipes[id]);
      }
      if (o.kind === "garden") {
        const g = o.garden, tile = World.tileAt(s.world, o.x, o.y);
        return o.action === "garden" && o.solid && tile?.surface === "grass" && !tile.building && !tile.baseSolid &&
          g && Number.isFinite(g.moisture) && g.moisture >= 0 && g.moisture <= 100 &&
          Number.isFinite(g.growth) && g.growth >= 0 && (g.crop === null ? g.growth === 0 :
            Object.hasOwn(Data.crops, g.crop) && g.growth <= Data.crops[g.crop].minutes);
      }
      return true;
    };
    const validOpening = (o, original) => typeof o.open === "boolean" && Number.isInteger(o.boards) && o.boards >= 0 && o.boards <= 3 &&
      Number.isFinite(o.hp) && o.hp >= 0 &&
      (o.locked === undefined || typeof o.locked === "boolean" && (!o.locked || original?.locked && !o.open)) &&
      (o.latched === undefined || typeof o.latched === "boolean" && (!o.latched || original?.latched && !o.open)) &&
      (o.alarmArmed === undefined || typeof o.alarmArmed === "boolean" && (!o.alarmArmed || original?.alarmArmed)) &&
      (o.sealed === undefined || typeof o.sealed === "boolean" && (!o.sealed || !o.open)) &&
      (o.reinforced === undefined || Number.isInteger(o.reinforced) && o.reinforced >= 0 && o.reinforced <= Data.cinemaTrap.windowHits) &&
      (o.broken === undefined || typeof o.broken === "boolean" && (!o.broken || (o.boards > 0 ? !o.open : o.open && o.hp === 0)));
    const foreignCar = o => o.kind === "car" && o.action === "loot" && o.active && !o.away && o.homeRegion !== region &&
      (o.homeRegion === Regions.home ? /^o\d{1,3}$/.test(o.id) : Object.hasOwn(Regions.vehicleNames, o.id) && o.id.startsWith(o.homeRegion + "-"));
    const validCar = (o, original) => o.kind !== "car" || ((o.heading === undefined || Number.isFinite(o.heading) && Math.abs(o.heading) <= Math.PI) && (!original || o.homeRegion === undefined || o.homeRegion === region) &&
      (o.away === undefined || typeof o.away === "boolean" && (!o.away || original && !o.active && !o.solid)));
    const savedIds = new Set(data.objects.map(o => o?.id));
    if (savedIds.size !== data.objects.length ||
        !data.objects.every(o => {
          if (!o || typeof o.id !== "string") return false;
          const original = originalObjects.get(o.id);
          const previous = oldMap && original?.kind === "exit" ? Regions.oldExit(region,o.id) : original;
          const validKind = original ? original.kind === o.kind && original.action === o.action &&
            (original.kind === "car" || previous.x === o.x && previous.y === o.y) : foreignCar(o) || /^built\d+$/.test(o.id) && addedKinds.has(o.kind);
          const validMaterial = o.material === undefined || !original && o.kind === "fence" &&
            o.material === "stone" && o.boards === 0 && o.hp <= 225 && (!o.open || o.broken);
          return validPosition(o) && validKind && validMaterial && validStation(o, original) && validCar(o, original) && typeof o.active === "boolean" && typeof o.solid === "boolean" &&
            (o.action === "loot" ? validBag(o.loot) : !o.loot || validBag(o.loot)) && (o.action !== "door" || validOpening(o, original));
        }) || !s.world.objects.every(o => savedIds.has(o.id) || missingLegacyFixture(o))) throw new Error("Invalid world data.");
    if (!data.enemies.every(z => validPosition(z) && Data.infected[z.kind] && Number.isFinite(z.hp) && z.hp >= 0 && z.hp <= 88)) throw new Error("Invalid infected data.");
    for (const key of ["elapsed", "minutes", "kills", "serial", "nextEvent"]) if (!Number.isFinite(data[key]) || data[key] < 0) throw new Error("Invalid game time or progress.");
    const pending = data.fungalAlert;
    if (pending != null) {
      const zone = pending.region === region ? data : regionStates[pending.region];
      if (!zone || !Number.isFinite(pending.due) || pending.due < 0 || pending.due > data.elapsed + FieldStories.mushroom.warning ||
          !zone.objects.some(o => o.id === pending.id && o.action === "mushroom" && o.colony === "active" && o.harvested)) {
        throw new Error("Invalid fungal alert.");
      }
      s.fungalAlert = {region:pending.region,id:pending.id,due:pending.due};
    }
    if (data.nextFungalAlert !== undefined) {
      if (!Number.isFinite(data.nextFungalAlert) || data.nextFungalAlert < 0 ||
          data.nextFungalAlert > data.elapsed + FieldStories.mushroom.cooldown) throw new Error("Invalid fungal cooldown.");
      s.nextFungalAlert = data.nextFungalAlert;
    }
    const gear = Object.fromEntries(Object.keys(s.player.gear).map(slot => [slot, null]));
    for (const slot of Object.keys(gear)) {
      const item = p.gear?.[slot];
      if (Data.items[item]?.slot === slot && quantity(p.bag, item)) gear[slot] = item;
    }
    s.player = {...s.player, ...p, ...Data.character(p), bag:p.bag.map(item => ({...item})), skills: {...s.player.skills, ...p.skills}, gear, wounds, pinned:[...new Set(p.pinned ?? [])],
      belt:[...(p.belt ?? Data.beltDefaults)], headingX:validHeading ? p.headingX / heading : 0, headingY:validHeading ? p.headingY / heading : 1,
      lightUid:null, path:[], moving:false, resting:false, grabbed:0, grabCool:0};
    s.player.weapon = p.weapon;
    s.player.weaponUid = p.weaponUid;
    if (weapon(s).id === "fists") unequipWeapon(s);
    if (typeof p.lightUid === "string" && !p.vehicle && p.bag.some(i => i.id === "flashlight" && i.uid === p.lightUid && i.charge > 0)) s.player.lightUid = p.lightUid;
    s.world.objects = data.objects.map(o => ({
      ...o,
      ...(o.loot ? {loot:o.loot.map(item => ({...item}))} : {}), ...(o.garden ? {garden:{...o.garden}} : {}), ...(o.cook ? {cook:{...o.cook}} : {}),
      ...(o.kind === "car" ? {homeRegion:o.homeRegion ?? region} : {}),
      ...(oldMap && o.kind === "exit" ? {x:originalObjects.get(o.id).x,y:originalObjects.get(o.id).y} : {}),
      name: originalObjects.get(o.id)?.name ?? (o.kind === "car" ? Regions.vehicleNames[o.id] ?? "Car boot" : undefined) ?? (o.material === "stone" ? "Stone wall" : builtNames.get(o.kind)) ?? legacyDropNames.get(o.name) ??
        (dropNames.has(o.name) || o.name === "The El Gordo Winner" ? o.name : "On the ground"),
      ...(o.kind === "barrel" ? {water: o.water ?? 0} : {})
    }));
    for (const original of originalObjects.values()) if (!savedIds.has(original.id) && missingLegacyFixture(original) && !coverageCrate(original)) {
      const overlaps = original.decor && [p,data.npc,...data.enemies,...data.objects.filter(o => o.active && o.solid)].some(a => distance(a,original) < .72);
      s.world.objects.push(overlaps ? {...original,solid:false} : original);
    }
    if (data.booksStocked !== undefined && typeof data.booksStocked !== "boolean") throw new Error("Invalid book stock.");
    if ((data.fieldRevision ?? 0) < 2) stockStoneMaterials(s.world);
    if ((data.fieldRevision ?? 0) < 3) stockPantry(s.world,rules);
    s.world.booksStocked = data.booksStocked === true;
    stockSkillBooks(s.world);
    if (p.readBooks !== undefined && (!Array.isArray(p.readBooks) || p.readBooks.length > Object.keys(Data.skillBooks).length ||
        p.readBooks.some(id => typeof id !== "string" || !Object.hasOwn(Data.skillBooks,id)))) throw new Error("Invalid studied books.");
    s.player.readBooks = [...new Set(p.readBooks ?? [])];
    const savedObjects = new Map(s.world.objects.map(o => [o.id, o]));
    for (const building of s.world.buildings) building.door = savedObjects.get(building.door.id);
    if (!p.belt && s.world.base) {
      const crate = s.world.objects.find(o => o.storage && o.building === s.world.base.id);
      if (crate && !p.bag.some(i => i.id === "flashlight") && !crate.loot.some(i => i.id === "flashlight")) {
        add(crate.loot, "flashlight", 1, {charge:Data.flashlight.starter});
        add(crate.loot, "battery", 1);
      }
    }
    for (const car of s.world.objects.filter(o => o.kind === "car")) {
      if (car.hp === undefined) car.hp = 140;
      if (car.fuel === undefined) car.fuel = 25;
      if (!Number.isFinite(car.hp) || car.hp < 0 || car.hp > 140 ||
          !Number.isFinite(car.fuel) || car.fuel < 0 || car.fuel > 100 ||
          !World.drivable(World.tileAt(s.world, car.x, car.y)) || World.tileAt(s.world, car.x, car.y)?.baseSolid) throw new Error("Invalid vehicle data.");
    }
    if (s.player.vehicle && !s.world.objects.some(o => o.id === s.player.vehicle && o.kind === "car" && o.active &&
        o.hp > 0 && !o.solid && Math.hypot(o.x - p.x, o.y - p.y) < .1)) throw new Error("Invalid vehicle position.");
    s.world.enemies = data.enemies.map(z => {
      const windup = Number.isFinite(z.windup) ? clamp(z.windup, 0, windupTime + bruteWindup + .35) : 0;
      // In older saves the first tick resolves the target of an unfinished attack.
      const windupTarget = windup && ["player", "eva"].includes(z.windupTarget) ? z.windupTarget : null;
      const outfit = Object.hasOwn(Data.outfits, z.outfit) ? z.outfit : World.infectedOutfit(s.world, z);
      return {...z, outfit, windup, windupTarget, swing: windup ? 0 : z.swing, stats: Data.infected[z.kind], path: [],
        ...(z.origin === "resident" ? {dormant:z.dormant === true && z.hp > 0} : {})};
    });
    s.world.npc = {...data.npc, name: s.world.npc.name, path: []};
    if (s.world.npc.ridingVehicle && (s.world.npc.ridingVehicle !== s.player.vehicle ||
        distance(s.world.npc, s.player) > .1)) throw new Error("Invalid passenger position.");
    const known = Uint8Array.from(data.explored,n => n ? 1 : 0);
    if (oldMap) for (let y = 0; y < savedWidth; y++) s.world.explored.set(known.subarray(y*savedWidth,(y+1)*savedWidth),y*width);
    else s.world.explored = known;
    s.world.rng.restore(data.rng);
    for (const key of ["elapsed", "minutes", "kills", "serial", "nextEvent"]) s[key] = data[key];
    if (data.difficultyOptions !== undefined) {
      const options = data.difficultyOptions;
      if (!options || !options.assists || Object.keys(Data.assistFields).some(id => typeof options.assists[id] !== "boolean") ||
          !["off","light","strong"].includes(options.aim) || typeof options.director !== "boolean" ||
          !Object.hasOwn(Data.pressureLevels, options.pressure)) throw new Error("Invalid difficulty options.");
      s.difficultyOptions = difficultyOptions(s, {...options.assists, aim:options.aim, director:options.director, pressure:options.pressure});
    }
    if (data.difficultyChanges !== undefined) {
      if (!Array.isArray(data.difficultyChanges) || data.difficultyChanges.length > 20 ||
          data.difficultyChanges.some(entry => !entry || !Number.isFinite(entry.minute) || entry.minute < 0 || entry.minute > s.minutes ||
            typeof entry.changes !== "string" || entry.changes.length > 180)) throw new Error("Invalid difficulty history.");
      s.difficultyChanges = data.difficultyChanges.map(entry => ({minute:entry.minute, changes:entry.changes}));
    }
    if (data.recoveryUsed !== undefined && typeof data.recoveryUsed !== "boolean") throw new Error("Invalid recovery state.");
    if (data.shelterIdleSince !== undefined && (!Number.isFinite(data.shelterIdleSince) || data.shelterIdleSince < 0 ||
        data.shelterIdleSince > s.elapsed)) throw new Error("Invalid shelter idle time.");
    s.recoveryUsed = data.recoveryUsed;
    s.shelterIdleSince = crossing ? undefined : data.shelterIdleSince;
    if (s.longHaul && data.longHaul !== undefined) {
      const run = data.longHaul;
      if (!run || !Number.isInteger(run.days) || run.days < 0 || run.days > 30 ||
          longHaulFields.some(key => typeof run[key] !== "boolean") ||
          run.returned && (!run.cleared || !run.supplied) || run.complete && (run.days !== 30 ||
            longHaulFields.some(key => !run[key]))) throw new Error("Invalid 30-day challenge progress.");
      s.longHaul = {days:run.days,...Object.fromEntries(longHaulFields.map(key => [key,run[key]]))};
    }
    if (s.campaign) s.campaign = restoreCampaign(data.campaign);
    if (data.guideStep !== undefined) {
      if (!Number.isInteger(data.guideStep) || data.guideStep < 0 || data.guideStep > 6) throw new Error("Invalid beginner guide step.");
      s.guideStep = data.guideStep;
    }
    if (data.firstSleep !== undefined) {
      if (s.guideStep === undefined || typeof data.firstSleep !== "boolean") throw new Error("Invalid first sleep state.");
      s.firstSleep = data.firstSleep;
    }
    if (data.pinStory !== undefined) {
      if (typeof data.pinStory !== "boolean") throw new Error("Invalid pinned story state.");
      s.pinStory = data.pinStory;
    }
    if (data.playtest !== undefined) {
      if (!data.playtest || typeof data.playtest !== "object" || Array.isArray(data.playtest) ||
          Object.entries(data.playtest).some(([key, value]) => !playtestMoments.includes(key) ||
            !Number.isFinite(value) || value < 0 || (key !== "tutorialSkip" && value > s.elapsed + .051))) throw new Error("Invalid playtest timestamps.");
      s.playtest = {...data.playtest};
    }
    s.weather = localWeather(s);
    s.flags = {...s.flags, ...data.flags, gardenSeeded: data.flags?.gardenSeeded === true,
      harvested: data.flags?.harvested === true, gardenMeal: data.flags?.gardenMeal === true,
      gardenHelp: data.flags?.gardenHelp === true};
    if (!s.flags.gardenSeeded && s.world.base) stockGardenSeeds(s);
    if (s.flags.radio && ["return", "complete"].includes(data.supplyRun)) s.supplyRun = data.supplyRun;
    s.messages = Array.isArray(data.messages) ? data.messages.slice(-7) : [];
    if (Array.isArray(data.clues)) {
      s.clues = [...new Set(data.clues.filter(id => typeof id === "string" && Data.story[id]?.field))];
    }
    s.mode = s.player.hp > 0 ? "play" : "dead";
    if (data.afterlifePending !== undefined && (typeof data.afterlifePending !== "boolean" ||
        data.afterlifePending && (s.mode !== "dead" || s.player.exposure <= 0))) throw new Error("Invalid afterlife state.");
    s.afterlifePending = data.afterlifePending ?? false;
    s.quiet = Boolean(data.quiet);
    s.zoom = Number.isFinite(data.zoom) ? clamp(data.zoom, .75, 1.75) : 1;
    if (typeof data.waypoint === "string") s.waypoint = data.waypoint;
    s.lookahead = data.lookahead !== false;
    s.roofsHidden = data.roofsHidden === true;
    World.sync(s.world);
    if (crossing) {
      const npc = s.world.npc, car = vehicle(s);
      const spot = arrivalPosition(s, crossing.arrival, crossing.following);
      if (!spot) throw new Error("The other end is blocked. Try another crossing.");
      Object.assign(s.player, spot);
      if (car) Object.assign(car, spot);
      if (crossing.following) {
        const offset = {x:spot.x + 1,y:spot.y};
        Object.assign(npc, !car && World.clear(s.world, offset.x, offset.y) ? offset : spot);
      }
    }
    if (!World.clear(s.world, s.player.x, s.player.y)) throw new Error("The saved position is blocked.");
    return s;
  }

  return {create, cinemaBuff, hurt, campaignProblem, readCampaignPage, takeStatue, carriedSupply, testJump, fastForward, createControl, createRecommended, longHaulGoals, longHaulHint, difficultyOptions, setDifficulty, dangerRating, pinnedGoal, tick, weight, capacity, roomFor, quantity, available, nearby, reachableObject, containers, unreadClueAt, nearbyClues, readClue, collect, collectAll, use, drop,
    canStore, stash, isSupplyCache, nearbySupplyCache, canCarryCache, collectSupplyCache, canCarryBundle, isSpoiled, freshMinutes, healTime,
    canBelt, beltItem, setBelt, useBelt, activeLight, replaceBattery, sight, canSee,
    craft, recipeProblem, repairAmount, canMend, wornItem, place, contextual, door, canUnlock, canUnlatch, breach, breachProblem, barricade, unboard, isBarrier, removeBarrier, recruit, target, walkTo, approach, shove, attack,
    weapon, unequipWeapon, weaponData, weaponProblem, damageFactor, aimChance, attackTarget, touchAttackTarget, inAttackRange,
    threats, notify, level, addXp, moodles, sleep, unstick, season, snapshot, restore, distance, lineOfSight,
    vehicle, enterVehicle, exitVehicle, refuel, repairVehicle, vehicleRepairProblem, vehicleRepairAmount, brake, canListen, listenAtDoor,
    destination, markDestination, markStation, exploredTile, saveMapPin, markPin, removePin,
    travel, travelProblem, knownMushrooms, isMushroom, itemName, mushroomProblem, harvestMushroom, readFieldNote, wildProblem, useWild, sceneProblem, resolveScene, dispatchProblem, sendDispatch, readDispatchReport, touchFungus, inspectCrib, armWatch, waitWithWatch, isFurniture, dismantleFurniture, moonlight,
    resumeEncounterWarning,
    minutesToRain, gridPower, mainsWater, hasPower, useTap, useGenerator, isNight, rainBottles, rainDraw, boilingMinutes, startBoiling, collectBoiledWater,
    fireBatch, startFireBatch, collectCookedFood, sow, waterGarden, gardenYield, harvestGarden, evaAtShelter, toggleGardenHelp};
})();
