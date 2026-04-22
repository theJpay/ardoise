import { Fragment } from "react";

import { TOOLBAR_ACTION_GROUPS, TOOLBAR_ACTIONS } from "./utils/actions";
import { TOOLBAR_ACTION_ICONS } from "./utils/icons";

import type { BlockActionName } from "./utils/actions";

type ToolbarProps = {
    isBlockActive: (actionName: BlockActionName) => boolean;
    onToggleBlock: (actionName: BlockActionName) => void;
};

function Toolbar({ isBlockActive, onToggleBlock }: ToolbarProps) {
    return (
        <div className="border-border-soft flex h-10 shrink-0 items-center gap-0.5 border-b px-5">
            {TOOLBAR_ACTION_GROUPS.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="bg-border-soft mx-1 h-4 w-px" />}
                    {group.map((name) => {
                        const action = TOOLBAR_ACTIONS.find((a) => a.name === name);
                        if (!action) {
                            return null;
                        }
                        return (
                            <button
                                key={name}
                                aria-label={action.label}
                                className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast ${
                                    isBlockActive(name)
                                        ? "text-accent bg-accent-surface hover:bg-accent-surface-hover"
                                        : "text-subtle hover:bg-surface hover:text-muted"
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onToggleBlock(name);
                                }}
                            >
                                {TOOLBAR_ACTION_ICONS[name]}
                            </button>
                        );
                    })}
                </Fragment>
            ))}
        </div>
    );
}

export default Toolbar;
