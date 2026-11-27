# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (616 lines)
worldRules:216 | traitLoadout:435 | character:517

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

## game/sim.js (4437 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:551 | difficultyOptions:603 | setDifficulty:612 | dangerRating:631 | recordPlaytest:639 | createRecommended:643 | campaignGoals:661 | campaignGoal:685 | campaignTarget:690 | campaignTip:719 | pinnedGoal:754 | nearby:767 | containers:771 | readCinemaNote:790 | unreadClueAt:798 | nearbyClues:805 | readClue:810 | isSupplyCache:816 | nearbySupplyCache:821 | collectSupplyCache:827 | sources:839 | available:843 | consume:847 | collect:861 | collectAll:889 | drop:908 | stash:937 | use:947 | beltItem:1036 | setBelt:1044 | useBelt:1051 | activeLight:1060 | replaceBattery:1065 | toggleLight:1074 | recipeProblem:1092 | craft:1116 | place:1142 | vehicle:1185 | enterVehicle:1189 | exitVehicle:1210 | refuel:1238 | vehicleRepairProblem:1252 | repairVehicle:1260 | brake:1272 | updateVehicle:1279 | longHaulGoals:1360 | longHaulHint:1373 | updateLongHaul:1397 | destination:1422 | markDestination:1446 | markStation:1466 | restoreCampaign:1479 | placeCampaignPages:1501 | takeStatue:1521 | updateCinemaTrap:1561 | updatePineRidge:1579 | updateCinemaBuff:1610 | placeIronworks:1620 | dismantleCage:1645 | readTerminal:1670 | placeGrottoPlate:1679 | readGrottoPlate:1686 | placeFatHill:1699 | bossDamage:1733 | removeGuard:1747 | fathillFear:1756 | fathillFinale:1766 | playViolin:1777 | spotIn:1792 | placeAmigo1:1800 | aiSend:1820 | useAiTerminal:1848 | vicFinale:1854 | readVicDiary:1864 | placeFieldsLedger:1878 | fieldsAlarm:1894 | readFieldsLedger:1902 | finishGrotto:1920 | placeEvaDiary:1930 | updateEva:1941 | readEvaDiary:1959 | readCampaignPage:1968 | campaignProblem:1985 | travelProblem:1994 | arrivalPosition:2006 | travel:2017 | exploredTile:2060 | saveMapPin:2065 | markPin:2084 | removePin:2092 | noise:2101 | hear:2119 | hearZombie:2127 | encounterSlots:2142 | newInfected:2148 | freeEncounterSpot:2154 | wakeNest:2160 | touchFungus:2179 | noticeCrib:2183 | inspectCrib:2193 | warnHorde:2199 | resumeEncounterWarning:2206 | waveSpots:2210 | updateHordes:2220 | waitWithWatch:2277 | armWatch:2300 | updateAtmosphere:2310 | listenAtDoor:2371 | sceneProblem:2391 | revealLedgerCache:2396 | resolveScene:2402 | dispatchProblem:2428 | sendDispatch:2437 | readDispatchReport:2444 | settleDispatch:2452 | openingOccupied:2484 | breachProblem:2498 | breach:2508 | door:2547 | barricade:2578 | unboard:2594 | removeBarrier:2605 | minutesToRain:2617 | sight:2646 | canSee:2653 | drainLight:2662 | useTap:2671 | useGenerator:2691 | updateUtilities:2711 | fireBatch:2744 | startFireBatch:2751 | collectFireBatch:2767 | mushroomProblem:2810 | harvestMushroom:2817 | updateFungalAlert:2832 | readFieldNote:2848 | wildProblem:2868 | useWild:2890 | sow:2925 | waterGarden:2935 | gardenYield:2943 | harvestGarden:2949 | growGarden:2967 | updateOutdoor:2979 | catchUpArea:2990 | evaAtShelter:3027 | toggleGardenHelp:3032 | tendShelterGarden:3041 | dismantleFurniture:3063 | contextual:3073 | recruit:3129 | threats:3139 | damageFactor:3143 | aimChance:3150 | inAttackRange:3155 | closestInReach:3159 | attackTarget:3170 | touchAttackTarget:3176 | weaponProblem:3191 | endPursuit:3197 | endWindup:3203 | faceTowards:3208 | carriedSupply:3214 | defeat:3226 | attack:3242 | shove:3294 | hurt:3324 | move:3374 | follow:3411 | walkTo:3437 | target:3449 | approach:3456 | updatePlayer:3472 | canTargetEva:3555 | leaveTrack:3563 | nearbyTrack:3578 | inspectTrack:3591 | updateEnemies:3604 | updateNpc:3738 | explore:3761 | updateExposure:3771 | updateNeeds:3783 | tick:3821 | updateDoorLure:3881 | breakLeg:3908 | healFracture:3916 | updateSickness:3925 | freeSpot:3948 | unstick:3961 | startSleep:3978 | fastSleep:3988 | sleep:4003 | moodles:4010 | snapshotPlayer:4034 | snapshotZone:4038 | snapshotRun:4047 | zoneShape:4069 | migrate:4087 | restore:4093

