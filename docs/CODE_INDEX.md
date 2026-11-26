# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (439 lines)
worldRules:201 | character:344

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

## game/sim.js (3833 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:527 | difficultyOptions:579 | setDifficulty:588 | dangerRating:607 | recordPlaytest:615 | createRecommended:619 | pinnedGoal:636 | nearby:645 | containers:649 | unreadClueAt:665 | nearbyClues:672 | readClue:677 | isSupplyCache:683 | nearbySupplyCache:688 | collectSupplyCache:694 | sources:706 | available:710 | consume:714 | collect:728 | collectAll:756 | drop:775 | stash:804 | use:814 | beltItem:901 | setBelt:909 | useBelt:916 | activeLight:925 | replaceBattery:930 | toggleLight:939 | recipeProblem:957 | craft:981 | place:1007 | vehicle:1050 | enterVehicle:1054 | exitVehicle:1075 | refuel:1103 | vehicleRepairProblem:1117 | repairVehicle:1125 | brake:1137 | updateVehicle:1144 | longHaulGoals:1225 | longHaulHint:1238 | updateLongHaul:1262 | destination:1287 | markDestination:1307 | markStation:1327 | restoreCampaign:1339 | placeCampaignPages:1352 | takeStatue:1372 | updateCinemaTrap:1401 | updatePineRidge:1415 | updateCinemaBuff:1446 | readCampaignPage:1452 | campaignProblem:1469 | travelProblem:1478 | arrivalPosition:1490 | travel:1501 | exploredTile:1543 | saveMapPin:1548 | markPin:1567 | removePin:1575 | noise:1583 | hear:1599 | hearZombie:1607 | encounterSlots:1622 | newInfected:1628 | freeEncounterSpot:1634 | wakeNest:1640 | touchFungus:1659 | noticeCrib:1663 | inspectCrib:1673 | warnHorde:1679 | resumeEncounterWarning:1686 | waveSpots:1690 | updateHordes:1700 | waitWithWatch:1757 | armWatch:1780 | updateAtmosphere:1790 | listenAtDoor:1851 | sceneProblem:1871 | revealLedgerCache:1876 | resolveScene:1882 | dispatchProblem:1908 | sendDispatch:1917 | readDispatchReport:1924 | settleDispatch:1932 | openingOccupied:1964 | breachProblem:1978 | breach:1988 | door:2027 | barricade:2058 | unboard:2074 | removeBarrier:2085 | minutesToRain:2097 | sight:2126 | canSee:2133 | drainLight:2142 | useTap:2151 | useGenerator:2171 | updateUtilities:2191 | fireBatch:2224 | startFireBatch:2231 | collectFireBatch:2247 | mushroomProblem:2290 | harvestMushroom:2297 | updateFungalAlert:2312 | readFieldNote:2328 | wildProblem:2348 | useWild:2370 | sow:2405 | waterGarden:2415 | gardenYield:2423 | harvestGarden:2429 | growGarden:2447 | updateOutdoor:2459 | catchUpArea:2470 | evaAtShelter:2507 | toggleGardenHelp:2512 | tendShelterGarden:2521 | dismantleFurniture:2543 | contextual:2553 | recruit:2609 | threats:2619 | damageFactor:2623 | aimChance:2630 | inAttackRange:2635 | closestInReach:2639 | attackTarget:2650 | touchAttackTarget:2656 | weaponProblem:2671 | endPursuit:2677 | endWindup:2683 | faceTowards:2688 | carriedSupply:2694 | defeat:2706 | attack:2719 | shove:2769 | hurt:2795 | move:2845 | follow:2882 | walkTo:2908 | target:2920 | approach:2927 | updatePlayer:2943 | canTargetEva:3026 | updateEnemies:3030 | updateNpc:3146 | explore:3169 | updateExposure:3179 | updateNeeds:3191 | tick:3229 | updateDoorLure:3288 | breakLeg:3315 | healFracture:3323 | updateSickness:3332 | freeSpot:3355 | unstick:3368 | startSleep:3385 | fastSleep:3395 | sleep:3410 | moodles:3417 | snapshotPlayer:3441 | snapshotZone:3445 | snapshotRun:3453 | zoneShape:3475 | migrate:3493 | restore:3499

## game/view.js (2812 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1318 | roofArt:1340 | roofCoversPlayer:1391 | marker:1399 | survivorPalette:1445 | actorFrame:1457 | drawHeldWeapon:1661 | weaponIcon:1690 | drawZombieSprite:1710 | microActor:1756 | equipmentPortrait:1809 | actor:1822 | beamReach:1982 | flashlightBeam:1992 | warmBeamSprite:2012 | warmFlashlight:2035 | windowGlow:2061 | weatherEffects:2085 | drawDestination:2121 | chunkSignature:2148 | buildChunk:2156 | groundLayer:2184 | dimAround:2201 | afterlifePixels:2239 | afterlifePortrait:2266 | renderAfterlife:2278 | render:2426 | locate:2704 | mapFit:2724 | mapPoint:2729 | minimapLayer:2737 | minimap:2756

## game/game.js (2620 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1793 | interactions:1802 | nearbyAction:1819 | strike:1849 | quickUse:1857 | pause:1864 | visualAtmosphere:1874 | atmospherePanel:1878 | applyAtmosphere:1888 | exportSave:1899 | refreshPanel:1906 | bagChanged:1914 | changeInventory:1924 | bindTap:2270 | updateStick:2343 | shoveOrBrake:2371 | frame:2493
