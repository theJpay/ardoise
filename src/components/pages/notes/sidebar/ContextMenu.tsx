import { Archive, Command, Copy, Delete, Pin, Share2, Trash2 } from "lucide-react";
import { useMatch } from "react-router";

import { DepletionBar, Popover, ShortcutKey } from "@components/generics";
import { NoteEntity } from "@entities";
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
    const currentNoteMatch = useMatch("/notes/:noteId");
    const isCurrent = currentNoteMatch?.params.noteId === note.id;
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
                navigate("/notes");
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
        if (isCurrent) {
            navigate("/notes");
        }
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
};

function MenuItem({ icon: Icon, label, onClick, accent = false }: MenuItemProps) {
    return (
        <button
            className={`text-ui-base hover:bg-accent-surface duration-fast flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors ${
                accent ? "text-accent" : "text-muted hover:text-text"
            }`}
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
