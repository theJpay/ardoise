import { useAppNavigate } from "@hooks/useAppNavigate";
import { useNotesMutations } from "@queries/useNotesQuery";

export function useAddNote() {
    const { navigate } = useAppNavigate();
    const { createNote } = useNotesMutations();

    const addNote = async () => {
        const newNote = await createNote({ title: "", content: "" });
        navigate(`/notes/${newNote.id}`, { fresh: true });
    };

    return { addNote };
}
