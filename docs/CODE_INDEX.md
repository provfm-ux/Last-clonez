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

## game/recordings.js (8 lines)
(no named functions)

## game/soundscape.js (198 lines)
makeBuffer:22 | decodeRecording:71 | preload:81 | bankFor:94 | zombieClip:107 | playZombie:118 | play:145 | output:163 | stop:185

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (3055 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:850 | updateVehicle:857 | destination:935 | markDestination:948 | markStation:968 | travelProblem:975 | arrivalPosition:985 | travel:996 | exploredTile:1032 | saveMapPin:1037 | markPin:1056 | removePin:1064 | noise:1072 | hear:1088 | hearZombie:1095 | encounterSlots:1110 | newInfected:1116 | freeEncounterSpot:1122 | wakeNest:1128 | touchFungus:1147 | noticeCrib:1151 | inspectCrib:1161 | warnHorde:1167 | resumeEncounterWarning:1174 | waveSpots:1178 | updateHordes:1188 | armWatch:1244 | updateAtmosphere:1254 | listenAtDoor:1315 | sceneProblem:1335 | revealLedgerCache:1340 | resolveScene:1346 | dispatchProblem:1372 | sendDispatch:1381 | readDispatchReport:1388 | settleDispatch:1396 | openingOccupied:1428 | breachProblem:1442 | breach:1451 | door:1479 | barricade:1505 | unboard:1520 | removeBarrier:1531 | minutesToRain:1542 | sight:1565 | canSee:1572 | drainLight:1581 | useTap:1590 | useGenerator:1610 | updateUtilities:1630 | fireBatch:1662 | startFireBatch:1669 | collectFireBatch:1684 | wildProblem:1718 | useWild:1738 | sow:1768 | waterGarden:1778 | gardenYield:1786 | harvestGarden:1792 | growGarden:1805 | updateOutdoor:1817 | catchUpArea:1828 | evaAtShelter:1848 | toggleGardenHelp:1853 | tendShelterGarden:1862 | contextual:1881 | recruit:1941 | threats:1951 | damageFactor:1955 | aimChance:1962 | inAttackRange:1967 | closestInReach:1971 | attackTarget:1982 | touchAttackTarget:1988 | weaponProblem:2003 | endPursuit:2009 | endWindup:2015 | faceTowards:2020 | defeat:2025 | attack:2035 | shove:2079 | hurt:2105 | move:2153 | follow:2190 | walkTo:2216 | target:2228 | approach:2235 | updatePlayer:2249 | canTargetEva:2312 | updateEnemies:2316 | updateNpc:2431 | explore:2454 | updateExposure:2464 | updateNeeds:2476 | tick:2511 | updateDoorLure:2562 | breakLeg:2589 | healFracture:2597 | updateSickness:2606 | freeSpot:2629 | unstick:2642 | startSleep:2659 | fastSleep:2669 | sleep:2684 | moodles:2691 | snapshotPlayer:2715 | snapshotZone:2719 | snapshotRun:2727 | zoneShape:2743 | migrate:2758 | restore:2764

## game/view.js (2332 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1230 | weaponIcon:1259 | drawZombieSprite:1278 | microActor:1309 | equipmentPortrait:1350 | actor:1363 | beamReach:1517 | flashlightBeam:1527 | warmBeamSprite:1547 | warmFlashlight:1570 | windowGlow:1596 | weatherEffects:1620 | drawDestination:1656 | chunkSignature:1683 | buildChunk:1691 | groundLayer:1719 | dimAround:1736 | afterlifePixels:1774 | afterlifePortrait:1801 | renderAfterlife:1813 | render:1961 | locate:2224 | mapFit:2244 | mapPoint:2249 | minimapLayer:2257 | minimap:2276

## game/game.js (2453 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | start:287 | startRecommended:305 | showStartDetail:318 | savedAssists:331 | assistsOn:338 | difficultyPanel:343 | applyDifficulty:364 | rememberSetup:385 | worldRulesEditor:391 | applyWorldRules:409 | resumeSaved:425 | show:443 | close:457 | menu:470 | titleScreen:480 | wakeSound:498 | cue:511 | syncSound:523 | objectives:532 | objectiveHtml:542 | skillsHtml:546 | conditions:556 | nearbyObjects:571 | interactionLabel:585 | canTalk:596 | setHtml:602 | updateHud:608 | help:736 | landmarks:746 | map:756 | savePinForm:806 | itemIcon:817 | weaponCondition:822 | itemDescription:828 | matches:856 | inventoryItems:866 | nearbyItems:889 | updateInventoryLists:910 | bag:952 | useBelt:985 | updateBelt:992 | beltPanel:1014 | gear:1028 | editSurvivor:1081 | crafting:1090 | health:1111 | diary:1141 | dispatchStatus:1164 | fieldLedger:1179 | ledgerEntry:1218 | ledgerReport:1224 | ledgerPanel:1233 | playtestReport:1269 | copyPlaytest:1313 | knownStory:1326 | storyText:1331 | outbreakLog:1335 | storyEntry:1344 | supplyRun:1353 | gardenStatus:1381 | gardenProject:1390 | waterProject:1410 | utilities:1431 | releases:1450 | research:1457 | npcPanel:1465 | gardenPanel:1482 | stationPanel:1506 | objectPanel:1553 | interact:1664 | interactions:1673 | nearbyAction:1690 | strike:1719 | quickUse:1727 | pause:1734 | visualAtmosphere:1744 | atmospherePanel:1748 | applyAtmosphere:1758 | exportSave:1769 | refreshPanel:1776 | bagChanged:1784 | changeInventory:1794 | bindTap:2105 | updateStick:2178 | shoveOrBrake:2206 | frame:2328
