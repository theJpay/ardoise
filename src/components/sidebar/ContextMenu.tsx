import { computePosition, flip, offset, shift } from "@floating-ui/react";
import { Copy } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { useNotesMutations } from "@queries/useNotesQuery";

type ContextMenuProps = {
    noteId: string;
    position: { x: number; y: number };
    onClose: () => void;
};

function ContextMenu({ noteId, position, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { duplicateNote } = useNotesMutations();

    const setMenuRef = useCallback(
        (node: HTMLDivElement | null) => {
            menuRef.current = node;
            if (!node) {
                return;
            }
            const virtualEl = {
                getBoundingClientRect: () => new DOMRect(position.x, position.y, 0, 0)
            };
            computePosition(virtualEl, node, {
                placement: "bottom-start",
                middleware: [offset(4), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
                node.style.transform = `translate(${x}px, ${y}px)`;
                node.style.opacity = "1";
            });
        },
        [position]
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
        };
    }, [onClose]);

    const handleDuplicate = async () => {
        await duplicateNote(noteId);
        onClose();
    };

    return (
        <div
            ref={setMenuRef}
            className="bg-elevated border-border shadow-float fixed top-0 left-0 z-50 w-48 rounded border p-1 opacity-0"
        >
            <button
                className="text-ui-base text-muted hover:bg-accent-surface-hover hover:text-text flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 font-sans transition-colors"
                onClick={handleDuplicate}
            >
                <Copy size={13} strokeWidth={1.5} />
                Duplicate
            </button>
        </div>
    );
}

export default ContextMenu;
