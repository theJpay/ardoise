import { useCallback, useEffect, useRef } from "react";

import type { EditorEngine } from "@utils/editorEngine";
import type { RefObject } from "react";

export function useSmartKeys(
    editorRef: RefObject<HTMLTextAreaElement | null>,
    engine: EditorEngine | null
) {
    const engineRef = useRef(engine);
    engineRef.current = engine;

    const skipContinuationRef = useRef(false);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
            const textarea = editorRef.current;
            if (!textarea || !engine) {
                return false;
            }
            if (e.key === "Enter") {
                skipContinuationRef.current =
                    e.shiftKey || textarea.selectionStart !== textarea.selectionEnd;
                return false;
            }
            if (e.key === "Tab") {
                return handleSmartTab(e, engine);
            }
            return false;
        },
        [editorRef, engine]
    );

    useRefEffect(editorRef, (textarea) => {
        const onBeforeInput = (e: InputEvent) => {
            if (!isPlainLineBreak(e) || skipContinuationRef.current) {
                return;
            }
            const current = engineRef.current;
            if (!current) {
                return;
            }
            if (tryBreakEmptyListItem(current)) {
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
            const current = engineRef.current;
            if (!current) {
                return;
            }
            tryContinueList(current);
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

function tryBreakEmptyListItem(engine: EditorEngine): boolean {
    const { start: cursor } = engine.getSelection();
    const content = engine.getValue();
    const lineStart = engine.getLineStart();
    const info = engine.getLineListInfo(content.slice(lineStart, cursor));
    if (!info?.isEmpty) {
        return false;
    }
    engine.replaceRange({
        start: lineStart,
        end: cursor,
        text: "",
        cursor: { start: lineStart }
    });
    return true;
}

function tryContinueList(engine: EditorEngine) {
    const { start: cursor } = engine.getSelection();
    const content = engine.getValue();
    const prevLineEnd = cursor - 1;
    if (prevLineEnd < 0) {
        return;
    }
    const prevLineStart = engine.getLineStart(prevLineEnd);
    const prevLine = content.slice(prevLineStart, prevLineEnd);
    const info = engine.getLineListInfo(prevLine);
    if (!info || info.isEmpty) {
        return;
    }

    queueMicrotask(() => {
        engine.insertText(info.nextMarker);
    });
}

function handleSmartTab(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    engine: EditorEngine
): boolean {
    const { start } = engine.getSelection();

    if (!shouldInterceptTab(engine)) {
        return false;
    }

    e.preventDefault();

    const { firstLineStart, selectedText, lines } = engine.getSelectedLines();
    const modifiedLines = lines.map((line) => (e.shiftKey ? dedentLine(line) : "  " + line));

    const firstLineOffset = modifiedLines[0].length - lines[0].length;
    const newText = modifiedLines.join("\n");

    engine.replaceRange({
        start: firstLineStart,
        end: firstLineStart + selectedText.length,
        text: newText,
        cursor: {
            start: Math.max(firstLineStart, start + firstLineOffset),
            end: firstLineStart + newText.length
        }
    });

    return true;
}

function dedentLine(line: string): string {
    const spaces = line.match(/^ {1,2}/)?.[0].length ?? 0;
    return line.slice(spaces);
}

function shouldInterceptTab(engine: EditorEngine): boolean {
    if (engine.isInsideCodeBlock()) {
        return true;
    }

    const { lines } = engine.getSelectedLines();
    return lines.some((line) => engine.getLineListInfo(line) !== null);
}

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
