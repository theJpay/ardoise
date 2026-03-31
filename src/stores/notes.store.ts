import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { createNote, deleteNote, updateNote } from "@services/notes.service";

import type { Note } from "@entities";

type NotesStore = {
    notes: Note[];
    actions: {
        addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<Note>;
        removeNote: (id: string) => Promise<void>;
        setNotes: (notes: Note[]) => void;
        updateNote: (
            id: string,
            note: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
        ) => Promise<void>;
    };
};

const useNotesStore = create<NotesStore>((set) => ({
    notes: [],
    actions: {
        addNote: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
            const createdNote = await createNote(note);
            set((state) => ({ notes: [...state.notes, createdNote] }));
            return createdNote;
        },
        removeNote: async (id: string) => {
            const hasNoteBeenDeleted = await deleteNote(id);
            if (!hasNoteBeenDeleted) {
                return;
            }

            set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
        },
        setNotes: (notes: Note[]) => set({ notes }),
        updateNote: async (
            id: string,
            note: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
        ) => {
            const updatedNote = await updateNote(id, note);
            if (!updatedNote) {
                return;
            }

            set((state) => ({
                notes: state.notes.map((n) => (n.id === id ? updatedNote : n))
            }));
        }
    }
}));

export const useNotes = () => useNotesStore((state) => state.notes);

export const useNotesActions = () => useNotesStore(useShallow((state) => state.actions));
