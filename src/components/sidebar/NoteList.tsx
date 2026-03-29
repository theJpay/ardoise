import NoteItem from "./NoteItem";

import type { Note } from "@entities";

type NoteListProps = {
    notes: Note[];
};

function NoteList({ notes }: NoteListProps) {
    return (
        <ul>
            {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
            ))}
        </ul>
    );
}

export default NoteList;
