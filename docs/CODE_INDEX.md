# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> sim -> view -> game

## game/data.js (407 lines)
worldRules:197 | character:312

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

## game/sim.js (3669 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | restoreDaily:395 | create:408 | createControl:497 | difficultyOptions:549 | setDifficulty:558 | dangerRating:577 | recordPlaytest:585 | createRecommended:589 | pinnedGoal:606 | nearby:615 | containers:619 | unreadClueAt:635 | nearbyClues:642 | readClue:647 | isSupplyCache:653 | nearbySupplyCache:658 | collectSupplyCache:664 | sources:676 | available:680 | consume:684 | collect:698 | collectAll:726 | drop:745 | stash:774 | use:784 | beltItem:871 | setBelt:879 | useBelt:886 | activeLight:895 | replaceBattery:900 | toggleLight:909 | recipeProblem:927 | craft:951 | place:977 | vehicle:1020 | enterVehicle:1024 | exitVehicle:1045 | refuel:1073 | vehicleRepairProblem:1087 | repairVehicle:1095 | brake:1107 | updateVehicle:1114 | longHaulGoals:1195 | longHaulHint:1208 | updateLongHaul:1232 | destination:1257 | markDestination:1277 | markStation:1297 | travelProblem:1304 | arrivalPosition:1314 | travel:1325 | exploredTile:1367 | saveMapPin:1372 | markPin:1391 | removePin:1399 | noise:1407 | hear:1423 | hearZombie:1431 | encounterSlots:1446 | newInfected:1452 | freeEncounterSpot:1458 | wakeNest:1464 | touchFungus:1483 | noticeCrib:1487 | inspectCrib:1497 | warnHorde:1503 | resumeEncounterWarning:1510 | waveSpots:1514 | updateHordes:1524 | waitWithWatch:1581 | armWatch:1604 | updateAtmosphere:1614 | listenAtDoor:1675 | sceneProblem:1695 | revealLedgerCache:1700 | resolveScene:1706 | dispatchProblem:1732 | sendDispatch:1741 | readDispatchReport:1748 | settleDispatch:1756 | openingOccupied:1788 | breachProblem:1802 | breach:1811 | door:1841 | barricade:1868 | unboard:1884 | removeBarrier:1895 | minutesToRain:1907 | sight:1936 | canSee:1943 | drainLight:1952 | useTap:1961 | useGenerator:1981 | updateUtilities:2001 | fireBatch:2034 | startFireBatch:2041 | collectFireBatch:2057 | mushroomProblem:2100 | harvestMushroom:2107 | updateFungalAlert:2122 | readFieldNote:2138 | wildProblem:2158 | useWild:2180 | sow:2215 | waterGarden:2225 | gardenYield:2233 | harvestGarden:2239 | growGarden:2257 | updateOutdoor:2269 | catchUpArea:2280 | evaAtShelter:2317 | toggleGardenHelp:2322 | tendShelterGarden:2331 | dismantleFurniture:2353 | contextual:2363 | recruit:2419 | threats:2429 | damageFactor:2433 | aimChance:2440 | inAttackRange:2445 | closestInReach:2449 | attackTarget:2460 | touchAttackTarget:2466 | weaponProblem:2481 | endPursuit:2487 | endWindup:2493 | faceTowards:2498 | defeat:2503 | attack:2514 | shove:2564 | hurt:2590 | move:2639 | follow:2676 | walkTo:2702 | target:2714 | approach:2721 | updatePlayer:2737 | canTargetEva:2820 | leaveTrack:2828 | nearbyTrack:2843 | inspectTrack:2856 | updateEnemies:2869 | updateNpc:2987 | explore:3010 | updateExposure:3020 | updateNeeds:3032 | tick:3067 | updateDoorLure:3121 | breakLeg:3148 | healFracture:3156 | updateSickness:3165 | freeSpot:3188 | unstick:3201 | startSleep:3218 | fastSleep:3228 | sleep:3243 | moodles:3250 | snapshotPlayer:3274 | snapshotZone:3278 | snapshotRun:3287 | zoneShape:3307 | migrate:3325 | restore:3331

## game/view.js (2793 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2685 | mapFit:2705 | mapPoint:2710 | minimapLayer:2718 | minimap:2737

## game/game.js (2615 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1260 | fieldLedger:1275 | ledgerEntry:1314 | ledgerReport:1320 | ledgerPanel:1329 | playtestReport:1365 | copyPlaytest:1409 | knownStory:1422 | storyText:1427 | outbreakLog:1431 | storyEntry:1440 | supplyRun:1449 | gardenStatus:1477 | gardenProject:1486 | waterProject:1506 | utilities:1527 | releases:1546 | research:1553 | npcPanel:1561 | gardenPanel:1578 | stationPanel:1602 | objectPanel:1652 | interact:1786 | interactions:1795 | nearbyAction:1812 | strike:1843 | quickUse:1851 | pause:1858 | visualAtmosphere:1868 | atmospherePanel:1872 | applyAtmosphere:1882 | exportSave:1893 | refreshPanel:1900 | bagChanged:1908 | changeInventory:1918 | bindTap:2265 | updateStick:2338 | shoveOrBrake:2366 | frame:2488
