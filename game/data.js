"use strict";

const Data = (() => {
  const items = {
    raffletrophy:{name:"Golden Raffle Trophy",group:"Equipment",weight:.35,icon:"badge",
      detail:"Congratulations. You survived the raffle. The winner didn't."},
    bat: {name:"Wooden bat", group:"Weapons", weight:1.4, damage:25, range:1.4, delay:.55, effort:6, noise:3, wear:.6, icon:"bat"},
    pipe: {name:"Steel pipe", group:"Weapons", weight:1.8, damage:31, range:1.4, delay:.68, effort:8, noise:4, wear:.35, icon:"bat"},
    spear: {name:"Improvised spear", group:"Weapons", weight:1.2, damage:34, range:1.9, delay:.64, effort:6, noise:2.5, wear:1.6, icon:"bat"},
    axe: {name:"Axe", group:"Weapons", weight:2.2, damage:43, range:1.4, delay:.78, effort:10, noise:5, wear:.45, icon:"bat"},
    pistol: {name:"Pistol", group:"Weapons", weight:.9, damage:62, range:7, delay:.68, effort:1, noise:20, wear:.25, firearm:true, icon:"aim"},
    knife: {name:"Kitchen knife", group:"Weapons", weight:.35, damage:18, range:1.05, delay:.35, effort:3, noise:1.5, wear:.8, icon:"bat"},
    machete: {name:"Machete", group:"Weapons", weight:1.1, damage:37, range:1.5, delay:.6, effort:7, noise:4, wear:.3, icon:"bat"},
    shovel: {name:"Garden shovel", group:"Weapons", weight:2.4, damage:33, range:1.5, delay:.82, effort:10, noise:5, wear:.22, icon:"bat"},
    golfclub: {name:"Golf club", group:"Weapons", weight:.9, damage:21, range:1.6, delay:.5, effort:5, noise:3, wear:.4, icon:"bat"},
    crowbar: {name:"Crowbar", group:"Weapons", weight:1.8, damage:27, range:1.4, delay:.6, effort:6, noise:3, wear:.25, icon:"bat"},
    hatchet: {name:"Hatchet", group:"Weapons", weight:1.1, damage:32, range:1.2, delay:.55, effort:6, noise:3.5, wear:.55, icon:"bat"},
    wrench: {name:"Adjustable wrench", group:"Weapons", weight:1.1, damage:24, range:1.15, delay:.52, effort:5, noise:4, wear:.3, icon:"bat"},
    fryingpan: {name:"Frying pan", group:"Weapons", weight:1.2, damage:22, range:1.2, delay:.58, effort:5, noise:6, wear:.5, icon:"bat"},
    broom: {name:"Push broom", group:"Weapons", weight:.8, damage:13, range:1.75, delay:.47, effort:4, noise:2, wear:1.1, icon:"bat"},
    rollingpin: {name:"Rolling pin", group:"Weapons", weight:.6, damage:17, range:1.1, delay:.38, effort:4, noise:2, wear:.5, icon:"bat"},
    bandage: {name:"Bandage", group:"Medical", weight:.08, use:"bandage", icon:"cross"},
    disinfectant: {name:"Disinfectant", group:"Medical", weight:.2, use:"disinfectant", icon:"cross"},
    splint: {name:"Splint", group:"Medical", weight:.3, use:"splint", icon:"cross"},
    painkiller: {name:"Painkiller", group:"Medical", weight:.05, use:"painkiller", icon:"cross"},
    food: {name:"Canned food", group:"Food", weight:.4, use:"food", nutrition:32, icon:"food"},
    fresh: {name:"Fresh food", group:"Food", weight:.25, use:"food", nutrition:24, perish:2, icon:"food"},
    berries: {name:"Blackberries", group:"Food", weight:.15, use:"food", nutrition:9, perish:1.1, icon:"food"},
    strawberry: {name:"Strawberries", group:"Food", weight:.16, use:"food", nutrition:12, hydration:4, perish:1.2, icon:"food"},
    apple: {name:"Apple", group:"Food", weight:.2, use:"food", nutrition:14, hydration:5, perish:4, icon:"food"},
    rawfish: {name:"Raw fish", group:"Food", weight:.42, perish:.5, icon:"food", detail:"Grill it over a campfire"},
    grilledfish: {name:"Grilled fish", group:"Food", weight:.34, use:"food", nutrition:31, perish:.8, icon:"food"},
    rod: {name:"Fishing rod", group:"Equipment", weight:.85, icon:"pack", detail:"Bring it and some bait to a fishing spot"},
    bait: {name:"Fishing bait", group:"Materials", weight:.035, icon:"pack"},
    radish: {name:"Radish", group:"Food", weight:.16, use:"food", nutrition:11, perish:1.4, icon:"food"},
    potato: {name:"Potato", group:"Food", weight:.26, perish:4, icon:"food", detail:"Cook it at a campfire"},
    stew: {name:"Bowl of potato stew", group:"Food", weight:.45, use:"food", nutrition:40, hydration:14, perish:.8, icon:"food"},
    dried: {name:"Dried radishes", group:"Food", weight:.18, use:"food", nutrition:25, icon:"food", detail:"Keeps without refrigeration"},
    water: {name:"Bottled water", group:"Food", weight:.5, use:"water", icon:"water"},
    emptybottle: {name:"Empty bottle", group:"Equipment", weight:.05, icon:"water", detail:"Refill it at a tap or freshwater source"},
    rainwater: {name:"Untreated water", group:"Materials", weight:.5, icon:"water", detail:"Boil it at a campfire"},
    radishseed: {name:"Radish seeds", group:"Materials", weight:.02, icon:"seed"},
    strawberryseed: {name:"Strawberry seeds", group:"Materials", weight:.02, icon:"seed"},
    seedpotato: {name:"Seed potato", group:"Materials", weight:.12, icon:"seed"},
    cloth: {name:"Cloth", group:"Materials", weight:.1, icon:"pack"},
    wood: {name:"Plank", group:"Materials", weight:.7, icon:"build"},
    nails: {name:"Nails", group:"Materials", weight:.02, icon:"build"},
    scrap: {name:"Scrap", group:"Materials", weight:.3, icon:"build"},
    tape: {name:"Duct tape", group:"Materials", weight:.1, icon:"build"},
    ammo: {name:"9 mm rounds", group:"Materials", weight:.02, icon:"aim"},
    fuel: {name:"Fuel", group:"Materials", weight:.8, icon:"bolt"},
    part: {name:"Radio component", group:"Materials", weight:.2, icon:"radio"},
    battery: {name:"Battery", group:"Materials", weight:.06, icon:"battery", detail:"Powers a flashlight"},
    hammer: {name:"Hammer", group:"Equipment", weight:.7, icon:"build"},
    flashlight: {name:"Flashlight", group:"Equipment", weight:.24, use:"flashlight", icon:"flashlight"},
    housekey: {name:"House key", group:"Equipment", weight:.02, icon:"key", individual:true, detail:"Opens one house. Read the tag to see which"},
    policekey: {name:"Police station key", group:"Equipment", weight:.02, icon:"key", detail:"Unlocks the front door"},
    backpack: {name:"Hiking backpack", group:"Equipment", weight:.6, use:"backpack", icon:"pack"},
    watch: {name:"Wristwatch", group:"Equipment", weight:.06, slot:"wrist", icon:"clock"},
    raincoat: {name:"Waterproof jacket", group:"Equipment", weight:.55, slot:"body", icon:"badge", warmth:.55,
      detail:"Slows soaking in the rain and helps retain warmth"},
    armguards: {name:"Forearm guards", group:"Equipment", weight:.35, slot:"arms", icon:"badge", guard:.25,
      detail:"Reduce damage from arm hits by 25% and often stop the wound"},
    beanie: {name:"Wool beanie", group:"Equipment", weight:.1, slot:"head", icon:"badge", warmth:.3,
      detail:"Keeps your head warm in the cold"},
    gloves: {name:"Work gloves", group:"Equipment", weight:.2, slot:"hands", icon:"badge", warmth:.15, guard:.08,
      detail:"Warmer hands and a little protection from arm hits"},
    wintercoat: {name:"Winter coat", group:"Equipment", weight:1.3, slot:"body", icon:"badge", warmth:.85, guard:.12,
      detail:"Much warmer than a jacket and softens arm hits. Not waterproof"},
    jeans: {name:"Jeans", group:"Equipment", weight:.6, slot:"legs", icon:"badge", warmth:.2, guard:.12,
      detail:"Soften leg hits and keep you a little warmer"},
    boots: {name:"Hiking boots", group:"Equipment", weight:.8, slot:"feet", icon:"badge", warmth:.15, guard:.08,
      detail:"Warm feet and some protection from leg hits"}
  };
  const recipes = [
    {id:"bandage",name:"Tear cloth",out:"bandage",qty:2,inputs:{cloth:1},desc:"Makes two clean bandages."},
    {id:"splint",name:"Make a splint",out:"splint",qty:1,inputs:{wood:1,cloth:1},desc:"A rigid brace that helps a broken leg heal."},
    {id:"spear",name:"Improvised spear",out:"spear",qty:1,inputs:{wood:1,tape:1},desc:"Longer reach with faster wear."},
    {id:"planks",name:"Reclaim planks",out:"wood",qty:2,inputs:{scrap:2},desc:"Turn salvaged material into planks."},
    {id:"rainbarrel",name:"Rain collector",build:"barrel",inputs:{wood:3,scrap:2,tape:1},desc:"Collects rainwater for boiling at a campfire."},
    {id:"crate",name:"Storage crate",build:"crate",inputs:{wood:2,nails:4},desc:"A container for storing supplies."},
    {id:"campfire",name:"Campfire",build:"campfire",inputs:{wood:2,cloth:1},desc:"Boil water, cook or dry food. The fire also restores stamina and makes noise."},
    {id:"gardenbed",name:"Garden bed",build:"garden",inputs:{wood:2,nails:4},desc:"Grow radishes or potatoes in a raised bed on outdoor grass."},
    {id:"fence",name:"Plank fence",build:"fence",inputs:{wood:2,nails:4},desc:"Place adjoining sections outdoors to block movement and sight. Infected can break them."},
    {id:"gate",name:"Plank gate",build:"gate",inputs:{wood:3,nails:6},desc:"Add a door to a fence line. Close it after passing through."},
    {id:"repair",name:"Repair equipped weapon",repair:true,inputs:{scrap:1,tape:1},desc:"Restores 35 points of weapon condition."}
  ];
  const baseline = {count:65, mix:"mixed", hordes:"normal", damage:100, loot:100, needs:100, clock:2, startHour:8,
    weather:"cycle", infection:"bites", care:"gradual", exposure:"on", powerDays:3, waterDays:2, afterlifeChance:60};
  const modes = {
    survival:{...baseline, name:"Survival", desc:"The standard Cold Vale outbreak."},
    relaxed:{name:"Relaxed", desc:"Fewer infected, more supplies and slower needs.", count:35, mix:"walkers", damage:60, needs:65, loot:140, powerDays:6, waterDays:5},
    harsh:{name:"Harsh", desc:"More infected, including runners, and fewer supplies.", count:95, mix:"runners", damage:130, needs:130, loot:80, powerDays:1, waterDays:1},
    training:{name:"Training", desc:"An empty town for practising controls, routes and building. Hunger and thirst never become fatal.", noStarve:true, count:0, hordes:"off", loot:170, needs:45, infection:"off", exposure:"off", powerDays:-1, waterDays:-1},
    homestead:{name:"Homestead", desc:"A quiet town with frequent rain and early utility cuts.", count:18, mix:"walkers", loot:125, needs:80, weather:"showers", powerDays:1, waterDays:1, infection:"off"},
    scavenger:{name:"Scavenger", desc:"Sparse supplies and few infected. Every trip counts.", count:38, mix:"walkers", loot:55, needs:115, powerDays:1, waterDays:1},
    blackout:{name:"Blackout", desc:"Power and water are already off. Rain and fuel become priorities.", count:55, weather:"showers", loot:90, powerDays:0, waterDays:0},
    nightshift:{name:"Night Shift", desc:"Start at 22:00 in steady rain with fast infected in town.", count:75, mix:"runners", startHour:22, weather:"rain", powerDays:0, waterDays:1},
    laststand:{name:"Last Stand", desc:"Dense crowds, frequent hordes, limited supplies and infection from bites or other wounds.", count:140, hordes:"frequent", mix:"runners", damage:145, needs:140, loot:50, startHour:18, powerDays:0, waterDays:0, infection:"wounds"}
  };
  const ruleFields = {
    count:{label:"Infected population", min:0, max:160, step:1},
    mix:{label:"Infected types", choices:{walkers:"Walkers only", mixed:"Walkers and brutes", runners:"Includes runners"}},
    hordes:{label:"Wandering hordes", choices:{off:"Off",normal:"Occasional",frequent:"Frequent"}},
    damage:{label:"Infected damage (%)", min:40, max:175, step:5},
    loot:{label:"Loot quantity (%)", min:40, max:180, step:5},
    needs:{label:"Hunger, thirst and fatigue rate (%)", min:25, max:175, step:5},
    clock:{label:"Game minutes per real second", choices:{1:"1 · 24 minutes per day", 2:"2 · 12 minutes per day", 3:"3 · 8 minutes per day", 4:"4 · 6 minutes per day"}, numeric:true},
    startHour:{label:"Starting hour (0–23)", min:0, max:23, step:1},
    weather:{label:"Weather", choices:{cycle:"Passing rain", showers:"Frequent showers", rain:"Steady rain", dry:"Dry"}},
    infection:{label:"Viral transmission", choices:{bites:"Bites only", wounds:"Bites, cuts and scratches", off:"Off"}},
    care:{label:"Wound treatment", choices:{gradual:"Gradual recovery", quick:"Quick recovery"}},
    exposure:{label:"Cold and wetness", choices:{on:"On", off:"Off"}},
    powerDays:{label:"Days before power cuts", min:-1, max:14, step:1},
    afterlifeChance:{label:"Continue after infected death (%)", min:0, max:100, step:1},
    waterDays:{label:"Days before water cuts", min:-1, max:14, step:1}
  };
  const modeAdvice = {
    relaxed:"For learning controls and exploring.",
    survival:"For a first full survival run.",
    harsh:"For players comfortable fleeing fast infected.",
    training:"For practising routes, looting and building.",
    homestead:"For gardening and managing utilities.",
    scavenger:"For planning supply trips with little margin.",
    blackout:"For managing light, water and fuel from day one.",
    nightshift:"For players comfortable navigating in darkness and rain.",
    laststand:"For experienced players seeking sustained pressure."
  };
  const assistFields = {
    windup:"Longer warning before infected attacks",
    grabs:"Shorter grabs",
    bleed:"Less damage from bleeding",
    reminder:"Bandage reminder",
    stamina:"Lower stamina costs"
  };
  const pressureLevels = {low:.8, standard:1, high:1.2};
  function worldRules(mode, values) {
    const rules = {};
    for (const [id, field] of Object.entries(ruleFields)) {
      const value = values?.[id], fallback = id === "hordes" && rules.count === 0 ? "off" : modes[mode]?.[id] ?? baseline[id];
      const valid = field.choices ? Object.hasOwn(field.choices, value) && typeof value === (field.numeric ? "number" : "string") :
        Number.isInteger(value) && value >= field.min && value <= field.max;
      rules[id] = valid ? value : fallback;
    }
    return rules;
  }
  const legacyRules = {care:"quick", exposure:"off", powerDays:-1, waterDays:-1};
  const utilities = {tapReserve:5, generatorCapacity:960, minutesPerFuel:240, generatorRange:10, noiseInterval:8};
  const flashlight = {capacity:180, starter:42, range:10, angle:.59};
  const beltDefaults = ["bat", "bandage", "water", "flashlight"];
  const pinKinds = {
    supply:{name:"Supplies", color:"#92d2a0"}, danger:{name:"Danger", color:"#ee8e78"},
    camp:{name:"Shelter", color:"#82bcca"}, note:{name:"Note", color:"#e4c47c"}
  };
  const maxMapPins = 64;
  const control = {
    version:"0.33",
    seed:17,
    starts:{
      shelter:{name:"Shelter", detail:"Start indoors by the supplies crate. Test the garden, campfire and rain collector."},
      clinic:{name:"Clinic entrance", type:"clinic", detail:"Start outside the clinic. Find Eva and test medical supplies and rescue."},
      market:{name:"Grocery store entrance", type:"market", detail:"Start outside the grocery store. Test scavenging, inventory and carrying limits."},
      workshop:{name:"Workshop yard", type:"workshop", detail:"Start near the workshop entrance. Look for tools, scrap and radio components."},
      police:{name:"Police station entrance", type:"police", detail:"Start outside the station. Check the nearby car boot for a key, or look for a window."},
      fuel:{name:"Petrol station forecourt", type:"fuel", detail:"Start by the forecourt. Search for fuel and get the shelter generator running."}
    }
  };
  const roles = {
    carer:{name:"Carer",desc:"More effective wound treatment. Starts with disinfectant.",medical:1.35,craft:1,fitness:1,kit:{disinfectant:1}},
    builder:{name:"Builder",desc:"Stronger barricades. Starts with a hammer, planks and nails.",medical:1,craft:1.4,fitness:1,kit:{wood:2,nails:8,hammer:1}},
    scout:{name:"Scout",desc:"Quieter footsteps and less effort when running.",medical:1,craft:1,fitness:1.25},
    mechanic:{name:"Mechanic",desc:"Repairs more vehicle damage per patch. Starts with scrap and tape.",medical:1,craft:1,fitness:1,vehicleRepair:42,kit:{scrap:2,tape:1}},
    electrician:{name:"Electrician",desc:"Flashlight batteries last longer. Starts with two spare batteries.",medical:1,craft:1,fitness:1,lampDrain:.7,kit:{battery:2}},
    ranger:{name:"Ranger",desc:"Finds more food and bait when foraging. Starts with an empty bottle.",medical:1,craft:1,fitness:1,forageBonus:1,kit:{emptybottle:1}}
  };
  // Skills: XP needed for level n is 12 n^2 (see Sim.level). Every skill uses the same curve.
  const skillMax = 10;
  const skillXp = level => 12 * level * level;
  const skills = {
    combat:{name:"Combat", desc:"More damage with every weapon."},
    strength:{name:"Strength", desc:"Melee hits harder and you carry more. Grows by fighting in melee."},
    fitness:{name:"Fitness", desc:"Stamina drains slower and returns faster. Grows by running."},
    sneaking:{name:"Sneaking", desc:"Quieter footsteps. Grows by sneaking."},
    crafting:{name:"Building", desc:"Stronger barricades and better repairs."},
    medical:{name:"First aid", desc:"Wounds are treated more effectively."},
    gardening:{name:"Gardening", desc:"Bigger harvests from the garden."},
    cooking:{name:"Cooking", desc:"Food cooks faster. Grows by collecting campfire batches."},
    foraging:{name:"Foraging", desc:"Bigger yields from foraging spots. Grows by gathering."},
    fishing:{name:"Fishing", desc:"Fish bite sooner. Grows by catching fish."}
  };
  // Seasons last `seasonDays` days each. `chill` lowers the outdoor body-temperature target; `grow` scales crop growth.
  const seasonDays = 7;
  const seasons = [
    {id:"spring", name:"Spring", short:"SPR", chill:0, grow:1.1},
    {id:"summer", name:"Summer", short:"SUM", chill:-.35, grow:1.25},
    {id:"autumn", name:"Autumn", short:"AUT", chill:.3, grow:.9},
    {id:"winter", name:"Winter", short:"WIN", chill:.9, grow:.45}
  ];
  // A broken leg heals in `healMinutes` of game time when splinted (a quarter as fast without a splint).
  const fracture = {healMinutes:4320, splintSpeed:.75, brokenSpeed:.4, unsplintedHeal:.25};
  const characterNameLimit = 28;
  const appearances = {male:"Man",female:"Woman"};

  function character(profile) {
    const name = typeof profile?.name === "string" ? profile.name.replace(/[\p{Cc}\u202a-\u202e\u2066-\u2069]/gu,"").trim() : "";
    const appearance = profile?.appearance;
    return {
      name:[...name].slice(0,characterNameLimit).join("").trimEnd() || "Survivor",
      appearance:typeof appearance === "string" && Object.hasOwn(appearances,appearance) ? appearance : "male"
    };
  }
  const infected = {
    walker:{name:"Walker",speed:.9,hp:45,damage:11,color:"#8b8e6b"},
    runner:{name:"Runner",speed:1.55,hp:34,damage:9,color:"#a17a61"},
    brute:{name:"Brute",speed:.68,hp:88,damage:19,color:"#777e68"}
  };
  const outfits = {
    plain:{},
    watch:{shirt:"#8d7772", item:"watch"},
    medic:{shirt:"#9baf9e", item:"bandage"},
    worker:{shirt:"#a58a5a", item:"pipe"},
    patrol:{shirt:"#617f84", item:"armguards"},
    hiker:{shirt:"#8a9c70", item:"backpack"}
  };
  const rainCollector = {capacity:100, bottleVolume:25, rate:1.25, legacyRate:.35};
  const waterBatch = {name:"Boil water", inputs:{rainwater:2,wood:1}, product:"water", qty:2, minutes:24};
  const fireRecipes = {
    water:waterBatch,
    stew:{name:"Cook potato stew", inputs:{potato:2,water:1,wood:1}, product:"stew", qty:2, minutes:28},
    dry:{name:"Dry radishes", inputs:{radish:2,wood:1}, product:"dried", qty:1, minutes:20},
    fish:{name:"Grill fish", inputs:{rawfish:1,wood:1}, product:"grilledfish", qty:1, minutes:18}
  };
  const wildResources = {berries:{qty:2,recovery:720},apple:{qty:2,recovery:1440},bait:{qty:2,recovery:180}};
  const fishingMinutes = 24;
  const garden = {water:72, minMoisture:18, rainRate:1.12, emptyDryRate:.25, dutyInterval:15, shelterRange:6, collectorRange:4};
  const crops = {
    radish:{name:"Radishes", seed:"radishseed", product:"radish", qty:3, minutes:84, dryRate:.55},
    potato:{name:"Potatoes", seed:"seedpotato", product:"potato", qty:4, minutes:156, dryRate:.48},
    strawberry:{name:"Strawberries", seed:"strawberryseed", product:"strawberry", qty:3, minutes:130, dryRate:.52}
  };
  const supplyCache = {bandage:2,water:2,food:1};
  const story = {
    market: {
      field:true, title:"One tin per customer", source:"Grocery store · checkout notice", time:"11 October 2028 · 18:10",
      text:"One tin per customer. A man in a bus driver's uniform went round three times. The till printed the same name every time. On his third lap we noticed he was dead. The loyalty scheme is suspended until further notice."
    },
    clinic: {
      field:true, title:"Eva’s triage board", source:"Clinic · Eva", time:"11 October 2028 · 22:05",
      text:"The first patients came in from the bus depot. Two died and got back up. I sent the walking wounded home. Someone added a column to the board marked ‘Walking, previously dead’. I’m leaving it there."
    },
    police: {
      field:true, title:"Incident 041", source:"Police station · call log", time:"12 October 2028 · 00:35",
      text:"Caller reports a neighbour eating a wheelie bin. Caller wants to know if this counts as fly-tipping. Update at 00:49. We’re moving the remaining crew to the water tower. Keep 87.6 FM clear."
    },
    fuel: {
      field:true, title:"Fuel for generators", source:"Petrol station · handwritten sign", time:"12 October 2028 · 04:10",
      text:"Bypass blocked. Save the fuel for generators and anyone getting people out. Dave, that’s a stamp card for the car wash. It has never been legal tender."
    },
    workshop: {
      field:true, title:"A working aerial", source:"Workshop · Mara’s note", time:"12 October 2028 · 06:05",
      text:"We’ve got a working aerial up at the water tower. Patch your radio, fuel the generator and call on 87.6. I left spare components in the drawer marked MISC. You’ll notice every drawer is marked MISC. That one's on me."
    },
    shelter: {
      field:true, title:"Back before breakfast", source:"Shelter crate · Eva’s note", time:"12 October 2028 · 06:50",
      text:"I put the planks, nails and tape in the crate. I’m going back to the clinic. If you get home first, shut the door. If you get the radio working, put the kettle on. In that order, please."
    },
    opening: {
      title:"The last public broadcast", source:"87.6 FM · Cold Vale Community Radio", time:"12 October 2028 · 07:46",
      text:"Cold Vale, this is 87.6 FM. The bus depot has been closed since midnight. If someone who died stands up again, shut the door. The council’s message about restarting the test was left over from yesterday. Please stop calling about bin collection."
    },
    reply: {
      title:"Someone answers", source:"87.6 FM · Water Tower Relay", time:"After your broadcast",
      text:"Shelter, this is Mara at the water tower. We heard you. There are three of us up here if you count the pigeon. I left supplies in the petrol station cupboard. Let me know when you’re back. If Eva’s with you, tell her we’re saving her a mug."
    },
    checkin: {
      title:"Back in one piece", source:"87.6 FM · Water Tower Relay", time:"After the supply run",
      text:"Good to hear your voice. Keep the supplies. I’d put you on the rota, but the pigeon ate the corner with your name on it."
    }
  };
  return {items,recipes,modes,modeAdvice,assistFields,pressureLevels,ruleFields,worldRules,legacyRules,utilities,flashlight,beltDefaults,pinKinds,maxMapPins,roles,appearances,character,characterNameLimit,control,infected,outfits,skills,skillMax,skillXp,seasons,seasonDays,fracture,
    rainCollector,waterBatch,fireRecipes,wildResources,fishingMinutes,garden,crops,supplyCache,story,saveVersion:1};
})();
