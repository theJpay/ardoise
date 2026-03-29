import { PenLine } from "lucide-react";
import { AddNoteButton, EmptyState } from "@components/generics";
import { useCreateNote } from "@hooks/useCreateNote";

function NoteIndex() {
    const { createNote } = useCreateNote();

    return (
        <EmptyState
            icon={<PenLine size={18} strokeWidth={1.5} />}
            title="No note selected"
            body="Pick a note from the sidebar or create a new one."
            action={<AddNoteButton onClick={createNote} />}
        />
    );
}

export default NoteIndex;
