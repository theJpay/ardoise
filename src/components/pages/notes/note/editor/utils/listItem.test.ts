import { describe, expect, it } from "vitest";

import { getListContinuation, isListLine, parseListLine } from "./listItem";

describe("parseListLine", () => {
    it("parses an unchecked task", () => {
        const line = "- [ ] todo";

        const result = parseListLine(line);

        expect(result).toEqual({ type: "task", indent: "", marker: "- [ ]", content: "todo" });
    });

    it("parses a checked task", () => {
        const line = "- [x] done";

        const result = parseListLine(line);

        expect(result).toEqual({ type: "task", indent: "", marker: "- [x]", content: "done" });
    });

    it("treats uppercase X as unordered, not a checked task", () => {
        const line = "- [X] done";

        const result = parseListLine(line);

        expect(result?.type).toBe("unordered");
    });

    it.each([
        ["- item", { type: "unordered", indent: "", marker: "-", content: "item" }],
        ["* item", { type: "unordered", indent: "", marker: "*", content: "item" }]
    ])("parses unordered list with %s marker", (line, expected) => {
        const result = parseListLine(line);

        expect(result).toEqual(expected);
    });

    it("parses an ordered list", () => {
        const line = "1. item";

        const result = parseListLine(line);

        expect(result).toEqual({ type: "ordered", indent: "", marker: "1.", content: "item" });
    });

    it("parses multi-digit ordered markers", () => {
        const line = "42. item";

        const result = parseListLine(line);

        expect(result).toEqual({ type: "ordered", indent: "", marker: "42.", content: "item" });
    });

    it("preserves indentation", () => {
        const line = "    - nested";

        const result = parseListLine(line);

        expect(result?.indent).toBe("    ");
    });

    it("returns null for non-list lines", () => {
        const line = "not a list";

        const result = parseListLine(line);

        expect(result).toBeNull();
    });

    it("returns null when there is no space after the marker", () => {
        const line = "-item";

        const result = parseListLine(line);

        expect(result).toBeNull();
    });
});

describe("isListLine", () => {
    it("returns true for a list line", () => {
        const line = "- item";

        const result = isListLine(line);

        expect(result).toBe(true);
    });

    it("returns false for a non-list line", () => {
        const line = "plain text";

        const result = isListLine(line);

        expect(result).toBe(false);
    });
});

describe("getListContinuation", () => {
    it("returns null for a non-list line", () => {
        const line = "plain text";

        const result = getListContinuation(line);

        expect(result).toBeNull();
    });

    it('returns "break" when the list item is empty', () => {
        const line = "- ";

        const result = getListContinuation(line);

        expect(result).toBe("break");
    });

    it("continues an unordered list with the same marker", () => {
        const line = "* item";

        const result = getListContinuation(line);

        expect(result).toBe("* ");
    });

    it("continues a task list as unchecked regardless of the source state", () => {
        const line = "- [x] done";

        const result = getListContinuation(line);

        expect(result).toBe("- [ ] ");
    });

    it("increments the number of an ordered list", () => {
        const line = "1. first";

        const result = getListContinuation(line);

        expect(result).toBe("2. ");
    });

    it("preserves indentation when continuing a list", () => {
        const line = "    - nested";

        const result = getListContinuation(line);

        expect(result).toBe("    - ");
    });
});
