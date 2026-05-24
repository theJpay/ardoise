export type HighlightSegment = {
    text: string;
    isMatch: boolean;
};

const DEFAULT_SNIPPET_LENGTH = 60;
const ELLIPSIS = "…";

export function extractSnippet(
    content: string,
    query: string,
    maxLen: number = DEFAULT_SNIPPET_LENGTH
): string | null {
    if (query === "") {
        return null;
    }
    const normalized = query.toLowerCase();
    const matchIndex = content.toLowerCase().indexOf(normalized);
    if (matchIndex === -1) {
        return null;
    }

    const lineStart = content.lastIndexOf("\n", matchIndex - 1) + 1;
    const lineEndRaw = content.indexOf("\n", matchIndex);
    const lineEnd = lineEndRaw === -1 ? content.length : lineEndRaw;
    const line = content.slice(lineStart, lineEnd);

    if (line.length <= maxLen) {
        return line.trim();
    }

    const matchInLine = matchIndex - lineStart;
    const halfWindow = Math.floor((maxLen - query.length) / 2);
    let start = Math.max(0, matchInLine - halfWindow);
    const end = Math.min(line.length, start + maxLen);
    start = Math.max(0, end - maxLen);

    const middle = line.slice(start, end).trim();
    const prefix = start > 0 ? ELLIPSIS : "";
    const suffix = end < line.length ? ELLIPSIS : "";
    return prefix + middle + suffix;
}

export function splitByMatch(text: string, query: string): HighlightSegment[] {
    if (query === "") {
        return [{ text, isMatch: false }];
    }
    const normalizedQuery = query.toLowerCase();
    const segments: HighlightSegment[] = [];
    let cursor = 0;
    const lowerText = text.toLowerCase();

    while (cursor < text.length) {
        const matchStart = lowerText.indexOf(normalizedQuery, cursor);
        if (matchStart === -1) {
            segments.push({ text: text.slice(cursor), isMatch: false });
            break;
        }
        if (matchStart > cursor) {
            segments.push({ text: text.slice(cursor, matchStart), isMatch: false });
        }
        const matchEnd = matchStart + query.length;
        segments.push({ text: text.slice(matchStart, matchEnd), isMatch: true });
        cursor = matchEnd;
    }

    return segments;
}
