import { escapeHtml } from "./escapeHtml";

type Selection = { start: number; end: number };

export function getSelectionRect(
    phantomEl: HTMLDivElement,
    textareaEl: HTMLTextAreaElement,
    selection: Selection
): DOMRect | null {
    const text = textareaEl.value;
    const before = escapeHtml(text.slice(0, selection.start));
    const selected = escapeHtml(text.slice(selection.start, selection.end));
    const after = escapeHtml(text.slice(selection.end));

    phantomEl.innerHTML = `${before}<span id="sel-start"></span>${selected}<span id="sel-end"></span>${after}`;
    phantomEl.scrollTop = textareaEl.scrollTop;

    const startMarker = phantomEl.querySelector("#sel-start");
    const endMarker = phantomEl.querySelector("#sel-end");
    if (!startMarker || !endMarker) {
        return null;
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
