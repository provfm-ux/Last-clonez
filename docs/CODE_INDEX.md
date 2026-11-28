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

## game/sim.js (4732 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:553 | difficultyOptions:605 | setDifficulty:614 | dangerRating:633 | recordPlaytest:641 | createRecommended:645 | campaignGoals:663 | campaignGoal:691 | campaignTarget:696 | idleIdea:729 | campaignTip:753 | pinnedGoal:798 | nearby:811 | containers:815 | readCinemaNote:834 | unreadClueAt:842 | nearbyClues:849 | readClue:854 | isSupplyCache:860 | nearbySupplyCache:865 | collectSupplyCache:871 | sources:883 | available:887 | consume:891 | collect:905 | collectAll:937 | drop:956 | stash:985 | use:995 | beltItem:1091 | setBelt:1099 | useBelt:1106 | activeLight:1115 | replaceBattery:1120 | toggleLight:1129 | recipeProblem:1147 | craft:1171 | place:1197 | vehicle:1240 | enterVehicle:1244 | exitVehicle:1265 | refuel:1293 | vehicleRepairProblem:1307 | repairVehicle:1315 | brake:1327 | updateVehicle:1334 | longHaulGoals:1415 | longHaulHint:1428 | updateLongHaul:1452 | destination:1477 | markDestination:1501 | markStation:1521 | restoreCampaign:1534 | placeCampaignPages:1562 | takeStatue:1582 | updateCinemaTrap:1622 | updatePineRidge:1640 | updateCinemaBuff:1671 | placeIronworks:1681 | dismantleCage:1706 | readTerminal:1731 | placeGrottoPlate:1740 | readGrottoPlate:1747 | placeFatHill:1760 | bossDamage:1794 | removeGuard:1830 | fathillFear:1839 | fathillFinale:1849 | playViolin:1860 | spotIn:1875 | placeAmigo1:1883 | roomSpots:1902 | placeOptional:1909 | updateOptional:1937 | updateTide:1949 | updateViolinCall:1967 | placeFortress:1999 | throwMolotov:2030 | updateFire:2048 | pipBurn:2058 | pipFinale:2065 | aiSend:2077 | useAiTerminal:2107 | seeEpilogue:2116 | vicFinale:2122 | readVicDiary:2131 | placeFieldsLedger:2145 | fieldsAlarm:2161 | readFieldsLedger:2169 | finishGrotto:2187 | placeEvaDiary:2197 | updateEva:2208 | readEvaDiary:2226 | readCampaignPage:2235 | campaignProblem:2252 | travelProblem:2261 | arrivalPosition:2273 | travel:2284 | exploredTile:2327 | saveMapPin:2332 | markPin:2351 | removePin:2359 | noise:2368 | hear:2386 | hearZombie:2394 | encounterSlots:2409 | newInfected:2415 | freeEncounterSpot:2421 | wakeNest:2427 | touchFungus:2446 | noticeCrib:2450 | inspectCrib:2460 | warnHorde:2466 | resumeEncounterWarning:2473 | waveSpots:2477 | updateHordes:2487 | waitWithWatch:2544 | armWatch:2567 | updateAtmosphere:2577 | listenAtDoor:2638 | sceneProblem:2658 | revealLedgerCache:2663 | resolveScene:2669 | dispatchProblem:2695 | sendDispatch:2704 | readDispatchReport:2711 | settleDispatch:2719 | openingOccupied:2751 | breachProblem:2765 | breach:2775 | door:2814 | barricade:2845 | unboard:2861 | removeBarrier:2872 | minutesToRain:2884 | sight:2913 | canSee:2920 | drainLight:2929 | useTap:2938 | useGenerator:2958 | updateUtilities:2978 | fireBatch:3011 | startFireBatch:3018 | collectFireBatch:3034 | mushroomProblem:3077 | harvestMushroom:3084 | updateFungalAlert:3099 | readFieldNote:3115 | wildProblem:3135 | useWild:3157 | sow:3192 | waterGarden:3202 | gardenYield:3210 | harvestGarden:3216 | growGarden:3234 | updateOutdoor:3246 | catchUpArea:3257 | evaAtShelter:3294 | toggleGardenHelp:3299 | tendShelterGarden:3308 | restOnSeat:3330 | dismantleFurniture:3341 | contextual:3351 | recruit:3408 | threats:3418 | damageFactor:3422 | aimChance:3429 | inAttackRange:3434 | closestInReach:3438 | attackTarget:3449 | touchAttackTarget:3455 | weaponProblem:3470 | endPursuit:3476 | endWindup:3482 | faceTowards:3487 | carriedSupply:3493 | defeat:3505 | attack:3522 | shove:3575 | hurt:3605 | move:3655 | follow:3692 | walkTo:3718 | target:3730 | approach:3737 | updatePlayer:3753 | canTargetEva:3836 | leaveTrack:3844 | nearbyTrack:3859 | inspectTrack:3872 | updateEnemies:3885 | updateNpc:4020 | explore:4043 | updateExposure:4054 | updateNeeds:4067 | tick:4105 | updateDoorLure:4166 | breakLeg:4193 | healFracture:4201 | updateSickness:4210 | freeSpot:4233 | unstick:4246 | startSleep:4263 | fastSleep:4273 | sleep:4298 | moodles:4305 | snapshotPlayer:4329 | snapshotZone:4333 | snapshotRun:4342 | zoneShape:4364 | migrate:4382 | restore:4388

