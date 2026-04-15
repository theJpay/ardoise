import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";

export type EditorMode = "edit" | "preview";

const VALID_MODES: string[] = ["edit", "preview"];

export function useEditorMode() {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawMode = searchParams.get("mode");
    const mode: EditorMode = rawMode === "preview" ? "preview" : "edit";

    useCleanInvalidMode(rawMode);

    const setMode = useCallback(
        (newMode: EditorMode) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (newMode === "edit") {
                    next.delete("mode");
                } else {
                    next.set("mode", newMode);
                }
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

function useCleanInvalidMode(rawMode: string | null) {
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (rawMode !== null && !VALID_MODES.includes(rawMode)) {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete("mode");
                return next;
            });
        }
    }, [rawMode, setSearchParams]);
}
