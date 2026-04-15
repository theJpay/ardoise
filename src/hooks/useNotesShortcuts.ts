import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { useEditorMode } from "@hooks/useEditorMode";
import { useNotesQuery } from "@queries/useNotesQuery";
import { useLayoutActions } from "@stores/layout.store";
import { UnreachableError } from "@utils";

import { useAddNote } from "./useAddNote";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

export function useNotesShortcuts() {
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

            if (areActionKeysPressed("save", event)) {
                event.preventDefault();
                return;
            }
            if (areActionKeysPressed("toggleSidebar", event)) {
                event.preventDefault();
                toggleSidebar();
                return;
            }
            if (areActionKeysPressed("toggleMode", event)) {
                event.preventDefault();
                toggleMode();
                return;
            }
            if (areActionKeysPressed("focusSearch", event)) {
                event.preventDefault();
                searchRef.current?.focus();
                return;
            }
            if (areActionKeysPressed("newNoteGlobal", event)) {
                event.preventDefault();
                await addNote();
                return;
            }

            if (isTyping(event)) {
                return;
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
    | "save"
    | "toggleSidebar"
    | "toggleMode"
    | "focusSearch"
    | "newNoteGlobal"
    | "addNote"
    | "removeNote";

function areActionKeysPressed(action: GlobalKeyboardAction, e: KeyboardEvent) {
    const meta = isMetaKey(e);
    const code = e.code;

    switch (action) {
        case "save":
            return meta && !e.shiftKey && !e.altKey && code === "KeyS";
        case "toggleSidebar":
            return meta && e.shiftKey && !e.altKey && code === "KeyB";
        case "toggleMode":
            return meta && e.shiftKey && !e.altKey && code === "KeyM";
        case "focusSearch":
            return meta && e.shiftKey && !e.altKey && code === "KeyF";
        case "newNoteGlobal":
            return meta && !e.shiftKey && e.altKey && code === "KeyN";
        case "addNote":
            return !meta && !e.shiftKey && !e.altKey && code === "KeyC";
        case "removeNote":
            return meta && !e.shiftKey && !e.altKey && code === "Backspace";
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
