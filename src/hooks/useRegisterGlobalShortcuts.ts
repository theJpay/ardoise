import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { useEditorMode } from "@hooks/useEditorMode";
import { useNotesQuery } from "@queries/useNotesQuery";
import { useLayoutActions } from "@stores/layout.store";
import { UnreachableError } from "@utils";

import { useAddNote } from "./useAddNote";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

export function useRegisterGlobalShortcuts() {
    const { noteId } = useParams();
    const { notes } = useNotesQuery();
    const { addNote } = useAddNote();
    const {
        armed,
        noteId: armedNoteId,
        armDelete,
        confirmDelete,
        cancelDelete
    } = useDeleteConfirmation();
    const { toggleMode } = useEditorMode();
    const { toggleSidebar } = useLayoutActions();
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (armed && event.key === "Escape") {
                event.preventDefault();
                cancelDelete();
                return;
            }

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
                if (armed && armedNoteId === noteId) {
                    await confirmDelete();
                } else {
                    const note = notes.find((n) => n.id === noteId);
                    if (note) {
                        armDelete(note);
                    }
                }
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
    }, [
        noteId,
        notes,
        armed,
        armedNoteId,
        addNote,
        armDelete,
        confirmDelete,
        cancelDelete,
        toggleSidebar,
        toggleMode
    ]);

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
