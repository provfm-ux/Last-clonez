# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> afterlife -> sim -> view -> game

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

## game/soundscape.js (107 lines)
makeBuffer:19 | play:68 | stop:96

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (3013 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:850 | updateVehicle:857 | destination:934 | markDestination:947 | markStation:967 | travelProblem:974 | arrivalPosition:984 | travel:995 | exploredTile:1031 | saveMapPin:1036 | markPin:1055 | removePin:1063 | noise:1071 | hear:1087 | encounterSlots:1092 | newInfected:1098 | freeEncounterSpot:1104 | wakeNest:1110 | touchFungus:1129 | noticeCrib:1133 | inspectCrib:1143 | warnHorde:1149 | resumeEncounterWarning:1156 | waveSpots:1160 | updateHordes:1170 | armWatch:1226 | updateAtmosphere:1236 | listenAtDoor:1297 | sceneProblem:1317 | revealLedgerCache:1322 | resolveScene:1328 | dispatchProblem:1354 | sendDispatch:1363 | readDispatchReport:1370 | settleDispatch:1378 | openingOccupied:1410 | breachProblem:1424 | breach:1433 | door:1461 | barricade:1487 | unboard:1502 | removeBarrier:1513 | minutesToRain:1524 | sight:1547 | canSee:1554 | drainLight:1563 | useTap:1572 | useGenerator:1592 | updateUtilities:1612 | fireBatch:1644 | startFireBatch:1651 | collectFireBatch:1666 | wildProblem:1700 | useWild:1720 | sow:1750 | waterGarden:1760 | gardenYield:1768 | harvestGarden:1774 | growGarden:1787 | updateOutdoor:1799 | catchUpArea:1810 | evaAtShelter:1830 | toggleGardenHelp:1835 | tendShelterGarden:1844 | contextual:1863 | recruit:1923 | threats:1933 | damageFactor:1937 | aimChance:1944 | inAttackRange:1949 | closestInReach:1953 | attackTarget:1964 | touchAttackTarget:1970 | weaponProblem:1985 | endPursuit:1991 | endWindup:1997 | faceTowards:2002 | defeat:2007 | attack:2016 | shove:2059 | hurt:2085 | move:2133 | follow:2170 | walkTo:2196 | target:2208 | approach:2215 | updatePlayer:2229 | canTargetEva:2292 | updateEnemies:2296 | updateNpc:2389 | explore:2412 | updateExposure:2422 | updateNeeds:2434 | tick:2469 | updateDoorLure:2520 | breakLeg:2547 | healFracture:2555 | updateSickness:2564 | freeSpot:2587 | unstick:2600 | startSleep:2617 | fastSleep:2627 | sleep:2642 | moodles:2649 | snapshotPlayer:2673 | snapshotZone:2677 | snapshotRun:2685 | zoneShape:2701 | migrate:2716 | restore:2722

## game/view.js (2332 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | equipmentPortrait:1350 | actor:1363 | beamReach:1517 | flashlightBeam:1527 | warmBeamSprite:1547 | warmFlashlight:1570 | windowGlow:1596 | weatherEffects:1620 | drawDestination:1656 | chunkSignature:1683 | buildChunk:1691 | groundLayer:1719 | dimAround:1736 | afterlifePixels:1774 | afterlifePortrait:1801 | renderAfterlife:1813 | render:1961 | locate:2224 | mapFit:2244 | mapPoint:2249 | minimapLayer:2257 | minimap:2276

## game/game.js (2441 lines)
read:62 | write:66 | backUp:70 | save:79 | clearStick:100 | resetInput:107 | updateDisplayMode:120 | toggleFullscreen:132 | activate:157 | setNavigation:177 | opening:184 | startLesson:198 | endLesson:210 | updateLesson:223 | startAfterlife:247 | deathSummary:256 | skipAfterlife:266 | endAfterlife:272 | afterlifeAction:279 | start:283 | startRecommended:301 | showStartDetail:314 | savedAssists:327 | assistsOn:334 | difficultyPanel:339 | applyDifficulty:360 | rememberSetup:381 | worldRulesEditor:387 | applyWorldRules:405 | resumeSaved:421 | show:439 | close:453 | menu:466 | titleScreen:476 | wakeSound:494 | cue:504 | syncSound:516 | objectives:525 | objectiveHtml:535 | skillsHtml:539 | conditions:549 | nearbyObjects:564 | interactionLabel:578 | canTalk:589 | setHtml:595 | updateHud:601 | help:729 | landmarks:739 | map:749 | savePinForm:799 | itemIcon:810 | weaponCondition:815 | itemDescription:821 | matches:849 | inventoryItems:859 | nearbyItems:882 | updateInventoryLists:903 | bag:945 | useBelt:978 | updateBelt:985 | beltPanel:1004 | gear:1018 | editSurvivor:1071 | crafting:1080 | health:1101 | diary:1131 | dispatchStatus:1154 | fieldLedger:1169 | ledgerEntry:1208 | ledgerReport:1214 | ledgerPanel:1223 | playtestReport:1259 | copyPlaytest:1303 | knownStory:1316 | storyText:1321 | outbreakLog:1325 | storyEntry:1334 | supplyRun:1343 | gardenStatus:1371 | gardenProject:1380 | waterProject:1400 | utilities:1421 | releases:1440 | research:1447 | npcPanel:1455 | gardenPanel:1472 | stationPanel:1496 | objectPanel:1543 | interact:1654 | interactions:1663 | nearbyAction:1680 | strike:1709 | quickUse:1717 | pause:1724 | visualAtmosphere:1734 | atmospherePanel:1738 | applyAtmosphere:1748 | exportSave:1759 | refreshPanel:1766 | bagChanged:1774 | changeInventory:1784 | bindTap:2095 | updateStick:2168 | shoveOrBrake:2196 | frame:2318
