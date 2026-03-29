import { FileX } from "lucide-react";
import { useParams } from "react-router";
import { EmptyState } from "@components/generics";
import { useEditorMode } from "@stores/editor.store";
import { useNotes } from "@stores/notes.store";

import { NoteEditor } from "./editor";
import { NoteViewer } from "./viewer";

function Note() {
    const { noteId } = useParams<{ noteId: string }>();

    const mode = useEditorMode();
    const selectedNote = useNotes().find((note) => note.id === noteId);

    if (!selectedNote) {
        return (
            <EmptyState
                icon={<FileX size={16} strokeWidth={1.5} />}
                title="Note not found"
                body="This note may have been deleted."
            />
        );
    }

    return mode === "edit" ? (
        <NoteEditor note={selectedNote} />
    ) : (
        <NoteViewer note={selectedNote} />
    );
}

export default Note;
