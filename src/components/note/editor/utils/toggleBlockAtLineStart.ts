import { BLOCK_SYNTAXES } from "./actions";

type ToggleResult = {
    content: string;
    cursorOffset: number;
};

export function toggleBlockAtLineStart(
    textarea: HTMLTextAreaElement,
    syntax: string
): ToggleResult {
    const { value, selectionStart } = textarea;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineContent = value.slice(lineStart);
    const activeSyntax = BLOCK_SYNTAXES.find((s) => lineContent.startsWith(s));

    if (activeSyntax === syntax) {
        return {
            content: value.slice(0, lineStart) + value.slice(lineStart + syntax.length),
            cursorOffset: -syntax.length
        };
    }

    if (activeSyntax) {
        return {
            content:
                value.slice(0, lineStart) + syntax + value.slice(lineStart + activeSyntax.length),
            cursorOffset: syntax.length - activeSyntax.length
        };
    }

    return {
        content: value.slice(0, lineStart) + syntax + value.slice(lineStart),
        cursorOffset: syntax.length
    };
}
