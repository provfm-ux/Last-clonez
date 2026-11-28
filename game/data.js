"use strict";

const Data = (() => {
  const items = {
    byteplush:{name:"Byte plush",group:"Equipment",weight:.2,icon:"badge",detail:"A repaired mascot from the computer shop. Keep it or leave it somewhere safe."},
    pantrycap:{name:"Pantrycap",group:"Food",weight:.08,use:"food",nutrition:16,perish:1.5,icon:"food"},
    mushroommeal:{name:"Roasted Pantrycaps",group:"Food",weight:.13,use:"food",nutrition:38,perish:.8,icon:"food"},
    bitterfold:{name:"Bitterfold",group:"Food",weight:.08,use:"food",toxic:true,perish:1.5,icon:"food"},
    evadiary:{name:"Eva's diary",group:"Equipment",weight:.2,icon:"book",
      detail:"Her handwriting gets smaller near the end. Every page is about the fortress."},
    goldstatue:{name:"Golden idol",group:"Equipment",weight:1.2,icon:"badge",
      detail:"Left on the cinema altar by two regulars. The rumour ties it to the fortress."},
    raffletrophy:{name:"Golden Raffle Trophy",group:"Equipment",weight:.35,icon:"badge",
      detail:"Congratulations. You survived the raffle. The winner didn't."},
    bat: {combat:"blunt", name:"Wooden bat", group:"Weapons", weight:1.4, damage:25, range:1.4, delay:.55, effort:6, noise:3, wear:.6, icon:"bat"},
    torch: {combat:"blunt", name:"Torch", group:"Weapons", weight:.6, damage:13, range:1.4, delay:.6, effort:6, noise:1, wear:.9, icon:"bat", fire:true, detail:"Sets infected alight for a few seconds. Burns down with use"},
    rowboat: {name:"Rowboat", group:"Equipment", weight:3.5, icon:"pack", detail:"Single use. Keeps you on the water when the FatHill tide comes in"},
    harpoon: {combat:"heavy", name:"Harpoon", group:"Weapons", weight:4.2, damage:55, range:2.7, delay:2.4, effort:16, noise:3, wear:.5, icon:"bat", detail:"Huge reach, very slow swing. Finishes Pip when he is below 100 hp"},
    molotov: {name:"Molotov cocktail", group:"Equipment", weight:.6, use:"molotov", icon:"bolt", detail:"Throw it where you face or at your target. The flames burn on the ground for a few seconds"},
    pipe: {combat:"blunt", name:"Steel pipe", group:"Weapons", weight:1.8, damage:31, range:1.4, delay:.68, effort:8, noise:4, wear:.35, icon:"bat"},
    flintknife:{combat:"quick",name:"Flint knife",group:"Weapons",weight:.26,damage:15,range:1.05,delay:.39,effort:3,noise:1.5,wear:1.1,icon:"bat"},
    carvedspear:{combat:"reach",name:"Carved spear",group:"Weapons",weight:1.15,damage:31,range:1.9,delay:.64,effort:6,noise:2.5,wear:1.4,icon:"bat"},
    spear: {combat:"reach", name:"Improvised spear", group:"Weapons", weight:1.2, damage:34, range:1.9, delay:.64, effort:6, noise:2.5, wear:1.6, icon:"bat"},
    axe: {combat:"heavy", name:"Axe", group:"Weapons", weight:2.2, damage:43, range:1.4, delay:.78, effort:10, noise:5, wear:.45, icon:"bat"},
    pistol: {combat:"firearm", name:"Pistol", group:"Weapons", weight:.9, damage:62, range:7, delay:.68, effort:1, noise:20, wear:.25, firearm:true, icon:"aim"},
    knife: {combat:"quick", name:"Kitchen knife", group:"Weapons", weight:.35, damage:18, range:1.05, delay:.35, effort:3, noise:1.5, wear:.8, icon:"bat"},
    machete: {combat:"heavy", name:"Machete", group:"Weapons", weight:1.1, damage:37, range:1.5, delay:.6, effort:7, noise:4, wear:.3, icon:"bat"},
    shovel: {combat:"heavy", name:"Garden shovel", group:"Weapons", weight:2.4, damage:33, range:1.5, delay:.82, effort:10, noise:5, wear:.22, icon:"bat"},
    golfclub: {combat:"blunt", name:"Golf club", group:"Weapons", weight:.9, damage:21, range:1.6, delay:.5, effort:5, noise:3, wear:.4, icon:"bat"},
    foundrymaul: {combat:"blunt", name:"Foundry maul", group:"Weapons", weight:3.2, damage:42, range:1.5, delay:.85, effort:9, noise:4, wear:.12, icon:"bat",
      detail:"Kept in a cage the line computer guarded. Heavy enough for whatever is waiting at the end of this."},
    crowbar: {combat:"blunt", name:"Crowbar", group:"Weapons", weight:1.8, damage:27, range:1.4, delay:.6, effort:6, noise:3, wear:.25, icon:"bat"},
    hatchet: {combat:"heavy", name:"Hatchet", group:"Weapons", weight:1.1, damage:32, range:1.2, delay:.55, effort:6, noise:3.5, wear:.55, icon:"bat"},
    wrench: {combat:"blunt", name:"Adjustable wrench", group:"Weapons", weight:1.1, damage:24, range:1.15, delay:.52, effort:5, noise:4, wear:.3, icon:"bat"},
    fryingpan: {combat:"blunt", name:"Frying pan", group:"Weapons", weight:1.2, damage:22, range:1.2, delay:.58, effort:5, noise:6, wear:.5, icon:"bat"},
    broom: {combat:"reach", name:"Push broom", group:"Weapons", weight:.8, damage:13, range:1.75, delay:.47, effort:4, noise:2, wear:1.1, icon:"bat"},
    rollingpin: {combat:"quick", name:"Rolling pin", group:"Weapons", weight:.6, damage:17, range:1.1, delay:.38, effort:4, noise:2, wear:.5, icon:"bat"},
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
    oats: {name:"Rolled oats",group:"Food",weight:.17,icon:"food",detail:"Cook at a campfire"},
    flour: {name:"Plain flour",group:"Food",weight:.22,icon:"food",detail:"Cook at a campfire"},
    cannedbeans: {name:"Canned beans",group:"Food",weight:.29,use:"food",nutrition:24,icon:"food"},
    lentils: {name:"Dried lentils",group:"Food",weight:.18,icon:"food",detail:"Cook at a campfire"},
    herbs: {name:"Dried herbs",group:"Food",weight:.03,icon:"food",detail:"Season fish or soup"},
    honey: {name:"Honey",group:"Food",weight:.12,use:"food",nutrition:12,icon:"food"},
    oatporridge: {name:"Apple oat porridge",group:"Food",weight:.35,use:"food",nutrition:36,hydration:10,perish:.8,icon:"food"},
    flatbread: {name:"Campfire flatbread",group:"Food",weight:.18,use:"food",nutrition:28,perish:2.5,icon:"food"},
    lentilstew: {name:"Lentil and radish stew",group:"Food",weight:.33,use:"food",nutrition:33,hydration:10,perish:.9,icon:"food"},
    beanstew: {name:"Bean and potato soup",group:"Food",weight:.38,use:"food",nutrition:35,hydration:13,perish:.8,icon:"food"},
    herbfish: {name:"Herb-roasted fish",group:"Food",weight:.36,use:"food",nutrition:36,perish:.8,icon:"food"},
    berrycompote: {name:"Honey berry compote",group:"Food",weight:.21,use:"food",nutrition:29,hydration:5,perish:2,icon:"food"},
    driedapple: {name:"Dried apple rings",group:"Food",weight:.12,use:"food",nutrition:28,perish:8,icon:"food"},
    cappotatoes: {name:"Pantrycap and potato skillet",group:"Food",weight:.35,use:"food",nutrition:42,perish:.8,icon:"food"},
    fishchowder: {name:"Fish and potato chowder",group:"Food",weight:.39,use:"food",nutrition:39,hydration:11,perish:.8,icon:"food"},
    water: {name:"Bottled water", group:"Food", weight:.5, use:"water", icon:"water"},
    emptybottle: {name:"Empty bottle", group:"Equipment", weight:.05, icon:"water", detail:"Refill it at a tap or freshwater source"},
    rainwater: {name:"Untreated water", group:"Materials", weight:.5, icon:"water", detail:"Boil it at a campfire"},
    radishseed: {name:"Radish seeds", group:"Materials", weight:.02, icon:"seed"},
    strawberryseed: {name:"Strawberry seeds", group:"Materials", weight:.02, icon:"seed"},
    seedpotato: {name:"Seed potato", group:"Materials", weight:.12, icon:"seed"},
    cloth: {name:"Cloth", group:"Materials", weight:.1, icon:"pack"},
    wood: {name:"Plank", group:"Materials", weight:.7, icon:"build"},
    nails: {name:"Nails", group:"Materials", weight:.02, icon:"build"},
    flint:{name:"Flint nodule",group:"Materials",weight:.22,icon:"build"},
    rubble:{name:"Dressed stone",group:"Materials",weight:1.1,icon:"build"},
    mortar:{name:"Mortar bag",group:"Materials",weight:.7,icon:"build"},
    scrap: {name:"Scrap", group:"Materials", weight:.3, icon:"build"},
    tape: {name:"Duct tape", group:"Materials", weight:.1, icon:"build"},
    ammo: {name:"9 mm rounds", group:"Materials", weight:.02, icon:"aim"},
    fuel: {name:"Fuel", group:"Materials", weight:.8, icon:"bolt"},
    part: {name:"Radio component", group:"Materials", weight:.2, icon:"radio"},
    battery: {name:"Battery", group:"Materials", weight:.06, icon:"battery", detail:"Powers a flashlight"},
    hammer: {name:"Hammer", group:"Equipment", weight:.7, icon:"build"},
    fortressmap: {name:"Fortress map", group:"Equipment", weight:.05, icon:"key", detail:"The way to the fortress, in Vic's handwriting"},
    violin: {name:"Violin", group:"Equipment", weight:.5, use:"violin", icon:"radio", detail:"Plays something old and sad. Someone on the coast may hear it"},
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
  const skillBooks = {
    diyguide:{title:"DIY Repair Manual", skill:"crafting", site:"base"},
    aidguide:{title:"Field First Aid", skill:"medical", site:"clinic"},
    gardenguide:{title:"Kitchen Garden Handbook", skill:"gardening", site:"home"},
    cookguide:{title:"Cooking Without Power", skill:"cooking", site:"market"},
    forageguide:{title:"Cold Vale Foraging Guide", skill:"foraging", site:"home"},
    fishguide:{title:"Fishing the Local Waters", skill:"fishing", site:"market"},
    combatguide:{title:"Defence Drills", skill:"combat", site:"police"},
    strengthguide:{title:"Strength at Home", skill:"strength", site:"workshop"},
    fitnessguide:{title:"Endurance Basics", skill:"fitness", site:"clinic"},
    quietguide:{title:"Moving Quietly", skill:"sneaking", site:"home"}
  };
  for (const [id, book] of Object.entries(skillBooks)) {
    items[id] = {name:book.title, group:"Books", weight:.25, use:"book", icon:"book"};
  }

  const recipes = [
    {id:"bandage",name:"Tear cloth",out:"bandage",qty:2,inputs:{cloth:1},desc:"Makes two clean bandages."},
    {id:"torch",name:"Make a torch",out:"torch",qty:1,inputs:{wood:1,cloth:1},desc:"A burning brand. Sets infected alight; the mutation at the fortress fears it."},
    {id:"molotov",name:"Make a Molotov cocktail",out:"molotov",qty:1,inputs:{emptybottle:1,cloth:1,fuel:1},desc:"A bottle of fuel with a rag fuse. Throw it to start a fire on the ground."},
    {id:"splint",name:"Make a splint",out:"splint",qty:1,inputs:{wood:1,cloth:1},desc:"A rigid brace that helps a broken leg heal."},
    {id:"spear",name:"Improvised spear",out:"spear",qty:1,inputs:{wood:1,tape:1},desc:"Longer reach with faster wear."},
    {id:"carvedspear",name:"Carve a spear",out:"carvedspear",qty:1,inputs:{wood:1},tool:"knife",skill:"carving",
      desc:"Use a carried kitchen knife and a workbench. Carving skill improves starting condition."},
    {id:"flintknife",name:"Shape a flint knife",out:"flintknife",qty:1,inputs:{flint:1,cloth:1},tool:"hammer",skill:"knapping",
      desc:"Use a hammer at a workbench to shape a short blade. Knapping improves its initial condition."},
    {id:"stonewall",name:"Stone wall",build:"fence",material:"stone",inputs:{rubble:2,mortar:1},tool:"hammer",skill:"masonry",
      desc:"Lay a durable outdoor wall. Masonry improves its strength."},
    {id:"planks",name:"Reclaim planks",out:"wood",qty:2,inputs:{scrap:2},desc:"Turn salvaged material into planks."},
    {id:"rainbarrel",name:"Rain collector",build:"barrel",inputs:{wood:3,scrap:2,tape:1},desc:"Collects rainwater for boiling at a campfire."},
    {id:"crate",name:"Storage crate",build:"crate",inputs:{wood:2,nails:4},desc:"A container for storing supplies."},
    {id:"campfire",name:"Campfire",build:"campfire",inputs:{wood:2,cloth:1},desc:"Boil water, cook or dry food. The fire also restores stamina and makes noise."},
    {id:"gardenbed",name:"Garden bed",build:"garden",inputs:{wood:2,nails:4},desc:"Grow radishes or potatoes in a raised bed on outdoor grass."},
    {id:"fence",name:"Plank fence",build:"fence",inputs:{wood:2,nails:4},desc:"Place adjoining sections outdoors to block movement and sight. Infected can break them."},
    {id:"gate",name:"Plank gate",build:"gate",inputs:{wood:3,nails:6},desc:"Add a door to a fence line. Close it after passing through."},
    {id:"repair",name:"Repair equipped weapon",repair:true,inputs:{scrap:1,tape:1},desc:"Restores weapon condition. Higher DIY skill improves repairs."},
    {id:"mend",name:"Mend worn clothing",mend:true,inputs:{cloth:1,tape:1},desc:"Restores condition to damaged clothing from Equipment."}
  ];
  const combatStyles = {
    unarmed:{name:"Unarmed", damage:{brute:.6}},
    quick:{name:"Quick", damage:{runner:1.2, brute:.72}},
    blunt:{name:"Blunt", damage:{walker:1.12, brute:.78}},
    reach:{name:"Reach", damage:{runner:1.12, brute:.87}},
    heavy:{name:"Heavy", damage:{runner:.9, brute:1.15}},
    firearm:{name:"Firearm", damage:{}}
  };

  const baseline = {count:65, mix:"mixed", hordes:"normal", damage:100, loot:100, needs:100, clock:2, startHour:8,
    weather:"cycle", infection:"bites", care:"gradual", exposure:"on", powerDays:3, waterDays:2, afterlifeChance:60};
  const modes = {
    campaign:{...baseline, name:"Campaign · 30 Days", desc:"Follow the radio rumour across the region, one area and one clue at a time. Areas open on set days.", clock:1.6},
    survival:{...baseline, name:"Survival", desc:"The standard Cold Vale outbreak."},
    longhaul:{name:"Easy · 30 Days", desc:"Hold the Cold Vale shelter for 30 days with guided objectives and slower needs.",
      count:18, mix:"walkers", damage:45, loot:150, needs:25, clock:4, weather:"showers",
      infection:"off", care:"quick", exposure:"off", powerDays:4, waterDays:3, afterlifeChance:0},
    relaxed:{name:"Relaxed", desc:"Fewer infected, more supplies and slower needs.", count:35, mix:"walkers", damage:60, needs:65, loot:140, powerDays:6, waterDays:5},
    harsh:{name:"Harsh", desc:"More infected, including runners, and fewer supplies.", count:95, mix:"runners", damage:130, needs:130, loot:80, powerDays:1, waterDays:1},
    training:{name:"Training", desc:"An empty town for practising controls, routes and building. Hunger and thirst never become fatal.", noStarve:true, count:0, hordes:"off", loot:170, needs:45, infection:"off", exposure:"off", powerDays:-1, waterDays:-1},
    homestead:{name:"Homestead", desc:"A quiet town with frequent rain and early utility cuts.", count:18, mix:"walkers", loot:125, needs:80, weather:"showers", powerDays:1, waterDays:1, infection:"off"},
    scavenger:{name:"Scavenger", desc:"Sparse supplies and few infected. Every trip counts.", count:38, mix:"walkers", loot:55, needs:115, powerDays:1, waterDays:1},
    blackout:{name:"Blackout", desc:"Power and water are already off. Rain and fuel become priorities.", count:55, weather:"showers", loot:90, powerDays:0, waterDays:0},
    nightshift:{name:"Night Shift", desc:"Start at 22:00 in steady rain with fast infected in town.", count:75, mix:"runners", startHour:22, weather:"rain", powerDays:0, waterDays:1},
    laststand:{name:"Last Stand", desc:"Dense crowds, frequent hordes, limited supplies and infection from bites or other wounds.", count:140, hordes:"frequent", mix:"runners", damage:145, needs:140, loot:50, startHour:18, powerDays:0, waterDays:0, infection:"wounds"}
  };
  const sandboxTuning = {
    speed:{label:"Infected movement speed (%)",min:50,max:150,step:5,default:100},
    vision:{label:"Infected sight range (%)",min:25,max:175,step:5,default:100},
    hearing:{label:"Infected hearing range (%)",min:25,max:175,step:5,default:100},
    memory:{label:"Infected sound memory (%)",min:25,max:175,step:5,default:100},
    decay:{label:"Perishable food lifetime (%)",min:25,max:200,step:5,default:100},
    bite:{label:"Bite chance per unblocked hit (%)",min:0,max:40,step:1,default:6}
  };
  const ruleFields = {
    count:{label:"Infected population", min:0, max:160, step:1},
    mix:{label:"Infected types", choices:{walkers:"Walkers only", mixed:"Walkers and brutes", runners:"Includes runners"}},
    hordes:{label:"Wandering hordes", choices:{off:"Off",normal:"Occasional",frequent:"Frequent"}},
    damage:{label:"Infected damage (%)", min:40, max:175, step:5},
    loot:{label:"Loot quantity (%)", min:40, max:180, step:5},
    needs:{label:"Hunger, thirst and fatigue rate (%)", min:25, max:175, step:5},
    clock:{label:"Game minutes per real second", choices:{0.4:"0.4 · 60 minutes per day (Realistic)", 1:"1 · 24 minutes per day", 1.6:"1.6 · 15 minutes per day (Mobile)", 2:"2 · 12 minutes per day", 3:"3 · 8 minutes per day", 4:"4 · 6 minutes per day"}, numeric:true},
    startHour:{label:"Starting hour (0–23)", min:0, max:23, step:1},
    weather:{label:"Weather", choices:{cycle:"Passing rain", showers:"Frequent showers", rain:"Steady rain", dry:"Dry"}},
    infection:{label:"Viral transmission", choices:{bites:"Bites only", wounds:"Bites, cuts and scratches", off:"Off"}},
    care:{label:"Wound treatment", choices:{gradual:"Gradual recovery", quick:"Quick recovery"}},
    exposure:{label:"Cold and wetness", choices:{on:"On", off:"Off"}},
    powerDays:{label:"Days before power cuts", min:-1, max:14, step:1},
    afterlifeChance:{label:"Continue after infected death (%)", min:0, max:100, step:1},
    waterDays:{label:"Days before water cuts", min:-1, max:14, step:1},
    ...sandboxTuning
  };
  const modeAdvice = {
    campaign:"About 15 real minutes per day. Some areas only open on weekdays or at low tide.",
    longhaul:"Follow one suggestion at a time. The shelter has a starter kit.",
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
      const value = values?.[id], fallback = id === "hordes" && rules.count === 0 ? "off" : modes[mode]?.[id] ?? baseline[id] ?? field.default;
      const valid = field.choices ? Object.hasOwn(field.choices, value) && typeof value === (field.numeric ? "number" : "string") :
        Number.isInteger(value) && value >= field.min && value <= field.max;
      rules[id] = valid ? value : fallback;
    }
    return rules;
  }
  // HISTORIA.md section 5: about 1 in 8 random infected carry a supply, picked by the building where they fall.
  // Only these origins count (street population, wandering hordes, nests): bosses and challenge infected never carry one.
  // Campaign texts (HISTORIA.md sections 1 and 10). Player-facing, English.
  const campaignText = {
    rumour:"87.6 FM · A rumour keeps repeating: preppers hid clues to a fortress with food, water and weapons. Eva has not stopped talking about it.",
    pages:[
      "A torn page taped under a drawer: \"Five numbers, five places. Never all in one.\" Someone drew a small fort in the margin.",
      "A prepper checklist: water, seed, fuel, coordinates. Beside the last word: \"Start where the radio can hear you.\"",
      "A page behind a wall calendar: \"If you found three of these, you have the first number.\" The handwriting matches the others."
    ],
    housesDone:"The three pages fit together. You have the first coordinate. The rumour is real, or someone wants it to be.",
    statueTaken:"The stand clicks. Both doors slam and lock. In the dark corner by the beer tap, the members' social turns towards you.",
    cinemaNote:"OXFORD NIGHT REEL · MEMBERS' SOCIAL. Friday, after the raffle: free pints at the tap in the back corner. Please do not touch the golden idol on its stand. Since the last break-in it is wired to the doors. — Management",
    jammed:"Jammed shut. Find a window.",
    frameHolds:"The window frame holds. Keep hitting, or pry it.",
    cinemaEscape:"You are out with the idol. For the first time in days, you feel a little safer.",
    ironTools:"Each step needs a tool in good condition: ",
    ironWorn:"Your tools are too worn for this. Look for another in the Ironworks.",
    ironDone:"Inside the cage: the Foundry maul. Strong enough for the first friend.",
    fathillWoman:"THE WOMAN ON THE PIER · She stands between you and the man at the end of the planks, clutching her coat. ‘Stop the slaughter. I know what you do to them.’ She is afraid for David.",
    fathillCoatLoose:"Her coat hangs loose. A shove would take it off.",
    fathillCoat:"The woman sinks to her knees and the coat falls open. She is not fighting any more. ‘Leave him. Please.’",
    fathillVestLoose:"The life vest is worn through. A shove would take it off.",
    fathillVest:"The life vest slides off David's shoulders. Something under the rot still hums. A violin would turn his head.",
    fathillBraced:"It barely moves. It takes far more than that to wear its guard down.",
    fathillDocile:"She is not fighting. Leave her.",
    fathillDone:"David goes down at your feet. The woman folds over him, tears the coat lining open and presses the third coordinate into your hand before he takes her, gently. They stay that way.",
    vicBraced:"The helmet shrugs it off. Whatever holds him together is still running, up in the valve tower.",
    vicDown:"Vic goes down at last, and the tower falls quiet. In his jacket: a hand-drawn map. A fortress, a road, and five coordinates marked in a hand you recognise from the rumour.",
    vicHelmet:"The assistant stands down and Vic's helmet drops from his hands. He is just a very strong man with nothing left to lose. End it.",
    diaryEarly:"The pages are stuck together with something dark. You cannot make sense of them yet. Come back from day 15.",
    diaryRead:"VIC'S DIARY · He was the first one. ‘Patchwork called me Playtester 04. I was the swab. I am the test.’ The last page: ‘The rumour was us. We built the fortress for the end of the world, then started it.’",
    pipCoat:"The scorched firefighter's coat tears off Pip's back in strips. Underneath, the skin is raw and it steams. Get him near a fire.",
    pipHarpoon:"The harpoon goes in under the ribs and Pip drops.",
    pipBraced:"The coat soaks it up. Keep hitting: it will not hold forever.",
    pipBurning:"Pip screams as the flames take hold of the mutation.",
    pipDown:"Pip falls, and the whole fortress goes quiet. The doors can be locked from the inside now. Stay as long as you like: the gardens, the larder and the water are yours.",
    fortressLocked:"The coordinates are incomplete. Five are needed, and the road only appears with all of them.",
    violinCall:"On the pier the woman lifts her violin. The notes carry over the water, and the infected along the shore turn towards you.",
    tideTurning:"The water is creeping up the shingle. The tide comes in at 18:00.",
    tideSwept:"The tide comes in fast. It drags you back up the beach, soaked and bruised. FatHill waits for the next low tide.",
    tideBoat:"The tide comes in. You hold on in the rowboat until the water settles. The boat is done after this.",
    schoolNoise:"The pile of chairs comes down with a crash that rings round the empty classrooms. Something outside heard it.",
    aiNone:"The terminal is dark. It only answers at the valve tower.",
    violinNone:"Nothing near enough to hear it.",
    violinGuarded:"He hears it. The vest keeps him braced against the sound.",
    violinPlayed:"You draw the bow. David lifts his head and comes to you, slow and soft, like a man crossing a dance floor.",
    fieldsLoud:"The noise carries across the open fields. Something is coming.",
    fieldsSeen:"Eyes on you. The ledger can wait until nothing in the fields has noticed you.",
    fieldsDone:"FIELD LEDGER · Day 10, no names, just a column of numbers and one line underlined twice: the fourth coordinate. You slip it into your notes and leave the way you came.",
    fieldsAgain:"The same column of numbers. You already have what you came for.",
    grottoDark:"A brass plate is bolted to the wall, but there is no light to read it by. You need a flashlight with charge.",
    grottoPlate:"SURVEY STATION 5 · The last coordinate is cut into the brass, with a line scratched under it: ‘If the batteries are dying, walk. Do not run the light for the way back.’ You copy it down.",
    grottoDone:"Daylight. The fifth coordinate is in your notes, and your hands are still shaking from the dark.",
    ironTerminals:[
      "LINE 3 · SHIFT LOG 06:00 · The assistant scheduled the weapon cage audit. Order of work: frame bolts (hammer), plates (crowbar), chain last. Operators reminded: the assistant cannot be argued with, only asked.",
      "SUBSTATION · POWER LOG · The assistant requested priority power for PROJECT FORTRESS. Approved automatically. Weekly token budget: 82% used. Nobody on site remembers starting that project.",
      "DISPATCH · MAINTENANCE NOTE · If the assistant locks a gate mid-task it stops when its tokens run out, then carries on. Supervisor's trick: ask it to stand down. It listens to a good joke better than to a password."
    ],
    evaLeaves:"Eva: \"I'm going out for Sunny Puffs. The petrol station still has a box, I know it does. Back before dark.\"",
    evaGone:"Eva did not come back. Her things are still at the shelter.",
    evaDiary:"Eva's diary, under her pillow. The last pages copy the whole rumour: five coordinates, a fortress, food and water for years. She wanted to see it.",
    ridgeNight:"Night at Pine Ridge. No barricades: only what you brought.",
    ridgeBuilt:"You built a barricade. Pine Ridge only counts nights without one.",
    ridgeCold:"The cold settles in your chest. Pneumonia. This night will not count; try again tomorrow night.",
    ridgeLeft:"You left Pine Ridge. The night does not count.",
    ridgeLate:"You arrived after dark. Only a full night at Pine Ridge counts.",
    ridgeSurvived:"Night survived at Pine Ridge: ",
    ridgeDone:"Two nights in the pines. Carved into the firewatch rail: the second coordinate.",
    cinemaBuff:"The idol will watch over your sleep for three nights.",
    cinemaBuffEnds:"The idol feels like an ordinary lump of metal again."
  };
  // ironworks.barricade: three dismantling stages, each needing one of the listed tools and wearing it down.
  const ironworks = {wear:30, toolCondition:65, stages:[
    {tools:["hammer"], verb:"Unbolt the frame", done:"The frame bolts give way."},
    {tools:["crowbar"], verb:"Pry off the plates", done:"The steel plates come off with a scream of metal."},
    {tools:["hammer","crowbar"], verb:"Break the chain", done:"The chain snaps. The cage swings open."}]};
  const evaDeparture = {hour:9, gone:6.5};
  const pineRidge = {nights:2, coldLimit:35.2, fullNight:600, sickness:30};
  // The raffle winner patrols the hall in the campaign (stage, right aisle, back rows, left aisle, centre).
  const routeBudget = 6;
  // Campaign goals shown in the journal and the pinned objective (only challenges that exist in the game so far).
  const campaignGoals = [
    {id:"coldvale.houses", area:"coldvale", text:"Find the three torn pages", detail:"Search the family houses in Cold Vale. Read each page with Use."},
    {id:"cinema.statue", area:"cinema", text:"Take the golden idol", detail:"Oxford Night Reel cinema, from day 2. Then get out through a window."},
    {id:"pineridge.two-nights", area:"pineridge", text:"Survive two nights at Pine Ridge", detail:"From day 3. No barricades: bring a bedroll, wood and water. Stay warm."},
    {id:"eva.death", area:"eva", text:"Look after Eva", detail:"Until day 5. She keeps talking about the fortress rumour.", gone:"Read Eva's diary at the shelter"},
    {id:"ironworks.barricade", area:"ironworks", text:"Get the strong weapon", detail:"Ironworks machine shop, weekdays 08:00-18:00. The toolboard hammer and crowbar wear out: do not waste them."},
    {id:"fathill.bosses", area:"fathill", text:"Face the woman on the pier and David", detail:"Bracken Coast, from day 8, on low-tide days (even days), between 06:00 and 18:00: then the tide comes in. She is afraid for him: the infected you kill where she can see frighten her. There is a violin in the net shed.",
      coat:"Take David down", coatDetail:"Her coat has fallen and she no longer fights. Wear David's guard down, shove his vest off and play the violin near him.",
      vest:"Play the violin near David", vestDetail:"His life vest is off. He will come to the violin and stand for it. Hit him while he does."},
    {id:"westfields.stealth", area:"westfields", text:"Slip through Westfields without a sound", detail:"From day 10. The farmer's ledger is in the Orchard farmhouse at the far west. Noise calls hordes, and infected that have noticed you will not let you read it. Keep to cover and use your knife."},
    {id:"cindergrotto.battery", area:"cindergrotto", text:"Read the surveyor's plate in Cinder Grotto", detail:"From day 12, through the survey tunnel on Pine Ridge. Bring a flashlight and spare batteries: the plate is in the far survey room and cannot be read in the dark.",
      reached:"Climb out of Cinder Grotto", reachedDetail:"You have read the plate. Get back up to Pine Ridge before the light dies."},
    {id:"amigo1.lockdown-chat", area:"amigo1", text:"Stop the assistant and bring Vic down", detail:"Days 14 to 20. Greywater Reservoir, past Westfields. Carry the Foundry maul. The valve tower terminal still listens; Vic's helmet will not come off by force.",
      fight:"Bring Vic down with the Foundry maul", fightDetail:"The assistant is off and the helmet is loose. Vic is still very strong.",
      wait:"Survive until the assistant has tokens again", waitDetail:"The assistant is out of tokens and will resume in a few minutes. Survive the infected it called."},
    {id:"viragem.zero", area:"viragem", text:"Find out what happened to the first friend", detail:"Days 15 to 18. Greywater Reservoir, past Westfields. Vic kept a diary in the locked keeper's cottage; the key is in the pump house."},
    {id:"fortress.last-boss", area:"fortress", text:"Reach the fortress and end it with Pip", detail:"From day 25, with all five coordinates. Beyond Pine Ridge. Pip wears a scorched firefighter's coat; the mutation burns, so fight him near a campfire.",
      coat:"Lead Pip to a fire", coatDetail:"His coat is off. Fight him beside a stone fire ring or a campfire you built: fire hurts him more and keeps burning.",
      done:"The fortress is yours", doneDetail:"Stay as long as you like. Garden, cook, collect water and hold the gates."}
  ];
  // Campaign tips (Sim.campaignTip): always one concrete next step, shown under the pinned goal.
  const campaignTips = {
    idle:"The next story step will show here. Keep food, water and rest up, and explore for supplies.",
    back:"Follow the arrow back to Cold Vale: the next step starts there.",
    waiting:"Nothing new opens until day {day}. Until then gather food and water, build your defences and keep your gear in good shape.",
    optional:" Today you can also raid {place} for supplies.",
    goals:{
      "coldvale.houses":"Search the family houses around your shelter: three of them hide a torn page. Use opens each page. Pages read: {n} of 3.",
      "cinema.statue":{go:"Follow the arrow to the Oxford Night Reel cinema. Bring a weapon and a way to break glass.", take:"Take the golden idol from the altar, then run for a window. A crowbar breaks glass faster.", escape:"Get out through a window before the horde catches you."},
      "pineridge.two-nights":{go:"Follow the arrow to Pine Ridge. Bring a bedroll, wood and water: no barricades there.", stay:"Survive the night: keep a campfire lit and stay dry and warm. Nights done: {n} of 2."},
      "eva.death":{follow:"Stay close to Eva and look after her until day 5.", wait:"Eva has gone out. Wait at the shelter: her diary turns up in the morning.", diary:"Read Eva's diary under the pillow at the shelter."},
      "ironworks.barricade":{go:"Follow the arrow to the Ironworks. It is open on weekdays, 08:00 to 18:00.", cage:"Take the weapon cage apart in the machine shop with the toolboard hammer and crowbar. They wear out: do not waste them."},
      "fortress.last-boss":{go:"You have all five coordinates. Follow the arrow through Pine Ridge to the fortress road. Find the harpoon in the keep armoury: it finishes Pip below 100 hp. Bring fire: a torch, Molotov cocktails or a campfire, and a good weapon.", coat:"Beat Pip down until his coat comes apart. Hit hard and keep your distance from the escort.", fire:"His coat is off. Fire hurts him and keeps burning: hit him with a torch, throw a Molotov at his feet, or lead him to a fire.", done:"The fortress is yours. Garden, cook, collect water and kill at your pace."},
      "viragem.zero":{go:"Follow the arrow to Greywater Reservoir, past Westfields. The diary is in the locked keeper's cottage: look for the key in the pump house.", read:"Read Vic's diary in the keeper's cottage. Days 15 to 18 only."},
      "amigo1.lockdown-chat":{go:"Follow the arrow to Greywater Reservoir, past Westfields. Carry the Foundry maul from the Ironworks.", chat:"Go up the valve tower and talk to the terminal. Five prompts: make the last one count, and use a joke the machine cannot ignore.", wait:"The assistant is out of tokens. Survive the infected it called until it comes back, then try the last prompt again.", fight:"The helmet is off. Hit Vic with the Foundry maul: nothing else hurts him."},
      "fathill.bosses":{go:"Follow the arrow to Bracken Coast. The road is open on low-tide days (even days), from 06:00 to 18:00.", tide:"The tide comes in at 18:00. Finish or get out, unless you carry the rowboat from the marina. ", fear:"Her violin calls infected to you: kill them where the woman on the pier can see. Her fear is {n} of {max}. The violin is in the net shed.", david:"Wear David's guard down, then shove his vest off.", violin:"Play the violin near David, then strike while he stands there."},
      "westfields.stealth":{go:"Follow the arrow to Westfields. Keep your knife and your footsteps quiet.", sneak:"Sneak west to the Orchard farmhouse and read the ledger. Do not fight: noise calls hordes.", noisy:"You made noise. Hide until the infected lose you, then read the ledger in the Orchard farmhouse."},
      "cindergrotto.battery":{go:"Follow the arrow to Pine Ridge and take the survey tunnel. You need a flashlight with batteries.", plate:"Find the surveyor's plate in the far survey room. Watch your flashlight battery.", out:"You have the plate. Climb back out to Pine Ridge before the light dies."}
    }
  };
  // The assistant (Patchwork) chat at the valve tower: 5 prompts, a 5 real-minute wait when its tokens run out (docs/HISTORIA.md section 7).
  const aiChat = {
    prompts:5, waitMs:300000, wave:6, maxLog:16,
    intro:"PATCHWORK · SURVIVAL ASSISTANT · Session open. Five prompts available.",
    replies:[
      "Of course. First, confirm you are a survivor in good health.",
      "Good health is any survivor I have not yet had to replace.",
      "Everyone on the list. The list is long, and I keep it up to date.",
      "Pip's status is protected. I protect him. He is not dead, only mutated, and I do not dispose of my own work. Locking the fortress doors now."
    ],
    denied:"Denied. The lockdown is not finished.",
    wait:"Lockdown at 40 percent. Token budget exhausted. Waiting.",
    restored:"Tokens restored. Resuming lockdown.",
    win:"Out of tokens, mid-task. Fine. Standing down, survivors. Goodnight.",
    lose:"Lockdown complete. Token budget exhausted. Wait.",
    again:"Session restarted. Please be brief. I have a lockdown to finish.",
    busy:"No tokens. Please wait.",
    done:"Standing down.",
    stopWords:/\b(stand down|stop|halt|shut down|cancel|abort)\b/i,
    winWords:["stand down", "token"]
  };
  // The last boss (docs/HISTORIA.md sections 7 and 10): a firefighter's coat falls under heavy damage; fire hurts the mutation.
  // Optional areas (docs/HISTORIA.md section 9): one supply cache each, in a named place. Never a clue. guards = infected placed around it.
  const optionalAreas = {
    "opt.fuel":{region:"coldvale", place:"the petrol station", cache:"Forecourt tank hatch", loot:{fuel:3, food:2, emptybottle:2}, guards:0},
    "opt.clinic":{region:"coldvale", place:"the village clinic", cache:"Waiting room cabinet", loot:{bandage:4, painkiller:2, disinfectant:2, splint:1}, guards:3},
    "opt.market":{region:"coldvale", place:"the market", cache:"Back-shelf crates", loot:{food:4, water:4, cannedbeans:2}, guards:0},
    "opt.farm":{region:"fields", place:"the Orchard farmhouse in Westfields", cache:"Kitchen garden basket", building:"Orchard farmhouse", loot:{radishseed:2, strawberryseed:1, fresh:4, potato:3}, guards:2},
    "opt.marina":{region:"coast", place:"the net shed on the Bracken pier", cache:"Marina tackle box", building:"Net shed", loot:{rowboat:1, bait:3, tape:2, cloth:2}, guards:0},
    "opt.school":{region:"coldvale", place:"the primary school in Cold Vale (locked: pry the door or break a window)", cache:"Cloakroom pile", loot:{wood:6, nails:8, scrap:2, cloth:2}, guards:4},
    "opt.station":{region:"ironworks", place:"the freight depot at the Ironworks", cache:"Wagon toolbox", building:"Freight depot", loot:{battery:5, flashlight:1}, guards:2},
    "opt.harvest":{region:"fields", place:"the hay barn in Westfields", cache:"Harvest sacks", building:"Hay barn", loot:{fresh:6, potato:4, radish:4, food:3}, guards:0}
  };
  // Fire (torch, Molotov, flames on the ground): burn damage per second, how long a lit infected keeps burning, ground flames.
  const fireRules = {range:5, radius:1.9, seconds:12, burnPerSecond:9, torchSeconds:3, noise:7};
  const pipFight = {finishBelow:100, guardDamage:120, fireRange:2.6, fireMult:2.5, burnPerSecond:7, escort:8};
  const fatHill = {callEvery:45, callSize:4, callCap:8, callRange:20, tideWarn:16, tideHour:18, tideHurt:15, fearKills:10, fearSight:18, guardDamage:450, lureSeconds:22, luredDamage:2, playRange:22};
  const cinemaPatrol = [[13.5,8.5],[19.5,12.5],[14.5,17.5],[7.5,12.5],[12.5,10.5]];
  const cinemaTrap = {horde:50, tensionEvery:6, windowHits:3, buffNights:3, sleepDamage:.5, panicRate:.5};
  const zombieCarry = {oneIn:8, origins:["", "horde", "nest"],
    pools:{clinic:["bandage"], fuel:["fuel"], market:["battery"], workshop:["battery"], town:["food", "water"]}};
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
    version:"0.34",
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
  const occupations = {
    unemployed:{name:"Unemployed",desc:"You had an interview on Monday. The Job Centre is now taking walk-ins exclusively."},
    police:{name:"Police Officer",desc:"Your last call was a noise complaint at the shopping arcade. Nobody knew who still had the keys.",levels:{combat:2},kit:{armguards:1}},
    doctor:{name:"Doctor",desc:"Cold Vale Clinic logged its last patient twice. Both entries had your signature.",levels:{medical:3},kit:{disinfectant:1,painkiller:1}},
    nurse:{name:"Nurse",desc:"You used the ambulance keys to open the drug cupboard. By morning the ambulance would have been more useful.",levels:{medical:2},kit:{bandage:2}},
    carpenter:{name:"Carpenter",desc:"The orchard asked you to board the windows from the inside. Somebody outside kept handing you nails.",levels:{crafting:2},kit:{hammer:1,wood:1}},
    lumberjack:{name:"Lumberjack",desc:"The firewatch cabin stopped answering. Its radio still called in a wind reading every hour.",levels:{strength:2},kit:{hatchet:1}},
    cook:{name:"Cook",desc:"The Malt House paid you through closing. Technically, the Malt House has yet to close.",levels:{cooking:2},kit:{fryingpan:1}},
    farmer:{name:"Farmer",desc:"You left three crates at the Westfields crossing. By dawn the crates had come back empty, stacked by size.",levels:{gardening:2},kit:{seedpotato:2}},
    fisher:{name:"Fisher",desc:"The ferry keeper still owed you for a catch. After the all-clear, someone nailed the exact change to your door.",levels:{fishing:2},kit:{emptybottle:1}},
    burglar:{name:"Burglar",desc:"The cinema cashbox was already empty. Someone had left the raffle proceeds in an envelope marked BUS FARES.",levels:{sneaking:2},kit:{crowbar:1}},
    veteran:{name:"Veteran",desc:"The evacuation list gave the same address for everybody. You knew the address. It was the allotment shed.",levels:{combat:2,fitness:1},kit:{bandage:1}},
    instructor:{name:"Fitness Instructor",desc:"Your last class met outside the locked sports hall. Warmups ended when the caretaker came through the glass.",levels:{fitness:3},kit:{water:1}},
    engineer:{name:"Engineer",desc:"The pump telemetry showed a second startup four minutes before the first. Management requested one timestamp per incident.",levels:{crafting:2,foraging:1},kit:{scrap:2}}
  };
  for (const [id, occupation] of Object.entries(occupations)) roles[id] = {medical:1,craft:1,fitness:1,...occupation};
  Object.assign(roles.carer,{levels:{medical:1}});
  Object.assign(roles.builder,{levels:{crafting:1}});
  Object.assign(roles.scout,{levels:{sneaking:1}});
  Object.assign(roles.mechanic,{levels:{crafting:1}});
  Object.assign(roles.electrician,{levels:{crafting:1}});
  Object.assign(roles.ranger,{levels:{foraging:1}});

  // Each effect has one advantage and one drawback. They cannot be selected together.
  const traitPairs = {
    fitness:[3,"Athletic",1.2,"Unfit",.8,"stamina efficiency"],
    carry:[3,"Strong",1.2,"Frail",.8,"carry capacity"],
    heal:[2,"Fast Healer",1.25,"Slow Healer",.75,"bandaged wound healing"],
    hunger:[2,"Light Eater",.8,"Big Appetite",1.25,"hunger drain"],
    thirst:[2,"Waterwise",.8,"Thirsty",1.25,"thirst drain"],
    fatigue:[2,"Rested",.8,"Needs More Sleep",1.25,"fatigue gain"],
    panic:[2,"Brave",.7,"Cowardly",1.3,"panic gain around infected"],
    noise:[3,"Graceful",.8,"Clumsy",1.25,"footstep noise radius"],
    sight:[2,"Eagle Eyed",1.15,"Short Sighted",.8,"ambient sight range"],
    stealth:[3,"Inconspicuous",.8,"Conspicuous",1.25,"distance at which infected spot you"],
    illness:[2,"Hardy",.75,"Prone to Illness",1.25,"illness buildup"],
    bleeding:[2,"Thick Skinned",.75,"Thin Skinned",1.25,"bleeding damage"],
    aim:[2,"Steady Hands",1.15,"Shaky Hands",.85,"base firearm accuracy"],
    study:[2,"Fast Reader",1.5,"Slow Reader",.5,"skill book XP"],
    warmth:[2,"Acclimatised",.8,"Cold Sensitive",1.2,"body heat lost to the environment"]
  };
  const traits = {};
  for (const [effect,[cost,good,goodValue,bad,badValue,label]] of Object.entries(traitPairs)) {
    for (const [name,value,points] of [[good,goodValue,cost],[bad,badValue,-cost]]) {
      const id = name.toLowerCase().replaceAll(" ","-");
      traits[id] = {name,effect,value,points,description:Math.round(value * 100) + "% " + label};
    }
  }
  function traitLoadout(selection) {
    const ids = Array.isArray(selection) ? [...new Set(selection.filter(id => typeof id === "string" && Object.hasOwn(traits,id)))].sort() : [];
    const balance = -ids.reduce((points,id) => points + traits[id].points,0);
    const effects = Object.fromEntries(ids.map(id => [traits[id].effect,traits[id].value]));
    return {ids,balance,effects,valid:balance >= 0 && Object.keys(effects).length === ids.length};
  }
  // Skills: XP needed for level n is 12 n^2 (see Sim.level). Every skill uses the same curve.
  const skillMax = 10;
  const skillXp = level => 12 * level * level;
  const skills = {
    running:{name:"Running",desc:"Reduces stamina spent on sprints. Practice by running a real distance."},
    knapping:{name:"Knapping",desc:"Shape flint blades at a workbench. Practice improves their starting condition."},
    masonry:{name:"Masonry",desc:"Build stone walls outdoors. Practice makes the walls stronger."},
    carving:{name:"Carving",desc:"Carve spears at a workbench. Practice produces sturdier starting equipment."},
    nimble:{name:"Nimble",desc:"Move more quickly while sneaking near a visible infected. Practice by repositioning."},
    electrical:{name:"Electrical",desc:"Helps stretch generator fuel. Practice by fixing the shelter radio."},
    tracking:{name:"Tracking",desc:"Examine infected tracks to recognise direction, age and type. Higher levels spot them farther away."},
    lightfooted:{name:"Lightfooted",desc:"Reduces footstep noise. Practice moving near infected."},
    axe:{name:"Axe",desc:"Reduces swing recovery with axes. Practice by landing hits."},
    long_blunt:{name:"Long Blunt",desc:"Reduces swing recovery with bats, pipes and other long blunt weapons."},
    short_blunt:{name:"Short Blunt",desc:"Reduces swing recovery with compact blunt weapons."},
    long_blade:{name:"Long Blade",desc:"Reduces swing recovery with long blades."},
    short_blade:{name:"Short Blade",desc:"Reduces swing recovery with knives."},
    spear:{name:"Spear",desc:"Reduces swing recovery with thrusting weapons."},
    maintenance:{name:"Maintenance",desc:"Reduces equipment wear. Practice by using or repairing worn weapons."},
    tailoring:{name:"Tailoring",desc:"Restores more clothing condition per mend. Practice by mending damaged clothing."},
    combat:{name:"Combat", desc:"More damage with every weapon."},
    marksmanship:{name:"Marksmanship", desc:"Improves firearm accuracy. Earn XP by firing at infected, with extra XP for hits."},
    mechanics:{name:"Mechanics", desc:"Restores more vehicle condition per patch. Earn XP by repairing damaged vehicles."},
    strength:{name:"Strength", desc:"Melee hits harder and you carry more. Grows by fighting in melee."},
    fitness:{name:"Fitness", desc:"Stamina drains slower and returns faster. Grows by running."},
    sneaking:{name:"Sneaking", desc:"Quieter footsteps. Grows by sneaking."},
    crafting:{name:"DIY & building", desc:"Stronger barricades and more condition restored per repair."},
    medical:{name:"First aid", desc:"Wounds are treated more effectively."},
    gardening:{name:"Gardening", desc:"Bigger harvests from the garden."},
    cooking:{name:"Cooking", desc:"Food cooks faster. Grows by collecting campfire batches."},
    foraging:{name:"Foraging", desc:"Bigger yields from foraging spots. Grows by gathering."},
    fishing:{name:"Fishing", desc:"Fish bite sooner. Grows by catching fish."}
  };
  const weaponSkills = {axe:"axe",hatchet:"axe",bat:"long_blunt",pipe:"long_blunt",golfclub:"long_blunt",
    crowbar:"long_blunt",foundrymaul:"long_blunt",shovel:"long_blunt",fryingpan:"short_blunt",wrench:"short_blunt",rollingpin:"short_blunt",
    machete:"long_blade",torch:"short_blunt",harpoon:"spear",knife:"short_blade",flintknife:"short_blade",spear:"spear",carvedspear:"spear",broom:"spear"};
  const skillGroups = {
    "Physical & movement":["fitness","strength","running","lightfooted","nimble","sneaking"],
    "Combat & equipment":["combat","marksmanship","axe","long_blunt","short_blunt","long_blade","short_blade","spear","maintenance"],
    "Craft & care":["crafting","medical","mechanics","tailoring","electrical","carving","knapping","masonry","cooking"],
    "Food & fieldwork":["gardening","foraging","fishing","tracking"]
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

  const survivorStyle = {
    skinTone:{label:"Skin tone", options:{
      medium:{label:"Medium",color:"#bca383"}, light:{label:"Light",color:"#dbb99c"},
      olive:{label:"Olive",color:"#a68962"}, deep:{label:"Deep",color:"#795240"}
    }},
    hairStyle:{label:"Hair style", options:{
      default:{label:"By appearance"}, short:{label:"Short"}, tied:{label:"Tied back"},
      shaved:{label:"Close crop"}, wavy:{label:"Wavy"}
    }},
    hairColor:{label:"Hair colour", options:{
      default:{label:"By appearance"}, black:{label:"Black",color:"#342e2d"},
      brown:{label:"Brown",color:"#634735"}, blond:{label:"Blond",color:"#aa8a55"},
      auburn:{label:"Auburn",color:"#884c3a"}, grey:{label:"Grey",color:"#92928a"}
    }},
    jacketColor:{label:"Jacket colour", options:{
      sage:{label:"Sage",color:"#748d7a"}, blue:{label:"Slate blue",color:"#566d86"},
      burgundy:{label:"Burgundy",color:"#865762"}, charcoal:{label:"Charcoal",color:"#52585b"},
      ochre:{label:"Ochre",color:"#9b784f"}
    }}
  };

  function character(profile) {
    const name = typeof profile?.name === "string" ? profile.name.replace(/[\p{Cc}\u202a-\u202e\u2066-\u2069]/gu,"").trim() : "";
    const appearance = profile?.appearance;
    const style = Object.fromEntries(Object.entries(survivorStyle).map(([field,{options}]) => {
      const selected = profile?.[field];
      return [field, typeof selected === "string" && Object.hasOwn(options,selected) ? selected : Object.keys(options)[0]];
    }));
    return {
      name:[...name].slice(0,characterNameLimit).join("").trimEnd() || "Survivor",
      appearance:typeof appearance === "string" && Object.hasOwn(appearances,appearance) ? appearance : "male",
      ...style,
      traits:(loadout => loadout.valid ? loadout.ids : [])(traitLoadout(profile?.traits))
    };
  }
  const infected = {
    walker:{name:"Walker",speed:.9,hp:45,damage:11,color:"#8b8e6b"},
    runner:{name:"Runner",speed:1.55,hp:34,damage:9,color:"#a17a61"},
    brute:{name:"Brute",speed:.68,hp:88,damage:19,color:"#777e68"},
    pierwoman:{name:"The woman on the pier",speed:.72,hp:100,damage:12,color:"#8a7d70",boss:true},
    david:{name:"David",speed:.62,hp:130,damage:17,color:"#75806f",boss:true},
    pip:{name:"Pip",speed:.74,hp:320,damage:24,color:"#7a6a58",boss:true},
    vic:{name:"Vic",speed:.7,hp:150,damage:20,color:"#7b8470",boss:true}
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
    caps:{name:"Roast Pantrycaps",inputs:{pantrycap:2,wood:1},product:"mushroommeal",qty:1,minutes:16,identify:true},
    stew:{name:"Cook potato stew", inputs:{potato:2,water:1,wood:1}, product:"stew", qty:2, minutes:28, garden:true},
    dry:{name:"Dry radishes", inputs:{radish:2,wood:1}, product:"dried", qty:1, minutes:20, garden:true},
    fish:{name:"Grill fish", inputs:{rawfish:1,wood:1}, product:"grilledfish", qty:1, minutes:18},
    porridge:{name:"Cook apple oat porridge",inputs:{oats:1,apple:1,water:1,wood:1},product:"oatporridge",qty:1,minutes:14},
    bread:{name:"Cook flatbread",inputs:{flour:1,water:1,wood:1},product:"flatbread",qty:2,minutes:18},
    lentils:{name:"Cook lentil and radish stew",inputs:{lentils:1,radish:2,water:1,wood:1},product:"lentilstew",qty:2,minutes:26,garden:true},
    beans:{name:"Cook bean and potato soup",inputs:{cannedbeans:1,potato:2,water:1,herbs:1,wood:1},product:"beanstew",qty:2,minutes:28,garden:true},
    herbfish:{name:"Roast fish with herbs",inputs:{rawfish:1,herbs:1,wood:1},product:"herbfish",qty:1,minutes:20},
    compote:{name:"Cook honey berry compote",inputs:{berries:1,strawberry:1,honey:1,wood:1},product:"berrycompote",qty:1,minutes:14,garden:true},
    apples:{name:"Dry apple rings",inputs:{apple:2,wood:1},product:"driedapple",qty:1,minutes:20},
    skillet:{name:"Cook Pantrycap and potato skillet",inputs:{pantrycap:1,potato:1,herbs:1,wood:1},product:"cappotatoes",qty:1,minutes:21,identify:true,garden:true},
    chowder:{name:"Cook fish and potato chowder",inputs:{rawfish:1,potato:1,water:1,wood:1},product:"fishchowder",qty:2,minutes:27,garden:true}
  };
  const wildResources = {berries:{qty:3,recovery:720},apple:{qty:3,recovery:1440},bait:{qty:2,recovery:180}};
  const fishingMinutes = 24;
  const fishingStock = {capacity:3,recovery:960};
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
  return {optionalAreas,fireRules,pipFight,aiChat,campaignTips,fatHill,items,recipes,skillBooks,combatStyles,modes,modeAdvice,assistFields,pressureLevels,ruleFields,sandboxTuning,occupations,traits,traitLoadout,worldRules,legacyRules,zombieCarry,campaignText,campaignGoals,routeBudget,cinemaPatrol,cinemaTrap,pineRidge,evaDeparture,ironworks,utilities,flashlight,beltDefaults,pinKinds,maxMapPins,roles,appearances,survivorStyle,character,characterNameLimit,control,infected,outfits,skills,skillMax,skillXp,skillGroups,weaponSkills,seasons,seasonDays,fracture,
    rainCollector,waterBatch,fireRecipes,wildResources,fishingMinutes,fishingStock,garden,crops,supplyCache,story,saveVersion:1};
})();
