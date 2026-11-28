# Code index (generated - do not edit; run `npm run index`)

Use `grep -n "name" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.

Load order (index.html): data -> research -> legacy-level -> level -> expedition -> regions -> homes -> chronicle -> world -> atmosphere -> recordings -> soundscape -> afterlife -> field-stories -> campaign-hints -> campaign -> sim -> view -> game

## game/data.js (725 lines)
worldRules:226 | traitLoadout:543 | character:625

## game/research.js (334 lines)
(no named functions)

## game/legacy-level.js (107 lines)
seeded:11 | create:17 | loot:56

## game/level.js (102 lines)
create:6 | add:14 | partition:25 | door:31

## game/expedition.js (197 lines)
record:147

## game/regions.js (629 lines)
cinemaOutcome:48 | addExits:54 | add:55 | connection:90 | oldExit:110 | expand:114 | createGrotto:161 | create:191 | zone:202 | paint:268 | road:272 | add:292 | loot:300 | building:305 | addWilds:608

## game/homes.js (220 lines)
place:47 | pave:65 | put:72 | drawHome:81 | reserved:134 | pathCell:163 | residents:212

## game/chronicle.js (336 lines)
available:230 | place:258 | fixture:260 | cache:273 | incidentProblem:292 | tideForecast:302 | ready:308 | restore:312

## game/world.js (188 lines)
tileAt:7 | sync:13 | infectedOutfit:35 | infected:47 | build:57 | clear:116 | drivable:123 | sees:127 | route:137

## game/atmosphere.js (151 lines)
place:58 | clearCell:61 | add:65 | nextWave:121 | create:125 | restore:131

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

## game/sim.js (4903 lines)
weapon:21 | unequipWeapon:28 | wornItem:37 | addXp:47 | add:70 | remove:83 | notify:93 | stockGardenSeeds:99 | prepareSupplies:111 | addUtilities:130 | stockFieldGear:148 | placeStartingBat:176 | stockSkillBooks:188 | stockLongHaul:205 | stockStoneMaterials:231 | stockPantry:252 | balanceExploration:272 | stockTravelRoutes:329 | closeDaily:388 | testJump:401 | fastForward:410 | restoreDaily:416 | create:429 | createControl:557 | difficultyOptions:609 | setDifficulty:618 | dangerRating:637 | recordPlaytest:645 | createRecommended:649 | campaignGoals:667 | campaignGoal:695 | campaignTarget:700 | idleIdea:733 | radioNeeds:757 | radioChecklist:767 | campaignTip:776 | pinnedGoal:821 | nearby:834 | containers:838 | readCinemaNote:857 | unreadClueAt:865 | nearbyClues:872 | readClue:877 | isSupplyCache:883 | nearbySupplyCache:888 | collectSupplyCache:894 | sources:906 | available:910 | consume:914 | collect:928 | collectAll:961 | drop:980 | stash:1009 | use:1019 | beltItem:1115 | setBelt:1123 | useBelt:1130 | activeLight:1139 | replaceBattery:1144 | toggleLight:1153 | recipeProblem:1171 | craft:1195 | place:1221 | vehicle:1264 | enterVehicle:1268 | exitVehicle:1289 | refuel:1317 | vehicleRepairProblem:1331 | repairVehicle:1339 | brake:1351 | updateVehicle:1358 | longHaulGoals:1439 | longHaulHint:1452 | updateLongHaul:1476 | destination:1501 | markDestination:1525 | markStation:1545 | restoreCampaign:1558 | placeCampaignPages:1586 | takeStatue:1606 | updateCinemaTrap:1646 | updatePineRidge:1664 | updateCinemaBuff:1695 | placeIronworks:1706 | dismantleCage:1731 | readTerminal:1756 | placeGrottoPlate:1765 | readGrottoPlate:1772 | placeFatHill:1785 | bossDamage:1819 | removeGuard:1855 | fathillFear:1864 | fathillFinale:1874 | playViolin:1885 | spotIn:1900 | placeAmigo1:1908 | placeRandomFinds:1927 | roomSpots:1957 | placeOptional:1964 | updateOptional:1992 | updateTide:2007 | updateViolinCall:2025 | placeFortress:2057 | throwMolotov:2088 | updateFire:2106 | pipBurn:2116 | pipFinale:2123 | aiSend:2135 | useAiTerminal:2165 | seeEpilogue:2174 | vicFinale:2180 | readVicDiary:2189 | placeFieldsLedger:2203 | fieldsAlarm:2219 | readFieldsLedger:2227 | finishGrotto:2245 | placeEvaDiary:2255 | updateEva:2266 | readEvaDiary:2284 | readCampaignPage:2293 | campaignProblem:2321 | travelProblem:2330 | arrivalPosition:2342 | travel:2353 | exploredTile:2396 | saveMapPin:2401 | markPin:2420 | removePin:2428 | noise:2437 | hear:2455 | hearZombie:2463 | encounterSlots:2478 | newInfected:2484 | freeEncounterSpot:2490 | wakeNest:2496 | touchFungus:2515 | noticeCrib:2519 | inspectCrib:2529 | warnHorde:2535 | resumeEncounterWarning:2542 | waveSpots:2546 | updateHordes:2556 | waitWithWatch:2613 | armWatch:2636 | updateAtmosphere:2646 | listenAtDoor:2707 | sceneProblem:2727 | revealLedgerCache:2732 | resolveScene:2738 | dispatchProblem:2764 | sendDispatch:2773 | readDispatchReport:2780 | settleDispatch:2788 | openingOccupied:2820 | climbThrough:2835 | breachProblem:2853 | breach:2863 | door:2902 | barricade:2933 | unboard:2949 | removeBarrier:2960 | minutesToRain:2972 | sight:3001 | canSee:3008 | drainLight:3017 | useTap:3026 | useGenerator:3046 | updateUtilities:3066 | fireBatch:3099 | startFireBatch:3106 | collectFireBatch:3122 | mushroomProblem:3165 | harvestMushroom:3172 | updateFungalAlert:3187 | readFieldNote:3203 | wildProblem:3223 | useWild:3245 | sow:3280 | waterGarden:3290 | gardenYield:3298 | harvestGarden:3304 | growGarden:3322 | updateOutdoor:3334 | catchUpArea:3345 | evaAtShelter:3382 | toggleGardenHelp:3387 | tendShelterGarden:3396 | restOnSeat:3418 | dismantleFurniture:3429 | contextual:3439 | recruit:3496 | threats:3506 | damageFactor:3510 | aimChance:3517 | inAttackRange:3522 | closestInReach:3526 | attackTarget:3537 | touchAttackTarget:3543 | weaponProblem:3558 | endPursuit:3564 | endWindup:3570 | faceTowards:3575 | carriedSupply:3581 | defeat:3593 | attack:3610 | shove:3675 | updateGrab:3706 | pinnedBite:3720 | tryGrab:3733 | releaseGrab:3744 | bite:3754 | hurt:3767 | move:3813 | follow:3850 | walkTo:3876 | target:3888 | approach:3895 | updatePlayer:3911 | canTargetEva:3998 | leaveTrack:4006 | nearbyTrack:4021 | inspectTrack:4034 | updateEnemies:4047 | updateNpc:4186 | explore:4209 | updateExposure:4220 | updateNeeds:4233 | tick:4271 | updateDoorLure:4336 | breakLeg:4363 | healFracture:4371 | updateSickness:4380 | freeSpot:4403 | unstick:4416 | startSleep:4433 | fastSleep:4443 | sleep:4469 | moodles:4476 | snapshotPlayer:4500 | snapshotZone:4504 | snapshotRun:4513 | zoneShape:4535 | migrate:4553 | restore:4559

## game/view.js (3133 lines)
resize:26 | updateCamera:37 | poly:60 | line:69 | shadow:79 | box:87 | tint:95 | prepare:101 | bloodPool:166 | microDetail:171 | tileArt:222 | tendril:288 | tile:302 | glowSprite:320 | glow:337 | wall:347 | paintWall:374 | gardenTree:407 | paintFurniture:451 | drawFurniture:730 | campfireSmoke:750 | prop:770 | roof:1351 | roofArt:1373 | roofCoversPlayer:1424 | marker:1432 | survivorPalette:1478 | actorFrame:1490 | drawHeldWeapon:1699 | weaponIcon:1728 | drawZombieSprite:1748 | pickPlainInfected:1810 | recolouredAtlas:1826 | characterFor:1855 | charImage:1871 | restPoseFor:1880 | occluded:1897 | drawPropSprite:1906 | drawRestPose:1917 | drawCharacter:1943 | microActor:2000 | equipmentPortrait:2063 | deathFall:2079 | actor:2085 | beamReach:2262 | flashlightBeam:2272 | warmBeamSprite:2292 | warmFlashlight:2315 | windowGlow:2341 | weatherEffects:2365 | drawDestination:2401 | chunkSignature:2428 | buildChunk:2436 | groundLayer:2464 | dimAround:2481 | afterlifePixels:2519 | afterlifePortrait:2546 | renderAfterlife:2558 | render:2706 | locate:3025 | mapFit:3045 | mapPoint:3050 | minimapLayer:3058 | minimap:3077

## game/game.js (2794 lines)
read:66 | write:70 | backUp:74 | save:83 | clearStick:104 | resetInput:111 | updateDisplayMode:124 | toggleFullscreen:136 | activate:161 | setNavigation:182 | opening:189 | startLesson:203 | endLesson:216 | updateLesson:230 | startAfterlife:254 | deathSummary:264 | skipAfterlife:275 | endAfterlife:281 | afterlifeAction:288 | confirmNewRun:292 | start:297 | traitsReady:326 | startStory:336 | startRecommended:345 | showStartDetail:362 | savedAssists:380 | assistsOn:387 | difficultyPanel:392 | applyDifficulty:413 | rememberSetup:434 | worldRulesEditor:440 | applyWorldRules:458 | importSummary:475 | continueLabel:486 | resumeSaved:494 | aiChat:513 | show:523 | close:537 | menu:550 | titleScreen:560 | wakeSound:579 | cue:592 | syncSound:604 | objectives:613 | objectiveHtml:628 | skillsHtml:632 | conditions:644 | nearbyObjects:664 | guidedBat:679 | interactionLabel:685 | canTalk:697 | setHtml:703 | updateHud:709 | help:843 | landmarks:853 | map:863 | savePinForm:913 | itemIcon:924 | weaponCondition:929 | itemDescription:935 | matches:965 | inventoryItems:975 | nearbyItems:998 | updateInventoryLists:1019 | bag:1061 | useBelt:1099 | updateBelt:1106 | beltPanel:1128 | gear:1142 | survivorFields:1197 | survivorProfile:1206 | showTraitPoints:1215 | updateSurvivorPreview:1223 | setSetupSurvivor:1231 | editSurvivor:1241 | crafting:1255 | health:1276 | dailySummary:1306 | diary:1319 | dispatchStatus:1350 | fieldLedger:1365 | ledgerEntry:1404 | ledgerReport:1410 | ledgerPanel:1419 | playtestReport:1455 | copyPlaytest:1499 | knownStory:1512 | storyText:1517 | outbreakLog:1521 | storyEntry:1530 | supplyRun:1539 | gardenStatus:1567 | gardenProject:1576 | waterProject:1596 | utilities:1617 | releases:1636 | research:1643 | npcPanel:1651 | gardenPanel:1668 | stationPanel:1692 | objectPanel:1742 | interact:1927 | interactions:1936 | nearbyAction:1953 | strike:1990 | quickUse:1998 | pause:2005 | visualAtmosphere:2015 | atmospherePanel:2019 | applyAtmosphere:2031 | exportSave:2044 | refreshPanel:2051 | bagChanged:2059 | changeInventory:2069 | bindTap:2434 | updateStick:2507 | shoveOrBrake:2535 | frame:2658
