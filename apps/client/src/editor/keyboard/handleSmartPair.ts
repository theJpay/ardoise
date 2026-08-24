import { decideSmartPair } from "./decideSmartPair";

import type { EditorHandle } from "../useEditor";
import type { KeyboardEvent } from "react";

export function handleSmartPair(
    e: KeyboardEvent<HTMLTextAreaElement>,
    editor: EditorHandle
): boolean {
    if (isShortcutChord(e) || e.nativeEvent.isComposing) {
        return false;
    }
    const engine = editor.engine;
    if (!engine) {
        return false;
    }
    const { start, end } = engine.getSelection();
    const value = engine.getValue();

    const op = decideSmartPair({ key: e.key, value, start, end });
    if (!op) {
        return false;
    }

    e.preventDefault();
    e.stopPropagation();

    if (op.kind === "skip") {
        engine.replaceRange({
            start,
            end: start + 1,
            text: op.char,
            cursor: { start: start + 1 }
        });
        return true;
    }

    if (op.kind === "wrap") {
        const selected = value.slice(start, end);
        engine.replaceRange({
            start,
            end,
            text: `${op.opener}${selected}${op.closer}`,
            cursor: { start: start + 1, end: start + 1 + selected.length }
        });
        return true;
    }

    engine.replaceRange({
        start,
        end: start,
        text: `${op.opener}${op.closer}`,
        cursor: { start: start + 1 }
    });
    return true;
}

function isShortcutChord(e: KeyboardEvent<HTMLTextAreaElement>): boolean {
    if (e.metaKey) {
        return true;
    }
    // Ctrl alone is a shortcut, but Ctrl+Alt is AltGr — needed to type [ ] { } on AZERTY
    if (e.ctrlKey && !e.altKey) {
        return true;
    }
    return false;
}
