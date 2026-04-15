import { computePosition, flip, offset, shift } from "@floating-ui/react";
import { useCallback, useRef } from "react";

import type { Middleware, Placement } from "@floating-ui/react";
import type { RefObject } from "react";

type Anchor =
    | { type: "coordinates"; x: number; y: number }
    | { type: "element"; ref: RefObject<HTMLElement | null> };

type UseFloatingMenuOptions = {
    anchor: Anchor;
    placement?: Placement;
    offset?: number;
    middleware?: Middleware[];
};

export function useFloatingMenu({
    anchor,
    placement = "bottom-start",
    offset: offsetValue = 4,
    middleware: extraMiddleware = []
}: UseFloatingMenuOptions) {
    const menuRef = useRef<HTMLDivElement>(null);

    const setRef = useCallback(
        (node: HTMLDivElement | null) => {
            menuRef.current = node;
            if (!node) {
                return;
            }

            const reference =
                anchor.type === "coordinates"
                    ? { getBoundingClientRect: () => new DOMRect(anchor.x, anchor.y, 0, 0) }
                    : anchor.ref.current;

            if (!reference) {
                return;
            }

            computePosition(reference, node, {
                placement,
                middleware: [offset(offsetValue), flip(), shift({ padding: 8 }), ...extraMiddleware]
            }).then(({ x, y }) => {
                node.style.transform = `translate(${x}px, ${y}px)`;
                node.style.opacity = "1";
            });
        },
        [anchor, placement, offsetValue, extraMiddleware]
    );

    return { ref: menuRef, setRef };
}
