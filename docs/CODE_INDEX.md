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

## game/sim.js (3077 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | create:198 | createControl:274 | difficultyOptions:326 | setDifficulty:335 | dangerRating:354 | recordPlaytest:362 | createRecommended:366 | pinnedGoal:383 | nearby:392 | containers:396 | unreadClueAt:412 | nearbyClues:419 | readClue:424 | isSupplyCache:430 | nearbySupplyCache:435 | collectSupplyCache:441 | sources:453 | available:457 | consume:461 | collect:475 | collectAll:498 | drop:517 | stash:546 | use:556 | beltItem:636 | setBelt:644 | useBelt:651 | activeLight:660 | replaceBattery:665 | toggleLight:674 | recipeProblem:691 | craft:707 | place:727 | vehicle:765 | enterVehicle:769 | exitVehicle:790 | refuel:818 | vehicleRepairProblem:832 | repairVehicle:840 | brake:850 | updateVehicle:857 | destination:936 | markDestination:949 | markStation:969 | travelProblem:976 | arrivalPosition:986 | travel:997 | exploredTile:1033 | saveMapPin:1038 | markPin:1057 | removePin:1065 | noise:1073 | hear:1089 | hearZombie:1097 | encounterSlots:1112 | newInfected:1118 | freeEncounterSpot:1124 | wakeNest:1130 | touchFungus:1149 | noticeCrib:1153 | inspectCrib:1163 | warnHorde:1169 | resumeEncounterWarning:1176 | waveSpots:1180 | updateHordes:1190 | armWatch:1246 | updateAtmosphere:1256 | listenAtDoor:1317 | sceneProblem:1337 | revealLedgerCache:1342 | resolveScene:1348 | dispatchProblem:1374 | sendDispatch:1383 | readDispatchReport:1390 | settleDispatch:1398 | openingOccupied:1430 | breachProblem:1444 | breach:1453 | door:1483 | barricade:1510 | unboard:1526 | removeBarrier:1537 | minutesToRain:1548 | sight:1571 | canSee:1578 | drainLight:1587 | useTap:1596 | useGenerator:1616 | updateUtilities:1636 | fireBatch:1668 | startFireBatch:1675 | collectFireBatch:1690 | wildProblem:1724 | useWild:1744 | sow:1774 | waterGarden:1784 | gardenYield:1792 | harvestGarden:1798 | growGarden:1811 | updateOutdoor:1823 | catchUpArea:1834 | evaAtShelter:1854 | toggleGardenHelp:1859 | tendShelterGarden:1868 | contextual:1887 | recruit:1947 | threats:1957 | damageFactor:1961 | aimChance:1968 | inAttackRange:1973 | closestInReach:1977 | attackTarget:1988 | touchAttackTarget:1994 | weaponProblem:2009 | endPursuit:2015 | endWindup:2021 | faceTowards:2026 | defeat:2031 | attack:2041 | shove:2086 | hurt:2112 | move:2160 | follow:2197 | walkTo:2223 | target:2235 | approach:2242 | updatePlayer:2258 | canTargetEva:2333 | updateEnemies:2337 | updateNpc:2453 | explore:2476 | updateExposure:2486 | updateNeeds:2498 | tick:2533 | updateDoorLure:2584 | breakLeg:2611 | healFracture:2619 | updateSickness:2628 | freeSpot:2651 | unstick:2664 | startSleep:2681 | fastSleep:2691 | sleep:2706 | moodles:2713 | snapshotPlayer:2737 | snapshotZone:2741 | snapshotRun:2749 | zoneShape:2765 | migrate:2780 | restore:2786

## game/view.js (2497 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:414 | drawFurniture:610 | campfireSmoke:630 | prop:650 | roof:1159 | roofArt:1181 | roofCoversPlayer:1215 | marker:1223 | actorFrame:1248 | drawHeldWeapon:1368 | weaponIcon:1397 | drawZombieSprite:1416 | microActor:1459 | equipmentPortrait:1503 | actor:1516 | beamReach:1670 | flashlightBeam:1680 | warmBeamSprite:1700 | warmFlashlight:1723 | windowGlow:1749 | weatherEffects:1773 | drawDestination:1809 | chunkSignature:1836 | buildChunk:1844 | groundLayer:1872 | dimAround:1889 | afterlifePixels:1927 | afterlifePortrait:1954 | renderAfterlife:1966 | render:2114 | locate:2389 | mapFit:2409 | mapPoint:2414 | minimapLayer:2422 | minimap:2441

## game/game.js (2453 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | start:287 | startRecommended:305 | showStartDetail:318 | savedAssists:331 | assistsOn:338 | difficultyPanel:343 | applyDifficulty:364 | rememberSetup:385 | worldRulesEditor:391 | applyWorldRules:409 | resumeSaved:425 | show:443 | close:457 | menu:470 | titleScreen:480 | wakeSound:498 | cue:511 | syncSound:523 | objectives:532 | objectiveHtml:542 | skillsHtml:546 | conditions:556 | nearbyObjects:571 | interactionLabel:585 | canTalk:596 | setHtml:602 | updateHud:608 | help:736 | landmarks:746 | map:756 | savePinForm:806 | itemIcon:817 | weaponCondition:822 | itemDescription:828 | matches:856 | inventoryItems:866 | nearbyItems:889 | updateInventoryLists:910 | bag:952 | useBelt:985 | updateBelt:992 | beltPanel:1014 | gear:1028 | editSurvivor:1081 | crafting:1090 | health:1111 | diary:1141 | dispatchStatus:1164 | fieldLedger:1179 | ledgerEntry:1218 | ledgerReport:1224 | ledgerPanel:1233 | playtestReport:1269 | copyPlaytest:1313 | knownStory:1326 | storyText:1331 | outbreakLog:1335 | storyEntry:1344 | supplyRun:1353 | gardenStatus:1381 | gardenProject:1390 | waterProject:1410 | utilities:1431 | releases:1450 | research:1457 | npcPanel:1465 | gardenPanel:1482 | stationPanel:1506 | objectPanel:1553 | interact:1664 | interactions:1673 | nearbyAction:1690 | strike:1719 | quickUse:1727 | pause:1734 | visualAtmosphere:1744 | atmospherePanel:1748 | applyAtmosphere:1758 | exportSave:1769 | refreshPanel:1776 | bagChanged:1784 | changeInventory:1794 | bindTap:2105 | updateStick:2178 | shoveOrBrake:2206 | frame:2328
