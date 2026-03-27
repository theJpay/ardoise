import { useEffect, useState } from "react";
import { getNotes } from "@services/notes.service";
import { useNotesActions } from "@stores/notes.store";

export function useInitNotes() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setNotes } = useNotesActions();

    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const notes = await getNotes();
                setNotes(notes);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load notes");
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [setNotes]);

    return { isLoading, error };
}
