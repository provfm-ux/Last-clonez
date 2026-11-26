# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (412 lines)
worldRules:199 | character:317

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

## game/campaign-hints.js (43 lines)
track:18 | progress:23 | next:28 | restore:35

## game/campaign.js (72 lines)
closedReason:47 | missing:61

## game/sim.js (3676 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | stockStoneMaterials:229 | stockPantry:250 | balanceExploration:270 | stockTravelRoutes:327 | closeDaily:386 | testJump:399 | fastForward:408 | restoreDaily:414 | create:427 | createControl:517 | difficultyOptions:569 | setDifficulty:578 | dangerRating:597 | recordPlaytest:605 | createRecommended:609 | pinnedGoal:626 | nearby:635 | containers:639 | unreadClueAt:655 | nearbyClues:662 | readClue:667 | isSupplyCache:673 | nearbySupplyCache:678 | collectSupplyCache:684 | sources:696 | available:700 | consume:704 | collect:718 | collectAll:746 | drop:765 | stash:794 | use:804 | beltItem:891 | setBelt:899 | useBelt:906 | activeLight:915 | replaceBattery:920 | toggleLight:929 | recipeProblem:947 | craft:971 | place:997 | vehicle:1040 | enterVehicle:1044 | exitVehicle:1065 | refuel:1093 | vehicleRepairProblem:1107 | repairVehicle:1115 | brake:1127 | updateVehicle:1134 | longHaulGoals:1215 | longHaulHint:1228 | updateLongHaul:1252 | destination:1277 | markDestination:1297 | markStation:1317 | restoreCampaign:1327 | campaignProblem:1334 | travelProblem:1343 | arrivalPosition:1355 | travel:1366 | exploredTile:1408 | saveMapPin:1413 | markPin:1432 | removePin:1440 | noise:1448 | hear:1464 | hearZombie:1472 | encounterSlots:1487 | newInfected:1493 | freeEncounterSpot:1499 | wakeNest:1505 | touchFungus:1524 | noticeCrib:1528 | inspectCrib:1538 | warnHorde:1544 | resumeEncounterWarning:1551 | waveSpots:1555 | updateHordes:1565 | waitWithWatch:1622 | armWatch:1645 | updateAtmosphere:1655 | listenAtDoor:1716 | sceneProblem:1736 | revealLedgerCache:1741 | resolveScene:1747 | dispatchProblem:1773 | sendDispatch:1782 | readDispatchReport:1789 | settleDispatch:1797 | openingOccupied:1829 | breachProblem:1843 | breach:1852 | door:1882 | barricade:1909 | unboard:1925 | removeBarrier:1936 | minutesToRain:1948 | sight:1977 | canSee:1984 | drainLight:1993 | useTap:2002 | useGenerator:2022 | updateUtilities:2042 | fireBatch:2075 | startFireBatch:2082 | collectFireBatch:2098 | mushroomProblem:2141 | harvestMushroom:2148 | updateFungalAlert:2163 | readFieldNote:2179 | wildProblem:2199 | useWild:2221 | sow:2256 | waterGarden:2266 | gardenYield:2274 | harvestGarden:2280 | growGarden:2298 | updateOutdoor:2310 | catchUpArea:2321 | evaAtShelter:2358 | toggleGardenHelp:2363 | tendShelterGarden:2372 | dismantleFurniture:2394 | contextual:2404 | recruit:2460 | threats:2470 | damageFactor:2474 | aimChance:2481 | inAttackRange:2486 | closestInReach:2490 | attackTarget:2501 | touchAttackTarget:2507 | weaponProblem:2522 | endPursuit:2528 | endWindup:2534 | faceTowards:2539 | carriedSupply:2545 | defeat:2557 | attack:2570 | shove:2620 | hurt:2646 | move:2695 | follow:2732 | walkTo:2758 | target:2770 | approach:2777 | updatePlayer:2793 | canTargetEva:2876 | updateEnemies:2880 | updateNpc:2996 | explore:3019 | updateExposure:3029 | updateNeeds:3041 | tick:3076 | updateDoorLure:3134 | breakLeg:3161 | healFracture:3169 | updateSickness:3178 | freeSpot:3201 | unstick:3214 | startSleep:3231 | fastSleep:3241 | sleep:3256 | moodles:3263 | snapshotPlayer:3287 | snapshotZone:3291 | snapshotRun:3299 | zoneShape:3320 | migrate:3338 | restore:3344

## game/view.js (2791 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1300 | roofArt:1322 | roofCoversPlayer:1373 | marker:1381 | survivorPalette:1427 | actorFrame:1439 | drawHeldWeapon:1643 | weaponIcon:1672 | drawZombieSprite:1692 | microActor:1738 | equipmentPortrait:1791 | actor:1804 | beamReach:1964 | flashlightBeam:1974 | warmBeamSprite:1994 | warmFlashlight:2017 | windowGlow:2043 | weatherEffects:2067 | drawDestination:2103 | chunkSignature:2130 | buildChunk:2138 | groundLayer:2166 | dimAround:2183 | afterlifePixels:2221 | afterlifePortrait:2248 | renderAfterlife:2260 | render:2408 | locate:2683 | mapFit:2703 | mapPoint:2708 | minimapLayer:2716 | minimap:2735

## game/game.js (2611 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:321 | showStartDetail:337 | savedAssists:350 | assistsOn:357 | difficultyPanel:362 | applyDifficulty:383 | rememberSetup:404 | worldRulesEditor:410 | applyWorldRules:428 | resumeSaved:444 | show:462 | close:476 | menu:489 | titleScreen:499 | wakeSound:516 | cue:529 | syncSound:541 | objectives:550 | objectiveHtml:561 | skillsHtml:565 | conditions:577 | nearbyObjects:592 | guidedBat:606 | interactionLabel:612 | canTalk:624 | setHtml:630 | updateHud:636 | help:765 | landmarks:775 | map:785 | savePinForm:835 | itemIcon:846 | weaponCondition:851 | itemDescription:857 | matches:887 | inventoryItems:897 | nearbyItems:920 | updateInventoryLists:941 | bag:983 | useBelt:1021 | updateBelt:1028 | beltPanel:1050 | gear:1064 | survivorFields:1118 | survivorProfile:1127 | updateSurvivorPreview:1134 | setSetupSurvivor:1142 | editSurvivor:1150 | crafting:1164 | health:1185 | dailySummary:1215 | diary:1228 | dispatchStatus:1258 | fieldLedger:1273 | ledgerEntry:1312 | ledgerReport:1318 | ledgerPanel:1327 | playtestReport:1363 | copyPlaytest:1407 | knownStory:1420 | storyText:1425 | outbreakLog:1429 | storyEntry:1438 | supplyRun:1447 | gardenStatus:1475 | gardenProject:1484 | waterProject:1504 | utilities:1525 | releases:1544 | research:1551 | npcPanel:1559 | gardenPanel:1576 | stationPanel:1600 | objectPanel:1650 | interact:1784 | interactions:1793 | nearbyAction:1810 | strike:1840 | quickUse:1848 | pause:1855 | visualAtmosphere:1865 | atmospherePanel:1869 | applyAtmosphere:1879 | exportSave:1890 | refreshPanel:1897 | bagChanged:1905 | changeInventory:1915 | bindTap:2261 | updateStick:2334 | shoveOrBrake:2362 | frame:2484
