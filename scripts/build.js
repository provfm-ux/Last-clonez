// Gera dist/ pronto a publicar (Netlify, Cloudflare, GitHub Pages): copia game/ e cria dist/single.html (ficheiro unico).
"use strict";
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, ".."), game = path.join(root, "game"), dist = path.join(root, "dist");
fs.rmSync(dist, {recursive: true, force: true}); fs.mkdirSync(dist, {recursive: true});
for (const f of fs.readdirSync(game)) fs.copyFileSync(path.join(game, f), path.join(dist, f));
let html = fs.readFileSync(path.join(game, "index.html"), "utf8");
html = html.replace(/<link rel="stylesheet" href="style\.css[^"]*"\s*\/?>/, () => "<style>\n" + fs.readFileSync(path.join(game, "style.css"), "utf8") + "\n</style>");
const names = [...html.matchAll(/<script src="([a-z-]+)\.js[^"]*"[^>]*><\/script>\s*/g)].map(m => m[1]);
html = html.replace(/<script src="[a-z-]+\.js[^"]*"[^>]*><\/script>\s*/g, "");
const blocks = names.map(n => { const js = fs.readFileSync(path.join(game, n + ".js"), "utf8"); if (js.includes("</script")) throw new Error(n + ".js contains </script"); return "<script>\n" + js + "\n</script>\n"; });
html = html.replace("</body>", () => blocks.join("") + "</body>");
const icon = "data:image/svg+xml;base64," + fs.readFileSync(path.join(game, "icon.svg")).toString("base64");
html = html.replace(/(<link rel="icon"[^>]*href=")icon\.svg(")/, (m, a, b) => a + icon + b);
const atlas = "data:image/png;base64," + fs.readFileSync(path.join(game, "micro-zombies.png")).toString("base64");
html = html.replace(/(<link id="micro-zombie-atlas"[^>]*href=")micro-zombies\.png(")/, (_, prefix, suffix) => prefix + atlas + suffix);
fs.writeFileSync(path.join(dist, "single.html"), html);
console.log("dist/ ready: " + fs.readdirSync(dist).length + " files, single.html " + Math.round(html.length / 1024) + " KB");
