import { useNoteSearch } from "@hooks/useNoteSearch";
import { SearchBar } from "../inputs";
import type { Note } from "@entities";

function NoteList() {
    const noteList: Note[] = [
        { id: "1", title: "Getting started with Ardoise", content: "" },
        { id: "2", title: "React hooks cheatsheet", content: "" },
        { id: "3", title: "Meeting notes — 18 March", content: "" },
        { id: "4", title: "Book recommendations", content: "" },
        { id: "5", title: "Idées de voyages", content: "" }
    ];

    const { search, setSearch, filteredNotes } = useNoteSearch(noteList);
    const isEmpty = filteredNotes.length === 0;

    return (
        <>
            <SearchBar value={search} onChange={setSearch} />

            {isEmpty ? (
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
