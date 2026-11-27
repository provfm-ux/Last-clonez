# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (636 lines)
worldRules:221 | traitLoadout:454 | character:536

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

## game/sim.js (4542 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:552 | difficultyOptions:604 | setDifficulty:613 | dangerRating:632 | recordPlaytest:640 | createRecommended:644 | campaignGoals:662 | campaignGoal:690 | campaignTarget:695 | campaignTip:728 | pinnedGoal:768 | nearby:781 | containers:785 | readCinemaNote:804 | unreadClueAt:812 | nearbyClues:819 | readClue:824 | isSupplyCache:830 | nearbySupplyCache:835 | collectSupplyCache:841 | sources:853 | available:857 | consume:861 | collect:875 | collectAll:903 | drop:922 | stash:951 | use:961 | beltItem:1051 | setBelt:1059 | useBelt:1066 | activeLight:1075 | replaceBattery:1080 | toggleLight:1089 | recipeProblem:1107 | craft:1131 | place:1157 | vehicle:1200 | enterVehicle:1204 | exitVehicle:1225 | refuel:1253 | vehicleRepairProblem:1267 | repairVehicle:1275 | brake:1287 | updateVehicle:1294 | longHaulGoals:1375 | longHaulHint:1388 | updateLongHaul:1412 | destination:1437 | markDestination:1461 | markStation:1481 | restoreCampaign:1494 | placeCampaignPages:1516 | takeStatue:1536 | updateCinemaTrap:1576 | updatePineRidge:1594 | updateCinemaBuff:1625 | placeIronworks:1635 | dismantleCage:1660 | readTerminal:1685 | placeGrottoPlate:1694 | readGrottoPlate:1701 | placeFatHill:1714 | bossDamage:1748 | removeGuard:1773 | fathillFear:1782 | fathillFinale:1792 | playViolin:1803 | spotIn:1818 | placeAmigo1:1826 | placeFortress:1844 | throwMolotov:1875 | updateFire:1893 | pipBurn:1903 | pipFinale:1910 | aiSend:1921 | useAiTerminal:1949 | vicFinale:1955 | readVicDiary:1965 | placeFieldsLedger:1979 | fieldsAlarm:1995 | readFieldsLedger:2003 | finishGrotto:2021 | placeEvaDiary:2031 | updateEva:2042 | readEvaDiary:2060 | readCampaignPage:2069 | campaignProblem:2086 | travelProblem:2095 | arrivalPosition:2107 | travel:2118 | exploredTile:2161 | saveMapPin:2166 | markPin:2185 | removePin:2193 | noise:2202 | hear:2220 | hearZombie:2228 | encounterSlots:2243 | newInfected:2249 | freeEncounterSpot:2255 | wakeNest:2261 | touchFungus:2280 | noticeCrib:2284 | inspectCrib:2294 | warnHorde:2300 | resumeEncounterWarning:2307 | waveSpots:2311 | updateHordes:2321 | waitWithWatch:2378 | armWatch:2401 | updateAtmosphere:2411 | listenAtDoor:2472 | sceneProblem:2492 | revealLedgerCache:2497 | resolveScene:2503 | dispatchProblem:2529 | sendDispatch:2538 | readDispatchReport:2545 | settleDispatch:2553 | openingOccupied:2585 | breachProblem:2599 | breach:2609 | door:2648 | barricade:2679 | unboard:2695 | removeBarrier:2706 | minutesToRain:2718 | sight:2747 | canSee:2754 | drainLight:2763 | useTap:2772 | useGenerator:2792 | updateUtilities:2812 | fireBatch:2845 | startFireBatch:2852 | collectFireBatch:2868 | mushroomProblem:2911 | harvestMushroom:2918 | updateFungalAlert:2933 | readFieldNote:2949 | wildProblem:2969 | useWild:2991 | sow:3026 | waterGarden:3036 | gardenYield:3044 | harvestGarden:3050 | growGarden:3068 | updateOutdoor:3080 | catchUpArea:3091 | evaAtShelter:3128 | toggleGardenHelp:3133 | tendShelterGarden:3142 | dismantleFurniture:3164 | contextual:3174 | recruit:3230 | threats:3240 | damageFactor:3244 | aimChance:3251 | inAttackRange:3256 | closestInReach:3260 | attackTarget:3271 | touchAttackTarget:3277 | weaponProblem:3292 | endPursuit:3298 | endWindup:3304 | faceTowards:3309 | carriedSupply:3315 | defeat:3327 | attack:3344 | shove:3397 | hurt:3427 | move:3477 | follow:3514 | walkTo:3540 | target:3552 | approach:3559 | updatePlayer:3575 | canTargetEva:3658 | leaveTrack:3666 | nearbyTrack:3681 | inspectTrack:3694 | updateEnemies:3707 | updateNpc:3842 | explore:3865 | updateExposure:3875 | updateNeeds:3887 | tick:3925 | updateDoorLure:3986 | breakLeg:4013 | healFracture:4021 | updateSickness:4030 | freeSpot:4053 | unstick:4066 | startSleep:4083 | fastSleep:4093 | sleep:4108 | moodles:4115 | snapshotPlayer:4139 | snapshotZone:4143 | snapshotRun:4152 | zoneShape:4174 | migrate:4192 | restore:4198

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
