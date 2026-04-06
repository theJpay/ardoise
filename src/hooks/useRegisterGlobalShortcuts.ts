import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { useEditorActions } from "@stores/editor.store";
import { useNotesActions } from "@stores/notes.store";
import { UnreachableError } from "@utils";

import { useCreateNote } from "./useCreateNote";

export function useRegisterGlobalShortcuts() {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { createNote } = useCreateNote();
    const { toggleSidebar, toggleMode } = useEditorActions();
    const { removeNote } = useNotesActions();
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
                createNote();
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
    }, [navigate, noteId, removeNote, toggleSidebar, toggleMode, createNote]);

    return { searchRef };
}

type GlobalKeyboardAction =
    | "focusSearch"
    | "createNote"
    | "deleteNote"
    | "toggleEditMode"
    | "toggleSidebar";

function areActionKeysPressed(action: GlobalKeyboardAction, e: KeyboardEvent) {
    const isMetaKeyPressed = isMetaKey(e);

    switch (action) {
        case "focusSearch":
            return isMetaKeyPressed && e.key.toLowerCase() === "k";
        case "createNote":
            return !isMetaKeyPressed && e.key.toLowerCase() === "c";
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
