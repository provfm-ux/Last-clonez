"use strict";

const Homes = (() => {
  const plots = {
    coldvale:[
      [63,4,"Cemetery Road farmhouse"], [63,13,"The Winchester cottage"], [63,23,"Raccoon Rise no. 1"],
      [63,34,"Raccoon Rise no. 2"], [63,43,"Raccoon Rise no. 4"], [64,55,"Spencer Row no. 6"],
      [5,62,"Willard Close no. 1"], [14,62,"Willard Close no. 3"], [20,62,"Willard Close no. 5"],
      [36,62,"Day Twenty-Eight bungalow"], [45,62,"Uneeda Row no. 10"], [54,62,"Uneeda Row no. 12"], [63,64,"Monroe Court no. 7"],
      [16,48,"Greene Acres homestead"], [17,57,"Cooper's cellar house"]
    ],
    ridge:[[34,75,"Knowby Woods cabin"],[43,74,"Ash Hollow hut"],[58,54,"Old timber cabin"],[62,76,"Forester's bunkhouse"]],
    ironworks:[[35,37,"Busan Line cottage no. 1"],[43,37,"Busan Line cottage no. 3"],[51,37,"Busan Line cottage no. 5"],[64,37,"Signalman's cottage"]],
    coast:[[34,39,"Breakwater cottage"],[36,47,"Net mender's cottage"],[63,38,"Ferry keeper's house"],[65,46,"Rage Dunes cottage"]],
    fields:[[51,19,"Dairy workers' cottage"],[44,35,"Malt house"],[56,31,"Picker's cottage"],[47,49,"Orchard cottage"],[56,53,"Twinkie Lane cottage"]]
  };
  const palettes = {
    coldvale:[["#807562","#66584e"],["#787d6e","#53655b"],["#888479","#68685e"]],
    ridge:[["#776d55","#584937"],["#73806a","#4a5d48"]],
    ironworks:[["#8e7e73","#625451"],["#757e7c","#52615f"]],
    coast:[["#929181","#526968"],["#918673","#6e594b"]],
    fields:[["#8b7d67","#6c5843"],["#8b8980","#6c6053"]]
  };
  const supplies = {
    coldvale:[["food",1],["water",1],["fresh",1],["emptybottle",1],["cloth",1]],
    ridge:[["food",1],["water",1],["battery",1],["cloth",1],["bait",2]],
    ironworks:[["scrap",2],["tape",1],["emptybottle",1],["food",1],["battery",1]],
    coast:[["food",1],["water",1],["bait",2],["cloth",1],["emptybottle",1]],
    fields:[["apple",1],["food",1],["emptybottle",1],["seedpotato",1],["radishseed",2]]
  };
  const cottageNames = {1:"Fido's Lawn no. 1", 3:"Bub's bungalow", 7:"Hilltop Lane cottage", 9:"Alexandria Row no. 9",
    11:"Shaun's Close no. 11", 12:"Ed's garden cottage", 13:"Dead Rising Close no. 13", 14:"Z Nation Row no. 14"};
  const wardrobe = [["beanie",1],["gloves",1],["wintercoat",1],["jeans",1],["boots",1],["splint",1]];
  // Clothing and splints replace some cupboard items. The roll uses the lot position, not the shared RNG,
  // so adding items never shifts the world generation that older saves depend on.
  const wardrobeChoice = (x, y, fallback) => (x * 7 + y * 13) % 20 < 7 ? wardrobe[(x + y) % wardrobe.length] : fallback;
  const cupboard = [["cloth",1],["bandage",1],["tape",1],["battery",1],["knife",1],["painkiller",1],["golfclub",1]];
  const natural = {
    coldvale:{resource:"berries",name:"Blackberries by the hedge",surfaces:["grass"]},
    ridge:{resource:"berries",name:"Trail blackberries",surfaces:["grass"]},
    ironworks:{resource:"bait",name:"Worms under old boards",surfaces:["grass","concrete"]},
    coast:{resource:"bait",name:"Bait under the driftwood",surfaces:["grass","sand"]},
    fields:{resource:"apple",name:"Windfall apples",surfaces:["grass","field"]}
  };
  const roadSurfaces = new Set(["asphalt","rail","bridge"]);

  function place(world) {
    const {seed,region,width,height,tiles,objects,buildings,zones} = world;
    const rng = Level.seeded(seed ^ Math.imul(Object.keys(plots).indexOf(region) + 1,0x117a2849));
    const pick = list => list[Math.floor(rng() * list.length)];
    const at = (x,y) => tiles[y * width + x];
    const key = (x,y) => y * width + x;
    const point = (x,y) => ({x:x+.5,y:y+.5});
    const tileOf = o => key(Math.floor(o.x),Math.floor(o.y));
    const originalHomes = buildings.filter(b => !b.base && b.type === "home");
    const resized = new Set(originalHomes.map(b => b.id));
    world.objects = objects.filter(o => !resized.has(o.building));
    const occupied = new Map(world.objects.map(o => [tileOf(o),o]));
    const treesToClear = new Set();
    const lots = [];
    let closedDoors = 0;
    const doorsteps = new Set();
    let foragePlaced = false;

    function pave(x,y,surface) {
      const t = at(x,y);
      Object.assign(t,{building:null, zone:surface === "path" ? "path" : "wild",surface,
        kind:"floor",baseKind:"floor",solid:false,baseSolid:false,outside:false,rear:false,wallAxis:null,doorId:null,room:null});
      if (surface === "path" && !zones.path) zones.path = {name:"Footpath",short:"FOOTPATH",color:"#776958"};
    }

    function put(b, name, kind, x, y, props) {
      const t = at(x,y);
      const o = {id:b.id+"-"+name,kind,...point(x,y),building:t.building,zone:t.zone,tint:rng(),
        active:true,solid:false,...props};
      world.objects.push(o);
      occupied.set(key(x,y),o);
      return o;
    }

    function drawHome(b) {
      const {id,x,y,w,h,name} = b, mid = Math.floor(w / 2), divider = h - 4;
      const left = rng() < .5, backDoorX = left ? 2 : w-3, closetX = left ? 1 : w-2, bedX = w-1-closetX;
      const [color,roof] = pick(palettes[region]);
      Object.assign(b,{color,roof,compact:true});
      zones[id] = {name,short:name.toUpperCase(),color};
      for (let dy=0;dy<h;dy++) for (let dx=0;dx<w;dx++) {
        const outside = dx === 0 || dy === 0 || dx === w-1 || dy === h-1;
        const partition = dy === divider;
        const kind = outside || partition ? "wall" : "floor";
        const old = occupied.get(key(x+dx,y+dy));
        if (old?.kind === "tree") treesToClear.add(old.id);
        Object.assign(at(x+dx,y+dy),{building:id,zone:id,surface:"tile",room:dy < divider ? "Bedroom" : "Living room",kind,
          baseKind:kind,solid:kind==="wall",baseSolid:kind==="wall",outside,rear:dx===0||dy===0,wallAxis:dy===0||dy===h-1||partition?"x":"y"});
      }
      function opening(tag, dx, dy, kind, name, open) {
        const t = at(x+dx,y+dy);
        const door = put(b,tag,kind,x+dx,y+dy,{action:"door",name,open,boards:0,hp:kind==="window"?45:tag==="door"?90:62});
        Object.assign(t,{doorId:door.id,kind:open?"portal":"door",baseKind:"door",solid:!open,baseSolid:true});
        return door;
      }
      b.door = opening("door",mid,h-1,"door","Front door",rng() < .43);
      // Every second closed door is locked. The roll uses the lot position (not the shared RNG)
      // so older saves keep generating the same world.
      if (!b.door.open && ++closedDoors % 2 === 0) { b.door.locked = true; b.door.lockId = b.id; }
      doorsteps.add(key(x+mid,y+h));
      doorsteps.add(key(x+mid,y+h+1));
      opening("bedroom",backDoorX,divider,"door","Bedroom door",rng() < .24);
      opening("window",w-1,h-2,"window","Side window",false);

      const spawnRoll = rng();
      const occupiedChance = b.door.open ? .66 : .29;
      const hides = rng() < (b.door.open ? .58 : .85);
      const restingX = bedX === 1 ? 2 : w-3;
      b.resident = spawnRoll < occupiedChance ? {...point(x+(hides ? restingX : mid),y+(hides ? 1 : h-3)),dormant:hides,priority:rng()} : null;

      const loot = (tag, kind, name, dx, dy, list) => put(b,tag,kind,x+dx,y+dy,{name,action:"loot",solid:true,searched:false,
        loot:list.map(([id,qty]) => ({id,qty,born:0,condition:100}))});
      const household = supplies[region];
      const kitchen = [pick(household)];
      if (rng() < .48) kitchen.push(pick(household.filter(item => item !== kitchen[0])));
      const coldStorage = region !== "ridge" && region !== "ironworks";
      loot("pantry",coldStorage?"fridge":"shelf",coldStorage?"Kitchen fridge":"Dry pantry",1,h-2,kitchen);
      loot("cupboard","locker","Bedroom cupboard",closetX,1,rng() < .76 ? [wardrobeChoice(x, y, pick(cupboard))] : []);
      put(b,"bed","bed",x+bedX,y+1,{name:"Single bed",action:"bed",solid:true});
      put(b,"sink","sink",x+1,y+h-3,{name:"Kitchen sink",action:"dismantle",solid:true,decor:true});
      const table = rng() < .62;
      put(b,"seat",table?"table":"armchair",x+w-2,y+h-3,{name:table?"Kitchen table":"Armchair",action:"dismantle",solid:true,decor:true});
      if (rng() < .53) loot("tin","sideboard","Hall cabinet",w-2,h-2,rng() < .66 ? [pick(household)] : []);
      put(b,"rug","rug",x+mid,y+h-2,{name:"Hall mat"});
      lots.push(b);
    }

    function reserved(x,y,w,h) {
      if (x < 1 || y < 1 || x+w > width-1 || y+h+1 >= height-1) return true;
      for (let iy=y;iy<=y+h+1;iy++) for (let ix=x;ix<x+w;ix++) {
        const t = at(ix,iy), fixture = occupied.get(key(ix,iy));
        if (t.building || t.baseSolid || doorsteps.has(key(ix,iy)) || roadSurfaces.has(t.surface) || fixture && fixture.kind!=="tree") return true;
      }
      return false;
    }

    for (const home of originalHomes) {
      const {x,y,w,h} = home;
      for (let iy=y;iy<y+h;iy++) for (let ix=x;ix<x+w;ix++) pave(ix,iy,"grass");
      const wide = Math.min(w,6+Math.floor(rng()*2)), deep = Math.min(h,6+Math.floor(rng()*2));
      Object.assign(home,{x:x+Math.floor((w-wide)/2),y:y+h-deep,w:wide,h:deep,
        name:cottageNames[home.id.slice(1)] ?? "Cottage no. " + home.id.slice(1)});
      drawHome(home);
    }

    for (const [index,[x,y,name]] of (plots[region] ?? []).entries()) {
      const wide = 6 + Math.floor(rng()*2), deep = 6 + Math.floor(rng()*2);
      const choices = [[x,y,wide,deep],[x,y,6,6],[x+1,y,6,6],[x,y-1,6,6],[x-1,y,6,6],[x,y+1,6,6]];
      const slot = choices.find(args => !reserved(...args));
      if (!slot) continue;
      const [ix,iy,w,h] = slot;
      const home = {id:"lot-"+region+"-"+index,x:ix,y:iy,w,h,name,type:"home"};
      buildings.push(home);
      drawHome(home);
    }

    function pathCell(x,y) {
      const t = at(x,y), o = occupied.get(key(x,y));
      if (!t || t.building || t.baseSolid || o && o.kind!=="tree") return;
      if (o) treesToClear.add(o.id);
      if (t.surface === "grass" || t.surface === "field") pave(x,y,"path");
    }

    for (const b of lots) {
      const doorX = Math.floor(b.door.x), front = Math.floor(b.door.y);
      for (let dy=1;dy<=2;dy++) pathCell(doorX,front+dy);
      if (region === "coldvale" && b.id.startsWith("lot-")) {
        const walk = b.x >= 62 ? 72 : b.x < 26 ? 25 : 33;
        const direction = Math.sign(walk-doorX);
        for (let x=doorX;x!==walk;x+=direction) {
          if (at(x,front+2).building) break;
          pathCell(x,front+2);
        }
        pathCell(walk,front+2);
      }
      const {resource,name,surfaces} = natural[region];
      if (rng() < .79 || !foragePlaced && b === lots.at(-1)) {
        const verge = [[b.x-1,b.y+b.h-1],[b.x+b.w,b.y+b.h-1],[b.x+1,b.y-1],[b.x+b.w-2,b.y-1]];
        const patch = verge.find(([x,y]) => {
          if (x < 1 || x >= width-1 || y < 1 || y >= height-1) return false;
          const t = at(x,y);
          return (!occupied.has(key(x,y)) || treesToClear.has(occupied.get(key(x,y)).id)) &&
            !t.building && !t.baseSolid && surfaces.includes(t.surface);
        });
        if (patch) {
          put(b,"forage","forage",...patch,{name,action:"forage",resource});
          foragePlaced = true;
        }
      }
    }
    if (region === "coldvale") {
      for (let y=8;y<=72;y++) pathCell(72,y);
      for (let x=5;x<=68;x++) pathCell(x,71);
    }
    world.objects = world.objects.filter(o => !treesToClear.has(o.id));
    // Every locked house has its own key, hidden in another house of the same area (never in the house itself).
    lots.forEach((b, i) => {
      if (!b.door.locked) return;
      const host = lots[(i + 4) % lots.length] === b ? lots[(i + 1) % lots.length] : lots[(i + 4) % lots.length];
      const spot = world.objects.find(o => o.id === host.id + "-cupboard") ?? world.objects.find(o => o.id === host.id + "-pantry");
      if (spot) spot.loot.push({id:"housekey",qty:1,born:0,condition:100,uid:"key-" + b.id,lock:b.id,label:b.name,from:host.name});
    });
    world.homes = lots;
  }

  function residents(world, count) {
    const candidates = world.homes.filter(b => b.resident && Math.hypot(b.resident.x-world.start.x,b.resident.y-world.start.y) > 12)
      .sort((a,b) => a.resident.priority-b.resident.priority);
    return candidates.slice(0,Math.round(count * .35)).map(b => b.resident);
  }

  return {place,residents};
})();
