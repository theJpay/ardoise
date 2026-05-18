import { Check, ChevronDown } from "lucide-react";
import { Fragment, useRef, useState } from "react";

import { Popover } from "@components/generics";
import { useSortActions, useSortOrder } from "@stores/sort.store";
import { SORT_ORDERS } from "@utils";

import type { SortOrder } from "@utils";

const LABELS: Record<SortOrder, string> = {
    [SORT_ORDERS.UPDATED]: "Last modified",
    [SORT_ORDERS.ALPHABETICAL]: "Alphabetical",
    [SORT_ORDERS.CREATED]: "Created",
    [SORT_ORDERS.RECENT_FLAT]: "Recent — flat"
};

const SORT_GROUPS: SortOrder[][] = [
    [SORT_ORDERS.UPDATED, SORT_ORDERS.ALPHABETICAL, SORT_ORDERS.CREATED],
    [SORT_ORDERS.RECENT_FLAT]
];

function SortControl() {
    const order = useSortOrder();
    const { setOrder } = useSortActions();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={triggerRef}
                className="text-ui-sm text-subtle hover:text-muted flex h-6 items-center gap-1 font-mono"
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
                {SORT_GROUPS.map((group, groupIndex) => (
                    <Fragment key={groupIndex}>
                        {groupIndex > 0 && <div className="bg-border-soft mx-1 my-0.5 h-px" />}
                        {group.map((opt) => (
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
                    </Fragment>
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
