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

const MULTI_LINE_SYNTAXES = ["> "];

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
            } else if (isMultiLineSelection(textarea) && canToggleMultiLine(syntax)) {
                toggleBlockMultiLine(textarea, syntax, onChange);
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

function isMultiLineSelection(textarea: HTMLTextAreaElement): boolean {
    const { value, selectionStart, selectionEnd } = textarea;
    return (
        selectionStart !== selectionEnd && value.slice(selectionStart, selectionEnd).includes("\n")
    );
}

function canToggleMultiLine(syntax: string): boolean {
    return MULTI_LINE_SYNTAXES.includes(syntax);
}

function toggleBlockMultiLine(
    textarea: HTMLTextAreaElement,
    syntax: string,
    onChange: (value: string) => void
) {
    const { value, selectionStart, selectionEnd } = textarea;
    const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const selectedText = value.slice(firstLineStart, selectionEnd);
    const lines = selectedText.split("\n");

    const allHaveSyntax = lines.every((line) => line.startsWith(syntax));

    const modifiedLines = lines.map((line) =>
        allHaveSyntax ? line.slice(syntax.length) : syntax + line
    );

    const newText = modifiedLines.join("\n");
    const offset = allHaveSyntax ? -syntax.length : syntax.length;

    replaceRange(textarea, {
        start: firstLineStart,
        end: firstLineStart + selectedText.length,
        text: newText,
        onChange,
        cursor: {
            start: selectionStart + offset,
            end: firstLineStart + newText.length
        }
    });
}
