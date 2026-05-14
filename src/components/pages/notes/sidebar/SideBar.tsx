import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@components/generics";
import { NoteEntity } from "@entities";
import { useAddNote } from "@hooks/useAddNote";
import { useAutoExpandAncestors } from "@hooks/useAutoExpandAncestors";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotes } from "@stores/notes.store";
import { useSortOrder } from "@stores/sort.store";
import { useTreeExpansionActions } from "@stores/treeExpansion.store";
import { dateFieldForSort, sortNotes } from "@utils";
import { buildNoteTree } from "@utils/noteTree";

import InlineHint from "./InlineHint";
import NoteList from "./NoteList";
import NoteMenu from "./NoteMenu";
import NoteTree from "./NoteTree";
import SearchBar from "./SearchBar";
import SortControl from "./SortControl";

import type { Note } from "@entities";
import type { RefObject } from "react";

type SideBarProps = {
    searchRef: RefObject<HTMLInputElement | null>;
};

type MenuState = {
    note: Note;
    position: { x: number; y: number };
} | null;

function SideBar({ searchRef }: SideBarProps) {
    const { notes, isPending } = useNotes();
    const order = useSortOrder();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);
    const isSearchMode = search.trim() !== "";

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
        () => (isSearchMode ? [] : buildNoteTree(notes, order)),
        [notes, order, isSearchMode]
    );

    const [menu, setMenu] = useState<MenuState>(null);
    const handleContextMenu = useCallback(
        (e: React.MouseEvent, noteId: string) => {
            e.preventDefault();
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setMenu({ note, position: { x: e.clientX, y: e.clientY } });
            }
        },
        [notes]
    );
    const handleCloseMenu = useCallback(() => setMenu(null), []);

    useAutoExpandAncestors(notes);
    useOneTimePrune(notes, isPending);

    const { addNote } = useAddNote();
    const dateField = dateFieldForSort(order);

    const noNotes = notes.length === 0;
    const noSearchResults = filteredNotes.length === 0 && isSearchMode;

    return (
        <div className="flex h-full flex-col">
            <div className="border-border-soft flex shrink-0 flex-col gap-2 border-b p-3">
                <SearchBar ref={searchRef} value={search} onChange={setSearch} />
                <Button icon={Plus} label="New note" onClick={addNote} />
                <SortControl />
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
                                    dateField={dateField}
                                    notes={pinnedNotes}
                                    onContextMenu={handleContextMenu}
                                />
                            </>
                        )}
                        {isSearchMode
                            ? flatUnpinnedMatches.length > 0 && (
                                  <>
                                      <SectionTitle label="Notes" />
                                      <NoteList
                                          dateField={dateField}
                                          notes={flatUnpinnedMatches}
                                          onContextMenu={handleContextMenu}
                                      />
                                  </>
                              )
                            : tree.length > 0 && (
                                  <>
                                      <SectionTitle label="Notes" />
                                      <NoteTree
                                          dateField={dateField}
                                          nodes={tree}
                                          onContextMenu={handleContextMenu}
                                      />
                                  </>
                              )}
                    </>
                )}
            </div>

            {menu && (
                <NoteMenu note={menu.note} position={menu.position} onClose={handleCloseMenu} />
            )}
        </div>
    );
}

function SectionTitle({ label }: { label: string }) {
    return <div className="text-ui-xs text-dim shrink-0 px-3 pt-2.5 pb-0.5 font-mono">{label}</div>;
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
