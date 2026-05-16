import NoteItem from "./NoteItem";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";

type NoteListProps = {
    notes: Note[];
    menuOpenNoteId: string | null;
    parentPathsById?: Map<string, string[]>;
    onOpenMenu: (noteId: string, anchor: Anchor) => void;
    onCloseMenu: () => void;
};

function NoteList({
    notes,
    menuOpenNoteId,
    parentPathsById,
    onOpenMenu,
    onCloseMenu
}: NoteListProps) {
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
                        parentPath={parentPathsById?.get(note.id)}
                        onCloseMenu={onCloseMenu}
                        onOpenMenu={(anchor) => onOpenMenu(note.id, anchor)}
                    />
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
