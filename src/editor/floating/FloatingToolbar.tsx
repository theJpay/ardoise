import { Fragment } from "react";

import { ACTIONS, getActionTooltip, ICONS } from "../engine";
import { useFloatingPosition } from "./useFloatingPosition";

import type { ActionName } from "../engine";
import type { EditorHandle } from "../useEditor";

const FLOATING_GROUPS = [
    ["bold", "italic", "strikethrough"],
    ["code", "link"]
] as const satisfies readonly (readonly ActionName[])[];

type FloatingToolbarProps = {
    editor: EditorHandle;
};

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
    const { start, end } = editor.selection;
    const selectedText = editor.engine?.getValue().slice(start, end) ?? "";
    const visible = selectedText.length > 0 && !selectedText.includes("\n") && editor.focused;

    const { refs, floatingStyles } = useFloatingPosition({
        editor,
        placement: "top",
        offset: 8,
        visible
    });

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float duration-base z-50 flex items-center gap-px rounded-md border p-1 transition-opacity ease-out"
            style={floatingStyles}
        >
            {FLOATING_GROUPS.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="bg-border mx-0.5 h-3.5 w-px" />}
                    {group.map((name) => (
                        <FloatingButton key={name} editor={editor} name={name} />
                    ))}
                </Fragment>
            ))}
        </div>
    );
}

type FloatingButtonProps = {
    editor: EditorHandle;
    name: ActionName;
};

function FloatingButton({ editor, name }: FloatingButtonProps) {
    const Icon = ICONS[name];
    const active = editor.isActive(name);
    return (
        <button
            aria-label={ACTIONS[name].label}
            className={`duration-fast flex h-7 w-7 items-center justify-center rounded transition-colors ${
                active
                    ? "text-accent hover:bg-accent-surface-hover"
                    : "text-muted hover:bg-border hover:text-text"
            }`}
            title={getActionTooltip(name)}
            onMouseDown={(e) => {
                e.preventDefault();
                editor.run(name);
            }}
        >
            <Icon size={13} strokeWidth={1.5} />
        </button>
    );
}
