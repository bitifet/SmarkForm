# SmarkForm's Documentation Guidelines — Agent Knowledge

This document captures key guidelines about how to update and add new content to the SmarkForm's Jekyll/Just-the-docs documentation under the `docs/` directory. It is intended to help coding agents make correct changes to documentation.

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

