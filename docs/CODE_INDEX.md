# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (696 lines)
worldRules:226 | traitLoadout:514 | character:596

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

## game/sim.js (4769 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:556 | difficultyOptions:608 | setDifficulty:617 | dangerRating:636 | recordPlaytest:644 | createRecommended:648 | campaignGoals:666 | campaignGoal:694 | campaignTarget:699 | idleIdea:732 | campaignTip:756 | pinnedGoal:801 | nearby:814 | containers:818 | readCinemaNote:837 | unreadClueAt:845 | nearbyClues:852 | readClue:857 | isSupplyCache:863 | nearbySupplyCache:868 | collectSupplyCache:874 | sources:886 | available:890 | consume:894 | collect:908 | collectAll:940 | drop:959 | stash:988 | use:998 | beltItem:1094 | setBelt:1102 | useBelt:1109 | activeLight:1118 | replaceBattery:1123 | toggleLight:1132 | recipeProblem:1150 | craft:1174 | place:1200 | vehicle:1243 | enterVehicle:1247 | exitVehicle:1268 | refuel:1296 | vehicleRepairProblem:1310 | repairVehicle:1318 | brake:1330 | updateVehicle:1337 | longHaulGoals:1418 | longHaulHint:1431 | updateLongHaul:1455 | destination:1480 | markDestination:1504 | markStation:1524 | restoreCampaign:1537 | placeCampaignPages:1565 | takeStatue:1585 | updateCinemaTrap:1625 | updatePineRidge:1643 | updateCinemaBuff:1674 | placeIronworks:1684 | dismantleCage:1709 | readTerminal:1734 | placeGrottoPlate:1743 | readGrottoPlate:1750 | placeFatHill:1763 | bossDamage:1797 | removeGuard:1833 | fathillFear:1842 | fathillFinale:1852 | playViolin:1863 | spotIn:1878 | placeAmigo1:1886 | roomSpots:1905 | placeOptional:1912 | updateOptional:1940 | updateTide:1955 | updateViolinCall:1973 | placeFortress:2005 | throwMolotov:2036 | updateFire:2054 | pipBurn:2064 | pipFinale:2071 | aiSend:2083 | useAiTerminal:2113 | seeEpilogue:2122 | vicFinale:2128 | readVicDiary:2137 | placeFieldsLedger:2151 | fieldsAlarm:2167 | readFieldsLedger:2175 | finishGrotto:2193 | placeEvaDiary:2203 | updateEva:2214 | readEvaDiary:2232 | readCampaignPage:2241 | campaignProblem:2269 | travelProblem:2278 | arrivalPosition:2290 | travel:2301 | exploredTile:2344 | saveMapPin:2349 | markPin:2368 | removePin:2376 | noise:2385 | hear:2403 | hearZombie:2411 | encounterSlots:2426 | newInfected:2432 | freeEncounterSpot:2438 | wakeNest:2444 | touchFungus:2463 | noticeCrib:2467 | inspectCrib:2477 | warnHorde:2483 | resumeEncounterWarning:2490 | waveSpots:2494 | updateHordes:2504 | waitWithWatch:2561 | armWatch:2584 | updateAtmosphere:2594 | listenAtDoor:2655 | sceneProblem:2675 | revealLedgerCache:2680 | resolveScene:2686 | dispatchProblem:2712 | sendDispatch:2721 | readDispatchReport:2728 | settleDispatch:2736 | openingOccupied:2768 | climbThrough:2783 | breachProblem:2801 | breach:2811 | door:2850 | barricade:2881 | unboard:2897 | removeBarrier:2908 | minutesToRain:2920 | sight:2949 | canSee:2956 | drainLight:2965 | useTap:2974 | useGenerator:2994 | updateUtilities:3014 | fireBatch:3047 | startFireBatch:3054 | collectFireBatch:3070 | mushroomProblem:3113 | harvestMushroom:3120 | updateFungalAlert:3135 | readFieldNote:3151 | wildProblem:3171 | useWild:3193 | sow:3228 | waterGarden:3238 | gardenYield:3246 | harvestGarden:3252 | growGarden:3270 | updateOutdoor:3282 | catchUpArea:3293 | evaAtShelter:3330 | toggleGardenHelp:3335 | tendShelterGarden:3344 | restOnSeat:3366 | dismantleFurniture:3377 | contextual:3387 | recruit:3444 | threats:3454 | damageFactor:3458 | aimChance:3465 | inAttackRange:3470 | closestInReach:3474 | attackTarget:3485 | touchAttackTarget:3491 | weaponProblem:3506 | endPursuit:3512 | endWindup:3518 | faceTowards:3523 | carriedSupply:3529 | defeat:3541 | attack:3558 | shove:3611 | hurt:3641 | move:3691 | follow:3728 | walkTo:3754 | target:3766 | approach:3773 | updatePlayer:3789 | canTargetEva:3872 | leaveTrack:3880 | nearbyTrack:3895 | inspectTrack:3908 | updateEnemies:3921 | updateNpc:4056 | explore:4079 | updateExposure:4090 | updateNeeds:4103 | tick:4141 | updateDoorLure:4202 | breakLeg:4229 | healFracture:4237 | updateSickness:4246 | freeSpot:4269 | unstick:4282 | startSleep:4299 | fastSleep:4309 | sleep:4335 | moodles:4342 | snapshotPlayer:4366 | snapshotZone:4370 | snapshotRun:4379 | zoneShape:4401 | migrate:4419 | restore:4425

