import { useCallback, useState } from "react";

import ContextMenu from "./ContextMenu";
import NoteItem from "./NoteItem";

import type { Note } from "@entities";

type NoteListProps = {
    notes: Note[];
};

type MenuState = {
    note: Note;
    position: { x: number; y: number };
} | null;

function NoteList({ notes }: NoteListProps) {
    const [menu, setMenu] = useState<MenuState>(null);

    const handleContextMenu = useCallback(
        (e: React.MouseEvent, noteId: string) => {
            e.preventDefault();
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setMenu({ note, position: { x: e.clientX, y: e.clientY } });
            }
        },
        [notes]
    );

    const handleCloseMenu = useCallback(() => {
        setMenu(null);
    }, []);

    return (
        <>
            <ul>
                {notes.map((note) => (
                    <li key={note.id} onContextMenu={(e) => handleContextMenu(e, note.id)}>
                        <NoteItem note={note} />
                    </li>
                ))}
            </ul>
            {menu && (
                <ContextMenu note={menu.note} position={menu.position} onClose={handleCloseMenu} />
            )}
        </>
    );
}

export default NoteList;
