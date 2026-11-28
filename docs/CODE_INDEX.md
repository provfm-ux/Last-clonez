# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (653 lines)
worldRules:222 | traitLoadout:471 | character:553

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

## game/sim.js (4622 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | campaignTip:729 | pinnedGoal:771 | nearby:784 | containers:788 | readCinemaNote:807 | unreadClueAt:815 | nearbyClues:822 | readClue:827 | isSupplyCache:833 | nearbySupplyCache:838 | collectSupplyCache:844 | sources:856 | available:860 | consume:864 | collect:878 | collectAll:910 | drop:929 | stash:958 | use:968 | beltItem:1058 | setBelt:1066 | useBelt:1073 | activeLight:1082 | replaceBattery:1087 | toggleLight:1096 | recipeProblem:1114 | craft:1138 | place:1164 | vehicle:1207 | enterVehicle:1211 | exitVehicle:1232 | refuel:1260 | vehicleRepairProblem:1274 | repairVehicle:1282 | brake:1294 | updateVehicle:1301 | longHaulGoals:1382 | longHaulHint:1395 | updateLongHaul:1419 | destination:1444 | markDestination:1468 | markStation:1488 | restoreCampaign:1501 | placeCampaignPages:1527 | takeStatue:1547 | updateCinemaTrap:1587 | updatePineRidge:1605 | updateCinemaBuff:1636 | placeIronworks:1646 | dismantleCage:1671 | readTerminal:1696 | placeGrottoPlate:1705 | readGrottoPlate:1712 | placeFatHill:1725 | bossDamage:1759 | removeGuard:1784 | fathillFear:1793 | fathillFinale:1803 | playViolin:1814 | spotIn:1829 | placeAmigo1:1837 | roomSpots:1856 | placeOptional:1863 | updateOptional:1891 | updateTide:1901 | placeFortress:1924 | throwMolotov:1955 | updateFire:1973 | pipBurn:1983 | pipFinale:1990 | aiSend:2001 | useAiTerminal:2029 | vicFinale:2035 | readVicDiary:2045 | placeFieldsLedger:2059 | fieldsAlarm:2075 | readFieldsLedger:2083 | finishGrotto:2101 | placeEvaDiary:2111 | updateEva:2122 | readEvaDiary:2140 | readCampaignPage:2149 | campaignProblem:2166 | travelProblem:2175 | arrivalPosition:2187 | travel:2198 | exploredTile:2241 | saveMapPin:2246 | markPin:2265 | removePin:2273 | noise:2282 | hear:2300 | hearZombie:2308 | encounterSlots:2323 | newInfected:2329 | freeEncounterSpot:2335 | wakeNest:2341 | touchFungus:2360 | noticeCrib:2364 | inspectCrib:2374 | warnHorde:2380 | resumeEncounterWarning:2387 | waveSpots:2391 | updateHordes:2401 | waitWithWatch:2458 | armWatch:2481 | updateAtmosphere:2491 | listenAtDoor:2552 | sceneProblem:2572 | revealLedgerCache:2577 | resolveScene:2583 | dispatchProblem:2609 | sendDispatch:2618 | readDispatchReport:2625 | settleDispatch:2633 | openingOccupied:2665 | breachProblem:2679 | breach:2689 | door:2728 | barricade:2759 | unboard:2775 | removeBarrier:2786 | minutesToRain:2798 | sight:2827 | canSee:2834 | drainLight:2843 | useTap:2852 | useGenerator:2872 | updateUtilities:2892 | fireBatch:2925 | startFireBatch:2932 | collectFireBatch:2948 | mushroomProblem:2991 | harvestMushroom:2998 | updateFungalAlert:3013 | readFieldNote:3029 | wildProblem:3049 | useWild:3071 | sow:3106 | waterGarden:3116 | gardenYield:3124 | harvestGarden:3130 | growGarden:3148 | updateOutdoor:3160 | catchUpArea:3171 | evaAtShelter:3208 | toggleGardenHelp:3213 | tendShelterGarden:3222 | dismantleFurniture:3244 | contextual:3254 | recruit:3310 | threats:3320 | damageFactor:3324 | aimChance:3331 | inAttackRange:3336 | closestInReach:3340 | attackTarget:3351 | touchAttackTarget:3357 | weaponProblem:3372 | endPursuit:3378 | endWindup:3384 | faceTowards:3389 | carriedSupply:3395 | defeat:3407 | attack:3424 | shove:3477 | hurt:3507 | move:3557 | follow:3594 | walkTo:3620 | target:3632 | approach:3639 | updatePlayer:3655 | canTargetEva:3738 | leaveTrack:3746 | nearbyTrack:3761 | inspectTrack:3774 | updateEnemies:3787 | updateNpc:3922 | explore:3945 | updateExposure:3955 | updateNeeds:3967 | tick:4005 | updateDoorLure:4066 | breakLeg:4093 | healFracture:4101 | updateSickness:4110 | freeSpot:4133 | unstick:4146 | startSleep:4163 | fastSleep:4173 | sleep:4188 | moodles:4195 | snapshotPlayer:4219 | snapshotZone:4223 | snapshotRun:4232 | zoneShape:4254 | migrate:4272 | restore:4278

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
