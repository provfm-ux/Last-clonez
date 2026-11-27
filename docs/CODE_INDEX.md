# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (565 lines)
worldRules:215 | traitLoadout:385 | character:467

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

## game/soundscape.js (281 lines)
setVolumes:11 | makeBuffer:38 | decodeRecording:148 | preload:158 | bankFor:171 | zombieClip:184 | playZombie:195 | play:222 | output:241 | stop:268

## game/afterlife.js (268 lines)
search:35 | pathTo:49 | start:55 | range:111 | finish:117 | objective:124 | ready:131 | screenInput:138 | action:144 | tick:175

## game/field-stories.js (253 lines)
place:184

## game/campaign-hints.js (48 lines)
track:23 | progress:28 | next:33 | restore:40

## game/campaign.js (100 lines)
closedReason:75 | missing:89

## game/sim.js (4299 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:550 | difficultyOptions:602 | setDifficulty:611 | dangerRating:630 | recordPlaytest:638 | createRecommended:642 | campaignGoals:660 | campaignGoal:679 | campaignTarget:684 | pinnedGoal:707 | nearby:720 | containers:724 | readCinemaNote:743 | unreadClueAt:751 | nearbyClues:758 | readClue:763 | isSupplyCache:769 | nearbySupplyCache:774 | collectSupplyCache:780 | sources:792 | available:796 | consume:800 | collect:814 | collectAll:842 | drop:861 | stash:890 | use:900 | beltItem:989 | setBelt:997 | useBelt:1004 | activeLight:1013 | replaceBattery:1018 | toggleLight:1027 | recipeProblem:1045 | craft:1069 | place:1095 | vehicle:1138 | enterVehicle:1142 | exitVehicle:1163 | refuel:1191 | vehicleRepairProblem:1205 | repairVehicle:1213 | brake:1225 | updateVehicle:1232 | longHaulGoals:1313 | longHaulHint:1326 | updateLongHaul:1350 | destination:1375 | markDestination:1399 | markStation:1419 | restoreCampaign:1432 | placeCampaignPages:1451 | takeStatue:1471 | updateCinemaTrap:1511 | updatePineRidge:1529 | updateCinemaBuff:1560 | placeIronworks:1570 | dismantleCage:1595 | readTerminal:1620 | placeGrottoPlate:1629 | readGrottoPlate:1636 | placeFatHill:1649 | bossDamage:1683 | removeGuard:1696 | fathillFear:1705 | fathillFinale:1715 | playViolin:1726 | placeFieldsLedger:1741 | fieldsAlarm:1757 | readFieldsLedger:1765 | finishGrotto:1783 | placeEvaDiary:1793 | updateEva:1804 | readEvaDiary:1822 | readCampaignPage:1831 | campaignProblem:1848 | travelProblem:1857 | arrivalPosition:1869 | travel:1880 | exploredTile:1923 | saveMapPin:1928 | markPin:1947 | removePin:1955 | noise:1964 | hear:1982 | hearZombie:1990 | encounterSlots:2005 | newInfected:2011 | freeEncounterSpot:2017 | wakeNest:2023 | touchFungus:2042 | noticeCrib:2046 | inspectCrib:2056 | warnHorde:2062 | resumeEncounterWarning:2069 | waveSpots:2073 | updateHordes:2083 | waitWithWatch:2140 | armWatch:2163 | updateAtmosphere:2173 | listenAtDoor:2234 | sceneProblem:2254 | revealLedgerCache:2259 | resolveScene:2265 | dispatchProblem:2291 | sendDispatch:2300 | readDispatchReport:2307 | settleDispatch:2315 | openingOccupied:2347 | breachProblem:2361 | breach:2371 | door:2410 | barricade:2441 | unboard:2457 | removeBarrier:2468 | minutesToRain:2480 | sight:2509 | canSee:2516 | drainLight:2525 | useTap:2534 | useGenerator:2554 | updateUtilities:2574 | fireBatch:2607 | startFireBatch:2614 | collectFireBatch:2630 | mushroomProblem:2673 | harvestMushroom:2680 | updateFungalAlert:2695 | readFieldNote:2711 | wildProblem:2731 | useWild:2753 | sow:2788 | waterGarden:2798 | gardenYield:2806 | harvestGarden:2812 | growGarden:2830 | updateOutdoor:2842 | catchUpArea:2853 | evaAtShelter:2890 | toggleGardenHelp:2895 | tendShelterGarden:2904 | dismantleFurniture:2926 | contextual:2936 | recruit:2992 | threats:3002 | damageFactor:3006 | aimChance:3013 | inAttackRange:3018 | closestInReach:3022 | attackTarget:3033 | touchAttackTarget:3039 | weaponProblem:3054 | endPursuit:3060 | endWindup:3066 | faceTowards:3071 | carriedSupply:3077 | defeat:3089 | attack:3104 | shove:3156 | hurt:3186 | move:3236 | follow:3273 | walkTo:3299 | target:3311 | approach:3318 | updatePlayer:3334 | canTargetEva:3417 | leaveTrack:3425 | nearbyTrack:3440 | inspectTrack:3453 | updateEnemies:3466 | updateNpc:3600 | explore:3623 | updateExposure:3633 | updateNeeds:3645 | tick:3683 | updateDoorLure:3743 | breakLeg:3770 | healFracture:3778 | updateSickness:3787 | freeSpot:3810 | unstick:3823 | startSleep:3840 | fastSleep:3850 | sleep:3865 | moodles:3872 | snapshotPlayer:3896 | snapshotZone:3900 | snapshotRun:3909 | zoneShape:3931 | migrate:3949 | restore:3955

