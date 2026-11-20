"use strict";

const Afterlife = (() => {
  const games = {
    crow:{title:"The Crow", opening:"Wings. Very close.", limit:58, reach:22, end:"The wings recede."},
    rot:{title:"Rotting Away", opening:"Something nearby is breathing.", limit:58, reach:17, end:"For a moment, everything holds together."},
    horde:{title:"Find the Horde", opening:"A moan carries through the dark.", limit:72, reach:20, end:"The footsteps fall into time."},
    brains:{title:"Braaaains!", opening:"The hunger has one word.", limit:62, reach:22, end:"Braaaains."},
    trapped:{title:"Trapped", opening:"Something has a handle.", limit:58, reach:21, end:"The door swings into the dark."},
    chardonnay:{title:"Echoes of Life — Chardonnay", opening:"Chardonnay.", limit:64, reach:20, end:"The bottle slips. Glass scatters. You stare."}
  };
  const normal = ["crow","rot","horde","brains","trapped"];
  const steps = [[0,1],[1,0],[0,-1],[-1,0]];
  const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
  const eligible = (state, roll) => state.player.exposure > 0 && roll < state.rules.afterlifeChance / 100;
  const choose = roll => roll < .04 ? "chardonnay" : normal[Math.min(4,Math.floor((roll-.04)/.96*5))];
  const centre = p => ({x:Math.floor(p.x)+.5,y:Math.floor(p.y)+.5});
  const key = (world,p) => Math.floor(p.y)*world.width+Math.floor(p.x);
  const open = (world,p) => World.clear(world,p.x,p.y,.18);

  function search(world, origin, depth) {
    const start = {...centre(origin),prev:null,depth:0};
    const cells = [start], seen = new Set([key(world,start)]);
    for (const p of cells) {
      if (p.depth >= depth) continue;
      for (const [dx,dy] of steps) {
        const next = {x:p.x+dx,y:p.y+dy,prev:p,depth:p.depth+1};
        const id = key(world,next);
        if (!seen.has(id) && open(world,next)) { cells.push(next); seen.add(id); }
      }
    }
    return cells;
  }

  function pathTo(point) {
    const path = [];
    for (let p = point; p; p = p.prev) path.unshift(p);
    return path;
  }

  function start(state, roll = Math.random(), variation = Math.random()) {
    const {world} = state, id = choose(roll);
    const death = centre(state.player);
    const {reach} = games[id];
    let cells = open(world,death) ? search(world,death,reach) : [];
    // If death left the body boxed in by furniture, find a usable patch of the same map.
    if (!cells.some(p => p.depth >= 10)) {
      const start = search(world,world.start,reach);
      if ((start.at(-1)?.depth ?? 0) > (cells.at(-1)?.depth ?? 0)) cells = start;
    }
    if (!cells.some(p => p.depth >= 10)) {
      const spare = world.tiles.find(t => !t.building && !t.solid && steps.every(([dx,dy]) =>
        open(world,{x:t.x+.5+dx,y:t.y+.5+dy})));
      if (spare) cells = search(world,{x:spare.x,y:spare.y},reach);
    }
    const goal = cells.filter(p => p.depth === cells.at(-1).depth);
    let target = goal[Math.floor(variation*goal.length)];
    if (id === "chardonnay") {
      const rooms = new Set(world.buildings.filter(b => ["cinema","market","home","farm"].includes(b.type)).map(b => b.id));
      const roomFor = p => World.tileAt(world,p.x,p.y);
      const bottles = cell => {
        const tile = roomFor(cell);
        return cell.depth >= 12 && rooms.has(tile?.building) && (!world.cinema || tile.room === "Concessions");
      };
      let stock = cells.filter(bottles);
      if (!stock.length) {
        const shelves = world.tiles.filter(t => !t.solid && rooms.has(t.building) && (!world.cinema || t.room === "Concessions"));
        const shelf = shelves[Math.min(shelves.length-1,Math.floor(variation*shelves.length))];
        if (shelf) {
          const neighbours = search(world,{x:shelf.x,y:shelf.y},reach);
          const start = neighbours.at(-1);
          if (start.depth > 3) {
            cells = search(world,start,reach);
            stock = cells.filter(p => p.x === shelf.x+.5 && p.y === shelf.y+.5);
          }
        }
      }
      if (stock.length) target = stock[Math.floor(variation*stock.length)];
    }
    const route = pathTo(target);
    const fake = cells.filter(p => p.depth >= 2 && distance(p,target) >= 2);
    const decoy = variation < .55 && ["rot","horde","brains"].includes(id) ? fake[Math.floor(variation*fake.length)] : null;
    const latch = route[2] ?? route.at(-1);
    const cabin = world.objects.find(o => o.action === "door" && distance(o,route[0]) < 2.5);
    const room = World.tileAt(world,route[0].x,route[0].y)?.room;
    const trap = room?.toLowerCase().includes("bath") || cabin && variation < .35 ? "bathroom" :
      !cabin && variation < .5 ? "car" : "storage room";
    return {id,world,clock:0,player:{...route[0]},origin:route[0],target:{...target},latch,trap,route,decoy,
      opposite:variation < .5 ? -1 : 1, drift:variation < .5 ? .28 : .42, vx:0,vy:0,
      blind:false,crowGone:false,animal:id === "rot" && variation < .5,locked:id === "trapped",loose:variation < .3,attempts:0,
      fakeLabel:id === "horde" ? "An abandoned radio." : id === "rot" ? "A plastic bag." :
        ["A mannequin.","A cabbage.","A plastic head."][Math.floor(variation*6)%3],
      message:id === "trapped" ? "A " + trap + ". Something has a handle." : games[id].opening,
      messageUntil:4,nextCue:0,cue:null,pathHint:null,stride:0};
  }

  function range(session) {
    if (session.blind) return 1.2;
    if (session.id === "rot") return Math.max(1.55,4.25-session.clock*.053);
    return 4;
  }

  function finish(session, success, message) {
    session.result = success ? "success" : "failure";
    session.message = message ?? (success ? games[session.id].end : "The last sound fades.");
    session.messageUntil = Infinity;
    session.finishAt = Math.min(games[session.id].limit+4,Math.max(30,session.clock+4));
  }

  function action(s, kind) {
    if (s.result) return;
    s.gesture = {kind,until:s.clock+.45};
    const {id,player,target} = s;
    const close = distance(player,target) < 1.25;
    if (s.locked && distance(player,s.latch) < 1.2 && kind !== "groan") {
      s.attempts++;
      if (kind === "grab" || s.attempts >= 2) {
        s.locked = false;
        s.message = s.loose ? "It was never locked." : "The latch gives.";
        s.messageUntil = s.clock+3;
      } else {
        s.message = "Teeth slide off the handle.";
        s.messageUntil = s.clock+3;
      }
    } else if (close && ((id === "brains" || id === "rot") && kind === "bite" || id === "chardonnay" && kind !== "groan")) {
      finish(s,true);
    } else if (s.decoy && distance(player,s.decoy) < 1.3 && kind !== "groan") {
      s.message = s.fakeLabel;
      s.messageUntil = s.clock+3;
      s.decoy = null;
    } else if (kind === "groan") {
      s.nextCue = 0;
      s.groan = true;
    }
  }

  function tick(s, dt, input) {
    s.clock += dt;
    if (s.result) return s.clock >= s.finishAt;
    const {id,player,world,origin} = s;
    if (s.clock >= games[id].limit) { finish(s,false); return false; }
    const length = Math.hypot(input.x,input.y);
    const slow = id === "rot" ? Math.max(.55,1-s.clock*.007) : 1;
    const speed = (1.12 + .22*Math.sin(s.clock*8))*slow;
    const ease = Math.min(1,dt*6);
    // A consistent drag and turn bias makes the body awkward without dropping inputs.
    const x = length ? (input.x-input.y*s.drift*s.opposite)*speed / Math.max(1,length) : 0;
    const y = length ? (input.y+input.x*s.drift*s.opposite)*speed / Math.max(1,length) : 0;
    s.vx += (x-s.vx)*ease;
    s.vy += (y-s.vy)*ease;
    const next = {x:player.x+s.vx*dt,y:player.y+s.vy*dt};
    const clear = p => (!s.locked || distance(p,origin) <= 2.12) && open(world,p);
    if (clear({x:next.x,y:player.y})) player.x = next.x;
    if (clear({x:player.x,y:next.y})) player.y = next.y;

    if (id === "crow" && !s.crowGone) {
      if (distance(player,origin) >= 1.6) {
        s.crowGone = true;
        s.message = "The feathers lift.";
        s.messageUntil = s.clock+3;
      } else if (s.clock >= 8) {
        s.blind = s.crowGone = true;
        s.message = "Darkness. Something scrapes in the distance.";
        s.messageUntil = s.clock+4;
      }
    }
    if ((id === "rot" || id === "brains") && s.pathHint && distance(player,s.target) > 1.5) {
      const phase = Math.sin(s.clock*1.6)*.28;
      const p = {x:s.target.x+phase*dt,y:s.target.y-phase*dt};
      if (open(world,p)) Object.assign(s.target,p);
    }
    if (distance(player,s.target) < 1.15 && ["crow","horde","trapped"].includes(id)) {
      if (id === "horde") {
        if (!s.joined) {
          s.joined = 1;
          s.target = {...s.route.at(Math.max(-s.route.length,-3))};
          s.message = "The others turn. Move with them.";
          s.messageUntil = s.clock+3;
          s.nextCue = 0;
        } else if (s.joined++ === 1) {
          s.target = {...s.route.at(Math.max(-s.route.length,-5))};
          s.nextCue = 0;
        } else finish(s,true);
      } else finish(s,true);
    }

    if (s.clock >= s.nextCue) {
      const from = s.locked ? s.latch : s.target;
      const mistaken = s.decoy && Math.floor(s.clock/2.5)%3 === 1;
      const destination = mistaken ? s.decoy : from;
      const local = search(world,player,34);
      const reachable = local.find(p => key(world,p) === key(world,destination));
      const path = reachable ? pathTo(reachable) : [];
      s.pathHint = path[1] ?? destination;
      s.cue = {...s.pathHint,kind:s.groan ? "near" : id === "horde" ? "distant" : id === "crow" ? "twig" : "tin"};
      s.pulseAt = s.clock;
      s.nextCue = s.clock + (s.blind ? 1.2 : 2.5);
      s.groan = false;
    }
    return false;
  }

  return {games,eligible,choose,start,range,action,tick};
})();
