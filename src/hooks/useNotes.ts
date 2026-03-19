import { useEffect, useState } from "react";
import { getNotes } from "@services/notes.service";

import type { Note } from "@entities";

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                setError(null);
                const notes = await getNotes();
                setNotes(notes);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return { notes, loading, error };
}
