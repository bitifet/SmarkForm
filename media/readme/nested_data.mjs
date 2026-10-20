// Capture docs/assets/readme/nested_data.gif from nested_data.html.
//
//   node nested_data.mjs            -> work/nested_data/frames/*.png + frames.txt
//   node nested_data.mjs --still    -> work/nested_data/still.png (layout check)
//
// A capture loop screenshots the page continuously while a scripted "user"
// fills the README form; every frame's real timestamp is recorded so ffmpeg can
// rebuild a constant-rate animation (build.sh).
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "../../node_modules/playwright/index.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "work", "nested_data");
const VW = 1120, VH = 620;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, locale: "en-US" });
await page.goto(pathToFileURL(join(HERE, "nested_data.html")).href);
await page.waitForFunction(() => window.READY === true);
await page.waitForTimeout(400);
mkdirSync(OUT, { recursive: true });

if (process.argv.includes("--still")) {
    await page.screenshot({ path: join(OUT, "still.png") });
    await browser.close();
    process.exit(0);
}

const FR = join(OUT, "frames");
rmSync(FR, { recursive: true, force: true });
mkdirSync(FR, { recursive: true });

// ---------------------------------------------------------------- capture
const frames = [];
let capturing = true;
const t0 = Date.now();
const loop = (async () => {
    while (capturing) {
        const f = join(FR, `${String(frames.length).padStart(5, "0")}.png`);
        await page.screenshot({ path: f });
        frames.push([f, (Date.now() - t0) / 1000]);
    }
})();

// ---------------------------------------------------------------- script
const sleep = (ms) => page.waitForTimeout(ms);

async function moveTo(locator) {
    const b = await locator.boundingBox();
    await page.evaluate(([x, y]) => window.moveCursor(x, y), [b.x + b.width * 0.5, b.y + b.height * 0.55]);
    await sleep(600);
    return b;
}
async function click(locator) {
    await moveTo(locator);
    await page.evaluate(() => window.clickCursor());
    await locator.click();
    await sleep(250);
}
async function type(locator, text, delay = 85) {
    await click(locator);
    await page.keyboard.type(text, { delay });
    await sleep(350);
}
const q = (sel, nth = 0) => page.locator(sel).nth(nth);
const group = (g) => page.locator("#school > ul > li").nth(g);
const student = (g, s) => group(g).locator("ul > li").nth(s);

await sleep(900);
await type(q('#school > input[name="name"]'), "Springfield Elementary", 55);

// group 1
await type(group(0).locator('input[name="tutor"]'), "Ms. Krabappel");
await type(student(0, 0).locator('input[name="name"]'), "Bart");
await type(student(0, 0).locator('input[name="math"]'), "4");
await type(student(0, 0).locator('input[name="science"]'), "3");

await click(group(0).getByText("Add student"));
await type(student(0, 1).locator('input[name="name"]'), "Lisa");
await type(student(0, 1).locator('input[name="math"]'), "10");
await type(student(0, 1).locator('input[name="science"]'), "9");

// group 2
await click(q('#school > button'));
await type(group(1).locator('input[name="tutor"]'), "Mr. Bergstrom");
await type(student(1, 0).locator('input[name="name"]'), "Milhouse");
await type(student(1, 0).locator('input[name="math"]'), "7");

// rest on the final state
await page.evaluate(() => window.moveCursor(innerWidth * 0.5, innerHeight * 0.93));
await sleep(3200);

capturing = false;
await loop;
await browser.close();

// ffmpeg concat list with real per-frame durations
let txt = "";
for (let i = 0; i < frames.length; i++) {
    const [f, t] = frames[i];
    const next = i + 1 < frames.length ? frames[i + 1][1] : t + 0.1;
    txt += `file '${f}'\nduration ${(next - t).toFixed(4)}\n`;
}
txt += `file '${frames[frames.length - 1][0]}'\n`;
writeFileSync(join(OUT, "frames.txt"), txt);
console.log(`${frames.length} frames, ${frames[frames.length - 1][1].toFixed(1)} s`);
