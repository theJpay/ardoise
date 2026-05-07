import { liveQuery } from "dexie";
import { create } from "zustand";

import { getNotes } from "@services/notes.service";

import type { Note } from "@entities";

type NotesStore = {
    notes: Note[] | undefined;
};

const useNotesStore = create<NotesStore>(() => ({
    notes: undefined
}));

liveQuery(getNotes).subscribe((notes) => {
    useNotesStore.setState({ notes });
});

export function useNotes() {
    const notes = useNotesStore((state) => state.notes);

    return {
        isPending: notes === undefined,
        notes: notes ?? []
    };
}
