import { Command, Copy, Delete, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ShortcutKey } from "@components/generics";
import { NoteEntity } from "@entities";
import { useAppNavigate } from "@hooks/useAppNavigate";
import { useFloatingMenu } from "@hooks/useFloatingMenu";
import { useNotesMutations } from "@queries/useNotesQuery";
import { useDeletionActions } from "@stores/deletion.store";

import type { Note } from "@entities";

const CONFIRM_TIMEOUT = 3000;
const EXIT_ANIMATION_DURATION = 150;

type ContextMenuProps = {
    note: Note;
    position: { x: number; y: number };
    onClose: () => void;
};

function ContextMenu({ note, position, onClose }: ContextMenuProps) {
    const { refs, floatingStyles } = useFloatingMenu({
        anchor: { type: "coordinates", x: position.x, y: position.y }
    });
    const { duplicateNote, deleteNote, hardDeleteNote } = useNotesMutations();
    const { setDeleting, reset } = useDeletionActions();
    const { navigate } = useAppNavigate();
    const [armed, setArmed] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (refs.floating.current && !refs.floating.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [refs.floating, onClose]);

    const handleDuplicate = async () => {
        await duplicateNote(note.id);
        onClose();
    };

    const handleDelete = () => {
        if (!armed) {
            setArmed(true);
            timerRef.current = setTimeout(() => {
                setArmed(false);
            }, CONFIRM_TIMEOUT);
            return;
        }

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
    };

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float z-50 w-48 rounded border p-1"
            style={floatingStyles}
        >
            <button
                className="text-ui-base text-muted hover:bg-accent-surface hover:text-text flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 font-sans transition-colors"
                onClick={handleDuplicate}
            >
                <Copy size={13} strokeWidth={1.5} />
                Duplicate
            </button>
            <div className="bg-border-soft mx-1 my-0.5 h-px" />
            <button
                className={`text-ui-base relative flex w-full items-center justify-between overflow-hidden rounded-sm px-2.5 py-1.5 font-sans transition-colors ${
                    armed ? "bg-danger-surface text-danger" : "text-danger hover:bg-danger-surface"
                }`}
                onClick={handleDelete}
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
                {armed && (
                    <span
                        className="bg-danger absolute bottom-0 left-0 h-[1.5px] w-full origin-left"
                        style={{ animation: "timer-deplete 3s linear forwards" }}
                    />
                )}
            </button>
        </div>
    );
}

export default ContextMenu;
