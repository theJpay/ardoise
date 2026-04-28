import { describe, expect, it } from "vitest";

import { dateFieldForSort, sortNotes } from "./sortNotes";

import type { SortOrder } from "./sortNotes";
import type { Note } from "@entities";

function note(overrides: Partial<Note>): Note {
    return {
        id: overrides.id ?? "id",
        title: overrides.title ?? "",
        content: overrides.content ?? "",
        createdAt: overrides.createdAt ?? new Date(2026, 0, 1),
        updatedAt: overrides.updatedAt ?? new Date(2026, 0, 1),
        pinnedAt: overrides.pinnedAt ?? null,
        deletedAt: overrides.deletedAt ?? null
    };
}

describe("sortNotes", () => {
    it("orders by updatedAt descending under 'updated'", () => {
        const older = note({ id: "a", updatedAt: new Date(2026, 0, 1) });
        const newer = note({ id: "b", updatedAt: new Date(2026, 3, 1) });

        const result = sortNotes([older, newer], "updated");

        expect(result.map((n) => n.id)).toEqual(["b", "a"]);
    });

    it("orders by createdAt descending under 'created'", () => {
        const older = note({ id: "a", createdAt: new Date(2026, 0, 1) });
        const newer = note({ id: "b", createdAt: new Date(2026, 3, 1) });

        const result = sortNotes([older, newer], "created");

        expect(result.map((n) => n.id)).toEqual(["b", "a"]);
    });

    it("orders by title ascending case-insensitively under 'alphabetical'", () => {
        const apple = note({ id: "a", title: "apple" });
        const Banana = note({ id: "b", title: "Banana" });
        const cherry = note({ id: "c", title: "cherry" });

        const result = sortNotes([cherry, apple, Banana], "alphabetical");

        expect(result.map((n) => n.id)).toEqual(["a", "b", "c"]);
    });

    it("buckets untitled notes at the end under 'alphabetical'", () => {
        const titled = note({ id: "a", title: "alpha" });
        const empty = note({ id: "b", title: "" });
        const whitespace = note({ id: "c", title: "   " });

        const result = sortNotes([empty, whitespace, titled], "alphabetical");

        expect(result.map((n) => n.id)[0]).toBe("a");
    });

    it("does not mutate the input array", () => {
        const a = note({ id: "a", updatedAt: new Date(2026, 0, 1) });
        const b = note({ id: "b", updatedAt: new Date(2026, 3, 1) });
        const input = [a, b];

        sortNotes(input, "updated");

        expect(input.map((n) => n.id)).toEqual(["a", "b"]);
    });
});

describe("dateFieldForSort", () => {
    it.each<[SortOrder, "updatedAt" | "createdAt"]>([
        ["updated", "updatedAt"],
        ["alphabetical", "updatedAt"],
        ["created", "createdAt"]
    ])("maps %s to %s", (order, expected) => {
        expect(dateFieldForSort(order)).toBe(expected);
    });
});
