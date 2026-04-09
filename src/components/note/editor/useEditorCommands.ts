import { useCallback } from "react";

import {
    getSyntax,
    isBlockSyntaxActiveAtPosition,
    isInlineSyntaxActive,
    isInsideCodeBlock,
    replaceRange,
    toggleBlockAtLineStart,
    toggleCodeBlock
} from "./utils";

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
            const syntax = getSyntax(actionName);

            if (actionName === "code-block") {
                toggleCodeBlock(textarea, onChange);
            } else {
                const { selectionStart, selectionEnd } = textarea;
                const result = toggleBlockAtLineStart(textarea, syntax);
                replaceRange(textarea, {
                    start: result.rangeStart,
                    end: result.rangeEnd,
                    text: result.text,
                    onChange,
                    cursor: {
                        start: selectionStart + result.cursorOffset,
                        end: selectionEnd + result.cursorOffset
                    }
                });
            }
        },
        [editorRef, onChange]
    );

    const isBlockActive = useCallback(
        (actionName: BlockActionName) => {
            const pos = editorRef.current?.selectionStart ?? cursorPosition;
            if (actionName === "code-block") {
                return isInsideCodeBlock(content, pos);
            }
            const syntax = getSyntax(actionName);
            return isBlockSyntaxActiveAtPosition(content, pos, syntax);
        },
        [editorRef, content, cursorPosition]
    );

    const toggleInline = useCallback(
        (actionName: InlineActionName) => {
            if (!editorRef.current) {
                return;
            }
            const textarea = editorRef.current;
            const { value, selectionStart: start, selectionEnd: end } = textarea;
            if (start === end) {
                return;
            }
            const syntax = getSyntax(actionName);
            const selected = value.slice(start, end);
            const isActive = isInlineSyntaxActive(value, start, end, syntax);

            if (isActive) {
                replaceRange(textarea, {
                    start: start - syntax.length,
                    end: end + syntax.length,
                    text: selected,
                    onChange,
                    cursor: { start: start - syntax.length, end: end - syntax.length }
                });
            } else {
                replaceRange(textarea, {
                    start,
                    end,
                    text: syntax + selected + syntax,
                    onChange,
                    cursor: { start: start + syntax.length, end: end + syntax.length }
                });
            }
        },
        [editorRef, onChange]
    );

    const isInlineActive = useCallback(
        (actionName: InlineActionName) => {
            if (actionName === "link") {
                return false;
            }
            if (!editorRef.current) {
                return false;
            }
            const { value, selectionStart, selectionEnd } = editorRef.current;
            if (selectionStart === selectionEnd) {
                return false;
            }
            const syntax = getSyntax(actionName);
            return isInlineSyntaxActive(value, selectionStart, selectionEnd, syntax);
        },
        [editorRef]
    );

    const toggleLink = useCallback(() => {
        if (!editorRef.current) {
            return;
        }
        const textarea = editorRef.current;
        const { value, selectionStart: start, selectionEnd: end } = textarea;
        if (start === end) {
            return;
        }
        const selected = value.slice(start, end);
        const isUrl = /^https?:\/\//.test(selected);

        if (isUrl) {
            replaceRange(textarea, {
                start,
                end,
                text: `[](${selected})`,
                onChange,
                cursor: { start: start + 1 }
            });
        } else {
            const urlStart = start + selected.length + 3;
            replaceRange(textarea, {
                start,
                end,
                text: `[${selected}](url)`,
                onChange,
                cursor: { start: urlStart, end: urlStart + 3 }
            });
        }
    }, [editorRef, onChange]);

    return { toggleBlock, isBlockActive, toggleInline, isInlineActive, toggleLink };
}
