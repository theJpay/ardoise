import type { InlineActionName } from "./actions";

type ToggleInline = (name: InlineActionName) => void;
type ToggleLink = () => void;

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

export function handleFormattingShortcut(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    toggleInline: ToggleInline,
    toggleLink: ToggleLink
): boolean {
    if (!e.metaKey && !e.ctrlKey) {
        return false;
    }

    const key = e.key.toLowerCase();

    if (!e.shiftKey && !e.altKey && key === "b") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("bold");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "i") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("italic");
        return true;
    }

    if (e.shiftKey && !e.altKey && key === "x") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("strikethrough");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "e") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("code");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "k") {
        e.preventDefault();
        e.stopPropagation();
        toggleLink();
        return true;
    }

    return false;
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
