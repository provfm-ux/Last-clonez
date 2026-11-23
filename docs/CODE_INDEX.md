# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> sim -> view -> game

## game/data.js (341 lines)
worldRules:167 | character:257

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

## game/sim.js (3270 lines)
weapon:19 | unequipWeapon:26 | wornItem:35 | addXp:45 | add:68 | remove:81 | notify:91 | stockGardenSeeds:97 | prepareSupplies:109 | addUtilities:128 | stockFieldGear:146 | placeStartingBat:174 | stockSkillBooks:186 | stockLongHaul:203 | create:229 | createControl:311 | difficultyOptions:363 | setDifficulty:372 | dangerRating:391 | recordPlaytest:399 | createRecommended:403 | pinnedGoal:420 | nearby:429 | containers:433 | unreadClueAt:449 | nearbyClues:456 | readClue:461 | isSupplyCache:467 | nearbySupplyCache:472 | collectSupplyCache:478 | sources:490 | available:494 | consume:498 | collect:512 | collectAll:539 | drop:558 | stash:587 | use:597 | beltItem:677 | setBelt:685 | useBelt:692 | activeLight:701 | replaceBattery:706 | toggleLight:715 | recipeProblem:732 | craft:748 | place:768 | vehicle:806 | enterVehicle:810 | exitVehicle:831 | refuel:859 | vehicleRepairProblem:873 | repairVehicle:881 | brake:893 | updateVehicle:900 | longHaulGoals:981 | longHaulHint:994 | updateLongHaul:1018 | destination:1043 | markDestination:1063 | markStation:1083 | travelProblem:1090 | arrivalPosition:1100 | travel:1111 | exploredTile:1152 | saveMapPin:1157 | markPin:1176 | removePin:1184 | noise:1192 | hear:1208 | hearZombie:1216 | encounterSlots:1231 | newInfected:1237 | freeEncounterSpot:1243 | wakeNest:1249 | touchFungus:1268 | noticeCrib:1272 | inspectCrib:1282 | warnHorde:1288 | resumeEncounterWarning:1295 | waveSpots:1299 | updateHordes:1309 | waitWithWatch:1366 | armWatch:1389 | updateAtmosphere:1399 | listenAtDoor:1460 | sceneProblem:1480 | revealLedgerCache:1485 | resolveScene:1491 | dispatchProblem:1517 | sendDispatch:1526 | readDispatchReport:1533 | settleDispatch:1541 | openingOccupied:1573 | breachProblem:1587 | breach:1596 | door:1626 | barricade:1653 | unboard:1669 | removeBarrier:1680 | minutesToRain:1691 | sight:1720 | canSee:1727 | drainLight:1736 | useTap:1745 | useGenerator:1765 | updateUtilities:1785 | fireBatch:1817 | startFireBatch:1824 | collectFireBatch:1839 | wildProblem:1877 | useWild:1897 | sow:1927 | waterGarden:1937 | gardenYield:1945 | harvestGarden:1951 | growGarden:1968 | updateOutdoor:1980 | catchUpArea:1991 | evaAtShelter:2028 | toggleGardenHelp:2033 | tendShelterGarden:2042 | dismantleFurniture:2064 | contextual:2074 | recruit:2129 | threats:2139 | damageFactor:2143 | aimChance:2150 | inAttackRange:2155 | closestInReach:2159 | attackTarget:2170 | touchAttackTarget:2176 | weaponProblem:2191 | endPursuit:2197 | endWindup:2203 | faceTowards:2208 | defeat:2213 | attack:2223 | shove:2269 | hurt:2295 | move:2343 | follow:2380 | walkTo:2406 | target:2418 | approach:2425 | updatePlayer:2441 | canTargetEva:2516 | updateEnemies:2520 | updateNpc:2636 | explore:2659 | updateExposure:2669 | updateNeeds:2681 | tick:2716 | updateDoorLure:2768 | breakLeg:2795 | healFracture:2803 | updateSickness:2812 | freeSpot:2835 | unstick:2848 | startSleep:2865 | fastSleep:2875 | sleep:2890 | moodles:2897 | snapshotPlayer:2921 | snapshotZone:2925 | snapshotRun:2933 | zoneShape:2950 | migrate:2965 | restore:2971

## game/view.js (2769 lines)
resize:22 | updateCamera:33 | poly:56 | line:65 | shadow:75 | box:83 | tint:91 | prepare:97 | bloodPool:162 | microDetail:167 | tileArt:218 | tendril:284 | tile:298 | glowSprite:316 | glow:333 | wall:343 | paintWall:370 | gardenTree:403 | paintFurniture:447 | drawFurniture:716 | campfireSmoke:736 | prop:756 | roof:1280 | roofArt:1302 | roofCoversPlayer:1353 | marker:1361 | survivorPalette:1407 | actorFrame:1419 | drawHeldWeapon:1621 | weaponIcon:1650 | drawZombieSprite:1670 | microActor:1716 | equipmentPortrait:1769 | actor:1782 | beamReach:1942 | flashlightBeam:1952 | warmBeamSprite:1972 | warmFlashlight:1995 | windowGlow:2021 | weatherEffects:2045 | drawDestination:2081 | chunkSignature:2108 | buildChunk:2116 | groundLayer:2144 | dimAround:2161 | afterlifePixels:2199 | afterlifePortrait:2226 | renderAfterlife:2238 | render:2386 | locate:2661 | mapFit:2681 | mapPoint:2686 | minimapLayer:2694 | minimap:2713

## game/game.js (2544 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | start:289 | startLongHaul:307 | startRecommended:317 | showStartDetail:332 | savedAssists:345 | assistsOn:352 | difficultyPanel:357 | applyDifficulty:378 | rememberSetup:399 | worldRulesEditor:405 | applyWorldRules:423 | resumeSaved:439 | show:457 | close:471 | menu:484 | titleScreen:494 | wakeSound:511 | cue:524 | syncSound:536 | objectives:545 | objectiveHtml:556 | skillsHtml:560 | conditions:570 | nearbyObjects:585 | interactionLabel:599 | canTalk:611 | setHtml:617 | updateHud:623 | help:751 | landmarks:761 | map:771 | savePinForm:821 | itemIcon:832 | weaponCondition:837 | itemDescription:843 | matches:871 | inventoryItems:881 | nearbyItems:904 | updateInventoryLists:925 | bag:967 | useBelt:1005 | updateBelt:1012 | beltPanel:1034 | gear:1048 | survivorFields:1102 | survivorProfile:1111 | updateSurvivorPreview:1118 | setSetupSurvivor:1126 | editSurvivor:1134 | crafting:1148 | health:1169 | diary:1199 | dispatchStatus:1222 | fieldLedger:1237 | ledgerEntry:1276 | ledgerReport:1282 | ledgerPanel:1291 | playtestReport:1327 | copyPlaytest:1371 | knownStory:1384 | storyText:1389 | outbreakLog:1393 | storyEntry:1402 | supplyRun:1411 | gardenStatus:1439 | gardenProject:1448 | waterProject:1468 | utilities:1489 | releases:1508 | research:1515 | npcPanel:1523 | gardenPanel:1540 | stationPanel:1564 | objectPanel:1611 | interact:1727 | interactions:1736 | nearbyAction:1753 | strike:1782 | quickUse:1790 | pause:1797 | visualAtmosphere:1807 | atmospherePanel:1811 | applyAtmosphere:1821 | exportSave:1832 | refreshPanel:1839 | bagChanged:1847 | changeInventory:1857 | bindTap:2195 | updateStick:2268 | shoveOrBrake:2296 | frame:2418
