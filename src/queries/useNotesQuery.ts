import { useMutation, useQuery } from "@tanstack/react-query";

import { createNote, deleteNote, getNotes, updateNote } from "@services/notes.service";

import { queryClient } from "../queryClient";

import type { Note } from "@entities";

export function useNotesQuery() {
    const { isPending, error, data } = useQuery<Note[]>({
        queryKey: ["notes"],
        queryFn: getNotes
    });

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: ({ id, fields }: UpdateMutationArgs) => updateNote(id, fields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    });

    return {
        isPending,
        error,
        notes: data ?? [],
        createNote: createNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutate,
        deleteNote: deleteNoteMutation.mutate
    };
}

type UpdateMutationArgs = {
    id: string;
    fields: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>;
};
