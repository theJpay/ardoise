import { BookOpen, PenLine } from "lucide-react";
import { useRef } from "react";

import { useEditorMode } from "@hooks/useEditorMode";

import ModeToggleTooltip from "./ModeToggleTooltip";

function EditorModeToggler() {
    const { mode, toggleMode } = useEditorMode();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div
                ref={containerRef}
                className="bg-surface border-border-soft flex flex-col gap-0.5 rounded-lg border p-1"
            >
                <button
                    aria-label="Write mode"
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                        mode === "edit"
                            ? "bg-accent-surface text-accent hover:bg-accent-surface-hover"
                            : "text-subtle hover:bg-elevated hover:text-muted"
                    }`}
                    onClick={toggleMode}
                >
                    <PenLine aria-hidden="true" size={15} strokeWidth={1.5} />
                </button>
                <button
                    aria-label="Preview mode"
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                        mode === "preview"
                            ? "bg-accent-surface text-accent hover:bg-accent-surface-hover"
                            : "text-subtle hover:bg-elevated hover:text-muted"
                    }`}
                    onClick={toggleMode}
                >
                    <BookOpen aria-hidden="true" size={15} strokeWidth={1.5} />
                </button>
            </div>
            <ModeToggleTooltip anchorRef={containerRef} />
        </>
    );
}

export default EditorModeToggler;
