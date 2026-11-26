# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (431 lines)
worldRules:201 | character:336

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

## game/sim.js (3791 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:527 | difficultyOptions:579 | setDifficulty:588 | dangerRating:607 | recordPlaytest:615 | createRecommended:619 | pinnedGoal:636 | nearby:645 | containers:649 | unreadClueAt:665 | nearbyClues:672 | readClue:677 | isSupplyCache:683 | nearbySupplyCache:688 | collectSupplyCache:694 | sources:706 | available:710 | consume:714 | collect:728 | collectAll:756 | drop:775 | stash:804 | use:814 | beltItem:901 | setBelt:909 | useBelt:916 | activeLight:925 | replaceBattery:930 | toggleLight:939 | recipeProblem:957 | craft:981 | place:1007 | vehicle:1050 | enterVehicle:1054 | exitVehicle:1075 | refuel:1103 | vehicleRepairProblem:1117 | repairVehicle:1125 | brake:1137 | updateVehicle:1144 | longHaulGoals:1225 | longHaulHint:1238 | updateLongHaul:1262 | destination:1287 | markDestination:1307 | markStation:1327 | restoreCampaign:1339 | placeCampaignPages:1347 | takeStatue:1367 | updateCinemaTrap:1396 | updateCinemaBuff:1408 | readCampaignPage:1414 | campaignProblem:1431 | travelProblem:1440 | arrivalPosition:1452 | travel:1463 | exploredTile:1505 | saveMapPin:1510 | markPin:1529 | removePin:1537 | noise:1545 | hear:1561 | hearZombie:1569 | encounterSlots:1584 | newInfected:1590 | freeEncounterSpot:1596 | wakeNest:1602 | touchFungus:1621 | noticeCrib:1625 | inspectCrib:1635 | warnHorde:1641 | resumeEncounterWarning:1648 | waveSpots:1652 | updateHordes:1662 | waitWithWatch:1719 | armWatch:1742 | updateAtmosphere:1752 | listenAtDoor:1813 | sceneProblem:1833 | revealLedgerCache:1838 | resolveScene:1844 | dispatchProblem:1870 | sendDispatch:1879 | readDispatchReport:1886 | settleDispatch:1894 | openingOccupied:1926 | breachProblem:1940 | breach:1950 | door:1989 | barricade:2020 | unboard:2036 | removeBarrier:2047 | minutesToRain:2059 | sight:2088 | canSee:2095 | drainLight:2104 | useTap:2113 | useGenerator:2133 | updateUtilities:2153 | fireBatch:2186 | startFireBatch:2193 | collectFireBatch:2209 | mushroomProblem:2252 | harvestMushroom:2259 | updateFungalAlert:2274 | readFieldNote:2290 | wildProblem:2310 | useWild:2332 | sow:2367 | waterGarden:2377 | gardenYield:2385 | harvestGarden:2391 | growGarden:2409 | updateOutdoor:2421 | catchUpArea:2432 | evaAtShelter:2469 | toggleGardenHelp:2474 | tendShelterGarden:2483 | dismantleFurniture:2505 | contextual:2515 | recruit:2571 | threats:2581 | damageFactor:2585 | aimChance:2592 | inAttackRange:2597 | closestInReach:2601 | attackTarget:2612 | touchAttackTarget:2618 | weaponProblem:2633 | endPursuit:2639 | endWindup:2645 | faceTowards:2650 | carriedSupply:2656 | defeat:2668 | attack:2681 | shove:2731 | hurt:2757 | move:2807 | follow:2844 | walkTo:2870 | target:2882 | approach:2889 | updatePlayer:2905 | canTargetEva:2988 | updateEnemies:2992 | updateNpc:3108 | explore:3131 | updateExposure:3141 | updateNeeds:3153 | tick:3188 | updateDoorLure:3247 | breakLeg:3274 | healFracture:3282 | updateSickness:3291 | freeSpot:3314 | unstick:3327 | startSleep:3344 | fastSleep:3354 | sleep:3369 | moodles:3376 | snapshotPlayer:3400 | snapshotZone:3404 | snapshotRun:3412 | zoneShape:3433 | migrate:3451 | restore:3457

## game/view.js (2806 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1312 | roofArt:1334 | roofCoversPlayer:1385 | marker:1393 | survivorPalette:1439 | actorFrame:1451 | drawHeldWeapon:1655 | weaponIcon:1684 | drawZombieSprite:1704 | microActor:1750 | equipmentPortrait:1803 | actor:1816 | beamReach:1976 | flashlightBeam:1986 | warmBeamSprite:2006 | warmFlashlight:2029 | windowGlow:2055 | weatherEffects:2079 | drawDestination:2115 | chunkSignature:2142 | buildChunk:2150 | groundLayer:2178 | dimAround:2195 | afterlifePixels:2233 | afterlifePortrait:2260 | renderAfterlife:2272 | render:2420 | locate:2698 | mapFit:2718 | mapPoint:2723 | minimapLayer:2731 | minimap:2750

## game/game.js (2620 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:593 | guidedBat:607 | interactionLabel:613 | canTalk:625 | setHtml:631 | updateHud:637 | help:766 | landmarks:776 | map:786 | savePinForm:836 | itemIcon:847 | weaponCondition:852 | itemDescription:858 | matches:888 | inventoryItems:898 | nearbyItems:921 | updateInventoryLists:942 | bag:984 | useBelt:1022 | updateBelt:1029 | beltPanel:1051 | gear:1065 | survivorFields:1119 | survivorProfile:1128 | updateSurvivorPreview:1135 | setSetupSurvivor:1143 | editSurvivor:1151 | crafting:1165 | health:1186 | dailySummary:1216 | diary:1229 | dispatchStatus:1259 | fieldLedger:1274 | ledgerEntry:1313 | ledgerReport:1319 | ledgerPanel:1328 | playtestReport:1364 | copyPlaytest:1408 | knownStory:1421 | storyText:1426 | outbreakLog:1430 | storyEntry:1439 | supplyRun:1448 | gardenStatus:1476 | gardenProject:1485 | waterProject:1505 | utilities:1526 | releases:1545 | research:1552 | npcPanel:1560 | gardenPanel:1577 | stationPanel:1601 | objectPanel:1651 | interact:1793 | interactions:1802 | nearbyAction:1819 | strike:1849 | quickUse:1857 | pause:1864 | visualAtmosphere:1874 | atmospherePanel:1878 | applyAtmosphere:1888 | exportSave:1899 | refreshPanel:1906 | bagChanged:1914 | changeInventory:1924 | bindTap:2270 | updateStick:2343 | shoveOrBrake:2371 | frame:2493
