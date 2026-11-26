# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (461 lines)
worldRules:205 | character:366

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

## game/soundscape.js (265 lines)
makeBuffer:29 | decodeRecording:132 | preload:142 | bankFor:155 | zombieClip:168 | playZombie:179 | play:206 | output:225 | stop:252

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (45 lines)
track:20 | progress:25 | next:30 | restore:37

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (3973 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:539 | difficultyOptions:591 | setDifficulty:600 | dangerRating:619 | recordPlaytest:627 | createRecommended:631 | pinnedGoal:648 | nearby:657 | containers:661 | readCinemaNote:680 | unreadClueAt:688 | nearbyClues:695 | readClue:700 | isSupplyCache:706 | nearbySupplyCache:711 | collectSupplyCache:717 | sources:729 | available:733 | consume:737 | collect:751 | collectAll:779 | drop:798 | stash:827 | use:837 | beltItem:924 | setBelt:932 | useBelt:939 | activeLight:948 | replaceBattery:953 | toggleLight:962 | recipeProblem:980 | craft:1004 | place:1030 | vehicle:1073 | enterVehicle:1077 | exitVehicle:1098 | refuel:1126 | vehicleRepairProblem:1140 | repairVehicle:1148 | brake:1160 | updateVehicle:1167 | longHaulGoals:1248 | longHaulHint:1261 | updateLongHaul:1285 | destination:1310 | markDestination:1330 | markStation:1350 | restoreCampaign:1362 | placeCampaignPages:1376 | takeStatue:1396 | updateCinemaTrap:1436 | updatePineRidge:1454 | updateCinemaBuff:1485 | placeIronworks:1495 | dismantleCage:1520 | readTerminal:1545 | placeEvaDiary:1553 | updateEva:1564 | readEvaDiary:1582 | readCampaignPage:1591 | campaignProblem:1608 | travelProblem:1617 | arrivalPosition:1629 | travel:1640 | exploredTile:1682 | saveMapPin:1687 | markPin:1706 | removePin:1714 | noise:1722 | hear:1738 | hearZombie:1746 | encounterSlots:1761 | newInfected:1767 | freeEncounterSpot:1773 | wakeNest:1779 | touchFungus:1798 | noticeCrib:1802 | inspectCrib:1812 | warnHorde:1818 | resumeEncounterWarning:1825 | waveSpots:1829 | updateHordes:1839 | waitWithWatch:1896 | armWatch:1919 | updateAtmosphere:1929 | listenAtDoor:1990 | sceneProblem:2010 | revealLedgerCache:2015 | resolveScene:2021 | dispatchProblem:2047 | sendDispatch:2056 | readDispatchReport:2063 | settleDispatch:2071 | openingOccupied:2103 | breachProblem:2117 | breach:2127 | door:2166 | barricade:2197 | unboard:2213 | removeBarrier:2224 | minutesToRain:2236 | sight:2265 | canSee:2272 | drainLight:2281 | useTap:2290 | useGenerator:2310 | updateUtilities:2330 | fireBatch:2363 | startFireBatch:2370 | collectFireBatch:2386 | mushroomProblem:2429 | harvestMushroom:2436 | updateFungalAlert:2451 | readFieldNote:2467 | wildProblem:2487 | useWild:2509 | sow:2544 | waterGarden:2554 | gardenYield:2562 | harvestGarden:2568 | growGarden:2586 | updateOutdoor:2598 | catchUpArea:2609 | evaAtShelter:2646 | toggleGardenHelp:2651 | tendShelterGarden:2660 | dismantleFurniture:2682 | contextual:2692 | recruit:2748 | threats:2758 | damageFactor:2762 | aimChance:2769 | inAttackRange:2774 | closestInReach:2778 | attackTarget:2789 | touchAttackTarget:2795 | weaponProblem:2810 | endPursuit:2816 | endWindup:2822 | faceTowards:2827 | carriedSupply:2833 | defeat:2845 | attack:2858 | shove:2908 | hurt:2934 | move:2984 | follow:3021 | walkTo:3047 | target:3059 | approach:3066 | updatePlayer:3082 | canTargetEva:3165 | updateEnemies:3169 | updateNpc:3285 | explore:3308 | updateExposure:3318 | updateNeeds:3330 | tick:3368 | updateDoorLure:3427 | breakLeg:3454 | healFracture:3462 | updateSickness:3471 | freeSpot:3494 | unstick:3507 | startSleep:3524 | fastSleep:3534 | sleep:3549 | moodles:3556 | snapshotPlayer:3580 | snapshotZone:3584 | snapshotRun:3592 | zoneShape:3614 | migrate:3632 | restore:3638

## game/view.js (2823 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1328 | roofArt:1350 | roofCoversPlayer:1401 | marker:1409 | survivorPalette:1455 | actorFrame:1467 | drawHeldWeapon:1672 | weaponIcon:1701 | drawZombieSprite:1721 | microActor:1767 | equipmentPortrait:1820 | actor:1833 | beamReach:1993 | flashlightBeam:2003 | warmBeamSprite:2023 | warmFlashlight:2046 | windowGlow:2072 | weatherEffects:2096 | drawDestination:2132 | chunkSignature:2159 | buildChunk:2167 | groundLayer:2195 | dimAround:2212 | afterlifePixels:2250 | afterlifePortrait:2277 | renderAfterlife:2289 | render:2437 | locate:2715 | mapFit:2735 | mapPoint:2740 | minimapLayer:2748 | minimap:2767

## game/game.js (2636 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1809 | interactions:1818 | nearbyAction:1835 | strike:1865 | quickUse:1873 | pause:1880 | visualAtmosphere:1890 | atmospherePanel:1894 | applyAtmosphere:1904 | exportSave:1915 | refreshPanel:1922 | bagChanged:1930 | changeInventory:1940 | bindTap:2286 | updateStick:2359 | shoveOrBrake:2387 | frame:2509
