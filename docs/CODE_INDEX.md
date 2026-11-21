# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (385 lines)
worldRules:172 | traitLoadout:259 | character:301

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

## game/sim.js (3087 lines)
weapon:20 | unequipWeapon:27 | wornItem:36 | addXp:46 | add:69 | remove:82 | notify:92 | stockGardenSeeds:98 | prepareSupplies:110 | addUtilities:129 | stockFieldGear:147 | placeStartingBat:175 | stockSkillBooks:187 | create:199 | createControl:280 | difficultyOptions:332 | setDifficulty:341 | dangerRating:360 | recordPlaytest:368 | createRecommended:372 | pinnedGoal:389 | nearby:398 | containers:402 | unreadClueAt:418 | nearbyClues:425 | readClue:430 | isSupplyCache:436 | nearbySupplyCache:441 | collectSupplyCache:447 | sources:459 | available:463 | consume:467 | collect:481 | collectAll:504 | drop:523 | stash:552 | use:562 | beltItem:643 | setBelt:651 | useBelt:658 | activeLight:667 | replaceBattery:672 | toggleLight:681 | recipeProblem:698 | craft:714 | place:734 | vehicle:772 | enterVehicle:776 | exitVehicle:797 | refuel:825 | vehicleRepairProblem:839 | repairVehicle:847 | brake:857 | updateVehicle:864 | destination:943 | markDestination:956 | markStation:976 | travelProblem:983 | arrivalPosition:993 | travel:1004 | exploredTile:1040 | saveMapPin:1045 | markPin:1064 | removePin:1072 | noise:1080 | hear:1097 | hearZombie:1105 | encounterSlots:1120 | newInfected:1126 | freeEncounterSpot:1132 | wakeNest:1138 | touchFungus:1157 | noticeCrib:1161 | inspectCrib:1171 | warnHorde:1177 | resumeEncounterWarning:1184 | waveSpots:1188 | updateHordes:1198 | armWatch:1254 | updateAtmosphere:1264 | listenAtDoor:1325 | sceneProblem:1345 | revealLedgerCache:1350 | resolveScene:1356 | dispatchProblem:1382 | sendDispatch:1391 | readDispatchReport:1398 | settleDispatch:1406 | openingOccupied:1438 | breachProblem:1452 | breach:1461 | door:1491 | barricade:1518 | unboard:1534 | removeBarrier:1545 | minutesToRain:1556 | sight:1579 | canSee:1586 | drainLight:1595 | useTap:1604 | useGenerator:1624 | updateUtilities:1644 | fireBatch:1676 | startFireBatch:1683 | collectFireBatch:1698 | wildProblem:1732 | useWild:1752 | sow:1782 | waterGarden:1792 | gardenYield:1800 | harvestGarden:1806 | growGarden:1819 | updateOutdoor:1831 | catchUpArea:1842 | evaAtShelter:1862 | toggleGardenHelp:1867 | tendShelterGarden:1876 | contextual:1895 | recruit:1955 | threats:1965 | damageFactor:1969 | aimChance:1976 | inAttackRange:1981 | closestInReach:1985 | attackTarget:1996 | touchAttackTarget:2002 | weaponProblem:2017 | endPursuit:2023 | endWindup:2029 | faceTowards:2034 | defeat:2039 | attack:2049 | shove:2094 | hurt:2120 | move:2168 | follow:2205 | walkTo:2231 | target:2243 | approach:2250 | updatePlayer:2266 | canTargetEva:2341 | updateEnemies:2345 | updateNpc:2461 | explore:2484 | updateExposure:2494 | updateNeeds:2506 | tick:2541 | updateDoorLure:2592 | breakLeg:2619 | healFracture:2627 | updateSickness:2636 | freeSpot:2659 | unstick:2672 | startSleep:2689 | fastSleep:2699 | sleep:2714 | moodles:2721 | snapshotPlayer:2745 | snapshotZone:2749 | snapshotRun:2757 | zoneShape:2773 | migrate:2788 | restore:2794

## game/view.js (2335 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:192 | tendril:258 | tile:272 | glowSprite:290 | glow:307 | wall:317 | paintWall:344 | gardenTree:377 | paintFurniture:413 | drawFurniture:532 | prop:551 | roof:1046 | roofArt:1068 | roofCoversPlayer:1102 | marker:1110 | actorFrame:1135 | drawHeldWeapon:1232 | weaponIcon:1261 | drawZombieSprite:1280 | microActor:1311 | equipmentPortrait:1352 | actor:1365 | beamReach:1520 | flashlightBeam:1530 | warmBeamSprite:1550 | warmFlashlight:1573 | windowGlow:1599 | weatherEffects:1623 | drawDestination:1659 | chunkSignature:1686 | buildChunk:1694 | groundLayer:1722 | dimAround:1739 | afterlifePixels:1777 | afterlifePortrait:1804 | renderAfterlife:1816 | render:1964 | locate:2227 | mapFit:2247 | mapPoint:2252 | minimapLayer:2260 | minimap:2279

## game/game.js (2498 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:212 | updateLesson:225 | startAfterlife:249 | deathSummary:259 | skipAfterlife:270 | endAfterlife:276 | afterlifeAction:283 | setupProfile:287 | showTraitPoints:293 | start:301 | startRecommended:320 | showStartDetail:333 | savedAssists:351 | assistsOn:358 | difficultyPanel:363 | applyDifficulty:384 | rememberSetup:405 | worldRulesEditor:411 | applyWorldRules:429 | resumeSaved:445 | show:463 | close:477 | menu:490 | titleScreen:500 | wakeSound:518 | cue:531 | syncSound:543 | objectives:552 | objectiveHtml:562 | skillsHtml:566 | conditions:576 | nearbyObjects:591 | interactionLabel:605 | canTalk:616 | setHtml:622 | updateHud:628 | help:756 | landmarks:766 | map:776 | savePinForm:826 | itemIcon:837 | weaponCondition:842 | itemDescription:848 | matches:876 | inventoryItems:886 | nearbyItems:909 | updateInventoryLists:930 | bag:972 | useBelt:1005 | updateBelt:1012 | beltPanel:1034 | gear:1048 | editSurvivor:1105 | crafting:1114 | health:1135 | diary:1165 | dispatchStatus:1188 | fieldLedger:1203 | ledgerEntry:1242 | ledgerReport:1248 | ledgerPanel:1257 | playtestReport:1293 | copyPlaytest:1337 | knownStory:1350 | storyText:1355 | outbreakLog:1359 | storyEntry:1368 | supplyRun:1377 | gardenStatus:1405 | gardenProject:1414 | waterProject:1434 | utilities:1455 | releases:1474 | research:1481 | npcPanel:1489 | gardenPanel:1506 | stationPanel:1530 | objectPanel:1577 | interact:1688 | interactions:1697 | nearbyAction:1714 | strike:1743 | quickUse:1751 | pause:1758 | visualAtmosphere:1768 | atmospherePanel:1772 | applyAtmosphere:1782 | exportSave:1793 | refreshPanel:1800 | bagChanged:1808 | changeInventory:1818 | bindTap:2129 | updateStick:2202 | shoveOrBrake:2230 | frame:2352
