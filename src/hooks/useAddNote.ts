import { useAppNavigate } from "@hooks/useAppNavigate";
import { useEditorMode } from "@hooks/useEditorMode";
import { createNote } from "@services/notes.service";
import { useNotes } from "@stores/notes.store";
import { useOnboardingActions } from "@stores/onboarding.store";
import { useTreeExpansionActions } from "@stores/treeExpansion.store";
import { ancestorsOf } from "@utils/noteTree";

export function useAddNote() {
    const { navigate } = useAppNavigate();
    const { notes } = useNotes();
    const { setMode } = useEditorMode();
    const { triggerModeTooltip } = useOnboardingActions();
    const { expand } = useTreeExpansionActions();

    const addNote = async (parentId?: string) => {
        const isFirstNote = notes.length === 0;
        const newNote = await createNote(parentId ? { parentId } : {});
        setMode("edit");

        navigate(`/notes/${newNote.id}`, { fresh: true });

        if (parentId) {
            const ancestors = ancestorsOf(parentId, notes).map((a) => a.id);
            expand([parentId, ...ancestors]);
        }

        if (isFirstNote) {
            triggerModeTooltip();
        }
    };

    return { addNote };
}
