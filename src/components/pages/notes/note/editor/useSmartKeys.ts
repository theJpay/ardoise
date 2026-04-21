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

export function useSmartKeys(editorRef: RefObject<HTMLTextAreaElement | null>, onChange: OnChange) {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const skipContinuationRef = useRef(false);

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

    useRefEffect(editorRef, (textarea) => {
        const onBeforeInput = (e: InputEvent) => {
            if (!isPlainLineBreak(e) || skipContinuationRef.current) {
                return;
            }
            if (tryBreakEmptyListItem(textarea, onChangeRef.current)) {
                e.preventDefault();
            }
        };

        const onInput = (event: Event) => {
            const e = event as InputEvent;
            if (!isPlainLineBreak(e)) {
                return;
            }
            if (skipContinuationRef.current) {
                skipContinuationRef.current = false;
                return;
            }
            tryContinueList(textarea, onChangeRef.current);
        };

        textarea.addEventListener("beforeinput", onBeforeInput);
        textarea.addEventListener("input", onInput);
        return () => {
            textarea.removeEventListener("beforeinput", onBeforeInput);
            textarea.removeEventListener("input", onInput);
        };
    });

    return { handleKeyDown };
}

function isPlainLineBreak(e: InputEvent): boolean {
    return e.inputType === "insertLineBreak" && !e.isComposing;
}

function tryBreakEmptyListItem(textarea: HTMLTextAreaElement, onChange: OnChange): boolean {
    const { value, selectionStart } = textarea;
    const lineStart = getLineStart(value, selectionStart);
    const line = value.slice(lineStart, selectionStart);
    if (getListContinuation(line) !== "break") {
        return false;
    }
    replaceRange(textarea, {
        start: lineStart,
        end: selectionStart,
        text: "",
        onChange,
        cursor: { start: lineStart }
    });
    return true;
}

function tryContinueList(textarea: HTMLTextAreaElement, onChange: OnChange) {
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
            onChange,
            cursor: { start: caret + continuation.length }
        });
    });
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

/**
 * Run `setup` when `ref.current` becomes available, and re-run when it changes
 * (or cleanup when it goes away). `setup` follows the standard useEffect
 * convention: return a cleanup function. Needed because refs aren't reactive,
 * so a plain useEffect with `[ref]` in deps never fires on ref population.
 */
function useRefEffect<T>(ref: RefObject<T | null>, setup: (el: T) => (() => void) | void) {
    const attachedRef = useRef<{ el: T; cleanup: (() => void) | void } | null>(null);

    useEffect(() => {
        const el = ref.current;
        const attached = attachedRef.current;

        if (attached && attached.el === el) {
            return;
        }

        if (attached && typeof attached.cleanup === "function") {
            attached.cleanup();
        }
        attachedRef.current = null;

        if (!el) {
            return;
        }

        attachedRef.current = { el, cleanup: setup(el) };
    });

    useEffect(() => {
        return () => {
            const attached = attachedRef.current;
            if (attached && typeof attached.cleanup === "function") {
                attached.cleanup();
                attachedRef.current = null;
            }
        };
    }, []);
}
