import type { EditorHandle } from "../useEditor";
import type { KeyboardEvent } from "react";

export function handleSmartKeys(
    e: KeyboardEvent<HTMLTextAreaElement>,
    editor: EditorHandle
): boolean {
    if (!editor.engine) {
        return false;
    }
    if (handleSmartEnter(e, editor)) {
        return true;
    }
    return false;
}

function handleSmartEnter(e: KeyboardEvent<HTMLTextAreaElement>, editor: EditorHandle): boolean {
    if (e.key !== "Enter") {
        return false;
    }
    if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return false;
    }
    const engine = editor.engine;
    if (!engine) {
        return false;
    }
    const info = engine.getLineListInfo();
    if (!info) {
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    if (info.isEmpty) {
        engine.clearCurrentLine();
    } else {
        engine.insertTemplate("\n" + info.nextMarker);
    }
    return true;
}
