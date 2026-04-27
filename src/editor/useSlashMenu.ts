import { useEffect, useMemo, useReducer } from "react";

import { ACTIONS } from "./engine";

import type { ActionName } from "./engine";
import type { EditorHandle } from "./useEditor";
import type { KeyboardEvent } from "react";

const SLASH_MENU_ACTIONS = [
    "heading-1",
    "heading-2",
    "heading-3",
    "code-block",
    "quote",
    "task-list",
    "hr"
] as const satisfies readonly ActionName[];

type State = {
    isOpen: boolean;
    filter: string;
    selectedIndex: number;
};

type ReducerAction =
    | { type: "open"; filter: string }
    | { type: "close" }
    | { type: "filter"; value: string }
    | { type: "select"; index: number };

const INITIAL_STATE: State = { isOpen: false, filter: "", selectedIndex: 0 };

function reducer(state: State, action: ReducerAction): State {
    switch (action.type) {
        case "open":
            return { isOpen: true, filter: action.filter, selectedIndex: 0 };
        case "close":
            return INITIAL_STATE;
        case "filter":
            return { ...state, filter: action.value, selectedIndex: 0 };
        case "select":
            return { ...state, selectedIndex: action.index };
    }
}

type UseSlashMenuArgs = {
    editor: EditorHandle;
    content: string;
};

export function useSlashMenu({ editor, content }: UseSlashMenuArgs) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const cursor = editor.selection.start;

    const filteredNames = useMemo(() => {
        if (!state.isOpen) {
            return [];
        }
        const lower = state.filter.toLowerCase();
        return SLASH_MENU_ACTIONS.filter((name) =>
            ACTIONS[name].label.toLowerCase().includes(lower)
        );
    }, [state.isOpen, state.filter]);

    useEffect(() => {
        const filter = getSlashContext(content, cursor);
        if (filter !== null) {
            if (!state.isOpen) {
                dispatch({ type: "open", filter });
            } else if (filter !== state.filter) {
                dispatch({ type: "filter", value: filter });
            }
        } else if (state.isOpen) {
            dispatch({ type: "close" });
        }
    }, [content, cursor, state.isOpen, state.filter]);

    function deleteSlashText() {
        if (!editor.engine || !editor.textarea) {
            return;
        }
        const c = editor.textarea.selectionStart;
        const liveContent = editor.textarea.value;
        const lineStart = liveContent.lastIndexOf("\n", c - 1) + 1;
        editor.engine.replaceRange({
            start: lineStart,
            end: c,
            text: "",
            cursor: { start: lineStart }
        });
    }

    function executeCommand(name: ActionName) {
        deleteSlashText();
        editor.run(name);
        dispatch({ type: "close" });
    }

    function dismiss() {
        deleteSlashText();
        dispatch({ type: "close" });
    }

    function select(index: number) {
        dispatch({ type: "select", index });
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): boolean {
        if (!state.isOpen) {
            return false;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            if (filteredNames.length > 0) {
                select((state.selectedIndex + 1) % filteredNames.length);
            }
            return true;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            if (filteredNames.length > 0) {
                select((state.selectedIndex - 1 + filteredNames.length) % filteredNames.length);
            }
            return true;
        }
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();
            const name = filteredNames[state.selectedIndex];
            if (name) {
                executeCommand(name);
            }
            return true;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            dismiss();
            return true;
        }
        return false;
    }

    return { state, filteredNames, executeCommand, select, handleKeyDown };
}

function getSlashContext(content: string, cursor: number): string | null {
    const lineStart = content.lastIndexOf("\n", cursor - 1) + 1;
    const lineBeforeCursor = content.slice(lineStart, cursor);
    const match = lineBeforeCursor.match(/^\/([a-zA-Z-]*)$/);
    return match ? match[1] : null;
}
