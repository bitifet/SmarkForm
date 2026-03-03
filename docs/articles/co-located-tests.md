---
title: "How We Gave Every Documentation Example Its Own Test — and Why It Caught Real Bugs"
layout: page
permalink: /articles/co-located-tests
nav_exclude: true
---

<!-- dev.to article — also published at: https://smarkform.bitifet.net/articles/co-located-tests -->

# How We Gave Every Documentation Example Its Own Test — and Why It Caught Real Bugs

> **Cross-posted from dev.to** — written for the [SmarkForm](https://smarkform.bitifet.net) project.

---

Documentation examples have a dirty secret: they're code, but they're rarely
treated *like* code.

We write them carefully when we publish them, and then — slowly, quietly —
they drift. The API changes. A parameter gets renamed. The behavior shifts
slightly. Yet the docs example keeps running in our heads as the canonical
demonstration, even after it stops being accurate.

For [SmarkForm](https://github.com/bitifet/SmarkForm) — a markup-driven form
library whose entire value proposition is its declarative HTML API — this risk
is especially acute. Our documentation site is full of *interactive* examples.
People copy them. People *trust* them. If they're wrong, the library looks
broken — because to the person reading the docs, the example *is* the library.

This is the story of how we solved it.

---

## The Starting Point: A Library With Living Examples

SmarkForm's documentation is a Jekyll site with dozens of
[interactive playground examples](https://smarkform.bitifet.net/about/showcase).
Each example is a fully functional mini form, rendered live in the browser,
showing features like nested subforms, variable-length lists, context-driven
hotkeys, and more.

The examples aren't just screenshots — they use a component called
`sampletabs_tpl` that renders a tabbed interface with a live form, the HTML
source, the JavaScript source, and a JSON import/export playground. Anyone
reading the docs can click Import, tweak the JSON, and see the form respond.

That richness is exactly what makes untested examples so dangerous. There's a
lot of moving parts to get right.

---

## The Foundation: Migrating to Playwright

Before we could build co-located tests, we had to fix the foundation. In
October 2025, the existing test suite — Puppeteer + Mocha, over 2,000 lines —
was migrated to [Playwright](https://playwright.dev/). This wasn't just a
tooling swap. It opened the door to:

- Running tests across **Chromium, Firefox, and WebKit** with a single command.
- A much cleaner API for async interactions.
- Better tracing and debugging when things went wrong.
- A modern, actively maintained ecosystem.

The Playwright migration itself was a prerequisite for everything that followed.
With a solid, multi-browser foundation in place, the next question became: how
do we use it to test the documentation examples?

---

## The Idea: Co-Located Tests

The insight was simple: **put the test right next to the example**.

Not in a separate `test/` folder that grows out of sync. Not in a spreadsheet
of "things to manually verify." Right there, in the same Markdown file, in the
same `{% capture %}` block that describes the example.

Here's what it looks like in practice. A documentation example in SmarkForm's
Jekyll site looks like this:

```markdown
{% capture my_example_html %}
<form data-smark>
  <input name="username" data-smark />
  <button data-smark='{"action":"export"}'>Save</button>
</form>
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    tests=false
%}
```

The `tests=false` means: *I know there's no custom test here; that's intentional*.

But for examples where behavior matters, you add a capture block with real
Playwright test code:

```markdown
{% capture my_example_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const input = root.locator('input[name="username"]');
    await input.fill('alice');

    expect(await readField('username')).toBe('alice');
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    tests=my_example_tests
%}
```

That `export default async function` is a real Playwright test. It gets
extracted, executed, and reported as a test result — for every browser.

---

## The Architecture: Collector + Runner

Under the hood, this works through a two-phase pipeline.

### Phase 1: The Collector

A Node.js script (`scripts/collect-docs-examples.js`) scans the entire `docs/`
folder. For each Markdown file, it:

1. Extracts all `{% capture %}` blocks into an in-memory map.
2. Finds every `{% include components/sampletabs_tpl.md %}` call.
3. Resolves each parameter: `htmlSource`, `cssSource`, `jsSource`, `tests`, etc.
4. Applies transformations:
   - `$$` → `-${formId}` (ensures unique DOM IDs per example)
   - `█` (a filled square character) → four spaces (an indentation hack for
     Jekyll, which strips leading whitespace in liquid captures)
   - Strips `!important` from CSS
5. Skips purely illustrative examples (`jsSource="-"`).
6. Writes everything to a JSON manifest at `test/.cache/docs_examples.json`.

The collector also handles some subtleties. Jekyll filters like
`{{ variable | replace: "old", "new" }}` are simulated in JavaScript so the
resolved content is identical to what Jekyll would produce. Docs-only
parameters like `demoValue` (which seeds a default value in the rendered page
but is irrelevant to tests) are explicitly stripped.

### Phase 2: The Runner

A Playwright test file (`test/co_located_tests.tests.js`) loads the manifest
and generates one test per example. For each example:

1. It assembles a minimal HTML page containing the example's HTML, CSS, and
   JavaScript, plus a `<script src="/dist/SmarkForm.umd.js">`.
2. It writes that page to a temp file and serves it via the local test server.
3. It navigates Playwright to the page and waits for SmarkForm to initialize.
4. **Smoke checks** always run: the form container is visible; console error
   and page error counts match expectations.
5. If `tests` is a code string (not `"false"`), the code is written to a
   temporary `.mjs` file and dynamically imported. The exported default
   function is called with `{ page, expect, id, root, readField, writeField }`.

The helpers passed to each test function are worth noting:

- `root` — a Playwright locator pointing to `#myForm-${id}`, the example's
  container.
- `readField(path)` — exports a field's current value via SmarkForm's own
  `.find(path).export()` API.
- `writeField(path, value)` — imports a value into a field.

This means co-located tests can test behavior at the SmarkForm API level, not
just at the DOM level. You can assert `expect(await readField('price')).toBe(42)`
instead of digging into the DOM for the raw input value.

### The Enforcement Rule

One critical design decision: **every example must declare `tests=...`**, even
if just `tests=false`. If an example is missing the parameter, the test suite
fails with a clear message:

```
Example showcase.md_basic_form is missing co-located tests.
Please add a tests= parameter to the {% include %} block,
or use tests=false to explicitly disable testing.
```

This enforcement ensures the question "does this example have a test?" is
always explicitly answered. You can't accidentally omit it. The quality floor
only goes up.

---

## The Naming Evolution

The system went through a quick naming evolution that's worth mentioning because
it reflects the conceptual clarity that emerged over time:

- The first test harness was called `docs_examples.tests.js` — named after
  what it tested (docs examples).
- It was soon renamed to `co_located_tests.tests.js` — named after the
  *strategy* (tests living alongside the code they test).
- A companion file, `co_located_tests_validation.tests.js`, handles the
  meta-level: it tests the manifest itself, verifying that every example has
  valid `tests` and error-count declarations, and that transformations
  (no stray `$$`, no `█` characters) were applied correctly.

The naming made it clearer that the *principle* — co-location — was the
important thing, not the specific mechanism.

---

## The Workflow: Interactive Test Picking

Writing tests is one thing. *Running a single test while you're developing*
is another. The co-located tests are loaded and run by Playwright, which means
you can already filter them with `-g` and `--project`. But the project added
something nicer: an interactive test picker.

```bash
npm run test:pick
```

This drops you into an interactive shell menu where you choose:

1. **What to test**: regular tests, co-located tests (all), or co-located
   tests for a specific documentation file.
2. **Which example**: if you chose a specific file, which `formId`.
3. **Which browser**: Chromium, Firefox, or WebKit.

After selecting, it builds the right Playwright command and runs it. It also
remembers your last choice, so a `--repeat` flag lets you quickly re-run the
same test after changing something.

```bash
npm run test:pick -- --repeat --headed
```

This combination — pick once, repeat with `--headed` or `--debug` — was a
genuine quality-of-life improvement for the write-test-fix loop.

---

## The Bugs It Caught

Here's where it gets interesting. Writing tests for existing examples
immediately surfaced bugs that had been lurking unnoticed.

### The Hotkeys State Bug

While writing a test for the 2nd-level hotkeys example in the showcase, the
author ([@bitifet](https://github.com/bitifet)) encoded an expectation that
seemed obvious: *releasing the Alt key while Ctrl is held should return to
the 1st-level hotkeys display*.

The test was committed with a note: *"It fails while checking that releasing
ALT returns to previous status if Ctrl is hold. But this is a REAL bug, so
the test is Ok."*

The very next commit fixed `src/lib/hotkeys.js`. The bug had existed in the
library, silently, until a documentation example was tested.

### The datetime-local Naming Bug

When the `datetime-local` component type was added, a co-located test caught
a naming inconsistency: the example source used `"datetimeLocal"` (camelCase)
while the implementation expected `"datetime-local"` (kebab-case). The test
failed; the example source was corrected.

### The Smoke Check Safety Net

Beyond specific behavioral tests, the smoke checks — which run for *every*
example — have caught examples that failed to initialize at all due to
a breaking API change. If an example produces a console error it's not
expected to, the test fails immediately. No manual clicking through the docs
required.

---

## The Numbers

At the time of the 0.12.6 release (which introduced co-located tests), the
library described it this way in the changelog:

> **Major improvements to testing infrastructure and coverage:**
> - Migrated the test suite to Playwright, covering Chromium, Firefox, and WebKit.
> - Added smoke tests for all examples in the documentation.
> - Co-located, feature-specific tests for each example are now possible — and enforced.

The suite covers dozens of interactive documentation examples, each exercised
across three browsers, all driven by the same living documentation that users
read and trust.

---

## What Makes This Approach Work

A few principles made the co-located test strategy effective in SmarkForm:

**1. The test is right next to what it tests.**

There's no context-switching between "the docs example" and "the test for the
docs example." They're in the same file, a few lines apart. When you update
the example, you immediately see its test and update it.

**2. Tests are enforced, not optional.**

The "you must declare `tests=` or `tests=false`" rule means there's no
ambiguity. It's not a linting warning; it's a test failure. Every example is
accounted for.

**3. The test interface is ergonomic.**

The `readField` / `writeField` helpers let you interact with the form at
the SmarkForm API level. You don't have to know whether a number field renders
as an `<input type="number">` or something else — you just call
`readField('price')` and assert on the returned value.

**4. The test picker reduces friction.**

When testing one specific example in one specific browser is two menu selections
away, you do it more often. Lower friction → more tests written → more bugs
found earlier.

**5. The examples are isolated.**

Each example gets its own minimal HTML page, its own SmarkForm instance, its
own error tracking. There's no bleed-through between examples. The smoke checks
for one example don't affect another.

---

## Takeaways for Your Own Project

If your project has a documentation site with interactive examples, here's the
core idea distilled:

1. **Treat documentation examples as first-class test subjects.** They're not
   just prose — they're code that runs in your users' browsers (or in their
   heads when they copy-paste). Test them.

2. **Put the test near the example.** The closer the test is to what it tests,
   the more likely it will be maintained. Co-location is the key.

3. **Enforce test presence.** An optional test is a test that won't get written.
   Make it a breaking build failure when a test is absent and undeclared.

4. **Invest in ergonomic helpers.** The test interface should feel natural to
   someone who knows the library API. If writing a test requires knowing the
   DOM structure, that's a leaky abstraction.

5. **Make the test loop fast.** A test picker, a `--repeat` flag, a `--headed`
   mode — any investment in the write-test-fix loop pays compound interest.

---

## Conclusion

Co-located tests for documentation examples started as an experiment in the
SmarkForm project and quickly became one of the most practically impactful
improvements to the development workflow. They've caught real bugs — bugs that
had existed in the library, invisible, until someone wrote down what the correct
behavior *should* be and a test confirmed it wasn't.

More than the bugs, though, what co-located tests provide is *confidence* — the
confidence to refactor, to add a feature, to change a behavior, and know that
the documentation examples will tell you immediately if you've broken something
that matters.

Documentation and tests have always had a troubled relationship. Co-location is
one way to give them a common home — and to stop treating the docs as a place
where bugs go to hide.

---

*SmarkForm is an open-source, markup-driven form library for building complex
HTML forms with nested subforms, variable-length lists, and JSON import/export.
→ [smarkform.bitifet.net](https://smarkform.bitifet.net) · [GitHub](https://github.com/bitifet/SmarkForm)*
