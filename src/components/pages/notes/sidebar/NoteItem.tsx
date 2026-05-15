import { ChevronRight, File, MoreHorizontal, Plus } from "lucide-react";
import { Fragment, useRef } from "react";
import { Link, useParams } from "react-router";

import { MAX_DEPTH } from "@entities";
import { useAddNote } from "@hooks/useAddNote";
import { useAppNavigate } from "@hooks/useAppNavigate";
import { useDeletionState } from "@stores/deletion.store";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";

type TreeRowProps = {
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
};

type NoteItemProps = {
    note: Note;
    isMenuOpen: boolean;
    onOpenMenu: (anchor: Anchor) => void;
    onCloseMenu: () => void;
    onSelect?: () => void;
    treeRow?: TreeRowProps;
    parentPath?: string[];
};

const TREE_BASE_PADDING_PX = 10;
const TREE_DEPTH_STEP_PX = 14;
const FLAT_PADDING_PX = 34;
const ACTIVE_BORDER_OFFSET_PX = 2;

function NoteItem({
    note,
    isMenuOpen,
    onOpenMenu,
    onCloseMenu,
    onSelect,
    treeRow,
    parentPath
}: NoteItemProps) {
    const { noteId } = useParams();
    const { buildLink } = useAppNavigate();
    const { deletingNoteId } = useDeletionState();
    const isActive = noteId === note.id;
    const isExiting = deletingNoteId === note.id;
    const showPath = parentPath !== undefined && parentPath.length > 0;

    const paddingLeft = treeRow
        ? TREE_BASE_PADDING_PX +
          TREE_DEPTH_STEP_PX * treeRow.depth -
          (isActive ? ACTIVE_BORDER_OFFSET_PX : 0)
        : FLAT_PADDING_PX - (isActive ? ACTIVE_BORDER_OFFSET_PX : 0);

    return (
        <Link
            className={`text-text duration-base group relative box-border flex flex-col justify-center border-l-2 pr-2.5 transition-[opacity,transform,background-color,border-color,padding-left] ease-out focus-visible:-outline-offset-2 ${
                showPath ? "py-1.5" : "h-8"
            } ${
                isExiting
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : isActive
                      ? "border-accent bg-elevated"
                      : isMenuOpen
                        ? "bg-elevated border-transparent"
                        : "hover:bg-elevated border-transparent"
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            to={buildLink(`/notes/${note.id}`)}
            onClick={onSelect}
        >
            <div className="flex items-center gap-2">
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
            </div>
            {showPath && <ParentPath segments={parentPath} />}
            <RowActions
                isMenuOpen={isMenuOpen}
                noteId={note.id}
                treeRow={treeRow}
                onCloseMenu={onCloseMenu}
                onOpenMenu={onOpenMenu}
            />
        </Link>
    );
}

function ParentPath({ segments }: { segments: string[] }) {
    return (
        <span className="text-ui-sm text-subtle truncate">
            {segments.map((segment, i) => (
                <Fragment key={i}>
                    {i > 0 && <span className="text-dim mx-1">›</span>}
                    {segment}
                </Fragment>
            ))}
        </span>
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

type RowActionsProps = {
    isMenuOpen: boolean;
    noteId: string;
    treeRow?: TreeRowProps;
    onOpenMenu: (anchor: Anchor) => void;
    onCloseMenu: () => void;
};

function RowActions({ isMenuOpen, noteId, treeRow, onOpenMenu, onCloseMenu }: RowActionsProps) {
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const { addNote } = useAddNote();
    const showAddChild = treeRow !== undefined && treeRow.depth < MAX_DEPTH;

    return (
        <div
            className={`duration-fast absolute inset-y-0 right-1 my-auto flex items-center gap-0.5 transition-opacity ${
                isMenuOpen
                    ? "opacity-100"
                    : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
            }`}
        >
            {showAddChild && (
                <button
                    aria-label="New child note"
                    className="text-subtle hover:bg-border hover:text-text duration-fast flex h-6 w-6 items-center justify-center rounded-sm transition-colors"
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addNote(noteId);
                    }}
                >
                    <Plus size={13} strokeWidth={1.5} />
                </button>
            )}
            <button
                ref={menuButtonRef}
                aria-label="Note actions"
                className="text-subtle hover:bg-border hover:text-text duration-fast flex h-6 w-6 items-center justify-center rounded-sm transition-colors"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isMenuOpen) {
                        onCloseMenu();
                    } else {
                        onOpenMenu({ type: "element", ref: menuButtonRef });
                    }
                }}
            >
                <MoreHorizontal size={13} strokeWidth={1.5} />
            </button>
        </div>
    );
}

export default NoteItem;
