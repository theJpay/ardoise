import { PenLine } from "lucide-react";

import { AddNoteButton, EmptyState } from "@components/generics";
import { useAddNote } from "@hooks/useAddNote";

function NoteIndex() {
    const { addNote } = useAddNote();

    return (
        <EmptyState
            action={<AddNoteButton onClick={addNote} />}
            body="Pick a note from the sidebar or create a new one."
            icon={<PenLine size={18} strokeWidth={1.5} />}
            title="No note selected"
        />
    );
}

export default NoteIndex;
