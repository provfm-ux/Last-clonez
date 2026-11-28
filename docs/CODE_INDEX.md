# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (695 lines)
worldRules:226 | traitLoadout:513 | character:595

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

## game/sim.js (4763 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | idleIdea:729 | campaignTip:753 | pinnedGoal:798 | nearby:811 | containers:815 | readCinemaNote:834 | unreadClueAt:842 | nearbyClues:849 | readClue:854 | isSupplyCache:860 | nearbySupplyCache:865 | collectSupplyCache:871 | sources:883 | available:887 | consume:891 | collect:905 | collectAll:937 | drop:956 | stash:985 | use:995 | beltItem:1091 | setBelt:1099 | useBelt:1106 | activeLight:1115 | replaceBattery:1120 | toggleLight:1129 | recipeProblem:1147 | craft:1171 | place:1197 | vehicle:1240 | enterVehicle:1244 | exitVehicle:1265 | refuel:1293 | vehicleRepairProblem:1307 | repairVehicle:1315 | brake:1327 | updateVehicle:1334 | longHaulGoals:1415 | longHaulHint:1428 | updateLongHaul:1452 | destination:1477 | markDestination:1501 | markStation:1521 | restoreCampaign:1534 | placeCampaignPages:1562 | takeStatue:1582 | updateCinemaTrap:1622 | updatePineRidge:1640 | updateCinemaBuff:1671 | placeIronworks:1681 | dismantleCage:1706 | readTerminal:1731 | placeGrottoPlate:1740 | readGrottoPlate:1747 | placeFatHill:1760 | bossDamage:1794 | removeGuard:1830 | fathillFear:1839 | fathillFinale:1849 | playViolin:1860 | spotIn:1875 | placeAmigo1:1883 | roomSpots:1902 | placeOptional:1909 | updateOptional:1937 | updateTide:1949 | updateViolinCall:1967 | placeFortress:1999 | throwMolotov:2030 | updateFire:2048 | pipBurn:2058 | pipFinale:2065 | aiSend:2077 | useAiTerminal:2107 | seeEpilogue:2116 | vicFinale:2122 | readVicDiary:2131 | placeFieldsLedger:2145 | fieldsAlarm:2161 | readFieldsLedger:2169 | finishGrotto:2187 | placeEvaDiary:2197 | updateEva:2208 | readEvaDiary:2226 | readCampaignPage:2235 | campaignProblem:2263 | travelProblem:2272 | arrivalPosition:2284 | travel:2295 | exploredTile:2338 | saveMapPin:2343 | markPin:2362 | removePin:2370 | noise:2379 | hear:2397 | hearZombie:2405 | encounterSlots:2420 | newInfected:2426 | freeEncounterSpot:2432 | wakeNest:2438 | touchFungus:2457 | noticeCrib:2461 | inspectCrib:2471 | warnHorde:2477 | resumeEncounterWarning:2484 | waveSpots:2488 | updateHordes:2498 | waitWithWatch:2555 | armWatch:2578 | updateAtmosphere:2588 | listenAtDoor:2649 | sceneProblem:2669 | revealLedgerCache:2674 | resolveScene:2680 | dispatchProblem:2706 | sendDispatch:2715 | readDispatchReport:2722 | settleDispatch:2730 | openingOccupied:2762 | climbThrough:2777 | breachProblem:2795 | breach:2805 | door:2844 | barricade:2875 | unboard:2891 | removeBarrier:2902 | minutesToRain:2914 | sight:2943 | canSee:2950 | drainLight:2959 | useTap:2968 | useGenerator:2988 | updateUtilities:3008 | fireBatch:3041 | startFireBatch:3048 | collectFireBatch:3064 | mushroomProblem:3107 | harvestMushroom:3114 | updateFungalAlert:3129 | readFieldNote:3145 | wildProblem:3165 | useWild:3187 | sow:3222 | waterGarden:3232 | gardenYield:3240 | harvestGarden:3246 | growGarden:3264 | updateOutdoor:3276 | catchUpArea:3287 | evaAtShelter:3324 | toggleGardenHelp:3329 | tendShelterGarden:3338 | restOnSeat:3360 | dismantleFurniture:3371 | contextual:3381 | recruit:3438 | threats:3448 | damageFactor:3452 | aimChance:3459 | inAttackRange:3464 | closestInReach:3468 | attackTarget:3479 | touchAttackTarget:3485 | weaponProblem:3500 | endPursuit:3506 | endWindup:3512 | faceTowards:3517 | carriedSupply:3523 | defeat:3535 | attack:3552 | shove:3605 | hurt:3635 | move:3685 | follow:3722 | walkTo:3748 | target:3760 | approach:3767 | updatePlayer:3783 | canTargetEva:3866 | leaveTrack:3874 | nearbyTrack:3889 | inspectTrack:3902 | updateEnemies:3915 | updateNpc:4050 | explore:4073 | updateExposure:4084 | updateNeeds:4097 | tick:4135 | updateDoorLure:4196 | breakLeg:4223 | healFracture:4231 | updateSickness:4240 | freeSpot:4263 | unstick:4276 | startSleep:4293 | fastSleep:4303 | sleep:4329 | moodles:4336 | snapshotPlayer:4360 | snapshotZone:4364 | snapshotRun:4373 | zoneShape:4395 | migrate:4413 | restore:4419

