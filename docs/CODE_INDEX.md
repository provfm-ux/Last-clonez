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

## game/chronicle.js (231 lines)
place:156 | fixture:158 | cache:171 | incidentProblem:190 | tideForecast:199 | ready:205 | restore:209

## game/world.js (186 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:45 | build:55 | clear:114 | drivable:121 | sees:125 | route:135

## game/atmosphere.js (143 lines)
place:50 | clearCell:53 | add:57 | nextWave:113 | create:117 | restore:123

## game/soundscape.js (97 lines)
makeBuffer:17 | play:58 | stop:86

## game/sim.js (2641 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:198 | nearby:236 | containers:240 | unreadClueAt:256 | nearbyClues:263 | readClue:268 | isSupplyCache:274 | nearbySupplyCache:279 | collectSupplyCache:285 | sources:297 | available:301 | consume:305 | collect:319 | collectAll:336 | drop:355 | stash:387 | use:397 | beltItem:459 | setBelt:467 | useBelt:474 | activeLight:483 | replaceBattery:488 | toggleLight:497 | recipeProblem:512 | craft:523 | place:537 | vehicle:575 | enterVehicle:579 | exitVehicle:600 | refuel:626 | vehicleRepairProblem:640 | repairVehicle:648 | brake:658 | updateVehicle:665 | destination:728 | markDestination:739 | markStation:759 | travelProblem:766 | arrivalPosition:776 | travel:787 | exploredTile:823 | saveMapPin:828 | markPin:847 | removePin:855 | noise:863 | hear:876 | encounterSlots:881 | newInfected:887 | freeEncounterSpot:893 | wakeNest:899 | touchFungus:918 | noticeCrib:922 | inspectCrib:932 | warnHorde:938 | resumeEncounterWarning:945 | waveSpots:949 | updateHordes:959 | armWatch:995 | updateAtmosphere:1005 | listenAtDoor:1053 | sceneProblem:1073 | revealLedgerCache:1078 | resolveScene:1084 | dispatchProblem:1095 | sendDispatch:1104 | readDispatchReport:1111 | settleDispatch:1119 | openingOccupied:1151 | breachProblem:1165 | breach:1174 | door:1202 | barricade:1228 | unboard:1243 | removeBarrier:1254 | minutesToRain:1265 | sight:1288 | canSee:1295 | drainLight:1304 | useTap:1313 | useGenerator:1333 | updateUtilities:1353 | fireBatch:1385 | startFireBatch:1392 | collectFireBatch:1407 | wildProblem:1441 | useWild:1461 | sow:1491 | waterGarden:1501 | gardenYield:1509 | harvestGarden:1515 | growGarden:1528 | updateOutdoor:1540 | catchUpArea:1551 | evaAtShelter:1571 | toggleGardenHelp:1576 | tendShelterGarden:1585 | contextual:1604 | recruit:1664 | threats:1674 | damageFactor:1678 | aimChance:1685 | inAttackRange:1690 | closestInReach:1694 | attackTarget:1705 | weaponProblem:1711 | endPursuit:1717 | endWindup:1723 | faceTowards:1728 | defeat:1733 | attack:1741 | shove:1778 | hurt:1796 | move:1831 | follow:1863 | walkTo:1889 | target:1901 | approach:1908 | updatePlayer:1922 | canTargetEva:1984 | updateEnemies:1988 | updateNpc:2080 | explore:2103 | updateExposure:2113 | updateNeeds:2125 | tick:2160 | updateDoorLure:2200 | breakLeg:2227 | healFracture:2235 | updateSickness:2244 | freeSpot:2267 | unstick:2280 | startSleep:2297 | fastSleep:2307 | sleep:2321 | moodles:2328 | snapshotPlayer:2352 | snapshotZone:2356 | snapshotRun:2364 | zoneShape:2377 | migrate:2392 | restore:2398

## game/view.js (1310 lines)
resize:17 | updateCamera:28 | poly:51 | line:60 | shadow:70 | box:78 | tint:86 | prepare:92 | bloodPool:113 | microDetail:118 | tileArt:139 | tendril:184 | tile:198 | glowSprite:216 | glow:233 | wall:243 | prop:285 | roof:701 | roofCoversPlayer:718 | marker:726 | actor:747 | flashlightBeam:873 | chunkSignature:903 | buildChunk:911 | groundLayer:939 | dimAround:956 | render:969 | locate:1209 | mapFit:1229 | mapPoint:1234 | minimapLayer:1242 | minimap:1261

## game/game.js (1945 lines)
read:38 | write:42 | backUp:46 | save:55 | clearStick:76 | resetInput:83 | updateDisplayMode:96 | toggleFullscreen:108 | activate:133 | start:153 | showStartDetail:166 | rememberSetup:175 | worldRulesEditor:181 | applyWorldRules:199 | resumeSaved:215 | show:233 | close:247 | menu:255 | titleScreen:264 | wakeSound:279 | cue:289 | syncSound:301 | objectives:310 | objectiveHtml:320 | skillsHtml:324 | statusText:334 | nearbyObjects:350 | interactionLabel:364 | canTalk:375 | setHtml:381 | updateHud:387 | help:453 | landmarks:463 | map:471 | savePinForm:520 | itemDescription:531 | matches:547 | inventoryItems:557 | nearbyItems:580 | updateInventoryLists:601 | bag:643 | useBelt:674 | updateBelt:681 | beltPanel:700 | gear:714 | editSurvivor:750 | crafting:759 | health:780 | diary:807 | dispatchStatus:830 | fieldLedger:845 | ledgerEntry:871 | ledgerReport:877 | ledgerPanel:886 | playtestReport:913 | copyPlaytest:943 | knownStory:956 | storyText:961 | outbreakLog:965 | storyEntry:974 | supplyRun:983 | gardenStatus:1011 | gardenProject:1020 | waterProject:1040 | utilities:1061 | releases:1080 | research:1087 | npcPanel:1095 | gardenPanel:1112 | stationPanel:1136 | objectPanel:1183 | interact:1294 | interactions:1303 | nearbyAction:1320 | strike:1336 | quickUse:1344 | pause:1351 | exportSave:1358 | refreshPanel:1365 | bagChanged:1373 | changeInventory:1383 | bindTap:1645 | updateStick:1718 | shoveOrBrake:1746 | frame:1842
