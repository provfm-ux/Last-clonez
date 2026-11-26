# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (422 lines)
worldRules:199 | character:327

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

## game/sim.js (3720 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:525 | difficultyOptions:577 | setDifficulty:586 | dangerRating:605 | recordPlaytest:613 | createRecommended:617 | pinnedGoal:634 | nearby:643 | containers:647 | unreadClueAt:663 | nearbyClues:670 | readClue:675 | isSupplyCache:681 | nearbySupplyCache:686 | collectSupplyCache:692 | sources:704 | available:708 | consume:712 | collect:726 | collectAll:754 | drop:773 | stash:802 | use:812 | beltItem:899 | setBelt:907 | useBelt:914 | activeLight:923 | replaceBattery:928 | toggleLight:937 | recipeProblem:955 | craft:979 | place:1005 | vehicle:1048 | enterVehicle:1052 | exitVehicle:1073 | refuel:1101 | vehicleRepairProblem:1115 | repairVehicle:1123 | brake:1135 | updateVehicle:1142 | longHaulGoals:1223 | longHaulHint:1236 | updateLongHaul:1260 | destination:1285 | markDestination:1305 | markStation:1325 | restoreCampaign:1335 | placeCampaignPages:1342 | readCampaignPage:1361 | campaignProblem:1378 | travelProblem:1387 | arrivalPosition:1399 | travel:1410 | exploredTile:1452 | saveMapPin:1457 | markPin:1476 | removePin:1484 | noise:1492 | hear:1508 | hearZombie:1516 | encounterSlots:1531 | newInfected:1537 | freeEncounterSpot:1543 | wakeNest:1549 | touchFungus:1568 | noticeCrib:1572 | inspectCrib:1582 | warnHorde:1588 | resumeEncounterWarning:1595 | waveSpots:1599 | updateHordes:1609 | waitWithWatch:1666 | armWatch:1689 | updateAtmosphere:1699 | listenAtDoor:1760 | sceneProblem:1780 | revealLedgerCache:1785 | resolveScene:1791 | dispatchProblem:1817 | sendDispatch:1826 | readDispatchReport:1833 | settleDispatch:1841 | openingOccupied:1873 | breachProblem:1887 | breach:1896 | door:1926 | barricade:1953 | unboard:1969 | removeBarrier:1980 | minutesToRain:1992 | sight:2021 | canSee:2028 | drainLight:2037 | useTap:2046 | useGenerator:2066 | updateUtilities:2086 | fireBatch:2119 | startFireBatch:2126 | collectFireBatch:2142 | mushroomProblem:2185 | harvestMushroom:2192 | updateFungalAlert:2207 | readFieldNote:2223 | wildProblem:2243 | useWild:2265 | sow:2300 | waterGarden:2310 | gardenYield:2318 | harvestGarden:2324 | growGarden:2342 | updateOutdoor:2354 | catchUpArea:2365 | evaAtShelter:2402 | toggleGardenHelp:2407 | tendShelterGarden:2416 | dismantleFurniture:2438 | contextual:2448 | recruit:2504 | threats:2514 | damageFactor:2518 | aimChance:2525 | inAttackRange:2530 | closestInReach:2534 | attackTarget:2545 | touchAttackTarget:2551 | weaponProblem:2566 | endPursuit:2572 | endWindup:2578 | faceTowards:2583 | carriedSupply:2589 | defeat:2601 | attack:2614 | shove:2664 | hurt:2690 | move:2739 | follow:2776 | walkTo:2802 | target:2814 | approach:2821 | updatePlayer:2837 | canTargetEva:2920 | updateEnemies:2924 | updateNpc:3040 | explore:3063 | updateExposure:3073 | updateNeeds:3085 | tick:3120 | updateDoorLure:3178 | breakLeg:3205 | healFracture:3213 | updateSickness:3222 | freeSpot:3245 | unstick:3258 | startSleep:3275 | fastSleep:3285 | sleep:3300 | moodles:3307 | snapshotPlayer:3331 | snapshotZone:3335 | snapshotRun:3343 | zoneShape:3364 | migrate:3382 | restore:3388

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2615 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1788 | interactions:1797 | nearbyAction:1814 | strike:1844 | quickUse:1852 | pause:1859 | visualAtmosphere:1869 | atmospherePanel:1873 | applyAtmosphere:1883 | exportSave:1894 | refreshPanel:1901 | bagChanged:1909 | changeInventory:1919 | bindTap:2265 | updateStick:2338 | shoveOrBrake:2366 | frame:2488
