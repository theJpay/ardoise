import { Plus } from "lucide-react";
import { useNotes } from "@hooks/useNotes";
import { useNoteSearch } from "@hooks/useNoteSearch";

import SearchBar from "./SearchBar";

function NoteList() {
    const { notes, loading, error } = useNotes();
    const { search, setSearch, filteredNotes } = useNoteSearch(notes);
    const isEmpty = filteredNotes.length === 0;

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-1.5 p-3 border-b border-border-soft shrink-0">
                <SearchBar value={search} onChange={setSearch} />
                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent text-editor-bg rounded font-sans text-xs font-medium hover:opacity-85 transition-opacity">
                    <Plus size={11} strokeWidth={2.2} />
                    New note
                </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-1.5">
                {error ? (
                    <p className="text-muted text-xs px-3 py-2">{error}</p>
                ) : loading ? (
                    <p className="text-subtle text-xs px-3 py-2">Loading...</p>
                ) : isEmpty ? (
                    <p className="text-subtle text-xs px-3 py-8 text-center">No notes yet</p>
                ) : (
                    <ul>
                        {filteredNotes.map((note) => (
                            <li
                                key={note.id}
                                className="flex items-center h-8 px-3 border-l-2 border-transparent hover:bg-elevated cursor-pointer transition-colors duration-100"
                            >
                                <span className="font-sans text-xs text-text truncate">
                                    {note.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default NoteList;
