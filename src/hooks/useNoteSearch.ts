import { useSearchParams } from "react-router";

import type { Note } from "@entities";

export function useNoteSearch(notes: Note[]) {
    const [searchParams, setSearchParams] = useSearchParams();

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes((searchParams.get("q") ?? "").toLowerCase())
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
        search: searchParams.get("q") ?? "",
        setSearch,
        filteredNotes
    };
}