## game/view.js (2993 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:720 | campfireSmoke:740 | prop:760 | roof:1330 | roofArt:1352 | roofCoversPlayer:1403 | marker:1411 | survivorPalette:1457 | actorFrame:1469 | drawHeldWeapon:1674 | weaponIcon:1703 | drawZombieSprite:1723 | pickPlainInfected:1785 | recolouredAtlas:1801 | characterFor:1830 | charImage:1845 | drawCharacter:1851 | microActor:1902 | equipmentPortrait:1957 | deathFall:1973 | actor:1979 | beamReach:2154 | flashlightBeam:2164 | warmBeamSprite:2184 | warmFlashlight:2207 | windowGlow:2233 | weatherEffects:2257 | drawDestination:2293 | chunkSignature:2320 | buildChunk:2328 | groundLayer:2356 | dimAround:2373 | afterlifePixels:2411 | afterlifePortrait:2438 | renderAfterlife:2450 | render:2598 | locate:2885 | mapFit:2905 | mapPoint:2910 | minimapLayer:2918 | minimap:2937

## game/game.js (2729 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | resumeSaved:474 | aiChat:493 | show:503 | close:517 | menu:530 | titleScreen:540 | wakeSound:558 | cue:571 | syncSound:583 | objectives:592 | objectiveHtml:607 | skillsHtml:611 | conditions:623 | nearbyObjects:639 | guidedBat:653 | interactionLabel:659 | canTalk:671 | setHtml:677 | updateHud:683 | help:814 | landmarks:824 | map:834 | savePinForm:884 | itemIcon:895 | weaponCondition:900 | itemDescription:906 | matches:936 | inventoryItems:946 | nearbyItems:969 | updateInventoryLists:990 | bag:1032 | useBelt:1070 | updateBelt:1077 | beltPanel:1099 | gear:1113 | survivorFields:1168 | survivorProfile:1177 | showTraitPoints:1186 | updateSurvivorPreview:1194 | setSetupSurvivor:1202 | editSurvivor:1212 | crafting:1226 | health:1247 | dailySummary:1277 | diary:1290 | dispatchStatus:1321 | fieldLedger:1336 | ledgerEntry:1375 | ledgerReport:1381 | ledgerPanel:1390 | playtestReport:1426 | copyPlaytest:1470 | knownStory:1483 | storyText:1488 | outbreakLog:1492 | storyEntry:1501 | supplyRun:1510 | gardenStatus:1538 | gardenProject:1547 | waterProject:1567 | utilities:1588 | releases:1607 | research:1614 | npcPanel:1622 | gardenPanel:1639 | stationPanel:1663 | objectPanel:1713 | interact:1887 | interactions:1896 | nearbyAction:1913 | strike:1944 | quickUse:1952 | pause:1959 | visualAtmosphere:1969 | atmospherePanel:1973 | applyAtmosphere:1985 | exportSave:1998 | refreshPanel:2005 | bagChanged:2013 | changeInventory:2023 | bindTap:2374 | updateStick:2447 | shoveOrBrake:2475 | frame:2598
