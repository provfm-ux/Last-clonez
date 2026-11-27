# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (547 lines)
worldRules:214 | traitLoadout:369 | character:451

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

## game/campaign-hints.js (47 lines)
track:22 | progress:27 | next:32 | restore:39

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4180 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:549 | difficultyOptions:601 | setDifficulty:610 | dangerRating:629 | recordPlaytest:637 | createRecommended:641 | campaignGoals:659 | campaignGoal:673 | campaignTarget:678 | pinnedGoal:697 | nearby:710 | containers:714 | readCinemaNote:733 | unreadClueAt:741 | nearbyClues:748 | readClue:753 | isSupplyCache:759 | nearbySupplyCache:764 | collectSupplyCache:770 | sources:782 | available:786 | consume:790 | collect:804 | collectAll:832 | drop:851 | stash:880 | use:890 | beltItem:978 | setBelt:986 | useBelt:993 | activeLight:1002 | replaceBattery:1007 | toggleLight:1016 | recipeProblem:1034 | craft:1058 | place:1084 | vehicle:1127 | enterVehicle:1131 | exitVehicle:1152 | refuel:1180 | vehicleRepairProblem:1194 | repairVehicle:1202 | brake:1214 | updateVehicle:1221 | longHaulGoals:1302 | longHaulHint:1315 | updateLongHaul:1339 | destination:1364 | markDestination:1388 | markStation:1408 | restoreCampaign:1421 | placeCampaignPages:1438 | takeStatue:1458 | updateCinemaTrap:1498 | updatePineRidge:1516 | updateCinemaBuff:1547 | placeIronworks:1557 | dismantleCage:1582 | readTerminal:1607 | placeGrottoPlate:1616 | readGrottoPlate:1623 | placeFieldsLedger:1635 | fieldsAlarm:1651 | readFieldsLedger:1659 | finishGrotto:1677 | placeEvaDiary:1687 | updateEva:1698 | readEvaDiary:1716 | readCampaignPage:1725 | campaignProblem:1742 | travelProblem:1751 | arrivalPosition:1763 | travel:1774 | exploredTile:1817 | saveMapPin:1822 | markPin:1841 | removePin:1849 | noise:1858 | hear:1876 | hearZombie:1884 | encounterSlots:1899 | newInfected:1905 | freeEncounterSpot:1911 | wakeNest:1917 | touchFungus:1936 | noticeCrib:1940 | inspectCrib:1950 | warnHorde:1956 | resumeEncounterWarning:1963 | waveSpots:1967 | updateHordes:1977 | waitWithWatch:2034 | armWatch:2057 | updateAtmosphere:2067 | listenAtDoor:2128 | sceneProblem:2148 | revealLedgerCache:2153 | resolveScene:2159 | dispatchProblem:2185 | sendDispatch:2194 | readDispatchReport:2201 | settleDispatch:2209 | openingOccupied:2241 | breachProblem:2255 | breach:2265 | door:2304 | barricade:2335 | unboard:2351 | removeBarrier:2362 | minutesToRain:2374 | sight:2403 | canSee:2410 | drainLight:2419 | useTap:2428 | useGenerator:2448 | updateUtilities:2468 | fireBatch:2501 | startFireBatch:2508 | collectFireBatch:2524 | mushroomProblem:2567 | harvestMushroom:2574 | updateFungalAlert:2589 | readFieldNote:2605 | wildProblem:2625 | useWild:2647 | sow:2682 | waterGarden:2692 | gardenYield:2700 | harvestGarden:2706 | growGarden:2724 | updateOutdoor:2736 | catchUpArea:2747 | evaAtShelter:2784 | toggleGardenHelp:2789 | tendShelterGarden:2798 | dismantleFurniture:2820 | contextual:2830 | recruit:2886 | threats:2896 | damageFactor:2900 | aimChance:2907 | inAttackRange:2912 | closestInReach:2916 | attackTarget:2927 | touchAttackTarget:2933 | weaponProblem:2948 | endPursuit:2954 | endWindup:2960 | faceTowards:2965 | carriedSupply:2971 | defeat:2983 | attack:2996 | shove:3046 | hurt:3072 | move:3122 | follow:3159 | walkTo:3185 | target:3197 | approach:3204 | updatePlayer:3220 | canTargetEva:3303 | leaveTrack:3311 | nearbyTrack:3326 | inspectTrack:3339 | updateEnemies:3352 | updateNpc:3481 | explore:3504 | updateExposure:3514 | updateNeeds:3526 | tick:3564 | updateDoorLure:3624 | breakLeg:3651 | healFracture:3659 | updateSickness:3668 | freeSpot:3691 | unstick:3704 | startSleep:3721 | fastSleep:3731 | sleep:3746 | moodles:3753 | snapshotPlayer:3777 | snapshotZone:3781 | snapshotRun:3790 | zoneShape:3812 | migrate:3830 | restore:3836

## game/view.js (2990 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1842 | drawCharacter:1848 | microActor:1899 | equipmentPortrait:1954 | deathFall:1970 | actor:1976 | beamReach:2151 | flashlightBeam:2161 | warmBeamSprite:2181 | warmFlashlight:2204 | windowGlow:2230 | weatherEffects:2254 | drawDestination:2290 | chunkSignature:2317 | buildChunk:2325 | groundLayer:2353 | dimAround:2370 | afterlifePixels:2408 | afterlifePortrait:2435 | renderAfterlife:2447 | render:2595 | locate:2882 | mapFit:2902 | mapPoint:2907 | minimapLayer:2915 | minimap:2934

## game/game.js (2705 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | show:492 | close:506 | menu:519 | titleScreen:529 | wakeSound:547 | cue:560 | syncSound:572 | objectives:581 | objectiveHtml:596 | skillsHtml:600 | conditions:612 | nearbyObjects:628 | guidedBat:642 | interactionLabel:648 | canTalk:660 | setHtml:666 | updateHud:672 | help:802 | landmarks:812 | map:822 | savePinForm:872 | itemIcon:883 | weaponCondition:888 | itemDescription:894 | matches:924 | inventoryItems:934 | nearbyItems:957 | updateInventoryLists:978 | bag:1020 | useBelt:1058 | updateBelt:1065 | beltPanel:1087 | gear:1101 | survivorFields:1156 | survivorProfile:1165 | showTraitPoints:1174 | updateSurvivorPreview:1182 | setSetupSurvivor:1190 | editSurvivor:1200 | crafting:1214 | health:1235 | dailySummary:1265 | diary:1278 | dispatchStatus:1309 | fieldLedger:1324 | ledgerEntry:1363 | ledgerReport:1369 | ledgerPanel:1378 | playtestReport:1414 | copyPlaytest:1458 | knownStory:1471 | storyText:1476 | outbreakLog:1480 | storyEntry:1489 | supplyRun:1498 | gardenStatus:1526 | gardenProject:1535 | waterProject:1555 | utilities:1576 | releases:1595 | research:1602 | npcPanel:1610 | gardenPanel:1627 | stationPanel:1651 | objectPanel:1701 | interact:1867 | interactions:1876 | nearbyAction:1893 | strike:1924 | quickUse:1932 | pause:1939 | visualAtmosphere:1949 | atmospherePanel:1953 | applyAtmosphere:1965 | exportSave:1978 | refreshPanel:1985 | bagChanged:1993 | changeInventory:2003 | bindTap:2350 | updateStick:2423 | shoveOrBrake:2451 | frame:2574
