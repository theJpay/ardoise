import { useNavigate } from "react-router";

import { useNotesMutations } from "@queries/useNotesQuery";

export function useAddNote() {
    const navigate = useNavigate();
    const { createNote } = useNotesMutations();

    const addNote = async () => {
        const newNote = await createNote({ title: "", content: "" });
        navigate(`/notes/${newNote.id}`);
    };

    return { addNote };
}
