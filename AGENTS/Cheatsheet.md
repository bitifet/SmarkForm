# Developer Cheatsheet — Agent Knowledge

The **Developer Cheatsheet** is a concise reference for SmarkForm API surface,
component types, actions, events, and common patterns. It lives on the docs
site and is the single source of truth for quick lookups.

- **Rendered page**: https://smarkform.bitifet.net/resources/cheatsheet
- **Source**: `docs/_resources/cheatsheet.md`

## What the cheatsheet covers

| Section | Contents |
|---------|----------|
| Constructor Options | All options accepted by `new SmarkForm(el, opts)` |
| The `data-smark` Attribute | Attribute syntax, component mapping |
| Component Types | `input`, `textarea`, `select`, `number`, `date`, `time`, `datetime-local`, `color`, `radio`, `form`, `list`, `trigger` |
| List Template Roles | `item`, `inline`, `prepend`, `append`, `empty` |
| Actions | `reset`, `clear`, `export`, `import`, `submit`, `addItem`, `removeItem`, `sort` — signatures, options, behaviour |
| Context & Target Resolution | How triggers find their context/target components |
| Event System | `BeforeAction_*`, `AfterAction_*`, `@action` decorator, `silent` option |
| Data Import / Export | `export()`, `import()`, options deep-dive |
| API Methods | All public prototype methods grouped by purpose |

## How to use this file as an agent

When you need to generate HTML markup or JavaScript that uses SmarkForm:

1. Read `docs/_resources/cheatsheet.md` directly (it contains the full content).
2. For action signatures and options, look in the **Actions** section.
3. For component-specific attributes, look in the **Component Types** section.
4. For event names and payloads, look in the **Event System** section.
5. For import/export options (`exportEmpties`, `setDefault`, `silent`, etc.), look in the **Data Import / Export** section.

## Validation

The cheatsheet has an automated validation script (`scripts/validate-cheatsheet.js`)
that runs as part of the pretest or build pipeline. It verifies:

- All required sections exist
- TOC anchors match actual headings
- Internal cross-reference links resolve
- No broken fragment links

If validation fails, check that any heading changes in `cheatsheet.md` are
reflected in the TOC and that anchor IDs (either auto-generated or explicit)
are correct.
