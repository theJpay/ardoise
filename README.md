<p align="center">
  <img src="./docs/logo.svg" alt="Ardoise" width="80" height="80" />
</p>

<h1 align="center">Ardoise</h1>

<p align="center">Local-first markdown notes, in your browser.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)

**[Live demo →](https://ardoise.page)**

## What is Ardoise?

Ardoise is a markdown note-taking app that runs entirely in your browser. Your notes are stored locally in IndexedDB — nothing syncs, nothing phones home, no servers involved.

It's built for people who prefer plain text and keyboard shortcuts over collaborative walls of blocks. Write in markdown with inline syntax highlighting, preview without switching files, navigate between notes with `⌘⇧F`, and insert structure with a slash menu. If you've ever wanted something between iA Writer and a disposable scratch pad, that's roughly the shape.

**Privacy by construction:** there is no backend to breach. Your notes never leave your device because there's nowhere for them to go.

## Features

- **Inline markdown syntax highlighting** — see formatting as you type, not after
- **Live preview mode** — switch between editing and reading with `⌘⇧M`
- **Command palette** — type `/` in the editor to insert headings, code blocks, lists
- **Floating toolbar on selection** — for when you'd rather click
- **Keyboard-first** — every action has a shortcut; press the `?` icon to see them all
- **Smart list continuation** — hit Enter on a list item to continue, Enter on an empty one to exit
- **Auto-save** — every keystroke, stored locally, never lost
- **Export all notes** — download a zip of markdown files anytime
- **Spellcheck, default mode, and dark-first aesthetic** — because yes

## Built with

- [**React 19**](https://react.dev/) + [**TypeScript**](https://www.typescriptlang.org/) — strict mode, no `any` outside one typed generic
- [**Vite**](https://vitejs.dev/) — dev server and build
- [**Tailwind v4**](https://tailwindcss.com/) — design system via CSS tokens
- [**Dexie**](https://dexie.org/) — IndexedDB wrapper for local persistence
- [**TanStack Query**](https://tanstack.com/query) — data layer on top of Dexie
- [**React Router**](https://reactrouter.com/) — routing
- [**unified** / **remark** / **rehype**](https://unifiedjs.com/) — markdown pipeline with sanitization
- [**Zustand**](https://zustand-demo.pmnd.rs/) — small shared state (sidebar, deletion, onboarding)
- [**Floating UI**](https://floating-ui.com/) — positioning for popovers and palettes
- [**fflate**](https://github.com/101arrowz/fflate) — export zip generation
- [**Lucide**](https://lucide.dev/) — icons

## Run locally

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
- `npm run lint` — ESLint
- `npm run format` — Prettier

## About this project

Ardoise started as a way to learn React 19 and TypeScript by building something I'd actually use. I care about tools that respect user autonomy, and this is my attempt at one.

The technical bits I wanted to explore:

- **Inline syntax highlighting in a textarea** — most markdown editors break native undo, spellcheck, or IME to get highlighting. Ardoise keeps all of it by overlaying a mirror `<div>` on a transparent textarea.
- **Local-first without the cloud fallback** — IndexedDB as the primary store, no sync, no account system. Every design decision leaned into this.
- **Keyboard-first interactions** — command palette, floating toolbar, global shortcuts, all discoverable through a `?` panel.
- **A design system that doesn't drift** — opaque hex tokens only, typographic utilities (`text-ui-xs` through `text-ui-h1`), strict rules about when to use `dim` vs `subtle` vs `muted`.

If you're evaluating me as an engineer, the most interesting files are probably:

- [`src/components/pages/notes/note/editor/utils/tokenize.ts`](./src/components/pages/notes/note/editor/utils/tokenize.ts) — the hand-rolled markdown tokenizer
- [`src/components/pages/notes/note/editor/utils/replaceRange.ts`](./src/components/pages/notes/note/editor/utils/replaceRange.ts) — how native undo is preserved via `execCommand`
- [`src/components/pages/notes/note/editor/useSmartKeys.ts`](./src/components/pages/notes/note/editor/useSmartKeys.ts) — smart list continuation and Tab indentation
- [`src/hooks/useNotesShortcuts.ts`](./src/hooks/useNotesShortcuts.ts) — layered keyboard shortcut handling

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Short version: this is a personal project. Issues are welcome; pull requests are not.

## License

[MIT](./LICENSE) © 2026 Jules Paris
