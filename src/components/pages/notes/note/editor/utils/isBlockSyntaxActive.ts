import { BLOCK_SYNTAXES } from "./actions";
import { getLineStart } from "./line";

export function isBlockSyntaxActiveAtPosition(text: string, position: number, syntax: string) {
    const lineContent = text.slice(getLineStart(text, position));
    const activeSyntax = BLOCK_SYNTAXES.find((s) => lineContent.startsWith(s));
    return activeSyntax === syntax;
}