## game/view.js (3081 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:730 | campfireSmoke:750 | prop:770 | roof:1341 | roofArt:1363 | roofCoversPlayer:1414 | marker:1422 | survivorPalette:1468 | actorFrame:1480 | drawHeldWeapon:1687 | weaponIcon:1716 | drawZombieSprite:1736 | pickPlainInfected:1798 | recolouredAtlas:1814 | characterFor:1843 | charImage:1859 | restPoseFor:1868 | drawPropSprite:1883 | drawRestPose:1894 | drawCharacter:1920 | microActor:1972 | equipmentPortrait:2031 | deathFall:2047 | actor:2053 | beamReach:2229 | flashlightBeam:2239 | warmBeamSprite:2259 | warmFlashlight:2282 | windowGlow:2308 | weatherEffects:2332 | drawDestination:2368 | chunkSignature:2395 | buildChunk:2403 | groundLayer:2431 | dimAround:2448 | afterlifePixels:2486 | afterlifePortrait:2513 | renderAfterlife:2525 | render:2673 | locate:2973 | mapFit:2993 | mapPoint:2998 | minimapLayer:3006 | minimap:3025

## game/game.js (2781 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | importSummary:475 | continueLabel:486 | resumeSaved:494 | aiChat:513 | show:523 | close:537 | menu:550 | titleScreen:560 | wakeSound:579 | cue:592 | syncSound:604 | objectives:613 | objectiveHtml:628 | skillsHtml:632 | conditions:644 | nearbyObjects:664 | guidedBat:679 | interactionLabel:685 | canTalk:697 | setHtml:703 | updateHud:709 | help:842 | landmarks:852 | map:862 | savePinForm:912 | itemIcon:923 | weaponCondition:928 | itemDescription:934 | matches:964 | inventoryItems:974 | nearbyItems:997 | updateInventoryLists:1018 | bag:1060 | useBelt:1098 | updateBelt:1105 | beltPanel:1127 | gear:1141 | survivorFields:1196 | survivorProfile:1205 | showTraitPoints:1214 | updateSurvivorPreview:1222 | setSetupSurvivor:1230 | editSurvivor:1240 | crafting:1254 | health:1275 | dailySummary:1305 | diary:1318 | dispatchStatus:1349 | fieldLedger:1364 | ledgerEntry:1403 | ledgerReport:1409 | ledgerPanel:1418 | playtestReport:1454 | copyPlaytest:1498 | knownStory:1511 | storyText:1516 | outbreakLog:1520 | storyEntry:1529 | supplyRun:1538 | gardenStatus:1566 | gardenProject:1575 | waterProject:1595 | utilities:1616 | releases:1635 | research:1642 | npcPanel:1650 | gardenPanel:1667 | stationPanel:1691 | objectPanel:1741 | interact:1918 | interactions:1927 | nearbyAction:1944 | strike:1981 | quickUse:1989 | pause:1996 | visualAtmosphere:2006 | atmospherePanel:2010 | applyAtmosphere:2022 | exportSave:2035 | refreshPanel:2042 | bagChanged:2050 | changeInventory:2060 | bindTap:2421 | updateStick:2494 | shoveOrBrake:2522 | frame:2645
