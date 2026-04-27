import { ACTIONS } from "./engine";

import type { ActionName } from "./engine";
import type { KeyboardEvent } from "react";

export function handleFormattingShortcut(
    e: KeyboardEvent<HTMLTextAreaElement>,
    run: (name: ActionName) => void
): boolean {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) {
        return false;
    }
    const key = e.key.toLowerCase();

    for (const action of Object.values(ACTIONS)) {
        if (!("shortcut" in action)) {
            continue;
        }
        if (action.shortcut.key !== key) {
            continue;
        }
        if (action.shortcut.shift !== e.shiftKey) {
            continue;
        }
        e.preventDefault();
        e.stopPropagation();
        run(action.name);
        return true;
    }
    return false;
}
