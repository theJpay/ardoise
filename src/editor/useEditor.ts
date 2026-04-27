import { useCallback, useEffect, useState } from "react";

import { EditorEngine } from "./engine";
import { scrollCaretIntoView } from "./scroll";

import type { ActionName } from "./engine";

type Surface = { textarea: HTMLTextAreaElement; engine: EditorEngine };

export type EditorHandle = {
    attach: (el: HTMLTextAreaElement) => () => void;
    textarea: HTMLTextAreaElement | null;
    engine: EditorEngine | null;
    selection: { start: number; end: number };
    focused: boolean;
    run: (action: ActionName) => void;
    isActive: (action: ActionName) => boolean;
};

export function useEditor(): EditorHandle {
    const [surface, setSurface] = useState<Surface | null>(null);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [focused, setFocused] = useState(false);

    const attach = useCallback((textarea: HTMLTextAreaElement) => {
        const engine = new EditorEngine(textarea);
        setSurface({ textarea, engine });
        return () => {
            engine.dispose();
            setSurface(null);
        };
    }, []);

    const textarea = surface?.textarea ?? null;
    const engine = surface?.engine ?? null;

    useEffect(() => {
        if (!textarea) {
            return;
        }
        const syncSelection = () => {
            setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
        };
        const handleFocus = () => setFocused(true);
        const handleBlur = () => {
            setFocused(false);
            setSelection({ start: 0, end: 0 });
        };

        textarea.addEventListener("select", syncSelection);
        textarea.addEventListener("click", syncSelection);
        textarea.addEventListener("keyup", syncSelection);
        textarea.addEventListener("input", syncSelection);
        textarea.addEventListener("focus", handleFocus);
        textarea.addEventListener("blur", handleBlur);
        return () => {
            textarea.removeEventListener("select", syncSelection);
            textarea.removeEventListener("click", syncSelection);
            textarea.removeEventListener("keyup", syncSelection);
            textarea.removeEventListener("input", syncSelection);
            textarea.removeEventListener("focus", handleFocus);
            textarea.removeEventListener("blur", handleBlur);
        };
    }, [textarea]);

    useEffect(() => {
        if (!textarea || !engine || !focused) {
            return;
        }
        scrollCaretIntoView(textarea, engine.getSelectionRect());
    }, [selection, textarea, engine, focused]);

    const run = useCallback(
        (action: ActionName) => {
            if (!engine || !textarea) {
                return;
            }
            engine.run(action);
            setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
        },
        [engine, textarea]
    );

    const isActive = useCallback(
        (action: ActionName) => {
            if (!engine || !focused) {
                return false;
            }
            return engine.isActive(action);
        },
        [engine, focused]
    );

    return { attach, textarea, engine, selection, focused, run, isActive };
}
