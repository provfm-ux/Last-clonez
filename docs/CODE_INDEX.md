# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (309 lines)
worldRules:163 | character:230

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

## game/recordings.js (5 lines)
(no named functions)

## game/soundscape.js (131 lines)
makeBuffer:20 | decodeRecording:69 | preload:79 | play:91 | stop:120

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (3013 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:850 | updateVehicle:857 | destination:934 | markDestination:947 | markStation:967 | travelProblem:974 | arrivalPosition:984 | travel:995 | exploredTile:1031 | saveMapPin:1036 | markPin:1055 | removePin:1063 | noise:1071 | hear:1087 | encounterSlots:1092 | newInfected:1098 | freeEncounterSpot:1104 | wakeNest:1110 | touchFungus:1129 | noticeCrib:1133 | inspectCrib:1143 | warnHorde:1149 | resumeEncounterWarning:1156 | waveSpots:1160 | updateHordes:1170 | armWatch:1226 | updateAtmosphere:1236 | listenAtDoor:1297 | sceneProblem:1317 | revealLedgerCache:1322 | resolveScene:1328 | dispatchProblem:1354 | sendDispatch:1363 | readDispatchReport:1370 | settleDispatch:1378 | openingOccupied:1410 | breachProblem:1424 | breach:1433 | door:1461 | barricade:1487 | unboard:1502 | removeBarrier:1513 | minutesToRain:1524 | sight:1547 | canSee:1554 | drainLight:1563 | useTap:1572 | useGenerator:1592 | updateUtilities:1612 | fireBatch:1644 | startFireBatch:1651 | collectFireBatch:1666 | wildProblem:1700 | useWild:1720 | sow:1750 | waterGarden:1760 | gardenYield:1768 | harvestGarden:1774 | growGarden:1787 | updateOutdoor:1799 | catchUpArea:1810 | evaAtShelter:1830 | toggleGardenHelp:1835 | tendShelterGarden:1844 | contextual:1863 | recruit:1923 | threats:1933 | damageFactor:1937 | aimChance:1944 | inAttackRange:1949 | closestInReach:1953 | attackTarget:1964 | touchAttackTarget:1970 | weaponProblem:1985 | endPursuit:1991 | endWindup:1997 | faceTowards:2002 | defeat:2007 | attack:2016 | shove:2059 | hurt:2085 | move:2133 | follow:2170 | walkTo:2196 | target:2208 | approach:2215 | updatePlayer:2229 | canTargetEva:2292 | updateEnemies:2296 | updateNpc:2389 | explore:2412 | updateExposure:2422 | updateNeeds:2434 | tick:2469 | updateDoorLure:2520 | breakLeg:2547 | healFracture:2555 | updateSickness:2564 | freeSpot:2587 | unstick:2600 | startSleep:2617 | fastSleep:2627 | sleep:2642 | moodles:2649 | snapshotPlayer:2673 | snapshotZone:2677 | snapshotRun:2685 | zoneShape:2701 | migrate:2716 | restore:2722

## game/view.js (2332 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | equipmentPortrait:1350 | actor:1363 | beamReach:1517 | flashlightBeam:1527 | warmBeamSprite:1547 | warmFlashlight:1570 | windowGlow:1596 | weatherEffects:1620 | drawDestination:1656 | chunkSignature:1683 | buildChunk:1691 | groundLayer:1719 | dimAround:1736 | afterlifePixels:1774 | afterlifePortrait:1801 | renderAfterlife:1813 | render:1961 | locate:2224 | mapFit:2244 | mapPoint:2249 | minimapLayer:2257 | minimap:2276

## game/game.js (2453 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | start:287 | startRecommended:305 | showStartDetail:318 | savedAssists:331 | assistsOn:338 | difficultyPanel:343 | applyDifficulty:364 | rememberSetup:385 | worldRulesEditor:391 | applyWorldRules:409 | resumeSaved:425 | show:443 | close:457 | menu:470 | titleScreen:480 | wakeSound:498 | cue:511 | syncSound:523 | objectives:532 | objectiveHtml:542 | skillsHtml:546 | conditions:556 | nearbyObjects:571 | interactionLabel:585 | canTalk:596 | setHtml:602 | updateHud:608 | help:736 | landmarks:746 | map:756 | savePinForm:806 | itemIcon:817 | weaponCondition:822 | itemDescription:828 | matches:856 | inventoryItems:866 | nearbyItems:889 | updateInventoryLists:910 | bag:952 | useBelt:985 | updateBelt:992 | beltPanel:1014 | gear:1028 | editSurvivor:1081 | crafting:1090 | health:1111 | diary:1141 | dispatchStatus:1164 | fieldLedger:1179 | ledgerEntry:1218 | ledgerReport:1224 | ledgerPanel:1233 | playtestReport:1269 | copyPlaytest:1313 | knownStory:1326 | storyText:1331 | outbreakLog:1335 | storyEntry:1344 | supplyRun:1353 | gardenStatus:1381 | gardenProject:1390 | waterProject:1410 | utilities:1431 | releases:1450 | research:1457 | npcPanel:1465 | gardenPanel:1482 | stationPanel:1506 | objectPanel:1553 | interact:1664 | interactions:1673 | nearbyAction:1690 | strike:1719 | quickUse:1727 | pause:1734 | visualAtmosphere:1744 | atmospherePanel:1748 | applyAtmosphere:1758 | exportSave:1769 | refreshPanel:1776 | bagChanged:1784 | changeInventory:1794 | bindTap:2105 | updateStick:2178 | shoveOrBrake:2206 | frame:2328
