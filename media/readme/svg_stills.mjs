// QA helper: screenshot an animated SVG at given times (seconds).
//   node svg_stills.mjs <file.svg> <outPrefix> t1 t2 ...
// The SVG is inlined so its CSS animations can be paused and seeked.
import { readFileSync } from "node:fs";
import { chromium } from "../../node_modules/playwright/index.mjs";

const [svgPath, prefix, ...times] = process.argv.slice(2);
const svg = readFileSync(svgPath, "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0;background:#fff">${svg}</body>`);
const box = await page.locator("svg").first().boundingBox();
for (const t of times) {
    await page.evaluate((ms) => {
        for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; }
    }, Number(t) * 1000);
    await page.screenshot({ path: `${prefix}_${t}.png`, clip: box });
}
await browser.close();
