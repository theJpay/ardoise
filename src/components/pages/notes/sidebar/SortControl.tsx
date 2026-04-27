import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import { useClickOutside } from "@hooks/useClickOutside";
import { useFloatingMenu } from "@hooks/useFloatingMenu";
import { useSortActions, useSortOrder } from "@stores/sort.store";
import { SORT_ORDERS } from "@utils";

import type { SortOrder } from "@utils";

const LABELS: Record<SortOrder, string> = {
    updated: "Last modified",
    alphabetical: "Alphabetical",
    created: "Created"
};

function SortControl() {
    const order = useSortOrder();
    const { setOrder } = useSortActions();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { refs, floatingStyles } = useFloatingMenu({
        anchor: { type: "element", ref: triggerRef },
        placement: "bottom-start"
    });

    useClickOutside(refs.floating, () => setIsOpen(false), {
        enabled: isOpen,
        ignore: triggerRef
    });

    return (
        <>
            <button
                ref={triggerRef}
                className="text-ui-sm text-subtle hover:text-muted flex h-6 items-center gap-1 self-start font-mono"
                onClick={() => setIsOpen((v) => !v)}
            >
                <span>{LABELS[order]}</span>
                <ChevronDown className="text-dim" size={12} strokeWidth={1.5} />
            </button>
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    className="bg-elevated border-border shadow-float z-50 w-44 rounded border p-1"
                    style={floatingStyles}
                >
                    {SORT_ORDERS.map((opt) => (
                        <SortControlItem
                            key={opt}
                            order={opt}
                            selected={opt === order}
                            onSelect={() => {
                                setOrder(opt);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

type SortControlItemProps = {
    order: SortOrder;
    selected: boolean;
    onSelect: () => void;
};

function SortControlItem({ order, selected, onSelect }: SortControlItemProps) {
    return (
        <button
            className={`text-ui-base hover:bg-accent-surface duration-fast flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 transition-colors ${
                selected ? "text-text" : "text-muted"
            }`}
            onClick={onSelect}
        >
            <span>{LABELS[order]}</span>
            {selected && <Check className="text-accent" size={12} strokeWidth={1.8} />}
        </button>
    );
}

export default SortControl;
