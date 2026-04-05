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
            if (!editorRef.current) {
                return;
            }
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const syntax = getSyntax(actionName);
            const result = toggleBlockAtLineStart(textarea, syntax);
            onChange(result.content);
            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(start + result.cursorOffset, end + result.cursorOffset);
            });
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
            if (!editorRef.current) {
                return;
            }
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start === end) {
                return;
            }
            const syntax = getSyntax(actionName);
            const value = textarea.value;

            const markersBefore = countMarkerRun(value, start, syntax[0], "backward");
            const markersAfter = countMarkerRun(value, end, syntax[0], "forward");
            const markerCount = Math.min(markersBefore, markersAfter);
            const isActive =
                syntax.length === 1 ? markerCount % 2 === 1 : markerCount >= syntax.length;

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
            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(newStart, newEnd);
            });
        },
        [editorRef, onChange]
    );

    const isInlineActive = useCallback(
        (actionName: InlineActionName) => {
            if (!editorRef.current) {
                return false;
            }
            const textarea = editorRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start === end) {
                return false;
            }
            const syntax = getSyntax(actionName);
            const value = textarea.value;

            const markersBefore = countMarkerRun(value, start, syntax[0], "backward");
            const markersAfter = countMarkerRun(value, end, syntax[0], "forward");
            const markerCount = Math.min(markersBefore, markersAfter);

            if (syntax.length === 1) {
                return markerCount % 2 === 1;
            }
            return markerCount >= syntax.length;
        },
        [editorRef]
    );

    return { toggleBlock, isBlockActive, toggleInline, isInlineActive };
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
