# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> sim -> view -> game

## game/data.js (406 lines)
worldRules:197 | character:311

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

## game/field-stories.js (253 lines)
place:184

## game/sim.js (3554 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | closeDaily:330 | restoreDaily:339 | create:352 | createControl:440 | difficultyOptions:492 | setDifficulty:501 | dangerRating:520 | recordPlaytest:528 | createRecommended:532 | pinnedGoal:549 | nearby:558 | containers:562 | unreadClueAt:578 | nearbyClues:585 | readClue:590 | isSupplyCache:596 | nearbySupplyCache:601 | collectSupplyCache:607 | sources:619 | available:623 | consume:627 | collect:641 | collectAll:669 | drop:688 | stash:717 | use:727 | beltItem:814 | setBelt:822 | useBelt:829 | activeLight:838 | replaceBattery:843 | toggleLight:852 | recipeProblem:870 | craft:894 | place:920 | vehicle:963 | enterVehicle:967 | exitVehicle:988 | refuel:1016 | vehicleRepairProblem:1030 | repairVehicle:1038 | brake:1050 | updateVehicle:1057 | longHaulGoals:1138 | longHaulHint:1151 | updateLongHaul:1175 | destination:1200 | markDestination:1220 | markStation:1240 | travelProblem:1247 | arrivalPosition:1257 | travel:1268 | exploredTile:1310 | saveMapPin:1315 | markPin:1334 | removePin:1342 | noise:1350 | hear:1366 | hearZombie:1374 | encounterSlots:1389 | newInfected:1395 | freeEncounterSpot:1401 | wakeNest:1407 | touchFungus:1426 | noticeCrib:1430 | inspectCrib:1440 | warnHorde:1446 | resumeEncounterWarning:1453 | waveSpots:1457 | updateHordes:1467 | waitWithWatch:1524 | armWatch:1547 | updateAtmosphere:1557 | listenAtDoor:1618 | sceneProblem:1638 | revealLedgerCache:1643 | resolveScene:1649 | dispatchProblem:1675 | sendDispatch:1684 | readDispatchReport:1691 | settleDispatch:1699 | openingOccupied:1731 | breachProblem:1745 | breach:1754 | door:1784 | barricade:1811 | unboard:1827 | removeBarrier:1838 | minutesToRain:1850 | sight:1879 | canSee:1886 | drainLight:1895 | useTap:1904 | useGenerator:1924 | updateUtilities:1944 | fireBatch:1977 | startFireBatch:1984 | collectFireBatch:2000 | mushroomProblem:2043 | harvestMushroom:2050 | updateFungalAlert:2065 | readFieldNote:2081 | wildProblem:2101 | useWild:2123 | sow:2158 | waterGarden:2168 | gardenYield:2176 | harvestGarden:2182 | growGarden:2200 | updateOutdoor:2212 | catchUpArea:2223 | evaAtShelter:2260 | toggleGardenHelp:2265 | tendShelterGarden:2274 | dismantleFurniture:2296 | contextual:2306 | recruit:2362 | threats:2372 | damageFactor:2376 | aimChance:2383 | inAttackRange:2388 | closestInReach:2392 | attackTarget:2403 | touchAttackTarget:2409 | weaponProblem:2424 | endPursuit:2430 | endWindup:2436 | faceTowards:2441 | defeat:2446 | attack:2457 | shove:2507 | hurt:2533 | move:2582 | follow:2619 | walkTo:2645 | target:2657 | approach:2664 | updatePlayer:2680 | canTargetEva:2763 | updateEnemies:2767 | updateNpc:2883 | explore:2906 | updateExposure:2916 | updateNeeds:2928 | tick:2963 | updateDoorLure:3017 | breakLeg:3044 | healFracture:3052 | updateSickness:3061 | freeSpot:3084 | unstick:3097 | startSleep:3114 | fastSleep:3124 | sleep:3139 | moodles:3146 | snapshotPlayer:3170 | snapshotZone:3174 | snapshotRun:3182 | zoneShape:3202 | migrate:3219 | restore:3225

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