## game/view.js (2992 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1844 | drawCharacter:1850 | microActor:1901 | equipmentPortrait:1956 | deathFall:1972 | actor:1978 | beamReach:2153 | flashlightBeam:2163 | warmBeamSprite:2183 | warmFlashlight:2206 | windowGlow:2232 | weatherEffects:2256 | drawDestination:2292 | chunkSignature:2319 | buildChunk:2327 | groundLayer:2355 | dimAround:2372 | afterlifePixels:2410 | afterlifePortrait:2437 | renderAfterlife:2449 | render:2597 | locate:2884 | mapFit:2904 | mapPoint:2909 | minimapLayer:2917 | minimap:2936

## game/game.js (2705 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | show:492 | close:506 | menu:519 | titleScreen:529 | wakeSound:547 | cue:560 | syncSound:572 | objectives:581 | objectiveHtml:596 | skillsHtml:600 | conditions:612 | nearbyObjects:628 | guidedBat:642 | interactionLabel:648 | canTalk:660 | setHtml:666 | updateHud:672 | help:802 | landmarks:812 | map:822 | savePinForm:872 | itemIcon:883 | weaponCondition:888 | itemDescription:894 | matches:924 | inventoryItems:934 | nearbyItems:957 | updateInventoryLists:978 | bag:1020 | useBelt:1058 | updateBelt:1065 | beltPanel:1087 | gear:1101 | survivorFields:1156 | survivorProfile:1165 | showTraitPoints:1174 | updateSurvivorPreview:1182 | setSetupSurvivor:1190 | editSurvivor:1200 | crafting:1214 | health:1235 | dailySummary:1265 | diary:1278 | dispatchStatus:1309 | fieldLedger:1324 | ledgerEntry:1363 | ledgerReport:1369 | ledgerPanel:1378 | playtestReport:1414 | copyPlaytest:1458 | knownStory:1471 | storyText:1476 | outbreakLog:1480 | storyEntry:1489 | supplyRun:1498 | gardenStatus:1526 | gardenProject:1535 | waterProject:1555 | utilities:1576 | releases:1595 | research:1602 | npcPanel:1610 | gardenPanel:1627 | stationPanel:1651 | objectPanel:1701 | interact:1867 | interactions:1876 | nearbyAction:1893 | strike:1924 | quickUse:1932 | pause:1939 | visualAtmosphere:1949 | atmospherePanel:1953 | applyAtmosphere:1965 | exportSave:1978 | refreshPanel:1985 | bagChanged:1993 | changeInventory:2003 | bindTap:2350 | updateStick:2423 | shoveOrBrake:2451 | frame:2574
