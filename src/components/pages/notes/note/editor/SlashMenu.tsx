import { useFloatingPosition } from "./useFloatingPosition";

import type { SlashCommand } from "./slashMenuCommands";
import type { EditorEngine } from "@editor/engine";

type SlashMenuProps = {
    content: string;
    engine: EditorEngine | null;
    filteredActions: readonly SlashCommand[];
    selectedIndex: number;
    selection: { start: number; end: number };
    onExecute: (actionName: string) => void;
};

function SlashMenu({
    content,
    engine,
    filteredActions,
    selectedIndex,
    selection,
    onExecute
}: SlashMenuProps) {
    const { refs, floatingStyles } = useFloatingPosition({
        engine,
        content,
        selection,
        placement: "bottom-start",
        offset: 4
    });

    if (filteredActions.length === 0) {
        return null;
    }

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float z-50 w-58 rounded border p-1"
            style={floatingStyles}
        >
            <div className="text-ui-xs text-dim px-2 py-1.5 font-mono">/ commands</div>
            <div className="max-h-66 overflow-y-auto">
                {filteredActions.map((action, index) => (
                    <div
                        key={action.name}
                        ref={(el) => scrollSelectedIntoView(el, index === selectedIndex)}
                        className={`duration-fast flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors ${
                            index === selectedIndex ? "bg-accent-surface" : ""
                        }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onExecute(action.name);
                        }}
                    >
                        <div
                            className={`bg-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${
                                index === selectedIndex ? "text-accent" : "text-muted"
                            }`}
                        >
                            {action.icon}
                        </div>
                        <div>
                            <div className="text-ui-base text-text">{action.label}</div>
                            <div className="text-ui-sm text-subtle font-mono">
                                {action.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function scrollSelectedIntoView(el: HTMLDivElement | null, isSelected: boolean) {
    if (el && isSelected) {
        el.scrollIntoView({ block: "nearest" });
    }
}

export default SlashMenu;
