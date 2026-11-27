# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (648 lines)
worldRules:221 | traitLoadout:466 | character:548

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

## game/sim.js (4594 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | campaignTip:729 | pinnedGoal:770 | nearby:783 | containers:787 | readCinemaNote:806 | unreadClueAt:814 | nearbyClues:821 | readClue:826 | isSupplyCache:832 | nearbySupplyCache:837 | collectSupplyCache:843 | sources:855 | available:859 | consume:863 | collect:877 | collectAll:906 | drop:925 | stash:954 | use:964 | beltItem:1054 | setBelt:1062 | useBelt:1069 | activeLight:1078 | replaceBattery:1083 | toggleLight:1092 | recipeProblem:1110 | craft:1134 | place:1160 | vehicle:1203 | enterVehicle:1207 | exitVehicle:1228 | refuel:1256 | vehicleRepairProblem:1270 | repairVehicle:1278 | brake:1290 | updateVehicle:1297 | longHaulGoals:1378 | longHaulHint:1391 | updateLongHaul:1415 | destination:1440 | markDestination:1464 | markStation:1484 | restoreCampaign:1497 | placeCampaignPages:1521 | takeStatue:1541 | updateCinemaTrap:1581 | updatePineRidge:1599 | updateCinemaBuff:1630 | placeIronworks:1640 | dismantleCage:1665 | readTerminal:1690 | placeGrottoPlate:1699 | readGrottoPlate:1706 | placeFatHill:1719 | bossDamage:1753 | removeGuard:1778 | fathillFear:1787 | fathillFinale:1797 | playViolin:1808 | spotIn:1823 | placeAmigo1:1831 | roomSpots:1850 | placeOptional:1857 | updateOptional:1880 | placeFortress:1896 | throwMolotov:1927 | updateFire:1945 | pipBurn:1955 | pipFinale:1962 | aiSend:1973 | useAiTerminal:2001 | vicFinale:2007 | readVicDiary:2017 | placeFieldsLedger:2031 | fieldsAlarm:2047 | readFieldsLedger:2055 | finishGrotto:2073 | placeEvaDiary:2083 | updateEva:2094 | readEvaDiary:2112 | readCampaignPage:2121 | campaignProblem:2138 | travelProblem:2147 | arrivalPosition:2159 | travel:2170 | exploredTile:2213 | saveMapPin:2218 | markPin:2237 | removePin:2245 | noise:2254 | hear:2272 | hearZombie:2280 | encounterSlots:2295 | newInfected:2301 | freeEncounterSpot:2307 | wakeNest:2313 | touchFungus:2332 | noticeCrib:2336 | inspectCrib:2346 | warnHorde:2352 | resumeEncounterWarning:2359 | waveSpots:2363 | updateHordes:2373 | waitWithWatch:2430 | armWatch:2453 | updateAtmosphere:2463 | listenAtDoor:2524 | sceneProblem:2544 | revealLedgerCache:2549 | resolveScene:2555 | dispatchProblem:2581 | sendDispatch:2590 | readDispatchReport:2597 | settleDispatch:2605 | openingOccupied:2637 | breachProblem:2651 | breach:2661 | door:2700 | barricade:2731 | unboard:2747 | removeBarrier:2758 | minutesToRain:2770 | sight:2799 | canSee:2806 | drainLight:2815 | useTap:2824 | useGenerator:2844 | updateUtilities:2864 | fireBatch:2897 | startFireBatch:2904 | collectFireBatch:2920 | mushroomProblem:2963 | harvestMushroom:2970 | updateFungalAlert:2985 | readFieldNote:3001 | wildProblem:3021 | useWild:3043 | sow:3078 | waterGarden:3088 | gardenYield:3096 | harvestGarden:3102 | growGarden:3120 | updateOutdoor:3132 | catchUpArea:3143 | evaAtShelter:3180 | toggleGardenHelp:3185 | tendShelterGarden:3194 | dismantleFurniture:3216 | contextual:3226 | recruit:3282 | threats:3292 | damageFactor:3296 | aimChance:3303 | inAttackRange:3308 | closestInReach:3312 | attackTarget:3323 | touchAttackTarget:3329 | weaponProblem:3344 | endPursuit:3350 | endWindup:3356 | faceTowards:3361 | carriedSupply:3367 | defeat:3379 | attack:3396 | shove:3449 | hurt:3479 | move:3529 | follow:3566 | walkTo:3592 | target:3604 | approach:3611 | updatePlayer:3627 | canTargetEva:3710 | leaveTrack:3718 | nearbyTrack:3733 | inspectTrack:3746 | updateEnemies:3759 | updateNpc:3894 | explore:3917 | updateExposure:3927 | updateNeeds:3939 | tick:3977 | updateDoorLure:4038 | breakLeg:4065 | healFracture:4073 | updateSickness:4082 | freeSpot:4105 | unstick:4118 | startSleep:4135 | fastSleep:4145 | sleep:4160 | moodles:4167 | snapshotPlayer:4191 | snapshotZone:4195 | snapshotRun:4204 | zoneShape:4226 | migrate:4244 | restore:4250

## game/view.js (3007 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1676 | weaponIcon:1705 | drawZombieSprite:1725 | pickPlainInfected:1787 | recolouredAtlas:1803 | characterFor:1832 | charImage:1848 | drawCharacter:1854 | microActor:1905 | equipmentPortrait:1960 | deathFall:1976 | actor:1982 | beamReach:2157 | flashlightBeam:2167 | warmBeamSprite:2187 | warmFlashlight:2210 | windowGlow:2236 | weatherEffects:2260 | drawDestination:2296 | chunkSignature:2323 | buildChunk:2331 | groundLayer:2359 | dimAround:2376 | afterlifePixels:2414 | afterlifePortrait:2441 | renderAfterlife:2453 | render:2601 | locate:2899 | mapFit:2919 | mapPoint:2924 | minimapLayer:2932 | minimap:2951

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
