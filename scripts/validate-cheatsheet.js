#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractHeadings, reduceRawText, gfmId, applyUsedIds } from "./generate-chaptertocs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CHEATSHEET_PATH = path.resolve(REPO_ROOT, "docs/_resources/cheatsheet.md");
const CHEATSHEET_INCLUDE = path.resolve(REPO_ROOT, "docs/_includes/chaptertoc/cheatsheet.html");
const DOCS_DIR = path.resolve(REPO_ROOT, "docs");

// The cheatsheet page declares its depth limit on the include tag.
const CHEATSHEET_DEPTH = 3;

let exitCode = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    exitCode = 1;
}

function warn(msg) {
    console.warn(`WARNING: ${msg}`);
}

if (!fs.existsSync(CHEATSHEET_PATH)) {
    fail(`Cheatsheet not found at ${CHEATSHEET_PATH}`);
    process.exit(1);
}

const content = fs.readFileSync(CHEATSHEET_PATH, "utf-8");
const lines = content.split("\n");

// The cheatsheet TOC itself must be generated (no hand-written lists anymore).
if (!/{%-?\s*include\s+chaptertoc\/cheatsheet\.html\s+(?:[^%]*depth=\d+)?[^%]*%}/.test(content)) {
    fail("Cheatsheet TOC must be the generated {% include chaptertoc/cheatsheet.html %} tag");
} else if (!/depth=3/.test(content)) {
    fail("Cheatsheet include tag must declare depth=3");
}

// Compute the real kramdown-GFM ids for every heading, mirroring the generator.
const flat = applyUsedIds(
    extractHeadings(content).map((e) => ({ ...e, id: gfmId(reduceRawText(e.text)) }))
);
const headingIds = new Set(flat.map((e) => e.id));
const expectedIds = new Set(flat.filter((e) => e.level <= CHEATSHEET_DEPTH).map((e) => e.id));

// Cross-check against the generated include when present (after a docs build).
if (fs.existsSync(CHEATSHEET_INCLUDE)) {
    const toc = fs.readFileSync(CHEATSHEET_INCLUDE, "utf-8");
    const tocHrefs = new Set(
        [...toc.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])
    );
    for (const id of tocHrefs) {
        if (!headingIds.has(id)) {
            fail(`Generated TOC link "#${id}" has no matching heading on the cheatsheet`);
        }
    }
    for (const id of expectedIds) {
        if (!tocHrefs.has(id)) {
            fail(`Heading "#${id}" is within depth ${CHEATSHEET_DEPTH} but missing from the generated TOC`);
        }
    }
} else {
    warn(
        "Generated cheatsheet TOC not found; run scripts/generate-chaptertocs.js " +
        "before building the docs to enable the anchor cross-check"
    );
}

// Build set of all existing docs pages (relative to docs/ without extension).
// Jekyll collections use _prefix directories that map to /prefix/ URLs.
const docFiles = new Set();
function walk(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Strip leading underscore for Jekyll collection directories
            const dirName = entry.name.replace(/^_/, "");
            walk(full, `${prefix}/${dirName}`);
        } else if (entry.name.endsWith(".md")) {
            const rel = `${prefix}/${entry.name.replace(/\.md$/, "")}`.replace(/^\//, "");
            docFiles.add(rel);
        }
    }
}
walk(DOCS_DIR, "");

// Validate relative_url references
const relUrlRe = /\{\{\s*"([^"]+)"\s*\|\s*relative_url\s*\}\}/g;
let relMatch;
while ((relMatch = relUrlRe.exec(content)) !== null) {
    const ref = relMatch[1];
    const refPath = ref.replace(/^\/?(.*?)(?:\/)?$/, "$1");
    // Match against discovered doc paths (stored without .md extension)
    const exists = docFiles.has(refPath) || docFiles.has(`${refPath}/index`);
    if (!exists) {
        fail(`Relative URL "${ref}" does not match any doc page`);
    }
}

if (exitCode === 0) {
    console.log("OK: cheatsheet validation passed");
}

process.exit(exitCode);