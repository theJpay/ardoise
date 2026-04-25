import { useCallback } from "react";

import { dispatch, isActive } from "@utils/editorEngine";

import type { ActionName, EditorEngine } from "@utils/editorEngine";

export function useEditorCommands(engine: EditorEngine | null) {
    const runAction = useCallback(
        (actionName: ActionName) => {
            if (!engine) {
                return;
            }
            dispatch(engine, actionName);
        },
        [engine]
    );

    const isActionActive = useCallback(
        (actionName: ActionName) => {
            // console.log("Checking if action is active:", { actionName, engine });
            if (!engine || !engine.isFocused()) {
                return false;
            }
            const action = ACTION_ACTIVE_WITH_SELECTION_ONLY.includes(actionName);
            if (action) {
                const { start, end } = engine.getSelection();
                if (start === end) {
                    return false;
                }
            }
            return isActive(engine, actionName);
        },
        [engine]
    );

    const toggleLink = useCallback(() => {
        engine?.toggleLink();
    }, [engine]);

    return { runAction, isActionActive, toggleLink };
}

const ACTION_ACTIVE_WITH_SELECTION_ONLY: ActionName[] = ["bold", "italic", "strikethrough", "code"];
