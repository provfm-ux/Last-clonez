// Gera docs/CODE_INDEX.md: um mapa "função:linha" de cada ficheiro do jogo, para os agentes procurarem com grep
// em vez de lerem ficheiros inteiros (sim.js e game.js têm milhares de linhas).
// Uso: node scripts/code-index.js            (escreve o índice)
//      node scripts/code-index.js --check    (falha se estiver desatualizado; usado no CI)
"use strict";
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, ".."), game = path.join(root, "game"), out = path.join(root, "docs", "CODE_INDEX.md");
const order = [...fs.readFileSync(path.join(game, "index.html"), "utf8").matchAll(/<script src="([a-z-]+)\.js/g)].map(m => m[1]);
const lines = ["# Code index (generated - do not edit; run `npm run index`)", "",
  "Use `grep -n \"name\" docs/CODE_INDEX.md` to find a function, then open only that line range of the file.", "",
  "Load order (index.html): " + order.join(" -> "), ""];
for (const name of order) {
  const text = fs.readFileSync(path.join(game, name + ".js"), "utf8").split("\n");
  lines.push(`## game/${name}.js (${text.length} lines)`);
  const found = [];
  text.forEach((line, i) => { const m = line.match(/^ {2,4}(?:async )?function ([A-Za-z0-9_$]+)\(/); if (m) found.push(`${m[1]}:${i + 1}`); });
  lines.push(found.length ? found.join(" | ") : "(no named functions)", "");
}
const body = lines.join("\n");
if (process.argv.includes("--check")) {
  const current = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  if (current !== body) { console.error("docs/CODE_INDEX.md is out of date. Run: npm run index"); process.exit(1); }
  console.log("code index up to date"); process.exit(0);
}
fs.writeFileSync(out, body); console.log("wrote docs/CODE_INDEX.md (" + body.length + " bytes)");
