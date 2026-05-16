import { ChevronsDownUp, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@components/generics";
import { NoteEntity } from "@entities";
import { useAddNote } from "@hooks/useAddNote";
import { useAutoExpandAncestors } from "@hooks/useAutoExpandAncestors";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotes } from "@stores/notes.store";
import { useSortOrder } from "@stores/sort.store";
import { getTreeExpansionSnapshot, useTreeExpansionActions } from "@stores/treeExpansion.store";
import { SORT_ORDERS, sortNotes } from "@utils";
import { ancestorsOf, buildNoteTree } from "@utils/noteTree";

import InlineHint from "./InlineHint";
import MoveNoteModal from "./MoveNoteModal";
import NoteList from "./NoteList";
import NoteMenu from "./NoteMenu";
import NoteTree from "./NoteTree";
import SearchBar from "./SearchBar";
import SortControl from "./SortControl";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { RefObject } from "react";

type SideBarProps = {
    searchRef: RefObject<HTMLInputElement | null>;
};

type MenuSource = "pinned" | "notes";

type MenuState = {
    note: Note;
    anchor: Anchor;
    source: MenuSource;
} | null;

type MoveTargetState = {
    note: Note;
    initiallyExpanded: Set<string>;
} | null;

function SideBar({ searchRef }: SideBarProps) {
    const { notes, isPending } = useNotes();
    const order = useSortOrder();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);
    const isSearchMode = search.trim() !== "";
    const isFlatSort = order === SORT_ORDERS.RECENT_FLAT;
    const isFlatMode = isSearchMode || isFlatSort;

    const sortedFilteredNotes = useMemo(
        () => sortNotes(filteredNotes, order),
        [filteredNotes, order]
    );
    const pinnedNotes = useMemo(
        () => sortedFilteredNotes.filter(NoteEntity.isPinned),
        [sortedFilteredNotes]
    );
    const flatUnpinnedMatches = useMemo(
        () => sortedFilteredNotes.filter((note) => !NoteEntity.isPinned(note)),
        [sortedFilteredNotes]
    );

    const tree = useMemo(
        () => (isFlatMode ? [] : buildNoteTree(notes, order)),
        [notes, order, isFlatMode]
    );

    const parentPathsById = useMemo<Map<string, string[]> | undefined>(() => {
        if (!isSearchMode) {
            return undefined;
        }
        const map = new Map<string, string[]>();
        for (const note of sortedFilteredNotes) {
            const ancestors = ancestorsOf(note.id, notes);
            if (ancestors.length > 0) {
                map.set(
                    note.id,
                    ancestors.map((a) => NoteEntity.getTitle(a))
                );
            }
        }
        return map;
    }, [isSearchMode, sortedFilteredNotes, notes]);

    const [menu, setMenu] = useState<MenuState>(null);
    const openPinnedMenu = useCallback(
        (noteId: string, anchor: Anchor) => {
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setMenu({ note, anchor, source: "pinned" });
            }
        },
        [notes]
    );
    const openNotesMenu = useCallback(
        (noteId: string, anchor: Anchor) => {
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setMenu({ note, anchor, source: "notes" });
            }
        },
        [notes]
    );
    const handleCloseMenu = useCallback(() => setMenu(null), []);
    const pinnedMenuOpenId = menu?.source === "pinned" ? menu.note.id : null;
    const notesMenuOpenId = menu?.source === "notes" ? menu.note.id : null;

    const [moveTarget, setMoveTarget] = useState<MoveTargetState>(null);
    const handleMoveTo = useCallback((note: Note) => {
        setMoveTarget({ note, initiallyExpanded: getTreeExpansionSnapshot() });
    }, []);
    const handleCloseMoveModal = useCallback(() => setMoveTarget(null), []);

    const { collapseAll } = useTreeExpansionActions();

    useAutoExpandAncestors(notes);
    useOneTimePrune(notes, isPending);

    const { addNote } = useAddNote();

    const noNotes = notes.length === 0;
    const noSearchResults = filteredNotes.length === 0 && isSearchMode;

    return (
        <div className="flex h-full flex-col">
            <div className="border-border-soft flex shrink-0 flex-col gap-2 border-b p-3">
                <SearchBar ref={searchRef} value={search} onChange={setSearch} />
                <Button icon={Plus} label="New note" onClick={addNote} />
                <div className="flex items-center justify-between">
                    <SortControl />
                    <CollapseAllButton onCollapse={collapseAll} />
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
                {isPending ? (
                    <div className="flex flex-col gap-0.5 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-elevated h-8 animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : noNotes ? (
                    <InlineHint
                        subtitle="Start writing with the button above."
                        title="No notes yet"
                    />
                ) : noSearchResults ? (
                    <InlineHint
                        subtitle="Try a different search."
                        title={`No results for "${search.length > 20 ? search.slice(0, 20) + "…" : search}"`}
                    />
                ) : (
                    <>
                        {pinnedNotes.length > 0 && (
                            <>
                                <SectionTitle label="Pinned" />
                                <NoteList
                                    menuOpenNoteId={pinnedMenuOpenId}
                                    notes={pinnedNotes}
                                    parentPathsById={parentPathsById}
                                    onCloseMenu={handleCloseMenu}
                                    onOpenMenu={openPinnedMenu}
                                />
                            </>
                        )}
                        {isFlatMode
                            ? flatUnpinnedMatches.length > 0 && (
                                  <>
                                      <SectionTitle label="Notes" />
                                      <NoteList
                                          menuOpenNoteId={notesMenuOpenId}
                                          notes={flatUnpinnedMatches}
                                          parentPathsById={parentPathsById}
                                          onCloseMenu={handleCloseMenu}
                                          onOpenMenu={openNotesMenu}
                                      />
                                  </>
                              )
                            : tree.length > 0 && (
                                  <>
                                      <SectionTitle label="Notes" />
                                      <NoteTree
                                          menuOpenNoteId={notesMenuOpenId}
                                          nodes={tree}
                                          onCloseMenu={handleCloseMenu}
                                          onOpenMenu={openNotesMenu}
                                      />
                                  </>
                              )}
                    </>
                )}
            </div>

            {menu && (
                <NoteMenu
                    anchor={menu.anchor}
                    note={menu.note}
                    onClose={handleCloseMenu}
                    onMoveTo={handleMoveTo}
                />
            )}

            {moveTarget && (
                <MoveNoteModal
                    initiallyExpanded={moveTarget.initiallyExpanded}
                    note={moveTarget.note}
                    onClose={handleCloseMoveModal}
                />
            )}
        </div>
    );
}

function SectionTitle({ label }: { label: string }) {
    return <div className="text-ui-xs text-dim shrink-0 px-3 pt-2.5 pb-0.5 font-mono">{label}</div>;
}

function CollapseAllButton({ onCollapse }: { onCollapse: () => void }) {
    return (
        <button
            aria-label="Collapse all"
            className="text-subtle hover:bg-border hover:text-text duration-fast flex h-6 w-6 items-center justify-center rounded-sm transition-colors"
            title="Collapse all"
            type="button"
            onClick={onCollapse}
        >
            <ChevronsDownUp size={13} strokeWidth={1.5} />
        </button>
    );
}

function useOneTimePrune(notes: Note[], isPending: boolean) {
    const { pruneTo } = useTreeExpansionActions();
    const hasPruned = useRef(false);
    useEffect(() => {
        if (isPending || hasPruned.current) {
            return;
        }
        pruneTo(new Set(notes.map((n) => n.id)));
        hasPruned.current = true;
    }, [isPending, notes, pruneTo]);
}

export default SideBar;
