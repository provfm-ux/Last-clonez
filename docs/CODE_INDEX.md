# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (259 lines)
worldRules:113 | character:180

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/regions.js (563 lines)
cinemaOutcome:44 | addExits:50 | add:51 | connection:73 | oldExit:93 | expand:97 | createGrotto:144 | create:174 | zone:184 | paint:236 | road:240 | add:260 | loot:268 | building:273 | addWilds:542

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (332 lines)
available:226 | place:254 | fixture:256 | cache:269 | incidentProblem:288 | tideForecast:298 | ready:304 | restore:308

## game/world.js (186 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:45 | build:55 | clear:114 | drivable:121 | sees:125 | route:135

## game/atmosphere.js (144 lines)
place:51 | clearCell:54 | add:58 | nextWave:114 | create:118 | restore:124

## game/soundscape.js (107 lines)
makeBuffer:19 | play:68 | stop:96

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (2731 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:221 | nearby:259 | containers:263 | unreadClueAt:279 | nearbyClues:286 | readClue:291 | isSupplyCache:297 | nearbySupplyCache:302 | collectSupplyCache:308 | sources:320 | available:324 | consume:328 | collect:342 | collectAll:359 | drop:378 | stash:410 | use:420 | beltItem:482 | setBelt:490 | useBelt:497 | activeLight:506 | replaceBattery:511 | toggleLight:520 | recipeProblem:535 | craft:546 | place:560 | vehicle:598 | enterVehicle:602 | exitVehicle:623 | refuel:651 | vehicleRepairProblem:665 | repairVehicle:673 | brake:683 | updateVehicle:690 | destination:767 | markDestination:779 | markStation:799 | travelProblem:806 | arrivalPosition:816 | travel:827 | exploredTile:863 | saveMapPin:868 | markPin:887 | removePin:895 | noise:903 | hear:919 | encounterSlots:924 | newInfected:930 | freeEncounterSpot:936 | wakeNest:942 | touchFungus:961 | noticeCrib:965 | inspectCrib:975 | warnHorde:981 | resumeEncounterWarning:988 | waveSpots:992 | updateHordes:1002 | armWatch:1038 | updateAtmosphere:1048 | listenAtDoor:1109 | sceneProblem:1129 | revealLedgerCache:1134 | resolveScene:1140 | dispatchProblem:1166 | sendDispatch:1175 | readDispatchReport:1182 | settleDispatch:1190 | openingOccupied:1222 | breachProblem:1236 | breach:1245 | door:1273 | barricade:1299 | unboard:1314 | removeBarrier:1325 | minutesToRain:1336 | sight:1359 | canSee:1366 | drainLight:1375 | useTap:1384 | useGenerator:1404 | updateUtilities:1424 | fireBatch:1456 | startFireBatch:1463 | collectFireBatch:1478 | wildProblem:1512 | useWild:1532 | sow:1562 | waterGarden:1572 | gardenYield:1580 | harvestGarden:1586 | growGarden:1599 | updateOutdoor:1611 | catchUpArea:1622 | evaAtShelter:1642 | toggleGardenHelp:1647 | tendShelterGarden:1656 | contextual:1675 | recruit:1735 | threats:1745 | damageFactor:1749 | aimChance:1756 | inAttackRange:1761 | closestInReach:1765 | attackTarget:1776 | weaponProblem:1782 | endPursuit:1788 | endWindup:1794 | faceTowards:1799 | defeat:1804 | attack:1813 | shove:1851 | hurt:1870 | move:1905 | follow:1942 | walkTo:1968 | target:1980 | approach:1987 | updatePlayer:2001 | canTargetEva:2063 | updateEnemies:2067 | updateNpc:2160 | explore:2183 | updateExposure:2193 | updateNeeds:2205 | tick:2240 | updateDoorLure:2287 | breakLeg:2314 | healFracture:2322 | updateSickness:2331 | freeSpot:2354 | unstick:2367 | startSleep:2384 | fastSleep:2394 | sleep:2408 | moodles:2415 | snapshotPlayer:2439 | snapshotZone:2443 | snapshotRun:2451 | zoneShape:2464 | migrate:2479 | restore:2485

## game/view.js (2115 lines)
resize:19 | updateCamera:30 | poly:53 | line:62 | shadow:72 | box:80 | tint:88 | prepare:94 | bloodPool:152 | microDetail:157 | tileArt:182 | tendril:248 | tile:262 | glowSprite:280 | glow:297 | wall:308 | paintWall:335 | gardenTree:368 | paintFurniture:404 | drawFurniture:523 | prop:542 | roof:1026 | roofArt:1048 | roofCoversPlayer:1082 | marker:1090 | actorFrame:1115 | drawHeldWeapon:1205 | drawZombieSprite:1236 | microActor:1267 | actor:1308 | flashlightBeam:1457 | chunkSignature:1487 | buildChunk:1495 | groundLayer:1523 | dimAround:1540 | afterlifePixels:1578 | afterlifePortrait:1605 | renderAfterlife:1617 | render:1765 | locate:2007 | mapFit:2027 | mapPoint:2032 | minimapLayer:2040 | minimap:2059

## game/game.js (2170 lines)
read:44 | write:48 | backUp:52 | save:61 | clearStick:82 | resetInput:89 | updateDisplayMode:102 | toggleFullscreen:114 | activate:139 | setNavigation:159 | opening:166 | startLesson:181 | endLesson:193 | updateLesson:205 | startAfterlife:229 | endAfterlife:239 | afterlifeAction:245 | start:249 | showStartDetail:262 | rememberSetup:271 | worldRulesEditor:277 | applyWorldRules:295 | resumeSaved:311 | show:329 | close:343 | menu:351 | titleScreen:361 | wakeSound:378 | cue:388 | syncSound:400 | objectives:409 | objectiveHtml:419 | skillsHtml:423 | statusText:433 | nearbyObjects:449 | interactionLabel:463 | canTalk:474 | setHtml:480 | updateHud:486 | help:595 | landmarks:605 | map:615 | savePinForm:665 | itemDescription:676 | matches:692 | inventoryItems:702 | nearbyItems:725 | updateInventoryLists:746 | bag:788 | useBelt:820 | updateBelt:827 | beltPanel:846 | gear:860 | editSurvivor:896 | crafting:905 | health:926 | diary:953 | dispatchStatus:976 | fieldLedger:991 | ledgerEntry:1024 | ledgerReport:1030 | ledgerPanel:1039 | playtestReport:1075 | copyPlaytest:1105 | knownStory:1118 | storyText:1123 | outbreakLog:1127 | storyEntry:1136 | supplyRun:1145 | gardenStatus:1173 | gardenProject:1182 | waterProject:1202 | utilities:1223 | releases:1242 | research:1249 | npcPanel:1257 | gardenPanel:1274 | stationPanel:1298 | objectPanel:1345 | interact:1456 | interactions:1465 | nearbyAction:1482 | strike:1511 | quickUse:1519 | pause:1526 | exportSave:1533 | refreshPanel:1540 | bagChanged:1548 | changeInventory:1558 | bindTap:1834 | updateStick:1907 | shoveOrBrake:1935 | frame:2049
