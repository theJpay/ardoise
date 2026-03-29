import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditorMode } from "@stores/editor.store";
import { useNotes } from "@stores/notes.store";

import { NoteEditor } from "./editor";

function Note() {
    const navigate = useNavigate();
    const { noteId } = useParams<{ noteId: string }>();

    const mode = useEditorMode();
    const selectedNote = useNotes().find((note) => note.id === noteId);

    useEffect(() => {
        if (!selectedNote) {
            navigate("/");
        }
    }, [selectedNote, navigate]);

    if (!selectedNote) {
        return null;
    }

    return mode === "edit" ? <NoteEditor note={selectedNote} /> : <div>Note Viewer</div>;
}

export default Note;
