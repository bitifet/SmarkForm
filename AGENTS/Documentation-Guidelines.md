# SmarkForm's Documentation Guidelines — Agent Knowledge

This document captures key guidelines about how to update and add new content to the SmarkForm's Jekyll/Just-the-docs documentation under the `docs/` directory. It is intended to help coding agents make correct changes to documentation.

## Vim Fold Markers in Documentation Files

Documentation Markdown files in `docs/` use vim-style fold markers (`{{{` /
`}}}`) to keep large files navigable. Each `{% capture %}` block is surrounded
by a pair of markers embedded in HTML comments and wrapped in `{% raw %}` so
that Jekyll ignores them:

```markdown
{% raw %} <!-- capture_name {{{ --> {% endraw %}
{% capture capture_name %}
... (possibly large block of HTML, JS, CSS, or test code) ...
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}
```

**Why this matters:** A showcase page can contain a dozen or more capture
blocks. With `foldmethod=marker` active in vim/neovim, each block collapses to
a single labelled line, making the file structure immediately visible and
making it easy to jump to a specific example without scrolling through hundreds
of lines.

**Convention rules for agents:**
- **Always** add fold markers when creating a new `{% capture %}` block in a
  documentation file.
- The opening marker line must be a standalone `{% raw %} <!-- name {{{ --> {% endraw %}`
  on its own line, immediately before `{% capture name %}`.
- The closing marker must be on the **same line** as `{% endcapture %}`:
  `{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}`.
- For captures that end without an `{% endcapture %}` (e.g., due to a `%}`
  placement on the next line), put the closing marker on the line after.

**Editor support:**
- **Vim/Neovim**: `set foldmethod=marker` (native, no plugins).
- **VS Code**: [Custom Folding](https://marketplace.visualstudio.com/items?itemName=jmfirth.vscode-custom-folding) extension.
- **Emacs**: `origami-mode` with custom markers.

---

## Variable Naming Conventions in Code Examples

When writing JavaScript code snippets in documentation, always use `myForm`
(not `el`, `container`, or other generic names) as the variable name for the
SmarkForm root element and instance.  This matches all pre-existing examples
throughout the docs and keeps the codebase consistent:

```js
// ✅ Correct — use myForm
const myForm = new SmarkForm(document.getElementById("myForm"), { … });
await myForm.rendered;
const field = myForm.find('/person/name');

// ❌ Incorrect — do not use generic names like el
const myForm = new SmarkForm(el, { … });
```

The first argument to `new SmarkForm(…)` should also use a concrete selector
like `document.getElementById("myForm")` rather than a bare variable named
`el`.  If the DOM element is obtained from a variable, call that variable
`myForm` as well (or a domain-appropriate name like `contactForm`).

## `data-smark-*` Option Attributes

Public configuration option names use `snake_case` in `data-smark` JSON,
constructor options, and programmatic option objects. Action identifiers are
not option names: values such as `"addItem"` in the `action` option retain their
documented spelling. Function-valued JavaScript event hooks retain their
documented `on...` spelling and are not serializable configuration keys.
SmarkForm uses a `data-smark-*` suffix literally; HTML
lowercases attribute names, and there is no camelCase or kebab-case conversion.
Use prefixed attributes for supported options, and use JSON `data-smark` for
structured values unless an option documents a specific prefixed-value parser.
Prefixed attributes can identify a component by themselves and override the
same option key in the JSON object. Their values are strings; describe only the
type normalization that the implementation actually supports.


The documentation uses the Just-the-docs theme's built-in callout styles for important notes, warnings, and tips. The syntax is:

```markdown
{: .<type>}
> CONTENT
```
...where <type> is one of:
- `info` for general information
- `hint` for helpful tips
- `warning` for important warnings
- `caution` for critical cautions

We should not prefix *CONTENT* with any emojiis since the callout style already provides a visual cue. For example, instead of writing:

```markdown
{: .warning}
> ⚠️ WARNING: This action is irreversible.
```
...we should write:

```markdown
{: .warning}
> WARNING: This action is irreversible.
```
