# Tags — implementation brief

This document specifies how tags are added to Ardoise: a flat tagging system that lets notes carry any number of named (and later, colored) tags, and lets the command palette filter results by tag.

It is written as an implementation reference: each section captures what something is, the decision and why, how it works, and what depends on it.

---

## 1. Goals & non-goals

### Goals

- **Tags as entities.** Each tag has a stable id, a name (case-insensitive), and later a color. Renaming a tag is a one-row update; notes don't need to be rewritten.
- **Multi-tag per note.** A note carries zero or more tags. No cap.
- **Inline tag creation.** Users add tags from a chip input on the note (editor) — typing a new name creates the tag; typing an existing name autocompletes.
- **Palette filter syntax.** Typing `tag:foo some text` in the command palette filters results to notes carrying `foo` and runs `some text` as a body/title search.
- **Tag autocomplete in the palette.** `tag:ardo` suggests existing tags; Tab commits.
- **Management surface.** A section in settings lists all tags and allows rename, delete, and (v2) color change.

### Non-goals

- **Tag hierarchy / nested tags.** Tags are flat. Hierarchy lives on notes via [[nested-notes]].
- **Inline `#tag` syntax inside note content.** Tags are structured metadata, not content tokens.
- **Sidebar tag filter.** The sidebar `SearchBar` stays title-only in this phase. Real tag-based discovery happens in the palette.
- **Multi-tag palette grammar.** v1 supports a single `tag:foo` token. `tag:a tag:b`, AND/OR rules, and `-tag:` exclusions are explicitly out of scope.
- **Tag trash / soft-delete.** Deleting a tag immediately untags every note that held it. Safety comes from a toast undo, not a trash table.
- **Spaces or punctuation in tag names.** See "Decisions baked in" below.

---

## 2. Decisions baked in

| Decision               | Choice                                                                                      | Reason                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Data model             | Separate `tags` table; notes carry `tagIds: string[]`                                       | Tag rename is one row; notes don't need bulk rewrite.                               |
| Tag name normalization | Case-insensitive matching, case-preserving storage                                          | Typing "Work" then "work" hits the same tag; first-typed casing is what's stored.   |
| Allowed characters     | Letters, digits, dashes, underscores. No spaces, no punctuation                             | Keeps the palette grammar (`tag:foo`) unambiguous to parse. Loosen later if needed. |
| Hierarchy              | Flat                                                                                        | Tree-shaped organization is already handled by nested notes.                        |
| Per-note count         | Unlimited                                                                                   | UI wraps chips. No reason to cap.                                                   |
| Creation flow          | Inline create from the chip input; no settings step required                                | Personal tool — friction-free tag creation matters.                                 |
| Management surface     | Section in settings + inline actions from chip context menu                                 | A dedicated `/tags` route is only worthwhile when tag count grows; not v1.          |
| Deletion               | Hard delete; cascade un-tag every note; toast with undo                                     | Matches the app's minimal-modal feel. Soft-delete on tags is overkill.              |
| Color                  | Not in v1. v2 adds a single accent color per tag                                            | Iterative — name-only is enough to validate the feature.                            |
| Palette grammar v1     | First whitespace-delimited token is parsed as `tag:NAME` if it matches; rest is text search | Strict and unambiguous; multi-tag and exclusions extend the parser later.           |
| Export metadata        | YAML front-matter on each exported `.md` with `id`, `tags` (by name), dates, `parentId`     | Standard format (Obsidian/Hugo/Jekyll); makes round-trip import possible later.     |
| DB version             | Dexie **v6**                                                                                | One migration adds a `tags` table and `tagIds: []` to all notes.                    |

---

## 3. Data model

### Schema change (Dexie v6)

```ts
// src/entities/tag.ts
type Tag = {
    id: string;
    name: string; // case as first entered (e.g. "Work")
    nameLower: string; // indexed; used for case-insensitive uniqueness/autocomplete
    createdAt: Date;
    updatedAt: Date;
    // v2:
    color: AccentColor; // always use primary to fill it, no impact on display before v2
};
```

```ts
// src/entities/note.ts — adds one field
type Note = {
    // ...existing fields...
    tagIds: string[]; // ordered as the user added them
};
```

