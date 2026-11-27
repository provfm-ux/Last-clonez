# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (581 lines)
worldRules:215 | traitLoadout:401 | character:483

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

## game/campaign-hints.js (48 lines)
track:23 | progress:28 | next:33 | restore:40

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4331 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:550 | difficultyOptions:602 | setDifficulty:611 | dangerRating:630 | recordPlaytest:638 | createRecommended:642 | campaignGoals:660 | campaignGoal:679 | campaignTarget:684 | campaignTip:708 | pinnedGoal:739 | nearby:752 | containers:756 | readCinemaNote:775 | unreadClueAt:783 | nearbyClues:790 | readClue:795 | isSupplyCache:801 | nearbySupplyCache:806 | collectSupplyCache:812 | sources:824 | available:828 | consume:832 | collect:846 | collectAll:874 | drop:893 | stash:922 | use:932 | beltItem:1021 | setBelt:1029 | useBelt:1036 | activeLight:1045 | replaceBattery:1050 | toggleLight:1059 | recipeProblem:1077 | craft:1101 | place:1127 | vehicle:1170 | enterVehicle:1174 | exitVehicle:1195 | refuel:1223 | vehicleRepairProblem:1237 | repairVehicle:1245 | brake:1257 | updateVehicle:1264 | longHaulGoals:1345 | longHaulHint:1358 | updateLongHaul:1382 | destination:1407 | markDestination:1431 | markStation:1451 | restoreCampaign:1464 | placeCampaignPages:1483 | takeStatue:1503 | updateCinemaTrap:1543 | updatePineRidge:1561 | updateCinemaBuff:1592 | placeIronworks:1602 | dismantleCage:1627 | readTerminal:1652 | placeGrottoPlate:1661 | readGrottoPlate:1668 | placeFatHill:1681 | bossDamage:1715 | removeGuard:1728 | fathillFear:1737 | fathillFinale:1747 | playViolin:1758 | placeFieldsLedger:1773 | fieldsAlarm:1789 | readFieldsLedger:1797 | finishGrotto:1815 | placeEvaDiary:1825 | updateEva:1836 | readEvaDiary:1854 | readCampaignPage:1863 | campaignProblem:1880 | travelProblem:1889 | arrivalPosition:1901 | travel:1912 | exploredTile:1955 | saveMapPin:1960 | markPin:1979 | removePin:1987 | noise:1996 | hear:2014 | hearZombie:2022 | encounterSlots:2037 | newInfected:2043 | freeEncounterSpot:2049 | wakeNest:2055 | touchFungus:2074 | noticeCrib:2078 | inspectCrib:2088 | warnHorde:2094 | resumeEncounterWarning:2101 | waveSpots:2105 | updateHordes:2115 | waitWithWatch:2172 | armWatch:2195 | updateAtmosphere:2205 | listenAtDoor:2266 | sceneProblem:2286 | revealLedgerCache:2291 | resolveScene:2297 | dispatchProblem:2323 | sendDispatch:2332 | readDispatchReport:2339 | settleDispatch:2347 | openingOccupied:2379 | breachProblem:2393 | breach:2403 | door:2442 | barricade:2473 | unboard:2489 | removeBarrier:2500 | minutesToRain:2512 | sight:2541 | canSee:2548 | drainLight:2557 | useTap:2566 | useGenerator:2586 | updateUtilities:2606 | fireBatch:2639 | startFireBatch:2646 | collectFireBatch:2662 | mushroomProblem:2705 | harvestMushroom:2712 | updateFungalAlert:2727 | readFieldNote:2743 | wildProblem:2763 | useWild:2785 | sow:2820 | waterGarden:2830 | gardenYield:2838 | harvestGarden:2844 | growGarden:2862 | updateOutdoor:2874 | catchUpArea:2885 | evaAtShelter:2922 | toggleGardenHelp:2927 | tendShelterGarden:2936 | dismantleFurniture:2958 | contextual:2968 | recruit:3024 | threats:3034 | damageFactor:3038 | aimChance:3045 | inAttackRange:3050 | closestInReach:3054 | attackTarget:3065 | touchAttackTarget:3071 | weaponProblem:3086 | endPursuit:3092 | endWindup:3098 | faceTowards:3103 | carriedSupply:3109 | defeat:3121 | attack:3136 | shove:3188 | hurt:3218 | move:3268 | follow:3305 | walkTo:3331 | target:3343 | approach:3350 | updatePlayer:3366 | canTargetEva:3449 | leaveTrack:3457 | nearbyTrack:3472 | inspectTrack:3485 | updateEnemies:3498 | updateNpc:3632 | explore:3655 | updateExposure:3665 | updateNeeds:3677 | tick:3715 | updateDoorLure:3775 | breakLeg:3802 | healFracture:3810 | updateSickness:3819 | freeSpot:3842 | unstick:3855 | startSleep:3872 | fastSleep:3882 | sleep:3897 | moodles:3904 | snapshotPlayer:3928 | snapshotZone:3932 | snapshotRun:3941 | zoneShape:3963 | migrate:3981 | restore:3987

## game/view.js (2992 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1844 | drawCharacter:1850 | microActor:1901 | equipmentPortrait:1956 | deathFall:1972 | actor:1978 | beamReach:2153 | flashlightBeam:2163 | warmBeamSprite:2183 | warmFlashlight:2206 | windowGlow:2232 | weatherEffects:2256 | drawDestination:2292 | chunkSignature:2319 | buildChunk:2327 | groundLayer:2355 | dimAround:2372 | afterlifePixels:2410 | afterlifePortrait:2437 | renderAfterlife:2449 | render:2597 | locate:2884 | mapFit:2904 | mapPoint:2909 | minimapLayer:2917 | minimap:2936

## game/game.js (2706 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | show:492 | close:506 | menu:519 | titleScreen:529 | wakeSound:547 | cue:560 | syncSound:572 | objectives:581 | objectiveHtml:596 | skillsHtml:600 | conditions:612 | nearbyObjects:628 | guidedBat:642 | interactionLabel:648 | canTalk:660 | setHtml:666 | updateHud:672 | help:803 | landmarks:813 | map:823 | savePinForm:873 | itemIcon:884 | weaponCondition:889 | itemDescription:895 | matches:925 | inventoryItems:935 | nearbyItems:958 | updateInventoryLists:979 | bag:1021 | useBelt:1059 | updateBelt:1066 | beltPanel:1088 | gear:1102 | survivorFields:1157 | survivorProfile:1166 | showTraitPoints:1175 | updateSurvivorPreview:1183 | setSetupSurvivor:1191 | editSurvivor:1201 | crafting:1215 | health:1236 | dailySummary:1266 | diary:1279 | dispatchStatus:1310 | fieldLedger:1325 | ledgerEntry:1364 | ledgerReport:1370 | ledgerPanel:1379 | playtestReport:1415 | copyPlaytest:1459 | knownStory:1472 | storyText:1477 | outbreakLog:1481 | storyEntry:1490 | supplyRun:1499 | gardenStatus:1527 | gardenProject:1536 | waterProject:1556 | utilities:1577 | releases:1596 | research:1603 | npcPanel:1611 | gardenPanel:1628 | stationPanel:1652 | objectPanel:1702 | interact:1868 | interactions:1877 | nearbyAction:1894 | strike:1925 | quickUse:1933 | pause:1940 | visualAtmosphere:1950 | atmospherePanel:1954 | applyAtmosphere:1966 | exportSave:1979 | refreshPanel:1986 | bagChanged:1994 | changeInventory:2004 | bindTap:2351 | updateStick:2424 | shoveOrBrake:2452 | frame:2575
