import { useEffect, useRef } from "react";

import { ACTIONS, ICONS } from "../engine";
import { scrollIntoOverflowParent } from "../scroll";
import { useFloatingPosition } from "./useFloatingPosition";

import type { EditorHandle } from "../useEditor";
import type { useSlashMenu } from "./useSlashMenu";
import type { ComponentType, RefObject } from "react";

type SlashMenuProps = {
    editor: EditorHandle;
    slash: ReturnType<typeof useSlashMenu>;
};

export function SlashMenu({ editor, slash }: SlashMenuProps) {
    const { state, filteredNames, executeCommand, select } = slash;

    const { refs, floatingStyles } = useFloatingPosition({
        editor,
        placement: "bottom-start",
        offset: 4,
        visible: state.isOpen
    });

    if (!state.isOpen || filteredNames.length === 0) {
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
                {filteredNames.map((name, index) => (
                    <SlashItem
                        key={name}
                        description={ACTIONS[name].description}
                        Icon={ICONS[name]}
                        label={ACTIONS[name].label}
                        selected={index === state.selectedIndex}
                        onHover={() => select(index)}
                        onSelect={() => executeCommand(name)}
                    />
                ))}
            </div>
        </div>
    );
}

type SlashItemProps = {
    Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    description?: string;
    selected: boolean;
    onSelect: () => void;
    onHover: () => void;
};

function SlashItem({ Icon, label, description, selected, onSelect, onHover }: SlashItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    useScrollIntoOverflowParent(ref, selected);

    return (
        <div
            ref={ref}
            className={`duration-fast flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors ${
                selected ? "bg-accent-surface" : ""
            }`}
            onMouseDown={(e) => {
                e.preventDefault();
                onSelect();
            }}
            onMouseEnter={onHover}
        >
            <div
                className={`bg-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${
                    selected ? "text-accent" : "text-muted"
                }`}
            >
                <Icon size={13} strokeWidth={1.5} />
            </div>
            <div>
                <div className="text-ui-base text-text">{label}</div>
                {description && (
                    <div className="text-ui-sm text-subtle font-mono">{description}</div>
                )}
            </div>
        </div>
    );
}

function useScrollIntoOverflowParent(ref: RefObject<HTMLElement | null>, active: boolean) {
    useEffect(() => {
        if (!active) {
            return;
        }
        scrollIntoOverflowParent(ref.current);
    }, [active, ref]);
}
