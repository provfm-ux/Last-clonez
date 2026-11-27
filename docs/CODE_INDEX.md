# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (542 lines)
worldRules:214 | traitLoadout:364 | character:446

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/expedition.js (197 lines)
record:147

## game/regions.js (600 lines)
cinemaOutcome:45 | addExits:51 | add:52 | connection:87 | oldExit:107 | expand:111 | createGrotto:158 | create:188 | zone:199 | paint:257 | road:261 | add:281 | loot:289 | building:294 | addWilds:579

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (335 lines)
available:229 | place:257 | fixture:259 | cache:272 | incidentProblem:291 | tideForecast:301 | ready:307 | restore:311

## game/world.js (188 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:47 | build:57 | clear:116 | drivable:123 | sees:127 | route:137

## game/atmosphere.js (148 lines)
place:55 | clearCell:58 | add:62 | nextWave:118 | create:122 | restore:128

## game/recordings.js (8 lines)
(no named functions)

## game/soundscape.js (281 lines)
setVolumes:11 | makeBuffer:38 | decodeRecording:148 | preload:158 | bankFor:171 | zombieClip:184 | playZombie:195 | play:222 | output:241 | stop:268

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (46 lines)
track:21 | progress:26 | next:31 | restore:38

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4131 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:548 | difficultyOptions:600 | setDifficulty:609 | dangerRating:628 | recordPlaytest:636 | createRecommended:640 | campaignGoals:658 | campaignGoal:671 | campaignTarget:676 | pinnedGoal:694 | nearby:707 | containers:711 | readCinemaNote:730 | unreadClueAt:738 | nearbyClues:745 | readClue:750 | isSupplyCache:756 | nearbySupplyCache:761 | collectSupplyCache:767 | sources:779 | available:783 | consume:787 | collect:801 | collectAll:829 | drop:848 | stash:877 | use:887 | beltItem:975 | setBelt:983 | useBelt:990 | activeLight:999 | replaceBattery:1004 | toggleLight:1013 | recipeProblem:1031 | craft:1055 | place:1081 | vehicle:1124 | enterVehicle:1128 | exitVehicle:1149 | refuel:1177 | vehicleRepairProblem:1191 | repairVehicle:1199 | brake:1211 | updateVehicle:1218 | longHaulGoals:1299 | longHaulHint:1312 | updateLongHaul:1336 | destination:1361 | markDestination:1385 | markStation:1405 | restoreCampaign:1418 | placeCampaignPages:1433 | takeStatue:1453 | updateCinemaTrap:1493 | updatePineRidge:1511 | updateCinemaBuff:1542 | placeIronworks:1552 | dismantleCage:1577 | readTerminal:1602 | placeGrottoPlate:1611 | readGrottoPlate:1618 | finishGrotto:1629 | placeEvaDiary:1639 | updateEva:1650 | readEvaDiary:1668 | readCampaignPage:1677 | campaignProblem:1694 | travelProblem:1703 | arrivalPosition:1715 | travel:1726 | exploredTile:1769 | saveMapPin:1774 | markPin:1793 | removePin:1801 | noise:1810 | hear:1827 | hearZombie:1835 | encounterSlots:1850 | newInfected:1856 | freeEncounterSpot:1862 | wakeNest:1868 | touchFungus:1887 | noticeCrib:1891 | inspectCrib:1901 | warnHorde:1907 | resumeEncounterWarning:1914 | waveSpots:1918 | updateHordes:1928 | waitWithWatch:1985 | armWatch:2008 | updateAtmosphere:2018 | listenAtDoor:2079 | sceneProblem:2099 | revealLedgerCache:2104 | resolveScene:2110 | dispatchProblem:2136 | sendDispatch:2145 | readDispatchReport:2152 | settleDispatch:2160 | openingOccupied:2192 | breachProblem:2206 | breach:2216 | door:2255 | barricade:2286 | unboard:2302 | removeBarrier:2313 | minutesToRain:2325 | sight:2354 | canSee:2361 | drainLight:2370 | useTap:2379 | useGenerator:2399 | updateUtilities:2419 | fireBatch:2452 | startFireBatch:2459 | collectFireBatch:2475 | mushroomProblem:2518 | harvestMushroom:2525 | updateFungalAlert:2540 | readFieldNote:2556 | wildProblem:2576 | useWild:2598 | sow:2633 | waterGarden:2643 | gardenYield:2651 | harvestGarden:2657 | growGarden:2675 | updateOutdoor:2687 | catchUpArea:2698 | evaAtShelter:2735 | toggleGardenHelp:2740 | tendShelterGarden:2749 | dismantleFurniture:2771 | contextual:2781 | recruit:2837 | threats:2847 | damageFactor:2851 | aimChance:2858 | inAttackRange:2863 | closestInReach:2867 | attackTarget:2878 | touchAttackTarget:2884 | weaponProblem:2899 | endPursuit:2905 | endWindup:2911 | faceTowards:2916 | carriedSupply:2922 | defeat:2934 | attack:2947 | shove:2997 | hurt:3023 | move:3073 | follow:3110 | walkTo:3136 | target:3148 | approach:3155 | updatePlayer:3171 | canTargetEva:3254 | leaveTrack:3262 | nearbyTrack:3277 | inspectTrack:3290 | updateEnemies:3303 | updateNpc:3432 | explore:3455 | updateExposure:3465 | updateNeeds:3477 | tick:3515 | updateDoorLure:3575 | breakLeg:3602 | healFracture:3610 | updateSickness:3619 | freeSpot:3642 | unstick:3655 | startSleep:3672 | fastSleep:3682 | sleep:3697 | moodles:3704 | snapshotPlayer:3728 | snapshotZone:3732 | snapshotRun:3741 | zoneShape:3763 | migrate:3781 | restore:3787

