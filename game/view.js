"use strict";

const View = (() => {
  const canvas = document.getElementById("world");
  let ctx = canvas.getContext("2d", {alpha: false});
  const mainCtx = ctx;
  let lowCanvas = null, lowCtx = null, darkLook = false;
  const halfW = 32, halfH = 16;
  const wallWidth = .14, wallInset = (1 - wallWidth) / 2;
  const camera = {x: 0, y: 0, zoom: 1, ready: false};
  // Screen shake (game-feel): effects with an `impact` add trauma; the shake is trauma^2 on the final draw offset only,
  // decays in real time and never touches the simulation or the cached ground. Off with Reduce flicker.
  const feltImpacts = new WeakSet(), shakeDecay = 1.2;
  let trauma = 0, shakeClock = 0;
  const size = {width: 0, height: 0, dpr: 1};
  const objectLabels = [];
  const windowLights = new WeakMap();
  const wetGround = [];
  const nearbyFires = [];
  let labelledWorld = null;
  const p = (x, y, z = 0) => [(x - y) * halfW, (x + y) * halfH - z];
  const unproject = (x, y) => ({x:(x / halfW + y / halfH) / 2, y:(y / halfH - x / halfW) / 2});
  const sq = (x, y, radius) => x * x + y * y <= radius * radius;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(1.7, window.devicePixelRatio || 1);
    if (size.width === bounds.width && size.height === bounds.height && dpr === size.dpr) return;
    Object.assign(size, {width: bounds.width, height: bounds.height, dpr});
    canvas.width = Math.max(1, Math.round(bounds.width * dpr));
    canvas.height = Math.max(1, Math.round(bounds.height * dpr));
    camera.ready = false;
  }
  new ResizeObserver(resize).observe(canvas);

  function updateCamera(state, dt) {
    const {width, height} = size;
    const tall = width < 540 && height > width * .75;
    if (state.mode === "menu") {
      camera.zoom = tall ? .39 : clamp(width / 1350, .45, .75);
      const [x, y] = p(Level.overview.x, Level.overview.y);
      camera.x = width * (tall ? .55 : .62) - x * camera.zoom;
      camera.y = height * (tall ? .27 : .45) - y * camera.zoom;
      camera.ready = false;
      return;
    }
    const baseZoom = tall ? clamp(width / 465, .74, .98) : clamp(width / 870, .82, 1.12);
    camera.zoom = baseZoom * (state.zoom || 1) * (state.player.vehicle ? .85 : 1);
    const look = state.player.vehicle && state.lookahead !== false ? .20 : 0;
    const [x, y] = p(state.player.x + (state.player.velocityX || 0) * look, state.player.y + (state.player.velocityY || 0) * look);
    const targetX = width * .50 - x * camera.zoom;
    const targetY = height * .54 - y * camera.zoom;
    const follow = camera.ready ? Math.min(1, dt * 11) : 1;
    camera.x += (targetX - camera.x) * follow;
    camera.y += (targetY - camera.y) * follow;
    camera.ready = true;
  }

  function poly(points, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function line(a, b, stroke, width = 1) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  function shadow(x, y, rx, ry, color = "#090e0a70") {
    const [sx, sy] = p(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function box(x, y, z, w, d, h, c) {
    const a = p(x, y, z + h), b = p(x + w, y, z + h);
    const cc = p(x + w, y + d, z + h), dd = p(x, y + d, z + h);
    poly([dd, cc, p(x + w, y + d, z), p(x, y + d, z)], c[1]);
    poly([cc, b, p(x + w, y, z), p(x + w, y + d, z)], c[2]);
    poly([a, b, cc, dd], c[0]);
  }

  function tint(hex, amount) {
    const n = Number.parseInt(hex.slice(1), 16);
    const shade = c => clamp(c + amount, 0, 255);
    return "rgb(" + shade(n >> 16) + "," + shade(n >> 8 & 255) + "," + shade(n & 255) + ")";
  }

  function prepare(world) {
    camera.ready = false;
    const buildings = new Map(world.buildings.map(b => [b.id, b]));
    windowLights.set(world, world.objects.filter(o => o.kind === "window" && buildings.has(o.building)).map(window => {
      const building = buildings.get(window.building);
      const acrossX = World.tileAt(world, window.x, window.y)?.wallAxis !== "x";
      const x = acrossX ? window.x + (window.x < building.x + building.w / 2 ? -1 : 1) : window.x;
      const y = acrossX ? window.y : window.y + (window.y < building.y + building.h / 2 ? -1 : 1);
      return {window, x, y};
    }));
    world.roofTiles = new Map(world.buildings.map(b => [b.id, []]));
    for (const home of world.buildings.filter(b => b.type === "home")) {
      for (let y = Math.max(0, home.y - 2); y < Math.min(world.height, home.y + home.h + 2); y++) {
        for (let x = Math.max(0, home.x - 2); x < Math.min(world.width, home.x + home.w + 2); x++) {
          world.tiles[y * world.width + x].nearHome = true;
        }
      }
    }
    const surfaces = {grass:world.region === "ridge" ? "#435944" : world.region === "fields" ? "#526244" : "#45553a",
      asphalt:"#484d43",path:"#77806e",trail:"#77684e",water:world.region === "coast" ? "#325961" : "#3b6164",
      rock:world.underground ? "#393f40" : "#656d64",concrete:"#61635d",rail:"#615952",sand:"#a39771",bridge:"#88745c",field:"#726247"};
    for (const [index, t] of world.tiles.entries()) {
      if (t.kind === "void") continue;
      const building = buildings.get(t.building);
      if (t.nearHome && t.surface === "path") {
        t.kerbEdges = [[-1, 0], [0, -1], [1, 0], [0, 1]].map(([dx, dy]) =>
          World.tileAt(world, t.x + dx, t.y + dy)?.surface === "asphalt");
      }
      if (building) world.roofTiles.get(building.id).push(index);
      if (t.kind === "wall") {
        const joins = (dx, dy, axis) => {
          const next = World.tileAt(world, t.x + dx, t.y + dy);
          if (!next || next.building !== t.building) return false;
          if (next.kind === "wall") return t.wallAxis === axis || next.wallAxis === axis;
          return Boolean(next.doorId) && next.wallAxis === axis;
        };
        const lo = wallInset, hi = lo + wallWidth;
        const left = joins(-1, 0, "x"), right = joins(1, 0, "x");
        const back = joins(0, -1, "y"), front = joins(0, 1, "y");
        if (!back && !front && t.wallAxis === "x") {
          t.wallOutline = [[0, lo], [1, lo], [1, hi], [0, hi]];
        } else if (!left && !right && t.wallAxis === "y") {
          t.wallOutline = [[lo, 0], [hi, 0], [hi, 1], [lo, 1]];
        } else {
          // Each arm meets its neighbour at the tile edge. One cap covers the joint.
          t.wallOutline = [
            [lo, lo], ...(back ? [[lo, 0], [hi, 0]] : []),
            [hi, lo], ...(right ? [[1, lo], [1, hi]] : []),
            [hi, hi], ...(front ? [[hi, 1], [lo, 1]] : []),
            [lo, hi], ...(left ? [[0, hi], [0, lo]] : [])
          ];
        }
        t.wallShape = t.wallOutline.map(point => point.join(",")).join(";");
      }
      const floors = {home: t.room ? "#80735f" : "#787d69", clinic: "#708078", market: "#7d8071", workshop: "#6b6354", police: "#6d7669", fuel: "#747566"};
      if (building?.compact) floors.home = t.room === "Bedroom" ? "#6c665b" : building.color;
      const color = surfaces[t.surface] || floors[building?.type] || world.zones[t.zone].color;
      const variance = t.surface === "water" ? Math.floor(t.tint * 6 - 3) : Math.floor(t.tint * 14 - 7) + ((t.x + t.y) % 2 ? -3 : 4);
      t.color = tint(color, variance);
    }
  }

  const BLOOD = ["#4a0c0f", "#6a1216", "#8c1a1c", "#2c070a"];
  const GROUND_BLOOD = "#53333765";
  const dot = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function bloodPool(wx, wy, rx, ry, seed) {
    const ring = (k, color) => poly(Array.from({length: 10}, (_, i) => p(wx + Math.cos(i / 10 * 6.283) * rx * k * (1 + .18 * Math.sin(seed + i * 2.3)), wy + Math.sin(i / 10 * 6.283) * ry * k)), color);
    ring(1, BLOOD[3]); ring(.72, BLOOD[0]); ring(.34, BLOOD[1]);
    const [hx, hy] = p(wx - rx * .2, wy - ry * .1); dot(hx, hy, 3, 2, BLOOD[2]);
  }
  function microDetail(t) {
    const {x, y} = t, h = ((x * 73856093) ^ (y * 19349663)) >>> 0, at = (u, v) => p(x + u, y + v);
    if (t.surface === "grass" || t.surface === "field") {
      for (let k = 0; k < 6; k++) { const q = ((h + k * 977) * 2246822519) >>> 0, [px, py] = at(.12 + (q % 76) / 100, .12 + ((q >> 7) % 76) / 100);
        dot(px, py - 3, 2, 4, k % 3 === 0 ? "#2a3a22" : k % 3 === 1 ? "#4b5f38" : "#364a2a"); if (k === 2) dot(px + 2, py - 2, 2, 3, "#5d6e42"); }
      if (t.nearHome && h % 17 === 0) {
        const [px, py] = at(.64, .62);
        dot(px, py - 2, 1, 3, "#647252");
        dot(px + 1, py - 3, 2, 1, "#a29371");
      }
      if (h % 6 === 0) { const [px, py] = at(.3 + (h % 40) / 100, .35); dot(px, py, 7, 3, "#4a3d26"); dot(px + 2, py - 1, 3, 2, "#5e4f30"); }
      if (h % 9 === 1) { const [px, py] = at(.55, .45); dot(px, py, 4, 3, "#6a6a62"); dot(px + 1, py - 1, 3, 1, "#8c8c82"); dot(px, py + 2, 4, 1, "#3a3a36"); }
    } else if (t.surface === "asphalt") {
      if (h % 4 === 0) { const [a, b] = at(.2, .3), [c, d] = at(.5, .55), [e, f] = at(.8, .5); line([a, b], [c, d], "#141212c0", 1); line([c, d], [e, f], "#141212c0", 1); }
      for (let k = 0; k < 3; k++) { const q = ((h + k * 31) * 2654435761) >>> 0, [px, py] = at((q % 80) / 100 + .1, ((q >> 8) % 80) / 100 + .1); dot(px, py, 2, 2, k % 2 ? "#3a3a3a" : "#777168"); }
      if (h % 11 === 0) {
        const grate = [at(.54,.65),at(.74,.65),at(.74,.86),at(.54,.86)];
        poly(grate, "#242830", "#73746b");
        for (const r of [.69,.74,.79,.84]) line(at(.56,r),at(.72,r),"#77796f");
      } else if (h % 7 === 0) {
        const stain = [at(.25,.51),at(.48,.44),at(.67,.61),at(.54,.78),at(.31,.72)];
        poly(stain, "#23262c61");
        const [sx, sy] = at(.44,.58);
        dot(sx,sy,3,1,"#9b9e8552");
      }
    } else if (t.surface === "path" || t.surface === "concrete") {
      if (h % 3 === 0) {
        line(at(.24,.16),at(.38,.37),"#353b33");
        line(at(.38,.37),at(.32,.52),"#353b33");
        const [sx, sy] = at(.33,.53);
        dot(sx,sy-2,1,3,"#767f4f");
        dot(sx+1,sy-1,2,1,"#94987a");
      }
      if (h % 5 === 0) {
        line(at(.58,.27),at(.83,.27),"#c2b79859");
        line(at(.58,.30),at(.81,.30),"#464a3e69");
      }
    } else if (t.surface === "tile" || t.surface === "sand") {
      for (let k = 0; k < 4; k++) { const q = ((h + k * 733) * 2654435761) >>> 0, [px, py] = at((q % 80) / 100 + .1, ((q >> 8) % 80) / 100 + .1); dot(px, py, 2, 2, t.surface === "sand" ? "#c9b98c" : k % 2 ? "#2c2820" : "#5a5444"); }
    }
    if (t.surface === "tile" && t.room && h % 4 === 0) {
      line(at(.21,.40),at(.71,.40),"#ab967458");
      line(at(.26,.43),at(.63,.43),"#52463264");
    }
    if (t.nearHome && (t.surface === "tile" || t.surface === "path") && h % 29 === 0) {
      const [px, py] = at(.36, .57);
      dot(px, py, 3, 2, GROUND_BLOOD);
      dot(px + 5, py + 2, 1, 1, GROUND_BLOOD);
    }
  }

  function tileArt(t) {
    const {x, y} = t;
    const a = p(x, y), b = p(x + 1, y), c = p(x + 1, y + 1), d = p(x, y + 1);
    const points = [a, b, c, d];
    poly(points, t.color, t.surface === "water" ? null : "#101b1349");
    if (t.surface === "asphalt") {
      const town = t.roadLine === undefined;
      if ((town ? x === 29 : t.roadLine === "y") && y % 4 < 2) line(p(x+.5,y+.08),p(x+.5,y+.88),"#c4ae737d",2);
      if ((town ? y === 29 : t.roadLine === "x") && x % 4 < 2) line(p(x+.1,y+.5),p(x+.9,y+.5),"#c4ae737d",2);
      if (town && (x === 27 || x === 31)) line(p(x+.08,y),p(x+.08,y+1),"#b7b49b42");
    } else if (t.surface === "grass") {
      if (t.marks > .5) {
        line(p(x+.3,y+.6),p(x+.3,y+.6,5),"#83926866");
        line(p(x+.6,y+.3),p(x+.6,y+.3,3),"#a2a27b3d");
      }
    } else if (t.surface === "water") {
      if (t.marks > .49) line(p(x+.12,y+.53),p(x+.63,y+.53),"#9ac4b338",1.5);
      if (t.marks > .86) line(p(x+.48,y+.74),p(x+.94,y+.74),"#d9d8aa42");
    } else if (t.surface === "rock" && t.marks > .42) {
      box(x+.14,y+.12,0,.72,.68,4+Math.round(t.tint*8),["#777d72","#565f57","#4e5851"]);
    } else if (t.surface === "cave" && t.marks > .56) {
      line(p(x+.16,y+.58),p(x+.51,y+.69),"#20272776",2);
      if (t.marks > .86) shadow(x+.58,y+.52,7,3,"#364b4e96");
    } else if (t.surface === "rail") {
      for (const row of [.18,.78]) line(p(x,y+row),p(x+1,y+row),"#b29d7da8",2);
      line(p(x+.5,y),p(x+.5,y+1),"#3d3532",3);
    } else if (t.surface === "bridge" || t.surface === "field") {
      const paint = t.surface === "bridge" ? "#413b2e9e" : "#524832a8";
      for (const row of [.2,.5,.8]) {
        if (t.boardAxis === "y") line(p(x+row,y),p(x+row,y+1),paint,2);
        else line(p(x,y+row),p(x+1,y+row),paint,2);
      }
    } else if (t.surface === "sand" && t.marks > .65) {
      line(p(x+.2,y+.5),p(x+.65,y+.5),"#d8c89c65");
    } else if (darkLook && t.nearHome && t.surface === "path") {
      line(p(x, y + .5), p(x + 1, y + .5), "#30353250");
      for (const offset of [.25, .75]) line(p(x + offset, y), p(x + offset, y + .5), "#30353255");
      line(p(x + .5, y + .5), p(x + .5, y + 1), "#30353255");
      if (t.kerbEdges) {
        const edges = [[a, d], [a, b], [b, c], [d, c]];
        for (const [index, [from, to]] of edges.entries()) {
          if (t.kerbEdges[index]) line(from, to, "#b4b2a666", 2);
        }
      }
      if (t.marks > .6) {
        line(p(x + .12, y + .73), p(x + .44, y + .73), "#b2b2a342");
        const [sx, sy] = p(x + .74, y + .59);
        dot(sx, sy, 2, 1, "#5c6056");
      }
    } else if (t.surface === "tile") {
      if (darkLook && t.nearHome && t.room) {
        for (const row of [.24, .49, .74]) {
          line(p(x, y + row), p(x + 1, y + row), "#322b2549");
          const seam = (y + Math.round(row * 4)) % 2 ? .32 : .68;
          line(p(x + seam, y + row), p(x + seam, y + row + .24), "#332d2770");
        }
      } else if (t.room) {
        line(p(x+.25,y),p(x+.25,y+1),"#423c2e4a");
        line(p(x+.62,y),p(x+.62,y+1),"#b9a48130");
      }
      if (!darkLook && t.marks > .985 && t.kind === "floor") shadow(x+.4,y+.6,8,3,"#77453a8a");
    }
    if (darkLook) microDetail(t);
  }

  // (tileArt ends above; the dark look adds micro texture and blood on top of it)
  function tendril(t, stirred) {
    const {x, y} = t;
    if (t.tendril) {
      const branch = p(x+.44,y+.52,1);
      const strands = [[.03,.36],[.32,.02],[.93,.77],[.55,.97]];
      for (const [dx,dy] of strands) {
        const tip = p(x+dx,y+dy,1);
        line(branch,tip,"#273b29",4);
        line(branch,tip,stirred ? "#8a8658" : "#bac982",1.5);
      }
      shadow(x+.44,y+.52,5,2,stirred ? "#766d43" : "#e2d89e");
    }
  }

  function tile(t, player, menu, playerZone, stirred) {
    tileArt(t);
    tendril(t, stirred);
    const {x, y} = t, points = [p(x, y), p(x + 1, y), p(x + 1, y + 1), p(x, y + 1)];
    if (menu) return;
    const dist = Math.hypot(x + .5 - player.x, y + .5 - player.y);
    const sameZone = t.zone === playerZone;
    const shade = clamp((dist - 3.2) * .05, 0, .47) + (sameZone ? 0 : .1);
    if (shade > .025) {
      ctx.globalAlpha = shade;
      poly(points, "#09130d");
      ctx.globalAlpha = 1;
    }
  }

  // Each glow is a fixed colour and radius, so the gradient is painted once into a
  // small sprite and reused instead of building a new gradient every frame.
  const glowSprites = new Map();
  function glowSprite(color, radius) {
    const key = color + "|" + radius;
    let sprite = glowSprites.get(key);
    if (!sprite) {
      if (glowSprites.size >= 24) glowSprites.clear();
      sprite = document.createElement("canvas");
      sprite.width = sprite.height = Math.ceil(radius * 2);
      const g2 = sprite.getContext("2d"), g = g2.createRadialGradient(radius, radius, 1, radius, radius, radius);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      g2.fillStyle = g;
      g2.fillRect(0, 0, sprite.width, sprite.height);
      glowSprites.set(key, sprite);
    }
    return sprite;
  }

  function glow(x, y, color, radius, opacity) {
    ctx.save();
    ctx.translate((x-y)*halfW, (x+y)*halfH);
    ctx.scale(1, .58);
    ctx.globalAlpha = opacity;
    ctx.drawImage(glowSprite(color, radius), -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  const brickWalls = new Map();
  function wall(t, player, menu) {
    const {x, y, wallOutline: outline} = t;
    const fullHeight = t.outside ? 34 : 26;
    const dx = x + .5 - player.x, dy = y + .5 - player.y;
    const cutaway = !menu && dx + dy > 0 && sq(dx, dy, 3.3);
    const height = cutaway ? 10 : fullHeight;
    if (!darkLook || !t.outside || !t.nearHome) {
      paintWall(x, y, outline, height, t.outside ? ["#667369", "#454e44", "#343f35"] : ["#727b6c", "#475248", "#39463e"]);
      return;
    }
    const key = t.wallShape + ":" + height;
    let sprite = brickWalls.get(key);
    if (!sprite) {
      sprite = document.createElement("canvas");
      sprite.width = 2 * halfW + 2; sprite.height = height + 2 * halfH + 2;
      const previous = ctx;
      try {
        ctx = sprite.getContext("2d");
        ctx.translate(halfW + 1, height + 1);
        paintWall(0, 0, outline, height, ["#81665a", "#705147", "#513f3a"], true);
      } finally { ctx = previous; }
      brickWalls.set(key, sprite);
    }
    const [sx, sy] = p(x, y);
    ctx.drawImage(sprite, sx - halfW - 1, sy - height - 1);
  }

  function paintWall(x, y, outline, height, [cap, south, east], brick = false) {
    const top = outline.map(([u, v]) => p(x + u, y + v, height));
    for (let i = 0; i < outline.length; i++) {
      const j = (i + 1) % outline.length;
      const [u, v] = outline[i], [nextU, nextV] = outline[j];
      if (nextU < u || nextV > v) {
        const bottom = p(x + u, y + v), end = p(x + nextU, y + nextV);
        poly([top[i], top[j], end, bottom], nextU < u ? south : east);
        if (brick && Math.abs(nextU - u) + Math.abs(nextV - v) > .4) {
          const mortar = "#2c25233d";
          for (let level = 5; level < height; level += 6) {
            line([bottom[0], bottom[1] - level], [end[0], end[1] - level], mortar);
            const offset = level % 12 === 5 ? .32 : .68;
            const seamX = bottom[0] + (end[0] - bottom[0]) * offset;
            const seamY = bottom[1] + (end[1] - bottom[1]) * offset - level;
            line([seamX, seamY], [seamX, seamY + 3], mortar);
          }
        }
      }
    }
    poly(top, cap);
  }

  const iron = ["#6b8279", "#425954", "#30463e"];
  const plastic = ["#a5aa9a", "#68756b", "#505c53"];
  const olive = ["#8e9673", "#5b684c", "#414f3b"];
  const wood = ["#927d60", "#635540", "#493e32"];
  const rubber = ["#454d43", "#262e26", "#202820"];
  const red = ["#b86751", "#794538", "#633b32"];
  const teal = ["#779e91", "#466f64", "#355952"];
  const cream = ["#bfc1a9", "#8f927e", "#747c6d"];

  const gardenTrees = [];
  function gardenTree(x, y, tintValue, wind, pine) {
    const variant = Number.isFinite(tintValue) ? clamp(Math.floor(tintValue * 4), 0, 3) : 0;
    const key = variant + (pine ? 4 : 0);
    let sprite = gardenTrees[key];
    if (!sprite) {
      sprite = document.createElement("canvas");
      sprite.width = 54; sprite.height = 61;
      const c = sprite.getContext("2d");
      const crown = pine ? [[27, 11, 7], [26, 20, 10], [29, 29, 13], [26, 36, 16]] : [[16, 29, 12], [38, 30, 12], [27, 35, 14], [13, 20, 9],
        [36, 16, 12], [23, 13, 12], [28, 22, 15]];
      const leaves = [["#344334", "#43533b", "#566649", "#687652"],
        ["#3e4834", "#50583d", "#656b48", "#7b7e55"],
        ["#35463b", "#455a48", "#58705a", "#6f8062"],
        ["#444838", "#555b40", "#696d4a", "#7a7c54"]][variant];
      for (const [cx, cy, radius] of crown) {
        for (let py = cy - radius; py <= cy + radius; py += 2) {
          for (let px = cx - radius; px <= cx + radius; px += 2) {
            const noise = ((px * 73856093 ^ py * 19349663 ^ variant * 83492791) >>> 0) % 7;
            const dx = px - cx, dy = (py - cy) * 1.25;
            if (pine && Math.abs(dx) > (py - cy + radius) * .75 + noise * .55) continue;
            if (dx * dx + dy * dy > (radius - noise * .65) ** 2) continue;
            const shade = clamp(Math.floor(1.3 - (dx + dy) / radius + noise * .22), 0, 3);
            c.fillStyle = leaves[shade]; c.fillRect(px, py, 2, 2);
            if (noise === 2 && shade > 0) {
              c.fillStyle = leaves[shade - 1]; c.fillRect(px + 1, py + 1, 1, 1);
            }
          }
        }
      }
      gardenTrees[key] = sprite;
    }
    const [sx, sy] = p(x, y);
    shadow(x, y, 24, 9, "#10171090");
    const left = Math.round(sx) - 27, top = Math.round(sy) - 60;
    ctx.fillStyle = "#41382c"; ctx.fillRect(left + 25, top + 29, 5, 31);
    ctx.fillStyle = "#786653"; ctx.fillRect(left + 25, top + 34, 2, 24);
    ctx.fillStyle = "#302c24"; ctx.fillRect(left + 28, top + 43, 1, 15);
    ctx.fillStyle = "#8f795a"; ctx.fillRect(left + 26, top + 52, 1, 4);
    ctx.drawImage(sprite, left + wind, top);
  }

  const furnitureSprites = new Map();
  const furnitureKinds = new Set(["bed", "fridge", "sink", "washstand", "cupboard", "wardrobe", "sideboard", "shelf", "table", "sofa", "armchair", "rug", "crate", "generator", "barrel", "radio", "bench", "chair", "cart"]);

  function paintFurniture(kind, variant, powered) {
    const oak = ["#947859", "#735943", "#514035"];
    const cloth = variant === 0 ? ["#879174", "#656e59", "#475143"] :
      variant === 1 ? ["#8f6e62", "#6c514b", "#533e3a"] : ["#668182", "#50686b", "#374c52"];
    const enamel = ["#c7c9b4", "#a3a796", "#777e76"];
    const metal = ["#b1b7aa", "#818c86", "#576965"];
    const edge = (a, b, color) => line(p(...a), p(...b), color);
    const mark = (position, color, width = 1, height = 1) => {
      const [x, y] = p(...position);
      dot(x, y, width, height, color);
    };
    if (kind !== "rug" && kind !== "door" && kind !== "window") shadow(0, 0, kind === "bed" || kind === "sofa" ? 28 : 23, 9, "#0d120f70");

    switch (kind) {
      case "door":
      case "window": {
        const horizontal = Boolean(variant & 1);
        const open = Boolean(variant & 2);
        const broken = Boolean(variant & 4);
        const glass = kind === "window";
        const slab = (along, depth, z, length, thickness, height, colors) =>
          horizontal ? box(along, depth, z, length, thickness, height, colors) :
            box(depth, along, z, thickness, length, height, colors);
        const face = (along, z, depth = .084) => horizontal ? [along, depth, z] : [depth, along, z];
        const hardware = glass ? metal : ["#b8a790", "#8b7b69", "#5d554a"];
        if (broken) {
          slab(-.47, -.07, 0, .94, .16, 3, hardware);
          for (const offset of [-.35, -.06, .26]) {
            slab(offset, -.045, 3, .09, .08, glass ? 2 : 4, glass ? enamel : oak);
          }
          break;
        }
        if (open) {
          box(-.43, -.31, 0, .10, .65, 29, glass ? metal : oak);
          edge([-.321, -.29, 25], [-.321, .31, 25], hardware[0]);
          mark([-.32, .24, 13], "#d0ba88", 2, 1);
          break;
        }
        slab(-.48, -.07, 0, .96, .14, 29, glass ? metal : oak);
        slab(-.39, .069, 3, .78, .015, 22, glass ?
          ["#80998c", "#516c68", "#415653"] : ["#8f7355", "#765b46", "#594537"]);
        for (const z of glass ? [4, 14, 25] : [3, 13, 25]) edge(face(-.39, z), face(.39, z), hardware[0]);
        for (const offset of glass ? [-.38, 0, .38] : [-.38, .38]) {
          edge(face(offset, 4), face(offset, 25), "#baa98a");
        }
        if (glass) {
          edge(face(-.30, 20), face(-.10, 23), "#a6c0b4");
          edge(face(.08, 7), face(.25, 10), "#849e93");
          mark(face(.10, 13), "#ccbf9f", 2, 1);
        } else {
          for (const offset of [-.28, -.12, .06, .24]) {
            edge(face(offset, 5), face(offset, 11), "#5c4839");
            edge(face(offset, 15), face(offset, 23), "#654e3e");
          }
          mark(face(.27, 14), "#c6af7b", 2, 2);
          mark(face(-.35, 8), "#65574b", 2, 1);
        }
        break;
      }
      case "campfire": {
        box(-.35, -.15, 0, .70, .30, 4, oak);
        box(-.15, -.35, 3, .30, .70, 4, oak);
        const [x, y] = p(0, 0, 7);
        const tip = [0, 2, -2, 1][variant];
        poly([[x-8,y],[x-6,y-8],[x-3,y-7],[x+tip,y-18],[x+4,y-10],[x+7,y-11],[x+8,y]], "#a75336");
        poly([[x-5,y],[x-3,y-6],[x+tip,y-12],[x+4,y-5],[x+5,y]], "#e2a564");
        ctx.fillStyle = "#f1cf87";
        ctx.fillRect(x-2,y-4,4,3);
        break;
      }
      case "barrel": {
        const paint = ["#56746d", "#3f6059", "#304b46"];
        box(-.29, -.29, 0, .58, .58, 4, paint);
        box(-.31, -.31, 3, .62, .62, 2, metal);
        box(-.29, -.29, 5, .58, .58, 11, paint);
        box(-.31, -.31, 15, .62, .62, 2, metal);
        box(-.29, -.29, 17, .58, .58, 6, paint);
        box(-.32, -.32, 22, .64, .64, 2, metal);
        box(-.26, -.26, 24, .52, .52, 1, powered ? ["#486963", "#344e48", "#2a403c"] : paint);
        edge([-.13, .293, 6], [-.13, .293, 15], "#92a08a");
        edge([.18, .293, 6], [.18, .293, 15], "#2c483e");
        mark([-.23, .295, 14], "#b28c64", 2, 2);
        mark([.12, .295, 7], "#8d6249", 3, 1);
        mark([.11, -.13, 25], "#aeb29a", 2, 2);
        if (powered) edge([-.2, .05, 25], [.09, .05, 25], "#9cae9d");
        break;
      }
      case "radio":
        box(-.35, -.27, 0, .70, .54, 19, oak);
        box(-.26, -.20, 19, .52, .40, 11, iron);
        edge([.14, -.16, 30], [.14, -.16, 43], "#a3a999");
        mark([.14, -.16, 43], "#c4bda0", 1, 2);
        box(-.22, .20, 21, .19, .03, 7, rubber);
        for (const z of [22, 24, 26]) edge([-.20, .235, z], [-.06, .235, z], "#68726a");
        mark([.04, .235, 26], powered ? "#c0d58f" : "#745945", 4, 2);
        mark([.15, .235, 22], "#c1b298", 2, 2);
        mark([-.12, .275, 16], "#9eaa9c", 2, 1);
        break;
      case "bench":
      case "chair": {
        const half = kind === "bench" ? .47 : .24;
        for (const x of [-half + .03, half - .10]) {
          box(x, -.22, 0, .07, .08, 23, metal);
          box(x, .15, 0, .07, .08, 10, metal);
        }
        for (const y of [-.22, -.06, .10]) box(-half, y, 9, half * 2, .13, 2, oak);
        for (const z of [15, 20]) {
          box(-half, -.24, z, half * 2, .085, 3, oak);
          edge([-half + .04,-.15,z+2],[half - .06,-.15,z+2],"#b59b73");
          for (const x of [-half + .10, half - .11]) mark([x,-.149,z+1],"#485650");
        }
        break;
      }
      case "cart":
        for (const x of [-.30,.22]) for (const y of [-.23,.16]) box(x,y,0,.10,.10,5,rubber);
        box(-.37,-.28,4,.74,.56,3,metal);
        box(-.34,-.25,7,.68,.50,8,variant === 2 ? red : iron);
        box(-.31,-.22,15,.62,.44,1,["#3a4945","#35443d","#2f3e37"]);
        edge([-.30,.25,12],[.30,.25,12],"#8d9b90");
        for (const x of [-.24,-.08,.08,.24]) edge([x,.253,8],[x,.253,13],"#a5a68f");
        box(-.36,-.27,10,.06,.06,9,metal);
        box(-.36,.19,10,.06,.06,9,metal);
        box(-.38,-.27,19,.10,.52,2,metal);
        if (powered) box(-.21,.26,9,.42,.26,2,metal);
        else mark([.02,.256,10],"#c3b391",3,1);
        break;
      case "crate":
        box(-.35, -.31, 0, .70, .62, 17, oak);
        for (const z of [4, 9, 14]) {
          edge([-.35, .312, z], [.35, .312, z], "#493b30");
          edge([.352, -.31, z], [.352, .31, z], "#493b30");
        }
        for (const x of [-.32, .24]) box(x, .31, 1, .075, .045, 16, metal);
        edge([-.23, -.18, 17], [.23, -.18, 17], "#b89b74");
        for (const x of [-.29, .27]) for (const z of [3, 13]) mark([x, .361, z], "#d1c09b");
        for (const z of [6, 11, 15]) {
          edge([-.19, .313, z], [.09, .313, z], "#a0835b");
          mark([.16, .314, z - 1], "#574332", 2);
        }
        const stencil = ["#baad83", "#a6a18d", "#917050"][variant];
        mark([-.12, .315, 11], stencil, 3, 2);
        mark([-.03, .315, 10], stencil, 2);
        break;
      case "generator":
        box(-.38, -.30, 0, .76, .60, 3, rubber);
        box(-.31, -.25, 3, .62, .50, 13, red);
        box(-.26, -.22, 16, .52, .44, 2, metal);
        box(-.28, .25, 5, .34, .05, 9, iron);
        for (const z of [6, 8, 10, 12]) edge([-.25, .305, z], [.02, .305, z], "#293533");
        box(.10, .25, 9, .12, .05, 5, rubber);
        box(.13, .305, 11, .06, .03, 2, powered ? ["#bfd391", "#95aa6a", "#7c8f55"] : metal);
        edge([-.20, -.12, 18], [.14, -.12, 18], "#e0ceb1");
        mark([.16, .09, 18], "#414a44", 3, 2);
        mark([.312, .11, 11], "#bf9169", 2, 2);
        for (const x of [-.25, .02]) mark([x, .307, 13], "#c5baa1");
        break;
      case "bed": {
        for (const side of [-.32, .26]) for (const end of [-.43, .38]) box(side, end, 0, .07, .07, 9, oak);
        box(-.37, -.51, 7, .74, 1.02, 3, oak);
        box(-.34, -.46, 10, .68, .93, 5, enamel);
        box(-.29, -.42, 15, .55, .24, 3, enamel);
        edge([-.23, -.33, 18], [.18, -.33, 18], "#e9dfc080");
        box(-.35, -.13, 15, .70, .60, 2, cloth);
        box(-.35, -.16, 17, .70, .10, 1, cloth);
        for (const seam of [0, .16, .33]) edge([-.31, seam, 17], [.31, seam, 17], "#ddd0ad48");
        for (const seam of [-.16, .13]) edge([seam, -.04, 17], [seam, .43, 17], "#222d2f62");
        box(-.38, -.53, 7, .76, .064, 18, oak);
        for (const upright of [-.27, .26]) edge([upright, -.46, 13], [upright, -.46, 24], "#b5956766");
        break;
      }
      case "fridge": {
        box(-.32, -.29, 0, .64, .58, 3, rubber);
        box(-.37, -.32, 3, .74, .64, 30, enamel);
        box(-.35, .30, 5, .70, .054, 18, enamel);
        box(-.35, .30, 24, .70, .054, 8, enamel);
        edge([-.34, .36, 23], [.34, .36, 23], "#4f5d55");
        box(-.26, .36, 18, .20, .035, 2, metal);
        box(-.26, .36, 26, .16, .035, 2, metal);
        const [px, py] = p(.24, .36, 28);
        dot(px, py, 2, 1, powered ? "#ceda91" : "#666f61");
        dot(px - 10, py + 7, 3, 2, "#a480697d");
        mark([.14, .36, 17], "#b19069", 3, 2);
        mark([.15, .36, 16], "#c9b38b", 2);
        edge([-.31, .36, 7], [.29, .36, 7], "#818a7a");
        mark([.22, .36, 8], "#927b65", 2);
        break;
      }
      case "sink":
      case "washstand": {
        box(-.34, -.28, 2, .68, .56, 15, oak);
        edge([0, .287, 3], [0, .287, 16], "#3e342b");
        for (const pull of [-.19, .10]) box(pull, .28, 12, .09, .035, 1, metal);
        box(-.39, -.31, 17, .78, .62, 3, enamel);
        box(-.30, -.20, 20, .37, .36, 1, ["#596d69", "#455552", "#343f40"]);
        edge([-.29, .15, 21], [.07, .15, 21], "#d4d8ba");
        for (const rib of [.17, .25, .33]) edge([rib, -.22, 20], [rib, .16, 20], "#65746f");
        box(-.12, -.26, 20, .055, .06, 6, metal);
        box(-.12, -.22, 25, .055, .19, 1, metal);
        break;
      }
      case "cupboard":
      case "wardrobe":
      case "sideboard": {
        const tall = kind !== "sideboard", height = tall ? 34 : 18;
        for (const foot of [-.32, .26]) box(foot, .19, 0, .06, .07, 4, oak);
        box(-.39, -.29, 4, .78, .58, height - 4, oak);
        box(-.41, -.31, height, .82, .62, 2, oak);
        for (const door of [-.34, .025]) {
          box(door, .286, 6, .31, .036, height - 9, oak);
          edge([door + .035, .33, 8], [door + .035, .33, height - 5], "#a9895c");
          edge([door + .035, .33, height - 5], [door + .275, .33, height - 5], "#a9895c");
        }
        box(-.09, .33, height * .60, .045, .027, 3, metal);
        box(.05, .33, height * .60, .045, .027, 3, metal);
        if (!tall) box(.14, -.13, height + 2, .13, .16, 1, cloth);
        break;
      }
      case "shelf": {
        box(-.36, -.29, 1, .72, .06, 23, oak);
        for (const side of [-.38, .30]) box(side, -.29, 0, .07, .56, 25, oak);
        for (const level of [4, 13, 23]) {
          box(-.32, -.27, level, .64, .54, 2, oak);
          if (level < 23) {
            box(-.24, -.12, level + 2, .12, .12, 5, cloth);
            box(-.05, -.14, level + 2, .12, .14, 4, enamel);
          }
        }
        break;
      }
      case "table": {
        for (const side of [-.34, .28]) for (const end of [-.31, .25]) box(side, end, 0, .065, .065, 17, oak);
        box(-.43, -.40, 17, .86, .80, 3, oak);
        for (const joint of [-.24, 0, .21]) edge([-.40, joint, 20], [.40, joint, 20], "#48362f60");
        edge([-.39, .36, 20], [.38, .36, 20], "#ad8b62");
        box(-.23, -.10, 20, .21, .17, 1, enamel);
        edge([-.20, -.05, 21], [-.06, -.05, 21], "#707164");
        box(.13, -.18, 20, .10, .10, 4, cloth);
        break;
      }
      case "sofa":
      case "armchair": {
        const half = kind === "sofa" ? .49 : .37;
        for (const side of [-half + .06, half - .12]) for (const end of [-.24, .22]) box(side, end, 0, .06, .06, 5, oak);
        box(-half, -.32, 4, 2 * half, .65, 9, cloth);
        box(-half + .04, -.34, 12, 2 * half - .08, .17, 13, cloth);
        const seats = kind === "sofa" ? 2 : 1, width = (2 * half - .24) / seats;
        for (let seat = 0; seat < seats; seat++) {
          const side = -half + .12 + width * seat;
          box(side, -.14, 13, width - .015, .44, 3, cloth);
          edge([side + .02, .285, 16], [side + width - .03, .285, 16], "#d5c3ad60");
        }
        for (const side of [-half, half - .11]) box(side, -.21, 13, .11, .52, 7, cloth);
        box(half - .28, -.14, 16, .14, .18, 4, enamel);
        break;
      }
      case "rug": {
        const corners = [p(-.46, -.42), p(.46, -.42), p(.46, .42), p(-.46, .42)];
        poly(corners, "#5b4844", "#372e30");
        poly([p(-.40, -.36), p(.40, -.36), p(.40, .36), p(-.40, .36)], "#876d59", "#b29a78");
        for (const row of [-.27, -.13, .01, .15, .29]) edge([-.37, row, 0], [.37, row, 0], row > 0 ? "#b89b704f" : "#4338385e");
        for (const side of [-.3, -.15, 0, .15, .3]) {
          edge([side, -.48, 0], [side, -.42, 0], "#c0aa89");
          edge([side, .42, 0], [side, .48, 0], "#c0aa89");
        }
        break;
      }
    }
  }

  function drawFurniture(kind, x, y, variant, powered) {
    const key = kind + ":" + variant + ":" + Number(powered);
    let sprite = furnitureSprites.get(key);
    if (!sprite) {
      sprite = document.createElement("canvas");
      sprite.width = 72;
      sprite.height = 64;
      const previous = ctx;
      try {
        ctx = sprite.getContext("2d");
        ctx.translate(36, 49);
        paintFurniture(kind, variant, powered);
      } finally { ctx = previous; }
      furnitureSprites.set(key, sprite);
    }
    const [sx, sy] = p(x, y);
    ctx.drawImage(sprite, Math.round(sx) - 36, Math.round(sy) - 49);
  }

  let smokeSprite;
  function campfireSmoke(x, y, clock) {
    if (!smokeSprite) {
      smokeSprite = document.createElement("canvas");
      smokeSprite.width = 16; smokeSprite.height = 12;
      const smoke = smokeSprite.getContext("2d");
      smoke.fillStyle = "#767771";
      smoke.fillRect(2, 4, 12, 4); smoke.fillRect(5, 2, 7, 8);
      smoke.fillStyle = "#a6a59a";
      smoke.fillRect(4, 4, 7, 3);
    }
    const alpha = ctx.globalAlpha;
    for (let i = 0; i < 3; i++) {
      const age = (clock * .64 + i / 3) % 1;
      const size = Math.round(9 + age * 11);
      ctx.globalAlpha = alpha * .38 * Math.sin(age * Math.PI);
      ctx.drawImage(smokeSprite, Math.round(x - 5 + age * 15), Math.round(y - 15 - age * 38), size, Math.round(size * .75));
    }
    ctx.globalAlpha = alpha;
  }

  function prop(o, state, clock, motion, smoke) {
    const {x, y, kind, tint: tone} = o;
    if (darkLook) {
      const furniture = kind === "locker" && !o.opened && World.tileAt(state.world, x, y)?.room === "Bedroom" ? "cupboard" : kind;
      if (furnitureKinds.has(furniture)) {
        const variant = Number.isFinite(tone) ? clamp(Math.floor(tone * 3), 0, 2) : 0;
        const powered = kind === "generator" ? Boolean(o.running) :
          kind === "barrel" ? Sim.rainBottles(o) > 0 :
          kind === "radio" ? Boolean(state.flags.radio) :
          kind === "cart" ? Boolean(o.opened) :
          kind === "fridge" && Sim.hasPower(state, o);
        drawFurniture(furniture, x, y, variant, powered);
        if (kind === "generator" && powered) glow(x, y, "#9dca77", 30, .35);
        return;
      }
    }
    const f = (dx, dy, z, w, d, h, c) => box(x + dx, y + dy, z, w, d, h, c);
    if (kind === "fungus") {
      const sap = state.atmosphere.awake ? olive : ["#c3c98b","#778752","#566449"];
      for (const [dx,dy,h] of [[-.28,.1,2],[.07,-.14,4],[.13,.19,3]]) f(dx,dy,1,.13,.12,h,sap);
      return;
    }
    if (kind === "projector") {
      f(-.26,-.29,0,.53,.55,15,rubber);
      f(-.14,-.20,15,.33,.34,8,olive);
      f(-.23,-.26,18,.12,.12,4,state.atmosphere.awake && state.world.cinema === "projector" ? cream : rubber);
      return;
    }
    if (kind === "beertap") { // small bar with three brass taps
      f(-.3,-.2,0,.6,.4,11,["#6a4a33","#4d3626","#362619"]);
      for (const dx of [-.18,-.03,.12]) f(dx,-.06,11,.05,.05,7,["#d6b25a","#9c7d39","#6b5426"]);
      return;
    }
    if (kind === "terminal") {
      f(-.22,-.2,0,.44,.38,10,["#59605a","#3f4540","#2c312d"]);
      f(-.14,-.12,10,.28,.06,9,o.read ? ["#3b4a3c","#2c372d","#1f2720"] : ["#7fd08a","#4f8f5a","#2f5a36"]);
      return;
    }
    if (kind === "statue") {
      if (!o.active) return;
      // A classic squat golden idol on a stone altar: low seated body, big round head, small ears.
      const gold = ["#e8c25e","#b48a33","#765a22"], shade = ["#c99d3f","#8c6a28","#5a441a"];
      f(-.24,-.24,0,.48,.48,12,["#6b6257","#4e473f","#37322c"]);
      f(-.27,-.27,12,.54,.54,2,["#80776a","#5d554c","#433d36"]);
      f(-.14,-.12,14,.28,.24,3,shade);
      f(-.07,-.06,17,.14,.12,5,gold);
      f(-.13,-.12,22,.26,.24,9,gold);
      f(-.16,-.03,24,.03,.08,5,shade);
      f(.13,-.03,24,.03,.08,5,shade);
      f(-.08,.12,26,.16,.015,2,["#2b2418","#2b2418","#2b2418"]);
      return;
    }
    if (kind === "cinema-body") {
      f(-.13,-.08,12,.35,.31,8,rubber);
      f(.08,-.05,17,.22,.20,4,olive);
      return;
    }
    if (kind === "cinema-guest") {
      if (state.elapsed >= (state.cinemaGuestUntil ?? 0)) return;
      f(-.09,-.08,0,.3,.28,20,olive);
      f(-.05,-.07,20,.22,.19,7,cream);
      return;
    }
    if (kind === "sleeper") {
      if (state.atmosphere.awake) return;
      shadow(x,y,19,7);
      f(-.38,-.15,0,.58,.31,6,rubber);
      f(-.22,-.18,4,.45,.36,6,olive);
      f(.21,-.12,0,.19,.21,7,["#9c9677","#716b56","#534d42"]);
      return;
    }
    if (kind === "crib") {
      shadow(x,y,27,11);
      f(-.45,-.37,1,.90,.74,11,wood);
      f(-.38,-.28,12,.76,.56,3,cream);
      const rise = state.atmosphere.nursery ? 3*Math.sin(clock*3) : 0;
      f(-.18,-.14,15,.39,.34,5+Math.max(0,rise),olive);
      if (state.atmosphere.nursery) {
        f(.13,-.08,17+rise,.21,.18,8,["#a3a289","#7d856d","#5d6554"]);
        const [sx,sy] = p(x+.31,y+.1,23+rise);
        ctx.fillStyle="#dedbb5";ctx.fillRect(sx-2,sy,2,1.5);ctx.fillRect(sx+2,sy-1,2,1.5);
      }
      for (const edge of [-.36,.32]) {
        f(-.45,edge,29,.90,.055,3,wood);
        for (const dx of [-.40,-.22,-.04,.14,.33]) f(dx,edge,11,.045,.055,18,cream);
      }
      return;
    }
    if (kind === "dogbowl") {
      shadow(x,y,14,6);
      f(-.20,-.17,0,.4,.34,4,["#6792a5","#406b83","#385263"]);
      f(-.13,-.11,4,.26,.22,1,rubber);
      return;
    }
    if (kind === "seedbox") {
      if (Chronicle.has(state.ledger,o.record)) return;
      f(-.33,-.22,0,.66,.44,12,olive);
      f(-.34,-.23,12,.68,.46,3,iron);
      f(-.07,.22,7,.14,.04,4,cream);
      return;
    }
    if (kind === "parade-wheel") {
      shadow(x,y,22,8);
      const [sx,sy] = p(x,y,12);
      ctx.fillStyle = "#8b5a30";
      ctx.beginPath(); ctx.ellipse(sx,sy+5,16,8,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#cc9d54";
      ctx.beginPath(); ctx.ellipse(sx,sy,16,8,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#e6c380";
      ctx.beginPath(); ctx.ellipse(sx,sy,12,5.5,0,0,Math.PI*2); ctx.stroke();
      f(-.14,-.13,14,.28,.22,1,cream);
      return;
    }
    if (kind === "wardrobe" || kind === "sideboard") {
      const height = kind === "wardrobe" ? 43 : 20;
      f(-.43,-.28,0,.86,.56,height,wood);
      f(-.4,-.3,height,.8,.6,2,kind === "wardrobe" ? wood : cream);
      line(p(x,y+.285,2),p(x,y+.285,height-1),"#2b3025",2);
      for (const dx of [-.11,.08]) f(dx,.28,height*.54,.045,.035,3,iron);
      return;
    }
    if (kind === "bookcase" || kind === "toolrack") {
      for (const dx of [-.42,.36]) f(dx,-.23,0,.06,.43,39,kind === "bookcase" ? wood : iron);
      for (const z of [4,14,25,37]) f(-.38,-.23,z,.76,.42,2,wood);
      for (const [dx,z] of [[-.31,6],[-.19,6],[.03,16],[.14,16],[-.27,27],[-.16,27],[.06,27]]) f(dx,-.17,z,.08,.23,7,kind === "toolrack" ? iron : z%2 ? teal : red);
      return;
    }
    if (kind === "armchair") {
      shadow(x,y,22,8);
      f(-.36,-.34,0,.72,.68,9,wood);
      f(-.31,-.26,9,.62,.55,8,tone < .5 ? teal : red);
      f(-.36,-.34,13,.72,.14,20,tone < .5 ? teal : red);
      for (const dx of [-.34,.25]) f(dx,-.21,14,.09,.54,9,wood);
      return;
    }
    if (kind === "sink" || kind === "washstand") {
      f(-.35,-.28,0,.70,.56,21,kind === "sink" ? iron : wood);
      f(-.39,-.30,21,.78,.60,3,cream);
      f(-.21,-.18,24,.43,.34,1,teal);
      f(.07,-.27,24,.07,.11,8,iron);
      f(.07,-.23,31,.07,.19,2,plastic);
      return;
    }
    if (kind === "milk-bottles") {
      for (const dx of [-.24,0,.24]) f(dx,-.1,0,.15,.16,7,cream);
      return;
    }
    if (kind === "sample-case") {
      f(-.28,-.24,0,.56,.48,10,iron);
      f(-.16,-.12,10,.20,.21,6,teal);
      f(.09,-.12,10,.15,.16,4,olive);
      return;
    }
    if (kind === "broken-recorder") {
      f(-.26,-.18,0,.52,.36,4,rubber);
      f(-.2,-.11,4,.12,.12,2,iron);
      f(.1,-.13,4,.13,.13,2,iron);
      return;
    }
    if (kind === "carriage-door") {
      f(-.37,-.18,0,.74,.24,4,iron);
      f(-.30,-.12,4,.64,.11,32,teal);
      f(-.23,-.13,23,.48,.12,10,rubber);
      line(p(x-.26,y-.11,12),p(x+.28,y-.11,19),"#ab825d",2);
      return;
    }
    if (kind === "record") {
      shadow(x,y,11,4);
      f(-.2,-.17,1,.4,.34,2,["#d9c9a2","#9d8c6c","#756b57"]);
      for (const offset of [-.08,.025,.105]) line(p(x-.13,y+offset,3.1),p(x+.12,y+offset,3.1),"#6b5e48",1.5);
      return;
    }
    if (kind === "relay" || kind === "dispatch") {
      const opened = kind === "relay" && Chronicle.has(state.ledger,o.record);
      if (opened && Chronicle.entries[o.record].reward) return;
      shadow(x,y,19,6);
      f(-.31,-.25,0,.62,.50,kind === "dispatch" ? 19 : 12,kind === "dispatch" ? wood : iron);
      f(-.22,-.19,kind === "dispatch" ? 19 : 12,.43,.39,4,rubber);
      const powered = kind === "dispatch" ? state.ledger.dispatch : opened;
      f(.08,.10,kind === "dispatch" ? 23 : 16,.11,.10,2,powered ? ["#b2cf89","#809d69","#5a7751"] : ["#dbb278","#9d7a59","#705a44"]);
      return;
    }
    if (kind === "exit") {
      shadow(x,y,24,9);
      if (state.world.underground || o.id === "exit-" + Regions.cavern) {
        f(-.40,-.32,0,.80,.64,3,rubber);
        f(-.40,-.18,0,.13,.15,32,wood);
        f(.26,-.18,0,.13,.15,32,wood);
        line(p(x-.34,y-.11,31),p(x+.33,y-.11,31),"#978568",3);
        line(p(x-.01,y-.11,31),p(x-.01,y+.13,2),"#ccb685",2.5);
        return;
      }
      f(-.07,-.07,0,.14,.14,44,wood);
      f(-.49,-.08,27,.98,.16,16,["#d9be84","#937148","#755839"]);
      const [sx,sy] = p(x,y,35);
      poly([[sx-10,sy-1],[sx+2,sy-1],[sx+2,sy-5],[sx+11,sy+1],[sx+2,sy+7],[sx+2,sy+3],[sx-10,sy+3]],"#f7dfab");
      return;
    }
    if (o.action === "mushroom") {
      if (o.harvested) return;
      const cap = ["#c1a589","#8b6d55","#694d3e"];
      f(-.17,-.12,0,.12,.12,5,cream);
      f(-.25,-.20,5,.28,.28,4,cap);
      f(.13,.06,0,.10,.10,3,cream);
      f(.07,0,3,.22,.22,3,cap);
      if (o.colony === "active") {
        const glow = state.reduceFlicker || Math.floor(state.elapsed * 2) % 2 === 0 ? "#e8ac78" : "#a88767";
        line(p(x-.38,y-.01,1),p(x-.08,y+.18,1),glow,2);
        line(p(x+.27,y-.24,1),p(x+.38,y+.21,1),glow,2);
      }
      return;
    }
    if (kind === "forage") {
      shadow(x,y,17,6);
      if (o.resource === "bait") {
        f(-.34,-.1,0,.62,.24,5,wood);
        f(.07,-.24,0,.30,.12,4,cream);
      } else {
        f(-.31,-.33,0,.64,.66,9,olive);
        f(-.2,-.21,9,.45,.45,7,["#5b7049","#495e40","#3e5337"]);
        if (!o.forageAt || o.forageAt <= state.minutes) {
          const berries = o.resource === "apple" ? red : ["#ab8391","#69455e","#58405a"];
          f(-.19,.12,9,.1,.11,4,berries);
          f(.08,-.13,16,.12,.12,4,berries);
          f(.19,.09,9,.11,.10,4,berries);
        }
      }
      return;
    }
    if (kind === "spring") {
      shadow(x,y,19,7);
      f(-.32,-.32,0,.65,.54,9,iron);
      f(-.22,-.25,9,.43,.28,3,teal);
      line(p(x-.10,y+.04,12),p(x-.10,y+.42,1),"#a2cbca",3);
      return;
    }
    if (kind === "fish") {
      f(-.23,-.30,0,.46,.60,7,wood);
      f(.14,.09,7,.10,.10,22,iron);
      if (o.fishUntil != null) {
        line(p(x+.14,y+.10,29),p(x+.55,y-.31,2),"#e4dbc0b0");
        shadow(x+.56,y-.31,5,3,o.fishUntil <= state.minutes ? "#e9bb7d" : "#d68365");
      }
      return;
    }
    if (kind === "cargo") {
      const casing = tone < .45 ? red : teal;
      shadow(x,y,24,9);
      f(-.47,-.46,0,.94,.92,26,casing);
      for (const r of [-.33,-.11,.11,.33]) line(p(x+r,y+.465,3),p(x+r,y+.465,23),"#222f2a8a",2);
      f(-.47,.45,0,.94,.04,3,iron);
      f(-.47,.45,23,.94,.04,3,iron);
      return;
    }
    if (kind === "bed") {
      shadow(x, y, 27, 10);
      for (const dx of [-.33, .26]) {
        for (const dy of [-.46, .37]) f(dx, dy, 0, .07, .07, 11, iron);
      }
      f(-.39, -.50, 10, .78, 1.02, 4, iron);
      f(-.35, -.45, 14, .70, .92, 5, tone < .5 ? plastic : teal);
      f(-.22, -.39, 19, .44, .24, 3, cream);
      f(-.35, -.02, 19, .70, .45, 1, tone < .5 ? teal : olive);
      f(-.38, -.51, 16, .76, .06, 12, iron);
      f(-.38, .47, 12, .76, .07, 10, iron);
      return;
    }
    if (kind === "iv") {
      shadow(x, y, 10, 4);
      f(-.16, -.12, 0, .32, .24, 2, rubber);
      f(-.025, -.025, 2, .055, .055, 30, iron);
      f(-.09, -.04, 28, .18, .12, 7, plastic);
      line(p(x + .08, y + .08, 29), p(x + .12, y + .08, 12), "#97ac98a8");
      return;
    }
    if (kind === "shelf" || kind === "locker") {
      const lootable = kind === "locker";
      const c = lootable ? tone > .5 ? teal : olive : wood;
      shadow(x, y, 25, 9);
      f(-.40, -.31, 0, .80, .62, lootable ? 34 : 25, c);
      for (const z of [8, 17, 26]) {
        if (!lootable && z === 26) break;
        line(p(x - .39, y + .315, z), p(x + .38, y + .315, z), "#29372ec0");
        if (!lootable) f(-.29 + (z % 2) * .16, .18, z, .16, .15, 5, tone < .48 ? plastic : red);
      }
      if (lootable) {
        f(-.26, .30, 19, .17, .044, 3, o.opened ? rubber : cream);
        if (o.opened) f(.02, .32, 4, .28, .08, 27, iron);
      }
      return;
    }
    if (kind === "counter") {
      shadow(x, y, 24, 8);
      f(-.45, -.32, 0, .90, .64, 17, wood);
      f(-.49, -.35, 17, .98, .70, 3, plastic);
      f(-.14, -.16, 20, .25, .23, 5, rubber);
      f(-.15, -.17, 25, .27, .05, 8, iron);
      return;
    }
    if (kind === "chair" || kind === "bench") {
      const long = kind === "bench" ? .93 : .49;
      shadow(x, y, 17, 5);
      f(-long / 2, -.23, 0, long, .46, 6, rubber);
      f(-long / 2, -.24, 6, long, .47, 4, teal);
      f(-long / 2, -.25, 8, long, .08, 9, iron);
      return;
    }
    if (kind === "cart") {
      shadow(x, y, 22, 7);
      f(-.28, -.30, 0, .56, .60, 3, rubber);
      f(-.34, -.33, 3, .68, .66, 15, tone > .5 ? red : teal);
      f(-.37, -.36, 18, .74, .72, 2, plastic);
      if (o.opened) f(-.22, .35, 11, .46, .23, 3, iron);
      line(p(x - .20, y + .34, 10), p(x + .18, y + .34, 10), "#dae0c695", 1.6);
      return;
    }
    if (Sim.isBarrier(o)) {
      if (!o.hp) {
        f(-.34, -.24, 0, .68, .47, 3, wood);
        return;
      }
      const connects = (dx, dy) => state.world.objects.some(other => other.active && other.hp > 0 && Sim.isBarrier(other) &&
        (other.x === x + dx && other.y === y + dy || other.x === x - dx && other.y === y - dy));
      const alongX = connects(1, 0), alongY = connects(0, 1);
      const axis = alongX === alongY ? o.axis : alongX ? "x" : "y";
      if (o.material === "stone") {
        const horizontal = axis === "x";
        f(horizontal ? -.48 : -.20,horizontal ? -.20 : -.48,0,horizontal ? .96 : .40,
          horizontal ? .40 : .96,24,["#898783","#646460","#50504d"]);
        return;
      }
      const rails = (horizontal, open) => {
        for (const offset of [-.43, .38]) f(horizontal ? offset : -.06, horizontal ? -.06 : offset, 0, .11, .11, 28, wood);
        if (open) { f(-.43, -.06, 3, .09, .50, 21, olive); return; }
        for (const z of [3, 10, 17]) f(horizontal ? -.47 : -.065, horizontal ? -.065 : -.47, z,
          horizontal ? .94 : .13, horizontal ? .13 : .94, 6, kind === "gate" ? olive : wood);
      };
      rails(axis === "x", o.open);
      if (kind === "fence" && alongX && alongY) rails(axis !== "x", false);
      return;
    }
    if (kind === "door" || kind === "window") {
      const t = World.tileAt(state.world,x,y), horizontal=t.wallAxis==="x";
      if (darkLook) {
        const open = o.open && !o.boards, broken = o.broken && !o.boards;
        const variant = Number(horizontal) | (open ? 2 : 0) | (broken ? 4 : 0);
        drawFurniture(kind, x, y, variant, false);
        for (let i = 0; i < (o.boards || 0); i++) {
          const board = 7 + i * 7;
          f(horizontal ? -.44 : -.13, horizontal ? -.13 : -.44, board,
            horizontal ? .88 : .26, horizontal ? .26 : .88, 3, olive);
        }
        if (!open && !broken && (o.locked || o.latched)) {
          f(horizontal ? .22 : .07, horizontal ? .07 : .24, 13, .08, .08, 3, olive);
        }
        return;
      }
      if (o.broken && !o.boards) {
        f(horizontal ? -.47 : -.06, horizontal ? -.06 : -.47, 0, horizontal ? .94 : .12, horizontal ? .12 : .94, 4, iron);
        if (kind === "window") for (const offset of [-.31, -.06, .22]) {
          f(horizontal ? offset : -.08, horizontal ? -.08 : offset, 0, .12, .10, 1, cream);
        }
        return;
      }
      if (o.open && !o.boards) {
        f(-.4,-.3,0,.08,.65,29,wood);
      } else {
        f(horizontal ? -.48 : -wallWidth / 2, horizontal ? -wallWidth / 2 : -.48, 0,
          horizontal ? .96 : wallWidth, horizontal ? wallWidth : .96, 29, kind === "window" ? iron : wood);
        for(let i=0;i<(o.boards||0);i++) f(-.44,-.13,7+i*7,.88,.26,3,olive);
        if (o.locked || o.latched) f(horizontal ? .22 : .07, horizontal ? .07 : .24, 13, .08, .08, 3, olive);
      }
      return;
    }
    if(kind==="fridge") {
      f(-.38,-.33,0,.76,.66,33,cream);
      line(p(x-.36,y+.34,12),p(x+.36,y+.34,12),"#465348");
      f(-.25,.34,18,.07,.045,8,iron);
      f(.19,.34,25,.08,.045,2,Sim.hasPower(state, o) ? ["#aec784","#81965b","#809757"] : rubber);
      return;
    }
    if (kind === "tap") {
      f(-.34,-.28,0,.68,.56,15,wood);
      f(-.36,-.31,15,.72,.62,3,cream);
      f(-.25,-.20,18,.50,.37,1,iron);
      f(.11,-.23,19,.07,.07,8,cream);
      f(.04,-.23,26,.13,.14,2,cream);
      return;
    }
    if (kind === "generator") {
      shadow(x,y,22,9);
      f(-.38,-.30,0,.76,.60,3,rubber);
      f(-.31,-.25,3,.62,.50,13,red);
      f(-.23,-.22,16,.46,.44,2,iron);
      f(-.31,.25,5,.33,.05,9,iron);
      f(.08,.25,10,.08,.045,2,o.running ? ["#b7dc86","#849d69","#768951"] : rubber);
      if (o.running) glow(x, y, "#9dca77", 30, .35);
      return;
    }
    if(kind==="drop" && o.corpse) {
      if (darkLook) bloodPool(o.x, o.y, .5, .3, Math.floor(o.died ?? 0) % 9);
      shadow(x,y,22,7);
      f(-.45,-.14,0,.32,.28,2,["#5b5a47","#44432f","#34331f"]);
      f(-.16,-.17,0,.46,.34,3,["#6d7452","#555b3f","#454a33"]);
      f(.3,-.12,0,.22,.24,4,["#8d9a79","#6f7b5f","#5b664e"]);
      return;
    }
    if (kind === "drop") {
      const item = o.loot?.find(i => Object.hasOwn(weaponArt,i.id));
      if (item) {
        const [sx,sy] = p(x,y,2);
        shadow(x,y,12,4);
        drawHeldWeapon(item.id,sx-7,sy,1,4);
        return;
      }
      if (!o.loot?.length) return;
    }
    if(kind==="crate" || kind==="drop") {
      const small=kind==="drop";
      shadow(x,y,19,7);
      f(-.34,-.30,0,.68,.60,small?7:19,small?olive:wood);
      for(const z of [5,13]) if(!small)line(p(x-.34,y+.305,z),p(x+.34,y+.305,z),"#292f23");
      return;
    }
    if(kind==="tree") {
      if (darkLook) {
        const wind = motion ? Math.round(Math.sin(clock * 1.6 + x * .8 + y * .4) * (state.weather === "Rain" ? 3 : 2)) : 0;
        gardenTree(x, y, tone, wind, o.treeType === "pine");
        return;
      }
      shadow(x,y,30,11);
      f(-.1,-.1,0,.2,.2,24,wood);
      if (o.treeType === "pine") {
        const [sx,sy] = p(x,y,5), height = 44 + tone*22;
        for (let i = 0; i < 3; i++) {
          const base = sy - 19 - i*11, tip = sy - height - i*8, breadth = 27 - i*5;
          poly([[sx,tip],[sx-breadth,base],[sx,base+5]],i===2?"#688466":"#486448");
          poly([[sx,tip],[sx+breadth,base],[sx,base+5]],i===2?"#506e54":"#344f3e");
        }
        return;
      }
      f(-.38,-.39,17,.76,.78,19,["#536a42","#3d5233","#34482f"]);
      f(-.28,-.29,36,.56,.58,12,["#61784b","#4c623c","#405737"]);
      return;
    }
    if (kind === "sofa") {
      shadow(x,y,29,9);
      f(-.47,-.32,0,.94,.64,10,wood);
      f(-.45,-.29,10,.9,.58,5,teal);
      f(-.46,-.35,10,.92,.12,14,teal);
      f(-.48,-.29,10,.13,.60,9,iron);
      f(.35,-.29,10,.13,.60,9,iron);
      line(p(x,y-.22,15),p(x,y+.28,15),"#3e5f54");
      return;
    }
    if (kind === "table") {
      shadow(x,y,29,9);
      for (const dx of [-.35,.28]) for (const dy of [-.33,.26]) f(dx,dy,0,.07,.07,19,wood);
      f(-.44,-.41,19,.88,.82,3,wood);
      f(-.15,-.10,22,.25,.18,1,plastic);
      return;
    }
    if (kind === "rug") {
      f(-.49,-.49,.1,.98,.98,.1,["#7b5b47","#543e31","#543e31"]);
      return;
    }
    if (kind === "drum") {
      f(-.31,-.31,0,.62,.62,21,iron);
      f(-.35,-.35,21,.70,.70,2,olive);
      line(p(x-.3,y+.32,7),p(x+.3,y+.32,7),"#2b3931",2);
      return;
    }
    if (kind === "pump") {
      f(-.34,-.25,0,.68,.50,6,iron);
      f(-.27,-.20,6,.54,.40,26,red);
      f(-.21,-.21,23,.42,.42,13,cream);
      f(-.14,.215,27,.28,.045,5,rubber);
      line(p(x+.31,y,30),p(x+.43,y+.17,10),"#17221a",3);
      return;
    }
    if (kind === "lamp") {
      f(-.06,-.06,0,.12,.12,58,iron);
      f(-.05,-.08,55,.70,.16,3,iron);
      f(.45,-.12,54,.32,.24,3,cream);
      return;
    }
    if (kind === "car") {
      const heading = o.heading ?? (o.axis === "x" ? Math.PI : -Math.PI / 2);
      const forwardX = Math.cos(heading), forwardY = Math.sin(heading);
      const at = (side, forward, z) => p(x + side * -forwardY + forward * forwardX, y + side * forwardX + forward * forwardY, z);
      const panel = (side, front, z, width, length, height, colors, inset = 0) => {
        const footprint = [[side, front], [side + width, front], [side + width, front + length], [side, front + length]];
        const signs = [[-forwardX, -forwardY], [-forwardY, forwardX], [forwardX, forwardY], [forwardY, -forwardX]];
        const bottom = footprint.map(([u, v]) => at(u, v, z));
        const top = footprint.map(([u, v], i) => at(u + (i === 0 || i === 3 ? inset : -inset),
          v + (i < 2 ? inset : -inset), z + height));
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          if (signs[i][0] + signs[i][1] > 0) poly([bottom[i], bottom[j], top[j], top[i]], colors[1 + i % 2]);
        }
        poly(top, colors[0]);
      };
      poly([at(-.59, -.88, 0), at(.59, -.88, 0), at(.59, .87, 0), at(-.59, .87, 0)], "#090e0a75");
      const body = o.hp <= 0 ? rubber : tone > .55 ? teal : red;
      for (const side of [-.48, .29]) for (const axle of [-.59, .38]) panel(side, axle, 0, .19, .25, 7, rubber);
      panel(-.46, -.82, 5, .92, 1.64, 10, body);
      panel(-.42, -.47, 15, .84, .86, 11, [body[0], "#354d4b", "#263b39"], .11);
      panel(-.43, .44, 15, .86, .31, 2, body);
      const frontVisible = forwardX + forwardY > 0;
      for (const side of [-.37, .19]) {
        panel(side, frontVisible ? .78 : -.84, 10, .18, .06, 3, frontVisible ? cream : red);
      }
      return;
    }
    if(kind==="radio") {
      f(-.35,-.27,0,.7,.54,19,wood);
      f(-.24,-.18,19,.48,.36,12,iron);
      f(.14,-.16,31,.035,.035,18,plastic);
      const col=state.flags.radio?["#d4e9ac","#839768","#566743"]:red;
      f(-.13,.19,23,.16,.04,4,col);
      return;
    }
    if(kind==="barrel") {
      f(-.34,-.34,0,.68,.68,23,teal);
      f(-.27,-.27,23,.54,.54,1,Sim.rainBottles(o) ? teal : iron);
      return;
    }
    if (kind === "garden") {
      const g = o.garden, crop = Data.crops[g.crop];
      shadow(x, y, 23, 8);
      f(-.46,-.37,0,.92,.74,7,wood);
      const wet = g.moisture >= Data.garden.minMoisture;
      f(-.37,-.28,7,.74,.56,1,[wet ? "#514638" : "#806c4e", "#46392e", "#382d26"]);
      if (crop) {
        const maturity = g.growth / crop.minutes;
        const height = 3 + maturity * 9;
        for (const [dx,dy] of [[-.23,-.12],[.03,-.12],[.25,-.12],[-.17,.12],[.11,.12]]) {
          const [sx,sy] = p(x + dx, y + dy, 8);
          line([sx,sy],[sx,sy-height],wet ? "#a6bb73" : "#9f985e",1.5);
          poly([[sx,sy-height+2],[sx-4,sy-height-1],[sx-5,sy-height+2],[sx-1,sy-height+4]],wet ? "#829f62" : "#827647");
          poly([[sx,sy-height+2],[sx+4,sy-height-2],[sx+6,sy-height],[sx+2,sy-height+3]],wet ? "#9ab76b" : "#a8995b");
          if (maturity >= 1) poly([[sx-3,sy],[sx,sy-3],[sx+3,sy],[sx,sy+2]],g.crop === "strawberry" ? "#d07160" : g.crop === "radish" ? "#c68172" : "#cbb579");
        }
      }
      return;
    }
    if(kind==="campfire") {
      const [xx,yy]=p(x,y,8);
      if (smoke) campfireSmoke(xx, yy, clock);
      if (darkLook) {
        drawFurniture("campfire", x, y, motion ? Math.floor(clock * 7) % 4 : 0, false);
      } else {
        f(-.35,-.15,0,.7,.3,4,wood);
        f(-.15,-.35,3,.3,.7,4,wood);
        const sway = state.reduceFlicker ? 0 : Math.sin(clock*11)*3;
        poly([[xx-8,yy],[xx-4,yy-13-sway],[xx+2,yy-8],[xx+6,yy-18],[xx+9,yy]],"#efb16a");
      }
      const batch = Sim.fireBatch(state, o);
      if (batch) {
        f(-.22,-.22,14,.44,.44,6,iron);
        f(-.18,-.18,20,.36,.36,1,batch.remaining ? iron : teal);
      }
      return;
    }
  }

  const roofSprites = new WeakMap();

  function roof(building) {
    if (!darkLook) { roofArt(building); return; }
    let sprite = roofSprites.get(building);
    if (!sprite) {
      const {x, y, w, h} = building;
      const left = Math.floor((x - y - h) * halfW - 16);
      const top = Math.floor((x + y) * halfH - 72);
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil((w + h) * halfW + 32);
      canvas.height = Math.ceil((w + h) * halfH + 100);
      const previous = ctx;
      try {
        ctx = canvas.getContext("2d");
        ctx.translate(-left, -top);
        roofArt(building);
      } finally { ctx = previous; }
      sprite = {canvas, left, top};
      roofSprites.set(building, sprite);
    }
    ctx.drawImage(sprite.canvas, sprite.left, sprite.top);
  }

  function roofArt(building) {
    const {x,y,w,h}=building;
    const z=41, peak=building.compact ? 52 : 58;
    shadow(x+w*.5,y+h*.5,w*24,h*10,"#080c0980");
    const a=p(x-.1,y-.1,z), b=p(x+w+.1,y-.1,z);
    const c=p(x+w+.1,y+h+.1,z), d=p(x-.1,y+h+.1,z);
    const ridgeA=p(x+w*.5,y-.1,peak), ridgeB=p(x+w*.5,y+h+.1,peak);
    const slate = darkLook && building.type === "home" ? (building.compact ? "#56575a" : "#655653") : building.roof;
    poly([a,ridgeA,ridgeB,d],slate,"#343d32");
    poly([ridgeA,b,c,ridgeB],tint(slate,-10),"#343d32");
    poly([d,ridgeB,c,p(x+w+.1,y+h+.1,33),p(x-.1,y+h+.1,33)],"#696852");
    for(let i=1;i<h;i++) {
      line(p(x-.1,y+i,z),p(x+w*.5,y+i,peak),"#a8a48c22");
      line(p(x+w*.5,y+i,peak),p(x+w+.1,y+i,z),"#a8a48c1a");
    }
    if (darkLook) {
      for (const side of [-1, 1]) {
        const slope = w / 2 + .1;
        const rows = Math.ceil(slope / .38);
        for (let row = 1; row < rows; row++) {
          const t = row / rows, xx = x + w / 2 + side * slope * t;
          const zz = peak + (z - peak) * t;
          line(p(xx, y, zz), p(xx, y + h, zz), "#24262966");
          for (let yy = y + .22 + (row % 2) * .22; yy < y + h; yy += .49) {
            const next = (row + 1) / rows;
            line(p(xx, yy, zz), p(x + w / 2 + side * slope * next, yy, peak + (z - peak) * next), "#22252950");
          }
        }
      }
      line(ridgeA, ridgeB, "#9b8c7e", 2);
      if (building.type === "home") {
        for (const edge of [[a,d],[b,c]]) line(edge[0],edge[1],"#837c69",2);
        const gableY = y + h + .11;
        line(p(x-.05,gableY,39),p(x+w*.5,gableY,peak-2),"#302d29",2);
        line(p(x+w*.5,gableY,peak-2),p(x+w+.05,gableY,39),"#302d29",2);
        const ventX = x + w * .5;
        box(ventX-.18,gableY- .025,44,.36,.05,4,["#756758","#453b33","#40382e"]);
        for (const offset of [-.11,0,.11]) line(p(ventX+offset,gableY+.034,45),p(ventX+offset,gableY+.034,47),"#292923");
      }
    }
    if (!building.compact || (x+y) % 2 === 0) {
      const chimneyX = x+w*.72, chimneyY = y+h*.2;
      box(chimneyX,chimneyY,42,.55,.55,21,["#866b58","#5b493d","#493d32"]);
      if (darkLook && building.type === "home") {
        box(chimneyX-.035,chimneyY-.035,62,.62,.62,2,["#a28b70","#786958","#5f5548"]);
        box(chimneyX+.13,chimneyY+.12,64,.30,.3,1,["#363733","#423b31","#38342b"]);
        for (const z of [56,59]) line(p(chimneyX,chimneyY+.551,z),p(chimneyX+.55,chimneyY+.551,z),"#aa8a6e67");
      }
    }
  }

  function roofCoversPlayer(b, player) {
    if (b.x + b.y + b.w + b.h - .5 <= player.x + player.y) return false;
    const [px, py] = p(player.x, player.y);
    const left = (b.x - b.y - b.h) * halfW, right = (b.x + b.w - b.y) * halfW;
    const top = (b.x + b.y) * halfH - 60, bottom = (b.x + b.y + b.w + b.h) * halfH - 30;
    return px >= left && px <= right && py >= top && py - 31 <= bottom;
  }

  function marker(x, y, z, text, color = "#ebc278", alpha = 1) {
    const [sx, sy] = p(x, y, z);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#111811ee";
    ctx.strokeStyle = color;
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const w = ctx.measureText(text).width + 15;
    ctx.beginPath();
    ctx.roundRect(sx - w / 2, sy - 10, w, 20, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillText(text, sx, sy + 1);
    poly([[sx - 3, sy + 12], [sx + 3, sy + 12], [sx, sy + 17]], color);
    ctx.restore();
    return {x:sx, y:sy, width:w};
  }

  // Frame cells share a native pixel grid and fixed equipment palettes.
  const actorFrames = new Map(), actorAtlases = [], strides = new WeakMap();
  const spriteWidth = 36, spriteHeight = 48, spriteGround = 46;
  const backpackCloth = "#985b40", backpackLight = "#c4875e";
  const backpackPixels = [
    "...#######...",
    "..#hhhhhhh#..",
    ".#hmmmmmmhh#.",
    "#hhmmmmmmhms#",
    "#mKKmmmmKKms#",
    "#mLLmmmmLLms#",
    "#mKKmmmmKKms#",
    "#mmmmmmmmms#",
    "#msshhhhssms#",
    "#msmmmmmsms#",
    "#msmmmmmsms#",
    "#mssssssssms#",
    "#mmmmmmmmmss#",
    ".#sssssssss#.",
    "..#########.."
  ];
  const backpackPalette = {
    "#":"#3b2822", h:backpackLight, m:backpackCloth, s:"#714534", K:"#513629", L:"#e0b784"
  };

  function survivorPalette(player) {
    const options = Data.survivorStyle;
    const colour = (key,fallback) => options[key].options[player[key]]?.color ?? fallback;
    const female = player.appearance === "female";
    return {
      skin:colour("skinTone","#bca383"),
      hair:colour("hairColor",female ? "#624c39" : "#413e35"),
      jacket:colour("jacketColor","#748d7a"),
      cut:player.hairStyle && player.hairStyle !== "default" ? player.hairStyle : female ? "tied" : "short"
    };
  }

  function actorFrame(shirt, trousers, skin, hair, direction, pose, step, lift, pack, gesture, cut = "short") {
    const back = (direction & 2) !== 0, axial = (direction & 4) !== 0, profile = (direction & 8) !== 0;
    const showPack = back && pack && pose !== "dead";
    const key = [shirt, trousers, skin, hair, direction, pose, step, lift, showPack, gesture, cut].join("|");
    if (actorFrames.has(key)) return actorFrames.get(key);
    const index = actorFrames.size, slot = index % 128, page = Math.floor(index / 128);
    if (!actorAtlases[page]) {
      const canvas = document.createElement("canvas");
      canvas.width = 16 * spriteWidth;
      canvas.height = 8 * spriteHeight;
      actorAtlases[page] = canvas;
    }
    const canvas = actorAtlases[page], c = canvas.getContext("2d");
    const left = slot % 16 * spriteWidth, top = Math.floor(slot / 16) * spriteHeight;
    const mirrored = (direction & 1) !== 0;
    const ink = "#222a29", boot = "#3f3831";
    const jacketDark = tint(shirt,-28), jacketLight = tint(shirt,28);
    const jeanDark = tint(trousers,-19), jeanLight = tint(trousers,22);
    const skinDark = tint(skin,-32), skinLight = tint(skin,23);
    const rect = (x, y, w, h, color) => {
      const x0 = Math.max(0, x), y0 = Math.max(0, y);
      const x1 = Math.min(spriteWidth, x + w), y1 = Math.min(spriteHeight, y + h);
      if (x1 <= x0 || y1 <= y0) return;
      c.fillStyle = color;
      c.fillRect(left + (mirrored ? spriteWidth - x1 : x0),top+y0,x1-x0,y1-y0);
    };
    const shape = (points,color) => {
      const rows = points.map(([,y]) => y);
      for (let y = Math.max(0,Math.min(...rows)); y < Math.min(spriteHeight,Math.max(...rows)); y++) {
        const cuts = [];
        for (let i=0; i<points.length; i++) {
          const [x0,y0]=points[i], [x1,y1]=points[(i+1)%points.length];
          if ((y0>y+.5) !== (y1>y+.5)) cuts.push(x0+(x1-x0)*(y+.5-y0)/(y1-y0));
        }
        cuts.sort((a,b)=>a-b);
        for (let i=0; i+1<cuts.length; i+=2) {
          const start=Math.ceil(cuts[i]-.5), end=Math.ceil(cuts[i+1]-.5);
          rect(start,y,end-start,1,color);
        }
      }
    };
    let grip = null;
    if (pose === "dead") {
      shape([[3,42],[7,39],[17,40],[21,37],[29,38],[33,42],[30,45],[8,45]],ink);
      rect(7,41,10,3,trousers); rect(17,39,9,5,jacketDark);
      rect(24,40,3,2,shirt); rect(28,41,3,2,skinDark); rect(29,39,3,2,hair);
    } else {
      const strike = pose === "strike" || pose === "chase";
      const ready = pose === "ready";
      const running = pose === "run";
      const crouch = pose === "rest" ? 7 : pose === "sneak" ? 4 : running ? 1 : 0;
      const lean = pose === "hurt" ? -3 : strike ? [-2,1,3][gesture] : running ? 4 : pose === "sneak" ? 2 : 0;
      const x = 18 + (axial ? Math.sign(lean) : lean);
      const y = 15 + crouch - Number(lift !== 0) - (pose === "idle" ? gesture : 0);
      const hip = Math.min(34,y+14);
      const legs = profile ? [19,16] : [21,15];
      for (const [leg,root] of legs.entries()) {
        const stride = (leg ? step : -step) * (axial ? 1 : running ? 4 : 3);
        const knee = root + Math.round(stride*.6) + Number(crouch>0), foot = root + (axial ? 0 : stride);
        const depth = axial ? Math.min(0,Math.sign(stride)*(back ? -2 : 2)) : 0;
        const sole = 45 + depth - (lift === (leg ? -1 : 1) ? 3 : 0);
        const bend = Math.min(sole-4,hip+6);
        shape([[root-4,hip-2],[root+3,hip-2],[knee+3,bend],[foot+2,sole-3],
          [foot+5,sole-2],[foot+5,sole+1],[foot-4,sole+1],[foot-3,sole-4],[knee-3,bend]],ink);
        shape([[root-3,hip-1],[root+2,hip-1],[knee+2,bend],[foot+1,sole-4],
          [foot-2,sole-4],[knee-2,bend]],leg ? trousers : jeanDark);
        if (leg) {
          rect(knee-2,bend-2,3,2,jeanLight);
          rect(knee,bend-3,2,1,jeanLight);
        }
        rect(knee-1,bend,3,1,jeanLight);
        rect(knee,bend+1,2,1,jeanDark);
        rect(foot-2,sole-3,5,2,boot);
        rect(foot+1,sole-2,3,1,"#a58a6b");
        rect(foot-1,sole-3,2,1,"#b99b74");
        rect(foot-3,sole,7,1,"#65574a");
      }
      const swing = Math.sign(step);
      const armSwing = swing * (running ? 5 : 2);
      const farHand = x-(profile ? 5 : 9)+armSwing;
      const farY = Math.min(41,y+14-(running ? 4 : 1)*Math.max(0,swing));
      shape([[x-7,y],[x-4,y+2],[farHand+3,y+8],[farHand+2,farY+2],
        [farHand-2,farY+2],[farHand-2,y+7],[x-9,y+3]],ink);
      shape([[x-7,y+1],[x-5,y+2],[farHand+1,y+8],[farHand+1,farY-1],
        [farHand-1,farY-1],[farHand-1,y+7],[x-8,y+3]],jacketDark);
      rect(farHand-1,farY-1,2,2,skinDark);

      const torsoLeft = x - (profile ? 5 : 7), torsoRight = x + (profile ? 5 : 7);
      shape([[torsoLeft+1,y-2],[torsoRight-3,y-2],[torsoRight+1,y+1],[torsoRight-1,y+6],
        [x+4,hip],[x-5,hip],[torsoLeft+1,hip-4],[torsoLeft-1,y+2]],ink);
      shape([[torsoLeft+1,y-1],[torsoRight-4,y-1],[torsoRight-1,y+1],[torsoRight-2,y+6],
        [x+3,hip-1],[x-4,hip-1],[torsoLeft+2,hip-5],[torsoLeft,y+2]],shirt);
      shape([[torsoLeft+1,y],[torsoRight-4,y],[x+2,y+2],[x-4,y+3],[torsoLeft+1,y+2]],jacketLight);
      shape([[torsoRight-2,y+4],[x+4,y+9],[x+3,hip-1],[x-3,hip-1],[x+1,hip-4]],jacketDark);
      rect(x-3,hip-2,5,1,jacketDark);
      if (!back) {
        const zipper = x + (axial ? 0 : profile ? 3 : 1);
        rect(zipper,y+1,1,hip-y-4,jacketDark);
        rect(zipper,y+3,1,2,"#ded0ac");
        rect(x-4,y+5,3,1,jacketDark);
        rect(x-4,y+6,2,1,jacketLight);
        rect(x-5,y+2,1,1,"#c4ad80");
        rect(x-3,hip-4,2,1,jacketLight);
      }

      const handX = Math.min(32,strike ? x+[6,13,11][gesture] : x+(ready ? 11 : profile ? 5 : 8)-armSwing);
      const handY = strike ? y+[4,6,3][gesture] : ready ? y+5 : Math.min(41,y+14+swing-(running ? 3 : 0));
      const elbow = strike ? x+7 : x+(profile ? 4 : 7) - (running ? swing * 2 : 0);
      shape([[x+3,y],[x+7,y],[elbow+2,y+6],[handX+2,handY-1],
        [handX+2,handY+3],[handX-2,handY+3],[elbow-2,y+9],[x+2,y+3]],ink);
      shape([[x+3,y+1],[x+6,y+1],[elbow+1,y+6],[handX+1,handY-1],
        [handX-1,handY],[elbow-1,y+8]],shirt);
      rect(elbow,y+5,2,2,jacketLight);
      rect(elbow-1,y+7,2,1,jacketDark);
      rect(handX-1,handY-1,3,1,jacketDark);
      rect(handX-1,handY,3,2,skin);
      rect(handX-1,handY,1,1,skinLight);
      rect(handX+1,handY+1,1,1,skinDark);
      grip = [mirrored ? spriteWidth-handX-1 : handX+1, handY+1];

      // Draw the same bag above the back of the jacket, with no layers on the front.
      if (showPack) {
        const bagX = x-7, bagY = y-1;
        for (const [row,line] of backpackPixels.entries()) {
          for (let col=0; col<line.length; col++) {
            const color=backpackPalette[line[col]];
            if (color) rect(bagX+col,bagY+row,1,1,color);
          }
        }
      }
      const hx = x + (profile ? 2 : Number(!axial && !back)), hy = y-11;
      shape([[hx-5,hy+1],[hx-3,hy-1],[hx+3,hy-1],[hx+6,hy+2],[hx+6,hy+6],
        [hx+3,hy+10],[hx-3,hy+9],[hx-5,hy+6]],ink);
      shape([[hx-4,hy+2],[hx-2,hy],[hx+3,hy],[hx+5,hy+2],[hx+4,hy+6],
        [hx+2,hy+9],[hx-2,hy+8],[hx-4,hy+5]],back ? hair : skinDark);
      if (cut === "shaved") {
        rect(hx-3,hy+1,7,2,tint(hair,14));
        rect(hx-2,hy+1,4,1,tint(hair,31));
      } else {
        shape([[hx-4,hy+2],[hx-2,hy],[hx+3,hy],[hx+5,hy+2],[hx+2,hy+3],
          [hx-1,hy+3],[hx-3,hy+6],[hx-4,hy+5]],hair);
        shape([[hx-3,hy+1],[hx+2,hy],[hx+4,hy+2],[hx+1,hy+3],[hx-3,hy+3]],tint(hair,24));
        rect(hx-2,hy+1,3,1,tint(hair,38));
        if (cut === "wavy") {
          rect(hx-3,hy-1,3,2,hair);
          rect(hx+2,hy-1,2,2,hair);
          rect(hx-4,hy+3,2,2,tint(hair,17));
          rect(hx+3,hy+1,2,2,tint(hair,21));
        }
        if (cut === "tied") {
          const tie = axial && !back ? hx-6 : hx-5;
          shape([[tie,hy+4],[tie+3,hy+4],[tie+3,hy+7],[tie+1,hy+10],[tie-2,hy+10],[tie-1,hy+7]],hair);
          rect(tie,hy+6,2,1,"#a88c69");
          rect(tie-1,hy+8,1,2,tint(hair,18));
        }
      }
      if (back) {
        rect(hx-2,hy+8,4,1,skinDark);
        rect(hx-3,hy+9,6,1,jacketLight);
      } else if (axial) {
        shape([[hx-4,hy+4],[hx+4,hy+4],[hx+3,hy+7],[hx+2,hy+9],[hx-2,hy+9],[hx-3,hy+7]],skin);
        rect(hx-3,hy+5,2,1,ink); rect(hx+1,hy+5,2,1,ink);
        rect(hx-2,hy+6,4,1,skinLight);
        rect(hx-1,hy+8,2,1,skinDark);
      } else {
        shape([[hx,hy+3],[hx+4,hy+3],[hx+6,hy+6],[hx+4,hy+7],[hx+3,hy+9],
          [hx-1,hy+8],[hx-2,hy+6]],skin);
        rect(hx+(profile ? 3 : 2),hy+4,2,1,ink);
        rect(hx+2,hy+6,4,1,skinLight);
        rect(hx,hy+5,1,2,skinDark);
        rect(hx+1,hy+8,2,1,skinDark);
      }
      if (pose === "hurt" && !back) rect(hx-2,hy+7,2,1,"#a86452");
    }
    const frame = {canvas, left, top, grip};
    actorFrames.set(key, frame);
    return frame;
  }

  const woodGrip = "#775239", lightWood = "#b18a5a";
  const steel = "#747f80", lightSteel = "#a6b0ad", darkSteel = "#394446";
  const weaponArt = {
    bat: [[1,0,4,2,woodGrip],[5,-1,8,3,woodGrip],[6,-1,6,1,lightWood]],
    pipe: [[1,-1,11,2,steel],[10,-2,3,4,darkSteel],[11,-1,2,2,lightSteel]],
    flintknife: [[1,0,3,2,woodGrip],[4,-1,3,2,darkSteel],[6,-1,2,1,steel]],
    carvedspear: [[1,0,12,1,lightWood],[11,-1,3,3,lightWood],[14,0,2,1,lightWood]],
    spear: [[1,0,12,1,lightWood],[12,-1,3,3,steel],[15,0,1,1,lightSteel]],
    axe: [[1,0,10,2,woodGrip],[8,-3,4,4,darkSteel],[11,-4,2,5,lightSteel]],
    pistol: [[1,-2,7,2,darkSteel],[2,-3,6,1,steel],[2,0,2,3,darkSteel]],
    knife: [[1,0,2,2,woodGrip],[3,-1,4,2,lightSteel],[7,-1,1,1,steel]],
    machete: [[1,0,3,2,darkSteel],[4,-2,7,3,steel],[5,-2,7,1,lightSteel]],
    shovel: [[1,0,9,2,lightWood],[9,-2,4,5,steel],[12,-1,2,3,lightSteel]],
    golfclub: [[1,0,3,2,darkSteel],[4,0,9,1,steel],[12,0,3,3,lightSteel]],
    crowbar: [[1,0,11,2,"#87564a"],[11,-2,2,3,"#a56e5b"],[12,-2,2,1,lightSteel]],
    foundrymaul: [[1,0,11,2,woodGrip],[2,0,9,1,lightWood],[10,-3,5,7,darkSteel],[11,-3,3,1,lightSteel],[14,-2,1,5,steel]],
    hatchet: [[1,0,8,2,woodGrip],[7,-1,3,3,darkSteel],[9,-3,3,6,steel],[12,-2,1,4,lightSteel]],
    wrench: [[1,0,8,2,darkSteel],[2,0,6,1,steel],[8,-2,3,5,steel],[11,-2,2,1,lightSteel],[11,2,2,1,lightSteel]],
    fryingpan: [[1,0,7,2,darkSteel],[7,-2,7,6,darkSteel],[8,-3,5,1,steel],[8,4,5,1,steel],[13,-1,2,4,steel],[9,-1,3,3,"#4c5553"]],
    broom: [[1,0,11,1,lightWood],[11,-2,2,5,woodGrip],[13,-3,3,7,"#9e7643"],[14,-2,2,1,"#d1ae6a"],[14,1,2,1,"#c79b59"]],
    rollingpin: [[1,0,13,1,lightWood],[3,-2,8,5,woodGrip],[4,-2,6,1,lightWood],[4,2,6,1,"#825132"]]
  };
  const weaponSprites = new Map();
  const weaponAngles = [-1.15, -.45, .38, .95, 0, -.25, 1.28];
  const weaponExtent = 36;

  function drawHeldWeapon(id, x, y, side, phase) {
    const art = weaponArt[id];
    if (!art) return;
    const key = id + ":" + side + ":" + phase;
    let sprite = weaponSprites.get(key);
    if (!sprite) {
      sprite = document.createElement("canvas");
      sprite.width = sprite.height = weaponExtent;
      const c = sprite.getContext("2d"), pivot = weaponExtent / 2;
      const angle = weaponAngles[phase], cos = Math.cos(angle), sin = Math.sin(angle);
      for (const [left, top, w, h, color] of art) {
        c.fillStyle = color;
        for (let dy = top; dy < top + h; dy++) for (let dx = left; dx < left + w; dx++) {
          c.fillRect(pivot + side * Math.round(dx * cos - dy * sin),
            pivot + Math.round(dx * sin + dy * cos), 1, 1);
        }
      }
      if (id === "pistol" && phase === 5) {
        c.fillStyle = "#e59f52";
        c.fillRect(pivot + side * 10 - 1, pivot - 6, 3, 3);
        c.fillStyle = "#ffdf98";
        c.fillRect(pivot + side * 10, pivot - 5, 1, 1);
      }
      weaponSprites.set(key, sprite);
    }
    ctx.drawImage(sprite, x - weaponExtent / 2, y - weaponExtent / 2);
  }

  const weaponIcons = new Map();
  function weaponIcon(id) {
    if (!Object.hasOwn(weaponArt,id)) return "";
    if (!weaponIcons.has(id)) {
      const canvas = document.createElement("canvas");
      canvas.width = 34;
      canvas.height = 20;
      const icon = canvas.getContext("2d");
      for (const [x,y,w,h,color] of weaponArt[id]) {
        icon.fillStyle = color;
        icon.fillRect(x*2,(y+5)*2,w*2,h*2);
      }
      weaponIcons.set(id,canvas.toDataURL());
    }
    return weaponIcons.get(id);
  }

  const zombieAtlasLink = document.getElementById("micro-zombie-atlas");
  let zombieAtlas, mirroredZombieAtlas;
  const zombieWidth = 24, zombieHeight = 40;

  function drawZombieSprite(zombie, x, y, scale, direction, stride, clock) {
    if (!zombieAtlasLink?.href || typeof Image !== "function") return false;
    // Five views per pose, with the three side-facing views mirrored in the cache.
    const viewCount = 5, columns = 28, rows = 4 * viewCount, width = zombieWidth, height = zombieHeight;
    const back = (direction & 2) !== 0, axial = (direction & 4) !== 0;
    const facesLeft = (direction & 1) !== 0;
    const view = axial ? (back ? 4 : 0) : direction & 8 ? 2 : back ? 3 : 1;
    if (!zombieAtlas) {
      zombieAtlas = new Image();
      zombieAtlas.src = zombieAtlasLink.href;
    }
    if (zombieAtlas.naturalWidth !== columns * width || zombieAtlas.naturalHeight !== rows * height) return false;
    let atlas = zombieAtlas;
    if (facesLeft) {
      if (!mirroredZombieAtlas) {
        mirroredZombieAtlas = document.createElement("canvas");
        mirroredZombieAtlas.width = columns * width;
        mirroredZombieAtlas.height = rows * height;
        const mirror = mirroredZombieAtlas.getContext("2d");
        mirror.translate(mirroredZombieAtlas.width, 0);
        mirror.scale(-1, 1);
        mirror.drawImage(zombieAtlas, 0, 0);
      }
      atlas = mirroredZombieAtlas;
    }
    // Spawn phase is persisted in saves and keeps each infected's outfit stable.
    const phase = Number.isFinite(zombie.phase) ? zombie.phase : 0;
    const outfit = clamp(Math.floor(phase * 7 / 8), 0, 6);
    let row = 0, frame = Math.floor(Math.max(0, clock + phase) * 4) % 4;
    if (zombie.flash > 0) {
      row = 3;
      frame = zombie.flash > .18 ? 0 : zombie.flash > .10 ? 1 : zombie.flash > .04 ? 2 : 3;
    } else if (zombie.windup > 0 || zombie.swing > 0) {
      row = 2;
      frame = zombie.windup > .16 ? 0 : zombie.windup > 0 ? 1 : zombie.swing > .08 ? 3 : 2;
    } else if (zombie.moving) {
      row = 1;
      frame = Math.floor(stride * 4);
    }
    const column = outfit * 4 + frame;
    ctx.drawImage(atlas, (facesLeft ? columns - 1 - column : column) * width, (row * viewCount + view) * height, width, height,
      Math.round(x - width / 2 * scale), Math.round(y - (height - 2) * scale),
      Math.round(width * scale), Math.round(height * scale));
    return true;
  }

  function microActor(a, isPlayer, state, alive, x, y, scale, clock = 0) {
    const moving = alive && a.moving;
    const running = moving && (isPlayer ? state.running : a.kind === "runner" && a.alert > 0);
    const stride = strides.get(a) ?? {x:a.x, y:a.y, phase:(a.phase || 0) % 1};
    const distance = Math.hypot(a.x - stride.x, a.y - stride.y);
    if (moving && distance < 1) stride.phase = (stride.phase + distance / (running ? .94 : .70)) % 1;
    stride.x = a.x; stride.y = a.y;
    strides.set(a, stride);
    const frameIndex = moving ? Math.floor(stride.phase * 6) : 0;
    const step = [0, 1, 1, 0, -1, -1][frameIndex] * (running ? 2 : 1);
    const lift = [0, -1, 0, 0, 1, 0][frameIndex];
    const swing = isPlayer && a.swing > 0 ? state.swingVisual : null;
    const heldId = isPlayer ? swing?.weapon ?? Sim.weapon(state).id : null;
    const ready = isPlayer && !moving && !(a.swing > 0) && state.target?.hp > 0 && Object.hasOwn(weaponArt,heldId);
    const pose = !alive ? "dead" : a.flash > 0 ? "hurt" : a.swing > 0 || a.windup > 0 ? "strike" :
      isPlayer && a.resting ? "rest" : isPlayer && state.quiet ? "sneak" :
      running ? "run" : moving ? a.stats && a.alert > 0 ? "chase" : "walk" : ready ? "ready" : "idle";
    const gesture = pose === "strike" ? a.swing > .125 ? 0 : a.swing > .06 ? 2 : 1 :
      pose === "idle" && isPlayer ? Math.floor(clock * 2) % 2 : 0;
    const dx = ready ? state.target.x - a.x : swing?.dx ?? a.headingX ?? (a.face < 0 ? -1 : 1);
    const dy = ready ? state.target.y - a.y : swing?.dy ?? a.headingY ?? 0;
    const across = dx - dy, depth = dx + dy;
    // Convert to screen-space before selecting the eight directional poses.
    const screenX = Math.abs(across) * halfW, screenY = Math.abs(depth) * halfH;
    const axial = screenX <= screenY * .414;
    const profile = !axial && screenY <= screenX * .414;
    const direction = Number(across < 0) + 2 * Number(depth < 0 && !profile) +
      4 * Number(axial) + 8 * Number(profile);
    const imported = alive && a.stats && !isPlayer && drawZombieSprite(a, x, y, scale, direction, stride.phase, clock);
    if (!imported) {
      const palette = isPlayer ? survivorPalette(a) : null;
      const shirt = isPlayer ? (a.gear.body === "raincoat" ? "#9b8652" : palette.jacket) :
        Data.outfits[a.outfit]?.shirt || a.stats?.color || "#73705f";
      const frame = actorFrame(shirt, isPlayer ? "#465a5d" : "#56564c",
        palette?.skin ?? (pose === "hurt" ? "#cf9179" : "#99977f"),
        palette?.hair ?? "#413e35", direction, pose, step, lift,
        a.outfit === "hiker" || Boolean(isPlayer && a.backpack), gesture, palette?.cut);
      const left = Math.round(x - spriteWidth * scale / 2), top = Math.round(y - spriteGround * scale);
      ctx.drawImage(frame.canvas, frame.left, frame.top, spriteWidth, spriteHeight, left, top,
        Math.round(spriteWidth * scale), Math.round(spriteHeight * scale));
      if (isPlayer && frame.grip) {
        const phase = swing ? (heldId === "pistol" ? (a.swing > .145 ? 5 : a.swing > .09 ? 1 : 4) :
          a.swing > .125 ? 0 : a.swing > .06 ? 4 : 3) : pose === "ready" ? (heldId === "pistol" ? 4 : 0) : 6;
        drawHeldWeapon(heldId, left + Math.round(frame.grip[0] * scale), top + Math.round(frame.grip[1] * scale), dx < dy ? -1 : 1, phase);
      }
    }
    if (alive && (a.windup > 0 || a.stats && a.alert > 0)) {
      const height = Math.round((imported ? zombieHeight : spriteHeight) * scale);
      ctx.fillStyle = a.windup > 0 ? "#ff987d" : "#cb735b";
      ctx.fillRect(Math.round(x), Math.round(y) - height - 5, 2, a.windup > 0 ? 5 : 3);
    }
  }

  function equipmentPortrait(canvas, state) {
    const previous = ctx;
    ctx = canvas.getContext("2d");
    try {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.imageSmoothingEnabled = false;
      const player = {...state.player, moving:false, resting:false, flash:0, swing:0, headingX:1, headingY:1};
      microActor(player,true,{...state,quiet:false},true,canvas.width/2,canvas.height-5,.9);
    } finally {
      ctx = previous;
    }
  }

  function actor(a, isPlayer, state, clock, inReach) {
    const alive = isPlayer || a.hp > 0;
    const [x, y] = p(a.x, a.y);
    const scale = a.kind === "brute" ? 1.28 : a.kind === "runner" ? .94 : 1;
    shadow(a.x, a.y, alive ? 11 * scale : 15, alive ? 5 : 7, "#080e09aa");
    if (alive && (inReach || a.windup > 0)) {
      ctx.save();
      ctx.strokeStyle = a.windup > 0 ? "#ff987d" : "#ebcf8b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y + 1, 16 * scale, 7 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (darkLook) {
      microActor(a, isPlayer, state, alive, x, y, scale, clock);
      if (alive && a.origin === "cinema-winner") {
        const hand = x+(a.face || 1)*9, bob = a.moving ? Math.round(Math.sin(clock*5)*2) : 0;
        ctx.fillStyle = "#d5ad52";
        ctx.fillRect(hand-2,y-22+bob,5,4);
        ctx.fillRect(hand,y-18+bob,1,4);
        ctx.fillRect(hand-2,y-14+bob,5,1);
      }
      if (alive && a.stats && (state.target === a || a.hp < a.stats.hp && a.alert > 0)) {
        ctx.fillStyle = "#1d261d";
        ctx.fillRect(x - 8, y - 42 * scale, 16, 2);
        ctx.fillStyle = "#e27a5c";
        ctx.fillRect(x - 8, y - 42 * scale, 16 * a.hp / a.stats.hp, 2);
      }
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    if (!alive) {
      ctx.rotate(-.45 + Math.sin(a.phase || 0) * .45);
      ctx.fillStyle = "#643c34a0";
      ctx.fillRect(-13, -3, 25, 8);
      ctx.fillStyle = Data.outfits[a.outfit]?.shirt || a.stats?.color || "#b5a075";
      ctx.fillRect(-7, -3, 13, 6);
      ctx.fillStyle = "#a29171";
      ctx.fillRect(5, -3, 5, 5);
      ctx.restore();
      return;
    }
    ctx.scale((a.face || 1) * scale, scale);
    const step = a.moving ? Math.sin(clock * (isPlayer && state.running ? 17 : 12) + (a.phase || 0)) * 2.5 : 0;
    const crouch = isPlayer && state.quiet ? 5 : 0;
    const top = -25 + crouch - Math.abs(step) * .35;
    if (a.outfit === "hiker" || isPlayer && a.backpack && (a.headingX ?? 0) + (a.headingY ?? 0) < 0) {
      ctx.fillStyle = isPlayer ? backpackCloth : "#3c5041";
      ctx.fillRect(-11, top + 5, 8, 14);
      ctx.fillStyle = isPlayer ? backpackLight : "#667b55";
      ctx.fillRect(-11, top + 7, 5, 7);
    }
    ctx.fillStyle = isPlayer ? "#293e3e" : "#3f4535";
    ctx.fillRect(-5.2, -9 + step, 4.5, 9 - step);
    ctx.fillRect(1.1, -9 - step, 4.6, 9 + step);
    ctx.fillStyle = "#151e17";
    ctx.fillRect(-6, -2 + Math.max(0, step), 6, 2.2);
    ctx.fillRect(.5, -2 + Math.max(0, -step), 6, 2.2);
    const palette = isPlayer ? survivorPalette(a) : null;
    const shirt = isPlayer ? (a.gear.body === "raincoat" ? "#bc9d50" : palette.jacket) : (Data.outfits[a.outfit]?.shirt || a.stats?.color || "#d0a968");
    poly([[-7.5, top + 4], [2.5, top + 3], [6, top + 8], [5, -8 + crouch * .3], [-5.7, -8 + crouch * .3]], shirt, "#16251b");
    ctx.fillStyle = isPlayer ? "#395f61" : "#5c6148";
    ctx.fillRect(-7.2, top + 7, 3.5, 9);
    if (isPlayer) {
      ctx.fillStyle = "#d5b47c";
      ctx.fillRect(-6.7, top + 11, 2.2, 9);
      ctx.fillStyle = "#d9e2c8";
      ctx.fillRect(.3, top + 8, 2.2, 2.2);
    } else {
      ctx.fillStyle = "#805344";
      ctx.fillRect(.6, top + 8, 3.2, 5.8);
    }
    if (a.outfit === "medic") {
      ctx.fillStyle = "#e4d6bb";
      ctx.fillRect(-7.7, top + 9, 4.6, 4.5);
      ctx.fillStyle = "#a5544b";
      ctx.fillRect(-5.9, top + 9.5, 1.2, 3.5);
      ctx.fillRect(-6.9, top + 10.7, 3.2, 1.1);
    }
    const striking = a.swing > 0;
    const reaching = striking || a.windup > 0;
    const handX = reaching ? 14 : isPlayer ? 8 : 11;
    const handY = top + (reaching ? 6 : 12 + step * .28);
    line([4, top + 8], [handX, handY], isPlayer ? "#779b8b" : "#9a8e66", 3.6);
    if (isPlayer) {
      ctx.fillStyle = "#b8aa78";
      ctx.fillRect(striking ? 13 : 7, top + (striking ? 5 : 11), striking ? 7 : 4, 2.5);
    }
    if (isPlayer && alive) {
      const id = a.swing > 0 && state.swingVisual ? state.swingVisual.weapon : Sim.weapon(state).id;
      const phase = a.swing > 0 ? id === "pistol" ? 5 : a.swing > .12 ? 0 : a.swing > .06 ? 1 : 2 : 4;
      drawHeldWeapon(id,handX,handY,1,phase);
    }
    if (a.origin === "cinema-winner") {
      ctx.fillStyle = "#d5ad52";
      ctx.fillRect(handX-3,handY-6,6,4);
      ctx.fillRect(handX-1,handY-2,2,4);
      ctx.fillRect(handX-3,handY+2,6,1);
    }
    if (a.outfit === "patrol" || isPlayer && a.gear.arms) {
      line([handX - 5, handY], [handX - 1, handY], "#334652", 5.4);
      ctx.fillStyle = "#84979d";
      ctx.fillRect(handX - 5, handY - 1, 2.2, 2);
    }
    if (a.outfit === "watch" || isPlayer && a.gear.wrist) {
      ctx.fillStyle = "#253434";
      ctx.fillRect(handX - 3, handY - 3, 3, 6);
      ctx.fillStyle = "#c6d5a1";
      ctx.fillRect(handX - 3.4, handY - 1.3, 3.7, 2.4);
    }
    if (a.outfit === "worker") {
      line([handX - 2, handY - 1], [handX + 6, handY + 9], "#a3b1ac", 2.8);
      ctx.fillStyle = "#d1b596";
      ctx.fillRect(handX - 1.5, handY - 1.6, 3, 3);
    }
    const tiedHair = palette?.cut === "tied";
    if (tiedHair) {
      ctx.fillStyle = palette.hair;
      ctx.fillRect(-6, top - 1.5, 4, 7);
      ctx.fillRect(-7.5, top + 3 + step * .3, 3.5, 4.5);
      ctx.fillStyle = "#a17c4d";
      ctx.fillRect(-6.4, top + 2, 2.4, 1.6);
    }
    ctx.fillStyle = palette?.skin ?? (a.flash > 0 ? "#ffb096" : "#b0a078");
    ctx.fillRect(-3.3, top - 3, 8, 8.5);
    ctx.fillStyle = palette?.hair ?? "#575c42";
    const cropped = palette?.cut === "shaved";
    ctx.fillRect(tiedHair ? -4.5 : -3.9, top - (cropped ? 4 : 5.5), 8.6, cropped ? 2 : 4.8);
    if (palette?.cut === "wavy") {
      ctx.fillRect(-3,top-6.5,3,2);
      ctx.fillRect(1,top-6,3,2);
    }
    ctx.fillStyle = isPlayer ? "#18261e" : "#df8b62";
    ctx.fillRect(2.9, top + .5, 1.7, 1.5);
    if (a.windup > 0) {
      poly([[0, top - 23], [10, top - 7], [-10, top - 7]], "#ff987d", "#351f18");
      ctx.fillStyle = "#351f18";
      ctx.fillRect(-1, top - 18, 2, 5);
      ctx.fillRect(-1, top - 11.5, 2, 2);
    } else if (!isPlayer && a.alert > 0) {
      ctx.fillStyle = "#fb805e";
      ctx.fillRect(-.5, top - 13, 1.7, 4);
      ctx.fillRect(-.5, top - 8, 1.7, 1.4);
    }
    ctx.restore();
    if (isPlayer) {
      ctx.strokeStyle = "#9bbd9c9c";
      ctx.beginPath();
      ctx.ellipse(x, y + 1, 12, 5.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (a.stats && (state.target === a || a.hp < a.stats.hp && a.alert > 0)) {
      ctx.fillStyle = "#1d261d";
      ctx.fillRect(x - 11, y - 46 * scale, 22, 3);
      ctx.fillStyle = "#e27a5c";
      ctx.fillRect(x - 11, y - 46 * scale, 22 * a.hp / a.stats.hp, 3);
    }
  }

  function beamReach(world, x, y, dx, dy) {
    let reach = 0;
    for (let distance = .25; distance <= Data.flashlight.range; distance += .25) {
      const tile = World.tileAt(world,x+dx*distance,y+dy*distance);
      if (!tile || tile.kind === "wall" || tile.kind === "door" || tile.surface === "rock") break;
      reach = distance;
    }
    return reach;
  }

  function flashlightBeam(state) {
    const player = state.player;
    const bearing = Math.atan2(player.headingY, player.headingX);
    const origin = p(player.x, player.y);
    const points = [origin];
    for (let i = 0; i <= 14; i++) {
      const angle = bearing + Data.flashlight.angle * (i / 7 - 1);
      const dx = Math.cos(angle), dy = Math.sin(angle);
      const reach = beamReach(state.world,player.x,player.y,dx,dy);
      points.push(p(player.x + dx * reach, player.y + dy * reach));
    }
    const light = ctx.createRadialGradient(...origin, 1, ...origin, Data.flashlight.range * halfW * 1.25);
    light.addColorStop(0, "#f8eab97a");
    light.addColorStop(.6, "#e9d59b48");
    light.addColorStop(1, "#e9d59b00");
    poly(points, light);
  }

  // Bake the radial falloff and soft angular edges in world-space coordinates.
  let beamSprite;
  function warmBeamSprite() {
    if (beamSprite) return beamSprite;
    const sprite = document.createElement("canvas");
    const extent = 256, center = extent / 2, edge = Data.flashlight.angle;
    sprite.width = sprite.height = extent;
    const paint = sprite.getContext("2d");
    const image = paint.createImageData(extent, extent);
    for (let y = 0; y < extent; y++) for (let x = center; x < extent; x++) {
      const dx = x + .5 - center, dy = y + .5 - center;
      const reach = Math.hypot(dx,dy) / center, angle = Math.abs(Math.atan2(dy,dx));
      if (reach >= 1 || angle >= edge) continue;
      const rim = Math.min(1, (edge-angle) / .17);
      const core = Math.max(0, 1-angle/.22);
      const pixel = (y*extent+x)*4;
      image.data[pixel] = 255;
      image.data[pixel+1] = 200 + 30*core;
      image.data[pixel+2] = 122 + 48*core;
      image.data[pixel+3] = 255 * rim * (1-reach) ** 1.35 * (.36 + .24*core);
    }
    paint.putImageData(image,0,0);
    return beamSprite = sprite;
  }

  function warmFlashlight(state, lamp, clock) {
    const {x,y,headingX,headingY} = state.player, range = Data.flashlight.range;
    const bearing = Math.atan2(headingY,headingX);
    const ox = (x-y)*halfW, oy = (x+y)*halfH;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ox,oy);
    for (let i = 0; i <= 14; i++) {
      const angle = bearing + Data.flashlight.angle * (i/7-1);
      const dx = Math.cos(angle), dy = Math.sin(angle);
      const reach = beamReach(state.world,x,y,dx,dy);
      ctx.lineTo(ox+(dx-dy)*reach*halfW,oy+(dx+dy)*reach*halfH);
    }
    ctx.closePath();
    ctx.clip();
    ctx.translate(ox,oy);
    ctx.transform(halfW,halfH,-halfW,halfH,0,0);
    ctx.rotate(bearing);
    if (!state.reduceFlicker && lamp.charge <= 12) {
      const weakness = 1-lamp.charge/12;
      ctx.globalAlpha = 1 - weakness * (.16 + .13*Math.sin(clock*11 + Math.sin(clock*6)));
    }
    ctx.drawImage(warmBeamSprite(),-range,-range,2*range,2*range);
    ctx.restore();
  }

  function windowGlow(state, full, clock, onScreen, known) {
    const grid = Sim.gridPower(state);
    const {player} = state;
    let budget = full ? 12 : 5;
    const lights = windowLights.get(state.world);
    if (!lights) return;
    for (const light of lights) {
      const {window,x,y} = light;
      if (!window.active || window.boards || !sq(x-player.x,y-player.y,10) ||
          !onScreen(x,y) || !(known(window.x,window.y) || known(x,y))) continue;
      const generated = !grid && Sim.hasPower(state,window);
      let fire = false;
      if (!grid && !generated) for (const o of nearbyFires) {
        if (!sq(o.x-x,o.y-y,3)) continue;
        fire = true;
        break;
      }
      if (!grid && !generated && !fire) continue;
      const flicker = !grid && !state.reduceFlicker ? .88 + .12*Math.sin(clock*5+x) : 1;
      glow(x,y,fire ? "#ffad64" : "#ffd599",fire ? 34 : 52,(fire ? .23 : .54)*flicker);
      if (--budget === 0) break;
    }
  }

  function weatherEffects(state, clock, width, height, full, currentBuilding) {
    const hour = (state.minutes % 1440)/60;
    const twilight = Math.max(0,1-Math.min(Math.abs(hour-6),Math.abs(hour-19))/2);
    ctx.fillStyle = hour < 5 || hour >= 21 ? "#395a80" : hour < 8 ? "#dcb182" : hour >= 17 ? "#cc8d62" : "#d2cb96";
    ctx.globalAlpha = (.035 + twilight*.065) * (full ? 1 : .7);
    ctx.fillRect(0,0,width,height);
    ctx.globalAlpha = 1;
    const coastal = state.world.region === "lowtide" || state.world.region === "coast" || state.world.region === "lighthouse";
    const haze = Math.min(.16,(coastal ? .07 : 0) + twilight*.09);
    if (!currentBuilding && haze > 0) {
      const mist = glowSprite("#a5b9b7",72);
      ctx.globalAlpha = haze;
      for (let i = 0; i < (full ? 3 : 1); i++) {
        const x = (i*width*.53 + clock*(8+3*i)) % (width*1.8) - width*.65;
        ctx.drawImage(mist,x,height*(.32+i*.15),width*.9,height*.5);
      }
      ctx.globalAlpha = 1;
    }
    if (state.weather !== "Rain") return;
    const intensity = state.rules.weather === "rain" ? 1 : state.rules.weather === "showers" ? .76 : .58;
    const streaks = Math.round((full ? 72 : 24) * intensity);
    ctx.strokeStyle = full ? "#bdcdd848" : "#bdcdd838";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < streaks; i++) {
      const x = ((i*97-clock*106)%width+width)%width, y = (i*137+clock*273)%height;
      if (currentBuilding) {
        const a = (x-camera.x)/(camera.zoom*halfW), b = (y-camera.y)/(camera.zoom*halfH);
        if (World.tileAt(state.world,(a+b)/2,(b-a)/2)?.building === currentBuilding) continue;
      }
      ctx.moveTo(x,y);
      ctx.lineTo(x-5,y+(full ? 15 : 11));
    }
    ctx.stroke();
  }

  function drawDestination(state, width, height, zoom) {
    if (state.mode === "menu") return;
    const destination = Sim.destination(state);
    if (!destination || Sim.distance(state.player,destination)<=2.5) return;
    const [rawX,rawY]=p(destination.x,destination.y);
    const targetX=rawX*zoom+camera.x,targetY=rawY*zoom+camera.y;
    const centerX=width*.5,centerY=height*.54;
    const dx=targetX-centerX,dy=targetY-centerY;
    const ratio=Math.max(Math.abs(dx)/(width*.5-30),Math.abs(dy)/(height*.45-30));
    if(ratio>1) {
      const x=centerX+dx/ratio,y=centerY+dy/ratio;
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));
      poly([[10,0],[-6,-7],[-3,0],[-6,7]],"#f0ca87","#3a3a26");
      ctx.restore();
    } else {
      const y = targetY - 9;
      poly([[targetX,y-7],[targetX+6,y],[targetX,y+7],[targetX-6,y]],"#e7bc76","#3a3a26");
    }
  }

  const visible = (state, x, y, optics) => Sim.canSee(state, x, y, optics);

  // Ground cache: the static art of the ground (colour, marks, rocks) is drawn once per 8x8 block of tiles
  // into an offscreen canvas and reused every frame, instead of redrawing ~1000 polygons per frame.
  const CH = 8, chunks = new Map();
  let chunkWorld = null, chunkFrame = 0, fastGround = true;

  function chunkSignature(world, cx, cy, menu) {
    if (menu) return darkLook ? "dm2" : -1;
    let n = 0;
    const x1 = Math.min(world.width, cx * CH + CH), y1 = Math.min(world.height, cy * CH + CH);
    for (let y = cy * CH; y < y1; y++) for (let x = cx * CH; x < x1; x++) if (world.explored[y * world.width + x]) n++;
    return darkLook ? "d2:" + n : n;
  }

  function buildChunk(world, key, cx, cy, menu, scale, signature, entry) {
    const x0 = cx * CH, y0 = cy * CH, x1 = Math.min(world.width, x0 + CH), y1 = Math.min(world.height, y0 + CH);
    const minX = (x0 - y1) * halfW - 8, maxX = (x1 - y0) * halfW + 8, minY = (x0 + y0) * halfH - 20, maxY = (x1 + y1) * halfH + 4;
    const w = maxX - minX, h = maxY - minY;
    entry = entry ?? {canvas: document.createElement("canvas")};
    entry.canvas.width = Math.ceil(w * scale); entry.canvas.height = Math.ceil(h * scale);
    const target = entry.canvas.getContext("2d");
    target.setTransform(scale, 0, 0, scale, -minX * scale, -minY * scale);
    const main = ctx;
    ctx = target;
    try {
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const index = y * world.width + x, t = world.tiles[index];
        if (t.kind === "void") continue;
        if (!menu && !world.explored[index]) {
          const flat = [p(x, y), p(x + 1, y), p(x + 1, y + 1), p(x, y + 1)];
          if (!t.building) { ctx.globalAlpha = .22; poly(flat, t.color); ctx.globalAlpha = 1; }
          else poly(flat, "#152016");
          continue;
        }
        tileArt(t);
      }
    } finally { ctx = main; }
    Object.assign(entry, {minX, minY, w, h, scale, sig: signature});
    chunks.set(key, entry);
    return entry;
  }

  function groundLayer(world, menu, visibleKeys, cols, rawScale) {
    if (chunkWorld !== world) { chunks.clear(); chunkWorld = world; }
    const scale = Math.max(.4, Math.round(rawScale * 20) / 20);
    const order = [...visibleKeys].sort((a, b) => ((a / cols | 0) + a % cols) - ((b / cols | 0) + b % cols));
    chunkFrame++;
    for (const key of order) {
      const cx = key % cols, cy = key / cols | 0, signature = chunkSignature(world, cx, cy, menu);
      let entry = chunks.get(key);
      if (!entry || entry.sig !== signature || entry.scale !== scale) entry = buildChunk(world, key, cx, cy, menu, scale, signature, entry);
      entry.used = chunkFrame;
      ctx.drawImage(entry.canvas, entry.minX, entry.minY, entry.w, entry.h);
    }
    const limit = Math.max(64, order.length + 12);
    if (chunks.size > limit) for (const [key, entry] of chunks) if (entry.used < chunkFrame - 20) chunks.delete(key);
  }

  // One soft gradient replaces the per-tile darkening polygons: clear within 3.2 tiles of the survivor, 47% dark at 12.6.
  function dimAround(player) {
    const [px, py] = p(player.x, player.y), k = Math.SQRT2 * halfW;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(1, halfH / halfW);
    const gradient = ctx.createRadialGradient(0, 0, 3.2 * k, 0, 0, 12.6 * k);
    gradient.addColorStop(0, "rgba(9,19,13,0)");
    gradient.addColorStop(1, "rgba(9,19,13,.47)");
    ctx.fillStyle = gradient;
    ctx.fillRect(-9000, -9000, 18000, 18000);
    ctx.restore();
  }

  // Restrained tinted shades keep the white navigation cue legible in every scenario.
  const afterlifeArt = {
    crow:{ground:["#252b30","#15191f","#404a52","#89989f"], wall:"#3d4750",
      prop:["...44....","..4434...","...33..4.",".4.33.44.","..43344..","...33....","...33....","..3223..."]},
    rot:{ground:["#2a3025","#191d16","#424b33","#97a272"], wall:"#4b5038",
      prop:["...44....","..4444...","...33..4.","44.33.444",".3.33..3.","..333.33.","..222222."]},
    horde:{ground:["#292632","#18151f","#444052","#9891a5"], wall:"#50485e",
      prop:["...4.....","..444....","...3...4.","...3..443","...3...3.","...3...3.","..333.333"]},
    brains:{ground:["#332522","#201513","#583b36","#b38a78"], wall:"#584341",
      prop:[".4444444.",".4343434.",".4444444.","..33..33.","..344433.","..342433.","..333333."]},
    trapped:{ground:["#222b2d","#131c20","#374d52","#87a4a6"], wall:"#3e5057",
      prop:["..44444..",".4333334.",".4322234.",".4333434.",".4333334.","..33333..","...2.2..."]},
    chardonnay:{ground:["#34282b","#22181d","#594147","#b68989"], wall:"#59464b",
      prop:["....44...","....43...","...4334..","...4334..","...4444..","..222222.","...3..3.."]}
  };

  const afterlifeDetails = {
    crow:[".....44.....","...443344...","..43333334..",".4333322334.","433333223334",".2222222222."],
    rot:[".....4......","...4.4.44...","...44444....",".4..444..4..","..33333333..","...333333...","....2222...."],
    horde:["..444.......","..43344.....","..4333344...","..43333334..","..44444444..","..3....3....","..3....3...."],
    brains:["....4444....","...433334...","..43333334..","..43333334..","...443344...",".....33.....","....2222...."],
    trapped:["...333333...","..34444443..","...333333...",".....33.....","....3333....","...333333...","....2222...."],
    chardonnay:["..333..333..",".34443.343..",".34343.343..",".34443.343..","..333...3...","...3....3...","..222..222.."]
  };

  function afterlifePixels(c, frame, x, y, colors, unit) {
    for (const [row,line] of frame.entries()) {
      for (let col=0;col<line.length;col++) {
        if (line[col] === ".") continue;
        c.fillStyle = colors[Number(line[col])-1];
        c.fillRect(x+col*unit,y+row*unit,unit,unit);
      }
    }
  }

  const afterlifeActors = {
    zombie:[".......333.......","......34443......","......35443......",".......343.......","......22331......",
      ".....2233321.....","...1233333221....","..123.333.221....","..22..332..221...","..44..221...44...",
      "......2221.......",".....22221.......",".....22.221......","....221..221....."],
    human:[".......222.......","......23332......","......34443......",".......343.......","......22221......",
      ".....2333321.....","....233333221....","...221333.222....","...442333..44....",".....22221.......",
      ".....22321.......",".....22.221......","....221..221.....","....221...22....."],
    mannequin:[".......333.......","......34443......","......34443......",".......343.......","......23332......",
      "....233333332....","...23333333332...","..233.333.332....","..33..333..33....","......2222.......",
      "......2222.......","......2222.......",".......22........",".....222222......"]
  };
  const afterlifeFeet = [
    ["....22...221.....","...221....221....","...11......11...."],
    ["....221..221.....","....221..22......","....11...11......"],
    [".....221.22......","......22.221.....","......11..11....."]
  ];
  const afterlifePortraits = new Map();
  function afterlifePortrait(role,colors,step) {
    const key = [role,step,...colors].join(":");
    if (afterlifePortraits.has(key)) return afterlifePortraits.get(key);
    const sprite = document.createElement("canvas");
    sprite.width = 17;
    sprite.height = 16;
    const torso = afterlifeActors[role].slice(0,13);
    afterlifePixels(sprite.getContext("2d"),[...torso,...afterlifeFeet[step]],0,0,colors,1);
    afterlifePortraits.set(key,sprite);
    return sprite;
  }

  function renderAfterlife(session) {
    if (!size.width) resize();
    const {width,height,dpr} = size, {player,world,target,decoy,id} = session;
    const c = mainCtx, art = afterlifeArt[id];
    const [ground,fringe,grain,rim] = art.ground;
    c.setTransform(dpr,0,0,dpr,0,0);
    c.fillStyle = "#080808";
    c.fillRect(0,0,width,height);
    const radius = Afterlife.range(session);
    const scale = Math.min(1.1,width/440);
    const project = (x,y) => {
      const [px,py] = p(x-player.x,y-player.y);
      return [Math.round(width*.5+px*scale),Math.round(height*.51+py*scale)];
    };
    const props = [];
    const reach = Math.ceil(radius);
    const px = Math.floor(player.x), py = Math.floor(player.y);
    for (let y=py-reach;y<=py+reach;y++) for (let x=px-reach;x<=px+reach;x++) {
      const d = Math.hypot(x+.5-player.x,y+.5-player.y), tile = World.tileAt(world,x,y);
      if (!tile || d > radius) continue;
      const [sx,sy] = project(x+.5,y+.5), hw = halfW*scale, hh = halfH*scale;
      c.fillStyle = tile.baseSolid ? art.wall : d < radius*.7 ? ground : fringe;
      c.beginPath();
      c.moveTo(sx-hw,sy); c.lineTo(sx,sy-hh); c.lineTo(sx+hw,sy); c.lineTo(sx,sy+hh); c.closePath(); c.fill();
      if (tile.solid) {
        c.fillStyle = "#101010";
        c.fillRect(sx-hw*.54,sy-hh*.45,hw*1.15,hh*.85);
        c.fillStyle = art.wall;
        const height = Math.round(hh*(1+(x+y)%3*.18));
        const top = Math.round(sy-hh*.55-height);
        c.fillRect(sx-hw*.38,top,hw*.76,height);
        c.fillRect(sx-hw*.52,top+4,hw*1.04,height-4);
        c.fillStyle = rim;
        c.fillRect(sx-hw*.32,top,hw*.53,1);
        c.fillRect(sx-hw*.49,top+4,hw*.17,1);
        c.fillStyle = fringe;
        c.fillRect(sx+hw*.28,top+6,hw*.19,height-6);
        c.fillRect(sx-hw*.31,top+height*.61,hw*.41,2);
      } else {
        const pattern = (x*31+y*17)%19;
        c.fillStyle = grain;
        c.fillRect(sx-9+pattern,sy-3,2,1);
        c.fillRect(sx+5-pattern,sy+2,3,1);
        c.fillStyle = "#101010";
        c.fillRect(sx-6,sy+4,4,2);
        if (id === "chardonnay" && (x+y)%2 === 0) {
          c.fillStyle = grain;
          c.fillRect(sx-5,sy-1,11,1);
        }
        if (!session.blind && pattern < 4 && d < radius*.84) props.push([sx,sy,pattern]);
      }
    }
    for (const [x,y,pattern] of props) {
      c.fillStyle = "#070707";
      c.fillRect(x-8,y-2,17,4);
      const detail = pattern%2 ? art.prop : afterlifeDetails[id];
      afterlifePixels(c,detail,x-detail[0].length,y-detail.length*2,["#101010",ground,grain,rim],2);
    }
    const visible = a => a && Math.hypot(a.x-player.x,a.y-player.y) < radius && World.sees(world,player.x,player.y,a.x,a.y);
    const figure = (a,color,lean = 0,role = "zombie",moving = false) => {
      const [x,y] = project(a.x,a.y);
      const step = moving ? Math.floor(session.clock*7)%3 : 1;
      const unit = width < 560 ? 2 : 3;
      const sprite = afterlifePortrait(role,["#101010",grain,color,rim,"#f4ede1"],step);
      c.fillStyle = "#050505";
      c.fillRect(x-8,y-2,16,4);
      c.fillRect(x-5,y+2,11,2);
      c.imageSmoothingEnabled = false;
      c.drawImage(sprite,x-Math.floor(sprite.width*unit/2)+lean,y-sprite.height*unit,sprite.width*unit,sprite.height*unit);
    };
    for (const z of world.enemies) if (z.hp > 0 && visible(z)) figure(z,"#595959",1);
    if (visible(decoy)) {
      const [x,y] = project(decoy.x,decoy.y);
      if (id === "brains" && session.fakeLabel.startsWith("A mannequin.")) figure(decoy,"#666666",0,"mannequin");
      else {
        c.fillStyle = "#626262";
        c.fillRect(x-4,y-5+Math.sin(session.clock*5)*Number(id === "rot"),8,4);
      }
    }
    if (visible(target)) {
      if (id === "chardonnay") {
        const [x,y] = project(target.x,target.y);
        c.fillStyle = session.result === "success" ? "#e2e2e2" : "#c9c9c9";
        if (session.result === "success") {
          c.fillRect(x-8,y-2,4,2); c.fillRect(x-1,y-5,2,3); c.fillRect(x+5,y,3,2);
        } else {
          c.fillRect(x-2,y-9,4,9); c.fillRect(x-1,y-12,2,4);
        }
      } else if (session.animal) {
        const [x,y] = project(target.x,target.y);
        c.fillStyle = "#ababab";
        c.fillRect(x-6,y-5,10,4); c.fillRect(x+3,y-7,4,4); c.fillRect(x-10,y-3,5,1);
      } else {
        figure(target,id === "horde" ? "#999999" : "#cdcdcd",0,id === "horde" ? "zombie" : "human",true);
        if (id === "horde") {
          for (const [dx,dy] of [[.45,0],[-.35,.55]]) {
            const shadow = {x:target.x+dx,y:target.y+dy};
            if (visible(shadow)) figure(shadow,"#727272",-1);
          }
        }
      }
    }
    const [x,y] = project(player.x,player.y);
    figure(player,"#ddd",0,"zombie",Math.hypot(session.vx,session.vy) > .15);
    if (id === "crow" && !session.crowGone) {
      const flutter = Math.sin(session.clock*13)*5;
      const up = Math.sin(session.clock*13) > 0;
      afterlifePixels(c,up ? ["44.....44",".33...33.","..33333..","...3434..","...233..."] :
        ["...344...","..33334..","443333344",".3322233.","..2...2.."],
        x-9,Math.round(y-59+flutter),["#101010","#353535","#999999","#eee"],2);
    }
    if (session.gesture?.until > session.clock) {
      c.fillStyle = "#fff";
      const {kind} = session.gesture;
      if (kind === "grab") c.fillRect(x+8,y-23,8,3);
      else if (kind === "bite") c.fillRect(x-2,y-29,5,2);
      else { c.fillRect(x+7,y-35,2,2); c.fillRect(x+12,y-38,2,2); }
    }
    if (session.locked && visible(session.latch)) {
      const [lx,ly] = project(session.latch.x,session.latch.y);
      const [ox,oy] = project(session.origin.x,session.origin.y);
      const shelter = session.trap === "car" ?
        [".....3333.....","...43222234...","..4322222234..",".433333333334.","43233333333234","43333333333334",".111......111."] :
        ["...33333333...","..3422222234..","..3422222234..","..3422224234..","..3422222234..","..3333333333..","...11111111..."];
      afterlifePixels(c,shelter,ox-21,oy+1,["#090909",fringe,grain,rim],3);
      c.fillStyle = "#ededed";
      c.fillRect(lx-3,ly-10,6,3);
    }
    if (session.pathHint && !session.result && !Afterlife.ready(session)) {
      const [sx,sy] = project(session.pathHint.x,session.pathHint.y);
      const length = Math.hypot(sx-x,sy-y);
      if (length > 2) {
        const angle = Math.atan2(sy-y,sx-x);
        c.save();
        c.translate(x+Math.cos(angle)*43,y+Math.sin(angle)*43);
        c.rotate(angle);
        c.strokeStyle = "#0a0a0a";
        c.lineWidth = 6;
        c.beginPath();
        c.moveTo(-5,-6); c.lineTo(3,0); c.lineTo(-5,6); c.stroke();
        c.strokeStyle = session.clock-session.pulseAt < .55 ? "#fff" : "#b5b5b5";
        c.lineWidth = 2.5;
        c.stroke();
        c.restore();
      }
    }
  }

  function render(state, clock, dt) {
    if (!size.width) resize();
    if (!size.width || !size.height) return;
    updateCamera(state,dt);
    const {width,height,dpr}=size,{zoom}=camera;
    const world=state.world,player=state.player,menu=state.mode==="menu",cave=world.underground;
    const atmosphere = state.visualAtmosphere ?? "off";
    const effects = !menu && atmosphere !== "off", full = atmosphere === "full";
    const motion = effects && !state.reduceFlicker;
    const wet = effects && !cave && state.weather === "Rain";
    const night = Sim.isNight(state);
    wetGround.length = 0;
    nearbyFires.length = 0;
    ctx = mainCtx;
    darkLook = state.look === "dark";
    // Retain individual sprite pixels on phones and ordinary desktop viewports.
    const pixCss = darkLook ? Math.max(1, Math.floor(width / 840)) : 1;
    if (darkLook) {
      const lw = Math.ceil(width / pixCss), lh = Math.ceil(height / pixCss);
      if (!lowCanvas) { lowCanvas = document.createElement("canvas"); lowCtx = lowCanvas.getContext("2d"); }
      if (lowCanvas.width !== lw || lowCanvas.height !== lh) { lowCanvas.width = lw; lowCanvas.height = lh; }
      ctx = lowCtx;
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(1 / pixCss,0,0,1 / pixCss,0,0);
      ctx.setTransform(1,0,0,1,0,0);
    } else ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle=cave ? "#080a0b" : "#162016";ctx.fillRect(0,0,width,height);
    if (darkLook) ctx.setTransform(1 / pixCss,0,0,1 / pixCss,0,0);
    for (const effect of state.effects) if (effect.impact && !feltImpacts.has(effect)) { feltImpacts.add(effect); trauma = Math.min(1, trauma + effect.impact); }
    trauma = Math.max(0, trauma - (dt || 0) * shakeDecay); shakeClock += (dt || 0) * 30;
    const shake = motion ? trauma * trauma : 0;
    ctx.translate(camera.x + 12 * shake * Math.sin(shakeClock * 1.7), camera.y + 8 * shake * Math.sin(shakeClock * 2.3));ctx.scale(zoom,zoom);
    const optics = Sim.sight(state);
    labelledWorld = world;
    objectLabels.length = 0;
    const currentBuilding=World.tileAt(world,player.x,player.y)?.building;
    const lit = currentBuilding && Sim.hasPower(state, player);
    const playerZone=World.tileAt(world,player.x,player.y)?.zone;
    const margin = 100, xScale = halfW * zoom, yScale = halfH * zoom;
    const onScreen=(x,y)=>{
      const sx=(x-y)*xScale+camera.x,sy=(x+y)*yScale+camera.y;
      return sx>-margin&&sy>-margin&&sx<width+margin&&sy<height+margin;
    };
    const known=(x,y)=>menu||world.explored[Math.floor(y)*world.width+Math.floor(x)];
    const shown=(x,y)=>cave ? visible(state,x,y,optics) : known(x,y);
    const covered=o=>o.building&&o.building!==currentBuilding&&!menu;
    const stack=[];
    const cached = state.fastGround !== false && !cave, visibleChunks = new Set(), tendrils = [], chunkCols = Math.ceil(world.width / CH);
    const minDifference = (-margin - camera.x) / xScale, maxDifference = (width + margin - camera.x) / xScale;
    const minSum = (-margin - camera.y) / yScale, maxSum = (height + margin - camera.y) / yScale;
    const firstRow = Math.max(0,Math.floor((minSum-maxDifference)/2)-1);
    const lastRow = Math.min(world.height-1,Math.ceil((maxSum-minDifference)/2)+1);
    for (let y = firstRow; y <= lastRow; y++) {
      const from = Math.max(0, Math.floor(Math.max(y + minDifference, minSum - y)));
      const to = Math.min(world.width - 1, Math.ceil(Math.min(y + maxDifference, maxSum - y)));
      for (let x = from; x <= to; x++) {
        if (!onScreen(x, y)) continue;
        const index = y * world.width + x, t = world.tiles[index];
        if (t.kind === "void") continue;
        if (wet && wetGround.length < (full ? 32 : 10) && !t.building && world.explored[index] &&
            (x*17+y*31)%7 === 0 && (t.surface === "asphalt" || t.surface === "concrete" || t.surface === "path" ||
              t.surface === "rail" || t.surface === "bridge")) wetGround.push(t);
        if (cave) {
          if (!shown(x+.5,y+.5)) continue;
          ctx.globalAlpha=optics.lamp || optics.fires?.length ? 1 : .29;
          tile(t,player,true,playerZone,false);
          ctx.globalAlpha=1;
          continue;
        }
        if (cached) {
          visibleChunks.add((y >> 3) * chunkCols + (x >> 3));
          if (!menu && !world.explored[index]) continue;
          if (t.tendril) tendrils.push(t);
          if(t.kind==="wall")stack.push({kind:"wall",obj:t,depth:x+y+1});
          continue;
        }
        if (!menu && !world.explored[index]) {
          if (!t.building) {
            ctx.globalAlpha=.22;
            poly([p(x,y),p(x+1,y),p(x+1,y+1),p(x,y+1)],t.color);
            ctx.globalAlpha=1;
          } else poly([p(x,y),p(x+1,y),p(x+1,y+1),p(x,y+1)],"#152016");
          continue;
        }
        tile(t,player,menu,playerZone,state.atmosphere.awake);
        if(t.kind==="wall")stack.push({kind:"wall",obj:t,depth:x+y+1});
      }
    }
    if (cached) {
      groundLayer(world, menu, visibleChunks, chunkCols, zoom / pixCss * (darkLook ? 1 : dpr));
      for (const t of tendrils) tendril(t, state.atmosphere.awake);
      if (!menu) dimAround(player);
    }
    if (wetGround.length) {
      for (const t of wetGround) {
        const sx = (t.x-t.y)*halfW, sy = (t.x+t.y+1)*halfH;
        ctx.fillStyle = "#14263828";
        ctx.fillRect(sx-13,sy-3,26,7);
        ctx.fillStyle = "#a8c4d02a";
        ctx.fillRect(sx-8,sy-2,16+(t.x%5),2);
        if (motion && darkLook) {
          const age = (clock * 1.7 + t.x * .37 + t.y * .23) % 1;
          const spread = Math.floor(age * 6);
          ctx.fillStyle = age < .5 ? "#afc1c66b" : "#879fa840";
          ctx.fillRect(sx - spread, sy - 2, spread * 2 + 1, 1);
          ctx.fillRect(sx - spread + 2, sy + 1, Math.max(1, spread * 2 - 3), 1);
        }
      }
    }
    if (menu || !state.roofsHidden) for (const b of world.buildings) {
      if (b.id === currentBuilding || menu && b.base) continue;
      const left = (b.x-b.y-b.h)*xScale+camera.x, right = (b.x+b.w-b.y)*xScale+camera.x;
      const top = (b.x+b.y)*yScale+camera.y-85*zoom, bottom = (b.x+b.w+b.y+b.h)*yScale+camera.y;
      if (right < -margin || left > width+margin || bottom < -margin || top > height+margin) continue;
      const discovered = menu || world.roofTiles.get(b.id).some(index => world.explored[index]);
      if (discovered) stack.push({kind:"roof",obj:b,depth:b.x+b.y+b.w+b.h-.5,fade:!menu && roofCoversPlayer(b, player)});
    }
    if(!menu) {
      if (optics.lamp) {
        if (effects) warmFlashlight(state,optics.lamp,clock);
        else flashlightBeam(state);
      }
      for(const [i,step] of player.path.slice(0,15).entries()) {
        if (!cave || shown(step.x,step.y)) shadow(step.x,step.y,i===0?5:3,i===0?2.5:1.6,"#dbc48b75");
      }
    }
    let fireBudget = full ? 8 : 4, smokeBudget = full ? 6 : 2;
    for(const o of world.objects) {
      if(o.active&&onScreen(o.x,o.y)&&shown(o.x,o.y)&&(!covered(o)||o.action==="door"))stack.push({kind:"prop",obj:o,depth:o.x+o.y});
      if (o.active && o.kind === "campfire" && onScreen(o.x,o.y) && (!cave || shown(o.x,o.y))) {
        if (!effects) glow(o.x,o.y,"#efb36c",125,.45);
        else if (sq(o.x-player.x,o.y-player.y,13) && (cave || known(o.x,o.y))) {
          nearbyFires.push(o);
          if (fireBudget > 0) {
            const intensity = state.reduceFlicker ? 1 : .94+.06*Math.sin(clock*6+o.x);
            glow(o.x,o.y,"#ffb46d",cave ? 100 : 103,(night || cave ? .56 : .35)*intensity);
            fireBudget--;
          }
        }
      }
      if(o.active&&o.kind==="lamp"&&onScreen(o.x,o.y)&&Sim.gridPower(state)&&night)glow(o.x+.5,o.y,"#efdc9d",170,.28);
    }
    if (lit && night) glow(player.x, player.y, "#efdc9d", 190, .28);
    if (effects && night && !cave) windowGlow(state,full,clock,onScreen,known);
    for(const z of world.enemies) {
      if(!z.dormant&&onScreen(z.x,z.y)&&(menu&&!cave||visible(state,z.x,z.y,optics)))stack.push({kind:"enemy",obj:z,depth:z.x+z.y});
    }
    const npc=world.npc;
    if(!npc.ridingVehicle&&onScreen(npc.x,npc.y)&&(menu&&!cave||visible(state,npc.x,npc.y,optics)))stack.push({kind:"npc",obj:npc,depth:npc.x+npc.y});
    if(!player.vehicle)stack.push({kind:"player",obj:player,depth:player.x+player.y});
    stack.sort((a,b)=>a.depth-b.depth);
    const reachable = state.mode === "play" ? Sim.attackTarget(state) : null;
    const combatFocus = reachable || state.target;
    for(const entry of stack) {
      if(entry.kind==="wall")wall(entry.obj,player,menu);
      else if(entry.kind==="prop") {
        const smoke = darkLook && motion && !cave && entry.obj.kind === "campfire" && smokeBudget > 0;
        if (smoke) smokeBudget--;
        prop(entry.obj, state, clock, motion && !cave, smoke);
      }
      else if(entry.kind==="roof") {
        if (entry.fade) {
          ctx.save();
          ctx.globalAlpha = darkLook ? .42 : .24;
          roof(entry.obj);
          ctx.restore();
        } else roof(entry.obj);
      }
      else {
        const entity = entry.obj;
        actor(entity, entry.kind === "player", state, clock, entity === reachable);
        if (entry.kind === "enemy" && entity === combatFocus && entity.hp > 0) {
          const firearm = Sim.weaponData(state).firearm;
          const label = entity !== reachable ? "Closing in" : Sim.weaponProblem(state) ||
            (player.cooldown > 0 ? "Recovering" : firearm ? Math.round(Sim.aimChance(state, entity) * 100) + "% hit chance" : "In range");
          marker(entity.x, entity.y, entity.kind === "brute" ? 79 : 66, entity.origin === "cinema-winner" ? "The El Gordo Winner" : label);
        }
      }
    }
    if(!menu) {
      {
        const hasNote = o => Boolean(Sim.unreadClueAt(state, o));
        const hasCache = o => Sim.isSupplyCache(state, o);
        const hasHarvest = o => o.kind === "garden" && Boolean(Sim.gardenYield(state, o));
        const actions = Sim.nearby(state).filter(o => (o.action || Sim.isFurniture(o)) && (!player.vehicle || o.action === "travel") &&
          !(o.action==="loot"&&o.searched&&!o.loot.length&&!Sim.canStore(o)&&!hasNote(o)&&!hasCache(o)));
        const priority = o => {
          if (o.action === "travel") return 4;
          if ((o.action === "campfire" && Sim.fireBatch(state, o)?.remaining === 0) || hasHarvest(o)) return 3;
          if (Chronicle.isUnseen(state.ledger,o) && !Sim.sceneProblem(state,o)) return 2;
          if (hasCache(o) || o.action === "radio" && state.supplyRun === "return") return 2;
          return Number(o.action === "loot" && (o.loot.length > 0 || hasNote(o)));
        };
        actions.sort((a,b) => priority(b)-priority(a) ||
          Sim.distance(player,a)-Sim.distance(player,b));
        for (const [index,o] of actions.entries()) {
          if (!index) {
            const batch = o.kind === "campfire" ? Sim.fireBatch(state, o) : null;
            let label = o.name;
            if (o.kind === "drop" && !o.corpse && o.loot.length === 1) label = Sim.itemName(state,o.loot[0].id);
            if (o.action === "travel") label = "Crossing · " + o.name;
            else if (o.action === "door" && o.kind !== "fence") label = o.boards ? "Barricade · " + o.boards :
              o.broken ? "Broken " + o.kind : o.locked ? "Locked door" : o.latched ? "Latched window" : o.open ? "Close" : "Open";
            else if (batch) {
              if (batch.id === "water") label = batch.remaining ? "Boiling water" : "Water ready";
              else if (batch.remaining) label = "Cooking";
              else label = Sim.isSpoiled(state, {id: batch.recipe.product, born: batch.readyAt}) ? "Food spoiled" : "Food ready";
            }
            else if (hasHarvest(o)) label = "Harvest " + Data.crops[o.garden.crop].name.toLowerCase();
            else if (o.kind === "garden" && o.garden.crop && o.garden.moisture < Data.garden.minMoisture) label = "Garden · Needs water";
            else if (hasCache(o)) label += " · Cache";
            else if (hasNote(o)) label += " · Note";
            objectLabels.push({...marker(o.x,o.y,["locker","fridge","exit"].includes(o.kind)?47:34,label), object:o});
          }
          else {
            const [x,y]=p(o.x,o.y,30);
            poly([[x-4,y],[x,y-5],[x+4,y],[x,y+5]],"#d8bd85");
            objectLabels.push({x, y, width:19, object:o});
          }
        }
      }
      if(!npc.ridingVehicle&&visible(state,npc.x,npc.y,optics)&&npc.hp>0&&Sim.distance(player,npc)<4)marker(npc.x,npc.y,47,npc.mode==="injured"?"Eva · needs help":npc.mode==="follow"?"Eva · following":"Eva · waiting","#b8d8b1");
      if(state.showNoise&&state.noiseRings){
        for(const ring of state.noiseRings){
          const age=(state.elapsed-ring.t)/1.2;
          if(age<0||age>1)continue;
          const radius=ring.r*(.4+.6*age);
          ctx.save();ctx.strokeStyle="rgba(232,198,120,"+(.55*(1-age)).toFixed(2)+")";ctx.lineWidth=1.5;ctx.beginPath();
          for(let k=0;k<=32;k++){const a=k/32*Math.PI*2,[rx,ry]=p(ring.x+Math.cos(a)*radius,ring.y+Math.sin(a)*radius);k?ctx.lineTo(rx,ry):ctx.moveTo(rx,ry);}
          ctx.stroke();ctx.restore();
        }
      }
      for(const effect of state.effects){
        const [x,y]=p(effect.x,effect.y,25+(1-effect.life)*23);
        ctx.globalAlpha=Math.min(1,effect.life*2);ctx.fillStyle=effect.color;ctx.font="800 15px monospace";ctx.textAlign="center";ctx.fillText(effect.text,x,y);ctx.globalAlpha=1;
      }
    }
    if (darkLook) {
      const lw = lowCanvas.width, lh = lowCanvas.height;
      ctx.setTransform(1,0,0,1,0,0);
      if (!cave) {
        ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .42; ctx.fillStyle = "#808080"; ctx.fillRect(0,0,lw,lh);
        ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 1; ctx.fillStyle = "#c6ccd4"; ctx.fillRect(0,0,lw,lh);
        ctx.globalCompositeOperation = "source-over";
        let g = ctx.createLinearGradient(0,lh * .6,0,lh); g.addColorStop(0,"rgba(120,135,150,0)"); g.addColorStop(1,"rgba(120,135,150,.075)"); ctx.fillStyle = g; ctx.fillRect(0,0,lw,lh);
        g = ctx.createRadialGradient(lw / 2,lh * .54,lh * .3,lw / 2,lh * .54,lw * .66); g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,.38)"); ctx.fillStyle = g; ctx.fillRect(0,0,lw,lh);
      }
      ctx = mainCtx;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(lowCanvas,0,0,lw * pixCss * dpr,lh * pixCss * dpr);
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (!effects) drawDestination(state,width,height,zoom);
    const hour=(state.minutes%1440)/60;
    const darkness = night ? Math.max(.35, .90 - .34 * Sim.moonlight(state)) : clamp((Math.abs(hour-12)-5)/7,0,.67);
    if(!menu&&!cave&&darkness>0){
      const shade=ctx.createRadialGradient(width*.5,height*.54,30,width*.5,height*.54,Math.max(width,height)*.65);
      shade.addColorStop(0,"rgba(10,20,29,"+darkness*(lit ? .15 : optics.lamp ? .36 : .68)+")");shade.addColorStop(1,"rgba(5,13,24,"+darkness+")");
      ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);
    }
    if (effects) {
      if (!cave) weatherEffects(state,clock,width,height,full,currentBuilding);
      drawDestination(state,width,height,zoom);
    } else if(state.weather==="Rain") {
      ctx.strokeStyle="#a0b6c42d";ctx.lineWidth=1;
      for(let i=0;i<40;i++){
        const x=(i*97+clock*95)%width,y=(i*137+clock*240)%height;
        const isoX=(x-camera.x)/zoom,isoY=(y-camera.y)/zoom;
        const ground = unproject(isoX, isoY);
        const rainTile = World.tileAt(world, ground.x, ground.y);
        if(currentBuilding&&rainTile?.building===currentBuilding)continue;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+13);ctx.stroke();
      }
    }
    if(player.flash>0) {ctx.fillStyle="rgba(180,56,32,"+player.flash*.2+")";ctx.fillRect(0,0,width,height);}
  }

  function locate(clientX,clientY,state) {
    const rect=canvas.getBoundingClientRect();
    const sx=(clientX-rect.left-camera.x)/camera.zoom,sy=(clientY-rect.top-camera.y)/camera.zoom;
    const ground = unproject(sx, sy);
    if (state.blueprint) return ground;
    const optics = Sim.sight(state);
    const hit=(o,z,rx=19,ry=25)=>{const [x,y]=p(o.x,o.y,z);return Math.abs(sx-x)<rx&&Math.abs(sy-y)<ry;};
    const enemy=state.world.enemies.filter(z=>z.hp>0&&!z.dormant&&visible(state,z.x,z.y,optics)&&hit(z,16,16,26)).sort((a,b)=>b.x+b.y-a.x-a.y)[0];
    if(enemy)return {enemy};
    const npc=state.world.npc;
    if(!npc.ridingVehicle&&npc.hp>0&&visible(state,npc.x,npc.y,optics)&&hit(npc,17))return {npc};
    const label = state.world === labelledWorld && objectLabels.find(({x, y, width, object}) =>
      (!state.player.vehicle || object.action === "travel") && Math.abs(sx - x) < width / 2 + 6 && Math.abs(sy - y) < 15 && Sim.reachableObject(state, object));
    if (label) return {object:label.object};
    const currentBuilding=World.tileAt(state.world,state.player.x,state.player.y)?.building;
    const object=state.world.objects.filter(o=>o.active&&(o.action||Sim.isFurniture(o))&&(!o.building||o.building===currentBuilding||o.action==="door")&&visible(state,o.x,o.y,optics)&&hit(o,o.kind==="tree"?30:["locker","fridge","exit"].includes(o.kind)?25:13,o.kind==="car"?30:20,o.kind==="tree"?35:27)).sort((a,b)=>b.x+b.y-a.x-a.y)[0];
    if(object)return {object};
    return ground;
  }

  function mapFit(canvas, world) {
    const unit = Math.min((canvas.width - 18) / world.width, (canvas.height - 18) / world.height);
    return {unit, ox:(canvas.width - world.width * unit) / 2, oy:(canvas.height - world.height * unit) / 2};
  }

  function mapPoint(canvas, world, clientX, clientY) {
    const bounds = canvas.getBoundingClientRect(), {unit,ox,oy} = mapFit(canvas, world);
    return {x:((clientX - bounds.left) * canvas.width / bounds.width - ox) / unit,
      y:((clientY - bounds.top) * canvas.height / bounds.height - oy) / unit};
  }

  // The tile layer of the map is cached: it is only redrawn when exploration, the canvas size or the open doors change.
  const minimapLayers = new WeakMap();
  function minimapLayer(canvas, world, menu, unit, ox, oy, w, h) {
    let explored = 0;
    if (!menu) for (let i = 0; i < world.explored.length; i++) if (world.explored[i]) explored++;
    const doors = world.objects.reduce((n, o) => n + (o.action === "door" && o.open ? 1 : 0), 0);
    const key = [w, h, unit, ox, oy, menu, explored, doors].join("|");
    let layer = minimapLayers.get(canvas);
    if (layer && layer.world === world && layer.key === key) return layer.canvas;
    if (!layer) { layer = {canvas: document.createElement("canvas")}; minimapLayers.set(canvas, layer); }
    layer.canvas.width = w; layer.canvas.height = h;
    const c = layer.canvas.getContext("2d");
    for (const t of world.tiles) {
      if (!menu && !world.explored[t.y * world.width + t.x]) continue;
      c.fillStyle = t.kind === "wall" ? "#93a084" : t.kind === "door" ? "#b59564" : t.color;
      c.fillRect(ox + t.x * unit, oy + t.y * unit, unit + .2, unit + .2);
    }
    Object.assign(layer, {world, key});
    return layer.canvas;
  }

  function minimap(canvas,state, pending = null) {
    const c=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
    const {world}=state, {unit,ox,oy}=mapFit(canvas, world);
    const menu=state.mode==="menu"&&!world.underground;
    c.fillStyle="#111c13";c.fillRect(0,0,w,h);
    c.drawImage(minimapLayer(canvas,world,menu,unit,ox,oy,w,h),0,0);
    const dot=(x,y,color,r=3.5)=>{
      c.fillStyle=color;c.strokeStyle="#17231a";c.lineWidth=2;c.beginPath();c.arc(ox+x*unit,oy+y*unit,r,0,Math.PI*2);c.fill();c.stroke();
    };
    if(world.base)dot(10,40,"#e3b873",5);
    const clinic=world.buildings.find(b=>b.type==="clinic");
    if(clinic&&!state.flags.rescued)dot(clinic.x+4,clinic.y+5,"#b7d4c3",4);
    if(state.world.npc.mode==="follow")dot(state.world.npc.x,state.world.npc.y,"#a0d6ad");
    if (!menu && w >= 350) {
      for (const o of world.objects) {
        if (Chronicle.isUnseen(state.ledger,o) && !Chronicle.entries[o.record].extra && Sim.exploredTile(state,o.x,o.y)) {
          dot(o.x,o.y,Chronicle.entries[o.record].game ? "#e7af73" : "#b7d4c3",3);
        }
      }
    }
    const destination = Sim.destination(state);
    if(destination)dot(destination.x,destination.y,"#e6a365",7);
    const order = state.ledger.dispatch, route = order && Chronicle.routes[order.route];
    if (order && order.moved > 0 && route.region === world.region) {
      const [x,y] = route.decoy;
      c.beginPath();c.strokeStyle="#ea9872";c.lineWidth=1.5;
      c.arc(ox+(x+.5)*unit,oy+(y+.5)*unit,Math.max(6,4*unit),0,Math.PI*2);c.stroke();
    }
    for (const exit of world.objects.filter(o => o.action === "travel")) {
      dot(exit.x,exit.y,"#e5d48f",4);
      if (w >= 350) {
        const dest = Regions.definitions[exit.id.slice(5)];
        const label = Object.hasOwn(Expedition.districts,exit.id.slice(5)) ? dest.tag : exit.id === "exit-cinema" ? "CINEMA" : world.region === Regions.home ? dest.direction[0] :
          world.underground ? "UP" : exit.id === "exit-" + Regions.cavern ? "DOWN" : dest?.deep ? dest.tag :
          Regions.definitions[world.region].deep ? "BACK" : "TOWN";
        const shift = exit.y > world.height/2 ? -10 : 14;
        c.font="700 10px monospace";c.fillStyle="#f0ddb1";c.textAlign="center";
        c.fillText(label,ox+exit.x*unit,oy+exit.y*unit+shift);
      }
    }
    for (const pin of state.mapPins) {
      const x = ox + pin.x * unit, y = oy + pin.y * unit;
      c.fillStyle = Data.pinKinds[pin.kind].color;
      c.strokeStyle = "#142219";
      c.lineWidth = 1.7;
      c.beginPath();
      c.moveTo(x, y - 5); c.lineTo(x + 5, y); c.lineTo(x, y + 5); c.lineTo(x - 5, y); c.closePath();
      c.fill(); c.stroke();
    }
    if (pending) dot(pending.x, pending.y, "#e4c47c", 5);
    dot(state.player.x,state.player.y,"#fff0c8",5);
    c.font="700 10px monospace";c.fillStyle="#d6d7ba";c.textAlign="center";
    if(world.base)c.fillText("SHELTER",ox+10*unit,oy+40*unit+15);
  }
  return {prepare,render,renderAfterlife,trauma:() => trauma,locate,minimap,mapPoint,visible,weaponIcon,equipmentPortrait};
})();
