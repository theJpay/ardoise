export function isBlockSyntaxActiveAtPosition(text: string, position: number, syntax: string) {
    const lineStart = text.lastIndexOf("\n", position - 1) + 1;
    return text.slice(lineStart).startsWith(syntax);
}
