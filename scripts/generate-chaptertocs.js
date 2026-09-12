#!/usr/bin/env node

/**
 * Generate per-page table-of-contents include files for the SmarkForm docs.
 *
 * Every markdown file under docs/ that carries a
 *   {% include chaptertoc/<slug>.html %}
 * tag gets a generated file at docs/_includes/chaptertoc/<slug>.html containing
 * that page's nested table of contents.
 *
 * Why a generator instead of a hand-written TOC (or a pure-Jekyll plugin)?
 *  - vim-markdown-toc GitLab mode guesses anchors that do NOT match the ids
 *    kramdown actually assigns (it drops whole runs of punctuation with no
 *    separators, it collapses `a & b` to "a--b", keeps underscores, keeps
 *    accented letters, keeps leading digits, &c). Hand-kept TOCs silently rot
 *    these links.
 *  - Pure Liquid cannot replicate kramdown's id algorithm (no regular
 *    expressions), and scanning page.content line-by-line is polluted by
 *    sampletab {% capture %} blocks that embed heading-looking text.
 *  - GitHub Pages forbids custom Jekyll plugins.
 *
 * So the TOC data is computed here (in Node, replicating the exact id
 * algorithm of kramdown-parser-gfm 1.1.0 — the parser Jekyll actually runs
 * under its default `input: GFM`) at build time, rendered into include files
 * that Jekyll then renders like any other Liquid include. The docs source
 * files are never touched and the generated files live in a dedicated,
 * git-ignored directory.
 *
 * Depth limit: a page may declare it, e.g. {% include chaptertoc/faq.html
 * depth=3 %} to list only h2+h3 headings. The generator reads that param from
 * the include tag and truncates the tree accordingly (default: depth 4).
 *
 * The rendered labels are delegated back to Jekyll's `markdownify` filter so
 * they always match what kramdown renders inside the actual heading (inline
 * code, smart quotes, entities, emphasis…).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_DIR = path.join(DOCS_DIR, '_includes', 'chaptertoc');

/**
 * HTML entities → their character, mirroring what kramdown's entity span
 * yields for `raw_text`. Must happen BEFORE the non-word strip, otherwise the
 * literal entity name ("amp", "nbsp", "#39", …) would survive into the id.
 */
const ENTITY_RE = /&(amp|lt|gt|quot|apos|nbsp|mdash|ndash|hellip|[#]\d+|[#][xX][0-9a-fA-F]+);/g;
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  nbsp: ' ', mdash: '\u2014', ndash: '\u2013', hellip: '\u2026',
};
function decodeEntities(str) {
  return str.replace(ENTITY_RE, (m, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X'
        ? parseInt(name.slice(2), 16)
        : parseInt(name.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[name] ?? m;
  });
}

/**
 * Reduce a heading's source markdown to the plain text kramdown's
 * `parse_header_contents`/`update_raw_text` would collect for `raw_text`:
 *  - codespans (`` `code` ``) contribute their content without the backticks
 *  - `*`/`**` emphasis markers are dropped (their inner text is kept)
 *  - markdown links `[text](url)` contribute only `text`
 *  - `_`/intraword underscores are literally kept (GFM `intraword_underscore`)
 *  - entities are decoded (see above)
 * Everything else (literal «», quotes, dashes, /, etc.) remains raw text and
 * is consumed later by the non-word strip — exactly like kramdown's
 * `update_raw_text` walk, which concatenates text/entity/quote chars verbatim.
 * The quirk/plain `#`-terminated headings are irrelevant here because trailing
 * hashes are non-word and die in generate_gfm_header_id either way.
 */
function reduceRawText(text) {
  let t = text
    .replace(/`([^`\n]+)`/g, '$1')            // codespans
    .replace(/\*\*([^*]+|\*\*)\*\*/g, '$1')  // **strong**
    .replace(/\*([^*\n]+)\*/g, '$1')          // *em*
    .replace(/\[([^\]\n]*)\]\([^)]*\)/g, '$1') // links
    .replace(/\\?([\\`*{}\[\]()#+\-.!_>~|])/g, (m) => m.length > 1 ? '' : m);
  t = decodeEntities(t);
  return t;
}

/**
 * Replicates `generate_gfm_header_id` from kramdown-parser-gfm 1.1.0
 * (`gfm.rb`), the algorithm Jekyll's `input: GFM` uses for every heading:
 *
 *   result = text.downcase
 *   result.gsub!(/[^\p{Word}\- \t]/, '')   # twice non-matching, no separator
 *   result.tr!(" \t", '-')
 *   + "-N" on duplicates (counter starts at -1, so first use is bare)
 *
 * Ruby `\p{Word}` == Alnum + Pc (letters, numbers, underscore), so Node's
 * equivalent is {L,M,N,Pc} — note this KEEPS underscores, leading digits and
 * accented letters (á, í, …), unlike kramdown's old non-GFM basic_generate_id.
 */
function gfmId(rawText) {
  let gen = rawText.toLowerCase();
  gen = gen.replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- \t]/gu, '');
  gen = gen.replace(/[ \t]/g, '-'); // tr!(" \t", '-') — per char, no collapsing
  return gen;
}

