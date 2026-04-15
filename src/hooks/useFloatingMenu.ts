import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { useEffect, useMemo } from "react";

import type { Placement, ReferenceType } from "@floating-ui/react";
import type { RefObject } from "react";

type Anchor =
    | { type: "coordinates"; x: number; y: number }
    | { type: "element"; ref: RefObject<HTMLElement | null> };

type UseFloatingMenuOptions = {
    anchor: Anchor;
    placement?: Placement;
    offset?: number;
};

export function useFloatingMenu({
    anchor,
    placement = "bottom-start",
    offset: offsetValue = 4
}: UseFloatingMenuOptions) {
    const reference = useMemo<ReferenceType | null>(() => {
        if (anchor.type === "coordinates") {
            return {
                getBoundingClientRect: () => new DOMRect(anchor.x, anchor.y, 0, 0)
            };
        }
        return anchor.ref.current;
    }, [anchor]);

    const { refs, floatingStyles } = useFloating<ReferenceType>({
        placement,
        middleware: [offset(offsetValue), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate
    });

    useEffect(() => {
        refs.setReference(reference);
    }, [reference, refs]);

    return { refs, floatingStyles };
}
