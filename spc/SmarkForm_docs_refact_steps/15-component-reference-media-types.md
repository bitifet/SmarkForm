# Step 15 — Component Reference: Media Types

## Session goal

Migrate File, Image, Video, and Audio references while preserving the detailed
media value contract, acquisition pipelines, security/performance caveats, and
tested examples.

## Dependencies

- Step 12's Component Reference foundation/routes.
- Steps 13–14's shared type/reference patterns and Step 11's media accessibility
  caveats.

## Work

1. Move the four media pages to their approved Component Reference routes.
2. Verify each option, action, import/export shape, encoding/name precedence,
   acquisition/decode/resize/size behavior, notices, and browser limitations
   against current source, specs, and tests.
3. Preserve the distinction between acquired-file validation and trusted import,
   embedded data versus URL fetches, per-field controls, list append behavior,
   and native media playback.
4. Keep image layout-space requirements explicit. Do not suggest automatic
   width/height/alt management. Preserve video/audio native-controls and poster
   caveats.
5. Retain useful download and rename examples and ensure editor-local trigger
   paths remain relative. Preserve realistic demo values and media assets/links.
6. Ensure media notices and warnings are accurate, cancellable behavior is
   correctly described, and no alert/confirm behavior is claimed where absent.
7. Update migration markers and source/destination ledger for every media
   capture/test.

## Required references

- `spc/SmarkForm_docs_refact.md` §§2, 4, and 5.
- `docs/_component_types/type_{file,image,video,audio}.md`.
- `spc/{file,image,video,audio}.md`, corresponding `src/types/`, shared media
  helpers, and `test/type_*` plus co-located tests.
- Media-related sections in `AGENTS.md` and `AGENTS/Documentation-Examples.md`.

## Deliverables

- Four accurate, detailed media references at final routes.
- Preserved runnable examples and closed media portion of the migration ledger.

## Verification / done when

- Value contracts/options match authoritative specs and tests.
- Images reserve layout space; audio/video native behavior and author duties are
  stated without overclaiming.
- All examples have valid demos, controls, links, and collected tests.
- Relevant media tests and a docs build pass; no technical detail was lost.

## Delegation

Independent read-only audits by media type are useful due to the substantial
specs. Keep edits per page disjoint; one integrator must reconcile shared file
semantics and list behavior. Do not ask agents to rewrite or simplify the shared
contract independently.
