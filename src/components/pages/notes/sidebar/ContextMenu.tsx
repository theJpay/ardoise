import { Archive, Command, Copy, Delete, Pin, Plus, Share2, Trash2 } from "lucide-react";
import { useMatch } from "react-router";

import { DepletionBar, Popover, ShortcutKey } from "@components/generics";
import { MAX_DEPTH, NoteEntity } from "@entities";
import { useAddNote } from "@hooks/useAddNote";
import { useAppNavigate } from "@hooks/useAppNavigate";
import { useArmedAction } from "@hooks/useArmedAction";
import {
    archiveNote,
    deleteNote,
    duplicateNote,
    hardDeleteNote,
    pinNote,
    unpinNote
} from "@services/notes.service";
import { useDeletionActions } from "@stores/deletion.store";
import { useNotes } from "@stores/notes.store";
import { depthOf, descendantsOf } from "@utils/noteTree";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { LucideIcon } from "lucide-react";

const EXIT_ANIMATION_DURATION = 150;

type ContextMenuProps = {
    note: Note;
    anchor: Anchor;
    onClose: () => void;
    onShare: () => void;
};

function ContextMenu({ note, anchor, onClose, onShare }: ContextMenuProps) {
    const { navigate } = useAppNavigate();
    const { setDeleting, reset } = useDeletionActions();
    const { notes } = useNotes();
    const { addNote } = useAddNote();
    const currentNoteMatch = useMatch("/notes/:noteId");
    const currentNoteId = currentNoteMatch?.params.noteId;
    const isCurrent = currentNoteId === note.id;
    const isCurrentInSubtree =
        isCurrent ||
        (currentNoteId !== undefined &&
            descendantsOf(note.id, notes).some((d) => d.id === currentNoteId));
    const canAddChild = depthOf(note.id, notes) < MAX_DEPTH;
    const { armed, trigger } = useArmedAction({
        onConfirm: () => {
            onClose();
            setDeleting(note.id);
            setTimeout(async () => {
                if (NoteEntity.isEmpty(note)) {
                    await hardDeleteNote(note.id);
                } else {
                    await deleteNote(note.id);
                }
                reset();
                if (isCurrentInSubtree) {
                    navigate("/notes");
                }
            }, EXIT_ANIMATION_DURATION);
        }
    });

    const isPinned = NoteEntity.isPinned(note);

    const handleDuplicate = async () => {
        await duplicateNote(note.id);
        onClose();
    };

    const handleTogglePin = async () => {
        if (isPinned) {
            await unpinNote(note.id);
        } else {
            await pinNote(note.id);
        }
        onClose();
    };

    const handleArchive = async () => {
        onClose();
        await archiveNote(note.id);
        if (isCurrentInSubtree) {
            navigate("/notes");
        }
    };

    const handleNewChild = async () => {
        onClose();
        await addNote(note.id);
    };

    return (
        <Popover anchor={anchor} className="w-48 rounded p-1" open={true} onClose={onClose}>
            <MenuItem icon={Copy} label="Duplicate" onClick={handleDuplicate} />
            <MenuDivider />
            <MenuItem icon={Share2} label="Share" onClick={onShare} />
            <MenuDivider />
            <MenuItem
                accent={isPinned}
                icon={Pin}
                label={isPinned ? "Unpin" : "Pin"}
                onClick={handleTogglePin}
            />
            <MenuItem icon={Archive} label="Archive" onClick={handleArchive} />
            <MenuItem
                disabled={!canAddChild}
                disabledHint="Maximum nesting depth reached"
                icon={Plus}
                label="New child"
                onClick={handleNewChild}
            />
            <MenuDivider />
            <button
                className={`text-ui-base duration-fast relative flex w-full items-center justify-between overflow-hidden rounded-sm px-2.5 py-1.5 transition-colors ${
                    armed ? "bg-danger-surface text-danger" : "text-danger hover:bg-danger-surface"
                }`}
                onClick={trigger}
            >
                <span className="flex items-center gap-2">
                    <Trash2 size={13} strokeWidth={1.5} />
                    {armed ? "Delete?" : "Delete"}
                </span>
                <span className="text-ui-sm text-subtle font-mono">
                    {armed ? (
                        "click again"
                    ) : (
                        <span className="flex items-center gap-0.5">
                            <ShortcutKey content={Command} />
                            <ShortcutKey content={Delete} />
                        </span>
                    )}
                </span>
                {armed && <DepletionBar />}
            </button>
        </Popover>
    );
}

type MenuItemProps = {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    accent?: boolean;
    disabled?: boolean;
    disabledHint?: string;
};

function MenuItem({
    icon: Icon,
    label,
    onClick,
    accent = false,
    disabled = false,
    disabledHint
}: MenuItemProps) {
    return (
        <button
            className={`text-ui-base duration-fast flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors ${
                disabled
                    ? "text-dim cursor-not-allowed"
                    : accent
                      ? "hover:bg-accent-surface text-accent"
                      : "text-muted hover:bg-accent-surface hover:text-text"
            }`}
            disabled={disabled}
            title={disabled ? disabledHint : undefined}
            onClick={onClick}
        >
            <Icon size={13} strokeWidth={1.5} />
            {label}
        </button>
    );
}

function MenuDivider() {
    return <div className="bg-border-soft mx-1 my-0.5 h-px" />;
}

export default ContextMenu;
