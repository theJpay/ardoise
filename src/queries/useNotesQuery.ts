import { useMutation, useQuery } from "@tanstack/react-query";

import { createNote, deleteNote, getNotes, updateNote } from "@services/notes.service";

import { queryClient } from "../queryClient";

import type { Note } from "@entities";

const NOTES_KEY = ["notes"] as const;

export function useNotesQuery() {
    const { isPending, error, data } = useQuery<Note[]>({
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
    return {
        createNote: createNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync
    };
}

type UpdateMutationArgs = {
    id: string;
    fields: Partial<Omit<Note, "id" | "createdAt" | "updatedAt" | "deletedAt">>;
};
