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
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-1.5 p-3 border-b border-border-soft shrink-0">
                <SearchBar value={search} onChange={setSearch} ref={searchRef} />
                <AddNoteButton onClick={createNote} />
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-1.5">
                {isLoading ? (
                    <div className="flex flex-col gap-0.5 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 rounded-md bg-elevated animate-pulse" />
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
