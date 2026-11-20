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

## game/sim.js (2947 lines)
weapon:19 | unequipWeapon:26 | addXp:36 | add:59 | remove:72 | notify:82 | stockGardenSeeds:88 | prepareSupplies:100 | addUtilities:119 | stockFieldGear:137 | placeStartingBat:165 | create:177 | createControl:252 | difficultyOptions:304 | setDifficulty:313 | dangerRating:332 | recordPlaytest:340 | createRecommended:344 | pinnedGoal:361 | nearby:370 | containers:374 | unreadClueAt:390 | nearbyClues:397 | readClue:402 | isSupplyCache:408 | nearbySupplyCache:413 | collectSupplyCache:419 | sources:431 | available:435 | consume:439 | collect:453 | collectAll:476 | drop:495 | stash:523 | use:533 | beltItem:600 | setBelt:608 | useBelt:615 | activeLight:624 | replaceBattery:629 | toggleLight:638 | recipeProblem:653 | craft:665 | place:679 | vehicle:717 | enterVehicle:721 | exitVehicle:742 | refuel:770 | vehicleRepairProblem:784 | repairVehicle:792 | brake:802 | updateVehicle:809 | destination:886 | markDestination:899 | markStation:919 | travelProblem:926 | arrivalPosition:936 | travel:947 | exploredTile:983 | saveMapPin:988 | markPin:1007 | removePin:1015 | noise:1023 | hear:1039 | encounterSlots:1044 | newInfected:1050 | freeEncounterSpot:1056 | wakeNest:1062 | touchFungus:1081 | noticeCrib:1085 | inspectCrib:1095 | warnHorde:1101 | resumeEncounterWarning:1108 | waveSpots:1112 | updateHordes:1122 | armWatch:1178 | updateAtmosphere:1188 | listenAtDoor:1249 | sceneProblem:1269 | revealLedgerCache:1274 | resolveScene:1280 | dispatchProblem:1306 | sendDispatch:1315 | readDispatchReport:1322 | settleDispatch:1330 | openingOccupied:1362 | breachProblem:1376 | breach:1385 | door:1413 | barricade:1439 | unboard:1454 | removeBarrier:1465 | minutesToRain:1476 | sight:1499 | canSee:1506 | drainLight:1515 | useTap:1524 | useGenerator:1544 | updateUtilities:1564 | fireBatch:1596 | startFireBatch:1603 | collectFireBatch:1618 | wildProblem:1652 | useWild:1672 | sow:1702 | waterGarden:1712 | gardenYield:1720 | harvestGarden:1726 | growGarden:1739 | updateOutdoor:1751 | catchUpArea:1762 | evaAtShelter:1782 | toggleGardenHelp:1787 | tendShelterGarden:1796 | contextual:1815 | recruit:1875 | threats:1885 | damageFactor:1889 | aimChance:1896 | inAttackRange:1901 | closestInReach:1905 | attackTarget:1916 | touchAttackTarget:1922 | weaponProblem:1937 | endPursuit:1943 | endWindup:1949 | faceTowards:1954 | defeat:1959 | attack:1968 | shove:2011 | hurt:2037 | move:2073 | follow:2110 | walkTo:2136 | target:2148 | approach:2155 | updatePlayer:2169 | canTargetEva:2232 | updateEnemies:2236 | updateNpc:2329 | explore:2352 | updateExposure:2362 | updateNeeds:2374 | tick:2409 | updateDoorLure:2460 | breakLeg:2487 | healFracture:2495 | updateSickness:2504 | freeSpot:2527 | unstick:2540 | startSleep:2557 | fastSleep:2567 | sleep:2582 | moodles:2589 | snapshotPlayer:2613 | snapshotZone:2617 | snapshotRun:2625 | zoneShape:2641 | migrate:2656 | restore:2662

## game/view.js (2332 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | equipmentPortrait:1350 | actor:1363 | beamReach:1517 | flashlightBeam:1527 | warmBeamSprite:1547 | warmFlashlight:1570 | windowGlow:1596 | weatherEffects:1620 | drawDestination:1656 | chunkSignature:1683 | buildChunk:1691 | groundLayer:1719 | dimAround:1736 | afterlifePixels:1774 | afterlifePortrait:1801 | renderAfterlife:1813 | render:1961 | locate:2224 | mapFit:2244 | mapPoint:2249 | minimapLayer:2257 | minimap:2276

## game/game.js (2433 lines)
read:62 | write:66 | backUp:70 | save:79 | clearStick:100 | resetInput:107 | updateDisplayMode:120 | toggleFullscreen:132 | activate:157 | setNavigation:177 | opening:184 | startLesson:198 | endLesson:210 | updateLesson:223 | startAfterlife:247 | deathSummary:256 | skipAfterlife:266 | endAfterlife:272 | afterlifeAction:279 | start:283 | startRecommended:301 | showStartDetail:314 | savedAssists:327 | assistsOn:334 | difficultyPanel:339 | applyDifficulty:360 | rememberSetup:381 | worldRulesEditor:387 | applyWorldRules:405 | resumeSaved:421 | show:439 | close:453 | menu:466 | titleScreen:476 | wakeSound:494 | cue:504 | syncSound:516 | objectives:525 | objectiveHtml:535 | skillsHtml:539 | conditions:549 | nearbyObjects:564 | interactionLabel:578 | canTalk:589 | setHtml:595 | updateHud:601 | help:727 | landmarks:737 | map:747 | savePinForm:797 | itemIcon:808 | weaponCondition:813 | itemDescription:819 | matches:844 | inventoryItems:854 | nearbyItems:877 | updateInventoryLists:898 | bag:940 | useBelt:973 | updateBelt:980 | beltPanel:999 | gear:1013 | editSurvivor:1063 | crafting:1072 | health:1093 | diary:1123 | dispatchStatus:1146 | fieldLedger:1161 | ledgerEntry:1200 | ledgerReport:1206 | ledgerPanel:1215 | playtestReport:1251 | copyPlaytest:1295 | knownStory:1308 | storyText:1313 | outbreakLog:1317 | storyEntry:1326 | supplyRun:1335 | gardenStatus:1363 | gardenProject:1372 | waterProject:1392 | utilities:1413 | releases:1432 | research:1439 | npcPanel:1447 | gardenPanel:1464 | stationPanel:1488 | objectPanel:1535 | interact:1646 | interactions:1655 | nearbyAction:1672 | strike:1701 | quickUse:1709 | pause:1716 | visualAtmosphere:1726 | atmospherePanel:1730 | applyAtmosphere:1740 | exportSave:1751 | refreshPanel:1758 | bagChanged:1766 | changeInventory:1776 | bindTap:2087 | updateStick:2160 | shoveOrBrake:2188 | frame:2310
