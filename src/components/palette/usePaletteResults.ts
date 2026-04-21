import { useMemo } from "react";

import { useNotesQuery } from "@queries/useNotesQuery";
import { extractSnippet } from "@utils";

import type { Note } from "@entities";

const RECENT_LIMIT = 5;

export type PaletteResult = {
    note: Note;
    snippet: string | null;
};

export type PaletteResults = {
    section: "Recent" | "Notes";
    items: PaletteResult[];
};

export function usePaletteResults(query: string): PaletteResults {
    const { notes } = useNotesQuery();

    return useMemo(() => {
        if (query === "") {
            return {
                section: "Recent",
                items: notes.slice(0, RECENT_LIMIT).map((note) => ({ note, snippet: null }))
            };
        }

        const normalized = query.toLowerCase();
        const titleMatches: PaletteResult[] = [];
        const contentMatches: PaletteResult[] = [];

        for (const note of notes) {
            const titleHit = note.title.toLowerCase().includes(normalized);
            if (titleHit) {
                titleMatches.push({ note, snippet: null });
                continue;
            }
            const snippet = extractSnippet(note.content, query);
            if (snippet !== null) {
                contentMatches.push({ note, snippet });
            }
        }

        return { section: "Notes", items: [...titleMatches, ...contentMatches] };
    }, [notes, query]);
}
