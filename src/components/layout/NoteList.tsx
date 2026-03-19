import { useNotes } from "@hooks/useNotes";
import { useNoteSearch } from "@hooks/useNoteSearch";

import { SearchBar } from "../inputs";

function NoteList() {
    const { notes, loading, error } = useNotes();

    const { search, setSearch, filteredNotes } = useNoteSearch(notes);
    const isEmpty = filteredNotes.length === 0;

    return (
        <>
            <SearchBar value={search} onChange={setSearch} />

            {error ? (
                <div>{error}</div>
            ) : loading ? (
                <div>Loading notes...</div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                    <p className="text-text-muted text-sm">No notes yet</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-0.5 p-2">
                    {filteredNotes.map((note) => (
                        <li
                            key={note.id}
                            className="px-3 py-2.5 rounded-md cursor-pointer text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors duration-150 text-sm"
                        >
                            {note.title}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default NoteList;
