import { create } from "zustand";

const STORAGE_KEY = "ardoise:tree-expansion";

type TreeExpansionStore = {
    expanded: Set<string>;
    actions: {
        toggle: (id: string) => void;
        expand: (ids: string[]) => void;
        collapseAll: () => void;
        pruneTo: (liveIds: Set<string>) => void;
    };
};

const useTreeExpansionStore = create<TreeExpansionStore>((set) => ({
    expanded: readInitial(),
    actions: {
        toggle: (id) =>
            set((state) => {
                const next = new Set(state.expanded);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                persist(next);
                return { expanded: next };
            }),
        expand: (ids) =>
            set((state) => {
                const next = new Set(state.expanded);
                let changed = false;
                for (const id of ids) {
                    if (!next.has(id)) {
                        next.add(id);
                        changed = true;
                    }
                }
                if (!changed) {
                    return state;
                }
                persist(next);
                return { expanded: next };
            }),
        collapseAll: () =>
            set((state) => {
                if (state.expanded.size === 0) {
                    return state;
                }
                const next = new Set<string>();
                persist(next);
                return { expanded: next };
            }),
        pruneTo: (liveIds) =>
            set((state) => {
                const next = new Set<string>();
                let changed = false;
                for (const id of state.expanded) {
                    if (liveIds.has(id)) {
                        next.add(id);
                    } else {
                        changed = true;
                    }
                }
                if (!changed) {
                    return state;
                }
                persist(next);
                return { expanded: next };
            })
    }
}));

function readInitial(): Set<string> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            return new Set();
        }
        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
            return new Set();
        }
        return new Set(parsed.filter((id): id is string => typeof id === "string"));
    } catch {
        return new Set();
    }
}

function persist(set: Set<string>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export const useIsTreeRowExpanded = (id: string) =>
    useTreeExpansionStore((s) => s.expanded.has(id));

export const useTreeExpansionActions = () => useTreeExpansionStore((s) => s.actions);

export const getTreeExpansionSnapshot = (): Set<string> =>
    new Set(useTreeExpansionStore.getState().expanded);
