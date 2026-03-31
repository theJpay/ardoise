import { FileText, Search } from "lucide-react";
import { AddNoteButton, EmptyState } from "@components/generics";
import { useCreateNote } from "@hooks/useCreateNote";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotes } from "@stores/notes.store";

import SearchBar from "./SearchBar";
import NoteList from "./NoteList";

type SideBarProps = {
    isLoading: boolean;
    searchRef: React.RefObject<HTMLInputElement | null>;
};

function SideBar({ isLoading, searchRef }: SideBarProps) {
    const notes = useNotes();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);

    const { createNote } = useCreateNote();

    const noNotes = notes.length === 0;
    const noSearchResults = filteredNotes.length === 0 && search.trim() !== "";

    return (
        <div className="flex h-full flex-col">
            <div className="border-border-soft flex shrink-0 flex-col gap-2 border-b p-3">
                <SearchBar value={search} onChange={setSearch} ref={searchRef} />
                <AddNoteButton onClick={createNote} />
            </div>

            <div className="text-ui-xs text-dim shrink-0 px-3 pt-2.5 pb-0.5 font-mono">Notes</div>

            <div className="flex flex-1 flex-col overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col gap-0.5 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-elevated h-8 animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : noNotes ? (
                    <EmptyState
                        icon={<FileText size={16} strokeWidth={1.5} />}
                        title="No notes yet"
                        body="Start writing something. It stays on your device."
                        action={<AddNoteButton onClick={createNote} />}
                    />
                ) : noSearchResults ? (
                    <EmptyState
                        icon={<Search size={16} strokeWidth={1.5} />}
                        title="No results"
                        body={`Nothing matches "${search}". Try a different search.`}
                    />
                ) : (
                    <NoteList notes={filteredNotes} />
                )}
            </div>
        </div>
    );
}

export default SideBar;
