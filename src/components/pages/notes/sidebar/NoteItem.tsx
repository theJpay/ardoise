import { ChevronRight, File } from "lucide-react";
import { Link, useParams } from "react-router";

import { useAppNavigate } from "@hooks/useAppNavigate";
import { useDeletionState } from "@stores/deletion.store";
import { formatRelativeDate } from "@utils";

import type { Note } from "@entities";

type TreeRowProps = {
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
};

type NoteItemProps = {
    note: Note;
    dateField: "updatedAt" | "createdAt";
    treeRow?: TreeRowProps;
};

const TREE_BASE_PADDING_PX = 10;
const TREE_DEPTH_STEP_PX = 14;
const FLAT_PADDING_PX = 34;
const ACTIVE_BORDER_OFFSET_PX = 2;

function NoteItem({ note, dateField, treeRow }: NoteItemProps) {
    const { noteId } = useParams();
    const { buildLink } = useAppNavigate();
    const { deletingNoteId } = useDeletionState();
    const isActive = noteId === note.id;
    const isExiting = deletingNoteId === note.id;

    const paddingLeft = treeRow
        ? TREE_BASE_PADDING_PX +
          TREE_DEPTH_STEP_PX * treeRow.depth -
          (isActive ? ACTIVE_BORDER_OFFSET_PX : 0)
        : FLAT_PADDING_PX - (isActive ? ACTIVE_BORDER_OFFSET_PX : 0);

    return (
        <Link
            className={`text-text duration-base group relative box-border flex h-8 items-center gap-2 border-l-2 pr-2.5 transition-[opacity,transform,background-color,border-color,padding-left] ease-out focus-visible:-outline-offset-2 ${
                isExiting
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : isActive
                      ? "border-accent bg-elevated"
                      : "hover:bg-elevated border-transparent"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            to={buildLink(`/notes/${note.id}`)}
        >
            {treeRow && <ChevronToggle {...treeRow} />}
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
                {formatRelativeDate(note[dateField], { short: true })}
            </span>
        </Link>
    );
}

function ChevronToggle({ hasChildren, isExpanded, onToggleExpand }: TreeRowProps) {
    return (
        <button
            aria-hidden={!hasChildren}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className={`text-dim flex h-4 w-4 shrink-0 items-center justify-center ${hasChildren ? "" : "invisible"}`}
            tabIndex={hasChildren ? 0 : -1}
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (hasChildren) {
                    onToggleExpand();
                }
            }}
        >
            <ChevronRight
                className={`duration-fast transition-transform ${isExpanded ? "rotate-90" : ""}`}
                size={11}
                strokeWidth={2}
            />
        </button>
    );
}

export default NoteItem;
