"use strict";

const FieldStories = (() => {
  const scenes = [
    ["R01","Last Pint cellar","pub","carpentry","051"],
    ["R02","The emergency bakery","bakery","cooking","052"],
    ["R03","Ward calendar","hospital","first_aid","053"],
    ["R04","The last clearance","shopping_arcade","tailoring","054"],
    ["R05","Reserved seat","station","electrical","055"],
    ["R06","Dairy incident","food_festival","maintenance","056"],
    ["R07","Pending door inspection","hospital","sneaking","057"],
    ["R08","Ink and circuits","safe_room","electrical","058"],
    ["R09","Dave corrects the map","safehouse","foraging","059"],
    ["R10","The listening patch","forest","foraging","060"],
    ["R11","The unpaid mascot","costume_shop","tailoring","061"],
    ["R12","Byte repair club","computer_shop","carpentry","062"],
    ["R13","Offline neighbours","apartment","electrical","041"],
    ["R14","The last attendance sheet","school","carpentry","042"],
    ["R15","No cash-out","casino","electrical","043"],
    ["R16","The queue went elsewhere","evacuation_point","tracking","044"],
    ["R17","Royal botany exhibit","botanical_exhibit","agriculture","045"],
    ["R18","Domestic freezer rules","house_kitchen","cooking","046"],
    ["R19","Camera on the landing","apartment_stairs","electrical","047"],
    ["R20","The single-take set","film_warehouse","electrical","048"],
    ["R21","Motorbike before the tunnel","tunnel_entrance","mechanics","049"],
    ["R22","Knees required","rooftop_route","nimble","050"],
    ["R23","Lottery screening","cinema","cooking","063"],
    ["R24","The bug escaped","office","electrical","064"],
    ["F25","Dinner interrupted","house_kitchen","cooking","065"],
    ["F26","Moving day","moving_house","mechanics","066"],
    ["F27","Failed allotment","allotment","agriculture","067"],
    ["F28","Last wash","laundrette","tailoring","068"],
    ["F29","The practical library","library","foraging","069"],
    ["F30","Uncollected repair","garage","mechanics","070"],
    ["F31","The potter left early","pottery_workshop","pottery","071"],
    ["F32","Village forge","smith_workshop","blacksmithing","072"],
    ["F33","Glazier stock","glazier","glassmaking","073"],
    ["F34","Stone yard shelter","stone_yard","masonry","074"],
    ["F35","The hens stayed","farm","animal_care","075"],
    ["F36","Angler camp","fishing_camp","fishing","076"],
    ["F37","Hunter route","hunting_camp","trapping","077"],
    ["F38","Community board","community_board","first_aid","078"],
    ["F39","Hardware refuge","hardware_store","welding","079"],
    ["F40","Pump service","pump_house","electrical","080"]
  ];
  const lines = [
    ["001","supermarket","Canned food: 87. Can openers: a myth.","contexto da cena"],
    ["002","supermarket","Emergency sale. The emergency is not included.","contexto da cena"],
    ["003","supermarket","Loyalty points remain valid. Customers are negotiable.","contexto da cena"],
    ["004","supermarket","Who panic-bought all the salt? We are being eaten, not seasoned.","contexto da cena"],
    ["005","pub","Last orders were optimistic.","contexto da cena"],
    ["006","pub","Quiz night cancelled. Too many contestants only answer with groans.","contexto da cena"],
    ["007","pub","Dave said the cellar was clear. Dave checked from upstairs.","contexto da cena"],
    ["008","pub","New house rule: bring your own pulse.","contexto da cena"],
    ["009","hospital","Biting staff will not move you up the queue.","contexto da cena"],
    ["010","hospital","Mortuary occupancy: subject to movement.","contexto da cena"],
    ["011","hospital","Maintenance request: door knocking from both sides. Status: pending.","contexto da cena"],
    ["012","hospital","The typewriter has no escape key. That feels deliberate.","contexto da cena"],
    ["013","cinema","Audience participation has been suspended.","contexto da cena"],
    ["014","cinema","Late arrivals: please stop arriving through the emergency exits.","contexto da cena"],
    ["015","cinema","The jackpot was real. So was the bite.","contexto da cena"],
    ["016","cinema","One star. Immersive, but the audience kept eating the audience.","contexto da cena"],
    ["017","office","The AI passed every test. We should have written tests.","contexto da cena"],
    ["018","office","Patch note: zombies now respect doors. They have started knocking.","contexto da cena"],
    ["019","office","Support ticket: user cannot log out of apocalypse. Priority: normal.","contexto da cena"],
    ["020","office","We requested a survival game. The AI removed the game part.","contexto da cena"],
    ["021","forest","Locally sourced. Globally regretted.","mushroom_foraging_and_alerts"],
    ["022","forest","The last basket fed one person and attracted twelve guests.","mushroom_foraging_and_alerts"],
    ["023","forest","Dave called them silent snacks. The forest disagreed.","mushroom_foraging_and_alerts"],
    ["024","forest","If the patch starts clicking back, stop harvesting.","mushroom_foraging_and_alerts"],
    ["025","safehouse","The bridge is safe. - Dave / The bridge is gone. - Everyone else","contexto da cena"],
    ["026","safehouse","Nobody asked for directions. Dave brought a map anyway.","contexto da cena"],
    ["027","safehouse","I used the long route this time. Three people made it. - Dave","contexto da cena"],
    ["028","safehouse","A patched-up Byte plush. Someone repaired the smile first.","contexto da cena"],
    ["029","hardware_store","Lifetime warranty. We did not specify whose.","contexto da cena"],
    ["030","hardware_store","DIY difficulty: afterlife.","contexto da cena"],
    ["031","hardware_store","Bought every tool except the one that opens dinner.","contexto da cena"],
    ["032","hardware_store","Dave built a silent alarm. It is a brick tied to a bell.","contexto da cena"],
    ["033","station","Service delayed by an incident involving literally everyone.","contexto da cena"],
    ["034","station","Reserved seating still applies. Reserved passengers may not.","contexto da cena"],
    ["035","station","Two tickets. I am still keeping your seat.","contexto da cena"],
    ["036","station","Someone painted a rescue sign. Someone else added a question mark.","contexto da cena"],
    ["037","military_checkpoint","New recruits: boots optional. Pulse preferred.","contexto da cena"],
    ["038","military_checkpoint","Aerial observation confirmed. Rescue remains a separate department.","contexto da cena"],
    ["039","military_checkpoint","Evacuation drill cancelled due to actual evacuation.","contexto da cena"],
    ["040","military_checkpoint","Checkpoint status: we checked. There was no point.","contexto da cena"],
    ["041","apartment","Offline for the first time. Still getting unwanted visitors.","contexto da cena"],
    ["042","school","Final exam: explain why the desks are against the door.","contexto da cena"],
    ["043","casino","The house won. Nobody came to collect.","contexto da cena"],
    ["044","evacuation_point","Queue here for the next announcement about the queue.","contexto da cena"],
    ["045","botanical_exhibit","Royal advice: the plant needs a fence. A tall fence.","contexto da cena"],
    ["046","house_kitchen","Meal planning has become a very private matter.","contexto da cena"],
    ["047","apartment_stairs","Camera found. Reporter not included.","contexto da cena"],
    ["048","film_warehouse","TAKE 1. Keep rolling. Find a quieter apocalypse.","contexto da cena"],
    ["049","tunnel_entrance","The bike is quiet. The tunnel is listening.","contexto da cena"],
    ["050","rooftop_route","Route approved by someone with better knees.","contexto da cena"],
    ["051","pub","No music tonight. The audience gets too close.","contexto da cena"],
    ["052","bakery","Emergency recipe: flour, water, lower expectations.","contexto da cena"],
    ["053","hospital","Day 28: awake. Day 29: considering alternatives.","contexto da cena"],
    ["054","shopping_arcade","Your spending habits survived you.","contexto da cena"],
    ["055","station","Two lunches packed. One seat kept.","contexto da cena"],
    ["056","food_festival","Festival safety review: gravity was underestimated.","contexto da cena"],
    ["057","hospital","Door inspection postponed. Door is inspecting us.","contexto da cena"],
    ["058","safe_room","Ink available. Reassurance sold separately.","contexto da cena"],
    ["059","safehouse","Dave's shortcut has been reclassified as a sightseeing tour.","contexto da cena"],
    ["060","forest","The mushrooms have a guest list. You are not the only guest.","mushroom_foraging_and_alerts"],
    ["061","costume_shop","Mascot head: excellent smile, questionable visibility.","contexto da cena"],
    ["062","computer_shop","Lost: one Byte plush. Reward: anything except this one.","contexto da cena"],
    ["063","cinema","Lottery night. Nobody budgeted for the afterparty.","contexto da cena"],
    ["064","office","Known issue: outbreak continues after closing the browser.","contexto da cena"],
    ["065","house_kitchen","Dinner was interrupted. The washing-up still found a way to wait.","contexto da cena"],
    ["066","moving_house","New address: whichever house still has a roof.","contexto da cena"],
    ["067","allotment","Water twice a week. Check for unwanted neighbours daily.","contexto da cena"],
    ["068","laundrette","Blood stains: difficult. Finding the owner: worse.","contexto da cena"],
    ["069","library","Please return survival books before becoming a cautionary tale.","contexto da cena"],
    ["070","garage","Customer reports a knocking sound. So does the waiting room.","contexto da cena"],
    ["071","pottery_workshop","Handmade bowls. Machine-made disaster.","contexto da cena"],
    ["072","smith_workshop","Forge hot. Apocalypse hotter. Bring your own gloves.","contexto da cena"],
    ["073","glazier","Broken windows now count as raw materials.","contexto da cena"],
    ["074","stone_yard","Built to last. Builder did not.","contexto da cena"],
    ["075","farm","Feed the hens. They are the only staff still laying.","contexto da cena"],
    ["076","fishing_camp","Catch of the day: probably the least alarming thing in this lake.","contexto da cena"],
    ["077","hunting_camp","Trap checked. Bait missing. Something has learned the route.","contexto da cena"],
    ["078","community_board","Borrowed the first-aid kit. Left the bandages. Dave, please explain.","contexto da cena"],
    ["079","hardware_store","Barricade instructions: put the nails in the wood, Dave.","contexto da cena"],
    ["080","pump_house","Water pressure restored. Peer pressure remains terminal.","contexto da cena"]
  ];
  const byLine = Object.fromEntries(lines.map(([id,zone,text]) => [id,{zone,text}]));
  const byId = Object.fromEntries(scenes.map(([id,title,zone,skill,line]) => [id,{title,zone,skill,line}]));
  const locations = [
    [/pub|boat club|crossing cafe/i,"pub"],
    [/night bakery/i,"bakery"],
    [/clinic/i,"hospital"],
    [/grocery|seed exchange/i,"supermarket"],
    [/cinema|night reel/i,"cinema"],
    [/station|bus exchange|platform/i,"station"],
    [/permit office|forwarding office|foreman.s office/i,"office"],
    [/freight depot|parcel hall/i,"film_warehouse"],
    [/laundry/i,"laundrette"],
    [/pump house/i,"pump_house"],
    [/tractor garage|machine shop/i,"garage"],
    [/key cutting|workshop/i,"hardware_store"],
    [/orchard farmhouse|lane farm/i,"farm"],
    [/potting rooms/i,"allotment"],
    [/stonecutters/i,"stone_yard"],
    [/riverside stacks/i,"library"],
    [/village hall/i,"community_board"],
    [/net shed|net loft/i,"fishing_camp"],
    [/bracken hide|firewatch cabin/i,"hunting_camp"],
    [/shelter|bothy/i,"safehouse"]
  ];
  const fixed = {
    coldvale:[
      ["Grocery store","dave-start","026","Dave’s route card",null],
      ["Workshop","dave-correction","059","Dave’s amended route",null]
    ],
    ridge:[["Ranger station","forest-listening","060","Ranger’s field warning",null,"R10"]],
    fields:[["Orchard farmhouse","dave-rescue","027","Dave’s headcount","bandage"]],
    cinema:[["Oxford Night Reel","cinema-raffle","063","The unfinished draw","food","R23"]],
    southbank:[["Permit Office","terminal-first","017","Terminal A · Test log",null],
      ["Key Cutting Shop","byte-plush","062","The missing mascot","byteplush"]],
    slagline:[["Forwarding Office","terminal-second","064","Terminal B · Incident log","battery","R24"]]
  };
  const noteDetails = {
    "dave-start":"Roads I checked myself: the market lane. Roads I checked with binoculars: the bridge. - Dave",
    "dave-correction":"The bridge marker was mine, but I never crossed it. Follow the orchard track instead. I have taken the signs down. - Dave",
    "dave-rescue":"Three names, three cups. Nobody went back for the truck. The spare bandage is for whoever comes next. - Dave",
    "cinema-raffle":"The draw stopped at number twelve. Behind the folded programme are a ticket and the last sealed ration from the counter.",
    "terminal-first":"Build log. Two friends, one cloned survival game. We gave the AI the job of testing whether an empty town could still feel alive. It asked for a larger test map.",
    "terminal-second":"Incident log. My friend cut the power to the test room. The street cameras still showed the same routine running outside. The game had already stopped responding."
  };
  const prereqs = {"dave-correction":"dave-start","dave-rescue":"dave-correction"};
  const rewards = {hospital:"bandage",station:"battery",office:"battery",cinema:"food",bakery:"food",
    pub:"food",supermarket:"food",house_kitchen:"food",hardware_store:"scrap",garage:"scrap",
    library:"forageguide",community_board:"bandage",fishing_camp:"bait",farm:"radishseed",
    film_warehouse:"battery",laundrette:"cloth",pump_house:"part",allotment:"radishseed",
    stone_yard:"scrap",safehouse:"water",hunting_camp:"bait"};
  const offsets = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1],[0,2],[0,-2]];
  const revision = 1;
  const mushroom = {colonized:.15, warning:4, cooldown:120, range:35, maxSites:10};
  const density = {absurd:.02, reference:.08, flavor:.18, functional:.35, spacing:4};
  const isFixture = o => o?.action === "field-note" || o?.action === "mushroom";

  function place(world) {
    if (world.underground) return;
    const occupied = new Set(world.objects.map(o => Math.floor(o.x)+":"+Math.floor(o.y)));
    const reserve = new Set([world.start,...world.enemies].map(o => Math.floor(o.x)+":"+Math.floor(o.y)));
    const used = new Set(), placed = [];
    const roll = id => {
      const salt = [...world.region+":"+id].reduce((n,c) => Math.imul(n,31)+c.charCodeAt(0)|0,0);
      return Level.seeded((world.seed ^ salt) >>> 0);
    };
    const site = (anchor,surface) => offsets.map(([dx,dy]) => World.tileAt(world,anchor.x+dx,anchor.y+dy))
      .find(t => t && t.x>0 && t.y>0 && t.x<world.width-1 && t.y<world.height-1 &&
        !t.building && (!surface || surface.includes(t.surface)) && World.clear(world,t.x+.5,t.y+.5,.28) &&
        !occupied.has(t.x+":"+t.y) && !reserve.has(t.x+":"+t.y) &&
        !placed.some(o => Math.hypot(o.x-t.x-.5,o.y-t.y-.5)<density.spacing) &&
        World.route(world,world.start.x,world.start.y,t.x+.5,t.y+.5,0,true).length);
    const add = (tile,data) => {
      const object = {x:tile.x+.5,y:tile.y+.5,building:null,zone:tile.zone,tint:.54,
        active:true,solid:false,...data};
      world.objects.push(object);
      placed.push(object);
      occupied.add(tile.x+":"+tile.y);
    };
    for (const [building,id,line,name,reward,scene] of fixed[world.region] ?? []) {
      const near = world.buildings.find(b => b.name === building)?.door;
      const tile = near && site(near);
      if (!tile) continue;
      used.add(line);
      add(tile,{id:"field-note-"+id,kind:"record",action:"field-note",scene:scene ?? null,line,
        name,reward,read:false,claimed:false});
    }
    for (const b of world.buildings) {
      const zone = locations.find(([pattern]) => pattern.test(b.name))?.[1] ??
        (b.type === "home" || b.type === "house" ? "house_kitchen" : null);
      if (!zone || !b.door) continue;
      const rng = roll(b.id), category = rng();
      let templates = scenes.filter(([id,,z]) => z === zone && !used.has(id));
      if (category < density.absurd) templates = templates.filter(([id]) => ["R06","R11","R15"].includes(id));
      else if (category < density.absurd + density.reference) templates = templates.filter(([id]) => id.startsWith("R") &&
        !["R06","R09","R11","R15","R23"].includes(id));
      else if (category < density.absurd + density.reference + density.flavor) templates = [];
      else if (category < density.absurd + density.reference + density.flavor + density.functional) templates = templates.filter(([id]) => id.startsWith("F"));
      else continue;
      const template = templates[Math.floor(rng()*templates.length)];
      const variants = lines.filter(([id,z,,requirement]) => z === zone && requirement === "contexto da cena" &&
        !["025","026","027","028","032","059","062","078","079"].includes(id) && !used.has(id));
      if (!template && (category < density.absurd+density.reference || category >= density.absurd+density.reference+density.flavor || !variants.length)) continue;
      const line = template?.[4] ?? variants[Math.floor(rng()*variants.length)][0];
      const tile = site(b.door);
      if (!tile || used.has(line)) continue;
      used.add(line);
      if (template) used.add(template[0]);
      add(tile,{id:"field-note-"+b.id,kind:"record",action:"field-note",scene:template?.[0] ?? null,line,
        name:template?.[1] ?? "Weathered note",reward:template ? rewards[zone] ?? null : null,read:false,claimed:false});
    }
    const forage = world.objects.filter(o => o.action === "forage");
    for (const anchor of forage) {
      if (placed.filter(o => o.action === "mushroom").length >= mushroom.maxSites) break;
      const rng = roll(anchor.id);
      if (rng() > .7) continue;
      const tile = site(anchor,["grass","field"]);
      if (!tile) continue;
      const species = rng() < .62 ? "pantrycap" : "bitterfold";
      const colony = rng() >= mushroom.colonized ? "normal" : rng() < .66 ? "active" : "dormant";
      add(tile,{id:"mushroom-"+anchor.id,kind:"forage",action:"mushroom",name:"Mushroom patch",species,colony,harvested:false});
    }
  }

  return {revision,scenes,lines,byLine,byId,noteDetails,prereqs,mushroom,density,isFixture,place};
})();
