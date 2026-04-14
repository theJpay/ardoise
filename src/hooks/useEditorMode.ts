import { useCallback } from "react";
import { useSearchParams } from "react-router";

export type EditorMode = "edit" | "preview";

export function useEditorMode() {
    const [searchParams, setSearchParams] = useSearchParams();

    const mode: EditorMode = searchParams.get("mode") === "preview" ? "preview" : "edit";

    const setMode = useCallback(
        (newMode: EditorMode) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("mode", newMode);
                return next;
            });
        },
        [setSearchParams]
    );

    const toggleMode = useCallback(() => {
        setMode(mode === "edit" ? "preview" : "edit");
    }, [mode, setMode]);

    return { mode, setMode, toggleMode };
}
