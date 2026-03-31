import { PenLine } from "lucide-react";

import { AddNoteButton, EmptyState } from "@components/generics";
import { useCreateNote } from "@hooks/useCreateNote";

function NoteIndex() {
    const { createNote } = useCreateNote();

    return (
        <EmptyState
            action={<AddNoteButton onClick={createNote} />}
            body="Pick a note from the sidebar or create a new one."
            icon={<PenLine size={18} strokeWidth={1.5} />}
            title="No note selected"
        />
    );
}

export default NoteIndex;
