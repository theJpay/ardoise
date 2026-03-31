import { BookOpen, PenLine } from "lucide-react";
import { useEditorActions, useEditorMode } from "@stores/editor.store";

function EditorModeToggler() {
    const mode = useEditorMode();
    const { toggleMode } = useEditorActions();

    return (
        <div className="bg-surface border-border-soft flex flex-col gap-0.5 rounded-lg border p-1">
            <button
                onClick={toggleMode}
                aria-label="Write mode"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                    mode === "edit"
                        ? "bg-accent-glow text-accent"
                        : "text-dim hover:bg-elevated hover:text-muted"
                }`}
            >
                <PenLine size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
                onClick={toggleMode}
                aria-label="Preview mode"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
                    mode === "preview"
                        ? "bg-accent-glow text-accent"
                        : "text-dim hover:bg-elevated hover:text-muted"
                }`}
            >
                <BookOpen size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
        </div>
    );
}

export default EditorModeToggler;
