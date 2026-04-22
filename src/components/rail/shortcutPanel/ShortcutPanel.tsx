import { X } from "lucide-react";
import { useEffect } from "react";

import { useClickOutside } from "@hooks/useClickOutside";
import { useFloatingMenu } from "@hooks/useFloatingMenu";

import ShortcutGroup from "./ShortcutGroup";
import { SHORTCUT_GROUPS } from "./shortcuts";

import type { RefObject } from "react";

type ShortcutPanelProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    onClose: () => void;
};

function ShortcutPanel({ anchorRef, isOpen, onClose }: ShortcutPanelProps) {
    const { refs, floatingStyles } = useFloatingMenu({
        anchor: { type: "element", ref: anchorRef },
        placement: "right",
        offset: 12
    });

    useClickOutside(refs.floating, onClose, { enabled: isOpen, ignore: anchorRef });

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float z-50 w-80 overflow-hidden rounded-md border"
            style={floatingStyles}
        >
            <div className="border-border-soft flex items-center justify-between border-b px-4 py-3">
                <span className="text-ui-base text-text font-medium">Keyboard shortcuts</span>
                <button
                    className="text-subtle hover:bg-surface hover:text-muted duration-fast flex size-5.5 items-center justify-center rounded transition-colors"
                    onClick={onClose}
                >
                    <X size={11} strokeWidth={2} />
                </button>
            </div>

            {SHORTCUT_GROUPS.map((group) => (
                <ShortcutGroup key={group.title} group={group} />
            ))}
        </div>
    );
}

export default ShortcutPanel;
