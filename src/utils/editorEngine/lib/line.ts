export function getLineStart(text: string, position: number): number {
    return text.lastIndexOf("\n", position - 1) + 1;
}

export function getLineEnd(text: string, position: number): number {
    const next = text.indexOf("\n", position);
    return next === -1 ? text.length : next;
}
