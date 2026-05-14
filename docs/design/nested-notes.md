# Nested notes — implementation brief

This document specifies how the sidebar moves from a flat note list to a tree of nestable notes. It is the engineering counterpart to the design brief sent to the designer.

It is written as an implementation reference: each section captures what something is, the decision and why, how it works, and what depends on it.

---

## 1. Goals & non-goals

### Goals

- **Nestable notes.** Any note can have child notes, up to a max depth of 4 (root → child → grandchild → great-grandchild).
- **Single entity.** No separate folder concept. A note with children is still a note with its own content.
- **Tree-aware sidebar.** Sidebar renders the hierarchy with expand/collapse. Existing flat sorting is preserved as one of the modes.
- **Move via menu.** A note can be moved to a different parent through a "Move to…" picker. Drag-and-drop is explicitly out of scope for this phase.
- **Cascading delete.** Soft-deleting a parent soft-deletes the whole subtree.
- **Activity bubbles up.** Editing a child surfaces its ancestors in recency-sorted views, without making the parent's own "last edited" badge lie about its content.

### Non-goals (this phase)

- **Drag-and-drop** for reparenting or sibling reorder. Deferred to a follow-up phase.
- **Manual sibling ordering.** Siblings are sorted by the active sort option (Updated / Created / Alphabetical); there is no manual `position` field yet.
- **Folders as a separate entity.** Not adding a `folders` table.
- **Cross-device sync of expand/collapse state.** Per-device, kept in `localStorage`.
- **Tag-based or virtual hierarchies.** A note has exactly one parent (or null).

---

## 2. Decisions baked in

| Decision                    | Choice                                                                  | Reason                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Hierarchy model             | Single `notes` entity with `parentId`                                   | Smallest leap from today's schema; matches Notion's mental model.                                                         |
| Max depth                   | **4** levels                                                            | Absorbs the "Area / Project / Topic / Note" pattern without making indent visuals cramped. Single constant; can be tuned. |
| Sibling order               | By active sort option (no `position` field)                             | DnD is out of scope, so fractional indexing isn't needed yet.                                                             |
| New note location           | Global → root; "New child" from menu; inline "+" inside expanded parent | Explicit user intent at each entry point; no surprise placements.                                                         |
| Move                        | "Move to…" tree picker via context menu                                 | Covers reparenting without DnD's complexity.                                                                              |
| Delete cascade              | Subtree cascades on soft-delete                                         | Soft-delete is recoverable; matches Notion; no confirmation needed.                                                       |
| Restore semantics           | Re-parent to root if parent is still trashed                            | Restore stays a per-note operation.                                                                                       |
| Recency cascade             | Separate `lastActivityAt` field, maintained on save                     | Keeps `updatedAt` accurate for display while letting sort bubble parents up.                                              |
| Expand/collapse persistence | `localStorage`, per-device                                              | UI state; synchronous read avoids first-paint flicker.                                                                    |
| Filter behavior             | Filter flattens the tree; parent path on results is a v2 polish         | Tree adds visual noise during search; flat is faster to scan in a narrow sidebar.                                         |
| Export hierarchy            | Mirror the tree as folders in `notes/`; `archived/` and `trash/` stay flat | Filesystem-native; matches Notion-export pattern. Non-canonical states don't need to preserve hierarchy.                  |
| DB version                  | Dexie **v5**                                                            | One migration adds `parentId` and `lastActivityAt`.                                                                       |

---

## 3. Data model

### Schema change (Dexie v5)

```ts
// src/entities/note.ts
type Note = {
    id: string;
    content: string;
    title: string;
    createdAt: Date;
    updatedAt: Date; // last edit to THIS note's own content
    lastActivityAt: Date; // max(updatedAt, any descendant's lastActivityAt)
    parentId: string | null;
    pinnedAt: Date | null;
    archivedAt: Date | null;
    deletedAt: Date | null;
};
```

### Index keys

```ts
// src/services/db.ts — version 5
this.version(5)
    .stores({
        notes: "id, title, updatedAt, lastActivityAt, parentId, pinnedAt, archivedAt, deletedAt"
    })
    .upgrade(async (tx) => {
        await tx
            .table("notes")
            .toCollection()
            .modify((note) => {
                note.parentId = null;
                note.lastActivityAt = note.updatedAt;
            });
    });
```

