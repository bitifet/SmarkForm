import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

const legacyPage = readFileSync(
    new URL('../docs/_showcase_examples/legacy_examples.md', import.meta.url),
    'utf8'
);
const examplesPage = readFileSync(
    new URL('../docs/_showcase_examples/examples.md', import.meta.url),
    'utf8'
);
const legacyCapture = readFileSync(
    new URL('../docs/_showcase_examples/examples.capture.md', import.meta.url),
    'utf8'
);
const legacyExamplesData = readFileSync(
    new URL('../docs/_data/legacy_examples.csv', import.meta.url),
    'utf8'
);

test('Legacy Examples selector script remains valid when rendered HTML is compacted', () => {
    const match = legacyPage.match(
        /<script>\s*(const switcher = [\s\S]*?)<\/script>/
    );
    expect(match, 'the Legacy Examples page exposes its selector script').not.toBeNull();

    // The Jekyll output compacts inline HTML/JavaScript into one line. A `//`
    // comment in this script therefore swallows all following code.
    const compactedScript = match[1].replace(/\s+/g, ' ');
    expect(() => new Function(compactedScript)).not.toThrow();
});

test('New Examples page describes its full-sample scope and links the legacy archive', () => {
    expect(examplesPage).toContain('more realistic applications');
    expect(examplesPage).toContain('Legacy Examples archive');
    expect(examplesPage).toContain('formId="examples_project_kanban"');
});

test('Legacy Examples are archived as static generated files', () => {
    expect(legacyPage).toContain('nav_exclude: true');
    expect(legacyPage).toContain('sitemap: false');
    expect(legacyPage).toContain('noindex: true');
    const archiveDir = new URL('../docs/_showcase_examples/.legacy_examples/', import.meta.url);
    for (const name of [
        'company.html', 'todo-list.html', 'hiking.html', 'beach.html',
        'event-registration.html', 'expense-report.html', 'medical-intake.html',
        'property-inspection.html', 'restaurant-reservation.html',
        'template.html', 'smarkform_layout_sample.css', 'smarkform_styles_sample.css',
    ]) {
        expect(existsSync(new URL(name, archiveDir)), `${name} is in the legacy archive`).toBe(true);
    };
    expect(legacyCapture).toContain('site.data.legacy_examples');
    expect(legacyCapture).toContain('.legacy_examples/');
    expect(legacyExamplesData).toContain('/assets/legacy-examples/');
});
