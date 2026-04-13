import { useCallback, useEffect, useRef } from "react";

import { useAppNavigate } from "@hooks/useAppNavigate";
import { useNotesMutations } from "@queries/useNotesQuery";
import { useDeletionActions, useDeletionState } from "@stores/deletion.store";

const CONFIRM_TIMEOUT = 3000;
const EXIT_ANIMATION_DURATION = 150;

export function useDeleteConfirmation() {
    const { navigate } = useAppNavigate();
    const { deleteNote, hardDeleteNote } = useNotesMutations();
    const { armed, noteId, noteTitle } = useDeletionState();
    const { arm, cancel, setDeleting, reset } = useDeletionActions();
    const timerRef = useRef<number | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

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

    const armDelete = useCallback(
        (id: string, title: string, content: string) => {
            if (isNoteEmpty(title, content)) {
                executeDelete(id, { hard: true });
                return;
            }
            clearTimer();
            arm(id, title);
            timerRef.current = setTimeout(cancel, CONFIRM_TIMEOUT);
        },
        [arm, cancel, clearTimer, executeDelete]
    );

    const confirmDelete = useCallback(async () => {
        if (!noteId) {
            return;
        }
        clearTimer();
        await executeDelete(noteId, { hard: false });
    }, [noteId, clearTimer, executeDelete]);

    const cancelDelete = useCallback(() => {
        clearTimer();
        cancel();
    }, [clearTimer, cancel]);

    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    return { armed, noteId, noteTitle, armDelete, confirmDelete, cancelDelete };
}

function isNoteEmpty(title: string, content: string): boolean {
    return title.trim() === "" && content.trim() === "";
}
