import { ArrowBigUp, Command } from "lucide-react";

import { ShortcutKey } from "@components/generics";
import { useFloatingMenu } from "@hooks/useFloatingMenu";
import { useOnboardingActions, useShowModeTooltip } from "@stores/onboarding.store";

import type { RefObject } from "react";

type ModeToggleTooltipProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
};

function ModeToggleTooltip({ anchorRef }: ModeToggleTooltipProps) {
    const visible = useShowModeTooltip();
    const { dismissModeTooltip } = useOnboardingActions();
    const { refs, floatingStyles } = useFloatingMenu({
        anchor: { type: "element", ref: anchorRef },
        placement: "right",
        offset: 12
    });

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={refs.setFloating}
            className="bg-elevated border-border shadow-float duration-base z-50 max-w-65 rounded-md border px-3.5 py-3 transition-opacity ease-out"
            style={floatingStyles}
        >
            <div className="text-ui-base text-text mb-1 font-medium">
                Switch between Write and Read
            </div>
            <div className="text-ui-sm text-muted font-mono">
                Write mode for editing raw markdown. Read mode for distraction-free reading.
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-ui-sm text-subtle flex items-center gap-1 font-mono">
                    <ShortcutKey content={Command} />
                    <ShortcutKey content={ArrowBigUp} />
                    <ShortcutKey content="M" />
                    <span>to toggle</span>
                </div>
                <button
                    className="text-ui-sm text-accent border-accent-dim hover:bg-accent-surface duration-fast rounded-sm border bg-transparent px-2 py-0.5 font-mono tracking-[0.04em] transition-colors"
                    onClick={dismissModeTooltip}
                >
                    Got it
                </button>
            </div>
        </div>
    );
}

export default ModeToggleTooltip;
