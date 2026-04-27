import { describe, expect, it } from "vitest";

import { decideSmartPair } from "./decideSmartPair";

describe("decideSmartPair", () => {
    it("returns null for non-pair keys", () => {
        const result = decideSmartPair({ key: "a", value: "", start: 0, end: 0 });

        expect(result).toBeNull();
    });

    it.each([
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
        ['"', '"']
    ])("inserts a pair when typing %s with no selection", (opener, closer) => {
        const result = decideSmartPair({ key: opener, value: "", start: 0, end: 0 });

        expect(result).toEqual({ kind: "insert", opener, closer });
    });

    it.each([
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
        ['"', '"']
    ])("wraps a selection when typing %s with text selected", (opener, closer) => {
        const result = decideSmartPair({ key: opener, value: "hello", start: 0, end: 5 });

        expect(result).toEqual({ kind: "wrap", opener, closer });
    });

    it.each([")", "]", "}"])("skips over %s when next char matches", (closer) => {
        const result = decideSmartPair({ key: closer, value: closer, start: 0, end: 0 });

        expect(result).toEqual({ kind: "skip", char: closer });
    });

    it.each([")", "]", "}"])(
        "returns null for closer %s when next char does not match",
        (closer) => {
            const result = decideSmartPair({ key: closer, value: "x", start: 0, end: 0 });

            expect(result).toBeNull();
        }
    );

    it("skips over a closing quote when next char is a quote", () => {
        const result = decideSmartPair({ key: '"', value: '"', start: 0, end: 0 });

        expect(result).toEqual({ kind: "skip", char: '"' });
    });

    it("does not treat the cursor position as relevant for skipping when there is a selection", () => {
        const result = decideSmartPair({ key: '"', value: 'a"', start: 0, end: 1 });

        expect(result).toEqual({ kind: "wrap", opener: '"', closer: '"' });
    });
});
