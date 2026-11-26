# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (526 lines)
worldRules:214 | traitLoadout:348 | character:430

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

## game/soundscape.js (265 lines)
makeBuffer:29 | decodeRecording:132 | preload:142 | bankFor:155 | zombieClip:168 | playZombie:179 | play:206 | output:225 | stop:252

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (45 lines)
track:20 | progress:25 | next:30 | restore:37

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4037 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:543 | difficultyOptions:595 | setDifficulty:604 | dangerRating:623 | recordPlaytest:631 | createRecommended:635 | pinnedGoal:652 | nearby:661 | containers:665 | readCinemaNote:684 | unreadClueAt:692 | nearbyClues:699 | readClue:704 | isSupplyCache:710 | nearbySupplyCache:715 | collectSupplyCache:721 | sources:733 | available:737 | consume:741 | collect:755 | collectAll:783 | drop:802 | stash:831 | use:841 | beltItem:929 | setBelt:937 | useBelt:944 | activeLight:953 | replaceBattery:958 | toggleLight:967 | recipeProblem:985 | craft:1009 | place:1035 | vehicle:1078 | enterVehicle:1082 | exitVehicle:1103 | refuel:1131 | vehicleRepairProblem:1145 | repairVehicle:1153 | brake:1165 | updateVehicle:1172 | longHaulGoals:1253 | longHaulHint:1266 | updateLongHaul:1290 | destination:1315 | markDestination:1335 | markStation:1355 | restoreCampaign:1367 | placeCampaignPages:1381 | takeStatue:1401 | updateCinemaTrap:1441 | updatePineRidge:1459 | updateCinemaBuff:1490 | placeIronworks:1500 | dismantleCage:1525 | readTerminal:1550 | placeEvaDiary:1558 | updateEva:1569 | readEvaDiary:1587 | readCampaignPage:1596 | campaignProblem:1613 | travelProblem:1622 | arrivalPosition:1634 | travel:1645 | exploredTile:1687 | saveMapPin:1692 | markPin:1711 | removePin:1719 | noise:1728 | hear:1745 | hearZombie:1753 | encounterSlots:1768 | newInfected:1774 | freeEncounterSpot:1780 | wakeNest:1786 | touchFungus:1805 | noticeCrib:1809 | inspectCrib:1819 | warnHorde:1825 | resumeEncounterWarning:1832 | waveSpots:1836 | updateHordes:1846 | waitWithWatch:1903 | armWatch:1926 | updateAtmosphere:1936 | listenAtDoor:1997 | sceneProblem:2017 | revealLedgerCache:2022 | resolveScene:2028 | dispatchProblem:2054 | sendDispatch:2063 | readDispatchReport:2070 | settleDispatch:2078 | openingOccupied:2110 | breachProblem:2124 | breach:2134 | door:2173 | barricade:2204 | unboard:2220 | removeBarrier:2231 | minutesToRain:2243 | sight:2272 | canSee:2279 | drainLight:2288 | useTap:2297 | useGenerator:2317 | updateUtilities:2337 | fireBatch:2370 | startFireBatch:2377 | collectFireBatch:2393 | mushroomProblem:2436 | harvestMushroom:2443 | updateFungalAlert:2458 | readFieldNote:2474 | wildProblem:2494 | useWild:2516 | sow:2551 | waterGarden:2561 | gardenYield:2569 | harvestGarden:2575 | growGarden:2593 | updateOutdoor:2605 | catchUpArea:2616 | evaAtShelter:2653 | toggleGardenHelp:2658 | tendShelterGarden:2667 | dismantleFurniture:2689 | contextual:2699 | recruit:2755 | threats:2765 | damageFactor:2769 | aimChance:2776 | inAttackRange:2781 | closestInReach:2785 | attackTarget:2796 | touchAttackTarget:2802 | weaponProblem:2817 | endPursuit:2823 | endWindup:2829 | faceTowards:2834 | carriedSupply:2840 | defeat:2852 | attack:2865 | shove:2915 | hurt:2941 | move:2991 | follow:3028 | walkTo:3054 | target:3066 | approach:3073 | updatePlayer:3089 | canTargetEva:3172 | leaveTrack:3180 | nearbyTrack:3195 | inspectTrack:3208 | updateEnemies:3221 | updateNpc:3339 | explore:3362 | updateExposure:3372 | updateNeeds:3384 | tick:3422 | updateDoorLure:3481 | breakLeg:3508 | healFracture:3516 | updateSickness:3525 | freeSpot:3548 | unstick:3561 | startSleep:3578 | fastSleep:3588 | sleep:3603 | moodles:3610 | snapshotPlayer:3634 | snapshotZone:3638 | snapshotRun:3647 | zoneShape:3669 | migrate:3687 | restore:3693

