# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> sim -> view -> game

## game/data.js (256 lines)
worldRules:110 | character:177

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/regions.js (519 lines)
addExits:41 | add:42 | connection:58 | oldExit:78 | expand:82 | createGrotto:129 | create:159 | zone:169 | paint:220 | road:224 | add:244 | loot:252 | building:257 | addWilds:498

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (283 lines)
place:205 | fixture:207 | cache:220 | incidentProblem:239 | tideForecast:249 | ready:255 | restore:259

## game/world.js (186 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:45 | build:55 | clear:114 | drivable:121 | sees:125 | route:135

## game/atmosphere.js (143 lines)
place:50 | clearCell:53 | add:57 | nextWave:113 | create:117 | restore:123

## game/soundscape.js (97 lines)
makeBuffer:17 | play:58 | stop:86

## game/sim.js (2679 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:198 | nearby:236 | containers:240 | unreadClueAt:256 | nearbyClues:263 | readClue:268 | isSupplyCache:274 | nearbySupplyCache:279 | collectSupplyCache:285 | sources:297 | available:301 | consume:305 | collect:319 | collectAll:336 | drop:355 | stash:387 | use:397 | beltItem:459 | setBelt:467 | useBelt:474 | activeLight:483 | replaceBattery:488 | toggleLight:497 | recipeProblem:512 | craft:523 | place:537 | vehicle:575 | enterVehicle:579 | exitVehicle:600 | refuel:628 | vehicleRepairProblem:642 | repairVehicle:650 | brake:660 | updateVehicle:667 | destination:744 | markDestination:755 | markStation:775 | travelProblem:782 | arrivalPosition:792 | travel:803 | exploredTile:839 | saveMapPin:844 | markPin:863 | removePin:871 | noise:879 | hear:892 | encounterSlots:897 | newInfected:903 | freeEncounterSpot:909 | wakeNest:915 | touchFungus:934 | noticeCrib:938 | inspectCrib:948 | warnHorde:954 | resumeEncounterWarning:961 | waveSpots:965 | updateHordes:975 | armWatch:1011 | updateAtmosphere:1021 | listenAtDoor:1069 | sceneProblem:1089 | revealLedgerCache:1094 | resolveScene:1100 | dispatchProblem:1126 | sendDispatch:1135 | readDispatchReport:1142 | settleDispatch:1150 | openingOccupied:1182 | breachProblem:1196 | breach:1205 | door:1233 | barricade:1259 | unboard:1274 | removeBarrier:1285 | minutesToRain:1296 | sight:1319 | canSee:1326 | drainLight:1335 | useTap:1344 | useGenerator:1364 | updateUtilities:1384 | fireBatch:1416 | startFireBatch:1423 | collectFireBatch:1438 | wildProblem:1472 | useWild:1492 | sow:1522 | waterGarden:1532 | gardenYield:1540 | harvestGarden:1546 | growGarden:1559 | updateOutdoor:1571 | catchUpArea:1582 | evaAtShelter:1602 | toggleGardenHelp:1607 | tendShelterGarden:1616 | contextual:1635 | recruit:1695 | threats:1705 | damageFactor:1709 | aimChance:1716 | inAttackRange:1721 | closestInReach:1725 | attackTarget:1736 | weaponProblem:1742 | endPursuit:1748 | endWindup:1754 | faceTowards:1759 | defeat:1764 | attack:1772 | shove:1810 | hurt:1829 | move:1864 | follow:1901 | walkTo:1927 | target:1939 | approach:1946 | updatePlayer:1960 | canTargetEva:2022 | updateEnemies:2026 | updateNpc:2118 | explore:2141 | updateExposure:2151 | updateNeeds:2163 | tick:2198 | updateDoorLure:2238 | breakLeg:2265 | healFracture:2273 | updateSickness:2282 | freeSpot:2305 | unstick:2318 | startSleep:2335 | fastSleep:2345 | sleep:2359 | moodles:2366 | snapshotPlayer:2390 | snapshotZone:2394 | snapshotRun:2402 | zoneShape:2415 | migrate:2430 | restore:2436

## game/view.js (1850 lines)
resize:19 | updateCamera:30 | poly:53 | line:62 | shadow:72 | box:80 | tint:88 | prepare:94 | bloodPool:152 | microDetail:157 | tileArt:182 | tendril:248 | tile:262 | glowSprite:280 | glow:297 | wall:308 | paintWall:335 | gardenTree:368 | paintFurniture:404 | drawFurniture:523 | prop:542 | roof:986 | roofArt:1008 | roofCoversPlayer:1042 | marker:1050 | actorFrame:1075 | drawHeldWeapon:1165 | drawZombieSprite:1196 | microActor:1227 | actor:1268 | flashlightBeam:1404 | chunkSignature:1434 | buildChunk:1442 | groundLayer:1470 | dimAround:1487 | render:1500 | locate:1742 | mapFit:1762 | mapPoint:1767 | minimapLayer:1775 | minimap:1794

## game/game.js (1984 lines)
read:38 | write:42 | backUp:46 | save:55 | clearStick:76 | resetInput:83 | updateDisplayMode:96 | toggleFullscreen:108 | activate:133 | start:153 | showStartDetail:166 | rememberSetup:175 | worldRulesEditor:181 | applyWorldRules:199 | resumeSaved:215 | show:233 | close:247 | menu:255 | titleScreen:264 | wakeSound:279 | cue:289 | syncSound:301 | objectives:310 | objectiveHtml:320 | skillsHtml:324 | statusText:334 | nearbyObjects:350 | interactionLabel:364 | canTalk:375 | setHtml:381 | updateHud:387 | help:457 | landmarks:467 | map:477 | savePinForm:526 | itemDescription:537 | matches:553 | inventoryItems:563 | nearbyItems:586 | updateInventoryLists:607 | bag:649 | useBelt:680 | updateBelt:687 | beltPanel:706 | gear:720 | editSurvivor:756 | crafting:765 | health:786 | diary:813 | dispatchStatus:836 | fieldLedger:851 | ledgerEntry:884 | ledgerReport:890 | ledgerPanel:899 | playtestReport:935 | copyPlaytest:965 | knownStory:978 | storyText:983 | outbreakLog:987 | storyEntry:996 | supplyRun:1005 | gardenStatus:1033 | gardenProject:1042 | waterProject:1062 | utilities:1083 | releases:1102 | research:1109 | npcPanel:1117 | gardenPanel:1134 | stationPanel:1158 | objectPanel:1205 | interact:1316 | interactions:1325 | nearbyAction:1342 | strike:1371 | quickUse:1379 | pause:1386 | exportSave:1393 | refreshPanel:1400 | bagChanged:1408 | changeInventory:1418 | bindTap:1684 | updateStick:1757 | shoveOrBrake:1785 | frame:1881
