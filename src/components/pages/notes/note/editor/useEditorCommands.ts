import { useCallback } from "react";

import { dispatch, isActive } from "@utils/editorEngine";

import type { BlockActionName, InlineActionName } from "./utils/actions";
import type { EditorEngine } from "@utils/editorEngine";

export function useEditorCommands(engine: EditorEngine | null) {
    const toggleBlock = useCallback(
        (actionName: BlockActionName) => {
            if (!engine) {
                return;
            }
            dispatch(engine, actionName);
        },
        [engine]
    );

    const isBlockActive = useCallback(
        (actionName: BlockActionName) => {
            if (!engine || !engine.isFocused()) {
                return false;
            }
            return isActive(engine, actionName);
        },
        [engine]
    );

    const toggleInline = useCallback(
        (actionName: InlineActionName) => {
            if (!engine) {
                return;
            }
            dispatch(engine, actionName);
        },
        [engine]
    );

    const isInlineActive = useCallback(
        (actionName: InlineActionName) => {
            if (!engine || !engine.isFocused()) {
                return false;
            }
            if (actionName === "link") {
                return false;
            }
            const { start, end } = engine.getSelection();
            if (start === end) {
                return false;
            }
            return isActive(engine, actionName);
        },
        [engine]
    );

    const toggleLink = useCallback(() => {
        engine?.toggleLink();
    }, [engine]);

    return { toggleBlock, isBlockActive, toggleInline, isInlineActive, toggleLink };
}
