import { useCallback } from "react";

import { getSyntax, isBlockSyntaxActiveAtPosition, toggleBlockAtLineStart } from "./utils";

import type { RefObject } from "react";

export function useEditorCommands(
    editorRef: RefObject<HTMLTextAreaElement | null>,
    content: string,
    cursorPosition: number,
    onChange: (newContent: string) => void
) {
    const toggleBlock = useCallback(
        (actionName: string) => {
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
        (actionName: string) => {
            const syntax = getSyntax(actionName);
            return isBlockSyntaxActiveAtPosition(content, cursorPosition, syntax);
        },
        [content, cursorPosition]
    );

    return { toggleBlock, isBlockActive };
}
