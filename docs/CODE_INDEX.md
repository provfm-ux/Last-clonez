# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (668 lines)
worldRules:222 | traitLoadout:486 | character:568

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

## game/sim.js (4678 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | campaignTip:729 | pinnedGoal:774 | nearby:787 | containers:791 | readCinemaNote:810 | unreadClueAt:818 | nearbyClues:825 | readClue:830 | isSupplyCache:836 | nearbySupplyCache:841 | collectSupplyCache:847 | sources:859 | available:863 | consume:867 | collect:881 | collectAll:913 | drop:932 | stash:961 | use:971 | beltItem:1061 | setBelt:1069 | useBelt:1076 | activeLight:1085 | replaceBattery:1090 | toggleLight:1099 | recipeProblem:1117 | craft:1141 | place:1167 | vehicle:1210 | enterVehicle:1214 | exitVehicle:1235 | refuel:1263 | vehicleRepairProblem:1277 | repairVehicle:1285 | brake:1297 | updateVehicle:1304 | longHaulGoals:1385 | longHaulHint:1398 | updateLongHaul:1422 | destination:1447 | markDestination:1471 | markStation:1491 | restoreCampaign:1504 | placeCampaignPages:1532 | takeStatue:1552 | updateCinemaTrap:1592 | updatePineRidge:1610 | updateCinemaBuff:1641 | placeIronworks:1651 | dismantleCage:1676 | readTerminal:1701 | placeGrottoPlate:1710 | readGrottoPlate:1717 | placeFatHill:1730 | bossDamage:1764 | removeGuard:1800 | fathillFear:1809 | fathillFinale:1819 | playViolin:1830 | spotIn:1845 | placeAmigo1:1853 | roomSpots:1872 | placeOptional:1879 | updateOptional:1907 | updateTide:1919 | updateViolinCall:1937 | placeFortress:1969 | throwMolotov:2000 | updateFire:2018 | pipBurn:2028 | pipFinale:2035 | aiSend:2047 | useAiTerminal:2077 | seeEpilogue:2086 | vicFinale:2092 | readVicDiary:2101 | placeFieldsLedger:2115 | fieldsAlarm:2131 | readFieldsLedger:2139 | finishGrotto:2157 | placeEvaDiary:2167 | updateEva:2178 | readEvaDiary:2196 | readCampaignPage:2205 | campaignProblem:2222 | travelProblem:2231 | arrivalPosition:2243 | travel:2254 | exploredTile:2297 | saveMapPin:2302 | markPin:2321 | removePin:2329 | noise:2338 | hear:2356 | hearZombie:2364 | encounterSlots:2379 | newInfected:2385 | freeEncounterSpot:2391 | wakeNest:2397 | touchFungus:2416 | noticeCrib:2420 | inspectCrib:2430 | warnHorde:2436 | resumeEncounterWarning:2443 | waveSpots:2447 | updateHordes:2457 | waitWithWatch:2514 | armWatch:2537 | updateAtmosphere:2547 | listenAtDoor:2608 | sceneProblem:2628 | revealLedgerCache:2633 | resolveScene:2639 | dispatchProblem:2665 | sendDispatch:2674 | readDispatchReport:2681 | settleDispatch:2689 | openingOccupied:2721 | breachProblem:2735 | breach:2745 | door:2784 | barricade:2815 | unboard:2831 | removeBarrier:2842 | minutesToRain:2854 | sight:2883 | canSee:2890 | drainLight:2899 | useTap:2908 | useGenerator:2928 | updateUtilities:2948 | fireBatch:2981 | startFireBatch:2988 | collectFireBatch:3004 | mushroomProblem:3047 | harvestMushroom:3054 | updateFungalAlert:3069 | readFieldNote:3085 | wildProblem:3105 | useWild:3127 | sow:3162 | waterGarden:3172 | gardenYield:3180 | harvestGarden:3186 | growGarden:3204 | updateOutdoor:3216 | catchUpArea:3227 | evaAtShelter:3264 | toggleGardenHelp:3269 | tendShelterGarden:3278 | dismantleFurniture:3300 | contextual:3310 | recruit:3366 | threats:3376 | damageFactor:3380 | aimChance:3387 | inAttackRange:3392 | closestInReach:3396 | attackTarget:3407 | touchAttackTarget:3413 | weaponProblem:3428 | endPursuit:3434 | endWindup:3440 | faceTowards:3445 | carriedSupply:3451 | defeat:3463 | attack:3480 | shove:3533 | hurt:3563 | move:3613 | follow:3650 | walkTo:3676 | target:3688 | approach:3695 | updatePlayer:3711 | canTargetEva:3794 | leaveTrack:3802 | nearbyTrack:3817 | inspectTrack:3830 | updateEnemies:3843 | updateNpc:3978 | explore:4001 | updateExposure:4011 | updateNeeds:4023 | tick:4061 | updateDoorLure:4122 | breakLeg:4149 | healFracture:4157 | updateSickness:4166 | freeSpot:4189 | unstick:4202 | startSleep:4219 | fastSleep:4229 | sleep:4244 | moodles:4251 | snapshotPlayer:4275 | snapshotZone:4279 | snapshotRun:4288 | zoneShape:4310 | migrate:4328 | restore:4334

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2740 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:643 | guidedBat:658 | interactionLabel:664 | canTalk:676 | setHtml:682 | updateHud:688 | help:821 | landmarks:831 | map:841 | savePinForm:891 | itemIcon:902 | weaponCondition:907 | itemDescription:913 | matches:943 | inventoryItems:953 | nearbyItems:976 | updateInventoryLists:997 | bag:1039 | useBelt:1077 | updateBelt:1084 | beltPanel:1106 | gear:1120 | survivorFields:1175 | survivorProfile:1184 | showTraitPoints:1193 | updateSurvivorPreview:1201 | setSetupSurvivor:1209 | editSurvivor:1219 | crafting:1233 | health:1254 | dailySummary:1284 | diary:1297 | dispatchStatus:1328 | fieldLedger:1343 | ledgerEntry:1382 | ledgerReport:1388 | ledgerPanel:1397 | playtestReport:1433 | copyPlaytest:1477 | knownStory:1490 | storyText:1495 | outbreakLog:1499 | storyEntry:1508 | supplyRun:1517 | gardenStatus:1545 | gardenProject:1554 | waterProject:1574 | utilities:1595 | releases:1614 | research:1621 | npcPanel:1629 | gardenPanel:1646 | stationPanel:1670 | objectPanel:1720 | interact:1894 | interactions:1903 | nearbyAction:1920 | strike:1951 | quickUse:1959 | pause:1966 | visualAtmosphere:1976 | atmospherePanel:1980 | applyAtmosphere:1992 | exportSave:2005 | refreshPanel:2012 | bagChanged:2020 | changeInventory:2030 | bindTap:2381 | updateStick:2454 | shoveOrBrake:2482 | frame:2605
