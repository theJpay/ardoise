import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { useNotesMutations } from "@queries/useNotesQuery";
import { useEditorActions } from "@stores/editor.store";
import { UnreachableError } from "@utils";

import { useAddNote } from "./useAddNote";

export function useRegisterGlobalShortcuts() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { addNote } = useAddNote();
    const { deleteNote } = useNotesMutations();
    const { toggleSidebar, toggleMode } = useEditorActions();
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
            if (areActionKeysPressed("addNote", event)) {
                event.preventDefault();
                await addNote();
            }
            if (areActionKeysPressed("removeNote", event)) {
                if (!noteId) {
                    return;
                }
                event.preventDefault();
                await deleteNote(noteId);
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
    }, [navigate, noteId, addNote, deleteNote, toggleSidebar, toggleMode]);

    return { searchRef };
}

type GlobalKeyboardAction =
    | "focusSearch"
    | "addNote"
    | "removeNote"
    | "toggleEditMode"
    | "toggleSidebar";

function areActionKeysPressed(action: GlobalKeyboardAction, e: KeyboardEvent) {
    const isMetaKeyPressed = isMetaKey(e);

    switch (action) {
        case "focusSearch":
            return isMetaKeyPressed && e.key.toLowerCase() === "k";
        case "addNote":
            return !isMetaKeyPressed && e.key.toLowerCase() === "c";
        case "removeNote":
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
