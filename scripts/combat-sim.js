// Combat balance simulator: 30 fights per scenario (1 or 3 or 5 walkers, 2 brutes) with a bat, three player policies.
// smart = shove when grabbed, passive = keep swinging, idle = do nothing while grabbed. Prints win rate, time, damage, grabs,
// bites, escapes and counters. Usage: [RADIUS=1.1] node scripts/combat-sim.js [smart|passive|idle] [seed]  (RADIUS 1.1 = caught by the group)
"use strict";
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.resolve(__dirname,'..','game');const html=fs.readFileSync(dir+'/index.html','utf8');
const files=[...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m=>m[1]).filter(f=>f!=='view'&&f!=='game');
const pascal=f=>f.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('');
let src='';for(const f of files)src+=fs.readFileSync(dir+'/'+f+'.js','utf8').replace(/^"use strict";/,'')+`\n;globalThis.${pascal(f)}=${pascal(f)};\n`;
let seed=Number(process.argv[3]||7);const random=()=>(seed=seed*16807%2147483647)/2147483647;
const ctx={console,Math:Object.assign(Object.create(Math),{random}),Date,JSON,structuredClone};ctx.globalThis=ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const {Sim,World,Data}=ctx;const N=Number(process.env.TRIALS||40);
const policy=process.argv[2]||'smart'; // smart: shove/attack when grabbed; passive: just attack; idle: do nothing when grabbed
const radius=Number(process.env.RADIUS||2.2);
function fight(n,kind,trial){
  const s=Sim.createControl('survival','carer','shelter');s.world.seed=trial;s.world.rng=ctx.Level.seeded(trial*7919+n*31);
  const p=s.player;p.bag.push({id:'bat',qty:1,condition:100,born:0,uid:'b'});p.weapon='bat';p.weaponUid='b';
  // open spot
  let spot=null;for(let y=10;y<60&&!spot;y++)for(let x=10;x<60&&!spot;x++){let ok=true;for(let dy=-3;dy<=3&&ok;dy++)for(let dx=-3;dx<=3&&ok;dx++)if(!World.clear(s.world,x+dx+.5,y+dy+.5,.4))ok=false;if(ok)spot={x:x+.5,y:y+.5};}
  Object.assign(p,spot);s.world.enemies=[];
  for(let i=0;i<n;i++){const a=i/n*6.28+trial;const z=World.infected(s.world,'f'+i,p.x+Math.cos(a)*radius,p.y+Math.sin(a)*radius,'walkers',Math.random);z.kind=kind;z.stats=Data.infected[kind];z.hp=z.stats.hp;z.alert=20;z.dormant=false;s.world.enemies.push(z);}
  let t=0,grabs=0,bites=0,counters=0,frees=0,wasG=false;const hp0=p.hp;
  const seenE=new WeakSet();
  while(t<90&&s.mode==='play'&&s.world.enemies.some(z=>z.hp>0)){
    const live=s.world.enemies.filter(z=>z.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
    const z=live[0];
    if(p.grabbed>0&&!wasG)grabs++;wasG=p.grabbed>0;
    if(p.grabbed>0&&policy==='smart'){ if(p.stamina>12&&p.cooldown<=0)Sim.shove(s); }
    else if(!(p.grabbed>0&&policy==='idle')&&p.cooldown<=0&&Sim.inAttackRange(s,z,1.4)){const e0=s.effects.length;Sim.attack(s,z);}
    const before=s.effects.length;
    Sim.tick(s,.05,{x:0,y:0});t+=.05;
    for(const e of s.effects){if(seenE.has(e))continue;seenE.add(e);if(/^BITTEN|^PINNED/.test(e.text))bites++;if(e.text==='COUNTER')counters++;if(e.text==='FREE')frees++;}
  }
  return {t,won:s.mode==='play'&&!s.world.enemies.some(z=>z.hp>0),dmg:hp0-p.hp,grabs,bites,counters,frees};
}
for(const [n,kind] of [[1,'walker'],[2,'walker'],[3,'walker'],[5,'walker'],[2,'brute']]){
  const R=[];for(let i=0;i<N;i++)R.push(fight(n,kind,i+1));
  const avg=k=>(R.reduce((a,r)=>a+(+r[k]),0)/R.length).toFixed(2);
  console.log(policy.padEnd(7),(n+' '+kind).padEnd(10),'win',avg('won'),'time',avg('t'),'dmg',avg('dmg'),'grabs',avg('grabs'),'bites',avg('bites'),'frees',avg('frees'),'counters',avg('counters'));
}
