# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (429 lines)
worldRules:201 | character:334

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

## game/campaign-hints.js (45 lines)
track:20 | progress:25 | next:30 | restore:37

## game/campaign.js (72 lines)
closedReason:47 | missing:61

## game/sim.js (3777 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:527 | difficultyOptions:579 | setDifficulty:588 | dangerRating:607 | recordPlaytest:615 | createRecommended:619 | pinnedGoal:636 | nearby:645 | containers:649 | unreadClueAt:665 | nearbyClues:672 | readClue:677 | isSupplyCache:683 | nearbySupplyCache:688 | collectSupplyCache:694 | sources:706 | available:710 | consume:714 | collect:728 | collectAll:756 | drop:775 | stash:804 | use:814 | beltItem:901 | setBelt:909 | useBelt:916 | activeLight:925 | replaceBattery:930 | toggleLight:939 | recipeProblem:957 | craft:981 | place:1007 | vehicle:1050 | enterVehicle:1054 | exitVehicle:1075 | refuel:1103 | vehicleRepairProblem:1117 | repairVehicle:1125 | brake:1137 | updateVehicle:1144 | longHaulGoals:1225 | longHaulHint:1238 | updateLongHaul:1262 | destination:1287 | markDestination:1307 | markStation:1327 | restoreCampaign:1337 | placeCampaignPages:1344 | takeStatue:1364 | updateCinemaTrap:1392 | readCampaignPage:1402 | campaignProblem:1419 | travelProblem:1428 | arrivalPosition:1440 | travel:1451 | exploredTile:1493 | saveMapPin:1498 | markPin:1517 | removePin:1525 | noise:1533 | hear:1549 | hearZombie:1557 | encounterSlots:1572 | newInfected:1578 | freeEncounterSpot:1584 | wakeNest:1590 | touchFungus:1609 | noticeCrib:1613 | inspectCrib:1623 | warnHorde:1629 | resumeEncounterWarning:1636 | waveSpots:1640 | updateHordes:1650 | waitWithWatch:1707 | armWatch:1730 | updateAtmosphere:1740 | listenAtDoor:1801 | sceneProblem:1821 | revealLedgerCache:1826 | resolveScene:1832 | dispatchProblem:1858 | sendDispatch:1867 | readDispatchReport:1874 | settleDispatch:1882 | openingOccupied:1914 | breachProblem:1928 | breach:1938 | door:1976 | barricade:2007 | unboard:2023 | removeBarrier:2034 | minutesToRain:2046 | sight:2075 | canSee:2082 | drainLight:2091 | useTap:2100 | useGenerator:2120 | updateUtilities:2140 | fireBatch:2173 | startFireBatch:2180 | collectFireBatch:2196 | mushroomProblem:2239 | harvestMushroom:2246 | updateFungalAlert:2261 | readFieldNote:2277 | wildProblem:2297 | useWild:2319 | sow:2354 | waterGarden:2364 | gardenYield:2372 | harvestGarden:2378 | growGarden:2396 | updateOutdoor:2408 | catchUpArea:2419 | evaAtShelter:2456 | toggleGardenHelp:2461 | tendShelterGarden:2470 | dismantleFurniture:2492 | contextual:2502 | recruit:2558 | threats:2568 | damageFactor:2572 | aimChance:2579 | inAttackRange:2584 | closestInReach:2588 | attackTarget:2599 | touchAttackTarget:2605 | weaponProblem:2620 | endPursuit:2626 | endWindup:2632 | faceTowards:2637 | carriedSupply:2643 | defeat:2655 | attack:2668 | shove:2718 | hurt:2744 | move:2793 | follow:2830 | walkTo:2856 | target:2868 | approach:2875 | updatePlayer:2891 | canTargetEva:2974 | updateEnemies:2978 | updateNpc:3094 | explore:3117 | updateExposure:3127 | updateNeeds:3139 | tick:3174 | updateDoorLure:3233 | breakLeg:3260 | healFracture:3268 | updateSickness:3277 | freeSpot:3300 | unstick:3313 | startSleep:3330 | fastSleep:3340 | sleep:3355 | moodles:3362 | snapshotPlayer:3386 | snapshotZone:3390 | snapshotRun:3398 | zoneShape:3419 | migrate:3437 | restore:3443

## game/view.js (2799 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1308 | roofArt:1330 | roofCoversPlayer:1381 | marker:1389 | survivorPalette:1435 | actorFrame:1447 | drawHeldWeapon:1651 | weaponIcon:1680 | drawZombieSprite:1700 | microActor:1746 | equipmentPortrait:1799 | actor:1812 | beamReach:1972 | flashlightBeam:1982 | warmBeamSprite:2002 | warmFlashlight:2025 | windowGlow:2051 | weatherEffects:2075 | drawDestination:2111 | chunkSignature:2138 | buildChunk:2146 | groundLayer:2174 | dimAround:2191 | afterlifePixels:2229 | afterlifePortrait:2256 | renderAfterlife:2268 | render:2416 | locate:2691 | mapFit:2711 | mapPoint:2716 | minimapLayer:2724 | minimap:2743

## game/game.js (2619 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1792 | interactions:1801 | nearbyAction:1818 | strike:1848 | quickUse:1856 | pause:1863 | visualAtmosphere:1873 | atmospherePanel:1877 | applyAtmosphere:1887 | exportSave:1898 | refreshPanel:1905 | bagChanged:1913 | changeInventory:1923 | bindTap:2269 | updateStick:2342 | shoveOrBrake:2370 | frame:2492
