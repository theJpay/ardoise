import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";

import { useSettingsQuery } from "@queries/useSettingsQuery";

export type EditorMode = "edit" | "preview";

const VALID_MODES: string[] = ["edit", "preview"] satisfies EditorMode[];

export function useEditorMode() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { settings } = useSettingsQuery();

    const rawMode = searchParams.get("mode");
    const mode: EditorMode =
        rawMode === "preview" ? "preview" : rawMode === "edit" ? "edit" : settings.defaultMode;

    useCleanInvalidMode(rawMode);

    const setMode = useCallback(
        (newMode: EditorMode) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (newMode === settings.defaultMode) {
                    next.delete("mode");
                } else {
                    next.set("mode", newMode);
                }
                return next;
            });
        },
        [setSearchParams, settings.defaultMode]
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
