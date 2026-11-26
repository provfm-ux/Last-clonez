# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign -> sim -> view -> game

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

## game/campaign.js (57 lines)
closedReason:43

## game/sim.js (3614 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | restoreDaily:395 | create:408 | createControl:497 | difficultyOptions:549 | setDifficulty:558 | dangerRating:577 | recordPlaytest:585 | createRecommended:589 | pinnedGoal:606 | nearby:615 | containers:619 | unreadClueAt:635 | nearbyClues:642 | readClue:647 | isSupplyCache:653 | nearbySupplyCache:658 | collectSupplyCache:664 | sources:676 | available:680 | consume:684 | collect:698 | collectAll:726 | drop:745 | stash:774 | use:784 | beltItem:871 | setBelt:879 | useBelt:886 | activeLight:895 | replaceBattery:900 | toggleLight:909 | recipeProblem:927 | craft:951 | place:977 | vehicle:1020 | enterVehicle:1024 | exitVehicle:1045 | refuel:1073 | vehicleRepairProblem:1087 | repairVehicle:1095 | brake:1107 | updateVehicle:1114 | longHaulGoals:1195 | longHaulHint:1208 | updateLongHaul:1232 | destination:1257 | markDestination:1277 | markStation:1297 | travelProblem:1304 | arrivalPosition:1314 | travel:1325 | exploredTile:1367 | saveMapPin:1372 | markPin:1391 | removePin:1399 | noise:1407 | hear:1423 | hearZombie:1431 | encounterSlots:1446 | newInfected:1452 | freeEncounterSpot:1458 | wakeNest:1464 | touchFungus:1483 | noticeCrib:1487 | inspectCrib:1497 | warnHorde:1503 | resumeEncounterWarning:1510 | waveSpots:1514 | updateHordes:1524 | waitWithWatch:1581 | armWatch:1604 | updateAtmosphere:1614 | listenAtDoor:1675 | sceneProblem:1695 | revealLedgerCache:1700 | resolveScene:1706 | dispatchProblem:1732 | sendDispatch:1741 | readDispatchReport:1748 | settleDispatch:1756 | openingOccupied:1788 | breachProblem:1802 | breach:1811 | door:1841 | barricade:1868 | unboard:1884 | removeBarrier:1895 | minutesToRain:1907 | sight:1936 | canSee:1943 | drainLight:1952 | useTap:1961 | useGenerator:1981 | updateUtilities:2001 | fireBatch:2034 | startFireBatch:2041 | collectFireBatch:2057 | mushroomProblem:2100 | harvestMushroom:2107 | updateFungalAlert:2122 | readFieldNote:2138 | wildProblem:2158 | useWild:2180 | sow:2215 | waterGarden:2225 | gardenYield:2233 | harvestGarden:2239 | growGarden:2257 | updateOutdoor:2269 | catchUpArea:2280 | evaAtShelter:2317 | toggleGardenHelp:2322 | tendShelterGarden:2331 | dismantleFurniture:2353 | contextual:2363 | recruit:2419 | threats:2429 | damageFactor:2433 | aimChance:2440 | inAttackRange:2445 | closestInReach:2449 | attackTarget:2460 | touchAttackTarget:2466 | weaponProblem:2481 | endPursuit:2487 | endWindup:2493 | faceTowards:2498 | defeat:2503 | attack:2514 | shove:2564 | hurt:2590 | move:2639 | follow:2676 | walkTo:2702 | target:2714 | approach:2721 | updatePlayer:2737 | canTargetEva:2820 | updateEnemies:2824 | updateNpc:2940 | explore:2963 | updateExposure:2973 | updateNeeds:2985 | tick:3020 | updateDoorLure:3074 | breakLeg:3101 | healFracture:3109 | updateSickness:3118 | freeSpot:3141 | unstick:3154 | startSleep:3171 | fastSleep:3181 | sleep:3196 | moodles:3203 | snapshotPlayer:3227 | snapshotZone:3231 | snapshotRun:3239 | zoneShape:3259 | migrate:3277 | restore:3283

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
