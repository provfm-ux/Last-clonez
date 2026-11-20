# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (264 lines)
worldRules:118 | character:185

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/expedition.js (197 lines)
record:147

## game/regions.js (600 lines)
cinemaOutcome:45 | addExits:51 | add:52 | connection:87 | oldExit:107 | expand:111 | createGrotto:158 | create:188 | zone:199 | paint:257 | road:261 | add:281 | loot:289 | building:294 | addWilds:579

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (335 lines)
available:229 | place:257 | fixture:259 | cache:272 | incidentProblem:291 | tideForecast:301 | ready:307 | restore:311

## game/world.js (186 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:45 | build:55 | clear:114 | drivable:121 | sees:125 | route:135

## game/atmosphere.js (148 lines)
place:55 | clearCell:58 | add:62 | nextWave:118 | create:122 | restore:128

## game/soundscape.js (107 lines)
makeBuffer:19 | play:68 | stop:96

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (2757 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | placeStartingBat:155 | create:168 | createControl:243 | nearby:285 | containers:289 | unreadClueAt:305 | nearbyClues:312 | readClue:317 | isSupplyCache:323 | nearbySupplyCache:328 | collectSupplyCache:334 | sources:346 | available:350 | consume:354 | collect:368 | collectAll:385 | drop:404 | stash:436 | use:446 | beltItem:508 | setBelt:516 | useBelt:523 | activeLight:532 | replaceBattery:537 | toggleLight:546 | recipeProblem:561 | craft:572 | place:586 | vehicle:624 | enterVehicle:628 | exitVehicle:649 | refuel:677 | vehicleRepairProblem:691 | repairVehicle:699 | brake:709 | updateVehicle:716 | destination:793 | markDestination:805 | markStation:825 | travelProblem:832 | arrivalPosition:842 | travel:853 | exploredTile:889 | saveMapPin:894 | markPin:913 | removePin:921 | noise:929 | hear:945 | encounterSlots:950 | newInfected:956 | freeEncounterSpot:962 | wakeNest:968 | touchFungus:987 | noticeCrib:991 | inspectCrib:1001 | warnHorde:1007 | resumeEncounterWarning:1014 | waveSpots:1018 | updateHordes:1028 | armWatch:1064 | updateAtmosphere:1074 | listenAtDoor:1135 | sceneProblem:1155 | revealLedgerCache:1160 | resolveScene:1166 | dispatchProblem:1192 | sendDispatch:1201 | readDispatchReport:1208 | settleDispatch:1216 | openingOccupied:1248 | breachProblem:1262 | breach:1271 | door:1299 | barricade:1325 | unboard:1340 | removeBarrier:1351 | minutesToRain:1362 | sight:1385 | canSee:1392 | drainLight:1401 | useTap:1410 | useGenerator:1430 | updateUtilities:1450 | fireBatch:1482 | startFireBatch:1489 | collectFireBatch:1504 | wildProblem:1538 | useWild:1558 | sow:1588 | waterGarden:1598 | gardenYield:1606 | harvestGarden:1612 | growGarden:1625 | updateOutdoor:1637 | catchUpArea:1648 | evaAtShelter:1668 | toggleGardenHelp:1673 | tendShelterGarden:1682 | contextual:1701 | recruit:1761 | threats:1771 | damageFactor:1775 | aimChance:1782 | inAttackRange:1787 | closestInReach:1791 | attackTarget:1802 | weaponProblem:1808 | endPursuit:1814 | endWindup:1820 | faceTowards:1825 | defeat:1830 | attack:1839 | shove:1877 | hurt:1896 | move:1931 | follow:1968 | walkTo:1994 | target:2006 | approach:2013 | updatePlayer:2027 | canTargetEva:2089 | updateEnemies:2093 | updateNpc:2186 | explore:2209 | updateExposure:2219 | updateNeeds:2231 | tick:2266 | updateDoorLure:2313 | breakLeg:2340 | healFracture:2348 | updateSickness:2357 | freeSpot:2380 | unstick:2393 | startSleep:2410 | fastSleep:2420 | sleep:2434 | moodles:2441 | snapshotPlayer:2465 | snapshotZone:2469 | snapshotRun:2477 | zoneShape:2490 | migrate:2505 | restore:2511

## game/view.js (2153 lines)
resize:19 | updateCamera:30 | poly:53 | line:62 | shadow:72 | box:80 | tint:88 | prepare:94 | bloodPool:152 | microDetail:157 | tileArt:182 | tendril:248 | tile:262 | glowSprite:280 | glow:297 | wall:308 | paintWall:335 | gardenTree:368 | paintFurniture:404 | drawFurniture:523 | prop:542 | roof:1036 | roofArt:1058 | roofCoversPlayer:1092 | marker:1100 | actorFrame:1125 | drawHeldWeapon:1220 | weaponIcon:1249 | drawZombieSprite:1268 | microActor:1299 | actor:1340 | flashlightBeam:1494 | chunkSignature:1524 | buildChunk:1532 | groundLayer:1560 | dimAround:1577 | afterlifePixels:1615 | afterlifePortrait:1642 | renderAfterlife:1654 | render:1802 | locate:2045 | mapFit:2065 | mapPoint:2070 | minimapLayer:2078 | minimap:2097

## game/game.js (2181 lines)
read:44 | write:48 | backUp:52 | save:61 | clearStick:82 | resetInput:89 | updateDisplayMode:102 | toggleFullscreen:114 | activate:139 | setNavigation:159 | opening:166 | startLesson:181 | endLesson:193 | updateLesson:205 | startAfterlife:229 | endAfterlife:239 | afterlifeAction:245 | start:249 | showStartDetail:262 | rememberSetup:271 | worldRulesEditor:277 | applyWorldRules:295 | resumeSaved:311 | show:329 | close:343 | menu:351 | titleScreen:361 | wakeSound:378 | cue:388 | syncSound:400 | objectives:409 | objectiveHtml:419 | skillsHtml:423 | statusText:433 | nearbyObjects:449 | interactionLabel:463 | canTalk:474 | setHtml:480 | updateHud:486 | help:595 | landmarks:605 | map:615 | savePinForm:665 | itemIcon:676 | itemDescription:681 | matches:697 | inventoryItems:707 | nearbyItems:730 | updateInventoryLists:751 | bag:793 | useBelt:825 | updateBelt:832 | beltPanel:851 | gear:865 | editSurvivor:901 | crafting:910 | health:931 | diary:958 | dispatchStatus:981 | fieldLedger:996 | ledgerEntry:1035 | ledgerReport:1041 | ledgerPanel:1050 | playtestReport:1086 | copyPlaytest:1116 | knownStory:1129 | storyText:1134 | outbreakLog:1138 | storyEntry:1147 | supplyRun:1156 | gardenStatus:1184 | gardenProject:1193 | waterProject:1213 | utilities:1234 | releases:1253 | research:1260 | npcPanel:1268 | gardenPanel:1285 | stationPanel:1309 | objectPanel:1356 | interact:1467 | interactions:1476 | nearbyAction:1493 | strike:1522 | quickUse:1530 | pause:1537 | exportSave:1544 | refreshPanel:1551 | bagChanged:1559 | changeInventory:1569 | bindTap:1845 | updateStick:1918 | shoveOrBrake:1946 | frame:2060
