import { useAppNavigate } from "@hooks/useAppNavigate";
import { useEditorMode } from "@hooks/useEditorMode";
import { useNotesMutations, useNotesQuery } from "@queries/useNotesQuery";
import { useOnboardingActions } from "@stores/onboarding.store";

export function useAddNote() {
    const { navigate } = useAppNavigate();
    const { notes } = useNotesQuery();
    const { createNote } = useNotesMutations();
    const { setMode } = useEditorMode();
    const { triggerModeTooltip } = useOnboardingActions();

    const addNote = async () => {
        const isFirstNote = notes.length === 0;
        const newNote = await createNote({ title: "", content: "" });
        setMode("edit");

        if (isFirstNote) {
            triggerModeTooltip();
        }

        navigate(`/notes/${newNote.id}`, { fresh: true });
    };

    return { addNote };
}
