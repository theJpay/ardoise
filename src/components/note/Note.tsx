import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useEditorMode } from "@stores/editor.store";
import { useNotes } from "@stores/notes.store";

import { NoteEditor } from "./editor";
import { NoteViewer } from "./viewer";

function Note() {
    const navigate = useNavigate();
    const { noteId } = useParams<{ noteId: string }>();
    const { isLoading } = useOutletContext<{ isLoading: boolean }>();

    const mode = useEditorMode();
    const selectedNote = useNotes().find((note) => note.id === noteId);

    useEffect(() => {
        if (!isLoading && !selectedNote) {
            navigate("/");
        }
    }, [isLoading, selectedNote, navigate]);

    if (!selectedNote) {
        return null;
    }

    return mode === "edit" ? (
        <NoteEditor note={selectedNote} />
    ) : (
        <NoteViewer note={selectedNote} />
    );
}

export default Note;
