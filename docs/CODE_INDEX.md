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

## game/sim.js (2662 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:198 | nearby:236 | containers:240 | unreadClueAt:256 | nearbyClues:263 | readClue:268 | isSupplyCache:274 | nearbySupplyCache:279 | collectSupplyCache:285 | sources:297 | available:301 | consume:305 | collect:319 | collectAll:336 | drop:355 | stash:387 | use:397 | beltItem:459 | setBelt:467 | useBelt:474 | activeLight:483 | replaceBattery:488 | toggleLight:497 | recipeProblem:512 | craft:523 | place:537 | vehicle:575 | enterVehicle:579 | exitVehicle:600 | refuel:628 | vehicleRepairProblem:642 | repairVehicle:650 | brake:660 | updateVehicle:667 | destination:744 | markDestination:755 | markStation:775 | travelProblem:782 | arrivalPosition:792 | travel:803 | exploredTile:839 | saveMapPin:844 | markPin:863 | removePin:871 | noise:879 | hear:892 | encounterSlots:897 | newInfected:903 | freeEncounterSpot:909 | wakeNest:915 | touchFungus:934 | noticeCrib:938 | inspectCrib:948 | warnHorde:954 | resumeEncounterWarning:961 | waveSpots:965 | updateHordes:975 | armWatch:1011 | updateAtmosphere:1021 | listenAtDoor:1069 | sceneProblem:1089 | revealLedgerCache:1094 | resolveScene:1100 | dispatchProblem:1111 | sendDispatch:1120 | readDispatchReport:1127 | settleDispatch:1135 | openingOccupied:1167 | breachProblem:1181 | breach:1190 | door:1218 | barricade:1244 | unboard:1259 | removeBarrier:1270 | minutesToRain:1281 | sight:1304 | canSee:1311 | drainLight:1320 | useTap:1329 | useGenerator:1349 | updateUtilities:1369 | fireBatch:1401 | startFireBatch:1408 | collectFireBatch:1423 | wildProblem:1457 | useWild:1477 | sow:1507 | waterGarden:1517 | gardenYield:1525 | harvestGarden:1531 | growGarden:1544 | updateOutdoor:1556 | catchUpArea:1567 | evaAtShelter:1587 | toggleGardenHelp:1592 | tendShelterGarden:1601 | contextual:1620 | recruit:1680 | threats:1690 | damageFactor:1694 | aimChance:1701 | inAttackRange:1706 | closestInReach:1710 | attackTarget:1721 | weaponProblem:1727 | endPursuit:1733 | endWindup:1739 | faceTowards:1744 | defeat:1749 | attack:1757 | shove:1794 | hurt:1812 | move:1847 | follow:1884 | walkTo:1910 | target:1922 | approach:1929 | updatePlayer:1943 | canTargetEva:2005 | updateEnemies:2009 | updateNpc:2101 | explore:2124 | updateExposure:2134 | updateNeeds:2146 | tick:2181 | updateDoorLure:2221 | breakLeg:2248 | healFracture:2256 | updateSickness:2265 | freeSpot:2288 | unstick:2301 | startSleep:2318 | fastSleep:2328 | sleep:2342 | moodles:2349 | snapshotPlayer:2373 | snapshotZone:2377 | snapshotRun:2385 | zoneShape:2398 | migrate:2413 | restore:2419

## game/view.js (1570 lines)
resize:19 | updateCamera:30 | poly:53 | line:62 | shadow:72 | box:80 | tint:88 | prepare:94 | bloodPool:148 | microDetail:153 | tileArt:174 | tendril:229 | tile:243 | glowSprite:261 | glow:278 | wall:289 | paintWall:316 | gardenTree:349 | prop:382 | roof:818 | roofArt:840 | roofCoversPlayer:874 | marker:882 | actorFrame:907 | microActor:971 | actor:995 | flashlightBeam:1131 | chunkSignature:1161 | buildChunk:1169 | groundLayer:1197 | dimAround:1214 | render:1227 | locate:1469 | mapFit:1489 | mapPoint:1494 | minimapLayer:1502 | minimap:1521

## game/game.js (1962 lines)
read:38 | write:42 | backUp:46 | save:55 | clearStick:76 | resetInput:83 | updateDisplayMode:96 | toggleFullscreen:108 | activate:133 | start:153 | showStartDetail:166 | rememberSetup:175 | worldRulesEditor:181 | applyWorldRules:199 | resumeSaved:215 | show:233 | close:247 | menu:255 | titleScreen:264 | wakeSound:279 | cue:289 | syncSound:301 | objectives:310 | objectiveHtml:320 | skillsHtml:324 | statusText:334 | nearbyObjects:350 | interactionLabel:364 | canTalk:375 | setHtml:381 | updateHud:387 | help:457 | landmarks:467 | map:475 | savePinForm:524 | itemDescription:535 | matches:551 | inventoryItems:561 | nearbyItems:584 | updateInventoryLists:605 | bag:647 | useBelt:678 | updateBelt:685 | beltPanel:704 | gear:718 | editSurvivor:754 | crafting:763 | health:784 | diary:811 | dispatchStatus:834 | fieldLedger:849 | ledgerEntry:875 | ledgerReport:881 | ledgerPanel:890 | playtestReport:917 | copyPlaytest:947 | knownStory:960 | storyText:965 | outbreakLog:969 | storyEntry:978 | supplyRun:987 | gardenStatus:1015 | gardenProject:1024 | waterProject:1044 | utilities:1065 | releases:1084 | research:1091 | npcPanel:1099 | gardenPanel:1116 | stationPanel:1140 | objectPanel:1187 | interact:1298 | interactions:1307 | nearbyAction:1324 | strike:1353 | quickUse:1361 | pause:1368 | exportSave:1375 | refreshPanel:1382 | bagChanged:1390 | changeInventory:1400 | bindTap:1662 | updateStick:1735 | shoveOrBrake:1763 | frame:1859
