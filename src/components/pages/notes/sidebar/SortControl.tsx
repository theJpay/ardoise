import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import { Popover } from "@components/generics";
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
            <Popover
                anchor={{ type: "element", ref: triggerRef }}
                className="w-44 rounded p-1"
                closeOnEscape={false}
                ignoreClickOutsideRef={triggerRef}
                open={isOpen}
                placement="bottom-start"
                onClose={() => setIsOpen(false)}
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
            </Popover>
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
            {selected && <Check className="text-accent" size={12} strokeWidth={1.5} />}
        </button>
    );
}

export default SortControl;
