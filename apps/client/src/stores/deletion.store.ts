import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type DeletionStore = {
    armed: boolean;
    noteId: string | null;
    noteTitle: string;
    deletingNoteId: string | null;
    actions: {
        arm: (noteId: string, title: string) => void;
        cancel: () => void;
        setDeleting: (noteId: string) => void;
        reset: () => void;
    };
};

const useDeletionStore = create<DeletionStore>((set) => ({
    armed: false,
    noteId: null,
    noteTitle: "",
    deletingNoteId: null,
    actions: {
        arm: (noteId, title) => set({ armed: true, noteId, noteTitle: title }),
        cancel: () => set({ armed: false, noteId: null, noteTitle: "" }),
        setDeleting: (noteId) => set({ armed: false, deletingNoteId: noteId }),
        reset: () => set({ armed: false, noteId: null, noteTitle: "", deletingNoteId: null })
    }
}));

export const useDeletionState = () =>
    useDeletionStore(
        useShallow((s) => ({
            armed: s.armed,
            noteId: s.noteId,
            noteTitle: s.noteTitle,
            deletingNoteId: s.deletingNoteId
        }))
    );

export const useDeletionActions = () => useDeletionStore(useShallow((s) => s.actions));
