# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (537 lines)
worldRules:214 | traitLoadout:359 | character:441

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

## game/soundscape.js (281 lines)
setVolumes:11 | makeBuffer:38 | decodeRecording:148 | preload:158 | bankFor:171 | zombieClip:184 | playZombie:195 | play:222 | output:241 | stop:268

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (45 lines)
track:20 | progress:25 | next:30 | restore:37

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4089 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:544 | difficultyOptions:596 | setDifficulty:605 | dangerRating:624 | recordPlaytest:632 | createRecommended:636 | campaignGoals:654 | campaignGoal:666 | campaignTarget:671 | pinnedGoal:685 | nearby:698 | containers:702 | readCinemaNote:721 | unreadClueAt:729 | nearbyClues:736 | readClue:741 | isSupplyCache:747 | nearbySupplyCache:752 | collectSupplyCache:758 | sources:770 | available:774 | consume:778 | collect:792 | collectAll:820 | drop:839 | stash:868 | use:878 | beltItem:966 | setBelt:974 | useBelt:981 | activeLight:990 | replaceBattery:995 | toggleLight:1004 | recipeProblem:1022 | craft:1046 | place:1072 | vehicle:1115 | enterVehicle:1119 | exitVehicle:1140 | refuel:1168 | vehicleRepairProblem:1182 | repairVehicle:1190 | brake:1202 | updateVehicle:1209 | longHaulGoals:1290 | longHaulHint:1303 | updateLongHaul:1327 | destination:1352 | markDestination:1376 | markStation:1396 | restoreCampaign:1408 | placeCampaignPages:1422 | takeStatue:1442 | updateCinemaTrap:1482 | updatePineRidge:1500 | updateCinemaBuff:1531 | placeIronworks:1541 | dismantleCage:1566 | readTerminal:1591 | placeEvaDiary:1599 | updateEva:1610 | readEvaDiary:1628 | readCampaignPage:1637 | campaignProblem:1654 | travelProblem:1663 | arrivalPosition:1675 | travel:1686 | exploredTile:1728 | saveMapPin:1733 | markPin:1752 | removePin:1760 | noise:1769 | hear:1786 | hearZombie:1794 | encounterSlots:1809 | newInfected:1815 | freeEncounterSpot:1821 | wakeNest:1827 | touchFungus:1846 | noticeCrib:1850 | inspectCrib:1860 | warnHorde:1866 | resumeEncounterWarning:1873 | waveSpots:1877 | updateHordes:1887 | waitWithWatch:1944 | armWatch:1967 | updateAtmosphere:1977 | listenAtDoor:2038 | sceneProblem:2058 | revealLedgerCache:2063 | resolveScene:2069 | dispatchProblem:2095 | sendDispatch:2104 | readDispatchReport:2111 | settleDispatch:2119 | openingOccupied:2151 | breachProblem:2165 | breach:2175 | door:2214 | barricade:2245 | unboard:2261 | removeBarrier:2272 | minutesToRain:2284 | sight:2313 | canSee:2320 | drainLight:2329 | useTap:2338 | useGenerator:2358 | updateUtilities:2378 | fireBatch:2411 | startFireBatch:2418 | collectFireBatch:2434 | mushroomProblem:2477 | harvestMushroom:2484 | updateFungalAlert:2499 | readFieldNote:2515 | wildProblem:2535 | useWild:2557 | sow:2592 | waterGarden:2602 | gardenYield:2610 | harvestGarden:2616 | growGarden:2634 | updateOutdoor:2646 | catchUpArea:2657 | evaAtShelter:2694 | toggleGardenHelp:2699 | tendShelterGarden:2708 | dismantleFurniture:2730 | contextual:2740 | recruit:2796 | threats:2806 | damageFactor:2810 | aimChance:2817 | inAttackRange:2822 | closestInReach:2826 | attackTarget:2837 | touchAttackTarget:2843 | weaponProblem:2858 | endPursuit:2864 | endWindup:2870 | faceTowards:2875 | carriedSupply:2881 | defeat:2893 | attack:2906 | shove:2956 | hurt:2982 | move:3032 | follow:3069 | walkTo:3095 | target:3107 | approach:3114 | updatePlayer:3130 | canTargetEva:3213 | leaveTrack:3221 | nearbyTrack:3236 | inspectTrack:3249 | updateEnemies:3262 | updateNpc:3391 | explore:3414 | updateExposure:3424 | updateNeeds:3436 | tick:3474 | updateDoorLure:3533 | breakLeg:3560 | healFracture:3568 | updateSickness:3577 | freeSpot:3600 | unstick:3613 | startSleep:3630 | fastSleep:3640 | sleep:3655 | moodles:3662 | snapshotPlayer:3686 | snapshotZone:3690 | snapshotRun:3699 | zoneShape:3721 | migrate:3739 | restore:3745

## game/view.js (2834 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | microActor:1769 | equipmentPortrait:1822 | actor:1835 | beamReach:1995 | flashlightBeam:2005 | warmBeamSprite:2025 | warmFlashlight:2048 | windowGlow:2074 | weatherEffects:2098 | drawDestination:2134 | chunkSignature:2161 | buildChunk:2169 | groundLayer:2197 | dimAround:2214 | afterlifePixels:2252 | afterlifePortrait:2279 | renderAfterlife:2291 | render:2439 | locate:2726 | mapFit:2746 | mapPoint:2751 | minimapLayer:2759 | minimap:2778

## game/game.js (2683 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startRecommended:333 | showStartDetail:350 | savedAssists:368 | assistsOn:375 | difficultyPanel:380 | applyDifficulty:401 | rememberSetup:422 | worldRulesEditor:428 | applyWorldRules:446 | resumeSaved:462 | show:480 | close:494 | menu:507 | titleScreen:517 | wakeSound:534 | cue:547 | syncSound:559 | objectives:568 | objectiveHtml:583 | skillsHtml:587 | conditions:599 | nearbyObjects:615 | guidedBat:629 | interactionLabel:635 | canTalk:647 | setHtml:653 | updateHud:659 | help:789 | landmarks:799 | map:809 | savePinForm:859 | itemIcon:870 | weaponCondition:875 | itemDescription:881 | matches:911 | inventoryItems:921 | nearbyItems:944 | updateInventoryLists:965 | bag:1007 | useBelt:1045 | updateBelt:1052 | beltPanel:1074 | gear:1088 | survivorFields:1143 | survivorProfile:1152 | showTraitPoints:1161 | updateSurvivorPreview:1169 | setSetupSurvivor:1177 | editSurvivor:1187 | crafting:1201 | health:1222 | dailySummary:1252 | diary:1265 | dispatchStatus:1296 | fieldLedger:1311 | ledgerEntry:1350 | ledgerReport:1356 | ledgerPanel:1365 | playtestReport:1401 | copyPlaytest:1445 | knownStory:1458 | storyText:1463 | outbreakLog:1467 | storyEntry:1476 | supplyRun:1485 | gardenStatus:1513 | gardenProject:1522 | waterProject:1542 | utilities:1563 | releases:1582 | research:1589 | npcPanel:1597 | gardenPanel:1614 | stationPanel:1638 | objectPanel:1688 | interact:1846 | interactions:1855 | nearbyAction:1872 | strike:1903 | quickUse:1911 | pause:1918 | visualAtmosphere:1928 | atmospherePanel:1932 | applyAtmosphere:1944 | exportSave:1957 | refreshPanel:1964 | bagChanged:1972 | changeInventory:1982 | bindTap:2329 | updateStick:2402 | shoveOrBrake:2430 | frame:2552
