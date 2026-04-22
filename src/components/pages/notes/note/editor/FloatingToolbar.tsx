import { Fragment } from "react";

import { useFloatingPosition } from "./useFloatingPosition";
import { FLOATING_TOOLBAR_ACTION_GROUPS, FLOATING_TOOLBAR_ACTIONS } from "./utils/actions";
import { FLOATING_TOOLBAR_ACTION_ICONS } from "./utils/icons";

import type { InlineActionName } from "./utils/actions";
import type { RefObject } from "react";

type FloatingToolbarProps = {
    content: string;
    editorFocused: boolean;
    phantomRef: RefObject<HTMLDivElement | null>;
    selection: { start: number; end: number };
    isInlineActive: (actionName: InlineActionName) => boolean;
    onToggleInline: (actionName: InlineActionName) => void;
    onToggleLink: () => void;
};

function FloatingToolbar({
    content,
    editorFocused,
    phantomRef,
    selection,
    isInlineActive,
    onToggleInline,
    onToggleLink
}: FloatingToolbarProps) {
    const hasSelection = selection.start !== selection.end;
    const visible = hasSelection && editorFocused;

    const { refs, floatingStyles } = useFloatingPosition({
        measureRef: phantomRef,
        content,
        selection,
        placement: "top",
        offset: 8,
        visible
    });

    if (!visible) {
        return null;
    }

    const handleAction = (name: InlineActionName) => {
        if (name === "link") {
            onToggleLink();
        } else {
            onToggleInline(name);
        }
    };

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float z-50 flex items-center gap-px rounded-md border p-1 transition-opacity duration-base ease-out"
            style={floatingStyles}
        >
            {FLOATING_TOOLBAR_ACTION_GROUPS.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="bg-border mx-0.5 h-3.5 w-px" />}
                    {group.map((name) => {
                        const action = FLOATING_TOOLBAR_ACTIONS.find((a) => a.name === name);
                        if (!action) {
                            return null;
                        }
                        return (
                            <button
                                key={name}
                                aria-label={action.label}
                                className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast ${
                                    isInlineActive(name)
                                        ? "text-accent hover:bg-accent-surface-hover"
                                        : "text-muted hover:bg-border hover:text-text"
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAction(name);
                                }}
                            >
                                {FLOATING_TOOLBAR_ACTION_ICONS[name]}
                            </button>
                        );
                    })}
                </Fragment>
            ))}
        </div>
    );
}

export default FloatingToolbar;
