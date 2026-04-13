import { computePosition, offset } from "@floating-ui/react";
import { useEffect, useRef } from "react";

import { useOnboardingActions, useShowModeTooltip } from "@stores/onboarding.store";

import type { RefObject } from "react";

type ModeToggleTooltipProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
};

function ModeToggleTooltip({ anchorRef }: ModeToggleTooltipProps) {
    const visible = useShowModeTooltip();
    const { dismissModeTooltip } = useOnboardingActions();
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible || !anchorRef.current || !tooltipRef.current) {
            return;
        }
        computePosition(anchorRef.current, tooltipRef.current, {
            placement: "right",
            middleware: [offset(12)]
        }).then(({ x, y }) => {
            if (tooltipRef.current) {
                tooltipRef.current.style.transform = `translate(${x}px, ${y}px)`;
                tooltipRef.current.style.opacity = "1";
            }
        });
    }, [visible, anchorRef]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={tooltipRef}
            className="bg-elevated border-border fixed top-0 left-0 z-50 max-w-65 rounded-md border px-3.5 py-3 opacity-0 shadow-lg transition-opacity duration-200"
        >
            <div className="text-ui-base text-text mb-1 font-sans font-medium">
                Switch between Write and Read
            </div>
            <div className="text-ui-sm text-muted font-mono leading-[1.6]">
                Write mode for editing raw markdown. Read mode for distraction-free reading.
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-ui-sm text-subtle flex items-center gap-1 font-mono">
                    <kbd className="text-ui-xs bg-surface border-border rounded-sm border px-1 py-px">
                        ⌘
                    </kbd>
                    <kbd className="text-ui-xs bg-surface border-border rounded-sm border px-1 py-px">
                        E
                    </kbd>
                    <span className="ml-1">to toggle</span>
                </div>
                <button
                    className="text-ui-sm text-accent border-accent-dim hover:bg-accent-surface rounded-sm border bg-transparent px-2 py-0.5 font-mono tracking-[0.04em] transition-colors"
                    onClick={dismissModeTooltip}
                >
                    Got it
                </button>
            </div>
        </div>
    );
}

export default ModeToggleTooltip;
