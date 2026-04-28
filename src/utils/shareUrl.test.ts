import { gzipSync, strToU8 } from "fflate";
import { describe, expect, it } from "vitest";

import { parseShareUrl } from "./shareUrl";

function encode(value: unknown): string {
    const json = JSON.stringify(value);
    const gzipped = gzipSync(strToU8(json));
    let binary = "";
    for (const byte of gzipped) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("parseShareUrl", () => {
    it("returns the payload for a valid encoded string", () => {
        const encoded = encode({ title: "Hello", content: "World" });

        const result = parseShareUrl(encoded);

        expect(result).toEqual({ title: "Hello", content: "World" });
    });

    it("returns null for an empty string", () => {
        const result = parseShareUrl("");

        expect(result).toBeNull();
    });

    it("returns null for a malformed base64url string", () => {
        const result = parseShareUrl("!@#$%");

        expect(result).toBeNull();
    });

    it("returns null when the gzip payload is invalid", () => {
        const result = parseShareUrl("aGVsbG8");

        expect(result).toBeNull();
    });

    it("returns null when the JSON shape is wrong", () => {
        const encoded = encode({ wrong: "shape" });

        const result = parseShareUrl(encoded);

        expect(result).toBeNull();
    });

    it("returns null when title is not a string", () => {
        const encoded = encode({ title: 42, content: "" });

        const result = parseShareUrl(encoded);

        expect(result).toBeNull();
    });

    it("returns null when content is not a string", () => {
        const encoded = encode({ title: "ok", content: null });

        const result = parseShareUrl(encoded);

        expect(result).toBeNull();
    });

    it("preserves multiline content with special characters", () => {
        const payload = { title: "# Heading", content: "line 1\nline 2\n```\ncode\n```" };
        const encoded = encode(payload);

        const result = parseShareUrl(encoded);

        expect(result).toEqual(payload);
    });
});
