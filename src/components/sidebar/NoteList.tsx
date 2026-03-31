import NoteItem from "./NoteItem";

import type { Note } from "@entities";

type NoteListProps = {
    notes: Note[];
};

function NoteList({ notes }: NoteListProps) {
    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id}>
                    <NoteItem note={note} />
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
