# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (460 lines)
worldRules:205 | character:365

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

## game/soundscape.js (253 lines)
makeBuffer:28 | decodeRecording:121 | preload:131 | bankFor:144 | zombieClip:157 | playZombie:168 | play:195 | output:214 | stop:240

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (45 lines)
track:20 | progress:25 | next:30 | restore:37

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (3941 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:529 | difficultyOptions:581 | setDifficulty:590 | dangerRating:609 | recordPlaytest:617 | createRecommended:621 | pinnedGoal:638 | nearby:647 | containers:651 | unreadClueAt:671 | nearbyClues:678 | readClue:683 | isSupplyCache:689 | nearbySupplyCache:694 | collectSupplyCache:700 | sources:712 | available:716 | consume:720 | collect:734 | collectAll:762 | drop:781 | stash:810 | use:820 | beltItem:907 | setBelt:915 | useBelt:922 | activeLight:931 | replaceBattery:936 | toggleLight:945 | recipeProblem:963 | craft:987 | place:1013 | vehicle:1056 | enterVehicle:1060 | exitVehicle:1081 | refuel:1109 | vehicleRepairProblem:1123 | repairVehicle:1131 | brake:1143 | updateVehicle:1150 | longHaulGoals:1231 | longHaulHint:1244 | updateLongHaul:1268 | destination:1293 | markDestination:1313 | markStation:1333 | restoreCampaign:1345 | placeCampaignPages:1359 | takeStatue:1379 | updateCinemaTrap:1408 | updatePineRidge:1422 | updateCinemaBuff:1453 | placeIronworks:1463 | dismantleCage:1488 | readTerminal:1513 | placeEvaDiary:1521 | updateEva:1532 | readEvaDiary:1550 | readCampaignPage:1559 | campaignProblem:1576 | travelProblem:1585 | arrivalPosition:1597 | travel:1608 | exploredTile:1650 | saveMapPin:1655 | markPin:1674 | removePin:1682 | noise:1690 | hear:1706 | hearZombie:1714 | encounterSlots:1729 | newInfected:1735 | freeEncounterSpot:1741 | wakeNest:1747 | touchFungus:1766 | noticeCrib:1770 | inspectCrib:1780 | warnHorde:1786 | resumeEncounterWarning:1793 | waveSpots:1797 | updateHordes:1807 | waitWithWatch:1864 | armWatch:1887 | updateAtmosphere:1897 | listenAtDoor:1958 | sceneProblem:1978 | revealLedgerCache:1983 | resolveScene:1989 | dispatchProblem:2015 | sendDispatch:2024 | readDispatchReport:2031 | settleDispatch:2039 | openingOccupied:2071 | breachProblem:2085 | breach:2095 | door:2134 | barricade:2165 | unboard:2181 | removeBarrier:2192 | minutesToRain:2204 | sight:2233 | canSee:2240 | drainLight:2249 | useTap:2258 | useGenerator:2278 | updateUtilities:2298 | fireBatch:2331 | startFireBatch:2338 | collectFireBatch:2354 | mushroomProblem:2397 | harvestMushroom:2404 | updateFungalAlert:2419 | readFieldNote:2435 | wildProblem:2455 | useWild:2477 | sow:2512 | waterGarden:2522 | gardenYield:2530 | harvestGarden:2536 | growGarden:2554 | updateOutdoor:2566 | catchUpArea:2577 | evaAtShelter:2614 | toggleGardenHelp:2619 | tendShelterGarden:2628 | dismantleFurniture:2650 | contextual:2660 | recruit:2716 | threats:2726 | damageFactor:2730 | aimChance:2737 | inAttackRange:2742 | closestInReach:2746 | attackTarget:2757 | touchAttackTarget:2763 | weaponProblem:2778 | endPursuit:2784 | endWindup:2790 | faceTowards:2795 | carriedSupply:2801 | defeat:2813 | attack:2826 | shove:2876 | hurt:2902 | move:2952 | follow:2989 | walkTo:3015 | target:3027 | approach:3034 | updatePlayer:3050 | canTargetEva:3133 | updateEnemies:3137 | updateNpc:3253 | explore:3276 | updateExposure:3286 | updateNeeds:3298 | tick:3336 | updateDoorLure:3395 | breakLeg:3422 | healFracture:3430 | updateSickness:3439 | freeSpot:3462 | unstick:3475 | startSleep:3492 | fastSleep:3502 | sleep:3517 | moodles:3524 | snapshotPlayer:3548 | snapshotZone:3552 | snapshotRun:3560 | zoneShape:3582 | migrate:3600 | restore:3606

## game/view.js (2818 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1323 | roofArt:1345 | roofCoversPlayer:1396 | marker:1404 | survivorPalette:1450 | actorFrame:1462 | drawHeldWeapon:1667 | weaponIcon:1696 | drawZombieSprite:1716 | microActor:1762 | equipmentPortrait:1815 | actor:1828 | beamReach:1988 | flashlightBeam:1998 | warmBeamSprite:2018 | warmFlashlight:2041 | windowGlow:2067 | weatherEffects:2091 | drawDestination:2127 | chunkSignature:2154 | buildChunk:2162 | groundLayer:2190 | dimAround:2207 | afterlifePixels:2245 | afterlifePortrait:2272 | renderAfterlife:2284 | render:2432 | locate:2710 | mapFit:2730 | mapPoint:2735 | minimapLayer:2743 | minimap:2762

## game/game.js (2632 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1805 | interactions:1814 | nearbyAction:1831 | strike:1861 | quickUse:1869 | pause:1876 | visualAtmosphere:1886 | atmospherePanel:1890 | applyAtmosphere:1900 | exportSave:1911 | refreshPanel:1918 | bagChanged:1926 | changeInventory:1936 | bindTap:2282 | updateStick:2355 | shoveOrBrake:2383 | frame:2505
