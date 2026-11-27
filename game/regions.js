"use strict";

const Regions = (() => {
  const home = "coldvale", cavern = "cavern", size = 111, oldSize = 96, mapRevision = 3;
  const grottoRoute = {ridge:{exit:[60,26],arrival:[59,26]}, cavern:{exit:[19,38],arrival:[19,37]}};
  const definitions = {
    coldvale: {name:"Cold Vale", color:"#536551", width:74, height:74},
    ridge: {name:"Pine Ridge", direction:"North", type:"Mountain", color:"#4e6958", width:size, height:size,
      entrance:[47,107], arrival:[47,104], townExit:[29,2], townArrival:[29,5], vehicles:false, cold:.46,
      detail:"Forest trails, a mountain spring and a firewatch cabin."},
    ironworks: {name:"Ironworks", direction:"East", type:"Industrial", color:"#766356", width:size, height:size,
      entrance:[3,47], arrival:[6,47], townExit:[71,29], townArrival:[68,29], vehicles:true, cold:0,
      detail:"Freight sheds, a machine shop and stores of fuel and salvage."},
    coast: {name:"Bracken Coast", direction:"South", type:"Beach", color:"#766c50", width:size, height:size,
      entrance:[47,3], arrival:[47,6], townExit:[29,71], townArrival:[29,68], vehicles:true, cold:.18,
      detail:"A fishing pier, coastguard station and an exposed beach."},
    fields: {name:"Westfields", direction:"West", type:"Farmland", color:"#626746", width:size, height:size,
      entrance:[107,47], arrival:[104,47], townExit:[2,29], townArrival:[5,29], vehicles:true, cold:0,
      detail:"Farmhouses, orchards, seed stores and land to grow food."},
    quarry: {name:"Slag Quarry", direction:"Beyond Ironworks", tag:"QUARRY", type:"Quarry", color:"#6a6258", width:64, height:64, deep:true, host:"ironworks",
      arrival:[5,32], exitBack:[2,32], hostExit:[106,60], hostArrival:[103,60], vehicles:false, cold:.1,
      detail:"A flooded pit, a crusher shed and a locked explosives store. The foreman's office may hold the key."},
    reservoir: {name:"Greywater Reservoir", direction:"Beyond Westfields", tag:"DAM", type:"Reservoir", color:"#566a70", width:64, height:64, deep:true, host:"fields",
      arrival:[5,32], exitBack:[2,32], hostExit:[60,106], hostArrival:[60,103], vehicles:false, cold:.2,
      detail:"A dam, a pump house and a locked keeper's cottage. Try the pump house for the key."},
    lighthouse: {name:"Gull Point", direction:"Beyond the coast", tag:"LIGHT", type:"Headland", color:"#6a7480", width:64, height:64, deep:true, host:"coast",
      arrival:[32,58], exitBack:[32,61], hostExit:[100,100], hostArrival:[97,100], vehicles:false, cold:.35,
      detail:"A windy headland with a locked lighthouse, a keeper's cottage and a boat shed."},
    fortress: {name:"The Fortress", direction:"Beyond Pine Ridge", tag:"FORT", type:"Fortress", color:"#5c6168", width:64, height:64, deep:true, host:"ridge",
      arrival:[5,32], exitBack:[2,32], hostExit:[100,8], hostArrival:[97,8], vehicles:false, cold:.1,
      detail:"A walled compound with a keep, gardens and two gates. Whatever started this is inside."},
    cinema:{name:"Oxford Night Reel", direction:"Oxford", tag:"CINEMA", color:"#514c46", width:29, height:31,
      deep:true, host:"coldvale", generator:6, arrival:[14,27], exitBack:[14,29], hostExit:[72,64], hostArrival:[71,64], vehicles:false,
      detail:"A shuttered Oxford cult cinema. The evening raffle never finished."},
    cavern: {name:"Cinder Grotto", type:"Underground", color:"#655c55", width:42, height:42, underground:true, cold:.62,
      detail:"An abandoned survey tunnel. Bring a flashlight and spare batteries."}
  };
  Object.assign(definitions, Expedition.districts);
  const annexes = Object.keys(definitions).filter(id => id !== home && id !== cavern && !definitions[id].deep);
  const deepIds = Object.keys(definitions).filter(id => definitions[id].deep);
  const point = ([x,y]) => ({x:x+.5, y:y+.5});
  const oldWidth = id => id === home ? 64 : oldSize;
  const oldTownExits = {ridge:[29,2],ironworks:[61,29],coast:[29,61],fields:[2,29]};
  const oldEntrances = {ridge:[47,92],ironworks:[3,47],coast:[47,3],fields:[92,47]};
  const oldArrivals = {ridge:[47,89],ironworks:[6,47],coast:[47,6],fields:[89,47]};
  const vehicleNames = {"quarry-hauler":"Quarry hauler", "reservoir-van":"Waterworks van", "lighthouse-jeep":"Lighthouse jeep", "ironworks-van":"Yard van", "coast-service":"Coastguard car", "fields-pickup":"Farm pickup"};

  function cinemaOutcome(seed) {
    const roll = Level.seeded(seed ^ 0x521cf149)();
    return roll < .07 ? "winner" : roll < .15 ? "trophy" :
      roll < .25 ? "guest" : roll < .47 ? "projector" : roll < .72 ? "noise" : "quiet";
  }

  function addExits(world) {
    function add(to, at) {
      world.objects.push({id:"exit-" + to, ...point(at), kind:"exit", action:"travel", name:definitions[to].name,
        active:true, solid:false, tint:.5});
    }
    const meta = definitions[world.region];
    if (world.region === home && world.generator >= definitions.cinema.generator) {
      const [x,y] = definitions.cinema.hostExit;
      world.objects = world.objects.filter(o => !(o.kind === "tree" && Math.floor(o.y) === y &&
        Math.floor(o.x) >= x-1 && Math.floor(o.x) <= x));
      for (const lane of [x-1,x]) world.tiles[y*world.width+lane].surface = "asphalt";
    }
    if (world.region === home) for (const id of annexes) add(id,definitions[id].townExit);
    else if (world.region !== cavern && !meta.deep) add(home,meta.entrance);
    if (world.region === "ridge") add(cavern,grottoRoute.ridge.exit);
    if (world.region === cavern) add("ridge",grottoRoute.cavern.exit);
    // Generation 5: the three far areas hang off the outer ones, like the grotto.
    if (world.generator >= 5) {
      if (meta.deep) add(meta.host,meta.exitBack);
      for (const id of deepIds) {
        const next = definitions[id];
        if (next.host !== world.region || world.generator < (next.generator ?? 5)) continue;
        if (Object.hasOwn(Expedition.districts,id)) {
          const lane = [next.hostExit,next.hostArrival];
          world.objects = world.objects.filter(o => o.kind !== "tree" ||
            !lane.some(([x,y]) => Math.floor(o.x) === x && Math.floor(o.y) === y));
          for (const [x,y] of lane) {
            const tile = world.tiles[y*world.width+x];
            if (!tile.building) Object.assign(tile,{surface:"asphalt",solid:false,baseSolid:false});
          }
        }
        add(id,next.hostExit);
      }
    }
  }

  function connection(from, to) {
    const deep = definitions[from]?.deep ? from : definitions[to]?.deep ? to : null;
    if (deep) {
      const meta = definitions[deep];
      if (from === deep && to === meta.host) return {arrival:point(meta.hostArrival),vehicles:false};
      if (to === deep && from === meta.host) return {arrival:point(meta.arrival),vehicles:false};
      return null;
    }
    if (from === cavern || to === cavern) {
      if (from === cavern && to === "ridge" || from === "ridge" && to === cavern) {
        return {arrival:point(grottoRoute[to].arrival),vehicles:false};
      }
      return null;
    }
    if ((from === home) === (to === home)) return null;
    const region = definitions[from === home ? to : from];
    if (!region) return null;
    return {arrival:point(from === home ? region.arrival : region.townArrival), vehicles:region.vehicles};
  }

  function oldExit(from, id) {
    return point(from === home ? oldTownExits[id.slice(5)] : oldEntrances[from]);
  }

  function expand(world) {
    if (definitions[world.region].deep) return;
    const {region, seed, tiles, width:previous} = world, {width,height} = definitions[region];
    const rng = Level.seeded(seed ^ 0x410b378d ^ width);
    const margin = {name:"Outskirts",short:"OUTSKIRTS",color:"#52604c"};
    world.zones.margin = margin;
    const terrain = {
      coldvale(x,y) { return x >= 27 && x <= 31 || y >= 27 && y <= 31 ? "asphalt" : "grass"; },
      ridge(x,y) { return y >= 93 && Math.abs(x-47) <= 1 ? "trail" : "grass"; },
      ironworks(x,y) {
        if (Math.abs(y-47) <= 2 || Math.abs(x-48) <= 1 && y >= 95) return "asphalt";
        if (x >= 91 && y >= 25 && y <= 28) return "rail";
        return x >= 91 && y >= 18 && y <= 76 ? "concrete" : "grass";
      },
      coast(x,y) {
        if (Math.abs(x-87) <= 1 && y >= 67 && y < 101) return "bridge";
        if (((x-91)/13)**2+((y-102)/7)**2 < 1) return "sand";
        return y > 64 + 3*Math.sin(x/7) ? "water" : y > 54 ? "sand" : "grass";
      },
      fields(x,y) { return Math.abs(y-47) <= 2 ? "asphalt" : x > 97 && y > 52 && y < 80 || y > 100 && x > 40 && x < 80 ? "field" : "grass"; }
    }[region];
    const expanded = [];
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const old = x < previous && y < previous && tiles[y*previous+x];
      const border = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (old && x !== previous-1 && y !== previous-1) { expanded.push(old); continue; }
      const bridge = region === "coast" && Math.abs(x-87) <= 1 && y >= 67 && y < 101;
      const annexRoad = region === "ridge" && Math.abs(x-47) <= 1 && y >= 93 ||
        region === "fields" && Math.abs(y-47) <= 2 && x >= 92;
      const surface = bridge || annexRoad || !old ? terrain(x,y) : old.surface;
      const solid = border || surface === "water" || surface === "rock";
      expanded.push({...(old || {x,y,tint:rng(),marks:rng(),zone:"margin",building:null}),surface,solid,baseSolid:solid,kind:"floor",baseKind:"floor",
        ...(surface === "bridge" ? {boardAxis:"x"} : {}),
        ...(region !== home && surface === "asphalt" ? {roadLine:y===47?"x":x===48?"y":null} : {})});
      if (border || old || surface !== "grass" || rng() > (region === "ridge" ? .05 : .023)) continue;
      world.objects.push({id:"margin-tree-"+x+"-"+y,x:x+.5,y:y+.5,zone:"margin",building:null,kind:"tree",name:region === "ridge" ? "Pine tree" : "Tree",
        treeType:region === "ridge" ? "pine" : null,action:"harvest",hp:55,tint:rng(),active:true,solid:true});
    }
    // The existing coast road reaches the new boardwalk over the old shoreline.
    if (region === "coast") for (let y = 58; y < 95; y++) for (let x = 86; x <= 88; x++) {
      const tile = expanded[y*width+x];
      if (tile.surface === "water" || tile.surface === "sand") Object.assign(tile,{surface:"bridge",baseSolid:false,solid:false,boardAxis:"x"});
    }
    Object.assign(world,{tiles:expanded,width,height});
    if (region !== home) world.start = point(definitions[region].arrival);
  }

  function createGrotto(seed, generator) {
    const region = cavern, {name,color,width,height} = definitions[region];
    const rng = Level.seeded(seed ^ 0x5b36a711);
    const zones = {
      wild:{name,short:"CINDER GROTTO",color},
      gallery:{name:"Lower gallery",short:"LOWER GALLERY",color:"#655f55"},
      winch:{name:"Winch room",short:"WINCH ROOM",color:"#695c51"},
      survey:{name:"Survey room",short:"SURVEY ROOM",color:"#69635b"},
      sump:{name:"Flooded branch",short:"FLOODED BRANCH",color:"#4a5351"}
    };
    const chambers = [
      [17,30,22,39,"gallery"], [18,25,20,29,"gallery"], [16,18,23,25,"gallery"],
      [11,22,15,24,"winch"], [5,20,10,27,"winch"], [7,17,9,19,"winch"],
      [18,12,20,17,"gallery"], [19,12,27,14,"survey"], [26,7,35,15,"survey"],
      [30,16,32,23,"sump"], [27,22,35,28,"sump"], [23,24,26,26,"sump"]
    ];
    const tiles = [];
    for (let y=0; y<height; y++) for (let x=0; x<width; x++) {
      const room = chambers.find(([left,top,right,bottom]) => x >= left && x <= right && y >= top && y <= bottom);
      const water = room?.[4] === "sump" && x >= 33 && y >= 24;
      const solid = !room || water;
      tiles.push({x,y,kind:"floor",baseKind:"floor",solid,baseSolid:solid,building:null,
        zone:room?.[4] ?? "wild",surface:water ? "water" : room ? "cave" : "rock",tint:rng(),marks:rng()});
    }
    const start = point(grottoRoute.cavern.arrival);
    return {region,seed,generator,width,height,rng,tiles,objects:[],buildings:[],zones,start,base:null,underground:true,
      hotspots:[[8,23],[30,11],[29,26],[18,19]].map(point),
      npc:{id:"eva",name:"Eva",...start,hp:0,mode:"away",path:[],moving:false}};
  }

  function create(seed, region, generator) {
    if (region === cavern) return createGrotto(seed,generator);
    const district = Expedition.districts[region];
    const meta = definitions[region], width = meta.deep ? meta.width : oldSize, height = meta.deep ? meta.height : oldSize;
    const rng = Level.seeded(seed ^ Math.imul(annexes.indexOf(region) + 1 || 20 + deepIds.indexOf(region), 0x9e3779b9));
    const zones = {wild:{name:meta.name, short:meta.name.toUpperCase(), color:meta.color}};
    const tiles = [], objects = [], buildings = [], hotspots = [];
    const start = point(meta.deep ? meta.arrival : oldArrivals[region]);
    const at = (x,y) => tiles[y * width + x];
    let serial = 0;

    function zone(id, name, color) {
      zones[id] = {name, short:name.toUpperCase(), color};
    }

    const regionSurface = {
      cinema() { return "concrete"; },
      ridge(x,y) {
        const creek = 38 + 4 * Math.sin(x / 12) + 3 * Math.cos(x / 9);
        const lake = ((x - 25) / 15) ** 2 + ((y - 37) / 9) ** 2;
        if (lake < 1 || x > 24 && Math.abs(y - creek) < 1.7) return "water";
        const westRidge = 11 + 4 * Math.cos(y / 6), eastRidge = 80 + 4 * Math.sin(y / 8);
        if (y < 12 || x < westRidge || x > eastRidge && y < 74) return "rock";
        return "grass";
      },
      ironworks(x,y) {
        if (y >= 25 && y <= 28 && x >= 8 && x <= 90) return "rail";
        if (x >= 13 && x < 91 && y > 15 && y < 75) return "concrete";
        return "grass";
      },
      coast(x,y) {
        const shore = 66 + 5 * Math.sin(x / 14) - 7 * Math.exp(-(((x - 26) / 14) ** 2));
        if (y > shore) return "water";
        if (y > shore - 11) return "sand";
        return "grass";
      },
      fields(x,y) {
        if (((x - 23) / 10) ** 2 + ((y - 22) / 7) ** 2 < 1) return "water";
        if (x > 28 && x < 56 && y > 20 && y < 37 || x > 16 && x < 40 && y > 53 && y < 76 ||
            x > 59 && x < 83 && y > 54 && y < 75 || x > 65 && x < 89 && y > 19 && y < 38) return "field";
        return "grass";
      },
      quarry(x,y) {
        if (y < 8 || x > 59) return "rock";
        if (((x - 42) / 12) ** 2 + ((y - 46) / 9) ** 2 < 1) return "water";
        return x > 6 && x < 54 && y > 10 && y < 56 ? "concrete" : "grass";
      },
      reservoir(x,y) {
        if (y < 26 && x > 3 && x < 60) return "water";
        return y < 8 ? "rock" : "grass";
      },
      fortress(x,y) {
        const wall = x === 14 || x === 58 || y === 10 || y === 54;
        if (x >= 14 && x <= 58 && y >= 10 && y <= 54) {
          if (wall) return (x === 14 || x === 58) && y >= 30 && y <= 34 ? "concrete" : "rock";
          return x >= 18 && x <= 24 && y >= 42 && y <= 46 || x >= 50 && x <= 55 && y >= 42 && y <= 46 ? "grass" : "concrete";
        }
        return "grass";
      },
      lighthouse(x,y) {
        const spine = 32 + 3 * Math.sin(y / 9), half = 14 - Math.abs(y - 30) / 4, d = Math.abs(x - spine);
        return d > half ? "water" : d > half - 3 ? "sand" : "grass";
      }
    }[region] ?? ((x,y) => {
      if ((region === "lowtide" || region === "highmoor") && x > 6 && (y < 9 || y > height-10)) {
        return region === "lowtide" ? "water" : "rock";
      }
      if (region === "slagline" && y > 44 && y < 50) return "rail";
      return district.surface;
    });

    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const surface = regionSurface(x,y);
      tiles.push({x,y,surface,kind:"floor",zone:"wild",building:null,tint:rng(),marks:rng(),
        solid:x === 0 || y === 0 || x === width - 1 || y === height - 1 || surface === "rock" || surface === "water"});
    }

    function paint(tile, surface, area) {
      Object.assign(tile,{surface,zone:area,solid:false});
    }

    function road(points, halfWidth, surface, area = "wild") {
      for (let n = 1; n < points.length; n++) {
        const [x,y] = points[n - 1], [nx,ny] = points[n];
        const dx = nx - x, dy = ny - y, length = Math.hypot(dx,dy);
        for (let iy = Math.max(1,Math.floor(Math.min(y,ny)-halfWidth)); iy <= Math.min(height-2,Math.ceil(Math.max(y,ny)+halfWidth)); iy++) {
          for (let ix = Math.max(1,Math.floor(Math.min(x,nx)-halfWidth)); ix <= Math.min(width-2,Math.ceil(Math.max(x,nx)+halfWidth)); ix++) {
            const progress = Math.min(1,Math.max(0,((ix-x)*dx+(iy-y)*dy)/(length*length)));
            const distance = Math.hypot(ix-x-progress*dx,iy-y-progress*dy);
            if (distance > halfWidth) continue;
            const tile = at(ix,iy);
            if (tile.surface === "bridge") continue;
            const paved = tile.surface === "water" ? "bridge" : surface;
            paint(tile,paved,area);
            tile.roadLine = surface === "asphalt" && distance < .42 ? (Math.abs(dx) > Math.abs(dy) ? "x" : "y") : null;
            if (paved === "bridge") tile.boardAxis = Math.abs(dx) > Math.abs(dy) ? "y" : "x";
          }
        }
      }
    }

    function add(x,y,kind,extra = {}) {
      const tile = at(x,y);
      const o = {id:region + "-" + serial++,x:x+.5,y:y+.5,kind,name:kind,zone:tile.zone,building:tile.building,
        tint:rng(),active:true,solid:true,...extra};
      objects.push(o);
      return o;
    }

    function loot(x,y,kind,name,contents,extra = {}) {
      return add(x,y,kind,{name,action:"loot",searched:false,
        loot:Object.entries(contents).map(([id,qty]) => ({id,qty,born:0,condition:100})),...extra});
    }

    function building(x,y,w,h,name,type,style) {
      const id = "b" + buildings.length;
      const palettes = {wood:["#757b62","#4d5c4e"], iron:["#7b7466","#555b58"], coast:["#8a8d77","#566767"], farm:["#897b64","#654d44"]};
      const [color,roof] = palettes[style];
      zone(id,name,color);
      const b = {id,x,y,w,h,name,type,color,roof,style};
      buildings.push(b);
      for (let iy = y; iy < y+h; iy++) for (let ix = x; ix < x+w; ix++) {
        const outside = ix === x || ix === x+w-1 || iy === y || iy === y+h-1;
        Object.assign(at(ix,iy),{zone:id,building:id,surface:"tile",kind:outside?"wall":"floor",solid:outside,
          outside,rear:ix===x||iy===y,wallAxis:iy===y||iy===y+h-1?"x":"y",room:style === "wood" ? "Timber floor" : null});
      }
      function opening(ix,iy,kind) {
        const tile = at(ix,iy);
        tile.kind = "door";
        const o = add(ix,iy,kind,{name:kind === "door" ? "Door" : "Window",action:"door",solid:false,open:false,
          hp:kind === "door" ? 90 : 45,boards:0});
        tile.doorId = o.id;
        return o;
      }
      const entry = x + Math.floor(w/2), front = y+h-1;
      b.door = opening(entry,front,"door");
      opening(x+w-1,y+Math.floor(h/2),"window");
      hotspots.push({x:entry+.5,y:front+2.5});
      return {
        opening,
        stash:(ix,iy,kind,label,contents,extra) => loot(x+ix,y+iy,kind,label,contents,extra),
        bed:(ix,iy,label = "Camp bed") => add(x+ix,y+iy,"bed",{name:label,action:"bed"}),
        bench:(ix,iy) => add(x+ix,y+iy,"counter",{name:"Workbench",action:"workbench"}),
        table:(ix,iy) => add(x+ix,y+iy,"table",{name:"Table",action:"dismantle"})
      };
    }

    const lockDoor = b => { b.door.locked = true; b.door.lockId = b.id; return b; };
    const keyItem = b => ({id:"housekey",qty:1,born:0,condition:100,uid:"key-" + b.id,lock:b.id,label:b.name});
    const resource = (x,y,kind,name,extra = {}) => add(x,y,kind,{name,action:kind,solid:false,...extra});
    const campfire = (x,y) => resource(x,y,"campfire","Stone fire ring",{solid:true});
    const collector = (x,y) => resource(x,y,"barrel","Rain collector",{water:0,rawRain:true,solid:true});
    const vehicle = (x,y,id,contents,fuel) => loot(x,y,"car",vehicleNames[id],contents,{id,fuel,hp:122});
    const garden = (x,y,crop) => resource(x,y,"garden","Garden bed",{solid:true,
      garden:{crop,moisture:48,growth:Data.crops[crop].minutes}});

    if (district) {
      zone("routes","District footpaths","#626457");
      const roadSurface = district.surface === "concrete" ? "asphalt" : "trail";
      const east = width-3;
      for (const y of [34,60,88]) road([[2,y],[east,y]],2,roadSurface,"routes");
      for (const x of [3,26,48,70,92,east]) road([[x,30],[x,92]],1.3,roadSurface,"routes");
      for (const [index,[name]] of district.sites.entries()) {
        const x = 5+22*(index%5), y = index < 5 ? 14 : 68;
        const station = building(x,y,16,16,name,"district",district.style);
        road([[x+8,y+16],[x+8,y+20]],1.25,"path","routes");
        station.stash(2,6,"crate","Emergency supplies",{water:1,food:1},{storage:true});
        station.table(11,11);
        if (index%3 === 0) station.bed(2,13,"Relief crew cot");
        if (index%3 === 1) collector(x+13,y+18);
        if (index%3 === 2) campfire(x+2,y+18);
      }
    } else if (region === "cinema") {
      const hall = building(5,4,18,20,"Oxford Night Reel","cinema","iron");
      const front = buildings.at(-1).door;
      front.name = "Lobby doors";
      front.open = true;
      const emergency = hall.opening(22,10,"door");
      emergency.name = "Emergency exit";
      emergency.open = true;
      for (let y=5;y<=22;y++) for (let x=6;x<=21;x++) {
        at(x,y).room = y >= 19 ? x <= 9 ? "Ticket booth" : x >= 17 ? "Concessions" : "Lobby" :
          y >= 16 ? x >= 18 ? "Projection booth" : x <= 8 ? "Storage" : "Auditorium" :
          y <= 7 ? x >= 17 ? "Backstage" : "Stage" : "Auditorium";
      }
      for (const [x,y] of [[18,16],[18,18],[19,16],[21,16],[9,16],[9,18],[17,19],[17,21]]) {
        Object.assign(at(x,y),{kind:"wall",solid:true,outside:false,wallAxis:x === 18 || x === 9 || x === 17 ? "y" : "x"});
      }
      add(8,20,"counter",{name:"Ticket booth counter"});
      add(19,20,"counter",{name:"Concessions counter"});
      hall.stash(2,12,"shelf","Equipment cupboard",{battery:1,cloth:1});
      hall.stash(15,17,"crate","Sealed concessions",{food:1,water:1});
      add(19,17,"projector",{name:"Projector",solid:false});
      add(20,19,"cinema-guest",{name:"Concessions guest",solid:false});
      add(19,6,"table",{name:"Backstage table"});
      for (const y of [9,11,13,15]) for (const x of [9,10,11,15,16,17]) {
        add(x,y,"chair",{name:"Auditorium seat"});
        if ((x+y)%3 !== 0) add(x,y,"cinema-body",{name:"Motionless audience member",solid:false});
      }
    } else if (region === "ridge") {
      zone("trail","Pine Ridge trail","#657052");
      road([[47,94],[47,83],[53,72],[49,61],[52,51],[48,39],[54,28],[62,25]],1.35,"trail","trail");
      road([[53,72],[43,72],[30,67],[22,57]],1.4,"trail","trail");
      road([[49,68],[43,68],[42,67]],1.25,"trail","trail");
      road([[48,51],[34,50],[27,47],[22,47]],1.2,"trail","trail");
      road([[54,28],[43,21],[30,20],[24,25]],1.25,"trail","trail");
      const ranger = building(37,57,12,10,"Ranger station","ranger","wood");
      ranger.stash(2,2,"locker","Trail equipment",{raincoat:1,axe:1,emptybottle:2,food:1});
      ranger.stash(9,2,"crate","Ranger supplies",{wood:3,cloth:2,bandage:2},{storage:true});
      ranger.bed(9,6); ranger.bench(2,6);
      const lookout = building(56,15,12,10,"Firewatch cabin","ranger","wood");
      lookout.stash(2,2,"shelf","Lookout supplies",{backpack:1,battery:2,food:2,water:1});
      lookout.bed(8,3,"Lookout bunk"); lookout.table(8,7);
      const creek = building(18,47,9,8,"Creek shelter","ranger","wood");
      creek.stash(2,2,"crate","Emergency cache",{wood:2,cloth:1,emptybottle:2},{storage:true});
      creek.bed(6,3);
      campfire(25,57); campfire(46,70);
      resource(28,46,"spring","Mountain spring");
      for (const [x,y] of [[49,81],[55,70],[33,67],[31,49],[46,30],[54,25],[64,28],[27,25],[40,72]]) {
        resource(x,y,"forage","Wild blackberries",{resource:"berries"});
      }
    } else if (region === "ironworks") {
      zone("yard","Rail and freight yard","#6c6557");
      zone("sidings","Freight sidings","#6c6557");
      for (const t of tiles) if (t.surface === "rail") t.zone = "sidings";
      road([[1,47],[88,47]],2.1,"asphalt","yard");
      road([[23,47],[23,21],[31,21]],1.7,"asphalt","yard");
      road([[48,47],[48,69],[64,69],[64,79]],1.9,"asphalt","yard");
      road([[78,47],[78,32],[68,32]],1.7,"asphalt","yard");
      road([[27,47],[27,45]],1.25,"concrete","yard");
      const shop = building(20,33,14,12,"Machine shop","workshop","iron");
      shop.stash(2,2,"locker","Tool cage",{hammer:1,crowbar:1,machete:1,tape:2,nails:20});
      shop.stash(11,2,"drum","Electrical salvage",{scrap:8,part:2,battery:2});
      shop.stash(11,8,"crate","Stock crate",{wood:6,cloth:1},{storage:true});
      shop.bench(3,8);
      const freight = building(58,16,20,14,"Freight depot","warehouse","iron");
      freight.stash(3,3,"shelf","Freight supplies",{food:4,water:3,backpack:1});
      freight.stash(15,4,"crate","Fuel pallet",{fuel:5,scrap:4});
      freight.stash(4,9,"shelf","Packing materials",{wood:5,tape:3,cloth:3});
      freight.stash(15,10,"locker","Workwear cabinet",{armguards:1,raincoat:1});
      const utility = building(56,56,16,12,"Power substation","workshop","iron");
      utility.stash(2,2,"locker","Maintenance stock",{part:2,battery:3,flashlight:1});
      utility.stash(13,7,"drum","Spare fuel",{fuel:4,scrap:4});
      utility.bench(2,8);
      const dispatch = building(78,57,10,10,"Dispatch office","warehouse","iron");
      dispatch.stash(2,2,"locker","First-aid cabinet",{bandage:3,disinfectant:1,water:1});
      dispatch.bed(7,2,"Staff cot"); dispatch.table(6,5);
      vehicle(38,51,"ironworks-van",{fuel:1,scrap:2},21);
      for (const [x,y] of [[16,36],[16,40],[40,36],[40,40],[50,35],[50,37],[80,36],[83,36],[83,39],[72,72],[75,72]]) {
        add(x,y,"drum",{name:"Scrap drum",action:"loot",loot:[{id:"scrap",qty:1}],searched:false});
      }
      for (const [x,y] of [[60,34],[61,34],[64,34],[65,34],[66,34],[62,36],[63,36],[64,36],[84,24],[84,25],[84,26]]) {
        loot(x,y,"cargo","Freight cage",x % 2 ? {scrap:2,tape:1} : {wood:2,nails:6});
      }
      for (const [x,y] of [[17,45],[39,45],[52,49],[73,45],[81,49],[47,67]]) add(x,y,"lamp",{solid:false});
    } else if (region === "coast") {
      zone("coast-road","Coast road","#777356"); zone("harbor","Old fishing pier","#77694c");
      road([[47,1],[47,22],[56,31],[57,42],[55,47],[54,52]],2,"asphalt","coast-road");
      road([[55,47],[34,46],[17,46],[17,58],[26,61],[26,74]],1.4,"trail","harbor");
      road([[26,74],[19,74]],1.35,"trail","harbor");
      road([[52,47],[68,46],[76,51],[79,54]],1.45,"trail","coast-road");
      road([[56,31],[44,31],[31,34]],1.45,"trail","coast-road");
      const station = building(42,34,13,10,"Coastguard station","coastal","coast");
      station.stash(2,2,"locker","Rescue kit",{bandage:3,disinfectant:1,raincoat:1,flashlight:1,battery:2});
      station.stash(10,2,"crate","Drinking supplies",{water:2,emptybottle:3,food:1},{storage:true});
      station.bed(10,6,"Staff bunk"); station.bench(2,6);
      const net = building(20,47,12,9,"Net shed","coastal","coast");
      net.stash(2,2,"shelf","Tackle shelf",{rod:1,bait:5,knife:1});
      net.stash(9,5,"crate","Firewood crate",{wood:4,cloth:2,tape:1},{storage:true});
      const weather = building(72,43,12,10,"Weather hut","coastal","coast");
      weather.stash(2,2,"locker","Weather supplies",{food:2,water:1,emptybottle:2,battery:1});
      weather.bed(9,3);
      collector(54,46); campfire(31,57); campfire(74,55);
      resource(26,72,"fish","Pier fishing spot"); resource(20,74,"fish","Breakwater fishing spot");
      for (const [x,y] of [[29,56],[33,57],[21,56],[76,56],[75,58]]) resource(x,y,"forage","Bait under driftwood",{resource:"bait"});
      vehicle(58,43,"coast-service",{water:1,fuel:1},16);
    } else if (region === "fields") {
      zone("lane","Westfields lane","#766d54");
      road([[94,47],[75,47],[63,43],[50,44],[37,45],[17,45]],1.9,"asphalt","lane");
      road([[75,47],[72,54],[71,61]],1.35,"trail","lane");
      road([[48,44],[48,34],[46,29],[44,28]],1.35,"trail","lane");
      road([[37,45],[27,45],[25,40],[23,32],[25,29]],1.35,"trail","lane");
      road([[25,45],[26,55],[27,63],[34,78]],1.35,"trail","lane");
      const farmhouse = building(38,17,12,11,"Orchard farmhouse","farm","farm");
      farmhouse.stash(2,2,"fridge","Farm pantry",{food:2,water:2,emptybottle:2,fresh:1});
      farmhouse.stash(9,2,"locker","Seed cabinet",{seedpotato:4,radishseed:4,cloth:2});
      farmhouse.bed(9,7,"Farmhouse bed"); farmhouse.table(2,7);
      const barn = building(64,50,15,11,"Hay barn","farm","farm");
      barn.stash(2,2,"crate","Barn supplies",{wood:6,nails:16,hammer:1,axe:1},{storage:true});
      barn.stash(12,6,"locker","Farm tools",{scrap:4,tape:2,fuel:1,shovel:1});
      barn.bench(2,7);
      const cottage = building(30,71,10,9,"Field cottage","farm","farm");
      cottage.stash(2,2,"locker","Cottage supplies",{bandage:2,water:2,food:2});
      cottage.bed(7,3); cottage.table(6,6);
      collector(46,29); campfire(46,31); campfire(42,79);
      resource(24,29,"spring","Farm pond intake");
      garden(55,39,"radish"); garden(56,39,"potato");
      for (const [x,y] of [[36,28],[34,30],[34,34],[32,38],[37,33]]) resource(x,y,"forage","Orchard apples",{resource:"apple"});
      for (const [x,y] of [[69,63],[27,62],[40,78],[60,47]]) resource(x,y,"forage","Worms under mulch",{resource:"bait"});
      vehicle(69,47,"fields-pickup",{wood:2,seedpotato:1},18);
    } else if (region === "quarry") {
      zone("haul","Quarry haul road","#756f63");
      road([[2,32],[20,32],[34,30],[50,24]],1.8,"asphalt","haul");
      road([[20,32],[16,41]],1.3,"trail","haul"); road([[34,30],[28,24]],1.3,"trail","haul"); road([[20,32],[13,27]],1.3,"trail","haul");
      const crusher = building(22,14,12,10,"Crusher shed","industrial","iron");
      crusher.stash(2,2,"locker","Tool locker",{hammer:1,gloves:1,scrap:3,tape:1});
      crusher.stash(9,2,"crate","Spare parts",{part:2,nails:12,scrap:2},{storage:true});
      crusher.bench(2,6);
      const office = building(10,40,10,9,"Foreman's office","office","iron");
      const desk = office.stash(2,2,"locker","Foreman's desk",{bandage:1,water:1,painkiller:1});
      office.bed(7,5,"Foreman's cot"); office.table(7,2);
      const hut = building(8,21,9,7,"Weighbridge hut","office","iron");
      hut.stash(2,2,"crate","Hut supplies",{water:2,food:1,cloth:1});
      const store = building(46,12,10,8,"Explosives store","store","iron"), storeB = buildings[buildings.length - 1];
      lockDoor(storeB); desk.loot.push(keyItem(storeB));
      store.stash(2,2,"crate","Blasting supplies",{ammo:14,fuel:2,battery:2});
      store.stash(6,2,"locker","Safety cabinet",{pistol:1,ammo:6,bandage:2});
      campfire(30,38); collector(24,38);
      resource(38,50,"fish","Flooded pit shore");
      for (const [x,y] of [[12,34],[30,44],[18,52],[44,40],[24,28]]) resource(x,y,"forage","Wild blackberries",{resource:"berries"});
      vehicle(14,31,"quarry-hauler",{scrap:3,fuel:1},14);
    } else if (region === "reservoir") {
      zone("dam","Greywater dam","#6d7479"); zone("track","Reservoir track","#6f6a54");
      road([[2,32],[16,36],[32,40],[46,44],[60,44]],1.5,"trail","track");
      road([[8,27],[56,27]],1.9,"concrete","dam");
      road([[16,36],[16,30],[12,28]],1.3,"trail","track");
      const pump = building(14,34,10,9,"Pump house","industrial","iron");
      const maint = pump.stash(2,2,"locker","Maintenance locker",{hammer:1,tape:2,scrap:3,battery:2});
      pump.stash(7,2,"crate","Spare valves",{part:2,nails:10},{storage:true}); pump.bench(2,6);
      const cottage = building(36,38,11,9,"Keeper's cottage","house","farm"), cottageB = buildings[buildings.length - 1];
      lockDoor(cottageB); maint.loot.push(keyItem(cottageB));
      cottage.stash(2,2,"fridge","Keeper's larder",{food:3,water:3,fresh:1});
      cottage.stash(8,2,"locker","Keeper's wardrobe",{wintercoat:1,beanie:1,boots:1});
      cottage.bed(8,6,"Keeper's bed"); cottage.table(2,6);
      const valve = building(30,29,8,7,"Valve tower","tower","iron");
      valve.stash(2,2,"crate","Valve crew supplies",{bandage:2,splint:1,water:2});
      resource(20,26,"fish","Dam wall fishing spot"); resource(44,26,"fish","Spillway fishing spot");
      collector(40,36); campfire(24,46);
      for (const [x,y] of [[10,40],[30,50],[50,50],[56,38]]) resource(x,y,"forage","Wild blackberries",{resource:"berries"});
      vehicle(52,45,"reservoir-van",{wood:2,fuel:1},16);
    } else if (region === "fortress") {
      zone("yard","Fortress yard","#6b6f72"); zone("approach","Fortress approach","#6f6a54");
      road([[2,32],[14,32]],1.6,"trail","approach"); road([[58,32],[62,32]],1.6,"trail","approach");
      const keep = building(26,16,14,11,"Fortress keep","industrial","iron");
      keep.stash(2,2,"locker","Armoury",{pistol:1,ammo:12,bandage:3,splint:1});
      keep.stash(10,2,"fridge","Sealed larder",{food:6,water:6,fresh:1},{storage:true});
      keep.stash(2,7,"crate","Seed store",{radishseed:4,part:2,nails:10});
      keep.bed(10,7,"Keep bunk"); keep.bed(11,7,"Keep bunk"); keep.bench(6,7);
      for (const [x,y] of [[34,34],[46,38],[40,46],[48,28],[22,40]]) campfire(x,y);
      collector(20,20); collector(52,20);
      for (const [x,y] of [[20,44],[21,44],[22,44],[52,44]]) garden(x,y,"potato");
    } else if (region === "lighthouse") {
      zone("point","Gull Point","#6c7380");
      road([[32,61],[31,50],[29,40],[30,28],[33,19]],1.4,"trail","point");
      const tower = building(26,9,9,9,"Gull Point lighthouse","tower","coast"), towerB = buildings[buildings.length - 1];
      lockDoor(towerB);
      tower.stash(2,2,"locker","Lamp room cabinet",{battery:3,flashlight:1,cloth:2});
      tower.stash(6,5,"crate","Signal store",{fuel:2,tape:2});
      tower.bed(6,2,"Keeper's bunk");
      const cottage = building(18,30,11,9,"Keeper's cottage","house","coast");
      cottage.stash(2,2,"fridge","Keeper's pantry",{food:3,water:2,dried:2});
      const oilskins = cottage.stash(8,2,"locker","Oilskins",{raincoat:1,boots:1,beanie:1});
      oilskins.loot.push(keyItem(towerB));
      cottage.bed(8,6,"Keeper's bed"); cottage.table(2,6);
      const shed = building(30,44,9,8,"Boat shed","store","coast");
      shed.stash(2,2,"crate","Chandlery",{rod:1,bait:3,tape:1,scrap:2},{storage:true});
      shed.stash(5,2,"locker","Life jackets",{cloth:3,bandage:2});
      campfire(27,56); collector(35,36);
      resource(24,52,"fish","Rocks fishing spot"); resource(37,40,"fish","Lee shore fishing spot");
      for (const [x,y] of [[24,26],[36,26],[33,55]]) resource(x,y,"forage","Wild blackberries",{resource:"berries"});
      vehicle(31,58,"lighthouse-jeep",{fuel:1,cloth:2},12);
    }

    const occupied = new Set(objects.map(o => Math.floor(o.y)*width + Math.floor(o.x)));
    const density = {ridge:.085, ironworks:.04, coast:.035, fields:.045, quarry:.012, reservoir:.05, lighthouse:.03, fortress:.004}[region] ?? .023;
    for (const t of tiles) {
      t.baseKind = t.kind; t.baseSolid = t.solid;
      if (t.surface !== "grass" || t.solid || occupied.has(t.y*width+t.x) || Math.hypot(t.x+.5-start.x,t.y+.5-start.y) < 6) continue;
      const grove = Math.sin(t.x/6) + Math.cos(t.y/8) + .4*Math.cos((t.x+t.y)/5);
      const orchard = region === "fields" && t.x > 27 && t.x < 38 && t.y > 26 && t.y < 41;
      if (orchard ? t.x % 3 === 1 && t.y % 3 === 1 : rng() < density * (grove > .5 ? 1.8 : .35)) {
        add(t.x,t.y,"tree",{name:orchard ? "Apple tree" : region === "ridge" ? "Pine tree" : "Tree",action:"harvest",hp:55,
          treeType:region === "ridge" ? "pine" : orchard ? "orchard" : null});
      }
    }
    return {region,seed,generator,width,height,rng,tiles,objects,buildings,zones,start,hotspots,base:null,
      npc:{id:"eva",name:"Eva",...start,hp:0,mode:"away",path:[],moving:false}};
  }

  // Generation 4 scatters extra finds across the four outer areas so there is always something new to reach.
  // It uses its own seeded stream, so it never changes what older generations produce.
  const wildFinds = {
    ridge:[["Hunter's stand cache","crate",[["bait",2],["bandage",1],["water",1]]],["Knowby's cellar hatch","crate",[["machete",1]]],
      ["Collapsed lean-to","crate",[["wintercoat",1]]],["Ranger's kit box","locker",[["splint",1],["bandage",1],["painkiller",1]]],
      ["Fire-watch locker","locker",[["battery",2],["cloth",1]]],["Abandoned camp stove","crate",[["food",2],["emptybottle",1]]],
      ["Trapper's pack","crate",[["shovel",1]]]],
    ironworks:[["Umbra Corp supply crate","crate",[["scrap",3],["tape",1]]],["Foreman's locker","locker",[["crowbar",1]]],
      ["Rail-yard toolbox","crate",[["hammer",1],["nails",12]]],["Fuel drum stash","crate",[["fuel",1]]],
      ["Break-room locker","locker",[["gloves",1],["boots",1]]],["Busan Line luggage","crate",[["food",2],["water",1],["jeans",1]]],
      ["Night-watch flask","crate",[["painkiller",1],["battery",1]]]],
    coast:[["Washed-up lifeboat locker","locker",[["water",2],["bandage",2]]],["Net-loft crate","crate",[["bait",3],["cloth",2]]],
      ["Dead Calm dinghy cache","crate",[["fuel",1],["tape",1]]],["Beach hut locker","locker",[["beanie",1],["gloves",1]]],
      ["Lifeguard kit","locker",[["bandage",2],["splint",1]]],["Smuggler's crate","crate",[["food",2],["battery",1],["painkiller",1]]],
      ["Tideline driftwood stash","crate",[["wood",2],["cloth",1]]]],
    fields:[["Scarecrow hide-out","crate",[["apple",2],["radishseed",2]]],["Terminus fence cache","crate",[["food",3],["water",2]]],
      ["Hay-loft toolbox","crate",[["shovel",1],["tape",1]]],["Orchard picker's flask","crate",[["water",1],["apple",2]]],
      ["Greene Acres cold store","crate",[["seedpotato",2],["food",1]]],["Combine cab locker","locker",[["battery",1],["cloth",2],["golfclub",1]]],
      ["Farmhand's coat peg","crate",[["wintercoat",1]]]]
  };

  function addWilds(world) {
    const finds = wildFinds[world.region];
    if (!finds || world.underground || world.generator < 4) return;
    const {width,height,tiles} = world, rng = Level.seeded(world.seed ^ 0x3c6ef372 ^ Math.imul(annexes.indexOf(world.region) + 7, 0x85ebca6b));
    const occupied = new Set(world.objects.map(o => Math.floor(o.y) * width + Math.floor(o.x)));
    let placed = 0;
    for (let tries = 0; placed < finds.length && tries < 6000; tries++) {
      const x = 8 + Math.floor(rng() * (width - 16)), y = 8 + Math.floor(rng() * (height - 16)), t = tiles[y * width + x];
      if (!t || t.solid || t.building || !["grass","field","sand"].includes(t.surface) || occupied.has(y * width + x)) continue;
      if (Math.hypot(x + .5 - world.start.x, y + .5 - world.start.y) < 12) continue;
      if ([-1,0,1].some(dy => [-1,0,1].some(dx => tiles[(y + dy) * width + x + dx]?.solid || occupied.has((y + dy) * width + x + dx)))) continue;
      const [name,kind,loot] = finds[placed];
      world.objects.push({id:"wild-" + world.region + "-" + placed, x:x + .5, y:y + .5, kind, building:null, zone:"wild", tint:rng(),
        active:true, solid:true, name, action:"loot", searched:false, loot:loot.map(([id,qty]) => ({id,qty,born:0,condition:100}))});
      occupied.add(y * width + x);
      placed++;
    }
  }

  return {home,cavern,definitions,annexes,cinemaOutcome,create,expand,addExits,addWilds,connection,oldWidth,oldExit,mapRevision,vehicleNames};
})();