- `parentId` is indexed so we can query a parent's children without scanning all notes.
- `lastActivityAt` is indexed so the flat "Recent — flat" sort can use it.

### Invariants

- `parentId` is either `null` (root) or points to an existing, non-deleted note.
- The chain of parents from any node terminates at root within ≤ 4 steps.
- `lastActivityAt >= updatedAt` for every note.
- A deleted note (`deletedAt !== null`) is never shown in the sidebar. Its `parentId` is preserved so that, if a parent is restored, its trashed children can theoretically be restored too (out of scope here but the data supports it).
- No cycles. `moveNote` must reject any move where the new parent is the note itself or one of its descendants.

---

## 4. Service layer

All in `src/services/notes.service.ts`.

### New / changed functions

```ts
// Creates a note. parentId defaults to null (root).
// Enforces depth cap: rejects if depth(parent) === MAX_DEPTH - 1.
createNote(write: NoteWrite, parentId?: string | null): Promise<Note>

// Moves a note to a new parent (null = root).
// Validates: no cycle, no depth-cap violation, target exists.
moveNote(id: string, newParentId: string | null): Promise<void>

// Soft-deletes a note and all its descendants in one transaction.
deleteNote(id: string): Promise<void>

// Bumps lastActivityAt on the note and all ancestors up to root.
// Called from any write path that changes content/title.
private bumpLastActivity(id: string, when: Date): Promise<void>
```

### Cascading writes

