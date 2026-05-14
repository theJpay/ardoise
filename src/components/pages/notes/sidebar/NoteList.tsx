import NoteItem from "./NoteItem";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";

type NoteListProps = {
    notes: Note[];
    menuOpenNoteId: string | null;
    onOpenMenu: (noteId: string, anchor: Anchor) => void;
    onCloseMenu: () => void;
};

function NoteList({ notes, menuOpenNoteId, onOpenMenu, onCloseMenu }: NoteListProps) {
    return (
        <ul>
            {notes.map((note) => (
                <li
                    key={note.id}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onOpenMenu(note.id, {
                            type: "coordinates",
                            x: e.clientX,
                            y: e.clientY
                        });
                    }}
                >
                    <NoteItem
                        isMenuOpen={menuOpenNoteId === note.id}
                        note={note}
                        onCloseMenu={onCloseMenu}
                        onOpenMenu={(anchor) => onOpenMenu(note.id, anchor)}
                    />
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
