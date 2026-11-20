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

## game/sim.js (2939 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | placeStartingBat:155 | create:168 | createControl:243 | difficultyOptions:295 | setDifficulty:304 | dangerRating:323 | recordPlaytest:331 | createRecommended:335 | pinnedGoal:352 | nearby:361 | containers:365 | unreadClueAt:381 | nearbyClues:388 | readClue:393 | isSupplyCache:399 | nearbySupplyCache:404 | collectSupplyCache:410 | sources:422 | available:426 | consume:430 | collect:444 | collectAll:467 | drop:486 | stash:518 | use:528 | beltItem:595 | setBelt:603 | useBelt:610 | activeLight:619 | replaceBattery:624 | toggleLight:633 | recipeProblem:648 | craft:660 | place:674 | vehicle:712 | enterVehicle:716 | exitVehicle:737 | refuel:765 | vehicleRepairProblem:779 | repairVehicle:787 | brake:797 | updateVehicle:804 | destination:881 | markDestination:894 | markStation:914 | travelProblem:921 | arrivalPosition:931 | travel:942 | exploredTile:978 | saveMapPin:983 | markPin:1002 | removePin:1010 | noise:1018 | hear:1034 | encounterSlots:1039 | newInfected:1045 | freeEncounterSpot:1051 | wakeNest:1057 | touchFungus:1076 | noticeCrib:1080 | inspectCrib:1090 | warnHorde:1096 | resumeEncounterWarning:1103 | waveSpots:1107 | updateHordes:1117 | armWatch:1173 | updateAtmosphere:1183 | listenAtDoor:1244 | sceneProblem:1264 | revealLedgerCache:1269 | resolveScene:1275 | dispatchProblem:1301 | sendDispatch:1310 | readDispatchReport:1317 | settleDispatch:1325 | openingOccupied:1357 | breachProblem:1371 | breach:1380 | door:1408 | barricade:1434 | unboard:1449 | removeBarrier:1460 | minutesToRain:1471 | sight:1494 | canSee:1501 | drainLight:1510 | useTap:1519 | useGenerator:1539 | updateUtilities:1559 | fireBatch:1591 | startFireBatch:1598 | collectFireBatch:1613 | wildProblem:1647 | useWild:1667 | sow:1697 | waterGarden:1707 | gardenYield:1715 | harvestGarden:1721 | growGarden:1734 | updateOutdoor:1746 | catchUpArea:1757 | evaAtShelter:1777 | toggleGardenHelp:1782 | tendShelterGarden:1791 | contextual:1810 | recruit:1870 | threats:1880 | damageFactor:1884 | aimChance:1891 | inAttackRange:1896 | closestInReach:1900 | attackTarget:1911 | touchAttackTarget:1917 | weaponProblem:1932 | endPursuit:1938 | endWindup:1944 | faceTowards:1949 | defeat:1954 | attack:1963 | shove:2006 | hurt:2032 | move:2068 | follow:2105 | walkTo:2131 | target:2143 | approach:2150 | updatePlayer:2164 | canTargetEva:2227 | updateEnemies:2231 | updateNpc:2324 | explore:2347 | updateExposure:2357 | updateNeeds:2369 | tick:2404 | updateDoorLure:2455 | breakLeg:2482 | healFracture:2490 | updateSickness:2499 | freeSpot:2522 | unstick:2535 | startSleep:2552 | fastSleep:2562 | sleep:2577 | moodles:2584 | snapshotPlayer:2608 | snapshotZone:2612 | snapshotRun:2620 | zoneShape:2636 | migrate:2651 | restore:2657

## game/view.js (2332 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | equipmentPortrait:1350 | actor:1363 | beamReach:1517 | flashlightBeam:1527 | warmBeamSprite:1547 | warmFlashlight:1570 | windowGlow:1596 | weatherEffects:1620 | drawDestination:1656 | chunkSignature:1683 | buildChunk:1691 | groundLayer:1719 | dimAround:1736 | afterlifePixels:1774 | afterlifePortrait:1801 | renderAfterlife:1813 | render:1961 | locate:2224 | mapFit:2244 | mapPoint:2249 | minimapLayer:2257 | minimap:2276

## game/game.js (2422 lines)
read:62 | write:66 | backUp:70 | save:79 | clearStick:100 | resetInput:107 | updateDisplayMode:120 | toggleFullscreen:132 | activate:157 | setNavigation:177 | opening:184 | startLesson:198 | endLesson:210 | updateLesson:223 | startAfterlife:247 | deathSummary:256 | skipAfterlife:266 | endAfterlife:272 | afterlifeAction:279 | start:283 | startRecommended:301 | showStartDetail:314 | savedAssists:327 | assistsOn:334 | difficultyPanel:339 | applyDifficulty:360 | rememberSetup:381 | worldRulesEditor:387 | applyWorldRules:405 | resumeSaved:421 | show:439 | close:453 | menu:466 | titleScreen:476 | wakeSound:494 | cue:504 | syncSound:516 | objectives:525 | objectiveHtml:535 | skillsHtml:539 | conditions:549 | nearbyObjects:564 | interactionLabel:578 | canTalk:589 | setHtml:595 | updateHud:601 | help:727 | landmarks:737 | map:747 | savePinForm:797 | itemIcon:808 | weaponCondition:813 | itemDescription:819 | matches:844 | inventoryItems:854 | nearbyItems:877 | updateInventoryLists:898 | bag:940 | useBelt:973 | updateBelt:980 | beltPanel:999 | gear:1013 | editSurvivor:1062 | crafting:1071 | health:1092 | diary:1122 | dispatchStatus:1145 | fieldLedger:1160 | ledgerEntry:1199 | ledgerReport:1205 | ledgerPanel:1214 | playtestReport:1250 | copyPlaytest:1294 | knownStory:1307 | storyText:1312 | outbreakLog:1316 | storyEntry:1325 | supplyRun:1334 | gardenStatus:1362 | gardenProject:1371 | waterProject:1391 | utilities:1412 | releases:1431 | research:1438 | npcPanel:1446 | gardenPanel:1463 | stationPanel:1487 | objectPanel:1534 | interact:1645 | interactions:1654 | nearbyAction:1671 | strike:1700 | quickUse:1708 | pause:1715 | visualAtmosphere:1725 | atmospherePanel:1729 | applyAtmosphere:1739 | exportSave:1750 | refreshPanel:1757 | bagChanged:1765 | changeInventory:1775 | bindTap:2076 | updateStick:2149 | shoveOrBrake:2177 | frame:2299
