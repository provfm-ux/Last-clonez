"use strict";

const Afterlife = (() => {
  const games = {
    crow:{title:"The Crow", objective:"Move away from the crow, then follow the scraping sound.", opening:"Flapping. Apparently you are on the breakfast menu.", limit:58, reach:22, end:"The crow leaves a poor review. Too much running."},
    rot:{title:"Rotting Away", objective:"Find the heartbeat and Bite before your body gives out.", opening:"Something nearby is breathing. Show-off.", limit:58, reach:17, end:"You found a pulse. Yours is still on back order."},
    horde:{title:"Find the Horde", objective:"Follow the moans and move with the horde when you reach it.", opening:"A moan carries through the dark. Finally, a networking event.", limit:72, reach:20, end:"You’ve found your people. Nobody remembered your name."},
    brains:{title:"Braaaains!", objective:"Follow the footsteps to a person. Get close and Bite.", opening:"You miss taking a packed lunch.", limit:62, reach:22, end:"Brunch. The service was just as bad as you remembered."},
    trapped:{title:"Trapped", objective:"Follow the rattle. Grab the handle, then follow the sound outside.", opening:"You remember doors. This one remembers you.", limit:58, reach:21, end:"Out at last. The building still says Push."},
    chardonnay:{title:"Echoes of Life — Chardonnay", objective:"Follow the clink of glass. Get close and Grab the bottle.", opening:"Chardonnay. The only word that survived.", limit:64, reach:20, end:"The bottle slips. Glass scatters. You stare."}
  };
  const jokes = {
    crow:{walk:["Mind the bird. It has seniority.","You can still hear it judging your footwork."],
      miss:"You bite the air. Somewhere above you, a bird takes notes.", late:"The crow wins on points. It disputes the score anyway."},
    rot:{walk:["A knee makes a noise knees aren’t supposed to make.","The rest of you files a complaint against the knee."],
      miss:"You bite nothing. Finally, something you can digest.", late:"You’ve expired again. The date on the packet was optimistic."},
    horde:{walk:["You hear a crowd. Nobody has volunteered to lead.","The moaning sounds rehearsed. Probably a team-building exercise."],
      miss:"You reach out. The group chat stays silent.", late:"You missed the horde. They said they’d wait. They didn’t."},
    brains:{walk:["You’d settle for leftovers. It’s been a long morning.","The footsteps get louder. The service may be picking up."],
      miss:"You bite the air. There’s a small charge for cutlery.", late:"The kitchen is closed. Apparently so are you."},
    trapped:{walk:["Freedom smells like damp carpet.","The emergency exit leads to another emergency."],
      miss:"You wave at the handle. The handle doesn’t wave back.", late:"Please leave the property as you found it. They mean the latch."},
    chardonnay:{walk:["You remember it pairs well with fish. You don’t remember what fish is.","The bouquet has notes of dust and a locked cellar."],
      miss:"You reach for a glass. Nobody here knows what a measure is.", late:"Last orders. Nobody remembered to ring the bell."}
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

  function start(state, roll = Math.random(), variation = Math.random(), scenario = null) {
    const {world} = state, id = Object.hasOwn(games,scenario) ? scenario : choose(roll);
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
      opposite:variation < .5 ? -1 : 1, drift:variation < .5 ? .10 : .16, vx:0,vy:0,
      blind:false,crowGone:false,animal:id === "rot" && variation < .5,locked:id === "trapped",loose:variation < .3,attempts:0,
      fakeLabel:id === "horde" ? "An abandoned radio. Finally, a programme for the dead." : id === "rot" ? "A plastic bag. It has better circulation than you." :
        ["A mannequin. At least someone has a proper outfit.","A cabbage. You weren’t this healthy when you were alive.","A plastic head. The lights are on in there, too."][Math.floor(variation*6)%3],
      message:id === "trapped" ? "A " + trap + ". You remember doors. This one remembers you." : games[id].opening,
      messageUntil:4,nextCue:0,nextGuide:0,ambientAt:1.1,cues:[],pathHint:null,walked:0,jokeIndex:0,nextMiss:0};
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

  function objective(s) {
    if (s.id === "crow" && s.crowGone) return "Follow the scraping sound.";
    if (s.id === "trapped" && !s.locked) return "Follow the sound outside.";
    if (s.id === "horde" && s.joined) return "Follow the horde as it moves.";
    return games[s.id].objective;
  }

  function ready(s) {
    if (s.result) return "";
    if (s.locked) return distance(s.player,s.latch) < 1.2 ? "grab" : "";
    if (distance(s.player,s.target) >= 1.25) return "";
    return {rot:"bite",brains:"bite",chardonnay:"grab"}[s.id] ?? "";
  }

  function screenInput({x,y}) {
    const wx = x+2*y, wy = 2*y-x;
    const scale = Math.min(1,Math.hypot(x,y))/(Math.hypot(wx,wy)||1);
    return {x:wx*scale,y:wy*scale};
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
        s.message = s.loose ? "It was never locked. In your defence, you are dead." : "The latch gives. A devastating blow to the lock industry.";
        s.messageUntil = s.clock+3;
      } else {
        s.message = "Teeth slide off the handle. The handbook did say Grab.";
        s.messageUntil = s.clock+3;
      }
    } else if (close && ((id === "brains" || id === "rot") && kind === "bite" || id === "chardonnay" && kind !== "groan")) {
      finish(s,true);
    } else if (s.decoy && distance(player,s.decoy) < 1.3 && kind !== "groan") {
      s.message = s.fakeLabel;
      s.messageUntil = s.clock+3;
      s.decoy = null;
    } else if (kind === "groan") {
      s.cues.push({...player,kind:"near"});
      s.nextCue = 0;
    } else if (s.clock >= s.nextMiss) {
      s.message = ready(s) === "bite" ? "Bite now." : jokes[id].miss;
      s.messageUntil = s.clock+2.5;
      s.nextMiss = s.clock+5;
    }
  }

  function tick(s, dt, input) {
    s.clock += dt;
    if (s.result) return s.clock >= s.finishAt;
    const {id,player,world,origin} = s;
    if (s.clock >= games[id].limit) { finish(s,false,jokes[id].late); return false; }
    const length = Math.hypot(input.x,input.y);
    const slow = id === "rot" ? Math.max(.55,1-s.clock*.007) : 1;
    const speed = (1.12 + .22*Math.sin(s.clock*8))*slow;
    const ease = Math.min(1,dt*6);
    // A consistent drag and turn bias makes the body awkward without dropping inputs.
    const x = length ? (input.x-input.y*s.drift*s.opposite)*speed / Math.max(1,length) : 0;
    const y = length ? (input.y+input.x*s.drift*s.opposite)*speed / Math.max(1,length) : 0;
    s.vx += (x-s.vx)*ease;
    s.vy += (y-s.vy)*ease;
    const previous = {x:player.x,y:player.y};
    const next = {x:player.x+s.vx*dt,y:player.y+s.vy*dt};
    const clear = p => (!s.locked || distance(p,origin) <= 2.12) && open(world,p);
    if (clear({x:next.x,y:player.y})) player.x = next.x;
    if (clear({x:player.x,y:next.y})) player.y = next.y;

    if (id === "crow" && !s.crowGone) {
      if (distance(player,origin) >= 1.6) {
        s.crowGone = true;
        s.message = "The crow moves on to a less difficult customer.";
        s.messageUntil = s.clock+3;
      } else if (s.clock >= 8) {
        s.blind = s.crowGone = true;
        s.message = "The crow took the lights. Nobody warned you about blackout service.";
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
          s.message = "The group changes direction without a meeting. A first.";
          s.messageUntil = s.clock+3;
          s.nextCue = 0;
        } else if (s.joined++ === 1) {
          s.target = {...s.route.at(Math.max(-s.route.length,-5))};
          s.nextCue = 0;
        } else finish(s,true);
      } else finish(s,true);
    }

    s.walked += distance(player,previous);
    if (!s.result && s.jokeIndex < 2 && s.walked >= 5+6*s.jokeIndex &&
        s.clock >= s.messageUntil && !ready(s) && !s.locked) {
      s.message = jokes[id].walk[s.jokeIndex++];
      s.messageUntil = s.clock+3;
    }

    if (s.clock >= s.nextGuide) {
      const from = s.locked ? s.latch : s.target;
      const destination = from;
      const local = search(world,player,34);
      const reachable = local.find(p => key(world,p) === key(world,destination));
      const path = reachable ? pathTo(reachable) : [];
      s.pathHint = path[1] ?? destination;
      s.nextGuide = s.clock+.55;
    }
    if (s.clock >= s.nextCue || !s.soundLabel) {
      const kind = s.id === "crow" && !s.crowGone ? "wings" :
        {crow:"twig",rot:"heartbeat",horde:"distant",brains:"footsteps",trapped:"tin",chardonnay:"glass"}[id];
      const label = {wings:"Wings",twig:"Scraping",heartbeat:"Heartbeat",distant:"Moaning",
        footsteps:"Footsteps",tin:"Rattling",glass:"Glass clinking"}[kind];
      const point = kind === "wings" ? {x:player.x+.8,y:player.y-.5} : s.pathHint;
      const horizontal = point.x-player.x-(point.y-player.y);
      const vertical = point.x-player.x+point.y-player.y;
      const direction = Math.abs(horizontal) > Math.abs(vertical)*.55 ? horizontal < 0 ? "left" : "right" :
        vertical < 0 ? "above" : "below";
      s.soundLabel = kind === "wings" ? "Wings overhead" : ready(s) ? label+" nearby" : label+" "+direction;
      s.cues.push({...point,kind});
      s.pulseAt = s.clock;
      s.nextCue = s.clock+(s.blind ? 1.1 : 1.85);
    }
    if (s.clock >= s.ambientAt) {
      const turn = Math.floor(s.clock/3)%2 ? 1 : -1;
      s.cues.push(s.decoy && distance(player,s.decoy)<7 ? {...s.decoy,kind:"tin",muffled:true} :
        {x:player.x+2.5*turn,y:player.y-1.6*turn,kind:"twig",muffled:true});
      s.ambientAt = s.clock+4.1;
    }
    return false;
  }

  return {games,eligible,choose,start,range,objective,ready,screenInput,action,tick};
})();
