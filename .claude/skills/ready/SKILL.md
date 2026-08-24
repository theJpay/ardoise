---
name: ready
description: Use before reporting any commit ready for review. Runs typecheck, lint, tests, and formatter in this order, then re-checks git status to capture formatter-written changes. Triggers on "ready?", "is this ready", "verify", or immediately before committing.
---

# Pre-commit verification

Run these four commands in order. Report each one's result. Do **not** skip any — `npm run format` in particular is often forgotten and produces a noisy follow-up formatting commit when missed.

1. `npx tsc --noEmit -p tsconfig.app.json` — type check (this repo has no `npm run typecheck` script)
2. `npm run lint` — ESLint
3. `npm run client:test` — Vitest (or `npx vitest run <path>` for a scoped run during iteration)
4. `npm run format` — Prettier write

After step 4, run `git status --short` again — Prettier writes in place, so it may have produced edits that still need staging.

## Reporting

For each command, report **pass / fail**. If one fails, stop and surface the error — don't proceed to the next step.

After all four pass, summarize:

- Did Prettier write anything? (yes/no, and which files)
- Anything left to stage?

## Staging

When staging, list paths explicitly. Never `git add -A`, `git add .`, or any wildcard form — `Note copy.tsx` is intentionally untracked in this repo and wildcards sweep it in.
