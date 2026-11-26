# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (460 lines)
worldRules:205 | character:365

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

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (3937 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:529 | difficultyOptions:581 | setDifficulty:590 | dangerRating:609 | recordPlaytest:617 | createRecommended:621 | pinnedGoal:638 | nearby:647 | containers:651 | unreadClueAt:667 | nearbyClues:674 | readClue:679 | isSupplyCache:685 | nearbySupplyCache:690 | collectSupplyCache:696 | sources:708 | available:712 | consume:716 | collect:730 | collectAll:758 | drop:777 | stash:806 | use:816 | beltItem:903 | setBelt:911 | useBelt:918 | activeLight:927 | replaceBattery:932 | toggleLight:941 | recipeProblem:959 | craft:983 | place:1009 | vehicle:1052 | enterVehicle:1056 | exitVehicle:1077 | refuel:1105 | vehicleRepairProblem:1119 | repairVehicle:1127 | brake:1139 | updateVehicle:1146 | longHaulGoals:1227 | longHaulHint:1240 | updateLongHaul:1264 | destination:1289 | markDestination:1309 | markStation:1329 | restoreCampaign:1341 | placeCampaignPages:1355 | takeStatue:1375 | updateCinemaTrap:1404 | updatePineRidge:1418 | updateCinemaBuff:1449 | placeIronworks:1459 | dismantleCage:1484 | readTerminal:1509 | placeEvaDiary:1517 | updateEva:1528 | readEvaDiary:1546 | readCampaignPage:1555 | campaignProblem:1572 | travelProblem:1581 | arrivalPosition:1593 | travel:1604 | exploredTile:1646 | saveMapPin:1651 | markPin:1670 | removePin:1678 | noise:1686 | hear:1702 | hearZombie:1710 | encounterSlots:1725 | newInfected:1731 | freeEncounterSpot:1737 | wakeNest:1743 | touchFungus:1762 | noticeCrib:1766 | inspectCrib:1776 | warnHorde:1782 | resumeEncounterWarning:1789 | waveSpots:1793 | updateHordes:1803 | waitWithWatch:1860 | armWatch:1883 | updateAtmosphere:1893 | listenAtDoor:1954 | sceneProblem:1974 | revealLedgerCache:1979 | resolveScene:1985 | dispatchProblem:2011 | sendDispatch:2020 | readDispatchReport:2027 | settleDispatch:2035 | openingOccupied:2067 | breachProblem:2081 | breach:2091 | door:2130 | barricade:2161 | unboard:2177 | removeBarrier:2188 | minutesToRain:2200 | sight:2229 | canSee:2236 | drainLight:2245 | useTap:2254 | useGenerator:2274 | updateUtilities:2294 | fireBatch:2327 | startFireBatch:2334 | collectFireBatch:2350 | mushroomProblem:2393 | harvestMushroom:2400 | updateFungalAlert:2415 | readFieldNote:2431 | wildProblem:2451 | useWild:2473 | sow:2508 | waterGarden:2518 | gardenYield:2526 | harvestGarden:2532 | growGarden:2550 | updateOutdoor:2562 | catchUpArea:2573 | evaAtShelter:2610 | toggleGardenHelp:2615 | tendShelterGarden:2624 | dismantleFurniture:2646 | contextual:2656 | recruit:2712 | threats:2722 | damageFactor:2726 | aimChance:2733 | inAttackRange:2738 | closestInReach:2742 | attackTarget:2753 | touchAttackTarget:2759 | weaponProblem:2774 | endPursuit:2780 | endWindup:2786 | faceTowards:2791 | carriedSupply:2797 | defeat:2809 | attack:2822 | shove:2872 | hurt:2898 | move:2948 | follow:2985 | walkTo:3011 | target:3023 | approach:3030 | updatePlayer:3046 | canTargetEva:3129 | updateEnemies:3133 | updateNpc:3249 | explore:3272 | updateExposure:3282 | updateNeeds:3294 | tick:3332 | updateDoorLure:3391 | breakLeg:3418 | healFracture:3426 | updateSickness:3435 | freeSpot:3458 | unstick:3471 | startSleep:3488 | fastSleep:3498 | sleep:3513 | moodles:3520 | snapshotPlayer:3544 | snapshotZone:3548 | snapshotRun:3556 | zoneShape:3578 | migrate:3596 | restore:3602

## game/view.js (2818 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1323 | roofArt:1345 | roofCoversPlayer:1396 | marker:1404 | survivorPalette:1450 | actorFrame:1462 | drawHeldWeapon:1667 | weaponIcon:1696 | drawZombieSprite:1716 | microActor:1762 | equipmentPortrait:1815 | actor:1828 | beamReach:1988 | flashlightBeam:1998 | warmBeamSprite:2018 | warmFlashlight:2041 | windowGlow:2067 | weatherEffects:2091 | drawDestination:2127 | chunkSignature:2154 | buildChunk:2162 | groundLayer:2190 | dimAround:2207 | afterlifePixels:2245 | afterlifePortrait:2272 | renderAfterlife:2284 | render:2432 | locate:2710 | mapFit:2730 | mapPoint:2735 | minimapLayer:2743 | minimap:2762

## game/game.js (2632 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1805 | interactions:1814 | nearbyAction:1831 | strike:1861 | quickUse:1869 | pause:1876 | visualAtmosphere:1886 | atmospherePanel:1890 | applyAtmosphere:1900 | exportSave:1911 | refreshPanel:1918 | bagChanged:1926 | changeInventory:1936 | bindTap:2282 | updateStick:2355 | shoveOrBrake:2383 | frame:2505
