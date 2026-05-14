import { describe, expect, it } from "vitest";

import { dateFieldForSort, sortNotes } from "./sortNotes";

import type { SortOrder } from "./sortNotes";
import type { Note } from "@entities";

describe("sortNotes", () => {
    it("orders by updatedAt descending under 'updated'", () => {
        const older = generateNote({ id: "a", updatedAt: new Date(2026, 0, 1) });
        const newer = generateNote({ id: "b", updatedAt: new Date(2026, 3, 1) });

        const result = sortNotes([older, newer], "updated");

        expect(result.map((n) => n.id)).toEqual(["b", "a"]);
    });

    it("orders by createdAt descending under 'created'", () => {
        const older = generateNote({ id: "a", createdAt: new Date(2026, 0, 1) });
        const newer = generateNote({ id: "b", createdAt: new Date(2026, 3, 1) });

        const result = sortNotes([older, newer], "created");

        expect(result.map((n) => n.id)).toEqual(["b", "a"]);
    });

    it("orders by title ascending case-insensitively under 'alphabetical'", () => {
        const apple = generateNote({ id: "a", title: "apple" });
        const Banana = generateNote({ id: "b", title: "Banana" });
        const cherry = generateNote({ id: "c", title: "cherry" });

        const result = sortNotes([cherry, apple, Banana], "alphabetical");

        expect(result.map((n) => n.id)).toEqual(["a", "b", "c"]);
    });

    it("buckets untitled notes at the end under 'alphabetical'", () => {
        const titled = generateNote({ id: "a", title: "alpha" });
        const empty = generateNote({ id: "b", title: "" });
        const whitespace = generateNote({ id: "c", title: "   " });

        const result = sortNotes([empty, whitespace, titled], "alphabetical");

        expect(result.map((n) => n.id)[0]).toBe("a");
    });

    it("does not mutate the input array", () => {
        const a = generateNote({ id: "a", updatedAt: new Date(2026, 0, 1) });
        const b = generateNote({ id: "b", updatedAt: new Date(2026, 3, 1) });
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

function generateNote(overrides: Partial<Note>): Note {
    return {
        id: overrides.id ?? "id",
        title: overrides.title ?? "",
        content: overrides.content ?? "",
        createdAt: overrides.createdAt ?? new Date(2026, 0, 1),
        updatedAt: overrides.updatedAt ?? new Date(2026, 0, 1),
        lastActivityAt: overrides.lastActivityAt ?? new Date(2026, 0, 1),
        parentId: overrides.parentId ?? null,
        pinnedAt: overrides.pinnedAt ?? null,
        archivedAt: overrides.archivedAt ?? null,
        deletedAt: overrides.deletedAt ?? null
    };
}
