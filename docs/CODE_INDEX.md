# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (667 lines)
worldRules:222 | traitLoadout:485 | character:567

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

## game/sim.js (4672 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | campaignTip:729 | pinnedGoal:772 | nearby:785 | containers:789 | readCinemaNote:808 | unreadClueAt:816 | nearbyClues:823 | readClue:828 | isSupplyCache:834 | nearbySupplyCache:839 | collectSupplyCache:845 | sources:857 | available:861 | consume:865 | collect:879 | collectAll:911 | drop:930 | stash:959 | use:969 | beltItem:1059 | setBelt:1067 | useBelt:1074 | activeLight:1083 | replaceBattery:1088 | toggleLight:1097 | recipeProblem:1115 | craft:1139 | place:1165 | vehicle:1208 | enterVehicle:1212 | exitVehicle:1233 | refuel:1261 | vehicleRepairProblem:1275 | repairVehicle:1283 | brake:1295 | updateVehicle:1302 | longHaulGoals:1383 | longHaulHint:1396 | updateLongHaul:1420 | destination:1445 | markDestination:1469 | markStation:1489 | restoreCampaign:1502 | placeCampaignPages:1529 | takeStatue:1549 | updateCinemaTrap:1589 | updatePineRidge:1607 | updateCinemaBuff:1638 | placeIronworks:1648 | dismantleCage:1673 | readTerminal:1698 | placeGrottoPlate:1707 | readGrottoPlate:1714 | placeFatHill:1727 | bossDamage:1761 | removeGuard:1797 | fathillFear:1806 | fathillFinale:1816 | playViolin:1827 | spotIn:1842 | placeAmigo1:1850 | roomSpots:1869 | placeOptional:1876 | updateOptional:1904 | updateTide:1914 | updateViolinCall:1932 | placeFortress:1963 | throwMolotov:1994 | updateFire:2012 | pipBurn:2022 | pipFinale:2029 | aiSend:2041 | useAiTerminal:2071 | seeEpilogue:2080 | vicFinale:2086 | readVicDiary:2095 | placeFieldsLedger:2109 | fieldsAlarm:2125 | readFieldsLedger:2133 | finishGrotto:2151 | placeEvaDiary:2161 | updateEva:2172 | readEvaDiary:2190 | readCampaignPage:2199 | campaignProblem:2216 | travelProblem:2225 | arrivalPosition:2237 | travel:2248 | exploredTile:2291 | saveMapPin:2296 | markPin:2315 | removePin:2323 | noise:2332 | hear:2350 | hearZombie:2358 | encounterSlots:2373 | newInfected:2379 | freeEncounterSpot:2385 | wakeNest:2391 | touchFungus:2410 | noticeCrib:2414 | inspectCrib:2424 | warnHorde:2430 | resumeEncounterWarning:2437 | waveSpots:2441 | updateHordes:2451 | waitWithWatch:2508 | armWatch:2531 | updateAtmosphere:2541 | listenAtDoor:2602 | sceneProblem:2622 | revealLedgerCache:2627 | resolveScene:2633 | dispatchProblem:2659 | sendDispatch:2668 | readDispatchReport:2675 | settleDispatch:2683 | openingOccupied:2715 | breachProblem:2729 | breach:2739 | door:2778 | barricade:2809 | unboard:2825 | removeBarrier:2836 | minutesToRain:2848 | sight:2877 | canSee:2884 | drainLight:2893 | useTap:2902 | useGenerator:2922 | updateUtilities:2942 | fireBatch:2975 | startFireBatch:2982 | collectFireBatch:2998 | mushroomProblem:3041 | harvestMushroom:3048 | updateFungalAlert:3063 | readFieldNote:3079 | wildProblem:3099 | useWild:3121 | sow:3156 | waterGarden:3166 | gardenYield:3174 | harvestGarden:3180 | growGarden:3198 | updateOutdoor:3210 | catchUpArea:3221 | evaAtShelter:3258 | toggleGardenHelp:3263 | tendShelterGarden:3272 | dismantleFurniture:3294 | contextual:3304 | recruit:3360 | threats:3370 | damageFactor:3374 | aimChance:3381 | inAttackRange:3386 | closestInReach:3390 | attackTarget:3401 | touchAttackTarget:3407 | weaponProblem:3422 | endPursuit:3428 | endWindup:3434 | faceTowards:3439 | carriedSupply:3445 | defeat:3457 | attack:3474 | shove:3527 | hurt:3557 | move:3607 | follow:3644 | walkTo:3670 | target:3682 | approach:3689 | updatePlayer:3705 | canTargetEva:3788 | leaveTrack:3796 | nearbyTrack:3811 | inspectTrack:3824 | updateEnemies:3837 | updateNpc:3972 | explore:3995 | updateExposure:4005 | updateNeeds:4017 | tick:4055 | updateDoorLure:4116 | breakLeg:4143 | healFracture:4151 | updateSickness:4160 | freeSpot:4183 | unstick:4196 | startSleep:4213 | fastSleep:4223 | sleep:4238 | moodles:4245 | snapshotPlayer:4269 | snapshotZone:4273 | snapshotRun:4282 | zoneShape:4304 | migrate:4322 | restore:4328

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2733 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
