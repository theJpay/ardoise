import { escapeHtml } from "@utils/escapeHtml";

import { ACTIONS } from "./actions";
import { findEnclosingFence } from "./lib/findEnclosingFence";
import { hasInlineMarkersAround } from "./lib/hasInlineMarkersAround";
import { hasLinePrefix } from "./lib/hasLinePrefix";
import { isInsideCodeBlock } from "./lib/isInsideCodeBlock";
import { getLineEnd, getLineStart, getSelectedLines } from "./lib/line";
import { parseLineListInfo } from "./lib/parseLineListInfo";

import type { ActionName } from "./actions";

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

    clearCurrentLine(): void {
        const { start } = this.getSelection();
        const content = this.getValue();
        const lineStart = getLineStart(content, start);
        const lineEnd = getLineEnd(content, start);
        this.replaceRange({ start: lineStart, end: lineEnd, text: "" });
    }

    toggleInlineMarker(marker: string): void {
        const { start, end } = this.getSelection();
        const selected = this.getValue().slice(start, end);
        if (this.isInlineMarkerActive(marker)) {
            this.replaceRange({
                start: start - marker.length,
                end: end + marker.length,
                text: selected,
                cursor: { start: start - marker.length, end: end - marker.length }
            });
        } else {
            this.replaceRange({
                start,
                end,
                text: marker + selected + marker,
                cursor: { start: start + marker.length, end: end + marker.length }
            });
        }
    }

    toggleLinePrefix(prefix: string): void {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        if (start !== end && content.slice(start, end).includes("\n")) {
            this.toggleLinePrefixOverSelection(prefix);
        } else {
            this.togglePrefixOnLine(prefix);
        }
    }

    toggleCodeBlock(): void {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        if (this.isInsideCodeBlock()) {
            const fence = findEnclosingFence(content, start);
            if (!fence) {
                return;
            }
            this.replaceRange({
                start: fence.openingStart,
                end: fence.closingEnd,
                text: fence.innerContent,
                cursor: {
                    start: fence.openingStart,
                    end: fence.openingStart + fence.innerContent.length
                }
            });
            return;
        }
        if (start !== end) {
            const selected = content.slice(start, end);
            this.replaceRange({
                start,
                end,
                text: "```\n" + selected + "\n```",
                cursor: { start: start + 4, end: start + 4 + selected.length }
            });
            return;
        }
        const lineStart = getLineStart(content, start);
        const lineEnd = getLineEnd(content, start);
        const lineContent = content.slice(lineStart, lineEnd);
        if (lineContent.length === 0) {
            this.replaceRange({
                start: lineStart,
                end: lineEnd,
                text: "```\n\n```",
                cursor: { start: lineStart + 4 }
            });
        } else {
            this.replaceRange({
                start: lineStart,
                end: lineEnd,
                text: "```\n" + lineContent + "\n```",
                cursor: { start: lineStart + 4, end: lineStart + 4 + lineContent.length }
            });
        }
    }

    toggleLink(): void {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        const selected = content.slice(start, end);
        const isUrl = /^https?:\/\//.test(selected);

        if (isUrl) {
            this.replaceRange({
                start,
                end,
                text: `[](${selected})`,
                cursor: { start: start + 1 }
            });
        } else {
            const urlStart = start + selected.length + 3;
            this.replaceRange({
                start,
                end,
                text: `[${selected}](url)`,
                cursor: { start: urlStart, end: urlStart + 3 }
            });
        }
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

    getSelection(): { start: number; end: number } {
        return {
            start: this.textarea.selectionStart,
            end: this.textarea.selectionEnd
        };
    }

    getValue(): string {
        return this.textarea.value;
    }

    isFocused(): boolean {
        return document.activeElement === this.textarea;
    }

    run(name: ActionName): void {
        const action = ACTIONS[name];
        switch (action.type) {
            case "inline":
                return this.toggleInlineMarker(action.marker);
            case "line":
                return this.toggleLinePrefix(action.prefix);
            case "code-block":
                return this.toggleCodeBlock();
            case "link":
                return this.toggleLink();
            case "insert":
                return this.insertTemplate(action.template);
        }
    }

    isActive(name: ActionName): boolean {
        const action = ACTIONS[name];
        switch (action.type) {
            case "inline":
                return this.isInlineMarkerActive(action.marker);
            case "line":
                return this.hasLinePrefix(action.prefix);
            case "code-block":
                return this.isInsideCodeBlock();
            default:
                return false;
        }
    }

    private isInlineMarkerActive(marker: string): boolean {
        if (marker === "*") {
            return this.countCharsAround("*") % 2 === 1;
        }
        if (marker === "**") {
            return this.countCharsAround("*") >= 2;
        }
        return this.hasInlineMarkersAround(marker);
    }

    private countCharsAround(char: string): number {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        let before = 0;
        while (start - 1 - before >= 0 && content[start - 1 - before] === char) {
            before++;
        }
        let after = 0;
        while (end + after < content.length && content[end + after] === char) {
            after++;
        }
        return Math.min(before, after);
    }

    private hasInlineMarkersAround(marker: string): boolean {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        return hasInlineMarkersAround(content, start, end, marker);
    }

    private hasLinePrefix(prefix: string): boolean {
        const { start } = this.getSelection();
        const content = this.getValue();
        return hasLinePrefix(content, start, prefix);
    }

    private isInsideCodeBlock(): boolean {
        const { start } = this.getSelection();
        const content = this.getValue();
        return isInsideCodeBlock(content, start);
    }

    getLineListInfo(slice?: string): ListLineInfo | null {
        if (slice !== undefined) {
            return parseLineListInfo(slice);
        }
        const { start } = this.getSelection();
        const content = this.getValue();
        const lineStart = getLineStart(content, start);
        const lineEnd = getLineEnd(content, start);
        return parseLineListInfo(content.slice(lineStart, lineEnd));
    }

    getLineStart(position?: number): number {
        const pos = position ?? this.getSelection().start;
        return getLineStart(this.getValue(), pos);
    }

    getLineEnd(position?: number): number {
        const pos = position ?? this.getSelection().start;
        return getLineEnd(this.getValue(), pos);
    }

    getSelectedLines(): { firstLineStart: number; selectedText: string; lines: string[] } {
        const { start, end } = this.getSelection();
        const content = this.getValue();
        return getSelectedLines(content, start, end);
    }

    getSelectionRect(): DOMRect {
        const phantom = this.ensurePhantom();
        this.syncPhantomStyles(phantom);
        const { start, end } = this.getSelection();
        const content = this.getValue();
        const before = escapeHtml(content.slice(0, start));
        const selected = escapeHtml(content.slice(start, end));
        const after = escapeHtml(content.slice(end));
        phantom.innerHTML = `${before}<span id="sel-start"></span>${selected}<span id="sel-end"></span>${after}`;

        const startMarker = phantom.querySelector("#sel-start");
        const endMarker = phantom.querySelector("#sel-end");
        if (!startMarker || !endMarker) {
            return new DOMRect();
        }
        const startRect = startMarker.getBoundingClientRect();
        const endRect = endMarker.getBoundingClientRect();
        return new DOMRect(
            startRect.left,
            startRect.top,
            endRect.right - startRect.left,
            endRect.bottom - startRect.top
        );
    }

    replaceRange(args: ReplaceRangeArgs): void {
        const { start, end, text, cursor } = args;
        this.textarea.focus({ preventScroll: true });
        this.textarea.setSelectionRange(start, end);
        document.execCommand("insertText", false, text);
        if (cursor) {
            this.textarea.setSelectionRange(cursor.start, cursor.end ?? cursor.start);
        }
    }

    private togglePrefixOnLine(prefix: string): void {
        const { start, end } = this.getSelection();
        const content = this.getValue();
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
        const { start, end } = this.getSelection();
        const content = this.getValue();
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
