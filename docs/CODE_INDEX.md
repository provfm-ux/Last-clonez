# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (702 lines)
worldRules:226 | traitLoadout:520 | character:602

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/expedition.js (197 lines)
record:147

## game/regions.js (629 lines)
cinemaOutcome:48 | addExits:54 | add:55 | connection:90 | oldExit:110 | expand:114 | createGrotto:161 | create:191 | zone:202 | paint:268 | road:272 | add:292 | loot:300 | building:305 | addWilds:608

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

## game/sim.js (4789 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:556 | difficultyOptions:608 | setDifficulty:617 | dangerRating:636 | recordPlaytest:644 | createRecommended:648 | campaignGoals:666 | campaignGoal:694 | campaignTarget:699 | idleIdea:732 | radioNeeds:756 | radioChecklist:766 | campaignTip:775 | pinnedGoal:820 | nearby:833 | containers:837 | readCinemaNote:856 | unreadClueAt:864 | nearbyClues:871 | readClue:876 | isSupplyCache:882 | nearbySupplyCache:887 | collectSupplyCache:893 | sources:905 | available:909 | consume:913 | collect:927 | collectAll:959 | drop:978 | stash:1007 | use:1017 | beltItem:1113 | setBelt:1121 | useBelt:1128 | activeLight:1137 | replaceBattery:1142 | toggleLight:1151 | recipeProblem:1169 | craft:1193 | place:1219 | vehicle:1262 | enterVehicle:1266 | exitVehicle:1287 | refuel:1315 | vehicleRepairProblem:1329 | repairVehicle:1337 | brake:1349 | updateVehicle:1356 | longHaulGoals:1437 | longHaulHint:1450 | updateLongHaul:1474 | destination:1499 | markDestination:1523 | markStation:1543 | restoreCampaign:1556 | placeCampaignPages:1584 | takeStatue:1604 | updateCinemaTrap:1644 | updatePineRidge:1662 | updateCinemaBuff:1693 | placeIronworks:1704 | dismantleCage:1729 | readTerminal:1754 | placeGrottoPlate:1763 | readGrottoPlate:1770 | placeFatHill:1783 | bossDamage:1817 | removeGuard:1853 | fathillFear:1862 | fathillFinale:1872 | playViolin:1883 | spotIn:1898 | placeAmigo1:1906 | roomSpots:1925 | placeOptional:1932 | updateOptional:1960 | updateTide:1975 | updateViolinCall:1993 | placeFortress:2025 | throwMolotov:2056 | updateFire:2074 | pipBurn:2084 | pipFinale:2091 | aiSend:2103 | useAiTerminal:2133 | seeEpilogue:2142 | vicFinale:2148 | readVicDiary:2157 | placeFieldsLedger:2171 | fieldsAlarm:2187 | readFieldsLedger:2195 | finishGrotto:2213 | placeEvaDiary:2223 | updateEva:2234 | readEvaDiary:2252 | readCampaignPage:2261 | campaignProblem:2289 | travelProblem:2298 | arrivalPosition:2310 | travel:2321 | exploredTile:2364 | saveMapPin:2369 | markPin:2388 | removePin:2396 | noise:2405 | hear:2423 | hearZombie:2431 | encounterSlots:2446 | newInfected:2452 | freeEncounterSpot:2458 | wakeNest:2464 | touchFungus:2483 | noticeCrib:2487 | inspectCrib:2497 | warnHorde:2503 | resumeEncounterWarning:2510 | waveSpots:2514 | updateHordes:2524 | waitWithWatch:2581 | armWatch:2604 | updateAtmosphere:2614 | listenAtDoor:2675 | sceneProblem:2695 | revealLedgerCache:2700 | resolveScene:2706 | dispatchProblem:2732 | sendDispatch:2741 | readDispatchReport:2748 | settleDispatch:2756 | openingOccupied:2788 | climbThrough:2803 | breachProblem:2821 | breach:2831 | door:2870 | barricade:2901 | unboard:2917 | removeBarrier:2928 | minutesToRain:2940 | sight:2969 | canSee:2976 | drainLight:2985 | useTap:2994 | useGenerator:3014 | updateUtilities:3034 | fireBatch:3067 | startFireBatch:3074 | collectFireBatch:3090 | mushroomProblem:3133 | harvestMushroom:3140 | updateFungalAlert:3155 | readFieldNote:3171 | wildProblem:3191 | useWild:3213 | sow:3248 | waterGarden:3258 | gardenYield:3266 | harvestGarden:3272 | growGarden:3290 | updateOutdoor:3302 | catchUpArea:3313 | evaAtShelter:3350 | toggleGardenHelp:3355 | tendShelterGarden:3364 | restOnSeat:3386 | dismantleFurniture:3397 | contextual:3407 | recruit:3464 | threats:3474 | damageFactor:3478 | aimChance:3485 | inAttackRange:3490 | closestInReach:3494 | attackTarget:3505 | touchAttackTarget:3511 | weaponProblem:3526 | endPursuit:3532 | endWindup:3538 | faceTowards:3543 | carriedSupply:3549 | defeat:3561 | attack:3578 | shove:3631 | hurt:3661 | move:3711 | follow:3748 | walkTo:3774 | target:3786 | approach:3793 | updatePlayer:3809 | canTargetEva:3892 | leaveTrack:3900 | nearbyTrack:3915 | inspectTrack:3928 | updateEnemies:3941 | updateNpc:4076 | explore:4099 | updateExposure:4110 | updateNeeds:4123 | tick:4161 | updateDoorLure:4222 | breakLeg:4249 | healFracture:4257 | updateSickness:4266 | freeSpot:4289 | unstick:4302 | startSleep:4319 | fastSleep:4329 | sleep:4355 | moodles:4362 | snapshotPlayer:4386 | snapshotZone:4390 | snapshotRun:4399 | zoneShape:4421 | migrate:4439 | restore:4445

