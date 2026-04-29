import { X } from "lucide-react";

import { Popover } from "@components/generics";

import ShortcutGroup from "./ShortcutGroup";
import { SHORTCUT_GROUPS } from "./shortcuts";

import type { RefObject } from "react";

type ShortcutPanelProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    onClose: () => void;
};

function ShortcutPanel({ anchorRef, isOpen, onClose }: ShortcutPanelProps) {
    return (
        <Popover
            anchor={{ type: "element", ref: anchorRef }}
            className="w-80 overflow-hidden rounded-md"
            ignoreClickOutsideRef={anchorRef}
            offset={12}
            open={isOpen}
            placement="right"
            onClose={onClose}
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
        </Popover>
    );
}

export default ShortcutPanel;
