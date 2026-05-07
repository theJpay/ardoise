import { Plus } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@components/generics";
import { NoteEntity } from "@entities";
import { useAddNote } from "@hooks/useAddNote";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotes } from "@stores/notes.store";
import { useSortOrder } from "@stores/sort.store";
import { sortNotes } from "@utils";

import InlineHint from "./InlineHint";
import NoteList from "./NoteList";
import SearchBar from "./SearchBar";
import SortControl from "./SortControl";

import type { RefObject } from "react";

type SideBarProps = {
    searchRef: RefObject<HTMLInputElement | null>;
};

function SideBar({ searchRef }: SideBarProps) {
    const { notes, isPending } = useNotes();
    const order = useSortOrder();
    const sortedNotes = useMemo(() => sortNotes(notes, order), [notes, order]);
    const { search, setSearch, filteredNotes } = useNoteSearch(sortedNotes);

    const pinnedNotes = useMemo(() => filteredNotes.filter(NoteEntity.isPinned), [filteredNotes]);
    const unpinnedNotes = useMemo(
        () => filteredNotes.filter((note) => !NoteEntity.isPinned(note)),
        [filteredNotes]
    );

    const { addNote } = useAddNote();

    const noNotes = notes.length === 0;
    const noSearchResults = filteredNotes.length === 0 && search.trim() !== "";

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
                                <NoteList notes={pinnedNotes} />
                            </>
                        )}
                        {unpinnedNotes.length > 0 && (
                            <>
                                <SectionTitle label="Notes" />
                                <NoteList notes={unpinnedNotes} />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function SectionTitle({ label }: { label: string }) {
    return <div className="text-ui-xs text-dim shrink-0 px-3 pt-2.5 pb-0.5 font-mono">{label}</div>;
}

export default SideBar;
