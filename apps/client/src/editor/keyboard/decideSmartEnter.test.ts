import { describe, expect, it } from "vitest";

import { decideSmartEnter } from "./decideSmartEnter";

import type { ListLineInfo } from "../engine";

const NO_MODIFIERS = { shiftKey: false, metaKey: false, ctrlKey: false, altKey: false };

const LIST_ITEM: ListLineInfo = { marker: "- ", nextMarker: "- ", isEmpty: false };
const EMPTY_LIST_ITEM: ListLineInfo = { marker: "- ", nextMarker: "- ", isEmpty: true };

describe("decideSmartEnter", () => {
    it("returns null for non-Enter keys", () => {
        const op = decideSmartEnter({
            key: "a",
            ...NO_MODIFIERS,
            start: 5,
            end: 5,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toBeNull();
    });

    it.each(["shiftKey", "metaKey", "ctrlKey", "altKey"] as const)(
        "returns null when %s is held",
        (modifier) => {
            const op = decideSmartEnter({
                key: "Enter",
                ...NO_MODIFIERS,
                [modifier]: true,
                start: 5,
                end: 5,
                lineEnd: 5,
                listInfo: LIST_ITEM
            });

            expect(op).toBeNull();
        }
    );

    it("returns null on a non-list line", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 5,
            end: 5,
            lineEnd: 5,
            listInfo: null
        });

        expect(op).toBeNull();
    });

    it("returns null when there is a selection", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 2,
            end: 5,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toBeNull();
    });

    it("continues the list when the cursor is at the end of a non-empty item", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 5,
            end: 5,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toEqual({ kind: "continue-list", nextMarker: "- " });
    });

    it("exits the list when the cursor is at the end of an empty item", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 2,
            end: 2,
            lineEnd: 2,
            listInfo: EMPTY_LIST_ITEM
        });

        expect(op).toEqual({ kind: "exit-list" });
    });

    it("returns null when the cursor is in the middle of list item content", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 4,
            end: 4,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toBeNull();
    });

    it("returns null when the cursor is before the list marker", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 0,
            end: 0,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toBeNull();
    });

    it("returns null when the cursor sits within the list marker", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 1,
            end: 1,
            lineEnd: 5,
            listInfo: LIST_ITEM
        });

        expect(op).toBeNull();
    });

    it("uses the listInfo nextMarker when continuing", () => {
        const op = decideSmartEnter({
            key: "Enter",
            ...NO_MODIFIERS,
            start: 8,
            end: 8,
            lineEnd: 8,
            listInfo: { marker: "1. ", nextMarker: "2. ", isEmpty: false }
        });

        expect(op).toEqual({ kind: "continue-list", nextMarker: "2. " });
    });
});
