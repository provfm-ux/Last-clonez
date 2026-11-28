# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (654 lines)
worldRules:222 | traitLoadout:472 | character:554

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

## game/sim.js (4648 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | campaignTip:729 | pinnedGoal:771 | nearby:784 | containers:788 | readCinemaNote:807 | unreadClueAt:815 | nearbyClues:822 | readClue:827 | isSupplyCache:833 | nearbySupplyCache:838 | collectSupplyCache:844 | sources:856 | available:860 | consume:864 | collect:878 | collectAll:910 | drop:929 | stash:958 | use:968 | beltItem:1058 | setBelt:1066 | useBelt:1073 | activeLight:1082 | replaceBattery:1087 | toggleLight:1096 | recipeProblem:1114 | craft:1138 | place:1164 | vehicle:1207 | enterVehicle:1211 | exitVehicle:1232 | refuel:1260 | vehicleRepairProblem:1274 | repairVehicle:1282 | brake:1294 | updateVehicle:1301 | longHaulGoals:1382 | longHaulHint:1395 | updateLongHaul:1419 | destination:1444 | markDestination:1468 | markStation:1488 | restoreCampaign:1501 | placeCampaignPages:1527 | takeStatue:1547 | updateCinemaTrap:1587 | updatePineRidge:1605 | updateCinemaBuff:1636 | placeIronworks:1646 | dismantleCage:1671 | readTerminal:1696 | placeGrottoPlate:1705 | readGrottoPlate:1712 | placeFatHill:1725 | bossDamage:1759 | removeGuard:1784 | fathillFear:1793 | fathillFinale:1803 | playViolin:1814 | spotIn:1829 | placeAmigo1:1837 | roomSpots:1856 | placeOptional:1863 | updateOptional:1891 | updateTide:1901 | updateViolinCall:1919 | placeFortress:1950 | throwMolotov:1981 | updateFire:1999 | pipBurn:2009 | pipFinale:2016 | aiSend:2027 | useAiTerminal:2055 | vicFinale:2061 | readVicDiary:2071 | placeFieldsLedger:2085 | fieldsAlarm:2101 | readFieldsLedger:2109 | finishGrotto:2127 | placeEvaDiary:2137 | updateEva:2148 | readEvaDiary:2166 | readCampaignPage:2175 | campaignProblem:2192 | travelProblem:2201 | arrivalPosition:2213 | travel:2224 | exploredTile:2267 | saveMapPin:2272 | markPin:2291 | removePin:2299 | noise:2308 | hear:2326 | hearZombie:2334 | encounterSlots:2349 | newInfected:2355 | freeEncounterSpot:2361 | wakeNest:2367 | touchFungus:2386 | noticeCrib:2390 | inspectCrib:2400 | warnHorde:2406 | resumeEncounterWarning:2413 | waveSpots:2417 | updateHordes:2427 | waitWithWatch:2484 | armWatch:2507 | updateAtmosphere:2517 | listenAtDoor:2578 | sceneProblem:2598 | revealLedgerCache:2603 | resolveScene:2609 | dispatchProblem:2635 | sendDispatch:2644 | readDispatchReport:2651 | settleDispatch:2659 | openingOccupied:2691 | breachProblem:2705 | breach:2715 | door:2754 | barricade:2785 | unboard:2801 | removeBarrier:2812 | minutesToRain:2824 | sight:2853 | canSee:2860 | drainLight:2869 | useTap:2878 | useGenerator:2898 | updateUtilities:2918 | fireBatch:2951 | startFireBatch:2958 | collectFireBatch:2974 | mushroomProblem:3017 | harvestMushroom:3024 | updateFungalAlert:3039 | readFieldNote:3055 | wildProblem:3075 | useWild:3097 | sow:3132 | waterGarden:3142 | gardenYield:3150 | harvestGarden:3156 | growGarden:3174 | updateOutdoor:3186 | catchUpArea:3197 | evaAtShelter:3234 | toggleGardenHelp:3239 | tendShelterGarden:3248 | dismantleFurniture:3270 | contextual:3280 | recruit:3336 | threats:3346 | damageFactor:3350 | aimChance:3357 | inAttackRange:3362 | closestInReach:3366 | attackTarget:3377 | touchAttackTarget:3383 | weaponProblem:3398 | endPursuit:3404 | endWindup:3410 | faceTowards:3415 | carriedSupply:3421 | defeat:3433 | attack:3450 | shove:3503 | hurt:3533 | move:3583 | follow:3620 | walkTo:3646 | target:3658 | approach:3665 | updatePlayer:3681 | canTargetEva:3764 | leaveTrack:3772 | nearbyTrack:3787 | inspectTrack:3800 | updateEnemies:3813 | updateNpc:3948 | explore:3971 | updateExposure:3981 | updateNeeds:3993 | tick:4031 | updateDoorLure:4092 | breakLeg:4119 | healFracture:4127 | updateSickness:4136 | freeSpot:4159 | unstick:4172 | startSleep:4189 | fastSleep:4199 | sleep:4214 | moodles:4221 | snapshotPlayer:4245 | snapshotZone:4249 | snapshotRun:4258 | zoneShape:4280 | migrate:4298 | restore:4304

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