## game/view.js (2990 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1842 | drawCharacter:1848 | microActor:1899 | equipmentPortrait:1954 | deathFall:1970 | actor:1976 | beamReach:2151 | flashlightBeam:2161 | warmBeamSprite:2181 | warmFlashlight:2204 | windowGlow:2230 | weatherEffects:2254 | drawDestination:2290 | chunkSignature:2317 | buildChunk:2325 | groundLayer:2353 | dimAround:2370 | afterlifePixels:2408 | afterlifePortrait:2435 | renderAfterlife:2447 | render:2595 | locate:2882 | mapFit:2902 | mapPoint:2907 | minimapLayer:2915 | minimap:2934

## game/game.js (2701 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | show:492 | close:506 | menu:519 | titleScreen:529 | wakeSound:547 | cue:560 | syncSound:572 | objectives:581 | objectiveHtml:596 | skillsHtml:600 | conditions:612 | nearbyObjects:628 | guidedBat:642 | interactionLabel:648 | canTalk:660 | setHtml:666 | updateHud:672 | help:802 | landmarks:812 | map:822 | savePinForm:872 | itemIcon:883 | weaponCondition:888 | itemDescription:894 | matches:924 | inventoryItems:934 | nearbyItems:957 | updateInventoryLists:978 | bag:1020 | useBelt:1058 | updateBelt:1065 | beltPanel:1087 | gear:1101 | survivorFields:1156 | survivorProfile:1165 | showTraitPoints:1174 | updateSurvivorPreview:1182 | setSetupSurvivor:1190 | editSurvivor:1200 | crafting:1214 | health:1235 | dailySummary:1265 | diary:1278 | dispatchStatus:1309 | fieldLedger:1324 | ledgerEntry:1363 | ledgerReport:1369 | ledgerPanel:1378 | playtestReport:1414 | copyPlaytest:1458 | knownStory:1471 | storyText:1476 | outbreakLog:1480 | storyEntry:1489 | supplyRun:1498 | gardenStatus:1526 | gardenProject:1535 | waterProject:1555 | utilities:1576 | releases:1595 | research:1602 | npcPanel:1610 | gardenPanel:1627 | stationPanel:1651 | objectPanel:1701 | interact:1863 | interactions:1872 | nearbyAction:1889 | strike:1920 | quickUse:1928 | pause:1935 | visualAtmosphere:1945 | atmospherePanel:1949 | applyAtmosphere:1961 | exportSave:1974 | refreshPanel:1981 | bagChanged:1989 | changeInventory:1999 | bindTap:2346 | updateStick:2419 | shoveOrBrake:2447 | frame:2570
