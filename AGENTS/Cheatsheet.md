# Developer Cheatsheet — Agent Knowledge

The **Developer Cheatsheet** is a concise reference for SmarkForm API surface,
component types, actions, events, and common patterns. It lives on the docs
site and is the single source of truth for quick lookups.

- **Rendered page**: https://smarkform.bitifet.net/component_reference/cheatsheet
- **Source**: `docs/_component_reference/cheatsheet.md`

## What the cheatsheet covers

| Section | Contents |
|---------|----------|
| Constructor Options | Common root options accepted by `new SmarkForm(element, opts)`, with a link to the full constructor reference |
| The `data-smark` Attribute | Attribute syntax, component mapping |
| Component Types | All registered built-ins: `form`, `list`, `input`, `number`, `date`, `time`, `datetime-local`, `color`, `radio`, `file`, `image`, `video`, `audio`, `trigger`, `label`. Native `<select>` uses `input`; dynamic remote Select options are planned, not implemented. Mixins are a template feature, not a registered built-in type. |
| List Template Roles | `item`, `inline`, `prepend`, `append`, `empty` |
| Actions | `reset`, `clear`, `export`, `import`, `submit`, `addItem`, `removeItem`, `count`, `position`, `download`, `rename`, `pick`, custom actions |
| Context & Target Resolution | How triggers find their context/target components |
| Event System | `BeforeAction_*`, `AfterAction_*`, `@action` decorator, `silent` option |
| Data Import / Export | `export()`, `import()`, options deep-dive |
| Video and Audio Fields | Compact media picker/player/value overview with links to both detailed type references |
| API Methods | Common component methods; includes `move(options)` as a sortable-list method, not an action |

## How to use this file as an agent

When you need to generate HTML markup or JavaScript that uses SmarkForm:

1. Read `docs/_component_reference/cheatsheet.md` directly (it contains the full content).
2. For action signatures and options, look in the **Actions** section.
3. For component-specific attributes, look in the **Component Types** section.
4. For event names and payloads, look in the **Event System** section.
5. For import/export options (`export_empties`, `set_default`, `silent`, etc.), look in the **Data Import / Export** section.

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
