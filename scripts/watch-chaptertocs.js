#!/usr/bin/env node

/**
 * Dev-mode companion to scripts/generate-chaptertocs.js.
 *
 * `jekyll serve --watch` already re-renders pages when a markdown file
 * changes, but the generated chapter TOC include files are only created at
 * startup. This watcher reruns the TOC generator whenever any docs markdown
 * file changes, so the affected include file is refreshed and Jekyll then
 * rebuilds the page with the up-to-date TOC — no dev-server restart needed.
 *
 * Only `.md` files under docs/ trigger a run (generated `.html` includes are
 * ignored), and regeneration is debounced and serialized. The generator
 * itself skips rewriting files whose content is unchanged, so Jekyll is not
 * forced into spurious rebuilds.
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const GENERATOR = path.join(__dirname, 'generate-chaptertocs.js');

const DEBOUNCE_MS = 250;

// Directories that never influence a page's own headings.
const SKIPPED_TOP = new Set(['_site', '_includes', '_layouts', '_data', '_sass', '.git']);

let timer = null;
let queued = false;
let running = false;

function regenerate(trigger) {
  running = true;
  console.log(`[watch-chaptertocs] change detected (${trigger}) — regenerating TOCs…`);
  const child = spawn(process.execPath, [GENERATOR], { stdio: 'inherit' });
  child.on('exit', (code) => {
    running = false;
    if (queued) {
      queued = false;
      schedule('queued change');
    }
  });
}

function schedule(trigger) {
  if (running) {
    queued = true; // rerun once the current generation finishes
    return;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    regenerate(trigger);
  }, DEBOUNCE_MS);
}

// `name` is already relative to DOCS_DIR (recursive watch semantics).
function relevant(name) {
  if (!name.endsWith('.md')) return false;
  const head = name.split(path.sep)[0];
  return !SKIPPED_TOP.has(head) && !head.startsWith('.');
}

try {
  fs.watch(DOCS_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const name = typeof filename === 'string' ? filename : filename.toString();
    if (relevant(name)) schedule(name);
  });
} catch (err) {
  console.error(`[watch-chaptertocs] failed to start watcher: ${err.message}`);
  process.exit(1);
}

console.log(`[watch-chaptertocs] watching ${DOCS_DIR} for markdown changes… (Ctrl+C to stop)`);