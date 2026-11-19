"use strict";

const Atmosphere = (() => {
  const warningSeconds = 7;
  const arrivals = {
    coldvale:[
      {name:"the west road",entry:[2,29],goal:[23,29]}, {name:"the north road",entry:[29,2],goal:[29,23]},
      {name:"the eastern outskirts",entry:[71,29],goal:[48,29]}, {name:"the south road",entry:[29,71],goal:[29,48]}
    ],
    ridge:[
      {name:"the south trail",entry:[47,108],goal:[47,81]}, {name:"the eastern trees",entry:[107,79],goal:[66,73]},
      {name:"the lower creek",entry:[18,107],goal:[24,72]}
    ],
    ironworks:[
      {name:"the west approach",entry:[3,47],goal:[24,47]}, {name:"the east sidings",entry:[107,47],goal:[78,46]},
      {name:"the south apron",entry:[48,107],goal:[48,70]}, {name:"the north service road",entry:[74,3],goal:[80,36]}
    ],
    coast:[
      {name:"the coast road",entry:[47,3],goal:[49,27]}, {name:"the western dunes",entry:[3,42],goal:[22,44]},
      {name:"the eastern beach",entry:[107,54],goal:[79,56]}
    ],
    fields:[
      {name:"the east lane",entry:[108,47],goal:[79,47]}, {name:"the west lane",entry:[3,45],goal:[28,45]},
      {name:"the north hedges",entry:[60,3],goal:[56,30]}, {name:"the southern fields",entry:[72,107],goal:[70,73]}
    ],
    quarry:[
      {name:"the west gate",entry:[3,32],goal:[20,32]}, {name:"the south rim",entry:[30,60],goal:[30,40]}
    ],
    reservoir:[
      {name:"the west track",entry:[3,32],goal:[18,36]}, {name:"the east track",entry:[60,44],goal:[49,50]}
    ],
    lighthouse:[
      {name:"the headland path",entry:[32,60],goal:[31,46]}
    ],
    cavern:[]
  };
  const nestBuildings = {coldvale:"Workshop",ridge:"Ranger station",ironworks:"Power substation",coast:"Weather hut",fields:"Hay barn",quarry:"Crusher shed",reservoir:"Pump house",lighthouse:"Boat shed"};
  const furnishings = {
    home:["wardrobe","sideboard","bookcase","armchair","sink"],
    farm:["sideboard","wardrobe","washstand","armchair"],
    ranger:["bookcase","wardrobe","armchair","washstand"],
    coastal:["sink","sideboard","armchair","bookcase"],
    workshop:["toolrack","sideboard","washstand"],
    warehouse:["toolrack","sideboard","armchair"]
  };
  const furnitureNames = {wardrobe:"Wardrobe",sideboard:"Sideboard",bookcase:"Bookcase",armchair:"Armchair",
    sink:"Kitchen sink",washstand:"Washstand",toolrack:"Tool rack"};
  const marker = (x,y) => ({x:x+.5,y:y+.5});

  function place(world) {
    if (world.underground) return;
    const occupied = new Set(world.objects.map(o => Math.floor(o.y)*world.width + Math.floor(o.x)));
    function clearCell(x,y) {
      const tile = World.tileAt(world,x,y);
      return tile && !tile.solid && !occupied.has(y*world.width+x);
    }
    function add(id,kind,name,x,y,extra = {}) {
      const tile = World.tileAt(world,x,y);
      const o = {id:"scene-"+id,kind,name,...marker(x,y),zone:tile.zone,building:tile.building,tint:tile.tint,active:true,solid:false,...extra};
      world.objects.push(o);
      occupied.add(y*world.width+x);
      return o;
    }
    // Furnish along walls, keeping the original doors and central walking lanes clear.
    for (const b of world.buildings) {
      if (b.base || b.compact || !furnishings[b.type]) continue;
      const corners = [[1,1],[b.w-2,1],[1,b.h-2],[b.w-2,b.h-2],[1,3],[b.w-2,3]];
      const list = furnishings[b.type];
      let count = 0;
      for (const [dx,dy] of corners) {
        const x = b.x+dx, y = b.y+dy;
        if (!clearCell(x,y) || Math.hypot(x+.5-b.door.x,y+.5-b.door.y) < 2) continue;
        const kind = list[(count + Number(b.id.slice(1))) % list.length];
        const solid = ["wardrobe","armchair","sideboard"].includes(kind) &&
          !world.enemies.some(z => Math.hypot(z.x-x-.5,z.y-y-.5) < .72);
        add("furniture-"+b.id+"-"+count,kind,furnitureNames[kind],x,y,{action:"dismantle",decor:true,solid});
        if (++count >= list.length) break;
      }
    }

    const room = world.buildings.find(b => b.name === nestBuildings[world.region]);
    const x = Math.floor(room.door.x), y = Math.floor(room.door.y);
    const offsets = [[2,1],[3,1],[2,2],[3,2],[-2,1],[-3,1],[-2,2],[-3,2]];
    const patch = offsets.map(([dx,dy]) => [x+dx,y+dy]).filter(([ix,iy]) => clearCell(ix,iy) && !World.tileAt(world,ix,iy).building).slice(0,3);
    const interior = world.tiles.filter(t => t.building === room.id && clearCell(t.x,t.y) && Math.hypot(t.x-x,t.y-y) >= 3)
      .sort((a,b) => a.y-b.y || a.x-b.x).slice(0,12);
    for (const [ix,iy] of patch) World.tileAt(world,ix,iy).tendril = true;
    const [first] = patch;
    if (!first || interior.length < 3) throw new Error("Missing fungal nest near " + room.name + ".");
    const fungus = add("fungus","fungus","Wet fungal filaments",...first,{action:"fungus"});
    world.nest = {marker:fungus,patch,positions:interior.map(t => marker(t.x,t.y))};
    for (const [index,tile] of interior.slice(0,3).entries()) add("sleeper-"+index,"sleeper","Dormant infected",tile.x,tile.y);

    const outpost = {coldvale:[67,52,"Roadside emergency box",{cloth:1,water:1}],ridge:[83,101,"Trail supply box",{bandage:1,wood:2}],
      ironworks:[99,51,"Service apron crate",{scrap:2,tape:1}],coast:[92,103,"Sandbank salvage box",{bait:2,cloth:1}],
      fields:[102,59,"Field supply crate",{radishseed:2,wood:1}],
      quarry:[10,30,"Gate supply box",{bandage:1,water:1}],reservoir:[10,30,"Track supply box",{cloth:1,water:1}],
      lighthouse:[30,56,"Headland supply box",{bandage:1,cloth:1}]}[world.region];
    const [ox,oy,name,supply] = outpost;
    const site = [[ox,oy],[ox+1,oy],[ox-1,oy],[ox,oy+1]].find(([ix,iy]) => clearCell(ix,iy));
    if (site) add("outpost","crate",name,...site,{action:"loot",searched:false,loot:Object.entries(supply).map(([id,qty]) => ({id,qty}))});

    if (world.region === Regions.home) {
      const home = world.buildings.find(b => !b.base && b.type === "home" && b.x > 45 && b.y > 34);
      const candidates = home.compact ? [[2,1],[3,1],[4,1],[2,2],[4,2]] : [[2,1],[3,1],[2,2],[3,2],[3,3]];
      const spot = candidates.map(([dx,dy]) => [home.x+dx,home.y+dy])
        .find(([ix,iy]) => clearCell(ix,iy) && (!home.compact || !world.enemies.some(z=>z.x===ix+.5&&z.y===iy+.5)));
      if (!spot) throw new Error("Missing nursery floor.");
      world.nursery = add("crib","crib","Nursery crib",...spot,{action:"crib"});
    }
  }

  function nextWave(mode, rng) {
    return mode === "frequent" ? 48 + rng()*55 : 92 + rng()*112;
  }

  function create(world, mode) {
    const rng = Level.seeded(world.seed ^ Math.imul(Object.keys(arrivals).indexOf(world.region)+1,0x62a9d9ed));
    return {time:0,nextWave:nextWave(mode,rng),nextSound:14+rng()*19,pending:null,lastRoute:-1,serial:0,
      rng:rng.state(),awake:false,nursery:false,alarm:null};
  }

  function restore(data, world, mode) {
    if (data === undefined) return create(world,mode);
    const finite = v => Number.isFinite(v) && v >= 0;
    const routes = arrivals[world.region];
    const routeIndex = i => Number.isInteger(i) && i >= 0 && i < routes.length;
    const p = data?.pending, alarm = data?.alarm;
    if (!data || ![data.time,data.nextWave,data.nextSound].every(finite) || !Number.isInteger(data.rng) ||
        !Number.isSafeInteger(data.serial) || data.serial < 0 || typeof data.awake !== "boolean" || typeof data.nursery !== "boolean" ||
        !(data.lastRoute === -1 || routeIndex(data.lastRoute)) || p !== null && (!p || !routeIndex(p.route) || !finite(p.due) ||
          p.due > data.time+warningSeconds+.1 || !Number.isInteger(p.size) || p.size < 1 || p.size > 16) ||
        alarm !== null && (!alarm || typeof alarm.id !== "string" || !/^built\d+$/.test(alarm.id) || !finite(alarm.due) || alarm.due > data.time+10.1)) {
      throw new Error("Invalid regional encounter data.");
    }
    return {time:data.time,nextWave:data.nextWave,nextSound:data.nextSound,pending:p?{...p}:null,lastRoute:data.lastRoute,serial:data.serial,
      rng:data.rng,awake:data.awake,nursery:data.nursery,alarm:alarm?{...alarm}:null};
  }

  const isFixture = o => o.id.startsWith("scene-") || o.id.startsWith("margin-");
  return {warningSeconds,arrivals,place,create,restore,nextWave,marker,isFixture};
})();
