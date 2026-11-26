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

## game/sim.js (3648 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:516 | difficultyOptions:568 | setDifficulty:577 | dangerRating:596 | recordPlaytest:604 | createRecommended:608 | pinnedGoal:625 | nearby:634 | containers:638 | unreadClueAt:654 | nearbyClues:661 | readClue:666 | isSupplyCache:672 | nearbySupplyCache:677 | collectSupplyCache:683 | sources:695 | available:699 | consume:703 | collect:717 | collectAll:745 | drop:764 | stash:793 | use:803 | beltItem:890 | setBelt:898 | useBelt:905 | activeLight:914 | replaceBattery:919 | toggleLight:928 | recipeProblem:946 | craft:970 | place:996 | vehicle:1039 | enterVehicle:1043 | exitVehicle:1064 | refuel:1092 | vehicleRepairProblem:1106 | repairVehicle:1114 | brake:1126 | updateVehicle:1133 | longHaulGoals:1214 | longHaulHint:1227 | updateLongHaul:1251 | destination:1276 | markDestination:1296 | markStation:1316 | travelProblem:1323 | arrivalPosition:1333 | travel:1344 | exploredTile:1386 | saveMapPin:1391 | markPin:1410 | removePin:1418 | noise:1426 | hear:1442 | hearZombie:1450 | encounterSlots:1465 | newInfected:1471 | freeEncounterSpot:1477 | wakeNest:1483 | touchFungus:1502 | noticeCrib:1506 | inspectCrib:1516 | warnHorde:1522 | resumeEncounterWarning:1529 | waveSpots:1533 | updateHordes:1543 | waitWithWatch:1600 | armWatch:1623 | updateAtmosphere:1633 | listenAtDoor:1694 | sceneProblem:1714 | revealLedgerCache:1719 | resolveScene:1725 | dispatchProblem:1751 | sendDispatch:1760 | readDispatchReport:1767 | settleDispatch:1775 | openingOccupied:1807 | breachProblem:1821 | breach:1830 | door:1860 | barricade:1887 | unboard:1903 | removeBarrier:1914 | minutesToRain:1926 | sight:1955 | canSee:1962 | drainLight:1971 | useTap:1980 | useGenerator:2000 | updateUtilities:2020 | fireBatch:2053 | startFireBatch:2060 | collectFireBatch:2076 | mushroomProblem:2119 | harvestMushroom:2126 | updateFungalAlert:2141 | readFieldNote:2157 | wildProblem:2177 | useWild:2199 | sow:2234 | waterGarden:2244 | gardenYield:2252 | harvestGarden:2258 | growGarden:2276 | updateOutdoor:2288 | catchUpArea:2299 | evaAtShelter:2336 | toggleGardenHelp:2341 | tendShelterGarden:2350 | dismantleFurniture:2372 | contextual:2382 | recruit:2438 | threats:2448 | damageFactor:2452 | aimChance:2459 | inAttackRange:2464 | closestInReach:2468 | attackTarget:2479 | touchAttackTarget:2485 | weaponProblem:2500 | endPursuit:2506 | endWindup:2512 | faceTowards:2517 | carriedSupply:2523 | defeat:2535 | attack:2548 | shove:2598 | hurt:2624 | move:2673 | follow:2710 | walkTo:2736 | target:2748 | approach:2755 | updatePlayer:2771 | canTargetEva:2854 | updateEnemies:2858 | updateNpc:2974 | explore:2997 | updateExposure:3007 | updateNeeds:3019 | tick:3054 | updateDoorLure:3108 | breakLeg:3135 | healFracture:3143 | updateSickness:3152 | freeSpot:3175 | unstick:3188 | startSleep:3205 | fastSleep:3215 | sleep:3230 | moodles:3237 | snapshotPlayer:3261 | snapshotZone:3265 | snapshotRun:3273 | zoneShape:3293 | migrate:3311 | restore:3317

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
