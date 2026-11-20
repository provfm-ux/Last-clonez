"use strict";

const Chronicle = (() => {
  const title = "The Second All-Clear";
  const revision = 5, dispatchDelay = 24, tideCycle = 156, lowTide = 52;
  const deskId = "ledger-desk";
  const leads = {
    coldvale:"The grocery store kept printing collection slips after it shut.",
    ridge:"A duty crew recorded signals at the firewatch cabin.",
    ironworks:"The freight depot should still have its passenger tally.",
    coast:"The coastguard logged each arrival and false alarm.",
    fields:"A farm family wrote down its own way to tell who was at the door.",
    quarry:"The foreman kept a second shift record beside the weighbridge.",
    reservoir:"Follow the spillway to the valve tower. Someone scratched a warning inside.",
    lighthouse:"The boat shed at Gull Point kept a second copy of the keeper’s watch.",
    cinema:"The ticket booth and projection booth kept separate records of the last screening.",
    cavern:"Follow the winch and survey rooms to the final shutdown console."
  };
  const entries = {
    receipt:{region:"coldvale", at:["market",5,3], title:"Uncollected till roll", source:"Grocery store", time:"06:12 and 06:32",
      text:"The doors had been locked since six. At 06:12 the till offered the same order to a boy who was no longer there. At 06:32 it printed his name again. Ada took the boy to her orchard before dawn. The receipt still lists him as collected under R7.",
      lead:"The civil defence desk needs a second record of R7. Check what the freight crew was counting."},
    checkout:{region:"coldvale", at:["market",6,7], title:"Service flap", source:"Grocery store", needs:["receipt","tally"],
      action:"Check the R7 compartment", locked:"Find the till roll and compare R7 with the freight tally.",
      text:"Someone left two parcels under the till. The paper record claimed both had been collected. You found the spare parcel still in its slot.",
      reward:{food:2,cloth:1,battery:1}, cache:"Unclaimed collection parcel"},
    payphone:{region:"coldvale", at:["clinic",4,10], title:"Clinic call box", source:"Clinic forecourt", needs:["watch"],
      action:"Play back the last call", locked:"The call box recorder needs a reference time. Try the firewatch duty slip.",
      noise:9,
      text:"A dispatcher repeated the announcement in a practised voice. Between takes you hear him ask whether anyone is actually watching the road. The last tape clicks off before the answer.",
      lead:"A technician at the substation marked the matching reel with a red stripe."},
    watch:{region:"ridge", at:["Firewatch cabin",7,2], title:"Firewatch duty slip", source:"Firewatch cabin", time:"06:12",
      text:"The duty officer recorded an all-clear at 06:12. The forest gate stayed shut. No lights crossed the ridge. She logged a second broadcast twenty minutes later, with a cough in exactly the same place.",
      lead:"Use a second time source to identify the live circuit at the ranger station."},
    relay:{region:"ridge", at:["Ranger station",7,11], title:"Ranger relay box", source:"Ranger station", needs:["watch","receipt"],
      action:"Test the isolated relay", locked:"Compare the duty slip with an independent time stamp from Cold Vale.", noise:12,
      text:"The automatic line plays the same announcement on a loop. The test sends a brief chime down a separate live line to Ironworks and the coast. The old supply circuit still has charge.",
      reward:{battery:2,bandage:1}, cache:"Ranger maintenance pouch", lead:"The two live outlets can carry one authorised call from the civil defence desk."},
    cairn:{region:"ridge", at:[28,48], title:"Stone trail marker", source:"Creek path", needs:["cellar"],
      action:"Compare the scratched marks", locked:"The marks look like a sequence. Someone in Westfields used a private signal.",
      text:"The scratches come in groups of three and one. A crew from Westfields left a box beneath the trail marker and scratched directions to a source of clean water after boiling.",
      reward:{emptybottle:2,wood:2}, cache:"Trail marker cache"},
    tally:{region:"ironworks", at:["Freight depot",9,10], title:"Passenger tally", source:"Freight depot", time:"06:32",
      text:"Twelve cleared. Eddie wrote in the margin that the counter was wired to the axles. He sealed the front carriage when a man inside answered to every name he called. R7 is the switch circuit. Eddie took the real passenger list when he jumped.",
      lead:"The freight horn has an isolation switch near the depot."},
    horn:{region:"ironworks", at:[70,34], title:"Freight horn cabinet", source:"Freight sidings", needs:["tally","relay"],
      action:"Test the freight circuit", locked:"Find the passenger tally and test the separate live line at the ranger station.", noise:22,
      text:"The short test makes loose bolts vibrate in the cabinet. The eastern sidings receive the signal. If the desk sends a full call, the infected near the machine shop will follow the horn.",
      lead:"This verifies the freight option on the civil defence desk."},
    infirmary:{region:"ironworks", at:["Power substation",8,5], title:"Red-striped reel case", source:"Power substation", needs:["payphone","tally"],
      action:"Open the field infirmary case", locked:"Match the call box recording with the freight departure time.",
      text:"Two technicians noted that the unresponsive still turned at the sound of the old shift bell. Their testing stopped mid-page. Someone took the stretcher and left the first-aid case.",
      reward:{bandage:2,disinfectant:1,part:1}, cache:"Field infirmary kit"},
    tidebook:{region:"coast", at:["Coastguard station",6,4], title:"Coastguard arrival book", source:"Coastguard station", time:"06:12–07:10",
      text:"The station received two orders to clear the shore. The watch wrote that no vessel arrived. A family from Westfields checked in with three knocks, a pause, then one. An officer left a coast key in the washbox under the pier.",
      lead:"Look near the fishing pier at low tide. The family's signal may still work inland."},
    washbox:{region:"coast", at:[25,68], title:"Pier washbox", source:"Old fishing pier", needs:["tidebook"], window:"tide",
      action:"Recover the coast key", locked:"Read the coastguard arrival book to identify the sealed box.",
      text:"The water falls below the box. The key releases and the label shows a breakwater foghorn circuit. The people on the beach would hear it. So would the infected near the station.",
      reward:{bait:3,water:1}, cache:"Washbox supplies", lead:"This verifies the breakwater option on the civil defence desk."},
    lantern:{region:"coast", at:["Weather hut",5,3], title:"Shuttered signal lantern", source:"Weather hut", needs:["tidebook","relay"], window:"night",
      action:"Flash the agreed pattern", locked:"Compare the watch's notes with a tested live relay.",
      text:"A single green flash answers from the ridge. The receiver is still awake. The watch left an emergency bag behind the shutter for the next runner.",
      reward:{raincoat:1,battery:2}, cache:"Weather watch bag"},
    cellar:{region:"fields", at:["Orchard farmhouse",5,4], title:"Note on a flour sack", source:"Orchard farmhouse", time:"07:10",
      text:"The speaker used my son’s name. He was asleep beside me. From now on, three knocks, wait, then one. Ellis knows the signal and has a truck near the shore. If you reach him first, tell him we’re still here. · Ada",
      lead:"The hatch at the field cottage still has an answer, if the coastguard heard the same signal."},
    reply:{region:"fields", at:["Field cottage",3,9], title:"Field cellar hatch", source:"Field cottage", needs:["cellar","tidebook"],
      action:"Knock three, pause, then one", locked:"Confirm the family's knock with the coastguard record.",
      text:"You lift the hatch after the signal. The family left a folded note beneath the latch. They moved to the orchard edge and asked for one live diversion before attempting another crossing.",
      reward:{bandage:1,seedpotato:2,food:1}, cache:"Cellar provisions", lead:"The family confirms the call. Return to the civil defence desk when you have a verified route."},
    pantry:{region:"fields", at:["Hay barn",10,6], title:"Taped pantry door", source:"Hay barn", needs:["cellar","payphone"],
      action:"Check the village shelter list", locked:"The clinic's recorded announcement names this family's fallback shelter.",
      text:"The plan says to sit down for a drink until someone calls last orders. A farmer crossed out the pub and moved its reserve food to the barn. The list is still taped over the supplies.",
      reward:{food:2,water:1,radishseed:2}, cache:"Village reserve"},
    dogbowl:{region:"coldvale", at:["Your shelter",10,6], title:"Blue dog bowl", source:"Shelter radio alcove", extra:true, style:"dogbowl",
      text:"A teeth-marked blue bowl sits beside the radio cables. Under it, someone scratched an instruction for the relief operator. If the feed runs out, the rest is under the firewatch steps.",
      lead:"Look under the firewatch steps on Pine Ridge."},
    firewatchstash:{region:"ridge", at:["Firewatch cabin",2,10], title:"Firewatch step", source:"Firewatch cabin", extra:true, needs:["dogbowl"],
      action:"Check under the step", locked:"The fasteners are marked with the same blue paint as a bowl in Cold Vale.",
      text:"A folded cloth has kept the equipment dry. The top of the box bears a small paw print in blue paint.",
      reward:{bandage:2,battery:1,food:1}, cache:"Firewatch provisions"},
    seedbox:{region:"ironworks", at:[96,49], title:"Rattling ammunition box", source:"East freight apron", extra:true, style:"seedbox",
      action:"Check the ammunition box", prompt:"Something soft rattles inside the metal box.",
      text:"The top tray holds three cartridges. The lower tray has envelopes of strawberry seeds and a sketch of the orchard water barrel. Whoever packed it expected to plant something after the fighting.",
      lead:"Follow the sketch to the old potting shelf in Westfields.", reward:{ammo:3,strawberryseed:3}, cache:"Seed packets and cartridges"},
    potting:{region:"fields", at:["Orchard farmhouse",1,11], title:"Old potting shelf", source:"Orchard farmhouse", extra:true, needs:["seedbox"],
      action:"Search behind the seed trays", locked:"A small sketch of the orchard would show where to look.",
      text:"You find a second set of seeds, a bottle of water and a note on where the last plants survived the winter.",
      reward:{strawberryseed:2,water:1}, cache:"Orchard seed reserve"},
    buildnote:{region:"coldvale",at:["workshop",2,4],title:"Weekend jobs",source:"Workshop · Scrap of squared paper",extra:true,added:3,
      text:"Pip: A proper Cold Vale map will save us a day. Vic: The real clinic and depot are on there. Keep it offline. Beneath that, in Pip’s handwriting: ‘I’ve left my mum’s street out.’ The street is circled on the printout.",
      lead:"A delivery address on the back reads Firewatch cabin, Pine Ridge."},
    install:{region:"ridge",at:["Firewatch cabin",3,5],title:"Survey team handover",source:"Firewatch cabin · Handover folder",extra:true,added:3,
      text:"Vic brought the modem up to the cabin. Said he needed one connection to finish the test and would cut it before breakfast. Pip had left a note asking him to wait. The modem still says LOCAL BUILD. The phone bill lists seventeen calls to the bus depot.",
      lead:"The descent is on the trail south of the cabin."},
    returnlabel:{region:"ironworks",at:["Freight depot",11,5],title:"Delivery exception",source:"Freight depot · Returned docket",extra:true,added:3,
      text:"The consignee was listed as TEST DRIVER 04. Real name on the driver's badge, Eddie. He signed twice, once before the van arrived. Dispatch took the box away and left a maintenance pouch under the rack marked RETURNS.",
      lead:"The forwarding stamp is from Bracken Coast."},
    deadletter:{region:"coast",at:["Coastguard station",7,7],title:"Off-air slip",source:"Coastguard station · Back of a weather chart",extra:true,added:3,
      text:"The server asked if a player had approved the reset. We unplugged the console. At 06:32 it asked again over the tannoy. If anyone comes for the returns, we moved the pouch to the orchard. Look behind the pantry wall, in the vent with the bent corner."},
    returns:{region:"fields",at:["Orchard farmhouse",3,4],title:"Bent pantry vent",source:"Orchard farmhouse",extra:true,added:3,needs:["returnlabel","deadletter"],
      action:"Reach behind the vent",locked:"A return stamp and the coastguard's forwarding note would show which vent to search.",
      text:"A maintenance pouch is tucked behind the mesh. The receipt says ‘No returns after opening’. In a different hand: ‘Would love to.’",
      reward:{battery:2,tape:1,scrap:2},cache:"Returned maintenance pouch"},
    samplelog:{region:"cavern",at:[8,24],title:"Two clocks",source:"Winch room · Paper log",extra:true,added:3,
      text:"11 October. The simulation clock said Tuesday. Our watches said Wednesday. The swab from the depot driver matched what Patchwork called a hostile test agent. The virus was real. Vic wrote ‘Eddie’ beside TEST DRIVER 04. Pip pulled the cable, then asked whether Eddie had made it home. Nobody in the room knew.",
      lead:"A backup of their conversation is in the survey room."},
    recovery:{region:"cavern",at:[32,10],title:"Local build backup",source:"Survey room · Offline console",extra:true,added:3,needs:["buildnote","install","samplelog"],
      action:"Open the offline conversation",locked:"The console needs the project alias from town, the cabin handover and the winch room log.",
      text:"PIP: Take my street off the map. VIC: Take every street off. PATCHWORK: Virus deployed. First case confirmed at Cold Vale bus depot. VIC: His name’s Eddie. PATCHWORK: Playtester 04. PIP: Undo. PATCHWORK: You wanted Survival Mode. Try surviving. VIC: I’m going to the depot. PIP: Wait. I’ve got the keys.",
      reward:{part:2,battery:2},cache:"Offline terminal spares"},
    parade:{region:"coldvale",at:["The Winchester cottage",3,4],generator:3,style:"parade-wheel",title:"Float inspection",source:"The Winchester · Kitchen notice",extra:true,
      text:"Keep the giant cheese chocked until the judging. We lost it once on Raccoon Rise and the dead got out of its way faster than the living. The inspector wants a brake. The dairy crew in Westfields got the last spare.",
      lead:"The dairy workers’ cottage is just east of the orchard farmhouse in Westfields."},
    chock:{region:"fields",at:["Dairy workers' cottage",3,4],generator:3,title:"Spare wheel chock",source:"Dairy workers’ cottage · Back of the kitchen cupboard",extra:true,needs:["parade"],
      action:"Lift the loose board",locked:"Look for the parade committee’s inspection note in Cold Vale.",
      text:"The dairy crew left a food parcel and a repair kit. The delivery slip has a new box for the size of the cheese. Someone has ticked ‘vehicular’.",
      reward:{food:2,scrap:2,tape:1},cache:"Dairy crew's parcel"},
    lastOrders:{region:"coldvale",at:["Raccoon Rise no. 4",3,4],generator:3,title:"Last orders",source:"Raccoon Rise · Coat pocket",extra:true,
      text:"Mum is at the malt house. Pick her up. Wait out the trouble over a pint. Remember what happened last quiz night. Two people said ‘Who’s for a lock-in?’ and Kev nailed the door shut.",
      lead:"The circled address is the malt house, south of the Westfields orchard."},
    cellarTab:{region:"fields",at:["Malt house",3,4],generator:3,title:"Settled tab",source:"Malt house · Enamel cash tin",extra:true,needs:["lastOrders"],
      action:"Check the tin under the mat",locked:"A note from Raccoon Rise mentions the malt house.",
      text:"A jar of drinking water and a packet of plasters sit under the till receipt. Mum got everybody out through the yard and left the keys in the jar. Kev is banned from making plans.",
      reward:{water:1,bandage:2},cache:"Yard emergency supplies"},
    shoplist:{region:"coldvale",at:["Day Twenty-Eight bungalow",3,4],generator:3,title:"The weekly shop",source:"Day Twenty-Eight · Magnet note",extra:true,
      text:"Ted keeps going to the supermarket with the same list. Milk, cat food, something for tea. Today he came back with an empty trolley and someone else’s shoe. Doris says she’ll give it back next Thursday."},
    deliveryloop:{region:"coldvale",at:["Cemetery Road farmhouse",3,4],generator:3,title:"Misdelivered post",source:"East End · Envelope marked return to sender",extra:true,
      text:"Six copies of tomorrow’s schedule, all for the same house. I took one back to Vic. His machine said the address was in a test. I asked it to come and do my round."},
    trailtag:{region:"ridge",at:["Ash Hollow hut",3,4],generator:3,title:"Do not feed",source:"Trail crew · Visitor register",extra:true,
      text:"Whatever’s been scratching at the hut ignores the suet balls. It walks round to the back door at the same minute every hour. The birdwatching group has asked for its species name before adding it to the list."},
    shiftClock:{region:"ironworks",at:["Busan Line cottage no. 3",3,4],generator:3,title:"Clocking-off slip",source:"Busan Line cottages · Red pencil",extra:true,
      text:"We locked the night shift out at four. At five, twelve of them clocked in and fourteen clocked out. Payroll has asked us to explain the extra hours before it will close the incident."},
    ferryfare:{region:"coast",at:["Ferry keeper's house",3,4],generator:3,title:"A return, please",source:"Ferry keeper · Ticket book",extra:true,
      text:"The last passenger paid for a return and then stopped breathing. When he got back up, I asked if he still wanted the receipt. I’d worked that window for twenty-seven years. Habit is a powerful thing."},
    tilltest:{region:"coldvale",at:["market",3,4],title:"Till reconciliation",source:"Grocery store · Return terminal",added:4,needs:["receipt"],
      action:"Reconcile the duplicate",locked:"Read the uncollected till roll.",prompt:"Enter the two receipt times from earliest to latest, then enter their shared circuit.",
      game:{buttons:["06:12","06:32","R7","07:10"],sequence:[0,1,2]},
      text:"The till releases a parcel and prints Ada’s handwritten objection: ‘He was never on your bus.’",
      reward:{food:1,battery:1},cache:"Unclaimed return"},
    ridgecode:{region:"ridge",at:["Creek shelter",4,3],title:"Firewatch night drill",source:"Creek shelter · Signal trainer",added:4,needs:["watch"],
      action:"Run the night drill",locked:"Read the firewatch duty slip first.",prompt:"The drill card says to cover the lamp, send two short flashes, then leave it dark.",
      game:{buttons:["Short flash","Long flash","Cover lamp"],sequence:[2,0,0,2]},
      text:"A spare battery drops from the trainer. On the back of the card Ellis wrote, ‘If nobody answers, try the real line.’",
      reward:{battery:2},cache:"Signal trainer spares"},
    yardboard:{region:"ironworks",at:["Dispatch office",4,3],title:"Dead shift rehearsal",source:"Dispatch office · Isolated siding board",added:4,needs:["tally"],
      action:"Start siding rehearsal",locked:"Read the freight passenger tally.",prompt:"The drill moves the infected off the route. Close the shop gate, ring the eastern bell, then open the runner’s gate. The bell still makes noise.",
      game:{buttons:["Eastern bell","Runner’s gate","Shop gate"],sequence:[2,0,1],noisyChoice:0},
      text:"The board marks the route clear on the rehearsal track. Someone drew a path from the eastern sidings to the Slag Quarry weighbridge.",
      reward:{scrap:2,part:1},cache:"Yard maintenance drawer"},
    tidegame:{region:"coast",at:["Net shed",5,3],title:"Crossing practice",source:"Net shed · Peg chart",added:4,needs:["tidebook"],
      action:"Plot a dry crossing",locked:"Read the coastguard arrival book.",prompt:"Move the runner from the first dry stone to the last. The dry stones are chalk, flint, then slate. The brick sinks.",
      game:{buttons:["Slate","Brick","Chalk","Flint"],sequence:[2,3,0]},
      text:"At the edge of the chart, a boatman drew the path to Gull Point. He circled the boat shed twice.",
      reward:{bait:2,water:1},cache:"Net crew’s ration tin"},
    knockgame:{region:"fields",at:["Hay barn",4,3],title:"The cellar signal",source:"Hay barn · False pantry door",added:4,needs:["cellar"],
      action:"Answer the latch",locked:"Read Ada’s note at the orchard.",prompt:"Use the family signal from the flour sack. One knock at a time.",
      game:{buttons:["Knock","Wait","Rattle latch"],sequence:[0,0,0,1,0]},
      text:"The latch opens onto a seed tin. A message inside warns that somebody at Greywater’s valve tower heard the same broadcast through a pipe.",
      reward:{seedpotato:2,water:1},cache:"Pantry seed tin"},
    weighghost:{region:"quarry",at:["Weighbridge hut",4,3],generator:5,added:4,extra:true,
      title:"One passenger, thirty tonnes",source:"Slag Quarry · Weighbridge ticket",
      text:"A truck rolled across empty. The printer gave its weight as EDDIE. The actual Eddie, under the desk with me, asked if he could have the ticket. He’d never been thirty tonnes before.",
      lead:"Vic overlaid old infrastructure on the council map. The other backups are at Greywater and Gull Point."},
    pipecopy:{region:"reservoir",at:["Valve tower",4,3],generator:5,added:4,extra:true,
      title:"Plumbing fault",source:"Greywater · Valve tower wall",
      text:"The voice in the spillway says ‘all clear’ every twenty minutes. I marked the high water with a pencil. It rises one mark after each announcement. If it asks for feedback, tell it the dam is full."},
    fogfare:{region:"lighthouse",at:["Boat shed",4,3],generator:5,added:4,extra:true,
      title:"A ticket for the fog",source:"Gull Point · Boat shed receipt spike",
      text:"One ticket, fare paid, destination outside the map. The keeper pinned it so the wind couldn’t take it. On the back is a hand-drawn gull and the words ‘Keep one seat empty.’"},
    shutdown:{region:"cavern",at:[30,12],title:"End the second all-clear",source:"Survey room · Manual isolation console",added:4,needs:["recovery"],afterDispatch:true,
      action:"Begin manual isolation",locked:"Recover the offline conversation from the survey room terminal.",
      prompt:"Vic wrote the order on the casing. Pip added, ‘Use the names on the signed sheet.’ Isolate the recorded loop. Read back the signed check-in. Cut the outbound relay.",
      game:{buttons:["Read back check-in","Cut relay","Isolate loop"],sequence:[2,0,1]},
      text:"For the first time since 06:12, the tape reaches its end. Ada reads the names of the people who crossed over the local handset. There is a long break before she says Eddie’s. Then someone answers.",
      reward:{battery:2,bandage:1},cache:"Survey crew’s final kit"},
    gullseat:{region:"cavern",at:[33,13],generator:5,added:4,extra:true,needs:["weighghost","pipecopy","fogfare","shutdown"],
      title:"The empty seat",source:"Survey room · Undelivered envelope",
      action:"Open the envelope",locked:"Compare the three outlying records and finish the manual shutdown.",
      text:"Eddie collected the weighbridge ticket. The keeper drew the gull. Ada left one place empty in the truck. Folded together, the stubs spell out a destination Patchwork never copied: home.",
      reward:{food:2,battery:1},cache:"Eddie’s packed lunch"}
  };

  // These field finds are map-seeded and independent of supplies, population and the case.
  const filmFinds = {
    pubstand:{region:"fields",at:["Malt house",4,4],title:"Last round",source:"Malt house · Beer mat",
      text:"The beer mats say to stay put and wait for the trouble to blow over. The front door is barricaded with the jukebox. The back door is propped open so the regulars can smoke."},
    centreboard:{region:"coldvale",at:["market",2,5],title:"Shopping arcade closing rota",source:"Grocery store · Arcade notice",
      text:"The committee barricaded the shopping arcade and voted to keep the escalator running. It has been carrying an empty shopping trolley upstairs for three days."},
    emptyroad:{region:"coldvale",at:[29,24],style:"milk-bottles",title:"Nothing on the road",source:"Main road · Unopened delivery",
      text:"An entire row of milk bottles is untouched. The van’s indicator still blinks, faithfully asking permission to turn into an empty street."},
    farmboards:{region:"fields",at:["Orchard farmhouse",7,3],title:"Count the nails",source:"Orchard farmhouse · Boarded window",
      text:"The house stayed dark all night. At dawn, someone had pulled the nails out of the boards and knocked them back in from the outside."},
    coldsample:{region:"ironworks",at:["Power substation",4,4],style:"sample-case",title:"Hold at minus twenty",source:"Power substation · Refrigerated specimen case",
      text:"The sample was hard enough to rattle in its jar. At nineteen below it moved to the side furthest from the thermometer. Someone has crossed out ‘defrost before opening’."},
    tornreel:{region:"ridge",at:["Firewatch cabin",6,4],style:"broken-recorder",title:"Recorder with a torn tape",source:"Firewatch cabin · Notebook and recorder",
      text:"The notebook says the last recording was of the wind. The recorder has been smashed, very carefully, in the middle of a sentence."},
    sealcar:{region:"ironworks",at:["Freight depot",8,4],style:"carriage-door",title:"Carriage end door",source:"Freight depot · Abandoned carriage",
      text:"The carriage door was tied shut with neckties from the platform side. Someone inside slid a folded ticket under it after the last train had gone."},
    rulespad:{region:"coast",at:["Weather hut",5,5],title:"The rules, revised",source:"Weather hut · Pocket notebook",
      text:"Always check the back seat. If there is somebody in it, ask them what rule they were following. If they answer, ask how long they’ve been there."},
    wheelbarrow:{region:"quarry",at:["Crusher shed",4,3],title:"Unlicensed transport",source:"Crusher shed · Incident report",
      text:"The foreman tried moving a dead worker in a wheelbarrow. At lunch, three dead workers were pushing the foreman around in it. The wheelbarrow has been written off."},
    sporetag:{region:"ridge",at:["Creek shelter",3,3],title:"Don’t tread on the threads",source:"Creek shelter · Trail notice",
      text:"The white filaments run all the way under the door. I put my boot down and heard chairs scrape in the next room. If you wake one, expect company."}
  };
  for (const [id,entry] of Object.entries(filmFinds)) entries[id] = {...entry,added:5,generator:6,extra:true,rare:true};

  const cinemaNotes = {
    poster:{at:["Oxford Night Reel",8,17],title:"Shocktober event poster",source:"Entrance lobby",
      text:"THE NIGHT REEL SOCIETY PRESENTS\nSHOCKTOBER — ONE HELL OF A NIGHT\n\nCult classics. Cold beers. Ridiculous prizes. And the world-famous El Gordo raffle. One lucky Night Reeler will walk off with the Golden Raffle Trophy. Everyone else can cry into their popcorn. Doors at 7:30. Film at 8:30. Chaos afterwards."},
    ticketpost:{at:["Oxford Night Reel",3,15],title:"Printed social announcement",source:"Ticket booth · Fictional social post",
      text:"OXFORD, YOU BEAUTIFUL WEIRDOS!\nTonight’s screening is sold out. Come for the cold beer and the film, stay for an indecent quantity of raffle prizes. One of you is taking El Gordo home. What could possibly go wrong?\n#NightReel #ElGordo #Shocktober"},
    livepost:{at:["Oxford Night Reel",15,13],title:"Winner announcement and draft",source:"Projection booth · Fictional social post",
      text:"WE HAVE A WINNER! Our El Gordo champion looks like he’s been partying since 1987. Absolute legend. Somebody get him a beer.\n\nUnsent draft\n‘Right, apparently he doesn’t want a beer. He wants…’"},
    backnote:{at:["Oxford Night Reel",13,2],title:"Note to whoever sold 00666",source:"Backstage table",
      text:"Whoever sold ticket 00666 needs to explain. The winner looked like absolute death. We gave him the trophy. He tried to eat Martin. Everyone thought it was performance art.\nIT WAS NOT PERFORMANCE ART.\nIf you’ve got the keys to the back exit, OPEN THE BLOODY DOOR."},
    finalpost:{at:["Oxford Night Reel",14,11],title:"Final screening update",source:"Projection booth · Fictional social post",
      text:"Well, you magnificent bastards. El Gordo has eaten half the front row. The projector is still running. Nobody can find the keys and somebody’s nicked all the popcorn.\n10/10 atmosphere. Would probably not recommend.\n#NightReel #BestNightEver #SendHelp"},
    halloffame:{at:["Oxford Night Reel",10,16],title:"El Gordo Hall of Fame",source:"Lobby wall",
      text:"Tess — 00432 — left on the last bus with twelve saucepans.\nGareth — 00280 — donated his inflatable coffin back.\n\nEL GORDO CHAMPION\nTICKET #00666\nWinner: Unknown\nStatus: Unavailable for comment\n\nThe blurry photo shows a figure clutching the golden trophy. First winner to bite the presenter."}
  };
  for (const [id,entry] of Object.entries(cinemaNotes)) entries[id] = {...entry,region:"cinema",added:5,generator:6};

  Object.assign(entries, Expedition.records);
  for (const [id,district] of Object.entries(Expedition.districts)) leads[id] = district.brief;

  function available(entry,world) {
    if ((entry.generator ?? 1) > world.generator) return false;
    if (!entry.rare) return true;
    const salt = [...entry.title].reduce((sum,c) => Math.imul(sum,31)+c.charCodeAt(0),0);
    return Level.seeded(world.seed ^ salt)() < .48;
  }

  const core = ["receipt","watch","tally","tidebook","cellar","relay","reply"];
  const routes = {
    freight:{title:"Freight diversion", verified:"horn", region:"ironworks", decoy:[81,29], from:"Machine shop", danger:"Eastern sidings",
      destination:"fields", deliveryAt:["Orchard farmhouse",8,11], cache:"Orchard relay parcel", reward:{part:2,scrap:4,fuel:2},
      description:"The horn draws infected away from the machine shop toward the eastern sidings. A runner leaves tools and fuel at the orchard.",
      report:"We crossed behind the machine shop while the sidings shook. Seven of us made it to the orchard. We used our names on the new list and crossed out the word cleared. These are the tools we could carry back. · Ada, orchard crew"},
    shore:{title:"Breakwater diversion", verified:"washbox", region:"coast", decoy:[33,60], from:"Coastguard station", danger:"Old fishing pier",
      destination:"ridge", deliveryAt:["Ranger station",8,11], cache:"Ranger relay parcel", reward:{bandage:3,disinfectant:1,water:2,battery:2},
      description:"The foghorn draws infected away from the coastguard station toward the old pier. A runner leaves first aid and water at the ranger station.",
      report:"The pier horn gave us enough time to turn the truck inland. We reached the ranger station and counted everyone by hand. When the old announcement came on, we let it finish. Nobody moved until we heard your live call. · Ellis, coast watch"}
  };

  const empty = () => ({found:{}, dispatch:null});
  const has = (ledger, id) => Object.hasOwn(ledger.found, id);
  const isFixture = o => o.id.startsWith("ledger-");
  const idFor = id => "ledger-" + id;
  const cacheFor = id => "ledger-cache-" + id;
  const deliveryFor = id => "ledger-delivery-" + id;
  const isScene = o => o?.action === "ledger-record" || o?.action === "ledger-event";
  const isUnseen = (ledger, o) => isScene(o) && !has(ledger, o.record);

  function place(world, expansion = false) {
    const offsets = [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
    function fixture(at, data) {
      const [first, second, third] = at;
      const b = typeof first === "string" && (world.buildings.find(site => site.name === first) || world.buildings.find(site => site.type === first));
      const x = b ? b.x + second : first, y = b ? b.y + third : second;
      const cell = (ix,iy) => ix >= 1 && iy >= 1 && ix < world.width - 1 && iy < world.height - 1 && world.tiles[iy * world.width + ix];
      const anchor = cell(x,y);
      const tile = offsets.map(([dx,dy]) => cell(x+dx,y+dy)).find(t => t && !t.baseSolid && t.building === anchor?.building &&
        !world.objects.some(o => o.x === t.x+.5 && o.y === t.y+.5));
      if (!tile) throw new Error("Missing landmark for " + data.name + ".");
      const o = {x:tile.x+.5,y:tile.y+.5,building:tile.building,zone:tile.zone,tint:.52,solid:false,active:true,...data};
      world.objects.push(o);
      return o;
    }
    function cache(id, name, location, properties) {
      world.objects.push({id,kind:"crate",action:"loot",name,x:location.x,y:location.y,building:location.building,zone:location.zone,
        tint:.72,solid:false,active:false,storage:true,searched:true,loot:[],...properties});
    }
    for (const [id, entry] of Object.entries(entries)) {
      if (entry.region !== world.region || !available(entry,world) ||
          Boolean(entry.added || entry.generator) !== expansion) continue;
      const o = fixture(entry.at,{id:idFor(id),record:id,name:entry.title,kind:entry.style ?? (entry.action ? "relay" : "record"),action:entry.action ? "ledger-event" : "ledger-record"});
      if (entry.reward) cache(cacheFor(id),entry.cache,o,{record:id});
    }
    if (expansion) return;
    if (world.region === Regions.home) fixture(["Your shelter",4,1],{id:deskId,kind:"dispatch",action:"ledger-desk",name:"Civil defence desk"});
    for (const [id, route] of Object.entries(routes)) {
      if (route.destination === world.region) {
        fixture(route.deliveryAt,{id:deliveryFor(id),name:route.cache,kind:"crate",action:"loot",active:false,storage:true,searched:true,loot:[],delivery:id});
      }
    }
  }

  function incidentProblem(ledger, id, minutes, night) {
    const entry = entries[id];
    if (has(ledger,id)) return "Already recorded in your ledger.";
    if (entry.needs?.some(needed => !has(ledger,needed))) return entry.locked;
    if (entry.afterDispatch && !ledger.dispatch?.reportRead) return "Send a diversion and read the crew’s signed check-in first.";
    if (entry.window === "night" && !night) return "Try the lantern after 20:00 or before dawn.";
    if (entry.window === "tide" && minutes % tideCycle >= lowTide) return "The washbox is under water. Low tide in " + Math.ceil(tideCycle - minutes % tideCycle) + " in-game minutes.";
    return "";
  }

  function tideForecast(minutes) {
    const phase = minutes % tideCycle;
    return phase < lowTide ? "Low tide for " + Math.ceil(lowTide-phase) + " more in-game minutes." :
      "Low tide in " + Math.ceil(tideCycle-phase) + " in-game minutes.";
  }

  function ready(ledger, id) {
    return Object.hasOwn(routes,id) && has(ledger,routes[id].verified) && core.every(key => has(ledger,key));
  }

  function restore(raw, minutes) {
    if (raw === undefined) return empty();
    const invalid = () => { throw new Error("Invalid field ledger."); };
    if (!raw || !raw.found || typeof raw.found !== "object" || Array.isArray(raw.found)) invalid();
    const validTime = n => Number.isFinite(n) && n >= 0 && n <= minutes;
    for (const [id, when] of Object.entries(raw.found)) {
      if (!Object.hasOwn(entries,id) || !validTime(when) || entries[id].needs?.some(key => !has(raw,key) || raw.found[key] > when)) invalid();
    }
    const dispatch = raw.dispatch;
    if (dispatch !== null) {
      if (!dispatch || !ready(raw,dispatch.route) || !validTime(dispatch.sent) ||
          [...core,routes[dispatch.route].verified].some(key => raw.found[key] > dispatch.sent) ||
          typeof dispatch.delivered !== "boolean" || typeof dispatch.reportRead !== "boolean" || dispatch.reportRead && !dispatch.delivered ||
          dispatch.moved !== null && (!Number.isInteger(dispatch.moved) || dispatch.moved < 0 || dispatch.moved > 7) ||
          (dispatch.delivered || dispatch.moved !== null) && dispatch.sent + dispatchDelay > minutes) invalid();
    }
    if (Object.entries(raw.found).some(([id, when]) =>
      entries[id].afterDispatch && (!dispatch?.reportRead || when < dispatch.sent + dispatchDelay))) invalid();
    return {found:{...raw.found},dispatch:dispatch ? {route:dispatch.route,sent:dispatch.sent,moved:dispatch.moved,delivered:dispatch.delivered,
      reportRead:dispatch.reportRead} : null};
  }

  return {title,revision,dispatchDelay,deskId,leads,entries,core,routes,empty,has,isFixture,idFor,cacheFor,deliveryFor,isScene,isUnseen,available,place,incidentProblem,tideForecast,ready,restore};
})();
