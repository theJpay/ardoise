import { hasInlineMarkersAround } from "./lib/hasInlineMarkersAround";
import { hasLinePrefix } from "./lib/hasLinePrefix";
import { isInsideCodeBlock } from "./lib/isInsideCodeBlock";
import { getLineEnd, getLineStart, getSelectedLines } from "./lib/line";

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

type ReplaceRangeArgs = {
    start: number;
    end: number;
    text: string;
    cursor?: { start: number; end?: number };
};

export class EditorEngine {
    private readonly textarea: HTMLTextAreaElement;
    private phantom: HTMLDivElement | null = null;

    constructor(textarea: HTMLTextAreaElement) {
        this.textarea = textarea;
    }

    dispose(): void {
        this.phantom?.remove();
        this.phantom = null;
    }

    insertText(text: string): void {
        const { start, end } = this.getSelection();
        this.replaceRange({ start, end, text });
    }

    clearCurrentLine(): void {
        const { start, content } = this.getSelection();
        const lineStart = getLineStart(content, start);
        const lineEnd = getLineEnd(content, start);
        this.replaceRange({ start: lineStart, end: lineEnd, text: "" });
    }

    toggleInlineMarker(marker: string): void {
        const { start, end } = this.getSelection();
        if (this.hasInlineMarkersAround(marker)) {
            const selected = this.textarea.value.slice(start, end);
            this.replaceRange({
                start: start - marker.length,
                end: end + marker.length,
                text: selected,
                cursor: { start: start - marker.length, end: end - marker.length }
            });
        } else {
            const selected = this.textarea.value.slice(start, end);
            this.replaceRange({
                start,
                end,
                text: marker + selected + marker,
                cursor: { start: start + marker.length, end: end + marker.length }
            });
        }
    }

    toggleLinePrefix(prefix: string): void {
        const { start, end, content } = this.getSelection();
        if (start !== end && content.slice(start, end).includes("\n")) {
            this.toggleLinePrefixOverSelection(prefix);
        } else {
            this.togglePrefixOnLine(prefix);
        }
    }

    toggleCodeBlock(): void {
        throw new Error("not implemented");
    }

    toggleLink(): void {
        throw new Error("not implemented");
    }

    insertTemplate(template: string): void {
        const { start } = this.getSelection();
        this.replaceRange({
            start,
            end: start,
            text: template,
            cursor: { start: start + template.length }
        });
    }

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

    getSelectionRect(): DOMRect | null {
        const phantom = this.ensurePhantom();
        this.syncPhantomStyles(phantom);
        throw new Error("not implemented");
    }

    private replaceRange(args: ReplaceRangeArgs): void {
        const { start, end, text, cursor } = args;
        this.textarea.focus({ preventScroll: true });
        this.textarea.setSelectionRange(start, end);
        document.execCommand("insertText", false, text);
        if (cursor) {
            this.textarea.setSelectionRange(cursor.start, cursor.end ?? cursor.start);
        }
    }

    private togglePrefixOnLine(prefix: string): void {
        const { start, end, content } = this.getSelection();
        const lineStart = getLineStart(content, start);
        const lineContent = content.slice(lineStart);

        if (lineContent.startsWith(prefix)) {
            this.replaceRange({
                start: lineStart,
                end: lineStart + prefix.length,
                text: "",
                cursor: { start: start - prefix.length, end: end - prefix.length }
            });
        } else {
            this.replaceRange({
                start: lineStart,
                end: lineStart,
                text: prefix,
                cursor: { start: start + prefix.length, end: end + prefix.length }
            });
        }
    }

    private toggleLinePrefixOverSelection(prefix: string): void {
        const { start, end, content } = this.getSelection();
        const { firstLineStart, selectedText, lines } = getSelectedLines(content, start, end);
        const allHaveIt = lines.every((line) => line.startsWith(prefix));
        const newLines = lines.map((line) =>
            allHaveIt ? line.slice(prefix.length) : prefix + line
        );
        const newText = newLines.join("\n");
        const offset = allHaveIt ? -prefix.length : prefix.length;

        this.replaceRange({
            start: firstLineStart,
            end: firstLineStart + selectedText.length,
            text: newText,
            cursor: {
                start: start + offset,
                end: firstLineStart + newText.length
            }
        });
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
