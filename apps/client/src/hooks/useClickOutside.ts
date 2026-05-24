import { useEffect } from "react";

import type { RefObject } from "react";

type UseClickOutsideOptions = {
    enabled?: boolean;
    ignore?: RefObject<HTMLElement | null>;
};

export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    onOutside: () => void,
    { enabled = true, ignore }: UseClickOutsideOptions = {}
) {
    useEffect(() => {
        if (!enabled) {
            return;
        }
        const handleMouseDown = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInside = ref.current?.contains(target) ?? false;
            const isIgnored = ignore?.current?.contains(target) ?? false;
            if (!isInside && !isIgnored) {
                onOutside();
            }
        };
        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [ref, ignore, onOutside, enabled]);
}
