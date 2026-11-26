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

## game/sim.js (3617 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | restoreDaily:398 | create:411 | createControl:500 | difficultyOptions:552 | setDifficulty:561 | dangerRating:580 | recordPlaytest:588 | createRecommended:592 | pinnedGoal:609 | nearby:618 | containers:622 | unreadClueAt:638 | nearbyClues:645 | readClue:650 | isSupplyCache:656 | nearbySupplyCache:661 | collectSupplyCache:667 | sources:679 | available:683 | consume:687 | collect:701 | collectAll:729 | drop:748 | stash:777 | use:787 | beltItem:874 | setBelt:882 | useBelt:889 | activeLight:898 | replaceBattery:903 | toggleLight:912 | recipeProblem:930 | craft:954 | place:980 | vehicle:1023 | enterVehicle:1027 | exitVehicle:1048 | refuel:1076 | vehicleRepairProblem:1090 | repairVehicle:1098 | brake:1110 | updateVehicle:1117 | longHaulGoals:1198 | longHaulHint:1211 | updateLongHaul:1235 | destination:1260 | markDestination:1280 | markStation:1300 | travelProblem:1307 | arrivalPosition:1317 | travel:1328 | exploredTile:1370 | saveMapPin:1375 | markPin:1394 | removePin:1402 | noise:1410 | hear:1426 | hearZombie:1434 | encounterSlots:1449 | newInfected:1455 | freeEncounterSpot:1461 | wakeNest:1467 | touchFungus:1486 | noticeCrib:1490 | inspectCrib:1500 | warnHorde:1506 | resumeEncounterWarning:1513 | waveSpots:1517 | updateHordes:1527 | waitWithWatch:1584 | armWatch:1607 | updateAtmosphere:1617 | listenAtDoor:1678 | sceneProblem:1698 | revealLedgerCache:1703 | resolveScene:1709 | dispatchProblem:1735 | sendDispatch:1744 | readDispatchReport:1751 | settleDispatch:1759 | openingOccupied:1791 | breachProblem:1805 | breach:1814 | door:1844 | barricade:1871 | unboard:1887 | removeBarrier:1898 | minutesToRain:1910 | sight:1939 | canSee:1946 | drainLight:1955 | useTap:1964 | useGenerator:1984 | updateUtilities:2004 | fireBatch:2037 | startFireBatch:2044 | collectFireBatch:2060 | mushroomProblem:2103 | harvestMushroom:2110 | updateFungalAlert:2125 | readFieldNote:2141 | wildProblem:2161 | useWild:2183 | sow:2218 | waterGarden:2228 | gardenYield:2236 | harvestGarden:2242 | growGarden:2260 | updateOutdoor:2272 | catchUpArea:2283 | evaAtShelter:2320 | toggleGardenHelp:2325 | tendShelterGarden:2334 | dismantleFurniture:2356 | contextual:2366 | recruit:2422 | threats:2432 | damageFactor:2436 | aimChance:2443 | inAttackRange:2448 | closestInReach:2452 | attackTarget:2463 | touchAttackTarget:2469 | weaponProblem:2484 | endPursuit:2490 | endWindup:2496 | faceTowards:2501 | defeat:2506 | attack:2517 | shove:2567 | hurt:2593 | move:2642 | follow:2679 | walkTo:2705 | target:2717 | approach:2724 | updatePlayer:2740 | canTargetEva:2823 | updateEnemies:2827 | updateNpc:2943 | explore:2966 | updateExposure:2976 | updateNeeds:2988 | tick:3023 | updateDoorLure:3077 | breakLeg:3104 | healFracture:3112 | updateSickness:3121 | freeSpot:3144 | unstick:3157 | startSleep:3174 | fastSleep:3184 | sleep:3199 | moodles:3206 | snapshotPlayer:3230 | snapshotZone:3234 | snapshotRun:3242 | zoneShape:3262 | migrate:3280 | restore:3286

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
