import { UnreachableError } from "./UnreachableError";

import type { Note } from "@entities";

export const SORT_ORDERS = {
    UPDATED: "updated",
    CREATED: "created",
    ALPHABETICAL: "alphabetical"
} as const;

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];

export const DEFAULT_SORT_ORDER: SortOrder = SORT_ORDERS.UPDATED;

export function sortNotes(notes: Note[], order: SortOrder): Note[] {
    const copy = [...notes];
    switch (order) {
        case SORT_ORDERS.UPDATED:
            return copy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        case SORT_ORDERS.CREATED:
            return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case SORT_ORDERS.ALPHABETICAL:
            return copy.sort(compareAlphabetical);
        default:
            throw new UnreachableError(order);
    }
}

function compareAlphabetical(a: Note, b: Note): number {
    const aEmpty = a.title.trim() === "";
    const bEmpty = b.title.trim() === "";
    if (aEmpty && !bEmpty) {
        return 1;
    }
    if (!aEmpty && bEmpty) {
        return -1;
    }
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
}
