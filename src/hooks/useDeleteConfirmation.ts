import { useCallback } from "react";

import { NoteEntity } from "@entities";
import { useAppNavigate } from "@hooks/useAppNavigate";
import { useArmedAction } from "@hooks/useArmedAction";
import { useNotesMutations } from "@queries/useNotesQuery";
import { useDeletionActions, useDeletionState } from "@stores/deletion.store";

import type { Note } from "@entities";

const EXIT_ANIMATION_DURATION = 150;

export function useDeleteConfirmation() {
    const { navigate } = useAppNavigate();
    const { deleteNote, hardDeleteNote } = useNotesMutations();
    const { noteId } = useDeletionState();
    const { arm: armStore, cancel: cancelStore, setDeleting, reset } = useDeletionActions();

    const executeDelete = useCallback(
        async (id: string, { hard }: { hard: boolean }) => {
            setDeleting(id);
            setTimeout(async () => {
                if (hard) {
                    await hardDeleteNote(id);
                } else {
                    await deleteNote(id);
                }
                reset();
                navigate("/notes");
            }, EXIT_ANIMATION_DURATION);
        },
        [setDeleting, deleteNote, hardDeleteNote, reset, navigate]
    );

    const onConfirm = useCallback(async () => {
        if (!noteId) {
            return;
        }
        await executeDelete(noteId, { hard: false });
    }, [noteId, executeDelete]);

    const { arm, confirm, cancel } = useArmedAction({
        onConfirm,
        onCancel: cancelStore
    });

    const armDelete = useCallback(
        (note: Note) => {
            if (NoteEntity.isEmpty(note)) {
                executeDelete(note.id, { hard: true });
                return;
            }
            arm();
            armStore(note.id, note.title);
        },
        [arm, armStore, executeDelete]
    );

    return {
        armDelete,
        confirmDelete: confirm,
        cancelDelete: cancel
    };
}
