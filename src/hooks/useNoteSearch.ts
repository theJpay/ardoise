import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type { Note } from "@entities";

export function useNoteSearch(notes: Note[]) {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") ?? "";

    const filteredNotes = useMemo(
        () => notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [notes, searchQuery]
    );

    const setSearch = (value: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value === "") {
                next.delete("q");
            } else {
                next.set("q", value);
            }
            return next;
        });
    };

    return {
        search: searchQuery,
        setSearch,
        filteredNotes
    };
}
