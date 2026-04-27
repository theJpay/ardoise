import { File } from "lucide-react";
import { Link, useParams } from "react-router";

import { useAppNavigate } from "@hooks/useAppNavigate";
import { useDeletionState } from "@stores/deletion.store";
import { formatRelativeDate } from "@utils";

import type { Note } from "@entities";

type NoteItemProps = {
    note: Note;
    dateField: "updatedAt" | "createdAt";
};

function NoteItem({ note, dateField }: NoteItemProps) {
    const { noteId } = useParams();
    const { buildLink } = useAppNavigate();
    const { deletingNoteId } = useDeletionState();
    const isActive = noteId === note.id;
    const isExiting = deletingNoteId === note.id;

    return (
        <Link
            className={`text-text duration-base group relative box-border flex h-8 items-center gap-2 border-l-2 transition-[opacity,transform,background-color,border-color,padding-left] ease-out focus-visible:-outline-offset-2 ${
                isExiting
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : isActive
                      ? "border-accent bg-elevated pr-2.5 pl-6"
                      : "hover:bg-elevated border-transparent pr-2.5 pl-6.5"
            }`}
            to={buildLink(`/notes/${note.id}`)}
        >
            <File
                className={`shrink-0 ${isActive ? "text-accent" : "text-subtle"}`}
                size={13}
                strokeWidth={1.5}
            />
            {note.title ? (
                <span className="text-ui-base flex-1 truncate">{note.title}</span>
            ) : (
                <span className="text-ui-sm text-muted flex-1 truncate italic">Untitled</span>
            )}
            <span className="text-ui-sm text-subtle duration-fast bg-elevated before:from-elevated pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 pl-2 font-mono opacity-0 transition-opacity group-hover:opacity-100 before:absolute before:inset-y-0 before:right-full before:w-4 before:bg-linear-to-l before:to-transparent before:content-['']">
                {formatRelativeDate(note[dateField])}
            </span>
        </Link>
    );
}

export default NoteItem;
