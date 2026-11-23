# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> sim -> view -> game

## game/data.js (372 lines)
worldRules:174 | character:286

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

## game/sim.js (3395 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | create:229 | createControl:312 | difficultyOptions:364 | setDifficulty:373 | dangerRating:392 | recordPlaytest:400 | createRecommended:404 | pinnedGoal:421 | nearby:430 | containers:434 | unreadClueAt:450 | nearbyClues:457 | readClue:462 | isSupplyCache:468 | nearbySupplyCache:473 | collectSupplyCache:479 | sources:491 | available:495 | consume:499 | collect:513 | collectAll:540 | drop:559 | stash:588 | use:598 | beltItem:685 | setBelt:693 | useBelt:700 | activeLight:709 | replaceBattery:714 | toggleLight:723 | recipeProblem:741 | craft:761 | place:786 | vehicle:824 | enterVehicle:828 | exitVehicle:849 | refuel:877 | vehicleRepairProblem:891 | repairVehicle:899 | brake:911 | updateVehicle:918 | longHaulGoals:999 | longHaulHint:1012 | updateLongHaul:1036 | destination:1061 | markDestination:1081 | markStation:1101 | travelProblem:1108 | arrivalPosition:1118 | travel:1129 | exploredTile:1170 | saveMapPin:1175 | markPin:1194 | removePin:1202 | noise:1210 | hear:1226 | hearZombie:1234 | encounterSlots:1249 | newInfected:1255 | freeEncounterSpot:1261 | wakeNest:1267 | touchFungus:1286 | noticeCrib:1290 | inspectCrib:1300 | warnHorde:1306 | resumeEncounterWarning:1313 | waveSpots:1317 | updateHordes:1327 | waitWithWatch:1384 | armWatch:1407 | updateAtmosphere:1417 | listenAtDoor:1478 | sceneProblem:1498 | revealLedgerCache:1503 | resolveScene:1509 | dispatchProblem:1535 | sendDispatch:1544 | readDispatchReport:1551 | settleDispatch:1559 | openingOccupied:1591 | breachProblem:1605 | breach:1614 | door:1644 | barricade:1671 | unboard:1687 | removeBarrier:1698 | minutesToRain:1709 | sight:1738 | canSee:1745 | drainLight:1754 | useTap:1763 | useGenerator:1783 | updateUtilities:1803 | fireBatch:1836 | startFireBatch:1843 | collectFireBatch:1859 | mushroomProblem:1901 | harvestMushroom:1908 | updateFungalAlert:1922 | readFieldNote:1938 | wildProblem:1958 | useWild:1980 | sow:2014 | waterGarden:2024 | gardenYield:2032 | harvestGarden:2038 | growGarden:2055 | updateOutdoor:2067 | catchUpArea:2078 | evaAtShelter:2115 | toggleGardenHelp:2120 | tendShelterGarden:2129 | dismantleFurniture:2151 | contextual:2161 | recruit:2217 | threats:2227 | damageFactor:2231 | aimChance:2238 | inAttackRange:2243 | closestInReach:2247 | attackTarget:2258 | touchAttackTarget:2264 | weaponProblem:2279 | endPursuit:2285 | endWindup:2291 | faceTowards:2296 | defeat:2301 | attack:2311 | shove:2360 | hurt:2386 | move:2434 | follow:2471 | walkTo:2497 | target:2509 | approach:2516 | updatePlayer:2532 | canTargetEva:2615 | updateEnemies:2619 | updateNpc:2735 | explore:2758 | updateExposure:2768 | updateNeeds:2780 | tick:2815 | updateDoorLure:2868 | breakLeg:2895 | healFracture:2903 | updateSickness:2912 | freeSpot:2935 | unstick:2948 | startSleep:2965 | fastSleep:2975 | sleep:2990 | moodles:2997 | snapshotPlayer:3021 | snapshotZone:3025 | snapshotRun:3033 | zoneShape:3051 | migrate:3067 | restore:3073

## game/view.js (2784 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1294 | roofArt:1316 | roofCoversPlayer:1367 | marker:1375 | survivorPalette:1421 | actorFrame:1433 | drawHeldWeapon:1636 | weaponIcon:1665 | drawZombieSprite:1685 | microActor:1731 | equipmentPortrait:1784 | actor:1797 | beamReach:1957 | flashlightBeam:1967 | warmBeamSprite:1987 | warmFlashlight:2010 | windowGlow:2036 | weatherEffects:2060 | drawDestination:2096 | chunkSignature:2123 | buildChunk:2131 | groundLayer:2159 | dimAround:2176 | afterlifePixels:2214 | afterlifePortrait:2241 | renderAfterlife:2253 | render:2401 | locate:2676 | mapFit:2696 | mapPoint:2701 | minimapLayer:2709 | minimap:2728

## game/game.js (2591 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | diary:1215 | dispatchStatus:1244 | fieldLedger:1259 | ledgerEntry:1298 | ledgerReport:1304 | ledgerPanel:1313 | playtestReport:1349 | copyPlaytest:1393 | knownStory:1406 | storyText:1411 | outbreakLog:1415 | storyEntry:1424 | supplyRun:1433 | gardenStatus:1461 | gardenProject:1470 | waterProject:1490 | utilities:1511 | releases:1530 | research:1537 | npcPanel:1545 | gardenPanel:1562 | stationPanel:1586 | objectPanel:1633 | interact:1767 | interactions:1776 | nearbyAction:1793 | strike:1823 | quickUse:1831 | pause:1838 | visualAtmosphere:1848 | atmospherePanel:1852 | applyAtmosphere:1862 | exportSave:1873 | refreshPanel:1880 | bagChanged:1888 | changeInventory:1898 | bindTap:2242 | updateStick:2315 | shoveOrBrake:2343 | frame:2465