- **On any content/title edit** (`updateNote`, autosave path): set `updatedAt = lastActivityAt = now`, then walk ancestors and set their `lastActivityAt = max(existing, now)`. Bounded by depth (≤4 hops). One Dexie transaction.
- **On soft-delete** (`deleteNote`): collect the subtree (BFS or recursive query on `parentId` index), set `deletedAt = now` on each, in one transaction.
- **On move** (`moveNote`): validate, then atomically update `parentId`. Recompute `lastActivityAt` on the _new_ ancestor chain (bump them with the moved subtree's max `lastActivityAt`). The old ancestor chain's `lastActivityAt` is _not_ recomputed — leaving it stale is acceptable; recency is a sort hint, not an audited value.

### Validation helpers

```ts
function depthOf(noteId: string, notes: Note[]): number;
function subtreeDepthOf(noteId: string, notes: Note[]): number;
function descendantsOf(noteId: string, notes: Note[]): Note[];
function wouldExceedDepth(
    targetParentId: string | null,
    subtreeRootId: string,
    notes: Note[]
): boolean;
```

These operate on the in-memory note array (already loaded by liveQuery), not Dexie queries — cheap and synchronous.

---

## 5. Live queries & tree assembly

The Dexie liveQuery in `src/stores/notes.store.ts` keeps returning the flat array of non-deleted notes. Tree assembly happens client-side from the flat list.

### Tree shape

```ts
type NoteTreeNode = {
    note: Note;
    children: NoteTreeNode[];
    depth: number;
};
```

### Assembly rules

- Group notes by `parentId`.
- A note whose `parentId` doesn't resolve to a live note (orphan, e.g. due to a partially-failed delete or a future bug) is rendered at root. This is a safety fallback — orphans should not exist under normal operation.
- Within each parent, sort children by the active sort option (Updated → uses `lastActivityAt`; Created → `createdAt`; Alphabetical → `title`).
- The "Recent — flat" sort skips assembly entirely: flat list ordered by `lastActivityAt` desc.

### Where it lives

A pure `buildNoteTree(notes, sort)` helper in `src/utils/buildNoteTree.ts`. Co-located test file covers: empty input, single note, deep chain at the cap, orphan re-rooting, sibling sort.

---

## 6. UI changes

### Components

| File                                                          | Change                                                                                                            |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/components/pages/notes/sidebar/SideBar.tsx`              | Replace flat `NoteList` with tree renderer. Adds the "Recent — flat" sort option.                                 |
| `src/components/pages/notes/sidebar/NoteList.tsx`             | Reworked or replaced by `NoteTree.tsx`: recursive renderer, indent step per level, expand/collapse via chevron.   |
| `src/components/pages/notes/sidebar/NoteItem.tsx`             | Accepts `depth`, `hasChildren`, `isExpanded`, `onToggle`. Date badge still shows `updatedAt`.                     |
| `src/components/pages/notes/sidebar/NewChildRow.tsx` _(new)_  | The inline "+" affordance rendered after a parent's children when expanded.                                       |
| `src/components/pages/notes/sidebar/MoveToPicker.tsx` _(new)_ | Modal or popover with a searchable tree picker. Disables: the note itself, its descendants, depth-cap violations. |
| Context menu                                                  | Add "New child" and "Move to…" actions. Disable "New child" when parent is at depth 4.                            |

### Sort dropdown

- Existing options keep their labels: **Updated**, **Created**, **Alphabetical**. In the tree, they sort _within each parent_.
- Adds **Recent — flat** which bypasses the tree and renders a flat list sorted by `lastActivityAt`.

### Active-note auto-expand

When the active note (from URL `:noteId`) is inside a collapsed branch, the sidebar expands the path on mount or on navigation. This is in-memory only; it should not persist collapsed branches as suddenly expanded — only the active path's ancestors.

### Filter behavior

When the sidebar `SearchBar` has a non-empty `q`, tree assembly is bypassed and the sidebar renders a flat list of notes whose title contains the query (current behavior preserved).

- Filter applies _before_ sort: the matched notes are then ordered by the active sort option.
- The pinned section continues to show pinned matches above non-pinned matches; it's hidden when no pinned note matches.
- The persisted expanded set is untouched during filter — when `q` clears, the tree returns to its previous expanded state.

**Parent-path refinement (v2)**: a follow-up commit adds a dim single-line parent path beneath each result row (e.g. `Work › Q3 Planning`), giving location context without re-introducing the tree. The designer brief asks for both visual states so this can ship as a drop-in polish later — particularly once tags arrive, where the same path treatment applies to `tag:` filter results in the palette.

---

## 7. State & persistence

### Expanded set

- Stored in `localStorage` under a single key (e.g. `ardoise.sidebar.expanded`) as a JSON array of note ids.
- Read synchronously into a Zustand store on app init so the tree paints in correct state on the first frame.
- A note that gets deleted (or moved out of view) is not actively pruned from the set — its id becomes inert. Periodic pruning is unnecessary at expected scale.

### Pinned section

UX call deferred to designer. From a code standpoint, both options are cheap:

- Keeping a separate "Pinned" section: same `pinnedAt` filter as today, rendered as a flat group above the tree.
- Folding pinning into the tree: sort comparator gives pinned notes priority within each level.

---

## 8. Edge cases & invariants

| Case                                          | Behavior                                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Move a note onto itself                       | Rejected; picker disables the row.                                                                                      |
| Move a note into one of its descendants       | Rejected; picker disables those rows.                                                                                   |
| Move where subtree depth + target depth > 4   | Rejected; picker disables and tooltips why.                                                                             |
| Delete a parent                               | Cascading soft-delete of the whole subtree in one transaction.                                                          |
| Restore a child whose parent is still deleted | Re-parent to root on restore.                                                                                           |
| Orphan (parentId points to non-live note)     | Rendered at root by the tree builder. Should not occur under normal operation.                                          |
| Create a child of a depth-4 note              | Action is disabled in the menu; service-layer guard rejects it as a defense-in-depth check.                             |
| Active note inside a collapsed branch         | Auto-expand the path on navigation, without changing the persisted expanded set elsewhere.                              |
| Editing a child note                          | `updatedAt` and `lastActivityAt` bump on self; `lastActivityAt` bumps on every ancestor up to root, in one transaction. |
| Moving a subtree                              | Old ancestors' stale `lastActivityAt` is acceptable; new ancestors get bumped with the subtree's max activity.          |

---

## 9. Open UX questions (cross-reference: designer brief)

These are pending designer input and shape parts of the implementation:

1. **Pinned section** — kept separate vs folded into the tree.
2. **Sort dropdown** in tree mode — per-level sort confirmed; visual of the "Recent — flat" option to design.
3. **Breadcrumb in note view** — yes/no/shape.
4. **Inline "+" affordance** — always-visible vs hover-revealed.
5. **Depth-4 cap cues** — disabled affordance state and tooltip wording.
6. **Keyboard navigation** — arrow / left-right semantics, so visuals don't preclude them later.

---

## 10. Commit sequence

Each row is a single shippable concern. Iso-functional commits land first; functional slices follow.

| #   | Commit                                            | Type           | Effect                                                                                                                                                                                                                                            |
| --- | ------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `refactor: add hierarchy fields to notes schema`  | iso-functional | Dexie v5 migration adds `parentId` (null) and `lastActivityAt` (= `updatedAt`). No UI change.                                                                                                                                                     |
| 2   | `refactor: render sidebar from a note tree`       | iso-functional | Tree assembly + recursive renderer + expand/collapse + localStorage state. When `SearchBar` has a query, falls through to a flat list of title matches (today's behavior preserved). All notes still at root, so rendering is visually unchanged. |
| 3   | `feat: create a child note from the context menu` | functional     | "New child" action; depth-cap guard; new note opens.                                                                                                                                                                                              |
| 4   | `feat: cascade delete subtrees`                   | functional     | Soft-delete walks the subtree; restore re-parents to root when needed.                                                                                                                                                                            |
| 5   | `feat: append a child via inline "+"`             | functional     | Affordance row inside expanded parents.                                                                                                                                                                                                           |
| 6   | `feat: move a note to another parent`             | functional     | "Move to…" picker with disabled-row rules.                                                                                                                                                                                                        |
| 7   | `feat: bubble recent activity up the tree`        | functional     | `lastActivityAt` cascade on save; per-level "Updated" sort now reorders parents by subtree activity.                                                                                                                                              |
| 8   | `feat: keep flat-by-recency as a sort option`     | functional     | "Recent — flat" sort renders the legacy flat view ordered by `lastActivityAt`.                                                                                                                                                                    |
| 9   | `feat: show parent path on filter results`        | functional     | Subtle dim path beneath each row when the sidebar filter is active. Drop-in polish; pairs well with the tag filter feature (same treatment applies to `tag:` results in the palette).                                                             |
| 10  | `feat: preserve hierarchy in note export`         | functional     | The export ZIP's `notes/` folder mirrors the tree (parent-as-sibling pattern). `archived/` and `trash/` stay flat.                                                                                                                                |

After step 3 the feature is usable but limited (you can create children but not move existing notes in). After step 6 it's complete. Steps 7–9 are recency-sort and filter polish. Step 10 brings export in line with the new model.

DnD reparent, sibling reorder, and per-parent manual ordering live in a future phase and would introduce a `position` field (likely fractional indexing) plus `@dnd-kit/sortable`.

---

## 11. Export

The export feature (`src/utils/export.ts`, settings page button) produces a ZIP with `notes/`, `archived/`, `trash/` folders. Today each note is a flat `{slug}-{idPrefix}.md` file at the root of its folder, containing only `# Title` + content.

After this feature ships, `notes/` mirrors the tree using a **parent-as-sibling** pattern:

```
notes/
├── work-project-a1b2c3d4.md           ← parent note's own content
├── work-project-a1b2c3d4/             ← sibling folder for its children
│   ├── q3-planning-e5f6g7h8.md
│   ├── q3-planning-e5f6g7h8/
│   │   └── marketing-i9j0k1l2.md
│   └── retrospective-m3n4o5p6.md
└── standalone-note-q7r8s9t0.md
archived/                              ← stays flat
trash/                                 ← stays flat
```

- A note's filename is always `{slug}-{idPrefix}.md`, whether it's a leaf or a parent.
- A parent that has live children gets both a file (its own content) and a sibling folder with the same base name (its children).
- A parent with no live children has just the file (no empty folder).
- `archived/` and `trash/` keep their current flat structure — these are non-canonical states, and a trashed subtree's hierarchy isn't worth preserving in v1.
- Title-slug collisions between siblings (rare) are disambiguated by the id suffix in the filename.

Front-matter metadata (id, dates, tags, parentId) lands as part of the [[tags]] feature's export commit, so a roundtrip-able export emerges from the two features together.
