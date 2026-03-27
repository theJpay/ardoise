import { useNotes } from "@hooks/useNotes";
import { useNoteSearch } from "@hooks/useNoteSearch";

import SearchBar from "./SearchBar";
import AddNoteButton from "./AddNoteButton";
import NoteList from "./NoteList";

function SideBar() {
    const { notes, loading, error } = useNotes();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-1.5 p-3 border-b border-border-soft shrink-0">
                <SearchBar value={search} onChange={setSearch} />
                <AddNoteButton />
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-1.5">
                <NoteList notes={filteredNotes} loading={loading} error={error} />
            </div>
        </div>
    );
}

export default SideBar;
