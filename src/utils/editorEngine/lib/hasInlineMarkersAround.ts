export function hasInlineMarkersAround(
    content: string,
    start: number,
    end: number,
    marker: string
): boolean {
    if (marker.length === 0) {
        return false;
    }
    const before = content.slice(Math.max(0, start - marker.length), start);
    const after = content.slice(end, end + marker.length);
    return before === marker && after === marker;
}
