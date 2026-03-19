import { useSearchParams } from "react-router";
import type { Note } from "@entities";

export function useNoteSearch(notes: Note[]) {
    const [searchParams, setSearchParams] = useSearchParams();

    const filteredNotes = notes.filter(
        (note) => note.title.toLowerCase().includes((searchParams.get("q") ?? "").toLowerCase()) // Add better expression with REGEX later?
    );

    const setSearch = (value: string) => {
        if (value === "") {
            setSearchParams({});
            return;
        }
        setSearchParams({ q: value });
    };

    return {
        search: searchParams.get("q") ?? "",
        setSearch,
        filteredNotes
    };
}
