import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const source = readFileSync(
    new URL('../docs/_showcase_examples/examples.md', import.meta.url),
    'utf8'
);

test('Examples selector script remains valid when rendered HTML is compacted', () => {
    const match = source.match(
        /<script>\s*(const switcher = [\s\S]*?)<\/script>/
    );
    expect(match, 'the Examples page exposes its selector script').not.toBeNull();

    // The Jekyll output compacts inline HTML/JavaScript into one line. A `//`
    // comment in this script therefore swallows all following code.
    const compactedScript = match[1].replace(/\s+/g, ' ');
    expect(() => new Function(compactedScript)).not.toThrow();
});
