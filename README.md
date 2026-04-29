<p align="center">
  <img src="./docs/logo.svg" alt="Ardoise" width="80" height="80" />
</p>

<h1 align="center">Ardoise</h1>

<p align="center">Local-first markdown notes, in your browser.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)

**[Live demo →](https://ardoise.page)** · **[Open a sample note →](https://ardoise.page/share#H4sIACj68WkAA01SzYoTQRB-lY9ZwQTycxEPERTxIrhedleCbALTO1OZadPpbqtrko0h4M2LRw--ge-VJ7F6skH71FRVf_391KEQK46KWTEnV4UNQQLech1somJUVMELedH259A9ZwKTqa1vIK1NsB6pNUw1NqGmCe5agg9C0B75Smt1nhEtf7q5hpVEboXT919ovtkYqR7hwSR6-WL8ND3S50jEW2J9uA1uS_UEN7RiSi2Mr7EPHYNqhcLWeJvaycIv_J2-EsNyboed72mkEe5DpDMBE-Ny0IrENJtOzVngJJqGhj3C1RXmrZGsXnifK2OUp5-_Tz_-fCy12jSOEiLT1tLuv-aHEvmL1P-h_m0yyWgciVA_9qbEQEIcs21aARvrhmpa2KlDqnKf7yxVJ_3wtLz4lSWGbIK6oVqTcFdJx4rZc73dezGPaBXUZWCNJHeegvtXT9gYXtfZEeud9epDyiZB9lEDe6em48GFap3QkKg-FcOqwwVOs4xYlqWkhV91vhIbPBomkoE3G5plUvrv8HLBYeGhh0mJepTvybkwwrNDnj6Wrxb-2ONl2Ne4tkk0oK_dOahsm5ikPIxz-NIlwS7wus9mjPvHpW6B0RFdu76AJeZsddUuiV-qt3khddWws6IrgxVb8nVx_AswTifS6QIAAA)**

## What is Ardoise?

Ardoise is a markdown notes app that runs entirely in your browser. Notes live in IndexedDB on your device — no server, no sync, no account.

It's built for keyboard-first writers who'd rather see syntax inline than wait for a render pass, and who prefer plain text over collaborative block walls.

## Features

- **Writing** — inline syntax highlighting (incl. code blocks), live preview (`⌘⇧M`), smart list continuation, floating toolbar, slash menu (`/`)
- **Navigating** — command palette (`⌘⇧K`), shortcut panel (`?`), sortable sidebar
- **Organizing** — pin, archive, and trash with 30-day auto-sweep
- **Sharing & exporting** — copy, download, shareable links, zip export
- **Looks** — light + dark themes with five accent colors

## About this project

Ardoise began as a way to learn React 19 and TypeScript by building something I'd actually use. It's grown into a serious personal project and a tool I rely on daily.

The technical bits I wanted to explore:

- **Inline syntax highlighting in a textarea** — most markdown editors break native undo, spellcheck, or IME to get highlighting. Ardoise keeps all of it by overlaying a mirror `<div>` on a transparent textarea.
- **Local-first without the cloud fallback** — IndexedDB as the primary store, no sync, no account system. Every design decision leaned into this.
- **Keyboard-first interactions** — command palette, slash menu, floating toolbar, global shortcuts, all discoverable through a `?` panel.
- **A design system that doesn't drift** — opaque hex tokens only, typographic utilities (`text-ui-xs` through `text-ui-h1`), strict rules about when to use `dim` vs `subtle` vs `muted`.

### Stack

Built on [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict mode), [Vite](https://vitejs.dev/), [Tailwind v4](https://tailwindcss.com/), [Dexie](https://dexie.org/) for IndexedDB, [TanStack Query](https://tanstack.com/query) on top of Dexie, [React Router](https://reactrouter.com/), the [unified](https://unifiedjs.com/) markdown pipeline, [Zustand](https://zustand-demo.pmnd.rs/), [Floating UI](https://floating-ui.com/), [fflate](https://github.com/101arrowz/fflate), [lowlight](https://github.com/wooorm/lowlight), and [Lucide](https://lucide.dev/).

### Run locally

```bash
git clone https://github.com/theJpay/ardoise.git
cd ardoise
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

Available scripts:

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm test` — run the Vitest suite
- `npm run lint` — ESLint
- `npm run format` — Prettier

### Interesting files

If you're evaluating me as an engineer, the most interesting files are probably:

- [`src/editor/tokenizer/`](./src/editor/tokenizer) — the hand-rolled markdown tokenizer (with a 659-line test spec)
- [`src/editor/engine/EditorEngine.ts`](./src/editor/engine/EditorEngine.ts) — formatting actions and a `replaceRange` method that preserves native undo via `execCommand`
- [`src/editor/keyboard/`](./src/editor/keyboard) — smart list continuation, smart pairs, formatting shortcuts
- [`src/hooks/useNotesShortcuts.ts`](./src/hooks/useNotesShortcuts.ts) — layered keyboard shortcut handling

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Short version: this is a personal project. Issues are welcome; pull requests are not.

## License

[MIT](./LICENSE) © 2026 Jules Paris
