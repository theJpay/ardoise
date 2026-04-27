import { useEffect, useLayoutEffect, useRef } from "react";

import type { EditorHandle } from "@editor";
import type { EditorMode } from "@hooks/useEditorMode";
import type { RefObject } from "react";

type Saved = {
    noteId: string;
    cursor: { start: number; end: number };
    scrollTop: number;
    scrollPercent: number;
};

type UsePreserveEditStateArgs = {
    mode: EditorMode;
    noteId: string;
    editor: EditorHandle;
    scrollContainerRef: RefObject<HTMLElement | null>;
};

export function usePreserveEditState({
    mode,
    noteId,
    editor,
    scrollContainerRef
}: UsePreserveEditStateArgs): void {
    const { engine } = editor;
    const savedRef = useRef<Saved | null>(null);

    useEffect(() => {
        if (mode !== "edit") {
            return;
        }
        const scroller = scrollContainerRef.current;
        if (!scroller || !engine) {
            return;
        }

        const capture = () => {
            const range = getScrollRange(scroller);
            savedRef.current = {
                noteId,
                cursor: engine.getSelection(),
                scrollTop: scroller.scrollTop,
                scrollPercent: range > 0 ? scroller.scrollTop / range : 0
            };
        };

        capture();
        scroller.addEventListener("scroll", capture, { passive: true });
        document.addEventListener("selectionchange", capture);

        return () => {
            scroller.removeEventListener("scroll", capture);
            document.removeEventListener("selectionchange", capture);
        };
    }, [mode, noteId, engine, scrollContainerRef]);

    useLayoutEffect(() => {
        const scroller = scrollContainerRef.current;
        if (!scroller) {
            return;
        }
        const saved = savedRef.current;
        if (!saved || saved.noteId !== noteId) {
            return;
        }

        if (mode === "edit") {
            if (!engine) {
                return;
            }
            const len = engine.getValue().length;
            engine.setSelection(Math.min(saved.cursor.start, len), Math.min(saved.cursor.end, len));
            engine.focus();
            scroller.scrollTop = saved.scrollTop;
            return;
        }

        const apply = (): boolean => {
            const range = getScrollRange(scroller);
            if (range <= 0) {
                return false;
            }
            scroller.scrollTop = saved.scrollPercent * range;
            return true;
        };

        if (apply()) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (apply()) {
                observer.disconnect();
            }
        });
        observer.observe(scroller, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [mode, noteId, engine, scrollContainerRef]);
}

function getScrollRange(el: HTMLElement) {
    return el.scrollHeight - el.clientHeight;
}
