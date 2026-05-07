# SmarkForm Advanced Internals — Optional Skill Spec

## Goal

Handle advanced SmarkForm internals safely (complex list semantics, action decorator nuances, context/target path edge-cases, and security-related options).

## Scope

Use this optional skill for:
- Nested list/template edge cases
- Programmatic action invocation nuances
- Complex `context` / `target` path behavior
- Mixin/security-option-sensitive implementations

For standard form implementation, use:
- `skills/SmarkForm-Form-Builder.skill.md`

## Source Priority

1. https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage
2. https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms
3. `docs/_resources/AGENTS/SmarkForm-Usage.md`
4. `docs/_resources/AGENTS/SmarkForm-Forms.md`
5. `AGENTS/SmarkForm-Usage.md`
6. `AGENTS/SmarkForm-Forms.md`

## Non-negotiable Internals Rules

- Respect `@action` calling conventions (including argument position semantics).
- Respect action context resolution and target resolution semantics.
- Respect list template role lifecycle and cloning behavior.
- Apply security-related options at root-level constructor options.

## Output Requirement

Provide a short “advanced compliance check” confirming:
- source pages consulted
- internals rules applied
- unresolved ambiguity (if any)
