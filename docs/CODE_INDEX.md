# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (526 lines)
worldRules:214 | traitLoadout:348 | character:430

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

## game/sim.js (4036 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:543 | difficultyOptions:595 | setDifficulty:604 | dangerRating:623 | recordPlaytest:631 | createRecommended:635 | pinnedGoal:652 | nearby:661 | containers:665 | readCinemaNote:684 | unreadClueAt:692 | nearbyClues:699 | readClue:704 | isSupplyCache:710 | nearbySupplyCache:715 | collectSupplyCache:721 | sources:733 | available:737 | consume:741 | collect:755 | collectAll:783 | drop:802 | stash:831 | use:841 | beltItem:929 | setBelt:937 | useBelt:944 | activeLight:953 | replaceBattery:958 | toggleLight:967 | recipeProblem:985 | craft:1009 | place:1035 | vehicle:1078 | enterVehicle:1082 | exitVehicle:1103 | refuel:1131 | vehicleRepairProblem:1145 | repairVehicle:1153 | brake:1165 | updateVehicle:1172 | longHaulGoals:1253 | longHaulHint:1266 | updateLongHaul:1290 | destination:1315 | markDestination:1335 | markStation:1355 | restoreCampaign:1367 | placeCampaignPages:1381 | takeStatue:1401 | updateCinemaTrap:1441 | updatePineRidge:1459 | updateCinemaBuff:1490 | placeIronworks:1500 | dismantleCage:1525 | readTerminal:1550 | placeEvaDiary:1558 | updateEva:1569 | readEvaDiary:1587 | readCampaignPage:1596 | campaignProblem:1613 | travelProblem:1622 | arrivalPosition:1634 | travel:1645 | exploredTile:1687 | saveMapPin:1692 | markPin:1711 | removePin:1719 | noise:1727 | hear:1744 | hearZombie:1752 | encounterSlots:1767 | newInfected:1773 | freeEncounterSpot:1779 | wakeNest:1785 | touchFungus:1804 | noticeCrib:1808 | inspectCrib:1818 | warnHorde:1824 | resumeEncounterWarning:1831 | waveSpots:1835 | updateHordes:1845 | waitWithWatch:1902 | armWatch:1925 | updateAtmosphere:1935 | listenAtDoor:1996 | sceneProblem:2016 | revealLedgerCache:2021 | resolveScene:2027 | dispatchProblem:2053 | sendDispatch:2062 | readDispatchReport:2069 | settleDispatch:2077 | openingOccupied:2109 | breachProblem:2123 | breach:2133 | door:2172 | barricade:2203 | unboard:2219 | removeBarrier:2230 | minutesToRain:2242 | sight:2271 | canSee:2278 | drainLight:2287 | useTap:2296 | useGenerator:2316 | updateUtilities:2336 | fireBatch:2369 | startFireBatch:2376 | collectFireBatch:2392 | mushroomProblem:2435 | harvestMushroom:2442 | updateFungalAlert:2457 | readFieldNote:2473 | wildProblem:2493 | useWild:2515 | sow:2550 | waterGarden:2560 | gardenYield:2568 | harvestGarden:2574 | growGarden:2592 | updateOutdoor:2604 | catchUpArea:2615 | evaAtShelter:2652 | toggleGardenHelp:2657 | tendShelterGarden:2666 | dismantleFurniture:2688 | contextual:2698 | recruit:2754 | threats:2764 | damageFactor:2768 | aimChance:2775 | inAttackRange:2780 | closestInReach:2784 | attackTarget:2795 | touchAttackTarget:2801 | weaponProblem:2816 | endPursuit:2822 | endWindup:2828 | faceTowards:2833 | carriedSupply:2839 | defeat:2851 | attack:2864 | shove:2914 | hurt:2940 | move:2990 | follow:3027 | walkTo:3053 | target:3065 | approach:3072 | updatePlayer:3088 | canTargetEva:3171 | leaveTrack:3179 | nearbyTrack:3194 | inspectTrack:3207 | updateEnemies:3220 | updateNpc:3338 | explore:3361 | updateExposure:3371 | updateNeeds:3383 | tick:3421 | updateDoorLure:3480 | breakLeg:3507 | healFracture:3515 | updateSickness:3524 | freeSpot:3547 | unstick:3560 | startSleep:3577 | fastSleep:3587 | sleep:3602 | moodles:3609 | snapshotPlayer:3633 | snapshotZone:3637 | snapshotRun:3646 | zoneShape:3668 | migrate:3686 | restore:3692

