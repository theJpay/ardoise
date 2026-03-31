import { BookOpen, PenLine } from "lucide-react";

import { useEditorActions, useEditorMode } from "@stores/editor.store";

function EditorModeToggler() {
    const mode = useEditorMode();
    const { toggleMode } = useEditorActions();

    return (
        <div className="bg-surface border-border-soft flex flex-col gap-0.5 rounded-lg border p-1">
            <button
                aria-label="Write mode"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                    mode === "edit"
                        ? "bg-accent-glow text-accent"
                        : "text-dim hover:bg-elevated hover:text-muted"
                }`}
                onClick={toggleMode}
            >
                <PenLine aria-hidden="true" size={15} strokeWidth={1.5} />
            </button>
            <button
                aria-label="Preview mode"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                    mode === "preview"
                        ? "bg-accent-glow text-accent"
                        : "text-dim hover:bg-elevated hover:text-muted"
                }`}
                onClick={toggleMode}
            >
                <BookOpen aria-hidden="true" size={15} strokeWidth={1.5} />
            </button>
        </div>
    );
}

export default EditorModeToggler;
