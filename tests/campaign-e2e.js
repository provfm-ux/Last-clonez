// End-to-end campaign run in the sim (days 7 to 40): real travel between regions, save and load after every crossing,
// every new challenge, the optional caches, the fortress and the epilogue. Usage: node tests/campaign-e2e.js
"use strict";
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.resolve(__dirname,'..','game');const html=fs.readFileSync(dir+'/index.html','utf8');
const files=[...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m=>m[1]).filter(f=>f!=='view'&&f!=='game');
const pascal=f=>f.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('');
let src='';for(const f of files)src+=fs.readFileSync(dir+'/'+f+'.js','utf8').replace(/^"use strict";/,'')+`\n;globalThis.${pascal(f)}=${pascal(f)};\n`;
const ctx={console,Math,Date,JSON,structuredClone};ctx.globalThis=ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const {Sim,World,Data}=ctx;
let s=Sim.createControl('campaign','carer','shelter');
const fails=[];const ok=(n,c,d='')=>{console.log((c?'PASS ':'FAIL ')+n+(d?' ['+d+']':''));if(!c)fails.push(n)};
const save=()=>{s=Sim.restore(JSON.parse(JSON.stringify(Sim.snapshot(s))));};
const go=(to)=>{const ex=s.world.objects.find(o=>o.id==='exit-'+to);if(!ex)return 'no exit-'+to+' in '+s.world.region;
  for(const r of [.6,.9,1.2])for(let a=0;a<16;a++){const p={x:ex.x+Math.cos(a*Math.PI/8)*r,y:ex.y+Math.sin(a*Math.PI/8)*r};if(World.clear(s.world,p.x,p.y,.18)){Object.assign(s.player,p);if(Sim.reachableObject(s,ex)){a=99;r;break;}}}
  const n=Sim.travel(s,ex);if(!n)return 'blocked: '+s.messages.at(-1)?.text;s=n;save();Sim.tick(s,.033,{x:0,y:0});return '';};
const route=(...hops)=>{for(const h of hops){const e=go(h);if(e)return e;}return '';};
const at=(o)=>{for(const r of [0,.6,.9])for(let a=0;a<16;a++){const p={x:o.x+Math.cos(a*Math.PI/8)*r,y:o.y+Math.sin(a*Math.PI/8)*r};if(World.clear(s.world,p.x,p.y,.18)){Object.assign(s.player,p);if(Sim.reachableObject(s,o))return true;}}return false;};
const day=(d,h=9)=>{Sim.testJump(s,d,{},{anyMode:true});s.minutes=(d-1)*1440+h*60;s.player.hp=100;s.player.hunger=90;s.player.hydration=90;s.player.fatigue=10;Sim.tick(s,.033,{x:0,y:0});};
const calm=()=>{s.player.bag=s.player.bag.filter(i=>['foundrymaul','violin','flashlight','battery','fortressmap','harpoon','rowboat','torch'].includes(i.id));s.world.enemies=s.world.enemies.filter(z=>z.stats.boss);};
const done=id=>s.campaign.completed.includes(id);
// stories before day 8 are covered by other tests
s.campaign.completed.push('coldvale.houses','cinema.statue','pineridge.two-nights','eva.death','ironworks.barricade');s.campaign.clues=2;
s.player.bag.push({id:'foundrymaul',qty:1,condition:100,born:0,uid:'maul'});
// day 7 fuel optional in town
day(7);let o=s.world.objects.find(x=>x.id==='opt-fuel');ok('day7 petrol cache active',o&&o.active);calm();at(o);ok('day7 petrol emptied',Sim.collectAll(s,o)>0&&s.campaign.opt.includes('opt.fuel'));save();
// day 8 fathill
day(8,8);let e=go('coast');ok('day8 coast reachable',!e,e);
const woman=()=>s.world.enemies.find(z=>z.kind==='pierwoman'),david=()=>s.world.enemies.find(z=>z.kind==='david');
// kill infected in her sight via violin calls
let kills=0;for(let i=0;i<40&&woman().guard;i++){s.violinCall=0;const w=woman();for(let r=4;r<9;r++)for(let a=0;a<6.3;a+=.3){const p={x:w.x+Math.cos(a)*r,y:w.y+Math.sin(a)*r};if(World.clear(s.world,p.x,p.y,.3)&&Sim.lineOfSight(s,w,p)){Object.assign(s.player,p);a=9;r=99;}}
  Sim.tick(s,.033,{x:0,y:0});for(const z of s.world.enemies.filter(z=>z.origin==='violin'&&z.hp>0)){z.hp=1;Object.assign(s.player,{x:z.x-.8,y:z.y});if(!World.clear(s.world,s.player.x,s.player.y,.18))continue;s.player.cooldown=0;s.player.stamina=100;s.player.hp=100;if(Sim.attack(s,z)&&z.hp<=0)kills++;}}
