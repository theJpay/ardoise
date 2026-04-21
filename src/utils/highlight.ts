export type HighlightSegment = {
    text: string;
    isMatch: boolean;
};

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
