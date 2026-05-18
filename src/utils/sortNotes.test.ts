import { describe, expect, it } from "vitest";

import { generateNote } from "@entities/note.fixtures";

import { sortNotes } from "./sortNotes";

describe("sortNotes", () => {
    it("orders by lastActivityAt descending under 'updated'", () => {
        const older = generateNote({ id: "a", lastActivityAt: new Date(2026, 0, 1) });
        const newer = generateNote({ id: "b", lastActivityAt: new Date(2026, 3, 1) });

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
        const a = generateNote({ id: "a", lastActivityAt: new Date(2026, 0, 1) });
        const b = generateNote({ id: "b", lastActivityAt: new Date(2026, 3, 1) });
        const input = [a, b];

        sortNotes(input, "updated");

        expect(input.map((n) => n.id)).toEqual(["a", "b"]);
    });
});
