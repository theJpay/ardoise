import { ACTIONS } from "./actions";

import type { ActionName } from "./actions";
import type { EditorEngine } from "./EditorEngine";

export function dispatch(engine: EditorEngine, name: ActionName): void {
    const action = ACTIONS[name];
    switch (action.type) {
        case "inline":
            engine.toggleInlineMarker(action.marker);
            return;
        case "line":
            engine.toggleLinePrefix(action.prefix);
            return;
        case "code-block":
            engine.toggleCodeBlock();
            return;
        case "link":
            engine.toggleLink();
            return;
        case "insert":
            engine.insertTemplate(action.template);
            return;
    }
}

export function isActive(engine: EditorEngine, name: ActionName): boolean {
    const action = ACTIONS[name];
    switch (action.type) {
        case "inline":
            return engine.hasInlineMarkersAround(action.marker);
        case "line":
            return engine.hasLinePrefix(action.prefix);
        case "code-block":
            return engine.isInsideCodeBlock();
        default:
            return false;
    }
}