### Indexes

```ts
// src/services/db.ts — version 6
this.version(6)
    .stores({
        notes: "id, title, updatedAt, lastActivityAt, parentId, pinnedAt, archivedAt, deletedAt, *tagIds",
        tags: "id, nameLower"
    })
    .upgrade(async (tx) => {
        await tx
            .table("notes")
            .toCollection()
            .modify((note) => {
                note.tagIds = [];
            });
    });
```

- `notes.*tagIds` is a Dexie _multiEntry index_: lets us query "all notes carrying tag X" with `db.notes.where("tagIds").equals(tagId)`. Critical for palette filter performance.
- `tags.nameLower` is the case-insensitive uniqueness key; autocomplete also uses it.

### Invariants

- A tag's `nameLower` is unique across the `tags` table.
- Every id in any note's `tagIds` references a live tag. Deleting a tag must remove its id from every note in the same transaction.
- `name` matches `nameLower` ignoring case.
- Tag names match `/^[A-Za-z0-9_-]+$/` and are non-empty.

---

## 4. Service layer

All in `src/services/tags.service.ts` (new) and a small extension to `notes.service.ts`.

### Tag service

```ts
createTag(name: string): Promise<Tag>
// Validates characters, normalizes case, returns existing tag if nameLower already exists.

renameTag(id: string, newName: string): Promise<void>
// Validates characters; rejects if newName collides with another tag (case-insensitive).

deleteTag(id: string): Promise<DeletedTagSnapshot>
// Removes the tag and strips its id from every note carrying it, in one Dexie transaction.
// Returns a snapshot with the tag + the list of affected note ids, so the UI can offer undo.

restoreDeletedTag(snapshot: DeletedTagSnapshot): Promise<void>
// Re-inserts the tag and re-adds its id to the snapshotted notes.

listTags(): Promise<Tag[]>
listTagsWithUsage(): Promise<Array<Tag & { noteCount: number }>>
findTagByName(name: string): Promise<Tag | null>  // case-insensitive
searchTags(prefix: string): Promise<Tag[]>         // for autocomplete; prefix matched on nameLower
```

### Note service additions

```ts
addTagToNote(noteId: string, tagId: string): Promise<void>
// No-op if the note already carries the tag. Bumps note's updatedAt.

removeTagFromNote(noteId: string, tagId: string): Promise<void>
// Bumps note's updatedAt.
```

`addTagToNote` and `removeTagFromNote` are thin — the chip input UI calls them via the existing autosave path. They also drive the `lastActivityAt` cascade introduced for [[nested-notes]] (editing tags counts as activity).

### Deletion snapshot

```ts
type DeletedTagSnapshot = {
    tag: Tag;
    taggedNoteIds: string[];
};
```

Kept in memory (Zustand store) for the duration of the undo toast. If undo is clicked, `restoreDeletedTag` replays it. If the toast times out (~5s), the snapshot is dropped.

---

## 5. Palette grammar

### Parser

A small pure function in `src/components/palette/parseQuery.ts`:

```ts
type ParsedQuery = {
    tagFilter: string | null; // lowercase tag name to match (resolved to tag id at search time)
    text: string; // remaining text for title/content search
};

function parseQuery(raw: string): ParsedQuery;
```

Rules for v1:

- If the input starts with `tag:NAME` (NAME matching `[A-Za-z0-9_-]+`), the token is consumed as `tagFilter` (lowercased); the rest of the input becomes `text`.
- Otherwise, the whole input is `text`.
- A trailing `tag:` with no name (user is mid-typing) is treated as `tagFilter = ""` so the autocomplete UI can offer the full tag list.

Co-located test file covers: no prefix, prefix only, prefix + text, prefix with invalid chars, half-typed `tag:`.

### Result filtering

`usePaletteResults` consumes `ParsedQuery`:

- If `tagFilter` is non-null, resolve it to a tag id (via `findTagByName`). If no tag matches, return empty results.
- If a tag id is resolved, get the candidate notes via the multiEntry index: `db.notes.where("tagIds").equals(tagId)`.
- Apply the existing title + content matching against `text` to those candidate notes (or to all notes if `tagFilter` is null).

