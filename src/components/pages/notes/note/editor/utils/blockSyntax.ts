import { BLOCK_SYNTAXES } from "./actions";
import { getLineStart } from "./line";

type ToggleResult = {
    rangeStart: number;
    rangeEnd: number;
    text: string;
    cursorOffset: number;
};

export function isBlockSyntaxActiveAtPosition(text: string, position: number, syntax: string) {
    const lineContent = text.slice(getLineStart(text, position));
    const activeSyntax = BLOCK_SYNTAXES.find((s) => lineContent.startsWith(s));
    return activeSyntax === syntax;
}

export function toggleBlockAtLineStart(
    textarea: HTMLTextAreaElement,
    syntax: string
): ToggleResult {
    const { value, selectionStart } = textarea;
    const lineStart = getLineStart(value, selectionStart);
    const lineContent = value.slice(lineStart);
    const activeSyntax = BLOCK_SYNTAXES.find((s) => lineContent.startsWith(s));

    if (activeSyntax === syntax) {
        return {
            rangeStart: lineStart,
            rangeEnd: lineStart + syntax.length,
            text: "",
            cursorOffset: -syntax.length
        };
    }

    if (activeSyntax) {
        return {
            rangeStart: lineStart,
            rangeEnd: lineStart + activeSyntax.length,
            text: syntax,
            cursorOffset: syntax.length - activeSyntax.length
        };
    }

    return {
        rangeStart: lineStart,
        rangeEnd: lineStart,
        text: syntax,
        cursorOffset: syntax.length
    };
}
