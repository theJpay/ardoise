import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import { useEffect, useMemo } from "react";

import type { EditorHandle } from "./useEditor";
import type { Placement, ReferenceType } from "@floating-ui/react";

type UseFloatingPositionOptions = {
    editor: EditorHandle;
    placement: Placement;
    offset: number;
    visible: boolean;
};

export function useFloatingPosition({
    editor,
    placement,
    offset: offsetValue,
    visible
}: UseFloatingPositionOptions) {
    const { engine, selection } = editor;

    const reference = useMemo<ReferenceType | null>(() => {
        if (!visible || !engine) {
            return null;
        }
        return {
            getBoundingClientRect: () => engine.getSelectionRect()
        };
        // selection is a dep so floating-ui re-positions as the user selects
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, engine, selection]);

    const { refs, floatingStyles } = useFloating<ReferenceType>({
        placement,
        middleware: [offset(offsetValue), flip()],
        whileElementsMounted: autoUpdate
    });

    useEffect(() => {
        refs.setReference(reference);
    }, [reference, refs]);

    return { refs, floatingStyles };
}
