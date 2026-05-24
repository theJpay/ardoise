import { describe, expect, it } from "vitest";

import { extractSnippet, splitByMatch } from "./highlight";

describe("extractSnippet", () => {
    it("returns null for an empty query", () => {
        const content = "hello world";

        const result = extractSnippet(content, "");

        expect(result).toBeNull();
    });

    it("returns null when no match is found", () => {
        const content = "hello world";

        const result = extractSnippet(content, "xyz");

        expect(result).toBeNull();
    });

    it("returns the trimmed line unchanged when it fits within maxLen", () => {
        const content = "  hello world  ";

        const result = extractSnippet(content, "world");

        expect(result).toBe("hello world");
    });

    it("matches case-insensitively and preserves original casing", () => {
        const content = "Hello World";

        const result = extractSnippet(content, "WORLD");

        expect(result).toBe("Hello World");
    });

    it("extracts only the matching line in multi-line content", () => {
        const content = "first line does not match\nsecond line has TARGET here\nthird";

        const result = extractSnippet(content, "TARGET");

        expect(result).toBe("second line has TARGET here");
    });

    it("omits a leading ellipsis when the match is at the start of a long line", () => {
        const content = "FOO is at the start of a really long line that goes on past sixty chars";

        const result = extractSnippet(content, "FOO", 60);

        expect(result?.startsWith("…")).toBe(false);
    });

    it("adds a trailing ellipsis when the match is near the start of a long line", () => {
        const content = "FOO is at the start of a really long line that goes on past sixty chars";

        const result = extractSnippet(content, "FOO", 60);

        expect(result?.endsWith("…")).toBe(true);
    });

    it("adds a leading ellipsis when the match is near the end of a long line", () => {
        const content = "a really long line that ends with BAR exactly at the very end BAR";

        const result = extractSnippet(content, "BAR", 60);

        expect(result?.startsWith("…")).toBe(true);
    });

    it("omits a trailing ellipsis when the match reaches the end of a long line", () => {
        const content = "a really long line that ends with BAR exactly at the very end BAR";

        const result = extractSnippet(content, "BAR", 60);

        expect(result?.endsWith("…")).toBe(false);
    });

    it("adds a leading ellipsis when the match is mid-long-line", () => {
        const content = "x".repeat(40) + "TARGET" + "y".repeat(40);

        const result = extractSnippet(content, "TARGET", 60);

        expect(result?.startsWith("…")).toBe(true);
    });

    it("adds a trailing ellipsis when the match is mid-long-line", () => {
        const content = "x".repeat(40) + "TARGET" + "y".repeat(40);

        const result = extractSnippet(content, "TARGET", 60);

        expect(result?.endsWith("…")).toBe(true);
    });
});

describe("splitByMatch", () => {
    it("returns the whole text as a non-match when query is empty", () => {
        const text = "hello";

        const result = splitByMatch(text, "");

        expect(result).toEqual([{ text: "hello", isMatch: false }]);
    });

    it("returns the whole text as a non-match when there is no match", () => {
        const text = "hello";

        const result = splitByMatch(text, "xyz");

        expect(result).toEqual([{ text: "hello", isMatch: false }]);
    });

    it("splits around a single match in the middle", () => {
        const text = "foo BAR baz";

        const result = splitByMatch(text, "BAR");

        expect(result).toEqual([
            { text: "foo ", isMatch: false },
            { text: "BAR", isMatch: true },
            { text: " baz", isMatch: false }
        ]);
    });

    it("omits an empty leading segment when the match starts at position 0", () => {
        const text = "BAR baz";

        const result = splitByMatch(text, "BAR");

        expect(result).toEqual([
            { text: "BAR", isMatch: true },
            { text: " baz", isMatch: false }
        ]);
    });

    it("omits an empty trailing segment when the match ends at the last character", () => {
        const text = "foo BAR";

        const result = splitByMatch(text, "BAR");

        expect(result).toEqual([
            { text: "foo ", isMatch: false },
            { text: "BAR", isMatch: true }
        ]);
    });

    it("splits around multiple matches", () => {
        const text = "a BAR b BAR c";

        const result = splitByMatch(text, "BAR");

        expect(result).toEqual([
            { text: "a ", isMatch: false },
            { text: "BAR", isMatch: true },
            { text: " b ", isMatch: false },
            { text: "BAR", isMatch: true },
            { text: " c", isMatch: false }
        ]);
    });

    it("preserves original casing inside match segments", () => {
        const text = "Hello World";

        const result = splitByMatch(text, "world");

        expect(result).toEqual([
            { text: "Hello ", isMatch: false },
            { text: "World", isMatch: true }
        ]);
    });
});
