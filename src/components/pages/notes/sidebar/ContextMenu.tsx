import { Command, Copy, Delete, Share2, Trash2 } from "lucide-react";

import { DepletionBar, Popover, ShortcutKey } from "@components/generics";
import { NoteEntity } from "@entities";
import { useAppNavigate } from "@hooks/useAppNavigate";
import { useArmedAction } from "@hooks/useArmedAction";
import { useNotesMutations } from "@queries/useNotesQuery";
import { useDeletionActions } from "@stores/deletion.store";

import type { Note } from "@entities";

const EXIT_ANIMATION_DURATION = 150;

type ContextMenuProps = {
    note: Note;
    position: { x: number; y: number };
    onClose: () => void;
    onShare: () => void;
};

function ContextMenu({ note, position, onClose, onShare }: ContextMenuProps) {
    const { duplicateNote, deleteNote, hardDeleteNote } = useNotesMutations();
    const { setDeleting, reset } = useDeletionActions();
    const { navigate } = useAppNavigate();
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

    const handleDuplicate = async () => {
        await duplicateNote(note.id);
        onClose();
    };

    return (
        <Popover
            anchor={{ type: "coordinates", x: position.x, y: position.y }}
            className="w-48 rounded p-1"
            open={true}
            onClose={onClose}
        >
            <button
                className="text-ui-base text-muted hover:bg-accent-surface hover:text-text duration-fast flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors"
                onClick={handleDuplicate}
            >
                <Copy size={13} strokeWidth={1.5} />
                Duplicate
            </button>
            <div className="bg-border-soft mx-1 my-0.5 h-px" />
            <button
                className="text-ui-base text-muted hover:bg-accent-surface hover:text-text duration-fast flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors"
                onClick={onShare}
            >
                <Share2 size={13} strokeWidth={1.5} />
                Share
            </button>
            <div className="bg-border-soft mx-1 my-0.5 h-px" />
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

export default ContextMenu;