/**
 * Replicates kramdown's duplicate handling:
 *   @used_ids[gen_id] ||= 0 ; on repeat: gen_id += "-#{@used_ids[gen_id] += 1}"
 * i.e. first occurrence keeps the base id, then -1, -2, …
 */
function applyUsedIds(entries) {
  const seen = new Map();
  return entries.map((e) => {
    let id = e.id;
    if (seen.has(id)) {
      const n = seen.get(id) + 1;
      seen.set(id, n);
      id += '-' + n;
    } else {
      seen.set(id, 0);
    }
    return { ...e, id };
  });
}

const INCLUDE_TAG_RE = /{%-?\s*include\s+chaptertoc\/([\w.-]+\.html)([^%]*-?)\s*%}/;
const FENCE_RE = /^\s*```/;
const HEADING_RE = /^\s{0,3}(#{2,4})\s+(.+?)\s*$/;

const SKIPPED_DIRS = new Set(['_includes', '_layouts', '_data', '_sass', 'assets', 'node_modules']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '_site') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIPPED_DIRS.has(entry.name)) continue;
      walk(p, out);
    } else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/**
 * Extract the real chapter headings from a docs markdown file, skipping:
 *  - fenced code blocks
 *  - {% raw %} / {% capture %} / {% comment %} Liquid regions (sampletab
 *    captures embed heading-looking text that must NOT become TOC entries)
 *  - legacy vim-markdown-toc TOC blocks (transition support)
 *  - the <details>/<div class="chaptertoc"> wrapper itself
 *  - raw <pre>/<script>/<style> HTML blocks
 */
function extractHeadings(text) {
  const entries = [];
  const lines = text.split('\n');

  let inFence = false;
  let inRaw = false;
  let inCapture = false;
  let inComment = false;
  let inLegacyToc = false;
  let inChaptertoc = false;
  let inHtmlBlock = null; // 'pre' | 'script' | 'style' | null

  for (const line of lines) {
    if (inHtmlBlock) {
      if (new RegExp(`</${inHtmlBlock}>`).test(line)) inHtmlBlock = null;
      continue;
    }
    if (inFence) {
      if (FENCE_RE.test(line)) inFence = false;
      continue;
    }
    if (inRaw) {
      if (/{%-?\s*endraw\s*-?%}/.test(line)) inRaw = false;
      continue;
    }
    if (inCapture) {
      if (/{%-?\s*endcapture\s*-?%}/.test(line)) inCapture = false;
      continue;
    }
    if (inComment) {
      if (/{%-?\s*endcomment\s*-?%}/.test(line)) inComment = false;
      continue;
    }
    if (inLegacyToc) {
      if (/^<!--\s*vim-markdown-toc\s*-->/.test(line)) inLegacyToc = false;
      continue;
    }
    if (inChaptertoc) {
      if (/<\/details>|<\/div>/.test(line)) inChaptertoc = false;
      continue;
    }

    if (FENCE_RE.test(line)) { inFence = true; continue; }
    if (/{%-?\s*raw\s*-?%}/.test(line)) { inRaw = true; continue; }
    if (/{%-?\s*capture\b/.test(line)) { inCapture = true; continue; }
    if (/{%-?\s*comment\s*-?%}/.test(line)) { inComment = true; continue; }
    if (/^<!--\s*vim-markdown-toc\s+GitLab\s*-->/.test(line)) { inLegacyToc = true; continue; }
    if (/^\s*<(details|div)\s+class="chaptertoc/.test(line)) { inChaptertoc = true; continue; }
    if (/^\s*<(pre|script|style)\b/.test(line)) { inHtmlBlock = /^\s*<(\w+)\b/.exec(line)[1]; continue; }

    const m = HEADING_RE.exec(line);
    if (!m) continue;
    const text_ = m[2];
    if (/^{%|^{{/.test(text_)) continue; // Liquid tags at the start – not a real heading
    entries.push({ level: m[1].length, text: text_ });
  }

  return entries;
}

function buildTree(flat, maxDepth) {
  const root = { level: 1, children: [] };
  const stack = [{ node: root, level: 1 }];
  for (const e of flat) {
    if (typeof maxDepth === 'number' && e.level > maxDepth) continue;
    const node = { ...e, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= e.level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;
    // On level gaps (e.g. ## straight to ####) open synthetic levels as needed.
    let current = parent;
    for (let lvl = parent.level + 1; lvl < e.level; lvl++) {
      if (typeof maxDepth === 'number' && lvl > maxDepth) break;
      const synth = { level: lvl, children: [] };
      current.children.push(synth);
      stack.push({ node: synth, level: lvl });
      current = synth;
    }
    current.children.push(node);
    stack.push({ node, level: e.level });
  }
  return root;
}

function renderLi(node, refCount, out) {
  out.push('<li>');
  if (node.id) {
    const ref = `toc_l${refCount.value++}`;
    out.push(`{% capture ${ref} %}${node.text}{% endcapture %}`);
    out.push(
      `<a href="#${node.id}">{{ ${ref} | markdownify | strip | remove: "<p>" | remove: "</p>" }}</a>`
    );
  }
  if (node.children.length) {
    out.push('<ul>');
    for (const child of node.children) renderLi(child, refCount, out);
    out.push('</ul>');
  }
  out.push('</li>');
}

function renderInclude(rel, tree) {
  const out = [];
  out.push(`<!-- Generated by scripts/generate-chaptertocs.js from docs/${rel} — do not edit. -->`);
  if (tree.children.length) {
    out.push('<ul>');
    const refCount = { value: 0 };
    for (const child of tree.children) renderLi(child, refCount, out);
    out.push('</ul>');
  }
  return out.join('\n');
}

function main() {
  const files = walk(DOCS_DIR);
  const referenced = new Map(); // slug -> absolute file path

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const m = INCLUDE_TAG_RE.exec(text);
    if (m) referenced.set(m[1], file);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let written = 0;
  let warned = 0;
  const seenFiles = new Set();

  for (const [slug, file] of referenced) {
    const rel = path.relative(DOCS_DIR, file).split(path.sep).join('/');
    const text = fs.readFileSync(file, 'utf8');
    const tagMatch = INCLUDE_TAG_RE.exec(text);
    const depthMatch = /depth=(\d+)/.exec(tagMatch ? tagMatch[2] : '');
    const maxDepth = depthMatch ? parseInt(depthMatch[1], 10) : 4;
    const raw = extractHeadings(text);
    const flat = applyUsedIds(
      raw.map((e) => ({ ...e, id: gfmId(reduceRawText(e.text)) }))
    );
    for (const e of raw) {
      if (/{[{%]/.test(e.text)) {
        console.warn(`[generate-chaptertocs] WARNING: heading with Liquid tokens in ${rel}: "${e.text}"`);
        warned++;
      }
    }
    const tree = buildTree(flat, maxDepth);
    const content = renderInclude(rel, tree);
    const outFile = path.join(OUTPUT_DIR, slug);
    seenFiles.add(slug);
    fs.writeFileSync(outFile, content + '\n');
    written++;
    console.log(`[generate-chaptertocs] ${slug} <- ${rel} (${tree.children.length} top-level entries)`);
  }

  // Prune generated files whose page no longer references them.
  let pruned = 0;
  for (const entry of fs.readdirSync(OUTPUT_DIR)) {
    if (!seenFiles.has(entry)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, entry));
      pruned++;
    }
  }

  console.log(
    `[generate-chaptertocs] done: ${written} generated, ${pruned} pruned, ${warned} warnings.`
  );
}

export { gfmId, reduceRawText, extractHeadings, buildTree, applyUsedIds };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}