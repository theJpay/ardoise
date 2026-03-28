import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useNotesActions } from "@stores/notes.store";

export function useRegisterGlobalShortcuts() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { addNote, removeNote } = useNotesActions();
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (isTyping(event)) {
                return;
            }

            if (isMetaKey(event) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchRef.current?.focus();
            }
            if (event.key.toLowerCase() === "c") {
                event.preventDefault();
                const newNote = await addNote({ title: "New Note", content: "" });
                navigate(`/notes/${newNote.id}`);
            }
            if (isMetaKey(event) && event.key.toLowerCase() === "backspace") {
                if (!noteId) {
                    return;
                }
                event.preventDefault();
                await removeNote(noteId);
                navigate(`/`);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate, noteId, addNote, removeNote]);

    return { searchRef };
}

function isTyping(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function isMetaKey(e: KeyboardEvent) {
    return e.metaKey || e.ctrlKey;
}
