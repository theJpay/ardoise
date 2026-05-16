import { create } from "zustand";

import { DEFAULT_SORT_ORDER, SORT_ORDERS } from "@utils";

import type { SortOrder } from "@utils";

const STORAGE_KEY = "ardoise:sort-order";

type SortStore = {
    order: SortOrder;
    actions: {
        setOrder: (order: SortOrder) => void;
    };
};

const useSortStore = create<SortStore>((set) => ({
    order: readInitial(),
    actions: {
        setOrder: (order) => {
            localStorage.setItem(STORAGE_KEY, order);
            set({ order });
        }
    }
}));

function readInitial(): SortOrder {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null && (Object.values(SORT_ORDERS) as string[]).includes(stored)) {
        return stored as SortOrder;
    }
    return DEFAULT_SORT_ORDER;
}

export const useSortOrder = () => useSortStore((s) => s.order);

export const useSortActions = () => useSortStore((s) => s.actions);
