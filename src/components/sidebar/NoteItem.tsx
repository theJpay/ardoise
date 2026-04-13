import { File } from "lucide-react";
import { Link, useParams } from "react-router";

import { useAppNavigate } from "@hooks/useAppNavigate";
import { useDeletionState } from "@stores/deletion.store";

import type { Note } from "@entities";

type NoteItemProps = {
    note: Note;
};

function NoteItem({ note }: NoteItemProps) {
    const { noteId } = useParams();
    const { buildLink } = useAppNavigate();
    const { deletingNoteId } = useDeletionState();
    const isActive = noteId === note.id;
    const isExiting = deletingNoteId === note.id;

    return (
        <Link
            className={`text-text box-border flex h-8 items-center border-l-2 transition-all duration-150 ease-out ${
                isExiting
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : isActive
                      ? "border-accent bg-elevated pr-2.5 pl-6"
                      : "hover:bg-elevated border-transparent pr-2.5 pl-6.5"
            }`}
            to={buildLink(`/notes/${note.id}`)}
        >
            <File
                className={`mr-2 shrink-0 ${isActive ? "text-accent" : "text-subtle"}`}
                size={13}
                strokeWidth={1.5}
            />
            {note.title ? (
                <span className="text-ui-base truncate">{note.title}</span>
            ) : (
                <span className="text-ui-sm text-muted italic">Untitled</span>
            )}
        </Link>
    );
}

export default NoteItem;
