"use strict";

const Level = (() => {
  const {width, height, start, overview, zones, seeded} = LegacyLevel;

  function create(seed, generator = 2) {
    const world = LegacyLevel.create(seed);
    world.generator = generator;
    if (generator === 1) return world;
    const at = (x, y) => world.tiles[y * width + x];
    const occupied = (x, y) => world.objects.some(o => o.active && Math.floor(o.x) === x && Math.floor(o.y) === y);
    let serial = 0;

    function add(x, y, kind, options = {}) {
      const tile = at(x, y);
      if (!tile || tile.solid || occupied(x, y)) return null;
      const object = {
        id: "n" + serial++, x: x + .5, y: y + .5, kind, zone: tile.zone,
        building: tile.building, name: kind, tint: world.rng(), active: true, solid: true, ...options
      };
      world.objects.push(object);
      return object;
    }

    function partition(x, y, axis) {
      const tile = at(x, y);
      if (!tile || occupied(x, y)) return;
      Object.assign(tile, {kind: "wall", solid: true, outside: false, wallAxis: axis});
    }

    function door(x, y, name) {
      const tile = at(x, y);
      Object.assign(tile, {kind: "floor", solid: false});
      const object = add(x, y, "door", {name, action: "door", solid: false, open: true, boards: 0, hp: 70});
      if (object) Object.assign(tile, {kind: "portal", solid: false, doorId: object.id});
    }

    for (const b of world.buildings) {
      if (b.type === "home") {
        if (b.base) {
          for (let y = b.y + 1; y <= b.y + 4; y++) partition(b.x + 5, y, "y");
          for (let x = b.x + 1; x <= b.x + 5; x++) partition(x, b.y + 4, "x");
          door(b.x + 4, b.y + 4, "Bedroom door");
          for (let y = b.y + 1; y < b.y + 4; y++) {
            for (let x = b.x + 1; x < b.x + 5; x++) at(x, y).room = "Bedroom";
          }
          add(12, 42, "sofa", {name: "Sofa", action: "dismantle"});
          add(6, 42, "fridge", {name: "Pantry", action: "loot", searched: false,
            loot: [{id: "food", qty: 1}, {id: "water", qty: 1}]});
          add(13, 39, "table", {name: "Table", action: "dismantle"});
          add(13, 42, "rug", {solid: false});
        } else {
          if (b.w >= 9 && b.h >= 8) {
            const middle = b.x + Math.floor(b.w / 2);
            for (let y = b.y + 1; y < b.y + b.h - 1; y++) partition(middle, y, "y");
            door(middle, b.y + b.h - 3, "Interior door");
          }
          add(b.x + b.w - 3, b.y + b.h - 3, "sofa", {name: "Sofa", action: "dismantle"});
          add(b.x + 2, b.y + 4, "bed", {name: "Bed", action: "bed"});
          add(b.x + b.w - 3, b.y + 4, "table", {name: "Table", action: "dismantle"});
        }
      } else if (b.type === "clinic") {
        add(b.x + 2, b.y + 4, "counter", {name: "Reception desk", action: "dismantle"});
        add(b.x + b.w - 3, b.y + b.h - 3, "bed", {name: "Examination table", action: "bed"});
        add(b.x + 1, b.y + b.h - 3, "iv", {solid: false});
      } else if (b.type === "market") {
        for (const x of [b.x + 2, b.x + b.w - 3]) {
          add(x, b.y + 4, "shelf", {name: "Supply shelf", action: "loot", searched: false,
            loot: [{id: "food", qty: 2}, {id: "water", qty: 1}]});
        }
        add(b.x + b.w - 3, b.y + b.h - 3, "counter", {name: "Till", action: "dismantle"});
      } else if (b.type === "workshop") {
        add(b.x + 2, b.y + 4, "counter", {name: "Tool bench", action: "workbench"});
        add(b.x + b.w - 3, b.y + b.h - 3, "drum", {name: "Salvageable parts", action: "loot",
          searched: false, loot: [{id: "scrap", qty: 2}, {id: "tape", qty: 1}]});
      } else if (b.type === "police") {
        add(b.x + 4, b.y + 5, "table", {name: "Service table", action: "dismantle"});
        add(b.x + b.w - 3, b.y + b.h - 3, "chair", {name: "Chair", action: "dismantle"});
      } else if (b.type === "fuel") {
        add(b.x + 2, b.y + b.h + 1, "pump", {name: "Fuel pump", action: "loot", searched: false,
          loot: [{id: "fuel", qty: 2}]});
      }
      const entranceX = Math.floor(b.door.x);
      for (let y = Math.floor(b.door.y) + 1; y <= Math.min(62, Math.floor(b.door.y) + 2); y++) {
        const tile = at(entranceX, y);
        if (!tile.building && tile.surface === "grass") Object.assign(tile, {surface: "path", zone: "path"});
      }
    }

    for (const [x, y] of [[25, 26], [33, 26], [25, 33], [33, 33], [26, 12], [33, 46]]) {
      add(x, y, "lamp", {solid: false});
    }
    for (const tile of world.tiles) {
      tile.baseKind = tile.kind;
      tile.baseSolid = tile.solid;
    }
    return world;
  }

  return {width, height, start, overview, zones, seeded, create};
})();
