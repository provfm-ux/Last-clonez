"use strict";

const World = (() => {
  const {width, height, start} = Level;
  const neighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  function tileAt(world, x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    if (i < 0 || j < 0 || i >= world.width || j >= world.height) return null;
    return world.tiles[j * world.width + i];
  }

  function sync(world) {
    world.doorsById = new Map();
    for (const tile of world.tiles) {
      tile.kind = tile.baseKind;
      tile.solid = tile.baseSolid;
    }
    for (const object of world.objects) {
      if (!object.active) continue;
      const tile = tileAt(world, object.x, object.y);
      if (object.action === "door") {
        world.doorsById.set(object.id,object);
        tile.solid = !object.open || object.boards > 0;
        tile.kind = tile.solid ? "door" : "portal";
        tile.doorId = object.id;
      } else if (object.solid) tile.solid = true;
    }
  }

  const districtOutfits = {clinic:"medic", workshop:"worker", fuel:"worker", police:"patrol",
    ranger:"hiker", warehouse:"worker", coastal:"watch", farm:"worker"};
  const commonOutfits = ["watch", "plain", "worker", "hiker", "medic", "patrol", "watch"];

  function infectedOutfit(world, enemy) {
    const roll = ((world.seed ^ Math.floor((enemy.phase || 0) * 1048576)) >>> 0) % 12;
    if (roll < 5) return "plain";
    const x = enemy.homeX ?? enemy.x, y = enemy.homeY ?? enemy.y;
    const building = world.buildings.find(b => x >= b.x - 2 && x < b.x + b.w + 2 && y >= b.y - 2 && y < b.y + b.h + 2);
    return roll < 9 && districtOutfits[building?.type] || commonOutfits[roll - 5];
  }

  const areaDensity = {ridge:.12, ironworks:.24, coast:.12, fields:.14, cavern:.05, quarry:.10, reservoir:.12, lighthouse:.08};

  function infected(world, id, x, y, mix, rng, origin) {
    const kind = mix === "runners" && rng() < .20 ? "runner" : mix !== "walkers" && rng() < .18 ? "brute" : "walker";
    const stats = Data.infected[kind];
    const enemy = {id,x,y,homeX:x,homeY:y,hp:stats.hp,kind,stats,alert:0,chaseX:x,chaseY:y,cooldown:0,
      replan:rng(),wander:rng()*7,path:[],flash:0,stagger:0,face:1,phase:rng()*8};
    if (origin) enemy.origin = origin;
    enemy.outfit = infectedOutfit(world,enemy);
    return enemy;
  }

  function build(seed, difficulty = "survival", generator = 2, rules = Data.worldRules(difficulty), region = Regions.home) {
    const town = region === Regions.home;
    const world = town ? Object.assign(Level.create(seed, generator), {region}) : Regions.create(seed, region, generator);
    world.enemies = [];
    for (const car of world.objects.filter(o => o.kind === "car")) {
      car.hp ??= 140;
      car.fuel ??= 25;
      car.face = 1;
      car.homeRegion = region;
    }
    sync(world);
    if (generator >= 3) {
      if (!world.underground) Regions.expand(world);
      Regions.addExits(world);
      if (!world.underground) Homes.place(world);
      if (generator >= 4) Regions.addWilds(world);
      sync(world);
    }
    const occupied = new Set();
    const count = region === "cinema" ? 0 : town || !rules.count ? rules.count : Math.max(1, Math.round(rules.count * (areaDensity[region] ?? .24)));
    for (const {x,y,dormant} of world.homes ? Homes.residents(world,count) : []) {
      const z = infected(world,"z"+world.enemies.length,x,y,rules.mix,world.rng,"resident");
      z.dormant = dormant;
      world.enemies.push(z);
      occupied.add(Math.floor(y)*world.width+Math.floor(x));
    }
    const span = generator >= 3 ? world.width-4 : 59;
    const compact = new Set(world.homes?.map(home => home.id));
    for (let i = world.enemies.length; i < count; i++) {
      let x, y, spot = -1;
      for (let attempt = 0; attempt < 200; attempt++) {
        if (town) {
          x = 2.5 + Math.floor(world.rng() * span);
          y = 2.5 + Math.floor(world.rng() * span);
        } else {
          const site = world.hotspots[(i + Math.floor(attempt / 30)) % world.hotspots.length];
          x = site.x + Math.floor(world.rng() * 13) - 6;
          y = site.y + Math.floor(world.rng() * 13) - 6;
        }
        const id = Math.floor(y) * world.width + Math.floor(x);
        if (!clear(world,x,y) || occupied.has(id) || Math.hypot(x-world.start.x,y-world.start.y) <= 12) continue;
        if (compact.has(tileAt(world,x,y).building)) continue;
        spot = id;
        break;
      }
      if (spot < 0) continue;
      occupied.add(spot);
      world.enemies.push(infected(world,"z"+i,x,y,rules.mix,world.rng));
    }
    world.initialPopulation = world.enemies.length;
    if (generator < 3) {
      if (!world.underground) Regions.expand(world);
      Regions.addExits(world);
    }
    world.explored = new Uint8Array(world.width * world.height);
    sync(world);
    return world;
  }

  function clear(world, x, y, radius = .18) {
    return tileAt(world, x - radius, y - radius)?.solid === false &&
      tileAt(world, x + radius, y - radius)?.solid === false &&
      tileAt(world, x - radius, y + radius)?.solid === false &&
      tileAt(world, x + radius, y + radius)?.solid === false;
  }

  function drivable(tile) {
    return tile && !tile.building && tile.surface !== "bridge";
  }

  function sees(world, x, y, targetX, targetY) {
    const steps = Math.ceil(Math.hypot(targetX - x, targetY - y) * 4);
    const endpoint = tileAt(world, targetX, targetY);
    for (let i = 1; i < steps; i++) {
      const tile = tileAt(world, x + (targetX - x) * i / steps, y + (targetY - y) * i / steps);
      if (!tile || tile !== endpoint && (tile.kind === "wall" || tile.kind === "door" || tile.surface === "rock")) return false;
    }
    return true;
  }

  function route(world, x, y, targetX, targetY, approach = 0, doors = false, vehicle = false, accept = null, avoid = null) {
    const first = tileAt(world, x, y), target = tileAt(world, targetX, targetY);
    if (!first || !target) return [];
    const {width, height, tiles} = world;
    const startIndex = first.y * width + first.x;
    const buffers = world.routing ??= {queue:new Uint16Array(tiles.length),parent:new Uint16Array(tiles.length),
      visited:new Uint32Array(tiles.length),search:0};
    const {queue,parent,visited} = buffers;
    if (buffers.search >= 0xffffffff) { visited.fill(0); buffers.search = 0; }
    const stamp = ++buffers.search;
    const reach = approach || (target.solid ? 1.45 : .01);
    queue[0] = startIndex;
    visited[startIndex] = stamp;
    let end = 1, goal = -1;
    for (let i = 0; i < end; i++) {
      const index = queue[i], tile = tiles[index];
      if ((tile.x - target.x) ** 2 + (tile.y - target.y) ** 2 <= reach ** 2 && (!accept || accept(tile))) {
        goal = index;
        break;
      }
      for (const [dx, dy] of neighbours) {
        const x = tile.x+dx, y = tile.y+dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const id = index+dx+dy*width;
        if (visited[id] === stamp) continue;
        visited[id] = stamp;
        const next = tiles[id];
        if (vehicle && !drivable(next) || avoid && avoid(next)) continue;
        if (next.solid) {
          const door = doors && next.kind === "door" && (world.doorsById ? world.doorsById.get(next.doorId) : world.objects.find(o => o.id === next.doorId));
          if (!door || (door.boards > 0 || door.locked || door.latched || door.kind === "fence") && doors !== "force") continue;
        }
        parent[id] = index;
        queue[end++] = id;
      }
    }
    if (goal < 0) return [];
    const path = [];
    while (goal !== startIndex) {
      const tile = world.tiles[goal];
      path.push({x: tile.x + .5, y: tile.y + .5});
      goal = parent[goal];
    }
    if (!path.length && accept) path.push({x: first.x + .5, y: first.y + .5});
    else if (!path.length && !approach && !target.solid) path.push({x: target.x + .5, y: target.y + .5});
    return path.reverse();
  }

  const zoneAt = (world, x, y) => world.zones[tileAt(world, x, y)?.zone] || world.zones.wild;
  return {width, height, start, weapons: Data.items, build, tileAt, clear, drivable, sees, route, sync, zoneAt, infectedOutfit, infected};
})();
