import { useFloatingPosition } from "./useFloatingPosition";
import { COMMAND_PALETTE_ACTION_ICONS } from "./utils/icons";

import type { CommandPaletteAction } from "./utils/actions";
import type { RefObject } from "react";

type CommandPaletteProps = {
    content: string;
    filteredActions: readonly CommandPaletteAction[];
    phantomRef: RefObject<HTMLDivElement | null>;
    selectedIndex: number;
    selection: { start: number; end: number };
    onExecute: (actionName: string) => void;
};

function CommandPalette({
    content,
    filteredActions,
    phantomRef,
    selectedIndex,
    selection,
    onExecute
}: CommandPaletteProps) {
    const setFloatingRef = useFloatingPosition({
        measureRef: phantomRef,
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
            ref={setFloatingRef}
            className="bg-elevated border-border z-50 w-58 rounded border p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                opacity: 0
            }}
        >
            <div className="text-dim px-2 py-1.5 font-mono text-[9px] tracking-[0.14em] uppercase">
                / commands
            </div>
            <div className="max-h-66 overflow-y-auto">
                {filteredActions.map((action, index) => (
                    <div
                        key={action.name}
                        ref={(el) => scrollSelectedIntoView(el, index === selectedIndex)}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors duration-100 ${
                            index === selectedIndex ? "bg-accent-glow" : ""
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
                            {COMMAND_PALETTE_ACTION_ICONS[action.name]}
                        </div>
                        <div>
                            <div className="text-text font-sans text-[13px]">{action.label}</div>
                            <div className="text-dim font-mono text-[9px]">
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

export default CommandPalette;
