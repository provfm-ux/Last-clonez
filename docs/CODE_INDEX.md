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

## game/sim.js (3881 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:528 | difficultyOptions:580 | setDifficulty:589 | dangerRating:608 | recordPlaytest:616 | createRecommended:620 | pinnedGoal:637 | nearby:646 | containers:650 | unreadClueAt:670 | nearbyClues:677 | readClue:682 | isSupplyCache:688 | nearbySupplyCache:693 | collectSupplyCache:699 | sources:711 | available:715 | consume:719 | collect:733 | collectAll:761 | drop:780 | stash:809 | use:819 | beltItem:906 | setBelt:914 | useBelt:921 | activeLight:930 | replaceBattery:935 | toggleLight:944 | recipeProblem:962 | craft:986 | place:1012 | vehicle:1055 | enterVehicle:1059 | exitVehicle:1080 | refuel:1108 | vehicleRepairProblem:1122 | repairVehicle:1130 | brake:1142 | updateVehicle:1149 | longHaulGoals:1230 | longHaulHint:1243 | updateLongHaul:1267 | destination:1292 | markDestination:1312 | markStation:1332 | restoreCampaign:1344 | placeCampaignPages:1358 | takeStatue:1378 | updateCinemaTrap:1407 | updatePineRidge:1421 | updateCinemaBuff:1452 | placeEvaDiary:1461 | updateEva:1472 | readEvaDiary:1490 | readCampaignPage:1499 | campaignProblem:1516 | travelProblem:1525 | arrivalPosition:1537 | travel:1548 | exploredTile:1590 | saveMapPin:1595 | markPin:1614 | removePin:1622 | noise:1630 | hear:1646 | hearZombie:1654 | encounterSlots:1669 | newInfected:1675 | freeEncounterSpot:1681 | wakeNest:1687 | touchFungus:1706 | noticeCrib:1710 | inspectCrib:1720 | warnHorde:1726 | resumeEncounterWarning:1733 | waveSpots:1737 | updateHordes:1747 | waitWithWatch:1804 | armWatch:1827 | updateAtmosphere:1837 | listenAtDoor:1898 | sceneProblem:1918 | revealLedgerCache:1923 | resolveScene:1929 | dispatchProblem:1955 | sendDispatch:1964 | readDispatchReport:1971 | settleDispatch:1979 | openingOccupied:2011 | breachProblem:2025 | breach:2035 | door:2074 | barricade:2105 | unboard:2121 | removeBarrier:2132 | minutesToRain:2144 | sight:2173 | canSee:2180 | drainLight:2189 | useTap:2198 | useGenerator:2218 | updateUtilities:2238 | fireBatch:2271 | startFireBatch:2278 | collectFireBatch:2294 | mushroomProblem:2337 | harvestMushroom:2344 | updateFungalAlert:2359 | readFieldNote:2375 | wildProblem:2395 | useWild:2417 | sow:2452 | waterGarden:2462 | gardenYield:2470 | harvestGarden:2476 | growGarden:2494 | updateOutdoor:2506 | catchUpArea:2517 | evaAtShelter:2554 | toggleGardenHelp:2559 | tendShelterGarden:2568 | dismantleFurniture:2590 | contextual:2600 | recruit:2656 | threats:2666 | damageFactor:2670 | aimChance:2677 | inAttackRange:2682 | closestInReach:2686 | attackTarget:2697 | touchAttackTarget:2703 | weaponProblem:2718 | endPursuit:2724 | endWindup:2730 | faceTowards:2735 | carriedSupply:2741 | defeat:2753 | attack:2766 | shove:2816 | hurt:2842 | move:2892 | follow:2929 | walkTo:2955 | target:2967 | approach:2974 | updatePlayer:2990 | canTargetEva:3073 | updateEnemies:3077 | updateNpc:3193 | explore:3216 | updateExposure:3226 | updateNeeds:3238 | tick:3276 | updateDoorLure:3335 | breakLeg:3362 | healFracture:3370 | updateSickness:3379 | freeSpot:3402 | unstick:3415 | startSleep:3432 | fastSleep:3442 | sleep:3457 | moodles:3464 | snapshotPlayer:3488 | snapshotZone:3492 | snapshotRun:3500 | zoneShape:3522 | migrate:3540 | restore:3546

## game/view.js (2812 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1318 | roofArt:1340 | roofCoversPlayer:1391 | marker:1399 | survivorPalette:1445 | actorFrame:1457 | drawHeldWeapon:1661 | weaponIcon:1690 | drawZombieSprite:1710 | microActor:1756 | equipmentPortrait:1809 | actor:1822 | beamReach:1982 | flashlightBeam:1992 | warmBeamSprite:2012 | warmFlashlight:2035 | windowGlow:2061 | weatherEffects:2085 | drawDestination:2121 | chunkSignature:2148 | buildChunk:2156 | groundLayer:2184 | dimAround:2201 | afterlifePixels:2239 | afterlifePortrait:2266 | renderAfterlife:2278 | render:2426 | locate:2704 | mapFit:2724 | mapPoint:2729 | minimapLayer:2737 | minimap:2756

## game/game.js (2624 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1797 | interactions:1806 | nearbyAction:1823 | strike:1853 | quickUse:1861 | pause:1868 | visualAtmosphere:1878 | atmospherePanel:1882 | applyAtmosphere:1892 | exportSave:1903 | refreshPanel:1910 | bagChanged:1918 | changeInventory:1928 | bindTap:2274 | updateStick:2347 | shoveOrBrake:2375 | frame:2497