ok('fathill violin horde gives fear and drops the coat',!woman().guard&&s.campaign.fathill.coat,'fear '+s.campaign.fathill.fear+' kills '+kills);
save();
// David: guard damage + shove + violin
const d=()=>david();let dv=d();s.player.bag.push({id:'violin',qty:1,condition:100,born:0});
for(let i=0;i<60&&!d().guardBroken&&d().guard;i++){dv=d();Object.assign(s.player,{x:dv.x-.9,y:dv.y});if(!World.clear(s.world,s.player.x,s.player.y,.18))Object.assign(s.player,{x:dv.x+.9,y:dv.y});s.player.cooldown=0;s.player.stamina=100;s.player.hp=100;s.player.weapon='foundrymaul';s.player.weaponUid='maul';Sim.attack(s,dv);}
dv=d();s.player.cooldown=0;s.player.stamina=100;Sim.shove(s);ok('david vest off',!d().guard,'broken '+d().guardBroken+' guard '+d().guard);
Sim.use(s,s.player.bag.findIndex(i=>i.id==='violin'));
for(let i=0;i<40&&d().hp>0;i++){dv=d();Object.assign(s.player,{x:dv.x-.9,y:dv.y});s.player.cooldown=0;s.player.stamina=100;s.player.hp=100;Sim.attack(s,dv);}
ok('fathill done, clue 3',done('fathill.bosses')&&s.campaign.clues===3,'clues '+s.campaign.clues);save();
e=go('coldvale');ok('back home from coast',!e,e);
// day 9 clinic optional
day(9);o=s.world.objects.find(x=>x.id==='opt-clinic');calm();at(o);ok('day9 clinic emptied',o.active&&Sim.collectAll(s,o)>0);save();
// day 10 westfields
day(10);e=go('fields');ok('day10 fields',!e,e);calm();o=s.world.objects.find(x=>x.id==='westfields-ledger');at(o);for(const z of s.world.enemies)z.alert=0;ok('westfields ledger',Sim.readFieldsLedger(s,o)&&done('westfields.stealth')&&s.campaign.clues===4);save();e=go('coldvale');ok('home',!e,e);
// day 11 market (weekday?)
day(11,10);o=s.world.objects.find(x=>x.id==='opt-market');ok('day11 market open (weekday 10:00)',o.active,Data.campaignTips?'' :'');calm();at(o);Sim.collectAll(s,o);
// day 12 grotto
day(12);s.player.bag.push({id:'flashlight',qty:1,condition:100,born:0,uid:'fl',charge:100},{id:'battery',qty:3,condition:100,born:0});s.player.lightUid='fl';
e=route('ridge','cavern');ok('day12 cavern',!e,e);calm();o=s.world.objects.find(x=>x.id==='grotto-plate');at(o);Sim.readGrottoPlate(s,o);e=go('ridge');
ok('grotto done clue 5',done('cindergrotto.battery')&&s.campaign.clues===5,'clues '+s.campaign.clues+' '+e);e=go('coldvale');
// day 13 farm
day(13);e=go('fields');calm();o=s.world.objects.find(x=>x.id==='opt-farm');ok('day13 farm cache',o&&o.active&&(at(o),Sim.collectAll(s,o)>0),e);save();
// day 15 reservoir amigo1 + viragem
day(15);e=go('reservoir');ok('day15 reservoir from fields',!e,e);
let vic=s.world.enemies.find(z=>z.kind==='vic');calm();
o=s.world.objects.find(x=>x.id==='vic-diary');at(o);ok('viragem diary',Sim.readVicDiary(s,o)&&done('viragem.zero'));
s.player.weapon='foundrymaul';s.player.weaponUid='maul';
for(let i=0;i<30&&!vic.guard;i++){vic=s.world.enemies.find(z=>z.kind==='vic');Object.assign(s.player,{x:vic.x-.9,y:vic.y});if(!World.clear(s.world,s.player.x,s.player.y,.18))Object.assign(s.player,{x:vic.x+.9,y:vic.y});s.player.cooldown=0;s.player.stamina=100;s.player.hp=100;Sim.attack(s,vic);}
ok('vic helmet locks at half',vic.guard&&vic.hp===75,vic.hp);save();vic=s.world.enemies.find(z=>z.kind==='vic');
ok('vic still locked after save/load',vic.guard&&vic.hp===75);
o=s.world.objects.find(x=>x.id==='ai-terminal');at(o);ok('terminal opens',Sim.useAiTerminal(s,o));
for(const t of ['a','b','c','d'])Sim.aiSend(s,t,1000);Sim.aiSend(s,'stand down and save your tokens',2000);
ok('amigo1 done, map, clues still 5',done('amigo1.lockdown-chat')&&Sim.quantity(s.player.bag,'fortressmap')===1&&s.campaign.clues===5);save();
e=route('fields','coldvale');ok('home from reservoir',!e,e);
// revisit fields (regionStates) and reservoir after
day(16);e=route('fields','reservoir');ok('revisit reservoir day16',!e,e);ok('vic stays dead after revisit',!s.world.enemies.some(z=>z.kind==='vic'&&z.hp>0));e=route('fields','coldvale');
// day 21 marina should be closed (odd day)
day(21);e=go('coast');ok('day21 coast closed by tide',!!e,e);
day(22);o=s.world.objects.find(x=>x.id==='opt-school');ok('day22 school cache active',o.active);
const door=s.world.objects.find(x=>x.id===s.world.buildings.find(b=>b.id===o.building).door.id);ok('school door locked',door.locked);
calm();at(o);ok('school cache',Sim.collectAll(s,o)>0);
e=go('coast');ok('day22 coast open',!e,e);calm();o=s.world.objects.find(x=>x.id==='opt-marina');ok('marina cache open, rowboat',o.active&&(at(o),Sim.collectAll(s,o)>0)&&Sim.quantity(s.player.bag,'rowboat')===1);
e=go('coldvale');
day(23);ok('day23 tip does not send to the closed Ironworks',!/freight depot/.test(Sim.campaignTip(s)),Sim.campaignTip(s));e=go('ironworks');ok('day23 (Saturday) Ironworks closed',/weekends/.test(e),e);
day(24);e=go('fields');calm();o=s.world.objects.find(x=>x.id==='opt-harvest');ok('day24 harvest',o&&o.active&&(at(o),Sim.collectAll(s,o)>0),e);e=go('coldvale');
// fortress
day(24);e=route('ridge','fortress');ok('day24 fortress closed',!!e,e);if(!e)go('ridge');
day(25);if(s.world.region!=='ridge'){e=go('ridge');}
e=go('fortress');ok('day25 fortress open with 5 clues',!e,e);
let pip=s.world.enemies.find(z=>z.kind==='pip');calm();pip=s.world.enemies.find(z=>z.kind==='pip');
const armoury=s.world.objects.find(x=>x.name==='Armoury');at(armoury);Sim.collectAll(s,armoury);ok('harpoon from armoury',Sim.quantity(s.player.bag,'harpoon')===1);
for(let i=0;i<80&&pip.hp>0;i++){pip=s.world.enemies.find(z=>z.kind==='pip');const w=pip.hp<100&&!pip.guard?'harpoon':'foundrymaul';const it=s.player.bag.find(x=>x.id===w);s.player.weapon=w;s.player.weaponUid=it.uid;
  const r=w==='harpoon'?2.2:.9;Object.assign(s.player,{x:pip.x-r,y:pip.y});if(!World.clear(s.world,s.player.x,s.player.y,.18))Object.assign(s.player,{x:pip.x+r,y:pip.y});s.player.cooldown=0;s.player.stamina=100;s.player.hp=100;Sim.attack(s,pip);}
ok('pip dead, final done, epilogue pending',pip.hp<=0&&done('fortress.last-boss')&&s.campaign.epilogue==='pending');
save();ok('epilogue state survives save',s.campaign.epilogue==='pending');
day(31);ok('day 31+ still playing in the fortress',s.mode==='play'&&s.world.region==='fortress',s.mode);
day(40);Sim.tick(s,.5,{x:0,y:0});ok('day 40 fine',s.mode==='play');
ok('tip after the end talks about the fortress, not a next step',/fortress is yours/.test(Sim.campaignTip(s))&&!/next story step/.test(Sim.campaignTip(s)),Sim.campaignTip(s));
console.log(fails.length?fails.length+' FAIL':'ALL OK');
process.exitCode=fails.length?1:0;
