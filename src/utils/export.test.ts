import { describe, expect, it } from "vitest";

import { generateNote } from "@entities/note.fixtures";

import { buildNotePath } from "./export";

describe("buildNotePath", () => {
    it("returns the note's own filename for a root note", () => {
        const note = generateNote({ id: "abcdef12", title: "Roadmap" });

        expect(buildNotePath(note, [note])).toBe("roadmap-abcdef12.md");
    });

    it("prefixes ancestors as folders", () => {
        const root = generateNote({ id: "11111111", title: "Work" });
        const child = generateNote({ id: "22222222", title: "Sprint", parentId: "11111111" });
        const grandchild = generateNote({ id: "33333333", title: "Notes", parentId: "22222222" });

        expect(buildNotePath(grandchild, [root, child, grandchild])).toBe(
            "work-11111111/sprint-22222222/notes-33333333.md"
        );
    });

    it("re-roots an orphan whose parent is missing from the set", () => {
        const orphan = generateNote({ id: "44444444", title: "Stray", parentId: "ghost" });

        expect(buildNotePath(orphan, [orphan])).toBe("stray-44444444.md");
    });
});
