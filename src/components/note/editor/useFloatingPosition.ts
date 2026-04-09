import { computePosition, flip, offset } from "@floating-ui/react";
import { useCallback, useRef } from "react";

import { getSelectionRect } from "./utils/getSelectionRect";

import type { Placement } from "@floating-ui/react";
import type { RefObject } from "react";

type UseFloatingPositionOptions = {
    measureRef: RefObject<HTMLDivElement | null>;
    content: string;
    selection: { start: number; end: number };
    placement: Placement;
    offset: number;
    visible?: boolean;
};

/**
 * Returns a ref callback that positions a floating element relative to the
 * current text selection using @floating-ui. The element starts at
 * (0, 0) with opacity 0 and is moved into place once positioning resolves.
 */
export function useFloatingPosition({
    measureRef,
    content,
    selection,
    placement,
    offset: offsetValue,
    visible = true
}: UseFloatingPositionOptions) {
    const floatingRef = useRef<HTMLDivElement>(null);

    const setFloatingRef = useCallback(
        (node: HTMLDivElement | null) => {
            floatingRef.current = node;
            if (!node || !visible || !measureRef.current) {
                return;
            }
            const rect = getSelectionRect(measureRef.current, content, selection);
            if (!rect) {
                return;
            }
            const virtualEl = { getBoundingClientRect: () => rect };
            computePosition(virtualEl, node, {
                placement,
                middleware: [offset(offsetValue), flip()]
            }).then(({ x, y }) => {
                node.style.transform = `translate(${x}px, ${y}px)`;
                node.style.opacity = "1";
                node.style.pointerEvents = "auto";
            });
        },
        [visible, measureRef, content, selection, placement, offsetValue]
    );

    return setFloatingRef;
}
