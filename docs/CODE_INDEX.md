# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> sim -> view -> game

## game/data.js (382 lines)
worldRules:182 | character:296

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

## game/sim.js (3418 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | create:239 | createControl:323 | difficultyOptions:375 | setDifficulty:384 | dangerRating:403 | recordPlaytest:411 | createRecommended:415 | pinnedGoal:432 | nearby:441 | containers:445 | unreadClueAt:461 | nearbyClues:468 | readClue:473 | isSupplyCache:479 | nearbySupplyCache:484 | collectSupplyCache:490 | sources:502 | available:506 | consume:510 | collect:524 | collectAll:551 | drop:570 | stash:599 | use:609 | beltItem:696 | setBelt:704 | useBelt:711 | activeLight:720 | replaceBattery:725 | toggleLight:734 | recipeProblem:752 | craft:776 | place:801 | vehicle:843 | enterVehicle:847 | exitVehicle:868 | refuel:896 | vehicleRepairProblem:910 | repairVehicle:918 | brake:930 | updateVehicle:937 | longHaulGoals:1018 | longHaulHint:1031 | updateLongHaul:1055 | destination:1080 | markDestination:1100 | markStation:1120 | travelProblem:1127 | arrivalPosition:1137 | travel:1148 | exploredTile:1189 | saveMapPin:1194 | markPin:1213 | removePin:1221 | noise:1229 | hear:1245 | hearZombie:1253 | encounterSlots:1268 | newInfected:1274 | freeEncounterSpot:1280 | wakeNest:1286 | touchFungus:1305 | noticeCrib:1309 | inspectCrib:1319 | warnHorde:1325 | resumeEncounterWarning:1332 | waveSpots:1336 | updateHordes:1346 | waitWithWatch:1403 | armWatch:1426 | updateAtmosphere:1436 | listenAtDoor:1497 | sceneProblem:1517 | revealLedgerCache:1522 | resolveScene:1528 | dispatchProblem:1554 | sendDispatch:1563 | readDispatchReport:1570 | settleDispatch:1578 | openingOccupied:1610 | breachProblem:1624 | breach:1633 | door:1663 | barricade:1690 | unboard:1706 | removeBarrier:1717 | minutesToRain:1729 | sight:1758 | canSee:1765 | drainLight:1774 | useTap:1783 | useGenerator:1803 | updateUtilities:1823 | fireBatch:1856 | startFireBatch:1863 | collectFireBatch:1879 | mushroomProblem:1921 | harvestMushroom:1928 | updateFungalAlert:1942 | readFieldNote:1958 | wildProblem:1978 | useWild:2000 | sow:2034 | waterGarden:2044 | gardenYield:2052 | harvestGarden:2058 | growGarden:2075 | updateOutdoor:2087 | catchUpArea:2098 | evaAtShelter:2135 | toggleGardenHelp:2140 | tendShelterGarden:2149 | dismantleFurniture:2171 | contextual:2181 | recruit:2237 | threats:2247 | damageFactor:2251 | aimChance:2258 | inAttackRange:2263 | closestInReach:2267 | attackTarget:2278 | touchAttackTarget:2284 | weaponProblem:2299 | endPursuit:2305 | endWindup:2311 | faceTowards:2316 | defeat:2321 | attack:2331 | shove:2380 | hurt:2406 | move:2454 | follow:2491 | walkTo:2517 | target:2529 | approach:2536 | updatePlayer:2552 | canTargetEva:2635 | updateEnemies:2639 | updateNpc:2755 | explore:2778 | updateExposure:2788 | updateNeeds:2800 | tick:2835 | updateDoorLure:2888 | breakLeg:2915 | healFracture:2923 | updateSickness:2932 | freeSpot:2955 | unstick:2968 | startSleep:2985 | fastSleep:2995 | sleep:3010 | moodles:3017 | snapshotPlayer:3041 | snapshotZone:3045 | snapshotRun:3053 | zoneShape:3071 | migrate:3087 | restore:3093

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2591 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | diary:1215 | dispatchStatus:1244 | fieldLedger:1259 | ledgerEntry:1298 | ledgerReport:1304 | ledgerPanel:1313 | playtestReport:1349 | copyPlaytest:1393 | knownStory:1406 | storyText:1411 | outbreakLog:1415 | storyEntry:1424 | supplyRun:1433 | gardenStatus:1461 | gardenProject:1470 | waterProject:1490 | utilities:1511 | releases:1530 | research:1537 | npcPanel:1545 | gardenPanel:1562 | stationPanel:1586 | objectPanel:1633 | interact:1767 | interactions:1776 | nearbyAction:1793 | strike:1823 | quickUse:1831 | pause:1838 | visualAtmosphere:1848 | atmospherePanel:1852 | applyAtmosphere:1862 | exportSave:1873 | refreshPanel:1880 | bagChanged:1888 | changeInventory:1898 | bindTap:2242 | updateStick:2315 | shoveOrBrake:2343 | frame:2465
