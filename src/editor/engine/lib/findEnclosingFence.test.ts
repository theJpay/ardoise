import { describe, expect, it } from "vitest";

import { findEnclosingFence } from "./findEnclosingFence";

describe("findEnclosingFence", () => {
    it("finds a backtick-fenced block around the given position", () => {
        const content = "```\ncode\n```";

        const result = findEnclosingFence(content, 6);

        expect(result).toEqual({ openingStart: 0, closingEnd: 12, innerContent: "code" });
    });

    it("finds a tilde-fenced block around the given position", () => {
        const content = "~~~\ncode\n~~~";

        const result = findEnclosingFence(content, 6);

        expect(result).toEqual({ openingStart: 0, closingEnd: 12, innerContent: "code" });
    });

    it("returns null when the position is outside any fence", () => {
        const content = "plain text";

        const result = findEnclosingFence(content, 5);

        expect(result).toBeNull();
    });

    it("returns null when the opening fence has no matching closing fence", () => {
        const content = "```\ncode\n";

        const result = findEnclosingFence(content, 6);

        expect(result).toBeNull();
    });

    it("handles content before and after the fence", () => {
        const content = "before\n```\nhi\n```\nafter";

        const result = findEnclosingFence(content, 12);

        expect(result).toEqual({ openingStart: 7, closingEnd: 17, innerContent: "hi" });
    });
});