## game/view.js (3101 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:730 | campfireSmoke:750 | prop:770 | roof:1341 | roofArt:1363 | roofCoversPlayer:1414 | marker:1422 | survivorPalette:1468 | actorFrame:1480 | drawHeldWeapon:1687 | weaponIcon:1716 | drawZombieSprite:1736 | pickPlainInfected:1798 | recolouredAtlas:1814 | characterFor:1843 | charImage:1859 | restPoseFor:1868 | occluded:1885 | drawPropSprite:1894 | drawRestPose:1905 | drawCharacter:1931 | microActor:1983 | equipmentPortrait:2042 | deathFall:2058 | actor:2064 | beamReach:2240 | flashlightBeam:2250 | warmBeamSprite:2270 | warmFlashlight:2293 | windowGlow:2319 | weatherEffects:2343 | drawDestination:2379 | chunkSignature:2406 | buildChunk:2414 | groundLayer:2442 | dimAround:2459 | afterlifePixels:2497 | afterlifePortrait:2524 | renderAfterlife:2536 | render:2684 | locate:2993 | mapFit:3013 | mapPoint:3018 | minimapLayer:3026 | minimap:3045

## game/game.js (2794 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | importSummary:475 | continueLabel:486 | resumeSaved:494 | aiChat:513 | show:523 | close:537 | menu:550 | titleScreen:560 | wakeSound:579 | cue:592 | syncSound:604 | objectives:613 | objectiveHtml:628 | skillsHtml:632 | conditions:644 | nearbyObjects:664 | guidedBat:679 | interactionLabel:685 | canTalk:697 | setHtml:703 | updateHud:709 | help:843 | landmarks:853 | map:863 | savePinForm:913 | itemIcon:924 | weaponCondition:929 | itemDescription:935 | matches:965 | inventoryItems:975 | nearbyItems:998 | updateInventoryLists:1019 | bag:1061 | useBelt:1099 | updateBelt:1106 | beltPanel:1128 | gear:1142 | survivorFields:1197 | survivorProfile:1206 | showTraitPoints:1215 | updateSurvivorPreview:1223 | setSetupSurvivor:1231 | editSurvivor:1241 | crafting:1255 | health:1276 | dailySummary:1306 | diary:1319 | dispatchStatus:1350 | fieldLedger:1365 | ledgerEntry:1404 | ledgerReport:1410 | ledgerPanel:1419 | playtestReport:1455 | copyPlaytest:1499 | knownStory:1512 | storyText:1517 | outbreakLog:1521 | storyEntry:1530 | supplyRun:1539 | gardenStatus:1567 | gardenProject:1576 | waterProject:1596 | utilities:1617 | releases:1636 | research:1643 | npcPanel:1651 | gardenPanel:1668 | stationPanel:1692 | objectPanel:1742 | interact:1927 | interactions:1936 | nearbyAction:1953 | strike:1990 | quickUse:1998 | pause:2005 | visualAtmosphere:2015 | atmospherePanel:2019 | applyAtmosphere:2031 | exportSave:2044 | refreshPanel:2051 | bagChanged:2059 | changeInventory:2069 | bindTap:2434 | updateStick:2507 | shoveOrBrake:2535 | frame:2658
