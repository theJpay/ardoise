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
            className={`text-text box-border flex h-8 items-center border-l-2 transition-colors duration-100 ${
                isActive
                    ? "border-accent bg-elevated pr-2.5 pl-6"
                    : "hover:bg-elevated border-transparent pr-2.5 pl-6.5"
            }`}
        >
            <File
                size={13}
                strokeWidth={1.5}
                className={`mr-2 shrink-0 ${isActive ? "text-accent" : "text-dim"}`}
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
