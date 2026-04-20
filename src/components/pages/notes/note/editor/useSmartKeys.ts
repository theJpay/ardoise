import { useCallback, useEffect, useRef } from "react";

import {
    getLineStart,
    getListContinuation,
    getSelectedLines,
    isInsideCodeBlock,
    isListLine,
    replaceRange
} from "./utils";

import type { RefObject } from "react";

type OnChange = (newContent: string) => void;

type AttachedListeners = {
    textarea: HTMLTextAreaElement;
    onBeforeInput: (e: InputEvent) => void;
    onInput: (e: Event) => void;
};

export function useSmartKeys(editorRef: RefObject<HTMLTextAreaElement | null>, onChange: OnChange) {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const skipContinuationRef = useRef(false);
    const attachedRef = useRef<AttachedListeners | null>(null);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
            const textarea = editorRef.current;
            if (!textarea) {
                return false;
            }
            if (e.key === "Enter") {
                skipContinuationRef.current =
                    e.shiftKey || textarea.selectionStart !== textarea.selectionEnd;
                return false;
            }
            if (e.key === "Tab") {
                return handleSmartTab(e, textarea, onChange);
            }
            return false;
        },
        [editorRef, onChange]
    );

    useEffect(() => {
        const textarea = editorRef.current;
        const attached = attachedRef.current;

        if (attached && attached.textarea === textarea) {
            return;
        }

        if (attached) {
            attached.textarea.removeEventListener("beforeinput", attached.onBeforeInput);
            attached.textarea.removeEventListener("input", attached.onInput);
            attachedRef.current = null;
        }

        if (!textarea) {
            return;
        }

        const onBeforeInput = (e: InputEvent) => {
            if (e.inputType !== "insertLineBreak") {
                return;
            }
            if (e.isComposing) {
                return;
            }
            if (skipContinuationRef.current) {
                return;
            }

            const { value, selectionStart } = textarea;
            const lineStart = getLineStart(value, selectionStart);
            const line = value.slice(lineStart, selectionStart);
            if (getListContinuation(line) !== "break") {
                return;
            }

            e.preventDefault();
            replaceRange(textarea, {
                start: lineStart,
                end: selectionStart,
                text: "",
                onChange: onChangeRef.current,
                cursor: { start: lineStart }
            });
        };

        const onInput = (e: Event) => {
            const ie = e as InputEvent;
            if (ie.inputType !== "insertLineBreak") {
                return;
            }
            if (ie.isComposing) {
                return;
            }
            if (skipContinuationRef.current) {
                skipContinuationRef.current = false;
                return;
            }

            const { value, selectionStart } = textarea;
            const prevLineEnd = selectionStart - 1;
            if (prevLineEnd < 0) {
                return;
            }
            const prevLine = value.slice(getLineStart(value, prevLineEnd), prevLineEnd);
            const continuation = getListContinuation(prevLine);
            if (!continuation || continuation === "break") {
                return;
            }

            queueMicrotask(() => {
                const caret = textarea.selectionStart;
                replaceRange(textarea, {
                    start: caret,
                    end: caret,
                    text: continuation,
                    onChange: onChangeRef.current,
                    cursor: { start: caret + continuation.length }
                });
            });
        };

        textarea.addEventListener("beforeinput", onBeforeInput);
        textarea.addEventListener("input", onInput);
        attachedRef.current = { textarea, onBeforeInput, onInput };
    });

    useEffect(() => {
        return () => {
            const attached = attachedRef.current;
            if (attached) {
                attached.textarea.removeEventListener("beforeinput", attached.onBeforeInput);
                attached.textarea.removeEventListener("input", attached.onInput);
                attachedRef.current = null;
            }
        };
    }, []);

    return { handleKeyDown };
}

function handleSmartTab(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    textarea: HTMLTextAreaElement,
    onChange: OnChange
): boolean {
    const { value, selectionStart, selectionEnd } = textarea;

    if (!shouldInterceptTab(value, selectionStart, selectionEnd)) {
        return false;
    }

    e.preventDefault();

    const { firstLineStart, selectedText, lines } = getSelectedLines(
        value,
        selectionStart,
        selectionEnd
    );

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

function dedentLine(line: string): string {
    const spaces = line.match(/^ {1,2}/)?.[0].length ?? 0;
    return line.slice(spaces);
}

function shouldInterceptTab(value: string, selectionStart: number, selectionEnd: number): boolean {
    if (isInsideCodeBlock(value, selectionStart)) {
        return true;
    }

    const { lines } = getSelectedLines(value, selectionStart, selectionEnd);
    return lines.some((line) => isListLine(line));
}
