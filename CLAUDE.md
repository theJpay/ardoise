# Ardoise — Project conventions

## Design system
- Colors are opaque hex only — no rgba tokens
- `dim` is decorative (icons, syntax markers, placeholders, and structural micro-labels at `text-ui-xs` uppercase). `subtle` and `muted` are for readable secondary text — pick `subtle` for quieter, `muted` for more present
- Use typographic utilities — `text-ui-xs` / `text-ui-sm` / `text-ui-base` / `text-ui-h2` / `text-ui-h1` / `text-ed-body` — not inline sizes
- Base HTML is `font-sans`; only declare `font-mono` when overriding. Don't spray `font-sans` on elements.
- Design specs live in `~/Downloads/ardoise/` (HTML files)

## Code
- Always discuss fixes before implementing — wait for explicit approval
- Self-documenting code over comments; use naming or extraction rather than inline explanations
- One commit = one concern. Split mixed changes across commits.
- ESLint enforces: `curly` (always braces), `jsx-sort-props`, `import/order` with `@aliases` as internal
- No co-authored-by on commits
- `@utils` for shared utilities (`UnreachableError`, `isMac`, `exportNotesToZip`)
- Editor text operations go through `replaceRange` (supports native undo via `execCommand`)

## Keyboard shortcuts
- Letter-semantic shortcuts use `e.key.toLowerCase()` so AZERTY/Dvorak layouts reach the expected letter (⌘⇧M = hit M, wherever it sits)
- Only `e.code` exception: shortcuts using Option/Alt on macOS (e.g. ⌘⌥N) — Option remaps `e.key` to special chars, so `e.code === "KeyN"` is required
- Editor-level shortcuts call `preventDefault` + `stopPropagation` to prevent the global listener from also firing
- Event listeners: `window.addEventListener` receives native `KeyboardEvent`; React `onKeyDown` props receive `React.KeyboardEvent<T>` (use `e.nativeEvent.code` to access code if needed)

## Git flow
- `main` is protected — no direct pushes, PRs required, CI check must pass, linear history
- Feature work branches off `beta`; merge to `beta` for integration, `beta` → `main` PRs ship to prod
- Branch auto-deletes on merge

## Editor architecture
- Textarea + mirror div overlay for syntax highlighting
- Phantom div for selection position measurement
- `useEditorCommands` hook owns all formatting logic
- Actions in `actions.ts` use `as const satisfies` for type-safe names
