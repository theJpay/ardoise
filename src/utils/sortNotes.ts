import { UnreachableError } from "./UnreachableError";

import type { Note } from "@entities";

export const SORT_ORDERS = ["updated", "alphabetical", "created"] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const DEFAULT_SORT_ORDER: SortOrder = "updated";

export function sortNotes(notes: Note[], order: SortOrder): Note[] {
    const copy = [...notes];
    switch (order) {
        case "updated":
            return copy.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        case "created":
            return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case "alphabetical":
            return copy.sort(compareAlphabetical);
        default:
            throw new UnreachableError(order);
    }
}

export function dateFieldForSort(order: SortOrder): "updatedAt" | "createdAt" {
    switch (order) {
        case "updated":
        case "alphabetical":
            return "updatedAt";
        case "created":
            return "createdAt";
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
