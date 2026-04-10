import { computePosition, offset } from "@floating-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

const STORAGE_KEY = "ardoise:tooltip-mode-seen";
const APPEAR_DELAY = 1000;
const AUTO_DISMISS_DELAY = 4000;

type ModeToggleTooltipProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
};

function ModeToggleTooltip({ anchorRef }: ModeToggleTooltipProps) {
    const [visible, setVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const dismiss = useCallback(() => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, "true");
    }, []);

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEY)) {
            return;
        }

        const appearTimer = setTimeout(() => {
            setVisible(true);
        }, APPEAR_DELAY);

        return () => {
            clearTimeout(appearTimer);
        };
    }, []);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const dismissTimer = setTimeout(dismiss, AUTO_DISMISS_DELAY);
        return () => {
            clearTimeout(dismissTimer);
        };
    }, [visible, dismiss]);

    useEffect(() => {
        if (!visible || !anchorRef.current || !tooltipRef.current) {
            return;
        }
        computePosition(anchorRef.current, tooltipRef.current, {
            placement: "right",
            middleware: [offset(8)]
        }).then(({ x, y }) => {
            if (tooltipRef.current) {
                tooltipRef.current.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }, [visible, anchorRef]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={tooltipRef}
            className="bg-elevated border-border fixed top-0 left-0 z-50 max-w-60 rounded-md border px-3.5 py-2.5 shadow-lg transition-opacity duration-200"
            onMouseEnter={dismiss}
        >
            <div className="text-ui-base text-text mb-1 font-sans font-medium">
                Switch between Write and Read
            </div>
            <div className="text-ui-sm text-muted font-mono leading-[1.6]">
                Write mode for editing raw markdown. Read mode for distraction-free reading.
            </div>
            <div className="text-ui-sm text-subtle mt-2 flex items-center gap-1 font-mono">
                <kbd className="text-ui-xs bg-surface border-border rounded-sm border px-1 py-px">
                    ⌘
                </kbd>
                <kbd className="text-ui-xs bg-surface border-border rounded-sm border px-1 py-px">
                    E
                </kbd>
                <span className="ml-1">to toggle</span>
            </div>
        </div>
    );
}

export default ModeToggleTooltip;
