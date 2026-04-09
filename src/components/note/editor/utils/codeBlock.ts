import { replaceRange } from "./replaceRange";

export function isInsideCodeBlock(text: string, position: number): boolean {
    const before = text.slice(0, position);
    const fenceCount = (before.match(/^```/gm) || []).length;
    return fenceCount % 2 === 1;
}

export function toggleCodeBlock(textarea: HTMLTextAreaElement, onChange: (value: string) => void) {
    const { value, selectionStart, selectionEnd } = textarea;
    const hasSelection = selectionStart !== selectionEnd;

    if (isInsideCodeBlock(value, selectionStart)) {
        unwrapCodeBlock(textarea, value, selectionStart, onChange);
    } else if (hasSelection) {
        const selected = value.slice(selectionStart, selectionEnd);
        replaceRange(textarea, {
            start: selectionStart,
            end: selectionEnd,
            text: "```\n" + selected + "\n```",
            onChange,
            cursor: { start: selectionStart + 4, end: selectionStart + 4 + selected.length }
        });
    } else {
        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const lineEnd = value.indexOf("\n", selectionStart);
        const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
        const lineContent = value.slice(lineStart, actualLineEnd);

        if (lineContent.length === 0) {
            replaceRange(textarea, {
                start: lineStart,
                end: actualLineEnd,
                text: "```\n\n```",
                onChange,
                cursor: { start: lineStart + 4 }
            });
        } else {
            replaceRange(textarea, {
                start: lineStart,
                end: actualLineEnd,
                text: "```\n" + lineContent + "\n```",
                onChange,
                cursor: { start: lineStart + 4, end: lineStart + 4 + lineContent.length }
            });
        }
    }
}

function unwrapCodeBlock(
    textarea: HTMLTextAreaElement,
    value: string,
    position: number,
    onChange: (value: string) => void
) {
    const lines = value.split("\n");
    let charCount = 0;
    let currentLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= position) {
            currentLineIndex = i;
            break;
        }
        charCount += lines[i].length + 1;
    }

    let openingLine = -1;
    let closingLine = -1;

    for (let i = currentLineIndex; i >= 0; i--) {
        if (lines[i].startsWith("```")) {
            openingLine = i;
            break;
        }
    }
    for (let i = currentLineIndex; i < lines.length; i++) {
        if (lines[i].startsWith("```") && i !== openingLine) {
            closingLine = i;
            break;
        }
    }

    if (openingLine === -1 || closingLine === -1) {
        return;
    }

    let openingStart = 0;
    for (let i = 0; i < openingLine; i++) {
        openingStart += lines[i].length + 1;
    }

    let closingEnd = 0;
    for (let i = 0; i <= closingLine; i++) {
        closingEnd += lines[i].length + 1;
    }
    closingEnd -= 1;

    const innerContent = lines.slice(openingLine + 1, closingLine).join("\n");
    replaceRange(textarea, {
        start: openingStart,
        end: closingEnd,
        text: innerContent,
        onChange,
        cursor: { start: openingStart, end: openingStart + innerContent.length }
    });
}
