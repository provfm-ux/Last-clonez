# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (628 lines)
worldRules:216 | traitLoadout:446 | character:528

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/expedition.js (197 lines)
record:147

## game/regions.js (622 lines)
cinemaOutcome:48 | addExits:54 | add:55 | connection:90 | oldExit:110 | expand:114 | createGrotto:161 | create:191 | zone:202 | paint:268 | road:272 | add:292 | loot:300 | building:305 | addWilds:601

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (336 lines)
available:230 | place:258 | fixture:260 | cache:273 | incidentProblem:292 | tideForecast:302 | ready:308 | restore:312

## game/world.js (188 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:47 | build:57 | clear:116 | drivable:123 | sees:127 | route:137

## game/atmosphere.js (151 lines)
place:58 | clearCell:61 | add:65 | nextWave:121 | create:125 | restore:131

## game/recordings.js (8 lines)
(no named functions)

## game/soundscape.js (281 lines)
setVolumes:11 | makeBuffer:38 | decodeRecording:148 | preload:158 | bankFor:171 | zombieClip:184 | playZombie:195 | play:222 | output:241 | stop:268

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (48 lines)
track:23 | progress:28 | next:33 | restore:40

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4505 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:552 | difficultyOptions:604 | setDifficulty:613 | dangerRating:632 | recordPlaytest:640 | createRecommended:644 | campaignGoals:662 | campaignGoal:690 | campaignTarget:695 | campaignTip:728 | pinnedGoal:768 | nearby:781 | containers:785 | readCinemaNote:804 | unreadClueAt:812 | nearbyClues:819 | readClue:824 | isSupplyCache:830 | nearbySupplyCache:835 | collectSupplyCache:841 | sources:853 | available:857 | consume:861 | collect:875 | collectAll:903 | drop:922 | stash:951 | use:961 | beltItem:1050 | setBelt:1058 | useBelt:1065 | activeLight:1074 | replaceBattery:1079 | toggleLight:1088 | recipeProblem:1106 | craft:1130 | place:1156 | vehicle:1199 | enterVehicle:1203 | exitVehicle:1224 | refuel:1252 | vehicleRepairProblem:1266 | repairVehicle:1274 | brake:1286 | updateVehicle:1293 | longHaulGoals:1374 | longHaulHint:1387 | updateLongHaul:1411 | destination:1436 | markDestination:1460 | markStation:1480 | restoreCampaign:1493 | placeCampaignPages:1515 | takeStatue:1535 | updateCinemaTrap:1575 | updatePineRidge:1593 | updateCinemaBuff:1624 | placeIronworks:1634 | dismantleCage:1659 | readTerminal:1684 | placeGrottoPlate:1693 | readGrottoPlate:1700 | placeFatHill:1713 | bossDamage:1747 | removeGuard:1770 | fathillFear:1779 | fathillFinale:1789 | playViolin:1800 | spotIn:1815 | placeAmigo1:1823 | placeFortress:1841 | pipBurn:1868 | pipFinale:1875 | aiSend:1886 | useAiTerminal:1914 | vicFinale:1920 | readVicDiary:1930 | placeFieldsLedger:1944 | fieldsAlarm:1960 | readFieldsLedger:1968 | finishGrotto:1986 | placeEvaDiary:1996 | updateEva:2007 | readEvaDiary:2025 | readCampaignPage:2034 | campaignProblem:2051 | travelProblem:2060 | arrivalPosition:2072 | travel:2083 | exploredTile:2126 | saveMapPin:2131 | markPin:2150 | removePin:2158 | noise:2167 | hear:2185 | hearZombie:2193 | encounterSlots:2208 | newInfected:2214 | freeEncounterSpot:2220 | wakeNest:2226 | touchFungus:2245 | noticeCrib:2249 | inspectCrib:2259 | warnHorde:2265 | resumeEncounterWarning:2272 | waveSpots:2276 | updateHordes:2286 | waitWithWatch:2343 | armWatch:2366 | updateAtmosphere:2376 | listenAtDoor:2437 | sceneProblem:2457 | revealLedgerCache:2462 | resolveScene:2468 | dispatchProblem:2494 | sendDispatch:2503 | readDispatchReport:2510 | settleDispatch:2518 | openingOccupied:2550 | breachProblem:2564 | breach:2574 | door:2613 | barricade:2644 | unboard:2660 | removeBarrier:2671 | minutesToRain:2683 | sight:2712 | canSee:2719 | drainLight:2728 | useTap:2737 | useGenerator:2757 | updateUtilities:2777 | fireBatch:2810 | startFireBatch:2817 | collectFireBatch:2833 | mushroomProblem:2876 | harvestMushroom:2883 | updateFungalAlert:2898 | readFieldNote:2914 | wildProblem:2934 | useWild:2956 | sow:2991 | waterGarden:3001 | gardenYield:3009 | harvestGarden:3015 | growGarden:3033 | updateOutdoor:3045 | catchUpArea:3056 | evaAtShelter:3093 | toggleGardenHelp:3098 | tendShelterGarden:3107 | dismantleFurniture:3129 | contextual:3139 | recruit:3195 | threats:3205 | damageFactor:3209 | aimChance:3216 | inAttackRange:3221 | closestInReach:3225 | attackTarget:3236 | touchAttackTarget:3242 | weaponProblem:3257 | endPursuit:3263 | endWindup:3269 | faceTowards:3274 | carriedSupply:3280 | defeat:3292 | attack:3309 | shove:3361 | hurt:3391 | move:3441 | follow:3478 | walkTo:3504 | target:3516 | approach:3523 | updatePlayer:3539 | canTargetEva:3622 | leaveTrack:3630 | nearbyTrack:3645 | inspectTrack:3658 | updateEnemies:3671 | updateNpc:3806 | explore:3829 | updateExposure:3839 | updateNeeds:3851 | tick:3889 | updateDoorLure:3949 | breakLeg:3976 | healFracture:3984 | updateSickness:3993 | freeSpot:4016 | unstick:4029 | startSleep:4046 | fastSleep:4056 | sleep:4071 | moodles:4078 | snapshotPlayer:4102 | snapshotZone:4106 | snapshotRun:4115 | zoneShape:4137 | migrate:4155 | restore:4161

## game/view.js (2994 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1846 | drawCharacter:1852 | microActor:1903 | equipmentPortrait:1958 | deathFall:1974 | actor:1980 | beamReach:2155 | flashlightBeam:2165 | warmBeamSprite:2185 | warmFlashlight:2208 | windowGlow:2234 | weatherEffects:2258 | drawDestination:2294 | chunkSignature:2321 | buildChunk:2329 | groundLayer:2357 | dimAround:2374 | afterlifePixels:2412 | afterlifePortrait:2439 | renderAfterlife:2451 | render:2599 | locate:2886 | mapFit:2906 | mapPoint:2911 | minimapLayer:2919 | minimap:2938

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
