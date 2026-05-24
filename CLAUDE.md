# Ardoise — Project conventions

## Collaboration

- Discuss fixes before implementing — wait for explicit approval
- Suggest generic components, design tokens, or shared abstractions when they'd fit — don't add them unilaterally
- If we establish a convention mid-session, propose adding it here so it doesn't evaporate

Workflow skills (invoke as `/skill-name` at the relevant moment): `/kickoff` to start a feature, `/commit-plan` before implementing, `/post-impl` after non-trivial work, `/pm-design` for product/UX discussion, `/ready` before reporting a commit ready.

## Design system

- Colors are opaque hex only — no rgba tokens
- `dim` is decorative (icons, syntax markers, placeholders, `text-ui-xs` uppercase micro-labels); `subtle` / `muted` are readable secondary text — `subtle` quieter, `muted` more present
- Use typographic utilities (`text-ui-*` / `text-ed-*`) instead of inline sizes
- Base HTML is `font-sans`; only set `font-mono` when overriding
- Design specs in `~/Downloads/ardoise/` are a guide for intent and layout, not a source of truth — the code is the design. Reuse existing typography, colors, icon sizes, and components rather than transcribing spec values
- Lucide icons: `strokeWidth={1.5}` for size ≥12, `strokeWidth={2}` for size ≤11. Filled buttons (`Button` primary/ghost/danger) keep `strokeWidth={2}` at size 14 to read alongside bold text on a colored background.

## Code

- Self-documenting code over comments; use naming or extraction
- One commit = one concern; no co-authored-by trailers
- Prefer functional slices over technical layers for feature work — each commit should be a product-meaningful increment that leaves the app in a shippable state (e.g. "palette opens with recents" → "add title search" → "add content search", not "data layer" → "UI" → "wiring"). Iso-functional changes (renames, refactors, extractions) can stand alone.
- If a feature needs a refactor to land cleanly, ship the refactor as its own iso-functional commit first — don't bundle it into the feature commit.
- Name commits by user-visible behavior, not implementation (good: "add title search in command palette"; bad: "add usePaletteResults hook")
- Prefix commits and PR titles with conventional type: `fix:`, `feat:`, `refactor:`, `chore:`, `docs:`
- ESLint: universal rules include `curly` and `import/order`; the client overlay adds `jsx-sort-props` and the `@*` path aliases as internal
- `@utils` for shared utilities
- Editor text operations go through `replaceRange`

## Architecture

- Three layers — **domain** (entities, ports, pure rules), **application** (use cases through ports), **infrastructure** (HTTP, DB, framework wiring). Dependencies are one-way: `infrastructure → application → domain`.
- Ports are interfaces in the domain; adapters in infrastructure are the only things that touch the outside world.

### Backend (`apps/api/src/`)

- Bounded contexts at the top level (`auth/`, `notes/`, `shares/`, `ai/`, `monitoring/`), each with `domain/`, `application/`, `infrastructure/` folders created only when populated.
- `common/` for context-less framework plumbing (exception filter, logger, Supabase client factory).
- `shared-kernel/` only when two contexts genuinely share a primitive. Don't lift speculatively.
- Cross-context calls go through the providing context's **published surface** in its `infrastructure/` (e.g. an `@CurrentUser()` decorator from `auth/`), never into another context's `domain/` or `application/` directly.
- Operational endpoints (`/health`, `/metrics`) live in `monitoring/`, not as flat controllers.

### Client (`apps/client/src/`)

- `entities/` = domain (types, value-helpers, ports, constants).
- `services/` = infrastructure adapters + application use cases. The application/domain split is deferred to when sync forces it.
- `stores/` + `components/` = driving adapters (React/UI).
- `utils/` = mostly domain helpers (pure functions).

### `packages/shared`

- Isomorphic API contracts only (Zod schemas + their inferred types).
- No domain entities, no platform APIs (Web Crypto, Dexie, `fs`), no heavy deps. Must run unchanged in Node and the browser.

## Keyboard shortcuts

- Letter-semantic shortcuts use `e.key.toLowerCase()` so AZERTY/Dvorak reach the expected letter. Exception: Option/Alt shortcuts on macOS need `e.code === "KeyX"` because Option remaps `e.key` to special chars
- Editor-level shortcuts call `preventDefault` + `stopPropagation` to keep the global listener from firing
- `window.addEventListener` receives native `KeyboardEvent`; React `onKeyDown` receives `React.KeyboardEvent<T>` — use `e.nativeEvent.code` for code access

## Tests

- Vitest, co-located `*.test.ts` next to the source
- Arrange / Act / Assert with blank lines between phases — no `// Arrange` comments
- One assertion per test; push context into the test name, not extra `expect`s
- Use `it.each` for tabular cases (e.g. every heading level, every HR marker)
- Import `describe`, `it`, `expect` explicitly from `vitest` — no globals

## Git flow

- `main` is protected: PRs required, CI must pass, linear history, no direct pushes
- Feature work branches off `beta`; `beta` → `main` ships to prod. Branches auto-delete on merge.

## Editor architecture

- Textarea + mirror div for syntax highlighting, phantom div for selection measurement
- `EditorEngine` (class in `@editor/engine`) owns formatting logic and exposes `replaceRange` as a method; actions in `@editor/engine/actions` use `as const satisfies` for type-safe names
- Tokenizer lives in `@editor/tokenizer` as a standalone module with co-located test spec
- Keyboard handlers split into `@editor/keyboard` (smart enter, smart pairs, formatting shortcuts); floating UI (toolbar, slash menu) in `@editor/floating`
