import { BLOCK_SYNTAXES } from "./actions";

export function isBlockSyntaxActiveAtPosition(text: string, position: number, syntax: string) {
    const lineStart = text.lastIndexOf("\n", position - 1) + 1;
    const lineContent = text.slice(lineStart);
    const activeSyntax = BLOCK_SYNTAXES.find((s) => lineContent.startsWith(s));
    return activeSyntax === syntax;
}
