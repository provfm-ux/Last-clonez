# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> regions -> homes -> chronicle -> world -> atmosphere -> soundscape -> sim -> view -> game

## game/data.js (256 lines)
worldRules:110 | character:177

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/regions.js (519 lines)
addExits:41 | add:42 | connection:58 | oldExit:78 | expand:82 | createGrotto:129 | create:159 | zone:169 | paint:220 | road:224 | add:244 | loot:252 | building:257 | addWilds:498

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (231 lines)
place:156 | fixture:158 | cache:171 | incidentProblem:190 | tideForecast:199 | ready:205 | restore:209

## game/world.js (186 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:45 | build:55 | clear:114 | drivable:121 | sees:125 | route:135

## game/atmosphere.js (143 lines)
place:50 | clearCell:53 | add:57 | nextWave:113 | create:117 | restore:123

## game/soundscape.js (97 lines)
makeBuffer:17 | play:58 | stop:86

## game/sim.js (2660 lines)
addXp:26 | add:49 | remove:62 | notify:72 | stockGardenSeeds:78 | prepareSupplies:90 | addUtilities:109 | stockFieldGear:127 | create:146 | createControl:198 | nearby:236 | containers:240 | unreadClueAt:256 | nearbyClues:263 | readClue:268 | isSupplyCache:274 | nearbySupplyCache:279 | collectSupplyCache:285 | sources:297 | available:301 | consume:305 | collect:319 | collectAll:336 | drop:355 | stash:387 | use:397 | beltItem:459 | setBelt:467 | useBelt:474 | activeLight:483 | replaceBattery:488 | toggleLight:497 | recipeProblem:512 | craft:523 | place:537 | vehicle:575 | enterVehicle:579 | exitVehicle:600 | refuel:626 | vehicleRepairProblem:640 | repairVehicle:648 | brake:658 | updateVehicle:665 | destination:742 | markDestination:753 | markStation:773 | travelProblem:780 | arrivalPosition:790 | travel:801 | exploredTile:837 | saveMapPin:842 | markPin:861 | removePin:869 | noise:877 | hear:890 | encounterSlots:895 | newInfected:901 | freeEncounterSpot:907 | wakeNest:913 | touchFungus:932 | noticeCrib:936 | inspectCrib:946 | warnHorde:952 | resumeEncounterWarning:959 | waveSpots:963 | updateHordes:973 | armWatch:1009 | updateAtmosphere:1019 | listenAtDoor:1067 | sceneProblem:1087 | revealLedgerCache:1092 | resolveScene:1098 | dispatchProblem:1109 | sendDispatch:1118 | readDispatchReport:1125 | settleDispatch:1133 | openingOccupied:1165 | breachProblem:1179 | breach:1188 | door:1216 | barricade:1242 | unboard:1257 | removeBarrier:1268 | minutesToRain:1279 | sight:1302 | canSee:1309 | drainLight:1318 | useTap:1327 | useGenerator:1347 | updateUtilities:1367 | fireBatch:1399 | startFireBatch:1406 | collectFireBatch:1421 | wildProblem:1455 | useWild:1475 | sow:1505 | waterGarden:1515 | gardenYield:1523 | harvestGarden:1529 | growGarden:1542 | updateOutdoor:1554 | catchUpArea:1565 | evaAtShelter:1585 | toggleGardenHelp:1590 | tendShelterGarden:1599 | contextual:1618 | recruit:1678 | threats:1688 | damageFactor:1692 | aimChance:1699 | inAttackRange:1704 | closestInReach:1708 | attackTarget:1719 | weaponProblem:1725 | endPursuit:1731 | endWindup:1737 | faceTowards:1742 | defeat:1747 | attack:1755 | shove:1792 | hurt:1810 | move:1845 | follow:1882 | walkTo:1908 | target:1920 | approach:1927 | updatePlayer:1941 | canTargetEva:2003 | updateEnemies:2007 | updateNpc:2099 | explore:2122 | updateExposure:2132 | updateNeeds:2144 | tick:2179 | updateDoorLure:2219 | breakLeg:2246 | healFracture:2254 | updateSickness:2263 | freeSpot:2286 | unstick:2299 | startSleep:2316 | fastSleep:2326 | sleep:2340 | moodles:2347 | snapshotPlayer:2371 | snapshotZone:2375 | snapshotRun:2383 | zoneShape:2396 | migrate:2411 | restore:2417

## game/view.js (1345 lines)
resize:18 | updateCamera:29 | poly:52 | line:61 | shadow:71 | box:79 | tint:87 | prepare:93 | bloodPool:146 | microDetail:151 | tileArt:172 | tendril:217 | tile:231 | glowSprite:249 | glow:266 | wall:276 | prop:303 | roof:736 | roofCoversPlayer:753 | marker:761 | actor:782 | flashlightBeam:908 | chunkSignature:938 | buildChunk:946 | groundLayer:974 | dimAround:991 | render:1004 | locate:1244 | mapFit:1264 | mapPoint:1269 | minimapLayer:1277 | minimap:1296

## game/game.js (1962 lines)
read:38 | write:42 | backUp:46 | save:55 | clearStick:76 | resetInput:83 | updateDisplayMode:96 | toggleFullscreen:108 | activate:133 | start:153 | showStartDetail:166 | rememberSetup:175 | worldRulesEditor:181 | applyWorldRules:199 | resumeSaved:215 | show:233 | close:247 | menu:255 | titleScreen:264 | wakeSound:279 | cue:289 | syncSound:301 | objectives:310 | objectiveHtml:320 | skillsHtml:324 | statusText:334 | nearbyObjects:350 | interactionLabel:364 | canTalk:375 | setHtml:381 | updateHud:387 | help:457 | landmarks:467 | map:475 | savePinForm:524 | itemDescription:535 | matches:551 | inventoryItems:561 | nearbyItems:584 | updateInventoryLists:605 | bag:647 | useBelt:678 | updateBelt:685 | beltPanel:704 | gear:718 | editSurvivor:754 | crafting:763 | health:784 | diary:811 | dispatchStatus:834 | fieldLedger:849 | ledgerEntry:875 | ledgerReport:881 | ledgerPanel:890 | playtestReport:917 | copyPlaytest:947 | knownStory:960 | storyText:965 | outbreakLog:969 | storyEntry:978 | supplyRun:987 | gardenStatus:1015 | gardenProject:1024 | waterProject:1044 | utilities:1065 | releases:1084 | research:1091 | npcPanel:1099 | gardenPanel:1116 | stationPanel:1140 | objectPanel:1187 | interact:1298 | interactions:1307 | nearbyAction:1324 | strike:1353 | quickUse:1361 | pause:1368 | exportSave:1375 | refreshPanel:1382 | bagChanged:1390 | changeInventory:1400 | bindTap:1662 | updateStick:1735 | shoveOrBrake:1763 | frame:1859
