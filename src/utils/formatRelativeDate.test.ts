import { describe, expect, it } from "vitest";

import { formatRelativeDate } from "./formatRelativeDate";

const now = new Date(2026, 3, 23, 12, 0, 0);

describe("formatRelativeDate", () => {
    it('returns "just now" within 60s in the past', () => {
        const date = new Date(2026, 3, 23, 11, 59, 30);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("just now");
    });

    it('returns "just now" within 60s in the future', () => {
        const date = new Date(2026, 3, 23, 12, 0, 30);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("just now");
    });

    it("returns minutes ago within the same calendar day under 60 min", () => {
        const date = new Date(2026, 3, 23, 11, 35, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("25 min ago");
    });

    it("returns hours ago within the same calendar day past 60 min", () => {
        const date = new Date(2026, 3, 23, 9, 0, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("3h ago");
    });

    it('returns "yesterday" for the previous calendar day', () => {
        const date = new Date(2026, 3, 22, 23, 0, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("yesterday");
    });

    it('returns "yesterday" even when the clock delta is less than 24h', () => {
        const nowEarly = new Date(2026, 3, 23, 1, 0, 0);
        const date = new Date(2026, 3, 22, 23, 30, 0);

        const result = formatRelativeDate(date, nowEarly);

        expect(result).toBe("yesterday");
    });

    it.each([
        [new Date(2026, 3, 21, 12, 0, 0), "2 days ago"],
        [new Date(2026, 3, 18, 12, 0, 0), "5 days ago"],
        [new Date(2026, 2, 25, 12, 0, 0), "29 days ago"]
    ])('returns "%s" for 2..29 calendar days', (date, expected) => {
        const result = formatRelativeDate(date, now);

        expect(result).toBe(expected);
    });

    it("falls through to short month/day past 29 days within the same year", () => {
        const date = new Date(2026, 2, 24, 12, 0, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("Mar 24");
    });

    it("includes the year when the date is in a different year", () => {
        const date = new Date(2024, 5, 15, 12, 0, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("Jun 15, 2024");
    });

    it('returns "—" for non-finite dates', () => {
        const date = new Date(Number.NaN);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("—");
    });

    it("returns absolute format for future dates past 60s", () => {
        const date = new Date(2026, 6, 4, 12, 0, 0);

        const result = formatRelativeDate(date, now);

        expect(result).toBe("Jul 4");
    });
});