## game/view.js (2825 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1328 | roofArt:1350 | roofCoversPlayer:1401 | marker:1409 | survivorPalette:1455 | actorFrame:1467 | drawHeldWeapon:1672 | weaponIcon:1701 | drawZombieSprite:1721 | microActor:1767 | equipmentPortrait:1820 | actor:1833 | beamReach:1993 | flashlightBeam:2003 | warmBeamSprite:2023 | warmFlashlight:2046 | windowGlow:2072 | weatherEffects:2096 | drawDestination:2132 | chunkSignature:2159 | buildChunk:2167 | groundLayer:2195 | dimAround:2212 | afterlifePixels:2250 | afterlifePortrait:2277 | renderAfterlife:2289 | render:2437 | locate:2717 | mapFit:2737 | mapPoint:2742 | minimapLayer:2750 | minimap:2769

## game/game.js (2672 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | traitsReady:323 | startRecommended:330 | showStartDetail:347 | savedAssists:365 | assistsOn:372 | difficultyPanel:377 | applyDifficulty:398 | rememberSetup:419 | worldRulesEditor:425 | applyWorldRules:443 | resumeSaved:459 | show:477 | close:491 | menu:504 | titleScreen:514 | wakeSound:531 | cue:544 | syncSound:556 | objectives:565 | objectiveHtml:576 | skillsHtml:580 | conditions:592 | nearbyObjects:608 | guidedBat:622 | interactionLabel:628 | canTalk:640 | setHtml:646 | updateHud:652 | help:782 | landmarks:792 | map:802 | savePinForm:852 | itemIcon:863 | weaponCondition:868 | itemDescription:874 | matches:904 | inventoryItems:914 | nearbyItems:937 | updateInventoryLists:958 | bag:1000 | useBelt:1038 | updateBelt:1045 | beltPanel:1067 | gear:1081 | survivorFields:1136 | survivorProfile:1145 | showTraitPoints:1154 | updateSurvivorPreview:1162 | setSetupSurvivor:1170 | editSurvivor:1180 | crafting:1194 | health:1215 | dailySummary:1245 | diary:1258 | dispatchStatus:1289 | fieldLedger:1304 | ledgerEntry:1343 | ledgerReport:1349 | ledgerPanel:1358 | playtestReport:1394 | copyPlaytest:1438 | knownStory:1451 | storyText:1456 | outbreakLog:1460 | storyEntry:1469 | supplyRun:1478 | gardenStatus:1506 | gardenProject:1515 | waterProject:1535 | utilities:1556 | releases:1575 | research:1582 | npcPanel:1590 | gardenPanel:1607 | stationPanel:1631 | objectPanel:1681 | interact:1839 | interactions:1848 | nearbyAction:1865 | strike:1896 | quickUse:1904 | pause:1911 | visualAtmosphere:1921 | atmospherePanel:1925 | applyAtmosphere:1935 | exportSave:1946 | refreshPanel:1953 | bagChanged:1961 | changeInventory:1971 | bindTap:2318 | updateStick:2391 | shoveOrBrake:2419 | frame:2541
