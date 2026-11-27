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

## game/view.js (2990 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1842 | drawCharacter:1848 | microActor:1899 | equipmentPortrait:1954 | deathFall:1970 | actor:1976 | beamReach:2151 | flashlightBeam:2161 | warmBeamSprite:2181 | warmFlashlight:2204 | windowGlow:2230 | weatherEffects:2254 | drawDestination:2290 | chunkSignature:2317 | buildChunk:2325 | groundLayer:2353 | dimAround:2370 | afterlifePixels:2408 | afterlifePortrait:2435 | renderAfterlife:2447 | render:2595 | locate:2882 | mapFit:2902 | mapPoint:2907 | minimapLayer:2915 | minimap:2934

## game/game.js (2697 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | show:492 | close:506 | menu:519 | titleScreen:529 | wakeSound:547 | cue:560 | syncSound:572 | objectives:581 | objectiveHtml:596 | skillsHtml:600 | conditions:612 | nearbyObjects:628 | guidedBat:642 | interactionLabel:648 | canTalk:660 | setHtml:666 | updateHud:672 | help:802 | landmarks:812 | map:822 | savePinForm:872 | itemIcon:883 | weaponCondition:888 | itemDescription:894 | matches:924 | inventoryItems:934 | nearbyItems:957 | updateInventoryLists:978 | bag:1020 | useBelt:1058 | updateBelt:1065 | beltPanel:1087 | gear:1101 | survivorFields:1156 | survivorProfile:1165 | showTraitPoints:1174 | updateSurvivorPreview:1182 | setSetupSurvivor:1190 | editSurvivor:1200 | crafting:1214 | health:1235 | dailySummary:1265 | diary:1278 | dispatchStatus:1309 | fieldLedger:1324 | ledgerEntry:1363 | ledgerReport:1369 | ledgerPanel:1378 | playtestReport:1414 | copyPlaytest:1458 | knownStory:1471 | storyText:1476 | outbreakLog:1480 | storyEntry:1489 | supplyRun:1498 | gardenStatus:1526 | gardenProject:1535 | waterProject:1555 | utilities:1576 | releases:1595 | research:1602 | npcPanel:1610 | gardenPanel:1627 | stationPanel:1651 | objectPanel:1701 | interact:1859 | interactions:1868 | nearbyAction:1885 | strike:1916 | quickUse:1924 | pause:1931 | visualAtmosphere:1941 | atmospherePanel:1945 | applyAtmosphere:1957 | exportSave:1970 | refreshPanel:1977 | bagChanged:1985 | changeInventory:1995 | bindTap:2342 | updateStick:2415 | shoveOrBrake:2443 | frame:2566