### Autocomplete

When the parser exposes `tagFilter` as a non-null partial (the user is typing `tag:ar`), the palette swaps its result list for a tag-suggestion list:

- Suggestions come from `searchTags(prefix)`.
- Tab or right-arrow commits the highlighted suggestion: input becomes `tag:ardoise ` (note trailing space) so the user can continue typing the text search.
- Enter on a suggestion commits the tag and immediately runs the (possibly empty) text search.

---

## 6. UI changes

### Editor

| File                                                                    | Change                                                                                                                                       |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/pages/notes/note/Note.tsx` (or its header subcomponent) | Render a chips row below the title. Renders existing tags + a chip-input for adding more.                                                    |
| `src/components/pages/notes/note/TagChipsInput.tsx` _(new)_             | Chip input: text field with autocomplete popover sourced from `searchTags`. Enter creates new or selects suggestion; ✕ on a chip removes it. |
| `src/components/pages/notes/note/TagChip.tsx` _(new)_                   | Reusable chip component. Read-only variant (viewer); editable variant (with remove button).                                                  |

### Viewer

Same chips row, read-only. Clicking a chip opens the palette pre-filled with `tag:that-tag `.

### Settings

| File                                                         | Change                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/components/pages/settings/...` (existing settings page) | Add a "Tags" section listing every tag with its usage count, rename action, delete action, and (v2) color picker. |
| `src/components/pages/settings/TagsSection.tsx` _(new)_      | List + inline rename + delete-with-toast-undo.                                                                    |

### Palette

