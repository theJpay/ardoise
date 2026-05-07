import { liveQuery } from "dexie";
import { create } from "zustand";

import { getArchivedNotes, getNotes } from "@services/notes.service";

import type { Note } from "@entities";

type NotesStore = {
    notes: Note[] | undefined;
    archivedNotes: Note[] | undefined;
};

const useNotesStore = create<NotesStore>(() => ({
    notes: undefined,
    archivedNotes: undefined
}));

liveQuery(getNotes).subscribe((notes) => {
    useNotesStore.setState({ notes });
});

liveQuery(getArchivedNotes).subscribe((archivedNotes) => {
    useNotesStore.setState({ archivedNotes });
});

export function useNotes() {
    const notes = useNotesStore((state) => state.notes);

    return {
        isPending: notes === undefined,
        notes: notes ?? []
    };
}

export function useArchivedNotes() {
    const archivedNotes = useNotesStore((state) => state.archivedNotes);

    return {
        isPending: archivedNotes === undefined,
        archivedNotes: archivedNotes ?? []
    };
}
