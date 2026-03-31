import { useNavigate } from "react-router";
import { useNotesActions } from "@stores/notes.store";

export function useCreateNote() {
    const navigate = useNavigate();
    const { addNote } = useNotesActions();

    const createNote = async () => {
        const newNote = await addNote({ title: "", content: "" });
        navigate(`/notes/${newNote.id}`);
    };

    return { createNote };
}
