import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditorActions } from "@stores/editor.store";
import { useNotesActions } from "@stores/notes.store";

export function useRegisterGlobalShortcuts() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { toggleSidebar, toggleMode } = useEditorActions();
    const { addNote, removeNote } = useNotesActions();
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (isTyping(event)) {
                return;
            }

            if (areActionKeysPressed("focusSearch", event)) {
                event.preventDefault();
                searchRef.current?.focus();
            }
            if (areActionKeysPressed("createNote", event)) {
                event.preventDefault();
                const newNote = await addNote({ title: "New Note", content: "" });
                navigate(`/notes/${newNote.id}`);
            }
            if (areActionKeysPressed("deleteNote", event)) {
                if (!noteId) {
                    return;
                }
                event.preventDefault();
                await removeNote(noteId);
                navigate(`/`);
            }
            if (areActionKeysPressed("toggleSidebar", event)) {
                event.preventDefault();
                toggleSidebar();
            }
            if (areActionKeysPressed("toggleEditMode", event)) {
                event.preventDefault();
                toggleMode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate, noteId, addNote, removeNote, toggleSidebar, toggleMode]);

    return { searchRef };
}

type GlobalKeyboardAction =
    | "focusSearch"
    | "createNote"
    | "deleteNote"
    | "toggleEditMode"
    | "toggleSidebar";

class UnreachableError extends Error {
    constructor(value: never) {
        super(`Unreachable case: ${value}`);
    }
}

function areActionKeysPressed(action: GlobalKeyboardAction, e: KeyboardEvent) {
    const isMetaKeyPressed = isMetaKey(e);

    switch (action) {
        case "focusSearch":
            return isMetaKeyPressed && e.key.toLowerCase() === "k";
        case "createNote":
            return e.key.toLowerCase() === "c";
        case "deleteNote":
            return isMetaKeyPressed && e.key.toLowerCase() === "backspace";
        case "toggleEditMode":
            return isMetaKeyPressed && e.key.toLowerCase() === "e";
        case "toggleSidebar":
            return isMetaKeyPressed && e.key.toLowerCase() === "b";
        default:
            throw new UnreachableError(action);
    }
}

function isTyping(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function isMetaKey(e: KeyboardEvent) {
    return e.metaKey || e.ctrlKey;
}
