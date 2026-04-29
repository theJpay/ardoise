export function getLineStart(text: string, position: number): number {
    return text.lastIndexOf("\n", position - 1) + 1;
}

export function getLineEnd(text: string, position: number): number {
    const next = text.indexOf("\n", position);
    return next === -1 ? text.length : next;
}

export function getSelectedLines(
    text: string,
    selectionStart: number,
    selectionEnd: number
): { firstLineStart: number; selectedText: string; lines: string[] } {
    const firstLineStart = getLineStart(text, selectionStart);
    const selectedText = text.slice(firstLineStart, selectionEnd);
    const lines = selectedText.split("\n");
    return { firstLineStart, selectedText, lines };
}
