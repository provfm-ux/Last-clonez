"use strict";

const LegacyLevel = (() => {
  const width=64, height=64, start={x:8.5,y:40.5}, overview={x:28,y:29};
  const zones={
    wild:{name:"Woodland",short:"WOODLAND",color:"#394a32"},
    road:{name:"Street",short:"COLD VALE",color:"#424940"},
    path:{name:"Pavement",short:"PAVEMENT",color:"#657063"}
  };
  const names={home:"House",clinic:"Clinic",market:"Grocery store",workshop:"Workshop",police:"Police station",fuel:"Petrol station"};
  function seeded(seed) {
    let value=seed>>>0;
    const next=()=>{value=(value+0x6D2B79F5)|0;let n=Math.imul(value^value>>>15,1|value);n^=n+Math.imul(n^n>>>7,61|n);return ((n^n>>>14)>>>0)/4294967296;};
    next.state=()=>value; next.restore=n=>{value=n|0;};
    return next;
  }
  function create(seed) {
    const rng=seeded(seed), tiles=[], buildings=[], objects=[], worldZones={...zones};
    const pick=a=>a[Math.floor(rng()*a.length)];
    for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
      const road=(x>=27&&x<=31)||(y>=27&&y<=31);
      const pavement=!road&&((x>=25&&x<=33)||(y>=25&&y<=33));
      const t={x,y,zone:road?"road":pavement?"path":"wild",kind:"floor",surface:road?"asphalt":pavement?"path":"grass",solid:x===0||y===0||x===63||y===63,tint:rng(),marks:rng(),building:null};
      tiles.push(t);
    }
    const at=(x,y)=>tiles[y*width+x];
    const add=(x,y,kind,extra={})=>{
      const t=at(x,y),o={id:"o"+objects.length,x:x+.5,y:y+.5,zone:t.zone,building:t.building,kind,name:kind,tint:rng(),active:true,solid:true,...extra};
      objects.push(o);return o;
    };
    const slots=[
      {x:4,y:35,w:12,h:10,type:"home",base:true},
      {x:4,y:5,w:11,h:10,type:pick(["home","market"])},
      {x:17,y:5,w:8,h:10,type:"clinic"},
      {x:5,y:18,w:10,h:7,type:"home"},
      {x:17,y:18,w:8,h:7,type:"workshop"},
      {x:36,y:5,w:10,h:10,type:"market"},
      {x:49,y:5,w:10,h:11,type:"police"},
      {x:36,y:18,w:10,h:7,type:"home"},
      {x:49,y:19,w:10,h:6,type:"fuel"},
      {x:18,y:36,w:7,h:10,type:"home"},
      {x:36,y:36,w:10,h:10,type:"workshop"},
      {x:49,y:36,w:10,h:10,type:"home"},
      {x:5,y:49,w:11,h:9,type:"home"},
      {x:36,y:50,w:10,h:9,type:"home"},
      {x:50,y:50,w:9,h:9,type:"home"}
    ];
    const pools={
      home:[["food",1],["water",1],["fresh",2],["cloth",2],["knife",1],["tape",1]],
      clinic:[["bandage",3],["disinfectant",2],["painkiller",2],["food",1],["water",2]],
      market:[["food",3],["fresh",3],["water",3],["backpack",1],["cloth",1]],
      workshop:[["wood",4],["nails",12],["scrap",4],["tape",2],["hammer",1],["axe",1],["part",1]],
      police:[["pistol",1],["ammo",14],["crowbar",1],["bandage",1],["part",1]],
      fuel:[["fuel",3],["water",2],["food",1],["scrap",2]]
    };
    function loot(type,guaranteed=[]) {
      return [...guaranteed,...pools[type].filter(()=>rng()<.66).map(([id,qty])=>({id,qty,condition:100,born:0}))];
    }
    for(const slot of slots) {
      const b={...slot,x:slot.x+(slot.base?0:Math.floor(rng()*2)),y:slot.y+(slot.base?0:Math.floor(rng()*2)),id:"b"+buildings.length,name:slot.base?"Your shelter":names[slot.type],color:pick(["#6d7867","#737564","#66786d","#7d7466"]),roof:pick(["#545c4e","#625a48","#555c55"])};
      buildings.push(b);
      worldZones[b.id]={name:b.name,short:b.name.toUpperCase(),color:b.color};
      for(let y=b.y;y<b.y+b.h;y++) for(let x=b.x;x<b.x+b.w;x++) {
        const t=at(x,y),outside=x===b.x||x===b.x+b.w-1||y===b.y||y===b.y+b.h-1;
        Object.assign(t,{building:b.id,zone:b.id,kind:outside?"wall":"floor",surface:"tile",solid:outside,outside,rear:x===b.x||y===b.y,wallAxis:y===b.y||y===b.y+b.h-1?"x":"y"});
      }
      const doorX=b.x+Math.floor(b.w/2),doorY=b.y+b.h-1;
      Object.assign(at(doorX,doorY),{kind:"door",solid:true});
      b.door=add(doorX,doorY,"door",{name:"Door",action:"door",open:false,hp:90,boards:0,solid:false});
      at(doorX,doorY).doorId=b.door.id;
      const windowX=b.x+b.w-1,windowY=b.y+Math.floor(b.h/2);
      Object.assign(at(windowX,windowY),{kind:"door",solid:true});
      const window=add(windowX,windowY,"window",{name:"Window",action:"door",open:false,hp:45,boards:0,solid:false});
      at(windowX,windowY).doorId=window.id;
      if(b.base) {
        add(6,37,"bed",{name:"Shelter bed",action:"bed"});
        add(7,40,"crate",{name:"Shelter crate",action:"loot",searched:true,loot:[{id:"wood",qty:4},{id:"nails",qty:12},{id:"scrap",qty:2},{id:"tape",qty:2}],storage:true});
        add(12,37,"counter",{name:"Workbench",action:"workbench"});
        add(12,40,"radio",{name:"Shelter radio",action:"radio"});
      } else {
        const x=b.x+2,y=b.y+2;
        add(x,y,b.type==="home"?"fridge":"shelf",{name:b.type==="home"?"Kitchen":names[b.type]+" · supplies",action:"loot",searched:false,loot:loot(b.type)});
        add(b.x+b.w-3,b.y+2,"locker",{name:"Cupboard",action:"loot",searched:false,loot:loot(b.type)});
        if(b.h>7) add(x,b.y+b.h-3,b.type==="clinic"?"bed":"counter",{name:b.type==="clinic"?"Examination table":"Furniture",action:"dismantle"});
        if(b.type==="workshop") {
          const first=objects.find(o=>o.building===b.id&&o.action==="loot");
          first.loot.push({id:"part",qty:1});
        }
        if(b.type==="police") objects.find(o=>o.building===b.id&&o.action==="loot").loot.push({id:"part",qty:1});
        if(b.type==="fuel") objects.find(o=>o.building===b.id&&o.action==="loot").loot.push({id:"fuel",qty:1});
      }
    }
    // Furniture can be removed later without changing structural walls.
    for(const t of tiles) {t.baseKind=t.kind;t.baseSolid=t.solid;}
    for(let i=0;i<150;i++) {
      const x=2+Math.floor(rng()*60),y=2+Math.floor(rng()*60),t=at(x,y);
      if(t.surface!=="grass"||t.building||Math.hypot(x-start.x,y-start.y)<8||objects.some(o=>Math.hypot(o.x-x-.5,o.y-y-.5)<1.5)) continue;
      add(x,y,"tree",{name:"Tree",action:"harvest",hp:55});
    }
    for(const [x,y] of [[22,30],[41,29],[29,48],[29,14]]) add(x,y,"car",{name:"Car boot",action:"loot",searched:false,loot:loot("fuel")});
    const clinic=buildings.find(b=>b.type==="clinic");
    const npc={id:"eva",name:"Eva",x:clinic.x+4.5,y:clinic.y+5.5,hp:80,face:1,path:[],moving:false,mode:"injured",flash:0,replan:0};
    return {seed,rng,width,height,tiles,buildings,objects,npc,start,base:buildings[0],zones:worldZones};
  }
  return {width,height,start,overview,zones,seeded,create};
})();
