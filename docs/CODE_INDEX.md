# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (337 lines)
worldRules:163 | character:253

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

## game/soundscape.js (253 lines)
makeBuffer:28 | decodeRecording:121 | preload:131 | bankFor:144 | zombieClip:157 | playZombie:168 | play:195 | output:214 | stop:240

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (3116 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:852 | updateVehicle:859 | destination:938 | markDestination:951 | markStation:971 | travelProblem:978 | arrivalPosition:988 | travel:999 | exploredTile:1035 | saveMapPin:1040 | markPin:1059 | removePin:1067 | noise:1075 | hear:1091 | hearZombie:1099 | encounterSlots:1114 | newInfected:1120 | freeEncounterSpot:1126 | wakeNest:1132 | touchFungus:1151 | noticeCrib:1155 | inspectCrib:1165 | warnHorde:1171 | resumeEncounterWarning:1178 | waveSpots:1182 | updateHordes:1192 | waitWithWatch:1249 | armWatch:1270 | updateAtmosphere:1280 | listenAtDoor:1341 | sceneProblem:1361 | revealLedgerCache:1366 | resolveScene:1372 | dispatchProblem:1398 | sendDispatch:1407 | readDispatchReport:1414 | settleDispatch:1422 | openingOccupied:1454 | breachProblem:1468 | breach:1477 | door:1507 | barricade:1534 | unboard:1550 | removeBarrier:1561 | minutesToRain:1572 | sight:1601 | canSee:1608 | drainLight:1617 | useTap:1626 | useGenerator:1646 | updateUtilities:1666 | fireBatch:1698 | startFireBatch:1705 | collectFireBatch:1720 | wildProblem:1754 | useWild:1774 | sow:1804 | waterGarden:1814 | gardenYield:1822 | harvestGarden:1828 | growGarden:1841 | updateOutdoor:1853 | catchUpArea:1864 | evaAtShelter:1884 | toggleGardenHelp:1889 | tendShelterGarden:1898 | dismantleFurniture:1920 | contextual:1930 | recruit:1985 | threats:1995 | damageFactor:1999 | aimChance:2006 | inAttackRange:2011 | closestInReach:2015 | attackTarget:2026 | touchAttackTarget:2032 | weaponProblem:2047 | endPursuit:2053 | endWindup:2059 | faceTowards:2064 | defeat:2069 | attack:2079 | shove:2125 | hurt:2151 | move:2199 | follow:2236 | walkTo:2262 | target:2274 | approach:2281 | updatePlayer:2297 | canTargetEva:2372 | updateEnemies:2376 | updateNpc:2492 | explore:2515 | updateExposure:2525 | updateNeeds:2537 | tick:2572 | updateDoorLure:2623 | breakLeg:2650 | healFracture:2658 | updateSickness:2667 | freeSpot:2690 | unstick:2703 | startSleep:2720 | fastSleep:2730 | sleep:2745 | moodles:2752 | snapshotPlayer:2776 | snapshotZone:2780 | snapshotRun:2788 | zoneShape:2804 | migrate:2819 | restore:2825

## game/view.js (2745 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1280 | roofArt:1302 | roofCoversPlayer:1353 | marker:1361 | survivorPalette:1407 | actorFrame:1419 | drawHeldWeapon:1606 | weaponIcon:1635 | drawZombieSprite:1655 | microActor:1698 | equipmentPortrait:1745 | actor:1758 | beamReach:1918 | flashlightBeam:1928 | warmBeamSprite:1948 | warmFlashlight:1971 | windowGlow:1997 | weatherEffects:2021 | drawDestination:2057 | chunkSignature:2084 | buildChunk:2092 | groundLayer:2120 | dimAround:2137 | afterlifePixels:2175 | afterlifePortrait:2202 | renderAfterlife:2214 | render:2362 | locate:2637 | mapFit:2657 | mapPoint:2662 | minimapLayer:2670 | minimap:2689

## game/game.js (2529 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | start:289 | startRecommended:307 | showStartDetail:322 | savedAssists:335 | assistsOn:342 | difficultyPanel:347 | applyDifficulty:368 | rememberSetup:389 | worldRulesEditor:395 | applyWorldRules:413 | resumeSaved:429 | show:447 | close:461 | menu:474 | titleScreen:484 | wakeSound:501 | cue:514 | syncSound:526 | objectives:535 | objectiveHtml:545 | skillsHtml:549 | conditions:559 | nearbyObjects:574 | interactionLabel:588 | canTalk:600 | setHtml:606 | updateHud:612 | help:740 | landmarks:750 | map:760 | savePinForm:810 | itemIcon:821 | weaponCondition:826 | itemDescription:832 | matches:860 | inventoryItems:870 | nearbyItems:893 | updateInventoryLists:914 | bag:956 | useBelt:994 | updateBelt:1001 | beltPanel:1023 | gear:1037 | survivorFields:1091 | survivorProfile:1100 | updateSurvivorPreview:1107 | setSetupSurvivor:1115 | editSurvivor:1123 | crafting:1137 | health:1158 | diary:1188 | dispatchStatus:1211 | fieldLedger:1226 | ledgerEntry:1265 | ledgerReport:1271 | ledgerPanel:1280 | playtestReport:1316 | copyPlaytest:1360 | knownStory:1373 | storyText:1378 | outbreakLog:1382 | storyEntry:1391 | supplyRun:1400 | gardenStatus:1428 | gardenProject:1437 | waterProject:1457 | utilities:1478 | releases:1497 | research:1504 | npcPanel:1512 | gardenPanel:1529 | stationPanel:1553 | objectPanel:1600 | interact:1716 | interactions:1725 | nearbyAction:1742 | strike:1771 | quickUse:1779 | pause:1786 | visualAtmosphere:1796 | atmospherePanel:1800 | applyAtmosphere:1810 | exportSave:1821 | refreshPanel:1828 | bagChanged:1836 | changeInventory:1846 | bindTap:2180 | updateStick:2253 | shoveOrBrake:2281 | frame:2403
