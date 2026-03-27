import { useNavigate } from "react-router";
import { useNoteSearch } from "@hooks/useNoteSearch";
import { useNotes, useNotesActions } from "@stores/notes.store";

import SearchBar from "./SearchBar";
import AddNoteButton from "./AddNoteButton";
import NoteList from "./NoteList";

function SideBar({ isLoading, error }: { isLoading: boolean; error: string | null }) {
    const navigate = useNavigate();

    const notes = useNotes();
    const { addNote } = useNotesActions();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);

    const handleAddNote = async () => {
        const newNote = await addNote({ title: "New Note", content: "" });
        navigate(`/notes/${newNote.id}`);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-1.5 p-3 border-b border-border-soft shrink-0">
                <SearchBar value={search} onChange={setSearch} />
                <AddNoteButton onClick={handleAddNote} />
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-1.5">
                <NoteList notes={filteredNotes} isLoading={isLoading} error={error} />
            </div>
        </div>
    );
}

export default SideBar;
