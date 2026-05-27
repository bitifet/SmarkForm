#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CHEATSHEET_PATH = path.resolve(REPO_ROOT, "docs/_resources/cheatsheet.md");
const DOCS_DIR = path.resolve(REPO_ROOT, "docs");

let exitCode = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    exitCode = 1;
}

if (!fs.existsSync(CHEATSHEET_PATH)) {
    fail(`Cheatsheet not found at ${CHEATSHEET_PATH}`);
    process.exit(1);
}

const content = fs.readFileSync(CHEATSHEET_PATH, "utf-8");
const lines = content.split("\n");

// Extract all markdown headings (## or ###)
const headings = [];
for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+)/);
    if (m) {
        headings.push({ level: m[1].length, text: m[2].replace(/`/g, "") });
    }
}

// Validate TOC anchors match actual headings
for (const line of lines) {
    const m = line.match(/\]\((#[\w-]+)\)/);
    if (!m) continue;
    const anchor = m[1];
    const matching = headings.some(h => {
        const generated = h.text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        return `#${generated}` === anchor;
    });
    if (!matching) {
        fail(`TOC anchor "${anchor}" has no matching heading`);
    }
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
