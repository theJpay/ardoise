import { BookOpen, PenLine } from "lucide-react";
import { useRef } from "react";

import { useEditorMode } from "@hooks/useEditorMode";

import ModeToggleTooltip from "./ModeToggleTooltip";

type EditorModeTogglerProps = {
    disabled?: boolean;
};

function EditorModeToggler({ disabled }: EditorModeTogglerProps) {
    const { mode, toggleMode } = useEditorMode();
    const containerRef = useRef<HTMLDivElement>(null);

    const buttonClass = (isActive: boolean) =>
        `flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 disabled:bg-transparent disabled:text-dim ${
            isActive
                ? "bg-accent-surface text-accent hover:bg-accent-surface-hover"
                : "text-subtle hover:bg-elevated hover:text-muted"
        }`;

    return (
        <>
            <div
                ref={containerRef}
                className="bg-surface border-border-soft flex flex-col gap-0.5 rounded-lg border p-1"
            >
                <button
                    aria-label="Write mode"
                    className={buttonClass(mode === "edit")}
                    disabled={disabled}
                    onClick={toggleMode}
                >
                    <PenLine aria-hidden="true" size={15} strokeWidth={1.5} />
                </button>
                <button
                    aria-label="Preview mode"
                    className={buttonClass(mode === "preview")}
                    disabled={disabled}
                    onClick={toggleMode}
                >
                    <BookOpen aria-hidden="true" size={15} strokeWidth={1.5} />
                </button>
            </div>
            {!disabled && <ModeToggleTooltip anchorRef={containerRef} />}
        </>
    );
}

export default EditorModeToggler;
