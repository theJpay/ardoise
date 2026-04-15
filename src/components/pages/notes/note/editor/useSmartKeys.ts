import { useCallback } from "react";

import { isInsideCodeBlock, replaceRange } from "./utils";

import type { RefObject } from "react";

export function useSmartKeys(
    editorRef: RefObject<HTMLTextAreaElement | null>,
    onChange: (newContent: string) => void
) {
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
            if (e.key === "Enter" && !e.shiftKey) {
                return handleSmartEnter(e);
            }
            if (e.key === "Tab") {
                return handleSmartTab(e);
            }
            return false;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editorRef, onChange]
    );

    function handleSmartEnter(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
        const textarea = editorRef.current;
        if (!textarea) {
            return false;
        }

        const { value, selectionStart, selectionEnd } = textarea;
        if (selectionStart !== selectionEnd) {
            return false;
        }

        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const line = value.slice(lineStart, selectionStart);

        const continuation = getListContinuation(line);
        if (!continuation) {
            return false;
        }

        e.preventDefault();

        if (continuation === "break") {
            replaceRange(textarea, {
                start: lineStart,
                end: selectionStart,
                text: "",
                onChange,
                cursor: { start: lineStart }
            });
        } else {
            const insert = `\n${continuation}`;
            replaceRange(textarea, {
                start: selectionStart,
                end: selectionStart,
                text: insert,
                onChange,
                cursor: { start: selectionStart + insert.length }
            });
        }

        return true;
    }

    function handleSmartTab(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
        const textarea = editorRef.current;
        if (!textarea) {
            return false;
        }

        const { value, selectionStart, selectionEnd } = textarea;

        if (!shouldInterceptTab(value, selectionStart, selectionEnd)) {
            return false;
        }

        e.preventDefault();

        const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const selectedText = value.slice(firstLineStart, selectionEnd);
        const lines = selectedText.split("\n");

        const modifiedLines = lines.map((line) => (e.shiftKey ? dedentLine(line) : "  " + line));

        const firstLineOffset = modifiedLines[0].length - lines[0].length;
        const newText = modifiedLines.join("\n");

        replaceRange(textarea, {
            start: firstLineStart,
            end: firstLineStart + selectedText.length,
            text: newText,
            onChange,
            cursor: {
                start: Math.max(firstLineStart, selectionStart + firstLineOffset),
                end: firstLineStart + newText.length
            }
        });

        return true;
    }

    return { handleKeyDown };
}

function getListContinuation(line: string): string | "break" | null {
    if (isEmptyTaskItem(line) || isEmptyUnorderedItem(line) || isEmptyOrderedItem(line)) {
        return "break";
    }

    return nextTaskPrefix(line) ?? nextUnorderedPrefix(line) ?? nextOrderedPrefix(line);
}

function isEmptyTaskItem(line: string): boolean {
    return /^\s*- \[([ x])\] $/.test(line);
}

function isEmptyUnorderedItem(line: string): boolean {
    return /^\s*([-*]) $/.test(line);
}

function isEmptyOrderedItem(line: string): boolean {
    return /^\s*\d+\. $/.test(line);
}

function nextTaskPrefix(line: string): string | null {
    const match = line.match(/^(\s*)- \[([ x])\] (.+)$/);
    return match ? `${match[1]}- [ ] ` : null;
}

function nextUnorderedPrefix(line: string): string | null {
    const match = line.match(/^(\s*)([-*]) (.+)$/);
    return match ? `${match[1]}${match[2]} ` : null;
}

function nextOrderedPrefix(line: string): string | null {
    const match = line.match(/^(\s*)(\d+)\. (.+)$/);
    return match ? `${match[1]}${parseInt(match[2]) + 1}. ` : null;
}

function dedentLine(line: string): string {
    const spaces = line.match(/^ {1,2}/)?.[0].length ?? 0;
    return line.slice(spaces);
}

function shouldInterceptTab(value: string, selectionStart: number, selectionEnd: number): boolean {
    if (isInsideCodeBlock(value, selectionStart)) {
        return true;
    }

    const firstLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const selectedText = value.slice(firstLineStart, selectionEnd);
    const lines = selectedText.split("\n");

    return lines.some((line) => isListLine(line));
}

function isListLine(line: string): boolean {
    return /^\s*([-*]|\d+\.) /.test(line) || /^\s*- \[([ x])\] /.test(line);
}