## game/view.js (3081 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:730 | campfireSmoke:750 | prop:770 | roof:1341 | roofArt:1363 | roofCoversPlayer:1414 | marker:1422 | survivorPalette:1468 | actorFrame:1480 | drawHeldWeapon:1687 | weaponIcon:1716 | drawZombieSprite:1736 | pickPlainInfected:1798 | recolouredAtlas:1814 | characterFor:1843 | charImage:1859 | restPoseFor:1868 | drawPropSprite:1883 | drawRestPose:1894 | drawCharacter:1920 | microActor:1972 | equipmentPortrait:2031 | deathFall:2047 | actor:2053 | beamReach:2229 | flashlightBeam:2239 | warmBeamSprite:2259 | warmFlashlight:2282 | windowGlow:2308 | weatherEffects:2332 | drawDestination:2368 | chunkSignature:2395 | buildChunk:2403 | groundLayer:2431 | dimAround:2448 | afterlifePixels:2486 | afterlifePortrait:2513 | renderAfterlife:2525 | render:2673 | locate:2973 | mapFit:2993 | mapPoint:2998 | minimapLayer:3006 | minimap:3025

## game/game.js (2781 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | importSummary:475 | continueLabel:486 | resumeSaved:494 | aiChat:513 | show:523 | close:537 | menu:550 | titleScreen:560 | wakeSound:579 | cue:592 | syncSound:604 | objectives:613 | objectiveHtml:628 | skillsHtml:632 | conditions:644 | nearbyObjects:664 | guidedBat:679 | interactionLabel:685 | canTalk:697 | setHtml:703 | updateHud:709 | help:842 | landmarks:852 | map:862 | savePinForm:912 | itemIcon:923 | weaponCondition:928 | itemDescription:934 | matches:964 | inventoryItems:974 | nearbyItems:997 | updateInventoryLists:1018 | bag:1060 | useBelt:1098 | updateBelt:1105 | beltPanel:1127 | gear:1141 | survivorFields:1196 | survivorProfile:1205 | showTraitPoints:1214 | updateSurvivorPreview:1222 | setSetupSurvivor:1230 | editSurvivor:1240 | crafting:1254 | health:1275 | dailySummary:1305 | diary:1318 | dispatchStatus:1349 | fieldLedger:1364 | ledgerEntry:1403 | ledgerReport:1409 | ledgerPanel:1418 | playtestReport:1454 | copyPlaytest:1498 | knownStory:1511 | storyText:1516 | outbreakLog:1520 | storyEntry:1529 | supplyRun:1538 | gardenStatus:1566 | gardenProject:1575 | waterProject:1595 | utilities:1616 | releases:1635 | research:1642 | npcPanel:1650 | gardenPanel:1667 | stationPanel:1691 | objectPanel:1741 | interact:1918 | interactions:1927 | nearbyAction:1944 | strike:1981 | quickUse:1989 | pause:1996 | visualAtmosphere:2006 | atmospherePanel:2010 | applyAtmosphere:2022 | exportSave:2035 | refreshPanel:2042 | bagChanged:2050 | changeInventory:2060 | bindTap:2421 | updateStick:2494 | shoveOrBrake:2522 | frame:2645
