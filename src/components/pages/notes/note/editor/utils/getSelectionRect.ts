import { escapeHtml } from "./escapeHtml";

type Selection = { start: number; end: number };

export function getSelectionRect(
    measureEl: HTMLDivElement,
    content: string,
    selection: Selection
): DOMRect | null {
    const before = escapeHtml(content.slice(0, selection.start));
    const selected = escapeHtml(content.slice(selection.start, selection.end));
    const after = escapeHtml(content.slice(selection.end));

    measureEl.innerHTML = `${before}<span id="sel-start"></span>${selected}<span id="sel-end"></span>${after}`;

    const startMarker = measureEl.querySelector("#sel-start");
    const endMarker = measureEl.querySelector("#sel-end");
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
