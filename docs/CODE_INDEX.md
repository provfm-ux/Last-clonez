# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (439 lines)
worldRules:201 | character:344

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

## game/campaign.js (72 lines)
closedReason:47 | missing:61

## game/sim.js (3831 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:527 | difficultyOptions:579 | setDifficulty:588 | dangerRating:607 | recordPlaytest:615 | createRecommended:619 | pinnedGoal:636 | nearby:645 | containers:649 | unreadClueAt:665 | nearbyClues:672 | readClue:677 | isSupplyCache:683 | nearbySupplyCache:688 | collectSupplyCache:694 | sources:706 | available:710 | consume:714 | collect:728 | collectAll:756 | drop:775 | stash:804 | use:814 | beltItem:901 | setBelt:909 | useBelt:916 | activeLight:925 | replaceBattery:930 | toggleLight:939 | recipeProblem:957 | craft:981 | place:1007 | vehicle:1050 | enterVehicle:1054 | exitVehicle:1075 | refuel:1103 | vehicleRepairProblem:1117 | repairVehicle:1125 | brake:1137 | updateVehicle:1144 | longHaulGoals:1225 | longHaulHint:1238 | updateLongHaul:1262 | destination:1287 | markDestination:1307 | markStation:1327 | restoreCampaign:1339 | placeCampaignPages:1352 | takeStatue:1372 | updateCinemaTrap:1400 | updatePineRidge:1414 | updateCinemaBuff:1445 | readCampaignPage:1451 | campaignProblem:1468 | travelProblem:1477 | arrivalPosition:1489 | travel:1500 | exploredTile:1542 | saveMapPin:1547 | markPin:1566 | removePin:1574 | noise:1582 | hear:1598 | hearZombie:1606 | encounterSlots:1621 | newInfected:1627 | freeEncounterSpot:1633 | wakeNest:1639 | touchFungus:1658 | noticeCrib:1662 | inspectCrib:1672 | warnHorde:1678 | resumeEncounterWarning:1685 | waveSpots:1689 | updateHordes:1699 | waitWithWatch:1756 | armWatch:1779 | updateAtmosphere:1789 | listenAtDoor:1850 | sceneProblem:1870 | revealLedgerCache:1875 | resolveScene:1881 | dispatchProblem:1907 | sendDispatch:1916 | readDispatchReport:1923 | settleDispatch:1931 | openingOccupied:1963 | breachProblem:1977 | breach:1987 | door:2025 | barricade:2056 | unboard:2072 | removeBarrier:2083 | minutesToRain:2095 | sight:2124 | canSee:2131 | drainLight:2140 | useTap:2149 | useGenerator:2169 | updateUtilities:2189 | fireBatch:2222 | startFireBatch:2229 | collectFireBatch:2245 | mushroomProblem:2288 | harvestMushroom:2295 | updateFungalAlert:2310 | readFieldNote:2326 | wildProblem:2346 | useWild:2368 | sow:2403 | waterGarden:2413 | gardenYield:2421 | harvestGarden:2427 | growGarden:2445 | updateOutdoor:2457 | catchUpArea:2468 | evaAtShelter:2505 | toggleGardenHelp:2510 | tendShelterGarden:2519 | dismantleFurniture:2541 | contextual:2551 | recruit:2607 | threats:2617 | damageFactor:2621 | aimChance:2628 | inAttackRange:2633 | closestInReach:2637 | attackTarget:2648 | touchAttackTarget:2654 | weaponProblem:2669 | endPursuit:2675 | endWindup:2681 | faceTowards:2686 | carriedSupply:2692 | defeat:2704 | attack:2717 | shove:2767 | hurt:2793 | move:2843 | follow:2880 | walkTo:2906 | target:2918 | approach:2925 | updatePlayer:2941 | canTargetEva:3024 | updateEnemies:3028 | updateNpc:3144 | explore:3167 | updateExposure:3177 | updateNeeds:3189 | tick:3227 | updateDoorLure:3286 | breakLeg:3313 | healFracture:3321 | updateSickness:3330 | freeSpot:3353 | unstick:3366 | startSleep:3383 | fastSleep:3393 | sleep:3408 | moodles:3415 | snapshotPlayer:3439 | snapshotZone:3443 | snapshotRun:3451 | zoneShape:3473 | migrate:3491 | restore:3497

## game/view.js (2805 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1314 | roofArt:1336 | roofCoversPlayer:1387 | marker:1395 | survivorPalette:1441 | actorFrame:1453 | drawHeldWeapon:1657 | weaponIcon:1686 | drawZombieSprite:1706 | microActor:1752 | equipmentPortrait:1805 | actor:1818 | beamReach:1978 | flashlightBeam:1988 | warmBeamSprite:2008 | warmFlashlight:2031 | windowGlow:2057 | weatherEffects:2081 | drawDestination:2117 | chunkSignature:2144 | buildChunk:2152 | groundLayer:2180 | dimAround:2197 | afterlifePixels:2235 | afterlifePortrait:2262 | renderAfterlife:2274 | render:2422 | locate:2697 | mapFit:2717 | mapPoint:2722 | minimapLayer:2730 | minimap:2749

## game/game.js (2620 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1793 | interactions:1802 | nearbyAction:1819 | strike:1849 | quickUse:1857 | pause:1864 | visualAtmosphere:1874 | atmospherePanel:1878 | applyAtmosphere:1888 | exportSave:1899 | refreshPanel:1906 | bagChanged:1914 | changeInventory:1924 | bindTap:2270 | updateStick:2343 | shoveOrBrake:2371 | frame:2493
