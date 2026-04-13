import { useAppNavigate } from "@hooks/useAppNavigate";
import { useNotesMutations } from "@queries/useNotesQuery";
import { useEditorActions } from "@stores/editor.store";

export function useAddNote() {
    const { navigate } = useAppNavigate();
    const { createNote } = useNotesMutations();
    const { setMode } = useEditorActions();

    const addNote = async () => {
        const newNote = await createNote({ title: "", content: "" });
        setMode("edit");
        navigate(`/notes/${newNote.id}`, { fresh: true });
    };

    return { addNote };
}
