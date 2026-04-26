import { Code, Heading1, Heading2, Heading3, Quote } from "lucide-react";
import { Fragment } from "react";

import { ACTIONS } from "@editor/engine";

import type { ActionName } from "@editor/engine";

const TOOLBAR_GROUPS = [
    ["heading-1", "heading-2", "heading-3"],
    ["code-block", "quote"]
] as const satisfies readonly (readonly ActionName[])[];

type ToolbarName = (typeof TOOLBAR_GROUPS)[number][number];

const ICONS: Record<ToolbarName, React.ReactNode> = {
    "heading-1": <Heading1 size={14} strokeWidth={1.5} />,
    "heading-2": <Heading2 size={14} strokeWidth={1.5} />,
    "heading-3": <Heading3 size={14} strokeWidth={1.5} />,
    "code-block": <Code size={14} strokeWidth={1.5} />,
    quote: <Quote size={14} strokeWidth={1.5} />
};

type ToolbarProps = {
    isActive: (actionName: ActionName) => boolean;
    onAction: (actionName: ActionName) => void;
};

function Toolbar({ isActive, onAction }: ToolbarProps) {
    return (
        <div className="border-border-soft flex h-10 shrink-0 items-center gap-0.5 border-b px-5">
            {TOOLBAR_GROUPS.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="bg-border-soft mx-1 h-4 w-px" />}
                    {group.map((name) => (
                        <button
                            key={name}
                            aria-label={ACTIONS[name].label}
                            className={`duration-fast flex h-7 w-7 items-center justify-center rounded transition-colors ${
                                isActive(name)
                                    ? "text-accent bg-accent-surface hover:bg-accent-surface-hover"
                                    : "text-subtle hover:bg-surface hover:text-muted"
                            }`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onAction(name);
                            }}
                        >
                            {ICONS[name]}
                        </button>
                    ))}
                </Fragment>
            ))}
        </div>
    );
}

export default Toolbar;
