export function isInlineSyntaxActive(
    value: string,
    start: number,
    end: number,
    syntax: string
): boolean {
    const markersBefore = countMarkerRun(value, start, syntax[0], "backward");
    const markersAfter = countMarkerRun(value, end, syntax[0], "forward");
    const count = Math.min(markersBefore, markersAfter);
    return syntax.length === 1 ? count % 2 === 1 : count >= syntax.length;
}

function countMarkerRun(
    text: string,
    position: number,
    char: string,
    direction: "forward" | "backward"
): number {
    let count = 0;
    let i = direction === "backward" ? position - 1 : position;
    const step = direction === "backward" ? -1 : 1;

    while (i >= 0 && i < text.length && text[i] === char) {
        count++;
        i += step;
    }
    return count;
}
