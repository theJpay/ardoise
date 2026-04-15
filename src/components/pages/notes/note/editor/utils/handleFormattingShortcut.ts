import type { InlineActionName } from "./actions";

type ToggleInline = (name: InlineActionName) => void;
type ToggleLink = () => void;

export function handleFormattingShortcut(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    toggleInline: ToggleInline,
    toggleLink: ToggleLink
): boolean {
    if (!e.metaKey && !e.ctrlKey) {
        return false;
    }

    const key = e.key.toLowerCase();

    if (!e.shiftKey && !e.altKey && key === "b") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("bold");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "i") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("italic");
        return true;
    }

    if (e.shiftKey && !e.altKey && key === "x") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("strikethrough");
        return true;
    }

    if (!e.shiftKey && !e.altKey && key === "e") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("code");
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
