import { TOOLBAR_ACTIONS } from "./utils/actions";
import { TOOLBAR_ACTION_ICONS } from "./utils/icons";

import type { BlockActionName } from "./utils/actions";

type ToolbarProps = {
    isBlockActive: (actionName: BlockActionName) => boolean;
    onToggleBlock: (actionName: BlockActionName) => void;
};

function Toolbar({ isBlockActive, onToggleBlock }: ToolbarProps) {
    return (
        <div className="border-border-soft flex h-10 shrink-0 items-center gap-0.5 border-b px-5">
            {TOOLBAR_ACTIONS.map(({ name, label }) => (
                <button
                    key={name}
                    aria-label={label}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-100 ${
                        isBlockActive(name)
                            ? "text-accent bg-accent-glow hover:bg-accent-tag"
                            : "text-dim hover:bg-surface hover:text-muted"
                    }`}
                    onClick={() => onToggleBlock(name)}
                >
                    {TOOLBAR_ACTION_ICONS[name]}
                </button>
            ))}
            <div className="bg-border-soft mx-1 h-4 w-px" />
        </div>
    );
}

export default Toolbar;
