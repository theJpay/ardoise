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
    if (handleSmartBackspace(e, editor)) {
        return true;
    }
    if (handleSmartTab(e, editor)) {
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

function handleSmartBackspace(
    e: KeyboardEvent<HTMLTextAreaElement>,
    editor: EditorHandle
): boolean {
    if (e.key !== "Backspace") {
        return false;
    }
    if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return false;
    }
    const engine = editor.engine;
    if (!engine) {
        return false;
    }
    const { start, end } = engine.getSelection();
    if (start !== end) {
        return false;
    }
    const info = engine.getLineListInfo();
    if (!info) {
        return false;
    }
    const lineStart = engine.getLineStart();
    const markerEnd = lineStart + info.marker.length;
    if (start !== markerEnd) {
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    engine.replaceRange({
        start: lineStart,
        end: markerEnd,
        text: "",
        cursor: { start: lineStart }
    });
    return true;
}

const INDENT = "    ";

function handleSmartTab(e: KeyboardEvent<HTMLTextAreaElement>, editor: EditorHandle): boolean {
    if (e.key !== "Tab") {
        return false;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) {
        return false;
    }
    const engine = editor.engine;
    if (!engine) {
        return false;
    }
    const onListLine = engine.getLineListInfo() !== null;
    const inCodeBlock = engine.isActive("code-block");
    if (!onListLine && !inCodeBlock) {
        return false;
    }
    const { start, end } = engine.getSelection();
    if (start !== end) {
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    const lineStart = engine.getLineStart();
    if (e.shiftKey) {
        const content = engine.getValue();
        if (content.slice(lineStart, lineStart + INDENT.length) === INDENT) {
            engine.replaceRange({
                start: lineStart,
                end: lineStart + INDENT.length,
                text: "",
                cursor: { start: Math.max(lineStart, start - INDENT.length) }
            });
        }
        return true;
    }
    engine.replaceRange({
        start: lineStart,
        end: lineStart,
        text: INDENT,
        cursor: { start: start + INDENT.length }
    });
    return true;
}
