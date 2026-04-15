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

    const code = e.nativeEvent.code;

    if (!e.shiftKey && !e.altKey && code === "KeyB") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("bold");
        return true;
    }

    if (!e.shiftKey && !e.altKey && code === "KeyI") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("italic");
        return true;
    }

    if (e.shiftKey && !e.altKey && code === "KeyX") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("strikethrough");
        return true;
    }

    if (!e.shiftKey && !e.altKey && code === "KeyE") {
        e.preventDefault();
        e.stopPropagation();
        toggleInline("code");
        return true;
    }

    if (!e.shiftKey && !e.altKey && code === "KeyK") {
        e.preventDefault();
        e.stopPropagation();
        toggleLink();
        return true;
    }

    return false;
}
