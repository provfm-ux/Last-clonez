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

## game/sim.js (3446 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | create:265 | createControl:350 | difficultyOptions:402 | setDifficulty:411 | dangerRating:430 | recordPlaytest:438 | createRecommended:442 | pinnedGoal:459 | nearby:468 | containers:472 | unreadClueAt:488 | nearbyClues:495 | readClue:500 | isSupplyCache:506 | nearbySupplyCache:511 | collectSupplyCache:517 | sources:529 | available:533 | consume:537 | collect:551 | collectAll:578 | drop:597 | stash:626 | use:636 | beltItem:723 | setBelt:731 | useBelt:738 | activeLight:747 | replaceBattery:752 | toggleLight:761 | recipeProblem:779 | craft:803 | place:828 | vehicle:870 | enterVehicle:874 | exitVehicle:895 | refuel:923 | vehicleRepairProblem:937 | repairVehicle:945 | brake:957 | updateVehicle:964 | longHaulGoals:1045 | longHaulHint:1058 | updateLongHaul:1082 | destination:1107 | markDestination:1127 | markStation:1147 | travelProblem:1154 | arrivalPosition:1164 | travel:1175 | exploredTile:1216 | saveMapPin:1221 | markPin:1240 | removePin:1248 | noise:1256 | hear:1272 | hearZombie:1280 | encounterSlots:1295 | newInfected:1301 | freeEncounterSpot:1307 | wakeNest:1313 | touchFungus:1332 | noticeCrib:1336 | inspectCrib:1346 | warnHorde:1352 | resumeEncounterWarning:1359 | waveSpots:1363 | updateHordes:1373 | waitWithWatch:1430 | armWatch:1453 | updateAtmosphere:1463 | listenAtDoor:1524 | sceneProblem:1544 | revealLedgerCache:1549 | resolveScene:1555 | dispatchProblem:1581 | sendDispatch:1590 | readDispatchReport:1597 | settleDispatch:1605 | openingOccupied:1637 | breachProblem:1651 | breach:1660 | door:1690 | barricade:1717 | unboard:1733 | removeBarrier:1744 | minutesToRain:1756 | sight:1785 | canSee:1792 | drainLight:1801 | useTap:1810 | useGenerator:1830 | updateUtilities:1850 | fireBatch:1883 | startFireBatch:1890 | collectFireBatch:1906 | mushroomProblem:1948 | harvestMushroom:1955 | updateFungalAlert:1969 | readFieldNote:1985 | wildProblem:2005 | useWild:2027 | sow:2061 | waterGarden:2071 | gardenYield:2079 | harvestGarden:2085 | growGarden:2102 | updateOutdoor:2114 | catchUpArea:2125 | evaAtShelter:2162 | toggleGardenHelp:2167 | tendShelterGarden:2176 | dismantleFurniture:2198 | contextual:2208 | recruit:2264 | threats:2274 | damageFactor:2278 | aimChance:2285 | inAttackRange:2290 | closestInReach:2294 | attackTarget:2305 | touchAttackTarget:2311 | weaponProblem:2326 | endPursuit:2332 | endWindup:2338 | faceTowards:2343 | defeat:2348 | attack:2358 | shove:2407 | hurt:2433 | move:2481 | follow:2518 | walkTo:2544 | target:2556 | approach:2563 | updatePlayer:2579 | canTargetEva:2662 | updateEnemies:2666 | updateNpc:2782 | explore:2805 | updateExposure:2815 | updateNeeds:2827 | tick:2862 | updateDoorLure:2915 | breakLeg:2942 | healFracture:2950 | updateSickness:2959 | freeSpot:2982 | unstick:2995 | startSleep:3012 | fastSleep:3022 | sleep:3037 | moodles:3044 | snapshotPlayer:3068 | snapshotZone:3072 | snapshotRun:3080 | zoneShape:3098 | migrate:3114 | restore:3120

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2594 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | diary:1215 | dispatchStatus:1244 | fieldLedger:1259 | ledgerEntry:1298 | ledgerReport:1304 | ledgerPanel:1313 | playtestReport:1349 | copyPlaytest:1393 | knownStory:1406 | storyText:1411 | outbreakLog:1415 | storyEntry:1424 | supplyRun:1433 | gardenStatus:1461 | gardenProject:1470 | waterProject:1490 | utilities:1511 | releases:1530 | research:1537 | npcPanel:1545 | gardenPanel:1562 | stationPanel:1586 | objectPanel:1636 | interact:1770 | interactions:1779 | nearbyAction:1796 | strike:1826 | quickUse:1834 | pause:1841 | visualAtmosphere:1851 | atmospherePanel:1855 | applyAtmosphere:1865 | exportSave:1876 | refreshPanel:1883 | bagChanged:1891 | changeInventory:1901 | bindTap:2245 | updateStick:2318 | shoveOrBrake:2346 | frame:2468
