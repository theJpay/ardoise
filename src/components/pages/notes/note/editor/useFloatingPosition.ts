import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import { useEffect, useMemo } from "react";

import type { EditorEngine } from "@utils/editorEngine";
import type { Placement, ReferenceType } from "@floating-ui/react";

type UseFloatingPositionOptions = {
    engine: EditorEngine | null;
    content: string;
    selection: { start: number; end: number };
    placement: Placement;
    offset: number;
    visible?: boolean;
};

export function useFloatingPosition({
    engine,
    content,
    selection,
    placement,
    offset: offsetValue,
    visible = true
}: UseFloatingPositionOptions) {
    const reference = useMemo<ReferenceType | null>(() => {
        if (!visible || !engine) {
            return null;
        }
        return {
            getBoundingClientRect: () => engine.getSelectionRect() ?? new DOMRect()
        };
    }, [visible, engine, content, selection]);

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
