import { useCallback, useEffect, useState } from "react";

import { EditorEngine } from "./engine";

import type { ActionName } from "./engine";

export type EditorHandle = {
    attach: (el: HTMLTextAreaElement | null) => void;
    textarea: HTMLTextAreaElement | null;
    engine: EditorEngine | null;
    selection: { start: number; end: number };
    focused: boolean;
    run: (action: ActionName) => void;
    isActive: (action: ActionName) => boolean;
};

export function useEditor(): EditorHandle {
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
    const [engine, setEngine] = useState<EditorEngine | null>(null);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [focused, setFocused] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!textarea) {
            return;
        }
        const instance = new EditorEngine(textarea);
        setEngine(instance);
        return () => {
            instance.dispose();
            setEngine(null);
        };
    }, [textarea]);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        if (!textarea) {
            return;
        }
        const syncSelection = () => {
            setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
        };
        const handleFocus = () => setFocused(true);
        const handleBlur = () => setFocused(false);

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

    return { attach: setTextarea, textarea, engine, selection, focused, run, isActive };
}
