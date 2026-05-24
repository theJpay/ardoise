import { gzipSync, strToU8 } from "fflate";
import { describe, expect, it } from "vitest";

import { getShareUrlIfFits, parseShareUrl } from "./shareUrl";

function encode(value: unknown): string {
    const json = JSON.stringify(value);
    const gzipped = gzipSync(strToU8(json));
    let binary = "";
    for (const byte of gzipped) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateIncompressible(length: number): string {
    const buf = new Uint8Array(length);
    crypto.getRandomValues(buf);
    let out = "";
    for (const byte of buf) {
        out += String.fromCharCode(33 + (byte % 94));
    }
    return out;
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

describe("getShareUrlIfFits", () => {
    it("returns a URL containing the share path and a hash", () => {
        const url = getShareUrlIfFits({ title: "hi", content: "body" });

        expect(url).toContain("/share#");
    });

    it("round-trips through encode and decode", () => {
        const payload = { title: "Hello", content: "**World**" };

        const url = getShareUrlIfFits(payload);
        const hash = url?.split("#")[1] ?? "";
        const decoded = parseShareUrl(hash);

        expect(decoded).toEqual(payload);
    });

    it("returns null when the compressed payload exceeds the budget", () => {
        const noise = generateIncompressible(20000);

        const url = getShareUrlIfFits({ title: "big", content: noise });

        expect(url).toBeNull();
    });
});
