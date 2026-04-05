import { computePosition, flip, offset } from "@floating-ui/react";
import { useCallback, useRef } from "react";

import { FLOATING_TOOLBAR_ACTIONS } from "./utils/actions";
import { getSelectionRect } from "./utils/getSelectionRect";
import { FLOATING_TOOLBAR_ACTION_ICONS } from "./utils/icons";

import type { InlineActionName } from "./utils/actions";
import type { RefObject } from "react";

type FloatingToolbarProps = {
    editorRef: RefObject<HTMLTextAreaElement | null>;
    phantomRef: RefObject<HTMLDivElement | null>;
    selection: { start: number; end: number };
    isInlineActive: (actionName: InlineActionName) => boolean;
    onToggleInline: (actionName: InlineActionName) => void;
};

function FloatingToolbar({
    editorRef,
    phantomRef,
    selection,
    isInlineActive,
    onToggleInline
}: FloatingToolbarProps) {
    const hasSelection = selection.start !== selection.end;
    const floatingRef = useRef<HTMLDivElement>(null);

    const setFloatingRef = useCallback(
        (node: HTMLDivElement | null) => {
            floatingRef.current = node;
            if (!node || !hasSelection || !phantomRef.current || !editorRef.current) {
                return;
            }
            const rect = getSelectionRect(phantomRef.current, editorRef.current, selection);
            if (!rect) {
                return;
            }
            const virtualEl = { getBoundingClientRect: () => rect };
            computePosition(virtualEl, node, {
                placement: "top",
                middleware: [offset(8), flip()]
            }).then(({ x, y }) => {
                node.style.transform = `translate(${x}px, ${y}px)`;
                node.style.opacity = "1";
                node.style.pointerEvents = "auto";
            });
        },
        [hasSelection, phantomRef, editorRef, selection]
    );

    if (!hasSelection) {
        return null;
    }

    return (
        <div
            ref={setFloatingRef}
            className="bg-elevated border-border z-50 flex items-center gap-px rounded-md border p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-opacity duration-150"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                opacity: 0,
                pointerEvents: "none"
            }}
        >
            {FLOATING_TOOLBAR_ACTIONS.map(({ name, label }, index) => (
                <div key={name} className="flex items-center">
                    {index === 2 && <div className="bg-border mx-0.5 h-3.5 w-px" />}
                    <button
                        aria-label={label}
                        className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-100 ${
                            isInlineActive(name)
                                ? "text-accent hover:bg-accent-glow"
                                : "text-muted hover:bg-border hover:text-text"
                        }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onToggleInline(name);
                        }}
                    >
                        {FLOATING_TOOLBAR_ACTION_ICONS[name]}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default FloatingToolbar;
