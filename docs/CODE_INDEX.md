# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (445 lines)
worldRules:203 | character:350

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

## game/campaign.js (98 lines)
closedReason:73 | missing:87

## game/sim.js (3877 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:528 | difficultyOptions:580 | setDifficulty:589 | dangerRating:608 | recordPlaytest:616 | createRecommended:620 | pinnedGoal:637 | nearby:646 | containers:650 | unreadClueAt:666 | nearbyClues:673 | readClue:678 | isSupplyCache:684 | nearbySupplyCache:689 | collectSupplyCache:695 | sources:707 | available:711 | consume:715 | collect:729 | collectAll:757 | drop:776 | stash:805 | use:815 | beltItem:902 | setBelt:910 | useBelt:917 | activeLight:926 | replaceBattery:931 | toggleLight:940 | recipeProblem:958 | craft:982 | place:1008 | vehicle:1051 | enterVehicle:1055 | exitVehicle:1076 | refuel:1104 | vehicleRepairProblem:1118 | repairVehicle:1126 | brake:1138 | updateVehicle:1145 | longHaulGoals:1226 | longHaulHint:1239 | updateLongHaul:1263 | destination:1288 | markDestination:1308 | markStation:1328 | restoreCampaign:1340 | placeCampaignPages:1354 | takeStatue:1374 | updateCinemaTrap:1403 | updatePineRidge:1417 | updateCinemaBuff:1448 | placeEvaDiary:1457 | updateEva:1468 | readEvaDiary:1486 | readCampaignPage:1495 | campaignProblem:1512 | travelProblem:1521 | arrivalPosition:1533 | travel:1544 | exploredTile:1586 | saveMapPin:1591 | markPin:1610 | removePin:1618 | noise:1626 | hear:1642 | hearZombie:1650 | encounterSlots:1665 | newInfected:1671 | freeEncounterSpot:1677 | wakeNest:1683 | touchFungus:1702 | noticeCrib:1706 | inspectCrib:1716 | warnHorde:1722 | resumeEncounterWarning:1729 | waveSpots:1733 | updateHordes:1743 | waitWithWatch:1800 | armWatch:1823 | updateAtmosphere:1833 | listenAtDoor:1894 | sceneProblem:1914 | revealLedgerCache:1919 | resolveScene:1925 | dispatchProblem:1951 | sendDispatch:1960 | readDispatchReport:1967 | settleDispatch:1975 | openingOccupied:2007 | breachProblem:2021 | breach:2031 | door:2070 | barricade:2101 | unboard:2117 | removeBarrier:2128 | minutesToRain:2140 | sight:2169 | canSee:2176 | drainLight:2185 | useTap:2194 | useGenerator:2214 | updateUtilities:2234 | fireBatch:2267 | startFireBatch:2274 | collectFireBatch:2290 | mushroomProblem:2333 | harvestMushroom:2340 | updateFungalAlert:2355 | readFieldNote:2371 | wildProblem:2391 | useWild:2413 | sow:2448 | waterGarden:2458 | gardenYield:2466 | harvestGarden:2472 | growGarden:2490 | updateOutdoor:2502 | catchUpArea:2513 | evaAtShelter:2550 | toggleGardenHelp:2555 | tendShelterGarden:2564 | dismantleFurniture:2586 | contextual:2596 | recruit:2652 | threats:2662 | damageFactor:2666 | aimChance:2673 | inAttackRange:2678 | closestInReach:2682 | attackTarget:2693 | touchAttackTarget:2699 | weaponProblem:2714 | endPursuit:2720 | endWindup:2726 | faceTowards:2731 | carriedSupply:2737 | defeat:2749 | attack:2762 | shove:2812 | hurt:2838 | move:2888 | follow:2925 | walkTo:2951 | target:2963 | approach:2970 | updatePlayer:2986 | canTargetEva:3069 | updateEnemies:3073 | updateNpc:3189 | explore:3212 | updateExposure:3222 | updateNeeds:3234 | tick:3272 | updateDoorLure:3331 | breakLeg:3358 | healFracture:3366 | updateSickness:3375 | freeSpot:3398 | unstick:3411 | startSleep:3428 | fastSleep:3438 | sleep:3453 | moodles:3460 | snapshotPlayer:3484 | snapshotZone:3488 | snapshotRun:3496 | zoneShape:3518 | migrate:3536 | restore:3542

## game/view.js (2812 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1318 | roofArt:1340 | roofCoversPlayer:1391 | marker:1399 | survivorPalette:1445 | actorFrame:1457 | drawHeldWeapon:1661 | weaponIcon:1690 | drawZombieSprite:1710 | microActor:1756 | equipmentPortrait:1809 | actor:1822 | beamReach:1982 | flashlightBeam:1992 | warmBeamSprite:2012 | warmFlashlight:2035 | windowGlow:2061 | weatherEffects:2085 | drawDestination:2121 | chunkSignature:2148 | buildChunk:2156 | groundLayer:2184 | dimAround:2201 | afterlifePixels:2239 | afterlifePortrait:2266 | renderAfterlife:2278 | render:2426 | locate:2704 | mapFit:2724 | mapPoint:2729 | minimapLayer:2737 | minimap:2756

## game/game.js (2624 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1797 | interactions:1806 | nearbyAction:1823 | strike:1853 | quickUse:1861 | pause:1868 | visualAtmosphere:1878 | atmospherePanel:1882 | applyAtmosphere:1892 | exportSave:1903 | refreshPanel:1910 | bagChanged:1918 | changeInventory:1928 | bindTap:2274 | updateStick:2347 | shoveOrBrake:2375 | frame:2497
