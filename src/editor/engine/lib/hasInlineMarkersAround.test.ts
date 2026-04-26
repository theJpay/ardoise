import { describe, expect, it } from "vitest";

import { hasInlineMarkersAround } from "./hasInlineMarkersAround";

describe("hasInlineMarkersAround", () => {
    it("returns true when the marker is adjacent on both sides of the selection", () => {
        const content = "**bold**";

        const result = hasInlineMarkersAround(content, 2, 6, "**");

        expect(result).toBe(true);
    });

    it("returns false when the marker is missing before the selection", () => {
        const content = "bold**";

        const result = hasInlineMarkersAround(content, 0, 4, "**");

        expect(result).toBe(false);
    });

    it("returns false when the marker is missing after the selection", () => {
        const content = "**bold";

        const result = hasInlineMarkersAround(content, 2, 6, "**");

        expect(result).toBe(false);
    });

    it("returns false when neither side has the marker", () => {
        const content = "plain text";

        const result = hasInlineMarkersAround(content, 0, 5, "**");

        expect(result).toBe(false);
    });

    it("returns true for single-character markers", () => {
        const content = "*italic*";

        const result = hasInlineMarkersAround(content, 1, 7, "*");

        expect(result).toBe(true);
    });

    it("returns true at the start of the document when the marker is present", () => {
        const content = "**bold**";

        const result = hasInlineMarkersAround(content, 2, 6, "**");

        expect(result).toBe(true);
    });

    it("returns false for an empty marker", () => {
        const content = "anything";

        const result = hasInlineMarkersAround(content, 2, 5, "");

        expect(result).toBe(false);
    });

    it("treats a collapsed caret with adjacent markers as matching", () => {
        const content = "****";

        const result = hasInlineMarkersAround(content, 2, 2, "**");

        expect(result).toBe(true);
    });
});
