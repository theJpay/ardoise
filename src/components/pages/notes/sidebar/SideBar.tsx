import { Plus } from "lucide-react";

import { Button } from "@components/generics";
import { useAddNote } from "@hooks/useAddNote";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotesQuery } from "@queries/useNotesQuery";

import InlineHint from "./InlineHint";
import NoteList from "./NoteList";
import SearchBar from "./SearchBar";

import type { RefObject } from "react";

type SideBarProps = {
    searchRef: RefObject<HTMLInputElement | null>;
};

function SideBar({ searchRef }: SideBarProps) {
    const { notes, isPending } = useNotesQuery();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);

    const { addNote } = useAddNote();

    const noNotes = notes.length === 0;
    const noSearchResults = filteredNotes.length === 0 && search.trim() !== "";

    return (
        <div className="flex h-full flex-col">
            <div className="border-border-soft flex shrink-0 flex-col gap-2 border-b p-3">
                <SearchBar ref={searchRef} value={search} onChange={setSearch} />
                <Button icon={Plus} label="New note" onClick={addNote} />
            </div>

            <div className="text-ui-xs text-dim shrink-0 px-3 pt-2.5 pb-0.5 font-mono">Notes</div>

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
                    <NoteList notes={filteredNotes} />
                )}
            </div>
        </div>
    );
}

export default SideBar;
