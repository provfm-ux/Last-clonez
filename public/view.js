"use strict";

const View = (() => {
  const canvas = document.getElementById("world");
  let ctx = canvas.getContext("2d", {alpha: false});
  const mainCtx = ctx;
  let lowCanvas = null, lowCtx = null, darkLook = false;
  const halfW = 32, halfH = 17;
  const camera = {x: 0, y: 0, zoom: 1, ready: false};
  const size = {width: 0, height: 0, dpr: 1};
  const objectLabels = [];
  let labelledWorld = null;
  const p = (x, y, z = 0) => [(x - y) * halfW, (x + y) * halfH - z];
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
    world.roofTiles = new Map(world.buildings.map(b => [b.id, []]));
    const surfaces = {grass:world.region === "ridge" ? "#435944" : world.region === "fields" ? "#526244" : "#45553a",
      asphalt:"#484d43",path:"#77806e",trail:"#77684e",water:world.region === "coast" ? "#325961" : "#3b6164",
      rock:world.underground ? "#393f40" : "#656d64",concrete:"#61635d",rail:"#615952",sand:"#a39771",bridge:"#88745c",field:"#726247"};
    for (const [index, t] of world.tiles.entries()) {
      if (t.kind === "void") continue;
      const building = buildings.get(t.building);
      if (building) world.roofTiles.get(building.id).push(index);
      const floors = {home: t.room ? "#80735f" : "#787d69", clinic: "#708078", market: "#7d8071", workshop: "#6b6354", police: "#6d7669", fuel: "#747566"};
      if (building?.compact) floors.home = t.room === "Bedroom" ? "#6c665b" : building.color;
      const color = surfaces[t.surface] || floors[building?.type] || world.zones[t.zone].color;
      const variance = t.surface === "water" ? Math.floor(t.tint * 6 - 3) : Math.floor(t.tint * 14 - 7) + ((t.x + t.y) % 2 ? -3 : 4);
      t.color = tint(color, variance);
    }
  }

  const BLOOD = ["#4a0c0f", "#6a1216", "#8c1a1c", "#2c070a"];
  const dot = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function bloodPool(wx, wy, rx, ry, seed) {
    const ring = (k, color) => poly(Array.from({length: 10}, (_, i) => p(wx + Math.cos(i / 10 * 6.283) * rx * k * (1 + .18 * Math.sin(seed + i * 2.3)), wy + Math.sin(i / 10 * 6.283) * ry * k)), color);
    ring(1, BLOOD[3]); ring(.72, BLOOD[0]); ring(.34, BLOOD[1]);
    const [hx, hy] = p(wx - rx * .2, wy - ry * .1); dot(hx, hy, 3, 2, BLOOD[2]);
  }
  function microDetail(t) {
    const {x, y} = t, h = ((x * 73856093) ^ (y * 19349663)) >>> 0, at = (u, v) => p(x + u, y + v);
    const spot = (u, v, n, r, seed) => { for (let k = 0; k < n; k++) { const q = ((seed + k * 40503) * 2654435761) >>> 0, [px, py] = at(Math.min(.95, Math.max(.05, u + ((q % 100) / 100 - .5) * r)), Math.min(.95, Math.max(.05, v + (((q >> 8) % 100) / 100 - .5) * r))); dot(px, py, 2 + (q >> 16 & 1), 2, BLOOD[k % 3 ? (q >> 20 & 1) : 3]); } };
    if (t.surface === "grass" || t.surface === "field") {
      for (let k = 0; k < 6; k++) { const q = ((h + k * 977) * 2246822519) >>> 0, [px, py] = at(.12 + (q % 76) / 100, .12 + ((q >> 7) % 76) / 100);
        dot(px, py - 3, 2, 4, k % 3 === 0 ? "#2a3a22" : k % 3 === 1 ? "#4b5f38" : "#364a2a"); if (k === 2) dot(px + 2, py - 2, 2, 3, "#5d6e42"); }
      if (h % 6 === 0) { const [px, py] = at(.3 + (h % 40) / 100, .35); dot(px, py, 7, 3, "#4a3d26"); dot(px + 2, py - 1, 3, 2, "#5e4f30"); }
      if (h % 9 === 1) { const [px, py] = at(.55, .45); dot(px, py, 4, 3, "#6a6a62"); dot(px + 1, py - 1, 3, 1, "#8c8c82"); dot(px, py + 2, 4, 1, "#3a3a36"); }
    } else if (t.surface === "asphalt") {
      if (h % 4 === 0) { const [a, b] = at(.2, .3), [c, d] = at(.5, .55), [e, f] = at(.8, .5); line([a, b], [c, d], "#141212c0", 1); line([c, d], [e, f], "#141212c0", 1); }
      for (let k = 0; k < 3; k++) { const q = ((h + k * 31) * 2654435761) >>> 0, [px, py] = at((q % 80) / 100 + .1, ((q >> 8) % 80) / 100 + .1); dot(px, py, 2, 2, k % 2 ? "#3a3a3a" : "#777168"); }
    } else if (t.surface === "tile" || t.surface === "sand") {
      for (let k = 0; k < 4; k++) { const q = ((h + k * 733) * 2654435761) >>> 0, [px, py] = at((q % 80) / 100 + .1, ((q >> 8) % 80) / 100 + .1); dot(px, py, 2, 2, t.surface === "sand" ? "#c9b98c" : k % 2 ? "#2c2820" : "#5a5444"); }
    }
    if (t.surface === "water") return;
    const heavy = t.surface === "asphalt" || t.surface === "tile";
    if (h % (heavy ? 5 : 8) === 0) spot(.5, .5, 3 + (h >> 4) % 4, .7, h);
    if (h % 47 === 0) { const [px, py] = at(.5, .5); bloodPool(x + .5, y + .5, .26, .16, h % 7); spot(.5, .5, 5, .9, h + 5); }
    if (h % 61 === 0) { for (let k = 1; k < 6; k++) spot(.15 + k * .14, .3 + k * .08, 1, .1, h + k * 13); }
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
    } else if (t.surface === "tile") {
      if (t.room) {
        line(p(x+.25,y),p(x+.25,y+1),"#423c2e4a");
        line(p(x+.62,y),p(x+.62,y+1),"#b9a48130");
      }
      if (t.marks > .985 && t.kind === "floor") shadow(x+.4,y+.6,8,3,"#77453a8a");
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
    const [sx, sy] = p(x, y);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(1, .58);
    ctx.globalAlpha = opacity;
    ctx.drawImage(glowSprite(color, radius), -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function wall(t, player, menu) {
    const {x, y} = t;
    let h = t.outside ? t.rear ? 34 : 18 : 26;
    if (!menu && x + y > player.x + player.y && sq(x + .5 - player.x, y + .5 - player.y, 3.3)) h = 10;
    if (t.kind === "shutter") {
      const gate = ["#7a5040", "#53352f", "#382d27"];
      box(x + .37, y, 0, .27, 1, 28, gate);
      for (let i = 6; i <= 24; i += 6) line(p(x + .65, y + .06, i), p(x + .65, y + .94, i), "#9e635280");
      box(x + .38, y + .37, 24, .33, .20, 3, ["#fd896c", "#9c4b39", "#633428"]);
      return;
    }
    const across = t.wallAxis === "x";
    const xx = x + (across ? 0 : .37), yy = y + (across ? .37 : 0);
    const w = across ? 1 : .26, d = across ? .26 : 1;
    const caps = t.outside ? ["#667369", "#454e44", "#343f35"] : ["#727b6c", "#475248", "#39463e"];
    const trim = ["#829181", "#566453", "#4c5b4e"];
    box(xx, yy, 0, w, d, h, caps);
    if (h > 14) box(xx, yy, 6, w, d, 2, trim);
    line(p(xx, yy + d, h), p(xx + w, yy + d, h), "#aab19a65");
    line(p(xx + w, yy, h), p(xx + w, yy + d, h), "#929c8d5f");
    if (h > 24 && t.tint > .70) {
      if (across) {
        poly([p(xx + .17, yy + d + .005, h - 4), p(xx + .82, yy + d + .005, h - 4),
          p(xx + .82, yy + d + .005, h - 15), p(xx + .17, yy + d + .005, h - 15)], "#293c38");
        line(p(xx + .50, yy + d + .01, h - 4), p(xx + .50, yy + d + .01, h - 15), "#657c72");
      } else {
        poly([p(xx + w + .005, yy + .15, h - 4), p(xx + w + .005, yy + .85, h - 4),
          p(xx + w + .005, yy + .85, h - 15), p(xx + w + .005, yy + .15, h - 15)], "#293c38");
        line(p(xx + w + .01, yy + .50, h - 4), p(xx + w + .01, yy + .50, h - 15), "#657c72");
      }
    }
  }

  const iron = ["#6b8279", "#425954", "#30463e"];
  const plastic = ["#a5aa9a", "#68756b", "#505c53"];
  const olive = ["#8e9673", "#5b684c", "#414f3b"];
  const wood = ["#927d60", "#635540", "#493e32"];
  const rubber = ["#454d43", "#262e26", "#202820"];
  const red = ["#b86751", "#794538", "#633b32"];
  const teal = ["#779e91", "#466f64", "#355952"];
  const cream = ["#bfc1a9", "#8f927e", "#747c6d"];

  function prop(o, state, clock) {
    const {x, y, kind, tint: tone} = o;
    const f = (dx, dy, z, w, d, h, c) => box(x + dx, y + dy, z, w, d, h, c);
    if (kind === "fungus") {
      const sap = state.atmosphere.awake ? olive : ["#c3c98b","#778752","#566449"];
      for (const [dx,dy,h] of [[-.28,.1,2],[.07,-.14,4],[.13,.19,3]]) f(dx,dy,1,.13,.12,h,sap);
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
        f(horizontal?-.48:-.1,horizontal?-.1:-.48,0,horizontal?.96:.2,horizontal?.2:.96,29,kind==="window"?iron:wood);
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
    if(kind==="crate" || kind==="drop") {
      const small=kind==="drop";
      shadow(x,y,19,7);
      f(-.34,-.30,0,.68,.60,small?7:19,small?olive:wood);
      for(const z of [5,13]) if(!small)line(p(x-.34,y+.305,z),p(x+.34,y+.305,z),"#292f23");
      return;
    }
    if(kind==="tree") {
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
    if(kind==="car") {
      shadow(x,y,39,15);
      const body = o.hp <= 0 ? rubber : tone > .55 ? teal : red;
      const carBox = (dx,dy,z,w,d,h,c) => o.axis === "x" ? f(dy,dx,z,d,w,h,c) : f(dx,dy,z,w,d,h,c);
      for(const dx of [-.4,.25]) for(const dy of [-.6,.35]) carBox(dx,dy,0,.18,.27,5,rubber);
      carBox(-.46,-.79,5,.92,1.58,12,body);
      carBox(-.4,-.43,17,.80,.85,9,iron);
      carBox(-.39,.4,17,.78,.18,2,plastic);
      carBox(-.34,-.77,11,.22,.04,3,cream);
      carBox(.12,-.77,11,.22,.04,3,cream);
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
      f(-.35,-.15,0,.7,.3,4,wood);
      f(-.15,-.35,3,.3,.7,4,wood);
      const [xx,yy]=p(x,y,8);
      poly([[xx-8,yy],[xx-4,yy-13-Math.sin(clock*11)*3],[xx+2,yy-8],[xx+6,yy-18],[xx+9,yy]],"#efb16a");
      const batch = Sim.fireBatch(state, o);
      if (batch) {
        f(-.22,-.22,14,.44,.44,6,iron);
        f(-.18,-.18,20,.36,.36,1,batch.remaining ? iron : teal);
      }
      return;
    }
  }

  function roof(building) {
    const {x,y,w,h}=building;
    const z=41, peak=building.compact ? 52 : 58;
    shadow(x+w*.5,y+h*.5,w*24,h*10,"#080c0980");
    const a=p(x-.1,y-.1,z), b=p(x+w+.1,y-.1,z);
    const c=p(x+w+.1,y+h+.1,z), d=p(x-.1,y+h+.1,z);
    const ridgeA=p(x+w*.5,y-.1,peak), ridgeB=p(x+w*.5,y+h+.1,peak);
    poly([a,ridgeA,ridgeB,d],building.roof,"#343d32");
    poly([ridgeA,b,c,ridgeB],tint(building.roof,-10),"#343d32");
    poly([d,ridgeB,c,p(x+w+.1,y+h+.1,33),p(x-.1,y+h+.1,33)],"#696852");
    for(let i=1;i<h;i++) {
      line(p(x-.1,y+i,z),p(x+w*.5,y+i,peak),"#a8a48c22");
      line(p(x+w*.5,y+i,peak),p(x+w+.1,y+i,z),"#a8a48c1a");
    }
    if (!building.compact || (x+y) % 2 === 0) box(x+w*.72,y+h*.2,42,.55,.55,21,["#866b58","#5b493d","#493d32"]);
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
    if (a.outfit === "hiker" || isPlayer && a.backpack) {
      ctx.fillStyle = "#3c5041";
      ctx.fillRect(-11, top + 5, 8, 14);
      ctx.fillStyle = "#667b55";
      ctx.fillRect(-11, top + 7, 5, 7);
    }
    ctx.fillStyle = isPlayer ? "#293e3e" : "#3f4535";
    ctx.fillRect(-5.2, -9 + step, 4.5, 9 - step);
    ctx.fillRect(1.1, -9 - step, 4.6, 9 + step);
    ctx.fillStyle = "#151e17";
    ctx.fillRect(-6, -2 + Math.max(0, step), 6, 2.2);
    ctx.fillRect(.5, -2 + Math.max(0, -step), 6, 2.2);
    const shirt = isPlayer ? (a.gear.body === "raincoat" ? "#bc9d50" : "#8daa92") : (Data.outfits[a.outfit]?.shirt || a.stats?.color || "#d0a968");
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
    const tiedHair = isPlayer && a.appearance === "female";
    if (tiedHair) {
      ctx.fillStyle = "#43342c";
      ctx.fillRect(-6, top - 1.5, 4, 7);
      ctx.fillRect(-7.5, top + 3 + step * .3, 3.5, 4.5);
      ctx.fillStyle = "#a17c4d";
      ctx.fillRect(-6.4, top + 2, 2.4, 1.6);
    }
    ctx.fillStyle = a.flash > 0 ? "#ffb096" : isPlayer ? "#c7ae84" : "#b0a078";
    ctx.fillRect(-3.3, top - 3, 8, 8.5);
    ctx.fillStyle = isPlayer ? (tiedHair ? "#513f32" : "#343d31") : "#575c42";
    ctx.fillRect(tiedHair ? -4.5 : -3.9, top - 5.5, 8.6, 4.8);
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

  function flashlightBeam(state) {
    const player = state.player;
    const bearing = Math.atan2(player.headingY, player.headingX);
    const origin = p(player.x, player.y);
    const points = [origin];
    for (let i = 0; i <= 14; i++) {
      const angle = bearing + Data.flashlight.angle * (i / 7 - 1);
      const dx = Math.cos(angle), dy = Math.sin(angle);
      let reach = 0;
      for (let distance = .25; distance <= Data.flashlight.range; distance += .25) {
        const tile = World.tileAt(state.world, player.x + dx * distance, player.y + dy * distance);
        if (!tile || tile.kind === "wall" || tile.kind === "door" || tile.surface === "rock") break;
        reach = distance;
      }
      points.push(p(player.x + dx * reach, player.y + dy * reach));
    }
    const light = ctx.createRadialGradient(...origin, 1, ...origin, Data.flashlight.range * halfW * 1.25);
    light.addColorStop(0, "#f8eab97a");
    light.addColorStop(.6, "#e9d59b48");
    light.addColorStop(1, "#e9d59b00");
    poly(points, light);
  }

  const visible = (state, x, y, optics) => Sim.canSee(state, x, y, optics);

  // Ground cache: the static art of the ground (colour, marks, rocks) is drawn once per 8x8 block of tiles
  // into an offscreen canvas and reused every frame, instead of redrawing ~1000 polygons per frame.
  const CH = 8, chunks = new Map();
  let chunkWorld = null, chunkFrame = 0, fastGround = true;

  function chunkSignature(world, cx, cy, menu) {
    if (menu) return darkLook ? "dm" : -1;
    let n = 0;
    const x1 = Math.min(world.width, cx * CH + CH), y1 = Math.min(world.height, cy * CH + CH);
    for (let y = cy * CH; y < y1; y++) for (let x = cx * CH; x < x1; x++) if (world.explored[y * world.width + x]) n++;
    return darkLook ? "d" + n : n;
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

  function render(state, clock, dt) {
    if (!size.width) resize();
    if (!size.width || !size.height) return;
    updateCamera(state,dt);
    const {width,height,dpr}=size,{zoom}=camera;
    const world=state.world,player=state.player,menu=state.mode==="menu",cave=world.underground;
    ctx = mainCtx;
    darkLook = state.look === "dark";
    // Dark pixel look: the world is drawn at ~640 px wide and enlarged with hard pixels (also much cheaper to rasterise).
    const pixCss = darkLook ? Math.max(1, Math.round(width / 640)) : 1;
    if (darkLook) {
      const lw = Math.ceil(width / pixCss), lh = Math.ceil(height / pixCss);
      if (!lowCanvas) { lowCanvas = document.createElement("canvas"); lowCtx = lowCanvas.getContext("2d"); }
      if (lowCanvas.width !== lw || lowCanvas.height !== lh) { lowCanvas.width = lw; lowCanvas.height = lh; }
      ctx = lowCtx;
      ctx.setTransform(1 / pixCss,0,0,1 / pixCss,0,0);
      ctx.setTransform(1,0,0,1,0,0);
    } else ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle=cave ? "#080a0b" : "#162016";ctx.fillRect(0,0,width,height);
    if (darkLook) ctx.setTransform(1 / pixCss,0,0,1 / pixCss,0,0);
    ctx.translate(camera.x,camera.y);ctx.scale(zoom,zoom);
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
    if (menu || !state.roofsHidden) for (const b of world.buildings) {
      if (b.id === currentBuilding || menu && b.base) continue;
      const left = (b.x-b.y-b.h)*xScale+camera.x, right = (b.x+b.w-b.y)*xScale+camera.x;
      const top = (b.x+b.y)*yScale+camera.y-85*zoom, bottom = (b.x+b.w+b.y+b.h)*yScale+camera.y;
      if (right < -margin || left > width+margin || bottom < -margin || top > height+margin) continue;
      const discovered = menu || world.roofTiles.get(b.id).some(index => world.explored[index]);
      if (discovered) stack.push({kind:"roof",obj:b,depth:b.x+b.y+b.w+b.h-.5,fade:!menu && roofCoversPlayer(b, player)});
    }
    if(!menu) {
      if (optics.lamp) flashlightBeam(state);
      for(const [i,step] of player.path.slice(0,15).entries()) {
        if (!cave || shown(step.x,step.y)) shadow(step.x,step.y,i===0?5:3,i===0?2.5:1.6,"#dbc48b75");
      }
    }
    for(const o of world.objects) {
      if(o.active&&onScreen(o.x,o.y)&&shown(o.x,o.y)&&(!covered(o)||o.action==="door"))stack.push({kind:"prop",obj:o,depth:o.x+o.y});
      if(o.active&&o.kind==="campfire"&&onScreen(o.x,o.y)&&(!cave||shown(o.x,o.y)))glow(o.x,o.y,"#efb36c",125,.45);
      if(o.active&&o.kind==="lamp"&&onScreen(o.x,o.y)&&Sim.gridPower(state)&&Sim.isNight(state))glow(o.x+.5,o.y,"#efdc9d",170,.28);
    }
    if (lit && Sim.isNight(state)) glow(player.x, player.y, "#efdc9d", 190, .28);
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
      else if(entry.kind==="prop")prop(entry.obj,state,clock);
      else if(entry.kind==="roof") {
        if (entry.fade) {
          ctx.save();
          ctx.globalAlpha = .24;
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
          marker(entity.x, entity.y, entity.kind === "brute" ? 79 : 66, label);
        }
      }
    }
    if(!menu) {
      {
        const hasNote = o => Boolean(Sim.unreadClueAt(state, o));
        const hasCache = o => Sim.isSupplyCache(state, o);
        const hasHarvest = o => o.kind === "garden" && Boolean(Sim.gardenYield(state, o));
        const actions = Sim.nearby(state).filter(o => o.action && (!player.vehicle || o.action === "travel") &&
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
        ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 1; ctx.fillStyle = "#aab3c4"; ctx.fillRect(0,0,lw,lh);
        ctx.globalCompositeOperation = "source-over";
        let g = ctx.createLinearGradient(0,lh * .6,0,lh); g.addColorStop(0,"rgba(120,135,150,0)"); g.addColorStop(1,"rgba(120,135,150,.13)"); ctx.fillStyle = g; ctx.fillRect(0,0,lw,lh);
        g = ctx.createRadialGradient(lw / 2,lh * .54,lh * .3,lw / 2,lh * .54,lw * .66); g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,.58)"); ctx.fillStyle = g; ctx.fillRect(0,0,lw,lh);
      }
      ctx = mainCtx;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(lowCanvas,0,0,lw * pixCss * dpr,lh * pixCss * dpr);
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const destination = Sim.destination(state);
    if (!menu && destination && Sim.distance(player,destination)>2.5) {
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
    const hour=(state.minutes%1440)/60;
    const darkness=clamp((Math.abs(hour-12)-5)/7,0,.67);
    if(!menu&&!cave&&darkness>0){
      const shade=ctx.createRadialGradient(width*.5,height*.54,30,width*.5,height*.54,Math.max(width,height)*.65);
      shade.addColorStop(0,"rgba(10,20,29,"+darkness*(lit ? .15 : .46)+")");shade.addColorStop(1,"rgba(5,13,24,"+darkness+")");
      ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);
    }
    if(state.weather==="Rain") {
      ctx.strokeStyle="#a0b6c42d";ctx.lineWidth=1;
      for(let i=0;i<40;i++){
        const x=(i*97+clock*95)%width,y=(i*137+clock*240)%height;
        const isoX=(x-camera.x)/zoom,isoY=(y-camera.y)/zoom;
        const rainTile=World.tileAt(world,(isoX/halfW+isoY/halfH)/2,(isoY/halfH-isoX/halfW)/2);
        if(currentBuilding&&rainTile?.building===currentBuilding)continue;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+13);ctx.stroke();
      }
    }
    if(player.flash>0) {ctx.fillStyle="rgba(180,56,32,"+player.flash*.2+")";ctx.fillRect(0,0,width,height);}
  }

  function locate(clientX,clientY,state) {
    const rect=canvas.getBoundingClientRect();
    const sx=(clientX-rect.left-camera.x)/camera.zoom,sy=(clientY-rect.top-camera.y)/camera.zoom;
    const ground = {x:(sx/halfW+sy/halfH)/2, y:(sy/halfH-sx/halfW)/2};
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
    const object=state.world.objects.filter(o=>o.active&&o.action&&(!o.building||o.building===currentBuilding||o.action==="door")&&visible(state,o.x,o.y,optics)&&hit(o,o.kind==="tree"?30:["locker","fridge","exit"].includes(o.kind)?25:13,o.kind==="car"?30:20,o.kind==="tree"?35:27)).sort((a,b)=>b.x+b.y-a.x-a.y)[0];
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
        const label = world.region === Regions.home ? dest.direction[0] :
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
  return {prepare,render,locate,minimap,mapPoint,visible};
})();
