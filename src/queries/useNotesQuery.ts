import { useMutation, useQuery } from "@tanstack/react-query";

import {
    createNote,
    deleteNote,
    duplicateNote,
    getNotes,
    hardDeleteAllNotes,
    hardDeleteNote,
    updateNote
} from "@services/notes.service";

import { queryClient } from "@queries/queryClient";

import type { NoteUpdate } from "@entities";

const NOTES_KEY = ["notes"] as const;

export function useNotesQuery() {
    const { isPending, error, data } = useQuery({
        queryKey: NOTES_KEY,
        queryFn: getNotes
    });

    return {
        isPending,
        error,
        notes: data ?? []
    };
}

export function useNotesMutations() {
    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    const duplicateNoteMutation = useMutation({
        mutationFn: duplicateNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: ({ id, fields }: UpdateMutationArgs) => updateNote(id, fields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    const hardDeleteNoteMutation = useMutation({
        mutationFn: hardDeleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    const hardDeleteAllNotesMutation = useMutation({
        mutationFn: hardDeleteAllNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_KEY });
        }
    });

    return {
        createNote: createNoteMutation.mutateAsync,
        duplicateNote: duplicateNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync,
        hardDeleteNote: hardDeleteNoteMutation.mutateAsync,
        hardDeleteAllNotes: hardDeleteAllNotesMutation.mutateAsync
    };
}

type UpdateMutationArgs = {
    id: string;
    fields: NoteUpdate;
};
