# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (685 lines)
worldRules:222 | traitLoadout:503 | character:585

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

## game/sim.js (4703 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | idleIdea:729 | campaignTip:743 | pinnedGoal:788 | nearby:801 | containers:805 | readCinemaNote:824 | unreadClueAt:832 | nearbyClues:839 | readClue:844 | isSupplyCache:850 | nearbySupplyCache:855 | collectSupplyCache:861 | sources:873 | available:877 | consume:881 | collect:895 | collectAll:927 | drop:946 | stash:975 | use:985 | beltItem:1075 | setBelt:1083 | useBelt:1090 | activeLight:1099 | replaceBattery:1104 | toggleLight:1113 | recipeProblem:1131 | craft:1155 | place:1181 | vehicle:1224 | enterVehicle:1228 | exitVehicle:1249 | refuel:1277 | vehicleRepairProblem:1291 | repairVehicle:1299 | brake:1311 | updateVehicle:1318 | longHaulGoals:1399 | longHaulHint:1412 | updateLongHaul:1436 | destination:1461 | markDestination:1485 | markStation:1505 | restoreCampaign:1518 | placeCampaignPages:1546 | takeStatue:1566 | updateCinemaTrap:1606 | updatePineRidge:1624 | updateCinemaBuff:1655 | placeIronworks:1665 | dismantleCage:1690 | readTerminal:1715 | placeGrottoPlate:1724 | readGrottoPlate:1731 | placeFatHill:1744 | bossDamage:1778 | removeGuard:1814 | fathillFear:1823 | fathillFinale:1833 | playViolin:1844 | spotIn:1859 | placeAmigo1:1867 | roomSpots:1886 | placeOptional:1893 | updateOptional:1921 | updateTide:1933 | updateViolinCall:1951 | placeFortress:1983 | throwMolotov:2014 | updateFire:2032 | pipBurn:2042 | pipFinale:2049 | aiSend:2061 | useAiTerminal:2091 | seeEpilogue:2100 | vicFinale:2106 | readVicDiary:2115 | placeFieldsLedger:2129 | fieldsAlarm:2145 | readFieldsLedger:2153 | finishGrotto:2171 | placeEvaDiary:2181 | updateEva:2192 | readEvaDiary:2210 | readCampaignPage:2219 | campaignProblem:2236 | travelProblem:2245 | arrivalPosition:2257 | travel:2268 | exploredTile:2311 | saveMapPin:2316 | markPin:2335 | removePin:2343 | noise:2352 | hear:2370 | hearZombie:2378 | encounterSlots:2393 | newInfected:2399 | freeEncounterSpot:2405 | wakeNest:2411 | touchFungus:2430 | noticeCrib:2434 | inspectCrib:2444 | warnHorde:2450 | resumeEncounterWarning:2457 | waveSpots:2461 | updateHordes:2471 | waitWithWatch:2528 | armWatch:2551 | updateAtmosphere:2561 | listenAtDoor:2622 | sceneProblem:2642 | revealLedgerCache:2647 | resolveScene:2653 | dispatchProblem:2679 | sendDispatch:2688 | readDispatchReport:2695 | settleDispatch:2703 | openingOccupied:2735 | breachProblem:2749 | breach:2759 | door:2798 | barricade:2829 | unboard:2845 | removeBarrier:2856 | minutesToRain:2868 | sight:2897 | canSee:2904 | drainLight:2913 | useTap:2922 | useGenerator:2942 | updateUtilities:2962 | fireBatch:2995 | startFireBatch:3002 | collectFireBatch:3018 | mushroomProblem:3061 | harvestMushroom:3068 | updateFungalAlert:3083 | readFieldNote:3099 | wildProblem:3119 | useWild:3141 | sow:3176 | waterGarden:3186 | gardenYield:3194 | harvestGarden:3200 | growGarden:3218 | updateOutdoor:3230 | catchUpArea:3241 | evaAtShelter:3278 | toggleGardenHelp:3283 | tendShelterGarden:3292 | restOnSeat:3314 | dismantleFurniture:3325 | contextual:3335 | recruit:3391 | threats:3401 | damageFactor:3405 | aimChance:3412 | inAttackRange:3417 | closestInReach:3421 | attackTarget:3432 | touchAttackTarget:3438 | weaponProblem:3453 | endPursuit:3459 | endWindup:3465 | faceTowards:3470 | carriedSupply:3476 | defeat:3488 | attack:3505 | shove:3558 | hurt:3588 | move:3638 | follow:3675 | walkTo:3701 | target:3713 | approach:3720 | updatePlayer:3736 | canTargetEva:3819 | leaveTrack:3827 | nearbyTrack:3842 | inspectTrack:3855 | updateEnemies:3868 | updateNpc:4003 | explore:4026 | updateExposure:4036 | updateNeeds:4048 | tick:4086 | updateDoorLure:4147 | breakLeg:4174 | healFracture:4182 | updateSickness:4191 | freeSpot:4214 | unstick:4227 | startSleep:4244 | fastSleep:4254 | sleep:4269 | moodles:4276 | snapshotPlayer:4300 | snapshotZone:4304 | snapshotRun:4313 | zoneShape:4335 | migrate:4353 | restore:4359

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2745 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:643 | guidedBat:658 | interactionLabel:664 | canTalk:676 | setHtml:682 | updateHud:688 | help:821 | landmarks:831 | map:841 | savePinForm:891 | itemIcon:902 | weaponCondition:907 | itemDescription:913 | matches:943 | inventoryItems:953 | nearbyItems:976 | updateInventoryLists:997 | bag:1039 | useBelt:1077 | updateBelt:1084 | beltPanel:1106 | gear:1120 | survivorFields:1175 | survivorProfile:1184 | showTraitPoints:1193 | updateSurvivorPreview:1201 | setSetupSurvivor:1209 | editSurvivor:1219 | crafting:1233 | health:1254 | dailySummary:1284 | diary:1297 | dispatchStatus:1328 | fieldLedger:1343 | ledgerEntry:1382 | ledgerReport:1388 | ledgerPanel:1397 | playtestReport:1433 | copyPlaytest:1477 | knownStory:1490 | storyText:1495 | outbreakLog:1499 | storyEntry:1508 | supplyRun:1517 | gardenStatus:1545 | gardenProject:1554 | waterProject:1574 | utilities:1595 | releases:1614 | research:1621 | npcPanel:1629 | gardenPanel:1646 | stationPanel:1670 | objectPanel:1720 | interact:1895 | interactions:1904 | nearbyAction:1921 | strike:1952 | quickUse:1960 | pause:1967 | visualAtmosphere:1977 | atmospherePanel:1981 | applyAtmosphere:1993 | exportSave:2006 | refreshPanel:2013 | bagChanged:2021 | changeInventory:2031 | bindTap:2386 | updateStick:2459 | shoveOrBrake:2487 | frame:2610
