import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { useNotesMutations } from "@queries/useNotesQuery";
import { useDeletionActions, useDeletionState } from "@stores/deletion.store";

const CONFIRM_TIMEOUT = 3000;
const EXIT_ANIMATION_DURATION = 150;

export function useDeleteConfirmation() {
    const navigate = useNavigate();
    const { deleteNote } = useNotesMutations();
    const { armed, noteId, noteTitle } = useDeletionState();
    const { arm, cancel, setDeleting, reset } = useDeletionActions();
    const timerRef = useRef<number | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const armDelete = useCallback(
        (id: string, title: string) => {
            clearTimer();
            arm(id, title);
            timerRef.current = setTimeout(() => {
                cancel();
            }, CONFIRM_TIMEOUT);
        },
        [arm, cancel, clearTimer]
    );

    const confirmDelete = useCallback(async () => {
        if (!noteId) {
            return;
        }
        clearTimer();
        setDeleting(noteId);

        setTimeout(async () => {
            await deleteNote(noteId);
            reset();
            navigate("/notes");
        }, EXIT_ANIMATION_DURATION);
    }, [noteId, clearTimer, setDeleting, deleteNote, reset, navigate]);

    const cancelDelete = useCallback(() => {
        clearTimer();
        cancel();
    }, [clearTimer, cancel]);

    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    return { armed, noteId, noteTitle, armDelete, confirmDelete, cancelDelete };
}
