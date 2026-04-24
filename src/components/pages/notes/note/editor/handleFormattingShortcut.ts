import type { ActionName } from "@utils/editorEngine";

type RunAction = (name: ActionName) => void;
type ToggleLink = () => void;

export function handleFormattingShortcut(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    runAction: RunAction,
    toggleLink: ToggleLink
): boolean {
    if (!e.metaKey && !e.ctrlKey) {
        return false;
    }

    const key = e.key.toLowerCase();

    if (!e.shiftKey && !e.altKey && key === "b") {
        e.preventDefault();
        e.stopPropagation();
        runAction("bold");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "i") {
        e.preventDefault();
        e.stopPropagation();
        runAction("italic");
        return true;
    }

    if (e.shiftKey && !e.altKey && key === "x") {
        e.preventDefault();
        e.stopPropagation();
        runAction("strikethrough");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "e") {
        e.preventDefault();
        e.stopPropagation();
        runAction("code");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "k") {
        e.preventDefault();
        e.stopPropagation();
        toggleLink();
        return true;
    }

    return false;
}
