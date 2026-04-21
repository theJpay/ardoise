import { useMemo } from "react";

import { useNotesQuery } from "@queries/useNotesQuery";

import type { Note } from "@entities";

const RECENT_LIMIT = 5;

export type PaletteResults = {
    section: "Recent" | "Notes";
    notes: Note[];
};

export function usePaletteResults(query: string): PaletteResults {
    const { notes } = useNotesQuery();

    return useMemo(() => {
        if (query === "") {
            return { section: "Recent", notes: notes.slice(0, RECENT_LIMIT) };
        }
        const normalized = query.toLowerCase();
        const matches = notes.filter((note) => note.title.toLowerCase().includes(normalized));
        return { section: "Notes", notes: matches };
    }, [notes, query]);
}
