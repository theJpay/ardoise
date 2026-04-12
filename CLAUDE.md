# Ardoise — Project conventions

## Design system
- Colors are opaque hex only — no rgba tokens
- `dim` is decorative (icons, syntax markers, placeholders). `subtle` is for readable secondary text
- Use `text-ui-xs`, `text-ui-sm`, `text-ui-base`, `text-ed-body` utilities — not inline sizes
- Design specs live in `~/Downloads/ardoise/` (HTML files)

## Code
- Always discuss fixes before implementing — wait for explicit approval
- ESLint enforces: `curly` (always braces), `jsx-sort-props`, `import/order` with `@aliases` as internal
- No co-authored-by on commits
- `@utils` for shared utilities (`UnreachableError`)
- Editor text operations go through `replaceRange` (supports native undo via `execCommand`)

## Editor architecture
- Textarea + mirror div overlay for syntax highlighting
- Phantom div for selection position measurement
- `useEditorCommands` hook owns all formatting logic
- Actions in `actions.ts` use `as const satisfies` for type-safe names
