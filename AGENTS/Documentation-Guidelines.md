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

## Callout Styles

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

