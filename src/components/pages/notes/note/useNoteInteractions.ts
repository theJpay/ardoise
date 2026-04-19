import { useEffect, useRef, useState } from "react";

import type { Note } from "@entities";
import type { EditorMode } from "@hooks/useEditorMode";

const SCROLL_CONTEXT_MARGIN = 100;

type Options = {
    selectedNote: Note | undefined;
    mode: EditorMode;
};

export function useNoteInteractions({ selectedNote, mode }: Options) {
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [focused, setFocused] = useState(false);

    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const phantomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastCursorRef = useRef({ start: 0, end: 0 });
    const lastScrollRatioRef = useRef(0);

    const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const next = {
            start: e.currentTarget.selectionStart,
            end: e.currentTarget.selectionEnd
        };
        setSelection(next);
        lastCursorRef.current = next;
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (mode !== "edit") {
            return;
        }
        const el = e.currentTarget;
        const max = el.scrollHeight - el.clientHeight;
        lastScrollRatioRef.current = max > 0 ? el.scrollTop / max : 0;
    };

    const resetSelection = () => {
        setSelection({ start: 0, end: 0 });
    };

    useFocusOnLoad(titleRef, editorRef, selectedNote);
    useResetCursorOnNoteChange(lastCursorRef, selectedNote?.id);
    useRestoreEditorOnModeChange(editorRef, scrollContainerRef, lastCursorRef, mode);
    useApplyScrollOnPreview(scrollContainerRef, lastScrollRatioRef, mode);

    return {
        selection,
        focused,
        editorRef,
        titleRef,
        phantomRef,
        scrollContainerRef,
        resetSelection,
        handleCursorChange,
        handleScroll,
        setFocused
    };
}

function useFocusOnLoad(
    titleRef: React.RefObject<HTMLInputElement | null>,
    editorRef: React.RefObject<HTMLTextAreaElement | null>,
    selectedNote: Note | undefined
) {
    useEffect(() => {
        if (!selectedNote) {
            return;
        }
        if (selectedNote.title.trim() === "") {
            titleRef.current?.focus();
        } else {
            editorRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);
}

function useResetCursorOnNoteChange(
    lastCursorRef: React.RefObject<{ start: number; end: number }>,
    noteId: string | undefined
) {
    useEffect(() => {
        lastCursorRef.current = { start: 0, end: 0 };
    }, [noteId, lastCursorRef]);
}

function useRestoreEditorOnModeChange(
    editorRef: React.RefObject<HTMLTextAreaElement | null>,
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    lastCursorRef: React.RefObject<{ start: number; end: number }>,
    mode: EditorMode
) {
    useEffect(() => {
        if (mode !== "edit") {
            return;
        }
        const textarea = editorRef.current;
        const container = scrollContainerRef.current;
        if (!textarea || !container) {
            return;
        }
        textarea.focus();
        const { start, end } = lastCursorRef.current;
        textarea.setSelectionRange(start, end);
        scrollToCursor(textarea, container, start);
    }, [mode, editorRef, scrollContainerRef, lastCursorRef]);
}

function scrollToCursor(
    textarea: HTMLTextAreaElement,
    container: HTMLDivElement,
    cursorPos: number
) {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const linesBefore = textarea.value.slice(0, cursorPos).split("\n").length - 1;
    const targetScroll = linesBefore * lineHeight;
    container.scrollTop = Math.max(0, targetScroll - SCROLL_CONTEXT_MARGIN);
}

function useApplyScrollOnPreview(
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    lastScrollRatioRef: React.RefObject<number>,
    mode: EditorMode
) {
    useEffect(() => {
        if (mode !== "preview") {
            return;
        }
        const container = scrollContainerRef.current;
        if (!container) {
            return;
        }
        const ratio = lastScrollRatioRef.current;

        const apply = () => {
            const max = container.scrollHeight - container.clientHeight;
            if (max <= 0) {
                return false;
            }
            container.scrollTop = ratio * max;
            return true;
        };

        if (apply()) {
            return;
        }

        const observer = new ResizeObserver(() => {
            if (apply()) {
                observer.disconnect();
            }
        });
        observer.observe(container);
        const timeout = window.setTimeout(() => observer.disconnect(), 1000);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, [mode, scrollContainerRef, lastScrollRatioRef]);
}
