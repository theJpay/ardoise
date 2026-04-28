import { gunzipSync, strFromU8 } from "fflate";

import type { Note } from "@entities";

export type SharePayload = Pick<Note, "title" | "content">;

export function parseShareUrl(encoded: string): SharePayload | null {
    if (!encoded) {
        return null;
    }
    try {
        const bytes = base64UrlToBytes(encoded);
        const json = strFromU8(gunzipSync(bytes));
        const parsed: unknown = JSON.parse(json);
        return isSharePayload(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function isSharePayload(value: unknown): value is SharePayload {
    return (
        typeof value === "object" &&
        value !== null &&
        "title" in value &&
        typeof (value as { title: unknown }).title === "string" &&
        "content" in value &&
        typeof (value as { content: unknown }).content === "string"
    );
}

function base64UrlToBytes(s: string): Uint8Array {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
