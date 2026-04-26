import { Fragment } from "react";

import { ACTIONS, ICONS } from "./engine";

import type { ActionName } from "./engine";
import type { EditorHandle } from "./useEditor";

const TOOLBAR_GROUPS = [
    ["heading-1", "heading-2", "heading-3"],
    ["code-block", "quote"]
] as const satisfies readonly (readonly ActionName[])[];

type EditorToolbarProps = {
    editor: EditorHandle;
};

export function EditorToolbar({ editor }: EditorToolbarProps) {
    return (
        <div className="border-border-soft flex h-10 shrink-0 items-center gap-0.5 border-b px-5">
            {TOOLBAR_GROUPS.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="bg-border-soft mx-1 h-4 w-px" />}
                    {group.map((name) => (
                        <ToolbarButton key={name} editor={editor} name={name} />
                    ))}
                </Fragment>
            ))}
        </div>
    );
}

type ToolbarButtonProps = {
    editor: EditorHandle;
    name: ActionName;
};

function ToolbarButton({ editor, name }: ToolbarButtonProps) {
    const Icon = ICONS[name];
    const active = editor.isActive(name);
    return (
        <button
            aria-label={ACTIONS[name].label}
            className={`duration-fast flex h-7 w-7 items-center justify-center rounded transition-colors ${
                active
                    ? "text-accent bg-accent-surface hover:bg-accent-surface-hover"
                    : "text-subtle hover:bg-surface hover:text-muted"
            }`}
            onMouseDown={(e) => {
                e.preventDefault();
                editor.run(name);
            }}
        >
            <Icon size={14} strokeWidth={1.5} />
        </button>
    );
}
