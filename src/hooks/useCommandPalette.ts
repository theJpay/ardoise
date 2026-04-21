import { useCallback, useEffect, useMemo, useState } from "react";

import { useNotesQuery } from "@queries/useNotesQuery";

import { useAppNavigate } from "./useAppNavigate";

import type { Note } from "@entities";

const RECENT_LIMIT = 5;

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { notes } = useNotesQuery();
    const { navigate } = useAppNavigate();

    const recentNotes = useMemo<Note[]>(() => notes.slice(0, RECENT_LIMIT), [notes]);

    const close = useCallback(() => {
        setIsOpen(false);
        setSelectedIndex(0);
    }, []);

    const openNote = useCallback(
        (note: Note) => {
            navigate(`/notes/${note.id}`);
            close();
        },
        [navigate, close]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isPaletteShortcut(event)) {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen((prev) => !prev);
                setSelectedIndex(0);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close();
                return;
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                event.stopPropagation();
                setSelectedIndex((prev) => wrapIndex(prev + 1, recentNotes.length));
                return;
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                setSelectedIndex((prev) => wrapIndex(prev - 1, recentNotes.length));
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                const selected = recentNotes[selectedIndex];
                if (selected) {
                    openNote(selected);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, recentNotes, selectedIndex, close, openNote]);

    return { isOpen, close, recentNotes, selectedIndex, setSelectedIndex, openNote };
}

function isPaletteShortcut(e: KeyboardEvent) {
    const meta = e.metaKey || e.ctrlKey;
    return meta && e.shiftKey && !e.altKey && e.key.toLowerCase() === "k";
}

function wrapIndex(index: number, length: number) {
    if (length === 0) {
        return 0;
    }
    return (index + length) % length;
}
