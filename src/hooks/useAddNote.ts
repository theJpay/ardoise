import { useNavigate } from "react-router";

import { useNotesQuery } from "@queries/useNotesQuery";

export function useAddNote() {
    const navigate = useNavigate();
    const { createNote } = useNotesQuery();

    const addNote = async () => {
        const newNote = await createNote({ title: "", content: "" });
        navigate(`/notes/${newNote.id}`);
    };

    return { addNote };
}
