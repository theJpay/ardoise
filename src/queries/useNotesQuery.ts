import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryClient } from "@queries/queryClient";
import {
    archiveNote,
    createNote,
    deleteNote,
    duplicateNote,
    getTrashedNotes,
    hardDeleteAllNotes,
    hardDeleteNote,
    pinNote,
    restoreFromArchive,
    restoreFromTrash,
    sweepExpiredTrash,
    unpinNote,
    updateNote
} from "@services/notes.service";

import type { NoteUpdate } from "@entities";

const noteKeys = {
    all: ["notes"],
    trashed: ["notes", "trashed"]
} as const;

type UpdateMutationArgs = {
    id: string;
    fields: NoteUpdate;
};

const invalidateNotes = () => queryClient.invalidateQueries({ queryKey: noteKeys.all });

export function useTrashedNotesQuery() {
    const { isPending, error, data } = useQuery({
        queryKey: noteKeys.trashed,
        queryFn: getTrashedNotes
    });

    return {
        isPending,
        error,
        trashedNotes: data ?? []
    };
}

export function useNotesMutations() {
    const createNoteMutation = useMutation({ mutationFn: createNote, onSuccess: invalidateNotes });
    const duplicateNoteMutation = useMutation({
        mutationFn: duplicateNote,
        onSuccess: invalidateNotes
    });
    const updateNoteMutation = useMutation({
        mutationFn: ({ id, fields }: UpdateMutationArgs) => updateNote(id, fields),
        onSuccess: invalidateNotes
    });
    const pinNoteMutation = useMutation({ mutationFn: pinNote, onSuccess: invalidateNotes });
    const unpinNoteMutation = useMutation({ mutationFn: unpinNote, onSuccess: invalidateNotes });
    const archiveNoteMutation = useMutation({
        mutationFn: archiveNote,
        onSuccess: invalidateNotes
    });
    const restoreFromArchiveMutation = useMutation({
        mutationFn: restoreFromArchive,
        onSuccess: invalidateNotes
    });
    const restoreFromTrashMutation = useMutation({
        mutationFn: restoreFromTrash,
        onSuccess: invalidateNotes
    });
    const deleteNoteMutation = useMutation({ mutationFn: deleteNote, onSuccess: invalidateNotes });
    const hardDeleteNoteMutation = useMutation({
        mutationFn: hardDeleteNote,
        onSuccess: invalidateNotes
    });
    const hardDeleteAllNotesMutation = useMutation({
        mutationFn: hardDeleteAllNotes,
        onSuccess: invalidateNotes
    });

    return {
        createNote: createNoteMutation.mutateAsync,
        duplicateNote: duplicateNoteMutation.mutateAsync,
        updateNote: updateNoteMutation.mutateAsync,
        pinNote: pinNoteMutation.mutateAsync,
        unpinNote: unpinNoteMutation.mutateAsync,
        archiveNote: archiveNoteMutation.mutateAsync,
        restoreFromArchive: restoreFromArchiveMutation.mutateAsync,
        restoreFromTrash: restoreFromTrashMutation.mutateAsync,
        deleteNote: deleteNoteMutation.mutateAsync,
        hardDeleteNote: hardDeleteNoteMutation.mutateAsync,
        hardDeleteAllNotes: hardDeleteAllNotesMutation.mutateAsync
    };
}

export function useTrashSweep() {
    const { mutateAsync } = useMutation({
        mutationFn: sweepExpiredTrash,
        onSuccess: (count) => {
            if (count > 0) {
                queryClient.invalidateQueries({ queryKey: noteKeys.trashed });
            }
        }
    });

    useEffect(() => {
        mutateAsync().catch((err) => {
            console.error("trash sweep failed", err);
        });
    }, [mutateAsync]);
}
