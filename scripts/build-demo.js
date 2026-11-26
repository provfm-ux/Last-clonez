// Builds the itch.io demo: dist-demo/index.html (single file, HTML5 game) and dist-demo/last-clonez-demo.zip.
// Usage: DEMO_EMAIL=you@example.com node scripts/build-demo.js   (optional: DEMO_URL=https://... for the end screen link)
"use strict";
const fs = require("fs"), path = require("path"), {execFileSync} = require("child_process");
const root = path.resolve(__dirname, ".."), out = path.join(root, "dist-demo");
const email = process.env.DEMO_EMAIL || "";
if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
  console.error("Set DEMO_EMAIL to the address that receives bug reports, e.g. DEMO_EMAIL=you@example.com npm run build:demo");
  process.exit(1);
}
const url = process.env.DEMO_URL || "";
if (url && !/^https:\/\/[^\s"<>]+$/.test(url)) { console.error("DEMO_URL must be an https:// link."); process.exit(1); }
execFileSync(process.execPath, [path.join(__dirname, "build.js")], {cwd: root, stdio: "inherit"});
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
const config = {email, version, fullGameUrl: url, pageUrl: url, limitSeconds: 1800};
let html = fs.readFileSync(path.join(root, "dist", "single.html"), "utf8");
const script = "<script>\nconst DEMO_CONFIG = " + JSON.stringify(config).replace(/</g, "\\u003c") + ";\n" +
  fs.readFileSync(path.join(root, "demo", "demo.js"), "utf8") + "\n</script>\n";
if (!html.includes("</body>")) throw new Error("single.html has no </body>");
html = html.replace("</body>", () => script + "</body>");
fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(out);
fs.writeFileSync(path.join(out, "index.html"), html);
try {
  execFileSync("zip", ["-j", "-q", "last-clonez-demo.zip", "index.html"], {cwd: out});
  console.log("dist-demo/last-clonez-demo.zip ready (" + Math.round(html.length / 1024) + " KB index.html). Upload it to itch.io as an HTML game.");
} catch { console.log("dist-demo/index.html ready. Zip it (index.html at the top level) and upload to itch.io as an HTML game."); }
