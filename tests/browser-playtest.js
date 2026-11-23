"use strict";

// Run against a locally served game directory with a separately installed Playwright.
const assert = require("node:assert/strict");
const path = require("node:path");
const [url, playwrightPath, executablePath] = process.argv.slice(2);
if (!url || !playwrightPath) {
  console.error("Usage: node tests/browser-playtest.js <game URL> <Playwright module path> [Chromium executable]");
  process.exit(1);
}
const {chromium, devices} = require(path.resolve(playwrightPath));
const saveKey = "last-shelter-control-save-v1";

async function playtest(browser, device) {
  const mobile = device === "mobile";
  const page = await browser.newPage(mobile ? devices["Pixel 7"] : {viewport:{width:1440,height:900}});
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) {
      errors.push(response.status() + " " + response.url());
    }
  });
  const byId = id => page.locator("#" + id);
  const saved = (key = saveKey) => page.evaluate(key => localStorage.getItem(key), key);
  try {
    await page.goto(url);
    await byId("recommended-btn").click();
    await byId("hero").waitFor({state:"hidden"});
    await byId(mobile ? "touch-use-label" : "context-label").getByText("Take bat", {exact:true}).waitFor();
    if (mobile) await byId("touch-use").tap();
    else await page.keyboard.press("f");
    await byId("guide-hint").getByText("Open Inventory and equip the bat.", {exact:true}).waitFor();

    if (mobile) await byId("pause-btn").tap();
    else await page.keyboard.press("Escape");
    await byId("dialog-title").getByText("Paused", {exact:true}).waitFor();
    await page.getByRole("button", {name:"Resume",exact:true}).click();
    await byId("map-btn").click();
    await byId("dialog-title").getByText("Cold Vale · Map", {exact:true}).waitFor();
    await byId("close-dialog").click();
    await byId("sound-btn").click();
    assert.equal(await byId("sound-btn").getAttribute("aria-pressed"), "false");
    await byId("sound-btn").click();

    await byId("pause-btn").click();
    await page.getByRole("button", {name:"Save and exit",exact:true}).click();
    await byId("hero").waitFor();
    const original = await saved();
    assert.ok(original, "A save is available before testing replacements");
    await byId("advanced-start").evaluate(element => { element.open = true; });
    for (const id of ["recommended-btn", "longhaul-btn", "start-btn"]) {
      let warned = false;
      page.once("dialog", async dialog => {
        warned = dialog.type() === "confirm";
        await dialog.dismiss();
      });
      await byId(id).click();
      assert.ok(warned, id + " must confirm before replacing a save");
      assert.equal(await saved(), original);
      assert.ok(await byId("hero").isVisible());
    }
    if (!mobile) {
      await byId("world-seed").fill("271828");
      page.once("dialog", dialog => dialog.accept());
      await byId("start-btn").click();
      await byId("hero").waitFor({state:"hidden"});
      assert.equal(JSON.parse(await saved()).seed, 271828);
      assert.equal(await saved(saveKey + "-previous"), original);
    }
    await page.reload();
    await byId("continue-btn").click();
    await byId("hero").waitFor({state:"hidden"});
    assert.deepEqual(errors, []);
    console.log(device + ": onboarding, pause, map, mute, save protection and Continue OK");
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({executablePath});
  try {
    await playtest(browser, "desktop");
    await playtest(browser, "mobile");
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
