/**
 * Scroll helpers used by the editor.
 *
 * The textarea has `overflow: hidden` so the page can scroll naturally with
 * content — but that opts us out of the textarea's native scroll behaviors
 * (cursor follow on type, scroll-into-view on selection). These helpers
 * re-implement what the browser does for an unconstrained textarea.
 */

export function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
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

export function autoGrow(textarea: HTMLTextAreaElement, scroller: HTMLElement | null) {
    const savedScrollTop = scroller?.scrollTop ?? 0;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (scroller && scroller.scrollTop !== savedScrollTop) {
        scroller.scrollTop = savedScrollTop;
    }
}

export function scrollIntoOverflowParent(el: HTMLElement | null) {
    const scroller = el?.parentElement;
    if (!el || !scroller) {
        return;
    }
    const elRect = el.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    if (elRect.top < scrollerRect.top) {
        scroller.scrollTop -= scrollerRect.top - elRect.top;
    } else if (elRect.bottom > scrollerRect.bottom) {
        scroller.scrollTop += elRect.bottom - scrollerRect.bottom;
    }
}
