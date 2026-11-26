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

## game/sim.js (4094 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:547 | difficultyOptions:599 | setDifficulty:608 | dangerRating:627 | recordPlaytest:635 | createRecommended:639 | campaignGoals:657 | campaignGoal:669 | campaignTarget:674 | pinnedGoal:688 | nearby:701 | containers:705 | readCinemaNote:724 | unreadClueAt:732 | nearbyClues:739 | readClue:744 | isSupplyCache:750 | nearbySupplyCache:755 | collectSupplyCache:761 | sources:773 | available:777 | consume:781 | collect:795 | collectAll:823 | drop:842 | stash:871 | use:881 | beltItem:969 | setBelt:977 | useBelt:984 | activeLight:993 | replaceBattery:998 | toggleLight:1007 | recipeProblem:1025 | craft:1049 | place:1075 | vehicle:1118 | enterVehicle:1122 | exitVehicle:1143 | refuel:1171 | vehicleRepairProblem:1185 | repairVehicle:1193 | brake:1205 | updateVehicle:1212 | longHaulGoals:1293 | longHaulHint:1306 | updateLongHaul:1330 | destination:1355 | markDestination:1379 | markStation:1399 | restoreCampaign:1412 | placeCampaignPages:1426 | takeStatue:1446 | updateCinemaTrap:1486 | updatePineRidge:1504 | updateCinemaBuff:1535 | placeIronworks:1545 | dismantleCage:1570 | readTerminal:1595 | placeEvaDiary:1603 | updateEva:1614 | readEvaDiary:1632 | readCampaignPage:1641 | campaignProblem:1658 | travelProblem:1667 | arrivalPosition:1679 | travel:1690 | exploredTile:1732 | saveMapPin:1737 | markPin:1756 | removePin:1764 | noise:1773 | hear:1790 | hearZombie:1798 | encounterSlots:1813 | newInfected:1819 | freeEncounterSpot:1825 | wakeNest:1831 | touchFungus:1850 | noticeCrib:1854 | inspectCrib:1864 | warnHorde:1870 | resumeEncounterWarning:1877 | waveSpots:1881 | updateHordes:1891 | waitWithWatch:1948 | armWatch:1971 | updateAtmosphere:1981 | listenAtDoor:2042 | sceneProblem:2062 | revealLedgerCache:2067 | resolveScene:2073 | dispatchProblem:2099 | sendDispatch:2108 | readDispatchReport:2115 | settleDispatch:2123 | openingOccupied:2155 | breachProblem:2169 | breach:2179 | door:2218 | barricade:2249 | unboard:2265 | removeBarrier:2276 | minutesToRain:2288 | sight:2317 | canSee:2324 | drainLight:2333 | useTap:2342 | useGenerator:2362 | updateUtilities:2382 | fireBatch:2415 | startFireBatch:2422 | collectFireBatch:2438 | mushroomProblem:2481 | harvestMushroom:2488 | updateFungalAlert:2503 | readFieldNote:2519 | wildProblem:2539 | useWild:2561 | sow:2596 | waterGarden:2606 | gardenYield:2614 | harvestGarden:2620 | growGarden:2638 | updateOutdoor:2650 | catchUpArea:2661 | evaAtShelter:2698 | toggleGardenHelp:2703 | tendShelterGarden:2712 | dismantleFurniture:2734 | contextual:2744 | recruit:2800 | threats:2810 | damageFactor:2814 | aimChance:2821 | inAttackRange:2826 | closestInReach:2830 | attackTarget:2841 | touchAttackTarget:2847 | weaponProblem:2862 | endPursuit:2868 | endWindup:2874 | faceTowards:2879 | carriedSupply:2885 | defeat:2897 | attack:2910 | shove:2960 | hurt:2986 | move:3036 | follow:3073 | walkTo:3099 | target:3111 | approach:3118 | updatePlayer:3134 | canTargetEva:3217 | leaveTrack:3225 | nearbyTrack:3240 | inspectTrack:3253 | updateEnemies:3266 | updateNpc:3395 | explore:3418 | updateExposure:3428 | updateNeeds:3440 | tick:3478 | updateDoorLure:3538 | breakLeg:3565 | healFracture:3573 | updateSickness:3582 | freeSpot:3605 | unstick:3618 | startSleep:3635 | fastSleep:3645 | sleep:3660 | moodles:3667 | snapshotPlayer:3691 | snapshotZone:3695 | snapshotRun:3704 | zoneShape:3726 | migrate:3744 | restore:3750

## game/view.js (2834 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | microActor:1769 | equipmentPortrait:1822 | actor:1835 | beamReach:1995 | flashlightBeam:2005 | warmBeamSprite:2025 | warmFlashlight:2048 | windowGlow:2074 | weatherEffects:2098 | drawDestination:2134 | chunkSignature:2161 | buildChunk:2169 | groundLayer:2197 | dimAround:2214 | afterlifePixels:2252 | afterlifePortrait:2279 | renderAfterlife:2291 | render:2439 | locate:2726 | mapFit:2746 | mapPoint:2751 | minimapLayer:2759 | minimap:2778

## game/game.js (2696 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:344 | showStartDetail:361 | savedAssists:379 | assistsOn:386 | difficultyPanel:391 | applyDifficulty:412 | rememberSetup:433 | worldRulesEditor:439 | applyWorldRules:457 | resumeSaved:473 | show:491 | close:505 | menu:518 | titleScreen:528 | wakeSound:546 | cue:559 | syncSound:571 | objectives:580 | objectiveHtml:595 | skillsHtml:599 | conditions:611 | nearbyObjects:627 | guidedBat:641 | interactionLabel:647 | canTalk:659 | setHtml:665 | updateHud:671 | help:801 | landmarks:811 | map:821 | savePinForm:871 | itemIcon:882 | weaponCondition:887 | itemDescription:893 | matches:923 | inventoryItems:933 | nearbyItems:956 | updateInventoryLists:977 | bag:1019 | useBelt:1057 | updateBelt:1064 | beltPanel:1086 | gear:1100 | survivorFields:1155 | survivorProfile:1164 | showTraitPoints:1173 | updateSurvivorPreview:1181 | setSetupSurvivor:1189 | editSurvivor:1199 | crafting:1213 | health:1234 | dailySummary:1264 | diary:1277 | dispatchStatus:1308 | fieldLedger:1323 | ledgerEntry:1362 | ledgerReport:1368 | ledgerPanel:1377 | playtestReport:1413 | copyPlaytest:1457 | knownStory:1470 | storyText:1475 | outbreakLog:1479 | storyEntry:1488 | supplyRun:1497 | gardenStatus:1525 | gardenProject:1534 | waterProject:1554 | utilities:1575 | releases:1594 | research:1601 | npcPanel:1609 | gardenPanel:1626 | stationPanel:1650 | objectPanel:1700 | interact:1858 | interactions:1867 | nearbyAction:1884 | strike:1915 | quickUse:1923 | pause:1930 | visualAtmosphere:1940 | atmospherePanel:1944 | applyAtmosphere:1956 | exportSave:1969 | refreshPanel:1976 | bagChanged:1984 | changeInventory:1994 | bindTap:2341 | updateStick:2414 | shoveOrBrake:2442 | frame:2565
