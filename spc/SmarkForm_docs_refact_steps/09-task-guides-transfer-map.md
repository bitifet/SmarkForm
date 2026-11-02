# Step 09 — Core Task Guides Transfer and Accuracy Map

**Status:** The four canonical task guides are reviewed at their approved
`/guides/` routes. Their detailed sections and sampletabs remain available; the
staged `/old/` copies were not changed.

## Page review

| Canonical guide | Reviewed sections and retained material | Step 09 accuracy/link work |
|---|---|---|
| `docs/_guides/data_import_and_export.md` | Overview; `export` shape and `export_empties`; import formats, `set_default`, and `focus`; defaults, `clear`, and `reset`; data piping; direct API; server load/save, native form submission, and draft persistence. All four sampletabs and nine capture declarations remain. | Reconciled context/target wording with Step 07. Removed the `AfterAction_import` listener from the direct programmatic-load example and explained that direct method calls do not emit action lifecycle events. Clarified scalar empty values and linked Value Coercion. Kept the direct-method/event distinction and the `enable_json_encoding` opt-in. |
| `docs/_guides/form_traversing.md` | Path syntax and basic traversal; context/target; sibling navigation and examples; wildcard patterns/dispatch; multi-match lookup; practical examples; best practices and idioms. All four sampletabs and ten captures remain. | Kept Step 07's verified path bases. Clarified that `find()` is not recursive and that render readiness concerns descendant lookup. Changed the wildcard iteration to an awaited `for...of`; replaced nonexistent `isValid()` with an application-supplied validator and made its function async; fixed import-object shape; avoided changing defaults during sibling synchronization; clarified that direct imports do not emit lifecycle events. Preserved the prior `#bidirectional-data-sync-pattern` anchor on its renamed heading. |
| `docs/_guides/value_coercion.md` | Scalar-to-array/list empty-item behavior; number/date/time/null contracts; JSON mode. Both sampletabs, both custom test captures, and all nine capture declarations remain. | Qualified the general normalization claim. Documented the implementation's current JSON-mode limitation: falsey parsed values (`0`, `false`, `""`, `null`) export as `null`. Clarified `undefined` list import as reset-to-default and documented `Date`/epoch inputs for time fields. Added a link to the complete import/export guide. |
| `docs/_guides/field_masking.md` | Registration, declarative scripts, IMask, custom singleton/list masks, mixin-scoped masks, Maska, errors, focus timing, and library choices. All seven sampletabs, the custom mask test, mixin security option, and all 22 captures remain. | Changed the basic card example to a string `input`. Kept the full IMask example's `number` type to match the existing `mask_imask.tests.js` contract, but documented numeric coercion and when to use a string field. Corrected the missing-mask option and error-code text against current source. |

Related reference updated: `docs/_advanced_topics/the_smarkform_constructor.md`
now limits `smark_mask_throw_on_missing:false` to missing registrations and
links to the Field Masking error-handling section for factory behavior.
The non-functional source comment in `test/mask_imask.tests.js` now points to
the canonical guide and Showcase paths; its assertions and factory code are
unchanged.

## Sampletabs and capture counts

| Page | Existing `formId`s | Captures | Custom test |
|---|---|---:|---|
| Data Import and Export | `export_structure`, `import_example`, `clear_vs_reset`, `pipe_example` | 9 | None; all remain `tests=false`. |
| Form Traversing | `form_trav_copy_adjacent`, `form_trav_navigation_ui`, `form_trav_kanban`, `form_trav_practical_copy` | 10 | None; all remain `tests=false`. |
| Value Coercion | `smart_value_coercion`, `type_coercion` | 9 | `smart_value_coercion_tests` and `type_coercion_tests` are both retained and still wired to their examples. |
| Field Masking | `apply-mask`, `via-js`, `via-script`, `mask-cc`, `mask-custom`, `mixin-mask`, `maska-price` | 22 | `mask_custom_tests` is retained and wired to `mask-custom`; the mixin sample retains `smark_mixin_allow_local_scripts:"allow"`. |

Total: **17 existing sampletabs and 50 capture declarations**. Comparison with
the staged pages found no lost sample IDs or capture names. The legacy files
`docs/_old_working_with_forms/old_{data_import_and_export,form_traversing,value_coercion,field_masking}.md`
remain unchanged.

## Mask-factory source discrepancy

The previous task-guide copy and root agent notes described a
`MASK_APPLY_ERROR` wrapper, restoration of the original input type after a
factory exception, and `smark_mask_throw_on_missing:false` suppressing factory
exceptions. Current `src/types/input.type.js` implements only missing-registry
handling for that option. Registered factory exceptions propagate from
`_applyMask()` after an input has been converted to `text`; the source does not
wrap them as `MASK_APPLY_ERROR` or restore the original type. The guide and
`AGENTS.md` now document the source behavior. This is recorded as a possible
implementation follow-up, not changed as part of this documentation step.

## Validation

* Compared the canonical sampletab IDs/captures against the staged pages; no
  IDs or capture names were lost.
* Jekyll build, rendered internal links/fragments, collection routes, and
  sitemap membership were checked after the changes.
* Node/npm and Playwright are unavailable in this environment, so the docs
  collector and Playwright sample/round-trip tests were not run. Their custom
  test captures and wiring remain intact for the user's later run.
