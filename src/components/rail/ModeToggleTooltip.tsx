import { ArrowBigUp, Command } from "lucide-react";

import { Popover, ShortcutKey } from "@components/generics";
import { useOnboardingActions, useShowModeTooltip } from "@stores/onboarding.store";

import type { RefObject } from "react";

type ModeToggleTooltipProps = {
    anchorRef: RefObject<HTMLDivElement | null>;
};

function ModeToggleTooltip({ anchorRef }: ModeToggleTooltipProps) {
    const visible = useShowModeTooltip();
    const { dismissModeTooltip } = useOnboardingActions();

    return (
        <Popover
            anchor={{ type: "element", ref: anchorRef }}
            className="max-w-65 rounded-md px-3.5 py-3"
            closeOnClickOutside={false}
            closeOnEscape={false}
            offset={12}
            open={visible}
            placement="right"
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
        </Popover>
    );
}

export default ModeToggleTooltip;
