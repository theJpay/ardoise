import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@queries/queryClient";
import {
    archiveNote,
    createNote,
    deleteNote,
    duplicateNote,
    getArchivedNotes,
    getNotes,
    getTrashedNotes,
    hardDeleteAllNotes,
    hardDeleteNote,
    pinNote,
    restoreFromArchive,
    restoreFromTrash,
    unpinNote,
    updateNote
} from "@services/notes.service";

import type { NoteUpdate } from "@entities";

const noteKeys = {
    all: ["notes"],
    active: ["notes", "active"],
    archived: ["notes", "archived"],
    trashed: ["notes", "trashed"]
} as const;

type UpdateMutationArgs = {
    id: string;
    fields: NoteUpdate;
};

const invalidateNotes = () => queryClient.invalidateQueries({ queryKey: noteKeys.all });

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
