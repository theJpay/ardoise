import { File } from "lucide-react";
import { Link, useParams } from "react-router";

import type { Note } from "@entities";

type NoteItemProps = {
    note: Note;
};

function NoteItem({ note }: NoteItemProps) {
    const { noteId } = useParams();
    const isActive = noteId === note.id;

    return (
        <Link
            to={`/notes/${note.id}`}
            className={`flex box-border items-center gap-1.5 h-8 px-3 border-l-2 transition-colors duration-100 text-text ${
                isActive
                    ? "border-accent bg-elevated text-text"
                    : "border-transparent hover:bg-elevated"
            }`}
        >
            <File
                size={12}
                strokeWidth={1.5}
                className={isActive ? "text-accent" : "text-subtle"}
            />
            <span className="text-xs truncate">{note.title}</span>
        </Link>
    );
}

export default NoteItem;
