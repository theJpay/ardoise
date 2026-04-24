import { Bold, Code, Italic, Link, Strikethrough } from "lucide-react";
import { Fragment } from "react";

import { ACTIONS } from "@utils/editorEngine";

import { useFloatingPosition } from "./useFloatingPosition";

import type { ActionName, EditorEngine } from "@utils/editorEngine";

const FLOATING_GROUPS = [
    ["bold", "italic", "strikethrough"],
    ["code", "link"]
] as const satisfies readonly (readonly ActionName[])[];

type FloatingName = (typeof FLOATING_GROUPS)[number][number];

const ICONS: Record<FloatingName, React.ReactNode> = {
    bold: <Bold size={13} strokeWidth={1.5} />,
    italic: <Italic size={13} strokeWidth={1.5} />,
    strikethrough: <Strikethrough size={13} strokeWidth={1.5} />,
    code: <Code size={13} strokeWidth={1.5} />,
    link: <Link size={13} strokeWidth={1.5} />
};

type FloatingToolbarProps = {
    content: string;
    editorFocused: boolean;
    engine: EditorEngine | null;
    selection: { start: number; end: number };
    isActive: (actionName: ActionName) => boolean;
    onAction: (actionName: ActionName) => void;
    onToggleLink: () => void;
};

function FloatingToolbar({
    content,
    editorFocused,
    engine,
    selection,
    isActive,
    onAction,
    onToggleLink
}: FloatingToolbarProps) {
    const hasSelection = selection.start !== selection.end;
    const visible = hasSelection && editorFocused;

    const { refs, floatingStyles } = useFloatingPosition({
        engine,
        content,
        selection,
        placement: "top",
        offset: 8,
        visible
    });

    if (!visible) {
        return null;
    }

    const handleAction = (name: FloatingName) => {
        if (name === "link") {
            onToggleLink();
        } else {
            onAction(name);
        }
    };

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
                        <button
                            key={name}
                            aria-label={ACTIONS[name].label}
                            className={`duration-fast flex h-7 w-7 items-center justify-center rounded transition-colors ${
                                isActive(name)
                                    ? "text-accent hover:bg-accent-surface-hover"
                                    : "text-muted hover:bg-border hover:text-text"
                            }`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleAction(name);
                            }}
                        >
                            {ICONS[name]}
                        </button>
                    ))}
                </Fragment>
            ))}
        </div>
    );
}

export default FloatingToolbar;
