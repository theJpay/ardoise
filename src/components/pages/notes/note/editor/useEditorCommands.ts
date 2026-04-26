import { useCallback } from "react";

import type { ActionName, EditorEngine } from "@editor/engine";

export function useEditorCommands(engine: EditorEngine | null) {
    const runAction = useCallback(
        (actionName: ActionName) => {
            if (!engine) {
                return;
            }
            engine.run(actionName);
        },
        [engine]
    );

    const isActionActive = useCallback(
        (actionName: ActionName) => {
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
            return engine.isActive(actionName);
        },
        [engine]
    );

    const toggleLink = useCallback(() => {
        engine?.toggleLink();
    }, [engine]);

    return { runAction, isActionActive, toggleLink };
}

const ACTION_ACTIVE_WITH_SELECTION_ONLY: ActionName[] = ["bold", "italic", "strikethrough", "code"];
