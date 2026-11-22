# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (311 lines)
worldRules:163 | character:232

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

## game/view.js (2709 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1280 | roofArt:1302 | roofCoversPlayer:1353 | marker:1361 | actorFrame:1407 | drawHeldWeapon:1577 | weaponIcon:1606 | drawZombieSprite:1626 | microActor:1669 | equipmentPortrait:1715 | actor:1728 | beamReach:1882 | flashlightBeam:1892 | warmBeamSprite:1912 | warmFlashlight:1935 | windowGlow:1961 | weatherEffects:1985 | drawDestination:2021 | chunkSignature:2048 | buildChunk:2056 | groundLayer:2084 | dimAround:2101 | afterlifePixels:2139 | afterlifePortrait:2166 | renderAfterlife:2178 | render:2326 | locate:2601 | mapFit:2621 | mapPoint:2626 | minimapLayer:2634 | minimap:2653

## game/game.js (2488 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | start:287 | startRecommended:305 | showStartDetail:318 | savedAssists:331 | assistsOn:338 | difficultyPanel:343 | applyDifficulty:364 | rememberSetup:385 | worldRulesEditor:391 | applyWorldRules:409 | resumeSaved:425 | show:443 | close:457 | menu:470 | titleScreen:480 | wakeSound:498 | cue:511 | syncSound:523 | objectives:532 | objectiveHtml:542 | skillsHtml:546 | conditions:556 | nearbyObjects:571 | interactionLabel:585 | canTalk:597 | setHtml:603 | updateHud:609 | help:737 | landmarks:747 | map:757 | savePinForm:807 | itemIcon:818 | weaponCondition:823 | itemDescription:829 | matches:857 | inventoryItems:867 | nearbyItems:890 | updateInventoryLists:911 | bag:953 | useBelt:991 | updateBelt:998 | beltPanel:1020 | gear:1034 | editSurvivor:1088 | crafting:1097 | health:1118 | diary:1148 | dispatchStatus:1171 | fieldLedger:1186 | ledgerEntry:1225 | ledgerReport:1231 | ledgerPanel:1240 | playtestReport:1276 | copyPlaytest:1320 | knownStory:1333 | storyText:1338 | outbreakLog:1342 | storyEntry:1351 | supplyRun:1360 | gardenStatus:1388 | gardenProject:1397 | waterProject:1417 | utilities:1438 | releases:1457 | research:1464 | npcPanel:1472 | gardenPanel:1489 | stationPanel:1513 | objectPanel:1560 | interact:1676 | interactions:1685 | nearbyAction:1702 | strike:1731 | quickUse:1739 | pause:1746 | visualAtmosphere:1756 | atmospherePanel:1760 | applyAtmosphere:1770 | exportSave:1781 | refreshPanel:1788 | bagChanged:1796 | changeInventory:1806 | bindTap:2140 | updateStick:2213 | shoveOrBrake:2241 | frame:2363
