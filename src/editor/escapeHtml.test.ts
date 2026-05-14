import { describe, expect, it } from "vitest";

import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
    it("leaves plain text unchanged", () => {
        const input = "hello world";

        const result = escapeHtml(input);

        expect(result).toBe("hello world");
    });

    it.each([
        ["&", "&amp;"],
        ["<", "&lt;"],
        [">", "&gt;"]
    ])("escapes %s to %s", (input, expected) => {
        const result = escapeHtml(input);

        expect(result).toBe(expected);
    });

    it("escapes & before < and > so entities are not double-escaped", () => {
        const input = "<tag>";

        const result = escapeHtml(input);

        expect(result).toBe("&lt;tag&gt;");
    });

    it("escapes all occurrences, not just the first", () => {
        const input = "<a> & <b>";

        const result = escapeHtml(input);

        expect(result).toBe("&lt;a&gt; &amp; &lt;b&gt;");
    });

    it("leaves quote characters unchanged", () => {
        const input = `"hello" 'world'`;

        const result = escapeHtml(input);

        expect(result).toBe(`"hello" 'world'`);
    });
});
