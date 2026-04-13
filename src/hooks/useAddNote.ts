import { useAppNavigate } from "@hooks/useAppNavigate";
import { useNotesMutations, useNotesQuery } from "@queries/useNotesQuery";
import { useEditorActions } from "@stores/editor.store";
import { useOnboardingActions } from "@stores/onboarding.store";

export function useAddNote() {
    const { navigate } = useAppNavigate();
    const { notes } = useNotesQuery();
    const { createNote } = useNotesMutations();
    const { setMode } = useEditorActions();
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
