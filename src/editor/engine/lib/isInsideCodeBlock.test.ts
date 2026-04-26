import { describe, expect, it } from "vitest";

import { isInsideCodeBlock } from "./isInsideCodeBlock";

describe("isInsideCodeBlock", () => {
    it("returns false for a position outside any fenced block", () => {
        const content = "plain text";

        const result = isInsideCodeBlock(content, 5);

        expect(result).toBe(false);
    });

    it("returns true for a position between opening and closing backtick fences", () => {
        const content = "```\ncode\n```";

        const result = isInsideCodeBlock(content, 6);

        expect(result).toBe(true);
    });

    it("returns false for a position after a closed backtick fence", () => {
        const content = "```\ncode\n```\nafter";

        const result = isInsideCodeBlock(content, 15);

        expect(result).toBe(false);
    });

    it("returns true for a position inside a tilde fence", () => {
        const content = "~~~\ncode\n~~~";

        const result = isInsideCodeBlock(content, 6);

        expect(result).toBe(true);
    });

    it("treats an unclosed fence as an open code block to the end", () => {
        const content = "```\ncode\n";

        const result = isInsideCodeBlock(content, 7);

        expect(result).toBe(true);
    });
});
