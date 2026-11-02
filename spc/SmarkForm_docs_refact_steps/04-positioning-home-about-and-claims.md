# Step 04 — Positioning, Home, About, and Product Claims

## Session goal

Make the site's first explanation accurate and orient readers around SmarkForm's
actual HTML → component tree → structured values model. Improve Home and About
without creating unsupported product claims.

## Dependencies

- Step 03's parallel structure is available.
- Step 01 claim inventory and Step 02 route decisions are approved.

## Work

1. Agree on one concise product sentence and a short supporting explanation.
   Describe retained HTML/CSS, annotated DOM, SmarkForm's component tree, and
   import/export of objects and arrays. Avoid unqualified “low-code,” “markup
   agnostic,” or “form enhancer” wording when concrete language is clearer.
2. Restructure the new homepage around the existing interactive Event Planner
   and a compact HTML/data model explanation. Preserve status, feature links,
   community, examples/downloads, and contribution routes.
3. Refocus Introduction on motivation and fit. Keep a brief neutral answer to
   the framework question and link to **When SmarkForm Fits**.
4. Create **When SmarkForm Fits** only under its approved scope. Compare
   approaches by UI source, data/state model, strengths, tradeoffs, and author
   responsibilities. Audit the Event Planner comparison and all metrics; treat
   it as illustrative unless methodology is reproducible.
5. Reorganize Features around the core model, developer benefits, and additional
   capabilities. Correct stale sorting, validation, JSON, bundle-size, and
   roadmap wording against current source/tests/docs.
6. Review About FAQ and roadmap claims affected by the new positioning; link to
   canonical references rather than duplicating detailed answers.

## Required references

- `spc/SmarkForm_docs_refact.md` §§3, 5, and 6, especially validation,
  accessibility, size, and framework claims.
- `docs/index.md`, `docs/_about/introduction.md`, `features.md`, `faq.md`,
  `roadmap.md`, and the approved route map.
- Current implementation/spec/tests for every capability or metric mentioned.

## Deliverables

- Revised Home, Introduction, Features, and any affected FAQ/Roadmap content.
- A new **When SmarkForm Fits** page if approved.
- Claim evidence/caveat notes for the decision ledger.

## Verification / done when

- New-reader explanation distinguishes author-controlled markup/styles from
  SmarkForm-managed component/value behavior.
- No statement implies built-in schema validation, a framework wrapper, or
  other unimplemented behavior.
- Comparison claims are balanced, sourced, and appropriately caveated.
- The current and legacy pages link to the correct canonical destinations.
- Page descriptions/front matter and generated TOCs conform to documentation
  conventions.

## Delegation

A read-only reviewer can independently fact-check comparison/size claims or
review the new-reader path. Do not delegate parallel edits to the homepage or
About pages because they share terminology and framing.
