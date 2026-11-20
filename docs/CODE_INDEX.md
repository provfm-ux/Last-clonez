# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (292 lines)
worldRules:146 | character:213

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

## game/world.js (188 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:47 | build:57 | clear:116 | drivable:123 | sees:127 | route:137

## game/atmosphere.js (148 lines)
place:55 | clearCell:58 | add:62 | nextWave:118 | create:122 | restore:128

## game/soundscape.js (107 lines)
makeBuffer:19 | play:68 | stop:96

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (2937 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | placeStartingBat:155 | create:168 | createControl:243 | difficultyOptions:295 | setDifficulty:304 | dangerRating:323 | recordPlaytest:331 | createRecommended:335 | pinnedGoal:352 | nearby:361 | containers:365 | unreadClueAt:381 | nearbyClues:388 | readClue:393 | isSupplyCache:399 | nearbySupplyCache:404 | collectSupplyCache:410 | sources:422 | available:426 | consume:430 | collect:444 | collectAll:467 | drop:486 | stash:518 | use:528 | beltItem:595 | setBelt:603 | useBelt:610 | activeLight:619 | replaceBattery:624 | toggleLight:633 | recipeProblem:648 | craft:659 | place:673 | vehicle:711 | enterVehicle:715 | exitVehicle:736 | refuel:764 | vehicleRepairProblem:778 | repairVehicle:786 | brake:796 | updateVehicle:803 | destination:880 | markDestination:893 | markStation:913 | travelProblem:920 | arrivalPosition:930 | travel:941 | exploredTile:977 | saveMapPin:982 | markPin:1001 | removePin:1009 | noise:1017 | hear:1033 | encounterSlots:1038 | newInfected:1044 | freeEncounterSpot:1050 | wakeNest:1056 | touchFungus:1075 | noticeCrib:1079 | inspectCrib:1089 | warnHorde:1095 | resumeEncounterWarning:1102 | waveSpots:1106 | updateHordes:1116 | armWatch:1172 | updateAtmosphere:1182 | listenAtDoor:1243 | sceneProblem:1263 | revealLedgerCache:1268 | resolveScene:1274 | dispatchProblem:1300 | sendDispatch:1309 | readDispatchReport:1316 | settleDispatch:1324 | openingOccupied:1356 | breachProblem:1370 | breach:1379 | door:1407 | barricade:1433 | unboard:1448 | removeBarrier:1459 | minutesToRain:1470 | sight:1493 | canSee:1500 | drainLight:1509 | useTap:1518 | useGenerator:1538 | updateUtilities:1558 | fireBatch:1590 | startFireBatch:1597 | collectFireBatch:1612 | wildProblem:1646 | useWild:1666 | sow:1696 | waterGarden:1706 | gardenYield:1714 | harvestGarden:1720 | growGarden:1733 | updateOutdoor:1745 | catchUpArea:1756 | evaAtShelter:1776 | toggleGardenHelp:1781 | tendShelterGarden:1790 | contextual:1809 | recruit:1869 | threats:1879 | damageFactor:1883 | aimChance:1890 | inAttackRange:1895 | closestInReach:1899 | attackTarget:1910 | touchAttackTarget:1916 | weaponProblem:1931 | endPursuit:1937 | endWindup:1943 | faceTowards:1948 | defeat:1953 | attack:1962 | shove:2004 | hurt:2030 | move:2066 | follow:2103 | walkTo:2129 | target:2141 | approach:2148 | updatePlayer:2162 | canTargetEva:2225 | updateEnemies:2229 | updateNpc:2322 | explore:2345 | updateExposure:2355 | updateNeeds:2367 | tick:2402 | updateDoorLure:2453 | breakLeg:2480 | healFracture:2488 | updateSickness:2497 | freeSpot:2520 | unstick:2533 | startSleep:2550 | fastSleep:2560 | sleep:2575 | moodles:2582 | snapshotPlayer:2606 | snapshotZone:2610 | snapshotRun:2618 | zoneShape:2634 | migrate:2649 | restore:2655

## game/view.js (2319 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | actor:1350 | beamReach:1504 | flashlightBeam:1514 | warmBeamSprite:1534 | warmFlashlight:1557 | windowGlow:1583 | weatherEffects:1607 | drawDestination:1643 | chunkSignature:1670 | buildChunk:1678 | groundLayer:1706 | dimAround:1723 | afterlifePixels:1761 | afterlifePortrait:1788 | renderAfterlife:1800 | render:1948 | locate:2211 | mapFit:2231 | mapPoint:2236 | minimapLayer:2244 | minimap:2263

## game/game.js (2388 lines)
read:62 | write:66 | backUp:70 | save:79 | clearStick:100 | resetInput:107 | updateDisplayMode:120 | toggleFullscreen:132 | activate:157 | setNavigation:177 | opening:184 | startLesson:198 | endLesson:210 | updateLesson:223 | startAfterlife:247 | deathSummary:256 | skipAfterlife:266 | endAfterlife:272 | afterlifeAction:279 | start:283 | startRecommended:301 | showStartDetail:314 | savedAssists:327 | assistsOn:334 | difficultyPanel:339 | applyDifficulty:360 | rememberSetup:381 | worldRulesEditor:387 | applyWorldRules:405 | resumeSaved:421 | show:439 | close:453 | menu:466 | titleScreen:476 | wakeSound:494 | cue:504 | syncSound:516 | objectives:525 | objectiveHtml:535 | skillsHtml:539 | conditions:549 | nearbyObjects:564 | interactionLabel:578 | canTalk:589 | setHtml:595 | updateHud:601 | help:727 | landmarks:737 | map:747 | savePinForm:797 | itemIcon:808 | itemDescription:813 | matches:838 | inventoryItems:848 | nearbyItems:871 | updateInventoryLists:892 | bag:934 | useBelt:966 | updateBelt:973 | beltPanel:992 | gear:1006 | editSurvivor:1042 | crafting:1051 | health:1072 | diary:1102 | dispatchStatus:1125 | fieldLedger:1140 | ledgerEntry:1179 | ledgerReport:1185 | ledgerPanel:1194 | playtestReport:1230 | copyPlaytest:1274 | knownStory:1287 | storyText:1292 | outbreakLog:1296 | storyEntry:1305 | supplyRun:1314 | gardenStatus:1342 | gardenProject:1351 | waterProject:1371 | utilities:1392 | releases:1411 | research:1418 | npcPanel:1426 | gardenPanel:1443 | stationPanel:1467 | objectPanel:1514 | interact:1625 | interactions:1634 | nearbyAction:1651 | strike:1680 | quickUse:1688 | pause:1695 | visualAtmosphere:1705 | atmospherePanel:1709 | applyAtmosphere:1719 | exportSave:1730 | refreshPanel:1737 | bagChanged:1745 | changeInventory:1755 | bindTap:2042 | updateStick:2115 | shoveOrBrake:2143 | frame:2265
