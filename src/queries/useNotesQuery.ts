import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@queries/queryClient";
import {
    createNote,
    deleteNote,
    duplicateNote,
    getArchivedNotes,
    getNotes,
    hardDeleteAllNotes,
    hardDeleteNote,
    pinNote,
    unpinNote,
    updateNote
} from "@services/notes.service";

import type { NoteUpdate } from "@entities";

const noteKeys = {
    all: ["notes"],
    active: ["notes", "active"],
    archived: ["notes", "archived"]
} as const;

export function useNotesQuery() {
    const { isPending, error, data } = useQuery({
        queryKey: noteKeys.active,
        queryFn: getNotes
    });

    return {
        isPending,
        error,
        notes: data ?? []
    };
}

export function useArchivedNotesQuery() {
    const { isPending, error, data } = useQuery({
        queryKey: noteKeys.archived,
        queryFn: getArchivedNotes
    });

    return {
        isPending,
        error,
        archivedNotes: data ?? []
    };
}

export function useNotesMutations() {
    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const duplicateNoteMutation = useMutation({
        mutationFn: duplicateNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: ({ id, fields }: UpdateMutationArgs) => updateNote(id, fields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const pinNoteMutation = useMutation({
        mutationFn: pinNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const unpinNoteMutation = useMutation({
        mutationFn: unpinNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const hardDeleteNoteMutation = useMutation({
        mutationFn: hardDeleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    const hardDeleteAllNotesMutation = useMutation({
        mutationFn: hardDeleteAllNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        }
    });

    return {
        createNote: createNoteMutation.mutateAsync,
        duplicateNote: duplicateNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        pinNote: pinNoteMutation.mutateAsync,
        unpinNote: unpinNoteMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync,
        hardDeleteNote: hardDeleteNoteMutation.mutateAsync,
        hardDeleteAllNotes: hardDeleteAllNotesMutation.mutateAsync
    };
}

type UpdateMutationArgs = {
    id: string;
    fields: NoteUpdate;
};