## game/view.js (2825 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1328 | roofArt:1350 | roofCoversPlayer:1401 | marker:1409 | survivorPalette:1455 | actorFrame:1467 | drawHeldWeapon:1672 | weaponIcon:1701 | drawZombieSprite:1721 | microActor:1767 | equipmentPortrait:1820 | actor:1833 | beamReach:1993 | flashlightBeam:2003 | warmBeamSprite:2023 | warmFlashlight:2046 | windowGlow:2072 | weatherEffects:2096 | drawDestination:2132 | chunkSignature:2159 | buildChunk:2167 | groundLayer:2195 | dimAround:2212 | afterlifePixels:2250 | afterlifePortrait:2277 | renderAfterlife:2289 | render:2437 | locate:2717 | mapFit:2737 | mapPoint:2742 | minimapLayer:2750 | minimap:2769

## game/game.js (2663 lines)
read:63 | write:67 | backUp:71 | save:80 | clearStick:101 | resetInput:108 | updateDisplayMode:121 | toggleFullscreen:133 | activate:158 | setNavigation:179 | opening:186 | startLesson:200 | endLesson:213 | updateLesson:227 | startAfterlife:251 | deathSummary:261 | skipAfterlife:272 | endAfterlife:278 | afterlifeAction:285 | confirmNewRun:289 | start:294 | startRecommended:322 | showStartDetail:338 | savedAssists:356 | assistsOn:363 | difficultyPanel:368 | applyDifficulty:389 | rememberSetup:410 | worldRulesEditor:416 | applyWorldRules:434 | resumeSaved:450 | show:468 | close:482 | menu:495 | titleScreen:505 | wakeSound:522 | cue:535 | syncSound:547 | objectives:556 | objectiveHtml:567 | skillsHtml:571 | conditions:583 | nearbyObjects:599 | guidedBat:613 | interactionLabel:619 | canTalk:631 | setHtml:637 | updateHud:643 | help:773 | landmarks:783 | map:793 | savePinForm:843 | itemIcon:854 | weaponCondition:859 | itemDescription:865 | matches:895 | inventoryItems:905 | nearbyItems:928 | updateInventoryLists:949 | bag:991 | useBelt:1029 | updateBelt:1036 | beltPanel:1058 | gear:1072 | survivorFields:1127 | survivorProfile:1136 | showTraitPoints:1145 | updateSurvivorPreview:1153 | setSetupSurvivor:1161 | editSurvivor:1171 | crafting:1185 | health:1206 | dailySummary:1236 | diary:1249 | dispatchStatus:1280 | fieldLedger:1295 | ledgerEntry:1334 | ledgerReport:1340 | ledgerPanel:1349 | playtestReport:1385 | copyPlaytest:1429 | knownStory:1442 | storyText:1447 | outbreakLog:1451 | storyEntry:1460 | supplyRun:1469 | gardenStatus:1497 | gardenProject:1506 | waterProject:1526 | utilities:1547 | releases:1566 | research:1573 | npcPanel:1581 | gardenPanel:1598 | stationPanel:1622 | objectPanel:1672 | interact:1830 | interactions:1839 | nearbyAction:1856 | strike:1887 | quickUse:1895 | pause:1902 | visualAtmosphere:1912 | atmospherePanel:1916 | applyAtmosphere:1926 | exportSave:1937 | refreshPanel:1944 | bagChanged:1952 | changeInventory:1962 | bindTap:2309 | updateStick:2382 | shoveOrBrake:2410 | frame:2532
