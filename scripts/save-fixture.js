// Saves one gzipped save per mode from a game folder, for tests/fixtures (save-systems: keep a real save per shipped version).
// Usage: node scripts/save-fixture.js <game-dir> <label> <modes...>   e.g. node scripts/save-fixture.js ../old-version v0.34 survival
// Deterministic: fixed Math.random and Date.now, 300 ticks walking east from the shelter.
"use strict";
const fs=require("fs"),vm=require("vm"),path=require("path");
const [dir,label,...modes]=process.argv.slice(2), out=path.join(__dirname,"..","tests","fixtures"), zlib=require("zlib");
const html=fs.readFileSync(path.join(dir,"index.html"),"utf8");
const files=[...html.matchAll(/<script src="([a-z-]+)\.js/g)].map(m=>m[1]).filter(f=>f!=="view"&&f!=="game");
const pascal=f=>f.split("-").map(w=>w[0].toUpperCase()+w.slice(1)).join("");
let src="";for(const f of files)src+=fs.readFileSync(path.join(dir,f+".js"),"utf8").replace(/^"use strict";/,"")+`\n;globalThis.${pascal(f)}=${pascal(f)};\n`;
let seed=7;const random=()=>(seed=seed*16807%2147483647)/2147483647;
const c={console,Math:Object.assign(Object.create(Math),{random}),Date:{now:()=>1767225600000},JSON,structuredClone};c.globalThis=c.window=c;vm.createContext(c);vm.runInContext(src,c);
for(const mode of modes){const s=c.Sim.createControl(mode,"carer","shelter");for(let i=0;i<300;i++)c.Sim.tick(s,.05,{x:1,y:0,run:false});
  const text=JSON.stringify(c.Sim.snapshot(s));const file=path.join(out,label+"-"+mode+".json.gz");fs.writeFileSync(file,zlib.gzipSync(text,{level:9}));console.log(path.relative(process.cwd(),file),(fs.statSync(file).size/1024).toFixed(0)+" KB");}
