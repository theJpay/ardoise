import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import { useEffect, useMemo } from "react";

import { getSelectionRect } from "./utils/getSelectionRect";

import type { Placement, ReferenceType } from "@floating-ui/react";
import type { RefObject } from "react";

type UseFloatingPositionOptions = {
    measureRef: RefObject<HTMLDivElement | null>;
    content: string;
    selection: { start: number; end: number };
    placement: Placement;
    offset: number;
    visible?: boolean;
};

export function useFloatingPosition({
    measureRef,
    content,
    selection,
    placement,
    offset: offsetValue,
    visible = true
}: UseFloatingPositionOptions) {
    const reference = useMemo<ReferenceType | null>(() => {
        if (!visible) {
            return null;
        }
        return {
            getBoundingClientRect: () => {
                if (!measureRef.current) {
                    return new DOMRect();
                }
                return getSelectionRect(measureRef.current, content, selection) ?? new DOMRect();
            }
        };
    }, [visible, measureRef, content, selection]);

    const { refs, floatingStyles } = useFloating<ReferenceType>({
        placement,
        middleware: [offset(offsetValue), flip()],
        whileElementsMounted: autoUpdate
    });

    useEffect(() => {
        refs.setReference(reference);
    }, [reference, refs]);

    return { refs, floatingStyles, isPositioned: !!reference };
}
