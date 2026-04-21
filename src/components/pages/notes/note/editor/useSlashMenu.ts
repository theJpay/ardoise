import { useCallback, useEffect, useMemo, useReducer } from "react";

import { UnreachableError } from "@utils";

import { SLASH_MENU_ACTIONS } from "./utils/actions";
import { getLineStart } from "./utils/line";
import { replaceRange } from "./utils/replaceRange";

import type { RefObject } from "react";

type State = {
    isOpen: boolean;
    filter: string;
    selectedIndex: number;
};

type Action =
    | { type: "open"; filter: string }
    | { type: "close" }
    | { type: "filter"; value: string }
    | { type: "navigate"; direction: "up" | "down"; count: number };

export function useSlashMenu(
    editorRef: RefObject<HTMLTextAreaElement | null>,
    content: string,
    cursorPosition: number,
    onChange: (newContent: string) => void
) {
    const [state, dispatch] = useReducer(reducer, getInitialState());

    const filteredActions = useMemo(() => {
        const filter = state.filter.toLowerCase();
        return SLASH_MENU_ACTIONS.filter(
            (action) => action.label.toLowerCase().includes(filter) || action.name.includes(filter)
        );
    }, [state.filter]);

    useEffect(() => {
        const filter = getSlashContext(content, cursorPosition);
        if (filter !== null) {
            if (!state.isOpen) {
                dispatch({ type: "open", filter });
            } else {
                dispatch({ type: "filter", value: filter });
            }
        } else if (state.isOpen) {
            dispatch({ type: "close" });
        }
    }, [content, cursorPosition, state.isOpen]);

    const executeCommand = useCallback(
        (actionName: string) => {
            const action = SLASH_MENU_ACTIONS.find((a) => a.name === actionName);
            if (!action || !editorRef.current) {
                return;
            }
            const textarea = editorRef.current;
            const lineStart = getLineStart(textarea.value, cursorPosition);
            const newCursorPos = lineStart + (action.cursorOffset ?? action.syntax.length);

            replaceRange(textarea, {
                start: lineStart,
                end: cursorPosition,
                text: action.syntax,
                onChange,
                cursor: { start: newCursorPos }
            });
            dispatch({ type: "close" });
        },
        [editorRef, cursorPosition, onChange]
    );

    const dismissAndClean = useCallback(() => {
        if (!editorRef.current) {
            return;
        }
        const textarea = editorRef.current;
        const lineStart = getLineStart(textarea.value, cursorPosition);

        replaceRange(textarea, {
            start: lineStart,
            end: cursorPosition,
            text: "",
            onChange,
            cursor: { start: lineStart }
        });
        dispatch({ type: "close" });
    }, [editorRef, cursorPosition, onChange]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (!state.isOpen) {
                return false;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                dispatch({
                    type: "navigate",
                    direction: "down",
                    count: filteredActions.length
                });
                return true;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                dispatch({
                    type: "navigate",
                    direction: "up",
                    count: filteredActions.length
                });
                return true;
            }
            if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                const selected = filteredActions[state.selectedIndex];
                if (selected) {
                    executeCommand(selected.name);
                }
                return true;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                dismissAndClean();
                return true;
            }
            return false;
        },
        [state.isOpen, state.selectedIndex, filteredActions, executeCommand, dismissAndClean]
    );

    return { state, filteredActions, executeCommand, handleKeyDown };
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "open":
            return { isOpen: true, filter: action.filter, selectedIndex: 0 };
        case "close":
            return getInitialState();
        case "filter":
            return { ...state, filter: action.value, selectedIndex: 0 };
        case "navigate": {
            const offset = action.direction === "down" ? 1 : -1;
            const next = (state.selectedIndex + offset + action.count) % action.count;
            return { ...state, selectedIndex: next };
        }
        default:
            throw new UnreachableError(action);
    }
}

function getInitialState(): State {
    return {
        isOpen: false,
        filter: "",
        selectedIndex: 0
    };
}

function getSlashContext(value: string, cursorPosition: number): string | null {
    const lineBeforeCursor = value.slice(getLineStart(value, cursorPosition), cursorPosition);
    const match = lineBeforeCursor.match(/^\/([a-zA-Z-]*)$/);
    if (!match) {
        return null;
    }
    return match[1];
}
