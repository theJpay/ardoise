import { useCallback } from "react";

import { getSyntax, isBlockSyntaxActiveAtPosition, toggleBlockAtLineStart } from "./utils";

import type { BlockActionName, InlineActionName } from "./utils/actions";
import type { RefObject } from "react";

export function useEditorCommands(
    editorRef: RefObject<HTMLTextAreaElement | null>,
    content: string,
    cursorPosition: number,
    onChange: (newContent: string) => void
) {
    const toggleBlock = useCallback(
        (actionName: BlockActionName) => {
            const textarea = getTextarea(editorRef);
            if (!textarea) {
                return;
            }
            const { selectionStart, selectionEnd } = textarea;
            const syntax = getSyntax(actionName);
            const result = toggleBlockAtLineStart(textarea, syntax);
            onChange(result.content);
            restoreCursor(
                textarea,
                selectionStart + result.cursorOffset,
                selectionEnd + result.cursorOffset
            );
        },
        [editorRef, onChange]
    );

    const isBlockActive = useCallback(
        (actionName: BlockActionName) => {
            const syntax = getSyntax(actionName);
            return isBlockSyntaxActiveAtPosition(content, cursorPosition, syntax);
        },
        [content, cursorPosition]
    );

    const toggleInline = useCallback(
        (actionName: InlineActionName) => {
            const textarea = getTextarea(editorRef);
            if (!textarea) {
                return;
            }
            const { value, selectionStart: start, selectionEnd: end } = textarea;
            if (start === end) {
                return;
            }
            const syntax = getSyntax(actionName);
            const isActive = isInlineSyntaxActive(value, start, end, syntax);

            let newContent: string;
            let newStart: number;
            let newEnd: number;

            if (isActive) {
                newContent =
                    value.slice(0, start - syntax.length) +
                    value.slice(start, end) +
                    value.slice(end + syntax.length);
                newStart = start - syntax.length;
                newEnd = end - syntax.length;
            } else {
                newContent =
                    value.slice(0, start) +
                    syntax +
                    value.slice(start, end) +
                    syntax +
                    value.slice(end);
                newStart = start + syntax.length;
                newEnd = end + syntax.length;
            }

            onChange(newContent);
            restoreCursor(textarea, newStart, newEnd);
        },
        [editorRef, onChange]
    );

    const isInlineActive = useCallback(
        (actionName: InlineActionName) => {
            const textarea = getTextarea(editorRef);
            if (!textarea) {
                return false;
            }
            const { value, selectionStart, selectionEnd } = textarea;
            if (selectionStart === selectionEnd) {
                return false;
            }
            const syntax = getSyntax(actionName);
            return isInlineSyntaxActive(value, selectionStart, selectionEnd, syntax);
        },
        [editorRef]
    );

    return { toggleBlock, isBlockActive, toggleInline, isInlineActive };
}

function getTextarea(ref: RefObject<HTMLTextAreaElement | null>): HTMLTextAreaElement | null {
    return ref.current;
}

function restoreCursor(textarea: HTMLTextAreaElement, start: number, end: number) {
    requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, end);
    });
}

function isInlineSyntaxActive(value: string, start: number, end: number, syntax: string): boolean {
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
