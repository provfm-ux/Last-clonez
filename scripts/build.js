// Gera dist/ pronto a publicar (Netlify, Cloudflare, GitHub Pages): copia game/ e cria dist/single.html (ficheiro unico).
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, ".."), game = path.join(root, "game"), dist = path.join(root, "dist");
fs.rmSync(dist, {recursive: true, force: true}); fs.mkdirSync(dist, {recursive: true});
fs.cpSync(game,dist,{recursive:true});
let html = fs.readFileSync(path.join(game, "index.html"), "utf8");
html = html.replace(/<link rel="stylesheet" href="style\.css[^"]*"\s*\/?>/, () => "<style>\n" + fs.readFileSync(path.join(game, "style.css"), "utf8") + "\n</style>");
const names = [...html.matchAll(/<script src="([a-z-]+)\.js[^"]*"[^>]*><\/script>\s*/g)].map(m => m[1]);
html = html.replace(/<script src="[a-z-]+\.js[^"]*"[^>]*><\/script>\s*/g, "");
const mime = {wav:"audio/wav",mp3:"audio/mpeg",ogg:"audio/ogg"};
const manifest = fs.readFileSync(path.join(game,"recordings.js"),"utf8");
const recordings = vm.runInNewContext(manifest+"\nRecordings");
const embedded = Object.fromEntries(Object.entries(recordings).map(([id,name]) => {
  const match = /^audio\/[a-z0-9-]+\.(wav|mp3|ogg)$/.exec(name);
  if (!match) throw new Error("Invalid recorded cue path for " + id);
  return [id,"data:"+mime[match[1]]+";base64,"+fs.readFileSync(path.join(game,name)).toString("base64")];
}));
const zombieEvents = JSON.parse(fs.readFileSync(path.join(game,"catalogo/eventos.json"),"utf8")).events;
function embedZombie(name,ext) {
  if (!new RegExp("^assets/audio/zombies/lcz_zombie_[0-9]{2}\\."+ext+"$").test(name)) {
    throw new Error("Invalid zombie cue path: " + name);
  }
  return "data:"+mime[ext]+";base64,"+fs.readFileSync(path.join(game,name)).toString("base64");
}
const standaloneEvents = Object.fromEntries(Object.entries(zombieEvents).map(([id,event]) => {
  if (!event.files_ogg.length || event.files_ogg.length !== event.files_mp3.length) throw new Error("Unpaired files for "+id);
  return [id,{files_ogg:event.files_ogg.map(name => embedZombie(name,"ogg")),
    files_mp3:event.files_mp3.map(name => embedZombie(name,"mp3"))}];
}));
const blocks = names.map(n => {
  const js = n === "recordings" ? "const Recordings = Object.freeze(" + JSON.stringify(embedded) + ");\nconst ZombieEventFiles = " + JSON.stringify(standaloneEvents) + ";" :
    fs.readFileSync(path.join(game,n+".js"),"utf8");
  if (js.includes("</script")) throw new Error(n+".js contains </script");
  return "<script>\n"+js+"\n</script>\n";
});
html = html.replace("</body>", () => blocks.join("") + "</body>");
const icon = "data:image/svg+xml;base64," + fs.readFileSync(path.join(game, "icon.svg")).toString("base64");
html = html.replace(/(<link rel="icon"[^>]*href=")icon\.svg(")/, (m, a, b) => a + icon + b);
const atlas = "data:image/png;base64," + fs.readFileSync(path.join(game, "micro-zombies.png")).toString("base64");
html = html.replace(/(<link id="micro-zombie-atlas"[^>]*href=")micro-zombies\.png(?:\?v=[^"]*)?(")/, (_, prefix, suffix) => prefix + atlas + suffix);
fs.writeFileSync(path.join(dist, "single.html"), html);
console.log("dist/ ready: " + fs.readdirSync(dist).length + " files, single.html " + Math.round(html.length / 1024) + " KB");