| File                                                   | Change                                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/palette/parseQuery.ts` _(new)_         | Pure query parser.                                                                                                              |
| `src/components/palette/usePaletteResults.ts`          | Consume `ParsedQuery`; use the multiEntry index when `tagFilter` is set.                                                        |
| `src/components/palette/CommandPalette.tsx`            | Render the committed `tag:X` token as a pill at the start of the input; show the tag-suggestion list when in autocomplete mode. |
| `src/components/palette/TagSuggestionList.tsx` _(new)_ | The autocomplete UI.                                                                                                            |

### Toast system

If a toast component doesn't already exist in the codebase, this feature introduces one. (Worth confirming before commit 6 — if there's none, that commit should split out the toast primitive as an iso-functional prep.)

---

## 7. Tag deletion UX

The destructive surface is the only place tag UX gets nuanced. Decisions:

- **Delete button** in the settings tag row (and from the chip context menu).
- **No modal.** Deletion happens immediately.
- **Toast appears**: `Deleted "Work" — also removed from 12 notes. [Undo]`.
- **Undo window**: ~5 seconds. While the toast is up, clicking Undo replays the snapshot.
- **Snapshot scope**: the tag's id, name, and the list of note ids that carried it. We do _not_ snapshot the notes' full state — just the relationship — so undo is small and fast.
- **Concurrent deletes**: each delete owns its own toast; toasts stack vertically and time out independently.
- **Refresh during undo window**: the snapshot is in memory only. If the user refreshes the page during the undo window, the delete is committed (no recovery). This is acceptable — the toast is best-effort.

---

## 8. Edge cases & invariants

| Case                                                                 | Behavior                                                                                                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Create a tag whose name (case-insensitive) already exists            | Return the existing tag; the input commits it without creating a duplicate.                                                               |
| Rename to a name that case-insensitive-matches another tag           | Rejected with an inline error. (Merging is a future feature; v1 stays explicit.)                                                          |
| Delete a tag during another tag's undo window                        | Both undo toasts stack and operate independently.                                                                                         |
| Type characters that don't match `/[A-Za-z0-9_-]/` in the chip input | Filtered out at input time; no error shown.                                                                                               |
| Type a name longer than some sane max                                | No hard cap in v1, but UI truncates display. (Worth revisiting if abuse appears.)                                                         |
| Note carries a tag id that no longer exists                          | Should not happen given the cascade-on-delete invariant. If it does (stale state), render is graceful — the chip is dropped from the row. |
| Palette typed `tag:` with no name yet                                | Show full tag list as suggestions; the parser exposes this as `tagFilter = ""`.                                                           |
| Palette typed `tag:nonexistent foo bar`                              | `tagFilter` resolves to no tag → empty results, with a "No tag named 'nonexistent'" hint.                                                 |
| User has the same tag chip on two notes and renames it               | Both notes immediately reflect the new name because they reference tag id, not name.                                                      |

---

## 9. Open UX questions (cross-reference: designer brief)

Pending designer input:

1. **Chip placement** in editor and viewer — below the title, in a header strip, inline next to title.
2. **Tag input affordance** — always-visible input below chips, or a "+ Add tag" button that opens an input.
3. **Settings list layout** — table with name + usage count + actions, or a chip grid.
4. **Palette token visual** — does `tag:ardoise` render as plain text in the input, or as a chip-like pill once committed.
5. **Empty states** — settings (no tags yet), palette (`tag:foo` matches nothing), chip input (note has no tags).
6. **Color palette** (v2) — which accent colors are eligible.

---

## 10. Commit sequence

| #   | Commit                                     | Type           | Effect                                                                                                                                                                                |
| --- | ------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `refactor: add tags schema`                | iso-functional | Dexie v6 migration: `tags` table + `tagIds: []` on every note. No UI change.                                                                                                          |
| 2   | `feat: tag notes from the editor`          | functional     | Chip input below the title in the editor; inline-create + autocomplete from existing tags; case-insensitive name resolution.                                                          |
| 3   | `feat: show tags on the note viewer`       | functional     | Read-only chips on the viewer; clicking a chip opens the palette with `tag:that-tag` pre-filled.                                                                                      |
| 4   | `feat: filter palette results by tag`      | functional     | Palette parses `tag:foo` prefix; uses the multiEntry index; remaining text is the body search.                                                                                        |
| 5   | `feat: autocomplete tags in the palette`   | functional     | Typing `tag:ardo` suggests existing tags; Tab commits.                                                                                                                                |
| 6   | `feat: manage tags in settings`            | functional     | Tags section in settings: list + usage count + rename + delete-with-toast-undo. (May depend on a small iso-functional commit introducing a toast primitive if one doesn't exist yet.) |
| 7   | `feat: color tags from the accent palette` | functional     | v2 polish; color stored on the tag entity; chips use it.                                                                                                                              |
| 8   | `feat: include note metadata in note export` | functional   | Each exported `.md` carries a YAML front-matter block with `id`, `tags` (by name), `createdAt`, `updatedAt`, and `parentId`. Sets up roundtrip-able exports.                          |

After step 2 the feature is usable end-to-end inside the editor. After step 4 it's a discovery feature in the palette. Step 6 makes tag housekeeping possible. Step 7 is iterative polish. Step 8 surfaces all the structured metadata that exists by then in the exported markdown.

---

## 11. Export

Today the export feature writes flat `.md` files containing only `# Title` + content. After this feature ships, each file is prefixed with a YAML front-matter block.

### Format

```markdown
---
id: 8f3a9c2d-4b1e-4f0a-9c7d-2a5b8e1f3c0d
tags: [Work, Ardoise]
createdAt: 2026-04-12T10:30:00Z
updatedAt: 2026-05-14T14:22:00Z
parentId: 12345678-90ab-cdef-1234-567890abcdef  # omitted if null
---

# Note title

Note content...
```

### Field rules

- **`id`**: the note's full UUID. Stable identifier for any future import.
- **`tags`**: array of tag **names** (not ids). Human-readable; if the user edits the file or imports into a different tool, names roundtrip cleanly. We accept that tag-renames after export would orphan the relationship on re-import — that's a known cost.
- **`createdAt` / `updatedAt`**: ISO-8601, UTC.
- **`parentId`**: the parent note's UUID. Only present when non-null. (Relies on the [[nested-notes]] feature having shipped.)
- Future fields (e.g. `pinnedAt`, tag colors) can be added without breaking format.

### Loader compatibility

YAML front-matter at the top of a markdown file is parsed correctly (or ignored as content) by every major tool we care about (Obsidian, Hugo, Jekyll, plain editors). No special escaping needed in note content unless the user starts a note with a literal `---` line (rare; acceptable risk).
