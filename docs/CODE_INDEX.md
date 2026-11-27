# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (634 lines)
worldRules:220 | traitLoadout:452 | character:534

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

## game/sim.js (4541 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:552 | difficultyOptions:604 | setDifficulty:613 | dangerRating:632 | recordPlaytest:640 | createRecommended:644 | campaignGoals:662 | campaignGoal:690 | campaignTarget:695 | campaignTip:728 | pinnedGoal:768 | nearby:781 | containers:785 | readCinemaNote:804 | unreadClueAt:812 | nearbyClues:819 | readClue:824 | isSupplyCache:830 | nearbySupplyCache:835 | collectSupplyCache:841 | sources:853 | available:857 | consume:861 | collect:875 | collectAll:903 | drop:922 | stash:951 | use:961 | beltItem:1051 | setBelt:1059 | useBelt:1066 | activeLight:1075 | replaceBattery:1080 | toggleLight:1089 | recipeProblem:1107 | craft:1131 | place:1157 | vehicle:1200 | enterVehicle:1204 | exitVehicle:1225 | refuel:1253 | vehicleRepairProblem:1267 | repairVehicle:1275 | brake:1287 | updateVehicle:1294 | longHaulGoals:1375 | longHaulHint:1388 | updateLongHaul:1412 | destination:1437 | markDestination:1461 | markStation:1481 | restoreCampaign:1494 | placeCampaignPages:1516 | takeStatue:1536 | updateCinemaTrap:1576 | updatePineRidge:1594 | updateCinemaBuff:1625 | placeIronworks:1635 | dismantleCage:1660 | readTerminal:1685 | placeGrottoPlate:1694 | readGrottoPlate:1701 | placeFatHill:1714 | bossDamage:1748 | removeGuard:1772 | fathillFear:1781 | fathillFinale:1791 | playViolin:1802 | spotIn:1817 | placeAmigo1:1825 | placeFortress:1843 | throwMolotov:1874 | updateFire:1892 | pipBurn:1902 | pipFinale:1909 | aiSend:1920 | useAiTerminal:1948 | vicFinale:1954 | readVicDiary:1964 | placeFieldsLedger:1978 | fieldsAlarm:1994 | readFieldsLedger:2002 | finishGrotto:2020 | placeEvaDiary:2030 | updateEva:2041 | readEvaDiary:2059 | readCampaignPage:2068 | campaignProblem:2085 | travelProblem:2094 | arrivalPosition:2106 | travel:2117 | exploredTile:2160 | saveMapPin:2165 | markPin:2184 | removePin:2192 | noise:2201 | hear:2219 | hearZombie:2227 | encounterSlots:2242 | newInfected:2248 | freeEncounterSpot:2254 | wakeNest:2260 | touchFungus:2279 | noticeCrib:2283 | inspectCrib:2293 | warnHorde:2299 | resumeEncounterWarning:2306 | waveSpots:2310 | updateHordes:2320 | waitWithWatch:2377 | armWatch:2400 | updateAtmosphere:2410 | listenAtDoor:2471 | sceneProblem:2491 | revealLedgerCache:2496 | resolveScene:2502 | dispatchProblem:2528 | sendDispatch:2537 | readDispatchReport:2544 | settleDispatch:2552 | openingOccupied:2584 | breachProblem:2598 | breach:2608 | door:2647 | barricade:2678 | unboard:2694 | removeBarrier:2705 | minutesToRain:2717 | sight:2746 | canSee:2753 | drainLight:2762 | useTap:2771 | useGenerator:2791 | updateUtilities:2811 | fireBatch:2844 | startFireBatch:2851 | collectFireBatch:2867 | mushroomProblem:2910 | harvestMushroom:2917 | updateFungalAlert:2932 | readFieldNote:2948 | wildProblem:2968 | useWild:2990 | sow:3025 | waterGarden:3035 | gardenYield:3043 | harvestGarden:3049 | growGarden:3067 | updateOutdoor:3079 | catchUpArea:3090 | evaAtShelter:3127 | toggleGardenHelp:3132 | tendShelterGarden:3141 | dismantleFurniture:3163 | contextual:3173 | recruit:3229 | threats:3239 | damageFactor:3243 | aimChance:3250 | inAttackRange:3255 | closestInReach:3259 | attackTarget:3270 | touchAttackTarget:3276 | weaponProblem:3291 | endPursuit:3297 | endWindup:3303 | faceTowards:3308 | carriedSupply:3314 | defeat:3326 | attack:3343 | shove:3396 | hurt:3426 | move:3476 | follow:3513 | walkTo:3539 | target:3551 | approach:3558 | updatePlayer:3574 | canTargetEva:3657 | leaveTrack:3665 | nearbyTrack:3680 | inspectTrack:3693 | updateEnemies:3706 | updateNpc:3841 | explore:3864 | updateExposure:3874 | updateNeeds:3886 | tick:3924 | updateDoorLure:3985 | breakLeg:4012 | healFracture:4020 | updateSickness:4029 | freeSpot:4052 | unstick:4065 | startSleep:4082 | fastSleep:4092 | sleep:4107 | moodles:4114 | snapshotPlayer:4138 | snapshotZone:4142 | snapshotRun:4151 | zoneShape:4173 | migrate:4191 | restore:4197

## game/view.js (3006 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1675 | weaponIcon:1704 | drawZombieSprite:1724 | pickPlainInfected:1786 | recolouredAtlas:1802 | characterFor:1831 | charImage:1847 | drawCharacter:1853 | microActor:1904 | equipmentPortrait:1959 | deathFall:1975 | actor:1981 | beamReach:2156 | flashlightBeam:2166 | warmBeamSprite:2186 | warmFlashlight:2209 | windowGlow:2235 | weatherEffects:2259 | drawDestination:2295 | chunkSignature:2322 | buildChunk:2330 | groundLayer:2358 | dimAround:2375 | afterlifePixels:2413 | afterlifePortrait:2440 | renderAfterlife:2452 | render:2600 | locate:2898 | mapFit:2918 | mapPoint:2923 | minimapLayer:2931 | minimap:2950

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
