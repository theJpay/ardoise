import { decideSmartEnter } from "./decideSmartEnter";
import { PAIRS } from "./pairs";

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
    const engine = editor.engine;
    if (!engine) {
        return false;
    }
    const { start, end } = engine.getSelection();
    const op = decideSmartEnter({
        key: e.key,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        start,
        end,
        lineEnd: engine.getLineEnd(),
        listInfo: engine.getLineListInfo()
    });
    if (!op) {
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    if (op.kind === "exit-list") {
        engine.clearCurrentLine();
    } else {
        engine.insertTemplate("\n" + op.nextMarker);
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
    const value = engine.getValue();
    const before = value[start - 1];
    const after = value[start];
    if (before && PAIRS[before] === after) {
        e.preventDefault();
        e.stopPropagation();
        engine.replaceRange({
            start: start - 1,
            end: start + 1,
            text: "",
            cursor: { start: start - 1 }
        });
        return true;
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
