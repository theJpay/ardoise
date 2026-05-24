import { useEffect } from "react";

import { useClickOutside } from "@hooks/useClickOutside";
import { useFloatingMenu } from "@hooks/useFloatingMenu";

import type { Placement } from "@floating-ui/react";
import type { Anchor } from "@hooks/useFloatingMenu";
import type { ReactNode, RefObject } from "react";

type PopoverProps = {
    open: boolean;
    anchor: Anchor;
    placement?: Placement;
    offset?: number;
    onClose?: () => void;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    ignoreClickOutsideRef?: RefObject<HTMLElement | null>;
    className?: string;
    children: ReactNode;
};

function Popover({
    open,
    anchor,
    placement,
    offset,
    onClose,
    closeOnClickOutside = true,
    closeOnEscape = true,
    ignoreClickOutsideRef,
    className = "",
    children
}: PopoverProps) {
    const { refs, floatingStyles } = useFloatingMenu({ anchor, placement, offset });

    useClickOutside(refs.floating, () => onClose?.(), {
        enabled: open && closeOnClickOutside && !!onClose,
        ignore: ignoreClickOutsideRef
    });

    useEffect(() => {
        if (!open || !closeOnEscape || !onClose) {
            return;
        }
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            ref={refs.setFloating}
            className={`bg-elevated border-border shadow-float z-50 border ${className}`}
            style={floatingStyles}
        >
            {children}
        </div>
    );
}

export default Popover;
