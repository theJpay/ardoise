/**
 * Scroll helpers used by the editor.
 *
 * The textarea has `overflow: hidden` so the page can scroll naturally with
 * content — but that opts us out of the textarea's native scroll behaviors
 * (cursor follow on type, scroll-into-view on selection). These helpers
 * re-implement what the browser does for an unconstrained textarea.
 */

function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
    let node = el.parentElement;
    while (node) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll") {
            return node;
        }
        node = node.parentElement;
    }
    return null;
}

export function autoGrow(textarea: HTMLTextAreaElement) {
    const scroller = findScrollableAncestor(textarea);
    const savedScrollTop = scroller?.scrollTop ?? 0;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (scroller && scroller.scrollTop !== savedScrollTop) {
        scroller.scrollTop = savedScrollTop;
    }
}

export function scrollIntoOverflowParent(el: HTMLElement | null) {
    if (!el) {
        return;
    }
    adjustScrollerToShow(el.parentElement, el.getBoundingClientRect());
}

export function scrollCaretIntoView(textarea: HTMLTextAreaElement, caretRect: DOMRect) {
    adjustScrollerToShow(findScrollableAncestor(textarea), caretRect);
}

function adjustScrollerToShow(scroller: HTMLElement | null, rect: DOMRect) {
    if (!scroller) {
        return;
    }
    const scrollerRect = scroller.getBoundingClientRect();
    const style = getComputedStyle(scroller);
    const paddingTop = parseFloat(style.scrollPaddingTop) || 0;
    const paddingBottom = parseFloat(style.scrollPaddingBottom) || 0;
    const visibleTop = scrollerRect.top + paddingTop;
    const visibleBottom = scrollerRect.bottom - paddingBottom;
    if (rect.top < visibleTop) {
        scroller.scrollTop -= visibleTop - rect.top;
    } else if (rect.bottom > visibleBottom) {
        scroller.scrollTop += rect.bottom - visibleBottom;
    }
}
