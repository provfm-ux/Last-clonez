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

## game/soundscape.js (253 lines)
makeBuffer:28 | decodeRecording:121 | preload:131 | bankFor:144 | zombieClip:157 | playZombie:168 | play:195 | output:214 | stop:240

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/sim.js (3113 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:850 | updateVehicle:857 | destination:936 | markDestination:949 | markStation:969 | travelProblem:976 | arrivalPosition:986 | travel:997 | exploredTile:1033 | saveMapPin:1038 | markPin:1057 | removePin:1065 | noise:1073 | hear:1089 | hearZombie:1097 | encounterSlots:1112 | newInfected:1118 | freeEncounterSpot:1124 | wakeNest:1130 | touchFungus:1149 | noticeCrib:1153 | inspectCrib:1163 | warnHorde:1169 | resumeEncounterWarning:1176 | waveSpots:1180 | updateHordes:1190 | waitWithWatch:1247 | armWatch:1268 | updateAtmosphere:1278 | listenAtDoor:1339 | sceneProblem:1359 | revealLedgerCache:1364 | resolveScene:1370 | dispatchProblem:1396 | sendDispatch:1405 | readDispatchReport:1412 | settleDispatch:1420 | openingOccupied:1452 | breachProblem:1466 | breach:1475 | door:1505 | barricade:1532 | unboard:1548 | removeBarrier:1559 | minutesToRain:1570 | sight:1599 | canSee:1606 | drainLight:1615 | useTap:1624 | useGenerator:1644 | updateUtilities:1664 | fireBatch:1696 | startFireBatch:1703 | collectFireBatch:1718 | wildProblem:1752 | useWild:1772 | sow:1802 | waterGarden:1812 | gardenYield:1820 | harvestGarden:1826 | growGarden:1839 | updateOutdoor:1851 | catchUpArea:1862 | evaAtShelter:1882 | toggleGardenHelp:1887 | tendShelterGarden:1896 | dismantleFurniture:1918 | contextual:1928 | recruit:1983 | threats:1993 | damageFactor:1997 | aimChance:2004 | inAttackRange:2009 | closestInReach:2013 | attackTarget:2024 | touchAttackTarget:2030 | weaponProblem:2045 | endPursuit:2051 | endWindup:2057 | faceTowards:2062 | defeat:2067 | attack:2077 | shove:2122 | hurt:2148 | move:2196 | follow:2233 | walkTo:2259 | target:2271 | approach:2278 | updatePlayer:2294 | canTargetEva:2369 | updateEnemies:2373 | updateNpc:2489 | explore:2512 | updateExposure:2522 | updateNeeds:2534 | tick:2569 | updateDoorLure:2620 | breakLeg:2647 | healFracture:2655 | updateSickness:2664 | freeSpot:2687 | unstick:2700 | startSleep:2717 | fastSleep:2727 | sleep:2742 | moodles:2749 | snapshotPlayer:2773 | snapshotZone:2777 | snapshotRun:2785 | zoneShape:2801 | migrate:2816 | restore:2822

## game/view.js (2671 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1280 | roofArt:1302 | roofCoversPlayer:1353 | marker:1361 | actorFrame:1386 | drawHeldWeapon:1539 | weaponIcon:1568 | drawZombieSprite:1588 | microActor:1631 | equipmentPortrait:1677 | actor:1690 | beamReach:1844 | flashlightBeam:1854 | warmBeamSprite:1874 | warmFlashlight:1897 | windowGlow:1923 | weatherEffects:1947 | drawDestination:1983 | chunkSignature:2010 | buildChunk:2018 | groundLayer:2046 | dimAround:2063 | afterlifePixels:2101 | afterlifePortrait:2128 | renderAfterlife:2140 | render:2288 | locate:2563 | mapFit:2583 | mapPoint:2588 | minimapLayer:2596 | minimap:2615

## game/game.js (2488 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | start:287 | startRecommended:305 | showStartDetail:318 | savedAssists:331 | assistsOn:338 | difficultyPanel:343 | applyDifficulty:364 | rememberSetup:385 | worldRulesEditor:391 | applyWorldRules:409 | resumeSaved:425 | show:443 | close:457 | menu:470 | titleScreen:480 | wakeSound:498 | cue:511 | syncSound:523 | objectives:532 | objectiveHtml:542 | skillsHtml:546 | conditions:556 | nearbyObjects:571 | interactionLabel:585 | canTalk:597 | setHtml:603 | updateHud:609 | help:737 | landmarks:747 | map:757 | savePinForm:807 | itemIcon:818 | weaponCondition:823 | itemDescription:829 | matches:857 | inventoryItems:867 | nearbyItems:890 | updateInventoryLists:911 | bag:953 | useBelt:991 | updateBelt:998 | beltPanel:1020 | gear:1034 | editSurvivor:1088 | crafting:1097 | health:1118 | diary:1148 | dispatchStatus:1171 | fieldLedger:1186 | ledgerEntry:1225 | ledgerReport:1231 | ledgerPanel:1240 | playtestReport:1276 | copyPlaytest:1320 | knownStory:1333 | storyText:1338 | outbreakLog:1342 | storyEntry:1351 | supplyRun:1360 | gardenStatus:1388 | gardenProject:1397 | waterProject:1417 | utilities:1438 | releases:1457 | research:1464 | npcPanel:1472 | gardenPanel:1489 | stationPanel:1513 | objectPanel:1560 | interact:1676 | interactions:1685 | nearbyAction:1702 | strike:1731 | quickUse:1739 | pause:1746 | visualAtmosphere:1756 | atmospherePanel:1760 | applyAtmosphere:1770 | exportSave:1781 | refreshPanel:1788 | bagChanged:1796 | changeInventory:1806 | bindTap:2140 | updateStick:2213 | shoveOrBrake:2241 | frame:2363
