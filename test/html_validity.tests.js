/**
 * HTML Validity Tests for Documentation Examples
 *
 * Validates that the htmlSource of every collected documentation example is
 * well-formed HTML. Two complementary checks are performed:
 *
 *   1. parse5 syntax errors – catches malformed tags, broken attribute syntax,
 *      unclosed tag delimiters, etc.  (parse5 follows the HTML5 parsing spec
 *      and emits parse-error events for spec-defined violations.)
 *
 *   2. Tag-balance check – counts opening vs. closing tags for a set of
 *      non-void block elements.  The HTML5 parser silently recovers from
 *      unclosed elements (no spec error is emitted), so we detect them
 *      separately with a simple count.  This catches bugs like a missing
 *      </div> on the outer form wrapper.
 *
 * Both checks are intentionally strict but narrowly scoped: they validate the
 * raw htmlSource fragment collected from the docs, not a full document (so
 * "missing doctype" etc. is never flagged).
 */

import { test, expect } from '@playwright/test';
import { parseFragment } from 'parse5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Load manifest
// ---------------------------------------------------------------------------
const manifestPath = path.join(__dirname, '.cache', 'docs_examples.json');
let examples = [];

try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    examples = JSON.parse(manifestContent);
} catch (error) {
    // Tests will be skipped if manifest is missing
    console.error('Failed to load examples manifest:', error.message);
    console.error('Make sure to run: node scripts/collect-docs-examples.js');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Non-void HTML elements for which we enforce tag-balance.
 * We only check elements where an unclosed tag would cause real layout/parsing
 * problems.  Void elements (input, br, hr, …) are intentionally excluded.
 *
 * Note: <li>, <p>, <dt>, <dd> are optional-close in HTML5, so we skip them
 * to avoid false positives from legitimate omitted close tags.
 */
const BALANCED_TAGS = [
    'div', 'form', 'fieldset',
    'ul', 'ol', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
    'details', 'summary',
    'script', 'template',
    'select', 'datalist',
];

/**
 * Parse5 error codes that are harmless / expected for HTML fragments and
 * should not cause a test failure.
 *
 * Currently none – all parse5 errors for fragments are treated as real issues.
 * Add entries here only when a pattern is confirmed intentional.
 */
const IGNORED_PARSE_ERRORS = new Set([
    // (none)
]);

/**
 * Validate a single HTML fragment.
 *
 * @param {string} html  Raw HTML string (fragment, not full document).
 * @returns {string[]}   Array of human-readable issue descriptions.
 *                       Empty array means the fragment is valid.
 */
function validateHtmlFragment(html) {
    const issues = [];

    // --- Check 1: parse5 syntax errors -----------------------------------
    const parseErrors = [];
    parseFragment(html, {
        onParseError(err) {
            if (!IGNORED_PARSE_ERRORS.has(err.code)) {
                parseErrors.push(
                    `parse5 error "${err.code}" at line ${err.startLine}, col ${err.startCol}`
                );
            }
        },
    });
    issues.push(...parseErrors);

    // --- Check 2: tag balance --------------------------------------------
    for (const tag of BALANCED_TAGS) {
        // Match opening tags like <div>, <div id="x">, <div/> (self-closed)
        const openCount  = (html.match(new RegExp(`<${tag}[\\s>/]`, 'gi')) || []).length;
        // Match closing tags like </div> and </div   >
        const closeCount = (html.match(new RegExp(`<\\/${tag}\\s*>`, 'gi')) || []).length;
        if (openCount !== closeCount) {
            issues.push(
                `Unbalanced <${tag}> tags: ${openCount} opening, ${closeCount} closing`
            );
        }
    }

    return issues;
}

// ---------------------------------------------------------------------------
// Tests – one per example
// ---------------------------------------------------------------------------

for (const example of examples) {
    const htmlSource = example.htmlSource;
    if (!htmlSource || htmlSource === '-') continue;

    const label = `[${example.file}] ${example.formId}`;

    test(`${label} – HTML validity`, () => {
        const issues = validateHtmlFragment(htmlSource);

        if (issues.length > 0) {
            // Build a descriptive message that points to the exact example
            const msg = [
                `HTML validity failed for example "${example.formId}" in ${example.file}:`,
                ...issues.map(i => `  • ${i}`),
            ].join('\n');
            expect.soft(issues, msg).toHaveLength(0);
        }

        // Explicit final assertion so Playwright marks the test as failed
        expect(issues, `${issues.length} HTML issue(s) in "${example.formId}"`).toHaveLength(0);
    });
}
