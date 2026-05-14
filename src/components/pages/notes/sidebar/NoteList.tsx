import NoteItem from "./NoteItem";

import type { Note } from "@entities";

type NoteListProps = {
    notes: Note[];
    dateField: "updatedAt" | "createdAt";
    onContextMenu: (e: React.MouseEvent, noteId: string) => void;
};

function NoteList({ notes, dateField, onContextMenu }: NoteListProps) {
    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id} onContextMenu={(e) => onContextMenu(e, note.id)}>
                    <NoteItem dateField={dateField} note={note} />
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
