import { describe, expect, it } from "vitest";

import { hasLinePrefix } from "./hasLinePrefix";

describe("hasLinePrefix", () => {
    it("returns true when the current line starts with the prefix", () => {
        const content = "> quoted";

        const result = hasLinePrefix(content, 3, "> ");

        expect(result).toBe(true);
    });

    it("returns false when the current line does not start with the prefix", () => {
        const content = "plain text";

        const result = hasLinePrefix(content, 3, "> ");

        expect(result).toBe(false);
    });

    it("checks the line containing the position, not the first line", () => {
        const content = "first\n> second";

        const result = hasLinePrefix(content, 10, "> ");

        expect(result).toBe(true);
    });

    it("returns false when the position is on a different line", () => {
        const content = "> quoted\nplain";

        const result = hasLinePrefix(content, 12, "> ");

        expect(result).toBe(false);
    });

    it("works for multi-char prefixes", () => {
        const content = "### Heading";

        const result = hasLinePrefix(content, 5, "### ");

        expect(result).toBe(true);
    });
});
