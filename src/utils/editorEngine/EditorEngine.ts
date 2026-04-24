import { hasInlineMarkersAround } from "./lib/hasInlineMarkersAround";
import { hasLinePrefix } from "./lib/hasLinePrefix";
import { isInsideCodeBlock } from "./lib/isInsideCodeBlock";

const RELEVANT_STYLE_PROPS = [
    "font",
    "letterSpacing",
    "wordSpacing",
    "tabSize",
    "whiteSpace",
    "wordWrap",
    "wordBreak",
    "padding",
    "border",
    "boxSizing",
    "width",
    "textIndent",
    "lineHeight"
] as const;

export type ListLineInfo = {
    marker: string;
    nextMarker: string;
    isEmpty: boolean;
};

export class EditorEngine {
    private readonly textarea: HTMLTextAreaElement;
    private readonly onChange: (value: string) => void;
    private phantom: HTMLDivElement | null = null;

    constructor(textarea: HTMLTextAreaElement, onChange: (value: string) => void) {
        this.textarea = textarea;
        this.onChange = onChange;
    }

    dispose(): void {
        this.phantom?.remove();
        this.phantom = null;
    }

    // --- Raw primitives ---------------------------------------------------

    insertText(text: string): void {
        const { selectionStart, selectionEnd, value } = this.textarea;
        const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
        const caret = selectionStart + text.length;
        this.textarea.value = newValue;
        this.textarea.selectionStart = caret;
        this.textarea.selectionEnd = caret;
        this.onChange(newValue);
    }

    clearCurrentLine(): void {
        throw new Error("not implemented");
    }

    // --- Toggles ----------------------------------------------------------

    toggleInlineMarker(_marker: string): void {
        throw new Error("not implemented");
    }

    toggleLinePrefix(_prefix: string): void {
        throw new Error("not implemented");
    }

    toggleCodeBlock(): void {
        throw new Error("not implemented");
    }

    toggleLink(): void {
        throw new Error("not implemented");
    }

    insertTemplate(_template: string): void {
        throw new Error("not implemented");
    }

    // --- Queries ----------------------------------------------------------

    getSelection(): { start: number; end: number; content: string } {
        return {
            start: this.textarea.selectionStart,
            end: this.textarea.selectionEnd,
            content: this.textarea.value
        };
    }

    hasInlineMarkersAround(marker: string): boolean {
        const { start, end, content } = this.getSelection();
        return hasInlineMarkersAround(content, start, end, marker);
    }

    hasLinePrefix(prefix: string): boolean {
        const { start, content } = this.getSelection();
        return hasLinePrefix(content, start, prefix);
    }

    isInsideCodeBlock(): boolean {
        const { start, content } = this.getSelection();
        return isInsideCodeBlock(content, start);
    }

    getLineListInfo(): ListLineInfo | null {
        throw new Error("not implemented");
    }

    // --- DOM helper -------------------------------------------------------

    getSelectionRect(): DOMRect | null {
        const phantom = this.ensurePhantom();
        this.syncPhantomStyles(phantom);
        throw new Error("not implemented");
    }

    private ensurePhantom(): HTMLDivElement {
        if (this.phantom) {
            return this.phantom;
        }
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.top = "0";
        div.style.left = "0";
        this.textarea.parentElement?.appendChild(div);
        this.phantom = div;
        return div;
    }

    private syncPhantomStyles(phantom: HTMLDivElement): void {
        const computed = window.getComputedStyle(this.textarea);
        for (const prop of RELEVANT_STYLE_PROPS) {
            phantom.style[prop] = computed[prop];
        }
    }
}
