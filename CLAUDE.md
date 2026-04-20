# Ardoise — Project conventions

## Collaboration
- Discuss fixes before implementing — wait for explicit approval
- Suggest generic components, design tokens, or shared abstractions when they'd fit — don't add them unilaterally
- If we establish a convention mid-session, propose adding it here so it doesn't evaporate
- After non-trivial implementation, explain choices: distinguish forced (no real alternative) from discussable. For discussable ones, name the alternatives and the tradeoff so the call can be revisited.

## Design system
- Colors are opaque hex only — no rgba tokens
- `dim` is decorative (icons, syntax markers, placeholders, `text-ui-xs` uppercase micro-labels); `subtle` / `muted` are readable secondary text — `subtle` quieter, `muted` more present
- Use typographic utilities (`text-ui-*` / `text-ed-*`) instead of inline sizes
- Base HTML is `font-sans`; only set `font-mono` when overriding
- Design specs in `~/Downloads/ardoise/` are a guide for intent and layout, not a source of truth — the code is the design. Reuse existing typography, colors, icon sizes, and components rather than transcribing spec values

## Code
- Self-documenting code over comments; use naming or extraction
- One commit = one concern; no co-authored-by trailers
- ESLint enforces `curly`, `jsx-sort-props`, `import/order` (`@aliases` as internal)
- `@utils` for shared utilities
- Editor text operations go through `replaceRange`

## Keyboard shortcuts
- Letter-semantic shortcuts use `e.key.toLowerCase()` so AZERTY/Dvorak reach the expected letter. Exception: Option/Alt shortcuts on macOS need `e.code === "KeyX"` because Option remaps `e.key` to special chars
- Editor-level shortcuts call `preventDefault` + `stopPropagation` to keep the global listener from firing
- `window.addEventListener` receives native `KeyboardEvent`; React `onKeyDown` receives `React.KeyboardEvent<T>` — use `e.nativeEvent.code` for code access

## Git flow
- `main` is protected: PRs required, CI must pass, linear history, no direct pushes
- Feature work branches off `beta`; `beta` → `main` ships to prod. Branches auto-delete on merge.

## Editor architecture
- Textarea + mirror div for syntax highlighting, phantom div for selection measurement
- `useEditorCommands` owns formatting logic; actions in `actions.ts` use `as const satisfies` for type-safe names
