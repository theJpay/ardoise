import NoteItem from "./NoteItem";

import type { Note } from "@entities";

type NoteListProps = {
    notes: Note[];
    loading: boolean;
    error: string | null;
};

function NoteList({ notes, loading, error }: NoteListProps) {
    const isEmpty = notes.length === 0;

    if (error) {
        return <p className="text-muted text-xs px-3 py-2">{error}</p>;
    }

    if (loading) {
        return <p className="text-subtle text-xs px-3 py-2">Loading...</p>;
    }

    if (isEmpty) {
        return <p className="text-subtle text-xs px-3 py-8 text-center">No notes yet</p>;
    }

    return (
        <ul>
            {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
            ))}
        </ul>
    );
}

export default NoteList;
