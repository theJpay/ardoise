import { describe, expect, it } from "vitest";

import { parseLineListInfo } from "./parseLineListInfo";

describe("parseLineListInfo", () => {
    it("parses an unchecked task item", () => {
        const result = parseLineListInfo("- [ ] todo");

        expect(result).toEqual({ marker: "- [ ] ", nextMarker: "- [ ] ", isEmpty: false });
    });

    it("parses a checked task and resets the next marker to unchecked", () => {
        const result = parseLineListInfo("- [x] done");

        expect(result).toEqual({ marker: "- [x] ", nextMarker: "- [ ] ", isEmpty: false });
    });

    it("accepts uppercase X for checked tasks", () => {
        const result = parseLineListInfo("- [X] done");

        expect(result).toEqual({ marker: "- [X] ", nextMarker: "- [ ] ", isEmpty: false });
    });

    it("parses a dash unordered item", () => {
        const result = parseLineListInfo("- item");

        expect(result).toEqual({ marker: "- ", nextMarker: "- ", isEmpty: false });
    });

    it("parses a star unordered item", () => {
        const result = parseLineListInfo("* item");

        expect(result).toEqual({ marker: "* ", nextMarker: "* ", isEmpty: false });
    });

    it("parses an ordered item and increments the next marker", () => {
        const result = parseLineListInfo("1. first");

        expect(result).toEqual({ marker: "1. ", nextMarker: "2. ", isEmpty: false });
    });

    it("increments multi-digit ordered items", () => {
        const result = parseLineListInfo("42. item");

        expect(result).toEqual({ marker: "42. ", nextMarker: "43. ", isEmpty: false });
    });

    it("preserves indentation in markers", () => {
        const result = parseLineListInfo("    - nested");

        expect(result).toEqual({ marker: "    - ", nextMarker: "    - ", isEmpty: false });
    });

    it("reports isEmpty when content after the marker is empty", () => {
        const result = parseLineListInfo("- ");

        expect(result?.isEmpty).toBe(true);
    });

    it("returns null for non-list lines", () => {
        const result = parseLineListInfo("plain text");

        expect(result).toBeNull();
    });
});