## game/view.js (3017 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:730 | campfireSmoke:750 | prop:770 | roof:1340 | roofArt:1362 | roofCoversPlayer:1413 | marker:1421 | survivorPalette:1467 | actorFrame:1479 | drawHeldWeapon:1686 | weaponIcon:1715 | drawZombieSprite:1735 | pickPlainInfected:1797 | recolouredAtlas:1813 | characterFor:1842 | charImage:1858 | drawCharacter:1864 | microActor:1915 | equipmentPortrait:1970 | deathFall:1986 | actor:1992 | beamReach:2167 | flashlightBeam:2177 | warmBeamSprite:2197 | warmFlashlight:2220 | windowGlow:2246 | weatherEffects:2270 | drawDestination:2306 | chunkSignature:2333 | buildChunk:2341 | groundLayer:2369 | dimAround:2386 | afterlifePixels:2424 | afterlifePortrait:2451 | renderAfterlife:2463 | render:2611 | locate:2909 | mapFit:2929 | mapPoint:2934 | minimapLayer:2942 | minimap:2961

## game/game.js (2745 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:643 | guidedBat:658 | interactionLabel:664 | canTalk:676 | setHtml:682 | updateHud:688 | help:821 | landmarks:831 | map:841 | savePinForm:891 | itemIcon:902 | weaponCondition:907 | itemDescription:913 | matches:943 | inventoryItems:953 | nearbyItems:976 | updateInventoryLists:997 | bag:1039 | useBelt:1077 | updateBelt:1084 | beltPanel:1106 | gear:1120 | survivorFields:1175 | survivorProfile:1184 | showTraitPoints:1193 | updateSurvivorPreview:1201 | setSetupSurvivor:1209 | editSurvivor:1219 | crafting:1233 | health:1254 | dailySummary:1284 | diary:1297 | dispatchStatus:1328 | fieldLedger:1343 | ledgerEntry:1382 | ledgerReport:1388 | ledgerPanel:1397 | playtestReport:1433 | copyPlaytest:1477 | knownStory:1490 | storyText:1495 | outbreakLog:1499 | storyEntry:1508 | supplyRun:1517 | gardenStatus:1545 | gardenProject:1554 | waterProject:1574 | utilities:1595 | releases:1614 | research:1621 | npcPanel:1629 | gardenPanel:1646 | stationPanel:1670 | objectPanel:1720 | interact:1895 | interactions:1904 | nearbyAction:1921 | strike:1952 | quickUse:1960 | pause:1967 | visualAtmosphere:1977 | atmospherePanel:1981 | applyAtmosphere:1993 | exportSave:2006 | refreshPanel:2013 | bagChanged:2021 | changeInventory:2031 | bindTap:2386 | updateStick:2459 | shoveOrBrake:2487 | frame:2610
