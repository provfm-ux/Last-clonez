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

## game/sim.js (2730 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:221 | nearby:259 | containers:263 | unreadClueAt:279 | nearbyClues:286 | readClue:291 | isSupplyCache:297 | nearbySupplyCache:302 | collectSupplyCache:308 | sources:320 | available:324 | consume:328 | collect:342 | collectAll:359 | drop:378 | stash:410 | use:420 | beltItem:482 | setBelt:490 | useBelt:497 | activeLight:506 | replaceBattery:511 | toggleLight:520 | recipeProblem:535 | craft:546 | place:560 | vehicle:598 | enterVehicle:602 | exitVehicle:623 | refuel:651 | vehicleRepairProblem:665 | repairVehicle:673 | brake:683 | updateVehicle:690 | destination:767 | markDestination:778 | markStation:798 | travelProblem:805 | arrivalPosition:815 | travel:826 | exploredTile:862 | saveMapPin:867 | markPin:886 | removePin:894 | noise:902 | hear:918 | encounterSlots:923 | newInfected:929 | freeEncounterSpot:935 | wakeNest:941 | touchFungus:960 | noticeCrib:964 | inspectCrib:974 | warnHorde:980 | resumeEncounterWarning:987 | waveSpots:991 | updateHordes:1001 | armWatch:1037 | updateAtmosphere:1047 | listenAtDoor:1108 | sceneProblem:1128 | revealLedgerCache:1133 | resolveScene:1139 | dispatchProblem:1165 | sendDispatch:1174 | readDispatchReport:1181 | settleDispatch:1189 | openingOccupied:1221 | breachProblem:1235 | breach:1244 | door:1272 | barricade:1298 | unboard:1313 | removeBarrier:1324 | minutesToRain:1335 | sight:1358 | canSee:1365 | drainLight:1374 | useTap:1383 | useGenerator:1403 | updateUtilities:1423 | fireBatch:1455 | startFireBatch:1462 | collectFireBatch:1477 | wildProblem:1511 | useWild:1531 | sow:1561 | waterGarden:1571 | gardenYield:1579 | harvestGarden:1585 | growGarden:1598 | updateOutdoor:1610 | catchUpArea:1621 | evaAtShelter:1641 | toggleGardenHelp:1646 | tendShelterGarden:1655 | contextual:1674 | recruit:1734 | threats:1744 | damageFactor:1748 | aimChance:1755 | inAttackRange:1760 | closestInReach:1764 | attackTarget:1775 | weaponProblem:1781 | endPursuit:1787 | endWindup:1793 | faceTowards:1798 | defeat:1803 | attack:1812 | shove:1850 | hurt:1869 | move:1904 | follow:1941 | walkTo:1967 | target:1979 | approach:1986 | updatePlayer:2000 | canTargetEva:2062 | updateEnemies:2066 | updateNpc:2159 | explore:2182 | updateExposure:2192 | updateNeeds:2204 | tick:2239 | updateDoorLure:2286 | breakLeg:2313 | healFracture:2321 | updateSickness:2330 | freeSpot:2353 | unstick:2366 | startSleep:2383 | fastSleep:2393 | sleep:2407 | moodles:2414 | snapshotPlayer:2438 | snapshotZone:2442 | snapshotRun:2450 | zoneShape:2463 | migrate:2478 | restore:2484

## game/view.js (2115 lines)
resize:19 | updateCamera:30 | poly:53 | line:62 | shadow:72 | box:80 | tint:88 | prepare:94 | bloodPool:152 | microDetail:157 | tileArt:182 | tendril:248 | tile:262 | glowSprite:280 | glow:297 | wall:308 | paintWall:335 | gardenTree:368 | paintFurniture:404 | drawFurniture:523 | prop:542 | roof:1026 | roofArt:1048 | roofCoversPlayer:1082 | marker:1090 | actorFrame:1115 | drawHeldWeapon:1205 | drawZombieSprite:1236 | microActor:1267 | actor:1308 | flashlightBeam:1457 | chunkSignature:1487 | buildChunk:1495 | groundLayer:1523 | dimAround:1540 | afterlifePixels:1578 | afterlifePortrait:1605 | renderAfterlife:1617 | render:1765 | locate:2007 | mapFit:2027 | mapPoint:2032 | minimapLayer:2040 | minimap:2059

## game/game.js (2129 lines)
read:40 | write:44 | backUp:48 | save:57 | clearStick:78 | resetInput:85 | updateDisplayMode:98 | toggleFullscreen:110 | activate:135 | startLesson:155 | endLesson:167 | updateLesson:179 | startAfterlife:203 | endAfterlife:213 | afterlifeAction:219 | start:223 | showStartDetail:236 | rememberSetup:245 | worldRulesEditor:251 | applyWorldRules:269 | resumeSaved:285 | show:303 | close:317 | menu:325 | titleScreen:335 | wakeSound:352 | cue:362 | syncSound:374 | objectives:383 | objectiveHtml:393 | skillsHtml:397 | statusText:407 | nearbyObjects:423 | interactionLabel:437 | canTalk:448 | setHtml:454 | updateHud:460 | help:566 | landmarks:576 | map:586 | savePinForm:635 | itemDescription:646 | matches:662 | inventoryItems:672 | nearbyItems:695 | updateInventoryLists:716 | bag:758 | useBelt:790 | updateBelt:797 | beltPanel:816 | gear:830 | editSurvivor:866 | crafting:875 | health:896 | diary:923 | dispatchStatus:946 | fieldLedger:961 | ledgerEntry:994 | ledgerReport:1000 | ledgerPanel:1009 | playtestReport:1045 | copyPlaytest:1075 | knownStory:1088 | storyText:1093 | outbreakLog:1097 | storyEntry:1106 | supplyRun:1115 | gardenStatus:1143 | gardenProject:1152 | waterProject:1172 | utilities:1193 | releases:1212 | research:1219 | npcPanel:1227 | gardenPanel:1244 | stationPanel:1268 | objectPanel:1315 | interact:1426 | interactions:1435 | nearbyAction:1452 | strike:1481 | quickUse:1489 | pause:1496 | exportSave:1503 | refreshPanel:1510 | bagChanged:1518 | changeInventory:1528 | bindTap:1797 | updateStick:1870 | shoveOrBrake:1898 | frame:2009
