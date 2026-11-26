# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (410 lines)
worldRules:197 | character:315

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

## game/campaign-hints.js (43 lines)
track:18 | progress:23 | next:28 | restore:35

## game/campaign.js (69 lines)
closedReason:44 | missing:58

## game/sim.js (3645 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:396 | fastForward:405 | restoreDaily:411 | create:424 | createControl:513 | difficultyOptions:565 | setDifficulty:574 | dangerRating:593 | recordPlaytest:601 | createRecommended:605 | pinnedGoal:622 | nearby:631 | containers:635 | unreadClueAt:651 | nearbyClues:658 | readClue:663 | isSupplyCache:669 | nearbySupplyCache:674 | collectSupplyCache:680 | sources:692 | available:696 | consume:700 | collect:714 | collectAll:742 | drop:761 | stash:790 | use:800 | beltItem:887 | setBelt:895 | useBelt:902 | activeLight:911 | replaceBattery:916 | toggleLight:925 | recipeProblem:943 | craft:967 | place:993 | vehicle:1036 | enterVehicle:1040 | exitVehicle:1061 | refuel:1089 | vehicleRepairProblem:1103 | repairVehicle:1111 | brake:1123 | updateVehicle:1130 | longHaulGoals:1211 | longHaulHint:1224 | updateLongHaul:1248 | destination:1273 | markDestination:1293 | markStation:1313 | travelProblem:1320 | arrivalPosition:1330 | travel:1341 | exploredTile:1383 | saveMapPin:1388 | markPin:1407 | removePin:1415 | noise:1423 | hear:1439 | hearZombie:1447 | encounterSlots:1462 | newInfected:1468 | freeEncounterSpot:1474 | wakeNest:1480 | touchFungus:1499 | noticeCrib:1503 | inspectCrib:1513 | warnHorde:1519 | resumeEncounterWarning:1526 | waveSpots:1530 | updateHordes:1540 | waitWithWatch:1597 | armWatch:1620 | updateAtmosphere:1630 | listenAtDoor:1691 | sceneProblem:1711 | revealLedgerCache:1716 | resolveScene:1722 | dispatchProblem:1748 | sendDispatch:1757 | readDispatchReport:1764 | settleDispatch:1772 | openingOccupied:1804 | breachProblem:1818 | breach:1827 | door:1857 | barricade:1884 | unboard:1900 | removeBarrier:1911 | minutesToRain:1923 | sight:1952 | canSee:1959 | drainLight:1968 | useTap:1977 | useGenerator:1997 | updateUtilities:2017 | fireBatch:2050 | startFireBatch:2057 | collectFireBatch:2073 | mushroomProblem:2116 | harvestMushroom:2123 | updateFungalAlert:2138 | readFieldNote:2154 | wildProblem:2174 | useWild:2196 | sow:2231 | waterGarden:2241 | gardenYield:2249 | harvestGarden:2255 | growGarden:2273 | updateOutdoor:2285 | catchUpArea:2296 | evaAtShelter:2333 | toggleGardenHelp:2338 | tendShelterGarden:2347 | dismantleFurniture:2369 | contextual:2379 | recruit:2435 | threats:2445 | damageFactor:2449 | aimChance:2456 | inAttackRange:2461 | closestInReach:2465 | attackTarget:2476 | touchAttackTarget:2482 | weaponProblem:2497 | endPursuit:2503 | endWindup:2509 | faceTowards:2514 | carriedSupply:2520 | defeat:2532 | attack:2545 | shove:2595 | hurt:2621 | move:2670 | follow:2707 | walkTo:2733 | target:2745 | approach:2752 | updatePlayer:2768 | canTargetEva:2851 | updateEnemies:2855 | updateNpc:2971 | explore:2994 | updateExposure:3004 | updateNeeds:3016 | tick:3051 | updateDoorLure:3105 | breakLeg:3132 | healFracture:3140 | updateSickness:3149 | freeSpot:3172 | unstick:3185 | startSleep:3202 | fastSleep:3212 | sleep:3227 | moodles:3234 | snapshotPlayer:3258 | snapshotZone:3262 | snapshotRun:3270 | zoneShape:3290 | migrate:3308 | restore:3314

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
