# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (431 lines)
worldRules:201 | character:336

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

## game/sim.js (3789 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:527 | difficultyOptions:579 | setDifficulty:588 | dangerRating:607 | recordPlaytest:615 | createRecommended:619 | pinnedGoal:636 | nearby:645 | containers:649 | unreadClueAt:665 | nearbyClues:672 | readClue:677 | isSupplyCache:683 | nearbySupplyCache:688 | collectSupplyCache:694 | sources:706 | available:710 | consume:714 | collect:728 | collectAll:756 | drop:775 | stash:804 | use:814 | beltItem:901 | setBelt:909 | useBelt:916 | activeLight:925 | replaceBattery:930 | toggleLight:939 | recipeProblem:957 | craft:981 | place:1007 | vehicle:1050 | enterVehicle:1054 | exitVehicle:1075 | refuel:1103 | vehicleRepairProblem:1117 | repairVehicle:1125 | brake:1137 | updateVehicle:1144 | longHaulGoals:1225 | longHaulHint:1238 | updateLongHaul:1262 | destination:1287 | markDestination:1307 | markStation:1327 | restoreCampaign:1339 | placeCampaignPages:1347 | takeStatue:1367 | updateCinemaTrap:1395 | updateCinemaBuff:1407 | readCampaignPage:1413 | campaignProblem:1430 | travelProblem:1439 | arrivalPosition:1451 | travel:1462 | exploredTile:1504 | saveMapPin:1509 | markPin:1528 | removePin:1536 | noise:1544 | hear:1560 | hearZombie:1568 | encounterSlots:1583 | newInfected:1589 | freeEncounterSpot:1595 | wakeNest:1601 | touchFungus:1620 | noticeCrib:1624 | inspectCrib:1634 | warnHorde:1640 | resumeEncounterWarning:1647 | waveSpots:1651 | updateHordes:1661 | waitWithWatch:1718 | armWatch:1741 | updateAtmosphere:1751 | listenAtDoor:1812 | sceneProblem:1832 | revealLedgerCache:1837 | resolveScene:1843 | dispatchProblem:1869 | sendDispatch:1878 | readDispatchReport:1885 | settleDispatch:1893 | openingOccupied:1925 | breachProblem:1939 | breach:1949 | door:1987 | barricade:2018 | unboard:2034 | removeBarrier:2045 | minutesToRain:2057 | sight:2086 | canSee:2093 | drainLight:2102 | useTap:2111 | useGenerator:2131 | updateUtilities:2151 | fireBatch:2184 | startFireBatch:2191 | collectFireBatch:2207 | mushroomProblem:2250 | harvestMushroom:2257 | updateFungalAlert:2272 | readFieldNote:2288 | wildProblem:2308 | useWild:2330 | sow:2365 | waterGarden:2375 | gardenYield:2383 | harvestGarden:2389 | growGarden:2407 | updateOutdoor:2419 | catchUpArea:2430 | evaAtShelter:2467 | toggleGardenHelp:2472 | tendShelterGarden:2481 | dismantleFurniture:2503 | contextual:2513 | recruit:2569 | threats:2579 | damageFactor:2583 | aimChance:2590 | inAttackRange:2595 | closestInReach:2599 | attackTarget:2610 | touchAttackTarget:2616 | weaponProblem:2631 | endPursuit:2637 | endWindup:2643 | faceTowards:2648 | carriedSupply:2654 | defeat:2666 | attack:2679 | shove:2729 | hurt:2755 | move:2805 | follow:2842 | walkTo:2868 | target:2880 | approach:2887 | updatePlayer:2903 | canTargetEva:2986 | updateEnemies:2990 | updateNpc:3106 | explore:3129 | updateExposure:3139 | updateNeeds:3151 | tick:3186 | updateDoorLure:3245 | breakLeg:3272 | healFracture:3280 | updateSickness:3289 | freeSpot:3312 | unstick:3325 | startSleep:3342 | fastSleep:3352 | sleep:3367 | moodles:3374 | snapshotPlayer:3398 | snapshotZone:3402 | snapshotRun:3410 | zoneShape:3431 | migrate:3449 | restore:3455

## game/view.js (2799 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1308 | roofArt:1330 | roofCoversPlayer:1381 | marker:1389 | survivorPalette:1435 | actorFrame:1447 | drawHeldWeapon:1651 | weaponIcon:1680 | drawZombieSprite:1700 | microActor:1746 | equipmentPortrait:1799 | actor:1812 | beamReach:1972 | flashlightBeam:1982 | warmBeamSprite:2002 | warmFlashlight:2025 | windowGlow:2051 | weatherEffects:2075 | drawDestination:2111 | chunkSignature:2138 | buildChunk:2146 | groundLayer:2174 | dimAround:2191 | afterlifePixels:2229 | afterlifePortrait:2256 | renderAfterlife:2268 | render:2416 | locate:2691 | mapFit:2711 | mapPoint:2716 | minimapLayer:2724 | minimap:2743

## game/game.js (2620 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1793 | interactions:1802 | nearbyAction:1819 | strike:1849 | quickUse:1857 | pause:1864 | visualAtmosphere:1874 | atmospherePanel:1878 | applyAtmosphere:1888 | exportSave:1899 | refreshPanel:1906 | bagChanged:1914 | changeInventory:1924 | bindTap:2270 | updateStick:2343 | shoveOrBrake:2371 | frame:2493
