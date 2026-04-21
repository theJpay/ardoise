import { useCallback, useEffect, useState } from "react";

import { useAppNavigate } from "./useAppNavigate";
import { usePaletteResults } from "./usePaletteResults";

import type { Note } from "@entities";

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const results = usePaletteResults(query);
    const { navigate } = useAppNavigate();

    const close = useCallback(() => {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
    }, []);

    const updateQuery = useCallback((value: string) => {
        setQuery(value);
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
                setQuery("");
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
                setSelectedIndex((prev) => wrapIndex(prev + 1, results.notes.length));
                return;
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                setSelectedIndex((prev) => wrapIndex(prev - 1, results.notes.length));
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                const selected = results.notes[selectedIndex];
                if (selected) {
                    openNote(selected);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, close, openNote]);

    return {
        isOpen,
        close,
        query,
        setQuery: updateQuery,
        results,
        selectedIndex,
        setSelectedIndex,
        openNote
    };
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
