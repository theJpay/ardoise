import { BookOpen, PenLine } from "lucide-react";
import { useEditorActions, useEditorMode } from "@stores/editor.store";

function EditorModeToggler() {
    const mode = useEditorMode();
    const { toggleMode } = useEditorActions();

    return (
        <div className="flex flex-col gap-px p-0.5 bg-surface rounded-lg">
            <button
                onClick={toggleMode}
                aria-label="Write mode"
                className={`w-6.5 h-6.5 rounded-md flex items-center justify-center transition-colors duration-100 ${
                    mode === "edit" ? "bg-accent-glow text-accent" : "text-subtle hover:text-muted"
                }`}
            >
                <PenLine size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
                onClick={toggleMode}
                aria-label="Preview mode"
                className={`w-6.5 h-6.5 rounded-md flex items-center justify-center transition-colors duration-100 ${
                    mode === "preview"
                        ? "bg-accent-glow text-accent"
                        : "text-subtle hover:text-muted"
                }`}
            >
                <BookOpen size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
        </div>
    );
}

export default EditorModeToggler;
